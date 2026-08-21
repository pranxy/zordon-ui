# Divider specification research

**Date:** 2026-08-21  
**Target:** LYT-01 Divider specification  
**Installed evidence:** daisyUI 5.7.16, `components/divider/object.js`

## Evidence and decision

- daisyUI 5.7.16 emits `divider`, eight semantic `divider-*` colors,
  `divider-horizontal`, `divider-vertical`, `divider-start`, and `divider-end`. Its default is
  the vertical-layout form; `divider-horizontal` serves side-by-side elements. `divider-start` hides
  the before line and `divider-end` hides the after line.
- `--divider-m` and `--divider-color` are installed upstream implementation variables, not Zordon
  public hooks; they must not become a prefix-blind API.
- Official daisyUI docs list the same classes and responsive `lg:divider-horizontal` composition:
  <https://daisyui.com/components/divider/>.
- HTML `<hr>` is a semantic thematic break: <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/hr>.

Use one standalone `[zdDivider]` class-composing directive. `color`, `orientation`, and `placement`
are optional visual inputs and future application-default candidates. Semantic mode is chosen by
consumer host markup: empty `<hr zdDivider>` is thematic; labeled or decorative `<div zdDivider>`
stays consumer-owned. The directive does not impose roles, IDs, events, focus, wrappers, or a
responsive breakpoint API. Browser, SSR, a11y, and visual proof remains required before Preview.
