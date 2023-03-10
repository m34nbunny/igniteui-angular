import { PipeTransform } from '@angular/core';
import { NgControl } from '@angular/forms';
import { IgxInputDirective, IgxInputState } from '../input-group/public_api';
import { IgxInputGroupComponent } from '../input-group/input-group.component';
import { IgxDateTimeEditorDirective } from '../directives/date-time-editor/public_api';
import * as i0 from "@angular/core";
/** Represents a range between two dates. */
export interface DateRange {
    start: Date | string;
    end: Date | string;
}
/** @hidden @internal */
export declare class DateRangePickerFormatPipe implements PipeTransform {
    transform(values: DateRange, appliedFormat?: string, locale?: string, formatter?: (_: DateRange) => string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateRangePickerFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<DateRangePickerFormatPipe, "dateRange">;
}
/** @hidden @internal */
export declare class IgxDateRangeInputsBaseComponent extends IgxInputGroupComponent {
    dateTimeEditor: IgxDateTimeEditorDirective;
    inputDirective: IgxInputDirective;
    protected ngControl: NgControl;
    /** @hidden @internal */
    get nativeElement(): HTMLElement;
    /** @hidden @internal */
    setFocus(): void;
    /** @hidden @internal */
    updateInputValue(value: Date): void;
    /** @hidden @internal */
    updateInputValidity(state: IgxInputState): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxDateRangeInputsBaseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxDateRangeInputsBaseComponent, "igx-date-range-base", never, {}, {}, ["dateTimeEditor", "inputDirective", "ngControl"], never>;
}
/**
 * Defines the start input for a date range picker
 *
 * @igxModule IgxDateRangePickerModule
 *
 * @igxTheme igx-input-group-theme, igx-calendar-theme, igx-date-range-picker-theme
 *
 * @igxKeywords date, range, date range, date picker
 *
 * @igxGroup scheduling
 *
 * @remarks
 * When templating, start input has to be templated separately
 *
 * @example
 * ```html
 * <igx-date-range-picker mode="dropdown">
 *      <igx-date-range-start>
 *          <input igxInput igxDateTimeEditor type="text">
 *      </igx-date-range-start>
 *      ...
 * </igx-date-range-picker>
 * ```
 */
export declare class IgxDateRangeStartComponent extends IgxDateRangeInputsBaseComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxDateRangeStartComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxDateRangeStartComponent, "igx-date-range-start", never, {}, {}, never, ["igx-hint, [igxHint]", "[igxLabel]", "[igxInput]", "igx-prefix, [igxPrefix]", "igx-suffix, [igxSuffix]"]>;
}
/**
 * Defines the end input for a date range picker
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
 * When templating, end input has to be template separately
 *
 * @example
 * ```html
 * <igx-date-range-picker mode="dropdown">
 *      <igx-date-range-end>
 *          <input igxInput igxDateTimeEditor type="text">
 *      </igx-date-range-end>
 *      ...
 * </igx-date-range-picker>
 * ```
 */
export declare class IgxDateRangeEndComponent extends IgxDateRangeInputsBaseComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxDateRangeEndComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxDateRangeEndComponent, "igx-date-range-end", never, {}, {}, never, ["igx-hint, [igxHint]", "[igxLabel]", "[igxInput]", "igx-prefix, [igxPrefix]", "igx-suffix, [igxSuffix]"]>;
}
export declare class IgxDateRangeSeparatorDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxDateRangeSeparatorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxDateRangeSeparatorDirective, "[igxDateRangeSeparator]", never, {}, {}, never>;
}
