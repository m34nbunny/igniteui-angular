import { PipeTransform } from '@angular/core';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxGridDetailsPipe implements PipeTransform {
    private grid;
    constructor(grid: GridType);
    transform(collection: any[], hasDetails: boolean, expansionStates: Map<any, boolean>, _pipeTrigger: number): any[];
    protected addDetailRows(collection: any[], _expansionStates: Map<any, boolean>): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridDetailsPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IgxGridDetailsPipe, "gridDetails">;
}
