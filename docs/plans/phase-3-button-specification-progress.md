# Phase 3 Button specification progress

**Row:** ACT-01 Button  
**Status:** Complete for specification; implementation not started  
**Last updated:** 2026-08-19

## Deliverable

The planned Button is a native-host `[zdButton]` directive, not a replacement control. Its specification fixes the semantic host boundary, public input vocabulary, default precedence, native disabled ownership, controlled loading/pressed behavior, class candidates, accessibility, form boundary, SSR, and Preview evidence.

## Decisions recorded

- Supported hosts are `button`, `a[href]`, and `input[type=button|submit|reset]`; role-button emulation is prohibited.
- `variant`, not `style`, owns daisyUI appearance modifiers so native `[style]` stays available.
- `layout` is one exclusive union for wide/block/square/circle.
- `color`, `variant`, `size`, and `layout` are the only candidates for typed application defaults.
- Native disabled remains authoritative; `zdDisabled` is link-only and does not remove `href`.
- `loading` is controlled presentation and host activation guarding only; it does not own work or form submission deduplication.
- There is no default spinner, icon slot, output, CVA, Angular Aria dependency, or generated ID.

## Completion evidence

- [x] Installed daisyUI 5.7.16 Button source reviewed for documented base, color, variant, size, layout, active, and disabled tokens.
- [x] Defaults, async-action, class-prefix, customization, motion, SSR, and maturity contracts applied to Button's boundary.
- [x] Planned public API and Preview evidence matrix documented in [Button](../components/button.md).
- [x] Matrix specification cell and plan log updated.

## Deferred to implementation

- Create the `@pranxy/zordon-ui/button` entry point and exports.
- Implement/test `withButtonDefaults` as the first typed defaults feature.
- Prove host/class behavior, native/link/input guards, Tailwind candidates, SSR/hydration, browser, visual, API, package/bundle, and manual AT requirements.
- Add the implementation Changeset. This documentation-only step does not alter the packed package.
