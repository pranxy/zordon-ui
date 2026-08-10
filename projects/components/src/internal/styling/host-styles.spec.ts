import { NgStyle } from '@angular/common';
import { Component, computed, Directive, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

type TestHostStyleValue = string | number | null | undefined;
type TestHostStyles = Readonly<Record<string, TestHostStyleValue>>;

@Directive({
  selector: '[zdTestStyleHost]',
  standalone: true,
  host: {
    '[style]': 'hostStyles()',
  },
})
class TestStyleHost {
  readonly progress = input('25%');
  readonly borderWidth = input<string | undefined>('2px');
  readonly outlineWidth = input<string | undefined>('1px');

  protected readonly hostStyles = computed<TestHostStyles>(() => ({
    '--size-field': '0.25rem',
    '--zd-test-progress': this.progress(),
    'border-width': this.borderWidth(),
    'outline-width': this.outlineWidth(),
  }));
}

@Component({
  selector: 'zd-test-consumer-styles',
  standalone: true,
  imports: [NgStyle, TestStyleHost],
  template: `
    <button
      zdTestStyleHost
      style="border-width: 7px; padding: 4px; --consumer-static: static"
      [style]="consumerStyleMap()"
      [style.--consumer-token]="consumerToken()"
      [style.--zd-test-progress]="progressOverride()"
      [style.min-width.px]="minimumWidth()"
      [ngStyle]="consumerNgStyles()"
      [progress]="libraryProgress()"
      [borderWidth]="libraryBorderWidth()"
      [outlineWidth]="libraryOutlineWidth()"
    >
      Action
    </button>
  `,
})
class TestConsumerStyles {
  readonly consumerStyleMap = signal<Record<string, string>>({
    'border-width': '5px',
    'margin-inline-start': '3px',
    'outline-width': '4px',
  });
  readonly consumerToken = signal('consumer-first');
  readonly progressOverride = signal<string | null | undefined>('75%');
  readonly minimumWidth = signal(120);
  readonly consumerNgStyles = signal<Record<string, string>>({ opacity: '0.75' });
  readonly libraryProgress = signal('25%');
  readonly libraryBorderWidth = signal<string | undefined>('2px');
  readonly libraryOutlineWidth = signal<string | undefined>('1px');
}

@Component({
  selector: 'zd-test-ng-style-collision',
  standalone: true,
  imports: [NgStyle, TestStyleHost],
  template: `
    <button zdTestStyleHost [ngStyle]="consumerStyles()" [progress]="libraryProgress()">
      Action
    </button>
  `,
})
class TestNgStyleCollision {
  readonly consumerStyles = signal<Record<string, string>>({ '--zd-test-progress': '80%' });
  readonly libraryProgress = signal('25%');
}

describe('Angular per-instance style composition', () => {
  let fixture: ComponentFixture<TestConsumerStyles>;
  let host: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestConsumerStyles] }).compileComponents();
    fixture = TestBed.createComponent(TestConsumerStyles);
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  });

  it('combines library styles with static and dynamic consumer sources', () => {
    expect(host.style.getPropertyValue('--size-field')).toBe('0.25rem');
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('75%');
    expect(host.style.getPropertyValue('--consumer-static')).toBe('static');
    expect(host.style.getPropertyValue('--consumer-token')).toBe('consumer-first');
    expect(host.style.borderWidth).toBe('5px');
    expect(host.style.outlineWidth).toBe('4px');
    expect(host.style.padding).toBe('4px');
    expect(host.style.marginInlineStart).toBe('3px');
    expect(host.style.minWidth).toBe('120px');
    expect(host.style.opacity).toBe('0.75');
  });

  it('preserves consumer styles while library-owned values update', () => {
    fixture.componentInstance.libraryProgress.set('50%');
    fixture.componentInstance.libraryBorderWidth.set(undefined);
    fixture.detectChanges();

    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('75%');
    expect(host.style.borderWidth).toBe('5px');
    expect(host.style.outlineWidth).toBe('4px');
    expect(host.style.padding).toBe('4px');
    expect(host.style.getPropertyValue('--consumer-token')).toBe('consumer-first');
    expect(host.style.marginInlineStart).toBe('3px');
    expect(host.style.opacity).toBe('0.75');
  });

  it('preserves library styles while consumer sources update', () => {
    fixture.componentInstance.consumerStyleMap.set({
      'border-width': '6px',
      'max-width': '20rem',
    });
    fixture.componentInstance.consumerToken.set('consumer-second');
    fixture.componentInstance.minimumWidth.set(160);
    fixture.componentInstance.consumerNgStyles.set({ 'font-weight': '600' });
    fixture.detectChanges();

    expect(host.style.getPropertyValue('--size-field')).toBe('0.25rem');
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('75%');
    expect(host.style.borderWidth).toBe('6px');
    expect(host.style.outlineWidth).toBe('1px');
    expect(host.style.marginInlineStart).toBe('');
    expect(host.style.maxWidth).toBe('20rem');
    expect(host.style.getPropertyValue('--consumer-token')).toBe('consumer-second');
    expect(host.style.minWidth).toBe('160px');
    expect(host.style.opacity).toBe('');
    expect(host.style.fontWeight).toBe('600');
  });

  it('reveals the latest host value only when an explicit override becomes undefined', () => {
    fixture.componentInstance.libraryProgress.set('50%');
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('75%');

    fixture.componentInstance.progressOverride.set(undefined);
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('50%');

    fixture.componentInstance.progressOverride.set(null);
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('');

    fixture.componentInstance.progressOverride.set(undefined);
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('50%');

    fixture.componentInstance.progressOverride.set('');
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('');
  });

  it('restores the next owned source as style-map and host keys disappear', () => {
    fixture.componentInstance.consumerStyleMap.set({ 'margin-inline-start': '3px' });
    fixture.detectChanges();
    expect(host.style.borderWidth).toBe('7px');
    expect(host.style.outlineWidth).toBe('1px');

    fixture.componentInstance.libraryBorderWidth.set(undefined);
    fixture.componentInstance.libraryOutlineWidth.set(undefined);
    fixture.detectChanges();
    expect(host.style.borderWidth).toBe('7px');
    expect(host.style.outlineWidth).toBe('');
  });
});

describe('Angular NgStyle collision boundary', () => {
  it('documents why overlapping NgStyle properties are not a supported override source', async () => {
    await TestBed.configureTestingModule({ imports: [TestNgStyleCollision] }).compileComponents();
    const fixture = TestBed.createComponent(TestNgStyleCollision);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('25%');

    fixture.componentInstance.consumerStyles.set({});
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('');

    fixture.componentInstance.libraryProgress.set('50%');
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--zd-test-progress')).toBe('50%');
  });
});
