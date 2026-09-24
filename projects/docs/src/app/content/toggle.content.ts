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
 * Toggle reference content. Mirrors projects/components/toggle/src/toggle.ts and
 * docs/components/toggle.md — update them together.
 */

export const toggleReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Toggle',
  maturity: 'planned',
  description:
    'A native checkbox styled as a daisyUI switch. zdToggle adds classes only, so checked state, keyboard, form submission and Angular Forms work exactly as they do for any checkbox.',
  facts: controlFacts('input[type="checkbox"][zdToggle]', 'toggle', 'toggle'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdToggle } from '@pranxy/zordon-ui/toggle';`,
    stylesCode: tailwindSource(modifierClasses('toggle')),
  },
  playgroundDescription: 'Color and size are the only inputs. Click the switch or press Space.',
  api: {
    description: 'ZdToggle is a standalone directive with two optional signal inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Toggle inputs',
        columns: apiColumns,
        rows: [colorRow('ZdToggleColor', 'toggle'), sizeRow('ZdToggleSize', 'toggle')],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/toggle',
    typesCode: colorAndSizeTypes('ZdToggle'),
  },
  accessibility: {
    description:
      'It stays a checkbox: screen readers announce checked or not checked, and Space toggles it.',
    features: [
      {
        title: 'Label the setting',
        body: 'The label should name the setting ("Email notifications"), not the action ("Turn on").',
      },
      {
        title: 'Checkbox semantics',
        body: 'The input keeps the checkbox role. Add role="switch" yourself only if you want on/off wording and have tested it.',
      },
      {
        title: 'Apply immediately, or not',
        body: 'If a toggle takes effect at once, say so nearby; if it waits for a Save button, make that visible.',
      },
      {
        title: 'Disabled, not read-only',
        body: 'Like any checkbox, a toggle has no read-only state. Disable it when it must not change.',
      },
    ],
  },
  customization: { description: nativeCustomization },
  ssr: nativeSsr,
};

export const togglePlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  disabledControl,
];

export const togglePlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label>
  <input type="checkbox" zdToggle${attributes} checked />
  Email notifications
</label>`,
};

export const settings = [
  { key: 'email', label: 'Email notifications' },
  { key: 'digest', label: 'Weekly digest' },
  { key: 'beta', label: 'Beta features' },
] as const;

export const settingsFiles = [
  {
    label: 'settings.html',
    language: 'html' as const,
    code: `<fieldset [formGroup]="settings">
  <legend>Notifications</legend>
  <label><input type="checkbox" zdToggle color="success" formControlName="email" /> Email notifications</label>
  <label><input type="checkbox" zdToggle color="success" formControlName="digest" /> Weekly digest</label>
  <label><input type="checkbox" zdToggle color="success" formControlName="beta" /> Beta features</label>
</fieldset>`,
  },
  {
    label: 'settings.ts',
    language: 'ts' as const,
    code: `readonly settings = new FormGroup({
  email: new FormControl(true, { nonNullable: true }),
  digest: new FormControl(false, { nonNullable: true }),
  beta: new FormControl(false, { nonNullable: true }),
});`,
  },
];

export const toggleColorsCode = colorsCode(
  color => `<input type="checkbox" zdToggle color="${color}" aria-label="${color}" checked />`,
);

export const toggleSizesCode = sizesCode(
  size => `<input type="checkbox" zdToggle size="${size}" aria-label="${size}" checked />`,
);
