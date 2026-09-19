import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Loading ships embedded static motion fallback without an overlay/widget dependency', async () => {
  const [bundle, manifest] = await Promise.all(
    ['dist/components/fesm2022/pranxy-zordon-ui-loading.mjs', 'dist/components/package.json'].map(
      path => readFile(new URL('../' + path, import.meta.url), 'utf8'),
    ),
  );
  assert.doesNotMatch(bundle, /@angular\/(?:aria|cdk)/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.match(bundle, /forced-colors/);
  assert.match(bundle, /zdLoadingCustom/);
  assert.ok(JSON.parse(manifest).exports['./loading']);
});
