import {
  ZdThemeControllerState,
  type ZdThemeControllerOptions,
  type ZdThemeChange,
} from '@pranxy/zordon-ui/theme-controller';
const options: ZdThemeControllerOptions = {
  themes: ['brand/v2', 'night'],
  lightTheme: 'brand/v2',
  darkTheme: 'night',
  initial: 'system',
  target: 'host',
};
void options;
declare const state: ZdThemeControllerState;
const accepted: boolean = state.setTheme('brand/v2');
void accepted;
// @ts-expect-error Selection is read-only.
state.theme.set('dark');
// @ts-expect-error Sources from storage are internal.
state.setTheme('dark', 'storage');
// @ts-expect-error Target must be an explicit supported boundary.
const invalid: ZdThemeControllerOptions = { target: 'body' };
void invalid;
declare const event: ZdThemeChange;
const name: string = event.resolvedTheme;
void name;
