# Phase 8 native focus compatibility

**Updated:** 2026-09-20

**Status:** Native pointer-focus milestone verified; remaining WebKit compatibility gates open.

**Commit:** `test: respect native pointer focus across browser engines`

This milestone resolves the pointer-focus assumptions found by the
[desktop browser audit](phase-8-browser-audit-progress.md). It preserves the component contracts
and native browser behavior; no library runtime or public API changes are required.

## Native behavior and corrections

A clean HTML probe containing ordinary buttons, links and an input showed that the installed
Windows WebKit runtime leaves a clicked native button unfocused. Chromium and Firefox focus
that button. A separate Tab probe from the first native link reaches the second link in
Chromium/Firefox and the input in this WebKit runtime. These observations characterize the
installed engine builds, not every supported operating system or browser preference.

Button and CDK focus-monitor tests now compare pointer behavior against a plain native button
in the same page. The Button directive must match that native control. CDK must report mouse
focus when the native click focuses the element, and leave an unfocused element without a
focused class otherwise. No browser-name branch, DOM patch or new skip is used.

Keyboard-order tests start with explicit focus. Drawer, Modal, FAB and Toast restoration tests
activate their focused openers/actions with Enter, making their focus precondition explicit.
They still verify the exact restored element. Pointer dismissal and outside interactions remain
covered. Drawer additionally verifies that clicking its search input focuses it inside the
modal, retaining the regression check for canceled pointer events in the shared Modal surface.

The ten corrected scenarios are:

- Browser foundation: deterministic keyboard order, native Button pointer behavior and CDK
  trapping/monitoring/restoration.
- Drawer: nested Escape and backdrop/Router closure.
- FAB: native disclosure/action closure and controlled action closure.
- Modal: native dialog form closure.
- Toast: queued and styled/action notifications.

All ten pass in each desktop engine in the focused run (30 passes) and the final full matrix,
including the additional Drawer input pointer-focus assertion. The complete 591-scenario matrix
finished with no retries or runner errors:

| Engine   | Passed | Failed | Explicit skips |
| -------- | -----: | -----: | -------------: |
| Chromium |    197 |      0 |              0 |
| Firefox  |    196 |      0 |              1 |
| WebKit   |    186 |     10 |              1 |

Ten of the original 19 WebKit failures are resolved. Its remaining failures comprise the nine
known link/Progress cases below plus a newly observed Calendar fixture direction-toggle miss.
That unchanged Calendar test passed five focused repetitions with two workers and no retries;
the full-run failure remains recorded as an intermittent release concern, not a pass.

Browser type checking, lint, touched-file formatting and whitespace checks pass. The library
runtime, public API and visual output are unchanged; builds, coverage, API and visual evidence
retain the previous component milestone's results. Full JSON evidence is in ignored
`tmp/webkit-focus-full.json`; focused logs are `tmp/webkit-focus-targeted.log` and
`tmp/webkit-calendar-repeat.log`. No staging, commit, workflow dispatch or publication was performed.

## Remaining work

Native link Tab behavior and the native Progress pseudo-element observation are separate from
pointer focus. The next milestone must preserve browser/user keyboard preferences and establish
observable assertions without adding skips or silently accepting missing values.

| Remaining scenarios                               | Count | Investigation                                                                                                                                                 |
| ------------------------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breadcrumbs overflow order and forced-color focus |     2 | Native disclosure/link Tab sequence.                                                                                                                          |
| Dock native order and forced-color focus          |     2 | Native link Tab sequence.                                                                                                                                     |
| Menu native order and focus outline               |     2 | Link traversal before checking focus visibility.                                                                                                              |
| Navbar native order                               |     1 | Native link traversal.                                                                                                                                        |
| Megamenu responsive panel                         |     1 | Link Tab/Shift+Tab and panel lifetime.                                                                                                                        |
| Progress reduced-motion fill                      |     1 | WebKit's empty computed native pseudo-element transition value.                                                                                               |
| Calendar grid fixture RTL toggle                  |     1 | Missed one direction change in the full run; five unchanged focused repetitions passed. Investigate input/fixture timing without hiding the original failure. |

The existing Chromium-only CDP swipe scenario remains the sole declared skip in each other
engine. Physical Safari/iOS, Edge/Android Chrome, Linux CI, manual accessibility, Angular consumer
lanes and delayed/incremental hydration remain unverified release gates. Delivery remains
**65/68 automated** and **0/68 Done**. Dependencies, budgets and coverage thresholds are unchanged.
