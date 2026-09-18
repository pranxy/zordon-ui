# FAB / Speed Dial

Status: automated implementation complete; manual accessibility pending.

Import `ZdFab`, `ZdFabActions` and `ZdFabAction` from `@pranxy/zordon-ui/fab`. The standalone Angular
21 component owns a native disclosure button and a named group of native actions. Import `ZdButton`
and optional `ZdTooltip` separately for action styling and descriptive labels.

```html
<zd-fab label="New note" arrangement="single" (mainAction)="createNote()">
  <span zdFabIcon aria-hidden="true">N</span>
</zd-fab>

<zd-fab label="Create" closeLabel="Close create actions">
  <ng-template zdFabActions>
    <button type="button" zdButton zdFabAction (click)="createDraft()">Draft</button>
    <a zdButton zdFabAction href="/uploads">Upload</a>
    <button type="button" zdButton zdFabAction keepOpen (click)="preview()">Preview</button>
  </ng-template>
</zd-fab>
```

## Native ownership and daisyUI

This is a disclosure group, not an ARIA menu or toolbar. Native Tab order, button Enter/Space, links,
disabled controls and action handlers remain browser/consumer-owned. Angular Aria is unnecessary
for this pattern. Button supplies daisyUI styling. The installed daisyUI FAB CSS uses focus-driven
visibility, which cannot honor controlled rejection or native hidden/inert state; FAB therefore owns
its small scoped layout stylesheet instead of combining two visibility systems. No CDK portal,
focus trap, backdrop or scroll lock is created by FAB itself.

The trigger remains visible and becomes the close control when expanded. Its default plus/close
glyph is replaced by projected `[zdFabIcon]` content. Keep projected icons decorative and noninteractive.
Use an action in `zdFabActions` for an open-state primary action; the trigger continues to provide a
reliable close target. In single mode, or without an action template, the trigger emits `mainAction`
and has no disclosure ARIA attributes.

## API

| Input         | Default         | Meaning                                                                  |
| ------------- | --------------- | ------------------------------------------------------------------------ |
| `label`       | Required        | Native trigger name when closed and action-group name; localize it       |
| `closeLabel`  | `Close actions` | Native trigger name when open; localize it                               |
| `arrangement` | `vertical`      | `single`, `vertical`, `flower`                                           |
| `corner`      | `bottom-end`    | `bottom-start`, `bottom-end`, `top-start`, `top-end`                     |
| `offset`      | `1rem`          | CSS length added to the corresponding physical safe-area inset           |
| `inline`      | `false`         | Relative placement in consumer layout instead of a fixed viewport corner |
| `disabled`    | `false`         | Native trigger disabled and disclosure suppressed                        |
| `open`        | Unbound         | Bound boolean controls state; otherwise FAB owns local state             |

`openChange` emits requested state. `mainAction` emits native single-action activation.
`expanded()` is read-only effective state. `panelId` connects trigger `aria-controls` to the group.
Export `#fab="zdFab"` to call `show()`, `hide()` or `toggle()`.
`ZdFabAction.keepOpen` defaults to false and accepts a boolean attribute.

```html
<zd-fab label="Share" arrangement="flower" [open]="sharing()" (openChange)="sharing.set($event)">
  <ng-template zdFabActions>
    <button
      type="button"
      zdButton
      layout="circle"
      zdFabAction
      aria-label="Email"
      zdTooltip="Email"
      (click)="email()"
    >
      E
    </button>
    <button
      type="button"
      zdButton
      layout="circle"
      zdFabAction
      aria-label="Copy link"
      zdTooltip="Copy link"
      (click)="copy()"
    >
      C
    </button>
  </ng-template>
</zd-fab>
```

## State, keyboard and composition

Opening keeps focus on the trigger; Tab enters actions in DOM order and skips native disabled
controls. Escape closes the disclosure and restores trigger focus when focus was in its actions.
Tooltip consumes Escape first while its descriptive surface is open. Outside pointer interaction
and focus departure request closing. Tab departure preserves the user's next focus target.

An uncancelled activation bubbling from a marked `zdFabAction` requests closing, unless `keepOpen`,
native `disabled` or `aria-disabled="true"` is present. `event.preventDefault()` prevents this close
request. Unmarked controls keep their native behavior and do not request closing. Consumers must
implement the actual disabled behavior of soft-disabled links/actions; FAB's check only determines
whether to request closing. Native link destinations must account for the application's base URL.

Controlled consumers can reject a request by leaving `open` unchanged. Accepted action/Escape closes
restore focus after rendering, and an external close restores it if it remains in the hidden group.
Native disabled triggers cannot receive restoration focus. Changing to single mode or disabling
suppresses expansion without rewriting the consumer's controlled value. Local state is retained
across temporary mode/disabled changes.

The action template is created eagerly and retained under native `hidden` and `inert` when closed,
preserving Forms state and stable IDs. Do not place interactive Tooltip dialogs or independent
focusable portals inside this disclosure: their external focus boundary needs a separate composition
policy. Descriptive Tooltip labels are supported and verified. Destruction cleans up the document
pointer listener and Angular destroys embedded action directives, including their Tooltip portals.

## Layout, themes and customization

Logical corners mirror with inherited HTML direction. Each physical safe-area inset is added to the
offset. Top corners expand downward; bottom corners expand upward. Vertical lists scroll within
`min(70dvh, 32rem)`. Flower uses a quarter circle for one to four direct action elements; five or more
fall back to vertical. Viewports narrower than 24rem or shorter than 30rem also use vertical layout.
Use compact circular icon actions with accessible names and descriptive Tooltips in flower mode;
long text buttons belong in vertical mode. Wrappers count as action positions and must contain only
one action. For larger actions increase the radius and review spacing at all corners.

Style hooks are `zd-fab`, `.zd-fab-trigger`, `.zd-fab-actions` and `[data-zd-fab-action]`.
`--zd-fab-gap` defaults to `0.75rem`, `--zd-fab-radius` to `9rem`; override them on the instance.
`offset` owns `--zd-fab-offset`. Fixed z-index is 30; consumer stacking contexts, headers, browser
keyboards and page content overlap need application layout review. This component does not implement
viewport collision detection for arbitrary content or custom offsets.

Button theme tokens inherit light/dark scopes. Ensure Tailwind scans the Button candidates used by
your templates, including `btn-circle`. FAB's own CSS is included in the component; no separate
stylesheet import is required. Reduced-motion mode disables trigger transitions, and forced colors
retain visible control borders/focus. Consumer animations remain consumer-owned.

## SSR, migration and review

Server output contains meaningful native controls and a hidden/inert closed action group, without
overlay DOM or document listeners. A consumer-bound open state is rendered as supplied. Hydration
attaches Angular events and render-time outside listeners. Before JavaScript, a disclosure cannot be
opened; essential actions need an ordinary visible navigation/action alternative. Generated group
IDs remain stable across hydration.

For migration from daisyUI's focus-only FAB markup, replace the focusable div trigger with `zd-fab`,
place actions in `ng-template zdFabActions`, and remove `fab`, `fab-close` and `fab-main-action`
visibility classes. Existing native action handlers and Button variants remain usable.

See the [visual matrix](fab-visual-matrix.md), [manual review](fab-accessibility-review.md) and
[milestone evidence](../plans/phase-5-fab-progress.md).

Reference: [daisyUI FAB / Speed Dial](https://daisyui.com/components/fab/).
