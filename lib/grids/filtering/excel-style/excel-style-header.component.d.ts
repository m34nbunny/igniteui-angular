import { BaseFilteringComponent } from './base-filtering.component';
import * as i0 from "@angular/core";
/**
 * A component used for presenting Excel style header UI.
 */
export declare class IgxExcelStyleHeaderComponent {
    esf: BaseFilteringComponent;
    /**
     * Sets whether the column pinning icon should be shown in the header.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-excel-style-header [showPinning]="true"></igx-excel-style-header>
     * ```
     */
    showPinning: boolean;
    /**
     * Sets whether the column selecting icon should be shown in the header.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-excel-style-header [showSelecting]="true"></igx-excel-style-header>
     * ```
     */
    showSelecting: boolean;
    /**
     * Sets whether the column hiding icon should be shown in the header.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-excel-style-header [showHiding]="true"></igx-excel-style-header>
     * ```
     */
    showHiding: boolean;
    constructor(esf: BaseFilteringComponent);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExcelStyleHeaderComponent, "igx-excel-style-header", never, { "showPinning": "showPinning"; "showSelecting": "showSelecting"; "showHiding": "showHiding"; }, {}, never, never>;
}
