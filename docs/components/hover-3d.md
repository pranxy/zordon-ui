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
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
  <div aria-hidden="true"></div>
</a>
```

Consumer markup owns semantics, activation, focusability, labels, media alternatives, zone markup,
and custom styling. Programmatic tilt, pointer values, keyboard activation beyond the native host,
mobile policy, and motion/reduced-motion policy require a separate approved interaction contract.

## Source

- [daisyUI Hover 3D documentation](https://daisyui.com/components/hover-3d/)

## Showcase visual story matrix — 2026-09-29

Scope: Image card/gallery with decorative hover regions and useful no-hover content. Installed evidence: daisyUI 5.7.16 / Angular 21.2. Existing maturity and manual accessibility gates remain unchanged.

| Boundary                      | Representative and rationale                                                                                                       | Evidence                                               | Review                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| Requested compositions        | One static preview section groups materially different layouts without every input permutation.                                    | `e2e/visual-docs-site.spec.ts`, `showcase-hover-3d--*` | Reviewed                                     |
| Theme, viewport and direction | Light desktop and dark RTL mobile reveal spacing, wrapping and contrast differences. Diff also captures the image pair separately. | Same visual suite                                      | Reviewed                                     |
| Behavior, semantics and SSR   | Screenshots do not prove motion or interaction; browser geometry/state checks and production accessibility/SSR suites do.          | `e2e/docs-pages.spec.ts` and production docs suites    | Scoped checks pass; integrated limits remain |

[Implementation evidence and remaining limits](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29).
