# Chat Bubble

**Component ID:** DSP-07  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/chat-bubble`

Chat Bubble applies daisyUI’s visual message layout to consumer-owned native markup. It is five
standalone directives—`[zdChat]`, `[zdChatImage]`, `[zdChatHeader]`, `[zdChatFooter]`, and
`[zdChatBubble]`—not a conversation store, message model, delivery/read state machine, typing
indicator, attachment renderer, reaction/reply system, live region, or virtual scroller.

## Native and semantic boundary

Use `[zdChat]` on the element that already has the right message-item meaning: commonly an `<li>`
inside a consumer-owned ordered list, or an `<article>` when the message needs independent
landmark semantics. The placement is required because daisyUI needs either `chat-start` or
`chat-end`. The directives add only daisyUI classes; they never add roles, labels, IDs, focus
behavior, keyboard/pointer handlers, ARIA state, live announcements, timestamps, or delivery
behavior.

```html
<ol aria-label="Conversation">
  <li zdChat placement="start">
    <div zdChatImage zdAvatar>
      <div class="w-10 rounded-full"><img src="/ava.jpg" alt="Ava Chen" /></div>
    </div>
    <div zdChatHeader>Ava Chen <time datetime="2026-09-01T10:45">10:45</time></div>
    <div zdChatBubble color="primary">The deployment is ready.</div>
    <div zdChatFooter>Delivered</div>
  </li>
</ol>
```

The consumer selects list/article semantics, author identity, image alternative, heading/text
markup, machine-readable time, message ordering, and delivery state. A Chat Bubble color is not a
status announcement; a consumer that announces an incoming message owns the live-region scope and
timing.

## daisyUI inventory

The implementation pin is daisyUI 5.7.16.

| Candidate                                                                                   | Purpose                                         |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `chat`                                                                                      | Required container for one message and its data |
| `chat-image`                                                                                | Optional author-image part                      |
| `chat-header`                                                                               | Optional text above the bubble                  |
| `chat-footer`                                                                               | Optional text below the bubble                  |
| `chat-bubble`                                                                               | Required visual message bubble part             |
| `chat-start`, `chat-end`                                                                    | Required placement candidates                   |
| `chat-bubble-neutral`, `chat-bubble-primary`, `chat-bubble-secondary`, `chat-bubble-accent` | Optional theme color candidates                 |
| `chat-bubble-info`, `chat-bubble-success`, `chat-bubble-warning`, `chat-bubble-error`       | Optional semantic theme color candidates        |

The official examples compose `chat-image` with `avatar`, use ordinary `<time>` in headers, and
place delivery/read text in the footer. Installed CSS uses an internal `--mask-chat` tail-mask
variable. It is an exact-version daisyUI implementation detail, not a Zordon styling hook.

## Planned public API

| Directive        | Input       | Type                                                                                                            | Contract                                           |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `[zdChat]`       | `placement` | required `'start' \| 'end'`                                                                                     | Adds exactly one required placement candidate.     |
| `[zdChatBubble]` | `color`     | `'neutral' \| 'primary' \| 'secondary' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'error' \| undefined` | Adds one optional `chat-bubble-*` color candidate. |
| `[zdChatImage]`  | —           | —                                                                                                               | Adds `chat-image`; no inputs.                      |
| `[zdChatHeader]` | —           | —                                                                                                               | Adds `chat-header`; no inputs.                     |
| `[zdChatFooter]` | —           | —                                                                                                               | Adds `chat-footer`; no inputs.                     |

Unsupported values reject rather than create an uncompiled runtime class. `undefined` clears the
optional Bubble color. There are no models, outputs, methods, application defaults, Forms
integration, Angular Aria/CDK dependency, or generated message identifiers.

Static/dynamic consumer classes, non-overlapping `ngClass`, native styles and CSS custom
properties, `data-theme`, and native attributes remain additive. Explicit consumer candidates are
the documented per-token override boundary in
[host class composition](../foundations/host-class-composition.md).

## Content and compositions

The directives preserve ordinary consumer markup; they do not create a conversation structure or
template.

| Composition               | Consumer responsibility                                                                  | Chat Bubble responsibility                          |
| ------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Conversation/message item | Ordered/list/article semantics, IDs, ordering, pagination, grouping, and virtualization  | One message’s visual grid and required placement    |
| Author image              | Avatar composition, image alternative, fallback, loading, and presence                   | Optional `chat-image` layout only                   |
| Header/time               | Author name, metadata, `<time datetime>`, localization, and visible formatting           | Optional header layout only                         |
| Bubble text/media         | Sanitized/rendered content, attachment/media semantics, links, and long-message handling | Bubble shape, color candidate, and upstream spacing |
| Footer/status             | Delivered/read/error copy and non-color textual alternative                              | Optional footer layout only                         |
| Incoming update           | Live-region scope, urgency, announcement timing, focus and scroll policy                 | No inferred announcement or scrolling               |
| Actions/replies/reactions | Native buttons/menus, labels, state, keyboard/focus, and overlays                        | No interaction or reply/reaction API                |

Do not rely on bubble color alone for delivery/error meaning. Avoid placing message actions inside a
clickable message host; choose one clear native interactive owner or keep actions as siblings.

## Styling, themes, and customization

Use the documented candidates, ordinary Tailwind utilities, theme tokens, and native style
bindings for appearance and responsive layout. Consumers can control maximum width, text wrapping,
avatar size, metadata opacity, action layout, and responsive behavior without Angular inputs.

```html
<li zdChat placement="end" class="max-w-full">
  <div zdChatBubble color="success" class="max-w-[32rem] whitespace-pre-wrap">
    {{ localizedMessage }}
  </div>
  <div zdChatFooter class="opacity-70">{{ deliveredLabel }}</div>
