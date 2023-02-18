import { Input, Output, EventEmitter, Directive } from '@angular/core';
import { Calendar, isDateInRanges } from './calendar';
import { noop, Subject } from 'rxjs';
import { isDate, mkenum } from '../core/utils';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { DateTimeUtil } from '../date-common/util/date-time.util';
import * as i0 from "@angular/core";
import * as i1 from "../core/utils";
/**
 * Sets the selection type - single, multi or range.
 */
export const CalendarSelection = mkenum({
    SINGLE: 'single',
    MULTI: 'multi',
    RANGE: 'range'
});
export var ScrollMonth;
(function (ScrollMonth) {
    ScrollMonth["PREV"] = "prev";
    ScrollMonth["NEXT"] = "next";
    ScrollMonth["NONE"] = "none";
})(ScrollMonth || (ScrollMonth = {}));
/** @hidden @internal */
export class IgxCalendarBaseDirective {
    /**
     * @hidden
     */
    constructor(platform) {
        this.platform = platform;
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
        this.hideOutsideDays = false;
        /**
         * Emits an event when a date is selected.
         * Provides reference the `selectedDates` property.
         */
        this.selected = new EventEmitter();
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
        this.viewDateChanged = new EventEmitter();
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
        this.activeViewChanged = new EventEmitter();
        /**
         * @hidden
         */
        this.rangeStarted = false;
        /**
         * @hidden
         */
        this.monthScrollDirection = ScrollMonth.NONE;
        /**
         * @hidden
         */
        this.scrollMonth$ = new Subject();
        /**
         * @hidden
         */
        this.stopMonthScroll$ = new Subject();
        /**
         * @hidden
         */
        this.startMonthScroll$ = new Subject();
        /**
         * @hidden
         */
        this._onTouchedCallback = noop;
        /**
         * @hidden
         */
        this._onChangeCallback = noop;
        /**
         * @hidden
         */
        this._locale = 'en';
        /**
         * @hidden
         */
        this._selection = CalendarSelection.SINGLE;
        /** @hidden @internal */
        this._resourceStrings = CurrentResourceStrings.CalendarResStrings;
        /**
         * @hidden
         */
        this._formatOptions = {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric'
        };
        /**
         * @hidden
         */
        this._formatViews = {
            day: false,
            month: true,
            year: false
        };
        this.calendarModel = new Calendar();
        this.viewDate = this.viewDate ? this.viewDate : new Date();
        this.calendarModel.firstWeekDay = this.weekStart;
        this.initFormatters();
    }
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings() {
        if (!this._resourceStrings) {
            this._resourceStrings = CurrentResourceStrings.CalendarResStrings;
        }
        return this._resourceStrings;
    }
    /**
     * Gets the start day of the week.
     * Can return a numeric or an enum representation of the week day.
     * Defaults to `Sunday` / `0`.
     */
    get weekStart() {
        return this.calendarModel.firstWeekDay;
    }
    /**
     * Sets the start day of the week.
     * Can be assigned to a numeric value or to `WEEKDAYS` enum value.
     */
    set weekStart(value) {
        this.calendarModel.firstWeekDay = value;
    }
    /**
     * Gets the `locale` of the calendar.
     * Default value is `"en"`.
     */
    get locale() {
        return this._locale;
    }
    /**
     * Sets the `locale` of the calendar.
     * Expects a valid BCP 47 language tag.
     * Default value is `"en"`.
     */
    set locale(value) {
        this._locale = value;
        this.initFormatters();
    }
    /**
     * Gets the date format options of the days view.
     */
    get formatOptions() {
        return this._formatOptions;
    }
    /**
     * Sets the date format options of the days view.
     * Default is { day: 'numeric', month: 'short', weekday: 'short', year: 'numeric' }
     */
    set formatOptions(formatOptions) {
        this._formatOptions = Object.assign(this._formatOptions, formatOptions);
        this.initFormatters();
    }
    /**
     * Gets whether the `day`, `month` and `year` should be rendered
     * according to the locale and formatOptions, if any.
     */
    get formatViews() {
        return this._formatViews;
    }
    /**
     * Gets whether the `day`, `month` and `year` should be rendered
     * according to the locale and formatOptions, if any.
     */
    set formatViews(formatViews) {
        this._formatViews = Object.assign(this._formatViews, formatViews);
    }
    /**
     *
     * Gets the selection type.
     * Default value is `"single"`.
     * Changing the type of selection resets the currently
     * selected values if any.
     */
    get selection() {
        return this._selection;
    }
    /**
     * Sets the selection.
     */
    set selection(value) {
        switch (value) {
            case CalendarSelection.SINGLE:
                this.selectedDates = null;
                break;
            case CalendarSelection.MULTI:
            case CalendarSelection.RANGE:
                this.selectedDates = [];
                break;
            default:
                throw new Error('Invalid selection value');
        }
        this._onChangeCallback(this.selectedDates);
        this.rangeStarted = false;
        this._selection = value;
    }
    /**
     * Gets the selected date(s).
     *
     * When selection is set to `single`, it returns
     * a single `Date` object.
     * Otherwise it is an array of `Date` objects.
     */
    get value() {
        return this.selectedDates;
    }
    /**
     * Sets the selected date(s).
     *
     * When selection is set to `single`, it accepts
     * a single `Date` object.
     * Otherwise it is an array of `Date` objects.
     */
    set value(value) {
        if (!value || !!value && value.length === 0) {
            this.selectedDatesWithoutFocus = new Date();
            return;
        }
        if (!this.selectedDatesWithoutFocus) {
            const valueDate = value[0] ? Math.min.apply(null, value) : value;
            const date = this.getDateOnly(new Date(valueDate)).setDate(1);
            this.viewDate = new Date(date);
        }
        this.selectDate(value);
        this.selectedDatesWithoutFocus = value;
    }
    /**
     * Gets the date that is presented.
     * By default it is the current date.
     */
    get viewDate() {
        return this._viewDate;
    }
    /**
     * Sets the date that will be presented in the default view when the component renders.
     */
    set viewDate(value) {
        if (Array.isArray(value)) {
            return;
        }
        const validDate = this.validateDate(value);
        if (this._viewDate) {
            this.selectedDatesWithoutFocus = validDate;
        }
        const date = this.getDateOnly(validDate).setDate(1);
        this._viewDate = new Date(date);
    }
    /**
     * Gets the disabled dates descriptors.
     */
    get disabledDates() {
        return this._disabledDates;
    }
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
    set disabledDates(value) {
        this._disabledDates = value;
    }
    /**
     * Gets the special dates descriptors.
     */
    get specialDates() {
        return this._specialDates;
    }
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
    set specialDates(value) {
        this._specialDates = value;
    }
    /**
     * Performs deselection of a single value, when selection is multi
     * Usually performed by the selectMultiple method, but leads to bug when multiple months are in view
     *
     * @hidden
     */
    deselectMultipleInMonth(value) {
        const valueDateOnly = this.getDateOnly(value);
        this.selectedDates = this.selectedDates.filter((date) => date.getTime() !== valueDateOnly.getTime());
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
    writeValue(value) {
        this.selectDate(value);
    }
    /**
     * Checks whether a date is disabled.
     *
     * @hidden
     */
    isDateDisabled(date) {
        if (this.disabledDates === null) {
            return false;
        }
        return isDateInRanges(date, this.disabledDates);
    }
    /**
     * Selects date(s) (based on the selection type).
     */
    selectDate(value) {
        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
            return;
        }
        switch (this.selection) {
            case CalendarSelection.SINGLE:
                if (isDate(value) && !this.isDateDisabled(value)) {
                    this.selectSingle(value);
                }
                break;
            case CalendarSelection.MULTI:
                this.selectMultiple(value);
                break;
            case CalendarSelection.RANGE:
                this.selectRange(value, true);
                break;
        }
    }
    /**
     * Deselects date(s) (based on the selection type).
     */
    deselectDate(value) {
        if (!this.selectedDates || this.selectedDates.length === 0) {
            return;
        }
        if (value === null || value === undefined) {
            this.selectedDates = this.selection === CalendarSelection.SINGLE ? null : [];
            this.rangeStarted = false;
            this._onChangeCallback(this.selectedDates);
            return;
        }
        switch (this.selection) {
            case CalendarSelection.SINGLE:
                this.deselectSingle(value);
                break;
            case CalendarSelection.MULTI:
                this.deselectMultiple(value);
                break;
            case CalendarSelection.RANGE:
                this.deselectRange(value);
                break;
        }
    }
    /**
     * @hidden
     */
    selectDateFromClient(value) {
        switch (this.selection) {
            case CalendarSelection.SINGLE:
            case CalendarSelection.MULTI:
                this.selectDate(value);
                break;
            case CalendarSelection.RANGE:
                this.selectRange(value, true);
                break;
        }
    }
    /**
     * @hidden
     */
    initFormatters() {
        this.formatterDay = new Intl.DateTimeFormat(this._locale, { day: this._formatOptions.day });
        this.formatterWeekday = new Intl.DateTimeFormat(this._locale, { weekday: this._formatOptions.weekday });
        this.formatterMonth = new Intl.DateTimeFormat(this._locale, { month: this._formatOptions.month });
        this.formatterYear = new Intl.DateTimeFormat(this._locale, { year: this._formatOptions.year });
        this.formatterMonthday = new Intl.DateTimeFormat(this._locale, { month: this._formatOptions.month, day: this._formatOptions.day });
    }
    /**
     * @hidden
     */
    getDateOnly(date) {
        const validDate = this.validateDate(date);
        return new Date(validDate.getFullYear(), validDate.getMonth(), validDate.getDate());
    }
    /**
     * @hidden
     */
    getDateOnlyInMs(date) {
        return this.getDateOnly(date).getTime();
    }
    /**
     * @hidden
     */
    generateDateRange(start, end) {
        const result = [];
        start = this.getDateOnly(start);
        end = this.getDateOnly(end);
        while (start.getTime() < end.getTime()) {
            start = this.calendarModel.timedelta(start, 'day', 1);
            result.push(start);
        }
        return result;
    }
    /**
     * Performs a single selection.
     *
     * @hidden
     */
    selectSingle(value) {
        this.selectedDates = this.getDateOnly(value);
        this._onChangeCallback(this.selectedDates);
    }
    /**
     * Performs a multiple selection
     *
     * @hidden
     */
    selectMultiple(value) {
        if (Array.isArray(value)) {
            const newDates = value.map(v => this.getDateOnly(v).getTime());
            const selDates = this.selectedDates.map(v => this.getDateOnly(v).getTime());
            if (JSON.stringify(newDates) === JSON.stringify(selDates)) {
                return;
            }
            this.selectedDates = Array.from(new Set([...newDates, ...selDates])).map(v => new Date(v));
        }
        else {
            const valueDateOnly = this.getDateOnly(value);
            const newSelection = [];
            if (this.selectedDates.every((date) => date.getTime() !== valueDateOnly.getTime())) {
                newSelection.push(valueDateOnly);
            }
            else {
                this.selectedDates = this.selectedDates.filter((date) => date.getTime() !== valueDateOnly.getTime());
            }
            if (newSelection.length > 0) {
                this.selectedDates = this.selectedDates.concat(newSelection);
            }
        }
        this.selectedDates = this.selectedDates.filter(d => !this.isDateDisabled(d));
        this.selectedDates.sort((a, b) => a.valueOf() - b.valueOf());
        this._onChangeCallback(this.selectedDates);
    }
    /**
     * @hidden
     */
    selectRange(value, excludeDisabledDates = false) {
        let start;
        let end;
        if (Array.isArray(value)) {
            // this.rangeStarted = false;
            value.sort((a, b) => a.valueOf() - b.valueOf());
            start = this.getDateOnly(value[0]);
            end = this.getDateOnly(value[value.length - 1]);
            this.selectedDates = [start, ...this.generateDateRange(start, end)];
        }
        else {
            if (!this.rangeStarted) {
                this.rangeStarted = true;
                this.selectedDates = [value];
            }
            else {
                this.rangeStarted = false;
                if (this.selectedDates[0].getTime() === value.getTime()) {
                    this.selectedDates = [];
                    this._onChangeCallback(this.selectedDates);
                    return;
                }
                this.selectedDates.push(value);
                this.selectedDates.sort((a, b) => a.valueOf() - b.valueOf());
                start = this.selectedDates.shift();
                end = this.selectedDates.pop();
                this.selectedDates = [start, ...this.generateDateRange(start, end)];
            }
        }
        if (excludeDisabledDates) {
            this.selectedDates = this.selectedDates.filter(d => !this.isDateDisabled(d));
        }
        this._onChangeCallback(this.selectedDates);
    }
    /**
     * Performs a single deselection.
     *
     * @hidden
     */
    deselectSingle(value) {
        if (this.selectedDates !== null &&
            this.getDateOnlyInMs(value) === this.getDateOnlyInMs(this.selectedDates)) {
            this.selectedDates = null;
            this._onChangeCallback(this.selectedDates);
        }
    }
    /**
     * Performs a multiple deselection.
     *
     * @hidden
     */
    deselectMultiple(value) {
        value = value.filter(v => v !== null);
        const selectedDatesCount = this.selectedDates.length;
        const datesInMsToDeselect = new Set(value.map(v => this.getDateOnlyInMs(v)));
        for (let i = this.selectedDates.length - 1; i >= 0; i--) {
            if (datesInMsToDeselect.has(this.getDateOnlyInMs(this.selectedDates[i]))) {
                this.selectedDates.splice(i, 1);
            }
        }
        if (this.selectedDates.length !== selectedDatesCount) {
            this._onChangeCallback(this.selectedDates);
        }
    }
    /**
     * Performs a range deselection.
     *
     * @hidden
     */
    deselectRange(value) {
        value = value.filter(v => v !== null);
        if (value.length < 1) {
            return;
        }
        value.sort((a, b) => a.valueOf() - b.valueOf());
        const valueStart = this.getDateOnlyInMs(value[0]);
        const valueEnd = this.getDateOnlyInMs(value[value.length - 1]);
        this.selectedDates.sort((a, b) => a.valueOf() - b.valueOf());
        const selectedDatesStart = this.getDateOnlyInMs(this.selectedDates[0]);
        const selectedDatesEnd = this.getDateOnlyInMs(this.selectedDates[this.selectedDates.length - 1]);
        if (!(valueEnd < selectedDatesStart) && !(valueStart > selectedDatesEnd)) {
            this.selectedDates = [];
            this.rangeStarted = false;
            this._onChangeCallback(this.selectedDates);
        }
    }
    validateDate(value) {
        return DateTimeUtil.isValidDate(value) ? value : new Date();
    }
}
IgxCalendarBaseDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarBaseDirective, deps: [{ token: i1.PlatformUtil }], target: i0.ɵɵFactoryTarget.Directive });
IgxCalendarBaseDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCalendarBaseDirective, selector: "[igxCalendarBase]", inputs: { hideOutsideDays: "hideOutsideDays", resourceStrings: "resourceStrings", weekStart: "weekStart", locale: "locale", formatOptions: "formatOptions", formatViews: "formatViews", selection: "selection", value: "value", viewDate: "viewDate", disabledDates: "disabledDates", specialDates: "specialDates" }, outputs: { selected: "selected", viewDateChanged: "viewDateChanged", activeViewChanged: "activeViewChanged" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarBaseDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxCalendarBase]',
                }]
        }], ctorParameters: function () { return [{ type: i1.PlatformUtil }]; }, propDecorators: { hideOutsideDays: [{
                type: Input
            }], selected: [{
                type: Output
            }], viewDateChanged: [{
                type: Output
            }], activeViewChanged: [{
                type: Output
            }], resourceStrings: [{
                type: Input
            }], weekStart: [{
                type: Input
            }], locale: [{
                type: Input
            }], formatOptions: [{
                type: Input
            }], formatViews: [{
                type: Input
            }], selection: [{
                type: Input
            }], value: [{
                type: Input
            }], viewDate: [{
                type: Input
            }], disabledDates: [{
                type: Input
            }], specialDates: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jYWxlbmRhci9jYWxlbmRhci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFZLFFBQVEsRUFBRSxjQUFjLEVBQXdDLE1BQU0sWUFBWSxDQUFDO0FBR3RHLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUU3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVoRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7OztBQUdsRTs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQztJQUNwQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxPQUFPO0NBQ2pCLENBQUMsQ0FBQztBQUdILE1BQU0sQ0FBTixJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDbkIsNEJBQWEsQ0FBQTtJQUNiLDRCQUFhLENBQUE7SUFDYiw0QkFBYSxDQUFBO0FBQ2pCLENBQUMsRUFKVyxXQUFXLEtBQVgsV0FBVyxRQUl0QjtBQU9ELHdCQUF3QjtBQUl4QixNQUFNLE9BQU8sd0JBQXdCO0lBOFlqQzs7T0FFRztJQUNILFlBQXNCLFFBQXNCO1FBQXRCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFoWjVDOzs7Ozs7Ozs7V0FTRztRQUdJLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBRS9COzs7V0FHRztRQUVJLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUVwRDs7Ozs7Ozs7OztXQVVHO1FBRUksb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBNEIsQ0FBQztRQUV0RTs7Ozs7Ozs7OztXQVVHO1FBRUksc0JBQWlCLEdBQUksSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFaEU7O1dBRUc7UUFDSSxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUU1Qjs7V0FFRztRQUNJLHlCQUFvQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFFL0M7O1dBRUc7UUFDSSxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFFcEM7O1dBRUc7UUFDSSxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBRWpEOztXQUVHO1FBQ0ksc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQXFDekM7O1dBRUc7UUFDTyx1QkFBa0IsR0FBZSxJQUFJLENBQUM7UUFDaEQ7O1dBRUc7UUFDTyxzQkFBaUIsR0FBc0IsSUFBSSxDQUFDO1FBT3REOztXQUVHO1FBQ0ssWUFBTyxHQUFHLElBQUksQ0FBQztRQWlCdkI7O1dBRUc7UUFDSyxlQUFVLEdBQStCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztRQUMxRSx3QkFBd0I7UUFDaEIscUJBQWdCLEdBQUcsc0JBQXNCLENBQUMsa0JBQWtCLENBQUM7UUFFckU7O1dBRUc7UUFDSyxtQkFBYyxHQUF1QjtZQUN6QyxHQUFHLEVBQUUsU0FBUztZQUNkLEtBQUssRUFBRSxPQUFPO1lBQ2QsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLFNBQVM7U0FDbEIsQ0FBQztRQUVGOztXQUVHO1FBQ0ssaUJBQVksR0FBcUI7WUFDckMsR0FBRyxFQUFFLEtBQUs7WUFDVixLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxLQUFLO1NBQ2QsQ0FBQztRQTBPRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFFcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRTNELElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUE5T0Q7OztPQUdHO0lBQ0gsSUFDVyxlQUFlLENBQUMsS0FBK0I7UUFDdEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLGVBQWU7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsc0JBQXNCLENBQUMsa0JBQWtCLENBQUM7U0FDckU7UUFDRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQ1csU0FBUztRQUNoQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFXLFNBQVMsQ0FBQyxLQUF3QjtRQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQ1csTUFBTTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQVcsTUFBTSxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQ1csYUFBYTtRQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsYUFBYSxDQUFDLGFBQWlDO1FBQ3RELElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFDVyxXQUFXO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM3QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxXQUFXLENBQUMsV0FBNkI7UUFDaEQsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILElBQ1csU0FBUztRQUNoQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxTQUFTLENBQUMsS0FBYTtRQUM5QixRQUFRLEtBQUssRUFBRTtZQUNYLEtBQUssaUJBQWlCLENBQUMsTUFBTTtnQkFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBQzFCLE1BQU07WUFDVixLQUFLLGlCQUFpQixDQUFDLEtBQUssQ0FBQztZQUM3QixLQUFLLGlCQUFpQixDQUFDLEtBQUs7Z0JBQ3hCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixNQUFNO1lBQ1Y7Z0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsSUFDVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxJQUFXLEtBQUssQ0FBQyxLQUFvQjtRQUNqQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUssS0FBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JELElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzVDLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUU7WUFDakMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNqRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQ1csUUFBUTtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFFBQVEsQ0FBQyxLQUFXO1FBQzNCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN0QixPQUFPO1NBQ1Y7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMseUJBQXlCLEdBQUcsU0FBUyxDQUFDO1NBQzlDO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILElBQVcsYUFBYSxDQUFDLEtBQTRCO1FBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNILElBQ1csWUFBWTtRQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsSUFBVyxZQUFZLENBQUMsS0FBNEI7UUFDaEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQWNEOzs7OztPQUtHO0lBQ0ksdUJBQXVCLENBQUMsS0FBVztRQUN0QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQzFDLENBQUMsSUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUM3RCxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0ksZ0JBQWdCLENBQUMsRUFBcUI7UUFDekMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQkFBaUIsQ0FBQyxFQUFjO1FBQ25DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksVUFBVSxDQUFDLEtBQW9CO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxjQUFjLENBQUMsSUFBVTtRQUM1QixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxVQUFVLENBQUMsS0FBb0I7UUFDbEMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDdkYsT0FBTztTQUNWO1FBRUQsUUFBUSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3BCLEtBQUssaUJBQWlCLENBQUMsTUFBTTtnQkFDekIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQWEsQ0FBQyxFQUFFO29CQUN0RCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQWEsQ0FBQyxDQUFDO2lCQUNwQztnQkFDRCxNQUFNO1lBQ1YsS0FBSyxpQkFBaUIsQ0FBQyxLQUFLO2dCQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixNQUFNO1lBQ1YsS0FBSyxpQkFBaUIsQ0FBQyxLQUFLO2dCQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUIsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksWUFBWSxDQUFDLEtBQXFCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN4RCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM3RSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLE9BQU87U0FDVjtRQUVELFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNwQixLQUFLLGlCQUFpQixDQUFDLE1BQU07Z0JBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBYSxDQUFDLENBQUM7Z0JBQ25DLE1BQU07WUFDVixLQUFLLGlCQUFpQixDQUFDLEtBQUs7Z0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFlLENBQUMsQ0FBQztnQkFDdkMsTUFBTTtZQUNWLEtBQUssaUJBQWlCLENBQUMsS0FBSztnQkFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFlLENBQUMsQ0FBQztnQkFDcEMsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksb0JBQW9CLENBQUMsS0FBVztRQUNuQyxRQUFRLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDcEIsS0FBSyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7WUFDOUIsS0FBSyxpQkFBaUIsQ0FBQyxLQUFLO2dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QixNQUFNO1lBQ1YsS0FBSyxpQkFBaUIsQ0FBQyxLQUFLO2dCQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUIsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ08sY0FBYztRQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3hHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZJLENBQUM7SUFFRDs7T0FFRztJQUNPLFdBQVcsQ0FBQyxJQUFVO1FBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRDs7T0FFRztJQUNLLGVBQWUsQ0FBQyxJQUFVO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7O09BRUc7SUFDSyxpQkFBaUIsQ0FBQyxLQUFXLEVBQUUsR0FBUztRQUM1QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3BDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLFlBQVksQ0FBQyxLQUFXO1FBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssY0FBYyxDQUFDLEtBQW9CO1FBQ3ZDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN0QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRTVFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUN2RCxPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlGO2FBQU07WUFDSCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN4QixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUU7Z0JBQ3RGLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDcEM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FDMUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQzdELENBQUM7YUFDTDtZQUVELElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDaEU7U0FDSjtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU8sRUFBRSxDQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNLLFdBQVcsQ0FBQyxLQUFvQixFQUFFLHVCQUFnQyxLQUFLO1FBQzNFLElBQUksS0FBVyxDQUFDO1FBQ2hCLElBQUksR0FBUyxDQUFDO1FBRWQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3RCLDZCQUE2QjtZQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTyxFQUFFLENBQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzVELEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN2RTthQUFNO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBRTFCLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQ3JELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO29CQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUMzQyxPQUFPO2lCQUNWO2dCQUVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU8sRUFBRSxDQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFFekUsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25DLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0o7UUFFRCxJQUFJLG9CQUFvQixFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoRjtRQUVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxjQUFjLENBQUMsS0FBVztRQUM5QixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSTtZQUMzQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQWEsQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2xGLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGdCQUFnQixDQUFDLEtBQWE7UUFDbEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDdEMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNyRCxNQUFNLG1CQUFtQixHQUFnQixJQUFJLEdBQUcsQ0FDNUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdDLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckQsSUFBSSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDdEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ25DO1NBQ0o7UUFFRCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLGtCQUFrQixFQUFFO1lBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGFBQWEsQ0FBQyxLQUFhO1FBQy9CLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbEIsT0FBTztTQUNWO1FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU8sRUFBRSxDQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU8sRUFBRSxDQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN6RSxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakcsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3RFLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDO0lBRU8sWUFBWSxDQUFDLEtBQVc7UUFDNUIsT0FBTyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDaEUsQ0FBQzs7cUhBMXNCUSx3QkFBd0I7eUdBQXhCLHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQUhwQyxTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxtQkFBbUI7aUJBQ2hDO21HQWNVLGVBQWU7c0JBRHJCLEtBQUs7Z0JBUUMsUUFBUTtzQkFEZCxNQUFNO2dCQWVBLGVBQWU7c0JBRHJCLE1BQU07Z0JBZUEsaUJBQWlCO3NCQUR2QixNQUFNO2dCQWdJSSxlQUFlO3NCQUR6QixLQUFLO2dCQXFCSyxTQUFTO3NCQURuQixLQUFLO2dCQWtCSyxNQUFNO3NCQURoQixLQUFLO2dCQW1CSyxhQUFhO3NCQUR2QixLQUFLO2dCQW1CSyxXQUFXO3NCQURyQixLQUFLO2dCQXFCSyxTQUFTO3NCQURuQixLQUFLO2dCQWlDSyxLQUFLO3NCQURmLEtBQUs7Z0JBK0JLLFFBQVE7c0JBRGxCLEtBQUs7Z0JBeUJLLGFBQWE7c0JBRHZCLEtBQUs7Z0JBeUJLLFlBQVk7c0JBRHRCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgV0VFS0RBWVMsIENhbGVuZGFyLCBpc0RhdGVJblJhbmdlcywgSUZvcm1hdHRpbmdPcHRpb25zLCBJRm9ybWF0dGluZ1ZpZXdzIH0gZnJvbSAnLi9jYWxlbmRhcic7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERhdGVSYW5nZURlc2NyaXB0b3IgfSBmcm9tICcuLi9jb3JlL2RhdGVzJztcbmltcG9ydCB7IG5vb3AsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGlzRGF0ZSwgbWtlbnVtLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneENhbGVuZGFyVmlldyB9IGZyb20gJy4vbW9udGgtcGlja2VyLWJhc2UnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgSUNhbGVuZGFyUmVzb3VyY2VTdHJpbmdzIH0gZnJvbSAnLi4vY29yZS9pMThuL2NhbGVuZGFyLXJlc291cmNlcyc7XG5pbXBvcnQgeyBEYXRlVGltZVV0aWwgfSBmcm9tICcuLi9kYXRlLWNvbW1vbi91dGlsL2RhdGUtdGltZS51dGlsJztcblxuXG4vKipcbiAqIFNldHMgdGhlIHNlbGVjdGlvbiB0eXBlIC0gc2luZ2xlLCBtdWx0aSBvciByYW5nZS5cbiAqL1xuZXhwb3J0IGNvbnN0IENhbGVuZGFyU2VsZWN0aW9uID0gbWtlbnVtKHtcbiAgICBTSU5HTEU6ICdzaW5nbGUnLFxuICAgIE1VTFRJOiAnbXVsdGknLFxuICAgIFJBTkdFOiAncmFuZ2UnXG59KTtcbmV4cG9ydCB0eXBlIENhbGVuZGFyU2VsZWN0aW9uID0gKHR5cGVvZiBDYWxlbmRhclNlbGVjdGlvbilba2V5b2YgdHlwZW9mIENhbGVuZGFyU2VsZWN0aW9uXTtcblxuZXhwb3J0IGVudW0gU2Nyb2xsTW9udGgge1xuICAgIFBSRVYgPSAncHJldicsXG4gICAgTkVYVCA9ICduZXh0JyxcbiAgICBOT05FID0gJ25vbmUnXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZpZXdEYXRlQ2hhbmdlRXZlbnRBcmdzIHtcbiAgICBwcmV2aW91c1ZhbHVlOiBEYXRlO1xuICAgIGN1cnJlbnRWYWx1ZTogRGF0ZTtcbn1cblxuLyoqIEBoaWRkZW4gQGludGVybmFsICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tpZ3hDYWxlbmRhckJhc2VdJyxcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FsZW5kYXJCYXNlRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBvdXRzaWRlIGRhdGVzIChkYXRlcyB0aGF0IGFyZSBvdXQgb2YgdGhlIGN1cnJlbnQgbW9udGgpIHdpbGwgYmUgaGlkZGVuLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYWxlbmRhciBbaGlkZU91dHNpZGVEYXlzXSA9IFwidHJ1ZVwiPjwvaWd4LWNhbGVuZGFyPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaGlkZU91dHNpZGVEYXlzID0gdGhpcy5jYWxlbmRhci5oaWRlT3V0c2lkZURheXM7XG4gICAgICogYGBgXG4gICAgICovXG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoaWRlT3V0c2lkZURheXMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gYSBkYXRlIGlzIHNlbGVjdGVkLlxuICAgICAqIFByb3ZpZGVzIHJlZmVyZW5jZSB0aGUgYHNlbGVjdGVkRGF0ZXNgIHByb3BlcnR5LlxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBzZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RGF0ZSB8IERhdGVbXT4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIG1vbnRoIGluIHZpZXcgaXMgY2hhbmdlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYWxlbmRhciAodmlld0RhdGVDaGFuZ2VkKT1cInZpZXdEYXRlQ2hhbmdlZCgkZXZlbnQpXCI+PC9pZ3gtY2FsZW5kYXI+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyB2aWV3RGF0ZUNoYW5nZWQoZXZlbnQ6IElWaWV3RGF0ZUNoYW5nZUV2ZW50QXJncykge1xuICAgICAqICBsZXQgdmlld0RhdGUgPSBldmVudC5jdXJyZW50VmFsdWU7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB2aWV3RGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElWaWV3RGF0ZUNoYW5nZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIGFjdGl2ZSB2aWV3IGlzIGNoYW5nZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2FsZW5kYXIgKGFjdGl2ZVZpZXdDaGFuZ2VkKT1cImFjdGl2ZVZpZXdDaGFuZ2VkKCRldmVudClcIj48L2lneC1jYWxlbmRhcj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGFjdGl2ZVZpZXdDaGFuZ2VkKGV2ZW50OiBDYWxlbmRhclZpZXcpIHtcbiAgICAgKiAgbGV0IGFjdGl2ZVZpZXcgPSBldmVudDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGFjdGl2ZVZpZXdDaGFuZ2VkICA9IG5ldyBFdmVudEVtaXR0ZXI8SWd4Q2FsZW5kYXJWaWV3PigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyByYW5nZVN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW9udGhTY3JvbGxEaXJlY3Rpb24gPSBTY3JvbGxNb250aC5OT05FO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzY3JvbGxNb250aCQgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzdG9wTW9udGhTY3JvbGwkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhcnRNb250aFNjcm9sbCQgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZERhdGVzO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmb3JtYXR0ZXJXZWVrZGF5O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmb3JtYXR0ZXJEYXk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGZvcm1hdHRlck1vbnRoO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmb3JtYXR0ZXJZZWFyO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmb3JtYXR0ZXJNb250aGRheTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsZW5kYXJNb2RlbDogQ2FsZW5kYXI7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IG5vb3A7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfb25DaGFuZ2VDYWxsYmFjazogKF86IERhdGUpID0+IHZvaWQgPSBub29wO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgc2VsZWN0ZWREYXRlc1dpdGhvdXRGb2N1cztcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9sb2NhbGUgPSAnZW4nO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgX3ZpZXdEYXRlOiBEYXRlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgX2Rpc2FibGVkRGF0ZXM6IERhdGVSYW5nZURlc2NyaXB0b3JbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9zcGVjaWFsRGF0ZXM6IERhdGVSYW5nZURlc2NyaXB0b3JbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9zZWxlY3Rpb246IENhbGVuZGFyU2VsZWN0aW9uIHwgc3RyaW5nID0gQ2FsZW5kYXJTZWxlY3Rpb24uU0lOR0xFO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHByaXZhdGUgX3Jlc291cmNlU3RyaW5ncyA9IEN1cnJlbnRSZXNvdXJjZVN0cmluZ3MuQ2FsZW5kYXJSZXNTdHJpbmdzO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgX2Zvcm1hdE9wdGlvbnM6IElGb3JtYXR0aW5nT3B0aW9ucyA9IHtcbiAgICAgICAgZGF5OiAnbnVtZXJpYycsXG4gICAgICAgIG1vbnRoOiAnc2hvcnQnLFxuICAgICAgICB3ZWVrZGF5OiAnc2hvcnQnLFxuICAgICAgICB5ZWFyOiAnbnVtZXJpYydcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgX2Zvcm1hdFZpZXdzOiBJRm9ybWF0dGluZ1ZpZXdzID0ge1xuICAgICAgICBkYXk6IGZhbHNlLFxuICAgICAgICBtb250aDogdHJ1ZSxcbiAgICAgICAgeWVhcjogZmFsc2VcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQW4gYWNjZXNzb3IgdGhhdCBzZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqIEJ5IGRlZmF1bHQgaXQgdXNlcyBFTiByZXNvdXJjZXMuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHJlc291cmNlU3RyaW5ncyh2YWx1ZTogSUNhbGVuZGFyUmVzb3VyY2VTdHJpbmdzKSB7XG4gICAgICAgIHRoaXMuX3Jlc291cmNlU3RyaW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Jlc291cmNlU3RyaW5ncywgdmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGFjY2Vzc29yIHRoYXQgcmV0dXJucyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlU3RyaW5ncygpOiBJQ2FsZW5kYXJSZXNvdXJjZVN0cmluZ3Mge1xuICAgICAgICBpZiAoIXRoaXMuX3Jlc291cmNlU3RyaW5ncykge1xuICAgICAgICAgICAgdGhpcy5fcmVzb3VyY2VTdHJpbmdzID0gQ3VycmVudFJlc291cmNlU3RyaW5ncy5DYWxlbmRhclJlc1N0cmluZ3M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlU3RyaW5ncztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdGFydCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICogQ2FuIHJldHVybiBhIG51bWVyaWMgb3IgYW4gZW51bSByZXByZXNlbnRhdGlvbiBvZiB0aGUgd2VlayBkYXkuXG4gICAgICogRGVmYXVsdHMgdG8gYFN1bmRheWAgLyBgMGAuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHdlZWtTdGFydCgpOiBXRUVLREFZUyB8IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGVuZGFyTW9kZWwuZmlyc3RXZWVrRGF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHN0YXJ0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgKiBDYW4gYmUgYXNzaWduZWQgdG8gYSBudW1lcmljIHZhbHVlIG9yIHRvIGBXRUVLREFZU2AgZW51bSB2YWx1ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHdlZWtTdGFydCh2YWx1ZTogV0VFS0RBWVMgfCBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jYWxlbmRhck1vZGVsLmZpcnN0V2Vla0RheSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGBsb2NhbGVgIG9mIHRoZSBjYWxlbmRhci5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBcImVuXCJgLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBsb2NhbGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgbG9jYWxlYCBvZiB0aGUgY2FsZW5kYXIuXG4gICAgICogRXhwZWN0cyBhIHZhbGlkIEJDUCA0NyBsYW5ndWFnZSB0YWcuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgXCJlblwiYC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGxvY2FsZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmluaXRGb3JtYXR0ZXJzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZGF0ZSBmb3JtYXQgb3B0aW9ucyBvZiB0aGUgZGF5cyB2aWV3LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBmb3JtYXRPcHRpb25zKCk6IElGb3JtYXR0aW5nT3B0aW9ucyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXRPcHRpb25zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGRhdGUgZm9ybWF0IG9wdGlvbnMgb2YgdGhlIGRheXMgdmlldy5cbiAgICAgKiBEZWZhdWx0IGlzIHsgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCB3ZWVrZGF5OiAnc2hvcnQnLCB5ZWFyOiAnbnVtZXJpYycgfVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgZm9ybWF0T3B0aW9ucyhmb3JtYXRPcHRpb25zOiBJRm9ybWF0dGluZ09wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fZm9ybWF0T3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odGhpcy5fZm9ybWF0T3B0aW9ucywgZm9ybWF0T3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaW5pdEZvcm1hdHRlcnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIGBkYXlgLCBgbW9udGhgIGFuZCBgeWVhcmAgc2hvdWxkIGJlIHJlbmRlcmVkXG4gICAgICogYWNjb3JkaW5nIHRvIHRoZSBsb2NhbGUgYW5kIGZvcm1hdE9wdGlvbnMsIGlmIGFueS5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZm9ybWF0Vmlld3MoKTogSUZvcm1hdHRpbmdWaWV3cyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXRWaWV3cztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIGBkYXlgLCBgbW9udGhgIGFuZCBgeWVhcmAgc2hvdWxkIGJlIHJlbmRlcmVkXG4gICAgICogYWNjb3JkaW5nIHRvIHRoZSBsb2NhbGUgYW5kIGZvcm1hdE9wdGlvbnMsIGlmIGFueS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGZvcm1hdFZpZXdzKGZvcm1hdFZpZXdzOiBJRm9ybWF0dGluZ1ZpZXdzKSB7XG4gICAgICAgIHRoaXMuX2Zvcm1hdFZpZXdzID0gT2JqZWN0LmFzc2lnbih0aGlzLl9mb3JtYXRWaWV3cywgZm9ybWF0Vmlld3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0cyB0aGUgc2VsZWN0aW9uIHR5cGUuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgXCJzaW5nbGVcImAuXG4gICAgICogQ2hhbmdpbmcgdGhlIHR5cGUgb2Ygc2VsZWN0aW9uIHJlc2V0cyB0aGUgY3VycmVudGx5XG4gICAgICogc2VsZWN0ZWQgdmFsdWVzIGlmIGFueS5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgc2VsZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc2VsZWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgc2VsZWN0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSBDYWxlbmRhclNlbGVjdGlvbi5TSU5HTEU6XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzID0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ2FsZW5kYXJTZWxlY3Rpb24uTVVMVEk6XG4gICAgICAgICAgICBjYXNlIENhbGVuZGFyU2VsZWN0aW9uLlJBTkdFOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc2VsZWN0aW9uIHZhbHVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkRGF0ZXMpO1xuICAgICAgICB0aGlzLnJhbmdlU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzZWxlY3RlZCBkYXRlKHMpLlxuICAgICAqXG4gICAgICogV2hlbiBzZWxlY3Rpb24gaXMgc2V0IHRvIGBzaW5nbGVgLCBpdCByZXR1cm5zXG4gICAgICogYSBzaW5nbGUgYERhdGVgIG9iamVjdC5cbiAgICAgKiBPdGhlcndpc2UgaXQgaXMgYW4gYXJyYXkgb2YgYERhdGVgIG9iamVjdHMuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IERhdGUgfCBEYXRlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZERhdGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHNlbGVjdGVkIGRhdGUocykuXG4gICAgICpcbiAgICAgKiBXaGVuIHNlbGVjdGlvbiBpcyBzZXQgdG8gYHNpbmdsZWAsIGl0IGFjY2VwdHNcbiAgICAgKiBhIHNpbmdsZSBgRGF0ZWAgb2JqZWN0LlxuICAgICAqIE90aGVyd2lzZSBpdCBpcyBhbiBhcnJheSBvZiBgRGF0ZWAgb2JqZWN0cy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBEYXRlIHwgRGF0ZVtdKSB7XG4gICAgICAgIGlmICghdmFsdWUgfHwgISF2YWx1ZSAmJiAodmFsdWUgYXMgRGF0ZVtdKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlc1dpdGhvdXRGb2N1cyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkRGF0ZXNXaXRob3V0Rm9jdXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlRGF0ZSA9IHZhbHVlWzBdID8gTWF0aC5taW4uYXBwbHkobnVsbCwgdmFsdWUpIDogdmFsdWU7XG4gICAgICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5nZXREYXRlT25seShuZXcgRGF0ZSh2YWx1ZURhdGUpKS5zZXREYXRlKDEpO1xuICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0RGF0ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlc1dpdGhvdXRGb2N1cyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGRhdGUgdGhhdCBpcyBwcmVzZW50ZWQuXG4gICAgICogQnkgZGVmYXVsdCBpdCBpcyB0aGUgY3VycmVudCBkYXRlLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCB2aWV3RGF0ZSgpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdEYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGRhdGUgdGhhdCB3aWxsIGJlIHByZXNlbnRlZCBpbiB0aGUgZGVmYXVsdCB2aWV3IHdoZW4gdGhlIGNvbXBvbmVudCByZW5kZXJzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgdmlld0RhdGUodmFsdWU6IERhdGUpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZERhdGUgPSB0aGlzLnZhbGlkYXRlRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLl92aWV3RGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzV2l0aG91dEZvY3VzID0gdmFsaWREYXRlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldERhdGVPbmx5KHZhbGlkRGF0ZSkuc2V0RGF0ZSgxKTtcbiAgICAgICAgdGhpcy5fdmlld0RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBkaXNhYmxlZCBkYXRlcyBkZXNjcmlwdG9ycy5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWREYXRlcygpOiBEYXRlUmFuZ2VEZXNjcmlwdG9yW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWREYXRlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBkYXRlcycgZGVzY3JpcHRvcnMuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUNhbGVuZGFyXCIpXG4gICAgICogcHVibGljIGNhbGVuZGFyOiBJZ3hDYWxlbmRhckNvbXBvbmVudDtcbiAgICAgKiBuZ09uSW5pdCgpe1xuICAgICAqICAgIHRoaXMuY2FsZW5kYXIuZGlzYWJsZWREYXRlcyA9IFtcbiAgICAgKiAgICAge3R5cGU6IERhdGVSYW5nZVR5cGUuQmV0d2VlbiwgZGF0ZVJhbmdlOiBbbmV3IERhdGUoXCIyMDIwLTEtMVwiKSwgbmV3IERhdGUoXCIyMDIwLTEtMTVcIildfSxcbiAgICAgKiAgICAge3R5cGU6IERhdGVSYW5nZVR5cGUuV2Vla2VuZHN9XTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBkaXNhYmxlZERhdGVzKHZhbHVlOiBEYXRlUmFuZ2VEZXNjcmlwdG9yW10pIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZWREYXRlcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNwZWNpYWwgZGF0ZXMgZGVzY3JpcHRvcnMuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHNwZWNpYWxEYXRlcygpOiBEYXRlUmFuZ2VEZXNjcmlwdG9yW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3BlY2lhbERhdGVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHNwZWNpYWwgZGF0ZXMnIGRlc2NyaXB0b3JzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlDYWxlbmRhclwiKVxuICAgICAqIHB1YmxpYyBjYWxlbmRhcjogSWd4Q2FsZW5kYXJDb21wb25lbnQ7XG4gICAgICogbmdPbkluaXQoKXtcbiAgICAgKiAgICB0aGlzLmNhbGVuZGFyLnNwZWNpYWxEYXRlcyA9IFtcbiAgICAgKiAgICAge3R5cGU6IERhdGVSYW5nZVR5cGUuQmV0d2VlbiwgZGF0ZVJhbmdlOiBbbmV3IERhdGUoXCIyMDIwLTEtMVwiKSwgbmV3IERhdGUoXCIyMDIwLTEtMTVcIildfSxcbiAgICAgKiAgICAge3R5cGU6IERhdGVSYW5nZVR5cGUuV2Vla2VuZHN9XTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBzcGVjaWFsRGF0ZXModmFsdWU6IERhdGVSYW5nZURlc2NyaXB0b3JbXSkge1xuICAgICAgICB0aGlzLl9zcGVjaWFsRGF0ZXMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwpIHtcbiAgICAgICAgdGhpcy5jYWxlbmRhck1vZGVsID0gbmV3IENhbGVuZGFyKCk7XG5cbiAgICAgICAgdGhpcy52aWV3RGF0ZSA9IHRoaXMudmlld0RhdGUgPyB0aGlzLnZpZXdEYXRlIDogbmV3IERhdGUoKTtcblxuICAgICAgICB0aGlzLmNhbGVuZGFyTW9kZWwuZmlyc3RXZWVrRGF5ID0gdGhpcy53ZWVrU3RhcnQ7XG4gICAgICAgIHRoaXMuaW5pdEZvcm1hdHRlcnMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBkZXNlbGVjdGlvbiBvZiBhIHNpbmdsZSB2YWx1ZSwgd2hlbiBzZWxlY3Rpb24gaXMgbXVsdGlcbiAgICAgKiBVc3VhbGx5IHBlcmZvcm1lZCBieSB0aGUgc2VsZWN0TXVsdGlwbGUgbWV0aG9kLCBidXQgbGVhZHMgdG8gYnVnIHdoZW4gbXVsdGlwbGUgbW9udGhzIGFyZSBpbiB2aWV3XG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGRlc2VsZWN0TXVsdGlwbGVJbk1vbnRoKHZhbHVlOiBEYXRlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlRGF0ZU9ubHkgPSB0aGlzLmdldERhdGVPbmx5KHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzID0gdGhpcy5zZWxlY3RlZERhdGVzLmZpbHRlcihcbiAgICAgICAgICAgIChkYXRlOiBEYXRlKSA9PiBkYXRlLmdldFRpbWUoKSAhPT0gdmFsdWVEYXRlT25seS5nZXRUaW1lKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2OiBEYXRlKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBEYXRlIHwgRGF0ZVtdKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0RGF0ZSh2YWx1ZSBhcyBEYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBhIGRhdGUgaXMgZGlzYWJsZWQuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGlzRGF0ZURpc2FibGVkKGRhdGU6IERhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWREYXRlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzRGF0ZUluUmFuZ2VzKGRhdGUsIHRoaXMuZGlzYWJsZWREYXRlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0cyBkYXRlKHMpIChiYXNlZCBvbiB0aGUgc2VsZWN0aW9uIHR5cGUpLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3REYXRlKHZhbHVlOiBEYXRlIHwgRGF0ZVtdKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIENhbGVuZGFyU2VsZWN0aW9uLlNJTkdMRTpcbiAgICAgICAgICAgICAgICBpZiAoaXNEYXRlKHZhbHVlKSAmJiAhdGhpcy5pc0RhdGVEaXNhYmxlZCh2YWx1ZSBhcyBEYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFNpbmdsZSh2YWx1ZSBhcyBEYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENhbGVuZGFyU2VsZWN0aW9uLk1VTFRJOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0TXVsdGlwbGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDYWxlbmRhclNlbGVjdGlvbi5SQU5HRTpcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFJhbmdlKHZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0cyBkYXRlKHMpIChiYXNlZCBvbiB0aGUgc2VsZWN0aW9uIHR5cGUpLlxuICAgICAqL1xuICAgIHB1YmxpYyBkZXNlbGVjdERhdGUodmFsdWU/OiBEYXRlIHwgRGF0ZVtdKSB7XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZERhdGVzIHx8IHRoaXMuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSB0aGlzLnNlbGVjdGlvbiA9PT0gQ2FsZW5kYXJTZWxlY3Rpb24uU0lOR0xFID8gbnVsbCA6IFtdO1xuICAgICAgICAgICAgdGhpcy5yYW5nZVN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZERhdGVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQ2FsZW5kYXJTZWxlY3Rpb24uU0lOR0xFOlxuICAgICAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RTaW5nbGUodmFsdWUgYXMgRGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENhbGVuZGFyU2VsZWN0aW9uLk1VTFRJOlxuICAgICAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RNdWx0aXBsZSh2YWx1ZSBhcyBEYXRlW10pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDYWxlbmRhclNlbGVjdGlvbi5SQU5HRTpcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0UmFuZ2UodmFsdWUgYXMgRGF0ZVtdKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0RGF0ZUZyb21DbGllbnQodmFsdWU6IERhdGUpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBDYWxlbmRhclNlbGVjdGlvbi5TSU5HTEU6XG4gICAgICAgICAgICBjYXNlIENhbGVuZGFyU2VsZWN0aW9uLk1VTFRJOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0RGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIENhbGVuZGFyU2VsZWN0aW9uLlJBTkdFOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UmFuZ2UodmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbml0Rm9ybWF0dGVycygpIHtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXJEYXkgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLl9sb2NhbGUsIHsgZGF5OiB0aGlzLl9mb3JtYXRPcHRpb25zLmRheSB9KTtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXJXZWVrZGF5ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5fbG9jYWxlLCB7IHdlZWtkYXk6IHRoaXMuX2Zvcm1hdE9wdGlvbnMud2Vla2RheSB9KTtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXJNb250aCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMuX2xvY2FsZSwgeyBtb250aDogdGhpcy5fZm9ybWF0T3B0aW9ucy5tb250aCB9KTtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXJZZWFyID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5fbG9jYWxlLCB7IHllYXI6IHRoaXMuX2Zvcm1hdE9wdGlvbnMueWVhciB9KTtcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXJNb250aGRheSA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMuX2xvY2FsZSwgeyBtb250aDogdGhpcy5fZm9ybWF0T3B0aW9ucy5tb250aCwgZGF5OiB0aGlzLl9mb3JtYXRPcHRpb25zLmRheSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldERhdGVPbmx5KGRhdGU6IERhdGUpIHtcbiAgICAgICAgY29uc3QgdmFsaWREYXRlID0gdGhpcy52YWxpZGF0ZURhdGUoZGF0ZSk7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWxpZERhdGUuZ2V0RnVsbFllYXIoKSwgdmFsaWREYXRlLmdldE1vbnRoKCksIHZhbGlkRGF0ZS5nZXREYXRlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldERhdGVPbmx5SW5NcyhkYXRlOiBEYXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGVPbmx5KGRhdGUpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZURhdGVSYW5nZShzdGFydDogRGF0ZSwgZW5kOiBEYXRlKTogRGF0ZVtdIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIHN0YXJ0ID0gdGhpcy5nZXREYXRlT25seShzdGFydCk7XG4gICAgICAgIGVuZCA9IHRoaXMuZ2V0RGF0ZU9ubHkoZW5kKTtcbiAgICAgICAgd2hpbGUgKHN0YXJ0LmdldFRpbWUoKSA8IGVuZC5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5jYWxlbmRhck1vZGVsLnRpbWVkZWx0YShzdGFydCwgJ2RheScsIDEpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goc3RhcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhIHNpbmdsZSBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZWxlY3RTaW5nbGUodmFsdWU6IERhdGUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzID0gdGhpcy5nZXREYXRlT25seSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZERhdGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhIG11bHRpcGxlIHNlbGVjdGlvblxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgc2VsZWN0TXVsdGlwbGUodmFsdWU6IERhdGUgfCBEYXRlW10pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdEYXRlcyA9IHZhbHVlLm1hcCh2ID0+IHRoaXMuZ2V0RGF0ZU9ubHkodikuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbERhdGVzID0gdGhpcy5zZWxlY3RlZERhdGVzLm1hcCh2ID0+IHRoaXMuZ2V0RGF0ZU9ubHkodikuZ2V0VGltZSgpKTtcblxuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KG5ld0RhdGVzKSA9PT0gSlNPTi5zdHJpbmdpZnkoc2VsRGF0ZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSBBcnJheS5mcm9tKG5ldyBTZXQoWy4uLm5ld0RhdGVzLCAuLi5zZWxEYXRlc10pKS5tYXAodiA9PiBuZXcgRGF0ZSh2KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZURhdGVPbmx5ID0gdGhpcy5nZXREYXRlT25seSh2YWx1ZSk7XG4gICAgICAgICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRGF0ZXMuZXZlcnkoKGRhdGU6IERhdGUpID0+IGRhdGUuZ2V0VGltZSgpICE9PSB2YWx1ZURhdGVPbmx5LmdldFRpbWUoKSkpIHtcbiAgICAgICAgICAgICAgICBuZXdTZWxlY3Rpb24ucHVzaCh2YWx1ZURhdGVPbmx5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzID0gdGhpcy5zZWxlY3RlZERhdGVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKGRhdGU6IERhdGUpID0+IGRhdGUuZ2V0VGltZSgpICE9PSB2YWx1ZURhdGVPbmx5LmdldFRpbWUoKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXdTZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlcyA9IHRoaXMuc2VsZWN0ZWREYXRlcy5jb25jYXQobmV3U2VsZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSB0aGlzLnNlbGVjdGVkRGF0ZXMuZmlsdGVyKGQgPT4gIXRoaXMuaXNEYXRlRGlzYWJsZWQoZCkpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMuc29ydCgoYTogRGF0ZSwgYjogRGF0ZSkgPT4gYS52YWx1ZU9mKCkgLSBiLnZhbHVlT2YoKSk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZERhdGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZWxlY3RSYW5nZSh2YWx1ZTogRGF0ZSB8IERhdGVbXSwgZXhjbHVkZURpc2FibGVkRGF0ZXM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBsZXQgc3RhcnQ6IERhdGU7XG4gICAgICAgIGxldCBlbmQ6IERhdGU7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyB0aGlzLnJhbmdlU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFsdWUuc29ydCgoYTogRGF0ZSwgYjogRGF0ZSkgPT4gYS52YWx1ZU9mKCkgLSBiLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMuZ2V0RGF0ZU9ubHkodmFsdWVbMF0pO1xuICAgICAgICAgICAgZW5kID0gdGhpcy5nZXREYXRlT25seSh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSBbc3RhcnQsIC4uLnRoaXMuZ2VuZXJhdGVEYXRlUmFuZ2Uoc3RhcnQsIGVuZCldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJhbmdlU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSBbdmFsdWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWREYXRlc1swXS5nZXRUaW1lKCkgPT09IHZhbHVlLmdldFRpbWUoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkRGF0ZXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlcy5zb3J0KChhOiBEYXRlLCBiOiBEYXRlKSA9PiBhLnZhbHVlT2YoKSAtIGIudmFsdWVPZigpKTtcblxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5zZWxlY3RlZERhdGVzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgZW5kID0gdGhpcy5zZWxlY3RlZERhdGVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlcyA9IFtzdGFydCwgLi4udGhpcy5nZW5lcmF0ZURhdGVSYW5nZShzdGFydCwgZW5kKV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXhjbHVkZURpc2FibGVkRGF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlcyA9IHRoaXMuc2VsZWN0ZWREYXRlcy5maWx0ZXIoZCA9PiAhdGhpcy5pc0RhdGVEaXNhYmxlZChkKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWREYXRlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYSBzaW5nbGUgZGVzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZXNlbGVjdFNpbmdsZSh2YWx1ZTogRGF0ZSkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZERhdGVzICE9PSBudWxsICYmXG4gICAgICAgICAgICB0aGlzLmdldERhdGVPbmx5SW5Ncyh2YWx1ZSBhcyBEYXRlKSA9PT0gdGhpcy5nZXREYXRlT25seUluTXModGhpcy5zZWxlY3RlZERhdGVzKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZERhdGVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgbXVsdGlwbGUgZGVzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkZXNlbGVjdE11bHRpcGxlKHZhbHVlOiBEYXRlW10pIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5maWx0ZXIodiA9PiB2ICE9PSBudWxsKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWREYXRlc0NvdW50ID0gdGhpcy5zZWxlY3RlZERhdGVzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgZGF0ZXNJbk1zVG9EZXNlbGVjdDogU2V0PG51bWJlcj4gPSBuZXcgU2V0PG51bWJlcj4oXG4gICAgICAgICAgICB2YWx1ZS5tYXAodiA9PiB0aGlzLmdldERhdGVPbmx5SW5Ncyh2KSkpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnNlbGVjdGVkRGF0ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChkYXRlc0luTXNUb0Rlc2VsZWN0Lmhhcyh0aGlzLmdldERhdGVPbmx5SW5Ncyh0aGlzLnNlbGVjdGVkRGF0ZXNbaV0pKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWREYXRlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZERhdGVzLmxlbmd0aCAhPT0gc2VsZWN0ZWREYXRlc0NvdW50KSB7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWREYXRlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhIHJhbmdlIGRlc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByaXZhdGUgZGVzZWxlY3RSYW5nZSh2YWx1ZTogRGF0ZVtdKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuZmlsdGVyKHYgPT4gdiAhPT0gbnVsbCk7XG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZS5zb3J0KChhOiBEYXRlLCBiOiBEYXRlKSA9PiBhLnZhbHVlT2YoKSAtIGIudmFsdWVPZigpKTtcbiAgICAgICAgY29uc3QgdmFsdWVTdGFydCA9IHRoaXMuZ2V0RGF0ZU9ubHlJbk1zKHZhbHVlWzBdKTtcbiAgICAgICAgY29uc3QgdmFsdWVFbmQgPSB0aGlzLmdldERhdGVPbmx5SW5Ncyh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZERhdGVzLnNvcnQoKGE6IERhdGUsIGI6IERhdGUpID0+IGEudmFsdWVPZigpIC0gYi52YWx1ZU9mKCkpO1xuICAgICAgICBjb25zdCBzZWxlY3RlZERhdGVzU3RhcnQgPSB0aGlzLmdldERhdGVPbmx5SW5Ncyh0aGlzLnNlbGVjdGVkRGF0ZXNbMF0pO1xuICAgICAgICBjb25zdCBzZWxlY3RlZERhdGVzRW5kID0gdGhpcy5nZXREYXRlT25seUluTXModGhpcy5zZWxlY3RlZERhdGVzW3RoaXMuc2VsZWN0ZWREYXRlcy5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgaWYgKCEodmFsdWVFbmQgPCBzZWxlY3RlZERhdGVzU3RhcnQpICYmICEodmFsdWVTdGFydCA+IHNlbGVjdGVkRGF0ZXNFbmQpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRGF0ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmFuZ2VTdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWREYXRlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbGlkYXRlRGF0ZSh2YWx1ZTogRGF0ZSkge1xuICAgICAgICByZXR1cm4gRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKHZhbHVlKSA/IHZhbHVlIDogbmV3IERhdGUoKTtcbiAgICB9XG59XG4iXX0=