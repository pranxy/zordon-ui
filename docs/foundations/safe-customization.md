# Safe customization and upstream internals

Zordon UI keeps daisyUI's documented customization surface available without turning every
selector or CSS variable in daisyUI's generated source into a Zordon compatibility promise. This
contract tells consumers which hook to choose and tells component authors when an upstream detail
is too fragile to expose.

This policy is based on daisyUI 5.7.16. daisyUI itself states that its component-specific CSS
variables are internal, are not subject to semantic versioning, and may change or disappear in a
minor release. Their presence in the daisyUI utilities page makes them discoverable advanced
escape hatches; it does not make them stable Zordon APIs.

## Customization hierarchy

Choose the highest suitable layer in this table.

| Layer                                | Examples                                                                                                                                     | Ownership and compatibility                                                                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zordon public API                    | Typed inputs, models, directives, documented part selectors/directives, documented `--zd-*` variables                                        | Zordon-owned. Once Stable, changes follow Zordon's deprecation and semantic-versioning policy. Preview APIs follow the component maturity policy.                   |
| Documented daisyUI surface           | Component and modifier classes, Tailwind utilities, theme configuration, semantic color/radius/size variables                                | Upstream-owned. Every Zordon component must verify the hooks it uses across the tested daisyUI peer range; Zordon cannot freeze behavior beyond daisyUI's contract. |
| Consumer-owned CSS                   | Additive host/part classes, native style bindings, data attributes, custom themes, application selectors targeting public parts              | Consumer-owned. Zordon preserves the documented composition points; the application owns its rules and specificity.                                                 |
| daisyUI component-specific variables | `--btn-p`, `--alert-color`, `--range-thumb-size`, and other variables listed under daisyUI's component-specific table                        | Advanced upstream internals. They carry no Zordon semver guarantee and require an exact daisyUI version plus consumer visual tests when appearance depends on them. |
| Observed implementation details      | Unlisted variables such as `--alert-border-color`, generated selector nesting, CSS layer order, internal DOM shape, source/deep-import paths | Unsupported. They may change in any daisyUI release and must not appear in Zordon public examples or contracts.                                                     |

The daisyUI peer range describes versions that Zordon integrates with. It does not promote an
upstream internal into a stable Zordon hook.

## Preferred consumer techniques

### 1. Use component inputs and documented variants

Use typed inputs for semantic choices that the component owns. They keep Angular state,
accessibility behavior, class prefixes, and the generated Tailwind candidate inventory aligned.

```html
<button zdButton color="primary">Save</button>
```

### 2. Add documented classes and Tailwind utilities

Consumer classes are additive. This is the preferred escape hatch for one-off layout and visual
treatment that does not need a component API.

```html
<button zdButton class="rounded-full tracking-wide">Save</button>
```

Applications remain responsible for Tailwind source detection and for the specificity of their
own rules. Follow the class-prefix contract when daisyUI or Tailwind prefixes are enabled.

### 3. Customize themes with documented tokens

Use a daisyUI theme for design-system-wide color, radius, scale, border, depth, and noise changes.
The documented theme tokens include semantic `--color-*` values, `--radius-selector`,
`--radius-field`, `--radius-box`, `--size-selector`, `--size-field`, `--border`, `--depth`, and
`--noise`.

```css
@plugin "daisyui/theme" {
  name: 'brand';
  --color-primary: oklch(55% 0.22 260);
  --radius-field: 0.375rem;
  --border: 1px;
}
```

These names are documented daisyUI theme hooks and remain upstream-owned. Zordon verifies its
components against the supported daisyUI range rather than re-exporting or renaming the entire
theme schema.

### 4. Use native per-instance style bindings

Use `[style]` or `[style.property]` for a deliberate instance override. The instance-style contract
defines Angular ownership, clearing, `NgStyle`, security, SSR, and hydration behavior.

```html
<button zdButton [style.min-width.px]="minimumWidth">Save</button>
```

### 5. Target documented Zordon parts or variables

Compound components expose documented projection selectors or functional part directives where
consumers need a stable anatomy hook. When daisyUI has no suitable stable hook, a component may
publish a semantic
`--zd-<component>-<purpose>` variable. Its documentation must define the value grammar, default,
inheritance, target part, examples, and visual states.

A documented `--zd-*` variable is Zordon-owned public API. It must not merely reveal the name of an
upstream internal variable.

## Advanced daisyUI component variables

Use a daisyUI component-specific variable only when all of the following are acceptable:

- no documented class, utility, theme token, Zordon part, or `--zd-*` hook solves the need;
- the application pins an exact daisyUI version rather than relying on a floating minor range;
- the application verifies the variable's exact compiled spelling for that version and daisyUI
  prefix instead of concatenating the prefix itself;
- visual tests cover the customized state and are reviewed on every daisyUI update;
- the application accepts that the override can stop working without a Zordon major release.

