# Progress

FDB-03 provides `ZdProgress` from `@pranxy/zordon-ui/progress` for task completion with a known
or unknown total. Angular 21 signal inputs and OnPush rendering wrap one native `<progress>`.
Angular Aria and CDK are unnecessary for this non-interactive native control.

```ts
import { ZdProgress, type ZdProgressFormatter } from '@pranxy/zordon-ui/progress';

// Include ZdProgress in the consuming standalone component's imports.
const format: ZdProgressFormatter = state =>
  state.value === null ? 'Waiting for total' : `${state.value} of ${state.max} MB`;
```

```html
<zd-progress
  #upload
  label="Upload"
  [value]="bytesSent()"
  [max]="200"
  [buffer]="bytesRead()"
  [format]="format"
  color="primary"
/>
<p>{{ upload.complete() ? 'Upload complete' : 'Upload pending' }}</p>
<zd-progress label="Preparing export" />
```

| Input       | Default       | Contract                                                                          |
| ----------- | ------------- | --------------------------------------------------------------------------------- |
| `label`     | Required      | Nonempty accessible name on the internal native progress element                  |
| `value`     | `null`        | Finite number clamped to `[0, max]`; null/undefined means indeterminate           |
| `max`       | `100`         | Finite, strictly positive number; invalid totals throw                            |
| `buffer`    | `null`        | Optional finite number clamped to `[value, max]`; suppressed while indeterminate  |
| `color`     | None          | neutral, primary, secondary, accent, info, success, warning, error                |
| `showLabel` | `true`        | Show the name and formatted value above the bar; hiding retains accessible naming |
| `animated`  | `true`        | Allow daisyUI animation/transitions; false disables both                          |
| `format`    | Built-in text | Pure `(ZdProgressState) => string` for visible text and `aria-valuetext`          |

`state()` returns readonly `value`, `max`, `percent`, `buffer` and `complete` fields. The first,
third and fourth can be null. `complete()` and `text()` expose derived state. Completion is true
whenever the normalized value reaches max, including the initial render. It becomes false on
reset, a larger max or an unknown total. There is no completion event, timer or automatic reset.
Consumers own work lifecycle and success announcements; completion of a transfer is not proof
that the server accepted it. Avoid announcing every progress update in a live region.

The default formatter returns a rounded percentage or `In progress`. Supply a pure formatter
for localization or units, including the null state. It must produce meaningful nonempty text
and render identically on the server and first client render. Numeric inputs use property
binding, not numeric HTML string attributes. Nonfinite values and blank labels throw RangeError.

The native element supplies progressbar semantics, value/max and indeterminate state. It does
not take focus or participate in forms. Visual labels and buffers are hidden from the accessibility
tree; the name and value text are available on the native element. Set `aria-busy` on the affected
application region yourself. Host ARIA attributes do not forward to the internal element; use
`label` and `format` to name and describe progress. External details can remain adjacent content.

The buffer is decorative and never changes the announced completion value. Include buffer
information in a custom formatter if it matters to the task. Logical sizing follows RTL; visible names and formatted values use bidirectional isolation.
Forced colors hides the buffer and restores native appearance. Reduced motion disables
indeterminate animation and value transitions; the static pattern remains visible. Native
platform painting in forced colors requires manual review.

Enable daisyUI Progress CSS and scan this entry's class candidates under the project's existing
styling contract. `provideZordonUi` class prefixes also apply. Embedded component CSS supplies
layout, buffer and motion overrides; there is no extra stylesheet export. Consumers may size
the host; the bar fills its available inline size. No dependencies or budgets changed.

Automated coverage includes state transitions, numeric validation, prefixes, formatting,
Chromium/axe, RTL, motion settings, forced colors, server output, hydration and light/dark
screenshots. See [accessibility review](progress-accessibility-review.md),
[visual matrix](progress-visual-matrix.md) and [delivery evidence](../plans/phase-5-progress-progress.md).
Manual assistive technology, theme contrast and other browser lanes remain pending.
