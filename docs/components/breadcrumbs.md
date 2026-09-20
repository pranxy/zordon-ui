# Breadcrumbs

NAV-01 exports `ZdBreadcrumbs`, `ZdBreadcrumbItem`, `ZdBreadcrumbIconContext` and
`ZdBreadcrumbOverflow` from `@pranxy/zordon-ui/breadcrumbs`. It renders a labelled native nav,
ordered list and ordinary anchors. The final item represents the current page. Angular RouterLink
handles application navigation; there are no menu roles or custom arrow-key navigation rules.

```ts
import { ZdBreadcrumbs, type ZdBreadcrumbItem } from '@pranxy/zordon-ui/breadcrumbs';

readonly path: readonly ZdBreadcrumbItem[] = [
  { id: 'home', label: 'Home', routerLink: ['/'] },
  { id: 'projects', label: 'Projects', routerLink: ['/projects'] },
  { id: 'report', label: 'Quarterly performance report', shortLabel: 'Report' },
];
```

```html
<zd-breadcrumbs [items]="path" label="Page path" [maxItems]="4" />
```

Include `ZdBreadcrumbs` in the consuming component's imports. Configure the Angular Router when
using routerLink items. Href-only and plain-text trails work without a Router provider.

## Inputs and item model

| Input            | Default                 | Contract                                                           |
| ---------------- | ----------------------- | ------------------------------------------------------------------ |
| `items`          | Empty array             | Readonly ordered trail, ancestors first and current page last      |
| `label`          | Breadcrumb              | Localized navigation landmark name                                 |
| `overflowLabel`  | Show hidden breadcrumbs | Localized accessible name for the overflow summary                 |
| `separator`      | ›                       | Decorative text; native bidirectional text rendering applies       |
| `overflow`       | collapse                | collapse or scroll                                                 |
| `maxItems`       | 4                       | Integer at least 3; includes the overflow disclosure slot          |
| `linkCurrent`    | false                   | Render a final destination as a link when supplied                 |
| `structuredData` | false                   | Emit full-trail Schema.org microdata using explicit canonical URLs |

Each item requires a unique nonempty `id` and nonempty `label`. Optional `href` and `routerLink`
are mutually exclusive. Items with neither remain plain text. `routerLink` accepts a string,
command array or Angular UrlTree; `queryParams` and `fragment` are forwarded to RouterLink.
Follow RouterLink's own constraints, including not combining UrlTree with query/fragment options.
Relative commands resolve against the consuming route. The library does not infer ancestors from
the router configuration or automatically mark an ancestor active.

Optional `shortLabel` replaces only the visible label at widths up to 40rem. The complete label
remains the accessible name; overflow links always show the complete label. Long inline labels
can ellipsize. Applications should supply useful short labels and avoid indistinguishable names.
An optional `icon: TemplateRef<ZdBreadcrumbIconContext>` receives the item as its implicit context.
Its wrapper is aria-hidden; icons must be decorative and contain no focusable controls.

The last item always receives `aria-current="page"`, whether text or a link. A single-item trail
has one current item; an empty trail renders an empty named nav. Consumers may conditionally omit
the component if an empty landmark is unwanted. Ordinary and modified link activation retain
browser behavior; no imperative router navigation or preventDefault interception is added.

## Collapse, scrolling and focus

Collapse mode keeps the first item and the final `maxItems - 2` items. If the trail is longer than
the limit, its middle appears in a native details/summary dropdown occupying one slot. All ancestor
anchors exist in server HTML, and native disclosure works with JavaScript disabled. The dropdown
contains ordinary links in a list. Tab/Shift+Tab navigate them; Enter/Space operate the summary.
There is no menu focus trap, typeahead or menuitem role.

After hydration, Escape closes the dropdown and returns focus to its summary. Outside clicks and
link activation close it too. Closing restores summary focus if focus was inside the disclosure;
otherwise outside focus stays put. Replacing the trail or switching overflow mode can destroy the
focused element, so applications own focus policy for programmatic structural changes.

Scroll mode ignores maxItems and renders the entire trail in a horizontally scrollable nav. The
nav enters the tab order so native keyboard scrolling is available. Responsive labels still apply.
No viewport measurement runs during SSR or hydration; the CSS breakpoint controls label changes.

The dropdown is positioned in its local DOM context, aligned to the logical start of its summary,
with bounded width/height and internal scrolling. Collapse mode keeps the nav overflow visible.
It is not a CDK overlay, top-layer popover or collision-flipping surface. Avoid clipping ancestors;
allow page scrolling when placing it near a viewport edge. It remains inside modal isolation.

## Structured data

Enable `structuredData` and provide `canonicalUrl` for every ancestor. URLs must be absolute
HTTP(S); the last item may omit its URL. The component emits a hidden metadata container with
BreadcrumbList/ListItem scopes, complete names, one-based positions and URL anchors for the full
trail, independent of visual collapse. The data describes the same user-accessible hierarchy.
Text and URLs use Angular bindings; no HTML or trusted-resource bypass is used.

Canonical URLs are explicit because relative RouterLink commands and application route state are
not a canonical URL policy. Consumers own canonical correctness and avoiding duplicate structured
data generated by another integration. Schema.org uses positions to establish hierarchy order;
Google's breadcrumb guidance has additional eligibility requirements, including at least two
ListItems. Validate the production page; rendering metadata does not guarantee a search feature.
Sources: [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList) and
[Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

## Styling and verification

Compile the daisyUI `breadcrumbs` candidate. The configured daisyUI prefix applies. Zordon replaces
generated list separators with decorative text and packages disclosure, focus, responsive label
and scroll-mode styles. Theme colors inherit or use base-content/base-100; custom themes and icon
content remain application-owned. Reduced motion and forced colors suppress motion; keyboard focus
uses a visible current-color outline.

SSR includes links, current-page semantics, the closed native disclosure and optional full metadata.
Initial item data and options must match on server/client. Delayed event replay and incremental
hydration remain unverified. No private Angular APIs, Angular Aria dependency or overlay runtime
is introduced for navigation links.

See [accessibility review](breadcrumbs-accessibility-review.md), [visual matrix](breadcrumbs-visual-matrix.md),
[ADR 0019](../architecture/0019-breadcrumbs-native-navigation.md) and
[delivery evidence](../plans/phase-6-breadcrumbs-progress.md).
