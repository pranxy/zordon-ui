import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  checkDocsPerformance,
  embeddedImageLengths,
  initialAssetReferences,
} from './check-docs-performance.mjs';

async function createOutput() {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'zordon-docs-performance-'));
  const output = join(workspaceRoot, 'dist', 'docs', 'browser');
  await mkdir(output, { recursive: true });
  await writeFile(
    join(output, 'index.csr.html'),
    '<link rel="stylesheet" href="styles.css"><link rel="modulepreload" href="shared.js"><script src="main.js"></script>',
  );
  await writeFile(join(output, 'styles.css'), 'body{}');
  await writeFile(join(output, 'shared.js'), 'shared');
  await writeFile(join(output, 'main.js'), 'main');
  return { output, workspaceRoot };
}

test('discovers initial styles, module preloads, and scripts once', () => {
  assert.deepEqual(
    initialAssetReferences(
      '<link href="a.css" rel="stylesheet"><link rel="modulepreload" href="a.js"><script src="a.js"></script>',
    ),
    ['a.css', 'a.js'],
  );
});

test('measures an embedded image through quotes inside its encoded payload', () => {
  const payload = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E`;
  assert.deepEqual(embeddedImageLengths(`background:url("${payload}")`), [payload.length]);
});

test('accepts a docs build within browser, font, and image policy', async () => {
  const { output, workspaceRoot } = await createOutput();
  await writeFile(join(output, 'small.svg'), '<svg/>');

  const result = await checkDocsPerformance({
    workspaceRoot,
    budgets: {
      initialWarningBytes: 100,
      initialErrorBytes: 100,
      maximumImageBytes: 100,
      maximumTotalImageBytes: 100,
    },
  });

  assert.equal(result.initialBytes, 16);
  assert.deepEqual(result.violations, []);
});

test('reports initial asset, font, and conservative image violations', async () => {
  const { output, workspaceRoot } = await createOutput();
  await writeFile(join(output, 'font.woff2'), 'font');
  await writeFile(join(output, 'large.png'), 'large image');

  const result = await checkDocsPerformance({
    workspaceRoot,
    budgets: {
      initialWarningBytes: 1,
      initialErrorBytes: 1,
      maximumImageBytes: 1,
      maximumTotalImageBytes: 1,
    },
  });

  assert.equal(result.warnings.length, 1);
  assert.equal(result.violations.length, 4);
  assert.match(result.violations.join('\n'), /Initial browser assets/);
  assert.match(result.violations.join('\n'), /Bundled font files/);
  assert.match(result.violations.join('\n'), /per-image budget/);
  assert.match(result.violations.join('\n'), /total budget/);
});
