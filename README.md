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
