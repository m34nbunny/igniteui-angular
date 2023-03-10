import { EventEmitter } from '@angular/core';
import { WEEKDAYS, Calendar, IFormattingOptions, IFormattingViews } from './calendar';
import { ControlValueAccessor } from '@angular/forms';
import { DateRangeDescriptor } from '../core/dates';
import { Subject } from 'rxjs';
import { PlatformUtil } from '../core/utils';
import { IgxCalendarView } from './month-picker-base';
import { ICalendarResourceStrings } from '../core/i18n/calendar-resources';
import * as i0 from "@angular/core";
/**
 * Sets the selection type - single, multi or range.
 */
export declare const CalendarSelection: {
    SINGLE: "single";
    MULTI: "multi";
    RANGE: "range";
};
export declare type CalendarSelection = (typeof CalendarSelection)[keyof typeof CalendarSelection];
export declare enum ScrollMonth {
    PREV = "prev",
    NEXT = "next",
    NONE = "none"
}
export interface IViewDateChangeEventArgs {
    previousValue: Date;
    currentValue: Date;
}
/** @hidden @internal */
export declare class IgxCalendarBaseDirective implements ControlValueAccessor {
    protected platform: PlatformUtil;
    /**
     * Sets/gets whether the outside dates (dates that are out of the current month) will be hidden.
     * Default value is `false`.
     * ```html
     * <igx-calendar [hideOutsideDays] = "true"></igx-calendar>
     * ```
     * ```typescript
     * let hideOutsideDays = this.calendar.hideOutsideDays;
     * ```
     */
    hideOutsideDays: boolean;
    /**
     * Emits an event when a date is selected.
     * Provides reference the `selectedDates` property.
     */
    selected: EventEmitter<Date | Date[]>;
    /**
     * Emits an event when the month in view is changed.
     * ```html
     * <igx-calendar (viewDateChanged)="viewDateChanged($event)"></igx-calendar>
     * ```
     * ```typescript
     * public viewDateChanged(event: IViewDateChangeEventArgs) {
     *  let viewDate = event.currentValue;
     * }
     * ```
     */
    viewDateChanged: EventEmitter<IViewDateChangeEventArgs>;
    /**
     * Emits an event when the active view is changed.
     * ```html
     * <igx-calendar (activeViewChanged)="activeViewChanged($event)"></igx-calendar>
     * ```
     * ```typescript
     * public activeViewChanged(event: CalendarView) {
     *  let activeView = event;
     * }
     * ```
     */
    activeViewChanged: EventEmitter<IgxCalendarView>;
    /**
     * @hidden
     */
    rangeStarted: boolean;
    /**
     * @hidden
     */
    monthScrollDirection: ScrollMonth;
    /**
     * @hidden
     */
    scrollMonth$: Subject<unknown>;
    /**
     * @hidden
     */
    stopMonthScroll$: Subject<boolean>;
    /**
     * @hidden
     */
    startMonthScroll$: Subject<unknown>;
    /**
     * @hidden
     */
    selectedDates: any;
    /**
     * @hidden
     */
    protected formatterWeekday: any;
    /**
     * @hidden
     */
    protected formatterDay: any;
    /**
     * @hidden
     */
    protected formatterMonth: any;
    /**
     * @hidden
     */
    protected formatterYear: any;
    /**
     * @hidden
     */
    protected formatterMonthday: any;
    /**
     * @hidden
     */
    protected calendarModel: Calendar;
    /**
     * @hidden
     */
    protected _onTouchedCallback: () => void;
    /**
     * @hidden
     */
    protected _onChangeCallback: (_: Date) => void;
    /**
     * @hidden
     */
    private selectedDatesWithoutFocus;
    /**
     * @hidden
     */
    private _locale;
    /**
     * @hidden
     */
    private _viewDate;
    /**
     * @hidden
     */
    private _disabledDates;
    /**
     * @hidden
     */
    private _specialDates;
    /**
     * @hidden
     */
    private _selection;
    /** @hidden @internal */
    private _resourceStrings;
    /**
     * @hidden
     */
    private _formatOptions;
    /**
     * @hidden
     */
    private _formatViews;
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: ICalendarResourceStrings);
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings(): ICalendarResourceStrings;
    /**
     * Gets the start day of the week.
     * Can return a numeric or an enum representation of the week day.
     * Defaults to `Sunday` / `0`.
     */
    get weekStart(): WEEKDAYS | number;
    /**
     * Sets the start day of the week.
     * Can be assigned to a numeric value or to `WEEKDAYS` enum value.
     */
    set weekStart(value: WEEKDAYS | number);
    /**
     * Gets the `locale` of the calendar.
     * Default value is `"en"`.
     */
    get locale(): string;
    /**
     * Sets the `locale` of the calendar.
     * Expects a valid BCP 47 language tag.
     * Default value is `"en"`.
     */
    set locale(value: string);
    /**
     * Gets the date format options of the days view.
     */
    get formatOptions(): IFormattingOptions;
    /**
     * Sets the date format options of the days view.
     * Default is { day: 'numeric', month: 'short', weekday: 'short', year: 'numeric' }
     */
    set formatOptions(formatOptions: IFormattingOptions);
    /**
     * Gets whether the `day`, `month` and `year` should be rendered
     * according to the locale and formatOptions, if any.
     */
    get formatViews(): IFormattingViews;
    /**
     * Gets whether the `day`, `month` and `year` should be rendered
     * according to the locale and formatOptions, if any.
     */
    set formatViews(formatViews: IFormattingViews);
    /**
     *
     * Gets the selection type.
     * Default value is `"single"`.
     * Changing the type of selection resets the currently
     * selected values if any.
     */
    get selection(): string;
    /**
     * Sets the selection.
     */
    set selection(value: string);
    /**
     * Gets the selected date(s).
     *
     * When selection is set to `single`, it returns
     * a single `Date` object.
     * Otherwise it is an array of `Date` objects.
     */
    get value(): Date | Date[];
    /**
     * Sets the selected date(s).
     *
     * When selection is set to `single`, it accepts
     * a single `Date` object.
     * Otherwise it is an array of `Date` objects.
     */
    set value(value: Date | Date[]);
    /**
     * Gets the date that is presented.
     * By default it is the current date.
     */
    get viewDate(): Date;
    /**
     * Sets the date that will be presented in the default view when the component renders.
     */
    set viewDate(value: Date);
    /**
     * Gets the disabled dates descriptors.
     */
    get disabledDates(): DateRangeDescriptor[];
    /**
     * Sets the disabled dates' descriptors.
     * ```typescript
     * @ViewChild("MyCalendar")
     * public calendar: IgxCalendarComponent;
     * ngOnInit(){
     *    this.calendar.disabledDates = [
     *     {type: DateRangeType.Between, dateRange: [new Date("2020-1-1"), new Date("2020-1-15")]},
     *     {type: DateRangeType.Weekends}];
     * }
     * ```
     */
    set disabledDates(value: DateRangeDescriptor[]);
    /**
     * Gets the special dates descriptors.
     */
    get specialDates(): DateRangeDescriptor[];
    /**
     * Sets the special dates' descriptors.
     * ```typescript
     * @ViewChild("MyCalendar")
     * public calendar: IgxCalendarComponent;
     * ngOnInit(){
     *    this.calendar.specialDates = [
     *     {type: DateRangeType.Between, dateRange: [new Date("2020-1-1"), new Date("2020-1-15")]},
     *     {type: DateRangeType.Weekends}];
     * }
     * ```
     */
    set specialDates(value: DateRangeDescriptor[]);
    /**
     * @hidden
     */
    constructor(platform: PlatformUtil);
    /**
     * Performs deselection of a single value, when selection is multi
     * Usually performed by the selectMultiple method, but leads to bug when multiple months are in view
     *
     * @hidden
     */
    deselectMultipleInMonth(value: Date): void;
    /**
     * @hidden
     */
    registerOnChange(fn: (v: Date) => void): void;
    /**
     * @hidden
     */
    registerOnTouched(fn: () => void): void;
    /**
     * @hidden
     */
    writeValue(value: Date | Date[]): void;
    /**
     * Checks whether a date is disabled.
     *
     * @hidden
     */
    isDateDisabled(date: Date): boolean;
    /**
     * Selects date(s) (based on the selection type).
     */
    selectDate(value: Date | Date[]): void;
    /**
     * Deselects date(s) (based on the selection type).
     */
    deselectDate(value?: Date | Date[]): void;
    /**
     * @hidden
     */
    selectDateFromClient(value: Date): void;
    /**
     * @hidden
     */
    protected initFormatters(): void;
    /**
     * @hidden
     */
    protected getDateOnly(date: Date): Date;
    /**
     * @hidden
     */
    private getDateOnlyInMs;
    /**
     * @hidden
     */
    private generateDateRange;
    /**
     * Performs a single selection.
     *
     * @hidden
     */
    private selectSingle;
    /**
     * Performs a multiple selection
     *
     * @hidden
     */
    private selectMultiple;
    /**
     * @hidden
     */
    private selectRange;
    /**
     * Performs a single deselection.
     *
     * @hidden
     */
    private deselectSingle;
    /**
     * Performs a multiple deselection.
     *
     * @hidden
     */
    private deselectMultiple;
    /**
     * Performs a range deselection.
     *
     * @hidden
     */
    private deselectRange;
    private validateDate;
    static ??fac: i0.????FactoryDeclaration<IgxCalendarBaseDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxCalendarBaseDirective, "[igxCalendarBase]", never, { "hideOutsideDays": "hideOutsideDays"; "resourceStrings": "resourceStrings"; "weekStart": "weekStart"; "locale": "locale"; "formatOptions": "formatOptions"; "formatViews": "formatViews"; "selection": "selection"; "value": "value"; "viewDate": "viewDate"; "disabledDates": "disabledDates"; "specialDates": "specialDates"; }, { "selected": "selected"; "viewDateChanged": "viewDateChanged"; "activeViewChanged": "activeViewChanged"; }, never>;
}
