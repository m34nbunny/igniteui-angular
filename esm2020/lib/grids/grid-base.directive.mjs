import { __decorate } from "tslib";
import { DOCUMENT, formatNumber, getLocaleNumberFormat, NumberFormatStyle } from '@angular/common';
import { ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, LOCALE_ID, Optional, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { formatDate, resizeObservable } from '../core/utils';
import 'igniteui-trial-watermark';
import { Subject, pipe, fromEvent, animationFrameScheduler, merge } from 'rxjs';
import { takeUntil, first, filter, throttleTime, map, shareReplay, takeWhile } from 'rxjs/operators';
import { cloneArray, mergeObjects, compareMaps, resolveNestedPath, isObject } from '../core/utils';
import { GridColumnDataType } from '../data-operations/data-util';
import { FilteringLogic } from '../data-operations/filtering-expression.interface';
import { IgxGridForOfDirective } from '../directives/for-of/for_of.directive';
import { IgxTextHighlightDirective } from '../directives/text-highlight/text-highlight.directive';
import { RowEditPositionStrategy } from './grid.common';
import { IgxGridToolbarComponent } from './toolbar/grid-toolbar.component';
import { IgxRowDirective } from './row.directive';
import { IgxOverlayOutletDirective, IgxToggleDirective } from '../directives/toggle/toggle.directive';
import { FilteringExpressionsTree, FilteringExpressionsTreeType } from '../data-operations/filtering-expressions-tree';
import { TransactionType } from '../services/public_api';
import { IgxRowAddTextDirective, IgxRowEditTemplateDirective, IgxRowEditTabStopDirective, IgxRowEditTextDirective, IgxRowEditActionsDirective } from './grid.rowEdit.directive';
import { DisplayDensityToken, DisplayDensityBase, DisplayDensity } from '../core/displayDensity';
import { WatchChanges } from './watch-changes';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { IgxSummaryRowComponent } from './summaries/summary-row.component';
import { IgxEditRow, IgxCell, IgxAddRow } from './common/crud.service';
import { IgxTemplateOutletDirective } from '../directives/template-outlet/template_outlet.directive';
import { IgxExcelStyleLoadingValuesTemplateDirective } from './filtering/excel-style/excel-style-search.component';
import { IgxGridColumnResizerComponent } from './resizing/resizer.component';
import { CharSeparatedValueData } from '../services/csv/char-separated-value-data';
import { FilteringStrategy } from '../data-operations/filtering-strategy';
import { IgxRowExpandedIndicatorDirective, IgxRowCollapsedIndicatorDirective, IgxHeaderExpandIndicatorDirective, IgxHeaderCollapseIndicatorDirective, IgxExcelStyleHeaderIconDirective, IgxSortAscendingHeaderIconDirective, IgxSortDescendingHeaderIconDirective, IgxSortHeaderIconDirective } from './grid/grid.directives';
import { GridSelectionMode, GridSummaryPosition, GridSummaryCalculationMode, FilterMode, ColumnPinningPosition, RowPinningPosition, GridPagingMode } from './common/enums';
import { IgxAdvancedFilteringDialogComponent } from './filtering/advanced-filtering/advanced-filtering-dialog.component';
import { IGX_GRID_SERVICE_BASE } from './common/grid.interface';
import { DropPosition } from './moving/moving.service';
import { IgxHeadSelectorDirective, IgxRowSelectorDirective } from './selection/row-selectors';
import { IgxColumnComponent } from './columns/column.component';
import { IgxColumnGroupComponent } from './columns/column-group.component';
import { IgxRowDragGhostDirective, IgxDragIndicatorIconDirective } from './row-drag.directive';
import { IgxSnackbarComponent } from '../snackbar/snackbar.component';
import { v4 as uuidv4 } from 'uuid';
import { IgxActionStripComponent } from '../action-strip/action-strip.component';
import { IgxPaginatorComponent } from '../paginator/paginator.component';
import { IgxGridHeaderRowComponent } from './headers/grid-header-row.component';
import { IgxGridGroupByAreaComponent } from './grouping/grid-group-by-area.component';
import { IgxGridTransaction } from './common/types';
import { VerticalAlignment, HorizontalAlignment } from '../services/overlay/utilities';
import { IgxOverlayService } from '../services/overlay/overlay';
import { ConnectedPositioningStrategy } from '../services/overlay/position/connected-positioning-strategy';
import { ContainerPositionStrategy } from '../services/overlay/position/container-position-strategy';
import { AbsoluteScrollStrategy } from '../services/overlay/scroll/absolute-scroll-strategy';
import { TransactionEventOrigin } from '../services/transaction/transaction';
import { SortingDirection } from '../data-operations/sorting-strategy';
import { IgxGridExcelStyleFilteringComponent } from './filtering/excel-style/grid.excel-style-filtering.component';
import { DefaultDataCloneStrategy } from '../data-operations/data-clone-strategy';
import * as i0 from "@angular/core";
import * as i1 from "./selection/selection.service";
import * as i2 from "./resizing/resizing.service";
import * as i3 from "../services/transaction/transaction-factory.service";
import * as i4 from "./grid-navigation.service";
import * as i5 from "./filtering/grid-filtering.service";
import * as i6 from "./summaries/grid-summary.service";
import * as i7 from "../core/utils";
import * as i8 from "../services/overlay/overlay";
let FAKE_ROW_ID = -1;
const DEFAULT_ITEMS_PER_PAGE = 15;
const MINIMUM_COLUMN_WIDTH = 136;
const FILTER_ROW_HEIGHT = 50;
// By default row editing overlay outlet is inside grid body so that overlay is hidden below grid header when scrolling.
// In cases when grid has 1-2 rows there isn't enough space in grid body and row editing overlay should be shown above header.
// Default row editing overlay height is higher then row height that is why the case is valid also for row with 2 rows.
// More accurate calculation is not possible, cause row editing overlay is still not shown and we don't know its height,
// but in the same time we need to set row editing overlay outlet before opening the overlay itself.
const MIN_ROW_EDITING_COUNT_THRESHOLD = 2;
export class IgxGridBaseDirective extends DisplayDensityBase {
    constructor(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform, _diTransactions) {
        super(_displayDensityOptions);
        this.selectionService = selectionService;
        this.colResizingService = colResizingService;
        this.gridAPI = gridAPI;
        this.transactionFactory = transactionFactory;
        this.elementRef = elementRef;
        this.zone = zone;
        this.document = document;
        this.cdr = cdr;
        this.resolver = resolver;
        this.differs = differs;
        this.viewRef = viewRef;
        this.appRef = appRef;
        this.moduleRef = moduleRef;
        this.injector = injector;
        this.navigation = navigation;
        this.filteringService = filteringService;
        this.overlayService = overlayService;
        this.summaryService = summaryService;
        this._displayDensityOptions = _displayDensityOptions;
        this.localeId = localeId;
        this.platform = platform;
        this._diTransactions = _diTransactions;
        /**
         * Gets/Sets the display time for the row adding snackbar notification.
         *
         * @remarks
         * By default it is 6000ms.
         */
        this.snackbarDisplayTime = 6000;
        /**
         * Gets/Sets whether to auto-generate the columns.
         *
         * @remarks
         * The default value is false. When set to true, it will override all columns declared through code or in markup.
         * @example
         * ```html
         * <igx-grid [data]="Data" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.autoGenerate = false;
        /**
         * Controls whether columns moving is enabled in the grid.
         *
         */
        this.moving = false;
        /**
         * Controls the copy behavior of the grid.
         */
        this.clipboardOptions = {
            /**
             * Enables/disables the copy behavior
             */
            enabled: true,
            /**
             * Include the columns headers in the clipboard output.
             */
            copyHeaders: true,
            /**
             * Apply the columns formatters (if any) on the data in the clipboard output.
             */
            copyFormatters: true,
            /**
             * The separator used for formatting the copy output. Defaults to `\t`.
             */
            separator: '\t'
        };
        /**
         * Emitted after filtering is performed.
         *
         * @remarks
         * Returns the filtering expressions tree of the column for which filtering was performed.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [height]="'305px'" [autoGenerate]="true"
         *              (filteringExpressionsTreeChange)="filteringExprTreeChange($event)"></igx-grid>
         * ```
         */
        this.filteringExpressionsTreeChange = new EventEmitter();
        /**
         * Emitted after advanced filtering is performed.
         *
         * @remarks
         * Returns the advanced filtering expressions tree.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [height]="'305px'" [autoGenerate]="true"
         *           (advancedFilteringExpressionsTreeChange)="advancedFilteringExprTreeChange($event)"></igx-grid>
         * ```
         */
        this.advancedFilteringExpressionsTreeChange = new EventEmitter();
        /**
         * Emitted when grid is scrolled horizontally/vertically.
         *
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [height]="'305px'" [autoGenerate]="true"
         *              (gridScroll)="onScroll($event)"></igx-grid>
         * ```
         */
        this.gridScroll = new EventEmitter();
        /**
         * @deprecated in version 12.1.0. Use the corresponding output exposed by the `igx-paginator` component instead
         *
         * Emitted after the current page is changed.
         *
         *
         * @example
         * ```html
         * <igx-grid (pageChange)="onPageChange($event)"></igx-grid>
         * ```
         * ```typescript
         * public onPageChange(page: number) {
         *   this.currentPage = page;
         * }
         * ```
         */
        this.pageChange = new EventEmitter();
        /**
         * @deprecated in version 12.1.0. Use the corresponding output exposed by the `igx-paginator` component instead
         *
         * Emitted when `perPage` property value of the grid is changed.
         *
         *
         * @example
         * ```html
         * <igx-grid #grid (perPageChange)="onPerPageChange($event)" [autoGenerate]="true"></igx-grid>
         * ```
         * ```typescript
         * public onPerPageChange(perPage: number) {
         *   this.perPage = perPage;
         * }
         * ```
         */
        this.perPageChange = new EventEmitter();
        /**
         * @hidden
         * @internal
         */
        this.class = '';
        /**
         * @deprecated in version 12.2.0. We suggest using `rowClasses` property instead
         *
         * Gets/Sets the styling classes applied to all even `IgxGridRowComponent`s in the grid.
         *
         *
         * @example
         * ```html
         * <igx-grid #grid [data]="Data" [evenRowCSS]="'igx-grid--my-even-class'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.evenRowCSS = 'igx-grid__tr--even';
        /**
         * @deprecated in version 12.2.0. We suggest using `rowClasses` property instead
         *
         * Gets/Sets the styling classes applied to all odd `IgxGridRowComponent`s in the grid.
         *
         *
         * @example
         * ```html
         * <igx-grid #grid [data]="Data" [evenRowCSS]="'igx-grid--my-odd-class'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.oddRowCSS = 'igx-grid__tr--odd';
        /**
         * Sets conditional style properties on the grid row element.
         * It accepts an object literal where the keys are
         * the style properties and the value is an expression to be evaluated.
         * ```typescript
         * styles = {
         *  background: 'yellow',
         *  color: (row: RowType) => row.selected : 'red': 'white'
         * }
         * ```
         * ```html
         * <igx-grid #grid [data]="Data" [rowStyles]="styles" [autoGenerate]="true"></igx-grid>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.rowStyles = null;
        /**
         * Emitted when a cell is clicked.
         *
         * @remarks
         * Returns the `IgxGridCell`.
         * @example
         * ```html
         * <igx-grid #grid (cellClick)="cellClick($event)" [data]="localData" [height]="'305px'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.cellClick = new EventEmitter();
        /**
         * Emitted when a cell is selected.
         *
         * @remarks
         *  Returns the `IgxGridCell`.
         * @example
         * ```html
         * <igx-grid #grid (selected)="onCellSelect($event)" [data]="localData" [height]="'305px'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.selected = new EventEmitter();
        /**
         *  Emitted when `IgxGridRowComponent` is selected.
         *
         * @example
         * ```html
         * <igx-grid #grid (rowSelectionChanging)="rowSelectionChanging($event)" [data]="localData" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowSelectionChanging = new EventEmitter();
        /**
         *  Emitted when `IgxColumnComponent` is selected.
         *
         * @example
         * ```html
         * <igx-grid #grid (columnSelectionChanging)="columnSelectionChanging($event)" [data]="localData" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.columnSelectionChanging = new EventEmitter();
        /**
         * Emitted before `IgxColumnComponent` is pinned.
         *
         * @remarks
         * The index at which to insert the column may be changed through the `insertAtIndex` property.
         * @example
         * ```typescript
         * public columnPinning(event) {
         *     if (event.column.field === "Name") {
         *       event.insertAtIndex = 0;
         *     }
         * }
         * ```
         */
        this.columnPin = new EventEmitter();
        /**
         * Emitted after `IgxColumnComponent` is pinned.
         *
         * @remarks
         * The index that the column is inserted at may be changed through the `insertAtIndex` property.
         * @example
         * ```typescript
         * public columnPinning(event) {
         *     if (event.column.field === "Name") {
         *       event.insertAtIndex = 0;
         *     }
         * }
         * ```
         */
        this.columnPinned = new EventEmitter();
        /**
         * Emitted when cell enters edit mode.
         *
         * @remarks
         * This event is cancelable.
         * @example
         * ```html
         * <igx-grid #grid3 (cellEditEnter)="editStart($event)" [data]="data" [primaryKey]="'ProductID'">
         * </igx-grid>
         * ```
         */
        this.cellEditEnter = new EventEmitter();
        /**
         * Emitted when cell exits edit mode.
         *
         * @example
         * ```html
         * <igx-grid #grid3 (cellEditExit)="editExit($event)" [data]="data" [primaryKey]="'ProductID'">
         * </igx-grid>
         * ```
         */
        this.cellEditExit = new EventEmitter();
        /**
         * Emitted when cell has been edited.
         *
         * @remarks
         * Event is fired after editing is completed, when the cell is exiting edit mode.
         * This event is cancelable.
         * @example
         * ```html
         * <igx-grid #grid3 (cellEdit)="editDone($event)" [data]="data" [primaryKey]="'ProductID'">
         * </igx-grid>
         * ```
         */
        this.cellEdit = new EventEmitter();
        /**
         * Emitted after cell has been edited and editing has been committed.
         *
         * @example
         * ```html
         * <igx-grid #grid3 (cellEditDone)="editDone($event)" [data]="data" [primaryKey]="'ProductID'">
         * </igx-grid>
         * ```
         */
        this.cellEditDone = new EventEmitter();
        /**
         * Emitted when a row enters edit mode.
         *
         * @remarks
         * Emitted when [rowEditable]="true".
         * This event is cancelable.
         * @example
         * ```html
         * <igx-grid #grid3 (rowEditEnter)="editStart($event)" [primaryKey]="'ProductID'" [rowEditable]="true">
         * </igx-grid>
         * ```
         */
        this.rowEditEnter = new EventEmitter();
        /**
         * Emitted when exiting edit mode for a row.
         *
         * @remarks
         * Emitted when [rowEditable]="true" & `endEdit(true)` is called.
         * Emitted when changing rows during edit mode, selecting an un-editable cell in the edited row,
         * performing paging operation, column resizing, pinning, moving or hitting `Done`
         * button inside of the rowEditingOverlay, or hitting the `Enter` key while editing a cell.
         * This event is cancelable.
         * @example
         * ```html
         * <igx-grid #grid3 (rowEdit)="editDone($event)" [data]="data" [primaryKey]="'ProductID'" [rowEditable]="true">
         * </igx-grid>
         * ```
         */
        this.rowEdit = new EventEmitter();
        /**
         * Emitted after exiting edit mode for a row and editing has been committed.
         *
         * @remarks
         * Emitted when [rowEditable]="true" & `endEdit(true)` is called.
         * Emitted when changing rows during edit mode, selecting an un-editable cell in the edited row,
         * performing paging operation, column resizing, pinning, moving or hitting `Done`
         * button inside of the rowEditingOverlay, or hitting the `Enter` key while editing a cell.
         * @example
         * ```html
         * <igx-grid #grid3 (rowEditDone)="editDone($event)" [data]="data" [primaryKey]="'ProductID'" [rowEditable]="true">
         * </igx-grid>
         * ```
         */
        this.rowEditDone = new EventEmitter();
        /**
         * Emitted when row editing is canceled.
         *
         * @remarks
         * Emits when [rowEditable]="true" & `endEdit(false)` is called.
         * Emitted when changing hitting `Esc` key during cell editing and when click on the `Cancel` button
         * in the row editing overlay.
         * @example
         * ```html
         * <igx-grid #grid3 (rowEditExit)="editExit($event)" [data]="data" [primaryKey]="'ProductID'" [rowEditable]="true">
         * </igx-grid>
         * ```
         */
        this.rowEditExit = new EventEmitter();
        /**
         * Emitted when a column is initialized.
         *
         * @remarks
         * Returns the column object.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (columnInit)="initColumns($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.columnInit = new EventEmitter();
        /**
         * Emitted before sorting expressions are applied.
         *
         * @remarks
         * Returns an `ISortingEventArgs` object. `sortingExpressions` key holds the sorting expressions.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [autoGenerate]="true" (sorting)="sorting($event)"></igx-grid>
         * ```
         */
        this.sorting = new EventEmitter();
        /**
         * Emitted after sorting is completed.
         *
         * @remarks
         * Returns the sorting expression.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [autoGenerate]="true" (sortingDone)="sortingDone($event)"></igx-grid>
         * ```
         */
        this.sortingDone = new EventEmitter();
        /**
         * Emitted before filtering expressions are applied.
         *
         * @remarks
         * Returns an `IFilteringEventArgs` object. `filteringExpressions` key holds the filtering expressions for the column.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [height]="'305px'" [autoGenerate]="true" (filtering)="filtering($event)"></igx-grid>
         * ```
         */
        this.filtering = new EventEmitter();
        /**
         * Emitted after filtering is performed through the UI.
         *
         * @remarks
         * Returns the filtering expressions tree of the column for which filtering was performed.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [height]="'305px'" [autoGenerate]="true" (filteringDone)="filteringDone($event)"></igx-grid>
         * ```
         */
        this.filteringDone = new EventEmitter();
        /**
         * @deprecated in version 12.1.0. Use the corresponding output exposed by the `igx-paginator` component instead
         *
         * Emitted after paging is performed.
         *
         *
         * @remarks
         * Returns an object consisting of the previous and next pages.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [height]="'305px'" [autoGenerate]="true" (pagingDone)="pagingDone($event)"></igx-grid>
         * ```
         */
        this.pagingDone = new EventEmitter();
        /**
         * Emitted when a row is added.
         *
         * @remarks
         * Returns the data for the new `IgxGridRowComponent` object.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (rowAdded)="rowAdded($event)" [height]="'305px'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowAdded = new EventEmitter();
        /**
         * Emitted when a row is deleted.
         *
         * @remarks
         * Returns an `IRowDataEventArgs` object.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (rowDeleted)="rowDeleted($event)" [height]="'305px'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowDeleted = new EventEmitter();
        /**
         * Emmited when deleting a row.
         *
         * @remarks
         * This event is cancelable.
         * Returns an `IGridEditEventArgs` object.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (rowDelete)="rowDelete($event)" [height]="'305px'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowDelete = new EventEmitter();
        /**
         * Emmited just before the newly added row is commited.
         *
         * @remarks
         * This event is cancelable.
         * Returns an `IGridEditEventArgs` object.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (rowAdd)="rowAdd($event)" [height]="'305px'" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowAdd = new EventEmitter();
        /**
         * Emitted after column is resized.
         *
         * @remarks
         * Returns the `IgxColumnComponent` object's old and new width.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (columnResized)="resizing($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.columnResized = new EventEmitter();
        /**
         * Emitted when a cell is right clicked.
         *
         * @remarks
         * Returns the `IgxGridCell` object.
         * ```html
         * <igx-grid #grid [data]="localData" (contextMenu)="contextMenu($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.contextMenu = new EventEmitter();
        /**
         * Emitted when a cell is double clicked.
         *
         * @remarks
         * Returns the `IgxGridCell` object.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (doubleClick)="dblClick($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.doubleClick = new EventEmitter();
        /**
         * Emitted before column visibility is changed.
         *
         * @remarks
         * Args: { column: any, newValue: boolean }
         * @example
         * ```html
         * <igx-grid (columnVisibilityChanging)="visibilityChanging($event)"></igx-grid>
         * ```
         */
        this.columnVisibilityChanging = new EventEmitter();
        /**
         * Emitted after column visibility is changed.
         *
         * @remarks
         * Args: { column: IgxColumnComponent, newValue: boolean }
         * @example
         * ```html
         * <igx-grid (columnVisibilityChanged)="visibilityChanged($event)"></igx-grid>
         * ```
         */
        this.columnVisibilityChanged = new EventEmitter();
        /**
         * Emitted when column moving starts.
         *
         * @remarks
         * Returns the moved `IgxColumnComponent` object.
         * @example
         * ```html
         * <igx-grid (columnMovingStart)="movingStart($event)"></igx-grid>
         * ```
         */
        this.columnMovingStart = new EventEmitter();
        /**
         * Emitted during the column moving operation.
         *
         * @remarks
         * Returns the source and target `IgxColumnComponent` objects. This event is cancelable.
         * @example
         * ```html
         * <igx-grid (columnMoving)="moving($event)"></igx-grid>
         * ```
         */
        this.columnMoving = new EventEmitter();
        /**
         * Emitted when column moving ends.
         *
         * @remarks
         * Returns the source and target `IgxColumnComponent` objects.
         * @example
         * ```html
         * <igx-grid (columnMovingEnd)="movingEnds($event)"></igx-grid>
         * ```
         */
        this.columnMovingEnd = new EventEmitter();
        /**
         * Emitted when keydown is triggered over element inside grid's body.
         *
         * @remarks
         * This event is fired only if the key combination is supported in the grid.
         * Return the target type, target object and the original event. This event is cancelable.
         * @example
         * ```html
         *  <igx-grid (gridKeydown)="customKeydown($event)"></igx-grid>
         * ```
         */
        this.gridKeydown = new EventEmitter();
        /**
         * Emitted when start dragging a row.
         *
         * @remarks
         * Return the dragged row.
         */
        this.rowDragStart = new EventEmitter();
        /**
         * Emitted when dropping a row.
         *
         * @remarks
         * Return the dropped row.
         */
        this.rowDragEnd = new EventEmitter();
        /**
         * Emitted when a copy operation is executed.
         *
         * @remarks
         * Fired only if copy behavior is enabled through the [`clipboardOptions`]{@link IgxGridBaseDirective#clipboardOptions}.
         */
        this.gridCopy = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.expansionStatesChange = new EventEmitter();
        /**
         * Emitted when the expanded state of a row gets changed.
         *
         * @example
         * ```html
         * <igx-grid [data]="employeeData" (rowToggle)="rowToggle($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowToggle = new EventEmitter();
        /**
         * Emitted when the pinned state of a row is changed.
         *
         * @example
         * ```html
         * <igx-grid [data]="employeeData" (rowPinning)="rowPin($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowPinning = new EventEmitter();
        /**
         * Emitted when the pinned state of a row is changed.
         *
         * @example
         * ```html
         * <igx-grid [data]="employeeData" (rowPinned)="rowPin($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.rowPinned = new EventEmitter();
        /**
         * Emmited when the active node is changed.
         *
         * @example
         * ```
         * <igx-grid [data]="data" [autoGenerate]="true" (activeNodeChange)="activeNodeChange($event)"></igx-grid>
         * ```
         */
        this.activeNodeChange = new EventEmitter();
        /**
         * Emitted before sorting is performed.
         *
         * @remarks
         * Returns the sorting expressions.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" [autoGenerate]="true" (sortingExpressionsChange)="sortingExprChange($event)"></igx-grid>
         * ```
         */
        this.sortingExpressionsChange = new EventEmitter();
        /**
         * Emitted when an export process is initiated by the user.
         *
         * @example
         * ```typescript
         * toolbarExporting(event: IGridToolbarExportEventArgs){
         *     const toolbarExporting = event;
         * }
         * ```
         */
        this.toolbarExporting = new EventEmitter();
        /* End of toolbar related definitions */
        /**
         * Emitted when making a range selection.
         *
         * @remarks
         * Range selection can be made either through drag selection or through keyboard selection.
         */
        this.rangeSelected = new EventEmitter();
        /** Emitted after the ngAfterViewInit hook. At this point the grid exists in the DOM */
        this.rendered = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.localeChange = new EventEmitter();
        /**
         * Emitted before the grid's data view is changed because of a data operation, rebinding, etc.
         *
         * @example
         * ```typescript
         *  <igx-grid #grid [data]="localData" [autoGenerate]="true" (dataChanging)='handleDataChangingEvent()'></igx-grid>
         * ```
         */
        this.dataChanging = new EventEmitter();
        /**
         * Emitted after the grid's data view is changed because of a data operation, rebinding, etc.
         *
         * @example
         * ```typescript
         *  <igx-grid #grid [data]="localData" [autoGenerate]="true" (dataChanged)='handleDataChangedEvent()'></igx-grid>
         * ```
         */
        this.dataChanged = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.columnList = new QueryList();
        /**
         * @hidden @internal
         */
        this.tmpOutlets = new QueryList();
        /**
         * The custom template, if any, that should be used when rendering a row expand indicator.
         */
        this.rowExpandedIndicatorTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a row collapse indicator.
         */
        this.rowCollapsedIndicatorTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a header expand indicator.
         */
        this.headerExpandIndicatorTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a header collapse indicator.
         */
        this.headerCollapseIndicatorTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a row expand indicator.
         */
        this.excelStyleHeaderIconTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a header sorting indicator when columns are sorted in asc order.
         */
        this.sortAscendingHeaderIconTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a header sorting indicator when columns are sorted in desc order.
         */
        this.sortDescendingHeaderIconTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering a header sorting indicator when columns are not sorted.
         */
        this.sortHeaderIconTemplate = null;
        /**
         * @hidden @internal
         */
        this.tabindex = 0;
        /**
         * @hidden @internal
         */
        this.hostRole = 'grid';
        /**
         * @hidden
         * @internal
         */
        this.rowDragging = false;
        /**
         * Gets the row ID that is being dragged.
         *
         * @remarks
         * The row ID is either the primaryKey value or the data record instance.
         */
        this.dragRowID = null;
        /**
         * @hidden @internal
         */
        this.snackbarActionText = this.resourceStrings.igx_grid_snackbar_addrow_actiontext;
        /**
         * @hidden @internal
         */
        this.calcHeight = 0;
        /**
         * @hidden @internal
         */
        this.disableTransitions = false;
        /**
         * @hidden @internal
         */
        this.lastSearchInfo = {
            searchText: '',
            caseSensitive: false,
            exactMatch: false,
            activeMatchIndex: 0,
            matchInfoCache: []
        };
        /**
         * @hidden @internal
         */
        this.columnWidthSetByUser = false;
        /**
         * @hidden @internal
         */
        this.rendered$ = this.rendered.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));
        /** @hidden @internal */
        this.resizeNotify = new Subject();
        /** @hidden @internal */
        this.rowAddedNotifier = new Subject();
        /** @hidden @internal */
        this.rowDeletedNotifier = new Subject();
        /** @hidden @internal */
        this.pipeTriggerNotifier = new Subject();
        /**
         * @hidden @internal
         */
        this._destroyed = false;
        /**
         * @hidden @internal
         */
        this._totalRecords = -1;
        /**
         * @hidden @internal
         */
        this.columnsWithNoSetWidths = null;
        /**
         * @hidden @internal
         */
        this.pipeTrigger = 0;
        /**
         * @hidden @internal
         */
        this.filteringPipeTrigger = 0;
        /**
         * @hidden @internal
         */
        this.summaryPipeTrigger = 0;
        /**
        * @hidden @internal
        */
        this.EMPTY_DATA = [];
        this.isPivot = false;
        /**
         * @hidden
         */
        this.destroy$ = new Subject();
        /**
         * @hidden
         */
        this._perPage = DEFAULT_ITEMS_PER_PAGE;
        /**
         * @hidden
         */
        this._paging = false;
        /**
         * @hidden
         */
        this._pagingMode = GridPagingMode.Local;
        /**
         * @hidden
         */
        this._hideRowSelectors = false;
        /**
         * @hidden
         */
        this._rowDrag = false;
        /**
         * @hidden
         */
        this._columns = [];
        /**
         * @hidden
         */
        this._pinnedColumns = [];
        /**
         * @hidden
         */
        this._unpinnedColumns = [];
        /**
         * @hidden
         */
        this._filteringExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And);
        /**
         * @hidden
         */
        this._sortingExpressions = [];
        /**
         * @hidden
         */
        this._maxLevelHeaderDepth = null;
        /**
         * @hidden
         */
        this._columnHiding = false;
        /**
         * @hidden
         */
        this._columnPinning = false;
        this._pinnedRecordIDs = [];
        this._allowFiltering = false;
        this._allowAdvancedFiltering = false;
        this._filterMode = FilterMode.quickFilter;
        this._defaultTargetRecordNumber = 10;
        this._expansionStates = new Map();
        this._defaultExpandState = false;
        this._headerFeaturesWidth = NaN;
        this._init = true;
        this._cdrRequestRepaint = false;
        this._batchEditing = false;
        this._filterStrategy = new FilteringStrategy();
        this._autoGeneratedCols = [];
        this._dataView = [];
        this._rowEditable = false;
        this._filteredSortedData = null;
        this._cdrRequests = false;
        this._emptyGridMessage = null;
        this._emptyFilteredGridMessage = null;
        this._isLoading = false;
        this.overlayIDs = [];
        this._pinning = { columns: ColumnPinningPosition.Start };
        this._advancedFilteringPositionSettings = {
            verticalDirection: VerticalAlignment.Middle,
            horizontalDirection: HorizontalAlignment.Center,
            horizontalStartPoint: HorizontalAlignment.Center,
            verticalStartPoint: VerticalAlignment.Middle
        };
        this._advancedFilteringOverlaySettings = {
            closeOnOutsideClick: false,
            modal: false,
            positionStrategy: new ConnectedPositioningStrategy(this._advancedFilteringPositionSettings),
        };
        this._height = '100%';
        this._width = '100%';
        this._horizontalForOfs = [];
        this._multiRowLayoutRowSize = 1;
        // Caches
        this._totalWidth = NaN;
        this._pinnedVisible = [];
        this._unpinnedVisible = [];
        this._pinnedWidth = NaN;
        this._unpinnedWidth = NaN;
        this._visibleColumns = [];
        this._columnGroups = false;
        this._summaryPosition = GridSummaryPosition.bottom;
        this._summaryCalculationMode = GridSummaryCalculationMode.rootAndChildLevels;
        this._showSummaryOnCollapse = false;
        this._summaryRowHeight = 0;
        this._cellSelectionMode = GridSelectionMode.multiple;
        this._rowSelectionMode = GridSelectionMode.none;
        this._selectRowOnClick = true;
        this._columnSelectionMode = GridSelectionMode.none;
        this.rowEditPositioningStrategy = new RowEditPositionStrategy({
            horizontalDirection: HorizontalAlignment.Right,
            verticalDirection: VerticalAlignment.Bottom,
            horizontalStartPoint: HorizontalAlignment.Left,
            verticalStartPoint: VerticalAlignment.Bottom,
            closeAnimation: null
        });
        this.rowEditSettings = {
            scrollStrategy: new AbsoluteScrollStrategy(),
            modal: false,
            closeOnOutsideClick: false,
            outlet: this.rowOutletDirective,
            positionStrategy: this.rowEditPositioningStrategy
        };
        this.transactionChange$ = new Subject();
        this._rendered = false;
        this.DRAG_SCROLL_DELTA = 10;
        this._dataCloneStrategy = new DefaultDataCloneStrategy();
        /**
         * @hidden @internal
         */
        this.preventContainerScroll = (evt) => {
            if (evt.target.scrollTop !== 0) {
                this.verticalScrollContainer.addScrollTop(evt.target.scrollTop);
                evt.target.scrollTop = 0;
            }
            if (evt.target.scrollLeft !== 0) {
                this.headerContainer.scrollPosition += evt.target.scrollLeft;
                evt.target.scrollLeft = 0;
            }
        };
        this.locale = this.locale || this.localeId;
        this._transactions = this.transactionFactory.create("None" /* None */);
        this._transactions.cloneStrategy = this.dataCloneStrategy;
        this.cdr.detach();
    }
    /**
     * Get/Set IgxSummaryRow height
     */
    set summaryRowHeight(value) {
        this._summaryRowHeight = value | 0;
        this.summaryService.summaryHeight = value;
        if (!this._init) {
            this.reflow();
        }
    }
    get summaryRowHeight() {
        if (this.hasSummarizedColumns && this.rootSummariesEnabled) {
            return this._summaryRowHeight || this.summaryService.calcMaxSummaryHeight();
        }
        return 0;
    }
    /**
     * Gets/Sets the data clone strategy of the grid when in edit mode.
     *
     * @example
     * ```html
     *  <igx-grid #grid [data]="localData" [dataCloneStrategy]="customCloneStrategy"></igx-grid>
     * ```
     */
    get dataCloneStrategy() {
        return this._dataCloneStrategy;
    }
    set dataCloneStrategy(strategy) {
        if (strategy) {
            this._dataCloneStrategy = strategy;
            this._transactions.cloneStrategy = strategy;
        }
    }
    /** @hidden @internal */
    get excelStyleFilteringComponent() {
        return this.excelStyleFilteringComponents?.first;
    }
    get headerGroups() {
        return this.theadRow.groups;
    }
    get headerContainer() {
        return this.theadRow?.headerForOf;
    }
    get headerSelectorContainer() {
        return this.theadRow?.headerSelectorContainer;
    }
    get headerDragContainer() {
        return this.theadRow?.headerDragContainer;
    }
    get headerGroupContainer() {
        return this.theadRow?.headerGroupContainer;
    }
    get filteringRow() {
        return this.theadRow?.filterRow;
    }
    /**
     * Gets/Sets the resource strings.
     *
     * @remarks
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    get resourceStrings() {
        if (!this._resourceStrings) {
            this._resourceStrings = CurrentResourceStrings.GridResStrings;
        }
        return this._resourceStrings;
    }
    /**
     * Gets/Sets the filtering logic of the `IgxGridComponent`.
     *
     * @remarks
     * The default is AND.
     * @example
     * ```html
     * <igx-grid [data]="Data" [autoGenerate]="true" [filteringLogic]="filtering"></igx-grid>
     * ```
     */
    get filteringLogic() {
        return this._filteringExpressionsTree.operator;
    }
    set filteringLogic(value) {
        this._filteringExpressionsTree.operator = value;
    }
    /**
     * Gets/Sets the filtering state.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true" [(filteringExpressionsTree)]="model.filteringExpressions"></igx-grid>
     * ```
     * @remarks
     * Supports two-way binding.
     */
    get filteringExpressionsTree() {
        return this._filteringExpressionsTree;
    }
    set filteringExpressionsTree(value) {
        if (value && value instanceof FilteringExpressionsTree) {
            const val = value;
            for (let index = 0; index < val.filteringOperands.length; index++) {
                if (!(val.filteringOperands[index] instanceof FilteringExpressionsTree)) {
                    const newExpressionsTree = new FilteringExpressionsTree(FilteringLogic.And, val.filteringOperands[index].fieldName);
                    newExpressionsTree.filteringOperands.push(val.filteringOperands[index]);
                    val.filteringOperands[index] = newExpressionsTree;
                }
            }
            value.type = FilteringExpressionsTreeType.Regular;
            this._filteringExpressionsTree = value;
            this.filteringPipeTrigger++;
            this.filteringExpressionsTreeChange.emit(this._filteringExpressionsTree);
            if (this.filteringService.isFilteringExpressionsTreeEmpty(this._filteringExpressionsTree) &&
                this.filteringService.isFilteringExpressionsTreeEmpty(this._advancedFilteringExpressionsTree)) {
                this.filteredData = null;
            }
            this.filteringService.refreshExpressions();
            this.selectionService.clearHeaderCBState();
            this.summaryService.clearSummaryCache();
            this.notifyChanges();
        }
    }
    /**
     * Gets/Sets the advanced filtering state.
     *
     * @example
     * ```typescript
     * let advancedFilteringExpressionsTree = this.grid.advancedFilteringExpressionsTree;
     * this.grid.advancedFilteringExpressionsTree = logic;
     * ```
     */
    get advancedFilteringExpressionsTree() {
        return this._advancedFilteringExpressionsTree;
    }
    set advancedFilteringExpressionsTree(value) {
        if (value && value instanceof FilteringExpressionsTree) {
            value.type = FilteringExpressionsTreeType.Advanced;
            this._advancedFilteringExpressionsTree = value;
            this.filteringPipeTrigger++;
        }
        else {
            this._advancedFilteringExpressionsTree = null;
        }
        this.advancedFilteringExpressionsTreeChange.emit(this._advancedFilteringExpressionsTree);
        if (this.filteringService.isFilteringExpressionsTreeEmpty(this._filteringExpressionsTree) &&
            this.filteringService.isFilteringExpressionsTreeEmpty(this._advancedFilteringExpressionsTree)) {
            this.filteredData = null;
        }
        this.selectionService.clearHeaderCBState();
        this.summaryService.clearSummaryCache();
        this.notifyChanges();
        // Wait for the change detection to update filtered data through the pipes and then emit the event.
        requestAnimationFrame(() => this.filteringDone.emit(this._advancedFilteringExpressionsTree));
    }
    /**
     * Gets/Sets the locale.
     *
     * @remarks
     * If not set, returns browser's language.
     */
    get locale() {
        return this._locale;
    }
    set locale(value) {
        if (value !== this._locale) {
            this._locale = value;
            this._currencyPositionLeft = undefined;
            this.summaryService.clearSummaryCache();
            this.pipeTrigger++;
            this.notifyChanges();
            this.localeChange.next();
        }
    }
    get pagingMode() {
        return this._pagingMode;
    }
    set pagingMode(val) {
        this._pagingMode = val;
        this.pipeTrigger++;
        this.notifyChanges(true);
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding method exposed by the `igx-paginator`
     *
     * Gets/Sets whether the paging feature is enabled.
     *
     *
     * @remarks
     * The default state is disabled (false).
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true">
     *  <igx-paginator></igx-paginator>
     * </igx-grid>
     * ```
     */
    get paging() {
        return this._paging;
    }
    set paging(value) {
        this._paging = value;
        this.pipeTrigger++;
    }
    /**
     * @deprecated in version 12.1.0. Use `page` property form `paginator` component instead
     *
     * Gets/Sets the current page index.
     *
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true">
     *  <igx-paginator [(page)]="model.page"></igx-paginator>
     * </igx-grid>
     * ```
     * @remarks
     * Supports two-way binding.
     */
    get page() {
        return this.paginator?.page || 0;
    }
    set page(val) {
        if (this.paginator) {
            this.paginator.page = val;
        }
    }
    /**
     * @deprecated in version 12.1.0. Use `perPage` property from `paginator` component instead
     *
     * Gets/Sets the number of visible items per page.
     *
     *
     * @remarks
     * The default is 15.
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true">
     *  <igx-paginator [(perPage)]="model.perPage"></igx-paginator>
     * </igx-grid>
     * ```
     */
    get perPage() {
        return this.paginator?.perPage || DEFAULT_ITEMS_PER_PAGE;
    }
    set perPage(val) {
        this._perPage = val;
        if (this.paginator) {
            this.paginator.perPage = val;
        }
    }
    /**
     * Gets/Sets if the row selectors are hidden.
     *
     * @remarks
     *  By default row selectors are shown
     */
    get hideRowSelectors() {
        return this._hideRowSelectors;
    }
    set hideRowSelectors(value) {
        this._hideRowSelectors = value;
        this.notifyChanges(true);
    }
    /**
     * Gets/Sets whether rows can be moved.
     *
     * @example
     * ```html
     * <igx-grid #grid [rowDraggable]="true"></igx-grid>
     * ```
     */
    get rowDraggable() {
        return this._rowDrag && this.hasVisibleColumns;
    }
    set rowDraggable(val) {
        this._rowDrag = val;
        this.notifyChanges(true);
    }
    /**
     * Gets/Sets whether the rows are editable.
     *
     * @remarks
     * By default it is set to false.
     * @example
     * ```html
     * <igx-grid #grid [rowEditable]="true" [primaryKey]="'ProductID'" ></igx-grid>
     * ```
     */
    get rowEditable() {
        return this._rowEditable;
    }
    set rowEditable(val) {
        if (!this._init) {
            this.refreshGridState();
        }
        this._rowEditable = val;
        this.notifyChanges();
    }
    /**
     * Gets/Sets the height.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [height]="'305px'" [autoGenerate]="true"></igx-grid>
     * ```
     */
    get height() {
        return this._height;
    }
    set height(value) {
        if (this._height !== value) {
            this._height = value;
            this.nativeElement.style.height = value;
            this.notifyChanges(true);
        }
    }
    /**
     * @hidden @internal
     */
    get hostWidth() {
        return this._width || this._hostWidth;
    }
    /**
     * Gets/Sets the width of the grid.
     *
     * @example
     * ```typescript
     * let gridWidth = this.grid.width;
     * ```
     */
    get width() {
        return this._width;
    }
    set width(value) {
        if (this._width !== value) {
            this._width = value;
            this.nativeElement.style.width = value;
            this.notifyChanges(true);
        }
    }
    /**
     * Gets the width of the header.
     *
     * @example
     * ```html
     * let gridHeaderWidth = this.grid.headerWidth;
     * ```
     */
    get headerWidth() {
        return parseInt(this.width, 10) - 17;
    }
    /**
     * Gets/Sets the row height.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [rowHeight]="100" [autoGenerate]="true"></igx-grid>
     * ```
     */
    get rowHeight() {
        return this._rowHeight ? this._rowHeight : this.defaultRowHeight;
    }
    set rowHeight(value) {
        this._rowHeight = parseInt(value, 10);
    }
    /**
     * Gets/Sets the default width of the columns.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [columnWidth]="100" [autoGenerate]="true"></igx-grid>
     * ```
     */
    get columnWidth() {
        return this._columnWidth;
    }
    set columnWidth(value) {
        this._columnWidth = value;
        this.columnWidthSetByUser = true;
        this.notifyChanges(true);
    }
    /**
     * Get/Sets the message displayed when there are no records.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [emptyGridMessage]="'The grid is empty'" [autoGenerate]="true"></igx-grid>
     * ```
     */
    set emptyGridMessage(value) {
        this._emptyGridMessage = value;
    }
    get emptyGridMessage() {
        return this._emptyGridMessage || this.resourceStrings.igx_grid_emptyGrid_message;
    }
    /**
     * Gets/Sets whether the grid is going to show a loading indicator.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [isLoading]="true" [autoGenerate]="true"></igx-grid>
     * ```
     */
    set isLoading(value) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            if (!!this.data) {
                this.evaluateLoadingState();
            }
        }
        Promise.resolve().then(() => {
            // wait for the current detection cycle to end before triggering a new one.
            this.notifyChanges();
        });
    }
    get isLoading() {
        return this._isLoading;
    }
    /**
     * Gets/Sets the message displayed when there are no records and the grid is filtered.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [emptyGridMessage]="'The grid is empty'" [autoGenerate]="true"></igx-grid>
     * ```
     */
    set emptyFilteredGridMessage(value) {
        this._emptyFilteredGridMessage = value;
    }
    get emptyFilteredGridMessage() {
        return this._emptyFilteredGridMessage || this.resourceStrings.igx_grid_emptyFilteredGrid_message;
    }
    /**
     * Gets/Sets the initial pinning configuration.
     *
     * @remarks
     * Allows to apply pinning the columns to the start or the end.
     * Note that pinning to both sides at a time is not allowed.
     * @example
     * ```html
     * <igx-grid [pinning]="pinningConfig"></igx-grid>
     * ```
     */
    get pinning() {
        return this._pinning;
    }
    set pinning(value) {
        if (value !== this._pinning) {
            this.resetCaches();
        }
        this._pinning = value;
    }
    /**
     * Gets/Sets if the filtering is enabled.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [allowFiltering]="true" [height]="'305px'" [autoGenerate]="true"></igx-grid>
     * ```
     */
    get allowFiltering() {
        return this._allowFiltering;
    }
    set allowFiltering(value) {
        if (this._allowFiltering !== value) {
            this._allowFiltering = value;
            this.filteringService.registerSVGIcons();
            if (!this._init) {
                this.calcGridHeadRow();
            }
            this.filteringService.isFilterRowVisible = false;
            this.filteringService.filteredColumn = null;
            this.notifyChanges(true);
        }
    }
    /**
     * Gets/Sets a value indicating whether the advanced filtering is enabled.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [allowAdvancedFiltering]="true" [autoGenerate]="true"></igx-grid>
     * ```
     */
    get allowAdvancedFiltering() {
        return this._allowAdvancedFiltering;
    }
    set allowAdvancedFiltering(value) {
        if (this._allowAdvancedFiltering !== value) {
            this._allowAdvancedFiltering = value;
            this.filteringService.registerSVGIcons();
            if (!this._init) {
                this.notifyChanges(true);
            }
        }
    }
    /**
     * Gets/Sets the filter mode.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [filterMode]="'quickFilter'" [height]="'305px'" [autoGenerate]="true"></igx-grid>
     * ```
     * @remarks
     * By default it's set to FilterMode.quickFilter.
     */
    get filterMode() {
        return this._filterMode;
    }
    set filterMode(value) {
        this._filterMode = value;
        if (this.filteringService.isFilterRowVisible) {
            this.filteringRow.close();
        }
        this.notifyChanges(true);
    }
    /**
     * Gets/Sets the summary position.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" summaryPosition="top" [autoGenerate]="true"></igx-grid>
     * ```
     * @remarks
     * By default it is bottom.
     */
    get summaryPosition() {
        return this._summaryPosition;
    }
    set summaryPosition(value) {
        this._summaryPosition = value;
        this.notifyChanges();
    }
    /**
     * Gets/Sets the summary calculation mode.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" summaryCalculationMode="rootLevelOnly" [autoGenerate]="true"></igx-grid>
     * ```
     * @remarks
     * By default it is rootAndChildLevels which means the summaries are calculated for the root level and each child level.
     */
    get summaryCalculationMode() {
        return this._summaryCalculationMode;
    }
    set summaryCalculationMode(value) {
        this._summaryCalculationMode = value;
        if (!this._init) {
            this.crudService.endEdit(false);
            this.summaryService.resetSummaryHeight();
            this.notifyChanges(true);
        }
    }
    /**
     * Controls whether the summary row is visible when groupBy/parent row is collapsed.
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [showSummaryOnCollapse]="true" [autoGenerate]="true"></igx-grid>
     * ```
     * @remarks
     * By default showSummaryOnCollapse is set to 'false' which means that the summary row is not visible
     * when the groupBy/parent row is collapsed.
     */
    get showSummaryOnCollapse() {
        return this._showSummaryOnCollapse;
    }
    set showSummaryOnCollapse(value) {
        this._showSummaryOnCollapse = value;
        this.notifyChanges();
    }
    /**
     * Gets/Sets the filtering strategy of the grid.
     *
     * @example
     * ```html
     *  <igx-grid #grid [data]="localData" [filterStrategy]="filterStrategy"></igx-grid>
     * ```
     */
    get filterStrategy() {
        return this._filterStrategy;
    }
    set filterStrategy(classRef) {
        this._filterStrategy = classRef;
    }
    /**
     * Gets/Sets the sorting strategy of the grid.
     *
     * @example
     * ```html
     *  <igx-grid #grid [data]="localData" [sortStrategy]="sortStrategy"></igx-grid>
     * ```
     */
    get sortStrategy() {
        return this._sortingStrategy;
    }
    set sortStrategy(value) {
        this._sortingStrategy = value;
    }
    /**
     * Gets/Sets the current selection state.
     *
     * @remarks
     * Represents the selected rows' IDs (primary key or rowData)
     * @example
     * ```html
     * <igx-grid [data]="localData" primaryKey="ID" rowSelection="multiple" [selectedRows]="[0, 1, 2]"><igx-grid>
     * ```
     */
    set selectedRows(rowIDs) {
        this.selectRows(rowIDs || [], true);
    }
    get selectedRows() {
        return this.selectionService.getSelectedRows();
    }
    /**
     * A list of all `IgxGridHeaderGroupComponent`.
     *
     * @example
     * ```typescript
     * const headerGroupsList = this.grid.headerGroupsList;
     * ```
     */
    get headerGroupsList() {
        return this.theadRow.groups;
    }
    /**
     * A list of all `IgxGridHeaderComponent`.
     *
     * @example
     * ```typescript
     * const headers = this.grid.headerCellList;
     * ```
     */
    get headerCellList() {
        return this.headerGroupsList.map(headerGroup => headerGroup.header).filter(header => header);
    }
    /**
     * A list of all `IgxGridFilteringCellComponent`.
     *
     * @example
     * ```typescript
     * const filterCells = this.grid.filterCellList;
     * ```
     */
    get filterCellList() {
        return this.headerGroupsList.map(group => group.filter).filter(cell => cell);
    }
    /**
     * @hidden @internal
     */
    get summariesRowList() {
        const res = new QueryList();
        if (!this._summaryRowList) {
            return res;
        }
        const sumList = this._summaryRowList.filter((item) => item.element.nativeElement.parentElement !== null);
        res.reset(sumList);
        return res;
    }
    /**
     * A list of `IgxGridRowComponent`.
     *
     * @example
     * ```typescript
     * const rowList = this.grid.rowList;
     * ```
     */
    get rowList() {
        const res = new QueryList();
        if (!this._rowList) {
            return res;
        }
        const rList = this._rowList
            .filter((item) => item.element.nativeElement.parentElement !== null)
            .sort((a, b) => a.index - b.index);
        res.reset(rList);
        return res;
    }
    /**
     * A list of currently rendered `IgxGridRowComponent`'s.
     *
     * @example
     * ```typescript
     * const dataList = this.grid.dataRowList;
     * ```
     */
    get dataRowList() {
        const res = new QueryList();
        if (!this._dataRowList) {
            return res;
        }
        const rList = this._dataRowList.filter(item => item.element.nativeElement.parentElement !== null).sort((a, b) => a.index - b.index);
        res.reset(rList);
        return res;
    }
    /**
     * @hidden
     * @internal
     */
    get headSelectorTemplate() {
        if (this.headSelectorsTemplates && this.headSelectorsTemplates.first) {
            return this.headSelectorsTemplates.first.templateRef;
        }
        return null;
    }
    /**
     * @hidden
     * @internal
     */
    get isPinningToStart() {
        return this.pinning.columns !== ColumnPinningPosition.End;
    }
    /**
     * @hidden
     * @internal
     */
    get isRowPinningToTop() {
        return this.pinning.rows !== RowPinningPosition.Bottom;
    }
    /**
     * @hidden
     * @internal
     */
    get rowSelectorTemplate() {
        if (this.rowSelectorsTemplates && this.rowSelectorsTemplates.first) {
            return this.rowSelectorsTemplates.first.templateRef;
        }
        return null;
    }
    /**
     * @hidden @internal
     */
    get rowOutletDirective() {
        return this.rowEditingOutletDirective;
    }
    /**
     * @hidden @internal
     */
    get parentRowOutletDirective() {
        return this.outlet;
    }
    /**
     * @hidden @internal
     */
    get rowEditCustom() {
        if (this.rowEditCustomDirectives && this.rowEditCustomDirectives.first) {
            return this.rowEditCustomDirectives.first;
        }
        return null;
    }
    /**
     * @hidden @internal
     */
    get rowEditText() {
        if (this.rowEditTextDirectives && this.rowEditTextDirectives.first) {
            return this.rowEditTextDirectives.first;
        }
        return null;
    }
    /**
     * @hidden @internal
     */
    get rowEditActions() {
        if (this.rowEditActionsDirectives && this.rowEditActionsDirectives.first) {
            return this.rowEditActionsDirectives.first;
        }
        return null;
    }
    /**
     * @hidden @internal
     */
    get rowEditContainer() {
        return this.rowEditCustom ? this.rowEditCustom : this.defaultRowEditTemplate;
    }
    /**
     * The custom template, if any, that should be used when rendering the row drag indicator icon
     */
    get dragIndicatorIconTemplate() {
        return this._customDragIndicatorIconTemplate || this.dragIndicatorIconTemplates.first;
    }
    set dragIndicatorIconTemplate(val) {
        this._customDragIndicatorIconTemplate = val;
    }
    /**
     * @hidden @internal
     */
    get firstEditableColumnIndex() {
        const index = this.visibleColumns.filter(col => col.editable)
            .map(c => c.visibleIndex).sort((a, b) => a - b);
        return index.length ? index[0] : null;
    }
    /**
     * @hidden @internal
     */
    get lastEditableColumnIndex() {
        const index = this.visibleColumns.filter(col => col.editable)
            .map(c => c.visibleIndex).sort((a, b) => a > b ? -1 : 1);
        return index.length ? index[0] : null;
    }
    /**
     * @hidden @internal
     * TODO: Nav service logic doesn't handle 0 results from this querylist
     */
    get rowEditTabs() {
        return this.rowEditTabsCUSTOM.length ? this.rowEditTabsCUSTOM : this.rowEditTabsDEFAULT;
    }
    get activeDescendant() {
        const activeElem = this.navigation.activeNode;
        if (!activeElem || !Object.keys(activeElem).length) {
            return this.id;
        }
        return activeElem.row < 0 ?
            `${this.id}_${activeElem.row}_${activeElem.mchCache.level}_${activeElem.column}` :
            `${this.id}_${activeElem.row}_${activeElem.column}`;
    }
    /**
     * @hidden @internal
     */
    get hostClass() {
        const classes = [this.getComponentDensityClass('igx-grid')];
        // The custom classes should be at the end.
        classes.push(this.class);
        return classes.join(' ');
    }
    get bannerClass() {
        const position = this.rowEditPositioningStrategy.isTop ? 'igx-banner__border-top' : 'igx-banner__border-bottom';
        return `${this.getComponentDensityClass('igx-banner')} ${position}`;
    }
    /**
     * Gets/Sets the sorting state.
     *
     * @remarks
     * Supports two-way data binding.
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true" [(sortingExpressions)]="model.sortingExpressions"></igx-grid>
     * ```
     */
    get sortingExpressions() {
        return this._sortingExpressions;
    }
    set sortingExpressions(value) {
        this._sortingExpressions = cloneArray(value);
        this.sortingExpressionsChange.emit(this._sortingExpressions);
        this.notifyChanges();
    }
    /**
     * @hidden @internal
     */
    get maxLevelHeaderDepth() {
        if (this._maxLevelHeaderDepth === null) {
            this._maxLevelHeaderDepth = this.hasColumnLayouts ?
                this.columnList.reduce((acc, col) => Math.max(acc, col.rowStart), 0) :
                this.columnList.reduce((acc, col) => Math.max(acc, col.level), 0);
        }
        return this._maxLevelHeaderDepth;
    }
    /**
     * Gets the number of hidden columns.
     *
     * @example
     * ```typescript
     * const hiddenCol = this.grid.hiddenColumnsCount;
     * ``
     */
    get hiddenColumnsCount() {
        return this.columnList.filter((col) => col.columnGroup === false && col.hidden === true).length;
    }
    /**
     * Gets the number of pinned columns.
     */
    get pinnedColumnsCount() {
        return this.pinnedColumns.filter(col => !col.columnLayout).length;
    }
    /**
     * Gets/Sets whether the grid has batch editing enabled.
     * When batch editing is enabled, changes are not made directly to the underlying data.
     * Instead, they are stored as transactions, which can later be committed w/ the `commit` method.
     *
     * @example
     * ```html
     * <igx-grid [batchEditing]="true" [data]="someData">
     * </igx-grid>
     * ```
     */
    get batchEditing() {
        return this._batchEditing;
    }
    set batchEditing(val) {
        if (val !== this._batchEditing) {
            delete this._transactions;
            this._batchEditing = val;
            this.switchTransactionService(val);
            this.subscribeToTransactions();
        }
    }
    /**
     * Get transactions service for the grid.
     */
    get transactions() {
        if (this._diTransactions && !this.batchEditing) {
            return this._diTransactions;
        }
        return this._transactions;
    }
    /**
     * @hidden @internal
     */
    get currentRowState() {
        return this._currentRowState;
    }
    /**
     * @hidden @internal
     */
    get currencyPositionLeft() {
        if (this._currencyPositionLeft !== undefined) {
            return this._currencyPositionLeft;
        }
        const format = getLocaleNumberFormat(this.locale, NumberFormatStyle.Currency);
        const formatParts = format.split(',');
        const i = formatParts.indexOf(formatParts.find(c => c.includes('¤')));
        return this._currencyPositionLeft = i < 1;
    }
    /**
     * Gets/Sets cell selection mode.
     *
     * @remarks
     * By default the cell selection mode is multiple
     * @param selectionMode: GridSelectionMode
     */
    get cellSelection() {
        return this._cellSelectionMode;
    }
    set cellSelection(selectionMode) {
        this._cellSelectionMode = selectionMode;
        // if (this.gridAPI.grid) {
        this.selectionService.clear(true);
        this.notifyChanges();
        // }
    }
    /**
     * Gets/Sets row selection mode
     *
     * @remarks
     * By default the row selection mode is 'none'
     * Note that in IgxGrid and IgxHierarchicalGrid 'multipleCascade' behaves like 'multiple'
     */
    get rowSelection() {
        return this._rowSelectionMode;
    }
    set rowSelection(selectionMode) {
        this._rowSelectionMode = selectionMode;
        if (!this._init) {
            this.selectionService.clearAllSelectedRows();
            this.notifyChanges(true);
        }
    }
    /**
     * Gets/Sets column selection mode
     *
     * @remarks
     * By default the row selection mode is none
     * @param selectionMode: GridSelectionMode
     */
    get columnSelection() {
        return this._columnSelectionMode;
    }
    set columnSelection(selectionMode) {
        this._columnSelectionMode = selectionMode;
        // if (this.gridAPI.grid) {
        this.selectionService.clearAllSelectedColumns();
        this.notifyChanges(true);
        // }
    }
    /**
     * @hidden @internal
     */
    set pagingState(value) {
        this._pagingState = value;
        if (this.paginator && !this._init) {
            this.paginator.totalRecords = value.metadata.countRecords;
        }
    }
    get pagingState() {
        return this._pagingState;
    }
    /** @hidden @internal */
    get paginator() {
        return this.paginationComponents?.first;
    }
    /**
     * @hidden @internal
     */
    get scrollSize() {
        return this.verticalScrollContainer.getScrollNativeSize();
    }
    /**
     * Returns an array containing the filtered sorted data.
     *
     * @example
     * ```typescript
     * const filteredSortedData = this.grid1.filteredSortedData;
     * ```
     */
    get filteredSortedData() {
        return this._filteredSortedData;
    }
    /**
     * @hidden @internal
     */
    get rowChangesCount() {
        if (!this.crudService.row) {
            return 0;
        }
        const f = (obj) => {
            let changes = 0;
            Object.keys(obj).forEach(key => isObject(obj[key]) ? changes += f(obj[key]) : changes++);
            return changes;
        };
        const rowChanges = this.transactions.getAggregatedValue(this.crudService.row.id, false);
        return rowChanges ? f(rowChanges) : 0;
    }
    /**
     * @hidden @internal
     */
    get dataWithAddedInTransactionRows() {
        const result = cloneArray(this.gridAPI.get_all_data());
        if (this.transactions.enabled) {
            result.push(...this.transactions.getAggregatedChanges(true)
                .filter(t => t.type === TransactionType.ADD)
                .map(t => t.newValue));
        }
        if (this.crudService.row && this.crudService.row.getClassName() === IgxAddRow.name) {
            result.splice(this.crudService.row.index, 0, this.crudService.row.data);
        }
        return result;
    }
    /**
     * @hidden @internal
     */
    get dataLength() {
        return this.transactions.enabled ? this.dataWithAddedInTransactionRows.length : this.gridAPI.get_all_data().length;
    }
    /**
     * @hidden @internal
     */
    get template() {
        if (this.isLoading && (this.hasZeroResultFilter || this.hasNoData)) {
            return this.loadingGridTemplate ? this.loadingGridTemplate : this.loadingGridDefaultTemplate;
        }
        if (this.hasZeroResultFilter) {
            return this.emptyGridTemplate ? this.emptyGridTemplate : this.emptyFilteredGridTemplate;
        }
        if (this.hasNoData) {
            return this.emptyGridTemplate ? this.emptyGridTemplate : this.emptyGridDefaultTemplate;
        }
    }
    /**
     * @hidden @internal
     */
    get hasZeroResultFilter() {
        return this.filteredData && this.filteredData.length === 0;
    }
    /**
     * @hidden @internal
     */
    get hasNoData() {
        return !this.data || this.dataLength === 0;
    }
    /**
     * @hidden @internal
     */
    get shouldOverlayLoading() {
        return this.isLoading && !this.hasNoData && !this.hasZeroResultFilter;
    }
    /**
     * @hidden @internal
     */
    get isMultiRowSelectionEnabled() {
        return this.rowSelection === GridSelectionMode.multiple
            || this.rowSelection === GridSelectionMode.multipleCascade;
    }
    /**
     * @hidden @internal
     */
    get isRowSelectable() {
        return this.rowSelection !== GridSelectionMode.none;
    }
    /**
     * @hidden @internal
     */
    get isCellSelectable() {
        return this.cellSelection !== GridSelectionMode.none;
    }
    /**
     * @hidden @internal
     */
    get columnInDrag() {
        return this.gridAPI.cms.column;
    }
    /**
     * @hidden
     * @internal
     */
    hideActionStrip() {
        this.actionStrip?.hide();
    }
    /**
     * @hidden
     * @internal
     */
    get headerFeaturesWidth() {
        return this._headerFeaturesWidth;
    }
    /**
     * @hidden
     * @internal
     */
    isDetailRecord(_rec) {
        return false;
    }
    /**
     * @hidden
     * @internal
     */
    isGroupByRecord(_rec) {
        return false;
    }
    /**
     * @hidden @internal
     */
    isGhostRecord(record) {
        return record.ghostRecord !== undefined;
    }
    /**
     * @hidden @internal
     */
    isAddRowRecord(record) {
        return record.addRow !== undefined;
    }
    /**
     * @hidden
     * Returns the row index of a row that takes into account the full view data like pinning.
     */
    getDataViewIndex(rowIndex, pinned) {
        if (pinned && !this.isRowPinningToTop) {
            rowIndex = rowIndex + this.unpinnedDataView.length;
        }
        else if (!pinned && this.isRowPinningToTop) {
            rowIndex = rowIndex + this.pinnedDataView.length;
        }
        return rowIndex;
    }
    /**
     * @hidden
     * @internal
     */
    get hasDetails() {
        return false;
    }
    /**
     * Returns the state of the grid virtualization.
     *
     * @remarks
     * Includes the start index and how many records are rendered.
     * @example
     * ```typescript
     * const gridVirtState = this.grid1.virtualizationState;
     * ```
     */
    get virtualizationState() {
        return this.verticalScrollContainer.state;
    }
    /**
     * @hidden
     */
    set virtualizationState(state) {
        this.verticalScrollContainer.state = state;
    }
    /**
     * @hidden
     * @internal
     */
    hideOverlays() {
        this.overlayIDs.forEach(overlayID => {
            const overlay = this.overlayService.getOverlayById(overlayID);
            if (overlay?.visible && !overlay.closeAnimationPlayer?.hasStarted()) {
                this.overlayService.hide(overlayID);
                this.nativeElement.focus();
            }
        });
    }
    /**
     * Returns whether the record is pinned or not.
     *
     * @param rowIndex Index of the record in the `dataView` collection.
     *
     * @hidden
     * @internal
     */
    isRecordPinnedByViewIndex(rowIndex) {
        return this.hasPinnedRecords && (this.isRowPinningToTop && rowIndex < this.pinnedDataView.length) ||
            (!this.isRowPinningToTop && rowIndex >= this.unpinnedDataView.length);
    }
    /**
     * Returns whether the record is pinned or not.
     *
     * @param rowIndex Index of the record in the `filteredSortedData` collection.
     */
    isRecordPinnedByIndex(rowIndex) {
        return this.hasPinnedRecords && (this.isRowPinningToTop && rowIndex < this._filteredSortedPinnedData.length) ||
            (!this.isRowPinningToTop && rowIndex >= this._filteredSortedUnpinnedData.length);
    }
    /**
     * @hidden
     * @internal
     */
    isRecordPinned(rec) {
        return this.getInitialPinnedIndex(rec) !== -1;
    }
    /**
     * @hidden
     * @internal
     * Returns the record index in order of pinning by the user. Does not consider sorting/filtering.
     */
    getInitialPinnedIndex(rec) {
        const id = this.gridAPI.get_row_id(rec);
        return this._pinnedRecordIDs.indexOf(id);
    }
    /**
     * @hidden
     * @internal
     */
    get hasPinnedRecords() {
        return this._pinnedRecordIDs.length > 0;
    }
    /**
     * @hidden
     * @internal
     */
    get pinnedRecordsCount() {
        return this._pinnedRecordIDs.length;
    }
    /**
     * @hidden
     * @internal
     */
    get crudService() {
        return this.gridAPI.crudService;
    }
    /**
     * @hidden
     * @internal
     */
    _setupServices() {
        this.gridAPI.grid = this;
        this.crudService.grid = this;
        this.selectionService.grid = this;
        this.navigation.grid = this;
        this.filteringService.grid = this;
        this.summaryService.grid = this;
    }
    /**
     * @hidden
     * @internal
     */
    _setupListeners() {
        const destructor = takeUntil(this.destroy$);
        fromEvent(this.nativeElement, 'focusout').pipe(filter(() => !!this.navigation.activeNode), destructor).subscribe((event) => {
            if (!this.crudService.cell &&
                !!this.navigation.activeNode &&
                ((event.target === this.tbody.nativeElement && this.navigation.activeNode.row >= 0 &&
                    this.navigation.activeNode.row < this.dataView.length)
                    || (event.target === this.theadRow.nativeElement && this.navigation.activeNode.row === -1)
                    || (event.target === this.tfoot.nativeElement && this.navigation.activeNode.row === this.dataView.length)) &&
                !(this.rowEditable && this.crudService.rowEditingBlocked && this.crudService.rowInEditMode)) {
                this.navigation.lastActiveNode = this.navigation.activeNode;
                this.navigation.activeNode = {};
                this.notifyChanges();
            }
        });
        this.rowAddedNotifier.pipe(destructor).subscribe(args => this.refreshGridState(args));
        this.rowDeletedNotifier.pipe(destructor).subscribe(args => {
            this.summaryService.deleteOperation = true;
            this.summaryService.clearSummaryCache(args);
        });
        this.subscribeToTransactions();
        this.resizeNotify.pipe(filter(() => !this._init), throttleTime(0, animationFrameScheduler, { leading: true, trailing: true }), destructor)
            .subscribe(() => {
            this.zone.run(() => {
                // do not trigger reflow if element is detached.
                if (this.document.contains(this.nativeElement)) {
                    this.notifyChanges(true);
                }
            });
        });
        this.pipeTriggerNotifier.pipe(takeUntil(this.destroy$)).subscribe(() => this.pipeTrigger++);
        this.columnMovingEnd.pipe(destructor).subscribe(() => this.crudService.endEdit(false));
        this.overlayService.opening.pipe(destructor).subscribe((event) => {
            if (this._advancedFilteringOverlayId === event.id) {
                const instance = event.componentRef.instance;
                if (instance) {
                    instance.initialize(this, this.overlayService, event.id);
                }
            }
        });
        this.overlayService.opened.pipe(destructor).subscribe((event) => {
            const overlaySettings = this.overlayService.getOverlayById(event.id)?.settings;
            // do not hide the advanced filtering overlay on scroll
            if (this._advancedFilteringOverlayId === event.id) {
                const instance = event.componentRef.instance;
                if (instance) {
                    instance.lastActiveNode = this.navigation.activeNode;
                    instance.setAddButtonFocus();
                }
                return;
            }
            // do not hide the overlay if it's attached to a row
            if (this.rowEditingOverlay?.overlayId === event.id) {
                return;
            }
            if (overlaySettings?.outlet === this.outlet && this.overlayIDs.indexOf(event.id) === -1) {
                this.overlayIDs.push(event.id);
            }
        });
        this.overlayService.closed.pipe(filter(() => !this._init), destructor).subscribe((event) => {
            if (this._advancedFilteringOverlayId === event.id) {
                this.overlayService.detach(this._advancedFilteringOverlayId);
                this._advancedFilteringOverlayId = null;
                return;
            }
            const ind = this.overlayIDs.indexOf(event.id);
            if (ind !== -1) {
                this.overlayIDs.splice(ind, 1);
            }
        });
        this.verticalScrollContainer.dataChanging.pipe(filter(() => !this._init), destructor).subscribe(($event) => {
            const shouldRecalcSize = this.isPercentHeight &&
                (!this.calcHeight || this.calcHeight === this.getDataBasedBodyHeight() ||
                    this.calcHeight === this.renderedRowHeight * this._defaultTargetRecordNumber);
            if (shouldRecalcSize) {
                this.calculateGridHeight();
                $event.containerSize = this.calcHeight;
            }
            this.evaluateLoadingState();
        });
        this.verticalScrollContainer.scrollbarVisibilityChanged.pipe(filter(() => !this._init), destructor).subscribe(() => {
            // called to recalc all widths that may have changes as a result of
            // the vert. scrollbar showing/hiding
            this.notifyChanges(true);
            this.cdr.detectChanges();
        });
        this.verticalScrollContainer.contentSizeChange.pipe(filter(() => !this._init), destructor).subscribe(() => {
            this.notifyChanges();
        });
        this.onDensityChanged.pipe(destructor).subscribe(() => {
            this.crudService.endEdit(false);
            if (this._summaryRowHeight === 0) {
                this.summaryService.summaryHeight = 0;
            }
            this.notifyChanges(true);
        });
    }
    /**
     * @hidden
     */
    ngOnInit() {
        super.ngOnInit();
        this._setupServices();
        this._setupListeners();
        this.rowListDiffer = this.differs.find([]).create(null);
        // compare based on field, not on object ref.
        this.columnListDiffer = this.differs.find([]).create((index, col) => col.field);
        this.calcWidth = this.width && this.width.indexOf('%') === -1 ? parseInt(this.width, 10) : 0;
        this.shouldGenerate = this.autoGenerate;
    }
    /**
     * @hidden
     * @internal
     */
    resetColumnsCaches() {
        this.columnList.forEach(column => column.resetCaches());
    }
    /**
     * @hidden @internal
     */
    generateRowID() {
        const primaryColumn = this.columnList.find(col => col.field === this.primaryKey);
        const idType = this.data.length ?
            this.resolveDataTypes(this.data[0][this.primaryKey]) : primaryColumn ? primaryColumn.dataType : 'string';
        return idType === 'string' ? uuidv4() : FAKE_ROW_ID--;
    }
    /**
     * @hidden
     * @internal
     */
    resetForOfCache() {
        const firstVirtRow = this.dataRowList.first;
        if (firstVirtRow) {
            if (this._cdrRequests) {
                firstVirtRow.virtDirRow.cdr.detectChanges();
            }
            firstVirtRow.virtDirRow.assumeMaster();
        }
    }
    /**
     * @hidden
     * @internal
     */
    setFilteredData(data, pinned) {
        if (this.hasPinnedRecords && pinned) {
            this._filteredPinnedData = data || [];
            const filteredUnpinned = this._filteredUnpinnedData || [];
            const filteredData = [...this._filteredPinnedData, ...filteredUnpinned];
            this.filteredData = filteredData.length > 0 ? filteredData : this._filteredUnpinnedData;
        }
        else if (this.hasPinnedRecords && !pinned) {
            this._filteredUnpinnedData = data;
        }
        else {
            this.filteredData = data;
        }
    }
    /**
     * @hidden
     * @internal
     */
    resetColumnCollections() {
        this._visibleColumns.length = 0;
        this._pinnedVisible.length = 0;
        this._unpinnedVisible.length = 0;
    }
    /**
     * @hidden
     * @internal
     */
    resetCachedWidths() {
        this._unpinnedWidth = NaN;
        this._pinnedWidth = NaN;
        this._totalWidth = NaN;
    }
    /**
     * @hidden
     * @internal
     */
    resetCaches(recalcFeatureWidth = true) {
        if (recalcFeatureWidth) {
            this._headerFeaturesWidth = NaN;
        }
        this.resetForOfCache();
        this.resetColumnsCaches();
        this.resetColumnCollections();
        this.resetCachedWidths();
        this.hasVisibleColumns = undefined;
        this._columnGroups = this.columnList.some(col => col.columnGroup);
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this.setupColumns();
        this.toolbar.changes.pipe(filter(() => !this._init), takeUntil(this.destroy$)).subscribe(() => this.notifyChanges(true));
        this.setUpPaginator();
        this.paginationComponents.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.setUpPaginator();
        });
        if (this.actionStrip) {
            this.actionStrip.menuOverlaySettings.outlet = this.outlet;
        }
    }
    /**
     * @hidden @internal
     */
    dataRebinding(event) {
        this.dataChanging.emit(event);
    }
    /**
     * @hidden @internal
     */
    dataRebound(event) {
        this.dataChanged.emit(event);
    }
    /** @hidden @internal */
    createFilterDropdown(column, options) {
        options.outlet = this.outlet;
        if (this.excelStyleFilteringComponent) {
            this.excelStyleFilteringComponent.initialize(column, this.overlayService);
            const id = this.overlayService.attach(this.excelStyleFilteringComponent.element, options);
            this.excelStyleFilteringComponent.overlayComponentId = id;
            return { id, ref: undefined };
        }
        const ref = this.createComponentInstance(IgxGridExcelStyleFilteringComponent);
        ref.instance.initialize(column, this.overlayService);
        const id = this.overlayService.attach(ref.instance.element, options);
        ref.instance.overlayComponentId = id;
        return { ref, id };
    }
    createComponentInstance(component) {
        let dynamicFactory;
        const factoryResolver = this.moduleRef
            ? this.moduleRef.componentFactoryResolver
            : this.resolver;
        try {
            dynamicFactory = factoryResolver.resolveComponentFactory(component);
        }
        catch (error) {
            console.error(error);
            return null;
        }
        const injector = this.moduleRef
            ? this.moduleRef.injector
            : this.injector;
        const dynamicComponent = dynamicFactory.create(injector);
        this.appRef.attachView(dynamicComponent.hostView);
        return dynamicComponent;
    }
    /** @hidden @internal */
    setUpPaginator() {
        if (this.paginator) {
            this.paginator.pageChange.pipe(takeWhile(() => !!this.paginator), filter(() => !this._init))
                .subscribe((page) => {
                this.pageChange.emit(page);
            });
            this.paginator.pagingDone.pipe(takeWhile(() => !!this.paginator), filter(() => !this._init))
                .subscribe((args) => {
                this.selectionService.clear(true);
                this.pagingDone.emit({ previous: args.previous, current: args.current });
                this.crudService.endEdit(false);
                this.pipeTrigger++;
                this.navigateTo(0);
                this.notifyChanges();
            });
            this.paginator.perPageChange.pipe(takeWhile(() => !!this.paginator), filter(() => !this._init))
                .subscribe((perPage) => {
                this.selectionService.clear(true);
                this.perPageChange.emit(perPage);
                this.paginator.page = 0;
                this.crudService.endEdit(false);
                this.notifyChanges();
            });
        }
        else {
            this.markForCheck();
        }
    }
    /**
     * @hidden
     * @internal
     */
    setFilteredSortedData(data, pinned) {
        data = data || [];
        if (this.pinnedRecordsCount > 0) {
            if (pinned) {
                this._filteredSortedPinnedData = data;
                this.pinnedRecords = data;
                this._filteredSortedData = this.isRowPinningToTop ? [...this._filteredSortedPinnedData, ...this._filteredSortedUnpinnedData] :
                    [...this._filteredSortedUnpinnedData, ...this._filteredSortedPinnedData];
                this.refreshSearch(true, false);
            }
            else {
                this._filteredSortedUnpinnedData = data;
            }
        }
        else {
            this._filteredSortedData = data;
            this.refreshSearch(true, false);
        }
        this.buildDataView(data);
    }
    /**
     * @hidden @internal
     */
    resetHorizontalVirtualization() {
        const elementFilter = (item) => this.isDefined(item.nativeElement.parentElement);
        this._horizontalForOfs = [
            ...this._dataRowList.filter(elementFilter).map(item => item.virtDirRow),
            ...this._summaryRowList.filter(elementFilter).map(item => item.virtDirRow)
        ];
    }
    /**
     * @hidden @internal
     */
    _setupRowObservers() {
        const elementFilter = (item) => this.isDefined(item.nativeElement.parentElement);
        const extractForOfs = pipe(map((collection) => collection.filter(elementFilter).map(item => item.virtDirRow)));
        const rowListObserver = extractForOfs(this._dataRowList.changes);
        const summaryRowObserver = extractForOfs(this._summaryRowList.changes);
        rowListObserver.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.resetHorizontalVirtualization();
        });
        summaryRowObserver.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.resetHorizontalVirtualization();
        });
        this.resetHorizontalVirtualization();
    }
    /**
     * @hidden @internal
     */
    _zoneBegoneListeners() {
        this.zone.runOutsideAngular(() => {
            this.verticalScrollContainer.getScroll().addEventListener('scroll', this.verticalScrollHandler.bind(this));
            this.headerContainer?.getScroll().addEventListener('scroll', this.horizontalScrollHandler.bind(this));
            fromEvent(window, 'resize').pipe(takeUntil(this.destroy$)).subscribe(() => this.resizeNotify.next());
            resizeObservable(this.nativeElement).pipe(takeUntil(this.destroy$)).subscribe(() => this.resizeNotify.next());
        });
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        this.initPinning();
        this.calculateGridSizes();
        this._init = false;
        this.cdr.reattach();
        this._setupRowObservers();
        this._zoneBegoneListeners();
        const vertScrDC = this.verticalScrollContainer.displayContainer;
        vertScrDC.addEventListener('scroll', this.preventContainerScroll.bind(this));
        this._pinnedRowList.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((change) => {
            this.onPinnedRowsChanged(change);
        });
        this.addRowSnackbar?.clicked.subscribe(() => {
            const rec = this.filteredSortedData[this.lastAddedRowIndex];
            this.scrollTo(rec, 0);
            this.addRowSnackbar.close();
        });
        // Keep the stream open for future subscribers
        this.rendered$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.paginator) {
                this.paginator.perPage = this._perPage !== DEFAULT_ITEMS_PER_PAGE ? this._perPage : this.paginator.perPage;
                this.paginator.totalRecords = this.totalRecords ? this.totalRecords : this.paginator.totalRecords;
                this.paginator.overlaySettings = { outlet: this.outlet };
            }
            this._rendered = true;
        });
        Promise.resolve().then(() => this.rendered.next(true));
    }
    /**
     * @hidden @internal
     */
    notifyChanges(repaint = false) {
        this._cdrRequests = true;
        this._cdrRequestRepaint = repaint;
        this.cdr.markForCheck();
    }
    /**
     * @hidden @internal
     */
    ngDoCheck() {
        super.ngDoCheck();
        if (this._init) {
            return;
        }
        if (this._cdrRequestRepaint) {
            this.resetNotifyChanges();
            this.calculateGridSizes();
            this.refreshSearch(true);
            return;
        }
        if (this._cdrRequests) {
            this.resetNotifyChanges();
            this.cdr.detectChanges();
        }
    }
    /**
     * @hidden
     * @internal
     */
    getDragGhostCustomTemplate() {
        if (this.dragGhostCustomTemplates && this.dragGhostCustomTemplates.first) {
            return this.dragGhostCustomTemplates.first;
        }
        return null;
    }
    /**
     * @hidden @internal
     */
    ngOnDestroy() {
        this.tmpOutlets.forEach((tmplOutlet) => {
            tmplOutlet.cleanCache();
        });
        this.destroy$.next(true);
        this.destroy$.complete();
        this.transactionChange$.next();
        this.transactionChange$.complete();
        this._destroyed = true;
        if (this._advancedFilteringOverlayId) {
            this.overlayService.detach(this._advancedFilteringOverlayId);
            delete this._advancedFilteringOverlayId;
        }
        this.overlayIDs.forEach(overlayID => {
            const overlay = this.overlayService.getOverlayById(overlayID);
            if (overlay && !overlay.detached) {
                this.overlayService.detach(overlayID);
            }
        });
        this.zone.runOutsideAngular(() => {
            this.verticalScrollContainer?.getScroll()?.removeEventListener('scroll', this.verticalScrollHandler);
            this.headerContainer?.getScroll()?.removeEventListener('scroll', this.horizontalScrollHandler);
            const vertScrDC = this.verticalScrollContainer?.displayContainer;
            vertScrDC?.removeEventListener('scroll', this.preventContainerScroll);
        });
    }
    /**
     * Toggles the specified column's visibility.
     *
     * @example
     * ```typescript
     * this.grid1.toggleColumnVisibility({
     *       column: this.grid1.columns[0],
     *       newValue: true
     * });
     * ```
     */
    toggleColumnVisibility(args) {
        const col = args.column ? this.columnList.find((c) => c === args.column) : undefined;
        if (!col) {
            return;
        }
        col.toggleVisibility(args.newValue);
    }
    /**
     * Gets/Sets a list of key-value pairs [row ID, expansion state].
     *
     * @remarks
     * Includes only states that differ from the default one.
     * Supports two-way binding.
     * @example
     * ```html
     * <igx-grid #grid [data]="data" [(expansionStates)]="model.expansionStates">
     * </igx-grid>
     * ```
     */
    get expansionStates() {
        return this._expansionStates;
    }
    set expansionStates(value) {
        this._expansionStates = new Map(value);
        this.expansionStatesChange.emit(this._expansionStates);
        this.notifyChanges(true);
        if (this.gridAPI.grid) {
            this.cdr.detectChanges();
        }
    }
    /**
     * Expands all rows.
     *
     * @example
     * ```typescript
     * this.grid.expandAll();
     * ```
     */
    expandAll() {
        this._defaultExpandState = true;
        this.expansionStates = new Map();
    }
    /**
     * Collapses all rows.
     *
     * @example
     * ```typescript
     * this.grid.collapseAll();
     * ```
     */
    collapseAll() {
        this._defaultExpandState = false;
        this.expansionStates = new Map();
    }
    /**
     * Expands the row by its id.
     *
     * @remarks
     * ID is either the primaryKey value or the data record instance.
     * @example
     * ```typescript
     * this.grid.expandRow(rowID);
     * ```
     * @param rowID The row id - primaryKey value or the data record instance.
     */
    expandRow(rowID) {
        this.gridAPI.set_row_expansion_state(rowID, true);
    }
    /**
     * Collapses the row by its id.
     *
     * @remarks
     * ID is either the primaryKey value or the data record instance.
     * @example
     * ```typescript
     * this.grid.collapseRow(rowID);
     * ```
     * @param rowID The row id - primaryKey value or the data record instance.
     */
    collapseRow(rowID) {
        this.gridAPI.set_row_expansion_state(rowID, false);
    }
    /**
     * Toggles the row by its id.
     *
     * @remarks
     * ID is either the primaryKey value or the data record instance.
     * @example
     * ```typescript
     * this.grid.toggleRow(rowID);
     * ```
     * @param rowID The row id - primaryKey value or the data record instance.
     */
    toggleRow(rowID) {
        const rec = this.gridAPI.get_rec_by_id(rowID);
        const state = this.gridAPI.get_row_expansion_state(rec);
        this.gridAPI.set_row_expansion_state(rowID, !state);
    }
    /**
     * @hidden
     * @internal
     */
    getDefaultExpandState(_rec) {
        return this._defaultExpandState;
    }
    /**
     * Gets the native element.
     *
     * @example
     * ```typescript
     * const nativeEl = this.grid.nativeElement.
     * ```
     */
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    /**
     * Gets/Sets the outlet used to attach the grid's overlays to.
     *
     * @remark
     * If set, returns the outlet defined outside the grid. Otherwise returns the grid's internal outlet directive.
     */
    get outlet() {
        return this.resolveOutlet();
    }
    set outlet(val) {
        this._userOutletDirective = val;
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
        switch (this.displayDensity) {
            case DisplayDensity.cosy:
                return 40;
            case DisplayDensity.compact:
                return 32;
            default:
                return 50;
        }
    }
    /**
     * @hidden @internal
     */
    get defaultSummaryHeight() {
        switch (this.displayDensity) {
            case DisplayDensity.cosy:
                return 30;
            case DisplayDensity.compact:
                return 24;
            default:
                return 36;
        }
    }
    /**
     * Returns the `IgxGridHeaderGroupComponent`'s minimum allowed width.
     *
     * @remarks
     * Used internally for restricting header group component width.
     * The values below depend on the header cell default right/left padding values.
     */
    get defaultHeaderGroupMinWidth() {
        switch (this.displayDensity) {
            case DisplayDensity.cosy:
                return 32;
            case DisplayDensity.compact:
                return 24;
            default:
                return 48;
        }
    }
    /**
     * Gets the current width of the container for the pinned `IgxColumnComponent`s.
     *
     * @example
     * ```typescript
     * const pinnedWidth = this.grid.getPinnedWidth;
     * ```
     */
    get pinnedWidth() {
        if (!isNaN(this._pinnedWidth)) {
            return this._pinnedWidth;
        }
        this._pinnedWidth = this.getPinnedWidth();
        return this._pinnedWidth;
    }
    /**
     * Gets the current width of the container for the unpinned `IgxColumnComponent`s.
     *
     * @example
     * ```typescript
     * const unpinnedWidth = this.grid.getUnpinnedWidth;
     * ```
     */
    get unpinnedWidth() {
        if (!isNaN(this._unpinnedWidth)) {
            return this._unpinnedWidth;
        }
        this._unpinnedWidth = this.getUnpinnedWidth();
        return this._unpinnedWidth;
    }
    /**
     * @hidden @internal
     */
    get isHorizontalScrollHidden() {
        const diff = this.unpinnedWidth - this.totalWidth;
        return this.width === null || diff >= 0;
    }
    /**
     * @hidden @internal
     * Gets the header cell inner width for auto-sizing.
     */
    getHeaderCellWidth(element) {
        const range = this.document.createRange();
        const headerWidth = this.platform.getNodeSizeViaRange(range, element, element.parentElement);
        const headerStyle = this.document.defaultView.getComputedStyle(element);
        const headerPadding = parseFloat(headerStyle.paddingLeft) + parseFloat(headerStyle.paddingRight) +
            parseFloat(headerStyle.borderRightWidth);
        // Take into consideration the header group element, since column pinning applies borders to it if its not a columnGroup.
        const headerGroupStyle = this.document.defaultView.getComputedStyle(element.parentElement);
        const borderSize = parseFloat(headerGroupStyle.borderRightWidth) + parseFloat(headerGroupStyle.borderLeftWidth);
        return { width: Math.ceil(headerWidth), padding: Math.ceil(headerPadding + borderSize) };
    }
    /**
     * @hidden @internal
     * Gets the combined width of the columns that are specific to the enabled grid features. They are fixed.
     */
    featureColumnsWidth(expander) {
        if (Number.isNaN(this._headerFeaturesWidth)) {
            // TODO: platformUtil.isBrowser check
            const rowSelectArea = this.headerSelectorContainer?.nativeElement?.getBoundingClientRect ?
                this.headerSelectorContainer.nativeElement.getBoundingClientRect().width : 0;
            const rowDragArea = this.rowDraggable && this.headerDragContainer?.nativeElement?.getBoundingClientRect ?
                this.headerDragContainer.nativeElement.getBoundingClientRect().width : 0;
            const groupableArea = this.headerGroupContainer?.nativeElement?.getBoundingClientRect ?
                this.headerGroupContainer.nativeElement.getBoundingClientRect().width : 0;
            const expanderWidth = expander?.nativeElement?.getBoundingClientRect ? expander.nativeElement.getBoundingClientRect().width : 0;
            this._headerFeaturesWidth = rowSelectArea + rowDragArea + groupableArea + expanderWidth;
        }
        return this._headerFeaturesWidth;
    }
    /**
     * @hidden @internal
     */
    get summariesMargin() {
        return this.featureColumnsWidth();
    }
    /**
     * Gets an array of `IgxColumnComponent`s.
     *
     * @example
     * ```typescript
     * const colums = this.grid.columns.
     * ```
     */
    get columns() {
        return this._rendered ? this._columns : [];
    }
    /**
     * Gets an array of the pinned `IgxColumnComponent`s.
     *
     * @example
     * ```typescript
     * const pinnedColumns = this.grid.pinnedColumns.
     * ```
     */
    get pinnedColumns() {
        if (this._pinnedVisible.length) {
            return this._pinnedVisible;
        }
        this._pinnedVisible = this._pinnedColumns.filter(col => !col.hidden);
        return this._pinnedVisible;
    }
    /**
     * Gets an array of the pinned `IgxRowComponent`s.
     *
     * @example
     * ```typescript
     * const pinnedRow = this.grid.pinnedRows;
     * ```
     */
    get pinnedRows() {
        return this._pinnedRowList.toArray().sort((a, b) => a.index - b.index);
    }
    /**
     * Gets an array of unpinned `IgxColumnComponent`s.
     *
     * @example
     * ```typescript
     * const unpinnedColumns = this.grid.unpinnedColumns.
     * ```
     */
    get unpinnedColumns() {
        if (this._unpinnedVisible.length) {
            return this._unpinnedVisible;
        }
        this._unpinnedVisible = this._unpinnedColumns.filter((col) => !col.hidden);
        return this._unpinnedVisible;
    }
    /**
     * Gets the `width` to be set on `IgxGridHeaderGroupComponent`.
     */
    getHeaderGroupWidth(column) {
        return this.hasColumnLayouts
            ? ''
            : `${Math.max(parseFloat(column.calcWidth), this.defaultHeaderGroupMinWidth)}px`;
    }
    /**
     * Returns the `IgxColumnComponent` by field name.
     *
     * @example
     * ```typescript
     * const myCol = this.grid1.getColumnByName("ID");
     * ```
     * @param name
     */
    getColumnByName(name) {
        return this.columnList.find((col) => col.field === name);
    }
    getColumnByVisibleIndex(index) {
        return this.visibleColumns.find((col) => !col.columnGroup && !col.columnLayout &&
            col.visibleIndex === index);
    }
    /**
     * Returns an array of visible `IgxColumnComponent`s.
     *
     * @example
     * ```typescript
     * const visibleColumns = this.grid.visibleColumns.
     * ```
     */
    get visibleColumns() {
        if (this._visibleColumns.length) {
            return this._visibleColumns;
        }
        this._visibleColumns = this.columnList.filter(c => !c.hidden);
        return this._visibleColumns;
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding property exposed by the `igx-paginator`
     *
     * Gets the total number of pages.
     *
     *
     * @example
     * ```typescript
     * const totalPages = this.grid.totalPages;
     * ```
     */
    get totalPages() {
        return this.paginator?.totalPages;
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding property exposed by the `igx-paginator`
     *
     * Gets if the current page is the first page.
     *
     *
     * @example
     * ```typescript
     * const firstPage = this.grid.isFirstPage;
     * ```
     */
    get isFirstPage() {
        return this.paginator.isLastPage;
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding method exposed by the `igx-paginator`
     *
     * Goes to the next page, if the grid is not already at the last page.
     *
     *
     * @example
     * ```typescript
     * this.grid1.nextPage();
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    nextPage() {
        this.paginator?.nextPage();
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding method exposed by the `igx-paginator`
     *
     * Goes to the previous page, if the grid is not already at the first page.
     *
     * @example
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    previousPage() {
        this.paginator?.previousPage();
    }
    /**
     * Returns the total number of records.
     *
     * @remarks
     * Only functions when paging is enabled.
     * @example
     * ```typescript
     * const totalRecords = this.grid.totalRecords;
     * ```
     */
    get totalRecords() {
        return this._totalRecords >= 0 ? this._totalRecords : this.pagingState?.metadata.countRecords;
    }
    set totalRecords(total) {
        if (total >= 0) {
            if (this.paginator) {
                this.paginator.totalRecords = total;
            }
            this._totalRecords = total;
            this.pipeTrigger++;
            this.notifyChanges();
        }
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding property exposed by the `igx-paginator`
     *
     * Returns if the current page is the last page.
     *
     *
     * @example
     * ```typescript
     * const lastPage = this.grid.isLastPage;
     * ```
     */
    get isLastPage() {
        return this.paginator.isLastPage;
    }
    /**
     * Returns the total width of the `IgxGridComponent`.
     *
     * @example
     * ```typescript
     * const gridWidth = this.grid.totalWidth;
     * ```
     */
    get totalWidth() {
        if (!isNaN(this._totalWidth)) {
            return this._totalWidth;
        }
        // Take only top level columns
        const cols = this.visibleColumns.filter(col => col.level === 0 && !col.pinned);
        let totalWidth = 0;
        let i = 0;
        for (i; i < cols.length; i++) {
            totalWidth += parseInt(cols[i].calcWidth, 10) || 0;
        }
        this._totalWidth = totalWidth;
        return totalWidth;
    }
    /**
     * @hidden
     * @internal
     */
    get showRowSelectors() {
        return this.isRowSelectable && this.hasVisibleColumns && !this.hideRowSelectors;
    }
    /**
     * @hidden
     * @internal
     */
    get showAddButton() {
        return this.rowEditable && this.dataView.length === 0 && this.columnList.length > 0;
    }
    /**
     * @hidden
     * @internal
     */
    get showDragIcons() {
        return this.rowDraggable && this.columnList.length > this.hiddenColumnsCount;
    }
    /**
     * @hidden
     * @internal
     */
    _getDataViewIndex(index) {
        let newIndex = index;
        if ((index < 0 || index >= this.dataView.length) && this.pagingMode === 1 && this.paginator.page !== 0) {
            newIndex = index - this.paginator.perPage * this.paginator.page;
        }
        else if (this.gridAPI.grid.verticalScrollContainer.isRemote) {
            newIndex = index - this.gridAPI.grid.virtualizationState.startIndex;
        }
        return newIndex;
    }
    /**
     * @hidden
     * @internal
     */
    getDataIndex(dataViewIndex) {
        let newIndex = dataViewIndex;
        if (this.gridAPI.grid.verticalScrollContainer.isRemote) {
            newIndex = dataViewIndex + this.gridAPI.grid.virtualizationState.startIndex;
        }
        return newIndex;
    }
    /**
     * Places a column before or after the specified target column.
     *
     * @example
     * ```typescript
     * grid.moveColumn(column, target);
     * ```
     */
    moveColumn(column, target, pos = DropPosition.AfterDropTarget) {
        // M.A. May 11th, 2021 #9508 Make the event cancelable
        const eventArgs = { source: column, target, cancel: false };
        this.columnMovingEnd.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (column === target || (column.level !== target.level) ||
            (column.topLevelParent !== target.topLevelParent)) {
            return;
        }
        if (column.level) {
            this._moveChildColumns(column.parent, column, target, pos);
        }
        let columnPinStateChanged;
        // pinning and unpinning will work correctly even without passing index
        // but is easier to calclulate the index here, and later use it in the pinning event args
        if (target.pinned && !column.pinned) {
            const pinnedIndex = this._pinnedColumns.indexOf(target);
            const index = pos === DropPosition.AfterDropTarget ? pinnedIndex + 1 : pinnedIndex;
            columnPinStateChanged = column.pin(index);
        }
        if (!target.pinned && column.pinned) {
            const unpinnedIndex = this._unpinnedColumns.indexOf(target);
            const index = pos === DropPosition.AfterDropTarget ? unpinnedIndex + 1 : unpinnedIndex;
            columnPinStateChanged = column.unpin(index);
        }
        if (target.pinned && column.pinned && !columnPinStateChanged) {
            this._reorderColumns(column, target, pos, this._pinnedColumns);
        }
        if (!target.pinned && !column.pinned && !columnPinStateChanged) {
            this._reorderColumns(column, target, pos, this._unpinnedColumns);
        }
        this._moveColumns(column, target, pos);
        this._columnsReordered(column);
    }
    /**
     * @deprecated in version 12.1.0. Use the corresponding method exposed by the `igx-paginator`
     *
     * Goes to the desired page index.
     *
     *
     * @example
     * ```typescript
     * this.grid1.paginate(1);
     * ```
     * @param val
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    paginate(val) {
        this.paginator?.paginate(val);
    }
    /**
     * Triggers change detection for the `IgxGridComponent`.
     * Calling markForCheck also triggers the grid pipes explicitly, resulting in all updates being processed.
     * May degrade performance if used when not needed, or if misused:
     * ```typescript
     * // DON'Ts:
     * // don't call markForCheck from inside a loop
     * // don't call markForCheck when a primitive has changed
     * grid.data.forEach(rec => {
     *  rec = newValue;
     *  grid.markForCheck();
     * });
     *
     * // DOs
     * // call markForCheck after updating a nested property
     * grid.data.forEach(rec => {
     *  rec.nestedProp1.nestedProp2 = newValue;
     * });
     * grid.markForCheck();
     * ```
     *
     * @example
     * ```typescript
     * grid.markForCheck();
     * ```
     */
    markForCheck() {
        this.pipeTrigger++;
        this.cdr.detectChanges();
    }
    /**
     * Creates a new `IgxGridRowComponent` and adds the data record to the end of the data source.
     *
     * @example
     * ```typescript
     * this.grid1.addRow(record);
     * ```
     * @param data
     */
    addRow(data) {
        // commit pending states prior to adding a row
        this.crudService.endEdit(true);
        this.gridAPI.addRowToData(data);
        this.rowAddedNotifier.next({ data });
        this.pipeTrigger++;
        this.notifyChanges();
    }
    /**
     * Removes the `IgxGridRowComponent` and the corresponding data record by primary key.
     *
     * @remarks
     * Requires that the `primaryKey` property is set.
     * The method accept rowSelector as a parameter, which is the rowID.
     * @example
     * ```typescript
     * this.grid1.deleteRow(0);
     * ```
     * @param rowSelector
     */
    deleteRow(rowSelector) {
        if (this.primaryKey !== undefined && this.primaryKey !== null) {
            return this.deleteRowById(rowSelector);
        }
    }
    /** @hidden */
    deleteRowById(rowId) {
        const args = {
            rowID: rowId,
            cancel: false,
            rowData: this.getRowData(rowId),
            oldValue: null
        };
        this.rowDelete.emit(args);
        if (args.cancel) {
            return;
        }
        const record = this.gridAPI.deleteRowById(rowId);
        if (record !== null && record !== undefined) {
            //  TODO: should we emit this when cascadeOnDelete is true for each row?!?!
            this.rowDeleted.emit({ data: record });
        }
        return record;
    }
    /**
     * Updates the `IgxGridRowComponent` and the corresponding data record by primary key.
     *
     * @remarks
     * Requires that the `primaryKey` property is set.
     * @example
     * ```typescript
     * this.gridWithPK.updateCell('Updated', 1, 'ProductName');
     * ```
     * @param value the new value which is to be set.
     * @param rowSelector corresponds to rowID.
     * @param column corresponds to column field.
     */
    updateCell(value, rowSelector, column) {
        if (this.isDefined(this.primaryKey)) {
            const col = this.columnList.toArray().find(c => c.field === column);
            if (col) {
                // Simplify
                const rowData = this.gridAPI.getRowData(rowSelector);
                const index = this.gridAPI.get_row_index_in_data(rowSelector);
                // If row passed is invalid
                if (index < 0) {
                    return;
                }
                const id = {
                    rowID: rowSelector,
                    columnID: col.index,
                    rowIndex: index
                };
                const cell = new IgxCell(id, index, col, rowData[col.field], value, rowData, this);
                this.gridAPI.update_cell(cell);
                this.cdr.detectChanges();
            }
        }
    }
    /**
     * Updates the `IgxGridRowComponent`
     *
     * @remarks
     * The row is specified by
     * rowSelector parameter and the data source record with the passed value.
     * This method will apply requested update only if primary key is specified in the grid.
     * @example
     * ```typescript
     * grid.updateRow({
     *       ProductID: 1, ProductName: 'Spearmint', InStock: true, UnitsInStock: 1, OrderDate: new Date('2005-03-21')
     *   }, 1);
     * ```
     * @param value–
     * @param rowSelector correspond to rowID
     */
    // TODO: prevent event invocation
    updateRow(value, rowSelector) {
        if (this.isDefined(this.primaryKey)) {
            const editableCell = this.crudService.cell;
            if (editableCell && editableCell.id.rowID === rowSelector) {
                this.crudService.endCellEdit();
            }
            const row = new IgxEditRow(rowSelector, -1, this.gridAPI.getRowData(rowSelector), this);
            this.gridAPI.update_row(row, value);
            // TODO: fix for #5934 and probably break for #5763
            // consider adding of third optional boolean parameter in updateRow.
            // If developer set this parameter to true we should call notifyChanges(true), and
            // vise-versa if developer set it to false we should call notifyChanges(false).
            // The parameter should default to false
            this.notifyChanges();
        }
    }
    /**
     * Returns the data that is contained in the row component.
     *
     * @remarks
     * If the primary key is not specified the row selector match the row data.
     * @example
     * ```typescript
     * const data = grid.getRowData(94741);
     * ```
     * @param rowSelector correspond to rowID
     */
    getRowData(rowSelector) {
        if (!this.primaryKey) {
            return rowSelector;
        }
        const data = this.gridAPI.get_all_data(this.transactions.enabled);
        const index = this.gridAPI.get_row_index_in_data(rowSelector);
        return index < 0 ? {} : data[index];
    }
    /**
     * Sort a single `IgxColumnComponent`.
     *
     * @remarks
     * Sort the `IgxGridComponent`'s `IgxColumnComponent` based on the provided array of sorting expressions.
     * @example
     * ```typescript
     * this.grid.sort({ fieldName: name, dir: SortingDirection.Asc, ignoreCase: false });
     * ```
     */
    sort(expression) {
        const sortingState = cloneArray(this.sortingExpressions);
        if (expression instanceof Array) {
            for (const each of expression) {
                if (each.dir === SortingDirection.None) {
                    this.gridAPI.remove_grouping_expression(each.fieldName);
                }
                this.gridAPI.prepare_sorting_expression([sortingState], each);
            }
        }
        else {
            if (expression.dir === SortingDirection.None) {
                this.gridAPI.remove_grouping_expression(expression.fieldName);
            }
            this.gridAPI.prepare_sorting_expression([sortingState], expression);
        }
        const eventArgs = { owner: this, sortingExpressions: sortingState, cancel: false };
        this.sorting.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.crudService.endEdit(false);
        if (expression instanceof Array) {
            this.gridAPI.sort_multiple(expression);
        }
        else {
            this.gridAPI.sort(expression);
        }
        requestAnimationFrame(() => this.sortingDone.emit(expression));
    }
    /**
     * Filters a single `IgxColumnComponent`.
     *
     * @example
     * ```typescript
     * public filter(term) {
     *      this.grid.filter("ProductName", term, IgxStringFilteringOperand.instance().condition("contains"));
     * }
     * ```
     * @param name
     * @param value
     * @param conditionOrExpressionTree
     * @param ignoreCase
     */
    filter(name, value, conditionOrExpressionTree, ignoreCase) {
        this.filteringService.filter(name, value, conditionOrExpressionTree, ignoreCase);
    }
    /**
     * Filters all the `IgxColumnComponent` in the `IgxGridComponent` with the same condition.
     *
     * @example
     * ```typescript
     * grid.filterGlobal('some', IgxStringFilteringOperand.instance().condition('contains'));
     * ```
     * @param value
     * @param condition
     * @param ignoreCase
     */
    filterGlobal(value, condition, ignoreCase) {
        this.filteringService.filterGlobal(value, condition, ignoreCase);
    }
    /**
     * Enables summaries for the specified column and applies your customSummary.
     *
     * @remarks
     * If you do not provide the customSummary, then the default summary for the column data type will be applied.
     * @example
     * ```typescript
     * grid.enableSummaries([{ fieldName: 'ProductName' }, { fieldName: 'ID' }]);
     * ```
     * Enable summaries for the listed columns.
     * @example
     * ```typescript
     * grid.enableSummaries('ProductName');
     * ```
     * @param rest
     */
    enableSummaries(...rest) {
        if (rest.length === 1 && Array.isArray(rest[0])) {
            this._multipleSummaries(rest[0], true);
        }
        else {
            this._summaries(rest[0], true, rest[1]);
        }
    }
    /**
     * Disable summaries for the specified column.
     *
     * @example
     * ```typescript
     * grid.disableSummaries('ProductName');
     * ```
     * @remarks
     * Disable summaries for the listed columns.
     * @example
     * ```typescript
     * grid.disableSummaries([{ fieldName: 'ProductName' }]);
     * ```
     */
    disableSummaries(...rest) {
        if (rest.length === 1 && Array.isArray(rest[0])) {
            this._disableMultipleSummaries(rest[0]);
        }
        else {
            this._summaries(rest[0], false);
        }
    }
    /**
     * If name is provided, clears the filtering state of the corresponding `IgxColumnComponent`.
     *
     * @remarks
     * Otherwise clears the filtering state of all `IgxColumnComponent`s.
     * @example
     * ```typescript
     * this.grid.clearFilter();
     * ```
     * @param name
     */
    clearFilter(name) {
        this.filteringService.clearFilter(name);
    }
    /**
     * If name is provided, clears the sorting state of the corresponding `IgxColumnComponent`.
     *
     * @remarks
     * otherwise clears the sorting state of all `IgxColumnComponent`.
     * @example
     * ```typescript
     * this.grid.clearSort();
     * ```
     * @param name
     */
    clearSort(name) {
        if (!name) {
            this.sortingExpressions = [];
            return;
        }
        if (!this.gridAPI.get_column_by_name(name)) {
            return;
        }
        this.gridAPI.clear_sort(name);
    }
    /**
     * @hidden @internal
     */
    refreshGridState(_args) {
        this.crudService.endEdit(true);
        this.selectionService.clearHeaderCBState();
        this.summaryService.clearSummaryCache();
        this.cdr.detectChanges();
    }
    // TODO: We have return values here. Move them to event args ??
    /**
     * Pins a column by field name.
     *
     * @remarks
     * Returns whether the operation is successful.
     * @example
     * ```typescript
     * this.grid.pinColumn("ID");
     * ```
     * @param columnName
     * @param index
     */
    pinColumn(columnName, index) {
        const col = columnName instanceof IgxColumnComponent ? columnName : this.getColumnByName(columnName);
        return col.pin(index);
    }
    /**
     * Unpins a column by field name. Returns whether the operation is successful.
     *
     * @example
     * ```typescript
     * this.grid.pinColumn("ID");
     * ```
     * @param columnName
     * @param index
     */
    unpinColumn(columnName, index) {
        const col = columnName instanceof IgxColumnComponent ? columnName : this.getColumnByName(columnName);
        return col.unpin(index);
    }
    /**
     * Pin the row by its id.
     *
     * @remarks
     * ID is either the primaryKey value or the data record instance.
     * @example
     * ```typescript
     * this.grid.pinRow(rowID);
     * ```
     * @param rowID The row id - primaryKey value or the data record instance.
     * @param index The index at which to insert the row in the pinned collection.
     */
    pinRow(rowID, index, row) {
        if (this._pinnedRecordIDs.indexOf(rowID) !== -1) {
            return false;
        }
        const eventArgs = {
            insertAtIndex: index,
            isPinned: true,
            rowID,
            row,
            cancel: false
        };
        this.rowPinning.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.crudService.endEdit(false);
        const insertIndex = typeof eventArgs.insertAtIndex === 'number' ? eventArgs.insertAtIndex : this._pinnedRecordIDs.length;
        this._pinnedRecordIDs.splice(insertIndex, 0, rowID);
        this.pipeTrigger++;
        if (this.gridAPI.grid) {
            this.cdr.detectChanges();
            this.rowPinned.emit(eventArgs);
        }
        return true;
    }
    /**
     * Unpin the row by its id.
     *
     * @remarks
     * ID is either the primaryKey value or the data record instance.
     * @example
     * ```typescript
     * this.grid.unpinRow(rowID);
     * ```
     * @param rowID The row id - primaryKey value or the data record instance.
     */
    unpinRow(rowID, row) {
        const index = this._pinnedRecordIDs.indexOf(rowID);
        if (index === -1) {
            return false;
        }
        const eventArgs = {
            isPinned: false,
            rowID,
            row,
            cancel: false
        };
        this.rowPinning.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.crudService.endEdit(false);
        this._pinnedRecordIDs.splice(index, 1);
        this.pipeTrigger++;
        if (this.gridAPI.grid) {
            this.cdr.detectChanges();
            this.rowPinned.emit(eventArgs);
        }
        return true;
    }
    get pinnedRowHeight() {
        const containerHeight = this.pinContainer ? this.pinContainer.nativeElement.offsetHeight : 0;
        return this.hasPinnedRecords ? containerHeight : 0;
    }
    get totalHeight() {
        return this.calcHeight ? this.calcHeight + this.pinnedRowHeight : this.calcHeight;
    }
    /**
     * Recalculates grid width/height dimensions.
     *
     * @remarks
     * Should be run when changing DOM elements dimentions manually that affect the grid's size.
     * @example
     * ```typescript
     * this.grid.reflow();
     * ```
     */
    reflow() {
        this.calculateGridSizes();
    }
    /**
     * Finds the next occurrence of a given string in the grid and scrolls to the cell if it isn't visible.
     *
     * @remarks
     * Returns how many times the grid contains the string.
     * @example
     * ```typescript
     * this.grid.findNext("financial");
     * ```
     * @param text the string to search.
     * @param caseSensitive optionally, if the search should be case sensitive (defaults to false).
     * @param exactMatch optionally, if the text should match the entire value  (defaults to false).
     */
    findNext(text, caseSensitive, exactMatch) {
        return this.find(text, 1, caseSensitive, exactMatch);
    }
    /**
     * Finds the previous occurrence of a given string in the grid and scrolls to the cell if it isn't visible.
     *
     * @remarks
     * Returns how many times the grid contains the string.
     * @example
     * ```typescript
     * this.grid.findPrev("financial");
     * ```
     * @param text the string to search.
     * @param caseSensitive optionally, if the search should be case sensitive (defaults to false).
     * @param exactMatch optionally, if the text should match the entire value (defaults to false).
     */
    findPrev(text, caseSensitive, exactMatch) {
        return this.find(text, -1, caseSensitive, exactMatch);
    }
    /**
     * Reapplies the existing search.
     *
     * @remarks
     * Returns how many times the grid contains the last search.
     * @example
     * ```typescript
     * this.grid.refreshSearch();
     * ```
     * @param updateActiveInfo
     */
    refreshSearch(updateActiveInfo, endEdit = true) {
        if (this.lastSearchInfo.searchText) {
            this.rebuildMatchCache();
            if (updateActiveInfo) {
                const activeInfo = IgxTextHighlightDirective.highlightGroupsMap.get(this.id);
                this.lastSearchInfo.matchInfoCache.forEach((match, i) => {
                    if (match.column === activeInfo.column &&
                        match.row === activeInfo.row &&
                        match.index === activeInfo.index &&
                        compareMaps(match.metadata, activeInfo.metadata)) {
                        this.lastSearchInfo.activeMatchIndex = i;
                    }
                });
            }
            return this.find(this.lastSearchInfo.searchText, 0, this.lastSearchInfo.caseSensitive, this.lastSearchInfo.exactMatch, false, endEdit);
        }
        else {
            return 0;
        }
    }
    /**
     * Removes all the highlights in the cell.
     *
     * @example
     * ```typescript
     * this.grid.clearSearch();
     * ```
     */
    clearSearch() {
        this.lastSearchInfo = {
            searchText: '',
            caseSensitive: false,
            exactMatch: false,
            activeMatchIndex: 0,
            matchInfoCache: []
        };
        this.rowList.forEach((row) => {
            if (row.cells) {
                row.cells.forEach((c) => {
                    c.clearHighlight();
                });
            }
        });
    }
    /**
     * Returns if the `IgxGridComponent` has sortable columns.
     *
     * @example
     * ```typescript
     * const sortableGrid = this.grid.hasSortableColumns;
     * ```
     */
    get hasSortableColumns() {
        return this.columnList.some((col) => col.sortable);
    }
    /**
     * Returns if the `IgxGridComponent` has editable columns.
     *
     * @example
     * ```typescript
     * const editableGrid = this.grid.hasEditableColumns;
     * ```
     */
    get hasEditableColumns() {
        return this.columnList.some((col) => col.editable);
    }
    /**
     * Returns if the `IgxGridComponent` has filterable columns.
     *
     * @example
     * ```typescript
     * const filterableGrid = this.grid.hasFilterableColumns;
     * ```
     */
    get hasFilterableColumns() {
        return this.columnList.some((col) => col.filterable);
    }
    /**
     * Returns if the `IgxGridComponent` has summarized columns.
     *
     * @example
     * ```typescript
     * const summarizedGrid = this.grid.hasSummarizedColumns;
     * ```
     */
    get hasSummarizedColumns() {
        const summarizedColumns = this.columnList.filter(col => col.hasSummary && !col.hidden);
        return summarizedColumns.length > 0;
    }
    /**
     * @hidden @internal
     */
    get rootSummariesEnabled() {
        return this.summaryCalculationMode !== GridSummaryCalculationMode.childLevelsOnly;
    }
    /**
     * @hidden @internal
     */
    get hasVisibleColumns() {
        if (this._hasVisibleColumns === undefined) {
            return this.columnList ? this.columnList.some(c => !c.hidden) : false;
        }
        return this._hasVisibleColumns;
    }
    set hasVisibleColumns(value) {
        this._hasVisibleColumns = value;
    }
    /**
     * Returns if the `IgxGridComponent` has moveable columns.
     *
     * @deprecated
     * Use `IgxGridComponent.moving` instead.
     *
     * @example
     * ```typescript
     * const movableGrid = this.grid.hasMovableColumns;
     * ```
     */
    get hasMovableColumns() {
        return this.moving;
    }
    /**
     * Returns if the `IgxGridComponent` has column groups.
     *
     * @example
     * ```typescript
     * const groupGrid = this.grid.hasColumnGroups;
     * ```
     */
    get hasColumnGroups() {
        return this._columnGroups;
    }
    /**
     * Returns if the `IgxGridComponent` has column layouts for multi-row layout definition.
     *
     * @example
     * ```typescript
     * const layoutGrid = this.grid.hasColumnLayouts;
     * ```
     */
    get hasColumnLayouts() {
        return !!this.columnList.some(col => col.columnLayout);
    }
    /**
     * @hidden @internal
     */
    get multiRowLayoutRowSize() {
        return this._multiRowLayoutRowSize;
    }
    /**
     * @hidden
     */
    get rowBasedHeight() {
        return this.dataLength * this.rowHeight;
    }
    /**
     * @hidden
     */
    get isPercentWidth() {
        return this.width && this.width.indexOf('%') !== -1;
    }
    /**
     * @hidden @internal
     */
    get isPercentHeight() {
        return this._height && this._height.indexOf('%') !== -1;
    }
    /**
     * @hidden
     */
    get defaultTargetBodyHeight() {
        const allItems = this.dataLength;
        return this.renderedRowHeight * Math.min(this._defaultTargetRecordNumber, this.paginator ? Math.min(allItems, this.paginator.perPage) : allItems);
    }
    /**
     * @hidden @internal
     * The rowHeight input is bound to min-height css prop of rows that adds a 1px border in all cases
     */
    get renderedRowHeight() {
        return this.rowHeight + 1;
    }
    /**
     * @hidden @internal
     */
    get outerWidth() {
        return this.hasVerticalScroll() ? this.calcWidth + this.scrollSize : this.calcWidth;
    }
    /**
     * @hidden @internal
     * Gets the visible content height that includes header + tbody + footer.
     */
    getVisibleContentHeight() {
        let height = this.theadRow.nativeElement.clientHeight + this.tbody.nativeElement.clientHeight;
        if (this.hasSummarizedColumns) {
            height += this.tfoot.nativeElement.clientHeight;
        }
        return height;
    }
    /**
     * @hidden @internal
     */
    getPossibleColumnWidth(baseWidth = null) {
        let computedWidth;
        if (baseWidth !== null) {
            computedWidth = baseWidth;
        }
        else {
            computedWidth = this.calcWidth ||
                parseInt(this.document.defaultView.getComputedStyle(this.nativeElement).getPropertyValue('width'), 10);
        }
        computedWidth -= this.featureColumnsWidth();
        const visibleChildColumns = this.visibleColumns.filter(c => !c.columnGroup);
        // Column layouts related
        let visibleCols = [];
        const columnBlocks = this.visibleColumns.filter(c => c.columnGroup);
        const colsPerBlock = columnBlocks.map(block => block.getInitialChildColumnSizes(block.children));
        const combinedBlocksSize = colsPerBlock.reduce((acc, item) => acc + item.length, 0);
        colsPerBlock.forEach(blockCols => visibleCols = visibleCols.concat(blockCols));
        //
        const columnsWithSetWidths = this.hasColumnLayouts ?
            visibleCols.filter(c => c.widthSetByUser) :
            visibleChildColumns.filter(c => c.widthSetByUser);
        const columnsToSize = this.hasColumnLayouts ?
            combinedBlocksSize - columnsWithSetWidths.length :
            visibleChildColumns.length - columnsWithSetWidths.length;
        const sumExistingWidths = columnsWithSetWidths
            .reduce((prev, curr) => {
            const colWidth = curr.width;
            const widthValue = parseInt(colWidth, 10);
            const currWidth = colWidth && typeof colWidth === 'string' && colWidth.indexOf('%') !== -1 ?
                widthValue / 100 * computedWidth :
                widthValue;
            return prev + currWidth;
        }, 0);
        // When all columns are hidden, return 0px width
        if (!sumExistingWidths && !columnsToSize) {
            return '0px';
        }
        const columnWidth = Math.floor(!Number.isFinite(sumExistingWidths) ?
            Math.max(computedWidth / columnsToSize, MINIMUM_COLUMN_WIDTH) :
            Math.max((computedWidth - sumExistingWidths) / columnsToSize, MINIMUM_COLUMN_WIDTH));
        return columnWidth + 'px';
    }
    /**
     * @hidden @internal
     */
    hasVerticalScroll() {
        if (this._init) {
            return false;
        }
        const isScrollable = this.verticalScrollContainer ? this.verticalScrollContainer.isScrollable() : false;
        return !!(this.calcWidth && this.dataView && this.dataView.length > 0 && isScrollable);
    }
    /**
     * Gets calculated width of the pinned area.
     *
     * @example
     * ```typescript
     * const pinnedWidth = this.grid.getPinnedWidth();
     * ```
     * @param takeHidden If we should take into account the hidden columns in the pinned area.
     */
    getPinnedWidth(takeHidden = false) {
        const fc = takeHidden ? this._pinnedColumns : this.pinnedColumns;
        let sum = 0;
        for (const col of fc) {
            if (col.level === 0) {
                sum += parseInt(col.calcWidth, 10);
            }
        }
        if (this.isPinningToStart) {
            sum += this.featureColumnsWidth();
        }
        return sum;
    }
    /**
     * @hidden @internal
     */
    isColumnGrouped(_fieldName) {
        return false;
    }
    /**
     * @hidden @internal
     * TODO: REMOVE
     */
    onHeaderSelectorClick(event) {
        if (!this.isMultiRowSelectionEnabled) {
            return;
        }
        if (this.selectionService.areAllRowSelected()) {
            this.selectionService.clearRowSelection(event);
        }
        else {
            this.selectionService.selectAllRows(event);
        }
    }
    /**
     * @hidden @internal
     */
    get headSelectorBaseAriaLabel() {
        if (this._filteringExpressionsTree.filteringOperands.length > 0) {
            return this.selectionService.areAllRowSelected() ? 'Deselect all filtered' : 'Select all filtered';
        }
        return this.selectionService.areAllRowSelected() ? 'Deselect all' : 'Select all';
    }
    /**
     * @hidden
     * @internal
     */
    get totalRowsCountAfterFilter() {
        if (this.data) {
            return this.selectionService.allData.length;
        }
        return 0;
    }
    /**
     * Returns the currently transformed paged/filtered/sorted/grouped pinned row data, displayed in the grid.
     *
     * @example
     * ```typescript
     *      const pinnedDataView = this.grid.pinnedDataView;
     * ```
     */
    get pinnedDataView() {
        return this.pinnedRecords ? this.pinnedRecords : [];
    }
    /**
     * Returns currently transformed paged/filtered/sorted/grouped unpinned row data, displayed in the grid.
     *
     * @example
     * ```typescript
     *      const pinnedDataView = this.grid.pinnedDataView;
     * ```
     */
    get unpinnedDataView() {
        return this.unpinnedRecords ? this.unpinnedRecords : this.verticalScrollContainer?.igxForOf || [];
    }
    /**
     * Returns the currently transformed paged/filtered/sorted/grouped/pinned/unpinned row data, displayed in the grid.
     *
     * @example
     * ```typescript
     *      const dataView = this.grid.dataView;
     * ```
     */
    get dataView() {
        return this._dataView;
    }
    /**
     * Gets/Sets whether clicking over a row should select/deselect it
     *
     * @remarks
     * By default it is set to true
     * @param enabled: boolean
     */
    get selectRowOnClick() {
        return this._selectRowOnClick;
    }
    set selectRowOnClick(enabled) {
        this._selectRowOnClick = enabled;
    }
    /**
     * Select specified rows by ID.
     *
     * @example
     * ```typescript
     * this.grid.selectRows([1,2,5], true);
     * ```
     * @param rowIDs
     * @param clearCurrentSelection if true clears the current selection
     */
    selectRows(rowIDs, clearCurrentSelection) {
        this.selectionService.selectRowsWithNoEvent(rowIDs, clearCurrentSelection);
        this.notifyChanges();
    }
    /**
     * Deselect specified rows by ID.
     *
     * @example
     * ```typescript
     * this.grid.deselectRows([1,2,5]);
     * ```
     * @param rowIDs
     */
    deselectRows(rowIDs) {
        this.selectionService.deselectRowsWithNoEvent(rowIDs);
        this.notifyChanges();
    }
    /**
     * Selects all rows
     *
     * @remarks
     * By default if filtering is in place, selectAllRows() and deselectAllRows() select/deselect all filtered rows.
     * If you set the parameter onlyFilterData to false that will select all rows in the grid exept deleted rows.
     * @example
     * ```typescript
     * this.grid.selectAllRows();
     * this.grid.selectAllRows(false);
     * ```
     * @param onlyFilterData
     */
    selectAllRows(onlyFilterData = true) {
        const data = onlyFilterData && this.filteredData ? this.filteredData : this.gridAPI.get_all_data(true);
        const rowIDs = this.selectionService.getRowIDs(data).filter(rID => !this.gridAPI.row_deleted_transaction(rID));
        this.selectRows(rowIDs);
    }
    /**
     * Deselects all rows
     *
     * @remarks
     * By default if filtering is in place, selectAllRows() and deselectAllRows() select/deselect all filtered rows.
     * If you set the parameter onlyFilterData to false that will deselect all rows in the grid exept deleted rows.
     * @example
     * ```typescript
     * this.grid.deselectAllRows();
     * ```
     * @param onlyFilterData
     */
    deselectAllRows(onlyFilterData = true) {
        if (onlyFilterData && this.filteredData && this.filteredData.length > 0) {
            this.deselectRows(this.selectionService.getRowIDs(this.filteredData));
        }
        else {
            this.selectionService.clearAllSelectedRows();
            this.notifyChanges();
        }
    }
    /**
     * @hidden @internal
     */
    clearCellSelection() {
        this.selectionService.clear(true);
        this.notifyChanges();
    }
    /**
     * @hidden @internal
     */
    dragScroll(delta) {
        const horizontal = this.headerContainer.getScroll();
        const vertical = this.verticalScrollContainer.getScroll();
        const { left, top } = delta;
        horizontal.scrollLeft += left * this.DRAG_SCROLL_DELTA;
        vertical.scrollTop += top * this.DRAG_SCROLL_DELTA;
    }
    /**
     * @hidden @internal
     */
    isDefined(arg) {
        return arg !== undefined && arg !== null;
    }
    /**
     * @hidden @internal
     */
    selectRange(arg) {
        if (!this.isDefined(arg)) {
            this.clearCellSelection();
            return;
        }
        if (arg instanceof Array) {
            arg.forEach(range => this.setSelection(range));
        }
        else {
            this.setSelection(arg);
        }
        this.notifyChanges();
    }
    /**
     * @hidden @internal
     */
    columnToVisibleIndex(field) {
        const visibleColumns = this.visibleColumns;
        if (typeof field === 'number') {
            return field;
        }
        return visibleColumns.find(column => column.field === field).visibleIndex;
    }
    /**
     * @hidden @internal
     */
    setSelection(range) {
        const startNode = { row: range.rowStart, column: this.columnToVisibleIndex(range.columnStart) };
        const endNode = { row: range.rowEnd, column: this.columnToVisibleIndex(range.columnEnd) };
        this.selectionService.pointerState.node = startNode;
        this.selectionService.selectRange(endNode, this.selectionService.pointerState);
        this.selectionService.addRangeMeta(endNode, this.selectionService.pointerState);
        this.selectionService.initPointerState();
    }
    /**
     * @hidden @internal
     */
    getSelectedRanges() {
        return this.selectionService.ranges;
    }
    /**
     *
     * Returns an array of the current cell selection in the form of `[{ column.field: cell.value }, ...]`.
     *
     * @remarks
     * If `formatters` is enabled, the cell value will be formatted by its respective column formatter (if any).
     * If `headers` is enabled, it will use the column header (if any) instead of the column field.
     */
    getSelectedData(formatters = false, headers = false) {
        const source = this.filteredSortedData;
        return this.extractDataFromSelection(source, formatters, headers);
    }
    /**
     * Get current selected columns.
     *
     * @example
     * Returns an array with selected columns
     * ```typescript
     * const selectedColumns = this.grid.selectedColumns();
     * ```
     */
    selectedColumns() {
        const fields = this.selectionService.getSelectedColumns();
        return fields.map(field => this.getColumnByName(field)).filter(field => field);
    }
    /**
     * Select specified columns.
     *
     * @example
     * ```typescript
     * this.grid.selectColumns(['ID','Name'], true);
     * ```
     * @param columns
     * @param clearCurrentSelection if true clears the current selection
     */
    selectColumns(columns, clearCurrentSelection) {
        let fieldToSelect = [];
        if (columns.length === 0 || typeof columns[0] === 'string') {
            fieldToSelect = columns;
        }
        else {
            columns.forEach(col => {
                if (col.columnGroup) {
                    const children = col.allChildren.filter(c => !c.columnGroup).map(c => c.field);
                    fieldToSelect = [...fieldToSelect, ...children];
                }
                else {
                    fieldToSelect.push(col.field);
                }
            });
        }
        this.selectionService.selectColumnsWithNoEvent(fieldToSelect, clearCurrentSelection);
        this.notifyChanges();
    }
    /**
     * Deselect specified columns by field.
     *
     * @example
     * ```typescript
     * this.grid.deselectColumns(['ID','Name']);
     * ```
     * @param columns
     */
    deselectColumns(columns) {
        let fieldToDeselect = [];
        if (columns.length === 0 || typeof columns[0] === 'string') {
            fieldToDeselect = columns;
        }
        else {
            columns.forEach(col => {
                if (col.columnGroup) {
                    const children = col.allChildren.filter(c => !c.columnGroup).map(c => c.field);
                    fieldToDeselect = [...fieldToDeselect, ...children];
                }
                else {
                    fieldToDeselect.push(col.field);
                }
            });
        }
        this.selectionService.deselectColumnsWithNoEvent(fieldToDeselect);
        this.notifyChanges();
    }
    /**
     * Deselects all columns
     *
     * @example
     * ```typescript
     * this.grid.deselectAllColumns();
     * ```
     */
    deselectAllColumns() {
        this.selectionService.clearAllSelectedColumns();
        this.notifyChanges();
    }
    /**
     * Selects all columns
     *
     * @example
     * ```typescript
     * this.grid.deselectAllColumns();
     * ```
     */
    selectAllColumns() {
        this.selectColumns(this.columnList.filter(c => !c.columnGroup));
    }
    /**
     *
     * Returns an array of the current columns selection in the form of `[{ column.field: cell.value }, ...]`.
     *
     * @remarks
     * If `formatters` is enabled, the cell value will be formatted by its respective column formatter (if any).
     * If `headers` is enabled, it will use the column header (if any) instead of the column field.
     */
    getSelectedColumnsData(formatters = false, headers = false) {
        const source = this.filteredSortedData ? this.filteredSortedData : this.data;
        return this.extractDataFromColumnsSelection(source, formatters, headers);
    }
    combineSelectedCellAndColumnData(columnData, formatters = false, headers = false) {
        const source = this.filteredSortedData;
        return this.extractDataFromSelection(source, formatters, headers, columnData);
    }
    /**
     * @hidden
     * @internal
     */
    copyHandler(event) {
        const selectedColumns = this.gridAPI.grid.selectedColumns();
        const columnData = this.getSelectedColumnsData(this.clipboardOptions.copyFormatters, this.clipboardOptions.copyHeaders);
        let selectedData;
        if (event.type === 'copy') {
            selectedData = this.getSelectedData(this.clipboardOptions.copyFormatters, this.clipboardOptions.copyHeaders);
        }
        ;
        let data = [];
        let result;
        if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey) && event.currentTarget.className === 'igx-grid-thead__wrapper') {
            if (selectedData.length) {
                if (columnData.length === 0) {
                    result = this.prepareCopyData(event, selectedData);
                }
                else {
                    data = this.combineSelectedCellAndColumnData(columnData, this.clipboardOptions.copyFormatters, this.clipboardOptions.copyHeaders);
                    result = this.prepareCopyData(event, data[0], data[1]);
                }
            }
            else {
                data = columnData;
                result = this.prepareCopyData(event, data);
            }
            navigator.clipboard.writeText(result).then().catch(e => console.error(e));
        }
        else if (!this.clipboardOptions.enabled || this.crudService.cellInEditMode || event.type === 'keydown') {
            return;
        }
        else {
            if (selectedColumns.length) {
                data = this.combineSelectedCellAndColumnData(columnData, this.clipboardOptions.copyFormatters, this.clipboardOptions.copyHeaders);
                result = this.prepareCopyData(event, data[0], data[1]);
            }
            else {
                data = selectedData;
                result = this.prepareCopyData(event, data);
            }
            event.clipboardData.setData('text/plain', result);
        }
    }
    /**
     * @hidden @internal
     */
    prepareCopyData(event, data, keys) {
        const ev = { data, cancel: false };
        this.gridCopy.emit(ev);
        if (ev.cancel) {
            return;
        }
        const transformer = new CharSeparatedValueData(ev.data, this.clipboardOptions.separator);
        let result = keys ? transformer.prepareData(keys) : transformer.prepareData();
        if (!this.clipboardOptions.copyHeaders) {
            result = result.substring(result.indexOf('\n') + 1);
        }
        if (data && data.length > 0 && Object.values(data[0]).length === 1) {
            result = result.slice(0, -2);
        }
        event.preventDefault();
        /* Necessary for the hiearachical case but will probably have to
           change how getSelectedData is propagated in the hiearachical grid
        */
        event.stopPropagation();
        return result;
    }
    /**
     * @hidden @internal
     */
    showSnackbarFor(index) {
        this.addRowSnackbar.actionText = index === -1 ? '' : this.snackbarActionText;
        this.lastAddedRowIndex = index;
        this.addRowSnackbar.open();
    }
    /**
     * Navigates to a position in the grid based on provided `rowindex` and `visibleColumnIndex`.
     *
     * @remarks
     * Also can execute a custom logic over the target element,
     * through a callback function that accepts { targetType: GridKeydownTargetType, target: Object }
     * @example
     * ```typescript
     *  this.grid.navigateTo(10, 3, (args) => { args.target.nativeElement.focus(); });
     * ```
     */
    navigateTo(rowIndex, visibleColIndex = -1, cb = null) {
        const totalItems = this.totalItemCount ?? this.dataView.length - 1;
        if (rowIndex < 0 || rowIndex > totalItems || (visibleColIndex !== -1
            && this.columnList.map(col => col.visibleIndex).indexOf(visibleColIndex) === -1)) {
            return;
        }
        if (this.dataView.slice(rowIndex, rowIndex + 1).find(rec => rec.expression || rec.childGridsData)) {
            visibleColIndex = -1;
        }
        // If the target row is pinned no need to scroll as well.
        const shouldScrollVertically = this.navigation.shouldPerformVerticalScroll(rowIndex, visibleColIndex);
        const shouldScrollHorizontally = this.navigation.shouldPerformHorizontalScroll(visibleColIndex, rowIndex);
        if (shouldScrollVertically) {
            this.navigation.performVerticalScrollToCell(rowIndex, visibleColIndex, () => {
                if (shouldScrollHorizontally) {
                    this.navigation.performHorizontalScrollToCell(visibleColIndex, () => this.executeCallback(rowIndex, visibleColIndex, cb));
                }
                else {
                    this.executeCallback(rowIndex, visibleColIndex, cb);
                }
            });
        }
        else if (shouldScrollHorizontally) {
            this.navigation.performHorizontalScrollToCell(visibleColIndex, () => {
                if (shouldScrollVertically) {
                    this.navigation.performVerticalScrollToCell(rowIndex, visibleColIndex, () => this.executeCallback(rowIndex, visibleColIndex, cb));
                }
                else {
                    this.executeCallback(rowIndex, visibleColIndex, cb);
                }
            });
        }
        else {
            this.executeCallback(rowIndex, visibleColIndex, cb);
        }
    }
    /**
     * Returns `ICellPosition` which defines the next cell,
     * according to the current position, that match specific criteria.
     *
     * @remarks
     * You can pass callback function as a third parameter of `getPreviousCell` method.
     * The callback function accepts IgxColumnComponent as a param
     * @example
     * ```typescript
     *  const nextEditableCellPosition = this.grid.getNextCell(0, 3, (column) => column.editable);
     * ```
     */
    getNextCell(currRowIndex, curVisibleColIndex, callback = null) {
        const columns = this.columnList.filter(col => !col.columnGroup && col.visibleIndex >= 0);
        const dataViewIndex = this._getDataViewIndex(currRowIndex);
        if (!this.isValidPosition(dataViewIndex, curVisibleColIndex)) {
            return { rowIndex: currRowIndex, visibleColumnIndex: curVisibleColIndex };
        }
        const colIndexes = callback ? columns.filter((col) => callback(col)).map(editCol => editCol.visibleIndex).sort((a, b) => a - b) :
            columns.map(editCol => editCol.visibleIndex).sort((a, b) => a - b);
        const nextCellIndex = colIndexes.find(index => index > curVisibleColIndex);
        if (this.dataView.slice(dataViewIndex, dataViewIndex + 1)
            .find(rec => !rec.expression && !rec.summaries && !rec.childGridsData && !rec.detailsData) && nextCellIndex !== undefined) {
            return { rowIndex: currRowIndex, visibleColumnIndex: nextCellIndex };
        }
        else {
            const nextIndex = this.getNextDataRowIndex(currRowIndex);
            if (colIndexes.length === 0 || nextIndex === currRowIndex) {
                return { rowIndex: currRowIndex, visibleColumnIndex: curVisibleColIndex };
            }
            else {
                return { rowIndex: nextIndex, visibleColumnIndex: colIndexes[0] };
            }
        }
    }
    /**
     * Returns `ICellPosition` which defines the previous cell,
     * according to the current position, that match specific criteria.
     *
     * @remarks
     * You can pass callback function as a third parameter of `getPreviousCell` method.
     * The callback function accepts IgxColumnComponent as a param
     * @example
     * ```typescript
     *  const previousEditableCellPosition = this.grid.getPreviousCell(0, 3, (column) => column.editable);
     * ```
     */
    getPreviousCell(currRowIndex, curVisibleColIndex, callback = null) {
        const columns = this.columnList.filter(col => !col.columnGroup && col.visibleIndex >= 0);
        const dataViewIndex = this._getDataViewIndex(currRowIndex);
        if (!this.isValidPosition(dataViewIndex, curVisibleColIndex)) {
            return { rowIndex: currRowIndex, visibleColumnIndex: curVisibleColIndex };
        }
        const colIndexes = callback ? columns.filter((col) => callback(col)).map(editCol => editCol.visibleIndex).sort((a, b) => b - a) :
            columns.map(editCol => editCol.visibleIndex).sort((a, b) => b - a);
        const prevCellIndex = colIndexes.find(index => index < curVisibleColIndex);
        if (this.dataView.slice(dataViewIndex, dataViewIndex + 1)
            .find(rec => !rec.expression && !rec.summaries && !rec.childGridsData && !rec.detailsData) && prevCellIndex !== undefined) {
            return { rowIndex: currRowIndex, visibleColumnIndex: prevCellIndex };
        }
        else {
            const prevIndex = this.getNextDataRowIndex(currRowIndex, true);
            if (colIndexes.length === 0 || prevIndex === currRowIndex) {
                return { rowIndex: currRowIndex, visibleColumnIndex: curVisibleColIndex };
            }
            else {
                return { rowIndex: prevIndex, visibleColumnIndex: colIndexes[0] };
            }
        }
    }
    /**
     * @hidden
     * @internal
     */
    endRowEditTabStop(commit = true, event) {
        const canceled = this.crudService.endEdit(commit, event);
        if (canceled) {
            return true;
        }
        const activeCell = this.gridAPI.grid.navigation.activeNode;
        if (activeCell && activeCell.row !== -1) {
            this.tbody.nativeElement.focus();
        }
    }
    /**
     * @hidden @internal
     */
    trackColumnChanges(index, col) {
        return col.field + col._calcWidth;
    }
    /**
     * @hidden
     */
    isExpandedGroup(_group) {
        return undefined;
    }
    /**
     * @hidden @internal
     * TODO: MOVE to CRUD
     */
    openRowOverlay(id) {
        this.configureRowEditingOverlay(id, this.rowList.length <= MIN_ROW_EDITING_COUNT_THRESHOLD);
        this.rowEditingOverlay.open(this.rowEditSettings);
        this.rowEditingOverlay.element.addEventListener('wheel', this.rowEditingWheelHandler.bind(this));
    }
    /**
     * @hidden @internal
     */
    closeRowEditingOverlay() {
        this.rowEditingOverlay.element.removeEventListener('wheel', this.rowEditingWheelHandler);
        this.rowEditPositioningStrategy.isTopInitialPosition = null;
        this.rowEditingOverlay.close();
        this.rowEditingOverlay.element.parentElement.style.display = '';
    }
    /**
     * @hidden @internal
     */
    toggleRowEditingOverlay(show) {
        const rowStyle = this.rowEditingOverlay.element.style;
        if (show) {
            rowStyle.display = 'block';
        }
        else {
            rowStyle.display = 'none';
        }
    }
    /**
     * @hidden @internal
     */
    repositionRowEditingOverlay(row) {
        if (row && !this.rowEditingOverlay.collapsed) {
            const rowStyle = this.rowEditingOverlay.element.parentElement.style;
            if (row) {
                rowStyle.display = '';
                this.configureRowEditingOverlay(row.key);
                this.rowEditingOverlay.reposition();
            }
            else {
                rowStyle.display = 'none';
            }
        }
    }
    /**
     * @hidden @internal
     */
    cachedViewLoaded(args) {
        if (this.hasHorizontalScroll()) {
            const tmplId = args.context.templateID.type;
            const index = args.context.index;
            args.view.detectChanges();
            this.zone.onStable.pipe(first()).subscribe(() => {
                const row = tmplId === 'dataRow' ? this.gridAPI.get_row_by_index(index) : null;
                const summaryRow = tmplId === 'summaryRow' ? this.summariesRowList.find((sr) => sr.dataRowIndex === index) : null;
                if (row && row instanceof IgxRowDirective) {
                    this._restoreVirtState(row);
                }
                else if (summaryRow) {
                    this._restoreVirtState(summaryRow);
                }
            });
        }
    }
    /**
     * Opens the advanced filtering dialog.
     */
    openAdvancedFilteringDialog(overlaySettings) {
        const settings = overlaySettings ? overlaySettings : this._advancedFilteringOverlaySettings;
        if (!this._advancedFilteringOverlayId) {
            this._advancedFilteringOverlaySettings.target =
                this.rootGrid ? this.rootGrid.nativeElement : this.nativeElement;
            this._advancedFilteringOverlaySettings.outlet = this.outlet;
            this._advancedFilteringOverlayId = this.overlayService.attach(IgxAdvancedFilteringDialogComponent, settings, {
                injector: this.viewRef.injector,
                componentFactoryResolver: this.resolver
            });
            this.overlayService.show(this._advancedFilteringOverlayId);
        }
    }
    /**
     * Closes the advanced filtering dialog.
     *
     * @param applyChanges indicates whether the changes should be applied
     */
    closeAdvancedFilteringDialog(applyChanges) {
        if (this._advancedFilteringOverlayId) {
            const advancedFilteringOverlay = this.overlayService.getOverlayById(this._advancedFilteringOverlayId);
            const advancedFilteringDialog = advancedFilteringOverlay.componentRef.instance;
            if (applyChanges) {
                advancedFilteringDialog.applyChanges();
            }
            advancedFilteringDialog.closeDialog();
        }
    }
    /**
     * @hidden @internal
     */
    getEmptyRecordObjectFor(inRow) {
        const row = { ...inRow?.data };
        Object.keys(row).forEach(key => row[key] = undefined);
        const id = this.generateRowID();
        row[this.primaryKey] = id;
        return { rowID: id, data: row, recordRef: row };
    }
    /**
     * @hidden @internal
     */
    hasHorizontalScroll() {
        return this.totalWidth - this.unpinnedWidth > 0;
    }
    /**
     * @hidden @internal
     */
    isSummaryRow(rowData) {
        return rowData && rowData.summaries && (rowData.summaries instanceof Map);
    }
    /**
     * @hidden @internal
     */
    triggerPipes() {
        this.pipeTrigger++;
        this.cdr.detectChanges();
    }
    /**
     * @hidden
     */
    rowEditingWheelHandler(event) {
        if (event.deltaY > 0) {
            this.verticalScrollContainer.scrollNext();
        }
        else {
            this.verticalScrollContainer.scrollPrev();
        }
    }
    /**
     * @hidden
     */
    getUnpinnedIndexById(id) {
        return this.unpinnedRecords.findIndex(x => x[this.primaryKey] === id);
    }
    /**
     * Finishes the row transactions on the current row.
     *
     * @remarks
     * If `commit === true`, passes them from the pending state to the data (or transaction service)
     * @example
     * ```html
     * <button igxButton (click)="grid.endEdit(true)">Commit Row</button>
     * ```
     * @param commit
     */
    // TODO: Facade for crud service refactoring. To be removed
    // TODO: do not remove this, as it is used in rowEditTemplate, but mark is as internal and hidden
    endEdit(commit = true, event) {
        this.crudService.endEdit(commit, event);
    }
    /**
     * Enters add mode by spawning the UI under the specified row by rowID.
     *
     * @remarks
     * If null is passed as rowID, the row adding UI is spawned as the first record in the data view
     * @remarks
     * Spawning the UI to add a child for a record only works if you provide a rowID
     * @example
     * ```typescript
     * this.grid.beginAddRowById('ALFKI');
     * this.grid.beginAddRowById('ALFKI', true);
     * this.grid.beginAddRowById(null);
     * ```
     * @param rowID - The rowID to spawn the add row UI for, or null to spawn it as the first record in the data view
     * @param asChild - Whether the record should be added as a child. Only applicable to igxTreeGrid.
     */
    beginAddRowById(rowID, asChild) {
        let index = rowID;
        if (rowID == null) {
            if (asChild) {
                console.warn('The record cannot be added as a child to an unspecified record.');
                return;
            }
            index = null;
        }
        else {
            // find the index of the record with that PK
            index = this.gridAPI.get_rec_index_by_id(rowID, this.dataView);
            if (index === -1) {
                console.warn('No row with the specified ID was found.');
                return;
            }
        }
        this._addRowForIndex(index, asChild);
    }
    _addRowForIndex(index, asChild) {
        if (!this.dataView.length) {
            this.beginAddRowForIndex(index, asChild);
            return;
        }
        // check if the index is valid - won't support anything outside the data view
        if (index >= 0 && index < this.dataView.length) {
            // check if the index is in the view port
            if ((index < this.virtualizationState.startIndex ||
                index >= this.virtualizationState.startIndex + this.virtualizationState.chunkSize) &&
                !this.isRecordPinnedByViewIndex(index)) {
                this.verticalScrollContainer.chunkLoad
                    .pipe(first(), takeUntil(this.destroy$))
                    .subscribe(() => {
                    this.beginAddRowForIndex(index, asChild);
                });
                this.navigateTo(index);
                this.notifyChanges(true);
                return;
            }
            this.beginAddRowForIndex(index, asChild);
        }
        else {
            console.warn('The row with the specified PK or index is outside of the current data view.');
        }
    }
    /**
     * Enters add mode by spawning the UI at the specified index.
     *
     * @remarks
     * Accepted values for index are integers from 0 to this.grid.dataView.length
     * @example
     * ```typescript
     * this.grid.beginAddRowByIndex(0);
     * ```
     * @param index - The index to spawn the UI at. Accepts integers from 0 to this.grid.dataView.length
     */
    beginAddRowByIndex(index) {
        if (index === 0) {
            return this.beginAddRowById(null);
        }
        return this._addRowForIndex(index - 1);
    }
    /**
     * @hidden
     */
    preventHeaderScroll(args) {
        if (args.target.scrollLeft !== 0) {
            this.navigation.forOfDir().getScroll().scrollLeft = args.target.scrollLeft;
            args.target.scrollLeft = 0;
        }
    }
    beginAddRowForIndex(index, asChild = false) {
        // TODO is row from rowList suitable for enterAddRowMode
        const row = index == null ?
            null : this.rowList.find(r => r.index === index);
        if (row !== undefined) {
            this.crudService.enterAddRowMode(row, asChild);
        }
        else {
            console.warn('No row with the specified PK or index was found.');
        }
    }
    switchTransactionService(val) {
        if (val) {
            this._transactions = this.transactionFactory.create("Base" /* Base */);
        }
        else {
            this._transactions = this.transactionFactory.create("None" /* None */);
        }
        if (this.dataCloneStrategy) {
            this._transactions.cloneStrategy = this.dataCloneStrategy;
        }
    }
    subscribeToTransactions() {
        this.transactionChange$.next();
        this.transactions.onStateUpdate.pipe(takeUntil(merge(this.destroy$, this.transactionChange$)))
            .subscribe(this.transactionStatusUpdate.bind(this));
    }
    transactionStatusUpdate(event) {
        let actions = [];
        if (event.origin === TransactionEventOrigin.REDO) {
            actions = event.actions ? event.actions.filter(x => x.transaction.type === TransactionType.DELETE) : [];
        }
        else if (event.origin === TransactionEventOrigin.UNDO) {
            actions = event.actions ? event.actions.filter(x => x.transaction.type === TransactionType.ADD) : [];
        }
        if (actions.length > 0) {
            for (const action of actions) {
                if (this.selectionService.isRowSelected(action.transaction.id)) {
                    this.selectionService.deselectRow(action.transaction.id);
                }
            }
        }
        this.selectionService.clearHeaderCBState();
        this.summaryService.clearSummaryCache();
        this.pipeTrigger++;
        this.notifyChanges();
    }
    ;
    writeToData(rowIndex, value) {
        mergeObjects(this.gridAPI.get_all_data()[rowIndex], value);
    }
    _restoreVirtState(row) {
        // check virtualization state of data record added from cache
        // in case state is no longer valid - update it.
        const rowForOf = row.virtDirRow;
        const gridScrLeft = rowForOf.getScroll().scrollLeft;
        const left = -parseInt(rowForOf.dc.instance._viewContainer.element.nativeElement.style.left, 10);
        const actualScrollLeft = left + rowForOf.getColumnScrollLeft(rowForOf.state.startIndex);
        if (gridScrLeft !== actualScrollLeft) {
            rowForOf.onHScroll(gridScrLeft);
            rowForOf.cdr.detectChanges();
        }
    }
    changeRowEditingOverlayStateOnScroll(row) {
        if (!this.rowEditable || !this.rowEditingOverlay || this.rowEditingOverlay.collapsed) {
            return;
        }
        if (!row) {
            this.toggleRowEditingOverlay(false);
        }
        else {
            this.repositionRowEditingOverlay(row);
        }
    }
    /**
     * Should be called when data and/or isLoading input changes so that the overlay can be
     * hidden/shown based on the current value of shouldOverlayLoading
     */
    evaluateLoadingState() {
        if (this.shouldOverlayLoading) {
            // a new overlay should be shown
            const overlaySettings = {
                outlet: this.loadingOutlet,
                closeOnOutsideClick: false,
                positionStrategy: new ContainerPositionStrategy()
            };
            this.loadingOverlay.open(overlaySettings);
        }
        else {
            this.loadingOverlay.close();
        }
    }
    /**
     * @hidden
     * Sets grid width i.e. this.calcWidth
     */
    calculateGridWidth() {
        let width;
        if (this.isPercentWidth) {
            /* width in %*/
            const computed = this.document.defaultView.getComputedStyle(this.nativeElement).getPropertyValue('width');
            width = computed.indexOf('%') === -1 ? parseInt(computed, 10) : null;
        }
        else {
            width = parseInt(this.width, 10);
        }
        if (!width && this.nativeElement) {
            width = this.nativeElement.offsetWidth;
        }
        if (this.width === null || !width) {
            width = this.getColumnWidthSum();
        }
        if (this.hasVerticalScroll() && this.width !== null) {
            width -= this.scrollSize;
        }
        if ((Number.isFinite(width) || width === null) && width !== this.calcWidth) {
            this.calcWidth = width;
        }
        this._derivePossibleWidth();
    }
    /**
     * @hidden
     * Sets columns defaultWidth property
     */
    _derivePossibleWidth() {
        if (!this.columnWidthSetByUser) {
            this._columnWidth = this.width !== null ? this.getPossibleColumnWidth() : MINIMUM_COLUMN_WIDTH + 'px';
        }
        this.columnList.forEach((column) => {
            if (this.hasColumnLayouts && parseInt(this._columnWidth, 10)) {
                const columnWidthCombined = parseInt(this._columnWidth, 10) * (column.colEnd ? column.colEnd - column.colStart : 1);
                column.defaultWidth = columnWidthCombined + 'px';
            }
            else {
                // D.K. March 29th, 2021 #9145 Consider min/max width when setting defaultWidth property
                column.defaultWidth = this.getExtremumBasedColWidth(column);
                column.resetCaches();
            }
        });
        this.resetCachedWidths();
    }
    /**
     * @hidden
     * @internal
     */
    getExtremumBasedColWidth(column) {
        let width = this._columnWidth;
        if (width && typeof width !== 'string') {
            width = String(width);
        }
        const minWidth = width.indexOf('%') === -1 ? column.minWidthPx : column.minWidthPercent;
        const maxWidth = width.indexOf('%') === -1 ? column.maxWidthPx : column.maxWidthPercent;
        if (column.hidden) {
            return width;
        }
        if (minWidth > parseFloat(width)) {
            width = String(column.minWidth);
        }
        else if (maxWidth < parseFloat(width)) {
            width = String(column.maxWidth);
        }
        // if no px or % are defined in maxWidth/minWidth consider it px
        if (width.indexOf('%') === -1 && width.indexOf('px') === -1) {
            width += 'px';
        }
        return width;
    }
    resetNotifyChanges() {
        this._cdrRequestRepaint = false;
        this._cdrRequests = false;
    }
    /** @hidden @internal */
    resolveOutlet() {
        return this._userOutletDirective ? this._userOutletDirective : this._outletDirective;
    }
    /**
     * Reorder columns in the main columnList and _columns collections.
     *
     * @hidden
     */
    _moveColumns(from, to, pos) {
        const list = this.columnList.toArray();
        this._reorderColumns(from, to, pos, list);
        const newList = this._resetColumnList(list);
        this.updateColumns(newList);
    }
    /**
     * Update internal column's collection.
     * @hidden
     */
    updateColumns(newColumns) {
        // update internal collections to retain order.
        this._pinnedColumns = newColumns
            .filter((c) => c.pinned).sort((a, b) => this._pinnedColumns.indexOf(a) - this._pinnedColumns.indexOf(b));
        this._unpinnedColumns = newColumns.filter((c) => !c.pinned);
        this.columnList.reset(newColumns);
        this.columnList.notifyOnChanges();
        this._columns = this.columnList.toArray();
    }
    /**
     * @hidden
     */
    _resetColumnList(list) {
        if (!list) {
            list = this.columnList.toArray();
        }
        let newList = [];
        list.filter(c => c.level === 0).forEach(p => {
            newList.push(p);
            if (p.columnGroup) {
                newList = newList.concat(p.allChildren);
            }
        });
        return newList;
    }
    /**
     * Reorders columns inside the passed column collection.
     * When reordering column group collection, the collection is not flattened.
     * In all other cases, the columns collection is flattened, this is why adittional calculations on the dropIndex are done.
     *
     * @hidden
     */
    _reorderColumns(from, to, position, columnCollection, inGroup = false) {
        const fromIndex = columnCollection.indexOf(from);
        const childColumnsCount = inGroup ? 1 : from.allChildren.length + 1;
        columnCollection.splice(fromIndex, childColumnsCount);
        let dropIndex = columnCollection.indexOf(to);
        if (position === DropPosition.AfterDropTarget) {
            dropIndex++;
            if (!inGroup && to.columnGroup) {
                dropIndex += to.allChildren.length;
            }
        }
        columnCollection.splice(dropIndex, 0, from);
    }
    /**
     * Reorder column group collection.
     *
     * @hidden
     */
    _moveChildColumns(parent, from, to, pos) {
        const buffer = parent.children.toArray();
        this._reorderColumns(from, to, pos, buffer, true);
        parent.children.reset(buffer);
    }
    /**
     * @hidden @internal
     */
    setupColumns() {
        if (this.autoGenerate) {
            this.autogenerateColumns();
        }
        this.initColumns(this.columnList, (col) => this.columnInit.emit(col));
        this.columnListDiffer.diff(this.columnList);
        this.columnList.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((change) => {
            this.onColumnsChanged(change);
        });
    }
    /**
     * @hidden
     */
    deleteRowFromData(rowID, index) {
        //  if there is a row (index !== 0) delete it
        //  if there is a row in ADD or UPDATE state change it's state to DELETE
        if (index !== -1) {
            if (this.transactions.enabled) {
                const transaction = { id: rowID, type: TransactionType.DELETE, newValue: null };
                this.transactions.add(transaction, this.data[index]);
            }
            else {
                this.data.splice(index, 1);
            }
        }
        else {
            const state = this.transactions.getState(rowID);
            this.transactions.add({ id: rowID, type: TransactionType.DELETE, newValue: null }, state && state.recordRef);
        }
    }
    /**
     * @hidden @internal
     */
    getDataBasedBodyHeight() {
        return !this.data || (this.data.length < this._defaultTargetRecordNumber) ?
            0 : this.defaultTargetBodyHeight;
    }
    /**
     * @hidden @internal
     */
    onPinnedRowsChanged(change) {
        const diff = this.rowListDiffer.diff(change);
        if (diff) {
            this.notifyChanges(true);
        }
    }
    /**
     * @hidden
     */
    onColumnsChanged(change) {
        const diff = this.columnListDiffer.diff(change);
        if (this.autoGenerate && this.columnList.length === 0 && this._autoGeneratedCols.length > 0) {
            // In Ivy if there are nested conditional templates the content children are re-evaluated
            // hence autogenerated columns are cleared and need to be reset.
            this.columnList.reset(this._autoGeneratedCols);
            return;
        }
        if (diff) {
            let added = false;
            let removed = false;
            diff.forEachAddedItem((record) => {
                added = true;
                if (record.item.pinned) {
                    this._pinnedColumns.push(record.item);
                }
                else {
                    this._unpinnedColumns.push(record.item);
                }
            });
            this.initColumns(this.columnList, (col) => this.columnInit.emit(col));
            diff.forEachRemovedItem((record) => {
                const isColumnGroup = record.item instanceof IgxColumnGroupComponent;
                if (!isColumnGroup) {
                    // Clear Grouping
                    this.gridAPI.clear_groupby(record.item.field);
                    // Clear Filtering
                    this.filteringService.clear_filter(record.item.field);
                    // Close filter row
                    if (this.filteringService.isFilterRowVisible
                        && this.filteringService.filteredColumn
                        && this.filteringService.filteredColumn.field === record.item.field) {
                        this.filteringRow.close();
                    }
                    // Clear Sorting
                    this.gridAPI.clear_sort(record.item.field);
                    // Remove column selection
                    this.selectionService.deselectColumnsWithNoEvent([record.item.field]);
                }
                removed = true;
            });
            this.resetCaches();
            if (added || removed) {
                this.summaryService.clearSummaryCache();
                Promise.resolve().then(() => {
                    // `onColumnsChanged` can be executed midway a current detectChange cycle and markForCheck will be ignored then.
                    // This ensures that we will wait for the current cycle to end so we can trigger a new one and ngDoCheck to fire.
                    this.notifyChanges(true);
                });
            }
        }
    }
    /**
     * @hidden
     */
    calculateGridSizes(recalcFeatureWidth = true) {
        /*
            TODO: (R.K.) This layered lasagne should be refactored
            ASAP. The reason I have to reset the caches so many times is because
            after teach `detectChanges` call they are filled with invalid
            state. Of course all of this happens midway through the grid
            sizing process which of course, uses values from the caches, thus resulting
            in a broken layout.
        */
        this.resetCaches(recalcFeatureWidth);
        this.cdr.detectChanges();
        const hasScroll = this.hasVerticalScroll();
        this.calculateGridWidth();
        this.resetCaches(recalcFeatureWidth);
        this.cdr.detectChanges();
        this.calculateGridHeight();
        if (this.rowEditable) {
            this.repositionRowEditingOverlay(this.crudService.rowInEditMode);
        }
        if (this.filteringService.isFilterRowVisible) {
            this.filteringRow.resetChipsArea();
        }
        this.cdr.detectChanges();
        // in case scrollbar has appeared recalc to size correctly.
        if (hasScroll !== this.hasVerticalScroll()) {
            this.calculateGridWidth();
            this.cdr.detectChanges();
        }
        if (this.zone.isStable) {
            this.zone.run(() => {
                this._applyWidthHostBinding();
                this.cdr.detectChanges();
            });
        }
        else {
            this.zone.onStable.pipe(first()).subscribe(() => {
                this.zone.run(() => {
                    this._applyWidthHostBinding();
                });
            });
        }
        this.resetCaches(recalcFeatureWidth);
    }
    /**
     * @hidden
     * @internal
     */
    calcGridHeadRow() {
        if (this.maxLevelHeaderDepth) {
            this._baseFontSize = parseFloat(getComputedStyle(this.document.documentElement).getPropertyValue('font-size'));
            let minSize = (this.maxLevelHeaderDepth + 1) * this.defaultRowHeight / this._baseFontSize;
            if (this._allowFiltering && this._filterMode === FilterMode.quickFilter) {
                minSize += (FILTER_ROW_HEIGHT + 1) / this._baseFontSize;
            }
            this.theadRow.nativeElement.style.minHeight = `${minSize}rem`;
        }
    }
    /**
     * @hidden
     * Sets TBODY height i.e. this.calcHeight
     */
    calculateGridHeight() {
        this.calcGridHeadRow();
        this.calcHeight = this._calculateGridBodyHeight();
        if (this.pinnedRowHeight && this.calcHeight) {
            this.calcHeight -= this.pinnedRowHeight;
        }
    }
    /**
     * @hidden
     */
    getGroupAreaHeight() {
        return 0;
    }
    /**
     * @hidden
     */
    getComputedHeight(elem) {
        return elem.offsetHeight ? parseFloat(this.document.defaultView.getComputedStyle(elem).getPropertyValue('height')) : 0;
    }
    /**
     * @hidden
     */
    getFooterHeight() {
        return this.summaryRowHeight || this.getComputedHeight(this.tfoot.nativeElement);
    }
    /**
     * @hidden
     */
    getTheadRowHeight() {
        const height = this.getComputedHeight(this.theadRow.nativeElement);
        return (!this.allowFiltering || (this.allowFiltering && this.filterMode !== FilterMode.quickFilter)) ?
            height - this.getFilterCellHeight() :
            height;
    }
    /**
     * @hidden
     */
    getToolbarHeight() {
        let toolbarHeight = 0;
        if (this.toolbar.first) {
            toolbarHeight = this.getComputedHeight(this.toolbar.first.nativeElement);
        }
        return toolbarHeight;
    }
    /**
     * @hidden
     */
    getPagingFooterHeight() {
        let pagingHeight = 0;
        if (this.footer) {
            const height = this.getComputedHeight(this.footer.nativeElement);
            pagingHeight = this.footer.nativeElement.firstElementChild ?
                height : 0;
        }
        return pagingHeight;
    }
    /**
     * @hidden
     */
    getFilterCellHeight() {
        const headerGroupNativeEl = (this.headerGroupsList.length !== 0) ?
            this.headerGroupsList[0].nativeElement : null;
        const filterCellNativeEl = (headerGroupNativeEl) ?
            headerGroupNativeEl.querySelector('igx-grid-filtering-cell') : null;
        return (filterCellNativeEl) ? filterCellNativeEl.offsetHeight : 0;
    }
    /**
     * @hidden
     */
    _calculateGridBodyHeight() {
        if (!this._height) {
            return null;
        }
        const actualTheadRow = this.getTheadRowHeight();
        const footerHeight = this.getFooterHeight();
        const toolbarHeight = this.getToolbarHeight();
        const pagingHeight = this.getPagingFooterHeight();
        const groupAreaHeight = this.getGroupAreaHeight();
        const scrHeight = this.getComputedHeight(this.scr.nativeElement);
        const renderedHeight = toolbarHeight + actualTheadRow +
            footerHeight + pagingHeight + groupAreaHeight +
            scrHeight;
        let gridHeight = 0;
        if (this.isPercentHeight) {
            const computed = this.document.defaultView.getComputedStyle(this.nativeElement).getPropertyValue('height');
            const autoSize = this._shouldAutoSize(renderedHeight);
            if (autoSize || computed.indexOf('%') !== -1) {
                const bodyHeight = this.getDataBasedBodyHeight();
                return bodyHeight > 0 ? bodyHeight : null;
            }
            gridHeight = parseFloat(computed);
        }
        else {
            gridHeight = parseInt(this._height, 10);
        }
        const height = Math.abs(gridHeight - renderedHeight);
        if (Math.round(height) === 0 || isNaN(gridHeight)) {
            const bodyHeight = this.defaultTargetBodyHeight;
            return bodyHeight > 0 ? bodyHeight : null;
        }
        return height;
    }
    checkContainerSizeChange() {
        const origHeight = this.nativeElement.parentElement.offsetHeight;
        this.nativeElement.style.display = 'none';
        const height = this.nativeElement.parentElement.offsetHeight;
        this.nativeElement.style.display = '';
        return origHeight !== height;
    }
    _shouldAutoSize(renderedHeight) {
        this.tbody.nativeElement.style.display = 'none';
        let res = !this.nativeElement.parentElement ||
            this.nativeElement.parentElement.clientHeight === 0 ||
            this.nativeElement.parentElement.clientHeight === renderedHeight ||
            // If grid causes the parent container to extend (for example when container is flex)
            // we should always auto-size since the actual size of the container will continuously change as the grid renders elements.
            this.checkContainerSizeChange();
        this.tbody.nativeElement.style.display = '';
        return res;
    }
    /**
     * @hidden
     * Gets calculated width of the unpinned area
     * @param takeHidden If we should take into account the hidden columns in the pinned area.
     */
    getUnpinnedWidth(takeHidden = false) {
        let width = this.isPercentWidth ?
            this.calcWidth :
            parseInt(this.width, 10) || parseInt(this.hostWidth, 10) || this.calcWidth;
        if (this.hasVerticalScroll() && !this.isPercentWidth) {
            width -= this.scrollSize;
        }
        if (!this.isPinningToStart) {
            width -= this.featureColumnsWidth();
        }
        return width - this.getPinnedWidth(takeHidden);
    }
    /**
     * @hidden
     */
    _summaries(fieldName, hasSummary, summaryOperand) {
        const column = this.gridAPI.get_column_by_name(fieldName);
        if (column) {
            column.hasSummary = hasSummary;
            if (summaryOperand) {
                if (this.rootSummariesEnabled) {
                    this.summaryService.retriggerRootPipe++;
                }
                column.summaries = summaryOperand;
            }
        }
    }
    /**
     * @hidden
     */
    _multipleSummaries(expressions, hasSummary) {
        expressions.forEach((element) => {
            this._summaries(element.fieldName, hasSummary, element.customSummary);
        });
    }
    /**
     * @hidden
     */
    _disableMultipleSummaries(expressions) {
        expressions.forEach((column) => {
            const columnName = column && column.fieldName ? column.fieldName : column;
            this._summaries(columnName, false);
        });
    }
    /**
     * @hidden
     */
    resolveDataTypes(rec) {
        if (typeof rec === 'number') {
            return GridColumnDataType.Number;
        }
        else if (typeof rec === 'boolean') {
            return GridColumnDataType.Boolean;
        }
        else if (typeof rec === 'object' && rec instanceof Date) {
            return GridColumnDataType.Date;
        }
        return GridColumnDataType.String;
    }
    /**
     * @hidden
     */
    autogenerateColumns() {
        const data = this.gridAPI.get_data();
        const factory = this.resolver.resolveComponentFactory(IgxColumnComponent);
        const fields = this.generateDataFields(data);
        const columns = [];
        fields.forEach((field) => {
            const ref = factory.create(this.viewRef.injector);
            ref.instance.field = field;
            ref.instance.dataType = this.resolveDataTypes(data[0][field]);
            ref.changeDetectorRef.detectChanges();
            columns.push(ref.instance);
        });
        this._autoGeneratedCols = columns;
        this.columnList.reset(columns);
        if (data && data.length > 0) {
            this.shouldGenerate = false;
        }
    }
    generateDataFields(data) {
        return Object.keys(data && data.length !== 0 ? data[0] : []);
    }
    /**
     * @hidden
     */
    initColumns(collection, cb = null) {
        this._columnGroups = this.columnList.some(col => col.columnGroup);
        if (this.hasColumnLayouts) {
            // Set overall row layout size
            this.columnList.forEach((col) => {
                if (col.columnLayout) {
                    const layoutSize = col.children ?
                        col.children.reduce((acc, val) => Math.max(val.rowStart + val.gridRowSpan - 1, acc), 1) :
                        1;
                    this._multiRowLayoutRowSize = Math.max(layoutSize, this._multiRowLayoutRowSize);
                }
            });
        }
        if (this.hasColumnLayouts && this.hasColumnGroups) {
            // invalid configuration - multi-row and column groups
            // remove column groups
            const columnLayoutColumns = this.columnList.filter((col) => col.columnLayout || col.columnLayoutChild);
            this.columnList.reset(columnLayoutColumns);
        }
        this._maxLevelHeaderDepth = null;
        this._columns = this.columnList.toArray();
        collection.forEach((column) => {
            column.defaultWidth = this.columnWidthSetByUser ? this._columnWidth : column.defaultWidth ? column.defaultWidth : '';
            if (cb) {
                cb(column);
            }
        });
        this.reinitPinStates();
        if (this.hasColumnLayouts) {
            collection.forEach((column) => {
                column.populateVisibleIndexes();
            });
        }
    }
    /**
     * @hidden
     */
    reinitPinStates() {
        this._pinnedColumns = this.columnList
            .filter((c) => c.pinned).sort((a, b) => this._pinnedColumns.indexOf(a) - this._pinnedColumns.indexOf(b));
        this._unpinnedColumns = this.hasColumnGroups ? this.columnList.filter((c) => !c.pinned) :
            this.columnList.filter((c) => !c.pinned)
                .sort((a, b) => this._unpinnedColumns.findIndex(x => x.field === a.field) - this._unpinnedColumns.findIndex(x => x.field === b.field));
    }
    extractDataFromSelection(source, formatters = false, headers = false, columnData) {
        let columnsArray;
        let record = {};
        let selectedData = [];
        let keys = [];
        const selectionCollection = new Map();
        const keysAndData = [];
        const activeEl = this.selectionService.activeElement;
        if (this.nativeElement.tagName.toLowerCase() === 'igx-hierarchical-grid') {
            const expansionRowIndexes = [];
            for (const [key, value] of this.expansionStates.entries()) {
                if (value) {
                    expansionRowIndexes.push(key);
                }
            }
            if (this.selectionService.selection.size > 0) {
                if (expansionRowIndexes.length > 0) {
                    for (const [key, value] of this.selectionService.selection.entries()) {
                        let updatedKey = key;
                        expansionRowIndexes.forEach(row => {
                            let rowIndex;
                            if (!isNaN(row.ID)) {
                                rowIndex = Number(row.ID);
                            }
                            else {
                                rowIndex = Number(row);
                            }
                            if (updatedKey > Number(rowIndex)) {
                                updatedKey--;
                            }
                        });
                        selectionCollection.set(updatedKey, value);
                    }
                }
            }
            else if (activeEl) {
                if (expansionRowIndexes.length > 0) {
                    expansionRowIndexes.forEach(row => {
                        if (activeEl.row > Number(row)) {
                            activeEl.row--;
                        }
                    });
                }
            }
        }
        const totalItems = this.totalItemCount ?? 0;
        const isRemote = totalItems && totalItems > this.dataView.length;
        let selectionMap;
        if (this.nativeElement.tagName.toLowerCase() === 'igx-hierarchical-grid' && selectionCollection.size > 0) {
            selectionMap = isRemote ? Array.from(selectionCollection) :
                Array.from(selectionCollection).filter((tuple) => tuple[0] < source.length);
        }
        else {
            selectionMap = isRemote ? Array.from(this.selectionService.selection) :
                Array.from(this.selectionService.selection).filter((tuple) => tuple[0] < source.length);
        }
        if (this.cellSelection === GridSelectionMode.single && activeEl) {
            selectionMap.push([activeEl.row, new Set().add(activeEl.column)]);
        }
        if (this.cellSelection === GridSelectionMode.none && activeEl) {
            selectionMap.push([activeEl.row, new Set().add(activeEl.column)]);
        }
        if (columnData) {
            selectedData = columnData;
        }
        // eslint-disable-next-line prefer-const
        for (let [row, set] of selectionMap) {
            row = this.paginator && (this.pagingMode === GridPagingMode.Local && source === this.filteredSortedData) ? row + (this.paginator.perPage * this.paginator.page) : row;
            row = isRemote ? row - this.virtualizationState.startIndex : row;
            if (!source[row] || source[row].detailsData !== undefined) {
                continue;
            }
            const temp = Array.from(set);
            for (const each of temp) {
                columnsArray = this.getSelectableColumnsAt(each);
                columnsArray.forEach((col) => {
                    if (col) {
                        const key = headers ? col.header || col.field : col.field;
                        const rowData = source[row].ghostRecord ? source[row].recordRef : source[row];
                        const value = resolveNestedPath(rowData, col.field);
                        record[key] = formatters && col.formatter ? col.formatter(value, rowData) : value;
                        if (columnData) {
                            if (!record[key]) {
                                record[key] = '';
                            }
                            record[key] = record[key].toString().concat('recordRow-' + row);
                        }
                    }
                });
            }
            if (Object.keys(record).length) {
                if (columnData) {
                    if (!keys.length) {
                        keys = Object.keys(columnData[0]);
                    }
                    for (const [key, value] of Object.entries(record)) {
                        if (!keys.includes(key)) {
                            keys.push(key);
                        }
                        let c = value;
                        const rowNumber = +c.split('recordRow-')[1];
                        c = c.split('recordRow-')[0];
                        record[key] = c;
                        const mergedObj = Object.assign(selectedData[rowNumber], record);
                        selectedData[rowNumber] = mergedObj;
                    }
                }
                else {
                    selectedData.push(record);
                }
            }
            record = {};
        }
        if (keys.length) {
            keysAndData.push(selectedData);
            keysAndData.push(keys);
            return keysAndData;
        }
        else {
            return selectedData;
        }
    }
    getSelectableColumnsAt(index) {
        if (this.hasColumnLayouts) {
            const visibleLayoutColumns = this.visibleColumns
                .filter(col => col.columnLayout)
                .sort((a, b) => a.visibleIndex - b.visibleIndex);
            const colLayout = visibleLayoutColumns[index];
            return colLayout ? colLayout.children.toArray() : [];
        }
        else {
            const visibleColumns = this.visibleColumns
                .filter(col => !col.columnGroup)
                .sort((a, b) => a.visibleIndex - b.visibleIndex);
            return [visibleColumns[index]];
        }
    }
    extractDataFromColumnsSelection(source, formatters = false, headers = false) {
        let record = {};
        const selectedData = [];
        const selectedColumns = this.selectedColumns();
        if (selectedColumns.length === 0) {
            return [];
        }
        for (const data of source) {
            selectedColumns.forEach((col) => {
                const key = headers ? col.header || col.field : col.field;
                record[key] = formatters && col.formatter ? col.formatter(data[col.field], data)
                    : data[col.field];
            });
            if (Object.keys(record).length) {
                selectedData.push(record);
            }
            record = {};
        }
        return selectedData;
    }
    /**
     * @hidden
     */
    initPinning() {
        const pinnedColumns = [];
        const unpinnedColumns = [];
        this.calculateGridWidth();
        this.resetCaches();
        // When a column is a group or is inside a group, pin all related.
        this._pinnedColumns.forEach(col => {
            if (col.parent) {
                col.parent.pinned = true;
            }
            if (col.columnGroup) {
                col.children.forEach(child => child.pinned = true);
            }
        });
        // Make sure we don't exceed unpinned area min width and get pinned and unpinned col collections.
        // We take into account top level columns (top level groups and non groups).
        // If top level is unpinned the pinning handles all children to be unpinned as well.
        for (const column of this.columnList) {
            if (column.pinned && !column.parent) {
                pinnedColumns.push(column);
            }
            else if (column.pinned && column.parent) {
                if (column.topLevelParent.pinned) {
                    pinnedColumns.push(column);
                }
                else {
                    column.pinned = false;
                    unpinnedColumns.push(column);
                }
            }
            else {
                unpinnedColumns.push(column);
            }
        }
        // Assign the applicable collections.
        this._pinnedColumns = pinnedColumns;
        this._unpinnedColumns = unpinnedColumns;
        this.notifyChanges();
    }
    /**
     * @hidden
     */
    scrollTo(row, column, inCollection = this._filteredSortedUnpinnedData) {
        let delayScrolling = false;
        if (this.paginator && typeof (row) !== 'number') {
            const rowIndex = inCollection.indexOf(row);
            const page = Math.floor(rowIndex / this.paginator.perPage);
            if (this.paginator.page !== page) {
                delayScrolling = true;
                this.paginator.page = page;
            }
        }
        if (delayScrolling) {
            this.verticalScrollContainer.dataChanged.pipe(first()).subscribe(() => {
                this.scrollDirective(this.verticalScrollContainer, typeof (row) === 'number' ? row : this.unpinnedDataView.indexOf(row));
            });
        }
        else {
            this.scrollDirective(this.verticalScrollContainer, typeof (row) === 'number' ? row : this.unpinnedDataView.indexOf(row));
        }
        this.scrollToHorizontally(column);
    }
    /**
     * @hidden
     */
    scrollToHorizontally(column) {
        let columnIndex = typeof column === 'number' ? column : this.getColumnByName(column).visibleIndex;
        const scrollRow = this.rowList.find(r => !!r.virtDirRow);
        const virtDir = scrollRow ? scrollRow.virtDirRow : null;
        if (this.isPinningToStart && this.pinnedColumns.length) {
            if (columnIndex >= this.pinnedColumns.length) {
                columnIndex -= this.pinnedColumns.length;
                this.scrollDirective(virtDir, columnIndex);
            }
        }
        else {
            this.scrollDirective(virtDir, columnIndex);
        }
    }
    /**
     * @hidden
     */
    scrollDirective(directive, goal) {
        if (!directive) {
            return;
        }
        directive.scrollTo(goal);
    }
    getColumnWidthSum() {
        let colSum = 0;
        const cols = this.hasColumnLayouts ?
            this.visibleColumns.filter(x => x.columnLayout) : this.visibleColumns.filter(x => !x.columnGroup);
        cols.forEach((item) => {
            colSum += parseInt((item.calcWidth || item.defaultWidth), 10) || MINIMUM_COLUMN_WIDTH;
        });
        if (!colSum) {
            return null;
        }
        this.cdr.detectChanges();
        colSum += this.featureColumnsWidth();
        return colSum;
    }
    /**
     * Notify changes, reset cache and populateVisibleIndexes.
     *
     * @hidden
     */
    _columnsReordered(column) {
        this.notifyChanges();
        if (this.hasColumnLayouts) {
            this.columnList.filter(x => x.columnLayout).forEach(x => x.populateVisibleIndexes());
        }
        // after reordering is done reset cached column collections.
        this.resetColumnCollections();
        column.resetCaches();
    }
    buildDataView(data) {
        this._dataView = this.isRowPinningToTop ?
            [...this.pinnedDataView, ...this.unpinnedDataView] :
            [...this.unpinnedDataView, ...this.pinnedDataView];
    }
    _applyWidthHostBinding() {
        let width = this._width;
        if (width === null) {
            let currentWidth = this.calcWidth;
            if (this.hasVerticalScroll()) {
                currentWidth += this.scrollSize;
            }
            width = currentWidth + 'px';
            this.resetCaches();
        }
        this._hostWidth = width;
        this.cdr.markForCheck();
    }
    verticalScrollHandler(event) {
        this.verticalScrollContainer.onScroll(event);
        this.disableTransitions = true;
        this.zone.run(() => {
            this.zone.onStable.pipe(first()).subscribe(() => {
                this.verticalScrollContainer.chunkLoad.emit(this.verticalScrollContainer.state);
                if (this.rowEditable) {
                    this.changeRowEditingOverlayStateOnScroll(this.crudService.rowInEditMode);
                }
            });
        });
        this.disableTransitions = false;
        this.hideOverlays();
        this.actionStrip?.hide();
        if (this.actionStrip) {
            this.actionStrip.context = null;
        }
        const args = {
            direction: 'vertical',
            event,
            scrollPosition: this.verticalScrollContainer.scrollPosition
        };
        this.gridScroll.emit(args);
    }
    horizontalScrollHandler(event) {
        const scrollLeft = event.target.scrollLeft;
        this.headerContainer.onHScroll(scrollLeft);
        this._horizontalForOfs.forEach(vfor => vfor.onHScroll(scrollLeft));
        this.cdr.markForCheck();
        this.zone.run(() => {
            this.zone.onStable.pipe(first()).subscribe(() => {
                this.parentVirtDir.chunkLoad.emit(this.headerContainer.state);
            });
        });
        this.hideOverlays();
        const args = { direction: 'horizontal', event, scrollPosition: this.headerContainer.scrollPosition };
        this.gridScroll.emit(args);
    }
    executeCallback(rowIndex, visibleColIndex = -1, cb = null) {
        if (!cb) {
            return;
        }
        let row = this.summariesRowList.filter(s => s.index !== 0).concat(this.rowList.toArray()).find(r => r.index === rowIndex);
        if (!row) {
            if (this.totalItemCount) {
                this.verticalScrollContainer.dataChanged.pipe(first()).subscribe(() => {
                    this.cdr.detectChanges();
                    row = this.summariesRowList.filter(s => s.index !== 0).concat(this.rowList.toArray()).find(r => r.index === rowIndex);
                    const cbArgs = this.getNavigationArguments(row, visibleColIndex);
                    cb(cbArgs);
                });
            }
            const dataViewIndex = this._getDataViewIndex(rowIndex);
            if (this.dataView[dataViewIndex].detailsData) {
                this.navigation.setActiveNode({ row: rowIndex });
                this.cdr.detectChanges();
            }
            return;
        }
        const args = this.getNavigationArguments(row, visibleColIndex);
        cb(args);
    }
    getNavigationArguments(row, visibleColIndex) {
        let targetType;
        let target;
        switch (row.nativeElement.tagName.toLowerCase()) {
            case 'igx-grid-groupby-row':
                targetType = 'groupRow';
                target = row;
                break;
            case 'igx-grid-summary-row':
                targetType = 'summaryCell';
                target = visibleColIndex !== -1 ?
                    row.summaryCells.find(c => c.visibleColumnIndex === visibleColIndex) : row.summaryCells.first;
                break;
            case 'igx-child-grid-row':
                targetType = 'hierarchicalRow';
                target = row;
                break;
            default:
                targetType = 'dataCell';
                target = visibleColIndex !== -1 ? row.cells.find(c => c.visibleColumnIndex === visibleColIndex) : row.cells.first;
                break;
        }
        return { targetType, target };
    }
    getNextDataRowIndex(currentRowIndex, previous = false) {
        const resolvedIndex = this._getDataViewIndex(currentRowIndex);
        if (currentRowIndex < 0 || (currentRowIndex === 0 && previous) || (resolvedIndex >= this.dataView.length - 1 && !previous)) {
            return currentRowIndex;
        }
        // find next/prev record that is editable.
        const nextRowIndex = previous ? this.findPrevEditableDataRowIndex(currentRowIndex) :
            this.dataView.findIndex((rec, index) => index > resolvedIndex && this.isEditableDataRecordAtIndex(index));
        const nextDataIndex = this.getDataIndex(nextRowIndex);
        return nextDataIndex !== -1 ? nextDataIndex : currentRowIndex;
    }
    /**
     * Returns the previous editable row index or -1 if no such row is found.
     *
     * @param currentIndex The index of the current editable record.
     */
    findPrevEditableDataRowIndex(currentIndex) {
        let i = this.dataView.length;
        const resolvedIndex = this._getDataViewIndex(currentIndex);
        while (i--) {
            if (i < resolvedIndex && this.isEditableDataRecordAtIndex(i)) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Returns if the record at the specified data view index is a an editable data record.
     * If record is group rec, summary rec, child rec, ghost rec. etc. it is not editable.
     *
     * @param dataViewIndex The index of that record in the data view.
     *
     */
    // TODO: Consider moving it into CRUD
    isEditableDataRecordAtIndex(dataViewIndex) {
        const rec = this.dataView[dataViewIndex];
        return !rec.expression && !rec.summaries && !rec.childGridsData && !rec.detailsData &&
            !this.isGhostRecordAtIndex(dataViewIndex);
    }
    /**
     * Returns if the record at the specified data view index is a ghost.
     * If record is pinned but is not in pinned area then it is a ghost record.
     *
     * @param dataViewIndex The index of that record in the data view.
     */
    isGhostRecordAtIndex(dataViewIndex) {
        const isPinned = this.isRecordPinned(this.dataView[dataViewIndex]);
        const isInPinnedArea = this.isRecordPinnedByViewIndex(dataViewIndex);
        return isPinned && !isInPinnedArea;
    }
    isValidPosition(rowIndex, colIndex) {
        const rows = this.summariesRowList.filter(s => s.index !== 0).concat(this.rowList.toArray()).length;
        const cols = this.columnList.filter(col => !col.columnGroup && col.visibleIndex >= 0 && !col.hidden).length;
        if (rows < 1 || cols < 1) {
            return false;
        }
        if (rowIndex > -1 && rowIndex < this.dataView.length &&
            colIndex > -1 && colIndex <= Math.max(...this.visibleColumns.map(c => c.visibleIndex))) {
            return true;
        }
        return false;
    }
    find(text, increment, caseSensitive, exactMatch, scroll, endEdit = true) {
        if (!this.rowList) {
            return 0;
        }
        if (endEdit) {
            this.crudService.endEdit(false);
        }
        if (!text) {
            this.clearSearch();
            return 0;
        }
        const caseSensitiveResolved = caseSensitive ? true : false;
        const exactMatchResolved = exactMatch ? true : false;
        let rebuildCache = false;
        if (this.lastSearchInfo.searchText !== text ||
            this.lastSearchInfo.caseSensitive !== caseSensitiveResolved ||
            this.lastSearchInfo.exactMatch !== exactMatchResolved) {
            this.lastSearchInfo = {
                searchText: text,
                activeMatchIndex: 0,
                caseSensitive: caseSensitiveResolved,
                exactMatch: exactMatchResolved,
                matchInfoCache: []
            };
            rebuildCache = true;
        }
        else {
            this.lastSearchInfo.activeMatchIndex += increment;
        }
        if (rebuildCache) {
            this.rowList.forEach((row) => {
                if (row.cells) {
                    row.cells.forEach((c) => {
                        c.highlightText(text, caseSensitiveResolved, exactMatchResolved);
                    });
                }
            });
            this.rebuildMatchCache();
        }
        if (this.lastSearchInfo.activeMatchIndex >= this.lastSearchInfo.matchInfoCache.length) {
            this.lastSearchInfo.activeMatchIndex = 0;
        }
        else if (this.lastSearchInfo.activeMatchIndex < 0) {
            this.lastSearchInfo.activeMatchIndex = this.lastSearchInfo.matchInfoCache.length - 1;
        }
        if (this.lastSearchInfo.matchInfoCache.length) {
            const matchInfo = this.lastSearchInfo.matchInfoCache[this.lastSearchInfo.activeMatchIndex];
            this.lastSearchInfo = { ...this.lastSearchInfo };
            if (scroll !== false) {
                this.scrollTo(matchInfo.row, matchInfo.column);
            }
            IgxTextHighlightDirective.setActiveHighlight(this.id, {
                column: matchInfo.column,
                row: matchInfo.row,
                index: matchInfo.index,
                metadata: matchInfo.metadata,
            });
        }
        else {
            IgxTextHighlightDirective.clearActiveHighlight(this.id);
        }
        return this.lastSearchInfo.matchInfoCache.length;
    }
    rebuildMatchCache() {
        this.lastSearchInfo.matchInfoCache = [];
        const caseSensitive = this.lastSearchInfo.caseSensitive;
        const exactMatch = this.lastSearchInfo.exactMatch;
        const searchText = caseSensitive ? this.lastSearchInfo.searchText : this.lastSearchInfo.searchText.toLowerCase();
        const data = this.filteredSortedData;
        const columnItems = this.visibleColumns.filter((c) => !c.columnGroup).sort((c1, c2) => c1.visibleIndex - c2.visibleIndex);
        data.forEach((dataRow, rowIndex) => {
            columnItems.forEach((c) => {
                const pipeArgs = this.getColumnByName(c.field).pipeArgs;
                const value = c.formatter ? c.formatter(resolveNestedPath(dataRow, c.field), dataRow) :
                    c.dataType === 'number' ? formatNumber(resolveNestedPath(dataRow, c.field), this.locale, pipeArgs.digitsInfo) :
                        c.dataType === 'date'
                            ? formatDate(resolveNestedPath(dataRow, c.field), pipeArgs.format, this.locale, pipeArgs.timezone)
                            : resolveNestedPath(dataRow, c.field);
                if (value !== undefined && value !== null && c.searchable) {
                    let searchValue = caseSensitive ? String(value) : String(value).toLowerCase();
                    if (exactMatch) {
                        if (searchValue === searchText) {
                            const metadata = new Map();
                            metadata.set('pinned', this.isRecordPinnedByIndex(rowIndex));
                            this.lastSearchInfo.matchInfoCache.push({
                                row: dataRow,
                                column: c.field,
                                index: 0,
                                metadata,
                            });
                        }
                    }
                    else {
                        let occurenceIndex = 0;
                        let searchIndex = searchValue.indexOf(searchText);
                        while (searchIndex !== -1) {
                            const metadata = new Map();
                            metadata.set('pinned', this.isRecordPinnedByIndex(rowIndex));
                            this.lastSearchInfo.matchInfoCache.push({
                                row: dataRow,
                                column: c.field,
                                index: occurenceIndex++,
                                metadata,
                            });
                            searchValue = searchValue.substring(searchIndex + searchText.length);
                            searchIndex = searchValue.indexOf(searchText);
                        }
                    }
                }
            });
        });
    }
    // TODO: About to Move to CRUD
    configureRowEditingOverlay(rowID, useOuter = false) {
        let settings = this.rowEditSettings;
        const overlay = this.overlayService.getOverlayById(this.rowEditingOverlay.overlayId);
        if (overlay) {
            settings = overlay.settings;
        }
        settings.outlet = useOuter ? this.parentRowOutletDirective : this.rowOutletDirective;
        this.rowEditPositioningStrategy.settings.container = this.tbody.nativeElement;
        const pinned = this._pinnedRecordIDs.indexOf(rowID) !== -1;
        const targetRow = !pinned ?
            this.gridAPI.get_row_by_key(rowID)
            : this.pinnedRows.find(x => x.key === rowID);
        if (!targetRow) {
            return;
        }
        settings.target = targetRow.element.nativeElement;
        this.toggleRowEditingOverlay(true);
    }
}
IgxGridBaseDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridBaseDirective, deps: [{ token: i1.IgxGridSelectionService }, { token: i2.IgxColumnResizingService }, { token: IGX_GRID_SERVICE_BASE }, { token: i3.IgxFlatTransactionFactory }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }, { token: i0.IterableDiffers }, { token: i0.ViewContainerRef }, { token: i0.ApplicationRef }, { token: i0.NgModuleRef }, { token: i0.Injector }, { token: i4.IgxGridNavigationService }, { token: i5.IgxFilteringService }, { token: IgxOverlayService }, { token: i6.IgxGridSummaryService }, { token: DisplayDensityToken, optional: true }, { token: LOCALE_ID }, { token: i7.PlatformUtil }, { token: IgxGridTransaction, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
IgxGridBaseDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridBaseDirective, inputs: { snackbarDisplayTime: "snackbarDisplayTime", autoGenerate: "autoGenerate", moving: "moving", emptyGridTemplate: "emptyGridTemplate", addRowEmptyTemplate: "addRowEmptyTemplate", loadingGridTemplate: "loadingGridTemplate", summaryRowHeight: "summaryRowHeight", dataCloneStrategy: "dataCloneStrategy", clipboardOptions: "clipboardOptions", class: "class", evenRowCSS: "evenRowCSS", oddRowCSS: "oddRowCSS", rowClasses: "rowClasses", rowStyles: "rowStyles", primaryKey: "primaryKey", uniqueColumnValuesStrategy: "uniqueColumnValuesStrategy", resourceStrings: "resourceStrings", filteringLogic: "filteringLogic", filteringExpressionsTree: "filteringExpressionsTree", advancedFilteringExpressionsTree: "advancedFilteringExpressionsTree", locale: "locale", pagingMode: "pagingMode", paging: "paging", page: "page", perPage: "perPage", hideRowSelectors: "hideRowSelectors", rowDraggable: "rowDraggable", rowEditable: "rowEditable", height: "height", width: "width", rowHeight: "rowHeight", columnWidth: "columnWidth", emptyGridMessage: "emptyGridMessage", isLoading: "isLoading", emptyFilteredGridMessage: "emptyFilteredGridMessage", pinning: "pinning", allowFiltering: "allowFiltering", allowAdvancedFiltering: "allowAdvancedFiltering", filterMode: "filterMode", summaryPosition: "summaryPosition", summaryCalculationMode: "summaryCalculationMode", showSummaryOnCollapse: "showSummaryOnCollapse", filterStrategy: "filterStrategy", sortStrategy: "sortStrategy", selectedRows: "selectedRows", sortingExpressions: "sortingExpressions", batchEditing: "batchEditing", cellSelection: "cellSelection", rowSelection: "rowSelection", columnSelection: "columnSelection", expansionStates: "expansionStates", outlet: "outlet", totalRecords: "totalRecords", selectRowOnClick: "selectRowOnClick" }, outputs: { filteringExpressionsTreeChange: "filteringExpressionsTreeChange", advancedFilteringExpressionsTreeChange: "advancedFilteringExpressionsTreeChange", gridScroll: "gridScroll", pageChange: "pageChange", perPageChange: "perPageChange", cellClick: "cellClick", selected: "selected", rowSelectionChanging: "rowSelectionChanging", columnSelectionChanging: "columnSelectionChanging", columnPin: "columnPin", columnPinned: "columnPinned", cellEditEnter: "cellEditEnter", cellEditExit: "cellEditExit", cellEdit: "cellEdit", cellEditDone: "cellEditDone", rowEditEnter: "rowEditEnter", rowEdit: "rowEdit", rowEditDone: "rowEditDone", rowEditExit: "rowEditExit", columnInit: "columnInit", sorting: "sorting", sortingDone: "sortingDone", filtering: "filtering", filteringDone: "filteringDone", pagingDone: "pagingDone", rowAdded: "rowAdded", rowDeleted: "rowDeleted", rowDelete: "rowDelete", rowAdd: "rowAdd", columnResized: "columnResized", contextMenu: "contextMenu", doubleClick: "doubleClick", columnVisibilityChanging: "columnVisibilityChanging", columnVisibilityChanged: "columnVisibilityChanged", columnMovingStart: "columnMovingStart", columnMoving: "columnMoving", columnMovingEnd: "columnMovingEnd", gridKeydown: "gridKeydown", rowDragStart: "rowDragStart", rowDragEnd: "rowDragEnd", gridCopy: "gridCopy", expansionStatesChange: "expansionStatesChange", rowToggle: "rowToggle", rowPinning: "rowPinning", rowPinned: "rowPinned", activeNodeChange: "activeNodeChange", sortingExpressionsChange: "sortingExpressionsChange", toolbarExporting: "toolbarExporting", rangeSelected: "rangeSelected", rendered: "rendered", localeChange: "localeChange", dataChanging: "dataChanging", dataChanged: "dataChanged" }, host: { listeners: { "mouseleave": "hideActionStrip()" }, properties: { "attr.tabindex": "this.tabindex", "attr.role": "this.hostRole", "style.height": "this.height", "style.width": "this.hostWidth", "attr.class": "this.hostClass" } }, queries: [{ propertyName: "actionStrip", first: true, predicate: IgxActionStripComponent, descendants: true }, { propertyName: "excelStyleLoadingValuesTemplateDirective", first: true, predicate: IgxExcelStyleLoadingValuesTemplateDirective, descendants: true, read: IgxExcelStyleLoadingValuesTemplateDirective, static: true }, { propertyName: "rowAddText", first: true, predicate: IgxRowAddTextDirective, descendants: true, read: TemplateRef }, { propertyName: "rowExpandedIndicatorTemplate", first: true, predicate: IgxRowExpandedIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "rowCollapsedIndicatorTemplate", first: true, predicate: IgxRowCollapsedIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "headerExpandIndicatorTemplate", first: true, predicate: IgxHeaderExpandIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "headerCollapseIndicatorTemplate", first: true, predicate: IgxHeaderCollapseIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "excelStyleHeaderIconTemplate", first: true, predicate: IgxExcelStyleHeaderIconDirective, descendants: true, read: TemplateRef }, { propertyName: "sortAscendingHeaderIconTemplate", first: true, predicate: IgxSortAscendingHeaderIconDirective, descendants: true, read: TemplateRef }, { propertyName: "sortDescendingHeaderIconTemplate", first: true, predicate: IgxSortDescendingHeaderIconDirective, descendants: true, read: TemplateRef }, { propertyName: "sortHeaderIconTemplate", first: true, predicate: IgxSortHeaderIconDirective, descendants: true, read: TemplateRef }, { propertyName: "excelStyleFilteringComponents", predicate: IgxGridExcelStyleFilteringComponent, read: IgxGridExcelStyleFilteringComponent }, { propertyName: "columnList", predicate: IgxColumnComponent, descendants: true, read: IgxColumnComponent }, { propertyName: "headSelectorsTemplates", predicate: IgxHeadSelectorDirective, read: IgxHeadSelectorDirective }, { propertyName: "rowSelectorsTemplates", predicate: IgxRowSelectorDirective, read: IgxRowSelectorDirective }, { propertyName: "dragGhostCustomTemplates", predicate: IgxRowDragGhostDirective, read: TemplateRef }, { propertyName: "rowEditCustomDirectives", predicate: IgxRowEditTemplateDirective, read: TemplateRef }, { propertyName: "rowEditTextDirectives", predicate: IgxRowEditTextDirective, read: TemplateRef }, { propertyName: "rowEditActionsDirectives", predicate: IgxRowEditActionsDirective, read: TemplateRef }, { propertyName: "dragIndicatorIconTemplates", predicate: IgxDragIndicatorIconDirective, read: TemplateRef }, { propertyName: "rowEditTabsCUSTOM", predicate: IgxRowEditTabStopDirective, descendants: true }, { propertyName: "toolbar", predicate: IgxGridToolbarComponent }, { propertyName: "paginationComponents", predicate: IgxPaginatorComponent }], viewQueries: [{ propertyName: "addRowSnackbar", first: true, predicate: IgxSnackbarComponent, descendants: true }, { propertyName: "resizeLine", first: true, predicate: IgxGridColumnResizerComponent, descendants: true }, { propertyName: "loadingOverlay", first: true, predicate: ["loadingOverlay"], descendants: true, read: IgxToggleDirective, static: true }, { propertyName: "loadingOutlet", first: true, predicate: ["igxLoadingOverlayOutlet"], descendants: true, read: IgxOverlayOutletDirective, static: true }, { propertyName: "emptyFilteredGridTemplate", first: true, predicate: ["emptyFilteredGrid"], descendants: true, read: TemplateRef, static: true }, { propertyName: "emptyGridDefaultTemplate", first: true, predicate: ["defaultEmptyGrid"], descendants: true, read: TemplateRef, static: true }, { propertyName: "loadingGridDefaultTemplate", first: true, predicate: ["defaultLoadingGrid"], descendants: true, read: TemplateRef, static: true }, { propertyName: "parentVirtDir", first: true, predicate: ["scrollContainer"], descendants: true, read: IgxGridForOfDirective, static: true }, { propertyName: "verticalScrollContainer", first: true, predicate: ["verticalScrollContainer"], descendants: true, read: IgxGridForOfDirective, static: true }, { propertyName: "verticalScroll", first: true, predicate: ["verticalScrollHolder"], descendants: true, read: IgxGridForOfDirective, static: true }, { propertyName: "scr", first: true, predicate: ["scr"], descendants: true, read: ElementRef, static: true }, { propertyName: "headerSelectorBaseTemplate", first: true, predicate: ["headSelectorBaseTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "footer", first: true, predicate: ["footer"], descendants: true, read: ElementRef }, { propertyName: "theadRow", first: true, predicate: IgxGridHeaderRowComponent, descendants: true, static: true }, { propertyName: "groupArea", first: true, predicate: IgxGridGroupByAreaComponent, descendants: true }, { propertyName: "tbody", first: true, predicate: ["tbody"], descendants: true, static: true }, { propertyName: "pinContainer", first: true, predicate: ["pinContainer"], descendants: true, read: ElementRef }, { propertyName: "tfoot", first: true, predicate: ["tfoot"], descendants: true, static: true }, { propertyName: "rowEditingOutletDirective", first: true, predicate: ["igxRowEditingOverlayOutlet"], descendants: true, read: IgxOverlayOutletDirective, static: true }, { propertyName: "dragIndicatorIconBase", first: true, predicate: ["dragIndicatorIconBase"], descendants: true, read: TemplateRef, static: true }, { propertyName: "rowEditingOverlay", first: true, predicate: ["rowEditingOverlay"], descendants: true, read: IgxToggleDirective }, { propertyName: "_outletDirective", first: true, predicate: ["igxFilteringOverlayOutlet"], descendants: true, read: IgxOverlayOutletDirective, static: true }, { propertyName: "defaultExpandedTemplate", first: true, predicate: ["defaultExpandedTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultCollapsedTemplate", first: true, predicate: ["defaultCollapsedTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultESFHeaderIconTemplate", first: true, predicate: ["defaultESFHeaderIcon"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultRowEditTemplate", first: true, predicate: ["defaultRowEditTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "tmpOutlets", predicate: IgxTemplateOutletDirective, descendants: true, read: IgxTemplateOutletDirective }, { propertyName: "rowEditTabsDEFAULT", predicate: IgxRowEditTabStopDirective, descendants: true }, { propertyName: "_summaryRowList", predicate: ["summaryRow"], descendants: true, read: IgxSummaryRowComponent }, { propertyName: "_rowList", predicate: ["row"], descendants: true }, { propertyName: "_pinnedRowList", predicate: ["pinnedRow"], descendants: true }, { propertyName: "_dataRowList", predicate: IgxRowDirective, descendants: true, read: IgxRowDirective }], usesInheritance: true, ngImport: i0 });
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "primaryKey", void 0);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "filteringLogic", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "filteringExpressionsTree", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "advancedFilteringExpressionsTree", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "hideRowSelectors", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "rowEditable", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "height", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "width", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "rowHeight", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "columnWidth", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "isLoading", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "sortingExpressions", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "cellSelection", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "rowSelection", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "columnSelection", null);
__decorate([
    WatchChanges()
], IgxGridBaseDirective.prototype, "selectRowOnClick", null);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridBaseDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.IgxGridSelectionService }, { type: i2.IgxColumnResizingService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_SERVICE_BASE]
                }] }, { type: i3.IgxFlatTransactionFactory }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }, { type: i0.IterableDiffers }, { type: i0.ViewContainerRef }, { type: i0.ApplicationRef }, { type: i0.NgModuleRef }, { type: i0.Injector }, { type: i4.IgxGridNavigationService }, { type: i5.IgxFilteringService }, { type: i8.IgxOverlayService, decorators: [{
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
                }] }]; }, propDecorators: { snackbarDisplayTime: [{
                type: Input
            }], autoGenerate: [{
                type: Input
            }], moving: [{
                type: Input
            }], emptyGridTemplate: [{
                type: Input
            }], addRowEmptyTemplate: [{
                type: Input
            }], loadingGridTemplate: [{
                type: Input
            }], summaryRowHeight: [{
                type: Input
            }], dataCloneStrategy: [{
                type: Input
            }], clipboardOptions: [{
                type: Input
            }], filteringExpressionsTreeChange: [{
                type: Output
            }], advancedFilteringExpressionsTreeChange: [{
                type: Output
            }], gridScroll: [{
                type: Output
            }], pageChange: [{
                type: Output
            }], perPageChange: [{
                type: Output
            }], class: [{
                type: Input
            }], evenRowCSS: [{
                type: Input
            }], oddRowCSS: [{
                type: Input
            }], rowClasses: [{
                type: Input
            }], rowStyles: [{
                type: Input
            }], primaryKey: [{
                type: Input
            }], uniqueColumnValuesStrategy: [{
                type: Input
            }], excelStyleFilteringComponents: [{
                type: ContentChildren,
                args: [IgxGridExcelStyleFilteringComponent, { read: IgxGridExcelStyleFilteringComponent, descendants: false }]
            }], cellClick: [{
                type: Output
            }], selected: [{
                type: Output
            }], rowSelectionChanging: [{
                type: Output
            }], columnSelectionChanging: [{
                type: Output
            }], columnPin: [{
                type: Output
            }], columnPinned: [{
                type: Output
            }], cellEditEnter: [{
                type: Output
            }], cellEditExit: [{
                type: Output
            }], cellEdit: [{
                type: Output
            }], cellEditDone: [{
                type: Output
            }], rowEditEnter: [{
                type: Output
            }], rowEdit: [{
                type: Output
            }], rowEditDone: [{
                type: Output
            }], rowEditExit: [{
                type: Output
            }], columnInit: [{
                type: Output
            }], sorting: [{
                type: Output
            }], sortingDone: [{
                type: Output
            }], filtering: [{
                type: Output
            }], filteringDone: [{
                type: Output
            }], pagingDone: [{
                type: Output
            }], rowAdded: [{
                type: Output
            }], rowDeleted: [{
                type: Output
            }], rowDelete: [{
                type: Output
            }], rowAdd: [{
                type: Output
            }], columnResized: [{
                type: Output
            }], contextMenu: [{
                type: Output
            }], doubleClick: [{
                type: Output
            }], columnVisibilityChanging: [{
                type: Output
            }], columnVisibilityChanged: [{
                type: Output
            }], columnMovingStart: [{
                type: Output
            }], columnMoving: [{
                type: Output
            }], columnMovingEnd: [{
                type: Output
            }], gridKeydown: [{
                type: Output
            }], rowDragStart: [{
                type: Output
            }], rowDragEnd: [{
                type: Output
            }], gridCopy: [{
                type: Output
            }], expansionStatesChange: [{
                type: Output
            }], rowToggle: [{
                type: Output
            }], rowPinning: [{
                type: Output
            }], rowPinned: [{
                type: Output
            }], activeNodeChange: [{
                type: Output
            }], sortingExpressionsChange: [{
                type: Output
            }], toolbarExporting: [{
                type: Output
            }], rangeSelected: [{
                type: Output
            }], rendered: [{
                type: Output
            }], localeChange: [{
                type: Output
            }], dataChanging: [{
                type: Output
            }], dataChanged: [{
                type: Output
            }], addRowSnackbar: [{
                type: ViewChild,
                args: [IgxSnackbarComponent]
            }], resizeLine: [{
                type: ViewChild,
                args: [IgxGridColumnResizerComponent]
            }], loadingOverlay: [{
                type: ViewChild,
                args: ['loadingOverlay', { read: IgxToggleDirective, static: true }]
            }], loadingOutlet: [{
                type: ViewChild,
                args: ['igxLoadingOverlayOutlet', { read: IgxOverlayOutletDirective, static: true }]
            }], columnList: [{
                type: ContentChildren,
                args: [IgxColumnComponent, { read: IgxColumnComponent, descendants: true }]
            }], actionStrip: [{
                type: ContentChild,
                args: [IgxActionStripComponent]
            }], excelStyleLoadingValuesTemplateDirective: [{
                type: ContentChild,
                args: [IgxExcelStyleLoadingValuesTemplateDirective, { read: IgxExcelStyleLoadingValuesTemplateDirective, static: true }]
            }], emptyFilteredGridTemplate: [{
                type: ViewChild,
                args: ['emptyFilteredGrid', { read: TemplateRef, static: true }]
            }], emptyGridDefaultTemplate: [{
                type: ViewChild,
                args: ['defaultEmptyGrid', { read: TemplateRef, static: true }]
            }], loadingGridDefaultTemplate: [{
                type: ViewChild,
                args: ['defaultLoadingGrid', { read: TemplateRef, static: true }]
            }], parentVirtDir: [{
                type: ViewChild,
                args: ['scrollContainer', { read: IgxGridForOfDirective, static: true }]
            }], headSelectorsTemplates: [{
                type: ContentChildren,
                args: [IgxHeadSelectorDirective, { read: IgxHeadSelectorDirective, descendants: false }]
            }], rowSelectorsTemplates: [{
                type: ContentChildren,
                args: [IgxRowSelectorDirective, { read: IgxRowSelectorDirective, descendants: false }]
            }], dragGhostCustomTemplates: [{
                type: ContentChildren,
                args: [IgxRowDragGhostDirective, { read: TemplateRef, descendants: false }]
            }], verticalScrollContainer: [{
                type: ViewChild,
                args: ['verticalScrollContainer', { read: IgxGridForOfDirective, static: true }]
            }], verticalScroll: [{
                type: ViewChild,
                args: ['verticalScrollHolder', { read: IgxGridForOfDirective, static: true }]
            }], scr: [{
                type: ViewChild,
                args: ['scr', { read: ElementRef, static: true }]
            }], headerSelectorBaseTemplate: [{
                type: ViewChild,
                args: ['headSelectorBaseTemplate', { read: TemplateRef, static: true }]
            }], footer: [{
                type: ViewChild,
                args: ['footer', { read: ElementRef }]
            }], theadRow: [{
                type: ViewChild,
                args: [IgxGridHeaderRowComponent, { static: true }]
            }], groupArea: [{
                type: ViewChild,
                args: [IgxGridGroupByAreaComponent]
            }], tbody: [{
                type: ViewChild,
                args: ['tbody', { static: true }]
            }], pinContainer: [{
                type: ViewChild,
                args: ['pinContainer', { read: ElementRef }]
            }], tfoot: [{
                type: ViewChild,
                args: ['tfoot', { static: true }]
            }], rowEditingOutletDirective: [{
                type: ViewChild,
                args: ['igxRowEditingOverlayOutlet', { read: IgxOverlayOutletDirective, static: true }]
            }], tmpOutlets: [{
                type: ViewChildren,
                args: [IgxTemplateOutletDirective, { read: IgxTemplateOutletDirective }]
            }], dragIndicatorIconBase: [{
                type: ViewChild,
                args: ['dragIndicatorIconBase', { read: TemplateRef, static: true }]
            }], rowEditCustomDirectives: [{
                type: ContentChildren,
                args: [IgxRowEditTemplateDirective, { descendants: false, read: TemplateRef }]
            }], rowEditTextDirectives: [{
                type: ContentChildren,
                args: [IgxRowEditTextDirective, { descendants: false, read: TemplateRef }]
            }], rowAddText: [{
                type: ContentChild,
                args: [IgxRowAddTextDirective, { read: TemplateRef }]
            }], rowEditActionsDirectives: [{
                type: ContentChildren,
                args: [IgxRowEditActionsDirective, { descendants: false, read: TemplateRef }]
            }], rowExpandedIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxRowExpandedIndicatorDirective, { read: TemplateRef }]
            }], rowCollapsedIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxRowCollapsedIndicatorDirective, { read: TemplateRef }]
            }], headerExpandIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxHeaderExpandIndicatorDirective, { read: TemplateRef }]
            }], headerCollapseIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxHeaderCollapseIndicatorDirective, { read: TemplateRef }]
            }], excelStyleHeaderIconTemplate: [{
                type: ContentChild,
                args: [IgxExcelStyleHeaderIconDirective, { read: TemplateRef }]
            }], sortAscendingHeaderIconTemplate: [{
                type: ContentChild,
                args: [IgxSortAscendingHeaderIconDirective, { read: TemplateRef }]
            }], sortDescendingHeaderIconTemplate: [{
                type: ContentChild,
                args: [IgxSortDescendingHeaderIconDirective, { read: TemplateRef }]
            }], sortHeaderIconTemplate: [{
                type: ContentChild,
                args: [IgxSortHeaderIconDirective, { read: TemplateRef }]
            }], dragIndicatorIconTemplates: [{
                type: ContentChildren,
                args: [IgxDragIndicatorIconDirective, { read: TemplateRef, descendants: false }]
            }], rowEditTabsDEFAULT: [{
                type: ViewChildren,
                args: [IgxRowEditTabStopDirective]
            }], rowEditTabsCUSTOM: [{
                type: ContentChildren,
                args: [IgxRowEditTabStopDirective, { descendants: true }]
            }], rowEditingOverlay: [{
                type: ViewChild,
                args: ['rowEditingOverlay', { read: IgxToggleDirective }]
            }], tabindex: [{
                type: HostBinding,
                args: ['attr.tabindex']
            }], hostRole: [{
                type: HostBinding,
                args: ['attr.role']
            }], toolbar: [{
                type: ContentChildren,
                args: [IgxGridToolbarComponent]
            }], paginationComponents: [{
                type: ContentChildren,
                args: [IgxPaginatorComponent]
            }], _outletDirective: [{
                type: ViewChild,
                args: ['igxFilteringOverlayOutlet', { read: IgxOverlayOutletDirective, static: true }]
            }], defaultExpandedTemplate: [{
                type: ViewChild,
                args: ['defaultExpandedTemplate', { read: TemplateRef, static: true }]
            }], defaultCollapsedTemplate: [{
                type: ViewChild,
                args: ['defaultCollapsedTemplate', { read: TemplateRef, static: true }]
            }], defaultESFHeaderIconTemplate: [{
                type: ViewChild,
                args: ['defaultESFHeaderIcon', { read: TemplateRef, static: true }]
            }], _summaryRowList: [{
                type: ViewChildren,
                args: ['summaryRow', { read: IgxSummaryRowComponent }]
            }], _rowList: [{
                type: ViewChildren,
                args: ['row']
            }], _pinnedRowList: [{
                type: ViewChildren,
                args: ['pinnedRow']
            }], defaultRowEditTemplate: [{
                type: ViewChild,
                args: ['defaultRowEditTemplate', { read: TemplateRef, static: true }]
            }], _dataRowList: [{
                type: ViewChildren,
                args: [IgxRowDirective, { read: IgxRowDirective }]
            }], resourceStrings: [{
                type: Input
            }], filteringLogic: [{
                type: Input
            }], filteringExpressionsTree: [{
                type: Input
            }], advancedFilteringExpressionsTree: [{
                type: Input
            }], locale: [{
                type: Input
            }], pagingMode: [{
                type: Input
            }], paging: [{
                type: Input
            }], page: [{
                type: Input
            }], perPage: [{
                type: Input
            }], hideRowSelectors: [{
                type: Input
            }], rowDraggable: [{
                type: Input
            }], rowEditable: [{
                type: Input
            }], height: [{
                type: HostBinding,
                args: ['style.height']
            }, {
                type: Input
            }], hostWidth: [{
                type: HostBinding,
                args: ['style.width']
            }], width: [{
                type: Input
            }], rowHeight: [{
                type: Input
            }], columnWidth: [{
                type: Input
            }], emptyGridMessage: [{
                type: Input
            }], isLoading: [{
                type: Input
            }], emptyFilteredGridMessage: [{
                type: Input
            }], pinning: [{
                type: Input
            }], allowFiltering: [{
                type: Input
            }], allowAdvancedFiltering: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], summaryPosition: [{
                type: Input
            }], summaryCalculationMode: [{
                type: Input
            }], showSummaryOnCollapse: [{
                type: Input
            }], filterStrategy: [{
                type: Input
            }], sortStrategy: [{
                type: Input
            }], selectedRows: [{
                type: Input
            }], hostClass: [{
                type: HostBinding,
                args: ['attr.class']
            }], sortingExpressions: [{
                type: Input
            }], batchEditing: [{
                type: Input
            }], cellSelection: [{
                type: Input
            }], rowSelection: [{
                type: Input
            }], columnSelection: [{
                type: Input
            }], hideActionStrip: [{
                type: HostListener,
                args: ['mouseleave']
            }], expansionStates: [{
                type: Input
            }], outlet: [{
                type: Input
            }], totalRecords: [{
                type: Input
            }], selectRowOnClick: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1iYXNlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9ncmlkLWJhc2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25HLE9BQU8sRUFRSCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osTUFBTSxFQUVOLEtBQUssRUFHTCxTQUFTLEVBS1QsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLFNBQVMsRUFDVCxZQUFZLEVBRWYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLDBCQUEwQixDQUFDO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDaEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JHLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBQ2pILE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxjQUFjLEVBQXdCLE1BQU0sbURBQW1ELENBQUM7QUFFekcsT0FBTyxFQUErQixxQkFB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SztnQkEwQksscUJBQXFCO3NCQUQvQixLQUFLO2dCQW1CSyxjQUFjO3NCQUR4QixLQUFLO2dCQWtCSyxZQUFZO3NCQUR0QixLQUFLO2dCQW9CSyxZQUFZO3NCQUR0QixLQUFLO2dCQWtQSyxTQUFTO3NCQURuQixXQUFXO3VCQUFDLFlBQVk7Z0JBeUJkLGtCQUFrQjtzQkFENUIsS0FBSztnQkFzREssWUFBWTtzQkFEdEIsS0FBSztnQkFxREssYUFBYTtzQkFEdkIsS0FBSztnQkFzQkssWUFBWTtzQkFEdEIsS0FBSztnQkFzQkssZUFBZTtzQkFEekIsS0FBSztnQkEyZUMsZUFBZTtzQkFEckIsWUFBWTt1QkFBQyxZQUFZO2dCQWtzQmYsZUFBZTtzQkFEekIsS0FBSztnQkFtSEssTUFBTTtzQkFEaEIsS0FBSztnQkE4VEssWUFBWTtzQkFEdEIsS0FBSztnQkEybENLLGdCQUFnQjtzQkFEMUIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5ULCBmb3JtYXROdW1iZXIsIGdldExvY2FsZU51bWJlckZvcm1hdCwgTnVtYmVyRm9ybWF0U3R5bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQXBwbGljYXRpb25SZWYsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50RmFjdG9yeSxcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQ29tcG9uZW50UmVmLFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRGlyZWN0aXZlLFxuICAgIERvQ2hlY2ssXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIEluamVjdCxcbiAgICBJbmplY3RvcixcbiAgICBJbnB1dCxcbiAgICBJdGVyYWJsZUNoYW5nZVJlY29yZCxcbiAgICBJdGVyYWJsZURpZmZlcnMsXG4gICAgTE9DQUxFX0lELFxuICAgIE5nTW9kdWxlUmVmLFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE9wdGlvbmFsLFxuICAgIE91dHB1dCxcbiAgICBRdWVyeUxpc3QsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZm9ybWF0RGF0ZSwgcmVzaXplT2JzZXJ2YWJsZSB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0ICdpZ25pdGV1aS10cmlhbC13YXRlcm1hcmsnO1xuaW1wb3J0IHsgU3ViamVjdCwgcGlwZSwgZnJvbUV2ZW50LCBhbmltYXRpb25GcmFtZVNjaGVkdWxlciwgbWVyZ2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgZmlyc3QsIGZpbHRlciwgdGhyb3R0bGVUaW1lLCBtYXAsIHNoYXJlUmVwbGF5LCB0YWtlV2hpbGUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBjbG9uZUFycmF5LCBtZXJnZU9iamVjdHMsIGNvbXBhcmVNYXBzLCByZXNvbHZlTmVzdGVkUGF0aCwgaXNPYmplY3QsIFBsYXRmb3JtVXRpbCB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgR3JpZENvbHVtbkRhdGFUeXBlIH0gZnJvbSAnLi4vZGF0YS1vcGVyYXRpb25zL2RhdGEtdXRpbCc7XG5pbXBvcnQgeyBGaWx0ZXJpbmdMb2dpYywgSUZpbHRlcmluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWV4cHJlc3Npb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IElHcm91cEJ5UmVjb3JkIH0gZnJvbSAnLi4vZGF0YS1vcGVyYXRpb25zL2dyb3VwYnktcmVjb3JkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRm9yT2ZEYXRhQ2hhbmdpbmdFdmVudEFyZ3MsIElneEdyaWRGb3JPZkRpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvZm9yLW9mL2Zvcl9vZi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4VGV4dEhpZ2hsaWdodERpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdGV4dC1oaWdobGlnaHQvdGV4dC1oaWdobGlnaHQuZGlyZWN0aXZlJztcbmltcG9ydCB7IElTdW1tYXJ5RXhwcmVzc2lvbiB9IGZyb20gJy4vc3VtbWFyaWVzL2dyaWQtc3VtbWFyeSc7XG5pbXBvcnQgeyBSb3dFZGl0UG9zaXRpb25TdHJhdGVneSwgSVBpbm5pbmdDb25maWcgfSBmcm9tICcuL2dyaWQuY29tbW9uJztcbmltcG9ydCB7IElneEdyaWRUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL2dyaWQtdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4Um93RGlyZWN0aXZlIH0gZnJvbSAnLi9yb3cuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmUsIElneFRvZ2dsZURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdG9nZ2xlL3RvZ2dsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHtcbiAgICBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsIElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsIEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZVR5cGVcbn0gZnJvbSAnLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1leHByZXNzaW9ucy10cmVlJztcbmltcG9ydCB7IElGaWx0ZXJpbmdPcGVyYXRpb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbiwgVHJhbnNhY3Rpb25UeXBlLCBUcmFuc2FjdGlvblNlcnZpY2UsIFN0YXRlIH0gZnJvbSAnLi4vc2VydmljZXMvcHVibGljX2FwaSc7XG5pbXBvcnQge1xuICAgIElneFJvd0FkZFRleHREaXJlY3RpdmUsXG4gICAgSWd4Um93RWRpdFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIElneFJvd0VkaXRUYWJTdG9wRGlyZWN0aXZlLFxuICAgIElneFJvd0VkaXRUZXh0RGlyZWN0aXZlLFxuICAgIElneFJvd0VkaXRBY3Rpb25zRGlyZWN0aXZlXG59IGZyb20gJy4vZ3JpZC5yb3dFZGl0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hHcmlkTmF2aWdhdGlvblNlcnZpY2UsIElBY3RpdmVOb2RlIH0gZnJvbSAnLi9ncmlkLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBJRGlzcGxheURlbnNpdHlPcHRpb25zLCBEaXNwbGF5RGVuc2l0eVRva2VuLCBEaXNwbGF5RGVuc2l0eUJhc2UsIERpc3BsYXlEZW5zaXR5IH0gZnJvbSAnLi4vY29yZS9kaXNwbGF5RGVuc2l0eSc7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi9maWx0ZXJpbmcvZ3JpZC1maWx0ZXJpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkRmlsdGVyaW5nQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vZmlsdGVyaW5nL2Jhc2UvZ3JpZC1maWx0ZXJpbmctY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgV2F0Y2hDaGFuZ2VzIH0gZnJvbSAnLi93YXRjaC1jaGFuZ2VzJztcbmltcG9ydCB7IElneEdyaWRIZWFkZXJHcm91cENvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVycy9ncmlkLWhlYWRlci1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSUdyaWRSZXNvdXJjZVN0cmluZ3MgfSBmcm9tICcuLi9jb3JlL2kxOG4vZ3JpZC1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgSWd4R3JpZFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi9zdW1tYXJpZXMvZ3JpZC1zdW1tYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4U3VtbWFyeVJvd0NvbXBvbmVudCB9IGZyb20gJy4vc3VtbWFyaWVzL3N1bW1hcnktcm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkU2VsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vc2VsZWN0aW9uL3NlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElneEVkaXRSb3csIElneENlbGwsIElneEFkZFJvdyB9IGZyb20gJy4vY29tbW9uL2NydWQuc2VydmljZSc7XG5pbXBvcnQgeyBJQ2FjaGVkVmlld0xvYWRlZEV2ZW50QXJncywgSWd4VGVtcGxhdGVPdXRsZXREaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3RlbXBsYXRlLW91dGxldC90ZW1wbGF0ZV9vdXRsZXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEV4Y2VsU3R5bGVMb2FkaW5nVmFsdWVzVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuL2ZpbHRlcmluZy9leGNlbC1zdHlsZS9leGNlbC1zdHlsZS1zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRDb2x1bW5SZXNpemVyQ29tcG9uZW50IH0gZnJvbSAnLi9yZXNpemluZy9yZXNpemVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGFyU2VwYXJhdGVkVmFsdWVEYXRhIH0gZnJvbSAnLi4vc2VydmljZXMvY3N2L2NoYXItc2VwYXJhdGVkLXZhbHVlLWRhdGEnO1xuaW1wb3J0IHsgSWd4Q29sdW1uUmVzaXppbmdTZXJ2aWNlIH0gZnJvbSAnLi9yZXNpemluZy9yZXNpemluZy5zZXJ2aWNlJztcbmltcG9ydCB7IEZpbHRlcmluZ1N0cmF0ZWd5LCBJRmlsdGVyaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7XG4gICAgSWd4Um93RXhwYW5kZWRJbmRpY2F0b3JEaXJlY3RpdmUsIElneFJvd0NvbGxhcHNlZEluZGljYXRvckRpcmVjdGl2ZSwgSWd4SGVhZGVyRXhwYW5kSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgIElneEhlYWRlckNvbGxhcHNlSW5kaWNhdG9yRGlyZWN0aXZlLCBJZ3hFeGNlbFN0eWxlSGVhZGVySWNvbkRpcmVjdGl2ZSwgSWd4U29ydEFzY2VuZGluZ0hlYWRlckljb25EaXJlY3RpdmUsXG4gICAgSWd4U29ydERlc2NlbmRpbmdIZWFkZXJJY29uRGlyZWN0aXZlLCBJZ3hTb3J0SGVhZGVySWNvbkRpcmVjdGl2ZVxufSBmcm9tICcuL2dyaWQvZ3JpZC5kaXJlY3RpdmVzJztcbmltcG9ydCB7XG4gICAgR3JpZEtleWRvd25UYXJnZXRUeXBlLFxuICAgIEdyaWRTZWxlY3Rpb25Nb2RlLFxuICAgIEdyaWRTdW1tYXJ5UG9zaXRpb24sXG4gICAgR3JpZFN1bW1hcnlDYWxjdWxhdGlvbk1vZGUsXG4gICAgRmlsdGVyTW9kZSxcbiAgICBDb2x1bW5QaW5uaW5nUG9zaXRpb24sXG4gICAgUm93UGlubmluZ1Bvc2l0aW9uLFxuICAgIEdyaWRQYWdpbmdNb2RlXG59IGZyb20gJy4vY29tbW9uL2VudW1zJztcbmltcG9ydCB7XG4gICAgSUdyaWRDZWxsRXZlbnRBcmdzLFxuICAgIElSb3dTZWxlY3Rpb25FdmVudEFyZ3MsXG4gICAgSVBpbkNvbHVtbkV2ZW50QXJncyxcbiAgICBJR3JpZEVkaXRFdmVudEFyZ3MsXG4gICAgSVJvd0RhdGFFdmVudEFyZ3MsXG4gICAgSUNvbHVtblJlc2l6ZUV2ZW50QXJncyxcbiAgICBJQ29sdW1uTW92aW5nU3RhcnRFdmVudEFyZ3MsXG4gICAgSUNvbHVtbk1vdmluZ0V2ZW50QXJncyxcbiAgICBJQ29sdW1uTW92aW5nRW5kRXZlbnRBcmdzLFxuICAgIElHcmlkS2V5ZG93bkV2ZW50QXJncyxcbiAgICBJUm93RHJhZ1N0YXJ0RXZlbnRBcmdzLFxuICAgIElSb3dEcmFnRW5kRXZlbnRBcmdzLFxuICAgIElHcmlkQ2xpcGJvYXJkRXZlbnQsXG4gICAgSUdyaWRUb29sYmFyRXhwb3J0RXZlbnRBcmdzLFxuICAgIElTZWFyY2hJbmZvLFxuICAgIElDZWxsUG9zaXRpb24sXG4gICAgSVJvd1RvZ2dsZUV2ZW50QXJncyxcbiAgICBJQ29sdW1uU2VsZWN0aW9uRXZlbnRBcmdzLFxuICAgIElQaW5Sb3dFdmVudEFyZ3MsXG4gICAgSUdyaWRTY3JvbGxFdmVudEFyZ3MsXG4gICAgSUdyaWRFZGl0RG9uZUV2ZW50QXJncyxcbiAgICBJQWN0aXZlTm9kZUNoYW5nZUV2ZW50QXJncyxcbiAgICBJU29ydGluZ0V2ZW50QXJncyxcbiAgICBJRmlsdGVyaW5nRXZlbnRBcmdzLFxuICAgIElDb2x1bW5WaXNpYmlsaXR5Q2hhbmdlZEV2ZW50QXJncyxcbiAgICBJQ29sdW1uVmlzaWJpbGl0eUNoYW5naW5nRXZlbnRBcmdzLFxuICAgIElQaW5Db2x1bW5DYW5jZWxsYWJsZUV2ZW50QXJnc1xufSBmcm9tICcuL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHsgSWd4QWR2YW5jZWRGaWx0ZXJpbmdEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2ZpbHRlcmluZy9hZHZhbmNlZC1maWx0ZXJpbmcvYWR2YW5jZWQtZmlsdGVyaW5nLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSwgR3JpZFNlcnZpY2VUeXBlLCBHcmlkVHlwZSwgSUdYX0dSSURfU0VSVklDRV9CQVNFLCBJU2l6ZUluZm8sIFJvd1R5cGUgfSBmcm9tICcuL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEcm9wUG9zaXRpb24gfSBmcm9tICcuL21vdmluZy9tb3Zpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hIZWFkU2VsZWN0b3JEaXJlY3RpdmUsIElneFJvd1NlbGVjdG9yRGlyZWN0aXZlIH0gZnJvbSAnLi9zZWxlY3Rpb24vcm93LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuL2NvbHVtbnMvY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5Hcm91cENvbXBvbmVudCB9IGZyb20gJy4vY29sdW1ucy9jb2x1bW4tZ3JvdXAuY29tcG9uZW50JztcbmltcG9ydCB7IElneFJvd0RyYWdHaG9zdERpcmVjdGl2ZSwgSWd4RHJhZ0luZGljYXRvckljb25EaXJlY3RpdmUgfSBmcm9tICcuL3Jvdy1kcmFnLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hTbmFja2JhckNvbXBvbmVudCB9IGZyb20gJy4uL3NuYWNrYmFyL3NuYWNrYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IElneEFjdGlvblN0cmlwQ29tcG9uZW50IH0gZnJvbSAnLi4vYWN0aW9uLXN0cmlwL2FjdGlvbi1zdHJpcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4R3JpZFJvd0NvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC9ncmlkLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSVBhZ2VFdmVudEFyZ3MgfSBmcm9tICcuLi9wYWdpbmF0b3IvcGFnaW5hdG9yLWludGVyZmFjZXMnO1xuaW1wb3J0IHsgSWd4UGFnaW5hdG9yQ29tcG9uZW50IH0gZnJvbSAnLi4vcGFnaW5hdG9yL3BhZ2luYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4R3JpZEhlYWRlclJvd0NvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVycy9ncmlkLWhlYWRlci1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRHcm91cEJ5QXJlYUNvbXBvbmVudCB9IGZyb20gJy4vZ3JvdXBpbmcvZ3JpZC1ncm91cC1ieS1hcmVhLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hGbGF0VHJhbnNhY3Rpb25GYWN0b3J5LCBUUkFOU0FDVElPTl9UWVBFIH0gZnJvbSAnLi4vc2VydmljZXMvdHJhbnNhY3Rpb24vdHJhbnNhY3Rpb24tZmFjdG9yeS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyaWRTZWxlY3Rpb25SYW5nZSwgSWd4R3JpZFRyYW5zYWN0aW9uIH0gZnJvbSAnLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgVmVydGljYWxBbGlnbm1lbnQsIEhvcml6b250YWxBbGlnbm1lbnQsIFBvc2l0aW9uU2V0dGluZ3MsIE92ZXJsYXlTZXR0aW5ncyB9IGZyb20gJy4uL3NlcnZpY2VzL292ZXJsYXkvdXRpbGl0aWVzJztcbmltcG9ydCB7IElneE92ZXJsYXlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvb3ZlcmxheS9vdmVybGF5JztcbmltcG9ydCB7IENvbm5lY3RlZFBvc2l0aW9uaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi9zZXJ2aWNlcy9vdmVybGF5L3Bvc2l0aW9uL2Nvbm5lY3RlZC1wb3NpdGlvbmluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBDb250YWluZXJQb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi4vc2VydmljZXMvb3ZlcmxheS9wb3NpdGlvbi9jb250YWluZXItcG9zaXRpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHsgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSB9IGZyb20gJy4uL3NlcnZpY2VzL292ZXJsYXkvc2Nyb2xsL2Fic29sdXRlLXNjcm9sbC1zdHJhdGVneSc7XG5pbXBvcnQgeyBBY3Rpb24sIFN0YXRlVXBkYXRlRXZlbnQsIFRyYW5zYWN0aW9uRXZlbnRPcmlnaW4gfSBmcm9tICcuLi9zZXJ2aWNlcy90cmFuc2FjdGlvbi90cmFuc2FjdGlvbic7XG5pbXBvcnQgeyBJU29ydGluZ0V4cHJlc3Npb24sIFNvcnRpbmdEaXJlY3Rpb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBJR3JpZFNvcnRpbmdTdHJhdGVneSB9IGZyb20gJy4vY29tbW9uL3N0cmF0ZWd5JztcbmltcG9ydCB7IElneEdyaWRFeGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9maWx0ZXJpbmcvZXhjZWwtc3R5bGUvZ3JpZC5leGNlbC1zdHlsZS1maWx0ZXJpbmcuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2hlYWRlcnMvZ3JpZC1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRGaWx0ZXJpbmdSb3dDb21wb25lbnQgfSBmcm9tICcuL2ZpbHRlcmluZy9iYXNlL2dyaWQtZmlsdGVyaW5nLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGVmYXVsdERhdGFDbG9uZVN0cmF0ZWd5LCBJRGF0YUNsb25lU3RyYXRlZ3kgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS1jbG9uZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBJZ3hHcmlkQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vY2VsbC5jb21wb25lbnQnO1xuXG5sZXQgRkFLRV9ST1dfSUQgPSAtMTtcbmNvbnN0IERFRkFVTFRfSVRFTVNfUEVSX1BBR0UgPSAxNTtcbmNvbnN0IE1JTklNVU1fQ09MVU1OX1dJRFRIID0gMTM2O1xuY29uc3QgRklMVEVSX1JPV19IRUlHSFQgPSA1MDtcbi8vIEJ5IGRlZmF1bHQgcm93IGVkaXRpbmcgb3ZlcmxheSBvdXRsZXQgaXMgaW5zaWRlIGdyaWQgYm9keSBzbyB0aGF0IG92ZXJsYXkgaXMgaGlkZGVuIGJlbG93IGdyaWQgaGVhZGVyIHdoZW4gc2Nyb2xsaW5nLlxuLy8gSW4gY2FzZXMgd2hlbiBncmlkIGhhcyAxLTIgcm93cyB0aGVyZSBpc24ndCBlbm91Z2ggc3BhY2UgaW4gZ3JpZCBib2R5IGFuZCByb3cgZWRpdGluZyBvdmVybGF5IHNob3VsZCBiZSBzaG93biBhYm92ZSBoZWFkZXIuXG4vLyBEZWZhdWx0IHJvdyBlZGl0aW5nIG92ZXJsYXkgaGVpZ2h0IGlzIGhpZ2hlciB0aGVuIHJvdyBoZWlnaHQgdGhhdCBpcyB3aHkgdGhlIGNhc2UgaXMgdmFsaWQgYWxzbyBmb3Igcm93IHdpdGggMiByb3dzLlxuLy8gTW9yZSBhY2N1cmF0ZSBjYWxjdWxhdGlvbiBpcyBub3QgcG9zc2libGUsIGNhdXNlIHJvdyBlZGl0aW5nIG92ZXJsYXkgaXMgc3RpbGwgbm90IHNob3duIGFuZCB3ZSBkb24ndCBrbm93IGl0cyBoZWlnaHQsXG4vLyBidXQgaW4gdGhlIHNhbWUgdGltZSB3ZSBuZWVkIHRvIHNldCByb3cgZWRpdGluZyBvdmVybGF5IG91dGxldCBiZWZvcmUgb3BlbmluZyB0aGUgb3ZlcmxheSBpdHNlbGYuXG5jb25zdCBNSU5fUk9XX0VESVRJTkdfQ09VTlRfVEhSRVNIT0xEID0gMjtcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSWd4R3JpZEJhc2VEaXJlY3RpdmUgZXh0ZW5kcyBEaXNwbGF5RGVuc2l0eUJhc2UgaW1wbGVtZW50cyBHcmlkVHlwZSxcbiAgICBPbkluaXQsIERvQ2hlY2ssIE9uRGVzdHJveSwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGRpc3BsYXkgdGltZSBmb3IgdGhlIHJvdyBhZGRpbmcgc25hY2tiYXIgbm90aWZpY2F0aW9uLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IGl0IGlzIDYwMDBtcy5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzbmFja2JhckRpc3BsYXlUaW1lID0gNjAwMDtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB3aGV0aGVyIHRvIGF1dG8tZ2VuZXJhdGUgdGhlIGNvbHVtbnMuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIGZhbHNlLiBXaGVuIHNldCB0byB0cnVlLCBpdCB3aWxsIG92ZXJyaWRlIGFsbCBjb2x1bW5zIGRlY2xhcmVkIHRocm91Z2ggY29kZSBvciBpbiBtYXJrdXAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIFtkYXRhXT1cIkRhdGFcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGF1dG9HZW5lcmF0ZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQ29udHJvbHMgd2hldGhlciBjb2x1bW5zIG1vdmluZyBpcyBlbmFibGVkIGluIHRoZSBncmlkLlxuICAgICAqXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbW92aW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgYSBjdXN0b20gdGVtcGxhdGUgd2hlbiBlbXB0eS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCBbaWRdPVwiJ2lneC1ncmlkLTEnXCIgW2RhdGFdPVwiRGF0YVwiIFtlbXB0eUdyaWRUZW1wbGF0ZV09XCJteVRlbXBsYXRlXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBlbXB0eUdyaWRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBhIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgYWRkaW5nIHJvdyBVSSB3aGVuIGdyaWQgaXMgZW1wdHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2lkXT1cIidpZ3gtZ3JpZC0xJ1wiIFtkYXRhXT1cIkRhdGFcIiBbYWRkUm93RW1wdHlUZW1wbGF0ZV09XCJteVRlbXBsYXRlXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBhZGRSb3dFbXB0eVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIGEgY3VzdG9tIHRlbXBsYXRlIHdoZW4gbG9hZGluZy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCBbaWRdPVwiJ2lneC1ncmlkLTEnXCIgW2RhdGFdPVwiRGF0YVwiIFtsb2FkaW5nR3JpZFRlbXBsYXRlXT1cIm15VGVtcGxhdGVcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGxvYWRpbmdHcmlkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBHZXQvU2V0IElneFN1bW1hcnlSb3cgaGVpZ2h0XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHN1bW1hcnlSb3dIZWlnaHQodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zdW1tYXJ5Um93SGVpZ2h0ID0gdmFsdWUgfCAwO1xuICAgICAgICB0aGlzLnN1bW1hcnlTZXJ2aWNlLnN1bW1hcnlIZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnJlZmxvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzdW1tYXJ5Um93SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmhhc1N1bW1hcml6ZWRDb2x1bW5zICYmIHRoaXMucm9vdFN1bW1hcmllc0VuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdW1tYXJ5Um93SGVpZ2h0IHx8IHRoaXMuc3VtbWFyeVNlcnZpY2UuY2FsY01heFN1bW1hcnlIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGRhdGEgY2xvbmUgc3RyYXRlZ3kgb2YgdGhlIGdyaWQgd2hlbiBpbiBlZGl0IG1vZGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtkYXRhQ2xvbmVTdHJhdGVneV09XCJjdXN0b21DbG9uZVN0cmF0ZWd5XCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZGF0YUNsb25lU3RyYXRlZ3koKTogSURhdGFDbG9uZVN0cmF0ZWd5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFDbG9uZVN0cmF0ZWd5O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZGF0YUNsb25lU3RyYXRlZ3koc3RyYXRlZ3k6IElEYXRhQ2xvbmVTdHJhdGVneSkge1xuICAgICAgICBpZiAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFDbG9uZVN0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnMuY2xvbmVTdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udHJvbHMgdGhlIGNvcHkgYmVoYXZpb3Igb2YgdGhlIGdyaWQuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2xpcGJvYXJkT3B0aW9ucyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuYWJsZXMvZGlzYWJsZXMgdGhlIGNvcHkgYmVoYXZpb3JcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmNsdWRlIHRoZSBjb2x1bW5zIGhlYWRlcnMgaW4gdGhlIGNsaXBib2FyZCBvdXRwdXQuXG4gICAgICAgICAqL1xuICAgICAgICBjb3B5SGVhZGVyczogdHJ1ZSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5IHRoZSBjb2x1bW5zIGZvcm1hdHRlcnMgKGlmIGFueSkgb24gdGhlIGRhdGEgaW4gdGhlIGNsaXBib2FyZCBvdXRwdXQuXG4gICAgICAgICAqL1xuICAgICAgICBjb3B5Rm9ybWF0dGVyczogdHJ1ZSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZXBhcmF0b3IgdXNlZCBmb3IgZm9ybWF0dGluZyB0aGUgY29weSBvdXRwdXQuIERlZmF1bHRzIHRvIGBcXHRgLlxuICAgICAgICAgKi9cbiAgICAgICAgc2VwYXJhdG9yOiAnXFx0J1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIGZpbHRlcmluZyBpcyBwZXJmb3JtZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgdGhlIGZpbHRlcmluZyBleHByZXNzaW9ucyB0cmVlIG9mIHRoZSBjb2x1bW4gZm9yIHdoaWNoIGZpbHRlcmluZyB3YXMgcGVyZm9ybWVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIlxuICAgICAqICAgICAgICAgICAgICAoZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlQ2hhbmdlKT1cImZpbHRlcmluZ0V4cHJUcmVlQ2hhbmdlKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBmaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIGFkdmFuY2VkIGZpbHRlcmluZyBpcyBwZXJmb3JtZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgdGhlIGFkdmFuY2VkIGZpbHRlcmluZyBleHByZXNzaW9ucyB0cmVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIlxuICAgICAqICAgICAgICAgICAoYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWVDaGFuZ2UpPVwiYWR2YW5jZWRGaWx0ZXJpbmdFeHByVHJlZUNoYW5nZSgkZXZlbnQpXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gZ3JpZCBpcyBzY3JvbGxlZCBob3Jpem9udGFsbHkvdmVydGljYWxseS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIlxuICAgICAqICAgICAgICAgICAgICAoZ3JpZFNjcm9sbCk9XCJvblNjcm9sbCgkZXZlbnQpXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZ3JpZFNjcm9sbCA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRTY3JvbGxFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDEyLjEuMC4gVXNlIHRoZSBjb3JyZXNwb25kaW5nIG91dHB1dCBleHBvc2VkIGJ5IHRoZSBgaWd4LXBhZ2luYXRvcmAgY29tcG9uZW50IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgdGhlIGN1cnJlbnQgcGFnZSBpcyBjaGFuZ2VkLlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgKHBhZ2VDaGFuZ2UpPVwib25QYWdlQ2hhbmdlKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgb25QYWdlQ2hhbmdlKHBhZ2U6IG51bWJlcikge1xuICAgICAqICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2U7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBwYWdlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDEyLjEuMC4gVXNlIHRoZSBjb3JyZXNwb25kaW5nIG91dHB1dCBleHBvc2VkIGJ5IHRoZSBgaWd4LXBhZ2luYXRvcmAgY29tcG9uZW50IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBgcGVyUGFnZWAgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdyaWQgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIChwZXJQYWdlQ2hhbmdlKT1cIm9uUGVyUGFnZUNoYW5nZSgkZXZlbnQpXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIG9uUGVyUGFnZUNoYW5nZShwZXJQYWdlOiBudW1iZXIpIHtcbiAgICAgKiAgIHRoaXMucGVyUGFnZSA9IHBlclBhZ2U7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBwZXJQYWdlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2xhc3MgPSAnJztcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMi4wLiBXZSBzdWdnZXN0IHVzaW5nIGByb3dDbGFzc2VzYCBwcm9wZXJ0eSBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBHZXRzL1NldHMgdGhlIHN0eWxpbmcgY2xhc3NlcyBhcHBsaWVkIHRvIGFsbCBldmVuIGBJZ3hHcmlkUm93Q29tcG9uZW50YHMgaW4gdGhlIGdyaWQuXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2V2ZW5Sb3dDU1NdPVwiJ2lneC1ncmlkLS1teS1ldmVuLWNsYXNzJ1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZXZlblJvd0NTUyA9ICdpZ3gtZ3JpZF9fdHItLWV2ZW4nO1xuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4yLjAuIFdlIHN1Z2dlc3QgdXNpbmcgYHJvd0NsYXNzZXNgIHByb3BlcnR5IGluc3RlYWRcbiAgICAgKlxuICAgICAqIEdldHMvU2V0cyB0aGUgc3R5bGluZyBjbGFzc2VzIGFwcGxpZWQgdG8gYWxsIG9kZCBgSWd4R3JpZFJvd0NvbXBvbmVudGBzIGluIHRoZSBncmlkLlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwiRGF0YVwiIFtldmVuUm93Q1NTXT1cIidpZ3gtZ3JpZC0tbXktb2RkLWNsYXNzJ1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgb2RkUm93Q1NTID0gJ2lneC1ncmlkX190ci0tb2RkJztcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBjb25kaXRpb25hbCBjbGFzcyBzZWxlY3RvciB0byB0aGUgZ3JpZCdzIHJvdyBlbGVtZW50LlxuICAgICAqIEFjY2VwdHMgYW4gb2JqZWN0IGxpdGVyYWwsIGNvbnRhaW5pbmcga2V5LXZhbHVlIHBhaXJzLFxuICAgICAqIHdoZXJlIHRoZSBrZXkgaXMgdGhlIG5hbWUgb2YgdGhlIENTUyBjbGFzcyBhbmQgdGhlIHZhbHVlIGlzXG4gICAgICogZWl0aGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgYm9vbGVhbiwgb3IgYm9vbGVhbiwgbGlrZSBzbzpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY2FsbGJhY2sgPSAocm93OiBSb3dUeXBlKSA9PiB7IHJldHVybiByb3cuc2VsZWN0ZWQgPiA2OyB9XG4gICAgICogcm93Q2xhc3NlcyA9IHsgJ2NsYXNzTmFtZScgOiB0aGlzLmNhbGxiYWNrIH07XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW3Jvd0NsYXNzZXNdID0gXCJyb3dDbGFzc2VzXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByb3dDbGFzc2VzOiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGNvbmRpdGlvbmFsIHN0eWxlIHByb3BlcnRpZXMgb24gdGhlIGdyaWQgcm93IGVsZW1lbnQuXG4gICAgICogSXQgYWNjZXB0cyBhbiBvYmplY3QgbGl0ZXJhbCB3aGVyZSB0aGUga2V5cyBhcmVcbiAgICAgKiB0aGUgc3R5bGUgcHJvcGVydGllcyBhbmQgdGhlIHZhbHVlIGlzIGFuIGV4cHJlc3Npb24gdG8gYmUgZXZhbHVhdGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBzdHlsZXMgPSB7XG4gICAgICogIGJhY2tncm91bmQ6ICd5ZWxsb3cnLFxuICAgICAqICBjb2xvcjogKHJvdzogUm93VHlwZSkgPT4gcm93LnNlbGVjdGVkIDogJ3JlZCc6ICd3aGl0ZSdcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW3Jvd1N0eWxlc109XCJzdHlsZXNcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJvd1N0eWxlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIHByaW1hcnkga2V5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtwcmltYXJ5S2V5XT1cIidQcm9kdWN0SUQnXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBwcmltYXJ5S2V5OiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgYSB1bmlxdWUgdmFsdWVzIHN0cmF0ZWd5IHVzZWQgYnkgdGhlIEV4Y2VsIFN0eWxlIEZpbHRlcmluZ1xuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBQcm92aWRlcyBhIGNhbGxiYWNrIGZvciBsb2FkaW5nIHVuaXF1ZSBjb2x1bW4gdmFsdWVzIG9uIGRlbWFuZC5cbiAgICAgKiBJZiB0aGlzIHByb3BlcnR5IGlzIHByb3ZpZGVkLCB0aGUgdW5pcXVlIHZhbHVlcyBpdCBnZW5lcmF0ZXMgd2lsbCBiZSB1c2VkIGJ5IHRoZSBFeGNlbCBTdHlsZSBGaWx0ZXJpbmcuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtmaWx0ZXJNb2RlXT1cIidleGNlbFN0eWxlRmlsdGVyJ1wiIFt1bmlxdWVDb2x1bW5WYWx1ZXNTdHJhdGVneV09XCJjb2x1bW5WYWx1ZXNTdHJhdGVneVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdW5pcXVlQ29sdW1uVmFsdWVzU3RyYXRlZ3k6IChjb2x1bW46IENvbHVtblR5cGUsXG4gICAgICAgIGZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZTogSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSxcbiAgICAgICAgZG9uZTogKHZhbHVlczogYW55W10pID0+IHZvaWQpID0+IHZvaWQ7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneEdyaWRFeGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50LCB7IHJlYWQ6IElneEdyaWRFeGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50LCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgZXhjZWxTdHlsZUZpbHRlcmluZ0NvbXBvbmVudHM6IFF1ZXJ5TGlzdDxJZ3hHcmlkRXhjZWxTdHlsZUZpbHRlcmluZ0NvbXBvbmVudD47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IGV4Y2VsU3R5bGVGaWx0ZXJpbmdDb21wb25lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4Y2VsU3R5bGVGaWx0ZXJpbmdDb21wb25lbnRzPy5maXJzdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGhlYWRlckdyb3VwcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlYWRSb3cuZ3JvdXBzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBhIGNlbGwgaXMgY2xpY2tlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJucyB0aGUgYElneEdyaWRDZWxsYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgKGNlbGxDbGljayk9XCJjZWxsQ2xpY2soJGV2ZW50KVwiIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtoZWlnaHRdPVwiJzMwNXB4J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNlbGxDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRDZWxsRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGEgY2VsbCBpcyBzZWxlY3RlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogIFJldHVybnMgdGhlIGBJZ3hHcmlkQ2VsbGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIChzZWxlY3RlZCk9XCJvbkNlbGxTZWxlY3QoJGV2ZW50KVwiIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtoZWlnaHRdPVwiJzMwNXB4J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZENlbGxFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiAgRW1pdHRlZCB3aGVuIGBJZ3hHcmlkUm93Q29tcG9uZW50YCBpcyBzZWxlY3RlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCAocm93U2VsZWN0aW9uQ2hhbmdpbmcpPVwicm93U2VsZWN0aW9uQ2hhbmdpbmcoJGV2ZW50KVwiIFtkYXRhXT1cImxvY2FsRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd1NlbGVjdGlvbkNoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUm93U2VsZWN0aW9uRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogIEVtaXR0ZWQgd2hlbiBgSWd4Q29sdW1uQ29tcG9uZW50YCBpcyBzZWxlY3RlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCAoY29sdW1uU2VsZWN0aW9uQ2hhbmdpbmcpPVwiY29sdW1uU2VsZWN0aW9uQ2hhbmdpbmcoJGV2ZW50KVwiIFtkYXRhXT1cImxvY2FsRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblNlbGVjdGlvbkNoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJQ29sdW1uU2VsZWN0aW9uRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBiZWZvcmUgYElneENvbHVtbkNvbXBvbmVudGAgaXMgcGlubmVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGUgaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSBjb2x1bW4gbWF5IGJlIGNoYW5nZWQgdGhyb3VnaCB0aGUgYGluc2VydEF0SW5kZXhgIHByb3BlcnR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBjb2x1bW5QaW5uaW5nKGV2ZW50KSB7XG4gICAgICogICAgIGlmIChldmVudC5jb2x1bW4uZmllbGQgPT09IFwiTmFtZVwiKSB7XG4gICAgICogICAgICAgZXZlbnQuaW5zZXJ0QXRJbmRleCA9IDA7XG4gICAgICogICAgIH1cbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblBpbiA9IG5ldyBFdmVudEVtaXR0ZXI8SVBpbkNvbHVtbkNhbmNlbGxhYmxlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBhZnRlciBgSWd4Q29sdW1uQ29tcG9uZW50YCBpcyBwaW5uZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBpbmRleCB0aGF0IHRoZSBjb2x1bW4gaXMgaW5zZXJ0ZWQgYXQgbWF5IGJlIGNoYW5nZWQgdGhyb3VnaCB0aGUgYGluc2VydEF0SW5kZXhgIHByb3BlcnR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBjb2x1bW5QaW5uaW5nKGV2ZW50KSB7XG4gICAgICogICAgIGlmIChldmVudC5jb2x1bW4uZmllbGQgPT09IFwiTmFtZVwiKSB7XG4gICAgICogICAgICAgZXZlbnQuaW5zZXJ0QXRJbmRleCA9IDA7XG4gICAgICogICAgIH1cbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblBpbm5lZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBpbkNvbHVtbkV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBjZWxsIGVudGVycyBlZGl0IG1vZGUuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoaXMgZXZlbnQgaXMgY2FuY2VsYWJsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQzIChjZWxsRWRpdEVudGVyKT1cImVkaXRTdGFydCgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiIFtwcmltYXJ5S2V5XT1cIidQcm9kdWN0SUQnXCI+XG4gICAgICogPC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2VsbEVkaXRFbnRlciA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRFZGl0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGNlbGwgZXhpdHMgZWRpdCBtb2RlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkMyAoY2VsbEVkaXRFeGl0KT1cImVkaXRFeGl0KCRldmVudClcIiBbZGF0YV09XCJkYXRhXCIgW3ByaW1hcnlLZXldPVwiJ1Byb2R1Y3RJRCdcIj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjZWxsRWRpdEV4aXQgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdERvbmVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gY2VsbCBoYXMgYmVlbiBlZGl0ZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEV2ZW50IGlzIGZpcmVkIGFmdGVyIGVkaXRpbmcgaXMgY29tcGxldGVkLCB3aGVuIHRoZSBjZWxsIGlzIGV4aXRpbmcgZWRpdCBtb2RlLlxuICAgICAqIFRoaXMgZXZlbnQgaXMgY2FuY2VsYWJsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQzIChjZWxsRWRpdCk9XCJlZGl0RG9uZSgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiIFtwcmltYXJ5S2V5XT1cIidQcm9kdWN0SUQnXCI+XG4gICAgICogPC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2VsbEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgY2VsbCBoYXMgYmVlbiBlZGl0ZWQgYW5kIGVkaXRpbmcgaGFzIGJlZW4gY29tbWl0dGVkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkMyAoY2VsbEVkaXREb25lKT1cImVkaXREb25lKCRldmVudClcIiBbZGF0YV09XCJkYXRhXCIgW3ByaW1hcnlLZXldPVwiJ1Byb2R1Y3RJRCdcIj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjZWxsRWRpdERvbmUgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdERvbmVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gYSByb3cgZW50ZXJzIGVkaXQgbW9kZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRW1pdHRlZCB3aGVuIFtyb3dFZGl0YWJsZV09XCJ0cnVlXCIuXG4gICAgICogVGhpcyBldmVudCBpcyBjYW5jZWxhYmxlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZDMgKHJvd0VkaXRFbnRlcik9XCJlZGl0U3RhcnQoJGV2ZW50KVwiIFtwcmltYXJ5S2V5XT1cIidQcm9kdWN0SUQnXCIgW3Jvd0VkaXRhYmxlXT1cInRydWVcIj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dFZGl0RW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBleGl0aW5nIGVkaXQgbW9kZSBmb3IgYSByb3cuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEVtaXR0ZWQgd2hlbiBbcm93RWRpdGFibGVdPVwidHJ1ZVwiICYgYGVuZEVkaXQodHJ1ZSlgIGlzIGNhbGxlZC5cbiAgICAgKiBFbWl0dGVkIHdoZW4gY2hhbmdpbmcgcm93cyBkdXJpbmcgZWRpdCBtb2RlLCBzZWxlY3RpbmcgYW4gdW4tZWRpdGFibGUgY2VsbCBpbiB0aGUgZWRpdGVkIHJvdyxcbiAgICAgKiBwZXJmb3JtaW5nIHBhZ2luZyBvcGVyYXRpb24sIGNvbHVtbiByZXNpemluZywgcGlubmluZywgbW92aW5nIG9yIGhpdHRpbmcgYERvbmVgXG4gICAgICogYnV0dG9uIGluc2lkZSBvZiB0aGUgcm93RWRpdGluZ092ZXJsYXksIG9yIGhpdHRpbmcgdGhlIGBFbnRlcmAga2V5IHdoaWxlIGVkaXRpbmcgYSBjZWxsLlxuICAgICAqIFRoaXMgZXZlbnQgaXMgY2FuY2VsYWJsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQzIChyb3dFZGl0KT1cImVkaXREb25lKCRldmVudClcIiBbZGF0YV09XCJkYXRhXCIgW3ByaW1hcnlLZXldPVwiJ1Byb2R1Y3RJRCdcIiBbcm93RWRpdGFibGVdPVwidHJ1ZVwiPlxuICAgICAqIDwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd0VkaXQgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgZXhpdGluZyBlZGl0IG1vZGUgZm9yIGEgcm93IGFuZCBlZGl0aW5nIGhhcyBiZWVuIGNvbW1pdHRlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRW1pdHRlZCB3aGVuIFtyb3dFZGl0YWJsZV09XCJ0cnVlXCIgJiBgZW5kRWRpdCh0cnVlKWAgaXMgY2FsbGVkLlxuICAgICAqIEVtaXR0ZWQgd2hlbiBjaGFuZ2luZyByb3dzIGR1cmluZyBlZGl0IG1vZGUsIHNlbGVjdGluZyBhbiB1bi1lZGl0YWJsZSBjZWxsIGluIHRoZSBlZGl0ZWQgcm93LFxuICAgICAqIHBlcmZvcm1pbmcgcGFnaW5nIG9wZXJhdGlvbiwgY29sdW1uIHJlc2l6aW5nLCBwaW5uaW5nLCBtb3Zpbmcgb3IgaGl0dGluZyBgRG9uZWBcbiAgICAgKiBidXR0b24gaW5zaWRlIG9mIHRoZSByb3dFZGl0aW5nT3ZlcmxheSwgb3IgaGl0dGluZyB0aGUgYEVudGVyYCBrZXkgd2hpbGUgZWRpdGluZyBhIGNlbGwuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkMyAocm93RWRpdERvbmUpPVwiZWRpdERvbmUoJGV2ZW50KVwiIFtkYXRhXT1cImRhdGFcIiBbcHJpbWFyeUtleV09XCInUHJvZHVjdElEJ1wiIFtyb3dFZGl0YWJsZV09XCJ0cnVlXCI+XG4gICAgICogPC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93RWRpdERvbmUgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdERvbmVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gcm93IGVkaXRpbmcgaXMgY2FuY2VsZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEVtaXRzIHdoZW4gW3Jvd0VkaXRhYmxlXT1cInRydWVcIiAmIGBlbmRFZGl0KGZhbHNlKWAgaXMgY2FsbGVkLlxuICAgICAqIEVtaXR0ZWQgd2hlbiBjaGFuZ2luZyBoaXR0aW5nIGBFc2NgIGtleSBkdXJpbmcgY2VsbCBlZGl0aW5nIGFuZCB3aGVuIGNsaWNrIG9uIHRoZSBgQ2FuY2VsYCBidXR0b25cbiAgICAgKiBpbiB0aGUgcm93IGVkaXRpbmcgb3ZlcmxheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQzIChyb3dFZGl0RXhpdCk9XCJlZGl0RXhpdCgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiIFtwcmltYXJ5S2V5XT1cIidQcm9kdWN0SUQnXCIgW3Jvd0VkaXRhYmxlXT1cInRydWVcIj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dFZGl0RXhpdCA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRFZGl0RG9uZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBhIGNvbHVtbiBpcyBpbml0aWFsaXplZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJucyB0aGUgY29sdW1uIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgKGNvbHVtbkluaXQpPVwiaW5pdENvbHVtbnMoJGV2ZW50KVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtbkluaXQgPSBuZXcgRXZlbnRFbWl0dGVyPElneENvbHVtbkNvbXBvbmVudD4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYmVmb3JlIHNvcnRpbmcgZXhwcmVzc2lvbnMgYXJlIGFwcGxpZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgYW4gYElTb3J0aW5nRXZlbnRBcmdzYCBvYmplY3QuIGBzb3J0aW5nRXhwcmVzc2lvbnNgIGtleSBob2xkcyB0aGUgc29ydGluZyBleHByZXNzaW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCIgKHNvcnRpbmcpPVwic29ydGluZygkZXZlbnQpXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc29ydGluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SVNvcnRpbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIHNvcnRpbmcgaXMgY29tcGxldGVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBzb3J0aW5nIGV4cHJlc3Npb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIChzb3J0aW5nRG9uZSk9XCJzb3J0aW5nRG9uZSgkZXZlbnQpXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc29ydGluZ0RvbmUgPSBuZXcgRXZlbnRFbWl0dGVyPElTb3J0aW5nRXhwcmVzc2lvbiB8IElTb3J0aW5nRXhwcmVzc2lvbltdPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBiZWZvcmUgZmlsdGVyaW5nIGV4cHJlc3Npb25zIGFyZSBhcHBsaWVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIGFuIGBJRmlsdGVyaW5nRXZlbnRBcmdzYCBvYmplY3QuIGBmaWx0ZXJpbmdFeHByZXNzaW9uc2Aga2V5IGhvbGRzIHRoZSBmaWx0ZXJpbmcgZXhwcmVzc2lvbnMgZm9yIHRoZSBjb2x1bW4uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtoZWlnaHRdPVwiJzMwNXB4J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIChmaWx0ZXJpbmcpPVwiZmlsdGVyaW5nKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBmaWx0ZXJpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElGaWx0ZXJpbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIGZpbHRlcmluZyBpcyBwZXJmb3JtZWQgdGhyb3VnaCB0aGUgVUkuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgdGhlIGZpbHRlcmluZyBleHByZXNzaW9ucyB0cmVlIG9mIHRoZSBjb2x1bW4gZm9yIHdoaWNoIGZpbHRlcmluZyB3YXMgcGVyZm9ybWVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIiAoZmlsdGVyaW5nRG9uZSk9XCJmaWx0ZXJpbmdEb25lKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBmaWx0ZXJpbmdEb25lID0gbmV3IEV2ZW50RW1pdHRlcjxJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlPigpO1xuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSB0aGUgY29ycmVzcG9uZGluZyBvdXRwdXQgZXhwb3NlZCBieSB0aGUgYGlneC1wYWdpbmF0b3JgIGNvbXBvbmVudCBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBFbWl0dGVkIGFmdGVyIHBhZ2luZyBpcyBwZXJmb3JtZWQuXG4gICAgICpcbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJucyBhbiBvYmplY3QgY29uc2lzdGluZyBvZiB0aGUgcHJldmlvdXMgYW5kIG5leHQgcGFnZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtoZWlnaHRdPVwiJzMwNXB4J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIChwYWdpbmdEb25lKT1cInBhZ2luZ0RvbmUoJGV2ZW50KVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHBhZ2luZ0RvbmUgPSBuZXcgRXZlbnRFbWl0dGVyPElQYWdlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGEgcm93IGlzIGFkZGVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBkYXRhIGZvciB0aGUgbmV3IGBJZ3hHcmlkUm93Q29tcG9uZW50YCBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIChyb3dBZGRlZCk9XCJyb3dBZGRlZCgkZXZlbnQpXCIgW2hlaWdodF09XCInMzA1cHgnXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93QWRkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElSb3dEYXRhRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGEgcm93IGlzIGRlbGV0ZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgYW4gYElSb3dEYXRhRXZlbnRBcmdzYCBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIChyb3dEZWxldGVkKT1cInJvd0RlbGV0ZWQoJGV2ZW50KVwiIFtoZWlnaHRdPVwiJzMwNXB4J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd0RlbGV0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElSb3dEYXRhRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1taXRlZCB3aGVuIGRlbGV0aW5nIGEgcm93LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIGV2ZW50IGlzIGNhbmNlbGFibGUuXG4gICAgICogUmV0dXJucyBhbiBgSUdyaWRFZGl0RXZlbnRBcmdzYCBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIChyb3dEZWxldGUpPVwicm93RGVsZXRlKCRldmVudClcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dEZWxldGUgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkRWRpdEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtbWl0ZWQganVzdCBiZWZvcmUgdGhlIG5ld2x5IGFkZGVkIHJvdyBpcyBjb21taXRlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhpcyBldmVudCBpcyBjYW5jZWxhYmxlLlxuICAgICAqIFJldHVybnMgYW4gYElHcmlkRWRpdEV2ZW50QXJnc2Agb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiAocm93QWRkKT1cInJvd0FkZCgkZXZlbnQpXCIgW2hlaWdodF09XCInMzA1cHgnXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93QWRkID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZEVkaXRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIGNvbHVtbiBpcyByZXNpemVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBgSWd4Q29sdW1uQ29tcG9uZW50YCBvYmplY3QncyBvbGQgYW5kIG5ldyB3aWR0aC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgKGNvbHVtblJlc2l6ZWQpPVwicmVzaXppbmcoJGV2ZW50KVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblJlc2l6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElDb2x1bW5SZXNpemVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gYSBjZWxsIGlzIHJpZ2h0IGNsaWNrZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgdGhlIGBJZ3hHcmlkQ2VsbGAgb2JqZWN0LlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgKGNvbnRleHRNZW51KT1cImNvbnRleHRNZW51KCRldmVudClcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjb250ZXh0TWVudSA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRDZWxsRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGEgY2VsbCBpcyBkb3VibGUgY2xpY2tlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJucyB0aGUgYElneEdyaWRDZWxsYCBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIChkb3VibGVDbGljayk9XCJkYmxDbGljaygkZXZlbnQpXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZG91YmxlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkQ2VsbEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYmVmb3JlIGNvbHVtbiB2aXNpYmlsaXR5IGlzIGNoYW5nZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEFyZ3M6IHsgY29sdW1uOiBhbnksIG5ld1ZhbHVlOiBib29sZWFuIH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgKGNvbHVtblZpc2liaWxpdHlDaGFuZ2luZyk9XCJ2aXNpYmlsaXR5Q2hhbmdpbmcoJGV2ZW50KVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblZpc2liaWxpdHlDaGFuZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbHVtblZpc2liaWxpdHlDaGFuZ2luZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgY29sdW1uIHZpc2liaWxpdHkgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQXJnczogeyBjb2x1bW46IElneENvbHVtbkNvbXBvbmVudCwgbmV3VmFsdWU6IGJvb2xlYW4gfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAoY29sdW1uVmlzaWJpbGl0eUNoYW5nZWQpPVwidmlzaWJpbGl0eUNoYW5nZWQoJGV2ZW50KVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtblZpc2liaWxpdHlDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxJQ29sdW1uVmlzaWJpbGl0eUNoYW5nZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gY29sdW1uIG1vdmluZyBzdGFydHMuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgdGhlIG1vdmVkIGBJZ3hDb2x1bW5Db21wb25lbnRgIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgKGNvbHVtbk1vdmluZ1N0YXJ0KT1cIm1vdmluZ1N0YXJ0KCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjb2x1bW5Nb3ZpbmdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbHVtbk1vdmluZ1N0YXJ0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBkdXJpbmcgdGhlIGNvbHVtbiBtb3Zpbmcgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBgSWd4Q29sdW1uQ29tcG9uZW50YCBvYmplY3RzLiBUaGlzIGV2ZW50IGlzIGNhbmNlbGFibGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIChjb2x1bW5Nb3ZpbmcpPVwibW92aW5nKCRldmVudClcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjb2x1bW5Nb3ZpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElDb2x1bW5Nb3ZpbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gY29sdW1uIG1vdmluZyBlbmRzLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBgSWd4Q29sdW1uQ29tcG9uZW50YCBvYmplY3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAoY29sdW1uTW92aW5nRW5kKT1cIm1vdmluZ0VuZHMoJGV2ZW50KVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtbk1vdmluZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbHVtbk1vdmluZ0VuZEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBrZXlkb3duIGlzIHRyaWdnZXJlZCBvdmVyIGVsZW1lbnQgaW5zaWRlIGdyaWQncyBib2R5LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIGV2ZW50IGlzIGZpcmVkIG9ubHkgaWYgdGhlIGtleSBjb21iaW5hdGlvbiBpcyBzdXBwb3J0ZWQgaW4gdGhlIGdyaWQuXG4gICAgICogUmV0dXJuIHRoZSB0YXJnZXQgdHlwZSwgdGFyZ2V0IG9iamVjdCBhbmQgdGhlIG9yaWdpbmFsIGV2ZW50LiBUaGlzIGV2ZW50IGlzIGNhbmNlbGFibGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtZ3JpZCAoZ3JpZEtleWRvd24pPVwiY3VzdG9tS2V5ZG93bigkZXZlbnQpXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZ3JpZEtleWRvd24gPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkS2V5ZG93bkV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBzdGFydCBkcmFnZ2luZyBhIHJvdy5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJuIHRoZSBkcmFnZ2VkIHJvdy5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93RHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUm93RHJhZ1N0YXJ0RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGRyb3BwaW5nIGEgcm93LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm4gdGhlIGRyb3BwZWQgcm93LlxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dEcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxJUm93RHJhZ0VuZEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBhIGNvcHkgb3BlcmF0aW9uIGlzIGV4ZWN1dGVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBGaXJlZCBvbmx5IGlmIGNvcHkgYmVoYXZpb3IgaXMgZW5hYmxlZCB0aHJvdWdoIHRoZSBbYGNsaXBib2FyZE9wdGlvbnNgXXtAbGluayBJZ3hHcmlkQmFzZURpcmVjdGl2ZSNjbGlwYm9hcmRPcHRpb25zfS5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZ3JpZENvcHkgPSBuZXcgRXZlbnRFbWl0dGVyPElHcmlkQ2xpcGJvYXJkRXZlbnQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBleHBhbnNpb25TdGF0ZXNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE1hcDxhbnksIGJvb2xlYW4+PigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiBhIHJvdyBnZXRzIGNoYW5nZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2RhdGFdPVwiZW1wbG95ZWVEYXRhXCIgKHJvd1RvZ2dsZSk9XCJyb3dUb2dnbGUoJGV2ZW50KVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJvd1RvZ2dsZSA9IG5ldyBFdmVudEVtaXR0ZXI8SVJvd1RvZ2dsZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgcGlubmVkIHN0YXRlIG9mIGEgcm93IGlzIGNoYW5nZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2RhdGFdPVwiZW1wbG95ZWVEYXRhXCIgKHJvd1Bpbm5pbmcpPVwicm93UGluKCRldmVudClcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByb3dQaW5uaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUGluUm93RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBwaW5uZWQgc3RhdGUgb2YgYSByb3cgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCBbZGF0YV09XCJlbXBsb3llZURhdGFcIiAocm93UGlubmVkKT1cInJvd1BpbigkZXZlbnQpXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcm93UGlubmVkID0gbmV3IEV2ZW50RW1pdHRlcjxJUGluUm93RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1taXRlZCB3aGVuIHRoZSBhY3RpdmUgbm9kZSBpcyBjaGFuZ2VkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBcbiAgICAgKiA8aWd4LWdyaWQgW2RhdGFdPVwiZGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIChhY3RpdmVOb2RlQ2hhbmdlKT1cImFjdGl2ZU5vZGVDaGFuZ2UoJGV2ZW50KVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGFjdGl2ZU5vZGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPElBY3RpdmVOb2RlQ2hhbmdlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBiZWZvcmUgc29ydGluZyBpcyBwZXJmb3JtZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgdGhlIHNvcnRpbmcgZXhwcmVzc2lvbnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIChzb3J0aW5nRXhwcmVzc2lvbnNDaGFuZ2UpPVwic29ydGluZ0V4cHJDaGFuZ2UoJGV2ZW50KVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNvcnRpbmdFeHByZXNzaW9uc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8SVNvcnRpbmdFeHByZXNzaW9uW10+KCk7XG5cblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBhbiBleHBvcnQgcHJvY2VzcyBpcyBpbml0aWF0ZWQgYnkgdGhlIHVzZXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0b29sYmFyRXhwb3J0aW5nKGV2ZW50OiBJR3JpZFRvb2xiYXJFeHBvcnRFdmVudEFyZ3Mpe1xuICAgICAqICAgICBjb25zdCB0b29sYmFyRXhwb3J0aW5nID0gZXZlbnQ7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB0b29sYmFyRXhwb3J0aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZFRvb2xiYXJFeHBvcnRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiBFbmQgb2YgdG9vbGJhciByZWxhdGVkIGRlZmluaXRpb25zICovXG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gbWFraW5nIGEgcmFuZ2Ugc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSYW5nZSBzZWxlY3Rpb24gY2FuIGJlIG1hZGUgZWl0aGVyIHRocm91Z2ggZHJhZyBzZWxlY3Rpb24gb3IgdGhyb3VnaCBrZXlib2FyZCBzZWxlY3Rpb24uXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJhbmdlU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdyaWRTZWxlY3Rpb25SYW5nZT4oKTtcblxuICAgIC8qKiBFbWl0dGVkIGFmdGVyIHRoZSBuZ0FmdGVyVmlld0luaXQgaG9vay4gQXQgdGhpcyBwb2ludCB0aGUgZ3JpZCBleGlzdHMgaW4gdGhlIERPTSAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByZW5kZXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGxvY2FsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYmVmb3JlIHRoZSBncmlkJ3MgZGF0YSB2aWV3IGlzIGNoYW5nZWQgYmVjYXVzZSBvZiBhIGRhdGEgb3BlcmF0aW9uLCByZWJpbmRpbmcsIGV0Yy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCIgKGRhdGFDaGFuZ2luZyk9J2hhbmRsZURhdGFDaGFuZ2luZ0V2ZW50KCknPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgIEBPdXRwdXQoKVxuICAgICBwdWJsaWMgZGF0YUNoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJRm9yT2ZEYXRhQ2hhbmdpbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIHRoZSBncmlkJ3MgZGF0YSB2aWV3IGlzIGNoYW5nZWQgYmVjYXVzZSBvZiBhIGRhdGEgb3BlcmF0aW9uLCByZWJpbmRpbmcsIGV0Yy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCIgKGRhdGFDaGFuZ2VkKT0naGFuZGxlRGF0YUNoYW5nZWRFdmVudCgpJz48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBkYXRhQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoSWd4U25hY2tiYXJDb21wb25lbnQpXG4gICAgcHVibGljIGFkZFJvd1NuYWNrYmFyOiBJZ3hTbmFja2JhckNvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZChJZ3hHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudClcbiAgICBwdWJsaWMgcmVzaXplTGluZTogSWd4R3JpZENvbHVtblJlc2l6ZXJDb21wb25lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2xvYWRpbmdPdmVybGF5JywgeyByZWFkOiBJZ3hUb2dnbGVEaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBsb2FkaW5nT3ZlcmxheTogSWd4VG9nZ2xlRGlyZWN0aXZlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdpZ3hMb2FkaW5nT3ZlcmxheU91dGxldCcsIHsgcmVhZDogSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZSwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIGxvYWRpbmdPdXRsZXQ6IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmU7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4Q29sdW1uQ29tcG9uZW50LCB7IHJlYWQ6IElneENvbHVtbkNvbXBvbmVudCwgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgICBwdWJsaWMgY29sdW1uTGlzdDogUXVlcnlMaXN0PElneENvbHVtbkNvbXBvbmVudD4gPSBuZXcgUXVlcnlMaXN0PElneENvbHVtbkNvbXBvbmVudD4oKTtcblxuICAgIEBDb250ZW50Q2hpbGQoSWd4QWN0aW9uU3RyaXBDb21wb25lbnQpXG4gICAgcHVibGljIGFjdGlvblN0cmlwOiBJZ3hBY3Rpb25TdHJpcENvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hFeGNlbFN0eWxlTG9hZGluZ1ZhbHVlc1RlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneEV4Y2VsU3R5bGVMb2FkaW5nVmFsdWVzVGVtcGxhdGVEaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBleGNlbFN0eWxlTG9hZGluZ1ZhbHVlc1RlbXBsYXRlRGlyZWN0aXZlOiBJZ3hFeGNlbFN0eWxlTG9hZGluZ1ZhbHVlc1RlbXBsYXRlRGlyZWN0aXZlO1xuXG4gICAgLyoqXG4gICAgICogQSB0ZW1wbGF0ZSByZWZlcmVuY2UgZm9yIHRoZSB0ZW1wbGF0ZSB3aGVuIHRoZSBmaWx0ZXJlZCBncmlkIGlzIGVtcHR5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBlbXB0eVRlbXBhbHRlID0gdGhpcy5ncmlkLmVtcHR5R3JpZFRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2VtcHR5RmlsdGVyZWRHcmlkJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIGVtcHR5RmlsdGVyZWRHcmlkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBBIHRlbXBsYXRlIHJlZmVyZW5jZSBmb3IgdGhlIHRlbXBsYXRlIHdoZW4gdGhlIGdyaWQgaXMgZW1wdHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IGVtcHR5VGVtcGFsdGUgPSB0aGlzLmdyaWQuZW1wdHlHcmlkVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdEVtcHR5R3JpZCcsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBlbXB0eUdyaWREZWZhdWx0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRMb2FkaW5nR3JpZCcsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBsb2FkaW5nR3JpZERlZmF1bHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnc2Nyb2xsQ29udGFpbmVyJywgeyByZWFkOiBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBwYXJlbnRWaXJ0RGlyOiBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmU8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneEhlYWRTZWxlY3RvckRpcmVjdGl2ZSwgeyByZWFkOiBJZ3hIZWFkU2VsZWN0b3JEaXJlY3RpdmUsIGRlc2NlbmRhbnRzOiBmYWxzZSB9KVxuICAgIHB1YmxpYyBoZWFkU2VsZWN0b3JzVGVtcGxhdGVzOiBRdWVyeUxpc3Q8SWd4SGVhZFNlbGVjdG9yRGlyZWN0aXZlPjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFJvd1NlbGVjdG9yRGlyZWN0aXZlLCB7IHJlYWQ6IElneFJvd1NlbGVjdG9yRGlyZWN0aXZlLCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgcm93U2VsZWN0b3JzVGVtcGxhdGVzOiBRdWVyeUxpc3Q8SWd4Um93U2VsZWN0b3JEaXJlY3RpdmU+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4Um93RHJhZ0dob3N0RGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgZHJhZ0dob3N0Q3VzdG9tVGVtcGxhdGVzOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3ZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyJywgeyByZWFkOiBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyB2ZXJ0aWNhbFNjcm9sbENvbnRhaW5lcjogSWd4R3JpZEZvck9mRGlyZWN0aXZlPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3ZlcnRpY2FsU2Nyb2xsSG9sZGVyJywgeyByZWFkOiBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyB2ZXJ0aWNhbFNjcm9sbDogSWd4R3JpZEZvck9mRGlyZWN0aXZlPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3NjcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIHNjcjogRWxlbWVudFJlZjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ2hlYWRTZWxlY3RvckJhc2VUZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBoZWFkZXJTZWxlY3RvckJhc2VUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnZm9vdGVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pXG4gICAgcHVibGljIGZvb3RlcjogRWxlbWVudFJlZjtcblxuICAgIHB1YmxpYyBnZXQgaGVhZGVyQ29udGFpbmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aGVhZFJvdz8uaGVhZGVyRm9yT2Y7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBoZWFkZXJTZWxlY3RvckNvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlYWRSb3c/LmhlYWRlclNlbGVjdG9yQ29udGFpbmVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaGVhZGVyRHJhZ0NvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlYWRSb3c/LmhlYWRlckRyYWdDb250YWluZXI7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBoZWFkZXJHcm91cENvbnRhaW5lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlYWRSb3c/LmhlYWRlckdyb3VwQ29udGFpbmVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZmlsdGVyaW5nUm93KCk6IElneEdyaWRGaWx0ZXJpbmdSb3dDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy50aGVhZFJvdz8uZmlsdGVyUm93O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoSWd4R3JpZEhlYWRlclJvd0NvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgdGhlYWRSb3c6IElneEdyaWRIZWFkZXJSb3dDb21wb25lbnQ7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAVmlld0NoaWxkKElneEdyaWRHcm91cEJ5QXJlYUNvbXBvbmVudClcbiAgICBwdWJsaWMgZ3JvdXBBcmVhOiBJZ3hHcmlkR3JvdXBCeUFyZWFDb21wb25lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3Rib2R5JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgdGJvZHk6IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3BpbkNvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiB9KVxuICAgIHB1YmxpYyBwaW5Db250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3Rmb290JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgdGZvb3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdpZ3hSb3dFZGl0aW5nT3ZlcmxheU91dGxldCcsIHsgcmVhZDogSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZSwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIHJvd0VkaXRpbmdPdXRsZXREaXJlY3RpdmU6IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmU7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGRyZW4oSWd4VGVtcGxhdGVPdXRsZXREaXJlY3RpdmUsIHsgcmVhZDogSWd4VGVtcGxhdGVPdXRsZXREaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgdG1wT3V0bGV0czogUXVlcnlMaXN0PGFueT4gPSBuZXcgUXVlcnlMaXN0PGFueT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdkcmFnSW5kaWNhdG9ySWNvbkJhc2UnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgZHJhZ0luZGljYXRvckljb25CYXNlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFJvd0VkaXRUZW1wbGF0ZURpcmVjdGl2ZSwgeyBkZXNjZW5kYW50czogZmFsc2UsIHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIHJvd0VkaXRDdXN0b21EaXJlY3RpdmVzOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4Um93RWRpdFRleHREaXJlY3RpdmUsIHsgZGVzY2VuZGFudHM6IGZhbHNlLCByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyByb3dFZGl0VGV4dERpcmVjdGl2ZXM6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hSb3dBZGRUZXh0RGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIHJvd0FkZFRleHQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4Um93RWRpdEFjdGlvbnNEaXJlY3RpdmUsIHsgZGVzY2VuZGFudHM6IGZhbHNlLCByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyByb3dFZGl0QWN0aW9uc0RpcmVjdGl2ZXM6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIGEgcm93IGV4cGFuZCBpbmRpY2F0b3IuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hSb3dFeHBhbmRlZEluZGljYXRvckRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyByb3dFeHBhbmRlZEluZGljYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXN0b20gdGVtcGxhdGUsIGlmIGFueSwgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIHJlbmRlcmluZyBhIHJvdyBjb2xsYXBzZSBpbmRpY2F0b3IuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hSb3dDb2xsYXBzZWRJbmRpY2F0b3JEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgcm93Q29sbGFwc2VkSW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIGEgaGVhZGVyIGV4cGFuZCBpbmRpY2F0b3IuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hIZWFkZXJFeHBhbmRJbmRpY2F0b3JEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgaGVhZGVyRXhwYW5kSW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIGEgaGVhZGVyIGNvbGxhcHNlIGluZGljYXRvci5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneEhlYWRlckNvbGxhcHNlSW5kaWNhdG9yRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGhlYWRlckNvbGxhcHNlSW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIGEgcm93IGV4cGFuZCBpbmRpY2F0b3IuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hFeGNlbFN0eWxlSGVhZGVySWNvbkRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBleGNlbFN0eWxlSGVhZGVySWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXN0b20gdGVtcGxhdGUsIGlmIGFueSwgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIHJlbmRlcmluZyBhIGhlYWRlciBzb3J0aW5nIGluZGljYXRvciB3aGVuIGNvbHVtbnMgYXJlIHNvcnRlZCBpbiBhc2Mgb3JkZXIuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hTb3J0QXNjZW5kaW5nSGVhZGVySWNvbkRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBzb3J0QXNjZW5kaW5nSGVhZGVySWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXN0b20gdGVtcGxhdGUsIGlmIGFueSwgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIHJlbmRlcmluZyBhIGhlYWRlciBzb3J0aW5nIGluZGljYXRvciB3aGVuIGNvbHVtbnMgYXJlIHNvcnRlZCBpbiBkZXNjIG9yZGVyLlxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4U29ydERlc2NlbmRpbmdIZWFkZXJJY29uRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIHNvcnREZXNjZW5kaW5nSGVhZGVySWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXN0b20gdGVtcGxhdGUsIGlmIGFueSwgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIHJlbmRlcmluZyBhIGhlYWRlciBzb3J0aW5nIGluZGljYXRvciB3aGVuIGNvbHVtbnMgYXJlIG5vdCBzb3J0ZWQuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hTb3J0SGVhZGVySWNvbkRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBzb3J0SGVhZGVySWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneERyYWdJbmRpY2F0b3JJY29uRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgZHJhZ0luZGljYXRvckljb25UZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hSb3dFZGl0VGFiU3RvcERpcmVjdGl2ZSlcbiAgICBwdWJsaWMgcm93RWRpdFRhYnNERUZBVUxUOiBRdWVyeUxpc3Q8SWd4Um93RWRpdFRhYlN0b3BEaXJlY3RpdmU+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFJvd0VkaXRUYWJTdG9wRGlyZWN0aXZlLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIHJvd0VkaXRUYWJzQ1VTVE9NOiBRdWVyeUxpc3Q8SWd4Um93RWRpdFRhYlN0b3BEaXJlY3RpdmU+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdyb3dFZGl0aW5nT3ZlcmxheScsIHsgcmVhZDogSWd4VG9nZ2xlRGlyZWN0aXZlIH0pXG4gICAgcHVibGljIHJvd0VkaXRpbmdPdmVybGF5OiBJZ3hUb2dnbGVEaXJlY3RpdmU7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci50YWJpbmRleCcpXG4gICAgcHVibGljIHRhYmluZGV4ID0gMDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxuICAgIHB1YmxpYyBob3N0Um9sZSA9ICdncmlkJztcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4R3JpZFRvb2xiYXJDb21wb25lbnQpXG4gICAgcHVibGljIHRvb2xiYXI6IFF1ZXJ5TGlzdDxJZ3hHcmlkVG9vbGJhckNvbXBvbmVudD47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFBhZ2luYXRvckNvbXBvbmVudClcbiAgICBwcm90ZWN0ZWQgcGFnaW5hdGlvbkNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxJZ3hQYWdpbmF0b3JDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdpZ3hGaWx0ZXJpbmdPdmVybGF5T3V0bGV0JywgeyByZWFkOiBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgX291dGxldERpcmVjdGl2ZTogSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdEV4cGFuZGVkVGVtcGxhdGUnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdEV4cGFuZGVkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRDb2xsYXBzZWRUZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBkZWZhdWx0Q29sbGFwc2VkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRFU0ZIZWFkZXJJY29uJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRFU0ZIZWFkZXJJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkcmVuKCdzdW1tYXJ5Um93JywgeyByZWFkOiBJZ3hTdW1tYXJ5Um93Q29tcG9uZW50IH0pXG4gICAgcHJvdGVjdGVkIF9zdW1tYXJ5Um93TGlzdDogUXVlcnlMaXN0PElneFN1bW1hcnlSb3dDb21wb25lbnQ+O1xuXG4gICAgQFZpZXdDaGlsZHJlbigncm93JylcbiAgICBwcml2YXRlIF9yb3dMaXN0OiBRdWVyeUxpc3Q8SWd4R3JpZFJvd0NvbXBvbmVudD47XG5cbiAgICBAVmlld0NoaWxkcmVuKCdwaW5uZWRSb3cnKVxuICAgIHByaXZhdGUgX3Bpbm5lZFJvd0xpc3Q6IFF1ZXJ5TGlzdDxJZ3hHcmlkUm93Q29tcG9uZW50PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdFJvd0VkaXRUZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByaXZhdGUgZGVmYXVsdFJvd0VkaXRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGRyZW4oSWd4Um93RGlyZWN0aXZlLCB7IHJlYWQ6IElneFJvd0RpcmVjdGl2ZSB9KVxuICAgIHByaXZhdGUgX2RhdGFSb3dMaXN0OiBRdWVyeUxpc3Q8SWd4Um93RGlyZWN0aXZlPjtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQnkgZGVmYXVsdCBpdCB1c2VzIEVOIHJlc291cmNlcy5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgcmVzb3VyY2VTdHJpbmdzKHZhbHVlOiBJR3JpZFJlc291cmNlU3RyaW5ncykge1xuICAgICAgICB0aGlzLl9yZXNvdXJjZVN0cmluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9yZXNvdXJjZVN0cmluZ3MsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlU3RyaW5ncygpOiBJR3JpZFJlc291cmNlU3RyaW5ncyB7XG4gICAgICAgIGlmICghdGhpcy5fcmVzb3VyY2VTdHJpbmdzKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNvdXJjZVN0cmluZ3MgPSBDdXJyZW50UmVzb3VyY2VTdHJpbmdzLkdyaWRSZXNTdHJpbmdzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZVN0cmluZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBmaWx0ZXJpbmcgbG9naWMgb2YgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIGRlZmF1bHQgaXMgQU5ELlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCIgW2ZpbHRlcmluZ0xvZ2ljXT1cImZpbHRlcmluZ1wiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQFdhdGNoQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGZpbHRlcmluZ0xvZ2ljKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLm9wZXJhdG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZmlsdGVyaW5nTG9naWModmFsdWU6IEZpbHRlcmluZ0xvZ2ljKSB7XG4gICAgICAgIHRoaXMuX2ZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZS5vcGVyYXRvciA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgZmlsdGVyaW5nIHN0YXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cIkRhdGFcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIiBbKGZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSldPVwibW9kZWwuZmlsdGVyaW5nRXhwcmVzc2lvbnNcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqIEByZW1hcmtzXG4gICAgICogU3VwcG9ydHMgdHdvLXdheSBiaW5kaW5nLlxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBmaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBmaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSAodmFsdWUgYXMgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB2YWwuZmlsdGVyaW5nT3BlcmFuZHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodmFsLmZpbHRlcmluZ09wZXJhbmRzW2luZGV4XSBpbnN0YW5jZW9mIEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbnNUcmVlID0gbmV3IEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZShGaWx0ZXJpbmdMb2dpYy5BbmQsIHZhbC5maWx0ZXJpbmdPcGVyYW5kc1tpbmRleF0uZmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3RXhwcmVzc2lvbnNUcmVlLmZpbHRlcmluZ09wZXJhbmRzLnB1c2godmFsLmZpbHRlcmluZ09wZXJhbmRzW2luZGV4XSBhcyBJRmlsdGVyaW5nRXhwcmVzc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5maWx0ZXJpbmdPcGVyYW5kc1tpbmRleF0gPSBuZXdFeHByZXNzaW9uc1RyZWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZS50eXBlID0gRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlVHlwZS5SZWd1bGFyO1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmluZ1BpcGVUcmlnZ2VyKys7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZUNoYW5nZS5lbWl0KHRoaXMuX2ZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcmluZ1NlcnZpY2UuaXNGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWVFbXB0eSh0aGlzLl9maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlRW1wdHkodGhpcy5fYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZpbHRlcmluZ1NlcnZpY2UucmVmcmVzaEV4cHJlc3Npb25zKCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJIZWFkZXJDQlN0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLnN1bW1hcnlTZXJ2aWNlLmNsZWFyU3VtbWFyeUNhY2hlKCk7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgYWR2YW5jZWQgZmlsdGVyaW5nIHN0YXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlID0gdGhpcy5ncmlkLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlO1xuICAgICAqIHRoaXMuZ3JpZC5hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSA9IGxvZ2ljO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBhZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKSB7XG4gICAgICAgICAgICB2YWx1ZS50eXBlID0gRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlVHlwZS5BZHZhbmNlZDtcbiAgICAgICAgICAgIHRoaXMuX2FkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmluZ1BpcGVUcmlnZ2VyKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZUNoYW5nZS5lbWl0KHRoaXMuX2FkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKTtcblxuICAgICAgICBpZiAodGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlRW1wdHkodGhpcy5fZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKSAmJlxuICAgICAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlRW1wdHkodGhpcy5fYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJIZWFkZXJDQlN0YXRlKCk7XG4gICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoKTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG5cbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGNoYW5nZSBkZXRlY3Rpb24gdG8gdXBkYXRlIGZpbHRlcmVkIGRhdGEgdGhyb3VnaCB0aGUgcGlwZXMgYW5kIHRoZW4gZW1pdCB0aGUgZXZlbnQuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmZpbHRlcmluZ0RvbmUuZW1pdCh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgbG9jYWxlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJZiBub3Qgc2V0LCByZXR1cm5zIGJyb3dzZXIncyBsYW5ndWFnZS5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgbG9jYWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBsb2NhbGUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX2xvY2FsZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW5jeVBvc2l0aW9uTGVmdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoKTtcbiAgICAgICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbGVDaGFuZ2UubmV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHBhZ2luZ01vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYWdpbmdNb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcGFnaW5nTW9kZSh2YWw6IEdyaWRQYWdpbmdNb2RlKSB7XG4gICAgICAgIHRoaXMuX3BhZ2luZ01vZGUgPSB2YWw7XG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMS4wLiBVc2UgdGhlIGNvcnJlc3BvbmRpbmcgbWV0aG9kIGV4cG9zZWQgYnkgdGhlIGBpZ3gtcGFnaW5hdG9yYFxuICAgICAqXG4gICAgICogR2V0cy9TZXRzIHdoZXRoZXIgdGhlIHBhZ2luZyBmZWF0dXJlIGlzIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIGRlZmF1bHQgc3RhdGUgaXMgZGlzYWJsZWQgKGZhbHNlKS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPlxuICAgICAqICA8aWd4LXBhZ2luYXRvcj48L2lneC1wYWdpbmF0b3I+XG4gICAgICogPC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgcGFnaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFnaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcGFnaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3BhZ2luZyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSBgcGFnZWAgcHJvcGVydHkgZm9ybSBgcGFnaW5hdG9yYCBjb21wb25lbnQgaW5zdGVhZFxuICAgICAqXG4gICAgICogR2V0cy9TZXRzIHRoZSBjdXJyZW50IHBhZ2UgaW5kZXguXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+XG4gICAgICogIDxpZ3gtcGFnaW5hdG9yIFsocGFnZSldPVwibW9kZWwucGFnZVwiPjwvaWd4LXBhZ2luYXRvcj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqIEByZW1hcmtzXG4gICAgICogU3VwcG9ydHMgdHdvLXdheSBiaW5kaW5nLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBwYWdlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2luYXRvcj8ucGFnZSB8fCAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcGFnZSh2YWw6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2UgPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDEyLjEuMC4gVXNlIGBwZXJQYWdlYCBwcm9wZXJ0eSBmcm9tIGBwYWdpbmF0b3JgIGNvbXBvbmVudCBpbnN0ZWFkXG4gICAgICpcbiAgICAgKiBHZXRzL1NldHMgdGhlIG51bWJlciBvZiB2aXNpYmxlIGl0ZW1zIHBlciBwYWdlLlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBkZWZhdWx0IGlzIDE1LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+XG4gICAgICogIDxpZ3gtcGFnaW5hdG9yIFsocGVyUGFnZSldPVwibW9kZWwucGVyUGFnZVwiPjwvaWd4LXBhZ2luYXRvcj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBwZXJQYWdlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2luYXRvcj8ucGVyUGFnZSB8fCBERUZBVUxUX0lURU1TX1BFUl9QQUdFO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcGVyUGFnZSh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9wZXJQYWdlID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLnBlclBhZ2UgPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgaWYgdGhlIHJvdyBzZWxlY3RvcnMgYXJlIGhpZGRlbi5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogIEJ5IGRlZmF1bHQgcm93IHNlbGVjdG9ycyBhcmUgc2hvd25cbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaGlkZVJvd1NlbGVjdG9ycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hpZGVSb3dTZWxlY3RvcnM7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBoaWRlUm93U2VsZWN0b3JzKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2hpZGVSb3dTZWxlY3RvcnMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB3aGV0aGVyIHJvd3MgY2FuIGJlIG1vdmVkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtyb3dEcmFnZ2FibGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHJvd0RyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd0RyYWcgJiYgdGhpcy5oYXNWaXNpYmxlQ29sdW1ucztcbiAgICB9XG5cblxuICAgIHB1YmxpYyBzZXQgcm93RHJhZ2dhYmxlKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9yb3dEcmFnID0gdmFsO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByb3dEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcm93IElEIHRoYXQgaXMgYmVpbmcgZHJhZ2dlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIHJvdyBJRCBpcyBlaXRoZXIgdGhlIHByaW1hcnlLZXkgdmFsdWUgb3IgdGhlIGRhdGEgcmVjb3JkIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBkcmFnUm93SUQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHdoZXRoZXIgdGhlIHJvd3MgYXJlIGVkaXRhYmxlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byBmYWxzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW3Jvd0VkaXRhYmxlXT1cInRydWVcIiBbcHJpbWFyeUtleV09XCInUHJvZHVjdElEJ1wiID48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCByb3dFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvd0VkaXRhYmxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcm93RWRpdGFibGUodmFsOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdCkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoR3JpZFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcm93RWRpdGFibGUgPSB2YWw7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgaGVpZ2h0LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cIkRhdGFcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaGVpZ2h0KHZhbHVlOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgICAgIGlmICh0aGlzLl9oZWlnaHQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpXG4gICAgcHVibGljIGdldCBob3N0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aCB8fCB0aGlzLl9ob3N0V2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSB3aWR0aCBvZiB0aGUgZ3JpZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBncmlkV2lkdGggPSB0aGlzLmdyaWQud2lkdGg7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQFdhdGNoQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHdpZHRoKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB3aWR0aCh2YWx1ZTogc3RyaW5nIHwgbnVsbCkge1xuICAgICAgICBpZiAodGhpcy5fd2lkdGggIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB3aWR0aCBvZiB0aGUgaGVhZGVyLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogbGV0IGdyaWRIZWFkZXJXaWR0aCA9IHRoaXMuZ3JpZC5oZWFkZXJXaWR0aDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRlcldpZHRoKCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy53aWR0aCwgMTApIC0gMTc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSByb3cgaGVpZ2h0LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtyb3dIZWlnaHRdPVwiMTAwXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgcm93SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm93SGVpZ2h0ID8gdGhpcy5fcm93SGVpZ2h0IDogdGhpcy5kZWZhdWx0Um93SGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgcm93SGVpZ2h0KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3Jvd0hlaWdodCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBkZWZhdWx0IHdpZHRoIG9mIHRoZSBjb2x1bW5zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtjb2x1bW5XaWR0aF09XCIxMDBcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBjb2x1bW5XaWR0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1uV2lkdGg7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgY29sdW1uV2lkdGgodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9jb2x1bW5XaWR0aCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmNvbHVtbldpZHRoU2V0QnlVc2VyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldC9TZXRzIHRoZSBtZXNzYWdlIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyByZWNvcmRzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cIkRhdGFcIiBbZW1wdHlHcmlkTWVzc2FnZV09XCInVGhlIGdyaWQgaXMgZW1wdHknXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZW1wdHlHcmlkTWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2VtcHR5R3JpZE1lc3NhZ2UgPSB2YWx1ZTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlbXB0eUdyaWRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbXB0eUdyaWRNZXNzYWdlIHx8IHRoaXMucmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX2VtcHR5R3JpZF9tZXNzYWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB3aGV0aGVyIHRoZSBncmlkIGlzIGdvaW5nIHRvIHNob3cgYSBsb2FkaW5nIGluZGljYXRvci5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2lzTG9hZGluZ109XCJ0cnVlXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgaXNMb2FkaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0xvYWRpbmcgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9pc0xvYWRpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICghIXRoaXMuZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZhbHVhdGVMb2FkaW5nU3RhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIHdhaXQgZm9yIHRoZSBjdXJyZW50IGRldGVjdGlvbiBjeWNsZSB0byBlbmQgYmVmb3JlIHRyaWdnZXJpbmcgYSBuZXcgb25lLlxuICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaXNMb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNMb2FkaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB3aGV0aGVyIHRoZSBjb2x1bW5zIHNob3VsZCBiZSBhdXRvLWdlbmVyYXRlZCBvbmNlIGFnYWluIGFmdGVyIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgZ3JpZFxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIHdpbGwgYWxsb3cgdG8gYmluZCB0aGUgZ3JpZCB0byByZW1vdGUgZGF0YSBhbmQgaGF2aW5nIGF1dG8tZ2VuZXJhdGVkIGNvbHVtbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICAgKiBOb3RlIHRoYXQgYWZ0ZXIgZ2VuZXJhdGluZyB0aGUgY29sdW1ucywgdGhpcyBwcm9wZXJ0eSB3b3VsZCBiZSBkaXNhYmxlZCB0byBhdm9pZCByZS1jcmVhdGluZ1xuICAgICAqIGNvbHVtbnMgZWFjaCB0aW1lIGEgbmV3IGRhdGEgaXMgYXNzaWduZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIHRoaXMuZ3JpZC5zaG91bGRHZW5lcmF0ZSA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNob3VsZEdlbmVyYXRlOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBtZXNzYWdlIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyByZWNvcmRzIGFuZCB0aGUgZ3JpZCBpcyBmaWx0ZXJlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2VtcHR5R3JpZE1lc3NhZ2VdPVwiJ1RoZSBncmlkIGlzIGVtcHR5J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGVtcHR5RmlsdGVyZWRHcmlkTWVzc2FnZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2VtcHR5RmlsdGVyZWRHcmlkTWVzc2FnZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZW1wdHlGaWx0ZXJlZEdyaWRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbXB0eUZpbHRlcmVkR3JpZE1lc3NhZ2UgfHwgdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZW1wdHlGaWx0ZXJlZEdyaWRfbWVzc2FnZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGluaXRpYWwgcGlubmluZyBjb25maWd1cmF0aW9uLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBBbGxvd3MgdG8gYXBwbHkgcGlubmluZyB0aGUgY29sdW1ucyB0byB0aGUgc3RhcnQgb3IgdGhlIGVuZC5cbiAgICAgKiBOb3RlIHRoYXQgcGlubmluZyB0byBib3RoIHNpZGVzIGF0IGEgdGltZSBpcyBub3QgYWxsb3dlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW3Bpbm5pbmddPVwicGlubmluZ0NvbmZpZ1wiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHBpbm5pbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9waW5uaW5nO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IHBpbm5pbmcodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9waW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0Q2FjaGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGlubmluZyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBpZiB0aGUgZmlsdGVyaW5nIGlzIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2FsbG93RmlsdGVyaW5nXT1cInRydWVcIiBbaGVpZ2h0XT1cIiczMDVweCdcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBhbGxvd0ZpbHRlcmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbG93RmlsdGVyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYWxsb3dGaWx0ZXJpbmcodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FsbG93RmlsdGVyaW5nICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fYWxsb3dGaWx0ZXJpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5yZWdpc3RlclNWR0ljb25zKCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5faW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY0dyaWRIZWFkUm93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5pc0ZpbHRlclJvd1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5maWx0ZXJlZENvbHVtbiA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgYWR2YW5jZWQgZmlsdGVyaW5nIGlzIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2FsbG93QWR2YW5jZWRGaWx0ZXJpbmddPVwidHJ1ZVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGFsbG93QWR2YW5jZWRGaWx0ZXJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxvd0FkdmFuY2VkRmlsdGVyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYWxsb3dBZHZhbmNlZEZpbHRlcmluZyh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fYWxsb3dBZHZhbmNlZEZpbHRlcmluZyAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FsbG93QWR2YW5jZWRGaWx0ZXJpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5yZWdpc3RlclNWR0ljb25zKCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5faW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgZmlsdGVyIG1vZGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2ZpbHRlck1vZGVdPVwiJ3F1aWNrRmlsdGVyJ1wiIFtoZWlnaHRdPVwiJzMwNXB4J1wiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IGl0J3Mgc2V0IHRvIEZpbHRlck1vZGUucXVpY2tGaWx0ZXIuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGZpbHRlck1vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWx0ZXJNb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZmlsdGVyTW9kZSh2YWx1ZTogRmlsdGVyTW9kZSkge1xuICAgICAgICB0aGlzLl9maWx0ZXJNb2RlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyaW5nU2VydmljZS5pc0ZpbHRlclJvd1Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nUm93LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgc3VtbWFyeSBwb3NpdGlvbi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBzdW1tYXJ5UG9zaXRpb249XCJ0b3BcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqIEByZW1hcmtzXG4gICAgICogQnkgZGVmYXVsdCBpdCBpcyBib3R0b20uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHN1bW1hcnlQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1bW1hcnlQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHN1bW1hcnlQb3NpdGlvbih2YWx1ZTogR3JpZFN1bW1hcnlQb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9zdW1tYXJ5UG9zaXRpb24gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBzdW1tYXJ5IGNhbGN1bGF0aW9uIG1vZGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgc3VtbWFyeUNhbGN1bGF0aW9uTW9kZT1cInJvb3RMZXZlbE9ubHlcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqIEByZW1hcmtzXG4gICAgICogQnkgZGVmYXVsdCBpdCBpcyByb290QW5kQ2hpbGRMZXZlbHMgd2hpY2ggbWVhbnMgdGhlIHN1bW1hcmllcyBhcmUgY2FsY3VsYXRlZCBmb3IgdGhlIHJvb3QgbGV2ZWwgYW5kIGVhY2ggY2hpbGQgbGV2ZWwuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHN1bW1hcnlDYWxjdWxhdGlvbk1vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc3VtbWFyeUNhbGN1bGF0aW9uTW9kZSh2YWx1ZTogR3JpZFN1bW1hcnlDYWxjdWxhdGlvbk1vZGUpIHtcbiAgICAgICAgdGhpcy5fc3VtbWFyeUNhbGN1bGF0aW9uTW9kZSA9IHZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMuX2luaXQpIHtcbiAgICAgICAgICAgIHRoaXMuY3J1ZFNlcnZpY2UuZW5kRWRpdChmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnN1bW1hcnlTZXJ2aWNlLnJlc2V0U3VtbWFyeUhlaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udHJvbHMgd2hldGhlciB0aGUgc3VtbWFyeSByb3cgaXMgdmlzaWJsZSB3aGVuIGdyb3VwQnkvcGFyZW50IHJvdyBpcyBjb2xsYXBzZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW3Nob3dTdW1tYXJ5T25Db2xsYXBzZV09XCJ0cnVlXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEJ5IGRlZmF1bHQgc2hvd1N1bW1hcnlPbkNvbGxhcHNlIGlzIHNldCB0byAnZmFsc2UnIHdoaWNoIG1lYW5zIHRoYXQgdGhlIHN1bW1hcnkgcm93IGlzIG5vdCB2aXNpYmxlXG4gICAgICogd2hlbiB0aGUgZ3JvdXBCeS9wYXJlbnQgcm93IGlzIGNvbGxhcHNlZC5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgc2hvd1N1bW1hcnlPbkNvbGxhcHNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hvd1N1bW1hcnlPbkNvbGxhcHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2hvd1N1bW1hcnlPbkNvbGxhcHNlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Nob3dTdW1tYXJ5T25Db2xsYXBzZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGZpbHRlcmluZyBzdHJhdGVneSBvZiB0aGUgZ3JpZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2ZpbHRlclN0cmF0ZWd5XT1cImZpbHRlclN0cmF0ZWd5XCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZmlsdGVyU3RyYXRlZ3koKTogSUZpbHRlcmluZ1N0cmF0ZWd5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlclN0cmF0ZWd5O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZmlsdGVyU3RyYXRlZ3koY2xhc3NSZWY6IElGaWx0ZXJpbmdTdHJhdGVneSkge1xuICAgICAgICB0aGlzLl9maWx0ZXJTdHJhdGVneSA9IGNsYXNzUmVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgc29ydGluZyBzdHJhdGVneSBvZiB0aGUgZ3JpZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW3NvcnRTdHJhdGVneV09XCJzb3J0U3RyYXRlZ3lcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzb3J0U3RyYXRlZ3koKTogSUdyaWRTb3J0aW5nU3RyYXRlZ3kge1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZ1N0cmF0ZWd5O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc29ydFN0cmF0ZWd5KHZhbHVlOiBJR3JpZFNvcnRpbmdTdHJhdGVneSkge1xuICAgICAgICB0aGlzLl9zb3J0aW5nU3RyYXRlZ3kgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHN0YXRlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXByZXNlbnRzIHRoZSBzZWxlY3RlZCByb3dzJyBJRHMgKHByaW1hcnkga2V5IG9yIHJvd0RhdGEpXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIHByaW1hcnlLZXk9XCJJRFwiIHJvd1NlbGVjdGlvbj1cIm11bHRpcGxlXCIgW3NlbGVjdGVkUm93c109XCJbMCwgMSwgMl1cIj48aWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkUm93cyhyb3dJRHM6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0Um93cyhyb3dJRHMgfHwgW10sIHRydWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRSb3dzKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uU2VydmljZS5nZXRTZWxlY3RlZFJvd3MoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBhbGwgYElneEdyaWRIZWFkZXJHcm91cENvbXBvbmVudGAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBoZWFkZXJHcm91cHNMaXN0ID0gdGhpcy5ncmlkLmhlYWRlckdyb3Vwc0xpc3Q7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoZWFkZXJHcm91cHNMaXN0KCk6IElneEdyaWRIZWFkZXJHcm91cENvbXBvbmVudFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlYWRSb3cuZ3JvdXBzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBhbGwgYElneEdyaWRIZWFkZXJDb21wb25lbnRgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgaGVhZGVycyA9IHRoaXMuZ3JpZC5oZWFkZXJDZWxsTGlzdDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRlckNlbGxMaXN0KCk6IElneEdyaWRIZWFkZXJDb21wb25lbnRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYWRlckdyb3Vwc0xpc3QubWFwKGhlYWRlckdyb3VwID0+IGhlYWRlckdyb3VwLmhlYWRlcikuZmlsdGVyKGhlYWRlciA9PiBoZWFkZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBhbGwgYElneEdyaWRGaWx0ZXJpbmdDZWxsQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGZpbHRlckNlbGxzID0gdGhpcy5ncmlkLmZpbHRlckNlbGxMaXN0O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZmlsdGVyQ2VsbExpc3QoKTogSWd4R3JpZEZpbHRlcmluZ0NlbGxDb21wb25lbnRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYWRlckdyb3Vwc0xpc3QubWFwKGdyb3VwID0+IGdyb3VwLmZpbHRlcikuZmlsdGVyKGNlbGwgPT4gY2VsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHN1bW1hcmllc1Jvd0xpc3QoKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBRdWVyeUxpc3Q8YW55PigpO1xuICAgICAgICBpZiAoIXRoaXMuX3N1bW1hcnlSb3dMaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1bUxpc3QgPSB0aGlzLl9zdW1tYXJ5Um93TGlzdC5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IG51bGwpO1xuICAgICAgICByZXMucmVzZXQoc3VtTGlzdCk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBsaXN0IG9mIGBJZ3hHcmlkUm93Q29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHJvd0xpc3QgPSB0aGlzLmdyaWQucm93TGlzdDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJvd0xpc3QoKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBRdWVyeUxpc3Q8SWd4Um93RGlyZWN0aXZlPigpO1xuICAgICAgICBpZiAoIXRoaXMuX3Jvd0xpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgckxpc3QgPSB0aGlzLl9yb3dMaXN0XG4gICAgICAgICAgICAuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBudWxsKVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcbiAgICAgICAgcmVzLnJlc2V0KHJMaXN0KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGxpc3Qgb2YgY3VycmVudGx5IHJlbmRlcmVkIGBJZ3hHcmlkUm93Q29tcG9uZW50YCdzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZGF0YUxpc3QgPSB0aGlzLmdyaWQuZGF0YVJvd0xpc3Q7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBkYXRhUm93TGlzdCgpOiBRdWVyeUxpc3Q8SWd4Um93RGlyZWN0aXZlPiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBRdWVyeUxpc3Q8SWd4Um93RGlyZWN0aXZlPigpO1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGFSb3dMaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJMaXN0ID0gdGhpcy5fZGF0YVJvd0xpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gbnVsbCkuc29ydCgoYSwgYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpO1xuICAgICAgICByZXMucmVzZXQockxpc3QpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRTZWxlY3RvclRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPElneEhlYWRTZWxlY3RvckRpcmVjdGl2ZT4ge1xuICAgICAgICBpZiAodGhpcy5oZWFkU2VsZWN0b3JzVGVtcGxhdGVzICYmIHRoaXMuaGVhZFNlbGVjdG9yc1RlbXBsYXRlcy5maXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZFNlbGVjdG9yc1RlbXBsYXRlcy5maXJzdC50ZW1wbGF0ZVJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzUGlubmluZ1RvU3RhcnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpbm5pbmcuY29sdW1ucyAhPT0gQ29sdW1uUGlubmluZ1Bvc2l0aW9uLkVuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1Jvd1Bpbm5pbmdUb1RvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlubmluZy5yb3dzICE9PSBSb3dQaW5uaW5nUG9zaXRpb24uQm90dG9tO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJvd1NlbGVjdG9yVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8SWd4Um93U2VsZWN0b3JEaXJlY3RpdmU+IHtcbiAgICAgICAgaWYgKHRoaXMucm93U2VsZWN0b3JzVGVtcGxhdGVzICYmIHRoaXMucm93U2VsZWN0b3JzVGVtcGxhdGVzLmZpcnN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dTZWxlY3RvcnNUZW1wbGF0ZXMuZmlyc3QudGVtcGxhdGVSZWY7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCByb3dPdXRsZXREaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd0VkaXRpbmdPdXRsZXREaXJlY3RpdmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBhcmVudFJvd091dGxldERpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0bGV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCByb3dFZGl0Q3VzdG9tKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICBpZiAodGhpcy5yb3dFZGl0Q3VzdG9tRGlyZWN0aXZlcyAmJiB0aGlzLnJvd0VkaXRDdXN0b21EaXJlY3RpdmVzLmZpcnN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dFZGl0Q3VzdG9tRGlyZWN0aXZlcy5maXJzdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcm93RWRpdFRleHQoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIGlmICh0aGlzLnJvd0VkaXRUZXh0RGlyZWN0aXZlcyAmJiB0aGlzLnJvd0VkaXRUZXh0RGlyZWN0aXZlcy5maXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93RWRpdFRleHREaXJlY3RpdmVzLmZpcnN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCByb3dFZGl0QWN0aW9ucygpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgaWYgKHRoaXMucm93RWRpdEFjdGlvbnNEaXJlY3RpdmVzICYmIHRoaXMucm93RWRpdEFjdGlvbnNEaXJlY3RpdmVzLmZpcnN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dFZGl0QWN0aW9uc0RpcmVjdGl2ZXMuZmlyc3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJvd0VkaXRDb250YWluZXIoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd0VkaXRDdXN0b20gPyB0aGlzLnJvd0VkaXRDdXN0b20gOiB0aGlzLmRlZmF1bHRSb3dFZGl0VGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSByb3cgZHJhZyBpbmRpY2F0b3IgaWNvblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZHJhZ0luZGljYXRvckljb25UZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbURyYWdJbmRpY2F0b3JJY29uVGVtcGxhdGUgfHwgdGhpcy5kcmFnSW5kaWNhdG9ySWNvblRlbXBsYXRlcy5maXJzdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGRyYWdJbmRpY2F0b3JJY29uVGVtcGxhdGUodmFsOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX2N1c3RvbURyYWdJbmRpY2F0b3JJY29uVGVtcGxhdGUgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZpcnN0RWRpdGFibGVDb2x1bW5JbmRleCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMudmlzaWJsZUNvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wuZWRpdGFibGUpXG4gICAgICAgICAgICAubWFwKGMgPT4gYy52aXNpYmxlSW5kZXgpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAgICAgcmV0dXJuIGluZGV4Lmxlbmd0aCA/IGluZGV4WzBdIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGFzdEVkaXRhYmxlQ29sdW1uSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnZpc2libGVDb2x1bW5zLmZpbHRlcihjb2wgPT4gY29sLmVkaXRhYmxlKVxuICAgICAgICAgICAgLm1hcChjID0+IGMudmlzaWJsZUluZGV4KS5zb3J0KChhLCBiKSA9PiBhID4gYiA/IC0xIDogMSk7XG4gICAgICAgIHJldHVybiBpbmRleC5sZW5ndGggPyBpbmRleFswXSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBUT0RPOiBOYXYgc2VydmljZSBsb2dpYyBkb2Vzbid0IGhhbmRsZSAwIHJlc3VsdHMgZnJvbSB0aGlzIHF1ZXJ5bGlzdFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcm93RWRpdFRhYnMoKTogUXVlcnlMaXN0PElneFJvd0VkaXRUYWJTdG9wRGlyZWN0aXZlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd0VkaXRUYWJzQ1VTVE9NLmxlbmd0aCA/IHRoaXMucm93RWRpdFRhYnNDVVNUT00gOiB0aGlzLnJvd0VkaXRUYWJzREVGQVVMVDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGFjdGl2ZURlc2NlbmRhbnQoKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW0gPSB0aGlzLm5hdmlnYXRpb24uYWN0aXZlTm9kZTtcblxuICAgICAgICBpZiAoIWFjdGl2ZUVsZW0gfHwgIU9iamVjdC5rZXlzKGFjdGl2ZUVsZW0pLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWN0aXZlRWxlbS5yb3cgPCAwID9cbiAgICAgICAgICAgIGAke3RoaXMuaWR9XyR7YWN0aXZlRWxlbS5yb3d9XyR7YWN0aXZlRWxlbS5tY2hDYWNoZS5sZXZlbH1fJHthY3RpdmVFbGVtLmNvbHVtbn1gIDpcbiAgICAgICAgICAgIGAke3RoaXMuaWR9XyR7YWN0aXZlRWxlbS5yb3d9XyR7YWN0aXZlRWxlbS5jb2x1bW59YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5jbGFzcycpXG4gICAgcHVibGljIGdldCBob3N0Q2xhc3MoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IFt0aGlzLmdldENvbXBvbmVudERlbnNpdHlDbGFzcygnaWd4LWdyaWQnKV07XG4gICAgICAgIC8vIFRoZSBjdXN0b20gY2xhc3NlcyBzaG91bGQgYmUgYXQgdGhlIGVuZC5cbiAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMuY2xhc3MpO1xuICAgICAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBiYW5uZXJDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucm93RWRpdFBvc2l0aW9uaW5nU3RyYXRlZ3kuaXNUb3AgPyAnaWd4LWJhbm5lcl9fYm9yZGVyLXRvcCcgOiAnaWd4LWJhbm5lcl9fYm9yZGVyLWJvdHRvbSc7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmdldENvbXBvbmVudERlbnNpdHlDbGFzcygnaWd4LWJhbm5lcicpfSAke3Bvc2l0aW9ufWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBzb3J0aW5nIHN0YXRlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBTdXBwb3J0cyB0d28td2F5IGRhdGEgYmluZGluZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIFsoc29ydGluZ0V4cHJlc3Npb25zKV09XCJtb2RlbC5zb3J0aW5nRXhwcmVzc2lvbnNcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBXYXRjaENoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzb3J0aW5nRXhwcmVzc2lvbnMoKTogSVNvcnRpbmdFeHByZXNzaW9uW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ydGluZ0V4cHJlc3Npb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc29ydGluZ0V4cHJlc3Npb25zKHZhbHVlOiBJU29ydGluZ0V4cHJlc3Npb25bXSkge1xuICAgICAgICB0aGlzLl9zb3J0aW5nRXhwcmVzc2lvbnMgPSBjbG9uZUFycmF5KHZhbHVlKTtcbiAgICAgICAgdGhpcy5zb3J0aW5nRXhwcmVzc2lvbnNDaGFuZ2UuZW1pdCh0aGlzLl9zb3J0aW5nRXhwcmVzc2lvbnMpO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbWF4TGV2ZWxIZWFkZXJEZXB0aCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX21heExldmVsSGVhZGVyRGVwdGggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21heExldmVsSGVhZGVyRGVwdGggPSB0aGlzLmhhc0NvbHVtbkxheW91dHMgP1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uTGlzdC5yZWR1Y2UoKGFjYywgY29sKSA9PiBNYXRoLm1heChhY2MsIGNvbC5yb3dTdGFydCksIDApIDpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVkdWNlKChhY2MsIGNvbCkgPT4gTWF0aC5tYXgoYWNjLCBjb2wubGV2ZWwpLCAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4TGV2ZWxIZWFkZXJEZXB0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgaGlkZGVuIGNvbHVtbnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBoaWRkZW5Db2wgPSB0aGlzLmdyaWQuaGlkZGVuQ29sdW1uc0NvdW50O1xuICAgICAqIGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoaWRkZW5Db2x1bW5zQ291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkxpc3QuZmlsdGVyKChjb2wpID0+IGNvbC5jb2x1bW5Hcm91cCA9PT0gZmFsc2UgJiYgY29sLmhpZGRlbiA9PT0gdHJ1ZSkubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG51bWJlciBvZiBwaW5uZWQgY29sdW1ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZENvbHVtbnNDb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlubmVkQ29sdW1ucy5maWx0ZXIoY29sID0+ICFjb2wuY29sdW1uTGF5b3V0KS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHdoZXRoZXIgdGhlIGdyaWQgaGFzIGJhdGNoIGVkaXRpbmcgZW5hYmxlZC5cbiAgICAgKiBXaGVuIGJhdGNoIGVkaXRpbmcgaXMgZW5hYmxlZCwgY2hhbmdlcyBhcmUgbm90IG1hZGUgZGlyZWN0bHkgdG8gdGhlIHVuZGVybHlpbmcgZGF0YS5cbiAgICAgKiBJbnN0ZWFkLCB0aGV5IGFyZSBzdG9yZWQgYXMgdHJhbnNhY3Rpb25zLCB3aGljaCBjYW4gbGF0ZXIgYmUgY29tbWl0dGVkIHcvIHRoZSBgY29tbWl0YCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2JhdGNoRWRpdGluZ109XCJ0cnVlXCIgW2RhdGFdPVwic29tZURhdGFcIj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBiYXRjaEVkaXRpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iYXRjaEVkaXRpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBiYXRjaEVkaXRpbmcodmFsOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2YWwgIT09IHRoaXMuX2JhdGNoRWRpdGluZykge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3RyYW5zYWN0aW9ucztcbiAgICAgICAgICAgIHRoaXMuX2JhdGNoRWRpdGluZyA9IHZhbDtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoVHJhbnNhY3Rpb25TZXJ2aWNlKHZhbCk7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZVRvVHJhbnNhY3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdHJhbnNhY3Rpb25zIHNlcnZpY2UgZm9yIHRoZSBncmlkLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdHJhbnNhY3Rpb25zKCk6IFRyYW5zYWN0aW9uU2VydmljZTxUcmFuc2FjdGlvbiwgU3RhdGU+IHtcbiAgICAgICAgaWYgKHRoaXMuX2RpVHJhbnNhY3Rpb25zICYmICF0aGlzLmJhdGNoRWRpdGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RpVHJhbnNhY3Rpb25zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2FjdGlvbnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRSb3dTdGF0ZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFJvd1N0YXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBjdXJyZW5jeVBvc2l0aW9uTGVmdCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbmN5UG9zaXRpb25MZWZ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW5jeVBvc2l0aW9uTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmb3JtYXQgPSBnZXRMb2NhbGVOdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUsIE51bWJlckZvcm1hdFN0eWxlLkN1cnJlbmN5KTtcbiAgICAgICAgY29uc3QgZm9ybWF0UGFydHMgPSBmb3JtYXQuc3BsaXQoJywnKTtcbiAgICAgICAgY29uc3QgaSA9IGZvcm1hdFBhcnRzLmluZGV4T2YoZm9ybWF0UGFydHMuZmluZChjID0+IGMuaW5jbHVkZXMoJ8KkJykpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbmN5UG9zaXRpb25MZWZ0ID0gaSA8IDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIGNlbGwgc2VsZWN0aW9uIG1vZGUuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEJ5IGRlZmF1bHQgdGhlIGNlbGwgc2VsZWN0aW9uIG1vZGUgaXMgbXVsdGlwbGVcbiAgICAgKiBAcGFyYW0gc2VsZWN0aW9uTW9kZTogR3JpZFNlbGVjdGlvbk1vZGVcbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgY2VsbFNlbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxTZWxlY3Rpb25Nb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgY2VsbFNlbGVjdGlvbihzZWxlY3Rpb25Nb2RlOiBHcmlkU2VsZWN0aW9uTW9kZSkge1xuICAgICAgICB0aGlzLl9jZWxsU2VsZWN0aW9uTW9kZSA9IHNlbGVjdGlvbk1vZGU7XG4gICAgICAgIC8vIGlmICh0aGlzLmdyaWRBUEkuZ3JpZCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXIodHJ1ZSk7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAvLyB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHJvdyBzZWxlY3Rpb24gbW9kZVxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IHRoZSByb3cgc2VsZWN0aW9uIG1vZGUgaXMgJ25vbmUnXG4gICAgICogTm90ZSB0aGF0IGluIElneEdyaWQgYW5kIElneEhpZXJhcmNoaWNhbEdyaWQgJ211bHRpcGxlQ2FzY2FkZScgYmVoYXZlcyBsaWtlICdtdWx0aXBsZSdcbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgcm93U2VsZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm93U2VsZWN0aW9uTW9kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHJvd1NlbGVjdGlvbihzZWxlY3Rpb25Nb2RlOiBHcmlkU2VsZWN0aW9uTW9kZSkge1xuICAgICAgICB0aGlzLl9yb3dTZWxlY3Rpb25Nb2RlID0gc2VsZWN0aW9uTW9kZTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJBbGxTZWxlY3RlZFJvd3MoKTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBjb2x1bW4gc2VsZWN0aW9uIG1vZGVcbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQnkgZGVmYXVsdCB0aGUgcm93IHNlbGVjdGlvbiBtb2RlIGlzIG5vbmVcbiAgICAgKiBAcGFyYW0gc2VsZWN0aW9uTW9kZTogR3JpZFNlbGVjdGlvbk1vZGVcbiAgICAgKi9cbiAgICBAV2F0Y2hDaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgY29sdW1uU2VsZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1uU2VsZWN0aW9uTW9kZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGNvbHVtblNlbGVjdGlvbihzZWxlY3Rpb25Nb2RlOiBHcmlkU2VsZWN0aW9uTW9kZSkge1xuICAgICAgICB0aGlzLl9jb2x1bW5TZWxlY3Rpb25Nb2RlID0gc2VsZWN0aW9uTW9kZTtcbiAgICAgICAgLy8gaWYgKHRoaXMuZ3JpZEFQSS5ncmlkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5jbGVhckFsbFNlbGVjdGVkQ29sdW1ucygpO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgcGFnaW5nU3RhdGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fcGFnaW5nU3RhdGUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yICYmICF0aGlzLl9pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRvci50b3RhbFJlY29yZHMgPSB2YWx1ZS5tZXRhZGF0YS5jb3VudFJlY29yZHM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBhZ2luZ1N0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFnaW5nU3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcm93RWRpdE1lc3NhZ2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzbmFja2JhckFjdGlvblRleHQgPSB0aGlzLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9zbmFja2Jhcl9hZGRyb3dfYWN0aW9udGV4dDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNhbGNXaWR0aDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNhbGNIZWlnaHQgPSAwO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHRmb290SGVpZ2h0OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBkaXNhYmxlVHJhbnNpdGlvbnMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGxhc3RTZWFyY2hJbmZvOiBJU2VhcmNoSW5mbyA9IHtcbiAgICAgICAgc2VhcmNoVGV4dDogJycsXG4gICAgICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlLFxuICAgICAgICBleGFjdE1hdGNoOiBmYWxzZSxcbiAgICAgICAgYWN0aXZlTWF0Y2hJbmRleDogMCxcbiAgICAgICAgbWF0Y2hJbmZvQ2FjaGU6IFtdXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNvbHVtbldpZHRoU2V0QnlVc2VyID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwaW5uZWRSZWNvcmRzOiBhbnlbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHVucGlubmVkUmVjb3JkczogYW55W107XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByZW5kZXJlZCQgPSB0aGlzLnJlbmRlcmVkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoc2hhcmVSZXBsYXkoeyBidWZmZXJTaXplOiAxLCByZWZDb3VudDogdHJ1ZSB9KSk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcmVzaXplTm90aWZ5ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByb3dBZGRlZE5vdGlmaWVyID0gbmV3IFN1YmplY3Q8SVJvd0RhdGFFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcm93RGVsZXRlZE5vdGlmaWVyID0gbmV3IFN1YmplY3Q8SVJvd0RhdGFFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcGlwZVRyaWdnZXJOb3RpZmllciA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgX2ZpbHRlcmVkU29ydGVkUGlubmVkRGF0YTogYW55W107XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgX2ZpbHRlcmVkU29ydGVkVW5waW5uZWREYXRhOiBhbnlbXTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBfZmlsdGVyZWRQaW5uZWREYXRhOiBhbnlbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgX2ZpbHRlcmVkVW5waW5uZWREYXRhO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIF9kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBfdG90YWxSZWNvcmRzID0gLTE7XG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgY29sdW1uc1dpdGhOb1NldFdpZHRocyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcGlwZVRyaWdnZXIgPSAwO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGZpbHRlcmluZ1BpcGVUcmlnZ2VyID0gMDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdW1tYXJ5UGlwZVRyaWdnZXIgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICovXG4gICAgcHVibGljIEVNUFRZX0RBVEEgPSBbXTtcblxuICAgIHB1YmxpYyBpc1Bpdm90ID0gZmFsc2U7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgX2Jhc2VGb250U2l6ZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX3BlclBhZ2UgPSBERUZBVUxUX0lURU1TX1BFUl9QQUdFO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX3BhZ2luZyA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX3BhZ2luZ01vZGUgPSBHcmlkUGFnaW5nTW9kZS5Mb2NhbDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9wYWdpbmdTdGF0ZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9oaWRlUm93U2VsZWN0b3JzID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfcm93RHJhZyA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2NvbHVtbnM6IElneENvbHVtbkNvbXBvbmVudFtdID0gW107XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfcGlubmVkQ29sdW1uczogSWd4Q29sdW1uQ29tcG9uZW50W10gPSBbXTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF91bnBpbm5lZENvbHVtbnM6IElneENvbHVtbkNvbXBvbmVudFtdID0gW107XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOiBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlID0gbmV3IEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZShGaWx0ZXJpbmdMb2dpYy5BbmQpO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2FkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOiBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX3NvcnRpbmdFeHByZXNzaW9uczogQXJyYXk8SVNvcnRpbmdFeHByZXNzaW9uPiA9IFtdO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX21heExldmVsSGVhZGVyRGVwdGggPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2NvbHVtbkhpZGluZyA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2NvbHVtblBpbm5pbmcgPSBmYWxzZTtcblxuICAgIHByb3RlY3RlZCBfcGlubmVkUmVjb3JkSURzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9oYXNWaXNpYmxlQ29sdW1ucztcbiAgICBwcm90ZWN0ZWQgX2FsbG93RmlsdGVyaW5nID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIF9hbGxvd0FkdmFuY2VkRmlsdGVyaW5nID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIF9maWx0ZXJNb2RlOiBGaWx0ZXJNb2RlID0gRmlsdGVyTW9kZS5xdWlja0ZpbHRlcjtcblxuXG4gICAgcHJvdGVjdGVkIF9kZWZhdWx0VGFyZ2V0UmVjb3JkTnVtYmVyID0gMTA7XG4gICAgcHJvdGVjdGVkIF9leHBhbnNpb25TdGF0ZXM6IE1hcDxhbnksIGJvb2xlYW4+ID0gbmV3IE1hcDxhbnksIGJvb2xlYW4+KCk7XG4gICAgcHJvdGVjdGVkIF9kZWZhdWx0RXhwYW5kU3RhdGUgPSBmYWxzZTtcbiAgICBwcm90ZWN0ZWQgX2hlYWRlckZlYXR1cmVzV2lkdGggPSBOYU47XG4gICAgcHJvdGVjdGVkIF9pbml0ID0gdHJ1ZTtcbiAgICBwcm90ZWN0ZWQgX2NkclJlcXVlc3RSZXBhaW50ID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIF91c2VyT3V0bGV0RGlyZWN0aXZlOiBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlO1xuICAgIHByb3RlY3RlZCBfdHJhbnNhY3Rpb25zOiBUcmFuc2FjdGlvblNlcnZpY2U8VHJhbnNhY3Rpb24sIFN0YXRlPjtcbiAgICBwcm90ZWN0ZWQgX2JhdGNoRWRpdGluZyA9IGZhbHNlO1xuICAgIHByb3RlY3RlZCBfZmlsdGVyU3RyYXRlZ3k6IElGaWx0ZXJpbmdTdHJhdGVneSA9IG5ldyBGaWx0ZXJpbmdTdHJhdGVneSgpO1xuICAgIHByb3RlY3RlZCBfYXV0b0dlbmVyYXRlZENvbHMgPSBbXTtcbiAgICBwcm90ZWN0ZWQgX2RhdGFWaWV3ID0gW107XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHBhZ2luYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnaW5hdGlvbkNvbXBvbmVudHM/LmZpcnN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBzY3JvbGxTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5nZXRTY3JvbGxOYXRpdmVTaXplKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcm93RWRpdGFibGUgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9jdXJyZW50Um93U3RhdGU6IGFueTtcbiAgICBwcml2YXRlIF9maWx0ZXJlZFNvcnRlZERhdGEgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBfY3VzdG9tRHJhZ0luZGljYXRvckljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBwcml2YXRlIF9jZHJSZXF1ZXN0cyA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3Jlc291cmNlU3RyaW5ncztcbiAgICBwcml2YXRlIF9lbXB0eUdyaWRNZXNzYWdlID0gbnVsbDtcbiAgICBwcml2YXRlIF9lbXB0eUZpbHRlcmVkR3JpZE1lc3NhZ2UgPSBudWxsO1xuICAgIHByaXZhdGUgX2lzTG9hZGluZyA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2xvY2FsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgb3ZlcmxheUlEcyA9IFtdO1xuICAgIHByaXZhdGUgX3NvcnRpbmdTdHJhdGVneTogSUdyaWRTb3J0aW5nU3RyYXRlZ3k7XG4gICAgcHJpdmF0ZSBfcGlubmluZzogSVBpbm5pbmdDb25maWcgPSB7IGNvbHVtbnM6IENvbHVtblBpbm5pbmdQb3NpdGlvbi5TdGFydCB9O1xuXG4gICAgcHJpdmF0ZSBfaG9zdFdpZHRoO1xuICAgIHByaXZhdGUgX2FkdmFuY2VkRmlsdGVyaW5nT3ZlcmxheUlkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfYWR2YW5jZWRGaWx0ZXJpbmdQb3NpdGlvblNldHRpbmdzOiBQb3NpdGlvblNldHRpbmdzID0ge1xuICAgICAgICB2ZXJ0aWNhbERpcmVjdGlvbjogVmVydGljYWxBbGlnbm1lbnQuTWlkZGxlLFxuICAgICAgICBob3Jpem9udGFsRGlyZWN0aW9uOiBIb3Jpem9udGFsQWxpZ25tZW50LkNlbnRlcixcbiAgICAgICAgaG9yaXpvbnRhbFN0YXJ0UG9pbnQ6IEhvcml6b250YWxBbGlnbm1lbnQuQ2VudGVyLFxuICAgICAgICB2ZXJ0aWNhbFN0YXJ0UG9pbnQ6IFZlcnRpY2FsQWxpZ25tZW50Lk1pZGRsZVxuICAgIH07XG5cbiAgICBwcml2YXRlIF9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0ge1xuICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBmYWxzZSxcbiAgICAgICAgbW9kYWw6IGZhbHNlLFxuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBuZXcgQ29ubmVjdGVkUG9zaXRpb25pbmdTdHJhdGVneSh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ1Bvc2l0aW9uU2V0dGluZ3MpLFxuICAgIH07XG5cbiAgICBwcml2YXRlIGNvbHVtbkxpc3REaWZmZXI7XG4gICAgcHJpdmF0ZSByb3dMaXN0RGlmZmVyO1xuICAgIHByaXZhdGUgX2hlaWdodDogc3RyaW5nIHwgbnVsbCA9ICcxMDAlJztcbiAgICBwcml2YXRlIF93aWR0aDogc3RyaW5nIHwgbnVsbCA9ICcxMDAlJztcbiAgICBwcml2YXRlIF9yb3dIZWlnaHQ7XG4gICAgcHJpdmF0ZSBfaG9yaXpvbnRhbEZvck9mczogQXJyYXk8SWd4R3JpZEZvck9mRGlyZWN0aXZlPGFueT4+ID0gW107XG4gICAgcHJpdmF0ZSBfbXVsdGlSb3dMYXlvdXRSb3dTaXplID0gMTtcbiAgICAvLyBDYWNoZXNcbiAgICBwcml2YXRlIF90b3RhbFdpZHRoID0gTmFOO1xuICAgIHByaXZhdGUgX3Bpbm5lZFZpc2libGUgPSBbXTtcbiAgICBwcml2YXRlIF91bnBpbm5lZFZpc2libGUgPSBbXTtcbiAgICBwcml2YXRlIF9waW5uZWRXaWR0aCA9IE5hTjtcbiAgICBwcml2YXRlIF91bnBpbm5lZFdpZHRoID0gTmFOO1xuICAgIHByaXZhdGUgX3Zpc2libGVDb2x1bW5zID0gW107XG4gICAgcHJpdmF0ZSBfY29sdW1uR3JvdXBzID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIF9jb2x1bW5XaWR0aDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfc3VtbWFyeVBvc2l0aW9uOiBHcmlkU3VtbWFyeVBvc2l0aW9uID0gR3JpZFN1bW1hcnlQb3NpdGlvbi5ib3R0b207XG4gICAgcHJpdmF0ZSBfc3VtbWFyeUNhbGN1bGF0aW9uTW9kZTogR3JpZFN1bW1hcnlDYWxjdWxhdGlvbk1vZGUgPSBHcmlkU3VtbWFyeUNhbGN1bGF0aW9uTW9kZS5yb290QW5kQ2hpbGRMZXZlbHM7XG4gICAgcHJpdmF0ZSBfc2hvd1N1bW1hcnlPbkNvbGxhcHNlID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfc3VtbWFyeVJvd0hlaWdodCA9IDA7XG4gICAgcHJpdmF0ZSBfY2VsbFNlbGVjdGlvbk1vZGU6IEdyaWRTZWxlY3Rpb25Nb2RlID0gR3JpZFNlbGVjdGlvbk1vZGUubXVsdGlwbGU7XG4gICAgcHJpdmF0ZSBfcm93U2VsZWN0aW9uTW9kZTogR3JpZFNlbGVjdGlvbk1vZGUgPSBHcmlkU2VsZWN0aW9uTW9kZS5ub25lO1xuICAgIHByaXZhdGUgX3NlbGVjdFJvd09uQ2xpY2sgPSB0cnVlO1xuICAgIHByaXZhdGUgX2NvbHVtblNlbGVjdGlvbk1vZGU6IEdyaWRTZWxlY3Rpb25Nb2RlID0gR3JpZFNlbGVjdGlvbk1vZGUubm9uZTtcblxuICAgIHByaXZhdGUgbGFzdEFkZGVkUm93SW5kZXg7XG4gICAgcHJpdmF0ZSBfY3VycmVuY3lQb3NpdGlvbkxlZnQ6IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIHJvd0VkaXRQb3NpdGlvbmluZ1N0cmF0ZWd5ID0gbmV3IFJvd0VkaXRQb3NpdGlvblN0cmF0ZWd5KHtcbiAgICAgICAgaG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbEFsaWdubWVudC5SaWdodCxcbiAgICAgICAgdmVydGljYWxEaXJlY3Rpb246IFZlcnRpY2FsQWxpZ25tZW50LkJvdHRvbSxcbiAgICAgICAgaG9yaXpvbnRhbFN0YXJ0UG9pbnQ6IEhvcml6b250YWxBbGlnbm1lbnQuTGVmdCxcbiAgICAgICAgdmVydGljYWxTdGFydFBvaW50OiBWZXJ0aWNhbEFsaWdubWVudC5Cb3R0b20sXG4gICAgICAgIGNsb3NlQW5pbWF0aW9uOiBudWxsXG4gICAgfSk7XG5cbiAgICBwcml2YXRlIHJvd0VkaXRTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0ge1xuICAgICAgICBzY3JvbGxTdHJhdGVneTogbmV3IEFic29sdXRlU2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgICAgbW9kYWw6IGZhbHNlLFxuICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiBmYWxzZSxcbiAgICAgICAgb3V0bGV0OiB0aGlzLnJvd091dGxldERpcmVjdGl2ZSxcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5yb3dFZGl0UG9zaXRpb25pbmdTdHJhdGVneVxuICAgIH07XG5cbiAgICBwcml2YXRlIHRyYW5zYWN0aW9uQ2hhbmdlJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSBfcmVuZGVyZWQgPSBmYWxzZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IERSQUdfU0NST0xMX0RFTFRBID0gMTA7XG4gICAgcHJpdmF0ZSBfZGF0YUNsb25lU3RyYXRlZ3k6IElEYXRhQ2xvbmVTdHJhdGVneSA9IG5ldyBEZWZhdWx0RGF0YUNsb25lU3RyYXRlZ3koKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGFic3RyYWN0IGlkOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGRhdGE6IGFueVtdIHwgbnVsbDtcbiAgICBwdWJsaWMgYWJzdHJhY3QgZmlsdGVyZWREYXRhOiBhbnlbXTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGZpbHRlcmVkIHNvcnRlZCBkYXRhLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZmlsdGVyZWRTb3J0ZWREYXRhID0gdGhpcy5ncmlkMS5maWx0ZXJlZFNvcnRlZERhdGE7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBmaWx0ZXJlZFNvcnRlZERhdGEoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsdGVyZWRTb3J0ZWREYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCByb3dDaGFuZ2VzQ291bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5jcnVkU2VydmljZS5yb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGYgPSAob2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBjaGFuZ2VzID0gMDtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4gaXNPYmplY3Qob2JqW2tleV0pID8gY2hhbmdlcyArPSBmKG9ialtrZXldKSA6IGNoYW5nZXMrKyk7XG4gICAgICAgICAgICByZXR1cm4gY2hhbmdlcztcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgcm93Q2hhbmdlcyA9IHRoaXMudHJhbnNhY3Rpb25zLmdldEFnZ3JlZ2F0ZWRWYWx1ZSh0aGlzLmNydWRTZXJ2aWNlLnJvdy5pZCwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gcm93Q2hhbmdlcyA/IGYocm93Q2hhbmdlcykgOiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBkYXRhV2l0aEFkZGVkSW5UcmFuc2FjdGlvblJvd3MoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNsb25lQXJyYXkodGhpcy5ncmlkQVBJLmdldF9hbGxfZGF0YSgpKTtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNhY3Rpb25zLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKC4uLnRoaXMudHJhbnNhY3Rpb25zLmdldEFnZ3JlZ2F0ZWRDaGFuZ2VzKHRydWUpXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0ID0+IHQudHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFERClcbiAgICAgICAgICAgICAgICAubWFwKHQgPT4gdC5uZXdWYWx1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3J1ZFNlcnZpY2Uucm93ICYmIHRoaXMuY3J1ZFNlcnZpY2Uucm93LmdldENsYXNzTmFtZSgpID09PSBJZ3hBZGRSb3cubmFtZSkge1xuICAgICAgICAgICAgcmVzdWx0LnNwbGljZSh0aGlzLmNydWRTZXJ2aWNlLnJvdy5pbmRleCwgMCwgdGhpcy5jcnVkU2VydmljZS5yb3cuZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBkYXRhTGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbnMuZW5hYmxlZCA/IHRoaXMuZGF0YVdpdGhBZGRlZEluVHJhbnNhY3Rpb25Sb3dzLmxlbmd0aCA6IHRoaXMuZ3JpZEFQSS5nZXRfYWxsX2RhdGEoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcgJiYgKHRoaXMuaGFzWmVyb1Jlc3VsdEZpbHRlciB8fCB0aGlzLmhhc05vRGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRpbmdHcmlkVGVtcGxhdGUgPyB0aGlzLmxvYWRpbmdHcmlkVGVtcGxhdGUgOiB0aGlzLmxvYWRpbmdHcmlkRGVmYXVsdFRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzWmVyb1Jlc3VsdEZpbHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1wdHlHcmlkVGVtcGxhdGUgPyB0aGlzLmVtcHR5R3JpZFRlbXBsYXRlIDogdGhpcy5lbXB0eUZpbHRlcmVkR3JpZFRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzTm9EYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbXB0eUdyaWRUZW1wbGF0ZSA/IHRoaXMuZW1wdHlHcmlkVGVtcGxhdGUgOiB0aGlzLmVtcHR5R3JpZERlZmF1bHRUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXQgaGFzWmVyb1Jlc3VsdEZpbHRlcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyZWREYXRhICYmIHRoaXMuZmlsdGVyZWREYXRhLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0IGhhc05vRGF0YSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRhdGEgfHwgdGhpcy5kYXRhTGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBzaG91bGRPdmVybGF5TG9hZGluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNMb2FkaW5nICYmICF0aGlzLmhhc05vRGF0YSAmJiAhdGhpcy5oYXNaZXJvUmVzdWx0RmlsdGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc011bHRpUm93U2VsZWN0aW9uRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm93U2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZVxuICAgICAgICAgICAgfHwgdGhpcy5yb3dTZWxlY3Rpb24gPT09IEdyaWRTZWxlY3Rpb25Nb2RlLm11bHRpcGxlQ2FzY2FkZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNSb3dTZWxlY3RhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dTZWxlY3Rpb24gIT09IEdyaWRTZWxlY3Rpb25Nb2RlLm5vbmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzQ2VsbFNlbGVjdGFibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxTZWxlY3Rpb24gIT09IEdyaWRTZWxlY3Rpb25Nb2RlLm5vbmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGNvbHVtbkluRHJhZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEFQSS5jbXMuY29sdW1uO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBjb2xSZXNpemluZ1NlcnZpY2U6IElneENvbHVtblJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9TRVJWSUNFX0JBU0UpIHB1YmxpYyBncmlkQVBJOiBHcmlkU2VydmljZVR5cGUsXG4gICAgICAgIHByb3RlY3RlZCB0cmFuc2FjdGlvbkZhY3Rvcnk6IElneEZsYXRUcmFuc2FjdGlvbkZhY3RvcnksXG4gICAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHB1YmxpYyBkb2N1bWVudDogYW55LFxuICAgICAgICBwdWJsaWMgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJvdGVjdGVkIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIHByb3RlY3RlZCBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICAgIHByb3RlY3RlZCB2aWV3UmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICBwcml2YXRlIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgICAgIHByaXZhdGUgbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LFxuICAgICAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgcHVibGljIG5hdmlnYXRpb246IElneEdyaWROYXZpZ2F0aW9uU2VydmljZSxcbiAgICAgICAgcHVibGljIGZpbHRlcmluZ1NlcnZpY2U6IElneEZpbHRlcmluZ1NlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoSWd4T3ZlcmxheVNlcnZpY2UpIHByb3RlY3RlZCBvdmVybGF5U2VydmljZTogSWd4T3ZlcmxheVNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBzdW1tYXJ5U2VydmljZTogSWd4R3JpZFN1bW1hcnlTZXJ2aWNlLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERpc3BsYXlEZW5zaXR5VG9rZW4pIHByb3RlY3RlZCBfZGlzcGxheURlbnNpdHlPcHRpb25zOiBJRGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICBASW5qZWN0KExPQ0FMRV9JRCkgcHJpdmF0ZSBsb2NhbGVJZDogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChJZ3hHcmlkVHJhbnNhY3Rpb24pIHByb3RlY3RlZCBfZGlUcmFuc2FjdGlvbnM/OiBUcmFuc2FjdGlvblNlcnZpY2U8VHJhbnNhY3Rpb24sIFN0YXRlPlxuICAgICkge1xuICAgICAgICBzdXBlcihfZGlzcGxheURlbnNpdHlPcHRpb25zKTtcbiAgICAgICAgdGhpcy5sb2NhbGUgPSB0aGlzLmxvY2FsZSB8fCB0aGlzLmxvY2FsZUlkO1xuICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnMgPSB0aGlzLnRyYW5zYWN0aW9uRmFjdG9yeS5jcmVhdGUoVFJBTlNBQ1RJT05fVFlQRS5Ob25lKTtcbiAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zLmNsb25lU3RyYXRlZ3kgPSB0aGlzLmRhdGFDbG9uZVN0cmF0ZWd5O1xuICAgICAgICB0aGlzLmNkci5kZXRhY2goKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gICAgcHVibGljIGhpZGVBY3Rpb25TdHJpcCgpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25TdHJpcD8uaGlkZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRlckZlYXR1cmVzV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXJGZWF0dXJlc1dpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNEZXRhaWxSZWNvcmQoX3JlYykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBpc0dyb3VwQnlSZWNvcmQoX3JlYykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNHaG9zdFJlY29yZChyZWNvcmQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcmVjb3JkLmdob3N0UmVjb3JkICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGlzQWRkUm93UmVjb3JkKHJlY29yZDogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiByZWNvcmQuYWRkUm93ICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIFJldHVybnMgdGhlIHJvdyBpbmRleCBvZiBhIHJvdyB0aGF0IHRha2VzIGludG8gYWNjb3VudCB0aGUgZnVsbCB2aWV3IGRhdGEgbGlrZSBwaW5uaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXREYXRhVmlld0luZGV4KHJvd0luZGV4LCBwaW5uZWQpIHtcbiAgICAgICAgaWYgKHBpbm5lZCAmJiAhdGhpcy5pc1Jvd1Bpbm5pbmdUb1RvcCkge1xuICAgICAgICAgICAgcm93SW5kZXggPSByb3dJbmRleCArIHRoaXMudW5waW5uZWREYXRhVmlldy5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSBpZiAoIXBpbm5lZCAmJiB0aGlzLmlzUm93UGlubmluZ1RvVG9wKSB7XG4gICAgICAgICAgICByb3dJbmRleCA9IHJvd0luZGV4ICsgdGhpcy5waW5uZWREYXRhVmlldy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvd0luZGV4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc0RldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBvZiB0aGUgZ3JpZCB2aXJ0dWFsaXphdGlvbi5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSW5jbHVkZXMgdGhlIHN0YXJ0IGluZGV4IGFuZCBob3cgbWFueSByZWNvcmRzIGFyZSByZW5kZXJlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBncmlkVmlydFN0YXRlID0gdGhpcy5ncmlkMS52aXJ0dWFsaXphdGlvblN0YXRlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdmlydHVhbGl6YXRpb25TdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuc3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgdmlydHVhbGl6YXRpb25TdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBoaWRlT3ZlcmxheXMoKSB7XG4gICAgICAgIHRoaXMub3ZlcmxheUlEcy5mb3JFYWNoKG92ZXJsYXlJRCA9PiB7XG4gICAgICAgICAgICBjb25zdCBvdmVybGF5ID0gdGhpcy5vdmVybGF5U2VydmljZS5nZXRPdmVybGF5QnlJZChvdmVybGF5SUQpO1xuXG4gICAgICAgICAgICBpZiAob3ZlcmxheT8udmlzaWJsZSAmJiAhb3ZlcmxheS5jbG9zZUFuaW1hdGlvblBsYXllcj8uaGFzU3RhcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5U2VydmljZS5oaWRlKG92ZXJsYXlJRCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSByZWNvcmQgaXMgcGlubmVkIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb3dJbmRleCBJbmRleCBvZiB0aGUgcmVjb3JkIGluIHRoZSBgZGF0YVZpZXdgIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGlzUmVjb3JkUGlubmVkQnlWaWV3SW5kZXgocm93SW5kZXg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNQaW5uZWRSZWNvcmRzICYmICh0aGlzLmlzUm93UGlubmluZ1RvVG9wICYmIHJvd0luZGV4IDwgdGhpcy5waW5uZWREYXRhVmlldy5sZW5ndGgpIHx8XG4gICAgICAgICAgICAoIXRoaXMuaXNSb3dQaW5uaW5nVG9Ub3AgJiYgcm93SW5kZXggPj0gdGhpcy51bnBpbm5lZERhdGFWaWV3Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSByZWNvcmQgaXMgcGlubmVkIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb3dJbmRleCBJbmRleCBvZiB0aGUgcmVjb3JkIGluIHRoZSBgZmlsdGVyZWRTb3J0ZWREYXRhYCBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1JlY29yZFBpbm5lZEJ5SW5kZXgocm93SW5kZXg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNQaW5uZWRSZWNvcmRzICYmICh0aGlzLmlzUm93UGlubmluZ1RvVG9wICYmIHJvd0luZGV4IDwgdGhpcy5fZmlsdGVyZWRTb3J0ZWRQaW5uZWREYXRhLmxlbmd0aCkgfHxcbiAgICAgICAgICAgICghdGhpcy5pc1Jvd1Bpbm5pbmdUb1RvcCAmJiByb3dJbmRleCA+PSB0aGlzLl9maWx0ZXJlZFNvcnRlZFVucGlubmVkRGF0YS5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNSZWNvcmRQaW5uZWQocmVjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluaXRpYWxQaW5uZWRJbmRleChyZWMpICE9PSAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICogUmV0dXJucyB0aGUgcmVjb3JkIGluZGV4IGluIG9yZGVyIG9mIHBpbm5pbmcgYnkgdGhlIHVzZXIuIERvZXMgbm90IGNvbnNpZGVyIHNvcnRpbmcvZmlsdGVyaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbml0aWFsUGlubmVkSW5kZXgocmVjKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5ncmlkQVBJLmdldF9yb3dfaWQocmVjKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bpbm5lZFJlY29yZElEcy5pbmRleE9mKGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNQaW5uZWRSZWNvcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGlubmVkUmVjb3JkSURzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcGlubmVkUmVjb3Jkc0NvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGlubmVkUmVjb3JkSURzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBjcnVkU2VydmljZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEFQSS5jcnVkU2VydmljZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIF9zZXR1cFNlcnZpY2VzKCkge1xuICAgICAgICB0aGlzLmdyaWRBUEkuZ3JpZCA9IHRoaXMgYXMgYW55O1xuICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmdyaWQgPSB0aGlzIGFzIGFueTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdyaWQgPSB0aGlzIGFzIGFueTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0aW9uLmdyaWQgPSB0aGlzIGFzIGFueTtcbiAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmdyaWQgPSB0aGlzIGFzIGFueTtcbiAgICAgICAgdGhpcy5zdW1tYXJ5U2VydmljZS5ncmlkID0gdGhpcyBhcyBhbnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBfc2V0dXBMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGNvbnN0IGRlc3RydWN0b3IgPSB0YWtlVW50aWw8YW55Pih0aGlzLmRlc3Ryb3kkKTtcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMubmF0aXZlRWxlbWVudCwgJ2ZvY3Vzb3V0JykucGlwZShmaWx0ZXIoKCkgPT4gISF0aGlzLm5hdmlnYXRpb24uYWN0aXZlTm9kZSksIGRlc3RydWN0b3IpLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jcnVkU2VydmljZS5jZWxsICYmXG4gICAgICAgICAgICAgICAgISF0aGlzLm5hdmlnYXRpb24uYWN0aXZlTm9kZSAmJlxuICAgICAgICAgICAgICAgICgoZXZlbnQudGFyZ2V0ID09PSB0aGlzLnRib2R5Lm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUucm93ID49IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUucm93IDwgdGhpcy5kYXRhVmlldy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHx8IChldmVudC50YXJnZXQgPT09IHRoaXMudGhlYWRSb3cubmF0aXZlRWxlbWVudCAmJiB0aGlzLm5hdmlnYXRpb24uYWN0aXZlTm9kZS5yb3cgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICB8fCAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLnRmb290Lm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUucm93ID09PSB0aGlzLmRhdGFWaWV3Lmxlbmd0aCkpICYmXG4gICAgICAgICAgICAgICAgISh0aGlzLnJvd0VkaXRhYmxlICYmIHRoaXMuY3J1ZFNlcnZpY2Uucm93RWRpdGluZ0Jsb2NrZWQgJiYgdGhpcy5jcnVkU2VydmljZS5yb3dJbkVkaXRNb2RlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5sYXN0QWN0aXZlTm9kZSA9IHRoaXMubmF2aWdhdGlvbi5hY3RpdmVOb2RlO1xuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5hY3RpdmVOb2RlID0ge30gYXMgSUFjdGl2ZU5vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJvd0FkZGVkTm90aWZpZXIucGlwZShkZXN0cnVjdG9yKS5zdWJzY3JpYmUoYXJncyA9PiB0aGlzLnJlZnJlc2hHcmlkU3RhdGUoYXJncykpO1xuICAgICAgICB0aGlzLnJvd0RlbGV0ZWROb3RpZmllci5waXBlKGRlc3RydWN0b3IpLnN1YnNjcmliZShhcmdzID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuZGVsZXRlT3BlcmF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoYXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG9UcmFuc2FjdGlvbnMoKTtcblxuICAgICAgICB0aGlzLnJlc2l6ZU5vdGlmeS5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKCgpID0+ICF0aGlzLl9pbml0KSxcbiAgICAgICAgICAgIHRocm90dGxlVGltZSgwLCBhbmltYXRpb25GcmFtZVNjaGVkdWxlciwgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogdHJ1ZSB9KSxcbiAgICAgICAgICAgIGRlc3RydWN0b3JcbiAgICAgICAgKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdCB0cmlnZ2VyIHJlZmxvdyBpZiBlbGVtZW50IGlzIGRldGFjaGVkLlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kb2N1bWVudC5jb250YWlucyh0aGlzLm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGlwZVRyaWdnZXJOb3RpZmllci5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMucGlwZVRyaWdnZXIrKyk7XG4gICAgICAgIHRoaXMuY29sdW1uTW92aW5nRW5kLnBpcGUoZGVzdHJ1Y3Rvcikuc3Vic2NyaWJlKCgpID0+IHRoaXMuY3J1ZFNlcnZpY2UuZW5kRWRpdChmYWxzZSkpO1xuXG4gICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2Uub3BlbmluZy5waXBlKGRlc3RydWN0b3IpLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCA9PT0gZXZlbnQuaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGV2ZW50LmNvbXBvbmVudFJlZi5pbnN0YW5jZSBhcyBJZ3hBZHZhbmNlZEZpbHRlcmluZ0RpYWxvZ0NvbXBvbmVudDtcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuaW5pdGlhbGl6ZSh0aGlzIGFzIGFueSwgdGhpcy5vdmVybGF5U2VydmljZSwgZXZlbnQuaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vdmVybGF5U2VydmljZS5vcGVuZWQucGlwZShkZXN0cnVjdG9yKS5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvdmVybGF5U2V0dGluZ3MgPSB0aGlzLm92ZXJsYXlTZXJ2aWNlLmdldE92ZXJsYXlCeUlkKGV2ZW50LmlkKT8uc2V0dGluZ3M7XG5cbiAgICAgICAgICAgIC8vIGRvIG5vdCBoaWRlIHRoZSBhZHZhbmNlZCBmaWx0ZXJpbmcgb3ZlcmxheSBvbiBzY3JvbGxcbiAgICAgICAgICAgIGlmICh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCA9PT0gZXZlbnQuaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGV2ZW50LmNvbXBvbmVudFJlZi5pbnN0YW5jZSBhcyBJZ3hBZHZhbmNlZEZpbHRlcmluZ0RpYWxvZ0NvbXBvbmVudDtcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UubGFzdEFjdGl2ZU5vZGUgPSB0aGlzLm5hdmlnYXRpb24uYWN0aXZlTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Uuc2V0QWRkQnV0dG9uRm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkbyBub3QgaGlkZSB0aGUgb3ZlcmxheSBpZiBpdCdzIGF0dGFjaGVkIHRvIGEgcm93XG4gICAgICAgICAgICBpZiAodGhpcy5yb3dFZGl0aW5nT3ZlcmxheT8ub3ZlcmxheUlkID09PSBldmVudC5pZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG92ZXJsYXlTZXR0aW5ncz8ub3V0bGV0ID09PSB0aGlzLm91dGxldCAmJiB0aGlzLm92ZXJsYXlJRHMuaW5kZXhPZihldmVudC5pZCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5SURzLnB1c2goZXZlbnQuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm92ZXJsYXlTZXJ2aWNlLmNsb3NlZC5waXBlKGZpbHRlcigoKSA9PiAhdGhpcy5faW5pdCksIGRlc3RydWN0b3IpLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCA9PT0gZXZlbnQuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlTZXJ2aWNlLmRldGFjaCh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWR2YW5jZWRGaWx0ZXJpbmdPdmVybGF5SWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaW5kID0gdGhpcy5vdmVybGF5SURzLmluZGV4T2YoZXZlbnQuaWQpO1xuICAgICAgICAgICAgaWYgKGluZCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlJRHMuc3BsaWNlKGluZCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuZGF0YUNoYW5naW5nLnBpcGUoZmlsdGVyKCgpID0+ICF0aGlzLl9pbml0KSwgZGVzdHJ1Y3Rvcikuc3Vic2NyaWJlKCgkZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFJlY2FsY1NpemUgPSB0aGlzLmlzUGVyY2VudEhlaWdodCAmJlxuICAgICAgICAgICAgICAgICghdGhpcy5jYWxjSGVpZ2h0IHx8IHRoaXMuY2FsY0hlaWdodCA9PT0gdGhpcy5nZXREYXRhQmFzZWRCb2R5SGVpZ2h0KCkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjSGVpZ2h0ID09PSB0aGlzLnJlbmRlcmVkUm93SGVpZ2h0ICogdGhpcy5fZGVmYXVsdFRhcmdldFJlY29yZE51bWJlcik7XG4gICAgICAgICAgICBpZiAoc2hvdWxkUmVjYWxjU2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlR3JpZEhlaWdodCgpO1xuICAgICAgICAgICAgICAgICRldmVudC5jb250YWluZXJTaXplID0gdGhpcy5jYWxjSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ldmFsdWF0ZUxvYWRpbmdTdGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnNjcm9sbGJhclZpc2liaWxpdHlDaGFuZ2VkLnBpcGUoZmlsdGVyKCgpID0+ICF0aGlzLl9pbml0KSwgZGVzdHJ1Y3Rvcikuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIC8vIGNhbGxlZCB0byByZWNhbGMgYWxsIHdpZHRocyB0aGF0IG1heSBoYXZlIGNoYW5nZXMgYXMgYSByZXN1bHQgb2ZcbiAgICAgICAgICAgIC8vIHRoZSB2ZXJ0LiBzY3JvbGxiYXIgc2hvd2luZy9oaWRpbmdcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5jb250ZW50U2l6ZUNoYW5nZS5waXBlKGZpbHRlcigoKSA9PiAhdGhpcy5faW5pdCksIGRlc3RydWN0b3IpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vbkRlbnNpdHlDaGFuZ2VkLnBpcGUoZGVzdHJ1Y3Rvcikuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3J1ZFNlcnZpY2UuZW5kRWRpdChmYWxzZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3VtbWFyeVJvd0hlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2Uuc3VtbWFyeUhlaWdodCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgICAgIHRoaXMuX3NldHVwU2VydmljZXMoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5yb3dMaXN0RGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQoW10pLmNyZWF0ZShudWxsKTtcbiAgICAgICAgLy8gY29tcGFyZSBiYXNlZCBvbiBmaWVsZCwgbm90IG9uIG9iamVjdCByZWYuXG4gICAgICAgIHRoaXMuY29sdW1uTGlzdERpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKFtdKS5jcmVhdGUoKGluZGV4LCBjb2w6IENvbHVtblR5cGUpID0+IGNvbC5maWVsZCk7XG4gICAgICAgIHRoaXMuY2FsY1dpZHRoID0gdGhpcy53aWR0aCAmJiB0aGlzLndpZHRoLmluZGV4T2YoJyUnKSA9PT0gLTEgPyBwYXJzZUludCh0aGlzLndpZHRoLCAxMCkgOiAwO1xuICAgICAgICB0aGlzLnNob3VsZEdlbmVyYXRlID0gdGhpcy5hdXRvR2VuZXJhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldENvbHVtbnNDYWNoZXMoKSB7XG4gICAgICAgIHRoaXMuY29sdW1uTGlzdC5mb3JFYWNoKGNvbHVtbiA9PiBjb2x1bW4ucmVzZXRDYWNoZXMoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVSb3dJRCgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgICAgICBjb25zdCBwcmltYXJ5Q29sdW1uID0gdGhpcy5jb2x1bW5MaXN0LmZpbmQoY29sID0+IGNvbC5maWVsZCA9PT0gdGhpcy5wcmltYXJ5S2V5KTtcbiAgICAgICAgY29uc3QgaWRUeXBlID0gdGhpcy5kYXRhLmxlbmd0aCA/XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVEYXRhVHlwZXModGhpcy5kYXRhWzBdW3RoaXMucHJpbWFyeUtleV0pIDogcHJpbWFyeUNvbHVtbiA/IHByaW1hcnlDb2x1bW4uZGF0YVR5cGUgOiAnc3RyaW5nJztcbiAgICAgICAgcmV0dXJuIGlkVHlwZSA9PT0gJ3N0cmluZycgPyB1dWlkdjQoKSA6IEZBS0VfUk9XX0lELS07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldEZvck9mQ2FjaGUoKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0VmlydFJvdyA9IHRoaXMuZGF0YVJvd0xpc3QuZmlyc3Q7XG4gICAgICAgIGlmIChmaXJzdFZpcnRSb3cpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jZHJSZXF1ZXN0cykge1xuICAgICAgICAgICAgICAgIGZpcnN0VmlydFJvdy52aXJ0RGlyUm93LmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaXJzdFZpcnRSb3cudmlydERpclJvdy5hc3N1bWVNYXN0ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RmlsdGVyZWREYXRhKGRhdGEsIHBpbm5lZDogYm9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5oYXNQaW5uZWRSZWNvcmRzICYmIHBpbm5lZCkge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyZWRQaW5uZWREYXRhID0gZGF0YSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkVW5waW5uZWQgPSB0aGlzLl9maWx0ZXJlZFVucGlubmVkRGF0YSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IFsuLi4gdGhpcy5fZmlsdGVyZWRQaW5uZWREYXRhLCAuLi5maWx0ZXJlZFVucGlubmVkXTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhLmxlbmd0aCA+IDAgPyBmaWx0ZXJlZERhdGEgOiB0aGlzLl9maWx0ZXJlZFVucGlubmVkRGF0YTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1Bpbm5lZFJlY29yZHMgJiYgIXBpbm5lZCkge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyZWRVbnBpbm5lZERhdGEgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldENvbHVtbkNvbGxlY3Rpb25zKCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlQ29sdW1ucy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9waW5uZWRWaXNpYmxlLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX3VucGlubmVkVmlzaWJsZS5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXRDYWNoZWRXaWR0aHMoKSB7XG4gICAgICAgIHRoaXMuX3VucGlubmVkV2lkdGggPSBOYU47XG4gICAgICAgIHRoaXMuX3Bpbm5lZFdpZHRoID0gTmFOO1xuICAgICAgICB0aGlzLl90b3RhbFdpZHRoID0gTmFOO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXRDYWNoZXMocmVjYWxjRmVhdHVyZVdpZHRoID0gdHJ1ZSkge1xuICAgICAgICBpZiAocmVjYWxjRmVhdHVyZVdpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJGZWF0dXJlc1dpZHRoID0gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRGb3JPZkNhY2hlKCk7XG4gICAgICAgIHRoaXMucmVzZXRDb2x1bW5zQ2FjaGVzKCk7XG4gICAgICAgIHRoaXMucmVzZXRDb2x1bW5Db2xsZWN0aW9ucygpO1xuICAgICAgICB0aGlzLnJlc2V0Q2FjaGVkV2lkdGhzKCk7XG4gICAgICAgIHRoaXMuaGFzVmlzaWJsZUNvbHVtbnMgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2NvbHVtbkdyb3VwcyA9IHRoaXMuY29sdW1uTGlzdC5zb21lKGNvbCA9PiBjb2wuY29sdW1uR3JvdXApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB0aGlzLnRvb2xiYXIuY2hhbmdlcy5waXBlKGZpbHRlcigoKSA9PiAhdGhpcy5faW5pdCksIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKSk7XG4gICAgICAgIHRoaXMuc2V0VXBQYWdpbmF0b3IoKTtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uQ29tcG9uZW50cy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRVcFBhZ2luYXRvcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uU3RyaXApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uU3RyaXAubWVudU92ZXJsYXlTZXR0aW5ncy5vdXRsZXQgPSB0aGlzLm91dGxldDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGRhdGFSZWJpbmRpbmcoZXZlbnQ6IElGb3JPZkRhdGFDaGFuZ2luZ0V2ZW50QXJncykge1xuICAgICAgICB0aGlzLmRhdGFDaGFuZ2luZy5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBkYXRhUmVib3VuZChldmVudCkge1xuICAgICAgICB0aGlzLmRhdGFDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBjcmVhdGVGaWx0ZXJEcm9wZG93bihjb2x1bW46IENvbHVtblR5cGUsIG9wdGlvbnM6IE92ZXJsYXlTZXR0aW5ncykge1xuICAgICAgICBvcHRpb25zLm91dGxldCA9IHRoaXMub3V0bGV0O1xuICAgICAgICBpZiAodGhpcy5leGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLmV4Y2VsU3R5bGVGaWx0ZXJpbmdDb21wb25lbnQuaW5pdGlhbGl6ZShjb2x1bW4sIHRoaXMub3ZlcmxheVNlcnZpY2UpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLm92ZXJsYXlTZXJ2aWNlLmF0dGFjaCh0aGlzLmV4Y2VsU3R5bGVGaWx0ZXJpbmdDb21wb25lbnQuZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmV4Y2VsU3R5bGVGaWx0ZXJpbmdDb21wb25lbnQub3ZlcmxheUNvbXBvbmVudElkID0gaWQ7XG4gICAgICAgICAgICByZXR1cm4geyBpZCwgcmVmOiB1bmRlZmluZWQgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWYgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEluc3RhbmNlKElneEdyaWRFeGNlbFN0eWxlRmlsdGVyaW5nQ29tcG9uZW50KTtcbiAgICAgICAgcmVmLmluc3RhbmNlLmluaXRpYWxpemUoY29sdW1uLCB0aGlzLm92ZXJsYXlTZXJ2aWNlKTtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLm92ZXJsYXlTZXJ2aWNlLmF0dGFjaChyZWYuaW5zdGFuY2UuZWxlbWVudCwgb3B0aW9ucyk7XG4gICAgICAgIHJlZi5pbnN0YW5jZS5vdmVybGF5Q29tcG9uZW50SWQgPSBpZDtcbiAgICAgICAgcmV0dXJuIHsgcmVmLCBpZCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50SW5zdGFuY2UoY29tcG9uZW50OiBhbnkpIHtcbiAgICAgICAgbGV0IGR5bmFtaWNGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT47XG4gICAgICAgIGNvbnN0IGZhY3RvcnlSZXNvbHZlciA9IHRoaXMubW9kdWxlUmVmXG4gICAgICAgICAgICA/IHRoaXMubW9kdWxlUmVmLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxuICAgICAgICAgICAgOiB0aGlzLnJlc29sdmVyO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluYW1pY0ZhY3RvcnkgPSBmYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMubW9kdWxlUmVmXG4gICAgICAgICAgICA/IHRoaXMubW9kdWxlUmVmLmluamVjdG9yXG4gICAgICAgICAgICA6IHRoaXMuaW5qZWN0b3I7XG4gICAgICAgIGNvbnN0IGR5bmFtaWNDb21wb25lbnQ6IENvbXBvbmVudFJlZjxhbnk+ID0gZHluYW1pY0ZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgaW5qZWN0b3JcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5hcHBSZWYuYXR0YWNoVmlldyhkeW5hbWljQ29tcG9uZW50Lmhvc3RWaWV3KTtcblxuICAgICAgICByZXR1cm4gZHluYW1pY0NvbXBvbmVudDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgc2V0VXBQYWdpbmF0b3IoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhZ2luYXRvcikge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IucGFnZUNoYW5nZS5waXBlKHRha2VXaGlsZSgoKSA9PiAhIXRoaXMucGFnaW5hdG9yKSwgZmlsdGVyKCgpID0+ICF0aGlzLl9pbml0KSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChwYWdlOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlQ2hhbmdlLmVtaXQocGFnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5wYWdpbmdEb25lLnBpcGUodGFrZVdoaWxlKCgpID0+ICEhdGhpcy5wYWdpbmF0b3IpLCBmaWx0ZXIoKCkgPT4gIXRoaXMuX2luaXQpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGFyZ3M6IElQYWdlRXZlbnRBcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5jbGVhcih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmdEb25lLmVtaXQoeyBwcmV2aW91czogYXJncy5wcmV2aW91cywgY3VycmVudDogYXJncy5jdXJyZW50IH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUbygwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5wZXJQYWdlQ2hhbmdlLnBpcGUodGFrZVdoaWxlKCgpID0+ICEhdGhpcy5wYWdpbmF0b3IpLCBmaWx0ZXIoKCkgPT4gIXRoaXMuX2luaXQpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHBlclBhZ2U6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyUGFnZUNoYW5nZS5lbWl0KHBlclBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci5wYWdlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRGaWx0ZXJlZFNvcnRlZERhdGEoZGF0YSwgcGlubmVkOiBib29sZWFuKSB7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IFtdO1xuICAgICAgICBpZiAodGhpcy5waW5uZWRSZWNvcmRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBpZiAocGlubmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsdGVyZWRTb3J0ZWRQaW5uZWREYXRhID0gZGF0YTtcbiAgICAgICAgICAgICAgICB0aGlzLnBpbm5lZFJlY29yZHMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbHRlcmVkU29ydGVkRGF0YSA9IHRoaXMuaXNSb3dQaW5uaW5nVG9Ub3AgPyBbLi4uIHRoaXMuX2ZpbHRlcmVkU29ydGVkUGlubmVkRGF0YSwgLi4uIHRoaXMuX2ZpbHRlcmVkU29ydGVkVW5waW5uZWREYXRhXSA6XG4gICAgICAgICAgICAgICAgICAgIFsuLi4gdGhpcy5fZmlsdGVyZWRTb3J0ZWRVbnBpbm5lZERhdGEsIC4uLiB0aGlzLl9maWx0ZXJlZFNvcnRlZFBpbm5lZERhdGFdO1xuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlYXJjaCh0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbHRlcmVkU29ydGVkVW5waW5uZWREYXRhID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcmVkU29ydGVkRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hTZWFyY2godHJ1ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnVpbGREYXRhVmlldyhkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldEhvcml6b250YWxWaXJ0dWFsaXphdGlvbigpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudEZpbHRlciA9IChpdGVtOiBJZ3hSb3dEaXJlY3RpdmUgfCBJZ3hTdW1tYXJ5Um93Q29tcG9uZW50KSA9PiB0aGlzLmlzRGVmaW5lZChpdGVtLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCk7XG4gICAgICAgIHRoaXMuX2hvcml6b250YWxGb3JPZnMgPSBbXG4gICAgICAgICAgICAuLi50aGlzLl9kYXRhUm93TGlzdC5maWx0ZXIoZWxlbWVudEZpbHRlcikubWFwKGl0ZW0gPT4gaXRlbS52aXJ0RGlyUm93KSxcbiAgICAgICAgICAgIC4uLnRoaXMuX3N1bW1hcnlSb3dMaXN0LmZpbHRlcihlbGVtZW50RmlsdGVyKS5tYXAoaXRlbSA9PiBpdGVtLnZpcnREaXJSb3cpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgX3NldHVwUm93T2JzZXJ2ZXJzKCkge1xuICAgICAgICBjb25zdCBlbGVtZW50RmlsdGVyID0gKGl0ZW06IElneFJvd0RpcmVjdGl2ZSB8IElneFN1bW1hcnlSb3dDb21wb25lbnQpID0+IHRoaXMuaXNEZWZpbmVkKGl0ZW0ubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgY29uc3QgZXh0cmFjdEZvck9mcyA9IHBpcGUobWFwKChjb2xsZWN0aW9uOiBhbnlbXSkgPT4gY29sbGVjdGlvbi5maWx0ZXIoZWxlbWVudEZpbHRlcikubWFwKGl0ZW0gPT4gaXRlbS52aXJ0RGlyUm93KSkpO1xuICAgICAgICBjb25zdCByb3dMaXN0T2JzZXJ2ZXIgPSBleHRyYWN0Rm9yT2ZzKHRoaXMuX2RhdGFSb3dMaXN0LmNoYW5nZXMpO1xuICAgICAgICBjb25zdCBzdW1tYXJ5Um93T2JzZXJ2ZXIgPSBleHRyYWN0Rm9yT2ZzKHRoaXMuX3N1bW1hcnlSb3dMaXN0LmNoYW5nZXMpO1xuICAgICAgICByb3dMaXN0T2JzZXJ2ZXIucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0SG9yaXpvbnRhbFZpcnR1YWxpemF0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzdW1tYXJ5Um93T2JzZXJ2ZXIucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0SG9yaXpvbnRhbFZpcnR1YWxpemF0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc2V0SG9yaXpvbnRhbFZpcnR1YWxpemF0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgX3pvbmVCZWdvbmVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLmdldFNjcm9sbCgpLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMudmVydGljYWxTY3JvbGxIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJDb250YWluZXI/LmdldFNjcm9sbCgpLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJykucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlc2l6ZU5vdGlmeS5uZXh0KCkpO1xuICAgICAgICAgICAgcmVzaXplT2JzZXJ2YWJsZSh0aGlzLm5hdGl2ZUVsZW1lbnQpLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZXNpemVOb3RpZnkubmV4dCgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdFBpbm5pbmcoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVHcmlkU2l6ZXMoKTtcbiAgICAgICAgdGhpcy5faW5pdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNkci5yZWF0dGFjaCgpO1xuICAgICAgICB0aGlzLl9zZXR1cFJvd09ic2VydmVycygpO1xuICAgICAgICB0aGlzLl96b25lQmVnb25lTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgY29uc3QgdmVydFNjckRDID0gdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5kaXNwbGF5Q29udGFpbmVyO1xuICAgICAgICB2ZXJ0U2NyREMuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5wcmV2ZW50Q29udGFpbmVyU2Nyb2xsLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuX3Bpbm5lZFJvd0xpc3QuY2hhbmdlc1xuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoY2hhbmdlOiBRdWVyeUxpc3Q8SWd4R3JpZFJvd0NvbXBvbmVudD4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGlubmVkUm93c0NoYW5nZWQoY2hhbmdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkUm93U25hY2tiYXI/LmNsaWNrZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlYyA9IHRoaXMuZmlsdGVyZWRTb3J0ZWREYXRhW3RoaXMubGFzdEFkZGVkUm93SW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyhyZWMsIDApO1xuICAgICAgICAgICAgdGhpcy5hZGRSb3dTbmFja2Jhci5jbG9zZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBLZWVwIHRoZSBzdHJlYW0gb3BlbiBmb3IgZnV0dXJlIHN1YnNjcmliZXJzXG4gICAgICAgIHRoaXMucmVuZGVyZWQkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IucGVyUGFnZSA9IHRoaXMuX3BlclBhZ2UgIT09IERFRkFVTFRfSVRFTVNfUEVSX1BBR0UgPyB0aGlzLl9wZXJQYWdlIDogdGhpcy5wYWdpbmF0b3IucGVyUGFnZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRvci50b3RhbFJlY29yZHMgPSB0aGlzLnRvdGFsUmVjb3JkcyA/IHRoaXMudG90YWxSZWNvcmRzIDogdGhpcy5wYWdpbmF0b3IudG90YWxSZWNvcmRzO1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yLm92ZXJsYXlTZXR0aW5ncyA9IHsgb3V0bGV0OiB0aGlzLm91dGxldCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLnJlbmRlcmVkLm5leHQodHJ1ZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5vdGlmeUNoYW5nZXMocmVwYWludCA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2NkclJlcXVlc3RzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fY2RyUmVxdWVzdFJlcGFpbnQgPSByZXBhaW50O1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0RvQ2hlY2soKSB7XG4gICAgICAgIHN1cGVyLm5nRG9DaGVjaygpO1xuICAgICAgICBpZiAodGhpcy5faW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NkclJlcXVlc3RSZXBhaW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0Tm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVHcmlkU2l6ZXMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlYXJjaCh0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jZHJSZXF1ZXN0cykge1xuICAgICAgICAgICAgdGhpcy5yZXNldE5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RHJhZ0dob3N0Q3VzdG9tVGVtcGxhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdHaG9zdEN1c3RvbVRlbXBsYXRlcyAmJiB0aGlzLmRyYWdHaG9zdEN1c3RvbVRlbXBsYXRlcy5maXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJhZ0dob3N0Q3VzdG9tVGVtcGxhdGVzLmZpcnN0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudG1wT3V0bGV0cy5mb3JFYWNoKCh0bXBsT3V0bGV0KSA9PiB7XG4gICAgICAgICAgICB0bXBsT3V0bGV0LmNsZWFuQ2FjaGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25DaGFuZ2UkLm5leHQoKTtcbiAgICAgICAgdGhpcy50cmFuc2FjdGlvbkNoYW5nZSQuY29tcGxldGUoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5fYWR2YW5jZWRGaWx0ZXJpbmdPdmVybGF5SWQpIHtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2UuZGV0YWNoKHRoaXMuX2FkdmFuY2VkRmlsdGVyaW5nT3ZlcmxheUlkKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3ZlcmxheUlEcy5mb3JFYWNoKG92ZXJsYXlJRCA9PiB7XG4gICAgICAgICAgICBjb25zdCBvdmVybGF5ID0gdGhpcy5vdmVybGF5U2VydmljZS5nZXRPdmVybGF5QnlJZChvdmVybGF5SUQpO1xuXG4gICAgICAgICAgICBpZiAob3ZlcmxheSAmJiAhb3ZlcmxheS5kZXRhY2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2UuZGV0YWNoKG92ZXJsYXlJRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyPy5nZXRTY3JvbGwoKT8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy52ZXJ0aWNhbFNjcm9sbEhhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJDb250YWluZXI/LmdldFNjcm9sbCgpPy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhvcml6b250YWxTY3JvbGxIYW5kbGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHZlcnRTY3JEQyA9IHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXI/LmRpc3BsYXlDb250YWluZXI7XG4gICAgICAgICAgICB2ZXJ0U2NyREM/LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMucHJldmVudENvbnRhaW5lclNjcm9sbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZXMgdGhlIHNwZWNpZmllZCBjb2x1bW4ncyB2aXNpYmlsaXR5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkMS50b2dnbGVDb2x1bW5WaXNpYmlsaXR5KHtcbiAgICAgKiAgICAgICBjb2x1bW46IHRoaXMuZ3JpZDEuY29sdW1uc1swXSxcbiAgICAgKiAgICAgICBuZXdWYWx1ZTogdHJ1ZVxuICAgICAqIH0pO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVDb2x1bW5WaXNpYmlsaXR5KGFyZ3M6IElDb2x1bW5WaXNpYmlsaXR5Q2hhbmdlZEV2ZW50QXJncykge1xuICAgICAgICBjb25zdCBjb2wgPSBhcmdzLmNvbHVtbiA/IHRoaXMuY29sdW1uTGlzdC5maW5kKChjKSA9PiBjID09PSBhcmdzLmNvbHVtbikgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKCFjb2wpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb2wudG9nZ2xlVmlzaWJpbGl0eShhcmdzLm5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgYSBsaXN0IG9mIGtleS12YWx1ZSBwYWlycyBbcm93IElELCBleHBhbnNpb24gc3RhdGVdLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJbmNsdWRlcyBvbmx5IHN0YXRlcyB0aGF0IGRpZmZlciBmcm9tIHRoZSBkZWZhdWx0IG9uZS5cbiAgICAgKiBTdXBwb3J0cyB0d28td2F5IGJpbmRpbmcuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImRhdGFcIiBbKGV4cGFuc2lvblN0YXRlcyldPVwibW9kZWwuZXhwYW5zaW9uU3RhdGVzXCI+XG4gICAgICogPC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZXhwYW5zaW9uU3RhdGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5zaW9uU3RhdGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZXhwYW5zaW9uU3RhdGVzKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2V4cGFuc2lvblN0YXRlcyA9IG5ldyBNYXA8YW55LCBib29sZWFuPih2YWx1ZSk7XG4gICAgICAgIHRoaXMuZXhwYW5zaW9uU3RhdGVzQ2hhbmdlLmVtaXQodGhpcy5fZXhwYW5zaW9uU3RhdGVzKTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgICAgICBpZiAodGhpcy5ncmlkQVBJLmdyaWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4cGFuZHMgYWxsIHJvd3MuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuZXhwYW5kQWxsKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGV4cGFuZEFsbCgpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdEV4cGFuZFN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5leHBhbnNpb25TdGF0ZXMgPSBuZXcgTWFwPGFueSwgYm9vbGVhbj4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb2xsYXBzZXMgYWxsIHJvd3MuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuY29sbGFwc2VBbGwoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgY29sbGFwc2VBbGwoKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRFeHBhbmRTdGF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV4cGFuc2lvblN0YXRlcyA9IG5ldyBNYXA8YW55LCBib29sZWFuPigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4cGFuZHMgdGhlIHJvdyBieSBpdHMgaWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElEIGlzIGVpdGhlciB0aGUgcHJpbWFyeUtleSB2YWx1ZSBvciB0aGUgZGF0YSByZWNvcmQgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmV4cGFuZFJvdyhyb3dJRCk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHJvd0lEIFRoZSByb3cgaWQgLSBwcmltYXJ5S2V5IHZhbHVlIG9yIHRoZSBkYXRhIHJlY29yZCBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwYW5kUm93KHJvd0lEOiBhbnkpIHtcbiAgICAgICAgdGhpcy5ncmlkQVBJLnNldF9yb3dfZXhwYW5zaW9uX3N0YXRlKHJvd0lELCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb2xsYXBzZXMgdGhlIHJvdyBieSBpdHMgaWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElEIGlzIGVpdGhlciB0aGUgcHJpbWFyeUtleSB2YWx1ZSBvciB0aGUgZGF0YSByZWNvcmQgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmNvbGxhcHNlUm93KHJvd0lEKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93SUQgVGhlIHJvdyBpZCAtIHByaW1hcnlLZXkgdmFsdWUgb3IgdGhlIGRhdGEgcmVjb3JkIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsYXBzZVJvdyhyb3dJRDogYW55KSB7XG4gICAgICAgIHRoaXMuZ3JpZEFQSS5zZXRfcm93X2V4cGFuc2lvbl9zdGF0ZShyb3dJRCwgZmFsc2UpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgcm93IGJ5IGl0cyBpZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSUQgaXMgZWl0aGVyIHRoZSBwcmltYXJ5S2V5IHZhbHVlIG9yIHRoZSBkYXRhIHJlY29yZCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQudG9nZ2xlUm93KHJvd0lEKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93SUQgVGhlIHJvdyBpZCAtIHByaW1hcnlLZXkgdmFsdWUgb3IgdGhlIGRhdGEgcmVjb3JkIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVSb3cocm93SUQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWMgPSB0aGlzLmdyaWRBUEkuZ2V0X3JlY19ieV9pZChyb3dJRCk7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5ncmlkQVBJLmdldF9yb3dfZXhwYW5zaW9uX3N0YXRlKHJlYyk7XG4gICAgICAgIHRoaXMuZ3JpZEFQSS5zZXRfcm93X2V4cGFuc2lvbl9zdGF0ZShyb3dJRCwgIXN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldERlZmF1bHRFeHBhbmRTdGF0ZShfcmVjOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRFeHBhbmRTdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG5hdGl2ZUVsID0gdGhpcy5ncmlkLm5hdGl2ZUVsZW1lbnQuXG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBvdXRsZXQgdXNlZCB0byBhdHRhY2ggdGhlIGdyaWQncyBvdmVybGF5cyB0by5cbiAgICAgKlxuICAgICAqIEByZW1hcmtcbiAgICAgKiBJZiBzZXQsIHJldHVybnMgdGhlIG91dGxldCBkZWZpbmVkIG91dHNpZGUgdGhlIGdyaWQuIE90aGVyd2lzZSByZXR1cm5zIHRoZSBncmlkJ3MgaW50ZXJuYWwgb3V0bGV0IGRpcmVjdGl2ZS5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgb3V0bGV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlT3V0bGV0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBvdXRsZXQodmFsOiBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlKSB7XG4gICAgICAgIHRoaXMuX3VzZXJPdXRsZXREaXJlY3RpdmUgPSB2YWw7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBkZWZhdWx0IHJvdyBoZWlnaHQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCByb3dIZWlnaCA9IHRoaXMuZ3JpZC5kZWZhdWx0Um93SGVpZ2h0O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGVmYXVsdFJvd0hlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuZGlzcGxheURlbnNpdHkpIHtcbiAgICAgICAgICAgIGNhc2UgRGlzcGxheURlbnNpdHkuY29zeTpcbiAgICAgICAgICAgICAgICByZXR1cm4gNDA7XG4gICAgICAgICAgICBjYXNlIERpc3BsYXlEZW5zaXR5LmNvbXBhY3Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDMyO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gNTA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGVmYXVsdFN1bW1hcnlIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpc3BsYXlEZW5zaXR5KSB7XG4gICAgICAgICAgICBjYXNlIERpc3BsYXlEZW5zaXR5LmNvc3k6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDMwO1xuICAgICAgICAgICAgY2FzZSBEaXNwbGF5RGVuc2l0eS5jb21wYWN0OlxuICAgICAgICAgICAgICAgIHJldHVybiAyNDtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDM2O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYElneEdyaWRIZWFkZXJHcm91cENvbXBvbmVudGAncyBtaW5pbXVtIGFsbG93ZWQgd2lkdGguXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFVzZWQgaW50ZXJuYWxseSBmb3IgcmVzdHJpY3RpbmcgaGVhZGVyIGdyb3VwIGNvbXBvbmVudCB3aWR0aC5cbiAgICAgKiBUaGUgdmFsdWVzIGJlbG93IGRlcGVuZCBvbiB0aGUgaGVhZGVyIGNlbGwgZGVmYXVsdCByaWdodC9sZWZ0IHBhZGRpbmcgdmFsdWVzLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGVmYXVsdEhlYWRlckdyb3VwTWluV2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpc3BsYXlEZW5zaXR5KSB7XG4gICAgICAgICAgICBjYXNlIERpc3BsYXlEZW5zaXR5LmNvc3k6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDMyO1xuICAgICAgICAgICAgY2FzZSBEaXNwbGF5RGVuc2l0eS5jb21wYWN0OlxuICAgICAgICAgICAgICAgIHJldHVybiAyNDtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDQ4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCB3aWR0aCBvZiB0aGUgY29udGFpbmVyIGZvciB0aGUgcGlubmVkIGBJZ3hDb2x1bW5Db21wb25lbnRgcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHBpbm5lZFdpZHRoID0gdGhpcy5ncmlkLmdldFBpbm5lZFdpZHRoO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcGlubmVkV2lkdGgoKSB7XG4gICAgICAgIGlmICghaXNOYU4odGhpcy5fcGlubmVkV2lkdGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGlubmVkV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGlubmVkV2lkdGggPSB0aGlzLmdldFBpbm5lZFdpZHRoKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9waW5uZWRXaWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IHdpZHRoIG9mIHRoZSBjb250YWluZXIgZm9yIHRoZSB1bnBpbm5lZCBgSWd4Q29sdW1uQ29tcG9uZW50YHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCB1bnBpbm5lZFdpZHRoID0gdGhpcy5ncmlkLmdldFVucGlubmVkV2lkdGg7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bnBpbm5lZFdpZHRoKCkge1xuICAgICAgICBpZiAoIWlzTmFOKHRoaXMuX3VucGlubmVkV2lkdGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdW5waW5uZWRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91bnBpbm5lZFdpZHRoID0gdGhpcy5nZXRVbnBpbm5lZFdpZHRoKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl91bnBpbm5lZFdpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc0hvcml6b250YWxTY3JvbGxIaWRkZW4oKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLnVucGlubmVkV2lkdGggLSB0aGlzLnRvdGFsV2lkdGg7XG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoID09PSBudWxsIHx8IGRpZmYgPj0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIEdldHMgdGhlIGhlYWRlciBjZWxsIGlubmVyIHdpZHRoIGZvciBhdXRvLXNpemluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SGVhZGVyQ2VsbFdpZHRoKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSVNpemVJbmZvIHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIGNvbnN0IGhlYWRlcldpZHRoID0gdGhpcy5wbGF0Zm9ybS5nZXROb2RlU2l6ZVZpYVJhbmdlKHJhbmdlLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50RWxlbWVudCk7XG5cbiAgICAgICAgY29uc3QgaGVhZGVyU3R5bGUgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGhlYWRlclBhZGRpbmcgPSBwYXJzZUZsb2F0KGhlYWRlclN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQoaGVhZGVyU3R5bGUucGFkZGluZ1JpZ2h0KSArXG4gICAgICAgICAgICBwYXJzZUZsb2F0KGhlYWRlclN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpO1xuXG4gICAgICAgIC8vIFRha2UgaW50byBjb25zaWRlcmF0aW9uIHRoZSBoZWFkZXIgZ3JvdXAgZWxlbWVudCwgc2luY2UgY29sdW1uIHBpbm5pbmcgYXBwbGllcyBib3JkZXJzIHRvIGl0IGlmIGl0cyBub3QgYSBjb2x1bW5Hcm91cC5cbiAgICAgICAgY29uc3QgaGVhZGVyR3JvdXBTdHlsZSA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgICAgICBjb25zdCBib3JkZXJTaXplID0gcGFyc2VGbG9hdChoZWFkZXJHcm91cFN0eWxlLmJvcmRlclJpZ2h0V2lkdGgpICsgcGFyc2VGbG9hdChoZWFkZXJHcm91cFN0eWxlLmJvcmRlckxlZnRXaWR0aCk7XG4gICAgICAgIHJldHVybiB7IHdpZHRoOiBNYXRoLmNlaWwoaGVhZGVyV2lkdGgpLCBwYWRkaW5nOiBNYXRoLmNlaWwoaGVhZGVyUGFkZGluZyArIGJvcmRlclNpemUpIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBHZXRzIHRoZSBjb21iaW5lZCB3aWR0aCBvZiB0aGUgY29sdW1ucyB0aGF0IGFyZSBzcGVjaWZpYyB0byB0aGUgZW5hYmxlZCBncmlkIGZlYXR1cmVzLiBUaGV5IGFyZSBmaXhlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZmVhdHVyZUNvbHVtbnNXaWR0aChleHBhbmRlcj86IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgaWYgKE51bWJlci5pc05hTih0aGlzLl9oZWFkZXJGZWF0dXJlc1dpZHRoKSkge1xuICAgICAgICAgICAgLy8gVE9ETzogcGxhdGZvcm1VdGlsLmlzQnJvd3NlciBjaGVja1xuICAgICAgICAgICAgY29uc3Qgcm93U2VsZWN0QXJlYSA9IHRoaXMuaGVhZGVyU2VsZWN0b3JDb250YWluZXI/Lm5hdGl2ZUVsZW1lbnQ/LmdldEJvdW5kaW5nQ2xpZW50UmVjdCA/XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJTZWxlY3RvckNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIDogMDtcbiAgICAgICAgICAgIGNvbnN0IHJvd0RyYWdBcmVhID0gdGhpcy5yb3dEcmFnZ2FibGUgJiYgdGhpcy5oZWFkZXJEcmFnQ29udGFpbmVyPy5uYXRpdmVFbGVtZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyRHJhZ0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIDogMDtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwYWJsZUFyZWEgPSB0aGlzLmhlYWRlckdyb3VwQ29udGFpbmVyPy5uYXRpdmVFbGVtZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QgP1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyR3JvdXBDb250YWluZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA6IDA7XG4gICAgICAgICAgICBjb25zdCBleHBhbmRlcldpZHRoID0gZXhwYW5kZXI/Lm5hdGl2ZUVsZW1lbnQ/LmdldEJvdW5kaW5nQ2xpZW50UmVjdCA/IGV4cGFuZGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggOiAwO1xuICAgICAgICAgICAgdGhpcy5faGVhZGVyRmVhdHVyZXNXaWR0aCA9IHJvd1NlbGVjdEFyZWEgKyByb3dEcmFnQXJlYSArIGdyb3VwYWJsZUFyZWEgKyBleHBhbmRlcldpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXJGZWF0dXJlc1dpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBzdW1tYXJpZXNNYXJnaW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZlYXR1cmVDb2x1bW5zV2lkdGgoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGFycmF5IG9mIGBJZ3hDb2x1bW5Db21wb25lbnRgcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGNvbHVtcyA9IHRoaXMuZ3JpZC5jb2x1bW5zLlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29sdW1ucygpOiBJZ3hDb2x1bW5Db21wb25lbnRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJlZCA/IHRoaXMuX2NvbHVtbnMgOiBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGFycmF5IG9mIHRoZSBwaW5uZWQgYElneENvbHVtbkNvbXBvbmVudGBzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgcGlubmVkQ29sdW1ucyA9IHRoaXMuZ3JpZC5waW5uZWRDb2x1bW5zLlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcGlubmVkQ29sdW1ucygpOiBJZ3hDb2x1bW5Db21wb25lbnRbXSB7XG4gICAgICAgIGlmICh0aGlzLl9waW5uZWRWaXNpYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Bpbm5lZFZpc2libGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGlubmVkVmlzaWJsZSA9IHRoaXMuX3Bpbm5lZENvbHVtbnMuZmlsdGVyKGNvbCA9PiAhY29sLmhpZGRlbik7XG4gICAgICAgIHJldHVybiB0aGlzLl9waW5uZWRWaXNpYmxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYW4gYXJyYXkgb2YgdGhlIHBpbm5lZCBgSWd4Um93Q29tcG9uZW50YHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBwaW5uZWRSb3cgPSB0aGlzLmdyaWQucGlubmVkUm93cztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZFJvd3MoKTogSWd4R3JpZFJvd0NvbXBvbmVudFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bpbm5lZFJvd0xpc3QudG9BcnJheSgpLnNvcnQoKGEsIGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIGFycmF5IG9mIHVucGlubmVkIGBJZ3hDb2x1bW5Db21wb25lbnRgcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHVucGlubmVkQ29sdW1ucyA9IHRoaXMuZ3JpZC51bnBpbm5lZENvbHVtbnMuXG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bnBpbm5lZENvbHVtbnMoKTogSWd4Q29sdW1uQ29tcG9uZW50W10ge1xuICAgICAgICBpZiAodGhpcy5fdW5waW5uZWRWaXNpYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VucGlubmVkVmlzaWJsZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91bnBpbm5lZFZpc2libGUgPSB0aGlzLl91bnBpbm5lZENvbHVtbnMuZmlsdGVyKChjb2wpID0+ICFjb2wuaGlkZGVuKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VucGlubmVkVmlzaWJsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBgd2lkdGhgIHRvIGJlIHNldCBvbiBgSWd4R3JpZEhlYWRlckdyb3VwQ29tcG9uZW50YC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SGVhZGVyR3JvdXBXaWR0aChjb2x1bW46IElneENvbHVtbkNvbXBvbmVudCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0NvbHVtbkxheW91dHNcbiAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgIDogYCR7TWF0aC5tYXgocGFyc2VGbG9hdChjb2x1bW4uY2FsY1dpZHRoKSwgdGhpcy5kZWZhdWx0SGVhZGVyR3JvdXBNaW5XaWR0aCl9cHhgO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGBJZ3hDb2x1bW5Db21wb25lbnRgIGJ5IGZpZWxkIG5hbWUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUNvbCA9IHRoaXMuZ3JpZDEuZ2V0Q29sdW1uQnlOYW1lKFwiSURcIik7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29sdW1uQnlOYW1lKG5hbWU6IHN0cmluZyk6IElneENvbHVtbkNvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkxpc3QuZmluZCgoY29sKSA9PiBjb2wuZmllbGQgPT09IG5hbWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb2x1bW5CeVZpc2libGVJbmRleChpbmRleDogbnVtYmVyKTogSWd4Q29sdW1uQ29tcG9uZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZUNvbHVtbnMuZmluZCgoY29sKSA9PlxuICAgICAgICAgICAgIWNvbC5jb2x1bW5Hcm91cCAmJiAhY29sLmNvbHVtbkxheW91dCAmJlxuICAgICAgICAgICAgY29sLnZpc2libGVJbmRleCA9PT0gaW5kZXhcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHZpc2libGUgYElneENvbHVtbkNvbXBvbmVudGBzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgdmlzaWJsZUNvbHVtbnMgPSB0aGlzLmdyaWQudmlzaWJsZUNvbHVtbnMuXG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB2aXNpYmxlQ29sdW1ucygpOiBJZ3hDb2x1bW5Db21wb25lbnRbXSB7XG4gICAgICAgIGlmICh0aGlzLl92aXNpYmxlQ29sdW1ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlQ29sdW1ucztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92aXNpYmxlQ29sdW1ucyA9IHRoaXMuY29sdW1uTGlzdC5maWx0ZXIoYyA9PiAhYy5oaWRkZW4pO1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUNvbHVtbnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBleHBvc2VkIGJ5IHRoZSBgaWd4LXBhZ2luYXRvcmBcbiAgICAgKlxuICAgICAqIEdldHMgdGhlIHRvdGFsIG51bWJlciBvZiBwYWdlcy5cbiAgICAgKlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgdG90YWxQYWdlcyA9IHRoaXMuZ3JpZC50b3RhbFBhZ2VzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG90YWxQYWdlcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdpbmF0b3I/LnRvdGFsUGFnZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBleHBvc2VkIGJ5IHRoZSBgaWd4LXBhZ2luYXRvcmBcbiAgICAgKlxuICAgICAqIEdldHMgaWYgdGhlIGN1cnJlbnQgcGFnZSBpcyB0aGUgZmlyc3QgcGFnZS5cbiAgICAgKlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZmlyc3RQYWdlID0gdGhpcy5ncmlkLmlzRmlyc3RQYWdlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2luYXRvci5pc0xhc3RQYWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMS4wLiBVc2UgdGhlIGNvcnJlc3BvbmRpbmcgbWV0aG9kIGV4cG9zZWQgYnkgdGhlIGBpZ3gtcGFnaW5hdG9yYFxuICAgICAqXG4gICAgICogR29lcyB0byB0aGUgbmV4dCBwYWdlLCBpZiB0aGUgZ3JpZCBpcyBub3QgYWxyZWFkeSBhdCB0aGUgbGFzdCBwYWdlLlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQxLm5leHRQYWdlKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9tZW1iZXItb3JkZXJpbmdcbiAgICBwdWJsaWMgbmV4dFBhZ2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGFnaW5hdG9yPy5uZXh0UGFnZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMS4wLiBVc2UgdGhlIGNvcnJlc3BvbmRpbmcgbWV0aG9kIGV4cG9zZWQgYnkgdGhlIGBpZ3gtcGFnaW5hdG9yYFxuICAgICAqXG4gICAgICogR29lcyB0byB0aGUgcHJldmlvdXMgcGFnZSwgaWYgdGhlIGdyaWQgaXMgbm90IGFscmVhZHkgYXQgdGhlIGZpcnN0IHBhZ2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbWVtYmVyLW9yZGVyaW5nXG4gICAgcHVibGljIHByZXZpb3VzUGFnZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYWdpbmF0b3I/LnByZXZpb3VzUGFnZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHRvdGFsIG51bWJlciBvZiByZWNvcmRzLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBPbmx5IGZ1bmN0aW9ucyB3aGVuIHBhZ2luZyBpcyBlbmFibGVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHRvdGFsUmVjb3JkcyA9IHRoaXMuZ3JpZC50b3RhbFJlY29yZHM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHRvdGFsUmVjb3JkcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxSZWNvcmRzID49IDAgPyB0aGlzLl90b3RhbFJlY29yZHMgOiB0aGlzLnBhZ2luZ1N0YXRlPy5tZXRhZGF0YS5jb3VudFJlY29yZHM7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB0b3RhbFJlY29yZHModG90YWw6IG51bWJlcikge1xuICAgICAgICBpZiAodG90YWwgPj0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IudG90YWxSZWNvcmRzID0gdG90YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl90b3RhbFJlY29yZHMgPSB0b3RhbDtcbiAgICAgICAgICAgIHRoaXMucGlwZVRyaWdnZXIrKztcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBleHBvc2VkIGJ5IHRoZSBgaWd4LXBhZ2luYXRvcmBcbiAgICAgKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGN1cnJlbnQgcGFnZSBpcyB0aGUgbGFzdCBwYWdlLlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBsYXN0UGFnZSA9IHRoaXMuZ3JpZC5pc0xhc3RQYWdlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNMYXN0UGFnZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnaW5hdG9yLmlzTGFzdFBhZ2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdG90YWwgd2lkdGggb2YgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGdyaWRXaWR0aCA9IHRoaXMuZ3JpZC50b3RhbFdpZHRoO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG90YWxXaWR0aCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoIWlzTmFOKHRoaXMuX3RvdGFsV2lkdGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICAvLyBUYWtlIG9ubHkgdG9wIGxldmVsIGNvbHVtbnNcbiAgICAgICAgY29uc3QgY29scyA9IHRoaXMudmlzaWJsZUNvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wubGV2ZWwgPT09IDAgJiYgIWNvbC5waW5uZWQpO1xuICAgICAgICBsZXQgdG90YWxXaWR0aCA9IDA7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChpOyBpIDwgY29scy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG90YWxXaWR0aCArPSBwYXJzZUludChjb2xzW2ldLmNhbGNXaWR0aCwgMTApIHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG90YWxXaWR0aCA9IHRvdGFsV2lkdGg7XG4gICAgICAgIHJldHVybiB0b3RhbFdpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNob3dSb3dTZWxlY3RvcnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzUm93U2VsZWN0YWJsZSAmJiB0aGlzLmhhc1Zpc2libGVDb2x1bW5zICYmICF0aGlzLmhpZGVSb3dTZWxlY3RvcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd0FkZEJ1dHRvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm93RWRpdGFibGUgJiYgdGhpcy5kYXRhVmlldy5sZW5ndGggPT09IDAgJiYgdGhpcy5jb2x1bW5MaXN0Lmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd0RyYWdJY29ucygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm93RHJhZ2dhYmxlICYmIHRoaXMuY29sdW1uTGlzdC5sZW5ndGggPiB0aGlzLmhpZGRlbkNvbHVtbnNDb3VudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9nZXREYXRhVmlld0luZGV4KGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgbmV3SW5kZXggPSBpbmRleDtcbiAgICAgICAgaWYgKChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5kYXRhVmlldy5sZW5ndGgpICYmIHRoaXMucGFnaW5nTW9kZSA9PT0gMSAmJiB0aGlzLnBhZ2luYXRvci5wYWdlICE9PSAwKSB7XG4gICAgICAgICAgICBuZXdJbmRleCA9IGluZGV4IC0gdGhpcy5wYWdpbmF0b3IucGVyUGFnZSAqIHRoaXMucGFnaW5hdG9yLnBhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkQVBJLmdyaWQudmVydGljYWxTY3JvbGxDb250YWluZXIuaXNSZW1vdGUpIHtcbiAgICAgICAgICAgIG5ld0luZGV4ID0gaW5kZXggLSB0aGlzLmdyaWRBUEkuZ3JpZC52aXJ0dWFsaXphdGlvblN0YXRlLnN0YXJ0SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0luZGV4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0RGF0YUluZGV4KGRhdGFWaWV3SW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGxldCBuZXdJbmRleCA9IGRhdGFWaWV3SW5kZXg7XG4gICAgICAgIGlmICh0aGlzLmdyaWRBUEkuZ3JpZC52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5pc1JlbW90ZSkge1xuICAgICAgICAgICAgbmV3SW5kZXggPSBkYXRhVmlld0luZGV4ICsgdGhpcy5ncmlkQVBJLmdyaWQudmlydHVhbGl6YXRpb25TdGF0ZS5zdGFydEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdJbmRleDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGFjZXMgYSBjb2x1bW4gYmVmb3JlIG9yIGFmdGVyIHRoZSBzcGVjaWZpZWQgdGFyZ2V0IGNvbHVtbi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGdyaWQubW92ZUNvbHVtbihjb2x1bW4sIHRhcmdldCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIG1vdmVDb2x1bW4oY29sdW1uOiBJZ3hDb2x1bW5Db21wb25lbnQsIHRhcmdldDogSWd4Q29sdW1uQ29tcG9uZW50LCBwb3M6IERyb3BQb3NpdGlvbiA9IERyb3BQb3NpdGlvbi5BZnRlckRyb3BUYXJnZXQpIHtcbiAgICAgICAgLy8gTS5BLiBNYXkgMTF0aCwgMjAyMSAjOTUwOCBNYWtlIHRoZSBldmVudCBjYW5jZWxhYmxlXG4gICAgICAgIGNvbnN0IGV2ZW50QXJnczogSUNvbHVtbk1vdmluZ0VuZEV2ZW50QXJncyA9IHsgc291cmNlOiBjb2x1bW4sIHRhcmdldCwgY2FuY2VsOiBmYWxzZSB9O1xuXG4gICAgICAgIHRoaXMuY29sdW1uTW92aW5nRW5kLmVtaXQoZXZlbnRBcmdzKTtcblxuICAgICAgICBpZiAoZXZlbnRBcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbHVtbiA9PT0gdGFyZ2V0IHx8IChjb2x1bW4ubGV2ZWwgIT09IHRhcmdldC5sZXZlbCkgfHxcbiAgICAgICAgICAgIChjb2x1bW4udG9wTGV2ZWxQYXJlbnQgIT09IHRhcmdldC50b3BMZXZlbFBhcmVudCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2x1bW4ubGV2ZWwpIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVDaGlsZENvbHVtbnMoY29sdW1uLnBhcmVudCwgY29sdW1uLCB0YXJnZXQsIHBvcyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29sdW1uUGluU3RhdGVDaGFuZ2VkO1xuICAgICAgICAvLyBwaW5uaW5nIGFuZCB1bnBpbm5pbmcgd2lsbCB3b3JrIGNvcnJlY3RseSBldmVuIHdpdGhvdXQgcGFzc2luZyBpbmRleFxuICAgICAgICAvLyBidXQgaXMgZWFzaWVyIHRvIGNhbGNsdWxhdGUgdGhlIGluZGV4IGhlcmUsIGFuZCBsYXRlciB1c2UgaXQgaW4gdGhlIHBpbm5pbmcgZXZlbnQgYXJnc1xuICAgICAgICBpZiAodGFyZ2V0LnBpbm5lZCAmJiAhY29sdW1uLnBpbm5lZCkge1xuICAgICAgICAgICAgY29uc3QgcGlubmVkSW5kZXggPSB0aGlzLl9waW5uZWRDb2x1bW5zLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcG9zID09PSBEcm9wUG9zaXRpb24uQWZ0ZXJEcm9wVGFyZ2V0ID8gcGlubmVkSW5kZXggKyAxIDogcGlubmVkSW5kZXg7XG4gICAgICAgICAgICBjb2x1bW5QaW5TdGF0ZUNoYW5nZWQgPSBjb2x1bW4ucGluKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGFyZ2V0LnBpbm5lZCAmJiBjb2x1bW4ucGlubmVkKSB7XG4gICAgICAgICAgICBjb25zdCB1bnBpbm5lZEluZGV4ID0gdGhpcy5fdW5waW5uZWRDb2x1bW5zLmluZGV4T2YodGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcG9zID09PSBEcm9wUG9zaXRpb24uQWZ0ZXJEcm9wVGFyZ2V0ID8gdW5waW5uZWRJbmRleCArIDEgOiB1bnBpbm5lZEluZGV4O1xuICAgICAgICAgICAgY29sdW1uUGluU3RhdGVDaGFuZ2VkID0gY29sdW1uLnVucGluKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXQucGlubmVkICYmIGNvbHVtbi5waW5uZWQgJiYgIWNvbHVtblBpblN0YXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVvcmRlckNvbHVtbnMoY29sdW1uLCB0YXJnZXQsIHBvcywgdGhpcy5fcGlubmVkQ29sdW1ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRhcmdldC5waW5uZWQgJiYgIWNvbHVtbi5waW5uZWQgJiYgIWNvbHVtblBpblN0YXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVvcmRlckNvbHVtbnMoY29sdW1uLCB0YXJnZXQsIHBvcywgdGhpcy5fdW5waW5uZWRDb2x1bW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVDb2x1bW5zKGNvbHVtbiwgdGFyZ2V0LCBwb3MpO1xuICAgICAgICB0aGlzLl9jb2x1bW5zUmVvcmRlcmVkKGNvbHVtbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMi4xLjAuIFVzZSB0aGUgY29ycmVzcG9uZGluZyBtZXRob2QgZXhwb3NlZCBieSB0aGUgYGlneC1wYWdpbmF0b3JgXG4gICAgICpcbiAgICAgKiBHb2VzIHRvIHRoZSBkZXNpcmVkIHBhZ2UgaW5kZXguXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZDEucGFnaW5hdGUoMSk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHZhbFxuICAgICAqL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbWVtYmVyLW9yZGVyaW5nXG4gICAgcHVibGljIHBhZ2luYXRlKHZhbDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGFnaW5hdG9yPy5wYWdpbmF0ZSh2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24gZm9yIHRoZSBgSWd4R3JpZENvbXBvbmVudGAuXG4gICAgICogQ2FsbGluZyBtYXJrRm9yQ2hlY2sgYWxzbyB0cmlnZ2VycyB0aGUgZ3JpZCBwaXBlcyBleHBsaWNpdGx5LCByZXN1bHRpbmcgaW4gYWxsIHVwZGF0ZXMgYmVpbmcgcHJvY2Vzc2VkLlxuICAgICAqIE1heSBkZWdyYWRlIHBlcmZvcm1hbmNlIGlmIHVzZWQgd2hlbiBub3QgbmVlZGVkLCBvciBpZiBtaXN1c2VkOlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBET04nVHM6XG4gICAgICogLy8gZG9uJ3QgY2FsbCBtYXJrRm9yQ2hlY2sgZnJvbSBpbnNpZGUgYSBsb29wXG4gICAgICogLy8gZG9uJ3QgY2FsbCBtYXJrRm9yQ2hlY2sgd2hlbiBhIHByaW1pdGl2ZSBoYXMgY2hhbmdlZFxuICAgICAqIGdyaWQuZGF0YS5mb3JFYWNoKHJlYyA9PiB7XG4gICAgICogIHJlYyA9IG5ld1ZhbHVlO1xuICAgICAqICBncmlkLm1hcmtGb3JDaGVjaygpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gRE9zXG4gICAgICogLy8gY2FsbCBtYXJrRm9yQ2hlY2sgYWZ0ZXIgdXBkYXRpbmcgYSBuZXN0ZWQgcHJvcGVydHlcbiAgICAgKiBncmlkLmRhdGEuZm9yRWFjaChyZWMgPT4ge1xuICAgICAqICByZWMubmVzdGVkUHJvcDEubmVzdGVkUHJvcDIgPSBuZXdWYWx1ZTtcbiAgICAgKiB9KTtcbiAgICAgKiBncmlkLm1hcmtGb3JDaGVjaygpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogZ3JpZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgbWFya0ZvckNoZWNrKCkge1xuICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGBJZ3hHcmlkUm93Q29tcG9uZW50YCBhbmQgYWRkcyB0aGUgZGF0YSByZWNvcmQgdG8gdGhlIGVuZCBvZiB0aGUgZGF0YSBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQxLmFkZFJvdyhyZWNvcmQpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZFJvdyhkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgLy8gY29tbWl0IHBlbmRpbmcgc3RhdGVzIHByaW9yIHRvIGFkZGluZyBhIHJvd1xuICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZ3JpZEFQSS5hZGRSb3dUb0RhdGEoZGF0YSk7XG5cbiAgICAgICAgdGhpcy5yb3dBZGRlZE5vdGlmaWVyLm5leHQoeyBkYXRhIH0pO1xuICAgICAgICB0aGlzLnBpcGVUcmlnZ2VyKys7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGBJZ3hHcmlkUm93Q29tcG9uZW50YCBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgZGF0YSByZWNvcmQgYnkgcHJpbWFyeSBrZXkuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJlcXVpcmVzIHRoYXQgdGhlIGBwcmltYXJ5S2V5YCBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgICogVGhlIG1ldGhvZCBhY2NlcHQgcm93U2VsZWN0b3IgYXMgYSBwYXJhbWV0ZXIsIHdoaWNoIGlzIHRoZSByb3dJRC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQxLmRlbGV0ZVJvdygwKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93U2VsZWN0b3JcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVsZXRlUm93KHJvd1NlbGVjdG9yOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5wcmltYXJ5S2V5ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5wcmltYXJ5S2V5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWxldGVSb3dCeUlkKHJvd1NlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGRlbGV0ZVJvd0J5SWQocm93SWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7XG4gICAgICAgICAgICByb3dJRDogcm93SWQsXG4gICAgICAgICAgICBjYW5jZWw6IGZhbHNlLFxuICAgICAgICAgICAgcm93RGF0YTogdGhpcy5nZXRSb3dEYXRhKHJvd0lkKSxcbiAgICAgICAgICAgIG9sZFZhbHVlOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucm93RGVsZXRlLmVtaXQoYXJncyk7XG4gICAgICAgIGlmIChhcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5ncmlkQVBJLmRlbGV0ZVJvd0J5SWQocm93SWQpO1xuICAgICAgICBpZiAocmVjb3JkICE9PSBudWxsICYmIHJlY29yZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyAgVE9ETzogc2hvdWxkIHdlIGVtaXQgdGhpcyB3aGVuIGNhc2NhZGVPbkRlbGV0ZSBpcyB0cnVlIGZvciBlYWNoIHJvdz8hPyFcbiAgICAgICAgICAgIHRoaXMucm93RGVsZXRlZC5lbWl0KHsgZGF0YTogcmVjb3JkIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgYElneEdyaWRSb3dDb21wb25lbnRgIGFuZCB0aGUgY29ycmVzcG9uZGluZyBkYXRhIHJlY29yZCBieSBwcmltYXJ5IGtleS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmVxdWlyZXMgdGhhdCB0aGUgYHByaW1hcnlLZXlgIHByb3BlcnR5IGlzIHNldC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWRXaXRoUEsudXBkYXRlQ2VsbCgnVXBkYXRlZCcsIDEsICdQcm9kdWN0TmFtZScpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB2YWx1ZSB0aGUgbmV3IHZhbHVlIHdoaWNoIGlzIHRvIGJlIHNldC5cbiAgICAgKiBAcGFyYW0gcm93U2VsZWN0b3IgY29ycmVzcG9uZHMgdG8gcm93SUQuXG4gICAgICogQHBhcmFtIGNvbHVtbiBjb3JyZXNwb25kcyB0byBjb2x1bW4gZmllbGQuXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZUNlbGwodmFsdWU6IGFueSwgcm93U2VsZWN0b3I6IGFueSwgY29sdW1uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWZpbmVkKHRoaXMucHJpbWFyeUtleSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuY29sdW1uTGlzdC50b0FycmF5KCkuZmluZChjID0+IGMuZmllbGQgPT09IGNvbHVtbik7XG4gICAgICAgICAgICBpZiAoY29sKSB7XG4gICAgICAgICAgICAgICAgLy8gU2ltcGxpZnlcbiAgICAgICAgICAgICAgICBjb25zdCByb3dEYXRhID0gdGhpcy5ncmlkQVBJLmdldFJvd0RhdGEocm93U2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5ncmlkQVBJLmdldF9yb3dfaW5kZXhfaW5fZGF0YShyb3dTZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgLy8gSWYgcm93IHBhc3NlZCBpcyBpbnZhbGlkXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0lEOiByb3dTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSUQ6IGNvbC5pbmRleCxcbiAgICAgICAgICAgICAgICAgICAgcm93SW5kZXg6IGluZGV4XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBuZXcgSWd4Q2VsbChpZCwgaW5kZXgsIGNvbCwgcm93RGF0YVtjb2wuZmllbGRdLCB2YWx1ZSwgcm93RGF0YSwgdGhpcyBhcyBhbnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS51cGRhdGVfY2VsbChjZWxsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBgSWd4R3JpZFJvd0NvbXBvbmVudGBcbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIHJvdyBpcyBzcGVjaWZpZWQgYnlcbiAgICAgKiByb3dTZWxlY3RvciBwYXJhbWV0ZXIgYW5kIHRoZSBkYXRhIHNvdXJjZSByZWNvcmQgd2l0aCB0aGUgcGFzc2VkIHZhbHVlLlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgYXBwbHkgcmVxdWVzdGVkIHVwZGF0ZSBvbmx5IGlmIHByaW1hcnkga2V5IGlzIHNwZWNpZmllZCBpbiB0aGUgZ3JpZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBncmlkLnVwZGF0ZVJvdyh7XG4gICAgICogICAgICAgUHJvZHVjdElEOiAxLCBQcm9kdWN0TmFtZTogJ1NwZWFybWludCcsIEluU3RvY2s6IHRydWUsIFVuaXRzSW5TdG9jazogMSwgT3JkZXJEYXRlOiBuZXcgRGF0ZSgnMjAwNS0wMy0yMScpXG4gICAgICogICB9LCAxKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gdmFsdWXigJNcbiAgICAgKiBAcGFyYW0gcm93U2VsZWN0b3IgY29ycmVzcG9uZCB0byByb3dJRFxuICAgICAqL1xuICAgIC8vIFRPRE86IHByZXZlbnQgZXZlbnQgaW52b2NhdGlvblxuICAgIHB1YmxpYyB1cGRhdGVSb3codmFsdWU6IGFueSwgcm93U2VsZWN0b3I6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0RlZmluZWQodGhpcy5wcmltYXJ5S2V5KSkge1xuICAgICAgICAgICAgY29uc3QgZWRpdGFibGVDZWxsID0gdGhpcy5jcnVkU2VydmljZS5jZWxsO1xuICAgICAgICAgICAgaWYgKGVkaXRhYmxlQ2VsbCAmJiBlZGl0YWJsZUNlbGwuaWQucm93SUQgPT09IHJvd1NlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRDZWxsRWRpdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgcm93ID0gbmV3IElneEVkaXRSb3cocm93U2VsZWN0b3IsIC0xLCB0aGlzLmdyaWRBUEkuZ2V0Um93RGF0YShyb3dTZWxlY3RvciksIHRoaXMgYXMgYW55KTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS51cGRhdGVfcm93KHJvdywgdmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBmaXggZm9yICM1OTM0IGFuZCBwcm9iYWJseSBicmVhayBmb3IgIzU3NjNcbiAgICAgICAgICAgIC8vIGNvbnNpZGVyIGFkZGluZyBvZiB0aGlyZCBvcHRpb25hbCBib29sZWFuIHBhcmFtZXRlciBpbiB1cGRhdGVSb3cuXG4gICAgICAgICAgICAvLyBJZiBkZXZlbG9wZXIgc2V0IHRoaXMgcGFyYW1ldGVyIHRvIHRydWUgd2Ugc2hvdWxkIGNhbGwgbm90aWZ5Q2hhbmdlcyh0cnVlKSwgYW5kXG4gICAgICAgICAgICAvLyB2aXNlLXZlcnNhIGlmIGRldmVsb3BlciBzZXQgaXQgdG8gZmFsc2Ugd2Ugc2hvdWxkIGNhbGwgbm90aWZ5Q2hhbmdlcyhmYWxzZSkuXG4gICAgICAgICAgICAvLyBUaGUgcGFyYW1ldGVyIHNob3VsZCBkZWZhdWx0IHRvIGZhbHNlXG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRhdGEgdGhhdCBpcyBjb250YWluZWQgaW4gdGhlIHJvdyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIHRoZSBwcmltYXJ5IGtleSBpcyBub3Qgc3BlY2lmaWVkIHRoZSByb3cgc2VsZWN0b3IgbWF0Y2ggdGhlIHJvdyBkYXRhLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGRhdGEgPSBncmlkLmdldFJvd0RhdGEoOTQ3NDEpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByb3dTZWxlY3RvciBjb3JyZXNwb25kIHRvIHJvd0lEXG4gICAgICovXG4gICAgcHVibGljIGdldFJvd0RhdGEocm93U2VsZWN0b3I6IGFueSkge1xuICAgICAgICBpZiAoIXRoaXMucHJpbWFyeUtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHJvd1NlbGVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdyaWRBUEkuZ2V0X2FsbF9kYXRhKHRoaXMudHJhbnNhY3Rpb25zLmVuYWJsZWQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ3JpZEFQSS5nZXRfcm93X2luZGV4X2luX2RhdGEocm93U2VsZWN0b3IpO1xuICAgICAgICByZXR1cm4gaW5kZXggPCAwID8ge30gOiBkYXRhW2luZGV4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb3J0IGEgc2luZ2xlIGBJZ3hDb2x1bW5Db21wb25lbnRgLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBTb3J0IHRoZSBgSWd4R3JpZENvbXBvbmVudGAncyBgSWd4Q29sdW1uQ29tcG9uZW50YCBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgYXJyYXkgb2Ygc29ydGluZyBleHByZXNzaW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuc29ydCh7IGZpZWxkTmFtZTogbmFtZSwgZGlyOiBTb3J0aW5nRGlyZWN0aW9uLkFzYywgaWdub3JlQ2FzZTogZmFsc2UgfSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNvcnQoZXhwcmVzc2lvbjogSVNvcnRpbmdFeHByZXNzaW9uIHwgQXJyYXk8SVNvcnRpbmdFeHByZXNzaW9uPik6IHZvaWQge1xuICAgICAgICBjb25zdCBzb3J0aW5nU3RhdGUgPSBjbG9uZUFycmF5KHRoaXMuc29ydGluZ0V4cHJlc3Npb25zKTtcblxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVhY2ggb2YgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIGlmIChlYWNoLmRpciA9PT0gU29ydGluZ0RpcmVjdGlvbi5Ob25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5yZW1vdmVfZ3JvdXBpbmdfZXhwcmVzc2lvbihlYWNoLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5wcmVwYXJlX3NvcnRpbmdfZXhwcmVzc2lvbihbc29ydGluZ1N0YXRlXSwgZWFjaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi5kaXIgPT09IFNvcnRpbmdEaXJlY3Rpb24uTm9uZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5yZW1vdmVfZ3JvdXBpbmdfZXhwcmVzc2lvbihleHByZXNzaW9uLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdyaWRBUEkucHJlcGFyZV9zb3J0aW5nX2V4cHJlc3Npb24oW3NvcnRpbmdTdGF0ZV0sIGV4cHJlc3Npb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnRBcmdzOiBJU29ydGluZ0V2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIHNvcnRpbmdFeHByZXNzaW9uczogc29ydGluZ1N0YXRlLCBjYW5jZWw6IGZhbHNlIH07XG4gICAgICAgIHRoaXMuc29ydGluZy5lbWl0KGV2ZW50QXJncyk7XG5cbiAgICAgICAgaWYgKGV2ZW50QXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3J1ZFNlcnZpY2UuZW5kRWRpdChmYWxzZSk7XG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5zb3J0X211bHRpcGxlKGV4cHJlc3Npb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ncmlkQVBJLnNvcnQoZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuc29ydGluZ0RvbmUuZW1pdChleHByZXNzaW9uKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsdGVycyBhIHNpbmdsZSBgSWd4Q29sdW1uQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBmaWx0ZXIodGVybSkge1xuICAgICAqICAgICAgdGhpcy5ncmlkLmZpbHRlcihcIlByb2R1Y3ROYW1lXCIsIHRlcm0sIElneFN0cmluZ0ZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKS5jb25kaXRpb24oXCJjb250YWluc1wiKSk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHBhcmFtIGNvbmRpdGlvbk9yRXhwcmVzc2lvblRyZWVcbiAgICAgKiBAcGFyYW0gaWdub3JlQ2FzZVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWx0ZXIobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBjb25kaXRpb25PckV4cHJlc3Npb25UcmVlPzogSUZpbHRlcmluZ09wZXJhdGlvbiB8IElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsXG4gICAgICAgIGlnbm9yZUNhc2U/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5maWx0ZXIobmFtZSwgdmFsdWUsIGNvbmRpdGlvbk9yRXhwcmVzc2lvblRyZWUsIGlnbm9yZUNhc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbHRlcnMgYWxsIHRoZSBgSWd4Q29sdW1uQ29tcG9uZW50YCBpbiB0aGUgYElneEdyaWRDb21wb25lbnRgIHdpdGggdGhlIHNhbWUgY29uZGl0aW9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogZ3JpZC5maWx0ZXJHbG9iYWwoJ3NvbWUnLCBJZ3hTdHJpbmdGaWx0ZXJpbmdPcGVyYW5kLmluc3RhbmNlKCkuY29uZGl0aW9uKCdjb250YWlucycpKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKiBAcGFyYW0gY29uZGl0aW9uXG4gICAgICogQHBhcmFtIGlnbm9yZUNhc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsdGVyR2xvYmFsKHZhbHVlOiBhbnksIGNvbmRpdGlvbiwgaWdub3JlQ2FzZT8pIHtcbiAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmZpbHRlckdsb2JhbCh2YWx1ZSwgY29uZGl0aW9uLCBpZ25vcmVDYXNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIHN1bW1hcmllcyBmb3IgdGhlIHNwZWNpZmllZCBjb2x1bW4gYW5kIGFwcGxpZXMgeW91ciBjdXN0b21TdW1tYXJ5LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJZiB5b3UgZG8gbm90IHByb3ZpZGUgdGhlIGN1c3RvbVN1bW1hcnksIHRoZW4gdGhlIGRlZmF1bHQgc3VtbWFyeSBmb3IgdGhlIGNvbHVtbiBkYXRhIHR5cGUgd2lsbCBiZSBhcHBsaWVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGdyaWQuZW5hYmxlU3VtbWFyaWVzKFt7IGZpZWxkTmFtZTogJ1Byb2R1Y3ROYW1lJyB9LCB7IGZpZWxkTmFtZTogJ0lEJyB9XSk7XG4gICAgICogYGBgXG4gICAgICogRW5hYmxlIHN1bW1hcmllcyBmb3IgdGhlIGxpc3RlZCBjb2x1bW5zLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGdyaWQuZW5hYmxlU3VtbWFyaWVzKCdQcm9kdWN0TmFtZScpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByZXN0XG4gICAgICovXG4gICAgcHVibGljIGVuYWJsZVN1bW1hcmllcyguLi5yZXN0KSB7XG4gICAgICAgIGlmIChyZXN0Lmxlbmd0aCA9PT0gMSAmJiBBcnJheS5pc0FycmF5KHJlc3RbMF0pKSB7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aXBsZVN1bW1hcmllcyhyZXN0WzBdLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N1bW1hcmllcyhyZXN0WzBdLCB0cnVlLCByZXN0WzFdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc2FibGUgc3VtbWFyaWVzIGZvciB0aGUgc3BlY2lmaWVkIGNvbHVtbi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGdyaWQuZGlzYWJsZVN1bW1hcmllcygnUHJvZHVjdE5hbWUnKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIERpc2FibGUgc3VtbWFyaWVzIGZvciB0aGUgbGlzdGVkIGNvbHVtbnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogZ3JpZC5kaXNhYmxlU3VtbWFyaWVzKFt7IGZpZWxkTmFtZTogJ1Byb2R1Y3ROYW1lJyB9XSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGRpc2FibGVTdW1tYXJpZXMoLi4ucmVzdCkge1xuICAgICAgICBpZiAocmVzdC5sZW5ndGggPT09IDEgJiYgQXJyYXkuaXNBcnJheShyZXN0WzBdKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZU11bHRpcGxlU3VtbWFyaWVzKHJlc3RbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3VtbWFyaWVzKHJlc3RbMF0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIG5hbWUgaXMgcHJvdmlkZWQsIGNsZWFycyB0aGUgZmlsdGVyaW5nIHN0YXRlIG9mIHRoZSBjb3JyZXNwb25kaW5nIGBJZ3hDb2x1bW5Db21wb25lbnRgLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBPdGhlcndpc2UgY2xlYXJzIHRoZSBmaWx0ZXJpbmcgc3RhdGUgb2YgYWxsIGBJZ3hDb2x1bW5Db21wb25lbnRgcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuY2xlYXJGaWx0ZXIoKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhckZpbHRlcihuYW1lPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5jbGVhckZpbHRlcihuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBuYW1lIGlzIHByb3ZpZGVkLCBjbGVhcnMgdGhlIHNvcnRpbmcgc3RhdGUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgYElneENvbHVtbkNvbXBvbmVudGAuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIG90aGVyd2lzZSBjbGVhcnMgdGhlIHNvcnRpbmcgc3RhdGUgb2YgYWxsIGBJZ3hDb2x1bW5Db21wb25lbnRgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5jbGVhclNvcnQoKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhclNvcnQobmFtZT86IHN0cmluZykge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydGluZ0V4cHJlc3Npb25zID0gW107XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdyaWRBUEkuZ2V0X2NvbHVtbl9ieV9uYW1lKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmlkQVBJLmNsZWFyX3NvcnQobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVmcmVzaEdyaWRTdGF0ZShfYXJncz8pIHtcbiAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KHRydWUpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJIZWFkZXJDQlN0YXRlKCk7XG4gICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoKTtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFdlIGhhdmUgcmV0dXJuIHZhbHVlcyBoZXJlLiBNb3ZlIHRoZW0gdG8gZXZlbnQgYXJncyA/P1xuXG4gICAgLyoqXG4gICAgICogUGlucyBhIGNvbHVtbiBieSBmaWVsZCBuYW1lLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5waW5Db2x1bW4oXCJJRFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gY29sdW1uTmFtZVxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBwaW5Db2x1bW4oY29sdW1uTmFtZTogc3RyaW5nIHwgSWd4Q29sdW1uQ29tcG9uZW50LCBpbmRleD8pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgY29sID0gY29sdW1uTmFtZSBpbnN0YW5jZW9mIElneENvbHVtbkNvbXBvbmVudCA/IGNvbHVtbk5hbWUgOiB0aGlzLmdldENvbHVtbkJ5TmFtZShjb2x1bW5OYW1lKTtcbiAgICAgICAgcmV0dXJuIGNvbC5waW4oaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVucGlucyBhIGNvbHVtbiBieSBmaWVsZCBuYW1lLiBSZXR1cm5zIHdoZXRoZXIgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLnBpbkNvbHVtbihcIklEXCIpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBjb2x1bW5OYW1lXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgcHVibGljIHVucGluQ29sdW1uKGNvbHVtbk5hbWU6IHN0cmluZyB8IElneENvbHVtbkNvbXBvbmVudCwgaW5kZXg/KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvbHVtbk5hbWUgaW5zdGFuY2VvZiBJZ3hDb2x1bW5Db21wb25lbnQgPyBjb2x1bW5OYW1lIDogdGhpcy5nZXRDb2x1bW5CeU5hbWUoY29sdW1uTmFtZSk7XG4gICAgICAgIHJldHVybiBjb2wudW5waW4oaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpbiB0aGUgcm93IGJ5IGl0cyBpZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSUQgaXMgZWl0aGVyIHRoZSBwcmltYXJ5S2V5IHZhbHVlIG9yIHRoZSBkYXRhIHJlY29yZCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQucGluUm93KHJvd0lEKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93SUQgVGhlIHJvdyBpZCAtIHByaW1hcnlLZXkgdmFsdWUgb3IgdGhlIGRhdGEgcmVjb3JkIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggYXQgd2hpY2ggdG8gaW5zZXJ0IHRoZSByb3cgaW4gdGhlIHBpbm5lZCBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBwaW5Sb3cocm93SUQ6IGFueSwgaW5kZXg/OiBudW1iZXIsIHJvdz86IFJvd1R5cGUpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX3Bpbm5lZFJlY29yZElEcy5pbmRleE9mKHJvd0lEKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV2ZW50QXJnczogSVBpblJvd0V2ZW50QXJncyA9IHtcbiAgICAgICAgICAgIGluc2VydEF0SW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgaXNQaW5uZWQ6IHRydWUsXG4gICAgICAgICAgICByb3dJRCxcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yb3dQaW5uaW5nLmVtaXQoZXZlbnRBcmdzKTtcblxuICAgICAgICBpZiAoZXZlbnRBcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KGZhbHNlKTtcblxuICAgICAgICBjb25zdCBpbnNlcnRJbmRleCA9IHR5cGVvZiBldmVudEFyZ3MuaW5zZXJ0QXRJbmRleCA9PT0gJ251bWJlcicgPyBldmVudEFyZ3MuaW5zZXJ0QXRJbmRleCA6IHRoaXMuX3Bpbm5lZFJlY29yZElEcy5sZW5ndGg7XG4gICAgICAgIHRoaXMuX3Bpbm5lZFJlY29yZElEcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHJvd0lEKTtcbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICBpZiAodGhpcy5ncmlkQVBJLmdyaWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIHRoaXMucm93UGlubmVkLmVtaXQoZXZlbnRBcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVucGluIHRoZSByb3cgYnkgaXRzIGlkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJRCBpcyBlaXRoZXIgdGhlIHByaW1hcnlLZXkgdmFsdWUgb3IgdGhlIGRhdGEgcmVjb3JkIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC51bnBpblJvdyhyb3dJRCk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHJvd0lEIFRoZSByb3cgaWQgLSBwcmltYXJ5S2V5IHZhbHVlIG9yIHRoZSBkYXRhIHJlY29yZCBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5waW5Sb3cocm93SUQ6IGFueSwgcm93PzogUm93VHlwZSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3Bpbm5lZFJlY29yZElEcy5pbmRleE9mKHJvd0lEKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2ZW50QXJnczogSVBpblJvd0V2ZW50QXJncyA9IHtcbiAgICAgICAgICAgIGlzUGlubmVkOiBmYWxzZSxcbiAgICAgICAgICAgIHJvd0lELFxuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgY2FuY2VsOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJvd1Bpbm5pbmcuZW1pdChldmVudEFyZ3MpO1xuXG4gICAgICAgIGlmIChldmVudEFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQoZmFsc2UpO1xuICAgICAgICB0aGlzLl9waW5uZWRSZWNvcmRJRHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICBpZiAodGhpcy5ncmlkQVBJLmdyaWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIHRoaXMucm93UGlubmVkLmVtaXQoZXZlbnRBcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcGlubmVkUm93SGVpZ2h0KCkge1xuICAgICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLnBpbkNvbnRhaW5lciA/IHRoaXMucGluQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0IDogMDtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzUGlubmVkUmVjb3JkcyA/IGNvbnRhaW5lckhlaWdodCA6IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB0b3RhbEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsY0hlaWdodCA/IHRoaXMuY2FsY0hlaWdodCArIHRoaXMucGlubmVkUm93SGVpZ2h0IDogdGhpcy5jYWxjSGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY2FsY3VsYXRlcyBncmlkIHdpZHRoL2hlaWdodCBkaW1lbnNpb25zLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBTaG91bGQgYmUgcnVuIHdoZW4gY2hhbmdpbmcgRE9NIGVsZW1lbnRzIGRpbWVudGlvbnMgbWFudWFsbHkgdGhhdCBhZmZlY3QgdGhlIGdyaWQncyBzaXplLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5yZWZsb3coKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVmbG93KCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUdyaWRTaXplcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBuZXh0IG9jY3VycmVuY2Ugb2YgYSBnaXZlbiBzdHJpbmcgaW4gdGhlIGdyaWQgYW5kIHNjcm9sbHMgdG8gdGhlIGNlbGwgaWYgaXQgaXNuJ3QgdmlzaWJsZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJucyBob3cgbWFueSB0aW1lcyB0aGUgZ3JpZCBjb250YWlucyB0aGUgc3RyaW5nLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5maW5kTmV4dChcImZpbmFuY2lhbFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gdGV4dCB0aGUgc3RyaW5nIHRvIHNlYXJjaC5cbiAgICAgKiBAcGFyYW0gY2FzZVNlbnNpdGl2ZSBvcHRpb25hbGx5LCBpZiB0aGUgc2VhcmNoIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZSAoZGVmYXVsdHMgdG8gZmFsc2UpLlxuICAgICAqIEBwYXJhbSBleGFjdE1hdGNoIG9wdGlvbmFsbHksIGlmIHRoZSB0ZXh0IHNob3VsZCBtYXRjaCB0aGUgZW50aXJlIHZhbHVlICAoZGVmYXVsdHMgdG8gZmFsc2UpLlxuICAgICAqL1xuICAgIHB1YmxpYyBmaW5kTmV4dCh0ZXh0OiBzdHJpbmcsIGNhc2VTZW5zaXRpdmU/OiBib29sZWFuLCBleGFjdE1hdGNoPzogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmQodGV4dCwgMSwgY2FzZVNlbnNpdGl2ZSwgZXhhY3RNYXRjaCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIHByZXZpb3VzIG9jY3VycmVuY2Ugb2YgYSBnaXZlbiBzdHJpbmcgaW4gdGhlIGdyaWQgYW5kIHNjcm9sbHMgdG8gdGhlIGNlbGwgaWYgaXQgaXNuJ3QgdmlzaWJsZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmV0dXJucyBob3cgbWFueSB0aW1lcyB0aGUgZ3JpZCBjb250YWlucyB0aGUgc3RyaW5nLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5maW5kUHJldihcImZpbmFuY2lhbFwiKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gdGV4dCB0aGUgc3RyaW5nIHRvIHNlYXJjaC5cbiAgICAgKiBAcGFyYW0gY2FzZVNlbnNpdGl2ZSBvcHRpb25hbGx5LCBpZiB0aGUgc2VhcmNoIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZSAoZGVmYXVsdHMgdG8gZmFsc2UpLlxuICAgICAqIEBwYXJhbSBleGFjdE1hdGNoIG9wdGlvbmFsbHksIGlmIHRoZSB0ZXh0IHNob3VsZCBtYXRjaCB0aGUgZW50aXJlIHZhbHVlIChkZWZhdWx0cyB0byBmYWxzZSkuXG4gICAgICovXG4gICAgcHVibGljIGZpbmRQcmV2KHRleHQ6IHN0cmluZywgY2FzZVNlbnNpdGl2ZT86IGJvb2xlYW4sIGV4YWN0TWF0Y2g/OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZCh0ZXh0LCAtMSwgY2FzZVNlbnNpdGl2ZSwgZXhhY3RNYXRjaCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhcHBsaWVzIHRoZSBleGlzdGluZyBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJldHVybnMgaG93IG1hbnkgdGltZXMgdGhlIGdyaWQgY29udGFpbnMgdGhlIGxhc3Qgc2VhcmNoLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5yZWZyZXNoU2VhcmNoKCk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHVwZGF0ZUFjdGl2ZUluZm9cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVmcmVzaFNlYXJjaCh1cGRhdGVBY3RpdmVJbmZvPzogYm9vbGVhbiwgZW5kRWRpdCA9IHRydWUpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5sYXN0U2VhcmNoSW5mby5zZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnJlYnVpbGRNYXRjaENhY2hlKCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVBY3RpdmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlSW5mbyA9IElneFRleHRIaWdobGlnaHREaXJlY3RpdmUuaGlnaGxpZ2h0R3JvdXBzTWFwLmdldCh0aGlzLmlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWFyY2hJbmZvLm1hdGNoSW5mb0NhY2hlLmZvckVhY2goKG1hdGNoLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC5jb2x1bW4gPT09IGFjdGl2ZUluZm8uY29sdW1uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaC5yb3cgPT09IGFjdGl2ZUluZm8ucm93ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaC5pbmRleCA9PT0gYWN0aXZlSW5mby5pbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFyZU1hcHMobWF0Y2gubWV0YWRhdGEsIGFjdGl2ZUluZm8ubWV0YWRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWFyY2hJbmZvLmFjdGl2ZU1hdGNoSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmQodGhpcy5sYXN0U2VhcmNoSW5mby5zZWFyY2hUZXh0LFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VhcmNoSW5mby5jYXNlU2Vuc2l0aXZlLFxuICAgICAgICAgICAgICAgIHRoaXMubGFzdFNlYXJjaEluZm8uZXhhY3RNYXRjaCxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbmRFZGl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgdGhlIGhpZ2hsaWdodHMgaW4gdGhlIGNlbGwuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuY2xlYXJTZWFyY2goKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXJTZWFyY2goKSB7XG4gICAgICAgIHRoaXMubGFzdFNlYXJjaEluZm8gPSB7XG4gICAgICAgICAgICBzZWFyY2hUZXh0OiAnJyxcbiAgICAgICAgICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlLFxuICAgICAgICAgICAgZXhhY3RNYXRjaDogZmFsc2UsXG4gICAgICAgICAgICBhY3RpdmVNYXRjaEluZGV4OiAwLFxuICAgICAgICAgICAgbWF0Y2hJbmZvQ2FjaGU6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yb3dMaXN0LmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgICAgICAgaWYgKHJvdy5jZWxscykge1xuICAgICAgICAgICAgICAgIHJvdy5jZWxscy5mb3JFYWNoKChjOiBJZ3hHcmlkQ2VsbENvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjLmNsZWFySGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgc29ydGFibGUgY29sdW1ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHNvcnRhYmxlR3JpZCA9IHRoaXMuZ3JpZC5oYXNTb3J0YWJsZUNvbHVtbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNTb3J0YWJsZUNvbHVtbnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkxpc3Quc29tZSgoY29sKSA9PiBjb2wuc29ydGFibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgZWRpdGFibGUgY29sdW1ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGVkaXRhYmxlR3JpZCA9IHRoaXMuZ3JpZC5oYXNFZGl0YWJsZUNvbHVtbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNFZGl0YWJsZUNvbHVtbnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbkxpc3Quc29tZSgoY29sKSA9PiBjb2wuZWRpdGFibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgZmlsdGVyYWJsZSBjb2x1bW5zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZmlsdGVyYWJsZUdyaWQgPSB0aGlzLmdyaWQuaGFzRmlsdGVyYWJsZUNvbHVtbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNGaWx0ZXJhYmxlQ29sdW1ucygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uTGlzdC5zb21lKChjb2wpID0+IGNvbC5maWx0ZXJhYmxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGlmIHRoZSBgSWd4R3JpZENvbXBvbmVudGAgaGFzIHN1bW1hcml6ZWQgY29sdW1ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHN1bW1hcml6ZWRHcmlkID0gdGhpcy5ncmlkLmhhc1N1bW1hcml6ZWRDb2x1bW5zO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzU3VtbWFyaXplZENvbHVtbnMoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN1bW1hcml6ZWRDb2x1bW5zID0gdGhpcy5jb2x1bW5MaXN0LmZpbHRlcihjb2wgPT4gY29sLmhhc1N1bW1hcnkgJiYgIWNvbC5oaWRkZW4pO1xuICAgICAgICByZXR1cm4gc3VtbWFyaXplZENvbHVtbnMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcm9vdFN1bW1hcmllc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1bW1hcnlDYWxjdWxhdGlvbk1vZGUgIT09IEdyaWRTdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlLmNoaWxkTGV2ZWxzT25seTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzVmlzaWJsZUNvbHVtbnMoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLl9oYXNWaXNpYmxlQ29sdW1ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5MaXN0ID8gdGhpcy5jb2x1bW5MaXN0LnNvbWUoYyA9PiAhYy5oaWRkZW4pIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1Zpc2libGVDb2x1bW5zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaGFzVmlzaWJsZUNvbHVtbnModmFsdWUpIHtcbiAgICAgICAgdGhpcy5faGFzVmlzaWJsZUNvbHVtbnMgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGUgYElneEdyaWRDb21wb25lbnRgIGhhcyBtb3ZlYWJsZSBjb2x1bW5zLlxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBVc2UgYElneEdyaWRDb21wb25lbnQubW92aW5nYCBpbnN0ZWFkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbW92YWJsZUdyaWQgPSB0aGlzLmdyaWQuaGFzTW92YWJsZUNvbHVtbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNNb3ZhYmxlQ29sdW1ucygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92aW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgY29sdW1uIGdyb3Vwcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGdyb3VwR3JpZCA9IHRoaXMuZ3JpZC5oYXNDb2x1bW5Hcm91cHM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNDb2x1bW5Hcm91cHMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2x1bW5Hcm91cHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgY29sdW1uIGxheW91dHMgZm9yIG11bHRpLXJvdyBsYXlvdXQgZGVmaW5pdGlvbi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGxheW91dEdyaWQgPSB0aGlzLmdyaWQuaGFzQ29sdW1uTGF5b3V0cztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc0NvbHVtbkxheW91dHMoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuY29sdW1uTGlzdC5zb21lKGNvbCA9PiBjb2wuY29sdW1uTGF5b3V0KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBtdWx0aVJvd0xheW91dFJvd1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tdWx0aVJvd0xheW91dFJvd1NpemU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXQgcm93QmFzZWRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFMZW5ndGggKiB0aGlzLnJvd0hlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldCBpc1BlcmNlbnRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggJiYgdGhpcy53aWR0aC5pbmRleE9mKCclJykgIT09IC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1BlcmNlbnRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQgJiYgdGhpcy5faGVpZ2h0LmluZGV4T2YoJyUnKSAhPT0gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXQgZGVmYXVsdFRhcmdldEJvZHlIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYWxsSXRlbXMgPSB0aGlzLmRhdGFMZW5ndGg7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVkUm93SGVpZ2h0ICogTWF0aC5taW4odGhpcy5fZGVmYXVsdFRhcmdldFJlY29yZE51bWJlcixcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdG9yID8gTWF0aC5taW4oYWxsSXRlbXMsIHRoaXMucGFnaW5hdG9yLnBlclBhZ2UpIDogYWxsSXRlbXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogVGhlIHJvd0hlaWdodCBpbnB1dCBpcyBib3VuZCB0byBtaW4taGVpZ2h0IGNzcyBwcm9wIG9mIHJvd3MgdGhhdCBhZGRzIGEgMXB4IGJvcmRlciBpbiBhbGwgY2FzZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlbmRlcmVkUm93SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd0hlaWdodCArIDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG91dGVyV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1ZlcnRpY2FsU2Nyb2xsKCkgPyB0aGlzLmNhbGNXaWR0aCArIHRoaXMuc2Nyb2xsU2l6ZSA6IHRoaXMuY2FsY1dpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogR2V0cyB0aGUgdmlzaWJsZSBjb250ZW50IGhlaWdodCB0aGF0IGluY2x1ZGVzIGhlYWRlciArIHRib2R5ICsgZm9vdGVyLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRWaXNpYmxlQ29udGVudEhlaWdodCgpIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMudGhlYWRSb3cubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQgKyB0aGlzLnRib2R5Lm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICBpZiAodGhpcy5oYXNTdW1tYXJpemVkQ29sdW1ucykge1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHRoaXMudGZvb3QubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQb3NzaWJsZUNvbHVtbldpZHRoKGJhc2VXaWR0aDogbnVtYmVyID0gbnVsbCkge1xuICAgICAgICBsZXQgY29tcHV0ZWRXaWR0aDtcbiAgICAgICAgaWYgKGJhc2VXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29tcHV0ZWRXaWR0aCA9IGJhc2VXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXB1dGVkV2lkdGggPSB0aGlzLmNhbGNXaWR0aCB8fFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJyksIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXB1dGVkV2lkdGggLT0gdGhpcy5mZWF0dXJlQ29sdW1uc1dpZHRoKCk7XG5cbiAgICAgICAgY29uc3QgdmlzaWJsZUNoaWxkQ29sdW1ucyA9IHRoaXMudmlzaWJsZUNvbHVtbnMuZmlsdGVyKGMgPT4gIWMuY29sdW1uR3JvdXApO1xuXG5cbiAgICAgICAgLy8gQ29sdW1uIGxheW91dHMgcmVsYXRlZFxuICAgICAgICBsZXQgdmlzaWJsZUNvbHMgPSBbXTtcbiAgICAgICAgY29uc3QgY29sdW1uQmxvY2tzID0gdGhpcy52aXNpYmxlQ29sdW1ucy5maWx0ZXIoYyA9PiBjLmNvbHVtbkdyb3VwKTtcbiAgICAgICAgY29uc3QgY29sc1BlckJsb2NrID0gY29sdW1uQmxvY2tzLm1hcChibG9jayA9PiBibG9jay5nZXRJbml0aWFsQ2hpbGRDb2x1bW5TaXplcyhibG9jay5jaGlsZHJlbikpO1xuICAgICAgICBjb25zdCBjb21iaW5lZEJsb2Nrc1NpemUgPSBjb2xzUGVyQmxvY2sucmVkdWNlKChhY2MsIGl0ZW0pID0+IGFjYyArIGl0ZW0ubGVuZ3RoLCAwKTtcbiAgICAgICAgY29sc1BlckJsb2NrLmZvckVhY2goYmxvY2tDb2xzID0+IHZpc2libGVDb2xzID0gdmlzaWJsZUNvbHMuY29uY2F0KGJsb2NrQ29scykpO1xuICAgICAgICAvL1xuXG4gICAgICAgIGNvbnN0IGNvbHVtbnNXaXRoU2V0V2lkdGhzID0gdGhpcy5oYXNDb2x1bW5MYXlvdXRzID9cbiAgICAgICAgICAgIHZpc2libGVDb2xzLmZpbHRlcihjID0+IGMud2lkdGhTZXRCeVVzZXIpIDpcbiAgICAgICAgICAgIHZpc2libGVDaGlsZENvbHVtbnMuZmlsdGVyKGMgPT4gYy53aWR0aFNldEJ5VXNlcik7XG5cbiAgICAgICAgY29uc3QgY29sdW1uc1RvU2l6ZSA9IHRoaXMuaGFzQ29sdW1uTGF5b3V0cyA/XG4gICAgICAgICAgICBjb21iaW5lZEJsb2Nrc1NpemUgLSBjb2x1bW5zV2l0aFNldFdpZHRocy5sZW5ndGggOlxuICAgICAgICAgICAgdmlzaWJsZUNoaWxkQ29sdW1ucy5sZW5ndGggLSBjb2x1bW5zV2l0aFNldFdpZHRocy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHN1bUV4aXN0aW5nV2lkdGhzID0gY29sdW1uc1dpdGhTZXRXaWR0aHNcbiAgICAgICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xXaWR0aCA9IGN1cnIud2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGhWYWx1ZSA9IHBhcnNlSW50KGNvbFdpZHRoLCAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycldpZHRoID0gY29sV2lkdGggJiYgdHlwZW9mIGNvbFdpZHRoID09PSAnc3RyaW5nJyAmJiBjb2xXaWR0aC5pbmRleE9mKCclJykgIT09IC0xID9cbiAgICAgICAgICAgICAgICAgICAgd2lkdGhWYWx1ZSAvIDEwMCAqIGNvbXB1dGVkV2lkdGggOlxuICAgICAgICAgICAgICAgICAgICB3aWR0aFZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2ICsgY3VycldpZHRoO1xuICAgICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgLy8gV2hlbiBhbGwgY29sdW1ucyBhcmUgaGlkZGVuLCByZXR1cm4gMHB4IHdpZHRoXG4gICAgICAgIGlmICghc3VtRXhpc3RpbmdXaWR0aHMgJiYgIWNvbHVtbnNUb1NpemUpIHtcbiAgICAgICAgICAgIHJldHVybiAnMHB4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbHVtbldpZHRoID0gTWF0aC5mbG9vcighTnVtYmVyLmlzRmluaXRlKHN1bUV4aXN0aW5nV2lkdGhzKSA/XG4gICAgICAgICAgICBNYXRoLm1heChjb21wdXRlZFdpZHRoIC8gY29sdW1uc1RvU2l6ZSwgTUlOSU1VTV9DT0xVTU5fV0lEVEgpIDpcbiAgICAgICAgICAgIE1hdGgubWF4KChjb21wdXRlZFdpZHRoIC0gc3VtRXhpc3RpbmdXaWR0aHMpIC8gY29sdW1uc1RvU2l6ZSwgTUlOSU1VTV9DT0xVTU5fV0lEVEgpKTtcblxuICAgICAgICByZXR1cm4gY29sdW1uV2lkdGggKyAncHgnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGhhc1ZlcnRpY2FsU2Nyb2xsKCkge1xuICAgICAgICBpZiAodGhpcy5faW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlzU2Nyb2xsYWJsZSA9IHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIgPyB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLmlzU2Nyb2xsYWJsZSgpIDogZmFsc2U7XG4gICAgICAgIHJldHVybiAhISh0aGlzLmNhbGNXaWR0aCAmJiB0aGlzLmRhdGFWaWV3ICYmIHRoaXMuZGF0YVZpZXcubGVuZ3RoID4gMCAmJiBpc1Njcm9sbGFibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgY2FsY3VsYXRlZCB3aWR0aCBvZiB0aGUgcGlubmVkIGFyZWEuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBwaW5uZWRXaWR0aCA9IHRoaXMuZ3JpZC5nZXRQaW5uZWRXaWR0aCgpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSB0YWtlSGlkZGVuIElmIHdlIHNob3VsZCB0YWtlIGludG8gYWNjb3VudCB0aGUgaGlkZGVuIGNvbHVtbnMgaW4gdGhlIHBpbm5lZCBhcmVhLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQaW5uZWRXaWR0aCh0YWtlSGlkZGVuID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgZmMgPSB0YWtlSGlkZGVuID8gdGhpcy5fcGlubmVkQ29sdW1ucyA6IHRoaXMucGlubmVkQ29sdW1ucztcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgY29sIG9mIGZjKSB7XG4gICAgICAgICAgICBpZiAoY29sLmxldmVsID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3VtICs9IHBhcnNlSW50KGNvbC5jYWxjV2lkdGgsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc1Bpbm5pbmdUb1N0YXJ0KSB7XG4gICAgICAgICAgICBzdW0gKz0gdGhpcy5mZWF0dXJlQ29sdW1uc1dpZHRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGlzQ29sdW1uR3JvdXBlZChfZmllbGROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogVE9ETzogUkVNT1ZFXG4gICAgICovXG4gICAgcHVibGljIG9uSGVhZGVyU2VsZWN0b3JDbGljayhldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNNdWx0aVJvd1NlbGVjdGlvbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFyZUFsbFJvd1NlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5jbGVhclJvd1NlbGVjdGlvbihldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0QWxsUm93cyhldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGVhZFNlbGVjdG9yQmFzZUFyaWFMYWJlbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZS5maWx0ZXJpbmdPcGVyYW5kcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFyZUFsbFJvd1NlbGVjdGVkKCkgPyAnRGVzZWxlY3QgYWxsIGZpbHRlcmVkJyA6ICdTZWxlY3QgYWxsIGZpbHRlcmVkJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYXJlQWxsUm93U2VsZWN0ZWQoKSA/ICdEZXNlbGVjdCBhbGwnIDogJ1NlbGVjdCBhbGwnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRvdGFsUm93c0NvdW50QWZ0ZXJGaWx0ZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWxsRGF0YS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50bHkgdHJhbnNmb3JtZWQgcGFnZWQvZmlsdGVyZWQvc29ydGVkL2dyb3VwZWQgcGlubmVkIHJvdyBkYXRhLCBkaXNwbGF5ZWQgaW4gdGhlIGdyaWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgICAgIGNvbnN0IHBpbm5lZERhdGFWaWV3ID0gdGhpcy5ncmlkLnBpbm5lZERhdGFWaWV3O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcGlubmVkRGF0YVZpZXcoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5waW5uZWRSZWNvcmRzID8gdGhpcy5waW5uZWRSZWNvcmRzIDogW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBjdXJyZW50bHkgdHJhbnNmb3JtZWQgcGFnZWQvZmlsdGVyZWQvc29ydGVkL2dyb3VwZWQgdW5waW5uZWQgcm93IGRhdGEsIGRpc3BsYXllZCBpbiB0aGUgZ3JpZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICAgICAgY29uc3QgcGlubmVkRGF0YVZpZXcgPSB0aGlzLmdyaWQucGlubmVkRGF0YVZpZXc7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bnBpbm5lZERhdGFWaWV3KCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW5waW5uZWRSZWNvcmRzID8gdGhpcy51bnBpbm5lZFJlY29yZHMgOiB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyPy5pZ3hGb3JPZiB8fCBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50bHkgdHJhbnNmb3JtZWQgcGFnZWQvZmlsdGVyZWQvc29ydGVkL2dyb3VwZWQvcGlubmVkL3VucGlubmVkIHJvdyBkYXRhLCBkaXNwbGF5ZWQgaW4gdGhlIGdyaWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgICAgIGNvbnN0IGRhdGFWaWV3ID0gdGhpcy5ncmlkLmRhdGFWaWV3O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGF0YVZpZXcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhVmlldztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgd2hldGhlciBjbGlja2luZyBvdmVyIGEgcm93IHNob3VsZCBzZWxlY3QvZGVzZWxlY3QgaXRcbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQnkgZGVmYXVsdCBpdCBpcyBzZXQgdG8gdHJ1ZVxuICAgICAqIEBwYXJhbSBlbmFibGVkOiBib29sZWFuXG4gICAgICovXG4gICAgQFdhdGNoQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdFJvd09uQ2xpY2soKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RSb3dPbkNsaWNrO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2VsZWN0Um93T25DbGljayhlbmFibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdFJvd09uQ2xpY2sgPSBlbmFibGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdCBzcGVjaWZpZWQgcm93cyBieSBJRC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5zZWxlY3RSb3dzKFsxLDIsNV0sIHRydWUpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByb3dJRHNcbiAgICAgKiBAcGFyYW0gY2xlYXJDdXJyZW50U2VsZWN0aW9uIGlmIHRydWUgY2xlYXJzIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RSb3dzKHJvd0lEczogYW55W10sIGNsZWFyQ3VycmVudFNlbGVjdGlvbj86IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdFJvd3NXaXRoTm9FdmVudChyb3dJRHMsIGNsZWFyQ3VycmVudFNlbGVjdGlvbik7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0IHNwZWNpZmllZCByb3dzIGJ5IElELlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmRlc2VsZWN0Um93cyhbMSwyLDVdKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93SURzXG4gICAgICovXG4gICAgcHVibGljIGRlc2VsZWN0Um93cyhyb3dJRHM6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdFJvd3NXaXRoTm9FdmVudChyb3dJRHMpO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIGFsbCByb3dzXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEJ5IGRlZmF1bHQgaWYgZmlsdGVyaW5nIGlzIGluIHBsYWNlLCBzZWxlY3RBbGxSb3dzKCkgYW5kIGRlc2VsZWN0QWxsUm93cygpIHNlbGVjdC9kZXNlbGVjdCBhbGwgZmlsdGVyZWQgcm93cy5cbiAgICAgKiBJZiB5b3Ugc2V0IHRoZSBwYXJhbWV0ZXIgb25seUZpbHRlckRhdGEgdG8gZmFsc2UgdGhhdCB3aWxsIHNlbGVjdCBhbGwgcm93cyBpbiB0aGUgZ3JpZCBleGVwdCBkZWxldGVkIHJvd3MuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLnNlbGVjdEFsbFJvd3MoKTtcbiAgICAgKiB0aGlzLmdyaWQuc2VsZWN0QWxsUm93cyhmYWxzZSk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIG9ubHlGaWx0ZXJEYXRhXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdEFsbFJvd3Mob25seUZpbHRlckRhdGEgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBvbmx5RmlsdGVyRGF0YSAmJiB0aGlzLmZpbHRlcmVkRGF0YSA/IHRoaXMuZmlsdGVyZWREYXRhIDogdGhpcy5ncmlkQVBJLmdldF9hbGxfZGF0YSh0cnVlKTtcbiAgICAgICAgY29uc3Qgcm93SURzID0gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdldFJvd0lEcyhkYXRhKS5maWx0ZXIocklEID0+ICF0aGlzLmdyaWRBUEkucm93X2RlbGV0ZWRfdHJhbnNhY3Rpb24ocklEKSk7XG4gICAgICAgIHRoaXMuc2VsZWN0Um93cyhyb3dJRHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0cyBhbGwgcm93c1xuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IGlmIGZpbHRlcmluZyBpcyBpbiBwbGFjZSwgc2VsZWN0QWxsUm93cygpIGFuZCBkZXNlbGVjdEFsbFJvd3MoKSBzZWxlY3QvZGVzZWxlY3QgYWxsIGZpbHRlcmVkIHJvd3MuXG4gICAgICogSWYgeW91IHNldCB0aGUgcGFyYW1ldGVyIG9ubHlGaWx0ZXJEYXRhIHRvIGZhbHNlIHRoYXQgd2lsbCBkZXNlbGVjdCBhbGwgcm93cyBpbiB0aGUgZ3JpZCBleGVwdCBkZWxldGVkIHJvd3MuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmRlc2VsZWN0QWxsUm93cygpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBvbmx5RmlsdGVyRGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBkZXNlbGVjdEFsbFJvd3Mob25seUZpbHRlckRhdGEgPSB0cnVlKSB7XG4gICAgICAgIGlmIChvbmx5RmlsdGVyRGF0YSAmJiB0aGlzLmZpbHRlcmVkRGF0YSAmJiB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0Um93cyh0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0Um93SURzKHRoaXMuZmlsdGVyZWREYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJBbGxTZWxlY3RlZFJvd3MoKTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXJDZWxsU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXIodHJ1ZSk7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGRyYWdTY3JvbGwoZGVsdGE6IHsgbGVmdDogbnVtYmVyOyB0b3A6IG51bWJlciB9KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGhvcml6b250YWwgPSB0aGlzLmhlYWRlckNvbnRhaW5lci5nZXRTY3JvbGwoKTtcbiAgICAgICAgY29uc3QgdmVydGljYWwgPSB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLmdldFNjcm9sbCgpO1xuICAgICAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gZGVsdGE7XG5cbiAgICAgICAgaG9yaXpvbnRhbC5zY3JvbGxMZWZ0ICs9IGxlZnQgKiB0aGlzLkRSQUdfU0NST0xMX0RFTFRBO1xuICAgICAgICB2ZXJ0aWNhbC5zY3JvbGxUb3AgKz0gdG9wICogdGhpcy5EUkFHX1NDUk9MTF9ERUxUQTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBpc0RlZmluZWQoYXJnOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGFyZyAhPT0gdW5kZWZpbmVkICYmIGFyZyAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RSYW5nZShhcmc6IEdyaWRTZWxlY3Rpb25SYW5nZSB8IEdyaWRTZWxlY3Rpb25SYW5nZVtdIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZWZpbmVkKGFyZykpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJDZWxsU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBhcmcuZm9yRWFjaChyYW5nZSA9PiB0aGlzLnNldFNlbGVjdGlvbihyYW5nZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24oYXJnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBjb2x1bW5Ub1Zpc2libGVJbmRleChmaWVsZDogc3RyaW5nIHwgbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdmlzaWJsZUNvbHVtbnMgPSB0aGlzLnZpc2libGVDb2x1bW5zO1xuICAgICAgICBpZiAodHlwZW9mIGZpZWxkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2aXNpYmxlQ29sdW1ucy5maW5kKGNvbHVtbiA9PiBjb2x1bW4uZmllbGQgPT09IGZpZWxkKS52aXNpYmxlSW5kZXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0U2VsZWN0aW9uKHJhbmdlOiBHcmlkU2VsZWN0aW9uUmFuZ2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RhcnROb2RlID0geyByb3c6IHJhbmdlLnJvd1N0YXJ0LCBjb2x1bW46IHRoaXMuY29sdW1uVG9WaXNpYmxlSW5kZXgocmFuZ2UuY29sdW1uU3RhcnQpIH07XG4gICAgICAgIGNvbnN0IGVuZE5vZGUgPSB7IHJvdzogcmFuZ2Uucm93RW5kLCBjb2x1bW46IHRoaXMuY29sdW1uVG9WaXNpYmxlSW5kZXgocmFuZ2UuY29sdW1uRW5kKSB9O1xuXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5wb2ludGVyU3RhdGUubm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdFJhbmdlKGVuZE5vZGUsIHRoaXMuc2VsZWN0aW9uU2VydmljZS5wb2ludGVyU3RhdGUpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWRkUmFuZ2VNZXRhKGVuZE5vZGUsIHRoaXMuc2VsZWN0aW9uU2VydmljZS5wb2ludGVyU3RhdGUpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuaW5pdFBvaW50ZXJTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldFNlbGVjdGVkUmFuZ2VzKCk6IEdyaWRTZWxlY3Rpb25SYW5nZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uU2VydmljZS5yYW5nZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGNlbGwgc2VsZWN0aW9uIGluIHRoZSBmb3JtIG9mIGBbeyBjb2x1bW4uZmllbGQ6IGNlbGwudmFsdWUgfSwgLi4uXWAuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIGBmb3JtYXR0ZXJzYCBpcyBlbmFibGVkLCB0aGUgY2VsbCB2YWx1ZSB3aWxsIGJlIGZvcm1hdHRlZCBieSBpdHMgcmVzcGVjdGl2ZSBjb2x1bW4gZm9ybWF0dGVyIChpZiBhbnkpLlxuICAgICAqIElmIGBoZWFkZXJzYCBpcyBlbmFibGVkLCBpdCB3aWxsIHVzZSB0aGUgY29sdW1uIGhlYWRlciAoaWYgYW55KSBpbnN0ZWFkIG9mIHRoZSBjb2x1bW4gZmllbGQuXG4gICAgICovXG4gICAgcHVibGljIGdldFNlbGVjdGVkRGF0YShmb3JtYXR0ZXJzID0gZmFsc2UsIGhlYWRlcnMgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmZpbHRlcmVkU29ydGVkRGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdERhdGFGcm9tU2VsZWN0aW9uKHNvdXJjZSwgZm9ybWF0dGVycywgaGVhZGVycyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgc2VsZWN0ZWQgY29sdW1ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogUmV0dXJucyBhbiBhcnJheSB3aXRoIHNlbGVjdGVkIGNvbHVtbnNcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3Qgc2VsZWN0ZWRDb2x1bW5zID0gdGhpcy5ncmlkLnNlbGVjdGVkQ29sdW1ucygpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZENvbHVtbnMoKTogQ29sdW1uVHlwZVtdIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdldFNlbGVjdGVkQ29sdW1ucygpO1xuICAgICAgICByZXR1cm4gZmllbGRzLm1hcChmaWVsZCA9PiB0aGlzLmdldENvbHVtbkJ5TmFtZShmaWVsZCkpLmZpbHRlcihmaWVsZCA9PiBmaWVsZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IHNwZWNpZmllZCBjb2x1bW5zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLnNlbGVjdENvbHVtbnMoWydJRCcsJ05hbWUnXSwgdHJ1ZSk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIGNvbHVtbnNcbiAgICAgKiBAcGFyYW0gY2xlYXJDdXJyZW50U2VsZWN0aW9uIGlmIHRydWUgY2xlYXJzIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RDb2x1bW5zKGNvbHVtbnM6IHN0cmluZ1tdIHwgQ29sdW1uVHlwZVtdLCBjbGVhckN1cnJlbnRTZWxlY3Rpb24/OiBib29sZWFuKSB7XG4gICAgICAgIGxldCBmaWVsZFRvU2VsZWN0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBpZiAoY29sdW1ucy5sZW5ndGggPT09IDAgfHwgdHlwZW9mIGNvbHVtbnNbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmaWVsZFRvU2VsZWN0ID0gY29sdW1ucyBhcyBzdHJpbmdbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIChjb2x1bW5zIGFzIENvbHVtblR5cGVbXSkuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb2wuY29sdW1uR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBjb2wuYWxsQ2hpbGRyZW4uZmlsdGVyKGMgPT4gIWMuY29sdW1uR3JvdXApLm1hcChjID0+IGMuZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFRvU2VsZWN0ID0gWy4uLmZpZWxkVG9TZWxlY3QsIC4uLmNoaWxkcmVuXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFRvU2VsZWN0LnB1c2goY29sLmZpZWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RDb2x1bW5zV2l0aE5vRXZlbnQoZmllbGRUb1NlbGVjdCwgY2xlYXJDdXJyZW50U2VsZWN0aW9uKTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzZWxlY3Qgc3BlY2lmaWVkIGNvbHVtbnMgYnkgZmllbGQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuZGVzZWxlY3RDb2x1bW5zKFsnSUQnLCdOYW1lJ10pO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBjb2x1bW5zXG4gICAgICovXG4gICAgcHVibGljIGRlc2VsZWN0Q29sdW1ucyhjb2x1bW5zOiBzdHJpbmdbXSB8IENvbHVtblR5cGVbXSkge1xuICAgICAgICBsZXQgZmllbGRUb0Rlc2VsZWN0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBpZiAoY29sdW1ucy5sZW5ndGggPT09IDAgfHwgdHlwZW9mIGNvbHVtbnNbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmaWVsZFRvRGVzZWxlY3QgPSBjb2x1bW5zIGFzIHN0cmluZ1tdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKGNvbHVtbnMgYXMgQ29sdW1uVHlwZVtdKS5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5jb2x1bW5Hcm91cCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IGNvbC5hbGxDaGlsZHJlbi5maWx0ZXIoYyA9PiAhYy5jb2x1bW5Hcm91cCkubWFwKGMgPT4gYy5maWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkVG9EZXNlbGVjdCA9IFsuLi5maWVsZFRvRGVzZWxlY3QsIC4uLmNoaWxkcmVuXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFRvRGVzZWxlY3QucHVzaChjb2wuZmllbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdENvbHVtbnNXaXRoTm9FdmVudChmaWVsZFRvRGVzZWxlY3QpO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXNlbGVjdHMgYWxsIGNvbHVtbnNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5kZXNlbGVjdEFsbENvbHVtbnMoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzZWxlY3RBbGxDb2x1bW5zKCkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJBbGxTZWxlY3RlZENvbHVtbnMoKTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0cyBhbGwgY29sdW1uc1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmRlc2VsZWN0QWxsQ29sdW1ucygpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RBbGxDb2x1bW5zKCkge1xuICAgICAgICB0aGlzLnNlbGVjdENvbHVtbnModGhpcy5jb2x1bW5MaXN0LmZpbHRlcihjID0+ICFjLmNvbHVtbkdyb3VwKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjdXJyZW50IGNvbHVtbnMgc2VsZWN0aW9uIGluIHRoZSBmb3JtIG9mIGBbeyBjb2x1bW4uZmllbGQ6IGNlbGwudmFsdWUgfSwgLi4uXWAuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIGBmb3JtYXR0ZXJzYCBpcyBlbmFibGVkLCB0aGUgY2VsbCB2YWx1ZSB3aWxsIGJlIGZvcm1hdHRlZCBieSBpdHMgcmVzcGVjdGl2ZSBjb2x1bW4gZm9ybWF0dGVyIChpZiBhbnkpLlxuICAgICAqIElmIGBoZWFkZXJzYCBpcyBlbmFibGVkLCBpdCB3aWxsIHVzZSB0aGUgY29sdW1uIGhlYWRlciAoaWYgYW55KSBpbnN0ZWFkIG9mIHRoZSBjb2x1bW4gZmllbGQuXG4gICAgICovXG4gICAgcHVibGljIGdldFNlbGVjdGVkQ29sdW1uc0RhdGEoZm9ybWF0dGVycyA9IGZhbHNlLCBoZWFkZXJzID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5maWx0ZXJlZFNvcnRlZERhdGEgPyB0aGlzLmZpbHRlcmVkU29ydGVkRGF0YSA6IHRoaXMuZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdERhdGFGcm9tQ29sdW1uc1NlbGVjdGlvbihzb3VyY2UsIGZvcm1hdHRlcnMsIGhlYWRlcnMpO1xuICAgIH1cblxuXG4gICAgcHVibGljIGNvbWJpbmVTZWxlY3RlZENlbGxBbmRDb2x1bW5EYXRhKGNvbHVtbkRhdGE6IGFueVtdLCBmb3JtYXR0ZXJzID0gZmFsc2UsIGhlYWRlcnMgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmZpbHRlcmVkU29ydGVkRGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXh0cmFjdERhdGFGcm9tU2VsZWN0aW9uKHNvdXJjZSwgZm9ybWF0dGVycywgaGVhZGVycywgY29sdW1uRGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJldmVudENvbnRhaW5lclNjcm9sbCA9IChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC50YXJnZXQuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLmFkZFNjcm9sbFRvcChldnQudGFyZ2V0LnNjcm9sbFRvcCk7XG4gICAgICAgICAgICBldnQudGFyZ2V0LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2dC50YXJnZXQuc2Nyb2xsTGVmdCAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5oZWFkZXJDb250YWluZXIuc2Nyb2xsUG9zaXRpb24gKz0gZXZ0LnRhcmdldC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgZXZ0LnRhcmdldC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNvcHlIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkQ29sdW1ucyA9IHRoaXMuZ3JpZEFQSS5ncmlkLnNlbGVjdGVkQ29sdW1ucygpO1xuICAgICAgICBjb25zdCBjb2x1bW5EYXRhID0gdGhpcy5nZXRTZWxlY3RlZENvbHVtbnNEYXRhKHRoaXMuY2xpcGJvYXJkT3B0aW9ucy5jb3B5Rm9ybWF0dGVycywgdGhpcy5jbGlwYm9hcmRPcHRpb25zLmNvcHlIZWFkZXJzKTtcbiAgICAgICAgbGV0IHNlbGVjdGVkRGF0YTtcbiAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdjb3B5Jykge1xuICAgICAgICAgICAgc2VsZWN0ZWREYXRhID0gdGhpcy5nZXRTZWxlY3RlZERhdGEodGhpcy5jbGlwYm9hcmRPcHRpb25zLmNvcHlGb3JtYXR0ZXJzLCB0aGlzLmNsaXBib2FyZE9wdGlvbnMuY29weUhlYWRlcnMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBkYXRhID0gW107XG4gICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdLZXlDJyAmJiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSAmJiBldmVudC5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2lneC1ncmlkLXRoZWFkX193cmFwcGVyJykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uRGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5wcmVwYXJlQ29weURhdGEoZXZlbnQsIHNlbGVjdGVkRGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuY29tYmluZVNlbGVjdGVkQ2VsbEFuZENvbHVtbkRhdGEoY29sdW1uRGF0YSwgdGhpcy5jbGlwYm9hcmRPcHRpb25zLmNvcHlGb3JtYXR0ZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlwYm9hcmRPcHRpb25zLmNvcHlIZWFkZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5wcmVwYXJlQ29weURhdGEoZXZlbnQsIGRhdGFbMF0sIGRhdGFbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGNvbHVtbkRhdGE7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5wcmVwYXJlQ29weURhdGEoZXZlbnQsIGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChyZXN1bHQpLnRoZW4oKS5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmNsaXBib2FyZE9wdGlvbnMuZW5hYmxlZCB8fCB0aGlzLmNydWRTZXJ2aWNlLmNlbGxJbkVkaXRNb2RlIHx8IGV2ZW50LnR5cGUgPT09ICdrZXlkb3duJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkQ29sdW1ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5jb21iaW5lU2VsZWN0ZWRDZWxsQW5kQ29sdW1uRGF0YShjb2x1bW5EYXRhLCB0aGlzLmNsaXBib2FyZE9wdGlvbnMuY29weUZvcm1hdHRlcnMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpcGJvYXJkT3B0aW9ucy5jb3B5SGVhZGVycyk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5wcmVwYXJlQ29weURhdGEoZXZlbnQsIGRhdGFbMF0sIGRhdGFbMV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gc2VsZWN0ZWREYXRhO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMucHJlcGFyZUNvcHlEYXRhKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LmNsaXBib2FyZERhdGEuc2V0RGF0YSgndGV4dC9wbGFpbicsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwcmVwYXJlQ29weURhdGEoZXZlbnQsIGRhdGEsIGtleXM/KSB7XG4gICAgICAgIGNvbnN0IGV2ID0geyBkYXRhLCBjYW5jZWw6IGZhbHNlIH0gYXMgSUdyaWRDbGlwYm9hcmRFdmVudDtcbiAgICAgICAgdGhpcy5ncmlkQ29weS5lbWl0KGV2KTtcblxuICAgICAgICBpZiAoZXYuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IG5ldyBDaGFyU2VwYXJhdGVkVmFsdWVEYXRhKGV2LmRhdGEsIHRoaXMuY2xpcGJvYXJkT3B0aW9ucy5zZXBhcmF0b3IpO1xuICAgICAgICBsZXQgcmVzdWx0ID0ga2V5cyA/IHRyYW5zZm9ybWVyLnByZXBhcmVEYXRhKGtleXMpIDogdHJhbnNmb3JtZXIucHJlcGFyZURhdGEoKTtcblxuICAgICAgICBpZiAoIXRoaXMuY2xpcGJvYXJkT3B0aW9ucy5jb3B5SGVhZGVycykge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZyhyZXN1bHQuaW5kZXhPZignXFxuJykgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCAmJiBPYmplY3QudmFsdWVzKGRhdGFbMF0pLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNsaWNlKDAsIC0yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLyogTmVjZXNzYXJ5IGZvciB0aGUgaGllYXJhY2hpY2FsIGNhc2UgYnV0IHdpbGwgcHJvYmFibHkgaGF2ZSB0b1xuICAgICAgICAgICBjaGFuZ2UgaG93IGdldFNlbGVjdGVkRGF0YSBpcyBwcm9wYWdhdGVkIGluIHRoZSBoaWVhcmFjaGljYWwgZ3JpZFxuICAgICAgICAqL1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHNob3dTbmFja2JhckZvcihpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuYWRkUm93U25hY2tiYXIuYWN0aW9uVGV4dCA9IGluZGV4ID09PSAtMSA/ICcnIDogdGhpcy5zbmFja2JhckFjdGlvblRleHQ7XG4gICAgICAgIHRoaXMubGFzdEFkZGVkUm93SW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5hZGRSb3dTbmFja2Jhci5vcGVuKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGVzIHRvIGEgcG9zaXRpb24gaW4gdGhlIGdyaWQgYmFzZWQgb24gcHJvdmlkZWQgYHJvd2luZGV4YCBhbmQgYHZpc2libGVDb2x1bW5JbmRleGAuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEFsc28gY2FuIGV4ZWN1dGUgYSBjdXN0b20gbG9naWMgb3ZlciB0aGUgdGFyZ2V0IGVsZW1lbnQsXG4gICAgICogdGhyb3VnaCBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB7IHRhcmdldFR5cGU6IEdyaWRLZXlkb3duVGFyZ2V0VHlwZSwgdGFyZ2V0OiBPYmplY3QgfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICB0aGlzLmdyaWQubmF2aWdhdGVUbygxMCwgMywgKGFyZ3MpID0+IHsgYXJncy50YXJnZXQubmF0aXZlRWxlbWVudC5mb2N1cygpOyB9KTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgbmF2aWdhdGVUbyhyb3dJbmRleDogbnVtYmVyLCB2aXNpYmxlQ29sSW5kZXggPSAtMSwgY2I6IChhcmdzOiBhbnkpID0+IHZvaWQgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsSXRlbXMgPSAodGhpcyBhcyBhbnkpLnRvdGFsSXRlbUNvdW50ID8/IHRoaXMuZGF0YVZpZXcubGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IHRvdGFsSXRlbXMgfHwgKHZpc2libGVDb2xJbmRleCAhPT0gLTFcbiAgICAgICAgICAgICYmIHRoaXMuY29sdW1uTGlzdC5tYXAoY29sID0+IGNvbC52aXNpYmxlSW5kZXgpLmluZGV4T2YodmlzaWJsZUNvbEluZGV4KSA9PT0gLTEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGF0YVZpZXcuc2xpY2Uocm93SW5kZXgsIHJvd0luZGV4ICsgMSkuZmluZChyZWMgPT4gcmVjLmV4cHJlc3Npb24gfHwgcmVjLmNoaWxkR3JpZHNEYXRhKSkge1xuICAgICAgICAgICAgdmlzaWJsZUNvbEluZGV4ID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlIHRhcmdldCByb3cgaXMgcGlubmVkIG5vIG5lZWQgdG8gc2Nyb2xsIGFzIHdlbGwuXG4gICAgICAgIGNvbnN0IHNob3VsZFNjcm9sbFZlcnRpY2FsbHkgPSB0aGlzLm5hdmlnYXRpb24uc2hvdWxkUGVyZm9ybVZlcnRpY2FsU2Nyb2xsKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgpO1xuICAgICAgICBjb25zdCBzaG91bGRTY3JvbGxIb3Jpem9udGFsbHkgPSB0aGlzLm5hdmlnYXRpb24uc2hvdWxkUGVyZm9ybUhvcml6b250YWxTY3JvbGwodmlzaWJsZUNvbEluZGV4LCByb3dJbmRleCk7XG4gICAgICAgIGlmIChzaG91bGRTY3JvbGxWZXJ0aWNhbGx5KSB7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24ucGVyZm9ybVZlcnRpY2FsU2Nyb2xsVG9DZWxsKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsSG9yaXpvbnRhbGx5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5wZXJmb3JtSG9yaXpvbnRhbFNjcm9sbFRvQ2VsbCh2aXNpYmxlQ29sSW5kZXgsICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGVDYWxsYmFjayhyb3dJbmRleCwgdmlzaWJsZUNvbEluZGV4LCBjYikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUNhbGxiYWNrKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChzaG91bGRTY3JvbGxIb3Jpem9udGFsbHkpIHtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5wZXJmb3JtSG9yaXpvbnRhbFNjcm9sbFRvQ2VsbCh2aXNpYmxlQ29sSW5kZXgsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsVmVydGljYWxseSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24ucGVyZm9ybVZlcnRpY2FsU2Nyb2xsVG9DZWxsKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgsICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGVDYWxsYmFjayhyb3dJbmRleCwgdmlzaWJsZUNvbEluZGV4LCBjYikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUNhbGxiYWNrKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUNhbGxiYWNrKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgsIGNiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYElDZWxsUG9zaXRpb25gIHdoaWNoIGRlZmluZXMgdGhlIG5leHQgY2VsbCxcbiAgICAgKiBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24sIHRoYXQgbWF0Y2ggc3BlY2lmaWMgY3JpdGVyaWEuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFlvdSBjYW4gcGFzcyBjYWxsYmFjayBmdW5jdGlvbiBhcyBhIHRoaXJkIHBhcmFtZXRlciBvZiBgZ2V0UHJldmlvdXNDZWxsYCBtZXRob2QuXG4gICAgICogVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFjY2VwdHMgSWd4Q29sdW1uQ29tcG9uZW50IGFzIGEgcGFyYW1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgY29uc3QgbmV4dEVkaXRhYmxlQ2VsbFBvc2l0aW9uID0gdGhpcy5ncmlkLmdldE5leHRDZWxsKDAsIDMsIChjb2x1bW4pID0+IGNvbHVtbi5lZGl0YWJsZSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldE5leHRDZWxsKGN1cnJSb3dJbmRleDogbnVtYmVyLCBjdXJWaXNpYmxlQ29sSW5kZXg6IG51bWJlcixcbiAgICAgICAgY2FsbGJhY2s6IChJZ3hDb2x1bW5Db21wb25lbnQpID0+IGJvb2xlYW4gPSBudWxsKTogSUNlbGxQb3NpdGlvbiB7XG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmNvbHVtbkxpc3QuZmlsdGVyKGNvbCA9PiAhY29sLmNvbHVtbkdyb3VwICYmIGNvbC52aXNpYmxlSW5kZXggPj0gMCk7XG4gICAgICAgIGNvbnN0IGRhdGFWaWV3SW5kZXggPSB0aGlzLl9nZXREYXRhVmlld0luZGV4KGN1cnJSb3dJbmRleCk7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkUG9zaXRpb24oZGF0YVZpZXdJbmRleCwgY3VyVmlzaWJsZUNvbEluZGV4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgcm93SW5kZXg6IGN1cnJSb3dJbmRleCwgdmlzaWJsZUNvbHVtbkluZGV4OiBjdXJWaXNpYmxlQ29sSW5kZXggfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb2xJbmRleGVzID0gY2FsbGJhY2sgPyBjb2x1bW5zLmZpbHRlcigoY29sKSA9PiBjYWxsYmFjayhjb2wpKS5tYXAoZWRpdENvbCA9PiBlZGl0Q29sLnZpc2libGVJbmRleCkuc29ydCgoYSwgYikgPT4gYSAtIGIpIDpcbiAgICAgICAgICAgIGNvbHVtbnMubWFwKGVkaXRDb2wgPT4gZWRpdENvbC52aXNpYmxlSW5kZXgpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAgICAgY29uc3QgbmV4dENlbGxJbmRleCA9IGNvbEluZGV4ZXMuZmluZChpbmRleCA9PiBpbmRleCA+IGN1clZpc2libGVDb2xJbmRleCk7XG4gICAgICAgIGlmICh0aGlzLmRhdGFWaWV3LnNsaWNlKGRhdGFWaWV3SW5kZXgsIGRhdGFWaWV3SW5kZXggKyAxKVxuICAgICAgICAgICAgLmZpbmQocmVjID0+ICFyZWMuZXhwcmVzc2lvbiAmJiAhcmVjLnN1bW1hcmllcyAmJiAhcmVjLmNoaWxkR3JpZHNEYXRhICYmICFyZWMuZGV0YWlsc0RhdGEpICYmIG5leHRDZWxsSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgcm93SW5kZXg6IGN1cnJSb3dJbmRleCwgdmlzaWJsZUNvbHVtbkluZGV4OiBuZXh0Q2VsbEluZGV4IH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0SW5kZXggPSB0aGlzLmdldE5leHREYXRhUm93SW5kZXgoY3VyclJvd0luZGV4KVxuICAgICAgICAgICAgaWYgKGNvbEluZGV4ZXMubGVuZ3RoID09PSAwIHx8IG5leHRJbmRleCA9PT0gY3VyclJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93SW5kZXg6IGN1cnJSb3dJbmRleCwgdmlzaWJsZUNvbHVtbkluZGV4OiBjdXJWaXNpYmxlQ29sSW5kZXggfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93SW5kZXg6IG5leHRJbmRleCwgdmlzaWJsZUNvbHVtbkluZGV4OiBjb2xJbmRleGVzWzBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGBJQ2VsbFBvc2l0aW9uYCB3aGljaCBkZWZpbmVzIHRoZSBwcmV2aW91cyBjZWxsLFxuICAgICAqIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwb3NpdGlvbiwgdGhhdCBtYXRjaCBzcGVjaWZpYyBjcml0ZXJpYS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogWW91IGNhbiBwYXNzIGNhbGxiYWNrIGZ1bmN0aW9uIGFzIGEgdGhpcmQgcGFyYW1ldGVyIG9mIGBnZXRQcmV2aW91c0NlbGxgIG1ldGhvZC5cbiAgICAgKiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gYWNjZXB0cyBJZ3hDb2x1bW5Db21wb25lbnQgYXMgYSBwYXJhbVxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICBjb25zdCBwcmV2aW91c0VkaXRhYmxlQ2VsbFBvc2l0aW9uID0gdGhpcy5ncmlkLmdldFByZXZpb3VzQ2VsbCgwLCAzLCAoY29sdW1uKSA9PiBjb2x1bW4uZWRpdGFibGUpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQcmV2aW91c0NlbGwoY3VyclJvd0luZGV4OiBudW1iZXIsIGN1clZpc2libGVDb2xJbmRleDogbnVtYmVyLFxuICAgICAgICBjYWxsYmFjazogKElneENvbHVtbkNvbXBvbmVudCkgPT4gYm9vbGVhbiA9IG51bGwpOiBJQ2VsbFBvc2l0aW9uIHtcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuY29sdW1uTGlzdC5maWx0ZXIoY29sID0+ICFjb2wuY29sdW1uR3JvdXAgJiYgY29sLnZpc2libGVJbmRleCA+PSAwKTtcbiAgICAgICAgY29uc3QgZGF0YVZpZXdJbmRleCA9IHRoaXMuX2dldERhdGFWaWV3SW5kZXgoY3VyclJvd0luZGV4KTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQb3NpdGlvbihkYXRhVmlld0luZGV4LCBjdXJWaXNpYmxlQ29sSW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm4geyByb3dJbmRleDogY3VyclJvd0luZGV4LCB2aXNpYmxlQ29sdW1uSW5kZXg6IGN1clZpc2libGVDb2xJbmRleCB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbEluZGV4ZXMgPSBjYWxsYmFjayA/IGNvbHVtbnMuZmlsdGVyKChjb2wpID0+IGNhbGxiYWNrKGNvbCkpLm1hcChlZGl0Q29sID0+IGVkaXRDb2wudmlzaWJsZUluZGV4KS5zb3J0KChhLCBiKSA9PiBiIC0gYSkgOlxuICAgICAgICAgICAgY29sdW1ucy5tYXAoZWRpdENvbCA9PiBlZGl0Q29sLnZpc2libGVJbmRleCkuc29ydCgoYSwgYikgPT4gYiAtIGEpO1xuICAgICAgICBjb25zdCBwcmV2Q2VsbEluZGV4ID0gY29sSW5kZXhlcy5maW5kKGluZGV4ID0+IGluZGV4IDwgY3VyVmlzaWJsZUNvbEluZGV4KTtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVZpZXcuc2xpY2UoZGF0YVZpZXdJbmRleCwgZGF0YVZpZXdJbmRleCArIDEpXG4gICAgICAgICAgICAuZmluZChyZWMgPT4gIXJlYy5leHByZXNzaW9uICYmICFyZWMuc3VtbWFyaWVzICYmICFyZWMuY2hpbGRHcmlkc0RhdGEgJiYgIXJlYy5kZXRhaWxzRGF0YSkgJiYgcHJldkNlbGxJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4geyByb3dJbmRleDogY3VyclJvd0luZGV4LCB2aXNpYmxlQ29sdW1uSW5kZXg6IHByZXZDZWxsSW5kZXggfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXZJbmRleCA9IHRoaXMuZ2V0TmV4dERhdGFSb3dJbmRleChjdXJyUm93SW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGNvbEluZGV4ZXMubGVuZ3RoID09PSAwIHx8IHByZXZJbmRleCA9PT0gY3VyclJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93SW5kZXg6IGN1cnJSb3dJbmRleCwgdmlzaWJsZUNvbHVtbkluZGV4OiBjdXJWaXNpYmxlQ29sSW5kZXggfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93SW5kZXg6IHByZXZJbmRleCwgdmlzaWJsZUNvbHVtbkluZGV4OiBjb2xJbmRleGVzWzBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGVuZFJvd0VkaXRUYWJTdG9wKGNvbW1pdCA9IHRydWUsIGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgY29uc3QgY2FuY2VsZWQgPSB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQoY29tbWl0LCBldmVudCk7XG5cbiAgICAgICAgaWYgKGNhbmNlbGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUNlbGwgPSB0aGlzLmdyaWRBUEkuZ3JpZC5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGU7XG4gICAgICAgIGlmIChhY3RpdmVDZWxsICYmIGFjdGl2ZUNlbGwucm93ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy50Ym9keS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB0cmFja0NvbHVtbkNoYW5nZXMoaW5kZXgsIGNvbCkge1xuICAgICAgICByZXR1cm4gY29sLmZpZWxkICsgY29sLl9jYWxjV2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBpc0V4cGFuZGVkR3JvdXAoX2dyb3VwOiBJR3JvdXBCeVJlY29yZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogVE9ETzogTU9WRSB0byBDUlVEXG4gICAgICovXG4gICAgcHVibGljIG9wZW5Sb3dPdmVybGF5KGlkKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJlUm93RWRpdGluZ092ZXJsYXkoaWQsIHRoaXMucm93TGlzdC5sZW5ndGggPD0gTUlOX1JPV19FRElUSU5HX0NPVU5UX1RIUkVTSE9MRCk7XG5cbiAgICAgICAgdGhpcy5yb3dFZGl0aW5nT3ZlcmxheS5vcGVuKHRoaXMucm93RWRpdFNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5yb3dFZGl0aW5nT3ZlcmxheS5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5yb3dFZGl0aW5nV2hlZWxIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlUm93RWRpdGluZ092ZXJsYXkoKSB7XG4gICAgICAgIHRoaXMucm93RWRpdGluZ092ZXJsYXkuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMucm93RWRpdGluZ1doZWVsSGFuZGxlcik7XG4gICAgICAgIHRoaXMucm93RWRpdFBvc2l0aW9uaW5nU3RyYXRlZ3kuaXNUb3BJbml0aWFsUG9zaXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJvd0VkaXRpbmdPdmVybGF5LmNsb3NlKCk7XG4gICAgICAgIHRoaXMucm93RWRpdGluZ092ZXJsYXkuZWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVSb3dFZGl0aW5nT3ZlcmxheShzaG93KSB7XG4gICAgICAgIGNvbnN0IHJvd1N0eWxlID0gdGhpcy5yb3dFZGl0aW5nT3ZlcmxheS5lbGVtZW50LnN0eWxlO1xuICAgICAgICBpZiAoc2hvdykge1xuICAgICAgICAgICAgcm93U3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb3dTdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVwb3NpdGlvblJvd0VkaXRpbmdPdmVybGF5KHJvdzogUm93VHlwZSkge1xuICAgICAgICBpZiAocm93ICYmICF0aGlzLnJvd0VkaXRpbmdPdmVybGF5LmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgY29uc3Qgcm93U3R5bGUgPSB0aGlzLnJvd0VkaXRpbmdPdmVybGF5LmVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZTtcbiAgICAgICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAgICAgICByb3dTdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmVSb3dFZGl0aW5nT3ZlcmxheShyb3cua2V5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0VkaXRpbmdPdmVybGF5LnJlcG9zaXRpb24oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm93U3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNhY2hlZFZpZXdMb2FkZWQoYXJnczogSUNhY2hlZFZpZXdMb2FkZWRFdmVudEFyZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzSG9yaXpvbnRhbFNjcm9sbCgpKSB7XG4gICAgICAgICAgICBjb25zdCB0bXBsSWQgPSBhcmdzLmNvbnRleHQudGVtcGxhdGVJRC50eXBlO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhcmdzLmNvbnRleHQuaW5kZXg7XG4gICAgICAgICAgICBhcmdzLnZpZXcuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgdGhpcy56b25lLm9uU3RhYmxlLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSB0bXBsSWQgPT09ICdkYXRhUm93JyA/IHRoaXMuZ3JpZEFQSS5nZXRfcm93X2J5X2luZGV4KGluZGV4KSA6IG51bGw7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtbWFyeVJvdyA9IHRtcGxJZCA9PT0gJ3N1bW1hcnlSb3cnID8gdGhpcy5zdW1tYXJpZXNSb3dMaXN0LmZpbmQoKHNyKSA9PiBzci5kYXRhUm93SW5kZXggPT09IGluZGV4KSA6IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyAmJiByb3cgaW5zdGFuY2VvZiBJZ3hSb3dEaXJlY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzdG9yZVZpcnRTdGF0ZShyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3VtbWFyeVJvdykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXN0b3JlVmlydFN0YXRlKHN1bW1hcnlSb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgdGhlIGFkdmFuY2VkIGZpbHRlcmluZyBkaWFsb2cuXG4gICAgICovXG4gICAgcHVibGljIG9wZW5BZHZhbmNlZEZpbHRlcmluZ0RpYWxvZyhvdmVybGF5U2V0dGluZ3M/OiBPdmVybGF5U2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBvdmVybGF5U2V0dGluZ3MgPyBvdmVybGF5U2V0dGluZ3MgOiB0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlTZXR0aW5ncztcbiAgICAgICAgaWYgKCF0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCkge1xuICAgICAgICAgICAgdGhpcy5fYWR2YW5jZWRGaWx0ZXJpbmdPdmVybGF5U2V0dGluZ3MudGFyZ2V0ID1cbiAgICAgICAgICAgICAgICAodGhpcyBhcyBhbnkpLnJvb3RHcmlkID8gKHRoaXMgYXMgYW55KS5yb290R3JpZC5uYXRpdmVFbGVtZW50IDogdGhpcy5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5fYWR2YW5jZWRGaWx0ZXJpbmdPdmVybGF5U2V0dGluZ3Mub3V0bGV0ID0gdGhpcy5vdXRsZXQ7XG5cbiAgICAgICAgICAgIHRoaXMuX2FkdmFuY2VkRmlsdGVyaW5nT3ZlcmxheUlkID0gdGhpcy5vdmVybGF5U2VydmljZS5hdHRhY2goXG4gICAgICAgICAgICAgICAgSWd4QWR2YW5jZWRGaWx0ZXJpbmdEaWFsb2dDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbmplY3RvcjogdGhpcy52aWV3UmVmLmluamVjdG9yLFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IHRoaXMucmVzb2x2ZXJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2Uuc2hvdyh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIGFkdmFuY2VkIGZpbHRlcmluZyBkaWFsb2cuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXBwbHlDaGFuZ2VzIGluZGljYXRlcyB3aGV0aGVyIHRoZSBjaGFuZ2VzIHNob3VsZCBiZSBhcHBsaWVkXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlQWR2YW5jZWRGaWx0ZXJpbmdEaWFsb2coYXBwbHlDaGFuZ2VzOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCkge1xuICAgICAgICAgICAgY29uc3QgYWR2YW5jZWRGaWx0ZXJpbmdPdmVybGF5ID0gdGhpcy5vdmVybGF5U2VydmljZS5nZXRPdmVybGF5QnlJZCh0aGlzLl9hZHZhbmNlZEZpbHRlcmluZ092ZXJsYXlJZCk7XG4gICAgICAgICAgICBjb25zdCBhZHZhbmNlZEZpbHRlcmluZ0RpYWxvZyA9IGFkdmFuY2VkRmlsdGVyaW5nT3ZlcmxheS5jb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgSWd4QWR2YW5jZWRGaWx0ZXJpbmdEaWFsb2dDb21wb25lbnQ7XG5cbiAgICAgICAgICAgIGlmIChhcHBseUNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBhZHZhbmNlZEZpbHRlcmluZ0RpYWxvZy5hcHBseUNoYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkdmFuY2VkRmlsdGVyaW5nRGlhbG9nLmNsb3NlRGlhbG9nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRFbXB0eVJlY29yZE9iamVjdEZvcihpblJvdzogUm93VHlwZSkge1xuICAgICAgICBjb25zdCByb3cgPSB7IC4uLmluUm93Py5kYXRhIH07XG4gICAgICAgIE9iamVjdC5rZXlzKHJvdykuZm9yRWFjaChrZXkgPT4gcm93W2tleV0gPSB1bmRlZmluZWQpO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2VuZXJhdGVSb3dJRCgpO1xuICAgICAgICByb3dbdGhpcy5wcmltYXJ5S2V5XSA9IGlkO1xuICAgICAgICByZXR1cm4geyByb3dJRDogaWQsIGRhdGE6IHJvdywgcmVjb3JkUmVmOiByb3cgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNIb3Jpem9udGFsU2Nyb2xsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3RhbFdpZHRoIC0gdGhpcy51bnBpbm5lZFdpZHRoID4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBpc1N1bW1hcnlSb3cocm93RGF0YSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcm93RGF0YSAmJiByb3dEYXRhLnN1bW1hcmllcyAmJiAocm93RGF0YS5zdW1tYXJpZXMgaW5zdGFuY2VvZiBNYXApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHRyaWdnZXJQaXBlcygpIHtcbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyByb3dFZGl0aW5nV2hlZWxIYW5kbGVyKGV2ZW50OiBXaGVlbEV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kZWx0YVkgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnNjcm9sbE5leHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuc2Nyb2xsUHJldigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRVbnBpbm5lZEluZGV4QnlJZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy51bnBpbm5lZFJlY29yZHMuZmluZEluZGV4KHggPT4geFt0aGlzLnByaW1hcnlLZXldID09PSBpZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluaXNoZXMgdGhlIHJvdyB0cmFuc2FjdGlvbnMgb24gdGhlIGN1cnJlbnQgcm93LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJZiBgY29tbWl0ID09PSB0cnVlYCwgcGFzc2VzIHRoZW0gZnJvbSB0aGUgcGVuZGluZyBzdGF0ZSB0byB0aGUgZGF0YSAob3IgdHJhbnNhY3Rpb24gc2VydmljZSlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8YnV0dG9uIGlneEJ1dHRvbiAoY2xpY2spPVwiZ3JpZC5lbmRFZGl0KHRydWUpXCI+Q29tbWl0IFJvdzwvYnV0dG9uPlxuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBjb21taXRcbiAgICAgKi9cbiAgICAvLyBUT0RPOiBGYWNhZGUgZm9yIGNydWQgc2VydmljZSByZWZhY3RvcmluZy4gVG8gYmUgcmVtb3ZlZFxuICAgIC8vIFRPRE86IGRvIG5vdCByZW1vdmUgdGhpcywgYXMgaXQgaXMgdXNlZCBpbiByb3dFZGl0VGVtcGxhdGUsIGJ1dCBtYXJrIGlzIGFzIGludGVybmFsIGFuZCBoaWRkZW5cbiAgICBwdWJsaWMgZW5kRWRpdChjb21taXQgPSB0cnVlLCBldmVudD86IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuY3J1ZFNlcnZpY2UuZW5kRWRpdChjb21taXQsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbnRlcnMgYWRkIG1vZGUgYnkgc3Bhd25pbmcgdGhlIFVJIHVuZGVyIHRoZSBzcGVjaWZpZWQgcm93IGJ5IHJvd0lELlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBJZiBudWxsIGlzIHBhc3NlZCBhcyByb3dJRCwgdGhlIHJvdyBhZGRpbmcgVUkgaXMgc3Bhd25lZCBhcyB0aGUgZmlyc3QgcmVjb3JkIGluIHRoZSBkYXRhIHZpZXdcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFNwYXduaW5nIHRoZSBVSSB0byBhZGQgYSBjaGlsZCBmb3IgYSByZWNvcmQgb25seSB3b3JrcyBpZiB5b3UgcHJvdmlkZSBhIHJvd0lEXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLmJlZ2luQWRkUm93QnlJZCgnQUxGS0knKTtcbiAgICAgKiB0aGlzLmdyaWQuYmVnaW5BZGRSb3dCeUlkKCdBTEZLSScsIHRydWUpO1xuICAgICAqIHRoaXMuZ3JpZC5iZWdpbkFkZFJvd0J5SWQobnVsbCk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHJvd0lEIC0gVGhlIHJvd0lEIHRvIHNwYXduIHRoZSBhZGQgcm93IFVJIGZvciwgb3IgbnVsbCB0byBzcGF3biBpdCBhcyB0aGUgZmlyc3QgcmVjb3JkIGluIHRoZSBkYXRhIHZpZXdcbiAgICAgKiBAcGFyYW0gYXNDaGlsZCAtIFdoZXRoZXIgdGhlIHJlY29yZCBzaG91bGQgYmUgYWRkZWQgYXMgYSBjaGlsZC4gT25seSBhcHBsaWNhYmxlIHRvIGlneFRyZWVHcmlkLlxuICAgICAqL1xuICAgIHB1YmxpYyBiZWdpbkFkZFJvd0J5SWQocm93SUQ6IGFueSwgYXNDaGlsZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgbGV0IGluZGV4ID0gcm93SUQ7XG4gICAgICAgIGlmIChyb3dJRCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoYXNDaGlsZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIHJlY29yZCBjYW5ub3QgYmUgYWRkZWQgYXMgYSBjaGlsZCB0byBhbiB1bnNwZWNpZmllZCByZWNvcmQuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZmluZCB0aGUgaW5kZXggb2YgdGhlIHJlY29yZCB3aXRoIHRoYXQgUEtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5ncmlkQVBJLmdldF9yZWNfaW5kZXhfYnlfaWQocm93SUQsIHRoaXMuZGF0YVZpZXcpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignTm8gcm93IHdpdGggdGhlIHNwZWNpZmllZCBJRCB3YXMgZm91bmQuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYWRkUm93Rm9ySW5kZXgoaW5kZXgsIGFzQ2hpbGQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfYWRkUm93Rm9ySW5kZXgoaW5kZXg6IG51bWJlciwgYXNDaGlsZD86IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFWaWV3Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5iZWdpbkFkZFJvd0ZvckluZGV4KGluZGV4LCBhc0NoaWxkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBpZiB0aGUgaW5kZXggaXMgdmFsaWQgLSB3b24ndCBzdXBwb3J0IGFueXRoaW5nIG91dHNpZGUgdGhlIGRhdGEgdmlld1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuZGF0YVZpZXcubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgaW5kZXggaXMgaW4gdGhlIHZpZXcgcG9ydFxuICAgICAgICAgICAgaWYgKChpbmRleCA8IHRoaXMudmlydHVhbGl6YXRpb25TdGF0ZS5zdGFydEluZGV4IHx8XG4gICAgICAgICAgICAgICAgaW5kZXggPj0gdGhpcy52aXJ0dWFsaXphdGlvblN0YXRlLnN0YXJ0SW5kZXggKyB0aGlzLnZpcnR1YWxpemF0aW9uU3RhdGUuY2h1bmtTaXplKSAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmlzUmVjb3JkUGlubmVkQnlWaWV3SW5kZXgoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5jaHVua0xvYWRcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUoZmlyc3QoKSwgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW5BZGRSb3dGb3JJbmRleChpbmRleCwgYXNDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUbyhpbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYmVnaW5BZGRSb3dGb3JJbmRleChpbmRleCwgYXNDaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSByb3cgd2l0aCB0aGUgc3BlY2lmaWVkIFBLIG9yIGluZGV4IGlzIG91dHNpZGUgb2YgdGhlIGN1cnJlbnQgZGF0YSB2aWV3LicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW50ZXJzIGFkZCBtb2RlIGJ5IHNwYXduaW5nIHRoZSBVSSBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBBY2NlcHRlZCB2YWx1ZXMgZm9yIGluZGV4IGFyZSBpbnRlZ2VycyBmcm9tIDAgdG8gdGhpcy5ncmlkLmRhdGFWaWV3Lmxlbmd0aFxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5iZWdpbkFkZFJvd0J5SW5kZXgoMCk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIGluZGV4IC0gVGhlIGluZGV4IHRvIHNwYXduIHRoZSBVSSBhdC4gQWNjZXB0cyBpbnRlZ2VycyBmcm9tIDAgdG8gdGhpcy5ncmlkLmRhdGFWaWV3Lmxlbmd0aFxuICAgICAqL1xuICAgIHB1YmxpYyBiZWdpbkFkZFJvd0J5SW5kZXgoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJlZ2luQWRkUm93QnlJZChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkUm93Rm9ySW5kZXgoaW5kZXggLSAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHByZXZlbnRIZWFkZXJTY3JvbGwoYXJncykge1xuICAgICAgICBpZiAoYXJncy50YXJnZXQuc2Nyb2xsTGVmdCAhPT0gMCkge1xuICAgICAgICAgICAgKHRoaXMubmF2aWdhdGlvbiBhcyBhbnkpLmZvck9mRGlyKCkuZ2V0U2Nyb2xsKCkuc2Nyb2xsTGVmdCA9IGFyZ3MudGFyZ2V0LnNjcm9sbExlZnQ7XG4gICAgICAgICAgICBhcmdzLnRhcmdldC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBiZWdpbkFkZFJvd0ZvckluZGV4KGluZGV4OiBudW1iZXIsIGFzQ2hpbGQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICAvLyBUT0RPIGlzIHJvdyBmcm9tIHJvd0xpc3Qgc3VpdGFibGUgZm9yIGVudGVyQWRkUm93TW9kZVxuICAgICAgICBjb25zdCByb3cgPSBpbmRleCA9PSBudWxsID9cbiAgICAgICAgICAgIG51bGwgOiB0aGlzLnJvd0xpc3QuZmluZChyID0+IHIuaW5kZXggPT09IGluZGV4KTtcbiAgICAgICAgaWYgKHJvdyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmVudGVyQWRkUm93TW9kZShyb3csIGFzQ2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdObyByb3cgd2l0aCB0aGUgc3BlY2lmaWVkIFBLIG9yIGluZGV4IHdhcyBmb3VuZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzd2l0Y2hUcmFuc2FjdGlvblNlcnZpY2UodmFsOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zYWN0aW9ucyA9IHRoaXMudHJhbnNhY3Rpb25GYWN0b3J5LmNyZWF0ZShUUkFOU0FDVElPTl9UWVBFLkJhc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zID0gdGhpcy50cmFuc2FjdGlvbkZhY3RvcnkuY3JlYXRlKFRSQU5TQUNUSU9OX1RZUEUuTm9uZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kYXRhQ2xvbmVTdHJhdGVneSkge1xuICAgICAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zLmNsb25lU3RyYXRlZ3kgPSB0aGlzLmRhdGFDbG9uZVN0cmF0ZWd5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHN1YnNjcmliZVRvVHJhbnNhY3Rpb25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyYW5zYWN0aW9uQ2hhbmdlJC5uZXh0KCk7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25zLm9uU3RhdGVVcGRhdGUucGlwZSh0YWtlVW50aWwobWVyZ2UodGhpcy5kZXN0cm95JCwgdGhpcy50cmFuc2FjdGlvbkNoYW5nZSQpKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUodGhpcy50cmFuc2FjdGlvblN0YXR1c1VwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJhbnNhY3Rpb25TdGF0dXNVcGRhdGUoZXZlbnQ6IFN0YXRlVXBkYXRlRXZlbnQpIHtcbiAgICAgICAgbGV0IGFjdGlvbnM6IEFjdGlvbjxUcmFuc2FjdGlvbj5bXSA9IFtdO1xuICAgICAgICBpZiAoZXZlbnQub3JpZ2luID09PSBUcmFuc2FjdGlvbkV2ZW50T3JpZ2luLlJFRE8pIHtcbiAgICAgICAgICAgIGFjdGlvbnMgPSBldmVudC5hY3Rpb25zID8gZXZlbnQuYWN0aW9ucy5maWx0ZXIoeCA9PiB4LnRyYW5zYWN0aW9uLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5ERUxFVEUpIDogW107XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQub3JpZ2luID09PSBUcmFuc2FjdGlvbkV2ZW50T3JpZ2luLlVORE8pIHtcbiAgICAgICAgICAgIGFjdGlvbnMgPSBldmVudC5hY3Rpb25zID8gZXZlbnQuYWN0aW9ucy5maWx0ZXIoeCA9PiB4LnRyYW5zYWN0aW9uLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BREQpIDogW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhY3Rpb24gb2YgYWN0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblNlcnZpY2UuaXNSb3dTZWxlY3RlZChhY3Rpb24udHJhbnNhY3Rpb24uaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdFJvdyhhY3Rpb24udHJhbnNhY3Rpb24uaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJIZWFkZXJDQlN0YXRlKCk7XG4gICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoKTtcbiAgICAgICAgdGhpcy5waXBlVHJpZ2dlcisrO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9O1xuXG4gICAgcHJvdGVjdGVkIHdyaXRlVG9EYXRhKHJvd0luZGV4OiBudW1iZXIsIHZhbHVlOiBhbnkpIHtcbiAgICAgICAgbWVyZ2VPYmplY3RzKHRoaXMuZ3JpZEFQSS5nZXRfYWxsX2RhdGEoKVtyb3dJbmRleF0sIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3Jlc3RvcmVWaXJ0U3RhdGUocm93KSB7XG4gICAgICAgIC8vIGNoZWNrIHZpcnR1YWxpemF0aW9uIHN0YXRlIG9mIGRhdGEgcmVjb3JkIGFkZGVkIGZyb20gY2FjaGVcbiAgICAgICAgLy8gaW4gY2FzZSBzdGF0ZSBpcyBubyBsb25nZXIgdmFsaWQgLSB1cGRhdGUgaXQuXG4gICAgICAgIGNvbnN0IHJvd0Zvck9mID0gcm93LnZpcnREaXJSb3c7XG4gICAgICAgIGNvbnN0IGdyaWRTY3JMZWZ0ID0gcm93Rm9yT2YuZ2V0U2Nyb2xsKCkuc2Nyb2xsTGVmdDtcbiAgICAgICAgY29uc3QgbGVmdCA9IC1wYXJzZUludChyb3dGb3JPZi5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICBjb25zdCBhY3R1YWxTY3JvbGxMZWZ0ID0gbGVmdCArIHJvd0Zvck9mLmdldENvbHVtblNjcm9sbExlZnQocm93Rm9yT2Yuc3RhdGUuc3RhcnRJbmRleCk7XG4gICAgICAgIGlmIChncmlkU2NyTGVmdCAhPT0gYWN0dWFsU2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgcm93Rm9yT2Yub25IU2Nyb2xsKGdyaWRTY3JMZWZ0KTtcbiAgICAgICAgICAgIHJvd0Zvck9mLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2hhbmdlUm93RWRpdGluZ092ZXJsYXlTdGF0ZU9uU2Nyb2xsKHJvdzogUm93VHlwZSkge1xuICAgICAgICBpZiAoIXRoaXMucm93RWRpdGFibGUgfHwgIXRoaXMucm93RWRpdGluZ092ZXJsYXkgfHwgdGhpcy5yb3dFZGl0aW5nT3ZlcmxheS5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVSb3dFZGl0aW5nT3ZlcmxheShmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9zaXRpb25Sb3dFZGl0aW5nT3ZlcmxheShyb3cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGJlIGNhbGxlZCB3aGVuIGRhdGEgYW5kL29yIGlzTG9hZGluZyBpbnB1dCBjaGFuZ2VzIHNvIHRoYXQgdGhlIG92ZXJsYXkgY2FuIGJlXG4gICAgICogaGlkZGVuL3Nob3duIGJhc2VkIG9uIHRoZSBjdXJyZW50IHZhbHVlIG9mIHNob3VsZE92ZXJsYXlMb2FkaW5nXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGV2YWx1YXRlTG9hZGluZ1N0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5zaG91bGRPdmVybGF5TG9hZGluZykge1xuICAgICAgICAgICAgLy8gYSBuZXcgb3ZlcmxheSBzaG91bGQgYmUgc2hvd25cbiAgICAgICAgICAgIGNvbnN0IG92ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgIG91dGxldDogdGhpcy5sb2FkaW5nT3V0bGV0LFxuICAgICAgICAgICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IG5ldyBDb250YWluZXJQb3NpdGlvblN0cmF0ZWd5KClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdPdmVybGF5Lm9wZW4ob3ZlcmxheVNldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ092ZXJsYXkuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBTZXRzIGdyaWQgd2lkdGggaS5lLiB0aGlzLmNhbGNXaWR0aFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVHcmlkV2lkdGgoKSB7XG4gICAgICAgIGxldCB3aWR0aDtcblxuICAgICAgICBpZiAodGhpcy5pc1BlcmNlbnRXaWR0aCkge1xuICAgICAgICAgICAgLyogd2lkdGggaW4gJSovXG4gICAgICAgICAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJyk7XG4gICAgICAgICAgICB3aWR0aCA9IGNvbXB1dGVkLmluZGV4T2YoJyUnKSA9PT0gLTEgPyBwYXJzZUludChjb21wdXRlZCwgMTApIDogbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoID0gcGFyc2VJbnQodGhpcy53aWR0aCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3aWR0aCAmJiB0aGlzLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy53aWR0aCA9PT0gbnVsbCB8fCAhd2lkdGgpIHtcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5nZXRDb2x1bW5XaWR0aFN1bSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzVmVydGljYWxTY3JvbGwoKSAmJiB0aGlzLndpZHRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICB3aWR0aCAtPSB0aGlzLnNjcm9sbFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChOdW1iZXIuaXNGaW5pdGUod2lkdGgpIHx8IHdpZHRoID09PSBudWxsKSAmJiB3aWR0aCAhPT0gdGhpcy5jYWxjV2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY1dpZHRoID0gd2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGVyaXZlUG9zc2libGVXaWR0aCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBTZXRzIGNvbHVtbnMgZGVmYXVsdFdpZHRoIHByb3BlcnR5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9kZXJpdmVQb3NzaWJsZVdpZHRoKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29sdW1uV2lkdGhTZXRCeVVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbldpZHRoID0gdGhpcy53aWR0aCAhPT0gbnVsbCA/IHRoaXMuZ2V0UG9zc2libGVDb2x1bW5XaWR0aCgpIDogTUlOSU1VTV9DT0xVTU5fV0lEVEggKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29sdW1uTGlzdC5mb3JFYWNoKChjb2x1bW46IElneENvbHVtbkNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29sdW1uTGF5b3V0cyAmJiBwYXJzZUludCh0aGlzLl9jb2x1bW5XaWR0aCwgMTApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uV2lkdGhDb21iaW5lZCA9IHBhcnNlSW50KHRoaXMuX2NvbHVtbldpZHRoLCAxMCkgKiAoY29sdW1uLmNvbEVuZCA/IGNvbHVtbi5jb2xFbmQgLSBjb2x1bW4uY29sU3RhcnQgOiAxKTtcbiAgICAgICAgICAgICAgICBjb2x1bW4uZGVmYXVsdFdpZHRoID0gY29sdW1uV2lkdGhDb21iaW5lZCArICdweCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEQuSy4gTWFyY2ggMjl0aCwgMjAyMSAjOTE0NSBDb25zaWRlciBtaW4vbWF4IHdpZHRoIHdoZW4gc2V0dGluZyBkZWZhdWx0V2lkdGggcHJvcGVydHlcbiAgICAgICAgICAgICAgICBjb2x1bW4uZGVmYXVsdFdpZHRoID0gdGhpcy5nZXRFeHRyZW11bUJhc2VkQ29sV2lkdGgoY29sdW1uKTtcbiAgICAgICAgICAgICAgICBjb2x1bW4ucmVzZXRDYWNoZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzZXRDYWNoZWRXaWR0aHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEV4dHJlbXVtQmFzZWRDb2xXaWR0aChjb2x1bW46IElneENvbHVtbkNvbXBvbmVudCk6IHN0cmluZyB7XG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMuX2NvbHVtbldpZHRoO1xuICAgICAgICBpZiAod2lkdGggJiYgdHlwZW9mIHdpZHRoICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgd2lkdGggPSBTdHJpbmcod2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1pbldpZHRoID0gd2lkdGguaW5kZXhPZignJScpID09PSAtMSA/IGNvbHVtbi5taW5XaWR0aFB4IDogY29sdW1uLm1pbldpZHRoUGVyY2VudDtcbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSB3aWR0aC5pbmRleE9mKCclJykgPT09IC0xID8gY29sdW1uLm1heFdpZHRoUHggOiBjb2x1bW4ubWF4V2lkdGhQZXJjZW50O1xuICAgICAgICBpZiAoY29sdW1uLmhpZGRlbikge1xuICAgICAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1pbldpZHRoID4gcGFyc2VGbG9hdCh3aWR0aCkpIHtcbiAgICAgICAgICAgIHdpZHRoID0gU3RyaW5nKGNvbHVtbi5taW5XaWR0aCk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF4V2lkdGggPCBwYXJzZUZsb2F0KHdpZHRoKSkge1xuICAgICAgICAgICAgd2lkdGggPSBTdHJpbmcoY29sdW1uLm1heFdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIG5vIHB4IG9yICUgYXJlIGRlZmluZWQgaW4gbWF4V2lkdGgvbWluV2lkdGggY29uc2lkZXIgaXQgcHhcbiAgICAgICAgaWYgKHdpZHRoLmluZGV4T2YoJyUnKSA9PT0gLTEgJiYgd2lkdGguaW5kZXhPZigncHgnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHdpZHRoICs9ICdweCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXNldE5vdGlmeUNoYW5nZXMoKSB7XG4gICAgICAgIHRoaXMuX2NkclJlcXVlc3RSZXBhaW50ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2NkclJlcXVlc3RzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlc29sdmVPdXRsZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyT3V0bGV0RGlyZWN0aXZlID8gdGhpcy5fdXNlck91dGxldERpcmVjdGl2ZSA6IHRoaXMuX291dGxldERpcmVjdGl2ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW9yZGVyIGNvbHVtbnMgaW4gdGhlIG1haW4gY29sdW1uTGlzdCBhbmQgX2NvbHVtbnMgY29sbGVjdGlvbnMuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9tb3ZlQ29sdW1ucyhmcm9tOiBJZ3hDb2x1bW5Db21wb25lbnQsIHRvOiBJZ3hDb2x1bW5Db21wb25lbnQsIHBvczogRHJvcFBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbHVtbkxpc3QudG9BcnJheSgpO1xuICAgICAgICB0aGlzLl9yZW9yZGVyQ29sdW1ucyhmcm9tLCB0bywgcG9zLCBsaXN0KTtcbiAgICAgICAgY29uc3QgbmV3TGlzdCA9IHRoaXMuX3Jlc2V0Q29sdW1uTGlzdChsaXN0KTtcbiAgICAgICAgdGhpcy51cGRhdGVDb2x1bW5zKG5ld0xpc3QpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGludGVybmFsIGNvbHVtbidzIGNvbGxlY3Rpb24uXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGVDb2x1bW5zKG5ld0NvbHVtbnM6SWd4Q29sdW1uQ29tcG9uZW50W10pIHtcbiAgICAgICAgLy8gdXBkYXRlIGludGVybmFsIGNvbGxlY3Rpb25zIHRvIHJldGFpbiBvcmRlci5cbiAgICAgICAgdGhpcy5fcGlubmVkQ29sdW1ucyA9IG5ld0NvbHVtbnNcbiAgICAgICAgLmZpbHRlcigoYykgPT4gYy5waW5uZWQpLnNvcnQoKGEsIGIpID0+IHRoaXMuX3Bpbm5lZENvbHVtbnMuaW5kZXhPZihhKSAtIHRoaXMuX3Bpbm5lZENvbHVtbnMuaW5kZXhPZihiKSk7XG4gICAgICAgIHRoaXMuX3VucGlubmVkQ29sdW1ucyA9IG5ld0NvbHVtbnMuZmlsdGVyKChjKSA9PiAhYy5waW5uZWQpO1xuICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQobmV3Q29sdW1ucyk7XG4gICAgICAgIHRoaXMuY29sdW1uTGlzdC5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgICAgdGhpcy5fY29sdW1ucyA9IHRoaXMuY29sdW1uTGlzdC50b0FycmF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfcmVzZXRDb2x1bW5MaXN0KGxpc3Q/KSB7XG4gICAgICAgIGlmICghbGlzdCkge1xuICAgICAgICAgICAgbGlzdCA9IHRoaXMuY29sdW1uTGlzdC50b0FycmF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5ld0xpc3QgPSBbXTtcbiAgICAgICAgbGlzdC5maWx0ZXIoYyA9PiBjLmxldmVsID09PSAwKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgbmV3TGlzdC5wdXNoKHApO1xuICAgICAgICAgICAgaWYgKHAuY29sdW1uR3JvdXApIHtcbiAgICAgICAgICAgICAgICBuZXdMaXN0ID0gbmV3TGlzdC5jb25jYXQocC5hbGxDaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3TGlzdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW9yZGVycyBjb2x1bW5zIGluc2lkZSB0aGUgcGFzc2VkIGNvbHVtbiBjb2xsZWN0aW9uLlxuICAgICAqIFdoZW4gcmVvcmRlcmluZyBjb2x1bW4gZ3JvdXAgY29sbGVjdGlvbiwgdGhlIGNvbGxlY3Rpb24gaXMgbm90IGZsYXR0ZW5lZC5cbiAgICAgKiBJbiBhbGwgb3RoZXIgY2FzZXMsIHRoZSBjb2x1bW5zIGNvbGxlY3Rpb24gaXMgZmxhdHRlbmVkLCB0aGlzIGlzIHdoeSBhZGl0dGlvbmFsIGNhbGN1bGF0aW9ucyBvbiB0aGUgZHJvcEluZGV4IGFyZSBkb25lLlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfcmVvcmRlckNvbHVtbnMoZnJvbTogSWd4Q29sdW1uQ29tcG9uZW50LCB0bzogSWd4Q29sdW1uQ29tcG9uZW50LCBwb3NpdGlvbjogRHJvcFBvc2l0aW9uLCBjb2x1bW5Db2xsZWN0aW9uOiBhbnlbXSxcbiAgICAgICAgaW5Hcm91cCA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGZyb21JbmRleCA9IGNvbHVtbkNvbGxlY3Rpb24uaW5kZXhPZihmcm9tKTtcbiAgICAgICAgY29uc3QgY2hpbGRDb2x1bW5zQ291bnQgPSBpbkdyb3VwID8gMSA6IGZyb20uYWxsQ2hpbGRyZW4ubGVuZ3RoICsgMTtcbiAgICAgICAgY29sdW1uQ29sbGVjdGlvbi5zcGxpY2UoZnJvbUluZGV4LCBjaGlsZENvbHVtbnNDb3VudCk7XG4gICAgICAgIGxldCBkcm9wSW5kZXggPSBjb2x1bW5Db2xsZWN0aW9uLmluZGV4T2YodG8pO1xuICAgICAgICBpZiAocG9zaXRpb24gPT09IERyb3BQb3NpdGlvbi5BZnRlckRyb3BUYXJnZXQpIHtcbiAgICAgICAgICAgIGRyb3BJbmRleCsrO1xuICAgICAgICAgICAgaWYgKCFpbkdyb3VwICYmIHRvLmNvbHVtbkdyb3VwKSB7XG4gICAgICAgICAgICAgICAgZHJvcEluZGV4ICs9IHRvLmFsbENoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb2x1bW5Db2xsZWN0aW9uLnNwbGljZShkcm9wSW5kZXgsIDAsIGZyb20pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlb3JkZXIgY29sdW1uIGdyb3VwIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9tb3ZlQ2hpbGRDb2x1bW5zKHBhcmVudDogSWd4Q29sdW1uQ29tcG9uZW50LCBmcm9tOiBJZ3hDb2x1bW5Db21wb25lbnQsIHRvOiBJZ3hDb2x1bW5Db21wb25lbnQsIHBvczogRHJvcFBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHBhcmVudC5jaGlsZHJlbi50b0FycmF5KCk7XG4gICAgICAgIHRoaXMuX3Jlb3JkZXJDb2x1bW5zKGZyb20sIHRvLCBwb3MsIGJ1ZmZlciwgdHJ1ZSk7XG4gICAgICAgIHBhcmVudC5jaGlsZHJlbi5yZXNldChidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldHVwQ29sdW1ucygpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b0dlbmVyYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9nZW5lcmF0ZUNvbHVtbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdENvbHVtbnModGhpcy5jb2x1bW5MaXN0LCAoY29sOiBJZ3hDb2x1bW5Db21wb25lbnQpID0+IHRoaXMuY29sdW1uSW5pdC5lbWl0KGNvbCkpO1xuICAgICAgICB0aGlzLmNvbHVtbkxpc3REaWZmZXIuZGlmZih0aGlzLmNvbHVtbkxpc3QpO1xuXG4gICAgICAgIHRoaXMuY29sdW1uTGlzdC5jaGFuZ2VzXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChjaGFuZ2U6IFF1ZXJ5TGlzdDxJZ3hDb2x1bW5Db21wb25lbnQ+KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbHVtbnNDaGFuZ2VkKGNoYW5nZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGRlbGV0ZVJvd0Zyb21EYXRhKHJvd0lEOiBhbnksIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgLy8gIGlmIHRoZXJlIGlzIGEgcm93IChpbmRleCAhPT0gMCkgZGVsZXRlIGl0XG4gICAgICAgIC8vICBpZiB0aGVyZSBpcyBhIHJvdyBpbiBBREQgb3IgVVBEQVRFIHN0YXRlIGNoYW5nZSBpdCdzIHN0YXRlIHRvIERFTEVURVxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2FjdGlvbnMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uOiBUcmFuc2FjdGlvbiA9IHsgaWQ6IHJvd0lELCB0eXBlOiBUcmFuc2FjdGlvblR5cGUuREVMRVRFLCBuZXdWYWx1ZTogbnVsbCB9O1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNhY3Rpb25zLmFkZCh0cmFuc2FjdGlvbiwgdGhpcy5kYXRhW2luZGV4XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGU6IFN0YXRlID0gdGhpcy50cmFuc2FjdGlvbnMuZ2V0U3RhdGUocm93SUQpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2FjdGlvbnMuYWRkKHsgaWQ6IHJvd0lELCB0eXBlOiBUcmFuc2FjdGlvblR5cGUuREVMRVRFLCBuZXdWYWx1ZTogbnVsbCB9LCBzdGF0ZSAmJiBzdGF0ZS5yZWNvcmRSZWYpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXREYXRhQmFzZWRCb2R5SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAhdGhpcy5kYXRhIHx8ICh0aGlzLmRhdGEubGVuZ3RoIDwgdGhpcy5fZGVmYXVsdFRhcmdldFJlY29yZE51bWJlcikgP1xuICAgICAgICAgICAgMCA6IHRoaXMuZGVmYXVsdFRhcmdldEJvZHlIZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgb25QaW5uZWRSb3dzQ2hhbmdlZChjaGFuZ2U6IFF1ZXJ5TGlzdDxJZ3hHcmlkUm93Q29tcG9uZW50Pikge1xuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5yb3dMaXN0RGlmZmVyLmRpZmYoY2hhbmdlKTtcbiAgICAgICAgaWYgKGRpZmYpIHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgb25Db2x1bW5zQ2hhbmdlZChjaGFuZ2U6IFF1ZXJ5TGlzdDxJZ3hDb2x1bW5Db21wb25lbnQ+KSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLmNvbHVtbkxpc3REaWZmZXIuZGlmZihjaGFuZ2UpO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9HZW5lcmF0ZSAmJiB0aGlzLmNvbHVtbkxpc3QubGVuZ3RoID09PSAwICYmIHRoaXMuX2F1dG9HZW5lcmF0ZWRDb2xzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIEluIEl2eSBpZiB0aGVyZSBhcmUgbmVzdGVkIGNvbmRpdGlvbmFsIHRlbXBsYXRlcyB0aGUgY29udGVudCBjaGlsZHJlbiBhcmUgcmUtZXZhbHVhdGVkXG4gICAgICAgICAgICAvLyBoZW5jZSBhdXRvZ2VuZXJhdGVkIGNvbHVtbnMgYXJlIGNsZWFyZWQgYW5kIG5lZWQgdG8gYmUgcmVzZXQuXG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQodGhpcy5fYXV0b0dlbmVyYXRlZENvbHMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaWZmKSB7XG4gICAgICAgICAgICBsZXQgYWRkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCByZW1vdmVkID0gZmFsc2U7XG4gICAgICAgICAgICBkaWZmLmZvckVhY2hBZGRlZEl0ZW0oKHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8SWd4Q29sdW1uQ29tcG9uZW50PikgPT4ge1xuICAgICAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkLml0ZW0ucGlubmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Bpbm5lZENvbHVtbnMucHVzaChyZWNvcmQuaXRlbSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5waW5uZWRDb2x1bW5zLnB1c2gocmVjb3JkLml0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRDb2x1bW5zKHRoaXMuY29sdW1uTGlzdCwgKGNvbDogSWd4Q29sdW1uQ29tcG9uZW50KSA9PiB0aGlzLmNvbHVtbkluaXQuZW1pdChjb2wpKTtcblxuICAgICAgICAgICAgZGlmZi5mb3JFYWNoUmVtb3ZlZEl0ZW0oKHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8SWd4Q29sdW1uQ29tcG9uZW50IHwgSWd4Q29sdW1uR3JvdXBDb21wb25lbnQ+KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb2x1bW5Hcm91cCA9IHJlY29yZC5pdGVtIGluc3RhbmNlb2YgSWd4Q29sdW1uR3JvdXBDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0NvbHVtbkdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIEdyb3VwaW5nXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZEFQSS5jbGVhcl9ncm91cGJ5KHJlY29yZC5pdGVtLmZpZWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciBGaWx0ZXJpbmdcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmNsZWFyX2ZpbHRlcihyZWNvcmQuaXRlbS5maWVsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvc2UgZmlsdGVyIHJvd1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmZpbHRlcmVkQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZmlsdGVyZWRDb2x1bW4uZmllbGQgPT09IHJlY29yZC5pdGVtLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmluZ1Jvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgU29ydGluZ1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWRBUEkuY2xlYXJfc29ydChyZWNvcmQuaXRlbS5maWVsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGNvbHVtbiBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmRlc2VsZWN0Q29sdW1uc1dpdGhOb0V2ZW50KFtyZWNvcmQuaXRlbS5maWVsZF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0Q2FjaGVzKCk7XG5cbiAgICAgICAgICAgIGlmIChhZGRlZCB8fCByZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdW1tYXJ5U2VydmljZS5jbGVhclN1bW1hcnlDYWNoZSgpO1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBgb25Db2x1bW5zQ2hhbmdlZGAgY2FuIGJlIGV4ZWN1dGVkIG1pZHdheSBhIGN1cnJlbnQgZGV0ZWN0Q2hhbmdlIGN5Y2xlIGFuZCBtYXJrRm9yQ2hlY2sgd2lsbCBiZSBpZ25vcmVkIHRoZW4uXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGwgd2FpdCBmb3IgdGhlIGN1cnJlbnQgY3ljbGUgdG8gZW5kIHNvIHdlIGNhbiB0cmlnZ2VyIGEgbmV3IG9uZSBhbmQgbmdEb0NoZWNrIHRvIGZpcmUuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsY3VsYXRlR3JpZFNpemVzKHJlY2FsY0ZlYXR1cmVXaWR0aCA9IHRydWUpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgIFRPRE86IChSLksuKSBUaGlzIGxheWVyZWQgbGFzYWduZSBzaG91bGQgYmUgcmVmYWN0b3JlZFxuICAgICAgICAgICAgQVNBUC4gVGhlIHJlYXNvbiBJIGhhdmUgdG8gcmVzZXQgdGhlIGNhY2hlcyBzbyBtYW55IHRpbWVzIGlzIGJlY2F1c2VcbiAgICAgICAgICAgIGFmdGVyIHRlYWNoIGBkZXRlY3RDaGFuZ2VzYCBjYWxsIHRoZXkgYXJlIGZpbGxlZCB3aXRoIGludmFsaWRcbiAgICAgICAgICAgIHN0YXRlLiBPZiBjb3Vyc2UgYWxsIG9mIHRoaXMgaGFwcGVucyBtaWR3YXkgdGhyb3VnaCB0aGUgZ3JpZFxuICAgICAgICAgICAgc2l6aW5nIHByb2Nlc3Mgd2hpY2ggb2YgY291cnNlLCB1c2VzIHZhbHVlcyBmcm9tIHRoZSBjYWNoZXMsIHRodXMgcmVzdWx0aW5nXG4gICAgICAgICAgICBpbiBhIGJyb2tlbiBsYXlvdXQuXG4gICAgICAgICovXG4gICAgICAgIHRoaXMucmVzZXRDYWNoZXMocmVjYWxjRmVhdHVyZVdpZHRoKTtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICBjb25zdCBoYXNTY3JvbGwgPSB0aGlzLmhhc1ZlcnRpY2FsU2Nyb2xsKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlR3JpZFdpZHRoKCk7XG4gICAgICAgIHRoaXMucmVzZXRDYWNoZXMocmVjYWxjRmVhdHVyZVdpZHRoKTtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUdyaWRIZWlnaHQoKTtcblxuICAgICAgICBpZiAodGhpcy5yb3dFZGl0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZXBvc2l0aW9uUm93RWRpdGluZ092ZXJsYXkodGhpcy5jcnVkU2VydmljZS5yb3dJbkVkaXRNb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmluZ1NlcnZpY2UuaXNGaWx0ZXJSb3dWaXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmluZ1Jvdy5yZXNldENoaXBzQXJlYSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAvLyBpbiBjYXNlIHNjcm9sbGJhciBoYXMgYXBwZWFyZWQgcmVjYWxjIHRvIHNpemUgY29ycmVjdGx5LlxuICAgICAgICBpZiAoaGFzU2Nyb2xsICE9PSB0aGlzLmhhc1ZlcnRpY2FsU2Nyb2xsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlR3JpZFdpZHRoKCk7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuem9uZS5pc1N0YWJsZSkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlXaWR0aEhvc3RCaW5kaW5nKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUub25TdGFibGUucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBseVdpZHRoSG9zdEJpbmRpbmcoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRDYWNoZXMocmVjYWxjRmVhdHVyZVdpZHRoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNhbGNHcmlkSGVhZFJvdygpIHtcbiAgICAgICAgaWYgKHRoaXMubWF4TGV2ZWxIZWFkZXJEZXB0aCkge1xuICAgICAgICAgICAgdGhpcy5fYmFzZUZvbnRTaXplID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LXNpemUnKSk7XG4gICAgICAgICAgICBsZXQgbWluU2l6ZSA9ICh0aGlzLm1heExldmVsSGVhZGVyRGVwdGggKyAxKSAqIHRoaXMuZGVmYXVsdFJvd0hlaWdodCAvIHRoaXMuX2Jhc2VGb250U2l6ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hbGxvd0ZpbHRlcmluZyAmJiB0aGlzLl9maWx0ZXJNb2RlID09PSBGaWx0ZXJNb2RlLnF1aWNrRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgbWluU2l6ZSArPSAoRklMVEVSX1JPV19IRUlHSFQgKyAxKSAvIHRoaXMuX2Jhc2VGb250U2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGhlYWRSb3cubmF0aXZlRWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSBgJHttaW5TaXplfXJlbWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogU2V0cyBUQk9EWSBoZWlnaHQgaS5lLiB0aGlzLmNhbGNIZWlnaHRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsY3VsYXRlR3JpZEhlaWdodCgpIHtcbiAgICAgICAgdGhpcy5jYWxjR3JpZEhlYWRSb3coKTtcblxuICAgICAgICB0aGlzLmNhbGNIZWlnaHQgPSB0aGlzLl9jYWxjdWxhdGVHcmlkQm9keUhlaWdodCgpO1xuICAgICAgICBpZiAodGhpcy5waW5uZWRSb3dIZWlnaHQgJiYgdGhpcy5jYWxjSGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmNhbGNIZWlnaHQgLT0gdGhpcy5waW5uZWRSb3dIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEdyb3VwQXJlYUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldENvbXB1dGVkSGVpZ2h0KGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIGVsZW0ub2Zmc2V0SGVpZ2h0ID8gcGFyc2VGbG9hdCh0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWxlbSkuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JykpIDogMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRGb290ZXJIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VtbWFyeVJvd0hlaWdodCB8fCB0aGlzLmdldENvbXB1dGVkSGVpZ2h0KHRoaXMudGZvb3QubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0VGhlYWRSb3dIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5nZXRDb21wdXRlZEhlaWdodCh0aGlzLnRoZWFkUm93Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gKCF0aGlzLmFsbG93RmlsdGVyaW5nIHx8ICh0aGlzLmFsbG93RmlsdGVyaW5nICYmIHRoaXMuZmlsdGVyTW9kZSAhPT0gRmlsdGVyTW9kZS5xdWlja0ZpbHRlcikpID9cbiAgICAgICAgICAgIGhlaWdodCAtIHRoaXMuZ2V0RmlsdGVyQ2VsbEhlaWdodCgpIDpcbiAgICAgICAgICAgIGhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFRvb2xiYXJIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHRvb2xiYXJIZWlnaHQgPSAwO1xuICAgICAgICBpZiAodGhpcy50b29sYmFyLmZpcnN0KSB7XG4gICAgICAgICAgICB0b29sYmFySGVpZ2h0ID0gdGhpcy5nZXRDb21wdXRlZEhlaWdodCh0aGlzLnRvb2xiYXIuZmlyc3QubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvb2xiYXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRQYWdpbmdGb290ZXJIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHBhZ2luZ0hlaWdodCA9IDA7XG4gICAgICAgIGlmICh0aGlzLmZvb3Rlcikge1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5nZXRDb21wdXRlZEhlaWdodCh0aGlzLmZvb3Rlci5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIHBhZ2luZ0hlaWdodCA9IHRoaXMuZm9vdGVyLm5hdGl2ZUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQgP1xuICAgICAgICAgICAgICAgIGhlaWdodCA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2luZ0hlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEZpbHRlckNlbGxIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaGVhZGVyR3JvdXBOYXRpdmVFbCA9ICh0aGlzLmhlYWRlckdyb3Vwc0xpc3QubGVuZ3RoICE9PSAwKSA/XG4gICAgICAgICAgICB0aGlzLmhlYWRlckdyb3Vwc0xpc3RbMF0ubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgICAgIGNvbnN0IGZpbHRlckNlbGxOYXRpdmVFbCA9IChoZWFkZXJHcm91cE5hdGl2ZUVsKSA/XG4gICAgICAgICAgICBoZWFkZXJHcm91cE5hdGl2ZUVsLnF1ZXJ5U2VsZWN0b3IoJ2lneC1ncmlkLWZpbHRlcmluZy1jZWxsJykgYXMgSFRNTEVsZW1lbnQgOiBudWxsO1xuICAgICAgICByZXR1cm4gKGZpbHRlckNlbGxOYXRpdmVFbCkgPyBmaWx0ZXJDZWxsTmF0aXZlRWwub2Zmc2V0SGVpZ2h0IDogMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9jYWxjdWxhdGVHcmlkQm9keUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuX2hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWN0dWFsVGhlYWRSb3cgPSB0aGlzLmdldFRoZWFkUm93SGVpZ2h0KCk7XG4gICAgICAgIGNvbnN0IGZvb3RlckhlaWdodCA9IHRoaXMuZ2V0Rm9vdGVySGVpZ2h0KCk7XG4gICAgICAgIGNvbnN0IHRvb2xiYXJIZWlnaHQgPSB0aGlzLmdldFRvb2xiYXJIZWlnaHQoKTtcbiAgICAgICAgY29uc3QgcGFnaW5nSGVpZ2h0ID0gdGhpcy5nZXRQYWdpbmdGb290ZXJIZWlnaHQoKTtcbiAgICAgICAgY29uc3QgZ3JvdXBBcmVhSGVpZ2h0ID0gdGhpcy5nZXRHcm91cEFyZWFIZWlnaHQoKTtcbiAgICAgICAgY29uc3Qgc2NySGVpZ2h0ID0gdGhpcy5nZXRDb21wdXRlZEhlaWdodCh0aGlzLnNjci5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgY29uc3QgcmVuZGVyZWRIZWlnaHQgPSB0b29sYmFySGVpZ2h0ICsgYWN0dWFsVGhlYWRSb3cgK1xuICAgICAgICAgICAgZm9vdGVySGVpZ2h0ICsgcGFnaW5nSGVpZ2h0ICsgZ3JvdXBBcmVhSGVpZ2h0ICtcbiAgICAgICAgICAgIHNjckhlaWdodDtcblxuICAgICAgICBsZXQgZ3JpZEhlaWdodCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQZXJjZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpO1xuICAgICAgICAgICAgY29uc3QgYXV0b1NpemUgPSB0aGlzLl9zaG91bGRBdXRvU2l6ZShyZW5kZXJlZEhlaWdodCk7XG4gICAgICAgICAgICBpZiAoYXV0b1NpemUgfHwgY29tcHV0ZWQuaW5kZXhPZignJScpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHlIZWlnaHQgPSB0aGlzLmdldERhdGFCYXNlZEJvZHlIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYm9keUhlaWdodCA+IDAgPyBib2R5SGVpZ2h0IDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdyaWRIZWlnaHQgPSBwYXJzZUZsb2F0KGNvbXB1dGVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyaWRIZWlnaHQgPSBwYXJzZUludCh0aGlzLl9oZWlnaHQsIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhncmlkSGVpZ2h0IC0gcmVuZGVyZWRIZWlnaHQpO1xuXG4gICAgICAgIGlmIChNYXRoLnJvdW5kKGhlaWdodCkgPT09IDAgfHwgaXNOYU4oZ3JpZEhlaWdodCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlIZWlnaHQgPSB0aGlzLmRlZmF1bHRUYXJnZXRCb2R5SGVpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuIGJvZHlIZWlnaHQgPiAwID8gYm9keUhlaWdodCA6IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2hlY2tDb250YWluZXJTaXplQ2hhbmdlKCkge1xuICAgICAgICBjb25zdCBvcmlnSGVpZ2h0ID0gdGhpcy5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICByZXR1cm4gb3JpZ0hlaWdodCAhPT0gaGVpZ2h0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfc2hvdWxkQXV0b1NpemUocmVuZGVyZWRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy50Ym9keS5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGxldCByZXMgPSAhdGhpcy5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQgfHxcbiAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCA9PT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0ID09PSByZW5kZXJlZEhlaWdodCB8fFxuICAgICAgICAgICAgLy8gSWYgZ3JpZCBjYXVzZXMgdGhlIHBhcmVudCBjb250YWluZXIgdG8gZXh0ZW5kIChmb3IgZXhhbXBsZSB3aGVuIGNvbnRhaW5lciBpcyBmbGV4KVxuICAgICAgICAgICAgLy8gd2Ugc2hvdWxkIGFsd2F5cyBhdXRvLXNpemUgc2luY2UgdGhlIGFjdHVhbCBzaXplIG9mIHRoZSBjb250YWluZXIgd2lsbCBjb250aW51b3VzbHkgY2hhbmdlIGFzIHRoZSBncmlkIHJlbmRlcnMgZWxlbWVudHMuXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ29udGFpbmVyU2l6ZUNoYW5nZSgpO1xuICAgICAgICB0aGlzLnRib2R5Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBHZXRzIGNhbGN1bGF0ZWQgd2lkdGggb2YgdGhlIHVucGlubmVkIGFyZWFcbiAgICAgKiBAcGFyYW0gdGFrZUhpZGRlbiBJZiB3ZSBzaG91bGQgdGFrZSBpbnRvIGFjY291bnQgdGhlIGhpZGRlbiBjb2x1bW5zIGluIHRoZSBwaW5uZWQgYXJlYS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0VW5waW5uZWRXaWR0aCh0YWtlSGlkZGVuID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5pc1BlcmNlbnRXaWR0aCA/XG4gICAgICAgICAgICB0aGlzLmNhbGNXaWR0aCA6XG4gICAgICAgICAgICBwYXJzZUludCh0aGlzLndpZHRoLCAxMCkgfHwgcGFyc2VJbnQodGhpcy5ob3N0V2lkdGgsIDEwKSB8fCB0aGlzLmNhbGNXaWR0aDtcbiAgICAgICAgaWYgKHRoaXMuaGFzVmVydGljYWxTY3JvbGwoKSAmJiAhdGhpcy5pc1BlcmNlbnRXaWR0aCkge1xuICAgICAgICAgICAgd2lkdGggLT0gdGhpcy5zY3JvbGxTaXplO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1Bpbm5pbmdUb1N0YXJ0KSB7XG4gICAgICAgICAgICB3aWR0aCAtPSB0aGlzLmZlYXR1cmVDb2x1bW5zV2lkdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aWR0aCAtIHRoaXMuZ2V0UGlubmVkV2lkdGgodGFrZUhpZGRlbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfc3VtbWFyaWVzKGZpZWxkTmFtZTogc3RyaW5nLCBoYXNTdW1tYXJ5OiBib29sZWFuLCBzdW1tYXJ5T3BlcmFuZD86IGFueSkge1xuICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmdyaWRBUEkuZ2V0X2NvbHVtbl9ieV9uYW1lKGZpZWxkTmFtZSk7XG4gICAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgICAgIGNvbHVtbi5oYXNTdW1tYXJ5ID0gaGFzU3VtbWFyeTtcbiAgICAgICAgICAgIGlmIChzdW1tYXJ5T3BlcmFuZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvb3RTdW1tYXJpZXNFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyeVNlcnZpY2UucmV0cmlnZ2VyUm9vdFBpcGUrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29sdW1uLnN1bW1hcmllcyA9IHN1bW1hcnlPcGVyYW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfbXVsdGlwbGVTdW1tYXJpZXMoZXhwcmVzc2lvbnM6IElTdW1tYXJ5RXhwcmVzc2lvbltdLCBoYXNTdW1tYXJ5OiBib29sZWFuKSB7XG4gICAgICAgIGV4cHJlc3Npb25zLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3N1bW1hcmllcyhlbGVtZW50LmZpZWxkTmFtZSwgaGFzU3VtbWFyeSwgZWxlbWVudC5jdXN0b21TdW1tYXJ5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2Rpc2FibGVNdWx0aXBsZVN1bW1hcmllcyhleHByZXNzaW9ucykge1xuICAgICAgICBleHByZXNzaW9ucy5mb3JFYWNoKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSBjb2x1bW4gJiYgY29sdW1uLmZpZWxkTmFtZSA/IGNvbHVtbi5maWVsZE5hbWUgOiBjb2x1bW47XG4gICAgICAgICAgICB0aGlzLl9zdW1tYXJpZXMoY29sdW1uTmFtZSwgZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJlc29sdmVEYXRhVHlwZXMocmVjKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVjID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIEdyaWRDb2x1bW5EYXRhVHlwZS5OdW1iZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZXR1cm4gR3JpZENvbHVtbkRhdGFUeXBlLkJvb2xlYW47XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYyA9PT0gJ29iamVjdCcgJiYgcmVjIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIEdyaWRDb2x1bW5EYXRhVHlwZS5EYXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBHcmlkQ29sdW1uRGF0YVR5cGUuU3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXV0b2dlbmVyYXRlQ29sdW1ucygpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ3JpZEFQSS5nZXRfZGF0YSgpO1xuICAgICAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShJZ3hDb2x1bW5Db21wb25lbnQpO1xuICAgICAgICBjb25zdCBmaWVsZHMgPSB0aGlzLmdlbmVyYXRlRGF0YUZpZWxkcyhkYXRhKTtcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IFtdO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVmID0gZmFjdG9yeS5jcmVhdGUodGhpcy52aWV3UmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgIHJlZi5pbnN0YW5jZS5maWVsZCA9IGZpZWxkO1xuICAgICAgICAgICAgcmVmLmluc3RhbmNlLmRhdGFUeXBlID0gdGhpcy5yZXNvbHZlRGF0YVR5cGVzKGRhdGFbMF1bZmllbGRdKTtcbiAgICAgICAgICAgIHJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICBjb2x1bW5zLnB1c2gocmVmLmluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1dG9HZW5lcmF0ZWRDb2xzID0gY29sdW1ucztcblxuICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQoY29sdW1ucyk7XG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zaG91bGRHZW5lcmF0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlRGF0YUZpZWxkcyhkYXRhOiBhbnlbXSk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGRhdGEgJiYgZGF0YS5sZW5ndGggIT09IDAgPyBkYXRhWzBdIDogW10pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW5pdENvbHVtbnMoY29sbGVjdGlvbjogUXVlcnlMaXN0PElneENvbHVtbkNvbXBvbmVudD4sIGNiOiAoYXJnczogYW55KSA9PiB2b2lkID0gbnVsbCkge1xuICAgICAgICB0aGlzLl9jb2x1bW5Hcm91cHMgPSB0aGlzLmNvbHVtbkxpc3Quc29tZShjb2wgPT4gY29sLmNvbHVtbkdyb3VwKTtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgLy8gU2V0IG92ZXJhbGwgcm93IGxheW91dCBzaXplXG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QuZm9yRWFjaCgoY29sKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5jb2x1bW5MYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF5b3V0U2l6ZSA9IGNvbC5jaGlsZHJlbiA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2wuY2hpbGRyZW4ucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgodmFsLnJvd1N0YXJ0ICsgdmFsLmdyaWRSb3dTcGFuIC0gMSwgYWNjKSwgMSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbXVsdGlSb3dMYXlvdXRSb3dTaXplID0gTWF0aC5tYXgobGF5b3V0U2l6ZSwgdGhpcy5fbXVsdGlSb3dMYXlvdXRSb3dTaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oYXNDb2x1bW5MYXlvdXRzICYmIHRoaXMuaGFzQ29sdW1uR3JvdXBzKSB7XG4gICAgICAgICAgICAvLyBpbnZhbGlkIGNvbmZpZ3VyYXRpb24gLSBtdWx0aS1yb3cgYW5kIGNvbHVtbiBncm91cHNcbiAgICAgICAgICAgIC8vIHJlbW92ZSBjb2x1bW4gZ3JvdXBzXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5MYXlvdXRDb2x1bW5zID0gdGhpcy5jb2x1bW5MaXN0LmZpbHRlcigoY29sKSA9PiBjb2wuY29sdW1uTGF5b3V0IHx8IGNvbC5jb2x1bW5MYXlvdXRDaGlsZCk7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQoY29sdW1uTGF5b3V0Q29sdW1ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWF4TGV2ZWxIZWFkZXJEZXB0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbHVtbnMgPSB0aGlzLmNvbHVtbkxpc3QudG9BcnJheSgpO1xuICAgICAgICBjb2xsZWN0aW9uLmZvckVhY2goKGNvbHVtbjogSWd4Q29sdW1uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICBjb2x1bW4uZGVmYXVsdFdpZHRoID0gdGhpcy5jb2x1bW5XaWR0aFNldEJ5VXNlciA/IHRoaXMuX2NvbHVtbldpZHRoIDogY29sdW1uLmRlZmF1bHRXaWR0aCA/IGNvbHVtbi5kZWZhdWx0V2lkdGggOiAnJztcblxuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgY2IoY29sdW1uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWluaXRQaW5TdGF0ZXMoKTtcblxuICAgICAgICBpZiAodGhpcy5oYXNDb2x1bW5MYXlvdXRzKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLmZvckVhY2goKGNvbHVtbjogSWd4Q29sdW1uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29sdW1uLnBvcHVsYXRlVmlzaWJsZUluZGV4ZXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCByZWluaXRQaW5TdGF0ZXMoKSB7XG4gICAgICAgIHRoaXMuX3Bpbm5lZENvbHVtbnMgPSB0aGlzLmNvbHVtbkxpc3RcbiAgICAgICAgICAgIC5maWx0ZXIoKGMpID0+IGMucGlubmVkKS5zb3J0KChhLCBiKSA9PiB0aGlzLl9waW5uZWRDb2x1bW5zLmluZGV4T2YoYSkgLSB0aGlzLl9waW5uZWRDb2x1bW5zLmluZGV4T2YoYikpO1xuICAgICAgICB0aGlzLl91bnBpbm5lZENvbHVtbnMgPSB0aGlzLmhhc0NvbHVtbkdyb3VwcyA/IHRoaXMuY29sdW1uTGlzdC5maWx0ZXIoKGMpID0+ICFjLnBpbm5lZCkgOlxuICAgICAgICAgICAgdGhpcy5jb2x1bW5MaXN0LmZpbHRlcigoYykgPT4gIWMucGlubmVkKVxuICAgICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiB0aGlzLl91bnBpbm5lZENvbHVtbnMuZmluZEluZGV4KHggPT4geC5maWVsZCA9PT0gYS5maWVsZCkgLSB0aGlzLl91bnBpbm5lZENvbHVtbnMuZmluZEluZGV4KHggPT4geC5maWVsZCA9PT0gYi5maWVsZCkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBleHRyYWN0RGF0YUZyb21TZWxlY3Rpb24oc291cmNlOiBhbnlbXSwgZm9ybWF0dGVycyA9IGZhbHNlLCBoZWFkZXJzID0gZmFsc2UsIGNvbHVtbkRhdGE/OiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgbGV0IGNvbHVtbnNBcnJheTogSWd4Q29sdW1uQ29tcG9uZW50W107XG4gICAgICAgIGxldCByZWNvcmQgPSB7fTtcbiAgICAgICAgbGV0IHNlbGVjdGVkRGF0YSA9IFtdO1xuICAgICAgICBsZXQga2V5cyA9IFtdO1xuICAgICAgICBjb25zdCBzZWxlY3Rpb25Db2xsZWN0aW9uID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBrZXlzQW5kRGF0YSA9IFtdO1xuICAgICAgICBjb25zdCBhY3RpdmVFbCA9IHRoaXMuc2VsZWN0aW9uU2VydmljZS5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZUVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaWd4LWhpZXJhcmNoaWNhbC1ncmlkJykge1xuICAgICAgICAgICAgY29uc3QgZXhwYW5zaW9uUm93SW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgdGhpcy5leHBhbnNpb25TdGF0ZXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGFuc2lvblJvd0luZGV4ZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uLnNpemUgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4cGFuc2lvblJvd0luZGV4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVwZGF0ZWRLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBhbnNpb25Sb3dJbmRleGVzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm93SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihyb3cuSUQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0luZGV4ID0gTnVtYmVyKHJvdy5JRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SW5kZXggPSBOdW1iZXIocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlZEtleSA+IE51bWJlcihyb3dJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEtleS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uQ29sbGVjdGlvbi5zZXQodXBkYXRlZEtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVFbCkge1xuICAgICAgICAgICAgICAgIGlmIChleHBhbnNpb25Sb3dJbmRleGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5zaW9uUm93SW5kZXhlcy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlRWwucm93ID4gTnVtYmVyKHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVFbC5yb3ctLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG90YWxJdGVtcyA9ICh0aGlzIGFzIGFueSkudG90YWxJdGVtQ291bnQgPz8gMDtcbiAgICAgICAgY29uc3QgaXNSZW1vdGUgPSB0b3RhbEl0ZW1zICYmIHRvdGFsSXRlbXMgPiB0aGlzLmRhdGFWaWV3Lmxlbmd0aDtcbiAgICAgICAgbGV0IHNlbGVjdGlvbk1hcDtcbiAgICAgICAgaWYgKHRoaXMubmF0aXZlRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpZ3gtaGllcmFyY2hpY2FsLWdyaWQnICYmIHNlbGVjdGlvbkNvbGxlY3Rpb24uc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbk1hcCA9IGlzUmVtb3RlID8gQXJyYXkuZnJvbShzZWxlY3Rpb25Db2xsZWN0aW9uKSA6XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShzZWxlY3Rpb25Db2xsZWN0aW9uKS5maWx0ZXIoKHR1cGxlKSA9PiB0dXBsZVswXSA8IHNvdXJjZS5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZWN0aW9uTWFwID0gaXNSZW1vdGUgPyBBcnJheS5mcm9tKHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb24pIDpcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb24pLmZpbHRlcigodHVwbGUpID0+IHR1cGxlWzBdIDwgc291cmNlLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jZWxsU2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5zaW5nbGUgJiYgYWN0aXZlRWwpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbk1hcC5wdXNoKFthY3RpdmVFbC5yb3csIG5ldyBTZXQ8bnVtYmVyPigpLmFkZChhY3RpdmVFbC5jb2x1bW4pXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jZWxsU2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5ub25lICYmIGFjdGl2ZUVsKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25NYXAucHVzaChbYWN0aXZlRWwucm93LCBuZXcgU2V0PG51bWJlcj4oKS5hZGQoYWN0aXZlRWwuY29sdW1uKV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbHVtbkRhdGEpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkRGF0YSA9IGNvbHVtbkRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gICAgICAgIGZvciAobGV0IFtyb3csIHNldF0gb2Ygc2VsZWN0aW9uTWFwKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLnBhZ2luYXRvciAmJiAodGhpcy5wYWdpbmdNb2RlID09PSBHcmlkUGFnaW5nTW9kZS5Mb2NhbCAmJiBzb3VyY2UgPT09IHRoaXMuZmlsdGVyZWRTb3J0ZWREYXRhKSA/IHJvdyArICh0aGlzLnBhZ2luYXRvci5wZXJQYWdlICogdGhpcy5wYWdpbmF0b3IucGFnZSkgOiByb3c7XG4gICAgICAgICAgICByb3cgPSBpc1JlbW90ZSA/IHJvdyAtIHRoaXMudmlydHVhbGl6YXRpb25TdGF0ZS5zdGFydEluZGV4IDogcm93O1xuICAgICAgICAgICAgaWYgKCFzb3VyY2Vbcm93XSB8fCBzb3VyY2Vbcm93XS5kZXRhaWxzRGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gQXJyYXkuZnJvbShzZXQpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlYWNoIG9mIHRlbXApIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zQXJyYXkgPSB0aGlzLmdldFNlbGVjdGFibGVDb2x1bW5zQXQoZWFjaCk7XG4gICAgICAgICAgICAgICAgY29sdW1uc0FycmF5LmZvckVhY2goKGNvbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBoZWFkZXJzID8gY29sLmhlYWRlciB8fCBjb2wuZmllbGQgOiBjb2wuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dEYXRhID0gc291cmNlW3Jvd10uZ2hvc3RSZWNvcmQgPyBzb3VyY2Vbcm93XS5yZWNvcmRSZWYgOiBzb3VyY2Vbcm93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzb2x2ZU5lc3RlZFBhdGgocm93RGF0YSwgY29sLmZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZFtrZXldID0gZm9ybWF0dGVycyAmJiBjb2wuZm9ybWF0dGVyID8gY29sLmZvcm1hdHRlcih2YWx1ZSwgcm93RGF0YSkgOiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWNvcmRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRba2V5XSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRba2V5XSA9IHJlY29yZFtrZXldLnRvU3RyaW5nKCkuY29uY2F0KCdyZWNvcmRSb3ctJyArIHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZWNvcmQpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhjb2x1bW5EYXRhWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhyZWNvcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGM6IGFueSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93TnVtYmVyID0gK2Muc3BsaXQoJ3JlY29yZFJvdy0nKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBjLnNwbGl0KCdyZWNvcmRSb3ctJylbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRba2V5XSA9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWRPYmogPSBPYmplY3QuYXNzaWduKHNlbGVjdGVkRGF0YVtyb3dOdW1iZXJdLCByZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWREYXRhW3Jvd051bWJlcl0gPSBtZXJnZWRPYmo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZERhdGEucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlY29yZCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBrZXlzQW5kRGF0YS5wdXNoKHNlbGVjdGVkRGF0YSk7XG4gICAgICAgICAgICBrZXlzQW5kRGF0YS5wdXNoKGtleXMpO1xuICAgICAgICAgICAgcmV0dXJuIGtleXNBbmREYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkRGF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTZWxlY3RhYmxlQ29sdW1uc0F0KGluZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NvbHVtbkxheW91dHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZpc2libGVMYXlvdXRDb2x1bW5zID0gdGhpcy52aXNpYmxlQ29sdW1uc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoY29sID0+IGNvbC5jb2x1bW5MYXlvdXQpXG4gICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEudmlzaWJsZUluZGV4IC0gYi52aXNpYmxlSW5kZXgpO1xuICAgICAgICAgICAgY29uc3QgY29sTGF5b3V0ID0gdmlzaWJsZUxheW91dENvbHVtbnNbaW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuIGNvbExheW91dCA/IGNvbExheW91dC5jaGlsZHJlbi50b0FycmF5KCkgOiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHZpc2libGVDb2x1bW5zID0gdGhpcy52aXNpYmxlQ29sdW1uc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoY29sID0+ICFjb2wuY29sdW1uR3JvdXApXG4gICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEudmlzaWJsZUluZGV4IC0gYi52aXNpYmxlSW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIFt2aXNpYmxlQ29sdW1uc1tpbmRleF1dO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGV4dHJhY3REYXRhRnJvbUNvbHVtbnNTZWxlY3Rpb24oc291cmNlOiBhbnlbXSwgZm9ybWF0dGVycyA9IGZhbHNlLCBoZWFkZXJzID0gZmFsc2UpOiBhbnlbXSB7XG4gICAgICAgIGxldCByZWNvcmQgPSB7fTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gW107XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkQ29sdW1ucyA9IHRoaXMuc2VsZWN0ZWRDb2x1bW5zKCk7XG4gICAgICAgIGlmIChzZWxlY3RlZENvbHVtbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGRhdGEgb2Ygc291cmNlKSB7XG4gICAgICAgICAgICBzZWxlY3RlZENvbHVtbnMuZm9yRWFjaCgoY29sKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gaGVhZGVycyA/IGNvbC5oZWFkZXIgfHwgY29sLmZpZWxkIDogY29sLmZpZWxkO1xuICAgICAgICAgICAgICAgIHJlY29yZFtrZXldID0gZm9ybWF0dGVycyAmJiBjb2wuZm9ybWF0dGVyID8gY29sLmZvcm1hdHRlcihkYXRhW2NvbC5maWVsZF0sIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIDogZGF0YVtjb2wuZmllbGRdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZWNvcmQpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkRGF0YS5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWNvcmQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZWN0ZWREYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW5pdFBpbm5pbmcoKSB7XG4gICAgICAgIGNvbnN0IHBpbm5lZENvbHVtbnMgPSBbXTtcbiAgICAgICAgY29uc3QgdW5waW5uZWRDb2x1bW5zID0gW107XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVHcmlkV2lkdGgoKTtcbiAgICAgICAgdGhpcy5yZXNldENhY2hlcygpO1xuICAgICAgICAvLyBXaGVuIGEgY29sdW1uIGlzIGEgZ3JvdXAgb3IgaXMgaW5zaWRlIGEgZ3JvdXAsIHBpbiBhbGwgcmVsYXRlZC5cbiAgICAgICAgdGhpcy5fcGlubmVkQ29sdW1ucy5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgICAgICBpZiAoY29sLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGNvbC5wYXJlbnQucGlubmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2wuY29sdW1uR3JvdXApIHtcbiAgICAgICAgICAgICAgICBjb2wuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC5waW5uZWQgPSB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGRvbid0IGV4Y2VlZCB1bnBpbm5lZCBhcmVhIG1pbiB3aWR0aCBhbmQgZ2V0IHBpbm5lZCBhbmQgdW5waW5uZWQgY29sIGNvbGxlY3Rpb25zLlxuICAgICAgICAvLyBXZSB0YWtlIGludG8gYWNjb3VudCB0b3AgbGV2ZWwgY29sdW1ucyAodG9wIGxldmVsIGdyb3VwcyBhbmQgbm9uIGdyb3VwcykuXG4gICAgICAgIC8vIElmIHRvcCBsZXZlbCBpcyB1bnBpbm5lZCB0aGUgcGlubmluZyBoYW5kbGVzIGFsbCBjaGlsZHJlbiB0byBiZSB1bnBpbm5lZCBhcyB3ZWxsLlxuICAgICAgICBmb3IgKGNvbnN0IGNvbHVtbiBvZiB0aGlzLmNvbHVtbkxpc3QpIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW4ucGlubmVkICYmICFjb2x1bW4ucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcGlubmVkQ29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbHVtbi5waW5uZWQgJiYgY29sdW1uLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4udG9wTGV2ZWxQYXJlbnQucGlubmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBpbm5lZENvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5waW5uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdW5waW5uZWRDb2x1bW5zLnB1c2goY29sdW1uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVucGlubmVkQ29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBc3NpZ24gdGhlIGFwcGxpY2FibGUgY29sbGVjdGlvbnMuXG4gICAgICAgIHRoaXMuX3Bpbm5lZENvbHVtbnMgPSBwaW5uZWRDb2x1bW5zO1xuICAgICAgICB0aGlzLl91bnBpbm5lZENvbHVtbnMgPSB1bnBpbm5lZENvbHVtbnM7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Nyb2xsVG8ocm93OiBhbnkgfCBudW1iZXIsIGNvbHVtbjogYW55IHwgbnVtYmVyLCBpbkNvbGxlY3Rpb24gPSB0aGlzLl9maWx0ZXJlZFNvcnRlZFVucGlubmVkRGF0YSk6IHZvaWQge1xuICAgICAgICBsZXQgZGVsYXlTY3JvbGxpbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5wYWdpbmF0b3IgJiYgdHlwZW9mIChyb3cpICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBpbkNvbGxlY3Rpb24uaW5kZXhPZihyb3cpO1xuICAgICAgICAgICAgY29uc3QgcGFnZSA9IE1hdGguZmxvb3Iocm93SW5kZXggLyB0aGlzLnBhZ2luYXRvci5wZXJQYWdlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdG9yLnBhZ2UgIT09IHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBkZWxheVNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0b3IucGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVsYXlTY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuZGF0YUNoYW5nZWQucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsRGlyZWN0aXZlKHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiAocm93KSA9PT0gJ251bWJlcicgPyByb3cgOiB0aGlzLnVucGlubmVkRGF0YVZpZXcuaW5kZXhPZihyb3cpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxEaXJlY3RpdmUodGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICB0eXBlb2YgKHJvdykgPT09ICdudW1iZXInID8gcm93IDogdGhpcy51bnBpbm5lZERhdGFWaWV3LmluZGV4T2Yocm93KSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbFRvSG9yaXpvbnRhbGx5KGNvbHVtbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzY3JvbGxUb0hvcml6b250YWxseShjb2x1bW46IGFueSB8IG51bWJlcikge1xuICAgICAgICBsZXQgY29sdW1uSW5kZXggPSB0eXBlb2YgY29sdW1uID09PSAnbnVtYmVyJyA/IGNvbHVtbiA6IHRoaXMuZ2V0Q29sdW1uQnlOYW1lKGNvbHVtbikudmlzaWJsZUluZGV4O1xuICAgICAgICBjb25zdCBzY3JvbGxSb3cgPSB0aGlzLnJvd0xpc3QuZmluZChyID0+ICEhci52aXJ0RGlyUm93KTtcbiAgICAgICAgY29uc3QgdmlydERpciA9IHNjcm9sbFJvdyA/IHNjcm9sbFJvdy52aXJ0RGlyUm93IDogbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuaXNQaW5uaW5nVG9TdGFydCAmJiB0aGlzLnBpbm5lZENvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoY29sdW1uSW5kZXggPj0gdGhpcy5waW5uZWRDb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbkluZGV4IC09IHRoaXMucGlubmVkQ29sdW1ucy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxEaXJlY3RpdmUodmlydERpciwgY29sdW1uSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxEaXJlY3RpdmUodmlydERpciwgY29sdW1uSW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzY3JvbGxEaXJlY3RpdmUoZGlyZWN0aXZlOiBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmU8YW55PiwgZ29hbDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghZGlyZWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGlyZWN0aXZlLnNjcm9sbFRvKGdvYWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29sdW1uV2lkdGhTdW0oKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGNvbFN1bSA9IDA7XG4gICAgICAgIGNvbnN0IGNvbHMgPSB0aGlzLmhhc0NvbHVtbkxheW91dHMgP1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlQ29sdW1ucy5maWx0ZXIoeCA9PiB4LmNvbHVtbkxheW91dCkgOiB0aGlzLnZpc2libGVDb2x1bW5zLmZpbHRlcih4ID0+ICF4LmNvbHVtbkdyb3VwKTtcbiAgICAgICAgY29scy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb2xTdW0gKz0gcGFyc2VJbnQoKGl0ZW0uY2FsY1dpZHRoIHx8IGl0ZW0uZGVmYXVsdFdpZHRoKSwgMTApIHx8IE1JTklNVU1fQ09MVU1OX1dJRFRIO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFjb2xTdW0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgY29sU3VtICs9IHRoaXMuZmVhdHVyZUNvbHVtbnNXaWR0aCgpO1xuICAgICAgICByZXR1cm4gY29sU3VtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5vdGlmeSBjaGFuZ2VzLCByZXNldCBjYWNoZSBhbmQgcG9wdWxhdGVWaXNpYmxlSW5kZXhlcy5cbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9jb2x1bW5zUmVvcmRlcmVkKGNvbHVtbjogSWd4Q29sdW1uQ29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICBpZiAodGhpcy5oYXNDb2x1bW5MYXlvdXRzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QuZmlsdGVyKHggPT4geC5jb2x1bW5MYXlvdXQpLmZvckVhY2goeCA9PiB4LnBvcHVsYXRlVmlzaWJsZUluZGV4ZXMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWZ0ZXIgcmVvcmRlcmluZyBpcyBkb25lIHJlc2V0IGNhY2hlZCBjb2x1bW4gY29sbGVjdGlvbnMuXG4gICAgICAgIHRoaXMucmVzZXRDb2x1bW5Db2xsZWN0aW9ucygpO1xuICAgICAgICBjb2x1bW4ucmVzZXRDYWNoZXMoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYnVpbGREYXRhVmlldyhkYXRhOiBhbnlbXSkge1xuICAgICAgICB0aGlzLl9kYXRhVmlldyA9IHRoaXMuaXNSb3dQaW5uaW5nVG9Ub3AgP1xuICAgICAgICAgICAgWy4uLnRoaXMucGlubmVkRGF0YVZpZXcsIC4uLnRoaXMudW5waW5uZWREYXRhVmlld10gOlxuICAgICAgICAgICAgWy4uLnRoaXMudW5waW5uZWREYXRhVmlldywgLi4udGhpcy5waW5uZWREYXRhVmlld107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYXBwbHlXaWR0aEhvc3RCaW5kaW5nKCkge1xuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl93aWR0aDtcbiAgICAgICAgaWYgKHdpZHRoID09PSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFdpZHRoID0gdGhpcy5jYWxjV2lkdGg7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNWZXJ0aWNhbFNjcm9sbCgpKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFdpZHRoICs9IHRoaXMuc2Nyb2xsU2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpZHRoID0gY3VycmVudFdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMucmVzZXRDYWNoZXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ob3N0V2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHZlcnRpY2FsU2Nyb2xsSGFuZGxlcihldmVudCkge1xuICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLm9uU2Nyb2xsKGV2ZW50KTtcbiAgICAgICAgdGhpcy5kaXNhYmxlVHJhbnNpdGlvbnMgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy56b25lLm9uU3RhYmxlLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLmNodW5rTG9hZC5lbWl0KHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvd0VkaXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlUm93RWRpdGluZ092ZXJsYXlTdGF0ZU9uU2Nyb2xsKHRoaXMuY3J1ZFNlcnZpY2Uucm93SW5FZGl0TW9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc2FibGVUcmFuc2l0aW9ucyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaGlkZU92ZXJsYXlzKCk7XG4gICAgICAgIHRoaXMuYWN0aW9uU3RyaXA/LmhpZGUoKTtcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uU3RyaXApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uU3RyaXAuY29udGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJnczogSUdyaWRTY3JvbGxFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uOiB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnNjcm9sbFBvc2l0aW9uXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ3JpZFNjcm9sbC5lbWl0KGFyZ3MpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBob3Jpem9udGFsU2Nyb2xsSGFuZGxlcihldmVudCkge1xuICAgICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQ7XG4gICAgICAgIHRoaXMuaGVhZGVyQ29udGFpbmVyLm9uSFNjcm9sbChzY3JvbGxMZWZ0KTtcbiAgICAgICAgdGhpcy5faG9yaXpvbnRhbEZvck9mcy5mb3JFYWNoKHZmb3IgPT4gdmZvci5vbkhTY3JvbGwoc2Nyb2xsTGVmdCkpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5vblN0YWJsZS5waXBlKGZpcnN0KCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRWaXJ0RGlyLmNodW5rTG9hZC5lbWl0KHRoaXMuaGVhZGVyQ29udGFpbmVyLnN0YXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmhpZGVPdmVybGF5cygpO1xuICAgICAgICBjb25zdCBhcmdzOiBJR3JpZFNjcm9sbEV2ZW50QXJncyA9IHsgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsIGV2ZW50LCBzY3JvbGxQb3NpdGlvbjogdGhpcy5oZWFkZXJDb250YWluZXIuc2Nyb2xsUG9zaXRpb24gfTtcbiAgICAgICAgdGhpcy5ncmlkU2Nyb2xsLmVtaXQoYXJncyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleGVjdXRlQ2FsbGJhY2socm93SW5kZXgsIHZpc2libGVDb2xJbmRleCA9IC0xLCBjYjogKGFyZ3M6IGFueSkgPT4gdm9pZCA9IG51bGwpIHtcbiAgICAgICAgaWYgKCFjYikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCByb3cgPSB0aGlzLnN1bW1hcmllc1Jvd0xpc3QuZmlsdGVyKHMgPT4gcy5pbmRleCAhPT0gMCkuY29uY2F0KHRoaXMucm93TGlzdC50b0FycmF5KCkpLmZpbmQociA9PiByLmluZGV4ID09PSByb3dJbmRleCk7XG4gICAgICAgIGlmICghcm93KSB7XG4gICAgICAgICAgICBpZiAoKHRoaXMgYXMgYW55KS50b3RhbEl0ZW1Db3VudCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuZGF0YUNoYW5nZWQucGlwZShmaXJzdCgpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IHRoaXMuc3VtbWFyaWVzUm93TGlzdC5maWx0ZXIocyA9PiBzLmluZGV4ICE9PSAwKS5jb25jYXQodGhpcy5yb3dMaXN0LnRvQXJyYXkoKSkuZmluZChyID0+IHIuaW5kZXggPT09IHJvd0luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2JBcmdzID0gdGhpcy5nZXROYXZpZ2F0aW9uQXJndW1lbnRzKHJvdywgdmlzaWJsZUNvbEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY2IoY2JBcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRhdGFWaWV3SW5kZXggPSB0aGlzLl9nZXREYXRhVmlld0luZGV4KHJvd0luZGV4KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFWaWV3W2RhdGFWaWV3SW5kZXhdLmRldGFpbHNEYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uLnNldEFjdGl2ZU5vZGUoeyByb3c6IHJvd0luZGV4IH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmdldE5hdmlnYXRpb25Bcmd1bWVudHMocm93LCB2aXNpYmxlQ29sSW5kZXgpO1xuICAgICAgICBjYihhcmdzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE5hdmlnYXRpb25Bcmd1bWVudHMocm93LCB2aXNpYmxlQ29sSW5kZXgpIHtcbiAgICAgICAgbGV0IHRhcmdldFR5cGU6IEdyaWRLZXlkb3duVGFyZ2V0VHlwZTsgbGV0IHRhcmdldDtcbiAgICAgICAgc3dpdGNoIChyb3cubmF0aXZlRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2lneC1ncmlkLWdyb3VwYnktcm93JzpcbiAgICAgICAgICAgICAgICB0YXJnZXRUeXBlID0gJ2dyb3VwUm93JztcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSByb3c7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpZ3gtZ3JpZC1zdW1tYXJ5LXJvdyc6XG4gICAgICAgICAgICAgICAgdGFyZ2V0VHlwZSA9ICdzdW1tYXJ5Q2VsbCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdmlzaWJsZUNvbEluZGV4ICE9PSAtMSA/XG4gICAgICAgICAgICAgICAgICAgIHJvdy5zdW1tYXJ5Q2VsbHMuZmluZChjID0+IGMudmlzaWJsZUNvbHVtbkluZGV4ID09PSB2aXNpYmxlQ29sSW5kZXgpIDogcm93LnN1bW1hcnlDZWxscy5maXJzdDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2lneC1jaGlsZC1ncmlkLXJvdyc6XG4gICAgICAgICAgICAgICAgdGFyZ2V0VHlwZSA9ICdoaWVyYXJjaGljYWxSb3cnO1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IHJvdztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGFyZ2V0VHlwZSA9ICdkYXRhQ2VsbCc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdmlzaWJsZUNvbEluZGV4ICE9PSAtMSA/IHJvdy5jZWxscy5maW5kKGMgPT4gYy52aXNpYmxlQ29sdW1uSW5kZXggPT09IHZpc2libGVDb2xJbmRleCkgOiByb3cuY2VsbHMuZmlyc3Q7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdGFyZ2V0VHlwZSwgdGFyZ2V0IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXh0RGF0YVJvd0luZGV4KGN1cnJlbnRSb3dJbmRleCwgcHJldmlvdXMgPSBmYWxzZSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkSW5kZXggPSB0aGlzLl9nZXREYXRhVmlld0luZGV4KGN1cnJlbnRSb3dJbmRleCk7XG4gICAgICAgIGlmIChjdXJyZW50Um93SW5kZXggPCAwIHx8IChjdXJyZW50Um93SW5kZXggPT09IDAgJiYgcHJldmlvdXMpIHx8IChyZXNvbHZlZEluZGV4ID49IHRoaXMuZGF0YVZpZXcubGVuZ3RoIC0gMSAmJiAhcHJldmlvdXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFJvd0luZGV4O1xuICAgICAgICB9XG4gICAgICAgIC8vIGZpbmQgbmV4dC9wcmV2IHJlY29yZCB0aGF0IGlzIGVkaXRhYmxlLlxuICAgICAgICBjb25zdCBuZXh0Um93SW5kZXggPSBwcmV2aW91cyA/IHRoaXMuZmluZFByZXZFZGl0YWJsZURhdGFSb3dJbmRleChjdXJyZW50Um93SW5kZXgpIDpcbiAgICAgICAgICAgIHRoaXMuZGF0YVZpZXcuZmluZEluZGV4KChyZWMsIGluZGV4KSA9PlxuICAgICAgICAgICAgICAgIGluZGV4ID4gcmVzb2x2ZWRJbmRleCAmJiB0aGlzLmlzRWRpdGFibGVEYXRhUmVjb3JkQXRJbmRleChpbmRleCkpO1xuICAgICAgICBjb25zdCBuZXh0RGF0YUluZGV4ID0gdGhpcy5nZXREYXRhSW5kZXgobmV4dFJvd0luZGV4KTtcbiAgICAgICAgcmV0dXJuIG5leHREYXRhSW5kZXggIT09IC0xID8gbmV4dERhdGFJbmRleCA6IGN1cnJlbnRSb3dJbmRleDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBwcmV2aW91cyBlZGl0YWJsZSByb3cgaW5kZXggb3IgLTEgaWYgbm8gc3VjaCByb3cgaXMgZm91bmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY3VycmVudEluZGV4IFRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBlZGl0YWJsZSByZWNvcmQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaW5kUHJldkVkaXRhYmxlRGF0YVJvd0luZGV4KGN1cnJlbnRJbmRleCk6IG51bWJlciB7XG4gICAgICAgIGxldCBpID0gdGhpcy5kYXRhVmlldy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkSW5kZXggPSB0aGlzLl9nZXREYXRhVmlld0luZGV4KGN1cnJlbnRJbmRleCk7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChpIDwgcmVzb2x2ZWRJbmRleCAmJiB0aGlzLmlzRWRpdGFibGVEYXRhUmVjb3JkQXRJbmRleChpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIHJlY29yZCBhdCB0aGUgc3BlY2lmaWVkIGRhdGEgdmlldyBpbmRleCBpcyBhIGFuIGVkaXRhYmxlIGRhdGEgcmVjb3JkLlxuICAgICAqIElmIHJlY29yZCBpcyBncm91cCByZWMsIHN1bW1hcnkgcmVjLCBjaGlsZCByZWMsIGdob3N0IHJlYy4gZXRjLiBpdCBpcyBub3QgZWRpdGFibGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVZpZXdJbmRleCBUaGUgaW5kZXggb2YgdGhhdCByZWNvcmQgaW4gdGhlIGRhdGEgdmlldy5cbiAgICAgKlxuICAgICAqL1xuICAgIC8vIFRPRE86IENvbnNpZGVyIG1vdmluZyBpdCBpbnRvIENSVURcbiAgICBwcml2YXRlIGlzRWRpdGFibGVEYXRhUmVjb3JkQXRJbmRleChkYXRhVmlld0luZGV4KSB7XG4gICAgICAgIGNvbnN0IHJlYyA9IHRoaXMuZGF0YVZpZXdbZGF0YVZpZXdJbmRleF07XG4gICAgICAgIHJldHVybiAhcmVjLmV4cHJlc3Npb24gJiYgIXJlYy5zdW1tYXJpZXMgJiYgIXJlYy5jaGlsZEdyaWRzRGF0YSAmJiAhcmVjLmRldGFpbHNEYXRhICYmXG4gICAgICAgICAgICAhdGhpcy5pc0dob3N0UmVjb3JkQXRJbmRleChkYXRhVmlld0luZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGlmIHRoZSByZWNvcmQgYXQgdGhlIHNwZWNpZmllZCBkYXRhIHZpZXcgaW5kZXggaXMgYSBnaG9zdC5cbiAgICAgKiBJZiByZWNvcmQgaXMgcGlubmVkIGJ1dCBpcyBub3QgaW4gcGlubmVkIGFyZWEgdGhlbiBpdCBpcyBhIGdob3N0IHJlY29yZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhVmlld0luZGV4IFRoZSBpbmRleCBvZiB0aGF0IHJlY29yZCBpbiB0aGUgZGF0YSB2aWV3LlxuICAgICAqL1xuICAgIHByaXZhdGUgaXNHaG9zdFJlY29yZEF0SW5kZXgoZGF0YVZpZXdJbmRleCkge1xuICAgICAgICBjb25zdCBpc1Bpbm5lZCA9IHRoaXMuaXNSZWNvcmRQaW5uZWQodGhpcy5kYXRhVmlld1tkYXRhVmlld0luZGV4XSk7XG4gICAgICAgIGNvbnN0IGlzSW5QaW5uZWRBcmVhID0gdGhpcy5pc1JlY29yZFBpbm5lZEJ5Vmlld0luZGV4KGRhdGFWaWV3SW5kZXgpO1xuICAgICAgICByZXR1cm4gaXNQaW5uZWQgJiYgIWlzSW5QaW5uZWRBcmVhO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNWYWxpZFBvc2l0aW9uKHJvd0luZGV4LCBjb2xJbmRleCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByb3dzID0gdGhpcy5zdW1tYXJpZXNSb3dMaXN0LmZpbHRlcihzID0+IHMuaW5kZXggIT09IDApLmNvbmNhdCh0aGlzLnJvd0xpc3QudG9BcnJheSgpKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGNvbHMgPSB0aGlzLmNvbHVtbkxpc3QuZmlsdGVyKGNvbCA9PiAhY29sLmNvbHVtbkdyb3VwICYmIGNvbC52aXNpYmxlSW5kZXggPj0gMCAmJiAhY29sLmhpZGRlbikubGVuZ3RoO1xuICAgICAgICBpZiAocm93cyA8IDEgfHwgY29scyA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm93SW5kZXggPiAtMSAmJiByb3dJbmRleCA8IHRoaXMuZGF0YVZpZXcubGVuZ3RoICYmXG4gICAgICAgICAgICBjb2xJbmRleCA+IC0gMSAmJiBjb2xJbmRleCA8PSBNYXRoLm1heCguLi50aGlzLnZpc2libGVDb2x1bW5zLm1hcChjID0+IGMudmlzaWJsZUluZGV4KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmQodGV4dDogc3RyaW5nLCBpbmNyZW1lbnQ6IG51bWJlciwgY2FzZVNlbnNpdGl2ZT86IGJvb2xlYW4sIGV4YWN0TWF0Y2g/OiBib29sZWFuLCBzY3JvbGw/OiBib29sZWFuLCBlbmRFZGl0ID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMucm93TGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kRWRpdCkge1xuICAgICAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGV4dCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYXNlU2Vuc2l0aXZlUmVzb2x2ZWQgPSBjYXNlU2Vuc2l0aXZlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBjb25zdCBleGFjdE1hdGNoUmVzb2x2ZWQgPSBleGFjdE1hdGNoID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBsZXQgcmVidWlsZENhY2hlID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMubGFzdFNlYXJjaEluZm8uc2VhcmNoVGV4dCAhPT0gdGV4dCB8fFxuICAgICAgICAgICAgdGhpcy5sYXN0U2VhcmNoSW5mby5jYXNlU2Vuc2l0aXZlICE9PSBjYXNlU2Vuc2l0aXZlUmVzb2x2ZWQgfHxcbiAgICAgICAgICAgIHRoaXMubGFzdFNlYXJjaEluZm8uZXhhY3RNYXRjaCAhPT0gZXhhY3RNYXRjaFJlc29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWFyY2hJbmZvID0ge1xuICAgICAgICAgICAgICAgIHNlYXJjaFRleHQ6IHRleHQsXG4gICAgICAgICAgICAgICAgYWN0aXZlTWF0Y2hJbmRleDogMCxcbiAgICAgICAgICAgICAgICBjYXNlU2Vuc2l0aXZlOiBjYXNlU2Vuc2l0aXZlUmVzb2x2ZWQsXG4gICAgICAgICAgICAgICAgZXhhY3RNYXRjaDogZXhhY3RNYXRjaFJlc29sdmVkLFxuICAgICAgICAgICAgICAgIG1hdGNoSW5mb0NhY2hlOiBbXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVidWlsZENhY2hlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlYXJjaEluZm8uYWN0aXZlTWF0Y2hJbmRleCArPSBpbmNyZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVidWlsZENhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLnJvd0xpc3QuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJvdy5jZWxscykge1xuICAgICAgICAgICAgICAgICAgICByb3cuY2VsbHMuZm9yRWFjaCgoYzogSWd4R3JpZENlbGxDb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuaGlnaGxpZ2h0VGV4dCh0ZXh0LCBjYXNlU2Vuc2l0aXZlUmVzb2x2ZWQsIGV4YWN0TWF0Y2hSZXNvbHZlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnJlYnVpbGRNYXRjaENhY2hlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYXN0U2VhcmNoSW5mby5hY3RpdmVNYXRjaEluZGV4ID49IHRoaXMubGFzdFNlYXJjaEluZm8ubWF0Y2hJbmZvQ2FjaGUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWFyY2hJbmZvLmFjdGl2ZU1hdGNoSW5kZXggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGFzdFNlYXJjaEluZm8uYWN0aXZlTWF0Y2hJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlYXJjaEluZm8uYWN0aXZlTWF0Y2hJbmRleCA9IHRoaXMubGFzdFNlYXJjaEluZm8ubWF0Y2hJbmZvQ2FjaGUubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhc3RTZWFyY2hJbmZvLm1hdGNoSW5mb0NhY2hlLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hJbmZvID0gdGhpcy5sYXN0U2VhcmNoSW5mby5tYXRjaEluZm9DYWNoZVt0aGlzLmxhc3RTZWFyY2hJbmZvLmFjdGl2ZU1hdGNoSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VhcmNoSW5mbyA9IHsgLi4udGhpcy5sYXN0U2VhcmNoSW5mbyB9O1xuXG4gICAgICAgICAgICBpZiAoc2Nyb2xsICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8obWF0Y2hJbmZvLnJvdywgbWF0Y2hJbmZvLmNvbHVtbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIElneFRleHRIaWdobGlnaHREaXJlY3RpdmUuc2V0QWN0aXZlSGlnaGxpZ2h0KHRoaXMuaWQsIHtcbiAgICAgICAgICAgICAgICBjb2x1bW46IG1hdGNoSW5mby5jb2x1bW4sXG4gICAgICAgICAgICAgICAgcm93OiBtYXRjaEluZm8ucm93LFxuICAgICAgICAgICAgICAgIGluZGV4OiBtYXRjaEluZm8uaW5kZXgsXG4gICAgICAgICAgICAgICAgbWV0YWRhdGE6IG1hdGNoSW5mby5tZXRhZGF0YSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBJZ3hUZXh0SGlnaGxpZ2h0RGlyZWN0aXZlLmNsZWFyQWN0aXZlSGlnaGxpZ2h0KHRoaXMuaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdFNlYXJjaEluZm8ubWF0Y2hJbmZvQ2FjaGUubGVuZ3RoO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVidWlsZE1hdGNoQ2FjaGUoKSB7XG4gICAgICAgIHRoaXMubGFzdFNlYXJjaEluZm8ubWF0Y2hJbmZvQ2FjaGUgPSBbXTtcblxuICAgICAgICBjb25zdCBjYXNlU2Vuc2l0aXZlID0gdGhpcy5sYXN0U2VhcmNoSW5mby5jYXNlU2Vuc2l0aXZlO1xuICAgICAgICBjb25zdCBleGFjdE1hdGNoID0gdGhpcy5sYXN0U2VhcmNoSW5mby5leGFjdE1hdGNoO1xuICAgICAgICBjb25zdCBzZWFyY2hUZXh0ID0gY2FzZVNlbnNpdGl2ZSA/IHRoaXMubGFzdFNlYXJjaEluZm8uc2VhcmNoVGV4dCA6IHRoaXMubGFzdFNlYXJjaEluZm8uc2VhcmNoVGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5maWx0ZXJlZFNvcnRlZERhdGE7XG4gICAgICAgIGNvbnN0IGNvbHVtbkl0ZW1zID0gdGhpcy52aXNpYmxlQ29sdW1ucy5maWx0ZXIoKGMpID0+ICFjLmNvbHVtbkdyb3VwKS5zb3J0KChjMSwgYzIpID0+IGMxLnZpc2libGVJbmRleCAtIGMyLnZpc2libGVJbmRleCk7XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZGF0YVJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbHVtbkl0ZW1zLmZvckVhY2goKGMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwaXBlQXJncyA9IHRoaXMuZ2V0Q29sdW1uQnlOYW1lKGMuZmllbGQpLnBpcGVBcmdzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYy5mb3JtYXR0ZXIgPyBjLmZvcm1hdHRlcihyZXNvbHZlTmVzdGVkUGF0aChkYXRhUm93LCBjLmZpZWxkKSwgZGF0YVJvdykgOlxuICAgICAgICAgICAgICAgICAgICBjLmRhdGFUeXBlID09PSAnbnVtYmVyJyA/IGZvcm1hdE51bWJlcihyZXNvbHZlTmVzdGVkUGF0aChkYXRhUm93LCBjLmZpZWxkKSwgdGhpcy5sb2NhbGUsIHBpcGVBcmdzLmRpZ2l0c0luZm8pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuZGF0YVR5cGUgPT09ICdkYXRlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZm9ybWF0RGF0ZShyZXNvbHZlTmVzdGVkUGF0aChkYXRhUm93LCBjLmZpZWxkKSwgcGlwZUFyZ3MuZm9ybWF0LCB0aGlzLmxvY2FsZSwgcGlwZUFyZ3MudGltZXpvbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiByZXNvbHZlTmVzdGVkUGF0aChkYXRhUm93LCBjLmZpZWxkKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBjLnNlYXJjaGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlYXJjaFZhbHVlID0gY2FzZVNlbnNpdGl2ZSA/IFN0cmluZyh2YWx1ZSkgOiBTdHJpbmcodmFsdWUpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4YWN0TWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2hWYWx1ZSA9PT0gc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5zZXQoJ3Bpbm5lZCcsIHRoaXMuaXNSZWNvcmRQaW5uZWRCeUluZGV4KHJvd0luZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VhcmNoSW5mby5tYXRjaEluZm9DYWNoZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiBkYXRhUm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGMuZmllbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvY2N1cmVuY2VJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VhcmNoSW5kZXggPSBzZWFyY2hWYWx1ZS5pbmRleE9mKHNlYXJjaFRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc2VhcmNoSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLnNldCgncGlubmVkJywgdGhpcy5pc1JlY29yZFBpbm5lZEJ5SW5kZXgocm93SW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWFyY2hJbmZvLm1hdGNoSW5mb0NhY2hlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IGRhdGFSb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogYy5maWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IG9jY3VyZW5jZUluZGV4KyssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoVmFsdWUgPSBzZWFyY2hWYWx1ZS5zdWJzdHJpbmcoc2VhcmNoSW5kZXggKyBzZWFyY2hUZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoSW5kZXggPSBzZWFyY2hWYWx1ZS5pbmRleE9mKHNlYXJjaFRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRPRE86IEFib3V0IHRvIE1vdmUgdG8gQ1JVRFxuICAgIHByaXZhdGUgY29uZmlndXJlUm93RWRpdGluZ092ZXJsYXkocm93SUQ6IGFueSwgdXNlT3V0ZXIgPSBmYWxzZSkge1xuICAgICAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnJvd0VkaXRTZXR0aW5ncztcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMub3ZlcmxheVNlcnZpY2UuZ2V0T3ZlcmxheUJ5SWQodGhpcy5yb3dFZGl0aW5nT3ZlcmxheS5vdmVybGF5SWQpO1xuICAgICAgICBpZiAob3ZlcmxheSkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSBvdmVybGF5LnNldHRpbmdzO1xuICAgICAgICB9XG4gICAgICAgIHNldHRpbmdzLm91dGxldCA9IHVzZU91dGVyID8gdGhpcy5wYXJlbnRSb3dPdXRsZXREaXJlY3RpdmUgOiB0aGlzLnJvd091dGxldERpcmVjdGl2ZTtcbiAgICAgICAgdGhpcy5yb3dFZGl0UG9zaXRpb25pbmdTdHJhdGVneS5zZXR0aW5ncy5jb250YWluZXIgPSB0aGlzLnRib2R5Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHBpbm5lZCA9IHRoaXMuX3Bpbm5lZFJlY29yZElEcy5pbmRleE9mKHJvd0lEKSAhPT0gLTE7XG4gICAgICAgIGNvbnN0IHRhcmdldFJvdyA9ICFwaW5uZWQgP1xuICAgICAgICAgICAgdGhpcy5ncmlkQVBJLmdldF9yb3dfYnlfa2V5KHJvd0lEKSBhcyBJZ3hSb3dEaXJlY3RpdmVcbiAgICAgICAgICAgIDogdGhpcy5waW5uZWRSb3dzLmZpbmQoeCA9PiB4LmtleSA9PT0gcm93SUQpIGFzIElneFJvd0RpcmVjdGl2ZTtcbiAgICAgICAgaWYgKCF0YXJnZXRSb3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXR0aW5ncy50YXJnZXQgPSB0YXJnZXRSb3cuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICB0aGlzLnRvZ2dsZVJvd0VkaXRpbmdPdmVybGF5KHRydWUpO1xuICAgIH1cbn1cbiJdfQ==