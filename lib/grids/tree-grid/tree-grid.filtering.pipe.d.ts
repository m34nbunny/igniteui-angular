import { PipeTransform } from '@angular/core';
import { IFilteringStrategy } from '../../data-operations/filtering-strategy';
import { IFilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { ITreeGridRecord } from './tree-grid.interfaces';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxTreeGridFilteringPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(hierarchyData: ITreeGridRecord[], expressionsTree: IFilteringExpressionsTree, filterStrategy: IFilteringStrategy, advancedFilteringExpressionsTree: IFilteringExpressionsTree, _: number, __: number, pinned?: any): ITreeGridRecord[];
    private expandAllRecursive;
    private filter;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridFilteringPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridFilteringPipe, "treeGridFiltering">;
}
