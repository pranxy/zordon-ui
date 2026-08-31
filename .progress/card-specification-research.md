# Card specification research

**Component:** DSP-05 Card  
**Question:** Define the documented daisyUI Card surface and the smallest Angular-native API that
preserves semantic consumer composition and customization.  
**Pinned local evidence:** daisyUI 5.7.16  
**Constraints:** Do not infer behavior from the obsolete Card source. Prefer native semantic
elements and projected consumer content; avoid a composite interaction API, Angular Aria, CDK, or
internal daisyUI variables unless a documented requirement needs them.

## Questions

1. Which Card base, anatomy, style, layout, image, and size classes does daisyUI document?
2. Which elements and accessibility semantics are consumer-owned?
3. Which upstream variables are internal rather than safe public API?
4. What SSR/hydration, responsive, accessibility, and visual evidence should implementation require?

## Sources and findings

- [daisyUI Card documentation](https://daisyui.com/components/card/) inventories `card`, the
  `card-title`, `card-body`, and `card-actions` parts, `card-border` and `card-dash` styles,
  `card-side` and `image-full` modifiers, and `card-xs` through `card-xl` sizes. Its examples use
  an ordinary `figure` directly inside the card and ordinary consumer content inside the body.
- The installed daisyUI 5.7.16 CSS confirms that inventory and shows that `image-full` is a visual
  grid/image treatment, while `card-side` changes layout. The stylesheet also responds to a
  consumer-owned checked native checkbox/radio or `aria-checked` state; it does not supply any
  behavior or state management.
- The installed CSS uses `--card-p`, `--card-fs`, and `--cardtitle-fs` as internal sizing
  variables. They are exact-version implementation details, not stable Zordon inputs or styling
  hooks.
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/) establishes the
  general utility/custom-property customization boundary. Ordinary classes, responsive variants,
  themes, and consumer CSS remain additive.

## Decisions to synthesize

- Use four standalone native directives: `[zdCard]`, `[zdCardBody]`, `[zdCardTitle]`, and
  `[zdCardActions]`. Do not introduce Angular slots, a `figure` directive, subtitle/footer/badge
  directives, or a wrapper template.
- Keep `size`, `style`, `side`, and `imageFull` on `[zdCard]` as the exact daisyUI class surface.
  The three part directives take no inputs.
- Treat card semantics, navigation, selection, disabled/loading/expanded state, image alt text,
  heading level, action behavior, form ownership, ARIA, and focus as consumer-owned native
  composition. No Angular Aria, CDK, Forms, browser API, animation, event, or model API is needed.
- Require later browser, SSR/hydration, axe, and visual coverage for the native compound anatomy,
  class lifecycle, consumer interaction composition, themes, responsive side layout, image-full,
  RTL, and reflow. Manual accessibility review remains a separate prerequisite beyond automated
  evidence.
