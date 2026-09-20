# Phase 8 desktop browser audit

**Updated:** 2026-09-20

**Status:** Audit delivered; local desktop matrix verified in follow-up; broader release gates open.

**Commit:** `test: establish desktop browser compatibility audit`

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
hardening now pass the local desktop matrix. Continue with Angular consumer compatibility and
Linux CI verification, followed by the remaining platform and manual release gates.

Physical Safari/iOS, Edge and Android Chrome, manual assistive technology, custom-theme
contrast, high zoom, Angular version lanes, zone/zoneless consumer builds and delayed/incremental
hydration remain separate release gates. Overall delivery remains **65/68 automated** and
**0/68 Done**. No dependency ranges, bundle limits or coverage thresholds are changed.
