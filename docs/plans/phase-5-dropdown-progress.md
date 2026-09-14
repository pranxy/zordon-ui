# Phase 5 Dropdown progress

**Row:** ACT-02 Dropdown  
**Status:** Integration spike implemented; production adapter and package boundary pending  
**Updated:** 2026-09-14

| Task                                                                       | Status               | Evidence / next action                                                        |
| -------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| Audit installed Angular 21 Menu/CDK and daisyUI                            | Verified             | Angular 21.2.19, Aria/CDK 21.2.14, daisyUI 5.7.16; no dependency changes      |
| Define component behavior and ownership                                    | Drafted              | `docs/components/dropdown.md`; compound API requires package-isolation proof  |
| Prove lazy menu, disabled items, activation, focus, nested RTL and cleanup | Verified in Chromium | `e2e/dropdown-menu-probe.spec.ts`; scoped axe scan also passes                |
| Prove closed SSR markup and hydrated opening                               | Verified in Chromium | Production SSR build and one targeted hydration regression pass               |
| Public compound declarations and shared stack package identity             | Pending              | ADR/API review and partial-Ivy build before public implementation             |
| Production implementation and automated component evidence                 | Pending              | Root/trigger/panel/menu parts; complete contract and checks in component spec |
| Manual accessibility and release maturity                                  | Pending              | No human evidence claimed                                                     |

The initial lazy-CDK composition failed first-item focus. The render-time public Aria handoff fixes
that case. Nested focus then exposed the detached child boundary: without the scoped capture adapter,
the root closed when focus entered the submenu. The adapter also converts root-tree Escape to top-only
Escape. Both LTR and RTL tests now preserve the root on the first Escape and restore the root trigger
on the second. These findings are requirements for the eventual production adapter, not permission to
rebuild Aria navigation or publish test-only wiring.

The probe's two-panel boundaries, eager hidden child shell and first-item-only handoff are intentionally
limited. Recursive nesting, last-item initial focus, hover/focus/manual triggers, controlled vetoes,
navigation close, package identity and the production public API remain unverified.

Automated component delivery remains **43 / 68**. Dropdown is not shipped or marked Done.

Verification: two Chromium probe tests and one production SSR test pass. Browser TypeScript, browser lint and SSR lint pass. Touched-file formatting and whitespace checks pass. No public library source or package dependency changed in this milestone.
