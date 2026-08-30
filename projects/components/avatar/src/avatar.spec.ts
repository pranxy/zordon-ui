import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { resolveAvatarPresence, ZdAvatar, ZdAvatarGroup } from './avatar';

@Component({
  imports: [ZdAvatar, ZdAvatarGroup],
  template: `<div zdAvatar class="consumer" [placeholder]="placeholder()" [presence]="presence()">
      <div><img alt="Avery Chen" src="/avery.jpg" /></div>
    </div>
    <div zdAvatarGroup></div>`,
})
class TestAvatarHost {
  readonly placeholder = signal(false);
  readonly presence = signal<'online' | 'offline' | undefined>(undefined);
}

describe('ZdAvatar', () => {
  it('adds candidates while preserving image semantics and consumer classes', () => {
    TestBed.configureTestingModule({ imports: [TestAvatarHost] });
    const fixture = TestBed.createComponent(TestAvatarHost);
    fixture.detectChanges();
    fixture.componentInstance.placeholder.set(true);
    fixture.componentInstance.presence.set('online');
    fixture.detectChanges();
    const avatar = fixture.nativeElement.querySelector('[zdAvatar]') as HTMLElement;
    expect(avatar.classList.contains('avatar')).toBe(true);
    expect(avatar.classList.contains('avatar-placeholder')).toBe(true);
    expect(avatar.classList.contains('avatar-online')).toBe(true);
    expect(avatar.classList.contains('consumer')).toBe(true);
    expect(avatar.querySelector('img')?.alt).toBe('Avery Chen');
    expect(avatar.hasAttribute('role')).toBe(false);
  });
  it('uses complete configured prefix tokens', () => {
    TestBed.configureTestingModule({
      imports: [TestAvatarHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestAvatarHost);
    fixture.detectChanges();
    fixture.componentInstance.presence.set('offline');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[zdAvatar]').classList.contains('tw:d-avatar-offline'),
    ).toBe(true);
    expect(
      fixture.nativeElement
        .querySelector('[zdAvatarGroup]')
        .classList.contains('tw:d-avatar-group'),
    ).toBe(true);
  });
  it('rejects unknown presence candidates', () => {
    expect(() => resolveAvatarPresence('away')).toThrowError(/Avatar presence/);
  });
});
