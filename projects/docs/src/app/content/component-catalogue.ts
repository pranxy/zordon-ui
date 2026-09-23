import type { DocsMaturity } from '../site-catalog';

/**
 * The 68-component v1 catalogue index, used by navigation (eagerly loaded, so keep it small).
 * Card summaries live in component-summaries.ts, which only the catalogue page loads.
 *
 * Categories and order follow the master component matrix in DAISYUI_ANGULAR_BUILD_PLAN.md.
 * Maturity follows docs/contributing/component-maturity.md: rows without a recorded label are
 * Planned. Preview labels come from the component documentation in docs/components/.
 * Update this file together with the matrix whenever a maturity changes.
 */

export type ComponentCategory =
  'Actions' | 'Data display' | 'Navigation' | 'Feedback' | 'Data input' | 'Layout' | 'Mockups';

export interface CatalogueEntry {
  readonly id: string;
  readonly name: string;
  readonly category: ComponentCategory;
  readonly maturity: DocsMaturity;
  /** Present only when a reference page exists. */
  readonly path?: string;
}

export const componentCategories: readonly ComponentCategory[] = [
  'Actions',
  'Data display',
  'Navigation',
  'Feedback',
  'Data input',
  'Layout',
  'Mockups',
];

type EntryInput = readonly [id: string, name: string, maturity?: DocsMaturity];

function group(category: ComponentCategory, entries: readonly EntryInput[]): CatalogueEntry[] {
  return entries.map(([id, name, maturity = 'planned']) => ({
    id,
    name,
    category,
    maturity,
    ...(id === 'button' ? { path: '/components/button' } : {}),
  }));
}

export const catalogueEntries: readonly CatalogueEntry[] = [
  ...group('Actions', [
    ['button', 'Button'],
    ['dropdown', 'Dropdown', 'preview'],
    ['fab', 'FAB / Speed Dial'],
    ['modal', 'Modal'],
    ['swap', 'Swap', 'preview'],
    ['theme-controller', 'Theme Controller'],
  ]),
  ...group('Data display', [
    ['accordion', 'Accordion'],
    ['avatar', 'Avatar'],
    ['aura', 'Aura'],
    ['badge', 'Badge'],
    ['card', 'Card'],
    ['carousel', 'Carousel', 'preview'],
    ['chat-bubble', 'Chat Bubble'],
    ['collapse', 'Collapse', 'preview'],
    ['countdown', 'Countdown'],
    ['diff', 'Diff'],
    ['hover-3d', 'Hover 3D Card'],
    ['hover-gallery', 'Hover Gallery'],
    ['kbd', 'Kbd', 'preview'],
    ['list', 'List'],
    ['stat', 'Stat'],
    ['status', 'Status'],
    ['table', 'Table'],
    ['text-rotate', 'Text Rotate'],
    ['timeline', 'Timeline'],
  ]),
  ...group('Navigation', [
    ['breadcrumbs', 'Breadcrumbs'],
    ['dock', 'Dock'],
    ['link', 'Link'],
    ['megamenu', 'Megamenu', 'preview'],
    ['menu', 'Menu', 'preview'],
    ['navbar', 'Navbar'],
    ['pagination', 'Pagination'],
    ['steps', 'Steps'],
    ['tabs', 'Tabs'],
  ]),
  ...group('Feedback', [
    ['alert', 'Alert'],
    ['loading', 'Loading'],
    ['progress', 'Progress'],
    ['radial-progress', 'Radial Progress'],
    ['skeleton', 'Skeleton'],
    ['toast', 'Toast'],
    ['tooltip', 'Tooltip'],
  ]),
  ...group('Data input', [
    ['calendar', 'Calendar', 'preview'],
    ['checkbox', 'Checkbox'],
    ['fieldset', 'Fieldset'],
    ['file-input', 'File Input'],
    ['filter', 'Filter'],
    ['label', 'Label'],
    ['radio', 'Radio'],
    ['range', 'Range'],
    ['rating', 'Rating'],
    ['select', 'Select'],
    ['text-input', 'Text Input'],
    ['textarea', 'Textarea'],
    ['toggle', 'Toggle'],
    ['validator', 'Validator'],
    ['otp', 'OTP'],
  ]),
  ...group('Layout', [
    ['divider', 'Divider'],
    ['drawer', 'Drawer'],
    ['footer', 'Footer'],
    ['hero', 'Hero'],
    ['indicator', 'Indicator'],
    ['join', 'Join'],
    ['mask', 'Mask'],
    ['stack', 'Stack'],
  ]),
  ...group('Mockups', [
    ['browser-mockup', 'Browser Mockup'],
    ['code-mockup', 'Code Mockup'],
    ['phone-mockup', 'Phone Mockup'],
    ['window-mockup', 'Window Mockup'],
  ]),
];

/** Stable slug for a category, e.g. "Data display" → "data-display". */
export function categorySlug(category: ComponentCategory): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function entriesInCategory(category: ComponentCategory): readonly CatalogueEntry[] {
  return catalogueEntries.filter(entry => entry.category === category);
}

export function maturityCounts(
  entries: readonly CatalogueEntry[] = catalogueEntries,
): Readonly<Record<DocsMaturity, number>> {
  const counts: Record<DocsMaturity, number> = {
    planned: 0,
    experimental: 0,
    preview: 0,
    stable: 0,
  };
  for (const entry of entries) counts[entry.maturity]++;
  return counts;
}
