import { DateRangeDescriptor } from '../core/dates';
export declare const range: (start: number, stop: any, step?: number) => any[];
/**
 * Returns true for leap years, false for non-leap years.
 *
 * @export
 * @param year
 * @returns
 */
export declare const isLeap: (year: number) => boolean;
export declare const weekDay: (year: number, month: number, day: number) => number;
/**
 * Return weekday and number of days for year, month.
 *
 * @export
 * @param year
 * @param month
 * @returns
 */
export declare const monthRange: (year: number, month: number) => number[];
export declare const isDateInRanges: (date: Date, ranges: DateRangeDescriptor[]) => boolean;
export interface ICalendarDate {
    date: Date;
    isCurrentMonth: boolean;
    isPrevMonth: boolean;
    isNextMonth: boolean;
}
export interface IFormattedParts {
    value: string;
    literal?: string;
    combined: string;
}
export interface IFormattingOptions {
    day?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    weekday?: 'long' | 'short' | 'narrow';
    year?: 'numeric' | '2-digit';
}
export interface IFormattingViews {
    day?: boolean;
    month?: boolean;
    year?: boolean;
}
export declare enum WEEKDAYS {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
export declare class Calendar {
    private _firstWeekDay;
    constructor(firstWeekDay?: number | WEEKDAYS);
    get firstWeekDay(): number;
    set firstWeekDay(value: number);
    /**
     * Returns an array of weekdays for one week starting
     * with the currently set `firstWeekDay`
     *
     * this.firstWeekDay = 0 (Sunday) --> [0, 1, 2, 3, 4, 5, 6]
     * this.firstWeekDay = 1 (Monday) --> [1, 2, 3, 4, 5, 6, 0]
     *
     * @returns
     *
     * @memberof Calendar
     */
    weekdays(): number[];
    /**
     * Returns the date values for one month. It will always iterate throught
     * complete weeks, so it will contain dates outside the specified month.
     *
     * @param year
     * @param month
     * @param boolean
     * @returns
     *
     * @memberof Calendar
     */
    monthdates(year: number, month: number, extraWeek?: boolean): ICalendarDate[];
    /**
     * Returns a matrix (array of arrays) representing a month's calendar.
     * Each row represents a full week; week entries are ICalendarDate objects.
     *
     * @param year
     * @param month
     * @returns
     *
     * @memberof Calendar
     */
    monthdatescalendar(year: number, month: number, extraWeek?: boolean): ICalendarDate[][];
    timedelta(date: Date, interval: string, units: number): Date;
    formatToParts(date: Date, locale: string, options: any, parts: string[]): {
        date: Date;
        full: string;
    };
    getFirstViewDate(date: Date, interval: string, activeViewIdx: number): Date;
    getDateByView(date: Date, interval: string, activeViewIdx: number): Date;
    getNextMonth(date: Date): Date;
    getPrevMonth(date: Date): Date;
    getNextYear(date: Date): Date;
    getPrevYear(date: Date): Date;
    getWeekNumber(date: Date): number;
    private generateICalendarDate;
    private isPreviousMonth;
    private isNextMonth;
}
