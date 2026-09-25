import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Stat reference content. Mirrors projects/components/stat/src/stat.ts and docs/components/stat.md
 * — update them together.
 */

export const statReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Stat',
  maturity: 'planned',
  description:
    'daisyUI’s layout for key numbers: title, value, description, figure and actions on your own markup. Formatting and updates stay yours.',
  facts: controlFacts('[zdStats]', 'stats', 'stat'),
  notice: plannedNotice,
  install: {
    description: 'Import the parts your template uses, and register their classes with Tailwind.',
    importCode: `import {
  ZdStat,
  ZdStatActions,
  ZdStatDesc,
  ZdStatFigure,
  ZdStats,
  ZdStatTitle,
  ZdStatValue,
} from '@pranxy/zordon-ui/stat';`,
    stylesCode: tailwindSource(
      'stats stats-horizontal stats-vertical stat stat-title stat-value stat-desc stat-figure stat-actions',
    ),
  },
  playgroundDescription:
    'Stats sit side by side by default. Vertical stacks them; switch at a breakpoint with a responsive class.',
  api: {
    description:
      'A container directive with one input, and six part directives that add their class only.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Stats inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'orientation',
            type: 'ZdStatsOrientation',
            default: 'undefined',
            description:
              '`horizontal` or `vertical` adds `stats-<orientation>`. Omit it for daisyUI’s horizontal default.',
          },
        ],
      },
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Stat parts',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdStat]', description: '`stat`: one item inside the container.' },
          { name: '[zdStatTitle]', description: '`stat-title`: the label.' },
          { name: '[zdStatValue]', description: '`stat-value`: the number or fact.' },
          {
            name: '[zdStatDesc]',
            description: '`stat-desc`: context such as the period or trend.',
          },
          {
            name: '[zdStatFigure]',
            description: '`stat-figure`: an icon or image beside the text.',
          },
          { name: '[zdStatActions]', description: '`stat-actions`: your buttons or links.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/stat',
    typesCode: `export type ZdStatsOrientation = 'horizontal' | 'vertical';`,
  },
  accessibility: {
    description:
      'Stat adds no role, live region or focus. Choose the container semantics, such as a labelled section.',
    features: [
      {
        title: 'Label the group',
        body: 'An aria-label or heading tells people what the numbers summarise.',
      },
      {
        title: 'Trends in words',
        body: 'Say “up 12% from last month”; an arrow or a color alone is not enough.',
      },
      {
        title: 'Updates are quiet',
        body: 'Changing values are not announced. Add your own live region only when a change matters.',
      },
      {
        title: 'Keyboard scrolling',
        body: 'daisyUI lets a row of stats scroll sideways when it does not fit. Stack it on small screens, or add tabindex="0" so keyboards can scroll it.',
      },
    ],
  },
  customization: {
    description:
      'Borders, shadows, colors and alignment are utilities on the container and parts; daisyUI has no stat colors or sizes.',
    code: {
      label: 'summary.html',
      language: 'html',
      code: `<!-- Stacked on phones, side by side from lg -->
<section zdStats orientation="vertical" class="lg:stats-horizontal">…</section>`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished numbers.',
};

export const statPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'orientation',
    options: ['default', 'horizontal', 'vertical'].map(value => ({ value, label: value })),
    defaultValue: 'default',
    omit: ['default'],
  },
  { kind: 'boolean', key: 'figures', defaultValue: false },
];

export const statPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const orientation = /orientation="(\w+)"/.exec(attributes)?.[1];
    const figure = attributes.includes('figures')
      ? '\n    <div zdStatFigure aria-hidden="true">⬇</div>'
      : '';
    return `<section zdStats${orientation ? ` orientation="${orientation}"` : ''} aria-label="This month" tabindex="0">
  <div zdStat>${figure}
    <p zdStatTitle>Downloads</p>
    <p zdStatValue>31K</p>
    <p zdStatDesc>Up 12% from last month</p>
  </div>
  <!-- …more stats -->
</section>`;
  },
};

export const actionsFiles = [
  {
    label: 'balance.html',
    language: 'html' as const,
    code: `<section zdStats aria-label="Account summary">
  <div zdStat>
    <p zdStatTitle>Account balance</p>
    <p zdStatValue>{{ formatted() }}</p>
    <div zdStatActions>
      <button zdButton type="button" size="sm" (click)="addFunds()">Add €100</button>
    </div>
  </div>
</section>`,
  },
  {
    label: 'balance.ts',
    language: 'ts' as const,
    code: `const euros = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' });

protected readonly balance = signal(1280);
protected readonly formatted = computed(() => euros.format(this.balance()));

protected addFunds(): void {
  this.balance.update(value => value + 100);
}`,
  },
];
