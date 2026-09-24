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
 * Range reference content. Mirrors projects/components/range/src/range.ts and
 * docs/components/range.md — update them together.
 */

export const rangeReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Range',
  maturity: 'planned',
  description:
    'daisyUI styling for a native range input. zdRange adds classes only: min, max, step, arrow keys, the value and Angular Forms stay with the browser.',
  facts: controlFacts('input[type="range"][zdRange]', 'range', 'range'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the classes it adds with Tailwind.',
    importCode: `import { ZdRange } from '@pranxy/zordon-ui/range';`,
    stylesCode: tailwindSource(modifierClasses('range', { extra: ['range-vertical'] })),
  },
  playgroundDescription:
    'Color, size and vertical layout. Drag the thumb, or focus it and use the arrow keys.',
  api: {
    description:
      'ZdRange is a standalone directive with three optional signal inputs. There is no dual-thumb mode.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Range inputs',
        columns: apiColumns,
        rows: [
          colorRow('ZdRangeColor', 'range'),
          sizeRow('ZdRangeSize', 'range'),
          {
            name: 'vertical',
            type: 'boolean',
            default: 'false',
            description:
              'Adds `range-vertical`, which turns the track with `writing-mode`. daisyUI sizes the fill in `cqh` units, so wrap the input in an element with `container-type: size` and a height.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/range',
    typesCode: colorAndSizeTypes('ZdRange'),
  },
  accessibility: {
    description: 'The native slider already exposes its value, bounds and keyboard support.',
    features: [
      {
        title: 'Label and value',
        body: 'Label the input, and show the current value as text, for example in an output element.',
      },
      {
        title: 'Friendly announcements',
        body: 'When the number alone is unclear, set aria-valuetext ("40 percent") to what should be read.',
      },
      {
        title: 'Ticks are hints',
        body: 'A datalist suggests values; the step attribute is what actually limits them.',
      },
      {
        title: 'Big enough to grab',
        body: 'Small sizes have small thumbs. Prefer md or larger for touch.',
      },
    ],
    keyboard: {
      caption: 'Keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: '← ↓', action: 'Decreases by one step (→ ↑ increase)' },
        { key: 'PageDown', action: 'Decreases by a larger amount (PageUp increases)' },
        { key: 'Home', action: 'Minimum (End: maximum)' },
      ],
    },
  },
  customization: {
    description: `${nativeCustomization} daisyUI exposes the thumb and fill through custom properties such as --range-thumb and --range-fill.`,
  },
  ssr: nativeSsr,
};

const verticalControl: PlaygroundControl = {
  kind: 'boolean',
  key: 'vertical',
  defaultValue: false,
};

export const rangePlaygroundControls: readonly PlaygroundControl[] = [
  colorControl,
  sizeControl,
  verticalControl,
  disabledControl,
];

export const rangePlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const input = `<input id="brightness" type="range" zdRange${attributes} min="0" max="100" value="60" />`;
    return attributes.includes(' vertical')
      ? `<label for="brightness">Brightness</label>
<span class="level-track">
  ${input}
</span>`
      : `<label for="brightness">Brightness</label>
${input}`;
  },
};

export const valueFiles = [
  {
    label: 'volume.html',
    language: 'html' as const,
    code: `<label for="volume">Volume</label>
<input id="volume" type="range" zdRange color="primary" min="0" max="100"
       [formControl]="volume" [attr.aria-valuetext]="volume.value + ' percent'" />
<output for="volume">{{ volume.value }}%</output>`,
  },
  {
    label: 'volume.ts',
    language: 'ts' as const,
    code: `readonly volume = new FormControl(40, { nonNullable: true });`,
  },
];

export const tickValues = [0, 25, 50, 75, 100] as const;

export const ticksCode = `<label for="quality">Quality</label>
<input id="quality" type="range" zdRange min="0" max="100" step="25" list="quality-ticks" />
<datalist id="quality-ticks">
  <option value="0"></option><option value="25"></option><option value="50"></option>
  <option value="75"></option><option value="100"></option>
</datalist>`;

export const verticalFiles = [
  {
    label: 'level.html',
    language: 'html' as const,
    code: `<span class="level-track">
  <input type="range" zdRange vertical color="accent" aria-label="Level" />
</span>`,
  },
  {
    label: 'level.css',
    language: 'css' as const,
    code: `/* daisyUI measures the vertical fill in cqh units, so give it a size container */
.level-track {
  display: block;
  container-type: size;
  block-size: 10rem;
  inline-size: 2rem;
}`,
  },
];

export const rangeColorsCode = colorsCode(
  color => `<input type="range" zdRange color="${color}" aria-label="${color}" value="60" />`,
);

export const rangeSizesCode = sizesCode(
  size => `<input type="range" zdRange size="${size}" aria-label="${size}" value="60" />`,
);
