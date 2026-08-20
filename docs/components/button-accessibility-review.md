# Button accessibility review

**Component/maturity:** Button — Planned  
**Related specification:** [Button](button.md)  
**Automated evidence:** `e2e/accessibility.spec.ts`, `e2e/browser-foundation.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated axe, browser, SSR, and visual checks verify
structure and behavior; they do not verify assistive-technology speech or forced-colors rendering.

| Required review                                                                         | Status  | Evidence to record                                         |
| --------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| Native name, role, disabled, pressed, and loading state with NVDA + Chrome or Firefox   | Pending | Browser/OS/version, tested sequence, observed announcement |
| Native name, role, disabled, pressed, and loading state with VoiceOver + Safari         | Pending | Browser/OS/version, tested sequence, observed announcement |
| Icon-only accessible name, disabled-link discoverability, and loading alternative cue   | Pending | Exact consumer content and observed result                 |
| Light/dark, forced-colors focus visibility, 200% zoom, 400% reflow, and RTL long labels | Pending | Environment and visual observation                         |

Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
for the completed review. A manual reviewer must explicitly approve this record before Button can
advance from Planned maturity.
