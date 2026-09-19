# Accordion

DSP-01 exports `ZdAccordion`, `ZdAccordionItem`, `ZdAccordionHeading`, `ZdAccordionTrigger`,
`ZdAccordionPanel`, `ZdAccordionContent` and `ZdAccordionIndicator` from
`@pranxy/zordon-ui/accordion`. Angular Aria 21 owns grouped expansion, keyboard movement,
disabled policy and trigger/panel relationships. Zordon adds daisyUI anatomy, presentation,
lazy view preservation and panel event boundaries. No overlay is needed.

```html
<section zdAccordion [multiExpandable]="false" aria-label="Account settings">
  <zd-accordion-item indicator="arrow">
    <h2 zdAccordionHeading>
      <button
        zdAccordionTrigger
        id="account-trigger"
        [panel]="account.aria"
        [(expanded)]="accountOpen"
      >
        Account
      </button>
    </h2>
    <zd-accordion-panel #account="zdAccordionPanel" id="account-panel">
      <p>Server-rendered account information.</p>
    </zd-accordion-panel>
  </zd-accordion-item>
</section>
```

Import all parts used by the template. `accountOpen` can be a writable signal initialized to
true for default-open content. One item contains one direct native heading with one trigger,
followed by its direct panel. Choose the heading level for the document. Do not nest another
interactive control inside a trigger. Decorative custom indicators must be aria-hidden.

## Public contract

| Part                              | Inputs and state                                                                                         | Methods / outputs                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `[zdAccordion]`                   | `multiExpandable` true, `disabled` false, `softDisabled` true, `wrap` false; boolean attributes accepted | `expandAll()`, `collapseAll()`                                              |
| `zd-accordion-item`               | `indicator`: arrow (default), plus, custom or none                                                       | State styling follows its trigger                                           |
| `[zdAccordionHeading]`            | Native heading attributes remain consumer-owned                                                          | Applies collapse-title anatomy                                              |
| `button[zdAccordionTrigger]`      | Required `panel` Angular Aria reference; optional `id`, `disabled`; `expanded` false                     | `expandedChange`; `expanded()` signal; `expand()`, `collapse()`, `toggle()` |
| `zd-accordion-panel`              | `id`, `preserveContent` false                                                                            | `aria` reference for the trigger; `visible()` signal                        |
| `ng-template[zdAccordionContent]` | Optional lazy content marker                                                                             | `template` reference                                                        |

The explicit `panel.aria` bridge preserves Angular Aria's public panel contract without accessing
private state. Provide stable unique trigger/panel IDs, particularly for SSR and deep links. If
omitted, Angular Aria supplies generated IDs. One panel must belong to exactly one trigger, and
the pairing must remain stable for that trigger's lifetime.

Aria defaults to multi-expandable groups; set `[multiExpandable]="false"` for one-at-a-time
interaction. An open item can collapse, leaving none open. `expandAll()` works in multiple mode.
Disabled groups/items ignore interactive commands; soft-disabled items remain discoverable and
focusable, while `[softDisabled]="false"` uses native disabled buttons and skips them.

The expansion input/output follows Angular **model** semantics: two-way binding synchronizes
consumer state, and programmatic methods update the same model. A one-way input is not a vetoable
change request. Applications must keep externally assigned states consistent with single mode
(at most one true) and normalize state before switching from multiple to single mode. Disabling
does not forcibly close already expanded content. External closing that removes focused content
requires the caller to put focus somewhere appropriate.

## Keyboard, pointer and content

Enter/Space toggle, ArrowUp/ArrowDown move through the group, and Home/End move to its endpoints.
`wrap` allows endpoint wrapping. Tab follows Angular Aria's focusable native controls; Zordon does
not impose an additional roving-tabindex scheme. Clicking nested decorative trigger markup works.
Native synthetic activation (including `button.click()`) is also supported without double-toggling
ordinary pointer or keyboard input. Actual assistive-technology activation remains a human gate.

Panels stop bubbling keydown, pointerdown and focusin events at their boundary so editing controls
do not operate the outer group. Applications requiring those events should listen inside the
panel or use capture listeners. Closed panels are hidden and inert, including preserved content.

Project content directly for eager creation and meaningful initial server HTML. For lazy content:

```html
<zd-accordion-panel #billing="zdAccordionPanel" id="billing" [preserveContent]="true">
  <ng-template zdAccordionContent>
    <app-billing-editor />
  </ng-template>
</zd-accordion-panel>
```

The template is created when visible. By default it is destroyed on close and recreated on reopen.
Preservation retains its view and local state after first opening, while the closed panel remains
hidden/inert; changing preservation to false while closed destroys that view. Use one lazy template
per panel. Preserved child work continues until teardown; consumers own expensive background work.
Hidden display is immediate; Zordon does not promise an exit animation for inaccessible content.

Nested grouped accordions must be declared in a **separate child component's template**, then
project that component into the outer panel. This component boundary keeps nested triggers out of
Angular Aria 21's descendant content query. Do not inline a second group into the same template's
outer panel. The fixture demonstrates the supported boundary and verifies independent expansion.

## Native alternatives and deep links

For a progressively enhanced native accordion, use the existing `@pranxy/zordon-ui/collapse`
directives on `<details name="account">`, `<summary>` and a content container. Matching details
names provide browser-owned exclusivity; omit names for independent panels. Native radio markup
with a shared name provides mutually exclusive selection, using Collapse styling and accessible
radio names. Those controls retain details/radio semantics; do not add Aria trigger directives or
button roles to them. Native modes work before hydration and do not provide Aria's group keyboard
commands or lazy lifecycle. Browser support for details-name grouping is a compatibility gate.

Deep-link routing remains application-owned: use a stable panel ID and open its trigger when the
route fragment changes. Reconcile client-only fragments after hydration, then scroll/focus according
to the page's navigation policy. The fixture demonstrates initial `#billing` and an explicit link;
the library does not install global hash listeners or rewrite the URL.

## Styling and verification

Compile `collapse`, `collapse-open`, `collapse-close`, `collapse-title`, `collapse-content`,
`collapse-arrow` and `collapse-plus`. The configured daisyUI prefix applies to all tokens. Item
styles scoped by the `zd-accordion-item` selector normalize projected headings; trigger and panel
styles are encapsulated. Consumer classes, heading levels, colors, borders and spacing remain
customizable. Reduced motion and forced colors suppress transitions; the open arrow orientation
still reflects state. Custom indicators remain consumer-owned.

Native eager content is present before hydration. Aria buttons acquire interaction on hydration;
choose details when no-JavaScript interaction is essential. Keep initial states/IDs identical on
server and client. Delayed event replay and incremental-hydration ordering remain unverified.

See [accessibility review](accordion-accessibility-review.md), [visual matrix](accordion-visual-matrix.md),
[ADR 0018](../architecture/0018-accordion-aria-composition.md) and
[delivery evidence](../plans/phase-5-accordion-progress.md).
