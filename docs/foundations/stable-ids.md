# Stable generated IDs

Zordon UI components use `ZdIdGenerator` when they must create an HTML `id` for a label,
description, panel, trigger, error, or another accessible relationship and the consumer did not
supply one. The service is deterministic for server rendering and ordinary Angular hydration when
the same scope allocates IDs in the same order on the server and client.

```ts
import { inject } from '@angular/core';
import { ZdIdGenerator } from '@pranxy/zordon-ui';

const ids = inject(ZdIdGenerator);
const descriptionId = ids.next('button-description');
```

Generated text is an implementation detail. Consumers may use the resulting relationship, but must
not parse, style, snapshot, or construct another ID from its current spelling.

## Contract

- `ZdIdGenerator` is root-provided and contains only instance-owned state. It does not read the DOM,
  browser globals, time, randomness, or module-global counters.
- Angular's public `APP_ID` namespaces each application. Its Unicode code points are encoded into a
  safe, collision-free ID segment. Applications that bootstrap more than one Angular application on
  a page must configure a distinct `APP_ID` for each, as Angular requires.
- Each scope has an independent zero-based sequence. Adding an unrelated component scope therefore
  does not renumber existing IDs.
- A scope is one lowercase ASCII kebab-case token, such as `accordion-trigger` or
  `field-description`. Empty values, capitals, spaces, underscores, and repeated hyphens are rejected
  before any counter changes.
- Every server request and Angular application receives its own root service instance. Repeated SSR
  requests therefore begin from the same state instead of leaking a process-wide sequence.

The current output resembles `zd-field-description-6e_67-0`, but that spelling is not a stable
public customization hook. The stable behavior is uniqueness among values issued by one application
generator and matching relationships under the documented rendering constraints; arbitrary
consumer-authored IDs remain outside that guarantee.

## Component authoring

Prefer a consumer-supplied ID. Generate a fallback only when the initial input is absent, retain that
fallback if the input later clears, and make every related attribute use the one resolved value.
Because signal inputs are assigned after construction, do not unconditionally allocate a fallback
in a field initializer when an explicit ID may be supplied. Resolve it once after initial inputs are
available. Never call `next()` from a template method, getter, `computed`, or repeatedly running
effect.

Choose a stable, component-owned scope and keep allocation order identical on the server and client.
Conditional content must make the same initial decision on both sides. Consumer data, locale, media
queries, storage, viewport state, and other browser-only values must not change initial allocation.

When Angular Aria or another approved foundation already owns a relationship, use its documented
behavior rather than allocating a competing ID. Do not re-export or parse an upstream generated ID.

## Incremental hydration boundary

Incremental hydration may instantiate independently triggered sibling `@defer` blocks in a different
order from server rendering. No sequence generator can infer a stable public template-tree position,
and `TransferState` alone cannot map sequence values back to those boundaries.

A component inside such a boundary must receive an explicit stable ID/key from server-visible
application data and skip fallback allocation. The first real component using generated IDs must
prove that explicit-ID path before the remaining incremental-hydration risk can be closed. Nested
blocks that Angular hydrates parent-first still need component-specific coverage.

## Required verification

For every component that generates relationships, test:

- repeated instances have unique IDs and intact `for`, `aria-labelledby`, `aria-describedby`,
  `aria-controls`, or `aria-errormessage` references;
- an explicit consumer ID skips fallback allocation and remains authoritative;
- conditional branches and initial controlled state allocate identically on server and client;
- consecutive SSR requests return the same generated relationships;
- hydration preserves the server IDs without mismatch errors;
- multiple Angular applications use distinct configured `APP_ID` values;
- invalid scopes fail before consuming a sequence value.

## Upstream references

- [Angular `APP_ID`](https://angular.dev/api/core/APP_ID)
- [Angular hydration](https://angular.dev/guide/hydration)
- [Angular incremental hydration](https://angular.dev/guide/incremental-hydration)
