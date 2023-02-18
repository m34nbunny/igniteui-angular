import { Component, Output, EventEmitter, Input, HostListener, ViewChildren, HostBinding } from '@angular/core';
import { isDateInRanges } from '../../calendar/calendar';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IgxDayItemComponent } from './day-item.component';
import { DateRangeType } from '../../core/dates';
import { IgxCalendarBaseDirective, CalendarSelection } from '../calendar-base';
import { isEqual } from '../../core/utils';
import { IgxDaysViewNavigationService } from '../days-view/daysview-navigation.service';
import * as i0 from "@angular/core";
import * as i1 from "../days-view/daysview-navigation.service";
import * as i2 from "../../core/utils";
import * as i3 from "./day-item.component";
import * as i4 from "@angular/common";
let NEXT_ID = 0;
export class IgxDaysViewComponent extends IgxCalendarBaseDirective {
    /**
     * @hidden
     */
    constructor(daysNavService, platform) {
        super(platform);
        this.daysNavService = daysNavService;
        this.platform = platform;
        /**
         * Sets/gets the `id` of the days view.
         * If not set, the `id` will have value `"igx-days-view-0"`.
         * ```html
         * <igx-days-view id="my-days-view"></igx-days-view>
         * ```
         * ```typescript
         * let daysViewId =  this.daysView.id;
         * ```
         */
        this.id = `igx-days-view-${NEXT_ID++}`;
        /**
         * @hidden
         */
        this.changeDaysView = false;
        /**
         * @hidden
         */
        this.dateSelection = new EventEmitter();
        /**
         * @hidden
         */
        this.viewChanging = new EventEmitter();
        /**
         * @hidden
         */
        this.activeDateChange = new EventEmitter();
        /**
         * @hidden
         */
        this.monthsViewBlur = new EventEmitter();
        /**
         * The default css class applied to the component.
         *
         * @hidden
         */
        this.styleClass = true;
        /** @hidden */
        this.shouldResetDate = true;
    }
    /**
     * @hidden
     * @internal
     */
    set activeDate(value) {
        this._activeDate = value;
        this.activeDateChange.emit(this._activeDate);
    }
    get activeDate() {
        return this._activeDate ? this._activeDate : this.viewDate.toLocaleDateString();
    }
    /**
     * @hidden
     * @internal
     */
    resetActiveMonth() {
        if (this.shouldResetDate) {
            const date = this.dates.find(day => day.selected && day.isCurrentMonth) ||
                this.dates.find(day => day.isToday && day.isCurrentMonth) ||
                this.dates.find(d => d.isFocusable);
            if (date) {
                this.activeDate = date.date.date.toLocaleDateString();
            }
            this.monthsViewBlur.emit();
        }
        this.shouldResetDate = true;
    }
    /**
     * @hidden
     * @internal
     */
    pointerDown() {
        this.shouldResetDate = false;
    }
    /**
     * @hidden
     */
    onKeydownArrow(event) {
        event.preventDefault();
        event.stopPropagation();
        this.shouldResetDate = false;
        this.daysNavService.focusNextDate(event.target, event.key);
    }
    /**
     * @hidden
     */
    onKeydownHome(event) {
        event.preventDefault();
        event.stopPropagation();
        this.shouldResetDate = false;
        this.getFirstMonthView().daysNavService.focusHomeDate();
    }
    /**
     * @hidden
     */
    onKeydownEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        this.shouldResetDate = false;
        this.getLastMonthView().daysNavService.focusEndDate();
    }
    /**
     * @hidden
     */
    get getCalendarMonth() {
        return this.calendarModel.monthdatescalendar(this.viewDate.getFullYear(), this.viewDate.getMonth(), true);
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.daysNavService.monthView = this;
    }
    /**
     * @hidden
     */
    ngDoCheck() {
        if (!this.changeDaysView && this.dates) {
            this.disableOutOfRangeDates();
        }
    }
    /**
     * @hidden
     * @internal
     */
    tabIndex(day) {
        return this.activeDate && this.activeDate === day.date.toLocaleDateString() && day.isCurrentMonth ? 0 : -1;
    }
    /**
     * Returns the week number by date
     *
     * @hidden
     */
    getWeekNumber(date) {
        return this.calendarModel.getWeekNumber(date);
    }
    /**
     * Returns the locale representation of the date in the days view.
     *
     * @hidden
     */
    formattedDate(value) {
        if (this.formatViews.day) {
            return this.formatterDay.format(value);
        }
        return `${value.getDate()}`;
    }
    /**
     * @hidden
     */
    generateWeekHeader() {
        const dayNames = [];
        const rv = this.calendarModel.monthdatescalendar(this.viewDate.getFullYear(), this.viewDate.getMonth())[0];
        for (const day of rv) {
            dayNames.push(this.formatterWeekday.format(day.date));
        }
        return dayNames;
    }
    /**
     * @hidden
     */
    rowTracker(index, item) {
        return `${item[index].date.getMonth()}${item[index].date.getDate()}`;
    }
    /**
     * @hidden
     */
    dateTracker(index, item) {
        return `${item.date.getMonth()}--${item.date.getDate()}`;
    }
    /**
     * @hidden
     */
    isCurrentMonth(value) {
        return this.viewDate.getMonth() === value.getMonth();
    }
    /**
     * @hidden
     */
    isCurrentYear(value) {
        return this.viewDate.getFullYear() === value.getFullYear();
    }
    /**
     * @hidden
     */
    isSelected(date) {
        let selectedDates;
        if (this.isDateDisabled(date.date) || !this.value ||
            (Array.isArray(this.value) && this.value.length === 0)) {
            return false;
        }
        if (this.selection === CalendarSelection.SINGLE) {
            selectedDates = this.value;
            return this.getDateOnly(selectedDates).getTime() === date.date.getTime();
        }
        selectedDates = this.value;
        if (this.selection === CalendarSelection.RANGE && selectedDates.length === 1) {
            return this.getDateOnly(selectedDates[0]).getTime() === date.date.getTime();
        }
        if (this.selection === CalendarSelection.MULTI) {
            const start = this.getDateOnly(selectedDates[0]);
            const end = this.getDateOnly(selectedDates[selectedDates.length - 1]);
            if (this.isWithinRange(date.date, false, start, end)) {
                const currentDate = selectedDates.find(element => element.getTime() === date.date.getTime());
                return !!currentDate;
            }
            else {
                return false;
            }
        }
        else {
            return this.isWithinRange(date.date, true);
        }
    }
    /**
     * @hidden
     */
    isLastInRange(date) {
        if (this.isSingleSelection || !this.value) {
            return false;
        }
        const dates = this.value;
        const lastDate = dates[dates.length - 1];
        return isEqual(lastDate, date.date);
    }
    /**
     * @hidden
     */
    isFirstInRange(date) {
        if (this.isSingleSelection || !this.value) {
            return false;
        }
        return isEqual(this.value[0], date.date);
    }
    /**
     * @hidden
     */
    isWithinRange(date, checkForRange, min, max) {
        if (checkForRange && !(Array.isArray(this.value) && this.value.length > 1)) {
            return false;
        }
        min = min ? min : this.value[0];
        max = max ? max : this.value[this.value.length - 1];
        return isDateInRanges(date, [
            {
                type: DateRangeType.Between,
                dateRange: [min, max]
            }
        ]);
    }
    /**
     * @hidden
     */
    focusActiveDate() {
        let date = this.dates.find((d) => d.selected);
        if (!date) {
            date = this.dates.find((d) => d.isToday);
        }
        if (date.isFocusable) {
            date.nativeElement.focus();
        }
    }
    /**
     * @hidden
     */
    selectDay(event) {
        this.selectDateFromClient(event.date);
        this.dateSelection.emit(event);
        this.selected.emit(this.selectedDates);
    }
    /**
     * @hidden
     */
    getFirstMonthView() {
        let monthView = this;
        while (monthView.prevMonthView) {
            monthView = monthView.prevMonthView;
        }
        return monthView;
    }
    /**
     * @hidden
     */
    disableOutOfRangeDates() {
        const dateRange = [];
        this.dates.toArray().forEach((date) => {
            if (!date.isCurrentMonth) {
                dateRange.push(date.date.date);
            }
        });
        this.outOfRangeDates = [{
                type: DateRangeType.Specific,
                dateRange
            }];
    }
    /**
     * @hidden
     */
    getLastMonthView() {
        let monthView = this;
        while (monthView.nextMonthView) {
            monthView = monthView.nextMonthView;
        }
        return monthView;
    }
    /**
     * @hidden
     */
    get isSingleSelection() {
        return this.selection !== CalendarSelection.RANGE;
    }
}
IgxDaysViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDaysViewComponent, deps: [{ token: i1.IgxDaysViewNavigationService }, { token: i2.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxDaysViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxDaysViewComponent, selector: "igx-days-view", inputs: { id: "id", changeDaysView: "changeDaysView", showWeekNumbers: "showWeekNumbers", activeDate: "activeDate" }, outputs: { dateSelection: "dateSelection", viewChanging: "viewChanging", activeDateChange: "activeDateChange", monthsViewBlur: "monthsViewBlur" }, host: { listeners: { "focusout": "resetActiveMonth()", "keydown.pagedown": "pointerDown()", "keydown.pageup": "pointerDown()", "keydown.shift.pagedown": "pointerDown()", "keydown.shift.pageup": "pointerDown()", "pointerdown": "pointerDown()", "keydown.arrowleft": "onKeydownArrow($event)", "keydown.arrowright": "onKeydownArrow($event)", "keydown.arrowup": "onKeydownArrow($event)", "keydown.arrowdown": "onKeydownArrow($event)", "keydown.home": "onKeydownHome($event)", "keydown.end": "onKeydownEnd($event)" }, properties: { "attr.id": "this.id", "class.igx-calendar": "this.styleClass" } }, providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: IgxDaysViewComponent
        },
        { provide: IgxDaysViewNavigationService, useClass: IgxDaysViewNavigationService }
    ], viewQueries: [{ propertyName: "dates", predicate: IgxDayItemComponent, descendants: true, read: IgxDayItemComponent }], usesInheritance: true, ngImport: i0, template: "<div role=\"row\" class=\"igx-calendar__body-row\">\n    <div role=\"columnheader\" *ngIf=\"showWeekNumbers\" class=\"igx-calendar__label igx-calendar__label--week-number\">\n        <span>Wk</span>\n    </div>\n    <span role=\"columnheader\" [attr.aria-label]=\"dayName\" *ngFor=\"let dayName of generateWeekHeader()\" class=\"igx-calendar__label\">\n        {{ dayName | titlecase }}\n    </span>\n</div>\n\n<div *ngFor=\"let week of getCalendarMonth; last as isLast; index as i; trackBy: rowTracker\"\n     class=\"igx-calendar__body-row\" role=\"row\">\n\n    <div *ngIf=\"showWeekNumbers\" class=\"igx-calendar__date igx-calendar__date--week-number\">\n\n        <span role=\"rowheader\" class=\"igx-calendar__date-content igx-calendar__date-content--week-number\">\n            {{getWeekNumber(week[0].date)}}\n        </span>\n\n    </div>\n\n    <!-- <igx-week-number-item *ngIf=\"showWeekNumbers\">{{getWeekNumber(week[0].date)}}</igx-week-number-item> -->\n    <igx-day-item\n        class=\"igx-calendar__date\"\n        *ngFor=\"let day of week; trackBy: dateTracker\"\n        [attr.aria-selected]=\"isSelected(day)\"\n        role=\"gridcell\"\n        [attr.aria-disabled]=\"isDateDisabled(day.date)\"\n        [attr.aria-label]=\"isFirstInRange(day) ? day.date.toDateString() + ', ' + resourceStrings.igx_calendar_range_start : isLastInRange(day) ? day.date.toDateString() + ', ' +  resourceStrings.igx_calendar_range_end  : day.date.toDateString()\"\n        [date]=\"day\"\n        [selection]=\"selection\"\n        [selected]=\"isSelected(day)\"\n        [isLastInRange]=\"isLastInRange(day)\"\n        [isFirstInRange]=\"isFirstInRange(day)\"\n        [isWithinRange]=\"isWithinRange(day.date, true)\"\n        [disabledDates]=\"disabledDates\"\n        [specialDates]=\"specialDates\"\n        [outOfRangeDates]=\"outOfRangeDates\"\n        [hideOutsideDays]=\"hideOutsideDays\"\n        [attr.tabindex]=\"tabIndex(day)\"\n        (focus)=\"activeDate = day.date.toLocaleDateString()\"\n        (dateSelection)=\"selectDay($event)\">\n        {{ formattedDate(day.date) }}\n    </igx-day-item>\n</div>\n\n", components: [{ type: i3.IgxDayItemComponent, selector: "igx-day-item", inputs: ["date", "selection", "selected", "disabledDates", "outOfRangeDates", "specialDates", "hideOutsideDays", "isLastInRange", "isFirstInRange", "isWithinRange"], outputs: ["dateSelection"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], pipes: { "titlecase": i4.TitleCasePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDaysViewComponent, decorators: [{
            type: Component,
            args: [{ providers: [
                        {
                            multi: true,
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: IgxDaysViewComponent
                        },
                        { provide: IgxDaysViewNavigationService, useClass: IgxDaysViewNavigationService }
                    ], selector: 'igx-days-view', template: "<div role=\"row\" class=\"igx-calendar__body-row\">\n    <div role=\"columnheader\" *ngIf=\"showWeekNumbers\" class=\"igx-calendar__label igx-calendar__label--week-number\">\n        <span>Wk</span>\n    </div>\n    <span role=\"columnheader\" [attr.aria-label]=\"dayName\" *ngFor=\"let dayName of generateWeekHeader()\" class=\"igx-calendar__label\">\n        {{ dayName | titlecase }}\n    </span>\n</div>\n\n<div *ngFor=\"let week of getCalendarMonth; last as isLast; index as i; trackBy: rowTracker\"\n     class=\"igx-calendar__body-row\" role=\"row\">\n\n    <div *ngIf=\"showWeekNumbers\" class=\"igx-calendar__date igx-calendar__date--week-number\">\n\n        <span role=\"rowheader\" class=\"igx-calendar__date-content igx-calendar__date-content--week-number\">\n            {{getWeekNumber(week[0].date)}}\n        </span>\n\n    </div>\n\n    <!-- <igx-week-number-item *ngIf=\"showWeekNumbers\">{{getWeekNumber(week[0].date)}}</igx-week-number-item> -->\n    <igx-day-item\n        class=\"igx-calendar__date\"\n        *ngFor=\"let day of week; trackBy: dateTracker\"\n        [attr.aria-selected]=\"isSelected(day)\"\n        role=\"gridcell\"\n        [attr.aria-disabled]=\"isDateDisabled(day.date)\"\n        [attr.aria-label]=\"isFirstInRange(day) ? day.date.toDateString() + ', ' + resourceStrings.igx_calendar_range_start : isLastInRange(day) ? day.date.toDateString() + ', ' +  resourceStrings.igx_calendar_range_end  : day.date.toDateString()\"\n        [date]=\"day\"\n        [selection]=\"selection\"\n        [selected]=\"isSelected(day)\"\n        [isLastInRange]=\"isLastInRange(day)\"\n        [isFirstInRange]=\"isFirstInRange(day)\"\n        [isWithinRange]=\"isWithinRange(day.date, true)\"\n        [disabledDates]=\"disabledDates\"\n        [specialDates]=\"specialDates\"\n        [outOfRangeDates]=\"outOfRangeDates\"\n        [hideOutsideDays]=\"hideOutsideDays\"\n        [attr.tabindex]=\"tabIndex(day)\"\n        (focus)=\"activeDate = day.date.toLocaleDateString()\"\n        (dateSelection)=\"selectDay($event)\">\n        {{ formattedDate(day.date) }}\n    </igx-day-item>\n</div>\n\n" }]
        }], ctorParameters: function () { return [{ type: i1.IgxDaysViewNavigationService }, { type: i2.PlatformUtil }]; }, propDecorators: { id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], changeDaysView: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], activeDate: [{
                type: Input
            }], dateSelection: [{
                type: Output
            }], viewChanging: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], monthsViewBlur: [{
                type: Output
            }], dates: [{
                type: ViewChildren,
                args: [IgxDayItemComponent, { read: IgxDayItemComponent }]
            }], styleClass: [{
                type: HostBinding,
                args: ['class.igx-calendar']
            }], resetActiveMonth: [{
                type: HostListener,
                args: ['focusout']
            }], pointerDown: [{
                type: HostListener,
                args: ['keydown.pagedown']
            }, {
                type: HostListener,
                args: ['keydown.pageup']
            }, {
                type: HostListener,
                args: ['keydown.shift.pagedown']
            }, {
                type: HostListener,
                args: ['keydown.shift.pageup']
            }, {
                type: HostListener,
                args: ['pointerdown']
            }], onKeydownArrow: [{
                type: HostListener,
                args: ['keydown.arrowleft', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.arrowright', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.arrowup', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.arrowdown', ['$event']]
            }], onKeydownHome: [{
                type: HostListener,
                args: ['keydown.home', ['$event']]
            }], onKeydownEnd: [{
                type: HostListener,
                args: ['keydown.end', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5cy12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jYWxlbmRhci9kYXlzLXZpZXcvZGF5cy12aWV3LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jYWxlbmRhci9kYXlzLXZpZXcvZGF5cy12aWV3LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsWUFBWSxFQUNaLFlBQVksRUFFWixXQUFXLEVBR2QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFpQixjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRCxPQUFPLEVBQXVCLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sa0JBQWtCLENBQUM7QUFFekQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sMENBQTBDLENBQUM7Ozs7OztBQUV4RixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFjaEIsTUFBTSxPQUFPLG9CQUFxQixTQUFRLHdCQUF3QjtJQW9HOUQ7O09BRUc7SUFDSCxZQUNXLGNBQTRDLEVBQ3pDLFFBQXNCO1FBRWhDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUhULG1CQUFjLEdBQWQsY0FBYyxDQUE4QjtRQUN6QyxhQUFRLEdBQVIs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LGdCQUFnQjs7c0JBQzdCLFlBQVk7dUJBQUMsd0JBQXdCOztzQkFDckMsWUFBWTt1QkFBQyxzQkFBc0I7O3NCQUNuQyxZQUFZO3VCQUFDLGFBQWE7Z0JBWXBCLGNBQWM7c0JBSnBCLFlBQVk7dUJBQUMsbUJBQW1CLEVBQUUsQ0FBQyxRQUFRLENBQUM7O3NCQUM1QyxZQUFZO3VCQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDOztzQkFDN0MsWUFBWTt1QkFBQyxpQkFBaUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7c0JBQzFDLFlBQVk7dUJBQUMsbUJBQW1CLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBWXRDLGFBQWE7c0JBRG5CLFlBQVk7dUJBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVlqQyxZQUFZO3NCQURsQixZQUFZO3VCQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIE91dHB1dCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBRdWVyeUxpc3QsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgRG9DaGVjayxcbiAgICBPbkluaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJQ2FsZW5kYXJEYXRlLCBpc0RhdGVJblJhbmdlcyB9IGZyb20gJy4uLy4uL2NhbGVuZGFyL2NhbGVuZGFyJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgSWd4RGF5SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vZGF5LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVSYW5nZURlc2NyaXB0b3IsIERhdGVSYW5nZVR5cGUgfSBmcm9tICcuLi8uLi9jb3JlL2RhdGVzJztcbmltcG9ydCB7IElneENhbGVuZGFyQmFzZURpcmVjdGl2ZSwgQ2FsZW5kYXJTZWxlY3Rpb24gfSBmcm9tICcuLi9jYWxlbmRhci1iYXNlJztcbmltcG9ydCB7IGlzRXF1YWwsIFBsYXRmb3JtVXRpbCB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSVZpZXdDaGFuZ2luZ0V2ZW50QXJncyB9IGZyb20gJy4vZGF5cy12aWV3LmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hEYXlzVmlld05hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZGF5cy12aWV3L2RheXN2aWV3LW5hdmlnYXRpb24uc2VydmljZSc7XG5cbmxldCBORVhUX0lEID0gMDtcblxuQENvbXBvbmVudCh7XG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogSWd4RGF5c1ZpZXdDb21wb25lbnRcbiAgICAgICAgfSxcbiAgICAgICAgeyBwcm92aWRlOiBJZ3hEYXlzVmlld05hdmlnYXRpb25TZXJ2aWNlLCB1c2VDbGFzczogSWd4RGF5c1ZpZXdOYXZpZ2F0aW9uU2VydmljZSB9XG4gICAgXSxcbiAgICBzZWxlY3RvcjogJ2lneC1kYXlzLXZpZXcnLFxuICAgIHRlbXBsYXRlVXJsOiAnZGF5cy12aWV3LmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hEYXlzVmlld0NvbXBvbmVudCBleHRlbmRzIElneENhbGVuZGFyQmFzZURpcmVjdGl2ZSBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uSW5pdCB7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgaWRgIG9mIHRoZSBkYXlzIHZpZXcuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgd2lsbCBoYXZlIHZhbHVlIGBcImlneC1kYXlzLXZpZXctMFwiYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXlzLXZpZXcgaWQ9XCJteS1kYXlzLXZpZXdcIj48L2lneC1kYXlzLXZpZXc+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBkYXlzVmlld0lkID0gIHRoaXMuZGF5c1ZpZXcuaWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtZGF5cy12aWV3LSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2hhbmdlRGF5c1ZpZXcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFNob3cvaGlkZSB3ZWVrIG51bWJlcnNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF5cy12aWV3IFtzaG93V2Vla051bWJlcnNdPVwidHJ1ZVwiPjwvaWd4LWRheXMtdmlldz5cbiAgICAgKiBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgYWN0aXZlRGF0ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQodGhpcy5fYWN0aXZlRGF0ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBhY3RpdmVEYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlRGF0ZSA/IHRoaXMuX2FjdGl2ZURhdGUgOiB0aGlzLnZpZXdEYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZGF0ZVNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8SUNhbGVuZGFyRGF0ZT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgdmlld0NoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJVmlld0NoYW5naW5nRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBhY3RpdmVEYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG1vbnRoc1ZpZXdCbHVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hEYXlJdGVtQ29tcG9uZW50LCB7IHJlYWQ6IElneERheUl0ZW1Db21wb25lbnQgfSlcbiAgICBwdWJsaWMgZGF0ZXM6IFF1ZXJ5TGlzdDxJZ3hEYXlJdGVtQ29tcG9uZW50PjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IGNzcyBjbGFzcyBhcHBsaWVkIHRvIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FsZW5kYXInKVxuICAgIHB1YmxpYyBzdHlsZUNsYXNzID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb3V0T2ZSYW5nZURhdGVzOiBEYXRlUmFuZ2VEZXNjcmlwdG9yW107XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5leHRNb250aFZpZXc6IElneERheXNWaWV3Q29tcG9uZW50O1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgcHJldk1vbnRoVmlldzogSWd4RGF5c1ZpZXdDb21wb25lbnQ7XG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgc2hvdWxkUmVzZXREYXRlID0gdHJ1ZTtcbiAgICBwcml2YXRlIF9hY3RpdmVEYXRlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZGF5c05hdlNlcnZpY2U6IElneERheXNWaWV3TmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBwbGF0Zm9ybTogUGxhdGZvcm1VdGlsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHBsYXRmb3JtKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignZm9jdXNvdXQnKVxuICAgIHB1YmxpYyByZXNldEFjdGl2ZU1vbnRoKCkge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRSZXNldERhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLmRhdGVzLmZpbmQoZGF5ID0+IGRheS5zZWxlY3RlZCAmJiBkYXkuaXNDdXJyZW50TW9udGgpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlcy5maW5kKGRheSA9PiBkYXkuaXNUb2RheSAmJiBkYXkuaXNDdXJyZW50TW9udGgpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlcy5maW5kKGQgPT4gZC5pc0ZvY3VzYWJsZSk7XG4gICAgICAgICAgICBpZiAoZGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGRhdGUuZGF0ZS5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tb250aHNWaWV3Qmx1ci5lbWl0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG91bGRSZXNldERhdGUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnBhZ2Vkb3duJylcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnBhZ2V1cCcpXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5zaGlmdC5wYWdlZG93bicpXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5zaGlmdC5wYWdldXAnKVxuICAgIEBIb3N0TGlzdGVuZXIoJ3BvaW50ZXJkb3duJylcbiAgICBwdWJsaWMgcG9pbnRlckRvd24oKSB7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVzZXREYXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uYXJyb3dsZWZ0JywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLmFycm93cmlnaHQnLCBbJyRldmVudCddKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uYXJyb3d1cCcsIFsnJGV2ZW50J10pXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd2Rvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbktleWRvd25BcnJvdyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5zaG91bGRSZXNldERhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kYXlzTmF2U2VydmljZS5mb2N1c05leHREYXRlKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCwgZXZlbnQua2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5ob21lJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25LZXlkb3duSG9tZShldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5zaG91bGRSZXNldERhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nZXRGaXJzdE1vbnRoVmlldygpLmRheXNOYXZTZXJ2aWNlLmZvY3VzSG9tZURhdGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5lbmQnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbktleWRvd25FbmQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVzZXREYXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ2V0TGFzdE1vbnRoVmlldygpLmRheXNOYXZTZXJ2aWNlLmZvY3VzRW5kRGF0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGdldENhbGVuZGFyTW9udGgoKTogSUNhbGVuZGFyRGF0ZVtdW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxlbmRhck1vZGVsLm1vbnRoZGF0ZXNjYWxlbmRhcih0aGlzLnZpZXdEYXRlLmdldEZ1bGxZZWFyKCksIHRoaXMudmlld0RhdGUuZ2V0TW9udGgoKSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5kYXlzTmF2U2VydmljZS5tb250aFZpZXcgPSB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdEb0NoZWNrKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2hhbmdlRGF5c1ZpZXcgJiYgdGhpcy5kYXRlcykge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlT3V0T2ZSYW5nZURhdGVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHRhYkluZGV4KGRheTogSUNhbGVuZGFyRGF0ZSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZURhdGUgJiYgdGhpcy5hY3RpdmVEYXRlID09PSBkYXkuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSAmJiBkYXkuaXNDdXJyZW50TW9udGggPyAwIDogLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgd2VlayBudW1iZXIgYnkgZGF0ZVxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRXZWVrTnVtYmVyKGRhdGUpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxlbmRhck1vZGVsLmdldFdlZWtOdW1iZXIoZGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbG9jYWxlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRlIGluIHRoZSBkYXlzIHZpZXcuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGZvcm1hdHRlZERhdGUodmFsdWU6IERhdGUpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5mb3JtYXRWaWV3cy5kYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdHRlckRheS5mb3JtYXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHt2YWx1ZS5nZXREYXRlKCl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlV2Vla0hlYWRlcigpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGRheU5hbWVzID0gW107XG4gICAgICAgIGNvbnN0IHJ2ID0gdGhpcy5jYWxlbmRhck1vZGVsLm1vbnRoZGF0ZXNjYWxlbmRhcih0aGlzLnZpZXdEYXRlLmdldEZ1bGxZZWFyKCksIHRoaXMudmlld0RhdGUuZ2V0TW9udGgoKSlbMF07XG4gICAgICAgIGZvciAoY29uc3QgZGF5IG9mIHJ2KSB7XG4gICAgICAgICAgICBkYXlOYW1lcy5wdXNoKHRoaXMuZm9ybWF0dGVyV2Vla2RheS5mb3JtYXQoZGF5LmRhdGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXlOYW1lcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJvd1RyYWNrZXIoaW5kZXgsIGl0ZW0pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7aXRlbVtpbmRleF0uZGF0ZS5nZXRNb250aCgpfSR7aXRlbVtpbmRleF0uZGF0ZS5nZXREYXRlKCl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGRhdGVUcmFja2VyKGluZGV4LCBpdGVtKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke2l0ZW0uZGF0ZS5nZXRNb250aCgpfS0tJHtpdGVtLmRhdGUuZ2V0RGF0ZSgpfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBpc0N1cnJlbnRNb250aCh2YWx1ZTogRGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3RGF0ZS5nZXRNb250aCgpID09PSB2YWx1ZS5nZXRNb250aCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNDdXJyZW50WWVhcih2YWx1ZTogRGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3RGF0ZS5nZXRGdWxsWWVhcigpID09PSB2YWx1ZS5nZXRGdWxsWWVhcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNTZWxlY3RlZChkYXRlOiBJQ2FsZW5kYXJEYXRlKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBzZWxlY3RlZERhdGVzOiBEYXRlIHwgRGF0ZVtdO1xuICAgICAgICBpZiAodGhpcy5pc0RhdGVEaXNhYmxlZChkYXRlLmRhdGUpIHx8ICF0aGlzLnZhbHVlIHx8XG4gICAgICAgICAgICAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IENhbGVuZGFyU2VsZWN0aW9uLlNJTkdMRSkge1xuICAgICAgICAgICAgc2VsZWN0ZWREYXRlcyA9ICh0aGlzLnZhbHVlIGFzIERhdGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZU9ubHkoc2VsZWN0ZWREYXRlcykuZ2V0VGltZSgpID09PSBkYXRlLmRhdGUuZ2V0VGltZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0ZWREYXRlcyA9ICh0aGlzLnZhbHVlIGFzIERhdGVbXSk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gQ2FsZW5kYXJTZWxlY3Rpb24uUkFOR0UgJiYgc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERhdGVPbmx5KHNlbGVjdGVkRGF0ZXNbMF0pLmdldFRpbWUoKSA9PT0gZGF0ZS5kYXRlLmdldFRpbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gQ2FsZW5kYXJTZWxlY3Rpb24uTVVMVEkpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5nZXREYXRlT25seShzZWxlY3RlZERhdGVzWzBdKTtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuZ2V0RGF0ZU9ubHkoc2VsZWN0ZWREYXRlc1tzZWxlY3RlZERhdGVzLmxlbmd0aCAtIDFdKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNXaXRoaW5SYW5nZShkYXRlLmRhdGUsIGZhbHNlLCBzdGFydCwgZW5kKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2VsZWN0ZWREYXRlcy5maW5kKGVsZW1lbnQgPT4gZWxlbWVudC5nZXRUaW1lKCkgPT09IGRhdGUuZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWN1cnJlbnREYXRlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzV2l0aGluUmFuZ2UoZGF0ZS5kYXRlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNMYXN0SW5SYW5nZShkYXRlOiBJQ2FsZW5kYXJEYXRlKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0aW9uIHx8ICF0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRlcyA9IHRoaXMudmFsdWUgYXMgRGF0ZVtdO1xuICAgICAgICBjb25zdCBsYXN0RGF0ZSA9IGRhdGVzW2RhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4gaXNFcXVhbChsYXN0RGF0ZSwgZGF0ZS5kYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGlzRmlyc3RJblJhbmdlKGRhdGU6IElDYWxlbmRhckRhdGUpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTaW5nbGVTZWxlY3Rpb24gfHwgIXRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc0VxdWFsKCh0aGlzLnZhbHVlIGFzIERhdGVbXSlbMF0sIGRhdGUuZGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBpc1dpdGhpblJhbmdlKGRhdGU6IERhdGUsIGNoZWNrRm9yUmFuZ2U6IGJvb2xlYW4sIG1pbj86IERhdGUsIG1heD86IERhdGUpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGNoZWNrRm9yUmFuZ2UgJiYgIShBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpICYmIHRoaXMudmFsdWUubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1pbiA9IG1pbiA/IG1pbiA6IHRoaXMudmFsdWVbMF07XG4gICAgICAgIG1heCA9IG1heCA/IG1heCA6IHRoaXMudmFsdWVbKHRoaXMudmFsdWUgYXMgRGF0ZVtdKS5sZW5ndGggLSAxXTtcblxuICAgICAgICByZXR1cm4gaXNEYXRlSW5SYW5nZXMoZGF0ZSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IERhdGVSYW5nZVR5cGUuQmV0d2VlbixcbiAgICAgICAgICAgICAgICAgICAgZGF0ZVJhbmdlOiBbbWluLCBtYXhdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXNBY3RpdmVEYXRlKCkge1xuICAgICAgICBsZXQgZGF0ZSA9IHRoaXMuZGF0ZXMuZmluZCgoZCkgPT4gZC5zZWxlY3RlZCk7XG5cbiAgICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgICAgICBkYXRlID0gdGhpcy5kYXRlcy5maW5kKChkKSA9PiBkLmlzVG9kYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGUuaXNGb2N1c2FibGUpIHtcbiAgICAgICAgICAgIGRhdGUubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3REYXkoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3REYXRlRnJvbUNsaWVudChldmVudC5kYXRlKTtcbiAgICAgICAgdGhpcy5kYXRlU2VsZWN0aW9uLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZERhdGVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldEZpcnN0TW9udGhWaWV3KCk6IElneERheXNWaWV3Q29tcG9uZW50IHtcbiAgICAgICAgbGV0IG1vbnRoVmlldyA9IHRoaXMgYXMgSWd4RGF5c1ZpZXdDb21wb25lbnQ7XG4gICAgICAgIHdoaWxlIChtb250aFZpZXcucHJldk1vbnRoVmlldykge1xuICAgICAgICAgICAgbW9udGhWaWV3ID0gbW9udGhWaWV3LnByZXZNb250aFZpZXc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vbnRoVmlldztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkaXNhYmxlT3V0T2ZSYW5nZURhdGVzKCkge1xuICAgICAgICBjb25zdCBkYXRlUmFuZ2UgPSBbXTtcbiAgICAgICAgdGhpcy5kYXRlcy50b0FycmF5KCkuZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFkYXRlLmlzQ3VycmVudE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVJhbmdlLnB1c2goZGF0ZS5kYXRlLmRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm91dE9mUmFuZ2VEYXRlcyA9IFt7XG4gICAgICAgICAgICB0eXBlOiBEYXRlUmFuZ2VUeXBlLlNwZWNpZmljLFxuICAgICAgICAgICAgZGF0ZVJhbmdlXG4gICAgICAgIH1dO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldExhc3RNb250aFZpZXcoKTogSWd4RGF5c1ZpZXdDb21wb25lbnQge1xuICAgICAgICBsZXQgbW9udGhWaWV3ID0gdGhpcyBhcyBJZ3hEYXlzVmlld0NvbXBvbmVudDtcbiAgICAgICAgd2hpbGUgKG1vbnRoVmlldy5uZXh0TW9udGhWaWV3KSB7XG4gICAgICAgICAgICBtb250aFZpZXcgPSBtb250aFZpZXcubmV4dE1vbnRoVmlldztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9udGhWaWV3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCBpc1NpbmdsZVNlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uICE9PSBDYWxlbmRhclNlbGVjdGlvbi5SQU5HRTtcbiAgICB9XG59XG4iLCI8ZGl2IHJvbGU9XCJyb3dcIiBjbGFzcz1cImlneC1jYWxlbmRhcl9fYm9keS1yb3dcIj5cbiAgICA8ZGl2IHJvbGU9XCJjb2x1bW5oZWFkZXJcIiAqbmdJZj1cInNob3dXZWVrTnVtYmVyc1wiIGNsYXNzPVwiaWd4LWNhbGVuZGFyX19sYWJlbCBpZ3gtY2FsZW5kYXJfX2xhYmVsLS13ZWVrLW51bWJlclwiPlxuICAgICAgICA8c3Bhbj5Xazwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiByb2xlPVwiY29sdW1uaGVhZGVyXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJkYXlOYW1lXCIgKm5nRm9yPVwibGV0IGRheU5hbWUgb2YgZ2VuZXJhdGVXZWVrSGVhZGVyKClcIiBjbGFzcz1cImlneC1jYWxlbmRhcl9fbGFiZWxcIj5cbiAgICAgICAge3sgZGF5TmFtZSB8IHRpdGxlY2FzZSB9fVxuICAgIDwvc3Bhbj5cbjwvZGl2PlxuXG48ZGl2ICpuZ0Zvcj1cImxldCB3ZWVrIG9mIGdldENhbGVuZGFyTW9udGg7IGxhc3QgYXMgaXNMYXN0OyBpbmRleCBhcyBpOyB0cmFja0J5OiByb3dUcmFja2VyXCJcbiAgICAgY2xhc3M9XCJpZ3gtY2FsZW5kYXJfX2JvZHktcm93XCIgcm9sZT1cInJvd1wiPlxuXG4gICAgPGRpdiAqbmdJZj1cInNob3dXZWVrTnVtYmVyc1wiIGNsYXNzPVwiaWd4LWNhbGVuZGFyX19kYXRlIGlneC1jYWxlbmRhcl9fZGF0ZS0td2Vlay1udW1iZXJcIj5cblxuICAgICAgICA8c3BhbiByb2xlPVwicm93aGVhZGVyXCIgY2xhc3M9XCJpZ3gtY2FsZW5kYXJfX2RhdGUtY29udGVudCBpZ3gtY2FsZW5kYXJfX2RhdGUtY29udGVudC0td2Vlay1udW1iZXJcIj5cbiAgICAgICAgICAgIHt7Z2V0V2Vla051bWJlcih3ZWVrWzBdLmRhdGUpfX1cbiAgICAgICAgPC9zcGFuPlxuXG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIDxpZ3gtd2Vlay1udW1iZXItaXRlbSAqbmdJZj1cInNob3dXZWVrTnVtYmVyc1wiPnt7Z2V0V2Vla051bWJlcih3ZWVrWzBdLmRhdGUpfX08L2lneC13ZWVrLW51bWJlci1pdGVtPiAtLT5cbiAgICA8aWd4LWRheS1pdGVtXG4gICAgICAgIGNsYXNzPVwiaWd4LWNhbGVuZGFyX19kYXRlXCJcbiAgICAgICAgKm5nRm9yPVwibGV0IGRheSBvZiB3ZWVrOyB0cmFja0J5OiBkYXRlVHJhY2tlclwiXG4gICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZChkYXkpXCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJpc0RhdGVEaXNhYmxlZChkYXkuZGF0ZSlcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImlzRmlyc3RJblJhbmdlKGRheSkgPyBkYXkuZGF0ZS50b0RhdGVTdHJpbmcoKSArICcsICcgKyByZXNvdXJjZVN0cmluZ3MuaWd4X2NhbGVuZGFyX3JhbmdlX3N0YXJ0IDogaXNMYXN0SW5SYW5nZShkYXkpID8gZGF5LmRhdGUudG9EYXRlU3RyaW5nKCkgKyAnLCAnICsgIHJlc291cmNlU3RyaW5ncy5pZ3hfY2FsZW5kYXJfcmFuZ2VfZW5kICA6IGRheS5kYXRlLnRvRGF0ZVN0cmluZygpXCJcbiAgICAgICAgW2RhdGVdPVwiZGF5XCJcbiAgICAgICAgW3NlbGVjdGlvbl09XCJzZWxlY3Rpb25cIlxuICAgICAgICBbc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZChkYXkpXCJcbiAgICAgICAgW2lzTGFzdEluUmFuZ2VdPVwiaXNMYXN0SW5SYW5nZShkYXkpXCJcbiAgICAgICAgW2lzRmlyc3RJblJhbmdlXT1cImlzRmlyc3RJblJhbmdlKGRheSlcIlxuICAgICAgICBbaXNXaXRoaW5SYW5nZV09XCJpc1dpdGhpblJhbmdlKGRheS5kYXRlLCB0cnVlKVwiXG4gICAgICAgIFtkaXNhYmxlZERhdGVzXT1cImRpc2FibGVkRGF0ZXNcIlxuICAgICAgICBbc3BlY2lhbERhdGVzXT1cInNwZWNpYWxEYXRlc1wiXG4gICAgICAgIFtvdXRPZlJhbmdlRGF0ZXNdPVwib3V0T2ZSYW5nZURhdGVzXCJcbiAgICAgICAgW2hpZGVPdXRzaWRlRGF5c109XCJoaWRlT3V0c2lkZURheXNcIlxuICAgICAgICBbYXR0ci50YWJpbmRleF09XCJ0YWJJbmRleChkYXkpXCJcbiAgICAgICAgKGZvY3VzKT1cImFjdGl2ZURhdGUgPSBkYXkuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKVwiXG4gICAgICAgIChkYXRlU2VsZWN0aW9uKT1cInNlbGVjdERheSgkZXZlbnQpXCI+XG4gICAgICAgIHt7IGZvcm1hdHRlZERhdGUoZGF5LmRhdGUpIH19XG4gICAgPC9pZ3gtZGF5LWl0ZW0+XG48L2Rpdj5cblxuIl19