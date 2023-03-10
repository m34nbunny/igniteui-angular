import { EventEmitter, QueryList, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { IgxCalendarMonthDirective } from '../calendar.directives';
import * as i0 from "@angular/core";
export declare class IgxMonthsViewComponent implements ControlValueAccessor {
    el: ElementRef;
    /**
     * Sets/gets the `id` of the months view.
     * If not set, the `id` will have value `"igx-months-view-0"`.
     * ```html
     * <igx-months-view id="my-months-view"></igx-months-view>
     * ```
     * ```typescript
     * let monthsViewId =  this.monthsView.id;
     * ```
     *
     * @memberof IgxMonthsViewComponent
     */
    id: string;
    /**
     * Gets/sets the selected date of the months view.
     * By default it is the current date.
     * ```html
     * <igx-months-view [date]="myDate"></igx-months-view>
     * ```
     * ```typescript
     * let date =  this.monthsView.date;
     * ```
     *
     * @memberof IgxMonthsViewComponent
     */
    set date(value: Date);
    get date(): Date;
    /**
     * Gets the month format option of the months view.
     * ```typescript
     * let monthFormat = this.monthsView.monthFormat.
     * ```
     */
    get monthFormat(): any;
    /**
     * Sets the month format option of the months view.
     * ```html
     * <igx-months-view> [monthFormat] = "short'"</igx-months-view>
     * ```
     *
     * @memberof IgxMonthsViewComponent
     */
    set monthFormat(value: any);
    /**
     * Gets the `locale` of the months view.
     * Default value is `"en"`.
     * ```typescript
     * let locale =  this.monthsView.locale;
     * ```
     *
     * @memberof IgxMonthsViewComponent
     */
    get locale(): string;
    /**
     * Sets the `locale` of the months view.
     * Expects a valid BCP 47 language tag.
     * Default value is `"en"`.
     * ```html
     * <igx-months-view [locale]="de"></igx-months-view>
     * ```
     *
     * @memberof IgxMonthsViewComponent
     */
    set locale(value: string);
    /**
     * Gets/sets whether the view should be rendered
     * according to the locale and monthFormat, if any.
     */
    formatView: boolean;
    /**
     * Emits an event when a selection is made in the months view.
     * Provides reference the `date` property in the `IgxMonthsViewComponent`.
     * ```html
     * <igx-months-view (selected)="onSelection($event)"></igx-months-view>
     * ```
     *
     * @memberof IgxMonthsViewComponent
     */
    selected: EventEmitter<Date>;
    /**
     * The default css class applied to the component.
     *
     * @hidden
     */
    styleClass: boolean;
    /**
     * @hidden
     */
    monthsRef: QueryList<IgxCalendarMonthDirective>;
    /**
     * Returns an array of date objects which are then used to
     * properly render the month names.
     *
     * Used in the template of the component
     *
     * @hidden
     */
    get months(): Date[];
    /**
     * @hidden
     * @internal
     */
    activeMonth: any;
    private _date;
    /**
     * @hidden
     */
    private _formatterMonth;
    /**
     * @hidden
     */
    private _locale;
    /**
     * @hidden
     */
    private _monthFormat;
    /**
     * @hidden
     */
    private _calendarModel;
    /**
     * @hidden
     */
    private _onTouchedCallback;
    /**
     * @hidden
     */
    private _onChangeCallback;
    constructor(el: ElementRef);
    /**
     * @hidden
     */
    onKeydownArrowUp(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowDown(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowRight(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowLeft(event: KeyboardEvent): void;
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
    onKeydownEnter(event: any): void;
    resetActiveMonth(): void;
    /**
     * Returns the locale representation of the month in the months view.
     *
     * @hidden
     */
    formattedMonth(value: Date): string;
    /**
     * @hidden
     */
    selectMonth(event: any): void;
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
    writeValue(value: Date): void;
    /**
     * @hidden
     */
    monthTracker(index: any, item: any): string;
    /**
     * @hidden
     */
    private initMonthFormatter;
    static ??fac: i0.????FactoryDeclaration<IgxMonthsViewComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxMonthsViewComponent, "igx-months-view", never, { "id": "id"; "date": "date"; "monthFormat": "monthFormat"; "locale": "locale"; "formatView": "formatView"; }, { "selected": "selected"; }, never, never>;
}
