# Phase 3 Link specification progress

**Row:** NAV-03 Link  
**Status:** In progress  
**Last updated:** 2026-08-20

## Deliverable

Lock the public/native boundary for an anchor-only Link directive before implementation. The
specification covers daisyUI tokens, Router coexistence, unavailable navigation, accessibility,
SSR, customization, and the Preview evidence plan.

Template loaded from: `implement-plan/assets/progress-tracker-template.md`

| ID  | Requirement                                                      | Deps    | Status   | Acceptance check                                                                  | Evidence                                   |
| --- | ---------------------------------------------------------------- | ------- | -------- | --------------------------------------------------------------------------------- | ------------------------------------------ |
| T01 | Record daisyUI 5.7.16 Link inventory                             | —       | Verified | All documented classes and absent modifiers are explicit                          | `.progress/link-specification-research.md` |
| T02 | Define native and Router ownership                               | T01     | Verified | Anchor-only, RouterLink/RouterLinkActive/current-route boundaries are unambiguous | `docs/components/link.md`                  |
| T03 | Define inputs, unavailable-state, a11y, SSR, and visual evidence | T01–T02 | Verified | No unowned behavior or premature API remains                                      | `docs/components/link.md`                  |
| T04 | Approve NAV-03 specification cell                                | T01–T03 | Verified | Master matrix records the approved specification                                  | `DAISYUI_ANGULAR_BUILD_PLAN.md`            |

No subagent was used: the shared workspace remains serialized by instruction.

## Decisions

- Link is native-anchor styling, not Router or navigation state management.
- Current-route semantics remain `RouterLinkActive` / consumer-owned `aria-current`.
- `zdDisabled` guards navigation but preserves anchor semantics, focus order, and consumer events.
- No default Link loading, icon, active, disabled, size, or Angular Aria abstraction is invented.

## Remaining to implementation

- Implement and package `@pranxy/zordon-ui/link` only after public API review.
- Add behavior/type/browser/SSR/a11y/visual evidence from real public hosts.
- Record a component Changeset when the public entry point ships.
