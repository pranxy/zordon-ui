import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Drawer composes the packaged Modal runtime without duplicating focus, scroll or overlay services', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-drawer.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@pranxy\/zordon-ui\/modal/);
  assert.match(bundle, /safe-area-inset/);
  assert.match(bundle, /pointercancel/);
  assert.doesNotMatch(
    bundle,
    /class ZdModalService|class ZdBodyScrollLock|class ZdOverlayCoordinator|@angular\/cdk\/overlay/,
  );
});
