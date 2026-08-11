import {
  APP_ID,
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdIdGenerator } from './id-generator';

@Component({
  selector: 'zd-test-described-control',
  template: `
    <label [attr.for]="controlId" [id]="labelId">Account name</label>
    <input [attr.aria-describedby]="descriptionId" [id]="controlId" />
    <p [id]="descriptionId">Use the name shown on invoices.</p>
  `,
})
class TestDescribedControl {
  private readonly ids = inject(ZdIdGenerator);

  protected readonly controlId = this.ids.next('test-control');
  protected readonly labelId = this.ids.next('test-label');
  protected readonly descriptionId = this.ids.next('test-description');
}

@Component({
  imports: [TestDescribedControl],
  template: `
    <zd-test-described-control />
    <zd-test-described-control />
  `,
})
class TestIdConsumer {}

describe('ZdIdGenerator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_ID, useValue: 'ng' }] });
  });

  it('generates deterministic zero-based IDs with independent component scopes', () => {
    const ids = TestBed.inject(ZdIdGenerator);

    expect(ids.next('button')).toBe('zd-button-6e_67-0');
    expect(ids.next('description')).toBe('zd-description-6e_67-0');
    expect(ids.next('button')).toBe('zd-button-6e_67-1');
  });

  it('isolates sequences and namespaces across Angular application injectors', () => {
    const parent = TestBed.inject(EnvironmentInjector);
    const first = createEnvironmentInjector(
      [ZdIdGenerator, { provide: APP_ID, useValue: 'first-app' }],
      parent,
    );
    const second = createEnvironmentInjector(
      [ZdIdGenerator, { provide: APP_ID, useValue: 'second-app' }],
      parent,
    );

    expect(first.get(ZdIdGenerator).next('field')).toBe('zd-field-66_69_72_73_74_2d_61_70_70-0');
    expect(first.get(ZdIdGenerator).next('field')).toBe('zd-field-66_69_72_73_74_2d_61_70_70-1');
    expect(second.get(ZdIdGenerator).next('field')).toBe(
      'zd-field-73_65_63_6f_6e_64_2d_61_70_70-0',
    );

    first.destroy();
    second.destroy();
  });

  it('encodes non-ASCII application IDs without browser APIs', () => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_ID, useValue: 'café/应用' }] });

    expect(TestBed.inject(ZdIdGenerator).next('menu')).toBe('zd-menu-63_61_66_e9_2f_5e94_7528-0');
  });

  it('rejects an empty Angular application ID', () => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_ID, useValue: '' }] });

    expect(() => TestBed.inject(ZdIdGenerator)).toThrowError(/APP_ID must be a non-empty string/);
  });

  it('rejects a non-string Angular application ID', () => {
    TestBed.configureTestingModule({ providers: [{ provide: APP_ID, useValue: 1 }] });

    expect(() => TestBed.inject(ZdIdGenerator)).toThrowError(/received 1/);
  });

  it('rejects non-canonical scopes without advancing a valid sequence', () => {
    const ids = TestBed.inject(ZdIdGenerator);

    for (const scope of [
      '',
      'Button',
      'button label',
      'button_label',
      'button--label',
      '-button',
    ]) {
      expect(() => ids.next(scope)).toThrowError(/lowercase ASCII kebab-case token/);
    }
    expect(() => ids.next(1 as unknown as string)).toThrowError(/received 1/);
    expect(ids.next('button-label')).toBe('zd-button-label-6e_67-0');
  });

  it('creates unique IDs and intact accessible relationships for repeated consumers', () => {
    TestBed.configureTestingModule({ imports: [TestIdConsumer] });
    const fixture = TestBed.createComponent(TestIdConsumer);
    fixture.detectChanges();
    const controls = Array.from(
      fixture.nativeElement.querySelectorAll('zd-test-described-control'),
    ) as HTMLElement[];

    expect(controls).toHaveLength(2);
    const allIds = controls.flatMap(host =>
      Array.from(host.querySelectorAll<HTMLElement>('[id]'), element => element.id),
    );
    expect(new Set(allIds).size).toBe(allIds.length);

    for (const host of controls) {
      const input = host.querySelector('input')!;
      const label = host.querySelector('label')!;
      const description = host.querySelector('p')!;

      expect(label.htmlFor).toBe(input.id);
      expect(input.getAttribute('aria-describedby')).toBe(description.id);
    }
  });
});
