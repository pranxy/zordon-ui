# List

**Component ID:** DSP-14  
**Maturity:** Planned  
**Entry point:** `@pranxy/zordon-ui/list`

daisyUI List is a vertical layout for rows of information. Its documented vocabulary is a `list`
container, `list-row` items, and optional `list-col-grow` and `list-col-wrap` direct children.
By default, daisyUI makes the second child of a row grow; `list-col-grow` moves that responsibility
to another child, and `list-col-wrap` places a child on the next row.

The first Zordon package preserves that CSS contract with four styling-only directives:

- `[zdList]` → `list`
- `[zdListRow]` → `list-row`
- `[zdListColGrow]` → `list-col-grow`
- `[zdListColWrap]` → `list-col-wrap`

```html
<ul zdList aria-label="Recently played tracks">
  <li zdListRow>
    <span>01</span>
    <div zdListColGrow>
      <div>Moonlit Drive</div>
      <div>by Avery Chen</div>
    </div>
    <p zdListColWrap>Saved for offline listening.</p>
    <button type="button" aria-label="Play Moonlit Drive">Play</button>
  </li>
</ul>
```

## Native and accessibility boundary

Use native `<ul>`, `<ol>`, and `<li>` semantics for display lists. Consumers own labels, headings,
groups, dividers, row content, action buttons/links, disabled policy, loading and empty states,
data rendering, and media alternatives. The directives add no `role`, focusability, IDs, ARIA
state, event handlers, selection state, keyboard behavior, data source, observer, or virtualizer.

Do not present a plain display list as a Listbox. If a future API has actual single or multiple
selection, option state, arrow-key navigation, typeahead, and disabled-option behavior, it must
wrap the version-matched Angular Aria Listbox primitives behind a separately approved Zordon
contract. Reordering and virtualization are separate behavior and performance decisions.

## Evidence plan

The package has unit/type tests and browser, SSR/hydration, axe, and dark RTL mobile visual evidence.
Manual review remains necessary for actual row actions, media alternatives, long/wrapped content,
contrast, forced colors, zoom/reflow, RTL, assistive technology, and any future selectable mode.

## Source

- [daisyUI List documentation](https://daisyui.com/components/list/)

## Showcase visual story matrix — 2026-09-29

Scope: Second and third growing columns plus full-row note. Installed evidence: daisyUI 5.7.16 / Angular 21.2. Existing maturity and manual accessibility gates remain unchanged.

| Boundary                      | Representative and rationale                                                                                                       | Evidence                                            | Review                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| Requested compositions        | One static preview section groups materially different layouts without every input permutation.                                    | `e2e/visual-docs-site.spec.ts`, `showcase-list--*`  | Reviewed                                     |
| Theme, viewport and direction | Light desktop and dark RTL mobile reveal spacing, wrapping and contrast differences. Diff also captures the image pair separately. | Same visual suite                                   | Reviewed                                     |
| Behavior, semantics and SSR   | Screenshots do not prove motion or interaction; browser geometry/state checks and production accessibility/SSR suites do.          | `e2e/docs-pages.spec.ts` and production docs suites | Scoped checks pass; integrated limits remain |

[Implementation evidence and remaining limits](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29).
