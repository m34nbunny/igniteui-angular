import { IgxExcelStyleDefaultExpressionComponent } from './excel-style-default-expression.component';
import { DisplayDensity } from '../../../core/density';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxExcelStyleDateExpressionComponent extends IgxExcelStyleDefaultExpressionComponent {
    displayDensity: DisplayDensity;
    private input;
    private picker;
    protected get inputValuesElement(): HTMLInputElement;
    get inputDatePlaceholder(): string;
    get inputTimePlaceholder(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleDateExpressionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExcelStyleDateExpressionComponent, "igx-excel-style-date-expression", never, { "displayDensity": "displayDensity"; }, {}, never, never>;
}
