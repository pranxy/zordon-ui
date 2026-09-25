import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import {
  ZdBreadcrumbs,
  type ZdBreadcrumbIconContext,
  type ZdBreadcrumbItem,
  type ZdBreadcrumbOverflow,
} from '@pranxy/zordon-ui/breadcrumbs';

import {
  breadcrumbsPlaygroundControls,
  breadcrumbsPlaygroundSnippet,
  breadcrumbsReference,
  iconsFiles,
  routerFiles,
  shortLabelsCode,
} from '../content/breadcrumbs.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's breadcrumbs class, only while this page is in use. */
@Component({
  selector: 'docs-breadcrumbs-daisy-styles',
  template: '',
  styleUrl: './styles/breadcrumbs.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class BreadcrumbsDaisyStylesComponent {}

@Component({
  selector: 'docs-breadcrumbs-page',
  imports: [
    BreadcrumbsDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdBreadcrumbs,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-breadcrumbs-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Breadcrumbs"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-breadcrumbs
            class="trail"
            label="Page path"
            [items]="deepPath"
            [overflow]="overflowOf(values)"
            [separator]="$any(values['separator'])"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="router"
        level="3"
        heading="Router links"
        description="Ancestors use routerLink; the current page has no destination and gets aria-current. These links really navigate this site."
      >
        <docs-example label="trail" [files]="routerFiles">
          <zd-breadcrumbs label="Documentation path" [items]="docsPath" />
        </docs-example>
      </docs-section>

      <docs-section
        id="short-labels"
        level="3"
        heading="Short labels"
        description="On narrow screens the short label is shown; the full label is still the accessible name. Narrow the window to see it."
      >
        <docs-example label="item.ts" language="ts" [code]="shortLabelsCode">
          <zd-breadcrumbs label="Report path" [items]="reportPath" />
        </docs-example>
      </docs-section>

      <docs-section
        id="icons"
        level="3"
        heading="Icons"
        description="An icon template receives the item. Its wrapper is hidden from assistive technology, so keep it decorative."
      >
        <docs-example label="icons" [files]="iconsFiles">
          <ng-template #folder><span aria-hidden="true">🗀</span></ng-template>
          <zd-breadcrumbs label="Folder path" [items]="folders(folder)" />
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .trail {
      inline-size: 100%;
    }
  `,
})
export class BreadcrumbsPageComponent {
  protected readonly reference = breadcrumbsReference;
  protected readonly controls = breadcrumbsPlaygroundControls;
  protected readonly snippet = breadcrumbsPlaygroundSnippet;
  protected readonly routerFiles = routerFiles;
  protected readonly shortLabelsCode = shortLabelsCode;
  protected readonly iconsFiles = iconsFiles;

  protected readonly deepPath: readonly ZdBreadcrumbItem[] = [
    { id: 'home', label: 'Home', routerLink: '/' },
    { id: 'components', label: 'Components', routerLink: '/components' },
    {
      id: 'navigation',
      label: 'Navigation',
      routerLink: '/components',
      queryParams: { category: 'navigation' },
    },
    { id: 'menu', label: 'Menu', routerLink: '/components/menu' },
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
  ];

  protected readonly docsPath: readonly ZdBreadcrumbItem[] = [
    { id: 'home', label: 'Home', routerLink: '/' },
    { id: 'components', label: 'Components', routerLink: '/components' },
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
  ];

  protected readonly reportPath: readonly ZdBreadcrumbItem[] = [
    { id: 'reports', label: 'Reports', routerLink: '/components/breadcrumbs' },
    {
      id: 'report',
      label: 'Quarterly performance report, third quarter 2026',
      shortLabel: 'Q3 report',
    },
  ];

  private folderItems: readonly ZdBreadcrumbItem[] | undefined;

  protected folders(icon: TemplateRef<ZdBreadcrumbIconContext>): readonly ZdBreadcrumbItem[] {
    // One stable array, so change detection doesn't rebuild the trail.
    return (this.folderItems ??= [
      { id: 'drive', label: 'Drive', routerLink: '/components/breadcrumbs', icon },
      { id: 'design', label: 'Design', routerLink: '/components/breadcrumbs', icon },
      { id: 'logos', label: 'Logos', icon },
    ]);
  }

  protected overflowOf(values: PlaygroundValues): ZdBreadcrumbOverflow {
    return values['overflow'] as ZdBreadcrumbOverflow;
  }
}
