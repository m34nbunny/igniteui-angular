import { PipeTransform } from '@angular/core';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
export declare class IgxSummaryDataPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(id: string, trigger?: number): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSummaryDataPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxSummaryDataPipe, "igxGridSummaryDataPipe">;
}
