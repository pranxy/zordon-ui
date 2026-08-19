# Reduced motion and animation state

Zordon UI treats motion as a progressive visual enhancement. Semantic state changes immediately;
animation may explain that change, but it must never be the mechanism that commits it.

This contract applies to Zordon-authored CSS, Angular templates, JavaScript animation, and the
daisyUI styles a component adopts. It does not add a global motion-reset stylesheet, public motion
service, duration-token system, or generic animation state machine before a real component needs
one.

## User preference is authoritative

Use the exact media features:

```css
.panel {
  /* Static final-state styling is the default. */
}

@media (prefers-reduced-motion: no-preference) {
  .panel {
    transition: transform 200ms ease-out;
  }
}
```

Motion belongs inside `prefers-reduced-motion: no-preference` when a static state is sufficient.
This static-first form is safer than declaring motion globally and trying to cancel it later. It
also lets the browser apply a live preference change without Angular state, `matchMedia()`, or a
hydration-sensitive class on the document.

Do not use an unqualified `@media (prefers-reduced-motion)` query. The explicit `reduce` and
`no-preference` values are the contract.

## Motion categories

Every component specification classifies each effect before implementation:

| Category            | Examples                                                       | Reduced-motion behavior                                                                                                                                 |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decorative          | hover lift, bounce, shimmer, confetti, parallax                | Remove it. Render the final static state immediately.                                                                                                   |
| Spatial explanation | panel travel, reordering, carousel movement, drag settle       | Replace large translation/scale/rotation with an instant change or a short non-spatial cue when the cue materially improves understanding.              |
| Status/attention    | loading, progress, validation feedback, async completion       | Preserve the semantic status, accessible text, and state styling. Do not rely on a spinner, pulse, or color motion as the only signal.                  |
| Essential           | motion whose removal would change the information or operation | Document why it is essential, minimize its amplitude/duration/repetition, provide pause/stop controls where required, and test the reduced alternative. |

“Reduced” does not universally mean “slower.” A longer moving animation can prolong discomfort.
Prefer no movement, then a non-spatial replacement, and only then a deliberately reduced essential
effect.

Reduced-motion support does not replace WCAG 2.2.2. Moving, blinking, or scrolling content that
starts automatically, lasts more than five seconds, and appears alongside other content needs a
pause, stop, or hide mechanism unless it is essential. Auto-updating content needs a comparable
control over the update or its frequency. Apply those obligations even when the user has not
requested reduced motion.

## Component state owns correctness

Component state and semantics update independently of animation:

- `aria-expanded`, `aria-hidden`, `aria-busy`, selection, form state, outputs, and models update from
  the actual interaction state, not from `transitionend` or `animationend`;
- focus, dismissal guards, scroll locking, and overlay-stack ownership follow component lifecycle,
  not an assumed CSS duration;
- interrupted or reversed animation cannot emit a second semantic change;
- a zero-duration/reduced-motion path reaches the same final DOM, ARIA, focus, and cleanup state;
- repeated actions during `opening` or `closing` follow the component's explicit concurrency policy.

`transitionend` is not a reliable state-commit signal: no event fires when duration and delay are
zero, and cancellation suppresses the end event. Event listeners may observe or release a visual
lifecycle only when the component also handles cancellation, destruction, preference changes, and
an explicit bounded fallback.

## Angular animation boundary

New components use native CSS and Angular's `animate.enter`/`animate.leave` support when structural
entry or removal needs coordination. Do not introduce new `@angular/animations` triggers,
`AnimationBuilder`, or reusable animation metadata: Angular deprecated that package in 20.2 and
recommends native CSS for new code.

For class-based `animate.enter` and `animate.leave`:

- keep the non-animated CSS as the usable final state;
- put motion-producing declarations behind `no-preference`;
- do not mix legacy Angular animations with enter/leave in the same component or projected tree;
- do not let the class-based callback alone own semantic or overlay completion: a live preference
  change can cancel CSS motion, while the installed Angular implementation does not provide a
  complete cancellation path for enter and can retain leave until its originally measured fallback;
- test CSS motion in a real browser because TestBed disables it by default and DOM emulators may not
  emit animation or transition events.

Function-based `animate.leave` must call `animationComplete()` on success, cancellation, reduced
motion, and failure. Do not depend on Angular's four-second safety timeout as normal control flow.

Persistent or portaled surfaces may require a private lifecycle coordinator when the first such
component lands. That implementation must be component-driven and cancellation-safe; this
foundation deliberately does not invent a generic timer or promise utility without a consumer.

## daisyUI ownership

