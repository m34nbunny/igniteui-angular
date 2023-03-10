import { AfterContentInit, ElementRef, IterableDiffers, OnDestroy } from '@angular/core';
import { IChipsAreaReorderEventArgs } from '../../chips/public_api';
import { PlatformUtil } from '../../core/utils';
import { IGroupingExpression } from '../../data-operations/grouping-expression.interface';
import { IgxGroupByAreaDirective } from './group-by-area.directive';
import * as i0 from "@angular/core";
/**
 * An internal component representing the group-by drop area for the igx-grid component.
 *
 * @hidden @internal
 */
export declare class IgxTreeGridGroupByAreaComponent extends IgxGroupByAreaDirective implements AfterContentInit, OnDestroy {
    private differs;
    get hideGroupedColumns(): boolean;
    set hideGroupedColumns(value: boolean);
    private _hideGroupedColumns;
    private groupingDiffer;
    private destroy$;
    constructor(differs: IterableDiffers, ref: ElementRef<HTMLElement>, platform: PlatformUtil);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    handleReorder(event: IChipsAreaReorderEventArgs): void;
    handleMoveEnd(): void;
    groupBy(expression: IGroupingExpression): void;
    clearGrouping(name: string): void;
    protected expressionsChanged(): void;
    private updateSortingExpressions;
    private updateColumnsVisibility;
    private setColumnsVisibility;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTreeGridGroupByAreaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxTreeGridGroupByAreaComponent, "igx-tree-grid-group-by-area", never, { "hideGroupedColumns": "hideGroupedColumns"; }, {}, never, never>;
}
