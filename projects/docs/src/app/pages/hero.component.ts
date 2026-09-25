import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdHero, ZdHeroContent, ZdHeroOverlay } from '@pranxy/zordon-ui/hero';

import { heroReference, overlayCode, sideCode } from '../content/hero.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads the daisyUI classes Hero emits, only while this page is in use. */
@Component({
  selector: 'docs-hero-daisy-styles',
  template: '',
  styleUrl: './styles/hero.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class HeroDaisyStylesComponent {}

/** Hero has no inputs, so the playground is a live example with its code. */
@Component({
  selector: 'docs-hero-page',
  imports: [
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    HeroDaisyStylesComponent,
    RouterLink,
    ZdButton,
    ZdHero,
    ZdHeroContent,
    ZdHeroOverlay,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-hero-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="launch.html" [code]="overlayCode">
        <section zdHero class="launch" aria-labelledby="launch-title">
          <div zdHeroOverlay class="shade"></div>
          <div zdHeroContent class="launch-content">
            <div>
              <h2 id="launch-title" class="title">Build faster with native Angular</h2>
              <p>Components that keep your markup.</p>
              <a
                zdButton
                color="primary"
                href="/docs/getting-started"
                routerLink="/docs/getting-started"
                >Get started</a
              >
            </div>
          </div>
        </section>
      </docs-example>

      <docs-section
        id="side-by-side"
        level="3"
        heading="Side by side"
        description="Lay out the content box yourself: here a figure and text sit in a row from 40rem up."
      >
        <docs-example label="book.html" [code]="sideCode">
          <section zdHero class="book" aria-labelledby="book-title">
            <div zdHeroContent class="side">
              <div class="cover" role="img" aria-label="Book cover: Field notes"></div>
              <div>
                <h2 id="book-title" class="title">Field notes</h2>
                <p>Twelve short essays on building accessible interfaces.</p>
                <button zdButton type="button">Read a sample</button>
              </div>
            </div>
          </section>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .launch,
    .book {
      inline-size: 100%;
      border-radius: var(--docs-radius-lg);
      overflow: hidden;
    }

    .launch {
      min-block-size: 18rem;
      background:
        radial-gradient(circle at 20% 30%, var(--color-accent), transparent 45%),
        linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: var(--color-neutral-content);
      text-align: center;
    }

    .shade {
      background: color-mix(in srgb, var(--color-neutral) 55%, transparent);
    }

    .title {
      margin: 0 0 var(--docs-space-2);
      font-size: var(--docs-text-h2);
    }

    .launch p,
    .book p {
      margin: 0 0 var(--docs-space-4);
    }

    .book {
      background: var(--docs-surface);
      border: 1px solid var(--docs-border);
    }

    .side {
      display: flex;
      flex-direction: column;
      gap: var(--docs-space-5);
    }

    .cover {
      inline-size: 8rem;
      aspect-ratio: 2 / 3;
      flex: none;
      border-radius: var(--docs-radius-sm);
      background: linear-gradient(160deg, var(--color-info), var(--color-primary));
    }

    @media (min-width: 40rem) {
      .side {
        flex-direction: row;
      }
    }
  `,
})
export class HeroPageComponent {
  protected readonly reference = heroReference;
  protected readonly overlayCode = overlayCode;
  protected readonly sideCode = sideCode;
}
