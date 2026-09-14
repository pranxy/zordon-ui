import { NgTemplateOutlet } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { Grid, GridCell, GridCellWidget, GridRow } from '@angular/aria/grid';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  LOCALE_ID,
  numberAttribute,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ZdClassNames, ZdIdGenerator } from '@pranxy/zordon-ui';
import {
  ZdCalendarDateAdapter,
  ZD_CALENDAR_STRINGS,
  type ZdCalendarMode,
  type ZdCalendarRange,
  type ZdCalendarValue,
  type ZdCalendarStrings,
} from './calendar-date-adapter';

export interface ZdCalendarDayContext {
  readonly $implicit: string;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly today: boolean;
}

function noop(): void {}

function calendarAccessor(): ZdCalendar {
  return inject(ZdCalendar);
}

@Component({
  selector: 'zd-calendar',
  imports: [NgTemplateOutlet, Grid, GridRow, GridCell, GridCellWidget],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useFactory: calendarAccessor, multi: true },
    { provide: NG_VALIDATORS, useFactory: calendarAccessor, multi: true },
  ],
  host: {
    'class': 'zd-calendar',
    '(focusout)': 'onFocusOut($event)',
  },
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class ZdCalendar implements ControlValueAccessor, Validator {
  readonly month = input.required<string>();
  readonly value = input<ZdCalendarValue>(null);
  readonly mode = input<ZdCalendarMode>('single');
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  readonly dateDisabled = input<((date: string) => boolean) | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly locale = input(inject(LOCALE_ID));
  readonly weekStartsOn = input(0, { transform: numberAttribute });
  readonly today = input<string | null>(null);
  readonly ariaLabel = input.required<string>();
  readonly ariaDescribedby = input<string | null>(null);
  readonly dayTemplate = input<TemplateRef<ZdCalendarDayContext> | null>(null);
  readonly presentation = input<'inline' | 'popup'>('inline');
  readonly open = input(false, { transform: booleanAttribute });
  readonly valueChange = output<ZdCalendarValue>();
  readonly monthChange = output<string>();
  readonly openChange = output<boolean>();

  private readonly adapter = inject(ZdCalendarDateAdapter);
  private readonly direction = inject(Directionality);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly names = inject(ZdClassNames);
  private readonly formDisabled = signal<boolean | undefined>(undefined);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly requestedFocus = signal<string | null>(null);
  private onChange: (value: ZdCalendarValue) => void = noop;
  private onTouched: () => void = noop;
  private onValidationChange: () => void = noop;

  protected readonly strings: ZdCalendarStrings = inject(ZD_CALENDAR_STRINGS);
  protected readonly id = inject(ZdIdGenerator).next('calendar');
  protected readonly selection = linkedSignal(() => this.value());
  protected readonly visibleMonth = linkedSignal(() => this.adapter.startOfMonth(this.month()));
  protected readonly opened = linkedSignal(() => this.open());
  protected readonly browserReady = signal(false);
  protected readonly isDisabled = computed(() => this.formDisabled() ?? this.disabled());
  protected readonly buttonClass = this.names.daisyUi('btn');
  protected readonly ghostClass = this.names.daisyUi('btn-ghost');
  protected readonly selectedClass = this.names.daisyUi('btn-primary');
  protected readonly monthLabel = computed(() =>
    this.adapter.format(this.visibleMonth(), this.locale(), { month: 'long', year: 'numeric' }),
  );
  protected readonly monthNames = computed(() =>
    Array.from({ length: 12 }, (_, index) =>
      this.adapter.format(`2000-${String(index + 1).padStart(2, '0')}-01`, this.locale(), {
        month: 'long',
      }),
    ),
  );
  protected readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) => {
      const date = this.adapter.addDays('2026-09-06', (index + this.checkedWeekStart()) % 7)!;
      return {
        short: this.adapter.format(date, this.locale(), { weekday: 'short' }),
        long: this.adapter.format(date, this.locale(), { weekday: 'long' }),
      };
    }),
  );
  protected readonly weeks = computed(() => {
    this.checkBounds();
    const start = this.visibleMonth();
    const offset = (this.adapter.weekday(start) - this.checkedWeekStart() + 7) % 7;
    const cells = Array.from({ length: 42 }, (_, index) =>
      this.adapter.addDays(start, index - offset),
    );
    return Array.from({ length: 6 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  });
  protected readonly rangePending = computed(
    () =>
      this.mode() === 'range' &&
      this.isRange(this.selection()) &&
      (this.selection() as ZdCalendarRange).end === null,
  );

  private readonly validationSync = effect(() => {
    this.min();
    this.max();
    this.dateDisabled();
    this.required();
    this.mode();
    this.onValidationChange();
  });
  private readonly renderSync = afterRenderEffect(() => {
    this.browserReady.set(true);
    const dialog = this.dialog()?.nativeElement;
    if (dialog) {
      if (this.opened() && !this.isDisabled()) {
        if (!dialog.open) {
          if (typeof dialog.showModal === 'function') dialog.showModal();
          else dialog.setAttribute('open', '');
          dialog.querySelector<HTMLButtonElement>('[aria-pressed="true"], [data-date]')?.focus();
        }
      } else if (dialog.open) {
        if (typeof dialog.close === 'function') dialog.close();
        else dialog.removeAttribute('open');
        this.trigger()?.nativeElement.focus();
      }
    }
    const date = this.requestedFocus();
    if (date) {
      this.host.nativeElement.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus();
      this.requestedFocus.set(null);
    }
  });

  writeValue(value: ZdCalendarValue): void {
    this.selection.set(value);
  }
  registerOnChange(callback: (value: ZdCalendarValue) => void): void {
    this.onChange = callback;
  }
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
  registerOnValidatorChange(callback: () => void): void {
    this.onValidationChange = callback;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value: unknown = control.value;
    if (value === null || (Array.isArray(value) && value.length === 0))
      return this.required() ? { required: true } : null;
    let dates: readonly unknown[];
    if (this.mode() === 'single' && typeof value === 'string') dates = [value];
    else if (this.mode() === 'multiple' && Array.isArray(value)) dates = value;
    else if (this.mode() === 'range' && this.isRange(value)) {
      if (value.end === null)
        return this.required() ? { calendarRangeIncomplete: true } : this.validDates([value.start]);
      if (
        !this.adapter.isValid(value.start) ||
        !this.adapter.isValid(value.end) ||
        value.start > value.end
      )
        return { calendarDate: true };
      return this.rangeAllowed(value.start, value.end) ? null : { calendarUnavailable: true };
    } else return { calendarMode: true };
    return this.validDates(dates);
  }

  protected unavailable(date: string): boolean {
    return (
      (this.min() !== null && date < this.min()!) ||
      (this.max() !== null && date > this.max()!) ||
      Boolean(this.dateDisabled()?.(date))
    );
  }

  protected selected(date: string): boolean {
    const value = this.selection();
    if (typeof value === 'string') return value === date;
    if (this.isRange(value)) return date >= value.start && date <= (value.end ?? value.start);
    return Array.isArray(value) && value.includes(date);
  }

  protected dateLabel(date: string): string {
    return this.adapter.format(date, this.locale(), { dateStyle: 'full' });
  }
  protected dayLabel(date: string): string {
    return this.adapter.format(date, this.locale(), { day: 'numeric' });
  }
  protected dayContext(date: string): ZdCalendarDayContext {
    return {
      $implicit: date,
      selected: this.selected(date),
      disabled: this.unavailable(date),
      today: this.today() === date,
    };
  }

  protected choose(date: string): void {
    if (this.isDisabled() || this.readOnly() || this.unavailable(date)) return;
    const previous = this.selection();
    let next: ZdCalendarValue = date;
    if (this.mode() === 'multiple') {
      const values = Array.isArray(previous) ? previous : [];
      next = Object.freeze(
        values.includes(date) ? values.filter(value => value !== date) : [...values, date].sort(),
      );
    } else if (this.mode() === 'range') {
      if (this.isRange(previous) && previous.end === null && this.adapter.isValid(previous.start)) {
        const [start, end] = [previous.start, date].sort();
        if (!this.rangeAllowed(start, end)) return;
        next = Object.freeze({ start, end });
      } else next = Object.freeze({ start: date, end: null });
    }
    this.selection.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
    if (this.presentation() === 'popup' && this.mode() === 'single') this.setOpen(false);
  }

  protected canNavigate(months: number): boolean {
    const next = this.adapter.addMonths(this.visibleMonth(), months);
    return !this.isDisabled() && next !== null;
  }

  protected navigate(months: number): void {
    if (this.canNavigate(months))
      this.setMonth(this.adapter.addMonths(this.visibleMonth(), months)!);
  }

  protected changeMonth(month: string, year: string): void {
    const date = `${year.padStart(4, '0')}-${String(Number(month) + 1).padStart(2, '0')}-01`;
    if (!this.isDisabled() && this.adapter.isValid(date)) this.setMonth(date);
  }

  protected onDateKeydown(event: KeyboardEvent, date: string): void {
    if (this.isDisabled() || event.altKey || event.ctrlKey || event.metaKey) return;
    let next: string | null = null;
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      next = this.adapter.addMonths(
        date,
        (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1),
      );
    } else {
      const rtl = this.direction.value === 'rtl';
      const offsets: Record<string, number> = {
        ArrowLeft: rtl ? 1 : -1,
        ArrowRight: rtl ? -1 : 1,
        ArrowUp: -7,
        ArrowDown: 7,
      };
      const offset = offsets[event.key];
      if (offset === undefined) return;
      const candidate = this.adapter.addDays(date, offset);
      if (candidate && !this.weeks().flat().includes(candidate)) next = candidate;
      else return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (next) {
      this.setMonth(next);
      this.requestedFocus.set(next);
    }
  }

  protected setOpen(open: boolean): void {
    if (open && this.isDisabled()) return;
    if (this.opened() === open) return;
    this.opened.set(open);
    this.openChange.emit(open);
    if (!open) this.onTouched();
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) this.onTouched();
  }

  private setMonth(date: string): void {
    const month = this.adapter.startOfMonth(date);
    if (month === this.visibleMonth()) return;
    this.visibleMonth.set(month);
    this.monthChange.emit(month);
  }

  private validDates(dates: readonly unknown[]): ValidationErrors | null {
    if (!dates.every(date => this.adapter.isValid(date))) return { calendarDate: true };
    return dates.some(date => this.unavailable(date as string))
      ? { calendarUnavailable: true }
      : null;
  }

  private rangeAllowed(start: string, end: string): boolean {
    if (this.unavailable(start) || this.unavailable(end)) return false;
    if (this.dateDisabled()) {
      for (
        let date = this.adapter.addDays(start, 1);
        date && date < end;
        date = this.adapter.addDays(date, 1)
      ) {
        if (this.unavailable(date)) return false;
      }
    }
    return true;
  }

  private isRange(value: unknown): value is ZdCalendarRange {
    return value !== null && typeof value === 'object' && 'start' in value && 'end' in value;
  }

  private checkedWeekStart(): number {
    const day = this.weekStartsOn();
    if (!Number.isInteger(day) || day < 0 || day > 6)
      throw new RangeError('Calendar weekStartsOn must be an integer from 0 to 6.');
    return day;
  }

  private checkBounds(): void {
    const min = this.min();
    const max = this.max();
    if (
      (min !== null && !this.adapter.isValid(min)) ||
      (max !== null && !this.adapter.isValid(max)) ||
      (min !== null && max !== null && min > max)
    )
      throw new RangeError('Calendar requires valid, ordered min/max dates.');
  }
}
