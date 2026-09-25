import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ZdLink } from '@pranxy/zordon-ui/link';

import { colorOf, flagOf } from '../content/form-controls.content';
import {
  disabledFiles,
  externalCode,
  linkPlaygroundControls,
  linkPlaygroundSnippet,
  linkReference,
  routerCode,
} from '../content/link.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Link emits, only while this page is in use. */
@Component({
  selector: 'docs-link-daisy-styles',
  template: '',
  styleUrl: './styles/link.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class LinkDaisyStylesComponent {}

@Component({
  selector: 'docs-link-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    LinkDaisyStylesComponent,
    RouterLink,
    RouterLinkActive,
    ZdLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-link-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Link"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <a
            zdLink
            routerLink="/components"
            [color]="colorOf(values)"
            [hover]="flagOf(values, 'hover')"
            [zdDisabled]="flagOf(values, 'zdDisabled')"
          >
            Browse the components
          </a>
        </ng-template>
      </docs-playground>

      <docs-section
        id="router"
        level="3"
        heading="Router and current page"
        description="Router directives sit alongside zdLink. routerLinkActive marks this page’s link as current; Link itself never does."
      >
        <docs-example label="nav.html" [code]="routerCode">
          <nav class="docs-cluster" aria-label="Example links">
            <a
              zdLink
              routerLink="/components/link"
              routerLinkActive="current"
              ariaCurrentWhenActive="page"
            >
              Link
            </a>
            <a zdLink routerLink="/components/button">Button</a>
          </nav>
        </docs-example>
      </docs-section>

      <docs-section
        id="unavailable"
        level="3"
        heading="Unavailable"
        description="Anchors have no disabled attribute. zdDisabled keeps the link focusable and discoverable, announces it as disabled, and blocks the native href navigation."
      >
        <docs-example label="billing" [files]="disabledFiles">
          <div class="docs-cluster">
            <a zdLink href="/components/modal" [zdDisabled]="!paid()">Billing history</a>
            <label class="docs-choice">
              <input type="checkbox" [checked]="paid()" (change)="paid.set(!paid())" />
              Account paid
            </label>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="external"
        level="3"
        heading="External links"
        description="New-tab behaviour is yours to announce; here hidden text tells screen-reader users."
      >
        <docs-example label="external.html" [code]="externalCode">
          <a zdLink href="https://daisyui.com/components/link/" target="_blank" rel="noopener">
            daisyUI Link <span class="docs-visually-hidden">(opens in a new tab)</span>
          </a>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .current {
      font-weight: var(--docs-weight-bold);
    }
  `,
})
export class LinkPageComponent {
  protected readonly reference = linkReference;
  protected readonly controls = linkPlaygroundControls;
  protected readonly snippet = linkPlaygroundSnippet;
  protected readonly routerCode = routerCode;
  protected readonly disabledFiles = disabledFiles;
  protected readonly externalCode = externalCode;
  protected readonly colorOf = colorOf;
  protected readonly flagOf = flagOf;
  protected readonly paid = signal(false);
}
