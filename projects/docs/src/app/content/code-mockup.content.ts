import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Code Mockup reference content. Mirrors projects/components/code-mockup/src/code-mockup.ts and
 * docs/components/code-mockup.md — update them together.
 */

export const codeMockupReference: DocsReference = {
  eyebrow: 'Mockups',
  heading: 'Code Mockup',
  maturity: 'planned',
  description:
    'daisyUI’s terminal-style frame for native pre and code lines, with optional prompts or line numbers. No highlighter or copy button is included.',
  facts: controlFacts('[zdCodeMockup]', 'mockup-code', 'code-mockup'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register the class it adds with Tailwind.',
    importCode: `import { ZdCodeMockup } from '@pranxy/zordon-ui/code-mockup';`,
    stylesCode: tailwindSource('mockup-code'),
  },
  playgroundDescription:
    'Each pre is one line. Its data-prefix attribute draws the prompt or number in front of it.',
  api: {
    description: 'One standalone directive with no inputs.',
    tables: [
      {
        id: 'markup',
        heading: 'Markup',
        caption: 'Code Mockup structure',
        columns: [
          { key: 'name', label: 'Element', kind: 'name' },
          { key: 'description', label: 'Purpose' },
        ],
        rows: [
          {
            name: '[zdCodeMockup]',
            description: '`mockup-code`: the dark frame with window dots.',
          },
          { name: 'pre', description: 'One line of code or output.' },
          {
            name: 'data-prefix',
            description: 'Text drawn before the line, such as `$`, `>` or a line number.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description: 'It stays native code. Prefixes are CSS content, which some screen readers skip.',
    features: [
      {
        title: 'Name the snippet',
        body: 'A labelled section or a caption says what the command does.',
      },
      {
        title: 'Prefixes are decoration',
        body: 'Don’t put meaning in data-prefix; it may not be read and can’t be copied.',
      },
      {
        title: 'Status in words',
        body: 'Colour an error line if you like, but say “Error” in the text too.',
      },
      {
        title: 'Scrolling',
        body: 'Long lines scroll inside the frame; a focusable wrapper lets keyboards scroll it.',
      },
    ],
  },
  customization: {
    description: 'Line colours and the frame are your CSS. Highlight a line by styling its pre.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.mockup-code .failed {
  background: var(--color-error);
  color: var(--color-error-content);
}`,
    },
  },
  ssr: 'The directive only adds a class, so the server renders the finished snippet.',
};

export const installCode = `<section zdCodeMockup aria-label="Install command">
  <pre data-prefix="$"><code>npm install @pranxy/zordon-ui</code></pre>
</section>`;

export const outputCode = `<section zdCodeMockup aria-label="Build output">
  <pre data-prefix="1"><code>ng build</code></pre>
  <pre data-prefix="2"><code>Building…</code></pre>
  <pre data-prefix="3" class="done"><code>Done: application bundle generated.</code></pre>
</section>`;
