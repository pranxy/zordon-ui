import { DOCUMENT, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { getAppState, setAppState } from '../app-state';

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
    ],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
    state = getAppState();

    navItems = [{ name: 'Button', route: '/components/button' }];

    /** List of possible global density scale values. */
    private _densityScales = [0, -1, -2, -3, -4, 'minimum', 'maximum'];

    constructor(
        private _element: ElementRef<HTMLElement>,
        @Inject(DOCUMENT) private _document: Document
    ) {}

    toggleTheme(value = !this.state.darkTheme) {
        this.state.darkTheme = value;
        this._document.body.classList.toggle('demo-unicorn-dark-theme', value);
        setAppState(this.state);
    }

    toggleFullscreen() {
        this._element.nativeElement.querySelector('.demo-content')?.requestFullscreen();
    }

    toggleDensity(index?: number, tooltipInstance?: MatTooltip) {
        if (index == null) {
            index =
                (this._densityScales.indexOf(this.state.density) + 1) % this._densityScales.length;
        }

        this.state.density = this._densityScales[index];
        setAppState(this.state);

        // Keep the tooltip open so we can see what the density was changed to. Ideally we'd
        // always show the density in a badge, but the M2 badge is too large for the toolbar.
        if (tooltipInstance) {
            requestAnimationFrame(() => tooltipInstance.show(0));
        }
    }

    getDensityClass() {
        return `demo-density-${this.state.density}`;
    }
}
