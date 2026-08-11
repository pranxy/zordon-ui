# @pranxy/zordon-ui

Angular components and directives using daisyUI as their visual foundation.

The v1 API is being rebuilt from approved architecture decisions. Existing component source under this project is legacy reference material until it is replaced through the tracked component workflow.

## Development

- Build: `ng build components --configuration production`
- Test: `ng test components`
- Type contracts: `npm run test:lib:types`
- Architecture decisions: [`../../docs/architecture/README.md`](../../docs/architecture/README.md)
- Delivery tracker: [`../../DAISYUI_ANGULAR_BUILD_PLAN.md`](../../DAISYUI_ANGULAR_BUILD_PLAN.md)

The public type-only foundation is documented in the
[typed vocabulary guide](https://github.com/pranxy/zordon-ui/blob/master/docs/foundations/typed-vocabularies.md).
Application prefix setup and required Tailwind candidates are documented in the
[class-prefix contract](https://github.com/pranxy/zordon-ui/blob/master/docs/foundations/class-prefixes.md).
Global, nested, and per-component daisyUI boundaries are documented in the
[theme-scope contract](https://github.com/pranxy/zordon-ui/blob/master/docs/foundations/theme-scopes.md).
The staged application-default and local-input precedence rules are documented in the
[component-defaults contract](https://github.com/pranxy/zordon-ui/blob/master/docs/foundations/component-defaults.md).

The package targets Angular 21–22, Tailwind CSS 4, and daisyUI 5. Every public component must satisfy the shared Definition of Done before it is exported as stable.
