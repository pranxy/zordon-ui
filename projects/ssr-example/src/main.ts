import { bootstrapApplication } from '@angular/platform-browser';
import { SsrExampleAppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(SsrExampleAppComponent, appConfig).catch(error => console.error(error));
