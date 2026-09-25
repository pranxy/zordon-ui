import type {
  PlaygroundControl,
  PlaygroundTemplateSnippet,
} from '../ui/reference/playground.component';
import type { DocsReference } from '../ui/reference/reference-page.component';
import { nativeSsr, plannedNotice } from './form-controls.content';

/**
 * Label reference content. Mirrors projects/components/label/src/label.ts and
 * docs/components/label.md — update them together.
 */

const source =
  'https://github.com/pranxy/zordon-ui/blob/master/projects/components/label/src/label.ts';

export const labelReference: DocsReference = {
  eyebrow: 'Data input',
  heading: 'Label',
  maturity: 'planned',
  description:
    'daisyUI styling for a native label, including the floating label that sits inside a field until it has a value. The label keeps its association with the control; Zordon adds classes only.',
  facts: [
    { label: 'Label', value: 'label[zdLabel]', mono: true },
    { label: 'Floating', value: 'label[zdFloatingLabel]', mono: true },
    { label: 'Entry point', value: '@pranxy/zordon-ui/label', mono: true },
    { label: 'Source', value: 'label.ts', href: source, mono: true },
  ],
  notice: plannedNotice,
  install: {
    description: 'Import the directives, and register the classes they add with Tailwind.',
    importCode: `import { ZdFloatingLabel, ZdLabel } from '@pranxy/zordon-ui/label';`,
    stylesCode: `/* Tailwind can't see classes added at runtime; list the ones you use */
@source inline("label floating-label");`,
  },
  playgroundDescription:
    'Switch between the two directives. Type in the floating label’s field to watch its text move up.',
  api: {
    description:
      'Two standalone directives with no inputs. daisyUI’s current Label has no colors or sizes.',
    tables: [
      {
        id: 'directives',
        heading: 'Directives',
        caption: 'Label directives',
        columns: [
          { key: 'name', label: 'Directive', kind: 'name' },
          { key: 'description', label: 'Adds' },
        ],
        rows: [
          {
            name: 'label[zdLabel]',
            description:
              '`label`: daisyUI’s muted label text. Associate it with for, or wrap the control.',
          },
          {
            name: 'label[zdFloatingLabel]',
            description:
              '`floating-label`: wrap a text span and the control; the text floats once the field has a value or focus.',
          },
        ],
      },
    ],
  },
  accessibility: {
    description: 'A native label is what names the control; the classes change only its look.',
    features: [
      {
        title: 'Associate every label',
        body: 'Use for with the control’s id, or put the control inside the label. Clicking the label then focuses it.',
      },
      {
        title: 'Floating is still a label',
        body: 'The floating span is inside the label, so it names the control. The placeholder only drives the animation.',
      },
      {
        title: 'Say it in full',
        body: 'Write the complete label text, localized; don’t rely on placeholder text or icons.',
      },
      {
        title: 'Nothing added',
        body: 'The directives add no ids, ARIA or required markers. Those are yours.',
      },
    ],
  },
  customization: {
    description:
      'No inputs and no stable CSS variables. Required markers, optional text, help and layout are your markup and classes.',
  },
  ssr: nativeSsr,
};

export const labelPlaygroundControls: readonly PlaygroundControl[] = [
  {
    kind: 'choice',
    key: 'directive',
    options: [
      { value: 'zdLabel', label: 'zdLabel' },
      { value: 'zdFloatingLabel', label: 'zdFloatingLabel' },
    ],
    defaultValue: 'zdLabel',
    omit: ['zdLabel'],
  },
];

/** The playground's only control picks the directive, so the snippet shows that markup. */
export const labelPlaygroundSnippet: PlaygroundTemplateSnippet = {
  render: attributes =>
    attributes.includes('zdFloatingLabel')
      ? `<label zdFloatingLabel>
  <span>City</span>
  <input zdTextInput placeholder="City" autocomplete="address-level2" />
</label>`
      : `<label zdLabel for="city">City</label>
<input id="city" zdTextInput autocomplete="address-level2" />`,
};

export const associationCode = `<!-- Explicit: for points at the control's id -->
<label zdLabel for="company">Company</label>
<input id="company" zdTextInput autocomplete="organization" />

<!-- Implicit: the control is inside the label -->
<label zdLabel>
  <input type="checkbox" zdCheckbox /> Keep me signed in
</label>`;

export const floatingCode = `<label zdFloatingLabel>
  <span>Email address</span>
  <input type="email" zdTextInput placeholder="Email address" autocomplete="email" />
</label>
<label zdFloatingLabel>
  <span>Promo code</span>
  <input zdTextInput zdSize="lg" placeholder="Promo code" />
</label>`;
