export type DocsMaturity = 'planned' | 'experimental' | 'preview' | 'stable';
export type DocsSection = 'components' | 'docs' | 'foundations' | 'guides' | 'resources' | 'system';

export interface DocsTableOfContentsItem {
  readonly id: string;
  readonly label: string;
  /** 2 nests the entry under the preceding level-1 entry. */
  readonly level?: 1 | 2;
}

export interface DocsSitePage {
  readonly breadcrumbLabel?: string;
  readonly description: string;
  readonly id: string;
  readonly httpStatus?: number;
  readonly indexable: boolean;
  readonly maturity?: DocsMaturity;
  readonly navigationLabel?: string;
  readonly navigationOrder?: number;
  readonly nextId?: string;
  readonly parentId?: string;
  readonly path: string;
  readonly previousId?: string;
  readonly section: DocsSection;
  /** Label inside its section's side navigation; defaults to the title without the site suffix. */
  readonly sectionLabel?: string;
  readonly sourceUrl?: string;
  readonly tableOfContents?: readonly DocsTableOfContentsItem[];
  readonly title: string;
}

function defineSitePage<const T extends DocsSitePage>(page: T): T & DocsSitePage {
  return page;
}

/** Sections every component reference page has, in order, around its own examples. */
function defineComponentPage<const Id extends string>(page: {
  readonly id: Id;
  readonly label: string;
  readonly description: string;
  readonly maturity: DocsMaturity;
  readonly examples: readonly (readonly [id: string, label: string])[];
}): DocsSitePage & { readonly id: Id } {
  const entry = (id: string, label: string, level?: 2): DocsTableOfContentsItem =>
    level ? { id, label, level } : { id, label };
  return {
    id: page.id,
    path: `/components/${page.id}`,
    title: `${page.label} | Zordon UI`,
    description: page.description,
    section: 'components',
    indexable: true,
    maturity: page.maturity,
    breadcrumbLabel: page.label,
    parentId: 'components',
    sourceUrl: `https://github.com/pranxy/zordon-ui/blob/master/docs/components/${page.id}.md`,
    tableOfContents: [
      entry('page-title', 'Overview'),
      entry('install', 'Install and import'),
      entry('playground', 'Playground'),
      entry('examples', 'Examples'),
      ...page.examples.map(([id, label]) => entry(id, label, 2)),
      entry('api', 'API'),
      entry('accessibility', 'Accessibility'),
      entry('customization', 'Customization'),
      entry('ssr', 'SSR'),
    ],
  };
}

type LinkedPages<T extends readonly DocsSitePage[]> = {
  readonly [K in keyof T]: T[K] & { readonly previousId: string; readonly nextId: string };
};

function linkComponentPages<const T extends readonly DocsSitePage[]>(
  before: string,
  after: string,
  pages: T,
): LinkedPages<T> {
  return pages.map((page, index) => ({
    ...page,
    previousId: pages[index - 1]?.id ?? before,
    nextId: pages[index + 1]?.id ?? after,
  })) as unknown as LinkedPages<T>;
}

export const homePage = defineSitePage({
  id: 'home',
  path: '/',
  title: 'Zordon UI',
  description: 'Zordon UI is an Angular component library built on daisyUI.',
  section: 'docs',
  indexable: true,
  navigationOrder: 0,
  nextId: 'getting-started',
  sourceUrl:
    'https://github.com/pranxy/zordon-ui/blob/master/projects/docs/src/app/pages/home.component.ts',
});

export const gettingStartedPage = defineSitePage({
  id: 'getting-started',
  path: '/docs/getting-started',
  title: 'Get started with Zordon UI',
  description:
    'Install and configure Zordon UI for an Angular application using Tailwind CSS and daisyUI.',
  section: 'docs',
  indexable: true,
  navigationLabel: 'Get started',
  navigationOrder: 10,
  parentId: homePage.id,
  previousId: homePage.id,
  nextId: 'components',
  sourceUrl:
    'https://github.com/pranxy/zordon-ui/blob/master/projects/docs/src/app/pages/getting-started.component.ts',
  sectionLabel: 'Installation',
  tableOfContents: [
    { id: 'requirements', label: 'Requirements' },
    { id: 'manual-setup', label: 'Manual setup' },
    { id: 'step-install', label: 'Install packages', level: 2 },
    { id: 'step-postcss', label: 'Register PostCSS', level: 2 },
    { id: 'step-styles', label: 'Load styles', level: 2 },
    { id: 'step-provide', label: 'Configure the application', level: 2 },
    { id: 'step-first', label: 'First component', level: 2 },
    { id: 'run', label: 'Run it' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'next-steps', label: 'Next steps' },
  ],
});

