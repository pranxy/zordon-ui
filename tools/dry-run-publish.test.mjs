import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { dryRunPublish } from './dry-run-publish.mjs';

async function createPackage(version = '0.0.0-next.0') {
  const packageDirectory = await mkdtemp(join(tmpdir(), 'zordon-release-'));
  await writeFile(
    join(packageDirectory, 'package.json'),
    JSON.stringify({ name: '@pranxy/zordon-ui', version }),
  );
  return packageDirectory;
}

test('dry-runs pack and publish with the channel derived from the built package', async () => {
  const packageDirectory = await createPackage('1.2.3-beta.0');
  const calls = [];
  const spawn = (command, arguments_, options) => {
    calls.push({ command, arguments: arguments_, options });
    return { status: 0 };
  };

  await dryRunPublish({ packageDirectory, npmExecPath: '/npm-cli.js', spawn });

  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0].arguments.slice(-2), ['--dry-run', '--json']);
  assert.deepEqual(calls[1].arguments.slice(-5), [
    '--dry-run',
    '--access',
    'public',
    '--tag',
    'beta',
  ]);
  assert.match(calls[0].options.env.npm_config_cache, /zordon-ui-npm-cache$/);
});

test('refuses to run npm for an unexpected built package', async () => {
  const packageDirectory = await createPackage();
  await writeFile(
    join(packageDirectory, 'package.json'),
    JSON.stringify({ name: '@pranxy/not-zordon', version: '1.0.0' }),
  );
  let called = false;

  await assert.rejects(
    dryRunPublish({
      packageDirectory,
      npmExecPath: '/npm-cli.js',
      spawn: () => {
        called = true;
        return { status: 0 };
      },
    }),
    /unexpected package/,
  );
  assert.equal(called, false);
});

test('propagates an npm failure and never attempts the publish dry run', async () => {
  const packageDirectory = await createPackage('1.0.0');
  let calls = 0;

  await assert.rejects(
    dryRunPublish({
      packageDirectory,
      npmExecPath: '/npm-cli.js',
      spawn: () => {
        calls += 1;
        return { status: 7 };
      },
    }),
    /failed with exit code 7/,
  );
  assert.equal(calls, 1);
});

test('fails clearly when invoked directly without an npm CLI path', async () => {
  const packageDirectory = await createPackage('1.0.0');

  await assert.rejects(
    dryRunPublish({ packageDirectory, npmExecPath: null, spawn: () => ({ status: 0 }) }),
    /through an npm script/,
  );
});
