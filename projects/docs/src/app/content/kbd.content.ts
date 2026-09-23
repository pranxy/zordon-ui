import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type { PlaygroundControl } from '../ui/reference/playground.component';

/**
 * Kbd reference content. Names, types and defaults mirror
 * projects/components/kbd/src/kbd.ts and docs/components/kbd.md — update them together.
 */

export const kbdFacts: readonly DocsMetaItem[] = [
  { label: 'Selector', value: 'kbd[zdKbd]', mono: true },
  { label: 'daisyUI class', value: 'kbd', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/kbd', mono: true },
  {
    label: 'Source',
    value: 'kbd.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/kbd/src/kbd.ts',
    mono: true,
  },
];

export const kbdImportCode = `import { ZdKbd } from '@pranxy/zordon-ui/kbd';`;

export const kbdSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const kbdPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'size',
    options: [
      { value: 'default', label: 'default' },
      ...kbdSizes.map(size => ({ value: size, label: size })),
    ],
    defaultValue: 'default',
    omit: ['default'],
  },
];

export const kbdSizesCode = `<kbd zdKbd size="xs">Esc</kbd>
<kbd zdKbd size="sm">Esc</kbd>
<kbd zdKbd size="md">Esc</kbd>
<kbd zdKbd size="lg">Esc</kbd>
<kbd zdKbd size="xl">Esc</kbd>`;

export const kbdInTextCode = `<p>Press <kbd zdKbd size="sm">/</kbd> to search the documentation.</p>`;

export const kbdCombinationCode = `<span aria-label="Control plus Shift plus Delete">
  <kbd zdKbd aria-hidden="true">Ctrl</kbd> +
  <kbd zdKbd aria-hidden="true">Shift</kbd> +
  <kbd zdKbd aria-hidden="true">Del</kbd>
</span>`;

export const kbdInputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const kbdInputRows: readonly DocsTableRow[] = [
  {
    name: 'size',
    type: 'ZdKbdSize',
    default: 'undefined',
    description:
      'Adds one `kbd-*` size class, `xs` to `xl`. Omit for daisyUI’s medium default. Invalid values throw instead of producing an uncompiled class.',
  },
];

export const kbdTypesCode = `export type ZdKbdSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';`;

export const kbdAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'A label, not a control',
    body: 'Kbd adds no role, focus, events or ARIA. Put actions on a real button or link, never on the keycap.',
  },
  {
    title: 'Name combinations',
    body: 'Symbols like ⌘ or ⇧ read poorly. Give the group an aria-label that spells the shortcut out, and hide the individual keys.',
  },
  {
    title: 'Platform labels are yours',
    body: 'Choose Ctrl or ⌘, translate key names and separators. Kbd preserves whatever content you provide.',
  },
  {
    title: 'Check contrast per theme',
    body: 'Keycaps use base-200 and base-content. Custom themes are responsible for readable contrast.',
  },
];

export const kbdThemingColumns: readonly DocsTableColumn[] = [
  { key: 'variable', label: 'Variable', kind: 'name' },
  { key: 'controls', label: 'Controls' },
];

export const kbdThemingRows: readonly DocsTableRow[] = [
  { variable: '--size', controls: 'Minimum height and width, from `size`' },
  { variable: '--radius-field', controls: 'Corner radius, set by the theme' },
  { variable: '--color-base-200', controls: 'Keycap fill' },
];

export const kbdThemingCode = `<!-- Utilities and responsive size classes stay additive -->
<kbd zdKbd size="lg" class="rounded-md px-3 sm:kbd-xl">⌘ K</kbd>`;
