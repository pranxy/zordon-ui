# Link specification research

## Scope

Define the first public Link directive without publishing implementation code. The target is the
NAV-03 Link row in the master component matrix.

## Installed evidence

- `daisyui@5.7.16`, `components/link/object.js`: `link` provides underline/cursor and a
  `:focus-visible` current-color outline. `link-hover` removes the default underline until a
  hover-capable pointer hovers. The supported color modifiers are `neutral`, `primary`,
  `secondary`, `accent`, `success`, `info`, `warning`, and `error`.
- There is no daisyUI Link disabled, active/current-route, size, icon, target, or loading class.
- daisyUI's current Link documentation was checked on 2026-08-20:
  <https://daisyui.com/components/link/>. It records the same base, hover, and color contract;
  the live docs report 5.7.19, so the installed 5.7.16 source remains the implementation pin.

## Angular evidence

- Angular's Router documentation delegates current-route styling and `aria-current` to
  `RouterLinkActive` / `ariaCurrentWhenActive`:
  <https://angular.dev/guide/routing/read-route-state>.
- The Link directive must neither import nor re-export Router directives. It styles an anchor that
  already carries `href` or Angular Router's `routerLink`; router navigation, URL construction,
  active matching, prefetching, and cancellation remain Router/native behavior.

## Decisions

1. Publish `ZdLink` from `@pranxy/zordon-ui/link` only with its first implementation.
2. Support native anchors with `href` and anchors hosting Angular Router's `routerLink`; never
   emulate a link on a `button`, `div`, or role-only element.
3. Expose `color?: ZdColor` and `hover?: boolean`. `color` and `hover` are the only eventual typed
   defaults candidates. No size/style/layout API exists because daisyUI Link has none.
4. `zdDisabled` is a controlled unavailable-state input. It preserves `href`, `tabindex`, router
   directives, and event propagation; it sets `aria-disabled="true"` and prevents the accepted
   activation's default navigation. It does not promise a daisyUI disabled visual because no such
   upstream token exists.
5. `RouterLinkActive` owns current-route class/`aria-current`. Native `aria-current` is always
   consumer-owned and passes through unchanged.
6. `target`, `rel`, `download`, referrer policy, URL safety, external/new-window indication, and
   native link text/name remain consumer-owned attributes/content. The directive adds no English
   text, icon, or rel policy.
7. No `@angular/aria`, CDK, generated IDs, global listeners, router service, CVA, output, or
   client-only code is justified.
