# Validator

**Component ID:** INP-14  
**Entry point:** `@pranxy/zordon-ui/validator`

`ZdValidator` styles a native input, textarea, or select, and `ZdValidatorHint` styles consumer-provided guidance or error text. Native constraints and Angular Forms remain the source of truth for valid, invalid, pending, touched, dirty, and submitted state.

```html
<label for="account-code">Account code</label>
<input id="account-code" zdValidator required aria-describedby="account-code-hint" />
<p id="account-code-hint" zdValidatorHint>Enter an account code.</p>
```

The directives do not create validation messages, change validity, submit forms, or add ARIA relationships. Consumers provide labels, constraints, message content, message visibility policy, and any live-region behavior.
