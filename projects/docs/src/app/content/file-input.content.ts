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
  sizeControl,
  sizeRow,
  sizesCode,
  tailwindSource,
} from './form-controls.content';

/**
 * File Input reference content. Mirrors projects/components/file-input/src/file-input.ts and
 * docs/components/file-input.md — update them together.
 */

export const fileInputReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'File Input',
  maturity: 'planned',
  description:
    'daisyUI styling for a native file input. zdFileInput adds classes only: the picker, accept, multiple, capture, validation and form submission stay with the browser.',
  facts: controlFacts('input[type="file"][zdFileInput]', 'file-input', 'file-input'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdFileInput } from '@pranxy/zordon-ui/file-input';`,
    stylesCode: tailwindSource(modifierClasses('file-input', { extra: ['file-input-ghost'] })),
  },
  playgroundDescription:
    'Color, size and the ghost variant. Choosing a file opens your system picker; nothing is uploaded.',
  api: {
    description:
      'ZdFileInput is a standalone directive with three optional signal inputs. It has no value model: selected files belong to the browser.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'File Input inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdFileInputColor', 'file-input'),
          sizeRow('ZdFileInputSize', 'file-input'),
          ghostVariantRow('ZdFileInputVariant', 'file-input'),
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/file-input',
    typesCode: `${colorAndSizeTypes('ZdFileInput')}
export type ZdFileInputVariant = 'ghost';`,
  },
  accessibility: {
    description: 'The native input already has an accessible button, name and keyboard support.',
    features: [
      {
        title: 'Label it',
        body: 'Use a label element. The browser adds the "Choose file" button text itself, in the user’s language.',
      },
      {
        title: 'Say what is accepted',
        body: 'accept filters the picker, but people still need the formats and limits in text, connected with aria-describedby.',
      },
      {
        title: 'Announce the result',
        body: 'Show what was chosen in text near the input, especially for multiple files.',
      },
      {
        title: 'No fake value',
        body: 'Browsers forbid setting a file programmatically. Don’t try to restore a selection with Forms.',
      },
    ],
  },
  customization: {
    description: `${nativeCustomization} Drag and drop, previews, upload progress and size checks are compositions you build around the input.`,
  },
  ssr: nativeSsr,
};

export const fileInputPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  ghostVariantControl,
  disabledControl,
];

export const fileInputPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label for="avatar">Profile photo</label>
<input id="avatar" type="file" zdFileInput${attributes} accept="image/*" />`,
};

export const selectionFiles = [
  {
    label: 'attachments.html',
    language: 'html' as const,
    code: `<label for="attachments">Attachments</label>
<input id="attachments" type="file" zdFileInput multiple accept=".pdf,image/*"
       aria-describedby="attachments-help" (change)="choose($event)" />
<p id="attachments-help">PDF or images, up to 5 files.</p>
<p role="status">{{ chosen().join(', ') || 'No files chosen' }}</p>`,
  },
  {
    label: 'attachments.ts',
    language: 'ts' as const,
    code: `readonly chosen = signal<string[]>([]);

choose(event: Event): void {
  const files = (event.target as HTMLInputElement).files ?? [];
  this.chosen.set(Array.from(files, file => file.name));
}`,
  },
];

export const fileInputColorsCode = colorsCode(
  color => `<input type="file" zdFileInput color="${color}" aria-label="${color}" />`,
);

export const fileInputSizesCode = sizesCode(
  size => `<input type="file" zdFileInput size="${size}" aria-label="${size}" />`,
);
