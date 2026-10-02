import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdHover3d } from '@pranxy/zordon-ui/hover-3d';

import {
  imageGalleryFiles,
  figureCode,
  hover3dCode,
  hover3dReference,
} from '../content/hover-3d.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads daisyUI's hover-3d class, only while this page is in use. */
@Component({
  selector: 'docs-hover-3d-daisy-styles',
  template: '',
  styleUrl: './styles/hover-3d.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class Hover3dDaisyStylesComponent {}

/** Hover 3D has no inputs, so the playground is a live example with its code. */
@Component({
  selector: 'docs-hover-3d-page',
  imports: [
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    Hover3dDaisyStylesComponent,
    ZdHover3d,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-hover-3d-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="card-link.html" [code]="hover3dCode">
        <a zdHover3d class="tilt" routerLink="/components/card">
          <img
            class="art"
            src="images/showcase/coast.webp"
            alt="Explore the coastal landscape card example"
            width="768"
            height="432"
            loading="lazy"
          />
          @for (zone of zones; track zone) {
            <div aria-hidden="true"></div>
          }
        </a>
      </docs-example>

      <docs-section
        id="figure"
        level="3"
        heading="Decorative figure"
        description="Without a destination, use a figure. Its text stays readable text; only the tilt is decoration."
      >
        <docs-example label="member-card.html" [code]="figureCode">
          <figure zdHover3d class="tilt">
            <div class="member-card">
              <p class="brand">Zordon UI</p>
              <p>Ada Lovelace · member since 2026</p>
            </div>
            @for (zone of zones; track zone) {
              <div aria-hidden="true"></div>
            }
          </figure>
        </docs-example>
      </docs-section>
      <docs-section
        id="image-gallery"
        level="3"
        heading="3D hover image gallery"
        description="Each image has its own eight decorative hover regions. The images remain useful on touch screens and with reduced motion."
      >
        <docs-example label="image-gallery" [files]="imageGalleryFiles">
          <div class="tilt-gallery">
            <figure zdHover3d class="tilt">
              <img
                src="images/showcase/coast.webp"
                alt="Atlantic coast"
                width="768"
                height="432"
                loading="lazy"
              />
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
            </figure>
            <figure zdHover3d class="tilt">
              <img
                src="images/showcase/lake-morning.webp"
                alt="Mountain lake in the morning"
                width="768"
                height="512"
                loading="lazy"
              />
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
            </figure>
            <figure zdHover3d class="tilt">
              <img
                src="images/showcase/lake-sunset.webp"
                alt="Mountain lake at sunset"
                width="768"
                height="512"
                loading="lazy"
              />
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
              <div aria-hidden="true"></div>
            </figure>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .tilt-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
      gap: 1.5rem;
      inline-size: 100%;
    }
    .tilt-gallery figure {
      margin: 0;
    }
    .tilt-gallery img {
      inline-size: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: 1rem;
    }
    @media (prefers-reduced-motion: reduce) {
      .tilt-gallery [zdHover3d] > :first-child {
        transform: none;
        scale: 1;
        transition: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .tilt > :first-child {
        transform: none;
        scale: 1;
        transition: none;
      }
    }
    .tilt {
      margin: 0;
      border-radius: var(--docs-radius-lg);
    }

    .tilt > :first-child {
      border-radius: var(--docs-radius-lg);
    }

    .art {
      inline-size: min(18rem, 70vw);
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }

    .member-card {
      display: grid;
      align-content: space-between;
      inline-size: min(20rem, 75vw);
      aspect-ratio: 1.6;
      padding: var(--docs-space-5);
      background: linear-gradient(135deg, var(--color-neutral), var(--color-primary));
      color: var(--color-neutral-content);
    }

    .member-card p {
      margin: 0;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: var(--docs-weight-bold);
    }
  `,
})
export class Hover3dPageComponent {
  protected readonly imageGalleryFiles = imageGalleryFiles;
  protected readonly reference = hover3dReference;
  protected readonly hover3dCode = hover3dCode;
  protected readonly figureCode = figureCode;
  protected readonly zones = [1, 2, 3, 4, 5, 6, 7, 8] as const;
}
