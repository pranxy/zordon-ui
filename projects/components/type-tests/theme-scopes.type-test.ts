import { ZdTheme } from '../src/public-api';

export declare const themeScope: ZdTheme;
export const activeTheme: string | null = themeScope.theme();

// @ts-expect-error Signal inputs are consumer-bound and cannot be assigned imperatively.
themeScope.theme.set('dark');
// @ts-expect-error A cleared theme scope is represented by null, not always a string.
export const themeMustExist: string = themeScope.theme();
