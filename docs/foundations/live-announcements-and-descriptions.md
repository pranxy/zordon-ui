# Live announcements and accessible descriptions

This foundation defines how Zordon UI communicates dynamic status and associates controls with
visible hints and errors. It applies native semantics first, then supported Angular CDK primitives,
and avoids a second announcement or description framework.

The current deliverable is a composition contract plus native SSR/browser evidence. It does not
ship a Zordon announcer service, description directive, or generic ID-reference utility. Those APIs
need a real Status, form-control, Toast, or similar consumer before their ownership and cleanup can
be proved.

## Selection order

1. Keep persistent visible feedback in the component DOM with native live-region semantics.
2. Associate visible labels, hints, and errors through native IDs and ARIA relationships. Generate
   missing library-owned IDs with `ZdIdGenerator`.
3. Use CDK `LiveAnnouncer` only for an imperative, transient message that has no appropriate local
   live region.
4. Use CDK `AriaDescriber` only for a truly hidden imperative description on an arbitrary host. It
   is not the default for projected visible hints or errors.
5. Add private Zordon coordination only when a concrete component demonstrates a gap.

`@angular/aria` supplies compound-widget interaction patterns, not application-specific
announcements or control descriptions. This foundation therefore does not install it or change the
preview-containment policy in [ADR 0008](../architecture/0008-angular-aria.md).

## Announcement semantics

Choose the least disruptive semantic that communicates the event:

- use a pre-existing `role="status"` region for advisory results, saved state, loading completion,
  or other non-urgent feedback. `status` is implicitly polite and atomic;
- use `role="alert"` only for urgent or time-sensitive information that warrants interruption;
- use a labelled `role="log"` for append-only histories such as chat, with component-specific
  `aria-relevant` and `aria-atomic` behavior;
- use native progress, checked, selected, expanded, busy, and value semantics where they already
  expose the change. Do not repeat the same state through a live announcer;
- batch related changes while `aria-busy="true"` and announce a useful result, not every internal
  render, counter tick, or progress frame.

One semantic event has one announcement path. A component must not update a local status/alert and
call `LiveAnnouncer` with the same message. Focus does not move merely to announce. When the user
must acknowledge or act on information, use a focused dialog, error summary, or other operable UI
instead of live-only text.

Messages are concise, complete, and localizable. They include enough context to stand alone without
hard-coded English inside a generic foundation. Duplicate and coalescing behavior is component
specific: a repeated successful action may be meaningful, while rapid search-result counts should
usually collapse to the latest stable result.

Visible errors and important status remain discoverable until they are no longer relevant. Do not
clear a transient announcement on a timer unless the equivalent information remains visible or can
otherwise be recovered.

## Angular CDK boundary

CDK 21.2.14 provides public `LiveAnnouncer` and `CdkAriaLive` APIs in `@angular/cdk/a11y`.
`LiveAnnouncer` is the approved starting point for a future imperative path, but its exact behavior
matters:

- injection eagerly appends one visually hidden element to `document.body`;
- the generated element ID uses module-global state;
- `announce()` clears the current text and inserts the new message after 100 ms so repeated text can
  be detected by assistive technology;
- overlapping calls are latest-wins rather than a durable queue;
- the returned promise resolves when text reaches the DOM, not when a screen reader speaks it;
- `clear()` empties current text but does not cancel a pending insertion and is global to that
  service instance;
- the optional duration clears the DOM message after insertion.

Consequently, components must not eagerly inject/use it during server rendering, treat its promise
as delivery confirmation, call global `clear()` as ordinary component teardown, or invent a shared
queue policy before an actual consumer exists. Future imperative use starts after hydration in the
browser and owns its cancellation, overlap, destruction, and localization behavior.

`CdkAriaLive` observes an element's text and forwards changes through `LiveAnnouncer`. It is useful
only when forwarding the complete region is the intended behavior; it is not automatically better
than a native local live region.

CDK `AriaDescriber` creates a global hidden container and generated `cdk-describedby-*` messages.
It can deduplicate hidden strings and retain references, but its body ownership and generated IDs
make it the wrong default for server-visible/projected hints and form errors. Any future use must
test multiple descriptions, independent removal, destroy cleanup, and server behavior against the
supported CDK lines.

## Labels, hints, and errors

- Prefer a native `<label for>` relationship for form-control names. A placeholder is not a label.
- Visible hint and description elements receive an explicit consumer ID or a deterministic
  library-owned ID from the [stable ID foundation](stable-ids.md).
- `aria-describedby` is an ordered, whitespace-separated ID-reference list. Preserve dynamic
  consumer tokens first, append component-owned IDs in documented order, deduplicate exact tokens,
  and remove only owned tokens when content disappears.
- A component that owns the host attribute must expose a way to supply consumer references. Do not
  rely on competing same-host attribute bindings or snapshot a consumer value only once.
- Use `aria-details` instead of flattening long structured help into a description when the
  component specification and assistive-technology testing justify it.

`aria-errormessage` is present only while the control also has `aria-invalid="true"`. Its referenced
message is visible, pertinent, and explains both the problem and how to correct it. When the value
becomes valid, remove both attributes and hide or clear the inactive error.

Do not universally add the error ID to both `aria-errormessage` and `aria-describedby`; some
assistive-technology combinations can repeat it. A component may use that compatibility fallback
only after its manual matrix records the result. Keep ordinary hints associated while invalid
unless the hint becomes misleading.

Explicit IDs remain required when independently triggered incremental-hydration boundaries can
instantiate in a different order.

## SSR and hydration

Server HTML contains meaningful visible labels, hints, dormant empty live regions where needed,
and deterministic relationships. Initial server content is not assumed to trigger an announcement.
The client hydrates the same DOM and announces only a post-hydration semantic event.

Do not create a CDK live-announcer or describer container during server rendering. The compatibility
fixture verifies consecutive-response ID equality, relationship preservation, valid/invalid
transitions, one coherent status update, unchanged focus, no hydration errors, and absence of CDK
global accessibility containers.

## Verification

Automated tests can prove roles, attributes, ID references, text-update order, focus behavior,
cleanup, SSR stability, and axe results. They cannot prove what a screen reader actually speaks.

Every consuming component therefore adds manual checks with at least NVDA in Chrome or Firefox and
VoiceOver in Safari for the exact message, priority, duplicate/noise behavior, error persistence,
and focus context. Toasts, async results, validation summaries, countdowns, and logs require their
own event-frequency and interruption scenarios.

## References

- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WCAG 2.2: Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [WCAG 2.2: Understanding Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification)
- [WAI form notifications tutorial](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [APG accessible names and descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [Angular accessibility guidance](https://angular.dev/best-practices/a11y)
- [Angular CDK accessibility API](https://material.angular.dev/cdk/a11y/api)
