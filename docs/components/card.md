# Card

**Component ID:** DSP-05  
**Maturity:** Planned  
**Entry point:** `@pranxy/zordon-ui/card`

Card applies daisyUI’s composable content-container styling to consumer-owned native markup. It is
four standalone directives—`[zdCard]`, `[zdCardBody]`, `[zdCardTitle]`, and
`[zdCardActions]`—not a templated widget, data model, navigation control, selection control,
accordion, loading state, or form control.

## Native and semantic boundary

Use `[zdCard]` on the element that already has the right meaning: a noninteractive content group
can be an `<article>` or `<section>`; a navigable card can be a native `<a>`; and selectable-card
semantics stay with a consumer-owned native checkbox/radio and its label. The Card directives add
only daisyUI classes. They never add roles, labels, IDs, focus behavior, keyboard/pointer event
handlers, ARIA state, navigation, disabled state, loading state, expanded state, or live-region
behavior.

```html
<article zdCard size="lg" style="border" class="bg-base-100 shadow-sm">
  <figure>
    <img src="/images/launch.jpg" alt="A launch vehicle on its pad" />
  </figure>
  <div zdCardBody>
    <h2 zdCardTitle>Launch status</h2>
    <p>All systems are ready for the next launch window.</p>
    <div zdCardActions class="justify-end">
      <button zdButton type="button">View mission</button>
    </div>
  </div>
</article>
```

`[zdCardTitle]` styles a consumer-selected heading; it does not choose the heading level or create
an accessible name. A `figure`, subtitle, footer, badge, media, empty state, and arbitrary body
content are normal projected markup, not Card parts or Angular slots.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16.

| Candidate                                             | Purpose                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| `card`                                                | Required base container                                                          |
| `card-body`                                           | Optional body/content part                                                       |
| `card-title`                                          | Optional title part                                                              |
| `card-actions`                                        | Optional actions part                                                            |
| `card-border`, `card-dash`                            | Optional documented border styles                                                |
| `card-side`                                           | Optional layout modifier: direct `figure` is placed beside the body              |
| `image-full`                                          | Optional visual modifier: direct `figure` becomes the background image treatment |
| `card-xs`, `card-sm`, `card-md`, `card-lg`, `card-xl` | Optional sizes; upstream base is medium                                          |

The official Card examples use an ordinary direct-child `<figure>` and `<img>`. There is no
documented `card-figure`, subtitle, footer, badge, disabled, loading, expandable, or interactive
class. Installed CSS also has internal `--card-p`, `--card-fs`, and `--cardtitle-fs` sizing
variables. These are exact-version daisyUI implementation details and are not Zordon APIs.

## Planned public API

| Directive         | Input       | Type                                                | Intrinsic default | Contract                                   |
| ----------------- | ----------- | --------------------------------------------------- | ----------------- | ------------------------------------------ |
| `[zdCard]`        | `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| undefined` | upstream medium   | Adds one optional `card-*` size candidate. |
| `[zdCard]`        | `style`     | `'border' \| 'dash' \| undefined`                   | none              | Adds one optional documented border style. |
| `[zdCard]`        | `side`      | `boolean \| undefined`                              | `false`           | Adds/removes `card-side`.                  |
| `[zdCard]`        | `imageFull` | `boolean \| undefined`                              | `false`           | Adds/removes `image-full`.                 |
| `[zdCardBody]`    | —           | —                                                   | —                 | Adds `card-body`; no inputs.               |
| `[zdCardTitle]`   | —           | —                                                   | —                 | Adds `card-title`; no inputs.              |
| `[zdCardActions]` | —           | —                                                   | —                 | Adds `card-actions`; no inputs.            |

Unsupported input values reject rather than create an uncompiled runtime class. `undefined` removes
an optional input’s corresponding candidate. Explicitly combining `side` and `imageFull` is
allowed as an upstream class composition but has no extra Angular interpretation; evidence must
cover the rendered result. There are no models, outputs, methods, app-wide defaults, Forms
integration, or Angular Aria/CDK dependency.

Static/dynamic consumer classes, non-overlapping `ngClass`, native styles and CSS custom
properties, `data-theme`, and native attributes remain additive. Explicit consumer candidates are
the documented per-token override boundary in
[host class composition](../foundations/host-class-composition.md).

## Content and compositions

The directives preserve ordinary consumer markup and do not impose a card template.

