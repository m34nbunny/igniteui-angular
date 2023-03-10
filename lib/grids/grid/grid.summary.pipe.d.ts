import { PipeTransform } from '@angular/core';
import { IGroupByResult } from '../../data-operations/grouping-result.interface';
import { GridSummaryCalculationMode, GridSummaryPosition } from '../common/enums';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxGridSummaryPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: IGroupByResult, hasSummary: boolean, summaryCalculationMode: GridSummaryCalculationMode, summaryPosition: GridSummaryPosition, id: string, showSummary: any, _: number, __: number): any[];
    private addSummaryRows;
    private removeDeletedRecord;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridSummaryPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridSummaryPipe, "gridSummary">;
}
