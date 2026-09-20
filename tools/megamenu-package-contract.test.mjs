import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Megamenu composes the shared Dropdown and Aria command bar without duplicating overlay infrastructure', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-megamenu.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@pranxy\/zordon-ui\/dropdown/);
  assert.match(bundle, /@angular\/aria\/menu/);
  assert.match(bundle, /NavigationEnd/);
  assert.match(bundle, /forced-colors/);
  assert.doesNotMatch(bundle, /@angular\/cdk\/overlay|document\.body/);
});
