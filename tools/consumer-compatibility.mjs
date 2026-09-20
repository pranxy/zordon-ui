import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, expect } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const consumerLanes = {
  minimum: { angular: '21.0.0', tooling: '21.0.0', typescript: '5.9.3' },
  baseline: { angular: '21.2.19', tooling: '21.2.20', typescript: '5.9.3' },
  latest: { angular: '22.1.7', tooling: '22.1.8', typescript: '6.0.3' },
};

export function consumerManifest(lane, tarball, { ssr = false } = {}) {
  const versions = consumerLanes[lane];
  assert(versions, `Unknown consumer lane: ${lane}`);
  return {
    name: `zordon-consumer-${lane}`,
    version: '0.0.0',
    private: true,
    dependencies: {
      ...Object.fromEntries(
        ['common', 'compiler', 'core', 'forms', 'platform-browser', 'router'].map(name => [
          `@angular/${name}`,
          versions.angular,
        ]),
      ),
      ...(ssr
        ? { '@angular/platform-server': versions.angular, '@angular/ssr': versions.tooling }
        : {}),
      '@angular/aria': '21.2.14',
      '@angular/cdk': '21.2.14',
      '@pranxy/zordon-ui': `file:${tarball.replaceAll('\\', '/')}`,
      'daisyui': '5.7.16',
      'tailwindcss': '4.1.7',
      'rxjs': '7.8.2',
      'tslib': '2.8.1',
      'zone.js': '0.15.1',
    },
    devDependencies: {
      ...(ssr ? { '@types/node': '22.15.30' } : {}),
      '@angular/build': versions.tooling,
      '@angular/cli': versions.tooling,
      '@angular/compiler-cli': versions.angular,
      'typescript': versions.typescript,
    },
  };
}

export function exportProbe(manifest) {
  const entries = Object.entries(manifest.exports).filter(([, value]) => value?.types);
  assert(entries.length > 0, 'The built package has no typed exports.');
  return {
    count: entries.length,
    source:
      entries
        .map(
          ([key], index) =>
            `import * as entry${index} from '${manifest.name}${key === '.' ? '' : key.slice(1)}';`,
        )
        .join('\n') +
      `\nexport const entryCount = [${entries.map((_, index) => `Object.keys(entry${index})`).join(',')}].length;\n`,
  };
}

export function consumerBootstrap(mode, { ssr = false, server = false } = {}) {
  assert(['zone', 'zoneless'].includes(mode), `Unknown change detection mode: ${mode}`);
  assert(!server || ssr, 'Server bootstrap requires SSR.');
  const provider =
    mode === 'zone' ? 'provideZoneChangeDetection' : 'provideZonelessChangeDetection';
  return `${mode === 'zone' ? `import '${server ? 'zone.js/node' : 'zone.js'}';` : ''}
import { APP_ID, ${provider} } from '@angular/core';
import { bootstrapApplication, ${server ? 'BootstrapContext, ' : ''}provideClientHydration } from '@angular/platform-browser';
${server ? "import { provideServerRendering, withRoutes, RenderMode } from '@angular/ssr';" : ''}
import { Consumer } from './app';
const config = { providers: [${provider}()${ssr ? ", { provide: APP_ID, useValue: 'zordon-consumer' }, provideClientHydration()" : ''}${server ? ", provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Server }]))" : ''}] };
${server ? 'export default (context: BootstrapContext) => bootstrapApplication(Consumer, config, context);' : 'bootstrapApplication(Consumer, config).catch(error => console.error(error));'}
`;
}

