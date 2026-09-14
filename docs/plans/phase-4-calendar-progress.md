# Phase 4 Calendar progress

**Row:** INP-01 Calendar  
**Status:** Preview implemented; automated verification complete; manual accessibility pending  
**Last updated:** 2026-09-14

| ID  | Requirement                                                            | Status                                           | Evidence                                                     |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| T01 | Dates, modes, forms, localization, styling, popup and gap contracts    | Verified                                         | `docs/components/calendar.md`                                |
| T02 | Aria integration and public isolation on the requested Angular 21 lane | Verified locally                                 | Grid probe, real Calendar tests, generated API report        |
| T03 | Adapter, component, public entry point and Forms                       | Verified                                         | `projects/components/calendar/`                              |
| T04 | Type/unit/browser/SSR/accessibility/visual/package evidence            | Automated checks verified; manual review pending | Results below                                                |
| T05 | Documentation, API report, changeset and handoff                       | Recorded                                         | Component docs, visual/manual records, API report, changeset |

## Scope decision

The user explicitly requested Angular 21 after declining isolated Angular 21.0/22 compatibility
dependency installation. Calendar is therefore delivered against the installed Angular 21.2.19
and Aria/CDK 21.2.14. The Angular 21.0 floor and Angular 22 remain unverified. Aria is a root
development dependency and exact published runtime peer; it requires matching CDK. No other
Angular version was installed. This scoped decision does not complete the plan's broad Aria
compatibility foundation gate.

## Verification

- Library unit suite: 239 tests; 100% per-file statements, branches, functions and lines;
  structural coverage verified for 57 implementation files.
- Calendar covers all modes, civil-date/leap/year boundaries, locale/week start, bounds,
  readonly/disabled state, native/fallback popup, prefixes, custom content, typed Forms,
  reset, updateOn blur, async validators, and dynamic form-array recreation.
- Full Chromium regression suite: 110 passing tests, including Calendar and the repaired OTP test.
- Final focused Calendar browser suite: three passing tests, including consumer sizing, reduced motion and forced colors.
- SSR suite: five passing tests, including Calendar server markup, deterministic IDs,
  JavaScript-disabled content, hydration, selection, popup and scoped axe scans.
- Visual suite: 54 passing tests. Three new Calendar images were opened and inspected.
- Public types and partial-Ivy library build pass. Calendar has its own API report with no Aria
  declarations exposed. All 45 entry points pass package budgets; Calendar is 36.10 KiB raw / 7.20 KiB gzip (limits 40 / 12). Package dry-run passes.
- Tooling suite: 62 passing tests. Library, browser, and SSR lint plus browser type checks pass.

Firefox and WebKit checks could not launch because their Playwright binaries are not installed;
no assertion results are claimed for those engines. Chromium is the required default local
browser gate. Physical mobile and manual assistive-technology review remain open.

Repository-wide `format:check` reports extensive existing formatting issues outside this change.
Touched files are formatted and checked separately; unrelated files are not reformatted merely
to clear that baseline. The docs and SSR fixture builds retain warning-level initial-bundle
messages; hard build budgets are unchanged.

## Integration findings and repairs

The initial Aria spike verified explicit server attributes/IDs and distinguished Aria selection
events from native button activation. The final Calendar uses native pressed-state day buttons
with Aria selection disabled, preserving one date-value transition per activation. It supplies
only date-specific paging beyond the rendered grid. The SSR test app now routes its primary
fixture and Calendar probes lazily rather than adding Aria to its former eager fixture bundle.

Required repository checks exposed existing OTP issues: incomplete coverage, an incorrectly
nested browser test, and a missing/misconfigured API report. The added regression cases also
found rejected input remaining visible after filtering/reset; the native cell is now normalized
immediately. An unreachable private emission branch was removed and accessor factory metadata
was made directly testable. The public OTP API remains unchanged. The API inventory test now
checks report membership independently of registry order and includes Calendar.

Conventional Commit handoff: `feat(calendar): add Angular 21 date selection component`

Manual accessibility is explicitly pending: do not mark Calendar Done or stable until
`docs/components/calendar-accessibility-review.md` has real human evidence.
