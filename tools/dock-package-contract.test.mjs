import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Dock packages native Router navigation, safe-area and motion rules without a tab/menu runtime', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-dock.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /RouterLinkActive/);
  assert.match(bundle, /safe-area-inset-bottom/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.doesNotMatch(bundle, /@angular\/aria|role: "tab"|role: "menuitem"/);
});
