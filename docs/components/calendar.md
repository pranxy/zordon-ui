# Calendar

> **Maturity:** Preview — manual accessibility review pending  
> **Entry point:** `@pranxy/zordon-ui/calendar` · **Selector:** `zd-calendar`  
> **Verified:** Angular 21.2.19, Aria/CDK 21.2.14, daisyUI 5.7.16  
> **Matrix row:** INP-01 · Reviewed 2026-09-14

Calendar provides inline or popup Gregorian date selection with single, multiple, and contiguous
range modes. Angular Aria owns grid navigation. Native day buttons expose selection through
`aria-pressed`; Aria's generic selection is disabled so its cell bookkeeping cannot change the
date value. Native `input[type=date]` remains suitable for simpler date fields.

This delivery targets Angular 21 at the user's request. Angular 22 and the Angular 21.0 floor
are unverified. The required Aria peer is pinned to 21.2.14 and requires exact matching CDK.

## Setup and examples

```ts
import { ZdCalendar, type ZdCalendarValue } from '@pranxy/zordon-ui/calendar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Add ZdCalendar and ReactiveFormsModule to your standalone component's imports.
readonly arrival = new FormControl<ZdCalendarValue>('2026-09-14');
```

```html
<zd-calendar
  month="2026-09-01"
  ariaLabel="Arrival date"
  min="2026-09-01"
  max="2027-12-31"
  [formControl]="arrival"
/>
<zd-calendar month="2026-09-01" ariaLabel="Stay" mode="range" [(value)]="stay" />
<zd-calendar month="2026-09-01" ariaLabel="Departure date" presentation="popup" />
```

Use identical initial month, value, locale, week start and optional `today` on server and client.
Dates are `YYYY-MM-DD` civil dates, never timestamps. Convert business instants to civil dates
before binding; Calendar does not read the clock or convert through the machine's timezone.

## API

| Input                              | Type / default                              | Behavior                                                                                                       |
| ---------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `month`                            | Required `string`                           | Valid date; its month is shown initially and when the input changes.                                           |
| `ariaLabel`                        | Required `string`                           | Accessible grid/dialog name; provide meaningful text.                                                          |
| `value`                            | `ZdCalendarValue`, null                     | Single: date/null. Multiple: readonly date array. Range: `{ start, end }`/null; nullable end means incomplete. |
| `mode`                             | `ZdCalendarMode`, `single`                  | `single`, `multiple`, `range`; changing mode does not rewrite programmatic values.                             |
| `min`, `max`                       | `string \| null`, null                      | Inclusive selection bounds; malformed/reversed bounds throw. Navigation may show unavailable months.           |
| `dateDisabled`                     | Optional `(date: string) => boolean`        | Pure synchronous availability predicate.                                                                       |
| `disabled`, `readOnly`, `required` | Boolean-coerced, false                      | Forms disabled state takes precedence. Readonly permits navigation; required participates in Forms validation. |
| `locale`                           | Injected `LOCALE_ID`                        | Localizes Gregorian day/month names.                                                                           |
| `weekStartsOn`                     | Number-coerced, 0                           | Integer 0 (Sunday) through 6 (Saturday); invalid values throw.                                                 |
| `today`                            | `string \| null`, null                      | Explicit current-day annotation; does not select.                                                              |
| `ariaDescribedby`                  | `string \| null`, null                      | Consumer help/error IDs associated with the grid.                                                              |
| `dayTemplate`                      | `TemplateRef<ZdCalendarDayContext> \| null` | Optional noninteractive day content; the library retains button semantics and date labels.                     |
| `presentation`                     | `inline` or `popup`, `inline`               | Popup adds a trigger, native dialog and close action.                                                          |
| `open`                             | Boolean-coerced, false                      | Initial/controlled popup state, applied after browser rendering.                                               |

`valueChange`, `monthChange`, and `openChange` emit accepted user transitions and support Angular
two-way binding. Programmatic input/Forms writes do not emit value changes. Single mode replaces
the selected date; activating it again retains selection. Multiple mode toggles membership and
emits new sorted arrays. Range mode restarts after completion, sorts reverse endpoints and rejects
intervals containing unavailable dates. Do not mutate bound collections in place or bind `value`
and a Forms directive simultaneously.

