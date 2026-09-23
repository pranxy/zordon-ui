import {
  playgroundAttributes,
  playgroundCode,
  type PlaygroundControl,
} from './playground.component';
import { inlineCodeSegments } from '../page/inline-code.component';

const controls: readonly PlaygroundControl[] = [
  { kind: 'choice', key: 'color', options: [], defaultValue: 'primary', omit: ['default'] },
  { kind: 'choice', key: 'variant', options: [], defaultValue: 'solid', omit: ['solid'] },
  { kind: 'boolean', key: 'loading', defaultValue: false },
];

describe('playground snippet', () => {
  it('writes chosen values and omits "no attribute" choices', () => {
    expect(
      playgroundAttributes(controls, { color: 'primary', variant: 'solid', loading: false }),
    ).toBe(' color="primary"');
    expect(
      playgroundAttributes(controls, { color: 'default', variant: 'soft', loading: true }),
    ).toBe(' variant="soft" loading');
  });
});

describe('playground code', () => {
  const values = { color: 'secondary', variant: 'solid', loading: true };

  it('wraps a single element', () => {
    expect(
      playgroundCode({ element: 'kbd', directive: 'zdKbd', content: 'K' }, controls, values),
    ).toBe('<kbd zdKbd color="secondary" loading>K</kbd>');
  });

  it('passes attributes to a template snippet', () => {
    expect(
      playgroundCode(
        { render: attributes => `<div zdDropdown${attributes}></div>` },
        controls,
        values,
      ),
    ).toBe('<div zdDropdown color="secondary" loading></div>');
  });
});

describe('inline code segments', () => {
  it('treats backtick-delimited text as code', () => {
    expect(inlineCodeSegments('Sets `aria-disabled` while `loading`.')).toEqual([
      { code: false, text: 'Sets ' },
      { code: true, text: 'aria-disabled' },
      { code: false, text: ' while ' },
      { code: true, text: 'loading' },
      { code: false, text: '.' },
    ]);
  });
});