| Composition                | Consumer responsibility                                                          | Card responsibility                                                          |
| -------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Media                      | `figure`, image/video element, alternative text, loading policy, and crop choice | Applies only the upstream direct-figure layout/image treatment when selected |
| Title/subtitle/body/footer | Heading level, text semantics, metadata, footer and subtitle markup              | Styles body/title only where a part directive is used                        |
| Actions                    | Native link/button semantics, name, activation, disabled state, and focus        | Flex/wrap layout when `[zdCardActions]` is used                              |
| Badge/status               | Badge directive, visible text, status/live-region policy, and contrast           | No badge or status behavior                                                  |
| Selectable card            | Native checkbox/radio, label association, checked value, form state, and ARIA    | No selection API; daisyUI may visually react to consumer-owned state         |
| Navigable card             | Native link destination, name, focus order, and nested-interactive-content rules | No routing/navigation API                                                    |
| Loading/expandable card    | Busy/expanded semantics, content behavior, and motion policy                     | No loading/expand/collapse API                                               |

Avoid placing an interactive control inside a clickable card link/button. Choose one clear native
interactive owner, or use sibling actions inside a noninteractive card.

## Styling, themes, and customization

Use the documented candidates, ordinary Tailwind utilities, theme tokens, and native style
bindings for appearance and responsive layout. Consumers can set width, background, shadow,
radius, gaps, action alignment, and responsive candidates without new Angular inputs.

```html
<article
  zdCard
  size="sm"
  style="dash"
  [side]="isWide()"
  class="w-full bg-base-100 shadow-sm sm:card-side"
  [style.max-inline-size.rem]="32"
>
  <figure><img src="/images/report.png" alt="Monthly report preview" /></figure>
  <div zdCardBody>
    <h2 zdCardTitle>Monthly report</h2>
    <p>Available now.</p>
  </div>
</article>
```

The directive inputs select only documented daisyUI candidates; they do not replace consumer
classes or certify custom-theme contrast. Do not expose arbitrary padding, radius, shadow, color,
image filter, figure, content, interaction, loading, or animation inputs. Consumers who override
`--card-p`, `--card-fs`, or `--cardtitle-fs` accept daisyUI exact-version coupling and must follow
[safe customization](../foundations/safe-customization.md); Zordon neither sets nor documents them
as stable hooks.

## Accessibility, platform, and lifecycle

Card has no component-owned keyboard, pointer, focus, motion, directionality, browser API, timer,
subscription, observer, or cleanup path. The host and projected content render identically on
server and client, so SSR and hydration need only prove native attributes/content and deterministic
classes survive.

Consumers must supply meaningful image alternatives, choose the heading level, preserve reading
and focus order, and provide native semantics for links, buttons, selections, busy/expanded state,
and status updates. Review custom-theme contrast, forced-colors, RTL (including side layout), long
localized strings, 200% zoom, 400% reflow, and media cropping. `imageFull` darkens the image in
upstream CSS, but consumers still own adequate content contrast in every supported theme and
image.

## Examples

### Image background card

```html
<article zdCard [imageFull]="true" class="bg-base-100 shadow-sm">
  <figure><img src="/images/forest.jpg" alt="Forest at dawn" /></figure>
  <div zdCardBody>
    <h2 zdCardTitle>Trail conditions</h2>
    <p>Open, with light morning fog.</p>
  </div>
</article>
```

### Consumer-owned selectable composition

```html
<label zdCard style="border" class="bg-base-100">
  <input type="radio" name="plan" value="standard" />
  <div zdCardBody>
    <h2 zdCardTitle>Standard</h2>
    <p>For individual projects.</p>
  </div>
</label>
```

The application owns the input’s label, form state, validation, and selected-state announcement.

## Evidence required before Preview

| Area             | Required proof                                                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API/package      | Intentional `./card` entry, exact type tests, API extraction, tarball, and bundle review                                                                              |
| Native semantics | Article/link/label host preservation; no injected role, focus, ARIA, events, state, or wrapper markup                                                                 |
| Styling          | Every base/part/style/modifier/size candidate; stale-token removal; class/style precedence; direct `figure`; responsive side layout; image-full; consumer composition |
| Accessibility    | Axe; manual image alternatives, heading hierarchy, interactive ownership, keyboard behavior, contrast, forced-colors, zoom/reflow, RTL, and long localized strings    |
| SSR/hydration    | Stable native host/classes/content and clean hydration without browser-only work                                                                                      |
| Visual           | Light/dark/custom themes; border/dash; xs/xl; normal/side/image-full; media/text/actions; mobile RTL; long localized content                                          |

## Sources

- [daisyUI Card documentation](https://daisyui.com/components/card/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [Zordon Angular Aria adoption](../foundations/angular-aria-adoption.md)
- [Zordon host class composition](../foundations/host-class-composition.md)
- [Zordon safe customization](../foundations/safe-customization.md)
