import { type BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { SsrExampleShellComponent } from './app/app-shell.component';
import { serverConfig } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(SsrExampleShellComponent, serverConfig, context);

export default bootstrap;
