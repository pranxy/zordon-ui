# Rating

**Entry point:** `@pranxy/zordon-ui/rating`

`ZdRating` styles a native radio group with daisyUI’s `rating` classes. It supports the documented sizes and optional half-width layout. `ZdRatingHidden` adds daisyUI’s clear-radio class.

```html
<fieldset>
  <legend>Service rating</legend>
  <div zdRating size="lg">
    <input zdRatingHidden type="radio" name="rating" value="0" aria-label="Clear rating" />
    <input type="radio" name="rating" value="1" aria-label="1 star" />
    <input type="radio" name="rating" value="2" aria-label="2 stars" />
  </div>
</fieldset>
```

The browser owns radio selection, arrow-key navigation, validation, disabled state, forms, and serialization. Consumers own the number of options, labels, masks/icons, colours, clear policy, formatting, and any hover-preview or read-only behavior.

`half` adds `rating-half`; consumers provide paired half masks using the existing Mask directives.
