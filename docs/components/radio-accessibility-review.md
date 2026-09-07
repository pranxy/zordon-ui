# Radio accessibility review

**Component/maturity:** Radio — Planned
**Related specification:** [Radio](radio.md)
**Automated evidence:** `e2e/accessibility.spec.ts`, `e2e/browser-foundation.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

Automated evidence confirms the native radio role, group label, checked state, arrow-key selection,
and daisyUI focus and disabled styling. Manual review remains required before maturity promotion.

| Required review                                                                   | Status  | Evidence to record                                      |
| --------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- |
| Same-name native group and arrow-key selection with NVDA + Chrome or Firefox      | Pending | Browser/OS/version, sequence, and observed announcement |
| Equivalent native radio-group behavior with VoiceOver + Safari                    | Pending | Browser/OS/version, sequence, and observed announcement |
| Disabled option, required group, descriptions, and validation-message composition | Pending | Consumer markup and observed result                     |
| Forced colors, 200% zoom, 400% reflow, dark/custom themes, and long RTL labels    | Pending | Theme/environment and visual observation                |

Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
to record the completed review.
