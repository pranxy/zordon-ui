# daisyUI theme scopes

Zordon UI keeps theme selection in daisyUI CSS. Applications compile the available themes and own
the global boundary; the optional `ZdTheme` directive supplies the same `data-theme` boundary on a
nested element or an Angular component host.

## Compile themes first

Only themes included in the consuming application's stylesheet can resolve their own variables:

```css
@import 'tailwindcss';

@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark,
    cupcake,
    corporate;
}

@plugin "daisyui/theme" {
  name: 'brand/v2';
  default: false;
  prefersdark: false;
  color-scheme: 'light';
  /* Consumer-owned semantic theme variables. */
}
```

`ZdTheme` accepts an exact string because custom theme names are consumer-owned. It does not ship a
built-in-name union, inspect generated CSS, or verify that a name was compiled. An unknown name is
still written to `data-theme` and otherwise follows daisyUI's CSS inheritance.

## Global and system-preference themes

Use native markup for the application-wide theme. With daisyUI's default `root: ":root"`, put the
boundary on `<html>` so the application, document body, and body-level CDK overlay containers
inherit it:

```html
<html data-theme="corporate">
  ...
</html>
```

To use daisyUI's configured default and `--prefersdark` themes, omit `data-theme` from the configured
root. `system` is not a special daisyUI theme name and must not be written as
`data-theme="system"`.
Preference observation, persistence, cross-tab synchronization, and user controls belong to the
future Theme Controller component, not this foundation directive.

If the application configures another daisyUI root, such as `root: "#app"`, that element—not
`<html>`—owns the global explicit/absent theme boundary. Variables emitted directly on `#app` can
override a theme inherited from `<html>`, while a body-level overlay container sits outside that
root. Applications that need globally themed body overlays should keep the default `:root`
configuration; forwarding a custom-root or nested theme to portaled overlays belongs to the shared
overlay infrastructure.

## Nested and per-component boundaries

Import the standalone directive wherever a nested boundary is needed:

```ts
import { Component, signal } from '@angular/core';
import { ZdTheme } from '@pranxy/zordon-ui';

@Component({
  selector: 'app-example',
  imports: [ZdTheme],
  template: `
    <section zdTheme="corporate">
      Inherits corporate
      <aside [zdTheme]="previewTheme()">Preview</aside>
      <app-account-card zdTheme="brand/v2" />
    </section>
  `,
})
export class ExampleComponent {
  readonly previewTheme = signal<string | null>('cupcake');
}
```

The directive works on native elements and component hosts. Future Zordon components reuse this
boundary rather than defining component-specific `theme` inputs.

The input rules are:

- a non-empty string is preserved exactly and written to `data-theme`;
- changing the value updates only that host boundary;
- `null`, `undefined`, and the empty string remove the attribute, restoring inheritance from the
  nearest ancestor or the root default/preferred-dark theme;
- whitespace is not trimmed because custom names are exact.

## Attribute ownership

Without `ZdTheme`, static `data-theme` and `[attr.data-theme]` remain fully consumer-owned. Treat
`ZdTheme` as the sole intended owner of its host's `data-theme`. Do not combine `[zdTheme]` and
`[attr.data-theme]` on the same element: Angular does not promise stable precedence when both
bindings update. Choose either the directive or the native binding:

```html
<!-- Zordon-owned boundary semantics -->
<section [zdTheme]="selectedTheme()"></section>

<!-- Direct consumer ownership -->
<section [attr.data-theme]="selectedTheme()"></section>
```

Components must never rewrite an ancestor's theme or add a `data-theme` binding unless the consumer
explicitly applies `ZdTheme`.

## Overlays, SSR, and hydration

The directive is a declarative host-attribute binding. It does not access `document`, storage,
stylesheets, or media-query APIs, so the server and browser produce the same boundary for the same
input. Updates and removals after hydration use normal Angular binding behavior.

A native `<dialog>` stays under its DOM ancestors and retains a nested theme. A CDK overlay moved to
the default body-level overlay container no longer inherits a nested scope; forwarding nested theme
context to portaled overlays belongs to the shared overlay infrastructure. With daisyUI's default
`:root` configuration, a global boundary on `<html>` continues to cover that container.

## Contributor checks

- Preserve arbitrary non-empty theme names; do not introduce a built-in-name registry.
- Keep theme CSS, available theme names, semantic values, and global selection consumer-owned.
- Test attribute behavior separately from compiled CSS behavior.
- For CSS integration, prove nested scopes differ, removal restores ancestor inheritance, a custom
  theme resolves a consumer-defined token, and preferred dark applies only without an explicit
  boundary.
- Keep browser globals, persistence, and system-preference observation out of `ZdTheme`.

## Upstream references

- [daisyUI themes](https://daisyui.com/docs/themes/)
- [daisyUI configuration](https://daisyui.com/docs/config/)
- [daisyUI Theme Controller](https://daisyui.com/components/theme-controller/)
