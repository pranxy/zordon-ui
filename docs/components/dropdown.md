# Dropdown

> **Maturity:** Preview — automated verification complete; manual accessibility pending

> **Entry point:** `@pranxy/zordon-ui/dropdown` · **Matrix row:** ACT-02

> **Target:** Angular 21.2.19, Aria/CDK 21.2.14, daisyUI 5.7.16

Dropdown opens an anchored panel from a native button. Menu panels compose Angular Aria Menu and
MenuItem; arbitrary content retains native form controls, labels and tab order. CDK owns connected
positioning, collision handling and scroll repositioning. The shared Zordon runtime owns the overlay
stack, event arbitration and disposal. No Angular upgrade is required.

## Setup and composition

Install the library's matching Angular Aria/CDK peers and include CDK's structural overlay CSS in the
application stylesheet:

```css
@import '@angular/cdk/overlay-prebuilt.css';
```

```ts
import {
  ZdDropdown,
  ZdDropdownTrigger,
  ZdDropdownPanel,
  ZdDropdownMenu,
  ZdDropdownItem,
} from '@pranxy/zordon-ui/dropdown';
```

Add these standalone declarations to the consuming component's imports. A root owns one trigger and
one panel template. Content stays in its Angular declaration context and is created only while open.

```html
<div zdDropdown mode="menu" (selected)="performAction($event)">
  <button zdDropdownTrigger>Actions</button>
  <ng-template zdDropdownPanel>
    <zd-dropdown-menu aria-label="Document actions">
      <button type="button" zdDropdownItem value="edit">Edit</button>
      <button type="button" zdDropdownItem value="delete" [disabled]="cannotDelete()">
        Delete
      </button>
      <div zdDropdown mode="menu" side="end">
        <button zdDropdownTrigger zdDropdownItem value="export">Export</button>
        <ng-template zdDropdownPanel>
          <zd-dropdown-menu aria-label="Export options">
            <button type="button" zdDropdownItem value="pdf">PDF</button>
            <button type="button" zdDropdownItem value="csv">CSV</button>
          </zd-dropdown-menu>
        </ng-template>
      </div>
    </zd-dropdown-menu>
  </ng-template>
</div>
```

Give every menu an accessible name with native `aria-label` or `aria-labelledby`. Repeated/nested
roots retain independent ownership; the nearest enclosing root supplies the parent overlay. Do not
place arbitrary input fields inside a menu. For form content use the default content mode:

```html
<div zdDropdown #preferences="zdDropdown" [(open)]="preferencesOpen" initialFocus="first">
  <button zdDropdownTrigger>Preferences</button>
  <ng-template zdDropdownPanel>
    <form
      aria-label="Preferences"
      (submit)="$event.preventDefault(); save(); preferences.close('selection')"
    >
      <label>Display name <input name="displayName" /></label>
      <button type="submit">Save</button>
    </form>
  </ng-template>
</div>
```

Arbitrary panels own their surface styling and semantic roles. The root supplies no dialog role or
focus trap. Consumers keep native click/submit events; action-menu selection is emitted by `selected`.
Menu-item values may be any consumer value, so the output is `unknown` and applications should narrow it.

## Public API

| Declaration                                   | Contract                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `[zdDropdown]`, exported as `zdDropdown`      | Root state, placement, close policy and parent ownership                                         |
| `button[zdDropdownTrigger]`                   | Native type=button trigger; expanded/controls/popup attributes; keyboard and pointer access      |
| `ng-template[zdDropdownPanel]`                | Exactly one lazy template for its nearest root; duplicate panels throw                           |
| `zd-dropdown-menu`                            | Aria menu with projected native items; optional `id`, `wrap` and `typeaheadDelay` inputs         |
| `button[zdDropdownItem]`, `a[zdDropdownItem]` | Required `value`, boolean `disabled`, optional `searchTerm`; Aria item navigation and activation |

| Root input/output                                                     | Default and behavior                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `open` / `openChange`                                                 | Omitted: internal state. Bound boolean: emit requests and wait for consumer acceptance                       |
| `expanded`                                                            | Read-only signal reflecting a rendered panel; false on the server                                            |
| `disabled`                                                            | false; disables the trigger and prevents/removes the panel                                                   |
| `mode`                                                                | `content`; use `menu` with Aria menu content                                                                 |
| `trigger`                                                             | `click`; `hover` and `focus` add opening behavior; `manual` requires consumer state or `show()`              |
| `side`, `align`                                                       | `bottom`, `start`; sides top/bottom/start/end and alignments start/center/end                                |
| `gap`, `autoFlip`                                                     | 4px, true; finite nonnegative gap, opposite-side fallback and CDK viewport push                              |
| `hoverDelay`                                                          | 150ms for opening/closing; negative values clamp to zero, nonfinite values use 150ms                         |
| `initialFocus`                                                        | `none`; `first` moves focus for programmatic opening; keyboard/click opening has its own policy              |
| `closeOnSelection`, `closeOnEscape`, `closeOnOutside`, `closeOnFocus` | true; independent policies. A rejected close still shields lower overlays                                    |
| `restoreFocus`                                                        | true; Escape, selection and programmatic close restore only while focus still belongs to the closing surface |
| `panelClass`                                                          | Empty; space-separated consumer classes applied to the owned CDK pane                                        |
| `selected`                                                            | Selected value; accepted selection closes the current tree and reaches ancestor root outputs                 |
| `closed`                                                              | Actual disposal reason; not emitted for a rejected close request or destruction                              |
| `show()`, `close(reason?)`                                            | Programmatic requests; close defaults to `programmatic`; navigation integrations call `close('navigation')`  |

