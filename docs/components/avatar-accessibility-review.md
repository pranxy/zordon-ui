# Avatar accessibility review

**Component/maturity:** Avatar — Planned  
**Related specification:** [Avatar](avatar.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. The automated checks prove that Avatar preserves consumer
image alternatives and does not introduce a role, keyboard behavior, or status announcement. They
cannot establish whether the consumer-selected image alternative, placeholder text, presence
meaning, contrast, or image-failure experience is appropriate in product context.

| Required review                                                                                          | Status  | Evidence to record                                           |
| -------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| Meaningful and decorative image alternatives with NVDA + Chrome or Firefox                               | Pending | Browser/OS/version, image purpose, and observed announcement |
| Equivalent image and placeholder checks with VoiceOver + Safari                                          | Pending | Browser/OS/version, image purpose, and observed announcement |
| Online/offline decoration paired with an understandable nonvisual status where status matters            | Pending | Consumer composition and observed announcement               |
| Placeholder and presence contrast in supported/custom themes; forced colors; 200% zoom; 400% reflow; RTL | Pending | Theme/environment and visual observation                     |
| Image error, delayed image, and lazy-loading behavior                                                    | Pending | Consumer-owned fallback behavior and observation             |

`ZdAvatar` intentionally does not infer `alt` text, announce presence, or provide an image fallback.
Consumers own those decisions, as well as any native button/link semantics for interactive avatars.
Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
to complete this record before Avatar advances from Planned maturity.
