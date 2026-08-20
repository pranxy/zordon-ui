import { routes } from './app.routes';
import { serverRouteForPage } from './app.routes.server';
import { gettingStartedPage, sitePages } from './site-catalog';

describe('documentation client routes', () => {
  it('exposes every catalogue path before the wildcard route', () => {
    const catalogueRoutePaths = routes
      .filter(route => route.path !== '**')
      .map(route => (route.path === '' ? '/' : `/${route.path}`));

    expect(catalogueRoutePaths).toEqual(sitePages.map(page => page.path));
    expect(routes.at(-1)?.path).toBe('**');
  });

  it('keeps indexability independent from HTTP status', () => {
    const route = serverRouteForPage({ ...gettingStartedPage, indexable: false });

    expect('status' in route).toBe(false);
  });
});
