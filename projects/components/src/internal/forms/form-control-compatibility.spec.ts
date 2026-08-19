import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { ControlValueAccessor, ValidationErrors } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'zd-test-value-accessor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestValueAccessor),
      multi: true,
    },
  ],
  template: `
    <input
      [disabled]="disabled()"
      [value]="value()"
      (blur)="reportTouched()"
      (input)="reportInput($event)"
    />
  `,
})
class TestValueAccessor implements ControlValueAccessor {
  readonly value = signal('');
  readonly disabled = signal(false);
  readonly writtenValues: unknown[] = [];
  readonly disabledStates: boolean[] = [];

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.writtenValues.push(value);
    this.value.set(value == null ? '' : String(value));
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledStates.push(disabled);
    this.disabled.set(disabled);
  }

  reportInput(event: Event): void {
    if (this.disabled()) return;

    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  reportTouched(): void {
    if (!this.disabled()) this.onTouched();
  }
}

@Component({
  selector: 'zd-test-reactive-form-host',
  standalone: true,
  imports: [ReactiveFormsModule, TestValueAccessor],
  template: `
    <form [formGroup]="form">
      <zd-test-value-accessor formControlName="value" />
      <button type="submit">Submit</button>
    </form>
  `,
})
class TestReactiveFormHost {
  control = new FormControl<string | null>('initial');
  form = new FormGroup({ value: this.control });

  use(control: FormControl<string | null>): void {
    this.control = control;
    this.form = new FormGroup({ value: control });
  }
}

function inputElement(fixture: ComponentFixture<TestReactiveFormHost>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function accessor(fixture: ComponentFixture<TestReactiveFormHost>): TestValueAccessor {
  return fixture.debugElement.query(By.directive(TestValueAccessor)).componentInstance;
}

function enterValue(fixture: ComponentFixture<TestReactiveFormHost>, value: string): void {
  const input = inputElement(fixture);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  fixture.detectChanges();
}

describe('Angular Forms value-accessor compatibility', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestReactiveFormHost] });
  });

  it('keeps programmatic writes separate from user change and touch callbacks', () => {
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    fixture.detectChanges();
    const control = fixture.componentInstance.control;
    const probe = accessor(fixture);
    const values: Array<string | null> = [];
    control.valueChanges.subscribe(value => values.push(value));

    expect(probe.writtenValues).toEqual(['initial']);
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);

    control.setValue('programmatic');
    fixture.detectChanges();

    expect(inputElement(fixture).value).toBe('programmatic');
    expect(probe.writtenValues).toEqual(['initial', 'programmatic']);
    expect(values).toEqual(['programmatic']);
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);

    enterValue(fixture, 'user');

    expect(control.value).toBe('user');
    expect(values).toEqual(['programmatic', 'user']);
    expect(control.dirty).toBe(true);
    expect(control.untouched).toBe(true);

    inputElement(fixture).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.touched).toBe(true);
    expect(values).toEqual(['programmatic', 'user']);
  });

  it('normalizes nullable reset values and reset-disabled state through Angular Forms', () => {
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    fixture.detectChanges();
    const control = fixture.componentInstance.control;

    enterValue(fixture, 'changed');
    inputElement(fixture).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);

    control.reset();
    fixture.detectChanges();

    expect(control.value).toBeNull();
    expect(inputElement(fixture).value).toBe('');
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);

    control.reset({ value: 'locked', disabled: true });
    fixture.detectChanges();

    expect(control.value).toBe('locked');
    expect(control.disabled).toBe(true);
    expect(inputElement(fixture).value).toBe('locked');
    expect(inputElement(fixture).disabled).toBe(true);
  });

  it('lets Angular commit change-on-blur without a second component model', () => {
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    const control = new FormControl('initial', { nonNullable: true, updateOn: 'blur' });
    fixture.componentInstance.use(control);
    fixture.detectChanges();

    enterValue(fixture, 'staged');

    expect(control.value).toBe('initial');
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    expect(inputElement(fixture).value).toBe('staged');

    inputElement(fixture).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.value).toBe('staged');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('lets the form own submit-time commits, submitted state, and reset', () => {
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    const control = new FormControl('initial', { nonNullable: true, updateOn: 'submit' });
    fixture.componentInstance.use(control);
    fixture.detectChanges();

    enterValue(fixture, 'submitted');
    inputElement(fixture).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.value).toBe('initial');
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(control.value).toBe('submitted');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    expect(form.classList).toContain('ng-submitted');

    const formDirective = fixture.debugElement
      .query(By.directive(FormGroupDirective))
      .injector.get(FormGroupDirective);
    formDirective.resetForm({ value: 'reset' });
    fixture.detectChanges();

    expect(control.value).toBe('reset');
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    expect(form.classList).not.toContain('ng-submitted');
    expect(inputElement(fixture).value).toBe('reset');
  });

  it('treats Angular Forms as the enabled and disabled state owner', () => {
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    fixture.detectChanges();
    const control = fixture.componentInstance.control;
    const probe = accessor(fixture);

    expect(probe.disabledStates).toEqual([false]);
    expect(inputElement(fixture).disabled).toBe(false);

    control.disable();
    fixture.detectChanges();

    expect(probe.disabledStates).toEqual([false, true]);
    expect(inputElement(fixture).disabled).toBe(true);
    enterValue(fixture, 'ignored');
    expect(control.value).toBe('initial');

    control.enable();
    fixture.detectChanges();

    expect(probe.disabledStates).toEqual([false, true, false]);
    expect(inputElement(fixture).disabled).toBe(false);
  });

  it('mirrors dirty, touched, pending, valid, and invalid state without accessor-owned validity', async () => {
    const resolutions = new Map<string, (result: ValidationErrors | null) => void>();
    const asyncValidator = (control: { value: unknown }) =>
      new Promise<ValidationErrors | null>(resolve => {
        resolutions.set(String(control.value), resolve);
      });
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    const control = new FormControl('initial', {
      validators: [Validators.required],
      asyncValidators: [asyncValidator],
    });
    fixture.componentInstance.use(control);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('zd-test-value-accessor') as HTMLElement;

    expect(control.pending).toBe(true);
    expect(host.classList).toContain('ng-pending');

    resolutions.get('initial')?.(null);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(control.valid).toBe(true);
    expect(host.classList).toContain('ng-valid');

    enterValue(fixture, 'first');
    enterValue(fixture, 'second');
    resolutions.get('first')?.({ stale: true });
    await Promise.resolve();
    fixture.detectChanges();

    expect(control.pending).toBe(true);
    expect(control.errors).toBeNull();

    resolutions.get('second')?.({ unavailable: true });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(control.invalid).toBe(true);
    expect(control.errors).toEqual({ unavailable: true });

    enterValue(fixture, '');
    inputElement(fixture).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(control.invalid).toBe(true);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    expect(host.classList).toContain('ng-invalid');
    expect(host.classList).toContain('ng-dirty');
    expect(host.classList).toContain('ng-touched');
  });

  it('unregisters model callbacks when the accessor is destroyed', () => {
    const fixture = TestBed.createComponent(TestReactiveFormHost);
    fixture.detectChanges();
    const control = fixture.componentInstance.control;
    const probe = accessor(fixture);

    expect(probe.writtenValues).toEqual(['initial']);
    fixture.destroy();
    control.setValue('after-destroy');

    expect(probe.writtenValues).toEqual(['initial']);
  });
});
