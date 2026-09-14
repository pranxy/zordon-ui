import { bootstrapApplication } from '@angular/platform-browser';
import { SsrExampleShellComponent } from './app/app-shell.component';
import { appConfig } from './app/app.config';

bootstrapApplication(SsrExampleShellComponent, appConfig).catch(error => console.error(error));
