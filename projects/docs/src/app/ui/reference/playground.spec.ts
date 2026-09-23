import { playgroundAttributes, type PlaygroundControl } from './playground.component';
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
