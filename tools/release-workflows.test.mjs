import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const publishWorkflow = await readFile('.github/workflows/publish.yml', 'utf8');
const versionWorkflow = await readFile('.github/workflows/version-packages.yml', 'utf8');

test('publishing requires an explicit GitHub Release and protected OIDC environment', () => {
  assert.match(publishWorkflow, /release:\s*\n\s+types:\s*\n\s+- published/);
  assert.match(publishWorkflow, /environment: npm/);
  assert.match(publishWorkflow, /id-token: write/);
  assert.match(publishWorkflow, /npm run release:package-dry-run/);
});

test('publishing uses the validated explicit dist-tag and provenance without a long-lived token', () => {
  assert.match(publishWorkflow, /--tag "\$NPM_DIST_TAG" --provenance/);
  assert.doesNotMatch(publishWorkflow, /NPM_TOKEN|NODE_AUTH_TOKEN/);
  assert.match(publishWorkflow, /release-contract\.mjs/);
});

test('stable releases require master while prereleases require their matching release branch', () => {
  assert.match(publishWorkflow, /git merge-base --is-ancestor HEAD origin\/master/);
  assert.match(publishWorkflow, /origin\/release\/\$NPM_DIST_TAG/);
});

test('release workflows pin third-party actions to immutable revisions', () => {
  for (const workflow of [publishWorkflow, versionWorkflow]) {
    const actionReferences = [...workflow.matchAll(/uses:\s+[^\s@]+@([^\s]+)/g)].map(
      match => match[1],
    );
    assert.ok(actionReferences.length > 0);
    assert.ok(actionReferences.every(reference => /^[0-9a-f]{40}$/.test(reference)));
  }
});

test('version PR automation cannot request npm OIDC or publish packages', () => {
  assert.match(versionWorkflow, /pull-requests: write/);
  assert.doesNotMatch(versionWorkflow, /id-token: write|npm publish|NODE_AUTH_TOKEN|NPM_TOKEN/);
});

test('stable version PR automation is disabled while the package manifest is prerelease', () => {
  assert.match(versionWorkflow, /enabled=' \+ !version\.includes\('-'\)/);
  assert.match(versionWorkflow, /if: steps\.version-mode\.outputs\.enabled == 'true'/);
});
