import { IgxGridColumnResizerComponent } from '../resizer.component';
import { IgxPivotColumnResizingService } from './pivot-resizing.service';
import * as i0 from "@angular/core";
export declare class IgxPivotGridColumnResizerComponent extends IgxGridColumnResizerComponent {
    colResizingService: IgxPivotColumnResizingService;
    constructor(colResizingService: IgxPivotColumnResizingService);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPivotGridColumnResizerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxPivotGridColumnResizerComponent, "igx-pivot-grid-column-resizer", never, {}, {}, never, never>;
}
