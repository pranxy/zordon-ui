# ACT-01 Button specification research

Date: 2026-08-19

## Installed upstream evidence

The repository pins daisyUI 5.7.16. Its Button source defines `btn`, semantic colors, outline/dash/soft/ghost/link variants, xs–xl sizes, wide/block/square/circle layouts, `btn-active`, and disabled treatment for `.btn-disabled`, native disabled, and `aria-disabled="true"`.

`btn-disabled` is visual/pointer CSS; it cannot guard keyboard, programmatic activation, form submission, navigation, or server duplicates. Button itself has a normal 0.2-second transition and does not render a loader; daisyUI Loading is separate.

## Contract decisions

- Use native hosts; a link variant is visual only.
- Do not expose `style`; it conflicts with Angular's native style binding.
- Use one local `layout` union for all geometric Button modifiers.
- Preserve native disabled authority and limit synthetic disabled state to links.
- Treat loading as controlled presentation; the consumer owns work and form submission.
- Do not use Angular Aria for a standalone native Button; Toolbar is a parent concern.

## Sources

- Installed `node_modules/daisyui/components/button/object.js` (5.7.16)
- [daisyUI Button](https://daisyui.com/components/button/)
- [daisyUI Loading](https://daisyui.com/components/loading/)
- [HTML button](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element)
