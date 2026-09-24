import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Collapse reference content. Mirrors projects/components/collapse/src/collapse.ts and
 * docs/components/collapse.md — update them together.
 */

export const collapseFacts: readonly DocsMetaItem[] = [
  { label: 'Root', value: '[zdCollapse]', mono: true },
  { label: 'Parts', value: '[zdCollapseTitle], [zdCollapseContent]', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/collapse', mono: true },
  {
    label: 'Source',
    value: 'collapse.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/collapse/src/collapse.ts',
    mono: true,
  },
];

export const collapseImportCode = `import { ZdCollapse, ZdCollapseContent, ZdCollapseTitle } from '@pranxy/zordon-ui/collapse';`;

export const collapseSourceCode = `/* Tailwind can't see classes added at runtime; list the ones you use */
@source inline("collapse collapse-title collapse-content collapse-arrow collapse-plus");`;

export const collapsePlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'indicator',
    options: [
      { value: 'none', label: 'none' },
      { value: 'arrow', label: 'arrow' },
      { value: 'plus', label: 'plus' },
    ],
    defaultValue: 'arrow',
    omit: ['none'],
  },
];

export const collapsePlaygroundSnippet: PlaygroundTemplateSnippet = {
  render:
    attributes => `<details zdCollapse${attributes} class="bg-base-100 border border-base-300">
  <summary zdCollapseTitle>How is the value submitted?</summary>
  <div zdCollapseContent>As a native boolean through the form control.</div>
</details>`,
};

export const detailsCode = `<details zdCollapse indicator="arrow" open>
  <summary zdCollapseTitle>Shipping</summary>
  <div zdCollapseContent>Orders ship within two business days.</div>
</details>`;

export const indicatorsCode = `<details zdCollapse indicator="arrow">…</details>
<details zdCollapse indicator="plus">…</details>
<details zdCollapse>…</details> <!-- no indicator -->`;

export const forcedStateCode = `<!-- Not <details>: a focusable div whose state you control -->
<div zdCollapse indicator="plus" [forcedState]="expanded() ? 'open' : 'close'">
  <div zdCollapseTitle>Release notes</div>
  <div zdCollapseContent>…</div>
</div>
<button zdButton (click)="expanded.set(!expanded())" [attr.aria-expanded]="expanded()">
  Toggle notes
</button>`;

export const groupCode = `@for (faq of faqs; track faq.id) {
  <details zdCollapse indicator="plus">
    <summary zdCollapseTitle>{{ faq.question }}</summary>
    <div zdCollapseContent>{{ faq.answer }}</div>
  </details>
}`;

export const collapseFaqs = [
  { id: 'returns', question: 'Can I return an item?', answer: 'Yes, within 30 days of delivery.' },
  { id: 'exchange', question: 'Can I exchange a size?', answer: 'Yes, exchanges are free.' },
  { id: 'refund', question: 'When is my refund issued?', answer: 'Within five days of receipt.' },
] as const;

const directiveColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Directive', kind: 'name' },
  { key: 'description', label: 'Adds' },
];

export const collapseDirectives = {
  columns: directiveColumns,
  rows: [
    {
      name: '[zdCollapse]',
      description: '`collapse`, plus the indicator and forced-state modifiers.',
    },
    {
      name: '[zdCollapseTitle]',
      description: '`collapse-title`. Use it on `<summary>` inside `<details>`.',
    },
    { name: '[zdCollapseContent]', description: '`collapse-content`.' },
  ] satisfies readonly DocsTableRow[],
};

const inputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const collapseInputs = {
  columns: inputColumns,
  rows: [
    {
      name: 'indicator',
      type: 'ZdCollapseIndicator',
      default: 'undefined',
      description: '`arrow` or `plus`. Omit for no indicator.',
    },
    {
      name: 'forcedState',
      type: 'ZdCollapseForcedState',
      default: 'undefined',
      description:
        '`open` or `close` for non-`<details>` hosts only; daisyUI ignores it on `<details>`. Invalid values throw.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const collapseTypesCode = `export type ZdCollapseIndicator = 'arrow' | 'plus';
export type ZdCollapseForcedState = 'open' | 'close';`;

export const collapseAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'Prefer native details',
    body: 'details and summary give you keyboard toggling, state announcement and find-in-page for free.',
  },
  {
    title: 'You own the state',
    body: 'Collapse adds classes only: no open model, outputs, IDs or ARIA. Bind the native open attribute if you need it.',
  },
  {
    title: 'Not an accordion',
    body: 'Independent disclosures are not a grouped accordion widget. Use Accordion when one item should close another.',
  },
  {
    title: 'Label custom patterns',
    body: 'A focusable div or checkbox pattern needs your own labels, focus order and state text.',
  },
];

export const collapseCustomizationCode = `<details zdCollapse indicator="arrow" class="bg-base-200 rounded-box">
  <summary zdCollapseTitle class="font-semibold">Styled with utilities</summary>
  <div zdCollapseContent class="text-sm">Your classes are kept alongside Zordon's.</div>
</details>`;
