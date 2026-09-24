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
  ghostStyleControl,
  ghostStyleRow,
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
 * Textarea reference content. Mirrors projects/components/textarea/src/textarea.ts and
 * docs/components/textarea.md — update them together.
 */

export const textareaReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Textarea',
  maturity: 'planned',
  description:
    'daisyUI styling for a native textarea. zdTextarea adds classes only; rows, resizing, constraints and Angular Forms stay with the browser.',
  facts: controlFacts('textarea[zdTextarea]', 'textarea', 'textarea'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdTextarea } from '@pranxy/zordon-ui/textarea';`,
    stylesCode: tailwindSource(modifierClasses('textarea', { extra: ['textarea-ghost'] })),
  },
  playgroundDescription:
    'Color, size and the ghost style. Type in it, or drag the corner to resize.',
  api: {
    description: 'ZdTextarea is a standalone directive with three optional signal inputs.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Textarea inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdTextareaColor', 'textarea'),
          sizeRow('ZdTextareaSize', 'textarea'),
          ghostStyleRow('ZdTextareaStyle', 'textarea'),
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/textarea',
    typesCode: `${colorAndSizeTypes('ZdTextarea')}
export type ZdTextareaStyle = 'ghost';`,
  },
  accessibility: {
    description: 'A native textarea is already accessible. Labels, limits and errors are yours.',
    features: [
      {
        title: 'A visible label',
        body: 'Use a label element; a placeholder is not a label and disappears while typing.',
      },
      {
        title: 'Announce limits politely',
        body: 'A character count read on every keystroke is noisy. Describe the limit, and update the count visibly.',
      },
      {
        title: 'Keep resizing',
        body: 'Let people enlarge the field. Removing resize makes long text harder to review.',
      },
      {
        title: 'Errors in words',
        body: 'Pair color="error" with text connected through aria-describedby.',
      },
    ],
  },
  customization: {
    description: `${nativeCustomization} Auto-growing height is a policy you add yourself, for example with field-sizing: content where supported.`,
    code: {
      label: 'styles.css',
      language: 'css',
      code: `/* Grow with the content in browsers that support it */
.notes {
  field-sizing: content;
  min-block-size: 5lh;
}`,
    },
  },
  ssr: nativeSsr,
};

export const textareaPlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  ghostStyleControl,
  disabledControl,
];

export const textareaPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label for="notes">Release notes</label>
<textarea id="notes" zdTextarea${attributes} rows="3"></textarea>`,
};

export const noteLimit = 140;

export const characterCountFiles = [
  {
    label: 'summary.html',
    language: 'html' as const,
    code: `<label for="summary">Summary</label>
<textarea id="summary" zdTextarea rows="3" maxlength="140"
          aria-describedby="summary-count" [formControl]="summary"></textarea>
<small id="summary-count">{{ summary.value.length }} of 140 characters</small>`,
  },
  {
    label: 'summary.ts',
    language: 'ts' as const,
    code: `readonly summary = new FormControl('', { nonNullable: true });`,
  },
];

export const textareaColorsCode = colorsCode(
  color =>
    `<textarea zdTextarea color="${color}" aria-label="${color}" placeholder="${color}"></textarea>`,
);

export const textareaSizesCode = sizesCode(
  size =>
    `<textarea zdTextarea size="${size}" aria-label="${size}" placeholder="${size}"></textarea>`,
);
