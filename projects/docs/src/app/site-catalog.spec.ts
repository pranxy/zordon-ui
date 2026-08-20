import {
  gettingStartedPage,
  homePage,
  primaryNavigationPages,
  sitePages,
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
    expect(primaryNavigationPages().map(page => page.path)).toEqual([gettingStartedPage.path]);
  });
});
