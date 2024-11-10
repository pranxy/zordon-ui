import {
    booleanAttribute,
    Component,
    computed,
    inject,
    InjectionToken,
    input,
    InputSignalWithTransform,
    Signal,
} from '@angular/core';
import { ZdButtonColor, ZdButtonConfig, ZdButtonSize, ZdButtonVariant } from './button.model';

/** Injection token that can be used to provide the default options the button component. */
export const ZD_BUTTON_CONFIG = new InjectionToken<ZdButtonConfig>('ZD_BUTTON_CONFIG');

@Component({
    selector: 'button[zdButton], a[zdButton]',
    exportAs: 'zdButton',
    host: {
        '[attr.disabled]': 'disabledAttribute()',
        '[attr.aria-disabled]': 'ariaDisabled()',
        '[class.zd-button-disabled]': 'disabled()',
        '[class.zd-button-disabled-interactive]': 'disabledInteractive()',
        '[attr.data-size]': 'size()',
        '[class]': 'color ? "zd-" + color() : ""',
    },
    template: `
        @if (loading()) {
        <span class="zd-button-loading"></span>
        }

        <ng-content select="zd-icon:not([zdIconAfter]), [zdButtonIcon]:not([zdIconAfter])" />

        <span class="zd-button-label"><ng-content /></span>

        <ng-content select="zd-icon([zdIconAfter]), [zdButtonIcon][zdIconAfter]" />
    `,
    standalone: true,
})
export class ZdButton {
    private config = inject(ZD_BUTTON_CONFIG, { optional: true });

    color = input<ZdButtonColor>(this?.config?.color ?? 'default');

    variant = input<ZdButtonVariant>(this?.config?.variant ?? 'text');

    size = input<ZdButtonSize>();

    loading: InputSignalWithTransform<boolean, unknown> = input(false, {
        transform: booleanAttribute,
    });

    disabled: InputSignalWithTransform<boolean, unknown> = input(false, {
        transform: booleanAttribute,
    });

    disabledInteractive: InputSignalWithTransform<boolean, unknown> = input(false, {
        transform: booleanAttribute,
    });

    disabledAttribute: Signal<true | null> = computed(() =>
        this.disabledInteractive() || !this.disabled() ? null : true
    );

    ariaDisabled: Signal<true | null> = computed(() => {
        // if (this.ariaDisabled != null) {
        //     return this.ariaDisabled;
        // }

        return this.disabled() && this.disabledInteractive() ? true : null;
    });

    constructor() {}
}
