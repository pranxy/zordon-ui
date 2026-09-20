# Dock

`@pranxy/zordon-ui/dock` provides `ZdDock` and its item, icon-context, size, position,
visibility and label types. It is a native navigation landmark for page destinations.

Maturity: automated implementation verified; manual accessibility review pending.

```ts
import { ZdDock, type ZdDockItem } from '@pranxy/zordon-ui/dock';

readonly destinations: readonly ZdDockItem[] = [
  { id: 'home', label: 'Home', routerLink: ['/'] },
  { id: 'inbox', label: 'Inbox', routerLink: ['/inbox'], badge: 3, badgeLabel: '3 unread messages' },
  { id: 'help', label: 'Help', href: '/help' },
  { id: 'settings', label: 'Settings unavailable', disabled: true },
];
```

Import `ZdDock` in the consuming standalone component, then place it after the main content:

```html
<zd-dock [items]="destinations" label="Workspace destinations" />
```

## API

| Input          | Default              | Contract                                                   |
| -------------- | -------------------- | ---------------------------------------------------------- |
| `items`        | `[]`                 | Readonly `ZdDockItem[]`; unique nonempty IDs and labels    |
| `label`        | `Primary navigation` | Localized landmark name                                    |
| `size`         | `md`                 | `xs`, `sm`, `md`, `lg`, `xl`                               |
| `position`     | `fixed`              | `fixed`, `sticky`, `static`                                |
| `visibility`   | `always`             | `always`, `mobile` below 48rem, `desktop` at/above 48rem   |
| `labels`       | `always`             | `always`, `compact` hides at/below 40rem, `hidden`         |
| `reserveSpace` | `true`               | Boolean-transformed fixed-position placeholder             |
| `routeExact`   | `true`               | Boolean-transformed RouterLinkActive exact matching        |
| `activeId`     | `undefined`          | Follow Router; `null` clears markers; string selects an ID |

An enabled item requires exactly one `href` or `routerLink`; disabled items may omit both.
Invalid identities and destination combinations throw `RangeError`. Router destinations accept
strings, command arrays or `UrlTree`, plus optional `queryParams` and `fragment`. Follow Angular
Router restrictions when supplying an already constructed `UrlTree`. Router providers are needed
for Router items; href-only usage works without them. There are no component outputs.

`icon` accepts `TemplateRef<ZdDockIconContext>` with the item as `$implicit`. Its content is
decorative: provide nonfocusable SVG/artwork. `badge` accepts strings or numbers, including zero.
Use `badgeLabel` to append meaningful badge information to the link's accessible name. Badges
do not create live announcements. Complete item labels remain accessible when visually hidden
or truncated. Items without icons retain visible text in every label mode.

## Navigation and keyboard

Native anchors preserve browser link behavior. RouterLinkActive supplies current-page state;
`activeId` overrides it. Href items require manual active state. Subset route matching can match
several ancestors, so applications must choose destinations/matching that express their intended
current page. Disabled destinations render nonfocusable spans with link semantics and
`aria-disabled`, without href or RouterLink. They never receive the active marker.

Tab traverses links and skips disabled entries. The navigation container is also focusable for
native horizontal keyboard scrolling. Overflow stays in one horizontal row, including RTL.
This component has no roving-focus, action-button, tab-panel or application-menu contract.

## Layout and styling

Base heights are 3/3.5/4/4.5/5rem for xs/sm/md/lg/xl, plus the bottom safe area.
Fixed placement reserves that height in the host by default. Put the host after main content
to leave end-content clearance, or disable reservation when the application supplies its own.
Static placement participates in flow. Sticky placement applies to the host and is bounded by
its containing block; provide a suitable scroll container. Other fixed surfaces, transformed
ancestors, clipping and page geometry remain application responsibilities.

`--zd-dock-safe-bottom` defaults to `env(safe-area-inset-bottom, 0px)` and can be overridden.
Inline padding also respects left/right safe areas. CSS owns responsive visibility; applications
must handle focus if resizing hides the currently focused navigation. No viewport measurement
or JavaScript scroll listener is used. Empty input retains the named landmark; omit the component
when no navigation should be exposed.

Include daisyUI Dock styles and all five size, active and label candidates in the consuming
stylesheet. Classes honor the configured daisyUI prefix. Packaged CSS supplies overflow, layout,
focus, reduced-motion and forced-color active indicators. Custom themes/icons require contrast
review. Compact sizes have verified targets of at least 24px, not a universal 44px guarantee.

## Verification and migration

See [accessibility review](dock-accessibility-review.md), [visual matrix](dock-visual-matrix.md)
and [delivery evidence](../plans/phase-6-dock-progress.md). Native no-JavaScript destinations and
hydrated Router state are covered. Physical safe-area devices still require manual review.
This is a new secondary entry point; no legacy API compatibility adapter is provided.
