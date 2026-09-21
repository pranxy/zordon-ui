# Phase 8 desktop browser audit

**Updated:** 2026-09-20

**Status:** Audit delivered; local desktop matrix verified in follow-up; broader release gates open.

**Commit:** `test: establish desktop browser compatibility audit`

## Linux verification follow-up

### Hosted Filter reset investigation

**Status:** Local correction verified; hosted rerun pending. **Updated:** 2026-09-21.
**Baseline:** Hosted run on `c1d050f`; checkout `75cd510` changes only evidence docs.
**Run:** [35569201338](https://github.com/pranxy/zordon-ui/actions/runs/35569201338).
Chromium and Firefox jobs passed. WebKit reported 195 passes, one existing skip and one
Filter reset failure, without retries. Earlier source-map/SSR-handler warnings do not identify
the reset failure's cause.

| Task      | Acceptance                                                                             | Status   |
| --------- | -------------------------------------------------------------------------------------- | -------- |
| FILTER-01 | Inspect native reset ownership and reproduce/characterize the failure                  | Verified |
| FILTER-02 | Make only evidence-supported corrections while retaining native interaction assertions | Verified |
| FILTER-03 | Verify affected engines, independent review and owned-resource cleanup                 | Verified |

The original test passed 15 Windows WebKit repetitions but failed twice in 20 isolated Linux
repetitions. A minimal native-event probe reproduced the failure after eight passes. At the
same pointer coordinate `(90, 407)`, Reset received `pointerdown`/`mousedown`, All received
`pointerup`/`mouseup`, and their containing form received `click`. No `reset` event occurred.
Failure screenshots show the surrounding page moving during the click. The docs stylesheet
sets smooth scrolling on `html`; focusing Open initiates scrolling down the long fixture page.
The Filter directives themselves only compose classes.

The test now requests reduced motion and verifies `html` uses `scroll-behavior: auto` before
focusing Open. This uses the docs' existing reduced-motion CSS, as the Calendar probe already
does. It retains keyboard Space selection, a real pointer click on Reset and the assertion
that All becomes checked; it also requires Open to become unchecked. There is no synthetic
reset, forced click, sleep, retry increase, or production behavior change. This is a native
selection/reset contract check with deterministic scrolling, not smooth-scroll coverage.

**Validation:** Corrected Windows Chromium/Firefox/WebKit cases all pass (three tests).
Browser type checking, lint and changed-file formatting pass. Corrected Linux WebKit passes
all 40 stress repetitions and the full suite (196 passes, one existing skip), with zero retries.
**Environment:** Isolated archive of `c1d050f`, fresh locked install and library build,
Ubuntu 26.04 x64 WSL, checksum-verified Node 24.15.0, Playwright 1.62.1. Browser libraries
were locally extracted; `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` bypasses installation
preflight only. Real browser actions/assertions execute with `CI=true`, one worker and zero
retries. This does not verify hosted system-library installation.
**Evidence:** Ignored `tmp/filter-linux-evidence/` contains source/environment metadata,
`before.log`, original failure traces in `before-artifacts.tar.gz`, `probe3.log`, and
`failed-native-events.json`. Windows results are in `tmp/filter-fixed-windows.log`.
**Next action:** Commit, push and rerun the hosted
Browser compatibility audit on the updated revision.
**Resources:** Source-integrity verification confirms only the intended test differs from
`c1d050f`, exactly matching this checkout; the diagnostic probe was removed. The isolated
Linux workspace and all 1,406 owned browser-library links were removed, with no owned process
remaining. Download caches and ignored diagnostic evidence are retained. See
`tmp/filter-linux-evidence/final-integrity.json` and `cleanup.json`.
**Reviews:** Read-only source scout and independent [final review](phase-8-filter-reset-review.md)
are Clear. Parent accepted the correction; no material findings remain.

### Prior Linux verification

**Status:** Partial — local checks verified; hosted execution and platform gates remain open.
**Updated:** 2026-09-20.
**ADRs:** [Platform support](../architecture/0001-platform-support.md),
[accessibility and SSR](../architecture/0007-accessibility-ssr-and-localization.md).
**Follow-up commit:** `test: verify Linux compatibility and isolate teardown checks`

This commit-sized follow-up runs the existing desktop and packaged-consumer gates on native
Linux. Hosted Actions execution, branded/physical browsers and packaged SSR/hydration remain
separate pending work. It does not widen the current release claim.

| Task   | Acceptance                                                                          | Status   | Evidence                                                                                                                        |
| ------ | ----------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| LIN-01 | Isolate the committed source with Linux Node 24.15.0 and a fresh locked install     | Verified | Revision `0323250`; Ubuntu 26.04 x64 WSL; checksum-verified Node distribution; fresh `npm ci` and production library build pass |
| LIN-02 | Run all three tarball consumer lanes without peer overrides                         | Verified | All 12 build/browser combinations pass; 68 typed exports per consumer; Node 24.15.0                                             |
| LIN-03 | Run the desktop engine suites without retries; investigate failures                 | Verified | Initial failure diagnosed; final per-engine evidence verifies 589 enabled scenarios and two existing skips                      |
| LIN-04 | Reconcile evidence, complete independent review and account for temporary resources | Verified | Independent review Clear; negative control and restoration verified; owned workspace, links and registration removed            |

**Next action:** Packaged SSR/hydration verification; hosted workflow execution remains open.
**Reviews:** Independent [Linux verification review](phase-8-linux-review.md) is Clear. Parent
accepted the test correction and cleanup guidance; no material findings remain.
**Deviations:** Local Ubuntu is 26.04, not a claim of identical hosted-runner execution.
**Resources:** The isolated Linux workspace (including its Node runtime, consumers and extracted
libraries) was removed after preserving reports. All 1,406 temporary WebKit library links were
removed, and no owned process remained. Downloaded browser/npm caches are retained for reuse;
raw evidence and setup scripts remain under ignored `tmp/`. See `tmp/linux-evidence/cleanup.json`.
No Git worktree, branch, commit or remote workflow dispatch was created.

### Local Linux environment and limits

The source was copied with `git archive 0323250`, with no Windows `node_modules`, path aliases
to the owner checkout, or dependency-manifest edits. The Node 24.15.0 Linux archive was checked
against its distribution SHA-256 manifest. The clean install added 956 packages; the production
library build and all 84 tooling tests pass on Linux. Git blob hashes for all 1,376 tracked
files match the committed source, with zero mismatches.

Ubuntu's browser libraries were downloaded from its package repositories and extracted into
the verification workspace, without a system-wide installation. Chromium and Firefox launch
with `LD_LIBRARY_PATH` pointing at those libraries. WebKit's bundled launcher replaces that
variable, so its previously missing libraries were linked into the bundle's `sys/lib` directory;
existing bundle files and the launcher were preserved.

Playwright's dlopen preflight checks the system `ldconfig` cache, which cannot see these local
libraries. Direct `ctypes.CDLL` checks successfully load `libGLESv2.so.2` and `libx264.so.165`.
After those checks, the desktop run uses `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`.
That bypass applies only to the installation preflight: real browser startup, actions and all
test assertions still execute. WebKit 26.5 launched and handled a native button interaction.
This local arrangement is **not** verification of the workflow's `install --with-deps` step.

The local audit uses `CI=true`, two workers, no retries and failure traces. Hosted workflows
use standard system libraries and one worker per engine. Browser versions match the locked
Playwright 1.62.1 downloads: Chromium 151.0.7922.34, Firefox 153.0 and WebKit 26.5. Hosted Actions
execution, fonts/media capability outside the tested scenarios and physical products remain
unverified. No repository skip, assertion or browser configuration was relaxed for this run.

Linux consumer reports, resolved lockfiles and command logs are copied to
`tmp/linux-evidence/consumer/{minimum,baseline,latest}/`. Setup, build and runner logs are
retained as `tmp/linux-*.log`; desktop results are `tmp/linux-evidence/browser-audit.json`.

### Tooltip teardown correction

The initial full Linux run completed all 591 scenarios: Chromium 197 passes, Firefox 196 passes
and one skip, WebKit 195 passes, one failure and one skip. There were no retries or runner
errors. In the Tooltip/Dropdown lifecycle case, the open tooltip physically covered the
fixture's **Toggle presence** button. Playwright's hit-tested click could not reach that
button; the failure trace identifies the tooltip body as the intercepting element.

The final lifecycle step now calls the fixture button's native `HTMLButtonElement.click()`
through locator evaluation. This invokes its existing Angular owner-destruction handler without
moving focus or requiring a particular spatial relationship to an open overlay. Earlier real
pointer and keyboard interactions are unchanged. The test still requires the open dialog before
destruction and zero overlay panes afterward, and now also requires the owner's trigger to be
detached. This is an explicit lifecycle test, not evidence of a physical click through an overlay.

All 18 Tooltip cases pass across the three Windows engines after the correction. A bounded
negative control changed only the disposable Linux fixture's toggle handler to a no-op; the
corrected test failed at the trigger-detached assertion as intended. The fixture was restored
before the final WebKit run. A second 1,376-file integrity check confirms that only the intended
Tooltip test differs from `0323250`, exactly matching the owner checkout, and that the fixture
mutation is absent. Browser type checking and lint pass.

Initial failure JSON and `initial-browser-artifacts.tar.gz` remain under `tmp/linux-evidence/`.
The full WebKit rerun is recorded separately as `webkit-final.json`; Windows and negative-control
logs are `tmp/linux-tooltip-windows.log` and `tmp/linux-tooltip-negative.log`.

The corrected full WebKit lane passes **196 tests with one existing CDP touch skip**, without
retries, flaky outcomes or runner errors. Chromium and Firefox retain their full initial-lane
results; their corrected lifecycle case is also checked in a separate Linux follow-up. Together
these runs verify all **589 enabled desktop scenarios**, with the same **two declared skips**.
This is combined evidence after a correction, not a claim that the initial 591-scenario run passed.

| Engine   | Full lane passes | Declared skips | Evidence                                          |
| -------- | ---------------: | -------------: | ------------------------------------------------- |
| Chromium |              197 |              0 | Initial full audit plus corrected lifecycle check |
| Firefox  |              196 |              1 | Initial full audit plus corrected lifecycle check |
| WebKit   |              196 |              1 | Full corrected rerun                              |

## Earlier audit record

**Follow-up:** The [native focus milestone](phase-8-native-focus-progress.md) resolves ten of the
original WebKit failures. [Native keyboard and paint verification](phase-8-native-keyboard-progress.md)
addresses the remaining local backlog and records 589 passes with two existing CDP touch skips.
The initial audit results below remain historical evidence.

This first Phase 8 milestone exercises the existing component suite in the configured desktop
engines and makes the audit repeatable in CI. It does not widen platform support or mark the
component accessibility reviews complete.

The manual `Browser compatibility audit` workflow installs each engine and its Linux system
dependencies in an independent job. All three jobs run without retries, fail independently and
retain JSON/HTML results plus failure traces, screenshots and videos. The existing Chromium PR
gate and Windows visual comparisons continue separately. The workflow is added as source;
it has not been dispatched from this local task.

The local audit starts from Drawer commit `bd0dcfc` and uses Windows, Angular 21.2.19,
Playwright 1.62.1, Firefox 153.0 (revision 1538)
and WebKit 26.5 (revision 2336). Chromium 151.0.7922.34 (revision 1234) provides the existing
baseline. All engine revisions come from the installed Playwright registry.

Drawer's native touch injection is explicitly Chromium-only because it uses CDP. The other
Drawer scenarios remain enabled in Firefox and WebKit. This exception is reported as a skip,
not a successful touch check; physical touch remains a release gate.

## Initial audit

The full Firefox/WebKit run completed all 394 selected scenarios without retries or runner
errors. Raw reports are in ignored `tmp/phase8-browser-audit.json`; the reproducible command is:

```sh
npx playwright test --project=firefox --project=webkit --workers=2 --retries=0 --reporter=json
```

| Engine  | Passed | Failed | Explicit skips |
| ------- | -----: | -----: | -------------: |
| Firefox |    194 |      2 |              1 |
| WebKit  |    177 |     19 |              1 |

The two Firefox failures were test assumptions. Accordion now enters focus with actual Tab and
Shift+Tab before checking the focus-visible outline, instead of expecting an already-focused
element to acquire a keyboard ring after Home. Progress queries Firefox's `::-moz-progress-bar`
instead of a WebKit pseudo-element. Assertions still require the visible outline and a zero
transition duration. All seven Accordion/Progress cases pass in both Chromium and Firefox;
WebKit passes six and still fails the native Progress transition query.

The complete Firefox rerun passes **196 tests with one declared CDP touch skip**, with no
failures, retries or runner errors. All **11 modified Chromium scenarios pass**, including the
native Drawer touch test. The initial full WebKit result remains **177 passed, 19 failed and
one explicit skip**; its focused Accordion/Progress rerun confirms **6 passed and 1 failed**.
The WebKit lane is not approved for release.

Browser type checking, browser lint, all 82 tooling tests, touched-file formatting and whitespace
checks pass. The workflow YAML parses and contains three independent browser lanes with manual
dispatch. No library runtime or public API changed, so library builds, unit coverage, API reports
and screenshots retain the preceding component milestone's evidence rather than a new run.
Final logs are in ignored `tmp/phase8-firefox-final.json`, `tmp/phase8-chromium-final.log` and
`tmp/phase8-portability-focused.log`. No commit, workflow dispatch or publication was performed.

## Initial WebKit backlog

These were the initial failing assertions awaiting classification as test assumptions, fixture
timing, or implementation defects. The local backlog is now addressed in
[native keyboard and paint verification](phase-8-native-keyboard-progress.md).

| Scenarios                                                                   | Count | Observed failure / next investigation                                                                                                                                 |
| --------------------------------------------------------------------------- | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser foundation: deterministic order; Button state; CDK focus monitoring |     3 | Native button clicks do not produce the expected focus or mouse-origin class. Characterize native behavior before changing a library contract.                        |
| Breadcrumbs: overflow keyboard order and forced-color focus                 |     2 | Tab from the open summary does not focus the first ancestor link.                                                                                                     |
| Dock: native keyboard order and forced-color focus                          |     2 | Tab does not land on the expected Home/Search links.                                                                                                                  |
| Menu: native link order and RTL tree focus indicator                        |     2 | Expected Inbox focus and solid tree outline are absent.                                                                                                               |
| Navbar: native Tab order                                                    |     1 | Expected Overview link does not receive focus.                                                                                                                        |
| Drawer: nested Escape and backdrop/route close                              |     2 | Focus does not return to the expected clicked opener.                                                                                                                 |
| FAB: native disclosure and controlled close                                 |     2 | Expected trigger focus is absent after dismissal.                                                                                                                     |
| Modal: native dialog close                                                  |     1 | Expected Open native trigger focus is absent.                                                                                                                         |
| Toast: queued and styled notifications                                      |     2 | Expected clicked button focus is absent.                                                                                                                              |
| Megamenu: responsive full-width panel                                       |     1 | Expected Components link is missing at the focus assertion; inspect focus-opening policy and fixture readiness.                                                       |
| Progress: reduced-motion native fill transition                             |     1 | WebKit returns an empty computed transition duration for its native fill pseudo-element. Establish an observable assertion without silently accepting an empty value. |

Native pointer-focus and keyboard-policy checks, Progress paint verification and Calendar fixture
hardening pass the Windows desktop matrix. Packaged Angular consumers also pass locally on
Windows and Linux; hosted CI, packaged SSR/hydration, platform and manual release gates remain.

Physical Safari/iOS, Edge and Android Chrome, manual assistive technology, custom-theme
contrast, high zoom, full component behavior across Angular versions and delayed/incremental
hydration remain separate release gates. Overall delivery remains **65/68 automated** and
**0/68 Done**. No dependency ranges, bundle limits or coverage thresholds are changed.
