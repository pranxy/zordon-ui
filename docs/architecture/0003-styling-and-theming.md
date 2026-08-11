# ADR 0003: daisyUI styling, theming, and customization

Status: Accepted  
Date: 2026-08-07

## Context

daisyUI supplies the visual system through semantic class names, theme variables, and component variables. The Angular layer must not prevent Tailwind or daisyUI customization.

## Decision

- Treat daisyUI as the visual source of truth and avoid duplicating its component CSS in Angular component styles.
- Require consumers to configure Tailwind CSS 4 and daisyUI 5. Provide an installation schematic and documented manual setup.
- Keep daisyUI and Tailwind as peer dependencies of the published library and development dependencies of this workspace.
- Support a configurable daisyUI class prefix. Centralize class generation so components never hard-code an unchangeable prefix.
- Require complete build-time Tailwind candidates for library classes because runtime prefix generation is not source-detectable.
- Map documented daisyUI variants to typed Angular inputs while still allowing consumer classes, styles, data attributes, and CSS variables.
- Apply consumer host classes additively. Never replace the consumer's class attribute.
- Define public part directives and stable library-owned CSS variables only where daisyUI has no appropriate public hook.
- Do not promise semantic versioning for daisyUI's internal component variables. Pin tested daisyUI versions in CI and document any internal-variable usage.
- Apply the stability and authoring rules in the
  [safe customization contract](../foundations/safe-customization.md). A documented daisyUI
  component variable remains an upstream internal; a documented `--zd-*` variable is Zordon-owned
  public API.
- Support global themes, nested `data-theme` scopes, system preference, and per-component theme boundaries.
- Keep view encapsulation from blocking customization. Prefer host classes, projected native elements, and CSS variables over deep selectors.
- Ensure every visual regression suite covers default light, default dark, one low-radius theme, one high-radius theme, and one consumer-defined theme.

## Consequences

- Consumers keep the full daisyUI and Tailwind customization surface.
- The library package does not ship a large duplicate stylesheet.
- A compatibility check is required before widening the supported daisyUI range.

## Sources

- [Customize daisyUI components](https://daisyui.com/docs/customize/)
- [daisyUI themes](https://daisyui.com/docs/themes/)
- [daisyUI configuration](https://daisyui.com/docs/config/)
- [daisyUI variables](https://daisyui.com/docs/utilities/)
