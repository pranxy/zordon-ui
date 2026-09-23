import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Dropdown reference content. Names, types and defaults mirror
 * projects/components/dropdown/src/dropdown.ts and docs/components/dropdown.md — update them
 * together.
 */

export const dropdownFacts: readonly DocsMetaItem[] = [
  { label: 'Root', value: '[zdDropdown]', mono: true },
  { label: 'Trigger', value: 'button[zdDropdownTrigger]', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/dropdown', mono: true },
  {
    label: 'Source',
    value: 'dropdown.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/dropdown/src/dropdown.ts',
    mono: true,
  },
];

export const dropdownImportCode = `import {
  ZdDropdown,
  ZdDropdownItem,
  ZdDropdownMenu,
  ZdDropdownPanel,
  ZdDropdownTrigger,
} from '@pranxy/zordon-ui/dropdown';`;

export const dropdownOverlayCss = `/* Structural overlay styles from Angular CDK */
@import '@angular/cdk/overlay-prebuilt.css';`;

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const dropdownPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'side',
    options: choices(['bottom', 'top', 'start', 'end']),
    defaultValue: 'bottom',
    omit: ['bottom'],
  },
  {
    kind: 'choice',
    key: 'align',
    options: choices(['start', 'center', 'end']),
    defaultValue: 'start',
    omit: ['start'],
  },
  {
    kind: 'choice',
    key: 'trigger',
    options: choices(['click', 'hover', 'focus']),
    defaultValue: 'click',
    omit: ['click'],
  },
  { kind: 'boolean', key: 'disabled', defaultValue: false },
];

export const dropdownPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdDropdown mode="menu"${attributes} (selected)="apply($event)">
  <button zdButton zdDropdownTrigger>Theme ▾</button>
  <ng-template zdDropdownPanel>
    <zd-dropdown-menu aria-label="Theme">
      <button type="button" zdDropdownItem value="light">Light</button>
      <button type="button" zdDropdownItem value="dark">Dark</button>
      <button type="button" zdDropdownItem value="system">System</button>
    </zd-dropdown-menu>
  </ng-template>
</div>`,
};

export const themeChoices = ['light', 'dark', 'system'] as const;

export const actionMenuCode = `<div zdDropdown mode="menu" (selected)="lastAction.set($event)">
  <button zdButton zdDropdownTrigger>Actions ▾</button>
  <ng-template zdDropdownPanel>
    <zd-dropdown-menu aria-label="Document actions">
      <button type="button" zdDropdownItem value="rename">Rename</button>
      <button type="button" zdDropdownItem value="duplicate">Duplicate</button>
      <button type="button" zdDropdownItem value="delete" [disabled]="true">Delete</button>
    </zd-dropdown-menu>
  </ng-template>
</div>`;

export const nestedMenuCode = `<div zdDropdown mode="menu" (selected)="lastExport.set($event)">
  <button zdButton zdDropdownTrigger>File ▾</button>
  <ng-template zdDropdownPanel>
    <zd-dropdown-menu aria-label="File">
      <button type="button" zdDropdownItem value="save">Save</button>
      <div zdDropdown mode="menu" side="end">
        <button zdDropdownTrigger zdDropdownItem value="export">Export ▸</button>
        <ng-template zdDropdownPanel>
          <zd-dropdown-menu aria-label="Export formats">
            <button type="button" zdDropdownItem value="pdf">PDF</button>
            <button type="button" zdDropdownItem value="csv">CSV</button>
          </zd-dropdown-menu>
        </ng-template>
      </div>
    </zd-dropdown-menu>
  </ng-template>
</div>`;

export const contentPanelCode = `<div zdDropdown #prefs="zdDropdown" initialFocus="first">
  <button zdButton zdDropdownTrigger>Preferences ▾</button>
  <ng-template zdDropdownPanel>
    <form class="panel" aria-label="Preferences"
          (submit)="$event.preventDefault(); save(); prefs.close('selection')">
      <label>Display name <input name="displayName" /></label>
      <button zdButton color="primary" type="submit">Save</button>
    </form>
  </ng-template>
