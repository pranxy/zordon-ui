import { Injectable, InjectionToken } from '@angular/core';

/** A date-only Gregorian range. A null end represents an unfinished selection. */
export interface ZdCalendarRange {
  readonly start: string;
  readonly end: string | null;
}

/** Civil dates are YYYY-MM-DD strings, never local or UTC timestamps. */
export type ZdCalendarValue = string | readonly string[] | ZdCalendarRange | null;
export type ZdCalendarMode = 'single' | 'multiple' | 'range';

function dateObject(value: string): Date {
  const date = new Date(0);
  date.setUTCFullYear(
    Number(value.slice(0, 4)),
    Number(value.slice(5, 7)) - 1,
    Number(value.slice(8, 10)),
  );
  return date;
}

function serialize(date: Date): string | null {
  const year = date.getUTCFullYear();
  return year >= 1 && year <= 9999 ? date.toISOString().slice(0, 10) : null;
}

/** Replace through Angular DI to customize formatting while preserving civil-date semantics. */
@Injectable({ providedIn: 'root' })
export class ZdCalendarDateAdapter {
  isValid(value: unknown): value is string {
    return (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      serialize(dateObject(value)) === value
    );
  }

  /** Throws on malformed input; returns null if arithmetic exceeds years 0001–9999. */
  addDays(value: string, days: number): string | null {
    const date = this.parse(value);
    date.setUTCDate(date.getUTCDate() + days);
    return serialize(date);
  }

  /** Month arithmetic clamps the day to the last day of the destination month. */
  addMonths(value: string, months: number): string | null {
    const date = this.parse(value);
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + months);
    const end = new Date(date);
    end.setUTCMonth(end.getUTCMonth() + 1, 0);
    date.setUTCDate(Math.min(day, end.getUTCDate()));
    return serialize(date);
  }

  startOfMonth(value: string): string {
    this.parse(value);
    return `${value.slice(0, 7)}-01`;
  }

  weekday(value: string): number {
    return this.parse(value).getUTCDay();
  }

  format(value: string, locale: string, options: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale, {
      ...options,
      calendar: 'gregory',
      timeZone: 'UTC',
    }).format(this.parse(value));
  }

  private parse(value: string): Date {
    if (!this.isValid(value)) throw new RangeError(`Invalid Calendar civil date: ${String(value)}`);
    return dateObject(value);
  }
}

export interface ZdCalendarStrings {
  readonly previousMonth: string;
  readonly nextMonth: string;
  readonly month: string;
  readonly year: string;
  readonly chooseDate: string;
  readonly close: string;
  readonly rangeInstruction: string;
}

/** Provide a complete translated object at application or component scope. */
export const ZD_CALENDAR_STRINGS = new InjectionToken<ZdCalendarStrings>('ZD_CALENDAR_STRINGS', {
  providedIn: 'root',
  factory: () => ({
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    month: 'Month',
    year: 'Year',
    chooseDate: 'Choose date',
    close: 'Close calendar',
    rangeInstruction: 'Choose the end date.',
  }),
});
