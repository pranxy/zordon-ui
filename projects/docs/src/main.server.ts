import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { DocsAppComponent } from './app/app.component';
import { serverConfig } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(DocsAppComponent, serverConfig, context);

export default bootstrap;
