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
  ghostVariantControl,
  ghostVariantRow,
  modifierClasses,
  nativeCustomization,
  nativeSsr,
  plannedNotice,
  zdSizeControl,
  zdSizeRow,
  sizesCode,
  tailwindSource,
} from './form-controls.content';

/**
 * Text Input reference content. Mirrors projects/components/text-input/src/text-input.ts and
 * docs/components/text-input.md — update them together.
 */

export const textInputReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Text Input',
  maturity: 'planned',
  description:
    'daisyUI input styling for a native input of any text type. zdTextInput adds classes only: typing, selection, autofill, constraints and Angular Forms stay with the browser.',
  facts: controlFacts('input[zdTextInput]', 'input', 'text-input'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdTextInput } from '@pranxy/zordon-ui/text-input';`,
    stylesCode: tailwindSource(modifierClasses('input', { extra: ['input-ghost'] })),
  },
  playgroundDescription: 'Color, size and the ghost variant. The field is real; type in it.',
  api: {
    description:
      'ZdTextInput is a standalone directive with three optional signal inputs. Native attributes, including `size` and `style`, stay yours.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Text Input inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdTextInputColor', 'input'),
          zdSizeRow('ZdTextInputSize', 'input', 'sets the width in characters'),
          ghostVariantRow('ZdTextInputVariant', 'input'),
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/text-input',
    typesCode: `${colorAndSizeTypes('ZdTextInput')}
export type ZdTextInputVariant = 'ghost';`,
  },
  accessibility: {
    description: 'A native input is already accessible. Labels, help and errors are yours.',
    features: [
      {
        title: 'A visible label',
        body: 'Use a label element, not only a placeholder, which disappears as soon as someone types.',
      },
      {
        title: 'Describe and report',
        body: 'Connect help and error text with aria-describedby, and set aria-invalid only while an error is shown.',
      },
      {
        title: 'Color is not the message',
        body: 'color="error" is a hint, not an explanation. Always say what is wrong in text.',
      },
      {
        title: 'Help autofill',
        body: 'Pick the right type and autocomplete tokens so browsers and password managers can fill the field.',
      },
    ],
  },
  customization: {
    description: `${nativeCustomization} Prefix icons, clear buttons and add-ons are layout you compose around the input.`,
  },
  ssr: nativeSsr,
};

export const textInputPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  zdSizeControl,
  ghostVariantControl,
  disabledControl,
];

export const textInputPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label for="name">Full name</label>
<input id="name" zdTextInput${attributes} autocomplete="name" />`,
};

export const validationFiles = [
  {
    label: 'email.html',
    language: 'html' as const,
    code: `<label for="email">Work email</label>
<input id="email" type="email" zdTextInput autocomplete="email"
       [formControl]="email"
       [color]="showError() ? 'error' : undefined"
       [attr.aria-invalid]="showError()"
       aria-describedby="email-help" />
<small id="email-help">
  {{ showError() ? 'Enter an email address like ada@example.com.' : 'We only use it to sign you in.' }}
</small>`,
  },
  {
    label: 'email.ts',
    language: 'ts' as const,
    code: `readonly email = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.email],
});
// Show the error once the field has been left, not while typing the first character.`,
  },
];

export const inputTypes = [
  { type: 'search', label: 'Search', autocomplete: 'off' },
  { type: 'password', label: 'Password', autocomplete: 'current-password' },
  { type: 'number', label: 'Quantity', autocomplete: 'off' },
  { type: 'date', label: 'Start date', autocomplete: 'off' },
] as const;

export const typesCode = inputTypes
  .map(
    field =>
      `<label for="${field.type}">${field.label}</label>
<input id="${field.type}" type="${field.type}" zdTextInput autocomplete="${field.autocomplete}" />`,
  )
  .join('\n');

export const textInputColorsCode = colorsCode(
  color => `<input zdTextInput color="${color}" aria-label="${color}" placeholder="${color}" />`,
);

export const textInputSizesCode = sizesCode(
  size => `<input zdTextInput zdSize="${size}" aria-label="${size}" placeholder="${size}" />`,
);
