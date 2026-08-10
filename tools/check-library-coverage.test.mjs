import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';

import {
  findImplementationFiles,
  findLibraryImplementationFiles,
  hasCoverableRuntime,
  validateCoverageReport,
} from './check-library-coverage.mjs';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true })),
  );
});

function coverageFor(filePath, statementCounts = { 0: 1 }) {
  return {
    [filePath]: {
      path: filePath,
      statementMap: Object.fromEntries(
        Object.keys(statementCounts).map(key => [key, { start: {}, end: {} }]),
      ),
      s: statementCounts,
      branchMap: {},
      b: {},
      fnMap: {},
      f: {},
    },
  };
}

test('accepts the explicit no-implementation bootstrap state', () => {
  assert.deepEqual(validateCoverageReport({ coverage: {}, implementationFiles: [] }), {
    status: 'not-applicable',
    files: 0,
  });
  assert.deepEqual(
    validateCoverageReport({
      coverage: coverageFor('/repo/src/public-api.ts', {}),
      implementationFiles: [],
    }),
    { status: 'not-applicable', files: 0 },
  );
});

test('rejects executable report entries that runtime source detection does not account for', () => {
  assert.throws(
    () =>
      validateCoverageReport({
        coverage: coverageFor('/repo/src/unexpected.ts'),
        implementationFiles: [],
      }),
    /unexpected runtime file/,
  );
});

test('rejects an empty report when implementation files exist', () => {
  assert.throws(
    () => validateCoverageReport({ coverage: {}, implementationFiles: ['/repo/src/button.ts'] }),
    /empty while eligible implementation files exist/,
  );
});

test('rejects implementation files missing from a nonempty report', () => {
  assert.throws(
    () =>
      validateCoverageReport({
        coverage: coverageFor('/repo/src/other.ts'),
        implementationFiles: ['/repo/src/button.ts'],
      }),
    /does not measure/,
  );
});

test('rejects files with no executable statements', () => {
  const filePath = path.resolve('projects/components/src/empty.ts');
  assert.throws(
    () =>
      validateCoverageReport({
        coverage: coverageFor(filePath, {}),
        implementationFiles: [filePath],
      }),
    /no executable statements/,
  );
});

test('rejects files whose executable statements are all uncovered', () => {
  const filePath = path.resolve('projects/components/src/uncovered.ts');
  assert.throws(
    () =>
      validateCoverageReport({
        coverage: coverageFor(filePath, { 0: 0, 1: 0 }),
        implementationFiles: [filePath],
      }),
    /no covered statements/,
  );
});

test('accepts measured implementation files with covered statements', () => {
  const filePath = path.resolve('projects/components/src/covered.ts');
  assert.deepEqual(
    validateCoverageReport({
      coverage: coverageFor(filePath, { 0: 1, 1: 0 }),
      implementationFiles: [filePath],
    }),
    { status: 'measured', files: 1 },
  );
});

test('distinguishes pure module wiring from coverable declarations regardless of filename', () => {
  assert.equal(hasCoverableRuntime('export interface Button { disabled: boolean }'), false);
  assert.equal(hasCoverableRuntime('export type Size = "sm" | "lg";'), false);
  assert.equal(hasCoverableRuntime('export {};'), false);
  assert.equal(hasCoverableRuntime("export * from './button';"), false);
  assert.equal(hasCoverableRuntime("export { Button } from './button';"), false);
  assert.equal(hasCoverableRuntime("import { Button } from './button'; export { Button };"), false);
  assert.equal(hasCoverableRuntime('declare const injected: boolean;'), false);
  assert.equal(hasCoverableRuntime('export const sizes = ["sm", "lg"] as const;'), true);
  assert.equal(hasCoverableRuntime('export enum Size { Small = "sm" }'), true);
  assert.equal(hasCoverableRuntime('export function helper() { return true; }'), true);
});

test('discovers runtime sources while excluding specs, declarations, and erased type-only files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'zordon-coverage-'));
  temporaryDirectories.push(root);
  await mkdir(path.join(root, 'nested'));

  await Promise.all([
    writeFile(path.join(root, 'button.ts'), 'export const button = true;'),
    writeFile(path.join(root, 'button.spec.ts'), ''),
    writeFile(path.join(root, 'button.d.ts'), ''),
    writeFile(path.join(root, 'erased.types.ts'), 'export interface Erased {}'),
    writeFile(path.join(root, 'runtime.types.ts'), 'export const runtime = true;'),
    writeFile(path.join(root, 'index.ts'), "export * from './button';"),
    writeFile(path.join(root, 'public-api.ts'), 'export const publicRuntime = true;'),
    writeFile(path.join(root, 'nested', 'prefix.ts'), 'export const prefix = true;'),
  ]);

  assert.deepEqual((await findImplementationFiles(root)).sort(), [
    path.resolve(root, 'button.ts'),
    path.resolve(root, 'nested', 'prefix.ts'),
    path.resolve(root, 'public-api.ts'),
    path.resolve(root, 'runtime.types.ts'),
  ]);
});

test('discovers primary and secondary-entry-point sources without reviving legacy folders', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'zordon-package-'));
  temporaryDirectories.push(root);
  await Promise.all([
    mkdir(path.join(root, 'src')),
    mkdir(path.join(root, 'button', 'src'), { recursive: true }),
    mkdir(path.join(root, 'legacy-button')),
  ]);
  await Promise.all([
    writeFile(path.join(root, 'src', 'defaults.ts'), 'export const defaults = true;'),
    writeFile(path.join(root, 'button', 'src', 'button.ts'), 'export const button = true;'),
    writeFile(path.join(root, 'legacy-button', 'button.ts'), 'export const legacy = true;'),
  ]);

  assert.deepEqual((await findLibraryImplementationFiles(root)).sort(), [
    path.resolve(root, 'button', 'src', 'button.ts'),
    path.resolve(root, 'src', 'defaults.ts'),
  ]);
});
