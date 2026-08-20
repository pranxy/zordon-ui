import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(toolsDirectory, '..');
const configPath = resolve(toolsDirectory, 'api-extractor.json');
const apiExtractorPath = resolve(
  workspaceRoot,
  'node_modules/@microsoft/api-extractor/bin/api-extractor',
);
const baselinePath = resolve(workspaceRoot, 'etc/api/zordon-ui.api.md');
const candidatePath = resolve(workspaceRoot, 'temp/api-extractor/zordon-ui.api.md');

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
  const result = spawn(
    process.execPath,
    ['--no-warnings', apiExtractorPath, 'run', '--config', configPath],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
    },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`API Extractor failed with exit code ${result.status ?? 'unknown'}.`);
  }

  const [baseline, candidate] = await Promise.all([
    readFile(baselinePath, 'utf8'),
    readFile(candidatePath, 'utf8'),
  ]);
  assertApiReportsMatch(baseline, candidate);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkApiReport().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
