import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'cupcake' | 'corporate' | 'luxury' | 'dracula';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private themes: Theme[] = ['light', 'dark'];
    // private themes: Theme[] = ['light', 'dark', 'cupcake', 'corporate', 'luxury', 'dracula'];

    currentTheme = signal<Theme>(this.getSavedTheme());

    constructor() {
        // Initialize from storage or system preference
        this.setTheme(this.currentTheme());
    }

    setTheme(theme: Theme): void {
        this.currentTheme.set(theme);
        localStorage.setItem('theme', theme);
    }

    getThemes(): Theme[] {
        return this.themes;
    }

    private getSavedTheme(): Theme {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && this.themes.includes(savedTheme)) {
            return savedTheme;
        }
        return this.prefersDarkMode() ? 'dark' : 'light';
    }

    private prefersDarkMode(): boolean {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
