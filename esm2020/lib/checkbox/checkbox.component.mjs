import { Component, Directive, EventEmitter, HostListener, forwardRef, HostBinding, Input, NgModule, Output, ViewChild } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { mkenum } from '../core/utils';
import { noop } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../directives/ripple/ripple.directive";
export const LabelPosition = mkenum({
    BEFORE: 'before',
    AFTER: 'after'
});
let nextId = 0;
/**
 * Allows users to make a binary choice for a certain condition.
 *
 * @igxModule IgxCheckboxModule
 *
 * @igxTheme igx-checkbox-theme
 *
 * @igxKeywords checkbox, label
 *
 * @igxGroup Data entry and display
 *
 * @remarks
 * The Ignite UI Checkbox is a selection control that allows users to make a binary choice for a certain condition.It behaves similarly
 * to the native browser checkbox.
 *
 * @example
 * ```html
 * <igx-checkbox [checked]="true">
 *   simple checkbox
 * </igx-checkbox>
 * ```
 */
export class IgxCheckboxComponent {
    constructor() {
        /**
         * An event that is emitted after the checkbox state is changed.
         * Provides references to the `IgxCheckboxComponent` and the `checked` property as event arguments.
         */
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.change = new EventEmitter();
        /**
         * Sets/gets the `id` of the checkbox component.
         * If not set, the `id` of the first checkbox component will be `"igx-checkbox-0"`.
         *
         * @example
         * ```html
         * <igx-checkbox id="my-first-checkbox"></igx-checkbox>
         * ```
         * ```typescript
         * let checkboxId =  this.checkbox.id;
         * ```
         */
        this.id = `igx-checkbox-${nextId++}`;
        /**
         * Sets/gets the id of the `label` element.
         * If not set, the id of the `label` in the first checkbox component will be `"igx-checkbox-0-label"`.
         *
         * @example
         * ```html
         * <igx-checkbox labelId = "Label1"></igx-checkbox>
         * ```
         * ```typescript
         * let labelId =  this.checkbox.labelId;
         * ```
         */
        this.labelId = `${this.id}-label`;
        /**
         * Sets/gets the value of the `tabindex` attribute.
         *
         * @example
         * ```html
         * <igx-checkbox [tabindex] = "1"></igx-checkbox>
         * ```
         * ```typescript
         * let tabIndex =  this.checkbox.tabindex;
         * ```
         */
        this.tabindex = null;
        /**
         *  Sets/gets the position of the `label`.
         *  If not set, the `labelPosition` will have value `"after"`.
         *
         * @example
         * ```html
         * <igx-checkbox labelPosition = "before"></igx-checkbox>
         * ```
         * ```typescript
         * let labelPosition =  this.checkbox.labelPosition;
         * ```
         */
        this.labelPosition = LabelPosition.AFTER;
        /**
         * Enables/Disables the ripple effect.
         * If not set, `disableRipple` will have value `false`.
         *
         * @example
         * ```html
         * <igx-checkbox [disableRipple] = "true"></igx-checkbox>
         * ```
         * ```typescript
         * let isRippleDisabled = this.checkbox.desableRipple;
         * ```
         */
        this.disableRipple = false;
        /**
         * Sets/gets the `aria-labelledby` attribute.
         * If not set, the `aria-labelledby` will be equal to the value of `labelId` attribute.
         *
         * @example
         * ```html
         * <igx-checkbox aria-labelledby = "Checkbox1"></igx-checkbox>
         * ```
         * ```typescript
         * let ariaLabelledBy =  this.checkbox.ariaLabelledBy;
         * ```
         */
        this.ariaLabelledBy = this.labelId;
        /**
         * Sets/gets the value of the `aria-label` attribute.
         *
         * @example
         * ```html
         * <igx-checkbox aria-label = "Checkbox1"></igx-checkbox>
         * ```
         * ```typescript
         * let ariaLabel = this.checkbox.ariaLabel;
         * ```
         */
        this.ariaLabel = null;
        /**
         * Returns the class of the checkbox component.
         *
         * @example
         * ```typescript
         * let class =  this.checkbox.cssClass;
         * ```
         */
        this.cssClass = 'igx-checkbox';
        /**
         * Sets/gets whether the checkbox component is on focus.
         * Default value is `false`.
         *
         * @example
         * ```typescript
         * this.checkbox.focused =  true;
         * ```
         * ```typescript
         * let isFocused =  this.checkbox.focused;
         * ```
         */
        this.focused = false;
        /**
         * Sets/gets the checkbox indeterminate visual state.
         * Default value is `false`;
         *
         * @example
         * ```html
         * <igx-checkbox [indeterminate] = "true"></igx-checkbox>
         * ```
         * ```typescript
         * let isIndeterminate = this.checkbox.indeterminate;
         * ```
         */
        this.indeterminate = false;
        /**
         * Sets/gets whether the checkbox is readonly.
         * Default value is `false`.
         *
         * @example
         * ```html
         * <igx-checkbox [readonly]="true"></igx-checkbox>
         * ```
         * ```typescript
         * let readonly = this.checkbox.readonly;
         * ```
         */
        this.readonly = false;
        /**
         * Sets/gets whether the checkbox should disable all css transitions.
         * Default value is `false`.
         *
         * @example
         * ```html
         * <igx-checkbox [disableTransitions]="true"></igx-checkbox>
         * ```
         * ```typescript
         * let disableTransitions = this.checkbox.disableTransitions;
         * ```
         */
        this.disableTransitions = false;
        /** @hidden @internal */
        this.inputId = `${this.id}-input`;
        /**
         * @hidden
         * @internal
         */
        this._checked = false;
        /**
         * @hidden
         * @internal
         */
        this._required = false;
        /**
         * @hidden
         * @internal
         */
        this._disabled = false;
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
     * Sets/gets whether the checkbox is required.
     * If not set, `required` will have value `false`.
     *
     * @example
     * ```html
     * <igx-checkbox required></igx-checkbox>
     * ```
     * ```typescript
     * let isRequired =  this.checkbox.required;
     * ```
     */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = (value === '') || value;
    }
    /**
     * Sets/gets whether the checkbox is checked.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-checkbox [checked] = "true"></igx-checkbox>
     * ```
     * ```typescript
     * let isChecked =  this.checkbox.checked;
     * ```
     */
    get checked() {
        return this._checked;
    }
    set checked(value) {
        if (this._checked !== value) {
            this._checked = value;
            this._onChangeCallback(this._checked);
        }
    }
    /**
     * Sets/gets whether the checkbox is disabled.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-checkbox disabled></igx-checkbox>
     * ```
     * ```typescript
     * let isDisabled = this.checkbox.disabled;
     * ```
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = (value === '') || value;
    }
    /** @hidden @internal */
    onKeyUp(event) {
        event.stopPropagation();
        this.focused = true;
    }
    /** @hidden @internal */
    _onCheckboxClick(event) {
        // Since the original checkbox is hidden and the label
        // is used for styling and to change the checked state of the checkbox,
        // we need to prevent the checkbox click event from bubbling up
        // as it gets triggered on label click
        // NOTE: The above is no longer valid, as the native checkbox is not labeled
        // by the SVG anymore.
        if (this.disabled || this.readonly) {
            // readonly prevents the component from changing state (see toggle() method).
            // However, the native checkbox can still be activated through user interaction (focus + space, label click)
            // Prevent the native change so the input remains in sync
            event.preventDefault();
            return;
        }
        this.nativeCheckbox.nativeElement.focus();
        this.indeterminate = false;
        this.checked = !this.checked;
        // K.D. March 23, 2021 Emitting on click and not on the setter because otherwise every component
        // bound on change would have to perform self checks for weather the value has changed because
        // of the initial set on initialization
        this.change.emit({ checked: this._checked, checkbox: this });
    }
    /**
     * @hidden
     * @internal
     */
    get ariaChecked() {
        if (this.indeterminate) {
            return 'mixed';
        }
        else {
            return this.checked;
        }
    }
    /** @hidden @internal */
    _onCheckboxChange(event) {
        // We have to stop the original checkbox change event
        // from bubbling up since we emit our own change event
        event.stopPropagation();
    }
    /** @hidden @internal */
    onBlur() {
        this.focused = false;
        this._onTouchedCallback();
    }
    /** @hidden @internal */
    writeValue(value) {
        this._checked = value;
    }
    /** @hidden @internal */
    get labelClass() {
        switch (this.labelPosition) {
            case LabelPosition.BEFORE:
                return `${this.cssClass}__label--before`;
            case LabelPosition.AFTER:
            default:
                return `${this.cssClass}__label`;
        }
    }
    /** @hidden @internal */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /** @hidden @internal */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /** @hidden @internal */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** @hidden @internal */
    getEditElement() {
        return this.nativeCheckbox.nativeElement;
    }
}
IgxCheckboxComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxCheckboxComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCheckboxComponent, selector: "igx-checkbox", inputs: { id: "id", labelId: "labelId", value: "value", name: "name", tabindex: "tabindex", labelPosition: "labelPosition", disableRipple: "disableRipple", required: "required", ariaLabelledBy: ["aria-labelledby", "ariaLabelledBy"], ariaLabel: ["aria-label", "ariaLabel"], indeterminate: "indeterminate", checked: "checked", disabled: "disabled", readonly: "readonly", disableTransitions: "disableTransitions" }, outputs: { change: "change" }, host: { listeners: { "keyup": "onKeyUp($event)", "click": "_onCheckboxClick($event)" }, properties: { "attr.id": "this.id", "class.igx-checkbox": "this.cssClass", "class.igx-checkbox--focused": "this.focused", "class.igx-checkbox--indeterminate": "this.indeterminate", "class.igx-checkbox--checked": "this.checked", "class.igx-checkbox--disabled": "this.disabled", "class.igx-checkbox--plain": "this.disableTransitions" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxCheckboxComponent, multi: true }], viewQueries: [{ propertyName: "nativeCheckbox", first: true, predicate: ["checkbox"], descendants: true, static: true }, { propertyName: "nativeLabel", first: true, predicate: ["label"], descendants: true, static: true }, { propertyName: "placeholderLabel", first: true, predicate: ["placeholderLabel"], descendants: true, static: true }], ngImport: i0, template: "<input #checkbox class=\"igx-checkbox__input\"\n    type=\"checkbox\"\n    [id]=\"inputId\"\n    [name]=\"name\"\n    [value]=\"value\"\n    [tabindex]=\"tabindex\"\n    [disabled]=\"disabled\"\n    [indeterminate]=\"indeterminate\"\n    [checked]=\"checked\"\n    [required]=\"required\"\n    [attr.aria-checked]=\"ariaChecked\"\n    [attr.aria-labelledby]=\"ariaLabel ? null : ariaLabelledBy\"\n    [attr.aria-label]=\"ariaLabel\"\n    (change)=\"_onCheckboxChange($event)\"\n    (blur)=\"onBlur()\" />\n\n<div\n    igxRipple\n    igxRippleTarget=\".igx-checkbox__ripple\"\n    [igxRippleDisabled]=\"disableRipple\"\n    [igxRippleCentered]=\"true\"\n    [igxRippleDuration]=\"300\"\n    class=\"igx-checkbox__composite-wrapper\"\n>\n    <span #label class=\"igx-checkbox__composite\">\n        <svg class=\"igx-checkbox__composite-mark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n            <path d=\"M4.1,12.7 9,17.6 20.3,6.3\" />\n        </svg>\n    </span>\n\n    <div class=\"igx-checkbox__ripple\"></div>\n</div>\n\n<span #placeholderLabel\n    [class]=\"labelClass\"\n    [id]=\"labelId\">\n    <ng-content></ng-content>\n</span>\n", directives: [{ type: i1.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxComponent, decorators: [{
            type: Component,
            args: [{ providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxCheckboxComponent, multi: true }], selector: 'igx-checkbox', preserveWhitespaces: false, template: "<input #checkbox class=\"igx-checkbox__input\"\n    type=\"checkbox\"\n    [id]=\"inputId\"\n    [name]=\"name\"\n    [value]=\"value\"\n    [tabindex]=\"tabindex\"\n    [disabled]=\"disabled\"\n    [indeterminate]=\"indeterminate\"\n    [checked]=\"checked\"\n    [required]=\"required\"\n    [attr.aria-checked]=\"ariaChecked\"\n    [attr.aria-labelledby]=\"ariaLabel ? null : ariaLabelledBy\"\n    [attr.aria-label]=\"ariaLabel\"\n    (change)=\"_onCheckboxChange($event)\"\n    (blur)=\"onBlur()\" />\n\n<div\n    igxRipple\n    igxRippleTarget=\".igx-checkbox__ripple\"\n    [igxRippleDisabled]=\"disableRipple\"\n    [igxRippleCentered]=\"true\"\n    [igxRippleDuration]=\"300\"\n    class=\"igx-checkbox__composite-wrapper\"\n>\n    <span #label class=\"igx-checkbox__composite\">\n        <svg class=\"igx-checkbox__composite-mark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n            <path d=\"M4.1,12.7 9,17.6 20.3,6.3\" />\n        </svg>\n    </span>\n\n    <div class=\"igx-checkbox__ripple\"></div>\n</div>\n\n<span #placeholderLabel\n    [class]=\"labelClass\"\n    [id]=\"labelId\">\n    <ng-content></ng-content>\n</span>\n" }]
        }], propDecorators: { change: [{
                type: Output
            }], nativeCheckbox: [{
                type: ViewChild,
                args: ['checkbox', { static: true }]
            }], nativeLabel: [{
                type: ViewChild,
                args: ['label', { static: true }]
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
            }], value: [{
                type: Input
            }], name: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], labelPosition: [{
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
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-checkbox']
            }], focused: [{
                type: HostBinding,
                args: ['class.igx-checkbox--focused']
            }], indeterminate: [{
                type: HostBinding,
                args: ['class.igx-checkbox--indeterminate']
            }, {
                type: Input
            }], checked: [{
                type: HostBinding,
                args: ['class.igx-checkbox--checked']
            }, {
                type: Input
            }], disabled: [{
                type: HostBinding,
                args: ['class.igx-checkbox--disabled']
            }, {
                type: Input
            }], readonly: [{
                type: Input
            }], disableTransitions: [{
                type: HostBinding,
                args: ['class.igx-checkbox--plain']
            }, {
                type: Input
            }], onKeyUp: [{
                type: HostListener,
                args: ['keyup', ['$event']]
            }], _onCheckboxClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
