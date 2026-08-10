import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { SsrExampleAppComponent } from './app/app.component';
import { serverConfig } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(SsrExampleAppComponent, serverConfig, context);

export default bootstrap;
