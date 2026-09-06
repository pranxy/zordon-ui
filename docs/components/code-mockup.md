# Code Mockup

**Component ID:** MCK-02  
**Entry point:** `@pranxy/zordon-ui/code-mockup`

`ZdCodeMockup` applies daisyUI's Code Mockup class while preserving native code semantics.

```html
<section zdCodeMockup aria-label="Install command">
  <pre data-prefix="$"><code>npm install @pranxy/zordon-ui</code></pre>
</section>
```

Use native `pre`, `code`, and optional `data-prefix` values for line prompts or numbers. Syntax highlighting, language metadata, copy controls, feedback, scrolling policy, status colors, and custom styling remain consumer-owned. This package intentionally has no highlighter or clipboard dependency.

## Source

- [daisyUI Mockup documentation](https://daisyui.com/components/mockup/)
