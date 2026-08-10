# Styling and theming contract

Zordon UI uses daisyUI as its visual source of truth. The Angular package supplies behavior and typed APIs; the consuming application compiles Tailwind CSS and daisyUI into its own stylesheet.

Shared component input literals follow the
[typed foundation vocabulary contract](../foundations/typed-vocabularies.md).
Library and consumer host classes follow the
[host class composition contract](../foundations/host-class-composition.md).

## Supported versions

- Tailwind CSS `>=4.1.0 <5.0.0`
- daisyUI `>=5.7.16 <6.0.0`

Those packages are peer dependencies of `@pranxy/zordon-ui`. Applications control their actual versions, generated CSS, enabled themes, and class prefixes.

## Basic application setup

Configure Tailwind's PostCSS plugin at the application workspace root:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Then load Tailwind and daisyUI in the application's global stylesheet:

```css
@import 'tailwindcss';

@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark;
}
```

The default Zordon UI contract uses daisyUI's empty class prefix. Angular selectors still use the unrelated `zd` prefix, such as `zd-button`.

## daisyUI class prefixes

Consumers may configure a daisyUI prefix to avoid class-name collisions:

```css
@import 'tailwindcss';

@plugin "daisyui" {
  prefix: 'd-';
  themes:
    light --default,
    dark --prefersdark;
}
```

With that configuration, daisyUI's `btn` class becomes `d-btn`. Zordon UI's global configuration must be given the same daisyUI prefix so generated host classes match the compiled CSS. The typed Angular configuration for this synchronization is a Phase 2 deliverable and is not public yet.

The daisyUI class prefix and Tailwind utility prefix are independent. If both are enabled, Tailwind's prefix syntax also applies to generated daisyUI classes. This combination will be covered by compatibility fixtures, but the library default remains no prefix for either system.

Prefixes are build-time contracts. Changing one at runtime does not generate a second set of CSS classes.

## Themes and scopes

Applications choose the themes compiled into their CSS:

```css
@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark,
    cupcake,
    corporate;
}
```

Apply a theme globally or to any nested scope with `data-theme`:

```html
<html data-theme="dark">
  <main>
    <section data-theme="cupcake">...</section>
  </main>
</html>
```

Components must inherit the nearest theme scope. A component may expose an additive per-instance theme boundary, but it must not rewrite an ancestor's theme.

Custom themes remain ordinary daisyUI v5 themes declared with `@plugin "daisyui/theme"`. Consumers retain ownership of semantic colors, radii, sizes, border width, depth, and noise.

## Customization guarantees

The library will:

- add daisyUI classes without replacing consumer-supplied classes;
- preserve consumer styles, CSS variables, data attributes, and projected content;
- expose typed inputs for documented daisyUI modifiers while still permitting direct class customization;
- treat documented daisyUI theme variables as consumer-owned styling hooks;
- document any library-owned CSS variables and public part directives;
- avoid promising compatibility for undocumented daisyUI internals.

Components implement that guarantee with Angular host class-map bindings. Static `class`, dynamic
`[class]`, per-token `[class.name]`, and non-overlapping `ngClass` tokens remain consumer-owned
sources; the library never reads or rewrites the complete class attribute. An explicit consumer
per-token binding may suppress a library token according to Angular's normal styling precedence.
Use `[class.name]`, not `ngClass`, when overriding a token also owned by the library because
`NgClass` removal does not participate in host class-map ownership restoration.

The library does not ship a precompiled daisyUI theme stylesheet. This avoids duplicate CSS and allows each application to control generation, pruning, themes, and prefixes.

## Playground policy

The documentation application uses daisyUI's default empty class prefix, light default theme, and dark preferred-color-scheme theme. Its stable visual-test fixture additionally compiles `corporate`, `cupcake`, and a consumer-defined theme to exercise low-radius, high-radius, and consumer-token boundaries without compiling daisyUI's full theme catalog. Prefix and nested-theme variants remain dedicated compatibility-fixture work.

## Upstream references

- [daisyUI Angular installation](https://daisyui.com/docs/install/angular/)
- [daisyUI configuration](https://daisyui.com/docs/config/)
- [daisyUI themes](https://daisyui.com/docs/themes/)
