import {
  catalogueEntries,
  componentCategories,
  type CatalogueEntry,
  type ComponentCategory,
} from './component-catalogue';

/** One-line summaries for catalogue cards, keyed by catalogue id. Loaded with the catalogue page. */
export const componentSummaries: Readonly<Record<string, string>> = {
  'button': 'daisyUI Button appearance and controlled state on native action elements.',
  'dropdown': 'Anchored menu with keyboard focus, placement, and dismissal.',
  'fab': 'Floating action button with single, vertical, and flower layouts.',
  'modal': 'Native dialog with focus trap, scroll lock, and dismissal policy.',
  'swap': 'Two-state toggle between projected content with reduced-motion handling.',
  'theme-controller': 'Theme selection controls with persistence and nested scopes.',
  'accordion': 'Grouped disclosure sections with keyboard navigation.',
  'avatar': 'Image or placeholder avatars, with group offset and presence status.',
  'aura': 'Decorative glow around an element, static under reduced motion.',
  'badge': 'Inline status label across every daisyUI color, size, and style.',
  'card': 'Surface container with body, title, actions, image, and side layouts.',
  'carousel': 'Scroll-snap slides with controls and keyboard support.',
  'chat-bubble': 'Conversation bubble with author side, avatar slot, and footer.',
  'collapse': 'Single disclosure with native details or controlled state.',
  'countdown': 'Animated numeric countdown with accessible value text.',
  'diff': 'Side-by-side comparison of two items with a resizable divider.',
  'hover-3d': 'Card that tilts toward the pointer, flat under reduced motion.',
  'hover-gallery': 'Image gallery that previews items on pointer hover.',
  'kbd': 'Keyboard key label in every daisyUI size.',
  'list': 'Vertical rows with media, content, and action columns.',
  'stat': 'Figure block with title, value, description, and figure slot.',
  'status': 'Small status dot in every daisyUI color and size.',
  'table': 'Semantic table with zebra rows, pinned headers, and responsive overflow.',
  'text-rotate': 'Rotating words with a reduced-motion fallback.',
  'timeline': 'Ordered event list, horizontal or vertical, with completed state.',
  'breadcrumbs': 'Ordered trail with overflow scroll and current-page semantics.',
  'dock': 'Bottom navigation bar with active item and safe-area support.',
  'link': 'daisyUI link styling on native anchors.',
  'megamenu': 'Wide navigation panel with grouped links.',
  'menu': 'Vertical or horizontal menu with submenus and Router state.',
  'navbar': 'Application bar with start, center, and end slots plus a responsive menu.',
  'pagination': 'Page links with previous, next, and truncation.',
  'steps': 'Multi-step progress with completed, current, and remaining state.',
  'tabs': 'Roving tablist with Router integration and lift, box, and border styles.',
  'alert': 'Inline message with status or alert role and an action slot.',
  'loading': 'Spinner, dots, ring, and bar indicators with busy semantics.',
  'progress': 'Determinate and indeterminate progress on the native element.',
  'radial-progress': 'Circular progress with an accessible value.',
  'skeleton': 'Loading placeholder shapes, static under reduced motion.',
  'toast': 'Stacked transient notifications with live-region announcements.',
  'tooltip': 'Described-by hint with logical placement, hover, and focus triggers.',
  'calendar': 'Date grid with keyboard navigation, ranges, and localization.',
  'checkbox': 'Form-control checkbox with indeterminate state and validation.',
  'fieldset': 'Grouped form fields with legend and description.',
  'file-input': 'Native file input with daisyUI styling and validation.',
  'filter': 'Radio-based filter chips with a reset control.',
  'label': 'Field labels, including floating labels.',
  'radio': 'Grouped radio control with typed value binding.',
  'range': 'Native range input with step marks and keyboard commit semantics.',
  'rating': 'Radio-backed rating with half steps and read-only display.',
  'select': 'Native select with typed options, groups, and validation states.',
  'text-input': 'Native text input with colors, sizes, and validation.',
  'textarea': 'Native textarea with colors, sizes, and validation.',
  'toggle': 'Switch-style checkbox with form-control behaviour.',
  'validator': 'Validation hint styling tied to native constraint state.',
  'otp': 'One-time-code field with paste distribution and autocomplete.',
  'divider': 'Separator with optional label, orientation, and logical placement.',
  'drawer': 'Off-canvas panel with scroll lock, focus return, and responsive dock.',
  'footer': 'Page footer with link columns and branding.',
  'hero': 'Full-width intro band with content overlay and figure slot.',
  'indicator': 'Badge or status pinned to the corner of another element.',
  'join': 'Groups adjacent controls into one visual unit.',
  'mask': 'Crops content to shapes such as squircle, heart, or hexagon.',
  'stack': 'Overlapping surfaces with depth order.',
  'browser-mockup': 'Browser chrome frame with toolbar, URL slot, and projected content.',
  'code-mockup': 'Terminal frame with line prefixes and highlighted lines.',
  'phone-mockup': 'Device frame with a scrollable viewport slot.',
  'window-mockup': 'Desktop window frame; deferred by product decision.',
};

export interface CatalogueGroup {
  readonly category: ComponentCategory;
  readonly entries: readonly CatalogueEntry[];
  readonly total: number;
}

/** Filters by category (or all) and a free-text query over name, summary, category, maturity. */
export function filterCatalogue(
  query: string,
  category: ComponentCategory | 'all',
  entries: readonly CatalogueEntry[] = catalogueEntries,
): readonly CatalogueGroup[] {
  const needle = query.trim().toLocaleLowerCase();
  return componentCategories
    .filter(candidate => category === 'all' || candidate === category)
    .map(candidate => {
      const inCategory = entries.filter(entry => entry.category === candidate);
      const visible = inCategory.filter(
        entry =>
          needle === '' ||
          `${entry.name} ${componentSummaries[entry.id] ?? ''} ${entry.category} ${entry.maturity}`
            .toLocaleLowerCase()
            .includes(needle),
      );
      return { category: candidate, entries: visible, total: inCategory.length };
    })
    .filter(result => result.entries.length > 0);
}
