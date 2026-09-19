import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Toast reuses packaged Alert and owns local announcements without a second overlay runtime', async () => {
  const [bundle, manifest] = await Promise.all(
    ['dist/components/fesm2022/pranxy-zordon-ui-toast.mjs', 'dist/components/package.json'].map(
      path => readFile(new URL('../' + path, import.meta.url), 'utf8'),
    ),
  );
  assert.match(bundle, /@pranxy\/zordon-ui\/alert/);
  assert.doesNotMatch(bundle, /class ZdAlert|LiveAnnouncer|OverlayContainer/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.ok(JSON.parse(manifest).exports['./toast']);
});
