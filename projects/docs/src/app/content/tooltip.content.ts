import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, themeColors } from './form-controls.content';

/**
 * Tooltip reference content. Mirrors projects/components/tooltip/src/tooltip.ts and
 * docs/components/tooltip.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const tooltipReference: DocsReference = {
  eyebrow: 'Feedback',
  heading: 'Tooltip',
  maturity: 'planned',
  description:
    'A short description for an existing control, or an interactive help panel. It opens on hover, focus or long press, flips to stay on screen, and follows the text direction.',
  facts: controlFacts('[zdTooltip]', 'tooltip-content', 'tooltip'),
  notice: plannedNotice,
  install: {
    description:
      'Import the directive. Its surface ships its own styles and uses your daisyUI theme colors; nothing else to register.',
    importCode: `import { ZdTooltip } from '@pranxy/zordon-ui/tooltip';`,
  },
  playgroundDescription:
    'Hover the button, or tab to it: focus opens the tooltip at once, hover after a short delay. Escape closes it.',
  api: {
    description:
      'A standalone directive on any focusable host. Everything but the content is prefixed with tooltip, so it never binds to another directive on the same element, such as Button’s color. Boolean inputs other than tooltipOpen accept bare attributes; delays are milliseconds.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Tooltip inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'zdTooltip',
            type: 'string | TemplateRef',
            default: 'required',
            description: 'The content. Blank text never opens.',
          },
          {
            name: 'tooltipSide',
            type: 'ZdTooltipSide',
            default: "'top'",
            description: '`top`, `bottom`, or logical `start`/`end`.',
          },
          {
            name: 'tooltipAlign',
            type: 'ZdTooltipAlign',
            default: "'center'",
            description: '`start`, `center` or `end` along that side.',
          },
          {
            name: 'tooltipColor',
            type: 'ZdTooltipColor',
            default: "'neutral'",
            description: 'Background from a theme role, with its matching content color.',
          },
          {
            name: 'tooltipTrigger',
            type: 'ZdTooltipTrigger',
            default: "'auto'",
            description: '`auto` (hover and focus), `hover`, `focus` or `manual`.',
          },
          {
            name: 'tooltipInteractive',
            type: 'boolean',
            default: 'false',
            description: 'Turns the surface into a named, non-modal dialog for controls.',
          },
          {
            name: 'tooltipLabel',
            type: 'string',
            default: "'Help'",
            description: 'Accessible name of the interactive dialog.',
          },
          {
            name: 'tooltipOpen',
            type: 'boolean | undefined',
            default: 'undefined',
            description: 'Bind to control visibility yourself; accept tooltipOpenChange to close.',
          },
          {
            name: 'tooltipDisabled',
            type: 'boolean',
            default: 'false',
            description: 'Stops it opening. The host’s own disabled state is untouched.',
          },
          {
            name: 'tooltipArrow / tooltipAutoFlip',
            type: 'boolean',
            default: 'true',
            description: 'Show the arrow; flip to the other side when there is no room.',
          },
          {
            name: 'tooltipGap',
            type: 'number',
            default: '8',
            description: 'Pixels between host and surface.',
          },
          {
            name: 'tooltipShowDelay / tooltipHideDelay',
            type: 'number',
            default: '500 / 100',
            description: 'Hover open delay, and grace time when the pointer leaves.',
          },
          {
            name: 'tooltipTouch',
            type: 'boolean',
            default: 'true',
            description: 'Long press opens it on touch screens.',
          },
          {
            name: 'tooltipLongPressDelay / tooltipTouchHideDelay',
            type: 'number',
            default: '500 / 1500',
            description: 'Press time to open, and how long it stays after release.',
          },
          {
            name: 'tooltipPanelClass',
            type: 'string',
            default: "''",
            description: 'Classes for the overlay pane, read when it opens.',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs and methods',
        caption: 'Tooltip outputs and methods',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'tooltipOpenChange',
            type: 'boolean',
            description: 'Requested visibility, for controlled use.',
          },
          {
            name: 'tooltipClosed',
            type: 'ZdTooltipCloseReason',
            description: 'Why it closed: escape, outside-pointer, focus, hover, touch, …',
          },
          {
            name: 'show() / hide(reason?)',
            type: '() => void',
            description: 'Open or close it. Template export: `#tip="zdTooltip"`.',
          },
          {
            name: 'focusContent()',
            type: '() => void',
            description: 'Moves focus into an interactive surface.',
          },
          {
            name: 'expanded()',
            type: 'boolean',
            description: 'Whether the surface is attached and visible.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/tooltip',
    typesCode: `export type ZdTooltipSide = 'top' | 'bottom' | 'start' | 'end';
export type ZdTooltipAlign = 'start' | 'center' | 'end';
export type ZdTooltipColor =
  | 'neutral' | 'primary' | 'secondary' | 'accent'
  | 'info' | 'success' | 'warning' | 'error';
export type ZdTooltipTrigger = 'auto' | 'hover' | 'focus' | 'manual';
export type ZdTooltipCloseReason =
  | 'escape' | 'outside-pointer' | 'focus' | 'hover'
  | 'touch' | 'programmatic' | 'navigation' | 'destroy';`,
  },
  accessibility: {
    description:
      'A descriptive tooltip is role="tooltip" and joins the host’s aria-describedby while open; your own description ids are kept.',
    features: [
      {
        title: 'The host needs a name',
        body: 'A tooltip describes; it doesn’t label. Icon buttons still need aria-label.',
      },
      {
        title: 'Nothing essential',
        body: 'Content that people need must also be on the page, including without JavaScript.',
      },
      {
        title: 'Controls need tooltipInteractive',
        body: 'Interactive surfaces are named dialogs. F2 or activating the host moves focus in; Escape returns it.',
      },
      {
        title: 'Disabled buttons can’t focus',
        body: 'Wrap a disabled action in a focusable, labelled element and put the tooltip there.',
      },
    ],
    keyboard: {
      caption: 'Tooltip keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Tab', action: 'Focusing the host opens it (auto and focus triggers)' },
        { key: 'Escape', action: 'Closes it, and returns focus from an interactive surface' },
        { key: 'F2', action: 'Moves focus into an interactive surface' },
        { key: 'Shift+Tab', action: 'From the first control, back to the host' },
      ],
    },
  },
  customization: {
    description:
      'The surface reads your theme’s color variables. Add classes to its pane with tooltipPanelClass; long content scrolls inside a viewport-sized box.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.wide-tip zd-tooltip-surface {
  max-inline-size: 28rem;
}`,
    },
  },
  ssr: 'The server renders the host and any inline description, but no overlay. Listeners attach after hydration; focus before then is not replayed.',
};

export const tooltipPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'tooltipSide',
    options: choices(['top', 'bottom', 'start', 'end']),
    defaultValue: 'top',
    omit: ['top'],
  },
  {
    kind: 'choice',
    key: 'tooltipAlign',
    options: choices(['start', 'center', 'end']),
    defaultValue: 'center',
    omit: ['center'],
  },
  {
    kind: 'choice',
    key: 'tooltipColor',
    options: choices(themeColors),
    defaultValue: 'neutral',
    omit: ['neutral'],
  },
];

export const tooltipPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render:
    attributes => `<button type="button" zdTooltip="Saves a copy only you can see"${attributes}>
  Save draft
</button>`,
};

export const richCode = `<ng-template #shortcut>
  Copy the link · <kbd>Ctrl</kbd> + <kbd>L</kbd>
</ng-template>
<button type="button" aria-label="Copy link" [zdTooltip]="shortcut">🔗</button>`;

export const interactiveCode = `<ng-template #settings>
  <label>Draft name <input name="draftName" /></label>
  <button type="button">Apply</button>
</ng-template>
<button type="button" [zdTooltip]="settings" tooltipInteractive tooltipLabel="Draft settings">
  Draft settings
</button>`;

export const disabledCode = `<span
  tabindex="0"
  role="group"
  aria-label="Publish unavailable"
  zdTooltip="Complete the required fields first"
>
  <button type="button" disabled>Publish</button>
</span>`;

export const controlledFiles = [
  {
    label: 'tour.html',
    language: 'html' as const,
    code: `<button zdButton type="button" zdTooltip="New: export to PDF" tooltipTrigger="manual"
        tooltipSide="bottom" tooltipColor="primary" [(tooltipOpen)]="tour">
  Export
</button>
<button type="button" (click)="tour.set(!tour())">Show what’s new</button>`,
  },
  { label: 'tour.ts', language: 'ts' as const, code: `protected readonly tour = signal(false);` },
];