export const componentsPage = defineSitePage({
  id: 'components',
  path: '/components',
  title: 'Components | Zordon UI',
  description: 'Browse the Zordon UI component catalogue by category and maturity.',
  section: 'components',
  indexable: true,
  navigationLabel: 'Components',
  navigationOrder: 20,
  parentId: homePage.id,
  previousId: gettingStartedPage.id,
  nextId: 'button',
  sourceUrl:
    'https://github.com/pranxy/zordon-ui/blob/master/projects/docs/src/app/pages/components.component.ts',
  tableOfContents: [
    { id: 'page-title', label: 'Overview' },
    { id: 'why-native', label: 'Why native' },
    { id: 'component-catalogue', label: 'Component catalogue' },
    { id: 'cat-actions', label: 'Actions', level: 2 },
    { id: 'cat-data-display', label: 'Data display', level: 2 },
    { id: 'cat-navigation', label: 'Navigation', level: 2 },
    { id: 'cat-feedback', label: 'Feedback', level: 2 },
    { id: 'cat-data-input', label: 'Data input', level: 2 },
    { id: 'cat-layout', label: 'Layout', level: 2 },
    { id: 'cat-mockups', label: 'Mockups', level: 2 },
  ],
});

export const buttonPage = defineComponentPage({
  id: 'button',
  label: 'Button',
  description: 'Button applies daisyUI appearance to a native action element.',
  maturity: 'planned',
  examples: [
    ['color', 'Color'],
    ['variant', 'Variant'],
    ['size', 'Size'],
    ['loading', 'Loading state'],
    ['links', 'Links'],
  ],
});

export const dropdownPage = defineComponentPage({
  id: 'dropdown',
  label: 'Dropdown',
  description:
    'Dropdown opens an anchored menu or content panel from a native button, with keyboard support and dismissal policies.',
  maturity: 'preview',
  examples: [
    ['action-menu', 'Action menu'],
    ['nested-menus', 'Nested menus'],
    ['content-panel', 'Content panel'],
    ['controlled', 'Controlled state'],
  ],
});

export const fabPage = defineComponentPage({
  id: 'fab',
  label: 'FAB / Speed Dial',
  description:
    'FAB is a floating action button that runs one action or discloses a small group of native actions.',
  maturity: 'planned',
  examples: [
    ['speed-dial', 'Speed dial'],
    ['flower', 'Flower'],
    ['single', 'Single action'],
  ],
});

export const modalPage = defineComponentPage({
  id: 'modal',
  label: 'Modal',
  description:
    'Modal opens a dialog from a template or a service, with typed results, close guards and confirmation.',
  maturity: 'planned',
  examples: [
    ['form', 'Form with a result'],
    ['confirm', 'Confirmation'],
    ['guard', 'Close guard'],
  ],
});

export const themeControllerPage = defineComponentPage({
  id: 'theme-controller',
  label: 'Theme Controller',
  description:
    'Theme Controller scopes a theme preference to native checkboxes, radios, selects and buttons.',
  maturity: 'planned',
  examples: [
    ['persistence', 'Remembered preference'],
    ['nested', 'Nested scopes'],
  ],
});

export const kbdPage = defineComponentPage({
  id: 'kbd',
  label: 'Kbd',
  description: 'Kbd applies daisyUI keycap styling to a native kbd element for keys and shortcuts.',
  maturity: 'preview',
  examples: [
    ['size', 'Size'],
    ['in-text', 'In running text'],
    ['combinations', 'Key combinations'],
  ],
});

