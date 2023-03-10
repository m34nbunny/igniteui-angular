import { ChangeDetectorRef, ComponentFactoryResolver, ElementRef, ViewContainerRef } from '@angular/core';
import { IgxColumnComponent } from '../columns/column.component';
import { PivotGridType } from '../common/grid.interface';
import { IgxRowDirective } from '../row.directive';
import { IgxGridSelectionService } from '../selection/selection.service';
import { IPivotGridRecord } from './pivot-grid.interface';
import * as i0 from "@angular/core";
export declare class IgxPivotRowComponent extends IgxRowDirective {
    grid: PivotGridType;
    selectionService: IgxGridSelectionService;
    element: ElementRef<HTMLElement>;
    cdr: ChangeDetectorRef;
    protected resolver: ComponentFactoryResolver;
    protected viewRef: ViewContainerRef;
    /**
     * @hidden
     */
    get selected(): boolean;
    constructor(grid: PivotGridType, selectionService: IgxGridSelectionService, element: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, resolver: ComponentFactoryResolver, viewRef: ViewContainerRef);
    /**
     * @hidden
     * @internal
     */
    get viewIndex(): number;
    /**
     * @hidden
     * @internal
     */
    disabled: boolean;
    /**
     * @hidden
     * @internal
     */
    get addRowUI(): any;
    /**
     * @hidden
     * @internal
     */
    get inEditMode(): boolean;
    /**
     * @hidden
     * @internal
     */
    set pinned(_value: boolean);
    get pinned(): boolean;
    /**
     * @hidden
     * @internal
     */
    delete(): void;
    /**
     * @hidden
     * @internal
     */
    beginAddRow(): void;
    /**
     * @hidden
     * @internal
     */
    update(_value: any): void;
    /**
     * @hidden
     * @internal
     */
    pin(): boolean;
    /**
    * @hidden
    * @internal
    */
    unpin(): boolean;
    /**
    *  The pivot record data passed to the row component.
    *
    * ```typescript
    * // get the pivot row data for the first selected row
    * let selectedRowData = this.grid.selectedRows[0].data;
    * ```
    */
    get data(): IPivotGridRecord;
    set data(v: IPivotGridRecord);
    /**
     * @hidden
     * @internal
     */
    get pivotAggregationData(): {};
    getCellClass(col: IgxColumnComponent): any;
    isCellActive(visibleColumnIndex: any): boolean;
    static ??fac: i0.????FactoryDeclaration<IgxPivotRowComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxPivotRowComponent, "igx-pivot-row", never, { "selected": "selected"; "data": "data"; }, {}, never, never>;
}
