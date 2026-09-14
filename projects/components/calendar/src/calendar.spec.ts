import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdCalendar } from './calendar';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { Directionality } from '@angular/cdk/bidi';
import { type ZdCalendarValue } from './calendar-date-adapter';

@Component({
  imports: [ZdCalendar, ReactiveFormsModule],
  template: '<zd-calendar month="2026-09-01" ariaLabel="Arrival" [formControl]="control" />',
})
class FormHost {
  readonly control = new FormControl<ZdCalendarValue>('2026-09-14');
}

@Component({
  imports: [ZdCalendar],
  template:
    '<zd-calendar month="2026-09-01" ariaLabel="Custom" [dayTemplate]="day" today="2026-09-14" /><ng-template #day let-date let-today="today">{{ date }} {{ today ? "Today" : "" }}</ng-template>',
})
class CustomHost {}

@Component({
  imports: [ZdCalendar, ReactiveFormsModule],
  template: '<zd-calendar month="2026-09-01" ariaLabel="Booking" [formControl]="control" />',
})
class BlurHost {
  readonly control = new FormControl<ZdCalendarValue>('2026-09-14', {
    updateOn: 'blur',
    asyncValidators: control =>
      Promise.resolve(control.value === '2026-09-16' ? { booked: true } : null),
  });
}

@Component({
  imports: [ZdCalendar, ReactiveFormsModule],
  template:
    '<button (click)="controls.removeAt(0)">Remove</button><button (click)="controls.clear()">Clear</button><button (click)="add()">Add</button>@for (control of controls.controls; track control) { <zd-calendar month="2026-09-01" ariaLabel="Booking" [formControl]="control" /> }',
})
class ArrayHost {
  readonly controls = new FormArray([
    new FormControl<ZdCalendarValue>('2026-09-14'),
    new FormControl<ZdCalendarValue>('2026-09-18'),
  ]);
  add(): void {
    this.controls.push(new FormControl<ZdCalendarValue>('2026-09-20'));
  }
}

