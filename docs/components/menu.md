# Menu

> **Maturity:** Preview — automated verification complete; manual accessibility pending
>
> **Entry point:** `@pranxy/zordon-ui/menu` · **Matrix row:** NAV-05
>
> **Target:** Angular 21.2.19, Aria/CDK 21.2.14, daisyUI 5.7.16

Menu provides two distinct semantics: `ZdMenu` renders native navigation lists with inline groups;
`ZdMenuTree` wraps Angular Aria Tree for a selectable hierarchy. Command menus compose the existing
[Dropdown](dropdown.md) Aria Menu primitives. Visual similarity does not change navigation links
into application menu items.

## Native navigation

```ts
import { ZdMenu, type ZdMenuItem } from '@pranxy/zordon-ui/menu';

readonly destinations: readonly ZdMenuItem[] = [
  { id: 'heading', kind: 'title', label: 'Workspace' },
  { id: 'home', label: 'Home', routerLink: ['/'] },
  { id: 'inbox', label: 'Inbox', routerLink: ['/inbox'], badge: 3, badgeLabel: '3 unread messages' },
  { id: 'separator', kind: 'separator', label: 'Resources boundary' },
  {
    id: 'resources', label: 'Resources', children: [
      { id: 'guide', label: 'Guide', href: '/guide' },
      { id: 'api', label: 'API', routerLink: ['/api'] },
    ],
  },
  { id: 'settings', label: 'Settings unavailable', disabled: true },
];
```

Add `ZdMenu` to the consuming component's imports:

```html
<zd-menu [items]="destinations" label="Workspace navigation" [(expandedIds)]="expanded" />
```

Declare `expanded = signal<readonly string[]>(['resources'])` for that example. Each group uses a
native button with expanded/controls relationships and an inline nested list. Tab visits native
links and group buttons; Enter/Space toggles a group. Collapsed content is hidden and not tabbable.
No roving focus or custom arrow-key model is added to native navigation.

| `ZdMenu` input/model                | Default      | Contract                                                                      |
| ----------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `items`                             | `[]`         | Readonly recursive `ZdMenuItem[]`                                             |
| `label`                             | `Navigation` | Localized navigation landmark name                                            |
| `size`                              | `md`         | `xs`, `sm`, `md`, `lg`, `xl`                                                  |
| `orientation`                       | `vertical`   | `vertical` or wrapping `horizontal`; child groups remain inline below parents |
| `expandedIds` / `expandedIdsChange` | `[]`         | Two-way model of expanded group IDs                                           |
| `activeId`                          | `undefined`  | Follow RouterLinkActive; `null` clears markers; string selects a manual ID    |
| `routeExact`                        | `true`       | Boolean-transformed exact Router matching                                     |

IDs must be nonempty and unique across the entire hierarchy. Labels must be nonempty, including
title/separator records. Separator labels are data labels, not rendered announcements. Each enabled
leaf requires exactly one `href` or `routerLink`. Nonempty groups cannot also have a destination;
provide a separate child link if the section itself is navigable. Empty child arrays behave as
leaves. Invalid identities/destinations throw `RangeError`.

`kind` defaults to `item`; `title` renders a list title and `separator` a horizontal rule inside a
list item. Supply only display metadata for titles/separators: children and destination fields do
not render for those kinds. Native group buttons are disabled through `disabled`; a disabled group
does not recursively disable links in an explicitly expanded group. Disabled leaves render named,
nonfocusable link placeholders with `aria-disabled` and no href/RouterLink.

`routerLink` accepts a string, command array or `UrlTree`; optional `queryParams` and `fragment`
follow Angular Router rules. Do not combine an already constructed UrlTree with parameters it owns.
Href-only menus work without Router providers. Href current-page state is manual. Subset matching
may activate multiple route ancestors, so applications own a coherent current-page policy. Group
expansion does not automatically follow Router navigation. Modified anchor activation stays native.

## Selectable hierarchy

```ts
import { ZdMenuTree, type ZdMenuNode } from '@pranxy/zordon-ui/menu';

readonly files: readonly ZdMenuNode[] = [
  { id: 'projects', label: 'Projects', children: [
    { id: 'alpha', label: 'Alpha' },
    { id: 'locked', label: 'Locked file', disabled: true },
  ] },
  { id: 'archive', label: 'Archive' },
];
```

```html
<zd-menu-tree
  [items]="files"
  label="Project files"
  [(selectedIds)]="selected"
  [(expandedIds)]="expanded"
/>
```

Declare `selected = signal<string[]>([])` and `expanded = signal<readonly string[]>([])` and add
`ZdMenuTree` to imports. Tree nodes contain IDs, labels, optional children and decorations; they do
not carry links. Use the native Menu for page navigation. Branches and leaves can be selected.

