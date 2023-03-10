import { PipeTransform } from '@angular/core';
import { ISortingExpression } from '../../data-operations/sorting-strategy';
import { ColumnType } from '../common/grid.interface';
import * as i0 from "@angular/core";
export declare class SortingIndexPipe implements PipeTransform {
    transform(columnField: string, sortingExpressions: ISortingExpression[]): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<SortingIndexPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SortingIndexPipe, "sortingIndex">;
}
export declare class IgxHeaderGroupWidthPipe implements PipeTransform {
    transform(width: any, minWidth: any, hasLayout: boolean): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxHeaderGroupWidthPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxHeaderGroupWidthPipe, "igxHeaderGroupWidth">;
}
export declare class IgxHeaderGroupStylePipe implements PipeTransform {
    transform(styles: {
        [prop: string]: any;
    }, column: ColumnType, _: number): {
        [prop: string]: any;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxHeaderGroupStylePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxHeaderGroupStylePipe, "igxHeaderGroupStyle">;
}