</div>`;

export const controlledFiles = [
  {
    label: 'controlled.html',
    language: 'html' as const,
    code: `<div zdDropdown mode="menu" [open]="open()" (openChange)="open.set($event)">
  <button zdButton zdDropdownTrigger>Menu ▾</button>
  <ng-template zdDropdownPanel>…</ng-template>
</div>
<button zdButton (click)="open.set(!open())">Toggle from outside</button>`,
  },
  {
    label: 'controlled.ts',
    language: 'ts' as const,
    code: `protected readonly open = signal(false);`,
  },
];

const declarationColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Declaration', kind: 'name' },
  { key: 'description', label: 'Role' },
];

export const dropdownDeclarations = {
  columns: declarationColumns,
  rows: [
    {
      name: '[zdDropdown]',
      description: 'Root state, placement and close policy. Exported as `zdDropdown`.',
    },
    {
      name: 'button[zdDropdownTrigger]',
      description: 'Native trigger; sets `aria-expanded`, `aria-controls` and `aria-haspopup`.',
    },
    {
      name: 'ng-template[zdDropdownPanel]',
      description: 'Exactly one lazy panel per root. Created only while open.',
    },
    {
      name: 'zd-dropdown-menu',
      description: 'Aria menu with projected items. Inputs: `id`, `wrap`, `typeaheadDelay`.',
    },
    {
      name: '[zdDropdownItem]',
      description:
        'On `button` or `a`. Required `value`, boolean `disabled`, optional `searchTerm` for typeahead.',
    },
  ] satisfies readonly DocsTableRow[],
};

const apiColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const dropdownInputs = {
  columns: apiColumns,
  rows: [
    {
      name: 'open',
      type: 'boolean | undefined',
      default: 'undefined',
      description:
        'Omit for internal state. Bound: controlled; the root emits `openChange` and waits for you to accept it.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the trigger and closes the panel.',
    },
    {
      name: 'mode',
      type: "'content' | 'menu'",
      default: "'content'",
      description: 'Use `menu` with `zd-dropdown-menu`; `content` for forms and arbitrary panels.',
    },
    {
      name: 'trigger',
      type: "'click' | 'hover' | 'focus' | 'manual'",
      default: "'click'",
      description: '`hover` and `focus` add opening behaviour; `manual` needs `open` or `show()`.',
    },
    {
      name: 'side',
      type: 'ZdDropdownSide',
      default: "'bottom'",
      description: '`top`, `bottom`, `start` or `end`. Logical, so it follows text direction.',
    },
    {
      name: 'align',
      type: 'ZdDropdownAlign',
      default: "'start'",
      description: '`start`, `center` or `end` along the chosen side.',
    },
    {
      name: 'gap',
      type: 'number',
      default: '4',
      description: 'Distance from the trigger in pixels.',
    },
    {
      name: 'autoFlip',
      type: 'boolean',
      default: 'true',
      description: 'Flips to the opposite side when the panel would leave the viewport.',
    },
    {
      name: 'hoverDelay',
      type: 'number',
      default: '150',
      description: 'Open and close delay in milliseconds for `hover`.',
    },
    {
      name: 'initialFocus',
      type: "'first' | 'none'",
      default: "'none'",
      description: 'Moves focus into the panel on programmatic opening.',
    },
    {
      name: 'closeOnSelection',
      type: 'boolean',
      default: 'true',
      description: 'Closes the menu tree when an item is chosen.',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Escape closes the top surface only and restores its trigger.',
    },
    {
      name: 'closeOnOutside',
      type: 'boolean',
      default: 'true',
      description: 'Closes on a pointer press outside the panel and trigger.',
    },
    {
      name: 'closeOnFocus',
      type: 'boolean',
      default: 'true',
      description: 'Closes when focus leaves the trigger and panel.',
    },
    {
      name: 'restoreFocus',
      type: 'boolean',
      default: 'true',
      description: 'Returns focus to the trigger if it was still inside the closing surface.',
    },
    {
      name: 'panelClass',
      type: 'string',
      default: "''",
      description: 'Space-separated classes for the overlay pane, e.g. to set its width.',
    },
  ] satisfies readonly DocsTableRow[],
};

const outputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Output / method', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const dropdownOutputs = {
  columns: outputColumns,
  rows: [
    {
      name: 'openChange',
      type: 'boolean',
      description: 'Requested open state. Required with a bound `open`.',
    },
    {
      name: 'selected',
      type: 'unknown',
      description: 'The chosen item’s `value`; reaches ancestor roots too. Narrow it in your code.',
    },
    {
      name: 'closed',
      type: 'ZdDropdownCloseReason',
      description:
        'Why the panel actually closed: `trigger`, `selection`, `escape`, `outside-pointer`, `focus`, `hover`, `navigation` and more.',
    },
    {
      name: 'expanded()',
      type: 'Signal<boolean>',
      description: 'True while the panel is rendered; always false on the server.',
    },
    {
      name: 'show() / close(reason?)',
      type: 'void',
      description: 'Programmatic requests. `close` defaults to `programmatic`.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const dropdownTypesCode = `export type ZdDropdownSide = 'top' | 'bottom' | 'start' | 'end';
