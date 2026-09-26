---
'@pranxy/zordon-ui': minor
---

Rename Link's and Button's `zdDisabled` input to `disabled`, and make a disabled link stop Router
navigation.

- Link: `[zdDisabled]` is now `[disabled]`. While true, a capture-phase listener on the host stops
  click and middle-click activation before anything else sees it, so `routerLink` no longer
  navigates. Consumer `(click)` handlers on the link no longer run while it is disabled.
- Button: `disabled` replaces `zdDisabled` on every host. On buttons and inputs it is written back
  as the native `disabled` attribute, so `<button zdButton disabled>` and `[disabled]` behave
  natively; on links it sets `aria-disabled`, adds `btn-disabled` and stops native and Router
  navigation, as Link does. `[zdDisabled]` on a button no longer throws, because the input is gone.
- Button's selector is now `a[zdButton]` instead of `a[href][zdButton]`, so
  `<a zdButton routerLink="…">` gets the directive without a static `href`.

Migrate by renaming `zdDisabled` to `disabled`. An unmigrated `[zdDisabled]` binding fails to
compile; an unmigrated static `zdDisabled` attribute compiles but does nothing.
