# Per-instance style and CSS-variable overrides

Zordon UI uses Angular's native style bindings as the public per-instance customization API. A
component does not add a parallel `styles`, `styleOverrides`, `cssVariables`, or `style` input.

```html
<button
  zdButton
  style="letter-spacing: 0.02em"
  [style.--color-primary]="brandColor"
  [style.--radius-field]="'0.25rem'"
  [style.min-width.px]="minimumWidth"
>
  Save
</button>
```

Static `style`, `[style]`, and `[style.property]` therefore work identically on Zordon UI
declarations and ordinary Angular elements. Custom properties cascade to descendants as normal CSS.

## Declaration pattern

When a declaration needs a dynamic inline value, bind only the property it owns through host
metadata:

```ts
@Directive({
  selector: '[zdProgressExample]',
  standalone: true,
  host: {
    '[style.--zd-progress-example-value]': 'progress()',
  },
})
export class ZdProgressExample {
  readonly progress = input('0%');
}
```

Several related properties may use a protected computed host style map:

```ts
host: {
  '[style]': 'hostStyles()',
}

protected readonly hostStyles = computed<
  Readonly<Record<string, string | number | null | undefined>>
>(() => ({
  '--zd-example-progress': this.progress(),
  'border-width': this.borderWidth(),
}));
```

No shared runtime composer is required. Angular already tracks static, map, per-property, and host
style sources independently.

## Ownership, precedence, and removal

- The library owns only the properties emitted by its host binding.
- Consumer static styles, `[style]` maps, and explicit `[style.property]` bindings remain separate
  template-owned sources and are not reconstructed by the library.
- Use `[style.property]` when intentionally overriding a library-owned ordinary property or custom
  variable. Library updates behind that override do not displace it.
- Set a per-property override to `undefined`, or omit a property from a style map, to relinquish that
  source and reveal the next available source.
- `null` and an empty string explicitly clear a per-property value. They suppress a lower-priority
  host value rather than revealing it.
- When a library host-map value becomes `undefined`, Angular removes that library source. A
  remaining consumer source is preserved; otherwise the inline property disappears.
- Do not infer ownership or precedence from serialized style order.

Preserving an inline style does not guarantee it wins over an external rule with greater
specificity or `!important`. Zordon UI library-owned values must not use `!important`, because that
would undermine the consumer override surface.

## `NgStyle` boundary

Non-overlapping `NgStyle` properties are supported. Overlap with a library-owned host property is
not a reliable override mechanism: Angular's `NgStyle` directive writes directly through
`Renderer2`, outside the host style-source restoration chain. The host value may win initially, and
later `NgStyle` removal can erase it until the host binding changes again.

Use `[style.property]` for intentional collisions with library-owned values.

## CSS-variable stability

Applications may set documented daisyUI theme variables on a component instance, including
semantic colors and shared radius or size tokens. This foundation does not turn every variable
found in generated daisyUI component CSS into a Zordon UI compatibility promise.

If daisyUI has no appropriate public hook, a component may define a documented
`--zd-<component>-<purpose>` variable. Once documented, that variable is part of the component's
public semver surface and requires public API review.

## Security boundary

Inline style values are trusted application configuration, not a safe sink for arbitrary user or
remote content. Angular 21 does not provide a general CSS-policy sanitizer for style values.

Do not:

- expose a library input that accepts a raw CSS declaration string or arbitrary property names;
- pass unvalidated untrusted values into style or custom-property bindings;
- call `bypassSecurityTrustStyle`;
- derive initial styles by reading `element.style`, `getComputedStyle`, or browser globals;
- replace the full style attribute with `style.cssText`, `setAttribute('style', ...)`, or imperative
  renderer bookkeeping.

CSS custom properties can hold arbitrary token streams. A value that later feeds a URL-bearing CSS
property can become network-active, so applications must validate it at their trust boundary.

## SSR and hydration

Host style values must derive from deterministic inputs or configuration shared by server and
client. Angular serializes host styles and CSS custom properties into server HTML without browser
measurement. Tests should assert individual property values, never exact style-string order.

A focused server-render assertion belongs with the first real declaration that consumes this
convention; the foundation itself uses no browser-only runtime code.

## Verification contract

Angular integration tests cover static styles, `[style]`, `[style.property]`, unit suffixes,
non-overlapping `NgStyle`, ordinary properties, CSS custom properties, library and consumer updates,
fallback chains, explicit clearing, and the unsupported overlapping `NgStyle` boundary.

## References

- [Angular host elements](https://angular.dev/guide/components/host-elements)
- [ADR 0003: daisyUI styling, theming, and customization](../architecture/0003-styling-and-theming.md)
- [Host class composition](host-class-composition.md)