daisyUI 5.7.16 is not a complete Zordon reduced-motion policy. Thirty-three component style objects
contain animation, transition, or smooth-scroll declarations, but only fourteen contain a
`prefers-reduced-motion` query. Its component source contains both:

- guarded behavior, such as Tooltip/Toast motion enabled only for `no-preference`, and Progress,
  Skeleton, Loading, Carousel, Swap, and other component-specific handling; and
- unguarded transitions in components including Button, Drawer, Modal, FAB, Hover 3D, Radial
  Progress, Select, and Toggle.

Upstream handling can also retain motion: Aura slows its infinite animation by four times, the base
Loading SVG mask keeps slower repeating animation, and the two-item Text Rotate case keeps discrete
infinite changes under `reduce`. Slowing an effect or changing its timing does not by itself satisfy
Zordon's component policy.

Some unguarded transitions affect color or small state feedback rather than large spatial motion,
so their presence alone is not a defect. Each component must inventory the exact compiled
animation, transition, transform, translate, scale, rotate, scroll, and view-transition behavior it
uses. Zordon then keeps, replaces, or overrides that behavior according to the categories above and
tests the result against the pinned/floor daisyUI range. Never assume that applying a daisyUI class
automatically satisfies this policy.

Do not ship a blanket rule such as `* { animation-duration: 0.01ms !important; }`. It can override
consumer and third-party ownership, still repeat animations, break animation-driven libraries, and
hide missing component-specific final states.

## JavaScript and media queries

CSS is authoritative when only presentation changes. Do not create a library service merely to
mirror the media query into a signal.

JavaScript may call `matchMedia('(prefers-reduced-motion: reduce)')` only when behavior genuinely
cannot be expressed in CSS, such as choosing whether to start a Web Animation or a component-owned
spatial algorithm. Such code must:

1. run only in the browser after the SSR/hydration boundary;
2. read the initial `matches` value and listen for the `change` event while active;
3. react to a live change by reaching the correct final visual and semantic state;
4. remove the listener and cancel/release owned animation work on destroy;
5. remain usable when the API is absent or JavaScript is disabled.

When this first becomes necessary, evaluate the public CDK `BreakpointObserver` and `MediaMatcher`
before adding custom listener plumbing. Prefer one private application-scoped source over a listener
per component, initialize it after a browser-only render boundary, and clean it up with Angular's
`DestroyRef`/`takeUntilDestroyed` lifecycle. A component input may reduce or disable motion further;
it must not force motion against the system preference by default.

Do not persist or override the operating-system preference in Zordon. A future application-level
motion override would be a separate, explicit product/API decision with precedence and hydration
rules.

## SSR and hydration

The server renders meaningful static state and never reads `window`, `matchMedia`, computed style,
animation timelines, or layout. CSS media queries are evaluated by the browser after delivery and
do not require the server to guess the preference.

Initial server and client structure, ARIA, text, and controlled state remain identical regardless of
motion preference. A component must not conditionally render different content during hydration
from a client-only media query. Browser-only animation starts after hydration/render and event
replay must not duplicate an enter effect or delay the replayed semantic action.

The first component with JavaScript-driven animation or a portaled closing lifecycle must add a
real SSR/hydration scenario covering initial reduced motion, post-hydration preference changes,
interruption, cleanup, and zero errors. Source inspection is not that proof.

## Verification

For every animated component:

1. assert semantic state and final rendering with `reduce` and `no-preference` in a real browser;
2. emulate a live preference change while the effect is active;
3. prove reduced motion removes or replaces the specific non-essential movement, not merely that a
   media query exists;
4. cover interruption, reversal, rapid repeated actions, cancellation, destruction, and cleanup
   when a lifecycle is asynchronous;
5. verify keyboard, focus, screen-reader state, forced colors, RTL, themes, and responsive behavior
   are unchanged by removal of motion;
6. run representative visual comparisons with animations disabled deterministically, while keeping
   separate behavioral coverage that proves the real motion policy.

The shared browser fixture demonstrates the baseline contract: semantic state changes immediately,
decorative transform/transition exists only under `no-preference`, and a live switch to `reduce`
removes it without resetting state. It is not evidence for a future component's lifecycle or SSR
behavior.

## References

- [W3C Media Queries Level 5: `prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion)
- [W3C technique C39](https://www.w3.org/WAI/WCAG21/Techniques/css/C39.html)
- [WCAG 2.2 understanding: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [Angular enter and leave animations](https://angular.dev/guide/animations)
- [Angular migration from the deprecated animations package](https://angular.dev/guide/animations/migration)
- [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [MDN `MediaQueryList` change event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event)
- [MDN `transitionend`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
