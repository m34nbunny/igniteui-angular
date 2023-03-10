import { IgxRowDirective } from '../row.directive';
import * as i0 from "@angular/core";
export declare class IgxGridRowComponent extends IgxRowDirective {
    getContext(col: any, row: any): {
        $implicit: any;
        row: any;
    };
    get mrlRightPinnedOffset(): string;
    getContextMRL(pinnedCols: any, row: any): {
        $implicit: any;
        row: any;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridRowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridRowComponent, "igx-grid-row", never, {}, {}, never, never>;
}
