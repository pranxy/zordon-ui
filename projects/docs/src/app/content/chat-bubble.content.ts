import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import {
  colorControl,
  controlFacts,
  modifierClasses,
  plannedNotice,
  tailwindSource,
} from './form-controls.content';

/**
 * Chat Bubble reference content. Mirrors projects/components/chat-bubble/src/chat-bubble.ts and
 * docs/components/chat-bubble.md — update them together.
 */

export const chatBubbleReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Chat Bubble',
  maturity: 'planned',
  description:
    'daisyUI’s message layout on your own list items: author image, header, bubble and footer. Conversation state, delivery and announcements stay yours.',
  facts: controlFacts('[zdChat]', 'chat', 'chat-bubble'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import {
  ZdChat,
  ZdChatBubble,
  ZdChatFooter,
  ZdChatHeader,
  ZdChatImage,
} from '@pranxy/zordon-ui/chat-bubble';`,
    stylesCode: tailwindSource(
      `chat chat-start chat-end chat-image chat-header chat-footer ${modifierClasses('chat-bubble', { sizes: false })}`,
    ),
  },
  playgroundDescription:
    'placement is required: start for the other person, end for the current user.',
  api: {
    description: 'Five standalone directives that add classes only.',
    tables: [
      {
        id: 'inputs',
        heading: 'Directives and inputs',
        caption: 'Chat Bubble directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'type', label: 'Input', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: '[zdChat]',
            type: "placement: 'start' | 'end'",
            description: 'One message; required placement adds `chat-start` or `chat-end`.',
          },
          {
            name: '[zdChatBubble]',
            type: 'color?: ZdChatBubbleColor',
            description: 'The bubble; color adds `chat-bubble-<color>`.',
          },
          { name: '[zdChatImage]', type: '—', description: 'The author image area.' },
          { name: '[zdChatHeader]', type: '—', description: 'Name and time above the bubble.' },
          { name: '[zdChatFooter]', type: '—', description: 'Delivery or read text below.' },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/chat-bubble',
    typesCode: `export type ZdChatBubbleColor =
  | 'neutral' | 'primary' | 'secondary' | 'accent'
  | 'info' | 'success' | 'warning' | 'error';
export type ZdChatPlacement = 'start' | 'end';`,
  },
  accessibility: {
    description:
      'Chat Bubble adds no roles or live regions. A list of messages is usually an ordered list you name.',
    features: [
      {
        title: 'Name the author',
        body: 'Put the author in the header text; placement alone doesn’t say who spoke.',
      },
      {
        title: 'Machine-readable time',
        body: 'Use <time datetime> for timestamps and format them for the reader.',
      },
      {
        title: 'Announce on purpose',
        body: 'Incoming messages aren’t announced automatically; own that live region if you need one.',
      },
      {
        title: 'Color is style',
        body: 'Bubble color doesn’t mean “sent” or “error”; say that in the footer.',
      },
    ],
  },
  customization: {
    description:
      'Avatars, media and long content are ordinary markup; compose Avatar in the image area.',
  },
  ssr: 'The directives only add classes, so the server renders the finished conversation.',
};

export const chatPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'placement',
    options: ['start', 'end'].map(value => ({ value, label: value })),
    defaultValue: 'start',
  },
  colorControl,
];

export const chatPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const placement = /placement="(\w+)"/.exec(attributes)?.[1] ?? 'start';
    const color = /color="(\w+)"/.exec(attributes)?.[1];
    return `<li zdChat placement="${placement}">
  <div zdChatHeader>Ada <time datetime="2026-09-25T10:45">10:45</time></div>
  <div zdChatBubble${color ? ` color="${color}"` : ''}>The build is green.</div>
  <div zdChatFooter>Delivered</div>
</li>`;
  },
};

export const conversationCode = `<ol class="conversation" aria-label="Conversation with Ada">
  <li zdChat placement="start">
    <div zdChatImage zdAvatar placeholder><div class="initials"><span>AL</span></div></div>
    <div zdChatHeader>Ada Lovelace <time datetime="2026-09-25T10:45">10:45</time></div>
    <div zdChatBubble>Is the release ready?</div>
  </li>
  <li zdChat placement="end">
    <div zdChatHeader>You <time datetime="2026-09-25T10:46">10:46</time></div>
    <div zdChatBubble color="primary">Yes, all checks passed.</div>
    <div zdChatFooter>Read</div>
  </li>
</ol>`;
