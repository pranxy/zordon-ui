import { Component, Directive, inject, makeEnvironmentProviders } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { zdHostClasses } from '../internal/styling/host-classes';
import {
  provideZordonUi,
  ZdClassNames,
  type ZdClassPrefixConfig,
  type ZdFeature,
} from './zordon-ui-config';

@Directive({
  selector: '[zdTestPrefixedHost]',
  host: {
    '[class]': 'hostClasses',
  },
})
class TestPrefixedHost {
  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = zdHostClasses(
    this.classNames.daisyUi('btn'),
    this.classNames.daisyUi('btn-primary'),
  );
}

@Component({
  imports: [TestPrefixedHost],
  template: ` <button zdTestPrefixedHost class="consumer-class">Action</button> `,
})
class TestPrefixConsumer {}

function injectClassNames(classPrefixes?: ZdClassPrefixConfig): ZdClassNames {
  TestBed.configureTestingModule({
    providers: classPrefixes ? [provideZordonUi({ classPrefixes })] : [],
  });
  return TestBed.inject(ZdClassNames);
}

describe('ZdClassNames', () => {
  it('uses unprefixed daisyUI classes when no provider is installed', () => {
    const classNames = injectClassNames();

    expect(classNames.daisyUi('btn')).toBe('btn');
    expect(classNames.daisyUi('theme-controller')).toBe('theme-controller');
  });

  const prefixCases: ReadonlyArray<{
    name: string;
    config: ZdClassPrefixConfig;
    button: string;
    themeController: string;
  }> = [
    {
      name: 'explicit empty prefixes',
      config: { daisyUi: '', tailwind: '' },
      button: 'btn',
      themeController: 'theme-controller',
    },
    {
      name: 'a daisyUI prefix',
      config: { daisyUi: 'd-' },
      button: 'd-btn',
      themeController: 'd-theme-controller',
    },
    {
      name: 'a Tailwind prefix',
      config: { tailwind: 'tw' },
      button: 'tw:btn',
      themeController: 'theme-controller',
    },
    {
      name: 'combined daisyUI and Tailwind prefixes',
      config: { daisyUi: 'dD_2-', tailwind: 'tw' },
      button: 'tw:dD_2-btn',
      themeController: 'dD_2-theme-controller',
    },
  ];

  for (const prefixCase of prefixCases) {
    it(`generates complete class tokens with ${prefixCase.name}`, () => {
      const classNames = injectClassNames(prefixCase.config);

      expect(classNames.daisyUi('btn')).toBe(prefixCase.button);
      expect(classNames.daisyUi('theme-controller')).toBe(prefixCase.themeController);
    });
  }

  it('copies prefix configuration before it enters dependency injection', () => {
    const config: { daisyUi: string; tailwind: string } = { daisyUi: 'd-', tailwind: 'tw' };
    const providers = provideZordonUi({ classPrefixes: config });
    config.daisyUi = 'changed-';
    config.tailwind = 'changed';
    TestBed.configureTestingModule({ providers: [providers] });

    expect(TestBed.inject(ZdClassNames).daisyUi('btn')).toBe('tw:d-btn');
  });

  it('rejects prefixes that cannot match the supported CSS configuration syntax', () => {
    for (const prefix of ['tw:', 'TW', 'tw-', 'tw2', 'tw prefix']) {
      expect(() => provideZordonUi({ classPrefixes: { tailwind: prefix } })).toThrowError(
        /Tailwind class prefix must be empty or lowercase ASCII letters/,
      );
    }
    expect(() =>
      provideZordonUi({ classPrefixes: { tailwind: 1 as unknown as string } }),
    ).toThrowError(/received 1/);
    for (const prefix of ['D-', '_d-', '-d-', '2d-', 'd:', 'd prefix', 'd.prefix']) {
      expect(() => provideZordonUi({ classPrefixes: { daisyUi: prefix } })).toThrowError(
        /daisyUI class prefix must be empty or start with a lowercase letter/,
      );
    }
    expect(() =>
      provideZordonUi({ classPrefixes: { daisyUi: null as unknown as string } }),
    ).toThrowError(/received null/);
  });

  it('rejects values that are not canonical unprefixed daisyUI class tokens', () => {
    const classNames = injectClassNames();

    expect(() => classNames.daisyUi('')).toThrowError(RangeError);
    expect(() => classNames.daisyUi('btn primary')).toThrowError(/one unprefixed lowercase token/);
    expect(() => classNames.daisyUi('tw:btn')).toThrowError(RangeError);
    expect(() => classNames.daisyUi('Button')).toThrowError(RangeError);
    expect(() => classNames.daisyUi('1btn')).toThrowError(RangeError);
    expect(() => classNames.daisyUi('btn_primary')).toThrowError(RangeError);
  });

  it('rejects malformed and duplicate component features before creating providers', () => {
    const feature: ZdFeature = {
      key: 'test-feature',
      providers: makeEnvironmentProviders([]),
    };

    expect(() =>
      provideZordonUi({}, { key: 'bad key', providers: feature.providers }),
    ).toThrowError(/lowercase component key/);
    expect(() =>
      provideZordonUi(
        {},
        { key: 'valid', providers: feature.providers },
        { key: 'valid', providers: feature.providers },
      ),
    ).toThrowError(/valid.*only be configured once/);
    expect(() => provideZordonUi({}, null as never)).toThrowError(/lowercase component key/);
    expect(() => provideZordonUi({}, { key: 'missing-providers' } as never)).toThrowError(
      /lowercase component key/,
    );
  });
});

describe('prefix-aware Angular host classes', () => {
  it('adds complete combined-prefix tokens without replacing consumer classes', async () => {
    await TestBed.configureTestingModule({
      imports: [TestPrefixConsumer],
      providers: [
        provideZordonUi({
          classPrefixes: { daisyUi: 'd-', tailwind: 'tw' },
        }),
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestPrefixConsumer);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList.contains('tw:d-btn')).toBe(true);
    expect(button.classList.contains('tw:d-btn-primary')).toBe(true);
    expect(button.classList.contains('consumer-class')).toBe(true);
    expect(button.classList.contains('btn')).toBe(false);
    expect(button.classList.contains('d-btn')).toBe(false);
  });
});
