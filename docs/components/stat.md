# Stat

**Component ID:** DSP-15  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/stat`

Stat applies daisyUI’s visual layout to consumer-owned numeric or textual facts. It is a native
compound directive set, not a data-fetching, number-formatting, charting, polling, loading-state,
trend-calculation, or live-announcement component.

## Native and semantic boundary

Consumers select the appropriate container and item semantics: for example, a `section` containing
a list, or an `aside`. Zordon adds no role, focusability, ID, ARIA relationship, event listener,
timer, observer, model, output, or keyboard behavior.

```html
<section zdStats aria-label="Account summary" class="shadow">
  <article zdStat>
    <p zdStatTitle>Account balance</p>
    <p zdStatValue>$89,400</p>
    <p zdStatDesc>Updated today</p>
    <div zdStatActions><button type="button">Add funds</button></div>
  </article>
</section>
```

## daisyUI inventory

The implementation pin is daisyUI 5.7.16; the current official documentation has the same list.

| Candidate                               | Purpose                                   |
| --------------------------------------- | ----------------------------------------- |
| `stats`                                 | Container of stat items                   |
| `stats-horizontal`, `stats-vertical`    | Horizontal default and vertical direction |
| `stat`                                  | One item                                  |
| `stat-title`, `stat-value`, `stat-desc` | Text anatomy parts                        |
| `stat-figure`, `stat-actions`           | Figure and action parts                   |

Official examples use Tailwind utilities for shadows, borders, colors, centering, actions, and
responsive direction. There are no Stat color, size, loading, error, trend, delta, chart, or
animation modifiers. Internal `--radius-box`, `--border`, and color-mixing variables are not public
Zordon APIs.

## Planned public API

| Directive                                    | Input                                                  | Contract                                                                                     |
| -------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `zdStats`                                    | `orientation: 'horizontal' \| 'vertical' \| undefined` | Adds one optional `stats-*` direction candidate; omitted preserves the upstream base layout. |
| `zdStat`                                     | —                                                      | Adds `stat`.                                                                                 |
| `zdStatTitle` / `zdStatValue` / `zdStatDesc` | —                                                      | Add the corresponding text-part class.                                                       |
| `zdStatFigure` / `zdStatActions`             | —                                                      | Add the corresponding figure/action-part class.                                              |

Invalid orientation values reject rather than generate an uncompiled class. There are no defaults
provider, forms integration, models, outputs, methods, Angular Aria, or CDK dependency.

## Content, styling, and accessibility

Consumers own formatting, localization, units, trend text, figure alternative text, actions, and
live-update policy. Do not add `role="status"`, `aria-live`, or focusability merely because a value
changes. Use real buttons or links for actions. Figures need appropriate alternative text or must
be decorative; arrows or color cannot be the only indicator of a trend.

Consumer classes, styles, `data-theme`, and attributes remain additive. Use ordinary utilities for
responsive direction and appearance:

```html
<section zdStats orientation="vertical" class="border bg-base-100 lg:stats-horizontal">
  <article zdStat class="place-items-center">
    <p zdStatTitle>Downloads</p>
    <p zdStatValue class="text-primary">31K</p>
    <p zdStatDesc>From January 1st to February 1st</p>
  </article>
</section>
```

## Platform and evidence

Stat has no library-owned browser API, timer, subscription, observer, cleanup, focus, motion, or
directionality path. Native text/classes are SSR/hydration-stable. Consumers must test long
localized values, RTL, zoom/reflow, custom-theme contrast, forced colors, and any live updates.

Before Preview, require package/API/bundle evidence; native semantic and prefix coverage; axe and
manual review of names, figures, actions, trend text, contrast, forced colors, reflow, RTL,
localization and live regions; SSR/hydration proof; and visual horizontal/vertical/anatomy/theme/
mobile-RTL evidence.

## Sources

- [daisyUI Stat documentation](https://daisyui.com/components/stat/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [Zordon Angular Aria adoption](../foundations/angular-aria-adoption.md)
- [Zordon safe customization](../foundations/safe-customization.md)

## Showcase visual story matrix — 2026-09-29

Scope: Basic, figures, centered, vertical, responsive and action layouts. Installed evidence: daisyUI 5.7.16 / Angular 21.2. Existing maturity and manual accessibility gates remain unchanged.

| Boundary                      | Representative and rationale                                                                                                       | Evidence                                            | Review                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| Requested compositions        | One static preview section groups materially different layouts without every input permutation.                                    | `e2e/visual-docs-site.spec.ts`, `showcase-stat--*`  | Reviewed                                     |
| Theme, viewport and direction | Light desktop and dark RTL mobile reveal spacing, wrapping and contrast differences. Diff also captures the image pair separately. | Same visual suite                                   | Reviewed                                     |
| Behavior, semantics and SSR   | Screenshots do not prove motion or interaction; browser geometry/state checks and production accessibility/SSR suites do.          | `e2e/docs-pages.spec.ts` and production docs suites | Scoped checks pass; integrated limits remain |

[Implementation evidence and remaining limits](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29).
