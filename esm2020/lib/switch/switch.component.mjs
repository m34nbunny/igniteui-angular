import { Component, Directive, EventEmitter, forwardRef, HostBinding, Input, NgModule, Output, ViewChild, HostListener } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { mkenum } from '../core/utils';
import { noop } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../directives/ripple/ripple.directive";
export const SwitchLabelPosition = mkenum({
    BEFORE: 'before',
    AFTER: 'after'
});
let nextId = 0;
/**
 *
 * The Switch component is a binary choice selection component.
 *
 * @igxModule IgxSwitchModule
 *
 * @igxTheme igx-switch-theme, igx-tooltip-theme
 *
 * @igxKeywords switch, states, tooltip
 *
 * @igxGroup Data Entry & Display
 *
 * @remarks
 *
 * The Ignite UI Switch lets the user toggle between on/off or true/false states.
 *
 * @example
 * ```html
 * <igx-switch [checked]="true">
 *   Simple switch
 * </igx-switch>
 * ```
 */
export class IgxSwitchComponent {
    constructor() {
        /**
         * Sets/gets the `id` of the switch component.
         * If not set, the `id` of the first switch component will be `"igx-switch-0"`.
         *
         * @example
         * ```html
         * <igx-switch id="my-first-switch"></igx-switch>
         * ```
         */
        this.id = `igx-switch-${nextId++}`;
        /**
         * Sets/gets the id of the `label` element of the switch component.
         * If not set, the label of the first switch component will have value `"igx-switch-0-label"`.
         *
         * @example
         * ```html
         * <igx-switch labelId="Label1"></igx-switch>
         * ```
         */
        this.labelId = `${this.id}-label`;
        /**
         * Sets/gets the value of the `tabindex` attribute.
         *
         * @example
         * ```html
         * <igx-switch [tabindex]="1"></igx-switch>
         * ```
         */
        this.tabindex = null;
        /**
         * Sets/gets the position of the `label` in the switch component.
         * If not set, `labelPosition` will have value `"after"`.
         *
         * @example
         * ```html
         * <igx-switch labelPosition="before"></igx-switch>
         * ```
         */
        this.labelPosition = 'after';
        /**
         * Enables/Disables the ripple effect
         * If not set, `disableRipple` will have value `false`.
         *
         * @example
         * ```html
         * <igx-switch [disableRipple]="true"></igx-switch>
         * ```
         */
        this.disableRipple = false;
        /**
         * Sets/gets the `aria-labelledBy` attribute.
         * If not set, the  value of `aria-labelledBy` will be equal to the value of `labelId` attribute.
         *
         * @example
         * ```html
         * <igx-switch aria-labelledby = "Label1"></igx-switch>
         * ```
         */
        this.ariaLabelledBy = this.labelId;
        /**
         * Sets/gets the value of the `aria-label` attribute.
         *
         * @example
         * ```html
         * <igx-switch aria-label="Label1"></igx-switch>
         * ```
         */
        this.ariaLabel = null;
        /**
         * An event that is emitted after the switch state is changed.
         * Provides references to the `IgxSwitchComponent` and the `checked` property as event arguments.
         */
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.change = new EventEmitter();
        /**
         * Returns the class of the switch component.
         *
         * @example
         * ```typescript
         * let switchClass = this.switch.cssClass;
         * ```
         */
        this.cssClass = 'igx-switch';
        /**
         * Sets/gets whether the switch component is on focus.
         * Default value is `false`.
         *
         * @example
         * ```typescript
         * this.switch.focused = true;
         * ```
         */
        this.focused = false;
        /**
         * @hidden
         * @internal
         */
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
         * @internal
         */
        this._onTouchedCallback = noop;
        /**
         * @hidden
         * @internal
         */
        this._onChangeCallback = noop;
    }
    /**
     * Sets/gets whether switch is required.
     * If not set, `required` will have value `false`.
     *
     * @example
     * ```html
     * <igx-switch required></igx-switch>
     * ```
     */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = (value === '') || value;
    }
    /**
     * Sets/gets whether the switch is on or off.
     * Default value is 'false'.
     *
     * @example
     * ```html
     *  <igx-switch [checked]="true"></igx-switch>
     * ```
     */
    set checked(value) {
        if (this._checked !== value) {
            this._checked = value;
            this._onChangeCallback(this.checked);
        }
    }
    get checked() {
        return this._checked;
    }
    /**
     * Sets/gets the `disabled` attribute.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-switch disabled><igx-switch>
     * ```
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = (value === '') || value;
    }
    /**
     * @hidden
     * @internal
     */
    onKeyUp(event) {
        event.stopPropagation();
        this.focused = true;
    }
    /**
     * @hidden
     * @internal
     */
    _onSwitchClick() {
        if (this.disabled) {
            return;
        }
        this.nativeCheckbox.nativeElement.focus();
        this.checked = !this.checked;
        // K.D. March 23, 2021 Emitting on click and not on the setter because otherwise every component
        // bound on change would have to perform self checks for weather the value has changed because
        // of the initial set on initialization
        this.change.emit({ checked: this.checked, switch: this });
    }
    /**
     * @hidden
     * @internal
     */
    _onSwitchChange(event) {
        event.stopPropagation();
    }
    /**
     * @hidden
     * @internal
     */
    onBlur() {
        this.focused = false;
        this._onTouchedCallback();
    }
    /**
     * @hidden
     * @internal
     */
    writeValue(value) {
        this._checked = value;
    }
    /**
     * @hidden
     * @internal
     */
    getEditElement() {
        return this.nativeCheckbox.nativeElement;
    }
    /**
     * @hidden
     * @internal
     */
    get labelClass() {
        switch (this.labelPosition) {
            case SwitchLabelPosition.BEFORE:
                return `${this.cssClass}__label--before`;
            case SwitchLabelPosition.AFTER:
            default:
                return `${this.cssClass}__label`;
        }
    }
    /**
     * @hidden
     * @internal
     */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /**
     * @hidden
     * @internal
     */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /** @hidden @internal */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
IgxSwitchComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxSwitchComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSwitchComponent, selector: "igx-switch", inputs: { id: "id", labelId: "labelId", value: "value", name: "name", tabindex: "tabindex", labelPosition: "labelPosition", disableRipple: "disableRipple", required: "required", ariaLabelledBy: ["aria-labelledby", "ariaLabelledBy"], ariaLabel: ["aria-label", "ariaLabel"], checked: "checked", disabled: "disabled" }, outputs: { change: "change" }, host: { listeners: { "keyup": "onKeyUp($event)", "click": "_onSwitchClick()" }, properties: { "attr.id": "this.id", "class.igx-switch": "this.cssClass", "class.igx-switch--checked": "this.checked", "class.igx-switch--disabled": "this.disabled", "class.igx-switch--focused": "this.focused" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxSwitchComponent, multi: true }], viewQueries: [{ propertyName: "nativeCheckbox", first: true, predicate: ["checkbox"], descendants: true, static: true }, { propertyName: "nativeLabel", first: true, predicate: ["label"], descendants: true, static: true }, { propertyName: "placeholderLabel", first: true, predicate: ["placeholderLabel"], descendants: true, static: true }], ngImport: i0, template: "<input #checkbox class=\"igx-switch__input\" type=\"checkbox\"\n    [id]=\"inputId\"\n    [name]=\"name\"\n    [value]=\"value\"\n    [tabindex]=\"tabindex\"\n    [disabled]=\"disabled\"\n    [checked]=\"checked\"\n    [required]=\"required\"\n    [attr.aria-checked]=\"checked\"\n    [attr.aria-labelledby]=\"ariaLabel ? null : ariaLabelledBy\"\n    [attr.aria-label]=\"ariaLabel\"\n    (change)=\"_onSwitchChange($event)\"\n    (blur)=\"onBlur()\" />\n\n<span #label class =\"igx-switch__composite\"\n    igxRipple\n    igxRippleTarget=\".igx-switch__ripple\"\n    [igxRippleDisabled]=\"disableRipple\"\n    [igxRippleCentered]=\"true\"\n    [igxRippleDuration]=\"300\">\n    <div class=\"igx-switch__composite-thumb\">\n        <div class=\"igx-switch__ripple\"></div>\n    </div>\n</span>\n\n<span #placeholderLabel\n    [class]=\"labelClass\"\n    [id]=\"labelId\">\n    <ng-content></ng-content>\n</span>\n", directives: [{ type: i1.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchComponent, decorators: [{
            type: Component,
            args: [{ providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxSwitchComponent, multi: true }], selector: 'igx-switch', template: "<input #checkbox class=\"igx-switch__input\" type=\"checkbox\"\n    [id]=\"inputId\"\n    [name]=\"name\"\n    [value]=\"value\"\n    [tabindex]=\"tabindex\"\n    [disabled]=\"disabled\"\n    [checked]=\"checked\"\n    [required]=\"required\"\n    [attr.aria-checked]=\"checked\"\n    [attr.aria-labelledby]=\"ariaLabel ? null : ariaLabelledBy\"\n    [attr.aria-label]=\"ariaLabel\"\n    (change)=\"_onSwitchChange($event)\"\n    (blur)=\"onBlur()\" />\n\n<span #label class =\"igx-switch__composite\"\n    igxRipple\n    igxRippleTarget=\".igx-switch__ripple\"\n    [igxRippleDisabled]=\"disableRipple\"\n    [igxRippleCentered]=\"true\"\n    [igxRippleDuration]=\"300\">\n    <div class=\"igx-switch__composite-thumb\">\n        <div class=\"igx-switch__ripple\"></div>\n    </div>\n</span>\n\n<span #placeholderLabel\n    [class]=\"labelClass\"\n    [id]=\"labelId\">\n    <ng-content></ng-content>\n</span>\n" }]
        }], propDecorators: { nativeCheckbox: [{
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
            }], change: [{
                type: Output
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-switch']
            }], checked: [{
                type: HostBinding,
                args: ['class.igx-switch--checked']
            }, {
                type: Input
            }], disabled: [{
                type: HostBinding,
                args: ['class.igx-switch--disabled']
            }, {
                type: Input
            }], focused: [{
                type: HostBinding,
                args: ['class.igx-switch--focused']
            }], onKeyUp: [{
                type: HostListener,
                args: ['keyup', ['$event']]
            }], _onSwitchClick: [{
                type: HostListener,
                args: ['click']
            }] } });
