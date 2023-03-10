import { ElementRef } from '@angular/core';
import { IChipsAreaReorderEventArgs } from '../../chips/public_api';
import { PlatformUtil } from '../../core/utils';
import { IGroupingExpression } from '../../data-operations/grouping-expression.interface';
import { ISortingExpression } from '../../data-operations/sorting-strategy';
import { FlatGridType } from '../common/grid.interface';
import { IgxGroupByAreaDirective } from './group-by-area.directive';
import * as i0 from "@angular/core";
/**
 * An internal component representing the group-by drop area for the igx-grid component.
 *
 * @hidden @internal
 */
export declare class IgxGridGroupByAreaComponent extends IgxGroupByAreaDirective {
    sortingExpressions: ISortingExpression[];
    /** The parent grid containing the component. */
    grid: FlatGridType;
    constructor(ref: ElementRef<HTMLElement>, platform: PlatformUtil);
    handleReorder(event: IChipsAreaReorderEventArgs): void;
    handleMoveEnd(): void;
    groupBy(expression: IGroupingExpression): void;
    clearGrouping(name: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridGroupByAreaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridGroupByAreaComponent, "igx-grid-group-by-area", never, { "sortingExpressions": "sortingExpressions"; "grid": "grid"; }, {}, never, never>;
}
