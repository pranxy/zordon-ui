import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Navbar packages responsive native layout without Router or overlay runtime dependencies', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-navbar.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /safe-area-inset-top/);
  assert.match(bundle, /aria-controls/);
  assert.match(bundle, /48rem/);
  assert.doesNotMatch(
    bundle,
    /@angular\/router|@angular\/aria|@angular\/cdk\/overlay|window\.|document\./,
  );
});
