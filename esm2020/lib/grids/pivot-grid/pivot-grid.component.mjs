import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Inject, Input, LOCALE_ID, Output, Optional, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { IgxGridBaseDirective } from '../grid-base.directive';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { IgxGridSelectionService } from '../selection/selection.service';
import { IgxForOfSyncService, IgxForOfScrollSyncService } from '../../directives/for-of/for_of.sync.service';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { IgxGridCRUDService } from '../common/crud.service';
import { IgxGridSummaryService } from '../summaries/grid-summary.service';
import { DEFAULT_PIVOT_KEYS, PivotDimensionType } from './pivot-grid.interface';
import { IgxPivotHeaderRowComponent } from './pivot-header-row.component';
import { IgxColumnGroupComponent } from '../columns/column-group.component';
import { IgxColumnComponent } from '../columns/column.component';
import { PivotUtil } from './pivot-util';
import { FilterMode } from '../common/enums';
import { WatchChanges } from '../watch-changes';
import { DropPosition } from '../moving/moving.service';
import { DimensionValuesFilteringStrategy, NoopPivotDimensionsStrategy } from '../../data-operations/pivot-strategy';
import { IgxGridExcelStyleFilteringComponent } from '../filtering/excel-style/grid.excel-style-filtering.component';
import { IgxPivotGridNavigationService } from './pivot-grid-navigation.service';
import { IgxPivotColumnResizingService } from '../resizing/pivot-grid/pivot-resizing.service';
import { IgxOverlayService } from '../../services/public_api';
import { DOCUMENT } from '@angular/common';
import { DisplayDensity, DisplayDensityToken } from '../../core/displayDensity';
import { cloneArray } from '../../core/utils';
import { IgxPivotFilteringService } from './pivot-filtering.service';
import { DataUtil } from '../../data-operations/data-util';
import { IgxGridTransaction } from '../common/types';
import { GridBaseAPIService } from '../api.service';
import { IgxGridForOfDirective } from '../../directives/for-of/for_of.directive';
import { IgxPivotRowDimensionContentComponent } from './pivot-row-dimension-content.component';
import { IgxPivotGridColumnResizerComponent } from '../resizing/pivot-grid/pivot-resizer.component';
import { DefaultPivotSortingStrategy } from '../../data-operations/pivot-sort-strategy';
import { PivotSortUtil } from './pivot-sort-util';
import * as i0 from "@angular/core";
import * as i1 from "../selection/selection.service";
import * as i2 from "../resizing/pivot-grid/pivot-resizing.service";
import * as i3 from "../api.service";
import * as i4 from "../../services/public_api";
import * as i5 from "./pivot-grid-navigation.service";
import * as i6 from "../filtering/grid-filtering.service";
import * as i7 from "../summaries/grid-summary.service";
import * as i8 from "../../core/utils";
import * as i9 from "./pivot-header-row.component";
import * as i10 from "./pivot-row.component";
import * as i11 from "../../progressbar/progressbar.component";
import * as i12 from "../../snackbar/snackbar.component";
import * as i13 from "../resizing/pivot-grid/pivot-resizer.component";
import * as i14 from "../../icon/icon.component";
import * as i15 from "./pivot-row-dimension-content.component";
import * as i16 from "../filtering/excel-style/grid.excel-style-filtering.component";
import * as i17 from "../filtering/excel-style/excel-style-search.component";
import * as i18 from "../grid.common";
import * as i19 from "@angular/common";
import * as i20 from "../selection/drag-select.directive";
import * as i21 from "../moving/moving.drop.directive";
import * as i22 from "../../directives/for-of/for_of.directive";
import * as i23 from "../../directives/template-outlet/template_outlet.directive";
import * as i24 from "../../directives/toggle/toggle.directive";
import * as i25 from "./pivot-grid.pipes";
import * as i26 from "../common/pipes";
let NEXT_ID = 0;
const MINIMUM_COLUMN_WIDTH = 200;
const MINIMUM_COLUMN_WIDTH_SUPER_COMPACT = 104;
/**
 * Pivot Grid provides a way to present and manipulate data in a pivot table view.
 *
 * @igxModule IgxPivotGridModule
 * @igxGroup Grids & Lists
 * @igxKeywords pivot, grid, table
 * @igxTheme igx-grid-theme
 * @remarks
 * The Ignite UI Pivot Grid is used for grouping and aggregating simple flat data into a pivot table.  Once data
 * has been bound and the dimensions and values configured it can be manipulated via sorting and filtering.
 * @example
 * ```html
 * <igx-pivot-grid [data]="data" [pivotConfiguration]="configuration">
 * </igx-pivot-grid>
 * ```
 */
