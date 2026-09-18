import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Modal shares the packaged overlay and lock runtime without leaking CDK consumer types', async () => {
  const [bundle, declarations, manifest] = await Promise.all(
    [
      'dist/components/fesm2022/pranxy-zordon-ui-modal.mjs',
      'dist/components/types/pranxy-zordon-ui-modal.d.ts',
      'dist/components/package.json',
    ].map(path => readFile(new URL('../' + path, import.meta.url), 'utf8')),
  );
  assert.match(bundle, /from ['"]@pranxy\/zordon-ui\/internal-overlay['"]/);
  assert.doesNotMatch(bundle, /class Zd(?:OverlayCoordinator|OverlayStack|BodyScrollLock)/);
  assert.doesNotMatch(declarations, /@angular\/cdk/);
  assert.ok(JSON.parse(manifest).exports['./modal']);
});
