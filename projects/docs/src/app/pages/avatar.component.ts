import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdAvatar, ZdAvatarGroup, type ZdAvatarPresence } from '@pranxy/zordon-ui/avatar';
import { ZdMask } from '@pranxy/zordon-ui/mask';

import {
  avatarPlaygroundControls,
  avatarPlaygroundSnippet,
  avatarReference,
  groupFiles,
  sizesFiles,
  roundedFiles,
  maskFiles,
  counterFiles,
  ringFiles,
  presenceCode,
} from '../content/avatar.content';
import { flagOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Avatar emits, only while this page is in use. */
@Component({
  selector: 'docs-avatar-daisy-styles',
  template: '',
  styleUrl: './styles/avatar.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class AvatarDaisyStylesComponent {}

@Component({
  selector: 'docs-avatar-page',
  imports: [
    AvatarDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdAvatar,
    ZdAvatarGroup,
    ZdMask,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-avatar-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Avatar"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div
            zdAvatar
            [placeholder]="flagOf(values, 'placeholder')"
            [presence]="presenceOf(values)"
          >
            <div class="portrait large rounded">
              @if (flagOf(values, 'placeholder')) {
                <span>AL</span>
              } @else {
                <img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" />
              }
            </div>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="group"
        level="3"
        heading="Group"
        description="zdAvatarGroup overlaps the avatars. It adds no semantics, so this example names the group itself."
      >
        <docs-example label="team.html" [files]="groupFiles">
          <div zdAvatarGroup class="team" role="group" aria-label="Project team">
            @for (person of team; track person.name) {
              <div zdAvatar>
                <div class="portrait">
                  <img
                    [src]="person.src"
                    width="256"
                    height="256"
                    [alt]="person.name"
                    loading="lazy"
                  />
                </div>
              </div>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="custom-sizes"
        level="3"
        heading="Custom sizes"
        description="Set the width of the inner frame; the image stays square."
      >
        <docs-example label="sizes.html" [files]="sizesFiles">
          @for (size of sizes; track size) {
            <div zdAvatar>
              <div class="portrait rounded" [class]="'portrait rounded ' + size">
                <img
                  src="images/showcase/portrait-ada.webp"
                  width="256"
                  height="256"
                  alt="Ada"
                  loading="lazy"
                />
              </div>
            </div>
          }
        </docs-example>
      </docs-section>
      <docs-section
        id="rounded"
        level="3"
        heading="Rounded"
        description="The inner frame owns the corner radius."
      >
        <docs-example label="rounded.html" [files]="roundedFiles">
          <div zdAvatar>
            <div class="portrait large soft">
              <img
                src="images/showcase/portrait-kai.webp"
                width="256"
                height="256"
                alt="Kai"
                loading="lazy"
              />
            </div>
          </div>
          <div zdAvatar>
            <div class="portrait large rounded">
              <img
                src="images/showcase/portrait-kai.webp"
                width="256"
                height="256"
                alt="Kai"
                loading="lazy"
              />
            </div>
          </div>
        </docs-example>
      </docs-section>
      <docs-section
        id="mask"
        level="3"
        heading="With a mask"
        description="Compose zdMask on the inner frame."
      >
        <docs-example label="mask.html" [files]="maskFiles">
          <div zdAvatar>
            <div zdMask shape="squircle" class="portrait large">
              <img
                src="images/showcase/portrait-ada.webp"
                width="256"
                height="256"
                alt="Ada"
                loading="lazy"
              />
            </div>
          </div>
          <div zdAvatar>
            <div zdMask shape="hexagon-2" class="portrait large">
              <img
                src="images/showcase/portrait-kai.webp"
                width="256"
                height="256"
                alt="Kai"
                loading="lazy"
              />
            </div>
          </div>
        </docs-example>
      </docs-section>
      <docs-section
        id="group-counter"
        level="3"
        heading="Group with a counter"
        description="The final placeholder names the additional people; daisyUI supplies each outer border."
      >
        <docs-example label="counter.html" [files]="counterFiles">
          <div
            zdAvatarGroup
            class="team"
            role="group"
            aria-label="Project team with four more members"
          >
            @for (person of team; track person.name) {
              <div zdAvatar>
                <div class="portrait">
                  <img
                    [src]="person.src"
                    width="256"
                    height="256"
                    [alt]="person.name"
                    loading="lazy"
                  />
                </div>
              </div>
            }
            <div zdAvatar placeholder>
              <div class="portrait">
                <span role="img" aria-label="4 more team members">+4</span>
              </div>
            </div>
          </div>
        </docs-example>
      </docs-section>
      <docs-section
        id="ring"
        level="3"
        heading="With a ring"
        description="An outline on the inner frame adds a ring without changing its size."
      >
        <docs-example label="ring.html" [files]="ringFiles">
          <div zdAvatar>
            <div class="portrait large rounded ring">
              <img
                src="images/showcase/portrait-ada.webp"
                width="256"
                height="256"
                alt="Ada"
                loading="lazy"
              />
            </div>
          </div>
        </docs-example>
      </docs-section>
      <docs-section
        id="presence"
        level="3"
        heading="Presence"
        description="The dot is decoration; the words beside it carry the status."
      >
        <docs-example label="person.html" [code]="presenceCode">
          <div class="docs-stack">
            @for (person of people; track person.name) {
              <div class="person">
                <div zdAvatar placeholder [presence]="person.presence">
                  <div class="initials">
                    <span>{{ person.initials }}</span>
                  </div>
                </div>
                <span
                  >{{ person.name }} <span class="status">· {{ person.presence }}</span></span
                >
              </div>
            }
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .portrait,
    .initials {
      inline-size: 3rem;
      border-radius: 999px;
      background: var(--docs-accent);
      color: var(--docs-accent-text);
      font-weight: var(--docs-weight-bold);
    }

    .portrait.large {
      inline-size: 5rem;
      font-size: 1.5rem;
    }

    .portrait {
      border-radius: 0;
    }
    .portrait.small {
      inline-size: 2rem;
    }
    .portrait.medium {
      inline-size: 4rem;
    }
    .portrait.extra-large {
      inline-size: 6rem;
    }
    .portrait.rounded {
      border-radius: 999px;
    }
    .portrait.soft {
      border-radius: var(--docs-radius-lg);
    }
    .portrait.ring {
      outline: 2px solid var(--docs-accent);
      outline-offset: 3px;
    }

    /* daisyUI's examples overlap group members with a negative gap utility. */
    .team > * + * {
      margin-inline-start: -0.75rem;
    }

    .person {
      display: flex;
      align-items: center;
      gap: var(--docs-space-3);
    }

    .status {
      color: var(--docs-muted-text);
    }
  `,
})
export class AvatarPageComponent {
  protected readonly reference = avatarReference;
  protected readonly controls = avatarPlaygroundControls;
  protected readonly snippet = avatarPlaygroundSnippet;
  protected readonly groupFiles = groupFiles;
  protected readonly presenceCode = presenceCode;
  protected readonly flagOf = flagOf;
  protected readonly sizesFiles = sizesFiles;
  protected readonly roundedFiles = roundedFiles;
  protected readonly maskFiles = maskFiles;
  protected readonly counterFiles = counterFiles;
  protected readonly ringFiles = ringFiles;
  protected readonly sizes = ['small', 'medium', 'extra-large'] as const;
  protected readonly team = [
    { name: 'Ada', src: 'images/showcase/portrait-ada.webp' },
    { name: 'Kai', src: 'images/showcase/portrait-kai.webp' },
  ] as const;
  protected readonly people: readonly {
    name: string;
    initials: string;
    presence: ZdAvatarPresence;
  }[] = [
    { name: 'Ada Lovelace', initials: 'AL', presence: 'online' },
    { name: 'Grace Hopper', initials: 'GH', presence: 'offline' },
  ];

  protected presenceOf(values: PlaygroundValues): ZdAvatarPresence | undefined {
    const value = values['presence'];
    return value === 'none' ? undefined : (value as ZdAvatarPresence);
  }
}
