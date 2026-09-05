# Footer

**Component ID:** LYT-03  
**Entry point:** `@pranxy/zordon-ui/footer`

`ZdFooter` adds daisyUI Footer styling to a consumer-chosen native host. Use a `<footer>` landmark when the content represents page or section footer content, and native `<nav>`, `<aside>`, headings, links, and forms for its contents.

```html
<footer zdFooter direction="horizontal" center aria-label="Site footer">
  <nav aria-label="Company">
    <h2 zdFooterTitle>Company</h2>
    <a href="/about">About</a>
  </nav>
</footer>
```

`direction` accepts `horizontal` and `vertical`; `center` adds `footer-center`. Omit both for daisyUI's default vertical layout. Responsive direction changes, colors, spacing, logo/social/newsletter content, navigation semantics, form handling, interaction, and accessibility labels are consumer-owned.

## Source

- [daisyUI Footer documentation](https://daisyui.com/components/footer/)
