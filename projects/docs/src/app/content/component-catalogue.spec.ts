import {
  catalogueEntries,
  categorySlug,
  componentCategories,
  entriesInCategory,
  maturityCounts,
} from './component-catalogue';
import { componentSummaries, filterCatalogue } from './component-summaries';
import { sitePages } from '../site-catalog';

describe('component catalogue', () => {
  it('lists the 68 v1 components across 7 categories', () => {
    expect(catalogueEntries).toHaveLength(68);
    expect(componentCategories).toHaveLength(7);
    const perCategory = componentCategories.map(category => entriesInCategory(category).length);
    expect(perCategory).toEqual([6, 19, 9, 7, 15, 8, 4]);
  });

  it('uses unique ids, each with a summary', () => {
    const ids = catalogueEntries.map(entry => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(componentSummaries[id], id).toBeTruthy();
    expect(Object.keys(componentSummaries).sort()).toEqual([...ids].sort());
  });

  it('links exactly the components that have a reference page', () => {
    const linked = catalogueEntries.filter(entry => entry.path).map(entry => entry.id);
    expect(linked).toEqual([
      'button',
      'dropdown',
      'fab',
      'modal',
      'swap',
      'theme-controller',
      'accordion',
      'avatar',
      'aura',
      'badge',
      'card',
      'carousel',
      'chat-bubble',
      'collapse',
      'countdown',
      'diff',
      'hover-3d',
      'hover-gallery',
      'kbd',
      'list',
      'stat',
      'status',
      'table',
      'text-rotate',
      'timeline',
      'breadcrumbs',
      'dock',
      'link',
      'megamenu',
      'menu',
      'navbar',
      'pagination',
      'steps',
      'tabs',
      'alert',
      'loading',
      'progress',
      'radial-progress',
      'skeleton',
      'toast',
      'tooltip',
      'calendar',
      'checkbox',
      'fieldset',
      'file-input',
      'filter',
      'label',
      'radio',
      'range',
      'rating',
      'select',
      'text-input',
      'textarea',
      'toggle',
      'validator',
      'otp',
      'divider',
      'drawer',
      'footer',
      'hero',
      'indicator',
      'join',
      'mask',
      'stack',
    ]);
  });

  it('links only to reference pages that exist', () => {
    const paths = new Set<string>(sitePages.map(page => page.path));
    for (const entry of catalogueEntries) {
      if (entry.path) expect(paths.has(entry.path), entry.path).toBe(true);
    }
  });

  it('never claims Stable or Experimental without recorded evidence', () => {
    const counts = maturityCounts();
    expect(counts.stable).toBe(0);
    expect(counts.experimental).toBe(0);
    expect(counts.planned + counts.preview).toBe(68);
  });

  it('filters by category and free text', () => {
    expect(filterCatalogue('', 'all').flatMap(group => group.entries)).toHaveLength(68);

    const actions = filterCatalogue('', 'Actions');
    expect(actions.map(group => group.category)).toEqual(['Actions']);
    expect(actions[0]?.total).toBe(6);

    const search = filterCatalogue('native dialog', 'all');
    expect(search.flatMap(group => group.entries.map(entry => entry.id))).toEqual(['modal']);

    expect(filterCatalogue('no component matches this', 'all')).toEqual([]);
  });

  it('builds URL-safe category slugs', () => {
    expect(componentCategories.map(categorySlug)).toEqual([
      'actions',
      'data-display',
      'navigation',
      'feedback',
      'data-input',
      'layout',
      'mockups',
    ]);
  });
});
