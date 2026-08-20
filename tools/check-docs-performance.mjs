import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FONT_EXTENSIONS = new Set(['.eot', '.otf', '.ttf', '.woff', '.woff2']);
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

const defaultBudgets = {
  initialWarningBytes: 360 * 1024,
  initialErrorBytes: 400 * 1024,
  maximumImageBytes: 100 * 1024,
  maximumTotalImageBytes: 200 * 1024,
  maximumEmbeddedImageCharacters: 4 * 1024,
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else if (entry.isFile()) files.push(path);
  }

  return files;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1];
}

export function initialAssetReferences(html) {
  const references = new Set();

  for (const tag of html.match(/<(?:link|script)\b[^>]*>/gi) ?? []) {
    const source = attribute(tag, 'src');
    const href = attribute(tag, 'href');
    const relation = attribute(tag, 'rel')?.toLowerCase();

    if (source) references.add(source);
    if (href && (relation === 'stylesheet' || relation === 'modulepreload')) references.add(href);
  }

  return [...references].filter(reference => !reference.startsWith('data:'));
}

export function embeddedImageLengths(contents) {
  const lengths = [];
  let start = contents.indexOf('data:image/');

  while (start !== -1) {
    const opening = contents[start - 1];
    let end;
    if (opening === '"' || opening === "'") {
      end = contents.indexOf(opening, start);
    } else {
      const relativeEnd = contents.slice(start).search(/[)\s>]/);
      end = relativeEnd === -1 ? contents.length : start + relativeEnd;
    }
    lengths.push((end === -1 ? contents.length : end) - start);
    start = contents.indexOf('data:image/', start + 1);
  }

  return lengths;
}

function resolveInside(directory, reference) {
  const path = resolve(directory, reference.replace(/^\//, ''));
  const fromDirectory = relative(directory, path);
  if (fromDirectory.startsWith('..') || resolve(directory, fromDirectory) !== path) {
    throw new Error(`Initial asset resolves outside the docs browser output: ${reference}`);
  }
  return path;
}

export async function checkDocsPerformance({
  workspaceRoot = process.cwd(),
  browserOutput = 'dist/docs/browser',
  budgets = {},
} = {}) {
  const limits = { ...defaultBudgets, ...budgets };
  const outputDirectory = resolve(workspaceRoot, browserOutput);
  const indexPath = resolveInside(outputDirectory, 'index.csr.html');
  const indexHtml = await readFile(indexPath, 'utf8');
  const initialAssets = [];

  for (const reference of initialAssetReferences(indexHtml)) {
    const path = resolveInside(
      outputDirectory,
      new URL(reference, 'https://docs.invalid/').pathname,
    );
    initialAssets.push({ reference, bytes: (await stat(path)).size });
  }

  const initialBytes = initialAssets.reduce((total, asset) => total + asset.bytes, 0);
  const files = await listFiles(outputDirectory);
  const fonts = files.filter(path => FONT_EXTENSIONS.has(extname(path).toLowerCase()));
  const images = await Promise.all(
    files
      .filter(path => IMAGE_EXTENSIONS.has(extname(path).toLowerCase()))
      .map(async path => ({
        path: relative(outputDirectory, path),
        bytes: (await stat(path)).size,
      })),
  );
  const imageBytes = images.reduce((total, image) => total + image.bytes, 0);
  const embeddedImages = [];

  for (const path of files.filter(path =>
    ['.css', '.html'].includes(extname(path).toLowerCase()),
  )) {
    const contents = await readFile(path, 'utf8');
    for (const characters of embeddedImageLengths(contents)) {
      embeddedImages.push({
        path: relative(outputDirectory, path),
        characters,
      });
    }
  }

  const warnings = [];
  const violations = [];
  if (initialBytes > limits.initialWarningBytes) {
    warnings.push(
      `Initial browser assets use ${initialBytes} bytes, above the ${limits.initialWarningBytes}-byte warning budget.`,
    );
  }
  if (initialBytes > limits.initialErrorBytes) {
    violations.push(
      `Initial browser assets use ${initialBytes} bytes, above the ${limits.initialErrorBytes}-byte error budget.`,
    );
  }
  if (fonts.length > 0) {
    violations.push(
      `Bundled font files are not allowed: ${fonts.map(path => relative(outputDirectory, path)).join(', ')}.`,
    );
  }
  for (const image of images) {
    if (image.bytes > limits.maximumImageBytes) {
      violations.push(
        `Image ${image.path} uses ${image.bytes} bytes, above the ${limits.maximumImageBytes}-byte per-image budget.`,
      );
    }
  }
  if (imageBytes > limits.maximumTotalImageBytes) {
    violations.push(
      `Images use ${imageBytes} bytes, above the ${limits.maximumTotalImageBytes}-byte total budget.`,
    );
  }
  for (const image of embeddedImages) {
    if (image.characters > limits.maximumEmbeddedImageCharacters) {
      violations.push(
        `Embedded image in ${image.path} uses ${image.characters} characters, above the ${limits.maximumEmbeddedImageCharacters}-character budget.`,
      );
    }
  }

  return { embeddedImages, fonts, images, initialAssets, initialBytes, warnings, violations };
}

async function main() {
  const result = await checkDocsPerformance();
  console.log(`Initial browser assets: ${result.initialBytes} bytes`);
  for (const asset of result.initialAssets)
    console.log(`- ${asset.reference}: ${asset.bytes} bytes`);
  console.log(
    `Bundled fonts: ${result.fonts.length}; images: ${result.images.length}; embedded images: ${result.embeddedImages.length}`,
  );
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
  if (result.violations.length > 0) {
    throw new Error(
      `Documentation performance policy failed:\n- ${result.violations.join('\n- ')}`,
    );
  }
  console.log('Documentation performance policy passed.');
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && currentFile === resolve(process.argv[1])) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
