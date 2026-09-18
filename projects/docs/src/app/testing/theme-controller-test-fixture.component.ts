import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ZdThemeController,
  ZdThemeToggle,
  ZdThemeRadio,
  ZdThemeSelect,
  ZdThemeButton,
  type ZdThemeChange,
} from '@pranxy/zordon-ui/theme-controller';
import { ZdToggle } from '@pranxy/zordon-ui/toggle';

@Component({
  selector: 'docs-theme-controller-test-fixture',
  imports: [ZdThemeController, ZdThemeToggle, ZdThemeRadio, ZdThemeSelect, ZdThemeButton, ZdToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './theme-controller-fixture.css',
  template: `
    <main
      [zdThemeController]="globalOptions"
      #global="zdThemeController"
      (themeChange)="last.set($event)"
      data-testid="theme-fixture"
      [dir]="direction()"
    >
      <h1>Theme Controller</h1>
      <p>Choose a theme for this page. Your preference stays in sync across tabs.</p>
      <fieldset>
        <legend>Page appearance</legend>
        <label
          ><input type="checkbox" zdThemeToggle aria-label="Dark checkbox" /> Dark checkbox</label
        >
        <label
          ><input type="checkbox" zdToggle zdThemeToggle="dark" aria-label="Dark toggle" /> Dark
          toggle</label
        >
        <div class="choices">
          <label><input type="radio" name="page-theme" zdThemeRadio="light" /> Light</label>
          <label><input type="radio" name="page-theme" zdThemeRadio="dark" /> Dark</label>
          <label><input type="radio" name="page-theme" zdThemeRadio="system" /> System</label>
        </div>
        <label
          >Theme
          <select zdThemeSelect aria-label="Page theme">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="brand/v2">Brand</option>
          </select></label
        >
        <div class="choices">
          <button zdThemeButton="light">Use light</button
          ><button zdThemeButton="dark">Use dark</button
          ><button zdThemeButton="system">Use system</button>
          <button zdThemeButton="dark" disabled>Disabled dark</button>
        </div>
      </fieldset>
      <p data-testid="theme-value">
        {{ global.state.theme() }} → {{ global.state.resolvedTheme() }}
      </p>
      <p data-testid="theme-event">Last change: {{ last()?.source ?? 'none' }}</p>
      <section
        [zdThemeController]="nestedOptions"
        #nested="zdThemeController"
        data-testid="theme-nested"
        aria-label="Independent preview"
      >
        <h2>Independent preview</h2>
        <p>This preview has its own theme and no storage.</p>
        <button zdThemeButton="dark">Preview dark</button
        ><button zdThemeButton="light">Preview light</button>
        <p>{{ nested.state.theme() }}</p>
      </section>
      <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
        Toggle direction
      </button>
    </main>
  `,
})
export class ThemeControllerTestFixtureComponent {
  readonly globalOptions = {
    themes: ['light', 'dark', 'brand/v2'],
    target: 'document' as const,
    storageKey: 'zd-theme-fixture',
  };
  readonly nestedOptions = { initial: 'light' };
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly last = signal<ZdThemeChange | null>(null);
}
