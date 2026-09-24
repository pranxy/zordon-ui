import type { DocsMetaItem } from '../ui/page/meta-grid.component';
import type { DocsTableColumn, DocsTableRow } from '../ui/reference/api-table.component';
import type { PlaygroundControl, PlaygroundValues } from '../ui/reference/playground.component';

/**
 * Shared vocabulary for the native form-control reference pages (Checkbox, Radio, Toggle, Text
 * Input, Textarea, Select, Range, Rating). Each of those directives adds one daisyUI class to a
 * native element plus optional color and size modifiers, so their pages share these pieces.
 */

export const themeColors = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const;
export type ThemeColor = (typeof themeColors)[number];

export const controlSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type ControlSize = (typeof controlSizes)[number];

export const plannedNotice =
  'The entry point is implemented, but manual assistive-technology review and the remaining release gates are not complete. Treat this page as an implementation contract, not a Stable release claim.';

const repository = 'https://github.com/pranxy/zordon-ui/blob/master/projects/components';

/** Header facts: the selector, the daisyUI class, the entry point and the source file. */
export function controlFacts(
  selector: string,
  daisyClass: string,
  entry: string,
  file = entry,
): readonly DocsMetaItem[] {
  return [
    { label: 'Selector', value: selector, mono: true },
    { label: 'daisyUI class', value: daisyClass, mono: true },
    { label: 'Entry point', value: `@pranxy/zordon-ui/${entry}`, mono: true },
    {
      label: 'Source',
      value: `${file}.ts`,
      href: `${repository}/${entry}/src/${file}.ts`,
      mono: true,
    },
  ];
}

/** Every modifier class a directive can emit, for the consumer's Tailwind source list. */
export function modifierClasses(
  base: string,
  { colors = true, sizes = true, extra = [] as readonly string[] } = {},
): string {
  return [
    base,
    ...(colors ? themeColors.map(color => `${base}-${color}`) : []),
    ...(sizes ? controlSizes.map(size => `${base}-${size}`) : []),
    ...extra,
  ].join(' ');
}

export function tailwindSource(classes: string): string {
  return `/* Tailwind can't see classes added at runtime; list the ones you use */
@source inline("${classes}");`;
}

const options = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const colorControl: PlaygroundControl = {
  kind: 'choice',
  key: 'color',
  options: options(['default', ...themeColors]),
  defaultValue: 'default',
  omit: ['default'],
};

export const sizeControl: PlaygroundControl = {
  kind: 'choice',
  key: 'size',
  options: options(controlSizes),
  defaultValue: 'md',
  omit: ['md'],
};

export const disabledControl: PlaygroundControl = {
  kind: 'boolean',
  key: 'disabled',
  defaultValue: false,
};

/** Playground readers, assigned to page fields so templates can call them. */
export function colorOf(values: PlaygroundValues): ThemeColor | undefined {
  const value = values['color'];
  return value === 'default' ? undefined : (value as ThemeColor);
}

export function sizeOf(values: PlaygroundValues): ControlSize {
  return values['size'] as ControlSize;
}

export function flagOf(values: PlaygroundValues, key: string): boolean {
  return values[key] === true;
}

export const apiColumns: readonly DocsTableColumn[] = [
  { key: 'name', label: 'Input', kind: 'name' },
  { key: 'type', label: 'Type', kind: 'code' },
  { key: 'default', label: 'Default', kind: 'code' },
  { key: 'description', label: 'Description' },
];

export function colorRow(typeName: string, base: string): DocsTableRow {
  return {
    name: 'color',
    type: typeName,
    default: 'undefined',
    description: `Adds \`${base}-<color>\`: a daisyUI role, so it follows the theme. Omit for the base style.`,
  };
}

export function sizeRow(typeName: string, base: string): DocsTableRow {
  return {
    name: 'size',
    type: typeName,
    default: 'undefined',
    description: `Adds \`${base}-<size>\`, \`xs\` to \`xl\`. Omit for daisyUI's default (\`md\`).`,
  };
}

/** Text Input and Textarea name their ghost switch `style`, like the native attribute. */
export function ghostStyleRow(typeName: string, base: string): DocsTableRow {
  return {
    name: 'style',
    type: typeName,
    default: 'undefined',
    description: `\`ghost\` adds \`${base}-ghost\`: no border or background until focus. The input shares its name with the native \`style\` attribute, so with strict templates a static \`style="…"\` on the same element does not compile; use \`[style.*]\` bindings or classes for inline styles.`,
  };
}

export const ghostStyleControl: PlaygroundControl = {
  kind: 'choice',
  key: 'style',
  options: options(['default', 'ghost']),
  defaultValue: 'default',
  omit: ['default'],
};

export function styleOf(values: PlaygroundValues): 'ghost' | undefined {
  return values['style'] === 'ghost' ? 'ghost' : undefined;
}

export function colorAndSizeTypes(prefix: string): string {
  return `export type ${prefix}Color =
  | 'neutral' | 'primary' | 'secondary' | 'accent'
  | 'info' | 'success' | 'warning' | 'error';
export type ${prefix}Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';`;
}

/** Code for an example that repeats one element across the theme colors. */
export function colorsCode(element: (color: string) => string): string {
  return themeColors.map(element).join('\n');
}

/** Code for an example that repeats one element across the sizes. */
export function sizesCode(element: (size: string) => string): string {
  return controlSizes.map(element).join('\n');
}

export const nativeSsr =
  'The directive only adds classes, so the server renders the finished native control. It works before and without hydration; Angular Forms attaches on the client as usual.';

export const nativeCustomization =
  'The directive owns only its daisyUI classes. Your classes, attributes, inline style bindings and theme scopes stay on the same element, and daisyUI’s theme variables restyle every color at once.';
