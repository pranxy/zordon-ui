import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('Accordion composes the external Angular Aria runtime and packages its visibility and motion rules', async () => {
  const bundle = await readFile(
    new URL('../dist/components/fesm2022/pranxy-zordon-ui-accordion.mjs', import.meta.url),
    'utf8',
  );
  assert.match(bundle, /@angular\/aria\/accordion/);
  assert.doesNotMatch(bundle, /class AccordionGroupPattern|class AccordionTriggerPattern/);
  assert.match(bundle, /prefers-reduced-motion/);
  assert.match(bundle, /display:\s*none\s*!important/);
});