export const swapPage = defineComponentPage({
  id: 'swap',
  label: 'Swap',
  description:
    'Swap shows on, off and indeterminate states around a native checkbox or toggle button.',
  maturity: 'preview',
  examples: [
    ['checkbox', 'Checkbox'],
    ['toggle-button', 'Toggle button'],
    ['indeterminate', 'Indeterminate'],
    ['effects', 'Effects'],
  ],
});

export const carouselPage = defineComponentPage({
  id: 'carousel',
  label: 'Carousel',
  description:
    'Carousel applies daisyUI scroll-snap layout to a native scroll container and its items.',
  maturity: 'preview',
  examples: [
    ['controls', 'Previous and next'],
    ['peek', 'Partial items'],
    ['vertical', 'Vertical'],
  ],
});

export const accordionPage = defineComponentPage({
  id: 'accordion',
  label: 'Accordion',
  description:
    'Accordion groups expandable sections with native headings, arrow-key movement and optional lazy panels.',
  maturity: 'planned',
  examples: [
    ['controlled', 'Controlled state'],
    ['lazy', 'Lazy content'],
  ],
});

export const avatarPage = defineComponentPage({
  id: 'avatar',
  label: 'Avatar',
  description: 'Avatar shows an image or placeholder in daisyUI shapes, with groups and presence.',
  maturity: 'planned',
  examples: [
    ['group', 'Group'],
    ['presence', 'Presence'],
  ],
});

export const auraPage = defineComponentPage({
  id: 'aura',
  label: 'Aura',
  description:
    'Aura adds a decorative glow around an element, and stays still under reduced motion.',
  maturity: 'planned',
  examples: [
    ['variants', 'Variants'],
    ['card', 'Around a card'],
  ],
});

export const badgePage = defineComponentPage({
  id: 'badge',
  label: 'Badge',
  description: 'Badge is an inline status label in every daisyUI color, size and style.',
  maturity: 'planned',
  examples: [
    ['colors', 'Colors'],
    ['in-context', 'In links and buttons'],
  ],
});

export const cardPage = defineComponentPage({
  id: 'card',
  label: 'Card',
  description:
    'Card is a surface with body, title, actions and image slots, in stacked or side layouts.',
  maturity: 'planned',
  examples: [
    ['link-card', 'Link card'],
    ['image-full', 'Image behind'],
  ],
});

export const chatBubblePage = defineComponentPage({
  id: 'chat-bubble',
  label: 'Chat Bubble',
  description: 'Chat Bubble lays out a conversation message with author side, avatar and footer.',
  maturity: 'planned',
  examples: [['conversation', 'Conversation']],
});

export const countdownPage = defineComponentPage({
  id: 'countdown',
  label: 'Countdown',
  description: 'Countdown animates numeric digits and keeps an accessible text value.',
  maturity: 'planned',
  examples: [['timer', 'Timer']],
});

export const diffPage = defineComponentPage({
  id: 'diff',
  label: 'Diff',
  description: 'Diff compares two items side by side with a resizable divider.',
  maturity: 'planned',
  examples: [['text', 'Text comparison']],
});

export const hover3dPage = defineComponentPage({
  id: 'hover-3d',
  label: 'Hover 3D Card',
  description: 'Hover 3D Card tilts its content toward the pointer, built from CSS hover zones.',
  maturity: 'planned',
  examples: [['figure', 'Decorative figure']],
});

export const hoverGalleryPage = defineComponentPage({
  id: 'hover-gallery',
  label: 'Hover Gallery',
  description: 'Hover Gallery previews a strip of images as the pointer moves across it.',
  maturity: 'planned',
  examples: [['caption', 'With a caption']],
});

export const listPage = defineComponentPage({
  id: 'list',
  label: 'List',
  description: 'List lays out native list rows with media, a growing text column and actions.',
  maturity: 'planned',
  examples: [['grow', 'Growing column']],
});

export const statPage = defineComponentPage({
  id: 'stat',
  label: 'Stat',
  description: 'Stat lays out key numbers with title, value, description, figure and actions.',
  maturity: 'planned',
  examples: [['actions', 'Actions']],
});

