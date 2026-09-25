import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { nativeSsr, plannedNotice } from './form-controls.content';

/**
 * Validator reference content. Mirrors projects/components/validator/src/validator.ts and
 * docs/components/validator.md — update them together.
 */

const source =
  'https://github.com/pranxy/zordon-ui/blob/master/projects/components/validator/src/validator.ts';

export const validatorReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Validator',
  maturity: 'planned',
  description:
    'daisyUI’s validity colors for a native input, select or textarea, and a hint that appears when the value is invalid. Native constraints or your Forms state decide validity; Zordon adds classes only.',
  facts: [
    { label: 'Control', value: '[zdValidator]', mono: true },
    { label: 'Hint', value: '[zdValidatorHint]', mono: true },
    { label: 'Entry point', value: '@pranxy/zordon-ui/validator', mono: true },
    { label: 'Source', value: 'validator.ts', href: source, mono: true },
  ],
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdValidator, ZdValidatorHint } from '@pranxy/zordon-ui/validator';`,
    stylesCode: `/* Tailwind can't see classes added at runtime; list the ones you use */
@source inline("validator validator-hint");`,
  },
  playgroundDescription:
    'Type something invalid and leave the field: the border turns red and the hint appears. Valid values turn green.',
  api: {
    description:
      'Two standalone directives with no inputs. They never change validity, create messages or add ARIA.',
    tables: [
      {
        id: 'directives',
        heading: 'Directives',
        caption: 'Validator directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          {
            name: 'input, select, textarea [zdValidator]',
            description:
              '`validator`: green or red once the browser marks the value user-valid or user-invalid, or while `aria-invalid` is true.',
          },
          {
            name: '[zdValidatorHint]',
            description:
              '`validator-hint`: hidden until the preceding sibling control is invalid. Place it after the control.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description:
      'Validity comes from the platform or from aria-invalid, so assistive technology hears the same state.',
    features: [
      {
        title: 'Connect the hint',
        body: 'Point aria-describedby at the hint. It is read even while visually hidden, so write it as guidance, not only as an error.',
      },
      {
        title: 'Not color alone',
        body: 'Red and green borders need the text hint alongside them.',
      },
      {
        title: 'After interaction',
        body: 'The browser marks :user-invalid only after someone has edited and left the field, so errors don’t shout on page load.',
      },
      {
        title: 'Forms set aria-invalid',
        body: 'Angular validators do not change native validity. Bind aria-invalid from the control’s state to show their errors.',
      },
    ],
  },
  customization: {
    description:
      'The colors come from daisyUI’s success and error roles through --input-color, so theme scopes restyle them. Hint text, placement and wording are yours.',
  },
  ssr: nativeSsr,
};

const options = (values: readonly string[]) => values.map(value => ({ value, label: value }));

export const validatorPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'type',
    options: options(['email', 'url', 'number']),
    defaultValue: 'email',
  },
  { kind: 'boolean', key: 'required', defaultValue: true },
];

export const hintFor: Readonly<Record<string, string>> = {
  email: 'Enter an email address like ada@example.com.',
  url: 'Enter a full address starting with https://.',
  number: 'Enter a number from 1 to 10.',
};

export const validatorPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<label for="field">Your answer</label>
<input id="field" zdTextInput zdValidator${attributes} aria-describedby="field-hint" />
<p id="field-hint" zdValidatorHint>…</p>`,
};

export const constraintsCode = `<label for="work-email">Work email</label>
<input id="work-email" type="email" required zdTextInput zdValidator
       autocomplete="email" aria-describedby="work-email-hint" />
<p id="work-email-hint" zdValidatorHint>Enter an email address like ada@example.com.</p>`;

export const patternCode = `<label for="handle">Username</label>
<input id="handle" zdTextInput zdValidator required
       pattern="[A-Za-z][A-Za-z0-9\\-]*" minlength="3" maxlength="30"
       aria-describedby="handle-hint" />
<p id="handle-hint" zdValidatorHint>
  3 to 30 characters: letters, digits or dashes, starting with a letter.
</p>`;

export const formsFiles = [
  {
    label: 'invite.html',
    language: 'html' as const,
    code: `<label for="invite">Invite code</label>
<input id="invite" zdTextInput zdValidator [formControl]="invite"
       [attr.aria-invalid]="showError()" aria-describedby="invite-hint" />
<p id="invite-hint" zdValidatorHint>Invite codes are 8 letters or digits.</p>`,
  },
  {
    label: 'invite.ts',
    language: 'ts' as const,
    code: `readonly invite = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{8}$/i)],
});
readonly touched = signal(false); // set on blur
readonly showError = computed(() => this.touched() && this.status() === 'INVALID');`,
  },
];
