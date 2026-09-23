import {
  breadcrumbItems,
  mobileNavItems,
  pagerLinks,
  primaryNavItems,
  searchEntries,
  sideNavigation,
} from './navigation';
import {
  buttonPage,
  componentsPage,
  gettingStartedPage,
  homePage,
  notFoundPage,
  sitePages,
} from './site-catalog';

describe('derived navigation', () => {
  it('builds primary navigation from the catalogue, with Home only on mobile', () => {
    expect(primaryNavItems().map(item => item.label)).toEqual([
      'Get started',
      'Components',
      'Foundations',
      'Guides',
      'Resources',
    ]);
    expect(mobileNavItems()[0]).toEqual({ label: 'Home', path: '/', exact: true });
  });

  it('inserts the category into component breadcrumbs', () => {
    expect(breadcrumbItems(buttonPage)).toEqual([
      { label: 'Home', path: '/' },
      { label: 'Components', path: '/components' },
      { label: 'Actions', path: '/components', queryParams: { category: 'actions' } },
      { label: 'Button', path: '/components/button' },
    ]);
  });

  it('shows the category group and other groups for a component page', () => {
    const nav = sideNavigation(buttonPage);
    expect(nav?.backLink?.path).toBe('/components');
    expect(nav?.groups[0]?.label).toBe('Actions');
    expect(nav?.groups[0]?.items[0]).toEqual({
      label: 'Button',
      path: '/components/button',
      maturity: 'planned',
    });
    const linked = nav?.groups[0]?.items.filter(item => item.path).map(item => item.label);
    expect(linked).toEqual(['Button', 'Dropdown']);
    expect(nav?.groups[1]?.items.map(item => item.count)).toEqual([19, 9, 7, 15, 8, 4]);
  });

  it('shows the maturity legend only on the catalogue page', () => {
    expect(sideNavigation(componentsPage)?.legend).toBe(true);
    expect(sideNavigation(gettingStartedPage)?.legend).toBe(false);
  });

  it('labels the not-found breadcrumb without the site-title suffix', () => {
    expect(breadcrumbItems(notFoundPage).at(-1)?.label).toBe('Page not found');
  });

  it('has no side navigation on the landing page or system pages', () => {
    expect(sideNavigation(homePage)).toBeUndefined();
    expect(sideNavigation(notFoundPage)).toBeUndefined();
  });

  it('only links side navigation to real pages', () => {
    const paths = new Set<string>(sitePages.map(page => page.path));
    for (const page of sitePages) {
      for (const group of sideNavigation(page)?.groups ?? []) {
        for (const item of group.items) {
          if (item.path) expect(paths.has(item.path), `${page.id} → ${item.path}`).toBe(true);
        }
      }
    }
  });

  it('derives pager links and indexable search entries', () => {
    expect(pagerLinks(gettingStartedPage)).toEqual({
      previous: { label: 'Zordon UI', path: '/' },
      next: { label: 'Components', path: '/components' },
    });
    expect(searchEntries().some(entry => entry.path === notFoundPage.path)).toBe(false);
  });
});
