import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice } from './form-controls.content';

/**
 * FAB reference content. Mirrors projects/components/fab/src/fab.ts and docs/components/fab.md —
 * update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const fabReference: DocsReference = {
  eyebrow: 'Actions',
  heading: 'FAB / Speed Dial',
  maturity: 'planned',
  description:
    'A floating action button that runs one action or discloses a small group of native actions. The trigger stays visible and becomes the close control.',
  facts: controlFacts('zd-fab', 'btn btn-circle', 'fab'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component and its two directives, plus Button for the actions. FAB brings its own layout stylesheet.',
    importCode: `import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdFab, ZdFabAction, ZdFabActions } from '@pranxy/zordon-ui/fab';`,
    stylesCode: `/* The trigger and circular actions use Button's classes */
@source inline("btn btn-primary btn-circle");`,
  },
  playgroundDescription:
    'Inline here; without inline it is fixed to a viewport corner. Tab enters the actions, Escape closes and returns focus.',
  api: {
    description:
      'A standalone component with a template directive for its actions and a marker directive for each action.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'FAB inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'label',
            type: 'string',
            default: 'required',
            description: 'The closed trigger’s name, and the name of the action group.',
          },
          {
            name: 'closeLabel',
            type: 'string',
            default: "'Close actions'",
            description: 'The open trigger’s name.',
          },
          {
            name: 'arrangement',
            type: 'ZdFabArrangement',
            default: "'vertical'",
            description: '`single` (one action), `vertical` list, or `flower` quarter circle.',
          },
          {
            name: 'corner',
            type: 'ZdFabCorner',
            default: "'bottom-end'",
            description: 'Logical corner. Top corners expand downward, bottom corners upward.',
          },
          {
            name: 'offset',
            type: 'string',
            default: "'1rem'",
            description: 'Distance from the corner, added to the safe-area inset.',
          },
          {
            name: 'inline',
            type: 'boolean',
            default: 'false',
            description: 'Places it in your layout instead of fixing it to the viewport.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Disables the trigger and keeps the actions closed.',
          },
          {
            name: 'open',
            type: 'boolean | undefined',
            default: 'undefined',
            description: 'Bind to control it; otherwise FAB keeps its own state.',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs and parts',
        caption: 'FAB outputs, methods and parts',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'openChange', description: 'Requested state. Leave `open` unchanged to veto.' },
          {
            name: 'mainAction',
            description: 'The trigger was activated in single mode, or with no actions.',
          },
          {
            name: 'show() / hide() / toggle()',
            description: 'Programmatic control. Template export: `#dial="zdFab"`.',
          },
          { name: 'expanded()', description: 'Whether the actions are showing.' },
          {
            name: 'ng-template[zdFabActions]',
            description: 'The actions. Created once and kept hidden and inert while closed.',
          },
          {
            name: '[zdFabAction]',
            description:
              'Marks a button or link. Activating it closes the group unless `keepOpen` is set.',
          },
          { name: '[zdFabIcon]', description: 'Replaces the default + / × glyph. Decorative.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/fab',
    typesCode: `export type ZdFabArrangement = 'single' | 'vertical' | 'flower';
export type ZdFabCorner = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';`,
  },
  accessibility: {
    description:
      'A disclosure button and a named group of native actions: not a menu, so the browser’s Tab order and activation apply.',
    features: [
      {
        title: 'Two names',
        body: 'label names the closed trigger and the group; closeLabel names the open trigger.',
      },
      {
        title: 'Name icon actions',
        body: 'Circular actions need aria-label. A Tooltip describes them for sighted pointer users.',
      },
      {
        title: 'Not the only way',
        body: 'Without JavaScript the group can’t open. Keep essential actions reachable elsewhere.',
      },
      {
        title: 'Focus comes home',
        body: 'Escape, or choosing an action, closes the group and returns focus to the trigger.',
      },
    ],
    keyboard: {
      caption: 'FAB keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Enter / Space', action: 'On the trigger, opens or closes the actions' },
        { key: 'Tab', action: 'Moves through the actions in DOM order; leaving closes them' },
        { key: 'Escape', action: 'Closes the actions and returns focus to the trigger' },
      ],
    },
  },
  customization: {
    description:
      'Style hooks are zd-fab, .zd-fab-trigger, .zd-fab-actions and [data-zd-fab-action]. Spacing and the flower radius are custom properties on the instance.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `zd-fab.roomy {
  --zd-fab-gap: 1rem;    /* default 0.75rem */
  --zd-fab-radius: 11rem; /* default 9rem, flower only */
}`,
    },
  },
  ssr: 'The server renders the trigger and a hidden, inert action group with stable ids. Opening needs hydration.',
};

export const fabPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'arrangement',
    options: choices(['single', 'vertical', 'flower']),
    defaultValue: 'vertical',
    omit: ['vertical'],
  },
  {
    kind: 'choice',
    key: 'corner',
    options: choices(['bottom-end', 'bottom-start', 'top-end', 'top-start']),
    defaultValue: 'bottom-end',
    omit: ['bottom-end'],
  },
  { kind: 'boolean', key: 'disabled', defaultValue: false },
];

export const fabPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-fab label="Create" inline${attributes}>
  <ng-template zdFabActions>
    <button type="button" zdButton layout="circle" zdFabAction aria-label="Draft">D</button>
    <button type="button" zdButton layout="circle" zdFabAction aria-label="Upload">U</button>
    <button type="button" zdButton layout="circle" zdFabAction aria-label="Note">N</button>
  </ng-template>
</zd-fab>`,
};

export const speedDialCode = `<zd-fab label="Create" closeLabel="Close create actions">
  <ng-template zdFabActions>
    <button type="button" zdButton zdFabAction (click)="create('draft')">Draft</button>
    <button type="button" zdButton zdFabAction (click)="create('template')">Template</button>
    <!-- keepOpen: activating it leaves the group open -->
    <button type="button" zdButton zdFabAction keepOpen (click)="preview()">Preview</button>
  </ng-template>
</zd-fab>`;

export const flowerCode = `<zd-fab label="Share" arrangement="flower">
  <ng-template zdFabActions>
    <button type="button" zdButton layout="circle" zdFabAction
            aria-label="Email" zdTooltip="Email" tooltipSide="start">E</button>
    <button type="button" zdButton layout="circle" zdFabAction
            aria-label="Copy link" zdTooltip="Copy link" tooltipSide="start">C</button>
    <button type="button" zdButton layout="circle" zdFabAction
            aria-label="Print" zdTooltip="Print" tooltipSide="start">P</button>
  </ng-template>
</zd-fab>`;

export const singleCode = `<!-- No actions template: the trigger is the action -->
<zd-fab label="New note" arrangement="single" (mainAction)="createNote()">
  <span zdFabIcon aria-hidden="true">✎</span>
</zd-fab>`;
