import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Radial Progress ships isolated semantics and motion fallbacks without widget dependencies', async () => {
  const [bundle, manifest] = await Promise.all(
    [
      'dist/components/fesm2022/pranxy-zordon-ui-radial-progress.mjs',
      'dist/components/package.json',
    ].map(path => readFile(new URL('../' + path, import.meta.url), 'utf8')),
  );
  assert.doesNotMatch(bundle, /@angular\/(?:aria|cdk)/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.match(bundle, /forced-colors/);
  assert.match(bundle, /zdRadialProgressLabel/);
  assert.match(bundle, /aria-valuenow/);
  assert.ok(JSON.parse(manifest).exports['./radial-progress']);
});
