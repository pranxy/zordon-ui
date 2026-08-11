# Named parts and slots

This foundation applies ADR 0002 to compound and structural components. It defines how Zordon UI
names projected regions, what Angular owns at projection time, and which parts of the rendered
element remain customizable by consumers.

## Public shape

“Slot” is an anatomy term in documentation. The Angular API is a static component-specific
attribute selector, optionally backed by a standalone part directive when the consumer's chosen
element needs library styling or behavior:

```ts
@Directive({
  selector: '[zdCardTitle]',
  host: { class: 'card-title' },
})
export class ZdCardTitle {}
```

```html
<zd-card>
  <h2 zdCardTitle class="text-balance">Account settings</h2>
  <p>Update the details other people can see.</p>
  <div zdCardActions>
    <button zdButton>Save</button>
  </div>
</zd-card>
```

The convention is:

- root selector: `zd-<component>`, such as `zd-card`;
- part selector: `[zd<Component><Part>]`, such as `[zdCardTitle]`;
- functional part declaration: `Zd<Component><Part>`, such as `ZdCardTitle`;
- include the full component name once in the part name, even when its package entry point contains
  a hyphen;
- root and all public part declarations export from the same component secondary entry point;
- no `slot` string input, generic `[zdPart]`, Shadow DOM `slot` attribute, or `/parts` entry point.

Projection-only selectors have no declaration or import. Consumers import every functional part
declaration used by their template. Importing a standalone root component does not implicitly place
its part directives in the consumer template's compilation scope.

## Choosing a part shape

Use the lightest shape that preserves semantics:

1. Project arbitrary unmatched content through the default `<ng-content />` region.
2. Use a documented static selector without a directive when its only job is projection. The
   selector is still a public, semver-reviewed template contract.
3. Add a marker directive when the consumer should choose the native element and the part needs a
   stable daisyUI class, deterministic attributes, DI, registration, or narrowly scoped behavior.
   Do not add an empty directive merely to represent a region.
4. Use a child component only when the part owns markup, state, injection, or a coordinated widget
   role. Examples include a tab or accordion item, not a card title.
5. Use a typed `TemplateRef` input for repeated, lazy, or data-driven rendering whose context is
   owned by the root. Do not turn ordinary projected content into template inputs.

There is no shared runtime part registry or base class. Angular projection already supplies the
static routing mechanism. Coordinated components may use typed `contentChild` or `contentChildren`
queries for state and relationships, but a query is not a substitute for projection and must not
search or move DOM nodes manually.

## Component anatomy contract

Every compound component specification must include an anatomy table with these fields:

| Field           | Required decision                                                                     |
| --------------- | ------------------------------------------------------------------------------------- |
| Part            | Public anatomy name, directive/component selector, and exported declaration           |
| Cardinality     | `0..1`, `1`, `0..n`, or `1..n`                                                        |
| Native semantic | Consumer-owned element/role and any element restrictions                              |
| Projection      | Named selector, default region, typed template, or child registration                 |
| Styling         | Library-owned daisyUI classes plus documented consumer class/style/CSS-variable hooks |
| Fallback        | Rendered fallback, root-provided accessible default, or explicitly none               |
| Coordination    | Query depth, state registration, ordering, IDs, and duplicate/missing-part behavior   |

Prefer optional or repeated projection-only parts. If semantics require a singleton or a required
part, the component specification must define missing and duplicate behavior; Angular does not
enforce projection cardinality. Coordinated child queries are direct-child scoped unless the
component's public pattern explicitly permits descendants, so nested compound components do not
register with an outer root by accident.

## Projection rules

Angular classifies projected nodes from compile-time template metadata:

- Put named and default placeholders in the component's logical reading and focus order. The
  wildcard may appear between named regions because Angular uses it only after no explicit selector
  matches; unmatched nodes go to that default region.
- A node matching more than one named selector is assigned to the first matching placeholder.
  Zordon APIs therefore prohibit multiple part markers on one node; consumers must not depend on
  first-match precedence.
- Declare each named selector once. Repeating a selector across placeholders leaves later copies
  without the nodes an author may expect.
- The component template determines the order between different regions. Nodes within one region
  keep their consumer-template order.