For example, daisyUI documents `--alert-color` as a component-specific internal variable:

```html
<!-- Advanced and version-coupled; not a Zordon compatibility promise. -->
<div class="alert" [style.--alert-color]="customColor">...</div>
```

With daisyUI 5.7.16 and `prefix: "d-"`, that example becomes `--d-alert-color`. This is not a
universal concatenation rule. The installed prefix transformer deliberately leaves variable names
starting with `color-`, `size-`, `radius-`, `border`, `depth`, or `noise` unchanged; for example,
the documented Tab internal `--radius-start` remains unprefixed. A Tailwind prefix does not prefix
CSS variable names. Always inspect the CSS compiled from the pinned daisyUI version. Zordon does
not expose a generic API for generating arbitrary daisyUI variables.

## Prohibited dependencies

Do not:

- copy a variable name from generated CSS when it is absent from daisyUI's documentation;
- select undocumented descendants or pseudo-elements inside a Zordon component;
- depend on daisyUI's CSS layer order, selector specificity, or emitted declaration order;
- use `::ng-deep`, implementation-file deep imports, or copied daisyUI component CSS;
- apply `!important` to defeat a component contract;
- advertise a daisyUI component-specific variable as stable because it appears in official docs;
- expose an arbitrary CSS declaration, selector, property-name, or internal-variable map as an
  Angular input.

If a supported customization is impossible without one of these techniques, open a component API
gap and add a semantic Zordon hook instead of normalizing the workaround.

## Component author requirements

Before a component satisfies Definition of Ready, record its complete styling inventory:

- base, part, modifier, state, and responsive daisyUI classes;
- documented daisyUI theme variables it consumes;
- public Zordon part selectors and `--zd-*` variables, if any;
- every daisyUI component-specific variable used by implementation or examples;
- required Tailwind candidates for all supported prefix modes;
- expected customization states for visual regression.

An internal-variable dependency requires a written justification showing why public classes,
theme tokens, consumer styles, or named parts are insufficient. Keep the raw upstream name private.
If consumers need a stable semantic control, expose a narrowly named `--zd-*` variable and map it
internally. Do not expose a generic variable dictionary.

Zordon depends on an internal variable only when Zordon code, styles, or documentation reads, sets,
maps, or recommends that variable. Applying a documented daisyUI class whose upstream CSS happens
to use internals does not trigger this gate.

Consumer code that directly uses an internal variable owns an exact daisyUI dependency pin. Zordon
implementation code cannot require every consumer to pin one version while advertising a wider
peer range: it must prove the dependency at the supported floor and current version, or narrow the
peer range. When the first such mapping is required, introduce one private, tested, prefix-aware
name resolver for the exact known variable inventory. Components must not hard-code a spelling,
concatenate a prefix themselves, or expose the resolver as an arbitrary public generator.

The first component that depends on a daisyUI internal variable must also add behavior-sensitive
CSS compilation and browser coverage that proves:

1. the default and customized rendering under the minimum and current supported daisyUI versions;
2. empty and configured daisyUI prefixes, including prefixed and excluded-from-prefix spellings;
3. the stable Zordon hook still controls the intended public part after a daisyUI update;
4. representative light, dark, custom, low-radius, and high-radius themes;
5. consumer overrides do not break forced-colors, reduced-motion, RTL, SSR, or hydration where
   relevant.

When widening or updating the daisyUI range, diff the component styling inventory, rerun the
compatibility and visual suites, and classify any public visual change under Zordon's API and
deprecation policies. If an upstream change prevents Zordon from preserving a Stable hook, narrow
the peer range or ship the required Zordon migration; do not silently accept the regression.

## Documentation labels

Component documentation must label each hook as one of:

- **Zordon stable** — owned and versioned by Zordon;
- **daisyUI documented** — upstream-owned public class, utility, or theme token;
- **daisyUI internal** — advanced, exact-version-only component variable;
- **consumer-owned** — application CSS or content using a documented composition point.

Never mix stable and internal hooks in an unlabeled “CSS variables” table.

## Current repository status

No rebuilt component currently depends on a daisyUI component-specific variable, so this step adds
no runtime helper or CSS. Compatibility fixtures are added with the first component that has a
real dependency; a synthetic variable registry now would create a false public surface without
proving rendered behavior.

## References

- [Customize daisyUI components](https://daisyui.com/docs/customize/)
- [daisyUI themes](https://daisyui.com/docs/themes/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [daisyUI configuration](https://daisyui.com/docs/config/)
- [ADR 0003: Styling, theming, and customization](../architecture/0003-styling-and-theming.md)
- [Host class composition](host-class-composition.md)
- [Per-instance style overrides](instance-style-overrides.md)
- [Named parts and slots](named-parts-and-slots.md)
- [Class-prefix contract](class-prefixes.md)
