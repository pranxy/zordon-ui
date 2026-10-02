# Hover Gallery

**Component ID:** DSP-12  
**Maturity:** Planned  
**Entry point:** `@pranxy/zordon-ui/hover-gallery`

daisyUI Hover Gallery is a CSS wrapper (`hover-gallery`) for a consumer-provided sequence of images.
The first image is shown initially; the browser hover position reveals subsequent images. The
documented pattern supports up to ten images.

The initial Zordon package is intentionally a styling-only directive:

```html
<figure zdHoverGallery>
  <img alt="Front view of the blue trainer" src="trainer-front.webp" />
  <img alt="Side view of the blue trainer" src="trainer-side.webp" />
  <img alt="Sole view of the blue trainer" src="trainer-sole.webp" />
</figure>
```

`ZdHoverGallery` adds only the `hover-gallery` class. Consumers own the host element, image order,
image sources, accurate alternatives, captions, responsive sizing, loading policy, fallback UI,
and any surrounding link or control semantics. A decorative gallery can use empty alternatives
only when equivalent information is provided elsewhere.

## Boundaries

This package does not add a selected index, pointer/click/swipe handling, keyboard navigation,
autoplay, image preloading or lazy-loading policy, captions, error handling, a carousel role, or
live announcements. Those behaviors change the interaction and accessibility contract and require
a separately approved design before an Angular API is introduced.

For touch, keyboard, or explicitly selectable thumbnails, compose native controls today. Consider
Angular Aria Listbox only if a future approved thumbnail-selection model truly needs listbox
semantics; it is not appropriate for the presentational hover-only wrapper.

## Evidence plan

The package is covered by unit/type tests and browser, SSR/hydration, axe, and dark RTL mobile
visual checks. Manual review remains necessary for image alternatives, hover/touch expectations,
forced colors, contrast, zoom/reflow, RTL, browser support, and assistive technology.

## Source

- [daisyUI Hover Gallery documentation](https://daisyui.com/components/hover-gallery/)

## Showcase visual story matrix — 2026-09-29

Scope: Original/alternate photograph and caption; reset to first image. Installed evidence: daisyUI 5.7.16 / Angular 21.2. Existing maturity and manual accessibility gates remain unchanged.

| Boundary                      | Representative and rationale                                                                                                       | Evidence                                                    | Review                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| Requested compositions        | One static preview section groups materially different layouts without every input permutation.                                    | `e2e/visual-docs-site.spec.ts`, `showcase-hover-gallery--*` | Reviewed                                     |
| Theme, viewport and direction | Light desktop and dark RTL mobile reveal spacing, wrapping and contrast differences. Diff also captures the image pair separately. | Same visual suite                                           | Reviewed                                     |
| Behavior, semantics and SSR   | Screenshots do not prove motion or interaction; browser geometry/state checks and production accessibility/SSR suites do.          | `e2e/docs-pages.spec.ts` and production docs suites         | Scoped checks pass; integrated limits remain |

[Implementation evidence and remaining limits](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29).
