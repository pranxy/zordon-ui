import { ElementRef, inject, Renderer2 } from '@angular/core';

export class ZdBaseClassHander {
    private renderer = inject(Renderer2);
    private el = inject(ElementRef);

    protected appliedClasses = new Map();

    protected updateItemClass(key: string, newValue: string) {
        const currentClass = this.getFromKey(key);

        if (currentClass) {
            this.renderer.removeClass(this.el.nativeElement, currentClass);
        }

        this.setValue(key, newValue);
        this.renderer.addClass(this.el.nativeElement, newValue);
    }

    protected removeItemClass(key: string) {
        const currentClass = this.getFromKey(key);
        if (currentClass) {
            this.renderer.removeClass(this.el.nativeElement, currentClass);
            this.appliedClasses.delete(key); // Remove the key from the map
        }
    }

    protected getFromKey(key: string): string | undefined {
        return this.appliedClasses.get(key);
    }

    protected setValue(key: string, value: string) {
        this.appliedClasses.set(key, value);
    }
}
