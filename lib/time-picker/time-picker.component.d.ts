import { ElementRef, EventEmitter, OnDestroy, OnInit, AfterViewInit, Injector, PipeTransform, ChangeDetectorRef, QueryList } from '@angular/core';
import { ControlValueAccessor, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { IgxInputGroupType } from '../input-group/public_api';
import { IDisplayDensityOptions } from '../core/density';
import { IgxTimePickerActionsDirective } from './time-picker.directives';
import { IgxTimePickerBase } from './time-picker.common';
import { OverlaySettings } from '../services/overlay/utilities';
import { ITimePickerResourceStrings } from '../core/i18n/time-picker-resources';
import { IBaseEventArgs, PlatformUtil } from '../core/utils';
import { PickerInteractionMode } from '../date-common/types';
import { IgxLabelDirective } from '../directives/label/label.directive';
import { PickerBaseDirective } from '../date-common/picker-base.directive';
import { DatePart, DatePartDeltas } from '../directives/date-time-editor/public_api';
import { PickerHeaderOrientation } from '../date-common/types';
import { IgxPickerClearComponent } from '../date-common/picker-icons.common';
import * as i0 from "@angular/core";
import * as i1 from "./time-picker.directives";
import * as i2 from "./time-picker.pipes";
import * as i3 from "@angular/common";
import * as i4 from "../directives/date-time-editor/date-time-editor.directive";
import * as i5 from "../input-group/input-group.component";
import * as i6 from "../icon/public_api";
import * as i7 from "../directives/button/button.directive";
import * as i8 from "../directives/mask/mask.directive";
import * as i9 from "../directives/toggle/toggle.directive";
import * as i10 from "../directives/text-selection/text-selection.directive";
import * as i11 from "../date-common/picker-icons.common";
export interface IgxTimePickerValidationFailedEventArgs extends IBaseEventArgs {
    previousValue: Date | string;
    currentValue: Date | string;
}
export declare class IgxTimePickerComponent extends PickerBaseDirective implements IgxTimePickerBase, ControlValueAccessor, OnInit, OnDestroy, AfterViewInit, Validator {
    element: ElementRef;
    protected _localeId: string;
    protected _displayDensityOptions: IDisplayDensityOptions;
    protected _inputGroupType: IgxInputGroupType;
    private _injector;
    private platform;
    private cdr;
    /**
     * An @Input property that sets the value of the `id` attribute.
     * ```html
     * <igx-time-picker [id]="'igx-time-picker-5'" [displayFormat]="h:mm tt" ></igx-time-picker>
     * ```
     */
    id: string;
    /**
     * The format used when editable input is not focused. Defaults to the `inputFormat` if not set.
     *
     * @remarks
     * Uses Angular's `DatePipe`.
     *
     * @example
     * ```html
     * <igx-time-picker displayFormat="mm:ss"></igx-time-picker>
     * ```
     *
     */
    displayFormat: string;
    /**
     * The expected user input format and placeholder.
     *
     * @remarks
     * Default is `hh:mm tt`
     *
     * @example
     * ```html
     * <igx-time-picker inputFormat="HH:mm"></igx-time-picker>
     * ```
     */
    inputFormat: string;
    /**
     * Gets/Sets the interaction mode - dialog or drop down.
     *
     * @example
     * ```html
     * <igx-time-picker mode="dialog"></igx-time-picker>
     * ```
     */
    mode: PickerInteractionMode;
    /**
     * The minimum value the picker will accept.
     *
     * @remarks
     * If a `string` value is passed in, it must be in ISO format.
     *
     * @example
     * ```html
     * <igx-time-picker [minValue]="18:00:00"></igx-time-picker>
     * ```
     */
    set minValue(value: Date | string);
    get minValue(): Date | string;
    /**
     * Gets if the dropdown/dialog is collapsed
     *
     * ```typescript
     * let isCollapsed = this.timePicker.collapsed;
     * ```
     */
    get collapsed(): boolean;
    /**
     * The maximum value the picker will accept.
     *
     * @remarks
     * If a `string` value is passed in, it must be in ISO format.
     *
     * @example
     * ```html
     * <igx-time-picker [maxValue]="20:30:00"></igx-time-picker>
     * ```
     */
    set maxValue(value: Date | string);
    get maxValue(): Date | string;
    /**
     * An @Input property that determines the spin behavior. By default `spinLoop` is set to true.
     * The seconds, minutes and hour spinning will wrap around by default.
     * ```html
     * <igx-time-picker [spinLoop]="false"></igx-time-picker>
     * ```
     */
    spinLoop: boolean;
    /**
     * Gets/Sets a custom formatter function on the selected or passed date.
     *
     * @example
     * ```html
     * <igx-time-picker [value]="date" [formatter]="formatter"></igx-time-picker>
     * ```
     */
    formatter: (val: Date) => string;
    /**
     * Sets the orientation of the picker's header.
     *
     * @remarks
     * Available in dialog mode only. Default value is `horizontal`.
     *
     * ```html
     * <igx-time-picker [headerOrientation]="'vertical'"></igx-time-picker>
     * ```
     */
    headerOrientation: PickerHeaderOrientation;
    /** @hidden @internal */
    readOnly: boolean;
    /**
     * Emitted after a selection has been done.
     *
     * @example
     * ```html
     * <igx-time-picker (selected)="onSelection($event)"></igx-time-picker>
     * ```
     */
    selected: EventEmitter<Date>;
    /**
     * Emitted when the picker's value changes.
     *
     * @remarks
     * Used for `two-way` bindings.
     *
     * @example
     * ```html
     * <igx-time-picker [(value)]="date"></igx-time-picker>
     * ```
     */
    valueChange: EventEmitter<string | Date>;
    /**
     * Emitted when the user types/spins invalid time in the time-picker editor.
     *
     *  @example
     * ```html
     * <igx-time-picker (validationFailed)="onValidationFailed($event)"></igx-time-picker>
     * ```
     */
    validationFailed: EventEmitter<IgxTimePickerValidationFailedEventArgs>;
    /** @hidden */
    hourList: ElementRef;
    /** @hidden */
    minuteList: ElementRef;
    /** @hidden */
    secondsList: ElementRef;
    /** @hidden */
    ampmList: ElementRef;
    /** @hidden @internal */
    clearComponents: QueryList<IgxPickerClearComponent>;
    /** @hidden @internal */
    label: IgxLabelDirective;
    /** @hidden @internal */
    timePickerActionsDirective: IgxTimePickerActionsDirective;
    private inputDirective;
    private _inputGroup;
    private dateTimeEditor;
    private toggleRef;
    /** @hidden */
    cleared: boolean;
    /** @hidden */
    isNotEmpty: boolean;
    /** @hidden */
    currentHour: number;
    /** @hidden */
    currentMinutes: number;
    /** @hidden */
    get showClearButton(): boolean;
    /** @hidden */
    get showHoursList(): boolean;
    /** @hidden */
    get showMinutesList(): boolean;
    /** @hidden */
    get showSecondsList(): boolean;
    /** @hidden */
    get showAmPmList(): boolean;
    /** @hidden */
    get isTwelveHourFormat(): boolean;
    /** @hidden @internal */
    get isDropdown(): boolean;
    /** @hidden @internal */
    get isVertical(): boolean;
    /** @hidden @internal */
    get selectedDate(): Date;
    /** @hidden @internal */
    get minDateValue(): Date;
    /** @hidden @internal */
    get maxDateValue(): Date;
    private get required();
    private get dialogOverlaySettings();
    private get dropDownOverlaySettings();
    /** @hidden @internal */
    displayValue: PipeTransform;
    /** @hidden @internal */
    minDropdownValue: Date;
    /** @hidden @internal */
    maxDropdownValue: Date;
    /** @hidden @internal */
    hourItems: any[];
    /** @hidden @internal */
    minuteItems: any[];
    /** @hidden @internal */
    secondsItems: any[];
    /** @hidden @internal */
    ampmItems: any[];
    private _value;
    private _dateValue;
    private _dateMinValue;
    private _dateMaxValue;
    private _selectedDate;
    private _resourceStrings;
    private _okButtonLabel;
    private _cancelButtonLabel;
    private _itemsDelta;
    private _statusChanges$;
    private _ngControl;
    private _onChangeCallback;
    private _onTouchedCallback;
    private _onValidatorChange;
    private _defaultDialogOverlaySettings;
    private _defaultDropDownOverlaySettings;
    /**
     * The currently selected value / time from the drop-down/dialog
     *
     * @remarks
     * The current value is of type `Date`
     *
     * @example
     * ```typescript
     * const newValue: Date = new Date(2000, 2, 2, 10, 15, 15);
     * this.timePicker.value = newValue;
     * ```
     */
    get value(): Date | string;
    /**
     * An accessor that allows you to set a time using the `value` input.
     * ```html
     * public date: Date = new Date(Date.now());
     *  //...
     * <igx-time-picker [value]="date" format="h:mm tt"></igx-time-picker>
     * ```
     */
    set value(value: Date | string);
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: ITimePickerResourceStrings);
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings(): ITimePickerResourceStrings;
    /**
     * An @Input property that renders OK button with custom text. By default `okButtonLabel` is set to OK.
     * ```html
     * <igx-time-picker okButtonLabel='SET' [value]="date" format="h:mm tt"></igx-time-picker>
     * ```
     */
    set okButtonLabel(value: string);
    /**
     * An accessor that returns the label of ok button.
     */
    get okButtonLabel(): string;
    /**
     * An @Input property that renders cancel button with custom text.
     * By default `cancelButtonLabel` is set to Cancel.
     * ```html
     * <igx-time-picker cancelButtonLabel='Exit' [value]="date" format="h:mm tt"></igx-time-picker>
     * ```
     */
    set cancelButtonLabel(value: string);
    /**
     * An accessor that returns the label of cancel button.
     */
    get cancelButtonLabel(): string;
    /**
     * Delta values used to increment or decrement each editor date part on spin actions and
     * to display time portions in the dropdown/dialog.
     * By default `itemsDelta` is set to `{hour: 1, minute: 1, second: 1}`
     * ```html
     * <igx-time-picker [itemsDelta]="{hour:3, minute:5, second:10}" id="time-picker"></igx-time-picker>
     * ```
     */
    set itemsDelta(value: Pick<DatePartDeltas, 'hours' | 'minutes' | 'seconds'>);
    get itemsDelta(): Pick<DatePartDeltas, 'hours' | 'minutes' | 'seconds'>;
    constructor(element: ElementRef, _localeId: string, _displayDensityOptions: IDisplayDensityOptions, _inputGroupType: IgxInputGroupType, _injector: Injector, platform: PlatformUtil, cdr: ChangeDetectorRef);
    /** @hidden @internal */
    onKeyDown(event: KeyboardEvent): void;
    /** @hidden @internal */
    getPartValue(value: Date, type: string): string;
    /** @hidden @internal */
    toISOString(value: Date): string;
    /** @hidden @internal */
    writeValue(value: Date | string): void;
    /** @hidden @internal */
    registerOnChange(fn: (_: Date | string) => void): void;
    /** @hidden @internal */
    registerOnTouched(fn: () => void): void;
    /** @hidden @internal */
    registerOnValidatorChange(fn: any): void;
    /** @hidden @internal */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @hidden @internal */
    setDisabledState(isDisabled: boolean): void;
    /** @hidden */
    ngOnInit(): void;
    /** @hidden */
    ngAfterViewInit(): void;
    /** @hidden */
    ngOnDestroy(): void;
    /** @hidden */
    getEditElement(): HTMLInputElement;
    /**
     * Opens the picker's dialog UI.
     *
     * @param settings OverlaySettings - the overlay settings to use for positioning the drop down or dialog container according to
     * ```html
     * <igx-time-picker #picker [value]="date"></igx-time-picker>
     * <button (click)="picker.open()">Open Dialog</button>
     * ```
     */
    open(settings?: OverlaySettings): void;
    /**
     * Closes the dropdown/dialog.
     * ```html
     * <igx-time-picker #timePicker></igx-time-picker>
     * ```
     * ```typescript
     * @ViewChild('timePicker', { read: IgxTimePickerComponent }) picker: IgxTimePickerComponent;
     * picker.close();
     * ```
     */
    close(): void;
    toggle(settings?: OverlaySettings): void;
    /**
     * Clears the time picker value if it is a `string` or resets the time to `00:00:00` if the value is a Date object.
     *
     * @example
     * ```typescript
     * this.timePicker.clear();
     * ```
     */
    clear(): void;
    /**
     * Selects time from the igxTimePicker.
     *
     * @example
     * ```typescript
     * this.timePicker.select(date);
     *
     * @param date Date object containing the time to be selected.
     */
    select(date: Date | string): void;
    /**
     * Increment a specified `DatePart`.
     *
     * @param datePart The optional DatePart to increment. Defaults to Hour.
     * @param delta The optional delta to increment by. Overrides `itemsDelta`.
     * @example
     * ```typescript
     * this.timePicker.increment(DatePart.Hours);
     * ```
     */
    increment(datePart?: DatePart, delta?: number): void;
    /**
     * Decrement a specified `DatePart`
     *
     * @param datePart The optional DatePart to decrement. Defaults to Hour.
     * @param delta The optional delta to decrement by. Overrides `itemsDelta`.
     * @example
     * ```typescript
     * this.timePicker.decrement(DatePart.Seconds);
     * ```
     */
    decrement(datePart?: DatePart, delta?: number): void;
    /** @hidden @internal */
    cancelButtonClick(): void;
    /** @hidden @internal */
    okButtonClick(): void;
    /** @hidden @internal */
    onItemClick(item: string, dateType: string): void;
    /** @hidden @internal */
    nextHour(delta: number): void;
    /** @hidden @internal */
    nextMinute(delta: number): void;
    /** @hidden @internal */
    nextSeconds(delta: number): void;
    /** @hidden @internal */
    nextAmPm(delta?: number): void;
    /** @hidden @internal */
    setSelectedValue(value: Date): void;
    protected onStatusChanged(): void;
    private setMinMaxDropdownValue;
    private initializeContainer;
    private validateDropdownValue;
    private emitValueChange;
    private emitValidationFailedEvent;
    private updateValidityOnBlur;
    private valueInRange;
    private parseToDate;
    private toTwentyFourHourFormat;
    private updateValue;
    private updateEditorValue;
    private subscribeToDateEditorEvents;
    private subscribeToToggleDirectiveEvents;
    static ??fac: i0.????FactoryDeclaration<IgxTimePickerComponent, [null, null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ??cmp: i0.????ComponentDeclaration<IgxTimePickerComponent, "igx-time-picker", never, { "id": "id"; "displayFormat": "displayFormat"; "inputFormat": "inputFormat"; "mode": "mode"; "minValue": "minValue"; "maxValue": "maxValue"; "spinLoop": "spinLoop"; "formatter": "formatter"; "headerOrientation": "headerOrientation"; "readOnly": "readOnly"; "value": "value"; "resourceStrings": "resourceStrings"; "okButtonLabel": "okButtonLabel"; "cancelButtonLabel": "cancelButtonLabel"; "itemsDelta": "itemsDelta"; }, { "selected": "selected"; "valueChange": "valueChange"; "validationFailed": "validationFailed"; }, ["label", "timePickerActionsDirective", "clearComponents"], ["[igxLabel]", "igx-prefix,[igxPrefix]", "igx-suffix,[igxSuffix]", "igx-hint,[igxHint]"]>;
}
/**
 * @hidden
 */
export declare class IgxTimePickerModule {
    static ??fac: i0.????FactoryDeclaration<IgxTimePickerModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxTimePickerModule, [typeof IgxTimePickerComponent, typeof i1.IgxItemListDirective, typeof i1.IgxTimeItemDirective, typeof i1.IgxTimePickerTemplateDirective, typeof i1.IgxTimePickerActionsDirective, typeof i2.TimeFormatPipe, typeof i2.TimeItemPipe], [typeof i3.CommonModule, typeof i4.IgxDateTimeEditorModule, typeof i5.IgxInputGroupModule, typeof i6.IgxIconModule, typeof i7.IgxButtonModule, typeof i8.IgxMaskModule, typeof i9.IgxToggleModule, typeof i10.IgxTextSelectionModule], [typeof IgxTimePickerComponent, typeof i1.IgxTimePickerTemplateDirective, typeof i1.IgxTimePickerActionsDirective, typeof i11.IgxPickersCommonModule, typeof i5.IgxInputGroupModule]>;
    static ??inj: i0.????InjectorDeclaration<IgxTimePickerModule>;
}
