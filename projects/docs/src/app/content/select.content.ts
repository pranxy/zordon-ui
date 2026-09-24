import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  apiColumns,
  colorAndSizeTypes,
  colorControl,
  colorRow,
  colorsCode,
  controlFacts,
  disabledControl,
  modifierClasses,
  nativeCustomization,
  nativeSsr,
  plannedNotice,
  ghostVariantControl,
  ghostVariantRow,
  zdSizeControl,
  zdSizeRow,
  sizesCode,
  tailwindSource,
} from './form-controls.content';

/**
 * Select reference content. Mirrors projects/components/select/src/select.ts and
 * docs/components/select.md — update them together.
 */

export const selectReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Select',
  maturity: 'planned',
  description:
    'daisyUI styling for a native select. zdSelect adds classes only: options, option groups, keyboard selection, the platform picker and Angular Forms stay with the browser.',
  facts: controlFacts('select[zdSelect]', 'select', 'select'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdSelect } from '@pranxy/zordon-ui/select';`,
    stylesCode: tailwindSource(modifierClasses('select', { extra: ['select-ghost'] })),
  },
  playgroundDescription: 'Color, size and the ghost variant. The picker is the browser’s own.',
  api: {
    description:
      'ZdSelect is a standalone directive with three optional signal inputs. Native attributes, including `size` for visible rows, stay yours. Searchable, async or tagging choices are a different component, not this directive.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Select inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdSelectColor', 'select'),
          zdSizeRow('ZdSelectSize', 'select', 'sets the number of visible rows'),
          ghostVariantRow('ZdSelectVariant', 'select'),
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/select',
    typesCode: `${colorAndSizeTypes('ZdSelect')}
export type ZdSelectVariant = 'ghost';`,
  },
  accessibility: {
    description: 'A native select is fully accessible, including on touch devices.',
    features: [
      {
        title: 'A visible label',
        body: 'Use a label element. A first "Choose…" option is not a label.',
      },
      {
        title: 'Group long lists',
        body: 'optgroup labels are announced with their options and make long lists easier to scan.',
      },
      {
        title: 'Disabled options stay visible',
        body: 'Disable an option that is unavailable rather than removing it, when knowing it exists helps.',
      },
      {
        title: 'Native pickers',
        body: 'Phones show their own picker. Don’t replace it unless you need search or rich options.',
      },
    ],
    keyboard: {
      caption: 'Keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: '↓ ↑', action: 'Changes the selected option (opens the list on some platforms)' },
        { key: 'A–Z', action: 'Jumps to the matching option' },
        { key: 'Space', action: 'Opens the list (Alt + ↓ on Windows)' },
      ],
    },
  },
  customization: { description: nativeCustomization },
  ssr: nativeSsr,
};

export const selectPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  zdSizeControl,
  ghostVariantControl,
  disabledControl,
];

export const selectPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label for="environment">Environment</label>
<select id="environment" zdSelect${attributes}>
  <option value="development">Development</option>
  <option value="staging">Staging</option>
  <option value="production">Production</option>
</select>`,
};

export const regions = [
  {
    label: 'Europe',
    options: [
      { value: 'eu-west', label: 'Ireland' },
      { value: 'eu-central', label: 'Frankfurt' },
      { value: 'eu-south', label: 'Milan (full)', disabled: true },
    ],
  },
  {
    label: 'Americas',
    options: [
      { value: 'us-east', label: 'Virginia' },
      { value: 'sa-east', label: 'São Paulo' },
    ],
  },
] as const;

export const formsFiles = [
  {
    label: 'region.html',
    language: 'html' as const,
    code: `<label for="region">Region</label>
<select id="region" zdSelect [formControl]="region">
  @for (group of regions; track group.label) {
    <optgroup [label]="group.label">
      @for (option of group.options; track option.value) {
        <option [value]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
      }
    </optgroup>
  }
</select>`,
  },
  {
    label: 'region.ts',
    language: 'ts' as const,
    code: `readonly region = new FormControl('eu-west', { nonNullable: true });`,
  },
];

export const channels = ['Email', 'SMS', 'Push', 'Slack'] as const;

export const multipleCode = `<label for="channels">Channels</label>
<select id="channels" zdSelect multiple size="4" [formControl]="channels">
  @for (channel of channels; track channel) {
    <option [value]="channel">{{ channel }}</option>
  }
</select>
<!-- Ctrl or Cmd + click, or Shift + arrows, selects several. size="4" is the native rows attribute. -->`;

export const selectColorsCode = colorsCode(
  color =>
    `<select zdSelect color="${color}" aria-label="${color}"><option>${color}</option></select>`,
);

export const selectSizesCode = sizesCode(
  size =>
    `<select zdSelect zdSize="${size}" aria-label="${size}"><option>${size}</option></select>`,
);