export class IgxPivotGridComponent extends IgxGridBaseDirective {
    constructor(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform, _diTransactions) {
        super(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform);
        this.selectionService = selectionService;
        this.colResizingService = colResizingService;
        this.transactionFactory = transactionFactory;
        this.document = document;
        this.overlayService = overlayService;
        this.summaryService = summaryService;
        this._displayDensityOptions = _displayDensityOptions;
        this.platform = platform;
        this._diTransactions = _diTransactions;
        /**
         * Emitted when the dimension collection is changed via the grid chip area.
         *
         * @remarks
         * Returns the new dimension collection and its type:
         * @example
         * ```html
         * <igx-pivot-grid #grid [data]="localData" [height]="'305px'"
         *              (dimensionsChange)="dimensionsChange($event)"></igx-grid>
         * ```
         */
        this.dimensionsChange = new EventEmitter();
        /**
         * Emitted when a dimension is sorted.
         *
         * @example
         * ```html
         * <igx-pivot-grid #grid [data]="localData" [height]="'305px'"
         *              (dimensionsSortingExpressionsChange)="dimensionsSortingExpressionsChange($event)"></igx-pivot-grid>
         * ```
         */
        this.dimensionsSortingExpressionsChange = new EventEmitter();
        /**
         * Emitted when the values collection is changed via the grid chip area.
         *
         * @remarks
         * Returns the new dimension
         * @example
         * ```html
         * <igx-pivot-grid #grid [data]="localData" [height]="'305px'"
         *              (valuesChange)="valuesChange($event)"></igx-grid>
         * ```
        */
        this.valuesChange = new EventEmitter();
        this.showPivotConfigurationUI = true;
        /**
         * @hidden @internal
         */
        this.role = 'grid';
        /**
         * @hidden @internal
         */
        this.snackbarDisplayTime = 6000;
        /**
         * @hidden @internal
         */
        this.cellEdit = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.cellEditDone = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.cellEditEnter = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.cellEditExit = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.columnMovingStart = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.columnMoving = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.columnMovingEnd = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.columnPin = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.columnPinned = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowAdd = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowAdded = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowDeleted = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowDelete = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowDragStart = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowDragEnd = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowEditEnter = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowEdit = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowEditDone = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowEditExit = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowPinning = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.rowPinned = new EventEmitter();
        this.columnGroupStates = new Map();
        this.isPivot = true;
        /**
         * @hidden @internal
         */
        this.dragRowID = null;
        /**
         * @hidden @internal
         */
        this.rowDimensionResizing = true;
        /**
         * @hidden @internal
         */
        this._emptyRowDimension = { memberName: '', enabled: true, level: 0 };
        this._defaultExpandState = false;
        this._filterStrategy = new DimensionValuesFilteringStrategy();
        this._pivotConfiguration = { rows: null, columns: null, values: null, filters: null };
        this.p_id = `igx-pivot-grid-${NEXT_ID++}`;
        this._superCompactMode = false;
        /**
         * @hidden @internal
         */
        this.autoGenerate = true;
        /**
         * @hidden @internal
         */
        this.pageChange = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.pagingDone = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.perPageChange = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.moving = false;
        /**
         * @hidden @internal
         */
        this.toolbarExporting = new EventEmitter();
    }
    set pivotConfiguration(value) {
        this._pivotConfiguration = value;
        if (!this._init) {
            this.setupColumns();
        }
        this.notifyChanges(true);
    }
    get pivotConfiguration() {
        return this._pivotConfiguration || { rows: null, columns: null, values: null, filters: null };
    }
    /**
     * Enables a super compact theme for the component.
     * @remarks
     * Overrides the displayDensity option if one is set.
     * @example
     * ```html
     * <igx-pivot-grid [superCompactMode]="true"></igx-pivot-grid>
     * ```
     */
    get superCompactMode() {
        return this._superCompactMode;
    }
    set superCompactMode(value) {
        Promise.resolve().then(() => {
            // wait for the current detection cycle to end before triggering a new one.
            this._superCompactMode = value;
            this.cdr.detectChanges();
        });
    }
    /**
    * Returns the theme of the component.
    * The default theme is `comfortable`.
    * Available options are `comfortable`, `cosy`, `compact`.
    * @remarks
    * If set while superCompactMode is enabled will have no affect.
    * ```typescript
    * let componentTheme = this.component.displayDensity;
    * ```
    */
    get displayDensity() {
        if (this.superCompactMode) {
            return DisplayDensity.compact;
        }
        return super.displayDensity;
    }
    /**
    * Sets the theme of the component.
    */
    set displayDensity(val) {
        const currentDisplayDensity = this._displayDensity;
        this._displayDensity = val;
        if (currentDisplayDensity !== this._displayDensity) {
            const densityChangedArgs = {
                oldDensity: currentDisplayDensity,
                newDensity: this._displayDensity
            };
            this.onDensityChanged.emit(densityChangedArgs);
        }
    }
    get pivotKeys() {
        return this.pivotConfiguration.pivotKeys || DEFAULT_PIVOT_KEYS;
    }
    /**
    * @hidden @internal
    */
    get rootSummariesEnabled() {
        return false;
    }
    get emptyRowDimension() {
        return this._emptyRowDimension;
    }
    /**
    * Gets/Sets the default expand state for all rows.
    */
    get defaultExpandState() {
        return this._defaultExpandState;
    }
    set defaultExpandState(val) {
        this._defaultExpandState = val;
    }
    /**
     * @hidden @internal
     */
    get pagingMode() {
        return;
    }
    set pagingMode(_val) {
    }
    /**
     * @hidden @internal
     */
    get hideRowSelectors() {
        return;
    }
    set hideRowSelectors(_value) {
    }
    /**
     * @hidden @internal
     */
    get rowDraggable() {
        return;
    }
    set rowDraggable(_val) {
    }
    /**
     * @hidden @internal
     */
    get allowAdvancedFiltering() {
        return false;
    }
    set allowAdvancedFiltering(_value) {
    }
    /**
     * @hidden @internal
     */
    get filterMode() {
        return FilterMode.quickFilter;
    }
    set filterMode(_value) {
    }
    /**
     * @hidden @internal
     */
    get allowFiltering() {
        return false;
    }
    set allowFiltering(_value) {
    }
    /**
     * @hidden @internal
     */
    get isFirstPage() {
        return true;
    }
    /**
     * @hidden @internal
     */
    get isLastPage() {
        return true;
    }
    /**
     * @hidden @internal
     */
    get page() {
        return 0;
    }
    set page(_val) {
    }
    /**
     * @hidden @internal
     */
    get paging() {
        return false;
    }
    set paging(_value) {
    }
    /**
     * @hidden @internal
     */
    get perPage() {
        return;
    }
    set perPage(_val) {
    }
    /**
     * @hidden @internal
     */
    get pinnedColumns() {
        return [];
    }
    /**
    * @hidden @internal
    */
    get unpinnedColumns() {
        return super.unpinnedColumns;
    }
    /**
    * @hidden @internal
    */
    get unpinnedDataView() {
        return super.unpinnedDataView;
    }
    /**
    * @hidden @internal
    */
    get unpinnedWidth() {
        return super.unpinnedWidth;
    }
    /**
     * @hidden @internal
     */
    get pinnedWidth() {
        return super.pinnedWidth;
    }
    /**
     * @hidden @internal
     */
    set summaryRowHeight(_value) {
    }
    get summaryRowHeight() {
        return 0;
    }
    /**
     * @hidden @internal
     */
    get totalPages() {
        return;
    }
    /**
     * @hidden @internal
     */
    get transactions() {
        return this._transactions;
    }
    /**
     * @hidden @internal
     */
    get dragIndicatorIconTemplate() {
        return;
    }
    set dragIndicatorIconTemplate(_val) {
    }
    /**
     * @hidden @internal
     */
    get rowEditable() {
        return;
    }
    set rowEditable(_val) {
    }
    /**
     * @hidden @internal
     */
    get pinning() {
        return {};
    }
    set pinning(_value) {
    }
    /**
     * @hidden @internal
     */
    get summaryPosition() {
        return;
    }
    set summaryPosition(_value) {
    }
    /**
     * @hidden @interal
     */
    get summaryCalculationMode() {
        return;
    }
    set summaryCalculationMode(_value) {
    }
    /**
     * @hidden @interal
     */
    get showSummaryOnCollapse() {
        return;
    }
    set showSummaryOnCollapse(_value) {
    }
    /**
     * @hidden @internal
     */
    get hiddenColumnsCount() {
        return null;
    }
    /**
     * @hidden @internal
     */
    get pinnedColumnsCount() {
        return null;
    }
    /**
     * @hidden @internal
     */
    get batchEditing() {
        return;
    }
    set batchEditing(_val) {
    }
    get selectedRows() {
        if (this.selectionService.getSelectedRows().length === 0) {
            return [];
        }
        const selectedRowIds = [];
        this.dataView.forEach(record => {
            const prev = [];
            for (const dim of this.rowDimensions) {
                let currDim = dim;
                let shouldBreak = false;
                do {
                    const key = PivotUtil.getRecordKey(record, currDim);
                    if (this.selectionService.isPivotRowSelected(key) && !selectedRowIds.find(x => x === record)) {
                        selectedRowIds.push(record);
                        shouldBreak = true;
                        break;
                    }
                    currDim = currDim.childLevel;
                } while (currDim);
                prev.push(dim);
                if (shouldBreak) {
                    break;
                }
            }
        });
        return selectedRowIds;
    }
    /**
     * Gets the default row height.
     *
     * @example
     * ```typescript
     * const rowHeigh = this.grid.defaultRowHeight;
     * ```
     */
    get defaultRowHeight() {
        if (this.superCompactMode) {
            return 24;
        }
        return super.defaultRowHeight;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        // pivot grid always generates columns automatically.
        this.autoGenerate = true;
        const config = this.pivotConfiguration;
        this.filteringExpressionsTree = PivotUtil.buildExpressionTree(config);
        super.ngOnInit();
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        // ignore any user defined columns and auto-generate based on pivot config.
        this.columnList.reset([]);
        Promise.resolve().then(() => {
            this.setupColumns();
        });
    }
    /**
     * @hidden @internal
     */
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            super.ngAfterViewInit();
        });
    }
    /**
     * Notifies for dimension change.
     */
    notifyDimensionChange(regenerateColumns = false) {
        if (regenerateColumns) {
            this.setupColumns();
        }
        this.pipeTrigger++;
        this.cdr.detectChanges();
    }
    /**
     * Gets the full list of dimensions.
     *
     * @example
     * ```typescript
     * const dimensions = this.grid.allDimensions;
     * ```
     */
    get allDimensions() {
        const config = this.pivotConfiguration;
        return (config.rows || []).concat((config.columns || [])).concat(config.filters || []).filter(x => x !== null && x !== undefined);
    }
    /** @hidden @internal */
    createFilterESF(dropdown, column, options, shouldReatach) {
        options.outlet = this.outlet;
        if (dropdown) {
            dropdown.initialize(column, this.overlayService);
            if (shouldReatach) {
                const id = this.overlayService.attach(dropdown.element, options);
                dropdown.overlayComponentId = id;
                return { id, ref: undefined };
            }
            return { id: dropdown.overlayComponentId, ref: undefined };
        }
    }
    /** @hidden */
    featureColumnsWidth() {
        return this.pivotRowWidths;
    }
    /**
     * Gets/Sets the value of the `id` attribute.
     *
     * @remarks
     * If not provided it will be automatically generated.
     * @example
     * ```html
     * <igx-pivot-grid [id]="'igx-pivot-1'" [data]="Data"></igx-pivot-grid>
     * ```
     */
    get id() {
        return this.p_id;
    }
    set id(value) {
        this.p_id = value;
    }
    /**
     * An @Input property that lets you fill the `IgxPivotGridComponent` with an array of data.
     * ```html
     * <igx-pivot-grid [data]="Data"></igx-pivot-grid>
     * ```
     */
    set data(value) {
        this._data = value || [];
        if (!this._init) {
            this.setupColumns();
            this.reflow();
        }
        this.cdr.markForCheck();
        if (this.height === null || this.height.indexOf('%') !== -1) {
            // If the height will change based on how much data there is, recalculate sizes in igxForOf.
            this.notifyChanges(true);
        }
    }
    /**
     * Returns an array of data set to the component.
     * ```typescript
     * let data = this.grid.data;
     * ```
     */
    get data() {
        return this._data;
    }
    /**
     * Sets an array of objects containing the filtered data.
     * ```typescript
     * this.grid.filteredData = [{
     *       ID: 1,
     *       Name: "A"
     * }];
     * ```
     */
    set filteredData(value) {
        this._filteredData = value;
    }
    /**
     * Returns an array of objects containing the filtered data.
     * ```typescript
     * let filteredData = this.grid.filteredData;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get filteredData() {
        return this._filteredData;
    }
    /**
     * @hidden
     */
    getContext(rowData, rowIndex) {
        return {
            $implicit: rowData,
            templateID: {
                type: 'dataRow',
                id: null
            },
            index: this.getDataViewIndex(rowIndex, false)
        };
    }
    /**
     * @hidden @internal
     */
    get pivotRowWidths() {
        return this.rowDimensions.length ? this.rowDimensions.reduce((accumulator, dim) => accumulator + this.rowDimensionWidthToPixels(dim), 0) :
            this.rowDimensionWidthToPixels(this.emptyRowDimension);
    }
    /**
     * @hidden @internal
     */
    rowDimensionWidthToPixels(dim) {
        if (!dim.width) {
            return MINIMUM_COLUMN_WIDTH;
        }
        const isPercent = dim.width && dim.width.indexOf('%') !== -1;
        if (isPercent) {
            return parseFloat(dim.width) / 100 * this.calcWidth;
        }
        else {
            return parseInt(dim.width, 10);
        }
    }
    /**
     * @hidden @internal
     */
    reverseDimensionWidthToPercent(width) {
        return (width * 100 / this.calcWidth);
    }
    get rowDimensions() {
        return this.pivotConfiguration.rows?.filter(x => x.enabled) || [];
    }
    get columnDimensions() {
        return this.pivotConfiguration.columns?.filter(x => x.enabled) || [];
    }
    get filterDimensions() {
        return this.pivotConfiguration.filters?.filter(x => x.enabled) || [];
    }
    get values() {
        return this.pivotConfiguration.values?.filter(x => x.enabled) || [];
    }
    toggleColumn(col) {
        const state = this.columnGroupStates.get(col.field);
        const newState = !state;
        this.columnGroupStates.set(col.field, newState);
        this.toggleRowGroup(col, newState);
        this.reflow();
    }
    /**
     * @hidden @internal
     */
    isRecordPinnedByIndex(_rowIndex) {
        return null;
    }
    /**
     * @hidden @internal
     */
    toggleColumnVisibility(_args) {
        return;
    }
    /**
     * @hidden @internal
     */
    expandAll() {
    }
    /**
     * @hidden @internal
     */
    collapseAll() {
    }
    /**
     * @hidden @internal
     */
    expandRow(_rowID) {
    }
    /**
     * @hidden @internal
     */
    collapseRow(_rowID) {
    }
    /**
     * @hidden @internal
     */
    get pinnedRows() {
        return;
    }
    /**
     * @hidden @internal
     */
    get totalRecords() {
        return;
    }
    set totalRecords(_total) {
    }
    /**
     * @hidden @internal
     */
    moveColumn(_column, _target, _pos = DropPosition.AfterDropTarget) {
    }
    /**
     * @hidden @internal
     */
    addRow(_data) {
    }
    /**
     * @hidden @internal
     */
    deleteRow(_rowSelector) {
    }
    /**
     * @hidden @internal
     */
    updateCell(_value, _rowSelector, _column) {
    }
    /**
     * @hidden @internal
     */
    updateRow(_value, _rowSelector) {
    }
    /**
     * @hidden @internal
     */
    enableSummaries(..._rest) {
    }
    /**
     * @hidden @internal
     */
    disableSummaries(..._rest) {
    }
    /**
     * @hidden @internal
     */
    pinColumn(_columnName, _index) {
        return;
    }
    /**
     * @hidden @internal
     */
    unpinColumn(_columnName, _index) {
        return;
    }
    /**
     * @hidden @internal
     */
    pinRow(_rowID, _index, _row) {
        return;
    }
    /**
     * @hidden @internal
     */
    unpinRow(_rowID, _row) {
        return;
    }
    /**
     * @hidden @internal
     */
    get pinnedRowHeight() {
        return;
    }
    /**
     * @hidden @internal
     */
    get hasEditableColumns() {
        return;
    }
    /**
     * @hidden @internal
     */
    get hasSummarizedColumns() {
        return;
    }
    /**
     * @hidden @internal
     */
    get hasMovableColumns() {
        return;
    }
    /**
     * @hidden @internal
     */
    get pinnedDataView() {
        return [];
    }
    /**
     * @hidden @internal
     */
    openAdvancedFilteringDialog(_overlaySettings) {
    }
    /**
     * @hidden @internal
     */
    closeAdvancedFilteringDialog(_applyChanges) {
    }
    /**
     * @hidden @internal
     */
    endEdit(_commit = true, _event) {
    }
    /**
     * @hidden @internal
     */
    beginAddRowById(_rowID, _asChild) {
    }
    /**
     * @hidden @internal
     */
    beginAddRowByIndex(_index) {
    }
    /**
     * @hidden @internal
     */
    clearSearch() { }
    /**
     * @hidden @internal
     */
    paginate(_val) {
    }
    /**
    * @hidden @internal
    */
    nextPage() {
    }
    /**
    * @hidden @internal
    */
    previousPage() {
    }
    /**
    * @hidden @internal
    */
    refreshSearch(_updateActiveInfo, _endEdit = true) {
        return 0;
    }
    /**
    * @hidden @internal
    */
    findNext(_text, _caseSensitive, _exactMatch) {
        return 0;
    }
    /**
    * @hidden @internal
    */
    findPrev(_text, _caseSensitive, _exactMatch) {
        return 0;
    }
    /**
    * @hidden @internal
    */
    getNextCell(currRowIndex, curVisibleColIndex, callback = null) {
        return super.getNextCell(currRowIndex, curVisibleColIndex, callback);
    }
    /**
    * @hidden @internal
    */
    getPreviousCell(currRowIndex, curVisibleColIndex, callback = null) {
        return super.getPreviousCell(currRowIndex, curVisibleColIndex, callback);
    }
    /**
    * @hidden @internal
    */
    getPinnedWidth(takeHidden = false) {
        return super.getPinnedWidth(takeHidden);
    }
    /**
     * @hidden @internal
     */
    get totalHeight() {
        return this.calcHeight;
    }
    getColumnGroupExpandState(col) {
        const state = this.columnGroupStates.get(col.field);
        // columns are expanded by default?
        return state !== undefined && state !== null ? state : false;
    }
    toggleRowGroup(col, newState) {
        if (!col)
            return;
        if (this.hasMultipleValues) {
            const parentCols = col.parent ? col.parent.children.toArray() : this._autoGeneratedCols.filter(x => x.level === 0);
            const siblingCol = parentCols.filter(x => x.header === col.header && x !== col)[0];
            const currIndex = parentCols.indexOf(col);
            const siblingIndex = parentCols.indexOf(siblingCol);
            if (currIndex < siblingIndex) {
                // clicked on the full hierarchy header
                this.resolveToggle(col, newState);
                siblingCol.headerTemplate = this.headerTemplate;
            }
            else {
                // clicked on summary parent column that contains just the measures
                col.headerTemplate = undefined;
                this.resolveToggle(siblingCol, newState);
            }
        }
        else {
            const parentCols = col.parent ? col.parent.children : this._autoGeneratedCols.filter(x => x.level === 0);
            const fieldColumn = parentCols.filter(x => x.header === col.header && !x.columnGroup)[0];
            const groupColumn = parentCols.filter(x => x.header === col.header && x.columnGroup)[0];
            this.resolveToggle(groupColumn, newState);
            if (newState) {
                fieldColumn.headerTemplate = this.headerTemplate;
            }
            else {
                fieldColumn.headerTemplate = undefined;
            }
        }
    }
    /**
    * @hidden @internal
    */
    setupColumns() {
        super.setupColumns();
    }
    /**
     * Auto-sizes row dimension cells.
     *
     * @remarks
     * Only sizes based on the dimension cells in view.
     * @example
     * ```typescript
     * this.grid.autoSizeRowDimension(dimension);
     * ```
     * @param dimension The row dimension to size.
     */
    autoSizeRowDimension(dimension) {
        if (this.getDimensionType(dimension) === PivotDimensionType.Row) {
            const relatedDims = PivotUtil.flatten([dimension]).map(x => x.memberName);
            const content = this.rowDimensionContentCollection.filter(x => relatedDims.indexOf(x.dimension.memberName) !== -1);
            const headers = content.map(x => x.headerGroups.toArray()).flat().map(x => x.header && x.header.refInstance);
            const autoWidth = this.getLargesContentWidth(headers);
            dimension.width = autoWidth;
            this.pipeTrigger++;
            this.cdr.detectChanges();
        }
    }
    /**
     * Inserts dimension in target collection by type at specified index or at the collection's end.
     *
     * @example
     * ```typescript
     * this.grid.insertDimensionAt(dimension, PivotDimensionType.Row, 1);
     * ```
     * @param dimension The dimension that will be added.
     * @param targetCollectionType The target collection type to add to. Can be Row, Column or Filter.
     * @param index The index in the collection at which to add.
     * This parameter is optional. If not set it will add it to the end of the collection.
     */
    insertDimensionAt(dimension, targetCollectionType, index) {
        const targetCollection = this.getDimensionsByType(targetCollectionType);
        if (index !== undefined) {
            targetCollection.splice(index, 0, dimension);
        }
        else {
            targetCollection.push(dimension);
        }
        if (targetCollectionType === PivotDimensionType.Column) {
            this.setupColumns();
        }
        this.pipeTrigger++;
        this.dimensionsChange.emit({ dimensions: targetCollection, dimensionCollectionType: targetCollectionType });
        if (targetCollectionType === PivotDimensionType.Filter) {
            this.dimensionDataColumns = this.generateDimensionColumns();
            this.reflow();
        }
    }
    /**
     * Move dimension from its currently collection to the specified target collection by type at specified index or at the collection's end.
     *
     * @example
     * ```typescript
     * this.grid.moveDimension(dimension, PivotDimensionType.Row, 1);
     * ```
     * @param dimension The dimension that will be moved.
     * @param targetCollectionType The target collection type to move it to. Can be Row, Column or Filter.
     * @param index The index in the collection at which to add.
     * This parameter is optional. If not set it will add it to the end of the collection.
     */
    moveDimension(dimension, targetCollectionType, index) {
        const prevCollectionType = this.getDimensionType(dimension);
        if (prevCollectionType === null)
            return;
        // remove from old collection
        this._removeDimensionInternal(dimension);
        // add to target
        this.insertDimensionAt(dimension, targetCollectionType, index);
        if (prevCollectionType === PivotDimensionType.Column) {
            this.setupColumns();
        }
    }
    /**
     * Removes dimension from its currently collection.
     * @remarks
     * This is different than toggleDimension that enabled/disables the dimension.
     * This completely removes the specified dimension from the collection.
     * @example
     * ```typescript
     * this.grid.removeDimension(dimension);
     * ```
     * @param dimension The dimension to be removed.
     */
    removeDimension(dimension) {
        const prevCollectionType = this.getDimensionType(dimension);
        this._removeDimensionInternal(dimension);
        if (prevCollectionType === PivotDimensionType.Column) {
            this.setupColumns();
        }
        if (prevCollectionType === PivotDimensionType.Filter) {
            this.reflow();
        }
        this.pipeTrigger++;
        this.cdr.detectChanges();
    }
    /**
     * Toggles the dimension's enabled state on or off.
     * @remarks
     * The dimension remains in its current collection. This just changes its enabled state.
     * @example
     * ```typescript
     * this.grid.toggleDimension(dimension);
     * ```
     * @param dimension The dimension to be toggled.
     */
    toggleDimension(dimension) {
        const dimType = this.getDimensionType(dimension);
        if (dimType === null)
            return;
        const collection = this.getDimensionsByType(dimType);
        dimension.enabled = !dimension.enabled;
        if (dimType === PivotDimensionType.Column) {
            this.setupColumns();
        }
        if (!dimension.enabled && dimension.filter) {
            this.filteringService.clearFilter(dimension.memberName);
        }
        this.pipeTrigger++;
        this.dimensionsChange.emit({ dimensions: collection, dimensionCollectionType: dimType });
        this.cdr.detectChanges();
        if (dimType === PivotDimensionType.Filter) {
            this.reflow();
        }
    }
    /**
     * Inserts value at specified index or at the end.
     *
     * @example
     * ```typescript
     * this.grid.insertValueAt(value, 1);
     * ```
     * @param value The value definition that will be added.
     * @param index The index in the collection at which to add.
     * This parameter is optional. If not set it will add it to the end of the collection.
     */
    insertValueAt(value, index) {
        if (!this.pivotConfiguration.values) {
            this.pivotConfiguration.values = [];
        }
        const values = this.pivotConfiguration.values;
        if (index !== undefined) {
            values.splice(index, 0, value);
        }
        else {
            values.push(value);
        }
        this.setupColumns();
        this.pipeTrigger++;
        this.cdr.detectChanges();
        this.valuesChange.emit({ values });
    }
    /**
     * Move value from its currently at specified index or at the end.
     *
     * @example
     * ```typescript
     * this.grid.moveValue(value, 1);
     * ```
     * @param value The value that will be moved.
     * @param index The index in the collection at which to add.
     * This parameter is optional. If not set it will add it to the end of the collection.
     */
    moveValue(value, index) {
        if (this.pivotConfiguration.values.indexOf(value) === -1)
            return;
        // remove from old index
        this.removeValue(value);
        // add to new
        this.insertValueAt(value, index);
    }
    /**
     * Removes value from collection.
     * @remarks
     * This is different than toggleValue that enabled/disables the value.
     * This completely removes the specified value from the collection.
     * @example
     * ```typescript
     * this.grid.removeValue(dimension);
     * ```
     * @param value The value to be removed.
     */
    removeValue(value) {
        const values = this.pivotConfiguration.values;
        const currentIndex = values.indexOf(value);
        if (currentIndex !== -1) {
            values.splice(currentIndex, 1);
            this.setupColumns();
            this.pipeTrigger++;
            this.valuesChange.emit({ values });
        }
    }
    /**
     * Toggles the value's enabled state on or off.
     * @remarks
     * The value remains in its current collection. This just changes its enabled state.
     * @example
     * ```typescript
     * this.grid.toggleValue(value);
     * ```
     * @param value The value to be toggled.
     */
    toggleValue(value) {
        if (this.pivotConfiguration.values.indexOf(value) === -1)
            return;
        value.enabled = !value.enabled;
        this.setupColumns();
        this.pipeTrigger++;
        this.valuesChange.emit({ values: this.pivotConfiguration.values });
        this.reflow();
    }
    /**
     * Sort the dimension and its children in the provided direction.
     * @example
     * ```typescript
     * this.grid.sortDimension(dimension, SortingDirection.Asc);
     * ```
     * @param value The value to be toggled.
     */
    sortDimension(dimension, sortDirection) {
        const dimensionType = this.getDimensionType(dimension);
        dimension.sortDirection = sortDirection;
        // apply same sort direction to children.
        let dim = dimension;
        while (dim.childLevel) {
            dim.childLevel.sortDirection = dimension.sortDirection;
            dim = dim.childLevel;
        }
        const dimensionsSortingExpressions = PivotSortUtil.generateDimensionSortingExpressions(this.rowDimensions);
        this.pipeTrigger++;
        this.dimensionsSortingExpressionsChange.emit(dimensionsSortingExpressions);
        if (dimensionType === PivotDimensionType.Column) {
            this.setupColumns();
        }
        this.cdr.detectChanges();
    }
    /**
     * @hidden @internal
     */
    getDimensionsByType(dimension) {
        switch (dimension) {
            case PivotDimensionType.Row:
                if (!this.pivotConfiguration.rows) {
                    this.pivotConfiguration.rows = [];
                }
                return this.pivotConfiguration.rows;
            case PivotDimensionType.Column:
                if (!this.pivotConfiguration.columns) {
                    this.pivotConfiguration.columns = [];
                }
                return this.pivotConfiguration.columns;
            case PivotDimensionType.Filter:
                if (!this.pivotConfiguration.filters) {
                    this.pivotConfiguration.filters = [];
                }
                return this.pivotConfiguration.filters;
            default:
                return null;
        }
    }
    /**
     * @hidden @internal
     */
    resizeRowDimensionPixels(dimension, newWidth) {
        const isPercentageWidth = dimension.width && typeof dimension.width === 'string' && dimension.width.indexOf('%') !== -1;
        if (isPercentageWidth) {
            dimension.width = this.reverseDimensionWidthToPercent(newWidth).toFixed(2) + '%';
        }
        else {
            dimension.width = newWidth + 'px';
        }
        // Notify the grid to reflow, to update if horizontal scrollbar needs to be rendered/removed.
        this.pipeTrigger++;
        this.cdr.detectChanges();
    }
    /*
    * @hidden
    * @internal
    */
    _removeDimensionInternal(dimension) {
        const prevCollectionType = this.getDimensionType(dimension);
        if (prevCollectionType === null)
            return;
        const prevCollection = this.getDimensionsByType(prevCollectionType);
        const currentIndex = prevCollection.indexOf(dimension);
        prevCollection.splice(currentIndex, 1);
        this.pipeTrigger++;
        this.cdr.detectChanges();
    }
    getDimensionType(dimension) {
        return PivotUtil.flatten(this.pivotConfiguration.rows).indexOf(dimension) !== -1 ? PivotDimensionType.Row :
            PivotUtil.flatten(this.pivotConfiguration.columns).indexOf(dimension) !== -1 ? PivotDimensionType.Column :
                (!!this.pivotConfiguration.filters && PivotUtil.flatten(this.pivotConfiguration.filters).indexOf(dimension) !== -1) ?
                    PivotDimensionType.Filter : null;
    }
    getLargesContentWidth(contents) {
        const largest = new Map();
        if (contents.length > 0) {
            const cellsContentWidths = [];
            contents.forEach((elem) => cellsContentWidths.push(this.getHeaderCellWidth(elem.nativeElement).width));
            const index = cellsContentWidths.indexOf(Math.max(...cellsContentWidths));
            const cellStyle = this.document.defaultView.getComputedStyle(contents[index].nativeElement);
            const cellPadding = parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight) +
                parseFloat(cellStyle.borderLeftWidth) + parseFloat(cellStyle.borderRightWidth);
            largest.set(Math.max(...cellsContentWidths), cellPadding);
        }
        const largestCell = Math.max(...Array.from(largest.keys()));
        const width = Math.ceil(largestCell + largest.get(largestCell));
        if (Number.isNaN(width)) {
            return null;
        }
        else {
            return width + 'px';
        }
    }
    /**
    * @hidden
    */
    get hasMultipleValues() {
        return this.values.length > 1;
    }
    /**
    * @hidden
    */
    get excelStyleFilterMaxHeight() {
        // max 10 rows, row size depends on density
        const maxHeight = this.renderedRowHeight * 10;
        return `${maxHeight}px`;
    }
    /**
    * @hidden
    */
    get excelStyleFilterMinHeight() {
        // min 5 rows, row size depends on density
        const minHeight = this.renderedRowHeight * 5;
        return `${minHeight}px`;
    }
    resolveToggle(groupColumn, state) {
        if (!groupColumn)
            return;
        groupColumn.hidden = state;
        this.columnGroupStates.set(groupColumn.field, state);
        const childrenTotal = this.hasMultipleValues ?
            groupColumn.children.filter(x => x.columnGroup && x.children.filter(y => !y.columnGroup).length === this.values.length) :
            groupColumn.children.filter(x => !x.columnGroup);
        const childrenSubgroups = this.hasMultipleValues ?
            groupColumn.children.filter(x => x.columnGroup && x.children.filter(y => !y.columnGroup).length === 0) :
            groupColumn.children.filter(x => x.columnGroup);
        childrenTotal.forEach(group => {
            const newState = this.columnGroupStates.get(group.field) || state;
            if (newState) {
                group.headerTemplate = this.headerTemplate;
            }
            else {
                group.headerTemplate = undefined;
            }
        });
        if (!groupColumn.hidden && childrenSubgroups.length > 0) {
            childrenSubgroups.forEach(group => {
                const newState = this.columnGroupStates.get(group.field) || state;
                this.resolveToggle(group, newState);
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    calcGridHeadRow() {
    }
    buildDataView(data) {
        this._dataView = data;
    }
    /**
     * @hidden @internal
     */
    getDataBasedBodyHeight() {
        const dvl = this.dataView?.length || 0;
        return dvl < this._defaultTargetRecordNumber ? 0 : this.defaultTargetBodyHeight;
    }
    horizontalScrollHandler(event) {
        const scrollLeft = event.target.scrollLeft;
        this.theadRow.headerContainers.forEach(headerForOf => {
            headerForOf.onHScroll(scrollLeft);
        });
        super.horizontalScrollHandler(event);
    }
    verticalScrollHandler(event) {
        this.verticalRowDimScrollContainers.forEach(x => {
            x.onScroll(event);
        });
        super.verticalScrollHandler(event);
    }
    /**
     * @hidden
     */
    autogenerateColumns() {
        let columns = [];
        const data = this.gridAPI.filterDataByExpressions(this.filteringExpressionsTree);
        this.dimensionDataColumns = this.generateDimensionColumns();
        let fieldsMap;
        if (this.pivotConfiguration.columnStrategy && this.pivotConfiguration.columnStrategy instanceof NoopPivotDimensionsStrategy) {
            const fields = this.generateDataFields(data);
            if (fields.length === 0)
                return;
            const rowFields = PivotUtil.flatten(this.pivotConfiguration.rows).map(x => x.memberName);
            const keyFields = Object.values(this.pivotKeys);
            const filteredFields = fields.filter(x => rowFields.indexOf(x) === -1 && keyFields.indexOf(x) === -1 &&
                x.indexOf(this.pivotKeys.rowDimensionSeparator + this.pivotKeys.level) === -1 &&
                x.indexOf(this.pivotKeys.rowDimensionSeparator + this.pivotKeys.records) === -1);
            fieldsMap = this.generateFromData(filteredFields);
        }
        else {
            fieldsMap = PivotUtil.getFieldsHierarchy(data, this.columnDimensions, PivotDimensionType.Column, this.pivotKeys);
        }
        columns = this.generateColumnHierarchy(fieldsMap, data);
        this._autoGeneratedCols = columns;
        // reset expansion states if any are stored.
        this.columnGroupStates.forEach((value, key) => {
            if (value) {
                const primaryColumn = columns.find(x => x.field === key && x.headerTemplate === this.headerTemplate);
                const groupSummaryColumn = columns.find(x => x.field === key && x.headerTemplate !== this.headerTemplate);
                this.toggleRowGroup(primaryColumn, value);
                if (groupSummaryColumn) {
                    groupSummaryColumn.headerTemplate = this.headerTemplate;
                }
            }
        });
        this.reflow();
        this.columnList.reset(columns);
        if (data && data.length > 0) {
            this.shouldGenerate = false;
        }
    }
    getComponentDensityClass(baseStyleClass) {
        if (this.superCompactMode) {
            return `${baseStyleClass}--${DisplayDensity.compact} igx-grid__pivot--super-compact`;
        }
        return super.getComponentDensityClass(baseStyleClass);
    }
    generateDimensionColumns() {
        const rootFields = this.allDimensions.map(x => x.memberName);
        const columns = [];
        const factory = this.resolver.resolveComponentFactory(IgxColumnComponent);
        rootFields.forEach((field) => {
            const ref = factory.create(this.viewRef.injector);
            ref.instance.field = field;
            ref.changeDetectorRef.detectChanges();
            columns.push(ref.instance);
        });
        return columns;
    }
    generateFromData(fields) {
        const separator = this.pivotKeys.columnDimensionSeparator;
        const dataArr = fields.map(x => x.split(separator)).sort(x => x.length);
        const hierarchy = new Map();
        dataArr.forEach(arr => {
            let currentHierarchy = hierarchy;
            const path = [];
            for (const val of arr) {
                path.push(val);
                const newPath = path.join(separator);
                let targetHierarchy = currentHierarchy.get(newPath);
                if (!targetHierarchy) {
                    currentHierarchy.set(newPath, { value: newPath, expandable: true, children: new Map(), dimension: this.columnDimensions[0] });
                    targetHierarchy = currentHierarchy.get(newPath);
                }
                currentHierarchy = targetHierarchy.children;
            }
        });
        return hierarchy;
    }
    generateColumnHierarchy(fields, data, parent = null) {
        const factoryColumn = this.resolver.resolveComponentFactory(IgxColumnComponent);
        let columns = [];
        if (fields.size === 0) {
            this.values.forEach((value) => {
                const ref = factoryColumn.create(this.viewRef.injector);
                ref.instance.header = value.displayName;
                ref.instance.field = value.member;
                ref.instance.parent = parent;
                ref.instance.width = MINIMUM_COLUMN_WIDTH + 'px';
                ref.instance.sortable = true;
                ref.instance.dataType = value.dataType || this.resolveDataTypes(data[0][value.member]);
                ref.instance.formatter = value.formatter;
                columns.push(ref.instance);
            });
            return columns;
        }
        const first = fields.keys().next().value;
        const dim = fields.get(first).dimension;
        let currentFields = fields;
        if (dim && dim.sortDirection) {
            const entries = Array.from(fields.entries());
            const expressions = [{
                    dir: dim.sortDirection,
                    fieldName: dim.memberName,
                    strategy: DefaultPivotSortingStrategy.instance()
                }];
            const sorted = DataUtil.sort(cloneArray(entries, true), expressions, this.sortStrategy, this.gridAPI.grid);
            currentFields = new Map(sorted);
        }
        currentFields.forEach((value) => {
            let shouldGenerate = true;
            if (data.length === 0) {
                shouldGenerate = false;
            }
            if (shouldGenerate && (value.children == null || value.children.length === 0 || value.children.size === 0)) {
                const col = this.createColumnForDimension(value, data, parent, this.hasMultipleValues);
                columns.push(col);
                if (this.hasMultipleValues) {
                    const measureChildren = this.getMeasureChildren(factoryColumn, data, col, false, value.dimension.width);
                    col.children.reset(measureChildren);
                    columns = columns.concat(measureChildren);
                }
            }
            else if (shouldGenerate) {
                const col = this.createColumnForDimension(value, data, parent, true);
                if (value.expandable) {
                    col.headerTemplate = this.headerTemplate;
                }
                const children = this.generateColumnHierarchy(value.children, data, col);
                const filteredChildren = children.filter(x => x.level === col.level + 1);
                columns.push(col);
                if (this.hasMultipleValues) {
                    let measureChildren = this.getMeasureChildren(factoryColumn, data, col, true, value.dimension.width);
                    const nestedChildren = filteredChildren;
                    //const allChildren = children.concat(measureChildren);
                    col.children.reset(nestedChildren);
                    columns = columns.concat(children);
                    if (value.dimension.childLevel) {
                        const sibling = this.createColumnForDimension(value, data, parent, true);
                        columns.push(sibling);
                        measureChildren = this.getMeasureChildren(factoryColumn, data, sibling, false, value.dimension?.width);
                        sibling.children.reset(measureChildren);
                        columns = columns.concat(measureChildren);
                    }
                }
                else {
                    col.children.reset(filteredChildren);
                    columns = columns.concat(children);
                    if (value.dimension.childLevel) {
                        const sibling = this.createColumnForDimension(value, data, parent, false);
                        columns.push(sibling);
                    }
                }
            }
        });
        return columns;
    }
    createColumnForDimension(value, data, parent, isGroup) {
        const factoryColumn = this.resolver.resolveComponentFactory(IgxColumnComponent);
        const factoryColumnGroup = this.resolver.resolveComponentFactory(IgxColumnGroupComponent);
        const key = value.value;
        const ref = isGroup ?
            factoryColumnGroup.create(this.viewRef.injector) :
            factoryColumn.create(this.viewRef.injector);
        ref.instance.header = parent != null ? key.split(parent.header + this.pivotKeys.columnDimensionSeparator)[1] : key;
        ref.instance.field = key;
        ref.instance.parent = parent;
        ref.instance.width = this.resolveColumnDimensionWidth(value.dimension);
        const valueDefinition = this.values[0];
        ref.instance.dataType = valueDefinition?.dataType || this.resolveDataTypes(data[0][valueDefinition?.member]);
        ref.instance.formatter = valueDefinition?.formatter;
        ref.instance.sortable = true;
        ref.changeDetectorRef.detectChanges();
        return ref.instance;
    }
    resolveColumnDimensionWidth(dim) {
        if (dim.width) {
            return dim.width;
        }
        return this.superCompactMode ? MINIMUM_COLUMN_WIDTH_SUPER_COMPACT + 'px' : MINIMUM_COLUMN_WIDTH + 'px';
    }
    getMeasureChildren(colFactory, data, parent, hidden, parentWidth) {
        const cols = [];
        const count = this.values.length;
        const width = parentWidth ? parseInt(parentWidth, 10) / count :
            this.superCompactMode ? MINIMUM_COLUMN_WIDTH_SUPER_COMPACT : MINIMUM_COLUMN_WIDTH;
        const isPercent = parentWidth && parentWidth.indexOf('%') !== -1;
        this.values.forEach(val => {
            const ref = colFactory.create(this.viewRef.injector);
            ref.instance.header = val.displayName || val.member;
            ref.instance.field = parent.field + this.pivotKeys.columnDimensionSeparator + val.member;
            ref.instance.parent = parent;
            ref.instance.width = isPercent ? width + '%' : width + 'px';
            ref.instance.hidden = hidden;
            ref.instance.sortable = true;
            ref.instance.dataType = val.dataType || this.resolveDataTypes(data[0][val.member]);
            ref.instance.formatter = val.formatter;
            ref.changeDetectorRef.detectChanges();
            cols.push(ref.instance);
        });
        return cols;
    }
    /**
    * @hidden @internal
    */
    get template() {
        const allEnabledDimensions = this.rowDimensions.concat(this.columnDimensions);
        if (allEnabledDimensions.length === 0 && this.values.length === 0) {
            // no enabled values and dimensions
            return this.emptyPivotGridTemplate || this.defaultEmptyPivotGridTemplate;
        }
        super.template;
    }
}
IgxPivotGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridComponent, deps: [{ token: i1.IgxGridSelectionService }, { token: i2.IgxPivotColumnResizingService }, { token: i3.GridBaseAPIService }, { token: i4.IgxFlatTransactionFactory }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }, { token: i0.IterableDiffers }, { token: i0.ViewContainerRef }, { token: i0.ApplicationRef }, { token: i0.NgModuleRef }, { token: i0.Injector }, { token: i5.IgxPivotGridNavigationService }, { token: i6.IgxFilteringService }, { token: IgxOverlayService }, { token: i7.IgxGridSummaryService }, { token: DisplayDensityToken, optional: true }, { token: LOCALE_ID }, { token: i8.PlatformUtil }, { token: IgxGridTransaction, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxPivotGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxPivotGridComponent, selector: "igx-pivot-grid", inputs: { pivotConfiguration: "pivotConfiguration", showPivotConfigurationUI: "showPivotConfigurationUI", superCompactMode: "superCompactMode", displayDensity: "displayDensity", addRowEmptyTemplate: "addRowEmptyTemplate", snackbarDisplayTime: "snackbarDisplayTime", defaultExpandState: "defaultExpandState", pagingMode: "pagingMode", hideRowSelectors: "hideRowSelectors", rowDraggable: "rowDraggable", allowAdvancedFiltering: "allowAdvancedFiltering", filterMode: "filterMode", allowFiltering: "allowFiltering", page: "page", paging: "paging", perPage: "perPage", summaryRowHeight: "summaryRowHeight", rowEditable: "rowEditable", pinning: "pinning", summaryPosition: "summaryPosition", summaryCalculationMode: "summaryCalculationMode", showSummaryOnCollapse: "showSummaryOnCollapse", batchEditing: "batchEditing", id: "id", data: "data", totalRecords: "totalRecords", emptyPivotGridTemplate: "emptyPivotGridTemplate" }, outputs: { dimensionsChange: "dimensionsChange", dimensionsSortingExpressionsChange: "dimensionsSortingExpressionsChange", valuesChange: "valuesChange", cellEdit: "cellEdit", cellEditDone: "cellEditDone", cellEditEnter: "cellEditEnter", cellEditExit: "cellEditExit", columnMovingStart: "columnMovingStart", columnMoving: "columnMoving", columnMovingEnd: "columnMovingEnd", columnPin: "columnPin", columnPinned: "columnPinned", rowAdd: "rowAdd", rowAdded: "rowAdded", rowDeleted: "rowDeleted", rowDelete: "rowDelete", rowDragStart: "rowDragStart", rowDragEnd: "rowDragEnd", rowEditEnter: "rowEditEnter", rowEdit: "rowEdit", rowEditDone: "rowEditDone", rowEditExit: "rowEditExit", rowPinning: "rowPinning", rowPinned: "rowPinned" }, host: { properties: { "attr.role": "this.role", "class.igx-grid__pivot--super-compact": "this.superCompactMode", "attr.id": "this.id" } }, providers: [
        IgxGridCRUDService,
        IgxGridSummaryService,
        IgxGridSelectionService,
        GridBaseAPIService,
        { provide: IGX_GRID_BASE, useExisting: IgxPivotGridComponent },
        { provide: IgxFilteringService, useClass: IgxPivotFilteringService },
        IgxPivotGridNavigationService,
        IgxPivotColumnResizingService,
        IgxForOfSyncService,
        IgxForOfScrollSyncService
    ], viewQueries: [{ propertyName: "theadRow", first: true, predicate: IgxPivotHeaderRowComponent, descendants: true, static: true }, { propertyName: "recordTemplate", first: true, predicate: ["record_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "headerTemplate", first: true, predicate: ["headerTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "resizeLine", first: true, predicate: IgxPivotGridColumnResizerComponent, descendants: true }, { propertyName: "defaultEmptyPivotGridTemplate", first: true, predicate: ["emptyPivotGridTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "excelStyleFilteringComponents", predicate: IgxGridExcelStyleFilteringComponent, descendants: true, read: IgxGridExcelStyleFilteringComponent }, { propertyName: "rowDimensionContentCollection", predicate: IgxPivotRowDimensionContentComponent, descendants: true }, { propertyName: "verticalRowDimScrollContainers", predicate: ["verticalRowDimScrollContainer"], descendants: true, read: IgxGridForOfDirective }], usesInheritance: true, ngImport: i0, template: "<!-- Toolbar area -->\n<ng-content select=\"igx-grid-toolbar\"></ng-content>\n\n<!-- Grid table head row area -->\n<igx-pivot-header-row class=\"igx-grid-thead igx-grid-thead--pivot\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [density]=\"displayDensity\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (scroll)=\"preventHeaderScroll($event)\"\n>\n</igx-pivot-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <ng-container *ngTemplateOutlet=\"rowDimensions.length ? defaultRowDimensionsTemplate : emptyRowDimensionsTemplate; context: this\"></ng-container>\n    <div class=\"igx-grid__tbody-content\" tabindex=\"0\" [attr.role]=\"dataView.length ? null : 'row'\" (keydown)=\"navigation.handleNavigation($event)\" (focus)=\"navigation.focusTbody($event)\"\n        (dragStop)=\"selectionService.dragMode = $event\" (scroll)='preventContainerScroll($event)'\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth || null' #tbody [attr.aria-activedescendant]=\"activeDescendant\">\n        <span *ngIf=\"hasMovableColumns && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"hasMovableColumns && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"data\n        | pivotGridFilter:pivotConfiguration:filterStrategy:advancedFilteringExpressionsTree:filteringPipeTrigger:pipeTrigger\n        | pivotGridSort:pivotConfiguration:sortStrategy:pipeTrigger\n        | pivotGridRow:pivotConfiguration:expansionStates:pipeTrigger:sortingExpressions\n        | pivotGridColumn:pivotConfiguration:expansionStates:pipeTrigger:sortingExpressions\n        | pivotGridAutoTransform:pivotConfiguration:pipeTrigger\n        | pivotGridColumnSort:sortingExpressions:sortStrategy:pipeTrigger\n        | pivotGridRowExpansion:pivotConfiguration:expansionStates:defaultExpandState:pipeTrigger\"\n            let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight'\n            [igxForItemSize]=\"hasColumnLayouts ? rowHeight * multiRowLayoutRowSize + 1 : renderedRowHeight\"\n            [igxGridForOfVariableSizes]='false'\n            #verticalScrollContainer>\n            <ng-template\n                [igxTemplateOutlet]='recordTemplate'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex)'\n                (cachedViewLoaded)='cachedViewLoaded($event)'>\n            </ng-template>\n        </ng-template>\n        <ng-template #record_template let-rowIndex=\"index\" let-rowData>\n            <igx-pivot-row [style.height.px]=\"renderedRowHeight\" [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-pivot-row>\n        </ng-template>\n\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <igc-trial-watermark></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"hasMovableColumns && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n    <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\" (pointerdown)=\"$event.preventDefault()\">\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div #igxBodyOverlayOutlet=\"overlay-outlet\" igxOverlayOutlet></div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\" (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='EMPTY_DATA' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" #tfoot>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n    </span>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n<igx-pivot-grid-column-resizer [restrictResizerTop]=\"theadRow.nativeElement.clientHeight\" *ngIf=\"colResizingService.showResizer\"></igx-pivot-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n\n<ng-template #headerTemplate let-column>\n    <div class=\"igx-grid__tr--header\">\n        <igx-icon [attr.draggable]=\"false\"\n                  (click)=\"toggleColumn(column)\">\n                  {{getColumnGroupExpandState(column) ? 'chevron_right' : 'expand_more'}}</igx-icon>\n        {{column.header}}\n    </div>\n</ng-template>\n\n<ng-template #defaultRowDimensionsTemplate>\n    <div tabindex=\"0\" [style.height.px]='totalHeight' *ngFor='let dim of rowDimensions; let dimIndex = index;' #rowDimensionContainer role=\"rowgroup\" class='igx-grid__tbody-pivot-dimension' (focus)=\"navigation.focusTbody($event)\" (keydown)=\"navigation.handleNavigation($event)\">\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"dataView\n        | pivotGridCellMerging:pivotConfiguration:dim:pipeTrigger\"\n                     let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n                     [igxForContainerSize]='calcHeight'\n                     [igxForItemSize]=\"renderedRowHeight\"\n                     [igxForSizePropName]='\"height\"'\n                     #verticalRowDimScrollContainer>\n            <igx-pivot-row-dimension-content role='row' class=\"igx-grid-thead\" [grid]=\"this\"\n                                             [dimension]='rowData.dimensions[dimIndex]'\n                                             [rootDimension]='dim'\n                                             [style.height.px]=\"renderedRowHeight * (rowData.rowSpan || 1)\"\n                                             [rowIndex]='rowIndex' [rowData]='rowData'\n                                             [density]=\"displayDensity\" [width]=\"rowDimensionWidthToPixels(dim)\">\n            </igx-pivot-row-dimension-content>\n        </ng-template>\n    </div>\n</ng-template>\n<ng-template #emptyRowDimensionsTemplate>\n    <div tabindex=\"0\" *ngIf='columnDimensions.length > 0 || values.length > 0' #rowDimensionContainer role=\"rowgroup\" class='igx-grid__tbody-pivot-dimension' (focus)=\"navigation.focusTbody($event)\" (keydown)=\"navigation.handleNavigation($event)\">\n        <igx-pivot-row-dimension-content role='row' class=\"igx-grid-thead\" [grid]=\"this\"\n            [dimension]='emptyRowDimension'\n            [rootDimension]='emptyRowDimension'\n            [rowIndex]='0' [rowData]='dataView[0]'\n            [density]=\"displayDensity\" [width]=\"rowDimensionWidthToPixels(emptyRowDimension)\">\n        </igx-pivot-row-dimension-content>\n    </div>\n</ng-template>\n\n<ng-template #emptyPivotGridTemplate>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{resourceStrings.igx_grid_pivot_empty_message}}</span>\n    </span>\n</ng-template>\n\n<div [hidden]='true'>\n    <igx-grid-excel-style-filtering [maxHeight]='excelStyleFilterMaxHeight' [minHeight]='excelStyleFilterMinHeight'>\n        <div igxExcelStyleColumnOperations [hidden]='true'></div>\n        <igx-excel-style-filter-operations>\n            <igx-excel-style-search></igx-excel-style-search>\n        </igx-excel-style-filter-operations>\n    </igx-grid-excel-style-filtering>\n</div>\n", components: [{ type: i9.IgxPivotHeaderRowComponent, selector: "igx-pivot-header-row" }, { type: i10.IgxPivotRowComponent, selector: "igx-pivot-row", inputs: ["selected", "data"] }, { type: i11.IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: ["id", "isIndeterminate", "textVisibility", "text"] }, { type: i12.IgxSnackbarComponent, selector: "igx-snackbar", inputs: ["id", "actionText", "positionSettings"], outputs: ["clicked", "animationStarted", "animationDone"] }, { type: i13.IgxPivotGridColumnResizerComponent, selector: "igx-pivot-grid-column-resizer" }, { type: i14.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i15.IgxPivotRowDimensionContentComponent, selector: "igx-pivot-row-dimension-content", inputs: ["rowIndex", "dimension", "rootDimension", "rowData"] }, { type: i16.IgxGridExcelStyleFilteringComponent, selector: "igx-grid-excel-style-filtering", inputs: ["column", "minHeight", "maxHeight"], outputs: ["loadingStart", "loadingEnd", "initialized", "sortingChanged", "columnChange", "listDataLoaded"] }, { type: i17.IgxExcelStyleSearchComponent, selector: "igx-excel-style-search" }], directives: [{ type: i18.IgxGridBodyDirective, selector: "[igxGridBody]" }, { type: i19.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i20.IgxGridDragSelectDirective, selector: "[igxGridDragSelect]", inputs: ["igxGridDragSelect"], outputs: ["dragStop", "dragScroll"] }, { type: i19.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i21.IgxColumnMovingDropDirective, selector: "[igxColumnMovingDrop]", inputs: ["igxColumnMovingDrop"] }, { type: i22.IgxGridForOfDirective, selector: "[igxGridFor][igxGridForOf]", inputs: ["igxGridForOf", "igxGridForOfUniqueSizeCache", "igxGridForOfVariableSizes"], outputs: ["dataChanging"] }, { type: i23.IgxTemplateOutletDirective, selector: "[igxTemplateOutlet]", inputs: ["igxTemplateOutletContext", "igxTemplateOutlet"], outputs: ["viewCreated", "viewMoved", "cachedViewLoaded", "beforeViewDetach"] }, { type: i19.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i19.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i24.IgxToggleDirective, selector: "[igxToggle]", inputs: ["id"], outputs: ["opened", "opening", "closed", "closing", "appended"], exportAs: ["toggle"] }, { type: i24.IgxOverlayOutletDirective, selector: "[igxOverlayOutlet]", exportAs: ["overlay-outlet"] }, { type: i19.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i16.IgxExcelStyleColumnOperationsTemplateDirective, selector: "igx-excel-style-column-operations,[igxExcelStyleColumnOperations]" }, { type: i16.IgxExcelStyleFilterOperationsTemplateDirective, selector: "igx-excel-style-filter-operations,[igxExcelStyleFilterOperations]" }], pipes: { "pivotGridRowExpansion": i25.IgxPivotRowExpansionPipe, "pivotGridColumnSort": i25.IgxPivotGridColumnSortingPipe, "pivotGridAutoTransform": i25.IgxPivotAutoTransform, "pivotGridColumn": i25.IgxPivotColumnPipe, "pivotGridRow": i25.IgxPivotRowPipe, "pivotGridSort": i25.IgxPivotGridSortingPipe, "pivotGridFilter": i25.IgxPivotGridFilterPipe, "igxGridRowClasses": i26.IgxGridRowClassesPipe, "igxGridRowStyles": i26.IgxGridRowStylesPipe, "pivotGridCellMerging": i25.IgxPivotCellMergingPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
__decorate([
    WatchChanges()
], IgxPivotGridComponent.prototype, "hideRowSelectors", null);
__decorate([
    WatchChanges()
], IgxPivotGridComponent.prototype, "rowEditable", null);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, selector: 'igx-pivot-grid', providers: [
                        IgxGridCRUDService,
                        IgxGridSummaryService,
                        IgxGridSelectionService,
                        GridBaseAPIService,
                        { provide: IGX_GRID_BASE, useExisting: IgxPivotGridComponent },
                        { provide: IgxFilteringService, useClass: IgxPivotFilteringService },
                        IgxPivotGridNavigationService,
                        IgxPivotColumnResizingService,
                        IgxForOfSyncService,
                        IgxForOfScrollSyncService
                    ], template: "<!-- Toolbar area -->\n<ng-content select=\"igx-grid-toolbar\"></ng-content>\n\n<!-- Grid table head row area -->\n<igx-pivot-header-row class=\"igx-grid-thead igx-grid-thead--pivot\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [density]=\"displayDensity\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (scroll)=\"preventHeaderScroll($event)\"\n>\n</igx-pivot-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <ng-container *ngTemplateOutlet=\"rowDimensions.length ? defaultRowDimensionsTemplate : emptyRowDimensionsTemplate; context: this\"></ng-container>\n    <div class=\"igx-grid__tbody-content\" tabindex=\"0\" [attr.role]=\"dataView.length ? null : 'row'\" (keydown)=\"navigation.handleNavigation($event)\" (focus)=\"navigation.focusTbody($event)\"\n        (dragStop)=\"selectionService.dragMode = $event\" (scroll)='preventContainerScroll($event)'\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth || null' #tbody [attr.aria-activedescendant]=\"activeDescendant\">\n        <span *ngIf=\"hasMovableColumns && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"hasMovableColumns && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"data\n        | pivotGridFilter:pivotConfiguration:filterStrategy:advancedFilteringExpressionsTree:filteringPipeTrigger:pipeTrigger\n        | pivotGridSort:pivotConfiguration:sortStrategy:pipeTrigger\n        | pivotGridRow:pivotConfiguration:expansionStates:pipeTrigger:sortingExpressions\n        | pivotGridColumn:pivotConfiguration:expansionStates:pipeTrigger:sortingExpressions\n        | pivotGridAutoTransform:pivotConfiguration:pipeTrigger\n        | pivotGridColumnSort:sortingExpressions:sortStrategy:pipeTrigger\n        | pivotGridRowExpansion:pivotConfiguration:expansionStates:defaultExpandState:pipeTrigger\"\n            let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight'\n            [igxForItemSize]=\"hasColumnLayouts ? rowHeight * multiRowLayoutRowSize + 1 : renderedRowHeight\"\n            [igxGridForOfVariableSizes]='false'\n            #verticalScrollContainer>\n            <ng-template\n                [igxTemplateOutlet]='recordTemplate'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex)'\n                (cachedViewLoaded)='cachedViewLoaded($event)'>\n            </ng-template>\n        </ng-template>\n        <ng-template #record_template let-rowIndex=\"index\" let-rowData>\n            <igx-pivot-row [style.height.px]=\"renderedRowHeight\" [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-pivot-row>\n        </ng-template>\n\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <igc-trial-watermark></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"hasMovableColumns && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n    <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\" (pointerdown)=\"$event.preventDefault()\">\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div #igxBodyOverlayOutlet=\"overlay-outlet\" igxOverlayOutlet></div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\" (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='EMPTY_DATA' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" #tfoot>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n    </span>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n<igx-pivot-grid-column-resizer [restrictResizerTop]=\"theadRow.nativeElement.clientHeight\" *ngIf=\"colResizingService.showResizer\"></igx-pivot-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n\n<ng-template #headerTemplate let-column>\n    <div class=\"igx-grid__tr--header\">\n        <igx-icon [attr.draggable]=\"false\"\n                  (click)=\"toggleColumn(column)\">\n                  {{getColumnGroupExpandState(column) ? 'chevron_right' : 'expand_more'}}</igx-icon>\n        {{column.header}}\n    </div>\n</ng-template>\n\n<ng-template #defaultRowDimensionsTemplate>\n    <div tabindex=\"0\" [style.height.px]='totalHeight' *ngFor='let dim of rowDimensions; let dimIndex = index;' #rowDimensionContainer role=\"rowgroup\" class='igx-grid__tbody-pivot-dimension' (focus)=\"navigation.focusTbody($event)\" (keydown)=\"navigation.handleNavigation($event)\">\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"dataView\n        | pivotGridCellMerging:pivotConfiguration:dim:pipeTrigger\"\n                     let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n                     [igxForContainerSize]='calcHeight'\n                     [igxForItemSize]=\"renderedRowHeight\"\n                     [igxForSizePropName]='\"height\"'\n                     #verticalRowDimScrollContainer>\n            <igx-pivot-row-dimension-content role='row' class=\"igx-grid-thead\" [grid]=\"this\"\n                                             [dimension]='rowData.dimensions[dimIndex]'\n                                             [rootDimension]='dim'\n                                             [style.height.px]=\"renderedRowHeight * (rowData.rowSpan || 1)\"\n                                             [rowIndex]='rowIndex' [rowData]='rowData'\n                                             [density]=\"displayDensity\" [width]=\"rowDimensionWidthToPixels(dim)\">\n            </igx-pivot-row-dimension-content>\n        </ng-template>\n    </div>\n</ng-template>\n<ng-template #emptyRowDimensionsTemplate>\n    <div tabindex=\"0\" *ngIf='columnDimensions.length > 0 || values.length > 0' #rowDimensionContainer role=\"rowgroup\" class='igx-grid__tbody-pivot-dimension' (focus)=\"navigation.focusTbody($event)\" (keydown)=\"navigation.handleNavigation($event)\">\n        <igx-pivot-row-dimension-content role='row' class=\"igx-grid-thead\" [grid]=\"this\"\n            [dimension]='emptyRowDimension'\n            [rootDimension]='emptyRowDimension'\n            [rowIndex]='0' [rowData]='dataView[0]'\n            [density]=\"displayDensity\" [width]=\"rowDimensionWidthToPixels(emptyRowDimension)\">\n        </igx-pivot-row-dimension-content>\n    </div>\n</ng-template>\n\n<ng-template #emptyPivotGridTemplate>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{resourceStrings.igx_grid_pivot_empty_message}}</span>\n    </span>\n</ng-template>\n\n<div [hidden]='true'>\n    <igx-grid-excel-style-filtering [maxHeight]='excelStyleFilterMaxHeight' [minHeight]='excelStyleFilterMinHeight'>\n        <div igxExcelStyleColumnOperations [hidden]='true'></div>\n        <igx-excel-style-filter-operations>\n            <igx-excel-style-search></igx-excel-style-search>\n        </igx-excel-style-filter-operations>\n    </igx-grid-excel-style-filtering>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.IgxGridSelectionService }, { type: i2.IgxPivotColumnResizingService }, { type: i3.GridBaseAPIService }, { type: i4.IgxFlatTransactionFactory }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }, { type: i0.IterableDiffers }, { type: i0.ViewContainerRef }, { type: i0.ApplicationRef }, { type: i0.NgModuleRef }, { type: i0.Injector }, { type: i5.IgxPivotGridNavigationService }, { type: i6.IgxFilteringService }, { type: i4.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }, { type: i7.IgxGridSummaryService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i8.PlatformUtil }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IgxGridTransaction]
                }] }]; }, propDecorators: { dimensionsChange: [{
                type: Output
            }], dimensionsSortingExpressionsChange: [{
                type: Output
            }], valuesChange: [{
                type: Output
            }], theadRow: [{
                type: ViewChild,
                args: [IgxPivotHeaderRowComponent, { static: true }]
            }], pivotConfiguration: [{
                type: Input
            }], showPivotConfigurationUI: [{
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], superCompactMode: [{
                type: HostBinding,
                args: ['class.igx-grid__pivot--super-compact']
            }, {
                type: Input
            }], displayDensity: [{
                type: Input
            }], recordTemplate: [{
                type: ViewChild,
                args: ['record_template', { read: TemplateRef, static: true }]
            }], headerTemplate: [{
                type: ViewChild,
                args: ['headerTemplate', { read: TemplateRef, static: true }]
            }], resizeLine: [{
                type: ViewChild,
                args: [IgxPivotGridColumnResizerComponent]
            }], excelStyleFilteringComponents: [{
                type: ViewChildren,
                args: [IgxGridExcelStyleFilteringComponent, { read: IgxGridExcelStyleFilteringComponent }]
            }], rowDimensionContentCollection: [{
                type: ViewChildren,
                args: [IgxPivotRowDimensionContentComponent]
            }], verticalRowDimScrollContainers: [{
                type: ViewChildren,
                args: ['verticalRowDimScrollContainer', { read: IgxGridForOfDirective }]
            }], addRowEmptyTemplate: [{
                type: Input
            }], snackbarDisplayTime: [{
                type: Input
            }], cellEdit: [{
                type: Output
            }], cellEditDone: [{
                type: Output
            }], cellEditEnter: [{
                type: Output
            }], cellEditExit: [{
                type: Output
            }], columnMovingStart: [{
                type: Output
            }], columnMoving: [{
                type: Output
            }], columnMovingEnd: [{
                type: Output
            }], columnPin: [{
                type: Output
            }], columnPinned: [{
                type: Output
            }], rowAdd: [{
                type: Output
            }], rowAdded: [{
                type: Output
            }], rowDeleted: [{
                type: Output
            }], rowDelete: [{
                type: Output
            }], rowDragStart: [{
                type: Output
            }], rowDragEnd: [{
                type: Output
            }], rowEditEnter: [{
                type: Output
            }], rowEdit: [{
                type: Output
            }], rowEditDone: [{
                type: Output
            }], rowEditExit: [{
                type: Output
            }], rowPinning: [{
                type: Output
            }], rowPinned: [{
                type: Output
            }], defaultExpandState: [{
                type: Input
            }], pagingMode: [{
                type: Input
            }], hideRowSelectors: [{
                type: Input
            }], rowDraggable: [{
                type: Input
            }], allowAdvancedFiltering: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], allowFiltering: [{
                type: Input
            }], page: [{
                type: Input
            }], paging: [{
                type: Input
            }], perPage: [{
                type: Input
            }], summaryRowHeight: [{
                type: Input
            }], rowEditable: [{
                type: Input
            }], pinning: [{
                type: Input
            }], summaryPosition: [{
                type: Input
            }], summaryCalculationMode: [{
                type: Input
            }], showSummaryOnCollapse: [{
                type: Input
            }], batchEditing: [{
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], data: [{
                type: Input
            }], totalRecords: [{
                type: Input
            }], defaultEmptyPivotGridTemplate: [{
                type: ViewChild,
                args: ['emptyPivotGridTemplate', { read: TemplateRef, static: true }]
            }], emptyPivotGridTemplate: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3QtZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvcGl2b3QtZ3JpZC9waXZvdC1ncmlkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9waXZvdC1ncmlkL3Bpdm90LWdyaWQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFHSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULFlBQVksRUFHWixXQUFXLEVBQ1gsTUFBTSxFQUNOLEtBQUssRUFFTCxTQUFTLEVBR1QsTUFBTSxFQUNOLFFBQVEsRUFFUixXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFLZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUM3RyxPQUFPLEVBQXdCLGFBQWEsRUFBVyxNQUFNLDBCQUEwQixDQUFDO0FBQ3hGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBdUYsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNySyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUs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QkFENUIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIEl0ZXJhYmxlRGlmZmVycyxcbiAgICBMT0NBTEVfSUQsXG4gICAgTmdab25lLFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgT3B0aW9uYWwsXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3Q2hpbGRyZW4sXG4gICAgVmlld0NvbnRhaW5lclJlZixcbiAgICBJbmplY3RvcixcbiAgICBOZ01vZHVsZVJlZixcbiAgICBBcHBsaWNhdGlvblJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneEdyaWRCYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZ3JpZC1iYXNlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vZmlsdGVyaW5nL2dyaWQtZmlsdGVyaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4Rm9yT2ZTeW5jU2VydmljZSwgSWd4Rm9yT2ZTY3JvbGxTeW5jU2VydmljZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvZm9yLW9mL2Zvcl9vZi5zeW5jLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSwgR3JpZFR5cGUsIElHWF9HUklEX0JBU0UsIFJvd1R5cGUgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSWd4R3JpZENSVURTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2NydWQuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkU3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi9zdW1tYXJpZXMvZ3JpZC1zdW1tYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVZPVF9LRVlTLCBJRGltZW5zaW9uc0NoYW5nZSwgSVBpdm90Q29uZmlndXJhdGlvbiwgSVBpdm90RGltZW5zaW9uLCBJUGl2b3RWYWx1ZSwgSVZhbHVlc0NoYW5nZSwgUGl2b3REaW1lbnNpb25UeXBlIH0gZnJvbSAnLi9waXZvdC1ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hQaXZvdEhlYWRlclJvd0NvbXBvbmVudCB9IGZyb20gJy4vcGl2b3QtaGVhZGVyLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4Q29sdW1uR3JvdXBDb21wb25lbnQgfSBmcm9tICcuLi9jb2x1bW5zL2NvbHVtbi1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4Q29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi4vY29sdW1ucy9jb2x1bW4uY29tcG9uZW50JztcbmltcG9ydCB7IFBpdm90VXRpbCB9IGZyb20gJy4vcGl2b3QtdXRpbCc7XG5pbXBvcnQgeyBGaWx0ZXJNb2RlLCBHcmlkUGFnaW5nTW9kZSwgR3JpZFN1bW1hcnlDYWxjdWxhdGlvbk1vZGUsIEdyaWRTdW1tYXJ5UG9zaXRpb24gfSBmcm9tICcuLi9jb21tb24vZW51bXMnO1xuaW1wb3J0IHsgV2F0Y2hDaGFuZ2VzIH0gZnJvbSAnLi4vd2F0Y2gtY2hhbmdlcyc7XG5pbXBvcnQgeyBPdmVybGF5U2V0dGluZ3MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wdWJsaWNfYXBpJztcbmltcG9ydCB7XG4gICAgSUNlbGxQb3NpdGlvbixcbiAgICBJQ29sdW1uTW92aW5nRW5kRXZlbnRBcmdzLCBJQ29sdW1uTW92aW5nRXZlbnRBcmdzLCBJQ29sdW1uTW92aW5nU3RhcnRFdmVudEFyZ3MsXG4gICAgSUNvbHVtblZpc2liaWxpdHlDaGFuZ2VkRXZlbnRBcmdzLCBJR3JpZEVkaXREb25lRXZlbnRBcmdzLCBJR3JpZEVkaXRFdmVudEFyZ3MsXG4gICAgSUdyaWRUb29sYmFyRXhwb3J0RXZlbnRBcmdzLFxuICAgIElQaW5Db2x1bW5DYW5jZWxsYWJsZUV2ZW50QXJncywgSVBpbkNvbHVtbkV2ZW50QXJncywgSVBpblJvd0V2ZW50QXJncywgSVJvd0RhdGFFdmVudEFyZ3MsIElSb3dEcmFnRW5kRXZlbnRBcmdzLCBJUm93RHJhZ1N0YXJ0RXZlbnRBcmdzXG59IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgSWd4R3JpZFJvd0NvbXBvbmVudCB9IGZyb20gJy4uL2dyaWQvZ3JpZC1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IERyb3BQb3NpdGlvbiB9IGZyb20gJy4uL21vdmluZy9tb3Zpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBEaW1lbnNpb25WYWx1ZXNGaWx0ZXJpbmdTdHJhdGVneSwgTm9vcFBpdm90RGltZW5zaW9uc1N0cmF0ZWd5IH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3Bpdm90LXN0cmF0ZWd5JztcbmltcG9ydCB7IElneEdyaWRFeGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50IH0gZnJvbSAnLi4vZmlsdGVyaW5nL2V4Y2VsLXN0eWxlL2dyaWQuZXhjZWwtc3R5bGUtZmlsdGVyaW5nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hQaXZvdEdyaWROYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcGl2b3QtZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4UGl2b3RDb2x1bW5SZXNpemluZ1NlcnZpY2UgfSBmcm9tICcuLi9yZXNpemluZy9waXZvdC1ncmlkL3Bpdm90LXJlc2l6aW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4RmxhdFRyYW5zYWN0aW9uRmFjdG9yeSwgSWd4T3ZlcmxheVNlcnZpY2UsIFN0YXRlLCBUcmFuc2FjdGlvbiwgVHJhbnNhY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEaXNwbGF5RGVuc2l0eSwgRGlzcGxheURlbnNpdHlUb2tlbiwgSURlbnNpdHlDaGFuZ2VkRXZlbnRBcmdzLCBJRGlzcGxheURlbnNpdHlPcHRpb25zIH0gZnJvbSAnLi4vLi4vY29yZS9kaXNwbGF5RGVuc2l0eSc7XG5pbXBvcnQgeyBjbG9uZUFycmF5LCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneFBpdm90RmlsdGVyaW5nU2VydmljZSB9IGZyb20gJy4vcGl2b3QtZmlsdGVyaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0YVV0aWwgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7IElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWV4cHJlc3Npb25zLXRyZWUnO1xuaW1wb3J0IHsgSWd4R3JpZFRyYW5zYWN0aW9uIH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEdyaWRCYXNlQVBJU2VydmljZSB9IGZyb20gJy4uL2FwaS5zZXJ2aWNlJztcbmltcG9ydCB7IElneEdyaWRGb3JPZkRpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvZm9yLW9mL2Zvcl9vZi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4UGl2b3RSb3dEaW1lbnNpb25Db250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9waXZvdC1yb3ctZGltZW5zaW9uLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IElneFBpdm90R3JpZENvbHVtblJlc2l6ZXJDb21wb25lbnQgfSBmcm9tICcuLi9yZXNpemluZy9waXZvdC1ncmlkL3Bpdm90LXJlc2l6ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneEFjdGlvblN0cmlwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYWN0aW9uLXN0cmlwL2FjdGlvbi1zdHJpcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSVBhZ2VFdmVudEFyZ3MgfSBmcm9tICcuLi8uLi9wYWdpbmF0b3IvcGFnaW5hdG9yLWludGVyZmFjZXMnO1xuaW1wb3J0IHsgSVNvcnRpbmdFeHByZXNzaW9uLCBTb3J0aW5nRGlyZWN0aW9uIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRGVmYXVsdFBpdm90U29ydGluZ1N0cmF0ZWd5IH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3Bpdm90LXNvcnQtc3RyYXRlZ3knO1xuaW1wb3J0IHsgUGl2b3RTb3J0VXRpbCB9IGZyb20gJy4vcGl2b3Qtc29ydC11dGlsJztcbmltcG9ydCB7IEZpbHRlclV0aWwsIElGaWx0ZXJpbmdTdHJhdGVneSB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctc3RyYXRlZ3knO1xuXG5sZXQgTkVYVF9JRCA9IDA7XG5jb25zdCBNSU5JTVVNX0NPTFVNTl9XSURUSCA9IDIwMDtcbmNvbnN0IE1JTklNVU1fQ09MVU1OX1dJRFRIX1NVUEVSX0NPTVBBQ1QgPSAxMDQ7XG5cbi8qKlxuICogUGl2b3QgR3JpZCBwcm92aWRlcyBhIHdheSB0byBwcmVzZW50IGFuZCBtYW5pcHVsYXRlIGRhdGEgaW4gYSBwaXZvdCB0YWJsZSB2aWV3LlxuICpcbiAqIEBpZ3hNb2R1bGUgSWd4UGl2b3RHcmlkTW9kdWxlXG4gKiBAaWd4R3JvdXAgR3JpZHMgJiBMaXN0c1xuICogQGlneEtleXdvcmRzIHBpdm90LCBncmlkLCB0YWJsZVxuICogQGlneFRoZW1lIGlneC1ncmlkLXRoZW1lXG4gKiBAcmVtYXJrc1xuICogVGhlIElnbml0ZSBVSSBQaXZvdCBHcmlkIGlzIHVzZWQgZm9yIGdyb3VwaW5nIGFuZCBhZ2dyZWdhdGluZyBzaW1wbGUgZmxhdCBkYXRhIGludG8gYSBwaXZvdCB0YWJsZS4gIE9uY2UgZGF0YVxuICogaGFzIGJlZW4gYm91bmQgYW5kIHRoZSBkaW1lbnNpb25zIGFuZCB2YWx1ZXMgY29uZmlndXJlZCBpdCBjYW4gYmUgbWFuaXB1bGF0ZWQgdmlhIHNvcnRpbmcgYW5kIGZpbHRlcmluZy5cbiAqIEBleGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8aWd4LXBpdm90LWdyaWQgW2RhdGFdPVwiZGF0YVwiIFtwaXZvdENvbmZpZ3VyYXRpb25dPVwiY29uZmlndXJhdGlvblwiPlxuICogPC9pZ3gtcGl2b3QtZ3JpZD5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgICBzZWxlY3RvcjogJ2lneC1waXZvdC1ncmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3Bpdm90LWdyaWQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBJZ3hHcmlkQ1JVRFNlcnZpY2UsXG4gICAgICAgIElneEdyaWRTdW1tYXJ5U2VydmljZSxcbiAgICAgICAgSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIEdyaWRCYXNlQVBJU2VydmljZSxcbiAgICAgICAgeyBwcm92aWRlOiBJR1hfR1JJRF9CQVNFLCB1c2VFeGlzdGluZzogSWd4UGl2b3RHcmlkQ29tcG9uZW50IH0sXG4gICAgICAgIHsgcHJvdmlkZTogSWd4RmlsdGVyaW5nU2VydmljZSwgdXNlQ2xhc3M6IElneFBpdm90RmlsdGVyaW5nU2VydmljZSB9LFxuICAgICAgICBJZ3hQaXZvdEdyaWROYXZpZ2F0aW9uU2VydmljZSxcbiAgICAgICAgSWd4UGl2b3RDb2x1bW5SZXNpemluZ1NlcnZpY2UsXG4gICAgICAgIElneEZvck9mU3luY1NlcnZpY2UsXG4gICAgICAgIElneEZvck9mU2Nyb2xsU3luY1NlcnZpY2VcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneFBpdm90R3JpZENvbXBvbmVudCBleHRlbmRzIElneEdyaWRCYXNlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LFxuICAgIEdyaWRUeXBlLCBBZnRlclZpZXdJbml0IHtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgZGltZW5zaW9uIGNvbGxlY3Rpb24gaXMgY2hhbmdlZCB2aWEgdGhlIGdyaWQgY2hpcCBhcmVhLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBuZXcgZGltZW5zaW9uIGNvbGxlY3Rpb24gYW5kIGl0cyB0eXBlOlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcGl2b3QtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIlxuICAgICAqICAgICAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZSk9XCJkaW1lbnNpb25zQ2hhbmdlKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBkaW1lbnNpb25zQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxJRGltZW5zaW9uc0NoYW5nZT4oKTtcblxuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGEgZGltZW5zaW9uIGlzIHNvcnRlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcGl2b3QtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIlxuICAgICAqICAgICAgICAgICAgICAoZGltZW5zaW9uc1NvcnRpbmdFeHByZXNzaW9uc0NoYW5nZSk9XCJkaW1lbnNpb25zU29ydGluZ0V4cHJlc3Npb25zQ2hhbmdlKCRldmVudClcIj48L2lneC1waXZvdC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBkaW1lbnNpb25zU29ydGluZ0V4cHJlc3Npb25zQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxJU29ydGluZ0V4cHJlc3Npb25bXT4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgdmFsdWVzIGNvbGxlY3Rpb24gaXMgY2hhbmdlZCB2aWEgdGhlIGdyaWQgY2hpcCBhcmVhLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBuZXcgZGltZW5zaW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1waXZvdC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtoZWlnaHRdPVwiJzMwNXB4J1wiXG4gICAgICogICAgICAgICAgICAgICh2YWx1ZXNDaGFuZ2UpPVwidmFsdWVzQ2hhbmdlKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZhbHVlc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8SVZhbHVlc0NoYW5nZT4oKTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoSWd4UGl2b3RIZWFkZXJSb3dDb21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIHRoZWFkUm93OiBJZ3hQaXZvdEhlYWRlclJvd0NvbXBvbmVudDtcblxuICAgIEBJbnB1dCgpXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBwaXZvdCBjb25maWd1cmF0aW9uIHdpdGggYWxsIHJlbGF0ZWQgZGltZW5zaW9ucyBhbmQgdmFsdWVzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1waXZvdC1ncmlkIFtwaXZvdENvbmZpZ3VyYXRpb25dPVwiY29uZmlnXCI+PC9pZ3gtcGl2b3QtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHBpdm90Q29uZmlndXJhdGlvbih2YWx1ZTogSVBpdm90Q29uZmlndXJhdGlvbikge1xuICAgICAgICB0aGlzLl9waXZvdENvbmZpZ3VyYXRpb24gPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBpdm90Q29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bpdm90Q29uZmlndXJhdGlvbiB8fCB7IHJvd3M6IG51bGwsIGNvbHVtbnM6IG51bGwsIHZhbHVlczogbnVsbCwgZmlsdGVyczogbnVsbCB9O1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBwaXZvdCBjb25maWd1cmF0aW9uIHVpIGZvciB0aGUgcGl2b3QgZ3JpZCAtIGNoaXBzIGFuZCB0aGVpclxuICAgICAqIGNvcnJlc3BvbmRpbmcgY29udGFpbmVycyBmb3Igcm93LCBmaWx0ZXIsIGNvbHVtbiBkaW1lbnNpb25zIGFuZCB2YWx1ZXNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtcGl2b3QtZ3JpZCBbc2hvd1Bpdm90Q29uZmlndXJhdGlvblVJXT1cImZhbHNlXCI+PC9pZ3gtcGl2b3QtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvd1Bpdm90Q29uZmlndXJhdGlvblVJOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxuICAgIHB1YmxpYyByb2xlID0gJ2dyaWQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIGEgc3VwZXIgY29tcGFjdCB0aGVtZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIE92ZXJyaWRlcyB0aGUgZGlzcGxheURlbnNpdHkgb3B0aW9uIGlmIG9uZSBpcyBzZXQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1waXZvdC1ncmlkIFtzdXBlckNvbXBhY3RNb2RlXT1cInRydWVcIj48L2lneC1waXZvdC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWRfX3Bpdm90LS1zdXBlci1jb21wYWN0JylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgc3VwZXJDb21wYWN0TW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cGVyQ29tcGFjdE1vZGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzdXBlckNvbXBhY3RNb2RlKHZhbHVlKSB7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gd2FpdCBmb3IgdGhlIGN1cnJlbnQgZGV0ZWN0aW9uIGN5Y2xlIHRvIGVuZCBiZWZvcmUgdHJpZ2dlcmluZyBhIG5ldyBvbmUuXG4gICAgICAgICAgICB0aGlzLl9zdXBlckNvbXBhY3RNb2RlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgdGhlbWUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAqIFRoZSBkZWZhdWx0IHRoZW1lIGlzIGBjb21mb3J0YWJsZWAuXG4gICAgKiBBdmFpbGFibGUgb3B0aW9ucyBhcmUgYGNvbWZvcnRhYmxlYCwgYGNvc3lgLCBgY29tcGFjdGAuXG4gICAgKiBAcmVtYXJrc1xuICAgICogSWYgc2V0IHdoaWxlIHN1cGVyQ29tcGFjdE1vZGUgaXMgZW5hYmxlZCB3aWxsIGhhdmUgbm8gYWZmZWN0LlxuICAgICogYGBgdHlwZXNjcmlwdFxuICAgICogbGV0IGNvbXBvbmVudFRoZW1lID0gdGhpcy5jb21wb25lbnQuZGlzcGxheURlbnNpdHk7XG4gICAgKiBgYGBcbiAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBkaXNwbGF5RGVuc2l0eSgpOiBEaXNwbGF5RGVuc2l0eSB7XG4gICAgICAgIGlmICh0aGlzLnN1cGVyQ29tcGFjdE1vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBEaXNwbGF5RGVuc2l0eS5jb21wYWN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5kaXNwbGF5RGVuc2l0eTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFNldHMgdGhlIHRoZW1lIG9mIHRoZSBjb21wb25lbnQuXG4gICAgKi9cbiAgICBwdWJsaWMgc2V0IGRpc3BsYXlEZW5zaXR5KHZhbDogRGlzcGxheURlbnNpdHkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudERpc3BsYXlEZW5zaXR5ID0gdGhpcy5fZGlzcGxheURlbnNpdHk7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEZW5zaXR5ID0gdmFsIGFzIERpc3BsYXlEZW5zaXR5O1xuXG4gICAgICAgIGlmIChjdXJyZW50RGlzcGxheURlbnNpdHkgIT09IHRoaXMuX2Rpc3BsYXlEZW5zaXR5KSB7XG4gICAgICAgICAgICBjb25zdCBkZW5zaXR5Q2hhbmdlZEFyZ3M6IElEZW5zaXR5Q2hhbmdlZEV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgICAgICBvbGREZW5zaXR5OiBjdXJyZW50RGlzcGxheURlbnNpdHksXG4gICAgICAgICAgICAgICAgbmV3RGVuc2l0eTogdGhpcy5fZGlzcGxheURlbnNpdHlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMub25EZW5zaXR5Q2hhbmdlZC5lbWl0KGRlbnNpdHlDaGFuZ2VkQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3JlY29yZF90ZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyByZWNvcmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnaGVhZGVyVGVtcGxhdGUnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoSWd4UGl2b3RHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudClcbiAgICBwdWJsaWMgcmVzaXplTGluZTogSWd4UGl2b3RHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hHcmlkRXhjZWxTdHlsZUZpbHRlcmluZ0NvbXBvbmVudCwgeyByZWFkOiBJZ3hHcmlkRXhjZWxTdHlsZUZpbHRlcmluZ0NvbXBvbmVudCB9KVxuICAgIHB1YmxpYyBleGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50czogUXVlcnlMaXN0PElneEdyaWRFeGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hQaXZvdFJvd0RpbWVuc2lvbkNvbnRlbnRDb21wb25lbnQpXG4gICAgcHJvdGVjdGVkIHJvd0RpbWVuc2lvbkNvbnRlbnRDb2xsZWN0aW9uOiBRdWVyeUxpc3Q8SWd4UGl2b3RSb3dEaW1lbnNpb25Db250ZW50Q29tcG9uZW50PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbigndmVydGljYWxSb3dEaW1TY3JvbGxDb250YWluZXInLCB7IHJlYWQ6IElneEdyaWRGb3JPZkRpcmVjdGl2ZSB9KVxuICAgIHB1YmxpYyB2ZXJ0aWNhbFJvd0RpbVNjcm9sbENvbnRhaW5lcnM6IFF1ZXJ5TGlzdDxJZ3hHcmlkRm9yT2ZEaXJlY3RpdmU8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgYWRkUm93RW1wdHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc25hY2tiYXJEaXNwbGF5VGltZSA9IDYwMDA7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjZWxsRWRpdCA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRFZGl0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2VsbEVkaXREb25lID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZEVkaXREb25lRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2VsbEVkaXRFbnRlciA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRFZGl0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2VsbEVkaXRFeGl0ID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZEVkaXREb25lRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY29sdW1uTW92aW5nU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElDb2x1bW5Nb3ZpbmdTdGFydEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtbk1vdmluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbHVtbk1vdmluZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtbk1vdmluZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbHVtbk1vdmluZ0VuZEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblBpbiA9IG5ldyBFdmVudEVtaXR0ZXI8SVBpbkNvbHVtbkNhbmNlbGxhYmxlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY29sdW1uUGlubmVkID0gbmV3IEV2ZW50RW1pdHRlcjxJUGluQ29sdW1uRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93QWRkID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZEVkaXRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dBZGRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJvd0RhdGFFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dEZWxldGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJUm93RGF0YUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd0RlbGV0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRFZGl0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93RHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUm93RHJhZ1N0YXJ0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93RHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJvd0RyYWdFbmRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dFZGl0RW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd0VkaXQgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd0VkaXREb25lID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZEVkaXREb25lRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93RWRpdEV4aXQgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdERvbmVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dQaW5uaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUGluUm93RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93UGlubmVkID0gbmV3IEV2ZW50RW1pdHRlcjxJUGluUm93RXZlbnRBcmdzPigpO1xuXG4gICAgcHVibGljIGNvbHVtbkdyb3VwU3RhdGVzID0gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gICAgcHVibGljIGRpbWVuc2lvbkRhdGFDb2x1bW5zO1xuICAgIHB1YmxpYyBnZXQgcGl2b3RLZXlzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5waXZvdENvbmZpZ3VyYXRpb24ucGl2b3RLZXlzIHx8IERFRkFVTFRfUElWT1RfS0VZUztcbiAgICB9XG4gICAgcHVibGljIGlzUGl2b3QgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZHJhZ1Jvd0lEID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHB1YmxpYyBnZXQgcm9vdFN1bW1hcmllc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByb3dEaW1lbnNpb25SZXNpemluZyA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgX2VtcHR5Um93RGltZW5zaW9uOiBJUGl2b3REaW1lbnNpb24gPSB7IG1lbWJlck5hbWU6ICcnLCBlbmFibGVkOiB0cnVlLCBsZXZlbDogMCB9O1xuICAgIHB1YmxpYyBnZXQgZW1wdHlSb3dEaW1lbnNpb24oKTogSVBpdm90RGltZW5zaW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VtcHR5Um93RGltZW5zaW9uO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfZGVmYXVsdEV4cGFuZFN0YXRlID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIF9maWx0ZXJTdHJhdGVneTogSUZpbHRlcmluZ1N0cmF0ZWd5ID0gbmV3IERpbWVuc2lvblZhbHVlc0ZpbHRlcmluZ1N0cmF0ZWd5KCk7XG4gICAgcHJpdmF0ZSBfZGF0YTtcbiAgICBwcml2YXRlIF9maWx0ZXJlZERhdGE7XG4gICAgcHJpdmF0ZSBfcGl2b3RDb25maWd1cmF0aW9uOiBJUGl2b3RDb25maWd1cmF0aW9uID0geyByb3dzOiBudWxsLCBjb2x1bW5zOiBudWxsLCB2YWx1ZXM6IG51bGwsIGZpbHRlcnM6IG51bGwgfTtcbiAgICBwcml2YXRlIHBfaWQgPSBgaWd4LXBpdm90LWdyaWQtJHtORVhUX0lEKyt9YDtcbiAgICBwcml2YXRlIF9zdXBlckNvbXBhY3RNb2RlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAqIEdldHMvU2V0cyB0aGUgZGVmYXVsdCBleHBhbmQgc3RhdGUgZm9yIGFsbCByb3dzLlxuICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGRlZmF1bHRFeHBhbmRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRFeHBhbmRTdGF0ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGRlZmF1bHRFeHBhbmRTdGF0ZSh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdEV4cGFuZFN0YXRlID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHBhZ2luZ01vZGUoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBhZ2luZ01vZGUoX3ZhbDogR3JpZFBhZ2luZ01vZGUpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBoaWRlUm93U2VsZWN0b3JzKCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBoaWRlUm93U2VsZWN0b3JzKF92YWx1ZTogYm9vbGVhbikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGF1dG9HZW5lcmF0ZSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBhY3Rpb25TdHJpcDogSWd4QWN0aW9uU3RyaXBDb21wb25lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwYWdlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwYWdpbmdEb25lID0gbmV3IEV2ZW50RW1pdHRlcjxJUGFnZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHBlclBhZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHNob3VsZEdlbmVyYXRlOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbW92aW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB0b29sYmFyRXhwb3J0aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZFRvb2xiYXJFeHBvcnRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCByb3dEcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBzZXQgcm93RHJhZ2dhYmxlKF92YWw6IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBhbGxvd0FkdmFuY2VkRmlsdGVyaW5nKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBhbGxvd0FkdmFuY2VkRmlsdGVyaW5nKF92YWx1ZSkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGZpbHRlck1vZGUoKSB7XG4gICAgICAgIHJldHVybiBGaWx0ZXJNb2RlLnF1aWNrRmlsdGVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZmlsdGVyTW9kZShfdmFsdWU6IEZpbHRlck1vZGUpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBhbGxvd0ZpbHRlcmluZygpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYWxsb3dGaWx0ZXJpbmcoX3ZhbHVlKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzRmlyc3RQYWdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNMYXN0UGFnZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgcGFnZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBhZ2UoX3ZhbDogbnVtYmVyKSB7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBwYWdpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBhZ2luZyhfdmFsdWU6IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBwZXJQYWdlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHBlclBhZ2UoX3ZhbDogbnVtYmVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZENvbHVtbnMoKTogSWd4Q29sdW1uQ29tcG9uZW50W10ge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICovXG4gICAgcHVibGljIGdldCB1bnBpbm5lZENvbHVtbnMoKTogSWd4Q29sdW1uQ29tcG9uZW50W10ge1xuICAgICAgICByZXR1cm4gc3VwZXIudW5waW5uZWRDb2x1bW5zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHB1YmxpYyBnZXQgdW5waW5uZWREYXRhVmlldygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiBzdXBlci51bnBpbm5lZERhdGFWaWV3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHB1YmxpYyBnZXQgdW5waW5uZWRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnVucGlubmVkV2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gc3VwZXIucGlubmVkV2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgc3VtbWFyeVJvd0hlaWdodChfdmFsdWU6IG51bWJlcikge1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc3VtbWFyeVJvd0hlaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG90YWxQYWdlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRyYW5zYWN0aW9ucygpOiBUcmFuc2FjdGlvblNlcnZpY2U8VHJhbnNhY3Rpb24sIFN0YXRlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2FjdGlvbnM7XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBkcmFnSW5kaWNhdG9ySWNvblRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBkcmFnSW5kaWNhdG9ySWNvblRlbXBsYXRlKF92YWw6IFRlbXBsYXRlUmVmPGFueT4pIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCByb3dFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcm93RWRpdGFibGUoX3ZhbDogYm9vbGVhbikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHBpbm5pbmcoKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgcHVibGljIHNldCBwaW5uaW5nKF92YWx1ZSkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHN1bW1hcnlQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc3VtbWFyeVBvc2l0aW9uKF92YWx1ZTogR3JpZFN1bW1hcnlQb3NpdGlvbikge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVyYWxcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgc3VtbWFyeUNhbGN1bGF0aW9uTW9kZSgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc3VtbWFyeUNhbGN1bGF0aW9uTW9kZShfdmFsdWU6IEdyaWRTdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJhbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzaG93U3VtbWFyeU9uQ29sbGFwc2UoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNob3dTdW1tYXJ5T25Db2xsYXBzZShfdmFsdWU6IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGlkZGVuQ29sdW1uc0NvdW50KCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcGlubmVkQ29sdW1uc0NvdW50KCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBiYXRjaEVkaXRpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGJhdGNoRWRpdGluZyhfdmFsOiBib29sZWFuKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzZWxlY3RlZFJvd3MoKTogYW55W10ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdldFNlbGVjdGVkUm93cygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkUm93SWRzID0gW107XG4gICAgICAgIHRoaXMuZGF0YVZpZXcuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldiA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBkaW0gb2YgdGhpcy5yb3dEaW1lbnNpb25zKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJEaW0gPSBkaW07XG4gICAgICAgICAgICAgICAgbGV0IHNob3VsZEJyZWFrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBQaXZvdFV0aWwuZ2V0UmVjb3JkS2V5KHJlY29yZCwgY3VyckRpbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblNlcnZpY2UuaXNQaXZvdFJvd1NlbGVjdGVkKGtleSkgJiYgIXNlbGVjdGVkUm93SWRzLmZpbmQoeCA9PiB4ID09PSByZWNvcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFJvd0lkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRCcmVhayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyRGltID0gY3VyckRpbS5jaGlsZExldmVsO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGN1cnJEaW0pO1xuICAgICAgICAgICAgICAgIHByZXYucHVzaChkaW0pO1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGRCcmVhaykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkUm93SWRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGRlZmF1bHQgcm93IGhlaWdodC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHJvd0hlaWdoID0gdGhpcy5ncmlkLmRlZmF1bHRSb3dIZWlnaHQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBkZWZhdWx0Um93SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnN1cGVyQ29tcGFjdE1vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiAyNDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuZGVmYXVsdFJvd0hlaWdodDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHNlbGVjdGlvblNlcnZpY2U6IElneEdyaWRTZWxlY3Rpb25TZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgY29sUmVzaXppbmdTZXJ2aWNlOiBJZ3hQaXZvdENvbHVtblJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgZ3JpZEFQSTogR3JpZEJhc2VBUElTZXJ2aWNlPElneEdyaWRCYXNlRGlyZWN0aXZlICYgR3JpZFR5cGU+LFxuICAgICAgICBwcm90ZWN0ZWQgdHJhbnNhY3Rpb25GYWN0b3J5OiBJZ3hGbGF0VHJhbnNhY3Rpb25GYWN0b3J5LFxuICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgem9uZTogTmdab25lLFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwdWJsaWMgZG9jdW1lbnQsXG4gICAgICAgIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgdmlld1JlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICAgICAgbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LFxuICAgICAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAgIG5hdmlnYXRpb246IElneFBpdm90R3JpZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgICAgICBmaWx0ZXJpbmdTZXJ2aWNlOiBJZ3hGaWx0ZXJpbmdTZXJ2aWNlLFxuICAgICAgICBASW5qZWN0KElneE92ZXJsYXlTZXJ2aWNlKSBwcm90ZWN0ZWQgb3ZlcmxheVNlcnZpY2U6IElneE92ZXJsYXlTZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgc3VtbWFyeVNlcnZpY2U6IElneEdyaWRTdW1tYXJ5U2VydmljZSxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9uczogSURpc3BsYXlEZW5zaXR5T3B0aW9ucyxcbiAgICAgICAgQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZUlkOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwbGF0Zm9ybTogUGxhdGZvcm1VdGlsLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KElneEdyaWRUcmFuc2FjdGlvbikgcHJvdGVjdGVkIF9kaVRyYW5zYWN0aW9ucz86IFRyYW5zYWN0aW9uU2VydmljZTxUcmFuc2FjdGlvbiwgU3RhdGU+KSB7XG4gICAgICAgIHN1cGVyKFxuICAgICAgICAgICAgc2VsZWN0aW9uU2VydmljZSxcbiAgICAgICAgICAgIGNvbFJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgICAgIGdyaWRBUEksXG4gICAgICAgICAgICB0cmFuc2FjdGlvbkZhY3RvcnksXG4gICAgICAgICAgICBlbGVtZW50UmVmLFxuICAgICAgICAgICAgem9uZSxcbiAgICAgICAgICAgIGRvY3VtZW50LFxuICAgICAgICAgICAgY2RyLFxuICAgICAgICAgICAgcmVzb2x2ZXIsXG4gICAgICAgICAgICBkaWZmZXJzLFxuICAgICAgICAgICAgdmlld1JlZixcbiAgICAgICAgICAgIGFwcFJlZixcbiAgICAgICAgICAgIG1vZHVsZVJlZixcbiAgICAgICAgICAgIGluamVjdG9yLFxuICAgICAgICAgICAgbmF2aWdhdGlvbixcbiAgICAgICAgICAgIGZpbHRlcmluZ1NlcnZpY2UsXG4gICAgICAgICAgICBvdmVybGF5U2VydmljZSxcbiAgICAgICAgICAgIHN1bW1hcnlTZXJ2aWNlLFxuICAgICAgICAgICAgX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucyxcbiAgICAgICAgICAgIGxvY2FsZUlkLFxuICAgICAgICAgICAgcGxhdGZvcm0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIC8vIHBpdm90IGdyaWQgYWx3YXlzIGdlbmVyYXRlcyBjb2x1bW5zIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgIHRoaXMuYXV0b0dlbmVyYXRlID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5waXZvdENvbmZpZ3VyYXRpb247XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlID0gUGl2b3RVdGlsLmJ1aWxkRXhwcmVzc2lvblRyZWUoY29uZmlnKTtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgLy8gaWdub3JlIGFueSB1c2VyIGRlZmluZWQgY29sdW1ucyBhbmQgYXV0by1nZW5lcmF0ZSBiYXNlZCBvbiBwaXZvdCBjb25maWcuXG4gICAgICAgIHRoaXMuY29sdW1uTGlzdC5yZXNldChbXSk7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOb3RpZmllcyBmb3IgZGltZW5zaW9uIGNoYW5nZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgbm90aWZ5RGltZW5zaW9uQ2hhbmdlKHJlZ2VuZXJhdGVDb2x1bW5zID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHJlZ2VuZXJhdGVDb2x1bW5zKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGZ1bGwgbGlzdCBvZiBkaW1lbnNpb25zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZ3JpZC5hbGxEaW1lbnNpb25zO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgYWxsRGltZW5zaW9ucygpIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5waXZvdENvbmZpZ3VyYXRpb247XG4gICAgICAgIHJldHVybiAoY29uZmlnLnJvd3MgfHwgW10pLmNvbmNhdCgoY29uZmlnLmNvbHVtbnMgfHwgW10pKS5jb25jYXQoY29uZmlnLmZpbHRlcnMgfHwgW10pLmZpbHRlcih4ID0+IHggIT09IG51bGwgJiYgeCAhPT0gdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgY3JlYXRlRmlsdGVyRVNGKGRyb3Bkb3duOiBhbnksIGNvbHVtbjogQ29sdW1uVHlwZSwgb3B0aW9uczogT3ZlcmxheVNldHRpbmdzLCBzaG91bGRSZWF0YWNoOiBib29sZWFuKSB7XG4gICAgICAgIG9wdGlvbnMub3V0bGV0ID0gdGhpcy5vdXRsZXQ7XG4gICAgICAgIGlmIChkcm9wZG93bikge1xuICAgICAgICAgICAgZHJvcGRvd24uaW5pdGlhbGl6ZShjb2x1bW4sIHRoaXMub3ZlcmxheVNlcnZpY2UpO1xuICAgICAgICAgICAgaWYgKHNob3VsZFJlYXRhY2gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMub3ZlcmxheVNlcnZpY2UuYXR0YWNoKGRyb3Bkb3duLmVsZW1lbnQsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLm92ZXJsYXlDb21wb25lbnRJZCA9IGlkO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGlkLCByZWY6IHVuZGVmaW5lZCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgaWQ6IGRyb3Bkb3duLm92ZXJsYXlDb21wb25lbnRJZCwgcmVmOiB1bmRlZmluZWQgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGZlYXR1cmVDb2x1bW5zV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpdm90Um93V2lkdGhzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBpZGAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJZiBub3QgcHJvdmlkZWQgaXQgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXBpdm90LWdyaWQgW2lkXT1cIidpZ3gtcGl2b3QtMSdcIiBbZGF0YV09XCJEYXRhXCI+PC9pZ3gtcGl2b3QtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5wX2lkO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wX2lkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgbGV0cyB5b3UgZmlsbCB0aGUgYElneFBpdm90R3JpZENvbXBvbmVudGAgd2l0aCBhbiBhcnJheSBvZiBkYXRhLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXBpdm90LWdyaWQgW2RhdGFdPVwiRGF0YVwiPjwvaWd4LXBpdm90LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGRhdGEodmFsdWU6IGFueVtdIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdmFsdWUgfHwgW107XG4gICAgICAgIGlmICghdGhpcy5faW5pdCkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIGlmICh0aGlzLmhlaWdodCA9PT0gbnVsbCB8fCB0aGlzLmhlaWdodC5pbmRleE9mKCclJykgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgaGVpZ2h0IHdpbGwgY2hhbmdlIGJhc2VkIG9uIGhvdyBtdWNoIGRhdGEgdGhlcmUgaXMsIHJlY2FsY3VsYXRlIHNpemVzIGluIGlneEZvck9mLlxuICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBkYXRhIHNldCB0byB0aGUgY29tcG9uZW50LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZGF0YSA9IHRoaXMuZ3JpZC5kYXRhO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnlbXSB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIGZpbHRlcmVkIGRhdGEuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5maWx0ZXJlZERhdGEgPSBbe1xuICAgICAqICAgICAgIElEOiAxLFxuICAgICAqICAgICAgIE5hbWU6IFwiQVwiXG4gICAgICogfV07XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBmaWx0ZXJlZERhdGEodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZmlsdGVyZWREYXRhID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIGZpbHRlcmVkIGRhdGEuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLmdyaWQuZmlsdGVyZWREYXRhO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZpbHRlcmVkRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlcmVkRGF0YTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29udGV4dChyb3dEYXRhLCByb3dJbmRleCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAkaW1wbGljaXQ6IHJvd0RhdGEsXG4gICAgICAgICAgICB0ZW1wbGF0ZUlEOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2RhdGFSb3cnLFxuICAgICAgICAgICAgICAgIGlkOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5kZXg6IHRoaXMuZ2V0RGF0YVZpZXdJbmRleChyb3dJbmRleCwgZmFsc2UpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpdm90Um93V2lkdGhzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dEaW1lbnNpb25zLmxlbmd0aCA/IHRoaXMucm93RGltZW5zaW9ucy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBkaW0pID0+IGFjY3VtdWxhdG9yICsgdGhpcy5yb3dEaW1lbnNpb25XaWR0aFRvUGl4ZWxzKGRpbSksIDApIDpcbiAgICAgICAgICAgIHRoaXMucm93RGltZW5zaW9uV2lkdGhUb1BpeGVscyh0aGlzLmVtcHR5Um93RGltZW5zaW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByb3dEaW1lbnNpb25XaWR0aFRvUGl4ZWxzKGRpbTogSVBpdm90RGltZW5zaW9uKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFkaW0ud2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBNSU5JTVVNX0NPTFVNTl9XSURUSDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpc1BlcmNlbnQgPSBkaW0ud2lkdGggJiYgZGltLndpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTE7XG4gICAgICAgIGlmIChpc1BlcmNlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGRpbS53aWR0aCkgLyAxMDAgKiB0aGlzLmNhbGNXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChkaW0ud2lkdGgsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHJldmVyc2VEaW1lbnNpb25XaWR0aFRvUGVyY2VudCh3aWR0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh3aWR0aCAqIDEwMCAvIHRoaXMuY2FsY1dpZHRoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHJvd0RpbWVuc2lvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5yb3dzPy5maWx0ZXIoeCA9PiB4LmVuYWJsZWQpIHx8IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY29sdW1uRGltZW5zaW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmNvbHVtbnM/LmZpbHRlcih4ID0+IHguZW5hYmxlZCkgfHwgW107XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBmaWx0ZXJEaW1lbnNpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5waXZvdENvbmZpZ3VyYXRpb24uZmlsdGVycz8uZmlsdGVyKHggPT4geC5lbmFibGVkKSB8fCBbXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLnZhbHVlcz8uZmlsdGVyKHggPT4geC5lbmFibGVkKSB8fCBbXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlQ29sdW1uKGNvbDogSWd4Q29sdW1uQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5jb2x1bW5Hcm91cFN0YXRlcy5nZXQoY29sLmZpZWxkKTtcbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSAhc3RhdGU7XG4gICAgICAgIHRoaXMuY29sdW1uR3JvdXBTdGF0ZXMuc2V0KGNvbC5maWVsZCwgbmV3U3RhdGUpO1xuICAgICAgICB0aGlzLnRvZ2dsZVJvd0dyb3VwKGNvbCwgbmV3U3RhdGUpO1xuICAgICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGlzUmVjb3JkUGlubmVkQnlJbmRleChfcm93SW5kZXg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVDb2x1bW5WaXNpYmlsaXR5KF9hcmdzOiBJQ29sdW1uVmlzaWJpbGl0eUNoYW5nZWRFdmVudEFyZ3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGV4cGFuZEFsbCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsYXBzZUFsbCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBleHBhbmRSb3coX3Jvd0lEOiBhbnkpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsYXBzZVJvdyhfcm93SUQ6IGFueSkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBwaW5uZWRSb3dzKCk6IElneEdyaWRSb3dDb21wb25lbnRbXSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCB0b3RhbFJlY29yZHMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgdG90YWxSZWNvcmRzKF90b3RhbDogbnVtYmVyKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbW92ZUNvbHVtbihfY29sdW1uOiBJZ3hDb2x1bW5Db21wb25lbnQsIF90YXJnZXQ6IElneENvbHVtbkNvbXBvbmVudCwgX3BvczogRHJvcFBvc2l0aW9uID0gRHJvcFBvc2l0aW9uLkFmdGVyRHJvcFRhcmdldCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGFkZFJvdyhfZGF0YTogYW55KTogdm9pZCB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVsZXRlUm93KF9yb3dTZWxlY3RvcjogYW55KTogYW55IHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGVDZWxsKF92YWx1ZTogYW55LCBfcm93U2VsZWN0b3I6IGFueSwgX2NvbHVtbjogc3RyaW5nKTogdm9pZCB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlUm93KF92YWx1ZTogYW55LCBfcm93U2VsZWN0b3I6IGFueSk6IHZvaWQge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGVuYWJsZVN1bW1hcmllcyguLi5fcmVzdCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGRpc2FibGVTdW1tYXJpZXMoLi4uX3Jlc3QpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwaW5Db2x1bW4oX2NvbHVtbk5hbWU6IHN0cmluZyB8IElneENvbHVtbkNvbXBvbmVudCwgX2luZGV4Pyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgdW5waW5Db2x1bW4oX2NvbHVtbk5hbWU6IHN0cmluZyB8IElneENvbHVtbkNvbXBvbmVudCwgX2luZGV4Pyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcGluUm93KF9yb3dJRDogYW55LCBfaW5kZXg/OiBudW1iZXIsIF9yb3c/OiBSb3dUeXBlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB1bnBpblJvdyhfcm93SUQ6IGFueSwgX3Jvdz86IFJvd1R5cGUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBwaW5uZWRSb3dIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzRWRpdGFibGVDb2x1bW5zKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc1N1bW1hcml6ZWRDb2x1bW5zKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc01vdmFibGVDb2x1bW5zKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZERhdGFWaWV3KCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG9wZW5BZHZhbmNlZEZpbHRlcmluZ0RpYWxvZyhfb3ZlcmxheVNldHRpbmdzPzogT3ZlcmxheVNldHRpbmdzKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2VBZHZhbmNlZEZpbHRlcmluZ0RpYWxvZyhfYXBwbHlDaGFuZ2VzOiBib29sZWFuKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZW5kRWRpdChfY29tbWl0ID0gdHJ1ZSwgX2V2ZW50PzogRXZlbnQpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBiZWdpbkFkZFJvd0J5SWQoX3Jvd0lEOiBhbnksIF9hc0NoaWxkPzogYm9vbGVhbik6IHZvaWQge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGJlZ2luQWRkUm93QnlJbmRleChfaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyU2VhcmNoKCkgeyB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwYWdpbmF0ZShfdmFsOiBudW1iZXIpOiB2b2lkIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgKi9cbiAgICBwdWJsaWMgbmV4dFBhZ2UoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICovXG4gICAgcHVibGljIHByZXZpb3VzUGFnZSgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgKi9cbiAgICBwdWJsaWMgcmVmcmVzaFNlYXJjaChfdXBkYXRlQWN0aXZlSW5mbz86IGJvb2xlYW4sIF9lbmRFZGl0ID0gdHJ1ZSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHB1YmxpYyBmaW5kTmV4dChfdGV4dDogc3RyaW5nLCBfY2FzZVNlbnNpdGl2ZT86IGJvb2xlYW4sIF9leGFjdE1hdGNoPzogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHB1YmxpYyBmaW5kUHJldihfdGV4dDogc3RyaW5nLCBfY2FzZVNlbnNpdGl2ZT86IGJvb2xlYW4sIF9leGFjdE1hdGNoPzogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHB1YmxpYyBnZXROZXh0Q2VsbChjdXJyUm93SW5kZXg6IG51bWJlciwgY3VyVmlzaWJsZUNvbEluZGV4OiBudW1iZXIsXG4gICAgICAgIGNhbGxiYWNrOiAoSWd4Q29sdW1uQ29tcG9uZW50KSA9PiBib29sZWFuID0gbnVsbCk6IElDZWxsUG9zaXRpb24ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0TmV4dENlbGwoY3VyclJvd0luZGV4LCBjdXJWaXNpYmxlQ29sSW5kZXgsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgKi9cbiAgICBwdWJsaWMgZ2V0UHJldmlvdXNDZWxsKGN1cnJSb3dJbmRleDogbnVtYmVyLCBjdXJWaXNpYmxlQ29sSW5kZXg6IG51bWJlcixcbiAgICAgICAgY2FsbGJhY2s6IChJZ3hDb2x1bW5Db21wb25lbnQpID0+IGJvb2xlYW4gPSBudWxsKTogSUNlbGxQb3NpdGlvbiB7XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRQcmV2aW91c0NlbGwoY3VyclJvd0luZGV4LCBjdXJWaXNpYmxlQ29sSW5kZXgsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgKi9cbiAgICBwdWJsaWMgZ2V0UGlubmVkV2lkdGgodGFrZUhpZGRlbiA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRQaW5uZWRXaWR0aCh0YWtlSGlkZGVuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG90YWxIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGNIZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbHVtbkdyb3VwRXhwYW5kU3RhdGUoY29sOiBJZ3hDb2x1bW5Db21wb25lbnQpIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmNvbHVtbkdyb3VwU3RhdGVzLmdldChjb2wuZmllbGQpO1xuICAgICAgICAvLyBjb2x1bW5zIGFyZSBleHBhbmRlZCBieSBkZWZhdWx0P1xuICAgICAgICByZXR1cm4gc3RhdGUgIT09IHVuZGVmaW5lZCAmJiBzdGF0ZSAhPT0gbnVsbCA/IHN0YXRlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZVJvd0dyb3VwKGNvbDogSWd4Q29sdW1uQ29tcG9uZW50LCBuZXdTdGF0ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAoIWNvbCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5oYXNNdWx0aXBsZVZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50Q29scyA9IGNvbC5wYXJlbnQgPyBjb2wucGFyZW50LmNoaWxkcmVuLnRvQXJyYXkoKSA6IHRoaXMuX2F1dG9HZW5lcmF0ZWRDb2xzLmZpbHRlcih4ID0+IHgubGV2ZWwgPT09IDApO1xuICAgICAgICAgICAgY29uc3Qgc2libGluZ0NvbCA9IHBhcmVudENvbHMuZmlsdGVyKHggPT4geC5oZWFkZXIgPT09IGNvbC5oZWFkZXIgJiYgeCAhPT0gY29sKVswXTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJJbmRleCA9IHBhcmVudENvbHMuaW5kZXhPZihjb2wpO1xuICAgICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcGFyZW50Q29scy5pbmRleE9mKHNpYmxpbmdDb2wpO1xuICAgICAgICAgICAgaWYgKGN1cnJJbmRleCA8IHNpYmxpbmdJbmRleCkge1xuICAgICAgICAgICAgICAgIC8vIGNsaWNrZWQgb24gdGhlIGZ1bGwgaGllcmFyY2h5IGhlYWRlclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVRvZ2dsZShjb2wsIG5ld1N0YXRlKTtcbiAgICAgICAgICAgICAgICBzaWJsaW5nQ29sLmhlYWRlclRlbXBsYXRlID0gdGhpcy5oZWFkZXJUZW1wbGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xpY2tlZCBvbiBzdW1tYXJ5IHBhcmVudCBjb2x1bW4gdGhhdCBjb250YWlucyBqdXN0IHRoZSBtZWFzdXJlc1xuICAgICAgICAgICAgICAgIGNvbC5oZWFkZXJUZW1wbGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVUb2dnbGUoc2libGluZ0NvbCwgbmV3U3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50Q29scyA9IGNvbC5wYXJlbnQgPyBjb2wucGFyZW50LmNoaWxkcmVuIDogdGhpcy5fYXV0b0dlbmVyYXRlZENvbHMuZmlsdGVyKHggPT4geC5sZXZlbCA9PT0gMCk7XG4gICAgICAgICAgICBjb25zdCBmaWVsZENvbHVtbiA9IHBhcmVudENvbHMuZmlsdGVyKHggPT4geC5oZWFkZXIgPT09IGNvbC5oZWFkZXIgJiYgIXguY29sdW1uR3JvdXApWzBdO1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBDb2x1bW4gPSBwYXJlbnRDb2xzLmZpbHRlcih4ID0+IHguaGVhZGVyID09PSBjb2wuaGVhZGVyICYmIHguY29sdW1uR3JvdXApWzBdO1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlVG9nZ2xlKGdyb3VwQ29sdW1uLCBuZXdTdGF0ZSk7XG4gICAgICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgICAgICBmaWVsZENvbHVtbi5oZWFkZXJUZW1wbGF0ZSA9IHRoaXMuaGVhZGVyVGVtcGxhdGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkQ29sdW1uLmhlYWRlclRlbXBsYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICovXG4gICAgcHVibGljIHNldHVwQ29sdW1ucygpIHtcbiAgICAgICAgc3VwZXIuc2V0dXBDb2x1bW5zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXV0by1zaXplcyByb3cgZGltZW5zaW9uIGNlbGxzLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBPbmx5IHNpemVzIGJhc2VkIG9uIHRoZSBkaW1lbnNpb24gY2VsbHMgaW4gdmlldy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuYXV0b1NpemVSb3dEaW1lbnNpb24oZGltZW5zaW9uKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gZGltZW5zaW9uIFRoZSByb3cgZGltZW5zaW9uIHRvIHNpemUuXG4gICAgICovXG4gICAgcHVibGljIGF1dG9TaXplUm93RGltZW5zaW9uKGRpbWVuc2lvbjogSVBpdm90RGltZW5zaW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmdldERpbWVuc2lvblR5cGUoZGltZW5zaW9uKSA9PT0gUGl2b3REaW1lbnNpb25UeXBlLlJvdykge1xuICAgICAgICAgICAgY29uc3QgcmVsYXRlZERpbXMgPSBQaXZvdFV0aWwuZmxhdHRlbihbZGltZW5zaW9uXSkubWFwKHggPT4geC5tZW1iZXJOYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnJvd0RpbWVuc2lvbkNvbnRlbnRDb2xsZWN0aW9uLmZpbHRlcih4ID0+IHJlbGF0ZWREaW1zLmluZGV4T2YoeC5kaW1lbnNpb24ubWVtYmVyTmFtZSkgIT09IC0xKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSBjb250ZW50Lm1hcCh4ID0+IHguaGVhZGVyR3JvdXBzLnRvQXJyYXkoKSkuZmxhdCgpLm1hcCh4ID0+IHguaGVhZGVyICYmIHguaGVhZGVyLnJlZkluc3RhbmNlKTtcbiAgICAgICAgICAgIGNvbnN0IGF1dG9XaWR0aCA9IHRoaXMuZ2V0TGFyZ2VzQ29udGVudFdpZHRoKGhlYWRlcnMpO1xuICAgICAgICAgICAgZGltZW5zaW9uLndpZHRoID0gYXV0b1dpZHRoO1xuICAgICAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBkaW1lbnNpb24gaW4gdGFyZ2V0IGNvbGxlY3Rpb24gYnkgdHlwZSBhdCBzcGVjaWZpZWQgaW5kZXggb3IgYXQgdGhlIGNvbGxlY3Rpb24ncyBlbmQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuaW5zZXJ0RGltZW5zaW9uQXQoZGltZW5zaW9uLCBQaXZvdERpbWVuc2lvblR5cGUuUm93LCAxKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gZGltZW5zaW9uIFRoZSBkaW1lbnNpb24gdGhhdCB3aWxsIGJlIGFkZGVkLlxuICAgICAqIEBwYXJhbSB0YXJnZXRDb2xsZWN0aW9uVHlwZSBUaGUgdGFyZ2V0IGNvbGxlY3Rpb24gdHlwZSB0byBhZGQgdG8uIENhbiBiZSBSb3csIENvbHVtbiBvciBGaWx0ZXIuXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBpbiB0aGUgY29sbGVjdGlvbiBhdCB3aGljaCB0byBhZGQuXG4gICAgICogVGhpcyBwYXJhbWV0ZXIgaXMgb3B0aW9uYWwuIElmIG5vdCBzZXQgaXQgd2lsbCBhZGQgaXQgdG8gdGhlIGVuZCBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zZXJ0RGltZW5zaW9uQXQoZGltZW5zaW9uOiBJUGl2b3REaW1lbnNpb24sIHRhcmdldENvbGxlY3Rpb25UeXBlOiBQaXZvdERpbWVuc2lvblR5cGUsIGluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldENvbGxlY3Rpb24gPSB0aGlzLmdldERpbWVuc2lvbnNCeVR5cGUodGFyZ2V0Q29sbGVjdGlvblR5cGUpO1xuICAgICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGFyZ2V0Q29sbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDAsIGRpbWVuc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRDb2xsZWN0aW9uLnB1c2goZGltZW5zaW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0Q29sbGVjdGlvblR5cGUgPT09IFBpdm90RGltZW5zaW9uVHlwZS5Db2x1bW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBDb2x1bW5zKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbnNDaGFuZ2UuZW1pdCh7IGRpbWVuc2lvbnM6IHRhcmdldENvbGxlY3Rpb24sIGRpbWVuc2lvbkNvbGxlY3Rpb25UeXBlOiB0YXJnZXRDb2xsZWN0aW9uVHlwZSB9KTtcbiAgICAgICAgaWYgKHRhcmdldENvbGxlY3Rpb25UeXBlID09PSBQaXZvdERpbWVuc2lvblR5cGUuRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmRpbWVuc2lvbkRhdGFDb2x1bW5zID0gdGhpcy5nZW5lcmF0ZURpbWVuc2lvbkNvbHVtbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIGRpbWVuc2lvbiBmcm9tIGl0cyBjdXJyZW50bHkgY29sbGVjdGlvbiB0byB0aGUgc3BlY2lmaWVkIHRhcmdldCBjb2xsZWN0aW9uIGJ5IHR5cGUgYXQgc3BlY2lmaWVkIGluZGV4IG9yIGF0IHRoZSBjb2xsZWN0aW9uJ3MgZW5kLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLm1vdmVEaW1lbnNpb24oZGltZW5zaW9uLCBQaXZvdERpbWVuc2lvblR5cGUuUm93LCAxKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gZGltZW5zaW9uIFRoZSBkaW1lbnNpb24gdGhhdCB3aWxsIGJlIG1vdmVkLlxuICAgICAqIEBwYXJhbSB0YXJnZXRDb2xsZWN0aW9uVHlwZSBUaGUgdGFyZ2V0IGNvbGxlY3Rpb24gdHlwZSB0byBtb3ZlIGl0IHRvLiBDYW4gYmUgUm93LCBDb2x1bW4gb3IgRmlsdGVyLlxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggaW4gdGhlIGNvbGxlY3Rpb24gYXQgd2hpY2ggdG8gYWRkLlxuICAgICAqIFRoaXMgcGFyYW1ldGVyIGlzIG9wdGlvbmFsLiBJZiBub3Qgc2V0IGl0IHdpbGwgYWRkIGl0IHRvIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIG1vdmVEaW1lbnNpb24oZGltZW5zaW9uOiBJUGl2b3REaW1lbnNpb24sIHRhcmdldENvbGxlY3Rpb25UeXBlOiBQaXZvdERpbWVuc2lvblR5cGUsIGluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHByZXZDb2xsZWN0aW9uVHlwZSA9IHRoaXMuZ2V0RGltZW5zaW9uVHlwZShkaW1lbnNpb24pO1xuICAgICAgICBpZiAocHJldkNvbGxlY3Rpb25UeXBlID09PSBudWxsKSByZXR1cm47XG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIG9sZCBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMuX3JlbW92ZURpbWVuc2lvbkludGVybmFsKGRpbWVuc2lvbik7XG4gICAgICAgIC8vIGFkZCB0byB0YXJnZXRcbiAgICAgICAgdGhpcy5pbnNlcnREaW1lbnNpb25BdChkaW1lbnNpb24sIHRhcmdldENvbGxlY3Rpb25UeXBlLCBpbmRleCk7XG5cbiAgICAgICAgaWYgKHByZXZDb2xsZWN0aW9uVHlwZSA9PT0gUGl2b3REaW1lbnNpb25UeXBlLkNvbHVtbikge1xuICAgICAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgZGltZW5zaW9uIGZyb20gaXRzIGN1cnJlbnRseSBjb2xsZWN0aW9uLlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhpcyBpcyBkaWZmZXJlbnQgdGhhbiB0b2dnbGVEaW1lbnNpb24gdGhhdCBlbmFibGVkL2Rpc2FibGVzIHRoZSBkaW1lbnNpb24uXG4gICAgICogVGhpcyBjb21wbGV0ZWx5IHJlbW92ZXMgdGhlIHNwZWNpZmllZCBkaW1lbnNpb24gZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQucmVtb3ZlRGltZW5zaW9uKGRpbWVuc2lvbik7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIGRpbWVuc2lvbiBUaGUgZGltZW5zaW9uIHRvIGJlIHJlbW92ZWQuXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZURpbWVuc2lvbihkaW1lbnNpb246IElQaXZvdERpbWVuc2lvbikge1xuICAgICAgICBjb25zdCBwcmV2Q29sbGVjdGlvblR5cGUgPSB0aGlzLmdldERpbWVuc2lvblR5cGUoZGltZW5zaW9uKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRGltZW5zaW9uSW50ZXJuYWwoZGltZW5zaW9uKTtcbiAgICAgICAgaWYgKHByZXZDb2xsZWN0aW9uVHlwZSA9PT0gUGl2b3REaW1lbnNpb25UeXBlLkNvbHVtbikge1xuICAgICAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldkNvbGxlY3Rpb25UeXBlID09PSBQaXZvdERpbWVuc2lvblR5cGUuRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlZmxvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZXMgdGhlIGRpbWVuc2lvbidzIGVuYWJsZWQgc3RhdGUgb24gb3Igb2ZmLlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIGRpbWVuc2lvbiByZW1haW5zIGluIGl0cyBjdXJyZW50IGNvbGxlY3Rpb24uIFRoaXMganVzdCBjaGFuZ2VzIGl0cyBlbmFibGVkIHN0YXRlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC50b2dnbGVEaW1lbnNpb24oZGltZW5zaW9uKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gZGltZW5zaW9uIFRoZSBkaW1lbnNpb24gdG8gYmUgdG9nZ2xlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlRGltZW5zaW9uKGRpbWVuc2lvbjogSVBpdm90RGltZW5zaW9uKSB7XG4gICAgICAgIGNvbnN0IGRpbVR5cGUgPSB0aGlzLmdldERpbWVuc2lvblR5cGUoZGltZW5zaW9uKTtcbiAgICAgICAgaWYgKGRpbVR5cGUgPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuZ2V0RGltZW5zaW9uc0J5VHlwZShkaW1UeXBlKTtcbiAgICAgICAgZGltZW5zaW9uLmVuYWJsZWQgPSAhZGltZW5zaW9uLmVuYWJsZWQ7XG4gICAgICAgIGlmIChkaW1UeXBlID09PSBQaXZvdERpbWVuc2lvblR5cGUuQ29sdW1uKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGltZW5zaW9uLmVuYWJsZWQgJiYgZGltZW5zaW9uLmZpbHRlcikge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmNsZWFyRmlsdGVyKGRpbWVuc2lvbi5tZW1iZXJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uc0NoYW5nZS5lbWl0KHsgZGltZW5zaW9uczogY29sbGVjdGlvbiwgZGltZW5zaW9uQ29sbGVjdGlvblR5cGU6IGRpbVR5cGUgfSk7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgaWYgKGRpbVR5cGUgPT09IFBpdm90RGltZW5zaW9uVHlwZS5GaWx0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIHZhbHVlIGF0IHNwZWNpZmllZCBpbmRleCBvciBhdCB0aGUgZW5kLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmluc2VydFZhbHVlQXQodmFsdWUsIDEpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgZGVmaW5pdGlvbiB0aGF0IHdpbGwgYmUgYWRkZWQuXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBpbiB0aGUgY29sbGVjdGlvbiBhdCB3aGljaCB0byBhZGQuXG4gICAgICogVGhpcyBwYXJhbWV0ZXIgaXMgb3B0aW9uYWwuIElmIG5vdCBzZXQgaXQgd2lsbCBhZGQgaXQgdG8gdGhlIGVuZCBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zZXJ0VmFsdWVBdCh2YWx1ZTogSVBpdm90VmFsdWUsIGluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5waXZvdENvbmZpZ3VyYXRpb24udmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLnBpdm90Q29uZmlndXJhdGlvbi52YWx1ZXMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnBpdm90Q29uZmlndXJhdGlvbi52YWx1ZXM7XG4gICAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YWx1ZXMuc3BsaWNlKGluZGV4LCAwLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIHRoaXMudmFsdWVzQ2hhbmdlLmVtaXQoeyB2YWx1ZXMgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZSB2YWx1ZSBmcm9tIGl0cyBjdXJyZW50bHkgYXQgc3BlY2lmaWVkIGluZGV4IG9yIGF0IHRoZSBlbmQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQubW92ZVZhbHVlKHZhbHVlLCAxKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgd2lsbCBiZSBtb3ZlZC5cbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IGluIHRoZSBjb2xsZWN0aW9uIGF0IHdoaWNoIHRvIGFkZC5cbiAgICAgKiBUaGlzIHBhcmFtZXRlciBpcyBvcHRpb25hbC4gSWYgbm90IHNldCBpdCB3aWxsIGFkZCBpdCB0byB0aGUgZW5kIG9mIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZlVmFsdWUodmFsdWU6IElQaXZvdFZhbHVlLCBpbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5waXZvdENvbmZpZ3VyYXRpb24udmFsdWVzLmluZGV4T2YodmFsdWUpID09PSAtMSkgcmV0dXJuO1xuICAgICAgICAvLyByZW1vdmUgZnJvbSBvbGQgaW5kZXhcbiAgICAgICAgdGhpcy5yZW1vdmVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIC8vIGFkZCB0byBuZXdcbiAgICAgICAgdGhpcy5pbnNlcnRWYWx1ZUF0KHZhbHVlLCBpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB2YWx1ZSBmcm9tIGNvbGxlY3Rpb24uXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIGlzIGRpZmZlcmVudCB0aGFuIHRvZ2dsZVZhbHVlIHRoYXQgZW5hYmxlZC9kaXNhYmxlcyB0aGUgdmFsdWUuXG4gICAgICogVGhpcyBjb21wbGV0ZWx5IHJlbW92ZXMgdGhlIHNwZWNpZmllZCB2YWx1ZSBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5yZW1vdmVWYWx1ZShkaW1lbnNpb24pO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlVmFsdWUodmFsdWU6IElQaXZvdFZhbHVlLCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnBpdm90Q29uZmlndXJhdGlvbi52YWx1ZXM7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHZhbHVlcy5pbmRleE9mKHZhbHVlKTtcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHZhbHVlcy5zcGxpY2UoY3VycmVudEluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBDb2x1bW5zKCk7XG4gICAgICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgICAgICAgICB0aGlzLnZhbHVlc0NoYW5nZS5lbWl0KHsgdmFsdWVzIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgdmFsdWUncyBlbmFibGVkIHN0YXRlIG9uIG9yIG9mZi5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSB2YWx1ZSByZW1haW5zIGluIGl0cyBjdXJyZW50IGNvbGxlY3Rpb24uIFRoaXMganVzdCBjaGFuZ2VzIGl0cyBlbmFibGVkIHN0YXRlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC50b2dnbGVWYWx1ZSh2YWx1ZSk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBiZSB0b2dnbGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVWYWx1ZSh2YWx1ZTogSVBpdm90VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMucGl2b3RDb25maWd1cmF0aW9uLnZhbHVlcy5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHJldHVybjtcbiAgICAgICAgdmFsdWUuZW5hYmxlZCA9ICF2YWx1ZS5lbmFibGVkO1xuICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgICAgIHRoaXMudmFsdWVzQ2hhbmdlLmVtaXQoeyB2YWx1ZXM6IHRoaXMucGl2b3RDb25maWd1cmF0aW9uLnZhbHVlcyB9KTtcbiAgICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb3J0IHRoZSBkaW1lbnNpb24gYW5kIGl0cyBjaGlsZHJlbiBpbiB0aGUgcHJvdmlkZWQgZGlyZWN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5zb3J0RGltZW5zaW9uKGRpbWVuc2lvbiwgU29ydGluZ0RpcmVjdGlvbi5Bc2MpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gYmUgdG9nZ2xlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc29ydERpbWVuc2lvbihkaW1lbnNpb246IElQaXZvdERpbWVuc2lvbiwgc29ydERpcmVjdGlvbjogU29ydGluZ0RpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBkaW1lbnNpb25UeXBlID0gdGhpcy5nZXREaW1lbnNpb25UeXBlKGRpbWVuc2lvbik7XG4gICAgICAgIGRpbWVuc2lvbi5zb3J0RGlyZWN0aW9uID0gc29ydERpcmVjdGlvbjtcbiAgICAgICAgLy8gYXBwbHkgc2FtZSBzb3J0IGRpcmVjdGlvbiB0byBjaGlsZHJlbi5cbiAgICAgICAgbGV0IGRpbSA9IGRpbWVuc2lvbjtcbiAgICAgICAgd2hpbGUgKGRpbS5jaGlsZExldmVsKSB7XG4gICAgICAgICAgICBkaW0uY2hpbGRMZXZlbC5zb3J0RGlyZWN0aW9uID0gZGltZW5zaW9uLnNvcnREaXJlY3Rpb247XG4gICAgICAgICAgICBkaW0gPSBkaW0uY2hpbGRMZXZlbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaW1lbnNpb25zU29ydGluZ0V4cHJlc3Npb25zID0gUGl2b3RTb3J0VXRpbC5nZW5lcmF0ZURpbWVuc2lvblNvcnRpbmdFeHByZXNzaW9ucyh0aGlzLnJvd0RpbWVuc2lvbnMpXG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zU29ydGluZ0V4cHJlc3Npb25zQ2hhbmdlLmVtaXQoZGltZW5zaW9uc1NvcnRpbmdFeHByZXNzaW9ucyk7XG4gICAgICAgIGlmIChkaW1lbnNpb25UeXBlID09PSBQaXZvdERpbWVuc2lvblR5cGUuQ29sdW1uKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXREaW1lbnNpb25zQnlUeXBlKGRpbWVuc2lvbjogUGl2b3REaW1lbnNpb25UeXBlKSB7XG4gICAgICAgIHN3aXRjaCAoZGltZW5zaW9uKSB7XG4gICAgICAgICAgICBjYXNlIFBpdm90RGltZW5zaW9uVHlwZS5Sb3c6XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5yb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLnJvd3MgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLnJvd3M7XG4gICAgICAgICAgICBjYXNlIFBpdm90RGltZW5zaW9uVHlwZS5Db2x1bW46XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmNvbHVtbnMgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmNvbHVtbnM7XG4gICAgICAgICAgICBjYXNlIFBpdm90RGltZW5zaW9uVHlwZS5GaWx0ZXI6XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5maWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmZpbHRlcnMgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmZpbHRlcnM7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzaXplUm93RGltZW5zaW9uUGl4ZWxzKGRpbWVuc2lvbjogSVBpdm90RGltZW5zaW9uLCBuZXdXaWR0aDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGlzUGVyY2VudGFnZVdpZHRoID0gZGltZW5zaW9uLndpZHRoICYmIHR5cGVvZiBkaW1lbnNpb24ud2lkdGggPT09ICdzdHJpbmcnICYmIGRpbWVuc2lvbi53aWR0aC5pbmRleE9mKCclJykgIT09IC0xO1xuICAgICAgICBpZiAoaXNQZXJjZW50YWdlV2lkdGgpIHtcbiAgICAgICAgICAgIGRpbWVuc2lvbi53aWR0aCA9IHRoaXMucmV2ZXJzZURpbWVuc2lvbldpZHRoVG9QZXJjZW50KG5ld1dpZHRoKS50b0ZpeGVkKDIpICsgJyUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGltZW5zaW9uLndpZHRoID0gbmV3V2lkdGggKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90aWZ5IHRoZSBncmlkIHRvIHJlZmxvdywgdG8gdXBkYXRlIGlmIGhvcml6b250YWwgc2Nyb2xsYmFyIG5lZWRzIHRvIGJlIHJlbmRlcmVkL3JlbW92ZWQuXG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qXG4gICAgKiBAaGlkZGVuXG4gICAgKiBAaW50ZXJuYWxcbiAgICAqL1xuICAgIHByb3RlY3RlZCBfcmVtb3ZlRGltZW5zaW9uSW50ZXJuYWwoZGltZW5zaW9uKSB7XG4gICAgICAgIGNvbnN0IHByZXZDb2xsZWN0aW9uVHlwZSA9IHRoaXMuZ2V0RGltZW5zaW9uVHlwZShkaW1lbnNpb24pO1xuICAgICAgICBpZiAocHJldkNvbGxlY3Rpb25UeXBlID09PSBudWxsKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHByZXZDb2xsZWN0aW9uID0gdGhpcy5nZXREaW1lbnNpb25zQnlUeXBlKHByZXZDb2xsZWN0aW9uVHlwZSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHByZXZDb2xsZWN0aW9uLmluZGV4T2YoZGltZW5zaW9uKTtcbiAgICAgICAgcHJldkNvbGxlY3Rpb24uc3BsaWNlKGN1cnJlbnRJbmRleCwgMSk7XG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXREaW1lbnNpb25UeXBlKGRpbWVuc2lvbjogSVBpdm90RGltZW5zaW9uKTogUGl2b3REaW1lbnNpb25UeXBlIHtcbiAgICAgICAgcmV0dXJuIFBpdm90VXRpbC5mbGF0dGVuKHRoaXMucGl2b3RDb25maWd1cmF0aW9uLnJvd3MpLmluZGV4T2YoZGltZW5zaW9uKSAhPT0gLTEgPyBQaXZvdERpbWVuc2lvblR5cGUuUm93IDpcbiAgICAgICAgICAgIFBpdm90VXRpbC5mbGF0dGVuKHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmNvbHVtbnMpLmluZGV4T2YoZGltZW5zaW9uKSAhPT0gLTEgPyBQaXZvdERpbWVuc2lvblR5cGUuQ29sdW1uIDpcbiAgICAgICAgICAgICAgICAoISF0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5maWx0ZXJzICYmIFBpdm90VXRpbC5mbGF0dGVuKHRoaXMucGl2b3RDb25maWd1cmF0aW9uLmZpbHRlcnMpLmluZGV4T2YoZGltZW5zaW9uKSAhPT0gLTEpID9cbiAgICAgICAgICAgICAgICAgICAgUGl2b3REaW1lbnNpb25UeXBlLkZpbHRlciA6IG51bGw7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldExhcmdlc0NvbnRlbnRXaWR0aChjb250ZW50czogRWxlbWVudFJlZltdKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbGFyZ2VzdCA9IG5ldyBNYXA8bnVtYmVyLCBudW1iZXI+KCk7XG4gICAgICAgIGlmIChjb250ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsc0NvbnRlbnRXaWR0aHMgPSBbXTtcbiAgICAgICAgICAgIGNvbnRlbnRzLmZvckVhY2goKGVsZW0pID0+IGNlbGxzQ29udGVudFdpZHRocy5wdXNoKHRoaXMuZ2V0SGVhZGVyQ2VsbFdpZHRoKGVsZW0ubmF0aXZlRWxlbWVudCkud2lkdGgpKTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY2VsbHNDb250ZW50V2lkdGhzLmluZGV4T2YoTWF0aC5tYXgoLi4uY2VsbHNDb250ZW50V2lkdGhzKSk7XG4gICAgICAgICAgICBjb25zdCBjZWxsU3R5bGUgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoY29udGVudHNbaW5kZXhdLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgY29uc3QgY2VsbFBhZGRpbmcgPSBwYXJzZUZsb2F0KGNlbGxTdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KGNlbGxTdHlsZS5wYWRkaW5nUmlnaHQpICtcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNlbGxTdHlsZS5ib3JkZXJMZWZ0V2lkdGgpICsgcGFyc2VGbG9hdChjZWxsU3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XG4gICAgICAgICAgICBsYXJnZXN0LnNldChNYXRoLm1heCguLi5jZWxsc0NvbnRlbnRXaWR0aHMpLCBjZWxsUGFkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGFyZ2VzdENlbGwgPSBNYXRoLm1heCguLi5BcnJheS5mcm9tKGxhcmdlc3Qua2V5cygpKSk7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gTWF0aC5jZWlsKGxhcmdlc3RDZWxsICsgbGFyZ2VzdC5nZXQobGFyZ2VzdENlbGwpKTtcblxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKHdpZHRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2lkdGggKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuXG4gICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc011bHRpcGxlVmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMubGVuZ3RoID4gMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEBoaWRkZW5cbiAgICAqL1xuICAgIHB1YmxpYyBnZXQgZXhjZWxTdHlsZUZpbHRlck1heEhlaWdodCgpIHtcbiAgICAgICAgLy8gbWF4IDEwIHJvd3MsIHJvdyBzaXplIGRlcGVuZHMgb24gZGVuc2l0eVxuICAgICAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLnJlbmRlcmVkUm93SGVpZ2h0ICogMTA7XG4gICAgICAgIHJldHVybiBgJHttYXhIZWlnaHR9cHhgO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlblxuICAgICovXG4gICAgcHVibGljIGdldCBleGNlbFN0eWxlRmlsdGVyTWluSGVpZ2h0KCk6IHN0cmluZyB7XG4gICAgICAgIC8vIG1pbiA1IHJvd3MsIHJvdyBzaXplIGRlcGVuZHMgb24gZGVuc2l0eVxuICAgICAgICBjb25zdCBtaW5IZWlnaHQgPSB0aGlzLnJlbmRlcmVkUm93SGVpZ2h0ICogNTtcbiAgICAgICAgcmV0dXJuIGAke21pbkhlaWdodH1weGA7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlc29sdmVUb2dnbGUoZ3JvdXBDb2x1bW46IElneENvbHVtbkNvbXBvbmVudCwgc3RhdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKCFncm91cENvbHVtbikgcmV0dXJuO1xuICAgICAgICBncm91cENvbHVtbi5oaWRkZW4gPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5jb2x1bW5Hcm91cFN0YXRlcy5zZXQoZ3JvdXBDb2x1bW4uZmllbGQsIHN0YXRlKTtcbiAgICAgICAgY29uc3QgY2hpbGRyZW5Ub3RhbCA9IHRoaXMuaGFzTXVsdGlwbGVWYWx1ZXMgP1xuICAgICAgICAgICAgZ3JvdXBDb2x1bW4uY2hpbGRyZW4uZmlsdGVyKHggPT4geC5jb2x1bW5Hcm91cCAmJiB4LmNoaWxkcmVuLmZpbHRlcih5ID0+ICF5LmNvbHVtbkdyb3VwKS5sZW5ndGggPT09IHRoaXMudmFsdWVzLmxlbmd0aCkgOlxuICAgICAgICAgICAgZ3JvdXBDb2x1bW4uY2hpbGRyZW4uZmlsdGVyKHggPT4gIXguY29sdW1uR3JvdXApO1xuICAgICAgICBjb25zdCBjaGlsZHJlblN1Ymdyb3VwcyA9IHRoaXMuaGFzTXVsdGlwbGVWYWx1ZXMgP1xuICAgICAgICAgICAgZ3JvdXBDb2x1bW4uY2hpbGRyZW4uZmlsdGVyKHggPT4geC5jb2x1bW5Hcm91cCAmJiB4LmNoaWxkcmVuLmZpbHRlcih5ID0+ICF5LmNvbHVtbkdyb3VwKS5sZW5ndGggPT09IDApIDpcbiAgICAgICAgICAgIGdyb3VwQ29sdW1uLmNoaWxkcmVuLmZpbHRlcih4ID0+IHguY29sdW1uR3JvdXApO1xuICAgICAgICBjaGlsZHJlblRvdGFsLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmNvbHVtbkdyb3VwU3RhdGVzLmdldChncm91cC5maWVsZCkgfHwgc3RhdGU7XG4gICAgICAgICAgICBpZiAobmV3U3RhdGUpIHtcbiAgICAgICAgICAgICAgICBncm91cC5oZWFkZXJUZW1wbGF0ZSA9IHRoaXMuaGVhZGVyVGVtcGxhdGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdyb3VwLmhlYWRlclRlbXBsYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFncm91cENvbHVtbi5oaWRkZW4gJiYgY2hpbGRyZW5TdWJncm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY2hpbGRyZW5TdWJncm91cHMuZm9yRWFjaChncm91cCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmNvbHVtbkdyb3VwU3RhdGVzLmdldChncm91cC5maWVsZCkgfHwgc3RhdGU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlVG9nZ2xlKGdyb3VwLCBuZXdTdGF0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsY0dyaWRIZWFkUm93KCkge1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBidWlsZERhdGFWaWV3KGRhdGE6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuX2RhdGFWaWV3ID0gZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXREYXRhQmFzZWRCb2R5SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGR2bCA9IHRoaXMuZGF0YVZpZXc/Lmxlbmd0aCB8fCAwO1xuICAgICAgICByZXR1cm4gZHZsIDwgdGhpcy5fZGVmYXVsdFRhcmdldFJlY29yZE51bWJlciA/IDAgOiB0aGlzLmRlZmF1bHRUYXJnZXRCb2R5SGVpZ2h0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBob3Jpem9udGFsU2Nyb2xsSGFuZGxlcihldmVudCkge1xuICAgICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQ7XG4gICAgICAgIHRoaXMudGhlYWRSb3cuaGVhZGVyQ29udGFpbmVycy5mb3JFYWNoKGhlYWRlckZvck9mID0+IHtcbiAgICAgICAgICAgIGhlYWRlckZvck9mLm9uSFNjcm9sbChzY3JvbGxMZWZ0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN1cGVyLmhvcml6b250YWxTY3JvbGxIYW5kbGVyKGV2ZW50KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdmVydGljYWxTY3JvbGxIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMudmVydGljYWxSb3dEaW1TY3JvbGxDb250YWluZXJzLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICB4Lm9uU2Nyb2xsKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHN1cGVyLnZlcnRpY2FsU2Nyb2xsSGFuZGxlcihldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhdXRvZ2VuZXJhdGVDb2x1bW5zKCkge1xuICAgICAgICBsZXQgY29sdW1ucyA9IFtdO1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5ncmlkQVBJLmZpbHRlckRhdGFCeUV4cHJlc3Npb25zKHRoaXMuZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKTtcbiAgICAgICAgdGhpcy5kaW1lbnNpb25EYXRhQ29sdW1ucyA9IHRoaXMuZ2VuZXJhdGVEaW1lbnNpb25Db2x1bW5zKCk7XG4gICAgICAgIGxldCBmaWVsZHNNYXA7XG4gICAgICAgIGlmICh0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5jb2x1bW5TdHJhdGVneSAmJiB0aGlzLnBpdm90Q29uZmlndXJhdGlvbi5jb2x1bW5TdHJhdGVneSBpbnN0YW5jZW9mIE5vb3BQaXZvdERpbWVuc2lvbnNTdHJhdGVneSkge1xuICAgICAgICAgICAgY29uc3QgZmllbGRzID0gdGhpcy5nZW5lcmF0ZURhdGFGaWVsZHMoZGF0YSk7XG4gICAgICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3Qgcm93RmllbGRzID0gUGl2b3RVdGlsLmZsYXR0ZW4odGhpcy5waXZvdENvbmZpZ3VyYXRpb24ucm93cykubWFwKHggPT4geC5tZW1iZXJOYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGtleUZpZWxkcyA9IE9iamVjdC52YWx1ZXModGhpcy5waXZvdEtleXMpO1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRGaWVsZHMgPSBmaWVsZHMuZmlsdGVyKHggPT4gcm93RmllbGRzLmluZGV4T2YoeCkgPT09IC0xICYmIGtleUZpZWxkcy5pbmRleE9mKHgpID09PSAtMSAmJlxuICAgICAgICAgICAgICAgIHguaW5kZXhPZih0aGlzLnBpdm90S2V5cy5yb3dEaW1lbnNpb25TZXBhcmF0b3IgKyB0aGlzLnBpdm90S2V5cy5sZXZlbCkgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgeC5pbmRleE9mKHRoaXMucGl2b3RLZXlzLnJvd0RpbWVuc2lvblNlcGFyYXRvciArIHRoaXMucGl2b3RLZXlzLnJlY29yZHMpID09PSAtMSk7XG4gICAgICAgICAgICBmaWVsZHNNYXAgPSB0aGlzLmdlbmVyYXRlRnJvbURhdGEoZmlsdGVyZWRGaWVsZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGRzTWFwID0gUGl2b3RVdGlsLmdldEZpZWxkc0hpZXJhcmNoeShcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uRGltZW5zaW9ucyxcbiAgICAgICAgICAgICAgICBQaXZvdERpbWVuc2lvblR5cGUuQ29sdW1uLFxuICAgICAgICAgICAgICAgIHRoaXMucGl2b3RLZXlzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGNvbHVtbnMgPSB0aGlzLmdlbmVyYXRlQ29sdW1uSGllcmFyY2h5KGZpZWxkc01hcCwgZGF0YSk7XG4gICAgICAgIHRoaXMuX2F1dG9HZW5lcmF0ZWRDb2xzID0gY29sdW1ucztcbiAgICAgICAgLy8gcmVzZXQgZXhwYW5zaW9uIHN0YXRlcyBpZiBhbnkgYXJlIHN0b3JlZC5cbiAgICAgICAgdGhpcy5jb2x1bW5Hcm91cFN0YXRlcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmltYXJ5Q29sdW1uID0gY29sdW1ucy5maW5kKHggPT4geC5maWVsZCA9PT0ga2V5ICYmIHguaGVhZGVyVGVtcGxhdGUgPT09IHRoaXMuaGVhZGVyVGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwU3VtbWFyeUNvbHVtbiA9IGNvbHVtbnMuZmluZCh4ID0+IHguZmllbGQgPT09IGtleSAmJiB4LmhlYWRlclRlbXBsYXRlICE9PSB0aGlzLmhlYWRlclRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVJvd0dyb3VwKHByaW1hcnlDb2x1bW4sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBTdW1tYXJ5Q29sdW1uKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwU3VtbWFyeUNvbHVtbi5oZWFkZXJUZW1wbGF0ZSA9IHRoaXMuaGVhZGVyVGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWZsb3coKTtcblxuICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQoY29sdW1ucyk7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zaG91bGRHZW5lcmF0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldENvbXBvbmVudERlbnNpdHlDbGFzcyhiYXNlU3R5bGVDbGFzczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuc3VwZXJDb21wYWN0TW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke2Jhc2VTdHlsZUNsYXNzfS0tJHtEaXNwbGF5RGVuc2l0eS5jb21wYWN0fSBpZ3gtZ3JpZF9fcGl2b3QtLXN1cGVyLWNvbXBhY3RgO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRDb21wb25lbnREZW5zaXR5Q2xhc3MoYmFzZVN0eWxlQ2xhc3MpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZW5lcmF0ZURpbWVuc2lvbkNvbHVtbnMoKTogSWd4Q29sdW1uQ29tcG9uZW50W10ge1xuICAgICAgICBjb25zdCByb290RmllbGRzID0gdGhpcy5hbGxEaW1lbnNpb25zLm1hcCh4ID0+IHgubWVtYmVyTmFtZSk7XG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXTtcbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoSWd4Q29sdW1uQ29tcG9uZW50KTtcbiAgICAgICAgcm9vdEZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVmID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3UmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5maWVsZCA9IGZpZWxkO1xuICAgICAgICAgICAgcmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIGNvbHVtbnMucHVzaChyZWYuaW5zdGFuY2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbHVtbnM7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlRnJvbURhdGEoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgICAgICBjb25zdCBzZXBhcmF0b3IgPSB0aGlzLnBpdm90S2V5cy5jb2x1bW5EaW1lbnNpb25TZXBhcmF0b3I7XG4gICAgICAgIGNvbnN0IGRhdGFBcnIgPSBmaWVsZHMubWFwKHggPT4geC5zcGxpdChzZXBhcmF0b3IpKS5zb3J0KHggPT4geC5sZW5ndGgpO1xuICAgICAgICBjb25zdCBoaWVyYXJjaHkgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAgICAgICBkYXRhQXJyLmZvckVhY2goYXJyID0+IHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50SGllcmFyY2h5ID0gaGllcmFyY2h5O1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgYXJyKSB7XG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGguam9pbihzZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRIaWVyYXJjaHkgPSBjdXJyZW50SGllcmFyY2h5LmdldChuZXdQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRhcmdldEhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SGllcmFyY2h5LnNldChuZXdQYXRoLCB7IHZhbHVlOiBuZXdQYXRoLCBleHBhbmRhYmxlOiB0cnVlLCBjaGlsZHJlbjogbmV3IE1hcDxzdHJpbmcsIGFueT4oKSwgZGltZW5zaW9uOiB0aGlzLmNvbHVtbkRpbWVuc2lvbnNbMF0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldEhpZXJhcmNoeSA9IGN1cnJlbnRIaWVyYXJjaHkuZ2V0KG5ld1BhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50SGllcmFyY2h5ID0gdGFyZ2V0SGllcmFyY2h5LmNoaWxkcmVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhpZXJhcmNoeTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVDb2x1bW5IaWVyYXJjaHkoZmllbGRzOiBNYXA8c3RyaW5nLCBhbnk+LCBkYXRhLCBwYXJlbnQgPSBudWxsKTogSWd4Q29sdW1uQ29tcG9uZW50W10ge1xuICAgICAgICBjb25zdCBmYWN0b3J5Q29sdW1uID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShJZ3hDb2x1bW5Db21wb25lbnQpO1xuICAgICAgICBsZXQgY29sdW1ucyA9IFtdO1xuICAgICAgICBpZiAoZmllbGRzLnNpemUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gZmFjdG9yeUNvbHVtbi5jcmVhdGUodGhpcy52aWV3UmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgICAgICByZWYuaW5zdGFuY2UuaGVhZGVyID0gdmFsdWUuZGlzcGxheU5hbWU7XG4gICAgICAgICAgICAgICAgcmVmLmluc3RhbmNlLmZpZWxkID0gdmFsdWUubWVtYmVyO1xuICAgICAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgcmVmLmluc3RhbmNlLndpZHRoID0gTUlOSU1VTV9DT0xVTU5fV0lEVEggKyAncHgnO1xuICAgICAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5zb3J0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVmLmluc3RhbmNlLmRhdGFUeXBlID0gdmFsdWUuZGF0YVR5cGUgfHwgdGhpcy5yZXNvbHZlRGF0YVR5cGVzKGRhdGFbMF1bdmFsdWUubWVtYmVyXSk7XG4gICAgICAgICAgICAgICAgcmVmLmluc3RhbmNlLmZvcm1hdHRlciA9IHZhbHVlLmZvcm1hdHRlcjtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLnB1c2gocmVmLmluc3RhbmNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbnM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlyc3QgPSBmaWVsZHMua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZGltOiBJUGl2b3REaW1lbnNpb24gPSBmaWVsZHMuZ2V0KGZpcnN0KS5kaW1lbnNpb247XG4gICAgICAgIGxldCBjdXJyZW50RmllbGRzID0gZmllbGRzO1xuICAgICAgICBpZiAoZGltICYmIGRpbS5zb3J0RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbShmaWVsZHMuZW50cmllcygpKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25zID0gW3tcbiAgICAgICAgICAgICAgICBkaXI6IGRpbS5zb3J0RGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogZGltLm1lbWJlck5hbWUsXG4gICAgICAgICAgICAgICAgc3RyYXRlZ3k6IERlZmF1bHRQaXZvdFNvcnRpbmdTdHJhdGVneS5pbnN0YW5jZSgpXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZCA9IERhdGFVdGlsLnNvcnQoY2xvbmVBcnJheShlbnRyaWVzLCB0cnVlKSwgZXhwcmVzc2lvbnMsIHRoaXMuc29ydFN0cmF0ZWd5LCB0aGlzLmdyaWRBUEkuZ3JpZCk7XG4gICAgICAgICAgICBjdXJyZW50RmllbGRzID0gbmV3IE1hcChzb3J0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRGaWVsZHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGxldCBzaG91bGRHZW5lcmF0ZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzaG91bGRHZW5lcmF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNob3VsZEdlbmVyYXRlICYmICh2YWx1ZS5jaGlsZHJlbiA9PSBudWxsIHx8IHZhbHVlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCB2YWx1ZS5jaGlsZHJlbi5zaXplID09PSAwKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuY3JlYXRlQ29sdW1uRm9yRGltZW5zaW9uKHZhbHVlLCBkYXRhLCBwYXJlbnQsIHRoaXMuaGFzTXVsdGlwbGVWYWx1ZXMpO1xuICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc011bHRpcGxlVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lYXN1cmVDaGlsZHJlbiA9IHRoaXMuZ2V0TWVhc3VyZUNoaWxkcmVuKGZhY3RvcnlDb2x1bW4sIGRhdGEsIGNvbCwgZmFsc2UsIHZhbHVlLmRpbWVuc2lvbi53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5jaGlsZHJlbi5yZXNldChtZWFzdXJlQ2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zID0gY29sdW1ucy5jb25jYXQobWVhc3VyZUNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hvdWxkR2VuZXJhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmNyZWF0ZUNvbHVtbkZvckRpbWVuc2lvbih2YWx1ZSwgZGF0YSwgcGFyZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuZXhwYW5kYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGVhZGVyVGVtcGxhdGUgPSB0aGlzLmhlYWRlclRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuZ2VuZXJhdGVDb2x1bW5IaWVyYXJjaHkodmFsdWUuY2hpbGRyZW4sIGRhdGEsIGNvbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRDaGlsZHJlbiA9IGNoaWxkcmVuLmZpbHRlcih4ID0+IHgubGV2ZWwgPT09IGNvbC5sZXZlbCArIDEpO1xuICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc011bHRpcGxlVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZWFzdXJlQ2hpbGRyZW4gPSB0aGlzLmdldE1lYXN1cmVDaGlsZHJlbihmYWN0b3J5Q29sdW1uLCBkYXRhLCBjb2wsIHRydWUsIHZhbHVlLmRpbWVuc2lvbi53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5lc3RlZENoaWxkcmVuID0gZmlsdGVyZWRDaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zdCBhbGxDaGlsZHJlbiA9IGNoaWxkcmVuLmNvbmNhdChtZWFzdXJlQ2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb2wuY2hpbGRyZW4ucmVzZXQobmVzdGVkQ2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zID0gY29sdW1ucy5jb25jYXQoY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZGltZW5zaW9uLmNoaWxkTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpYmxpbmcgPSB0aGlzLmNyZWF0ZUNvbHVtbkZvckRpbWVuc2lvbih2YWx1ZSwgZGF0YSwgcGFyZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaChzaWJsaW5nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWVhc3VyZUNoaWxkcmVuID0gdGhpcy5nZXRNZWFzdXJlQ2hpbGRyZW4oZmFjdG9yeUNvbHVtbiwgZGF0YSwgc2libGluZywgZmFsc2UsIHZhbHVlLmRpbWVuc2lvbj8ud2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZy5jaGlsZHJlbi5yZXNldChtZWFzdXJlQ2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucyA9IGNvbHVtbnMuY29uY2F0KG1lYXN1cmVDaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5jaGlsZHJlbi5yZXNldChmaWx0ZXJlZENoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucyA9IGNvbHVtbnMuY29uY2F0KGNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmRpbWVuc2lvbi5jaGlsZExldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaWJsaW5nID0gdGhpcy5jcmVhdGVDb2x1bW5Gb3JEaW1lbnNpb24odmFsdWUsIGRhdGEsIHBhcmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKHNpYmxpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29sdW1ucztcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY3JlYXRlQ29sdW1uRm9yRGltZW5zaW9uKHZhbHVlOiBhbnksIGRhdGE6IGFueSwgcGFyZW50OiBDb2x1bW5UeXBlLCBpc0dyb3VwOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlDb2x1bW4gPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KElneENvbHVtbkNvbXBvbmVudCk7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlDb2x1bW5Hcm91cCA9IHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoSWd4Q29sdW1uR3JvdXBDb21wb25lbnQpO1xuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZS52YWx1ZTtcbiAgICAgICAgY29uc3QgcmVmID0gaXNHcm91cCA/XG4gICAgICAgICAgICBmYWN0b3J5Q29sdW1uR3JvdXAuY3JlYXRlKHRoaXMudmlld1JlZi5pbmplY3RvcikgOlxuICAgICAgICAgICAgZmFjdG9yeUNvbHVtbi5jcmVhdGUodGhpcy52aWV3UmVmLmluamVjdG9yKTtcbiAgICAgICAgcmVmLmluc3RhbmNlLmhlYWRlciA9IHBhcmVudCAhPSBudWxsID8ga2V5LnNwbGl0KHBhcmVudC5oZWFkZXIgKyB0aGlzLnBpdm90S2V5cy5jb2x1bW5EaW1lbnNpb25TZXBhcmF0b3IpWzFdIDoga2V5O1xuICAgICAgICByZWYuaW5zdGFuY2UuZmllbGQgPSBrZXk7XG4gICAgICAgIHJlZi5pbnN0YW5jZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHJlZi5pbnN0YW5jZS53aWR0aCA9IHRoaXMucmVzb2x2ZUNvbHVtbkRpbWVuc2lvbldpZHRoKHZhbHVlLmRpbWVuc2lvbik7XG4gICAgICAgIGNvbnN0IHZhbHVlRGVmaW5pdGlvbiA9IHRoaXMudmFsdWVzWzBdO1xuICAgICAgICByZWYuaW5zdGFuY2UuZGF0YVR5cGUgPSB2YWx1ZURlZmluaXRpb24/LmRhdGFUeXBlIHx8IHRoaXMucmVzb2x2ZURhdGFUeXBlcyhkYXRhWzBdW3ZhbHVlRGVmaW5pdGlvbj8ubWVtYmVyXSk7XG4gICAgICAgIHJlZi5pbnN0YW5jZS5mb3JtYXR0ZXIgPSB2YWx1ZURlZmluaXRpb24/LmZvcm1hdHRlcjtcbiAgICAgICAgcmVmLmluc3RhbmNlLnNvcnRhYmxlID0gdHJ1ZTtcbiAgICAgICAgcmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgcmV0dXJuIHJlZi5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVzb2x2ZUNvbHVtbkRpbWVuc2lvbldpZHRoKGRpbTogSVBpdm90RGltZW5zaW9uKSB7XG4gICAgICAgIGlmIChkaW0ud2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBkaW0ud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3VwZXJDb21wYWN0TW9kZSA/IE1JTklNVU1fQ09MVU1OX1dJRFRIX1NVUEVSX0NPTVBBQ1QgKyAncHgnIDogTUlOSU1VTV9DT0xVTU5fV0lEVEggKyAncHgnO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRNZWFzdXJlQ2hpbGRyZW4oY29sRmFjdG9yeSwgZGF0YSwgcGFyZW50LCBoaWRkZW4sIHBhcmVudFdpZHRoKSB7XG4gICAgICAgIGNvbnN0IGNvbHMgPSBbXTtcbiAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLnZhbHVlcy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gcGFyZW50V2lkdGggPyBwYXJzZUludChwYXJlbnRXaWR0aCwgMTApIC8gY291bnQgOlxuICAgICAgICAgICAgdGhpcy5zdXBlckNvbXBhY3RNb2RlID8gTUlOSU1VTV9DT0xVTU5fV0lEVEhfU1VQRVJfQ09NUEFDVCA6IE1JTklNVU1fQ09MVU1OX1dJRFRIO1xuICAgICAgICBjb25zdCBpc1BlcmNlbnQgPSBwYXJlbnRXaWR0aCAmJiBwYXJlbnRXaWR0aC5pbmRleE9mKCclJykgIT09IC0xO1xuICAgICAgICB0aGlzLnZhbHVlcy5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWYgPSBjb2xGYWN0b3J5LmNyZWF0ZSh0aGlzLnZpZXdSZWYuaW5qZWN0b3IpO1xuICAgICAgICAgICAgcmVmLmluc3RhbmNlLmhlYWRlciA9IHZhbC5kaXNwbGF5TmFtZSB8fCB2YWwubWVtYmVyO1xuICAgICAgICAgICAgcmVmLmluc3RhbmNlLmZpZWxkID0gcGFyZW50LmZpZWxkICsgdGhpcy5waXZvdEtleXMuY29sdW1uRGltZW5zaW9uU2VwYXJhdG9yICsgdmFsLm1lbWJlcjtcbiAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICByZWYuaW5zdGFuY2Uud2lkdGggPSBpc1BlcmNlbnQgPyB3aWR0aCArICclJyA6IHdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5oaWRkZW4gPSBoaWRkZW47XG4gICAgICAgICAgICByZWYuaW5zdGFuY2Uuc29ydGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgcmVmLmluc3RhbmNlLmRhdGFUeXBlID0gdmFsLmRhdGFUeXBlIHx8IHRoaXMucmVzb2x2ZURhdGFUeXBlcyhkYXRhWzBdW3ZhbC5tZW1iZXJdKTtcbiAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5mb3JtYXR0ZXIgPSB2YWwuZm9ybWF0dGVyO1xuICAgICAgICAgICAgcmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIGNvbHMucHVzaChyZWYuaW5zdGFuY2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICovXG4gICAgQFZpZXdDaGlsZCgnZW1wdHlQaXZvdEdyaWRUZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBkZWZhdWx0RW1wdHlQaXZvdEdyaWRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBhIGN1c3RvbSB0ZW1wbGF0ZSB3aGVuIHBpdm90IGdyaWQgaXMgZW1wdHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXBpdm90LWdyaWQgW2VtcHR5UGl2b3RHcmlkVGVtcGxhdGVdPVwibXlUZW1wbGF0ZVwiPjxpZ3gtcGl2b3QtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBlbXB0eVBpdm90R3JpZFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICovXG4gICAgcHVibGljIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgY29uc3QgYWxsRW5hYmxlZERpbWVuc2lvbnMgPSB0aGlzLnJvd0RpbWVuc2lvbnMuY29uY2F0KHRoaXMuY29sdW1uRGltZW5zaW9ucyk7XG4gICAgICAgIGlmIChhbGxFbmFibGVkRGltZW5zaW9ucy5sZW5ndGggPT09IDAgJiYgdGhpcy52YWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBubyBlbmFibGVkIHZhbHVlcyBhbmQgZGltZW5zaW9uc1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1wdHlQaXZvdEdyaWRUZW1wbGF0ZSB8fCB0aGlzLmRlZmF1bHRFbXB0eVBpdm90R3JpZFRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLnRlbXBsYXRlO1xuICAgIH1cbn1cbiIsIjwhLS0gVG9vbGJhciBhcmVhIC0tPlxuPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LWdyaWQtdG9vbGJhclwiPjwvbmctY29udGVudD5cblxuPCEtLSBHcmlkIHRhYmxlIGhlYWQgcm93IGFyZWEgLS0+XG48aWd4LXBpdm90LWhlYWRlci1yb3cgY2xhc3M9XCJpZ3gtZ3JpZC10aGVhZCBpZ3gtZ3JpZC10aGVhZC0tcGl2b3RcIiB0YWJpbmRleD1cIjBcIlxuICAgIFtncmlkXT1cInRoaXNcIlxuICAgIFtoYXNNUkxdPVwiaGFzQ29sdW1uTGF5b3V0c1wiXG4gICAgW2RlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIlxuICAgIFthY3RpdmVEZXNjZW5kYW50XT1cImFjdGl2ZURlc2NlbmRhbnRcIlxuICAgIFt3aWR0aF09XCJjYWxjV2lkdGhcIlxuICAgIFtwaW5uZWRDb2x1bW5Db2xsZWN0aW9uXT1cInBpbm5lZENvbHVtbnNcIlxuICAgIFt1bnBpbm5lZENvbHVtbkNvbGxlY3Rpb25dPVwidW5waW5uZWRDb2x1bW5zXCJcbiAgICAoa2V5ZG93bi5tZXRhLmMpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiXG4gICAgKGtleWRvd24uY29udHJvbC5jKT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChjb3B5KT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChrZXlkb3duKT1cIm5hdmlnYXRpb24uaGVhZGVyTmF2aWdhdGlvbigkZXZlbnQpXCJcbiAgICAoc2Nyb2xsKT1cInByZXZlbnRIZWFkZXJTY3JvbGwoJGV2ZW50KVwiXG4+XG48L2lneC1waXZvdC1oZWFkZXItcm93PlxuXG48ZGl2IGlneEdyaWRCb2R5IChrZXlkb3duLmNvbnRyb2wuYyk9XCJjb3B5SGFuZGxlcigkZXZlbnQpXCIgKGNvcHkpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5XCIgcm9sZT1cInJvd2dyb3VwXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInJvd0RpbWVuc2lvbnMubGVuZ3RoID8gZGVmYXVsdFJvd0RpbWVuc2lvbnNUZW1wbGF0ZSA6IGVtcHR5Um93RGltZW5zaW9uc1RlbXBsYXRlOyBjb250ZXh0OiB0aGlzXCI+PC9uZy1jb250YWluZXI+XG4gICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1jb250ZW50XCIgdGFiaW5kZXg9XCIwXCIgW2F0dHIucm9sZV09XCJkYXRhVmlldy5sZW5ndGggPyBudWxsIDogJ3JvdydcIiAoa2V5ZG93bik9XCJuYXZpZ2F0aW9uLmhhbmRsZU5hdmlnYXRpb24oJGV2ZW50KVwiIChmb2N1cyk9XCJuYXZpZ2F0aW9uLmZvY3VzVGJvZHkoJGV2ZW50KVwiXG4gICAgICAgIChkcmFnU3RvcCk9XCJzZWxlY3Rpb25TZXJ2aWNlLmRyYWdNb2RlID0gJGV2ZW50XCIgKHNjcm9sbCk9J3ByZXZlbnRDb250YWluZXJTY3JvbGwoJGV2ZW50KSdcbiAgICAgICAgKGRyYWdTY3JvbGwpPVwiZHJhZ1Njcm9sbCgkZXZlbnQpXCIgW2lneEdyaWREcmFnU2VsZWN0XT1cInNlbGVjdGlvblNlcnZpY2UuZHJhZ01vZGVcIlxuICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT0ndG90YWxIZWlnaHQnIFtzdHlsZS53aWR0aC5weF09J2NhbGNXaWR0aCB8fCBudWxsJyAjdGJvZHkgW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XT1cImFjdGl2ZURlc2NlbmRhbnRcIj5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJoYXNNb3ZhYmxlQ29sdW1ucyAmJiBjb2x1bW5JbkRyYWcgJiYgcGlubmVkQ29sdW1ucy5sZW5ndGggPD0gMFwiXG4gICAgICAgICAgICBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiIGlkPVwibGVmdFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtb24tZHJhZy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj1cImhhc01vdmFibGVDb2x1bW5zICYmIGNvbHVtbkluRHJhZyAmJiBwaW5uZWRDb2x1bW5zLmxlbmd0aCA+IDBcIlxuICAgICAgICAgICAgW2lneENvbHVtbk1vdmluZ0Ryb3BdPVwiaGVhZGVyQ29udGFpbmVyXCIgW2F0dHIuZHJvcHBhYmxlXT1cInRydWVcIiBpZD1cImxlZnRcIlxuICAgICAgICAgICAgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW9uLWRyYWctcGlubmVkXCIgW3N0eWxlLmxlZnQucHhdPVwicGlubmVkV2lkdGhcIj48L3NwYW4+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hHcmlkRm9yIGxldC1yb3dEYXRhIFtpZ3hHcmlkRm9yT2ZdPVwiZGF0YVxuICAgICAgICB8IHBpdm90R3JpZEZpbHRlcjpwaXZvdENvbmZpZ3VyYXRpb246ZmlsdGVyU3RyYXRlZ3k6YWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU6ZmlsdGVyaW5nUGlwZVRyaWdnZXI6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBwaXZvdEdyaWRTb3J0OnBpdm90Q29uZmlndXJhdGlvbjpzb3J0U3RyYXRlZ3k6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBwaXZvdEdyaWRSb3c6cGl2b3RDb25maWd1cmF0aW9uOmV4cGFuc2lvblN0YXRlczpwaXBlVHJpZ2dlcjpzb3J0aW5nRXhwcmVzc2lvbnNcbiAgICAgICAgfCBwaXZvdEdyaWRDb2x1bW46cGl2b3RDb25maWd1cmF0aW9uOmV4cGFuc2lvblN0YXRlczpwaXBlVHJpZ2dlcjpzb3J0aW5nRXhwcmVzc2lvbnNcbiAgICAgICAgfCBwaXZvdEdyaWRBdXRvVHJhbnNmb3JtOnBpdm90Q29uZmlndXJhdGlvbjpwaXBlVHJpZ2dlclxuICAgICAgICB8IHBpdm90R3JpZENvbHVtblNvcnQ6c29ydGluZ0V4cHJlc3Npb25zOnNvcnRTdHJhdGVneTpwaXBlVHJpZ2dlclxuICAgICAgICB8IHBpdm90R3JpZFJvd0V4cGFuc2lvbjpwaXZvdENvbmZpZ3VyYXRpb246ZXhwYW5zaW9uU3RhdGVzOmRlZmF1bHRFeHBhbmRTdGF0ZTpwaXBlVHJpZ2dlclwiXG4gICAgICAgICAgICBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCIndmVydGljYWwnXCIgW2lneEZvclNjcm9sbENvbnRhaW5lcl09J3ZlcnRpY2FsU2Nyb2xsJ1xuICAgICAgICAgICAgW2lneEZvckNvbnRhaW5lclNpemVdPSdjYWxjSGVpZ2h0J1xuICAgICAgICAgICAgW2lneEZvckl0ZW1TaXplXT1cImhhc0NvbHVtbkxheW91dHMgPyByb3dIZWlnaHQgKiBtdWx0aVJvd0xheW91dFJvd1NpemUgKyAxIDogcmVuZGVyZWRSb3dIZWlnaHRcIlxuICAgICAgICAgICAgW2lneEdyaWRGb3JPZlZhcmlhYmxlU2l6ZXNdPSdmYWxzZSdcbiAgICAgICAgICAgICN2ZXJ0aWNhbFNjcm9sbENvbnRhaW5lcj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIFtpZ3hUZW1wbGF0ZU91dGxldF09J3JlY29yZFRlbXBsYXRlJ1xuICAgICAgICAgICAgICAgIFtpZ3hUZW1wbGF0ZU91dGxldENvbnRleHRdPSdnZXRDb250ZXh0KHJvd0RhdGEsIHJvd0luZGV4KSdcbiAgICAgICAgICAgICAgICAoY2FjaGVkVmlld0xvYWRlZCk9J2NhY2hlZFZpZXdMb2FkZWQoJGV2ZW50KSc+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI3JlY29yZF90ZW1wbGF0ZSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIGxldC1yb3dEYXRhPlxuICAgICAgICAgICAgPGlneC1waXZvdC1yb3cgW3N0eWxlLmhlaWdodC5weF09XCJyZW5kZXJlZFJvd0hlaWdodFwiIFtncmlkSURdPVwiaWRcIiBbaW5kZXhdPVwicm93SW5kZXhcIiBbZGF0YV09XCJyb3dEYXRhXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJyb3dDbGFzc2VzIHwgaWd4R3JpZFJvd0NsYXNzZXM6cm93OnJvdy5pbkVkaXRNb2RlOnJvdy5zZWxlY3RlZDpyb3cuZGlydHk6cm93LmRlbGV0ZWQ6cm93LmRyYWdnaW5nOnJvd0luZGV4Omhhc0NvbHVtbkxheW91dHM6ZmFsc2U6cm93RGF0YTpwaXBlVHJpZ2dlclwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwicm93U3R5bGVzIHwgaWd4R3JpZFJvd1N0eWxlczpyb3dEYXRhOnJvd0luZGV4OnBpcGVUcmlnZ2VyXCIgI3Jvdz5cbiAgICAgICAgICAgIDwvaWd4LXBpdm90LXJvdz5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPGlnYy10cmlhbC13YXRlcm1hcms+PC9pZ2MtdHJpYWwtd2F0ZXJtYXJrPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWd4VG9nZ2xlICNsb2FkaW5nT3ZlcmxheT5cbiAgICAgICAgPGlneC1jaXJjdWxhci1iYXIgW2luZGV0ZXJtaW5hdGVdPVwidHJ1ZVwiICpuZ0lmPSdzaG91bGRPdmVybGF5TG9hZGluZyc+XG4gICAgICAgIDwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiAqbmdJZj1cImhhc01vdmFibGVDb2x1bW5zICYmIGNvbHVtbkluRHJhZ1wiIFtpZ3hDb2x1bW5Nb3ZpbmdEcm9wXT1cImhlYWRlckNvbnRhaW5lclwiIFthdHRyLmRyb3BwYWJsZV09XCJ0cnVlXCJcbiAgICAgICAgaWQ9XCJyaWdodFwiIGNsYXNzPVwiaWd4LWdyaWRfX3Njcm9sbC1vbi1kcmFnLXJpZ2h0XCI+PC9zcGFuPlxuICAgIDxkaXYgW2hpZGRlbl09JyFoYXNWZXJ0aWNhbFNjcm9sbCgpJyBjbGFzcz1cImlneC1ncmlkX190Ym9keS1zY3JvbGxiYXJcIiBbc3R5bGUud2lkdGgucHhdPVwic2Nyb2xsU2l6ZVwiIChwb2ludGVyZG93bik9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LXNjcm9sbGJhci1zdGFydFwiIFtzdHlsZS5oZWlnaHQucHhdPScgaXNSb3dQaW5uaW5nVG9Ub3AgPyBwaW5uZWRSb3dIZWlnaHQgOiAwJz48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1zY3JvbGxiYXItbWFpblwiIFtzdHlsZS5oZWlnaHQucHhdPSdjYWxjSGVpZ2h0Jz5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hHcmlkRm9yIFtpZ3hHcmlkRm9yT2ZdPSdbXScgI3ZlcnRpY2FsU2Nyb2xsSG9sZGVyPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LXNjcm9sbGJhci1lbmRcIiBbc3R5bGUuaGVpZ2h0LnB4XT0nIWlzUm93UGlubmluZ1RvVG9wID8gcGlubmVkUm93SGVpZ2h0IDogMCc+PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2FkZHJvdy1zbmFja2JhclwiPlxuICAgICAgICA8aWd4LXNuYWNrYmFyICNhZGRSb3dTbmFja2JhciBbb3V0bGV0XT1cImlneEJvZHlPdmVybGF5T3V0bGV0XCIgW2FjdGlvblRleHRdPVwicmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX3NuYWNrYmFyX2FkZHJvd19hY3Rpb250ZXh0XCIgW2Rpc3BsYXlUaW1lXT0nc25hY2tiYXJEaXNwbGF5VGltZSc+e3tyZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfc25hY2tiYXJfYWRkcm93X2xhYmVsfX08L2lneC1zbmFja2Jhcj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgI2lneEJvZHlPdmVybGF5T3V0bGV0PVwib3ZlcmxheS1vdXRsZXRcIiBpZ3hPdmVybGF5T3V0bGV0PjwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsXCIgW3N0eWxlLmhlaWdodC5weF09XCJzY3JvbGxTaXplXCIgI3NjciBbaGlkZGVuXT1cImlzSG9yaXpvbnRhbFNjcm9sbEhpZGRlblwiIChwb2ludGVyZG93bik9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLXN0YXJ0XCIgW3N0eWxlLndpZHRoLnB4XT0naXNQaW5uaW5nVG9TdGFydCA/IHBpbm5lZFdpZHRoIDogaGVhZGVyRmVhdHVyZXNXaWR0aCcgW3N0eWxlLm1pbi13aWR0aC5weF09J2lzUGlubmluZ1RvU3RhcnQgPyBwaW5uZWRXaWR0aCA6IGhlYWRlckZlYXR1cmVzV2lkdGgnPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW1haW5cIiBbc3R5bGUud2lkdGgucHhdPSd1bnBpbm5lZFdpZHRoJz5cbiAgICAgICAgPG5nLXRlbXBsYXRlIGlneEdyaWRGb3IgW2lneEdyaWRGb3JPZl09J0VNUFRZX0RBVEEnICNzY3JvbGxDb250YWluZXI+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtZW5kXCIgW3N0eWxlLmZsb2F0XT0nXCJyaWdodFwiJyBbc3R5bGUud2lkdGgucHhdPSdwaW5uZWRXaWR0aCcgW3N0eWxlLm1pbi13aWR0aC5weF09J3Bpbm5lZFdpZHRoJyBbaGlkZGVuXT1cInBpbm5lZFdpZHRoID09PSAwIHx8IGlzUGlubmluZ1RvU3RhcnRcIj48L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rmb290XCIgcm9sZT1cInJvd2dyb3VwXCIgI3Rmb290PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fZm9vdGVyXCIgI2Zvb3Rlcj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtZ3JpZC1mb290ZXJcIj48L25nLWNvbnRlbnQ+XG48L2Rpdj5cblxuPG5nLXRlbXBsYXRlICNlbXB0eUZpbHRlcmVkR3JpZD5cbiAgICA8c3BhbiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1tZXNzYWdlXCIgcm9sZT1cImNlbGxcIj5cbiAgICAgICAgPHNwYW4+e3tlbXB0eUZpbHRlcmVkR3JpZE1lc3NhZ2V9fTwvc3Bhbj5cbiAgICA8L3NwYW4+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRFbXB0eUdyaWQ+XG4gICAgPHNwYW4gY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktbWVzc2FnZVwiIHJvbGU9XCJjZWxsXCI+XG4gICAgICAgIDxzcGFuPnt7ZW1wdHlHcmlkTWVzc2FnZX19PC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdExvYWRpbmdHcmlkPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fbG9hZGluZ1wiPlxuICAgICAgICA8aWd4LWNpcmN1bGFyLWJhciBbaW5kZXRlcm1pbmF0ZV09XCJ0cnVlXCI+XG4gICAgICAgIDwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG48aWd4LXBpdm90LWdyaWQtY29sdW1uLXJlc2l6ZXIgW3Jlc3RyaWN0UmVzaXplclRvcF09XCJ0aGVhZFJvdy5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodFwiICpuZ0lmPVwiY29sUmVzaXppbmdTZXJ2aWNlLnNob3dSZXNpemVyXCI+PC9pZ3gtcGl2b3QtZ3JpZC1jb2x1bW4tcmVzaXplcj5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fbG9hZGluZy1vdXRsZXRcIiAjaWd4TG9hZGluZ092ZXJsYXlPdXRsZXQgaWd4T3ZlcmxheU91dGxldD48L2Rpdj5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fb3V0bGV0XCIgI2lneEZpbHRlcmluZ092ZXJsYXlPdXRsZXQgaWd4T3ZlcmxheU91dGxldD48L2Rpdj5cblxuPG5nLXRlbXBsYXRlICNoZWFkZXJUZW1wbGF0ZSBsZXQtY29sdW1uPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdHItLWhlYWRlclwiPlxuICAgICAgICA8aWd4LWljb24gW2F0dHIuZHJhZ2dhYmxlXT1cImZhbHNlXCJcbiAgICAgICAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVDb2x1bW4oY29sdW1uKVwiPlxuICAgICAgICAgICAgICAgICAge3tnZXRDb2x1bW5Hcm91cEV4cGFuZFN0YXRlKGNvbHVtbikgPyAnY2hldnJvbl9yaWdodCcgOiAnZXhwYW5kX21vcmUnfX08L2lneC1pY29uPlxuICAgICAgICB7e2NvbHVtbi5oZWFkZXJ9fVxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Um93RGltZW5zaW9uc1RlbXBsYXRlPlxuICAgIDxkaXYgdGFiaW5kZXg9XCIwXCIgW3N0eWxlLmhlaWdodC5weF09J3RvdGFsSGVpZ2h0JyAqbmdGb3I9J2xldCBkaW0gb2Ygcm93RGltZW5zaW9uczsgbGV0IGRpbUluZGV4ID0gaW5kZXg7JyAjcm93RGltZW5zaW9uQ29udGFpbmVyIHJvbGU9XCJyb3dncm91cFwiIGNsYXNzPSdpZ3gtZ3JpZF9fdGJvZHktcGl2b3QtZGltZW5zaW9uJyAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c1Rib2R5KCRldmVudClcIiAoa2V5ZG93bik9XCJuYXZpZ2F0aW9uLmhhbmRsZU5hdmlnYXRpb24oJGV2ZW50KVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgaWd4R3JpZEZvciBsZXQtcm93RGF0YSBbaWd4R3JpZEZvck9mXT1cImRhdGFWaWV3XG4gICAgICAgIHwgcGl2b3RHcmlkQ2VsbE1lcmdpbmc6cGl2b3RDb25maWd1cmF0aW9uOmRpbTpwaXBlVHJpZ2dlclwiXG4gICAgICAgICAgICAgICAgICAgICBsZXQtcm93SW5kZXg9XCJpbmRleFwiIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCIndmVydGljYWwnXCIgW2lneEZvclNjcm9sbENvbnRhaW5lcl09J3ZlcnRpY2FsU2Nyb2xsJ1xuICAgICAgICAgICAgICAgICAgICAgW2lneEZvckNvbnRhaW5lclNpemVdPSdjYWxjSGVpZ2h0J1xuICAgICAgICAgICAgICAgICAgICAgW2lneEZvckl0ZW1TaXplXT1cInJlbmRlcmVkUm93SGVpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgIFtpZ3hGb3JTaXplUHJvcE5hbWVdPSdcImhlaWdodFwiJ1xuICAgICAgICAgICAgICAgICAgICAgI3ZlcnRpY2FsUm93RGltU2Nyb2xsQ29udGFpbmVyPlxuICAgICAgICAgICAgPGlneC1waXZvdC1yb3ctZGltZW5zaW9uLWNvbnRlbnQgcm9sZT0ncm93JyBjbGFzcz1cImlneC1ncmlkLXRoZWFkXCIgW2dyaWRdPVwidGhpc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZGltZW5zaW9uXT0ncm93RGF0YS5kaW1lbnNpb25zW2RpbUluZGV4XSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyb290RGltZW5zaW9uXT0nZGltJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJyZW5kZXJlZFJvd0hlaWdodCAqIChyb3dEYXRhLnJvd1NwYW4gfHwgMSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Jvd0luZGV4XT0ncm93SW5kZXgnIFtyb3dEYXRhXT0ncm93RGF0YSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkZW5zaXR5XT1cImRpc3BsYXlEZW5zaXR5XCIgW3dpZHRoXT1cInJvd0RpbWVuc2lvbldpZHRoVG9QaXhlbHMoZGltKVwiPlxuICAgICAgICAgICAgPC9pZ3gtcGl2b3Qtcm93LWRpbWVuc2lvbi1jb250ZW50PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjZW1wdHlSb3dEaW1lbnNpb25zVGVtcGxhdGU+XG4gICAgPGRpdiB0YWJpbmRleD1cIjBcIiAqbmdJZj0nY29sdW1uRGltZW5zaW9ucy5sZW5ndGggPiAwIHx8IHZhbHVlcy5sZW5ndGggPiAwJyAjcm93RGltZW5zaW9uQ29udGFpbmVyIHJvbGU9XCJyb3dncm91cFwiIGNsYXNzPSdpZ3gtZ3JpZF9fdGJvZHktcGl2b3QtZGltZW5zaW9uJyAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c1Rib2R5KCRldmVudClcIiAoa2V5ZG93bik9XCJuYXZpZ2F0aW9uLmhhbmRsZU5hdmlnYXRpb24oJGV2ZW50KVwiPlxuICAgICAgICA8aWd4LXBpdm90LXJvdy1kaW1lbnNpb24tY29udGVudCByb2xlPSdyb3cnIGNsYXNzPVwiaWd4LWdyaWQtdGhlYWRcIiBbZ3JpZF09XCJ0aGlzXCJcbiAgICAgICAgICAgIFtkaW1lbnNpb25dPSdlbXB0eVJvd0RpbWVuc2lvbidcbiAgICAgICAgICAgIFtyb290RGltZW5zaW9uXT0nZW1wdHlSb3dEaW1lbnNpb24nXG4gICAgICAgICAgICBbcm93SW5kZXhdPScwJyBbcm93RGF0YV09J2RhdGFWaWV3WzBdJ1xuICAgICAgICAgICAgW2RlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIiBbd2lkdGhdPVwicm93RGltZW5zaW9uV2lkdGhUb1BpeGVscyhlbXB0eVJvd0RpbWVuc2lvbilcIj5cbiAgICAgICAgPC9pZ3gtcGl2b3Qtcm93LWRpbWVuc2lvbi1jb250ZW50PlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNlbXB0eVBpdm90R3JpZFRlbXBsYXRlPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LW1lc3NhZ2VcIiByb2xlPVwiY2VsbFwiPlxuICAgICAgICA8c3Bhbj57e3Jlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9waXZvdF9lbXB0eV9tZXNzYWdlfX08L3NwYW4+XG4gICAgPC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cblxuPGRpdiBbaGlkZGVuXT0ndHJ1ZSc+XG4gICAgPGlneC1ncmlkLWV4Y2VsLXN0eWxlLWZpbHRlcmluZyBbbWF4SGVpZ2h0XT0nZXhjZWxTdHlsZUZpbHRlck1heEhlaWdodCcgW21pbkhlaWdodF09J2V4Y2VsU3R5bGVGaWx0ZXJNaW5IZWlnaHQnPlxuICAgICAgICA8ZGl2IGlneEV4Y2VsU3R5bGVDb2x1bW5PcGVyYXRpb25zIFtoaWRkZW5dPSd0cnVlJz48L2Rpdj5cbiAgICAgICAgPGlneC1leGNlbC1zdHlsZS1maWx0ZXItb3BlcmF0aW9ucz5cbiAgICAgICAgICAgIDxpZ3gtZXhjZWwtc3R5bGUtc2VhcmNoPjwvaWd4LWV4Y2VsLXN0eWxlLXNlYXJjaD5cbiAgICAgICAgPC9pZ3gtZXhjZWwtc3R5bGUtZmlsdGVyLW9wZXJhdGlvbnM+XG4gICAgPC9pZ3gtZ3JpZC1leGNlbC1zdHlsZS1maWx0ZXJpbmc+XG48L2Rpdj5cbiJdfQ==