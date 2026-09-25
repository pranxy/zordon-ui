import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdList, ZdListColGrow, ZdListColWrap, ZdListRow } from '@pranxy/zordon-ui/list';

import {
  growCode,
  listPlaygroundControls,
  listPlaygroundSnippet,
  listReference,
} from '../content/list.content';
import { flagOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes List emits, only while this page is in use. */
@Component({
  selector: 'docs-list-daisy-styles',
  template: '',
  styleUrl: './styles/list.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class ListDaisyStylesComponent {}

@Component({
  selector: 'docs-list-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ListDaisyStylesComponent,
    ZdList,
    ZdListColGrow,
    ZdListColWrap,
    ZdListRow,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-list-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="List"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <ul zdList class="tracks" aria-label="Recently played">
            <li zdListRow>
              <span class="index">01</span>
              @if (flagOf(values, 'cover')) {
                <span class="cover" aria-hidden="true"></span>
                <div zdListColGrow>
                  <div>Moonlit Drive</div>
                  <div class="artist">Avery Chen</div>
                </div>
              } @else {
                <div>
                  <div>Moonlit Drive</div>
                  <div class="artist">Avery Chen</div>
                </div>
              }
              @if (flagOf(values, 'wrapNote')) {
                <p zdListColWrap class="note">Saved for offline listening.</p>
              }
              <button type="button" class="play" aria-label="Play Moonlit Drive">▶</button>
            </li>
          </ul>
        </ng-template>
      </docs-playground>

      <docs-section
        id="grow"
        level="3"
        heading="Growing column"
        description="With a cover as the second child, zdListColGrow gives the spare width to the title instead."
      >
        <docs-example label="tracks.html" [code]="growCode">
          <ul zdList class="tracks" aria-label="Most played this week">
            @for (track of tracks; track track.title; let i = $index) {
              <li zdListRow>
                <span class="index">0{{ i + 1 }}</span>
                <span class="cover" [class]="track.tone" aria-hidden="true"></span>
                <div zdListColGrow>
                  <div>{{ track.title }}</div>
                  <div class="artist">{{ track.artist }}</div>
                </div>
                <button type="button" class="play" [attr.aria-label]="'Play ' + track.title">
                  ▶
                </button>
              </li>
            }
          </ul>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .tracks {
      inline-size: min(26rem, 100%);
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    .index {
      font-variant-numeric: tabular-nums;
      color: var(--docs-muted-text);
    }

    .cover {
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border-radius: var(--docs-radius-sm);
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    }

    .cover.info {
      background: linear-gradient(135deg, var(--color-info), var(--color-primary));
    }

    .cover.accent {
      background: linear-gradient(135deg, var(--color-accent), var(--color-info));
    }

    .artist,
    .note {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }

    .note {
      margin: 0;
    }

    .play {
      inline-size: 2.25rem;
      block-size: 2.25rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-pill);
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .play:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }
  `,
})
export class ListPageComponent {
  protected readonly reference = listReference;
  protected readonly controls = listPlaygroundControls;
  protected readonly snippet = listPlaygroundSnippet;
  protected readonly growCode = growCode;
  protected readonly flagOf = flagOf;

  protected readonly tracks = [
    { title: 'Moonlit Drive', artist: 'Avery Chen', tone: 'cover' },
    { title: 'Paper Lanterns', artist: 'Noor Haddad', tone: 'cover info' },
    { title: 'Low Tide', artist: 'Mateo Silva', tone: 'cover accent' },
  ] as const;
}
