import { DOCUMENT } from '@angular/common';
import { Component, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ZdThemeController,
  ZdThemeControllerState,
  ZdThemeToggle,
  ZdThemeRadio,
  ZdThemeSelect,
  ZdThemeButton,
  type ZdThemeControllerOptions,
  type ZdThemeChange,
} from './theme-controller';

@Component({
  imports: [ZdThemeController, ZdThemeToggle, ZdThemeRadio, ZdThemeSelect, ZdThemeButton],
  template: ` <section
    [zdThemeController]="options"
    #scope="zdThemeController"
    (themeChange)="changes.push($event)"
  >
    <input type="checkbox" zdThemeToggle offTheme="light" aria-label="Dark" />
    <input type="checkbox" zdThemeToggle="missing" aria-label="Invalid" />
    <input type="radio" zdThemeRadio="dark" name="theme" aria-label="Dark radio" />
    <input type="radio" zdThemeRadio="light" name="theme" aria-label="Light radio" />
    <select zdThemeSelect aria-label="Theme">
      @for (name of names(); track name) {
        <option [value]="name">{{ name }}</option>
      }
    </select>
    <button zdThemeButton="dark">Dark</button>
    <aside [zdThemeController]="{ initial: 'light' }" #nested="zdThemeController">
      <button zdThemeButton="dark">Nested dark</button>
    </aside>
  </section>`,
})
class Host {
  options: ZdThemeControllerOptions = {};
  changes: ZdThemeChange[] = [];
  readonly names = signal(['system', 'light', 'dark', 'missing']);
  readonly scope = viewChild.required<ZdThemeController>('scope');
  readonly nested = viewChild.required<ZdThemeController>('nested');
}

function create(options: ZdThemeControllerOptions = {}) {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.options = options;
  fixture.detectChanges();
  return fixture;
}
function media(matches = false) {
  const query = new EventTarget() as EventTarget & { matches: boolean };
  query.matches = matches;
  const remove = vi.spyOn(query, 'removeEventListener');
  vi.spyOn(window, 'matchMedia').mockReturnValue(query as MediaQueryList);
  return { query, remove };
}
function storageEvent(
  key: string | null,
  newValue: string | null,
  storageArea: Storage | null = localStorage,
) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea }));
}

