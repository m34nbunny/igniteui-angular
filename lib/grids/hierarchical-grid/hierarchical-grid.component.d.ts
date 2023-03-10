import { AfterContentInit, AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, DoCheck, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewContainerRef } from '@angular/core';
import { IgxHierarchicalGridAPIService } from './hierarchical-grid-api.service';
import { IgxRowIslandComponent } from './row-island.component';
import { IgxColumnComponent } from '../columns/column.component';
import { IgxHierarchicalGridBaseDirective } from './hierarchical-grid-base.directive';
import { CellType, GridType, RowType } from '../common/grid.interface';
import { IgxGridToolbarTemplateContext } from '../toolbar/common';
import { IgxPaginatorComponent } from '../../paginator/paginator.component';
import { IgxOverlayOutletDirective } from '../../directives/toggle/toggle.directive';
import * as i0 from "@angular/core";
export interface HierarchicalStateRecord {
    rowID: any;
}
export declare class IgxChildGridRowComponent implements AfterViewInit, OnInit {
    gridAPI: IgxHierarchicalGridAPIService;
    element: ElementRef<HTMLElement>;
    private resolver;
    cdr: ChangeDetectorRef;
    layout: IgxRowIslandComponent;
    /**
     * @hidden
     */
    get parentHasScroll(): boolean;
    /**
     * @hidden
     */
    parentGridID: string;
    /**
     *  The data passed to the row component.
     *
     * ```typescript
     * // get the row data for the first selected row
     * let selectedRowData = this.grid.selectedRows[0].data;
     * ```
     */
    data: any;
    /**
     * The index of the row.
     *
     * ```typescript
     * // get the index of the second selected row
     * let selectedRowIndex = this.grid.selectedRows[1].index;
     * ```
     */
    index: number;
    hGrid: IgxHierarchicalGridComponent;
    /**
     * Get a reference to the grid that contains the selected row.
     *
     * ```typescript
     * handleRowSelection(event) {
     *  // the grid on which the rowSelected event was triggered
     *  const grid = event.row.grid;
     * }
     * ```
     *
     * ```html
     *  <igx-grid
     *    [data]="data"
     *    (rowSelected)="handleRowSelection($event)">
     *  </igx-grid>
     * ```
     */
    get parentGrid(): IgxHierarchicalGridComponent;
    get level(): number;
    /**
     * The native DOM element representing the row. Could be null in certain environments.
     *
     * ```typescript
     * // get the nativeElement of the second selected row
     * let selectedRowNativeElement = this.grid.selectedRows[1].nativeElement;
     * ```
     */
    get nativeElement(): HTMLElement;
    /**
     * Returns whether the row is expanded.
     * ```typescript
     * const RowExpanded = this.grid1.rowList.first.expanded;
     * ```
     */
    expanded: boolean;
    constructor(gridAPI: IgxHierarchicalGridAPIService, element: ElementRef<HTMLElement>, resolver: ComponentFactoryResolver, cdr: ChangeDetectorRef);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    private setupEventEmitters;
    private _handleLayoutChanges;
    static ??fac: i0.????FactoryDeclaration<IgxChildGridRowComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxChildGridRowComponent, "igx-child-grid-row", never, { "layout": "layout"; "parentGridID": "parentGridID"; "data": "data"; "index": "index"; }, {}, never, never>;
}
export declare class IgxHierarchicalGridComponent extends IgxHierarchicalGridBaseDirective implements GridType, AfterViewInit, AfterContentInit, OnInit, OnDestroy, DoCheck {
    /**
     * @hidden @internal
     */
    role: string;
    /**
     * @hidden
     */
    childLayoutList: QueryList<IgxRowIslandComponent>;
    /**
     * @hidden
     */
    allLayoutList: QueryList<IgxRowIslandComponent>;
    toolbarTemplate: TemplateRef<IgxGridToolbarTemplateContext>;
    /** @hidden @internal */
    paginatorList: QueryList<IgxPaginatorComponent>;
    toolbarOutlet: ViewContainerRef;
    paginatorOutlet: ViewContainerRef;
    /**
     * @hidden
     */
    templateOutlets: QueryList<any>;
    /**
     * @hidden
     */
    hierarchicalRows: QueryList<IgxChildGridRowComponent>;
    protected hierarchicalRecordTemplate: TemplateRef<any>;
    protected childTemplate: TemplateRef<any>;
    protected get headerHierarchyExpander(): ElementRef<HTMLElement>;
    /**
     * @hidden
     */
    childLayoutKeys: any[];
    /**
     * @hidden
     */
    highlightedRowID: any;
    /**
     * @hidden
     */
    updateOnRender: boolean;
    /**
     * @hidden
     */
    parent: IgxHierarchicalGridComponent;
    /**
     * @hidden
     */
    childRow: IgxChildGridRowComponent;
    private _data;
    private _filteredData;
    private h_id;
    private childGridTemplates;
    private scrollTop;
    private scrollLeft;
    /**
     * Gets/Sets the value of the `id` attribute.
     *
     * @remarks
     * If not provided it will be automatically generated.
     * @example
     * ```html
     * <igx-hierarchical-grid [id]="'igx-hgrid-1'" [data]="Data" [autoGenerate]="true"></igx-hierarchical-grid>
     * ```
     */
    get id(): string;
    set id(value: string);
    /**
     * An @Input property that lets you fill the `IgxHierarchicalGridComponent` with an array of data.
     * ```html
     * <igx-hierarchical-grid [data]="Data" [autoGenerate]="true"></igx-hierarchical-grid>
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    set data(value: any[] | null);
    /**
     * Returns an array of data set to the `IgxHierarchicalGridComponent`.
     * ```typescript
     * let filteredData = this.grid.filteredData;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get data(): any[] | null;
    /** @hidden @internal */
    get paginator(): IgxPaginatorComponent;
    /**
     * Sets an array of objects containing the filtered data in the `IgxHierarchicalGridComponent`.
     * ```typescript
     * this.grid.filteredData = [{
     *       ID: 1,
     *       Name: "A"
     * }];
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    set filteredData(value: any);
    /**
     * Returns an array of objects containing the filtered data in the `IgxHierarchicalGridComponent`.
     * ```typescript
     * let filteredData = this.grid.filteredData;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get filteredData(): any;
    /**
     * Gets/Sets the total number of records in the data source.
     *
     * @remarks
     * This property is required for remote grid virtualization to function when it is bound to remote data.
     * @example
     * ```typescript
     * const itemCount = this.grid1.totalItemCount;
     * this.grid1.totalItemCount = 55;
     * ```
     */
    set totalItemCount(count: number);
    get totalItemCount(): number;
    /**
     * Sets if all immediate children of the `IgxHierarchicalGridComponent` should be expanded/collapsed.
     * Defult value is false.
     * ```html
     * <igx-hierarchical-grid [id]="'igx-grid-1'" [data]="Data" [autoGenerate]="true" [expandChildren]="true"></igx-hierarchical-grid>
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    set expandChildren(value: boolean);
    /**
     * Gets if all immediate children of the `IgxHierarchicalGridComponent` previously have been set to be expanded/collapsed.
     * If previously set and some rows have been manually expanded/collapsed it will still return the last set value.
     * ```typescript
     * const expanded = this.grid.expandChildren;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get expandChildren(): boolean;
    /**
     * @deprecated in version 12.1.0. Use `getCellByColumn` or `getCellByKey` instead
     *
     * Returns a `CellType` object that matches the conditions.
     *
     * @example
     * ```typescript
     * const myCell = this.grid1.getCellByColumnVisibleIndex(2,"UnitPrice");
     * ```
     * @param rowIndex
     * @param index
     */
    getCellByColumnVisibleIndex(rowIndex: number, index: number): CellType;
    /**
     * Gets the unique identifier of the parent row. It may be a `string` or `number` if `primaryKey` of the
     * parent grid is set or an object reference of the parent record otherwise.
     * ```typescript
     * const foreignKey = this.grid.foreignKey;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get foreignKey(): any;
    /**
     * @hidden
     */
    get hasExpandableChildren(): boolean;
    /**
     * @hidden
     */
    get resolveRowEditContainer(): TemplateRef<any>;
    /**
     * @hidden
     */
    get resolveRowEditActions(): TemplateRef<any>;
    /**
     * @hidden
     */
    get resolveRowEditText(): TemplateRef<any>;
    /** @hidden */
    hideActionStrip(): void;
    /**
     * @hidden
     */
    get parentRowOutletDirective(): any;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    get outletDirective(): IgxOverlayOutletDirective;
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * Returns the `RowType` by index.
     *
     * @example
     * ```typescript
     * const myRow = this.grid1.getRowByIndex(1);
     * ```
     * @param index
     */
    getRowByIndex(index: number): RowType;
    /**
     * Returns the `RowType` by key.
     *
     * @example
     * ```typescript
     * const myRow = this.grid1.getRowByKey(1);
     * ```
     * @param key
     */
    getRowByKey(key: any): RowType;
    /**
     * @hidden @internal
     */
    allRows(): RowType[];
    /**
     * Returns the collection of `IgxHierarchicalGridRow`s for current page.
     *
     * @hidden @internal
     */
    dataRows(): RowType[];
    /**
     * Returns an array of the selected `IgxGridCell`s.
     *
     * @example
     * ```typescript
     * const selectedCells = this.grid.selectedCells;
     * ```
     */
    get selectedCells(): CellType[];
    /**
     * Returns a `CellType` object that matches the conditions.
     *
     * @example
     * ```typescript
     * const myCell = this.grid1.getCellByColumn(2, "UnitPrice");
     * ```
     * @param rowIndex
     * @param columnField
     */
    getCellByColumn(rowIndex: number, columnField: string): CellType;
    /**
     * Returns a `CellType` object that matches the conditions.
     *
     * @remarks
     * Requires that the primaryKey property is set.
     * @example
     * ```typescript
     * grid.getCellByKey(1, 'index');
     * ```
     * @param rowSelector match any rowID
     * @param columnField
     */
    getCellByKey(rowSelector: any, columnField: string): CellType;
    pinRow(rowID: any, index?: number): boolean;
    unpinRow(rowID: any): boolean;
    /**
     * @hidden @internal
     */
    dataLoading(event: any): void;
    /** @hidden */
    featureColumnsWidth(): number;
    /**
     * @hidden
     */
    onRowIslandChange(): void;
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    isRowHighlighted(rowData: any): boolean;
    /**
     * @hidden
     */
    isHierarchicalRecord(record: any): boolean;
    /**
     * @hidden
     */
    isChildGridRecord(record: any): boolean;
    /**
     * @hidden
     */
    trackChanges(index: any, rec: any): any;
    /**
     * @hidden
     */
    getContext(rowData: any, rowIndex: any, pinned: any): any;
    /**
     * @hidden
     */
    get rootGrid(): GridType;
    /**
     * @hidden
     */
    get iconTemplate(): TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    getDragGhostCustomTemplate(): TemplateRef<any>;
    /**
     * @hidden
     * Gets the visible content height that includes header + tbody + footer.
     * For hierarchical child grid it may be scrolled and not fully visible.
     */
    getVisibleContentHeight(): any;
    /**
     * @hidden
     */
    toggleAll(): void;
    /**
     * @hidden
     * @internal
     */
    hasExpandedRecords(): boolean;
    getDefaultExpandState(record: any): boolean;
    /**
     * @hidden
     */
    isExpanded(record: any): boolean;
    /**
     * @hidden
     */
    viewCreatedHandler(args: any): void;
    /**
     * @hidden
     */
    viewMovedHandler(args: any): void;
    onContainerScroll(): void;
    /**
     * @hidden
     */
    createRow(index: number, data?: any): RowType;
    /** @hidden @internal */
    getChildGrids(inDeph?: boolean): any[];
    protected generateDataFields(data: any[]): string[];
    protected resizeNotifyHandler(): void;
    /**
     * @hidden
     */
    protected initColumns(collection: QueryList<IgxColumnComponent>, cb?: (args: any) => void): void;
    protected setupColumns(): void;
    protected onColumnsChanged(change: QueryList<IgxColumnComponent>): void;
    protected _shouldAutoSize(renderedHeight: any): boolean;
    private updateColumnList;
    private _clearSeletionHighlights;
    private hg_verticalScrollHandler;
    private hg_horizontalScrollHandler;
    static ??fac: i0.????FactoryDeclaration<IgxHierarchicalGridComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxHierarchicalGridComponent, "igx-hierarchical-grid", never, { "id": "id"; "data": "data"; "expandChildren": "expandChildren"; }, {}, ["toolbarTemplate", "childLayoutList", "allLayoutList", "paginatorList"], ["igx-grid-toolbar", "igx-grid-footer", "igx-paginator"]>;
}