export const IGX_SWITCH_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IgxSwitchRequiredDirective),
    multi: true
};
/* eslint-disable  @angular-eslint/directive-selector */
export class IgxSwitchRequiredDirective extends CheckboxRequiredValidator {
}
IgxSwitchRequiredDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchRequiredDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
IgxSwitchRequiredDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxSwitchRequiredDirective, selector: "igx-switch[required][formControlName],\n    igx-switch[required][formControl],\n    igx-switch[required][ngModel]", providers: [IGX_SWITCH_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchRequiredDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `igx-switch[required][formControlName],
    igx-switch[required][formControl],
    igx-switch[required][ngModel]`,
                    providers: [IGX_SWITCH_REQUIRED_VALIDATOR]
                }]
        }] });
/**
 * @hidden
 */
export class IgxSwitchModule {
}
IgxSwitchModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxSwitchModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchModule, declarations: [IgxSwitchComponent, IgxSwitchRequiredDirective], imports: [IgxRippleModule], exports: [IgxSwitchComponent, IgxSwitchRequiredDirective] });
IgxSwitchModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchModule, imports: [[IgxRippleModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSwitchModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxSwitchComponent, IgxSwitchRequiredDirective],
                    exports: [IgxSwitchComponent, IgxSwitchRequiredDirective],
                    imports: [IgxRippleModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zd2l0Y2gvc3dpdGNoLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zd2l0Y2gvc3dpdGNoLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUVOLFNBQVMsRUFFVCxZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUF3QixhQUFhLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFrQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0FBRTVCLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQztJQUN0QyxNQUFNLEVBQUUsUUFBUTtJQUNoQixLQUFLLEVBQUUsT0FBTztDQUNqQixDQUFDLENBQUM7QUFRSCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQU1ILE1BQU0sT0FBTyxrQkFBa0I7SUFML0I7UUFzQ0k7Ozs7Ozs7O1dBUUc7UUFFYSxPQUFFLEdBQUcsY0FBYyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBQzlDOzs7Ozs7OztXQVFHO1FBQ2EsWUFBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDO1FBbUI3Qzs7Ozs7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STtDQUNkLENBQUM7QUFFRix3REFBd0Q7QUFPeEQsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHlCQUF5Qjs7dUhBQTVELDBCQUEwQjsyR0FBMUIsMEJBQTBCLDRJQUZ4QixDQUFDLDZCQUE2QixDQUFDOzJGQUVqQywwQkFBMEI7a0JBTnRDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFOztrQ0FFb0I7b0JBQzlCLFNBQVMsRUFBRSxDQUFDLDZCQUE2QixDQUFDO2lCQUM3Qzs7QUFHRDs7R0FFRztBQU1ILE1BQU0sT0FBTyxlQUFlOzs0R0FBZixlQUFlOzZHQUFmLGVBQWUsaUJBMVZmLGtCQUFrQixFQWdWbEIsMEJBQTBCLGFBUXpCLGVBQWUsYUF4VmhCLGtCQUFrQixFQWdWbEIsMEJBQTBCOzZHQVUxQixlQUFlLFlBRmYsQ0FBQyxlQUFlLENBQUM7MkZBRWpCLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUM7b0JBQzlELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLDBCQUEwQixDQUFDO29CQUN6RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7aUJBQzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgRGlyZWN0aXZlLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBmb3J3YXJkUmVmLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE91dHB1dCxcbiAgICBQcm92aWRlcixcbiAgICBWaWV3Q2hpbGQsXG4gICAgRWxlbWVudFJlZixcbiAgICBIb3N0TGlzdGVuZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMSURBVE9SUywgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBJZ3hSaXBwbGVNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3JpcHBsZS9yaXBwbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzLCBta2VudW0gfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IEVkaXRvclByb3ZpZGVyIH0gZnJvbSAnLi4vY29yZS9lZGl0LXByb3ZpZGVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGNvbnN0IFN3aXRjaExhYmVsUG9zaXRpb24gPSBta2VudW0oe1xuICAgIEJFRk9SRTogJ2JlZm9yZScsXG4gICAgQUZURVI6ICdhZnRlcidcbn0pO1xuZXhwb3J0IHR5cGUgU3dpdGNoTGFiZWxQb3NpdGlvbiA9ICh0eXBlb2YgU3dpdGNoTGFiZWxQb3NpdGlvbilba2V5b2YgdHlwZW9mIFN3aXRjaExhYmVsUG9zaXRpb25dO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGFuZ2VTd2l0Y2hFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncyB7XG4gICAgY2hlY2tlZDogYm9vbGVhbjtcbiAgICBzd2l0Y2g6IElneFN3aXRjaENvbXBvbmVudDtcbn1cblxubGV0IG5leHRJZCA9IDA7XG4vKipcbiAqXG4gKiBUaGUgU3dpdGNoIGNvbXBvbmVudCBpcyBhIGJpbmFyeSBjaG9pY2Ugc2VsZWN0aW9uIGNvbXBvbmVudC5cbiAqXG4gKiBAaWd4TW9kdWxlIElneFN3aXRjaE1vZHVsZVxuICpcbiAqIEBpZ3hUaGVtZSBpZ3gtc3dpdGNoLXRoZW1lLCBpZ3gtdG9vbHRpcC10aGVtZVxuICpcbiAqIEBpZ3hLZXl3b3JkcyBzd2l0Y2gsIHN0YXRlcywgdG9vbHRpcFxuICpcbiAqIEBpZ3hHcm91cCBEYXRhIEVudHJ5ICYgRGlzcGxheVxuICpcbiAqIEByZW1hcmtzXG4gKlxuICogVGhlIElnbml0ZSBVSSBTd2l0Y2ggbGV0cyB0aGUgdXNlciB0b2dnbGUgYmV0d2VlbiBvbi9vZmYgb3IgdHJ1ZS9mYWxzZSBzdGF0ZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtc3dpdGNoIFtjaGVja2VkXT1cInRydWVcIj5cbiAqICAgU2ltcGxlIHN3aXRjaFxuICogPC9pZ3gtc3dpdGNoPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBJZ3hTd2l0Y2hDb21wb25lbnQsIG11bHRpOiB0cnVlIH1dLFxuICAgIHNlbGVjdG9yOiAnaWd4LXN3aXRjaCcsXG4gICAgdGVtcGxhdGVVcmw6ICdzd2l0Y2guY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneFN3aXRjaENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBFZGl0b3JQcm92aWRlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IGJvb2xlYW4gfCAnJztcbiAgICBwcml2YXRlIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8ICcnO1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIG5hdGl2ZSBjaGVja2JveCBlbGVtZW50LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNoZWNrYm94RWxlbWVudCA9ICB0aGlzLnN3aXRjaC5uYXRpdmVDaGVja2JveDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdjaGVja2JveCcsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyBuYXRpdmVDaGVja2JveDogRWxlbWVudFJlZjtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHJlZmVyZW5jZSB0byB0aGUgbmF0aXZlIGxhYmVsIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbGFiZWxFbGVtZW50ID0gIHRoaXMuc3dpdGNoLm5hdGl2ZUxhYmVsO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2xhYmVsJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgbmF0aXZlTGFiZWw6IEVsZW1lbnRSZWY7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyByZWZlcmVuY2UgdG8gdGhlIGxhYmVsIHBsYWNlaG9sZGVyIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbGFiZWxQbGFjZWhvbGRlciA9IHRoaXMuc3dpdGNoLnBsYWNlaG9sZGVyTGFiZWw7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgncGxhY2Vob2xkZXJMYWJlbCcsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIHBsYWNlaG9sZGVyTGFiZWw6IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGBpZGAgb2YgdGhlIHN3aXRjaCBjb21wb25lbnQuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgb2YgdGhlIGZpcnN0IHN3aXRjaCBjb21wb25lbnQgd2lsbCBiZSBgXCJpZ3gtc3dpdGNoLTBcImAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN3aXRjaCBpZD1cIm15LWZpcnN0LXN3aXRjaFwiPjwvaWd4LXN3aXRjaD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpIHB1YmxpYyBpZCA9IGBpZ3gtc3dpdGNoLSR7bmV4dElkKyt9YDtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGlkIG9mIHRoZSBgbGFiZWxgIGVsZW1lbnQgb2YgdGhlIHN3aXRjaCBjb21wb25lbnQuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGxhYmVsIG9mIHRoZSBmaXJzdCBzd2l0Y2ggY29tcG9uZW50IHdpbGwgaGF2ZSB2YWx1ZSBgXCJpZ3gtc3dpdGNoLTAtbGFiZWxcImAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN3aXRjaCBsYWJlbElkPVwiTGFiZWwxXCI+PC9pZ3gtc3dpdGNoPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBsYWJlbElkID0gYCR7dGhpcy5pZH0tbGFiZWxgO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYHZhbHVlYCBhdHRyaWJ1dGUgb2YgdGhlIHN3aXRjaCBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN3aXRjaCBbdmFsdWVdPVwic3dpdGNoVmFsdWVcIj48L2lneC1zd2l0Y2g+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHZhbHVlOiBhbnk7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgbmFtZWAgYXR0cmlidXRlIG9mIHRoZSBzd2l0Y2ggY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zd2l0Y2ggbmFtZT1cIlN3aXRjaDFcIj48L2lneC1zd2l0Y2g+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIHZhbHVlIG9mIHRoZSBgdGFiaW5kZXhgIGF0dHJpYnV0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc3dpdGNoIFt0YWJpbmRleF09XCIxXCI+PC9pZ3gtc3dpdGNoPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0YWJpbmRleDogbnVtYmVyID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBgbGFiZWxgIGluIHRoZSBzd2l0Y2ggY29tcG9uZW50LlxuICAgICAqIElmIG5vdCBzZXQsIGBsYWJlbFBvc2l0aW9uYCB3aWxsIGhhdmUgdmFsdWUgYFwiYWZ0ZXJcImAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN3aXRjaCBsYWJlbFBvc2l0aW9uPVwiYmVmb3JlXCI+PC9pZ3gtc3dpdGNoPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBsYWJlbFBvc2l0aW9uOiBTd2l0Y2hMYWJlbFBvc2l0aW9uIHwgc3RyaW5nID0gJ2FmdGVyJztcbiAgICAvKipcbiAgICAgKiBFbmFibGVzL0Rpc2FibGVzIHRoZSByaXBwbGUgZWZmZWN0XG4gICAgICogSWYgbm90IHNldCwgYGRpc2FibGVSaXBwbGVgIHdpbGwgaGF2ZSB2YWx1ZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zd2l0Y2ggW2Rpc2FibGVSaXBwbGVdPVwidHJ1ZVwiPjwvaWd4LXN3aXRjaD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZVJpcHBsZSA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHN3aXRjaCBpcyByZXF1aXJlZC5cbiAgICAgKiBJZiBub3Qgc2V0LCBgcmVxdWlyZWRgIHdpbGwgaGF2ZSB2YWx1ZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zd2l0Y2ggcmVxdWlyZWQ+PC9pZ3gtc3dpdGNoPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBASW5wdXQoKVxuICAgICBwdWJsaWMgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICAgICB9XG4gICAgIHB1YmxpYyBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgIHRoaXMuX3JlcXVpcmVkID0gKHZhbHVlIGFzIGFueSA9PT0gJycpIHx8IHZhbHVlO1xuICAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgYXJpYS1sYWJlbGxlZEJ5YCBhdHRyaWJ1dGUuXG4gICAgICogSWYgbm90IHNldCwgdGhlICB2YWx1ZSBvZiBgYXJpYS1sYWJlbGxlZEJ5YCB3aWxsIGJlIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBgbGFiZWxJZGAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zd2l0Y2ggYXJpYS1sYWJlbGxlZGJ5ID0gXCJMYWJlbDFcIj48L2lneC1zd2l0Y2g+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKVxuICAgIHB1YmxpYyBhcmlhTGFiZWxsZWRCeSA9IHRoaXMubGFiZWxJZDtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIHZhbHVlIG9mIHRoZSBgYXJpYS1sYWJlbGAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zd2l0Y2ggYXJpYS1sYWJlbD1cIkxhYmVsMVwiPjwvaWd4LXN3aXRjaD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoJ2FyaWEtbGFiZWwnKVxuICAgIHB1YmxpYyBhcmlhTGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRoYXQgaXMgZW1pdHRlZCBhZnRlciB0aGUgc3dpdGNoIHN0YXRlIGlzIGNoYW5nZWQuXG4gICAgICogUHJvdmlkZXMgcmVmZXJlbmNlcyB0byB0aGUgYElneFN3aXRjaENvbXBvbmVudGAgYW5kIHRoZSBgY2hlY2tlZGAgcHJvcGVydHkgYXMgZXZlbnQgYXJndW1lbnRzLlxuICAgICAqL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LW5hdGl2ZVxuICAgIEBPdXRwdXQoKSBwdWJsaWMgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8SUNoYW5nZVN3aXRjaEV2ZW50QXJncz4gPSBuZXcgRXZlbnRFbWl0dGVyPElDaGFuZ2VTd2l0Y2hFdmVudEFyZ3M+KCk7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY2xhc3Mgb2YgdGhlIHN3aXRjaCBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgc3dpdGNoQ2xhc3MgPSB0aGlzLnN3aXRjaC5jc3NDbGFzcztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1zd2l0Y2gnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtc3dpdGNoJztcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgd2hldGhlciB0aGUgc3dpdGNoIGlzIG9uIG9yIG9mZi5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzICdmYWxzZScuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1zd2l0Y2ggW2NoZWNrZWRdPVwidHJ1ZVwiPjwvaWd4LXN3aXRjaD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1zd2l0Y2gtLWNoZWNrZWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBjaGVja2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmKHRoaXMuX2NoZWNrZWQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGVja2VkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMuY2hlY2tlZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGdldCBjaGVja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hlY2tlZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgZGlzYWJsZWRgIGF0dHJpYnV0ZS5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN3aXRjaCBkaXNhYmxlZD48aWd4LXN3aXRjaD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1zd2l0Y2gtLWRpc2FibGVkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG4gICAgcHVibGljIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9ICh2YWx1ZSBhcyBhbnkgPT09ICcnKSB8fCB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIHN3aXRjaCBjb21wb25lbnQgaXMgb24gZm9jdXMuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5zd2l0Y2guZm9jdXNlZCA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtc3dpdGNoLS1mb2N1c2VkJylcbiAgICBwdWJsaWMgZm9jdXNlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRJZCA9IGAke3RoaXMuaWR9LWlucHV0YDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfY2hlY2tlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9yZXF1aXJlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9vblRvdWNoZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IG5vb3A7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX29uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gICAgcHVibGljIF9vblN3aXRjaENsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uYXRpdmVDaGVja2JveC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgICAgdGhpcy5jaGVja2VkID0gIXRoaXMuY2hlY2tlZDtcbiAgICAgICAgLy8gSy5ELiBNYXJjaCAyMywgMjAyMSBFbWl0dGluZyBvbiBjbGljayBhbmQgbm90IG9uIHRoZSBzZXR0ZXIgYmVjYXVzZSBvdGhlcndpc2UgZXZlcnkgY29tcG9uZW50XG4gICAgICAgIC8vIGJvdW5kIG9uIGNoYW5nZSB3b3VsZCBoYXZlIHRvIHBlcmZvcm0gc2VsZiBjaGVja3MgZm9yIHdlYXRoZXIgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkIGJlY2F1c2VcbiAgICAgICAgLy8gb2YgdGhlIGluaXRpYWwgc2V0IG9uIGluaXRpYWxpemF0aW9uXG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoeyBjaGVja2VkOiB0aGlzLmNoZWNrZWQsIHN3aXRjaDogdGhpcyB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBfb25Td2l0Y2hDaGFuZ2UoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9jaGVja2VkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRFZGl0RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0aXZlQ2hlY2tib3gubmF0aXZlRWxlbWVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGFiZWxDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubGFiZWxQb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSBTd2l0Y2hMYWJlbFBvc2l0aW9uLkJFRk9SRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5jc3NDbGFzc31fX2xhYmVsLS1iZWZvcmVgO1xuICAgICAgICAgICAgY2FzZSBTd2l0Y2hMYWJlbFBvc2l0aW9uLkFGVEVSOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5jc3NDbGFzc31fX2xhYmVsYDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBJR1hfU1dJVENIX1JFUVVJUkVEX1ZBTElEQVRPUjogUHJvdmlkZXIgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBJZ3hTd2l0Y2hSZXF1aXJlZERpcmVjdGl2ZSksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlICBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogYGlneC1zd2l0Y2hbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sXG4gICAgaWd4LXN3aXRjaFtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLFxuICAgIGlneC1zd2l0Y2hbcmVxdWlyZWRdW25nTW9kZWxdYCxcbiAgICBwcm92aWRlcnM6IFtJR1hfU1dJVENIX1JFUVVJUkVEX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgSWd4U3dpdGNoUmVxdWlyZWREaXJlY3RpdmUgZXh0ZW5kcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIHsgfVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtJZ3hTd2l0Y2hDb21wb25lbnQsIElneFN3aXRjaFJlcXVpcmVkRGlyZWN0aXZlXSxcbiAgICBleHBvcnRzOiBbSWd4U3dpdGNoQ29tcG9uZW50LCBJZ3hTd2l0Y2hSZXF1aXJlZERpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0lneFJpcHBsZU1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4U3dpdGNoTW9kdWxlIHsgfVxuIiwiPGlucHV0ICNjaGVja2JveCBjbGFzcz1cImlneC1zd2l0Y2hfX2lucHV0XCIgdHlwZT1cImNoZWNrYm94XCJcbiAgICBbaWRdPVwiaW5wdXRJZFwiXG4gICAgW25hbWVdPVwibmFtZVwiXG4gICAgW3ZhbHVlXT1cInZhbHVlXCJcbiAgICBbdGFiaW5kZXhdPVwidGFiaW5kZXhcIlxuICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgW2NoZWNrZWRdPVwiY2hlY2tlZFwiXG4gICAgW3JlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICBbYXR0ci5hcmlhLWNoZWNrZWRdPVwiY2hlY2tlZFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbCA/IG51bGwgOiBhcmlhTGFiZWxsZWRCeVwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgIChjaGFuZ2UpPVwiX29uU3dpdGNoQ2hhbmdlKCRldmVudClcIlxuICAgIChibHVyKT1cIm9uQmx1cigpXCIgLz5cblxuPHNwYW4gI2xhYmVsIGNsYXNzID1cImlneC1zd2l0Y2hfX2NvbXBvc2l0ZVwiXG4gICAgaWd4UmlwcGxlXG4gICAgaWd4UmlwcGxlVGFyZ2V0PVwiLmlneC1zd2l0Y2hfX3JpcHBsZVwiXG4gICAgW2lneFJpcHBsZURpc2FibGVkXT1cImRpc2FibGVSaXBwbGVcIlxuICAgIFtpZ3hSaXBwbGVDZW50ZXJlZF09XCJ0cnVlXCJcbiAgICBbaWd4UmlwcGxlRHVyYXRpb25dPVwiMzAwXCI+XG4gICAgPGRpdiBjbGFzcz1cImlneC1zd2l0Y2hfX2NvbXBvc2l0ZS10aHVtYlwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LXN3aXRjaF9fcmlwcGxlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG48L3NwYW4+XG5cbjxzcGFuICNwbGFjZWhvbGRlckxhYmVsXG4gICAgW2NsYXNzXT1cImxhYmVsQ2xhc3NcIlxuICAgIFtpZF09XCJsYWJlbElkXCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9zcGFuPlxuIl19