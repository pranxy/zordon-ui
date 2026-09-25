import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, controlSizes, plannedNotice } from './form-controls.content';

/**
 * Tabs reference content. Mirrors projects/components/tabs/src/tabs.ts and docs/components/tabs.md
 * — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const tabsReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Tabs',
  maturity: 'planned',
  description:
    'A tablist with panels, built on Angular Aria for roles and keyboard support. Selection is yours to accept, and tabs can be closed, reordered or kept in the URL.',
  facts: controlFacts('zd-tabs', 'tabs tab', 'tabs'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component, plus the content directive for templated panels. Tabs packages its own styles.',
    importCode: `import { ZdTabContent, ZdTabs, type ZdTabItem } from '@pranxy/zordon-ui/tabs';`,
  },
  playgroundDescription:
    'Focus a tab and use the arrow keys, Home and End. Manual activation waits for Enter or Space.',
  api: {
    description:
      'A standalone component driven by items and an accepted activeId. Requests are outputs; nothing changes until you update the inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Tabs inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'items',
            type: 'readonly ZdTabItem[]',
            default: '[]',
            description: 'id, label, and optional content, disabled, closable.',
          },
          {
            name: 'activeId',
            type: 'string | null',
            default: 'null',
            description: 'The accepted tab; falls back to the first enabled one.',
          },
          { name: 'label', type: 'string', default: "'Tabs'", description: 'Tablist name.' },
          {
            name: 'variant / size',
            type: 'ZdTabsVariant / ZdSize',
            default: "'border' / 'md'",
            description: '`box`, `border` or `lift`; `xs` to `xl`.',
          },
          {
            name: 'orientation',
            type: 'ZdOrientation',
            default: "'horizontal'",
            description: 'Vertical tabs use Up and Down.',
          },
          {
            name: 'activation',
            type: 'ZdTabsActivation',
            default: "'automatic'",
            description: '`automatic` follows focus; `manual` waits for Enter or Space.',
          },
          {
            name: 'lazy / preserveContent',
            type: 'boolean',
            default: 'true / false',
            description: 'Create panels on first view; keep visited panels alive.',
          },
          {
            name: 'reorderable',
            type: 'boolean',
            default: 'false',
            description: 'Shows earlier and later buttons for the selected tab.',
          },
          {
            name: 'queryParam',
            type: 'string | null',
            default: 'null',
            description: 'Keeps the selection in this query parameter; the URL wins.',
          },
          {
            name: 'wrap / disabled / labels',
            type: 'boolean / ZdTabsLabels',
            default: 'true / false',
            description: 'Arrow wrapping, whole-widget disabling, close and move button names.',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs and content',
        caption: 'Tabs outputs and content',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'activeIdChange',
            description: 'A tab was requested. Update activeId to accept.',
          },
          {
            name: 'closeRequest',
            description: '`{ id, nextId }` for a closable tab; remove it from items to accept.',
          },
          {
            name: 'reorder',
            description: '`{ id, fromIndex, toIndex, items }`; set items to accept.',
          },
          {
            name: 'ng-template[zdTabContent]',
            description: 'Panel template; context is the item, plus `active`.',
          },
          { name: 'currentId()', description: 'The accepted enabled tab, or null.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/tabs',
    typesCode: `export interface ZdTabItem {
  readonly id: string;
  readonly label: string;
  readonly content?: string;
  readonly disabled?: boolean;
  readonly closable?: boolean;
}
export type ZdTabsVariant = 'box' | 'border' | 'lift';
export type ZdTabsActivation = 'automatic' | 'manual';
export interface ZdTabClose { readonly id: string; readonly nextId: string | null }`,
  },
  accessibility: {
    description:
      'Angular Aria provides tablist, tab and tabpanel roles, their relationships and roving focus.',
    features: [
      {
        title: 'One Tab stop',
        body: 'Tab enters the tablist once, then moves into the panel; arrows move between tabs.',
      },
      {
        title: 'Manual when costly',
        body: 'Use manual activation when a tab loads data or needs approval.',
      },
      {
        title: 'Named extra buttons',
        body: 'Close, earlier and later buttons sit outside the tablist, with names like "Close Billing".',
      },
      {
        title: 'Not for pages',
        body: 'Tabs switch panels. Use links and navigation components to move between routes.',
      },
    ],
    keyboard: {
      caption: 'Tabs keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: '← / →', action: 'Previous or next tab (↑ / ↓ when vertical), following direction' },
        { key: 'Home / End', action: 'First or last enabled tab' },
        { key: 'Enter / Space', action: 'Activates the focused tab in manual mode' },
        { key: 'Delete', action: 'Requests closing a closable tab' },
      ],
    },
  },
  customization: {
    description:
      'Tabs packages its geometry, indicators and overflow, and uses the theme’s base colors and radii, so it works without extra daisyUI CSS.',
    code: {
      label: 'account.html',
      language: 'html',
      code: `<zd-tabs label="Account" [items]="sections" queryParam="tab" variant="lift" />`,
    },
  },
  ssr: 'The server renders the tablist and the accepted panel. Keyboard support needs hydration; ids are generated in the same order on server and client.',
};

export const tabsPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'variant',
    options: choices(['border', 'box', 'lift']),
    defaultValue: 'border',
    omit: ['border'],
  },
  {
    kind: 'choice',
    key: 'size',
    options: choices(controlSizes),
    defaultValue: 'md',
    omit: ['md'],
  },
  {
    kind: 'choice',
    key: 'activation',
    options: choices(['automatic', 'manual']),
    defaultValue: 'automatic',
    omit: ['automatic'],
  },
];

export const tabsPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-tabs
  label="Project"
  [items]="tabs"
  [activeId]="active()"
  (activeIdChange)="active.set($event)"${attributes.replace(/ (?=\S)/g, '\n  ')}
/>`,
};

export const templateFiles = [
  {
    label: 'editors.html',
    language: 'html' as const,
    code: `<zd-tabs label="Editors" [items]="tabs" [(activeId)]="active" preserveContent>
  <ng-template zdTabContent let-item>
    <label>{{ item.label }} notes <textarea></textarea></label>
  </ng-template>
</zd-tabs>`,
  },
];

export const closeFiles = [
  {
    label: 'workspace.html',
    language: 'html' as const,
    code: `<zd-tabs
  label="Open files"
  reorderable
  [items]="files()"
  [activeId]="active()"
  (activeIdChange)="active.set($event)"
  (closeRequest)="close($event)"
  (reorder)="files.set($event.items)"
/>`,
  },
  {
    label: 'workspace.ts',
    language: 'ts' as const,
    code: `protected close(event: ZdTabClose): void {
  this.files.update(files => files.filter(file => file.id !== event.id));
  if (this.active() === event.id) this.active.set(event.nextId);
}`,
  },
];
