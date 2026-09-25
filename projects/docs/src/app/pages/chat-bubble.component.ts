import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdAvatar } from '@pranxy/zordon-ui/avatar';
import {
  ZdChat,
  ZdChatBubble,
  ZdChatFooter,
  ZdChatHeader,
  ZdChatImage,
  type ZdChatPlacement,
} from '@pranxy/zordon-ui/chat-bubble';

import {
  chatBubbleReference,
  chatPlaygroundControls,
  chatPlaygroundSnippet,
  conversationCode,
} from '../content/chat-bubble.content';
import { colorOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Chat Bubble emits, plus Avatar's for the author images. */
@Component({
  selector: 'docs-chat-bubble-daisy-styles',
  template: '',
  styleUrls: ['./styles/chat.daisy.css', './styles/avatar.daisy.css'],
  encapsulation: ViewEncapsulation.None,
})
class ChatBubbleDaisyStylesComponent {}

@Component({
  selector: 'docs-chat-bubble-page',
  imports: [
    ChatBubbleDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdAvatar,
    ZdChat,
    ZdChatBubble,
    ZdChatFooter,
    ZdChatHeader,
    ZdChatImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-chat-bubble-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Chat Bubble"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <ol class="conversation" aria-label="Example message">
            <li zdChat [placement]="placementOf(values)">
              <div zdChatHeader>Ada <time datetime="2026-09-25T10:45">10:45</time></div>
              <div zdChatBubble [color]="colorOf(values)">The build is green.</div>
              <div zdChatFooter>Delivered</div>
            </li>
          </ol>
        </ng-template>
      </docs-playground>

      <docs-section
        id="conversation"
        level="3"
        heading="Conversation"
        description="An ordered, named list of messages. Authors and times are text; the image area holds an Avatar."
      >
        <docs-example label="conversation.html" [code]="conversationCode">
          <ol class="conversation" aria-label="Conversation with Ada">
            <li zdChat placement="start">
              <div zdChatImage zdAvatar placeholder>
                <div class="initials"><span>AL</span></div>
              </div>
              <div zdChatHeader>Ada Lovelace <time datetime="2026-09-25T10:45">10:45</time></div>
              <div zdChatBubble>Is the release ready?</div>
            </li>
            <li zdChat placement="end">
              <div zdChatHeader>You <time datetime="2026-09-25T10:46">10:46</time></div>
              <div zdChatBubble color="primary">Yes, all checks passed.</div>
              <div zdChatFooter>Read</div>
            </li>
          </ol>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .conversation {
      inline-size: min(28rem, 100%);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .initials {
      inline-size: 2.5rem;
      border-radius: 999px;
      background: var(--docs-accent);
      color: var(--docs-accent-text);
      font-weight: var(--docs-weight-bold);
    }

    time {
      margin-inline-start: var(--docs-space-1);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-xs);
    }
  `,
})
export class ChatBubblePageComponent {
  protected readonly reference = chatBubbleReference;
  protected readonly controls = chatPlaygroundControls;
  protected readonly snippet = chatPlaygroundSnippet;
  protected readonly conversationCode = conversationCode;
  protected readonly colorOf = colorOf;

  protected placementOf(values: PlaygroundValues): ZdChatPlacement {
    return values['placement'] as ZdChatPlacement;
  }
}
