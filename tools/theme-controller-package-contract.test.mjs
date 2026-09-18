import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Theme Controller ships an isolated native secondary entry without widget dependencies', async () => {
  const [bundle, declarations, manifest] = await Promise.all(
    [
      'dist/components/fesm2022/pranxy-zordon-ui-theme-controller.mjs',
      'dist/components/types/pranxy-zordon-ui-theme-controller.d.ts',
      'dist/components/package.json',
    ].map(path => readFile(new URL('../' + path, import.meta.url), 'utf8')),
  );
  assert.doesNotMatch(bundle, /@angular\/(?:aria|cdk)/);
  assert.doesNotMatch(bundle, /daisyUi\(['"]theme-controller/);
  assert.match(declarations, /class ZdThemeControllerState/);
  assert.match(declarations, /class ZdThemeSelect/);
  assert.ok(JSON.parse(manifest).exports['./theme-controller']);
});
