# Countdown

**Component ID:** DSP-09  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/countdown`

daisyUI Countdown is a visual digit-transition wrapper. Its documented contract is a `countdown`
class, a consumer-updated `--value` CSS variable from 0 to 999, and optional `--digits: 2` or `3`.

Zordon must not infer a timer from the styling class. Countdown/tick scheduling, target dates,
time-zone formatting, pause/resume/reset, completion events, localization, live announcements, and
SSR time reconciliation require a separate approved behavior contract. The initial package should
be a native `[zdCountdown]` styling directive only, preserving consumer text, `--value`,
`--digits`, labels, and live-region decisions.

```html
<span zdCountdown class="font-mono text-2xl">
  <span [style.--value]="seconds" [attr.aria-label]="seconds">{{ seconds }}</span>
</span>
```

Consumer values must remain within 0–999. Consumers own whether the changing number is announced;
high-frequency countdown updates should not automatically become an `aria-live` stream.

## Sources

- [daisyUI Countdown documentation](https://daisyui.com/components/countdown/)

## Showcase visual story matrix — 2026-09-29

Scope: Clock, labeled units and boxes; preserve numeric clock order in RTL. Installed evidence: daisyUI 5.7.16 / Angular 21.2. Existing maturity and manual accessibility gates remain unchanged.

| Boundary                      | Representative and rationale                                                                                                       | Evidence                                                | Review                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| Requested compositions        | One static preview section groups materially different layouts without every input permutation.                                    | `e2e/visual-docs-site.spec.ts`, `showcase-countdown--*` | Reviewed                                     |
| Theme, viewport and direction | Light desktop and dark RTL mobile reveal spacing, wrapping and contrast differences. Diff also captures the image pair separately. | Same visual suite                                       | Reviewed                                     |
| Behavior, semantics and SSR   | Screenshots do not prove motion or interaction; browser geometry/state checks and production accessibility/SSR suites do.          | `e2e/docs-pages.spec.ts` and production docs suites     | Scoped checks pass; integrated limits remain |

[Implementation evidence and remaining limits](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29).
