# Component documentation template research

## Question

What reusable component-documentation structure lets future Zordon components satisfy the build
plan without duplicating or weakening accepted API, accessibility, styling, forms, SSR, and release
contracts?

## Evidence

- The build plan requires API reference, basic and advanced examples, customization and anti-pattern
  guidance, accessibility, forms, themes, and visual evidence before a component is Done.
- ADR 0002 requires the lightest semantic Angular shape, controlled state, native events, projected
  content, named-part ownership, stable IDs, and component-specific defaults.
- ADR 0007 makes keyboard, focus, labels, announcements, RTL, localization, SSR/hydration,
  reduced-motion, forced-colors, zoom, and reflow component obligations.
- Public API review defines public DOM, accessibility, forms, styling, lifecycle, packaging, and
  evidence surfaces beyond TypeScript exports.
- Maturity policy requires a visible maturity label, matrix evidence, and migration record where
  applicable. The entry-point map forbids deep-import examples and empty placeholders.

## Decision

- Add one Markdown template under `docs/templates/`, used from the first component specification
  through published documentation.
- Link shared foundations and require local decisions rather than copying global rules into 68
  divergent documents.
- Do not add generated docs tooling, a component registry, app routes, runtime code, or public APIs
  before a real component proves that machinery.

## Sources

- `DAISYUI_ANGULAR_BUILD_PLAN.md`
- `docs/architecture/0002-component-api-and-composition.md`
- `docs/architecture/0007-accessibility-ssr-and-localization.md`
- `docs/contributing/api-review.md`
- `docs/contributing/component-maturity.md`
- `docs/foundations/safe-customization.md`
- `docs/foundations/form-control-behavior.md`
- `docs/testing/browser-integration.md`
- `docs/testing/ssr-and-hydration.md`
