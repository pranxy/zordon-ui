# Avatar

**Component ID:** DSP-02  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/avatar`

Avatar will apply daisyUI framing and presence styling to consumer markup. It will not fetch images, infer alt text, generate initials, manage image loading/failure, or turn an avatar into a button/link.

## daisyUI 5.7.16 inventory

| Candidate | Planned native host | Contract |
| --- | --- | --- |
| `avatar` | `[zdAvatar]` on a consumer container | Requires consumer child `<div>`; image stays native `<img>`. |
| `avatar-placeholder` | `placeholder` appearance input | Consumer supplies initials, icon, or fallback text in the child container. |
| `avatar-online`, `avatar-offline` | `presence` input | Decorative upstream dot only; real status text belongs to a Status composition. |
| `avatar-group` | `[zdAvatarGroup]` on a native container | Visual grouping only; consumer owns list/group semantics and overflow content. |

The source provides no Avatar size, mask, ring, custom presence, loading, or selectable modifier. Consumers compose Tailwind sizing, Mask, rings, `loading="lazy"`, and native button/link hosts deliberately. Upstream `--color-*` tokens are theme inputs, not `--zd-*` hooks.

## Native semantics and API boundary

`ZdAvatar` is noninteractive by default. Consumers supply complete `alt` text for meaningful images and empty `alt` for decorative images; they also own image fallback/error UI. `ZdAvatarGroup` does not claim a list, toolbar, or status role.

```html
<div zdAvatar presence="online">
  <div><img alt="Avery Chen" src="/avery.jpg" /></div>
</div>

<div zdAvatar placeholder>
  <div class="bg-neutral text-neutral-content"><span>AC</span></div>
</div>
```

Planned inputs are `placeholder?: boolean` and `presence?: 'online' | 'offline' | undefined`; no defaults, models, outputs, Forms, Angular Aria, generated IDs, or browser-only work are needed. Invalid presence values reject rather than generate uncompiled classes.

## Evidence before Preview

Verify all candidates/prefixes and consumer class/style composition; meaningful/decorative image semantics; presence decoration versus Status text; image lazy/error consumer ownership; SSR/hydration; axe/manual AT; forced colors, RTL, responsive sizing, themes; and visual group/placeholder/presence boundaries.

## Sources

- [daisyUI Avatar documentation](https://daisyui.com/components/avatar/)
- [HTML image element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)
