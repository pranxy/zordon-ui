import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Avatar reference content. Mirrors projects/components/avatar/src/avatar.ts and
 * docs/components/avatar.md — update them together.
 */

export const avatarReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Avatar',
  maturity: 'planned',
  description:
    'daisyUI’s avatar frame, placeholder and presence dot on your own markup. Images, initials, alt text and fallbacks stay yours.',
  facts: controlFacts('[zdAvatar]', 'avatar', 'avatar'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdAvatar, ZdAvatarGroup } from '@pranxy/zordon-ui/avatar';`,
    stylesCode: tailwindSource(
      'avatar avatar-placeholder avatar-online avatar-offline avatar-group',
    ),
  },
  playgroundDescription:
    'The avatar needs one child element; size and shape come from classes on that child.',
  api: {
    description: 'Two standalone directives that add classes only.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Avatar inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'placeholder',
            type: 'boolean',
            default: 'false',
            description: 'Adds `avatar-placeholder` for initials or an icon.',
          },
          {
            name: 'presence',
            type: 'ZdAvatarPresence',
            default: 'undefined',
            description: '`online` or `offline`: a decorative dot. Say the status in text too.',
          },
          {
            name: '[zdAvatarGroup]',
            type: '—',
            default: '—',
            description: 'On a container: overlaps its avatars. No list semantics are added.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/avatar',
    typesCode: `export type ZdAvatarPresence = 'online' | 'offline';`,
  },
  accessibility: {
    description: 'Avatar adds no role, name or focus. Meaning comes from your image and text.',
    features: [
      {
        title: 'Alt text is yours',
        body: 'Give a meaningful photo its person’s name; use alt="" when a name is already beside it.',
      },
      {
        title: 'Presence needs words',
        body: 'The dot is decorative. Pair it with text such as “online”, or use Status.',
      },
      {
        title: 'Not a button',
        body: 'Wrap the avatar in a native link or button when it should do something.',
      },
      {
        title: 'Initials are text',
        body: 'Placeholder initials are read as letters; label the group or add a name if that’s unclear.',
      },
    ],
  },
  customization: {
    description:
      'Size, shape, rings and masks are ordinary classes on the child; daisyUI has no avatar sizes.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.team-avatar > div {
  inline-size: 3rem;
  border-radius: 999px;
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished avatar.',
};

export const avatarPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'presence',
    options: ['none', 'online', 'offline'].map(value => ({ value, label: value })),
    defaultValue: 'none',
    omit: ['none'],
  },
  { kind: 'boolean', key: 'placeholder', defaultValue: true },
];

export const avatarPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdAvatar${attributes}>
  <div class="initials"><span>AL</span></div>
</div>`,
};

export const groupCode = `<div zdAvatarGroup role="group" aria-label="Project team">
  <div zdAvatar placeholder><div class="initials"><span>AL</span></div></div>
  <div zdAvatar placeholder><div class="initials"><span>GH</span></div></div>
  <div zdAvatar placeholder><div class="initials"><span>+4</span></div></div>
</div>`;

export const presenceCode = `<div class="person">
  <div zdAvatar placeholder presence="online"><div class="initials"><span>AL</span></div></div>
  <span>Ada Lovelace <span class="status">· online</span></span>
</div>`;
