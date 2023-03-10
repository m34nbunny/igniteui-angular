import { EventEmitter, ElementRef, QueryList } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { HammerGestureConfig } from '@angular/platform-browser';
import { IgxCalendarYearDirective } from '../calendar.directives';
import * as i0 from "@angular/core";
export declare class CalendarHammerConfig extends HammerGestureConfig {
    overrides: {
        pan: {
            direction: 24;
            threshold: number;
        };
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<CalendarHammerConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CalendarHammerConfig>;
}
export declare class IgxYearsViewComponent implements ControlValueAccessor {
    el: ElementRef;
    /**
     * Gets/sets whether the view should be rendered
     * according to the locale and yearFormat, if any.
     */
    formatView: boolean;
    /**
     * Emits an event when a selection is made in the years view.
     * Provides reference the `date` property in the `IgxYearsViewComponent`.
     * ```html
     * <igx-years-view (selected)="onSelection($event)"></igx-years-view>
     * ```
     *
     * @memberof IgxYearsViewComponent
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
     * @internal
     */
    calendarDir: QueryList<IgxCalendarYearDirective>;
    /**
     * @hidden
     */
    private _formatterYear;
    /**
     * @hidden
     */
    private _locale;
    /**
     * @hidden
     */
    private _yearFormat;
    /**
     * @hidden
     */
    private _calendarModel;
    /**
     * @hidden
     */
    private _date;
    /**
     * @hidden
     */
    private _onTouchedCallback;
    /**
     * @hidden
     */
    private _onChangeCallback;
    /**
     * Gets/sets the selected date of the years view.
     * By default it is the current date.
     * ```html
     * <igx-years-view [date]="myDate"></igx-years-view>
     * ```
     * ```typescript
     * let date =  this.yearsView.date;
     * ```
     *
     * @memberof IgxYearsViewComponent
     */
    get date(): Date;
    set date(value: Date);
    /**
     * Gets the year format option of the years view.
     * ```typescript
     * let yearFormat = this.yearsView.yearFormat.
     * ```
     */
    get yearFormat(): any;
    /**
     * Sets the year format option of the years view.
     * ```html
     * <igx-years-view [yearFormat]="numeric"></igx-years-view>
     * ```
     *
     * @memberof IgxYearsViewComponent
     */
    set yearFormat(value: any);
    /**
     * Gets the `locale` of the years view.
     * Default value is `"en"`.
     * ```typescript
     * let locale =  this.yearsView.locale;
     * ```
     *
     * @memberof IgxYearsViewComponent
     */
    get locale(): string;
    /**
     * Sets the `locale` of the years view.
     * Expects a valid BCP 47 language tag.
     * Default value is `"en"`.
     * ```html
     * <igx-years-view [locale]="de"></igx-years-view>
     * ```
     *
     * @memberof IgxYearsViewComponent
     */
    set locale(value: string);
    /**
     * Returns an array of date objects which are then used to properly
     * render the years.
     *
     * Used in the template of the component.
     *
     * @hidden
     */
    get decade(): Date[];
    constructor(el: ElementRef);
    /**
     * @hidden
     */
    onKeydownArrowDown(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowUp(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownEnter(): void;
    /**
     * Returns the locale representation of the year in the years view.
     *
     * @hidden
     */
    formattedYear(value: Date): string;
    /**
     * @hidden
     */
    selectYear(event: any): void;
    /**
     * @hidden
     */
    scroll(event: any): void;
    /**
     * @hidden
     */
    pan(event: any): void;
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
    yearTracker(index: any, item: any): string;
    /**
     * @hidden
     */
    writeValue(value: Date): void;
    /**
     * @hidden
     */
    private initYearFormatter;
    /**
     * @hidden
     */
    private generateYearRange;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxYearsViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxYearsViewComponent, "igx-years-view", never, { "formatView": "formatView"; "date": "date"; "yearFormat": "yearFormat"; "locale": "locale"; }, { "selected": "selected"; }, never, never>;
}
