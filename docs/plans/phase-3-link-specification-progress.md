# Phase 3 Link specification progress

**Row:** NAV-03 Link  
**Status:** Partial
**Last updated:** 2026-08-20

## Deliverable

Lock the public/native boundary for an anchor-only Link directive before implementation. The
specification covers daisyUI tokens, Router coexistence, unavailable navigation, accessibility,
SSR, customization, and the Preview evidence plan.

Template loaded from: `implement-plan/assets/progress-tracker-template.md`

| ID    | Requirement                                                                         | Deps    | Status      | Acceptance check                                                                           | Evidence                                             |
| ----- | ----------------------------------------------------------------------------------- | ------- | ----------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| T01   | Record daisyUI 5.7.16 Link inventory                                                | —       | Verified    | All documented classes and absent modifiers are explicit                                   | `.progress/link-specification-research.md`           |
| T02   | Define native and Router ownership                                                  | T01     | Verified    | Anchor-only, RouterLink/RouterLinkActive/current-route boundaries are unambiguous          | `docs/components/link.md`                            |
| T03   | Define inputs, unavailable-state, a11y, SSR, and visual evidence                    | T01–T02 | Verified    | No unowned behavior or premature API remains                                               | `docs/components/link.md`                            |
| T04   | Approve NAV-03 specification cell                                                   | T01–T03 | Verified    | Master matrix records the approved specification                                           | `DAISYUI_ANGULAR_BUILD_PLAN.md`                      |
| T05   | Implement the native anchor directive and typed defaults feature                    | T01–T04 | Verified    | `a[zdLink]` composes complete daisyUI candidates and guards unavailable navigation         | `projects/components/link/src/`                      |
| T06   | Add unit and compile-time API contracts                                             | T05     | Verified    | 100% library coverage and entry-point type tests pass                                      | `link.spec.ts`, `link-defaults.spec.ts`              |
| T07   | Publish and review the Link secondary entry point                                   | T05–T06 | Verified    | Partial-Ivy build, API report, bundle budget, Changeset, and tooling tests pass            | `etc/api/zordon-ui-link.api.md`                      |
| T08   | Add browser, SSR/hydration, Router, a11y, and visual evidence                       | T05–T07 | In progress | Automated browser/Router, SSR/hydration, axe, and visual gates pass; manual review remains | `e2e/`, Link evidence records                        |
| T08.1 | Prove native navigation, Router current-route coexistence, and unavailable guarding | T08     | Verified    | Chromium fixture keeps native/Router ownership and guards only unavailable click default   | `e2e/browser-foundation.spec.ts`                     |
| T08.2 | Prove stable server markup and post-hydration Link behavior                         | T08     | Verified    | Production SSR suite passes server, hydration, and hydrated activation assertions          | `e2e/ssr-hydration.spec.ts`                          |
| T08.3 | Prove automated accessibility and visual boundaries                                 | T08     | Verified    | Axe Link scan and dark RTL mobile baseline pass                                            | `e2e/accessibility.spec.ts`, `link-visual-matrix.md` |
| T08.4 | Complete manual screen-reader, semantic-color, and forced-colors review             | T08     | Pending     | Accessibility record is approved by a manual reviewer                                      | `link-accessibility-review.md`                       |

No subagent was used: the shared workspace remains serialized by instruction.

## Decisions

- Link is native-anchor styling, not Router or navigation state management.
- Current-route semantics remain `RouterLinkActive` / consumer-owned `aria-current`.
- `zdDisabled` guards navigation but preserves anchor semantics, focus order, and consumer events.
- No default Link loading, icon, active, disabled, size, or Angular Aria abstraction is invented.

## Remaining to implementation

- Complete manual NVDA, VoiceOver, and forced-colors review before Link is promoted to Preview.
