import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, Injector, NgModuleRef, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { WEEKDAYS } from '../calendar/public_api';
import { IDisplayDensityOptions } from '../core/density';
import { IDateRangePickerResourceStrings } from '../core/i18n/date-range-picker-resources';
import { PlatformUtil } from '../core/utils';
import { IgxPickerActionsDirective } from '../date-common/picker-icons.common';
import { PickerBaseDirective } from '../date-common/picker-base.directive';
import { IgxOverlayOutletDirective } from '../directives/toggle/toggle.directive';
import { IgxInputDirective, IgxInputGroupComponent, IgxInputGroupType, IgxLabelDirective } from '../input-group/public_api';
import { IgxOverlayService, OverlaySettings } from '../services/public_api';
import { DateRange, IgxDateRangeInputsBaseComponent } from './date-range-picker-inputs.common';
import * as i0 from "@angular/core";
/**
 * Provides the ability to select a range of dates from a calendar UI or editable inputs.
 *
 * @igxModule IgxDateRangeModule
 *
 * @igxTheme igx-input-group-theme, igx-calendar-theme, igx-date-range-picker-theme
 *
 * @igxKeywords date, range, date range, date picker
 *
 * @igxGroup scheduling
 *
 * @remarks
 * It displays the range selection in a single or two input fields.
 * The default template displays a single *readonly* input field
 * while projecting `igx-date-range-start` and `igx-date-range-end`
 * displays two *editable* input fields.
 *
 * @example
 * ```html
 * <igx-date-range-picker mode="dropdown"></igx-date-range-picker>
 * ```
 */
