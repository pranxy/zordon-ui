import { FocusOrigin } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    signal,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AppHeader } from '../app-header/app-header';
import { getAppState } from '../app-state';

@Component({
    selector: 'dev-app-layout',
    standalone: true,
    imports: [
        NgClass,
        MatButtonModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatTooltipModule,
        RouterModule,
        AppHeader,
    ],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
    sidenav = viewChild(MatSidenav);

    state = getAppState();

    navItems = [
        { name: 'Button', route: '/components/button' },
        { name: 'Checkbox', route: '/components/checkbox' },
        { name: 'Radio', route: '/components/radio' },
    ];

    opened = signal<boolean>(true);

    toggleSidenav(focus?: FocusOrigin | undefined) {
        this.opened.set(!this.opened());
        this.sidenav()?.toggle(this.opened(), focus);
    }

    getDensityClass() {
        return `demo-density-${this.state.density}`;
    }
}
