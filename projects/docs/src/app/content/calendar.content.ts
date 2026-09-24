import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Calendar reference content. Mirrors projects/components/calendar/src/calendar.ts and
 * docs/components/calendar.md — update them together.
 */

/** Fixed dates keep server and client output identical; Calendar never reads the clock. */
export const calendarMonth = '2026-09-01';
export const calendarToday = '2026-09-14';

export const calendarFacts: readonly DocsMetaItem[] = [
  { label: 'Selector', value: 'zd-calendar', mono: true },
  { label: 'Values', value: 'YYYY-MM-DD', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/calendar', mono: true },
  {
    label: 'Source',
    value: 'calendar.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/calendar/src/calendar.ts',
    mono: true,
  },
];

export const calendarImportCode = `import { ZdCalendar, type ZdCalendarValue } from '@pranxy/zordon-ui/calendar';`;

export const calendarSourceCode = `/* Calendar composes daisyUI button classes */
@source inline("btn btn-ghost btn-primary");`;

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const calendarPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'mode',
    options: choices(['single', 'multiple', 'range']),
    defaultValue: 'single',
    omit: ['single'],
  },
  {
    kind: 'choice',
    key: 'weekStartsOn',
    options: [
      { value: '0', label: 'Sunday' },
      { value: '1', label: 'Monday' },
    ],
    defaultValue: '0',
    omit: ['0'],
  },
  { kind: 'boolean', key: 'readOnly', defaultValue: false },
  { kind: 'boolean', key: 'disabled', defaultValue: false },
];

export const calendarPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes =>
    `<zd-calendar month="2026-09-01" ariaLabel="Date"${attributes} [(value)]="value" />`,
};

export const boundsFiles = [
  {
    label: 'delivery.html',
    language: 'html' as const,
    code: `<zd-calendar
  month="2026-09-01"
  ariaLabel="Delivery date"
  min="2026-09-07"
  max="2026-10-16"
  [dateDisabled]="isWeekend"
  [(value)]="delivery"
/>`,
  },
  {
    label: 'delivery.ts',
    language: 'ts' as const,
    code: `readonly delivery = signal<ZdCalendarValue>(null);
readonly isWeekend = (date: string) => [0, 6].includes(new Date(date).getUTCDay());`,
  },
];

export const rangeCode = `<zd-calendar month="2026-09-01" ariaLabel="Stay" mode="range" [(value)]="stay" />
<!-- stay(): { start: '2026-09-10', end: '2026-09-13' }, or end: null while choosing -->`;

export const popupCode = `<zd-calendar
  month="2026-09-01"
  ariaLabel="Departure date"
  presentation="popup"
  [(value)]="departure"
  [(open)]="pickerOpen"
/>`;

export const formsFiles = [
  {
    label: 'arrival.html',
    language: 'html' as const,
    code: `<zd-calendar
  month="2026-09-01"
  ariaLabel="Arrival date"
  ariaDescribedby="arrival-help"
  required
  [formControl]="arrival"
/>
<p id="arrival-help">Required.</p>`,
  },
  {
    label: 'arrival.ts',
    language: 'ts' as const,
    code: `readonly arrival = new FormControl<ZdCalendarValue>(null);`,
  },
];

export const dayTemplateCode = `<zd-calendar month="2026-09-01" ariaLabel="Release days" [dayTemplate]="day" />

<ng-template #day let-date let-today="today">
  {{ +date.slice(8) }}
  @if (releases.has(date)) {
    <span class="dot" aria-hidden="true"></span>
  }
</ng-template>`;

/** Days marked in the custom-content example. Decorative; the date label stays the name. */
export const releaseDays: ReadonlySet<string> = new Set(['2026-09-08', '2026-09-22', '2026-09-29']);

const apiColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const calendarInputs = {
  columns: apiColumns,
  rows: [
    {
      name: 'month',
      type: 'string',
      default: 'required',
      description: 'A date in the month shown first, and whenever the input changes.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: 'required',
      description: 'Accessible name of the grid and popup dialog.',
    },
    {
      name: 'value',
      type: 'ZdCalendarValue',
      default: 'null',
      description: 'Date, sorted date array or `{ start, end }` range. Two-way with `valueChange`.',
    },
    {
      name: 'mode',
      type: 'ZdCalendarMode',
      default: "'single'",
      description: '`single`, `multiple` or `range`. Changing it does not rewrite the value.',
    },
    {
      name: 'min / max',
      type: 'string | null',
      default: 'null',
      description: 'Inclusive selection bounds. Malformed or reversed bounds throw.',
    },
    {
      name: 'dateDisabled',
      type: '(date: string) => boolean',
      default: 'undefined',
      description: 'Pure, synchronous availability predicate.',
    },
    {
      name: 'disabled / readOnly / required',
      type: 'boolean',
      default: 'false',
      description: 'Forms disabled state wins. Read-only still navigates.',
    },
    {
      name: 'locale',
      type: 'string',
      default: 'LOCALE_ID',
      description: 'Localizes Gregorian month and weekday names.',
    },
    {
      name: 'weekStartsOn',
      type: 'number',
      default: '0',
      description: 'Integer 0 (Sunday) to 6 (Saturday).',
    },
    {
      name: 'today',
      type: 'string | null',
      default: 'null',
      description: 'Marks the current day. Pass it explicitly; the clock is never read.',
    },
    {
      name: 'ariaDescribedby',
      type: 'string | null',
      default: 'null',
      description: 'IDs of your help and error text.',
    },
    {
      name: 'dayTemplate',
      type: 'TemplateRef<ZdCalendarDayContext> | null',
      default: 'null',
      description: 'Noninteractive day content; the button and date label stay the library’s.',
    },
    {
      name: 'presentation',
      type: "'inline' | 'popup'",
      default: "'inline'",
      description: 'Popup adds a trigger, a native dialog and a close action.',
    },
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      description: 'Popup state, applied after browser rendering. Two-way with `openChange`.',
    },
  ] satisfies readonly DocsTableRow[],
};

const outputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Output', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const calendarOutputs = {
  columns: outputColumns,
  rows: [
    {
      name: 'valueChange',
      type: 'ZdCalendarValue',
      description: 'Accepted user selections. Programmatic and Forms writes do not emit.',
    },
    {
      name: 'monthChange',
      type: 'string',
      description: 'The first day of the newly visible month.',
    },
    { name: 'openChange', type: 'boolean', description: 'Popup opened or closed by the user.' },
  ] satisfies readonly DocsTableRow[],
};

export const calendarTypesCode = `/** Civil dates are YYYY-MM-DD strings, never timestamps. */
export type ZdCalendarValue = string | readonly string[] | ZdCalendarRange | null;
export type ZdCalendarMode = 'single' | 'multiple' | 'range';

export interface ZdCalendarRange {
  readonly start: string;
  readonly end: string | null; // null while the range is incomplete
}

export interface ZdCalendarDayContext {
  readonly $implicit: string; // the date
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly today: boolean;
}`;

export const calendarAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'A real grid',
    body: 'Angular Aria owns roving focus and arrow navigation. Focus never selects; Enter and Space activate the day button.',
  },
  {
    title: 'State on the button',
    body: 'Each day is a native button with a full date label, aria-pressed for selection and aria-current for today.',
  },
  {
    title: 'Unavailable stays findable',
    body: 'Days outside the bounds or rejected by dateDisabled remain in the grid but cannot change the value.',
  },
  {
    title: 'Your words, your errors',
    body: 'Supply a meaningful ariaLabel, and point ariaDescribedby at your help and error text. Validation keys are yours to message.',
  },
];

const keyboardColumns: readonly DocsTableColumn[] = [
  { key: 'key', label: 'Key', kind: 'kbd' },
  { key: 'action', label: 'Action' },
];

export const calendarKeyboard = {
  columns: keyboardColumns,
  rows: [
    { key: '← →', action: 'Previous or next day (mirrored in RTL)' },
    { key: '↑ ↓', action: 'Same day in the previous or next week' },
    { key: 'Home', action: 'First day of the week (End: last day)' },
    { key: 'PageUp', action: 'Same date in the previous month (PageDown: next)' },
    { key: 'Shift', action: 'With PageUp or PageDown, moves by a year' },
    { key: 'Enter', action: 'Selects the focused day (Space too)' },
    { key: 'Esc', action: 'Closes the popup and returns focus to its trigger' },
  ] satisfies readonly DocsTableRow[],
};

export const calendarCustomizationCode = `/* Desktop day size; narrow screens use 2rem days for reflow */
.booking zd-calendar {
  --zd-calendar-day-size: 2.75rem;
}`;
