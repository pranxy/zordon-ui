import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavSection {
    title: string;
    items: NavItem[];
}

interface NavItem {
    label: string;
    route: string;
    icon?: string;
}

@Component({
    selector: 'dev-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    sections: NavSection[] = [
        // {
        //     title: 'Getting Started',
        //     items: [{ label: 'Introduction', route: '/', icon: 'home' }],
        // },
        {
            title: 'Components',
            items: [
                { label: 'Button', route: '/components/button' },
                { label: 'Card', route: '/components/card' },
                { label: 'Form', route: '/components/form' },
                { label: 'Typography', route: '/components/typography' },
                { label: 'Modal', route: '/components/modal' },
                { label: 'Alert', route: '/components/alert' },
                { label: 'Table', route: '/components/table' },
                { label: 'Navigation', route: '/components/navigation' },
            ],
        },
        // {
        //     title: 'Resources',
        //     items: [
        //         { label: 'daisyUI Website', route: 'https://daisyui.com' },
        //         { label: 'Angular Website', route: 'https://angular.dev' },
        //     ],
        // },
    ];
}
