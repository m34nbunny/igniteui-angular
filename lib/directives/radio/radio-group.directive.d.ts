import { AfterContentInit, EventEmitter, OnDestroy, QueryList } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { IChangeRadioEventArgs, IgxRadioComponent, RadioLabelPosition } from '../../radio/radio.component';
import * as i0 from "@angular/core";
import * as i1 from "../../radio/radio.component";
import * as i2 from "../ripple/ripple.directive";
/**
 * Determines the Radio Group alignment
 */
export declare const RadioGroupAlignment: {
    horizontal: "horizontal";
    vertical: "vertical";
};
export declare type RadioGroupAlignment = typeof RadioGroupAlignment[keyof typeof RadioGroupAlignment];
/**
 * Radio group directive renders set of radio buttons.
 *
 * @igxModule IgxRadioModule
 *
 * @igxTheme igx-radio-theme
 *
 * @igxKeywords radiogroup, radio, button, input
 *
 * @igxGroup Data Entry & Display
 *
 * @remarks
 * The Ignite UI Radio Group allows the user to select a single option from an available set of options that are listed side by side.
 *
 * @example:
 * ```html
 * <igx-radio-group name="radioGroup">
 *   <igx-radio *ngFor="let item of ['Foo', 'Bar', 'Baz']" value="{{item}}">
 *      {{item}}
 *   </igx-radio>
 * </igx-radio-group>
 * ```
 */
