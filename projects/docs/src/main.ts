import { bootstrapApplication } from '@angular/platform-browser';
import { DocsAppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(DocsAppComponent, appConfig).catch(error => console.error(error));
