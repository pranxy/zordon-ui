# Global, nested, and per-component daisyUI theme research

Updated: 2026-08-10

## Question and constraints

Define the smallest Angular foundation that supports daisyUI 5.7.16 global, nested, and
per-component themes while keeping consumer-defined theme names, native `data-theme` ownership,
SSR/hydration determinism, and the later Theme Controller component intact.

## Evidence bar

- Official daisyUI theme/configuration documentation and installed 5.7.16 source.
- Real CSS compilation where selector or variable behavior is material.
- Installed Angular 21.2.19 host-attribute behavior and existing SSR/hydration fixtures.
- Accepted Zordon styling, composition, SSR, packaging, and public-API policies.

## Open questions

1. Which global behavior should remain native HTML/CSS instead of a provider or DOM service?
2. What exact Angular directive/input represents nested and per-component `data-theme` scopes?
3. How should empty/unset values inherit, and which API owns `data-theme` on a host?
4. What grammar can accept consumer-defined names without claiming themes were compiled?
5. Which tests distinguish attribute plumbing from actual daisyUI theme CSS behavior?
6. Which persistence, system-preference, and runtime-selection work belongs only to Theme Controller?

## Sources and findings

- Official daisyUI theme documentation: themes are selected with `data-theme` on any element,
  boundaries can nest without limit, the root attribute can set the global theme, and custom themes
  are declared through `@plugin "daisyui/theme"`.
- Official configuration documentation: `themes` is a build-time plugin option and `root` controls
  the selector receiving global variables.
- Official Theme Controller documentation: selection is CSS-only; persistence is optional
  application JavaScript.
- Installed daisyUI 5.7.16 `functions/pluginOptionsHandler.js`: the default is light plus
  preferred-dark; preferred dark targets `:root:not([data-theme])`, so system behavior requires an
  absent root attribute.
- Installed `theme/index.js`: custom names are escaped into quoted selectors, so the Angular API
  must preserve arbitrary non-empty strings rather than expose a built-in-name union.
- Installed `base/rootcolor/object.js`: every `[data-theme]` receives root color declarations. An
  empty/unknown attribute is therefore not equivalent to removing the boundary.
- Installed Angular 21.2.19: a directive host attribute binding owns the initial same-host
  collision, but a later native binding update can take over. Angular 21–22 ordering is not made
  part of the contract; one owner per host is.
- A real compile with `root: "#app"` emits the default on `:where(#app)` and preferred dark on
  `#app:not([data-theme])`. Direct variables on that root can override a theme inherited from
  `<html>`, so the global boundary must match the configured root.

## Rejected evidence or approaches

- A global theme service/provider: it would duplicate native CSS behavior and require browser APIs.
- Themes in immutable `ZdConfig`: compiled names and current runtime selection are separate from
  class-prefix configuration.
- A built-in theme-name union or runtime registry: consumers can compile arbitrary custom names and
  the directive cannot inspect generated CSS safely on the server.
- `data-theme="system"`: daisyUI interprets it as a literal name; preference behavior comes from an
  absent root attribute.
- Per-component `theme` inputs: one attribute directive composes on native and Angular hosts.
- Promising same-host binding precedence: the supported rule is exactly one `data-theme` owner.

## Synthesis decisions

- Applications own global selection with native `data-theme` on daisyUI's configured root; that is
  `<html>` only for the default `:root` configuration. Absence opts into default/preferred-dark CSS.
- Root-export one standalone `[zdTheme]` directive for nested and per-component hosts.
- Preserve exact non-empty strings. Map `null`, `undefined`, and `''` to attribute removal and
  inheritance.
- Keep the directive declarative and DOM/global-free for deterministic SSR and hydration.
- Keep storage, media-query observation, cross-tab sync, registry, and user selection in the future
  Theme Controller.
- Document that CDK portals leave nested or custom-root DOM theme scopes; forwarding belongs to
  overlay infrastructure, while default `:root` plus an `<html>` scope covers the body container.