describe('Theme Controller scopes and controls', () => {
  beforeEach(() => {
    localStorage.clear();
    if (!window.matchMedia)
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: vi.fn(),
      });
    media();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('synchronizes native controls, keyboard-compatible button semantics and isolated scopes', () => {
    const fixture = create();
    const host = fixture.componentInstance;
    const state = host.scope().state;
    const element = fixture.nativeElement as HTMLElement;
    expect(state.ready()).toBe(true);
    expect(state.theme()).toBe('system');
    expect(element.querySelector('section')?.getAttribute('data-theme')).toBe('light');
    const [toggle, invalid, darkRadio, lightRadio] = Array.from(element.querySelectorAll('input'));
    const select = element.querySelector('select')!;
    const button = element.querySelector('button')!;
    expect(button.type).toBe('button');
    toggle.click();
    fixture.detectChanges();
    expect(state.theme()).toBe('dark');
    expect(darkRadio.checked).toBe(true);
    expect(select.value).toBe('dark');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(select.querySelector('option[value="dark"]')?.hasAttribute('selected')).toBe(true);
    expect(host.changes.at(-1)?.source).toBe('user');
    expect(host.nested().state.theme()).toBe('light');
    toggle.click();
    fixture.detectChanges();
    expect(state.theme()).toBe('light');
    darkRadio.click();
    fixture.detectChanges();
    expect(state.theme()).toBe('dark');
    lightRadio.click();
    fixture.detectChanges();
    expect(state.theme()).toBe('light');
    select.value = 'system';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(state.theme()).toBe('system');
    invalid.click();
    fixture.detectChanges();
    expect(invalid.checked).toBe(false);
    select.value = 'missing';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(select.value).toBe('system');
    button.click();
    fixture.detectChanges();
    expect(state.theme()).toBe('dark');
    expect(state.setTheme('dark')).toBe(false);
    expect(state.setTheme('unknown')).toBe(false);
    host.names.set(['dark', 'light', 'system']);
    fixture.detectChanges();
    expect(select.value).toBe('dark');
    expect(state.setTheme('light')).toBe(true);
    expect(host.changes.at(-1)?.source).toBe('api');
  });

  it('ignores disabled synthetic control events and unchecked radio changes', () => {
    const fixture = create({ initial: 'light' });
    const element = fixture.nativeElement as HTMLElement;
    for (const control of Array.from(element.querySelectorAll('input, select, button'))) {
      (control as HTMLInputElement).disabled = true;
      control.dispatchEvent(new Event(control.tagName === 'BUTTON' ? 'click' : 'change'));
    }
    const radio = element.querySelector<HTMLInputElement>('input[type="radio"]')!;
    radio.disabled = false;
    radio.checked = false;
    radio.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.scope().state.theme()).toBe('light');
  });

  it('follows live system preference only in system mode and releases listeners', () => {
    const { query, remove } = media(true);
    const fixture = create();
    const state = fixture.componentInstance.scope().state;
    expect(state.resolvedTheme()).toBe('dark');
    expect(fixture.componentInstance.changes[0].source).toBe('system');
    state.setTheme('light');
    query.matches = false;
    query.dispatchEvent(new Event('change'));
    expect(state.resolvedTheme()).toBe('light');
    state.setTheme('system');
    query.matches = true;
    query.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(state.resolvedTheme()).toBe('dark');
    fixture.destroy();
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('restores valid storage, synchronizes external writes/removal/clear without echo, and cleans up', () => {
    localStorage.setItem('theme', 'dark');
    const writes = vi.spyOn(Storage.prototype, 'setItem');
    const remove = vi.spyOn(window, 'removeEventListener');
    const fixture = create({ storageKey: 'theme' });
    const state = fixture.componentInstance.scope().state;
    expect(state.theme()).toBe('dark');
    expect(fixture.componentInstance.changes[0].source).toBe('restore');
    storageEvent('unrelated', 'light');
    storageEvent('theme', 'light', sessionStorage);
    storageEvent('theme', 'invalid');
    expect(state.theme()).toBe('dark');
    storageEvent('theme', 'light');
    expect(state.theme()).toBe('light');
    storageEvent('theme', null);
    expect(state.theme()).toBe('system');
    storageEvent('theme', 'dark');
    storageEvent(null, null);
    expect(state.theme()).toBe('system');
    expect(writes).not.toHaveBeenCalled();
    state.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    fixture.destroy();
    expect(remove).toHaveBeenCalledWith('storage', expect.any(Function));
  });

  it('survives inaccessible storage, failed writes and missing matchMedia', () => {
    vi.spyOn(window, 'matchMedia').mockRestore();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const getter = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw Error('denied');
    });
    const first = create({ storageKey: 'blocked' });
    first.componentInstance.scope().state.setTheme('dark');
    expect(first.componentInstance.scope().state.theme()).toBe('dark');
    first.destroy();
    getter.mockRestore();
    const second = create({ storageKey: 'quota' });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Error('quota');
    });
    expect(second.componentInstance.scope().state.setTheme('dark')).toBe(true);
  });

  it('validates registries and preserves arbitrary custom theme names', () => {
    const state = TestBed.runInInjectionContext(() => new ZdThemeControllerState());
    for (const options of [
      { themes: ['light', 'dark', ''] },
      { themes: ['light', 'dark', 'system'] },
      { themes: ['light', 'dark', 'dark'] },
      { themes: ['dark'] },
      { themes: ['light'] },
      { initial: 'absent' },
    ])
      expect(() => state.initialize(options, vi.fn())).toThrow(/Invalid/);
    state.initialize(
      {
        themes: ['brand/v2', 'night'],
        lightTheme: 'brand/v2',
        darkTheme: 'night',
        initial: 'brand/v2',
      },
      vi.fn(),
    );
    expect(state.themes()).toEqual(['brand/v2', 'night']);
    expect(state.resolvedTheme()).toBe('brand/v2');
    expect(state.setTheme('night')).toBe(true);
  });

  it('retains early application choices and ignores invalid saved values', () => {
    localStorage.setItem('theme', 'dark');
    const state = TestBed.runInInjectionContext(() => new ZdThemeControllerState());
    state.initialize({ storageKey: 'theme' }, vi.fn());
    state.setTheme('light');
    state.start();
    expect(state.theme()).toBe('light');
    localStorage.setItem('theme', 'invalid');
    const fixture = create({ storageKey: 'theme' });
    expect(fixture.componentInstance.scope().state.theme()).toBe('system');
  });

  it('owns and restores an explicit document boundary without overwriting later consumer changes', () => {
    document.documentElement.setAttribute('data-theme', 'corporate');
    const fixture = create({ target: 'document', initial: 'dark' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    fixture.destroy();
    expect(document.documentElement.getAttribute('data-theme')).toBe('corporate');
    const second = create({ target: 'document' });
    document.documentElement.setAttribute('data-theme', 'consumer');
    second.destroy();
    expect(document.documentElement.getAttribute('data-theme')).toBe('consumer');
  });

  it('renders deterministic server controls without browser preference or storage access', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const fixture = create({ initial: 'dark', storageKey: 'server' });
    expect(fixture.componentInstance.scope().state.ready()).toBe(false);
    expect(fixture.nativeElement.querySelector('section').getAttribute('data-theme')).toBe('dark');
    expect(
      fixture.nativeElement.querySelector('option[value="dark"]').hasAttribute('selected'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('input').hasAttribute('checked')).toBe(true);
  });

  it('tolerates a document without a browser view', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: null } }],
    });
    const state = TestBed.runInInjectionContext(() => new ZdThemeControllerState());
    state.initialize({}, vi.fn());
    state.start();
    expect(state.ready()).toBe(false);
  });
});
