import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Steps packages native list and controlled buttons without tab or overlay runtimes', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-steps.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /aria-current/);
  assert.match(bundle, /currentIdChange/);
  assert.match(bundle, /forced-colors/);
  assert.doesNotMatch(bundle, /@angular\/aria|@angular\/router|@angular\/cdk|role=.?tab/);
});
