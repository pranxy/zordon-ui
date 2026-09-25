import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Browser Mockup reference content. Mirrors
 * projects/components/browser-mockup/src/browser-mockup.ts and docs/components/browser-mockup.md —
 * update them together.
 */

export const browserMockupReference: DocsReference = {
  eyebrow: 'Mockups',
  heading: 'Browser Mockup',
  maturity: 'planned',
  description:
    'daisyUI’s browser window frame around your own preview: a toolbar with an address and a content area. It frames content; it is not a browser.',
  facts: controlFacts('[zdBrowserMockup]', 'mockup-browser', 'browser-mockup'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdBrowserMockup, ZdBrowserMockupToolbar } from '@pranxy/zordon-ui/browser-mockup';`,
    stylesCode: tailwindSource('mockup-browser mockup-browser-toolbar input'),
  },
  playgroundDescription:
    'The toolbar’s input class draws the address bar. It is text here, not a field, so nobody can type into it.',
  api: {
    description: 'Two standalone directives with no inputs.',
    tables: [
      {
        id: 'parts',
        heading: 'Parts',
        caption: 'Browser Mockup parts',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          { name: '[zdBrowserMockup]', description: '`mockup-browser`: the window frame.' },
          {
            name: '[zdBrowserMockupToolbar]',
            description:
              '`mockup-browser-toolbar`: the bar with window dots. An `input`-classed child becomes the address.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The frame is decoration. Name the preview so people know it is an illustration, not the page itself.',
    features: [
      {
        title: 'Name the figure',
        body: 'A figure with a caption, or a labelled section, says what the preview shows.',
      },
      {
        title: 'Fake controls stay text',
        body: 'Don’t use a real input for the address unless people should type into it.',
      },
      {
        title: 'Iframes need titles',
        body: 'An embedded page needs a title attribute describing it.',
      },
      {
        title: 'Screenshots need alt text',
        body: 'A screenshot inside the frame needs the same alternative text as anywhere else.',
      },
    ],
  },
  customization: {
    description: 'Border, background and size are your CSS on the frame and the content area.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `.preview {
  border: 1px solid var(--color-base-300);
}

.preview > .content {
  display: grid;
  place-content: center;
  min-block-size: 12rem;
  background: var(--color-base-200);
}`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished frame.',
};

export const browserCode = `<figure zdBrowserMockup class="preview">
  <div zdBrowserMockupToolbar>
    <div class="input">https://zordon-ui.dev</div>
  </div>
  <div class="content">
    <p class="headline">Angular components for daisyUI</p>
    <p>Native markup, typed inputs, server rendered.</p>
  </div>
  <figcaption class="visually-hidden">Preview of the Zordon UI home page</figcaption>
</figure>`;

export const screenshotCode = `<figure class="captioned">
  <div zdBrowserMockup class="preview">
    <div zdBrowserMockupToolbar>
      <div class="input">https://example.com/dashboard</div>
    </div>
    <img src="dashboard.webp" alt="Dashboard with three charts and a table of orders" />
  </div>
  <figcaption>The new dashboard, shipped in September.</figcaption>
</figure>`;
