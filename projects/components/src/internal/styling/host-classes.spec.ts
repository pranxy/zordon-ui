import { NgClass } from '@angular/common';
import { Component, computed, Directive, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { zdHostClasses } from './host-classes';

@Directive({
  selector: '[zdTestStyledHost]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
class TestStyledHost {
  readonly tone = input<'primary' | 'secondary'>('primary');

  protected readonly hostClasses = computed(() =>
    zdHostClasses('btn', this.tone() === 'primary' ? 'btn-primary' : 'btn-secondary'),
  );
}

@Component({
  selector: 'zd-test-consumer-classes',
  standalone: true,
  imports: [NgClass, TestStyledHost],
  template: `
    <button
      zdTestStyledHost
      class="consumer-static"
      [class]="consumerClasses()"
      [class.consumer-flag]="consumerFlag()"
      [ngClass]="consumerNgClasses()"
      [tone]="tone()"
    >
      Action
    </button>
  `,
})
class TestConsumerClasses {
  readonly consumerClasses = signal('consumer-first');
  readonly consumerFlag = signal(true);
  readonly consumerNgClasses = signal<Record<string, boolean>>({ 'consumer-ng-first': true });
  readonly tone = signal<'primary' | 'secondary'>('primary');
}

@Component({
  selector: 'zd-test-class-collision',
  standalone: true,
  imports: [TestStyledHost],
  template: ` <button zdTestStyledHost [class.btn-primary]="allowPrimary()">Action</button> `,
})
class TestClassCollision {
  readonly allowPrimary = signal(false);
}

@Component({
  selector: 'zd-test-ng-class-collision',
  standalone: true,
  imports: [NgClass, TestStyledHost],
  template: `
    <button zdTestStyledHost [ngClass]="consumerClasses()" [tone]="tone()">Action</button>
  `,
})
class TestNgClassCollision {
  readonly consumerClasses = signal<Record<string, boolean>>({ 'btn-primary': true });
  readonly tone = signal<'primary' | 'secondary'>('primary');
}

describe('zdHostClasses', () => {
  it('keeps complete tokens and omits absent optional tokens', () => {
    expect(zdHostClasses('btn', false, null, undefined, 'tw:d-btn-primary')).toBe(
      'btn tw:d-btn-primary',
    );
  });
});

describe('Angular host class composition', () => {
  let fixture: ComponentFixture<TestConsumerClasses>;
  let host: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestConsumerClasses] }).compileComponents();
    fixture = TestBed.createComponent(TestConsumerClasses);
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  });

  it('adds library classes without replacing static or dynamic consumer classes', () => {
    expect(host.classList.contains('btn')).toBe(true);
    expect(host.classList.contains('btn-primary')).toBe(true);
    expect(host.classList.contains('consumer-static')).toBe(true);
    expect(host.classList.contains('consumer-first')).toBe(true);
    expect(host.classList.contains('consumer-flag')).toBe(true);
    expect(host.classList.contains('consumer-ng-first')).toBe(true);
  });

  it('replaces stale library modifiers without removing consumer classes', () => {
    fixture.componentInstance.tone.set('secondary');
    fixture.detectChanges();

    expect(host.classList.contains('btn-primary')).toBe(false);
    expect(host.classList.contains('btn-secondary')).toBe(true);
    expect(host.classList.contains('btn')).toBe(true);
    expect(host.classList.contains('consumer-static')).toBe(true);
    expect(host.classList.contains('consumer-first')).toBe(true);
    expect(host.classList.contains('consumer-flag')).toBe(true);
    expect(host.classList.contains('consumer-ng-first')).toBe(true);
  });

  it('preserves library classes while consumer class bindings update', () => {
    fixture.componentInstance.consumerClasses.set('consumer-second');
    fixture.componentInstance.consumerFlag.set(false);
    fixture.componentInstance.consumerNgClasses.set({ 'consumer-ng-second': true });
    fixture.detectChanges();

    expect(host.classList.contains('consumer-first')).toBe(false);
    expect(host.classList.contains('consumer-second')).toBe(true);
    expect(host.classList.contains('consumer-flag')).toBe(false);
    expect(host.classList.contains('consumer-ng-first')).toBe(false);
    expect(host.classList.contains('consumer-ng-second')).toBe(true);
    expect(host.classList.contains('btn')).toBe(true);
    expect(host.classList.contains('btn-primary')).toBe(true);
  });
});

describe('Angular host class collision precedence', () => {
  it('lets an explicit consumer class binding suppress and restore a library token', async () => {
    await TestBed.configureTestingModule({ imports: [TestClassCollision] }).compileComponents();
    const fixture = TestBed.createComponent(TestClassCollision);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(host.classList.contains('btn')).toBe(true);
    expect(host.classList.contains('btn-primary')).toBe(false);

    fixture.componentInstance.allowPrimary.set(true);
    fixture.detectChanges();

    expect(host.classList.contains('btn')).toBe(true);
    expect(host.classList.contains('btn-primary')).toBe(true);
  });

  it('documents why overlapping NgClass tokens are not a supported override source', async () => {
    await TestBed.configureTestingModule({ imports: [TestNgClassCollision] }).compileComponents();
    const fixture = TestBed.createComponent(TestNgClassCollision);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(host.classList.contains('btn-primary')).toBe(true);

    fixture.componentInstance.consumerClasses.set({});
    fixture.detectChanges();

    expect(host.classList.contains('btn')).toBe(true);
    expect(host.classList.contains('btn-primary')).toBe(false);

    fixture.componentInstance.tone.set('secondary');
    fixture.detectChanges();
    fixture.componentInstance.tone.set('primary');
    fixture.detectChanges();

    expect(host.classList.contains('btn-primary')).toBe(true);
  });
});
