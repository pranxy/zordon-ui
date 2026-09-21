# Phase 8 packaged Angular consumer verification

**Updated:** 2026-09-20

**Status:** Local Windows/Linux consumers and hosted push workflows verified;
the separate hosted browser audit and broader release gates remain open.

**Commit:** `test: verify packaged Angular 21 and 22 consumers`

**Linux follow-up:** The same minimum, baseline and latest lanes now pass all 12 build/browser
combinations on Ubuntu 26.04 with Node 24.15.0. See
[Linux audit evidence and environment limits](phase-8-browser-audit-progress.md#linux-verification-follow-up).
Hosted push-workflow evidence is recorded below. The original Windows evidence is retained.

## Packaged SSR follow-up

### Hosted verification

**Status:** Complete. **Baseline:** `c1d050f`.
**Commit:** `docs: record hosted compatibility verification`
**Scope:** Inspect existing push-triggered Actions runs for this exact commit; no workflow is
dispatched. Parent collects run/job/artifact metadata and resolves observed failures; a fresh
reviewer checks evidence and scope. Existing platform and manual release gates remain open.

| Task    | Acceptance                                                              | Status   |
| ------- | ----------------------------------------------------------------------- | -------- |
| HOST-01 | Verify all three hosted consumer lanes execute CSR and SSR successfully | Verified |
| HOST-02 | Verify main CI and distinguish independently unrun platform gates       | Verified |
| HOST-03 | Record source-linked evidence and independently review closure          | Verified |

**Next action:** Separate hosted three-engine browser audit, then product/device and manual gates.
**Resources:** Read-only GitHub API inspection completed; metadata and observation script retained
under `tmp/hosted-evidence/` and `tmp/hosted-verification.ps1`. The observer exited successfully;
no server, checkout or external action was created.
**Reviews:** Workflow scope scout and [independent evidence review](phase-8-hosted-review.md)
complete; Clear with no material findings. No source or workflow corrections were needed.

The [hosted consumer run](https://github.com/pranxy/zordon-ui/actions/runs/35539741448)
passed on the exact baseline, attempt 1. Every lane passed native dependency installation,
library build, Chromium/system dependency installation, CSR verification, SSR/hydration
verification and evidence upload. This establishes the configured 12 CSR and 6 SSR
build/browser combinations; it does not establish every component's behavior on every version.

| Lane     | Hosted job                                                                               | CSR  | SSR/hydration | Evidence upload |
| -------- | ---------------------------------------------------------------------------------------- | ---- | ------------- | --------------- |
| minimum  | [21.0.0](https://github.com/pranxy/zordon-ui/actions/runs/35539741448/job/106155137712)  | Pass | Pass          | Pass            |
| baseline | [21.2.19](https://github.com/pranxy/zordon-ui/actions/runs/35539741448/job/106155137606) | Pass | Pass          | Pass            |
| latest   | [22.1.7](https://github.com/pranxy/zordon-ui/actions/runs/35539741448/job/106155137563)  | Pass | Pass          | Pass            |

The [main CI run](https://github.com/pranxy/zordon-ui/actions/runs/35539741409) also passed
on the exact baseline, attempt 1, with every step successful:

| Job                                                                                                        | Verified scope                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ubuntu build-and-test](https://github.com/pranxy/zordon-ui/actions/runs/35539741409/job/106155137294)     | Formatting/lint, build/API/tooling/budgets/package dry run, coverage/types, Chromium browser/SSR and documentation tests/build/performance/accessibility/links |
| [Ubuntu prefix-floor](https://github.com/pranxy/zordon-ui/actions/runs/35539741409/job/106155137447)       | Tailwind 4.1.0 class-prefix compatibility                                                                                                                      |
| [Windows visual regression](https://github.com/pranxy/zordon-ui/actions/runs/35539741409/job/106155137486) | Existing Chromium visual comparisons                                                                                                                           |

GitHub reports three consumer artifacts and two CI report artifacts, all nonempty and
unexpired at inspection. Run/job/step/artifact metadata was checked against the exact SHA;
archive contents were not downloaded. Workflow sources retain these artifacts for 14 days.

The separate manual three-engine browser audit has no hosted runs as of this inspection.
Main CI permits Playwright retries, so run success alone is not zero-retry evidence. Windows
visual CI is distinct from Linux browser integration. Physical/browser-product, manual AT,
broader component/version and incremental-hydration gates remain open.

### Linux SSR verification

**Status:** Complete. **Baseline:** `75caaeb`.
**Commit:** `test: verify packaged SSR and hydration on Linux`
**Scope:** Run the existing six packaged SSR cases in an isolated Ubuntu workspace with
Node 24.15.0 and native dependencies. Parent owns runtime setup, evidence and cleanup;
an independent reviewer checks the final evidence. No hosted workflow dispatch is included.

| Task    | Acceptance                                                                      | Status   |
| ------- | ------------------------------------------------------------------------------- | -------- |
| LSSR-01 | Verify committed source and isolated native Linux runtime/install/build         | Verified |
| LSSR-02 | All three Angular lanes pass SSR/hydration in both zone modes                   | Verified |
| LSSR-03 | Review evidence, document environment limits and remove owned runtime resources | Verified |

**Environment:** Ubuntu 26.04 x64 under WSL2, Node 24.15.0, npm 11.12.1 and
Playwright 1.62.1 Chromium 151.0.7922.34. All 1,381 archived source files match the baseline;
Node checksum, fresh `npm ci`, native library build and all 86 tooling tests pass.
`libnss3`, `libnspr4` and `libasound2t64` were extracted locally and exposed with
`LD_LIBRARY_PATH`; no system packages were changed or browser checks disabled.
This local environment does not establish hosted Ubuntu workflow execution or physical devices.
**Results:** All six production build/browser combinations pass: Angular 21.0.0, 21.2.19 and
22.1.7, each in zone and zoneless mode. Each lane installs strict peers and checks all 68 typed
exports. Server/no-JavaScript content, repeated-request IDs, original-node reuse, stable
relationships and hydrated interactions pass with no browser/server errors. All lanes use
the same Linux-built tarball. No source or test correction was necessary.
**Evidence:** `tmp/linux-ssr-evidence/` contains source integrity, environment and Node checksum,
install/build/tooling logs, three lane reports, lockfiles, command logs and exit statuses.
**Next action:** See hosted verification above for completed push workflows and remaining gates.
**Resources:** Removed the task-owned workspace, three isolated consumers, Node runtime and
extracted libraries after review. No owned processes remain. Existing browser/user npm caches
and repository evidence/scripts are retained; see `tmp/linux-ssr-evidence/cleanup.json`.
**Reviews:** [Independent Linux SSR review](phase-8-linux-ssr-review.md): Clear.
No source changes, new skips, retries, dependency changes or gate relaxations were needed.

### Windows SSR verification

**Status:** Verified; commit-ready. **Baseline:** `4d64c79`.
**ADRs:** [Platform](../architecture/0001-platform-support.md),
[SSR and accessibility](../architecture/0007-accessibility-ssr-and-localization.md),
[Aria composition](../architecture/0008-angular-aria.md).
**Follow-up commit:** `fix(tabs): preserve identities through packaged hydration`

| Task   | Acceptance                                                                                                             | Status   | Evidence                                                                                                         |
| ------ | ---------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| SSR-01 | Extend isolated tarball consumers to production SSR on three Angular versions and both zone modes                      | Verified | All six production builds/browser runs pass; strict peers and 68 exports; pins unchanged                         |
| SSR-02 | Prove server content, no-JavaScript content, DOM reuse, stable accessible relationships and live hydrated interactions | Verified | Original nodes/relationships preserved in all six runs; disabled client hydration fails the node-reuse assertion |
| SSR-03 | Resolve demonstrated compatibility defects and prove regression sensitivity                                            | Verified | Tabs supplies deterministic IDs through public Aria inputs; pre-fix SSR and two unit regressions fail, then pass |
| SSR-04 | Run the six SSR combinations, affected existing checks, independent review and resource cleanup                        | Verified | All checks below pass; independent review Clear; eight owned consumer workspaces removed                         |

**Scope:** Ordinary full-page hydration of the packaged Button, native Forms and Aria-backed Tabs
fixture, plus the library ID generator. Incremental boundaries and broader component behavior
remain separate. Hosted and Linux execution are verified above; manual/device gates remain open.
**Confirmed defect:** The baseline tarball changes Tab/TabPanel IDs from counters 0/1 to 2/3
across consecutive server responses. Preserved evidence: `tmp/consumer-ssr/tabs-before-fix/`.
The initial loopback-host setup failure is retained separately. The server now allows only
the runner's loopback host through `NG_ALLOWED_HOSTS`.
**Implementation:** Tabs allocates one application-scoped namespace and encodes stable item keys.
Aria still owns the reciprocal links and navigation. Fresh applications, multiple widgets,
reordering, removal/readdition and Unicode/punctuation keys have focused DOM regression coverage.
The generated API report changes only a protected helper; no public inputs or outputs changed.
**Next action:** See hosted verification above for remaining platform release evidence.
**Reviews:** Setup scout, sequential runner/Tabs writers and a fresh independent reviewer completed.
[Implementation review](phase-8-consumer-ssr-review.md): Clear, no material findings.
**Resources:** Eight task-owned consumer workspaces removed after review; reports, lockfiles,
failure evidence and npm/browser caches retained for diagnosis and reuse. Browser/server children
terminated; no owned server remains. Cleanup evidence: `tmp/consumer-ssr-cleanup.json`.

Windows SSR results (Node 24.21.0, Playwright 1.62.1 Chromium):

| Angular | Zoneless production SSR | Zone production SSR |
| ------- | ----------------------- | ------------------- |
| 21.0.0  | Pass                    | Pass                |
| 21.2.19 | Pass                    | Pass                |
| 22.1.7  | Pass                    | Pass                |

Evidence: `tmp/consumer-ssr/{minimum,baseline,latest}/`, including exact lockfiles, commands,
tarball integrity, HTML and before/after relationship records. `tmp/consumer-ssr-negative.log`
and its report prove the node-reuse oracle rejects a client bootstrap without hydration;
only the disposable consumer was changed and its source was restored afterward.

Affected checks also pass: all 12 existing CSR combinations with the same corrected tarball,
380 unit tests in 85 files with 100% coverage across 82 implementation files, 86 tooling tests,
library types/lint, all 68 API reports and package budgets, production library/docs/SSR builds,
28 source SSR scenarios, 12 Tabs scenarios across Chromium/Firefox/WebKit and the Tabs visual
test covering both existing baselines. Existing advisory build warnings remain; hard budgets,
coverage thresholds and dependency versions are unchanged. Workflow YAML, formatting and
whitespace checks pass. No hosted workflow was dispatched and nothing was staged or committed.

The desktop browser milestone verified the workspace application. This milestone checks the
distributed package in independent Angular installations so source aliases and shared workspace
dependencies cannot hide packaging or compiler compatibility failures.

## Delivered

- A tarball consumer runner with strict peer installation, complete dependency-tree validation,
  all typed package exports, development/production builds, and zone/zoneless browser checks.
- Exact minimum, current baseline and latest-supported-major lanes, with the Aria/CDK 21.2.14
  pair preserved. The library's Angular 21 build and published peer ranges are unchanged.
- An Ubuntu CI matrix with independent failures and uploaded reports, resolved lockfiles,
  command output and package integrity. No workflow was dispatched from this task.
- [Reproduction instructions and scope](../testing/consumer-compatibility.md).

## Original CSR milestone verification

Local Windows execution used Node 24.21.0 and Chromium from Playwright 1.62.1. All consumers
installed without peer overrides and compiled **68 typed exports** with library type checking
enabled. Each row passed both build and browser verification:

| Angular | Zoneless development | Zoneless production | Zone development | Zone production |
| ------- | -------------------- | ------------------- | ---------------- | --------------- |
| 21.0.0  | Pass                 | Pass                | Pass             | Pass            |
| 21.2.19 | Pass                 | Pass                | Pass             | Pass            |
| 22.1.7  | Pass                 | Pass                | Pass             | Pass            |

Total: **12 successful builds and 12 successful browser smoke runs**. Checks cover bootstrap,
runtime export loading, Zone presence/absence, signal-driven Button changes, native Forms
updates, and controlled Aria Tabs keyboard selection. No browser errors were observed.

The library production build, all **84 tooling tests**, API reports, bundle budgets, workflow
YAML parsing, touched-file formatting and whitespace checks pass. Library runtime, styles and public API are
unchanged; the earlier full component browser matrix, unit coverage and visual evidence remain
applicable and were not rerun for this tooling-only change.

Evidence is in ignored `tmp/consumer-compatibility/{minimum,baseline,latest}/`, with top-level
logs in `tmp/consumer-*.log`. The three tarball integrity values agree. The Linux follow-up
above supplies native Linux evidence; hosted push-workflow results are recorded above.

## Remaining work

Next: verify the separate hosted three-engine audit and supported browser products/devices.
The current smoke fixture does not establish full component behavior on each Angular version,
all styling combinations, delayed/incremental hydration, physical/branded-browser coverage,
or manual assistive-technology approval. Those remain release gates.

Delivery remains **65/68 automated** and **0/68 Done**. No staging, commit, publication, dependency
range, coverage threshold or bundle-budget change is part of this milestone.
