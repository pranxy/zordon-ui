import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
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
        MatIcon,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
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
    state = getAppState();

    navItems = [{ name: 'Button', route: '/components/button' }];

    getDensityClass() {
        return `demo-density-${this.state.density}`;
    }
}
