import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Accordion reference content. Mirrors projects/components/accordion/src/accordion.ts and
 * docs/components/accordion.md — update them together.
 */

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const accordionReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Accordion',
  maturity: 'planned',
  description:
    'Grouped expandable sections built on Angular Aria: native headings and buttons, arrow-key movement between triggers, and optional lazy panels.',
  facts: controlFacts('[zdAccordion]', 'collapse', 'accordion'),
  notice: plannedNotice,
  install: {
    description:
      'Import every part your template uses. Items use daisyUI’s collapse classes; register them with Tailwind.',
    importCode: `import {
  ZdAccordion,
  ZdAccordionContent,
  ZdAccordionHeading,
  ZdAccordionItem,
  ZdAccordionPanel,
  ZdAccordionTrigger,
} from '@pranxy/zordon-ui/accordion';`,
    stylesCode: tailwindSource(
      'collapse collapse-open collapse-close collapse-title collapse-content collapse-arrow collapse-plus',
    ),
  },
  playgroundDescription:
    'Tab to a trigger, then use the arrow keys, Home and End. With one-at-a-time, opening an item closes the others.',
  api: {
    description:
      'A group directive, an item component and four parts. Each trigger names its panel through the panel’s `aria` reference.',
    tables: [
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Accordion parts and inputs',
        columns: [
          { key: 'name', label: 'Part', kind: 'name' },
          { key: 'description', label: 'Inputs and members' },
        ],
        rows: [
          {
            name: '[zdAccordion]',
            description:
              '`multiExpandable` (true), `disabled`, `softDisabled` (true), `wrap`; `expandAll()`, `collapseAll()`.',
          },
          {
            name: 'zd-accordion-item',
            description: '`indicator`: `arrow` (default), `plus`, `custom` or `none`.',
          },
          {
            name: '[zdAccordionHeading]',
            description: 'On your native heading; you choose its level.',
          },
          {
            name: 'button[zdAccordionTrigger]',
            description:
              'Required `panel`; `id`, `disabled`, `[(expanded)]`; `expand()`, `collapse()`, `toggle()`.',
          },
          {
            name: 'zd-accordion-panel',
            description: '`id`, `preserveContent`; `aria` reference for the trigger, `visible()`.',
          },
          {
            name: 'ng-template[zdAccordionContent]',
            description: 'Lazy panel content, created when the panel opens.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'Angular Aria wires each trigger to its panel with aria-expanded and aria-controls and handles the group keys.',
    features: [
      {
        title: 'Real headings',
        body: 'Each trigger sits in a native heading, so the sections show up in heading navigation.',
      },
      {
        title: 'Stable ids',
        body: 'Give triggers and panels fixed ids for SSR and deep links.',
      },
      {
        title: 'Closed means inert',
        body: 'Closed panels are hidden and inert, including preserved lazy content.',
      },
      {
        title: 'Soft disabled',
        body: 'Disabled items stay focusable and discoverable by default; turn softDisabled off to skip them.',
      },
    ],
    keyboard: {
      caption: 'Accordion keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Enter / Space', action: 'Expands or collapses the focused section' },
        { key: '↓ / ↑', action: 'Next or previous trigger (wraps when wrap is on)' },
        { key: 'Home / End', action: 'First or last trigger' },
      ],
    },
  },
  customization: {
    description:
      'Colors, borders, spacing and heading levels are yours. For a no-JavaScript accordion, use Collapse on native details elements instead.',
    code: {
      label: 'faq.html',
      language: 'html',
      code: `<!-- Native alternative: works before hydration -->
<details zdCollapse name="faq">…</details>
<details zdCollapse name="faq">…</details>`,
    },
  },
  ssr: 'Eagerly projected content is in the server HTML; triggers become interactive after hydration. Keep initial expanded states and ids the same on server and client.',
};

export const accordionPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'indicator',
    options: choices(['arrow', 'plus', 'none']),
    defaultValue: 'arrow',
    omit: ['arrow'],
  },
  { kind: 'boolean', key: 'oneAtATime', defaultValue: true },
];

export const accordionPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const indicator = /indicator="(\w+)"/.exec(attributes)?.[1];
    const item = indicator ? ` indicator="${indicator}"` : '';
    const group = attributes.includes('oneAtATime') ? ' [multiExpandable]="false"' : '';
    return `<section zdAccordion${group} aria-label="Shipping questions">
  <zd-accordion-item${item}>
    <h3 zdAccordionHeading>
      <button zdAccordionTrigger id="returns-trigger" [panel]="returns.aria">Returns</button>
    </h3>
    <zd-accordion-panel #returns="zdAccordionPanel" id="returns-panel">
      <p>Return any item within 30 days.</p>
    </zd-accordion-panel>
  </zd-accordion-item>
  <!-- …more items -->
</section>`;
  },
};

export const lazyCode = `<zd-accordion-panel #billing="zdAccordionPanel" id="billing" [preserveContent]="true">
  <ng-template zdAccordionContent>
    <app-billing-editor />
  </ng-template>
</zd-accordion-panel>`;

export const controlledFiles = [
  {
    label: 'settings.html',
    language: 'html' as const,
    code: `<section zdAccordion #group="zdAccordion" aria-label="Settings">
  <zd-accordion-item>
    <h3 zdAccordionHeading>
      <button zdAccordionTrigger id="profile-trigger" [panel]="profile.aria"
              [(expanded)]="profileOpen">Profile</button>
    </h3>
    <zd-accordion-panel #profile="zdAccordionPanel" id="profile-panel">…</zd-accordion-panel>
  </zd-accordion-item>
</section>
<button type="button" (click)="group.expandAll()">Expand all</button>
<button type="button" (click)="group.collapseAll()">Collapse all</button>`,
  },
  {
    label: 'settings.ts',
    language: 'ts' as const,
    code: `protected readonly profileOpen = signal(true);`,
  },
];
