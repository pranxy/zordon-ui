# ADR 0005: Angular Forms integration

Status: Accepted  
Date: 2026-08-07

## Context

The library must work reliably in production forms while Angular's Signal Forms API continues to evolve.

## Decision

- Native form controls remain native elements enhanced by directives wherever possible.
- Value-bearing composite controls implement ControlValueAccessor and the relevant validation interfaces.
- Typed Reactive Forms are the stable, required v1 integration target.
- Template-driven forms continue to work through ControlValueAccessor but do not receive separate library abstractions.
- Signal inputs and models remain the component state API independent of Angular Forms.
- Signal Forms support is an optional adapter entry point until Angular marks that API stable. Signal Forms types do not leak into the core public API.
- Standardize disabled, read-only, required, touched, dirty, pending, valid, invalid, and submitted-state styling.
- Angular Forms is authoritative when it sets the disabled state through a value accessor.
- Validation messages are consumer-owned content. The library provides association, display policy, and common state plumbing rather than translating validation keys into fixed English strings.
- All form components must support reset, programmatic writes, async validation, dynamic form arrays, and destruction/recreation tests.

## Consequences

- Core form compatibility remains stable even if Signal Forms changes.
- Native controls need less custom value-accessor code and preserve browser functionality.
- Advanced controls must explicitly document their value type, equality policy, and serialization behavior.
