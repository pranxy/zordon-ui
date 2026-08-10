# Package entry-point map

This document applies ADR 0006 to the v1 component catalog. An entry point is added only when its first public API is implemented; empty placeholders are not published.

## Primary entry point

`@pranxy/zordon-ui` owns shared providers, injection tokens, configuration, stable cross-component types, and intentionally convenient stable exports. Component implementations must remain importable from their own entry points so consumers are not required to use the package root.

## Component entry points

Each catalog component receives one public secondary entry point. This keeps imports predictable, makes dependency boundaries reviewable, and lets advanced implementations stay within their component domain.

| Family       | Secondary entry points                                                                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions      | `button`, `dropdown`, `fab`, `modal`, `swap`, `theme-controller`                                                                                                                                                  |
| Data display | `accordion`, `avatar`, `aura`, `badge`, `card`, `carousel`, `chat-bubble`, `collapse`, `countdown`, `diff`, `hover-3d-card`, `hover-gallery`, `kbd`, `list`, `stat`, `status`, `table`, `text-rotate`, `timeline` |
| Navigation   | `breadcrumbs`, `dock`, `link`, `megamenu`, `menu`, `navbar`, `pagination`, `steps`, `tabs`                                                                                                                        |
| Feedback     | `alert`, `loading`, `progress`, `radial-progress`, `skeleton`, `toast`, `tooltip`                                                                                                                                 |
| Data input   | `calendar`, `checkbox`, `fieldset`, `file-input`, `filter`, `label`, `radio`, `range`, `rating`, `select`, `text-input`, `textarea`, `toggle`, `validator`, `otp`                                                 |
| Layout       | `divider`, `drawer`, `footer`, `hero`, `indicator`, `join`, `mask`, `stack`                                                                                                                                       |
| Mockup       | `browser-mockup`, `code-mockup`, `phone-mockup`, `window-mockup`                                                                                                                                                  |

For example, Button is imported from `@pranxy/zordon-ui/button`. Styled/native and advanced variants share a component entry point unless an optional dependency would otherwise become mandatory for the native variant. Deep imports below any entry point are unsupported.

## Non-component entry points

| Entry point                      | Purpose                                                | Dependency rule                                                            |
| -------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `@pranxy/zordon-ui/testing`      | Public component harnesses, fixtures, and test helpers | Must not be reachable from a production entry point                        |
| `@pranxy/zordon-ui/signal-forms` | Experimental Angular Signal Forms adapters             | Must not make experimental Signal Forms APIs a dependency of core controls |

No separate `core`, `theming`, `overlay`, or `forms` entry point is planned. Those shared public contracts belong at the package root; their implementation details remain private.

No `aria` entry point is planned. Components may privately compose `@angular/aria` under ADR 0008,
but must not re-export its developer-preview declarations or make consumers use Angular Aria deep
imports. Only component entry points that import a pattern retain its runtime code after tree
shaking; the package-level peer requirement is added with the first consuming component.

## Entry-point acceptance rules

Before an entry point is published, it must:

- expose one intentional `public-api.ts` with no accidental implementation exports;
- compile independently through ng-packagr in partial-Ivy mode;
- declare only the peer dependencies required by its public/runtime code;
- pass API extraction and package-tarball checks;
- avoid global side effects;
- have a documented import example and maturity label.

Adding, renaming, merging, or removing an entry point changes the public package contract and requires API review. Removal after a stable release follows the deprecation and semver policy.
