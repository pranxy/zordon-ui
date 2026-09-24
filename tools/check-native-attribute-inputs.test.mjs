import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  checkLibrary,
  nativeAttributeCollisions,
  selectorHosts,
} from './check-native-attribute-inputs.mjs';

const directive = (selector, members, extra = '') => `
@Directive({ selector: '${selector}'${extra} })
export class ZdExample {
${members}
}`;

test('rejects an input named after a global attribute on any host', () => {
  const problems = nativeAttributeCollisions(
    'example.ts',
    directive('[zdExample]', "  readonly style = input<'ghost'>();"),
  );
  assert.equal(problems.length, 1);
  assert.match(problems[0], /"style" is a native attribute of every element/);
});

test('rejects an input named after an attribute native to the selected element', () => {
  const problems = nativeAttributeCollisions(
    'example.ts',
    directive('select[zdExample]', "  readonly size = input<'lg'>();"),
  );
  assert.match(problems[0], /"size" is a native attribute of <select>/);
});

test('ignores size on input types where the native attribute has no effect', () => {
  assert.deepEqual(
    nativeAttributeCollisions(
      'example.ts',
      directive('input[type="checkbox"][zdExample]', "  readonly size = input<'lg'>();"),
    ),
    [],
  );
  assert.equal(
    nativeAttributeCollisions(
      'example.ts',
      directive('input[zdExample]', "  readonly size = input<'lg'>();"),
    ).length,
    1,
  );
});

test('checks aliases, models and host-directive inputs, and allows prefixed names', () => {
  const source = directive(
    'button[zdExample]',
    [
      "  readonly kind = input<string>('', { alias: 'type' });",
      '  readonly value = model<string>();',
      '  readonly zdDisabled = input(false);',
    ].join('\n'),
    ", hostDirectives: [{ directive: Other, inputs: ['disabled'] }]",
  );
  const problems = nativeAttributeCollisions('example.ts', source);
  assert.deepEqual(problems.map(problem => /input "(\w+)"/.exec(problem)?.[1]).sort(), [
    'disabled',
    'type',
    'value',
  ]);
});

test('allows inputs listed as deliberate mirrors of the native attribute', () => {
  const source = directive('button[zdExample]', '  readonly disabled = input(false);');
  const mirrored = new Map([['ZdExample.disabled', 'reflected to the host']]);
  assert.deepEqual(nativeAttributeCollisions('example.ts', source, mirrored), []);
});

test('reads the element and input type of each selector part', () => {
  assert.deepEqual(selectorHosts('input[type="radio"][zdX], [zdX], a[href][zdX]'), [
    { element: 'input', type: 'radio' },
    { element: undefined, type: undefined },
    { element: 'a', type: undefined },
  ]);
});

test('the library has no input that reuses a native attribute name', async () => {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const { files, problems } = await checkLibrary(root);
  assert.ok(files > 100);
  assert.deepEqual(problems, []);
});
