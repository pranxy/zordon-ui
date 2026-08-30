# Badge specification research

**Component:** DSP-04 Badge  
**Question:** Define the documented daisyUI Badge surface and the smallest Angular-native API that
preserves consumer semantics and customization.  
**Pinned local evidence:** daisyUI 5.7.16  
**Constraints:** Do not infer behavior from the obsolete Badge source. Prefer native semantics,
avoid Angular Aria/CDK unless interaction is genuinely owned, and keep styling customization
consumer-owned unless a stable library hook is necessary.

## Questions

1. Which base, color, style, and size classes does daisyUI document?
2. Does Badge own behavior, a native role, form value, or interaction?
3. Which documented CSS variables or internal implementation details matter to the public boundary?
4. What browser, SSR/hydration, accessibility, and visual evidence is appropriate?

## Sources and findings

- [Official Badge documentation](https://daisyui.com/components/badge/) lists `badge`; four
  styles (`badge-outline`, `badge-dash`, `badge-soft`, `badge-ghost`); eight colors
  (`neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `error`); and five
  sizes (`xs` through `xl`, with medium as the upstream default). It demonstrates text, empty
  dot, icon, inline-text, and Button compositions.
- The installed `node_modules/daisyui/components/badge.css` for 5.7.16 has the same candidate
  set. The base is an inline flex container with a `gap`, theme-derived colors and
  `--radius-selector`; it adds no semantics, state, keyboard handling, or animation.
- [daisyUI utilities](https://daisyui.com/docs/utilities/) labels `--badge-color` and `--size` as
  component-specific internal variables. They must not become Zordon inputs or stable hooks.
- The local Angular Aria mapping identifies Badge as text/status semantics; a removable or
  selectable Badge uses a native button/checkbox composition rather than an Angular Aria family.

## Decisions to synthesize

- Build one native `[zdBadge]` directive with optional exact `color`, `style`, and `size` inputs.
  Omission leaves daisyUI's base/default behavior intact.
- Do not publish a status model, click/removal output, selected state, dot/icon directive, Forms
  integration, generated IDs, or Angular Aria/CDK dependency. Consumers own native element,
  accessible name, status/live-region meaning, interaction, count formatting, and icon markup.
- Preserve consumer classes, styles, theme boundaries, native attributes, and Tailwind responsive
  utilities. No `--zd-*` variable is necessary.
- Badge has no component-owned motion; reduced-motion evidence confirms no added motion rather
  than adding an override stylesheet.
