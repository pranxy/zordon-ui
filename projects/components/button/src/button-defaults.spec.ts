import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveButtonColor,
  resolveButtonLayout,
  resolveButtonSize,
  resolveButtonVariant,
  withButtonDefaults,
  ZD_BUTTON_DEFAULTS,
} from './button-defaults';

describe('withButtonDefaults', () => {
  it('copies and freezes valid values while discarding undefined fields', () => {
    const defaults: { color: 'primary' | 'secondary'; size: undefined } = {
      color: 'primary',
      size: undefined,
    };
    const feature = withButtonDefaults(defaults);
    defaults.color = 'secondary';
    TestBed.configureTestingModule({ providers: [provideZordonUi({}, feature)] });
    const resolved = TestBed.inject(ZD_BUTTON_DEFAULTS);

    expect(resolved).toEqual({ color: 'primary' });
    expect(Object.isFrozen(resolved)).toBe(true);
  });

  it('retains every supported explicit default field', () => {
    const feature = withButtonDefaults({
      color: 'primary',
      variant: 'dash',
      size: 'xl',
      layout: 'circle',
    });
    TestBed.configureTestingModule({ providers: [provideZordonUi({}, feature)] });

    expect(TestBed.inject(ZD_BUTTON_DEFAULTS)).toEqual({
      color: 'primary',
      variant: 'dash',
      size: 'xl',
      layout: 'circle',
    });
  });

  it('rejects invalid defaults and duplicate Button features', () => {
    expect(() => withButtonDefaults({ color: 'invalid' as never })).toThrowError(/Button color/);
    expect(() => withButtonDefaults({ unknown: 'value' } as never)).toThrowError(/do not support/);
    expect(() => withButtonDefaults(null as never)).toThrowError(/must be an object/);
    expect(() => withButtonDefaults([] as never)).toThrowError(/must be an object/);
    expect(() =>
      provideZordonUi({}, withButtonDefaults({ color: 'primary' }), withButtonDefaults({ size: 'sm' })),
    ).toThrowError(/button-defaults.*only be configured once/);
  });
});

describe('Button input value validation', () => {
  it('accepts known values and preserves undefined omission', () => {
    expect(resolveButtonColor(undefined)).toBeUndefined();
    expect(resolveButtonColor('primary')).toBe('primary');
    expect(resolveButtonVariant('dash')).toBe('dash');
    expect(resolveButtonSize('xl')).toBe('xl');
    expect(resolveButtonLayout('circle')).toBe('circle');
  });

  it('rejects unknown values rather than emitting uncompiled class candidates', () => {
    expect(() => resolveButtonColor('brand')).toThrowError(/Button color/);
    expect(() => resolveButtonVariant(null)).toThrowError(/Button variant/);
    expect(() => resolveButtonSize(1)).toThrowError(/Button size/);
    expect(() => resolveButtonLayout('stretch')).toThrowError(/Button layout/);
  });
});
