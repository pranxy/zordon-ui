# Steps

`@pranxy/zordon-ui/steps` exports `ZdSteps`, `ZdStep`, `ZdStepState`, `ZdStepIconContext`,
`ZdStepsLabels` and the shared `ZdColor`/`ZdOrientation` vocabularies. Steps is a named native
ordered list with optional native buttons. It does not use tab roles or Angular Aria Tabs.

## Usage

```ts
import { signal } from '@angular/core';
import { ZdSteps, type ZdStep } from '@pranxy/zordon-ui/steps';

// Add ZdSteps to the consuming component's imports.
readonly current = signal<string | null>('details');
readonly steps = signal<readonly ZdStep[]>([
  { id: 'details', label: 'Details', state: 'complete', controls: 'details-panel' },
  { id: 'delivery', label: 'Delivery', controls: 'delivery-panel' },
  { id: 'review', label: 'Review', controls: 'review-panel' },
]);
```

```html
<zd-steps label="Checkout progress" [items]="steps()" [(currentId)]="current" interactive linear />
<section id="details-panel" [hidden]="current() !== 'details'">Details form…</section>
<section id="delivery-panel" [hidden]="current() !== 'delivery'">Delivery form…</section>
<section id="review-panel" [hidden]="current() !== 'review'">Review…</section>
```

This minimal example accepts step-button requests through two-way binding. For async validation or
approval, bind `[currentId]` and handle `(currentIdChange)` explicitly. Leaving the input unchanged
rejects the request. The selected item never changes optimistically inside Steps.

Omit `interactive` for a display-only process tracker. It preserves list ordering, descriptions,
status text and the current-step marker without introducing controls or tab stops. `currentId=null`
means no current step; an empty item list is valid.

## API

| Input/output                 | Default        | Contract                                                       |
| ---------------------------- | -------------- | -------------------------------------------------------------- |
| `items: readonly ZdStep[]`   | `[]`           | Ordered data with unique nonempty IDs and labels               |
| `currentId: string \| null`  | `null`         | Accepted step ID; must exist in items when non-null            |
| `currentIdChange: string`    | —              | Requests a different available step ID                         |
| `currentIndex(): number`     | `-1` when none | Read-only zero-based index of the accepted current step        |
| `label: string`              | `Progress`     | Localized name of the ordered list                             |
| `interactive: boolean`       | `false`        | Render native buttons instead of display-only labels           |
| `linear: boolean`            | `false`        | Gate forward requests on preceding completion flags            |
| `disabled: boolean`          | `false`        | Disable all step buttons                                       |
| `orientation: ZdOrientation` | `horizontal`   | Horizontal or vertical layout                                  |
| `responsive: boolean`        | `true`         | Switch horizontal layout to vertical below 48rem               |
| `color: ZdColor`             | `primary`      | Current-step color unless an item overrides it or has an error |
| `labels: ZdStepsLabels`      | English object | Full localized replacement for state text                      |

All boolean inputs use the boolean-attribute transform. There is no CVA, form value, Router
subscription, panel renderer, overlay or internal selection model. Unknown current IDs, duplicate
IDs and empty/whitespace IDs or labels throw `RangeError`; update current state and items together
when removing a step.

| `ZdStep` field                                | Contract                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| `id`, `label`                                 | Required stable identity and visible name                                      |
| `description?: string`                        | Optional visible supporting text                                               |
| `state?: 'complete' \| 'upcoming' \| 'error'` | Defaults to upcoming; current state comes from currentId                       |
| `disabled?: boolean`                          | Unavailable for interaction, with explicit visible unavailable text            |
| `color?: ZdColor`                             | Override the marker/connector color independently of state text                |
| `icon?: TemplateRef<ZdStepIconContext>`       | Decorative icon content; must not contain focusable elements                   |
| `controls?: string`                           | Optional ID of an existing owner-managed wizard panel, forwarded to the button |

`ZdStepState` is `complete | current | upcoming | error`. `ZdStepIconContext` exposes `$implicit`
(the step), `index` (zero-based) and effective `state`. The decorative marker shows a completion
check, an error exclamation or a one-based ordinal when no icon template is supplied. Custom icon
templates replace that marker content; constrain their artwork to the marker area.

