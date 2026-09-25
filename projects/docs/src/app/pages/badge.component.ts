import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdBadge, type ZdBadgeColor, type ZdBadgeVariant } from '@pranxy/zordon-ui/badge';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdLink } from '@pranxy/zordon-ui/link';

import {
  badgeColors,
  badgePlaygroundControls,
  badgePlaygroundSnippet,
  badgeReference,
  colorsCode,
  inContextCode,
} from '../content/badge.content';
import { colorOf, sizeOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Badge emits (and Link's for the example), only on this page. */
@Component({
  selector: 'docs-badge-daisy-styles',
  template: '',
  styleUrls: ['./styles/badge.daisy.css', './styles/link.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class BadgeDaisyStylesComponent {}

@Component({
  selector: 'docs-badge-page',
  imports: [
    BadgeDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    RouterLink,
    ZdBadge,
    ZdButton,
    ZdLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-badge-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Badge"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <span
            zdBadge
            [color]="colorOf(values)"
            [variant]="variantOf(values)"
            [size]="sizeOf(values)"
          >
            New
          </span>
        </ng-template>
      </docs-playground>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles, filled by default. The text uses each role’s content color."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          @for (color of colors; track color) {
            <span zdBadge [color]="color">{{ color }}</span>
          }
        </docs-example>
      </docs-section>

      <docs-section
        id="in-context"
        level="3"
        heading="In links and buttons"
        description="A count inside a control becomes part of its name, so give it words: “Inbox 3 unread”."
      >
        <docs-example label="counts.html" [code]="inContextCode">
          <a zdLink routerLink="/components" class="count-link">
            Inbox
            <span zdBadge color="primary" size="sm"
              >3<span class="docs-visually-hidden"> unread</span></span
            >
          </a>
          <button zdButton type="button">Filters <span zdBadge size="sm">2</span></button>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .count-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
  `,
})
export class BadgePageComponent {
  protected readonly reference = badgeReference;
  protected readonly controls = badgePlaygroundControls;
  protected readonly snippet = badgePlaygroundSnippet;
  protected readonly colors: readonly ZdBadgeColor[] = badgeColors;
  protected readonly colorsCode = colorsCode;
  protected readonly inContextCode = inContextCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;

  protected variantOf(values: PlaygroundValues): ZdBadgeVariant | undefined {
    const value = values['variant'];
    return value === 'default' ? undefined : (value as ZdBadgeVariant);
  }
}