Close reasons are trigger, selection, backdrop, outside-pointer, escape, programmatic, navigation,
destroy, focus and hover. Dropdown itself does not add a backdrop. Explicit consumer `close()` calls
are authoritative requests and are not filtered through keyboard/outside policy switches.

A bound `open` is controlled: ignoring `openChange` leaves the existing state intact. Do not bind an
unchanging false value and expect internal opening. Disabled roots cannot retain an interactive panel;
a bound true value can reopen when the root becomes enabled again. Removed triggers/panels clean up
their owned overlay. Overlay content is recreated on the next opening; persistent form data belongs
in the consumer model, not in a destroyed embedded view.

## Keyboard, focus and nested behavior

- Enter/Space click a native root trigger; ArrowDown opens the first menu item and ArrowUp the last.
- Aria owns arrow navigation, Home/End, wrapping, typeahead and disabled-item discovery within a menu.
  Typeahead uses rendered text by default and updates with text changes; supply `searchTerm` for icon-rich
  or abbreviated content. Disabled actions cannot fire native clicks or library selection.
- Nested triggers open with the logical forward arrow, Enter, Space or click. The logical backward
  arrow closes their panel. Plain Escape closes only the top surface and restores its owning trigger.
  Ctrl/Alt/Meta/composition keyboard events are not repurposed as submenu navigation.
- Menu Tab/Shift+Tab closes the root tree and resumes tab order beside the root trigger. Arbitrary
  content retains normal tabbing internally; its boundary continues beside the root trigger.
- Hover opening does not steal focus. Grace periods let the pointer cross between trigger and panel;
  focus retained inside the surface prevents hover departure from closing it.
- Outside/focus departure and navigation close preserve the new focus destination. Restoration skips
  disabled/disconnected triggers and does not override focus moved by a consumer action.

Each lazy submenu is an independent Aria Menu. Zordon's small adapter supplies disclosure opening,
initial focus, portal ownership, logical submenu boundaries and root selection close. No Aria private
pattern or input mutation is used. Unlike the initial probe, production code does not create hidden,
inactive submenu panes. See [ADR 0009](../architecture/0009-shared-overlay-runtime.md).

## Styling, direction and SSR

The menu emits prefix-aware daisyUI `menu`, `btn` and `btn-ghost` candidates through `ZdClassNames`.
It does not emit daisyUI dropdown hover/visibility/position classes that would compete with CDK.
The menu surface uses daisyUI background, text, border, radius and primary focus tokens. Scoped menu
CSS suppresses inherited button motion under reduced motion and retains forced-colors focus outlines.
Consumer classes and styles remain available on native triggers, menu elements and items. `panelClass`
provides a global CSS hook for pane width or other portal-level styling; consumer emulated styles
should target projected content directly rather than assuming the pane is a DOM descendant.

CDK uses an 8px viewport margin, opposite-side fallback when enabled, push, and reposition-on-scroll.
Placement and nearest CDK `Dir` changes update the existing pane. The nearest `data-theme` is captured
when opening and applied only to that pane; it is not continuously observed. Horizontal writing mode
with explicit LTR/RTL is supported; vertical writing modes are unverified.

Server HTML contains closed native triggers and no overlay DOM. Render hooks attach listeners and
panels only in the browser. Generated relationships use the shared ID service. Scope/application
providers are retained by template portals; the shared CDK overlay container is not themed or destroyed.

## Package and verification boundary

All Dropdown instances import `@pranxy/zordon-ui/internal-overlay`, which owns one coordinator/stack
identity per Angular application. The bridge is version-locked implementation infrastructure and is
not a consumer extension API. A second shipped overlay component must still prove cross-component
stacking before the broader foundation can be marked Complete.

Consumer Dropdown inputs, outputs and methods expose no Aria/CDK objects. Angular-generated static
`ɵ` host-directive metadata does reference the pinned Aria types and remains visible in the complete
API report; this compiler compatibility dependency is explicitly reviewed, not hidden.

Angular 21.0, Angular 22, Firefox and WebKit remain unverified. Manual assistive-technology and device
review is pending. See [progress](../plans/phase-5-dropdown-progress.md),
[visual matrix](dropdown-visual-matrix.md), and [manual review](dropdown-accessibility-review.md).

## Sources

- [Angular 21 Menu guide](https://v21.angular.dev/guide/aria/menu), compared with installed Aria 21.2.14.
- [daisyUI Dropdown](https://daisyui.com/components/dropdown/), compared with installed 5.7.16 CSS.
- [Overlay foundation](../foundations/overlay-host-and-positioning.md).
