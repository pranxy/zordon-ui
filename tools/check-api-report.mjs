import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(toolsDirectory, '..');
const reports = [
  {
    configPath: resolve(toolsDirectory, 'api-extractor-aura.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-aura.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-aura.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-avatar.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-avatar.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-avatar.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-badge.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-badge.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-badge.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-button.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-button.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-button.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-divider.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-divider.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-divider.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-fieldset.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-fieldset.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-fieldset.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-label.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-label.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-label.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-link.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-link.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-link.api.md'),
  },
];
const apiExtractorPath = resolve(
  workspaceRoot,
  'node_modules/@microsoft/api-extractor/bin/api-extractor',
);

export function assertApiReportsMatch(baseline, candidate) {
  if (normalizeNewlines(baseline) === normalizeNewlines(candidate)) {
    return;
  }

  throw new Error(
    'Public API report differs from the reviewed baseline. Review the declaration change, then run npm run update:api.',
  );
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/g, '\n');
}

export async function checkApiReport({ spawn = spawnSync } = {}) {
  for (const report of reports) {
    const result = spawn(
      process.execPath,
      ['--no-warnings', apiExtractorPath, 'run', '--config', report.configPath, '--local'],
      {
        cwd: workspaceRoot,
        stdio: 'inherit',
      },
    );
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`API Extractor failed with exit code ${result.status ?? 'unknown'}.`);
    }

    const [baseline, candidate] = await Promise.all([
      readFile(report.baselinePath, 'utf8'),
      readFile(report.candidatePath, 'utf8'),
    ]);
    assertApiReportsMatch(baseline, candidate);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkApiReport().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
