import { AfterViewInit, ChangeDetectorRef, DoCheck, ElementRef, EventEmitter, OnDestroy, QueryList } from '@angular/core';
import { IgxCheckboxComponent } from '../checkbox/checkbox.component';
import { IgxGridForOfDirective } from '../directives/for-of/for_of.directive';
import { IgxGridSelectionService } from './selection/selection.service';
import { CellType, ColumnType, GridType } from './common/grid.interface';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class IgxRowDirective implements DoCheck, AfterViewInit, OnDestroy {
    grid: GridType;
    selectionService: IgxGridSelectionService;
    element: ElementRef<HTMLElement>;
    cdr: ChangeDetectorRef;
    /**
     * @hidden
     */
    addAnimationEnd: EventEmitter<IgxRowDirective>;
    /**
     * @hidden
     */
    role: string;
    /**
     *  The data passed to the row component.
     *
     * ```typescript
     * // get the row data for the first selected row
     * let selectedRowData = this.grid.selectedRows[0].data;
     * ```
     */
    get data(): any;
    set data(v: any);
    /**
     * The index of the row.
     *
     * ```typescript
     * // get the index of the second selected row
     * let selectedRowIndex = this.grid.selectedRows[1].index;
     * ```
     */
    index: number;
    /**
     * Sets whether this specific row has disabled functionality for editing and row selection.
     * Default value is `false`.
     * ```typescript
     * this.grid.selectedRows[0].pinned = true;
     * ```
     */
    disabled: boolean;
    /**
     * Sets whether the row is pinned.
     * Default value is `false`.
     * ```typescript
     * this.grid.selectedRows[0].pinned = true;
     * ```
     */
    set pinned(value: boolean);
    /**
     * Gets whether the row is pinned.
     * ```typescript
     * let isPinned = row.pinned;
     * ```
     */
    get pinned(): boolean;
    /**
     * Gets the expanded state of the row.
     * ```typescript
     * let isExpanded = row.expanded;
     * ```
     */
    get expanded(): boolean;
    /**
     * Expands/collapses the current row.
     *
     * ```typescript
     * this.grid.selectedRows[2].expanded = true;
     * ```
     */
    set expanded(val: boolean);
    get addRowUI(): any;
    get rowHeight(): number;
    get cellHeight(): number;
    /**
     * @hidden
     */
    gridID: string;
    /**
     * @hidden
     */
    _virtDirRow: QueryList<IgxGridForOfDirective<any>>;
    get virtDirRow(): IgxGridForOfDirective<any>;
    /**
     * @hidden
     */
    checkboxElement: IgxCheckboxComponent;
    protected _cells: QueryList<CellType>;
    /**
     * Gets the rendered cells in the row component.
     *
     * ```typescript
     * // get the cells of the third selected row
     * let selectedRowCells = this.grid.selectedRows[2].cells;
     * ```
     */
    get cells(): QueryList<CellType>;
    get dataRowIndex(): number;
    /**
     * @hidden
     */
    get selected(): boolean;
    set selected(value: boolean);
    /**
     * @hidden
     */
    get columns(): ColumnType[];
    /**
     * @hidden
     * @internal
     */
    get viewIndex(): number;
    /**
     * @hidden
     */
    get pinnedColumns(): ColumnType[];
    /**
     * @hidden
     */
    get isRoot(): boolean;
    /**
     * @hidden
     */
    get hasChildren(): boolean;
    /**
     * @hidden
     */
    get unpinnedColumns(): ColumnType[];
    /**
     * @hidden
     */
    get showRowSelectors(): boolean;
    /** @hidden */
    get dirty(): boolean;
    /**
     * @hidden
     */
    get rowDraggable(): boolean;
    /** @hidden */
    get added(): boolean;
    /** @hidden */
    get deleted(): boolean;
    /**
     * @hidden
     */
    get dragging(): boolean;
    get inEditMode(): boolean;
    /**
     * Gets the ID of the row.
     * A row in the grid is identified either by:
     * - primaryKey data value,
     * - the whole data, if the primaryKey is omitted.
     *
     * ```typescript
     * let rowID = this.grid.selectedRows[2].key;
     * ```
     */
    get key(): any;
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
     * @hidden
     */
    focused: boolean;
    /**
     * @hidden
     * @internal
     */
    defaultCssClass: string;
    /**
     * @hidden
     */
    triggerAddAnimationClass: boolean;
    protected destroy$: Subject<any>;
    protected _data: any;
    protected _addRow: boolean;
    constructor(grid: GridType, selectionService: IgxGridSelectionService, element: ElementRef<HTMLElement>, cdr: ChangeDetectorRef);
    /**
     * @hidden
     * @internal
     */
    onClick(event: MouseEvent): void;
    /**
     * @hidden
     * @internal
     */
    showActionStrip(): void;
    /**
     * @hidden
     * @internal
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    onRowSelectorClick(event: any): void;
    /**
     * Updates the specified row object and the data source record with the passed value.
     *
     * ```typescript
     * // update the second selected row's value
     * let newValue = "Apple";
     * this.grid.selectedRows[1].update(newValue);
     * ```
     */
    update(value: any): void;
    /**
     * Removes the specified row from the grid's data source.
     * This method emits `rowDeleted` event.
     *
     * ```typescript
     * // delete the third selected row from the grid
     * this.grid.selectedRows[2].delete();
     * ```
     */
    delete(): void;
    isCellActive(visibleColumnIndex: any): boolean;
    /**
     * Pins the specified row.
     * This method emits `rowPinning`\`rowPinned` event.
     *
     * ```typescript
     * // pin the selected row from the grid
     * this.grid.selectedRows[0].pin();
     * ```
     */
    pin(): boolean;
    /**
     * Unpins the specified row.
     * This method emits `rowPinning`\`rowPinned` event.
     *
     * ```typescript
     * // unpin the selected row from the grid
     * this.grid.selectedRows[0].unpin();
     * ```
     */
    unpin(): boolean;
    /**
     * @hidden
     */
    get rowCheckboxAriaLabel(): string;
    /**
     * @hidden
     */
    ngDoCheck(): void;
    /**
     * @hidden
     */
    shouldDisplayPinnedChip(visibleColumnIndex: number): boolean;
    /**
     * Spawns the add row UI for the specific row.
     *
     * @example
     * ```typescript
     * const row = this.grid1.getRowByIndex(1);
     * row.beginAddRow();
     * ```
     */
    beginAddRow(): void;
    /**
     * @hidden
     */
    triggerAddAnimation(): void;
    /**
     * @hidden
     */
    animationEndHandler(): void;
    /**
     * @hidden
     */
    get resolveDragIndicatorClasses(): string;
    static ??fac: i0.????FactoryDeclaration<IgxRowDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxRowDirective, "[igxRowBaseComponent]", never, { "data": "data"; "index": "index"; "disabled": "disabled"; "gridID": "gridID"; "selected": "selected"; }, { "addAnimationEnd": "addAnimationEnd"; }, never>;
}
