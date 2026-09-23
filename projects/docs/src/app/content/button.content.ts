import type { DocsChipOption } from '../ui/reference/chip-group.component';
import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type { DocsCodeFile } from '../ui/code/code-tabs.component';
import type { PlaygroundControl } from '../ui/reference/playground.component';

/**
 * Button reference content. Names, types and defaults mirror
 * projects/components/button/src/button.ts — update both together.
 */

export const buttonFacts: readonly DocsMetaItem[] = [
  { label: 'Selector', value: 'button[zdButton], a[href][zdButton], input[zdButton]', mono: true },
  { label: 'daisyUI class', value: 'btn', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/button', mono: true },
  {
    label: 'Source',
    value: 'button.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/button/src/button.ts',
    mono: true,
  },
];

export const importCode = `import { ZdButton } from '@pranxy/zordon-ui/button';`;

const swatch = (color: string): string => `var(--color-${color})`;

export const colorOptions: readonly DocsChipOption[] = [
  { value: 'default', label: 'default', swatch: 'transparent' },
  ...['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'].map(
    color => ({ value: color, label: color, swatch: swatch(color) }),
  ),
];

export const variantOptions: readonly DocsChipOption[] = [
  'solid',
  'soft',
  'outline',
  'dash',
  'ghost',
  'link',
].map(value => ({ value, label: value }));

export const sizeOptions: readonly DocsChipOption[] = ['xs', 'sm', 'md', 'lg', 'xl'].map(value => ({
  value,
  label: value,
}));

export const playgroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'color',
    options: colorOptions,
    defaultValue: 'primary',
    omit: ['default'],
  },
  {
    kind: 'choice',
    key: 'variant',
    options: variantOptions,
    defaultValue: 'solid',
    omit: ['solid'],
  },
  { kind: 'choice', key: 'size', options: sizeOptions, defaultValue: 'md', omit: ['md'] },
  { kind: 'boolean', key: 'loading', defaultValue: false },
  { kind: 'boolean', key: 'disabled', defaultValue: false },
];

export const exampleColors = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const;

export const colorsCode = `<button zdButton>Default</button>
<button zdButton color="neutral">Neutral</button>
<button zdButton color="primary">Primary</button>
<button zdButton color="secondary">Secondary</button>
<!-- accent · info · success · warning · error -->`;

export const exampleVariants = ['outline', 'dash', 'soft', 'ghost', 'link'] as const;

export const variantsCode = `<button zdButton color="primary">Solid</button>
<button zdButton color="primary" variant="soft">Soft</button>
<button zdButton color="primary" variant="outline">Outline</button>
<button zdButton color="primary" variant="dash">Dash</button>
<button zdButton variant="ghost">Ghost</button>
<button zdButton color="primary" variant="link">Link</button>`;

export const exampleSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const sizesCode = `<button zdButton color="primary" size="xs">xs</button>
<button zdButton color="primary" size="sm">sm</button>
<button zdButton color="primary">md</button>
<button zdButton color="primary" size="lg">lg</button>
<button zdButton color="primary" size="xl">xl</button>`;

export const loadingFiles: readonly DocsCodeFile[] = [
  {
    label: 'save-button.html',
    language: 'html',
    code: `<button zdButton color="primary" [loading]="saving()" (click)="save()">
  @if (saving()) {
    <span class="loading loading-spinner loading-xs"></span> Saving…
  } @else {
    Save changes
  }
</button>`,
  },
  {
    label: 'save-button.ts',
    language: 'ts',
    code: `protected readonly saving = signal(false);

protected async save(): Promise<void> {
  this.saving.set(true);
  try {
    await this.api.save();
  } finally {
    this.saving.set(false);
  }
}`,
  },
];

export const linksCode = `<a zdButton color="primary" href="/components">Open catalogue</a>
<a zdButton color="primary" href="/resources" [zdDisabled]="!canUpgrade()">Upgrade plan</a>`;

