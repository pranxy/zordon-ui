import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DocsLinkCardsComponent,
  DocsPageHeaderComponent,
  DocsSectionComponent,
  type DocsLinkCard,
} from '../ui';

const projectLinks: readonly DocsLinkCard[] = [
  {
    eyebrow: 'Catalogue',
    title: 'Component catalogue',
    description: 'Published maturity and reference contracts for each documented component.',
    path: '/components',
  },
  {
    eyebrow: 'Get started',
    title: 'Getting started',
    description:
      'Installation, styling configuration, and the shortest route to a first component.',
    path: '/docs/getting-started',
  },
];

const externalLinks = [
  {
    label: 'GitHub repository',
    href: 'https://github.com/pranxy/zordon-ui',
    description: 'Source, issues, pull requests, releases, and contribution history.',
  },
  {
    label: 'Roadmap and status',
    href: 'https://github.com/pranxy/zordon-ui/tree/master/docs/plans',
    description: 'Tracked implementation plans and evidence for work that is complete or pending.',
  },
  {
    label: 'Changelog and releases',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/projects/components/CHANGELOG.md',
    description: 'Published package changes, with repository releases for versioned artifacts.',
  },
  {
    label: 'Contributing',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/CONTRIBUTING.md',
    description: 'Workspace setup, validation expectations, and the contribution workflow.',
  },
  {
    label: 'Component maturity policy',
    href: 'https://github.com/pranxy/zordon-ui/blob/master/docs/contributing/component-maturity.md',
    description: 'What planned, preview, and stable mean, and how components are promoted.',
  },
] as const;

const upstreamLinks = [
  { label: 'Angular documentation', href: 'https://angular.dev/' },
  { label: 'daisyUI documentation', href: 'https://daisyui.com/' },
  { label: 'Tailwind CSS documentation', href: 'https://tailwindcss.com/docs' },
] as const;

@Component({
  selector: 'docs-resources-page',
  imports: [DocsLinkCardsComponent, DocsPageHeaderComponent, DocsSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Project"
        heading="Resources"
        description="Follow the Zordon UI repository, project plans, contribution guidance, and the upstream Angular and daisyUI documentation that define supported boundaries."
      />

      <docs-section id="project" heading="Project">
        <docs-link-cards [cards]="projectLinks" />
        <ul class="links">
          @for (link of externalLinks; track link.href) {
            <li>
              <a [href]="link.href">{{ link.label }}</a>
              <span>{{ link.description }}</span>
            </li>
          }
        </ul>
      </docs-section>

      <docs-section id="upstream" heading="Upstream documentation">
        <ul class="links">
          @for (link of upstreamLinks; track link.href) {
            <li>
              <a [href]="link.href">{{ link.label }}</a>
            </li>
          }
        </ul>
      </docs-section>
    </article>
  `,
  styles: `
    .links {
      display: grid;
      gap: 0;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      list-style: none;
    }

    li {
      display: grid;
      gap: 0.2rem;
      padding: 0.875rem 1rem;
    }

    li + li {
      border-block-start: 1px solid var(--docs-border);
    }

    a {
      color: var(--docs-accent-strong);
      font-weight: var(--docs-weight-bold);
    }

    span {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class ResourcesPageComponent {
  protected readonly projectLinks = projectLinks;
  protected readonly externalLinks = externalLinks;
  protected readonly upstreamLinks = upstreamLinks;
}
