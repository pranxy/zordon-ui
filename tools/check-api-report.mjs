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
    configPath: resolve(toolsDirectory, 'api-extractor-card.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-card.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-card.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-carousel.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-carousel.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-carousel.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-collapse.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-collapse.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-collapse.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-chat-bubble.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-chat-bubble.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-chat-bubble.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-kbd.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-kbd.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-kbd.api.md'),
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
  {
    configPath: resolve(toolsDirectory, 'api-extractor-stat.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-stat.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-stat.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-status.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-status.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-status.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-countdown.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-countdown.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-countdown.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-diff.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-diff.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-diff.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-hover-3d.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-hover-3d.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-hover-3d.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-hover-gallery.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-hover-gallery.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-hover-gallery.api.md'),
  },
  {
    configPath: resolve(toolsDirectory, 'api-extractor-list.json'),
    baselinePath: resolve(workspaceRoot, 'etc/api/zordon-ui-list.api.md'),
    candidatePath: resolve(workspaceRoot, 'temp/api-extractor/zordon-ui-list.api.md'),
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