- Named nodes are not cloned into the default region.
- A bound marker such as `[attr.zdCardTitle]="condition"` is not the static selector shape: it does
  not instantiate the part directive, starts in the unmatched/default region, and cannot move
  between regions when the DOM attribute changes. Part markers are bare, unconditional attributes;
  conditionally create the marked node in the consumer template instead.
- `ngProjectAs` is literal, static projection metadata. It can make a node match a selector, but it
  does not instantiate the corresponding part directive or its styling/behavior. It is not a
  supported consumer substitute for importing and applying the public part directive. An internal
  adapter may use it only when the target part is explicitly projection-only.
- Never put a component's `<ng-content>` placeholder inside `@if`, `@for`, or `@switch`. Projection
  placeholders and their consumer content are created independently of those runtime conditions.
  Put conditional creation in the consumer template or use an explicitly designed typed template
  API for lazy rendering.

Fallback content inside `<ng-content>` is allowed when it is deterministic and semantically safe.
A fallback is part of the component's rendered and accessibility contract, so component tests must
cover its presence, replacement, and SSR output. It must not silently invent a required accessible
name unless the component contract provides a legitimate localized default. The wildcard default
region normally appears exactly once; intentionally dropping unmatched consumer content is a
component-specific, documented exception.

## Ownership and customization

The consumer owns the projected element, its text and descendants, native events, semantic element
choice within documented restrictions, and its classes, styles, CSS variables, ARIA, and data
attributes. A part directive may add library-owned classes and deterministic attributes through
Angular host bindings under the existing class/style composition contracts. It must not replace the
consumer's complete `class` or `style`, clone the node, rewrite arbitrary descendants, or use DOM
queries to discover parts.

The root owns region ordering, structural wrappers documented as stable anatomy, coordinated state,
and accessible relationships. A public part selector, required native relationship, promised
wrapper, fallback, template context, or registration rule is a compatibility surface and requires
public API review.

Prefer native structure: headings remain headings, actions remain buttons or links, lists remain
lists, and field labels use native association. A visual region name does not create semantics by
itself. ARIA roles and relationships belong to the root/part implementation only when native HTML
cannot express the pattern; interaction primitives follow the Angular Aria adoption policy.
Component DOM order must remain logical without CSS `order` disguising an incorrect reading or
keyboard sequence.

## SSR and hydration

Static projection and deterministic host bindings are SSR-safe. A root or part must not inspect
layout, query document order, or relocate projected nodes during construction or hydration. Any
generated relationship ID uses the shared [stable ID foundation](stable-ids.md). Components
with fallbacks, conditional consumer content, registered children, or generated relationships add
focused SSR/hydration tests when implemented.

## Verification checklist

For every compound component:

- prove named, default, optional, repeated, and fallback regions that its anatomy exposes;
- prove region order and repeated-part order without asserting private wrapper markup;
- prove consumer elements, content, classes, styles, CSS variables, ARIA, data attributes, and
  native events survive projection;
- prove missing, duplicate, nested, and conditional content behavior promised by the specification;
- prove `ngProjectAs` is not required by the consumer API and no dynamic re-slotting is promised;
- test coordinated registration/state separately from visual projection;
- add accessibility, SSR/hydration, and visual coverage required by the component Definition of
  Done.

The convention test fixture under `projects/components/src/internal/composition/` verifies Angular
21's static matching, ordering, fallback, `ngProjectAs`, and consumer-ownership boundaries without
shipping a generic runtime abstraction.

## Prohibited patterns

- generic strings such as `slot="title"`, `[slotName]`, or `[zdPart]="'title'"`;
- generic semantic selectors such as `[title]`, `.header`, or element names;
- CSS class-only public parts whose class may change with daisyUI internals;
- binding, toggling, or applying multiple part markers to re-slot content;
- treating `ngProjectAs` as if it ran the target directive;
- conditional `<ng-content>` placeholders or imperative node relocation;
- descendant DOM queries, cloned content, and a cross-component part registry;
- stabilizing undocumented daisyUI descendants as public Zordon parts.

## Primary references

- [Angular content projection](https://angular.dev/guide/components/content-projection)
- [ADR 0002: Component API and composition conventions](../architecture/0002-component-api-and-composition.md)
- [Public API review](../contributing/api-review.md)
