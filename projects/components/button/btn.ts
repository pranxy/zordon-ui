import { Directive, ElementRef, OnInit, Renderer2, effect, input, signal } from '@angular/core';

// Define types for better type checking
export type ButtonColor =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonStyle = 'default' | 'outline' | 'ghost' | 'link';
export type ButtonShape = 'square' | 'circle';
export type ButtonWidth = 'wide' | 'block';
export type ButtonAnimation = 'none' | 'pulse';

@Directive({
    selector: '[zButton]',
    standalone: true,
})
export class ButtonDirective implements OnInit {
    color = input<ButtonColor>('primary');

    size = input<ButtonSize>('md');

    style = input<ButtonStyle>('default');
    shape = input<ButtonShape | null>(null);
    width = input<ButtonWidth | null>(null);
    animation = input<ButtonAnimation>('none');
    loading = input<boolean>(false);
    disabled = input<boolean>(false);
    glass = input<boolean>(false);
    noAnimation = input<boolean>(false);

    private baseClass = 'btn';
    private appliedClasses = signal<string[]>([]);

    constructor(private el: ElementRef, private renderer: Renderer2) {
        effect(() => {
            this.applyClasses();
        });
    }

    ngOnInit(): void {
        this.applyClasses();
    }

    private applyClasses(): void {
        // Clear previously applied classes
        // this.appliedClasses().forEach(className => {
        //     this.renderer.removeClass(this.el.nativeElement, className);
        // });

        const newClasses: string[] = [];

        // // Add base button class
        // newClasses.push(this.baseClass);

        // // Add color
        // if (this.color()) {
        //     newClasses.push(`btn-${this.color()}`);
        // }

        // Add size if not default (md)
        // if (this.size() && this.size() !== 'md') {
        //     newClasses.push(`btn-${this.size()}`);
        // }

        // // Add style if not default
        // if (this.style() && this.style() !== 'default') {
        //     newClasses.push(`btn-${this.style()}`);
        // }

        // // Add shape if specified
        // if (this.shape()) {
        //     newClasses.push(`btn-${this.shape()}`);
        // }

        // Add width if specified
        // if (this.width()) {
        //     newClasses.push(`btn-${this.width()}`);
        // }

        // // Add animation if specified and not none
        // if (this.animation() && this.animation() !== 'none') {
        //     newClasses.push(this.animation());
        // }

        // // Add loading state
        // if (this.loading()) {
        //     newClasses.push('loading');
        // }

        // // Add glass effect
        // if (this.glass()) {
        //     newClasses.push('glass');
        // }

        // // Add no-animation
        // if (this.noAnimation()) {
        //     newClasses.push('no-animation');
        // }

        // // Set disabled attribute
        // if (this.disabled()) {
        //     this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
        //     newClasses.push('btn-disabled');
        // } else {
        //     this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
        // }

        // // Apply new classes
        // newClasses.forEach(className => {
        //     this.renderer.addClass(this.el.nativeElement, className);
        // });

        this.appliedClasses.set(newClasses);
    }
}
