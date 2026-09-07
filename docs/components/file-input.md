# File Input

**Component ID:** INP-04  
**Entry point:** `@pranxy/zordon-ui/file-input`

`ZdFileInput` applies daisyUI File Input styling to a real `<input type="file">`.

```html
<label for="profile-images">
  Profile images
  <input
    id="profile-images"
    type="file"
    zdFileInput
    color="primary"
    size="lg"
    accept="image/png,image/jpeg"
    multiple
  />
</label>
```

## API

- `color`: `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, or `error`.
- `size`: `xs`, `sm`, `md`, `lg`, or `xl`.
- `style`: `ghost`.

The directive always applies `file-input`. It does not replace browser file selection, modify the
selected `FileList`, or create hidden inputs.

## Native ownership and security

Keep `accept`, `capture`, `multiple`, `required`, `disabled`, `name`, and `form` on the native
input. Browsers intentionally forbid assigning a file value programmatically; applications must
only receive files from a user gesture or test fixture. Native constraint validation, labels,
keyboard behavior, focus, and multipart submission remain intact.

Drag/drop intake, previews, object-URL lifecycle, MIME/count/size validation, remove/clear UI, and
upload progress are consumer-owned compositions. They require explicit security, cleanup, and
transport policies, so this entry point does not provide them. Do not use `ControlValueAccessor` or
Signal Forms to try to restore a selected file value: selected files are browser-owned ephemeral
state. A consumer can observe the native `change` event and manage its own upload model.

## Accessibility

Give the input a visible `<label for>` or wrap it in a label. Preserve its native file-input role
and do not add an ARIA role. Describe accepted formats or limits with consumer content and connect
it using `aria-describedby` when useful.

## Source

- [daisyUI File Input documentation](https://daisyui.com/components/file-input/)
