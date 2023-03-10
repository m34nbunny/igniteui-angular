import { PipeTransform } from '@angular/core';
import { IGroupingExpression } from '../../data-operations/grouping-expression.interface';
import { GridType } from '../common/grid.interface';
import { IgxSorting } from '../common/strategy';
import * as i0 from "@angular/core";
export declare class ITreeGridAggregation {
    field: string;
    aggregate: (parent: any, children: any[]) => any;
}
export declare class IgxGroupedTreeGridSorting extends IgxSorting {
    private static _instance;
    static instance(): IgxGroupedTreeGridSorting;
    protected getFieldValue(obj: any, key: string, isDate?: boolean, isTime?: boolean): any;
}
/** @hidden */
export declare class IgxTreeGridGroupingPipe implements PipeTransform {
    private grid;
    transform(collection: any[], groupingExpressions: IGroupingExpression[], groupKey: string, childDataKey: string, grid: GridType, aggregations?: ITreeGridAggregation[]): any[];
    private flattenGrouping;
    private groupByMultiple;
    private groupBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridGroupingPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxTreeGridGroupingPipe, "treeGridGrouping">;
}