export declare class IgxDateRangePickerComponent extends PickerBaseDirective implements OnChanges, OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
    element: ElementRef;
    protected _localeId: any;
    protected platform: PlatformUtil;
    private _injector;
    private _moduleRef;
    private _cdr;
    private _overlayService;
    protected _displayDensityOptions?: IDisplayDensityOptions;
    protected _inputGroupType?: IgxInputGroupType;
    /**
     * The number of displayed month views.
     *
     * @remarks
     * Default is `2`.
     *
     * @example
     * ```html
     * <igx-date-range-picker [displayMonthsCount]="3"></igx-date-range-picker>
     * ```
     */
    displayMonthsCount: number;
    /**
     * Gets/Sets whether dates that are not part of the current month will be displayed.
     *
     * @remarks
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-date-range-picker [hideOutsideDays]="true"></igx-date-range-picker>
     * ```
     */
    hideOutsideDays: boolean;
    /**
     * The start day of the week.
     *
     * @remarks
     * Can be assigned to a numeric value or to `WEEKDAYS` enum value.
     *
     * @example
     * ```html
     * <igx-date-range-picker [weekStart]="1"></igx-date-range-picker>
     * ```
     */
    weekStart: WEEKDAYS;
    /**
     * Locale settings used for value formatting and calendar.
     *
     * @remarks
     * Uses Angular's `LOCALE_ID` by default. Affects both input mask and display format if those are not set.
     * If a `locale` is set, it must be registered via `registerLocaleData`.
     * Please refer to https://angular.io/guide/i18n#i18n-pipes.
     * If it is not registered, `Intl` will be used for formatting.
     *
     * @example
     * ```html
     * <igx-date-range-picker locale="jp"></igx-date-range-picker>
     * ```
     */
    locale: string;
    /**
     * A custom formatter function, applied on the selected or passed in date.
     *
     * @example
     * ```typescript
     * private dayFormatter = new Intl.DateTimeFormat("en", { weekday: "long" });
     * private monthFormatter = new Intl.DateTimeFormat("en", { month: "long" });
     *
     * public formatter(date: Date): string {
     *  return `${this.dayFormatter.format(date)} - ${this.monthFormatter.format(date)} - ${date.getFullYear()}`;
     * }
     * ```
     * ```html
     * <igx-date-range-picker [formatter]="formatter"></igx-date-range-picker>
     * ```
     */
    formatter: (val: DateRange) => string;
    /**
     * The default text of the calendar dialog `done` button.
     *
     * @remarks
     * Default value is `Done`.
     * An @Input property that renders Done button with custom text. By default `doneButtonText` is set to Done.
     * The button will only show up in `dialog` mode.
     *
     * @example
     * ```html
     * <igx-date-range-picker doneButtonText="??????"></igx-date-range-picker>
     * ```
     */
    set doneButtonText(value: string);
    get doneButtonText(): string;
    /**
     * Custom overlay settings that should be used to display the calendar.
     *
     * @example
     * ```html
     * <igx-date-range-picker [overlaySettings]="customOverlaySettings"></igx-date-range-picker>
     * ```
     */
    overlaySettings: OverlaySettings;
    /**
     * The format used when editable inputs are not focused.
     *
     * @remarks
     * Uses Angular's DatePipe.
     *
     * @example
     * ```html
     * <igx-date-range-picker displayFormat="EE/M/yy"></igx-date-range-picker>
     * ```
     *
     */
    displayFormat: string;
    /**
     * The expected user input format and placeholder.
     *
     * @remarks
     * Default is `"'MM/dd/yyyy'"`
     *
     * @example
     * ```html
     * <igx-date-range-picker inputFormat="dd/MM/yy"></igx-date-range-picker>
     * ```
     */
    inputFormat: string;
    /**
     * The minimum value in a valid range.
     *
     * @example
     * <igx-date-range-picker [minValue]="minDate"></igx-date-range-picker>
     */
    set minValue(value: Date | string);
    get minValue(): Date | string;
    /**
     * The maximum value in a valid range.
     *
     * @example
     * <igx-date-range-picker [maxValue]="maxDate"></igx-date-range-picker>
     */
    set maxValue(value: Date | string);
    get maxValue(): Date | string;
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: IDateRangePickerResourceStrings);
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings(): IDateRangePickerResourceStrings;
    /**
     * Sets the `placeholder` for single-input `IgxDateRangePickerComponent`.
     *
     *   @example
     * ```html
     * <igx-date-range-picker [placeholder]="'Choose your dates'"></igx-date-range-picker>
     * ```
     */
    placeholder: string;
    /**
     * Gets/Sets the container used for the popup element.
     *
     * @remarks
     *  `outlet` is an instance of `IgxOverlayOutletDirective` or an `ElementRef`.
     * @example
     * ```html
     * <div igxOverlayOutlet #outlet="overlay-outlet"></div>
     * //..
     * <igx-date-range-picker [outlet]="outlet"></igx-date-range-picker>
     * //..
     * ```
     */
    outlet: IgxOverlayOutletDirective | ElementRef<any>;
    /**
     * Emitted when the picker's value changes. Used for two-way binding.
     *
     * @example
     * ```html
     * <igx-date-range-picker [(value)]="date"></igx-date-range-picker>
     * ```
     */
    valueChange: EventEmitter<DateRange>;
    /** @hidden @internal */
    cssClass: string;
    /** @hidden @internal */
    inputGroup: IgxInputGroupComponent;
    /** @hidden @internal */
    inputDirective: IgxInputDirective;
    /** @hidden @internal */
    projectedInputs: QueryList<IgxDateRangeInputsBaseComponent>;
    label: IgxLabelDirective;
    pickerActions: IgxPickerActionsDirective;
    /** @hidden @internal */
    dateSeparatorTemplate: TemplateRef<any>;
    /** @hidden @internal */
    get dateSeparator(): string;
    /** @hidden @internal */
    get appliedFormat(): string;
    /** @hidden @internal */
    get singleInputFormat(): string;
    /**
     * Gets calendar state.
     *
     * ```typescript
     * let state = this.dateRange.collapsed;
     * ```
     */
    get collapsed(): boolean;
    /**
     * The currently selected value / range from the calendar
     *
     * @remarks
     * The current value is of type `DateRange`
     *
     * @example
     * ```typescript
     * const newValue: DateRange = { start: new Date("2/2/2012"), end: new Date("3/3/2013")};
     * this.dateRangePicker.value = newValue;
     * ```
     */
    get value(): DateRange | null;
    set value(value: DateRange | null);
    /** @hidden @internal */
    get hasProjectedInputs(): boolean;
    /** @hidden @internal */
    get separatorClass(): string;
    private get required();
    private get calendar();
    private get dropdownOverlaySettings();
    private get dialogOverlaySettings();
    private _resourceStrings;
    private _doneButtonText;
    private _dateSeparator;
    private _value;
    private _overlayId;
    private _ngControl;
    private _statusChanges$;
    private _calendar;
    private _positionSettings;
    private _focusedInput;
    private _overlaySubFilter;
    private _dialogOverlaySettings;
    private _dropDownOverlaySettings;
    private onChangeCallback;
    private onTouchCallback;
    private onValidatorChange;
    constructor(element: ElementRef, _localeId: any, platform: PlatformUtil, _injector: Injector, _moduleRef: NgModuleRef<any>, _cdr: ChangeDetectorRef, _overlayService: IgxOverlayService, _displayDensityOptions?: IDisplayDensityOptions, _inputGroupType?: IgxInputGroupType);
    /** @hidden @internal */
    onKeyDown(event: KeyboardEvent): void;
    /**
     * Opens the date range picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-range-picker #dateRange></igx-date-range-picker>
     *
     * <button (click)="dateRange.open()">Open Dialog</button
     * ```
     */
    open(overlaySettings?: OverlaySettings): void;
    /**
     * Closes the date range picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-range-picker #dateRange></igx-date-range-picker>
     *
     * <button (click)="dateRange.close()">Close Dialog</button>
     * ```
     */
    close(): void;
    /**
     * Toggles the date range picker's dropdown or dialog
     *
     * @example
     * ```html
     * <igx-date-range-picker #dateRange></igx-date-range-picker>
     *
     * <button (click)="dateRange.toggle()">Toggle Dialog</button>
     * ```
     */
    toggle(overlaySettings?: OverlaySettings): void;
    /**
     * Selects a range of dates. If no `endDate` is passed, range is 1 day (only `startDate`)
     *
     * @example
     * ```typescript
     * public selectFiveDayRange() {
     *  const today = new Date();
     *  const inFiveDays = new Date(new Date().setDate(today.getDate() + 5));
     *  this.dateRange.select(today, inFiveDays);
     * }
     * ```
     */
    select(startDate: Date, endDate?: Date): void;
    /** @hidden @internal */
    writeValue(value: DateRange): void;
    /** @hidden @internal */
    registerOnChange(fn: any): void;
    /** @hidden @internal */
    registerOnTouched(fn: any): void;
    /** @hidden @internal */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @hidden @internal */
    registerOnValidatorChange?(fn: any): void;
    /** @hidden @internal */
    setDisabledState?(isDisabled: boolean): void;
    /** @hidden */
    ngOnInit(): void;
    /** @hidden */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnChanges(changes: SimpleChanges): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /** @hidden @internal */
    getEditElement(): HTMLInputElement;
    protected onStatusChanged: () => void;
    private get isTouchedOrDirty();
    private handleSelection;
    private handleClosing;
    private subscribeToOverlayEvents;
    private updateValue;
    private updateValidityOnBlur;
    private updateDisabledState;
    private getInputState;
    private setRequiredToInputs;
    private parseMinValue;
    private parseMaxValue;
    private updateCalendar;
    private swapEditorDates;
    private valueInRange;
    private extractRange;
    private toRangeOfDates;
    private subscribeToDateEditorEvents;
    private attachOnTouched;
    private cacheFocusedInput;
    private configPositionStrategy;
    private configOverlaySettings;
    private initialSetValue;
    private updateInputs;
    private updateDisplayFormat;
    private updateInputFormat;
    private _initializeCalendarContainer;
    static ??fac: i0.????FactoryDeclaration<IgxDateRangePickerComponent, [null, null, null, null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxDateRangePickerComponent, "igx-date-range-picker", never, { "displayMonthsCount": "displayMonthsCount"; "hideOutsideDays": "hideOutsideDays"; "weekStart": "weekStart"; "locale": "locale"; "formatter": "formatter"; "doneButtonText": "doneButtonText"; "overlaySettings": "overlaySettings"; "displayFormat": "displayFormat"; "inputFormat": "inputFormat"; "minValue": "minValue"; "maxValue": "maxValue"; "resourceStrings": "resourceStrings"; "placeholder": "placeholder"; "outlet": "outlet"; "value": "value"; }, { "valueChange": "valueChange"; }, ["label", "pickerActions", "dateSeparatorTemplate", "projectedInputs"], ["igx-date-single", "igx-date-range-start", "igx-date-range-end", "[igxLabel]", "igx-prefix,[igxPrefix]", "igx-suffix,[igxSuffix]", "igx-hint,[igxHint]"]>;
}
