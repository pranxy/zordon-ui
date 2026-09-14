import { Dir } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ZdCalendar, type ZdCalendarValue } from '@pranxy/zordon-ui/calendar';

@Component({
  selector: 'docs-calendar-test-fixture',
  imports: [ZdCalendar, ReactiveFormsModule, Dir],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      style="padding: 1rem; background: var(--color-base-100); color: var(--color-base-content)"
    >
      <h1>Calendar</h1>
      <button type="button" (click)="rtl.set(!rtl())">Toggle calendar direction</button>
      <button type="button" (click)="control.reset()">Reset selection</button>
      <button type="button" (click)="control.disabled ? control.enable() : control.disable()">
        Toggle calendar disabled
      </button>
      <div [dir]="rtl() ? 'rtl' : 'ltr'" style="display: flex; flex-wrap: wrap; gap: 2rem">
        <section aria-label="Single date example" data-testid="calendar-single">
          <h2>Arrival</h2>
          <zd-calendar
            month="2026-09-01"
            ariaLabel="Arrival"
            today="2026-09-14"
            min="2026-08-01"
            max="2027-12-31"
            [dateDisabled]="unavailable"
            [formControl]="control"
          />
          <output aria-label="Selected arrival">{{ control.value }}</output>
        </section>
        <section aria-label="Date range example" data-testid="calendar-range">
          <h2>Stay</h2>
          <zd-calendar
            month="2026-09-01"
            ariaLabel="Stay"
            mode="range"
            [value]="range()"
            (valueChange)="range.set($event)"
          />
        </section>
        <section aria-label="Multiple date example" data-testid="calendar-multiple">
          <h2>Available days</h2>
          <zd-calendar
            month="2026-09-01"
            ariaLabel="Available days"
            mode="multiple"
            locale="pt-PT"
            weekStartsOn="1"
            [dayTemplate]="day"
          />
          <ng-template #day let-date
            >{{ +date.slice(8) }}<span aria-hidden="true">·</span></ng-template
          >
        </section>
        <section aria-label="Popup date example" data-testid="calendar-popup">
          <h2>Departure</h2>
          <zd-calendar month="2026-09-01" ariaLabel="Departure" presentation="popup" />
        </section>
      </div>
    </main>
  `,
})
export class CalendarTestFixtureComponent {
  protected readonly control = new FormControl<ZdCalendarValue>('2026-09-14');
  protected readonly range = signal<ZdCalendarValue>({ start: '2026-09-14', end: '2026-09-18' });
  protected readonly rtl = signal(false);
  protected readonly unavailable = (date: string): boolean => date === '2026-09-15';
}
