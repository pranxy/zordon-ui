import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {
  ZdStack,
  type ZdStackHorizontalAlignment,
  type ZdStackVerticalAlignment,
} from '@pranxy/zordon-ui/stack';

import {
  notificationsCode,
  stackPlaygroundControls,
  stackPlaygroundSnippet,
  stackReference,
} from '../content/stack.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Stack emits, only while this page is in use. */
@Component({
  selector: 'docs-stack-daisy-styles',
  template: '',
  styleUrl: './styles/stack.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class StackDaisyStylesComponent {}

@Component({
  selector: 'docs-stack-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    StackDaisyStylesComponent,
    ZdStack,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-stack-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Stack"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div
            zdStack
            class="pile"
            [verticalAlignment]="verticalOf(values)"
            [horizontalAlignment]="horizontalOf(values)"
          >
            <div class="layer one">A</div>
            <div class="layer two" aria-hidden="true">B</div>
            <div class="layer three" aria-hidden="true">C</div>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="notifications"
        level="3"
        heading="Notification pile"
        description="Only the top card has content; the others are empty and hidden, and the label gives the count."
      >
        <docs-example label="notifications.html" [code]="notificationsCode">
          <section zdStack class="notifications" aria-label="Notifications, 3 unread">
            <article class="note">
              <p>Build 184 passed</p>
              <p class="meta">2 minutes ago</p>
            </article>
            <article class="note" aria-hidden="true"></article>
            <article class="note" aria-hidden="true"></article>
          </section>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .pile {
      inline-size: 8rem;
      block-size: 8rem;
    }

    .layer {
      display: grid;
      place-items: center;
      border-radius: var(--docs-radius-md);
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-bold);
    }

    .one {
      background: var(--color-primary);
      color: var(--color-primary-content);
    }

    .two {
      background: var(--color-accent);
      color: var(--color-accent-content);
    }

    .three {
      background: var(--color-secondary);
      color: var(--color-secondary-content);
    }

    .notifications {
      inline-size: min(18rem, 100%);
    }

    .note {
      min-block-size: 4.5rem;
      padding: var(--docs-space-3) var(--docs-space-4);
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      box-shadow: var(--docs-shadow);
    }

    .note p {
      margin: 0;
    }

    .meta {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class StackPageComponent {
  protected readonly reference = stackReference;
  protected readonly controls = stackPlaygroundControls;
  protected readonly snippet = stackPlaygroundSnippet;
  protected readonly notificationsCode = notificationsCode;

  protected verticalOf(values: PlaygroundValues): ZdStackVerticalAlignment | undefined {
    const value = values['verticalAlignment'];
    return value === 'default' ? undefined : (value as ZdStackVerticalAlignment);
  }

  protected horizontalOf(values: PlaygroundValues): ZdStackHorizontalAlignment | undefined {
    const value = values['horizontalAlignment'];
    return value === 'default' ? undefined : (value as ZdStackHorizontalAlignment);
  }
}