export declare class IgxRadioGroupDirective implements AfterContentInit, ControlValueAccessor, OnDestroy {
    private static ngAcceptInputType_required;
    private static ngAcceptInputType_disabled;
    /**
     * Returns reference to the child radio buttons.
     *
     * @example
     * ```typescript
     * let radioButtons =  this.radioGroup.radioButtons;
     * ```
     */
    radioButtons: QueryList<IgxRadioComponent>;
    /**
     * Sets/gets the `value` attribute.
     *
     * @example
     * ```html
     * <igx-radio-group [value] = "'radioButtonValue'"></igx-radio-group>
     * ```
     */
    get value(): any;
    set value(newValue: any);
    /**
     * Sets/gets the `name` attribute of the radio group component. All child radio buttons inherits this name.
     *
     * @example
     * ```html
     * <igx-radio-group name = "Radio1"></igx-radio-group>
     *  ```
     */
    get name(): string;
    set name(newValue: string);
    /**
     * Sets/gets whether the radio group is required.
     *
     * @remarks
     * If not set, `required` will have value `false`.
     *
     * @example
     * ```html
     * <igx-radio-group [required] = "true"></igx-radio-group>
     * ```
     */
    get required(): boolean;
    set required(value: boolean);
    /**
     * @deprecated in version 12.2.0
     *
     * An input property that allows you to disable the radio group. By default it's false.
     *
     * @example
     *  ```html
     * <igx-radio-group disabled></igx-radio-group>
     * ```
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * @deprecated in version 12.2.0
     *
     * Sets/gets the position of the `label` in the child radio buttons.
     *
     * @remarks
     * If not set, `labelPosition` will have value `"after"`.
     *
     * @example
     * ```html
     * <igx-radio-group labelPosition = "before"></igx-radio-group>
     * ```
     */
    get labelPosition(): RadioLabelPosition | string;
    set labelPosition(newValue: RadioLabelPosition | string);
    /**
     * Sets/gets the selected child radio button.
     *
     * @example
     * ```typescript
     * let selectedButton = this.radioGroup.selected;
     * this.radioGroup.selected = selectedButton;
     * ```
     */
    get selected(): IgxRadioComponent | null;
    set selected(selected: IgxRadioComponent | null);
    /**
     * An event that is emitted after the radio group `value` is changed.
     *
     * @remarks
     * Provides references to the selected `IgxRadioComponent` and the `value` property as event arguments.
     *
     * @example
     * ```html
     * <igx-radio-group (change)="handler($event)"></igx-radio-group>
     * ```
     */
    readonly change: EventEmitter<IChangeRadioEventArgs>;
    /**
     * The css class applied to the component.
     *
     * @hidden
     * @internal
     */
    cssClass: string;
    /**
     * Sets vertical alignment to the radio group, if `alignment` is set to `vertical`.
     * By default the alignment is horizontal.
     *
     * @example
     * ```html
     * <igx-radio-group alignment="vertical"></igx-radio-group>
     * ```
     */
    private vertical;
    /**
     * Returns the alignment of the `igx-radio-group`.
     * ```typescript
     * @ViewChild("MyRadioGroup")
     * public radioGroup: IgxRadioGroupDirective;
     * ngAfterViewInit(){
     *    let radioAlignment = this.radioGroup.alignment;
     * }
     * ```
     */
    get alignment(): RadioGroupAlignment;
    /**
     * Allows you to set the radio group alignment.
     * Available options are `RadioGroupAlignment.horizontal` (default) and `RadioGroupAlignment.vertical`.
     * ```typescript
     * public alignment = RadioGroupAlignment.vertical;
     * //..
     * ```
     * ```html
     * <igx-radio-group [alignment]="alignment"></igx-radio-group>
     * ```
     */
    set alignment(value: RadioGroupAlignment);
    /**
     * @hidden
     * @internal
     */
    private _onChangeCallback;
    /**
     * @hidden
     * @internal
     */
    private _name;
    /**
     * @hidden
     * @internal
     */
    private _value;
    /**
     * @hidden
     * @internal
     */
    private _selected;
    /**
     * @hidden
     * @internal
     */
    private _isInitialized;
    /**
     * @hidden
     * @internal
     */
    private _labelPosition;
    /**
     * @hidden
     * @internal
     */
    private _disabled;
    /**
     * @hidden
     * @internal
     */
    private _required;
    /**
     * @hidden
     * @internal
     */
    private destroy$;
    /**
     * @hidden
     * @internal
     */
    ngAfterContentInit(): void;
    /**
     * Sets the "checked" property value on the radio input element.
     *
     * @remarks
     * Checks whether the provided value is consistent to the current radio button.
     * If it is, the checked attribute will have value `true` and selected property will contain the selected `IgxRadioComponent`.
     *
     * @example
     * ```typescript
     * this.radioGroup.writeValue('radioButtonValue');
     * ```
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     *
     * @hidden
     * @internal
     */
    registerOnChange(fn: (_: any) => void): void;
    /**
     * @hidden
     * @internal
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Registers a function called when the control is touched.
     *
     * @hidden
     * @internal
     */
    registerOnTouched(fn: () => void): void;
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     * @internal
     */
    private _initRadioButtons;
    /**
     * @hidden
     * @internal
     */
    private _selectedRadioButtonChanged;
    /**
     * @hidden
     * @internal
     */
    private _setRadioButtonNames;
    /**
     * @hidden
     * @internal
     */
    private _selectRadioButton;
    /**
     * @hidden
     * @internal
     */
    private _setRadioButtonLabelPosition;
    /**
     * @hidden
     * @internal
     */
    private _setRadioButtonsRequired;
    static ??fac: i0.????FactoryDeclaration<IgxRadioGroupDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxRadioGroupDirective, "igx-radio-group, [igxRadioGroup]", ["igxRadioGroup"], { "value": "value"; "name": "name"; "required": "required"; "disabled": "disabled"; "labelPosition": "labelPosition"; "selected": "selected"; "alignment": "alignment"; }, { "change": "change"; }, ["radioButtons"]>;
}
/**
 * @hidden
 */
export declare class IgxRadioModule {
    static ??fac: i0.????FactoryDeclaration<IgxRadioModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxRadioModule, [typeof IgxRadioGroupDirective, typeof i1.IgxRadioComponent], [typeof i2.IgxRippleModule], [typeof IgxRadioGroupDirective, typeof i1.IgxRadioComponent]>;
    static ??inj: i0.????InjectorDeclaration<IgxRadioModule>;
}
