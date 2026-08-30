import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkPackageBudgets, formatResults } from './check-package-budgets.mjs';

async function createPackageFixture({ primary = 'root', testing = 'test helpers' } = {}) {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'zordon-budgets-'));
  const outputDirectory = join(workspaceRoot, 'dist', 'components');
  const fesmDirectory = join(outputDirectory, 'fesm2022');
  const auraDirectory = join(outputDirectory, 'aura');
  await mkdir(fesmDirectory, { recursive: true });
  await mkdir(auraDirectory, { recursive: true });
  await writeFile(join(fesmDirectory, 'root.mjs'), primary);
  await writeFile(join(fesmDirectory, 'testing.mjs'), testing);
  await writeFile(join(auraDirectory, 'aura-motion.css'), '/* CSS asset, not a runtime module. */');
  await writeFile(
    join(outputDirectory, 'package.json'),
    JSON.stringify({
      exports: {
        './aura/aura-motion.css': './aura/aura-motion.css',
        './package.json': { default: './package.json' },
        '.': { default: './fesm2022/root.mjs' },
        './testing': { default: './fesm2022/testing.mjs' },
      },
    }),
  );

  return workspaceRoot;
}

test('checks the primary export and applies an optional-entry-point override', async () => {
  const workspaceRoot = await createPackageFixture();
  await writeFile(
    join(workspaceRoot, 'budgets.json'),
    JSON.stringify({
      outputDirectory: 'dist/components',
      primary: { maximumRawBytes: 100, maximumGzipBytes: 100 },
      secondary: { maximumRawBytes: 1, maximumGzipBytes: 1 },
      overrides: {
        './testing': { maximumRawBytes: 100, maximumGzipBytes: 100 },
      },
    }),
  );

  const result = await checkPackageBudgets({ workspaceRoot, configPath: 'budgets.json' });

  assert.deepEqual(
    result.results.map(entryPoint => entryPoint.entryPoint),
    ['.', './testing'],
  );
  assert.equal(result.violations.length, 0);
  const report = formatResults(result.results);
  assert.doesNotMatch(report, /,/);
  assert.match(report, /^\.\s+4 B\s+100 B\s+\d+ B\s+100 B$/m);
});

test('ignores non-runtime asset exports when measuring JavaScript bundles', async () => {
  const workspaceRoot = await createPackageFixture();
  await writeFile(
    join(workspaceRoot, 'budgets.json'),
    JSON.stringify({
      outputDirectory: 'dist/components',
      primary: { maximumRawBytes: 100, maximumGzipBytes: 100 },
      secondary: { maximumRawBytes: 100, maximumGzipBytes: 100 },
    }),
  );

  const result = await checkPackageBudgets({ workspaceRoot, configPath: 'budgets.json' });

  assert.deepEqual(
    result.results.map(entryPoint => entryPoint.entryPoint),
    ['.', './testing'],
  );
  assert.equal(result.violations.length, 0);
});

test('reports raw and gzip budget violations', async () => {
  const workspaceRoot = await createPackageFixture({
    primary: 'content that is intentionally too large for either budget',
  });
  await writeFile(
    join(workspaceRoot, 'budgets.json'),
    JSON.stringify({
      outputDirectory: 'dist/components',
      primary: { maximumRawBytes: 1, maximumGzipBytes: 1 },
      secondary: { maximumRawBytes: 100, maximumGzipBytes: 100 },
    }),
  );

  const result = await checkPackageBudgets({ workspaceRoot, configPath: 'budgets.json' });

  assert.equal(result.violations.length, 2);
  assert.match(result.violations[0], /raw size/);
  assert.match(result.violations[1], /gzip size/);
});