export const statusPage = defineComponentPage({
  id: 'status',
  label: 'Status',
  description: 'Status is a small state dot in every theme color and size.',
  maturity: 'planned',
  examples: [
    ['text', 'With text'],
    ['pulse', 'Pulse'],
  ],
});

export const tablePage = defineComponentPage({
  id: 'table',
  label: 'Table',
  description: 'Table styles a native table with sizes, zebra rows and pinned headers or columns.',
  maturity: 'planned',
  examples: [['row-headers', 'Row headers']],
});

export const textRotatePage = defineComponentPage({
  id: 'text-rotate',
  label: 'Text Rotate',
  description: 'Text Rotate cycles up to six words in place, pausing on hover.',
  maturity: 'planned',
  examples: [['sentence', 'In a sentence']],
});

export const timelinePage = defineComponentPage({
  id: 'timeline',
  label: 'Timeline',
  description: 'Timeline lays out events on a native list, horizontally, vertically or compact.',
  maturity: 'planned',
  examples: [['snap', 'Order tracking']],
});

export const collapsePage = defineComponentPage({
  id: 'collapse',
  label: 'Collapse',
  description:
    'Collapse styles a native disclosure with daisyUI title, content and indicator classes.',
  maturity: 'preview',
  examples: [
    ['details', 'Native details'],
    ['indicators', 'Indicators'],
    ['forced-state', 'Forced state'],
    ['group', 'Several disclosures'],
  ],
});

export const megamenuPage = defineComponentPage({
  id: 'megamenu',
  label: 'Megamenu',
  description:
    'Megamenu opens a responsive multi-column navigation panel, or an application command bar, from native buttons.',
  maturity: 'preview',
  examples: [
    ['site-navigation', 'Site navigation'],
    ['full-width', 'Full width on hover'],
    ['command-bar', 'Command bar'],
  ],
});

export const menuPage = defineComponentPage({
  id: 'menu',
  label: 'Menu',
  description:
    'Menu renders native navigation lists with groups, or a selectable tree built on Angular Aria.',
  maturity: 'preview',
  examples: [
    ['navigation', 'Navigation'],
    ['horizontal', 'Horizontal'],
    ['tree', 'Selectable tree'],
    ['decorations', 'Badges and shortcuts'],
  ],
});

export const breadcrumbsPage = defineComponentPage({
  id: 'breadcrumbs',
  label: 'Breadcrumbs',
  description:
    'Breadcrumbs shows the path to the current page as native links, collapsing long trails.',
  maturity: 'planned',
  examples: [
    ['router', 'Router links'],
    ['short-labels', 'Short labels'],
    ['icons', 'Icons'],
  ],
});

export const dockPage = defineComponentPage({
  id: 'dock',
  label: 'Dock',
  description: 'Dock is a bottom navigation bar of native links with icons, labels and badges.',
  maturity: 'planned',
  examples: [
    ['destinations', 'Destinations and badges'],
    ['active-id', 'Choosing the current item'],
  ],
});

export const linkPage = defineComponentPage({
  id: 'link',
  label: 'Link',
  description: 'Link applies daisyUI link styling to a native anchor, with an unavailable state.',
  maturity: 'planned',
  examples: [
    ['router', 'Router and current page'],
    ['unavailable', 'Unavailable'],
    ['external', 'External links'],
  ],
});

export const navbarPage = defineComponentPage({
  id: 'navbar',
  label: 'Navbar',
  description:
    'Navbar lays out a named navigation bar with regions, responsive content and a panel toggle.',
  maturity: 'planned',
  examples: [
    ['responsive', 'Responsive content'],
    ['toggle', 'Toggle'],
  ],
});

export const paginationPage = defineComponentPage({
  id: 'pagination',
  label: 'Pagination',
  description:
    'Pagination provides page controls as buttons or query-string links, with page sizes and unknown totals.',
  maturity: 'planned',
  examples: [
    ['page-size', 'Page size'],
    ['unknown-total', 'Unknown total'],
    ['query', 'Query parameters'],
  ],
});

