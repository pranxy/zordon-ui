# daisyUI and Tailwind class-prefix research

Updated: 2026-08-10

## Question and constraints

Define the Phase 2 runtime and consumer configuration contract that makes every Zordon-emitted
daisyUI class match CSS compiled with the Tailwind 4.1.x floor, installed Tailwind 4.3.2, and
daisyUI 5.7.16. Keep the solution
tree-shakeable, deterministic for SSR/hydration, additive with consumer classes, and independent of
legacy component code.

## Evidence bar

- Official Tailwind and daisyUI documentation for public configuration syntax.
- Installed source and an actual local CSS compilation for behavior-sensitive class spelling.
- Accepted Zordon ADRs and package/public-API policies.
- Explicit treatment of empty, daisy-only, Tailwind-only, combined, invalid, and runtime-change
  boundaries.

## Open questions

1. What exact class token does Tailwind's `prefix(...)` produce for daisyUI component classes?
2. Does the daisyUI prefix include its separator, and what characters do both tools accept?
3. Should Zordon expose one application provider now or wait for the later defaults foundation?
4. Which validation can prevent CSS/runtime desynchronization without pretending to inspect built
   CSS at runtime?
5. What fixture proves the compiled CSS and generated class contract without expanding browser or
   visual scope?

## Sources and findings

- Tailwind CSS v4 official upgrade and utility-class documentation:
  `https://tailwindcss.com/docs/upgrade-guide` and
  `https://tailwindcss.com/docs/styling-with-utility-classes`. CSS uses
  `@import "tailwindcss" prefix(tw);`; emitted tokens put the prefix first as a variant, for
  example `tw:flex` and `tw:hover:bg-red-600`.
- daisyUI official configuration documentation: `https://daisyui.com/docs/config/`. Its plugin
  receives the exact string `prefix: "d-"`; `btn` becomes `d-btn`. With Tailwind `prefix(tw)`,
  `btn` becomes `tw:d-btn`. `theme-controller` is the documented exception and becomes only
  `d-theme-controller`.
- Tailwind 4.1.0 and installed Tailwind 4.3.2 source validate the Tailwind prefix against `^[a-z]+$` and report that
  only lowercase ASCII letters are accepted.
- Installed daisyUI 5.7.16 `pluginOptionsHandler.js`, `index.js`, and `addPrefix.js` concatenate the
  daisyUI prefix directly onto component selectors and variables. No upstream option validation is
  performed; the installed full compiler verifies empty or `/^[a-z][A-Za-z0-9_-]*$/`.
- An in-memory PostCSS compilation using the installed packages confirmed `.btn`, `.d-btn`,
  `.tw\\:btn`, and `.tw\\:d-btn` for the four supported combinations. It also confirmed
  `input.d-theme-controller` and no Tailwind-prefixed theme-controller selector.
- A `source(none)` compilation confirmed runtime concatenation is invisible: combined CSS is
  emitted only for the complete `tw:d-btn` candidate, not `btn`, `d-btn`, or `tw:btn`.
- ADR 0003 requires centralized class generation and exact consumer/plugin synchronization. ADR
  0006 assigns shared providers, tokens, and common configuration to the package root.

## Rejected evidence or approaches

- Do not infer combined spelling from string concatenation alone; the real PostCSS compilation is
  the compatibility oracle.
- Do not read built CSS or mutate prefixes at runtime. CSS generation happens at application build
  time and runtime inspection would be incomplete, browser-only, and hydration-sensitive.
- Do not expose a generic Tailwind utility generator. Zordon owns only the daisyUI tokens emitted
  by its components; consumer utilities remain consumer-authored.
- Do not let every component concatenate prefixes independently or hard-code the
  `theme-controller` exception.

## Synthesis decisions

- Provide one root `provideZordonUi({ classPrefixes: { daisyUi, tailwind } })` configuration surface
  with empty-string defaults and an immutable resolved copy.
- Expose a tree-shakeable root class-name service for component entry points; keep its injection
  token and normalization helpers private.
- The service accepts one canonical unprefixed daisyUI token, returns the complete DOM class token,
  and owns the documented theme-controller exception.
- Validate the Tailwind prefix as empty or lowercase ASCII letters. Validate the daisyUI prefix as
  empty or the verified ASCII grammar `/^[a-z][A-Za-z0-9_-]*$/`.
- Require complete `@source inline(...)` candidates in consumer CSS because library runtime tokens
  cannot be discovered by Tailwind's scanner.
- Treat prefix configuration as application-bootstrap/build synchronization. Nested or runtime
  changes are unsupported even though ordinary Angular DI can technically be scoped.
- Keep a permanent installed-package compilation test in the tooling suite, plus pure/service and
  Angular host-class integration tests in the library suite.
