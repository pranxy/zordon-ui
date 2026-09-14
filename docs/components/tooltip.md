# Tooltip

Status: automated implementation complete; human accessibility review pending.

Import `ZdTooltip` from `@pranxy/zordon-ui/tooltip`. This Angular 21 standalone directive
adds a descriptive tooltip or an explicitly interactive, nonmodal help dialog to an existing
host. Native HTML owns host actions and form controls. Native `title` cannot provide the required
rich content, touch, controlled state and collision behavior. Angular Aria 21 has no standalone
Tooltip primitive; the existing CDK overlay bridge owns positioning and shared dismissal.

```html
<button zdTooltip="Save your draft">Save</button>

<ng-template #help><p>Drafts are visible only to you.</p></ng-template>
<button [zdTooltip]="help">About drafts</button>

<ng-template #settings>
  <label>Draft name <input name="draftName" /></label>
  <button type="button">Apply</button>
</ng-template>
<button [zdTooltip]="settings" interactive tooltipLabel="Draft settings">Draft settings</button>
```

## API

| Input                               | Default        | Contract                                                                           |
| ----------------------------------- | -------------- | ---------------------------------------------------------------------------------- |
| `zdTooltip`                         | Required       | Plain text or `TemplateRef<object>`; blank text suppresses opening                 |
| `open`                              | Unbound        | Bind a boolean for controlled state; otherwise local state owns visibility         |
| `tooltipDisabled`                   | `false`        | Suppresses the overlay; does not change native host disabled state                 |
| `interactive`                       | `false`        | Changes descriptive tooltip to a nonmodal dialog                                   |
| `tooltipLabel`                      | `Help`         | Localized accessible name for the interactive dialog                               |
| `trigger`                           | `auto`         | `auto`, `hover`, `focus`, `manual`                                                 |
| `side`                              | `top`          | `top`, `bottom`, logical `start`, logical `end`                                    |
| `align`                             | `center`       | `start`, `center`, `end`                                                           |
| `color`                             | `neutral`      | `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `error` |
| `gap`                               | `8`            | Nonnegative pixel separation                                                       |
| `arrow` / `autoFlip`                | `true`         | Arrow visibility / alternate-side collision fallback                               |
| `showDelay` / `hideDelay`           | `500` / `100`  | Hover opening and departure grace, in milliseconds                                 |
| `touch`                             | `true`         | Enable touch long press outside manual mode                                        |
| `longPressDelay` / `touchHideDelay` | `500` / `1500` | Touch opening and post-release expiry, in milliseconds                             |
| `panelClass`                        | Empty          | Consumer classes copied to the owned pane when opened                              |

Boolean inputs except controlled `open` accept native boolean attributes. Negative delays clamp to
zero; nonfinite numbers use defaults. `openChange` emits requested visibility. `closed` reports
`escape`, `outside-pointer`, `focus`, `hover`, `touch`, `programmatic` or `navigation` after disposal;
the reason type also includes `destroy`, but destruction does not emit. `id` identifies the surface;
`expanded()` reports attached visibility. Export `#help="zdTooltip"` to call `show()`,
`hide(reason?)` or `focusContent()`.

## Interaction and accessibility

Focus opens immediately in auto/focus mode; pointer hover uses the opening delay. Moving from the
trigger into the surface keeps it reachable. Departure waits for the hide delay and retains an
overlay whose logical scope still contains focus. Escape and outside interaction dismiss only the
top eligible Zordon overlay, including when Tooltip is hosted inside Dropdown.

Descriptive content uses `role="tooltip"` and adds its ID to the host's `aria-describedby` while
open. Existing consumer description IDs survive opening, updates and cleanup. Descriptive templates
must contain no interactive controls. The host still needs its own accessible name; essential help
must remain available inline, including without JavaScript.

Interactive content uses a named `role="dialog"`, without `aria-modal` or a focus trap. The host
receives owned `aria-haspopup`, `aria-expanded` and `aria-controls` attributes while preserving
consumer values on release. F2, native host activation or `focusContent()` enters the first tabbable
control, falling back to the surface. Native Tab moves among controls; Shift+Tab from the first
returns to the trigger, and Tab from the last moves beyond the trigger. Escape restores focus when
it remains inside the dialog. Native button/link activation and Forms semantics remain consumer-owned.

A controlled consumer must accept `openChange` to close. A rejected close continues shielding lower
overlays. Changing `interactive` while open recreates the surface and emits a programmatic close for
the old surface. Manual mode disables automatic opening; explicit methods and controlled state still
work, with Escape/outside dismissal and interactive focus departure.

Touch long press cancels after movement beyond 10 pixels or pointer cancellation. A handled long
press consumes its generated click/context menu; a short tap retains the native host action. This
is covered by synthetic pointer tests; physical touch review remains pending.

Native disabled elements cannot reliably receive focus or pointer events. Use a labelled focusable
wrapper when a disabled action needs an explanation:

```html
<span
  tabindex="0"
  role="group"
  aria-label="Publish unavailable"
  zdTooltip="Complete the required fields first"
>
  <button disabled>Publish</button>
</span>
```

## Placement, styling and lifecycle

CDK resolves logical placement from live Directionality, flips where allowed, shifts within the
viewport and repositions on scroll/resize. A ResizeObserver handles content size changes. The arrow
tracks the applied side and clamps its position to the surface. Long content scrolls inside a
viewport-constrained surface. The component applies daisyUI theme tokens and content/color classes
without daisyUI's competing CSS-only tooltip visibility mechanism. No separate CSS import is needed.
Custom pane classes and the nearest theme scope are snapshots at opening; close/reopen to refresh
them. Global document theme tokens continue to inherit. Forced colors and reduced-motion rules are
included; motion inside consumer templates remains consumer-owned.

The server renders the host and inline consumer descriptions without overlay DOM. Render hooks
activate after hydration (`data-zd-tooltip-ready` changes from `false` to `true`); focus events before
activation are not replayed by the directive's native listeners. Destruction releases observers,
timers, listeners, portals and owned ARIA state. Logical child panes share focus boundaries without
inventing lifetime parent registrations; Angular view destruction owns embedded Tooltip teardown.

See the [visual matrix](tooltip-visual-matrix.md), [manual review](tooltip-accessibility-review.md)
and [milestone evidence](../plans/phase-5-tooltip-progress.md).