export const stepsPage = defineComponentPage({
  id: 'steps',
  label: 'Steps',
  description:
    'Steps shows progress through a process, with optional step buttons for a wizard you control.',
  maturity: 'planned',
  examples: [
    ['wizard', 'Wizard'],
    ['states', 'States'],
  ],
});

export const tabsPage = defineComponentPage({
  id: 'tabs',
  label: 'Tabs',
  description:
    'Tabs switches panels with Angular Aria keyboard support, plus closing, reordering and URL state.',
  maturity: 'planned',
  examples: [
    ['templates', 'Panel templates'],
    ['close-reorder', 'Close and reorder'],
  ],
});

export const alertPage = defineComponentPage({
  id: 'alert',
  label: 'Alert',
  description:
    'Alert shows an inline message with an icon, title, actions and details, and dismissal you accept.',
  maturity: 'planned',
  examples: [
    ['colors', 'Colors and variants'],
    ['dismissal', 'Dismissal'],
    ['auto-dismiss', 'Auto-dismiss'],
    ['actions', 'Actions and details'],
  ],
});

export const loadingPage = defineComponentPage({
  id: 'loading',
  label: 'Loading',
  description:
    'Loading shows indeterminate work with daisyUI animations, a status message and an optional delay.',
  maturity: 'planned',
  examples: [
    ['variants', 'Variants and sizes'],
    ['delay', 'Delayed feedback'],
    ['overlay', 'Overlay'],
    ['custom', 'Custom artwork'],
  ],
});

export const progressPage = defineComponentPage({
  id: 'progress',
  label: 'Progress',
  description:
    'Progress wraps a labelled native progress bar, with a buffer and value text for known or unknown totals.',
  maturity: 'planned',
  examples: [
    ['upload', 'File upload'],
    ['indeterminate', 'Unknown total'],
    ['colors', 'Colors'],
  ],
});

export const radialProgressPage = defineComponentPage({
  id: 'radial-progress',
  label: 'Radial Progress',
  description:
    'Radial Progress shows completion as a ring with center content and color thresholds.',
  maturity: 'planned',
  examples: [
    ['thresholds', 'Thresholds'],
    ['center-content', 'Center content'],
    ['format', 'Custom text'],
  ],
});

export const skeletonPage = defineComponentPage({
  id: 'skeleton',
  label: 'Skeleton',
  description:
    'Skeleton draws decorative placeholders while a region, marked busy, loads its content.',
  maturity: 'planned',
  examples: [
    ['loading-region', 'Loading region'],
    ['shapes', 'Shapes'],
    ['presets', 'Presets'],
  ],
});

export const toastPage = defineComponentPage({
  id: 'toast',
  label: 'Toast',
  description:
    'Toast queues short, non-blocking notifications from a service and announces them from a fixed outlet.',
  maturity: 'planned',
  examples: [
    ['actions', 'Actions'],
    ['track', 'Tracking work'],
    ['custom-content', 'Custom content'],
  ],
});

export const tooltipPage = defineComponentPage({
  id: 'tooltip',
  label: 'Tooltip',
  description:
    'Tooltip adds a description or interactive help panel to a control, with placement that flips to fit.',
  maturity: 'planned',
  examples: [
    ['rich-content', 'Rich content'],
    ['interactive', 'Interactive help'],
    ['disabled-actions', 'Disabled actions'],
    ['controlled', 'Controlled'],
  ],
});

export const calendarPage = defineComponentPage({
  id: 'calendar',
  label: 'Calendar',
  description:
    'Calendar provides inline or popup date selection with single, multiple and range modes.',
  maturity: 'preview',
  examples: [
    ['bounds', 'Bounds and unavailable days'],
    ['range', 'Range'],
    ['popup', 'Popup'],
    ['forms', 'Forms'],
    ['day-template', 'Custom day content'],
  ],
});

export const checkboxPage = defineComponentPage({
  id: 'checkbox',
  label: 'Checkbox',
  description:
    'Checkbox adds daisyUI styling to a native checkbox, keeping its state, keyboard and Forms behaviour.',
  maturity: 'planned',
  examples: [
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
    ['indeterminate', 'Mixed state'],
    ['forms', 'Reactive Forms'],
  ],
});

