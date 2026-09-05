# Stack

**Component ID:** LYT-08  
**Entry point:** `@pranxy/zordon-ui/stack`

Stack visually layers direct children. `ZdStack` is a styling-only directive: use it on the native element whose semantics fit your content.

```html
<section zdStack verticalAlignment="top" horizontalAlignment="end" aria-label="Recent cards">
  <article class="card bg-base-100 shadow">First card</article>
  <article class="card bg-base-100 shadow">Second card</article>
</section>
```

`verticalAlignment` accepts `top` and `bottom`; `horizontalAlignment` accepts `start` and `end`. Omit either input to use daisyUI's default alignment. Consumer utilities such as `w-*`, `h-*`, `size-*`, margins, shadows, transforms, and z-index control dimensions and appearance.

Consumers own element semantics, child content, active-layer selection, click/drag behavior, z-order changes, animation, reduced-motion policy, and accessibility relationships. Stack adds no roles, focus model, keyboard behavior, state, or ARIA attributes.

## Source

- [daisyUI Stack documentation](https://daisyui.com/components/stack/)
