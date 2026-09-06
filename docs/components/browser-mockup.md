# Browser Mockup

**Component ID:** MCK-01  
**Entry point:** `@pranxy/zordon-ui/browser-mockup`

`ZdBrowserMockup` and `ZdBrowserMockupToolbar` apply daisyUI's Browser Mockup classes to consumer-owned native elements.

```html
<section zdBrowserMockup aria-label="Product preview">
  <div zdBrowserMockupToolbar class="input">app.example</div>
  <main class="bg-base-200 p-4">Your preview content</main>
</section>
```

The directives do not impose an element, ARIA role, toolbar control model, or preview type. Choose the host semantics, accessible name, toolbar controls, URL display, and whether the preview contains ordinary content or an iframe. Styling, sizing, colours, borders, and responsive layout remain fully customisable through normal classes and CSS.

## Source

- [daisyUI Browser Mockup documentation](https://daisyui.com/components/mockup/)
