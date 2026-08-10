import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  getReleaseChannel,
  readPackageRelease,
  validateReleaseContract,
} from './release-contract.mjs';

function npmInvocation(arguments_, npmExecPath) {
  if (!npmExecPath) {
    throw new Error('Run package dry-run verification through an npm script.');
  }
  return { command: process.execPath, arguments: [npmExecPath, ...arguments_] };
}

function runNpm(arguments_, spawn, npmExecPath) {
  const invocation = npmInvocation(arguments_, npmExecPath);
  const result = spawn(invocation.command, invocation.arguments, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      npm_config_cache:
        process.env.ZORDON_RELEASE_NPM_CACHE ?? resolve(tmpdir(), 'zordon-ui-npm-cache'),
    },
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`npm ${arguments_.join(' ')} failed with exit code ${result.status}.`);
  }
}

export async function dryRunPublish({
  packageDirectory = 'dist/components',
  npmExecPath = process.env.npm_execpath,
  spawn = spawnSync,
} = {}) {
  const absolutePackageDirectory = resolve(packageDirectory);
  const packageRelease = await readPackageRelease(
    resolve(absolutePackageDirectory, 'package.json'),
  );
  const release = getReleaseChannel(packageRelease.version);
  validateReleaseContract({
    ...packageRelease,
    releaseTag: `v${packageRelease.version}`,
    releasePrerelease: release.prerelease,
  });

  runNpm(['pack', absolutePackageDirectory, '--dry-run', '--json'], spawn, npmExecPath);
  runNpm(
    [
      'publish',
      absolutePackageDirectory,
      '--dry-run',
      '--access',
      'public',
      '--tag',
      release.channel,
    ],
    spawn,
    npmExecPath,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  dryRunPublish({ packageDirectory: process.argv[2] }).catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
