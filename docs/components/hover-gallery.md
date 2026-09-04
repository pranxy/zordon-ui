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
