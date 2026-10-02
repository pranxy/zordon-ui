import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * List reference content. Mirrors projects/components/list/src/list.ts and docs/components/list.md
 * — update them together.
 */

export const listReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'List',
  maturity: 'planned',
  description:
    'daisyUI’s row layout on a native list: media, a growing text column and actions per row. Four directives add classes only.',
  facts: controlFacts('[zdList]', 'list', 'list'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives you use, and register their classes with Tailwind.',
    importCode: `import { ZdList, ZdListColGrow, ZdListColWrap, ZdListRow } from '@pranxy/zordon-ui/list';`,
    stylesCode: tailwindSource('list list-row list-col-grow list-col-wrap'),
  },
  playgroundDescription:
    'The second child of a row grows by default. Add a cover and the text column needs zdListColGrow to keep the spare width; zdListColWrap moves a child onto its own line.',
  api: {
    description: 'Four standalone directives with no inputs.',
    tables: [
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'List directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdList]', description: '`list` on a `ul` or `ol`.' },
          { name: '[zdListRow]', description: '`list-row` on each `li`: a grid of columns.' },
          {
            name: '[zdListColGrow]',
            description: '`list-col-grow`: this child takes the spare width instead of the second.',
          },
          {
            name: '[zdListColWrap]',
            description: '`list-col-wrap`: this child moves to a full-width line below.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The list keeps native list semantics. The directives add no role, focus, selection or keyboard handling.',
    features: [
      {
        title: 'Name the list',
        body: 'Give it a heading or an aria-label so people know what the rows are.',
      },
      {
        title: 'Name row actions',
        body: 'Icon buttons repeat on every row; include the row in the name, such as “Play Moonlit Drive”.',
      },
      {
        title: 'Not a listbox',
        body: 'For selectable options with arrow keys, a listbox contract is needed. This is a display list.',
      },
      {
        title: 'Media alternatives',
        body: 'Decorative thumbnails get alt=""; informative ones describe what they show.',
      },
    ],
  },
  customization: {
    description:
      'Row padding, dividers and column sizes are ordinary CSS on your elements; the list is a grid per row.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.tracks {
  border: 1px solid var(--color-base-300);
  border-radius: 1rem;
}

.tracks .index {
  font-variant-numeric: tabular-nums;
  opacity: 0.6;
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished rows.',
};

export const listPlaygroundControls: readonly PlaygroundControl[] = [
  { kind: 'boolean', key: 'cover', defaultValue: false },
  { kind: 'boolean', key: 'wrapNote', defaultValue: false },
];

export const listPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const cover = attributes.includes('cover');
    const note = attributes.includes('wrapNote')
      ? '\n    <p zdListColWrap class="note">Saved for offline listening.</p>'
      : '';
    return `<ul zdList aria-label="Recently played">
  <li zdListRow>
    <span class="index">01</span>${cover ? '\n    <img class="cover" src="images/showcase/lake-morning.webp" alt="" width="768" height="512" loading="lazy" />' : ''}
    <div${cover ? ' zdListColGrow' : ''}>
      <div>Moonlit Drive</div>
      <div class="artist">Avery Chen</div>
    </div>${note}
    <button type="button" class="play" aria-label="Play Moonlit Drive">▶</button>
  </li>
</ul>`;
  },
};

export const growCode = `<li zdListRow>
  <span class="index">01</span>
  <img class="cover" src="images/showcase/lake-morning.webp" alt="" width="768" height="512" loading="lazy" />
  <div zdListColGrow>
    <div>Moonlit Drive</div>
    <div class="artist">Avery Chen</div>
  </div>
  <button type="button" class="play" aria-label="Play Moonlit Drive">▶</button>
</li>`;

export const secondColumnFiles = [
  {
    label: 'second-column.html',
    language: 'html' as const,
    code: `<ul zdList class="tracks" aria-label="Recently played, title grows">
  <li zdListRow>
    <img
      class="cover"
      src="images/showcase/lake-morning.webp"
      alt=""
      width="768"
      height="512"
      loading="lazy"
    />
    <div>
      <div>Moonlit Drive</div>
      <div>Avery Chen</div>
    </div>
    <button type="button" class="play" aria-label="Play Moonlit Drive">▶</button>
  </li>
</ul>`,
  },
  {
    label: 'second-column.css',
    language: 'css' as const,
    code: `.tracks { inline-size: min(26rem, 100%); border: 1px solid var(--color-base-300); border-radius: 1rem; }
.cover { inline-size: 2.5rem; block-size: 2.5rem; object-fit: cover; border-radius: .5rem; }
.note { grid-column: 1 / -1; margin: 0; }
.play { inline-size: 2.25rem; block-size: 2.25rem; border: 1px solid var(--color-base-300); border-radius: 999px; background: transparent; color: inherit; cursor: pointer; }
.play:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`,
  },
];

export const thirdColumnWrapFiles = [
  {
    label: 'third-column-wrap.html',
    language: 'html' as const,
    code: `<ul zdList class="tracks" aria-label="Tracks with notes">
  <li zdListRow>
    <img
      class="cover"
      src="images/showcase/lake-morning.webp"
      alt=""
      width="768"
      height="512"
      loading="lazy"
    />
    <div>
      <div>Moonlit Drive</div>
      <div>Avery Chen</div>
    </div>
    <p zdListColWrap class="note">
      An atmospheric night drive. Saved for offline listening.
    </p>
    <button type="button" class="play" aria-label="Play Moonlit Drive">▶</button>
  </li>
</ul>`,
  },
  {
    label: 'third-column-wrap.css',
    language: 'css' as const,
    code: `.tracks { inline-size: min(26rem, 100%); border: 1px solid var(--color-base-300); border-radius: 1rem; }
.cover { inline-size: 2.5rem; block-size: 2.5rem; object-fit: cover; border-radius: .5rem; }
.note { grid-column: 1 / -1; margin: 0; }
.play { inline-size: 2.25rem; block-size: 2.25rem; border: 1px solid var(--color-base-300); border-radius: 999px; background: transparent; color: inherit; cursor: pointer; }
.play:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`,
  },
];
