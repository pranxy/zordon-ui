# Collapse specification research

**Component:** DSP-08 Collapse  
**Pinned local evidence:** daisyUI 5.7.16  
**Official documentation checked:** 2026-09-01 (currently documents daisyUI 5.7.22)

## Sources

- Installed `node_modules/daisyui/components/collapse.css` (5.7.16)
- https://daisyui.com/components/collapse/
- https://daisyui.com/docs/utilities/
- `docs/foundations/angular-aria-adoption.md`

## Findings

- daisyUI 5.7.16 supplies `collapse`, `collapse-title`, `collapse-content`, `collapse-arrow`,
  `collapse-plus`, `collapse-open`, and `collapse-close`. It styles visual state from native
  `<details open>`, focus on a consumer-supplied `tabindex` host, or a direct child checked
  checkbox/radio; it does not provide Angular state, IDs, events, focus restoration, outside click,
  group coordination, or ARIA relationships.
- The current official docs show the same candidate inventory and three native patterns: focus,
  checkbox, and `<details>/<summary>`. They explicitly say `collapse-open`/`collapse-close` do not
  work with the details/summary method; use the native `open` attribute instead.
- The installed source disables its transitions under reduced motion. Native `<details>` retains
  searchable content, while CSS-hidden non-details content has different search and assistive
  technology behavior owned by consumer markup and browser support.
- The Angular Aria adoption decision maps standalone Collapse to native disclosure and reserves
  Angular Aria Accordion for a future grouped disclosure mode.

## Decision

The initial package should be native, class-only directives: `[zdCollapse]`, `[zdCollapseTitle]`,
and `[zdCollapseContent]`. `indicator` maps arrow/plus classes and `forcedState` maps open/close
classes only for non-details hosts. It must not introduce an `open` model, click/keyboard/outside
handlers, IDs, ARIA attributes, timers, observers, or an Angular Aria/CDK dependency.
