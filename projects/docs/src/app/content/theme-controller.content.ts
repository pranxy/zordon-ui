import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice } from './form-controls.content';

/**
 * Theme Controller reference content. Mirrors
 * projects/components/theme-controller/src/theme-controller.ts and
 * docs/components/theme-controller.md — update them together.
 */

export const themeControllerReference: DocsReference = {
  eyebrow: 'Actions',
  heading: 'Theme Controller',
  maturity: 'planned',
  description:
    'A theme preference scope for native checkboxes, radios, selects and buttons. It sets data-theme on its element or the document, follows the system when asked, and can remember the choice.',
  facts: controlFacts('[zdThemeController]', 'data-theme', 'theme-controller'),
  notice: plannedNotice,
  install: {
    description:
      'Import the controller and the control directives you use. It adds no CSS; compile every theme you register.',
    importCode: `import {
  ZdThemeButton,
  ZdThemeController,
  ZdThemeRadio,
  ZdThemeSelect,
  ZdThemeToggle,
  type ZdThemeControllerOptions,
} from '@pranxy/zordon-ui/theme-controller';`,
    stylesCode: `@plugin "daisyui" {
  /* Every theme the controller may select */
  themes: light --default, dark --prefersdark;
}`,
  },
  playgroundDescription:
    'Each preview is its own scope with target "host": it themes only its box, not this page.',
  api: {
    description:
      'The controller holds the state; each control directive reads and changes it. Options are read once, when the scope starts.',
    tables: [
      {
        id: 'options',
        heading: 'Options',
        caption: 'Theme controller options',
        columns: [
          { key: 'name', label: 'Option', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'themes',
            type: 'readonly string[]',
            default: "['light', 'dark']",
            description: 'Exact theme names you compiled. `system` is reserved.',
          },
          {
            name: 'initial',
            type: 'string',
            default: "'system'",
            description: 'Used on the server, on first render and after storage is cleared.',
          },
          {
            name: 'lightTheme / darkTheme',
            type: 'string',
            default: "'light' / 'dark'",
            description: 'What `system` resolves to for each color-scheme preference.',
          },
          {
            name: 'storageKey',
            type: 'string | null',
            default: 'undefined',
            description: 'localStorage key; omit for memory only. Syncs across tabs.',
          },
          {
            name: 'target',
            type: "'host' | 'document'",
            default: "'host'",
            description: 'Theme this element, or `<html>` (one document owner at a time).',
          },
        ],
      },
      {
        id: 'directives',
        heading: 'Directives and state',
        caption: 'Theme controller directives, outputs and state',
        columns: [
          { key: 'name', label: 'Member', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: '[zdThemeController]',
            description: 'The scope. Takes the options; export `#theme="zdThemeController"`.',
          },
          {
            name: 'themeChange',
            description: '`{ theme, resolvedTheme, source }` after a real change.',
          },
          {
            name: 'state.theme() / resolvedTheme()',
            description: 'The selection (maybe `system`) and the concrete theme in use.',
          },
          {
            name: 'state.setTheme(name)',
            description: 'Selects a registered theme or `system`; false if unknown or unchanged.',
          },
          {
            name: 'input[zdThemeToggle] + offTheme',
            description: 'Checkbox: checked and unchecked themes, default `dark` / `light`.',
          },
          { name: 'input[zdThemeRadio]', description: 'Radio for one theme or `system`.' },
          { name: 'select[zdThemeSelect]', description: 'Select whose option values are themes.' },
          {
            name: 'button[zdThemeButton]',
            description: 'Button for one theme, with synchronized `aria-pressed`.',
          },
        ],
      },
    ],
    typesLabel: '@pranxy/zordon-ui/theme-controller',
    typesCode: `export interface ZdThemeControllerOptions {
  readonly themes?: readonly string[];
  readonly initial?: string;
  readonly lightTheme?: string;
  readonly darkTheme?: string;
  readonly storageKey?: string | null;
  readonly target?: 'host' | 'document';
}
export type ZdThemeChangeSource = 'api' | 'user' | 'restore' | 'storage' | 'system';
export interface ZdThemeChange {
  readonly theme: string;
  readonly resolvedTheme: string;
  readonly source: ZdThemeChangeSource;
}`,
  },
  accessibility: {
    description:
      'The controls are native, so labels, keyboard use and form semantics come from the browser.',
    features: [
      {
        title: 'Label every control',
        body: 'Give radios a legend, and buttons a stable name; the button reports aria-pressed.',
      },
      {
        title: 'Offer “system”',
        body: 'A checkbox has two states. Use radios, a select or buttons when people need to follow the device.',
      },
      {
        title: 'Check every theme',
        body: 'Test contrast, zoom and forced colors in each theme you register.',
      },
      {
        title: 'Not a form value',
        body: 'Don’t bind Forms or ngModel to these controls; the controller owns their state.',
      },
    ],
  },
  customization: {
    description:
      'Compose the controls with Toggle, Radio, Select or Button styling. Don’t add daisyUI’s CSS-only theme-controller class: its global :has() rule overrides scopes.',
    code: {
      label: 'app.component.html',
      language: 'html',
      code: `<!-- One application-level scope that owns <html> -->
<header [zdThemeController]="{ target: 'document', storageKey: 'app.theme' }">
  <label>
    <input type="checkbox" zdToggle zdThemeToggle="dark" /> Dark mode
  </label>
</header>`,
    },
  },
  ssr: 'Server and first browser render use initial, with system as the light theme. Stored and system preferences apply after hydration, so the theme can change then; pass the same initial on both sides when you know it.',
};

