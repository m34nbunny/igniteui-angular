import { ChangeDetectorRef, ElementRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { EditorProvider } from '../core/edit-provider';
import { IBaseEventArgs } from '../core/utils';
import * as i0 from "@angular/core";
export interface IChangeRadioEventArgs extends IBaseEventArgs {
    value: any;
    radio: IgxRadioComponent;
}
export declare const RadioLabelPosition: {
    BEFORE: "before";
    AFTER: "after";
};
export declare type RadioLabelPosition = (typeof RadioLabelPosition)[keyof typeof RadioLabelPosition];
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
export declare class IgxRadioComponent implements ControlValueAccessor, EditorProvider {
    private cdr;
    private static ngAcceptInputType_required;
    private static ngAcceptInputType_disabled;
    /**
     * Returns reference to native radio element.
     * ```typescript
     * let radioElement =  this.radio.nativeRadio;
     * ```
     *
     * @memberof IgxSwitchComponent
     */
    nativeRadio: ElementRef;
    /**
     * Returns reference to native label element.
     * ```typescript
     * let labelElement =  this.radio.nativeLabel;
     * ```
     *
     * @memberof IgxSwitchComponent
     */
    nativeLabel: ElementRef;
    /**
     * Returns reference to the label placeholder element.
     * ```typescript
     * let labelPlaceholder =  this.radio.placeholderLabel;
     * ```
     *
     * @memberof IgxSwitchComponent
     */
    placeholderLabel: ElementRef;
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
    id: string;
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
    labelId: string;
    /**
     * Sets/gets the position of the `label` in the radio component.
     * If not set, `labelPosition` will have value `"after"`.
     * ```html
     * <igx-radio labelPosition = "before"></igx-radio>
     * ```
     * ```typescript
     * let labelPosition =  this.radio.labelPosition;
     * ```
     *
     * @memberof IgxRadioComponent
     */
    labelPosition: RadioLabelPosition | string;
    /**
     * Sets/gets the `value` attribute.
     * ```html
     * <igx-radio [value] = "'radioButtonValue'"></igx-radio>
     * ```
     * ```typescript
     * let value =  this.radio.value;
     * ```
     *
     * @memberof IgxRadioComponent
     */
    value: any;
    /**
     * Sets/gets the `name` attribute of the radio component.
     * ```html
     * <igx-radio name = "Radio1"></igx-radio>
     *  ```
     * ```typescript
     * let name =  this.radio.name;
     * ```
     *
     * @memberof IgxRadioComponent
     */
    name: string;
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
    tabindex: number;
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
    disableRipple: boolean;
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
    get required(): boolean;
    set required(value: boolean);
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
    ariaLabelledBy: string;
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
    ariaLabel: string | null;
    /**
     * An event that is emitted after the radio `value` is changed.
     * Provides references to the `IgxRadioComponent` and the `value` property as event arguments.
     *
     * @memberof IgxRadioComponent
     */
    readonly change: EventEmitter<IChangeRadioEventArgs>;
    /**
     * Returns the class of the radio component.
     * ```typescript
     * let radioClass = this.radio.cssClass;
     * ```
     *
     * @memberof IgxRadioComponent
     */
    cssClass: string;
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
    checked: boolean;
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
    get disabled(): boolean;
    set disabled(value: boolean);
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
    focused: boolean;
    /**
     * @hidden
     */
    inputId: string;
    /**
     * @hidden
     * @internal
     */
    private _required;
    /**
     * @hidden
     * @internal
     */
    private _disabled;
    /**
     * @hidden
     */
    private _onTouchedCallback;
    /**
     * @hidden
     */
    private _onChangeCallback;
    constructor(cdr: ChangeDetectorRef);
    /**
     * @hidden
     * @internal
     */
    _changed(): void;
    /**
     * @hidden
     * @internal
     */
    onKeyUp(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    _clicked(): void;
    /**
     * Selects the current radio button.
     * ```typescript
     * this.radio.select();
     * ```
     *
     * @memberof IgxRadioComponent
     */
    select(): void;
    /**
     * Deselects the current radio button.
     * ```typescript
     * this.radio.deselect();
     * ```
     *
     * @memberof IgxRadioComponent
     */
    deselect(): void;
    /**
     * Checks whether the provided value is consistent to the current radio button.
     * If it is, the checked attribute will have value `true`;
     * ```typescript
     * this.radio.writeValue('radioButtonValue');
     * ```
     */
    writeValue(value: any): void;
    /** @hidden */
    getEditElement(): any;
    /**
     * @hidden
     */
    get labelClass(): string;
    /**
     * @hidden
     */
    onBlur(): void;
    /**
     * @hidden
     */
    registerOnChange(fn: (_: any) => void): void;
    /**
     * @hidden
     */
    registerOnTouched(fn: () => void): void;
    /**
     * @hidden
     */
    setDisabledState(isDisabled: boolean): void;
    static ??fac: i0.????FactoryDeclaration<IgxRadioComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxRadioComponent, "igx-radio", never, { "id": "id"; "labelId": "labelId"; "labelPosition": "labelPosition"; "value": "value"; "name": "name"; "tabindex": "tabindex"; "disableRipple": "disableRipple"; "required": "required"; "ariaLabelledBy": "aria-labelledby"; "ariaLabel": "aria-label"; "checked": "checked"; "disabled": "disabled"; }, { "change": "change"; }, never, ["*"]>;
}
