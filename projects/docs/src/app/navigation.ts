import {
  catalogueEntries,
  categorySlug,
  componentCategories,
  entriesInCategory,
  type CatalogueEntry,
} from './content/component-catalogue';
import {
  breadcrumbsForPage,
  findSitePageById,
  homePage,
  indexableSitePages,
  primaryNavigationPages,
  sitePages,
  type DocsSection,
  type DocsSitePage,
} from './site-catalog';
import type { DocsBreadcrumb } from './ui/shell/breadcrumbs.component';
import type { DocsPagerLink } from './ui/shell/pager.component';
import type { DocsNavItem } from './ui/shell/primary-nav.component';
import type { DocsSearchEntry } from './ui/shell/search-dialog.component';
import type { DocsSideNavGroup } from './ui/shell/side-nav.component';

/**
 * Pure functions that derive every navigation surface (header, mobile menu, side nav,
 * breadcrumbs, pager, search) from the page catalogue and the component catalogue, so no
 * navigation list is written by hand.
 */

export function primaryNavItems(): readonly DocsNavItem[] {
  return primaryNavigationPages().map(page => ({
    label: page.navigationLabel ?? page.title,
    path: page.path,
  }));
}

export function mobileNavItems(): readonly DocsNavItem[] {
  return [{ label: 'Home', path: homePage.path, exact: true }, ...primaryNavItems()];
}

export function searchEntries(): readonly DocsSearchEntry[] {
  return indexableSitePages().map(page => ({
    id: page.id,
    label: page.navigationLabel ?? page.title,
    description: page.description,
    path: page.path,
  }));
}

export function pageLabel(page: DocsSitePage): string {
  return page.breadcrumbLabel ?? page.navigationLabel ?? page.title;
}

export function sectionLabel(page: DocsSitePage): string {
  return page.sectionLabel ?? page.title.replace(/ \| Zordon UI$/, '');
}

export function catalogueEntryForPage(page: DocsSitePage): CatalogueEntry | undefined {
  return catalogueEntries.find(entry => entry.path === page.path);
}

export function breadcrumbItems(page: DocsSitePage): readonly DocsBreadcrumb[] {
  const items: DocsBreadcrumb[] = breadcrumbsForPage(page).map(crumb => ({
    label: crumb.id === homePage.id ? 'Home' : pageLabel(crumb),
    path: crumb.path,
  }));
  const entry = catalogueEntryForPage(page);
  if (entry) {
    items.splice(items.length - 1, 0, {
      label: entry.category,
      path: '/components',
      queryParams: { category: categorySlug(entry.category) },
    });
  }
  return items;
}

export function pagerLinks(page: DocsSitePage): {
  readonly previous?: DocsPagerLink;
  readonly next?: DocsPagerLink;
} {
  const toLink = (target: DocsSitePage | undefined): DocsPagerLink | undefined =>
    target && { label: target.navigationLabel ?? pageLabel(target), path: target.path };
  return {
    previous: toLink(findSitePageById(page.previousId)),
    next: toLink(findSitePageById(page.nextId)),
  };
}

const SECTION_GROUPS: readonly { readonly section: DocsSection; readonly label: string }[] = [
  { section: 'docs', label: 'Get started' },
  { section: 'foundations', label: 'Foundations' },
  { section: 'guides', label: 'Guides' },
  { section: 'resources', label: 'Resources' },
];

export interface SideNavigation {
  readonly label: string;
  readonly groups: readonly DocsSideNavGroup[];
  readonly backLink?: { readonly label: string; readonly path: string };
  /** Show the maturity legend under the groups. */
  readonly legend: boolean;
}

export function sideNavigation(page: DocsSitePage): SideNavigation | undefined {
  if (page.id === homePage.id || page.section === 'system') return undefined;

  const entry = catalogueEntryForPage(page);
  if (entry) {
    return {
      label: 'Components',
      backLink: { label: 'All components', path: '/components' },
      legend: false,
      groups: [
        {
          label: entry.category,
          items: entriesInCategory(entry.category).map(item => ({
            label: item.name,
            path: item.path,
            maturity: item.maturity,
          })),
        },
        {
          label: 'Other groups',
          compact: true,
          items: componentCategories
            .filter(category => category !== entry.category)
            .map(category => ({
              label: category,
              path: '/components',
              queryParams: { category: categorySlug(category) },
              count: entriesInCategory(category).length,
            })),
        },
      ],
    };
  }

  if (page.section === 'components') {
    return {
      label: 'Documentation sections',
      legend: true,
      groups: [
        {
          label: 'Documentation',
          items: primaryNavigationPages().map(item => ({
            label: item.navigationLabel ?? item.title,
            path: item.path,
          })),
        },
      ],
    };
  }

  return {
    label: 'Documentation sections',
    legend: false,
    groups: SECTION_GROUPS.map(({ section, label }) => ({
      label,
      items: sitePages
        .filter(candidate => candidate.section === section && candidate.id !== homePage.id)
        .filter(candidate => candidate.indexable)
        .map(candidate => ({ label: sectionLabel(candidate), path: candidate.path })),
    })).filter(group => group.items.length > 0),
  };
}
