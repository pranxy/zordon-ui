# Badge accessibility review

**Component/maturity:** Badge — Planned  
**Related specification:** [Badge](badge.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`, and
`e2e/ssr-hydration.spec.ts`

This record intentionally remains open. Automated checks prove Badge preserves consumer-provided
native status/button/dot semantics, does not add focus or interaction, and remains valid in the
tested fixture. They cannot determine whether the application chose an understandable status,
alternative for an empty dot, announcement policy, or sufficiently contrasting theme colors.

| Required review                                                                                                       | Status  | Evidence to record                                           |
| --------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| Static text, status, and consumer-owned action with NVDA + Chrome or Firefox                                          | Pending | Browser/OS/version, host/content, and observed announcement  |
| Equivalent static/status/action checks with VoiceOver + Safari                                                        | Pending | Browser/OS/version, host/content, and observed announcement  |
| Empty dot paired with visible/nonvisual status text; icon alternative and action name                                 | Pending | Consumer composition and observed output                     |
| Semantic/neutral colors in supported and custom themes, including outline/dash on light backgrounds                   | Pending | Theme/environment, contrast observation, and any remediation |
| Forced colors, 200% zoom, 400% reflow, RTL, and long localized count/status text                                      | Pending | Viewport/content and visual observation                      |
| Live update frequency, urgency, duplicate-announcement, and pause/stop decisions where the app uses a Badge as status | Pending | Product rationale and observed assistive-technology output   |

`ZdBadge` intentionally does not infer a status role, live region, accessible name, count format,
icon alternative, or action behavior. Consumers own those choices and the semantic color/contrast
context. Use the [manual accessibility review template](../testing/manual-accessibility-review-template.md)
to complete this record before Badge advances from Planned maturity.
