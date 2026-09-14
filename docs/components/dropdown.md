# Dropdown

> **Maturity:** Planned — Angular 21 integration spike implemented; public component not shipped  
> **Proposed entry point:** `@pranxy/zordon-ui/dropdown`  
> **Matrix row:** ACT-02 · Updated 2026-09-14

Dropdown opens anchored content from a native button. An action menu uses Angular Aria Menu;
arbitrary content retains its native controls, labels and tab order. A panel containing a form is
not assigned `role="menu"`. Native `<details>` and Popover remain suitable for simpler consumer
disclosures; this component supplies coordinated placement, controlled state and nested dismissal.

This work targets the existing Angular 21.2.19 and Aria/CDK 21.2.14 installation. Angular 22 and the
Angular 21.0 floor are unverified. The following is the implementation contract, not an importable API.

## Public contract to implement

- A compound root, native button trigger, panel and optional menu/item parts. Consumer markup owns
  trigger content and item content. No required icon library, data-only menu API or generic slot registry.
- `open` / `openChange` supports controlled state. Opening and closing requests have one owner;
  an externally closed or disabled root cannot retain an interactive panel.
- Separate action-menu and arbitrary-content semantics. Menu items emit an activation value exactly
  once; pointer and keyboard activation use the same path. Disabled menu items remain discoverable
  by arrow keys and cannot activate; a disabled native trigger is removed from the tab order.
- Logical side `top | bottom | start | end` and alignment `start | center | end`; a nonnegative gap;
  optional flipping; an 8px viewport margin. CDK owns collision and scroll repositioning.
- Click is the default trigger. Hover and focus are optional additions to keyboard/click access;
  manual mode is controlled by the consumer. Delayed hover opening/closing must preserve the path
  from trigger to panel and cancel all pending work on close/destruction. Hover must not steal focus.
- Close policies distinguish selection, Escape, outside pointer, focus leaving, trigger, programmatic,
  navigation and destruction. Consumer content can request selection close explicitly; clicking any
  arbitrary descendant is not assumed to be a selection. Escape and outside dismissal can be disabled
  without allowing the same physical event to dismiss a lower surface.
- Root button Enter/Space/ArrowDown opens at the first menu item; ArrowUp opens at the last. Aria owns
  navigation, wrapping, typeahead and logical submenu arrows. Tab follows normal document navigation
  and closes without forcing focus back. Escape restores the owning trigger; submenu Escape restores
  its parent item and leaves the root menu open. Selection normally closes the action-menu tree.
- Arbitrary content is nonmodal and does not trap focus. Initial focus is an explicit panel policy;
  closing after outside pointer or Tab must preserve the user's new focus destination. Restoration
  never focuses a destroyed/disabled trigger or overrides focus intentionally moved by an action.
- Nested menus use child-first disposal and one application overlay stack. Content templates retain
  Angular bindings, declaration injector, current `Dir`, and the nearest theme. No moving live DOM
  through a DOM portal, globals, or DOM singleton properties.

## Styling and customization

The installed daisyUI 5.7.16 source contains `dropdown`, `dropdown-content`, `dropdown-start`,
`dropdown-center`, `dropdown-end`, `dropdown-top`, `dropdown-bottom`, `dropdown-left`,
`dropdown-right`, `dropdown-hover`, `dropdown-open`, and `dropdown-close` candidates.

These classes do not all belong on a CDK-positioned panel: daisyUI's dropdown rules also control
visibility, absolute positioning, transforms, focus outlines and z-index. The implementation must
inventory the emitted subset and scope any overrides so CDK exclusively owns position, the overlay
stack owns stacking, and Angular state owns visibility. Do not combine CSS hover/focus visibility
with a competing Angular open state. Left/right classes must not become a physical public API.

Use `ZdClassNames` for emitted daisyUI candidates and theme tokens for surface, text, border, radius
and focus styles. Preserve consumer host classes/styles and provide documented panel sizing and
class hooks across the portal boundary. Check narrow viewports, long labels, dark themes, live RTL,
forced colors, zoom/reflow and reduced motion. Do not suppress a native visible focus indicator.

## Angular 21 integration findings

The test-only fixture at `/__zordon-tests__/dropdown-probe` composes the installed Menu, MenuItem,
MenuTrigger and CdkConnectedOverlay APIs. It is deliberately excluded from the published library.

Three adaptations are required:

1. **Lazy initial focus:** the trigger opens before a classic CDK template portal creates its Menu.
   After the menu attaches, a render hook must hand focus back to Aria through its public API. The
   probe verifies first-item opening. Last-item opening and focus/hover/manual policies still need
   the production adapter and their own regression cases.
2. **Portaled focus boundaries:** moving focus from the root panel into its detached child panel
   otherwise closes the root. The probe installs a capture listener on the owned root menu that
   recognizes the child panel. Generalize this through the existing stack's logical inside boundary,
   including descendants and teardown, rather than copying two-panel checks into each component.
3. **Top-only Escape:** installed Aria closes the root tree on submenu Escape. The probe handles
   plain Escape on the child before Aria's handler, calls the public parent close API and restores
   the parent item. Production handling must use stack arbitration so a single event cannot close
   both surfaces. Other navigation remains with Aria.

The probe creates the child menu shell while the root is open so its public Menu reference exists
before the submenu trigger needs it. Closed child content is hidden. Production rendering must
prove that an inactive shell does not join the interactive overlay stack, affect hit testing,
participate in accessibility navigation or keep observers/listeners alive unnecessarily.

## Package and completion gates

The [overlay foundation](../foundations/overlay-host-and-positioning.md) is Partial: private source
imports in separate secondary entry points can duplicate root singleton identities. Before publishing
Dropdown, settle the shared package identity with an ADR and API/package review. A new `ɵ` bridge is
still a published artifact; it cannot be disguised as private or bypass the documented review.
Two actual overlay component entries are required to close the foundation's full completion gate.

The public Dropdown report must contain no Aria/CDK classes in consumer signatures. Verify this with
the actual proposed compound declarations and a production partial-Ivy build, not merely the test fixture.
The default secondary budget remains 40 KiB raw / 12 KiB gzip. No new budget or dependency exception
is approved by this specification.

Before marking the row's automated columns complete, add production component/type/unit/API coverage,
full browser regressions, recursive nesting and dismissal-policy checks, SSR/hydration/event replay,
position/scroll/theme/direction tests, inspected visual baselines, changeset and package dry-run.
Screen-reader, touch, high-contrast and zoom/reflow human evidence is required before Done/stable.

## Sources

- [Angular 21 Menu guide](https://v21.angular.dev/guide/aria/menu), compared with the installed
  `@angular/aria` 21.2.14 declarations/runtime rather than assuming later CDK examples apply unchanged.
- [daisyUI Dropdown](https://daisyui.com/components/dropdown/), compared with installed 5.7.16 CSS.
- [ADR 0008: Angular Aria](../architecture/0008-angular-aria.md).
- [ADR 0004: Overlay infrastructure](../architecture/0004-overlays-and-angular-cdk.md).
