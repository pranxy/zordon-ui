# Phase 8 packaged Angular consumer verification

**Updated:** 2026-09-20

**Status:** Local Windows and Linux consumer matrices verified; hosted execution and broader release gates open.

**Commit:** `test: verify packaged Angular 21 and 22 consumers`

**Linux follow-up:** The same minimum, baseline and latest lanes now pass all 12 build/browser
combinations on Ubuntu 26.04 with Node 24.15.0. See
[Linux audit evidence and environment limits](phase-8-browser-audit-progress.md#linux-verification-follow-up).
Hosted workflow execution remains unverified. The original Windows evidence below is retained.

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

## Verification

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

Next: expand packaged consumer verification to SSR and hydration, and verify hosted Linux workflows.
The current smoke fixture does not establish full component behavior on each Angular version,
all styling combinations, delayed/incremental hydration, physical/branded-browser coverage,
or manual assistive-technology approval. Those remain release gates.

Delivery remains **65/68 automated** and **0/68 Done**. No staging, commit, publication, dependency
range, coverage threshold or bundle-budget change is part of this milestone.
