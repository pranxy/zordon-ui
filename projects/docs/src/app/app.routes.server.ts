import { RenderMode, type ServerRoute } from '@angular/ssr';
import { type DocsSitePage, sitePages } from './site-catalog';

export function serverRouteForPage(page: DocsSitePage): ServerRoute {
  return {
    path: page.path === '/' ? '' : page.path.slice(1),
    renderMode: RenderMode.Server,
    ...(page.httpStatus === undefined ? {} : { status: page.httpStatus }),
  };
}

export const serverRoutes: ServerRoute[] = [
  ...sitePages.map(serverRouteForPage),
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
  },
];
