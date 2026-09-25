import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { plannedNotice, nativeSsr } from './form-controls.content';

/**
 * Fieldset reference content. Mirrors projects/components/fieldset/src/fieldset.ts and
 * docs/components/fieldset.md — update them together.
 */

const source =
  'https://github.com/pranxy/zordon-ui/blob/master/projects/components/fieldset/src/fieldset.ts';

export const fieldsetReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Fieldset',
  maturity: 'planned',
  description:
    'daisyUI styling for a native fieldset, its legend and its labels. The fieldset still names the group and passes its disabled state to every control inside it; Zordon adds classes only.',
  facts: [
    { label: 'Group', value: 'zdFieldset', mono: true },
    { label: 'Name', value: 'zdFieldsetLegend', mono: true },
    { label: 'Entry point', value: '@pranxy/zordon-ui/fieldset', mono: true },
    { label: 'Source', value: 'fieldset.ts', href: source, mono: true },
  ],
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdFieldset, ZdFieldsetLabel, ZdFieldsetLegend } from '@pranxy/zordon-ui/fieldset';`,
    stylesCode: `/* Tailwind can't see classes added at runtime; list the ones you use */
@source inline("fieldset fieldset-legend fieldset-label");`,
  },
  playgroundDescription:
    'Fieldset has no inputs. Toggle the native disabled attribute to see it reach every control in the group.',
  api: {
    description:
      'Three standalone directives with no inputs, outputs or types. daisyUI offers no colors or sizes for Fieldset.',
    tables: [
      {
        id: 'directives',
        heading: 'Directives',
        caption: 'Fieldset directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          {
            name: 'fieldset[zdFieldset]',
            description: '`fieldset`: spacing and layout for the group.',
          },
          {
            name: 'legend[zdFieldsetLegend]',
            description: '`fieldset-legend`: the group’s visible name.',
          },
          {
            name: 'label[zdFieldsetLabel]',
            description:
              '`fieldset-label`: a quieter label style. It is still a real label; point it at a control with `for`.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description: 'The native elements carry the semantics; the directives only add classes.',
    features: [
      {
        title: 'The legend names the group',
        body: 'Screen readers read the legend before each control in the group, so keep it short and specific.',
      },
      {
        title: 'Disabled reaches every control',
        body: 'A disabled fieldset disables all its controls, except those inside its first legend. Don’t duplicate it per control.',
      },
      {
        title: 'Labels stay associated',
        body: 'zdFieldsetLabel is styling. Each control still needs a label with for, or one wrapped around it.',
      },
      {
        title: 'Help and errors on the control',
        body: 'Point aria-describedby from the control to its help or error text; the fieldset does not do it for you.',
      },
    ],
  },
  customization: {
    description:
      'Fieldset has no inputs and no stable CSS variables. Layout, orientation, required markers and error placement are your markup and classes.',
  },
  ssr: nativeSsr,
};

export const fieldsetPlaygroundControls: readonly PlaygroundControl[] = [
  { kind: 'boolean', key: 'disabled', defaultValue: false },
];

export const fieldsetPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes => `<fieldset zdFieldset${attributes}>
  <legend zdFieldsetLegend>Shipping address</legend>
  <label zdFieldsetLabel for="street">Street</label>
  <input id="street" zdTextInput autocomplete="street-address" />
  <label zdFieldsetLabel for="postcode">Postcode</label>
  <input id="postcode" zdTextInput autocomplete="postal-code" />
</fieldset>`,
};

export const groupingCode = `<fieldset zdFieldset>
  <legend zdFieldsetLegend>Account</legend>
  <label zdFieldsetLabel for="username">Username</label>
  <input id="username" zdTextInput autocomplete="username" aria-describedby="username-help" />
  <p id="username-help">3 to 16 letters or digits.</p>
</fieldset>`;

export const disabledFiles = [
  {
    label: 'billing.html',
    language: 'html' as const,
    code: `<fieldset zdFieldset [disabled]="sameAsShipping()">
  <legend zdFieldsetLegend>Billing address</legend>
  <label zdFieldsetLabel for="billing-street">Street</label>
  <input id="billing-street" zdTextInput />
  <label zdFieldsetLabel for="billing-country">Country</label>
  <select id="billing-country" zdSelect>…</select>
</fieldset>`,
  },
  {
    label: 'billing.ts',
    language: 'ts' as const,
    code: `readonly sameAsShipping = signal(true);`,
  },
];

export const nestedCode = `<fieldset zdFieldset>
  <legend zdFieldsetLegend>Notifications</legend>
  <fieldset zdFieldset>
    <legend zdFieldsetLegend>Email</legend>
    <label><input type="checkbox" zdCheckbox checked /> Product updates</label>
    <label><input type="checkbox" zdCheckbox /> Newsletter</label>
  </fieldset>
  <fieldset zdFieldset>
    <legend zdFieldsetLegend>Phone</legend>
    <label><input type="checkbox" zdCheckbox /> Security alerts by SMS</label>
  </fieldset>
</fieldset>`;