export const IGX_CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IgxCheckboxRequiredDirective),
    multi: true
};
/* eslint-disable  @angular-eslint/directive-selector */
export class IgxCheckboxRequiredDirective extends CheckboxRequiredValidator {
}
IgxCheckboxRequiredDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxRequiredDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
IgxCheckboxRequiredDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCheckboxRequiredDirective, selector: "igx-checkbox[required][formControlName],\n    igx-checkbox[required][formControl],\n    igx-checkbox[required][ngModel]", providers: [IGX_CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxRequiredDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `igx-checkbox[required][formControlName],
    igx-checkbox[required][formControl],
    igx-checkbox[required][ngModel]`,
                    providers: [IGX_CHECKBOX_REQUIRED_VALIDATOR]
                }]
        }] });
/**
 * @hidden
 */
export class IgxCheckboxModule {
}
IgxCheckboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxCheckboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxModule, declarations: [IgxCheckboxComponent, IgxCheckboxRequiredDirective], imports: [IgxRippleModule], exports: [IgxCheckboxComponent, IgxCheckboxRequiredDirective] });
IgxCheckboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxModule, imports: [[IgxRippleModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxCheckboxComponent, IgxCheckboxRequiredDirective],
                    exports: [IgxCheckboxComponent, IgxCheckboxRequiredDirective],
                    imports: [IgxRippleModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NoZWNrYm94L2NoZWNrYm94LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jaGVja2JveC9jaGVja2JveC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEVBQ1osWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBRU4sU0FBUyxFQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx5QkFBeUIsRUFBd0IsYUFBYSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkgsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBa0IsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQUU1QixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLEtBQUssRUFBRSxPQUFPO0NBQ2pCLENBQUMsQ0FBQztBQVFILElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFPSCxNQUFNLE9BQU8sb0JBQW9CO0lBTmpDO1FBU0k7OztXQUdHO1FBQ0gsNERBQTREO1FBQ2xDLFdBQU0sR0FBMkMsSUFBSSxZQUFZLEVBQTRCLENBQUM7UUE4QnhIOzs7Ozs7Ozs7OztXQVdHO1FBR0ksT0FBRSxHQUFHLGdCQUFnQixNQUFNLEVBQUUsRUFBRSxDQUFD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QUVzQjtvQkFDaEMsU0FBUyxFQUFFLENBQUMsK0JBQStCLENBQUM7aUJBQy9DOztBQUdEOztHQUVHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQTVhakIsb0JBQW9CLEVBa2FwQiw0QkFBNEIsYUFRM0IsZUFBZSxhQTFhaEIsb0JBQW9CLEVBa2FwQiw0QkFBNEI7K0dBVTVCLGlCQUFpQixZQUZqQixDQUFDLGVBQWUsQ0FBQzsyRkFFakIsaUJBQWlCO2tCQUw3QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLDRCQUE0QixDQUFDO29CQUNsRSxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSw0QkFBNEIsQ0FBQztvQkFDN0QsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO2lCQUM3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIERpcmVjdGl2ZSxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIGZvcndhcmRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgT3V0cHV0LFxuICAgIFByb3ZpZGVyLFxuICAgIFZpZXdDaGlsZCxcbiAgICBFbGVtZW50UmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJQmFzZUV2ZW50QXJncywgbWtlbnVtIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBFZGl0b3JQcm92aWRlciB9IGZyb20gJy4uL2NvcmUvZWRpdC1wcm92aWRlcic7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBjb25zdCBMYWJlbFBvc2l0aW9uID0gbWtlbnVtKHtcbiAgICBCRUZPUkU6ICdiZWZvcmUnLFxuICAgIEFGVEVSOiAnYWZ0ZXInXG59KTtcbmV4cG9ydCB0eXBlIExhYmVsUG9zaXRpb24gPSB0eXBlb2YgTGFiZWxQb3NpdGlvbltrZXlvZiB0eXBlb2YgTGFiZWxQb3NpdGlvbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYW5nZUNoZWNrYm94RXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VFdmVudEFyZ3Mge1xuICAgIGNoZWNrZWQ6IGJvb2xlYW47XG4gICAgY2hlY2tib3g6IElneENoZWNrYm94Q29tcG9uZW50O1xufVxuXG5sZXQgbmV4dElkID0gMDtcbi8qKlxuICogQWxsb3dzIHVzZXJzIHRvIG1ha2UgYSBiaW5hcnkgY2hvaWNlIGZvciBhIGNlcnRhaW4gY29uZGl0aW9uLlxuICpcbiAqIEBpZ3hNb2R1bGUgSWd4Q2hlY2tib3hNb2R1bGVcbiAqXG4gKiBAaWd4VGhlbWUgaWd4LWNoZWNrYm94LXRoZW1lXG4gKlxuICogQGlneEtleXdvcmRzIGNoZWNrYm94LCBsYWJlbFxuICpcbiAqIEBpZ3hHcm91cCBEYXRhIGVudHJ5IGFuZCBkaXNwbGF5XG4gKlxuICogQHJlbWFya3NcbiAqIFRoZSBJZ25pdGUgVUkgQ2hlY2tib3ggaXMgYSBzZWxlY3Rpb24gY29udHJvbCB0aGF0IGFsbG93cyB1c2VycyB0byBtYWtlIGEgYmluYXJ5IGNob2ljZSBmb3IgYSBjZXJ0YWluIGNvbmRpdGlvbi5JdCBiZWhhdmVzIHNpbWlsYXJseVxuICogdG8gdGhlIG5hdGl2ZSBicm93c2VyIGNoZWNrYm94LlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8aWd4LWNoZWNrYm94IFtjaGVja2VkXT1cInRydWVcIj5cbiAqICAgc2ltcGxlIGNoZWNrYm94XG4gKiA8L2lneC1jaGVja2JveD5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogSWd4Q2hlY2tib3hDb21wb25lbnQsIG11bHRpOiB0cnVlIH1dLFxuICAgIHNlbGVjdG9yOiAnaWd4LWNoZWNrYm94JyxcbiAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZVVybDogJ2NoZWNrYm94LmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hDaGVja2JveENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBFZGl0b3JQcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IGJvb2xlYW4gfCAnJztcbiAgICBwcml2YXRlIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8ICcnO1xuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRoYXQgaXMgZW1pdHRlZCBhZnRlciB0aGUgY2hlY2tib3ggc3RhdGUgaXMgY2hhbmdlZC5cbiAgICAgKiBQcm92aWRlcyByZWZlcmVuY2VzIHRvIHRoZSBgSWd4Q2hlY2tib3hDb21wb25lbnRgIGFuZCB0aGUgYGNoZWNrZWRgIHByb3BlcnR5IGFzIGV2ZW50IGFyZ3VtZW50cy5cbiAgICAgKi9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L25vLW91dHB1dC1uYXRpdmVcbiAgICBAT3V0cHV0KCkgcHVibGljIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPElDaGFuZ2VDaGVja2JveEV2ZW50QXJncz4gPSBuZXcgRXZlbnRFbWl0dGVyPElDaGFuZ2VDaGVja2JveEV2ZW50QXJncz4oKTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGNoZWNrYm94IGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY2hlY2tib3hFbGVtZW50ID0gIHRoaXMuY2hlY2tib3guY2hlY2tib3hFbGVtZW50O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2NoZWNrYm94JywgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIG5hdGl2ZUNoZWNrYm94OiBFbGVtZW50UmVmO1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgcmVmZXJlbmNlIHRvIHRoZSBuYXRpdmUgbGFiZWwgZWxlbWVudC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBsYWJlbEVsZW1lbnQgPSAgdGhpcy5jaGVja2JveC5uYXRpdmVMYWJlbDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdsYWJlbCcsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIG5hdGl2ZUxhYmVsOiBFbGVtZW50UmVmO1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgcmVmZXJlbmNlIHRvIHRoZSBsYWJlbCBwbGFjZWhvbGRlciBlbGVtZW50LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGxhYmVsUGxhY2Vob2xkZXIgPSAgdGhpcy5jaGVja2JveC5wbGFjZWhvbGRlckxhYmVsO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3BsYWNlaG9sZGVyTGFiZWwnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBwbGFjZWhvbGRlckxhYmVsOiBFbGVtZW50UmVmO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGlkYCBvZiB0aGUgY2hlY2tib3ggY29tcG9uZW50LlxuICAgICAqIElmIG5vdCBzZXQsIHRoZSBgaWRgIG9mIHRoZSBmaXJzdCBjaGVja2JveCBjb21wb25lbnQgd2lsbCBiZSBgXCJpZ3gtY2hlY2tib3gtMFwiYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2hlY2tib3ggaWQ9XCJteS1maXJzdC1jaGVja2JveFwiPjwvaWd4LWNoZWNrYm94PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY2hlY2tib3hJZCA9ICB0aGlzLmNoZWNrYm94LmlkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5pZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWQgPSBgaWd4LWNoZWNrYm94LSR7bmV4dElkKyt9YDtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGlkIG9mIHRoZSBgbGFiZWxgIGVsZW1lbnQuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGlkIG9mIHRoZSBgbGFiZWxgIGluIHRoZSBmaXJzdCBjaGVja2JveCBjb21wb25lbnQgd2lsbCBiZSBgXCJpZ3gtY2hlY2tib3gtMC1sYWJlbFwiYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2hlY2tib3ggbGFiZWxJZCA9IFwiTGFiZWwxXCI+PC9pZ3gtY2hlY2tib3g+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBsYWJlbElkID0gIHRoaXMuY2hlY2tib3gubGFiZWxJZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbGFiZWxJZCA9IGAke3RoaXMuaWR9LWxhYmVsYDtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGB2YWx1ZWAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jaGVja2JveCBbdmFsdWVdID0gXCInQ2hlY2tib3hWYWx1ZSdcIj48L2lneC1jaGVja2JveD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHZhbHVlID0gIHRoaXMuY2hlY2tib3gudmFsdWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHZhbHVlOiBhbnk7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgbmFtZWAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jaGVja2JveCBuYW1lID0gXCJDaGVja2JveDFcIj48L2lneC1jaGVja2JveD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IG5hbWUgPSAgdGhpcy5jaGVja2JveC5uYW1lO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYHRhYmluZGV4YCBhdHRyaWJ1dGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNoZWNrYm94IFt0YWJpbmRleF0gPSBcIjFcIj48L2lneC1jaGVja2JveD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHRhYkluZGV4ID0gIHRoaXMuY2hlY2tib3gudGFiaW5kZXg7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHRhYmluZGV4OiBudW1iZXIgPSBudWxsO1xuICAgIC8qKlxuICAgICAqICBTZXRzL2dldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBgbGFiZWxgLlxuICAgICAqICBJZiBub3Qgc2V0LCB0aGUgYGxhYmVsUG9zaXRpb25gIHdpbGwgaGF2ZSB2YWx1ZSBgXCJhZnRlclwiYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2hlY2tib3ggbGFiZWxQb3NpdGlvbiA9IFwiYmVmb3JlXCI+PC9pZ3gtY2hlY2tib3g+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBsYWJlbFBvc2l0aW9uID0gIHRoaXMuY2hlY2tib3gubGFiZWxQb3NpdGlvbjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbGFiZWxQb3NpdGlvbjogTGFiZWxQb3NpdGlvbiB8IHN0cmluZyA9IExhYmVsUG9zaXRpb24uQUZURVI7XG4gICAgLyoqXG4gICAgICogRW5hYmxlcy9EaXNhYmxlcyB0aGUgcmlwcGxlIGVmZmVjdC5cbiAgICAgKiBJZiBub3Qgc2V0LCBgZGlzYWJsZVJpcHBsZWAgd2lsbCBoYXZlIHZhbHVlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNoZWNrYm94IFtkaXNhYmxlUmlwcGxlXSA9IFwidHJ1ZVwiPjwvaWd4LWNoZWNrYm94PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNSaXBwbGVEaXNhYmxlZCA9IHRoaXMuY2hlY2tib3guZGVzYWJsZVJpcHBsZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZVJpcHBsZSA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBjaGVja2JveCBpcyByZXF1aXJlZC5cbiAgICAgKiBJZiBub3Qgc2V0LCBgcmVxdWlyZWRgIHdpbGwgaGF2ZSB2YWx1ZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jaGVja2JveCByZXF1aXJlZD48L2lneC1jaGVja2JveD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzUmVxdWlyZWQgPSAgdGhpcy5jaGVja2JveC5yZXF1aXJlZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICAgQElucHV0KClcbiAgICAgcHVibGljIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZDtcbiAgICAgfVxuICAgICBwdWJsaWMgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgICB0aGlzLl9yZXF1aXJlZCA9ICh2YWx1ZSBhcyBhbnkgPT09ICcnKSB8fCB2YWx1ZTtcbiAgICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLlxuICAgICAqIElmIG5vdCBzZXQsIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCB3aWxsIGJlIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgbGFiZWxJZGAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jaGVja2JveCBhcmlhLWxhYmVsbGVkYnkgPSBcIkNoZWNrYm94MVwiPjwvaWd4LWNoZWNrYm94PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgYXJpYUxhYmVsbGVkQnkgPSAgdGhpcy5jaGVja2JveC5hcmlhTGFiZWxsZWRCeTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpXG4gICAgcHVibGljIGFyaWFMYWJlbGxlZEJ5ID0gdGhpcy5sYWJlbElkO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBhcmlhLWxhYmVsYCBhdHRyaWJ1dGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNoZWNrYm94IGFyaWEtbGFiZWwgPSBcIkNoZWNrYm94MVwiPjwvaWd4LWNoZWNrYm94PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgYXJpYUxhYmVsID0gdGhpcy5jaGVja2JveC5hcmlhTGFiZWw7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdhcmlhLWxhYmVsJylcbiAgICBwdWJsaWMgYXJpYUxhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjbGFzcyBvZiB0aGUgY2hlY2tib3ggY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNsYXNzID0gIHRoaXMuY2hlY2tib3guY3NzQ2xhc3M7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2hlY2tib3gnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtY2hlY2tib3gnO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBjaGVja2JveCBjb21wb25lbnQgaXMgb24gZm9jdXMuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jaGVja2JveC5mb2N1c2VkID0gIHRydWU7XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0ZvY3VzZWQgPSAgdGhpcy5jaGVja2JveC5mb2N1c2VkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWNoZWNrYm94LS1mb2N1c2VkJylcbiAgICBwdWJsaWMgZm9jdXNlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgY2hlY2tib3ggaW5kZXRlcm1pbmF0ZSB2aXN1YWwgc3RhdGUuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgO1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jaGVja2JveCBbaW5kZXRlcm1pbmF0ZV0gPSBcInRydWVcIj48L2lneC1jaGVja2JveD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzSW5kZXRlcm1pbmF0ZSA9IHRoaXMuY2hlY2tib3guaW5kZXRlcm1pbmF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1jaGVja2JveC0taW5kZXRlcm1pbmF0ZScpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBjaGVja2JveCBpcyBjaGVja2VkLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2hlY2tib3ggW2NoZWNrZWRdID0gXCJ0cnVlXCI+PC9pZ3gtY2hlY2tib3g+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0NoZWNrZWQgPSAgdGhpcy5jaGVja2JveC5jaGVja2VkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWNoZWNrYm94LS1jaGVja2VkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgY2hlY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgY2hlY2tlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZih0aGlzLl9jaGVja2VkICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY2hlY2tlZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLl9jaGVja2VkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBjaGVja2JveCBpcyBkaXNhYmxlZC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNoZWNrYm94IGRpc2FibGVkPjwvaWd4LWNoZWNrYm94PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNEaXNhYmxlZCA9IHRoaXMuY2hlY2tib3guZGlzYWJsZWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2hlY2tib3gtLWRpc2FibGVkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG4gICAgcHVibGljIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9ICh2YWx1ZSBhcyBhbnkgPT09ICcnKSB8fCB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIHJlYWRvbmx5LlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2hlY2tib3ggW3JlYWRvbmx5XT1cInRydWVcIj48L2lneC1jaGVja2JveD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHJlYWRvbmx5ID0gdGhpcy5jaGVja2JveC5yZWFkb25seTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgcmVhZG9ubHkgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgd2hldGhlciB0aGUgY2hlY2tib3ggc2hvdWxkIGRpc2FibGUgYWxsIGNzcyB0cmFuc2l0aW9ucy5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNoZWNrYm94IFtkaXNhYmxlVHJhbnNpdGlvbnNdPVwidHJ1ZVwiPjwvaWd4LWNoZWNrYm94PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZGlzYWJsZVRyYW5zaXRpb25zID0gdGhpcy5jaGVja2JveC5kaXNhYmxlVHJhbnNpdGlvbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2hlY2tib3gtLXBsYWluJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlVHJhbnNpdGlvbnMgPSBmYWxzZTtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaW5wdXRJZCA9IGAke3RoaXMuaWR9LWlucHV0YDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfY2hlY2tlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9yZXF1aXJlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9vblRvdWNoZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IG5vb3A7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgX29uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBfb25DaGVja2JveENsaWNrKGV2ZW50OiBQb2ludGVyRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgICAgIC8vIFNpbmNlIHRoZSBvcmlnaW5hbCBjaGVja2JveCBpcyBoaWRkZW4gYW5kIHRoZSBsYWJlbFxuICAgICAgICAvLyBpcyB1c2VkIGZvciBzdHlsaW5nIGFuZCB0byBjaGFuZ2UgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIGNoZWNrYm94LFxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHByZXZlbnQgdGhlIGNoZWNrYm94IGNsaWNrIGV2ZW50IGZyb20gYnViYmxpbmcgdXBcbiAgICAgICAgLy8gYXMgaXQgZ2V0cyB0cmlnZ2VyZWQgb24gbGFiZWwgY2xpY2tcbiAgICAgICAgLy8gTk9URTogVGhlIGFib3ZlIGlzIG5vIGxvbmdlciB2YWxpZCwgYXMgdGhlIG5hdGl2ZSBjaGVja2JveCBpcyBub3QgbGFiZWxlZFxuICAgICAgICAvLyBieSB0aGUgU1ZHIGFueW1vcmUuXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIC8vIHJlYWRvbmx5IHByZXZlbnRzIHRoZSBjb21wb25lbnQgZnJvbSBjaGFuZ2luZyBzdGF0ZSAoc2VlIHRvZ2dsZSgpIG1ldGhvZCkuXG4gICAgICAgICAgICAvLyBIb3dldmVyLCB0aGUgbmF0aXZlIGNoZWNrYm94IGNhbiBzdGlsbCBiZSBhY3RpdmF0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uIChmb2N1cyArIHNwYWNlLCBsYWJlbCBjbGljaylcbiAgICAgICAgICAgIC8vIFByZXZlbnQgdGhlIG5hdGl2ZSBjaGFuZ2Ugc28gdGhlIGlucHV0IHJlbWFpbnMgaW4gc3luY1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmF0aXZlQ2hlY2tib3gubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMuaW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSAhdGhpcy5jaGVja2VkO1xuICAgICAgICAvLyBLLkQuIE1hcmNoIDIzLCAyMDIxIEVtaXR0aW5nIG9uIGNsaWNrIGFuZCBub3Qgb24gdGhlIHNldHRlciBiZWNhdXNlIG90aGVyd2lzZSBldmVyeSBjb21wb25lbnRcbiAgICAgICAgLy8gYm91bmQgb24gY2hhbmdlIHdvdWxkIGhhdmUgdG8gcGVyZm9ybSBzZWxmIGNoZWNrcyBmb3Igd2VhdGhlciB0aGUgdmFsdWUgaGFzIGNoYW5nZWQgYmVjYXVzZVxuICAgICAgICAvLyBvZiB0aGUgaW5pdGlhbCBzZXQgb24gaW5pdGlhbGl6YXRpb25cbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7IGNoZWNrZWQ6IHRoaXMuX2NoZWNrZWQsIGNoZWNrYm94OiB0aGlzIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGFyaWFDaGVja2VkKCkge1xuICAgICAgIGlmICh0aGlzLmluZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgICAgcmV0dXJuICdtaXhlZCc7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tlZDtcbiAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIF9vbkNoZWNrYm94Q2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICAvLyBXZSBoYXZlIHRvIHN0b3AgdGhlIG9yaWdpbmFsIGNoZWNrYm94IGNoYW5nZSBldmVudFxuICAgICAgICAvLyBmcm9tIGJ1YmJsaW5nIHVwIHNpbmNlIHdlIGVtaXQgb3VyIG93biBjaGFuZ2UgZXZlbnRcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fY2hlY2tlZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgbGFiZWxDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubGFiZWxQb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSBMYWJlbFBvc2l0aW9uLkJFRk9SRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5jc3NDbGFzc31fX2xhYmVsLS1iZWZvcmVgO1xuICAgICAgICAgICAgY2FzZSBMYWJlbFBvc2l0aW9uLkFGVEVSOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5jc3NDbGFzc31fX2xhYmVsYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXRFZGl0RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0aXZlQ2hlY2tib3gubmF0aXZlRWxlbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJR1hfQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SOiBQcm92aWRlciA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IElneENoZWNrYm94UmVxdWlyZWREaXJlY3RpdmUpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvciAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IGBpZ3gtY2hlY2tib3hbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sXG4gICAgaWd4LWNoZWNrYm94W3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sXG4gICAgaWd4LWNoZWNrYm94W3JlcXVpcmVkXVtuZ01vZGVsXWAsXG4gICAgcHJvdmlkZXJzOiBbSUdYX0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2hlY2tib3hSZXF1aXJlZERpcmVjdGl2ZSBleHRlbmRzIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3Ige31cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4Q2hlY2tib3hDb21wb25lbnQsIElneENoZWNrYm94UmVxdWlyZWREaXJlY3RpdmVdLFxuICAgIGV4cG9ydHM6IFtJZ3hDaGVja2JveENvbXBvbmVudCwgSWd4Q2hlY2tib3hSZXF1aXJlZERpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0lneFJpcHBsZU1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2hlY2tib3hNb2R1bGUge31cbiIsIjxpbnB1dCAjY2hlY2tib3ggY2xhc3M9XCJpZ3gtY2hlY2tib3hfX2lucHV0XCJcbiAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgIFtpZF09XCJpbnB1dElkXCJcbiAgICBbbmFtZV09XCJuYW1lXCJcbiAgICBbdmFsdWVdPVwidmFsdWVcIlxuICAgIFt0YWJpbmRleF09XCJ0YWJpbmRleFwiXG4gICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICBbaW5kZXRlcm1pbmF0ZV09XCJpbmRldGVybWluYXRlXCJcbiAgICBbY2hlY2tlZF09XCJjaGVja2VkXCJcbiAgICBbcmVxdWlyZWRdPVwicmVxdWlyZWRcIlxuICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJhcmlhQ2hlY2tlZFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbCA/IG51bGwgOiBhcmlhTGFiZWxsZWRCeVwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgIChjaGFuZ2UpPVwiX29uQ2hlY2tib3hDaGFuZ2UoJGV2ZW50KVwiXG4gICAgKGJsdXIpPVwib25CbHVyKClcIiAvPlxuXG48ZGl2XG4gICAgaWd4UmlwcGxlXG4gICAgaWd4UmlwcGxlVGFyZ2V0PVwiLmlneC1jaGVja2JveF9fcmlwcGxlXCJcbiAgICBbaWd4UmlwcGxlRGlzYWJsZWRdPVwiZGlzYWJsZVJpcHBsZVwiXG4gICAgW2lneFJpcHBsZUNlbnRlcmVkXT1cInRydWVcIlxuICAgIFtpZ3hSaXBwbGVEdXJhdGlvbl09XCIzMDBcIlxuICAgIGNsYXNzPVwiaWd4LWNoZWNrYm94X19jb21wb3NpdGUtd3JhcHBlclwiXG4+XG4gICAgPHNwYW4gI2xhYmVsIGNsYXNzPVwiaWd4LWNoZWNrYm94X19jb21wb3NpdGVcIj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cImlneC1jaGVja2JveF9fY29tcG9zaXRlLW1hcmtcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk00LjEsMTIuNyA5LDE3LjYgMjAuMyw2LjNcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICA8L3NwYW4+XG5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWNoZWNrYm94X19yaXBwbGVcIj48L2Rpdj5cbjwvZGl2PlxuXG48c3BhbiAjcGxhY2Vob2xkZXJMYWJlbFxuICAgIFtjbGFzc109XCJsYWJlbENsYXNzXCJcbiAgICBbaWRdPVwibGFiZWxJZFwiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvc3Bhbj5cbiJdfQ==