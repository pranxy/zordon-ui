# Library follow-ups

Bugs and inconsistencies found in the component library while building the documentation site.
They are deferred until the remaining reference pages are done. Each entry says where it shows up
and what a fix needs.

Status: `Open` | `Decision needed` | `Fixed`

| ID  | Component        | Issue                                                                                                                                                                                                                                           | Status |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| L01 | Link             | `zdDisabled` only called `preventDefault()`, which RouterLink ignores. Renamed to `disabled`; a capture-phase listener now stops the click before RouterLink and consumer handlers (Link and Button links).                                     | Fixed  |
| L02 | OTP              | The cells hard-code the `input` class instead of using `ZdClassNames`, so they ignore a configured daisyUI prefix.                                                                                                                              | Open   |
| L03 | Calendar         | The popup `dialog` loses its centring: Tailwind's preflight removes the dialog's auto margin and `calendar.css` does not restore it. The Calendar page adds `margin: auto` itself.                                                              | Open   |
| L04 | Menu             | `docs/components/menu.md` says the generic `menu` rule is unnecessary, but it sets item spacing: without it the Menu fixture's baseline changes.                                                                                                | Open   |
| L05 | Theme Controller | The spec stubs `window.matchMedia` without restoring it, which leaked into the Drawer spec and dropped its coverage below 100% (worked around with an explicit Drawer test).                                                                    | Open   |
| L06 | API Extractor    | The configs don't set `newlineKind`, so reports regenerate with CRLF on Windows and churn the whole file.                                                                                                                                       | Open   |
| L07 | Button, Badge    | Unpublished legacy files `button/button.component.ts` and `badge/badge.component.ts` sit beside the real entry points (`*/src/`). The checks skip them; they can probably be deleted.                                                           | Open   |
| L08 | Alert            | daisyUI's soft, outline and dash alerts colour their text with the status colour, which is 1.6–1.9:1 on the light theme. The Alert page overrides it; the library could default to base-content text for those variants.                        | Open   |
| L09 | Divider          | On an `hr`, the element's own border shows above daisyUI's pseudo-element line, so the separator is doubled. The Divider page resets `border: 0` on the `hr`; the library could ship that reset or document it in `docs/components/divider.md`. | Open   |
| L10 | Button           | The selector was `a[href][zdButton]`, so RouterLink-only anchors never got the directive. Now `a[zdButton]`; Button's `zdDisabled` is `disabled`, mirrored to the native attribute on buttons.                                                  | Fixed  |
