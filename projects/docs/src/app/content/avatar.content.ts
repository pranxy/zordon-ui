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
    options: ['none', 'online', 'offline'].map(value => ({
      value,
      label: value,
    })),
    defaultValue: 'none',
    omit: ['none'],
  },
  { kind: 'boolean', key: 'placeholder', defaultValue: false },
];

export const avatarPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<div zdAvatar${attributes}>
  <div class="portrait rounded">${attributes.includes(' placeholder') ? '<span>AL</span>' : '<img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" />'}</div>
</div>
<!-- .portrait { width: 5rem; } .rounded { border-radius: 999px; } -->`,
};

export const presenceCode = `<div class="person">
  <div zdAvatar placeholder presence="online"><div class="initials"><span>AL</span></div></div>
  <span>Ada Lovelace <span class="status">· online</span></span>
</div>`;

export const groupFiles = [
  {
    label: 'group.html',
    language: 'html',
    code: `<div zdAvatarGroup class="team" role="group" aria-label="Project team">
  <div zdAvatar><div class="portrait"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>
  <div zdAvatar><div class="portrait"><img src="images/showcase/portrait-kai.webp" width="256" height="256" alt="Kai" loading="lazy" /></div></div>
</div>`,
  },
  {
    label: 'group.css',
    language: 'css',
    code: `.portrait { inline-size: 3rem; }
.team > * + * { margin-inline-start: -0.75rem; }`,
  },
] as const;

export const sizesFiles = [
  {
    label: 'sizes.html',
    language: 'html',
    code: `<div zdAvatar><div class="small"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>
<div zdAvatar><div class="medium"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>
<div zdAvatar><div class="large"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>`,
  },
  {
    label: 'sizes.css',
    language: 'css',
    code: `.small { inline-size: 2rem; }
.medium { inline-size: 4rem; }
.large { inline-size: 6rem; }
.small, .medium, .large { border-radius: 999px; }`,
  },
] as const;

export const roundedFiles = [
  {
    label: 'rounded.html',
    language: 'html',
    code: `<div zdAvatar><div class="soft"><img src="images/showcase/portrait-kai.webp" width="256" height="256" alt="Kai" loading="lazy" /></div></div>
<div zdAvatar><div class="round"><img src="images/showcase/portrait-kai.webp" width="256" height="256" alt="Kai" loading="lazy" /></div></div>`,
  },
  {
    label: 'rounded.css',
    language: 'css',
    code: `.soft, .round { inline-size: 5rem; }
.soft { border-radius: 1rem; }
.round { border-radius: 999px; }`,
  },
] as const;

export const maskFiles = [
  {
    label: 'mask.html',
    language: 'html',
    code: `<!-- Import ZdMask from '@pranxy/zordon-ui/mask'; compile mask mask-squircle mask-hexagon-2. -->
<div zdAvatar><div zdMask shape="squircle" class="portrait"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>
<div zdAvatar><div zdMask shape="hexagon-2" class="portrait"><img src="images/showcase/portrait-kai.webp" width="256" height="256" alt="Kai" loading="lazy" /></div></div>`,
  },
  {
    label: 'mask.css',
    language: 'css',
    code: '.portrait { inline-size: 5rem; }',
  },
] as const;

export const counterFiles = [
  {
    label: 'counter.html',
    language: 'html',
    code: `<div zdAvatarGroup class="team" role="group" aria-label="Project team with four more members">
  <div zdAvatar><div class="portrait"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>
  <div zdAvatar><div class="portrait"><img src="images/showcase/portrait-kai.webp" width="256" height="256" alt="Kai" loading="lazy" /></div></div>
  <div zdAvatar placeholder><div class="portrait"><span role="img" aria-label="4 more team members">+4</span></div></div>
</div>`,
  },
  {
    label: 'counter.css',
    language: 'css',
    code: `.portrait { inline-size: 3rem; background: var(--color-primary); color: var(--color-primary-content); }
.team > * + * { margin-inline-start: -0.75rem; }`,
  },
] as const;

export const ringFiles = [
  {
    label: 'ring.html',
    language: 'html',
    code: '<div zdAvatar><div class="ring"><img src="images/showcase/portrait-ada.webp" width="256" height="256" alt="Ada" loading="lazy" /></div></div>',
  },
  {
    label: 'ring.css',
    language: 'css',
    code: '.ring { inline-size: 5rem; border-radius: 999px; outline: 2px solid var(--color-primary); outline-offset: 3px; }',
  },
] as const;
