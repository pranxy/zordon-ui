import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdJoin, ZdJoinItem, type ZdJoinDirection } from '@pranxy/zordon-ui/join';
import { ZdTextInput } from '@pranxy/zordon-ui/text-input';

import {
  joinPlaygroundControls,
  joinPlaygroundSnippet,
  joinReference,
  searchCode,
} from '../content/join.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

type Align = 'start' | 'center' | 'end';

/** Loads daisyUI's join and text-input classes, only while this page is in use. */
@Component({
  selector: 'docs-join-daisy-styles',
  template: '',
  styleUrls: ['./styles/join.daisy.css', './styles/text-input.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class JoinDaisyStylesComponent {}

@Component({
  selector: 'docs-join-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    JoinDaisyStylesComponent,
    ZdButton,
    ZdJoin,
    ZdJoinItem,
    ZdTextInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-join-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Join"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="docs-stack">
            <div zdJoin role="group" aria-label="Text alignment" [direction]="directionOf(values)">
              @for (option of alignments; track option) {
                <button
                  zdButton
                  zdJoinItem
                  type="button"
                  [color]="align() === option ? 'primary' : undefined"
                  [attr.aria-pressed]="align() === option"
                  (click)="align.set(option)"
                >
                  {{ option }}
                </button>
              }
            </div>
            <p class="docs-status">Aligned: {{ align() }}</p>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="search"
        level="3"
        heading="Field and button"
        description="A labelled search field joined to its submit button. The form keeps native Enter-to-submit."
      >
        <docs-example label="search.html" [code]="searchCode">
          <div class="docs-stack">
            <form zdJoin role="search" (submit)="search($event)">
              <label for="join-search" class="docs-visually-hidden">Search components</label>
              <input
                zdTextInput
                zdJoinItem
                id="join-search"
                name="query"
                type="search"
                placeholder="Search components"
              />
              <button zdButton zdJoinItem color="primary" type="submit">Search</button>
            </form>
            <p class="docs-status" role="status">{{ result() }}</p>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
})
export class JoinPageComponent {
  protected readonly reference = joinReference;
  protected readonly controls = joinPlaygroundControls;
  protected readonly snippet = joinPlaygroundSnippet;
  protected readonly searchCode = searchCode;
  protected readonly alignments: readonly Align[] = ['start', 'center', 'end'];
  protected readonly align = signal<Align>('start');
  protected readonly result = signal('');

  protected directionOf(values: PlaygroundValues): ZdJoinDirection | undefined {
    const value = values['direction'];
    return value === 'default' ? undefined : (value as ZdJoinDirection);
  }

  protected search(event: SubmitEvent): void {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const query = String(data.get('query') ?? '').trim();
    this.result.set(query ? `Searched for “${query}”` : 'Type something to search');
  }
}
