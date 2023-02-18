import { PipeTransform } from '@angular/core';
import { ITreeGridRecord } from './tree-grid.interfaces';
import { GridType } from '../common/grid.interface';
import { ISortingExpression } from '../../data-operations/sorting-strategy';
import { IGridSortingStrategy } from '../common/strategy';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxTreeGridHierarchizingPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any[], primaryKey: string, foreignKey: string, childDataKey: string, _: number): ITreeGridRecord[];
    private getRowID;
    private hierarchizeFlatData;
    private setIndentationLevels;
    private hierarchizeRecursive;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridHierarchizingPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridHierarchizingPipe, "treeGridHierarchizing">;
}
/**
 * @hidden
 */
export declare class IgxTreeGridFlatteningPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: ITreeGridRecord[], expandedLevels: number, expandedStates: Map<any, boolean>, _: number): any[];
    private getFlatDataRecursive;
    private updateNonProcessedRecordExpansion;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridFlatteningPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridFlatteningPipe, "treeGridFlattening">;
}
/** @hidden */
export declare class IgxTreeGridSortingPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(hierarchicalData: ITreeGridRecord[], expressions: ISortingExpression[], sorting: IGridSortingStrategy, _: number, pinned?: boolean): ITreeGridRecord[];
    private flattenTreeGridRecords;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridSortingPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridSortingPipe, "treeGridSorting">;
}
/** @hidden */
export declare class IgxTreeGridPagingPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: ITreeGridRecord[], page: number, perPage: number, _: number): ITreeGridRecord[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridPagingPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridPagingPipe, "treeGridPaging">;
}
/** @hidden */
export declare class IgxTreeGridTransactionPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any[], _: number): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridTransactionPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridTransactionPipe, "treeGridTransaction">;
}
/**
 * This pipe maps the original record to ITreeGridRecord format used in TreeGrid.
 */
export declare class IgxTreeGridNormalizeRecordsPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(_: any[], __: number): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridNormalizeRecordsPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridNormalizeRecordsPipe, "treeGridNormalizeRecord">;
}
export declare class IgxTreeGridAddRowPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any, isPinned: boolean, _pipeTrigger: number): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridAddRowPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridAddRowPipe, "treeGridAddRow">;
}
