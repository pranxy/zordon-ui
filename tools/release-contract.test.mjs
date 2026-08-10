import assert from 'node:assert/strict';
import test from 'node:test';
import { getReleaseChannel, validateReleaseContract } from './release-contract.mjs';

test('maps a stable package to latest', () => {
  assert.deepEqual(getReleaseChannel('1.2.3'), { channel: 'latest', prerelease: false });
});

for (const channel of ['next', 'alpha', 'beta', 'rc']) {
  test(`maps a ${channel} version to its non-latest dist-tag`, () => {
    assert.deepEqual(getReleaseChannel(`1.2.3-${channel}.0`), {
      channel,
      prerelease: true,
    });
  });
}

test('accepts an exact stable GitHub release contract', () => {
  assert.deepEqual(
    validateReleaseContract({
      name: '@pranxy/zordon-ui',
      version: '1.2.3',
      releaseTag: 'v1.2.3',
      releasePrerelease: false,
    }),
    { name: '@pranxy/zordon-ui', version: '1.2.3', distTag: 'latest' },
  );
});

test('rejects a release tag that does not exactly match the package version', () => {
  assert.throws(
    () =>
      validateReleaseContract({
        name: '@pranxy/zordon-ui',
        version: '1.2.3',
        releaseTag: 'v1.2.4',
        releasePrerelease: false,
      }),
    /must exactly match/,
  );
});

test('rejects a prerelease published as a stable GitHub release', () => {
  assert.throws(
    () =>
      validateReleaseContract({
        name: '@pranxy/zordon-ui',
        version: '1.2.3-beta.0',
        releaseTag: 'v1.2.3-beta.0',
        releasePrerelease: false,
      }),
    /must be marked as prerelease/,
  );
});

test('rejects a stable version marked as a GitHub prerelease', () => {
  assert.throws(
    () =>
      validateReleaseContract({
        name: '@pranxy/zordon-ui',
        version: '1.2.3',
        releaseTag: 'v1.2.3',
        releasePrerelease: true,
      }),
    /must not be marked as prerelease/,
  );
});

test('rejects unsupported prerelease channels before they can update latest', () => {
  assert.throws(() => getReleaseChannel('1.2.3-canary.0'), /Unsupported prerelease channel/);
});

test('rejects malformed SemVer, including zero-padded numeric prerelease identifiers', () => {
  assert.throws(() => getReleaseChannel('1.2'), /not valid SemVer/);
  assert.throws(() => getReleaseChannel('1.2.3-next.01'), /not valid SemVer/);
});

test('rejects an unexpected package name', () => {
  assert.throws(
    () =>
      validateReleaseContract({
        name: '@pranxy/not-zordon',
        version: '1.2.3',
        releaseTag: 'v1.2.3',
        releasePrerelease: false,
      }),
    /unexpected package/,
  );
});
