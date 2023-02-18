import { Directive, HostBinding, HostListener, Inject, Input, Optional, Self, } from '@angular/core';
import { FormControlName, NgModel } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "../../input-group/input-group.common";
import * as i2 from "@angular/forms";
const nativeValidationAttributes = [
    'required',
    'pattern',
    'minlength',
    'maxlength',
    'min',
    'max',
    'step',
];
export var IgxInputState;
(function (IgxInputState) {
    IgxInputState[IgxInputState["INITIAL"] = 0] = "INITIAL";
    IgxInputState[IgxInputState["VALID"] = 1] = "VALID";
    IgxInputState[IgxInputState["INVALID"] = 2] = "INVALID";
})(IgxInputState || (IgxInputState = {}));
/**
 * The `igxInput` directive creates single- or multiline text elements, covering common scenarios when dealing with form inputs.
 *
 * @igxModule IgxInputGroupModule
 *
 * @igxParent Data Entry & Display
 *
 * @igxTheme igx-input-group-theme
 *
 * @igxKeywords input, input group, form, field, validation
 *
 * @igxGroup presentation
 *
 * @example
 * ```html
 * <input-group>
 *  <label for="address">Address</label>
 *  <input igxInput name="address" type="text" [(ngModel)]="customer.address">
 * </input-group>
 * ```
 */
