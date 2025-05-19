import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services';
import { FooterComponent, NavbarComponent, SidebarComponent } from './ui';

@Component({
    selector: 'dev-root',
    imports: [RouterOutlet, NavbarComponent, FooterComponent, SidebarComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    themeService = inject(ThemeService);

    constructor() {
        effect(() => {
            document.documentElement.setAttribute('data-theme', this.themeService.currentTheme());
        });
    }
}
