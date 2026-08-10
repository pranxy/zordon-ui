import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const PACKAGE_NAME = '@pranxy/zordon-ui';
export const PRERELEASE_CHANNELS = Object.freeze(['next', 'alpha', 'beta', 'rc']);

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export function getReleaseChannel(version) {
  const match = SEMVER_PATTERN.exec(version);

  if (!match) {
    throw new Error(`Package version "${version}" is not valid SemVer.`);
  }

  const prerelease = match[4];
  if (!prerelease) {
    return { channel: 'latest', prerelease: false };
  }

  if (
    prerelease.split('.').some(identifier => /^\d+$/.test(identifier) && /^0\d/.test(identifier))
  ) {
    throw new Error(`Package version "${version}" is not valid SemVer.`);
  }

  const channel = prerelease.split('.')[0];
  if (!PRERELEASE_CHANNELS.includes(channel)) {
    throw new Error(
      `Unsupported prerelease channel "${channel}". Expected one of: ${PRERELEASE_CHANNELS.join(', ')}.`,
    );
  }

  return { channel, prerelease: true };
}

export function validateReleaseContract({ name, version, releaseTag, releasePrerelease }) {
  if (name !== PACKAGE_NAME) {
    throw new Error(`Refusing to publish unexpected package "${name}".`);
  }

  const expectedTag = `v${version}`;
  if (releaseTag !== expectedTag) {
    throw new Error(`GitHub release tag "${releaseTag}" must exactly match "${expectedTag}".`);
  }

  const release = getReleaseChannel(version);
  if (releasePrerelease !== release.prerelease) {
    throw new Error(
      release.prerelease
        ? `Version "${version}" is a prerelease, so the GitHub Release must be marked as prerelease.`
        : `Version "${version}" is stable, so the GitHub Release must not be marked as prerelease.`,
    );
  }

  return { name, version, distTag: release.channel };
}

export async function readPackageRelease(packagePath) {
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  return { name: packageJson.name, version: packageJson.version };
}

function parseArguments(arguments_) {
  const values = new Map();

  for (let index = 0; index < arguments_.length; index += 2) {
    const key = arguments_[index];
    const value = arguments_[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error('Expected --package, --tag, and --prerelease arguments.');
    }
    values.set(key.slice(2), value);
  }

  const packagePath = values.get('package');
  const releaseTag = values.get('tag');
  const prereleaseValue = values.get('prerelease');
  if (!packagePath || !releaseTag || !['true', 'false'].includes(prereleaseValue)) {
    throw new Error('Expected --package <path> --tag <tag> --prerelease <true|false>.');
  }

  return { packagePath, releaseTag, releasePrerelease: prereleaseValue === 'true' };
}

async function main() {
  const arguments_ = parseArguments(process.argv.slice(2));
  const packageRelease = await readPackageRelease(arguments_.packagePath);
  const release = validateReleaseContract({ ...packageRelease, ...arguments_ });

  process.stdout.write(`version=${release.version}\ndist-tag=${release.distTag}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
