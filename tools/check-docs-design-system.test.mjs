import assert from 'node:assert/strict';
import test from 'node:test';
import { designSystemViolations } from './check-docs-design-system.mjs';

test('rejects inline style attributes in component templates', () => {
  const violations = designSystemViolations('app/x.component.ts', '<i style="width: 2px"></i>');
  assert.equal(violations.length, 1);
  assert.match(violations[0], /inline style attribute/);
});

test('rejects colour literals outside the token file', () => {
  assert.equal(designSystemViolations('app/x.component.ts', 'color: #fff;').length, 1);
  assert.equal(designSystemViolations('app/x.component.ts', 'color: oklch(50% 0 0);').length, 1);
  assert.deepEqual(
    designSystemViolations('styles/tokens.css', '--docs-code-bg: oklch(22% 0 0);'),
    [],
  );
});

test('rejects --zd-* and --color-* definitions but allows their use', () => {
  assert.equal(designSystemViolations('styles/tokens.css', '--zd-sans: Inter;').length, 1);
  assert.equal(designSystemViolations('styles/tokens.css', '--color-primary: red;').length, 1);
  assert.deepEqual(
    designSystemViolations('app/x.component.ts', 'background: var(--color-primary);'),
    [],
  );
});

test('allows library token overrides inside content code samples only', () => {
  const sample = '  --zd-calendar-day-size: 2.75rem;';
  assert.deepEqual(designSystemViolations('app/content/calendar.content.ts', sample), []);
  assert.equal(designSystemViolations('app/pages/calendar.component.ts', sample).length, 1);
  assert.equal(designSystemViolations('app/content/x.content.ts', 'color: #fff;').length, 1);
});
