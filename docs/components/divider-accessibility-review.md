# Divider accessibility review

**Component/maturity:** Divider — Planned  
**Related specification:** [Divider](divider.md)  
**Automated evidence:** `e2e/accessibility.spec.ts`, `e2e/browser-foundation.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated axe, browser, and hydration checks establish
that Divider does not overwrite the host’s native or consumer-owned semantics. They cannot decide
whether a particular separator is meaningful content, decorative, or visually usable under a
consumer theme or forced-colors mode.

| Required review                                                                                                 | Status  | Evidence to record                                             |
| --------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| `<hr>` thematic break announcement with NVDA + Chrome or Firefox                                                | Pending | Browser/OS/version, content context, and observed announcement |
| Text-bearing and `aria-hidden` Divider hosts with NVDA + Chrome or Firefox                                      | Pending | Browser/OS/version, consumer markup, and observed announcement |
| Equivalent native/decorative host checks with VoiceOver + Safari                                                | Pending | Browser/OS/version, content context, and observed announcement |
| Semantic Divider colors used by supported/custom themes; forced colors; 200% zoom; 400% reflow; RTL long labels | Pending | Theme/environment and visual observation                       |

`ZdDivider` intentionally does not create an ARIA separator role or label. Consumers must select
an actual `<hr>` for a thematic break and must decide whether another host’s text is meaningful or
decorative. Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
to complete this record before Divider advances from Planned maturity.
