# Link accessibility review

**Component/maturity:** Link — Planned  
**Related specification:** [Link](link.md)  
**Automated evidence:** `e2e/accessibility.spec.ts`, `e2e/browser-foundation.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated axe, browser, SSR, and visual checks verify
structure and native activation behavior; they do not verify assistive-technology announcements,
custom-theme semantic-color contrast, or forced-colors rendering.

| Required review                                                                                                                  | Status  | Evidence to record                                         |
| -------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| Native name, role, destination, current-page state, and unavailable-state discovery with NVDA + Chrome or Firefox                | Pending | Browser/OS/version, tested sequence, observed announcement |
| Native name, destination, current-page state, and unavailable-state discovery with VoiceOver + Safari                            | Pending | Browser/OS/version, tested sequence, observed announcement |
| Enter activation, disabled-link workflow, context menu/copy-link, and new-window indication                                      | Pending | Exact consumer content and observed result                 |
| Every semantic `link-*` color used by a supported/custom theme, forced-colors focus, 200% zoom, 400% reflow, and RTL long labels | Pending | Environment and visual observation                         |

The documentation fixture deliberately uses the inherited Link color: daisyUI’s configured dark
theme renders `link-primary` below automated AA contrast. Consumers must review every semantic
Link color exposed by their actual theme rather than treating a daisyUI modifier as a contrast
guarantee.

Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
for the completed review. A manual reviewer must explicitly approve this record before Link can
advance from Planned maturity.
