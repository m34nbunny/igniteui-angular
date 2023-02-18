import { PipeTransform } from '@angular/core';
import { IgxComboBase } from './combo.common';
import { SortingDirection } from '../data-operations/sorting-strategy';
import { IComboFilteringOptions } from './combo.component';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxComboCleanPipe implements PipeTransform {
    transform(collection: any[]): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxComboCleanPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxComboCleanPipe, "comboClean">;
}
/** @hidden */
export declare class IgxComboFilteringPipe implements PipeTransform {
    transform(collection: any[], searchValue: any, displayKey: any, filteringOptions: IComboFilteringOptions, shouldFilter?: boolean): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxComboFilteringPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxComboFilteringPipe, "comboFiltering">;
}
/** @hidden */
export declare class IgxComboGroupingPipe implements PipeTransform {
    combo: IgxComboBase;
    constructor(combo: IgxComboBase);
    transform(collection: any[], groupKey: any, valueKey: any, sortingDirection: SortingDirection): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxComboGroupingPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxComboGroupingPipe, "comboGrouping">;
}