describe('Calendar', () => {
  async function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ZdCalendar);
    fixture.componentRef.setInput('month', '2026-09-01');
    fixture.componentRef.setInput('ariaLabel', 'Arrival');
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const day = (date: string) =>
      element.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)!;
    return { fixture, element, day, component: fixture.componentInstance };
  }

  it('supports updateOn blur and consumer async validation without early model writes', async () => {
    const fixture = TestBed.createComponent(BlurHost);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const day = element.querySelector<HTMLButtonElement>('[data-date="2026-09-16"]')!;
    day.click();
    await fixture.whenStable();
    expect(day.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.componentInstance.control.value).toBe('2026-09-14');
    day.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('2026-09-16');
    expect(fixture.componentInstance.control.errors).toEqual({ booked: true });
  });

  it('isolates controls and IDs across dynamic form-array removal and recreation', async () => {
    const fixture = TestBed.createComponent(ArrayHost);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const ids = Array.from(element.querySelectorAll('[data-date]'), day => day.id);
    expect(new Set(ids).size).toBe(ids.length);
    element.querySelectorAll<HTMLButtonElement>('button')[0].click();
    await fixture.whenStable();
    expect(element.querySelectorAll('zd-calendar')).toHaveLength(1);
    expect(element.querySelector('[aria-pressed="true"]')?.getAttribute('data-date')).toBe(
      '2026-09-18',
    );
    element.querySelectorAll<HTMLButtonElement>('button')[1].click();
    await fixture.whenStable();
    expect(element.querySelectorAll('zd-calendar')).toHaveLength(0);
    element.querySelectorAll<HTMLButtonElement>('button')[2].click();
    await fixture.whenStable();
    expect(element.querySelector('[aria-pressed="true"]')?.getAttribute('data-date')).toBe(
      '2026-09-20',
    );
  });

  it('renders a labelled date grid, controlled state, and native activation', async () => {
    const { fixture, element, day, component } = await create({
      value: '2026-09-14',
      today: '2026-09-14',
    });
    const changes: ZdCalendarValue[] = [];
    component.valueChange.subscribe(value => changes.push(value));
    expect(element.querySelector('table')!.getAttribute('aria-label')).toBe('Arrival');
    expect(element.querySelectorAll('[data-date]')).toHaveLength(42);
    expect(day('2026-09-14').getAttribute('aria-pressed')).toBe('true');
    expect(day('2026-09-14').getAttribute('aria-current')).toBe('date');
    day('2026-09-16').click();
    await fixture.whenStable();
    expect(changes).toEqual(['2026-09-16']);
    expect(day('2026-09-16').getAttribute('aria-pressed')).toBe('true');
    fixture.componentRef.setInput('value', '2026-09-18');
    await fixture.whenStable();
    expect(day('2026-09-18').getAttribute('aria-pressed')).toBe('true');
    expect(changes).toHaveLength(1);
  });

  it('supports immutable multiple and reverse range selection without crossing unavailable dates', async () => {
    const { fixture, day, component } = await create({ mode: 'multiple' });
    const changes: ZdCalendarValue[] = [];
    component.valueChange.subscribe(value => changes.push(value));
    day('2026-09-18').click();
    day('2026-09-14').click();
    day('2026-09-18').click();
    await fixture.whenStable();
    expect(changes).toEqual([['2026-09-18'], ['2026-09-14', '2026-09-18'], ['2026-09-14']]);
    fixture.componentRef.setInput('mode', 'range');
    fixture.componentRef.setInput('value', null);
    await fixture.whenStable();
    day('2026-09-18').click();
    day('2026-09-14').click();
    await fixture.whenStable();
    expect(changes.at(-1)).toEqual({ start: '2026-09-14', end: '2026-09-18' });
    expect(day('2026-09-16').getAttribute('aria-pressed')).toBe('true');
    fixture.componentRef.setInput('dateDisabled', (date: string) => date === '2026-09-16');
    await fixture.whenStable();
    day('2026-09-14').click();
    day('2026-09-18').click();
    expect(changes.at(-1)).toEqual({ start: '2026-09-14', end: null });
    await fixture.whenStable();
    expect(day('2026-09-14').getAttribute('aria-pressed')).toBe('true');
  });

  it('integrates Forms writes, reset, disabled, dirty and touched state', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await fixture.whenStable();
    const control = fixture.componentInstance.control;
    const element: HTMLElement = fixture.nativeElement;
    const day = element.querySelector<HTMLButtonElement>('[data-date="2026-09-16"]')!;
    expect(control.pristine).toBe(true);
    day.click();
    await fixture.whenStable();
    expect(control.value).toBe('2026-09-16');
    expect(control.dirty).toBe(true);
    day.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    expect(control.touched).toBe(true);
    control.reset();
    await fixture.whenStable();
    expect(element.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
    expect(control.pristine).toBe(true);
    control.disable();
    await fixture.whenStable();
    expect(day.disabled).toBe(true);
    control.enable();
    await fixture.whenStable();
    expect(day.disabled).toBe(false);
  });

  it('rejects unavailable and readonly actions while preserving programmatic values', async () => {
    const { fixture, day, component } = await create({
      min: '2026-09-14',
      max: '2026-09-18',
      dateDisabled: (date: string) => date === '2026-09-16',
    });
    const changed = vi.fn();
    component.valueChange.subscribe(changed);
    for (const date of ['2026-09-13', '2026-09-19', '2026-09-16']) day(date).click();
    expect(changed).not.toHaveBeenCalled();
    day('2026-09-14').click();
    expect(changed).toHaveBeenCalledExactlyOnceWith('2026-09-14');
    fixture.componentRef.setInput('readOnly', true);
    await fixture.whenStable();
    day('2026-09-18').click();
    expect(changed).toHaveBeenCalledTimes(1);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    day('2026-09-18').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changed).toHaveBeenCalledTimes(1);
    component.setDisabledState(false);
    await fixture.whenStable();
    expect(day('2026-09-18').disabled).toBe(false);
    component.writeValue('2026-09-13');
    await fixture.whenStable();
    expect(day('2026-09-13').getAttribute('aria-pressed')).toBe('true');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('validates value shapes, required state, bounds, and incomplete or blocked ranges', async () => {
    const { fixture, component } = await create();
    const validate = (value: unknown) => component.validate(new FormControl(value));
    expect(validate(null)).toBeNull();
    expect(validate([])).toBeNull();
    expect(validate({})).toEqual({ calendarMode: true });
    expect(validate('2026-02-29')).toEqual({ calendarDate: true });
    const validationChanged = vi.fn();
    component.registerOnValidatorChange(validationChanged);
    fixture.componentRef.setInput('required', true);
    await fixture.whenStable();
    expect(validationChanged).toHaveBeenCalled();
    expect(validate(null)).toEqual({ required: true });
    fixture.componentRef.setInput('min', '2026-09-14');
    fixture.componentRef.setInput('max', '2026-09-18');
    fixture.componentRef.setInput('mode', 'multiple');
    await fixture.whenStable();
    expect(validate(['2026-09-13'])).toEqual({ calendarUnavailable: true });
    expect(validate(['2026-09-14', '2026-09-18'])).toBeNull();
    fixture.componentRef.setInput('mode', 'range');
    await fixture.whenStable();
    expect(validate({ start: '2026-09-14', end: null })).toEqual({ calendarRangeIncomplete: true });
    for (const range of [
      { start: 'bad', end: '2026-09-18' },
      { start: '2026-09-14', end: 'bad' },
      { start: '2026-09-18', end: '2026-09-14' },
    ])
      expect(validate(range)).toEqual({ calendarDate: true });
    expect(validate({ start: '2026-09-13', end: '2026-09-18' })).toEqual({
      calendarUnavailable: true,
    });
    expect(validate({ start: '2026-09-14', end: '2026-09-19' })).toEqual({
      calendarUnavailable: true,
    });
    expect(validate({ start: '2026-09-14', end: '2026-09-18' })).toBeNull();
    fixture.componentRef.setInput('required', false);
    fixture.componentRef.setInput('dateDisabled', (date: string) => date === '2026-09-16');
    await fixture.whenStable();
    expect(validate({ start: '2026-09-14', end: null })).toBeNull();
    expect(validate({ start: '2026-09-14', end: '2026-09-18' })).toEqual({
      calendarUnavailable: true,
    });
    expect(validate({ start: '2026-09-14', end: '2026-09-15' })).toBeNull();
    expect(validate({ start: '2026-09-14', end: '2026-09-14' })).toBeNull();
  });

  it('navigates months and years without changing the selected value', async () => {
    const { fixture, element, component } = await create({ value: '2026-09-14' });
    const months: string[] = [];
    const values = vi.fn();
    component.monthChange.subscribe(month => months.push(month));
    component.valueChange.subscribe(values);
    const next = element.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!;
    const previous = element.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')!;
    next.click();
    await fixture.whenStable();
    expect(element.textContent).toContain('October 2026');
    previous.click();
    await fixture.whenStable();
    expect(months).toEqual(['2026-10-01', '2026-09-01']);
    const month = element.querySelector('select')!;
    const year = element.querySelector('input')!;
    year.value = '2027';
    month.value = '1';
    month.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(element.textContent).toContain('February 2027');
    month.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(months).toHaveLength(3);
    year.value = '';
    year.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(months).toHaveLength(3);
    expect(values).not.toHaveBeenCalled();
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    next.dispatchEvent(new MouseEvent('click'));
    month.dispatchEvent(new Event('change'));
    expect(months).toHaveLength(3);
  });

  it('pages a focused date across month/year and rendered-grid boundaries', async () => {
    const { fixture, day, element, component } = await create();
    const selected = vi.fn();
    component.valueChange.subscribe(selected);
    const key = async (date: string, key: string, options: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        ...options,
      });
      day(date).dispatchEvent(event);
      await fixture.whenStable();
      return event;
    };
    await key('2026-09-14', 'PageDown');
    expect(element.textContent).toContain('October 2026');
    await key('2026-10-14', 'PageUp', { shiftKey: true });
    expect(element.textContent).toContain('October 2025');
    await key('2025-10-14', 'PageUp');
    expect(element.textContent).toContain('September 2025');
    await key('2025-09-14', 'PageDown', { shiftKey: true });
    expect(element.textContent).toContain('September 2026');
    await key('2026-10-10', 'ArrowRight');
    expect(element.textContent).toContain('October 2026');
    await key('2026-09-27', 'ArrowUp');
    expect(element.textContent).toContain('September 2026');
    await key('2026-08-30', 'ArrowLeft');
    expect(element.textContent).toContain('August 2026');
    TestBed.inject(Directionality).valueSignal.set('rtl');
    await key('2026-07-26', 'ArrowRight');
    expect(element.textContent).toContain('July 2026');
    await key('2026-08-08', 'ArrowDown');
    expect(element.textContent).toContain('August 2026');
    for (const options of [{ altKey: true }, { ctrlKey: true }, { metaKey: true }])
      expect((await key('2026-08-14', 'PageDown', options)).defaultPrevented).toBe(false);
    expect((await key('2026-08-14', 'a')).defaultPrevented).toBe(false);
    await key('2026-08-14', 'ArrowUp');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect((await key('2026-08-14', 'PageDown')).defaultPrevented).toBe(false);
    expect(selected).not.toHaveBeenCalled();
  });

  it('preserves custom day content, prefixed classes, and consumer styling', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(CustomHost);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const day = element.querySelector<HTMLButtonElement>('[data-date="2026-09-14"]')!;
    expect(day.textContent).toContain('2026-09-14 Today');
    expect(day.classList.contains('tw:d-btn')).toBe(true);
    expect(day.getAttribute('aria-label')).toBe('Monday, September 14, 2026');
  });

  it('rejects malformed configuration and tolerates supported calendar edges', async () => {
    const { fixture, element, day } = await create({ month: '0001-01-01' });
    expect(
      element.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')!.disabled,
    ).toBe(true);
    day('0001-01-01').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(element.textContent).toContain('January 1');
    fixture.componentRef.setInput('month', '9999-12-01');
    await fixture.whenStable();
    expect(element.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!.disabled).toBe(
      true,
    );
    day('9999-12-31').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    await fixture.whenStable();
    for (const [input, value] of [
      ['weekStartsOn', 7],
      ['weekStartsOn', 1.5],
      ['min', 'invalid'],
      ['max', 'invalid'],
    ] as const) {
      fixture.componentRef.setInput(input, value);
      expect(() => fixture.detectChanges()).toThrow(RangeError);
      fixture.componentRef.setInput(input, input === 'weekStartsOn' ? 0 : null);
      fixture.detectChanges();
    }
    fixture.componentRef.setInput('min', '2026-09-18');
    fixture.componentRef.setInput('max', '2026-09-14');
    expect(() => fixture.detectChanges()).toThrow(RangeError);
  });

  it('opens and closes popup selections with a nonmodal fallback when dialog methods are absent', async () => {
    const { fixture, element, day, component } = await create({ presentation: 'popup' });
    const dialog = element.querySelector('dialog')!;
    Object.defineProperty(dialog, 'showModal', { value: undefined, configurable: true });
    Object.defineProperty(dialog, 'close', { value: undefined, configurable: true });
    const trigger = element.querySelector<HTMLButtonElement>('[aria-haspopup="dialog"]')!;
    const changes: boolean[] = [];
    component.openChange.subscribe(value => changes.push(value));
    trigger.click();
    await fixture.whenStable();
    expect(dialog.open).toBe(true);
    trigger.click();
    await fixture.whenStable();
    expect(changes).toEqual([true]);
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    expect(dialog.open).toBe(true);
    day('2026-09-16').click();
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    expect(changes).toEqual([true, false]);
    trigger.click();
    await fixture.whenStable();
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    trigger.dispatchEvent(new MouseEvent('click'));
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
  });

  it('synchronizes native modal open/close, controlled state, and internal focus transitions', async () => {
    const { fixture, element, day, component } = await create({ presentation: 'popup' });
    const dialog = element.querySelector('dialog')!;
    const show = vi.fn(() => {
      dialog.open = true;
    });
    const close = vi.fn(() => {
      dialog.open = false;
      dialog.dispatchEvent(new Event('close'));
    });
    Object.defineProperty(dialog, 'showModal', { value: show, configurable: true });
    Object.defineProperty(dialog, 'close', { value: close, configurable: true });
    const touched = vi.fn();
    component.registerOnTouched(touched);
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    expect(show).toHaveBeenCalledOnce();
    day('2026-09-14').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }),
    );
    await fixture.whenStable();
    expect(show).toHaveBeenCalledOnce();
    day('2026-10-14').dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
    await fixture.whenStable();
    day('2026-09-14').dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: day('2026-09-16') }),
    );
    expect(touched).not.toHaveBeenCalled();
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();
    expect(close).toHaveBeenCalledOnce();
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    element.querySelectorAll<HTMLButtonElement>('dialog > button')[0].click();
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
  });
});
