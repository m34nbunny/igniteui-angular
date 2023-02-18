import { ContentChildren, Directive, EventEmitter, HostBinding, Input, NgModule, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { mkenum } from '../../core/utils';
import { IgxRadioComponent, RadioLabelPosition } from '../../radio/radio.component';
import { IgxRippleModule } from '../ripple/ripple.directive';
import * as i0 from "@angular/core";
/**
 * Determines the Radio Group alignment
 */
export const RadioGroupAlignment = mkenum({
    horizontal: 'horizontal',
    vertical: 'vertical'
});
let nextId = 0;
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
export class IgxRadioGroupDirective {
    constructor() {
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
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.change = new EventEmitter();
        /**
         * The css class applied to the component.
         *
         * @hidden
         * @internal
         */
        this.cssClass = 'igx-radio-group';
        /**
         * Sets vertical alignment to the radio group, if `alignment` is set to `vertical`.
         * By default the alignment is horizontal.
         *
         * @example
         * ```html
         * <igx-radio-group alignment="vertical"></igx-radio-group>
         * ```
         */
        this.vertical = false;
        /**
         * @hidden
         * @internal
         */
        this._onChangeCallback = noop;
        /**
         * @hidden
         * @internal
         */
        this._name = `igx-radio-group-${nextId++}`;
        /**
         * @hidden
         * @internal
         */
        this._value = null;
        /**
         * @hidden
         * @internal
         */
        this._selected = null;
        /**
         * @hidden
         * @internal
         */
        this._isInitialized = false;
        /**
         * @hidden
         * @internal
         */
        this._labelPosition = 'after';
        /**
         * @hidden
         * @internal
         */
        this._disabled = false;
        /**
         * @hidden
         * @internal
         */
        this._required = false;
        /**
         * @hidden
         * @internal
         */
        this.destroy$ = new Subject();
    }
    /**
     * Sets/gets the `value` attribute.
     *
     * @example
     * ```html
     * <igx-radio-group [value] = "'radioButtonValue'"></igx-radio-group>
     * ```
     */
    get value() {
        return this._value;
    }
    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this._selectRadioButton();
        }
    }
    /**
     * Sets/gets the `name` attribute of the radio group component. All child radio buttons inherits this name.
     *
     * @example
     * ```html
     * <igx-radio-group name = "Radio1"></igx-radio-group>
     *  ```
     */
    get name() {
        return this._name;
    }
    set name(newValue) {
        if (this._name !== newValue) {
            this._name = newValue;
            this._setRadioButtonNames();
        }
    }
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
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = value === '' || value;
        this._setRadioButtonsRequired();
    }
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
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value === '' || value;
        this.setDisabledState(value);
    }
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
    get labelPosition() {
        return this._labelPosition;
    }
    set labelPosition(newValue) {
        if (this._labelPosition !== newValue) {
            this._labelPosition = newValue === RadioLabelPosition.BEFORE ? RadioLabelPosition.BEFORE : RadioLabelPosition.AFTER;
            this._setRadioButtonLabelPosition();
        }
    }
    /**
     * Sets/gets the selected child radio button.
     *
     * @example
     * ```typescript
     * let selectedButton = this.radioGroup.selected;
     * this.radioGroup.selected = selectedButton;
     * ```
     */
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        if (this._selected !== selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
        }
    }
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
    get alignment() {
        return this.vertical ? RadioGroupAlignment.vertical : RadioGroupAlignment.horizontal;
    }
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
    set alignment(value) {
        this.vertical = value === RadioGroupAlignment.vertical;
    }
    /**
     * @hidden
     * @internal
     */
    ngAfterContentInit() {
        // The initial value can possibly be set by NgModel and it is possible that
        // the OnInit of the NgModel occurs after the OnInit of this class.
        this._isInitialized = true;
        setTimeout(() => {
            this._initRadioButtons();
        });
    }
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
    writeValue(value) {
        this.value = value;
    }
    /**
     * Registers a function called when the control value changes.
     *
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
    setDisabledState(isDisabled) {
        if (this.radioButtons) {
            this.radioButtons.forEach((button) => {
                button.setDisabledState(isDisabled);
            });
        }
    }
    /**
     * Registers a function called when the control is touched.
     *
     * @hidden
     * @internal
     */
    registerOnTouched(fn) {
        if (this.radioButtons) {
            this.radioButtons.forEach((button) => {
                button.registerOnTouched(fn);
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /**
     * @hidden
     * @internal
     */
    _initRadioButtons() {
        if (this.radioButtons) {
            const props = { name: this._name, required: this._required };
            this.radioButtons.forEach((button) => {
                Object.assign(button, props);
                if (button.disabled === undefined) {
                    button.disabled = this._disabled;
                }
                if (button.labelPosition === undefined) {
                    button.labelPosition = this._labelPosition;
                }
                if (button.value === this._value) {
                    button.checked = true;
                    this._selected = button;
                }
                button.change.pipe(takeUntil(this.destroy$)).subscribe((ev) => this._selectedRadioButtonChanged(ev));
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    _selectedRadioButtonChanged(args) {
        this.radioButtons.forEach((button) => {
            button.checked = button.id === args.radio.id;
        });
        this._selected = args.radio;
        this._value = args.value;
        if (this._isInitialized) {
            this.change.emit(args);
            this._onChangeCallback(this.value);
        }
    }
    /**
     * @hidden
     * @internal
     */
    _setRadioButtonNames() {
        if (this.radioButtons) {
            this.radioButtons.forEach((button) => {
                button.name = this._name;
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    _selectRadioButton() {
        if (this.radioButtons) {
            this.radioButtons.forEach((button) => {
                if (this._value === null) {
                    // no value - uncheck all radio buttons
                    if (button.checked) {
                        button.checked = false;
                    }
                }
                else {
                    if (this._value === button.value) {
                        // selected button
                        if (this._selected !== button) {
                            this._selected = button;
                        }
                        if (!button.checked) {
                            button.select();
                        }
                    }
                    else {
                        // non-selected button
                        if (button.checked) {
                            button.checked = false;
                        }
                    }
                }
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    _setRadioButtonLabelPosition() {
        if (this.radioButtons) {
            this.radioButtons.forEach((button) => {
                button.labelPosition = this._labelPosition;
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    _setRadioButtonsRequired() {
        if (this.radioButtons) {
            this.radioButtons.forEach((button) => {
                button.required = this._required;
            });
        }
    }
}
IgxRadioGroupDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioGroupDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxRadioGroupDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxRadioGroupDirective, selector: "igx-radio-group, [igxRadioGroup]", inputs: { value: "value", name: "name", required: "required", disabled: "disabled", labelPosition: "labelPosition", selected: "selected", alignment: "alignment" }, outputs: { change: "change" }, host: { properties: { "class.igx-radio-group": "this.cssClass", "class.igx-radio-group--vertical": "this.vertical" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxRadioGroupDirective, multi: true }], queries: [{ propertyName: "radioButtons", predicate: IgxRadioComponent, descendants: true }], exportAs: ["igxRadioGroup"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioGroupDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'igxRadioGroup',
                    selector: 'igx-radio-group, [igxRadioGroup]',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxRadioGroupDirective, multi: true }]
                }]
        }], propDecorators: { radioButtons: [{
                type: ContentChildren,
                args: [IgxRadioComponent, { descendants: true }]
            }], value: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], disabled: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], selected: [{
                type: Input
            }], change: [{
                type: Output
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-radio-group']
            }], vertical: [{
                type: HostBinding,
                args: ['class.igx-radio-group--vertical']
            }], alignment: [{
                type: Input
            }] } });
/**
 * @hidden
 */
export class IgxRadioModule {
}
IgxRadioModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxRadioModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioModule, declarations: [IgxRadioGroupDirective, IgxRadioComponent], imports: [IgxRippleModule], exports: [IgxRadioGroupDirective, IgxRadioComponent] });
IgxRadioModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioModule, imports: [[IgxRippleModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRadioModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxRadioGroupDirective, IgxRadioComponent],
                    exports: [IgxRadioGroupDirective, IgxRadioComponent],
                    imports: [IgxRippleModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tZ3JvdXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RpcmVjdGl2ZXMvcmFkaW8vcmFkaW8tZ3JvdXAuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCxlQUFlLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBYSxNQUFNLEVBQzVGLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzFDLE9BQU8sRUFBeUIsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMzRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBRTdEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDO0lBQ3RDLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFFBQVEsRUFBRSxVQUFVO0NBQ3ZCLENBQUMsQ0FBQztBQUdILElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBTUgsTUFBTSxPQUFPLHNCQUFzQjtJQUxuQztRQTJJSTs7Ozs7Ozs7OztXQVVHO1FBQ0gsNERBQTREO1FBQ2xDLFdBQU0sR0FBd0MsSUFBSSxZQUFZLEVBQXlCLENBQUM7UUFFbEg7Ozs7O1dBS0c7UUFFSSxhQUFRLEdBQUcsaUJBQWlCLENBQUM7UUFFcEM7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LEVBQUUsaUJBQWlCLENBQUM7b0JBQ3BELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztpQkFDN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQ29udGVudENoaWxkcmVuLCBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LCBOZ01vZHVsZSwgT25EZXN0cm95LCBPdXRwdXQsIFF1ZXJ5TGlzdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IG5vb3AsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IG1rZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSUNoYW5nZVJhZGlvRXZlbnRBcmdzLCBJZ3hSYWRpb0NvbXBvbmVudCwgUmFkaW9MYWJlbFBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vcmFkaW8vcmFkaW8uY29tcG9uZW50JztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uL3JpcHBsZS9yaXBwbGUuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBSYWRpbyBHcm91cCBhbGlnbm1lbnRcbiAqL1xuZXhwb3J0IGNvbnN0IFJhZGlvR3JvdXBBbGlnbm1lbnQgPSBta2VudW0oe1xuICAgIGhvcml6b250YWw6ICdob3Jpem9udGFsJyxcbiAgICB2ZXJ0aWNhbDogJ3ZlcnRpY2FsJ1xufSk7XG5leHBvcnQgdHlwZSBSYWRpb0dyb3VwQWxpZ25tZW50ID0gdHlwZW9mIFJhZGlvR3JvdXBBbGlnbm1lbnRba2V5b2YgdHlwZW9mIFJhZGlvR3JvdXBBbGlnbm1lbnRdO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBSYWRpbyBncm91cCBkaXJlY3RpdmUgcmVuZGVycyBzZXQgb2YgcmFkaW8gYnV0dG9ucy5cbiAqXG4gKiBAaWd4TW9kdWxlIElneFJhZGlvTW9kdWxlXG4gKlxuICogQGlneFRoZW1lIGlneC1yYWRpby10aGVtZVxuICpcbiAqIEBpZ3hLZXl3b3JkcyByYWRpb2dyb3VwLCByYWRpbywgYnV0dG9uLCBpbnB1dFxuICpcbiAqIEBpZ3hHcm91cCBEYXRhIEVudHJ5ICYgRGlzcGxheVxuICpcbiAqIEByZW1hcmtzXG4gKiBUaGUgSWduaXRlIFVJIFJhZGlvIEdyb3VwIGFsbG93cyB0aGUgdXNlciB0byBzZWxlY3QgYSBzaW5nbGUgb3B0aW9uIGZyb20gYW4gYXZhaWxhYmxlIHNldCBvZiBvcHRpb25zIHRoYXQgYXJlIGxpc3RlZCBzaWRlIGJ5IHNpZGUuXG4gKlxuICogQGV4YW1wbGU6XG4gKiBgYGBodG1sXG4gKiA8aWd4LXJhZGlvLWdyb3VwIG5hbWU9XCJyYWRpb0dyb3VwXCI+XG4gKiAgIDxpZ3gtcmFkaW8gKm5nRm9yPVwibGV0IGl0ZW0gb2YgWydGb28nLCAnQmFyJywgJ0JheiddXCIgdmFsdWU9XCJ7e2l0ZW19fVwiPlxuICogICAgICB7e2l0ZW19fVxuICogICA8L2lneC1yYWRpbz5cbiAqIDwvaWd4LXJhZGlvLWdyb3VwPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIGV4cG9ydEFzOiAnaWd4UmFkaW9Hcm91cCcsXG4gICAgc2VsZWN0b3I6ICdpZ3gtcmFkaW8tZ3JvdXAsIFtpZ3hSYWRpb0dyb3VwXScsXG4gICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IElneFJhZGlvR3JvdXBEaXJlY3RpdmUsIG11bHRpOiB0cnVlIH1dXG59KVxuZXhwb3J0IGNsYXNzIElneFJhZGlvR3JvdXBEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogYm9vbGVhbiB8ICcnO1xuICAgIHByaXZhdGUgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgJyc7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyByZWZlcmVuY2UgdG8gdGhlIGNoaWxkIHJhZGlvIGJ1dHRvbnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgcmFkaW9CdXR0b25zID0gIHRoaXMucmFkaW9Hcm91cC5yYWRpb0J1dHRvbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hSYWRpb0NvbXBvbmVudCwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBwdWJsaWMgcmFkaW9CdXR0b25zOiBRdWVyeUxpc3Q8SWd4UmFkaW9Db21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgdmFsdWVgIGF0dHJpYnV0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8tZ3JvdXAgW3ZhbHVlXSA9IFwiJ3JhZGlvQnV0dG9uVmFsdWUnXCI+PC9pZ3gtcmFkaW8tZ3JvdXA+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RSYWRpb0J1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgbmFtZWAgYXR0cmlidXRlIG9mIHRoZSByYWRpbyBncm91cCBjb21wb25lbnQuIEFsbCBjaGlsZCByYWRpbyBidXR0b25zIGluaGVyaXRzIHRoaXMgbmFtZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8tZ3JvdXAgbmFtZSA9IFwiUmFkaW8xXCI+PC9pZ3gtcmFkaW8tZ3JvdXA+XG4gICAgICogIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IG5hbWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5fbmFtZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX25hbWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3NldFJhZGlvQnV0dG9uTmFtZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSByYWRpbyBncm91cCBpcyByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSWYgbm90IHNldCwgYHJlcXVpcmVkYCB3aWxsIGhhdmUgdmFsdWUgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8tZ3JvdXAgW3JlcXVpcmVkXSA9IFwidHJ1ZVwiPjwvaWd4LXJhZGlvLWdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3JlcXVpcmVkID0gKHZhbHVlIGFzIGFueSkgPT09ICcnIHx8IHZhbHVlO1xuICAgICAgICB0aGlzLl9zZXRSYWRpb0J1dHRvbnNSZXF1aXJlZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMi4wXG4gICAgICpcbiAgICAgKiBBbiBpbnB1dCBwcm9wZXJ0eSB0aGF0IGFsbG93cyB5b3UgdG8gZGlzYWJsZSB0aGUgcmFkaW8gZ3JvdXAuIEJ5IGRlZmF1bHQgaXQncyBmYWxzZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGBgYGh0bWxcbiAgICAgKiA8aWd4LXJhZGlvLWdyb3VwIGRpc2FibGVkPjwvaWd4LXJhZGlvLWdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gKHZhbHVlIGFzIGFueSkgPT09ICcnIHx8IHZhbHVlO1xuICAgICAgICB0aGlzLnNldERpc2FibGVkU3RhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMi4wXG4gICAgICpcbiAgICAgKiBTZXRzL2dldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBgbGFiZWxgIGluIHRoZSBjaGlsZCByYWRpbyBidXR0b25zLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJZiBub3Qgc2V0LCBgbGFiZWxQb3NpdGlvbmAgd2lsbCBoYXZlIHZhbHVlIGBcImFmdGVyXCJgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpby1ncm91cCBsYWJlbFBvc2l0aW9uID0gXCJiZWZvcmVcIj48L2lneC1yYWRpby1ncm91cD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgbGFiZWxQb3NpdGlvbigpOiBSYWRpb0xhYmVsUG9zaXRpb24gfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWxQb3NpdGlvbjtcbiAgICB9XG4gICAgcHVibGljIHNldCBsYWJlbFBvc2l0aW9uKG5ld1ZhbHVlOiBSYWRpb0xhYmVsUG9zaXRpb24gfCBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xhYmVsUG9zaXRpb24gIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9sYWJlbFBvc2l0aW9uID0gbmV3VmFsdWUgPT09IFJhZGlvTGFiZWxQb3NpdGlvbi5CRUZPUkUgPyBSYWRpb0xhYmVsUG9zaXRpb24uQkVGT1JFIDogUmFkaW9MYWJlbFBvc2l0aW9uLkFGVEVSO1xuICAgICAgICAgICAgdGhpcy5fc2V0UmFkaW9CdXR0b25MYWJlbFBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIHNlbGVjdGVkIGNoaWxkIHJhZGlvIGJ1dHRvbi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBzZWxlY3RlZEJ1dHRvbiA9IHRoaXMucmFkaW9Hcm91cC5zZWxlY3RlZDtcbiAgICAgKiB0aGlzLnJhZGlvR3JvdXAuc2VsZWN0ZWQgPSBzZWxlY3RlZEJ1dHRvbjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG4gICAgcHVibGljIHNldCBzZWxlY3RlZChzZWxlY3RlZDogSWd4UmFkaW9Db21wb25lbnQgfCBudWxsKSB7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZCAhPT0gc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gc2VsZWN0ZWQgPyBzZWxlY3RlZC52YWx1ZSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgYWZ0ZXIgdGhlIHJhZGlvIGdyb3VwIGB2YWx1ZWAgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUHJvdmlkZXMgcmVmZXJlbmNlcyB0byB0aGUgc2VsZWN0ZWQgYElneFJhZGlvQ29tcG9uZW50YCBhbmQgdGhlIGB2YWx1ZWAgcHJvcGVydHkgYXMgZXZlbnQgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1yYWRpby1ncm91cCAoY2hhbmdlKT1cImhhbmRsZXIoJGV2ZW50KVwiPjwvaWd4LXJhZGlvLWdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LW5hdGl2ZVxuICAgIEBPdXRwdXQoKSBwdWJsaWMgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8SUNoYW5nZVJhZGlvRXZlbnRBcmdzPiA9IG5ldyBFdmVudEVtaXR0ZXI8SUNoYW5nZVJhZGlvRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNzcyBjbGFzcyBhcHBsaWVkIHRvIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtcmFkaW8tZ3JvdXAnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtcmFkaW8tZ3JvdXAnO1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB2ZXJ0aWNhbCBhbGlnbm1lbnQgdG8gdGhlIHJhZGlvIGdyb3VwLCBpZiBgYWxpZ25tZW50YCBpcyBzZXQgdG8gYHZlcnRpY2FsYC5cbiAgICAgKiBCeSBkZWZhdWx0IHRoZSBhbGlnbm1lbnQgaXMgaG9yaXpvbnRhbC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8tZ3JvdXAgYWxpZ25tZW50PVwidmVydGljYWxcIj48L2lneC1yYWRpby1ncm91cD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1yYWRpby1ncm91cC0tdmVydGljYWwnKVxuICAgIHByaXZhdGUgdmVydGljYWwgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGFsaWdubWVudCBvZiB0aGUgYGlneC1yYWRpby1ncm91cGAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeVJhZGlvR3JvdXBcIilcbiAgICAgKiBwdWJsaWMgcmFkaW9Hcm91cDogSWd4UmFkaW9Hcm91cERpcmVjdGl2ZTtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICBsZXQgcmFkaW9BbGlnbm1lbnQgPSB0aGlzLnJhZGlvR3JvdXAuYWxpZ25tZW50O1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgYWxpZ25tZW50KCk6IFJhZGlvR3JvdXBBbGlnbm1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbCA/IFJhZGlvR3JvdXBBbGlnbm1lbnQudmVydGljYWwgOiBSYWRpb0dyb3VwQWxpZ25tZW50Lmhvcml6b250YWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFsbG93cyB5b3UgdG8gc2V0IHRoZSByYWRpbyBncm91cCBhbGlnbm1lbnQuXG4gICAgICogQXZhaWxhYmxlIG9wdGlvbnMgYXJlIGBSYWRpb0dyb3VwQWxpZ25tZW50Lmhvcml6b250YWxgIChkZWZhdWx0KSBhbmQgYFJhZGlvR3JvdXBBbGlnbm1lbnQudmVydGljYWxgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgYWxpZ25tZW50ID0gUmFkaW9Hcm91cEFsaWdubWVudC52ZXJ0aWNhbDtcbiAgICAgKiAvLy4uXG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcmFkaW8tZ3JvdXAgW2FsaWdubWVudF09XCJhbGlnbm1lbnRcIj48L2lneC1yYWRpby1ncm91cD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGFsaWdubWVudCh2YWx1ZTogUmFkaW9Hcm91cEFsaWdubWVudCkge1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gdmFsdWUgPT09IFJhZGlvR3JvdXBBbGlnbm1lbnQudmVydGljYWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX29uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9uYW1lID0gYGlneC1yYWRpby1ncm91cC0ke25leHRJZCsrfWA7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX3ZhbHVlOiBhbnkgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9zZWxlY3RlZDogSWd4UmFkaW9Db21wb25lbnQgfCBudWxsID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9sYWJlbFBvc2l0aW9uOiBSYWRpb0xhYmVsUG9zaXRpb24gfCBzdHJpbmcgPSAnYWZ0ZXInO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9yZXF1aXJlZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICAvLyBUaGUgaW5pdGlhbCB2YWx1ZSBjYW4gcG9zc2libHkgYmUgc2V0IGJ5IE5nTW9kZWwgYW5kIGl0IGlzIHBvc3NpYmxlIHRoYXRcbiAgICAgICAgLy8gdGhlIE9uSW5pdCBvZiB0aGUgTmdNb2RlbCBvY2N1cnMgYWZ0ZXIgdGhlIE9uSW5pdCBvZiB0aGlzIGNsYXNzLlxuICAgICAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRSYWRpb0J1dHRvbnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgXCJjaGVja2VkXCIgcHJvcGVydHkgdmFsdWUgb24gdGhlIHJhZGlvIGlucHV0IGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBwcm92aWRlZCB2YWx1ZSBpcyBjb25zaXN0ZW50IHRvIHRoZSBjdXJyZW50IHJhZGlvIGJ1dHRvbi5cbiAgICAgKiBJZiBpdCBpcywgdGhlIGNoZWNrZWQgYXR0cmlidXRlIHdpbGwgaGF2ZSB2YWx1ZSBgdHJ1ZWAgYW5kIHNlbGVjdGVkIHByb3BlcnR5IHdpbGwgY29udGFpbiB0aGUgc2VsZWN0ZWQgYElneFJhZGlvQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMucmFkaW9Hcm91cC53cml0ZVZhbHVlKCdyYWRpb0J1dHRvblZhbHVlJyk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMucmFkaW9CdXR0b25zKSB7XG4gICAgICAgICAgICB0aGlzLnJhZGlvQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b24uc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKHRoaXMucmFkaW9CdXR0b25zKSB7XG4gICAgICAgICAgICB0aGlzLnJhZGlvQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b24ucmVnaXN0ZXJPblRvdWNoZWQoZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaW5pdFJhZGlvQnV0dG9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMucmFkaW9CdXR0b25zKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wcyA9IHsgbmFtZTogdGhpcy5fbmFtZSwgcmVxdWlyZWQ6IHRoaXMuX3JlcXVpcmVkIH07XG4gICAgICAgICAgICB0aGlzLnJhZGlvQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGJ1dHRvbiwgcHJvcHMpO1xuXG4gICAgICAgICAgICAgICAgaWYoYnV0dG9uLmRpc2FibGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoYnV0dG9uLmxhYmVsUG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24ubGFiZWxQb3NpdGlvbiA9IHRoaXMuX2xhYmVsUG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJ1dHRvbi52YWx1ZSA9PT0gdGhpcy5fdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGJ1dHRvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBidXR0b24uY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKGV2KSA9PiB0aGlzLl9zZWxlY3RlZFJhZGlvQnV0dG9uQ2hhbmdlZChldikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRSYWRpb0J1dHRvbkNoYW5nZWQoYXJnczogSUNoYW5nZVJhZGlvRXZlbnRBcmdzKSB7XG4gICAgICAgIHRoaXMucmFkaW9CdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgYnV0dG9uLmNoZWNrZWQgPSBidXR0b24uaWQgPT09IGFyZ3MucmFkaW8uaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gYXJncy5yYWRpbztcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBhcmdzLnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KGFyZ3MpO1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9zZXRSYWRpb0J1dHRvbk5hbWVzKCkge1xuICAgICAgICBpZiAodGhpcy5yYWRpb0J1dHRvbnMpIHtcbiAgICAgICAgICAgIHRoaXMucmFkaW9CdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5uYW1lID0gdGhpcy5fbmFtZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX3NlbGVjdFJhZGlvQnV0dG9uKCkge1xuICAgICAgICBpZiAodGhpcy5yYWRpb0J1dHRvbnMpIHtcbiAgICAgICAgICAgIHRoaXMucmFkaW9CdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBubyB2YWx1ZSAtIHVuY2hlY2sgYWxsIHJhZGlvIGJ1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlID09PSBidXR0b24udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGVjdGVkIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkICE9PSBidXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IGJ1dHRvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFidXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vbi1zZWxlY3RlZCBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcml2YXRlIF9zZXRSYWRpb0J1dHRvbkxhYmVsUG9zaXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJhZGlvQnV0dG9ucykge1xuICAgICAgICAgICAgdGhpcy5yYWRpb0J1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmxhYmVsUG9zaXRpb24gPSB0aGlzLl9sYWJlbFBvc2l0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfc2V0UmFkaW9CdXR0b25zUmVxdWlyZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJhZGlvQnV0dG9ucykge1xuICAgICAgICAgICAgdGhpcy5yYWRpb0J1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnJlcXVpcmVkID0gdGhpcy5fcmVxdWlyZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4UmFkaW9Hcm91cERpcmVjdGl2ZSwgSWd4UmFkaW9Db21wb25lbnRdLFxuICAgIGV4cG9ydHM6IFtJZ3hSYWRpb0dyb3VwRGlyZWN0aXZlLCBJZ3hSYWRpb0NvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW0lneFJpcHBsZU1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4UmFkaW9Nb2R1bGUge31cbiJdfQ==