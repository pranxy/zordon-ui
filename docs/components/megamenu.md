# Megamenu

> **Maturity:** Preview — automated verification complete; manual accessibility pending
>
> **Entry point:** `@pranxy/zordon-ui/megamenu` · **Matrix row:** NAV-04
>
> **Target:** Angular 21.2.19, Aria/CDK 21.2.14, daisyUI 5.7.16

Megamenu composes the packaged Dropdown runtime with a responsive multi-column surface and an
optional Angular Aria command bar. Site navigation keeps native links, headings and form controls.
CDK owns anchored positioning, viewport push, flipping and scroll repositioning; the shared overlay
coordinator owns dismissal, stacking, theme forwarding and disposal.

The entry intentionally re-exports `ZdDropdown`, `ZdDropdownTrigger`, `ZdDropdownPanel`,
`ZdDropdownMenu`, `ZdDropdownItem` and their side/alignment/close-reason types. These are the same
declarations as the Dropdown entry, so consumers may import the complete composition from either
documented entry without a second implementation. They are included explicitly in the API report.

## Setup and native navigation

Include `@angular/cdk/overlay-prebuilt.css` in application styles and configure the library normally.
Import the root and panel from Megamenu and the established trigger/template primitives from Dropdown:

```ts
import { ZdMegamenu, ZdMegamenuPanel } from '@pranxy/zordon-ui/megamenu';
import { ZdDropdownTrigger, ZdDropdownPanel } from '@pranxy/zordon-ui/dropdown';
import { RouterLink, RouterLinkActive } from '@angular/router';
```

Add the declarations to the consuming component's imports:

```html
<nav aria-label="Primary navigation">
  <a routerLink="/">Home</a>
  <div zdMegamenu #products="zdMegamenu">
    <button zdDropdownTrigger>Products</button>
    <ng-template zdDropdownPanel>
      <zd-megamenu-panel [columns]="2" role="region" aria-label="Products">
        <section>
          <h2>Build</h2>
          <a routerLink="/components" routerLinkActive="current" ariaCurrentWhenActive="page">
            Components
          </a>
        </section>
        <section>
          <h2>Learn</h2>
          <a href="/guides" (click)="products.close('selection')">Guides</a>
        </section>
      </zd-megamenu-panel>
    </ng-template>
  </div>
</nav>
```

Each root owns one native button trigger and one lazy panel template. Project arbitrary sections,
headings, images, links and forms into the panel; the application supplies their layout, labels,
contrast and focus styles. Content stays in its declaration context. No menu roles or focus trap
are added to native navigation. Use separate ordinary links outside the lazy disclosure for critical
navigation that must remain available without JavaScript.

## Root API

`[zdMegamenu]` exports `zdMegamenu`. It composes `ZdDropdown` through host directives.

| API                                                                                   | Default / behavior                                                                     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `closeOnNavigation`                                                                   | `true`; close on successful `NavigationEnd`, with reason `navigation`                  |
| `expanded`                                                                            | Read-only rendered state; false on the server                                          |
| `show()`                                                                              | Request opening, respecting disabled/controlled state                                  |
| `close(reason?)`                                                                      | Request closing; default `programmatic`; accepts `ZdDropdownCloseReason`               |
| `open`, `openChange`                                                                  | Omitted: internal state. Bound boolean: emit requests and wait for acceptance          |
| `disabled`                                                                            | `false`; disable trigger and remove rendered panel                                     |
| `mode`                                                                                | `content`; use `menu` only with command-menu content                                   |
| `trigger`                                                                             | `click`; `hover` and `focus` add opening policies; `manual` requires state or `show()` |
| `hoverDelay`                                                                          | 150ms opening/closing grace period; finite nonnegative normalization                   |
| `side`, `align`, `gap`, `autoFlip`                                                    | `bottom`, `start`, 4px, `true`; same connected placement contract as Dropdown          |
| `initialFocus`                                                                        | `none`; optional `first` for programmatic opening                                      |
| `closeOnSelection`, `closeOnEscape`, `closeOnOutside`, `closeOnFocus`, `restoreFocus` | All `true`; inherited Dropdown policies                                                |
| `panelClass`                                                                          | Empty; class string applied to the overlay pane                                        |
| `closed`, `selected`                                                                  | Inherited close reason and command-selection outputs                                   |

