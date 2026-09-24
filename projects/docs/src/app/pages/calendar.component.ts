import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ZdCalendar,
  type ZdCalendarMode,
  type ZdCalendarRange,
  type ZdCalendarValue,
} from '@pranxy/zordon-ui/calendar';
import { map } from 'rxjs';

import {
  boundsFiles,
  calendarAccessibilityNotes,
  calendarCustomizationCode,
  calendarFacts,
  calendarImportCode,
  calendarInputs,
  calendarKeyboard,
  calendarMonth,
  calendarOutputs,
  calendarPlaygroundControls,
  calendarPlaygroundSnippet,
  calendarSourceCode,
  calendarToday,
  calendarTypesCode,
  dayTemplateCode,
  formsFiles,
  popupCode,
  rangeCode,
  releaseDays,
} from '../content/calendar.content';
import {
  DocsApiTableComponent,
  DocsCalloutComponent,
  DocsCodeBlockComponent,
  DocsExampleComponent,
  DocsFeatureGridComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Readable summary of any calendar value, for the status lines under each example. */
export function describeCalendarValue(value: ZdCalendarValue): string {
  if (value === null) return 'none';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'none';
  const range = value as ZdCalendarRange;
  return `${range.start} → ${range.end ?? '…'}`;
}

/**
 * Tailwind's preflight resets every margin, which removes the auto margin that centres a modal
 * dialog. Calendar's stylesheet does not restore it, so this page does, only while it is in use.
 */
@Component({
  selector: 'docs-calendar-dialog-styles',
  template: '',
  styles: `
    zd-calendar dialog {
      margin: auto;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
class CalendarDialogStylesComponent {}

@Component({
  selector: 'docs-calendar-page',
  imports: [
    CalendarDialogStylesComponent,
    DocsApiTableComponent,
    DocsCalloutComponent,
    DocsCodeBlockComponent,
    DocsExampleComponent,
    DocsFeatureGridComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsSectionComponent,
    ReactiveFormsModule,
    ZdCalendar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-calendar-dialog-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Data input"
        heading="Calendar"
        maturity="preview"
        description="Inline or popup date selection in single, multiple and range modes. Values are civil YYYY-MM-DD strings, never timestamps; Angular Aria owns grid navigation and each day is a native button."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Manual screen-reader, mobile, contrast and zoom review is pending.
        For a simple date field, a native date input is still a good choice.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="Import the component, and register the button classes it composes with Tailwind."
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-block label="src/styles.css" language="css" [code]="sourceCode" />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Pick dates with the mouse or keyboard. Changing the mode starts a fresh calendar, since each mode has its own value shape."
      >
        <docs-playground label="Calendar" [controls]="controls" [snippet]="snippet">
          <ng-template docsPlaygroundPreview let-values>
            <div class="docs-stack">
              @for (mode of [mode(values)]; track mode) {
                <zd-calendar
                  ariaLabel="Date"
                  [month]="month"
                  [today]="today"
                  [mode]="mode"
                  [weekStartsOn]="weekStartsOn(values)"
                  [readOnly]="values['readOnly'] === true"
                  [disabled]="values['disabled'] === true"
                  (valueChange)="playgroundValue.set(describe($event))"
                />
              }
              <span class="status" role="status">Value: {{ playgroundValue() }}</span>
            </div>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="bounds"
          level="3"
          heading="Bounds and unavailable days"
          description="min and max bound selection; dateDisabled rejects weekends here. Unavailable days stay focusable so the grid stays predictable."
        >
          <docs-example label="delivery" [files]="boundsFiles">
            <div class="docs-stack">
              <zd-calendar
                ariaLabel="Delivery date"
                min="2026-09-07"
                max="2026-10-16"
                [month]="month"
                [today]="today"
                [dateDisabled]="isWeekend"
                [(value)]="delivery"
              />
              <span class="status" role="status">Delivery: {{ describe(delivery()) }}</span>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="range"
          level="3"
          heading="Range"
          description="The first activation starts the range, the second completes it. Reverse endpoints are sorted; a range across unavailable days is rejected."
        >
          <docs-example label="stay.html" [code]="rangeCode">
            <div class="docs-stack">
              <zd-calendar
                ariaLabel="Stay"
                mode="range"
                [month]="month"
                [today]="today"
                [(value)]="stay"
              />
              <span class="status" role="status">Stay: {{ describe(stay()) }}</span>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="popup"
          level="3"
          heading="Popup"
          description="A trigger opens the calendar in a native modal dialog. Single selection closes it; Escape and the close button return focus to the trigger."
        >
          <docs-example label="departure.html" [code]="popupCode">
            <div class="docs-stack">
              <zd-calendar
                ariaLabel="Departure date"
                presentation="popup"
                [month]="month"
                [today]="today"
                [(value)]="departure"
              />
              <span class="status" role="status">Departure: {{ describe(departure()) }}</span>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="forms"
          level="3"
          heading="Forms"
          description="Calendar is a ControlValueAccessor and a Validator. Help and error text are yours; connect them with ariaDescribedby."
        >
          <docs-example label="arrival" [files]="formsFiles">
            <div class="docs-stack">
              <zd-calendar
                ariaLabel="Arrival date"
                ariaDescribedby="arrival-help"
                required
                [month]="month"
                [today]="today"
                [formControl]="arrival"
              />
              <p id="arrival-help" class="status">
                Required. {{ arrivalValid() ? 'Valid' : 'Choose an arrival date.' }}
              </p>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="day-template"
          level="3"
          heading="Custom day content"
          description="A template adds decorative content to each day. The day stays a button named by its full date, so keep extra meaning out of the decoration or describe it elsewhere."
        >
          <docs-example label="releases.html" [code]="dayTemplateCode">
            <div class="docs-stack">
              <zd-calendar
                ariaLabel="Release days"
                ariaDescribedby="release-help"
                [month]="month"
                [today]="today"
                [dayTemplate]="day"
              />
              <p id="release-help" class="status">
                Releases on 8, 22 and 29 September are marked with a dot.
              </p>
            </div>
            <ng-template #day let-date>
              <span class="day">
                {{ +date.slice(8) }}
                @if (releases.has(date)) {
                  <span class="dot" aria-hidden="true"></span>
                }
              </span>
            </ng-template>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="A standalone component that also works with Angular Forms. Do not bind value and a Forms directive at the same time."
      >
        <docs-section id="inputs" level="3" heading="Inputs">
          <docs-api-table
            caption="Calendar inputs"
            [columns]="inputs.columns"
            [rows]="inputs.rows"
          />
        </docs-section>
        <docs-section id="outputs" level="3" heading="Outputs">
          <docs-api-table
            caption="Calendar outputs"
            [columns]="outputs.columns"
            [rows]="outputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/calendar" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Native day buttons inside an Aria grid: selection is announced through aria-pressed, not grid selection."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
        <docs-api-table caption="Keyboard" [columns]="keyboard.columns" [rows]="keyboard.rows" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Calendar uses daisyUI theme tokens and button classes and adds no motion. Host classes and theme scopes are kept; one custom property sizes the days. Translate its strings with ZD_CALENDAR_STRINGS, or replace the date adapter."
      >
        <docs-code-block label="styles.css" language="css" [code]="customizationCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="The server renders date labels, pressed, current and unavailable states with deterministic day IDs. Pass the same month, value, locale and today on both sides; popups start closed on the server."
      />
    </article>
  `,
  styles: `
    .status {
      margin: 0;
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }

    .day {
      display: inline-grid;
      justify-items: center;
      line-height: 1;
    }

    .dot {
      inline-size: 0.3rem;
      block-size: 0.3rem;
      margin-block-start: 0.15rem;
      border-radius: 50%;
      background: currentColor;
    }
  `,
})
export class CalendarPageComponent {
  protected readonly facts = calendarFacts;
  protected readonly importCode = calendarImportCode;
  protected readonly sourceCode = calendarSourceCode;
  protected readonly controls = calendarPlaygroundControls;
  protected readonly snippet = calendarPlaygroundSnippet;
  protected readonly boundsFiles = boundsFiles;
  protected readonly rangeCode = rangeCode;
  protected readonly popupCode = popupCode;
  protected readonly formsFiles = formsFiles;
  protected readonly dayTemplateCode = dayTemplateCode;
  protected readonly releases = releaseDays;
  protected readonly inputs = calendarInputs;
  protected readonly outputs = calendarOutputs;
  protected readonly typesCode = calendarTypesCode;
  protected readonly accessibilityNotes = calendarAccessibilityNotes;
  protected readonly keyboard = calendarKeyboard;
  protected readonly customizationCode = calendarCustomizationCode;

  protected readonly month = calendarMonth;
  protected readonly today = calendarToday;
  protected readonly describe = describeCalendarValue;
  protected readonly isWeekend = (date: string): boolean =>
    [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay());

  protected readonly playgroundValue = signal('none');
  protected readonly delivery = signal<ZdCalendarValue>(null);
  protected readonly stay = signal<ZdCalendarValue>(null);
  protected readonly departure = signal<ZdCalendarValue>(null);
  protected readonly arrival = new FormControl<ZdCalendarValue>(null);
  protected readonly arrivalValid = toSignal(
    this.arrival.statusChanges.pipe(map(status => status === 'VALID')),
    { initialValue: false },
  );

  protected mode(values: PlaygroundValues): ZdCalendarMode {
    return values['mode'] as ZdCalendarMode;
  }

  protected weekStartsOn(values: PlaygroundValues): number {
    return Number(values['weekStartsOn']);
  }
}
