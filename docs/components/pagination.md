# Pagination

`@pranxy/zordon-ui/pagination` exports `ZdPagination`, `zdPaginationRange`,
`ZdPaginationToken`, `ZdPaginationChange`, `ZdPaginationQuery`, `ZdPaginationLabels` and the shared
`ZdSize` vocabulary. It composes the existing Button and Join directives inside a named native
navigation landmark. Angular Aria is not needed for native page links/buttons.

## Controlled results

```ts
import { signal } from '@angular/core';
import { ZdPagination, type ZdPaginationChange } from '@pranxy/zordon-ui/pagination';

// Add ZdPagination to the consuming component's imports.
readonly paging = signal<ZdPaginationChange>({ page: 1, pageSize: 25 });
```

```html
<zd-pagination
  label="Search result pages"
  [page]="paging().page"
  [pageSize]="paging().pageSize"
  [total]="420"
  [pageSizeOptions]="[10, 25, 50]"
  (stateChange)="paging.set($event)"
/>
```

Without `query`, buttons request changes and wait for updated inputs. The owner may reject a
request by leaving its inputs unchanged. A page-size request resets the requested page to one;
`stateChange` carries both values atomically. A rejected native select change visibly returns to
the accepted size. Accepted current-page changes update a polite, atomic status region. The
component does not fetch data, scroll results or move focus into results.

## Query-backed destinations

```html
<zd-pagination
  label="Catalog pages"
  [total]="420"
  [query]="{ page: 'page', pageSize: 'limit' }"
  [pageSizeOptions]="[10, 25, 50]"
/>
```

Configure Angular Router normally. In query mode, `Router` and `ActivatedRoute` are required.
`page`/`pageSize` become defaults when their URL values are absent or invalid. The current query
parameters are the state authority. Page controls become real `RouterLink` anchors, merging both
pagination parameters into the current route while preserving unrelated parameters and fragments.
Native modified clicks can open new tabs. Back/Forward and external Router navigation update the
rendered page and size. Size selection navigates to page one with the new size.

`pageChange`/`pageSizeChange`/`stateChange` notify requests before Router acceptance; they do not
cancel link navigation. Use Router guards for navigation rejection and the accepted `currentPage`
and `currentPageSize` signals for data loading. Do not issue a second navigation from those outputs.
No initialization redirect or canonicalization modifies malformed/out-of-range URLs. Page links
use the normalized current values, so a later navigation produces a valid destination. Multiple
paginators sharing a URL should use distinct parameter names.

## API

| Input                                | Default        | Contract                                                             |
| ------------------------------------ | -------------- | -------------------------------------------------------------------- |
| `page: number`                       | `1`            | Positive safe integer; one-based requested/default page              |
| `pageSize: number`                   | `10`           | Positive safe integer                                                |
| `total: number \| null`              | `null`         | Nonnegative safe integer item count, or unknown                      |
| `hasNext: boolean`                   | `false`        | Enables Next only when total is unknown; ignored for known totals    |
| `siblings: number`                   | `1`            | Integer 0–5; pages on each side of the current page                  |
| `pageSizeOptions: readonly number[]` | `[]`           | Empty hides select; values must be positive safe integers            |
| `size: ZdSize`                       | `md`           | `xs`, `sm`, `md`, `lg`, `xl`, forwarded to Button                    |
| `label: string`                      | `Pagination`   | Localized navigation landmark name                                   |
| `labels: ZdPaginationLabels`         | English object | Full replacement for control names, size label and status formatters |
| `disabled: boolean`                  | `false`        | Disables every page/size control; boolean attribute transform        |
| `loading: boolean`                   | `false`        | Disables controls, sets navigation busy state and announces loading  |
| `query: ZdPaginationQuery \| null`   | `null`         | Query parameter names `{ page, pageSize }`; nonempty and distinct    |

| Output/read-only signal           | Meaning                                                               |
| --------------------------------- | --------------------------------------------------------------------- |
| `pageChange: number`              | Requested page; also emits `1` for a size request                     |
| `pageSizeChange: number`          | Requested size, emitted only for a size request                       |
| `stateChange: ZdPaginationChange` | `{ page, pageSize }` for one logical request                          |
| `currentPage(): number`           | Normalized accepted/default page, clamped against known totals        |
| `currentPageSize(): number`       | Accepted/default size, including URL state                            |
| `pageCount(): number \| null`     | Ceiling of total/size; zero for empty results; null for unknown total |

