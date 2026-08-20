import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { assertApiReportsMatch } from './check-api-report.mjs';

const workspaceRoot = resolve(import.meta.dirname, '..');

async function readWorkspaceFile(path) {
  return readFile(resolve(workspaceRoot, path), 'utf8');
}

test('tracks the built primary declaration surface without rewriting package declarations', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor.json'));

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(config.compiler.tsconfigFilePath, '<projectFolder>/tsconfig.lib.prod.json');
  assert.equal(config.apiReport.reportFolder, '<projectFolder>/../../etc/api');
  assert.equal(config.apiReport.reportTempFolder, '<projectFolder>/../../temp/api-extractor');
  assert.deepEqual(config.apiReport.reportVariants, ['complete']);
  assert.equal(config.docModel.enabled, false);
  assert.equal(config.dtsRollup.enabled, false);
  assert.equal(config.tsdocMetadata.enabled, false);
});

test('tracks the built Button secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-button.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-button.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-button.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-button.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-button');
  assert.match(report, /export class ZdButton/);
  assert.match(report, /export function withButtonDefaults/);
});

test('tracks the built Link secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-link.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-link.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-link.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-link.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-link');
  assert.match(report, /export class ZdLink/);
  assert.match(report, /export function withLinkDefaults/);
});

test('commits the generated primary API report and exposes check/update scripts', async () => {
  const [report, manifest, workflow] = await Promise.all([
    readWorkspaceFile('etc/api/zordon-ui.api.md'),
    readWorkspaceFile('package.json'),
    readWorkspaceFile('.github/workflows/ci.yml'),
  ]);
  const scripts = JSON.parse(manifest).scripts;

  assert.match(report, /API Report File for "zordon-ui"/);
  assert.match(report, /export function provideZordonUi/);
  assert.match(report, /export class ZdTheme/);
  assert.match(scripts['check:api'], /node tools\/check-api-report\.mjs/);
  assert.match(scripts['update:api'], /api-extractor-button\.json.*--local/);
  assert.match(scripts['update:api'], /api-extractor-link\.json.*--local/);
  assert.match(scripts['test:api'], /build:lib.*check:api/);
  assert.match(workflow, /name: Check public API report\s+run: npm run check:api/);
});

test('rejects API report drift even when API Extractor reports it as a warning', () => {
  assert.doesNotThrow(() => assertApiReportsMatch('reviewed', 'reviewed'));
  assert.doesNotThrow(() => assertApiReportsMatch('reviewed\r\nreport', 'reviewed\nreport'));
  assert.throws(
    () => assertApiReportsMatch('reviewed', 'changed'),
    /Public API report differs from the reviewed baseline/,
  );
});
