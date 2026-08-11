import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

async function compilePrefixFixture({ name, tailwind = '', daisyUi = '', candidate }) {
  const css = [
    `@import "tailwindcss" source(none)${tailwind ? ` prefix(${tailwind})` : ''};`,
    '@plugin "daisyui" {',
    '  themes: false;',
    '  include: button;',
    '  logs: false;',
    daisyUi ? `  prefix: "${daisyUi}";` : '',
    '}',
    candidate ? `@source inline("${candidate}");` : '',
  ].join('\n');

  const result = await postcss([tailwindcss()]).process(css, {
    from: fileURLToPath(new URL(`./fixtures/${name}.css`, import.meta.url)),
  });
  return result;
}

function findSelectorRules(result, selector) {
  const matchingRules = [];
  result.root.walkRules(rule => {
    if (rule.selectors.includes(selector)) matchingRules.push(rule);
  });
  return matchingRules;
}

const cases = [
  { name: 'default', candidate: 'btn', selector: '.btn' },
  { name: 'daisy', daisyUi: 'd-', candidate: 'd-btn', selector: '.d-btn' },
  { name: 'tailwind', tailwind: 'tw', candidate: 'tw:btn', selector: '.tw\\:btn' },
  {
    name: 'combined',
    tailwind: 'tw',
    daisyUi: 'd-',
    candidate: 'tw:d-btn',
    selector: '.tw\\:d-btn',
  },
];

for (const prefixCase of cases) {
  test(`installed Tailwind and daisyUI compile the ${prefixCase.name} class contract`, async () => {
    const result = await compilePrefixFixture(prefixCase);
    const rules = findSelectorRules(result, prefixCase.selector);

    assert.ok(rules.length > 0, `expected exact selector ${prefixCase.selector}`);
    const displayValues = [];
    for (const rule of rules) {
      rule.walkDecls('display', declaration => displayValues.push(declaration.value));
    }
    assert.ok(displayValues.includes('inline-flex'));
  });
}

test('runtime generation is not a Tailwind source and the complete configured candidate is required', async () => {
  const withoutCandidate = await compilePrefixFixture({
    name: 'missing-combined-candidate',
    tailwind: 'tw',
    daisyUi: 'd-',
  });
  const incompleteCandidate = await compilePrefixFixture({
    name: 'incomplete-combined-candidate',
    tailwind: 'tw',
    daisyUi: 'd-',
    candidate: 'btn',
  });

  assert.equal(findSelectorRules(withoutCandidate, '.tw\\:d-btn').length, 0);
  assert.equal(findSelectorRules(incompleteCandidate, '.tw\\:d-btn').length, 0);
});

test('installed Tailwind accepts the documented daisyUI prefix grammar boundary', async () => {
  const result = await compilePrefixFixture({
    name: 'daisy-prefix-boundary',
    daisyUi: 'dD_2-',
    candidate: 'dD_2-btn',
  });

  assert.ok(findSelectorRules(result, '.dD_2-btn').length > 0);
});

test('installed daisyUI keeps theme-controller outside the Tailwind prefix', async () => {
  const css = [
    '@import "tailwindcss" source(none) prefix(tw);',
    '@plugin "daisyui" {',
    '  themes: light --default;',
    '  prefix: "d-";',
    '  logs: false;',
    '}',
  ].join('\n');
  const result = await postcss([tailwindcss()]).process(css, {
    from: fileURLToPath(new URL('./fixtures/theme-controller.css', import.meta.url)),
  });

  assert.match(result.css, /input\.d-theme-controller/);
  assert.doesNotMatch(result.css, /tw\\:d-theme-controller/);
});
