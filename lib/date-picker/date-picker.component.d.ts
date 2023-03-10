import { EventEmitter, OnDestroy, ElementRef, NgModuleRef, OnInit, AfterViewInit, Injector, AfterViewChecked, QueryList, Renderer2, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { WEEKDAYS, IFormattingViews, IFormattingOptions } from '../calendar/public_api';
import { IgxLabelDirective, IgxInputGroupType } from '../input-group/public_api';
import { IgxOverlayOutletDirective } from '../directives/toggle/toggle.directive';
import { OverlaySettings, IgxOverlayService } from '../services/public_api';
import { IDatePickerResourceStrings } from '../core/i18n/date-picker-resources';
import { DateRangeDescriptor } from '../core/dates/dateRange';
import { PlatformUtil } from '../core/utils';
import { PickerBaseDirective } from '../date-common/picker-base.directive';
import { IDisplayDensityOptions } from '../core/density';
import { DatePart, DatePartDeltas } from '../directives/date-time-editor/public_api';
import { PickerHeaderOrientation as PickerHeaderOrientation } from '../date-common/types';
import { IDatePickerValidationFailedEventArgs } from './date-picker.common';
import { IgxPickerClearComponent } from '../date-common/public_api';
import * as i0 from "@angular/core";
/**
 * Date Picker displays a popup calendar that lets users select a single date.
 *
 * @igxModule IgxDatePickerModule
 * @igxTheme igx-calendar-theme, igx-icon-theme
 * @igxGroup Scheduling
 * @igxKeywords datepicker, calendar, schedule, date
 * @example
 * ```html
 * <igx-date-picker [(ngModel)]="selectedDate"></igx-date-picker>
 * ```
 */
export declare class IgxDatePickerComponent extends PickerBaseDirective implements ControlValueAccessor, Validator, OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
    element: ElementRef<HTMLElement>;
    protected _localeId: string;
    private _overlayService;
    private _moduleRef;
    private _injector;
    private _renderer;
    private platform;
    private cdr;
    protected _displayDensityOptions?: IDisplayDensityOptions;
    protected _inputGroupType?: IgxInputGroupType;
    /**
     * Gets/Sets on which day the week starts.
     *
     * @example
     * ```html
     * <igx-date-picker [weekStart]="4" cancelButtonLabel="cancel" todayButtonLabel="today"></igx-date-picker>
     * ```
     */
    weekStart: WEEKDAYS | number;
    /**
     * Gets/Sets whether the inactive dates will be hidden.
     *
     * @remarks
     * Applies to dates that are out of the current month.
     * Default value is `false`.
     * @example
     * ```html
     * <igx-date-picker [hideOutsideDays]="true"></igx-date-picker>
     * ```
     * @example
     * ```typescript
     * let hideOutsideDays = this.datePicker.hideOutsideDays;
     * ```
     */
    hideOutsideDays: boolean;
    /**
     * Gets/Sets the number of month views displayed.
     *
     * @remarks
     * Default value is `1`.
     *
     * @example
     * ```html
     * <igx-date-picker [displayMonthsCount]="2"></igx-date-picker>
     * ```
     * @example
     * ```typescript
     * let monthViewsDisplayed = this.datePicker.displayMonthsCount;
     * ```
     */
    displayMonthsCount: number;
    /**
     * Show/hide week numbers
     *
     * @example
     * ```html
     * <igx-date-picker [showWeekNumbers]="true"></igx-date-picker>
     * ``
     */
    showWeekNumbers: boolean;
    /**
     * Gets/Sets a custom formatter function on the selected or passed date.
     *
     * @example
     * ```html
     * <igx-date-picker [value]="date" [formatter]="formatter"></igx-date-picker>
     * ```
     */
    formatter: (val: Date) => string;
    /**
     * Gets/Sets the orientation of the `IgxDatePickerComponent` header.
     *
     *  @example
     * ```html
     * <igx-date-picker headerOrientation="vertical"></igx-date-picker>
     * ```
     */
    headerOrientation: PickerHeaderOrientation;
    /**
     * Gets/Sets the today button's label.
     *
     *  @example
     * ```html
     * <igx-date-picker todayButtonLabel="Today"></igx-date-picker>
     * ```
     */
    todayButtonLabel: string;
    /**
     * Gets/Sets the cancel button's label.
     *
     * @example
     * ```html
     * <igx-date-picker cancelButtonLabel="Cancel"></igx-date-picker>
     * ```
     */
    cancelButtonLabel: string;
    /**
     * Specify if the currently spun date segment should loop over.
     *
     *  @example
     * ```html
     * <igx-date-picker [spinLoop]="false"></igx-date-picker>
     * ```
     */
    spinLoop: boolean;
    /**
     * Delta values used to increment or decrement each editor date part on spin actions.
     * All values default to `1`.
     *
     * @example
     * ```html
     * <igx-date-picker [spinDelta]="{ date: 5, month: 2 }"></igx-date-picker>
     * ```
     */
    spinDelta: Pick<DatePartDeltas, 'date' | 'month' | 'year'>;
    /**
     * Gets/Sets the container used for the popup element.
     *
     * @remarks
     *  `outlet` is an instance of `IgxOverlayOutletDirective` or an `ElementRef`.
     * @example
     * ```html
     * <div igxOverlayOutlet #outlet="overlay-outlet"></div>
     * //..
     * <igx-date-picker [outlet]="outlet"></igx-date-picker>
     * //..
     * ```
     */
    outlet: IgxOverlayOutletDirective | ElementRef;
    /**
     * Gets/Sets the value of `id` attribute.
     *
     * @remarks If not provided it will be automatically generated.
     * @example
     * ```html
     * <igx-date-picker [id]="'igx-date-picker-3'" cancelButtonLabel="cancel" todayButtonLabel="today"></igx-date-picker>
     * ```
     */
    id: string;
    /**
     * Gets/Sets the format views of the `IgxDatePickerComponent`.
     *
     * @example
     * ```typescript
     * let formatViews = this.datePicker.formatViews;
     *  this.datePicker.formatViews = {day:false, month: false, year:false};
     * ```
     */
    formatViews: IFormattingViews;
    /**
     * Gets/Sets the disabled dates descriptors.
     *
     * @example
     * ```typescript
     * let disabledDates = this.datepicker.disabledDates;
     * this.datePicker.disabledDates = [ {type: DateRangeType.Weekends}, ...];
     * ```
     */
    get disabledDates(): DateRangeDescriptor[];
    set disabledDates(value: DateRangeDescriptor[]);
    /**
     * Gets/Sets the special dates descriptors.
     *
     * @example
     * ```typescript
     * let specialDates = this.datepicker.specialDates;
     * this.datePicker.specialDates = [ {type: DateRangeType.Weekends}, ... ];
     * ```
     */
    get specialDates(): DateRangeDescriptor[];
    set specialDates(value: DateRangeDescriptor[]);
    /**
     * Gets/Sets the format options of the `IgxDatePickerComponent`.
     *
     * @example
     * ```typescript
     * this.datePicker.calendarFormat = {day: "numeric",  month: "long", weekday: "long", year: "numeric"};
     * ```
     */
    calendarFormat: IFormattingOptions;
    /**
     * Gets/Sets the selected date.
     *
     *  @example
     * ```html
     * <igx-date-picker [value]="date"></igx-date-picker>
     * ```
     */
    get value(): Date | string;
    set value(date: Date | string);
    /**
     * The minimum value the picker will accept.
     *
     * @example
     * <igx-date-picker [minValue]="minDate"></igx-date-picker>
     */
    set minValue(value: Date | string);
    get minValue(): Date | string;
    /**
     * The maximum value the picker will accept.
     *
     * @example
     * <igx-date-picker [maxValue]="maxDate"></igx-date-picker>
     */
    set maxValue(value: Date | string);
    get maxValue(): Date | string;
    /**
     * Gets/Sets the resource strings for the picker's default toggle icon.
     * By default it uses EN resources.
     */
    resourceStrings: IDatePickerResourceStrings;
    /** @hidden @internal */
    readOnly: boolean;
    /**
     * Emitted when the picker's value changes.
     *
     * @remarks
     * Used for `two-way` bindings.
     *
     * @example
     * ```html
     * <igx-date-picker [(value)]="date"></igx-date-picker>
     * ```
     */
    valueChange: EventEmitter<Date>;
    /**
     * Emitted when the user types/spins invalid date in the date-picker editor.
     *
     *  @example
     * ```html
     * <igx-date-picker (validationFailed)="onValidationFailed($event)"></igx-date-picker>
     * ```
     */
    validationFailed: EventEmitter<IDatePickerValidationFailedEventArgs>;
    /** @hidden @internal */
    clearComponents: QueryList<IgxPickerClearComponent>;
    /** @hidden @internal */
    label: IgxLabelDirective;
    private headerTemplate;
    private dateTimeEditor;
    private inputGroup;
    private labelDirective;
    private inputDirective;
    private subheaderTemplate;
    private pickerActions;
    private get dialogOverlaySettings();
    private get dropDownOverlaySettings();
    private get inputGroupElement();
    private get dateValue();
    private get pickerFormatViews();
    private get pickerCalendarFormat();
    /** @hidden @internal */
    displayValue: PipeTransform;
    private _resourceStrings;
    private _dateValue;
    private _overlayId;
    private _value;
    private _targetViewDate;
    private _ngControl;
    private _statusChanges$;
    private _calendar;
    private _specialDates;
    private _disabledDates;
    private _overlaySubFilter;
    private _dropDownOverlaySettings;
    private _dialogOverlaySettings;
    private _calendarFormat;
    private _defFormatViews;
    private _onChangeCallback;
    private _onTouchedCallback;
    private _onValidatorChange;
    constructor(element: ElementRef<HTMLElement>, _localeId: string, _overlayService: IgxOverlayService, _moduleRef: NgModuleRef<any>, _injector: Injector, _renderer: Renderer2, platform: PlatformUtil, cdr: ChangeDetectorRef, _displayDensityOptions?: IDisplayDensityOptions, _inputGroupType?: IgxInputGroupType);
    /** @hidden @internal */
    get required(): boolean;
    /** @hidden @internal */
    get pickerResourceStrings(): IDatePickerResourceStrings;
    /** @hidden @internal */
    onKeyDown(event: KeyboardEvent): void;
    /**
     * Opens the picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.open()">Open Dialog</button>
     * ```
     */
    open(settings?: OverlaySettings): void;
    /**
     * Toggles the picker's dropdown or dialog
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.toggle()">Toggle Dialog</button>
     * ```
     */
    toggle(settings?: OverlaySettings): void;
    /**
     * Closes the picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.close()">Close Dialog</button>
     * ```
     */
    close(): void;
    /**
     * Selects a date.
     *
     * @remarks Updates the value in the input field.
     *
     * @example
     * ```typescript
     * this.datePicker.select(date);
     * ```
     * @param date passed date that has to be set to the calendar.
     */
    select(value: Date): void;
    /**
     * Selects today's date and closes the picker.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.selectToday()">Select Today</button>
     * ```
     * */
    selectToday(): void;
    /**
     * Clears the input field and the picker's value.
     *
     * @example
     * ```typescript
     * this.datePicker.clear();
     * ```
     */
    clear(): void;
    /**
     * Increment a specified `DatePart`.
     *
     * @param datePart The optional DatePart to increment. Defaults to Date.
     * @param delta The optional delta to increment by. Overrides `spinDelta`.
     * @example
     * ```typescript
     * this.datePicker.increment(DatePart.Date);
     * ```
     */
    increment(datePart?: DatePart, delta?: number): void;
    /**
     * Decrement a specified `DatePart`
     *
     * @param datePart The optional DatePart to decrement. Defaults to Date.
     * @param delta The optional delta to decrement by. Overrides `spinDelta`.
     * @example
     * ```typescript
     * this.datePicker.decrement(DatePart.Date);
     * ```
     */
    decrement(datePart?: DatePart, delta?: number): void;
    /** @hidden @internal */
    writeValue(value: Date | string): void;
    /** @hidden @internal */
    registerOnChange(fn: any): void;
    /** @hidden @internal */
    registerOnTouched(fn: any): void;
    /** @hidden @internal */
    setDisabledState?(isDisabled: boolean): void;
    /** @hidden @internal */
    registerOnValidatorChange(fn: any): void;
    /** @hidden @internal */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @hidden @internal */
    ngOnInit(): void;
    /** @hidden @internal */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngAfterViewChecked(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /** @hidden @internal */
    getEditElement(): HTMLInputElement;
    private subscribeToClick;
    private setDateValue;
    private updateValidity;
    private get isTouchedOrDirty();
    private onStatusChanged;
    private handleSelection;
    private subscribeToDateEditorEvents;
    private subscribeToOverlayEvents;
    private getMinMaxDates;
    private setDisabledDates;
    private _initializeCalendarContainer;
    private setCalendarViewDate;
    static ??fac: i0.????FactoryDeclaration<IgxDatePickerComponent, [null, null, null, null, null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxDatePickerComponent, "igx-date-picker", never, { "weekStart": "weekStart"; "hideOutsideDays": "hideOutsideDays"; "displayMonthsCount": "displayMonthsCount"; "showWeekNumbers": "showWeekNumbers"; "formatter": "formatter"; "headerOrientation": "headerOrientation"; "todayButtonLabel": "todayButtonLabel"; "cancelButtonLabel": "cancelButtonLabel"; "spinLoop": "spinLoop"; "spinDelta": "spinDelta"; "outlet": "outlet"; "id": "id"; "formatViews": "formatViews"; "disabledDates": "disabledDates"; "specialDates": "specialDates"; "calendarFormat": "calendarFormat"; "value": "value"; "minValue": "minValue"; "maxValue": "maxValue"; "resourceStrings": "resourceStrings"; "readOnly": "readOnly"; }, { "valueChange": "valueChange"; "validationFailed": "validationFailed"; }, ["label", "headerTemplate", "subheaderTemplate", "pickerActions", "clearComponents"], ["[igxLabel]", "igx-prefix,[igxPrefix]", "igx-suffix,[igxSuffix]", "igx-hint,[igxHint]"]>;
}
