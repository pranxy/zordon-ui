import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { indexableSitePages } from './app/site-catalog';
import { normalizeCanonicalOrigin } from './app/site-origin';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

function canonicalOrigin(): string | undefined {
  return normalizeCanonicalOrigin(process.env['DOCS_CANONICAL_ORIGIN']);
}

function sitemapXml(origin: string): string {
  const urls = indexableSitePages()
    .map(page => `  <url><loc>${origin}${page.path}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

app.get('/robots.txt', (_request, response) => {
  const origin = canonicalOrigin();
  response
    .type('text/plain')
    .send(
      origin
        ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n',
    );
});

app.get('/sitemap.xml', (_request, response) => {
  const origin = canonicalOrigin();
  if (!origin) {
    response.status(404).end();
    return;
  }

  response.type('application/xml').send(sitemapXml(origin));
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((request, response, next) => {
  angularApp
    .handle(request)
    .then(result => (result ? writeResponseToNodeResponse(result, response) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] ?? 4310;
  app.listen(port, error => {
    if (error) {
      throw error;
    }

    console.log(`Zordon UI documentation server listening on http://127.0.0.1:${port}`);
  });
}

export const requestHandler = createNodeRequestHandler(app);
