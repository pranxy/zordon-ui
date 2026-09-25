import type { DocsFeature } from '../ui/page/feature-grid.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';

/**
 * Swap reference content. Mirrors projects/components/swap/src/swap.ts and
 * docs/components/swap.md — update them together.
 */

export const swapFacts: readonly DocsMetaItem[] = [
  { label: 'Root', value: 'label | button | div | span[zdSwap]', mono: true },
  { label: 'daisyUI class', value: 'swap', mono: true },
  { label: 'Entry point', value: '@pranxy/zordon-ui/swap', mono: true },
  {
    label: 'Source',
    value: 'swap.ts',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/swap/src/swap.ts',
    mono: true,
  },
];

export const swapImportCode = `import {
  ZdSwap,
  ZdSwapIndeterminate,
  ZdSwapInput,
  ZdSwapOff,
  ZdSwapOn,
} from '@pranxy/zordon-ui/swap';`;

export const swapStylesCode = `/* After daisyUI: focus, state visibility and reduced-motion rules */
@import '@pranxy/zordon-ui/swap/swap.css';

@source inline("swap swap-active swap-on swap-off swap-indeterminate swap-rotate swap-flip");`;

export const swapEffects = ['fade', 'rotate', 'flip'] as const;

export const swapPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'swapEffect',
    options: swapEffects.map(value => ({ value, label: value })),
    defaultValue: 'rotate',
    omit: ['fade'],
  },
  { kind: 'boolean', key: 'swapReadOnly', defaultValue: false },
];

export const swapPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label zdSwap${attributes}>
  <input type="checkbox" zdSwapInput aria-label="Dark mode" />
  <span zdSwapOn>☾</span>
  <span zdSwapOff>☀</span>
</label>`,
};

export const checkboxCode = `<label zdSwap swapEffect="rotate">
  <input type="checkbox" zdSwapInput [formControl]="notifications" aria-label="Notifications" />
  <span zdSwapOn>On</span>
  <span zdSwapOff>Off</span>
</label>`;

export const toggleFiles = [
  {
    label: 'mute.html',
    language: 'html' as const,
    code: `<button type="button" zdSwap swapEffect="flip" aria-label="Mute"
        [swapActive]="muted()" (swapActiveChange)="muted.set($event)">
  <span zdSwapOn>Muted</span>
  <span zdSwapOff>Sound on</span>
</button>`,
  },
  { label: 'mute.ts', language: 'ts' as const, code: `protected readonly muted = signal(false);` },
];

export const indeterminateCode = `<!-- Manual presentation: shows state, adds no role or focus -->
<div zdSwap [swapActive]="isDay()" [swapIndeterminate]="unknown()">
  <span zdSwapOn>Day</span>
  <span zdSwapOff>Night</span>
  <span zdSwapIndeterminate>Unknown</span>
</div>
<p>Sky: {{ unknown() ? 'unknown' : isDay() ? 'day' : 'night' }}</p>`;

export const effectsCode = `<label zdSwap>…</label>                 <!-- fade (default) -->
<label zdSwap swapEffect="rotate">…</label>
<label zdSwap swapEffect="flip">…</label>
<label zdSwap swapEffect="custom" class="my-transition">…</label>`;

const partColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Directive', kind: 'name' },
  { key: 'description', label: 'Role' },
];

export const swapParts = {
  columns: partColumns,
  rows: [
    {
      name: '[zdSwap]',
      description: 'Root on `label`, `button`, `div` or `span`. Adds `swap` and the effect class.',
    },
    {
      name: 'input[zdSwapInput]',
      description:
        'One direct-child checkbox before the parts. Keeps native checked state and Forms.',
    },
    {
      name: '[zdSwapOn] / [zdSwapOff]',
      description: 'Direct-child state parts. Decorative: `aria-hidden` and `inert`.',
    },
    {
      name: '[zdSwapIndeterminate]',
      description: 'Optional third state part, shown for the mixed state.',
    },
  ] satisfies readonly DocsTableRow[],
};

const inputColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input / output', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export const swapInputs = {
  columns: inputColumns,
  rows: [
    {
      name: 'swapActive',
      type: 'boolean',
      default: 'false',
      description:
        'Button and manual roots. Adds `swap-active`. With a checkbox, the input owns state.',
    },
    {
      name: 'swapIndeterminate',
      type: 'boolean',
      default: 'false',
      description:
        'Third state; wins over `swapActive`. On a button it sets `aria-pressed="mixed"`.',
    },
    {
      name: 'swapEffect',
      type: 'ZdSwapEffect',
      default: "'fade'",
      description: '`fade`, `rotate`, `flip`, or `custom` for your own transition.',
    },
    {
      name: 'swapReadOnly',
      type: 'boolean',
      default: 'false',
      description: 'Blocks user activation but stays focusable, with `aria-disabled`.',
    },
    {
      name: 'swapActiveChange',
      type: 'boolean',
      default: '—',
      description:
        'Button roots only. A request: update `swapActive` to accept, ignore it to veto.',
    },
  ] satisfies readonly DocsTableRow[],
};

export const swapTypesCode = `export type ZdSwapEffect = 'fade' | 'rotate' | 'flip' | 'custom';`;

export const swapAccessibilityNotes: readonly DocsFeature[] = [
  {
    title: 'The control is native',
    body: 'A checkbox or a button provides focus, activation and Forms. Swap never emulates keys.',
  },
  {
    title: 'One stable name',
    body: 'Name the control once ("Mute"), not per state. The button root sets aria-pressed for you.',
  },
  {
    title: 'Parts are decorative',
    body: 'State parts are aria-hidden and inert. Never put links or buttons inside them.',
  },
  {
    title: 'Manual roots show, not tell',
    body: 'A div or span root adds no role. Communicate the state in text or a separate control.',
  },
];

export const swapCustomCode = `/* swapEffect="custom": style the parts through their stable data attribute */
.my-transition [data-zd-swap-part] {
  transition: opacity 200ms, scale 200ms;
}`;
