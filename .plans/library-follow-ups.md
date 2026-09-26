# Library follow-ups

Bugs and inconsistencies found in the component library while building the documentation site.
They are deferred until the remaining reference pages are done. Each entry says where it shows up
and what a fix needs.

Status: `Open` | `Decision needed` | `Fixed`

| ID  | Component        | Issue                                                                                                                                                                                                       | Status |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| L01 | Link             | `zdDisabled` only called `preventDefault()`, which RouterLink ignores. Renamed to `disabled`; a capture-phase listener now stops the click before RouterLink and consumer handlers (Link and Button links). | Fixed  |
| L02 | OTP              | The cells hard-coded the `input` class. They now use `ZdClassNames`, so a configured daisyUI prefix applies (new prefix test).                                                                              | Fixed  |
| L03 | Calendar         | The popup `dialog` lost its centring under Tailwind's preflight. `calendar.css` now restores `margin: auto`; the Calendar page's workaround is gone.                                                        | Fixed  |
| L04 | Menu             | `docs/components/menu.md` said the generic `menu` rule was unnecessary; it now says to include it for daisyUI's item spacing.                                                                               | Fixed  |
| L05 | Theme Controller | The spec's `window.matchMedia` stub leaked into later specs. It now restores the original property after each test.                                                                                         | Fixed  |
| L06 | API Extractor    | Every config now sets `newlineKind: "lf"`, enforced by a tooling test, so reports no longer churn on Windows.                                                                                               | Fixed  |
| L07 | Button, Badge    | The unpublished legacy files beside the real entry points (`button/*.ts`, `badge/*.ts` outside `src/`) are deleted.                                                                                         | Fixed  |
| L08 | Alert            | Soft, outline and dash alerts now use `--color-base-content` text (via `data-zd-alert-variant`) and keep the status colour in the tint and border. The Alert page's override is gone.                       | Fixed  |
| L09 | Divider          | On an `hr`, Divider now sets `border-width: 0`, so only daisyUI's line shows. The Divider page's reset is gone.                                                                                             | Fixed  |
| L10 | Button           | The selector was `a[href][zdButton]`, so RouterLink-only anchors never got the directive. Now `a[zdButton]`; Button's `zdDisabled` is `disabled`, mirrored to the native attribute on buttons.              | Fixed  |