</li>
```

The color input selects only a documented daisyUI candidate; it does not replace consumer classes
or certify custom-theme contrast. Do not expose arbitrary author, avatar, time, delivery, read,
error, typing, attachment, reaction, reply, scroll, animation, radius, padding, or tail inputs.
Consumers who override `--mask-chat` accept daisyUI exact-version coupling and must follow
[safe customization](../foundations/safe-customization.md); Zordon neither sets nor documents it
as a stable hook.

## Accessibility, platform, and lifecycle

Chat Bubble has no component-owned keyboard, pointer, focus, motion, directionality, browser API,
timer, subscription, observer, or cleanup path. daisyUI’s `chat-start`/`chat-end` CSS already uses
logical placement and flips the tail in RTL. The host and projected content render identically on
server and client, so SSR and hydration need only prove native attributes/content and deterministic
classes survive.

Consumers must provide a coherent conversation structure, meaningful image alternatives, explicit
message author/time where needed, text equivalents for delivered/read/error state, and a restrained
live-update policy. Review semantic-color contrast in supported/custom themes, forced-colors, RTL,
long localized messages, 200% zoom, 400% reflow, media/attachment accessibility, keyboard access
to consumer actions, and assistive-technology behavior for incoming messages.

## Examples

### End-aligned outgoing message

```html
<li zdChat placement="end">
  <div zdChatBubble color="success">I’ll join the call at 14:00.</div>
  <div zdChatFooter><time datetime="2026-09-01T13:32">13:32</time> · Sent</div>
</li>
```

### Avoid color-only delivery meaning

```html
<!-- Avoid: color alone does not communicate a delivery error. -->
<li zdChat placement="end"><div zdChatBubble color="error">Invoice</div></li>

<!-- Include text that communicates the consumer-owned state. -->
<li zdChat placement="end">
  <div zdChatBubble color="error">Invoice</div>
  <div zdChatFooter>Not delivered — retry available</div>
</li>
```

## Evidence required before Preview

| Area             | Required proof                                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API/package      | Intentional `./chat-bubble` entry, exact type tests, API extraction, tarball, and bundle review                                                                                 |
| Native semantics | List/article host and image/time/action preservation; no injected role, focus, ARIA, events, state, or wrapper markup                                                           |
| Styling          | Every part/placement/color candidate, stale color removal, consumer class/style precedence, Avatar composition, long text, and responsive layout                                |
| Accessibility    | Axe; manual conversation structure, image alternatives, time/delivery alternatives, action keyboard behavior, contrast, forced-colors, zoom/reflow, RTL, and live-update policy |
| SSR/hydration    | Stable host/classes/content and clean hydration without browser-only work                                                                                                       |
| Visual           | Light/dark/custom themes; start/end; image/header/footer; neutral/primary/status colors; long message/media; mobile RTL                                                         |

## Sources

- [daisyUI Chat Bubble documentation](https://daisyui.com/components/chat/)
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/)
- [Zordon Angular Aria adoption](../foundations/angular-aria-adoption.md)
- [Zordon host class composition](../foundations/host-class-composition.md)
- [Zordon safe customization](../foundations/safe-customization.md)
