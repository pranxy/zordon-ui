# daisyUI and Tailwind class-prefix contract

Zordon UI generates daisyUI host classes at runtime. Applications compile the matching CSS at
build time. These two configurations must be identical: Angular cannot inspect or repair a
mismatched, pruned, SSR-only, or cross-origin stylesheet.

## Application configuration

No provider is required when both prefixes are empty. For prefixed CSS, register one application
provider at bootstrap:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideZordonUi } from '@pranxy/zordon-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZordonUi({
      classPrefixes: {
        daisyUi: 'd-',
        tailwind: 'tw',
      },
    }),
  ],
};
```

`daisyUi` is the exact daisyUI prefix, including its separator. `tailwind` is the Tailwind v4
identifier without a colon. Configuration is copied at provider creation and remains fixed for the
application and its compiled CSS bundle. Runtime, route, nested-injector, and per-component prefix
switching are unsupported.

| Mode          | CSS configuration                                | Angular configuration             | Generated button class |
| ------------- | ------------------------------------------------ | --------------------------------- | ---------------------- |
| None          | default Tailwind and daisyUI                     | omit provider or use empty values | `btn`                  |
| daisyUI only  | daisyUI `prefix: "d-"`                           | `daisyUi: 'd-'`                   | `d-btn`                |
| Tailwind only | Tailwind `prefix(tw)`                            | `tailwind: 'tw'`                  | `tw:btn`               |
| Combined      | Tailwind `prefix(tw)` and daisyUI `prefix: "d-"` | `daisyUi: 'd-'`, `tailwind: 'tw'` | `tw:d-btn`             |

Tailwind escapes the colon in generated CSS selectors, for example `.tw\:d-btn`; the DOM token
remains `tw:d-btn`. daisyUI's special `theme-controller` class never receives the Tailwind prefix,
so the combined form is `d-theme-controller`.

Tailwind prefixes are empty or lowercase ASCII letters matching `/^[a-z]+$/`. The verified daisyUI
prefix contract is empty or `/^[a-z][A-Za-z0-9_-]*$/`. Zordon rejects invalid values instead of
silently trimming, normalizing, or changing their separators.

## Required Tailwind candidates

Tailwind detects complete class tokens in source text; it cannot discover a class assembled by an
Angular service at runtime. It also ignores dependencies under `node_modules` unless they are
registered explicitly. Therefore every application must include the complete configured Zordon
tokens as build-time candidates.

For a button that may emit `btn` and `btn-primary`, use the candidates matching the selected mode:

```css
/* No prefixes */
@source inline("btn btn-primary");

/* Combined daisyUI d- and Tailwind tw prefixes */
@source inline("tw:d-btn tw:d-btn-primary");
```

Listing `btn`, `d-btn`, or `tw:btn` does not generate `tw:d-btn`; the complete spelling is required.
Each component's documentation must publish its full candidate inventory, including state and
modifier classes. An installation schematic may automate this later, but runtime configuration is
never a substitute for CSS candidate registration.

## Component and extension implementation

Component entry points inject `ZdClassNames` and pass one canonical, unprefixed daisyUI token at a
time:

```ts
private readonly classNames = inject(ZdClassNames);
protected readonly hostClasses = zdHostClasses(
  this.classNames.daisyUi('btn'),
  this.classNames.daisyUi('btn-primary'),
);
```

Do not concatenate prefixes in components, accept already-prefixed values, generate consumer
Tailwind utilities, or special-case `theme-controller` outside the shared service. Consumer-authored
classes remain additive and consumer-owned. Extension authors using `ZdClassNames` have the same
candidate-registration responsibility.

The provider and generator use no DOM, stylesheet access, global mutable state, or browser APIs.
Identical server and client configuration therefore produces deterministic hydration-safe tokens.

## Verification

The repository tooling compiles all four modes against installed Tailwind and daisyUI packages with
automatic source detection disabled. It verifies exact selectors, a real component declaration,
the `theme-controller` exception, the daisyUI grammar boundary, and failure to emit CSS when the
complete candidate is absent. CI is separately configured to repeat the fixture with the supported
Tailwind 4.1.0 floor.

## Upstream references

- [daisyUI configuration](https://daisyui.com/docs/config/)
- [Tailwind utility prefixes](https://tailwindcss.com/docs/styling-with-utility-classes#using-the-prefix-option)
- [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
