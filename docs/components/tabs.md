# Tabs

`@pranxy/zordon-ui/tabs` provides an Angular 21 standalone `ZdTabs` component and a
`ZdTabContent` panel-template directive. Angular Aria owns tab roles, relationships, roving
focus, directional keys, Home/End and manual/automatic activation. Zordon owns accepted state,
panel lifecycle, styling, overflow, close/reorder requests and optional query navigation.

## Basic controlled panels

```ts
import { signal } from '@angular/core';
import { ZdTabs, ZdTabContent, type ZdTabItem } from '@pranxy/zordon-ui/tabs';

readonly active = signal<string | null>('overview');
readonly tabs: readonly ZdTabItem[] = [
  { id: 'overview', label: 'Overview', content: 'Project overview' },
  { id: 'activity', label: 'Activity', content: 'Recent activity' },
  { id: 'admin', label: 'Administration', disabled: true },
];
```

```html
<zd-tabs
  label="Project"
  [items]="tabs"
  [activeId]="active()"
  (activeIdChange)="active.set($event)"
/>
```

Use a template when each panel needs structured content. Each embedded view receives a
`ZdTabContentContext`: `$implicit` is its `ZdTabItem`; `active` is the accepted selection.

```html
<zd-tabs
  label="Project editors"
  [items]="tabs"
  [activeId]="active()"
  (activeIdChange)="active.set($event)"
  preserveContent
>
  <ng-template zdTabContent let-item let-active="active">
    <h2>{{ item.label }}</h2>
    <label>{{ item.label }} notes <textarea></textarea></label>
  </ng-template>
</zd-tabs>
```

The application must import both standalone declarations for the template form. The same
template is instantiated separately for every rendered item; use `@switch (item.id)` for
different panel bodies. Labels are visible text. Keep IDs stable, unique and nonempty, and
labels nonempty. Invalid identities throw `RangeError`; labels need not be unique.

## Inputs and outputs

| Member            | Default           | Contract                                                                          |
| ----------------- | ----------------- | --------------------------------------------------------------------------------- |
| `items`           | `[]`              | Readonly `ZdTabItem[]`: `id`, `label`, optional `content`, `disabled`, `closable` |
| `activeId`        | `null`            | Accepted local ID; never mutated by a request                                     |
| `currentId()`     | Derived           | Accepted enabled ID, or first enabled fallback, or `null`                         |
| `activeIdChange`  | Output            | Requested string ID; duplicate current and disabled requests are ignored          |
| `label`           | `Tabs`            | Accessible tablist name; supply a distinct purpose for each group                 |
| `variant`         | `border`          | `box`, `border`, `lift`                                                           |
| `size`            | `md`              | Shared `xs`, `sm`, `md`, `lg`, `xl` vocabulary                                    |
| `orientation`     | `horizontal`      | Shared horizontal/vertical vocabulary; logical RTL layout                         |
| `activation`      | `automatic`       | `automatic` follows focus; `manual` requires Enter/Space or pointer activation    |
| `wrap`            | `true`            | Whether arrow navigation wraps at either end                                      |
| `disabled`        | `false`           | Prevents interaction across the widget; accepted content remains visible          |
| `lazy`            | `true`            | Instantiate selected panel content on demand                                      |
| `preserveContent` | `false`           | Retain previously visited lazy panels while inactive                              |
| `reorderable`     | `false`           | Show named earlier/later buttons for the selected tab                             |
| `queryParam`      | `null`            | Opt in to Router-owned selection under this nonempty query key                    |
| `labels`          | English callbacks | Complete `ZdTabsLabels`: `close(label)`, `earlier(label)`, `later(label)`         |
| `closeRequest`    | Output            | `ZdTabClose { id, nextId }`; no deletion occurs until owner changes `items`       |
| `reorder`         | Output            | `ZdTabReorder { id, fromIndex, toIndex, items }`; immutable proposed order        |

Boolean inputs accept Angular boolean-attribute syntax. Styling emits prefix-aware daisyUI
`tabs`, `tabs-{variant}`, `tabs-{size}` and `tab` classes. Packaged CSS owns geometry, active
indicators, logical borders, overflow and focus so the component also works in SSR without a
fixture-generated daisyUI tab stylesheet. It uses the surrounding theme's base colors/radii.
The selected cue includes a border and weight; custom themes must still be contrast reviewed.

## State, focus and lifecycle

An omitted/null, removed, disabled or unknown active ID falls back to the first enabled item.
An empty/all-disabled collection has no selected panel. Fallback does not emit an event or
rewrite the URL. Disabling the whole widget preserves its selected content. Applications can
reject a request by leaving `activeId` unchanged; keyboard focus may remain on the requested
tab while selection and visible content remain on the accepted tab.

