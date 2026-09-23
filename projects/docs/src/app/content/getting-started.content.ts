import type { DocsCodeFile } from '../ui/code/code-tabs.component';
import type { DocsFaqItem } from '../ui/page/faq.component';
import type { DocsLinkCard } from '../ui/page/link-card.component';
import type { DocsMetaItem } from '../ui/page/meta-grid.component';

const packages = '@pranxy/zordon-ui tailwindcss@4 daisyui@5 @tailwindcss/postcss';

export const requirements: readonly DocsMetaItem[] = [
  { label: 'Angular', value: '≥ 21.0', mono: true },
  { label: 'Tailwind CSS', value: '4.x', mono: true },
  { label: 'daisyUI', value: '≥ 5.7.16', mono: true },
  { label: 'Node', value: '≥ 20.19', mono: true },
];

export const installCommands: readonly DocsCodeFile[] = [
  { label: 'npm', language: 'bash', code: `npm install ${packages}` },
  { label: 'pnpm', language: 'bash', code: `pnpm add ${packages}` },
  { label: 'yarn', language: 'bash', code: `yarn add ${packages}` },
  { label: 'bun', language: 'bash', code: `bun add ${packages}` },
];

export const postcssConfig = `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}`;

export const stylesheet = `@import 'tailwindcss';

@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}

/* Zordon adds daisyUI classes at runtime; list the ones your templates use */
@source inline("btn btn-primary");`;

export const appConfig = `import { ApplicationConfig } from '@angular/core';
import { provideZordonUi } from '@pranxy/zordon-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZordonUi(), // default daisyUI and Tailwind prefixes
  ],
};`;

export const firstComponent = `import { Component, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';

@Component({
  selector: 'app-root',
  imports: [ZdButton],
  template: \`
    <button zdButton color="primary" (click)="saved.set(true)">
      @if (saved()) { Saved } @else { Save }
    </button>
  \`,
})
export class App {
  protected readonly saved = signal(false);
}`;

export const serveCommand = 'ng serve --open';

export const troubleshooting: readonly DocsFaqItem[] = [
  {
    question: 'Buttons render unstyled',
    answer:
      'Tailwind cannot see classes that Zordon adds at runtime. Register every class you use with @source inline(...) in the global stylesheet, and check that .postcssrc.json sits at the workspace root.',
  },
  {
    question: 'Dark theme never activates',
    answer:
      'Only themes listed in the daisyUI plugin block are compiled. Add dark to the themes list, then set data-theme="dark" on <html> or on any nested element.',
  },
  {
    question: 'Hydration warnings with SSR',
    answer:
      'Zordon components render deterministic markup on the server. Warnings usually come from reading browser-only state (such as a saved theme) during the first render; apply it in afterNextRender instead.',
  },
];

export const nextSteps: readonly DocsLinkCard[] = [
  {
    eyebrow: 'Guide',
    title: 'Styling and theming',
    description: 'Themes, nested scopes, and class prefixes.',
    path: '/guides/styling-and-theming',
  },
  {
    eyebrow: 'Foundation',
    title: 'Typed vocabularies',
    description: 'The shared colour, size, and style unions.',
    path: '/foundations/typed-vocabularies',
  },
  {
    eyebrow: 'Component',
    title: 'Button API',
    description: 'Every input, a live playground, and accessibility notes.',
    path: '/components/button',
  },
];
