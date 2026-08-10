# Unit testing and coverage

The library uses Angular's `unit-test` builder with Vitest, jsdom, and V8 coverage. Run the same
gate used by CI with:

```shell
npm run test:lib:coverage
```

## Coverage contract

The test target force-includes every TypeScript implementation file under the primary
`projects/components/src/` tree or a future `projects/components/<entry-point>/src/` tree, even when
no test imports that file. It excludes test files and declarations. The structural check is
content-aware: pure type/import/re-export modules have no Istanbul-mapped statements, while
executable constants, enums, helpers, classes, or expressions remain covered even when they live in
`*.types.ts`, `index.ts`, or `public-api.ts`. Legacy folders without an active `src/` entry-point tree
remain outside the new package contract. Each included file must meet 100% for mapped statements,
branches, functions, and lines. The structural check then rejects an empty report, a missing
implementation file, or a file with no executable or covered statements before CI can call the
result successful.

The package currently has no implementation files because component work starts in Phase 2. An
empty report is therefore the expected bootstrap result. As soon as an implementation file is
added, coverage inclusion makes an untested file visible and the per-file thresholds make the
command fail.

The 100% threshold is an execution-completeness invariant for this new library, not evidence that
the tests are good. Tests must still assert observable behavior, accessibility, Angular Forms,
cleanup, SSR/hydration, and failure paths required by the relevant component specification. Avoid
tests that merely execute lines or repeat implementation details.

Do not add a coverage exclusion to make a change pass. A necessary exclusion requires documented
justification in the same review and must remain limited to test or generated infrastructure; a
filename alone is not justification. If a future implementation cannot reasonably preserve the
threshold, change the policy explicitly with test-quality evidence instead of silently weakening it.
