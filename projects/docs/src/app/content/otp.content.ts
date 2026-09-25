import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { controlFacts, nativeSsr, plannedNotice } from './form-controls.content';

/**
 * OTP reference content. Mirrors projects/components/otp/src/otp.ts and docs/components/otp.md —
 * update them together.
 */

export const otpReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'OTP',
  maturity: 'planned',
  description:
    'A row of single-character inputs for one-time codes. zd-otp moves focus as you type, spreads a pasted code across the cells, and works with Angular Forms as one string value.',
  facts: controlFacts('zd-otp', 'input', 'otp'),
  notice: plannedNotice,
  install: {
    description:
      'Import the component. Its cells use daisyUI’s input class, so make sure it is compiled.',
    importCode: `import { ZdOtp } from '@pranxy/zordon-ui/otp';`,
    stylesCode: `/* The cells carry daisyUI's input class */
@source inline("input");`,
  },
  playgroundDescription:
    'Type a digit per cell, or paste a whole code into the first cell. Backspace in an empty cell steps back.',
  api: {
    description:
      'A standalone component and ControlValueAccessor. The value is the entered characters as one string.',
    tables: [
      {
        id: 'inputs',
        heading: 'Inputs',
        caption: 'OTP inputs',
        columns: [
          { key: 'name', label: 'Input', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'default', label: 'Default', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          { name: 'length', type: 'number', default: '6', description: 'Number of cells.' },
          {
            name: 'pattern',
            type: 'string',
            default: "'[0-9]'",
            description:
              'A pattern each character must match; others are dropped, including from pastes.',
          },
          {
            name: 'inputMode',
            type: 'string',
            default: "'numeric'",
            description: 'The on-screen keyboard to request. Use `text` for letters.',
          },
          {
            name: 'ariaLabel',
            type: 'string',
            default: "'One-time password'",
            description: 'Names the group; each cell is read as "<label> digit 2 of 6".',
          },
        ],
      },
      {
        id: 'outputs',
        heading: 'Outputs',
        caption: 'OTP outputs',
        columns: [
          { key: 'name', label: 'Output', kind: 'name' },
          { key: 'type', label: 'Type', kind: 'code' },
          { key: 'description', label: 'Description' },
        ],
        rows: [
          {
            name: 'valueChange',
            type: 'string',
            description: 'Every edit, as the joined characters.',
          },
          {
            name: 'completed',
            type: 'string',
            description: 'When every cell holds an allowed character.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'The host is a named group of native text inputs; the first one advertises one-time-code autofill.',
    features: [
      {
        title: 'Autofill first',
        body: 'The first cell has autocomplete="one-time-code", so phones can offer the code from a message.',
      },
      {
        title: 'Every cell is named',
        body: 'Cells are read as "Verification code digit 3 of 6". Set ariaLabel to what the code is for.',
      },
      {
        title: 'Explain it nearby',
        body: 'Say where the code was sent and how long it lasts, in text next to the group.',
      },
      {
        title: 'Errors are yours',
        body: 'Wrong codes, expiry and retry limits are your messages and policy.',
      },
    ],
    keyboard: {
      caption: 'Keyboard',
      columns: [
        { key: 'key', label: 'Key', kind: 'kbd' },
        { key: 'action', label: 'Action' },
      ],
      rows: [
        { key: '0–9', action: 'Fills the cell and moves to the next one' },
        { key: 'Backspace', action: 'In an empty cell, moves back to the previous one' },
        { key: 'Tab', action: 'Moves between cells' },
      ],
    },
  },
  customization: {
    description:
      'The cells are daisyUI inputs, so theme variables restyle them. Cell width and gap come from the component’s own stylesheet; override them on the host.',
    code: {
      label: 'styles.css',
      language: 'css',
      code: `/* Wider gaps between cells */
zd-otp.roomy {
  gap: 0.75rem;
}`,
    },
  },
  ssr: nativeSsr,
};

export const otpPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'length',
    options: ['4', '6', '8'].map(value => ({ value, label: value })),
    defaultValue: '6',
    omit: ['6'],
  },
];

export const otpPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<zd-otp${attributes} ariaLabel="Verification code" />`,
};

export const formsFiles = [
  {
    label: 'verify.html',
    language: 'html' as const,
    code: `<p id="code-help">We sent a 6-digit code to ada@example.com.</p>
<zd-otp ariaLabel="Verification code" aria-describedby="code-help" [formControl]="code" />`,
  },
  {
    label: 'verify.ts',
    language: 'ts' as const,
    code: `readonly code = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(6)],
});`,
  },
];

export const alphanumericCode = `<zd-otp length="5" pattern="[A-Za-z0-9]" inputMode="text" ariaLabel="Voucher code" />`;

export const completedFiles = [
  {
    label: 'pin.html',
    language: 'html' as const,
    code: `<zd-otp length="4" ariaLabel="Card PIN" (completed)="check($event)" />
<p role="status">{{ message() }}</p>`,
  },
  {
    label: 'pin.ts',
    language: 'ts' as const,
    code: `readonly message = signal('Enter all four digits.');

check(pin: string): void {
  // Send it to your server; this demo only reports it.
  this.message.set(\`Checking \${pin.length} digits…\`);
}`,
  },
];
