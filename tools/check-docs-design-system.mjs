import { readFile, readdir } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Guards the documentation-site design system (projects/docs/DESIGN_SYSTEM.md):
 * - no inline `style="…"` attributes in templates (use a component or primitive);
 * - no colour literals outside styles/tokens.css (use --docs-* or daisyUI --color-* tokens);
 * - site tokens never define `--zd-*` (reserved for the library's public API) or `--color-*`.
 *
 * Test fixtures under app/testing are exempt: they exercise library components, not the site.
 */

const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\(/gi;
const STYLE_ATTRIBUTE = /\sstyle="[^"]*"/g;
const TOKEN_DEFINITION = /(--(?:zd|color)-[\w-]+)\s*:/g;
const ALLOWED_COLOR_LINES = [/box-shadow/, /--docs-shadow/, /--docs-backdrop/];

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

/** Returns human-readable violations for one source file. */
export function designSystemViolations(path, contents) {
  const violations = [];
  const isTokens = path.endsWith('styles/tokens.css');
  const lines = contents.split('\n');

  lines.forEach((line, index) => {
    const where = `${path}:${index + 1}`;
    if (extname(path) === '.ts' && STYLE_ATTRIBUTE.test(line)) {
      violations.push(`${where} uses an inline style attribute`);
    }
    STYLE_ATTRIBUTE.lastIndex = 0;

    if (!isTokens && !ALLOWED_COLOR_LINES.some(rule => rule.test(line))) {
      const matches = line.match(COLOR_LITERAL);
      if (matches && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        violations.push(`${where} uses a colour literal (${matches[0]}); use a token`);
      }
    }

    for (const match of line.matchAll(TOKEN_DEFINITION)) {
      violations.push(`${where} defines ${match[1]}; site tokens must use --docs-*`);
    }
  });

  return violations;
}

export async function checkDocsDesignSystem(root) {
  const source = resolve(root, 'projects/docs/src');
  const files = (await listFiles(source)).filter(
    path =>
      ['.ts', '.css'].includes(extname(path)) &&
      !path.includes('/app/testing/') &&
      !path.endsWith('.spec.ts'),
  );
  const violations = [];
  for (const path of files) {
    violations.push(...designSystemViolations(relative(root, path), await readFile(path, 'utf8')));
  }
  return { files: files.length, violations };
}

async function main() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const { files, violations } = await checkDocsDesignSystem(root);
  if (violations.length > 0) {
    throw new Error(`Documentation design-system check failed:\n- ${violations.join('\n- ')}`);
  }
  console.log(`Documentation design-system check passed for ${files} files.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
