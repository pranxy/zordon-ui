# SSR and hydration testing

The `ssr-example` Angular application is the stable server-rendering compatibility fixture for Zordon UI. It is intentionally separate from the legacy documentation application, whose obsolete services are not the basis for new library APIs.

## What the smoke test proves

The dedicated Playwright suite verifies that:

- a live Node SSR request returns meaningful component content before client JavaScript runs;
- Angular hydration annotations are present in the server response;
- the server-rendered page remains readable when JavaScript is disabled;
- `afterNextRender` runs only in the browser and updates the hydration status after reconciliation;
- a signal-based interaction works after hydration;
- consecutive server requests produce the same generated accessible relationships;
- hydration preserves generated IDs and their `aria-*` references;
- no browser console errors, page errors, or hydration mismatch errors occur;
- the hydrated fixture has no detectable WCAG A or AA violations.

The initial fixture uses deterministic server/client state and contains no browser-global access during rendering. Each component with server-visible output or interactive hydration behavior must extend this application and its smoke coverage before being marked SSR-ready.

## Commands

```sh
# Build browser/server artifacts and run the hydration smoke tests
npm run test:ssr

# Build the SSR example without running a browser
npm run build:ssr
```

The production server output is `dist/ssr-example/server/server.mjs` and listens on port 4400 by default. The Playwright config starts and stops that built server automatically.

## Authoring rules

- Keep initial server and client templates structurally identical.
- Generate IDs through `ZdIdGenerator`, follow the
  [stable ID contract](../foundations/stable-ids.md), and keep initial allocation order deterministic.
- Run DOM, storage, media-query, observer, and layout APIs only from browser-safe render hooks or guarded services.
- Do not use `ngSkipHydration` to conceal a mismatch unless a documented third-party integration cannot support hydration.
- Test both server HTML and post-hydration public behavior.

Focus management follows the same boundary. Server output must not claim a focused state or depend
on CDK focus-trap anchors. A component that traps focus must prove post-hydration activation,
documented initial focus, cleanup, and restoration in a real browser; source inspection and jsdom do
not establish tabbability. See the [focus management foundation](../foundations/focus-management.md).

Dismissal dispatch is also browser-owned. Server rendering must not attach an `OverlayRef` or add
global dispatch listeners. The first dismissible overlay must prove that hydration/event replay
attaches once, does not reinterpret the opening event as outside, routes one Escape/outside/backdrop
reason, and removes every subscription on close. See the
[dismissal foundation](../foundations/dismissal-and-outside-interaction.md).

The private overlay coordinator is browser-gated before CDK creates a ref or container. Its server
unit test proves that path is a no-op. That is not a substitute for a consuming component's real
SSR/hydration fixture: the first portaled component must render meaningful server content and prove
one post-hydration attachment, stable relationships, event-replay safety, positioning, dismissal,
and cleanup. See the
[overlay foundation](../foundations/overlay-host-and-positioning.md).

Body-lock construction is DOM-idle and the overlay browser guard runs before a CDK strategy or
lease is created. The first Modal/Drawer still owns the hydration/event-replay gate for acquiring
once and restoring final document state; see the
[body scroll-lock foundation](../foundations/body-scroll-lock.md).

Direction must be explicit and stable across server and client. The private direction/overlay source
does not run on the server; the first published consumer must prove server-rendered `dir`, a clean
hydration, one post-hydration open in the nearest direction scope, and live repositioning without a
second overlay. See the
[directionality foundation](../foundations/directionality-and-logical-placement.md).

Motion preference is presentation state, not server-rendered application state. Render the same
meaningful static DOM, ARIA, text, and controlled values on server and client; let CSS media queries
select motion after delivery. Browser-only `matchMedia` or animation work starts after the hydration
boundary and must not duplicate replayed interactions. The first JavaScript-driven or
lifecycle-delaying animation owns a real hydration, live-preference, interruption, and cleanup gate;
see the [reduced-motion foundation](../foundations/reduced-motion.md).

## Upstream references

- [Angular server-side rendering](https://angular.dev/best-practices/performance/ssr)
- [Angular hydration](https://angular.dev/guide/hydration)
- [AngularNodeAppEngine](https://angular.dev/api/ssr/node/AngularNodeAppEngine)
