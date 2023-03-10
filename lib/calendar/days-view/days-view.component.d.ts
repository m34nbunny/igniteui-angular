import { EventEmitter, QueryList, DoCheck, OnInit } from '@angular/core';
import { ICalendarDate } from '../../calendar/calendar';
import { IgxDayItemComponent } from './day-item.component';
import { DateRangeDescriptor } from '../../core/dates';
import { IgxCalendarBaseDirective } from '../calendar-base';
import { PlatformUtil } from '../../core/utils';
import { IViewChangingEventArgs } from './days-view.interface';
import { IgxDaysViewNavigationService } from '../days-view/daysview-navigation.service';
import * as i0 from "@angular/core";
export declare class IgxDaysViewComponent extends IgxCalendarBaseDirective implements DoCheck, OnInit {
    daysNavService: IgxDaysViewNavigationService;
    protected platform: PlatformUtil;
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
    id: string;
    /**
     * @hidden
     */
    changeDaysView: boolean;
    /**
     * Show/hide week numbers
     *
     * @example
     * ```html
     * <igx-days-view [showWeekNumbers]="true"></igx-days-view>
     * ``
     */
    showWeekNumbers: boolean;
    /**
     * @hidden
     * @internal
     */
    set activeDate(value: string);
    get activeDate(): string;
    /**
     * @hidden
     */
    dateSelection: EventEmitter<ICalendarDate>;
    /**
     * @hidden
     */
    viewChanging: EventEmitter<IViewChangingEventArgs>;
    /**
     * @hidden
     */
    activeDateChange: EventEmitter<string>;
    /**
     * @hidden
     */
    monthsViewBlur: EventEmitter<any>;
    /**
     * @hidden
     */
    dates: QueryList<IgxDayItemComponent>;
    /**
     * The default css class applied to the component.
     *
     * @hidden
     */
    styleClass: boolean;
    /**
     * @hidden
     */
    outOfRangeDates: DateRangeDescriptor[];
    /**
     * @hidden
     */
    nextMonthView: IgxDaysViewComponent;
    /** @hidden */
    prevMonthView: IgxDaysViewComponent;
    /** @hidden */
    shouldResetDate: boolean;
    private _activeDate;
    /**
     * @hidden
     */
    constructor(daysNavService: IgxDaysViewNavigationService, platform: PlatformUtil);
    /**
     * @hidden
     * @internal
     */
    resetActiveMonth(): void;
    /**
     * @hidden
     * @internal
     */
    pointerDown(): void;
    /**
     * @hidden
     */
    onKeydownArrow(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownHome(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownEnd(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    get getCalendarMonth(): ICalendarDate[][];
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngDoCheck(): void;
    /**
     * @hidden
     * @internal
     */
    tabIndex(day: ICalendarDate): number;
    /**
     * Returns the week number by date
     *
     * @hidden
     */
    getWeekNumber(date: any): number;
    /**
     * Returns the locale representation of the date in the days view.
     *
     * @hidden
     */
    formattedDate(value: Date): string;
    /**
     * @hidden
     */
    generateWeekHeader(): string[];
    /**
     * @hidden
     */
    rowTracker(index: any, item: any): string;
    /**
     * @hidden
     */
    dateTracker(index: any, item: any): string;
    /**
     * @hidden
     */
    isCurrentMonth(value: Date): boolean;
    /**
     * @hidden
     */
    isCurrentYear(value: Date): boolean;
    /**
     * @hidden
     */
    isSelected(date: ICalendarDate): boolean;
    /**
     * @hidden
     */
    isLastInRange(date: ICalendarDate): boolean;
    /**
     * @hidden
     */
    isFirstInRange(date: ICalendarDate): boolean;
    /**
     * @hidden
     */
    isWithinRange(date: Date, checkForRange: boolean, min?: Date, max?: Date): boolean;
    /**
     * @hidden
     */
    focusActiveDate(): void;
    /**
     * @hidden
     */
    selectDay(event: any): void;
    /**
     * @hidden
     */
    getFirstMonthView(): IgxDaysViewComponent;
    /**
     * @hidden
     */
    private disableOutOfRangeDates;
    /**
     * @hidden
     */
    private getLastMonthView;
    /**
     * @hidden
     */
    private get isSingleSelection();
    static ??fac: i0.????FactoryDeclaration<IgxDaysViewComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxDaysViewComponent, "igx-days-view", never, { "id": "id"; "changeDaysView": "changeDaysView"; "showWeekNumbers": "showWeekNumbers"; "activeDate": "activeDate"; }, { "dateSelection": "dateSelection"; "viewChanging": "viewChanging"; "activeDateChange": "activeDateChange"; "monthsViewBlur": "monthsViewBlur"; }, never, never>;
}
