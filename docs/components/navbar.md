# Navbar

`@pranxy/zordon-ui/navbar` provides native navigation layout on Angular 21. It exports
`ZdNavbar`, `ZdNavbarContent`, `ZdNavbarToggle`, `ZdNavbarPosition` and `ZdNavbarVisibility`.
The wrapper is a named `<nav>`. It does not change links into menu items or intercept their keys.

## Usage

```ts
import { signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ZdNavbar, ZdNavbarContent, ZdNavbarToggle } from '@pranxy/zordon-ui/navbar';

// Add these directives/components to the consuming component's imports.
readonly mobileOpen = signal(true);
```

```html
<zd-navbar label="Main navigation" position="sticky">
  <zd-navbar-content zdNavbarStart>
    <a routerLink="/">Acme</a>
    <zd-navbar-content visibility="mobile">
      <button zdNavbarToggle controls="mobile-navigation" [(expanded)]="mobileOpen">Menu</button>
    </zd-navbar-content>
  </zd-navbar-content>
  <zd-navbar-content zdNavbarCenter visibility="desktop">
    <a routerLink="/projects" routerLinkActive="current" ariaCurrentWhenActive="page">Projects</a>
  </zd-navbar-content>
  <a zdNavbarEnd routerLink="/account">Account</a>
</zd-navbar>
<zd-navbar-content visibility="mobile">
  <nav id="mobile-navigation" aria-label="Mobile navigation" [hidden]="!mobileOpen()">
    <a routerLink="/projects">Projects</a>
  </nav>
</zd-navbar-content>
```

This minimal example leaves the mobile links expanded before hydration. Application code can
close the panel after navigation and restore focus when closing while focus is inside it. The
tested fixture demonstrates that policy. Project a `<header>` around the component when a banner
landmark is also appropriate; do not add `role="menubar"` to site navigation.

## API

| Surface                  | Input/output                     | Default              | Contract                                                           |
| ------------------------ | -------------------------------- | -------------------- | ------------------------------------------------------------------ |
| `zd-navbar`              | `label: string`                  | `Primary navigation` | Nonempty localized name for the internal navigation landmark       |
|                          | `position: ZdNavbarPosition`     | `static`             | `static`, `sticky`, `fixed`                                        |
|                          | `transparent: boolean`           | `false`              | Boolean attribute transform; removes the surface background        |
| `zd-navbar-content`      | `visibility: ZdNavbarVisibility` | `always`             | `always`, `desktop` (at least 48rem), `mobile` (below 48rem)       |
| `button[zdNavbarToggle]` | `controls: string`               | Required             | ID of the owner-controlled panel; owner supplies a unique valid ID |
|                          | `expanded: boolean`              | `false`              | Accepted panel state, reflected to `aria-expanded`                 |
|                          | `disabled: boolean`              | `false`              | Native disabled button; boolean attribute transform                |
|                          | `expandedChange: boolean`        | —                    | Requests the opposite state; never updates `expanded` internally   |

No form value, CVA, model, service, route subscription, viewport observer or overlay is added.
Toggle requests may be accepted through two-way binding or rejected by leaving the bound input
unchanged. Native Enter/Space activate the button; native Tab/Shift+Tab visit visible links and
controls. Disabled toggles suppress both native and synthetic click activation.

## Regions and styling

Direct projected children marked `zdNavbarStart`, `zdNavbarCenter`, or `zdNavbarEnd` enter the
corresponding region. These are projection markers, not separate directives. Unmarked content
enters the center region. A `zd-navbar-content` wrapper can occupy a region or group responsive
content inside it. Do not mark one child for multiple regions. Start/end follow inherited direction;
DOM and Tab order stay start, center, end. Regions and content wrap with logical width constraints.

The prefix service supplies daisyUI `navbar`, `navbar-start`, `navbar-center`, `navbar-end` classes.
Packaged CSS owns flex layout, a 4rem minimum bar height, wrapping, safe-area padding, positioning
and visibility. The fixture compiles the actual daisyUI Navbar stylesheet. Supply application link,
button, active and focus styles, or compose the existing styling directives. `--color-base-100`
and `--color-base-content` provide theme colors with system-color fallbacks. Transparency preserves
foreground color; the owner must verify contrast against the underlying surface.

`--zd-navbar-top` (default `0px`) offsets sticky/fixed placement and `--zd-navbar-z-index`
(default `20`) controls stacking. Fixed positioning removes the component from document flow;
the application must reserve sufficient space, including wrapping and safe-area padding, and
account for other fixed headers and scroll targets. There is no automatic height reservation.
Sticky positioning follows the nearest scrolling ancestor and is constrained by that ancestor.
Transformed ancestors can change a fixed element's containing block. Avoid overriding these styles
with incompatible layout utilities.

Responsive content uses CSS `display: none`, removing hidden links from layout, sequential focus
and the accessibility tree without destroying Angular views or losing owner state. Breakpoint
changes do not close external panels or move focus automatically. The application owns focus
recovery when a focused region becomes hidden. There are no animations or motion dependencies.
Forced colors preserve a visible surface boundary; projected controls need their own focus styling.

## Router, commands and Drawer composition

Projected `RouterLink`/`RouterLinkActive` retain href generation, query/fragment policy, modified
clicks and `ariaCurrentWhenActive`. Navbar does not inject Router, choose exact matching, close
menus on navigation or route focus. Configure those policies on the projected content and owner.
Multiple navigation landmarks need distinct meaningful labels.

Dropdown and Megamenu can be projected into a region. Their existing Angular Aria/CDK runtimes
continue to own command semantics, keyboard handling, overlays and focus. Native Navbar itself
needs no Angular Aria primitive. Do not give unrelated account/search controls Toolbar semantics.

The toggle's `controls`/`expanded`/`expandedChange` contract is the integration boundary for an
external drawer. Bind accepted panel state, feed toggle requests to that owner, and let that owner
handle backdrop, Escape, focus trapping/restoration, inertness, scroll lock, route closure and
breakpoint transitions. Add `aria-haspopup="dialog"` only when the actual controlled surface is
a dialog. No checkbox hack, duplicate overlay stack or Drawer implementation ships here. The
planned LYT-02 Drawer milestone will verify the concrete Navbar/Drawer pairing; this milestone
verifies the controlled contract using an inline navigation panel.

## SSR, migration and evidence

The same landmark, links, slots and CSS visibility render on the server and client. Native links
work without JavaScript; toggling requires hydration. If critical links exist only in a mobile
panel, render that panel expanded initially or provide an equivalent usable server-rendered path.
Projection is eager, so CSS-hidden content still initializes and may have application side effects.

Replace raw daisyUI `.navbar` region markup with `zd-navbar` and the projection markers. Preserve
native links and owner Router configuration; replace any checkbox-based mobile toggle with a
native button and explicit controlled panel state. Do not migrate a command menu into ordinary
navigation without retaining its existing Aria implementation.

See [accessibility review](navbar-accessibility-review.md), [visual matrix](navbar-visual-matrix.md),
[ADR 0023](../architecture/0023-navbar-native-layout-and-controlled-panels.md) and
[delivery tracker](../plans/phase-6-navbar-progress.md). Manual accessibility remains pending.
