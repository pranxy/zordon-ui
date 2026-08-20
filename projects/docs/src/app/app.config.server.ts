import { type ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { DOCS_CANONICAL_ORIGIN, normalizeCanonicalOrigin } from './site-origin';

const serverOnlyConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: DOCS_CANONICAL_ORIGIN,
      useFactory: () => normalizeCanonicalOrigin(process.env['DOCS_CANONICAL_ORIGIN']),
    },
  ],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverOnlyConfig);
