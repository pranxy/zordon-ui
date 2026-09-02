# Diff specification research

**Component:** DSP-10 Diff  
**Target daisyUI version:** 5.7.16 (installed)  
**Research date:** 2026-09-02

## Question

What native Angular surface can expose daisyUI Diff without reimplementing its CSS-driven resize and
focus behavior?

## Primary evidence

- [daisyUI Diff documentation](https://daisyui.com/components/diff/) records one container class
  (`diff`) and three required parts: `diff-item-1`, `diff-item-2`, and `diff-resizer`.
- The installed `daisyui@5.7.16` `components/diff.css` confirms that the resizer is a native CSS
  `resize: horizontal` surface. It provides the pointer affordance and the focus-driven 5%/95%
  positions; it does not expose a JavaScript value, orientation variant, event, or ARIA-slider API.
- The v5 changelog records keyboard and iOS-focus improvements that rely on the documented
  focusable container and first item markup rather than a library-owned event handler.

## Decision

Ship a native compound-directive surface only:

- `[zdDiff]` adds `diff` to the consumer-selected container.
- `[zdDiffItem1]`, `[zdDiffItem2]`, and `[zdDiffResizer]` add the documented part classes.
- Consumer markup owns the element types, aspect ratio, media/text content, focusability,
  labels/roles, alternative text, CSS variables/styles, and any programmatic position model.

No Angular pointer, touch, keyboard, slider, orientation, min/max/step, controlled value, output,
or resize persistence is approved in this scope. Those features would change the public contract
and require a separately approved accessible interaction design.
