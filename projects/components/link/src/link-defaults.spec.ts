import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveLinkColor,
  resolveLinkHover,
  withLinkDefaults,
  ZD_LINK_DEFAULTS,
} from './link-defaults';

describe('withLinkDefaults', () => {
  it('copies and freezes valid values while discarding undefined fields', () => {
    const defaults: { color: 'primary' | 'secondary'; hover: undefined } = {
      color: 'primary',
      hover: undefined,
    };
    const feature = withLinkDefaults(defaults);
    defaults.color = 'secondary';
    TestBed.configureTestingModule({ providers: [provideZordonUi({}, feature)] });
    const resolved = TestBed.inject(ZD_LINK_DEFAULTS);

    expect(resolved).toEqual({ color: 'primary' });
    expect(Object.isFrozen(resolved)).toBe(true);
  });

  it('retains every supported explicit default field', () => {
    const feature = withLinkDefaults({ color: 'primary', hover: true });
    TestBed.configureTestingModule({ providers: [provideZordonUi({}, feature)] });

    expect(TestBed.inject(ZD_LINK_DEFAULTS)).toEqual({ color: 'primary', hover: true });
  });

  it('rejects invalid defaults and duplicate Link features', () => {
    expect(() => withLinkDefaults({ color: 'invalid' as never })).toThrowError(/Link color/);
    expect(() => withLinkDefaults({ hover: 'yes' as never })).toThrowError(/Link hover/);
    expect(() => withLinkDefaults({ unknown: 'value' } as never)).toThrowError(/do not support/);
    expect(() => withLinkDefaults(null as never)).toThrowError(/must be an object/);
    expect(() =>
      provideZordonUi(
        {},
        withLinkDefaults({ color: 'primary' }),
        withLinkDefaults({ hover: true }),
      ),
    ).toThrowError(/link-defaults.*only be configured once/);
  });
});

describe('Link input value validation', () => {
  it('accepts known values and preserves undefined omission', () => {
    expect(resolveLinkColor(undefined)).toBeUndefined();
    expect(resolveLinkColor('primary')).toBe('primary');
    expect(resolveLinkHover(undefined)).toBeUndefined();
    expect(resolveLinkHover(true)).toBe(true);
  });

  it('rejects unknown values rather than emitting uncompiled class candidates', () => {
    expect(() => resolveLinkColor('brand')).toThrowError(/Link color/);
    expect(() => resolveLinkHover('yes')).toThrowError(/Link hover/);
  });
});
