import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveDividerColor,
  resolveDividerOrientation,
  resolveDividerPlacement,
  withDividerDefaults,
  ZD_DIVIDER_DEFAULTS,
} from './divider-defaults';

describe('withDividerDefaults', () => {
  it('copies and freezes valid values while discarding undefined fields', () => {
    const defaults: { color: 'primary' | 'secondary'; orientation: undefined } = {
      color: 'primary',
      orientation: undefined,
    };
    const feature = withDividerDefaults(defaults);
    defaults.color = 'secondary';
    TestBed.configureTestingModule({ providers: [provideZordonUi({}, feature)] });
    const resolved = TestBed.inject(ZD_DIVIDER_DEFAULTS);

    expect(resolved).toEqual({ color: 'primary' });
    expect(Object.isFrozen(resolved)).toBe(true);
  });

  it('retains every supported explicit default field', () => {
    const feature = withDividerDefaults({
      color: 'primary',
      orientation: 'horizontal',
      placement: 'end',
    });
    TestBed.configureTestingModule({ providers: [provideZordonUi({}, feature)] });

    expect(TestBed.inject(ZD_DIVIDER_DEFAULTS)).toEqual({
      color: 'primary',
      orientation: 'horizontal',
      placement: 'end',
    });
  });

  it('rejects invalid defaults and duplicate Divider features', () => {
    expect(() => withDividerDefaults({ color: 'invalid' as never })).toThrowError(/Divider color/);
    expect(() => withDividerDefaults({ orientation: 'diagonal' as never })).toThrowError(
      /Divider orientation/,
    );
    expect(() => withDividerDefaults({ placement: 'top' as never })).toThrowError(
      /Divider placement/,
    );
    expect(() => withDividerDefaults({ unknown: 'value' } as never)).toThrowError(/do not support/);
    expect(() => withDividerDefaults(null as never)).toThrowError(/must be an object/);
    expect(() =>
      provideZordonUi(
        {},
        withDividerDefaults({ color: 'primary' }),
        withDividerDefaults({ orientation: 'horizontal' }),
      ),
    ).toThrowError(/divider-defaults.*only be configured once/);
  });
});

describe('Divider input value validation', () => {
  it('accepts known values and preserves undefined omission', () => {
    expect(resolveDividerColor(undefined)).toBeUndefined();
    expect(resolveDividerColor('primary')).toBe('primary');
    expect(resolveDividerOrientation(undefined)).toBeUndefined();
    expect(resolveDividerOrientation('horizontal')).toBe('horizontal');
    expect(resolveDividerPlacement(undefined)).toBeUndefined();
    expect(resolveDividerPlacement('end')).toBe('end');
  });

  it('rejects unknown values rather than emitting uncompiled class candidates', () => {
    expect(() => resolveDividerColor('brand')).toThrowError(/Divider color/);
    expect(() => resolveDividerOrientation('diagonal')).toThrowError(/Divider orientation/);
    expect(() => resolveDividerPlacement('top')).toThrowError(/Divider placement/);
  });
});
