import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdAvatar, ZdAvatarGroup, type ZdAvatarPresence } from '@pranxy/zordon-ui/avatar';

import {
  avatarPlaygroundControls,
  avatarPlaygroundSnippet,
  avatarReference,
  groupCode,
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
            <div class="initials large"><span>AL</span></div>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="group"
        level="3"
        heading="Group"
        description="zdAvatarGroup overlaps the avatars. It adds no semantics, so this example names the group itself."
      >
        <docs-example label="team.html" [code]="groupCode">
          <div zdAvatarGroup class="team" role="group" aria-label="Project team">
            @for (person of team; track person) {
              <div zdAvatar placeholder>
                <div class="initials">
                  <span>{{ person }}</span>
                </div>
              </div>
            }
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
    .initials {
      inline-size: 3rem;
      border-radius: 999px;
      background: var(--docs-accent);
      color: var(--docs-accent-text);
      font-weight: var(--docs-weight-bold);
    }

    .initials.large {
      inline-size: 5rem;
      font-size: 1.5rem;
    }

    .team .initials {
      border: 3px solid var(--docs-surface-raised);
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
  protected readonly groupCode = groupCode;
  protected readonly presenceCode = presenceCode;
  protected readonly flagOf = flagOf;
  protected readonly team = ['AL', 'GH', 'KJ', '+4'] as const;
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