export type ZdDropdownAlign = 'start' | 'center' | 'end';
export type ZdDropdownCloseReason =
  | 'trigger' | 'selection' | 'backdrop' | 'outside-pointer' | 'escape'
  | 'programmatic' | 'navigation' | 'destroy' | 'focus' | 'hover';`;

export const dropdownAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'Name every menu',
    body: 'Give each zd-dropdown-menu an aria-label or aria-labelledby. Nested menus need their own name.',
  },
  {
    title: 'Menus hold actions only',
    body: 'Use mode="menu" for commands. Put inputs and forms in the default content mode, which keeps native tab order.',
  },
  {
    title: 'Focus comes home',
    body: 'Escape, selection and programmatic close return focus to the trigger, unless your action already moved it.',
  },
  {
    title: 'Hover never steals focus',
    body: 'Hover opening waits a grace period and leaves focus where it was; focus inside the panel keeps it open.',
  },
];

const keyboardColumns: readonly DocsTableColumn[] = [
  { key: 'key', label: 'Key', kind: 'kbd' },
  { key: 'where', label: 'Where' },
  { key: 'action', label: 'Action' },
];

export const dropdownKeyboard = {
  columns: keyboardColumns,
  rows: [
    { key: 'Enter', where: 'Trigger', action: 'Opens the panel (native click)' },
    { key: 'Space', where: 'Trigger', action: 'Opens the panel (native click)' },
    { key: '↓', where: 'Trigger', action: 'Opens a menu on its first item' },
    { key: '↑', where: 'Trigger', action: 'Opens a menu on its last item' },
    { key: '↓ ↑', where: 'Menu', action: 'Moves between items, skipping disabled ones' },
    { key: 'Home', where: 'Menu', action: 'First item (End: last item)' },
    { key: 'A–Z', where: 'Menu', action: 'Typeahead to the matching item' },
    {
      key: '→',
      where: 'Nested trigger',
      action: 'Opens the submenu (← closes it; mirrored in RTL)',
    },
    { key: 'Esc', where: 'Any panel', action: 'Closes the top surface and restores its trigger' },
    { key: 'Tab', where: 'Menu', action: 'Closes the tree and continues after the root trigger' },
  ] satisfies readonly DocsTableRow[],
};

export const dropdownStylingCode = `/* Global: the pane lives in the CDK overlay container */
.wide-dropdown {
  min-inline-size: 18rem;
}`;

export const dropdownStylingUsage = `<div zdDropdown mode="menu" panelClass="wide-dropdown">…</div>`;
