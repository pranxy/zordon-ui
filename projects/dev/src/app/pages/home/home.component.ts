import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dev-home',
    imports: [RouterLink],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
    features = [
        {
            title: 'Angular CDK Integration',
            description:
                'Built on top of Angular CDK for robust accessibility, keyboard navigation, and advanced functionalities.',
            link: '/components',
        },
        {
            title: 'Modern Design System',
            description:
                'Leveraging TailwindCSS v4 and DaisyUI for a beautiful, consistent, and customizable design system.',
            link: '/',
        },
        {
            title: 'Type-Safe Components',
            description:
                'Fully typed components with TypeScript for better developer experience and fewer runtime errors.',
            link: '/components/forms',
        },
        {
            title: 'Advanced Animations',
            description:
                'Smooth, performant animations powered by Angular animations for enhanced user experience.',
            link: '/components/modals',
        },
        {
            title: 'Accessibility First',
            description:
                'WCAG 2.1 compliant components with full keyboard navigation and screen reader support.',
            link: '/components/typography',
        },
        {
            title: 'Enterprise Ready',
            description: 'Production-tested components used by Fortune 500 companies worldwide.',
            link: '/components/tables',
        },
    ];
}
