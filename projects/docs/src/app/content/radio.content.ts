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
  sizeControl,
  sizeRow,
  sizesCode,
  tailwindSource,
} from './form-controls.content';

/**
 * Radio reference content. Mirrors projects/components/radio/src/radio.ts and
 * docs/components/radio.md — update them together.
 */

export const radioReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Radio',
  maturity: 'planned',
  description:
    'daisyUI radio styling for native radio inputs. zdRadio adds classes only; inputs that share a name still own exclusive selection, arrow-key movement, validation and form submission.',
  facts: controlFacts('input[type="radio"][zdRadio]', 'radio', 'radio'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdRadio } from '@pranxy/zordon-ui/radio';`,
    stylesCode: tailwindSource(modifierClasses('radio')),
  },
  playgroundDescription:
    'Color and size are the only inputs. The group is native: Tab into it, then use the arrow keys.',
  api: {
    description:
      'ZdRadio is a standalone directive with two optional signal inputs. There is no group component: a shared name is the group.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Radio inputs',
        columns: apiColumns,
        rows: [colorRow('ZdRadioColor', 'radio'), sizeRow('ZdRadioSize', 'radio')],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/radio',
    typesCode: colorAndSizeTypes('ZdRadio'),
  },
  accessibility: {
    description: 'Native radios already form a group with one tab stop and arrow-key selection.',
    features: [
      {
        title: 'Name the group',
        body: 'Put related radios in a fieldset. Its legend names the group for every option.',
      },
      {
        title: 'Label every option',
        body: 'Wrap each input in a label, or point a label at it with for.',
      },
      {
        title: 'No extra ARIA',
        body: 'Do not add role="radio", role="radiogroup" or aria-checked; the inputs already expose them.',
      },
      {
        title: 'Disabled, not read-only',
        body: 'Radios have no read-only state. Disable a choice that must not change.',
      },
    ],
    keyboard: {
      caption: 'Keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Tab', action: 'Moves into the group, onto the checked option' },
        { key: '↓ →', action: 'Selects the next option (↑ ← the previous)' },
        { key: 'Space', action: 'Selects the focused option if none is checked' },
      ],
    },
  },
  customization: { description: nativeCustomization },
  ssr: nativeSsr,
};

export const radioPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  disabledControl,
];

export const radioPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<fieldset>
  <legend>Delivery</legend>
  <label><input type="radio" zdRadio${attributes} name="delivery" value="standard" checked /> Standard</label>
  <label><input type="radio" zdRadio${attributes} name="delivery" value="express" /> Express</label>
</fieldset>`,
};

export const deliveryOptions = ['standard', 'express'] as const;

export const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
] as const;

export const groupFiles = [
  {
    label: 'plan.html',
    language: 'html' as const,
    code: `<fieldset>
  <legend>Plan</legend>
  @for (option of plans; track option.value) {
    <label>
      <input type="radio" zdRadio color="primary" name="plan"
             [value]="option.value" [formControl]="plan" />
      {{ option.label }}
    </label>
  }
</fieldset>`,
  },
  {
    label: 'plan.ts',
    language: 'ts' as const,
    code: `readonly plan = new FormControl('pro', { nonNullable: true });`,
  },
];

export const radioColorsCode = colorsCode(
  color =>
    `<input type="radio" zdRadio color="${color}" name="${color}" aria-label="${color}" checked />`,
);

export const radioSizesCode = sizesCode(
  size =>
    `<input type="radio" zdRadio size="${size}" name="${size}" aria-label="${size}" checked />`,
);
