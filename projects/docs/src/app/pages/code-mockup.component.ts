import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdCodeMockup } from '@pranxy/zordon-ui/code-mockup';

import { codeMockupReference, installCode, outputCode } from '../content/code-mockup.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads daisyUI's mockup classes, only while this page is in use. */
@Component({
  selector: 'docs-code-mockup-daisy-styles',
  template: '',
  styleUrl: './styles/mockup.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class CodeMockupDaisyStylesComponent {}

/** Code Mockup has no inputs, so the playground is a live example with its code. */
@Component({
  selector: 'docs-code-mockup-page',
  imports: [
    CodeMockupDaisyStylesComponent,
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdCodeMockup,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-code-mockup-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="install.html" [code]="installCode">
        <section zdCodeMockup class="snippet" aria-label="Install command">
          <pre data-prefix="$"><code>npm install &#64;pranxy/zordon-ui</code></pre>
        </section>
      </docs-example>

      <docs-section
        id="output"
        level="3"
        heading="Numbered output"
        description="Line numbers as prefixes, and a highlighted last line that also says “Done” in words."
      >
        <docs-example label="build.html" [code]="outputCode">
          <section zdCodeMockup class="snippet" aria-label="Build output">
            <pre data-prefix="1"><code>ng build</code></pre>
            <pre data-prefix="2"><code>Building…</code></pre>
            <pre data-prefix="3" class="done"><code>Done: application bundle generated.</code></pre>
          </section>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .snippet {
      inline-size: min(32rem, 100%);
      background: var(--docs-code-bg);
      color: var(--docs-code-fg);
    }

    .done {
      background: var(--color-success);
      color: var(--color-success-content);
    }
  `,
})
export class CodeMockupPageComponent {
  protected readonly reference = codeMockupReference;
  protected readonly installCode = installCode;
  protected readonly outputCode = outputCode;
}
