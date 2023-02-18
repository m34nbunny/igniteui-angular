import { PipeTransform } from '@angular/core';
import { GridType, RowType } from './grid.interface';
import { IgxSummaryOperand, IgxSummaryResult } from '../summaries/grid-summary';
import * as i0 from "@angular/core";
interface GridStyleCSSProperty {
    [prop: string]: any;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridCellStyleClassesPipe implements PipeTransform {
    transform(cssClasses: GridStyleCSSProperty, _: any, data: any, field: string, index: number, __: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridCellStyleClassesPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridCellStyleClassesPipe, "igxCellStyleClasses">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridCellStylesPipe implements PipeTransform {
    transform(styles: GridStyleCSSProperty, _: any, data: any, field: string, index: number, __: number): GridStyleCSSProperty;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridCellStylesPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridCellStylesPipe, "igxCellStyles">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridRowClassesPipe implements PipeTransform {
    private grid;
    row: RowType;
    constructor(grid: GridType);
    transform(cssClasses: GridStyleCSSProperty, row: RowType, editMode: boolean, selected: boolean, dirty: boolean, deleted: boolean, dragging: boolean, index: number, mrl: boolean, filteredOut: boolean, _rowData: any, _: number): Set<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridRowClassesPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridRowClassesPipe, "igxGridRowClasses">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridRowStylesPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(styles: GridStyleCSSProperty, rowData: any, index: number, __: number): GridStyleCSSProperty;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridRowStylesPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridRowStylesPipe, "igxGridRowStyles">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridNotGroupedPipe implements PipeTransform {
    transform(value: any[]): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridNotGroupedPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridNotGroupedPipe, "igxNotGrouped">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridTopLevelColumns implements PipeTransform {
    transform(value: any[]): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridTopLevelColumns, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridTopLevelColumns, "igxTopLevel">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridFilterConditionPipe implements PipeTransform {
    transform(value: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridFilterConditionPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridFilterConditionPipe, "filterCondition">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridTransactionPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any[], _id: string, _pipeTrigger: number): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridTransactionPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridTransactionPipe, "gridTransaction">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxGridPaginatorOptionsPipe implements PipeTransform {
    transform(values: Array<number>): number[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridPaginatorOptionsPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridPaginatorOptionsPipe, "paginatorOptions">;
}
/**
 * @hidden
 * @internal
 */
export declare class IgxHasVisibleColumnsPipe implements PipeTransform {
    transform(values: any[], hasVisibleColumns: any): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxHasVisibleColumnsPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxHasVisibleColumnsPipe, "visibleColumns">;
}
/**
 * @hidden
 */
export declare class IgxGridRowPinningPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any[], id: string, isPinned: boolean, _pipeTrigger: number): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridRowPinningPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridRowPinningPipe, "gridRowPinning">;
}
export declare class IgxGridDataMapperPipe implements PipeTransform {
    transform(data: any[], field: string, _: number, val: any, isNestedPath: boolean): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridDataMapperPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridDataMapperPipe, "dataMapper">;
}
export declare class IgxStringReplacePipe implements PipeTransform {
    transform(value: string, search: string | RegExp, replacement: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxStringReplacePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxStringReplacePipe, "igxStringReplace">;
}
export declare class IgxGridTransactionStatePipe implements PipeTransform {
    transform(row_id: any, field: string, rowEditable: boolean, transactions: any, _: any, __: any, ___: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridTransactionStatePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridTransactionStatePipe, "transactionState">;
}
export declare class IgxColumnFormatterPipe implements PipeTransform {
    transform(value: any, formatter: (v: any, data: any) => any, rowData: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxColumnFormatterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxColumnFormatterPipe, "columnFormatter">;
}
export declare class IgxSummaryFormatterPipe implements PipeTransform {
    transform(summaryResult: IgxSummaryResult, summaryOperand: IgxSummaryOperand, summaryFormatter: (s: IgxSummaryResult, o: IgxSummaryOperand) => any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSummaryFormatterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxSummaryFormatterPipe, "summaryFormatter">;
}
export declare class IgxGridAddRowPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any, isPinned: boolean, _pipeTrigger: number): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridAddRowPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridAddRowPipe, "gridAddRow">;
}
export {};