export const themeControlKinds = ['toggle', 'radios', 'select', 'buttons'] as const;
export type ThemeControlKind = (typeof themeControlKinds)[number];

export const themeControllerPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'control',
    options: themeControlKinds.map(value => ({ value, label: value })),
    defaultValue: 'radios',
  },
];

const controlMarkup: Record<ThemeControlKind, string> = {
  toggle: `  <label><input type="checkbox" zdToggle zdThemeToggle="dark" /> Dark theme</label>`,
  radios: `  <fieldset>
    <legend>Appearance</legend>
    <label><input type="radio" name="appearance" zdThemeRadio="light" /> Light</label>
    <label><input type="radio" name="appearance" zdThemeRadio="dark" /> Dark</label>
    <label><input type="radio" name="appearance" zdThemeRadio="system" /> System</label>
  </fieldset>`,
  select: `  <label>
    Theme
    <select zdSelect zdThemeSelect>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`,
  buttons: `  <button zdButton zdThemeButton="light">Light</button>
  <button zdButton zdThemeButton="dark">Dark</button>
  <button zdButton zdThemeButton="system">System</button>`,
};

export const themeControllerPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const kind = (/control="(\w+)"/.exec(attributes)?.[1] ?? 'radios') as ThemeControlKind;
    return `<section [zdThemeController]="{ initial: 'light' }" #theme="zdThemeController">
${controlMarkup[kind]}
  <p>Using {{ theme.state.resolvedTheme() }}</p>
</section>`;
  },
};

export const persistedFiles = [
  {
    label: 'appearance.html',
    language: 'html' as const,
    code: `<section
  [zdThemeController]="options"
  #appearance="zdThemeController"
  (themeChange)="last.set($event)"
>
  <label><input type="checkbox" zdToggle zdThemeToggle="dark" /> Dark theme</label>
  <button zdButton zdThemeButton="system">Follow system</button>
  <p>{{ appearance.state.theme() }} → {{ appearance.state.resolvedTheme() }}</p>
</section>`,
  },
  {
    label: 'appearance.ts',
    language: 'ts' as const,
    code: `protected readonly options: ZdThemeControllerOptions = {
  initial: 'system',
  storageKey: 'docs.theme-controller.example', // survives reloads
};
protected readonly last = signal<ZdThemeChange | null>(null);`,
  },
];

export const nestedCode = `<!-- Scopes nest; each has its own state and themes only its element -->
<section [zdThemeController]="{ initial: 'light' }">
  <label><input type="checkbox" zdToggle zdThemeToggle="dark" /> Dark outer</label>
  <aside [zdThemeController]="{ initial: 'dark' }">
    <label><input type="checkbox" zdToggle zdThemeToggle="dark" /> Dark inner</label>
  </aside>
</section>`;
