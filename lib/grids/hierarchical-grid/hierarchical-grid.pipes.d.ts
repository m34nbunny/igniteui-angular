import { PipeTransform } from '@angular/core';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxGridHierarchicalPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any, state: Map<any, boolean>, id: string, primaryKey: any, childKeys: string[], _pipeTrigger: number): any[];
    addHierarchy<T>(grid: any, data: T[], state: any, primaryKey: any, childKeys: string[]): T[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridHierarchicalPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridHierarchicalPipe, "gridHierarchical">;
}
/**
 * @hidden
 */
export declare class IgxGridHierarchicalPagingPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any[], page: number, perPage: number, _id: string, _pipeTrigger: number): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridHierarchicalPagingPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridHierarchicalPagingPipe, "gridHierarchicalPaging">;
}
