import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
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

export function consumerManifest(lane, tarball) {
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

export async function verifyConsumer(lane) {
  assert(consumerLanes[lane], `Choose a lane: ${Object.keys(consumerLanes).join(', ')}`);
  const workspace = await mkdtemp(resolve(tmpdir(), `zordon-consumer-${lane}-`));
  const evidence = resolve(root, 'tmp/consumer-compatibility', lane);
  await mkdir(evidence, { recursive: true });
  const report = {
    lane,
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
    await json(resolve(workspace, 'package.json'), consumerManifest(lane, tarball));
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
      await readFile(resolve(root, 'tools/fixtures/consumer/app.ts')),
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
        types: [],
      },
      angularCompilerOptions: { strictTemplates: true, strictInjectionParameters: true },
      files: ['src/main.ts'],
    });
    for (const mode of ['zoneless', 'zone']) {
      await writeFile(
        resolve(workspace, 'src/main.ts'),
        `${mode === 'zone' ? "import 'zone.js';" : ''}\nimport { ${mode === 'zone' ? 'provideZoneChangeDetection' : 'provideZonelessChangeDetection'} } from '@angular/core';\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { Consumer } from './app';\nbootstrapApplication(Consumer, { providers: [${mode === 'zone' ? 'provideZoneChangeDetection' : 'provideZonelessChangeDetection'}()] }).catch(error => console.error(error));\n`,
      );
      for (const configuration of ['development', 'production']) {
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
        await smoke(resolve(workspace, outputPath, 'browser'), mode, probe.count);
        report.builds.push({ mode, configuration, status: 'passed' });
      }
    }
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = error.message;
    throw error;
  } finally {
    await json(resolve(evidence, 'report.json'), report);
    await json(resolve(evidence, 'commands.json'), log);
    console.log(`Evidence: ${evidence}; isolated workspace retained: ${workspace}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyConsumer(process.argv[2]).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
