# Phase 8 packaged Angular consumer verification

**Updated:** 2026-09-20

**Status:** Local CSR verified on Windows/Linux and packaged SSR verified on Windows;
hosted execution, Linux SSR and broader release gates remain open.

**Commit:** `test: verify packaged Angular 21 and 22 consumers`

**Linux follow-up:** The same minimum, baseline and latest lanes now pass all 12 build/browser
combinations on Ubuntu 26.04 with Node 24.15.0. See
[Linux audit evidence and environment limits](phase-8-browser-audit-progress.md#linux-verification-follow-up).
Hosted workflow execution remains unverified. The original Windows evidence below is retained.

## Packaged SSR follow-up

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
fixture, plus the library ID generator. Incremental boundaries, broader component behavior,
Linux execution of the new SSR cases, hosted workflows and manual/device gates remain separate.
**Confirmed defect:** The baseline tarball changes Tab/TabPanel IDs from counters 0/1 to 2/3
across consecutive server responses. Preserved evidence: `tmp/consumer-ssr/tabs-before-fix/`.
The initial loopback-host setup failure is retained separately. The server now allows only
the runner's loopback host through `NG_ALLOWED_HOSTS`.
**Implementation:** Tabs allocates one application-scoped namespace and encodes stable item keys.
Aria still owns the reciprocal links and navigation. Fresh applications, multiple widgets,
reordering, removal/readdition and Unicode/punctuation keys have focused DOM regression coverage.
The generated API report changes only a protected helper; no public inputs or outputs changed.
**Next action:** Linux verification of the new SSR gate, followed by hosted/platform release evidence.
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
above supplies native Linux evidence; hosted workflow execution remains open.

## Remaining work

Next: verify hosted Linux workflows and the new SSR cases on Linux.
The current smoke fixture does not establish full component behavior on each Angular version,
all styling combinations, delayed/incremental hydration, physical/branded-browser coverage,
or manual assistive-technology approval. Those remain release gates.

Delivery remains **65/68 automated** and **0/68 Done**. No staging, commit, publication, dependency
range, coverage threshold or bundle-budget change is part of this milestone.
