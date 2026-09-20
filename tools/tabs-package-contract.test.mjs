import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Tabs packages public Aria behavior and Router integration without a duplicate focus or overlay runtime', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-tabs.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@angular\/aria\/tabs/);
  assert.match(bundle, /@angular\/router/);
  assert.match(bundle, /preserveContent/);
  assert.match(bundle, /forced-colors/);
  assert.doesNotMatch(bundle, /class TabListPattern|@angular\/cdk\/overlay|_pattern|_tabPatterns/);
});
