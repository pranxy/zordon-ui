# Kbd specification research

**Status:** Complete  
**Component:** DSP-13 Kbd  
**Reviewed:** 2026-09-02

## Question

What does the installed daisyUI 5.7.16 Kbd component provide, and what should a native-first Angular
library own?

## Primary evidence

- [daisyUI Kbd documentation](https://daisyui.com/components/kbd/?lang=en), reviewed 2026-09-02.
  It documents `kbd` plus `kbd-xs`, `kbd-sm`, `kbd-md`, `kbd-lg`, and `kbd-xl`; examples are native
  `<kbd>` elements for inline text, shortcut combinations, symbols, and keyboard layouts.
- `node_modules/daisyui/components/kbd.css` from installed daisyUI 5.7.16. The implementation
  applies visual layout and sizes only; it uses theme/internal variables including `--size`,
  `--radius-field`, `--color-base-200`, `--color-base-content`, `--border`, and `--size-selector`.
- `docs/foundations/angular-aria-adoption.md`. DSP-13 maps to native `<kbd>` and text semantics, not
  an Angular Aria directive family.

## Findings and decision

- Ship a standalone `kbd[zdKbd]` directive with one optional exact `size` input.
- Preserve native `<kbd>` semantics; do not add roles, labels, focusability, events, state, IDs,
  platform detection, translation, shortcut registration, or key-sequence separators.
- Platform-aware labels, localized text, symbols, active state, and sequence wording remain
  consumer content and CSS. The internal daisyUI variables are not public Zordon APIs.
- The implementation has no Forms, Angular Aria, CDK, browser API, timer, observer, or cleanup
  requirement. SSR/hydration needs only stable native markup and class proof.

## Evidence required before Preview

Exact size candidates and invalid-value handling; consumer class/style precedence; native host and
accessible shortcut naming; light/dark/custom themes; long localized strings, RTL, zoom/reflow,
forced colors; SSR/hydration; axe; and visual coverage for inline and multi-key compositions.
