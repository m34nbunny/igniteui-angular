import { EventEmitter, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Templates the default toggle icon in the picker.
 *
 * @remarks Can be applied to IgxDatePickerComponent, IgxTimePickerComponent, IgxDateRangePickerComponent
 *
 * @example
 * ```html
 * <igx-date-range-picker>
 *   <igx-picker-toggle igxSuffix>
 *      <igx-icon>calendar_view_day</igx-icon>
 *   </igx-picker-toggle>
 * </igx-date-range-picker>
 * ```
 */
export declare class IgxPickerToggleComponent {
    clicked: EventEmitter<any>;
    onClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPickerToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxPickerToggleComponent, "igx-picker-toggle", never, {}, { "clicked": "clicked"; }, never, ["*"]>;
}
/**
 * Templates the default clear icon in the picker.
 *
 * @remarks Can be applied to IgxDatePickerComponent, IgxTimePickerComponent, IgxDateRangePickerComponent
 *
 * @example
 * ```html
 * <igx-date-picker>
 *   <igx-picker-clear igxSuffix>
 *      <igx-icon>delete</igx-icon>
 *   </igx-picker-clear>
 * </igx-date-picker>
 * ```
 */
export declare class IgxPickerClearComponent extends IgxPickerToggleComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPickerClearComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxPickerClearComponent, "igx-picker-clear", never, {}, {}, never, ["*"]>;
}
/**
 * IgxPickerActionsDirective can be used to re-template the dropdown/dialog action buttons.
 *
 * @remarks Can be applied to IgxDatePickerComponent, IgxTimePickerComponent, IgxDateRangePickerComponent
 *
 */
export declare class IgxPickerActionsDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPickerActionsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxPickerActionsDirective, "[igxPickerActions]", never, {}, {}, never>;
}
/** @hidden */
export declare class IgxPickersCommonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPickersCommonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IgxPickersCommonModule, [typeof IgxPickerToggleComponent, typeof IgxPickerClearComponent, typeof IgxPickerActionsDirective], [typeof i1.CommonModule], [typeof IgxPickerToggleComponent, typeof IgxPickerClearComponent, typeof IgxPickerActionsDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IgxPickersCommonModule>;
}
