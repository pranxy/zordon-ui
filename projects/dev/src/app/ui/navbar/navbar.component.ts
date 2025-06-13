import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services';

@Component({
    selector: 'dev-navbar',
    imports: [RouterLink, TitleCasePipe],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    themeService = inject(ThemeService);

    sections: { path: string; label: string }[] = [
        {
            path: '/docs',
            label: 'Docs',
        },
        {
            path: '/components',
            label: 'Components',
        },
        // {
        //     path: '/examples',
        //     label: 'Examples',
        // },
        // {
        //     path: '/resources',
        //     label: 'Resources',
        // },
    ];
}
