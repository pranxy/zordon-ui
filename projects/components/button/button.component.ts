import { Component, ViewEncapsulation, effect, input } from '@angular/core';
import { ZdBaseClassHander } from '../core';
import {
    ZdButtonAnimation,
    ZdButtonColor,
    ZdButtonShape,
    ZdButtonSize,
    ZdButtonType,
    ZdButtonWidth,
} from './button.model';
import {
    BUTTON_ANIMATION,
    BUTTON_COLOR,
    BUTTON_SHAPE,
    BUTTON_SIZE,
    BUTTON_STYLE,
    BUTTON_WIDTH,
} from './button.tokens';

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
export class ButtonDirective extends ZdBaseClassHander {
    color = input<ZdButtonColor>('primary');

    size = input<ZdButtonSize>('md');

    type = input<ZdButtonType>('default');

    shape = input<ZdButtonShape | null>(null);

    width = input<ZdButtonWidth | null>(null);

    animation = input<ZdButtonAnimation>('none');

    loading = input<boolean>(false);

    disabled = input<boolean>(false);

    glass = input<boolean>(false);

    noAnimation = input<boolean>(false);

    private colorEft = effect(() => {
        const color = this.color();
        this.updateItemClass('color', BUTTON_COLOR[color]);
    });

    private sizeEft = effect(() => {
        const size = this.size();
        this.updateItemClass('size', BUTTON_SIZE[size]);
    });

    private shapeEft = effect(() => {
        const shape = this.shape();
        // Handle null case: remove the class if shape is null
        if (!shape) {
            this.removeItemClass('shape');
        } else {
            this.updateItemClass('shape', BUTTON_SHAPE[shape]);
        }
    });

    private widthEft = effect(() => {
        const width = this.width();
        // Handle null case: remove the class if width is null
        if (!width) {
            this.removeItemClass('width');
        } else {
            this.updateItemClass('width', BUTTON_WIDTH[width]);
        }
    });

    private typeEft = effect(() => {
        const type = this.type();
        // Handle null case: remove the class if width is null
        if (!type || type === 'default') {
            this.removeItemClass('type');
        } else {
            this.updateItemClass('type', BUTTON_STYLE[type]);
        }
    });

    private animationEft = effect(() => {
        const animation = this.animation();
        // Handle 'none' case or if you have other animation types
        if (animation === 'none') {
            this.removeItemClass('animation');
        } else {
            // Ensure you have a class for your pulse animation
            this.updateItemClass('animation', BUTTON_ANIMATION[animation]);
        }
    });
}
