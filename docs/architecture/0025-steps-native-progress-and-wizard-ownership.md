# ADR 0025: Steps native progress and wizard ownership

Status: Accepted. Date: 2026-09-20.

Steps represents ordered process progress, optionally with native step-selection buttons. It is
not a tablist and does not adopt Angular Aria Tabs or roving tabindex. A named ordered list exposes
current-step semantics and visible state text. Display-only trackers remain ordinary content.

The current ID is accepted owner state. Buttons emit requests without applying them internally.
Linear mode permits earlier/current steps and gates forward steps on completion of all preceding
items. Disabled targets remain unavailable. The wizard owner performs validation, completion
updates, asynchronous work, panel rendering and focus transfer. Programmatic current assignments
are not blocked by linear mode, allowing restoration and external navigation.

Error can coexist with current state; disabled is independent. State labels and glyphs accompany
theme colors. Optional icon templates are decorative, and optional controls IDs reference panels
owned by the consumer. Stable nonempty IDs/labels and a valid current ID are validated together.

Packaged CSS owns responsive geometry and logical RTL placement. Below 48rem, responsive Steps
becomes vertical without a viewport observer. Explicit horizontal mode retains native overflow and
an accessible scroll container. daisyUI supplies prefix-aware color modifiers; the fixture omits
redundant generic layout candidates to preserve existing CSS limits.

Server-rendered progress is meaningful without JavaScript. Interaction requires hydration; no
overlay, global keyboard handler, Router, Forms dependency or panel runtime is introduced. Manual
assistive-technology, contrast and reflow reviews remain separate release gates.
