import { FocusOrigin } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { getAppState, setAppState } from '../app-state';

@Component({
    selector: 'dev-app-header',
    imports: [MatToolbar, MatTooltip, MatIcon, MatIconButton],
    templateUrl: 'app-header.html',
    styleUrl: './app-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeader {
    toggleSidenav = output<FocusOrigin | undefined>();

    state = getAppState();

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
}
