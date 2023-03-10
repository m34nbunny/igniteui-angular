import { PipeTransform } from '@angular/core';
import { ITreeGridRecord } from './tree-grid.interfaces';
import { GridSummaryCalculationMode, GridSummaryPosition } from '../common/enums';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxTreeGridSummaryPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(flatData: ITreeGridRecord[], hasSummary: boolean, summaryCalculationMode: GridSummaryCalculationMode, summaryPosition: GridSummaryPosition, showSummaryOnCollapse: boolean, _: number, __: number): any[];
    private addSummaryRows;
    private removeDeletedRecord;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridSummaryPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridSummaryPipe, "treeGridSummary">;
}
