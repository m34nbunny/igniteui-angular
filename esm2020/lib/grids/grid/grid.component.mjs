import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ContentChild, ViewChildren, QueryList, ViewChild, TemplateRef, HostBinding, ContentChildren } from '@angular/core';
import { IgxGridBaseDirective } from '../grid-base.directive';
import { IgxGridNavigationService } from '../grid-navigation.service';
import { IgxGridAPIService } from './grid-api.service';
import { cloneArray } from '../../core/utils';
import { IgxGroupByRowTemplateDirective, IgxGridDetailTemplateDirective } from './grid.directives';
import { IgxGridGroupByRowComponent } from './groupby-row.component';
import { takeUntil } from 'rxjs/operators';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { IgxColumnResizingService } from '../resizing/resizing.service';
import { IgxGridSummaryService } from '../summaries/grid-summary.service';
import { IgxGridSelectionService } from '../selection/selection.service';
import { IgxForOfSyncService, IgxForOfScrollSyncService } from '../../directives/for-of/for_of.sync.service';
import { IgxGridMRLNavigationService } from '../grid-mrl-navigation.service';
import { FilterMode, GridInstanceType } from '../common/enums';
import { IGX_GRID_BASE, IGX_GRID_SERVICE_BASE } from '../common/grid.interface';
import { IgxGroupByRowSelectorDirective } from '../selection/row-selectors';
import { IgxGridCRUDService } from '../common/crud.service';
import { IgxGridRow, IgxGroupByRow, IgxSummaryRow } from '../grid-public-row';
import { IgxGridGroupByAreaComponent } from '../grouping/grid-group-by-area.component';
import { IgxGridCell } from '../grid-public-cell';
import * as i0 from "@angular/core";
import * as i1 from "../grouping/grid-group-by-area.component";
import * as i2 from "../headers/grid-header-row.component";
import * as i3 from "./grid-row.component";
import * as i4 from "./groupby-row.component";
import * as i5 from "../summaries/summary-row.component";
import * as i6 from "../../progressbar/progressbar.component";
import * as i7 from "../../snackbar/snackbar.component";
import * as i8 from "../../icon/icon.component";
import * as i9 from "../resizing/resizer.component";
import * as i10 from "@angular/common";
import * as i11 from "../grid.common";
import * as i12 from "../selection/drag-select.directive";
import * as i13 from "../moving/moving.drop.directive";
import * as i14 from "../../directives/for-of/for_of.directive";
import * as i15 from "../../directives/template-outlet/template_outlet.directive";
import * as i16 from "../../directives/toggle/toggle.directive";
import * as i17 from "../../directives/button/button.directive";
import * as i18 from "../../directives/ripple/ripple.directive";
import * as i19 from "../grid.rowEdit.directive";
import * as i20 from "./grid.pipes";
import * as i21 from "../common/pipes";
import * as i22 from "./grid.details.pipe";
import * as i23 from "./grid.summary.pipe";
import * as i24 from "../summaries/grid-root-summary.pipe";
let NEXT_ID = 0;
/**
 * Grid provides a way to present and manipulate tabular data.
 *
 * @igxModule IgxGridModule
 * @igxGroup Grids & Lists
 * @igxKeywords grid, table
 * @igxTheme igx-grid-theme
 * @remarks
 * The Ignite UI Grid is used for presenting and manipulating tabular data in the simplest way possible.  Once data
 * has been bound, it can be manipulated through filtering, sorting & editing operations.
 * @example
 * ```html
 * <igx-grid [data]="employeeData" [autoGenerate]="false">
 *   <igx-column field="first" header="First Name"></igx-column>
 *   <igx-column field="last" header="Last Name"></igx-column>
 *   <igx-column field="role" header="Role"></igx-column>
 * </igx-grid>
 * ```
 */
