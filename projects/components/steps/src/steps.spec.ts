import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdSteps, type ZdStep, type ZdStepIconContext } from './public-api';

@Component({
  template:
    '<ng-template #icon let-item let-index="index" let-state="state"><span>{{ item.id }}:{{ index }}:{{ state }}</span></ng-template>',
})
class IconHost {
  readonly icon = viewChild.required<TemplateRef<ZdStepIconContext>>('icon');
}

describe('Steps', () => {
  afterEach(() => TestBed.resetTestingModule());
  const items: readonly ZdStep[] = [
    {
      id: 'details',
      label: 'Details',
      description: 'Your identity',
      state: 'complete',
      controls: 'details-panel',
    },
    { id: 'delivery', label: 'Delivery', state: 'upcoming', controls: 'delivery-panel' },
    { id: 'review', label: 'Review', state: 'error' },
    { id: 'payment', label: 'Payment', disabled: true },
  ];
  it('renders a named native list with visible statuses, descriptions and current/error semantics', async () => {
    const fixture = TestBed.createComponent(ZdSteps);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('ol')!.getAttribute('aria-label')).toBe('Progress');
    expect(el.querySelectorAll('li')).toHaveLength(0);
    expect(fixture.componentInstance.currentIndex()).toBe(-1);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('currentId', 'delivery');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentIndex()).toBe(1);
    expect(el.querySelectorAll('button')).toHaveLength(0);
    expect(el.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(el.querySelector('.zd-description')!.textContent!.trim()).toBe('Your identity');
    expect([...el.querySelectorAll('.zd-status')].map(item => item.textContent!.trim())).toEqual([
      'Completed',
      'Current',
      'Error',
      'Upcoming · Unavailable',
    ]);
    expect([...el.querySelectorAll('.zd-marker')].map(item => item.textContent!.trim())).toEqual([
      '✓',
      '2',
      '!',
      '4',
    ]);
    fixture.componentRef.setInput('currentId', 'review');
    await fixture.whenStable();
    expect(el.querySelector('[aria-current]')!.getAttribute('data-state')).toBe('error');
    expect(el.querySelector('[aria-current] .zd-status')!.textContent!.trim()).toBe(
      'Error · Current',
    );
    fixture.componentRef.setInput('currentId', null);
    await fixture.whenStable();
    expect(el.querySelector('[aria-current]')).toBeNull();
  });
  it('requests native activation without changing accepted state and guards current or disabled steps', async () => {
    const fixture = TestBed.createComponent(ZdSteps);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('interactive', '');
    fixture.componentRef.setInput('currentId', 'details');
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button');
    const requests: string[] = [];
    fixture.componentInstance.currentIdChange.subscribe(value => requests.push(value));
    expect(buttons[0].getAttribute('aria-controls')).toBe('details-panel');
    expect(buttons[2].hasAttribute('aria-controls')).toBe(false);
    buttons[1].click();
    await fixture.whenStable();
    expect(requests).toEqual(['delivery']);
    expect(fixture.componentInstance.currentId()).toBe('details');
    buttons[0].click();
    buttons[3].click();
    buttons[3].dispatchEvent(new MouseEvent('click'));
    expect(requests).toEqual(['delivery']);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    buttons[1].dispatchEvent(new MouseEvent('click'));
    expect([...buttons].every(button => button.disabled)).toBe(true);
    expect(requests).toEqual(['delivery']);
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('currentId', 'delivery');
    await fixture.whenStable();
    expect(el.querySelector('[aria-current] .zd-label')!.textContent!.trim()).toBe('Delivery');
  });
  it('gates forward linear progression on completion while allowing earlier/current steps', async () => {
    const fixture = TestBed.createComponent(ZdSteps);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('interactive', true);
    fixture.componentRef.setInput('linear', true);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(false);
    expect(buttons[2].disabled).toBe(true);
    fixture.componentRef.setInput('currentId', 'review');
    await fixture.whenStable();
    expect(buttons[1].disabled).toBe(false);
    expect(buttons[2].disabled).toBe(false);
    fixture.componentRef.setInput('currentId', 'details');
    fixture.componentRef.setInput(
      'items',
      items.map(item => (item.id === 'delivery' ? { ...item, state: 'complete' } : item)),
    );
    await fixture.whenStable();
    expect(buttons[2].disabled).toBe(false);
    fixture.componentRef.setInput('items', [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
    ]);
    fixture.componentRef.setInput('currentId', null);
    await fixture.whenStable();
    const fresh: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    expect(fresh[0].disabled).toBe(false);
    expect(fresh[1].disabled).toBe(true);
  });
  it('supports prefix colors, responsive orientation, icon context and localized status text', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const icon = TestBed.createComponent(IconHost);
    await icon.whenStable();
    const fixture = TestBed.createComponent(ZdSteps);
    fixture.componentRef.setInput('items', [
      ...items,
      { id: 'custom', label: 'Custom', color: 'accent', icon: icon.componentInstance.icon() },
    ]);
    fixture.componentRef.setInput('currentId', 'delivery');
    fixture.componentRef.setInput('labels', {
      complete: 'Concluído',
      current: 'Atual',
      upcoming: 'Seguinte',
      error: 'Erro',
      disabled: 'Indisponível',
    });
    fixture.componentRef.setInput('label', 'Progresso');
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.du-steps .du-step-success')).not.toBeNull();
    expect(el.querySelector('.du-step-error')).not.toBeNull();
    expect(el.querySelector('.du-step-accent .du-step-icon')!.textContent!.trim()).toBe(
      'custom:4:upcoming',
    );
    expect(el.querySelector('[aria-current] .zd-status')!.textContent!.trim()).toBe('Atual');
    for (const color of [
      'neutral',
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'error',
    ]) {
      fixture.componentRef.setInput('color', color);
      await fixture.whenStable();
      expect(el.querySelector('[aria-current]')!.classList.contains('du-step-' + color)).toBe(true);
    }
    fixture.componentRef.setInput('responsive', false);
    await fixture.whenStable();
    expect(el.querySelector('ol')!.getAttribute('tabindex')).toBe('0');
    fixture.componentRef.setInput('orientation', 'vertical');
    await fixture.whenStable();
    expect(el.getAttribute('data-orientation')).toBe('vertical');
    expect(el.querySelector('.du-steps-vertical')).not.toBeNull();
    expect(el.querySelector('ol')!.hasAttribute('tabindex')).toBe(false);
    expect(el.querySelector('ol')!.getAttribute('aria-label')).toBe('Progresso');
  });
  it('rejects ambiguous identity, missing labels and stale current IDs', () => {
    for (const invalid of [
      [{ id: '', label: 'Bad' }],
      [{ id: 'x', label: ' ' }],
      [
        { id: 'x', label: 'A' },
        { id: 'x', label: 'B' },
      ],
    ]) {
      const fixture = TestBed.createComponent(ZdSteps);
      fixture.componentRef.setInput('items', invalid);
      expect(() => fixture.detectChanges()).toThrow(/unique nonempty/);
      fixture.destroy();
    }
    const fixture = TestBed.createComponent(ZdSteps);
    fixture.componentRef.setInput('currentId', 'missing');
    expect(() => fixture.detectChanges()).toThrow(/existing step/);
  });
});
