import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

async function compileThemeFixture({ root = ':root' } = {}) {
  const css = [
    '@import "tailwindcss" source(none);',
    '@plugin "daisyui" {',
    '  themes: light --default, dark --prefersdark, cupcake;',
    `  root: "${root}";`,
    '  logs: false;',
    '}',
    '@plugin "daisyui/theme" {',
    '  name: "brand/v2";',
    '  color-scheme: light;',
    '  --color-primary: oklch(55% 0.2 260);',
    '  --radius-box: 1.25rem;',
    '}',
  ].join('\n');

  return postcss([tailwindcss()]).process(css, {
    from: fileURLToPath(new URL('./fixtures/theme-scopes.css', import.meta.url)),
  });
}

function findRules(result, predicate) {
  const rules = [];
  result.root.walkRules(rule => {
    if (predicate(rule.selector)) rules.push(rule);
  });
  return rules;
}

function declarations(rules, property) {
  const values = [];
  for (const rule of rules) {
    rule.walkDecls(property, declaration => values.push(declaration.value));
  }
  return values;
}

test('installed daisyUI compiles default, preferred-dark, nested, and custom theme selectors', async () => {
  const result = await compileThemeFixture();
  const defaultRules = findRules(
    result,
    selector => selector.includes(':where(:root)') && selector.includes('[data-theme=light]'),
  );
  const nestedRules = findRules(result, selector => selector.includes('[data-theme=cupcake]'));
  const customRules = findRules(result, selector =>
    selector.includes('[data-theme="brand\\2f v2"]'),
  );
  const preferredDarkRules = [];
  result.root.walkAtRules('media', atRule => {
    if (atRule.params === '(prefers-color-scheme: dark)') {
      atRule.walkRules(rule => {
        if (rule.selector.includes(':root:not([data-theme])')) preferredDarkRules.push(rule);
      });
    }
  });

  assert.ok(defaultRules.length > 0, 'expected the configured default theme selector');
  assert.ok(preferredDarkRules.length > 0, 'expected the preferred-dark root selector');
  assert.ok(nestedRules.length > 0, 'expected a data-theme selector for nested scopes');
  assert.ok(customRules.length > 0, 'expected the escaped consumer-defined theme selector');
  assert.ok(declarations(nestedRules, '--radius-box').length > 0);
  assert.deepEqual(declarations(customRules, '--radius-box'), ['1.25rem']);
});

test('installed daisyUI targets a configured application root for defaults and preference', async () => {
  const result = await compileThemeFixture({ root: '#app' });
  const defaultRules = findRules(
    result,
    selector => selector.includes(':where(#app)') && selector.includes('[data-theme=light]'),
  );
  const preferredDarkRules = [];
  result.root.walkAtRules('media', atRule => {
    if (atRule.params === '(prefers-color-scheme: dark)') {
      atRule.walkRules(rule => {
        if (rule.selector.includes('#app:not([data-theme])')) preferredDarkRules.push(rule);
      });
    }
  });

  assert.ok(defaultRules.length > 0, 'expected the default theme on the configured root');
  assert.ok(preferredDarkRules.length > 0, 'expected preferred dark on the configured root');
});
