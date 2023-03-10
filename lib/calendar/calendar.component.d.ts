import { ElementRef, AfterViewInit, QueryList, OnDestroy } from '@angular/core';
import { ICalendarDate } from './calendar';
import { IgxMonthPickerBaseDirective } from './month-picker-base';
import { IgxMonthsViewComponent } from './months-view/months-view.component';
import { IgxYearsViewComponent } from './years-view/years-view.component';
import { IgxDaysViewComponent } from './days-view/days-view.component';
import { IViewChangingEventArgs } from './days-view/days-view.interface';
import * as i0 from "@angular/core";
/**
 * Calendar provides a way to display date information.
 *
 * @igxModule IgxCalendarModule
 *
 * @igxTheme igx-calendar-theme, igx-icon-theme
 *
 * @igxKeywords calendar, datepicker, schedule, date
 *
 * @igxGroup Scheduling
 *
 * @remarks
 * The Ignite UI Calendar provides an easy way to display a calendar and allow users to select dates using single, multiple
 * or range selection.
 *
 * @example:
 * ```html
 * <igx-calendar selection="range"></igx-calendar>
 * ```
 */
export declare class IgxCalendarComponent extends IgxMonthPickerBaseDirective implements AfterViewInit, OnDestroy {
    /**
     * Sets/gets the `id` of the calendar.
     *
     * @remarks
     * If not set, the `id` will have value `"igx-calendar-0"`.
     *
     * @example
     * ```html
     * <igx-calendar id="my-first-calendar"></igx-calendar>
     * ```
     * @memberof IgxCalendarComponent
     */
    id: string;
    /**
     * Sets/gets whether the calendar has header.
     * Default value is `true`.
     *
     * @example
     * ```html
     * <igx-calendar [hasHeader]="false"></igx-calendar>
     * ```
     */
    hasHeader: boolean;
    /**
     * Sets/gets whether the calendar header will be in vertical position.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-calendar [vertical] = "true"></igx-calendar>
     * ```
     */
    vertical: boolean;
    /**
     * Sets/gets the number of month views displayed.
     * Default value is `1`.
     *
     * @example
     * ```html
     * <igx-calendar [monthsViewNumber]="2"></igx-calendar>
     * ```
     */
    get monthsViewNumber(): number;
    set monthsViewNumber(val: number);
    /**
     * Show/hide week numbers
     *
     * @example
     * ```html
     * <igx-calendar [showWeekNumbers]="true"></igx-calendar>
     * ``
     */
    showWeekNumbers: boolean;
    /**
     * Apply the different states for the transitions of animateChange
     *
     * @hidden
     * @internal
     */
    animationAction: any;
    /**
     * The default css class applied to the component.
     *
     * @hidden
     * @internal
     */
    get styleVerticalClass(): boolean;
    /**
     * The default css class applied to the component.
     *
     * @hidden
     * @internal
     */
    styleClass: boolean;
    /**
     * ViewChild that represents the months view.
     *
     * @hidden
     * @internal
     */
    monthsView: IgxMonthsViewComponent;
    /**
     * Month button, that displays the months view.
     *
     * @hidden
     * @internal
     */
    monthsBtns: QueryList<ElementRef>;
    /**
     * ViewChild that represents the decade view.
     *
     * @hidden
     * @internal
     */
    dacadeView: IgxYearsViewComponent;
    /**
     * ViewChild that represents the days view.
     *
     * @hidden
     * @internal
     */
    daysView: IgxDaysViewComponent;
    /**
     * ViewChildrenden representing all of the rendered days views.
     *
     * @hidden
     * @internal
     */
    monthViews: QueryList<IgxDaysViewComponent>;
    /**
     * Button for previous month.
     *
     * @hidden
     * @internal
     */
    prevMonthBtn: ElementRef;
    /**
     * Button for next month.
     *
     * @hidden
     * @internal
     */
    nextMonthBtn: ElementRef;
    /**
     * Denote if the year view is active.
     *
     * @hidden
     * @internal
     */
    get isYearView(): boolean;
    /**
     * Gets the header template.
     *
     * @example
     * ```typescript
     * let headerTemplate =  this.calendar.headerTeamplate;
     * ```
     * @memberof IgxCalendarComponent
     */
    get headerTemplate(): any;
    /**
     * Sets the header template.
     *
     * @example
     * ```html
     * <igx-calendar headerTemplateDirective = "igxCalendarHeader"></igx-calendar>
     * ```
     * @memberof IgxCalendarComponent
     */
    set headerTemplate(directive: any);
    /**
     * Gets the subheader template.
     *
     * @example
     * ```typescript
     * let subheaderTemplate = this.calendar.subheaderTemplate;
     * ```
     */
    get subheaderTemplate(): any;
    /**
     * Sets the subheader template.
     *
     * @example
     * ```html
     * <igx-calendar subheaderTemplate = "igxCalendarSubheader"></igx-calendar>
     * ```
     * @memberof IgxCalendarComponent
     */
    set subheaderTemplate(directive: any);
    /**
     * Gets the context for the template marked with the `igxCalendarHeader` directive.
     *
     * @example
     * ```typescript
     * let headerContext =  this.calendar.headerContext;
     * ```
     */
    get headerContext(): {
        $implicit: {
            date: Date;
            full: string;
            index: number;
            monthView: () => void;
            yearView: () => void;
        };
    };
    /**
     * Gets the context for the template marked with either `igxCalendarSubHeaderMonth`
     * or `igxCalendarSubHeaderYear` directive.
     *
     * @example
     * ```typescript
     * let context =  this.calendar.context;
     * ```
     */
    get context(): {
        $implicit: {
            date: Date;
            full: string;
            index: number;
            monthView: () => void;
            yearView: () => void;
        };
    };
    /**
     * Date displayed in header
     *
     * @hidden
     * @internal
     */
    get headerDate(): Date;
    /**
     * @hidden
     * @internal
     */
    private headerTemplateDirective;
    /**
     * @hidden
     * @internal
     */
    private subheaderTemplateDirective;
    /**
     * @hidden
     * @internal
     */
    activeDate: string;
    /**
     * Used to apply the active date when the calendar view is changed
     *
     * @hidden
     * @internal
     */
    nextDate: Date;
    /**
     * Denote if the calendar view was changed with the keyboard
     *
     * @hidden
     * @internal
     */
    isKeydownTrigger: boolean;
    /**
     * @hidden
     * @internal
     */
    callback: (next: any) => void;
    /**
     * @hidden
     * @internal
     */
    private _monthsViewNumber;
    /**
     * @hidden
     * @internal
     */
    private _monthViewsChanges$;
    /**
     * Keyboard navigation of the calendar
     *
     * @hidden
     * @internal
     */
    onKeydownPageDown(event: KeyboardEvent): void;
    /**
     * Keyboard navigation of the calendar
     *
     * @hidden
     * @internal
     */
    onKeydownShiftPageUp(event: KeyboardEvent): void;
    /**
     * Keyboard navigation of the calendar
     *
     * @hidden
     * @internal
     */
    onKeydownHome(event: KeyboardEvent): void;
    /**
     * Keyboard navigation of the calendar
     *
     * @hidden
     * @internal
     */
    onKeydownEnd(event: KeyboardEvent): void;
    /**
     * Stop continuous navigation on mouseup event
     *
     * @hidden
     * @internal
     */
    onMouseUp(event: KeyboardEvent): void;
    ngAfterViewInit(): void;
    /**
     * Returns the locale representation of the month in the month view if enabled,
     * otherwise returns the default `Date.getMonth()` value.
     *
     * @hidden
     * @internal
     */
    formattedMonth(value: Date): string;
    /**
     * Change to previous month
     *
     * @hidden
     * @internal
     */
    previousMonth(isKeydownTrigger?: boolean): void;
    suppressBlur(): void;
    /**
     * Change to next month
     *
     * @hidden
     * @internal
     */
    nextMonth(isKeydownTrigger?: boolean): void;
    /**
     * Continious navigation through the previous months
     *
     * @hidden
     * @internal
     */
    startPrevMonthScroll: (isKeydownTrigger?: boolean) => void;
    /**
     * Continious navigation through the next months
     *
     * @hidden
     * @internal
     */
    startNextMonthScroll: (isKeydownTrigger?: boolean) => void;
    /**
     * Stop continuous navigation
     *
     * @hidden
     * @internal
     */
    stopMonthScroll: (event: KeyboardEvent) => void;
    /**
     * @hidden
     * @internal
     */
    onActiveViewDecade(args: Date, activeViewIdx: number): void;
    /**
     * @hidden
     * @internal
     */
    onActiveViewDecadeKB(event: any, args: Date, activeViewIdx: number): void;
    /**
     * @hidden
     * @internal
     */
    getFormattedDate(): {
        weekday: string;
        monthday: string;
    };
    /**
     * Handles invoked on date selection
     *
     * @hidden
     * @internal
     */
    childClicked(instance: ICalendarDate): void;
    /**
     * @hidden
     * @internal
     */
    viewChanging(args: IViewChangingEventArgs): void;
    /**
     * @hidden
     * @intenal
     */
    changeMonth(event: Date): void;
    /**
     * @hidden
     * @internal
     */
    onActiveViewYear(args: Date, activeViewIdx: number): void;
    /**
     * @hidden
     * @internal
     */
    onActiveViewYearKB(args: Date, event: KeyboardEvent, activeViewIdx: number): void;
    /**
     * Deselects date(s) (based on the selection type).
     *
     * @example
     * ```typescript
     *  this.calendar.deselectDate(new Date(`2018-06-12`));
     * ````
     */
    deselectDate(value?: Date | Date[]): void;
    /**
     * @hidden
     * @internal
     */
    getViewDate(i: number): Date;
    /**
     * Getter for the context object inside the calendar templates.
     *
     * @hidden
     * @internal
     */
    getContext(i: number): {
        $implicit: {
            date: Date;
            full: string;
            index: number;
            monthView: () => void;
            yearView: () => void;
        };
    };
    /**
     * @hidden
     * @internal
     */
    animationDone(event: any): void;
    /**
     * @hidden
     * @internal
     */
    viewRendered(event: any): void;
    /**
     * @hidden
     * @internal
     */
    resetActiveDate(): void;
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     * @internal
     */
    getPrevMonth(date: any): Date;
    /**
     * @hidden
     * @internal
     */
    getNextMonth(date: any, viewIndex: any): Date;
    /**
     * Helper method building and returning the context object inside
     * the calendar templates.
     *
     * @hidden
     * @internal
     */
    private generateContext;
    /**
     * Helper method that sets references for prev/next months for each month in the view
     *
     * @hidden
     * @internal
     */
    private setSiblingMonths;
    /**
     * Helper method returning previous/next day views
     *
     * @hidden
     * @internal
     */
    private getMonthView;
    /**
     * Helper method that does deselection for all month views when selection is "multi"
     * If not called, selection in other month views stays
     *
     * @hidden
     * @internal
     */
    private deselectDateInMonthViews;
    private focusMonth;
    static ??fac: i0.????FactoryDeclaration<IgxCalendarComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxCalendarComponent, "igx-calendar", never, { "id": "id"; "hasHeader": "hasHeader"; "vertical": "vertical"; "monthsViewNumber": "monthsViewNumber"; "showWeekNumbers": "showWeekNumbers"; "animationAction": "animationAction"; }, {}, ["headerTemplateDirective", "subheaderTemplateDirective"], never>;
}
