# Diff

**Component ID:** DSP-10  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/diff`

daisyUI Diff is a CSS-driven comparison layout. Its documented vocabulary is a `diff` container
with `diff-item-1`, `diff-item-2`, and `diff-resizer` parts. The installed daisyUI 5.7.16 CSS gives
the resizer its horizontal pointer affordance and focus-driven positions.

The first Zordon package should preserve that native contract with four styling directives:

- `[zdDiff]` → `diff`
- `[zdDiffItem1]` → `diff-item-1`
- `[zdDiffItem2]` → `diff-item-2`
- `[zdDiffResizer]` → `diff-resizer`

Consumers choose the semantic container and content: for example, a `figure` with captions, images
with accurate `alt` text, or non-image comparison content. They also own the documented focusability
needed by daisyUI’s keyboard/iOS behavior, e.g. `tabindex="0"` on the container and first item when
appropriate. Zordon does not add `role`, `tabindex`, labels, or a live region.

```html
<figure zdDiff class="aspect-video" tabindex="0">
  <div zdDiffItem1 tabindex="0">
    <img alt="Original photograph" src="original.webp" />
  </div>
  <div zdDiffItem2>
    <img alt="Edited photograph" src="edited.webp" />
  </div>
  <div zdDiffResizer></div>
</figure>
```

## Boundaries

The initial directive package does not supply a controlled position, pointer/touch event handling,
keyboard slider behavior, vertical orientation, min/max/step, resize persistence, labels, outputs,
or an image-loading abstraction. The native CSS resizer remains the only behavior.

If a future controlled comparison is approved, it must define a real accessible interaction model
(including keyboard semantics, focus, value announcement, touch behavior, min/max/step, RTL policy,
and SSR/hydration reconciliation) before publishing an Angular API.

## Evidence plan

Verify the class contract and consumer-owned native semantics in unit/type/browser tests; add SSR,
axe, and dark RTL mobile visual evidence. Manual review must cover pointer/touch resizing, keyboard
focus, iOS Safari, Firefox, contrast, forced colors, zoom/reflow, RTL, and assistive technology.

## Sources

- [daisyUI Diff documentation](https://daisyui.com/components/diff/)
- [daisyUI changelog](https://daisyui.com/docs/changelog/)

## Showcase visual story matrix — 2026-09-29

Scope: Matched image pair and text comparison; keyboard reveal boundaries. Installed evidence: daisyUI 5.7.16 / Angular 21.2. Existing maturity and manual accessibility gates remain unchanged.

| Boundary                      | Representative and rationale                                                                                                       | Evidence                                            | Review                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| Requested compositions        | One static preview section groups materially different layouts without every input permutation.                                    | `e2e/visual-docs-site.spec.ts`, `showcase-diff--*`  | Reviewed                                     |
| Theme, viewport and direction | Light desktop and dark RTL mobile reveal spacing, wrapping and contrast differences. Diff also captures the image pair separately. | Same visual suite                                   | Reviewed                                     |
| Behavior, semantics and SSR   | Screenshots do not prove motion or interaction; browser geometry/state checks and production accessibility/SSR suites do.          | `e2e/docs-pages.spec.ts` and production docs suites | Scoped checks pass; integrated limits remain |

[Implementation evidence and remaining limits](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29).
