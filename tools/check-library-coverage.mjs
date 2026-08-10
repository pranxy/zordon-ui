import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const DEFAULT_COVERAGE_REPORT = 'coverage/components/coverage-final.json';
export const DEFAULT_PACKAGE_ROOT = 'projects/components';

function isImplementationFile(filePath) {
  const normalized = filePath.replaceAll('\\', '/');
  const name = path.posix.basename(normalized);

  return name.endsWith('.ts') && !name.endsWith('.d.ts') && !name.endsWith('.spec.ts');
}

export function hasCoverableRuntime(source) {
  const sourceFile = ts.createSourceFile(
    'coverage-source.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  return sourceFile.statements.some(statement => {
    if (
      ts.isImportDeclaration(statement) ||
      ts.isImportEqualsDeclaration(statement) ||
      ts.isExportDeclaration(statement) ||
      ts.isNamespaceExportDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isEmptyStatement(statement) ||
      ts.isNotEmittedStatement(statement)
    ) {
      return false;
    }

    return !statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.DeclareKeyword);
  });
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function findImplementationFiles(sourceRoot) {
  const candidates = (await walk(sourceRoot)).filter(isImplementationFile);
  const runtimeFlags = await Promise.all(
    candidates.map(async file => hasCoverableRuntime(await readFile(file, 'utf8'))),
  );

  return candidates.filter((_, index) => runtimeFlags[index]).map(file => path.resolve(file));
}

export async function findLibraryImplementationFiles(packageRoot) {
  const candidates = (await walk(packageRoot))
    .filter(file => {
      const relativeParts = path.relative(packageRoot, file).replaceAll('\\', '/').split('/');
      return relativeParts[0] === 'src' || relativeParts[1] === 'src';
    })
    .filter(isImplementationFile);
  const runtimeFlags = await Promise.all(
    candidates.map(async file => hasCoverableRuntime(await readFile(file, 'utf8'))),
  );

  return candidates.filter((_, index) => runtimeFlags[index]).map(file => path.resolve(file));
}

function comparablePath(filePath) {
  const resolved = path.resolve(filePath).replaceAll('\\', '/');
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

export function validateCoverageReport({ coverage, implementationFiles }) {
  const measuredEntries = Object.entries(coverage ?? {});

  if (implementationFiles.length === 0) {
    const unexpectedRuntimeEntry = measuredEntries.find(
      ([, fileCoverage]) => Object.keys(fileCoverage.s ?? {}).length > 0,
    );
    if (unexpectedRuntimeEntry) {
      throw new Error(
        `Coverage report measures unexpected runtime file ${unexpectedRuntimeEntry[0]}.`,
      );
    }

    return { status: 'not-applicable', files: 0 };
  }

  if (measuredEntries.length === 0) {
    throw new Error('Coverage report is empty while eligible implementation files exist.');
  }

  const measuredByPath = new Map(
    measuredEntries.map(([filePath, fileCoverage]) => [comparablePath(filePath), fileCoverage]),
  );

  for (const implementationFile of implementationFiles) {
    const fileCoverage = measuredByPath.get(comparablePath(implementationFile));
    if (!fileCoverage) {
      throw new Error(`Coverage report does not measure ${implementationFile}.`);
    }

    const statements = Object.values(fileCoverage.s ?? {});
    if (statements.length === 0) {
      throw new Error(`Coverage report has no executable statements for ${implementationFile}.`);
    }

    if (!statements.some(count => Number(count) > 0)) {
      throw new Error(`Coverage report has no covered statements for ${implementationFile}.`);
    }
  }

  return { status: 'measured', files: implementationFiles.length };
}

export async function checkLibraryCoverage({
  workspaceRoot = process.cwd(),
  packageRoot = DEFAULT_PACKAGE_ROOT,
  reportPath = DEFAULT_COVERAGE_REPORT,
} = {}) {
  const absolutePackageRoot = path.resolve(workspaceRoot, packageRoot);
  const absoluteReportPath = path.resolve(workspaceRoot, reportPath);
  const implementationFiles = await findLibraryImplementationFiles(absolutePackageRoot);
  const coverage = JSON.parse(await readFile(absoluteReportPath, 'utf8'));

  return validateCoverageReport({ coverage, implementationFiles });
}

const isDirectInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectInvocation) {
  try {
    const result = await checkLibraryCoverage();
    if (result.status === 'not-applicable') {
      console.log('Coverage not applicable: no runtime implementation files exist yet.');
    } else {
      console.log(`Coverage structure verified for ${result.files} implementation file(s).`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
