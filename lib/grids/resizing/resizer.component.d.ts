import { IgxColumnResizingService } from './resizing.service';
import { IgxColumnResizerDirective } from './resizer.directive';
import * as i0 from "@angular/core";
export declare class IgxGridColumnResizerComponent {
    colResizingService: IgxColumnResizingService;
    restrictResizerTop: number;
    resizer: IgxColumnResizerDirective;
    constructor(colResizingService: IgxColumnResizingService);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridColumnResizerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridColumnResizerComponent, "igx-grid-column-resizer", never, { "restrictResizerTop": "restrictResizerTop"; }, {}, never, never>;
}
