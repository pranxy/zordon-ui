# Text Rotate

**Component ID:** DSP-18  
**Entry point:** `@pranxy/zordon-ui/text-rotate`

daisyUI Text Rotate is a CSS wrapper for up to six text lines. It loops on a ten-second animation by default and pauses on hover. `ZdTextRotate` adds only the documented `text-rotate` class; consumers supply the required nested text markup and may use Tailwind utilities for duration, alignment, line height, and appearance.

```html
<span zdTextRotate>
  <span><span>Design</span><span>Develop</span><span>Deploy</span></span>
</span>
```

This package does not create timers, select an active word, expose pause/play controls, alter the CSS `--items` variable, add a live region, or handle reduced motion. Those choices change timing and announcement behavior and require a separately approved interaction contract. Consumers own readable fallback text and any status announcement policy.

## Source

- [daisyUI Text Rotate documentation](https://daisyui.com/components/text-rotate/)
