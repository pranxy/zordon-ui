import { ChangeDetectionStrategy, Component, Directive, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Directive({
  selector: '[zdTestTitle]',
  host: {
    class: 'test-title-part',
  },
})
class TestTitlePart {}

@Directive({
  selector: '[zdTestAction]',
  host: {
    class: 'test-action-part',
  },
})
class TestActionPart {}

@Component({
  selector: 'zd-test-compound',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-slot="title">
      <ng-content select="[zdTestTitle]">Default title</ng-content>
    </div>
    <div data-slot="caption"><ng-content select="[zdTestCaption]" /></div>
    <div data-slot="body"><ng-content /></div>
    <div data-slot="actions"><ng-content select="[zdTestAction]" /></div>
  `,
})
class TestCompound {}

@Component({
  imports: [TestActionPart, TestCompound, TestTitlePart],
  template: `
    <zd-test-compound>
      <button
        zdTestAction
        data-action="first"
        aria-label="Save account"
        (click)="actionClicks.update(count => count + 1)"
      >
        First
      </button>
      <p data-body>Body</p>
      <p zdTestCaption data-caption>Caption</p>
      <h2
        zdTestTitle
        class="consumer-title"
        data-owner="consumer"
        [style.--consumer-accent]="accent()"
      >
        Account <em>settings</em>
      </h2>
      <a zdTestAction data-action="second" href="#second">Second</a>
    </zd-test-compound>
  `,
})
class TestConsumer {
  readonly accent = signal('purple');
  readonly actionClicks = signal(0);
}

@Component({
  imports: [TestCompound],
  template: ` <zd-test-compound><p data-body>Body only</p></zd-test-compound> `,
})
class TestFallbackConsumer {}

@Component({
  imports: [TestCompound],
  template: `
    <zd-test-compound>
      <h2 ngProjectAs="[zdTestTitle]" data-project-as>Forwarded title</h2>
    </zd-test-compound>
  `,
})
class TestProjectAsConsumer {}

@Component({
  imports: [TestCompound],
  template: `
    <zd-test-compound>
      <h2 [attr.zdTestTitle]="titleMarkerPresent() ? '' : null" data-bound-marker>Bound marker</h2>
    </zd-test-compound>
  `,
})
class TestBoundMarkerConsumer {
  readonly titleMarkerPresent = signal(false);
}

@Component({
  selector: 'zd-test-forwarder',
  imports: [TestCompound],
  template: `
    <zd-test-compound>
      <ng-container ngProjectAs="[zdTestCaption]">
        <ng-content select="[zdTestOuterCaption]" />
      </ng-container>
      <ng-content />
    </zd-test-compound>
  `,
})
class TestForwarder {}

@Component({
  imports: [TestForwarder],
  template: `
    <zd-test-forwarder>
      <p data-forwarded-body>Forwarded body</p>
      <p zdTestOuterCaption data-forwarded-caption>Forwarded caption</p>
    </zd-test-forwarder>
  `,
})
class TestForwardingConsumer {}

describe('named part projection convention', () => {
  it('renders slots in component order and repeated parts in consumer order', async () => {
    await TestBed.configureTestingModule({ imports: [TestConsumer] }).compileComponents();
    const fixture = TestBed.createComponent(TestConsumer);
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector('zd-test-compound') as HTMLElement;
    const slots = Array.from(root.querySelectorAll('[data-slot]'));

    expect(slots.map(slot => slot.getAttribute('data-slot'))).toEqual([
      'title',
      'caption',
      'body',
      'actions',
    ]);
    expect(root.querySelector('[data-slot="title"]')?.textContent?.trim()).toBe('Account settings');
    expect(root.querySelector('[data-slot="caption"]')?.textContent?.trim()).toBe('Caption');
    expect(root.querySelector('[data-slot="body"]')?.textContent?.trim()).toBe('Body');
    expect(
      Array.from(root.querySelectorAll('[data-slot="actions"] [data-action]')).map(action =>
        action.getAttribute('data-action'),
      ),
    ).toEqual(['first', 'second']);
  });

  it('keeps projected elements, content, and consumer-owned attributes customizable', async () => {
    await TestBed.configureTestingModule({ imports: [TestConsumer] }).compileComponents();
    const fixture = TestBed.createComponent(TestConsumer);
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('[data-slot="title"] h2') as HTMLElement;

    expect(title.classList.contains('test-title-part')).toBe(true);
    expect(title.classList.contains('consumer-title')).toBe(true);
    expect(title.getAttribute('data-owner')).toBe('consumer');
    expect(title.style.getPropertyValue('--consumer-accent')).toBe('purple');
    expect(title.querySelector('em')?.textContent).toBe('settings');

    fixture.componentInstance.accent.set('teal');
    fixture.detectChanges();

    expect(title.style.getPropertyValue('--consumer-accent')).toBe('teal');

    const action = fixture.nativeElement.querySelector(
      '[data-action="first"]',
    ) as HTMLButtonElement;
    expect(action.getAttribute('aria-label')).toBe('Save account');
    action.click();
    expect(fixture.componentInstance.actionClicks()).toBe(1);
  });

  it('uses fallback content only when a named part has no projected nodes', async () => {
    await TestBed.configureTestingModule({ imports: [TestFallbackConsumer] }).compileComponents();
    const fixture = TestBed.createComponent(TestFallbackConsumer);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-slot="title"]').textContent.trim()).toBe(
      'Default title',
    );
    expect(fixture.nativeElement.querySelector('[data-slot="body"]').textContent.trim()).toBe(
      'Body only',
    );
  });

  it('treats ngProjectAs as static projection metadata, not as directive behavior', async () => {
    await TestBed.configureTestingModule({ imports: [TestProjectAsConsumer] }).compileComponents();
    const fixture = TestBed.createComponent(TestProjectAsConsumer);
    fixture.detectChanges();
    const projected = fixture.nativeElement.querySelector('[data-project-as]') as HTMLElement;

    expect(projected.parentElement?.getAttribute('data-slot')).toBe('title');
    expect(projected.classList.contains('test-title-part')).toBe(false);
  });

  it('does not re-slot content when a bound marker attribute changes at runtime', async () => {
    await TestBed.configureTestingModule({
      imports: [TestBoundMarkerConsumer],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestBoundMarkerConsumer);
    fixture.detectChanges();
    const projected = fixture.nativeElement.querySelector('[data-bound-marker]') as HTMLElement;

    expect(projected.hasAttribute('zdtesttitle')).toBe(false);
    expect(projected.parentElement?.getAttribute('data-slot')).toBe('body');
    expect(projected.classList.contains('test-title-part')).toBe(false);

    fixture.componentInstance.titleMarkerPresent.set(true);
    fixture.detectChanges();

    expect(projected.hasAttribute('zdtesttitle')).toBe(true);
    expect(projected.parentElement?.getAttribute('data-slot')).toBe('body');
  });

  it('forwards named and default content explicitly across a component boundary', async () => {
    await TestBed.configureTestingModule({ imports: [TestForwardingConsumer] }).compileComponents();
    const fixture = TestBed.createComponent(TestForwardingConsumer);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector('zd-test-compound') as HTMLElement;

    expect(inner.querySelector('[data-slot="caption"] [data-forwarded-caption]')?.textContent).toBe(
      'Forwarded caption',
    );
    expect(inner.querySelector('[data-slot="body"] [data-forwarded-body]')?.textContent).toBe(
      'Forwarded body',
    );
    expect(inner.querySelectorAll('[data-forwarded-caption]')).toHaveLength(1);
    expect(inner.querySelectorAll('[data-forwarded-body]')).toHaveLength(1);
  });
});