## State and linear progression

Current state is derived from `currentId`. An explicit error takes precedence visually while
retaining `aria-current="step"` and both “Error” and “Current” text. A completed current step
displays “Current”; its underlying `state: 'complete'` still counts toward forward eligibility.
Disabled is independent of completion/error/current state and remains an explicit visible cue.

In linear mode, earlier steps and the current step remain eligible unless disabled. A forward
target is eligible only when **every preceding item** is marked complete. With no current step,
the first step is eligible, and later steps require all their predecessors complete. Disabled
predecessors are not silently skipped; mark them complete if the application intends them to
satisfy the prerequisite. Toggling linear mode off allows every non-disabled step. Activating the
current button does not emit another request. Native and synthetic activation of a disabled or
blocked button cannot emit a request.

The consuming wizard owns actual validation and transitions. A typical Continue action validates
its form, marks the old step complete, accepts the new current ID, renders/unhides the destination
panel and focuses its heading after render. Back navigation may preserve entered values. The test
fixture demonstrates native required fields, completion updates, rejected selection requests and
owner-controlled heading focus. Steps itself does not inspect forms, save data or enforce external
programmatic currentId assignments. This permits restoration of previously saved wizard state.

## Styling and responsive behavior

The prefix service supplies `steps`, `steps-horizontal`/`steps-vertical`, `step`, `step-icon` and
`step-{color}` classes. Supported colors are neutral, primary, secondary, accent, info, success,
warning and error. Complete markers default to success, errors to error and current markers to
the `color` input; upcoming markers use neutral base tokens unless the item supplies a color.
Visible status text and glyphs ensure color is not the only state cue.

Packaged CSS owns grid geometry, connector lines, markers, wrapping labels, current underline,
focus and responsive orientation. The fixture compiles all daisyUI color modifiers and omits
duplicated generic geometry rules, staying within unchanged CSS budgets. Horizontal items have an
8rem minimum width and use local overflow when needed. Vertical rows use equal track heights and
logical inline positioning. Responsive mode switches to vertical below 48rem without JavaScript.
When explicitly retaining horizontal mode with `responsive=false`, the list is a sequentially
focusable native scroll container. No custom arrow-key handling is added.

The component uses base theme tokens with system-color fallbacks for its structure. Color modifiers
require the matching daisyUI theme tokens/styles. Direction is inherited; RTL mirrors horizontal
progression and vertical marker placement without reversing DOM or Tab order. Text can wrap, and
buttons have a minimum 2.75rem block size. Forced colors add marker/current/focus outlines. Steps
introduces no animations. Owners must verify custom colors, icon artwork and theme contrast.

## Accessibility and SSR

The current list item has `aria-current="step"`. Each interactive button's accessible name comes
from its visible label, description and state text. Decorative icons and connector geometry are
not announced. `ZdStepsLabels` supplies `complete`, `current`, `upcoming`, `error` and `disabled`
strings. Use distinct meaningful list names when rendering multiple trackers.

Tab/Shift+Tab follows normal document order and skips disabled buttons. Enter/Space requests an
available step. There is no roving tabindex, tabpanel behavior, automatic focus movement or live
region in the library. The owner should focus/announce the newly accepted wizard panel as needed,
and manage focus if items or the entire widget are removed. A disabled display-only item is still
readable as part of the process.

Server output contains the same ordered labels, status text, current-step marker, disabled controls
and icons. Read-only progress is meaningful without JavaScript. Interactive changes require
hydration; supply a separate server workflow if no-JavaScript wizard actions are required. No
viewport observer, DOM measurement or generated panel identity is used.

## Migration and evidence

Replace raw daisyUI Steps lists with structured `items` and explicit current state. Keep form
validation, panels and navigation policies in the wizard owner. Do not migrate tabs to Steps when
the interface actually needs a tablist controlling tabpanels; use the dedicated Tabs component.

See [ADR 0025](../architecture/0025-steps-native-progress-and-wizard-ownership.md),
[accessibility review](steps-accessibility-review.md), [visual matrix](steps-visual-matrix.md)
and [delivery tracker](../plans/phase-6-steps-progress.md). Manual accessibility remains pending.
