import {
    Component,
    ElementRef,
    Renderer2,
    ViewEncapsulation,
    effect,
    inject,
    input,
} from '@angular/core';

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

const BUTTON_COLOR: Record<ButtonColor, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    neutral: 'btn-neutral',
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
};

const BUTTON_SHAPE: Record<ButtonShape, string> = {
    square: 'btn-square',
    circle: 'btn-circle',
};

const BUTTON_WIDTH: Record<ButtonWidth, string> = {
    wide: 'btn-wide',
    block: 'btn-block',
};

// You might also consider a constant for animation if you plan to
// manage animation classes similarly.
const BUTTON_ANIMATION: Record<ButtonAnimation, string> = {
    none: '', // Or a class to explicitly remove animation if needed
    pulse: 'btn-pulse', // Replace with the actual class name
};

@Component({
    selector: '[zButton]',
    standalone: true,
    host: {
        class: 'btn',
    },
    template: `
        @if (loading()) {
        <span class="zd-button-loading"></span>
        }

        <ng-content select="zd-icon:not([zdIconAfter]), [zdButtonIcon]:not([zdIconAfter])" />

        <span class="zd-button-label"><ng-content /></span>

        <ng-content select="zd-icon([zdIconAfter]), [zdButtonIcon][zdIconAfter]" />
    `,
    encapsulation: ViewEncapsulation.None,
})
export class ButtonDirective {
    private renderer = inject(Renderer2);
    private el = inject(ElementRef);

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

    appliedClasses = new Map();

    private colorEft = effect(() => {
        const color = this.color();
        this.#updateItemClass('color', BUTTON_COLOR[color]);
    });

    private sizeEft = effect(() => {
        const size = this.size();
        this.#updateItemClass('size', BUTTON_SIZE[size]);
    });

    private shapeEft = effect(() => {
        const shape = this.shape();
        // Handle null case: remove the class if shape is null
        if (!shape) {
            this.#removeItemClass('shape');
        } else {
            this.#updateItemClass('shape', BUTTON_SHAPE[shape]);
        }
    });

    private widthEft = effect(() => {
        const width = this.width();
        // Handle null case: remove the class if width is null
        if (!width) {
            this.#removeItemClass('width');
        } else {
            this.#updateItemClass('width', BUTTON_WIDTH[width]);
        }
    });

    private animationEft = effect(() => {
        const animation = this.animation();
        // Handle 'none' case or if you have other animation types
        if (animation === 'none') {
            this.#removeItemClass('animation');
        } else {
            // Ensure you have a class for your pulse animation
            this.#updateItemClass('animation', BUTTON_ANIMATION[animation]);
        }
    });

    #updateItemClass(key: string, newValue: string) {
        const currentClass = this.#getFromKey(key);

        if (currentClass) {
            this.renderer.removeClass(this.el.nativeElement, currentClass);
        }

        this.#setValue(key, newValue);
        this.renderer.addClass(this.el.nativeElement, newValue);
    }

    #removeItemClass(key: string) {
        const currentClass = this.#getFromKey(key);
        if (currentClass) {
            this.renderer.removeClass(this.el.nativeElement, currentClass);
            this.appliedClasses.delete(key); // Remove the key from the map
        }
    }

    #getFromKey(key: string): string | undefined {
        return this.appliedClasses.get(key);
    }

    #setValue(key: string, value: string) {
        this.appliedClasses.set(key, value);
    }
}
