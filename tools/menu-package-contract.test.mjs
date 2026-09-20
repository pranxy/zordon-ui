import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Menu packages native Router navigation and Aria Tree without a second overlay stack', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-menu.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@angular\/aria\/tree/);
  assert.match(bundle, /RouterLinkActive/);
  assert.match(bundle, /forced-colors/);
  assert.doesNotMatch(bundle, /@angular\/cdk\/overlay|document\.body/);
});