export const radioPage = defineComponentPage({
  id: 'radio',
  label: 'Radio',
  description:
    'Radio adds daisyUI styling to native radio inputs, which keep their grouping, arrow keys and Forms behaviour.',
  maturity: 'planned',
  examples: [
    ['group', 'Radio group'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
  ],
});

export const rangePage = defineComponentPage({
  id: 'range',
  label: 'Range',
  description:
    'Range adds daisyUI styling to a native range input, including sizes, colors and a vertical layout.',
  maturity: 'planned',
  examples: [
    ['value', 'Showing the value'],
    ['ticks', 'Steps and ticks'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
    ['vertical', 'Vertical'],
  ],
});

export const ratingPage = defineComponentPage({
  id: 'rating',
  label: 'Rating',
  description:
    'Rating lays out a native radio group as daisyUI stars, with sizes, half stars and a clear option.',
  maturity: 'planned',
  examples: [
    ['stars', 'Star rating'],
    ['half', 'Half stars'],
    ['sizes', 'Sizes'],
  ],
});

export const selectPage = defineComponentPage({
  id: 'select',
  label: 'Select',
  description:
    'Select adds daisyUI styling to a native select, which keeps its options, keyboard and Forms behaviour.',
  maturity: 'planned',
  examples: [
    ['forms', 'Groups and Forms'],
    ['multiple', 'Multiple selection'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
  ],
});

export const textInputPage = defineComponentPage({
  id: 'text-input',
  label: 'Text Input',
  description:
    'Text Input adds daisyUI styling to a native input of any text type, with colors, sizes and a ghost style.',
  maturity: 'planned',
  examples: [
    ['validation', 'Validation'],
    ['types', 'Input types'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
  ],
});

export const textareaPage = defineComponentPage({
  id: 'textarea',
  label: 'Textarea',
  description:
    'Textarea adds daisyUI styling to a native textarea, with colors, sizes and a ghost style.',
  maturity: 'planned',
  examples: [
    ['character-count', 'Character count'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
  ],
});

export const togglePage = defineComponentPage({
  id: 'toggle',
  label: 'Toggle',
  description:
    'Toggle styles a native checkbox as a daisyUI switch, keeping its checked state and Forms behaviour.',
  maturity: 'planned',
  examples: [
    ['settings', 'Settings list'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
  ],
});

export const fieldsetPage = defineComponentPage({
  id: 'fieldset',
  label: 'Fieldset',
  description:
    'Fieldset styles a native fieldset, legend and labels, which keep their grouping and disabled propagation.',
  maturity: 'planned',
  examples: [
    ['grouping', 'Grouping fields'],
    ['disabled', 'Disabling a group'],
    ['nested', 'Nested groups'],
  ],
});

export const fileInputPage = defineComponentPage({
  id: 'file-input',
  label: 'File Input',
  description:
    'File Input adds daisyUI styling to a native file input, which keeps its picker, accept and multiple behaviour.',
  maturity: 'planned',
  examples: [
    ['selection', 'Reading the selection'],
    ['colors', 'Colors'],
    ['sizes', 'Sizes'],
  ],
});

export const filterPage = defineComponentPage({
  id: 'filter',
  label: 'Filter',
  description:
    'Filter lays out native radio or checkbox inputs as daisyUI filter buttons, with a native reset.',
  maturity: 'planned',
  examples: [
    ['single-choice', 'Single choice with reset'],
    ['variants', 'Variants'],
    ['sizes', 'Sizes'],
  ],
});

export const labelPage = defineComponentPage({
  id: 'label',
  label: 'Label',
  description:
    'Label styles a native label, including daisyUI’s floating label, without changing its association.',
  maturity: 'planned',
  examples: [
    ['association', 'Associating a control'],
    ['floating', 'Floating label'],
  ],
});

export const validatorPage = defineComponentPage({
  id: 'validator',
  label: 'Validator',
  description:
    'Validator shows native constraint validity on inputs, selects and textareas, with a hint that appears on error.',
  maturity: 'planned',
  examples: [
    ['constraints', 'Native constraints'],
    ['pattern', 'Pattern and hint'],
    ['forms', 'Angular Forms'],
  ],
});

export const otpPage = defineComponentPage({
  id: 'otp',
  label: 'OTP',
  description:
    'OTP renders a row of single-character inputs for one-time codes, with paste distribution and Angular Forms support.',
  maturity: 'planned',
  examples: [
    ['forms', 'Reactive Forms'],
    ['alphanumeric', 'Letters and digits'],
    ['completed', 'Completion'],
  ],
});

/**
 * Component reference pages in catalogue order (content/component-catalogue.ts). Previous and next
 * links are derived from this order, from the catalogue page through to the first foundation page.
 */
export const componentReferencePages = linkComponentPages(componentsPage.id, 'typed-vocabularies', [
  buttonPage,
  dropdownPage,
  fabPage,
  modalPage,
  swapPage,
  themeControllerPage,
  accordionPage,
  avatarPage,
  auraPage,
  badgePage,
  cardPage,
  carouselPage,
  chatBubblePage,
  collapsePage,
  countdownPage,
  diffPage,
  hover3dPage,
  hoverGalleryPage,
  kbdPage,
  listPage,
  statPage,
  statusPage,
  tablePage,
  textRotatePage,
  timelinePage,
  breadcrumbsPage,
  dockPage,
  linkPage,
  megamenuPage,
  menuPage,
  navbarPage,
  paginationPage,
  stepsPage,
  tabsPage,
  alertPage,
  loadingPage,
  progressPage,
  radialProgressPage,
  skeletonPage,
  toastPage,
  tooltipPage,
  calendarPage,
  checkboxPage,
  fieldsetPage,
  fileInputPage,
  filterPage,
  labelPage,
  radioPage,
  rangePage,
  ratingPage,
  selectPage,
  textInputPage,
  textareaPage,
  togglePage,
  validatorPage,
  otpPage,
] as const);

export const typedVocabulariesPage = defineSitePage({
  id: 'typed-vocabularies',
  path: '/foundations/typed-vocabularies',
  title: 'Typed foundation vocabularies | Zordon UI',
  description: 'Shared type-only vocabularies keep Zordon UI component APIs consistent.',
  section: 'foundations',
  indexable: true,
  navigationLabel: 'Foundations',
  navigationOrder: 30,
  parentId: homePage.id,
  previousId: 'otp',
  nextId: 'styling-and-theming',
  sourceUrl:
    'https://github.com/pranxy/zordon-ui/blob/master/docs/foundations/typed-vocabularies.md',
  sectionLabel: 'Typed vocabularies',
  tableOfContents: [
    { id: 'page-title', label: 'Typed vocabularies' },
    { id: 'public-types', label: 'Public types' },
    { id: 'customization-boundary', label: 'Customization boundary' },
  ],
});

export const stylingAndThemingPage = defineSitePage({
  id: 'styling-and-theming',
  path: '/guides/styling-and-theming',
  title: 'Styling and theming | Zordon UI',
  description: 'Configure Tailwind CSS, daisyUI themes, and Zordon UI class prefixes.',
  section: 'guides',
  indexable: true,
  navigationLabel: 'Guides',
  navigationOrder: 40,
  parentId: homePage.id,
  previousId: typedVocabulariesPage.id,
  nextId: 'resources',
  sourceUrl: 'https://github.com/pranxy/zordon-ui/blob/master/docs/guides/styling-and-theming.md',
  tableOfContents: [
    { id: 'page-title', label: 'Styling and theming' },
    { id: 'supported-versions', label: 'Supported versions' },
    { id: 'application-setup', label: 'Application setup' },
    { id: 'themes', label: 'Themes and scopes' },
  ],
});

export const resourcesPage = defineSitePage({
  id: 'resources',
  path: '/resources',
  title: 'Resources | Zordon UI',
  description: 'Find Zordon UI roadmap, release, contribution, and upstream resources.',
  section: 'resources',
  indexable: true,
  navigationLabel: 'Resources',
  navigationOrder: 50,
  parentId: homePage.id,
  previousId: stylingAndThemingPage.id,
  sourceUrl:
    'https://github.com/pranxy/zordon-ui/blob/master/projects/docs/src/app/pages/resources.component.ts',
  tableOfContents: [
    { id: 'page-title', label: 'Resources' },
    { id: 'project', label: 'Project' },
    { id: 'upstream', label: 'Upstream documentation' },
  ],
});

export const notFoundPage = defineSitePage({
  id: 'not-found',
  path: '/404',
  title: 'Page not found | Zordon UI',
  description: 'The requested Zordon UI documentation page does not exist.',
  breadcrumbLabel: 'Page not found',
  section: 'system',
  httpStatus: 404,
  indexable: false,
});

export const sitePages = [
  homePage,
  gettingStartedPage,
  componentsPage,
  ...componentReferencePages,
  typedVocabulariesPage,
  stylingAndThemingPage,
  resourcesPage,
  notFoundPage,
] as const;

export function validateSitePages(pages: readonly DocsSitePage[]): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  const paths = new Set<string>();

  for (const page of pages) {
    if (ids.has(page.id)) {
      issues.push(`Duplicate page id: ${page.id}`);
    }
    ids.add(page.id);

    if (paths.has(page.path)) {
      issues.push(`Duplicate page path: ${page.path}`);
    }
    paths.add(page.path);

    if (!page.path.startsWith('/')) {
      issues.push(`Page path must start with "/": ${page.path}`);
    }
    if (page.indexable && page.section === 'system') {
      issues.push(`System page cannot be indexable: ${page.id}`);
    }
    if (page.indexable && page.httpStatus !== undefined && page.httpStatus >= 400) {
      issues.push(`Indexable page cannot use an error HTTP status: ${page.id}`);
    }
    if (
      page.httpStatus !== undefined &&
      (!Number.isInteger(page.httpStatus) || page.httpStatus < 100 || page.httpStatus > 599)
    ) {
      issues.push(`Invalid HTTP status for page: ${page.id}`);
    }
    if (page.navigationOrder !== undefined && page.navigationOrder < 0) {
      issues.push(`Navigation order cannot be negative: ${page.id}`);
    }
  }

  for (const page of pages) {
    const references = [
      ['parentId', page.parentId],
      ['previousId', page.previousId],
      ['nextId', page.nextId],
    ] as const;

    for (const [field, reference] of references) {
      if (reference === page.id) {
        issues.push(`${field} cannot reference the page itself: ${page.id}`);
      } else if (reference !== undefined && !ids.has(reference)) {
        issues.push(`${field} references an unknown page from ${page.id}: ${reference}`);
      }
    }
  }

  return issues;
}

export function findSitePage(path: string): DocsSitePage | undefined {
  return sitePages.find(page => page.path === path);
}

export function findSitePageById(id: string | undefined): DocsSitePage | undefined {
  return id === undefined ? undefined : sitePages.find(page => page.id === id);
}

export function indexableSitePages(): readonly DocsSitePage[] {
  return sitePages.filter(page => page.indexable);
}

export function primaryNavigationPages(): readonly DocsSitePage[] {
  return [...sitePages]
    .filter(page => page.navigationLabel !== undefined)
    .sort((left, right) => (left.navigationOrder ?? 0) - (right.navigationOrder ?? 0));
}

export function breadcrumbsForPage(page: DocsSitePage): readonly DocsSitePage[] {
  const breadcrumbs: DocsSitePage[] = [page];
  const visited = new Set([page.id]);
  let parentId = page.parentId;

  while (parentId) {
    if (visited.has(parentId)) break;
    const parent = sitePages.find(candidate => candidate.id === parentId);
    if (!parent) break;
    breadcrumbs.unshift(parent);
    visited.add(parent.id);
    parentId = parent.parentId;
  }

  if (breadcrumbs[0]?.id !== homePage.id) breadcrumbs.unshift(homePage);
  return breadcrumbs;
}
