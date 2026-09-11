# OTP

**Component ID:** INP-15  
**Entry point:** `@pranxy/zordon-ui/otp`

`ZdOtp` renders an accessible sequence of one-character inputs with numeric input mode by default. It supports Reactive Forms through `ControlValueAccessor`, distributes pasted values, moves focus after entry, and emits `completed` when every cell has a permitted character.

```html
<zd-otp length="6" ariaLabel="Verification code" />
```

Consumers own the verification request, error and retry policy, expiry countdown, masking policy, and password-manager testing.