Automatic activation suits immediate local content. Choose manual activation for expensive
loads or approval flows. Horizontal arrows follow CDK Directionality; vertical tabs use
Up/Down. Home/End target the boundaries, skipping disabled tabs. Tab exits the tablist into
the selected panel and subsequent native controls. Provide CDK `Dir` on a changing local
`[dir]` ancestor so both CSS and keyboard direction update together.

Inactive panels stay in the DOM as hidden, inert shells. With lazy content, switching tabs
destroys the old view unless preservation is enabled. Preservation retains editable DOM state
after first visit. Setting preservation to false destroys inactive views; enabling it later
can recreate previously visited views, but cannot restore already-destroyed state. `lazy=false`
instantiates all panels eagerly. Removing an item destroys its view and prunes its visit history.
The application owns data caching, form state beyond a view's lifetime, loading and error UI.

The panel template renders the accepted initial content during SSR. Interactions require
hydration; Aria's deferred-content directive is deliberately not used because its creation
runs after rendering. Zordon supplies deterministic tab/panel IDs through Aria's public inputs;
Aria registration owns the relationships. IDs use the application-scoped `ZdIdGenerator` and
stable item keys. Ordinary hydration requires the same widget allocation order on server and
client. Independently triggered incremental boundaries remain outside this verified contract.
No DOM measurement,
timers, observer or separate keyboard manager is introduced.

## Closing and reordering

For a closable selected tab, a named close button appears outside the tablist; Delete on a
closable focused tab sends the same request. `nextId` proposes the next enabled sibling, then
the nearest enabled previous sibling, then `null`. It is advisory; the owner decides selection.
If closing a nonselected focused tab, retain the existing active ID unless it is being removed.

```ts
readonly items = signal<readonly ZdTabItem[]>(this.tabs);

remove(event: ZdTabClose): void {
  this.items.update(items => items.filter(item => item.id !== event.id));
  if (this.active() === event.id) this.active.set(event.nextId);
}
move(event: ZdTabReorder): void {
  this.items.set(event.items);
}
```

Import `ZdTabClose` and `ZdTabReorder` from the Tabs entry and bind the owner handlers:

```html
<zd-tabs
  label="Workspace"
  [items]="items()"
  [activeId]="active()"
  reorderable
  (activeIdChange)="active.set($event)"
  (closeRequest)="remove($event)"
  (reorder)="move($event)"
/>
```

Earlier/later controls move the accepted tab by one position and work with keyboard, pointer
and touch. At boundaries they are disabled. The component never mutates the input array.
When an accepted order/removal changes the item sequence, focus returns to the moved tab or
the resulting selected tab. If no enabled tab remains, the owner must provide a useful focus
destination such as an Add tab button. Requests may be delayed or rejected by leaving inputs
unchanged. These controls provide accessible reordering; pointer drag-and-drop is not included.

Aria trigger instances are refreshed when their position changes so its registered keyboard
order matches the rendered order. Panel views remain keyed by stable item ID, retaining state.
Generated IDs remain stable for each item within the widget across reorder/removal/readdition;
their spelling remains an implementation detail. Reordering can replace the trigger node.

## Router and overflow

```html
<zd-tabs label="Account preferences" [items]="preferences" queryParam="tab" />
```

This reads `?tab=security` on first render and history changes. Selection requests navigate
with merged query parameters and preserved fragment. Router state is authoritative; `activeId`
is ignored in query mode. Unknown/missing/disabled query values use the first enabled item
without redirecting. `activeIdChange` remains an informational request; ignoring it does not
cancel query-mode navigation. Use controlled mode when selection needs approval. Query mode
requires Router and ActivatedRoute; missing providers or an empty key throw.

These are in-page panel buttons. For navigation between independent route pages, compose native
links with RouterLink and navigation components. Query mode does not create anchor/new-tab
destinations. The application owns URL updates when accepting close/reorder requests.

Horizontal overflow uses a native scroll container; focused tabs scroll into view without
custom scroll buttons. Vertical tabs have a bounded scrolling list. Long horizontal labels
remain readable by scrolling; vertical labels wrap. No page-level horizontal overflow is intended.

## Verification and migration

See [the accessibility review](tabs-accessibility-review.md), [visual matrix](tabs-visual-matrix.md),
[ADR 0026](../architecture/0026-tabs-aria-and-controlled-panels.md) and
[progress evidence](../plans/phase-6-tabs-progress.md). This is the new secondary entry;
legacy radio/CSS tab markup is not upgraded automatically. Move radio state to `activeId`,
provide stable item IDs and replace ad hoc keyboard handlers with the Aria-backed component.
