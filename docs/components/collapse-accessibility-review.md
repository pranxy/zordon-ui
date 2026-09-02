# Collapse accessibility review

**Component/maturity:** Collapse — Preview  
**Related specification:** [Collapse](collapse.md)  
**Automated evidence:** `e2e/browser-foundation.spec.ts`, `e2e/accessibility.spec.ts`,
`e2e/ssr-hydration.spec.ts`, and `e2e/visual-regression.spec.ts`

This record intentionally remains open. Automated checks prove that the directives preserve native
`details`/`summary` behavior and checkbox ownership across browser and hydration paths. They do not
turn consumer-chosen markup into a managed accordion or provide a substitute for manual assistive
technology review.

| Review area                | Required manual review                                                                                          | Status  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| Native disclosure          | Verify keyboard operation, accessible name, announced expanded state, and focus for native `details`/`summary`. | Pending |
| Checkbox/radio composition | Verify labels, focus order, state announcement, and disabled behavior for consumer-owned controls.              | Pending |
| Visual indicator           | Verify arrow/plus indicators are supplementary and never the only state signal.                                 | Pending |
| Layout                     | Test RTL, long localized labels, 200% zoom, 400% reflow, and narrow viewports.                                  | Pending |
| Themes and platform        | Review forced colors, contrast, reduced motion, and assistive technology in supported and custom themes.        | Pending |

## Automated boundary

Browser and SSR/hydration tests exercise the details-first pattern and a checkbox composition. They
prove the directives apply exact daisyUI candidates without adding roles, focusability, ARIA state,
models, event handlers, timers, observers, or state synchronization. The axe scan covers the
isolated native fixture, and the visual baseline covers arrow/plus candidates, forced close state,
dark theme, RTL, and a mobile viewport.

Manual review is required before Collapse advances beyond Preview maturity.
