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

export const buttonPage = defineSitePage({
  id: 'button',
  path: '/components/button',
  title: 'Button | Zordon UI',
  description: 'Button applies daisyUI appearance to a native action element.',
  section: 'components',
  indexable: true,
  maturity: 'planned',
  breadcrumbLabel: 'Button',
  parentId: componentsPage.id,
  previousId: componentsPage.id,
  nextId: 'typed-vocabularies',
  sourceUrl: 'https://github.com/pranxy/zordon-ui/blob/master/docs/components/button.md',
  tableOfContents: [
    { id: 'page-title', label: 'Overview' },
    { id: 'install', label: 'Install and import' },
    { id: 'playground', label: 'Playground' },
    { id: 'examples', label: 'Examples' },
    { id: 'color', label: 'Color', level: 2 },
    { id: 'variant', label: 'Variant', level: 2 },
    { id: 'size', label: 'Size', level: 2 },
    { id: 'loading', label: 'Loading state', level: 2 },
    { id: 'links', label: 'Links', level: 2 },
    { id: 'api', label: 'API' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'customization', label: 'Customization' },
    { id: 'ssr', label: 'SSR' },
  ],
});

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
  previousId: buttonPage.id,
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
  buttonPage,
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