| `ZdMenuTree` input/model            | Default          | Contract                                                               |
| ----------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| `items`                             | `[]`             | Readonly recursive `ZdMenuNode[]`; globally unique IDs/nonempty labels |
| `label`                             | `Items`          | Tree accessible name                                                   |
| `size`, `orientation`               | `md`, `vertical` | Same five sizes; orientation also changes Aria keyboard axes           |
| `selectedIds` / `selectedIdsChange` | `[]`             | Two-way `string[]` selection model                                     |
| `expandedIds` / `expandedIdsChange` | `[]`             | Two-way readonly expansion-ID model                                    |
| `multi`                             | `false`          | Boolean-transformed multiple-selection policy                          |
| `disabled`                          | `false`          | Boolean-transformed whole-tree disabled state                          |
| `wrap`                              | `true`           | Boolean-transformed arrow navigation wrapping                          |
| `typeaheadDelay`                    | 500              | Aria typeahead buffer timeout in milliseconds                          |

Angular Aria owns roving focus, selection, typeahead, disabled-item skipping, hierarchy relationships
and deferred child groups. In vertical LTR trees, Up/Down moves focus and Right/Left expands/collapses;
RTL mirrors expansion keys. Horizontal trees use logical Left/Right for movement and Down/Up for
expansion/collapse. Home/End moves to boundaries. Space/Enter selects; multiple mode supports Aria's
range/toggle gestures. The explicit branch button also supports mouse/touch expansion, returns focus
to its tree item, and stays outside the roving Tab sequence. It does not select the branch as a side
effect of opening it. Whole-tree/branch disabled state disables its expander.

Both expansion and selection use Angular model semantics: interaction updates local state immediately
and emits the corresponding change. Consumers can two-way bind or supply subsequent state updates;
these are not request-only controlled overlays. IDs absent from the current data are not pruned from
consumer state. Keep selection consistent with the data and single/multiple policy. Applications own
focus recovery when replacing/removing nodes or programmatically collapsing a focused descendant.

## Icons, badges, shortcuts and styling

`ZdMenuNode` and `ZdMenuItem` accept an `icon: TemplateRef<ZdMenuIconContext>` whose `$implicit`
value is the node, `badge: string | number` (including zero), `badgeLabel`, and `shortcut: string`.
Icons, badge artwork and shortcut hints are decorative. Use nonfocusable icons and `badgeLabel` to
include meaningful badge information in the accessible name. Shortcut hints do not register keyboard
shortcuts or announce nonexistent bindings. Badge updates are not live announcements.

Classes honor the configured daisyUI prefix. The packaged component CSS owns structural list layout,
wrapping, disclosure, focus/current/selection states and motion/forced-color fallbacks. Include the
daisyUI size modifiers and title/active styles for the theme's visual sizing. The fixture compiles
`menu-xs menu-sm menu-md menu-lg menu-xl menu-title menu-active`; compiling the large generic
`menu` and orientation rules is unnecessary for the component-owned layout. It uses unencapsulated
daisyUI modifier CSS and explicitly scoped fixture styles, keeping the existing CSS budgets intact.

Custom themes/icons and long shortcut/badge strings need contrast/reflow review. Tested row heights
meet the compact 24px target minimum; the branch expander is 24px, not a universal 44px touch target.

## Command menus

Use `ZdDropdown`, `ZdDropdownTrigger`, `ZdDropdownPanel`, `ZdDropdownMenu` and `ZdDropdownItem`
from `@pranxy/zordon-ui/dropdown` for commands and nested command submenus. This composes Angular
Aria Menu with the existing shared overlay stack. Use `ZdMegamenuBar` for a persistent horizontal
command bar. See [Dropdown](dropdown.md) and [Megamenu](megamenu.md) for their complete APIs.
Do not place an interactive native Menu or Tree inside an element with role menu.

## SSR and migration

Native destinations, initial expansion and current Router state render on the server. Initially
expanded native links work without JavaScript; changing disclosure or Tree selection requires
hydration. Child Tree content is deferred by Aria. Preserve the same data/initial state across server
and client. Delayed replay and incremental hydration remain unverified.

This is a new secondary entry point, with no legacy adapter. Replace class-only lists with `ZdMenu`
when a data-driven native hierarchy is appropriate; keep simple existing native lists when no added
behavior is needed. See [accessibility review](menu-accessibility-review.md), [visual matrix](menu-visual-matrix.md)
and [delivery evidence](../plans/phase-6-menu-progress.md).

References: [Angular Aria Tree](https://angular.dev/guide/aria/tree) and
[daisyUI Menu](https://daisyui.com/components/menu/). Installed Angular 21 declarations and executable
tests determine this API; current upstream documentation may describe later releases.
