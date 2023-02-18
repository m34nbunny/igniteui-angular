import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';
import { mkenum } from '../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "../directives/ripple/ripple.directive";
export const RadioLabelPosition = mkenum({
    BEFORE: 'before',
    AFTER: 'after'
});
let nextId = 0;
/**
 * **Ignite UI for Angular Radio Button** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/radio_button.html)
 *
 * The Ignite UI Radio Button allows the user to select a single option from an available set of options that are listed side by side.
 *
 * Example:
 * ```html
 * <igx-radio>
 *   Simple radio button
 * </igx-radio>
 * ```
 */
export class IgxRadioComponent {
    constructor(cdr) {
        this.cdr = cdr;
        /**
         * Sets/gets the `id` of the radio component.
         * If not set, the `id` of the first radio component will be `"igx-radio-0"`.
         * ```html
         * <igx-radio id = "my-first-radio"></igx-radio>
         * ```
         * ```typescript
         * let radioId =  this.radio.id;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.id = `igx-radio-${nextId++}`;
        /**
         * Sets/gets the id of the `label` element in the radio component.
         * If not set, the id of the `label` in the first radio component will be `"igx-radio-0-label"`.
         * ```html
         * <igx-radio labelId = "Label1"></igx-radio>
         * ```
         * ```typescript
         * let labelId =  this.radio.labelId;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.labelId = `${this.id}-label`;
        /**
         * Sets the value of the `tabindex` attribute.
         * ```html
         * <igx-radio [tabindex] = "1"></igx-radio>
         * ```
         * ```typescript
         * let tabIndex =  this.radio.tabindex;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.tabindex = null;
        /**
         * Enables/disables the ripple effect on the radio button..
         * If not set, the `disableRipple` will have value `false`.
         * ```html
         * <igx-radio [disableRipple] = "true"></igx-radio>
         * ```
         * ```typescript
         * let isDisabledRipple =  this.radio.disableRipple;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.disableRipple = false;
        /**
         * Sets/gets the `aria-labelledby` attribute of the radio component.
         * If not set, the `aria-labelledby` will be equal to the value of `labelId` attribute.
         * ```html
         * <igx-radio aria-labelledby = "Radio1"></igx-radio>
         * ```
         * ```typescript
         * let ariaLabelledBy = this.radio.ariaLabelledBy;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.ariaLabelledBy = this.labelId;
        /**
         * Sets/gets the `aria-label` attribute of the radio component.
         * ```html
         * <igx-radio aria-label = "Radio1"></igx-radio>
         * ```
         * ```typescript
         * let ariaLabel =  this.radio.ariaLabel;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.ariaLabel = null;
        /**
         * An event that is emitted after the radio `value` is changed.
         * Provides references to the `IgxRadioComponent` and the `value` property as event arguments.
         *
         * @memberof IgxRadioComponent
         */
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.change = new EventEmitter();
        /**
         * Returns the class of the radio component.
         * ```typescript
         * let radioClass = this.radio.cssClass;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.cssClass = 'igx-radio';
        /**
         * Sets/gets  the `checked` attribute.
         * Default value is `false`.
         * ```html
         * <igx-radio [checked] = "true"></igx-radio>
         * ```
         * ```typescript
         * let isChecked =  this.radio.checked;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.checked = false;
        /**
         * Sets/gets whether the radio component is on focus.
         * Default value is `false`.
         * ```typescript
         * this.radio.focus = true;
         * ```
         * ```typescript
         * let isFocused =  this.radio.focused;
         * ```
         *
         * @memberof IgxRadioComponent
         */
        this.focused = false;
        /**
         * @hidden
         */
        this.inputId = `${this.id}-input`;
        /**
         * @hidden
         * @internal
         */
        this._required = false;
        /**
         * @hidden
         */
        this._onTouchedCallback = noop;
        /**
         * @hidden
         */
        this._onChangeCallback = noop;
    }
    /**
     * Sets/gets whether the radio button is required.
     * If not set, `required` will have value `false`.
     * ```html
     * <igx-radio required></igx-radio>
     * ```
     * ```typescript
     * let isRequired =  this.radio.required;
     * ```
     *
     * @memberof IgxRadioComponent
     */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = (value === '') || value;
    }
    /**
     * Sets/gets  the `disabled` attribute.
     * Default value is `false`.
     * ```html
     * <igx-radio disabled></igx-radio>
     * ```
     * ```typescript
     * let isDisabled =  this.radio.disabled;
     * ```
     *
     * @memberof IgxRadioComponent
     */
    get disabled() {
        return this._disabled || false;
    }
    set disabled(value) {
        this._disabled = (value === '') || value;
    }
    /**
     * @hidden
     * @internal
     */
    _changed() {
        if (event instanceof Event) {
            event.preventDefault();
        }
    }
    /**
     * @hidden
     * @internal
     */
    onKeyUp(event) {
        event.stopPropagation();
        this.focused = true;
        this.select();
    }
    /**
     * @hidden
     */
    _clicked() {
        this.select();
    }
    /**
     * Selects the current radio button.
     * ```typescript
     * this.radio.select();
     * ```
     *
     * @memberof IgxRadioComponent
     */
    select() {
        this.nativeRadio.nativeElement.focus();
        if (!this.checked) {
            this.checked = true;
            this.change.emit({ value: this.value, radio: this });
            this._onChangeCallback(this.value);
        }
    }
    /**
     * Deselects the current radio button.
     * ```typescript
     * this.radio.deselect();
     * ```
     *
     * @memberof IgxRadioComponent
     */
    deselect() {
        this.checked = false;
        this.focused = false;
        this.cdr.markForCheck();
    }
    /**
     * Checks whether the provided value is consistent to the current radio button.
     * If it is, the checked attribute will have value `true`;
     * ```typescript
     * this.radio.writeValue('radioButtonValue');
     * ```
     */
    writeValue(value) {
        this.value = this.value || value;
        if (value === this.value) {
            this.select();
        }
        else {
            this.deselect();
        }
    }
    /** @hidden */
    getEditElement() {
        return this.nativeRadio.nativeElement;
    }
    /**
     * @hidden
     */
    get labelClass() {
        switch (this.labelPosition) {
            case RadioLabelPosition.BEFORE:
                return `${this.cssClass}__label--before`;
            case RadioLabelPosition.AFTER:
            default:
                return `${this.cssClass}__label`;
        }
    }
    /**
     * @hidden
     */
    onBlur() {
        this.focused = false;
        this._onTouchedCallback();
    }
    /**
     * @hidden
     */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /**
     * @hidden
     */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /**
     * @hidden
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
IgxRadioComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
IgxRadioComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxRadioComponent, selector: "igx-radio", inputs: { id: "id", labelId: "labelId", labelPosition: "labelPosition", value: "value", name: "name", tabindex: "tabindex", disableRipple: "disableRipple", required: "required", ariaLabelledBy: ["aria-labelledby", "ariaLabelledBy"], ariaLabel: ["aria-label", "ariaLabel"], checked: "checked", disabled: "disabled" }, outputs: { change: "change" }, host: { listeners: { "change": "_changed($event)", "keyup": "onKeyUp($event)", "click": "_clicked()" }, properties: { "attr.id": "this.id", "class.igx-radio": "this.cssClass", "class.igx-radio--checked": "this.checked", "class.igx-radio--disabled": "this.disabled", "class.igx-radio--focused": "this.focused" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: IgxRadioComponent,
            multi: true,
        },
    ], viewQueries: [{ propertyName: "nativeRadio", first: true, predicate: ["radio"], descendants: true, static: true }, { propertyName: "nativeLabel", first: true, predicate: ["nativeLabel"], descendants: true, static: true }, { propertyName: "placeholderLabel", first: true, predicate: ["placeholderLabel"], descendants: true, static: true }], ngImport: i0, template: "<input #radio class=\"igx-radio__input\" type=\"radio\"\n    [id]=\"inputId\"\n    [name]=\"name\"\n    [value]=\"value\"\n    [tabindex]=\"tabindex\"\n    [disabled]=\"disabled\"\n    [checked]=\"checked\"\n    [required]=\"required\"\n    [attr.aria-checked]=\"checked\"\n    [attr.aria-labelledby]=\"ariaLabel ? null : ariaLabelledBy\"\n    [attr.aria-label]=\"ariaLabel\"\n    (blur)=\"onBlur()\" />\n\n<span #nativeLabel class=\"igx-radio__composite\" igxRipple\n    igxRippleTarget=\".igx-radio__ripple\"\n    [igxRippleDisabled]=\"disableRipple\"\n    [igxRippleCentered]=\"true\"\n    [igxRippleDuration]=\"300\">\n    <div class=\"igx-radio__ripple\"></div>\n</span>\n\n<span #placeholderLabel\n    [id]=\"labelId\"\n    [class]=\"labelClass\">\n    <ng-content></ng-content>\n</span>\n", directives: [{ type: i1.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioComponent, decorators: [{
            type: Component,
            args: [{ providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: IgxRadioComponent,
                            multi: true,
                        },
                    ], selector: 'igx-radio', template: "<input #radio class=\"igx-radio__input\" type=\"radio\"\n    [id]=\"inputId\"\n    [name]=\"name\"\n    [value]=\"value\"\n    [tabindex]=\"tabindex\"\n    [disabled]=\"disabled\"\n    [checked]=\"checked\"\n    [required]=\"required\"\n    [attr.aria-checked]=\"checked\"\n    [attr.aria-labelledby]=\"ariaLabel ? null : ariaLabelledBy\"\n    [attr.aria-label]=\"ariaLabel\"\n    (blur)=\"onBlur()\" />\n\n<span #nativeLabel class=\"igx-radio__composite\" igxRipple\n    igxRippleTarget=\".igx-radio__ripple\"\n    [igxRippleDisabled]=\"disableRipple\"\n    [igxRippleCentered]=\"true\"\n    [igxRippleDuration]=\"300\">\n    <div class=\"igx-radio__ripple\"></div>\n</span>\n\n<span #placeholderLabel\n    [id]=\"labelId\"\n    [class]=\"labelClass\">\n    <ng-content></ng-content>\n</span>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { nativeRadio: [{
                type: ViewChild,
                args: ['radio', { static: true }]
            }], nativeLabel: [{
                type: ViewChild,
                args: ['nativeLabel', { static: true }]
            }], placeholderLabel: [{
                type: ViewChild,
                args: ['placeholderLabel', { static: true }]
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], labelId: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], value: [{
                type: Input
            }], name: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], required: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], change: [{
                type: Output
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-radio']
            }], checked: [{
                type: HostBinding,
                args: ['class.igx-radio--checked']
            }, {
                type: Input
            }], disabled: [{
                type: HostBinding,
                args: ['class.igx-radio--disabled']
            }, {
                type: Input
            }], focused: [{
                type: HostBinding,
                args: ['class.igx-radio--focused']
            }], _changed: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], onKeyUp: [{
                type: HostListener,
                args: ['keyup', ['$event']]
            }], _clicked: [{
                type: HostListener,
                args: ['click']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3JhZGlvL3JhZGlvLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9yYWRpby9yYWRpby5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ2dCLFNBQVMsRUFBYyxZQUFZLEVBQ3RELFdBQVcsRUFDWCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFrQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQU92RCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUM7SUFDckMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsS0FBSyxFQUFFLE9BQU87Q0FDakIsQ0FBQyxDQUFDO0FBR0gsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2Y7Ozs7Ozs7Ozs7OztHQVlHO0FBWUgsTUFBTSxPQUFPLGlCQUFpQjtJQTRSMUIsWUFBb0IsR0FBc0I7UUFBdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUF4UDFDOzs7Ozs7Ozs7OztXQVdHO1FBR0ksT0FBRSxHQUFHLGFBQWEsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUVwQzs7Ozs7Ozs7Ozs7V0FXRztRQUVJLFlBQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQztRQTZDcEM7Ozs7Ozs7Ozs7V0FVRztRQUVJLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFFL0I7Ozs7Ozs7Ozs7O1dBV0c7UUFFSSxr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ImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRWRpdG9yUHJvdmlkZXIgfSBmcm9tICcuLi9jb3JlL2VkaXQtcHJvdmlkZXInO1xuaW1wb3J0IHsgSUJhc2VFdmVudEFyZ3MsIG1rZW51bSB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGFuZ2VSYWRpb0V2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICB2YWx1ZTogYW55O1xuICAgIHJhZGlvOiBJZ3hSYWRpb0NvbXBvbmVudDtcbn1cblxuZXhwb3J0IGNvbnN0IFJhZGlvTGFiZWxQb3NpdGlvbiA9IG1rZW51bSh7XG4gICAgQkVGT1JFOiAnYmVmb3JlJyxcbiAgICBBRlRFUjogJ2FmdGVyJ1xufSk7XG5leHBvcnQgdHlwZSBSYWRpb0xhYmVsUG9zaXRpb24gPSAodHlwZW9mIFJhZGlvTGFiZWxQb3NpdGlvbilba2V5b2YgdHlwZW9mIFJhZGlvTGFiZWxQb3NpdGlvbl07XG5cbmxldCBuZXh0SWQgPSAwO1xuLyoqXG4gKiAqKklnbml0ZSBVSSBmb3IgQW5ndWxhciBSYWRpbyBCdXR0b24qKiAtXG4gKiBbRG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly93d3cuaW5mcmFnaXN0aWNzLmNvbS9wcm9kdWN0cy9pZ25pdGUtdWktYW5ndWxhci9hbmd1bGFyL2NvbXBvbmVudHMvcmFkaW9fYnV0dG9uLmh0bWwpXG4gKlxuICogVGhlIElnbml0ZSBVSSBSYWRpbyBCdXR0b24gYWxsb3dzIHRoZSB1c2VyIHRvIHNlbGVjdCBhIHNpbmdsZSBvcHRpb24gZnJvbSBhbiBhdmFpbGFibGUgc2V0IG9mIG9wdGlvbnMgdGhhdCBhcmUgbGlzdGVkIHNpZGUgYnkgc2lkZS5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBgaHRtbFxuICogPGlneC1yYWRpbz5cbiAqICAgU2ltcGxlIHJhZGlvIGJ1dHRvblxuICogPC9pZ3gtcmFkaW8+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IElneFJhZGlvQ29tcG9uZW50LFxuICAgICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICBzZWxlY3RvcjogJ2lneC1yYWRpbycsXG4gICAgdGVtcGxhdGVVcmw6ICdyYWRpby5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4UmFkaW9Db21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgRWRpdG9yUHJvdmlkZXIge1xuICAgIHByaXZhdGUgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBib29sZWFuIHwgJyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IGJvb2xlYW4gfCAnJztcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHJlZmVyZW5jZSB0byBuYXRpdmUgcmFkaW8gZWxlbWVudC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHJhZGlvRWxlbWVudCA9ICB0aGlzLnJhZGlvLm5hdGl2ZVJhZGlvO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFN3aXRjaENvbXBvbmVudFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3JhZGlvJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgbmF0aXZlUmFkaW86IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHJlZmVyZW5jZSB0byBuYXRpdmUgbGFiZWwgZWxlbWVudC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGxhYmVsRWxlbWVudCA9ICB0aGlzLnJhZGlvLm5hdGl2ZUxhYmVsO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFN3aXRjaENvbXBvbmVudFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ25hdGl2ZUxhYmVsJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgbmF0aXZlTGFiZWw6IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHJlZmVyZW5jZSB0byB0aGUgbGFiZWwgcGxhY2Vob2xkZXIgZWxlbWVudC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGxhYmVsUGxhY2Vob2xkZXIgPSAgdGhpcy5yYWRpby5wbGFjZWhvbGRlckxhYmVsO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFN3aXRjaENvbXBvbmVudFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3BsYWNlaG9sZGVyTGFiZWwnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBwbGFjZWhvbGRlckxhYmVsOiBFbGVtZW50UmVmO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgaWRgIG9mIHRoZSByYWRpbyBjb21wb25lbnQuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgb2YgdGhlIGZpcnN0IHJhZGlvIGNvbXBvbmVudCB3aWxsIGJlIGBcImlneC1yYWRpby0wXCJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXJhZGlvIGlkID0gXCJteS1maXJzdC1yYWRpb1wiPjwvaWd4LXJhZGlvPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgcmFkaW9JZCA9ICB0aGlzLnJhZGlvLmlkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtcmFkaW8tJHtuZXh0SWQrK31gO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBpZCBvZiB0aGUgYGxhYmVsYCBlbGVtZW50IGluIHRoZSByYWRpbyBjb21wb25lbnQuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGlkIG9mIHRoZSBgbGFiZWxgIGluIHRoZSBmaXJzdCByYWRpbyBjb21wb25lbnQgd2lsbCBiZSBgXCJpZ3gtcmFkaW8tMC1sYWJlbFwiYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpbyBsYWJlbElkID0gXCJMYWJlbDFcIj48L2lneC1yYWRpbz5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGxhYmVsSWQgPSAgdGhpcy5yYWRpby5sYWJlbElkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbGFiZWxJZCA9IGAke3RoaXMuaWR9LWxhYmVsYDtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgcG9zaXRpb24gb2YgdGhlIGBsYWJlbGAgaW4gdGhlIHJhZGlvIGNvbXBvbmVudC5cbiAgICAgKiBJZiBub3Qgc2V0LCBgbGFiZWxQb3NpdGlvbmAgd2lsbCBoYXZlIHZhbHVlIGBcImFmdGVyXCJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXJhZGlvIGxhYmVsUG9zaXRpb24gPSBcImJlZm9yZVwiPjwvaWd4LXJhZGlvPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbGFiZWxQb3NpdGlvbiA9ICB0aGlzLnJhZGlvLmxhYmVsUG9zaXRpb247XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4UmFkaW9Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBsYWJlbFBvc2l0aW9uOiBSYWRpb0xhYmVsUG9zaXRpb24gfCBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGB2YWx1ZWAgYXR0cmlidXRlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXJhZGlvIFt2YWx1ZV0gPSBcIidyYWRpb0J1dHRvblZhbHVlJ1wiPjwvaWd4LXJhZGlvPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdmFsdWUgPSAgdGhpcy5yYWRpby52YWx1ZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hSYWRpb0NvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGBuYW1lYCBhdHRyaWJ1dGUgb2YgdGhlIHJhZGlvIGNvbXBvbmVudC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpbyBuYW1lID0gXCJSYWRpbzFcIj48L2lneC1yYWRpbz5cbiAgICAgKiAgYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBuYW1lID0gIHRoaXMucmFkaW8ubmFtZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hSYWRpb0NvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBgdGFiaW5kZXhgIGF0dHJpYnV0ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpbyBbdGFiaW5kZXhdID0gXCIxXCI+PC9pZ3gtcmFkaW8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCB0YWJJbmRleCA9ICB0aGlzLnJhZGlvLnRhYmluZGV4O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdGFiaW5kZXg6IG51bWJlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzL2Rpc2FibGVzIHRoZSByaXBwbGUgZWZmZWN0IG9uIHRoZSByYWRpbyBidXR0b24uLlxuICAgICAqIElmIG5vdCBzZXQsIHRoZSBgZGlzYWJsZVJpcHBsZWAgd2lsbCBoYXZlIHZhbHVlIGBmYWxzZWAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8gW2Rpc2FibGVSaXBwbGVdID0gXCJ0cnVlXCI+PC9pZ3gtcmFkaW8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0Rpc2FibGVkUmlwcGxlID0gIHRoaXMucmFkaW8uZGlzYWJsZVJpcHBsZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hSYWRpb0NvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc2FibGVSaXBwbGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSByYWRpbyBidXR0b24gaXMgcmVxdWlyZWQuXG4gICAgICogSWYgbm90IHNldCwgYHJlcXVpcmVkYCB3aWxsIGhhdmUgdmFsdWUgYGZhbHNlYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpbyByZXF1aXJlZD48L2lneC1yYWRpbz5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzUmVxdWlyZWQgPSAgdGhpcy5yYWRpby5yZXF1aXJlZDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hSYWRpb0NvbXBvbmVudFxuICAgICAqL1xuICAgICBASW5wdXQoKVxuICAgICBwdWJsaWMgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICAgICB9XG4gICAgIHB1YmxpYyBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgIHRoaXMuX3JlcXVpcmVkID0gKHZhbHVlIGFzIGFueSA9PT0gJycpIHx8IHZhbHVlO1xuICAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZSBvZiB0aGUgcmFkaW8gY29tcG9uZW50LlxuICAgICAqIElmIG5vdCBzZXQsIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCB3aWxsIGJlIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgbGFiZWxJZGAgYXR0cmlidXRlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXJhZGlvIGFyaWEtbGFiZWxsZWRieSA9IFwiUmFkaW8xXCI+PC9pZ3gtcmFkaW8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBhcmlhTGFiZWxsZWRCeSA9IHRoaXMucmFkaW8uYXJpYUxhYmVsbGVkQnk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4UmFkaW9Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpXG4gICAgcHVibGljIGFyaWFMYWJlbGxlZEJ5ID0gdGhpcy5sYWJlbElkO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgYXJpYS1sYWJlbGAgYXR0cmlidXRlIG9mIHRoZSByYWRpbyBjb21wb25lbnQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8gYXJpYS1sYWJlbCA9IFwiUmFkaW8xXCI+PC9pZ3gtcmFkaW8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBhcmlhTGFiZWwgPSAgdGhpcy5yYWRpby5hcmlhTGFiZWw7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4UmFkaW9Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoJ2FyaWEtbGFiZWwnKVxuICAgIHB1YmxpYyBhcmlhTGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdGhhdCBpcyBlbWl0dGVkIGFmdGVyIHRoZSByYWRpbyBgdmFsdWVgIGlzIGNoYW5nZWQuXG4gICAgICogUHJvdmlkZXMgcmVmZXJlbmNlcyB0byB0aGUgYElneFJhZGlvQ29tcG9uZW50YCBhbmQgdGhlIGB2YWx1ZWAgcHJvcGVydHkgYXMgZXZlbnQgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1vdXRwdXQtbmF0aXZlXG4gICAgQE91dHB1dCgpIHB1YmxpYyByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxJQ2hhbmdlUmFkaW9FdmVudEFyZ3M+ID0gbmV3IEV2ZW50RW1pdHRlcjxJQ2hhbmdlUmFkaW9FdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjbGFzcyBvZiB0aGUgcmFkaW8gY29tcG9uZW50LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgcmFkaW9DbGFzcyA9IHRoaXMucmFkaW8uY3NzQ2xhc3M7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4UmFkaW9Db21wb25lbnRcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1yYWRpbycpXG4gICAgcHVibGljIGNzc0NsYXNzID0gJ2lneC1yYWRpbyc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgIHRoZSBgY2hlY2tlZGAgYXR0cmlidXRlLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpbyBbY2hlY2tlZF0gPSBcInRydWVcIj48L2lneC1yYWRpbz5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzQ2hlY2tlZCA9ICB0aGlzLnJhZGlvLmNoZWNrZWQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4UmFkaW9Db21wb25lbnRcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1yYWRpby0tY2hlY2tlZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzICB0aGUgYGRpc2FibGVkYCBhdHRyaWJ1dGUuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXJhZGlvIGRpc2FibGVkPjwvaWd4LXJhZGlvPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNEaXNhYmxlZCA9ICB0aGlzLnJhZGlvLmRpc2FibGVkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtcmFkaW8tLWRpc2FibGVkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCBmYWxzZTtcbiAgICB9XG4gICAgcHVibGljIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9ICh2YWx1ZSBhcyBhbnkgPT09ICcnKSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgd2hldGhlciB0aGUgcmFkaW8gY29tcG9uZW50IGlzIG9uIGZvY3VzLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5yYWRpby5mb2N1cyA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0ZvY3VzZWQgPSAgdGhpcy5yYWRpby5mb2N1c2VkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtcmFkaW8tLWZvY3VzZWQnKVxuICAgIHB1YmxpYyBmb2N1c2VkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGlucHV0SWQgPSBgJHt0aGlzLmlkfS1pbnB1dGA7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX3JlcXVpcmVkID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX2Rpc2FibGVkO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9vblRvdWNoZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IG5vb3A7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfb25DaGFuZ2VDYWxsYmFjazogKF86IGFueSkgPT4gdm9pZCA9IG5vb3A7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHsgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnLCBbJyRldmVudCddKVxuICAgICBwdWJsaWMgX2NoYW5nZWQoKXtcbiAgICAgICAgIGlmKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpe1xuICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgfVxuICAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5dXAnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gICAgcHVibGljIF9jbGlja2VkKCkge1xuICAgICAgICB0aGlzLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdHMgdGhlIGN1cnJlbnQgcmFkaW8gYnV0dG9uLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnJhZGlvLnNlbGVjdCgpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdCgpIHtcbiAgICAgICAgdGhpcy5uYXRpdmVSYWRpby5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgICAgaWYoIXRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSwgcmFkaW86IHRoaXMgfSk7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMudmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzZWxlY3RzIHRoZSBjdXJyZW50IHJhZGlvIGJ1dHRvbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5yYWRpby5kZXNlbGVjdCgpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJhZGlvQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGRlc2VsZWN0KCkge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBjb25zaXN0ZW50IHRvIHRoZSBjdXJyZW50IHJhZGlvIGJ1dHRvbi5cbiAgICAgKiBJZiBpdCBpcywgdGhlIGNoZWNrZWQgYXR0cmlidXRlIHdpbGwgaGF2ZSB2YWx1ZSBgdHJ1ZWA7XG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMucmFkaW8ud3JpdGVWYWx1ZSgncmFkaW9CdXR0b25WYWx1ZScpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUgfHwgdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgZ2V0RWRpdEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZVJhZGlvLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGFiZWxDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubGFiZWxQb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSBSYWRpb0xhYmVsUG9zaXRpb24uQkVGT1JFOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLmNzc0NsYXNzfV9fbGFiZWwtLWJlZm9yZWA7XG4gICAgICAgICAgICBjYXNlIFJhZGlvTGFiZWxQb3NpdGlvbi5BRlRFUjpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuY3NzQ2xhc3N9X19sYWJlbGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgfVxufVxuIiwiPGlucHV0ICNyYWRpbyBjbGFzcz1cImlneC1yYWRpb19faW5wdXRcIiB0eXBlPVwicmFkaW9cIlxuICAgIFtpZF09XCJpbnB1dElkXCJcbiAgICBbbmFtZV09XCJuYW1lXCJcbiAgICBbdmFsdWVdPVwidmFsdWVcIlxuICAgIFt0YWJpbmRleF09XCJ0YWJpbmRleFwiXG4gICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICBbY2hlY2tlZF09XCJjaGVja2VkXCJcbiAgICBbcmVxdWlyZWRdPVwicmVxdWlyZWRcIlxuICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsID8gbnVsbCA6IGFyaWFMYWJlbGxlZEJ5XCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgKGJsdXIpPVwib25CbHVyKClcIiAvPlxuXG48c3BhbiAjbmF0aXZlTGFiZWwgY2xhc3M9XCJpZ3gtcmFkaW9fX2NvbXBvc2l0ZVwiIGlneFJpcHBsZVxuICAgIGlneFJpcHBsZVRhcmdldD1cIi5pZ3gtcmFkaW9fX3JpcHBsZVwiXG4gICAgW2lneFJpcHBsZURpc2FibGVkXT1cImRpc2FibGVSaXBwbGVcIlxuICAgIFtpZ3hSaXBwbGVDZW50ZXJlZF09XCJ0cnVlXCJcbiAgICBbaWd4UmlwcGxlRHVyYXRpb25dPVwiMzAwXCI+XG4gICAgPGRpdiBjbGFzcz1cImlneC1yYWRpb19fcmlwcGxlXCI+PC9kaXY+XG48L3NwYW4+XG5cbjxzcGFuICNwbGFjZWhvbGRlckxhYmVsXG4gICAgW2lkXT1cImxhYmVsSWRcIlxuICAgIFtjbGFzc109XCJsYWJlbENsYXNzXCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9zcGFuPlxuIl19