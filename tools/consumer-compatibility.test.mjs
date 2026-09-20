import assert from 'node:assert/strict';
import test from 'node:test';
import { consumerLanes, consumerManifest, exportProbe } from './consumer-compatibility.mjs';

test('consumer lanes keep framework/compiler aligned and the required Aria/CDK pair', () => {
  for (const lane of Object.keys(consumerLanes)) {
    const manifest = consumerManifest(lane, 'C:\\temp\\package.tgz');
    assert.equal(manifest.dependencies['@angular/core'], consumerLanes[lane].angular);
    assert.equal(manifest.devDependencies['@angular/compiler-cli'], consumerLanes[lane].angular);
    assert.equal(manifest.dependencies['@angular/aria'], manifest.dependencies['@angular/cdk']);
    assert.equal(manifest.dependencies['@pranxy/zordon-ui'], 'file:C:/temp/package.tgz');
    assert.equal(manifest.private, true);
  }
  assert.throws(() => consumerManifest('unknown', '/package.tgz'), /Unknown consumer lane/);
});

test('export probe retains every typed entry including the internal bridge, excluding assets', () => {
  const probe = exportProbe({
    name: '@example/ui',
    exports: {
      '.': { types: './types/index.d.ts' },
      './button': { types: './types/button.d.ts' },
      './internal-overlay': { types: './types/internal.d.ts' },
      './package.json': { default: './package.json' },
      './motion.css': './motion.css',
    },
  });
  assert.equal(probe.count, 3);
  assert.match(probe.source, /from '@example\/ui';/);
  assert.match(probe.source, /from '@example\/ui\/button';/);
  assert.match(probe.source, /from '@example\/ui\/internal-overlay';/);
  assert.match(probe.source, /Object.keys\(entry2\)/);
  assert.doesNotMatch(probe.source, /motion.css|package.json/);
  assert.throws(() => exportProbe({ exports: {} }), /no typed exports/);
});
