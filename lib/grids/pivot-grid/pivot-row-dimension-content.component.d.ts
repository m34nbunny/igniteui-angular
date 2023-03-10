import { ChangeDetectorRef, ComponentFactoryResolver, ElementRef, OnChanges, QueryList, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { IgxColumnComponent } from '../columns/column.component';
import { PivotGridType } from '../common/grid.interface';
import { IgxGridHeaderRowComponent } from '../headers/grid-header-row.component';
import { IPivotDimension, IPivotDimensionData, IPivotGridGroupRecord } from './pivot-grid.interface';
import { IgxPivotRowDimensionHeaderGroupComponent } from './pivot-row-dimension-header-group.component';
import * as i0 from "@angular/core";
/**
 *
 * For all intents & purposes treat this component as what a <thead> usually is in the default <table> element.
 *
 * This container holds the pivot grid header elements and their behavior/interactions.
 *
 * @hidden @internal
 */
export declare class IgxPivotRowDimensionContentComponent extends IgxGridHeaderRowComponent implements OnChanges {
    grid: PivotGridType;
    protected ref: ElementRef<HTMLElement>;
    protected cdr: ChangeDetectorRef;
    protected resolver: ComponentFactoryResolver;
    protected viewRef: ViewContainerRef;
    /**
     * @hidden
     * @internal
     */
    rowIndex: number;
    dimension: IPivotDimension;
    rootDimension: IPivotDimension;
    rowData: IPivotGridGroupRecord;
    /**
    * @hidden @internal
    */
    headerTemplate: TemplateRef<any>;
    /**
     * @hidden @internal
     */
    headerTemplateDefault: TemplateRef<any>;
    headerGroups: QueryList<IgxPivotRowDimensionHeaderGroupComponent>;
    constructor(grid: PivotGridType, ref: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, resolver: ComponentFactoryResolver, viewRef: ViewContainerRef);
    /**
     * @hidden @internal
     */
    rowDimensionData: IPivotDimensionData;
    get rowDimensionColumn(): import("../common/grid.interface").ColumnType;
    /**
    * @hidden
    * @internal
    */
    ngOnChanges(changes: SimpleChanges): void;
    /**
    * @hidden
    * @internal
    */
    toggleRowDimension(event: any): void;
    /**
     * @hidden
     * @internal
     */
    getRowDimensionKey(): string;
    getExpandState(): boolean;
    getLevel(): number;
    protected extractFromDimensions(): void;
    protected extractFromDimension(dim: IPivotDimension, rowData: IPivotGridGroupRecord): IgxColumnComponent;
    protected _createColComponent(field: string, header: string, dim: IPivotDimension): IgxColumnComponent;
    static ??fac: i0.????FactoryDeclaration<IgxPivotRowDimensionContentComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxPivotRowDimensionContentComponent, "igx-pivot-row-dimension-content", never, { "rowIndex": "rowIndex"; "dimension": "dimension"; "rootDimension": "rootDimension"; "rowData": "rowData"; }, {}, never, never>;
}
