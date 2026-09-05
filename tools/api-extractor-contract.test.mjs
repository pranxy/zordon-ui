import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { apiReports, assertApiReportsMatch } from './check-api-report.mjs';

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

test('tracks the built Aura secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-aura.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-aura.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-aura.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-aura.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-aura');
  assert.match(report, /export class ZdAura/);
  assert.match(report, /export type ZdAuraSize/);
  assert.match(report, /export type ZdAuraVariant/);
  assert.doesNotMatch(report, /resolveAura/);
});

test('tracks the built Badge secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-badge.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-badge.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-badge.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-badge.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-badge');
  assert.match(report, /export class ZdBadge/);
  assert.match(report, /export type ZdBadgeColor/);
  assert.match(report, /export type ZdBadgeSize/);
  assert.match(report, /export type ZdBadgeStyle/);
  assert.doesNotMatch(report, /resolveBadge/);
});

test('declares the Aura reduced-motion stylesheet as a side-effectful package export', async () => {
  const manifest = JSON.parse(await readWorkspaceFile('projects/components/package.json'));
  const stylesheet = await readWorkspaceFile('projects/components/aura/src/aura-motion.css');

  assert.equal(manifest.exports['./aura/aura-motion.css'], './aura/aura-motion.css');
  assert.deepEqual(manifest.sideEffects, ['./aura/aura-motion.css']);
  assert.match(stylesheet, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(stylesheet, /\[data-zd-aura\]::before/);
  assert.match(stylesheet, /animation: none !important/);
});

test('tracks the built Avatar secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-avatar.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-avatar.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-avatar.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-avatar.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-avatar');
  assert.match(report, /export class ZdAvatar/);
  assert.match(report, /export class ZdAvatarGroup/);
  assert.match(report, /export type ZdAvatarPresence/);
  assert.doesNotMatch(report, /resolveAvatarPresence/);
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

test('tracks the built Divider secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-divider.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-divider.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-divider.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-divider.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-divider');
  assert.match(report, /export class ZdDivider/);
  assert.match(report, /export function withDividerDefaults/);
});

test('tracks the built Fieldset secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-fieldset.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-fieldset.api.md');
  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-fieldset.d.ts',
  );
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-fieldset.json',
  );
  assert.match(report, /export class ZdFieldset/);
  assert.match(report, /export class ZdFieldsetLegend/);
  assert.match(report, /export class ZdFieldsetLabel/);
});

test('tracks the built Label secondary declaration surface with its own report', async () => {
  const config = JSON.parse(await readWorkspaceFile('tools/api-extractor-label.json'));
  const report = await readWorkspaceFile('etc/api/zordon-ui-label.api.md');

  assert.equal(
    config.mainEntryPointFilePath,
    '<projectFolder>/../../dist/components/types/pranxy-zordon-ui-label.d.ts',
  );
  assert.equal(config.projectFolder, '../projects/components');
  assert.equal(
    config.compiler.tsconfigFilePath,
    '<projectFolder>/tsconfig.api-extractor-label.json',
  );
  assert.equal(config.apiReport.reportFileName, 'zordon-ui-label');
  assert.match(report, /export class ZdLabel/);
  assert.match(report, /export class ZdFloatingLabel/);
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
  assert.equal(scripts['check:api'], 'node tools/check-api-report.mjs check');
  assert.equal(scripts['update:api'], 'node tools/check-api-report.mjs update');
  assert.deepEqual(
    apiReports.map(report => report.configPath.split(/[/\\]/).at(-1)),
    [
      'api-extractor-aura.json',
      'api-extractor-avatar.json',
      'api-extractor-badge.json',
      'api-extractor-card.json',
      'api-extractor-carousel.json',
      'api-extractor-collapse.json',
      'api-extractor-chat-bubble.json',
      'api-extractor-kbd.json',
      'api-extractor.json',
      'api-extractor-button.json',
      'api-extractor-divider.json',
      'api-extractor-fieldset.json',
      'api-extractor-label.json',
      'api-extractor-link.json',
      'api-extractor-stat.json',
      'api-extractor-status.json',
      'api-extractor-countdown.json',
      'api-extractor-diff.json',
      'api-extractor-hover-3d.json',
      'api-extractor-hover-gallery.json',
      'api-extractor-list.json',
      'api-extractor-table.json',
      'api-extractor-text-rotate.json',
      'api-extractor-timeline.json',
      'api-extractor-stack.json',
      'api-extractor-footer.json',
    ],
  );
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
