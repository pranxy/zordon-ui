import assert from 'node:assert/strict';
import test from 'node:test';
import {
  consumerBootstrap,
  consumerLanes,
  consumerManifest,
  exportProbe,
} from './consumer-compatibility.mjs';

test('SSR dependencies use each pinned framework and tooling lane without changing CSR manifests', () => {
  for (const [lane, versions] of Object.entries(consumerLanes)) {
    const csr = consumerManifest(lane, '/package.tgz');
    const ssr = consumerManifest(lane, '/package.tgz', { ssr: true });
    assert.equal(csr.dependencies['@angular/platform-server'], undefined);
    assert.equal(csr.dependencies['@angular/ssr'], undefined);
    assert.equal(csr.devDependencies['@types/node'], undefined);
    assert.equal(ssr.dependencies['@angular/platform-server'], versions.angular);
    assert.equal(ssr.dependencies['@angular/ssr'], versions.tooling);
    assert.equal(ssr.devDependencies['@types/node'], '22.15.30');
    assert.equal(ssr.dependencies['@pranxy/zordon-ui'], csr.dependencies['@pranxy/zordon-ui']);
  }
});

test('SSR bootstraps enable ordinary hydration on both sides and isolate server Zone imports', () => {
  for (const mode of ['zone', 'zoneless']) {
    const client = consumerBootstrap(mode, { ssr: true });
    const server = consumerBootstrap(mode, { ssr: true, server: true });
    for (const source of [client, server]) {
      assert.match(source, /provideClientHydration\(\)/);
      assert.match(source, /provide: APP_ID, useValue: 'zordon-consumer'/);
      assert.doesNotMatch(source, /withIncrementalHydration|ngSkipHydration/);
    }
    assert.match(server, /bootstrapApplication\(Consumer, config, context\)/);
    assert.match(
      server,
      /provideServerRendering\(withRoutes\(\[\{ path: '\*\*', renderMode: RenderMode.Server \}\]\)\)/,
    );
    assert.equal(server.includes("import 'zone.js/node';"), mode === 'zone');
    assert.equal(client.includes("import 'zone.js';"), mode === 'zone');
    assert.doesNotMatch(client, /zone\.js\/node|@angular\/ssr/);
    assert.doesNotMatch(consumerBootstrap(mode), /provideClientHydration\(\)|provide: APP_ID/);
  }
  assert.throws(() => consumerBootstrap('other'), /Unknown change detection mode/);
  assert.throws(() => consumerBootstrap('zone', { server: true }), /requires SSR/);
});

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
