# Safe customization research

## Question

Define which visual customization surfaces Zordon UI supports and how consumers and contributors
must treat daisyUI implementation details that are not semver-stable contracts.

## Context and evidence bar

- Plan baseline: daisyUI 5.7.16, Tailwind CSS 4, Angular 21–22.
- ADR 0003 requires public classes/tokens, documented Zordon-owned hooks, and no semver promise for
  daisyUI component internals.
- Verify the distinction against installed daisyUI 5.7.16 source and current official documentation.
- Prefer a documentation-only contract unless repository evidence identifies runtime behavior that
  must be added now.

## Questions

1. Which customization layers are supported public contracts?
2. Which daisyUI variables are documented theme tokens, and which are component internals?
3. What compatibility promise can Zordon make for each layer?
4. What must each future component record and test before it is ready?
5. What consumer examples and anti-patterns prevent accidental coupling?

## Sources and findings

- Workspace `package.json`, lockfile, and `node_modules/daisyui/package.json`: the workspace declares
  daisyUI `^5.7.16` and resolves 5.7.16; the published library peer range is
  `>=5.7.16 <6.0.0`.
- [Customize daisyUI components](https://daisyui.com/docs/customize/) documents daisyUI modifier
  classes, Tailwind utilities, and application CSS/`@apply` as supported customization methods.
- [daisyUI themes](https://daisyui.com/docs/themes/) documents custom and extended themes plus the
  semantic color, radius, size, border, depth, and noise variables.
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/) separates theme CSS
  variables from component-specific variables. It explicitly labels component-specific variables
  internal, outside semantic versioning, removable in minor releases, and suitable only with a
  fixed daisyUI version when UI depends on them.
- [daisyUI configuration](https://daisyui.com/docs/config/) documents themes, root, include/exclude,
  and class prefixes.
- Installed `functions/addPrefix.js` preserves variable names beginning with `color-`, `size-`,
  `radius-`, `border`, `depth`, or `noise` but prefixes other component variables. Direct 5.7.16
  probes map `--alert-color` to `--d-alert-color` while leaving the documented Tab internal
  `--radius-start` unchanged under `prefix: "d-"`; Tailwind's prefix is unrelated. Therefore no
  general string-concatenation rule is safe.
- Installed `components/alert/object.js` uses documented internal `--alert-color` and unlisted
  `--alert-border-color`. The latter demonstrates why source observation cannot define a public
  contract.
- ADR 0003 already requires public classes/tokens, documented Zordon hooks, version-pinned tests,
  and no semver promise for daisyUI internals. Existing class/style/part/theme/prefix contracts
  supply the preferred public layers.
- No rebuilt catalog component currently consumes a daisyUI component-specific variable. Runtime
  variable generation or a compatibility fixture would therefore be synthetic rather than
  behavior-sensitive.

## Synthesis decisions

- Define five layers: Zordon public API, documented daisyUI surface, consumer-owned CSS, documented
  daisyUI component internals, and unsupported source-only details.
- Treat documented daisyUI component variables as discoverable advanced escape hatches, not stable
  hooks; require exact application pinning and visual tests for consumer reliance.
- Use semantic, documented `--zd-<component>-<purpose>` variables when Zordon must offer a stable
  hook that daisyUI lacks. Do not expose the raw upstream name or a generic variable map.
- If Zordon first needs an internal mapping, add a private resolver restricted to the known
  inventory and prove exact prefixed/excluded spelling. Consumer direct use requires an exact pin;
  Zordon implementation use must pass supported floor/current lanes or narrow the peer range.
- Require each component to inventory styling hooks and justify every internal dependency. Add
  real prefix/compiler/browser/visual compatibility evidence with the first component that uses
  one.
- Complete this plan row as a documentation contract. Keep the cross-cutting risk Partial until
  real components provide the per-component compatibility gates.
- Add no runtime API, generated registry, CSS, test fixture, or Changeset in this tranche.
