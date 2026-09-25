import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdBrowserMockup, ZdBrowserMockupToolbar } from '@pranxy/zordon-ui/browser-mockup';

import {
  browserCode,
  browserMockupReference,
  screenshotCode,
} from '../content/browser-mockup.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads daisyUI's mockup classes, only while this page is in use. */
@Component({
  selector: 'docs-browser-mockup-daisy-styles',
  template: '',
  styleUrl: './styles/mockup.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class BrowserMockupDaisyStylesComponent {}

/** Browser Mockup has no inputs, so the playground is a live example with its code. */
@Component({
  selector: 'docs-browser-mockup-page',
  imports: [
    BrowserMockupDaisyStylesComponent,
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdBrowserMockup,
    ZdBrowserMockupToolbar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-browser-mockup-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="preview.html" [code]="browserCode">
        <figure zdBrowserMockup class="preview">
          <div zdBrowserMockupToolbar>
            <div class="input">https://zordon-ui.dev</div>
          </div>
          <div class="content">
            <p class="headline">Angular components for daisyUI</p>
            <p>Native markup, typed inputs, server rendered.</p>
          </div>
          <figcaption class="docs-visually-hidden">Preview of the Zordon UI home page</figcaption>
        </figure>
      </docs-example>

      <docs-section
        id="screenshot"
        level="3"
        heading="Captioned screenshot"
        description="A visible caption names the preview, and the image inside keeps its own alternative text."
      >
        <docs-example label="dashboard.html" [code]="screenshotCode">
          <figure class="captioned">
            <div zdBrowserMockup class="preview">
              <div zdBrowserMockupToolbar>
                <div class="input">https://example.com/dashboard</div>
              </div>
              <div
                class="shot"
                role="img"
                aria-label="Dashboard with three charts and a table of orders"
              >
                <span class="bar"></span><span class="bar"></span><span class="bar"></span>
              </div>
            </div>
            <figcaption>The new dashboard, shipped in September.</figcaption>
          </figure>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .preview {
      inline-size: min(36rem, 100%);
      margin: 0;
      border: 1px solid var(--docs-border-strong);
      background: var(--docs-surface);
    }

    .content {
      display: grid;
      place-content: center;
      gap: var(--docs-space-2);
      min-block-size: 12rem;
      padding: var(--docs-space-5);
      border-block-start: 1px solid var(--docs-border);
      background: var(--docs-surface-raised);
      text-align: center;
    }

    .content p {
      margin: 0;
    }

    .captioned {
      display: grid;
      justify-items: center;
      gap: var(--docs-space-2);
      inline-size: 100%;
      margin: 0;
    }

    figcaption {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }

    .shot {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      align-items: end;
      gap: var(--docs-space-3);
      block-size: 10rem;
      padding: var(--docs-space-4);
      border-block-start: 1px solid var(--docs-border);
      background: var(--docs-surface-raised);
    }

    .bar {
      block-size: 60%;
      border-radius: var(--docs-radius-sm);
      background: var(--docs-accent);
    }

    .bar:nth-child(2) {
      block-size: 90%;
    }

    .bar:nth-child(3) {
      block-size: 40%;
    }

    .headline {
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-bold);
    }
  `,
})
export class BrowserMockupPageComponent {
  protected readonly reference = browserMockupReference;
  protected readonly browserCode = browserCode;
  protected readonly screenshotCode = screenshotCode;
}
