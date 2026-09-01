# Chat Bubble specification research

**Component:** DSP-07 Chat Bubble  
**Question:** Define the documented daisyUI Chat Bubble surface and the smallest Angular-native API
that preserves semantic consumer composition and customization.  
**Pinned local evidence:** daisyUI 5.7.16  
**Constraints:** Do not infer behavior from obsolete Chat Bubble source. Prefer native semantic
elements and projected consumer content; avoid message state, delivery, typing, media, reaction,
reply, Angular Aria, CDK, or internal daisyUI variables unless a documented requirement needs them.

## Questions

1. Which Chat Bubble base, part, placement, and color classes does daisyUI document?
2. Which message, identity, timestamp, status, media, and interaction semantics are consumer-owned?
3. Which upstream variables are internal rather than safe public API?
4. What SSR/hydration, responsive, accessibility, and visual evidence should implementation require?

## Sources and findings

- [daisyUI Chat Bubble documentation](https://daisyui.com/components/chat/) inventories `chat`,
  `chat-image`, `chat-header`, `chat-footer`, and `chat-bubble`; required `chat-start` or
  `chat-end` placement; and eight `chat-bubble-*` color candidates. Its examples use ordinary
  consumer `time`, image, and text markup, including `chat-image avatar` composition.
- The installed daisyUI 5.7.16 `components/chat.css` confirms that the container is visual grid
  layout only. `chat-start`/`chat-end` place the image/header/footer/bubble and flip the tail in
  RTL; it adds no message behavior, roles, live announcements, timers, delivery state, or focus.
- Installed CSS has one internal `--mask-chat` tail-mask implementation variable. It is an
  exact-version implementation detail, not a Zordon API.
- [daisyUI utilities and CSS variables](https://daisyui.com/docs/utilities/) establishes the
  general utility/custom-property customization boundary. Ordinary classes, responsive variants,
  themes, and consumer CSS remain additive.

## Decisions to synthesize

- Use five standalone native directives: `[zdChat]`, `[zdChatImage]`, `[zdChatHeader]`,
  `[zdChatFooter]`, and `[zdChatBubble]`. Do not introduce a message model, list, thread,
  timestamp, avatar, delivery, typing, attachment, reaction, reply, or scroll directive.
- Require `placement` (`'start' | 'end'`) on `[zdChat]`; expose only optional exact upstream
  semantic color candidates on `[zdChatBubble]`. The four part directives take no inputs.
- Treat list/article semantics, author identity, media alternatives, timestamps, ordering,
  live-region policy, message/delivery/read/error state, action behavior, focus, and virtualized
  scrolling as consumer-owned native composition. No Angular Aria, CDK, Forms, browser API,
  animation, event, or model API is needed.
- Require later browser, SSR/hydration, axe, and visual coverage for all parts, placement/color
  classes, Avatar composition, RTL tails/layout, long localized messages, and consumer semantics.
  Manual accessibility review remains a separate prerequisite beyond automated evidence.
