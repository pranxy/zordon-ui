# Timeline

**Component ID:** DSP-19  
**Entry point:** `@pranxy/zordon-ui/timeline`

Timeline is a native ordered or unordered list of chronological events. Zordon supplies CSS-only directives for the documented `timeline`, start, middle, end, box, and snap-icon parts, plus horizontal/vertical and compact layout options.

```html
<ol zdTimeline orientation="vertical" aria-label="Release history">
  <li>
    <div zdTimelineStart>2026</div>
    <div zdTimelineMiddle>●</div>
    <div zdTimelineEnd zdTimelineBox>Release</div>
  </li>
</ol>
```

Consumers own event semantics, time markup, connectors (`<hr>`), icons, labels, progress state, links/actions, and any interactive behavior. No roles, focus behavior, keyboard model, data source, or progress API is added. Interactive event navigation requires a separately approved contract.

## Source

- [daisyUI Timeline documentation](https://daisyui.com/components/timeline/)
