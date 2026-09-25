---
'@pranxy/zordon-ui': minor
---

Prefix the inputs and outputs of directives layered onto another directive's element, so a binding
no longer reaches both. Before, `<button zdButton zdTooltip color="primary">` coloured the button
and the tooltip, and `<button zdButton zdSwap [active]>` set Button's `btn-active` as well as the
swap state.

- Tooltip: every input and output except the `zdTooltip` content takes the `tooltip` prefix:
  `tooltipOpen`/`tooltipOpenChange` (so `[(tooltipOpen)]` works), `tooltipInteractive`,
  `tooltipTrigger`, `tooltipSide`, `tooltipAlign`, `tooltipColor`, `tooltipGap`, `tooltipArrow`,
  `tooltipAutoFlip`, `tooltipShowDelay`, `tooltipHideDelay`, `tooltipTouch`,
  `tooltipLongPressDelay`, `tooltipTouchHideDelay`, `tooltipPanelClass` and `tooltipClosed`.
  `tooltipDisabled` and `tooltipLabel` are unchanged.
- Swap: `active`, `indeterminate`, `effect`, `readOnly` and `activeChange` are now `swapActive`,
  `swapIndeterminate`, `swapEffect`, `swapReadOnly` and `swapActiveChange`.

Migrate carefully: an unmigrated static attribute (`side="bottom"`) still compiles but does nothing,
and an unmigrated binding (`[color]`) compiles whenever another directive on the element declares
it, then reaches only that directive. `tools/check-shared-host-inputs.mjs` now enforces the rule for every
layered directive.
