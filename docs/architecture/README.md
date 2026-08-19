# Architecture Decisions

These records define the v1 architecture for `@pranxy/zordon-ui`. They are intentionally based on the product goals and current platform guidance rather than the legacy component implementations in this repository.

| ADR                                                | Decision                                             | Status   |
| -------------------------------------------------- | ---------------------------------------------------- | -------- |
| [0001](0001-platform-support.md)                   | Platform and compatibility policy                    | Accepted |
| [0002](0002-component-api-and-composition.md)      | Component API and composition conventions            | Accepted |
| [0003](0003-styling-and-theming.md)                | daisyUI styling, theming, and customization          | Accepted |
| [0004](0004-overlays-and-angular-cdk.md)           | Overlay infrastructure and Angular CDK               | Accepted |
| [0005](0005-forms.md)                              | Angular Forms integration                            | Accepted |
| [0006](0006-packaging-and-public-api.md)           | Packaging, entry points, and public API              | Accepted |
| [0007](0007-accessibility-ssr-and-localization.md) | Accessibility, SSR, localization, and directionality | Accepted |
| [0008](0008-angular-aria.md)                       | Angular Aria headless interaction foundation         | Accepted |

## Applied architecture maps

- [Package entry-point map](entry-points.md)
- [Styling and theming contract](../guides/styling-and-theming.md)
- [Angular Aria adoption and component map](../foundations/angular-aria-adoption.md)
- [Testing harness and interaction-helper foundation](../foundations/testing-harnesses-and-interactions.md)
- [Angular form-control behavior](../foundations/form-control-behavior.md)
- [Async action state and cancellation](../foundations/async-actions.md)
- [Public API review](../contributing/api-review.md)
- [Deprecation and breaking changes](../contributing/deprecation-policy.md)
- [Component maturity](../contributing/component-maturity.md)

## Decision process

- Decisions that change the public API, dependency model, supported platform, or accessibility behavior require an ADR.
- Superseded decisions remain in this directory and link to their replacement.
- Component-specific choices belong in component specifications unless they change a shared convention.
- The package license remains a product-owner decision and is not inferred by these ADRs.
