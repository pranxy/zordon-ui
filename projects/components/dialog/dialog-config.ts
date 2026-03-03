import { DialogConfig, DialogContainer } from '@angular/cdk/dialog';
import { BasePortalOutlet } from '@angular/cdk/portal';

/** Possible overrides for a dialog's position. */
export interface DialogPosition {
    /** Override for the dialog's top position. */
    top?: string;

    /** Override for the dialog's bottom position. */
    bottom?: string;

    /** Override for the dialog's left position. */
    left?: string;

    /** Override for the dialog's right position. */
    right?: string;
}

export class ZdDialogConfig<
    D = any,
    R = any,
    C extends DialogContainer = BasePortalOutlet,
> extends DialogConfig<D, R, C> {
    /** Function used to determine whether the dialog is allowed to close. */
   override closePredicate?: <Result = any, Component = any, Config extends DialogConfig = ZdDialogConfig>(
        result: Result | undefined,
        config: Config,
        componentInstance: Component | null
    ) => boolean;

    /** Position overrides. */
    position?: DialogPosition;

    /** Whether to wait for the opening animation to finish before trapping focus. */
    delayFocusTrap?: boolean = true;

    // /** Scroll strategy to be used for the dialog. */
    // override scrollStrategy?: ScrollStrategy;

    /**
     * Duration of the enter animation in ms.
     */
    enterAnimationDuration?: number;

    /**
     * Duration of the exit animation in ms.
     */
    exitAnimationDuration?: number;
}
