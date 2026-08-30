# Aura specification research

**Question:** Define a daisyUI 5.7.16-compatible Angular Aura contract without inventing interaction, sizing, color, or animation APIs.

## Version context

- Installed package: `daisyui@5.7.16` (`node_modules/daisyui/package.json`).
- Official documentation inspected: https://daisyui.com/components/aura/ (currently 5.7.22).
- The documented candidate set matches the installed 5.7.16 component object. The installed source is authoritative for exact behavior and CSS-variable ownership.

## Source inventory

`node_modules/daisyui/components/aura/object.js` defines base `aura`; `aura-dual`, `aura-rainbow`, `aura-holo`, `aura-gold`, `aura-silver`, and `aura-glow`; and `aura-xs` through `aura-xl`. It also defines direct-child radius heuristics for Card/Alert, Button/Input/Select, and Checkbox/Toggle/Badge, plus exact-version variables `--aura-padding`, `--aura-radius`, `--tw-duration`, and animated `--aura-angle`.

The base wrapper is `position: relative; display: inline-block`; pseudo-elements sit behind direct children, which the component raises with `z-index: 1`.

## Material decisions

- Use one presentational `[zdAura]` native wrapper directive with optional `variant` and `size` candidate inputs only.
- Preserve upstream custom color/background support through consumer classes and native styles; do not publish color, background, radius, padding, intensity, or duration APIs.
- Do not add ARIA, focus, keyboard behavior, Forms, generated IDs, Angular Aria, CDK, timers, or browser reads.
- The effect is decorative and repeats indefinitely. daisyUI slows it fourfold under `prefers-reduced-motion: reduce`, which is insufficient for Zordon's static-first policy. Package implementation must provide a narrowly scoped CSS override that suppresses Aura animation and pseudo-element animation under `reduce`; no JavaScript media-query service is warranted.

## Sources

- https://daisyui.com/components/aura/
- `node_modules/daisyui/components/aura/object.js`
- `docs/foundations/reduced-motion.md`
