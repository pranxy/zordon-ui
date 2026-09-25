import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  colorControl,
  controlFacts,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Steps reference content. Mirrors projects/components/steps/src/steps.ts and
 * docs/components/steps.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const stepsReference: DocsReference = {
  eyebrow: 'Navigation',
  heading: 'Steps',
  maturity: 'planned',
  description:
    'A named ordered list of process steps with visible status text. Display-only by default; interactive steps are native buttons, and your wizard decides every move.',
  facts: controlFacts('zd-steps', 'steps', 'steps'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component. It packages its own geometry; register the step color modifiers you use.',
    importCode: `import { ZdSteps, type ZdStep } from '@pranxy/zordon-ui/steps';`,
    stylesCode: tailwindSource(modifierClasses('step', { sizes: false }).replace(/^step /, '')),
  },
  playgroundDescription:
    'Status text keeps color from being the only cue. Horizontal steps scroll when there isn’t room, and turn vertical below 48rem unless responsive is off.',
  api: {
    description:
      'A standalone component driven by items and an accepted currentId. It never changes the current step itself.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs and outputs',
        caption: 'Steps inputs and outputs',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'items',
            type: 'readonly ZdStep[]',
            default: '[]',
            description: 'Steps in order, with unique ids and labels.',
          },
          {
            name: 'currentId',
            type: 'string | null',
            default: 'null',
            description: 'The accepted current step; `[(currentId)]` accepts requests.',
          },
          {
            name: 'currentIdChange',
            type: 'string',
            default: '—',
            description: 'A button asked for this step. Leave currentId unchanged to refuse.',
          },
          {
            name: 'interactive',
            type: 'boolean',
            default: 'false',
            description: 'Native buttons instead of plain labels.',
          },
          {
            name: 'linear',
            type: 'boolean',
            default: 'false',
            description: 'Forward requests only when every earlier step is complete.',
          },
          {
            name: 'orientation',
            type: 'ZdOrientation',
            default: "'horizontal'",
            description: '`horizontal` or `vertical`.',
          },
          {
            name: 'responsive',
            type: 'boolean',
            default: 'true',
            description: 'Horizontal becomes vertical below 48rem.',
          },
          {
            name: 'color',
            type: 'ZdColor',
            default: "'primary'",
            description: 'Current-step color; items can override it.',
          },
          {
            name: 'label / labels',
            type: 'string / ZdStepsLabels',
            default: "'Progress'",
            description: 'List name, and the status words (complete, current, …).',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Disables every step button.',
          },
        ],
      },
      {
        id: 'item',
        heading: 'Step fields',
        caption: 'Step item fields',
        columns: [
          { key: 'name', label: 'Field', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'id / label', description: 'Required identity and visible name.' },
          { name: 'description', description: 'Supporting text under the label.' },
          { name: 'state', description: '`complete`, `upcoming` (default) or `error`.' },
          { name: 'disabled', description: 'Unavailable, with visible "unavailable" text.' },
          { name: 'color / icon', description: 'Marker color, and a decorative icon template.' },
          { name: 'controls', description: 'Id of the wizard panel the button controls.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/steps',
    typesCode: `export type ZdStepState = 'complete' | 'current' | 'upcoming' | 'error';
export interface ZdStep {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly state?: Exclude<ZdStepState, 'current'>;
  readonly disabled?: boolean;
  readonly color?: ZdColor;
  readonly icon?: TemplateRef<ZdStepIconContext>;
  readonly controls?: string;
}`,
  },
  accessibility: {
    description:
      'An ordered list with aria-current="step". Each button is named by its label, description and status text.',
    features: [
      {
        title: 'Not tabs',
        body: 'Steps have no tab roles or arrow keys. Use Tabs for panels that switch freely.',
      },
      {
        title: 'Words for state',
        body: '"Complete", "Current", "Error" and "Unavailable" are visible and read, not just colors.',
      },
      {
        title: 'Focus the panel',
        body: 'After accepting a step, move focus to its panel heading; Steps doesn’t.',
      },
      {
        title: 'Read-only works',
        body: 'Without interactive, the tracker is plain list content that needs no JavaScript.',
      },
    ],
  },
  customization: {
    description:
      'Markers show a check, an exclamation or the step number unless you supply an icon template. Colors come from the theme.',
    code: {
      label: 'labels.ts',
      language: 'ts',
      code: `protected readonly labels: ZdStepsLabels = {
  complete: 'Concluído', current: 'Atual', upcoming: 'A seguir',
  error: 'Erro', disabled: 'Indisponível',
};`,
    },
  },
  ssr: 'The server renders labels, status text and the current marker; read-only trackers are complete without JavaScript. Step buttons need hydration.',
};

export const stepsPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'orientation',
    options: choices(['horizontal', 'vertical']),
    defaultValue: 'vertical',
    omit: ['horizontal'],
  },
  colorControl,
  { kind: 'boolean', key: 'interactive', defaultValue: false },
];

export const stepsPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes =>
    `<zd-steps label="Order progress" [items]="steps" currentId="shipped"${attributes} />`,
};

export const wizardFiles = [
  {
    label: 'checkout.html',
    language: 'html' as const,
    code: `<zd-steps label="Checkout" [items]="steps()" [(currentId)]="current" interactive linear />
<section id="details-panel" [hidden]="current() !== 'details'">…</section>
<section id="delivery-panel" [hidden]="current() !== 'delivery'">…</section>
<section id="review-panel" [hidden]="current() !== 'review'">…</section>`,
  },
  {
    label: 'checkout.ts',
    language: 'ts' as const,
    code: `protected readonly current = signal<string | null>('details');
protected readonly done = signal(new Set<string>());
protected readonly steps = computed<readonly ZdStep[]>(() => [
  { id: 'details', label: 'Details', controls: 'details-panel', state: this.state('details') },
  { id: 'delivery', label: 'Delivery', controls: 'delivery-panel', state: this.state('delivery') },
  { id: 'review', label: 'Review', controls: 'review-panel' },
]);

protected continue(from: string, to: string): void {
  this.done.update(done => new Set(done).add(from));
  this.current.set(to);
}`,
  },
];

export const statesCode = `protected readonly steps: readonly ZdStep[] = [
  { id: 'upload', label: 'Upload', state: 'complete' },
  { id: 'scan', label: 'Virus scan', description: 'Blocked file found', state: 'error' },
  { id: 'publish', label: 'Publish', disabled: true },
];`;
