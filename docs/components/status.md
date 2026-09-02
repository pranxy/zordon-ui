# Status

**Component ID:** DSP-16  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/status`

Status applies daisyUI’s small visual state marker to a consumer-selected native host. It is not a
live-region, presence service, button, animation controller, or state-management component.

## Contract

Use `[zdStatus]` on a semantic consumer host such as a decorative `span`, or provide an accessible
name when the marker conveys information. It adds `status` plus optional documented `status-*`
color and size candidates. Valid colors are neutral, primary, secondary, accent, info, success,
warning, and error; sizes are xs, sm, md, lg, and xl. Omitted modifiers preserve upstream defaults.

Zordon adds no role, focusability, label, `aria-live`, event listener, timer, or animation. Consumer
text or an explicit accessible name must describe meaningful state; use a consumer live region only
when an update warrants announcement. Ping and bounce remain consumer Tailwind animations and must
respect reduced-motion needs.

```html
<span zdStatus color="success" size="sm" aria-label="Service online"></span>
<span class="inline-grid *:[grid-area:1/1]">
  <span zdStatus color="error" class="animate-ping" aria-hidden="true"></span>
  <span zdStatus color="error" aria-hidden="true"></span>
</span>
<span>Service is down</span>
```

## Evidence required before Preview

Validate native semantics and consumer labels; all color/size/prefix/clearing behavior; axe and
manual contrast, forced-colors, animation, reduced-motion, RTL, localization, zoom/reflow and AT;
SSR/hydration; and light/dark/custom/mobile RTL visual coverage.

## Sources

- [daisyUI Status documentation](https://daisyui.com/components/status/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
