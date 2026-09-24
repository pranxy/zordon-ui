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
 * Checkbox reference content. Mirrors projects/components/checkbox/src/checkbox.ts and
 * docs/components/checkbox.md — update them together.
 */

export const checkboxReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Checkbox',
  maturity: 'planned',
  description:
    'daisyUI checkbox styling for the native checkbox you already write. zdCheckbox adds classes only: checked state, keyboard, labels and Angular Forms stay with the platform.',
  facts: controlFacts('input[type="checkbox"][zdCheckbox]', 'checkbox', 'checkbox'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdCheckbox } from '@pranxy/zordon-ui/checkbox';`,
    stylesCode: tailwindSource(modifierClasses('checkbox')),
  },
  playgroundDescription:
    'Color and size are the only inputs. The checkbox itself is real: click it or press Space.',
  api: {
    description: 'ZdCheckbox is a standalone directive with two optional signal inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Checkbox inputs',
        columns: apiColumns,
        rows: [colorRow('ZdCheckboxColor', 'checkbox'), sizeRow('ZdCheckboxSize', 'checkbox')],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/checkbox',
    typesCode: colorAndSizeTypes('ZdCheckbox'),
  },
  accessibility: {
    description: 'The native checkbox already has the role, state and keyboard behaviour.',
    features: [
      {
        title: 'Always labelled',
        body: 'Wrap the input in a label, or point a label at it with for. The label text is its accessible name.',
      },
      {
        title: 'No extra ARIA',
        body: 'Do not add role="checkbox" or aria-checked: the input already exposes both, including the mixed state.',
      },
      {
        title: 'Disabled, not read-only',
        body: 'A checkbox has no read-only state. Use disabled when a value must not change.',
      },
      {
        title: 'Groups get a legend',
        body: 'Related checkboxes belong in a fieldset whose legend names the group.',
      },
    ],
    keyboard: {
      caption: 'Keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: 'Tab', action: 'Moves focus to the checkbox' },
        { key: 'Space', action: 'Toggles it' },
      ],
    },
  },
  customization: {
    description: nativeCustomization,
    code: {
      label: 'styles.css',
      language: 'css',
      code: `/* daisyUI reads the check colour from its theme variables */
.terms-checkbox {
  --color-primary: var(--color-success);
}`,
    },
  },
  ssr: nativeSsr,
};

export const checkboxPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  disabledControl,
];

export const checkboxPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label>
  <input type="checkbox" zdCheckbox${attributes} checked />
  Email me product updates
</label>`,
};

export const checkboxColorsCode = colorsCode(
  color => `<input type="checkbox" zdCheckbox color="${color}" aria-label="${color}" checked />`,
);

export const checkboxSizesCode = sizesCode(
  size => `<input type="checkbox" zdCheckbox size="${size}" aria-label="${size}" checked />`,
);

export const mixedStateFiles = [
  {
    label: 'toppings.html',
    language: 'html' as const,
    code: `<label>
  <input type="checkbox" zdCheckbox
         [checked]="all()" [indeterminate]="some()" (change)="toggleAll()" />
  All toppings
</label>
@for (topping of toppings; track topping) {
  <label>
    <input type="checkbox" zdCheckbox
           [checked]="chosen().has(topping)" (change)="toggle(topping)" />
    {{ topping }}
  </label>
}`,
  },
  {
    label: 'toppings.ts',
    language: 'ts' as const,
    code: `readonly chosen = signal(new Set(['Basil']));
readonly all = computed(() => this.chosen().size === this.toppings.length);
readonly some = computed(() => this.chosen().size > 0 && !this.all());`,
  },
];

export const formsFiles = [
  {
    label: 'terms.html',
    language: 'html' as const,
    code: `<label>
  <input type="checkbox" zdCheckbox color="primary"
         [formControl]="terms" aria-describedby="terms-help" />
  I accept the terms
</label>
<p id="terms-help">Required to continue.</p>`,
  },
  {
    label: 'terms.ts',
    language: 'ts' as const,
    code: `readonly terms = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });`,
  },
];

export const toppings = ['Basil', 'Mozzarella', 'Olives'] as const;
