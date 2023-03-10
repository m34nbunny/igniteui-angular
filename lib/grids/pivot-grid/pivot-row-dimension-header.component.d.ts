import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { GridType } from '../common/grid.interface';
import { IgxGridHeaderComponent } from '../headers/grid-header.component';
import { IgxPivotColumnResizingService } from '../resizing/pivot-grid/pivot-resizing.service';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxPivotRowDimensionHeaderComponent extends IgxGridHeaderComponent {
    grid: GridType;
    colResizingService: IgxPivotColumnResizingService;
    cdr: ChangeDetectorRef;
    refInstance: ElementRef<HTMLElement>;
    constructor(grid: GridType, colResizingService: IgxPivotColumnResizingService, cdr: ChangeDetectorRef, refInstance: ElementRef<HTMLElement>);
    onClick(event: MouseEvent): void;
    get selectable(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPivotRowDimensionHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxPivotRowDimensionHeaderComponent, "igx-pivot-row-dimension-header", never, {}, {}, never, never>;
}
