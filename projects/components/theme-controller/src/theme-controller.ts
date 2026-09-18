import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  AfterViewChecked,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injectable,
  Injector,
  input,
  OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';

export type ZdThemeChangeSource = 'api' | 'user' | 'restore' | 'storage' | 'system';
export interface ZdThemeChange {
  readonly theme: string;
  readonly resolvedTheme: string;
  readonly source: ZdThemeChangeSource;
}
export interface ZdThemeControllerOptions {
  /** Exact consumer-compiled names. `system` is reserved for preference following. */
  readonly themes?: readonly string[];
  readonly initial?: string;
  readonly lightTheme?: string;
  readonly darkTheme?: string;
  /** Omit for memory-only state. Give independent scopes different keys. */
  readonly storageKey?: string | null;
  /** Only one controller may own the document root. Defaults to this host. */
  readonly target?: 'host' | 'document';
}

/** State belongs to the nearest ZdThemeController, never a process-wide singleton. */
@Injectable()
export class ZdThemeControllerState {
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly selection = signal('system');
  private readonly dark = signal(false);
  private readonly registry = signal<readonly string[]>(['light', 'dark']);
  private readonly hydrated = signal(false);
  private lightTheme = 'light';
  private darkTheme = 'dark';
  private initial = 'system';
  private key: string | null = null;
  private storage: Storage | null = null;
  private changed = false;
  private notify!: (event: ZdThemeChange) => void;
  readonly theme = this.selection.asReadonly();
  readonly themes = this.registry.asReadonly();
  readonly ready = this.hydrated.asReadonly();
  readonly resolvedTheme = computed(() =>
    this.theme() === 'system' ? (this.dark() ? this.darkTheme : this.lightTheme) : this.theme(),
  );

  /** @internal Configured once by the owning directive. */
  initialize(options: ZdThemeControllerOptions, notify: (event: ZdThemeChange) => void): void {
    const themes = [...(options.themes ?? ['light', 'dark'])];
    this.lightTheme = options.lightTheme ?? 'light';
    this.darkTheme = options.darkTheme ?? 'dark';
    this.initial = options.initial ?? 'system';
    if (
      themes.some(theme => !theme || theme === 'system') ||
      new Set(themes).size !== themes.length ||
      !themes.includes(this.lightTheme) ||
      !themes.includes(this.darkTheme) ||
      (this.initial !== 'system' && !themes.includes(this.initial))
    )
      throw new Error('Invalid Theme Controller registry or initial preference.');
    this.registry.set(Object.freeze(themes));
    this.selection.set(this.initial);
    this.key = options.storageKey ?? null;
    this.notify = notify;
  }

  /** Returns false for unknown names or an unchanged selection. */
  setTheme(theme: string, source: 'api' | 'user' = 'api'): boolean {
    const accepted = this.select(theme, source);
    if (accepted) {
      this.changed = true;
      if (this.key && this.storage) {
        try {
          this.storage.setItem(this.key, theme);
        } catch {
          /* Storage is best effort. */
        }
      }
    }
    return accepted;
  }

  /** @internal Browser work starts only after the initial render/hydration. */
  start(): void {
    if (!isPlatformBrowser(this.platform)) return;
    const window = this.document.defaultView;
    if (!window) return;
    if (typeof window.matchMedia === 'function') {
      const query = window.matchMedia('(prefers-color-scheme: dark)');
      const update = () => {
        const previous = this.resolvedTheme();
        this.dark.set(query.matches);
        if (previous !== this.resolvedTheme()) this.emit('system');
      };
      update();
      query.addEventListener('change', update);
      this.destroyRef.onDestroy(() => query.removeEventListener('change', update));
    }
    if (this.key) {
      try {
        this.storage = window.localStorage;
        const stored = this.storage.getItem(this.key);
        if (!this.changed && stored !== null) this.select(stored, 'restore');
      } catch {
        /* Restricted storage leaves in-memory controls usable. */
      }
      const synchronize = (event: StorageEvent) => {
        if (event.storageArea !== this.storage || (event.key !== this.key && event.key !== null))
          return;
        this.select(event.newValue ?? this.initial, 'storage');
      };
      window.addEventListener('storage', synchronize);
      this.destroyRef.onDestroy(() => window.removeEventListener('storage', synchronize));
    }
    this.hydrated.set(true);
  }

  private select(theme: string, source: ZdThemeChangeSource): boolean {
    if ((theme !== 'system' && !this.themes().includes(theme)) || this.theme() === theme)
      return false;
    this.selection.set(theme);
    this.emit(source);
    return true;
  }
  private emit(source: ZdThemeChangeSource): void {
    this.notify({ theme: this.theme(), resolvedTheme: this.resolvedTheme(), source });
  }
}

