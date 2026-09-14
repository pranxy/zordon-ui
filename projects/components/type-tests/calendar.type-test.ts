import type { InputSignal, OutputEmitterRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import type {
  ZdCalendar,
  ZdCalendarMode,
  ZdCalendarRange,
  ZdCalendarValue,
} from '@pranxy/zordon-ui/calendar';

declare const calendar: ZdCalendar;
const mode: InputSignal<ZdCalendarMode> = calendar.mode;
const changes: OutputEmitterRef<ZdCalendarValue> = calendar.valueChange;
const range: ZdCalendarRange = { start: '2026-09-14', end: null };
const control = new FormControl<ZdCalendarValue>(range);
calendar.writeValue(control.value);
// @ts-expect-error Calendar values are civil dates, not Date instances.
calendar.writeValue(new Date());
// @ts-expect-error Range endpoints use date strings.
const invalidRange: ZdCalendarRange = { start: 20260914, end: null };
// @ts-expect-error Selection mode is intentionally closed.
const invalidMode: ZdCalendarMode = 'week';
void [mode, changes, invalidRange, invalidMode];
