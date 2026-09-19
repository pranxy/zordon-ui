import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Skeleton ships decorative artwork and region semantics without widget dependencies', async () => {
  const [bundle, manifest] = await Promise.all(
    ['dist/components/fesm2022/pranxy-zordon-ui-skeleton.mjs', 'dist/components/package.json'].map(
      path => readFile(new URL('../' + path, import.meta.url), 'utf8'),
    ),
  );
  assert.doesNotMatch(bundle, /@angular\/(?:aria|cdk)/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.match(bundle, /forced-colors/);
  assert.match(bundle, /aria-busy/);
  assert.ok(JSON.parse(manifest).exports['./skeleton']);
});
