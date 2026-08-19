# Zordon UI

Zordon UI is a modern Angular component library that uses daisyUI as its visual foundation and adds Angular-native state, forms, accessibility, overlays, SSR support, localization, and complete customization.

The v1 API is under active development. The existing legacy component source is not the contract for the new API and remains unexported until each component is rebuilt through the tracked workflow.

## Current baseline

- Angular 21 build baseline with Angular 21–22 consumer support planned
- Tailwind CSS 4
- daisyUI 5.7.16
- Package: `@pranxy/zordon-ui`
- Selector prefix: `zd`
- License: MIT
- 68 components planned for v1

## Project tracking

- [Contributor workflow](CONTRIBUTING.md)
- [Contribution and compatibility policies](docs/contributing/README.md)
- [Build plan and 68-component matrix](DAISYUI_ANGULAR_BUILD_PLAN.md)
- [Architecture decisions](docs/architecture/README.md)
- [Package entry-point map](docs/architecture/entry-points.md)
- [Styling and theming contract](docs/guides/styling-and-theming.md)
- [Typed foundation vocabularies](docs/foundations/typed-vocabularies.md)
- [Host class composition](docs/foundations/host-class-composition.md)
- [Per-instance style overrides](docs/foundations/instance-style-overrides.md)
- [Named parts and slots](docs/foundations/named-parts-and-slots.md)
- [daisyUI and Tailwind class prefixes](docs/foundations/class-prefixes.md)
- [Global, nested, and component theme scopes](docs/foundations/theme-scopes.md)
- [Global component defaults and local precedence](docs/foundations/component-defaults.md)
- [Safe customization and daisyUI internal-variable policy](docs/foundations/safe-customization.md)
- [Angular Aria adoption and component map](docs/foundations/angular-aria-adoption.md)
- [Stable generated IDs](docs/foundations/stable-ids.md)
- [Focus management foundation](docs/foundations/focus-management.md)
- [Dismissal and outside-interaction foundation](docs/foundations/dismissal-and-outside-interaction.md)
- [Overlay host, stack, positioning, and scroll policy](docs/foundations/overlay-host-and-positioning.md)
- [Body scroll lock and scrollbar gutters](docs/foundations/body-scroll-lock.md)
- [Directionality and logical placement](docs/foundations/directionality-and-logical-placement.md)
- [Reduced motion and animation state](docs/foundations/reduced-motion.md)
- [Live announcements and accessible descriptions](docs/foundations/live-announcements-and-descriptions.md)
- [Angular form-control behavior](docs/foundations/form-control-behavior.md)
- [Async action state and cancellation](docs/foundations/async-actions.md)
- [Bundle-size budget policy](docs/testing/bundle-size-budgets.md)
- [SSR and hydration testing](docs/testing/ssr-and-hydration.md)
- [Maintainer release workflow](docs/guides/releasing.md)

## Development

Build the library:

```sh
ng build components --configuration production
```

Build the documentation application:

```sh
ng build dev --configuration development
```

Run the documentation application locally:

```sh
ng serve dev
```

The installation and public usage documentation will be finalized after the provider, theming, and first component APIs are stable. `ng add` support is planned before v1.0 and is not currently available.
