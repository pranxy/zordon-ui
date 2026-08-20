export type DocsMaturity = 'experimental' | 'preview' | 'stable';
export type DocsSection = 'components' | 'docs' | 'foundations' | 'guides' | 'resources' | 'system';

export interface DocsTableOfContentsItem {
  readonly id: string;
  readonly label: string;
}

export interface DocsSitePage {
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
  sourceUrl:
    'https://github.com/pranxy/zordon-ui/blob/master/projects/docs/src/app/pages/getting-started.component.ts',
  tableOfContents: [
    { id: 'page-title', label: 'Get started' },
    { id: 'what-comes-next', label: 'What comes next' },
  ],
});

export const notFoundPage = defineSitePage({
  id: 'not-found',
  path: '/404',
  title: 'Page not found | Zordon UI',
  description: 'The requested Zordon UI documentation page does not exist.',
  section: 'system',
  httpStatus: 404,
  indexable: false,
});

export const sitePages = [homePage, gettingStartedPage, notFoundPage] as const;

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