async function startSsrServer(entry, observation) {
  observation.stdout = '';
  observation.stderr = '';
  const child = spawn(process.execPath, [entry], {
    cwd: dirname(entry),
    env: { ...process.env, NG_ALLOWED_HOSTS: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let exited = false;
  const closed = new Promise(resolve =>
    child.once('close', (code, signal) => {
      exited = true;
      observation.exit = { code, signal };
      resolve();
    }),
  );
  child.stdout.on('data', data => {
    observation.stdout += data;
  });
  child.stderr.on('data', data => {
    observation.stderr += data;
  });
  const stop = async () => {
    if (exited) return;
    child.kill();
    let timer;
    try {
      await Promise.race([
        closed,
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            child.kill('SIGKILL');
            reject(new Error('SSR server did not stop within 5 seconds.'));
          }, 5_000);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => finish(new Error('SSR readiness timed out after 30 seconds.')),
        30_000,
      );
      const onData = () => {
        const match = observation.stdout.match(/CONSUMER_SSR_READY:(http:\/\/127\.0\.0\.1:\d+)/);
        if (match) finish(null, match[1]);
      };
      const onError = error => finish(error);
      const onExit = code =>
        finish(new Error(`SSR server exited before readiness (${code}): ${observation.stderr}`));
      const finish = (error, url) => {
        clearTimeout(timer);
        child.stdout.off('data', onData);
        child.off('error', onError);
        child.off('exit', onExit);
        error ? reject(error) : resolve(url);
      };
      child.stdout.on('data', onData);
      child.once('error', onError);
      child.once('exit', onExit);
    });
    return {
      url,
      stop,
      assertHealthy: () => {
        assert.equal(exited, false, 'SSR server must remain alive.');
        assert.equal(observation.stderr, '', 'SSR server must not emit errors.');
        assert.doesNotMatch(
          observation.stdout,
          /(?:ERROR|Error:|NG\d{4})/,
          'SSR server logged an error.',
        );
      },
    };
  } catch (error) {
    await stop();
    throw error;
  }
}

async function relationships(page) {
  return page.locator('zd-consumer').evaluate(root => {
    const elements = [
      ...root.querySelectorAll(
        '[id], [for], [aria-controls], [aria-labelledby], [aria-describedby]',
      ),
    ];
    const records = elements.map(element =>
      Object.fromEntries(
        ['id', 'for', 'aria-controls', 'aria-labelledby', 'aria-describedby'].map(name => [
          name,
          element.getAttribute(name),
        ]),
      ),
    );
    for (const record of records) {
      if (
        record.id &&
        root.ownerDocument.querySelectorAll(`[id="${CSS.escape(record.id)}"]`).length !== 1
      )
        throw new Error(`Duplicate ID: ${record.id}`);
      for (const name of ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby']) {
        for (const id of (record[name] ?? '').split(/\s+/).filter(Boolean)) {
          if (!root.ownerDocument.getElementById(id)) throw new Error(`Unresolved ${name}: ${id}`);
        }
      }
    }
    return records;
  });
}

async function assertServerContent(page, entryCount) {
  await expect(page.getByTestId('entries')).toHaveText(String(entryCount));
  await expect(page.getByTestId('count')).toHaveText('0');
  await expect(page.getByTestId('count')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue(
    'Server consumer',
  );
  await expect(page.getByRole('tab', { name: 'First', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tabpanel')).toHaveText('First panel');
  await expect(page.getByRole('tabpanel')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'First', exact: true })).toHaveAttribute(
    'aria-controls',
    await page.getByRole('tabpanel').getAttribute('id'),
  );
  await expect(page.getByRole('tabpanel')).toHaveAttribute(
    'aria-labelledby',
    await page.getByRole('tab', { name: 'First', exact: true }).getAttribute('id'),
  );
  await expect(page.locator('zd-consumer')).toHaveAttribute('data-render-origin', 'server');
}

async function smokeSsr(entry, mode, entryCount, observation) {
  const server = await startSsrServer(entry, observation);
  let browser;
  let releaseScripts;
  const contexts = [];
  const errors = [];
  const watch = page => {
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
  };
  try {
    browser = await chromium.launch();
    const staticContext = await browser.newContext({ javaScriptEnabled: false });
    contexts.push(staticContext);
    const staticPage = await staticContext.newPage();
    watch(staticPage);
    observation.requests = [];
    for (let index = 0; index < 2; index++) {
      const response = await staticPage.goto(server.url);
      assert.equal(response.status(), 200, 'Live SSR request must return HTTP 200.');
      const html = await response.text();
      assert.match(html, /ngh="/);
      assert.match(html, /data-render-origin="server"/);
      assert.match(html, /First panel/);
      await assertServerContent(staticPage, entryCount);
      observation.requests.push({
        status: response.status(),
        html,
        relationships: await relationships(staticPage),
      });
    }
    assert.deepEqual(
      observation.requests[1].relationships,
      observation.requests[0].relationships,
      'IDs and ARIA relationships must be identical across independent SSR requests.',
    );
    const context = await browser.newContext();
    contexts.push(context);
    const gate = new Promise(resolve => {
      releaseScripts = resolve;
    });
    await context.route('**/*', async route => {
      if (route.request().resourceType() === 'script') await gate;
      await route.continue();
    });
    const page = await context.newPage();
    watch(page);
    await page.goto(server.url, { waitUntil: 'commit' });
    await assertServerContent(page, entryCount);
    observation.beforeHydration = await relationships(page);
    assert.deepEqual(
      observation.beforeHydration,
      observation.requests[0].relationships,
      'Hydration document must preserve request-stable IDs.',
    );
    const locators = [
      page.getByRole('button', { name: 'Increment' }),
      page.getByRole('textbox', { name: 'Name', exact: true }),
      page.getByRole('tab', { name: 'First', exact: true }),
      page.getByRole('tabpanel'),
    ];
    const handles = await Promise.all(locators.map(locator => locator.elementHandle()));
    assert(
      handles.every(Boolean),
      'All representative server nodes must exist before scripts run.',
    );
    releaseScripts();
    await expect(page.locator('html')).toHaveAttribute('data-consumer-ready', 'true');
    for (let index = 0; index < handles.length; index++) {
      assert.equal(
        await locators[index].evaluate(
          (current, original) => original.isConnected && current === original,
          handles[index],
        ),
        true,
        'Hydration must reuse each original server node.',
      );
    }
    observation.afterHydration = await relationships(page);
    assert.deepEqual(
      observation.afterHydration,
      observation.beforeHydration,
      'Hydration must not change IDs or ARIA relationships.',
    );
    assert.equal(
      await page.evaluate(() => typeof globalThis.Zone !== 'undefined'),
      mode === 'zone',
    );
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.getByTestId('count')).toHaveText('1');
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Consumer');
    await expect(page.getByTestId('name')).toHaveText('Consumer');
    await expect(page.locator('zd-tabs')).toHaveAttribute('data-zd-tabs-ready', 'true');
    await page.getByRole('tab', { name: 'First', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('tab', { name: 'Second', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('tabpanel')).toHaveText('Second panel');
    assert.deepEqual(errors, [], 'SSR consumer must run without browser errors.');
    server.assertHealthy();
  } finally {
    observation.browserErrors = errors;
    releaseScripts?.();
    try {
      for (const context of contexts) await context.close();
    } finally {
      try {
        await browser?.close();
      } finally {
        await server.stop();
      }
    }
  }
}

function run(args, cwd, log, npm = false) {
  const executable = npm ? process.env.npm_execpath : null;
  assert(!npm || executable, 'Run through npm run test:consumer.');
  const result = spawnSync(process.execPath, npm ? [executable, ...args] : args, {
    cwd,
    env: {
      ...process.env,
      NG_CLI_ANALYTICS: 'false',
      npm_config_cache: resolve(root, 'tmp/consumer-npm-cache'),
    },
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 600_000,
  });
  log.push({ args, stdout: result.stdout, stderr: result.stderr, status: result.status });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${args.join(' ')} failed:\n${result.stderr}\n${result.stdout}`);
  return result.stdout;
}

async function smoke(directory, mode, entryCount) {
  const server = createServer(async (request, response) => {
    try {
      const path = resolve(
        directory,
        `.${new URL(request.url, 'http://localhost').pathname === '/' ? '/index.html' : new URL(request.url, 'http://localhost').pathname}`,
      );
      if (!path.startsWith(directory + sep)) {
        response.writeHead(403).end();
        return;
      }
      response.setHeader(
        'Content-Type',
        path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'text/html',
      );
      response.end(await readFile(path));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await expect(page.getByTestId('entries')).toHaveText(String(entryCount));
    assert.equal(
      await page.evaluate(() => typeof globalThis.Zone !== 'undefined'),
      mode === 'zone',
    );
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.getByTestId('count')).toHaveText('1');
    await page.getByRole('textbox', { name: 'Name' }).fill('Consumer');
    await expect(page.getByTestId('name')).toHaveText('Consumer');
    await expect(page.locator('zd-tabs')).toHaveAttribute('data-zd-tabs-ready', 'true');
    await page.getByRole('tab', { name: 'First', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('tab', { name: 'Second', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('tabpanel')).toHaveText('Second panel');
    assert.deepEqual(errors, [], 'Consumer must run without browser errors.');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}

export async function verifyConsumer(lane, { ssr = false } = {}) {
  assert(consumerLanes[lane], `Choose a lane: ${Object.keys(consumerLanes).join(', ')}`);
  const workspace = await mkdtemp(resolve(tmpdir(), `zordon-consumer-${lane}-`));
  const evidence = resolve(root, ssr ? 'tmp/consumer-ssr' : 'tmp/consumer-compatibility', lane);
  await mkdir(evidence, { recursive: true });
  const report = {
    lane,
    rendering: ssr ? 'ssr' : 'csr',
    versions: consumerLanes[lane],
    node: process.version,
    workspace,
    builds: [],
    status: 'running',
  };
  const log = [];
  const json = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');
  try {
    const packed = JSON.parse(
      run(
        ['pack', resolve(root, 'dist/components'), '--json', '--pack-destination', workspace],
        workspace,
        log,
        true,
      ),
    );
    const tarball = resolve(workspace, packed[0].filename);
    report.packageIntegrity = packed[0].integrity;
    await json(resolve(workspace, 'package.json'), consumerManifest(lane, tarball, { ssr }));
    run(['install', '--strict-peer-deps', '--no-audit', '--no-fund'], workspace, log, true);
    report.dependencyTree = JSON.parse(run(['ls', '--all', '--json'], workspace, log, true));
    await writeFile(
      resolve(evidence, 'package-lock.json'),
      await readFile(resolve(workspace, 'package-lock.json')),
    );
    const manifest = JSON.parse(
      await readFile(resolve(workspace, 'node_modules/@pranxy/zordon-ui/package.json'), 'utf8'),
    );
    const probe = exportProbe(manifest);
    report.entryPoints = probe.count;
    await mkdir(resolve(workspace, 'src'));
    await writeFile(resolve(workspace, 'src/entries.ts'), probe.source);
    await writeFile(
      resolve(workspace, 'src/app.ts'),
      await readFile(resolve(root, `tools/fixtures/consumer/${ssr ? 'app.ssr.ts' : 'app.ts'}`)),
    );
    await writeFile(
      resolve(workspace, 'src/index.html'),
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Package consumer</title><base href="/"></head><body><zd-consumer></zd-consumer></body></html>',
    );
    await json(resolve(workspace, 'tsconfig.json'), {
      compilerOptions: {
        target: 'ES2022',
        module: 'preserve',
        moduleResolution: 'bundler',
        experimentalDecorators: true,
        strict: true,
        skipLibCheck: false,
        lib: ['ES2022', 'DOM'],
        types: ssr ? ['node'] : [],
      },
      angularCompilerOptions: { strictTemplates: true, strictInjectionParameters: true },
      files: ssr ? ['src/main.ts', 'src/main.server.ts', 'src/server.ts'] : ['src/main.ts'],
    });
    if (ssr)
      await writeFile(
        resolve(workspace, 'src/server.ts'),
        await readFile(resolve(root, 'tools/fixtures/consumer/server.ts')),
      );
    for (const mode of ['zoneless', 'zone']) {
      await writeFile(resolve(workspace, 'src/main.ts'), consumerBootstrap(mode, { ssr }));
      if (ssr)
        await writeFile(
          resolve(workspace, 'src/main.server.ts'),
          consumerBootstrap(mode, { ssr, server: true }),
        );
      for (const configuration of ssr ? ['production'] : ['development', 'production']) {
        const outputPath = `dist/${mode}-${configuration}`;
        await json(resolve(workspace, 'angular.json'), {
          version: 1,
          cli: { analytics: false, cache: { enabled: false } },
          projects: {
            consumer: {
              projectType: 'application',
              root: '',
              sourceRoot: 'src',
              architect: {
                build: {
                  builder: '@angular/build:application',
                  options: {
                    ...(ssr
                      ? {
                          server: 'src/main.server.ts',
                          ssr: { entry: 'src/server.ts' },
                          outputMode: 'server',
                          prerender: false,
                        }
                      : {}),
                    browser: 'src/main.ts',
                    index: 'src/index.html',
                    tsConfig: 'tsconfig.json',
                    outputPath,
                  },
                  configurations: {
                    development: { optimization: false, sourceMap: true },
                    production: { optimization: true, sourceMap: false, outputHashing: 'all' },
                  },
                },
              },
            },
          },
        });
        console.log(`${lane}: ${mode} ${configuration}`);
        run(
          [
            resolve(workspace, 'node_modules/@angular/cli/bin/ng.js'),
            'build',
            '--configuration',
            configuration,
          ],
          workspace,
          log,
        );
        if (ssr) {
          const observation = {};
          report.builds.push({ mode, configuration, status: 'running', observation });
          await smokeSsr(
            resolve(workspace, outputPath, 'server/server.mjs'),
            mode,
            probe.count,
            observation,
          );
          report.builds.at(-1).status = 'passed';
        } else await smoke(resolve(workspace, outputPath, 'browser'), mode, probe.count);
        if (!ssr) report.builds.push({ mode, configuration, status: 'passed' });
      }
    }
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = error.message;
    if (report.builds.at(-1)?.status === 'running') report.builds.at(-1).status = 'failed';
    throw error;
  } finally {
    await json(resolve(evidence, 'report.json'), report);
    await json(resolve(evidence, 'commands.json'), log);
    console.log(`Evidence: ${evidence}; isolated workspace retained: ${workspace}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arguments_ = process.argv.slice(2);
  const ssr = arguments_.includes('--ssr');
  const lanes = arguments_.filter(argument => argument !== '--ssr');
  assert.equal(lanes.length, 1, 'Usage: npm run test:consumer -- <lane> [--ssr]');
  verifyConsumer(lanes[0], { ssr }).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