export class IgxGridComponent extends IgxGridBaseDirective {
    constructor() {
        super(...arguments);
        /**
         * Emitted when a new chunk of data is loaded from virtualization.
         *
         * @example
         * ```typescript
         *  <igx-grid #grid [data]="localData" [autoGenerate]="true" (dataPreLoad)='handleDataPreloadEvent()'></igx-grid>
         * ```
         */
        this.dataPreLoad = new EventEmitter();
        /**
         * @hidden
         */
        this.groupingExpressionsChange = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.groupingExpansionStateChange = new EventEmitter();
        /**
         * Emitted when columns are grouped/ungrouped.
         *
         * @remarks
         * The `onGroupingDone` event would be raised only once if several columns get grouped at once by calling
         * the `groupBy()` or `clearGrouping()` API methods and passing an array as an argument.
         * The event arguments provide the `expressions`, `groupedColumns` and `ungroupedColumns` properties, which contain
         * the `ISortingExpression` and the `IgxColumnComponent` related to the grouping/ungrouping operation.
         * Please note that `groupedColumns` and `ungroupedColumns` show only the **newly** changed columns (affected by the **last**
         * grouping/ungrouping operation), not all columns which are currently grouped/ungrouped.
         * columns.
         * @example
         * ```html
         * <igx-grid #grid [data]="localData" (onGroupingDone)="groupingDone($event)" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.onGroupingDone = new EventEmitter();
        /**
         * Gets/Sets whether created groups are rendered expanded or collapsed.
         *
         * @remarks
         * The default rendered state is expanded.
         * @example
         * ```html
         * <igx-grid #grid [data]="Data" [groupsExpanded]="false" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.groupsExpanded = true;
        /**
         * @hidden @internal
         */
        this.detailTemplate = new QueryList();
        /**
         * @hidden @internal
         */
        this.role = 'grid';
        /**
         * Gets/Sets the value of the `id` attribute.
         *
         * @remarks
         * If not provided it will be automatically generated.
         * @example
         * ```html
         * <igx-grid [id]="'igx-grid-1'" [data]="Data" [autoGenerate]="true"></igx-grid>
         * ```
         */
        this.id = `igx-grid-${NEXT_ID++}`;
        /**
         * Gets the hierarchical representation of the group by records.
         *
         * @example
         * ```typescript
         * let groupRecords = this.grid.groupsRecords;
         * ```
         */
        this.groupsRecords = [];
        /**
         * @hidden
         */
        this._groupingExpressions = [];
        /**
         * @hidden
         */
        this._groupingExpandState = [];
        this._hideGroupedColumns = false;
        this._dropAreaMessage = null;
        this._showGroupArea = true;
        this._filteredData = null;
        this.childDetailTemplates = new Map();
    }
    /**
     * Gets/Sets the array of data that populates the `IgxGridComponent`.
     *
     * @example
     * ```html
     * <igx-grid [data]="Data" [autoGenerate]="true"></igx-grid>
     * ```
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
        if (this.isPercentHeight) {
            this.notifyChanges(true);
        }
    }
    /**
     * Gets/Sets an array of objects containing the filtered data.
     *
     * @example
     * ```typescript
     * let filteredData = this.grid.filteredData;
     * this.grid.filteredData = [...];
     * ```
     */
    get filteredData() {
        return this._filteredData;
    }
    set filteredData(value) {
        this._filteredData = value;
    }
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
    set totalItemCount(count) {
        this.verticalScrollContainer.totalItemCount = count;
        this.cdr.detectChanges();
    }
    get totalItemCount() {
        return this.verticalScrollContainer.totalItemCount;
    }
    get _gridAPI() {
        return this.gridAPI;
    }
    /**
     * Gets/Sets the group by state.
     *
     * @example
     * ```typescript
     * let groupByState = this.grid.groupingExpressions;
     * this.grid.groupingExpressions = [...];
     * ```
     * @remarks
     * Supports two-way data binding.
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true" [(groupingExpressions)]="model.groupingExpressions"></igx-grid>
     * ```
     */
    get groupingExpressions() {
        return this._groupingExpressions;
    }
    set groupingExpressions(value) {
        if (this.groupingExpressions === value) {
            return;
        }
        if (value && value.length > 10) {
            throw Error('Maximum amount of grouped columns is 10.');
        }
        const oldExpressions = this.groupingExpressions;
        const newExpressions = value;
        this._groupingExpressions = cloneArray(value);
        this.groupingExpressionsChange.emit(this._groupingExpressions);
        if (this._gridAPI.grid) {
            /* grouping should work in conjunction with sorting
            and without overriding separate sorting expressions */
            this._applyGrouping();
            this._gridAPI.arrange_sorting_expressions();
            this.notifyChanges();
        }
        else {
            // setter called before grid is registered in grid API service
            this.sortingExpressions.unshift.apply(this.sortingExpressions, this._groupingExpressions);
        }
        if (!this._init && JSON.stringify(oldExpressions) !== JSON.stringify(newExpressions) && this.columnList) {
            const groupedCols = [];
            const ungroupedCols = [];
            const groupedColsArr = newExpressions.filter((obj) => !oldExpressions.some((obj2) => obj.fieldName === obj2.fieldName));
            groupedColsArr.forEach((elem) => {
                groupedCols.push(this.getColumnByName(elem.fieldName));
            }, this);
            const ungroupedColsArr = oldExpressions.filter((obj) => !newExpressions.some((obj2) => obj.fieldName === obj2.fieldName));
            ungroupedColsArr.forEach((elem) => {
                ungroupedCols.push(this.getColumnByName(elem.fieldName));
            }, this);
            this.notifyChanges();
            const groupingDoneArgs = {
                expressions: newExpressions,
                groupedColumns: groupedCols,
                ungroupedColumns: ungroupedCols
            };
            this.onGroupingDone.emit(groupingDoneArgs);
        }
    }
    /**
     * Gets/Sets a list of expansion states for group rows.
     *
     * @remarks
     * Includes only states that differ from the default one (controlled through groupsExpanded and states that the user has changed.
     * Contains the expansion state (expanded: boolean) and the unique identifier for the group row (Array).
     * Supports two-way data binding.
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [autoGenerate]="true" [(groupingExpansionState)]="model.groupingExpansionState"></igx-grid>
     * ```
     */
    get groupingExpansionState() {
        return this._groupingExpandState;
    }
    set groupingExpansionState(value) {
        if (value !== this._groupingExpandState) {
            this.groupingExpansionStateChange.emit(value);
        }
        this._groupingExpandState = value;
        if (this.gridAPI.grid) {
            this.cdr.detectChanges();
        }
    }
    /**
     * Gets/Sets whether the grouped columns should be hidden.
     *
     * @remarks
     * The default value is "false"
     * @example
     * ```html
     * <igx-grid #grid [data]="localData" [hideGroupedColumns]="true" [autoGenerate]="true"></igx-grid>
     * ```
     */
    get hideGroupedColumns() {
        return this._hideGroupedColumns;
    }
    set hideGroupedColumns(value) {
        if (value) {
            this.groupingDiffer = this.differs.find(this.groupingExpressions).create();
        }
        else {
            this.groupingDiffer = null;
        }
        if (this.columnList && this.groupingExpressions) {
            this._setGroupColsVisibility(value);
        }
        this._hideGroupedColumns = value;
    }
    /**
     * Gets/Sets the grouping strategy of the grid.
     *
     * @remarks The default IgxGrouping extends from IgxSorting and a custom one can be used as a `sortStrategy` as well.
     *
     * @example
     * ```html
     *  <igx-grid #grid [data]="localData" [groupStrategy]="groupStrategy"></igx-grid>
     * ```
     */
    get groupStrategy() {
        return this._groupStrategy;
    }
    set groupStrategy(value) {
        this._groupStrategy = value;
    }
    /**
     * Gets/Sets the message displayed inside the GroupBy drop area where columns can be dragged on.
     *
     * @remarks
     * The grid needs to have at least one groupable column in order the GroupBy area to be displayed.
     * @example
     * ```html
     * <igx-grid dropAreaMessage="Drop here to group!">
     *      <igx-column [groupable]="true" field="ID"></igx-column>
     * </igx-grid>
     * ```
     */
    set dropAreaMessage(value) {
        this._dropAreaMessage = value;
        this.notifyChanges();
    }
    get dropAreaMessage() {
        return this._dropAreaMessage || this.resourceStrings.igx_grid_groupByArea_message;
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
        if (row && row instanceof IgxGridRow && !row.data?.detailsData && column) {
            return new IgxGridCell(this, rowIndex, column.field);
        }
    }
    /**
     * Gets the list of group rows.
     *
     * @example
     * ```typescript
     * const groupList = this.grid.groupsRowList;
     * ```
     */
    get groupsRowList() {
        const res = new QueryList();
        if (!this._groupsRowList) {
            return res;
        }
        const rList = this._groupsRowList.filter(item => item.element.nativeElement.parentElement !== null)
            .sort((item1, item2) => item1.index - item2.index);
        res.reset(rList);
        return res;
    }
    /**
     * @hidden
     * @internal
     */
    get groupByRowSelectorTemplate() {
        if (this.groupByRowSelectorsTemplates && this.groupByRowSelectorsTemplates.first) {
            return this.groupByRowSelectorsTemplates.first.templateRef;
        }
        return null;
    }
    /**
     * @hidden @internal
     */
    getDetailsContext(rowData, index) {
        return {
            $implicit: rowData,
            index
        };
    }
    /**
     * @hidden @internal
     */
    detailsViewFocused(container, rowIndex) {
        this.navigation.setActiveNode({ row: rowIndex });
    }
    /**
     * @hidden @internal
     */
    get hasDetails() {
        return !!this.detailTemplate.length;
    }
    /**
     * @hidden @internal
     */
    getRowTemplate(rowData) {
        if (this.isGroupByRecord(rowData)) {
            return this.defaultGroupTemplate;
        }
        else if (this.isSummaryRow(rowData)) {
            return this.summaryTemplate;
        }
        else if (this.hasDetails && this.isDetailRecord(rowData)) {
            return this.detailTemplateContainer;
        }
        else {
            return this.recordTemplate;
        }
    }
    /**
     * @hidden @internal
     */
    isDetailRecord(record) {
        return record && record.detailsData !== undefined;
    }
    /**
     * @hidden @internal
     */
    isDetailActive(rowIndex) {
        return this.navigation.activeNode ? this.navigation.activeNode.row === rowIndex : false;
    }
    /**
     * Gets/Sets the template reference for the group row.
     *
     * @example
     * ```
     * const groupRowTemplate = this.grid.groupRowTemplate;
     * this.grid.groupRowTemplate = myRowTemplate;
     * ```
     */
    get groupRowTemplate() {
        return this._groupRowTemplate;
    }
    set groupRowTemplate(template) {
        this._groupRowTemplate = template;
        this.notifyChanges();
    }
    /**
     * Gets/Sets the template reference of the `IgxGridComponent`'s group area.
     *
     * @example
     * ```typescript
     * const groupAreaTemplate = this.grid.groupAreaTemplate;
     * this.grid.groupAreaTemplate = myAreaTemplate.
     * ```
     */
    get groupAreaTemplate() {
        return this._groupAreaTemplate;
    }
    set groupAreaTemplate(template) {
        this._groupAreaTemplate = template;
        this.notifyChanges();
    }
    /**
     * Groups by a new `IgxColumnComponent` based on the provided expression, or modifies an existing one.
     *
     * @remarks
     * Also allows for multiple columns to be grouped at once if an array of `ISortingExpression` is passed.
     * The onGroupingDone event would get raised only **once** if this method gets called multiple times with the same arguments.
     * @example
     * ```typescript
     * this.grid.groupBy({ fieldName: name, dir: SortingDirection.Asc, ignoreCase: false });
     * this.grid.groupBy([
     *     { fieldName: name1, dir: SortingDirection.Asc, ignoreCase: false },
     *     { fieldName: name2, dir: SortingDirection.Desc, ignoreCase: true },
     *     { fieldName: name3, dir: SortingDirection.Desc, ignoreCase: false }
     * ]);
     * ```
     */
    groupBy(expression) {
        if (this.checkIfNoColumnField(expression)) {
            return;
        }
        this.crudService.endEdit(false);
        if (expression instanceof Array) {
            this._gridAPI.groupBy_multiple(expression);
        }
        else {
            this._gridAPI.groupBy(expression);
        }
        this.notifyChanges(true);
    }
    /**
     * Clears grouping for particular column, array of columns or all columns.
     *
     * @remarks
     * Clears all grouping in the grid, if no parameter is passed.
     * If a parameter is provided, clears grouping for a particular column or an array of columns.
     * @example
     * ```typescript
     * this.grid.clearGrouping(); //clears all grouping
     * this.grid.clearGrouping("ID"); //ungroups a single column
     * this.grid.clearGrouping(["ID", "Column1", "Column2"]); //ungroups multiple columns
     * ```
     * @param name Name of column or array of column names to be ungrouped.
     */
    clearGrouping(name) {
        this._gridAPI.clear_groupby(name);
        this.calculateGridSizes();
        this.notifyChanges(true);
    }
    /**
     * Returns if a group is expanded or not.
     *
     * @param group The group record.
     * @example
     * ```typescript
     * public groupRow: IGroupByRecord;
     * const expandedGroup = this.grid.isExpandedGroup(this.groupRow);
     * ```
     */
    isExpandedGroup(group) {
        const state = this._getStateForGroupRow(group);
        return state ? state.expanded : this.groupsExpanded;
    }
    /**
     * Toggles the expansion state of a group.
     *
     * @param groupRow The group record to toggle.
     * @example
     * ```typescript
     * public groupRow: IGroupByRecord;
     * const toggleExpGroup = this.grid.toggleGroup(this.groupRow);
     * ```
     */
    toggleGroup(groupRow) {
        this._toggleGroup(groupRow);
        this.notifyChanges();
    }
    /**
     * Select all rows within a group.
     *
     * @param groupRow: The group record which rows would be selected.
     * @param clearCurrentSelection if true clears the current selection
     * @example
     * ```typescript
     * this.grid.selectRowsInGroup(this.groupRow, true);
     * ```
     */
    selectRowsInGroup(groupRow, clearPrevSelection) {
        this._gridAPI.groupBy_select_all_rows_in_group(groupRow, clearPrevSelection);
        this.notifyChanges();
    }
    /**
     * Deselect all rows within a group.
     *
     * @param groupRow The group record which rows would be deselected.
     * @example
     * ```typescript
     * public groupRow: IGroupByRecord;
     * this.grid.deselectRowsInGroup(this.groupRow);
     * ```
     */
    deselectRowsInGroup(groupRow) {
        this._gridAPI.groupBy_deselect_all_rows_in_group(groupRow);
        this.notifyChanges();
    }
    /**
     * Expands the specified group and all of its parent groups.
     *
     * @param groupRow The group record to fully expand.
     * @example
     * ```typescript
     * public groupRow: IGroupByRecord;
     * this.grid.fullyExpandGroup(this.groupRow);
     * ```
     */
    fullyExpandGroup(groupRow) {
        this._fullyExpandGroup(groupRow);
        this.notifyChanges();
    }
    /**
     * @hidden @internal
     */
    isGroupByRecord(record) {
        // return record.records instance of GroupedRecords fails under Webpack
        return record && record?.records && record.records?.length &&
            record.expression && record.expression?.fieldName;
    }
    /**
     * Toggles the expansion state of all group rows recursively.
     *
     * @example
     * ```typescript
     * this.grid.toggleAllGroupRows;
     * ```
     */
    toggleAllGroupRows() {
        this.groupingExpansionState = [];
        this.groupsExpanded = !this.groupsExpanded;
        this.notifyChanges();
    }
    /**
     * Returns if the `IgxGridComponent` has groupable columns.
     *
     * @example
     * ```typescript
     * const groupableGrid = this.grid.hasGroupableColumns;
     * ```
     */
    get hasGroupableColumns() {
        return this.columnList.some((col) => col.groupable && !col.columnGroup);
    }
    /**
     * Returns whether the `IgxGridComponent` has group area.
     *
     * @example
     * ```typescript
     * let isGroupAreaVisible = this.grid.showGroupArea;
     * ```
     *
     * @example
     * ```html
     * <igx-grid #grid [data]="Data" [showGroupArea]="false"></igx-grid>
     * ```
     */
    get showGroupArea() {
        return this._showGroupArea;
    }
    set showGroupArea(value) {
        this._showGroupArea = value;
        this.notifyChanges(true);
    }
    /**
     * Gets if the grid's group by drop area is visible.
     *
     * @example
     * ```typescript
     * const dropVisible = this.grid.dropAreaVisible;
     * ```
     */
    get dropAreaVisible() {
        return this.columnInDrag?.groupable || !this.groupingExpressions.length;
    }
    /**
     * @hidden @internal
     */
    isColumnGrouped(fieldName) {
        return this.groupingExpressions.find(exp => exp.fieldName === fieldName) ? true : false;
    }
    /**
     * @hidden @internal
     */
    getContext(rowData, rowIndex, pinned) {
        if (this.isDetailRecord(rowData)) {
            const cachedData = this.childDetailTemplates.get(rowData.detailsData);
            const rowID = this.primaryKey ? rowData.detailsData[this.primaryKey] : rowData.detailsData;
            if (cachedData) {
                const view = cachedData.view;
                const tmlpOutlet = cachedData.owner;
                return {
                    $implicit: rowData.detailsData,
                    moveView: view,
                    owner: tmlpOutlet,
                    index: this.dataView.indexOf(rowData),
                    templateID: {
                        type: 'detailRow',
                        id: rowID
                    }
                };
            }
            else {
                // child rows contain unique grids, hence should have unique templates
                return {
                    $implicit: rowData.detailsData,
                    templateID: {
                        type: 'detailRow',
                        id: rowID
                    },
                    index: this.dataView.indexOf(rowData)
                };
            }
        }
        return {
            $implicit: this.isGhostRecord(rowData) ? rowData.recordRef : rowData,
            index: this.getDataViewIndex(rowIndex, pinned),
            templateID: {
                type: this.isGroupByRecord(rowData) ? 'groupRow' : this.isSummaryRow(rowData) ? 'summaryRow' : 'dataRow',
                id: null
            },
            disabled: this.isGhostRecord(rowData)
        };
    }
    /**
     * @hidden @internal
     */
    viewCreatedHandler(args) {
        if (args.context.templateID.type === 'detailRow') {
            this.childDetailTemplates.set(args.context.$implicit, args);
        }
    }
    /**
     * @hidden @internal
     */
    viewMovedHandler(args) {
        if (args.context.templateID.type === 'detailRow') {
            // view was moved, update owner in cache
            const key = args.context.$implicit;
            const cachedData = this.childDetailTemplates.get(key);
            cachedData.owner = args.owner;
        }
    }
    /**
     * @hidden @internal
     */
    get iconTemplate() {
        if (this.groupsExpanded) {
            return this.headerExpandIndicatorTemplate || this.defaultExpandedTemplate;
        }
        else {
            return this.headerCollapseIndicatorTemplate || this.defaultCollapsedTemplate;
        }
    }
    /**
     * @hidden @internal
     */
    ngAfterContentInit() {
        super.ngAfterContentInit();
        if (this.allowFiltering && this.hasColumnLayouts) {
            this.filterMode = FilterMode.excelStyleFilter;
        }
        if (this.groupTemplate) {
            this._groupRowTemplate = this.groupTemplate.template;
        }
        this.detailTemplate.changes.subscribe(() => this.trackChanges = (_, rec) => (rec?.detailsData !== undefined ? rec.detailsData : rec));
        if (this.hideGroupedColumns && this.columnList && this.groupingExpressions) {
            this._setGroupColsVisibility(this.hideGroupedColumns);
        }
        this._setupNavigationService();
    }
    /**
     * @hidden @internal
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.verticalScrollContainer.beforeViewDestroyed.pipe(takeUntil(this.destroy$)).subscribe((view) => {
            const rowData = view.context.$implicit;
            if (this.isDetailRecord(rowData)) {
                const cachedData = this.childDetailTemplates.get(rowData.detailsData);
                if (cachedData) {
                    const tmlpOutlet = cachedData.owner;
                    tmlpOutlet._viewContainerRef.detach(0);
                }
            }
        });
        this.sortingExpressionsChange.pipe(takeUntil(this.destroy$)).subscribe((sortingExpressions) => {
            if (!this.groupingExpressions || !this.groupingExpressions.length) {
                return;
            }
            sortingExpressions.forEach((sortExpr) => {
                const fieldName = sortExpr.fieldName;
                const groupingExpr = this.groupingExpressions.find(ex => ex.fieldName === fieldName);
                if (groupingExpr) {
                    groupingExpr.dir = sortExpr.dir;
                }
            });
        });
    }
    /**
     * @hidden @internal
     */
    ngOnInit() {
        super.ngOnInit();
        this.onGroupingDone.pipe(takeUntil(this.destroy$)).subscribe((args) => {
            this.crudService.endEdit(false);
            this.summaryService.updateSummaryCache(args);
            this._headerFeaturesWidth = NaN;
        });
    }
    /**
     * @hidden @internal
     */
    ngDoCheck() {
        if (this.groupingDiffer && this.columnList && !this.hasColumnLayouts) {
            const changes = this.groupingDiffer.diff(this.groupingExpressions);
            if (changes && this.columnList.length > 0) {
                changes.forEachAddedItem((rec) => {
                    const col = this.getColumnByName(rec.item.fieldName);
                    if (col) {
                        col.hidden = true;
                    }
                });
                changes.forEachRemovedItem((rec) => {
                    const col = this.getColumnByName(rec.item.fieldName);
                    col.hidden = false;
                });
            }
        }
        super.ngDoCheck();
    }
    /**
     * @hidden @internal
     */
    dataLoading(event) {
        this.dataPreLoad.emit(event);
    }
    /**
     * @inheritdoc
     */
    getSelectedData(formatters = false, headers = false) {
        if (this.groupingExpressions.length || this.hasDetails) {
            const source = [];
            const process = (record) => {
                if (record.expression || record.summaries || this.isDetailRecord(record)) {
                    source.push(null);
                    return;
                }
                source.push(record);
            };
            this.dataView.forEach(process);
            return this.extractDataFromSelection(source, formatters, headers);
        }
        else {
            return super.getSelectedData(formatters, headers);
        }
    }
    /**
     * Returns the `IgxGridRow` by index.
     *
     * @example
     * ```typescript
     * const myRow = grid.getRowByIndex(1);
     * ```
     * @param index
     */
    getRowByIndex(index) {
        let row;
        if (index < 0) {
            return undefined;
        }
        if (this.dataView.length >= this.virtualizationState.startIndex + this.virtualizationState.chunkSize) {
            row = this.createRow(index);
        }
        else {
            if (!(index < this.virtualizationState.startIndex) && !(index > this.virtualizationState.startIndex + this.virtualizationState.chunkSize)) {
                row = this.createRow(index);
            }
        }
        if (this.gridAPI.grid.pagingMode === 1 && this.gridAPI.grid.page !== 0) {
            row.index = index + this.paginator.perPage * this.paginator.page;
        }
        return row;
    }
    /**
     * Returns `IgxGridRow` object by the specified primary key.
     *
     * @remarks
     * Requires that the `primaryKey` property is set.
     * @example
     * ```typescript
     * const myRow = this.grid1.getRowByKey("cell5");
     * ```
     * @param keyValue
     */
    getRowByKey(key) {
        const rec = this.filteredSortedData ? this.primaryKey ?
            this.filteredSortedData.find(record => record[this.primaryKey] === key) :
            this.filteredSortedData.find(record => record === key) : undefined;
        const index = this.dataView.indexOf(rec);
        if (index < 0 || index > this.dataView.length) {
            return undefined;
        }
        return new IgxGridRow(this, index, rec);
    }
    /**
     * @hidden @internal
     */
    allRows() {
        return this.dataView.map((rec, index) => {
            this.pagingMode === 1 && this.paginator.page !== 0 ? index = index + this.paginator.perPage * this.paginator.page : index = this.dataRowList.first.index + index;
            return this.createRow(index);
        });
    }
    /**
     * Returns the collection of `IgxGridRow`s for current page.
     *
     * @hidden @internal
     */
    dataRows() {
        return this.allRows().filter(row => row instanceof IgxGridRow);
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
        if (row && row instanceof IgxGridRow && !row.data?.detailsData && column) {
            if (this.pagingMode === 1 && this.gridAPI.grid.page !== 0) {
                row.index = rowIndex + this.paginator.perPage * this.paginator.page;
            }
            return new IgxGridCell(this, row.index, columnField);
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
    /**
     * @hidden @internal
     */
    createRow(index, data) {
        let row;
        let rec;
        const dataIndex = this._getDataViewIndex(index);
        rec = data ?? this.dataView[dataIndex];
        if (rec && this.isGroupByRecord(rec)) {
            row = new IgxGroupByRow(this, index, rec);
        }
        if (rec && this.isSummaryRow(rec)) {
            row = new IgxSummaryRow(this, index, rec.summaries, GridInstanceType.Grid);
        }
        // if found record is a no a groupby or summary row, return IgxGridRow instance
        if (!row && rec) {
            row = new IgxGridRow(this, index, rec);
        }
        return row;
    }
    /**
     * @hidden @internal
     */
    get defaultTargetBodyHeight() {
        const allItems = this.totalItemCount || this.dataLength;
        return this.renderedRowHeight * Math.min(this._defaultTargetRecordNumber, this.paginator ? Math.min(allItems, this.paginator.perPage) : allItems);
    }
    /**
     * @hidden @internal
     */
    getGroupAreaHeight() {
        return this.groupArea ? this.getComputedHeight(this.groupArea.nativeElement) : 0;
    }
    /**
     * @hidden @internal
     */
    scrollTo(row, column) {
        if (this.groupingExpressions && this.groupingExpressions.length
            && typeof (row) !== 'number') {
            const rowIndex = this.groupingResult.indexOf(row);
            const groupByRecord = this.groupingMetadata[rowIndex];
            if (groupByRecord) {
                this._fullyExpandGroup(groupByRecord);
            }
        }
        super.scrollTo(row, column, this.groupingFlatResult);
    }
    /**
     * @hidden @internal
     */
    _getStateForGroupRow(groupRow) {
        return this._gridAPI.groupBy_get_expanded_for_group(groupRow);
    }
    /**
     * @hidden
     */
    _toggleGroup(groupRow) {
        this._gridAPI.groupBy_toggle_group(groupRow);
    }
    /**
     * @hidden @internal
     */
    _fullyExpandGroup(groupRow) {
        this._gridAPI.groupBy_fully_expand_group(groupRow);
    }
    /**
     * @hidden @internal
     */
    _applyGrouping() {
        this._gridAPI.sort_multiple(this._groupingExpressions);
    }
    _setupNavigationService() {
        if (this.hasColumnLayouts) {
            this.navigation = new IgxGridMRLNavigationService(this.platform);
            this.navigation.grid = this;
        }
    }
    checkIfNoColumnField(expression) {
        if (expression instanceof Array) {
            for (const singleExpression of expression) {
                if (!singleExpression.fieldName) {
                    return true;
                }
            }
            return false;
        }
        return !expression.fieldName;
    }
    _setGroupColsVisibility(value) {
        if (this.columnList.length > 0 && !this.hasColumnLayouts) {
            this.groupingExpressions.forEach((expr) => {
                const col = this.getColumnByName(expr.fieldName);
                col.hidden = value;
            });
        }
    }
}
IgxGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridComponent, selector: "igx-grid", inputs: { groupsExpanded: "groupsExpanded", dropAreaTemplate: "dropAreaTemplate", id: "id", data: "data", groupingExpressions: "groupingExpressions", groupingExpansionState: "groupingExpansionState", hideGroupedColumns: "hideGroupedColumns", groupStrategy: "groupStrategy", dropAreaMessage: "dropAreaMessage", showGroupArea: "showGroupArea" }, outputs: { dataPreLoad: "dataPreLoad", groupingExpressionsChange: "groupingExpressionsChange", groupingExpansionStateChange: "groupingExpansionStateChange", onGroupingDone: "onGroupingDone" }, host: { properties: { "attr.role": "this.role", "attr.id": "this.id" } }, providers: [
        IgxGridCRUDService,
        IgxGridNavigationService,
        IgxGridSummaryService,
        IgxGridSelectionService,
        { provide: IGX_GRID_SERVICE_BASE, useClass: IgxGridAPIService },
        { provide: IGX_GRID_BASE, useExisting: IgxGridComponent },
        IgxFilteringService,
        IgxColumnResizingService,
        IgxForOfSyncService,
        IgxForOfScrollSyncService
    ], queries: [{ propertyName: "groupTemplate", first: true, predicate: IgxGroupByRowTemplateDirective, descendants: true, read: IgxGroupByRowTemplateDirective }, { propertyName: "detailTemplate", predicate: IgxGridDetailTemplateDirective, read: TemplateRef }, { propertyName: "groupByRowSelectorsTemplates", predicate: IgxGroupByRowSelectorDirective, read: IgxGroupByRowSelectorDirective }], viewQueries: [{ propertyName: "groupArea", first: true, predicate: IgxGridGroupByAreaComponent, descendants: true }, { propertyName: "recordTemplate", first: true, predicate: ["record_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "detailTemplateContainer", first: true, predicate: ["detail_template_container"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultGroupTemplate", first: true, predicate: ["group_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "summaryTemplate", first: true, predicate: ["summary_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "_groupsRowList", predicate: IgxGridGroupByRowComponent, descendants: true, read: IgxGridGroupByRowComponent }], usesInheritance: true, ngImport: i0, template: "<!-- Toolbar area -->\n<ng-content select=\"igx-grid-toolbar\"></ng-content>\n\n<!-- Group-by area -->\n<ng-container *ngIf=\"showGroupArea && (groupingExpressions.length > 0 || hasGroupableColumns)\">\n    <igx-grid-group-by-area #groupArea [style.flex-basis.px]='outerWidth'\n        [grid]=\"this\"\n        [expressions]=\"groupingExpressions\"\n        [sortingExpressions]=\"sortingExpressions\"\n        [density]=\"displayDensity\"\n        [dropAreaTemplate]=\"dropAreaTemplate\"\n        [dropAreaMessage]=\"dropAreaMessage\"\n    >\n    </igx-grid-group-by-area>\n</ng-container>\n\n<!-- Grid table head row area -->\n<igx-grid-header-row class=\"igx-grid-thead\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [density]=\"displayDensity\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (scroll)=\"preventHeaderScroll($event)\"\n    (focus)=\"navigation.focusFirstCell()\"\n>\n</igx-grid-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <div class=\"igx-grid__tbody-content\" tabindex=\"0\" [attr.role]=\"dataView.length ? null : 'row'\" (keydown)=\"navigation.handleNavigation($event)\" (focus)=\"navigation.focusTbody($event)\"\n        (dragStop)=\"selectionService.dragMode = $event\" (scroll)='preventContainerScroll($event)'\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth || null' #tbody [attr.aria-activedescendant]=\"activeDescendant\">\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n    <ng-container *ngTemplateOutlet=\"hasPinnedRecords && isRowPinningToTop ? pinnedRecordsTemplate : null\">\n    </ng-container>\n    <ng-template #pinnedRecordsTemplate>\n        <ng-container *ngIf='data\n        | gridTransaction:id:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | gridAddRow:true:pipeTrigger\n        | gridRowPinning:id:true:pipeTrigger\n        | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger:true\n        | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger:true as pinnedData'>\n            <div #pinContainer *ngIf='pinnedData.length > 0'\n                [ngClass]=\"{\n                    'igx-grid__tr--pinned-bottom':  !isRowPinningToTop,\n                    'igx-grid__tr--pinned-top': isRowPinningToTop\n                }\"\n                class='igx-grid__tr--pinned' [style.width.px]='calcWidth'>\n                <ng-container *ngFor=\"let rowData of pinnedData; let rowIndex = index\">\n                    <ng-container *ngTemplateOutlet=\"pinned_record_template; context: getContext(rowData, rowIndex, true)\">\n                    </ng-container>\n                </ng-container>\n            </div>\n        </ng-container>\n    </ng-template>\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"data\n        | gridTransaction:id:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger\n        | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger\n        | gridGroupBy:groupingExpressions:groupingExpansionState:groupStrategy:groupsExpanded:id:groupsRecords:pipeTrigger\n        | gridPaging:paginator?.page:paginator?.perPage:id:pipeTrigger\n        | gridSummary:hasSummarizedColumns:summaryCalculationMode:summaryPosition:id:showSummaryOnCollapse:pipeTrigger:summaryPipeTrigger\n        | gridDetails:hasDetails:expansionStates:pipeTrigger\n        | gridAddRow:false:pipeTrigger\n        | gridRowPinning:id:false:pipeTrigger\"\n            let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight'\n            [igxForItemSize]=\"hasColumnLayouts ? rowHeight * multiRowLayoutRowSize + 1 : renderedRowHeight\"\n            [igxForTrackBy]='trackChanges'\n            #verticalScrollContainer (chunkPreload)=\"dataLoading($event)\" (dataChanging)=\"dataRebinding($event)\" (dataChanged)=\"dataRebound($event)\">\n            <ng-template\n                [igxTemplateOutlet]='getRowTemplate(rowData)'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex)'\n                (cachedViewLoaded)='cachedViewLoaded($event)'\n                (viewCreated)='viewCreatedHandler($event)'\n                (viewMoved)='viewMovedHandler($event)'>\n            </ng-template>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && !isRowPinningToTop ? pinnedRecordsTemplate : null\">\n        </ng-container>\n        <ng-template #record_template let-rowIndex=\"index\" let-rowData let-disabledRow=\"disabled\">\n            <igx-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\" [disabled]=\"disabledRow\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-grid-row>\n        </ng-template>\n        <ng-template #pinned_record_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\"#row #pinnedRow>\n            </igx-grid-row>\n        </ng-template>\n        <ng-template #group_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-groupby-row [gridID]=\"id\" [index]=\"rowIndex\" [groupRow]=\"rowData\" [hideGroupRowSelectors]=\"hideRowSelectors\" [rowDraggable]=\"rowDraggable\" #row>\n            </igx-grid-groupby-row>\n        </ng-template>\n        <ng-template #summary_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-summary-row role=\"row\" [gridID]=\"id\" [summaries]=\"rowData.summaries\" [index]=\"rowIndex\"\n                class=\"igx-grid__summaries--body\" #summaryRow>\n            </igx-grid-summary-row>\n        </ng-template>\n        <ng-template #detail_template_container let-rowIndex=\"index\" let-rowData>\n            <div detail='true' style=\"overflow: auto; width: 100%;\" id=\"{{id}}_{{rowIndex}}\" (pointerdown)='detailsViewFocused(detailsContainer, rowIndex)' #detailsContainer [attr.data-rowindex]='rowIndex'\n                [ngClass]=\"{\n                'igx-grid__tr-container': true,\n                'igx-grid__tr-container--active': isDetailActive(rowIndex)\n            }\">\n                <div class=\"igx-grid__hierarchical-indent\" style='display: flex;'>\n                        <ng-container *ngIf=\"this.groupingExpressions.length > 0\">\n                                <div class=\"igx-grid__row-indentation igx-grid__row-indentation--level-{{groupingExpressions.length}}\"></div>\n                        </ng-container>\n                        <ng-template\n                    [ngTemplateOutlet]='detailTemplate.first'\n                    [ngTemplateOutletContext]='getDetailsContext(rowData, rowIndex)'>\n                    </ng-template>\n                </div>\n            </div>\n        </ng-template>\n\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <div class=\"igx-grid__row-editing-outlet\" igxOverlayOutlet #igxRowEditingOverlayOutlet></div>\n        <igc-trial-watermark></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n    <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\" (pointerdown)=\"$event.preventDefault()\">\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div #igxBodyOverlayOutlet=\"overlay-outlet\" igxOverlayOutlet></div>\n</div>\n\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" [style.height.px]='summaryRowHeight' #tfoot>\n    <div tabindex=\"0\" (focus)=\"navigation.focusFirstCell(false)\" (keydown)=\"navigation.summaryNav($event)\" [attr.aria-activedescendant]=\"activeDescendant\">\n        <igx-grid-summary-row [style.width.px]='calcWidth'  [style.height.px]='summaryRowHeight'\n            *ngIf=\"hasSummarizedColumns && rootSummariesEnabled\" [gridID]=\"id\" role=\"row\"\n            [summaries]=\"id | igxGridSummaryDataPipe:summaryService.retriggerRootPipe\" [index]=\"dataView.length\"\n            class=\"igx-grid__summaries\" #summaryRow>\n        </igx-grid-summary-row>\n        <div class=\"igx-grid__tfoot-thumb\" [hidden]='!hasVerticalScroll()' [style.height.px]='summaryRowHeight'\n            [style.width.px]=\"scrollSize\"></div>\n    </div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\" (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='EMPTY_DATA' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n    <ng-container *ngIf=\"totalRecords || pagingMode === 1\">\n        <ng-content select=\"igx-paginator\"></ng-content>\n    </ng-container>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultAddRowEmptyTemplate>\n    <button igxButton=\"raised\" igxRipple (click)=\"this.crudService.enterAddRowMode(null, false, $event)\">\n        {{resourceStrings.igx_grid_add_row_label}}\n    </button>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n\n<ng-template #defaultExpandedTemplate>\n    <igx-icon role=\"button\" class=\"igx-grid__group-expand-btn\"\n   [ngClass]=\"{\n    'igx-grid__group-expand-btn--push': filteringService.isFilterRowVisible\n}\">unfold_less</igx-icon>\n</ng-template>\n\n <ng-template #defaultCollapsedTemplate>\n    <igx-icon role=\"button\" class=\"igx-grid__group-expand-btn\"\n    [ngClass]=\"{\n    'igx-grid__group-expand-btn--push': filteringService.isFilterRowVisible\n}\">unfold_more</igx-icon>\n</ng-template>\n\n<div *ngIf=\"rowEditable\" igxToggle #rowEditingOverlay>\n    <div [className]=\"bannerClass\">\n        <ng-container\n            *ngTemplateOutlet=\"rowEditContainer; context: { rowChangesCount: rowChangesCount, endEdit: this.endEdit.bind(this) }\">\n        </ng-container>\n    </div>\n</div>\n\n<ng-template #defaultRowEditText>\n    You have {{ rowChangesCount }} changes in this row\n</ng-template>\n\n<ng-template #defaultRowEditActions>\n    <button igxButton igxRowEditTabStop type=\"button\" (click)=\"this.endRowEditTabStop(false, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_cancel }}</button>\n    <button igxButton igxRowEditTabStop type=\"button\" (click)=\"this.endRowEditTabStop(true, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_done }}</button>\n</ng-template>\n\n<ng-template #defaultRowEditTemplate>\n    <div class=\"igx-banner__message\">\n        <span class=\"igx-banner__text\">\n            <ng-container\n                *ngTemplateOutlet=\"this.crudService.row?.getClassName() === 'IgxAddRow' ? rowAddText : rowEditText ? rowEditText : defaultRowEditText;\n                context: { $implicit: this.crudService.row?.getClassName() !== 'IgxAddRow' ? rowChangesCount : null }\">\n            </ng-container>\n        </span>\n    </div>\n    <div class=\"igx-banner__actions\">\n        <div class=\"igx-banner__row\">\n            <ng-container\n                *ngTemplateOutlet=\"rowEditActions ? rowEditActions : defaultRowEditActions; context: { $implicit: this.endEdit.bind(this) }\">\n            </ng-container>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #dragIndicatorIconBase>\n    <igx-icon>drag_indicator</igx-icon>\n</ng-template>\n\n<igx-grid-column-resizer *ngIf=\"colResizingService.showResizer\"></igx-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n", components: [{ type: i1.IgxGridGroupByAreaComponent, selector: "igx-grid-group-by-area", inputs: ["sortingExpressions", "grid"] }, { type: i2.IgxGridHeaderRowComponent, selector: "igx-grid-header-row", inputs: ["grid", "pinnedColumnCollection", "unpinnedColumnCollection", "activeDescendant", "hasMRL", "width", "density"] }, { type: i3.IgxGridRowComponent, selector: "igx-grid-row" }, { type: i4.IgxGridGroupByRowComponent, selector: "igx-grid-groupby-row", inputs: ["hideGroupRowSelectors", "rowDraggable", "index", "gridID", "groupRow", "isFocused"] }, { type: i5.IgxSummaryRowComponent, selector: "igx-grid-summary-row", inputs: ["summaries", "gridID", "index", "firstCellIndentation"] }, { type: i6.IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: ["id", "isIndeterminate", "textVisibility", "text"] }, { type: i7.IgxSnackbarComponent, selector: "igx-snackbar", inputs: ["id", "actionText", "positionSettings"], outputs: ["clicked", "animationStarted", "animationDone"] }, { type: i8.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i9.IgxGridColumnResizerComponent, selector: "igx-grid-column-resizer", inputs: ["restrictResizerTop"] }], directives: [{ type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i11.IgxGridBodyDirective, selector: "[igxGridBody]" }, { type: i12.IgxGridDragSelectDirective, selector: "[igxGridDragSelect]", inputs: ["igxGridDragSelect"], outputs: ["dragStop", "dragScroll"] }, { type: i13.IgxColumnMovingDropDirective, selector: "[igxColumnMovingDrop]", inputs: ["igxColumnMovingDrop"] }, { type: i10.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i10.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i10.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i14.IgxGridForOfDirective, selector: "[igxGridFor][igxGridForOf]", inputs: ["igxGridForOf", "igxGridForOfUniqueSizeCache", "igxGridForOfVariableSizes"], outputs: ["dataChanging"] }, { type: i15.IgxTemplateOutletDirective, selector: "[igxTemplateOutlet]", inputs: ["igxTemplateOutletContext", "igxTemplateOutlet"], outputs: ["viewCreated", "viewMoved", "cachedViewLoaded", "beforeViewDetach"] }, { type: i10.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i16.IgxOverlayOutletDirective, selector: "[igxOverlayOutlet]", exportAs: ["overlay-outlet"] }, { type: i16.IgxToggleDirective, selector: "[igxToggle]", inputs: ["id"], outputs: ["opened", "opening", "closed", "closing", "appended"], exportAs: ["toggle"] }, { type: i17.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i18.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }, { type: i19.IgxRowEditTabStopDirective, selector: "[igxRowEditTabStop]" }], pipes: { "gridSort": i20.IgxGridSortingPipe, "gridFiltering": i20.IgxGridFilteringPipe, "gridRowPinning": i21.IgxGridRowPinningPipe, "gridAddRow": i21.IgxGridAddRowPipe, "visibleColumns": i21.IgxHasVisibleColumnsPipe, "gridTransaction": i21.IgxGridTransactionPipe, "gridDetails": i22.IgxGridDetailsPipe, "gridSummary": i23.IgxGridSummaryPipe, "gridPaging": i20.IgxGridPagingPipe, "gridGroupBy": i20.IgxGridGroupingPipe, "igxGridRowClasses": i21.IgxGridRowClassesPipe, "igxGridRowStyles": i21.IgxGridRowStylesPipe, "igxGridSummaryDataPipe": i24.IgxSummaryDataPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        IgxGridCRUDService,
                        IgxGridNavigationService,
                        IgxGridSummaryService,
                        IgxGridSelectionService,
                        { provide: IGX_GRID_SERVICE_BASE, useClass: IgxGridAPIService },
                        { provide: IGX_GRID_BASE, useExisting: IgxGridComponent },
                        IgxFilteringService,
                        IgxColumnResizingService,
                        IgxForOfSyncService,
                        IgxForOfScrollSyncService
                    ], selector: 'igx-grid', template: "<!-- Toolbar area -->\n<ng-content select=\"igx-grid-toolbar\"></ng-content>\n\n<!-- Group-by area -->\n<ng-container *ngIf=\"showGroupArea && (groupingExpressions.length > 0 || hasGroupableColumns)\">\n    <igx-grid-group-by-area #groupArea [style.flex-basis.px]='outerWidth'\n        [grid]=\"this\"\n        [expressions]=\"groupingExpressions\"\n        [sortingExpressions]=\"sortingExpressions\"\n        [density]=\"displayDensity\"\n        [dropAreaTemplate]=\"dropAreaTemplate\"\n        [dropAreaMessage]=\"dropAreaMessage\"\n    >\n    </igx-grid-group-by-area>\n</ng-container>\n\n<!-- Grid table head row area -->\n<igx-grid-header-row class=\"igx-grid-thead\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [density]=\"displayDensity\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (scroll)=\"preventHeaderScroll($event)\"\n    (focus)=\"navigation.focusFirstCell()\"\n>\n</igx-grid-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <div class=\"igx-grid__tbody-content\" tabindex=\"0\" [attr.role]=\"dataView.length ? null : 'row'\" (keydown)=\"navigation.handleNavigation($event)\" (focus)=\"navigation.focusTbody($event)\"\n        (dragStop)=\"selectionService.dragMode = $event\" (scroll)='preventContainerScroll($event)'\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth || null' #tbody [attr.aria-activedescendant]=\"activeDescendant\">\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n    <ng-container *ngTemplateOutlet=\"hasPinnedRecords && isRowPinningToTop ? pinnedRecordsTemplate : null\">\n    </ng-container>\n    <ng-template #pinnedRecordsTemplate>\n        <ng-container *ngIf='data\n        | gridTransaction:id:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | gridAddRow:true:pipeTrigger\n        | gridRowPinning:id:true:pipeTrigger\n        | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger:true\n        | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger:true as pinnedData'>\n            <div #pinContainer *ngIf='pinnedData.length > 0'\n                [ngClass]=\"{\n                    'igx-grid__tr--pinned-bottom':  !isRowPinningToTop,\n                    'igx-grid__tr--pinned-top': isRowPinningToTop\n                }\"\n                class='igx-grid__tr--pinned' [style.width.px]='calcWidth'>\n                <ng-container *ngFor=\"let rowData of pinnedData; let rowIndex = index\">\n                    <ng-container *ngTemplateOutlet=\"pinned_record_template; context: getContext(rowData, rowIndex, true)\">\n                    </ng-container>\n                </ng-container>\n            </div>\n        </ng-container>\n    </ng-template>\n        <ng-template igxGridFor let-rowData [igxGridForOf]=\"data\n        | gridTransaction:id:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger\n        | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger\n        | gridGroupBy:groupingExpressions:groupingExpansionState:groupStrategy:groupsExpanded:id:groupsRecords:pipeTrigger\n        | gridPaging:paginator?.page:paginator?.perPage:id:pipeTrigger\n        | gridSummary:hasSummarizedColumns:summaryCalculationMode:summaryPosition:id:showSummaryOnCollapse:pipeTrigger:summaryPipeTrigger\n        | gridDetails:hasDetails:expansionStates:pipeTrigger\n        | gridAddRow:false:pipeTrigger\n        | gridRowPinning:id:false:pipeTrigger\"\n            let-rowIndex=\"index\" [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight'\n            [igxForItemSize]=\"hasColumnLayouts ? rowHeight * multiRowLayoutRowSize + 1 : renderedRowHeight\"\n            [igxForTrackBy]='trackChanges'\n            #verticalScrollContainer (chunkPreload)=\"dataLoading($event)\" (dataChanging)=\"dataRebinding($event)\" (dataChanged)=\"dataRebound($event)\">\n            <ng-template\n                [igxTemplateOutlet]='getRowTemplate(rowData)'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex)'\n                (cachedViewLoaded)='cachedViewLoaded($event)'\n                (viewCreated)='viewCreatedHandler($event)'\n                (viewMoved)='viewMovedHandler($event)'>\n            </ng-template>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && !isRowPinningToTop ? pinnedRecordsTemplate : null\">\n        </ng-container>\n        <ng-template #record_template let-rowIndex=\"index\" let-rowData let-disabledRow=\"disabled\">\n            <igx-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\" [disabled]=\"disabledRow\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-grid-row>\n        </ng-template>\n        <ng-template #pinned_record_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\"#row #pinnedRow>\n            </igx-grid-row>\n        </ng-template>\n        <ng-template #group_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-groupby-row [gridID]=\"id\" [index]=\"rowIndex\" [groupRow]=\"rowData\" [hideGroupRowSelectors]=\"hideRowSelectors\" [rowDraggable]=\"rowDraggable\" #row>\n            </igx-grid-groupby-row>\n        </ng-template>\n        <ng-template #summary_template let-rowIndex=\"index\" let-rowData>\n            <igx-grid-summary-row role=\"row\" [gridID]=\"id\" [summaries]=\"rowData.summaries\" [index]=\"rowIndex\"\n                class=\"igx-grid__summaries--body\" #summaryRow>\n            </igx-grid-summary-row>\n        </ng-template>\n        <ng-template #detail_template_container let-rowIndex=\"index\" let-rowData>\n            <div detail='true' style=\"overflow: auto; width: 100%;\" id=\"{{id}}_{{rowIndex}}\" (pointerdown)='detailsViewFocused(detailsContainer, rowIndex)' #detailsContainer [attr.data-rowindex]='rowIndex'\n                [ngClass]=\"{\n                'igx-grid__tr-container': true,\n                'igx-grid__tr-container--active': isDetailActive(rowIndex)\n            }\">\n                <div class=\"igx-grid__hierarchical-indent\" style='display: flex;'>\n                        <ng-container *ngIf=\"this.groupingExpressions.length > 0\">\n                                <div class=\"igx-grid__row-indentation igx-grid__row-indentation--level-{{groupingExpressions.length}}\"></div>\n                        </ng-container>\n                        <ng-template\n                    [ngTemplateOutlet]='detailTemplate.first'\n                    [ngTemplateOutletContext]='getDetailsContext(rowData, rowIndex)'>\n                    </ng-template>\n                </div>\n            </div>\n        </ng-template>\n\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <div class=\"igx-grid__row-editing-outlet\" igxOverlayOutlet #igxRowEditingOverlayOutlet></div>\n        <igc-trial-watermark></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n    <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\" (pointerdown)=\"$event.preventDefault()\">\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div #igxBodyOverlayOutlet=\"overlay-outlet\" igxOverlayOutlet></div>\n</div>\n\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" [style.height.px]='summaryRowHeight' #tfoot>\n    <div tabindex=\"0\" (focus)=\"navigation.focusFirstCell(false)\" (keydown)=\"navigation.summaryNav($event)\" [attr.aria-activedescendant]=\"activeDescendant\">\n        <igx-grid-summary-row [style.width.px]='calcWidth'  [style.height.px]='summaryRowHeight'\n            *ngIf=\"hasSummarizedColumns && rootSummariesEnabled\" [gridID]=\"id\" role=\"row\"\n            [summaries]=\"id | igxGridSummaryDataPipe:summaryService.retriggerRootPipe\" [index]=\"dataView.length\"\n            class=\"igx-grid__summaries\" #summaryRow>\n        </igx-grid-summary-row>\n        <div class=\"igx-grid__tfoot-thumb\" [hidden]='!hasVerticalScroll()' [style.height.px]='summaryRowHeight'\n            [style.width.px]=\"scrollSize\"></div>\n    </div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\" (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='EMPTY_DATA' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n    <ng-container *ngIf=\"totalRecords || pagingMode === 1\">\n        <ng-content select=\"igx-paginator\"></ng-content>\n    </ng-container>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultAddRowEmptyTemplate>\n    <button igxButton=\"raised\" igxRipple (click)=\"this.crudService.enterAddRowMode(null, false, $event)\">\n        {{resourceStrings.igx_grid_add_row_label}}\n    </button>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n\n<ng-template #defaultExpandedTemplate>\n    <igx-icon role=\"button\" class=\"igx-grid__group-expand-btn\"\n   [ngClass]=\"{\n    'igx-grid__group-expand-btn--push': filteringService.isFilterRowVisible\n}\">unfold_less</igx-icon>\n</ng-template>\n\n <ng-template #defaultCollapsedTemplate>\n    <igx-icon role=\"button\" class=\"igx-grid__group-expand-btn\"\n    [ngClass]=\"{\n    'igx-grid__group-expand-btn--push': filteringService.isFilterRowVisible\n}\">unfold_more</igx-icon>\n</ng-template>\n\n<div *ngIf=\"rowEditable\" igxToggle #rowEditingOverlay>\n    <div [className]=\"bannerClass\">\n        <ng-container\n            *ngTemplateOutlet=\"rowEditContainer; context: { rowChangesCount: rowChangesCount, endEdit: this.endEdit.bind(this) }\">\n        </ng-container>\n    </div>\n</div>\n\n<ng-template #defaultRowEditText>\n    You have {{ rowChangesCount }} changes in this row\n</ng-template>\n\n<ng-template #defaultRowEditActions>\n    <button igxButton igxRowEditTabStop type=\"button\" (click)=\"this.endRowEditTabStop(false, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_cancel }}</button>\n    <button igxButton igxRowEditTabStop type=\"button\" (click)=\"this.endRowEditTabStop(true, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_done }}</button>\n</ng-template>\n\n<ng-template #defaultRowEditTemplate>\n    <div class=\"igx-banner__message\">\n        <span class=\"igx-banner__text\">\n            <ng-container\n                *ngTemplateOutlet=\"this.crudService.row?.getClassName() === 'IgxAddRow' ? rowAddText : rowEditText ? rowEditText : defaultRowEditText;\n                context: { $implicit: this.crudService.row?.getClassName() !== 'IgxAddRow' ? rowChangesCount : null }\">\n            </ng-container>\n        </span>\n    </div>\n    <div class=\"igx-banner__actions\">\n        <div class=\"igx-banner__row\">\n            <ng-container\n                *ngTemplateOutlet=\"rowEditActions ? rowEditActions : defaultRowEditActions; context: { $implicit: this.endEdit.bind(this) }\">\n            </ng-container>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #dragIndicatorIconBase>\n    <igx-icon>drag_indicator</igx-icon>\n</ng-template>\n\n<igx-grid-column-resizer *ngIf=\"colResizingService.showResizer\"></igx-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n" }]
        }], propDecorators: { dataPreLoad: [{
                type: Output
            }], groupingExpressionsChange: [{
                type: Output
            }], groupingExpansionStateChange: [{
                type: Output
            }], onGroupingDone: [{
                type: Output
            }], groupsExpanded: [{
                type: Input
            }], dropAreaTemplate: [{
                type: Input
            }], detailTemplate: [{
                type: ContentChildren,
                args: [IgxGridDetailTemplateDirective, { read: TemplateRef }]
            }], groupArea: [{
                type: ViewChild,
                args: [IgxGridGroupByAreaComponent]
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], recordTemplate: [{
                type: ViewChild,
                args: ['record_template', { read: TemplateRef, static: true }]
            }], detailTemplateContainer: [{
                type: ViewChild,
                args: ['detail_template_container', { read: TemplateRef, static: true }]
            }], defaultGroupTemplate: [{
                type: ViewChild,
                args: ['group_template', { read: TemplateRef, static: true }]
            }], summaryTemplate: [{
                type: ViewChild,
                args: ['summary_template', { read: TemplateRef, static: true }]
            }], groupTemplate: [{
                type: ContentChild,
                args: [IgxGroupByRowTemplateDirective, { read: IgxGroupByRowTemplateDirective }]
            }], groupByRowSelectorsTemplates: [{
                type: ContentChildren,
                args: [IgxGroupByRowSelectorDirective, { read: IgxGroupByRowSelectorDirective, descendants: false }]
            }], _groupsRowList: [{
                type: ViewChildren,
                args: [IgxGridGroupByRowComponent, { read: IgxGridGroupByRowComponent }]
            }], data: [{
                type: Input
            }], groupingExpressions: [{
                type: Input
            }], groupingExpansionState: [{
                type: Input
            }], hideGroupedColumns: [{
                type: Input
            }], groupStrategy: [{
                type: Input
            }], dropAreaMessage: [{
                type: Input
            }], showGroupArea: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvZ3JpZC9ncmlkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9ncmlkL2dyaWQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUMzRixTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBNkIsV0FBVyxFQUNsRCxlQUFlLEVBQ3pDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7QUFFOUQsT0FBTyxFQUFFLDhCQUE4QixFQUFFLDhCQUE4QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkcsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFJckUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSx1QkFBdUIsRUFB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QUFLO2dCQTZFSyxtQkFBbUI7c0JBRDdCLEtBQUs7Z0JBNERLLHNCQUFzQjtzQkFEaEMsS0FBSztnQkEwQkssa0JBQWtCO3NCQUQ1QixLQUFLO2dCQTZCSyxhQUFhO3NCQUR2QixLQUFLO2dCQXNCSyxlQUFlO3NCQUR6QixLQUFLO2dCQXNVSyxhQUFhO3NCQUR2QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENvbnRlbnRDaGlsZCwgVmlld0NoaWxkcmVuLFxuICAgIFF1ZXJ5TGlzdCwgVmlld0NoaWxkLCBUZW1wbGF0ZVJlZiwgRG9DaGVjaywgQWZ0ZXJDb250ZW50SW5pdCwgSG9zdEJpbmRpbmcsXG4gICAgT25Jbml0LCBBZnRlclZpZXdJbml0LCBDb250ZW50Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hHcmlkQmFzZURpcmVjdGl2ZSB9IGZyb20gJy4uL2dyaWQtYmFzZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4R3JpZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4R3JpZEFQSVNlcnZpY2UgfSBmcm9tICcuL2dyaWQtYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgY2xvbmVBcnJheSwgSUJhc2VFdmVudEFyZ3MgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElHcm91cEJ5UmVjb3JkIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2dyb3VwYnktcmVjb3JkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hHcm91cEJ5Um93VGVtcGxhdGVEaXJlY3RpdmUsIElneEdyaWREZXRhaWxUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vZ3JpZC5kaXJlY3RpdmVzJztcbmltcG9ydCB7IElneEdyaWRHcm91cEJ5Um93Q29tcG9uZW50IH0gZnJvbSAnLi9ncm91cGJ5LXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSUdyb3VwQnlFeHBhbmRTdGF0ZSB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGJ5LWV4cGFuZC1zdGF0ZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZvck9mU3RhdGUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2Zvci1vZi9mb3Jfb2YuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneENvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbHVtbnMvY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vZmlsdGVyaW5nL2dyaWQtZmlsdGVyaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSUdyb3VwaW5nRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGluZy1leHByZXNzaW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5SZXNpemluZ1NlcnZpY2UgfSBmcm9tICcuLi9yZXNpemluZy9yZXNpemluZy5zZXJ2aWNlJztcbmltcG9ydCB7IElneEdyaWRTdW1tYXJ5U2VydmljZSB9IGZyb20gJy4uL3N1bW1hcmllcy9ncmlkLXN1bW1hcnkuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkU2VsZWN0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24uc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hGb3JPZlN5bmNTZXJ2aWNlLCBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9mb3Itb2YvZm9yX29mLnN5bmMuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkTVJMTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9ncmlkLW1ybC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsdGVyTW9kZSwgR3JpZEluc3RhbmNlVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBDZWxsVHlwZSwgR3JpZFR5cGUsIElHWF9HUklEX0JBU0UsIElHWF9HUklEX1NFUlZJQ0VfQkFTRSwgUm93VHlwZSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hHcm91cEJ5Um93U2VsZWN0b3JEaXJlY3RpdmUgfSBmcm9tICcuLi9zZWxlY3Rpb24vcm93LXNlbGVjdG9ycyc7XG5pbXBvcnQgeyBJZ3hHcmlkQ1JVRFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vY3J1ZC5zZXJ2aWNlJztcbmltcG9ydCB7IElneEdyaWRSb3csIElneEdyb3VwQnlSb3csIElneFN1bW1hcnlSb3cgfSBmcm9tICcuLi9ncmlkLXB1YmxpYy1yb3cnO1xuaW1wb3J0IHsgSWd4R3JpZEdyb3VwQnlBcmVhQ29tcG9uZW50IH0gZnJvbSAnLi4vZ3JvdXBpbmcvZ3JpZC1ncm91cC1ieS1hcmVhLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkQ2VsbCB9IGZyb20gJy4uL2dyaWQtcHVibGljLWNlbGwnO1xuaW1wb3J0IHsgSVNvcnRpbmdFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgSUdyaWRHcm91cGluZ1N0cmF0ZWd5IH0gZnJvbSAnLi4vY29tbW9uL3N0cmF0ZWd5JztcbmxldCBORVhUX0lEID0gMDtcblxuZXhwb3J0IGludGVyZmFjZSBJR3JvdXBpbmdEb25lRXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VFdmVudEFyZ3Mge1xuICAgIGV4cHJlc3Npb25zOiBBcnJheTxJU29ydGluZ0V4cHJlc3Npb24+IHwgSVNvcnRpbmdFeHByZXNzaW9uO1xuICAgIGdyb3VwZWRDb2x1bW5zOiBBcnJheTxJZ3hDb2x1bW5Db21wb25lbnQ+IHwgSWd4Q29sdW1uQ29tcG9uZW50O1xuICAgIHVuZ3JvdXBlZENvbHVtbnM6IEFycmF5PElneENvbHVtbkNvbXBvbmVudD4gfCBJZ3hDb2x1bW5Db21wb25lbnQ7XG59XG5cbi8qKlxuICogR3JpZCBwcm92aWRlcyBhIHdheSB0byBwcmVzZW50IGFuZCBtYW5pcHVsYXRlIHRhYnVsYXIgZGF0YS5cbiAqXG4gKiBAaWd4TW9kdWxlIElneEdyaWRNb2R1bGVcbiAqIEBpZ3hHcm91cCBHcmlkcyAmIExpc3RzXG4gKiBAaWd4S2V5d29yZHMgZ3JpZCwgdGFibGVcbiAqIEBpZ3hUaGVtZSBpZ3gtZ3JpZC10aGVtZVxuICogQHJlbWFya3NcbiAqIFRoZSBJZ25pdGUgVUkgR3JpZCBpcyB1c2VkIGZvciBwcmVzZW50aW5nIGFuZCBtYW5pcHVsYXRpbmcgdGFidWxhciBkYXRhIGluIHRoZSBzaW1wbGVzdCB3YXkgcG9zc2libGUuICBPbmNlIGRhdGFcbiAqIGhhcyBiZWVuIGJvdW5kLCBpdCBjYW4gYmUgbWFuaXB1bGF0ZWQgdGhyb3VnaCBmaWx0ZXJpbmcsIHNvcnRpbmcgJiBlZGl0aW5nIG9wZXJhdGlvbnMuXG4gKiBAZXhhbXBsZVxuICogYGBgaHRtbFxuICogPGlneC1ncmlkIFtkYXRhXT1cImVtcGxveWVlRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwiZmFsc2VcIj5cbiAqICAgPGlneC1jb2x1bW4gZmllbGQ9XCJmaXJzdFwiIGhlYWRlcj1cIkZpcnN0IE5hbWVcIj48L2lneC1jb2x1bW4+XG4gKiAgIDxpZ3gtY29sdW1uIGZpZWxkPVwibGFzdFwiIGhlYWRlcj1cIkxhc3QgTmFtZVwiPjwvaWd4LWNvbHVtbj5cbiAqICAgPGlneC1jb2x1bW4gZmllbGQ9XCJyb2xlXCIgaGVhZGVyPVwiUm9sZVwiPjwvaWd4LWNvbHVtbj5cbiAqIDwvaWd4LWdyaWQ+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIElneEdyaWRDUlVEU2VydmljZSxcbiAgICAgICAgSWd4R3JpZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgICAgICBJZ3hHcmlkU3VtbWFyeVNlcnZpY2UsXG4gICAgICAgIElneEdyaWRTZWxlY3Rpb25TZXJ2aWNlLFxuICAgICAgICB7IHByb3ZpZGU6IElHWF9HUklEX1NFUlZJQ0VfQkFTRSwgdXNlQ2xhc3M6IElneEdyaWRBUElTZXJ2aWNlIH0sXG4gICAgICAgIHsgcHJvdmlkZTogSUdYX0dSSURfQkFTRSwgdXNlRXhpc3Rpbmc6IElneEdyaWRDb21wb25lbnQgfSxcbiAgICAgICAgSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgSWd4Q29sdW1uUmVzaXppbmdTZXJ2aWNlLFxuICAgICAgICBJZ3hGb3JPZlN5bmNTZXJ2aWNlLFxuICAgICAgICBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlXG4gICAgXSxcbiAgICBzZWxlY3RvcjogJ2lneC1ncmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZ3JpZC5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZENvbXBvbmVudCBleHRlbmRzIElneEdyaWRCYXNlRGlyZWN0aXZlIGltcGxlbWVudHMgR3JpZFR5cGUsIE9uSW5pdCwgRG9DaGVjaywgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGEgbmV3IGNodW5rIG9mIGRhdGEgaXMgbG9hZGVkIGZyb20gdmlydHVhbGl6YXRpb24uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIChkYXRhUHJlTG9hZCk9J2hhbmRsZURhdGFQcmVsb2FkRXZlbnQoKSc+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZGF0YVByZUxvYWQgPSBuZXcgRXZlbnRFbWl0dGVyPElGb3JPZlN0YXRlPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBncm91cGluZ0V4cHJlc3Npb25zQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JvdXBpbmdFeHByZXNzaW9uW10+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBncm91cGluZ0V4cGFuc2lvblN0YXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JvdXBCeUV4cGFuZFN0YXRlW10+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gY29sdW1ucyBhcmUgZ3JvdXBlZC91bmdyb3VwZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBgb25Hcm91cGluZ0RvbmVgIGV2ZW50IHdvdWxkIGJlIHJhaXNlZCBvbmx5IG9uY2UgaWYgc2V2ZXJhbCBjb2x1bW5zIGdldCBncm91cGVkIGF0IG9uY2UgYnkgY2FsbGluZ1xuICAgICAqIHRoZSBgZ3JvdXBCeSgpYCBvciBgY2xlYXJHcm91cGluZygpYCBBUEkgbWV0aG9kcyBhbmQgcGFzc2luZyBhbiBhcnJheSBhcyBhbiBhcmd1bWVudC5cbiAgICAgKiBUaGUgZXZlbnQgYXJndW1lbnRzIHByb3ZpZGUgdGhlIGBleHByZXNzaW9uc2AsIGBncm91cGVkQ29sdW1uc2AgYW5kIGB1bmdyb3VwZWRDb2x1bW5zYCBwcm9wZXJ0aWVzLCB3aGljaCBjb250YWluXG4gICAgICogdGhlIGBJU29ydGluZ0V4cHJlc3Npb25gIGFuZCB0aGUgYElneENvbHVtbkNvbXBvbmVudGAgcmVsYXRlZCB0byB0aGUgZ3JvdXBpbmcvdW5ncm91cGluZyBvcGVyYXRpb24uXG4gICAgICogUGxlYXNlIG5vdGUgdGhhdCBgZ3JvdXBlZENvbHVtbnNgIGFuZCBgdW5ncm91cGVkQ29sdW1uc2Agc2hvdyBvbmx5IHRoZSAqKm5ld2x5KiogY2hhbmdlZCBjb2x1bW5zIChhZmZlY3RlZCBieSB0aGUgKipsYXN0KipcbiAgICAgKiBncm91cGluZy91bmdyb3VwaW5nIG9wZXJhdGlvbiksIG5vdCBhbGwgY29sdW1ucyB3aGljaCBhcmUgY3VycmVudGx5IGdyb3VwZWQvdW5ncm91cGVkLlxuICAgICAqIGNvbHVtbnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIChvbkdyb3VwaW5nRG9uZSk9XCJncm91cGluZ0RvbmUoJGV2ZW50KVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uR3JvdXBpbmdEb25lID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JvdXBpbmdEb25lRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHdoZXRoZXIgY3JlYXRlZCBncm91cHMgYXJlIHJlbmRlcmVkIGV4cGFuZGVkIG9yIGNvbGxhcHNlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyZWQgc3RhdGUgaXMgZXhwYW5kZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cIkRhdGFcIiBbZ3JvdXBzRXhwYW5kZWRdPVwiZmFsc2VcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdyb3Vwc0V4cGFuZGVkID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgdGVtcGxhdGUgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGFzIGEgR3JvdXBCeSBkcm9wIGFyZWEuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBncmlkIG5lZWRzIHRvIGhhdmUgYXQgbGVhc3Qgb25lIGdyb3VwYWJsZSBjb2x1bW4gaW4gb3JkZXIgdGhlIEdyb3VwQnkgYXJlYSB0byBiZSBkaXNwbGF5ZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIFtkcm9wQXJlYVRlbXBsYXRlXT1cImRyb3BBcmVhUmVmXCI+XG4gICAgICogPC9pZ3gtZ3JpZD5cbiAgICAgKiA8bmctdGVtcGxhdGUgI215RHJvcEFyZWE+XG4gICAgICogICAgICA8c3Bhbj4gQ3VzdG9tIGRyb3AgYXJlYSEgPC9zcGFuPlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZHJvcEFyZWFUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hHcmlkRGV0YWlsVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgZGV0YWlsVGVtcGxhdGU6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PiA9IG5ldyBRdWVyeUxpc3QoKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQFZpZXdDaGlsZChJZ3hHcmlkR3JvdXBCeUFyZWFDb21wb25lbnQpXG4gICAgcHVibGljIGdyb3VwQXJlYTogSWd4R3JpZEdyb3VwQnlBcmVhQ29tcG9uZW50O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIHJvbGUgPSAnZ3JpZCc7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIHZhbHVlIG9mIHRoZSBgaWRgIGF0dHJpYnV0ZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIFtpZF09XCInaWd4LWdyaWQtMSdcIiBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlkID0gYGlneC1ncmlkLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ3JlY29yZF90ZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCByZWNvcmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2RldGFpbF90ZW1wbGF0ZV9jb250YWluZXInLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZGV0YWlsVGVtcGxhdGVDb250YWluZXI6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdncm91cF90ZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBkZWZhdWx0R3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ3N1bW1hcnlfdGVtcGxhdGUnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgc3VtbWFyeVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneEdyb3VwQnlSb3dUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBJZ3hHcm91cEJ5Um93VGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwcm90ZWN0ZWQgZ3JvdXBUZW1wbGF0ZTogSWd4R3JvdXBCeVJvd1RlbXBsYXRlRGlyZWN0aXZlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4R3JvdXBCeVJvd1NlbGVjdG9yRGlyZWN0aXZlLCB7IHJlYWQ6IElneEdyb3VwQnlSb3dTZWxlY3RvckRpcmVjdGl2ZSwgZGVzY2VuZGFudHM6IGZhbHNlIH0pXG4gICAgcHJvdGVjdGVkIGdyb3VwQnlSb3dTZWxlY3RvcnNUZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxJZ3hHcm91cEJ5Um93U2VsZWN0b3JEaXJlY3RpdmU+O1xuXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hHcmlkR3JvdXBCeVJvd0NvbXBvbmVudCwgeyByZWFkOiBJZ3hHcmlkR3JvdXBCeVJvd0NvbXBvbmVudCB9KVxuICAgIHByaXZhdGUgX2dyb3Vwc1Jvd0xpc3Q6IFF1ZXJ5TGlzdDxJZ3hHcmlkR3JvdXBCeVJvd0NvbXBvbmVudD47XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBoaWVyYXJjaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdyb3VwIGJ5IHJlY29yZHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZ3JvdXBSZWNvcmRzID0gdGhpcy5ncmlkLmdyb3Vwc1JlY29yZHM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdyb3Vwc1JlY29yZHM6IElHcm91cEJ5UmVjb3JkW10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogSW5jbHVkZXMgY2hpbGRyZW4gb2YgY29sbGFwc2VkIGdyb3VwIHJvd3MuXG4gICAgICovXG4gICAgcHVibGljIGdyb3VwaW5nUmVzdWx0OiBhbnlbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdyb3VwaW5nTWV0YWRhdGE6IGFueVtdO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBEb2VzIG5vdCBpbmNsdWRlIGNoaWxkcmVuIG9mIGNvbGxhcHNlZCBncm91cCByb3dzLlxuICAgICAqL1xuICAgIHB1YmxpYyBncm91cGluZ0ZsYXRSZXN1bHQ6IGFueVtdO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2dyb3VwaW5nRXhwcmVzc2lvbnM6IElHcm91cGluZ0V4cHJlc3Npb25bXSA9IFtdO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2dyb3VwaW5nRXhwYW5kU3RhdGU6IElHcm91cEJ5RXhwYW5kU3RhdGVbXSA9IFtdO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2dyb3VwUm93VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZ3JvdXBBcmVhVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZ3JvdXBTdHJhdGVneTogSUdyaWRHcm91cGluZ1N0cmF0ZWd5O1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ3JvdXBpbmdEaWZmZXI7XG4gICAgcHJpdmF0ZSBfZGF0YT86IGFueVtdIHwgbnVsbDtcbiAgICBwcml2YXRlIF9oaWRlR3JvdXBlZENvbHVtbnMgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9kcm9wQXJlYU1lc3NhZ2UgPSBudWxsO1xuICAgIHByaXZhdGUgX3Nob3dHcm91cEFyZWEgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBhcnJheSBvZiBkYXRhIHRoYXQgcG9wdWxhdGVzIHRoZSBgSWd4R3JpZENvbXBvbmVudGAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55W10gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBkYXRhKHZhbHVlOiBhbnlbXSB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHZhbHVlIHx8IFtdO1xuICAgICAgICB0aGlzLnN1bW1hcnlTZXJ2aWNlLmNsZWFyU3VtbWFyeUNhY2hlKCk7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZEdlbmVyYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICBpZiAodGhpcy5pc1BlcmNlbnRIZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBhbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIGZpbHRlcmVkIGRhdGEuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZmlsdGVyZWREYXRhID0gdGhpcy5ncmlkLmZpbHRlcmVkRGF0YTtcbiAgICAgKiB0aGlzLmdyaWQuZmlsdGVyZWREYXRhID0gWy4uLl07XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBmaWx0ZXJlZERhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWx0ZXJlZERhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBmaWx0ZXJlZERhdGEodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZmlsdGVyZWREYXRhID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSB0b3RhbCBudW1iZXIgb2YgcmVjb3JkcyBpbiB0aGUgZGF0YSBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoaXMgcHJvcGVydHkgaXMgcmVxdWlyZWQgZm9yIHJlbW90ZSBncmlkIHZpcnR1YWxpemF0aW9uIHRvIGZ1bmN0aW9uIHdoZW4gaXQgaXMgYm91bmQgdG8gcmVtb3RlIGRhdGEuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgaXRlbUNvdW50ID0gdGhpcy5ncmlkMS50b3RhbEl0ZW1Db3VudDtcbiAgICAgKiB0aGlzLmdyaWQxLnRvdGFsSXRlbUNvdW50ID0gNTU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCB0b3RhbEl0ZW1Db3VudChjb3VudCkge1xuICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnRvdGFsSXRlbUNvdW50ID0gY291bnQ7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHRvdGFsSXRlbUNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci50b3RhbEl0ZW1Db3VudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBfZ3JpZEFQSSgpOiBJZ3hHcmlkQVBJU2VydmljZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRBUEkgYXMgSWd4R3JpZEFQSVNlcnZpY2U7XG4gICAgfVxuICAgIHByaXZhdGUgX2ZpbHRlcmVkRGF0YSA9IG51bGw7XG5cbiAgICBwcml2YXRlIGNoaWxkRGV0YWlsVGVtcGxhdGVzOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBncm91cCBieSBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBncm91cEJ5U3RhdGUgPSB0aGlzLmdyaWQuZ3JvdXBpbmdFeHByZXNzaW9ucztcbiAgICAgKiB0aGlzLmdyaWQuZ3JvdXBpbmdFeHByZXNzaW9ucyA9IFsuLi5dO1xuICAgICAqIGBgYFxuICAgICAqIEByZW1hcmtzXG4gICAgICogU3VwcG9ydHMgdHdvLXdheSBkYXRhIGJpbmRpbmcuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkICNncmlkIFtkYXRhXT1cIkRhdGFcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIiBbKGdyb3VwaW5nRXhwcmVzc2lvbnMpXT1cIm1vZGVsLmdyb3VwaW5nRXhwcmVzc2lvbnNcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBncm91cGluZ0V4cHJlc3Npb25zKCk6IElHcm91cGluZ0V4cHJlc3Npb25bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cGluZ0V4cHJlc3Npb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZ3JvdXBpbmdFeHByZXNzaW9ucyh2YWx1ZTogSUdyb3VwaW5nRXhwcmVzc2lvbltdKSB7XG4gICAgICAgIGlmICh0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnMgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignTWF4aW11bSBhbW91bnQgb2YgZ3JvdXBlZCBjb2x1bW5zIGlzIDEwLicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9sZEV4cHJlc3Npb25zOiBJR3JvdXBpbmdFeHByZXNzaW9uW10gPSB0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnM7XG4gICAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb25zOiBJR3JvdXBpbmdFeHByZXNzaW9uW10gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fZ3JvdXBpbmdFeHByZXNzaW9ucyA9IGNsb25lQXJyYXkodmFsdWUpO1xuICAgICAgICB0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnNDaGFuZ2UuZW1pdCh0aGlzLl9ncm91cGluZ0V4cHJlc3Npb25zKTtcbiAgICAgICAgaWYgKHRoaXMuX2dyaWRBUEkuZ3JpZCkge1xuICAgICAgICAgICAgLyogZ3JvdXBpbmcgc2hvdWxkIHdvcmsgaW4gY29uanVuY3Rpb24gd2l0aCBzb3J0aW5nXG4gICAgICAgICAgICBhbmQgd2l0aG91dCBvdmVycmlkaW5nIHNlcGFyYXRlIHNvcnRpbmcgZXhwcmVzc2lvbnMgKi9cbiAgICAgICAgICAgIHRoaXMuX2FwcGx5R3JvdXBpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuX2dyaWRBUEkuYXJyYW5nZV9zb3J0aW5nX2V4cHJlc3Npb25zKCk7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNldHRlciBjYWxsZWQgYmVmb3JlIGdyaWQgaXMgcmVnaXN0ZXJlZCBpbiBncmlkIEFQSSBzZXJ2aWNlXG4gICAgICAgICAgICB0aGlzLnNvcnRpbmdFeHByZXNzaW9ucy51bnNoaWZ0LmFwcGx5KHRoaXMuc29ydGluZ0V4cHJlc3Npb25zLCB0aGlzLl9ncm91cGluZ0V4cHJlc3Npb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2luaXQgJiYgSlNPTi5zdHJpbmdpZnkob2xkRXhwcmVzc2lvbnMpICE9PSBKU09OLnN0cmluZ2lmeShuZXdFeHByZXNzaW9ucykgJiYgdGhpcy5jb2x1bW5MaXN0KSB7XG4gICAgICAgICAgICBjb25zdCBncm91cGVkQ29sczogSWd4Q29sdW1uQ29tcG9uZW50W10gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHVuZ3JvdXBlZENvbHM6IElneENvbHVtbkNvbXBvbmVudFtdID0gW107XG4gICAgICAgICAgICBjb25zdCBncm91cGVkQ29sc0FyciA9IG5ld0V4cHJlc3Npb25zLmZpbHRlcigob2JqKSA9PiAhb2xkRXhwcmVzc2lvbnMuc29tZSgob2JqMikgPT4gb2JqLmZpZWxkTmFtZSA9PT0gb2JqMi5maWVsZE5hbWUpKTtcbiAgICAgICAgICAgIGdyb3VwZWRDb2xzQXJyLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICBncm91cGVkQ29scy5wdXNoKHRoaXMuZ2V0Q29sdW1uQnlOYW1lKGVsZW0uZmllbGROYW1lKSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHVuZ3JvdXBlZENvbHNBcnIgPSBvbGRFeHByZXNzaW9ucy5maWx0ZXIoKG9iaikgPT4gIW5ld0V4cHJlc3Npb25zLnNvbWUoKG9iajIpID0+IG9iai5maWVsZE5hbWUgPT09IG9iajIuZmllbGROYW1lKSk7XG4gICAgICAgICAgICB1bmdyb3VwZWRDb2xzQXJyLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICB1bmdyb3VwZWRDb2xzLnB1c2godGhpcy5nZXRDb2x1bW5CeU5hbWUoZWxlbS5maWVsZE5hbWUpKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICBjb25zdCBncm91cGluZ0RvbmVBcmdzOiBJR3JvdXBpbmdEb25lRXZlbnRBcmdzID0ge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zOiBuZXdFeHByZXNzaW9ucyxcbiAgICAgICAgICAgICAgICBncm91cGVkQ29sdW1uczogZ3JvdXBlZENvbHMsXG4gICAgICAgICAgICAgICAgdW5ncm91cGVkQ29sdW1uczogdW5ncm91cGVkQ29sc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMub25Hcm91cGluZ0RvbmUuZW1pdChncm91cGluZ0RvbmVBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyBhIGxpc3Qgb2YgZXhwYW5zaW9uIHN0YXRlcyBmb3IgZ3JvdXAgcm93cy5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSW5jbHVkZXMgb25seSBzdGF0ZXMgdGhhdCBkaWZmZXIgZnJvbSB0aGUgZGVmYXVsdCBvbmUgKGNvbnRyb2xsZWQgdGhyb3VnaCBncm91cHNFeHBhbmRlZCBhbmQgc3RhdGVzIHRoYXQgdGhlIHVzZXIgaGFzIGNoYW5nZWQuXG4gICAgICogQ29udGFpbnMgdGhlIGV4cGFuc2lvbiBzdGF0ZSAoZXhwYW5kZWQ6IGJvb2xlYW4pIGFuZCB0aGUgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBncm91cCByb3cgKEFycmF5KS5cbiAgICAgKiBTdXBwb3J0cyB0d28td2F5IGRhdGEgYmluZGluZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIFsoZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZSldPVwibW9kZWwuZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZVwiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGdyb3VwaW5nRXhwYW5zaW9uU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cGluZ0V4cGFuZFN0YXRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuX2dyb3VwaW5nRXhwYW5kU3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ncm91cGluZ0V4cGFuZFN0YXRlID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLmdyaWRBUEkuZ3JpZCkge1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHdoZXRoZXIgdGhlIGdyb3VwZWQgY29sdW1ucyBzaG91bGQgYmUgaGlkZGVuLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBcImZhbHNlXCJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW2hpZGVHcm91cGVkQ29sdW1uc109XCJ0cnVlXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaGlkZUdyb3VwZWRDb2x1bW5zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGlkZUdyb3VwZWRDb2x1bW5zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaGlkZUdyb3VwZWRDb2x1bW5zKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5ncm91cGluZ0RpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMuZ3JvdXBpbmdFeHByZXNzaW9ucykuY3JlYXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwaW5nRGlmZmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb2x1bW5MaXN0ICYmIHRoaXMuZ3JvdXBpbmdFeHByZXNzaW9ucykge1xuICAgICAgICAgICAgdGhpcy5fc2V0R3JvdXBDb2xzVmlzaWJpbGl0eSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oaWRlR3JvdXBlZENvbHVtbnMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGdyb3VwaW5nIHN0cmF0ZWd5IG9mIHRoZSBncmlkLlxuICAgICAqXG4gICAgICogQHJlbWFya3MgVGhlIGRlZmF1bHQgSWd4R3JvdXBpbmcgZXh0ZW5kcyBmcm9tIElneFNvcnRpbmcgYW5kIGEgY3VzdG9tIG9uZSBjYW4gYmUgdXNlZCBhcyBhIGBzb3J0U3RyYXRlZ3lgIGFzIHdlbGwuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1ncmlkICNncmlkIFtkYXRhXT1cImxvY2FsRGF0YVwiIFtncm91cFN0cmF0ZWd5XT1cImdyb3VwU3RyYXRlZ3lcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBncm91cFN0cmF0ZWd5KCk6IElHcmlkR3JvdXBpbmdTdHJhdGVneSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cFN0cmF0ZWd5O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZ3JvdXBTdHJhdGVneSh2YWx1ZTogSUdyaWRHcm91cGluZ1N0cmF0ZWd5KSB7XG4gICAgICAgIHRoaXMuX2dyb3VwU3RyYXRlZ3kgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIG1lc3NhZ2UgZGlzcGxheWVkIGluc2lkZSB0aGUgR3JvdXBCeSBkcm9wIGFyZWEgd2hlcmUgY29sdW1ucyBjYW4gYmUgZHJhZ2dlZCBvbi5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIGdyaWQgbmVlZHMgdG8gaGF2ZSBhdCBsZWFzdCBvbmUgZ3JvdXBhYmxlIGNvbHVtbiBpbiBvcmRlciB0aGUgR3JvdXBCeSBhcmVhIHRvIGJlIGRpc3BsYXllZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgZHJvcEFyZWFNZXNzYWdlPVwiRHJvcCBoZXJlIHRvIGdyb3VwIVwiPlxuICAgICAqICAgICAgPGlneC1jb2x1bW4gW2dyb3VwYWJsZV09XCJ0cnVlXCIgZmllbGQ9XCJJRFwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBkcm9wQXJlYU1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9kcm9wQXJlYU1lc3NhZ2UgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBkcm9wQXJlYU1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Ryb3BBcmVhTWVzc2FnZSB8fCB0aGlzLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9ncm91cEJ5QXJlYV9tZXNzYWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMS4wLiBVc2UgYGdldENlbGxCeUNvbHVtbmAgb3IgYGdldENlbGxCeUtleWAgaW5zdGVhZFxuICAgICAqXG4gICAgICogUmV0dXJucyBhIGBDZWxsVHlwZWAgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q2VsbCA9IHRoaXMuZ3JpZDEuZ2V0Q2VsbEJ5Q29sdW1uVmlzaWJsZUluZGV4KDIsXCJVbml0UHJpY2VcIik7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHJvd0luZGV4XG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgcHVibGljIGdldENlbGxCeUNvbHVtblZpc2libGVJbmRleChyb3dJbmRleDogbnVtYmVyLCBpbmRleDogbnVtYmVyKTogQ2VsbFR5cGUge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd0J5SW5kZXgocm93SW5kZXgpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmNvbHVtbkxpc3QuZmluZCgoY29sKSA9PiBjb2wudmlzaWJsZUluZGV4ID09PSBpbmRleCk7XG4gICAgICAgIGlmIChyb3cgJiYgcm93IGluc3RhbmNlb2YgSWd4R3JpZFJvdyAmJiAhcm93LmRhdGE/LmRldGFpbHNEYXRhICYmIGNvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZ3hHcmlkQ2VsbCh0aGlzLCByb3dJbmRleCwgY29sdW1uLmZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxpc3Qgb2YgZ3JvdXAgcm93cy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGdyb3VwTGlzdCA9IHRoaXMuZ3JpZC5ncm91cHNSb3dMaXN0O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZ3JvdXBzUm93TGlzdCgpIHtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IFF1ZXJ5TGlzdDxhbnk+KCk7XG4gICAgICAgIGlmICghdGhpcy5fZ3JvdXBzUm93TGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByTGlzdCA9IHRoaXMuX2dyb3Vwc1Jvd0xpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gbnVsbClcbiAgICAgICAgICAgIC5zb3J0KChpdGVtMSwgaXRlbTIpID0+IGl0ZW0xLmluZGV4IC0gaXRlbTIuaW5kZXgpO1xuICAgICAgICByZXMucmVzZXQockxpc3QpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGdyb3VwQnlSb3dTZWxlY3RvclRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPElneEdyb3VwQnlSb3dTZWxlY3RvckRpcmVjdGl2ZT4ge1xuICAgICAgICBpZiAodGhpcy5ncm91cEJ5Um93U2VsZWN0b3JzVGVtcGxhdGVzICYmIHRoaXMuZ3JvdXBCeVJvd1NlbGVjdG9yc1RlbXBsYXRlcy5maXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBCeVJvd1NlbGVjdG9yc1RlbXBsYXRlcy5maXJzdC50ZW1wbGF0ZVJlZjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXREZXRhaWxzQ29udGV4dChyb3dEYXRhLCBpbmRleCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGltcGxpY2l0OiByb3dEYXRhLFxuICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBkZXRhaWxzVmlld0ZvY3VzZWQoY29udGFpbmVyLCByb3dJbmRleCkge1xuICAgICAgICB0aGlzLm5hdmlnYXRpb24uc2V0QWN0aXZlTm9kZSh7IHJvdzogcm93SW5kZXggfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc0RldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZGV0YWlsVGVtcGxhdGUubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldFJvd1RlbXBsYXRlKHJvd0RhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHcm91cEJ5UmVjb3JkKHJvd0RhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0R3JvdXBUZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzU3VtbWFyeVJvdyhyb3dEYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VtbWFyeVRlbXBsYXRlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzRGV0YWlscyAmJiB0aGlzLmlzRGV0YWlsUmVjb3JkKHJvd0RhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXRhaWxUZW1wbGF0ZUNvbnRhaW5lcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlY29yZFRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNEZXRhaWxSZWNvcmQocmVjb3JkKSB7XG4gICAgICAgIHJldHVybiByZWNvcmQgJiYgcmVjb3JkLmRldGFpbHNEYXRhICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNEZXRhaWxBY3RpdmUocm93SW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdGlvbi5hY3RpdmVOb2RlID8gdGhpcy5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUucm93ID09PSByb3dJbmRleCA6IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgdGVtcGxhdGUgcmVmZXJlbmNlIGZvciB0aGUgZ3JvdXAgcm93LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBcbiAgICAgKiBjb25zdCBncm91cFJvd1RlbXBsYXRlID0gdGhpcy5ncmlkLmdyb3VwUm93VGVtcGxhdGU7XG4gICAgICogdGhpcy5ncmlkLmdyb3VwUm93VGVtcGxhdGUgPSBteVJvd1RlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZ3JvdXBSb3dUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwUm93VGVtcGxhdGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBncm91cFJvd1RlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX2dyb3VwUm93VGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIHRlbXBsYXRlIHJlZmVyZW5jZSBvZiB0aGUgYElneEdyaWRDb21wb25lbnRgJ3MgZ3JvdXAgYXJlYS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGdyb3VwQXJlYVRlbXBsYXRlID0gdGhpcy5ncmlkLmdyb3VwQXJlYVRlbXBsYXRlO1xuICAgICAqIHRoaXMuZ3JpZC5ncm91cEFyZWFUZW1wbGF0ZSA9IG15QXJlYVRlbXBsYXRlLlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZ3JvdXBBcmVhVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncm91cEFyZWFUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGdyb3VwQXJlYVRlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX2dyb3VwQXJlYVRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB0cmFja0NoYW5nZXM6IChpbmRleCwgcmVjKSA9PiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBHcm91cHMgYnkgYSBuZXcgYElneENvbHVtbkNvbXBvbmVudGAgYmFzZWQgb24gdGhlIHByb3ZpZGVkIGV4cHJlc3Npb24sIG9yIG1vZGlmaWVzIGFuIGV4aXN0aW5nIG9uZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQWxzbyBhbGxvd3MgZm9yIG11bHRpcGxlIGNvbHVtbnMgdG8gYmUgZ3JvdXBlZCBhdCBvbmNlIGlmIGFuIGFycmF5IG9mIGBJU29ydGluZ0V4cHJlc3Npb25gIGlzIHBhc3NlZC5cbiAgICAgKiBUaGUgb25Hcm91cGluZ0RvbmUgZXZlbnQgd291bGQgZ2V0IHJhaXNlZCBvbmx5ICoqb25jZSoqIGlmIHRoaXMgbWV0aG9kIGdldHMgY2FsbGVkIG11bHRpcGxlIHRpbWVzIHdpdGggdGhlIHNhbWUgYXJndW1lbnRzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5ncm91cEJ5KHsgZmllbGROYW1lOiBuYW1lLCBkaXI6IFNvcnRpbmdEaXJlY3Rpb24uQXNjLCBpZ25vcmVDYXNlOiBmYWxzZSB9KTtcbiAgICAgKiB0aGlzLmdyaWQuZ3JvdXBCeShbXG4gICAgICogICAgIHsgZmllbGROYW1lOiBuYW1lMSwgZGlyOiBTb3J0aW5nRGlyZWN0aW9uLkFzYywgaWdub3JlQ2FzZTogZmFsc2UgfSxcbiAgICAgKiAgICAgeyBmaWVsZE5hbWU6IG5hbWUyLCBkaXI6IFNvcnRpbmdEaXJlY3Rpb24uRGVzYywgaWdub3JlQ2FzZTogdHJ1ZSB9LFxuICAgICAqICAgICB7IGZpZWxkTmFtZTogbmFtZTMsIGRpcjogU29ydGluZ0RpcmVjdGlvbi5EZXNjLCBpZ25vcmVDYXNlOiBmYWxzZSB9XG4gICAgICogXSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdyb3VwQnkoZXhwcmVzc2lvbjogSUdyb3VwaW5nRXhwcmVzc2lvbiB8IEFycmF5PElHcm91cGluZ0V4cHJlc3Npb24+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrSWZOb0NvbHVtbkZpZWxkKGV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KGZhbHNlKTtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5fZ3JpZEFQSS5ncm91cEJ5X211bHRpcGxlKGV4cHJlc3Npb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ3JpZEFQSS5ncm91cEJ5KGV4cHJlc3Npb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgZ3JvdXBpbmcgZm9yIHBhcnRpY3VsYXIgY29sdW1uLCBhcnJheSBvZiBjb2x1bW5zIG9yIGFsbCBjb2x1bW5zLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBDbGVhcnMgYWxsIGdyb3VwaW5nIGluIHRoZSBncmlkLCBpZiBubyBwYXJhbWV0ZXIgaXMgcGFzc2VkLlxuICAgICAqIElmIGEgcGFyYW1ldGVyIGlzIHByb3ZpZGVkLCBjbGVhcnMgZ3JvdXBpbmcgZm9yIGEgcGFydGljdWxhciBjb2x1bW4gb3IgYW4gYXJyYXkgb2YgY29sdW1ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuY2xlYXJHcm91cGluZygpOyAvL2NsZWFycyBhbGwgZ3JvdXBpbmdcbiAgICAgKiB0aGlzLmdyaWQuY2xlYXJHcm91cGluZyhcIklEXCIpOyAvL3VuZ3JvdXBzIGEgc2luZ2xlIGNvbHVtblxuICAgICAqIHRoaXMuZ3JpZC5jbGVhckdyb3VwaW5nKFtcIklEXCIsIFwiQ29sdW1uMVwiLCBcIkNvbHVtbjJcIl0pOyAvL3VuZ3JvdXBzIG11bHRpcGxlIGNvbHVtbnNcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIGNvbHVtbiBvciBhcnJheSBvZiBjb2x1bW4gbmFtZXMgdG8gYmUgdW5ncm91cGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhckdyb3VwaW5nKG5hbWU/OiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2dyaWRBUEkuY2xlYXJfZ3JvdXBieShuYW1lKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVHcmlkU2l6ZXMoKTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgYSBncm91cCBpcyBleHBhbmRlZCBvciBub3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ3JvdXAgVGhlIGdyb3VwIHJlY29yZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgZ3JvdXBSb3c6IElHcm91cEJ5UmVjb3JkO1xuICAgICAqIGNvbnN0IGV4cGFuZGVkR3JvdXAgPSB0aGlzLmdyaWQuaXNFeHBhbmRlZEdyb3VwKHRoaXMuZ3JvdXBSb3cpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBpc0V4cGFuZGVkR3JvdXAoZ3JvdXA6IElHcm91cEJ5UmVjb3JkKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHN0YXRlOiBJR3JvdXBCeUV4cGFuZFN0YXRlID0gdGhpcy5fZ2V0U3RhdGVGb3JHcm91cFJvdyhncm91cCk7XG4gICAgICAgIHJldHVybiBzdGF0ZSA/IHN0YXRlLmV4cGFuZGVkIDogdGhpcy5ncm91cHNFeHBhbmRlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBleHBhbnNpb24gc3RhdGUgb2YgYSBncm91cC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBncm91cFJvdyBUaGUgZ3JvdXAgcmVjb3JkIHRvIHRvZ2dsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgZ3JvdXBSb3c6IElHcm91cEJ5UmVjb3JkO1xuICAgICAqIGNvbnN0IHRvZ2dsZUV4cEdyb3VwID0gdGhpcy5ncmlkLnRvZ2dsZUdyb3VwKHRoaXMuZ3JvdXBSb3cpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVHcm91cChncm91cFJvdzogSUdyb3VwQnlSZWNvcmQpIHtcbiAgICAgICAgdGhpcy5fdG9nZ2xlR3JvdXAoZ3JvdXBSb3cpO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgYWxsIHJvd3Mgd2l0aGluIGEgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ3JvdXBSb3c6IFRoZSBncm91cCByZWNvcmQgd2hpY2ggcm93cyB3b3VsZCBiZSBzZWxlY3RlZC5cbiAgICAgKiBAcGFyYW0gY2xlYXJDdXJyZW50U2VsZWN0aW9uIGlmIHRydWUgY2xlYXJzIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZC5zZWxlY3RSb3dzSW5Hcm91cCh0aGlzLmdyb3VwUm93LCB0cnVlKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0Um93c0luR3JvdXAoZ3JvdXBSb3c6IElHcm91cEJ5UmVjb3JkLCBjbGVhclByZXZTZWxlY3Rpb24/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2dyaWRBUEkuZ3JvdXBCeV9zZWxlY3RfYWxsX3Jvd3NfaW5fZ3JvdXAoZ3JvdXBSb3csIGNsZWFyUHJldlNlbGVjdGlvbik7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0IGFsbCByb3dzIHdpdGhpbiBhIGdyb3VwLlxuICAgICAqXG4gICAgICogQHBhcmFtIGdyb3VwUm93IFRoZSBncm91cCByZWNvcmQgd2hpY2ggcm93cyB3b3VsZCBiZSBkZXNlbGVjdGVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBncm91cFJvdzogSUdyb3VwQnlSZWNvcmQ7XG4gICAgICogdGhpcy5ncmlkLmRlc2VsZWN0Um93c0luR3JvdXAodGhpcy5ncm91cFJvdyk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGRlc2VsZWN0Um93c0luR3JvdXAoZ3JvdXBSb3c6IElHcm91cEJ5UmVjb3JkKSB7XG4gICAgICAgIHRoaXMuX2dyaWRBUEkuZ3JvdXBCeV9kZXNlbGVjdF9hbGxfcm93c19pbl9ncm91cChncm91cFJvdyk7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4cGFuZHMgdGhlIHNwZWNpZmllZCBncm91cCBhbmQgYWxsIG9mIGl0cyBwYXJlbnQgZ3JvdXBzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGdyb3VwUm93IFRoZSBncm91cCByZWNvcmQgdG8gZnVsbHkgZXhwYW5kLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBncm91cFJvdzogSUdyb3VwQnlSZWNvcmQ7XG4gICAgICogdGhpcy5ncmlkLmZ1bGx5RXhwYW5kR3JvdXAodGhpcy5ncm91cFJvdyk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGZ1bGx5RXhwYW5kR3JvdXAoZ3JvdXBSb3c6IElHcm91cEJ5UmVjb3JkKSB7XG4gICAgICAgIHRoaXMuX2Z1bGx5RXhwYW5kR3JvdXAoZ3JvdXBSb3cpO1xuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBpc0dyb3VwQnlSZWNvcmQocmVjb3JkOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgLy8gcmV0dXJuIHJlY29yZC5yZWNvcmRzIGluc3RhbmNlIG9mIEdyb3VwZWRSZWNvcmRzIGZhaWxzIHVuZGVyIFdlYnBhY2tcbiAgICAgICAgcmV0dXJuIHJlY29yZCAmJiByZWNvcmQ/LnJlY29yZHMgJiYgcmVjb3JkLnJlY29yZHM/Lmxlbmd0aCAmJlxuICAgICAgICAgcmVjb3JkLmV4cHJlc3Npb24gJiYgcmVjb3JkLmV4cHJlc3Npb24/LmZpZWxkTmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBleHBhbnNpb24gc3RhdGUgb2YgYWxsIGdyb3VwIHJvd3MgcmVjdXJzaXZlbHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQudG9nZ2xlQWxsR3JvdXBSb3dzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVBbGxHcm91cFJvd3MoKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZSA9IFtdO1xuICAgICAgICB0aGlzLmdyb3Vwc0V4cGFuZGVkID0gIXRoaXMuZ3JvdXBzRXhwYW5kZWQ7XG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgZ3JvdXBhYmxlIGNvbHVtbnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBncm91cGFibGVHcmlkID0gdGhpcy5ncmlkLmhhc0dyb3VwYWJsZUNvbHVtbnM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNHcm91cGFibGVDb2x1bW5zKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5MaXN0LnNvbWUoKGNvbCkgPT4gY29sLmdyb3VwYWJsZSAmJiAhY29sLmNvbHVtbkdyb3VwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGBJZ3hHcmlkQ29tcG9uZW50YCBoYXMgZ3JvdXAgYXJlYS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0dyb3VwQXJlYVZpc2libGUgPSB0aGlzLmdyaWQuc2hvd0dyb3VwQXJlYTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZ3JpZCAjZ3JpZCBbZGF0YV09XCJEYXRhXCIgW3Nob3dHcm91cEFyZWFdPVwiZmFsc2VcIj48L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzaG93R3JvdXBBcmVhKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hvd0dyb3VwQXJlYTtcbiAgICB9XG4gICAgcHVibGljIHNldCBzaG93R3JvdXBBcmVhKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Nob3dHcm91cEFyZWEgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgaWYgdGhlIGdyaWQncyBncm91cCBieSBkcm9wIGFyZWEgaXMgdmlzaWJsZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGRyb3BWaXNpYmxlID0gdGhpcy5ncmlkLmRyb3BBcmVhVmlzaWJsZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGRyb3BBcmVhVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uSW5EcmFnPy5ncm91cGFibGUgfHwgIXRoaXMuZ3JvdXBpbmdFeHByZXNzaW9ucy5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNDb2x1bW5Hcm91cGVkKGZpZWxkTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnMuZmluZChleHAgPT4gZXhwLmZpZWxkTmFtZSA9PT0gZmllbGROYW1lKSA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDb250ZXh0KHJvd0RhdGE6IGFueSwgcm93SW5kZXg6IG51bWJlciwgcGlubmVkPzogYm9vbGVhbik6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGV0YWlsUmVjb3JkKHJvd0RhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWREYXRhID0gdGhpcy5jaGlsZERldGFpbFRlbXBsYXRlcy5nZXQocm93RGF0YS5kZXRhaWxzRGF0YSk7XG4gICAgICAgICAgICBjb25zdCByb3dJRCA9IHRoaXMucHJpbWFyeUtleSA/IHJvd0RhdGEuZGV0YWlsc0RhdGFbdGhpcy5wcmltYXJ5S2V5XSA6IHJvd0RhdGEuZGV0YWlsc0RhdGE7XG4gICAgICAgICAgICBpZiAoY2FjaGVkRGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBjYWNoZWREYXRhLnZpZXc7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1scE91dGxldCA9IGNhY2hlZERhdGEub3duZXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJGltcGxpY2l0OiByb3dEYXRhLmRldGFpbHNEYXRhLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlVmlldzogdmlldyxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHRtbHBPdXRsZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiB0aGlzLmRhdGFWaWV3LmluZGV4T2Yocm93RGF0YSksXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlSUQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZXRhaWxSb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHJvd0lEXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjaGlsZCByb3dzIGNvbnRhaW4gdW5pcXVlIGdyaWRzLCBoZW5jZSBzaG91bGQgaGF2ZSB1bmlxdWUgdGVtcGxhdGVzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJGltcGxpY2l0OiByb3dEYXRhLmRldGFpbHNEYXRhLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUlEOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGV0YWlsUm93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dJRFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogdGhpcy5kYXRhVmlldy5pbmRleE9mKHJvd0RhdGEpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGltcGxpY2l0OiB0aGlzLmlzR2hvc3RSZWNvcmQocm93RGF0YSkgPyByb3dEYXRhLnJlY29yZFJlZiA6IHJvd0RhdGEsXG4gICAgICAgICAgICBpbmRleDogdGhpcy5nZXREYXRhVmlld0luZGV4KHJvd0luZGV4LCBwaW5uZWQpLFxuICAgICAgICAgICAgdGVtcGxhdGVJRDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuaXNHcm91cEJ5UmVjb3JkKHJvd0RhdGEpID8gJ2dyb3VwUm93JyA6IHRoaXMuaXNTdW1tYXJ5Um93KHJvd0RhdGEpID8gJ3N1bW1hcnlSb3cnIDogJ2RhdGFSb3cnLFxuICAgICAgICAgICAgICAgIGlkOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNHaG9zdFJlY29yZChyb3dEYXRhKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHZpZXdDcmVhdGVkSGFuZGxlcihhcmdzKSB7XG4gICAgICAgIGlmIChhcmdzLmNvbnRleHQudGVtcGxhdGVJRC50eXBlID09PSAnZGV0YWlsUm93Jykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZERldGFpbFRlbXBsYXRlcy5zZXQoYXJncy5jb250ZXh0LiRpbXBsaWNpdCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB2aWV3TW92ZWRIYW5kbGVyKGFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZ3MuY29udGV4dC50ZW1wbGF0ZUlELnR5cGUgPT09ICdkZXRhaWxSb3cnKSB7XG4gICAgICAgICAgICAvLyB2aWV3IHdhcyBtb3ZlZCwgdXBkYXRlIG93bmVyIGluIGNhY2hlXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBhcmdzLmNvbnRleHQuJGltcGxpY2l0O1xuICAgICAgICAgICAgY29uc3QgY2FjaGVkRGF0YSA9IHRoaXMuY2hpbGREZXRhaWxUZW1wbGF0ZXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBjYWNoZWREYXRhLm93bmVyID0gYXJncy5vd25lcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpY29uVGVtcGxhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdyb3Vwc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkZXJFeHBhbmRJbmRpY2F0b3JUZW1wbGF0ZSB8fCB0aGlzLmRlZmF1bHRFeHBhbmRlZFRlbXBsYXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyQ29sbGFwc2VJbmRpY2F0b3JUZW1wbGF0ZSB8fCB0aGlzLmRlZmF1bHRDb2xsYXBzZWRUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gICAgICAgIGlmICh0aGlzLmFsbG93RmlsdGVyaW5nICYmIHRoaXMuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJNb2RlID0gRmlsdGVyTW9kZS5leGNlbFN0eWxlRmlsdGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyb3VwVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dyb3VwUm93VGVtcGxhdGUgPSB0aGlzLmdyb3VwVGVtcGxhdGUudGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRldGFpbFRlbXBsYXRlLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+XG4gICAgICAgICAgICB0aGlzLnRyYWNrQ2hhbmdlcyA9IChfLCByZWMpID0+IChyZWM/LmRldGFpbHNEYXRhICE9PSB1bmRlZmluZWQgPyByZWMuZGV0YWlsc0RhdGEgOiByZWMpKTtcblxuICAgICAgICBpZiAodGhpcy5oaWRlR3JvdXBlZENvbHVtbnMgJiYgdGhpcy5jb2x1bW5MaXN0ICYmIHRoaXMuZ3JvdXBpbmdFeHByZXNzaW9ucykge1xuICAgICAgICAgICAgdGhpcy5fc2V0R3JvdXBDb2xzVmlzaWJpbGl0eSh0aGlzLmhpZGVHcm91cGVkQ29sdW1ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0dXBOYXZpZ2F0aW9uU2VydmljZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuYmVmb3JlVmlld0Rlc3Ryb3llZC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCh2aWV3KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gdmlldy5jb250ZXh0LiRpbXBsaWNpdDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGV0YWlsUmVjb3JkKHJvd0RhdGEpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVkRGF0YSA9IHRoaXMuY2hpbGREZXRhaWxUZW1wbGF0ZXMuZ2V0KHJvd0RhdGEuZGV0YWlsc0RhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZWREYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtbHBPdXRsZXQgPSBjYWNoZWREYXRhLm93bmVyO1xuICAgICAgICAgICAgICAgICAgICB0bWxwT3V0bGV0Ll92aWV3Q29udGFpbmVyUmVmLmRldGFjaCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc29ydGluZ0V4cHJlc3Npb25zQ2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKHNvcnRpbmdFeHByZXNzaW9uczogSVNvcnRpbmdFeHByZXNzaW9uW10pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5ncm91cGluZ0V4cHJlc3Npb25zIHx8ICF0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzb3J0aW5nRXhwcmVzc2lvbnMuZm9yRWFjaCgoc29ydEV4cHI6IElTb3J0aW5nRXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IHNvcnRFeHByLmZpZWxkTmFtZTtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cGluZ0V4cHIgPSB0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnMuZmluZChleCA9PiBleC5maWVsZE5hbWUgPT09IGZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwaW5nRXhwcikge1xuICAgICAgICAgICAgICAgICAgICBncm91cGluZ0V4cHIuZGlyID0gc29ydEV4cHIuZGlyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICAgICAgdGhpcy5vbkdyb3VwaW5nRG9uZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChhcmdzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5zdW1tYXJ5U2VydmljZS51cGRhdGVTdW1tYXJ5Q2FjaGUoYXJncyk7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJGZWF0dXJlc1dpZHRoID0gTmFOO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmdyb3VwaW5nRGlmZmVyICYmIHRoaXMuY29sdW1uTGlzdCAmJiAhdGhpcy5oYXNDb2x1bW5MYXlvdXRzKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5ncm91cGluZ0RpZmZlci5kaWZmKHRoaXMuZ3JvdXBpbmdFeHByZXNzaW9ucyk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcyAmJiB0aGlzLmNvbHVtbkxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNoYW5nZXMuZm9yRWFjaEFkZGVkSXRlbSgocmVjKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuZ2V0Q29sdW1uQnlOYW1lKHJlYy5pdGVtLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbC5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2hhbmdlcy5mb3JFYWNoUmVtb3ZlZEl0ZW0oKHJlYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmdldENvbHVtbkJ5TmFtZShyZWMuaXRlbS5maWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBjb2wuaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIubmdEb0NoZWNrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZGF0YUxvYWRpbmcoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kYXRhUHJlTG9hZC5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTZWxlY3RlZERhdGEoZm9ybWF0dGVycyA9IGZhbHNlLCBoZWFkZXJzID0gZmFsc2UpOiBhbnlbXSB7XG4gICAgICAgIGlmICh0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnMubGVuZ3RoIHx8IHRoaXMuaGFzRGV0YWlscykge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlID0gW107XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2Nlc3MgPSAocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZC5leHByZXNzaW9uIHx8IHJlY29yZC5zdW1tYXJpZXMgfHwgdGhpcy5pc0RldGFpbFJlY29yZChyZWNvcmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNvdXJjZS5wdXNoKHJlY29yZCk7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZGF0YVZpZXcuZm9yRWFjaChwcm9jZXNzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4dHJhY3REYXRhRnJvbVNlbGVjdGlvbihzb3VyY2UsIGZvcm1hdHRlcnMsIGhlYWRlcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmdldFNlbGVjdGVkRGF0YShmb3JtYXR0ZXJzLCBoZWFkZXJzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGBJZ3hHcmlkUm93YCBieSBpbmRleC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Um93ID0gZ3JpZC5nZXRSb3dCeUluZGV4KDEpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSb3dCeUluZGV4KGluZGV4OiBudW1iZXIpOiBSb3dUeXBlIHtcbiAgICAgICAgbGV0IHJvdzogUm93VHlwZTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kYXRhVmlldy5sZW5ndGggPj0gdGhpcy52aXJ0dWFsaXphdGlvblN0YXRlLnN0YXJ0SW5kZXggKyB0aGlzLnZpcnR1YWxpemF0aW9uU3RhdGUuY2h1bmtTaXplKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLmNyZWF0ZVJvdyhpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIShpbmRleCA8IHRoaXMudmlydHVhbGl6YXRpb25TdGF0ZS5zdGFydEluZGV4KSAmJiAhKGluZGV4ID4gdGhpcy52aXJ0dWFsaXphdGlvblN0YXRlLnN0YXJ0SW5kZXggKyB0aGlzLnZpcnR1YWxpemF0aW9uU3RhdGUuY2h1bmtTaXplKSkge1xuICAgICAgICAgICAgICAgIHJvdyA9IHRoaXMuY3JlYXRlUm93KGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyaWRBUEkuZ3JpZC5wYWdpbmdNb2RlID09PSAxICYmIHRoaXMuZ3JpZEFQSS5ncmlkLnBhZ2UgIT09IDApIHtcbiAgICAgICAgICAgIHJvdy5pbmRleCA9IGluZGV4ICsgdGhpcy5wYWdpbmF0b3IucGVyUGFnZSAqIHRoaXMucGFnaW5hdG9yLnBhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGBJZ3hHcmlkUm93YCBvYmplY3QgYnkgdGhlIHNwZWNpZmllZCBwcmltYXJ5IGtleS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUmVxdWlyZXMgdGhhdCB0aGUgYHByaW1hcnlLZXlgIHByb3BlcnR5IGlzIHNldC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteVJvdyA9IHRoaXMuZ3JpZDEuZ2V0Um93QnlLZXkoXCJjZWxsNVwiKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0ga2V5VmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Um93QnlLZXkoa2V5OiBhbnkpOiBSb3dUeXBlIHtcbiAgICAgICAgY29uc3QgcmVjID0gdGhpcy5maWx0ZXJlZFNvcnRlZERhdGEgPyB0aGlzLnByaW1hcnlLZXkgP1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFNvcnRlZERhdGEuZmluZChyZWNvcmQgPT4gcmVjb3JkW3RoaXMucHJpbWFyeUtleV0gPT09IGtleSkgOlxuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZFNvcnRlZERhdGEuZmluZChyZWNvcmQgPT4gcmVjb3JkID09PSBrZXkpIDogdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0YVZpZXcuaW5kZXhPZihyZWMpO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5kYXRhVmlldy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBJZ3hHcmlkUm93KHRoaXMgYXMgYW55LCBpbmRleCwgcmVjKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBhbGxSb3dzKCk6IFJvd1R5cGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFWaWV3Lm1hcCgocmVjLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmdNb2RlID09PSAxICYmIHRoaXMucGFnaW5hdG9yLnBhZ2UgIT09IDAgPyBpbmRleCA9IGluZGV4ICsgdGhpcy5wYWdpbmF0b3IucGVyUGFnZSAqIHRoaXMucGFnaW5hdG9yLnBhZ2UgOiBpbmRleCA9IHRoaXMuZGF0YVJvd0xpc3QuZmlyc3QuaW5kZXggKyBpbmRleDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVJvdyhpbmRleCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNvbGxlY3Rpb24gb2YgYElneEdyaWRSb3dgcyBmb3IgY3VycmVudCBwYWdlLlxuICAgICAqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZGF0YVJvd3MoKTogUm93VHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsUm93cygpLmZpbHRlcihyb3cgPT4gcm93IGluc3RhbmNlb2YgSWd4R3JpZFJvdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgc2VsZWN0ZWQgYElneEdyaWRDZWxsYHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBzZWxlY3RlZENlbGxzID0gdGhpcy5ncmlkLnNlbGVjdGVkQ2VsbHM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBzZWxlY3RlZENlbGxzKCk6IENlbGxUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhUm93cygpLm1hcCgocm93KSA9PiByb3cuY2VsbHMuZmlsdGVyKChjZWxsKSA9PiBjZWxsLnNlbGVjdGVkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGBDZWxsVHlwZWAgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q2VsbCA9IHRoaXMuZ3JpZDEuZ2V0Q2VsbEJ5Q29sdW1uKDIsIFwiVW5pdFByaWNlXCIpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByb3dJbmRleFxuICAgICAqIEBwYXJhbSBjb2x1bW5GaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDZWxsQnlDb2x1bW4ocm93SW5kZXg6IG51bWJlciwgY29sdW1uRmllbGQ6IHN0cmluZyk6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3dCeUluZGV4KHJvd0luZGV4KTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdGhpcy5jb2x1bW5MaXN0LmZpbmQoKGNvbCkgPT4gY29sLmZpZWxkID09PSBjb2x1bW5GaWVsZCk7XG4gICAgICAgIGlmIChyb3cgJiYgcm93IGluc3RhbmNlb2YgSWd4R3JpZFJvdyAmJiAhcm93LmRhdGE/LmRldGFpbHNEYXRhICYmIGNvbHVtbikge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5nTW9kZSA9PT0gMSAmJiB0aGlzLmdyaWRBUEkuZ3JpZC5wYWdlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcm93LmluZGV4ID0gcm93SW5kZXggKyB0aGlzLnBhZ2luYXRvci5wZXJQYWdlICogdGhpcy5wYWdpbmF0b3IucGFnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgSWd4R3JpZENlbGwodGhpcywgcm93LmluZGV4LCBjb2x1bW5GaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgYENlbGxUeXBlYCBvYmplY3QgdGhhdCBtYXRjaGVzIHRoZSBjb25kaXRpb25zLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBSZXF1aXJlcyB0aGF0IHRoZSBwcmltYXJ5S2V5IHByb3BlcnR5IGlzIHNldC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBncmlkLmdldENlbGxCeUtleSgxLCAnaW5kZXgnKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gcm93U2VsZWN0b3IgbWF0Y2ggYW55IHJvd0lEXG4gICAgICogQHBhcmFtIGNvbHVtbkZpZWxkXG4gICAgICovXG4gICAgcHVibGljIGdldENlbGxCeUtleShyb3dTZWxlY3RvcjogYW55LCBjb2x1bW5GaWVsZDogc3RyaW5nKTogQ2VsbFR5cGUge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd0J5S2V5KHJvd1NlbGVjdG9yKTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdGhpcy5jb2x1bW5MaXN0LmZpbmQoKGNvbCkgPT4gY29sLmZpZWxkID09PSBjb2x1bW5GaWVsZCk7XG4gICAgICAgIGlmIChyb3cgJiYgY29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IElneEdyaWRDZWxsKHRoaXMsIHJvdy5pbmRleCwgY29sdW1uRmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBpblJvdyhyb3dJRDogYW55LCBpbmRleD86IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd0J5S2V5KHJvd0lEKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnBpblJvdyhyb3dJRCwgaW5kZXgsIHJvdyk7XG4gICAgfVxuXG4gICAgcHVibGljIHVucGluUm93KHJvd0lEOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3dCeUtleShyb3dJRCk7XG4gICAgICAgIHJldHVybiBzdXBlci51bnBpblJvdyhyb3dJRCwgcm93KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBjcmVhdGVSb3coaW5kZXg6IG51bWJlciwgZGF0YT86IGFueSk6IFJvd1R5cGUge1xuICAgICAgICBsZXQgcm93OiBSb3dUeXBlO1xuICAgICAgICBsZXQgcmVjOiBhbnk7XG5cbiAgICAgICAgY29uc3QgZGF0YUluZGV4ID0gdGhpcy5fZ2V0RGF0YVZpZXdJbmRleChpbmRleCk7XG4gICAgICAgIHJlYyA9IGRhdGEgPz8gdGhpcy5kYXRhVmlld1tkYXRhSW5kZXhdO1xuXG4gICAgICAgIGlmIChyZWMgJiYgdGhpcy5pc0dyb3VwQnlSZWNvcmQocmVjKSkge1xuICAgICAgICAgICAgcm93ID0gbmV3IElneEdyb3VwQnlSb3codGhpcyBhcyBhbnksIGluZGV4LCByZWMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWMgJiYgdGhpcy5pc1N1bW1hcnlSb3cocmVjKSkge1xuICAgICAgICAgICAgcm93ID0gbmV3IElneFN1bW1hcnlSb3codGhpcyBhcyBhbnksIGluZGV4LCByZWMuc3VtbWFyaWVzLCBHcmlkSW5zdGFuY2VUeXBlLkdyaWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIGZvdW5kIHJlY29yZCBpcyBhIG5vIGEgZ3JvdXBieSBvciBzdW1tYXJ5IHJvdywgcmV0dXJuIElneEdyaWRSb3cgaW5zdGFuY2VcbiAgICAgICAgaWYgKCFyb3cgJiYgcmVjKSB7XG4gICAgICAgICAgICByb3cgPSBuZXcgSWd4R3JpZFJvdyh0aGlzIGFzIGFueSwgaW5kZXgsIHJlYyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldCBkZWZhdWx0VGFyZ2V0Qm9keUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMudG90YWxJdGVtQ291bnQgfHwgdGhpcy5kYXRhTGVuZ3RoO1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlZFJvd0hlaWdodCAqIE1hdGgubWluKHRoaXMuX2RlZmF1bHRUYXJnZXRSZWNvcmROdW1iZXIsXG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRvciA/IE1hdGgubWluKGFsbEl0ZW1zLCB0aGlzLnBhZ2luYXRvci5wZXJQYWdlKSA6IGFsbEl0ZW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRHcm91cEFyZWFIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBBcmVhID8gdGhpcy5nZXRDb21wdXRlZEhlaWdodCh0aGlzLmdyb3VwQXJlYS5uYXRpdmVFbGVtZW50KSA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Nyb2xsVG8ocm93OiBhbnkgfCBudW1iZXIsIGNvbHVtbjogYW55IHwgbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmdyb3VwaW5nRXhwcmVzc2lvbnMgJiYgdGhpcy5ncm91cGluZ0V4cHJlc3Npb25zLmxlbmd0aFxuICAgICAgICAgICAgJiYgdHlwZW9mIChyb3cpICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLmdyb3VwaW5nUmVzdWx0LmluZGV4T2Yocm93KTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwQnlSZWNvcmQgPSB0aGlzLmdyb3VwaW5nTWV0YWRhdGFbcm93SW5kZXhdO1xuICAgICAgICAgICAgaWYgKGdyb3VwQnlSZWNvcmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxseUV4cGFuZEdyb3VwKGdyb3VwQnlSZWNvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIuc2Nyb2xsVG8ocm93LCBjb2x1bW4sIHRoaXMuZ3JvdXBpbmdGbGF0UmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZ2V0U3RhdGVGb3JHcm91cFJvdyhncm91cFJvdzogSUdyb3VwQnlSZWNvcmQpOiBJR3JvdXBCeUV4cGFuZFN0YXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyaWRBUEkuZ3JvdXBCeV9nZXRfZXhwYW5kZWRfZm9yX2dyb3VwKGdyb3VwUm93KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF90b2dnbGVHcm91cChncm91cFJvdzogSUdyb3VwQnlSZWNvcmQpIHtcbiAgICAgICAgdGhpcy5fZ3JpZEFQSS5ncm91cEJ5X3RvZ2dsZV9ncm91cChncm91cFJvdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2Z1bGx5RXhwYW5kR3JvdXAoZ3JvdXBSb3c6IElHcm91cEJ5UmVjb3JkKSB7XG4gICAgICAgIHRoaXMuX2dyaWRBUEkuZ3JvdXBCeV9mdWxseV9leHBhbmRfZ3JvdXAoZ3JvdXBSb3cpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9hcHBseUdyb3VwaW5nKCkge1xuICAgICAgICB0aGlzLl9ncmlkQVBJLnNvcnRfbXVsdGlwbGUodGhpcy5fZ3JvdXBpbmdFeHByZXNzaW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0dXBOYXZpZ2F0aW9uU2VydmljZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uID0gbmV3IElneEdyaWRNUkxOYXZpZ2F0aW9uU2VydmljZSh0aGlzLnBsYXRmb3JtKTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbi5ncmlkID0gdGhpcyBhcyBhbnk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrSWZOb0NvbHVtbkZpZWxkKGV4cHJlc3Npb246IElHcm91cGluZ0V4cHJlc3Npb24gfCBBcnJheTxJR3JvdXBpbmdFeHByZXNzaW9uPiB8IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNpbmdsZUV4cHJlc3Npb24gb2YgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIGlmICghc2luZ2xlRXhwcmVzc2lvbi5maWVsZE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhZXhwcmVzc2lvbi5maWVsZE5hbWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0R3JvdXBDb2xzVmlzaWJpbGl0eSh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW5MaXN0Lmxlbmd0aCA+IDAgJiYgIXRoaXMuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgdGhpcy5ncm91cGluZ0V4cHJlc3Npb25zLmZvckVhY2goKGV4cHIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmdldENvbHVtbkJ5TmFtZShleHByLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgY29sLmhpZGRlbiA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCI8IS0tIFRvb2xiYXIgYXJlYSAtLT5cbjxuZy1jb250ZW50IHNlbGVjdD1cImlneC1ncmlkLXRvb2xiYXJcIj48L25nLWNvbnRlbnQ+XG5cbjwhLS0gR3JvdXAtYnkgYXJlYSAtLT5cbjxuZy1jb250YWluZXIgKm5nSWY9XCJzaG93R3JvdXBBcmVhICYmIChncm91cGluZ0V4cHJlc3Npb25zLmxlbmd0aCA+IDAgfHwgaGFzR3JvdXBhYmxlQ29sdW1ucylcIj5cbiAgICA8aWd4LWdyaWQtZ3JvdXAtYnktYXJlYSAjZ3JvdXBBcmVhIFtzdHlsZS5mbGV4LWJhc2lzLnB4XT0nb3V0ZXJXaWR0aCdcbiAgICAgICAgW2dyaWRdPVwidGhpc1wiXG4gICAgICAgIFtleHByZXNzaW9uc109XCJncm91cGluZ0V4cHJlc3Npb25zXCJcbiAgICAgICAgW3NvcnRpbmdFeHByZXNzaW9uc109XCJzb3J0aW5nRXhwcmVzc2lvbnNcIlxuICAgICAgICBbZGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiXG4gICAgICAgIFtkcm9wQXJlYVRlbXBsYXRlXT1cImRyb3BBcmVhVGVtcGxhdGVcIlxuICAgICAgICBbZHJvcEFyZWFNZXNzYWdlXT1cImRyb3BBcmVhTWVzc2FnZVwiXG4gICAgPlxuICAgIDwvaWd4LWdyaWQtZ3JvdXAtYnktYXJlYT5cbjwvbmctY29udGFpbmVyPlxuXG48IS0tIEdyaWQgdGFibGUgaGVhZCByb3cgYXJlYSAtLT5cbjxpZ3gtZ3JpZC1oZWFkZXItcm93IGNsYXNzPVwiaWd4LWdyaWQtdGhlYWRcIiB0YWJpbmRleD1cIjBcIlxuICAgIFtncmlkXT1cInRoaXNcIlxuICAgIFtoYXNNUkxdPVwiaGFzQ29sdW1uTGF5b3V0c1wiXG4gICAgW2RlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIlxuICAgIFthY3RpdmVEZXNjZW5kYW50XT1cImFjdGl2ZURlc2NlbmRhbnRcIlxuICAgIFt3aWR0aF09XCJjYWxjV2lkdGhcIlxuICAgIFtwaW5uZWRDb2x1bW5Db2xsZWN0aW9uXT1cInBpbm5lZENvbHVtbnNcIlxuICAgIFt1bnBpbm5lZENvbHVtbkNvbGxlY3Rpb25dPVwidW5waW5uZWRDb2x1bW5zXCJcbiAgICAoa2V5ZG93bi5tZXRhLmMpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiXG4gICAgKGtleWRvd24uY29udHJvbC5jKT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChjb3B5KT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChrZXlkb3duKT1cIm5hdmlnYXRpb24uaGVhZGVyTmF2aWdhdGlvbigkZXZlbnQpXCJcbiAgICAoc2Nyb2xsKT1cInByZXZlbnRIZWFkZXJTY3JvbGwoJGV2ZW50KVwiXG4gICAgKGZvY3VzKT1cIm5hdmlnYXRpb24uZm9jdXNGaXJzdENlbGwoKVwiXG4+XG48L2lneC1ncmlkLWhlYWRlci1yb3c+XG5cbjxkaXYgaWd4R3JpZEJvZHkgKGtleWRvd24uY29udHJvbC5jKT1cImNvcHlIYW5kbGVyKCRldmVudClcIiAoY29weSk9XCJjb3B5SGFuZGxlcigkZXZlbnQpXCIgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHlcIiByb2xlPVwicm93Z3JvdXBcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LWNvbnRlbnRcIiB0YWJpbmRleD1cIjBcIiBbYXR0ci5yb2xlXT1cImRhdGFWaWV3Lmxlbmd0aCA/IG51bGwgOiAncm93J1wiIChrZXlkb3duKT1cIm5hdmlnYXRpb24uaGFuZGxlTmF2aWdhdGlvbigkZXZlbnQpXCIgKGZvY3VzKT1cIm5hdmlnYXRpb24uZm9jdXNUYm9keSgkZXZlbnQpXCJcbiAgICAgICAgKGRyYWdTdG9wKT1cInNlbGVjdGlvblNlcnZpY2UuZHJhZ01vZGUgPSAkZXZlbnRcIiAoc2Nyb2xsKT0ncHJldmVudENvbnRhaW5lclNjcm9sbCgkZXZlbnQpJ1xuICAgICAgICAoZHJhZ1Njcm9sbCk9XCJkcmFnU2Nyb2xsKCRldmVudClcIiBbaWd4R3JpZERyYWdTZWxlY3RdPVwic2VsZWN0aW9uU2VydmljZS5kcmFnTW9kZVwiXG4gICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPSd0b3RhbEhlaWdodCcgW3N0eWxlLndpZHRoLnB4XT0nY2FsY1dpZHRoIHx8IG51bGwnICN0Ym9keSBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiYWN0aXZlRGVzY2VuZGFudFwiPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWcgJiYgcGlubmVkQ29sdW1ucy5sZW5ndGggPD0gMFwiXG4gICAgICAgICAgICBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiIGlkPVwibGVmdFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtb24tZHJhZy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWcgJiYgcGlubmVkQ29sdW1ucy5sZW5ndGggPiAwXCJcbiAgICAgICAgICAgIFtpZ3hDb2x1bW5Nb3ZpbmdEcm9wXT1cImhlYWRlckNvbnRhaW5lclwiIFthdHRyLmRyb3BwYWJsZV09XCJ0cnVlXCIgaWQ9XCJsZWZ0XCJcbiAgICAgICAgICAgIGNsYXNzPVwiaWd4LWdyaWRfX3Njcm9sbC1vbi1kcmFnLXBpbm5lZFwiIFtzdHlsZS5sZWZ0LnB4XT1cInBpbm5lZFdpZHRoXCI+PC9zcGFuPlxuICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoYXNQaW5uZWRSZWNvcmRzICYmIGlzUm93UGlubmluZ1RvVG9wID8gcGlubmVkUmVjb3Jkc1RlbXBsYXRlIDogbnVsbFwiPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy10ZW1wbGF0ZSAjcGlubmVkUmVjb3Jkc1RlbXBsYXRlPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPSdkYXRhXG4gICAgICAgIHwgZ3JpZFRyYW5zYWN0aW9uOmlkOnBpcGVUcmlnZ2VyXG4gICAgICAgIHwgdmlzaWJsZUNvbHVtbnM6aGFzVmlzaWJsZUNvbHVtbnNcbiAgICAgICAgfCBncmlkQWRkUm93OnRydWU6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBncmlkUm93UGlubmluZzppZDp0cnVlOnBpcGVUcmlnZ2VyXG4gICAgICAgIHwgZ3JpZEZpbHRlcmluZzpmaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU6ZmlsdGVyU3RyYXRlZ3k6YWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU6aWQ6cGlwZVRyaWdnZXI6ZmlsdGVyaW5nUGlwZVRyaWdnZXI6dHJ1ZVxuICAgICAgICB8IGdyaWRTb3J0OnNvcnRpbmdFeHByZXNzaW9uczpzb3J0U3RyYXRlZ3k6aWQ6cGlwZVRyaWdnZXI6dHJ1ZSBhcyBwaW5uZWREYXRhJz5cbiAgICAgICAgICAgIDxkaXYgI3BpbkNvbnRhaW5lciAqbmdJZj0ncGlubmVkRGF0YS5sZW5ndGggPiAwJ1xuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAgICAgJ2lneC1ncmlkX190ci0tcGlubmVkLWJvdHRvbSc6ICAhaXNSb3dQaW5uaW5nVG9Ub3AsXG4gICAgICAgICAgICAgICAgICAgICdpZ3gtZ3JpZF9fdHItLXBpbm5lZC10b3AnOiBpc1Jvd1Bpbm5pbmdUb1RvcFxuICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgIGNsYXNzPSdpZ3gtZ3JpZF9fdHItLXBpbm5lZCcgW3N0eWxlLndpZHRoLnB4XT0nY2FsY1dpZHRoJz5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCByb3dEYXRhIG9mIHBpbm5lZERhdGE7IGxldCByb3dJbmRleCA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwaW5uZWRfcmVjb3JkX3RlbXBsYXRlOyBjb250ZXh0OiBnZXRDb250ZXh0KHJvd0RhdGEsIHJvd0luZGV4LCB0cnVlKVwiPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgaWd4R3JpZEZvciBsZXQtcm93RGF0YSBbaWd4R3JpZEZvck9mXT1cImRhdGFcbiAgICAgICAgfCBncmlkVHJhbnNhY3Rpb246aWQ6cGlwZVRyaWdnZXJcbiAgICAgICAgfCB2aXNpYmxlQ29sdW1uczpoYXNWaXNpYmxlQ29sdW1uc1xuICAgICAgICB8IGdyaWRGaWx0ZXJpbmc6ZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOmZpbHRlclN0cmF0ZWd5OmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOmlkOnBpcGVUcmlnZ2VyOmZpbHRlcmluZ1BpcGVUcmlnZ2VyXG4gICAgICAgIHwgZ3JpZFNvcnQ6c29ydGluZ0V4cHJlc3Npb25zOnNvcnRTdHJhdGVneTppZDpwaXBlVHJpZ2dlclxuICAgICAgICB8IGdyaWRHcm91cEJ5Omdyb3VwaW5nRXhwcmVzc2lvbnM6Z3JvdXBpbmdFeHBhbnNpb25TdGF0ZTpncm91cFN0cmF0ZWd5Omdyb3Vwc0V4cGFuZGVkOmlkOmdyb3Vwc1JlY29yZHM6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBncmlkUGFnaW5nOnBhZ2luYXRvcj8ucGFnZTpwYWdpbmF0b3I/LnBlclBhZ2U6aWQ6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBncmlkU3VtbWFyeTpoYXNTdW1tYXJpemVkQ29sdW1uczpzdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlOnN1bW1hcnlQb3NpdGlvbjppZDpzaG93U3VtbWFyeU9uQ29sbGFwc2U6cGlwZVRyaWdnZXI6c3VtbWFyeVBpcGVUcmlnZ2VyXG4gICAgICAgIHwgZ3JpZERldGFpbHM6aGFzRGV0YWlsczpleHBhbnNpb25TdGF0ZXM6cGlwZVRyaWdnZXJcbiAgICAgICAgfCBncmlkQWRkUm93OmZhbHNlOnBpcGVUcmlnZ2VyXG4gICAgICAgIHwgZ3JpZFJvd1Bpbm5pbmc6aWQ6ZmFsc2U6cGlwZVRyaWdnZXJcIlxuICAgICAgICAgICAgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBbaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb25dPVwiJ3ZlcnRpY2FsJ1wiIFtpZ3hGb3JTY3JvbGxDb250YWluZXJdPSd2ZXJ0aWNhbFNjcm9sbCdcbiAgICAgICAgICAgIFtpZ3hGb3JDb250YWluZXJTaXplXT0nY2FsY0hlaWdodCdcbiAgICAgICAgICAgIFtpZ3hGb3JJdGVtU2l6ZV09XCJoYXNDb2x1bW5MYXlvdXRzID8gcm93SGVpZ2h0ICogbXVsdGlSb3dMYXlvdXRSb3dTaXplICsgMSA6IHJlbmRlcmVkUm93SGVpZ2h0XCJcbiAgICAgICAgICAgIFtpZ3hGb3JUcmFja0J5XT0ndHJhY2tDaGFuZ2VzJ1xuICAgICAgICAgICAgI3ZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyIChjaHVua1ByZWxvYWQpPVwiZGF0YUxvYWRpbmcoJGV2ZW50KVwiIChkYXRhQ2hhbmdpbmcpPVwiZGF0YVJlYmluZGluZygkZXZlbnQpXCIgKGRhdGFDaGFuZ2VkKT1cImRhdGFSZWJvdW5kKCRldmVudClcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIFtpZ3hUZW1wbGF0ZU91dGxldF09J2dldFJvd1RlbXBsYXRlKHJvd0RhdGEpJ1xuICAgICAgICAgICAgICAgIFtpZ3hUZW1wbGF0ZU91dGxldENvbnRleHRdPSdnZXRDb250ZXh0KHJvd0RhdGEsIHJvd0luZGV4KSdcbiAgICAgICAgICAgICAgICAoY2FjaGVkVmlld0xvYWRlZCk9J2NhY2hlZFZpZXdMb2FkZWQoJGV2ZW50KSdcbiAgICAgICAgICAgICAgICAodmlld0NyZWF0ZWQpPSd2aWV3Q3JlYXRlZEhhbmRsZXIoJGV2ZW50KSdcbiAgICAgICAgICAgICAgICAodmlld01vdmVkKT0ndmlld01vdmVkSGFuZGxlcigkZXZlbnQpJz5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoYXNQaW5uZWRSZWNvcmRzICYmICFpc1Jvd1Bpbm5pbmdUb1RvcCA/IHBpbm5lZFJlY29yZHNUZW1wbGF0ZSA6IG51bGxcIj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcmVjb3JkX3RlbXBsYXRlIGxldC1yb3dJbmRleD1cImluZGV4XCIgbGV0LXJvd0RhdGEgbGV0LWRpc2FibGVkUm93PVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxpZ3gtZ3JpZC1yb3cgW2dyaWRJRF09XCJpZFwiIFtpbmRleF09XCJyb3dJbmRleFwiIFtkYXRhXT1cInJvd0RhdGFcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRSb3dcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInJvd0NsYXNzZXMgfCBpZ3hHcmlkUm93Q2xhc3Nlczpyb3c6cm93LmluRWRpdE1vZGU6cm93LnNlbGVjdGVkOnJvdy5kaXJ0eTpyb3cuZGVsZXRlZDpyb3cuZHJhZ2dpbmc6cm93SW5kZXg6aGFzQ29sdW1uTGF5b3V0czpmYWxzZTpyb3dEYXRhOnBpcGVUcmlnZ2VyXCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJyb3dTdHlsZXMgfCBpZ3hHcmlkUm93U3R5bGVzOnJvd0RhdGE6cm93SW5kZXg6cGlwZVRyaWdnZXJcIiAjcm93PlxuICAgICAgICAgICAgPC9pZ3gtZ3JpZC1yb3c+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcGlubmVkX3JlY29yZF90ZW1wbGF0ZSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIGxldC1yb3dEYXRhPlxuICAgICAgICAgICAgPGlneC1ncmlkLXJvdyBbZ3JpZElEXT1cImlkXCIgW2luZGV4XT1cInJvd0luZGV4XCIgW2RhdGFdPVwicm93RGF0YVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwicm93Q2xhc3NlcyB8IGlneEdyaWRSb3dDbGFzc2VzOnJvdzpyb3cuaW5FZGl0TW9kZTpyb3cuc2VsZWN0ZWQ6cm93LmRpcnR5OnJvdy5kZWxldGVkOnJvdy5kcmFnZ2luZzpyb3dJbmRleDpoYXNDb2x1bW5MYXlvdXRzOmZhbHNlOnJvd0RhdGE6cGlwZVRyaWdnZXJcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInJvd1N0eWxlcyB8IGlneEdyaWRSb3dTdHlsZXM6cm93RGF0YTpyb3dJbmRleDpwaXBlVHJpZ2dlclwiI3JvdyAjcGlubmVkUm93PlxuICAgICAgICAgICAgPC9pZ3gtZ3JpZC1yb3c+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZ3JvdXBfdGVtcGxhdGUgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBsZXQtcm93RGF0YT5cbiAgICAgICAgICAgIDxpZ3gtZ3JpZC1ncm91cGJ5LXJvdyBbZ3JpZElEXT1cImlkXCIgW2luZGV4XT1cInJvd0luZGV4XCIgW2dyb3VwUm93XT1cInJvd0RhdGFcIiBbaGlkZUdyb3VwUm93U2VsZWN0b3JzXT1cImhpZGVSb3dTZWxlY3RvcnNcIiBbcm93RHJhZ2dhYmxlXT1cInJvd0RyYWdnYWJsZVwiICNyb3c+XG4gICAgICAgICAgICA8L2lneC1ncmlkLWdyb3VwYnktcm93PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI3N1bW1hcnlfdGVtcGxhdGUgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBsZXQtcm93RGF0YT5cbiAgICAgICAgICAgIDxpZ3gtZ3JpZC1zdW1tYXJ5LXJvdyByb2xlPVwicm93XCIgW2dyaWRJRF09XCJpZFwiIFtzdW1tYXJpZXNdPVwicm93RGF0YS5zdW1tYXJpZXNcIiBbaW5kZXhdPVwicm93SW5kZXhcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiaWd4LWdyaWRfX3N1bW1hcmllcy0tYm9keVwiICNzdW1tYXJ5Um93PlxuICAgICAgICAgICAgPC9pZ3gtZ3JpZC1zdW1tYXJ5LXJvdz5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZXRhaWxfdGVtcGxhdGVfY29udGFpbmVyIGxldC1yb3dJbmRleD1cImluZGV4XCIgbGV0LXJvd0RhdGE+XG4gICAgICAgICAgICA8ZGl2IGRldGFpbD0ndHJ1ZScgc3R5bGU9XCJvdmVyZmxvdzogYXV0bzsgd2lkdGg6IDEwMCU7XCIgaWQ9XCJ7e2lkfX1fe3tyb3dJbmRleH19XCIgKHBvaW50ZXJkb3duKT0nZGV0YWlsc1ZpZXdGb2N1c2VkKGRldGFpbHNDb250YWluZXIsIHJvd0luZGV4KScgI2RldGFpbHNDb250YWluZXIgW2F0dHIuZGF0YS1yb3dpbmRleF09J3Jvd0luZGV4J1xuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAnaWd4LWdyaWRfX3RyLWNvbnRhaW5lcic6IHRydWUsXG4gICAgICAgICAgICAgICAgJ2lneC1ncmlkX190ci1jb250YWluZXItLWFjdGl2ZSc6IGlzRGV0YWlsQWN0aXZlKHJvd0luZGV4KVxuICAgICAgICAgICAgfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9faGllcmFyY2hpY2FsLWluZGVudFwiIHN0eWxlPSdkaXNwbGF5OiBmbGV4Oyc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidGhpcy5ncm91cGluZ0V4cHJlc3Npb25zLmxlbmd0aCA+IDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX19yb3ctaW5kZW50YXRpb24gaWd4LWdyaWRfX3Jvdy1pbmRlbnRhdGlvbi0tbGV2ZWwte3tncm91cGluZ0V4cHJlc3Npb25zLmxlbmd0aH19XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09J2RldGFpbFRlbXBsYXRlLmZpcnN0J1xuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPSdnZXREZXRhaWxzQ29udGV4dChyb3dEYXRhLCByb3dJbmRleCknPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fcm93LWVkaXRpbmctb3V0bGV0XCIgaWd4T3ZlcmxheU91dGxldCAjaWd4Um93RWRpdGluZ092ZXJsYXlPdXRsZXQ+PC9kaXY+XG4gICAgICAgIDxpZ2MtdHJpYWwtd2F0ZXJtYXJrPjwvaWdjLXRyaWFsLXdhdGVybWFyaz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGlneFRvZ2dsZSAjbG9hZGluZ092ZXJsYXk+XG4gICAgICAgIDxpZ3gtY2lyY3VsYXItYmFyIFtpbmRldGVybWluYXRlXT1cInRydWVcIiAqbmdJZj0nc2hvdWxkT3ZlcmxheUxvYWRpbmcnPlxuICAgICAgICA8L2lneC1jaXJjdWxhci1iYXI+XG4gICAgPC9kaXY+XG4gICAgPHNwYW4gKm5nSWY9XCJtb3ZpbmcgJiYgY29sdW1uSW5EcmFnXCIgW2lneENvbHVtbk1vdmluZ0Ryb3BdPVwiaGVhZGVyQ29udGFpbmVyXCIgW2F0dHIuZHJvcHBhYmxlXT1cInRydWVcIlxuICAgICAgICBpZD1cInJpZ2h0XCIgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW9uLWRyYWctcmlnaHRcIj48L3NwYW4+XG4gICAgPGRpdiBbaGlkZGVuXT0nIWhhc1ZlcnRpY2FsU2Nyb2xsKCknIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LXNjcm9sbGJhclwiIFtzdHlsZS53aWR0aC5weF09XCJzY3JvbGxTaXplXCIgKHBvaW50ZXJkb3duKT1cIiRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktc2Nyb2xsYmFyLXN0YXJ0XCIgW3N0eWxlLmhlaWdodC5weF09JyBpc1Jvd1Bpbm5pbmdUb1RvcCA/IHBpbm5lZFJvd0hlaWdodCA6IDAnPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LXNjcm9sbGJhci1tYWluXCIgW3N0eWxlLmhlaWdodC5weF09J2NhbGNIZWlnaHQnPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIGlneEdyaWRGb3IgW2lneEdyaWRGb3JPZl09J1tdJyAjdmVydGljYWxTY3JvbGxIb2xkZXI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktc2Nyb2xsYmFyLWVuZFwiIFtzdHlsZS5oZWlnaHQucHhdPSchaXNSb3dQaW5uaW5nVG9Ub3AgPyBwaW5uZWRSb3dIZWlnaHQgOiAwJz48L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fYWRkcm93LXNuYWNrYmFyXCI+XG4gICAgICAgIDxpZ3gtc25hY2tiYXIgI2FkZFJvd1NuYWNrYmFyIFtvdXRsZXRdPVwiaWd4Qm9keU92ZXJsYXlPdXRsZXRcIiBbYWN0aW9uVGV4dF09XCJyZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfc25hY2tiYXJfYWRkcm93X2FjdGlvbnRleHRcIiBbZGlzcGxheVRpbWVdPSdzbmFja2JhckRpc3BsYXlUaW1lJz57e3Jlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9zbmFja2Jhcl9hZGRyb3dfbGFiZWx9fTwvaWd4LXNuYWNrYmFyPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiAjaWd4Qm9keU92ZXJsYXlPdXRsZXQ9XCJvdmVybGF5LW91dGxldFwiIGlneE92ZXJsYXlPdXRsZXQ+PC9kaXY+XG48L2Rpdj5cblxuXG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Rmb290XCIgcm9sZT1cInJvd2dyb3VwXCIgW3N0eWxlLmhlaWdodC5weF09J3N1bW1hcnlSb3dIZWlnaHQnICN0Zm9vdD5cbiAgICA8ZGl2IHRhYmluZGV4PVwiMFwiIChmb2N1cyk9XCJuYXZpZ2F0aW9uLmZvY3VzRmlyc3RDZWxsKGZhbHNlKVwiIChrZXlkb3duKT1cIm5hdmlnYXRpb24uc3VtbWFyeU5hdigkZXZlbnQpXCIgW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XT1cImFjdGl2ZURlc2NlbmRhbnRcIj5cbiAgICAgICAgPGlneC1ncmlkLXN1bW1hcnktcm93IFtzdHlsZS53aWR0aC5weF09J2NhbGNXaWR0aCcgIFtzdHlsZS5oZWlnaHQucHhdPSdzdW1tYXJ5Um93SGVpZ2h0J1xuICAgICAgICAgICAgKm5nSWY9XCJoYXNTdW1tYXJpemVkQ29sdW1ucyAmJiByb290U3VtbWFyaWVzRW5hYmxlZFwiIFtncmlkSURdPVwiaWRcIiByb2xlPVwicm93XCJcbiAgICAgICAgICAgIFtzdW1tYXJpZXNdPVwiaWQgfCBpZ3hHcmlkU3VtbWFyeURhdGFQaXBlOnN1bW1hcnlTZXJ2aWNlLnJldHJpZ2dlclJvb3RQaXBlXCIgW2luZGV4XT1cImRhdGFWaWV3Lmxlbmd0aFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zdW1tYXJpZXNcIiAjc3VtbWFyeVJvdz5cbiAgICAgICAgPC9pZ3gtZ3JpZC1zdW1tYXJ5LXJvdz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Zm9vdC10aHVtYlwiIFtoaWRkZW5dPSchaGFzVmVydGljYWxTY3JvbGwoKScgW3N0eWxlLmhlaWdodC5weF09J3N1bW1hcnlSb3dIZWlnaHQnXG4gICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwic2Nyb2xsU2l6ZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsXCIgW3N0eWxlLmhlaWdodC5weF09XCJzY3JvbGxTaXplXCIgI3NjciBbaGlkZGVuXT1cImlzSG9yaXpvbnRhbFNjcm9sbEhpZGRlblwiIChwb2ludGVyZG93bik9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLXN0YXJ0XCIgW3N0eWxlLndpZHRoLnB4XT0naXNQaW5uaW5nVG9TdGFydCA/IHBpbm5lZFdpZHRoIDogaGVhZGVyRmVhdHVyZXNXaWR0aCcgW3N0eWxlLm1pbi13aWR0aC5weF09J2lzUGlubmluZ1RvU3RhcnQgPyBwaW5uZWRXaWR0aCA6IGhlYWRlckZlYXR1cmVzV2lkdGgnPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW1haW5cIiBbc3R5bGUud2lkdGgucHhdPSd1bnBpbm5lZFdpZHRoJz5cbiAgICAgICAgPG5nLXRlbXBsYXRlIGlneEdyaWRGb3IgW2lneEdyaWRGb3JPZl09J0VNUFRZX0RBVEEnICNzY3JvbGxDb250YWluZXI+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtZW5kXCIgW3N0eWxlLmZsb2F0XT0nXCJyaWdodFwiJyBbc3R5bGUud2lkdGgucHhdPSdwaW5uZWRXaWR0aCcgW3N0eWxlLm1pbi13aWR0aC5weF09J3Bpbm5lZFdpZHRoJyBbaGlkZGVuXT1cInBpbm5lZFdpZHRoID09PSAwIHx8IGlzUGlubmluZ1RvU3RhcnRcIj48L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2Zvb3RlclwiICNmb290ZXI+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LWdyaWQtZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0b3RhbFJlY29yZHMgfHwgcGFnaW5nTW9kZSA9PT0gMVwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtcGFnaW5hdG9yXCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZSAjZW1wdHlGaWx0ZXJlZEdyaWQ+XG4gICAgPHNwYW4gY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktbWVzc2FnZVwiIHJvbGU9XCJjZWxsXCI+XG4gICAgICAgIDxzcGFuPnt7ZW1wdHlGaWx0ZXJlZEdyaWRNZXNzYWdlfX08L3NwYW4+XG4gICAgICAgIDxzcGFuICpuZ0lmPSdzaG93QWRkQnV0dG9uJz5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9J2FkZFJvd0VtcHR5VGVtcGxhdGUgfHwgZGVmYXVsdEFkZFJvd0VtcHR5VGVtcGxhdGUnPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0RW1wdHlHcmlkPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LW1lc3NhZ2VcIiByb2xlPVwiY2VsbFwiPlxuICAgICAgICA8c3Bhbj57e2VtcHR5R3JpZE1lc3NhZ2V9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gKm5nSWY9J3Nob3dBZGRCdXR0b24nPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD0nYWRkUm93RW1wdHlUZW1wbGF0ZSB8fCBkZWZhdWx0QWRkUm93RW1wdHlUZW1wbGF0ZSc+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L3NwYW4+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRBZGRSb3dFbXB0eVRlbXBsYXRlPlxuICAgIDxidXR0b24gaWd4QnV0dG9uPVwicmFpc2VkXCIgaWd4UmlwcGxlIChjbGljayk9XCJ0aGlzLmNydWRTZXJ2aWNlLmVudGVyQWRkUm93TW9kZShudWxsLCBmYWxzZSwgJGV2ZW50KVwiPlxuICAgICAgICB7e3Jlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9hZGRfcm93X2xhYmVsfX1cbiAgICA8L2J1dHRvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdExvYWRpbmdHcmlkPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fbG9hZGluZ1wiPlxuICAgICAgICA8aWd4LWNpcmN1bGFyLWJhciBbaW5kZXRlcm1pbmF0ZV09XCJ0cnVlXCI+XG4gICAgICAgIDwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEV4cGFuZGVkVGVtcGxhdGU+XG4gICAgPGlneC1pY29uIHJvbGU9XCJidXR0b25cIiBjbGFzcz1cImlneC1ncmlkX19ncm91cC1leHBhbmQtYnRuXCJcbiAgIFtuZ0NsYXNzXT1cIntcbiAgICAnaWd4LWdyaWRfX2dyb3VwLWV4cGFuZC1idG4tLXB1c2gnOiBmaWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZVxufVwiPnVuZm9sZF9sZXNzPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbiA8bmctdGVtcGxhdGUgI2RlZmF1bHRDb2xsYXBzZWRUZW1wbGF0ZT5cbiAgICA8aWd4LWljb24gcm9sZT1cImJ1dHRvblwiIGNsYXNzPVwiaWd4LWdyaWRfX2dyb3VwLWV4cGFuZC1idG5cIlxuICAgIFtuZ0NsYXNzXT1cIntcbiAgICAnaWd4LWdyaWRfX2dyb3VwLWV4cGFuZC1idG4tLXB1c2gnOiBmaWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZVxufVwiPnVuZm9sZF9tb3JlPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxkaXYgKm5nSWY9XCJyb3dFZGl0YWJsZVwiIGlneFRvZ2dsZSAjcm93RWRpdGluZ092ZXJsYXk+XG4gICAgPGRpdiBbY2xhc3NOYW1lXT1cImJhbm5lckNsYXNzXCI+XG4gICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwicm93RWRpdENvbnRhaW5lcjsgY29udGV4dDogeyByb3dDaGFuZ2VzQ291bnQ6IHJvd0NoYW5nZXNDb3VudCwgZW5kRWRpdDogdGhpcy5lbmRFZGl0LmJpbmQodGhpcykgfVwiPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRSb3dFZGl0VGV4dD5cbiAgICBZb3UgaGF2ZSB7eyByb3dDaGFuZ2VzQ291bnQgfX0gY2hhbmdlcyBpbiB0aGlzIHJvd1xuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Um93RWRpdEFjdGlvbnM+XG4gICAgPGJ1dHRvbiBpZ3hCdXR0b24gaWd4Um93RWRpdFRhYlN0b3AgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJ0aGlzLmVuZFJvd0VkaXRUYWJTdG9wKGZhbHNlLCAkZXZlbnQpXCI+e3sgdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfcm93X2VkaXRfYnRuX2NhbmNlbCB9fTwvYnV0dG9uPlxuICAgIDxidXR0b24gaWd4QnV0dG9uIGlneFJvd0VkaXRUYWJTdG9wIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwidGhpcy5lbmRSb3dFZGl0VGFiU3RvcCh0cnVlLCAkZXZlbnQpXCI+e3sgdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfcm93X2VkaXRfYnRuX2RvbmUgfX08L2J1dHRvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFJvd0VkaXRUZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fbWVzc2FnZVwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImlneC1iYW5uZXJfX3RleHRcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInRoaXMuY3J1ZFNlcnZpY2Uucm93Py5nZXRDbGFzc05hbWUoKSA9PT0gJ0lneEFkZFJvdycgPyByb3dBZGRUZXh0IDogcm93RWRpdFRleHQgPyByb3dFZGl0VGV4dCA6IGRlZmF1bHRSb3dFZGl0VGV4dDtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7ICRpbXBsaWNpdDogdGhpcy5jcnVkU2VydmljZS5yb3c/LmdldENsYXNzTmFtZSgpICE9PSAnSWd4QWRkUm93JyA/IHJvd0NoYW5nZXNDb3VudCA6IG51bGwgfVwiPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fYWN0aW9uc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fcm93XCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJyb3dFZGl0QWN0aW9ucyA/IHJvd0VkaXRBY3Rpb25zIDogZGVmYXVsdFJvd0VkaXRBY3Rpb25zOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogdGhpcy5lbmRFZGl0LmJpbmQodGhpcykgfVwiPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkcmFnSW5kaWNhdG9ySWNvbkJhc2U+XG4gICAgPGlneC1pY29uPmRyYWdfaW5kaWNhdG9yPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxpZ3gtZ3JpZC1jb2x1bW4tcmVzaXplciAqbmdJZj1cImNvbFJlc2l6aW5nU2VydmljZS5zaG93UmVzaXplclwiPjwvaWd4LWdyaWQtY29sdW1uLXJlc2l6ZXI+XG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2xvYWRpbmctb3V0bGV0XCIgI2lneExvYWRpbmdPdmVybGF5T3V0bGV0IGlneE92ZXJsYXlPdXRsZXQ+PC9kaXY+XG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX291dGxldFwiICNpZ3hGaWx0ZXJpbmdPdmVybGF5T3V0bGV0IGlneE92ZXJsYXlPdXRsZXQ+PC9kaXY+XG4iXX0=