The component implements standard `ControlValueAccessor` and `Validator` hooks. Reset clears the
view. Focus leaving the component marks it touched; popup closure also completes the interaction.
Consumers own error messages, additional/async validators and pending/submitted presentation.
Validation keys are `required`, `calendarMode`, `calendarDate`, `calendarUnavailable`, and
`calendarRangeIncomplete`. Incomplete optional ranges are allowed. Unavailable programmatic
values remain visible and invalid rather than being silently clamped.

## Adapter, localization, and custom content

`ZdCalendarDateAdapter` is root-provided and replaceable through `useClass`. Its public methods
are `isValid`, `addDays`, `addMonths`, `startOfMonth`, `weekday`, and `format`. Gregorian years
0001–9999 are supported. Arithmetic returns null beyond those limits; malformed dates throw.
Month arithmetic clamps month-end dates. Offsets are intended to be integer counts. The default
formatter forces Gregorian/UTC interpretation independently of the machine timezone.

Provide a complete `ZdCalendarStrings` object using `ZD_CALENDAR_STRINGS` to translate
`previousMonth`, `nextMonth`, `month`, `year`, `chooseDate`, `close`, and `rangeInstruction`.
Providers may be application- or consumer-component-scoped. Experimental Signal Forms and
Angular Aria declarations do not appear in the public contract.

```html
<zd-calendar month="2026-09-01" ariaLabel="Available dates" [dayTemplate]="day" />
<ng-template #day let-date let-today="today">
  {{ +date.slice(8) }} <span aria-hidden="true">{{ today ? '·' : '' }}</span>
</ng-template>
```

One optional day template receives `$implicit` (date), `selected`, `disabled` (date availability),
and `today`. Nested interactive content is unsupported because the day button owns activation.

## Interaction, SSR, and accessibility

Aria owns roving focus, arrows, Home/End, and live CDK directionality. Focus does not select;
Enter/Space activate native day buttons. Unavailable days remain discoverable but cannot change
the value. PageUp/PageDown move the focused date by a month; Shift adds year paging. Month-end
paging clamps the date. A private date-specific handler bridges the outer edge of the rendered
six-week grid without replacing Aria's within-grid navigation. Labelled native month/year
controls also permit direct navigation.

For scoped or dynamically changing RTL, import CDK `Dir` and bind `[dir]` on a surrounding
element, as the browser fixture demonstrates. A native `dir` attribute alone does not update
the injected CDK directionality used for keyboard navigation.

Popup opening and focus changes run after browser rendering. Native dialog supplies modality
and focus containment on the supported browser baseline. Escape and close restore trigger focus.
Single selection closes the popup; multiple/range leaves it open. Environments without dialog
methods get an explicitly nonmodal open-dialog fallback with a close action. Modal trapping is
not claimed for that fallback.

Server HTML includes date labels, pressed/current/unavailable states and deterministic day IDs.
Dialogs are initially closed on the server. Keep `APP_ID` and initial input ordering consistent
across hydration. Consumers supply meaningful labels and help/error IDs. Manual screen-reader,
physical-mobile, contrast, forced-colors and zoom/reflow maturity gates remain open in
[the accessibility record](calendar-accessibility-review.md).

## Styling, migration, and evidence

The complete daisyUI candidate inventory is `btn`, `btn-ghost`, `btn-primary`, composed through
`ZdClassNames`. Register exact prefixed candidates in Tailwind when prefixes are configured.
Consumer host classes, native styles, ARIA/data attributes and inherited theme scopes are
preserved. `--zd-calendar-day-size` overrides desktop day size; narrow screens use 2rem days for
reflow. Layout uses documented daisyUI theme tokens and introduces no motion.

Under reduced motion, Calendar suppresses the inherited daisyUI button transitions and transforms.

daisyUI Calendar CSS targets Cally, React Day Picker or Vanilla Calendar Pro anatomy. Their
`cally`, `react-day-picker` and `vc` classes are not applied to unrelated Angular markup. There
is no additional calendar runtime and no promise concerning those libraries' internal selectors.
Do not target Aria internals or generated IDs for customization.

This new preview entry point has no legacy Calendar API migration. Applications adopting it must
supply civil-date strings, an explicit visible month and an accessible name. See the
[visual matrix](calendar-visual-matrix.md) and [delivery record](../plans/phase-4-calendar-progress.md)
for checks, evidence and remaining gates.

Sources: [Angular Aria Grid](https://angular.dev/guide/aria/grid),
[daisyUI Calendar](https://daisyui.com/components/calendar/), and installed 21.2.14/5.7.16 sources.
