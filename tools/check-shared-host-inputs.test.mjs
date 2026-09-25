import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { declarations } from './check-native-attribute-inputs.mjs';
import { canShareHost, checkLibrary, sharedHostCollisions } from './check-shared-host-inputs.mjs';

const source = `
@Directive({ selector: 'button[zdStyled]' })
export class ZdStyled {
  readonly color = input<string>();
  readonly active = input(false);
}

@Directive({ selector: '[zdHint]' })
export class ZdHint {
  readonly color = input<string>();
  readonly open = model(false);
  readonly closed = output<string>();
}

@Directive({ selector: '[zdPanel]' })
export class ZdPanel {
  readonly openChange = output<boolean>();
  readonly closed = output<string>();
}

@Component({ selector: 'zd-card', template: '' })
export class ZdCardExample {
  readonly color = input<string>();
}

@Component({ selector: 'zd-other', template: '' })
export class ZdOther {
  readonly color = input<string>();
}

@Directive({ selector: 'ng-template[zdLazy]' })
export class ZdLazy {
  readonly color = input<string>();
}

@Directive({ selector: 'input[type="radio"][zdRadioish]' })
export class ZdRadioish {
  readonly color = input<string>();
}

@Directive({ selector: 'input[type="checkbox"][zdCheckish]' })
export class ZdCheckish {
  readonly color = input<string>();
}`;

const all = declarations('example.ts', source).map(entry => ({ fileName: 'example.ts', ...entry }));
const byName = name => all.find(entry => entry.className === name);

test('reads outputs, including the change output of a model', () => {
  assert.deepEqual(byName('ZdHint').outputs, ['openChange', 'closed']);
  assert.equal(byName('ZdCardExample').component, true);
});

test('decides which declarations can share an element', () => {
  assert.equal(canShareHost(byName('ZdHint'), byName('ZdStyled')), true);
  assert.equal(canShareHost(byName('ZdHint'), byName('ZdCardExample')), true);
  assert.equal(canShareHost(byName('ZdCardExample'), byName('ZdOther')), false);
  assert.equal(canShareHost(byName('ZdHint'), byName('ZdLazy')), false);
  assert.equal(canShareHost(byName('ZdRadioish'), byName('ZdCheckish')), false);
  assert.equal(canShareHost(byName('ZdStyled'), byName('ZdRadioish')), false);
});

test('reports inputs and outputs of a layered directive that another host declares', () => {
  const problems = sharedHostCollisions(all, new Map([['ZdHint', 'layered']]), new Map());
  const found = problems.map(problem =>
    /(\w+) (?:input|output) "(\w+)" also binds to (\w+)/.exec(problem).slice(1).join(' '),
  );
  assert.deepEqual(found.sort(), [
    'ZdHint closed ZdPanel',
    'ZdHint color ZdCardExample',
    'ZdHint color ZdCheckish',
    'ZdHint color ZdOther',
    'ZdHint color ZdRadioish',
    'ZdHint color ZdStyled',
    'ZdHint openChange ZdPanel',
  ]);
});

test('ignores directives that are not layered, and allowlisted shared names', () => {
  assert.deepEqual(sharedHostCollisions(all, new Map(), new Map()), []);
  const allowed = new Map([
    ['ZdHint.color|ZdStyled.color', 'same meaning'],
    ['ZdPanel.closed|ZdHint.closed', 'never together'],
  ]);
  const problems = sharedHostCollisions(all, new Map([['ZdHint', 'layered']]), allowed);
  assert.ok(problems.every(problem => !/ZdStyled|"closed"/.test(problem)));
});

test('no layered library directive shares a binding name with a directive on its element', async () => {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const { declarations: count, problems } = await checkLibrary(root);
  assert.ok(count > 100);
  assert.deepEqual(problems, []);
});