/** An explicit, isolated theme boundary; options are captured when this scope initializes. */
@Directive({
  selector: '[zdThemeController]',
  exportAs: 'zdThemeController',
  providers: [ZdThemeControllerState],
  host: {
    '[attr.data-zd-theme-ready]': 'state.ready()',
  },
})
export class ZdThemeController implements OnInit {
  readonly options = input<ZdThemeControllerOptions>({}, { alias: 'zdThemeController' });
  readonly themeChange = output<ZdThemeChange>();
  readonly state = inject(ZdThemeControllerState);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private target!: HTMLElement;
  private previous: string | null = null;
  private written: string | null = null;
  constructor() {
    afterNextRender(() => this.state.start());
    this.destroyRef.onDestroy(() => {
      if (this.target.getAttribute('data-theme') !== this.written) return;
      if (this.previous === null) this.renderer.removeAttribute(this.target, 'data-theme');
      else this.renderer.setAttribute(this.target, 'data-theme', this.previous);
    });
  }
  ngOnInit(): void {
    this.target = this.options().target === 'document' ? this.document.documentElement : this.host;
    this.previous = this.target.getAttribute('data-theme');
    this.state.initialize(this.options(), event => this.themeChange.emit(event));
    effect(
      () => {
        const theme = this.state.resolvedTheme();
        this.renderer.setAttribute(this.target, 'data-theme', theme);
        this.written = theme;
      },
      { injector: this.injector },
    );
  }
}

/** Compose with zdCheckbox or zdToggle; this directive owns checked, not Angular Forms. */
@Directive({
  selector: 'input[type="checkbox"][zdThemeToggle]',
  host: {
    '[checked]': 'state.theme() === zdThemeToggle()',
    '[attr.checked]': 'state.theme() === zdThemeToggle() ? "" : null',
    '(change)': 'change()',
  },
})
export class ZdThemeToggle {
  readonly zdThemeToggle = input('dark', { transform: (value: string) => value || 'dark' });
  readonly offTheme = input('light');
  protected readonly state = inject(ZdThemeControllerState);
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  protected change(): void {
    if (!this.element.matches(':disabled'))
      this.state.setTheme(this.element.checked ? this.zdThemeToggle() : this.offTheme(), 'user');
    this.element.checked = this.state.theme() === this.zdThemeToggle();
  }
}

@Directive({
  selector: 'input[type="radio"][zdThemeRadio]',
  host: {
    '[checked]': 'state.theme() === zdThemeRadio()',
    '[attr.checked]': 'state.theme() === zdThemeRadio() ? "" : null',
    '[value]': 'zdThemeRadio()',
    '(change)': 'change()',
  },
})
export class ZdThemeRadio {
  readonly zdThemeRadio = input.required<string>();
  protected readonly state = inject(ZdThemeControllerState);
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  protected change(): void {
    if (this.element.checked && !this.element.matches(':disabled'))
      this.state.setTheme(this.zdThemeRadio(), 'user');
    this.element.checked = this.state.theme() === this.zdThemeRadio();
  }
}

@Directive({
  selector: 'select[zdThemeSelect]',
  host: { '[value]': 'state.theme()', '(change)': 'change()' },
})
export class ZdThemeSelect implements AfterViewChecked {
  protected readonly state = inject(ZdThemeControllerState);
  private readonly element = inject<ElementRef<HTMLSelectElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  ngAfterViewChecked(): void {
    const theme = this.state.theme();
    // Selected attributes also serialize correctly in server-rendered native options.
    for (const option of Array.from(this.element.options)) {
      if (option.value === theme) this.renderer.setAttribute(option, 'selected', '');
      else this.renderer.removeAttribute(option, 'selected');
    }
    this.element.value = theme;
  }
  protected change(): void {
    if (!this.element.matches(':disabled')) this.state.setTheme(this.element.value, 'user');
    this.element.value = this.state.theme();
  }
}

@Directive({
  selector: 'button[zdThemeButton]',
  host: {
    'type': 'button',
    '[attr.aria-pressed]': 'state.theme() === theme()',
    '(click)': 'activate()',
  },
})
export class ZdThemeButton {
  readonly theme = input.required<string>({ alias: 'zdThemeButton' });
  protected readonly state = inject(ZdThemeControllerState);
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  protected activate(): void {
    if (!this.element.matches(':disabled')) this.state.setTheme(this.theme(), 'user');
  }
}
