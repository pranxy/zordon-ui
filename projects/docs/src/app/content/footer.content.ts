import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { apiColumns, controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Footer reference content. Mirrors projects/components/footer/src/footer.ts and
 * docs/components/footer.md — update them together.
 */

export const footerReference: DocsReference = {
  eyebrow: 'Layout',
  heading: 'Footer',
  maturity: 'planned',
  description:
    'daisyUI’s footer grid on your own footer element: columns of links, a brand block or a centered line. Landmarks and links stay native.',
  facts: controlFacts('[zdFooter]', 'footer', 'footer'),
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdFooter, ZdFooterTitle } from '@pranxy/zordon-ui/footer';`,
    stylesCode: tailwindSource(
      'footer footer-horizontal footer-vertical footer-center footer-title',
    ),
  },
  playgroundDescription:
    'The footer stacks its columns by default. Horizontal lays them out in a row; center centres a simple footer.',
  api: {
    description: 'A container directive with two inputs, and a title directive.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'Footer inputs',
        columns: apiColumns,
        rows: [
          {
            name: 'direction',
            type: 'ZdFooterDirection',
            default: 'undefined',
            description:
              '`horizontal` or `vertical` adds `footer-<direction>`. Omit it for daisyUI’s stacked default.',
          },
          {
            name: 'center',
            type: 'boolean',
            default: 'false',
            description: 'Adds `footer-center`.',
          },
          {
            name: '[zdFooterTitle]',
            type: '—',
            default: '—',
            description: 'Adds `footer-title` to a column heading. Use a real heading element.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/footer',
    typesCode: `export type ZdFooterDirection = 'horizontal' | 'vertical';`,
  },
  accessibility: {
    description: 'Footer adds classes only. The landmark and headings come from your markup.',
    features: [
      {
        title: 'One contentinfo',
        body: 'A footer outside main, article or section is the page’s contentinfo landmark; use one.',
      },
      {
        title: 'Name link groups',
        body: 'Each column of links can be a nav with its own label, such as “Company”.',
      },
      {
        title: 'Headings in order',
        body: 'footer-title only styles; pick the heading level that fits your page outline.',
      },
      {
        title: 'Contrast',
        body: 'daisyUI dims footer titles; check them against your footer background.',
      },
    ],
  },
  customization: {
    description:
      'Background, padding and responsive direction are yours. A Tailwind variant switches direction at a breakpoint.',
    code: {
      label: 'site-footer.html',
      language: 'html',
      code: `<footer zdFooter class="md:footer-horizontal site-footer">…</footer>`,
    },
  },
  ssr: 'The directives only add classes, so the server renders the finished footer.',
};

export const footerPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'direction',
    options: ['default', 'horizontal', 'vertical'].map(value => ({ value, label: value })),
    defaultValue: 'horizontal',
    omit: ['default'],
  },
  { kind: 'boolean', key: 'center', defaultValue: false },
];

export const footerPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<footer zdFooter${attributes}>
  <nav aria-label="Product">
    <h4 zdFooterTitle>Product</h4>
    <a href="/components">Components</a>
    <a href="/docs/getting-started">Get started</a>
  </nav>
  <nav aria-label="Company">
    <h4 zdFooterTitle>Company</h4>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</footer>`,
};

export const brandCode = `<footer zdFooter center class="site-footer">
  <p class="brand">Zordon UI</p>
  <p>Angular components for daisyUI. MIT licensed.</p>
  <nav aria-label="Social">
    <a href="https://github.com/pranxy/zordon-ui">GitHub</a>
  </nav>
</footer>`;
