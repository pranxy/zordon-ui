import {
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    forwardRef,
    inject,
    input,
    model,
    numberAttribute,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

@Component({
    selector: 'zd-checkbox',
    imports: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZdCheckbox),
            multi: true,
        },
    ],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZdCheckbox implements ControlValueAccessor {
    private cdr = inject(ChangeDetectorRef);

    /** The native `<input type="checkbox">` element */
    _inputElement = viewChild<ElementRef<HTMLInputElement>>('input');

    /** The native `<label>` element */
    _labelElement = viewChild<ElementRef<HTMLInputElement>>('label');

    /**
     * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
     * take precedence so this may be omitted.
     */
    ariaLabel = input<string>('', { alias: 'aria-label' });

    /**
     * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
     */
    ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

    /** The 'aria-describedby' attribute is read after the element's label and field type. */
    ariaDescribedby = input<string | undefined>(undefined, { alias: 'aria-describedby' });

    /**
     * Users can specify the `aria-expanded` attribute which will be forwarded to the input element
     */
    ariaExpanded = input(undefined, { alias: 'aria-expanded', transform: booleanAttribute });

    /**
     * Users can specify the `aria-controls` attribute which will be forwarded to the input element
     */
    ariaControls = input<string | undefined>(undefined, { alias: 'aria-controls' });

    /** Users can specify the `aria-owns` attribute which will be forwarded to the input element */
    ariaOwns = input<string | undefined>(undefined, { alias: 'aria-owns' });

    private _uniqueId: string;

    /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
    id = input<string>();

    tabIndex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /** The value attribute of the native input element */
    value = model<string>();

    /** Returns the unique id for the visual hidden input. */
    inputId = computed(() => `${this.id() || this._uniqueId}-input`);

    /** Whether the checkbox is required. */
    required = input(undefined, { transform: booleanAttribute });

    /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
    labelPosition = input<'before' | 'after'>('after');

    /** Name value will be applied to the input element if present */
    name = input<string | null>(null);

    /** Whether the checkbox is checked. */
    // @Input({ transform: booleanAttribute })
    // get checked(): boolean {
    //     return this._checked;
    // }
    // set checked(value: boolean) {
    //     if (value != this.checked) {
    //         this._checked = value;
    //         this._changeDetectorRef.markForCheck();
    //     }
    // }
    // private _checked: boolean = false;

    checked = model<boolean>(false);

    /** Whether the checkbox is disabled. */
    // @Input({ transform: booleanAttribute })
    // get disabled(): boolean {
    //     return this._disabled;
    // }
    // set disabled(value: boolean) {
    //     if (value !== this.disabled) {
    //         this._disabled = value;
    //         this._changeDetectorRef.markForCheck();
    //     }
    // }
    // private _disabled: boolean = false;
    disabled = model<boolean>(false);

    /**
     * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
     * @docs-private
     */
    _onTouched: () => any = () => {};

    private _controlValueAccessorChangeFn: (value: any) => void = () => {};

    constructor() {
        this._uniqueId = `zd-checkbox-${++nextUniqueId}`;
    }

    /** Toggles the `checked` state of the checkbox. */
    toggle(): void {
        this.checked.update(prev => !prev!);
        this._controlValueAccessorChangeFn(this.checked());
    }

    protected onInputClick() {
        this.handleInputClick();
    }

    protected handleInputClick() {
        if (!this.disabled()) {
            this.checked.set(!this.checked());
            this._emitChangeEvent();
        }
    }

    protected onBlur() {
        Promise.resolve().then(() => {
            this._onTouched();
            this.cdr.markForCheck();
        });
    }

    protected onInteractionEvent(event: Event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
    }

    writeValue(value: any): void {
        this.checked.set(!!value);
    }

    registerOnChange(fn: any): void {
        this._controlValueAccessorChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    private _emitChangeEvent() {
        this._controlValueAccessorChangeFn(this.checked());
        // this.change.emit(this._createChangeEvent(this.checked));

        // Assigning the value again here is redundant, but we have to do it in case it was
        // changed inside the `change` listener which will cause the input to be out of sync.
        if (this._inputElement()) {
            this._inputElement()!.nativeElement.checked = this.checked();
        }
    }
}
