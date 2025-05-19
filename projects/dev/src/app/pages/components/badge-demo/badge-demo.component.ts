import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZdBadge, ZdBadgeColor, ZdBadgeSize, ZdBadgeType } from '@pranxy/zordon-ui/badge';

@Component({
    selector: 'dev-badge-demo',
    imports: [ZdBadge, TitleCasePipe],
    styleUrl: './badge-demo.component.scss',
    templateUrl: './badge-demo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BadgeDemoComponent {
    colors: ZdBadgeColor[] = [
        'warning',
        'success',
        'secondary',
        'primary',
        'neutral',
        'info',
        'error',
        'accent',
    ];

    sizes: ZdBadgeSize[] = ['xs', 'sm', 'md', 'lg'];

    types: ZdBadgeType[] = ['dash', 'ghost', 'outline', 'soft'];

    isDarkTheme = false;

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    }
}
