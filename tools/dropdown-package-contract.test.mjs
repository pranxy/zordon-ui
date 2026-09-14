import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');

test('built Dropdown imports one overlay bridge without duplicating its stack in the component or primary bundle', async () => {
  const [dropdown, bridge, primary, declarations, manifest] = await Promise.all(
    [
      'dist/components/fesm2022/pranxy-zordon-ui-dropdown.mjs',
      'dist/components/fesm2022/pranxy-zordon-ui-internal-overlay.mjs',
      'dist/components/fesm2022/pranxy-zordon-ui.mjs',
      'dist/components/types/pranxy-zordon-ui-dropdown.d.ts',
      'dist/components/package.json',
    ].map(path => readFile(resolve(root, path), 'utf8')),
  );
  assert.match(dropdown, /from ['"]@pranxy\/zordon-ui\/internal-overlay['"]/);
  assert.doesNotMatch(dropdown, /class ZdOverlay(?:Coordinator|Stack)/);
  assert.doesNotMatch(primary, /class ZdOverlay(?:Coordinator|Stack)/);
  assert.equal((bridge.match(/class ZdOverlayCoordinator\s/g) ?? []).length, 1);
  assert.equal((bridge.match(/class ZdOverlayStack\s/g) ?? []).length, 1);
  assert.ok(JSON.parse(manifest).exports['./internal-overlay']);
  assert.ok(JSON.parse(manifest).exports['./dropdown']);
  assert.doesNotMatch(
    declarations,
    /(?:InputSignal|OutputEmitterRef)<[^;\n]*(?:MenuItem|MenuTrigger|OverlayRef|ZdOverlayHandle)/,
  );
});
