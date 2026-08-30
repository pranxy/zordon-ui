import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultConfigPath = 'bundle-size-budgets.json';

function assertBudget(name, budget) {
  for (const property of ['maximumRawBytes', 'maximumGzipBytes']) {
    if (!Number.isSafeInteger(budget?.[property]) || budget[property] <= 0) {
      throw new Error(`${name}.${property} must be a positive integer.`);
    }
  }
}

function getRuntimeExportTarget(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  for (const condition of ['default', 'import', 'module']) {
    const target = getRuntimeExportTarget(value[condition]);
    if (target) {
      return target;
    }
  }

  return undefined;
}

function resolveInside(directory, target) {
  const resolved = resolve(directory, target);
  const pathFromDirectory = relative(directory, resolved);

  if (pathFromDirectory.startsWith('..') || resolve(directory, pathFromDirectory) !== resolved) {
    throw new Error(`Export target resolves outside the package output: ${target}`);
  }

  return resolved;
}

export function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(2)} KiB`;
}

export async function checkPackageBudgets({
  workspaceRoot = process.cwd(),
  configPath = defaultConfigPath,
} = {}) {
  const absoluteConfigPath = resolve(workspaceRoot, configPath);
  const config = JSON.parse(await readFile(absoluteConfigPath, 'utf8'));

  assertBudget('primary', config.primary);
  assertBudget('secondary', config.secondary);

  for (const [entryPoint, budget] of Object.entries(config.overrides ?? {})) {
    assertBudget(`overrides[${JSON.stringify(entryPoint)}]`, budget);
  }

  const outputDirectory = resolve(workspaceRoot, config.outputDirectory);
  const packageJsonPath = resolveInside(outputDirectory, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const exportsMap = packageJson.exports;

  if (!exportsMap || typeof exportsMap !== 'object' || Array.isArray(exportsMap)) {
    throw new Error(`No package exports found in ${packageJsonPath}. Build the library first.`);
  }

  const results = [];

  for (const [entryPoint, exportValue] of Object.entries(exportsMap)) {
    if (entryPoint === './package.json') {
      continue;
    }

    const target = getRuntimeExportTarget(exportValue);
    if (!target) {
      throw new Error(`No runtime .mjs export found for ${entryPoint}.`);
    }

    if (!target.endsWith('.mjs')) {
      continue;
    }

    const artifactPath = resolveInside(outputDirectory, target);
    const artifact = await readFile(artifactPath);
    const rawBytes = (await stat(artifactPath)).size;
    const gzipBytes = gzipSync(artifact, { level: 9 }).length;
    const budget =
      entryPoint === '.' ? config.primary : (config.overrides?.[entryPoint] ?? config.secondary);

    results.push({
      entryPoint,
      target,
      rawBytes,
      gzipBytes,
      maximumRawBytes: budget.maximumRawBytes,
      maximumGzipBytes: budget.maximumGzipBytes,
    });
  }

  if (!results.some(result => result.entryPoint === '.')) {
    throw new Error('The built package does not expose its primary entry point.');
  }

  const violations = results.flatMap(result => {
    const messages = [];

    if (result.rawBytes > result.maximumRawBytes) {
      messages.push(
        `${result.entryPoint} raw size ${formatBytes(result.rawBytes)} exceeds ${formatBytes(result.maximumRawBytes)}.`,
      );
    }

    if (result.gzipBytes > result.maximumGzipBytes) {
      messages.push(
        `${result.entryPoint} gzip size ${formatBytes(result.gzipBytes)} exceeds ${formatBytes(result.maximumGzipBytes)}.`,
      );
    }

    return messages;
  });

  return { results, violations };
}

export function formatResults(results) {
  const heading = ['Entry point', 'Raw', 'Raw budget', 'Gzip', 'Gzip budget'];
  const rows = results.map(result => [
    result.entryPoint,
    formatBytes(result.rawBytes),
    formatBytes(result.maximumRawBytes),
    formatBytes(result.gzipBytes),
    formatBytes(result.maximumGzipBytes),
  ]);
  const widths = heading.map((value, column) =>
    Math.max(value.length, ...rows.map(row => row[column].length)),
  );
  const renderRow = row =>
    row
      .map((value, column) => value.padEnd(widths[column]))
      .join('  ')
      .trimEnd();

  return [
    renderRow(heading),
    renderRow(widths.map(width => '-'.repeat(width))),
    ...rows.map(renderRow),
  ]
    .join('\n')
    .trim();
}

async function main() {
  const { results, violations } = await checkPackageBudgets();
  console.log(formatResults(results));

  if (violations.length > 0) {
    throw new Error(`Package bundle budget failed:\n- ${violations.join('\n- ')}`);
  }

  console.log(`Package bundle budgets passed for ${results.length} entry point(s).`);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : '';

if (currentFile === invokedFile) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
