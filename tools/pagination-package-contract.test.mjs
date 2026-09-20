import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Pagination composes packaged Button and Join with Router and native status semantics', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-pagination.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@pranxy\/zordon-ui\/button/);
  assert.match(bundle, /@pranxy\/zordon-ui\/join/);
  assert.match(bundle, /queryParamsHandling/);
  assert.match(bundle, /aria-live/);
  assert.doesNotMatch(bundle, /@angular\/aria|@angular\/cdk\/overlay/);
});
