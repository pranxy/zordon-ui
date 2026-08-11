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

## Upstream references

- [Angular server-side rendering](https://angular.dev/best-practices/performance/ssr)
- [Angular hydration](https://angular.dev/guide/hydration)
- [AngularNodeAppEngine](https://angular.dev/api/ssr/node/AngularNodeAppEngine)
