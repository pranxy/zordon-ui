import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, plannedNotice, tailwindSource } from './form-controls.content';

/**
 * Countdown reference content. Mirrors projects/components/countdown/src/countdown.ts and
 * docs/components/countdown.md — update them together.
 */

export const countdownReference: DocsReference = {
  eyebrow: 'Data display',
  heading: 'Countdown',
  maturity: 'planned',
  description:
    'daisyUI’s rolling-digit animation for numbers from 0 to 999. You own the value and the timer; the directive adds the class.',
  facts: controlFacts('[zdCountdown]', 'countdown', 'countdown'),
  notice: plannedNotice,
  install: {
    description: 'Import the directive, and register its class with Tailwind.',
    importCode: `import { ZdCountdown } from '@pranxy/zordon-ui/countdown';`,
    stylesCode: tailwindSource('countdown'),
  },
  playgroundDescription:
    'Each inner span shows one number through its --value custom property (0–999); --digits pads to 2 or 3.',
  api: {
    description: 'A standalone directive with no inputs: it adds `countdown` to its host.',
    tables: [
      {
        id: 'contract',
        heading: 'Markup contract',
        caption: 'Countdown markup contract',
        columns: [
          { key: 'name', label: 'Piece', kind: 'name' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: '[zdCountdown]', description: 'The wrapper; adds `countdown`.' },
          {
            name: '--value',
            description: 'On each inner span: the number to show, 0 to 999. You update it.',
          },
          { name: '--digits', description: 'Optional: `2` or `3` to pad with zeros.' },
          {
            name: 'aria-label',
            description:
              'On each inner span: the number as text, since the digits are drawn by CSS.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The digits are drawn with CSS content, so give each number an accessible label yourself.',
    features: [
      {
        title: 'Label the numbers',
        body: 'Set aria-label on each span to its current value, with a unit if it helps.',
      },
      {
        title: 'Don’t announce every tick',
        body: 'A per-second countdown in a live region is noise. Announce milestones instead.',
      },
      {
        title: 'Reduced motion',
        body: 'daisyUI shortens the roll under reduced motion; the value is still shown.',
      },
      {
        title: 'Timers are yours',
        body: 'Pausing, time zones and completion belong to your code, not the directive.',
      },
    ],
  },
  customization: {
    description:
      'Font, size and spacing are ordinary classes; a monospace font keeps digits steady.',
  },
  ssr: 'The server renders the initial value; timers start in the browser.',
};

export const countdownPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'digits',
    options: ['1', '2', '3'].map(value => ({ value, label: value })),
    defaultValue: '2',
  },
];

export const countdownPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => {
    const digits = /digits="(\d)"/.exec(attributes)?.[1] ?? '2';
    const digitsStyle = digits === '1' ? '' : ` [style.--digits]="${digits}"`;
    return `<span zdCountdown>
  <span [style.--value]="value()"${digitsStyle} [attr.aria-label]="value()">{{ value() }}</span>
</span>`;
  },
};

export const timerFiles = [
  {
    label: 'timer.html',
    language: 'html' as const,
    code: `<span zdCountdown class="clock">
  <span [style.--value]="minutes()" [style.--digits]="2" [attr.aria-label]="minutes() + ' minutes'">
    {{ minutes() }}</span
  >:<span [style.--value]="seconds()" [style.--digits]="2" [attr.aria-label]="seconds() + ' seconds'">
    {{ seconds() }}</span
  >
</span>`,
  },
  {
    label: 'timer.ts',
    language: 'ts' as const,
    code: `protected readonly left = signal(90);
protected readonly minutes = computed(() => Math.floor(this.left() / 60));
protected readonly seconds = computed(() => this.left() % 60);
// A setInterval started in the browser calls this.left.update(s => Math.max(0, s - 1)).`,
  },
];
