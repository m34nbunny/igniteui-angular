import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef, ContentChild, ViewChild, Inject, Optional, LOCALE_ID } from '@angular/core';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { IgxGridBaseDirective } from '../grid-base.directive';
import { TransactionType, TransactionEventOrigin } from '../../services/transaction/transaction';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { IgxGridSummaryService } from '../summaries/grid-summary.service';
import { IgxGridSelectionService } from '../selection/selection.service';
import { mergeObjects } from '../../core/utils';
import { first, takeUntil } from 'rxjs/operators';
import { IgxRowLoadingIndicatorTemplateDirective } from './tree-grid.directives';
import { IgxForOfSyncService, IgxForOfScrollSyncService } from '../../directives/for-of/for_of.sync.service';
import { IgxGridNavigationService } from '../grid-navigation.service';
import { IGX_GRID_BASE, IGX_GRID_SERVICE_BASE } from '../common/grid.interface';
import { IgxTreeGridSelectionService } from './tree-grid-selection.service';
import { GridInstanceType, GridSelectionMode } from '../common/enums';
import { IgxSummaryRow, IgxTreeGridRow } from '../grid-public-row';
import { IgxGridCRUDService } from '../common/crud.service';
import { IgxTreeGridGroupByAreaComponent } from '../grouping/tree-grid-group-by-area.component';
import { IgxGridCell } from '../grid-public-cell';
import { DOCUMENT } from '@angular/common';
import { DisplayDensityToken } from '../../core/density';
import { IgxOverlayService } from '../../services/overlay/overlay';
import { IgxGridTransaction } from '../common/types';
import { TreeGridFilteringStrategy } from './tree-grid.filtering.strategy';
import * as i0 from "@angular/core";
import * as i1 from "../selection/selection.service";
import * as i2 from "../resizing/resizing.service";
import * as i3 from "../../services/transaction/transaction-factory.service";
import * as i4 from "../grid-navigation.service";
import * as i5 from "../filtering/grid-filtering.service";
import * as i6 from "../summaries/grid-summary.service";
import * as i7 from "../../core/utils";
import * as i8 from "../headers/grid-header-row.component";
import * as i9 from "./tree-grid-row.component";
import * as i10 from "../summaries/summary-row.component";
import * as i11 from "../../progressbar/progressbar.component";
import * as i12 from "../../snackbar/snackbar.component";
import * as i13 from "../../icon/icon.component";
import * as i14 from "../resizing/resizer.component";
import * as i15 from "../grid.common";
import * as i16 from "../selection/drag-select.directive";
import * as i17 from "@angular/common";
import * as i18 from "../moving/moving.drop.directive";
import * as i19 from "../../directives/for-of/for_of.directive";
import * as i20 from "../../directives/template-outlet/template_outlet.directive";
import * as i21 from "../../directives/toggle/toggle.directive";
import * as i22 from "../../directives/button/button.directive";
import * as i23 from "../../directives/ripple/ripple.directive";
import * as i24 from "../grid.rowEdit.directive";
import * as i25 from "./tree-grid.pipes";
import * as i26 from "./tree-grid.filtering.pipe";
import * as i27 from "../common/pipes";
import * as i28 from "./tree-grid.summary.pipe";
import * as i29 from "../summaries/grid-root-summary.pipe";
import * as i30 from "../../services/overlay/overlay";
let NEXT_ID = 0;
/**
 * **Ignite UI for Angular Tree Grid** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid/grid)
 *
 * The Ignite UI Tree Grid displays and manipulates hierarchical data with consistent schema formatted as a table and
 * provides features such as sorting, filtering, editing, column pinning, paging, column moving and hiding.
 *
 * Example:
 * ```html
 * <igx-tree-grid [data]="employeeData" primaryKey="employeeID" foreignKey="PID" [autoGenerate]="false">
 *   <igx-column field="first" header="First Name"></igx-column>
 *   <igx-column field="last" header="Last Name"></igx-column>
 *   <igx-column field="role" header="Role"></igx-column>
 * </igx-tree-grid>
 * ```
 */
