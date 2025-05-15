import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from './core/app-layout/app-layout.component';

@Component({
    selector: 'dev-root',
    imports: [RouterOutlet, AppLayoutComponent],
    templateUrl: './app.component.html'
})
export class AppComponent {}
