export type DocsSection = 'docs' | 'system';

export interface DocsSitePage {
  readonly description: string;
  readonly id: string;
  readonly indexable: boolean;
  readonly navigationLabel?: string;
  readonly path: string;
  readonly section: DocsSection;
  readonly title: string;
}

export const homePage: DocsSitePage = {
  id: 'home',
  path: '/',
  title: 'Zordon UI',
  description: 'Zordon UI is an Angular component library built on daisyUI.',
  section: 'docs',
  indexable: true,
};

export const gettingStartedPage: DocsSitePage = {
  id: 'getting-started',
  path: '/docs/getting-started',
  title: 'Get started with Zordon UI',
  description:
    'Install and configure Zordon UI for an Angular application using Tailwind CSS and daisyUI.',
  section: 'docs',
  indexable: true,
  navigationLabel: 'Get started',
};

export const notFoundPage: DocsSitePage = {
  id: 'not-found',
  path: '/404',
  title: 'Page not found | Zordon UI',
  description: 'The requested Zordon UI documentation page does not exist.',
  section: 'system',
  indexable: false,
};

export const sitePages = [homePage, gettingStartedPage, notFoundPage] as const;

export function findSitePage(path: string): DocsSitePage | undefined {
  return sitePages.find(page => page.path === path);
}

export function indexableSitePages(): readonly DocsSitePage[] {
  return sitePages.filter(page => page.indexable);
}