export class IgxInputDirective {
    constructor(inputGroup, ngModel, formControl, element, cdr, renderer) {
        this.inputGroup = inputGroup;
        this.ngModel = ngModel;
        this.formControl = formControl;
        this.element = element;
        this.cdr = cdr;
        this.renderer = renderer;
        /**
         * Sets/gets whether the `"igx-input-group__input"` class is added to the host element.
         * Default value is `false`.
         *
         * @example
         * ```typescript
         * this.igxInput.isInput = true;
         * ```
         *
         * @example
         * ```typescript
         * let isCLassAdded = this.igxInput.isInput;
         * ```
         */
        this.isInput = false;
        /**
         * Sets/gets whether the `"class.igx-input-group__textarea"` class is added to the host element.
         * Default value is `false`.
         *
         * @example
         * ```typescript
         * this.igxInput.isTextArea = true;
         * ```
         *
         * @example
         * ```typescript
         * let isCLassAdded = this.igxInput.isTextArea;
         * ```
         */
        this.isTextArea = false;
        this._valid = IgxInputState.INITIAL;
        this._disabled = false;
    }
    get ngControl() {
        return this.ngModel ? this.ngModel : this.formControl;
    }
    /**
     * Sets the `value` property.
     *
     * @example
     * ```html
     * <input-group>
     *  <input igxInput #igxInput [value]="'IgxInput Value'">
     * </input-group>
     * ```
     */
    set value(value) {
        this.nativeElement.value = value ?? '';
        this.updateValidityState();
    }
    /**
     * Gets the `value` property.
     *
     * @example
     * ```typescript
     * @ViewChild('igxInput', {read: IgxInputDirective})
     *  public igxInput: IgxInputDirective;
     * let inputValue = this.igxInput.value;
     * ```
     */
    get value() {
        return this.nativeElement.value;
    }
    /**
     * Sets the `disabled` property.
     *
     * @example
     * ```html
     * <input-group>
     *  <input igxInput #igxInput [disabled]="true">
     * </input-group>
     * ```
     */
    set disabled(value) {
        this._disabled = this.inputGroup.disabled = !!((value === '') || value);
        if (this.focused && this._disabled) {
            // Browser focus may not fire in good time and mess with change detection, adjust here in advance:
            this.inputGroup.isFocused = false;
        }
    }
    /**
     * Gets the `disabled` property
     *
     * @example
     * ```typescript
     * @ViewChild('igxInput', {read: IgxInputDirective})
     *  public igxInput: IgxInputDirective;
     * let isDisabled = this.igxInput.disabled;
     * ```
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * Sets the `required` property.
     *
     * @example
     * ```html
     * <input-group>
     *  <input igxInput #igxInput required>
     * </input-group>
     * ```
     */
    set required(value) {
        this.nativeElement.required = this.inputGroup.isRequired = (value === '') || value;
    }
    /**
     * Gets whether the igxInput is required.
     *
     * @example
     * ```typescript
     * let isRequired = this.igxInput.required;
     * ```
     */
    get required() {
        let validation;
        if (this.ngControl && (this.ngControl.control.validator || this.ngControl.control.asyncValidator)) {
            validation = this.ngControl.control.validator({});
        }
        return validation && validation.required || this.nativeElement.hasAttribute('required');
    }
    /**
     * @hidden
     * @internal
     */
    onFocus() {
        this.inputGroup.isFocused = true;
    }
    /**
     * @param event The event to invoke the handler
     *
     * @hidden
     * @internal
     */
    onBlur() {
        this.inputGroup.isFocused = false;
        this.updateValidityState();
    }
    /** @hidden @internal */
    onInput() {
        this.checkNativeValidity();
    }
    /** @hidden @internal */
    change(event) {
        if (this.type === 'file') {
            const fileList = event.target
                .files;
            const fileArray = [];
            if (fileList) {
                for (const file of Array.from(fileList)) {
                    fileArray.push(file);
                }
            }
            this._fileNames = (fileArray || []).map((f) => f.name).join(', ');
            if (this.required && fileList?.length > 0) {
                this._valid = IgxInputState.INITIAL;
            }
        }
    }
    /** @hidden @internal */
    get fileNames() {
        return this._fileNames;
    }
    /** @hidden @internal */
    clear() {
        this.ngControl?.control?.setValue('');
        this.nativeElement.value = null;
        this._fileNames = '';
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        this.inputGroup.hasPlaceholder = this.nativeElement.hasAttribute('placeholder');
        if (this.ngControl && this.ngControl.disabled !== null) {
            this.disabled = this.ngControl.disabled;
        }
        this.inputGroup.disabled =
            this.inputGroup.disabled ||
                this.nativeElement.hasAttribute('disabled');
        this.inputGroup.isRequired = this.nativeElement.hasAttribute('required');
        // Make sure we do not invalidate the input on init
        if (!this.ngControl) {
            this._valid = IgxInputState.INITIAL;
        }
        // Also check the control's validators for required
        if (this.required && !this.inputGroup.isRequired) {
            this.inputGroup.isRequired = this.required;
        }
        this.renderer.setAttribute(this.nativeElement, 'aria-required', this.required.toString());
        const elTag = this.nativeElement.tagName.toLowerCase();
        if (elTag === 'textarea') {
            this.isTextArea = true;
        }
        else {
            this.isInput = true;
        }
        if (this.ngControl) {
            this._statusChanges$ = this.ngControl.statusChanges.subscribe(this.onStatusChanged.bind(this));
        }
        this.cdr.detectChanges();
    }
    /** @hidden @internal */
    ngOnDestroy() {
        if (this._statusChanges$) {
            this._statusChanges$.unsubscribe();
        }
    }
    /**
     * Sets a focus on the igxInput.
     *
     * @example
     * ```typescript
     * this.igxInput.focus();
     * ```
     */
    focus() {
        this.nativeElement.focus();
    }
    /**
     * Gets the `nativeElement` of the igxInput.
     *
     * @example
     * ```typescript
     * let igxInputNativeElement = this.igxInput.nativeElement;
     * ```
     */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /** @hidden @internal */
    onStatusChanged() {
        // Enable/Disable control based on ngControl #7086
        if (this.disabled !== this.ngControl.disabled) {
            this.disabled = this.ngControl.disabled;
        }
        this.updateValidityState();
    }
    /**
     * @hidden
     * @internal
     */
    updateValidityState() {
        if (this.ngControl) {
            if (this.ngControl.control.validator || this.ngControl.control.asyncValidator) {
                // Run the validation with empty object to check if required is enabled.
                const error = this.ngControl.control.validator({});
                this.inputGroup.isRequired = error && error.required;
                if (!this.disabled && (this.ngControl.control.touched || this.ngControl.control.dirty)) {
                    // the control is not disabled and is touched or dirty
                    this._valid = this.ngControl.invalid ?
                        IgxInputState.INVALID : this.focused ? IgxInputState.VALID :
                        IgxInputState.INITIAL;
                }
                else {
                    //  if control is untouched, pristine, or disabled its state is initial. This is when user did not interact
                    //  with the input or when form/control is reset
                    this._valid = IgxInputState.INITIAL;
                }
            }
            else {
                // If validator is dynamically cleared, reset label's required class(asterisk) and IgxInputState #10010
                this._valid = IgxInputState.INITIAL;
                this.inputGroup.isRequired = false;
            }
            this.renderer.setAttribute(this.nativeElement, 'aria-required', this.required.toString());
            const ariaInvalid = this.valid === IgxInputState.INVALID;
            this.renderer.setAttribute(this.nativeElement, 'aria-invalid', ariaInvalid.toString());
        }
        else {
            this.checkNativeValidity();
        }
    }
    /**
     * Gets whether the igxInput has a placeholder.
     *
     * @example
     * ```typescript
     * let hasPlaceholder = this.igxInput.hasPlaceholder;
     * ```
     */
    get hasPlaceholder() {
        return this.nativeElement.hasAttribute('placeholder');
    }
    /**
     * Gets the placeholder element of the igxInput.
     *
     * @example
     * ```typescript
     * let igxInputPlaceholder = this.igxInput.placeholder;
     * ```
     */
    get placeholder() {
        return this.nativeElement.placeholder;
    }
    /**
     * @returns An indicator of whether the input has validator attributes or not
     *
     * @hidden
     * @internal
     */
    _hasValidators() {
        for (const nativeValidationAttribute of nativeValidationAttributes) {
            if (this.nativeElement.hasAttribute(nativeValidationAttribute)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets whether the igxInput is focused.
     *
     * @example
     * ```typescript
     * let isFocused = this.igxInput.focused;
     * ```
     */
    get focused() {
        return this.inputGroup.isFocused;
    }
    /**
     * Gets the state of the igxInput.
     *
     * @example
     * ```typescript
     * let igxInputState = this.igxInput.valid;
     * ```
     */
    get valid() {
        return this._valid;
    }
    /**
     * Sets the state of the igxInput.
     *
     * @example
     * ```typescript
     * this.igxInput.valid = IgxInputState.INVALID;
     * ```
     */
    set valid(value) {
        this._valid = value;
    }
    /**
     * Gets whether the igxInput is valid.
     *
     * @example
     * ```typescript
     * let valid = this.igxInput.isValid;
     * ```
     */
    get isValid() {
        return this.valid !== IgxInputState.INVALID;
    }
    /**
     * A function to assign a native validity property of an input.
     * This should be used when there's no ngControl
     *
     * @hidden
     * @internal
     */
    checkNativeValidity() {
        if (!this.disabled && this._hasValidators()) {
            this._valid = this.nativeElement.checkValidity() ?
                this.focused ? IgxInputState.VALID : IgxInputState.INITIAL :
                IgxInputState.INVALID;
        }
    }
    /**
     * Returns the input type.
     *
     * @hidden
     * @internal
     */
    get type() {
        return this.nativeElement.type;
    }
}
IgxInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputDirective, deps: [{ token: i1.IgxInputGroupBase }, { token: NgModel, optional: true, self: true }, { token: FormControlName, optional: true, self: true }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
IgxInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxInputDirective, selector: "[igxInput]", inputs: { value: "value", disabled: "disabled", required: "required" }, host: { listeners: { "focus": "onFocus()", "blur": "onBlur()", "input": "onInput()", "change": "change($event)" }, properties: { "class.igx-input-group__input": "this.isInput", "class.igx-input-group__textarea": "this.isTextArea", "disabled": "this.disabled" } }, exportAs: ["igxInput"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxInput]',
                    exportAs: 'igxInput',
                }]
        }], ctorParameters: function () { return [{ type: i1.IgxInputGroupBase }, { type: i2.NgModel, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NgModel]
                }] }, { type: i2.FormControlName, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [FormControlName]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }]; }, propDecorators: { isInput: [{
                type: HostBinding,
                args: ['class.igx-input-group__input']
            }], isTextArea: [{
                type: HostBinding,
                args: ['class.igx-input-group__textarea']
            }], value: [{
                type: Input
            }], disabled: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['disabled']
            }], required: [{
                type: Input
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }], onInput: [{
                type: HostListener,
                args: ['input']
            }], change: [{
                type: HostListener,
                args: ['change', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RpcmVjdGl2ZXMvaW5wdXQvaW5wdXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFHSCxTQUFTLEVBRVQsV0FBVyxFQUNYLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFFUixJQUFJLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVILGVBQWUsRUFFZixPQUFPLEVBQ1YsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUl4QixNQUFNLDBCQUEwQixHQUFHO0lBQy9CLFVBQVU7SUFDVixTQUFTO0lBQ1QsV0FBVztJQUNYLFdBQVc7SUFDWCxLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07Q0FDVCxDQUFDO0FBRUYsTUFBTSxDQUFOLElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUNyQix1REFBTyxDQUFBO0lBQ1AsbURBQUssQ0FBQTtJQUNMLHVEQUFPLENBQUE7QUFDWCxDQUFDLEVBSlcsYUFBYSxLQUFiLGFBQWEsUUFJeEI7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFLSCxNQUFNLE9BQU8saUJBQWlCO0lBeUMxQixZQUNXLFVBQTZCLEVBQ1csT0FBZ0IsRUFJckQsV0FBNEIsRUFDNUIsT0FBcUMsRUFDckMsR0FBc0IsRUFDdEIsUUFBbUI7UUFSdEIsZUFBVSxHQUFWLFVBQVUsQ0FBbUI7UUFDVyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBSXJELGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUM1QixZQUFPLEdBQVAsT0FBTyxDQUE4QjtRQUNyQyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBL0NqQzs7Ozs7Ozs7Ozs7OztXQWFHO1FBRUksWUFBTyxHQUFHLEtBQUss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Tyx5Q0FHM0IsZUFBZTtrR0E5Q2xCLGlCQUFpQjsyRkFBakIsaUJBQWlCO2tCQUo3QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsVUFBVTtpQkFDdkI7OzBCQTRDUSxRQUFROzswQkFBSSxJQUFJOzswQkFBSSxNQUFNOzJCQUFDLE9BQU87OzBCQUNsQyxRQUFROzswQkFDUixJQUFJOzswQkFDSixNQUFNOzJCQUFDLGVBQWU7NkhBNUJwQixPQUFPO3NCQURiLFdBQVc7dUJBQUMsOEJBQThCO2dCQWlCcEMsVUFBVTtzQkFEaEIsV0FBVzt1QkFBQyxpQ0FBaUM7Z0JBbUNuQyxLQUFLO3NCQURmLEtBQUs7Z0JBOEJLLFFBQVE7c0JBRmxCLEtBQUs7O3NCQUNMLFdBQVc7dUJBQUMsVUFBVTtnQkFpQ1osUUFBUTtzQkFEbEIsS0FBSztnQkF5QkMsT0FBTztzQkFEYixZQUFZO3VCQUFDLE9BQU87Z0JBV2QsTUFBTTtzQkFEWixZQUFZO3VCQUFDLE1BQU07Z0JBT2IsT0FBTztzQkFEYixZQUFZO3VCQUFDLE9BQU87Z0JBTWQsTUFBTTtzQkFEWixZQUFZO3VCQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBIb3N0QmluZGluZyxcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPcHRpb25hbCxcbiAgICBSZW5kZXJlcjIsXG4gICAgU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIEFic3RyYWN0Q29udHJvbCxcbiAgICBGb3JtQ29udHJvbE5hbWUsXG4gICAgTmdDb250cm9sLFxuICAgIE5nTW9kZWxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwQmFzZSB9IGZyb20gJy4uLy4uL2lucHV0LWdyb3VwL2lucHV0LWdyb3VwLmNvbW1vbic7XG5cbmNvbnN0IG5hdGl2ZVZhbGlkYXRpb25BdHRyaWJ1dGVzID0gW1xuICAgICdyZXF1aXJlZCcsXG4gICAgJ3BhdHRlcm4nLFxuICAgICdtaW5sZW5ndGgnLFxuICAgICdtYXhsZW5ndGgnLFxuICAgICdtaW4nLFxuICAgICdtYXgnLFxuICAgICdzdGVwJyxcbl07XG5cbmV4cG9ydCBlbnVtIElneElucHV0U3RhdGUge1xuICAgIElOSVRJQUwsXG4gICAgVkFMSUQsXG4gICAgSU5WQUxJRCxcbn1cblxuLyoqXG4gKiBUaGUgYGlneElucHV0YCBkaXJlY3RpdmUgY3JlYXRlcyBzaW5nbGUtIG9yIG11bHRpbGluZSB0ZXh0IGVsZW1lbnRzLCBjb3ZlcmluZyBjb21tb24gc2NlbmFyaW9zIHdoZW4gZGVhbGluZyB3aXRoIGZvcm0gaW5wdXRzLlxuICpcbiAqIEBpZ3hNb2R1bGUgSWd4SW5wdXRHcm91cE1vZHVsZVxuICpcbiAqIEBpZ3hQYXJlbnQgRGF0YSBFbnRyeSAmIERpc3BsYXlcbiAqXG4gKiBAaWd4VGhlbWUgaWd4LWlucHV0LWdyb3VwLXRoZW1lXG4gKlxuICogQGlneEtleXdvcmRzIGlucHV0LCBpbnB1dCBncm91cCwgZm9ybSwgZmllbGQsIHZhbGlkYXRpb25cbiAqXG4gKiBAaWd4R3JvdXAgcHJlc2VudGF0aW9uXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dC1ncm91cD5cbiAqICA8bGFiZWwgZm9yPVwiYWRkcmVzc1wiPkFkZHJlc3M8L2xhYmVsPlxuICogIDxpbnB1dCBpZ3hJbnB1dCBuYW1lPVwiYWRkcmVzc1wiIHR5cGU9XCJ0ZXh0XCIgWyhuZ01vZGVsKV09XCJjdXN0b21lci5hZGRyZXNzXCI+XG4gKiA8L2lucHV0LWdyb3VwPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneElucHV0XScsXG4gICAgZXhwb3J0QXM6ICdpZ3hJbnB1dCcsXG59KVxuZXhwb3J0IGNsYXNzIElneElucHV0RGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogYm9vbGVhbiB8ICcnO1xuICAgIHByaXZhdGUgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgJyc7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGBcImlneC1pbnB1dC1ncm91cF9faW5wdXRcImAgY2xhc3MgaXMgYWRkZWQgdG8gdGhlIGhvc3QgZWxlbWVudC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmlneElucHV0LmlzSW5wdXQgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzQ0xhc3NBZGRlZCA9IHRoaXMuaWd4SW5wdXQuaXNJbnB1dDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cF9faW5wdXQnKVxuICAgIHB1YmxpYyBpc0lucHV0ID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGBcImNsYXNzLmlneC1pbnB1dC1ncm91cF9fdGV4dGFyZWFcImAgY2xhc3MgaXMgYWRkZWQgdG8gdGhlIGhvc3QgZWxlbWVudC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmlneElucHV0LmlzVGV4dEFyZWEgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzQ0xhc3NBZGRlZCA9IHRoaXMuaWd4SW5wdXQuaXNUZXh0QXJlYTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cF9fdGV4dGFyZWEnKVxuICAgIHB1YmxpYyBpc1RleHRBcmVhID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIF92YWxpZCA9IElneElucHV0U3RhdGUuSU5JVElBTDtcbiAgICBwcml2YXRlIF9zdGF0dXNDaGFuZ2VzJDogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgX2ZpbGVOYW1lczogc3RyaW5nO1xuICAgIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBCYXNlLFxuICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTmdNb2RlbCkgcHJvdGVjdGVkIG5nTW9kZWw6IE5nTW9kZWwsXG4gICAgICAgIEBPcHRpb25hbCgpXG4gICAgICAgIEBTZWxmKClcbiAgICAgICAgQEluamVjdChGb3JtQ29udHJvbE5hbWUpXG4gICAgICAgIHByb3RlY3RlZCBmb3JtQ29udHJvbDogRm9ybUNvbnRyb2xOYW1lLFxuICAgICAgICBwcm90ZWN0ZWQgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICAgICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyXG4gICAgKSB7IH1cblxuICAgIHByaXZhdGUgZ2V0IG5nQ29udHJvbCgpOiBOZ0NvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5uZ01vZGVsID8gdGhpcy5uZ01vZGVsIDogdGhpcy5mb3JtQ29udHJvbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgdmFsdWVgIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0LWdyb3VwPlxuICAgICAqICA8aW5wdXQgaWd4SW5wdXQgI2lneElucHV0IFt2YWx1ZV09XCInSWd4SW5wdXQgVmFsdWUnXCI+XG4gICAgICogPC9pbnB1dC1ncm91cD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZSA/PyAnJztcbiAgICAgICAgdGhpcy51cGRhdGVWYWxpZGl0eVN0YXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGB2YWx1ZWAgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKCdpZ3hJbnB1dCcsIHtyZWFkOiBJZ3hJbnB1dERpcmVjdGl2ZX0pXG4gICAgICogIHB1YmxpYyBpZ3hJbnB1dDogSWd4SW5wdXREaXJlY3RpdmU7XG4gICAgICogbGV0IGlucHV0VmFsdWUgPSB0aGlzLmlneElucHV0LnZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGBkaXNhYmxlZGAgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aW5wdXQtZ3JvdXA+XG4gICAgICogIDxpbnB1dCBpZ3hJbnB1dCAjaWd4SW5wdXQgW2Rpc2FibGVkXT1cInRydWVcIj5cbiAgICAgKiA8L2lucHV0LWdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdkaXNhYmxlZCcpXG4gICAgcHVibGljIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHRoaXMuaW5wdXRHcm91cC5kaXNhYmxlZCA9ICEhKCh2YWx1ZSBhcyBhbnkgPT09ICcnKSB8fCB2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmZvY3VzZWQgJiYgdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIEJyb3dzZXIgZm9jdXMgbWF5IG5vdCBmaXJlIGluIGdvb2QgdGltZSBhbmQgbWVzcyB3aXRoIGNoYW5nZSBkZXRlY3Rpb24sIGFkanVzdCBoZXJlIGluIGFkdmFuY2U6XG4gICAgICAgICAgICB0aGlzLmlucHV0R3JvdXAuaXNGb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYGRpc2FibGVkYCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZCgnaWd4SW5wdXQnLCB7cmVhZDogSWd4SW5wdXREaXJlY3RpdmV9KVxuICAgICAqICBwdWJsaWMgaWd4SW5wdXQ6IElneElucHV0RGlyZWN0aXZlO1xuICAgICAqIGxldCBpc0Rpc2FibGVkID0gdGhpcy5pZ3hJbnB1dC5kaXNhYmxlZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgYHJlcXVpcmVkYCBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpbnB1dC1ncm91cD5cbiAgICAgKiAgPGlucHV0IGlneElucHV0ICNpZ3hJbnB1dCByZXF1aXJlZD5cbiAgICAgKiA8L2lucHV0LWdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQucmVxdWlyZWQgPSB0aGlzLmlucHV0R3JvdXAuaXNSZXF1aXJlZCA9ICh2YWx1ZSBhcyBhbnkgPT09ICcnKSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIGlneElucHV0IGlzIHJlcXVpcmVkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzUmVxdWlyZWQgPSB0aGlzLmlneElucHV0LnJlcXVpcmVkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmVxdWlyZWQoKSB7XG4gICAgICAgIGxldCB2YWxpZGF0aW9uO1xuICAgICAgICBpZiAodGhpcy5uZ0NvbnRyb2wgJiYgKHRoaXMubmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yIHx8IHRoaXMubmdDb250cm9sLmNvbnRyb2wuYXN5bmNWYWxpZGF0b3IpKSB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uID0gdGhpcy5uZ0NvbnRyb2wuY29udHJvbC52YWxpZGF0b3Ioe30gYXMgQWJzdHJhY3RDb250cm9sKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uLnJlcXVpcmVkIHx8IHRoaXMubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdmb2N1cycpXG4gICAgcHVibGljIG9uRm9jdXMoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRHcm91cC5pc0ZvY3VzZWQgPSB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGludm9rZSB0aGUgaGFuZGxlclxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICAgIHB1YmxpYyBvbkJsdXIoKSB7XG4gICAgICAgIHRoaXMuaW5wdXRHcm91cC5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWxpZGl0eVN0YXRlKCk7XG4gICAgfVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgICBwdWJsaWMgb25JbnB1dCgpIHtcbiAgICAgICAgdGhpcy5jaGVja05hdGl2ZVZhbGlkaXR5KCk7XG4gICAgfVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIGNoYW5nZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlTGlzdDogRmlsZUxpc3QgfCBudWxsID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KVxuICAgICAgICAgICAgICAgIC5maWxlcztcbiAgICAgICAgICAgIGNvbnN0IGZpbGVBcnJheTogRmlsZVtdID0gW107XG5cbiAgICAgICAgICAgIGlmIChmaWxlTGlzdCkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBBcnJheS5mcm9tKGZpbGVMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICBmaWxlQXJyYXkucHVzaChmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2ZpbGVOYW1lcyA9IChmaWxlQXJyYXkgfHwgW10pLm1hcCgoZjogRmlsZSkgPT4gZi5uYW1lKS5qb2luKCcsICcpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5yZXF1aXJlZCAmJiBmaWxlTGlzdD8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbGlkID0gSWd4SW5wdXRTdGF0ZS5JTklUSUFMO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBmaWxlTmFtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWxlTmFtZXM7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGNsZWFyKCkge1xuICAgICAgICB0aGlzLm5nQ29udHJvbD8uY29udHJvbD8uc2V0VmFsdWUoJycpO1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9maWxlTmFtZXMgPSAnJztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmlucHV0R3JvdXAuaGFzUGxhY2Vob2xkZXIgPSB0aGlzLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKFxuICAgICAgICAgICAgJ3BsYWNlaG9sZGVyJ1xuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLm5nQ29udHJvbCAmJiB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRoaXMubmdDb250cm9sLmRpc2FibGVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5wdXRHcm91cC5kaXNhYmxlZCA9XG4gICAgICAgICAgICB0aGlzLmlucHV0R3JvdXAuZGlzYWJsZWQgfHxcbiAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgIHRoaXMuaW5wdXRHcm91cC5pc1JlcXVpcmVkID0gdGhpcy5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZShcbiAgICAgICAgICAgICdyZXF1aXJlZCdcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZG8gbm90IGludmFsaWRhdGUgdGhlIGlucHV0IG9uIGluaXRcbiAgICAgICAgaWYgKCF0aGlzLm5nQ29udHJvbCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBJZ3hJbnB1dFN0YXRlLklOSVRJQUw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxzbyBjaGVjayB0aGUgY29udHJvbCdzIHZhbGlkYXRvcnMgZm9yIHJlcXVpcmVkXG4gICAgICAgIGlmICh0aGlzLnJlcXVpcmVkICYmICF0aGlzLmlucHV0R3JvdXAuaXNSZXF1aXJlZCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwLmlzUmVxdWlyZWQgPSB0aGlzLnJlcXVpcmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5uYXRpdmVFbGVtZW50LCAnYXJpYS1yZXF1aXJlZCcsIHRoaXMucmVxdWlyZWQudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgY29uc3QgZWxUYWcgPSB0aGlzLm5hdGl2ZUVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoZWxUYWcgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgICAgICAgIHRoaXMuaXNUZXh0QXJlYSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSW5wdXQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VzJCA9IHRoaXMubmdDb250cm9sLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIHRoaXMub25TdGF0dXNDaGFuZ2VkLmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1c0NoYW5nZXMkKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VzJC51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBmb2N1cyBvbiB0aGUgaWd4SW5wdXQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmlneElucHV0LmZvY3VzKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGZvY3VzKCkge1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYG5hdGl2ZUVsZW1lbnRgIG9mIHRoZSBpZ3hJbnB1dC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpZ3hJbnB1dE5hdGl2ZUVsZW1lbnQgPSB0aGlzLmlneElucHV0Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHByb3RlY3RlZCBvblN0YXR1c0NoYW5nZWQoKSB7XG4gICAgICAgIC8vIEVuYWJsZS9EaXNhYmxlIGNvbnRyb2wgYmFzZWQgb24gbmdDb250cm9sICM3MDg2XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkICE9PSB0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRoaXMubmdDb250cm9sLmRpc2FibGVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVmFsaWRpdHlTdGF0ZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVZhbGlkaXR5U3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yIHx8IHRoaXMubmdDb250cm9sLmNvbnRyb2wuYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyBSdW4gdGhlIHZhbGlkYXRpb24gd2l0aCBlbXB0eSBvYmplY3QgdG8gY2hlY2sgaWYgcmVxdWlyZWQgaXMgZW5hYmxlZC5cbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMubmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yKHt9IGFzIEFic3RyYWN0Q29udHJvbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwLmlzUmVxdWlyZWQgPSBlcnJvciAmJiBlcnJvci5yZXF1aXJlZDtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgKHRoaXMubmdDb250cm9sLmNvbnRyb2wudG91Y2hlZCB8fCB0aGlzLm5nQ29udHJvbC5jb250cm9sLmRpcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgY29udHJvbCBpcyBub3QgZGlzYWJsZWQgYW5kIGlzIHRvdWNoZWQgb3IgZGlydHlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSB0aGlzLm5nQ29udHJvbC5pbnZhbGlkID9cbiAgICAgICAgICAgICAgICAgICAgICAgIElneElucHV0U3RhdGUuSU5WQUxJRCA6IHRoaXMuZm9jdXNlZCA/IElneElucHV0U3RhdGUuVkFMSUQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIElneElucHV0U3RhdGUuSU5JVElBTDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgaWYgY29udHJvbCBpcyB1bnRvdWNoZWQsIHByaXN0aW5lLCBvciBkaXNhYmxlZCBpdHMgc3RhdGUgaXMgaW5pdGlhbC4gVGhpcyBpcyB3aGVuIHVzZXIgZGlkIG5vdCBpbnRlcmFjdFxuICAgICAgICAgICAgICAgICAgICAvLyAgd2l0aCB0aGUgaW5wdXQgb3Igd2hlbiBmb3JtL2NvbnRyb2wgaXMgcmVzZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBJZ3hJbnB1dFN0YXRlLklOSVRJQUw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB2YWxpZGF0b3IgaXMgZHluYW1pY2FsbHkgY2xlYXJlZCwgcmVzZXQgbGFiZWwncyByZXF1aXJlZCBjbGFzcyhhc3RlcmlzaykgYW5kIElneElucHV0U3RhdGUgIzEwMDEwXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsaWQgPSBJZ3hJbnB1dFN0YXRlLklOSVRJQUw7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwLmlzUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMubmF0aXZlRWxlbWVudCwgJ2FyaWEtcmVxdWlyZWQnLCB0aGlzLnJlcXVpcmVkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc3QgYXJpYUludmFsaWQgPSB0aGlzLnZhbGlkID09PSBJZ3hJbnB1dFN0YXRlLklOVkFMSUQ7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWludmFsaWQnLCBhcmlhSW52YWxpZC50b1N0cmluZygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tOYXRpdmVWYWxpZGl0eSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgaWd4SW5wdXQgaGFzIGEgcGxhY2Vob2xkZXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaGFzUGxhY2Vob2xkZXIgPSB0aGlzLmlneElucHV0Lmhhc1BsYWNlaG9sZGVyO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzUGxhY2Vob2xkZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBwbGFjZWhvbGRlciBlbGVtZW50IG9mIHRoZSBpZ3hJbnB1dC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpZ3hJbnB1dFBsYWNlaG9sZGVyID0gdGhpcy5pZ3hJbnB1dC5wbGFjZWhvbGRlcjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBsYWNlaG9sZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVFbGVtZW50LnBsYWNlaG9sZGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIEFuIGluZGljYXRvciBvZiB3aGV0aGVyIHRoZSBpbnB1dCBoYXMgdmFsaWRhdG9yIGF0dHJpYnV0ZXMgb3Igbm90XG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGFzVmFsaWRhdG9ycygpOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChjb25zdCBuYXRpdmVWYWxpZGF0aW9uQXR0cmlidXRlIG9mIG5hdGl2ZVZhbGlkYXRpb25BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZShuYXRpdmVWYWxpZGF0aW9uQXR0cmlidXRlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIGlneElucHV0IGlzIGZvY3VzZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNGb2N1c2VkID0gdGhpcy5pZ3hJbnB1dC5mb2N1c2VkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZm9jdXNlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRHcm91cC5pc0ZvY3VzZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHN0YXRlIG9mIHRoZSBpZ3hJbnB1dC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpZ3hJbnB1dFN0YXRlID0gdGhpcy5pZ3hJbnB1dC52YWxpZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHZhbGlkKCk6IElneElucHV0U3RhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3RhdGUgb2YgdGhlIGlneElucHV0LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5pZ3hJbnB1dC52YWxpZCA9IElneElucHV0U3RhdGUuSU5WQUxJRDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHZhbGlkKHZhbHVlOiBJZ3hJbnB1dFN0YXRlKSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB3aGV0aGVyIHRoZSBpZ3hJbnB1dCBpcyB2YWxpZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCB2YWxpZCA9IHRoaXMuaWd4SW5wdXQuaXNWYWxpZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkICE9PSBJZ3hJbnB1dFN0YXRlLklOVkFMSUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0byBhc3NpZ24gYSBuYXRpdmUgdmFsaWRpdHkgcHJvcGVydHkgb2YgYW4gaW5wdXQuXG4gICAgICogVGhpcyBzaG91bGQgYmUgdXNlZCB3aGVuIHRoZXJlJ3Mgbm8gbmdDb250cm9sXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGVja05hdGl2ZVZhbGlkaXR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5faGFzVmFsaWRhdG9ycygpKSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZCA9IHRoaXMubmF0aXZlRWxlbWVudC5jaGVja1ZhbGlkaXR5KCkgP1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNlZCA/IElneElucHV0U3RhdGUuVkFMSUQgOiBJZ3hJbnB1dFN0YXRlLklOSVRJQUwgOlxuICAgICAgICAgICAgICAgIElneElucHV0U3RhdGUuSU5WQUxJRDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGlucHV0IHR5cGUuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCB0eXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVFbGVtZW50LnR5cGU7XG4gICAgfVxufVxuIl19