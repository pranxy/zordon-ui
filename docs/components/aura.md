# Aura

**Component ID:** DSP-03  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/aura`

Aura applies daisyUI’s decorative light effect to a consumer-owned wrapper. It is a standalone `[zdAura]` directive, not a Card/Button wrapper, interactive widget, color system, or animation service.

Import the scoped motion policy once from the application’s global stylesheet, after daisyUI:

```css
@import '@pranxy/zordon-ui/aura/aura-motion.css';
```

## Native and semantic boundary

Use Aura on a wrapper with one or more direct consumer children. Installed daisyUI CSS puts decorative pseudo-elements behind those direct children and derives its radius from known child classes. The consumer selects the native wrapper and owns its semantics; Aura never adds a role, label, focus behavior, event handler, ID, or ARIA attribute.

```html
<div zdAura variant="rainbow">
  <button class="btn btn-primary">Start free trial</button>
</div>
```

```html
<article zdAura size="lg" class="text-orange-600">
  <div class="card bg-base-100">...</div>
</article>
```

An interactive Aura remains a native consumer composition: place a native `<button>` or `<a>` inside it rather than assigning button/link behavior to the Aura wrapper.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16.

| Candidate                                             | Purpose                                                  |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `aura`                                                | Required base wrapper and rotating-border effect         |
| `aura-dual`                                           | Two rotating light effects                               |
| `aura-rainbow`                                        | Rainbow gradient effect                                  |
| `aura-holo`                                           | Holographic gradient effect                              |
| `aura-gold`                                           | Gold gradient effect                                     |
| `aura-silver`                                         | Silver gradient effect                                   |
| `aura-glow`                                           | Static radial base with animated glow pseudo-elements    |
| `aura-xs`, `aura-sm`, `aura-md`, `aura-lg`, `aura-xl` | Aura padding/thickness scale; upstream default is medium |

Installed CSS also contains direct-child radius heuristics and internal implementation variables `--aura-padding`, `--aura-radius`, `--tw-duration`, and `--aura-angle`. They are exact-version daisyUI internals, not stable Zordon hooks.

## Planned public API

| Input     | Type                                                                         | Intrinsic default | Contract                                                                                  |
| --------- | ---------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `variant` | `'dual' \| 'rainbow' \| 'holo' \| 'gold' \| 'silver' \| 'glow' \| undefined` | none              | Adds one optional `aura-*` style candidate.                                               |
| `size`    | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| undefined`                          | upstream medium   | Adds one optional `aura-*` size candidate; omission leaves daisyUI’s base medium padding. |

Unsupported values reject rather than create an uncompiled runtime class. `undefined` removes the corresponding modifier. There are no models, outputs, methods, Forms integration, application defaults, or Angular Aria/CDK dependency.

Static/dynamic consumer classes, non-overlapping `ngClass`, styles, CSS custom properties, `data-theme`, and native attributes remain additive. An explicit consumer candidate class is the per-token override boundary documented in [host-class composition](../foundations/host-class-composition.md).

## Customization, responsive layout, and themes

Use ordinary Tailwind and CSS for color, background, radius, padding, layout, and responsive behavior. Aura uses `currentColor`, so a consumer color class controls its base light effect:

```html
<div zdAura class="text-orange-600" variant="dual">
  <div class="rounded-box bg-base-100 p-6">Custom colored aura</div>
</div>
```

The listed variables may be overridden by a consumer who accepts installed-daisyUI-version coupling; they are not `--zd-*` APIs and need consumer prefix/build and visual verification. Do not add finite Angular inputs for arbitrary colors, backgrounds, radii, padding, intensity, duration, or breakpoints.

## Motion, platform, and accessibility

Aura is decorative, auto-starting, and infinite. daisyUI 5.7.16 slows its animation fourfold under `prefers-reduced-motion: reduce`; that is not sufficient for Zordon’s static-first policy. The exported `aura-motion.css` stylesheet stops opted-in wrapper and pseudo-element animation while preserving the final border/glow state. It must not use `matchMedia`, timers, browser layout reads, or a public motion input/service.

The directive’s classes and marker are deterministic server HTML. SSR and hydrated clients start with the same host structure, inputs, and consumer content. CSS handles live preference changes without Angular state. Aura emits no localized strings and does not create directionality, keyboard, focus, or screen-reader behavior; consumer content remains responsible for each.

## Evidence required before Preview

| Area             | Required proof                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| API/package      | Intentional `./aura` entry, exact type tests, API extraction, tarball, and bundle review                       |
| Native semantics | Wrapper/direct-child preservation and no injected role, focus, ID, or events                                   |
| Styling          | Every candidate/prefix, stale-token removal, Card/Button radius heuristics, and consumer classes/styles        |
| Motion           | `reduce` removes infinite Aura movement, retains a static appearance, and responds to a live preference change |
| Accessibility    | Axe, manual confirmation that the wrapper is silent, forced colors, contrast, zoom/reflow, and RTL             |
| SSR/hydration    | Stable host/classes and clean hydration with both motion preferences                                           |
| Visual           | Dark/light/custom themes, rainbow/holo/glow and size boundaries, mobile RTL, and static reduced-motion capture |

## Sources

- [daisyUI Aura documentation](https://daisyui.com/components/aura/)
- [Zordon reduced-motion policy](../foundations/reduced-motion.md)
- [W3C `prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion)
