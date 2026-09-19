# Skeleton

FDB-05 exports `ZdSkeleton` and `ZdSkeletonRegion` from `@pranxy/zordon-ui/skeleton`. Skeletons
are decorative placeholders, not progress indicators or live announcements. The standalone
Angular 21 component uses signal inputs and OnPush rendering without timers or widget dependencies.

```ts
import { ZdSkeleton, ZdSkeletonRegion } from '@pranxy/zordon-ui/skeleton';
// Add both declarations to the consuming standalone component's imports.
```

```html
<p role="status">{{ loading() ? 'Loading profile' : 'Profile ready' }}</p>
<section aria-label="Profile" [zdSkeletonRegion]="loading()">
  <zd-skeleton preset="avatar-text" [active]="loading()" />
  @if (!loading()) {
  <h2>{{ profile().name }}</h2>
  <button type="button">Edit profile</button>
  }
</section>
```

Keep the status message outside the busy region so the region's busy state does not defer it.
The consumer owns data fetching, errors, content replacement, focus, cancellation and announcements.
The region directive only binds `aria-busy`; it does not assign a role, hide existing content,
disable actions, or coordinate sibling placeholders. Pass the same state to the region and any
Skeleton `active` inputs. Static `zdSkeletonRegion` means busy; `[zdSkeletonRegion]="false"` clears it.

| Input           | Default                                             | Contract                                                                 |
| --------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| `active`        | `true`                                              | Whether the placeholder is visible; false sets native hidden             |
| `shape`         | `rectangle`                                         | text, rectangle, circle or custom when preset is none                    |
| `preset`        | `none`                                              | none, paragraph, avatar-text or card; presets take precedence over shape |
| `width`         | `100%`, circle `3rem`                               | CSS inline size of the host, capped at the available width               |
| `height`        | rectangle/custom `8rem`, circle `3rem`, text `1rem` | CSS block size of the shape or each text line                            |
| `radius`        | daisyUI radius, circle `50%`                        | CSS corner radius override for shapes, text lines and card image         |
| `clipPath`      | `none`                                              | CSS clip path for custom shapes only                                     |
| `lines`         | `3`                                                 | Integer 1–100 for text and composition presets                           |
| `lastLineWidth` | `60%`                                               | CSS inline size of the last line, including a single-line placeholder    |
| `animation`     | `shimmer`                                           | shimmer, pulse or none                                                   |
| `speed`         | `1800`                                              | Positive finite duration in milliseconds; larger means slower            |

```html
<zd-skeleton shape="text" [lines]="4" lastLineWidth="80%" />
<zd-skeleton shape="circle" width="4rem" height="4rem" />
<zd-skeleton width="16rem" height="8rem" radius="1rem" animation="none" />
<zd-skeleton
  shape="custom"
  width="6rem"
  height="5rem"
  clipPath="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
/>
<zd-skeleton preset="card" animation="pulse" [speed]="2400" />
```

Text placeholders are geometric bars without real text. Paragraph is multiline text; avatar-text
adds a fixed 3rem circle; card adds a fixed 8rem image block above multiline text. Use individual
Skeleton components in consumer layout for other compositions. `height` controls text line height
inside presets, not their total height. Set both width and height when resizing a circle. CSS
lengths and clip paths are consumer-owned expressions and are not parsed by JavaScript. Keep
dimensions and last-line widths valid and within the available space. Invalid numeric line counts
or durations throw RangeError.

The component host is always `aria-hidden` and inert, contains no focusable content and creates no
loading label. Do not put meaningful content, interactive controls, roles or accessible names on
the artwork. Give the real surrounding region its native semantics and name. `active` does not
automatically change any region's busy state. There is no completion event or forms participation.

Shimmer uses the pinned daisyUI Skeleton styling. Pulse uses opacity animation on the same shapes.
None, reduced motion and forced colors remove animation; reduced motion also removes the shimmer
gradient. Forced colors uses static system-color outlines. No consumer content is animated.
Reduced-motion CSS is embedded in the entry; no extra stylesheet import is needed.

Compile daisyUI's `skeleton` candidate under the existing styling contract. `ZdClassNames` prefixes
apply to each placeholder part. Layout uses logical dimensions and flows with RTL. SSR output is
deterministic from inputs and the region's initial state; consumers must hydrate with matching
state. There are no browser-only reads or timers.

See [accessibility review](skeleton-accessibility-review.md), [visual matrix](skeleton-visual-matrix.md),
[ADR 0016](../architecture/0016-skeleton-artwork-and-busy-regions.md) and
[delivery evidence](../plans/phase-5-skeleton-progress.md). Human review remains pending.
