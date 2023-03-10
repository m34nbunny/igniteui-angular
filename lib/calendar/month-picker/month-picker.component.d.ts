import { ElementRef } from '@angular/core';
import { IgxMonthsViewComponent } from '../months-view/months-view.component';
import { IgxMonthPickerBaseDirective } from '../month-picker-base';
import { IgxYearsViewComponent } from '../years-view/years-view.component';
import { IgxDaysViewComponent } from '../days-view/days-view.component';
import * as i0 from "@angular/core";
export declare class IgxMonthPickerComponent extends IgxMonthPickerBaseDirective {
    /**
     * Sets/gets the `id` of the month picker.
     * If not set, the `id` will have value `"igx-month-picker-0"`.
     */
    id: string;
    /**
     * The default css class applied to the component.
     *
     * @hidden
     */
    styleClass: boolean;
    /**
     * @hidden
     */
    monthsView: IgxMonthsViewComponent;
    /**
     * @hidden
     */
    dacadeView: IgxYearsViewComponent;
    /**
     * @hidden
     */
    daysView: IgxDaysViewComponent;
    /**
     * @hidden
     */
    yearsBtn: ElementRef;
    /**
     * @hidden
     */
    yearAction: string;
    /**
     * @hidden
     */
    previousYear(event?: KeyboardEvent): void;
    /**
     * @hidden
     */
    nextYear(event?: KeyboardEvent): void;
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
    animationDone(event: any): void;
    /**
     * @hidden
     */
    viewRendered(event: any): void;
    /**
     * @hidden
     */
    activeViewDecadeKB(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    activeViewDecade(): void;
    /**
     * @hidden
     */
    changeYearKB(event: KeyboardEvent, next?: boolean): void;
    /**
     * @hidden
     */
    selectYear(event: Date): void;
    /**
     * @hidden
     */
    selectMonth(event: Date): void;
    /**
     * Selects a date.
     * ```typescript
     *  this.monthPicker.selectDate(new Date(`2018-06-12`));
     * ```
     */
    selectDate(value: Date): Date;
    /**
     * @hidden
     */
    writeValue(value: Date): void;
    /**
     * @hidden
     */
    getNextYear(): number;
    /**
     * @hidden
     */
    getPreviousYear(): number;
    static ??fac: i0.????FactoryDeclaration<IgxMonthPickerComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxMonthPickerComponent, "igx-month-picker", never, { "id": "id"; }, {}, never, never>;
}
