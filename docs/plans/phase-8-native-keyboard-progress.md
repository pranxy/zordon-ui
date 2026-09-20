# Phase 8 native keyboard and paint verification

**Updated:** 2026-09-20

**Status:** Local desktop matrix verified; platform and release gates remain open.

**Commit:** `test: verify native keyboard policy and reduced-motion paint`

This milestone addresses the remaining cases from
[native focus compatibility](phase-8-native-focus-progress.md): eight link-navigation assertions,
the Progress native-fill assertion, and the intermittent Calendar fixture toggle. Changes are
limited to browser tests and their internal fixtures; component runtime and APIs are unchanged.

## Native link keyboard policy

The lazy `nativeLinkTab` fixture opens a temporary plain page in the same browser context. It
presses Tab from a button preceding a native link and input, asserts that the destination is
one of those controls, records the observed policy in the test report, and closes the page in
`finally`. It makes no engine-name assumption and does not change browser preferences, library
DOM, `tabindex`, or keyboard handlers. Unexpected native destinations fail fixture setup.

When Tab includes links, the existing sequential link assertions remain. When it bypasses
links, tests assert the actual native destination: the report input for Breadcrumbs, the outside
action for Dock, the Resources disclosure button for Menu, and exit from Navbar. Direct link
focus and Enter still verify focusability and Router activation. Focus outlines are checked
after keyboard input. In Megamenu, reverse traversal from the search field exits the portaled
panel to the fixture's After navigation button; ArrowDown then explicitly reopens its keyboard
interaction. No scenario is skipped or treated as passing without an assertion.

Breadcrumbs performs keyboard entry and focus checks before the axe scan. This avoids using
axe's temporary iframe teardown as a keyboard-navigation starting state; axe still scans the
open disclosure afterward. The installed Windows engines report native link inclusion for
Chromium/Firefox and bypass for WebKit. This is a measured runtime policy, not universal
keyboard-product certification.

## Progress paint evidence

Computed native pseudo-element styles are not consistently exposed by the engines. The new
assertion captures full and partial native fills with transitions explicitly disabled as
references, removes that reference override, and adds a 60-second consumer fill transition. With
reduced motion active, each value must immediately match its exact reference. The two reference
images must also differ. Screenshots use `animations: 'allow'`, so Playwright cannot finish or
disable the transition on the test's behalf. Comparisons are within the same run and engine;
no new platform-dependent committed baseline is required.

All nine Progress cases pass across the three engines. A temporary WebKit mutation that forced
the slow transition back on with a stronger important rule failed the partial-paint assertion as
expected. The temporary mutation file was removed. The test therefore detects the behavior it
is intended to prevent rather than accepting an empty computed-style value.

## Calendar fixture stability

The documentation page enables smooth scrolling. The Calendar grid keyboard tests now request
reduced motion before navigation and assert the page's computed scroll behavior is `auto`.
This makes the page-scroll precondition explicit while testing roving focus, live RTL and native
activation. The direction-toggle case passed 20 WebKit repetitions with two workers and no
retries. The original intermittent miss did not provide enough evidence to establish its exact
cause; this is test-environment hardening, not a claimed Calendar runtime fix.

## Verification

- Native-policy navigation: all 20 WebKit cases pass across the focused runs after corrections.
- Progress: 9 cases pass across all engines; the deliberate negative control fails as intended.
- Chromium/Firefox affected suites: 46 cases pass.
- Calendar direction-toggle stress: 20 WebKit passes.
- Browser type checking and lint pass.

The full matrix completed all 591 scenarios with two workers, no retries, no flaky results and
no runner errors:

| Engine   | Passed | Failed | Explicit skips |
| -------- | -----: | -----: | -------------: |
| Chromium |    197 |      0 |              0 |
| Firefox  |    196 |      0 |              1 |
| WebKit   |    196 |      0 |              1 |

Total: **589 passed, 2 existing CDP touch skips**. After the full run, the exact partial Progress
reference was strengthened; all nine Progress cases passed again across the three engines.
Touched-file formatting and whitespace checks pass. Library builds, unit coverage, API and visual
evidence retain the preceding component milestone's results because library runtime and APIs
are unchanged. Logs are in
ignored `tmp/webkit-policy-*`, `tmp/webkit-links-focused.log`, `tmp/webkit-tab-final-focused.log`,
`tmp/webkit-progress-paint.log`, `tmp/webkit-progress-final.log`, `tmp/webkit-progress-negative-control.log` and
`tmp/webkit-calendar-stress.log`.

Physical Safari/iOS, Edge/Android Chrome, Linux CI execution, manual accessibility, Angular
consumer-version lanes and delayed/incremental hydration remain separate release gates.
Delivery remains **65/68 automated** and **0/68 Done**. No dependency range, budget, or coverage
threshold changes. No staging, commit, workflow dispatch or publication is performed here.
