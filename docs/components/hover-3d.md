# Hover 3D Card

**Component ID:** DSP-11  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/hover-3d`

daisyUI Hover 3D is a CSS wrapper (`hover-3d`) whose effect requires one content child followed by
eight empty hover-zone elements. The first package must remain a styling-only directive and preserve
that explicit consumer markup; it must not create pointer listeners, tilt signals, or a motion API.

Use non-interactive content inside the wrapper. When the whole card is actionable, make the wrapper
itself a native link or button rather than nesting interactive descendants.

```html
<a zdHover3d href="/details">
  <figure><img alt="Product card" src="product.webp" /></figure>
  <div aria-hidden="true"></div><div aria-hidden="true"></div>
  <div aria-hidden="true"></div><div aria-hidden="true"></div>
  <div aria-hidden="true"></div><div aria-hidden="true"></div>
  <div aria-hidden="true"></div><div aria-hidden="true"></div>
</a>
```

Consumer markup owns semantics, activation, focusability, labels, media alternatives, zone markup,
and custom styling. Programmatic tilt, pointer values, keyboard activation beyond the native host,
mobile policy, and motion/reduced-motion policy require a separate approved interaction contract.

## Source

- [daisyUI Hover 3D documentation](https://daisyui.com/components/hover-3d/)
