# Aura accessibility review

**Component/maturity:** Aura — Planned  
**Related specification:** [Aura](aura.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated checks prove Aura preserves native consumer
semantics, creates no role or focus behavior, and becomes static when the operating-system motion
preference changes to reduce. They cannot establish whether a decorative effect is appropriate,
whether the consumer content remains understandable, or whether the final visual treatment is
usable in a product’s colors and assistive-technology context.

| Required review                                                                                       | Status  | Evidence to record                                             |
| ----------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| Aura wrapper remains silent with NVDA + Chrome or Firefox                                             | Pending | Browser/OS/version, wrapper/content, and observed announcement |
| Equivalent wrapper/content check with VoiceOver + Safari                                              | Pending | Browser/OS/version, wrapper/content, and observed announcement |
| No-preference and reduce paths with forced colors, supported/custom themes, and contrast              | Pending | Theme/environment and visual observation                       |
| 200% zoom, 400% reflow, RTL, and long localized consumer content                                      | Pending | Viewport/content and visual observation                        |
| Auto-starting Aura in product context; pause/stop/hide suitability when it appears with other content | Pending | Product rationale and any user control                         |

`ZdAura` intentionally does not announce the effect, infer meaning, or make its wrapper interactive.
Consumers own content semantics and whether a persistent decorative effect is appropriate. Use the
[manual accessibility review template](../testing/manual-accessibility-review-template.md) to
complete this record before Aura advances from Planned maturity.