For a size request, output order is size, page, combined state. Prefer the combined output when
updating a data source to avoid two fetches. Inputs do not emit corrective outputs. No CVA or
Angular Forms dependency is introduced. Empty/invalid URL values fall back to the corresponding
input; numeric positive safe integers are accepted. Invalid numeric input configuration throws
`RangeError`. Options are sorted/deduplicated and include the current size, even if absent from the
supplied options. Unknown paging never advances beyond `Number.MAX_SAFE_INTEGER`.

## Ranges and boundaries

`zdPaginationRange(page, pageCount, siblings = 1)` returns readonly tokens. A token is a page
number, `ellipsis-start`, or `ellipsis-end`. It uses the same safe-integer validation and sibling
limit. Zero pages returns `[]`; an oversized current page is clamped. First/last pages are always
included for a nonempty known total. Single missing pages are displayed directly; larger gaps
become decorative, noninteractive ellipses. Work and allocation are bounded by the sibling limit,
not by the total number of pages.

```ts
zdPaginationRange(5, 10); // [1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 10]
zdPaginationRange(4, 7); // [1, 2, 3, 4, 5, 6, 7]
```

First/Previous are disabled on page one. Next/Last are disabled at the known final page. Zero
results disables all boundary controls, omits numbered pages and announces “No results”; normalized
page remains one. Unknown totals show First, Previous, the current page and Next, with no Last or
invented page count. Use `hasNext` from the data source; this is integer page pagination, not an
opaque cursor protocol.

## Accessibility, layout and localization

Native Tab/Shift+Tab visits available controls, Enter activates links/buttons and Space activates
buttons. No roving tabindex, arrow-key interception or focus trap is added. The current numbered
control has `aria-current="page"` and stays focusable. Unavailable query anchors omit href, expose
`aria-disabled` and leave the tab sequence. Disabled/loading activation cannot issue requests or
Router navigation. Ellipses are hidden from assistive technology. Status is outside the busy nav
so loading and accepted-page messages can be announced.

`ZdPaginationLabels` contains `first`, `previous`, `next`, `last`, `pageSize`, `loading`,
`page(page): string` and `status(page, pageCount, total): string`. Supply all fields for another
locale. `pageCount` and `total` may be null, and total may be zero. Use localized number formatting
in callbacks for accessible names/status; visible page numbers currently use JavaScript numeric
formatting. Give multiple navigation landmarks distinct names.

The layout wraps at narrow widths without hiding destinations or changing DOM order. Logical
direction mirrors boundary glyphs in RTL. Current state uses an underline and weight, with a
forced-colors outline. Controls have at least 2.5rem minimum target dimensions, including small
Button variants. Reduced motion disables button transitions/animations. Theme, size and Join
classes remain prefix-aware. Consumers compile the daisyUI Button/Join candidates used by their
configuration. The fixture compiles base Button, non-default sizes and Join; md duplicates the
base size, while current/disabled styling is owned by Pagination, avoiding redundant fixture CSS.

Applications own result-region labels/busy state, fetch cancellation/errors, focus after navigation
and data changes, loading timing, and contrast in custom themes. Disabling a focused native control
can affect browser focus; establish the application's focus policy rather than expecting the
paginator to focus an unrelated result region. CSS-hidden/removed parent content remains the
owner's responsibility.

## SSR and migration

Server output includes native links, accepted query state, labels, current-page markers and status.
Query links navigate with JavaScript disabled. Controlled buttons and the page-size select require
hydration; provide a server form when no-JavaScript size changes are a product requirement. No DOM
measurement, overlay, browser-global listener or startup navigation is used.

Replace hand-written Join page buttons with `zd-pagination`, convert zero-based page indexes to
one-based values, and supply an item count rather than a page count to `total`. Preserve your
data-fetching and Router policies. Do not bind optimistic local page state as the authority in
query mode. See [ADR 0024](../architecture/0024-pagination-state-and-native-navigation.md),
[accessibility review](pagination-accessibility-review.md), [visual matrix](pagination-visual-matrix.md)
and [delivery tracker](../plans/phase-6-pagination-progress.md).
