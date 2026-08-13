# Directionality and logical placement

Zordon UI uses Angular CDK `Directionality` as the single source for horizontal left-to-right and
right-to-left behavior. Components must use logical `start` and `end` APIs unless a physical side is
intrinsic to the behavior. Do not add a second Zordon direction service, observe DOM attributes, or
read layout during server rendering.

This foundation is **Partial**. The reusable private overlay integration is implemented and tested,
but the first published component must still prove its browser, SSR/hydration, and package path.

## Consumer setup

Set an explicit application direction on `<html>` or `<body>`. CDK's root `Directionality` reads
`body.dir`, then `html.dir`, then defaults to `ltr` when it is first created.

Use CDK `Dir` (or `BidiModule`) for a nested or live-changing Angular scope:

```html
<section dir="rtl">
  <!-- Zordon components created in this Angular scope inject the nearest Directionality. -->
</section>
```

The standalone CDK `Dir` directive provides itself as the nearest `Directionality` and emits when
its input changes. A raw DOM attribute that is not matched by `Dir`, a later direct
`setAttribute('dir', ...)`, or a CSS `direction` declaration does not update Angular DI. Configure
direction before hydration, and change it through the Angular binding that owns the `Dir` instance.

Zordon guarantees explicit `ltr` and `rtl`. Do not use `dir="auto"` as application/component state:
CDK resolves `auto` from the browser language, while HTML resolves it from element content, and the
server has no equivalent browser-language guarantee.

## Component contract

- Inject the nearest public CDK `Directionality`; do not infer it from the origin's DOM ancestors.
  Angular declaration/injector scope, portaled DOM placement, and Shadow DOM ancestry can differ.
- Use `ZdInlinePlacement` (`start | center | end`) for reusable inline alignment. Use physical
  `left`/`right` only where the physical screen edge is the actual product meaning and document it
  in that component's API.
- Prefer CSS logical properties (`margin-inline-start`, `padding-inline-end`, logical borders and
  insets) for styling. Do not pre-flip classes or placement values in component code.
- Keyboard behavior follows the relevant native/APG/Angular Aria pattern. Direction-sensitive arrow
  behavior consumes the same nearest `Directionality`; visual mirroring alone is insufficient.
- Icons are not universally mirrored. Mirror directional navigation/progress glyphs deliberately;
  do not mirror text, numbers, media controls, brand marks, or familiar nondirectional symbols.

## Portaled overlays

For every private overlay open, direction ownership is:

1. an explicit internal direction source supplied by the owning component;
2. the content injector;
3. the content `ViewContainerRef` injector;
4. the application/root `Directionality`.

The coordinator snapshots the source's exact `ltr`/`rtl` value into the CDK overlay before attach,
provides the same source to portal content, and listens for distinct changes. On a live change it
updates the existing overlay host's `dir` and then asks CDK to reposition the same ref. The handle
owns that subscription and removes it on finalize, destroy, or failed open.

Connected position pairs remain logical and ordered. CDK maps their `originX` and `overlayX`
`start`/`end` values against the overlay direction. Global `start`/`end` is also resolved by CDK.
Never reverse the pair list or pre-map start/end to left/right; that would double-flip RTL.

The private numeric `offsetX` is a physical x-axis delta and CDK does not reverse its sign. Public
component APIs should normally expose a logical gap/alignment instead of leaking this implementation
coordinate. `offsetY` remains a physical y-axis delta.

An overlay opened from portaled content inherits the content's supplied direction source unless its
owner explicitly selects another source. Separate Angular applications and browsing documents have
separate direction roots; there is no cross-app or iframe bridge.

## Writing-mode boundary

This version supports horizontal writing mode (`horizontal-tb`) with `ltr` or `rtl`. CDK Overlay's
connected/global model treats start/end as the horizontal x axis and top/bottom as the vertical y
axis. True vertical or sideways writing modes change the inline and block axes and are not covered
by this mapping. Components may still render vertical text through consumer CSS, but must not claim
logical overlay placement or keyboard mirroring for those modes without a separate specification and
cross-browser proof.

## SSR and hydration

Direction itself is semantic server-rendered state: render the same explicit `dir` on server and
client. The private coordinator remains browser-gated and creates no overlay container, pane,
subscription, or layout measurement on the server. A server-rendered trigger/content fallback must
remain meaningful without JavaScript.

The first component that consumes this foundation must prove:

- consecutive explicit-RTL server renders are stable and contain no overlay DOM;
- hydration has no mismatch or console error;
- a post-hydration open attaches once with the nearest direction;
- changing the owning `Dir` moves an open logical placement without closing/reopening it;
- teardown prevents later direction changes from touching the disposed ref.

## Verification

Foundation tests cover source selection, exact initial host direction, portal injection identity,
live update/reposition ordering, duplicate-change suppression, and cleanup. Real-browser component
tests must additionally compare LTR/RTL physical geometry for connected and global start/end and
exercise nested live scopes. Release compatibility must run the supported Angular/CDK floor and
latest lanes; installed-version evidence alone does not establish Angular 22 compatibility.

Primary references:

- [Angular CDK bidirectionality overview](https://material.angular.dev/cdk/bidi/overview)
- [Angular CDK bidirectionality API](https://material.angular.dev/cdk/bidi/api)
- [Angular CDK overlay API](https://material.angular.dev/cdk/overlay/api)
- [CSS Writing Modes Level 4](https://www.w3.org/TR/css-writing-modes-4/)
- [CSS Logical Properties and Values](https://www.w3.org/TR/css-logical-1/)
