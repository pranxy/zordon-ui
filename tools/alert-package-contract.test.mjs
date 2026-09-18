import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Alert ships native inline semantics without overlay or Aria widget dependencies', async () => {
  const [bundle, manifest] = await Promise.all(
    ['dist/components/fesm2022/pranxy-zordon-ui-alert.mjs', 'dist/components/package.json'].map(
      path => readFile(new URL('../' + path, import.meta.url), 'utf8'),
    ),
  );
  assert.doesNotMatch(bundle, /@angular\/(?:cdk|aria)/);
  assert.match(bundle, /zdAlertTitle/);
  assert.match(bundle, /zdAlertDetails/);
  assert.ok(JSON.parse(manifest).exports['./alert']);
});
