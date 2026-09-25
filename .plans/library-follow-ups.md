# Library follow-ups

Bugs and inconsistencies found in the component library while building the documentation site.
They are deferred until the remaining reference pages are done. Each entry says where it shows up
and what a fix needs.

Status: `Open` | `Decision needed` | `Fixed`

| ID  | Component        | Issue                                                                                                                                                                                                                                                                                                                                                    | Status          |
| --- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| L01 | Link             | `zdDisabled` only calls `preventDefault()` in a bubbling click listener. That stops a native `href`, but Angular's `RouterLink` ignores `defaultPrevented`, so `<a zdLink routerLink="…" zdDisabled>` still navigates. `docs/components/link.md` says the guard blocks navigation. Found on the Link reference page; its example uses an `href` for now. | Decision needed |
| L02 | OTP              | The cells hard-code the `input` class instead of using `ZdClassNames`, so they ignore a configured daisyUI prefix.                                                                                                                                                                                                                                       | Open            |
| L03 | Calendar         | The popup `dialog` loses its centring: Tailwind's preflight removes the dialog's auto margin and `calendar.css` does not restore it. The Calendar page adds `margin: auto` itself.                                                                                                                                                                       | Open            |
| L04 | Menu             | `docs/components/menu.md` says the generic `menu` rule is unnecessary, but it sets item spacing: without it the Menu fixture's baseline changes.                                                                                                                                                                                                         | Open            |
| L05 | Theme Controller | The spec stubs `window.matchMedia` without restoring it, which leaked into the Drawer spec and dropped its coverage below 100% (worked around with an explicit Drawer test).                                                                                                                                                                             | Open            |
| L06 | API Extractor    | The configs don't set `newlineKind`, so reports regenerate with CRLF on Windows and churn the whole file.                                                                                                                                                                                                                                                | Open            |
| L07 | Button, Badge    | Unpublished legacy files `button/button.component.ts` and `badge/badge.component.ts` sit beside the real entry points (`*/src/`). The checks skip them; they can probably be deleted.                                                                                                                                                                    | Open            |
| L08 | Alert            | daisyUI's soft, outline and dash alerts colour their text with the status colour, which is 1.6–1.9:1 on the light theme. The Alert page overrides it; the library could default to base-content text for those variants.                                                                                                                                 | Open            |

## L01 options

- Stop the event in a capture-phase listener on the host (`stopImmediatePropagation()` as well as
  `preventDefault()`), so RouterLink never sees it. This breaks the documented promise that
  consumer click listeners still run.
- Keep the current behaviour and document that `zdDisabled` does not stop RouterLink; consumers
  bind `[routerLink]="disabled ? null : target"` themselves.
