import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
  PlaygroundValues,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  colorAndSizeTypes,
  colorControl,
  colorRow,
  nativeSsr,
  plannedNotice,
  sizeControl,
  sizeRow,
  sizesCode,
} from './form-controls.content';

/**
 * Filter reference content. Mirrors projects/components/filter/src/filter.ts and
 * docs/components/filter.md — update them together.
 */

export const filterVariants = ['outline', 'dash', 'soft', 'ghost', 'link'] as const;
export type FilterVariant = (typeof filterVariants)[number];

const source =
  'https://github.com/pranxy/zordon-ui/blob/master/projects/components/filter/src/filter.ts';

export const filterReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Filter',
  maturity: 'planned',
  description:
    'Native radio or checkbox inputs laid out as daisyUI filter buttons. Choosing one hides the others until the reset option brings them back; selection, keyboard and Angular Forms stay native.',
  facts: [
    { label: 'Container', value: '[zdFilter]', mono: true },
    { label: 'Options', value: 'input[zdFilterItem]', mono: true },
    { label: 'Entry point', value: '@pranxy/zordon-ui/filter', mono: true },
    { label: 'Source', value: 'filter.ts', href: source, mono: true },
  ],
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdFilter, ZdFilterItem, ZdFilterReset } from '@pranxy/zordon-ui/filter';`,
    stylesCode: `/* Tailwind can't see classes added at runtime; list the ones you use */
@source inline("filter filter-reset btn btn-primary btn-outline btn-soft btn-sm");`,
  },
  playgroundDescription:
    'Pick a framework: the other options step aside and the ✕ reset option appears. Options are button-styled inputs, so color, size and variant are Button’s.',
  api: {
    description:
      'Three standalone directives. There is no value model: the checked radio is the value.',
    tables: [
      {
        id: 'directives',
        heading: 'Directives',
        caption: 'Filter directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          {
            name: '[zdFilter]',
            description: '`filter` on the container, usually a form or a fieldset.',
          },
          {
            name: 'input[zdFilterItem]',
            note: 'radio, checkbox or reset',
            description:
              '`btn` and its modifiers. The accessible name, usually aria-label, is also the visible text.',
          },
          {
            name: 'input[type="radio"][zdFilterReset]',
            description:
              '`filter-reset`: the "all" option that shows every option again. Outside a form, use this instead of a reset input.',
          },
        ],
      },
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Filter item inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdFilterColor', 'btn'),
          sizeRow('ZdFilterSize', 'btn'),
          {
            name: 'variant',
            type: 'ZdFilterVariant',
            default: 'undefined',
            description:
              '`outline`, `dash`, `soft`, `ghost` or `link`, as for Button. Omit for solid.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/filter',
    typesCode: `${colorAndSizeTypes('ZdFilter')}
export type ZdFilterVariant = 'outline' | 'dash' | 'soft' | 'ghost' | 'link';`,
  },
  accessibility: {
    description:
      'Options are native radios, so the group keeps one tab stop and arrow-key selection.',
    features: [
      {
        title: 'Name every option',
        body: 'daisyUI shows the aria-label as the button text, so it is both the visible and the accessible name.',
      },
      {
        title: 'Name the group',
        body: 'Wrap related radios in a fieldset with a legend, even a visually hidden one.',
      },
      {
        title: 'Label the reset',
        body: 'Give the reset option a name such as "All frameworks", not just ✕.',
      },
      {
        title: 'Hidden, not removed',
        body: 'Unchosen options are hidden visually and from assistive technology; the reset option is how to reach them again.',
      },
    ],
  },
  customization: {
    description:
      'Items use Button’s daisyUI classes, so Button’s theme variables apply. Your classes and theme scopes stay on the elements.',
  },
  ssr: nativeSsr,
};

export const frameworks = ['Angular', 'Svelte', 'Vue', 'React'] as const;

const choices = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const filterPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  {
    kind: 'choice',
    key: 'variant',
    options: choices(['solid', ...filterVariants]),
    defaultValue: 'solid',
    omit: ['solid'],
  },
];

export function filterVariantOf(values: PlaygroundValues): FilterVariant | undefined {
  const value = values['variant'];
  return value === 'solid' ? undefined : (value as FilterVariant);
}

export const filterPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<fieldset zdFilter>
  <legend class="sr-only">Framework</legend>
  <input type="radio" zdFilterItem zdFilterReset name="framework" aria-label="All frameworks" checked />
  <input type="radio" zdFilterItem${attributes} name="framework" aria-label="Angular" />
  <input type="radio" zdFilterItem${attributes} name="framework" aria-label="Svelte" />
  …
</fieldset>`,
};

export const singleChoiceFiles = [
  {
    label: 'status.html',
    language: 'html' as const,
    code: `<fieldset zdFilter>
  <legend class="sr-only">Status</legend>
  <input type="radio" zdFilterItem zdFilterReset name="status" value="all"
         aria-label="All statuses" [formControl]="status" />
  @for (option of ['Open', 'Closed', 'Draft']; track option) {
    <input type="radio" zdFilterItem color="primary" name="status" [value]="option"
           [attr.aria-label]="option" [formControl]="status" />
  }
</fieldset>`,
  },
  {
    label: 'status.ts',
    language: 'ts' as const,
    code: `readonly status = new FormControl('all', { nonNullable: true });`,
  },
];

export const statuses = ['Open', 'Closed', 'Draft'] as const;

export const variantsCode = filterVariants
  .map(
    variant => `<div zdFilter>
  <input type="radio" zdFilterItem variant="${variant}" name="${variant}" aria-label="${variant}" />
</div>`,
  )
  .join('\n');

export const filterSizesCode = sizesCode(
  size => `<input type="radio" zdFilterItem size="${size}" name="${size}" aria-label="${size}" />`,
);