See [Dropdown](dropdown.md) for the complete inherited close/focus policy. The root subscribes to
Router only when a Router is available and unsubscribes on destruction. NavigationStart, canceled
and failed navigation do not trigger navigation closure. RouterLinkActive remains application-owned,
including exact/subset matching and current-page semantics. Href activation is native; explicitly
close in-place hash destinations if desired. Modified link activation remains native.

Controlled roots must accept `openChange` to apply a close request. Multiple roots are independent;
applications can bind shared state when they require exactly one open root. No automatic exclusive
group policy is introduced.

## Panel layout

`zd-megamenu-panel` accepts `columns: 1 | 2 | 3 | 4` (default 3) and
`width: 'anchored' | 'full'` (default anchored). Anchored width is at most 48rem and viewport minus
32px. Full width is viewport minus 32px, aligned/pushed by the connected overlay strategy; it is
not the width of an arbitrary ancestor. Both modes become one column below 48rem. This stacked,
scrollable popup is the mobile fallback; it does not require a second copy of the content or a drawer.

Panels have a viewport-bounded maximum block size, scrolling, surface tokens, reduced-motion rules
and forced-color borders. Applications own oversized projected media and unbreakable content.
CSS changes layout without client-side viewport state. There is no native Popover API or CSS anchor
dependency. daisyUI surface tokens are reused; its native popover selectors are not activated on CDK
panels. The command bar emits the configured-prefix `megamenu` class.

## Application command bar

Use `ZdMegamenuBar` only for application commands. It composes Angular Aria MenuBar, exposing
`wrap` (true), `typeaheadDelay` (500ms), `disabled` (false) and `itemSelected`. Supply an accessible
name. Combine it with `ZdDropdownItem` top-level items and `mode="menu"` roots:

```html
<zd-megamenu-bar aria-label="Editor commands">
  <div zdMegamenu mode="menu" (selected)="performAction($event)">
    <button zdDropdownTrigger zdDropdownItem value="file">File</button>
    <ng-template zdDropdownPanel>
      <zd-dropdown-menu aria-label="File actions">
        <button zdDropdownItem value="new">New document</button>
        <button zdDropdownItem value="export">Export</button>
      </zd-dropdown-menu>
    </ng-template>
  </div>
</zd-megamenu-bar>
```

Also import `ZdDropdownMenu`, `ZdDropdownItem` and `ZdMegamenuBar`. Menu selections are `unknown`;
narrow them before dispatching actions. The bar's `itemSelected` reports direct bar-item selections;
root `selected` reports panel actions. Do not put arbitrary form controls inside a command menu.

Aria owns roving top-level focus, horizontal RTL arrows, Home/End and typeahead. Dropdown owns
ArrowDown/ArrowUp opening, first/last focus, panel Tab exit and Escape restoration; Aria Menu owns
vertical item navigation and activation. Escape returns to the bar before choosing another root.
This composition does not link sibling popups through Aria's `submenu` input, so automatic switching
between open sibling menus with horizontal arrows is not provided.

## SSR, verification and migration

Server rendering produces stable closed triggers and ordinary surrounding navigation. Lazy panels
are created after hydration, including when controlled `open` is initially true. No-JavaScript
disclosure is not provided; use ordinary surrounding links or a separate native fallback when needed.
Do not claim delayed event replay or incremental hydration compatibility without application tests.

See [accessibility review](megamenu-accessibility-review.md), [visual matrix](megamenu-visual-matrix.md)
and [delivery evidence](../plans/phase-6-megamenu-progress.md). This new secondary entry has no legacy
compatibility adapter. Existing Dropdown compositions can replace the root with `zdMegamenu` and add
the responsive surface while retaining trigger/template declarations.

Design references: [daisyUI component catalog](https://daisyui.com/components/) and
[Angular Aria Menu guide](https://angular.dev/guide/aria/menu). Installed Angular 21 declarations and
browser tests determine the supported API; current upstream documentation may describe newer versions.
