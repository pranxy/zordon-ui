import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Breadcrumbs packages native navigation and disclosure without a menu runtime or HTML bypass', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-breadcrumbs.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@angular\/router/);
  assert.match(bundle, /BreadcrumbList/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.doesNotMatch(bundle, /@angular\/aria|bypassSecurityTrust|innerHTML/);
});