export const inputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const inputRows: readonly DocsTableRow[] = [
  {
    name: 'color',
    type: 'ZdColor',
    default: 'undefined',
    description: 'daisyUI colour role. Omit for the base button.',
  },
  {
    name: 'variant',
    type: 'ZdButtonVariant',
    default: 'undefined',
    description:
      'Adds `btn-outline`, `btn-dash`, `btn-soft`, `btn-ghost` or `btn-link`. Omit for solid.',
  },
  {
    name: 'size',
    type: 'ZdSize',
    default: 'undefined',
    description: 'One size from `xs` to `xl`, shared with other controls so rows align.',
  },
  {
    name: 'layout',
    type: 'ZdButtonLayout',
    default: 'undefined',
    description:
      'One of `wide`, `block`, `square` or `circle`. Icon-only layouts need an accessible name.',
  },
  {
    name: 'active',
    type: 'boolean',
    default: 'false',
    description: 'Visual active state only; it never creates toggle semantics.',
  },
  {
    name: 'pressed',
    type: 'boolean | null',
    default: 'undefined',
    description: 'Reflects a controlled `aria-pressed` state for a real toggle.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description:
      'Pending presentation. Guards activation and sets `aria-disabled` while staying focusable.',
  },
  {
    name: 'zdDisabled',
    type: 'boolean',
    default: 'false',
    description:
      'For linked `<a>` hosts: guards activation and reflects `aria-disabled`. On `<button>` use the native `disabled`.',
  },
];

export const typesCode = `export type ZdColor =
  | 'neutral' | 'primary' | 'secondary' | 'accent'
  | 'info' | 'success' | 'warning' | 'error';

export type ZdSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ZdButtonVariant = 'outline' | 'dash' | 'soft' | 'ghost' | 'link';

export type ZdButtonLayout = 'wide' | 'block' | 'square' | 'circle';`;

export const accessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'Role comes from the element',
    body: 'Use a native button, a linked anchor, or a button-like input. Buttons act; anchors navigate.',
  },
  {
    title: 'Pending keeps focus',
    body: 'loading sets aria-disabled but leaves the button focusable. It does not add aria-busy; mark the busy region and say what is pending in the label.',
  },
  {
    title: 'Icon-only needs a name',
    body: 'Square and circle layouts without visible text need an aria-label supplied by the consumer.',
  },
  {
    title: 'Active is not pressed',
    body: 'active is visual only. Use pressed for a real toggle so aria-pressed is announced.',
  },
];

export const keyboardColumns: readonly DocsTableColumn[] = [
  { key: 'key', label: 'Key', kind: 'kbd' },
  { key: 'button', label: 'Button' },
  { key: 'anchor', label: 'Anchor' },
];

export const keyboardRows: readonly DocsTableRow[] = [
  { key: 'Enter', button: 'Activates', anchor: 'Follows the link' },
  { key: 'Space', button: 'Activates on release', anchor: 'Scrolls the page (native)' },
  {
    key: 'Tab',
    button: 'Focusable unless `disabled`',
    anchor: 'Focusable; guarded when `zdDisabled`',
  },
];

export const themingColumns: readonly DocsTableColumn[] = [
  { key: 'variable', label: 'Variable', kind: 'name' },
  { key: 'controls', label: 'Controls' },
];

export const themingRows: readonly DocsTableRow[] = [
  { variable: '--btn-color', controls: 'Fill colour, derived from `color`' },
  { variable: '--btn-fg', controls: 'Label colour' },
  { variable: '--size', controls: 'Height, from `size`' },
  { variable: '--btn-p', controls: 'Inline padding' },
  { variable: '--radius-field', controls: 'Corner radius, set by the theme' },
];

export const themingCode = `/* Denser buttons inside toolbars only */
.toolbar [zdButton] {
  --size: 2rem;
  --btn-p: 0.625rem;
}`;
