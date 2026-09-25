import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdFooter, ZdFooterTitle, type ZdFooterDirection } from '@pranxy/zordon-ui/footer';

import { flagOf } from '../content/form-controls.content';
import {
  brandCode,
  footerPlaygroundControls,
  footerPlaygroundSnippet,
  footerReference,
} from '../content/footer.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Footer emits, only while this page is in use. */
@Component({
  selector: 'docs-footer-daisy-styles',
  template: '',
  styleUrl: './styles/footer.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class FooterDaisyStylesComponent {}

/** The examples use section-level footers, so they don't add contentinfo landmarks. */
@Component({
  selector: 'docs-footer-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    FooterDaisyStylesComponent,
    RouterLink,
    ZdFooter,
    ZdFooterTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-footer-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Footer"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <footer
            zdFooter
            class="site-footer"
            [direction]="directionOf(values)"
            [center]="flagOf(values, 'center')"
          >
            <nav aria-label="Product">
              <h4 zdFooterTitle>Product</h4>
              <a routerLink="/components">Components</a>
              <a routerLink="/docs/getting-started">Get started</a>
            </nav>
            <nav aria-label="Company">
              <h4 zdFooterTitle>Company</h4>
              <a href="https://github.com/pranxy/zordon-ui">About</a>
              <a routerLink="/resources">Resources</a>
            </nav>
          </footer>
        </ng-template>
      </docs-playground>

      <docs-section
        id="brand"
        level="3"
        heading="Centered brand footer"
        description="A short centered footer: brand, one line and a link group."
      >
        <docs-example label="brand.html" [code]="brandCode">
          <footer zdFooter center class="site-footer">
            <p class="brand">Zordon UI</p>
            <p>Angular components for daisyUI. MIT licensed.</p>
            <nav aria-label="Social">
              <a href="https://github.com/pranxy/zordon-ui">GitHub</a>
            </nav>
          </footer>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .site-footer {
      padding: var(--docs-space-5);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface-raised);
    }

    .site-footer h4 {
      margin: 0;
      font-size: var(--docs-text-sm);
    }

    .site-footer p {
      margin: 0;
    }

    .site-footer a {
      color: inherit;
    }

    .brand {
      font-size: var(--docs-text-h4);
      font-weight: var(--docs-weight-bold);
    }
  `,
})
export class FooterPageComponent {
  protected readonly reference = footerReference;
  protected readonly controls = footerPlaygroundControls;
  protected readonly snippet = footerPlaygroundSnippet;
  protected readonly brandCode = brandCode;
  protected readonly flagOf = flagOf;

  protected directionOf(values: PlaygroundValues): ZdFooterDirection | undefined {
    const value = values['direction'];
    return value === 'default' ? undefined : (value as ZdFooterDirection);
  }
}
