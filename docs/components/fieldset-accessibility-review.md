# Fieldset accessibility review

**Component/maturity:** Fieldset — Planned
**Related specification:** [Fieldset](fieldset.md)
**Automated evidence:** `e2e/accessibility.spec.ts`, `e2e/browser-foundation.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

Automated evidence confirms that Fieldset preserves native group naming, disabled propagation, the
first-legend exemption, and consumer-owned help and error relationships. Manual review remains
required before maturity promotion.

| Required review                                                                              | Status  | Evidence to record                                      |
| -------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- |
| Disabled group, legend, nested group, and first-legend control with NVDA + Chrome or Firefox | Pending | Browser/OS/version, sequence, and observed announcement |
| Equivalent native-group behavior with VoiceOver + Safari                                     | Pending | Browser/OS/version, sequence, and observed announcement |
| Consumer help/error announcement and required-marker content                                 | Pending | Consumer markup and observed result                     |
| Forced colors, 200% zoom, 400% reflow, dark/custom themes, and long RTL legends              | Pending | Theme/environment and visual observation                |

Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
to record the completed review.
