# Radial Progress

FDB-04 provides `ZdRadialProgress` from `@pranxy/zordon-ui/radial-progress`. It combines daisyUI's
CSS ring with one named, non-interactive progressbar. Angular 21 signal inputs and OnPush rendering
keep actual units, normalized percentages and completion consistent on the server and browser.

```ts
import {
  ZdRadialProgress,
  type ZdRadialProgressFormatter,
  type ZdRadialProgressThreshold,
} from '@pranxy/zordon-ui/radial-progress';

// Add ZdRadialProgress to the standalone component's imports.
const thresholds: readonly ZdRadialProgressThreshold[] = [
  { at: 50, color: 'warning' },
  { at: 80, color: 'success' },
];
const format: ZdRadialProgressFormatter = state =>
  state.value === null ? 'Waiting for total' : `${state.value} of ${state.max} MB`;
```

```html
<zd-radial-progress
  #download
  label="Download"
  [value]="bytesReceived()"
  [max]="200"
  [thresholds]="thresholds"
  [format]="format"
  color="primary"
  size="8rem"
  thickness="8px"
/>
<p>{{ download.complete() ? 'Transfer complete' : 'Transfer pending' }}</p>

<zd-radial-progress label="Archive" [value]="100" color="success">
  <span zdRadialProgressIcon>✓</span>
  <bdi zdRadialProgressLabel>Done</bdi>
</zd-radial-progress>
```

| Input        | Default                    | Contract                                                                |
| ------------ | -------------------------- | ----------------------------------------------------------------------- |
| `label`      | Required                   | Nonempty accessible name on the host progressbar                        |
| `value`      | `null`                     | Finite number clamped to `[0, max]`; null/undefined means unknown total |
| `max`        | `100`                      | Finite, strictly positive numeric maximum                               |
| `size`       | `5rem`                     | Positive CSS length for the ring diameter and host dimensions           |
| `thickness`  | `calc(var(--size) / 10)`   | Positive CSS ring thickness; choose less than half the diameter         |
| `color`      | Inherited                  | neutral, primary, secondary, accent, info, success, warning, error      |
| `thresholds` | `[]`                       | Strictly increasing inclusive percentage/color boundaries in `[0, 100]` |
| `animated`   | `true`                     | Allow value transitions and rotation for unknown totals                 |
| `format`     | Percentage / `In progress` | Pure formatter for accessible value text and fallback center label      |

Numeric inputs use property bindings. Nonfinite values, nonpositive maxima, blank names and invalid
threshold boundaries throw RangeError. Thresholds are copied on input; provide a new array when
changing them. The highest boundary less than or equal to the current percentage wins. Below the
first boundary, and while indeterminate, `color` applies. Boundaries are percentages, even when
`max` is not 100. There is no implicit success/error meaning or completion color.

`state()` returns readonly `value`, `max`, `percent` and `complete`. `complete()`, `text()` and
`resolvedColor()` expose derived values. Completion is true at max, including initial render, and
resets when the value falls, the max rises above it or the value becomes unknown. No completion
event, timer, forms integration or automatic live announcement is added. The application owns
task success, errors, cancellation and busy regions.

The host supplies `role="progressbar"`, a name, min=0, max and clamped value in actual units.
Unknown totals omit `aria-valuenow`; a decorative 25% arc rotates while center text indicates the
unknown state. The ring's CSS `--value` receives the normalized percentage. Unlike linear Progress,
this visual structure needs projected center content, so its semantics are explicit ARIA rather
than a native progress element. It needs no Angular Aria or CDK widget.

The ring and center content are hidden from the accessibility tree; center content is also inert.
Use only non-interactive projected icons/labels. `[zdRadialProgressLabel]` replaces the default
label, and `[zdRadialProgressIcon]` adds artwork. Projection does not replace the required name or
formatted accessible value. Meaningful projected messages must also be represented by `label` or
`format`. Default text is bidirectionally isolated; projected labels own their language direction.
Keep custom formatters pure and deterministic for SSR, including the null state, and return
meaningful nonempty localized text. Threshold colors must not be the only way to convey status.

Colors affect the ring only; center text inherits the surrounding foreground for readability.
Reduced motion and `animated=false` stop ring rotation and value transitions while preserving
text. Forced colors uses a static system-color outline and visible text instead of gradient
painting; the outline itself does not encode a percentage. Zero hides the daisyUI endpoint dot.
Ring sweep remains clockwise in RTL; text and surrounding layout follow document direction.

Compile daisyUI's `radial-progress` candidate using the standard styling contract. The component
uses `ZdClassNames` prefixes, maps size/thickness to daisyUI variables, and embeds motion/layout
overrides. No extra stylesheet export or dependency is needed. Dimensions are CSS expressions,
not parsed or measured by JavaScript; consumers own valid lengths, fitting long content and
responsive sizing. Avoid percentage diameters because ring variables require a definite length.

See [accessibility review](radial-progress-accessibility-review.md),
[visual matrix](radial-progress-visual-matrix.md), [ADR 0015](../architecture/0015-radial-progress-semantics.md)
and [delivery evidence](../plans/phase-5-radial-progress-progress.md). Manual gates remain pending.
