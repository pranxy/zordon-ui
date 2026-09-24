import {
  componentsPage,
  gettingStartedPage,
  homePage,
  primaryNavigationPages,
  resourcesPage,
  sitePages,
  stylingAndThemingPage,
  typedVocabulariesPage,
  validateSitePages,
} from './site-catalog';

describe('documentation site catalogue', () => {
  it('accepts the real catalogue', () => {
    expect(validateSitePages(sitePages)).toEqual([]);
  });

  it('rejects duplicate page identifiers and paths', () => {
    const issues = validateSitePages([
      homePage,
      { ...gettingStartedPage, id: homePage.id },
      { ...gettingStartedPage, id: 'duplicate-path', path: homePage.path },
    ]);
    const message = issues.join('\n');

    expect(message).toContain(homePage.id);
    expect(message).toContain(homePage.path);
    expect(message.toLowerCase()).toContain('duplicate');
  });

  it('rejects parent, previous, and next references to missing page identifiers', () => {
    const issues = validateSitePages([
      homePage,
      {
        ...gettingStartedPage,
        parentId: 'missing-parent',
        previousId: 'missing-previous',
        nextId: 'missing-next',
      },
    ]);
    const message = issues.join('\n');

    expect(message).toContain('missing-parent');
    expect(message).toContain('missing-previous');
    expect(message).toContain('missing-next');
  });

  it('rejects a malformed path and an indexable system page', () => {
    const issues = validateSitePages([
      homePage,
      {
        ...gettingStartedPage,
        id: 'invalid-page',
        indexable: true,
        path: 'missing-leading-slash',
        section: 'system',
      },
    ]);
    const message = issues.join('\n');

    expect(message).toContain('missing-leading-slash');
    expect(message).toContain('invalid-page');
    expect(message.toLowerCase()).toContain('indexable');
  });

  it('provides ordered primary navigation from the catalogue', () => {
    expect(primaryNavigationPages().map(page => page.path)).toEqual([
      gettingStartedPage.path,
      componentsPage.path,
      typedVocabulariesPage.path,
      stylingAndThemingPage.path,
      resourcesPage.path,
    ]);
  });

  it('gives every component page the shared reference outline around its examples', () => {
    const componentPages = sitePages.filter(page => page.path.startsWith('/components/'));
    expect(componentPages.length).toBeGreaterThan(0);
    for (const page of componentPages) {
      const topLevel = (page.tableOfContents ?? [])
        .filter(entry => entry.level === undefined)
        .map(entry => entry.id);
      expect(topLevel, page.id).toEqual([
        'page-title',
        'install',
        'playground',
        'examples',
        'api',
        'accessibility',
        'customization',
        'ssr',
      ]);
      expect(page.path, page.id).toBe(`/components/${page.id}`);
      expect(page.parentId, page.id).toBe(componentsPage.id);
    }
  });

  it('chains component pages into one previous/next sequence', () => {
    const componentPages = sitePages.filter(page => page.path.startsWith('/components/'));
    for (const [index, page] of componentPages.entries()) {
      const next = componentPages[index + 1];
      if (next) {
        expect(page.nextId, page.id).toBe(next.id);
        expect(next.previousId, next.id).toBe(page.id);
      }
    }
  });
});