export class IgxTreeGridComponent extends IgxGridBaseDirective {
    // Kind of stupid
    // private get _gridAPI(): IgxTreeGridAPIService {
    //     return this.gridAPI as IgxTreeGridAPIService;
    // }
    constructor(selectionService, colResizingService, gridAPI, 
    // public gridAPI: GridBaseAPIService<IgxGridBaseDirective & GridType>,
    transactionFactory, _elementRef, _zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform, _diTransactions) {
        super(selectionService, colResizingService, gridAPI, transactionFactory, _elementRef, _zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform);
        this.selectionService = selectionService;
        this.colResizingService = colResizingService;
        this.gridAPI = gridAPI;
        this.transactionFactory = transactionFactory;
        this.document = document;
        this.cdr = cdr;
        this.resolver = resolver;
        this.differs = differs;
        this.viewRef = viewRef;
        this.navigation = navigation;
        this.filteringService = filteringService;
        this.overlayService = overlayService;
        this.summaryService = summaryService;
        this._displayDensityOptions = _displayDensityOptions;
        this.platform = platform;
        this._diTransactions = _diTransactions;
        /**
         * An @Input property indicating whether child records should be deleted when their parent gets deleted.
         * By default it is set to true and deletes all children along with the parent.
         * ```html
         * <igx-tree-grid [data]="employeeData" [primaryKey]="'employeeID'" [foreignKey]="'parentID'" cascadeOnDelete="false">
         * </igx-tree-grid>
         * ```
         *
         * @memberof IgxTreeGridComponent
         */
        this.cascadeOnDelete = true;
        /**
         * @hidden @internal
         */
        this.role = 'treegrid';
        /**
         * An @Input property that sets the value of the `id` attribute. If not provided it will be automatically generated.
         * ```html
         * <igx-tree-grid [id]="'igx-tree-grid-1'"></igx-tree-grid>
         * ```
         *
         * @memberof IgxTreeGridComponent
         */
        this.id = `igx-tree-grid-${NEXT_ID++}`;
        /**
         * Returns a map of all `ITreeGridRecord`s.
         * ```typescript
         * // gets the record with primaryKey=2
         * const states = this.grid.records.get(2);
         * ```
         *
         * @memberof IgxTreeGridComponent
         */
        this.records = new Map();
        /**
         * Returns a map of all processed (filtered and sorted) `ITreeGridRecord`s.
         * ```typescript
         * // gets the processed record with primaryKey=2
         * const states = this.grid.processedRecords.get(2);
         * ```
         *
         * @memberof IgxTreeGridComponent
         */
        this.processedRecords = new Map();
        /**
         * @hidden
         */
        this.loadingRows = new Set();
        this._filterStrategy = new TreeGridFilteringStrategy();
        this._expansionDepth = Infinity;
        this._filteredData = null;
    }
    /**
     * An @Input property that lets you fill the `IgxTreeGridComponent` with an array of data.
     * ```html
     * <igx-tree-grid [data]="Data" [autoGenerate]="true"></igx-tree-grid>
     * ```
     *
     * @memberof IgxTreeGridComponent
     */
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value || [];
        this.summaryService.clearSummaryCache();
        if (this.shouldGenerate) {
            this.setupColumns();
        }
        this.cdr.markForCheck();
    }
    /**
     * Returns an array of objects containing the filtered data in the `IgxGridComponent`.
     * ```typescript
     * let filteredData = this.grid.filteredData;
     * ```
     *
     * @memberof IgxTreeGridComponent
     */
    get filteredData() {
        return this._filteredData;
    }
    /**
     * Sets an array of objects containing the filtered data in the `IgxGridComponent`.
     * ```typescript
     * this.grid.filteredData = [{
     *       ID: 1,
     *       Name: "A"
     * }];
     * ```
     *
     * @memberof IgxTreeGridComponent
     */
    set filteredData(value) {
        this._filteredData = value;
    }
    /**
     * Get transactions service for the grid.
     *
     * @experimental @hidden
     */
    get transactions() {
        if (this._diTransactions && !this.batchEditing) {
            return this._diTransactions;
        }
        return this._transactions;
    }
    /**
     * An @Input property that sets the count of levels to be expanded in the `IgxTreeGridComponent`. By default it is
     * set to `Infinity` which means all levels would be expanded.
     * ```html
     * <igx-tree-grid #grid [data]="employeeData" [childDataKey]="'employees'" expansionDepth="1" [autoGenerate]="true"></igx-tree-grid>
     * ```
     *
     * @memberof IgxTreeGridComponent
     */
    get expansionDepth() {
        return this._expansionDepth;
    }
    set expansionDepth(value) {
        this._expansionDepth = value;
        this.notifyChanges();
    }
    /**
     * An @Input property that provides a template for the row loading indicator when load on demand is enabled.
     * ```html
     * <ng-template #rowLoadingTemplate>
     *     <igx-icon>loop</igx-icon>
     * </ng-template>
     *
     * <igx-tree-grid #grid [data]="employeeData" [primaryKey]="'ID'" [foreignKey]="'parentID'"
     *                [loadChildrenOnDemand]="loadChildren"
     *                [rowLoadingIndicatorTemplate]="rowLoadingTemplate">
     * </igx-tree-grid>
     * ```
     *
     * @memberof IgxTreeGridComponent
     */
    get rowLoadingIndicatorTemplate() {
        return this._rowLoadingIndicatorTemplate;
    }
    set rowLoadingIndicatorTemplate(value) {
        this._rowLoadingIndicatorTemplate = value;
        this.notifyChanges();
    }
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
    getCellByColumnVisibleIndex(rowIndex, index) {
        const row = this.getRowByIndex(rowIndex);
        const column = this.columnList.find((col) => col.visibleIndex === index);
        if (row && row instanceof IgxTreeGridRow && column) {
            return new IgxGridCell(this, rowIndex, column.field);
        }
    }
    /**
     * @hidden
     */
    ngOnInit() {
        super.ngOnInit();
        this.rowToggle.pipe(takeUntil(this.destroy$)).subscribe((args) => {
            this.loadChildrenOnRowExpansion(args);
        });
        // TODO: cascade selection logic should be refactor to be handled in the already existing subs
        this.rowAddedNotifier.pipe(takeUntil(this.destroy$)).subscribe(args => {
            if (this.rowSelection === GridSelectionMode.multipleCascade) {
                let rec = this.gridAPI.get_rec_by_id(this.primaryKey ? args.data[this.primaryKey] : args.data);
                if (rec && rec.parent) {
                    this.gridAPI.grid.selectionService.updateCascadeSelectionOnFilterAndCRUD(new Set([rec.parent]), rec.parent.key);
                }
                else {
                    // The record is still not available
                    // Wait for the change detection to update records through pipes
                    requestAnimationFrame(() => {
                        rec = this.gridAPI.get_rec_by_id(this.primaryKey ?
                            args.data[this.primaryKey] : args.data);
                        if (rec && rec.parent) {
                            this.gridAPI.grid.selectionService.updateCascadeSelectionOnFilterAndCRUD(new Set([rec.parent]), rec.parent.key);
                        }
                        this.notifyChanges();
                    });
                }
            }
        });
        this.rowDeletedNotifier.pipe(takeUntil(this.destroy$)).subscribe(args => {
            if (this.rowSelection === GridSelectionMode.multipleCascade) {
                if (args.data) {
                    const rec = this.gridAPI.get_rec_by_id(this.primaryKey ? args.data[this.primaryKey] : args.data);
                    this.handleCascadeSelection(args, rec);
                }
                else {
                    // if a row has been added and before commiting the transaction deleted
                    const leafRowsDirectParents = new Set();
                    this.records.forEach(record => {
                        if (record && (!record.children || record.children.length === 0) && record.parent) {
                            leafRowsDirectParents.add(record.parent);
                        }
                    });
                    // Wait for the change detection to update records through pipes
                    requestAnimationFrame(() => {
                        this.gridAPI.grid.selectionService.updateCascadeSelectionOnFilterAndCRUD(leafRowsDirectParents);
                        this.notifyChanges();
                    });
                }
            }
        });
        this.filteringDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.rowSelection === GridSelectionMode.multipleCascade) {
                const leafRowsDirectParents = new Set();
                this.records.forEach(record => {
                    if (record && (!record.children || record.children.length === 0) && record.parent) {
                        leafRowsDirectParents.add(record.parent);
                    }
                });
                this.gridAPI.grid.selectionService.updateCascadeSelectionOnFilterAndCRUD(leafRowsDirectParents);
                this.notifyChanges();
            }
        });
    }
    ngDoCheck() {
        super.ngDoCheck();
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        // TODO: pipesExectured event
        // run after change detection in super triggers pipes for records structure
        if (this.rowSelection === GridSelectionMode.multipleCascade && this.selectedRows.length) {
            const selRows = this.selectedRows;
            this.selectionService.clearRowSelection();
            this.selectRows(selRows, true);
            this.cdr.detectChanges();
        }
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        if (this.rowLoadingTemplate) {
            this._rowLoadingIndicatorTemplate = this.rowLoadingTemplate.template;
        }
        super.ngAfterContentInit();
    }
    getDefaultExpandState(record) {
        return record.children && record.children.length && record.level < this.expansionDepth;
    }
    /**
     * Expands all rows.
     * ```typescript
     * this.grid.expandAll();
     * ```
     *
     * @memberof IgxTreeGridComponent
     */
    expandAll() {
        this._expansionDepth = Infinity;
        this.expansionStates = new Map();
    }
    /**
     * Collapses all rows.
     *
     * ```typescript
     * this.grid.collapseAll();
     *  ```
     *
     * @memberof IgxTreeGridComponent
     */
    collapseAll() {
        this._expansionDepth = 0;
        this.expansionStates = new Map();
    }
    /**
     * @hidden
     */
    refreshGridState(args) {
        super.refreshGridState();
        if (this.primaryKey && this.foreignKey && args) {
            const rowID = args.data[this.foreignKey];
            this.summaryService.clearSummaryCache({ rowID });
            this.pipeTrigger++;
            this.cdr.detectChanges();
        }
    }
    /**
     * Creates a new `IgxTreeGridRowComponent` with the given data. If a parentRowID is not specified, the newly created
     * row would be added at the root level. Otherwise, it would be added as a child of the row whose primaryKey matches
     * the specified parentRowID. If the parentRowID does not exist, an error would be thrown.
     * ```typescript
     * const record = {
     *     ID: this.grid.data[this.grid1.data.length - 1].ID + 1,
     *     Name: this.newRecord
     * };
     * this.grid.addRow(record, 1); // Adds a new child row to the row with ID=1.
     * ```
     *
     * @param data
     * @param parentRowID
     * @memberof IgxTreeGridComponent
     */
    // TODO: remove evt emission
    addRow(data, parentRowID) {
        this.crudService.endEdit(true);
        this.gridAPI.addRowToData(data, parentRowID);
        this.rowAddedNotifier.next({ data });
        this.pipeTrigger++;
        this.notifyChanges();
    }
    /**
     * Enters add mode by spawning the UI with the context of the specified row by index.
     *
     * @remarks
     * Accepted values for index are integers from 0 to this.grid.dataView.length
     * @remarks
     * When adding the row as a child, the parent row is the specified row.
     * @remarks
     * To spawn the UI on top, call the function with index = null or a negative number.
     * In this case trying to add this row as a child will result in error.
     * @example
     * ```typescript
     * this.grid.beginAddRowByIndex(10);
     * this.grid.beginAddRowByIndex(10, true);
     * this.grid.beginAddRowByIndex(null);
     * ```
     * @param index - The index to spawn the UI at. Accepts integers from 0 to this.grid.dataView.length
     * @param asChild - Whether the record should be added as a child. Only applicable to igxTreeGrid.
     */
    beginAddRowByIndex(index, asChild) {
        if (index === null || index < 0) {
            return this.beginAddRowById(null, asChild);
        }
        return this._addRowForIndex(index - 1, asChild);
    }
    /**
     * @hidden
     */
    getContext(rowData, rowIndex, pinned) {
        return {
            $implicit: this.isGhostRecord(rowData) ? rowData.recordRef : rowData,
            index: this.getDataViewIndex(rowIndex, pinned),
            templateID: {
                type: this.isSummaryRow(rowData) ? 'summaryRow' : 'dataRow',
                id: null
            },
            disabled: this.isGhostRecord(rowData) ? rowData.recordRef.isFilteredOutParent === undefined : false
        };
    }
    /**
     * @hidden
     * @internal
     */
    getInitialPinnedIndex(rec) {
        const id = this.gridAPI.get_row_id(rec);
        return this._pinnedRecordIDs.indexOf(id);
    }
    /**
     * @hidden
     * @internal
     */
    isRecordPinned(rec) {
        return this.getInitialPinnedIndex(rec.data) !== -1;
    }
    /**
     * @inheritdoc
     */
    getSelectedData(formatters = false, headers = false) {
        let source = [];
        const process = (record) => {
            if (record.summaries) {
                source.push(null);
                return;
            }
            source.push(record.data);
        };
        this.unpinnedDataView.forEach(process);
        source = this.isRowPinningToTop ? [...this.pinnedDataView, ...source] : [...source, ...this.pinnedDataView];
        return this.extractDataFromSelection(source, formatters, headers);
    }
    /**
     * @hidden @internal
     */
    getEmptyRecordObjectFor(inTreeRow) {
        const treeRowRec = inTreeRow?.treeRow || null;
        const row = { ...treeRowRec };
        const data = treeRowRec?.data || {};
        row.data = { ...data };
        Object.keys(row.data).forEach(key => {
            // persist foreign key if one is set.
            if (this.foreignKey && key === this.foreignKey) {
                row.data[key] = treeRowRec.data[key];
            }
            else {
                row.data[key] = undefined;
            }
        });
        let id = this.generateRowID();
        const rootRecPK = this.foreignKey && this.rootRecords && this.rootRecords.length > 0 ?
            this.rootRecords[0].data[this.foreignKey] : null;
        if (id === rootRecPK) {
            // safeguard in case generated id matches the root foreign key.
            id = this.generateRowID();
        }
        row.key = id;
        row.data[this.primaryKey] = id;
        return { rowID: id, data: row.data, recordRef: row };
    }
    /** @hidden */
    deleteRowById(rowId) {
        //  if this is flat self-referencing data, and CascadeOnDelete is set to true
        //  and if we have transactions we should start pending transaction. This allows
        //  us in case of delete action to delete all child rows as single undo action
        return this.gridAPI.deleteRowById(rowId);
    }
    /**
     * Returns the `IgxTreeGridRow` by index.
     *
     * @example
     * ```typescript
     * const myRow = treeGrid.getRowByIndex(1);
     * ```
     * @param index
     */
    getRowByIndex(index) {
        if (index < 0 || index >= this.dataView.length) {
            return undefined;
        }
        return this.createRow(index);
    }
    /**
     * Returns the `RowType` object by the specified primary key.
     *
     * @example
     * ```typescript
     * const myRow = this.treeGrid.getRowByIndex(1);
     * ```
     * @param index
     */
    getRowByKey(key) {
        const rec = this.filteredSortedData ? this.primaryKey ? this.filteredSortedData.find(r => r[this.primaryKey] === key) :
            this.filteredSortedData.find(r => r === key) : undefined;
        const index = this.dataView.findIndex(r => r.data && r.data === rec);
        if (index < 0 || index >= this.filteredSortedData.length) {
            return undefined;
        }
        return new IgxTreeGridRow(this, index, rec);
    }
    /**
     * Returns the collection of all RowType for current page.
     *
     * @hidden @internal
     */
    allRows() {
        return this.dataView.map((rec, index) => this.createRow(index));
    }
    /**
     * Returns the collection of `IgxTreeGridRow`s for current page.
     *
     * @hidden @internal
     */
    dataRows() {
        return this.allRows().filter(row => row instanceof IgxTreeGridRow);
    }
    /**
     * Returns an array of the selected `IgxGridCell`s.
     *
     * @example
     * ```typescript
     * const selectedCells = this.grid.selectedCells;
     * ```
     */
    get selectedCells() {
        return this.dataRows().map((row) => row.cells.filter((cell) => cell.selected))
            .reduce((a, b) => a.concat(b), []);
    }
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
    getCellByColumn(rowIndex, columnField) {
        const row = this.getRowByIndex(rowIndex);
        const column = this.columnList.find((col) => col.field === columnField);
        if (row && row instanceof IgxTreeGridRow && column) {
            return new IgxGridCell(this, rowIndex, columnField);
        }
    }
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
    getCellByKey(rowSelector, columnField) {
        const row = this.getRowByKey(rowSelector);
        const column = this.columnList.find((col) => col.field === columnField);
        if (row && column) {
            return new IgxGridCell(this, row.index, columnField);
        }
    }
    pinRow(rowID, index) {
        const row = this.getRowByKey(rowID);
        return super.pinRow(rowID, index, row);
    }
    unpinRow(rowID) {
        const row = this.getRowByKey(rowID);
        return super.unpinRow(rowID, row);
    }
    /** @hidden */
    generateRowPath(rowId) {
        const path = [];
        let record = this.records.get(rowId);
        while (record.parent) {
            path.push(record.parent.key);
            record = record.parent;
        }
        return path.reverse();
    }
    /** @hidden */
    isTreeRow(record) {
        return record.key !== undefined && record.data;
    }
    /** @hidden */
    getUnpinnedIndexById(id) {
        return this.unpinnedRecords.findIndex(x => x.data[this.primaryKey] === id);
    }
    /**
     * @hidden
     */
    createRow(index, data) {
        let row;
        const dataIndex = this._getDataViewIndex(index);
        const rec = data ?? this.dataView[dataIndex];
        if (this.isSummaryRow(rec)) {
            row = new IgxSummaryRow(this, index, rec.summaries, GridInstanceType.TreeGrid);
        }
        if (!row && rec) {
            const isTreeRow = this.isTreeRow(rec);
            const dataRec = isTreeRow ? rec.data : rec;
            const treeRow = isTreeRow ? rec : undefined;
            row = new IgxTreeGridRow(this, index, dataRec, treeRow);
        }
        return row;
    }
    /**
     * Returns if the `IgxTreeGridComponent` has groupable columns.
     *
     * @example
     * ```typescript
     * const groupableGrid = this.grid.hasGroupableColumns;
     * ```
     */
    get hasGroupableColumns() {
        return this.columnList.some((col) => col.groupable && !col.columnGroup);
    }
    generateDataFields(data) {
        return super.generateDataFields(data).filter(field => field !== this.childDataKey);
    }
    transactionStatusUpdate(event) {
        let actions = [];
        if (event.origin === TransactionEventOrigin.REDO) {
            actions = event.actions ? event.actions.filter(x => x.transaction.type === TransactionType.DELETE) : [];
            if (this.rowSelection === GridSelectionMode.multipleCascade) {
                this.handleCascadeSelection(event);
            }
        }
        else if (event.origin === TransactionEventOrigin.UNDO) {
            actions = event.actions ? event.actions.filter(x => x.transaction.type === TransactionType.ADD) : [];
            if (this.rowSelection === GridSelectionMode.multipleCascade) {
                if (event.actions[0].transaction.type === 'add') {
                    const rec = this.gridAPI.get_rec_by_id(event.actions[0].transaction.id);
                    this.handleCascadeSelection(event, rec);
                }
                else {
                    this.handleCascadeSelection(event);
                }
            }
        }
        if (actions.length) {
            for (const action of actions) {
                this.deselectChildren(action.transaction.id);
            }
        }
        super.transactionStatusUpdate(event);
    }
    ;
    findRecordIndexInView(rec) {
        return this.dataView.findIndex(x => x.data[this.primaryKey] === rec[this.primaryKey]);
    }
    /**
     * @hidden @internal
     */
    getDataBasedBodyHeight() {
        return !this.flatData || (this.flatData.length < this._defaultTargetRecordNumber) ?
            0 : this.defaultTargetBodyHeight;
    }
    /**
     * @hidden
     */
    scrollTo(row, column) {
        let delayScrolling = false;
        let record;
        if (typeof (row) !== 'number') {
            const rowData = row;
            const rowID = this.gridAPI.get_row_id(rowData);
            record = this.processedRecords.get(rowID);
            this.gridAPI.expand_path_to_record(record);
            if (this.paginator) {
                const rowIndex = this.processedExpandedFlatData.indexOf(rowData);
                const page = Math.floor(rowIndex / this.paginator.perPage);
                if (this.paginator.page !== page) {
                    delayScrolling = true;
                    this.paginator.page = page;
                }
            }
        }
        if (delayScrolling) {
            this.verticalScrollContainer.dataChanged.pipe(first()).subscribe(() => {
                this.scrollDirective(this.verticalScrollContainer, typeof (row) === 'number' ? row : this.unpinnedDataView.indexOf(record));
            });
        }
        else {
            this.scrollDirective(this.verticalScrollContainer, typeof (row) === 'number' ? row : this.unpinnedDataView.indexOf(record));
        }
        this.scrollToHorizontally(column);
    }
    writeToData(rowIndex, value) {
        mergeObjects(this.flatData[rowIndex], value);
    }
    /**
     * @hidden
     */
    initColumns(collection, cb = null) {
        if (this.hasColumnLayouts) {
            // invalid configuration - tree grid should not allow column layouts
            // remove column layouts
            const nonColumnLayoutColumns = this.columnList.filter((col) => !col.columnLayout && !col.columnLayoutChild);
            this.columnList.reset(nonColumnLayoutColumns);
        }
        super.initColumns(collection, cb);
    }
    /**
     * @hidden @internal
     */
    getGroupAreaHeight() {
        return this.groupArea ? this.getComputedHeight(this.groupArea.nativeElement) : 0;
    }
    /**
     * @description A recursive way to deselect all selected children of a given record
     * @param recordID ID of the record whose children to deselect
     * @hidden
     * @internal
     */
    deselectChildren(recordID) {
        const selectedChildren = [];
        // G.E. Apr 28, 2021 #9465 Records which are not in view can also be selected so we need to
        // deselect them as well, hence using 'records' map instead of getRowByKey() method which will
        // return only row components (i.e. records in view).
        const rowToDeselect = this.records.get(recordID);
        this.selectionService.deselectRow(recordID);
        this.gridAPI.get_selected_children(rowToDeselect, selectedChildren);
        if (selectedChildren.length > 0) {
            selectedChildren.forEach(x => this.deselectChildren(x));
        }
    }
    addChildRows(children, parentID) {
        if (this.primaryKey && this.foreignKey) {
            for (const child of children) {
                child[this.foreignKey] = parentID;
            }
            this.data.push(...children);
        }
        else if (this.childDataKey) {
            let parent = this.records.get(parentID);
            let parentData = parent.data;
            if (this.transactions.enabled && this.transactions.getAggregatedChanges(true).length) {
                const path = [];
                while (parent) {
                    path.push(parent.key);
                    parent = parent.parent;
                }
                let collection = this.data;
                let record;
                for (let i = path.length - 1; i >= 0; i--) {
                    const pid = path[i];
                    record = collection.find(r => r[this.primaryKey] === pid);
                    if (!record) {
                        break;
                    }
                    collection = record[this.childDataKey];
                }
                if (record) {
                    parentData = record;
                }
            }
            parentData[this.childDataKey] = children;
        }
        this.selectionService.clearHeaderCBState();
        this.pipeTrigger++;
        if (this.rowSelection === GridSelectionMode.multipleCascade) {
            // Force pipe triggering for building the data structure
            this.cdr.detectChanges();
            if (this.selectionService.isRowSelected(parentID)) {
                this.selectionService.rowSelection.delete(parentID);
                this.selectionService.selectRowsWithNoEvent([parentID]);
            }
        }
    }
    loadChildrenOnRowExpansion(args) {
        if (this.loadChildrenOnDemand) {
            const parentID = args.rowID;
            if (args.expanded && !this._expansionStates.has(parentID)) {
                this.loadingRows.add(parentID);
                this.loadChildrenOnDemand(parentID, children => {
                    this.loadingRows.delete(parentID);
                    this.addChildRows(children, parentID);
                    this.notifyChanges();
                });
            }
        }
    }
    handleCascadeSelection(event, rec = null) {
        // Wait for the change detection to update records through the pipes
        requestAnimationFrame(() => {
            if (rec === null) {
                rec = this.gridAPI.get_rec_by_id(event.actions[0].transaction.id);
            }
            if (rec && rec.parent) {
                this.gridAPI.grid.selectionService.updateCascadeSelectionOnFilterAndCRUD(new Set([rec.parent]), rec.parent.key);
                this.notifyChanges();
            }
        });
    }
}
IgxTreeGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridComponent, deps: [{ token: i1.IgxGridSelectionService }, { token: i2.IgxColumnResizingService }, { token: IGX_GRID_SERVICE_BASE }, { token: i3.IgxHierarchicalTransactionFactory }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }, { token: i0.IterableDiffers }, { token: i0.ViewContainerRef }, { token: i0.ApplicationRef }, { token: i0.NgModuleRef }, { token: i0.Injector }, { token: i4.IgxGridNavigationService }, { token: i5.IgxFilteringService }, { token: IgxOverlayService }, { token: i6.IgxGridSummaryService }, { token: DisplayDensityToken, optional: true }, { token: LOCALE_ID }, { token: i7.PlatformUtil }, { token: IgxGridTransaction, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxTreeGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeGridComponent, selector: "igx-tree-grid", inputs: { childDataKey: "childDataKey", foreignKey: "foreignKey", hasChildrenKey: "hasChildrenKey", cascadeOnDelete: "cascadeOnDelete", loadChildrenOnDemand: "loadChildrenOnDemand", id: "id", data: "data", expansionDepth: "expansionDepth", rowLoadingIndicatorTemplate: "rowLoadingIndicatorTemplate" }, host: { properties: { "attr.role": "this.role", "attr.id": "this.id" } }, providers: [
        IgxGridCRUDService,
        IgxGridSummaryService,
        IgxGridNavigationService,
        { provide: IgxGridSelectionService, useClass: IgxTreeGridSelectionService },
        { provide: IGX_GRID_SERVICE_BASE, useClass: IgxTreeGridAPIService },
        { provide: IGX_GRID_BASE, useExisting: IgxTreeGridComponent },
        IgxFilteringService,
        IgxForOfSyncService,
        IgxForOfScrollSyncService
    ], queries: [{ propertyName: "groupArea", first: true, predicate: IgxTreeGridGroupByAreaComponent, descendants: true, read: IgxTreeGridGroupByAreaComponent }, { propertyName: "rowLoadingTemplate", first: true, predicate: IgxRowLoadingIndicatorTemplateDirective, descendants: true, read: IgxRowLoadingIndicatorTemplateDirective }], viewQueries: [{ propertyName: "dragIndicatorIconBase", first: true, predicate: ["dragIndicatorIconBase"], descendants: true, read: TemplateRef, static: true }, { propertyName: "recordTemplate", first: true, predicate: ["record_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "summaryTemplate", first: true, predicate: ["summary_template"], descendants: true, read: TemplateRef, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-content select=\"igx-grid-toolbar\"></ng-content>\n<ng-content select=\"igx-tree-grid-group-by-area\"></ng-content>\n<igx-grid-header-row class=\"igx-grid-thead\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (focus)=\"navigation.focusFirstCell()\"\n>\n</igx-grid-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <div class=\"igx-grid__tbody-content\"  tabindex=\"0\" (focus)=\"navigation.focusTbody($event)\" (keydown)=\"navigation.handleNavigation($event)\"\n    (dragStop)=\"selectionService.dragMode = $event\" [attr.aria-activedescendant]=\"activeDescendant\" [attr.role]=\"dataView.length ? null : 'row'\"\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth' #tbody (scroll)='preventContainerScroll($event)'>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n        <ng-template #pinnedRecordsTemplate>\n            <ng-container *ngIf='data\n            | treeGridTransaction:pipeTrigger\n            | visibleColumns:hasVisibleColumns\n            | treeGridNormalizeRecord:pipeTrigger\n            | treeGridAddRow:true:pipeTrigger\n            | gridRowPinning:id:true:pipeTrigger\n            | treeGridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:pipeTrigger:filteringPipeTrigger:true\n            | treeGridSorting:sortingExpressions:sortStrategy:pipeTrigger:true as pinnedData'>\n                <div #pinContainer *ngIf='pinnedData.length > 0'\n                    [ngClass]=\"{\n                        'igx-grid__tr--pinned-bottom':  !isRowPinningToTop,\n                        'igx-grid__tr--pinned-top': isRowPinningToTop\n                    }\"\n                    class='igx-grid__tr--pinned' [style.width.px]='calcWidth'>\n                    <ng-container *ngFor=\"let rowData of pinnedData;let rowIndex = index;\">\n                        <ng-container *ngTemplateOutlet=\"pinned_record_template; context: getContext(rowData, rowIndex, true)\">\n                        </ng-container>\n                    </ng-container>\n                </div>\n            </ng-container>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && isRowPinningToTop ? pinnedRecordsTemplate : null\"></ng-container>\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"data\n        | treeGridTransaction:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | treeGridHierarchizing:primaryKey:foreignKey:childDataKey:pipeTrigger\n        | treeGridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:pipeTrigger:filteringPipeTrigger\n        | treeGridSorting:sortingExpressions:sortStrategy:pipeTrigger\n        | treeGridFlattening:expansionDepth:expansionStates:pipeTrigger\n        | treeGridPaging:paginator?.page:paginator?.perPage:pipeTrigger\n        | treeGridSummary:hasSummarizedColumns:summaryCalculationMode:summaryPosition:showSummaryOnCollapse:pipeTrigger:summaryPipeTrigger\n        | treeGridAddRow:false:pipeTrigger\n        | gridRowPinning:id:false:pipeTrigger\"\n            let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight' [igxForItemSize]=\"renderedRowHeight\" #verticalScrollContainer\n            (dataChanging)=\"dataRebinding($event)\" (dataChanged)=\"dataRebound($event)\">\n            <ng-template [igxTemplateOutlet]='isSummaryRow(rowData) ? summary_template : record_template'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex, false)'\n                (cachedViewLoaded)='cachedViewLoaded($event)'>\n            </ng-template>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && !isRowPinningToTop ? pinnedRecordsTemplate : null\"></ng-container>\n        <ng-template #record_template let-rowIndex=\"index\" let-disabledRow=\"disabled\" let-rowData>\n            <igx-tree-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [treeRow]=\"rowData\" [disabled]=\"disabledRow\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:row.treeRow.isFilteredOutParent:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-tree-grid-row>\n        </ng-template>\n        <ng-template #pinned_record_template let-rowIndex=\"index\" let-rowData>\n            <igx-tree-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [treeRow]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:row.treeRow.isFilteredOutParent:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\"#row #pinnedRow>\n            </igx-tree-grid-row>\n        </ng-template>\n        <ng-template #summary_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-summary-row [gridID]=\"id\" [summaries]=\"rowData.summaries\"\n                [firstCellIndentation]=\"rowData.cellIndentation\" [index]=\"rowIndex\"\n                class=\"igx-grid__summaries--body\" role=\"row\" #summaryRow>\n            </igx-grid-summary-row>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <div class=\"igx-grid__row-editing-outlet\" igxOverlayOutlet #igxRowEditingOverlayOutlet></div>\n        <igc-trial-watermark></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n        <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\"  (pointerdown)=\"$event.preventDefault()\"\n            [style.height.px]='calcHeight'>\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div igxOverlayOutlet #igxBodyOverlayOutlet=\"overlay-outlet\"></div>\n</div>\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" [style.height.px]='summaryRowHeight' #tfoot>\n    <div tabindex=\"0\" (focus)=\"navigation.focusFirstCell(false)\"\n    (keydown)=\"navigation.summaryNav($event)\" [attr.aria-activedescendant]=\"activeDescendant\">\n        <igx-grid-summary-row [style.width.px]='calcWidth' [style.height.px]='summaryRowHeight'\n            *ngIf=\"hasSummarizedColumns && rootSummariesEnabled\" [gridID]=\"id\" role=\"row\"\n            [summaries]=\"id | igxGridSummaryDataPipe:summaryService.retriggerRootPipe\" [index]=\"dataView.length\"\n            class=\"igx-grid__summaries\" #summaryRow>\n        </igx-grid-summary-row>\n        <div class=\"igx-grid__tfoot-thumb\" [hidden]='!hasVerticalScroll()' [style.height.px]='summaryRowHeight'\n            [style.width.px]=\"scrollSize\"></div>\n    </div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\" (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='[]' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n    <ng-container *ngIf=\"totalRecords || pagingMode === 1\">\n        <ng-content select=\"igx-paginator\"></ng-content>\n    </ng-container>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultAddRowEmptyTemplate>\n    <button igxButton=\"raised\" igxRipple (click)=\"this.crudService.enterAddRowMode(null, false, $event)\">\n        {{resourceStrings.igx_grid_add_row_label}}\n    </button>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n\n<div *ngIf=\"rowEditable\" igxToggle #rowEditingOverlay>\n    <div [className]=\"bannerClass\">\n        <ng-container\n            *ngTemplateOutlet=\"rowEditContainer; context: { rowChangesCount: rowChangesCount, endEdit: this.crudService.endEdit.bind(this) }\">\n        </ng-container>\n    </div>\n</div>\n\n<ng-template #defaultRowEditText>\n    You have {{ rowChangesCount }} changes in this row\n</ng-template>\n\n<ng-template #defaultRowEditActions>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(false, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_cancel }}</button>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(true, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_done }}</button>\n</ng-template>\n\n<ng-template #defaultRowEditTemplate>\n    <div class=\"igx-banner__message\">\n        <span class=\"igx-banner__text\">\n            <ng-container\n                *ngTemplateOutlet=\"this.crudService.row?.getClassName() === 'IgxAddRow' ? rowAddText : rowEditText ? rowEditText : defaultRowEditText;\n                context: { $implicit: this.crudService.row?.getClassName() !== 'IgxAddRow' ? rowChangesCount : null }\">\n            </ng-container>\n        </span>\n    </div>\n    <div class=\"igx-banner__actions\">\n        <div class=\"igx-banner__row\">\n            <ng-container\n                *ngTemplateOutlet=\"rowEditActions ? rowEditActions : defaultRowEditActions; context: { $implicit: this.endEdit.bind(this) }\">\n            </ng-container>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #dragIndicatorIconBase>\n    <igx-icon>drag_indicator</igx-icon>\n</ng-template>\n\n<igx-grid-column-resizer *ngIf=\"colResizingService.showResizer\"></igx-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n", components: [{ type: i8.IgxGridHeaderRowComponent, selector: "igx-grid-header-row", inputs: ["grid", "pinnedColumnCollection", "unpinnedColumnCollection", "activeDescendant", "hasMRL", "width", "density"] }, { type: i9.IgxTreeGridRowComponent, selector: "igx-tree-grid-row", inputs: ["treeRow"] }, { type: i10.IgxSummaryRowComponent, selector: "igx-grid-summary-row", inputs: ["summaries", "gridID", "index", "firstCellIndentation"] }, { type: i11.IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: ["id", "isIndeterminate", "textVisibility", "text"] }, { type: i12.IgxSnackbarComponent, selector: "igx-snackbar", inputs: ["id", "actionText", "positionSettings"], outputs: ["clicked", "animationStarted", "animationDone"] }, { type: i13.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i14.IgxGridColumnResizerComponent, selector: "igx-grid-column-resizer", inputs: ["restrictResizerTop"] }], directives: [{ type: i15.IgxGridBodyDirective, selector: "[igxGridBody]" }, { type: i16.IgxGridDragSelectDirective, selector: "[igxGridDragSelect]", inputs: ["igxGridDragSelect"], outputs: ["dragStop", "dragScroll"] }, { type: i17.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i18.IgxColumnMovingDropDirective, selector: "[igxColumnMovingDrop]", inputs: ["igxColumnMovingDrop"] }, { type: i17.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i17.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i17.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i19.IgxGridForOfDirective, selector: "[igxGridFor][igxGridForOf]", inputs: ["igxGridForOf", "igxGridForOfUniqueSizeCache", "igxGridForOfVariableSizes"], outputs: ["dataChanging"] }, { type: i20.IgxTemplateOutletDirective, selector: "[igxTemplateOutlet]", inputs: ["igxTemplateOutletContext", "igxTemplateOutlet"], outputs: ["viewCreated", "viewMoved", "cachedViewLoaded", "beforeViewDetach"] }, { type: i17.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i21.IgxOverlayOutletDirective, selector: "[igxOverlayOutlet]", exportAs: ["overlay-outlet"] }, { type: i21.IgxToggleDirective, selector: "[igxToggle]", inputs: ["id"], outputs: ["opened", "opening", "closed", "closing", "appended"], exportAs: ["toggle"] }, { type: i22.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i23.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }, { type: i24.IgxRowEditTabStopDirective, selector: "[igxRowEditTabStop]" }], pipes: { "treeGridSorting": i25.IgxTreeGridSortingPipe, "treeGridFiltering": i26.IgxTreeGridFilteringPipe, "gridRowPinning": i27.IgxGridRowPinningPipe, "treeGridAddRow": i25.IgxTreeGridAddRowPipe, "treeGridNormalizeRecord": i25.IgxTreeGridNormalizeRecordsPipe, "visibleColumns": i27.IgxHasVisibleColumnsPipe, "treeGridTransaction": i25.IgxTreeGridTransactionPipe, "treeGridSummary": i28.IgxTreeGridSummaryPipe, "treeGridPaging": i25.IgxTreeGridPagingPipe, "treeGridFlattening": i25.IgxTreeGridFlatteningPipe, "treeGridHierarchizing": i25.IgxTreeGridHierarchizingPipe, "igxGridRowClasses": i27.IgxGridRowClassesPipe, "igxGridRowStyles": i27.IgxGridRowStylesPipe, "igxGridSummaryDataPipe": i29.IgxSummaryDataPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-tree-grid', providers: [
                        IgxGridCRUDService,
                        IgxGridSummaryService,
                        IgxGridNavigationService,
                        { provide: IgxGridSelectionService, useClass: IgxTreeGridSelectionService },
                        { provide: IGX_GRID_SERVICE_BASE, useClass: IgxTreeGridAPIService },
                        { provide: IGX_GRID_BASE, useExisting: IgxTreeGridComponent },
                        IgxFilteringService,
                        IgxForOfSyncService,
                        IgxForOfScrollSyncService
                    ], template: "<ng-content select=\"igx-grid-toolbar\"></ng-content>\n<ng-content select=\"igx-tree-grid-group-by-area\"></ng-content>\n<igx-grid-header-row class=\"igx-grid-thead\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (focus)=\"navigation.focusFirstCell()\"\n>\n</igx-grid-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <div class=\"igx-grid__tbody-content\"  tabindex=\"0\" (focus)=\"navigation.focusTbody($event)\" (keydown)=\"navigation.handleNavigation($event)\"\n    (dragStop)=\"selectionService.dragMode = $event\" [attr.aria-activedescendant]=\"activeDescendant\" [attr.role]=\"dataView.length ? null : 'row'\"\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth' #tbody (scroll)='preventContainerScroll($event)'>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n        <ng-template #pinnedRecordsTemplate>\n            <ng-container *ngIf='data\n            | treeGridTransaction:pipeTrigger\n            | visibleColumns:hasVisibleColumns\n            | treeGridNormalizeRecord:pipeTrigger\n            | treeGridAddRow:true:pipeTrigger\n            | gridRowPinning:id:true:pipeTrigger\n            | treeGridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:pipeTrigger:filteringPipeTrigger:true\n            | treeGridSorting:sortingExpressions:sortStrategy:pipeTrigger:true as pinnedData'>\n                <div #pinContainer *ngIf='pinnedData.length > 0'\n                    [ngClass]=\"{\n                        'igx-grid__tr--pinned-bottom':  !isRowPinningToTop,\n                        'igx-grid__tr--pinned-top': isRowPinningToTop\n                    }\"\n                    class='igx-grid__tr--pinned' [style.width.px]='calcWidth'>\n                    <ng-container *ngFor=\"let rowData of pinnedData;let rowIndex = index;\">\n                        <ng-container *ngTemplateOutlet=\"pinned_record_template; context: getContext(rowData, rowIndex, true)\">\n                        </ng-container>\n                    </ng-container>\n                </div>\n            </ng-container>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && isRowPinningToTop ? pinnedRecordsTemplate : null\"></ng-container>\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"data\n        | treeGridTransaction:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | treeGridHierarchizing:primaryKey:foreignKey:childDataKey:pipeTrigger\n        | treeGridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:pipeTrigger:filteringPipeTrigger\n        | treeGridSorting:sortingExpressions:sortStrategy:pipeTrigger\n        | treeGridFlattening:expansionDepth:expansionStates:pipeTrigger\n        | treeGridPaging:paginator?.page:paginator?.perPage:pipeTrigger\n        | treeGridSummary:hasSummarizedColumns:summaryCalculationMode:summaryPosition:showSummaryOnCollapse:pipeTrigger:summaryPipeTrigger\n        | treeGridAddRow:false:pipeTrigger\n        | gridRowPinning:id:false:pipeTrigger\"\n            let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight' [igxForItemSize]=\"renderedRowHeight\" #verticalScrollContainer\n            (dataChanging)=\"dataRebinding($event)\" (dataChanged)=\"dataRebound($event)\">\n            <ng-template [igxTemplateOutlet]='isSummaryRow(rowData) ? summary_template : record_template'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex, false)'\n                (cachedViewLoaded)='cachedViewLoaded($event)'>\n            </ng-template>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && !isRowPinningToTop ? pinnedRecordsTemplate : null\"></ng-container>\n        <ng-template #record_template let-rowIndex=\"index\" let-disabledRow=\"disabled\" let-rowData>\n            <igx-tree-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [treeRow]=\"rowData\" [disabled]=\"disabledRow\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:row.treeRow.isFilteredOutParent:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-tree-grid-row>\n        </ng-template>\n        <ng-template #pinned_record_template let-rowIndex=\"index\" let-rowData>\n            <igx-tree-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [treeRow]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:row.treeRow.isFilteredOutParent:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\"#row #pinnedRow>\n            </igx-tree-grid-row>\n        </ng-template>\n        <ng-template #summary_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-summary-row [gridID]=\"id\" [summaries]=\"rowData.summaries\"\n                [firstCellIndentation]=\"rowData.cellIndentation\" [index]=\"rowIndex\"\n                class=\"igx-grid__summaries--body\" role=\"row\" #summaryRow>\n            </igx-grid-summary-row>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <div class=\"igx-grid__row-editing-outlet\" igxOverlayOutlet #igxRowEditingOverlayOutlet></div>\n        <igc-trial-watermark></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n        <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\"  (pointerdown)=\"$event.preventDefault()\"\n            [style.height.px]='calcHeight'>\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div igxOverlayOutlet #igxBodyOverlayOutlet=\"overlay-outlet\"></div>\n</div>\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" [style.height.px]='summaryRowHeight' #tfoot>\n    <div tabindex=\"0\" (focus)=\"navigation.focusFirstCell(false)\"\n    (keydown)=\"navigation.summaryNav($event)\" [attr.aria-activedescendant]=\"activeDescendant\">\n        <igx-grid-summary-row [style.width.px]='calcWidth' [style.height.px]='summaryRowHeight'\n            *ngIf=\"hasSummarizedColumns && rootSummariesEnabled\" [gridID]=\"id\" role=\"row\"\n            [summaries]=\"id | igxGridSummaryDataPipe:summaryService.retriggerRootPipe\" [index]=\"dataView.length\"\n            class=\"igx-grid__summaries\" #summaryRow>\n        </igx-grid-summary-row>\n        <div class=\"igx-grid__tfoot-thumb\" [hidden]='!hasVerticalScroll()' [style.height.px]='summaryRowHeight'\n            [style.width.px]=\"scrollSize\"></div>\n    </div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\" (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='[]' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n    <ng-container *ngIf=\"totalRecords || pagingMode === 1\">\n        <ng-content select=\"igx-paginator\"></ng-content>\n    </ng-container>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultAddRowEmptyTemplate>\n    <button igxButton=\"raised\" igxRipple (click)=\"this.crudService.enterAddRowMode(null, false, $event)\">\n        {{resourceStrings.igx_grid_add_row_label}}\n    </button>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n\n<div *ngIf=\"rowEditable\" igxToggle #rowEditingOverlay>\n    <div [className]=\"bannerClass\">\n        <ng-container\n            *ngTemplateOutlet=\"rowEditContainer; context: { rowChangesCount: rowChangesCount, endEdit: this.crudService.endEdit.bind(this) }\">\n        </ng-container>\n    </div>\n</div>\n\n<ng-template #defaultRowEditText>\n    You have {{ rowChangesCount }} changes in this row\n</ng-template>\n\n<ng-template #defaultRowEditActions>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(false, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_cancel }}</button>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(true, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_done }}</button>\n</ng-template>\n\n<ng-template #defaultRowEditTemplate>\n    <div class=\"igx-banner__message\">\n        <span class=\"igx-banner__text\">\n            <ng-container\n                *ngTemplateOutlet=\"this.crudService.row?.getClassName() === 'IgxAddRow' ? rowAddText : rowEditText ? rowEditText : defaultRowEditText;\n                context: { $implicit: this.crudService.row?.getClassName() !== 'IgxAddRow' ? rowChangesCount : null }\">\n            </ng-container>\n        </span>\n    </div>\n    <div class=\"igx-banner__actions\">\n        <div class=\"igx-banner__row\">\n            <ng-container\n                *ngTemplateOutlet=\"rowEditActions ? rowEditActions : defaultRowEditActions; context: { $implicit: this.endEdit.bind(this) }\">\n            </ng-container>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #dragIndicatorIconBase>\n    <igx-icon>drag_indicator</igx-icon>\n</ng-template>\n\n<igx-grid-column-resizer *ngIf=\"colResizingService.showResizer\"></igx-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.IgxGridSelectionService }, { type: i2.IgxColumnResizingService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_SERVICE_BASE]
                }] }, { type: i3.IgxHierarchicalTransactionFactory }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }, { type: i0.IterableDiffers }, { type: i0.ViewContainerRef }, { type: i0.ApplicationRef }, { type: i0.NgModuleRef }, { type: i0.Injector }, { type: i4.IgxGridNavigationService }, { type: i5.IgxFilteringService }, { type: i30.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }, { type: i6.IgxGridSummaryService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i7.PlatformUtil }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IgxGridTransaction]
                }] }]; }, propDecorators: { childDataKey: [{
                type: Input
            }], foreignKey: [{
                type: Input
            }], hasChildrenKey: [{
                type: Input
            }], cascadeOnDelete: [{
                type: Input
            }], loadChildrenOnDemand: [{
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], groupArea: [{
                type: ContentChild,
                args: [IgxTreeGridGroupByAreaComponent, { read: IgxTreeGridGroupByAreaComponent }]
            }], dragIndicatorIconBase: [{
                type: ViewChild,
                args: ['dragIndicatorIconBase', { read: TemplateRef, static: true }]
            }], recordTemplate: [{
                type: ViewChild,
                args: ['record_template', { read: TemplateRef, static: true }]
            }], summaryTemplate: [{
                type: ViewChild,
                args: ['summary_template', { read: TemplateRef, static: true }]
            }], rowLoadingTemplate: [{
                type: ContentChild,
                args: [IgxRowLoadingIndicatorTemplateDirective, { read: IgxRowLoadingIndicatorTemplateDirective }]
            }], data: [{
                type: Input
            }], expansionDepth: [{
                type: Input
            }], rowLoadingIndicatorTemplate: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy90cmVlLWdyaWQvdHJlZS1ncmlkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy90cmVlLWdyaWQvdHJlZS1ncmlkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFdBQVcsRUFDWCxLQUFLLEVBRUwsV0FBVyxFQUVYLFlBQVksRUFFWixTQUFTLEVBS1QsTUFBTSxFQUtOLFFBQVEsRUFDUixTQUFTLEVBSVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDaEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHOUQsT0FBTyxFQUdILGVBQWUsRUFDZixzQkFBc0IsRUFFekIsTUFBTSx3Q0FBd0MsQ0FBQztBQUNoRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFnQixNQUFNLGtCQUFrQixDQUFDO0FBQzlELE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDakYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDN0csT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdEUsT0FBTyxFQUF1QyxhQUFhLEVBQUUscUJBQXFCLEVBQVcsTUFBTSwwQkFBMEIsQ0FBQztBQUU5SCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUdsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUEwQixNQUFNLG9CQUFvQixDQUFDO0FBRWpGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUzRSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFaEI7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBaUJILE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxvQkFBb0I7SUFrUzFELGlCQUFpQjtJQUNqQixrREFBa0Q7SUFDbEQsb0RBQW9EO0lBQ3BELElBQUk7SUFFSixZQUNXLGdCQUF5QyxFQUN6QyxrQkFBNEMsRUFDYixPQUF3QjtJQUM5RCx1RUFBdUU7SUFDN0Qsa0JBQXFELEVBQy9ELFdBQW9DLEVBQ3BDLEtBQWEsRUFDWSxRQUFhLEVBQy9CLEdBQXNCLEVBQ25CLFFBQWtDLEVBQ2xDLE9BQXdCLEVBQ3hCLE9BQXlCLEVBQ25DLE1BQXNCLEVBQ3RCLFNBQTJCLEVBQzNCLFFBQWtCLEVBQ1gsVUFBb0MsRUFDcEMsZ0JBQXFDLEVBQ1AsY0FBaUMsRUFDL0QsY0FBcUMsRUFDTyxzQkFBOEMsRUFDOUUsUUFBZ0IsRUFDekIsUUFBc0IsRUFDa0IsZUFDNEI7UUFFOUUsS0FBSyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFDbkUsV0FBVyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFDdEcsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUEzQjNGLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUEwQjtRQUNiLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBRXBELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUM7UUFHdEMsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUMvQixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN4QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUk1QixlQUFVLEdBQVYsVUFBVSxDQUEwQjtRQUNwQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXFCO1FBQ1AsbUJBQWMsR0FBZCxjQUFjLENBQW1CO1FBQy9ELG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUNPLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFFdkYsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQUNrQixvQkFBZSxHQUFmLGVBQWUsQ0FDYTtRQXhSbEY7Ozs7Ozs7OztXQVNHO1FBRUksb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFtQjlCOztXQUVHO1FBRUksU0FBSSxHQUFHLFVBQVUsQ0FBQztRQUV6Qjs7Ozs7OztXQU9HO1FBR0ksT0FBRSxHQUFHLGlCQUFpQixPQUFPLEVBQUUsRUFBRSxDQUFDO1FBdUR6Qzs7Ozs7Ozs7V0FRRztRQUNJLFlBQU8sR0FBOEIsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFhNUU7Ozs7Ozs7O1dBUUc7UUFDSSxxQkFBZ0IsR0FBOEIsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFFckY7O1dBRUc7UUFDSSxnQkFBVyxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7UUFFMUIsb0JBQWUsR0FBRyxJQUFJLHlCQUF5QixFQUFFLENBQUM7UUFJcEQsb0JBQWUsR0FBRyxRQUFRLENBQUM7UUFDM0Isa0JBQWEsR0FBRyxJQUFJLENBQUM7SUE2STdCLENBQUM7SUEzSUQ7Ozs7Ozs7T0FPRztJQUNILElBQ1csSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBVyxJQUFJLENBQUMsS0FBbUI7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN4QyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3ZCO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQVcsWUFBWTtRQUNuQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSCxJQUFXLFlBQVksQ0FBQyxLQUFLO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBVyxZQUFZO1FBQ25CLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILElBQ1csY0FBYztRQUNyQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQVcsY0FBYyxDQUFDLEtBQWE7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILElBQ1csMkJBQTJCO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFXLDJCQUEyQixDQUFDLEtBQXVCO1FBQzFELElBQUksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7UUFDMUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFzQ0Q7Ozs7Ozs7Ozs7O09BV0c7SUFDSSwyQkFBMkIsQ0FBQyxRQUFnQixFQUFFLEtBQWE7UUFDOUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksS0FBSyxLQUFLLENBQUMsQ0FBQztRQUN6RSxJQUFJLEdBQUcsSUFBSSxHQUFHLFlBQVksY0FBYyxJQUFJLE1BQU0sRUFBRTtZQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLElBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9EO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNYLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDN0QsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsOEZBQThGO1FBQzlGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsRSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssaUJBQWlCLENBQUMsZUFBZSxFQUFFO2dCQUN6RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvRixJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQ0FBcUMsQ0FDcEUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUM5QztxQkFBTTtvQkFDSCxvQ0FBb0M7b0JBQ3BDLGdFQUFnRTtvQkFDaEUscUJBQXFCLENBQUMsR0FBRyxFQUFFO3dCQUN2QixHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFOzRCQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQ0FBcUMsQ0FDcEUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUM5Qzt3QkFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3pCLENBQUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwRSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssaUJBQWlCLENBQUMsZUFBZSxFQUFFO2dCQUN6RCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1gsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzFDO3FCQUFNO29CQUNILHVFQUF1RTtvQkFDdkUsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLEdBQUcsRUFBTyxDQUFDO29CQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTt3QkFDMUIsSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTs0QkFDL0UscUJBQXFCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzt5QkFDNUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsZ0VBQWdFO29CQUNoRSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7d0JBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHFDQUFxQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7d0JBQ2hHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDekIsQ0FBQyxDQUFDLENBQUM7aUJBQ047YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDN0QsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLGlCQUFpQixDQUFDLGVBQWUsRUFBRTtnQkFDekQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLEdBQUcsRUFBTyxDQUFDO2dCQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTt3QkFDL0UscUJBQXFCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDNUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMscUNBQXFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDaEcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3hCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sU0FBUztRQUNaLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7SUFDSSxlQUFlO1FBQ2xCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4Qiw2QkFBNkI7UUFDN0IsMkVBQTJFO1FBQzNFLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxpQkFBaUIsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDckYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksa0JBQWtCO1FBQ3JCLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3pCLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDO1NBQ3hFO1FBQ0QsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVNLHFCQUFxQixDQUFDLE1BQXVCO1FBQ2hELE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDM0YsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxTQUFTO1FBQ1osSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxXQUFXO1FBQ2QsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxnQkFBZ0IsQ0FBQyxJQUF3QjtRQUM1QyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBR0Q7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0gsNEJBQTRCO0lBQ3JCLE1BQU0sQ0FBQyxJQUFTLEVBQUUsV0FBaUI7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSSxrQkFBa0IsQ0FBQyxLQUFhLEVBQUUsT0FBaUI7UUFDdEQsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5QztRQUNELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7T0FFRztJQUNJLFVBQVUsQ0FBQyxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxNQUFnQjtRQUM5RCxPQUFPO1lBQ0gsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDcEUsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO1lBQzlDLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUMzRCxFQUFFLEVBQUUsSUFBSTthQUNYO1lBQ0QsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLO1NBQ3RHLENBQUM7SUFDTixDQUFDO0lBRUQ7OztPQUdHO0lBQ0kscUJBQXFCLENBQUMsR0FBRztRQUM1QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxlQUFlLENBQUMsVUFBVSxHQUFHLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSztRQUN0RCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN2QixJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLE9BQU87YUFDVjtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RyxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7T0FFRztJQUNJLHVCQUF1QixDQUFDLFNBQWtCO1FBQzdDLE1BQU0sVUFBVSxHQUFHLFNBQVMsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDO1FBQzlDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxVQUFVLEVBQUUsQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNwQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDaEMscUNBQXFDO1lBQ3JDLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDNUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO2FBQzdCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3JELElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNsQiwrREFBK0Q7WUFDL0QsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUM3QjtRQUNELEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN6RCxDQUFDO0lBRUQsY0FBYztJQUNQLGFBQWEsQ0FBQyxLQUFVO1FBQzNCLDZFQUE2RTtRQUM3RSxnRkFBZ0Y7UUFDaEYsOEVBQThFO1FBQzlFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFN0MsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksYUFBYSxDQUFDLEtBQWE7UUFDOUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUM1QyxPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxXQUFXLENBQUMsR0FBUTtRQUN2QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkgsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzdELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3JFLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUN0RCxPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUNELE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBVyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxjQUFjLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQVcsYUFBYTtRQUNwQixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDekUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksZUFBZSxDQUFDLFFBQWdCLEVBQUUsV0FBbUI7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQztRQUN4RSxJQUFJLEdBQUcsSUFBSSxHQUFHLFlBQVksY0FBYyxJQUFJLE1BQU0sRUFBRTtZQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLElBQVcsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDOUQ7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxZQUFZLENBQUMsV0FBZ0IsRUFBRSxXQUFtQjtRQUNyRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDO1FBQ3hFLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtZQUNmLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBVyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDL0Q7SUFDTCxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQVUsRUFBRSxLQUFjO1FBQ3BDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFVO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsY0FBYztJQUNQLGVBQWUsQ0FBQyxLQUFVO1FBQzdCLE1BQU0sSUFBSSxHQUFVLEVBQUUsQ0FBQztRQUN2QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzFCO1FBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELGNBQWM7SUFDUCxTQUFTLENBQUMsTUFBVztRQUN4QixPQUFPLE1BQU0sQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbkQsQ0FBQztJQUVELGNBQWM7SUFDUCxvQkFBb0IsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSxTQUFTLENBQUMsS0FBYSxFQUFFLElBQVU7UUFDdEMsSUFBSSxHQUFZLENBQUM7UUFDakIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELE1BQU0sR0FBRyxHQUFRLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN4QixHQUFHLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBVyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUU7WUFDYixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQzNDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDNUMsR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLElBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQVcsbUJBQW1CO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVTLGtCQUFrQixDQUFDLElBQVc7UUFDcEMsT0FBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRVMsdUJBQXVCLENBQUMsS0FBdUI7UUFDckQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEcsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLGlCQUFpQixDQUFDLGVBQWUsRUFBRTtnQkFDekQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RDO1NBQ0o7YUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssc0JBQXNCLENBQUMsSUFBSSxFQUFFO1lBQ3JELE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3JHLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtvQkFDN0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzNDO3FCQUFNO29CQUNILElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDdEM7YUFDSjtTQUNKO1FBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2hCLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO2dCQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNoRDtTQUNKO1FBQ0QsS0FBSyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFBQSxDQUFDO0lBRVEscUJBQXFCLENBQUMsR0FBRztRQUMvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRDs7T0FFRztJQUNPLHNCQUFzQjtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUM7SUFDekMsQ0FBQztJQUVEOztPQUVHO0lBQ08sUUFBUSxDQUFDLEdBQWlCLEVBQUUsTUFBb0I7UUFDdEQsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksTUFBdUIsQ0FBQztRQUU1QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDM0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFM0MsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDOUIsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2lCQUM5QjthQUNKO1NBQ0o7UUFFRCxJQUFJLGNBQWMsRUFBRTtZQUNoQixJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqRixDQUFDLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDaEY7UUFFRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVTLFdBQVcsQ0FBQyxRQUFnQixFQUFFLEtBQVU7UUFDOUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVEOztPQUVHO0lBQ08sV0FBVyxDQUFDLFVBQXlDLEVBQUUsS0FBMEIsSUFBSTtRQUMzRixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixvRUFBb0U7WUFDcEUsd0JBQXdCO1lBQ3hCLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzVHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDakQ7UUFDRCxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7O09BRUc7SUFDTyxrQkFBa0I7UUFDeEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNLLGdCQUFnQixDQUFDLFFBQVE7UUFDN0IsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsMkZBQTJGO1FBQzNGLDhGQUE4RjtRQUM5RixxREFBcUQ7UUFDckQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BFLElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM3QixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzRDtJQUNMLENBQUM7SUFFTyxZQUFZLENBQUMsUUFBZSxFQUFFLFFBQWE7UUFDL0MsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEMsS0FBSyxNQUFNLEtBQUssSUFBSSxRQUFRLEVBQUU7Z0JBQzFCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQ3JDO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztTQUMvQjthQUFNLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUMxQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBRTdCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xGLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsT0FBTyxNQUFNLEVBQUU7b0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUMxQjtnQkFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMzQixJQUFJLE1BQVcsQ0FBQztnQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFFMUQsSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDVCxNQUFNO3FCQUNUO29CQUNELFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUMxQztnQkFDRCxJQUFJLE1BQU0sRUFBRTtvQkFDUixVQUFVLEdBQUcsTUFBTSxDQUFDO2lCQUN2QjthQUNKO1lBRUQsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7U0FDNUM7UUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLGlCQUFpQixDQUFDLGVBQWUsRUFBRTtZQUN6RCx3REFBd0Q7WUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN6QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQzNEO1NBQ0o7SUFDTCxDQUFDO0lBRU8sMEJBQTBCLENBQUMsSUFBeUI7UUFDeEQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDM0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUU1QixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUN2RCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFL0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxLQUEyQyxFQUFFLE1BQXVCLElBQUk7UUFDbkcsb0VBQW9FO1FBQ3BFLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtZQUN2QixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ2QsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFFLEtBQTBCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMzRjtZQUNELElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHFDQUFxQyxDQUNwRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUN4QyxDQUFDO2dCQUNGLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN4QjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7aUhBditCUSxvQkFBb0IsaUdBMFNqQixxQkFBcUIsOEdBS3JCLFFBQVEsaVRBVVIsaUJBQWlCLGtEQUVMLG1CQUFtQiw2QkFDL0IsU0FBUyx5Q0FFRyxrQkFBa0I7cUdBOVRqQyxvQkFBb0IsZ2FBWmxCO1FBQ1Asa0JBQWtCO1FBQ2xCLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixFQUFFO1FBQzNFLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxxQkFBcUIsRUFBRTtRQUNuRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFO1FBQzdELG1CQUFtQjtRQUNuQixtQkFBbUI7UUFDbkIseUJBQXlCO0tBQzVCLGlFQTZGYSwrQkFBK0IsMkJBQVUsK0JBQStCLGtFQXlCeEUsdUNBQXVDLDJCQUFVLHVDQUF1Qyx3SUFsQjFELFdBQVcsMEhBTWpCLFdBQVcsNEhBTVYsV0FBVyxrRUM5TXRELDZsWkF3TkE7MkZEeEhhLG9CQUFvQjtrQkFoQmhDLFNBQVM7c0NBQ1csdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxlQUFlLGFBRWQ7d0JBQ1Asa0JBQWtCO3dCQUNsQixxQkFBcUI7d0JBQ3JCLHdCQUF3Qjt3QkFDeEIsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixFQUFFO3dCQUMzRSxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUscUJBQXFCLEVBQUU7d0JBQ25FLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLHNCQUFzQixFQUFFO3dCQUM3RCxtQkFBbUI7d0JBQ25CLG1CQUFtQjt3QkFDbkIseUJBQXlCO3FCQUM1Qjs7MEJBNFNJLE1BQU07MkJBQUMscUJBQXFCOzswQkFLNUIsTUFBTTsyQkFBQyxRQUFROzswQkFVZixNQUFNOzJCQUFDLGlCQUFpQjs7MEJBRXhCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsbUJBQW1COzswQkFDdEMsTUFBTTsyQkFBQyxTQUFTOzswQkFFaEIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxrQkFBa0I7NENBcFRuQyxZQUFZO3NCQURsQixLQUFLO2dCQWFDLFVBQVU7c0JBRGhCLEtBQUs7Z0JBZ0JDLGNBQWM7c0JBRHBCLEtBQUs7Z0JBY0MsZUFBZTtzQkFEckIsS0FBSztnQkFrQkMsb0JBQW9CO3NCQUQxQixLQUFLO2dCQU9DLElBQUk7c0JBRFYsV0FBVzt1QkFBQyxXQUFXO2dCQWFqQixFQUFFO3NCQUZSLFdBQVc7dUJBQUMsU0FBUzs7c0JBQ3JCLEtBQUs7Z0JBUUMsU0FBUztzQkFEZixZQUFZO3VCQUFDLCtCQUErQixFQUFFLEVBQUUsSUFBSSxFQUFFLCtCQUErQixFQUFFO2dCQVFqRixxQkFBcUI7c0JBRDNCLFNBQVM7dUJBQUMsdUJBQXVCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBTzdELGNBQWM7c0JBRHZCLFNBQVM7dUJBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBT3ZELGVBQWU7c0JBRHhCLFNBQVM7dUJBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBT3hELGtCQUFrQjtzQkFEM0IsWUFBWTt1QkFBQyx1Q0FBdUMsRUFBRSxFQUFFLElBQUksRUFBRSx1Q0FBdUMsRUFBRTtnQkE4RTdGLElBQUk7c0JBRGQsS0FBSztnQkErREssY0FBYztzQkFEeEIsS0FBSztnQkEwQkssMkJBQTJCO3NCQURyQyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDb21wb25lbnQsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgT25Jbml0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBWaWV3Q2hpbGQsXG4gICAgRG9DaGVjayxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgTmdab25lLFxuICAgIEluamVjdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgSXRlcmFibGVEaWZmZXJzLFxuICAgIFZpZXdDb250YWluZXJSZWYsXG4gICAgT3B0aW9uYWwsXG4gICAgTE9DQUxFX0lELFxuICAgIEFwcGxpY2F0aW9uUmVmLFxuICAgIE5nTW9kdWxlUmVmLFxuICAgIEluamVjdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4VHJlZUdyaWRBUElTZXJ2aWNlIH0gZnJvbSAnLi90cmVlLWdyaWQtYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4R3JpZEJhc2VEaXJlY3RpdmUgfSBmcm9tICcuLi9ncmlkLWJhc2UuZGlyZWN0aXZlJztcbmltcG9ydCB7IElUcmVlR3JpZFJlY29yZCB9IGZyb20gJy4vdHJlZS1ncmlkLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgSVJvd0RhdGFFdmVudEFyZ3MsIElSb3dUb2dnbGVFdmVudEFyZ3MgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7XG4gICAgSGllcmFyY2hpY2FsVHJhbnNhY3Rpb24sXG4gICAgSGllcmFyY2hpY2FsU3RhdGUsXG4gICAgVHJhbnNhY3Rpb25UeXBlLFxuICAgIFRyYW5zYWN0aW9uRXZlbnRPcmlnaW4sXG4gICAgU3RhdGVVcGRhdGVFdmVudFxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2FjdGlvbi90cmFuc2FjdGlvbic7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vZmlsdGVyaW5nL2dyaWQtZmlsdGVyaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4R3JpZFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc3VtbWFyaWVzL2dyaWQtc3VtbWFyeS5zZXJ2aWNlJztcbmltcG9ydCB7IElneEdyaWRTZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IG1lcmdlT2JqZWN0cywgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBmaXJzdCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSWd4Um93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSAnLi90cmVlLWdyaWQuZGlyZWN0aXZlcyc7XG5pbXBvcnQgeyBJZ3hGb3JPZlN5bmNTZXJ2aWNlLCBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9mb3Itb2YvZm9yX29mLnN5bmMuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9ncmlkLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDZWxsVHlwZSwgR3JpZFNlcnZpY2VUeXBlLCBHcmlkVHlwZSwgSUdYX0dSSURfQkFTRSwgSUdYX0dSSURfU0VSVklDRV9CQVNFLCBSb3dUeXBlIH0gZnJvbSAnLi4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElneENvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbHVtbnMvY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hUcmVlR3JpZFNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3RyZWUtZ3JpZC1zZWxlY3Rpb24uc2VydmljZSc7XG5pbXBvcnQgeyBHcmlkSW5zdGFuY2VUeXBlLCBHcmlkU2VsZWN0aW9uTW9kZSB9IGZyb20gJy4uL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBJZ3hTdW1tYXJ5Um93LCBJZ3hUcmVlR3JpZFJvdyB9IGZyb20gJy4uL2dyaWQtcHVibGljLXJvdyc7XG5pbXBvcnQgeyBJZ3hHcmlkQ1JVRFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vY3J1ZC5zZXJ2aWNlJztcbmltcG9ydCB7IElneFRyZWVHcmlkR3JvdXBCeUFyZWFDb21wb25lbnQgfSBmcm9tICcuLi9ncm91cGluZy90cmVlLWdyaWQtZ3JvdXAtYnktYXJlYS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4R3JpZENlbGwgfSBmcm9tICcuLi9ncmlkLXB1YmxpYy1jZWxsJztcbmltcG9ydCB7IElneEhpZXJhcmNoaWNhbFRyYW5zYWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zYWN0aW9uL3RyYW5zYWN0aW9uLWZhY3Rvcnkuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5SZXNpemluZ1NlcnZpY2UgfSBmcm9tICcuLi9yZXNpemluZy9yZXNpemluZy5zZXJ2aWNlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpc3BsYXlEZW5zaXR5VG9rZW4sIElEaXNwbGF5RGVuc2l0eU9wdGlvbnMgfSBmcm9tICcuLi8uLi9jb3JlL2RlbnNpdHknO1xuaW1wb3J0IHsgSGllcmFyY2hpY2FsVHJhbnNhY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdHJhbnNhY3Rpb24vaGllcmFyY2hpY2FsLXRyYW5zYWN0aW9uJztcbmltcG9ydCB7IElneE92ZXJsYXlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvb3ZlcmxheS9vdmVybGF5JztcbmltcG9ydCB7IElneEdyaWRUcmFuc2FjdGlvbiB9IGZyb20gJy4uL2NvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBUcmVlR3JpZEZpbHRlcmluZ1N0cmF0ZWd5IH0gZnJvbSAnLi90cmVlLWdyaWQuZmlsdGVyaW5nLnN0cmF0ZWd5JztcblxubGV0IE5FWFRfSUQgPSAwO1xuXG4vKipcbiAqICoqSWduaXRlIFVJIGZvciBBbmd1bGFyIFRyZWUgR3JpZCoqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9ncmlkL2dyaWQpXG4gKlxuICogVGhlIElnbml0ZSBVSSBUcmVlIEdyaWQgZGlzcGxheXMgYW5kIG1hbmlwdWxhdGVzIGhpZXJhcmNoaWNhbCBkYXRhIHdpdGggY29uc2lzdGVudCBzY2hlbWEgZm9ybWF0dGVkIGFzIGEgdGFibGUgYW5kXG4gKiBwcm92aWRlcyBmZWF0dXJlcyBzdWNoIGFzIHNvcnRpbmcsIGZpbHRlcmluZywgZWRpdGluZywgY29sdW1uIHBpbm5pbmcsIHBhZ2luZywgY29sdW1uIG1vdmluZyBhbmQgaGlkaW5nLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBodG1sXG4gKiA8aWd4LXRyZWUtZ3JpZCBbZGF0YV09XCJlbXBsb3llZURhdGFcIiBwcmltYXJ5S2V5PVwiZW1wbG95ZWVJRFwiIGZvcmVpZ25LZXk9XCJQSURcIiBbYXV0b0dlbmVyYXRlXT1cImZhbHNlXCI+XG4gKiAgIDxpZ3gtY29sdW1uIGZpZWxkPVwiZmlyc3RcIiBoZWFkZXI9XCJGaXJzdCBOYW1lXCI+PC9pZ3gtY29sdW1uPlxuICogICA8aWd4LWNvbHVtbiBmaWVsZD1cImxhc3RcIiBoZWFkZXI9XCJMYXN0IE5hbWVcIj48L2lneC1jb2x1bW4+XG4gKiAgIDxpZ3gtY29sdW1uIGZpZWxkPVwicm9sZVwiIGhlYWRlcj1cIlJvbGVcIj48L2lneC1jb2x1bW4+XG4gKiA8L2lneC10cmVlLWdyaWQ+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgc2VsZWN0b3I6ICdpZ3gtdHJlZS1ncmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RyZWUtZ3JpZC5jb21wb25lbnQuaHRtbCcsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIElneEdyaWRDUlVEU2VydmljZSxcbiAgICAgICAgSWd4R3JpZFN1bW1hcnlTZXJ2aWNlLFxuICAgICAgICBJZ3hHcmlkTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIHsgcHJvdmlkZTogSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsIHVzZUNsYXNzOiBJZ3hUcmVlR3JpZFNlbGVjdGlvblNlcnZpY2UgfSxcbiAgICAgICAgeyBwcm92aWRlOiBJR1hfR1JJRF9TRVJWSUNFX0JBU0UsIHVzZUNsYXNzOiBJZ3hUcmVlR3JpZEFQSVNlcnZpY2UgfSxcbiAgICAgICAgeyBwcm92aWRlOiBJR1hfR1JJRF9CQVNFLCB1c2VFeGlzdGluZzogSWd4VHJlZUdyaWRDb21wb25lbnQgfSxcbiAgICAgICAgSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgSWd4Rm9yT2ZTeW5jU2VydmljZSxcbiAgICAgICAgSWd4Rm9yT2ZTY3JvbGxTeW5jU2VydmljZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUdyaWRDb21wb25lbnQgZXh0ZW5kcyBJZ3hHcmlkQmFzZURpcmVjdGl2ZSBpbXBsZW1lbnRzIEdyaWRUeXBlLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIERvQ2hlY2ssIEFmdGVyQ29udGVudEluaXQge1xuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIGNoaWxkIGRhdGEga2V5IG9mIHRoZSBgSWd4VHJlZUdyaWRDb21wb25lbnRgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWUtZ3JpZCAjZ3JpZCBbZGF0YV09XCJlbXBsb3llZURhdGFcIiBbY2hpbGREYXRhS2V5XT1cIidlbXBsb3llZXMnXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtdHJlZS1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2hpbGREYXRhS2V5O1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgZm9yZWlnbiBrZXkgb2YgdGhlIGBJZ3hUcmVlR3JpZENvbXBvbmVudGAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdHJlZS1ncmlkICNncmlkIFtkYXRhXT1cImVtcGxveWVlRGF0YVwiIFtwcmltYXJ5S2V5XT1cIidlbXBsb3llZUlEJ1wiIFtmb3JlaWduS2V5XT1cIidwYXJlbnRJRCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj5cbiAgICAgKiA8L2lneC10cmVlLWdyaWQ+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4VHJlZUdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmb3JlaWduS2V5O1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUga2V5IGluZGljYXRpbmcgd2hldGhlciBhIHJvdyBoYXMgY2hpbGRyZW4uXG4gICAgICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IHVzZWQgZm9yIGxvYWQgb24gZGVtYW5kIHNjZW5hcmlvcy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlLWdyaWQgI2dyaWQgW2RhdGFdPVwiZW1wbG95ZWVEYXRhXCIgW3ByaW1hcnlLZXldPVwiJ2VtcGxveWVlSUQnXCIgW2ZvcmVpZ25LZXldPVwiJ3BhcmVudElEJ1wiXG4gICAgICogICAgICAgICAgICAgICAgW2xvYWRDaGlsZHJlbk9uRGVtYW5kXT1cImxvYWRDaGlsZHJlblwiXG4gICAgICogICAgICAgICAgICAgICAgW2hhc0NoaWxkcmVuS2V5XT1cIidoYXNFbXBsb3llZXMnXCI+XG4gICAgICogPC9pZ3gtdHJlZS1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGFzQ2hpbGRyZW5LZXk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgaW5kaWNhdGluZyB3aGV0aGVyIGNoaWxkIHJlY29yZHMgc2hvdWxkIGJlIGRlbGV0ZWQgd2hlbiB0aGVpciBwYXJlbnQgZ2V0cyBkZWxldGVkLlxuICAgICAqIEJ5IGRlZmF1bHQgaXQgaXMgc2V0IHRvIHRydWUgYW5kIGRlbGV0ZXMgYWxsIGNoaWxkcmVuIGFsb25nIHdpdGggdGhlIHBhcmVudC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlLWdyaWQgW2RhdGFdPVwiZW1wbG95ZWVEYXRhXCIgW3ByaW1hcnlLZXldPVwiJ2VtcGxveWVlSUQnXCIgW2ZvcmVpZ25LZXldPVwiJ3BhcmVudElEJ1wiIGNhc2NhZGVPbkRlbGV0ZT1cImZhbHNlXCI+XG4gICAgICogPC9pZ3gtdHJlZS1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2FzY2FkZU9uRGVsZXRlID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHByb3ZpZGVzIGEgY2FsbGJhY2sgZm9yIGxvYWRpbmcgY2hpbGQgcm93cyBvbiBkZW1hbmQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdHJlZS1ncmlkIFtkYXRhXT1cImVtcGxveWVlRGF0YVwiIFtwcmltYXJ5S2V5XT1cIidlbXBsb3llZUlEJ1wiIFtmb3JlaWduS2V5XT1cIidwYXJlbnRJRCdcIiBbbG9hZENoaWxkcmVuT25EZW1hbmRdPVwibG9hZENoaWxkcmVuXCI+XG4gICAgICogPC9pZ3gtdHJlZS1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgbG9hZENoaWxkcmVuID0gKHBhcmVudElEOiBhbnksIGRvbmU6IChjaGlsZHJlbjogYW55W10pID0+IHZvaWQpID0+IHtcbiAgICAgKiAgICAgdGhpcy5kYXRhU2VydmljZS5nZXREYXRhKHBhcmVudElELCBjaGlsZHJlbiA9PiBkb25lKGNoaWxkcmVuKSk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbG9hZENoaWxkcmVuT25EZW1hbmQ6IChwYXJlbnRJRDogYW55LCBkb25lOiAoY2hpbGRyZW46IGFueVtdKSA9PiB2b2lkKSA9PiB2b2lkO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIHJvbGUgPSAndHJlZWdyaWQnO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBpZGAgYXR0cmlidXRlLiBJZiBub3QgcHJvdmlkZWQgaXQgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlLWdyaWQgW2lkXT1cIidpZ3gtdHJlZS1ncmlkLTEnXCI+PC9pZ3gtdHJlZS1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtdHJlZS1ncmlkLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hUcmVlR3JpZEdyb3VwQnlBcmVhQ29tcG9uZW50LCB7IHJlYWQ6IElneFRyZWVHcmlkR3JvdXBCeUFyZWFDb21wb25lbnQgfSlcbiAgICBwdWJsaWMgZ3JvdXBBcmVhO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RyYWdJbmRpY2F0b3JJY29uQmFzZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBkcmFnSW5kaWNhdG9ySWNvbkJhc2U6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3JlY29yZF90ZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCByZWNvcmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnc3VtbWFyeV90ZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBzdW1tYXJ5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hSb3dMb2FkaW5nSW5kaWNhdG9yVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogSWd4Um93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlRGlyZWN0aXZlIH0pXG4gICAgcHJvdGVjdGVkIHJvd0xvYWRpbmdUZW1wbGF0ZTogSWd4Um93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlRGlyZWN0aXZlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBmbGF0RGF0YTogYW55W10gfCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBwcm9jZXNzZWRFeHBhbmRlZEZsYXREYXRhOiBhbnlbXSB8IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByb290IGxldmVsIGBJVHJlZUdyaWRSZWNvcmRgcy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0cyB0aGUgcm9vdCByZWNvcmQgd2l0aCBpbmRleD0yXG4gICAgICogY29uc3Qgc3RhdGVzID0gdGhpcy5ncmlkLnJvb3RSZWNvcmRzWzJdO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHJvb3RSZWNvcmRzOiBJVHJlZUdyaWRSZWNvcmRbXTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBtYXAgb2YgYWxsIGBJVHJlZUdyaWRSZWNvcmRgcy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0cyB0aGUgcmVjb3JkIHdpdGggcHJpbWFyeUtleT0yXG4gICAgICogY29uc3Qgc3RhdGVzID0gdGhpcy5ncmlkLnJlY29yZHMuZ2V0KDIpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHJlY29yZHM6IE1hcDxhbnksIElUcmVlR3JpZFJlY29yZD4gPSBuZXcgTWFwPGFueSwgSVRyZWVHcmlkUmVjb3JkPigpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBwcm9jZXNzZWQgKGZpbHRlcmVkIGFuZCBzb3J0ZWQpIHJvb3QgYElUcmVlR3JpZFJlY29yZGBzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRzIHRoZSBwcm9jZXNzZWQgcm9vdCByZWNvcmQgd2l0aCBpbmRleD0yXG4gICAgICogY29uc3Qgc3RhdGVzID0gdGhpcy5ncmlkLnByb2Nlc3NlZFJvb3RSZWNvcmRzWzJdO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHByb2Nlc3NlZFJvb3RSZWNvcmRzOiBJVHJlZUdyaWRSZWNvcmRbXTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBtYXAgb2YgYWxsIHByb2Nlc3NlZCAoZmlsdGVyZWQgYW5kIHNvcnRlZCkgYElUcmVlR3JpZFJlY29yZGBzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRzIHRoZSBwcm9jZXNzZWQgcmVjb3JkIHdpdGggcHJpbWFyeUtleT0yXG4gICAgICogY29uc3Qgc3RhdGVzID0gdGhpcy5ncmlkLnByb2Nlc3NlZFJlY29yZHMuZ2V0KDIpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHByb2Nlc3NlZFJlY29yZHM6IE1hcDxhbnksIElUcmVlR3JpZFJlY29yZD4gPSBuZXcgTWFwPGFueSwgSVRyZWVHcmlkUmVjb3JkPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkaW5nUm93cyA9IG5ldyBTZXQ8YW55PigpO1xuXG4gICAgcHJvdGVjdGVkIF9maWx0ZXJTdHJhdGVneSA9IG5ldyBUcmVlR3JpZEZpbHRlcmluZ1N0cmF0ZWd5KCk7XG4gICAgcHJvdGVjdGVkIF90cmFuc2FjdGlvbnM6IEhpZXJhcmNoaWNhbFRyYW5zYWN0aW9uU2VydmljZTxIaWVyYXJjaGljYWxUcmFuc2FjdGlvbiwgSGllcmFyY2hpY2FsU3RhdGU+O1xuICAgIHByaXZhdGUgX2RhdGE7XG4gICAgcHJpdmF0ZSBfcm93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIHByaXZhdGUgX2V4cGFuc2lvbkRlcHRoID0gSW5maW5pdHk7XG4gICAgcHJpdmF0ZSBfZmlsdGVyZWREYXRhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IGxldHMgeW91IGZpbGwgdGhlIGBJZ3hUcmVlR3JpZENvbXBvbmVudGAgd2l0aCBhbiBhcnJheSBvZiBkYXRhLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWUtZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtdHJlZS1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55W10gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBkYXRhKHZhbHVlOiBhbnlbXSB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHZhbHVlIHx8IFtdO1xuICAgICAgICB0aGlzLnN1bW1hcnlTZXJ2aWNlLmNsZWFyU3VtbWFyeUNhY2hlKCk7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZEdlbmVyYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBjb250YWluaW5nIHRoZSBmaWx0ZXJlZCBkYXRhIGluIHRoZSBgSWd4R3JpZENvbXBvbmVudGAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLmdyaWQuZmlsdGVyZWREYXRhO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBmaWx0ZXJlZERhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWx0ZXJlZERhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIGZpbHRlcmVkIGRhdGEgaW4gdGhlIGBJZ3hHcmlkQ29tcG9uZW50YC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmZpbHRlcmVkRGF0YSA9IFt7XG4gICAgICogICAgICAgSUQ6IDEsXG4gICAgICogICAgICAgTmFtZTogXCJBXCJcbiAgICAgKiB9XTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hUcmVlR3JpZENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgZmlsdGVyZWREYXRhKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2ZpbHRlcmVkRGF0YSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0cmFuc2FjdGlvbnMgc2VydmljZSBmb3IgdGhlIGdyaWQuXG4gICAgICpcbiAgICAgKiBAZXhwZXJpbWVudGFsIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRyYW5zYWN0aW9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RpVHJhbnNhY3Rpb25zICYmICF0aGlzLmJhdGNoRWRpdGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RpVHJhbnNhY3Rpb25zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2FjdGlvbnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgY291bnQgb2YgbGV2ZWxzIHRvIGJlIGV4cGFuZGVkIGluIHRoZSBgSWd4VHJlZUdyaWRDb21wb25lbnRgLiBCeSBkZWZhdWx0IGl0IGlzXG4gICAgICogc2V0IHRvIGBJbmZpbml0eWAgd2hpY2ggbWVhbnMgYWxsIGxldmVscyB3b3VsZCBiZSBleHBhbmRlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlLWdyaWQgI2dyaWQgW2RhdGFdPVwiZW1wbG95ZWVEYXRhXCIgW2NoaWxkRGF0YUtleV09XCInZW1wbG95ZWVzJ1wiIGV4cGFuc2lvbkRlcHRoPVwiMVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LXRyZWUtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hUcmVlR3JpZENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBleHBhbnNpb25EZXB0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5zaW9uRGVwdGg7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBleHBhbnNpb25EZXB0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2V4cGFuc2lvbkRlcHRoID0gdmFsdWU7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHByb3ZpZGVzIGEgdGVtcGxhdGUgZm9yIHRoZSByb3cgbG9hZGluZyBpbmRpY2F0b3Igd2hlbiBsb2FkIG9uIGRlbWFuZCBpcyBlbmFibGVkLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8bmctdGVtcGxhdGUgI3Jvd0xvYWRpbmdUZW1wbGF0ZT5cbiAgICAgKiAgICAgPGlneC1pY29uPmxvb3A8L2lneC1pY29uPlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICpcbiAgICAgKiA8aWd4LXRyZWUtZ3JpZCAjZ3JpZCBbZGF0YV09XCJlbXBsb3llZURhdGFcIiBbcHJpbWFyeUtleV09XCInSUQnXCIgW2ZvcmVpZ25LZXldPVwiJ3BhcmVudElEJ1wiXG4gICAgICogICAgICAgICAgICAgICAgW2xvYWRDaGlsZHJlbk9uRGVtYW5kXT1cImxvYWRDaGlsZHJlblwiXG4gICAgICogICAgICAgICAgICAgICAgW3Jvd0xvYWRpbmdJbmRpY2F0b3JUZW1wbGF0ZV09XCJyb3dMb2FkaW5nVGVtcGxhdGVcIj5cbiAgICAgKiA8L2lneC10cmVlLWdyaWQ+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4VHJlZUdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgcm93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcm93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlKHZhbHVlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX3Jvd0xvYWRpbmdJbmRpY2F0b3JUZW1wbGF0ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvLyBLaW5kIG9mIHN0dXBpZFxuICAgIC8vIHByaXZhdGUgZ2V0IF9ncmlkQVBJKCk6IElneFRyZWVHcmlkQVBJU2VydmljZSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmdyaWRBUEkgYXMgSWd4VHJlZUdyaWRBUElTZXJ2aWNlO1xuICAgIC8vIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBjb2xSZXNpemluZ1NlcnZpY2U6IElneENvbHVtblJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9TRVJWSUNFX0JBU0UpIHB1YmxpYyBncmlkQVBJOiBHcmlkU2VydmljZVR5cGUsXG4gICAgICAgIC8vIHB1YmxpYyBncmlkQVBJOiBHcmlkQmFzZUFQSVNlcnZpY2U8SWd4R3JpZEJhc2VEaXJlY3RpdmUgJiBHcmlkVHlwZT4sXG4gICAgICAgIHByb3RlY3RlZCB0cmFuc2FjdGlvbkZhY3Rvcnk6IElneEhpZXJhcmNoaWNhbFRyYW5zYWN0aW9uRmFjdG9yeSxcbiAgICAgICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBfem9uZTogTmdab25lLFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwdWJsaWMgZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICBwcm90ZWN0ZWQgZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgICAgICBwcm90ZWN0ZWQgdmlld1JlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICAgICAgbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LFxuICAgICAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAgIHB1YmxpYyBuYXZpZ2F0aW9uOiBJZ3hHcmlkTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBmaWx0ZXJpbmdTZXJ2aWNlOiBJZ3hGaWx0ZXJpbmdTZXJ2aWNlLFxuICAgICAgICBASW5qZWN0KElneE92ZXJsYXlTZXJ2aWNlKSBwcm90ZWN0ZWQgb3ZlcmxheVNlcnZpY2U6IElneE92ZXJsYXlTZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgc3VtbWFyeVNlcnZpY2U6IElneEdyaWRTdW1tYXJ5U2VydmljZSxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9uczogSURpc3BsYXlEZW5zaXR5T3B0aW9ucyxcbiAgICAgICAgQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZUlkOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwbGF0Zm9ybTogUGxhdGZvcm1VdGlsLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KElneEdyaWRUcmFuc2FjdGlvbikgcHJvdGVjdGVkIF9kaVRyYW5zYWN0aW9ucz86XG4gICAgICAgICAgICBIaWVyYXJjaGljYWxUcmFuc2FjdGlvblNlcnZpY2U8SGllcmFyY2hpY2FsVHJhbnNhY3Rpb24sIEhpZXJhcmNoaWNhbFN0YXRlPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoc2VsZWN0aW9uU2VydmljZSwgY29sUmVzaXppbmdTZXJ2aWNlLCBncmlkQVBJLCB0cmFuc2FjdGlvbkZhY3RvcnksXG4gICAgICAgICAgICBfZWxlbWVudFJlZiwgX3pvbmUsIGRvY3VtZW50LCBjZHIsIHJlc29sdmVyLCBkaWZmZXJzLCB2aWV3UmVmLCBhcHBSZWYsIG1vZHVsZVJlZiwgaW5qZWN0b3IsIG5hdmlnYXRpb24sXG4gICAgICAgICAgICBmaWx0ZXJpbmdTZXJ2aWNlLCBvdmVybGF5U2VydmljZSwgc3VtbWFyeVNlcnZpY2UsIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnMsIGxvY2FsZUlkLCBwbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSBgZ2V0Q2VsbEJ5Q29sdW1uYCBvciBgZ2V0Q2VsbEJ5S2V5YCBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGEgYENlbGxUeXBlYCBvYmplY3QgdGhhdCBtYXRjaGVzIHRoZSBjb25kaXRpb25zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlDZWxsID0gdGhpcy5ncmlkMS5nZXRDZWxsQnlDb2x1bW5WaXNpYmxlSW5kZXgoMixcIlVuaXRQcmljZVwiKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93SW5kZXhcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q2VsbEJ5Q29sdW1uVmlzaWJsZUluZGV4KHJvd0luZGV4OiBudW1iZXIsIGluZGV4OiBudW1iZXIpOiBDZWxsVHlwZSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93QnlJbmRleChyb3dJbmRleCk7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHRoaXMuY29sdW1uTGlzdC5maW5kKChjb2wpID0+IGNvbC52aXNpYmxlSW5kZXggPT09IGluZGV4KTtcbiAgICAgICAgaWYgKHJvdyAmJiByb3cgaW5zdGFuY2VvZiBJZ3hUcmVlR3JpZFJvdyAmJiBjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSWd4R3JpZENlbGwodGhpcyBhcyBhbnksIHJvd0luZGV4LCBjb2x1bW4uZmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgICAgICB0aGlzLnJvd1RvZ2dsZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChhcmdzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRDaGlsZHJlbk9uUm93RXhwYW5zaW9uKGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUT0RPOiBjYXNjYWRlIHNlbGVjdGlvbiBsb2dpYyBzaG91bGQgYmUgcmVmYWN0b3IgdG8gYmUgaGFuZGxlZCBpbiB0aGUgYWxyZWFkeSBleGlzdGluZyBzdWJzXG4gICAgICAgIHRoaXMucm93QWRkZWROb3RpZmllci5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKGFyZ3MgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucm93U2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZUNhc2NhZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVjID0gdGhpcy5ncmlkQVBJLmdldF9yZWNfYnlfaWQodGhpcy5wcmltYXJ5S2V5ID8gYXJncy5kYXRhW3RoaXMucHJpbWFyeUtleV0gOiBhcmdzLmRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChyZWMgJiYgcmVjLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWRBUEkuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLnVwZGF0ZUNhc2NhZGVTZWxlY3Rpb25PbkZpbHRlckFuZENSVUQoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU2V0KFtyZWMucGFyZW50XSksIHJlYy5wYXJlbnQua2V5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVjb3JkIGlzIHN0aWxsIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGNoYW5nZSBkZXRlY3Rpb24gdG8gdXBkYXRlIHJlY29yZHMgdGhyb3VnaCBwaXBlc1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjID0gdGhpcy5ncmlkQVBJLmdldF9yZWNfYnlfaWQodGhpcy5wcmltYXJ5S2V5ID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzLmRhdGFbdGhpcy5wcmltYXJ5S2V5XSA6IGFyZ3MuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjICYmIHJlYy5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWRBUEkuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLnVwZGF0ZUNhc2NhZGVTZWxlY3Rpb25PbkZpbHRlckFuZENSVUQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTZXQoW3JlYy5wYXJlbnRdKSwgcmVjLnBhcmVudC5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yb3dEZWxldGVkTm90aWZpZXIucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShhcmdzID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvd1NlbGVjdGlvbiA9PT0gR3JpZFNlbGVjdGlvbk1vZGUubXVsdGlwbGVDYXNjYWRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWMgPSB0aGlzLmdyaWRBUEkuZ2V0X3JlY19ieV9pZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbWFyeUtleSA/IGFyZ3MuZGF0YVt0aGlzLnByaW1hcnlLZXldIDogYXJncy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDYXNjYWRlU2VsZWN0aW9uKGFyZ3MsIHJlYyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYSByb3cgaGFzIGJlZW4gYWRkZWQgYW5kIGJlZm9yZSBjb21taXRpbmcgdGhlIHRyYW5zYWN0aW9uIGRlbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVhZlJvd3NEaXJlY3RQYXJlbnRzID0gbmV3IFNldDxhbnk+KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3JkICYmICghcmVjb3JkLmNoaWxkcmVuIHx8IHJlY29yZC5jaGlsZHJlbi5sZW5ndGggPT09IDApICYmIHJlY29yZC5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWFmUm93c0RpcmVjdFBhcmVudHMuYWRkKHJlY29yZC5wYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGNoYW5nZSBkZXRlY3Rpb24gdG8gdXBkYXRlIHJlY29yZHMgdGhyb3VnaCBwaXBlc1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkQVBJLmdyaWQuc2VsZWN0aW9uU2VydmljZS51cGRhdGVDYXNjYWRlU2VsZWN0aW9uT25GaWx0ZXJBbmRDUlVEKGxlYWZSb3dzRGlyZWN0UGFyZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZpbHRlcmluZ0RvbmUucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5yb3dTZWxlY3Rpb24gPT09IEdyaWRTZWxlY3Rpb25Nb2RlLm11bHRpcGxlQ2FzY2FkZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlYWZSb3dzRGlyZWN0UGFyZW50cyA9IG5ldyBTZXQ8YW55PigpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQgJiYgKCFyZWNvcmQuY2hpbGRyZW4gfHwgcmVjb3JkLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkgJiYgcmVjb3JkLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVhZlJvd3NEaXJlY3RQYXJlbnRzLmFkZChyZWNvcmQucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5ncmlkLnNlbGVjdGlvblNlcnZpY2UudXBkYXRlQ2FzY2FkZVNlbGVjdGlvbk9uRmlsdGVyQW5kQ1JVRChsZWFmUm93c0RpcmVjdFBhcmVudHMpO1xuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdEb0NoZWNrKCkge1xuICAgICAgICBzdXBlci5uZ0RvQ2hlY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgICAgIC8vIFRPRE86IHBpcGVzRXhlY3R1cmVkIGV2ZW50XG4gICAgICAgIC8vIHJ1biBhZnRlciBjaGFuZ2UgZGV0ZWN0aW9uIGluIHN1cGVyIHRyaWdnZXJzIHBpcGVzIGZvciByZWNvcmRzIHN0cnVjdHVyZVxuICAgICAgICBpZiAodGhpcy5yb3dTZWxlY3Rpb24gPT09IEdyaWRTZWxlY3Rpb25Nb2RlLm11bHRpcGxlQ2FzY2FkZSAmJiB0aGlzLnNlbGVjdGVkUm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbFJvd3MgPSB0aGlzLnNlbGVjdGVkUm93cztcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5jbGVhclJvd1NlbGVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RSb3dzKHNlbFJvd3MsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnJvd0xvYWRpbmdUZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fcm93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlID0gdGhpcy5yb3dMb2FkaW5nVGVtcGxhdGUudGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERlZmF1bHRFeHBhbmRTdGF0ZShyZWNvcmQ6IElUcmVlR3JpZFJlY29yZCkge1xuICAgICAgICByZXR1cm4gcmVjb3JkLmNoaWxkcmVuICYmIHJlY29yZC5jaGlsZHJlbi5sZW5ndGggJiYgcmVjb3JkLmxldmVsIDwgdGhpcy5leHBhbnNpb25EZXB0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHBhbmRzIGFsbCByb3dzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuZXhwYW5kQWxsKCk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4VHJlZUdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwYW5kQWxsKCkge1xuICAgICAgICB0aGlzLl9leHBhbnNpb25EZXB0aCA9IEluZmluaXR5O1xuICAgICAgICB0aGlzLmV4cGFuc2lvblN0YXRlcyA9IG5ldyBNYXA8YW55LCBib29sZWFuPigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbGxhcHNlcyBhbGwgcm93cy5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuY29sbGFwc2VBbGwoKTtcbiAgICAgKiAgYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4VHJlZUdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgY29sbGFwc2VBbGwoKSB7XG4gICAgICAgIHRoaXMuX2V4cGFuc2lvbkRlcHRoID0gMDtcbiAgICAgICAgdGhpcy5leHBhbnNpb25TdGF0ZXMgPSBuZXcgTWFwPGFueSwgYm9vbGVhbj4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJlZnJlc2hHcmlkU3RhdGUoYXJncz86IElSb3dEYXRhRXZlbnRBcmdzKSB7XG4gICAgICAgIHN1cGVyLnJlZnJlc2hHcmlkU3RhdGUoKTtcbiAgICAgICAgaWYgKHRoaXMucHJpbWFyeUtleSAmJiB0aGlzLmZvcmVpZ25LZXkgJiYgYXJncykge1xuICAgICAgICAgICAgY29uc3Qgcm93SUQgPSBhcmdzLmRhdGFbdGhpcy5mb3JlaWduS2V5XTtcbiAgICAgICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoeyByb3dJRCB9KTtcbiAgICAgICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBgSWd4VHJlZUdyaWRSb3dDb21wb25lbnRgIHdpdGggdGhlIGdpdmVuIGRhdGEuIElmIGEgcGFyZW50Um93SUQgaXMgbm90IHNwZWNpZmllZCwgdGhlIG5ld2x5IGNyZWF0ZWRcbiAgICAgKiByb3cgd291bGQgYmUgYWRkZWQgYXQgdGhlIHJvb3QgbGV2ZWwuIE90aGVyd2lzZSwgaXQgd291bGQgYmUgYWRkZWQgYXMgYSBjaGlsZCBvZiB0aGUgcm93IHdob3NlIHByaW1hcnlLZXkgbWF0Y2hlc1xuICAgICAqIHRoZSBzcGVjaWZpZWQgcGFyZW50Um93SUQuIElmIHRoZSBwYXJlbnRSb3dJRCBkb2VzIG5vdCBleGlzdCwgYW4gZXJyb3Igd291bGQgYmUgdGhyb3duLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCByZWNvcmQgPSB7XG4gICAgICogICAgIElEOiB0aGlzLmdyaWQuZGF0YVt0aGlzLmdyaWQxLmRhdGEubGVuZ3RoIC0gMV0uSUQgKyAxLFxuICAgICAqICAgICBOYW1lOiB0aGlzLm5ld1JlY29yZFxuICAgICAqIH07XG4gICAgICogdGhpcy5ncmlkLmFkZFJvdyhyZWNvcmQsIDEpOyAvLyBBZGRzIGEgbmV3IGNoaWxkIHJvdyB0byB0aGUgcm93IHdpdGggSUQ9MS5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFJvd0lEXG4gICAgICogQG1lbWJlcm9mIElneFRyZWVHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgLy8gVE9ETzogcmVtb3ZlIGV2dCBlbWlzc2lvblxuICAgIHB1YmxpYyBhZGRSb3coZGF0YTogYW55LCBwYXJlbnRSb3dJRD86IGFueSkge1xuICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZ3JpZEFQSS5hZGRSb3dUb0RhdGEoZGF0YSwgcGFyZW50Um93SUQpO1xuXG4gICAgICAgIHRoaXMucm93QWRkZWROb3RpZmllci5uZXh0KHsgZGF0YSB9KTtcbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbnRlcnMgYWRkIG1vZGUgYnkgc3Bhd25pbmcgdGhlIFVJIHdpdGggdGhlIGNvbnRleHQgb2YgdGhlIHNwZWNpZmllZCByb3cgYnkgaW5kZXguXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEFjY2VwdGVkIHZhbHVlcyBmb3IgaW5kZXggYXJlIGludGVnZXJzIGZyb20gMCB0byB0aGlzLmdyaWQuZGF0YVZpZXcubGVuZ3RoXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBXaGVuIGFkZGluZyB0aGUgcm93IGFzIGEgY2hpbGQsIHRoZSBwYXJlbnQgcm93IGlzIHRoZSBzcGVjaWZpZWQgcm93LlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVG8gc3Bhd24gdGhlIFVJIG9uIHRvcCwgY2FsbCB0aGUgZnVuY3Rpb24gd2l0aCBpbmRleCA9IG51bGwgb3IgYSBuZWdhdGl2ZSBudW1iZXIuXG4gICAgICogSW4gdGhpcyBjYXNlIHRyeWluZyB0byBhZGQgdGhpcyByb3cgYXMgYSBjaGlsZCB3aWxsIHJlc3VsdCBpbiBlcnJvci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuYmVnaW5BZGRSb3dCeUluZGV4KDEwKTtcbiAgICAgKiB0aGlzLmdyaWQuYmVnaW5BZGRSb3dCeUluZGV4KDEwLCB0cnVlKTtcbiAgICAgKiB0aGlzLmdyaWQuYmVnaW5BZGRSb3dCeUluZGV4KG51bGwpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBpbmRleCAtIFRoZSBpbmRleCB0byBzcGF3biB0aGUgVUkgYXQuIEFjY2VwdHMgaW50ZWdlcnMgZnJvbSAwIHRvIHRoaXMuZ3JpZC5kYXRhVmlldy5sZW5ndGhcbiAgICAgKiBAcGFyYW0gYXNDaGlsZCAtIFdoZXRoZXIgdGhlIHJlY29yZCBzaG91bGQgYmUgYWRkZWQgYXMgYSBjaGlsZC4gT25seSBhcHBsaWNhYmxlIHRvIGlneFRyZWVHcmlkLlxuICAgICAqL1xuICAgIHB1YmxpYyBiZWdpbkFkZFJvd0J5SW5kZXgoaW5kZXg6IG51bWJlciwgYXNDaGlsZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSBudWxsIHx8IGluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmVnaW5BZGRSb3dCeUlkKG51bGwsIGFzQ2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRSb3dGb3JJbmRleChpbmRleCAtIDEsIGFzQ2hpbGQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29udGV4dChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIsIHBpbm5lZD86IGJvb2xlYW4pOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGltcGxpY2l0OiB0aGlzLmlzR2hvc3RSZWNvcmQocm93RGF0YSkgPyByb3dEYXRhLnJlY29yZFJlZiA6IHJvd0RhdGEsXG4gICAgICAgICAgICBpbmRleDogdGhpcy5nZXREYXRhVmlld0luZGV4KHJvd0luZGV4LCBwaW5uZWQpLFxuICAgICAgICAgICAgdGVtcGxhdGVJRDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuaXNTdW1tYXJ5Um93KHJvd0RhdGEpID8gJ3N1bW1hcnlSb3cnIDogJ2RhdGFSb3cnLFxuICAgICAgICAgICAgICAgIGlkOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNHaG9zdFJlY29yZChyb3dEYXRhKSA/IHJvd0RhdGEucmVjb3JkUmVmLmlzRmlsdGVyZWRPdXRQYXJlbnQgPT09IHVuZGVmaW5lZCA6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbml0aWFsUGlubmVkSW5kZXgocmVjKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5ncmlkQVBJLmdldF9yb3dfaWQocmVjKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bpbm5lZFJlY29yZElEcy5pbmRleE9mKGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGlzUmVjb3JkUGlubmVkKHJlYykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbml0aWFsUGlubmVkSW5kZXgocmVjLmRhdGEpICE9PSAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTZWxlY3RlZERhdGEoZm9ybWF0dGVycyA9IGZhbHNlLCBoZWFkZXJzID0gZmFsc2UpOiBhbnlbXSB7XG4gICAgICAgIGxldCBzb3VyY2UgPSBbXTtcblxuICAgICAgICBjb25zdCBwcm9jZXNzID0gKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlY29yZC5zdW1tYXJpZXMpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UucHVzaChudWxsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzb3VyY2UucHVzaChyZWNvcmQuZGF0YSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy51bnBpbm5lZERhdGFWaWV3LmZvckVhY2gocHJvY2Vzcyk7XG4gICAgICAgIHNvdXJjZSA9IHRoaXMuaXNSb3dQaW5uaW5nVG9Ub3AgPyBbLi4udGhpcy5waW5uZWREYXRhVmlldywgLi4uc291cmNlXSA6IFsuLi5zb3VyY2UsIC4uLnRoaXMucGlubmVkRGF0YVZpZXddO1xuICAgICAgICByZXR1cm4gdGhpcy5leHRyYWN0RGF0YUZyb21TZWxlY3Rpb24oc291cmNlLCBmb3JtYXR0ZXJzLCBoZWFkZXJzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRFbXB0eVJlY29yZE9iamVjdEZvcihpblRyZWVSb3c6IFJvd1R5cGUpIHtcbiAgICAgICAgY29uc3QgdHJlZVJvd1JlYyA9IGluVHJlZVJvdz8udHJlZVJvdyB8fCBudWxsO1xuICAgICAgICBjb25zdCByb3cgPSB7IC4uLnRyZWVSb3dSZWMgfTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRyZWVSb3dSZWM/LmRhdGEgfHwge307XG4gICAgICAgIHJvdy5kYXRhID0geyAuLi5kYXRhIH07XG4gICAgICAgIE9iamVjdC5rZXlzKHJvdy5kYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAvLyBwZXJzaXN0IGZvcmVpZ24ga2V5IGlmIG9uZSBpcyBzZXQuXG4gICAgICAgICAgICBpZiAodGhpcy5mb3JlaWduS2V5ICYmIGtleSA9PT0gdGhpcy5mb3JlaWduS2V5KSB7XG4gICAgICAgICAgICAgICAgcm93LmRhdGFba2V5XSA9IHRyZWVSb3dSZWMuZGF0YVtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3cuZGF0YVtrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5nZW5lcmF0ZVJvd0lEKCk7XG4gICAgICAgIGNvbnN0IHJvb3RSZWNQSyA9IHRoaXMuZm9yZWlnbktleSAmJiB0aGlzLnJvb3RSZWNvcmRzICYmIHRoaXMucm9vdFJlY29yZHMubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICB0aGlzLnJvb3RSZWNvcmRzWzBdLmRhdGFbdGhpcy5mb3JlaWduS2V5XSA6IG51bGw7XG4gICAgICAgIGlmIChpZCA9PT0gcm9vdFJlY1BLKSB7XG4gICAgICAgICAgICAvLyBzYWZlZ3VhcmQgaW4gY2FzZSBnZW5lcmF0ZWQgaWQgbWF0Y2hlcyB0aGUgcm9vdCBmb3JlaWduIGtleS5cbiAgICAgICAgICAgIGlkID0gdGhpcy5nZW5lcmF0ZVJvd0lEKCk7XG4gICAgICAgIH1cbiAgICAgICAgcm93LmtleSA9IGlkO1xuICAgICAgICByb3cuZGF0YVt0aGlzLnByaW1hcnlLZXldID0gaWQ7XG4gICAgICAgIHJldHVybiB7IHJvd0lEOiBpZCwgZGF0YTogcm93LmRhdGEsIHJlY29yZFJlZjogcm93IH07XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgZGVsZXRlUm93QnlJZChyb3dJZDogYW55KTogYW55IHtcbiAgICAgICAgLy8gIGlmIHRoaXMgaXMgZmxhdCBzZWxmLXJlZmVyZW5jaW5nIGRhdGEsIGFuZCBDYXNjYWRlT25EZWxldGUgaXMgc2V0IHRvIHRydWVcbiAgICAgICAgLy8gIGFuZCBpZiB3ZSBoYXZlIHRyYW5zYWN0aW9ucyB3ZSBzaG91bGQgc3RhcnQgcGVuZGluZyB0cmFuc2FjdGlvbi4gVGhpcyBhbGxvd3NcbiAgICAgICAgLy8gIHVzIGluIGNhc2Ugb2YgZGVsZXRlIGFjdGlvbiB0byBkZWxldGUgYWxsIGNoaWxkIHJvd3MgYXMgc2luZ2xlIHVuZG8gYWN0aW9uXG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRBUEkuZGVsZXRlUm93QnlJZChyb3dJZCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBgSWd4VHJlZUdyaWRSb3dgIGJ5IGluZGV4LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlSb3cgPSB0cmVlR3JpZC5nZXRSb3dCeUluZGV4KDEpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSb3dCeUluZGV4KGluZGV4OiBudW1iZXIpOiBSb3dUeXBlIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmRhdGFWaWV3Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVSb3coaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGBSb3dUeXBlYCBvYmplY3QgYnkgdGhlIHNwZWNpZmllZCBwcmltYXJ5IGtleS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Um93ID0gdGhpcy50cmVlR3JpZC5nZXRSb3dCeUluZGV4KDEpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSb3dCeUtleShrZXk6IGFueSk6IFJvd1R5cGUge1xuICAgICAgICBjb25zdCByZWMgPSB0aGlzLmZpbHRlcmVkU29ydGVkRGF0YSA/IHRoaXMucHJpbWFyeUtleSA/IHRoaXMuZmlsdGVyZWRTb3J0ZWREYXRhLmZpbmQociA9PiByW3RoaXMucHJpbWFyeUtleV0gPT09IGtleSkgOlxuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFNvcnRlZERhdGEuZmluZChyID0+IHIgPT09IGtleSkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kYXRhVmlldy5maW5kSW5kZXgociA9PiByLmRhdGEgJiYgci5kYXRhID09PSByZWMpO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuZmlsdGVyZWRTb3J0ZWREYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IElneFRyZWVHcmlkUm93KHRoaXMgYXMgYW55LCBpbmRleCwgcmVjKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjb2xsZWN0aW9uIG9mIGFsbCBSb3dUeXBlIGZvciBjdXJyZW50IHBhZ2UuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBhbGxSb3dzKCk6IFJvd1R5cGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFWaWV3Lm1hcCgocmVjLCBpbmRleCkgPT4gdGhpcy5jcmVhdGVSb3coaW5kZXgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjb2xsZWN0aW9uIG9mIGBJZ3hUcmVlR3JpZFJvd2BzIGZvciBjdXJyZW50IHBhZ2UuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhUm93cygpOiBSb3dUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGxSb3dzKCkuZmlsdGVyKHJvdyA9PiByb3cgaW5zdGFuY2VvZiBJZ3hUcmVlR3JpZFJvdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgc2VsZWN0ZWQgYElneEdyaWRDZWxsYHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBzZWxlY3RlZENlbGxzID0gdGhpcy5ncmlkLnNlbGVjdGVkQ2VsbHM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBzZWxlY3RlZENlbGxzKCk6IENlbGxUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhUm93cygpLm1hcCgocm93KSA9PiByb3cuY2VsbHMuZmlsdGVyKChjZWxsKSA9PiBjZWxsLnNlbGVjdGVkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGBDZWxsVHlwZWAgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q2VsbCA9IHRoaXMuZ3JpZDEuZ2V0Q2VsbEJ5Q29sdW1uKDIsIFwiVW5pdFByaWNlXCIpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByb3dJbmRleFxuICAgICAqIEBwYXJhbSBjb2x1bW5GaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDZWxsQnlDb2x1bW4ocm93SW5kZXg6IG51bWJlciwgY29sdW1uRmllbGQ6IHN0cmluZyk6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3dCeUluZGV4KHJvd0luZGV4KTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdGhpcy5jb2x1bW5MaXN0LmZpbmQoKGNvbCkgPT4gY29sLmZpZWxkID09PSBjb2x1bW5GaWVsZCk7XG4gICAgICAgIGlmIChyb3cgJiYgcm93IGluc3RhbmNlb2YgSWd4VHJlZUdyaWRSb3cgJiYgY29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IElneEdyaWRDZWxsKHRoaXMgYXMgYW55LCByb3dJbmRleCwgY29sdW1uRmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGBDZWxsVHlwZWAgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmVxdWlyZXMgdGhhdCB0aGUgcHJpbWFyeUtleSBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogZ3JpZC5nZXRDZWxsQnlLZXkoMSwgJ2luZGV4Jyk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHJvd1NlbGVjdG9yIG1hdGNoIGFueSByb3dJRFxuICAgICAqIEBwYXJhbSBjb2x1bW5GaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDZWxsQnlLZXkocm93U2VsZWN0b3I6IGFueSwgY29sdW1uRmllbGQ6IHN0cmluZyk6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3dCeUtleShyb3dTZWxlY3Rvcik7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHRoaXMuY29sdW1uTGlzdC5maW5kKChjb2wpID0+IGNvbC5maWVsZCA9PT0gY29sdW1uRmllbGQpO1xuICAgICAgICBpZiAocm93ICYmIGNvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZ3hHcmlkQ2VsbCh0aGlzIGFzIGFueSwgcm93LmluZGV4LCBjb2x1bW5GaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGluUm93KHJvd0lEOiBhbnksIGluZGV4PzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93QnlLZXkocm93SUQpO1xuICAgICAgICByZXR1cm4gc3VwZXIucGluUm93KHJvd0lELCBpbmRleCwgcm93KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5waW5Sb3cocm93SUQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd0J5S2V5KHJvd0lEKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnVucGluUm93KHJvd0lELCByb3cpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdlbmVyYXRlUm93UGF0aChyb3dJZDogYW55KTogYW55W10ge1xuICAgICAgICBjb25zdCBwYXRoOiBhbnlbXSA9IFtdO1xuICAgICAgICBsZXQgcmVjb3JkID0gdGhpcy5yZWNvcmRzLmdldChyb3dJZCk7XG5cbiAgICAgICAgd2hpbGUgKHJlY29yZC5wYXJlbnQpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChyZWNvcmQucGFyZW50LmtleSk7XG4gICAgICAgICAgICByZWNvcmQgPSByZWNvcmQucGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGgucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGlzVHJlZVJvdyhyZWNvcmQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcmVjb3JkLmtleSAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5kYXRhO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldFVucGlubmVkSW5kZXhCeUlkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVucGlubmVkUmVjb3Jkcy5maW5kSW5kZXgoeCA9PiB4LmRhdGFbdGhpcy5wcmltYXJ5S2V5XSA9PT0gaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3JlYXRlUm93KGluZGV4OiBudW1iZXIsIGRhdGE/OiBhbnkpOiBSb3dUeXBlIHtcbiAgICAgICAgbGV0IHJvdzogUm93VHlwZTtcbiAgICAgICAgY29uc3QgZGF0YUluZGV4ID0gdGhpcy5fZ2V0RGF0YVZpZXdJbmRleChpbmRleCk7XG4gICAgICAgIGNvbnN0IHJlYzogYW55ID0gZGF0YSA/PyB0aGlzLmRhdGFWaWV3W2RhdGFJbmRleF07XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdW1tYXJ5Um93KHJlYykpIHtcbiAgICAgICAgICAgIHJvdyA9IG5ldyBJZ3hTdW1tYXJ5Um93KHRoaXMgYXMgYW55LCBpbmRleCwgcmVjLnN1bW1hcmllcywgR3JpZEluc3RhbmNlVHlwZS5UcmVlR3JpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJvdyAmJiByZWMpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzVHJlZVJvdyA9IHRoaXMuaXNUcmVlUm93KHJlYyk7XG4gICAgICAgICAgICBjb25zdCBkYXRhUmVjID0gaXNUcmVlUm93ID8gcmVjLmRhdGEgOiByZWM7XG4gICAgICAgICAgICBjb25zdCB0cmVlUm93ID0gaXNUcmVlUm93ID8gcmVjIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgcm93ID0gbmV3IElneFRyZWVHcmlkUm93KHRoaXMgYXMgYW55LCBpbmRleCwgZGF0YVJlYywgdHJlZVJvdyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hUcmVlR3JpZENvbXBvbmVudGAgaGFzIGdyb3VwYWJsZSBjb2x1bW5zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZ3JvdXBhYmxlR3JpZCA9IHRoaXMuZ3JpZC5oYXNHcm91cGFibGVDb2x1bW5zO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzR3JvdXBhYmxlQ29sdW1ucygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uTGlzdC5zb21lKChjb2wpID0+IGNvbC5ncm91cGFibGUgJiYgIWNvbC5jb2x1bW5Hcm91cCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlRGF0YUZpZWxkcyhkYXRhOiBhbnlbXSk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdlbmVyYXRlRGF0YUZpZWxkcyhkYXRhKS5maWx0ZXIoZmllbGQgPT4gZmllbGQgIT09IHRoaXMuY2hpbGREYXRhS2V5KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJhbnNhY3Rpb25TdGF0dXNVcGRhdGUoZXZlbnQ6IFN0YXRlVXBkYXRlRXZlbnQpIHtcbiAgICAgICAgbGV0IGFjdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbiA9PT0gVHJhbnNhY3Rpb25FdmVudE9yaWdpbi5SRURPKSB7XG4gICAgICAgICAgICBhY3Rpb25zID0gZXZlbnQuYWN0aW9ucyA/IGV2ZW50LmFjdGlvbnMuZmlsdGVyKHggPT4geC50cmFuc2FjdGlvbi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuREVMRVRFKSA6IFtdO1xuICAgICAgICAgICAgaWYgKHRoaXMucm93U2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZUNhc2NhZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUNhc2NhZGVTZWxlY3Rpb24oZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50Lm9yaWdpbiA9PT0gVHJhbnNhY3Rpb25FdmVudE9yaWdpbi5VTkRPKSB7XG4gICAgICAgICAgICBhY3Rpb25zID0gZXZlbnQuYWN0aW9ucyA/IGV2ZW50LmFjdGlvbnMuZmlsdGVyKHggPT4geC50cmFuc2FjdGlvbi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQUREKSA6IFtdO1xuICAgICAgICAgICAgaWYgKHRoaXMucm93U2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZUNhc2NhZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYWN0aW9uc1swXS50cmFuc2FjdGlvbi50eXBlID09PSAnYWRkJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWMgPSB0aGlzLmdyaWRBUEkuZ2V0X3JlY19ieV9pZChldmVudC5hY3Rpb25zWzBdLnRyYW5zYWN0aW9uLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDYXNjYWRlU2VsZWN0aW9uKGV2ZW50LCByZWMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FzY2FkZVNlbGVjdGlvbihldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhY3Rpb24gb2YgYWN0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RDaGlsZHJlbihhY3Rpb24udHJhbnNhY3Rpb24uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnRyYW5zYWN0aW9uU3RhdHVzVXBkYXRlKGV2ZW50KTtcbiAgICB9O1xuXG4gICAgcHJvdGVjdGVkIGZpbmRSZWNvcmRJbmRleEluVmlldyhyZWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVZpZXcuZmluZEluZGV4KHggPT4geC5kYXRhW3RoaXMucHJpbWFyeUtleV0gPT09IHJlY1t0aGlzLnByaW1hcnlLZXldKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXREYXRhQmFzZWRCb2R5SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAhdGhpcy5mbGF0RGF0YSB8fCAodGhpcy5mbGF0RGF0YS5sZW5ndGggPCB0aGlzLl9kZWZhdWx0VGFyZ2V0UmVjb3JkTnVtYmVyKSA/XG4gICAgICAgICAgICAwIDogdGhpcy5kZWZhdWx0VGFyZ2V0Qm9keUhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNjcm9sbFRvKHJvdzogYW55IHwgbnVtYmVyLCBjb2x1bW46IGFueSB8IG51bWJlcik6IHZvaWQge1xuICAgICAgICBsZXQgZGVsYXlTY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgbGV0IHJlY29yZDogSVRyZWVHcmlkUmVjb3JkO1xuXG4gICAgICAgIGlmICh0eXBlb2YgKHJvdykgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gcm93O1xuICAgICAgICAgICAgY29uc3Qgcm93SUQgPSB0aGlzLmdyaWRBUEkuZ2V0X3Jvd19pZChyb3dEYXRhKTtcbiAgICAgICAgICAgIHJlY29yZCA9IHRoaXMucHJvY2Vzc2VkUmVjb3Jkcy5nZXQocm93SUQpO1xuICAgICAgICAgICAgdGhpcy5ncmlkQVBJLmV4cGFuZF9wYXRoX3RvX3JlY29yZChyZWNvcmQpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMucHJvY2Vzc2VkRXhwYW5kZWRGbGF0RGF0YS5pbmRleE9mKHJvd0RhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSBNYXRoLmZsb29yKHJvd0luZGV4IC8gdGhpcy5wYWdpbmF0b3IucGVyUGFnZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IucGFnZSAhPT0gcGFnZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxheVNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2UgPSBwYWdlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWxheVNjcm9sbGluZykge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5kYXRhQ2hhbmdlZC5waXBlKGZpcnN0KCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxEaXJlY3RpdmUodGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIChyb3cpID09PSAnbnVtYmVyJyA/IHJvdyA6IHRoaXMudW5waW5uZWREYXRhVmlldy5pbmRleE9mKHJlY29yZCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbERpcmVjdGl2ZSh0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgIHR5cGVvZiAocm93KSA9PT0gJ251bWJlcicgPyByb3cgOiB0aGlzLnVucGlubmVkRGF0YVZpZXcuaW5kZXhPZihyZWNvcmQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ib3Jpem9udGFsbHkoY29sdW1uKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgd3JpdGVUb0RhdGEocm93SW5kZXg6IG51bWJlciwgdmFsdWU6IGFueSkge1xuICAgICAgICBtZXJnZU9iamVjdHModGhpcy5mbGF0RGF0YVtyb3dJbmRleF0sIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRDb2x1bW5zKGNvbGxlY3Rpb246IFF1ZXJ5TGlzdDxJZ3hDb2x1bW5Db21wb25lbnQ+LCBjYjogKGFyZ3M6IGFueSkgPT4gdm9pZCA9IG51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgLy8gaW52YWxpZCBjb25maWd1cmF0aW9uIC0gdHJlZSBncmlkIHNob3VsZCBub3QgYWxsb3cgY29sdW1uIGxheW91dHNcbiAgICAgICAgICAgIC8vIHJlbW92ZSBjb2x1bW4gbGF5b3V0c1xuICAgICAgICAgICAgY29uc3Qgbm9uQ29sdW1uTGF5b3V0Q29sdW1ucyA9IHRoaXMuY29sdW1uTGlzdC5maWx0ZXIoKGNvbCkgPT4gIWNvbC5jb2x1bW5MYXlvdXQgJiYgIWNvbC5jb2x1bW5MYXlvdXRDaGlsZCk7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQobm9uQ29sdW1uTGF5b3V0Q29sdW1ucyk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIuaW5pdENvbHVtbnMoY29sbGVjdGlvbiwgY2IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEdyb3VwQXJlYUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cEFyZWEgPyB0aGlzLmdldENvbXB1dGVkSGVpZ2h0KHRoaXMuZ3JvdXBBcmVhLm5hdGl2ZUVsZW1lbnQpIDogMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQSByZWN1cnNpdmUgd2F5IHRvIGRlc2VsZWN0IGFsbCBzZWxlY3RlZCBjaGlsZHJlbiBvZiBhIGdpdmVuIHJlY29yZFxuICAgICAqIEBwYXJhbSByZWNvcmRJRCBJRCBvZiB0aGUgcmVjb3JkIHdob3NlIGNoaWxkcmVuIHRvIGRlc2VsZWN0XG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgZGVzZWxlY3RDaGlsZHJlbihyZWNvcmRJRCk6IHZvaWQge1xuICAgICAgICBjb25zdCBzZWxlY3RlZENoaWxkcmVuID0gW107XG4gICAgICAgIC8vIEcuRS4gQXByIDI4LCAyMDIxICM5NDY1IFJlY29yZHMgd2hpY2ggYXJlIG5vdCBpbiB2aWV3IGNhbiBhbHNvIGJlIHNlbGVjdGVkIHNvIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gZGVzZWxlY3QgdGhlbSBhcyB3ZWxsLCBoZW5jZSB1c2luZyAncmVjb3JkcycgbWFwIGluc3RlYWQgb2YgZ2V0Um93QnlLZXkoKSBtZXRob2Qgd2hpY2ggd2lsbFxuICAgICAgICAvLyByZXR1cm4gb25seSByb3cgY29tcG9uZW50cyAoaS5lLiByZWNvcmRzIGluIHZpZXcpLlxuICAgICAgICBjb25zdCByb3dUb0Rlc2VsZWN0ID0gdGhpcy5yZWNvcmRzLmdldChyZWNvcmRJRCk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdFJvdyhyZWNvcmRJRCk7XG4gICAgICAgIHRoaXMuZ3JpZEFQSS5nZXRfc2VsZWN0ZWRfY2hpbGRyZW4ocm93VG9EZXNlbGVjdCwgc2VsZWN0ZWRDaGlsZHJlbik7XG4gICAgICAgIGlmIChzZWxlY3RlZENoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGVkQ2hpbGRyZW4uZm9yRWFjaCh4ID0+IHRoaXMuZGVzZWxlY3RDaGlsZHJlbih4KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZENoaWxkUm93cyhjaGlsZHJlbjogYW55W10sIHBhcmVudElEOiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMucHJpbWFyeUtleSAmJiB0aGlzLmZvcmVpZ25LZXkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBjaGlsZFt0aGlzLmZvcmVpZ25LZXldID0gcGFyZW50SUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRhdGEucHVzaCguLi5jaGlsZHJlbik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGlsZERhdGFLZXkpIHtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnJlY29yZHMuZ2V0KHBhcmVudElEKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnREYXRhID0gcGFyZW50LmRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zYWN0aW9ucy5lbmFibGVkICYmIHRoaXMudHJhbnNhY3Rpb25zLmdldEFnZ3JlZ2F0ZWRDaGFuZ2VzKHRydWUpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBbXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGgucHVzaChwYXJlbnQua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgY29sbGVjdGlvbiA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICBsZXQgcmVjb3JkOiBhbnk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGlkID0gcGF0aFtpXTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kKHIgPT4gclt0aGlzLnByaW1hcnlLZXldID09PSBwaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gcmVjb3JkW3RoaXMuY2hpbGREYXRhS2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnREYXRhID0gcmVjb3JkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyZW50RGF0YVt0aGlzLmNoaWxkRGF0YUtleV0gPSBjaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJIZWFkZXJDQlN0YXRlKCk7XG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgaWYgKHRoaXMucm93U2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZUNhc2NhZGUpIHtcbiAgICAgICAgICAgIC8vIEZvcmNlIHBpcGUgdHJpZ2dlcmluZyBmb3IgYnVpbGRpbmcgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmlzUm93U2VsZWN0ZWQocGFyZW50SUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnJvd1NlbGVjdGlvbi5kZWxldGUocGFyZW50SUQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RSb3dzV2l0aE5vRXZlbnQoW3BhcmVudElEXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRDaGlsZHJlbk9uUm93RXhwYW5zaW9uKGFyZ3M6IElSb3dUb2dnbGVFdmVudEFyZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZENoaWxkcmVuT25EZW1hbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudElEID0gYXJncy5yb3dJRDtcblxuICAgICAgICAgICAgaWYgKGFyZ3MuZXhwYW5kZWQgJiYgIXRoaXMuX2V4cGFuc2lvblN0YXRlcy5oYXMocGFyZW50SUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nUm93cy5hZGQocGFyZW50SUQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ2hpbGRyZW5PbkRlbWFuZChwYXJlbnRJRCwgY2hpbGRyZW4gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdSb3dzLmRlbGV0ZShwYXJlbnRJRCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGRSb3dzKGNoaWxkcmVuLCBwYXJlbnRJRCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVDYXNjYWRlU2VsZWN0aW9uKGV2ZW50OiBJUm93RGF0YUV2ZW50QXJncyB8IFN0YXRlVXBkYXRlRXZlbnQsIHJlYzogSVRyZWVHcmlkUmVjb3JkID0gbnVsbCkge1xuICAgICAgICAvLyBXYWl0IGZvciB0aGUgY2hhbmdlIGRldGVjdGlvbiB0byB1cGRhdGUgcmVjb3JkcyB0aHJvdWdoIHRoZSBwaXBlc1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlYyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlYyA9IHRoaXMuZ3JpZEFQSS5nZXRfcmVjX2J5X2lkKChldmVudCBhcyBTdGF0ZVVwZGF0ZUV2ZW50KS5hY3Rpb25zWzBdLnRyYW5zYWN0aW9uLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWMgJiYgcmVjLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5ncmlkLnNlbGVjdGlvblNlcnZpY2UudXBkYXRlQ2FzY2FkZVNlbGVjdGlvbk9uRmlsdGVyQW5kQ1JVRChcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldChbcmVjLnBhcmVudF0pLCByZWMucGFyZW50LmtleVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIjxuZy1jb250ZW50IHNlbGVjdD1cImlneC1ncmlkLXRvb2xiYXJcIj48L25nLWNvbnRlbnQ+XG48bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtdHJlZS1ncmlkLWdyb3VwLWJ5LWFyZWFcIj48L25nLWNvbnRlbnQ+XG48aWd4LWdyaWQtaGVhZGVyLXJvdyBjbGFzcz1cImlneC1ncmlkLXRoZWFkXCIgdGFiaW5kZXg9XCIwXCJcbiAgICBbZ3JpZF09XCJ0aGlzXCJcbiAgICBbaGFzTVJMXT1cImhhc0NvbHVtbkxheW91dHNcIlxuICAgIFthY3RpdmVEZXNjZW5kYW50XT1cImFjdGl2ZURlc2NlbmRhbnRcIlxuICAgIFt3aWR0aF09XCJjYWxjV2lkdGhcIlxuICAgIFtwaW5uZWRDb2x1bW5Db2xsZWN0aW9uXT1cInBpbm5lZENvbHVtbnNcIlxuICAgIFt1bnBpbm5lZENvbHVtbkNvbGxlY3Rpb25dPVwidW5waW5uZWRDb2x1bW5zXCJcbiAgICAoa2V5ZG93bi5tZXRhLmMpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiXG4gICAgKGtleWRvd24uY29udHJvbC5jKT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChjb3B5KT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChrZXlkb3duKT1cIm5hdmlnYXRpb24uaGVhZGVyTmF2aWdhdGlvbigkZXZlbnQpXCJcbiAgICAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c0ZpcnN0Q2VsbCgpXCJcbj5cbjwvaWd4LWdyaWQtaGVhZGVyLXJvdz5cblxuPGRpdiBpZ3hHcmlkQm9keSAoa2V5ZG93bi5jb250cm9sLmMpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiIChjb3B5KT1cImNvcHlIYW5kbGVyKCRldmVudClcIiBjbGFzcz1cImlneC1ncmlkX190Ym9keVwiIHJvbGU9XCJyb3dncm91cFwiPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktY29udGVudFwiICB0YWJpbmRleD1cIjBcIiAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c1Rib2R5KCRldmVudClcIiAoa2V5ZG93bik9XCJuYXZpZ2F0aW9uLmhhbmRsZU5hdmlnYXRpb24oJGV2ZW50KVwiXG4gICAgKGRyYWdTdG9wKT1cInNlbGVjdGlvblNlcnZpY2UuZHJhZ01vZGUgPSAkZXZlbnRcIiBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiYWN0aXZlRGVzY2VuZGFudFwiIFthdHRyLnJvbGVdPVwiZGF0YVZpZXcubGVuZ3RoID8gbnVsbCA6ICdyb3cnXCJcbiAgICAgICAgKGRyYWdTY3JvbGwpPVwiZHJhZ1Njcm9sbCgkZXZlbnQpXCIgW2lneEdyaWREcmFnU2VsZWN0XT1cInNlbGVjdGlvblNlcnZpY2UuZHJhZ01vZGVcIlxuICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT0ndG90YWxIZWlnaHQnIFtzdHlsZS53aWR0aC5weF09J2NhbGNXaWR0aCcgI3Rib2R5IChzY3JvbGwpPSdwcmV2ZW50Q29udGFpbmVyU2Nyb2xsKCRldmVudCknPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWcgJiYgcGlubmVkQ29sdW1ucy5sZW5ndGggPD0gMFwiXG4gICAgICAgICAgICBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiIGlkPVwibGVmdFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtb24tZHJhZy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWcgJiYgcGlubmVkQ29sdW1ucy5sZW5ndGggPiAwXCJcbiAgICAgICAgICAgIFtpZ3hDb2x1bW5Nb3ZpbmdEcm9wXT1cImhlYWRlckNvbnRhaW5lclwiIFthdHRyLmRyb3BwYWJsZV09XCJ0cnVlXCIgaWQ9XCJsZWZ0XCJcbiAgICAgICAgICAgIGNsYXNzPVwiaWd4LWdyaWRfX3Njcm9sbC1vbi1kcmFnLXBpbm5lZFwiIFtzdHlsZS5sZWZ0LnB4XT1cInBpbm5lZFdpZHRoXCI+PC9zcGFuPlxuICAgICAgICA8bmctdGVtcGxhdGUgI3Bpbm5lZFJlY29yZHNUZW1wbGF0ZT5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9J2RhdGFcbiAgICAgICAgICAgIHwgdHJlZUdyaWRUcmFuc2FjdGlvbjpwaXBlVHJpZ2dlclxuICAgICAgICAgICAgfCB2aXNpYmxlQ29sdW1uczpoYXNWaXNpYmxlQ29sdW1uc1xuICAgICAgICAgICAgfCB0cmVlR3JpZE5vcm1hbGl6ZVJlY29yZDpwaXBlVHJpZ2dlclxuICAgICAgICAgICAgfCB0cmVlR3JpZEFkZFJvdzp0cnVlOnBpcGVUcmlnZ2VyXG4gICAgICAgICAgICB8IGdyaWRSb3dQaW5uaW5nOmlkOnRydWU6cGlwZVRyaWdnZXJcbiAgICAgICAgICAgIHwgdHJlZUdyaWRGaWx0ZXJpbmc6ZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOmZpbHRlclN0cmF0ZWd5OmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOnBpcGVUcmlnZ2VyOmZpbHRlcmluZ1BpcGVUcmlnZ2VyOnRydWVcbiAgICAgICAgICAgIHwgdHJlZUdyaWRTb3J0aW5nOnNvcnRpbmdFeHByZXNzaW9uczpzb3J0U3RyYXRlZ3k6cGlwZVRyaWdnZXI6dHJ1ZSBhcyBwaW5uZWREYXRhJz5cbiAgICAgICAgICAgICAgICA8ZGl2ICNwaW5Db250YWluZXIgKm5nSWY9J3Bpbm5lZERhdGEubGVuZ3RoID4gMCdcbiAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2lneC1ncmlkX190ci0tcGlubmVkLWJvdHRvbSc6ICAhaXNSb3dQaW5uaW5nVG9Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaWd4LWdyaWRfX3RyLS1waW5uZWQtdG9wJzogaXNSb3dQaW5uaW5nVG9Ub3BcbiAgICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPSdpZ3gtZ3JpZF9fdHItLXBpbm5lZCcgW3N0eWxlLndpZHRoLnB4XT0nY2FsY1dpZHRoJz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgcm93RGF0YSBvZiBwaW5uZWREYXRhO2xldCByb3dJbmRleCA9IGluZGV4O1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInBpbm5lZF9yZWNvcmRfdGVtcGxhdGU7IGNvbnRleHQ6IGdldENvbnRleHQocm93RGF0YSwgcm93SW5kZXgsIHRydWUpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhhc1Bpbm5lZFJlY29yZHMgJiYgaXNSb3dQaW5uaW5nVG9Ub3AgPyBwaW5uZWRSZWNvcmRzVGVtcGxhdGUgOiBudWxsXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hHcmlkRm9yIGxldC1yb3dEYXRhIFtpZ3hHcmlkRm9yT2ZdPVwiZGF0YVxuICAgICAgICB8IHRyZWVHcmlkVHJhbnNhY3Rpb246cGlwZVRyaWdnZXJcbiAgICAgICAgfCB2aXNpYmxlQ29sdW1uczpoYXNWaXNpYmxlQ29sdW1uc1xuICAgICAgICB8IHRyZWVHcmlkSGllcmFyY2hpemluZzpwcmltYXJ5S2V5OmZvcmVpZ25LZXk6Y2hpbGREYXRhS2V5OnBpcGVUcmlnZ2VyXG4gICAgICAgIHwgdHJlZUdyaWRGaWx0ZXJpbmc6ZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOmZpbHRlclN0cmF0ZWd5OmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOnBpcGVUcmlnZ2VyOmZpbHRlcmluZ1BpcGVUcmlnZ2VyXG4gICAgICAgIHwgdHJlZUdyaWRTb3J0aW5nOnNvcnRpbmdFeHByZXNzaW9uczpzb3J0U3RyYXRlZ3k6cGlwZVRyaWdnZXJcbiAgICAgICAgfCB0cmVlR3JpZEZsYXR0ZW5pbmc6ZXhwYW5zaW9uRGVwdGg6ZXhwYW5zaW9uU3RhdGVzOnBpcGVUcmlnZ2VyXG4gICAgICAgIHwgdHJlZUdyaWRQYWdpbmc6cGFnaW5hdG9yPy5wYWdlOnBhZ2luYXRvcj8ucGVyUGFnZTpwaXBlVHJpZ2dlclxuICAgICAgICB8IHRyZWVHcmlkU3VtbWFyeTpoYXNTdW1tYXJpemVkQ29sdW1uczpzdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlOnN1bW1hcnlQb3NpdGlvbjpzaG93U3VtbWFyeU9uQ29sbGFwc2U6cGlwZVRyaWdnZXI6c3VtbWFyeVBpcGVUcmlnZ2VyXG4gICAgICAgIHwgdHJlZUdyaWRBZGRSb3c6ZmFsc2U6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBncmlkUm93UGlubmluZzppZDpmYWxzZTpwaXBlVHJpZ2dlclwiXG4gICAgICAgICAgICBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCIndmVydGljYWwnXCIgW2lneEZvclNjcm9sbENvbnRhaW5lcl09J3ZlcnRpY2FsU2Nyb2xsJ1xuICAgICAgICAgICAgW2lneEZvckNvbnRhaW5lclNpemVdPSdjYWxjSGVpZ2h0JyBbaWd4Rm9ySXRlbVNpemVdPVwicmVuZGVyZWRSb3dIZWlnaHRcIiAjdmVydGljYWxTY3JvbGxDb250YWluZXJcbiAgICAgICAgICAgIChkYXRhQ2hhbmdpbmcpPVwiZGF0YVJlYmluZGluZygkZXZlbnQpXCIgKGRhdGFDaGFuZ2VkKT1cImRhdGFSZWJvdW5kKCRldmVudClcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbaWd4VGVtcGxhdGVPdXRsZXRdPSdpc1N1bW1hcnlSb3cocm93RGF0YSkgPyBzdW1tYXJ5X3RlbXBsYXRlIDogcmVjb3JkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgICAgIFtpZ3hUZW1wbGF0ZU91dGxldENvbnRleHRdPSdnZXRDb250ZXh0KHJvd0RhdGEsIHJvd0luZGV4LCBmYWxzZSknXG4gICAgICAgICAgICAgICAgKGNhY2hlZFZpZXdMb2FkZWQpPSdjYWNoZWRWaWV3TG9hZGVkKCRldmVudCknPlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhhc1Bpbm5lZFJlY29yZHMgJiYgIWlzUm93UGlubmluZ1RvVG9wID8gcGlubmVkUmVjb3Jkc1RlbXBsYXRlIDogbnVsbFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctdGVtcGxhdGUgI3JlY29yZF90ZW1wbGF0ZSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIGxldC1kaXNhYmxlZFJvdz1cImRpc2FibGVkXCIgbGV0LXJvd0RhdGE+XG4gICAgICAgICAgICA8aWd4LXRyZWUtZ3JpZC1yb3cgW2dyaWRJRF09XCJpZFwiIFtpbmRleF09XCJyb3dJbmRleFwiIFt0cmVlUm93XT1cInJvd0RhdGFcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRSb3dcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInJvd0NsYXNzZXMgfCBpZ3hHcmlkUm93Q2xhc3Nlczpyb3c6cm93LmluRWRpdE1vZGU6cm93LnNlbGVjdGVkOnJvdy5kaXJ0eTpyb3cuZGVsZXRlZDpyb3cuZHJhZ2dpbmc6cm93SW5kZXg6aGFzQ29sdW1uTGF5b3V0czpyb3cudHJlZVJvdy5pc0ZpbHRlcmVkT3V0UGFyZW50OnJvd0RhdGE6cGlwZVRyaWdnZXJcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInJvd1N0eWxlcyB8IGlneEdyaWRSb3dTdHlsZXM6cm93RGF0YTpyb3dJbmRleDpwaXBlVHJpZ2dlclwiICNyb3c+XG4gICAgICAgICAgICA8L2lneC10cmVlLWdyaWQtcm93PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI3Bpbm5lZF9yZWNvcmRfdGVtcGxhdGUgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBsZXQtcm93RGF0YT5cbiAgICAgICAgICAgIDxpZ3gtdHJlZS1ncmlkLXJvdyBbZ3JpZElEXT1cImlkXCIgW2luZGV4XT1cInJvd0luZGV4XCIgW3RyZWVSb3ddPVwicm93RGF0YVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwicm93Q2xhc3NlcyB8IGlneEdyaWRSb3dDbGFzc2VzOnJvdzpyb3cuaW5FZGl0TW9kZTpyb3cuc2VsZWN0ZWQ6cm93LmRpcnR5OnJvdy5kZWxldGVkOnJvdy5kcmFnZ2luZzpyb3dJbmRleDpoYXNDb2x1bW5MYXlvdXRzOnJvdy50cmVlUm93LmlzRmlsdGVyZWRPdXRQYXJlbnQ6cm93RGF0YTpwaXBlVHJpZ2dlclwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwicm93U3R5bGVzIHwgaWd4R3JpZFJvd1N0eWxlczpyb3dEYXRhOnJvd0luZGV4OnBpcGVUcmlnZ2VyXCIjcm93ICNwaW5uZWRSb3c+XG4gICAgICAgICAgICA8L2lneC10cmVlLWdyaWQtcm93PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI3N1bW1hcnlfdGVtcGxhdGUgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBsZXQtcm93RGF0YT5cbiAgICAgICAgICAgIDxpZ3gtZ3JpZC1zdW1tYXJ5LXJvdyBbZ3JpZElEXT1cImlkXCIgW3N1bW1hcmllc109XCJyb3dEYXRhLnN1bW1hcmllc1wiXG4gICAgICAgICAgICAgICAgW2ZpcnN0Q2VsbEluZGVudGF0aW9uXT1cInJvd0RhdGEuY2VsbEluZGVudGF0aW9uXCIgW2luZGV4XT1cInJvd0luZGV4XCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zdW1tYXJpZXMtLWJvZHlcIiByb2xlPVwicm93XCIgI3N1bW1hcnlSb3c+XG4gICAgICAgICAgICA8L2lneC1ncmlkLXN1bW1hcnktcm93PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX19yb3ctZWRpdGluZy1vdXRsZXRcIiBpZ3hPdmVybGF5T3V0bGV0ICNpZ3hSb3dFZGl0aW5nT3ZlcmxheU91dGxldD48L2Rpdj5cbiAgICAgICAgPGlnYy10cmlhbC13YXRlcm1hcms+PC9pZ2MtdHJpYWwtd2F0ZXJtYXJrPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWd4VG9nZ2xlICNsb2FkaW5nT3ZlcmxheT5cbiAgICAgICAgPGlneC1jaXJjdWxhci1iYXIgW2luZGV0ZXJtaW5hdGVdPVwidHJ1ZVwiICpuZ0lmPSdzaG91bGRPdmVybGF5TG9hZGluZyc+XG4gICAgICAgIDwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWdcIiBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiXG4gICAgICAgIGlkPVwicmlnaHRcIiBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtb24tZHJhZy1yaWdodFwiPjwvc3Bhbj5cbiAgICAgICAgPGRpdiBbaGlkZGVuXT0nIWhhc1ZlcnRpY2FsU2Nyb2xsKCknIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LXNjcm9sbGJhclwiIFtzdHlsZS53aWR0aC5weF09XCJzY3JvbGxTaXplXCIgIChwb2ludGVyZG93bik9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiXG4gICAgICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT0nY2FsY0hlaWdodCc+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktc2Nyb2xsYmFyLXN0YXJ0XCIgW3N0eWxlLmhlaWdodC5weF09JyBpc1Jvd1Bpbm5pbmdUb1RvcCA/IHBpbm5lZFJvd0hlaWdodCA6IDAnPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LXNjcm9sbGJhci1tYWluXCIgW3N0eWxlLmhlaWdodC5weF09J2NhbGNIZWlnaHQnPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIGlneEdyaWRGb3IgW2lneEdyaWRGb3JPZl09J1tdJyAjdmVydGljYWxTY3JvbGxIb2xkZXI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktc2Nyb2xsYmFyLWVuZFwiIFtzdHlsZS5oZWlnaHQucHhdPSchaXNSb3dQaW5uaW5nVG9Ub3AgPyBwaW5uZWRSb3dIZWlnaHQgOiAwJz48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2FkZHJvdy1zbmFja2JhclwiPlxuICAgICAgICA8aWd4LXNuYWNrYmFyICNhZGRSb3dTbmFja2JhciBbb3V0bGV0XT1cImlneEJvZHlPdmVybGF5T3V0bGV0XCIgW2FjdGlvblRleHRdPVwicmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX3NuYWNrYmFyX2FkZHJvd19hY3Rpb250ZXh0XCIgW2Rpc3BsYXlUaW1lXT0nc25hY2tiYXJEaXNwbGF5VGltZSc+e3tyZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfc25hY2tiYXJfYWRkcm93X2xhYmVsfX08L2lneC1zbmFja2Jhcj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgaWd4T3ZlcmxheU91dGxldCAjaWd4Qm9keU92ZXJsYXlPdXRsZXQ9XCJvdmVybGF5LW91dGxldFwiPjwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGZvb3RcIiByb2xlPVwicm93Z3JvdXBcIiBbc3R5bGUuaGVpZ2h0LnB4XT0nc3VtbWFyeVJvd0hlaWdodCcgI3Rmb290PlxuICAgIDxkaXYgdGFiaW5kZXg9XCIwXCIgKGZvY3VzKT1cIm5hdmlnYXRpb24uZm9jdXNGaXJzdENlbGwoZmFsc2UpXCJcbiAgICAoa2V5ZG93bik9XCJuYXZpZ2F0aW9uLnN1bW1hcnlOYXYoJGV2ZW50KVwiIFthdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF09XCJhY3RpdmVEZXNjZW5kYW50XCI+XG4gICAgICAgIDxpZ3gtZ3JpZC1zdW1tYXJ5LXJvdyBbc3R5bGUud2lkdGgucHhdPSdjYWxjV2lkdGgnIFtzdHlsZS5oZWlnaHQucHhdPSdzdW1tYXJ5Um93SGVpZ2h0J1xuICAgICAgICAgICAgKm5nSWY9XCJoYXNTdW1tYXJpemVkQ29sdW1ucyAmJiByb290U3VtbWFyaWVzRW5hYmxlZFwiIFtncmlkSURdPVwiaWRcIiByb2xlPVwicm93XCJcbiAgICAgICAgICAgIFtzdW1tYXJpZXNdPVwiaWQgfCBpZ3hHcmlkU3VtbWFyeURhdGFQaXBlOnN1bW1hcnlTZXJ2aWNlLnJldHJpZ2dlclJvb3RQaXBlXCIgW2luZGV4XT1cImRhdGFWaWV3Lmxlbmd0aFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zdW1tYXJpZXNcIiAjc3VtbWFyeVJvdz5cbiAgICAgICAgPC9pZ3gtZ3JpZC1zdW1tYXJ5LXJvdz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Zm9vdC10aHVtYlwiIFtoaWRkZW5dPSchaGFzVmVydGljYWxTY3JvbGwoKScgW3N0eWxlLmhlaWdodC5weF09J3N1bW1hcnlSb3dIZWlnaHQnXG4gICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwic2Nyb2xsU2l6ZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsXCIgW3N0eWxlLmhlaWdodC5weF09XCJzY3JvbGxTaXplXCIgI3NjciBbaGlkZGVuXT1cImlzSG9yaXpvbnRhbFNjcm9sbEhpZGRlblwiIChwb2ludGVyZG93bik9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLXN0YXJ0XCIgW3N0eWxlLndpZHRoLnB4XT0naXNQaW5uaW5nVG9TdGFydCA/IHBpbm5lZFdpZHRoIDogaGVhZGVyRmVhdHVyZXNXaWR0aCcgW3N0eWxlLm1pbi13aWR0aC5weF09J2lzUGlubmluZ1RvU3RhcnQgPyBwaW5uZWRXaWR0aCA6IGhlYWRlckZlYXR1cmVzV2lkdGgnPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW1haW5cIiBbc3R5bGUud2lkdGgucHhdPSd1bnBpbm5lZFdpZHRoJz5cbiAgICAgICAgPG5nLXRlbXBsYXRlIGlneEdyaWRGb3IgW2lneEdyaWRGb3JPZl09J1tdJyAjc2Nyb2xsQ29udGFpbmVyPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLWVuZFwiIFtzdHlsZS5mbG9hdF09J1wicmlnaHRcIicgW3N0eWxlLndpZHRoLnB4XT0ncGlubmVkV2lkdGgnIFtzdHlsZS5taW4td2lkdGgucHhdPSdwaW5uZWRXaWR0aCcgW2hpZGRlbl09XCJwaW5uZWRXaWR0aCA9PT0gMCB8fCBpc1Bpbm5pbmdUb1N0YXJ0XCI+PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cImlneC1ncmlkX19mb290ZXJcIiAjZm9vdGVyPlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1ncmlkLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidG90YWxSZWNvcmRzIHx8IHBhZ2luZ01vZGUgPT09IDFcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LXBhZ2luYXRvclwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2VtcHR5RmlsdGVyZWRHcmlkPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LW1lc3NhZ2VcIiByb2xlPVwiY2VsbFwiPlxuICAgICAgICA8c3Bhbj57e2VtcHR5RmlsdGVyZWRHcmlkTWVzc2FnZX19PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj0nc2hvd0FkZEJ1dHRvbic+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PSdhZGRSb3dFbXB0eVRlbXBsYXRlIHx8IGRlZmF1bHRBZGRSb3dFbXB0eVRlbXBsYXRlJz48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEVtcHR5R3JpZD5cbiAgICA8c3BhbiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1tZXNzYWdlXCIgcm9sZT1cImNlbGxcIj5cbiAgICAgICAgPHNwYW4+e3tlbXB0eUdyaWRNZXNzYWdlfX08L3NwYW4+XG4gICAgICAgIDxzcGFuICpuZ0lmPSdzaG93QWRkQnV0dG9uJz5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9J2FkZFJvd0VtcHR5VGVtcGxhdGUgfHwgZGVmYXVsdEFkZFJvd0VtcHR5VGVtcGxhdGUnPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0QWRkUm93RW1wdHlUZW1wbGF0ZT5cbiAgICA8YnV0dG9uIGlneEJ1dHRvbj1cInJhaXNlZFwiIGlneFJpcHBsZSAoY2xpY2spPVwidGhpcy5jcnVkU2VydmljZS5lbnRlckFkZFJvd01vZGUobnVsbCwgZmFsc2UsICRldmVudClcIj5cbiAgICAgICAge3tyZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfYWRkX3Jvd19sYWJlbH19XG4gICAgPC9idXR0b24+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRMb2FkaW5nR3JpZD5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2xvYWRpbmdcIj5cbiAgICAgICAgPGlneC1jaXJjdWxhci1iYXIgW2luZGV0ZXJtaW5hdGVdPVwidHJ1ZVwiPlxuICAgICAgICA8L2lneC1jaXJjdWxhci1iYXI+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48ZGl2ICpuZ0lmPVwicm93RWRpdGFibGVcIiBpZ3hUb2dnbGUgI3Jvd0VkaXRpbmdPdmVybGF5PlxuICAgIDxkaXYgW2NsYXNzTmFtZV09XCJiYW5uZXJDbGFzc1wiPlxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInJvd0VkaXRDb250YWluZXI7IGNvbnRleHQ6IHsgcm93Q2hhbmdlc0NvdW50OiByb3dDaGFuZ2VzQ291bnQsIGVuZEVkaXQ6IHRoaXMuY3J1ZFNlcnZpY2UuZW5kRWRpdC5iaW5kKHRoaXMpIH1cIj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Um93RWRpdFRleHQ+XG4gICAgWW91IGhhdmUge3sgcm93Q2hhbmdlc0NvdW50IH19IGNoYW5nZXMgaW4gdGhpcyByb3dcbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFJvd0VkaXRBY3Rpb25zPlxuICAgIDxidXR0b24gaWd4QnV0dG9uIGlneFJvd0VkaXRUYWJTdG9wIChjbGljayk9XCJ0aGlzLmVuZFJvd0VkaXRUYWJTdG9wKGZhbHNlLCAkZXZlbnQpXCI+e3sgdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfcm93X2VkaXRfYnRuX2NhbmNlbCB9fTwvYnV0dG9uPlxuICAgIDxidXR0b24gaWd4QnV0dG9uIGlneFJvd0VkaXRUYWJTdG9wIChjbGljayk9XCJ0aGlzLmVuZFJvd0VkaXRUYWJTdG9wKHRydWUsICRldmVudClcIj57eyB0aGlzLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9yb3dfZWRpdF9idG5fZG9uZSB9fTwvYnV0dG9uPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Um93RWRpdFRlbXBsYXRlPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtYmFubmVyX19tZXNzYWdlXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaWd4LWJhbm5lcl9fdGV4dFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwidGhpcy5jcnVkU2VydmljZS5yb3c/LmdldENsYXNzTmFtZSgpID09PSAnSWd4QWRkUm93JyA/IHJvd0FkZFRleHQgOiByb3dFZGl0VGV4dCA/IHJvd0VkaXRUZXh0IDogZGVmYXVsdFJvd0VkaXRUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHsgJGltcGxpY2l0OiB0aGlzLmNydWRTZXJ2aWNlLnJvdz8uZ2V0Q2xhc3NOYW1lKCkgIT09ICdJZ3hBZGRSb3cnID8gcm93Q2hhbmdlc0NvdW50IDogbnVsbCB9XCI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtYmFubmVyX19hY3Rpb25zXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtYmFubmVyX19yb3dcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInJvd0VkaXRBY3Rpb25zID8gcm93RWRpdEFjdGlvbnMgOiBkZWZhdWx0Um93RWRpdEFjdGlvbnM7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB0aGlzLmVuZEVkaXQuYmluZCh0aGlzKSB9XCI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RyYWdJbmRpY2F0b3JJY29uQmFzZT5cbiAgICA8aWd4LWljb24+ZHJhZ19pbmRpY2F0b3I8L2lneC1pY29uPlxuPC9uZy10ZW1wbGF0ZT5cblxuPGlneC1ncmlkLWNvbHVtbi1yZXNpemVyICpuZ0lmPVwiY29sUmVzaXppbmdTZXJ2aWNlLnNob3dSZXNpemVyXCI+PC9pZ3gtZ3JpZC1jb2x1bW4tcmVzaXplcj5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fbG9hZGluZy1vdXRsZXRcIiAjaWd4TG9hZGluZ092ZXJsYXlPdXRsZXQgaWd4T3ZlcmxheU91dGxldD48L2Rpdj5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fb3V0bGV0XCIgI2lneEZpbHRlcmluZ092ZXJsYXlPdXRsZXQgaWd4T3ZlcmxheU91dGxldD48L2Rpdj5cbiJdfQ==