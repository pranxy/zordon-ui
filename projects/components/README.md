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

The package targets Angular 21–22, Tailwind CSS 4, and daisyUI 5. Every public component must satisfy the shared Definition of Done before it is exported as stable.
