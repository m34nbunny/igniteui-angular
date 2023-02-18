import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, HostBinding, Inject, Input, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { IgxHierarchicalGridAPIService } from './hierarchical-grid-api.service';
import { IgxRowIslandComponent } from './row-island.component';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { IgxHierarchicalGridNavigationService } from './hierarchical-grid-navigation.service';
import { IgxGridSummaryService } from '../summaries/grid-summary.service';
import { IgxHierarchicalGridBaseDirective } from './hierarchical-grid-base.directive';
import { takeUntil } from 'rxjs/operators';
import { IgxTemplateOutletDirective } from '../../directives/template-outlet/template_outlet.directive';
import { IgxGridSelectionService } from '../selection/selection.service';
import { IgxForOfSyncService, IgxForOfScrollSyncService } from '../../directives/for-of/for_of.sync.service';
import { IGX_GRID_BASE, IGX_GRID_SERVICE_BASE } from '../common/grid.interface';
import { IgxRowIslandAPIService } from './row-island-api.service';
import { IgxGridToolbarDirective } from '../toolbar/common';
import { IgxGridCRUDService } from '../common/crud.service';
import { IgxHierarchicalGridRow } from '../grid-public-row';
import { IgxGridCell } from '../grid-public-cell';
import { IgxPaginatorComponent } from '../../paginator/paginator.component';
import { IgxGridComponent } from '../grid/grid.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./hierarchical-grid-api.service";
import * as i3 from "../headers/grid-header-row.component";
import * as i4 from "./hierarchical-row.component";
import * as i5 from "../../progressbar/progressbar.component";
import * as i6 from "../../snackbar/snackbar.component";
import * as i7 from "../summaries/summary-row.component";
import * as i8 from "../../icon/icon.component";
import * as i9 from "../resizing/resizer.component";
import * as i10 from "../grid.common";
import * as i11 from "../selection/drag-select.directive";
import * as i12 from "../moving/moving.drop.directive";
import * as i13 from "../../directives/for-of/for_of.directive";
import * as i14 from "../../directives/template-outlet/template_outlet.directive";
import * as i15 from "../../directives/toggle/toggle.directive";
import * as i16 from "../../directives/button/button.directive";
import * as i17 from "../../directives/ripple/ripple.directive";
import * as i18 from "../grid.rowEdit.directive";
import * as i19 from "../grid/grid.pipes";
import * as i20 from "../common/pipes";
import * as i21 from "./hierarchical-grid.pipes";
import * as i22 from "../summaries/grid-root-summary.pipe";
let NEXT_ID = 0;
export class IgxChildGridRowComponent {
    constructor(gridAPI, element, resolver, cdr) {
        this.gridAPI = gridAPI;
        this.element = element;
        this.resolver = resolver;
        this.cdr = cdr;
        /**
         *  The data passed to the row component.
         *
         * ```typescript
         * // get the row data for the first selected row
         * let selectedRowData = this.grid.selectedRows[0].data;
         * ```
         */
        this.data = [];
        /**
         * Returns whether the row is expanded.
         * ```typescript
         * const RowExpanded = this.grid1.rowList.first.expanded;
         * ```
         */
        this.expanded = false;
    }
    /**
     * @hidden
     */
    get parentHasScroll() {
        return !this.parentGrid.verticalScrollContainer.dc.instance.notVirtual;
    }
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
    // TODO: Refactor
    get parentGrid() {
        return this.gridAPI.grid;
    }
    get level() {
        return this.layout.level;
    }
    /**
     * The native DOM element representing the row. Could be null in certain environments.
     *
     * ```typescript
     * // get the nativeElement of the second selected row
     * let selectedRowNativeElement = this.grid.selectedRows[1].nativeElement;
     * ```
     */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.layout.layoutChange.subscribe((ch) => {
            this._handleLayoutChanges(ch);
        });
        const changes = this.layout.initialChanges;
        changes.forEach(change => {
            this._handleLayoutChanges(change);
        });
        this.hGrid.parent = this.parentGrid;
        this.hGrid.parentIsland = this.layout;
        this.hGrid.childRow = this;
        // handler logic that re-emits hgrid events on the row island
        this.setupEventEmitters();
        this.layout.gridCreated.emit({
            owner: this.layout,
            parentID: this.data.rowID,
            grid: this.hGrid
        });
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        this.hGrid.childLayoutList = this.layout.children;
        const layouts = this.hGrid.childLayoutList.toArray();
        layouts.forEach((l) => this.hGrid.gridAPI.registerChildRowIsland(l));
        this.parentGrid.gridAPI.registerChildGrid(this.data.rowID, this.layout.key, this.hGrid);
        this.layout.rowIslandAPI.registerChildGrid(this.data.rowID, this.hGrid);
        this.layout.gridInitialized.emit({
            owner: this.layout,
            parentID: this.data.rowID,
            grid: this.hGrid
        });
        this.hGrid.cdr.detectChanges();
    }
    setupEventEmitters() {
        const destructor = takeUntil(this.hGrid.destroy$);
        const factory = this.resolver.resolveComponentFactory(IgxGridComponent);
        // exclude outputs related to two-way binding functionality
        const inputNames = factory.inputs.map(input => input.propName);
        const outputs = factory.outputs.filter(o => {
            const matchingInputPropName = o.propName.slice(0, o.propName.indexOf('Change'));
            return inputNames.indexOf(matchingInputPropName) === -1;
        });
        // TODO: Skip the `rendered` output. Rendered should be called once per grid.
        outputs.filter(o => o.propName !== 'rendered').forEach(output => {
            if (this.hGrid[output.propName]) {
                this.hGrid[output.propName].pipe(destructor).subscribe((args) => {
                    if (!args) {
                        args = {};
                    }
                    args.owner = this.hGrid;
                    this.layout[output.propName].emit(args);
                });
            }
        });
    }
    _handleLayoutChanges(changes) {
        for (const change in changes) {
            if (changes.hasOwnProperty(change)) {
                this.hGrid[change] = changes[change].currentValue;
            }
        }
    }
}
IgxChildGridRowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxChildGridRowComponent, deps: [{ token: IGX_GRID_SERVICE_BASE }, { token: i0.ElementRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
IgxChildGridRowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxChildGridRowComponent, selector: "igx-child-grid-row", inputs: { layout: "layout", parentGridID: "parentGridID", data: "data", index: "index" }, host: { properties: { "attr.aria-level": "this.level" } }, viewQueries: [{ propertyName: "hGrid", first: true, predicate: ["hgrid"], descendants: true, static: true }], ngImport: i0, template: "<div class=\"igx-grid__hierarchical-indent\" [ngClass]=\"{'igx-grid__hierarchical-indent--scroll': parentHasScroll}\">\n    <igx-hierarchical-grid #hgrid [data]='data.childGridsData[layout.key]'></igx-hierarchical-grid>\n</div>\n", components: [{ type: i0.forwardRef(function () { return IgxHierarchicalGridComponent; }), selector: "igx-hierarchical-grid", inputs: ["id", "data", "expandChildren"] }], directives: [{ type: i0.forwardRef(function () { return i1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxChildGridRowComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-child-grid-row', template: "<div class=\"igx-grid__hierarchical-indent\" [ngClass]=\"{'igx-grid__hierarchical-indent--scroll': parentHasScroll}\">\n    <igx-hierarchical-grid #hgrid [data]='data.childGridsData[layout.key]'></igx-hierarchical-grid>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i2.IgxHierarchicalGridAPIService, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_SERVICE_BASE]
                }] }, { type: i0.ElementRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { layout: [{
                type: Input
            }], parentGridID: [{
                type: Input
            }], data: [{
                type: Input
            }], index: [{
                type: Input
            }], hGrid: [{
                type: ViewChild,
                args: ['hgrid', { static: true }]
            }], level: [{
                type: HostBinding,
                args: ['attr.aria-level']
            }] } });
export class IgxHierarchicalGridComponent extends IgxHierarchicalGridBaseDirective {
    constructor() {
        super(...arguments);
        /**
         * @hidden @internal
         */
        this.role = 'grid';
        /**
         * @hidden
         */
        this.childLayoutKeys = [];
        /**
         * @hidden
         */
        this.highlightedRowID = null;
        /**
         * @hidden
         */
        this.updateOnRender = false;
        /**
         * @hidden
         */
        this.parent = null;
        this._filteredData = null;
        this.h_id = `igx-hierarchical-grid-${NEXT_ID++}`;
        this.childGridTemplates = new Map();
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
    // @ViewChild('headerHierarchyExpander', { read: ElementRef, static: true })
    get headerHierarchyExpander() {
        return this.theadRow.headerHierarchyExpander;
    }
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
    get id() {
        return this.h_id;
    }
    set id(value) {
        this.h_id = value;
    }
    /**
     * An @Input property that lets you fill the `IgxHierarchicalGridComponent` with an array of data.
     * ```html
     * <igx-hierarchical-grid [data]="Data" [autoGenerate]="true"></igx-hierarchical-grid>
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    set data(value) {
        this._data = value || [];
        this.summaryService.clearSummaryCache();
        if (this.shouldGenerate) {
            this.setupColumns();
            this.reflow();
        }
        this.cdr.markForCheck();
        if (this.parent && (this.height === null || this.height.indexOf('%') !== -1)) {
            // If the height will change based on how much data there is, recalculate sizes in igxForOf.
            this.notifyChanges(true);
        }
    }
    /**
     * Returns an array of data set to the `IgxHierarchicalGridComponent`.
     * ```typescript
     * let filteredData = this.grid.filteredData;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get data() {
        return this._data;
    }
    /** @hidden @internal */
    get paginator() {
        const id = this.id;
        return (!this.parentIsland && this.paginationComponents?.first) || this.rootGrid.paginatorList?.find((pg) => pg.nativeElement.offsetParent?.id === id);
    }
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
    set filteredData(value) {
        this._filteredData = value;
    }
    /**
     * Returns an array of objects containing the filtered data in the `IgxHierarchicalGridComponent`.
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
    /**
     * Sets if all immediate children of the `IgxHierarchicalGridComponent` should be expanded/collapsed.
     * Defult value is false.
     * ```html
     * <igx-hierarchical-grid [id]="'igx-grid-1'" [data]="Data" [autoGenerate]="true" [expandChildren]="true"></igx-hierarchical-grid>
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    set expandChildren(value) {
        this._defaultExpandState = value;
        this.expansionStates = new Map();
    }
    /**
     * Gets if all immediate children of the `IgxHierarchicalGridComponent` previously have been set to be expanded/collapsed.
     * If previously set and some rows have been manually expanded/collapsed it will still return the last set value.
     * ```typescript
     * const expanded = this.grid.expandChildren;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get expandChildren() {
        return this._defaultExpandState;
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
        if (row && row instanceof IgxHierarchicalGridRow && column) {
            return new IgxGridCell(this, rowIndex, column.field);
        }
    }
    /**
     * Gets the unique identifier of the parent row. It may be a `string` or `number` if `primaryKey` of the
     * parent grid is set or an object reference of the parent record otherwise.
     * ```typescript
     * const foreignKey = this.grid.foreignKey;
     * ```
     *
     * @memberof IgxHierarchicalGridComponent
     */
    get foreignKey() {
        if (!this.parent) {
            return null;
        }
        return this.parent.gridAPI.getParentRowId(this);
    }
    /**
     * @hidden
     */
    get hasExpandableChildren() {
        return !!this.childLayoutKeys.length;
    }
    /**
     * @hidden
     */
    get resolveRowEditContainer() {
        if (this.parentIsland && this.parentIsland.rowEditCustom) {
            return this.parentIsland.rowEditContainer;
        }
        return this.rowEditContainer;
    }
    /**
     * @hidden
     */
    get resolveRowEditActions() {
        return this.parentIsland ? this.parentIsland.rowEditActions : this.rowEditActions;
    }
    /**
     * @hidden
     */
    get resolveRowEditText() {
        return this.parentIsland ? this.parentIsland.rowEditText : this.rowEditText;
    }
    /** @hidden */
    hideActionStrip() {
        if (!this.parent) {
            // hide child layout actions strips when
            // moving outside root grid.
            super.hideActionStrip();
            this.allLayoutList.forEach(ri => {
                ri.actionStrip?.hide();
            });
        }
    }
    /**
     * @hidden
     */
    get parentRowOutletDirective() {
        // Targeting parent outlet in order to prevent hiding when outlet
        // is present at a child grid and is attached to a row.
        return this.parent ? this.parent.rowOutletDirective : this.outlet;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        // this.expansionStatesChange.pipe(takeUntil(this.destroy$)).subscribe((value: Map<any, boolean>) => {
        //     const res = Array.from(value.entries()).filter(({1: v}) => v === true).map(([k]) => k);
        // });
        this.batchEditing = !!this.rootGrid.batchEditing;
        if (this.rootGrid !== this) {
            this.rootGrid.batchEditingChange.pipe(takeUntil(this.destroy$)).subscribe((val) => {
                this.batchEditing = val;
            });
        }
        super.ngOnInit();
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.zone.runOutsideAngular(() => {
            this.verticalScrollContainer.getScroll().addEventListener('scroll', this.hg_verticalScrollHandler.bind(this));
            this.headerContainer.getScroll().addEventListener('scroll', this.hg_horizontalScrollHandler.bind(this));
        });
        this.verticalScrollContainer.beforeViewDestroyed.pipe(takeUntil(this.destroy$)).subscribe((view) => {
            const rowData = view.context.$implicit;
            if (this.isChildGridRecord(rowData)) {
                const cachedData = this.childGridTemplates.get(rowData.rowID);
                if (cachedData) {
                    const tmlpOutlet = cachedData.owner;
                    tmlpOutlet._viewContainerRef.detach(0);
                }
            }
        });
        if (this.parent) {
            this._displayDensity = this.rootGrid.displayDensity;
            this.summaryService.summaryHeight = 0;
            this.rootGrid.onDensityChanged.pipe(takeUntil(this.destroy$)).subscribe(() => {
                this._displayDensity = this.rootGrid.displayDensity;
                this.summaryService.summaryHeight = 0;
                this.notifyChanges(true);
                this.cdr.markForCheck();
            });
            this.childLayoutKeys = this.parentIsland.children.map((item) => item.key);
        }
        this.actionStrip = this.parentIsland ? this.parentIsland.actionStrip : this.actionStrip;
        this.headSelectorsTemplates = this.parentIsland ?
            this.parentIsland.headSelectorsTemplates :
            this.headSelectorsTemplates;
        this.rowSelectorsTemplates = this.parentIsland ?
            this.parentIsland.rowSelectorsTemplates :
            this.rowSelectorsTemplates;
        this.dragIndicatorIconTemplate = this.parentIsland ?
            this.parentIsland.dragIndicatorIconTemplate :
            this.dragIndicatorIconTemplate;
        this.rowExpandedIndicatorTemplate = this.rootGrid.rowExpandedIndicatorTemplate;
        this.rowCollapsedIndicatorTemplate = this.rootGrid.rowCollapsedIndicatorTemplate;
        this.headerCollapseIndicatorTemplate = this.rootGrid.headerCollapseIndicatorTemplate;
        this.headerExpandIndicatorTemplate = this.rootGrid.headerExpandIndicatorTemplate;
        this.excelStyleHeaderIconTemplate = this.rootGrid.excelStyleHeaderIconTemplate;
        this.sortAscendingHeaderIconTemplate = this.rootGrid.sortAscendingHeaderIconTemplate;
        this.sortDescendingHeaderIconTemplate = this.rootGrid.sortDescendingHeaderIconTemplate;
        this.sortHeaderIconTemplate = this.rootGrid.sortHeaderIconTemplate;
        this.hasChildrenKey = this.parentIsland ?
            this.parentIsland.hasChildrenKey || this.rootGrid.hasChildrenKey :
            this.rootGrid.hasChildrenKey;
        this.showExpandAll = this.parentIsland ?
            this.parentIsland.showExpandAll : this.rootGrid.showExpandAll;
    }
    get outletDirective() {
        return this.rootGrid.outlet;
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this.updateColumnList(false);
        this.childLayoutKeys = this.parent ?
            this.parentIsland.children.map((item) => item.key) :
            this.childLayoutKeys = this.childLayoutList.map((item) => item.key);
        this.childLayoutList.notifyOnChanges();
        this.childLayoutList.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.onRowIslandChange());
        super.ngAfterContentInit();
    }
    /**
     * Returns the `RowType` by index.
     *
     * @example
     * ```typescript
     * const myRow = this.grid1.getRowByIndex(1);
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
     * Returns the `RowType` by key.
     *
     * @example
     * ```typescript
     * const myRow = this.grid1.getRowByKey(1);
     * ```
     * @param key
     */
    getRowByKey(key) {
        const data = this.dataView;
        const rec = this.primaryKey ?
            data.find(record => record[this.primaryKey] === key) :
            data.find(record => record === key);
        const index = data.indexOf(rec);
        if (index < 0 || index > data.length) {
            return undefined;
        }
        return new IgxHierarchicalGridRow(this, index, rec);
    }
    /**
     * @hidden @internal
     */
    allRows() {
        return this.dataView.map((rec, index) => this.createRow(index));
    }
    /**
     * Returns the collection of `IgxHierarchicalGridRow`s for current page.
     *
     * @hidden @internal
     */
    dataRows() {
        return this.allRows().filter(row => row instanceof IgxHierarchicalGridRow);
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
        if (row && row instanceof IgxHierarchicalGridRow && column) {
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
    /**
     * @hidden @internal
     */
    dataLoading(event) {
        this.dataPreLoad.emit(event);
    }
    /** @hidden */
    featureColumnsWidth() {
        return super.featureColumnsWidth(this.headerHierarchyExpander);
    }
    /**
     * @hidden
     */
    onRowIslandChange() {
        if (this.parent) {
            this.childLayoutKeys = this.parentIsland.children.filter(item => !item._destroyed).map((item) => item.key);
        }
        else {
            this.childLayoutKeys = this.childLayoutList.filter(item => !item._destroyed).map((item) => item.key);
        }
        if (!this.cdr.destroyed) {
            this.cdr.detectChanges();
        }
    }
    ngOnDestroy() {
        if (!this.parent) {
            this.gridAPI.getChildGrids(true).forEach((grid) => {
                if (!grid.childRow.cdr.destroyed) {
                    grid.childRow.cdr.destroy();
                }
            });
        }
        if (this.parent && this.selectionService.activeElement) {
            // in case selection is in destroyed child grid, selection should be cleared.
            this._clearSeletionHighlights();
        }
        super.ngOnDestroy();
    }
    /**
     * @hidden
     */
    isRowHighlighted(rowData) {
        return this.highlightedRowID === rowData.rowID;
    }
    /**
     * @hidden
     */
    isHierarchicalRecord(record) {
        if (this.isGhostRecord(record)) {
            record = record.recordRef;
        }
        return this.childLayoutList.length !== 0 && record[this.childLayoutList.first.key];
    }
    /**
     * @hidden
     */
    isChildGridRecord(record) {
        // Can be null when there is defined layout but no child data was found
        return record?.childGridsData !== undefined;
    }
    /**
     * @hidden
     */
    trackChanges(index, rec) {
        if (rec.childGridsData !== undefined) {
            // if is child rec
            return rec.rowID;
        }
        return rec;
    }
    /**
     * @hidden
     */
    getContext(rowData, rowIndex, pinned) {
        if (this.isChildGridRecord(rowData)) {
            const cachedData = this.childGridTemplates.get(rowData.rowID);
            if (cachedData) {
                const view = cachedData.view;
                const tmlpOutlet = cachedData.owner;
                return {
                    $implicit: rowData,
                    moveView: view,
                    owner: tmlpOutlet,
                    index: this.dataView.indexOf(rowData)
                };
            }
            else {
                // child rows contain unique grids, hence should have unique templates
                return {
                    $implicit: rowData,
                    templateID: {
                        type: 'childRow',
                        id: rowData.rowID
                    },
                    index: this.dataView.indexOf(rowData)
                };
            }
        }
        else {
            return {
                $implicit: this.isGhostRecord(rowData) ? rowData.recordRef : rowData,
                templateID: {
                    type: 'dataRow',
                    id: null
                },
                index: this.getDataViewIndex(rowIndex, pinned),
                disabled: this.isGhostRecord(rowData)
            };
        }
    }
    /**
     * @hidden
     */
    get rootGrid() {
        let currGrid = this;
        while (currGrid.parent) {
            currGrid = currGrid.parent;
        }
        return currGrid;
    }
    /**
     * @hidden
     */
    get iconTemplate() {
        const expanded = this.hasExpandedRecords() && this.hasExpandableChildren;
        if (!expanded && this.showExpandAll) {
            return this.headerCollapseIndicatorTemplate || this.defaultCollapsedTemplate;
        }
        else {
            return this.headerExpandIndicatorTemplate || this.defaultExpandedTemplate;
        }
    }
    /**
     * @hidden
     * @internal
     */
    getDragGhostCustomTemplate() {
        if (this.parentIsland) {
            return this.parentIsland.getDragGhostCustomTemplate();
        }
        return super.getDragGhostCustomTemplate();
    }
    /**
     * @hidden
     * Gets the visible content height that includes header + tbody + footer.
     * For hierarchical child grid it may be scrolled and not fully visible.
     */
    getVisibleContentHeight() {
        let height = super.getVisibleContentHeight();
        if (this.parent) {
            const rootHeight = this.rootGrid.getVisibleContentHeight();
            const topDiff = this.nativeElement.getBoundingClientRect().top - this.rootGrid.nativeElement.getBoundingClientRect().top;
            height = rootHeight - topDiff > height ? height : rootHeight - topDiff;
        }
        return height;
    }
    /**
     * @hidden
     */
    toggleAll() {
        const expanded = this.hasExpandedRecords() && this.hasExpandableChildren;
        if (!expanded && this.showExpandAll) {
            this.expandAll();
        }
        else {
            this.collapseAll();
        }
    }
    /**
     * @hidden
     * @internal
     */
    hasExpandedRecords() {
        if (this.expandChildren) {
            return true;
        }
        let hasExpandedEntry = false;
        this.expansionStates.forEach(value => {
            if (value) {
                hasExpandedEntry = value;
            }
        });
        return hasExpandedEntry;
    }
    getDefaultExpandState(record) {
        if (this.hasChildrenKey && !record[this.hasChildrenKey]) {
            return false;
        }
        return this.expandChildren;
    }
    /**
     * @hidden
     */
    isExpanded(record) {
        return this.gridAPI.get_row_expansion_state(record);
    }
    /**
     * @hidden
     */
    viewCreatedHandler(args) {
        if (this.isChildGridRecord(args.context.$implicit)) {
            const key = args.context.$implicit.rowID;
            this.childGridTemplates.set(key, args);
        }
    }
    /**
     * @hidden
     */
    viewMovedHandler(args) {
        if (this.isChildGridRecord(args.context.$implicit)) {
            // view was moved, update owner in cache
            const key = args.context.$implicit.rowID;
            const cachedData = this.childGridTemplates.get(key);
            cachedData.owner = args.owner;
            this.childLayoutList.forEach((layout) => {
                const relatedGrid = this.gridAPI.getChildGridByID(layout.key, args.context.$implicit.rowID);
                if (relatedGrid && relatedGrid.updateOnRender) {
                    // Detect changes if `expandChildren` has changed when the grid wasn't visible. This is for performance reasons.
                    relatedGrid.notifyChanges(true);
                    relatedGrid.updateOnRender = false;
                }
            });
        }
    }
    onContainerScroll() {
        this.hideOverlays();
    }
    /**
     * @hidden
     */
    createRow(index, data) {
        let row;
        const dataIndex = this._getDataViewIndex(index);
        const rec = data ?? this.dataView[dataIndex];
        if (!row && rec && !rec.childGridsData) {
            row = new IgxHierarchicalGridRow(this, index, rec);
        }
        return row;
    }
    /** @hidden @internal */
    getChildGrids(inDeph) {
        return this.gridAPI.getChildGrids(inDeph);
    }
    generateDataFields(data) {
        return super.generateDataFields(data).filter((field) => {
            const layoutsList = this.parentIsland ? this.parentIsland.children : this.childLayoutList;
            const keys = layoutsList.map((item) => item.key);
            return keys.indexOf(field) === -1;
        });
    }
    resizeNotifyHandler() {
        // do not trigger reflow if element is detached or if it is child grid.
        if (this.document.contains(this.nativeElement) && !this.parent) {
            this.notifyChanges(true);
        }
    }
    /**
     * @hidden
     */
    initColumns(collection, cb = null) {
        if (this.hasColumnLayouts) {
            // invalid configuration - hierarchical grid should not allow column layouts
            // remove column layouts
            const nonColumnLayoutColumns = this.columnList.filter((col) => !col.columnLayout && !col.columnLayoutChild);
            this.columnList.reset(nonColumnLayoutColumns);
        }
        super.initColumns(collection, cb);
    }
    setupColumns() {
        if (this.parentIsland && this.parentIsland.childColumns.length > 0 && !this.autoGenerate) {
            this.createColumnsList(this.parentIsland.childColumns.toArray());
        }
        super.setupColumns();
    }
    onColumnsChanged(change) {
        Promise.resolve().then(() => {
            this.updateColumnList();
            const cols = change.filter(c => c.grid === this);
            if (cols.length > 0 || this.autoGenerate) {
                this.columnList.reset(cols);
                super.onColumnsChanged(this.columnList);
            }
        });
    }
    _shouldAutoSize(renderedHeight) {
        if (this.isPercentHeight && this.parent) {
            return true;
        }
        return super._shouldAutoSize(renderedHeight);
    }
    updateColumnList(recalcColSizes = true) {
        const childLayouts = this.parent ? this.childLayoutList : this.allLayoutList;
        const nestedColumns = childLayouts.map((layout) => layout.columnList.toArray());
        const colsArray = [].concat.apply([], nestedColumns);
        const colLength = this.columnList.length;
        if (colsArray.length > 0) {
            const topCols = this.columnList.filter((item) => colsArray.indexOf(item) === -1);
            this.columnList.reset(topCols);
            if (recalcColSizes && this.columnList.length !== colLength) {
                this.calculateGridSizes(false);
            }
        }
    }
    _clearSeletionHighlights() {
        [this.rootGrid, ...this.rootGrid.getChildGrids(true)].forEach(grid => {
            grid.selectionService.clear();
            grid.selectionService.activeElement = null;
            grid.nativeElement.classList.remove('igx-grid__tr--highlighted');
            grid.highlightedRowID = null;
            grid.cdr.markForCheck();
        });
    }
    hg_verticalScrollHandler(event) {
        this.scrollTop = this.verticalScrollContainer.scrollPosition;
    }
    hg_horizontalScrollHandler(event) {
        this.scrollLeft = this.headerContainer.scrollPosition;
    }
}
IgxHierarchicalGridComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxHierarchicalGridComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxHierarchicalGridComponent, selector: "igx-hierarchical-grid", inputs: { id: "id", data: "data", expandChildren: "expandChildren" }, host: { properties: { "attr.role": "this.role", "attr.id": "this.id" } }, providers: [
        IgxGridCRUDService,
        IgxGridSelectionService,
        { provide: IGX_GRID_SERVICE_BASE, useClass: IgxHierarchicalGridAPIService },
        { provide: IGX_GRID_BASE, useExisting: IgxHierarchicalGridComponent },
        IgxGridSummaryService,
        IgxFilteringService,
        IgxHierarchicalGridNavigationService,
        IgxForOfSyncService,
        IgxForOfScrollSyncService,
        IgxRowIslandAPIService
    ], queries: [{ propertyName: "toolbarTemplate", first: true, predicate: IgxGridToolbarDirective, descendants: true, read: TemplateRef, static: true }, { propertyName: "childLayoutList", predicate: IgxRowIslandComponent, read: IgxRowIslandComponent }, { propertyName: "allLayoutList", predicate: IgxRowIslandComponent, descendants: true, read: IgxRowIslandComponent }, { propertyName: "paginatorList", predicate: IgxPaginatorComponent, descendants: true }], viewQueries: [{ propertyName: "toolbarOutlet", first: true, predicate: ["toolbarOutlet"], descendants: true, read: ViewContainerRef }, { propertyName: "paginatorOutlet", first: true, predicate: ["paginatorOutlet"], descendants: true, read: ViewContainerRef }, { propertyName: "hierarchicalRecordTemplate", first: true, predicate: ["hierarchical_record_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "childTemplate", first: true, predicate: ["child_record_template"], descendants: true, read: TemplateRef, static: true }, { propertyName: "templateOutlets", predicate: IgxTemplateOutletDirective, descendants: true, read: IgxTemplateOutletDirective }, { propertyName: "hierarchicalRows", predicate: IgxChildGridRowComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<ng-content select=\"igx-grid-toolbar\"></ng-content>\n<ng-container #toolbarOutlet></ng-container>\n\n<igx-grid-header-row class=\"igx-grid-thead\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (focus)=\"navigation.focusFirstCell()\"\n>\n</igx-grid-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <div class=\"igx-grid__tbody-content\"  tabindex=\"0\" (focus)=\"navigation.focusTbody($event)\"\n     (keydown)=\"navigation.handleNavigation($event)\" (dragStop)=\"selectionService.dragMode = $event\"\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\" [attr.aria-activedescendant]=\"activeDescendant\" [attr.role]=\"dataView.length ? null : 'row'\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth' #tbody (scroll)='preventContainerScroll($event)'>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n        <ng-template #pinnedRecordsTemplate>\n            <ng-container *ngIf=\"data\n            | gridTransaction:id:pipeTrigger\n            | visibleColumns:hasVisibleColumns\n            | gridAddRow:true:pipeTrigger\n            | gridRowPinning:id:true:pipeTrigger\n            | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger:true\n            | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger:true as pinnedData\">\n                <div #pinContainer *ngIf='pinnedData.length > 0' class='igx-grid__tr--pinned'\n                    [ngClass]=\"{ 'igx-grid__tr--pinned-bottom':  !isRowPinningToTop, 'igx-grid__tr--pinned-top': isRowPinningToTop }\"\n                    [style.width.px]='calcWidth'>\n                    <ng-container *ngFor=\"let rowData of pinnedData; let rowIndex = index\">\n                        <ng-container *ngTemplateOutlet=\"pinned_hierarchical_record_template; context: getContext(rowData, rowIndex, true)\">\n                        </ng-container>\n                    </ng-container>\n                </div>\n            </ng-container>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && isRowPinningToTop ? pinnedRecordsTemplate : null\">\n        </ng-container>\n        <ng-template igxGridFor let-rowData let-rowIndex=\"index\" [igxGridForOf]=\"data\n        | gridTransaction:id:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger\n        | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger\n        | gridHierarchicalPaging:paginator?.page:paginator?.perPage:id:pipeTrigger\n        | gridHierarchical:expansionStates:id:primaryKey:childLayoutKeys:pipeTrigger\n        | gridAddRow:false:pipeTrigger\n        | gridRowPinning:id:false:pipeTrigger\"\n            [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight' [igxForItemSize]=\"renderedRowHeight\" [igxForTrackBy]='trackChanges'\n            #verticalScrollContainer (chunkPreload)=\"dataLoading($event)\" (dataChanging)=\"dataRebinding($event)\" (dataChanged)=\"dataRebound($event)\">\n            <ng-template\n                [igxTemplateOutlet]='(isHierarchicalRecord(rowData) ? hierarchical_record_template : (isChildGridRecord(rowData) ? child_record_template : hierarchical_record_template))'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex, false)' (viewCreated)='viewCreatedHandler($event)'\n                (viewMoved)='viewMovedHandler($event)' (cachedViewLoaded)='cachedViewLoaded($event)'>\n            </ng-template>\n            <!-- <ng-container *igxTemplateOutlet=\"(isHierarchicalRecord(rowData) ? hierarchical_record_template : (isChildGridRecord(rowData) && isExpanded(rowData) ? child_record_template : hierarchical_record_template)); context: getContext(rowData)\"></ng-container> -->\n        </ng-template>\n        <ng-template #hierarchical_record_template let-rowIndex=\"index\" let-disabledRow=\"disabled\" let-rowData>\n            <igx-hierarchical-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [disabled]=\"disabledRow\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-hierarchical-grid-row>\n        </ng-template>\n\n        <ng-template #pinned_hierarchical_record_template let-rowIndex=\"index\" let-rowData>\n            <igx-hierarchical-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row #pinnedRow>\n            </igx-hierarchical-grid-row>\n        </ng-template>\n        <ng-template #child_record_template let-rowIndex=\"index\" let-rowData>\n            <div style=\"overflow: auto; width: 100%;\" [attr.data-rowindex]='rowIndex' (scroll)='onContainerScroll()'\n                [ngClass]=\"{\n                'igx-grid__tr-container': true,\n                'igx-grid__tr--highlighted':isRowHighlighted(rowData)\n            }\">\n                <igx-child-grid-row *ngFor=\"let layout of childLayoutList\" [parentGridID]=\"id\" [index]=\"rowIndex\"\n                    [data]=\"rowData\" [layout]='layout' #row>\n                </igx-child-grid-row>\n            </div>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && !isRowPinningToTop ? pinnedRecordsTemplate : null\">\n        </ng-container>\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n            id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n        <div class=\"igx-grid__row-editing-outlet\" igxOverlayOutlet #igxRowEditingOverlayOutlet></div>\n        <igc-trial-watermark *ngIf=\"!this.parent\"></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n    <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\" (pointerdown)=\"$event.preventDefault()\">\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div igxOverlayOutlet #igxBodyOverlayOutlet=\"overlay-outlet\"></div>\n</div>\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" [style.height.px]='summaryRowHeight' #tfoot>\n    <div tabindex=\"0\" (focus)=\"navigation.focusFirstCell(false)\" [attr.aria-activedescendant]=\"activeDescendant\"\n     (keydown)=\"navigation.summaryNav($event)\">\n        <igx-grid-summary-row [style.width.px]='calcWidth' [style.height.px]='summaryRowHeight'\n            *ngIf=\"hasSummarizedColumns && rootSummariesEnabled\" [gridID]=\"id\" role=\"row\"\n            [summaries]=\"id | igxGridSummaryDataPipe:summaryService.retriggerRootPipe\" [index]=\"dataView.length\"\n            class=\"igx-grid__summaries\" #summaryRow>\n        </igx-grid-summary-row>\n        <div class=\"igx-grid__tfoot-thumb\" [hidden]='!hasVerticalScroll()' [style.height.px]='summaryRowHeight'\n            [style.width.px]=\"scrollSize\"></div>\n    </div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\"  (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='[]' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n    <ng-content *ngIf=\"totalRecords || pagingMode === 1\"  select=\"igx-paginator\"></ng-content>\n    <ng-container #paginatorOutlet></ng-container>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultAddRowEmptyTemplate>\n    <button igxButton=\"raised\" igxRipple (click)=\"this.crudService.enterAddRowMode(null, false, $event)\">\n        {{resourceStrings.igx_grid_add_row_label}}\n    </button>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n\n<ng-template #defaultCollapsedTemplate>\n    <igx-icon role=\"button\">unfold_more</igx-icon>\n</ng-template>\n\n<ng-template #defaultExpandedTemplate>\n    <igx-icon role=\"button\" [active]='hasExpandedRecords() && hasExpandableChildren'>unfold_less</igx-icon>\n</ng-template>\n\n<div *ngIf=\"rowEditable\" igxToggle #rowEditingOverlay>\n    <div [className]=\"bannerClass\">\n        <ng-container\n            *ngTemplateOutlet=\"resolveRowEditContainer; context: { rowChangesCount: rowChangesCount, endEdit: this.crudService.endEdit.bind(this) }\">\n        </ng-container>\n    </div>\n</div>\n<ng-template #defaultRowEditText>\n    You have {{ rowChangesCount }} changes in this row\n</ng-template>\n<ng-template #defaultRowEditActions>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(false, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_cancel }}</button>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(true, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_done }}</button>\n</ng-template>\n<ng-template #defaultRowEditTemplate>\n    <div class=\"igx-banner__message\">\n        <span class=\"igx-banner__text\">\n            <ng-container\n                *ngTemplateOutlet=\"this.crudService.row?.getClassName() === 'IgxAddRow' ? rowAddText : resolveRowEditText || defaultRowEditText;\n                context: { $implicit: this.crudService.row?.getClassName() !== 'IgxAddRow' ? rowChangesCount : null }\">\n            </ng-container>\n        </span>\n    </div>\n    <div class=\"igx-banner__actions\">\n        <div class=\"igx-banner__row\">\n            <ng-container\n                *ngTemplateOutlet=\"resolveRowEditActions || defaultRowEditActions; context: { $implicit: this.endEdit.bind(this) }\">\n            </ng-container>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #dragIndicatorIconBase>\n    <igx-icon>drag_indicator</igx-icon>\n</ng-template>\n\n<igx-grid-column-resizer *ngIf=\"colResizingService.showResizer\"></igx-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n", components: [{ type: i3.IgxGridHeaderRowComponent, selector: "igx-grid-header-row", inputs: ["grid", "pinnedColumnCollection", "unpinnedColumnCollection", "activeDescendant", "hasMRL", "width", "density"] }, { type: i4.IgxHierarchicalRowComponent, selector: "igx-hierarchical-grid-row" }, { type: IgxChildGridRowComponent, selector: "igx-child-grid-row", inputs: ["layout", "parentGridID", "data", "index"] }, { type: i5.IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: ["id", "isIndeterminate", "textVisibility", "text"] }, { type: i6.IgxSnackbarComponent, selector: "igx-snackbar", inputs: ["id", "actionText", "positionSettings"], outputs: ["clicked", "animationStarted", "animationDone"] }, { type: i7.IgxSummaryRowComponent, selector: "igx-grid-summary-row", inputs: ["summaries", "gridID", "index", "firstCellIndentation"] }, { type: i8.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i9.IgxGridColumnResizerComponent, selector: "igx-grid-column-resizer", inputs: ["restrictResizerTop"] }], directives: [{ type: i10.IgxGridBodyDirective, selector: "[igxGridBody]" }, { type: i11.IgxGridDragSelectDirective, selector: "[igxGridDragSelect]", inputs: ["igxGridDragSelect"], outputs: ["dragStop", "dragScroll"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i12.IgxColumnMovingDropDirective, selector: "[igxColumnMovingDrop]", inputs: ["igxColumnMovingDrop"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i13.IgxGridForOfDirective, selector: "[igxGridFor][igxGridForOf]", inputs: ["igxGridForOf", "igxGridForOfUniqueSizeCache", "igxGridForOfVariableSizes"], outputs: ["dataChanging"] }, { type: i14.IgxTemplateOutletDirective, selector: "[igxTemplateOutlet]", inputs: ["igxTemplateOutletContext", "igxTemplateOutlet"], outputs: ["viewCreated", "viewMoved", "cachedViewLoaded", "beforeViewDetach"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i15.IgxOverlayOutletDirective, selector: "[igxOverlayOutlet]", exportAs: ["overlay-outlet"] }, { type: i15.IgxToggleDirective, selector: "[igxToggle]", inputs: ["id"], outputs: ["opened", "opening", "closed", "closing", "appended"], exportAs: ["toggle"] }, { type: i16.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i17.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }, { type: i18.IgxRowEditTabStopDirective, selector: "[igxRowEditTabStop]" }], pipes: { "gridSort": i19.IgxGridSortingPipe, "gridFiltering": i19.IgxGridFilteringPipe, "gridRowPinning": i20.IgxGridRowPinningPipe, "gridAddRow": i20.IgxGridAddRowPipe, "visibleColumns": i20.IgxHasVisibleColumnsPipe, "gridTransaction": i20.IgxGridTransactionPipe, "gridHierarchical": i21.IgxGridHierarchicalPipe, "gridHierarchicalPaging": i21.IgxGridHierarchicalPagingPipe, "igxGridRowClasses": i20.IgxGridRowClassesPipe, "igxGridRowStyles": i20.IgxGridRowStylesPipe, "igxGridSummaryDataPipe": i22.IgxSummaryDataPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-hierarchical-grid', providers: [
                        IgxGridCRUDService,
                        IgxGridSelectionService,
                        { provide: IGX_GRID_SERVICE_BASE, useClass: IgxHierarchicalGridAPIService },
                        { provide: IGX_GRID_BASE, useExisting: IgxHierarchicalGridComponent },
                        IgxGridSummaryService,
                        IgxFilteringService,
                        IgxHierarchicalGridNavigationService,
                        IgxForOfSyncService,
                        IgxForOfScrollSyncService,
                        IgxRowIslandAPIService
                    ], template: "<ng-content select=\"igx-grid-toolbar\"></ng-content>\n<ng-container #toolbarOutlet></ng-container>\n\n<igx-grid-header-row class=\"igx-grid-thead\" tabindex=\"0\"\n    [grid]=\"this\"\n    [hasMRL]=\"hasColumnLayouts\"\n    [activeDescendant]=\"activeDescendant\"\n    [width]=\"calcWidth\"\n    [pinnedColumnCollection]=\"pinnedColumns\"\n    [unpinnedColumnCollection]=\"unpinnedColumns\"\n    (keydown.meta.c)=\"copyHandler($event)\"\n    (keydown.control.c)=\"copyHandler($event)\"\n    (copy)=\"copyHandler($event)\"\n    (keydown)=\"navigation.headerNavigation($event)\"\n    (focus)=\"navigation.focusFirstCell()\"\n>\n</igx-grid-header-row>\n\n<div igxGridBody (keydown.control.c)=\"copyHandler($event)\" (copy)=\"copyHandler($event)\" class=\"igx-grid__tbody\" role=\"rowgroup\">\n    <div class=\"igx-grid__tbody-content\"  tabindex=\"0\" (focus)=\"navigation.focusTbody($event)\"\n     (keydown)=\"navigation.handleNavigation($event)\" (dragStop)=\"selectionService.dragMode = $event\"\n        (dragScroll)=\"dragScroll($event)\" [igxGridDragSelect]=\"selectionService.dragMode\" [attr.aria-activedescendant]=\"activeDescendant\" [attr.role]=\"dataView.length ? null : 'row'\"\n        [style.height.px]='totalHeight' [style.width.px]='calcWidth' #tbody (scroll)='preventContainerScroll($event)'>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length <= 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-left\"></span>\n        <span *ngIf=\"moving && columnInDrag && pinnedColumns.length > 0\"\n            [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\" id=\"left\"\n            class=\"igx-grid__scroll-on-drag-pinned\" [style.left.px]=\"pinnedWidth\"></span>\n        <ng-template #pinnedRecordsTemplate>\n            <ng-container *ngIf=\"data\n            | gridTransaction:id:pipeTrigger\n            | visibleColumns:hasVisibleColumns\n            | gridAddRow:true:pipeTrigger\n            | gridRowPinning:id:true:pipeTrigger\n            | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger:true\n            | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger:true as pinnedData\">\n                <div #pinContainer *ngIf='pinnedData.length > 0' class='igx-grid__tr--pinned'\n                    [ngClass]=\"{ 'igx-grid__tr--pinned-bottom':  !isRowPinningToTop, 'igx-grid__tr--pinned-top': isRowPinningToTop }\"\n                    [style.width.px]='calcWidth'>\n                    <ng-container *ngFor=\"let rowData of pinnedData; let rowIndex = index\">\n                        <ng-container *ngTemplateOutlet=\"pinned_hierarchical_record_template; context: getContext(rowData, rowIndex, true)\">\n                        </ng-container>\n                    </ng-container>\n                </div>\n            </ng-container>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && isRowPinningToTop ? pinnedRecordsTemplate : null\">\n        </ng-container>\n        <ng-template igxGridFor let-rowData let-rowIndex=\"index\" [igxGridForOf]=\"data\n        | gridTransaction:id:pipeTrigger\n        | visibleColumns:hasVisibleColumns\n        | gridFiltering:filteringExpressionsTree:filterStrategy:advancedFilteringExpressionsTree:id:pipeTrigger:filteringPipeTrigger\n        | gridSort:sortingExpressions:sortStrategy:id:pipeTrigger\n        | gridHierarchicalPaging:paginator?.page:paginator?.perPage:id:pipeTrigger\n        | gridHierarchical:expansionStates:id:primaryKey:childLayoutKeys:pipeTrigger\n        | gridAddRow:false:pipeTrigger\n        | gridRowPinning:id:false:pipeTrigger\"\n            [igxForScrollOrientation]=\"'vertical'\" [igxForScrollContainer]='verticalScroll'\n            [igxForContainerSize]='calcHeight' [igxForItemSize]=\"renderedRowHeight\" [igxForTrackBy]='trackChanges'\n            #verticalScrollContainer (chunkPreload)=\"dataLoading($event)\" (dataChanging)=\"dataRebinding($event)\" (dataChanged)=\"dataRebound($event)\">\n            <ng-template\n                [igxTemplateOutlet]='(isHierarchicalRecord(rowData) ? hierarchical_record_template : (isChildGridRecord(rowData) ? child_record_template : hierarchical_record_template))'\n                [igxTemplateOutletContext]='getContext(rowData, rowIndex, false)' (viewCreated)='viewCreatedHandler($event)'\n                (viewMoved)='viewMovedHandler($event)' (cachedViewLoaded)='cachedViewLoaded($event)'>\n            </ng-template>\n            <!-- <ng-container *igxTemplateOutlet=\"(isHierarchicalRecord(rowData) ? hierarchical_record_template : (isChildGridRecord(rowData) && isExpanded(rowData) ? child_record_template : hierarchical_record_template)); context: getContext(rowData)\"></ng-container> -->\n        </ng-template>\n        <ng-template #hierarchical_record_template let-rowIndex=\"index\" let-disabledRow=\"disabled\" let-rowData>\n            <igx-hierarchical-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [disabled]=\"disabledRow\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row>\n            </igx-hierarchical-grid-row>\n        </ng-template>\n\n        <ng-template #pinned_hierarchical_record_template let-rowIndex=\"index\" let-rowData>\n            <igx-hierarchical-grid-row [gridID]=\"id\" [index]=\"rowIndex\" [data]=\"rowData\"\n                [ngClass]=\"rowClasses | igxGridRowClasses:row:row.inEditMode:row.selected:row.dirty:row.deleted:row.dragging:rowIndex:hasColumnLayouts:false:rowData:pipeTrigger\"\n                [ngStyle]=\"rowStyles | igxGridRowStyles:rowData:rowIndex:pipeTrigger\" #row #pinnedRow>\n            </igx-hierarchical-grid-row>\n        </ng-template>\n        <ng-template #child_record_template let-rowIndex=\"index\" let-rowData>\n            <div style=\"overflow: auto; width: 100%;\" [attr.data-rowindex]='rowIndex' (scroll)='onContainerScroll()'\n                [ngClass]=\"{\n                'igx-grid__tr-container': true,\n                'igx-grid__tr--highlighted':isRowHighlighted(rowData)\n            }\">\n                <igx-child-grid-row *ngFor=\"let layout of childLayoutList\" [parentGridID]=\"id\" [index]=\"rowIndex\"\n                    [data]=\"rowData\" [layout]='layout' #row>\n                </igx-child-grid-row>\n            </div>\n        </ng-template>\n        <ng-container *ngTemplateOutlet=\"hasPinnedRecords && !isRowPinningToTop ? pinnedRecordsTemplate : null\">\n        </ng-container>\n        <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n        <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n            id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n        <div class=\"igx-grid__row-editing-outlet\" igxOverlayOutlet #igxRowEditingOverlayOutlet></div>\n        <igc-trial-watermark *ngIf=\"!this.parent\"></igc-trial-watermark>\n    </div>\n    <div igxToggle #loadingOverlay>\n        <igx-circular-bar [indeterminate]=\"true\" *ngIf='shouldOverlayLoading'>\n        </igx-circular-bar>\n    </div>\n    <span *ngIf=\"moving && columnInDrag\" [igxColumnMovingDrop]=\"headerContainer\" [attr.droppable]=\"true\"\n        id=\"right\" class=\"igx-grid__scroll-on-drag-right\"></span>\n    <div [hidden]='!hasVerticalScroll()' class=\"igx-grid__tbody-scrollbar\" [style.width.px]=\"scrollSize\" (pointerdown)=\"$event.preventDefault()\">\n        <div class=\"igx-grid__tbody-scrollbar-start\" [style.height.px]=' isRowPinningToTop ? pinnedRowHeight : 0'></div>\n        <div class=\"igx-grid__tbody-scrollbar-main\" [style.height.px]='calcHeight'>\n            <ng-template igxGridFor [igxGridForOf]='[]' #verticalScrollHolder></ng-template>\n        </div>\n        <div class=\"igx-grid__tbody-scrollbar-end\" [style.height.px]='!isRowPinningToTop ? pinnedRowHeight : 0'></div>\n    </div>\n    <div class=\"igx-grid__addrow-snackbar\">\n        <igx-snackbar #addRowSnackbar [outlet]=\"igxBodyOverlayOutlet\" [actionText]=\"resourceStrings.igx_grid_snackbar_addrow_actiontext\" [displayTime]='snackbarDisplayTime'>{{resourceStrings.igx_grid_snackbar_addrow_label}}</igx-snackbar>\n    </div>\n\n    <div igxOverlayOutlet #igxBodyOverlayOutlet=\"overlay-outlet\"></div>\n</div>\n\n<div class=\"igx-grid__tfoot\" role=\"rowgroup\" [style.height.px]='summaryRowHeight' #tfoot>\n    <div tabindex=\"0\" (focus)=\"navigation.focusFirstCell(false)\" [attr.aria-activedescendant]=\"activeDescendant\"\n     (keydown)=\"navigation.summaryNav($event)\">\n        <igx-grid-summary-row [style.width.px]='calcWidth' [style.height.px]='summaryRowHeight'\n            *ngIf=\"hasSummarizedColumns && rootSummariesEnabled\" [gridID]=\"id\" role=\"row\"\n            [summaries]=\"id | igxGridSummaryDataPipe:summaryService.retriggerRootPipe\" [index]=\"dataView.length\"\n            class=\"igx-grid__summaries\" #summaryRow>\n        </igx-grid-summary-row>\n        <div class=\"igx-grid__tfoot-thumb\" [hidden]='!hasVerticalScroll()' [style.height.px]='summaryRowHeight'\n            [style.width.px]=\"scrollSize\"></div>\n    </div>\n</div>\n\n<div class=\"igx-grid__scroll\" [style.height.px]=\"scrollSize\" #scr [hidden]=\"isHorizontalScrollHidden\"  (pointerdown)=\"$event.preventDefault()\">\n    <div class=\"igx-grid__scroll-start\" [style.width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth' [style.min-width.px]='isPinningToStart ? pinnedWidth : headerFeaturesWidth'></div>\n    <div class=\"igx-grid__scroll-main\" [style.width.px]='unpinnedWidth'>\n        <ng-template igxGridFor [igxGridForOf]='[]' #scrollContainer>\n        </ng-template>\n    </div>\n    <div class=\"igx-grid__scroll-end\" [style.float]='\"right\"' [style.width.px]='pinnedWidth' [style.min-width.px]='pinnedWidth' [hidden]=\"pinnedWidth === 0 || isPinningToStart\"></div>\n</div>\n\n<div class=\"igx-grid__footer\" #footer>\n    <ng-content select=\"igx-grid-footer\"></ng-content>\n    <ng-content *ngIf=\"totalRecords || pagingMode === 1\"  select=\"igx-paginator\"></ng-content>\n    <ng-container #paginatorOutlet></ng-container>\n</div>\n\n<ng-template #emptyFilteredGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyFilteredGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultEmptyGrid>\n    <span class=\"igx-grid__tbody-message\" role=\"cell\">\n        <span>{{emptyGridMessage}}</span>\n        <span *ngIf='showAddButton'>\n            <ng-container *ngTemplateOutlet='addRowEmptyTemplate || defaultAddRowEmptyTemplate'></ng-container>\n        </span>\n    </span>\n</ng-template>\n\n<ng-template #defaultAddRowEmptyTemplate>\n    <button igxButton=\"raised\" igxRipple (click)=\"this.crudService.enterAddRowMode(null, false, $event)\">\n        {{resourceStrings.igx_grid_add_row_label}}\n    </button>\n</ng-template>\n\n<ng-template #defaultLoadingGrid>\n    <div class=\"igx-grid__loading\">\n        <igx-circular-bar [indeterminate]=\"true\">\n        </igx-circular-bar>\n    </div>\n</ng-template>\n\n<ng-template #defaultCollapsedTemplate>\n    <igx-icon role=\"button\">unfold_more</igx-icon>\n</ng-template>\n\n<ng-template #defaultExpandedTemplate>\n    <igx-icon role=\"button\" [active]='hasExpandedRecords() && hasExpandableChildren'>unfold_less</igx-icon>\n</ng-template>\n\n<div *ngIf=\"rowEditable\" igxToggle #rowEditingOverlay>\n    <div [className]=\"bannerClass\">\n        <ng-container\n            *ngTemplateOutlet=\"resolveRowEditContainer; context: { rowChangesCount: rowChangesCount, endEdit: this.crudService.endEdit.bind(this) }\">\n        </ng-container>\n    </div>\n</div>\n<ng-template #defaultRowEditText>\n    You have {{ rowChangesCount }} changes in this row\n</ng-template>\n<ng-template #defaultRowEditActions>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(false, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_cancel }}</button>\n    <button igxButton igxRowEditTabStop (click)=\"this.endRowEditTabStop(true, $event)\">{{ this.resourceStrings.igx_grid_row_edit_btn_done }}</button>\n</ng-template>\n<ng-template #defaultRowEditTemplate>\n    <div class=\"igx-banner__message\">\n        <span class=\"igx-banner__text\">\n            <ng-container\n                *ngTemplateOutlet=\"this.crudService.row?.getClassName() === 'IgxAddRow' ? rowAddText : resolveRowEditText || defaultRowEditText;\n                context: { $implicit: this.crudService.row?.getClassName() !== 'IgxAddRow' ? rowChangesCount : null }\">\n            </ng-container>\n        </span>\n    </div>\n    <div class=\"igx-banner__actions\">\n        <div class=\"igx-banner__row\">\n            <ng-container\n                *ngTemplateOutlet=\"resolveRowEditActions || defaultRowEditActions; context: { $implicit: this.endEdit.bind(this) }\">\n            </ng-container>\n        </div>\n    </div>\n</ng-template>\n\n<ng-template #dragIndicatorIconBase>\n    <igx-icon>drag_indicator</igx-icon>\n</ng-template>\n\n<igx-grid-column-resizer *ngIf=\"colResizingService.showResizer\"></igx-grid-column-resizer>\n<div class=\"igx-grid__loading-outlet\" #igxLoadingOverlayOutlet igxOverlayOutlet></div>\n<div class=\"igx-grid__outlet\" #igxFilteringOverlayOutlet igxOverlayOutlet></div>\n" }]
        }], propDecorators: { role: [{
                type: HostBinding,
                args: ['attr.role']
            }], childLayoutList: [{
                type: ContentChildren,
                args: [IgxRowIslandComponent, { read: IgxRowIslandComponent, descendants: false }]
            }], allLayoutList: [{
                type: ContentChildren,
                args: [IgxRowIslandComponent, { read: IgxRowIslandComponent, descendants: true }]
            }], toolbarTemplate: [{
                type: ContentChild,
                args: [IgxGridToolbarDirective, { read: TemplateRef, static: true }]
            }], paginatorList: [{
                type: ContentChildren,
                args: [IgxPaginatorComponent, { descendants: true }]
            }], toolbarOutlet: [{
                type: ViewChild,
                args: ['toolbarOutlet', { read: ViewContainerRef }]
            }], paginatorOutlet: [{
                type: ViewChild,
                args: ['paginatorOutlet', { read: ViewContainerRef }]
            }], templateOutlets: [{
                type: ViewChildren,
                args: [IgxTemplateOutletDirective, { read: IgxTemplateOutletDirective }]
            }], hierarchicalRows: [{
                type: ViewChildren,
                args: [IgxChildGridRowComponent]
            }], hierarchicalRecordTemplate: [{
                type: ViewChild,
                args: ['hierarchical_record_template', { read: TemplateRef, static: true }]
            }], childTemplate: [{
                type: ViewChild,
                args: ['child_record_template', { read: TemplateRef, static: true }]
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], data: [{
                type: Input
            }], expandChildren: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2hpY2FsLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2hpZXJhcmNoaWNhbC1ncmlkL2hpZXJhcmNoaWNhbC1ncmlkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9oaWVyYXJjaGljYWwtZ3JpZC9jaGlsZC1ncmlkLXJvdy5jb21wb25lbnQuaHRtbCIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9oaWVyYXJjaGljYWwtZ3JpZC9oaWVyYXJjaGljYWwtZ3JpZC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0gsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osZUFBZSxFQUdmLFdBQVcsRUFDWCxNQUFNLEVBQ04sS0FBSyxFQUtMLFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGdCQUFnQixFQUNuQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUUxRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUM5RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FB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cUJBQXFCLEVBQUUsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFJbkYsZUFBZTtzQkFEckIsWUFBWTt1QkFBQyx1QkFBdUIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFLbkUsYUFBYTtzQkFEbkIsZUFBZTt1QkFBQyxxQkFBcUIsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7Z0JBSXRELGFBQWE7c0JBRG5CLFNBQVM7dUJBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUkvQyxlQUFlO3NCQURyQixTQUFTO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQU1qRCxlQUFlO3NCQURyQixZQUFZO3VCQUFDLDBCQUEwQixFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUEwQixFQUFFO2dCQU92RSxnQkFBZ0I7c0JBRHRCLFlBQVk7dUJBQUMsd0JBQXdCO2dCQUk1QiwwQkFBMEI7c0JBRG5DLFNBQVM7dUJBQUMsOEJBQThCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBSXBFLGFBQWE7c0JBRHRCLFNBQVM7dUJBQUMsdUJBQXVCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBb0Q1RCxFQUFFO3NCQUZaLFdBQVc7dUJBQUMsU0FBUzs7c0JBQ3JCLEtBQUs7Z0JBaUJLLElBQUk7c0JBRGQsS0FBSztnQkEyRkssY0FBYztzQkFEeEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQ29udGVudENoaWxkLFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBEb0NoZWNrLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4SGllcmFyY2hpY2FsR3JpZEFQSVNlcnZpY2UgfSBmcm9tICcuL2hpZXJhcmNoaWNhbC1ncmlkLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IElneFJvd0lzbGFuZENvbXBvbmVudCB9IGZyb20gJy4vcm93LWlzbGFuZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4RmlsdGVyaW5nU2VydmljZSB9IGZyb20gJy4uL2ZpbHRlcmluZy9ncmlkLWZpbHRlcmluZy5zZXJ2aWNlJztcbmltcG9ydCB7IElneENvbHVtbkNvbXBvbmVudCwgfSBmcm9tICcuLi9jb2x1bW5zL2NvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4SGllcmFyY2hpY2FsR3JpZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9oaWVyYXJjaGljYWwtZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4R3JpZFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc3VtbWFyaWVzL2dyaWQtc3VtbWFyeS5zZXJ2aWNlJztcbmltcG9ydCB7IElneEhpZXJhcmNoaWNhbEdyaWRCYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi9oaWVyYXJjaGljYWwtZ3JpZC1iYXNlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJZ3hUZW1wbGF0ZU91dGxldERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdGVtcGxhdGUtb3V0bGV0L3RlbXBsYXRlX291dGxldC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4Rm9yT2ZTeW5jU2VydmljZSwgSWd4Rm9yT2ZTY3JvbGxTeW5jU2VydmljZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvZm9yLW9mL2Zvcl9vZi5zeW5jLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VsbFR5cGUsIEdyaWRUeXBlLCBJR1hfR1JJRF9CQVNFLCBJR1hfR1JJRF9TRVJWSUNFX0JBU0UsIFJvd1R5cGUgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSWd4Um93SXNsYW5kQVBJU2VydmljZSB9IGZyb20gJy4vcm93LWlzbGFuZC1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkVG9vbGJhckRpcmVjdGl2ZSwgSWd4R3JpZFRvb2xiYXJUZW1wbGF0ZUNvbnRleHQgfSBmcm9tICcuLi90b29sYmFyL2NvbW1vbic7XG5pbXBvcnQgeyBJZ3hHcmlkQ1JVRFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vY3J1ZC5zZXJ2aWNlJztcbmltcG9ydCB7IElneEhpZXJhcmNoaWNhbEdyaWRSb3cgfSBmcm9tICcuLi9ncmlkLXB1YmxpYy1yb3cnO1xuaW1wb3J0IHsgSWd4R3JpZENlbGwgfSBmcm9tICcuLi9ncmlkLXB1YmxpYy1jZWxsJztcbmltcG9ydCB7IElneFBhZ2luYXRvckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL3BhZ2luYXRvci9wYWdpbmF0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRDb21wb25lbnQgfSBmcm9tICcuLi9ncmlkL2dyaWQuY29tcG9uZW50JztcbmltcG9ydCB7IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvZ2dsZS90b2dnbGUuZGlyZWN0aXZlJztcblxubGV0IE5FWFRfSUQgPSAwO1xuXG5leHBvcnQgaW50ZXJmYWNlIEhpZXJhcmNoaWNhbFN0YXRlUmVjb3JkIHtcbiAgICByb3dJRDogYW55O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBzZWxlY3RvcjogJ2lneC1jaGlsZC1ncmlkLXJvdycsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NoaWxkLWdyaWQtcm93LmNvbXBvbmVudC5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2hpbGRHcmlkUm93Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBsYXlvdXQ6IElneFJvd0lzbGFuZENvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBhcmVudEhhc1Njcm9sbCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnBhcmVudEdyaWQudmVydGljYWxTY3JvbGxDb250YWluZXIuZGMuaW5zdGFuY2Uubm90VmlydHVhbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBwYXJlbnRHcmlkSUQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqICBUaGUgZGF0YSBwYXNzZWQgdG8gdGhlIHJvdyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0IHRoZSByb3cgZGF0YSBmb3IgdGhlIGZpcnN0IHNlbGVjdGVkIHJvd1xuICAgICAqIGxldCBzZWxlY3RlZFJvd0RhdGEgPSB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzBdLmRhdGE7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGF0YTogYW55ID0gW107XG4gICAgLyoqXG4gICAgICogVGhlIGluZGV4IG9mIHRoZSByb3cuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgc2Vjb25kIHNlbGVjdGVkIHJvd1xuICAgICAqIGxldCBzZWxlY3RlZFJvd0luZGV4ID0gdGhpcy5ncmlkLnNlbGVjdGVkUm93c1sxXS5pbmRleDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpbmRleDogbnVtYmVyO1xuXG4gICAgQFZpZXdDaGlsZCgnaGdyaWQnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBoR3JpZDogSWd4SGllcmFyY2hpY2FsR3JpZENvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEdldCBhIHJlZmVyZW5jZSB0byB0aGUgZ3JpZCB0aGF0IGNvbnRhaW5zIHRoZSBzZWxlY3RlZCByb3cuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogaGFuZGxlUm93U2VsZWN0aW9uKGV2ZW50KSB7XG4gICAgICogIC8vIHRoZSBncmlkIG9uIHdoaWNoIHRoZSByb3dTZWxlY3RlZCBldmVudCB3YXMgdHJpZ2dlcmVkXG4gICAgICogIGNvbnN0IGdyaWQgPSBldmVudC5yb3cuZ3JpZDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtZ3JpZFxuICAgICAqICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAqICAgIChyb3dTZWxlY3RlZCk9XCJoYW5kbGVSb3dTZWxlY3Rpb24oJGV2ZW50KVwiPlxuICAgICAqICA8L2lneC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIC8vIFRPRE86IFJlZmFjdG9yXG4gICAgcHVibGljIGdldCBwYXJlbnRHcmlkKCk6IElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkQVBJLmdyaWQgYXMgSWd4SGllcmFyY2hpY2FsR3JpZENvbXBvbmVudDtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sZXZlbCcpXG4gICAgcHVibGljIGdldCBsZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5b3V0LmxldmVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBuYXRpdmUgRE9NIGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSByb3cuIENvdWxkIGJlIG51bGwgaW4gY2VydGFpbiBlbnZpcm9ubWVudHMuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0IHRoZSBuYXRpdmVFbGVtZW50IG9mIHRoZSBzZWNvbmQgc2VsZWN0ZWQgcm93XG4gICAgICogbGV0IHNlbGVjdGVkUm93TmF0aXZlRWxlbWVudCA9IHRoaXMuZ3JpZC5zZWxlY3RlZFJvd3NbMV0ubmF0aXZlRWxlbWVudDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG5hdGl2ZUVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHJvdyBpcyBleHBhbmRlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgUm93RXhwYW5kZWQgPSB0aGlzLmdyaWQxLnJvd0xpc3QuZmlyc3QuZXhwYW5kZWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGV4cGFuZGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9TRVJWSUNFX0JBU0UpIHB1YmxpYyBncmlkQVBJOiBJZ3hIaWVyYXJjaGljYWxHcmlkQVBJU2VydmljZSxcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMubGF5b3V0LmxheW91dENoYW5nZS5zdWJzY3JpYmUoKGNoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVMYXlvdXRDaGFuZ2VzKGNoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxheW91dC5pbml0aWFsQ2hhbmdlcztcbiAgICAgICAgY2hhbmdlcy5mb3JFYWNoKGNoYW5nZSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVMYXlvdXRDaGFuZ2VzKGNoYW5nZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhHcmlkLnBhcmVudCA9IHRoaXMucGFyZW50R3JpZDtcbiAgICAgICAgdGhpcy5oR3JpZC5wYXJlbnRJc2xhbmQgPSB0aGlzLmxheW91dDtcbiAgICAgICAgdGhpcy5oR3JpZC5jaGlsZFJvdyA9IHRoaXM7XG4gICAgICAgIC8vIGhhbmRsZXIgbG9naWMgdGhhdCByZS1lbWl0cyBoZ3JpZCBldmVudHMgb24gdGhlIHJvdyBpc2xhbmRcbiAgICAgICAgdGhpcy5zZXR1cEV2ZW50RW1pdHRlcnMoKTtcbiAgICAgICAgdGhpcy5sYXlvdXQuZ3JpZENyZWF0ZWQuZW1pdCh7XG4gICAgICAgICAgICBvd25lcjogdGhpcy5sYXlvdXQsXG4gICAgICAgICAgICBwYXJlbnRJRDogdGhpcy5kYXRhLnJvd0lELFxuICAgICAgICAgICAgZ3JpZDogdGhpcy5oR3JpZFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5oR3JpZC5jaGlsZExheW91dExpc3QgPSB0aGlzLmxheW91dC5jaGlsZHJlbjtcbiAgICAgICAgY29uc3QgbGF5b3V0cyA9IHRoaXMuaEdyaWQuY2hpbGRMYXlvdXRMaXN0LnRvQXJyYXkoKTtcbiAgICAgICAgbGF5b3V0cy5mb3JFYWNoKChsKSA9PiB0aGlzLmhHcmlkLmdyaWRBUEkucmVnaXN0ZXJDaGlsZFJvd0lzbGFuZChsKSk7XG4gICAgICAgIHRoaXMucGFyZW50R3JpZC5ncmlkQVBJLnJlZ2lzdGVyQ2hpbGRHcmlkKHRoaXMuZGF0YS5yb3dJRCwgdGhpcy5sYXlvdXQua2V5LCB0aGlzLmhHcmlkKTtcbiAgICAgICAgdGhpcy5sYXlvdXQucm93SXNsYW5kQVBJLnJlZ2lzdGVyQ2hpbGRHcmlkKHRoaXMuZGF0YS5yb3dJRCwgdGhpcy5oR3JpZCk7XG5cbiAgICAgICAgdGhpcy5sYXlvdXQuZ3JpZEluaXRpYWxpemVkLmVtaXQoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXMubGF5b3V0LFxuICAgICAgICAgICAgcGFyZW50SUQ6IHRoaXMuZGF0YS5yb3dJRCxcbiAgICAgICAgICAgIGdyaWQ6IHRoaXMuaEdyaWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5oR3JpZC5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBFdmVudEVtaXR0ZXJzKCkge1xuICAgICAgICBjb25zdCBkZXN0cnVjdG9yID0gdGFrZVVudGlsKHRoaXMuaEdyaWQuZGVzdHJveSQpO1xuXG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KElneEdyaWRDb21wb25lbnQpO1xuICAgICAgICAvLyBleGNsdWRlIG91dHB1dHMgcmVsYXRlZCB0byB0d28td2F5IGJpbmRpbmcgZnVuY3Rpb25hbGl0eVxuICAgICAgICBjb25zdCBpbnB1dE5hbWVzID0gZmFjdG9yeS5pbnB1dHMubWFwKGlucHV0ID0+IGlucHV0LnByb3BOYW1lKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGZhY3Rvcnkub3V0cHV0cy5maWx0ZXIobyA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ0lucHV0UHJvcE5hbWUgPSBvLnByb3BOYW1lLnNsaWNlKDAsIG8ucHJvcE5hbWUuaW5kZXhPZignQ2hhbmdlJykpO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0TmFtZXMuaW5kZXhPZihtYXRjaGluZ0lucHV0UHJvcE5hbWUpID09PSAtMTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVE9ETzogU2tpcCB0aGUgYHJlbmRlcmVkYCBvdXRwdXQuIFJlbmRlcmVkIHNob3VsZCBiZSBjYWxsZWQgb25jZSBwZXIgZ3JpZC5cbiAgICAgICAgb3V0cHV0cy5maWx0ZXIobyA9PiBvLnByb3BOYW1lICE9PSAncmVuZGVyZWQnKS5mb3JFYWNoKG91dHB1dCA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5oR3JpZFtvdXRwdXQucHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oR3JpZFtvdXRwdXQucHJvcE5hbWVdLnBpcGUoZGVzdHJ1Y3Rvcikuc3Vic2NyaWJlKChhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFyZ3Mub3duZXIgPSB0aGlzLmhHcmlkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxheW91dFtvdXRwdXQucHJvcE5hbWVdLmVtaXQoYXJncyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBfaGFuZGxlTGF5b3V0Q2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhHcmlkW2NoYW5nZV0gPSBjaGFuZ2VzW2NoYW5nZV0uY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbkBDb21wb25lbnQoe1xuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHNlbGVjdG9yOiAnaWd4LWhpZXJhcmNoaWNhbC1ncmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2hpZXJhcmNoaWNhbC1ncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSWd4R3JpZENSVURTZXJ2aWNlLFxuICAgICAgICBJZ3hHcmlkU2VsZWN0aW9uU2VydmljZSxcbiAgICAgICAgeyBwcm92aWRlOiBJR1hfR1JJRF9TRVJWSUNFX0JBU0UsIHVzZUNsYXNzOiBJZ3hIaWVyYXJjaGljYWxHcmlkQVBJU2VydmljZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IElHWF9HUklEX0JBU0UsIHVzZUV4aXN0aW5nOiBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50IH0sXG4gICAgICAgIElneEdyaWRTdW1tYXJ5U2VydmljZSxcbiAgICAgICAgSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgSWd4SGllcmFyY2hpY2FsR3JpZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgICAgICBJZ3hGb3JPZlN5bmNTZXJ2aWNlLFxuICAgICAgICBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlLFxuICAgICAgICBJZ3hSb3dJc2xhbmRBUElTZXJ2aWNlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50IGV4dGVuZHMgSWd4SGllcmFyY2hpY2FsR3JpZEJhc2VEaXJlY3RpdmVcbiAgICBpbXBsZW1lbnRzIEdyaWRUeXBlLCBBZnRlclZpZXdJbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjayB7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBwdWJsaWMgcm9sZSA9ICdncmlkJztcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFJvd0lzbGFuZENvbXBvbmVudCwgeyByZWFkOiBJZ3hSb3dJc2xhbmRDb21wb25lbnQsIGRlc2NlbmRhbnRzOiBmYWxzZSB9KVxuICAgIHB1YmxpYyBjaGlsZExheW91dExpc3Q6IFF1ZXJ5TGlzdDxJZ3hSb3dJc2xhbmRDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4Um93SXNsYW5kQ29tcG9uZW50LCB7IHJlYWQ6IElneFJvd0lzbGFuZENvbXBvbmVudCwgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgICBwdWJsaWMgYWxsTGF5b3V0TGlzdDogUXVlcnlMaXN0PElneFJvd0lzbGFuZENvbXBvbmVudD47XG5cbiAgICBAQ29udGVudENoaWxkKElneEdyaWRUb29sYmFyRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgdG9vbGJhclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJZ3hHcmlkVG9vbGJhclRlbXBsYXRlQ29udGV4dD47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFBhZ2luYXRvckNvbXBvbmVudCwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KVxuICAgIHB1YmxpYyBwYWdpbmF0b3JMaXN0OiBRdWVyeUxpc3Q8SWd4UGFnaW5hdG9yQ29tcG9uZW50PjtcblxuICAgIEBWaWV3Q2hpbGQoJ3Rvb2xiYXJPdXRsZXQnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSlcbiAgICBwdWJsaWMgdG9vbGJhck91dGxldDogVmlld0NvbnRhaW5lclJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3BhZ2luYXRvck91dGxldCcsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KVxuICAgIHB1YmxpYyBwYWdpbmF0b3JPdXRsZXQ6IFZpZXdDb250YWluZXJSZWY7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGRyZW4oSWd4VGVtcGxhdGVPdXRsZXREaXJlY3RpdmUsIHsgcmVhZDogSWd4VGVtcGxhdGVPdXRsZXREaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgdGVtcGxhdGVPdXRsZXRzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkcmVuKElneENoaWxkR3JpZFJvd0NvbXBvbmVudClcbiAgICBwdWJsaWMgaGllcmFyY2hpY2FsUm93czogUXVlcnlMaXN0PElneENoaWxkR3JpZFJvd0NvbXBvbmVudD47XG5cbiAgICBAVmlld0NoaWxkKCdoaWVyYXJjaGljYWxfcmVjb3JkX3RlbXBsYXRlJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGhpZXJhcmNoaWNhbFJlY29yZFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnY2hpbGRfcmVjb3JkX3RlbXBsYXRlJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGNoaWxkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvLyBAVmlld0NoaWxkKCdoZWFkZXJIaWVyYXJjaHlFeHBhbmRlcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGdldCBoZWFkZXJIaWVyYXJjaHlFeHBhbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlYWRSb3cuaGVhZGVySGllcmFyY2h5RXhwYW5kZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBjaGlsZExheW91dEtleXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGlnaGxpZ2h0ZWRSb3dJRCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZU9uUmVuZGVyID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHBhcmVudDogSWd4SGllcmFyY2hpY2FsR3JpZENvbXBvbmVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGNoaWxkUm93OiBJZ3hDaGlsZEdyaWRSb3dDb21wb25lbnQ7XG5cbiAgICBwcml2YXRlIF9kYXRhO1xuICAgIHByaXZhdGUgX2ZpbHRlcmVkRGF0YSA9IG51bGw7XG4gICAgcHJpdmF0ZSBoX2lkID0gYGlneC1oaWVyYXJjaGljYWwtZ3JpZC0ke05FWFRfSUQrK31gO1xuICAgIHByaXZhdGUgY2hpbGRHcmlkVGVtcGxhdGVzOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xuICAgIHByaXZhdGUgc2Nyb2xsVG9wID0gMDtcbiAgICBwcml2YXRlIHNjcm9sbExlZnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYGlkYCBhdHRyaWJ1dGUuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIG5vdCBwcm92aWRlZCBpdCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgW2lkXT1cIidpZ3gtaGdyaWQtMSdcIiBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+PC9pZ3gtaGllcmFyY2hpY2FsLWdyaWQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaF9pZDtcbiAgICB9XG4gICAgcHVibGljIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaF9pZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IGxldHMgeW91IGZpbGwgdGhlIGBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50YCB3aXRoIGFuIGFycmF5IG9mIGRhdGEuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPjwvaWd4LWhpZXJhcmNoaWNhbC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZGF0YSh2YWx1ZTogYW55W10gfCBudWxsKSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB2YWx1ZSB8fCBbXTtcbiAgICAgICAgdGhpcy5zdW1tYXJ5U2VydmljZS5jbGVhclN1bW1hcnlDYWNoZSgpO1xuICAgICAgICBpZiAodGhpcy5zaG91bGRHZW5lcmF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiAodGhpcy5oZWlnaHQgPT09IG51bGwgfHwgdGhpcy5oZWlnaHQuaW5kZXhPZignJScpICE9PSAtMSkpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBoZWlnaHQgd2lsbCBjaGFuZ2UgYmFzZWQgb24gaG93IG11Y2ggZGF0YSB0aGVyZSBpcywgcmVjYWxjdWxhdGUgc2l6ZXMgaW4gaWd4Rm9yT2YuXG4gICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGRhdGEgc2V0IHRvIHRoZSBgSWd4SGllcmFyY2hpY2FsR3JpZENvbXBvbmVudGAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLmdyaWQuZmlsdGVyZWREYXRhO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55W10gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBwYWdpbmF0b3IoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgcmV0dXJuICghdGhpcy5wYXJlbnRJc2xhbmQgJiYgdGhpcy5wYWdpbmF0aW9uQ29tcG9uZW50cz8uZmlyc3QpIHx8IHRoaXMucm9vdEdyaWQucGFnaW5hdG9yTGlzdD8uZmluZCgocGcpID0+XG4gICAgICAgICAgICBwZy5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudD8uaWQgPT09IGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmluZyB0aGUgZmlsdGVyZWQgZGF0YSBpbiB0aGUgYElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuZmlsdGVyZWREYXRhID0gW3tcbiAgICAgKiAgICAgICBJRDogMSxcbiAgICAgKiAgICAgICBOYW1lOiBcIkFcIlxuICAgICAqIH1dO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGZpbHRlcmVkRGF0YSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9maWx0ZXJlZERhdGEgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmluZyB0aGUgZmlsdGVyZWQgZGF0YSBpbiB0aGUgYElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZmlsdGVyZWREYXRhID0gdGhpcy5ncmlkLmZpbHRlcmVkRGF0YTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBmaWx0ZXJlZERhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWx0ZXJlZERhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSB0b3RhbCBudW1iZXIgb2YgcmVjb3JkcyBpbiB0aGUgZGF0YSBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoaXMgcHJvcGVydHkgaXMgcmVxdWlyZWQgZm9yIHJlbW90ZSBncmlkIHZpcnR1YWxpemF0aW9uIHRvIGZ1bmN0aW9uIHdoZW4gaXQgaXMgYm91bmQgdG8gcmVtb3RlIGRhdGEuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgaXRlbUNvdW50ID0gdGhpcy5ncmlkMS50b3RhbEl0ZW1Db3VudDtcbiAgICAgKiB0aGlzLmdyaWQxLnRvdGFsSXRlbUNvdW50ID0gNTU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCB0b3RhbEl0ZW1Db3VudChjb3VudCkge1xuICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnRvdGFsSXRlbUNvdW50ID0gY291bnQ7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHRvdGFsSXRlbUNvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci50b3RhbEl0ZW1Db3VudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGlmIGFsbCBpbW1lZGlhdGUgY2hpbGRyZW4gb2YgdGhlIGBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50YCBzaG91bGQgYmUgZXhwYW5kZWQvY29sbGFwc2VkLlxuICAgICAqIERlZnVsdCB2YWx1ZSBpcyBmYWxzZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1oaWVyYXJjaGljYWwtZ3JpZCBbaWRdPVwiJ2lneC1ncmlkLTEnXCIgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiIFtleHBhbmRDaGlsZHJlbl09XCJ0cnVlXCI+PC9pZ3gtaGllcmFyY2hpY2FsLWdyaWQ+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4SGllcmFyY2hpY2FsR3JpZENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBleHBhbmRDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kZWZhdWx0RXhwYW5kU3RhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5leHBhbnNpb25TdGF0ZXMgPSBuZXcgTWFwPGFueSwgYm9vbGVhbj4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGlmIGFsbCBpbW1lZGlhdGUgY2hpbGRyZW4gb2YgdGhlIGBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50YCBwcmV2aW91c2x5IGhhdmUgYmVlbiBzZXQgdG8gYmUgZXhwYW5kZWQvY29sbGFwc2VkLlxuICAgICAqIElmIHByZXZpb3VzbHkgc2V0IGFuZCBzb21lIHJvd3MgaGF2ZSBiZWVuIG1hbnVhbGx5IGV4cGFuZGVkL2NvbGxhcHNlZCBpdCB3aWxsIHN0aWxsIHJldHVybiB0aGUgbGFzdCBzZXQgdmFsdWUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGV4cGFuZGVkID0gdGhpcy5ncmlkLmV4cGFuZENoaWxkcmVuO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGV4cGFuZENoaWxkcmVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmYXVsdEV4cGFuZFN0YXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGluIHZlcnNpb24gMTIuMS4wLiBVc2UgYGdldENlbGxCeUNvbHVtbmAgb3IgYGdldENlbGxCeUtleWAgaW5zdGVhZFxuICAgICAqXG4gICAgICogUmV0dXJucyBhIGBDZWxsVHlwZWAgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q2VsbCA9IHRoaXMuZ3JpZDEuZ2V0Q2VsbEJ5Q29sdW1uVmlzaWJsZUluZGV4KDIsXCJVbml0UHJpY2VcIik7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIHJvd0luZGV4XG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgcHVibGljIGdldENlbGxCeUNvbHVtblZpc2libGVJbmRleChyb3dJbmRleDogbnVtYmVyLCBpbmRleDogbnVtYmVyKTogQ2VsbFR5cGUge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd0J5SW5kZXgocm93SW5kZXgpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmNvbHVtbkxpc3QuZmluZCgoY29sKSA9PiBjb2wudmlzaWJsZUluZGV4ID09PSBpbmRleCk7XG4gICAgICAgIGlmIChyb3cgJiYgcm93IGluc3RhbmNlb2YgSWd4SGllcmFyY2hpY2FsR3JpZFJvdyAmJiBjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSWd4R3JpZENlbGwodGhpcywgcm93SW5kZXgsIGNvbHVtbi5maWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgcGFyZW50IHJvdy4gSXQgbWF5IGJlIGEgYHN0cmluZ2Agb3IgYG51bWJlcmAgaWYgYHByaW1hcnlLZXlgIG9mIHRoZVxuICAgICAqIHBhcmVudCBncmlkIGlzIHNldCBvciBhbiBvYmplY3QgcmVmZXJlbmNlIG9mIHRoZSBwYXJlbnQgcmVjb3JkIG90aGVyd2lzZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZm9yZWlnbktleSA9IHRoaXMuZ3JpZC5mb3JlaWduS2V5O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZvcmVpZ25LZXkoKSB7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5ncmlkQVBJLmdldFBhcmVudFJvd0lkKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc0V4cGFuZGFibGVDaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jaGlsZExheW91dEtleXMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlc29sdmVSb3dFZGl0Q29udGFpbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRJc2xhbmQgJiYgdGhpcy5wYXJlbnRJc2xhbmQucm93RWRpdEN1c3RvbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50SXNsYW5kLnJvd0VkaXRDb250YWluZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucm93RWRpdENvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCByZXNvbHZlUm93RWRpdEFjdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudElzbGFuZCA/IHRoaXMucGFyZW50SXNsYW5kLnJvd0VkaXRBY3Rpb25zIDogdGhpcy5yb3dFZGl0QWN0aW9ucztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCByZXNvbHZlUm93RWRpdFRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudElzbGFuZCA/IHRoaXMucGFyZW50SXNsYW5kLnJvd0VkaXRUZXh0IDogdGhpcy5yb3dFZGl0VGV4dDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBoaWRlQWN0aW9uU3RyaXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIGhpZGUgY2hpbGQgbGF5b3V0IGFjdGlvbnMgc3RyaXBzIHdoZW5cbiAgICAgICAgICAgIC8vIG1vdmluZyBvdXRzaWRlIHJvb3QgZ3JpZC5cbiAgICAgICAgICAgIHN1cGVyLmhpZGVBY3Rpb25TdHJpcCgpO1xuICAgICAgICAgICAgdGhpcy5hbGxMYXlvdXRMaXN0LmZvckVhY2gocmkgPT4ge1xuICAgICAgICAgICAgICAgIHJpLmFjdGlvblN0cmlwPy5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBhcmVudFJvd091dGxldERpcmVjdGl2ZSgpIHtcbiAgICAgICAgLy8gVGFyZ2V0aW5nIHBhcmVudCBvdXRsZXQgaW4gb3JkZXIgdG8gcHJldmVudCBoaWRpbmcgd2hlbiBvdXRsZXRcbiAgICAgICAgLy8gaXMgcHJlc2VudCBhdCBhIGNoaWxkIGdyaWQgYW5kIGlzIGF0dGFjaGVkIHRvIGEgcm93LlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5yb3dPdXRsZXREaXJlY3RpdmUgOiB0aGlzLm91dGxldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICAvLyB0aGlzLmV4cGFuc2lvblN0YXRlc0NoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCh2YWx1ZTogTWFwPGFueSwgYm9vbGVhbj4pID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHJlcyA9IEFycmF5LmZyb20odmFsdWUuZW50cmllcygpKS5maWx0ZXIoKHsxOiB2fSkgPT4gdiA9PT0gdHJ1ZSkubWFwKChba10pID0+IGspO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgdGhpcy5iYXRjaEVkaXRpbmcgPSAhIXRoaXMucm9vdEdyaWQuYmF0Y2hFZGl0aW5nO1xuICAgICAgICBpZiAodGhpcy5yb290R3JpZCAhPT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy5yb290R3JpZC5iYXRjaEVkaXRpbmdDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgodmFsOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYXRjaEVkaXRpbmcgPSB2YWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxDb250YWluZXIuZ2V0U2Nyb2xsKCkuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oZ192ZXJ0aWNhbFNjcm9sbEhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmhlYWRlckNvbnRhaW5lci5nZXRTY3JvbGwoKS5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhnX2hvcml6b250YWxTY3JvbGxIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5iZWZvcmVWaWV3RGVzdHJveWVkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKHZpZXcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0RhdGEgPSB2aWV3LmNvbnRleHQuJGltcGxpY2l0O1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDaGlsZEdyaWRSZWNvcmQocm93RGF0YSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWNoZWREYXRhID0gdGhpcy5jaGlsZEdyaWRUZW1wbGF0ZXMuZ2V0KHJvd0RhdGEucm93SUQpO1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZWREYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtbHBPdXRsZXQgPSBjYWNoZWREYXRhLm93bmVyO1xuICAgICAgICAgICAgICAgICAgICB0bWxwT3V0bGV0Ll92aWV3Q29udGFpbmVyUmVmLmRldGFjaCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheURlbnNpdHkgPSB0aGlzLnJvb3RHcmlkLmRpc3BsYXlEZW5zaXR5O1xuICAgICAgICAgICAgdGhpcy5zdW1tYXJ5U2VydmljZS5zdW1tYXJ5SGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIHRoaXMucm9vdEdyaWQub25EZW5zaXR5Q2hhbmdlZC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwbGF5RGVuc2l0eSA9IHRoaXMucm9vdEdyaWQuZGlzcGxheURlbnNpdHk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdW1tYXJ5U2VydmljZS5zdW1tYXJ5SGVpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRMYXlvdXRLZXlzID0gdGhpcy5wYXJlbnRJc2xhbmQuY2hpbGRyZW4ubWFwKChpdGVtKSA9PiBpdGVtLmtleSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjdGlvblN0cmlwID0gdGhpcy5wYXJlbnRJc2xhbmQgPyB0aGlzLnBhcmVudElzbGFuZC5hY3Rpb25TdHJpcCA6IHRoaXMuYWN0aW9uU3RyaXA7XG5cbiAgICAgICAgdGhpcy5oZWFkU2VsZWN0b3JzVGVtcGxhdGVzID0gdGhpcy5wYXJlbnRJc2xhbmQgP1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRJc2xhbmQuaGVhZFNlbGVjdG9yc1RlbXBsYXRlcyA6XG4gICAgICAgICAgICB0aGlzLmhlYWRTZWxlY3RvcnNUZW1wbGF0ZXM7XG5cbiAgICAgICAgdGhpcy5yb3dTZWxlY3RvcnNUZW1wbGF0ZXMgPSB0aGlzLnBhcmVudElzbGFuZCA/XG4gICAgICAgICAgICB0aGlzLnBhcmVudElzbGFuZC5yb3dTZWxlY3RvcnNUZW1wbGF0ZXMgOlxuICAgICAgICAgICAgdGhpcy5yb3dTZWxlY3RvcnNUZW1wbGF0ZXM7XG4gICAgICAgIHRoaXMuZHJhZ0luZGljYXRvckljb25UZW1wbGF0ZSA9IHRoaXMucGFyZW50SXNsYW5kID9cbiAgICAgICAgICAgIHRoaXMucGFyZW50SXNsYW5kLmRyYWdJbmRpY2F0b3JJY29uVGVtcGxhdGUgOlxuICAgICAgICAgICAgdGhpcy5kcmFnSW5kaWNhdG9ySWNvblRlbXBsYXRlO1xuICAgICAgICB0aGlzLnJvd0V4cGFuZGVkSW5kaWNhdG9yVGVtcGxhdGUgPSB0aGlzLnJvb3RHcmlkLnJvd0V4cGFuZGVkSW5kaWNhdG9yVGVtcGxhdGU7XG4gICAgICAgIHRoaXMucm93Q29sbGFwc2VkSW5kaWNhdG9yVGVtcGxhdGUgPSB0aGlzLnJvb3RHcmlkLnJvd0NvbGxhcHNlZEluZGljYXRvclRlbXBsYXRlO1xuICAgICAgICB0aGlzLmhlYWRlckNvbGxhcHNlSW5kaWNhdG9yVGVtcGxhdGUgPSB0aGlzLnJvb3RHcmlkLmhlYWRlckNvbGxhcHNlSW5kaWNhdG9yVGVtcGxhdGU7XG4gICAgICAgIHRoaXMuaGVhZGVyRXhwYW5kSW5kaWNhdG9yVGVtcGxhdGUgPSB0aGlzLnJvb3RHcmlkLmhlYWRlckV4cGFuZEluZGljYXRvclRlbXBsYXRlO1xuICAgICAgICB0aGlzLmV4Y2VsU3R5bGVIZWFkZXJJY29uVGVtcGxhdGUgPSB0aGlzLnJvb3RHcmlkLmV4Y2VsU3R5bGVIZWFkZXJJY29uVGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc29ydEFzY2VuZGluZ0hlYWRlckljb25UZW1wbGF0ZSA9IHRoaXMucm9vdEdyaWQuc29ydEFzY2VuZGluZ0hlYWRlckljb25UZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5zb3J0RGVzY2VuZGluZ0hlYWRlckljb25UZW1wbGF0ZSA9IHRoaXMucm9vdEdyaWQuc29ydERlc2NlbmRpbmdIZWFkZXJJY29uVGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc29ydEhlYWRlckljb25UZW1wbGF0ZSA9IHRoaXMucm9vdEdyaWQuc29ydEhlYWRlckljb25UZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5oYXNDaGlsZHJlbktleSA9IHRoaXMucGFyZW50SXNsYW5kID9cbiAgICAgICAgICAgIHRoaXMucGFyZW50SXNsYW5kLmhhc0NoaWxkcmVuS2V5IHx8IHRoaXMucm9vdEdyaWQuaGFzQ2hpbGRyZW5LZXkgOlxuICAgICAgICAgICAgdGhpcy5yb290R3JpZC5oYXNDaGlsZHJlbktleTtcbiAgICAgICAgdGhpcy5zaG93RXhwYW5kQWxsID0gdGhpcy5wYXJlbnRJc2xhbmQgP1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRJc2xhbmQuc2hvd0V4cGFuZEFsbCA6IHRoaXMucm9vdEdyaWQuc2hvd0V4cGFuZEFsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG91dGxldERpcmVjdGl2ZSgpOiBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdEdyaWQub3V0bGV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbHVtbkxpc3QoZmFsc2UpO1xuICAgICAgICB0aGlzLmNoaWxkTGF5b3V0S2V5cyA9IHRoaXMucGFyZW50ID9cbiAgICAgICAgICAgIHRoaXMucGFyZW50SXNsYW5kLmNoaWxkcmVuLm1hcCgoaXRlbSkgPT4gaXRlbS5rZXkpIDpcbiAgICAgICAgICAgIHRoaXMuY2hpbGRMYXlvdXRLZXlzID0gdGhpcy5jaGlsZExheW91dExpc3QubWFwKChpdGVtKSA9PiBpdGVtLmtleSk7XG4gICAgICAgIHRoaXMuY2hpbGRMYXlvdXRMaXN0Lm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgICB0aGlzLmNoaWxkTGF5b3V0TGlzdC5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT5cbiAgICAgICAgICAgIHRoaXMub25Sb3dJc2xhbmRDaGFuZ2UoKVxuICAgICAgICApO1xuICAgICAgICBzdXBlci5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBgUm93VHlwZWAgYnkgaW5kZXguXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteVJvdyA9IHRoaXMuZ3JpZDEuZ2V0Um93QnlJbmRleCgxKTtcbiAgICAgKiBgYGBcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Um93QnlJbmRleChpbmRleDogbnVtYmVyKTogUm93VHlwZSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5kYXRhVmlldy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUm93KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBgUm93VHlwZWAgYnkga2V5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlSb3cgPSB0aGlzLmdyaWQxLmdldFJvd0J5S2V5KDEpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Um93QnlLZXkoa2V5OiBhbnkpOiBSb3dUeXBlIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YVZpZXc7XG4gICAgICAgIGNvbnN0IHJlYyA9IHRoaXMucHJpbWFyeUtleSA/XG4gICAgICAgICAgICBkYXRhLmZpbmQocmVjb3JkID0+IHJlY29yZFt0aGlzLnByaW1hcnlLZXldID09PSBrZXkpIDpcbiAgICAgICAgICAgIGRhdGEuZmluZChyZWNvcmQgPT4gcmVjb3JkID09PSBrZXkpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGRhdGEuaW5kZXhPZihyZWMpO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IElneEhpZXJhcmNoaWNhbEdyaWRSb3codGhpcyBhcyBhbnksIGluZGV4LCByZWMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGFsbFJvd3MoKTogUm93VHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVZpZXcubWFwKChyZWMsIGluZGV4KSA9PiB0aGlzLmNyZWF0ZVJvdyhpbmRleCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNvbGxlY3Rpb24gb2YgYElneEhpZXJhcmNoaWNhbEdyaWRSb3dgcyBmb3IgY3VycmVudCBwYWdlLlxuICAgICAqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZGF0YVJvd3MoKTogUm93VHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsUm93cygpLmZpbHRlcihyb3cgPT4gcm93IGluc3RhbmNlb2YgSWd4SGllcmFyY2hpY2FsR3JpZFJvdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiB0aGUgc2VsZWN0ZWQgYElneEdyaWRDZWxsYHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBzZWxlY3RlZENlbGxzID0gdGhpcy5ncmlkLnNlbGVjdGVkQ2VsbHM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBzZWxlY3RlZENlbGxzKCk6IENlbGxUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhUm93cygpLm1hcCgocm93KSA9PiByb3cuY2VsbHMuZmlsdGVyKChjZWxsKSA9PiBjZWxsLnNlbGVjdGVkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGBDZWxsVHlwZWAgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q2VsbCA9IHRoaXMuZ3JpZDEuZ2V0Q2VsbEJ5Q29sdW1uKDIsIFwiVW5pdFByaWNlXCIpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByb3dJbmRleFxuICAgICAqIEBwYXJhbSBjb2x1bW5GaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDZWxsQnlDb2x1bW4ocm93SW5kZXg6IG51bWJlciwgY29sdW1uRmllbGQ6IHN0cmluZyk6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3dCeUluZGV4KHJvd0luZGV4KTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdGhpcy5jb2x1bW5MaXN0LmZpbmQoKGNvbCkgPT4gY29sLmZpZWxkID09PSBjb2x1bW5GaWVsZCk7XG4gICAgICAgIGlmIChyb3cgJiYgcm93IGluc3RhbmNlb2YgSWd4SGllcmFyY2hpY2FsR3JpZFJvdyAmJiBjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSWd4R3JpZENlbGwodGhpcywgcm93SW5kZXgsIGNvbHVtbkZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBgQ2VsbFR5cGVgIG9iamVjdCB0aGF0IG1hdGNoZXMgdGhlIGNvbmRpdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJlcXVpcmVzIHRoYXQgdGhlIHByaW1hcnlLZXkgcHJvcGVydHkgaXMgc2V0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGdyaWQuZ2V0Q2VsbEJ5S2V5KDEsICdpbmRleCcpO1xuICAgICAqIGBgYFxuICAgICAqIEBwYXJhbSByb3dTZWxlY3RvciBtYXRjaCBhbnkgcm93SURcbiAgICAgKiBAcGFyYW0gY29sdW1uRmllbGRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q2VsbEJ5S2V5KHJvd1NlbGVjdG9yOiBhbnksIGNvbHVtbkZpZWxkOiBzdHJpbmcpOiBDZWxsVHlwZSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93QnlLZXkocm93U2VsZWN0b3IpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmNvbHVtbkxpc3QuZmluZCgoY29sKSA9PiBjb2wuZmllbGQgPT09IGNvbHVtbkZpZWxkKTtcbiAgICAgICAgaWYgKHJvdyAmJiBjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgSWd4R3JpZENlbGwodGhpcywgcm93LmluZGV4LCBjb2x1bW5GaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcGluUm93KHJvd0lEOiBhbnksIGluZGV4PzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93QnlLZXkocm93SUQpO1xuICAgICAgICByZXR1cm4gc3VwZXIucGluUm93KHJvd0lELCBpbmRleCwgcm93KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5waW5Sb3cocm93SUQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvd0J5S2V5KHJvd0lEKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnVucGluUm93KHJvd0lELCByb3cpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGRhdGFMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZGF0YVByZUxvYWQuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgZmVhdHVyZUNvbHVtbnNXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmZlYXR1cmVDb2x1bW5zV2lkdGgodGhpcy5oZWFkZXJIaWVyYXJjaHlFeHBhbmRlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBvblJvd0lzbGFuZENoYW5nZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkTGF5b3V0S2V5cyA9IHRoaXMucGFyZW50SXNsYW5kLmNoaWxkcmVuLmZpbHRlcihpdGVtID0+ICEoaXRlbSBhcyBhbnkpLl9kZXN0cm95ZWQpLm1hcCgoaXRlbSkgPT4gaXRlbS5rZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZExheW91dEtleXMgPSB0aGlzLmNoaWxkTGF5b3V0TGlzdC5maWx0ZXIoaXRlbSA9PiAhKGl0ZW0gYXMgYW55KS5fZGVzdHJveWVkKS5tYXAoKGl0ZW0pID0+IGl0ZW0ua2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISh0aGlzLmNkciBhcyBhbnkpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRBUEkuZ2V0Q2hpbGRHcmlkcyh0cnVlKS5mb3JFYWNoKChncmlkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFncmlkLmNoaWxkUm93LmNkci5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5jaGlsZFJvdy5jZHIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gaW4gY2FzZSBzZWxlY3Rpb24gaXMgaW4gZGVzdHJveWVkIGNoaWxkIGdyaWQsIHNlbGVjdGlvbiBzaG91bGQgYmUgY2xlYXJlZC5cbiAgICAgICAgICAgIHRoaXMuX2NsZWFyU2VsZXRpb25IaWdobGlnaHRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGlzUm93SGlnaGxpZ2h0ZWQocm93RGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlZFJvd0lEID09PSByb3dEYXRhLnJvd0lEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNIaWVyYXJjaGljYWxSZWNvcmQocmVjb3JkOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHaG9zdFJlY29yZChyZWNvcmQpKSB7XG4gICAgICAgICAgICByZWNvcmQgPSByZWNvcmQucmVjb3JkUmVmO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkTGF5b3V0TGlzdC5sZW5ndGggIT09IDAgJiYgcmVjb3JkW3RoaXMuY2hpbGRMYXlvdXRMaXN0LmZpcnN0LmtleV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBpc0NoaWxkR3JpZFJlY29yZChyZWNvcmQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBDYW4gYmUgbnVsbCB3aGVuIHRoZXJlIGlzIGRlZmluZWQgbGF5b3V0IGJ1dCBubyBjaGlsZCBkYXRhIHdhcyBmb3VuZFxuICAgICAgICByZXR1cm4gcmVjb3JkPy5jaGlsZEdyaWRzRGF0YSAhPT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhY2tDaGFuZ2VzKGluZGV4LCByZWMpIHtcbiAgICAgICAgaWYgKHJlYy5jaGlsZEdyaWRzRGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBpZiBpcyBjaGlsZCByZWNcbiAgICAgICAgICAgIHJldHVybiByZWMucm93SUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldENvbnRleHQocm93RGF0YSwgcm93SW5kZXgsIHBpbm5lZCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hpbGRHcmlkUmVjb3JkKHJvd0RhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWREYXRhID0gdGhpcy5jaGlsZEdyaWRUZW1wbGF0ZXMuZ2V0KHJvd0RhdGEucm93SUQpO1xuICAgICAgICAgICAgaWYgKGNhY2hlZERhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gY2FjaGVkRGF0YS52aWV3O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRtbHBPdXRsZXQgPSBjYWNoZWREYXRhLm93bmVyO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICRpbXBsaWNpdDogcm93RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZVZpZXc6IHZpZXcsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0bWxwT3V0bGV0LFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogdGhpcy5kYXRhVmlldy5pbmRleE9mKHJvd0RhdGEpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2hpbGQgcm93cyBjb250YWluIHVuaXF1ZSBncmlkcywgaGVuY2Ugc2hvdWxkIGhhdmUgdW5pcXVlIHRlbXBsYXRlc1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICRpbXBsaWNpdDogcm93RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVJRDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NoaWxkUm93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiByb3dEYXRhLnJvd0lEXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiB0aGlzLmRhdGFWaWV3LmluZGV4T2Yocm93RGF0YSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAkaW1wbGljaXQ6IHRoaXMuaXNHaG9zdFJlY29yZChyb3dEYXRhKSA/IHJvd0RhdGEucmVjb3JkUmVmIDogcm93RGF0YSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUlEOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRhUm93JyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGluZGV4OiB0aGlzLmdldERhdGFWaWV3SW5kZXgocm93SW5kZXgsIHBpbm5lZCksXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNHaG9zdFJlY29yZChyb3dEYXRhKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJvb3RHcmlkKCk6IEdyaWRUeXBlIHtcbiAgICAgICAgbGV0IGN1cnJHcmlkID0gdGhpcyBhcyBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50O1xuICAgICAgICB3aGlsZSAoY3VyckdyaWQucGFyZW50KSB7XG4gICAgICAgICAgICBjdXJyR3JpZCA9IGN1cnJHcmlkLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VyckdyaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaWNvblRlbXBsYXRlKCkge1xuICAgICAgICBjb25zdCBleHBhbmRlZCA9IHRoaXMuaGFzRXhwYW5kZWRSZWNvcmRzKCkgJiYgdGhpcy5oYXNFeHBhbmRhYmxlQ2hpbGRyZW47XG4gICAgICAgIGlmICghZXhwYW5kZWQgJiYgdGhpcy5zaG93RXhwYW5kQWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkZXJDb2xsYXBzZUluZGljYXRvclRlbXBsYXRlIHx8IHRoaXMuZGVmYXVsdENvbGxhcHNlZFRlbXBsYXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyRXhwYW5kSW5kaWNhdG9yVGVtcGxhdGUgfHwgdGhpcy5kZWZhdWx0RXhwYW5kZWRUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RHJhZ0dob3N0Q3VzdG9tVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudElzbGFuZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50SXNsYW5kLmdldERyYWdHaG9zdEN1c3RvbVRlbXBsYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLmdldERyYWdHaG9zdEN1c3RvbVRlbXBsYXRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEdldHMgdGhlIHZpc2libGUgY29udGVudCBoZWlnaHQgdGhhdCBpbmNsdWRlcyBoZWFkZXIgKyB0Ym9keSArIGZvb3Rlci5cbiAgICAgKiBGb3IgaGllcmFyY2hpY2FsIGNoaWxkIGdyaWQgaXQgbWF5IGJlIHNjcm9sbGVkIGFuZCBub3QgZnVsbHkgdmlzaWJsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0VmlzaWJsZUNvbnRlbnRIZWlnaHQoKSB7XG4gICAgICAgIGxldCBoZWlnaHQgPSBzdXBlci5nZXRWaXNpYmxlQ29udGVudEhlaWdodCgpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3RIZWlnaHQgPSB0aGlzLnJvb3RHcmlkLmdldFZpc2libGVDb250ZW50SGVpZ2h0KCk7XG4gICAgICAgICAgICBjb25zdCB0b3BEaWZmID0gdGhpcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIHRoaXMucm9vdEdyaWQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICBoZWlnaHQgPSByb290SGVpZ2h0IC0gdG9wRGlmZiA+IGhlaWdodCA/IGhlaWdodCA6IHJvb3RIZWlnaHQgLSB0b3BEaWZmO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVBbGwoKSB7XG4gICAgICAgIGNvbnN0IGV4cGFuZGVkID0gdGhpcy5oYXNFeHBhbmRlZFJlY29yZHMoKSAmJiB0aGlzLmhhc0V4cGFuZGFibGVDaGlsZHJlbjtcbiAgICAgICAgaWYgKCFleHBhbmRlZCAmJiB0aGlzLnNob3dFeHBhbmRBbGwpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kQWxsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlQWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzRXhwYW5kZWRSZWNvcmRzKCkge1xuICAgICAgICBpZiAodGhpcy5leHBhbmRDaGlsZHJlbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhhc0V4cGFuZGVkRW50cnkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5leHBhbnNpb25TdGF0ZXMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBoYXNFeHBhbmRlZEVudHJ5ID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaGFzRXhwYW5kZWRFbnRyeTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RGVmYXVsdEV4cGFuZFN0YXRlKHJlY29yZDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuS2V5ICYmICFyZWNvcmRbdGhpcy5oYXNDaGlsZHJlbktleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5leHBhbmRDaGlsZHJlbjtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNFeHBhbmRlZChyZWNvcmQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkQVBJLmdldF9yb3dfZXhwYW5zaW9uX3N0YXRlKHJlY29yZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB2aWV3Q3JlYXRlZEhhbmRsZXIoYXJncykge1xuICAgICAgICBpZiAodGhpcy5pc0NoaWxkR3JpZFJlY29yZChhcmdzLmNvbnRleHQuJGltcGxpY2l0KSkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gYXJncy5jb250ZXh0LiRpbXBsaWNpdC5yb3dJRDtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRHcmlkVGVtcGxhdGVzLnNldChrZXksIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB2aWV3TW92ZWRIYW5kbGVyKGFyZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaGlsZEdyaWRSZWNvcmQoYXJncy5jb250ZXh0LiRpbXBsaWNpdCkpIHtcbiAgICAgICAgICAgIC8vIHZpZXcgd2FzIG1vdmVkLCB1cGRhdGUgb3duZXIgaW4gY2FjaGVcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGFyZ3MuY29udGV4dC4kaW1wbGljaXQucm93SUQ7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWREYXRhID0gdGhpcy5jaGlsZEdyaWRUZW1wbGF0ZXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBjYWNoZWREYXRhLm93bmVyID0gYXJncy5vd25lcjtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZExheW91dExpc3QuZm9yRWFjaCgobGF5b3V0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlZEdyaWQgPSB0aGlzLmdyaWRBUEkuZ2V0Q2hpbGRHcmlkQnlJRChsYXlvdXQua2V5LCBhcmdzLmNvbnRleHQuJGltcGxpY2l0LnJvd0lEKTtcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZEdyaWQgJiYgcmVsYXRlZEdyaWQudXBkYXRlT25SZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGV0ZWN0IGNoYW5nZXMgaWYgYGV4cGFuZENoaWxkcmVuYCBoYXMgY2hhbmdlZCB3aGVuIHRoZSBncmlkIHdhc24ndCB2aXNpYmxlLiBUaGlzIGlzIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLlxuICAgICAgICAgICAgICAgICAgICByZWxhdGVkR3JpZC5ub3RpZnlDaGFuZ2VzKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZWxhdGVkR3JpZC51cGRhdGVPblJlbmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uQ29udGFpbmVyU2Nyb2xsKCkge1xuICAgICAgICB0aGlzLmhpZGVPdmVybGF5cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3JlYXRlUm93KGluZGV4OiBudW1iZXIsIGRhdGE/OiBhbnkpOiBSb3dUeXBlIHtcbiAgICAgICAgbGV0IHJvdzogUm93VHlwZTtcbiAgICAgICAgY29uc3QgZGF0YUluZGV4ID0gdGhpcy5fZ2V0RGF0YVZpZXdJbmRleChpbmRleCk7XG4gICAgICAgIGNvbnN0IHJlYzogYW55ID0gZGF0YSA/PyB0aGlzLmRhdGFWaWV3W2RhdGFJbmRleF07XG5cbiAgICAgICAgaWYgKCFyb3cgJiYgcmVjICYmICFyZWMuY2hpbGRHcmlkc0RhdGEpIHtcbiAgICAgICAgICAgIHJvdyA9IG5ldyBJZ3hIaWVyYXJjaGljYWxHcmlkUm93KHRoaXMgYXMgYW55LCBpbmRleCwgcmVjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldENoaWxkR3JpZHMoaW5EZXBoPzogYm9vbGVhbikge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkQVBJLmdldENoaWxkR3JpZHMoaW5EZXBoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVEYXRhRmllbGRzKGRhdGE6IGFueVtdKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2VuZXJhdGVEYXRhRmllbGRzKGRhdGEpLmZpbHRlcigoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxheW91dHNMaXN0ID0gdGhpcy5wYXJlbnRJc2xhbmQgPyB0aGlzLnBhcmVudElzbGFuZC5jaGlsZHJlbiA6IHRoaXMuY2hpbGRMYXlvdXRMaXN0O1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IGxheW91dHNMaXN0Lm1hcCgoaXRlbSkgPT4gaXRlbS5rZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGtleXMuaW5kZXhPZihmaWVsZCkgPT09IC0xO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVzaXplTm90aWZ5SGFuZGxlcigpIHtcbiAgICAgICAgLy8gZG8gbm90IHRyaWdnZXIgcmVmbG93IGlmIGVsZW1lbnQgaXMgZGV0YWNoZWQgb3IgaWYgaXQgaXMgY2hpbGQgZ3JpZC5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnQuY29udGFpbnModGhpcy5uYXRpdmVFbGVtZW50KSAmJiAhdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW5pdENvbHVtbnMoY29sbGVjdGlvbjogUXVlcnlMaXN0PElneENvbHVtbkNvbXBvbmVudD4sIGNiOiAoYXJnczogYW55KSA9PiB2b2lkID0gbnVsbCkge1xuICAgICAgICBpZiAodGhpcy5oYXNDb2x1bW5MYXlvdXRzKSB7XG4gICAgICAgICAgICAvLyBpbnZhbGlkIGNvbmZpZ3VyYXRpb24gLSBoaWVyYXJjaGljYWwgZ3JpZCBzaG91bGQgbm90IGFsbG93IGNvbHVtbiBsYXlvdXRzXG4gICAgICAgICAgICAvLyByZW1vdmUgY29sdW1uIGxheW91dHNcbiAgICAgICAgICAgIGNvbnN0IG5vbkNvbHVtbkxheW91dENvbHVtbnMgPSB0aGlzLmNvbHVtbkxpc3QuZmlsdGVyKChjb2wpID0+ICFjb2wuY29sdW1uTGF5b3V0ICYmICFjb2wuY29sdW1uTGF5b3V0Q2hpbGQpO1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5MaXN0LnJlc2V0KG5vbkNvbHVtbkxheW91dENvbHVtbnMpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmluaXRDb2x1bW5zKGNvbGxlY3Rpb24sIGNiKTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXR1cENvbHVtbnMoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudElzbGFuZCAmJiB0aGlzLnBhcmVudElzbGFuZC5jaGlsZENvbHVtbnMubGVuZ3RoID4gMCAmJiAhdGhpcy5hdXRvR2VuZXJhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29sdW1uc0xpc3QodGhpcy5wYXJlbnRJc2xhbmQuY2hpbGRDb2x1bW5zLnRvQXJyYXkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIuc2V0dXBDb2x1bW5zKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uQ29sdW1uc0NoYW5nZWQoY2hhbmdlOiBRdWVyeUxpc3Q8SWd4Q29sdW1uQ29tcG9uZW50Pikge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sdW1uTGlzdCgpO1xuICAgICAgICAgICAgY29uc3QgY29scyA9IGNoYW5nZS5maWx0ZXIoYyA9PiBjLmdyaWQgPT09IHRoaXMpO1xuICAgICAgICAgICAgaWYgKGNvbHMubGVuZ3RoID4gMCB8fCB0aGlzLmF1dG9HZW5lcmF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1uTGlzdC5yZXNldChjb2xzKTtcbiAgICAgICAgICAgICAgICBzdXBlci5vbkNvbHVtbnNDaGFuZ2VkKHRoaXMuY29sdW1uTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfc2hvdWxkQXV0b1NpemUocmVuZGVyZWRIZWlnaHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQZXJjZW50SGVpZ2h0ICYmIHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIuX3Nob3VsZEF1dG9TaXplKHJlbmRlcmVkSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNvbHVtbkxpc3QocmVjYWxjQ29sU2l6ZXMgPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkTGF5b3V0cyA9IHRoaXMucGFyZW50ID8gdGhpcy5jaGlsZExheW91dExpc3QgOiB0aGlzLmFsbExheW91dExpc3Q7XG4gICAgICAgIGNvbnN0IG5lc3RlZENvbHVtbnMgPSBjaGlsZExheW91dHMubWFwKChsYXlvdXQpID0+IGxheW91dC5jb2x1bW5MaXN0LnRvQXJyYXkoKSk7XG4gICAgICAgIGNvbnN0IGNvbHNBcnJheSA9IFtdLmNvbmNhdC5hcHBseShbXSwgbmVzdGVkQ29sdW1ucyk7XG4gICAgICAgIGNvbnN0IGNvbExlbmd0aCA9IHRoaXMuY29sdW1uTGlzdC5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdG9wQ29scyA9IHRoaXMuY29sdW1uTGlzdC5maWx0ZXIoKGl0ZW0pID0+IGNvbHNBcnJheS5pbmRleE9mKGl0ZW0pID09PSAtMSk7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQodG9wQ29scyk7XG4gICAgICAgICAgICBpZiAocmVjYWxjQ29sU2l6ZXMgJiYgdGhpcy5jb2x1bW5MaXN0Lmxlbmd0aCAhPT0gY29sTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVHcmlkU2l6ZXMoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2xlYXJTZWxldGlvbkhpZ2hsaWdodHMoKSB7XG4gICAgICAgIFt0aGlzLnJvb3RHcmlkLCAuLi50aGlzLnJvb3RHcmlkLmdldENoaWxkR3JpZHModHJ1ZSldLmZvckVhY2goZ3JpZCA9PiB7XG4gICAgICAgICAgICBncmlkLnNlbGVjdGlvblNlcnZpY2UuY2xlYXIoKTtcbiAgICAgICAgICAgIGdyaWQuc2VsZWN0aW9uU2VydmljZS5hY3RpdmVFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGdyaWQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpZ3gtZ3JpZF9fdHItLWhpZ2hsaWdodGVkJyk7XG4gICAgICAgICAgICBncmlkLmhpZ2hsaWdodGVkUm93SUQgPSBudWxsO1xuICAgICAgICAgICAgZ3JpZC5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBoZ192ZXJ0aWNhbFNjcm9sbEhhbmRsZXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0aGlzLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnNjcm9sbFBvc2l0aW9uO1xuICAgIH1cbiAgICBwcml2YXRlIGhnX2hvcml6b250YWxTY3JvbGxIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IHRoaXMuaGVhZGVyQ29udGFpbmVyLnNjcm9sbFBvc2l0aW9uO1xuICAgIH1cbn1cblxuIiwiPGRpdiBjbGFzcz1cImlneC1ncmlkX19oaWVyYXJjaGljYWwtaW5kZW50XCIgW25nQ2xhc3NdPVwieydpZ3gtZ3JpZF9faGllcmFyY2hpY2FsLWluZGVudC0tc2Nyb2xsJzogcGFyZW50SGFzU2Nyb2xsfVwiPlxuICAgIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgI2hncmlkIFtkYXRhXT0nZGF0YS5jaGlsZEdyaWRzRGF0YVtsYXlvdXQua2V5XSc+PC9pZ3gtaGllcmFyY2hpY2FsLWdyaWQ+XG48L2Rpdj5cbiIsIjxuZy1jb250ZW50IHNlbGVjdD1cImlneC1ncmlkLXRvb2xiYXJcIj48L25nLWNvbnRlbnQ+XG48bmctY29udGFpbmVyICN0b29sYmFyT3V0bGV0PjwvbmctY29udGFpbmVyPlxuXG48aWd4LWdyaWQtaGVhZGVyLXJvdyBjbGFzcz1cImlneC1ncmlkLXRoZWFkXCIgdGFiaW5kZXg9XCIwXCJcbiAgICBbZ3JpZF09XCJ0aGlzXCJcbiAgICBbaGFzTVJMXT1cImhhc0NvbHVtbkxheW91dHNcIlxuICAgIFthY3RpdmVEZXNjZW5kYW50XT1cImFjdGl2ZURlc2NlbmRhbnRcIlxuICAgIFt3aWR0aF09XCJjYWxjV2lkdGhcIlxuICAgIFtwaW5uZWRDb2x1bW5Db2xsZWN0aW9uXT1cInBpbm5lZENvbHVtbnNcIlxuICAgIFt1bnBpbm5lZENvbHVtbkNvbGxlY3Rpb25dPVwidW5waW5uZWRDb2x1bW5zXCJcbiAgICAoa2V5ZG93bi5tZXRhLmMpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiXG4gICAgKGtleWRvd24uY29udHJvbC5jKT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChjb3B5KT1cImNvcHlIYW5kbGVyKCRldmVudClcIlxuICAgIChrZXlkb3duKT1cIm5hdmlnYXRpb24uaGVhZGVyTmF2aWdhdGlvbigkZXZlbnQpXCJcbiAgICAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c0ZpcnN0Q2VsbCgpXCJcbj5cbjwvaWd4LWdyaWQtaGVhZGVyLXJvdz5cblxuPGRpdiBpZ3hHcmlkQm9keSAoa2V5ZG93bi5jb250cm9sLmMpPVwiY29weUhhbmRsZXIoJGV2ZW50KVwiIChjb3B5KT1cImNvcHlIYW5kbGVyKCRldmVudClcIiBjbGFzcz1cImlneC1ncmlkX190Ym9keVwiIHJvbGU9XCJyb3dncm91cFwiPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktY29udGVudFwiICB0YWJpbmRleD1cIjBcIiAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c1Rib2R5KCRldmVudClcIlxuICAgICAoa2V5ZG93bik9XCJuYXZpZ2F0aW9uLmhhbmRsZU5hdmlnYXRpb24oJGV2ZW50KVwiIChkcmFnU3RvcCk9XCJzZWxlY3Rpb25TZXJ2aWNlLmRyYWdNb2RlID0gJGV2ZW50XCJcbiAgICAgICAgKGRyYWdTY3JvbGwpPVwiZHJhZ1Njcm9sbCgkZXZlbnQpXCIgW2lneEdyaWREcmFnU2VsZWN0XT1cInNlbGVjdGlvblNlcnZpY2UuZHJhZ01vZGVcIiBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiYWN0aXZlRGVzY2VuZGFudFwiIFthdHRyLnJvbGVdPVwiZGF0YVZpZXcubGVuZ3RoID8gbnVsbCA6ICdyb3cnXCJcbiAgICAgICAgW3N0eWxlLmhlaWdodC5weF09J3RvdGFsSGVpZ2h0JyBbc3R5bGUud2lkdGgucHhdPSdjYWxjV2lkdGgnICN0Ym9keSAoc2Nyb2xsKT0ncHJldmVudENvbnRhaW5lclNjcm9sbCgkZXZlbnQpJz5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJtb3ZpbmcgJiYgY29sdW1uSW5EcmFnICYmIHBpbm5lZENvbHVtbnMubGVuZ3RoIDw9IDBcIlxuICAgICAgICAgICAgW2lneENvbHVtbk1vdmluZ0Ryb3BdPVwiaGVhZGVyQ29udGFpbmVyXCIgW2F0dHIuZHJvcHBhYmxlXT1cInRydWVcIiBpZD1cImxlZnRcIlxuICAgICAgICAgICAgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW9uLWRyYWctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJtb3ZpbmcgJiYgY29sdW1uSW5EcmFnICYmIHBpbm5lZENvbHVtbnMubGVuZ3RoID4gMFwiXG4gICAgICAgICAgICBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiIGlkPVwibGVmdFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtb24tZHJhZy1waW5uZWRcIiBbc3R5bGUubGVmdC5weF09XCJwaW5uZWRXaWR0aFwiPjwvc3Bhbj5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNwaW5uZWRSZWNvcmRzVGVtcGxhdGU+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZGF0YVxuICAgICAgICAgICAgfCBncmlkVHJhbnNhY3Rpb246aWQ6cGlwZVRyaWdnZXJcbiAgICAgICAgICAgIHwgdmlzaWJsZUNvbHVtbnM6aGFzVmlzaWJsZUNvbHVtbnNcbiAgICAgICAgICAgIHwgZ3JpZEFkZFJvdzp0cnVlOnBpcGVUcmlnZ2VyXG4gICAgICAgICAgICB8IGdyaWRSb3dQaW5uaW5nOmlkOnRydWU6cGlwZVRyaWdnZXJcbiAgICAgICAgICAgIHwgZ3JpZEZpbHRlcmluZzpmaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU6ZmlsdGVyU3RyYXRlZ3k6YWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU6aWQ6cGlwZVRyaWdnZXI6ZmlsdGVyaW5nUGlwZVRyaWdnZXI6dHJ1ZVxuICAgICAgICAgICAgfCBncmlkU29ydDpzb3J0aW5nRXhwcmVzc2lvbnM6c29ydFN0cmF0ZWd5OmlkOnBpcGVUcmlnZ2VyOnRydWUgYXMgcGlubmVkRGF0YVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgI3BpbkNvbnRhaW5lciAqbmdJZj0ncGlubmVkRGF0YS5sZW5ndGggPiAwJyBjbGFzcz0naWd4LWdyaWRfX3RyLS1waW5uZWQnXG4gICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ2lneC1ncmlkX190ci0tcGlubmVkLWJvdHRvbSc6ICAhaXNSb3dQaW5uaW5nVG9Ub3AsICdpZ3gtZ3JpZF9fdHItLXBpbm5lZC10b3AnOiBpc1Jvd1Bpbm5pbmdUb1RvcCB9XCJcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT0nY2FsY1dpZHRoJz5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgcm93RGF0YSBvZiBwaW5uZWREYXRhOyBsZXQgcm93SW5kZXggPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInBpbm5lZF9oaWVyYXJjaGljYWxfcmVjb3JkX3RlbXBsYXRlOyBjb250ZXh0OiBnZXRDb250ZXh0KHJvd0RhdGEsIHJvd0luZGV4LCB0cnVlKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoYXNQaW5uZWRSZWNvcmRzICYmIGlzUm93UGlubmluZ1RvVG9wID8gcGlubmVkUmVjb3Jkc1RlbXBsYXRlIDogbnVsbFwiPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIGlneEdyaWRGb3IgbGV0LXJvd0RhdGEgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBbaWd4R3JpZEZvck9mXT1cImRhdGFcbiAgICAgICAgfCBncmlkVHJhbnNhY3Rpb246aWQ6cGlwZVRyaWdnZXJcbiAgICAgICAgfCB2aXNpYmxlQ29sdW1uczpoYXNWaXNpYmxlQ29sdW1uc1xuICAgICAgICB8IGdyaWRGaWx0ZXJpbmc6ZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOmZpbHRlclN0cmF0ZWd5OmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlOmlkOnBpcGVUcmlnZ2VyOmZpbHRlcmluZ1BpcGVUcmlnZ2VyXG4gICAgICAgIHwgZ3JpZFNvcnQ6c29ydGluZ0V4cHJlc3Npb25zOnNvcnRTdHJhdGVneTppZDpwaXBlVHJpZ2dlclxuICAgICAgICB8IGdyaWRIaWVyYXJjaGljYWxQYWdpbmc6cGFnaW5hdG9yPy5wYWdlOnBhZ2luYXRvcj8ucGVyUGFnZTppZDpwaXBlVHJpZ2dlclxuICAgICAgICB8IGdyaWRIaWVyYXJjaGljYWw6ZXhwYW5zaW9uU3RhdGVzOmlkOnByaW1hcnlLZXk6Y2hpbGRMYXlvdXRLZXlzOnBpcGVUcmlnZ2VyXG4gICAgICAgIHwgZ3JpZEFkZFJvdzpmYWxzZTpwaXBlVHJpZ2dlclxuICAgICAgICB8IGdyaWRSb3dQaW5uaW5nOmlkOmZhbHNlOnBpcGVUcmlnZ2VyXCJcbiAgICAgICAgICAgIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCIndmVydGljYWwnXCIgW2lneEZvclNjcm9sbENvbnRhaW5lcl09J3ZlcnRpY2FsU2Nyb2xsJ1xuICAgICAgICAgICAgW2lneEZvckNvbnRhaW5lclNpemVdPSdjYWxjSGVpZ2h0JyBbaWd4Rm9ySXRlbVNpemVdPVwicmVuZGVyZWRSb3dIZWlnaHRcIiBbaWd4Rm9yVHJhY2tCeV09J3RyYWNrQ2hhbmdlcydcbiAgICAgICAgICAgICN2ZXJ0aWNhbFNjcm9sbENvbnRhaW5lciAoY2h1bmtQcmVsb2FkKT1cImRhdGFMb2FkaW5nKCRldmVudClcIiAoZGF0YUNoYW5naW5nKT1cImRhdGFSZWJpbmRpbmcoJGV2ZW50KVwiIChkYXRhQ2hhbmdlZCk9XCJkYXRhUmVib3VuZCgkZXZlbnQpXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAgICAgICBbaWd4VGVtcGxhdGVPdXRsZXRdPScoaXNIaWVyYXJjaGljYWxSZWNvcmQocm93RGF0YSkgPyBoaWVyYXJjaGljYWxfcmVjb3JkX3RlbXBsYXRlIDogKGlzQ2hpbGRHcmlkUmVjb3JkKHJvd0RhdGEpID8gY2hpbGRfcmVjb3JkX3RlbXBsYXRlIDogaGllcmFyY2hpY2FsX3JlY29yZF90ZW1wbGF0ZSkpJ1xuICAgICAgICAgICAgICAgIFtpZ3hUZW1wbGF0ZU91dGxldENvbnRleHRdPSdnZXRDb250ZXh0KHJvd0RhdGEsIHJvd0luZGV4LCBmYWxzZSknICh2aWV3Q3JlYXRlZCk9J3ZpZXdDcmVhdGVkSGFuZGxlcigkZXZlbnQpJ1xuICAgICAgICAgICAgICAgICh2aWV3TW92ZWQpPSd2aWV3TW92ZWRIYW5kbGVyKCRldmVudCknIChjYWNoZWRWaWV3TG9hZGVkKT0nY2FjaGVkVmlld0xvYWRlZCgkZXZlbnQpJz5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8IS0tIDxuZy1jb250YWluZXIgKmlneFRlbXBsYXRlT3V0bGV0PVwiKGlzSGllcmFyY2hpY2FsUmVjb3JkKHJvd0RhdGEpID8gaGllcmFyY2hpY2FsX3JlY29yZF90ZW1wbGF0ZSA6IChpc0NoaWxkR3JpZFJlY29yZChyb3dEYXRhKSAmJiBpc0V4cGFuZGVkKHJvd0RhdGEpID8gY2hpbGRfcmVjb3JkX3RlbXBsYXRlIDogaGllcmFyY2hpY2FsX3JlY29yZF90ZW1wbGF0ZSkpOyBjb250ZXh0OiBnZXRDb250ZXh0KHJvd0RhdGEpXCI+PC9uZy1jb250YWluZXI+IC0tPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2hpZXJhcmNoaWNhbF9yZWNvcmRfdGVtcGxhdGUgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBsZXQtZGlzYWJsZWRSb3c9XCJkaXNhYmxlZFwiIGxldC1yb3dEYXRhPlxuICAgICAgICAgICAgPGlneC1oaWVyYXJjaGljYWwtZ3JpZC1yb3cgW2dyaWRJRF09XCJpZFwiIFtpbmRleF09XCJyb3dJbmRleFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFJvd1wiIFtkYXRhXT1cInJvd0RhdGFcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInJvd0NsYXNzZXMgfCBpZ3hHcmlkUm93Q2xhc3Nlczpyb3c6cm93LmluRWRpdE1vZGU6cm93LnNlbGVjdGVkOnJvdy5kaXJ0eTpyb3cuZGVsZXRlZDpyb3cuZHJhZ2dpbmc6cm93SW5kZXg6aGFzQ29sdW1uTGF5b3V0czpmYWxzZTpyb3dEYXRhOnBpcGVUcmlnZ2VyXCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJyb3dTdHlsZXMgfCBpZ3hHcmlkUm93U3R5bGVzOnJvd0RhdGE6cm93SW5kZXg6cGlwZVRyaWdnZXJcIiAjcm93PlxuICAgICAgICAgICAgPC9pZ3gtaGllcmFyY2hpY2FsLWdyaWQtcm93PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcGlubmVkX2hpZXJhcmNoaWNhbF9yZWNvcmRfdGVtcGxhdGUgbGV0LXJvd0luZGV4PVwiaW5kZXhcIiBsZXQtcm93RGF0YT5cbiAgICAgICAgICAgIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQtcm93IFtncmlkSURdPVwiaWRcIiBbaW5kZXhdPVwicm93SW5kZXhcIiBbZGF0YV09XCJyb3dEYXRhXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJyb3dDbGFzc2VzIHwgaWd4R3JpZFJvd0NsYXNzZXM6cm93OnJvdy5pbkVkaXRNb2RlOnJvdy5zZWxlY3RlZDpyb3cuZGlydHk6cm93LmRlbGV0ZWQ6cm93LmRyYWdnaW5nOnJvd0luZGV4Omhhc0NvbHVtbkxheW91dHM6ZmFsc2U6cm93RGF0YTpwaXBlVHJpZ2dlclwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwicm93U3R5bGVzIHwgaWd4R3JpZFJvd1N0eWxlczpyb3dEYXRhOnJvd0luZGV4OnBpcGVUcmlnZ2VyXCIgI3JvdyAjcGlubmVkUm93PlxuICAgICAgICAgICAgPC9pZ3gtaGllcmFyY2hpY2FsLWdyaWQtcm93PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2NoaWxkX3JlY29yZF90ZW1wbGF0ZSBsZXQtcm93SW5kZXg9XCJpbmRleFwiIGxldC1yb3dEYXRhPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93OiBhdXRvOyB3aWR0aDogMTAwJTtcIiBbYXR0ci5kYXRhLXJvd2luZGV4XT0ncm93SW5kZXgnIChzY3JvbGwpPSdvbkNvbnRhaW5lclNjcm9sbCgpJ1xuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAnaWd4LWdyaWRfX3RyLWNvbnRhaW5lcic6IHRydWUsXG4gICAgICAgICAgICAgICAgJ2lneC1ncmlkX190ci0taGlnaGxpZ2h0ZWQnOmlzUm93SGlnaGxpZ2h0ZWQocm93RGF0YSlcbiAgICAgICAgICAgIH1cIj5cbiAgICAgICAgICAgICAgICA8aWd4LWNoaWxkLWdyaWQtcm93ICpuZ0Zvcj1cImxldCBsYXlvdXQgb2YgY2hpbGRMYXlvdXRMaXN0XCIgW3BhcmVudEdyaWRJRF09XCJpZFwiIFtpbmRleF09XCJyb3dJbmRleFwiXG4gICAgICAgICAgICAgICAgICAgIFtkYXRhXT1cInJvd0RhdGFcIiBbbGF5b3V0XT0nbGF5b3V0JyAjcm93PlxuICAgICAgICAgICAgICAgIDwvaWd4LWNoaWxkLWdyaWQtcm93PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoYXNQaW5uZWRSZWNvcmRzICYmICFpc1Jvd1Bpbm5pbmdUb1RvcCA/IHBpbm5lZFJlY29yZHNUZW1wbGF0ZSA6IG51bGxcIj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWdcIiBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiXG4gICAgICAgICAgICBpZD1cInJpZ2h0XCIgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsLW9uLWRyYWctcmlnaHRcIj48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fcm93LWVkaXRpbmctb3V0bGV0XCIgaWd4T3ZlcmxheU91dGxldCAjaWd4Um93RWRpdGluZ092ZXJsYXlPdXRsZXQ+PC9kaXY+XG4gICAgICAgIDxpZ2MtdHJpYWwtd2F0ZXJtYXJrICpuZ0lmPVwiIXRoaXMucGFyZW50XCI+PC9pZ2MtdHJpYWwtd2F0ZXJtYXJrPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWd4VG9nZ2xlICNsb2FkaW5nT3ZlcmxheT5cbiAgICAgICAgPGlneC1jaXJjdWxhci1iYXIgW2luZGV0ZXJtaW5hdGVdPVwidHJ1ZVwiICpuZ0lmPSdzaG91bGRPdmVybGF5TG9hZGluZyc+XG4gICAgICAgIDwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiAqbmdJZj1cIm1vdmluZyAmJiBjb2x1bW5JbkRyYWdcIiBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJoZWFkZXJDb250YWluZXJcIiBbYXR0ci5kcm9wcGFibGVdPVwidHJ1ZVwiXG4gICAgICAgIGlkPVwicmlnaHRcIiBjbGFzcz1cImlneC1ncmlkX19zY3JvbGwtb24tZHJhZy1yaWdodFwiPjwvc3Bhbj5cbiAgICA8ZGl2IFtoaWRkZW5dPSchaGFzVmVydGljYWxTY3JvbGwoKScgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktc2Nyb2xsYmFyXCIgW3N0eWxlLndpZHRoLnB4XT1cInNjcm9sbFNpemVcIiAocG9pbnRlcmRvd24pPVwiJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1zY3JvbGxiYXItc3RhcnRcIiBbc3R5bGUuaGVpZ2h0LnB4XT0nIGlzUm93UGlubmluZ1RvVG9wID8gcGlubmVkUm93SGVpZ2h0IDogMCc+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fdGJvZHktc2Nyb2xsYmFyLW1haW5cIiBbc3R5bGUuaGVpZ2h0LnB4XT0nY2FsY0hlaWdodCc+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgaWd4R3JpZEZvciBbaWd4R3JpZEZvck9mXT0nW10nICN2ZXJ0aWNhbFNjcm9sbEhvbGRlcj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1zY3JvbGxiYXItZW5kXCIgW3N0eWxlLmhlaWdodC5weF09JyFpc1Jvd1Bpbm5pbmdUb1RvcCA/IHBpbm5lZFJvd0hlaWdodCA6IDAnPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fYWRkcm93LXNuYWNrYmFyXCI+XG4gICAgICAgIDxpZ3gtc25hY2tiYXIgI2FkZFJvd1NuYWNrYmFyIFtvdXRsZXRdPVwiaWd4Qm9keU92ZXJsYXlPdXRsZXRcIiBbYWN0aW9uVGV4dF09XCJyZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfc25hY2tiYXJfYWRkcm93X2FjdGlvbnRleHRcIiBbZGlzcGxheVRpbWVdPSdzbmFja2JhckRpc3BsYXlUaW1lJz57e3Jlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9zbmFja2Jhcl9hZGRyb3dfbGFiZWx9fTwvaWd4LXNuYWNrYmFyPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBpZ3hPdmVybGF5T3V0bGV0ICNpZ3hCb2R5T3ZlcmxheU91dGxldD1cIm92ZXJsYXktb3V0bGV0XCI+PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cImlneC1ncmlkX190Zm9vdFwiIHJvbGU9XCJyb3dncm91cFwiIFtzdHlsZS5oZWlnaHQucHhdPSdzdW1tYXJ5Um93SGVpZ2h0JyAjdGZvb3Q+XG4gICAgPGRpdiB0YWJpbmRleD1cIjBcIiAoZm9jdXMpPVwibmF2aWdhdGlvbi5mb2N1c0ZpcnN0Q2VsbChmYWxzZSlcIiBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiYWN0aXZlRGVzY2VuZGFudFwiXG4gICAgIChrZXlkb3duKT1cIm5hdmlnYXRpb24uc3VtbWFyeU5hdigkZXZlbnQpXCI+XG4gICAgICAgIDxpZ3gtZ3JpZC1zdW1tYXJ5LXJvdyBbc3R5bGUud2lkdGgucHhdPSdjYWxjV2lkdGgnIFtzdHlsZS5oZWlnaHQucHhdPSdzdW1tYXJ5Um93SGVpZ2h0J1xuICAgICAgICAgICAgKm5nSWY9XCJoYXNTdW1tYXJpemVkQ29sdW1ucyAmJiByb290U3VtbWFyaWVzRW5hYmxlZFwiIFtncmlkSURdPVwiaWRcIiByb2xlPVwicm93XCJcbiAgICAgICAgICAgIFtzdW1tYXJpZXNdPVwiaWQgfCBpZ3hHcmlkU3VtbWFyeURhdGFQaXBlOnN1bW1hcnlTZXJ2aWNlLnJldHJpZ2dlclJvb3RQaXBlXCIgW2luZGV4XT1cImRhdGFWaWV3Lmxlbmd0aFwiXG4gICAgICAgICAgICBjbGFzcz1cImlneC1ncmlkX19zdW1tYXJpZXNcIiAjc3VtbWFyeVJvdz5cbiAgICAgICAgPC9pZ3gtZ3JpZC1zdW1tYXJ5LXJvdz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX190Zm9vdC10aHVtYlwiIFtoaWRkZW5dPSchaGFzVmVydGljYWxTY3JvbGwoKScgW3N0eWxlLmhlaWdodC5weF09J3N1bW1hcnlSb3dIZWlnaHQnXG4gICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwic2Nyb2xsU2l6ZVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fc2Nyb2xsXCIgW3N0eWxlLmhlaWdodC5weF09XCJzY3JvbGxTaXplXCIgI3NjciBbaGlkZGVuXT1cImlzSG9yaXpvbnRhbFNjcm9sbEhpZGRlblwiICAocG9pbnRlcmRvd24pPVwiJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Njcm9sbC1zdGFydFwiIFtzdHlsZS53aWR0aC5weF09J2lzUGlubmluZ1RvU3RhcnQgPyBwaW5uZWRXaWR0aCA6IGhlYWRlckZlYXR1cmVzV2lkdGgnIFtzdHlsZS5taW4td2lkdGgucHhdPSdpc1Bpbm5pbmdUb1N0YXJ0ID8gcGlubmVkV2lkdGggOiBoZWFkZXJGZWF0dXJlc1dpZHRoJz48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Njcm9sbC1tYWluXCIgW3N0eWxlLndpZHRoLnB4XT0ndW5waW5uZWRXaWR0aCc+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hHcmlkRm9yIFtpZ3hHcmlkRm9yT2ZdPSdbXScgI3Njcm9sbENvbnRhaW5lcj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX3Njcm9sbC1lbmRcIiBbc3R5bGUuZmxvYXRdPSdcInJpZ2h0XCInIFtzdHlsZS53aWR0aC5weF09J3Bpbm5lZFdpZHRoJyBbc3R5bGUubWluLXdpZHRoLnB4XT0ncGlubmVkV2lkdGgnIFtoaWRkZW5dPVwicGlubmVkV2lkdGggPT09IDAgfHwgaXNQaW5uaW5nVG9TdGFydFwiPjwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtZ3JpZF9fZm9vdGVyXCIgI2Zvb3Rlcj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtZ3JpZC1mb290ZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRlbnQgKm5nSWY9XCJ0b3RhbFJlY29yZHMgfHwgcGFnaW5nTW9kZSA9PT0gMVwiICBzZWxlY3Q9XCJpZ3gtcGFnaW5hdG9yXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy1jb250YWluZXIgI3BhZ2luYXRvck91dGxldD48L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2VtcHR5RmlsdGVyZWRHcmlkPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LWdyaWRfX3Rib2R5LW1lc3NhZ2VcIiByb2xlPVwiY2VsbFwiPlxuICAgICAgICA8c3Bhbj57e2VtcHR5RmlsdGVyZWRHcmlkTWVzc2FnZX19PC9zcGFuPlxuICAgICAgICA8c3BhbiAqbmdJZj0nc2hvd0FkZEJ1dHRvbic+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PSdhZGRSb3dFbXB0eVRlbXBsYXRlIHx8IGRlZmF1bHRBZGRSb3dFbXB0eVRlbXBsYXRlJz48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEVtcHR5R3JpZD5cbiAgICA8c3BhbiBjbGFzcz1cImlneC1ncmlkX190Ym9keS1tZXNzYWdlXCIgcm9sZT1cImNlbGxcIj5cbiAgICAgICAgPHNwYW4+e3tlbXB0eUdyaWRNZXNzYWdlfX08L3NwYW4+XG4gICAgICAgIDxzcGFuICpuZ0lmPSdzaG93QWRkQnV0dG9uJz5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9J2FkZFJvd0VtcHR5VGVtcGxhdGUgfHwgZGVmYXVsdEFkZFJvd0VtcHR5VGVtcGxhdGUnPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0QWRkUm93RW1wdHlUZW1wbGF0ZT5cbiAgICA8YnV0dG9uIGlneEJ1dHRvbj1cInJhaXNlZFwiIGlneFJpcHBsZSAoY2xpY2spPVwidGhpcy5jcnVkU2VydmljZS5lbnRlckFkZFJvd01vZGUobnVsbCwgZmFsc2UsICRldmVudClcIj5cbiAgICAgICAge3tyZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfYWRkX3Jvd19sYWJlbH19XG4gICAgPC9idXR0b24+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRMb2FkaW5nR3JpZD5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2xvYWRpbmdcIj5cbiAgICAgICAgPGlneC1jaXJjdWxhci1iYXIgW2luZGV0ZXJtaW5hdGVdPVwidHJ1ZVwiPlxuICAgICAgICA8L2lneC1jaXJjdWxhci1iYXI+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRDb2xsYXBzZWRUZW1wbGF0ZT5cbiAgICA8aWd4LWljb24gcm9sZT1cImJ1dHRvblwiPnVuZm9sZF9tb3JlPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEV4cGFuZGVkVGVtcGxhdGU+XG4gICAgPGlneC1pY29uIHJvbGU9XCJidXR0b25cIiBbYWN0aXZlXT0naGFzRXhwYW5kZWRSZWNvcmRzKCkgJiYgaGFzRXhwYW5kYWJsZUNoaWxkcmVuJz51bmZvbGRfbGVzczwvaWd4LWljb24+XG48L25nLXRlbXBsYXRlPlxuXG48ZGl2ICpuZ0lmPVwicm93RWRpdGFibGVcIiBpZ3hUb2dnbGUgI3Jvd0VkaXRpbmdPdmVybGF5PlxuICAgIDxkaXYgW2NsYXNzTmFtZV09XCJiYW5uZXJDbGFzc1wiPlxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInJlc29sdmVSb3dFZGl0Q29udGFpbmVyOyBjb250ZXh0OiB7IHJvd0NoYW5nZXNDb3VudDogcm93Q2hhbmdlc0NvdW50LCBlbmRFZGl0OiB0aGlzLmNydWRTZXJ2aWNlLmVuZEVkaXQuYmluZCh0aGlzKSB9XCI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuPC9kaXY+XG48bmctdGVtcGxhdGUgI2RlZmF1bHRSb3dFZGl0VGV4dD5cbiAgICBZb3UgaGF2ZSB7eyByb3dDaGFuZ2VzQ291bnQgfX0gY2hhbmdlcyBpbiB0aGlzIHJvd1xuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFJvd0VkaXRBY3Rpb25zPlxuICAgIDxidXR0b24gaWd4QnV0dG9uIGlneFJvd0VkaXRUYWJTdG9wIChjbGljayk9XCJ0aGlzLmVuZFJvd0VkaXRUYWJTdG9wKGZhbHNlLCAkZXZlbnQpXCI+e3sgdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfcm93X2VkaXRfYnRuX2NhbmNlbCB9fTwvYnV0dG9uPlxuICAgIDxidXR0b24gaWd4QnV0dG9uIGlneFJvd0VkaXRUYWJTdG9wIChjbGljayk9XCJ0aGlzLmVuZFJvd0VkaXRUYWJTdG9wKHRydWUsICRldmVudClcIj57eyB0aGlzLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9yb3dfZWRpdF9idG5fZG9uZSB9fTwvYnV0dG9uPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFJvd0VkaXRUZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fbWVzc2FnZVwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImlneC1iYW5uZXJfX3RleHRcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInRoaXMuY3J1ZFNlcnZpY2Uucm93Py5nZXRDbGFzc05hbWUoKSA9PT0gJ0lneEFkZFJvdycgPyByb3dBZGRUZXh0IDogcmVzb2x2ZVJvd0VkaXRUZXh0IHx8IGRlZmF1bHRSb3dFZGl0VGV4dDtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7ICRpbXBsaWNpdDogdGhpcy5jcnVkU2VydmljZS5yb3c/LmdldENsYXNzTmFtZSgpICE9PSAnSWd4QWRkUm93JyA/IHJvd0NoYW5nZXNDb3VudCA6IG51bGwgfVwiPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fYWN0aW9uc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fcm93XCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJyZXNvbHZlUm93RWRpdEFjdGlvbnMgfHwgZGVmYXVsdFJvd0VkaXRBY3Rpb25zOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogdGhpcy5lbmRFZGl0LmJpbmQodGhpcykgfVwiPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkcmFnSW5kaWNhdG9ySWNvbkJhc2U+XG4gICAgPGlneC1pY29uPmRyYWdfaW5kaWNhdG9yPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxpZ3gtZ3JpZC1jb2x1bW4tcmVzaXplciAqbmdJZj1cImNvbFJlc2l6aW5nU2VydmljZS5zaG93UmVzaXplclwiPjwvaWd4LWdyaWQtY29sdW1uLXJlc2l6ZXI+XG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2xvYWRpbmctb3V0bGV0XCIgI2lneExvYWRpbmdPdmVybGF5T3V0bGV0IGlneE92ZXJsYXlPdXRsZXQ+PC9kaXY+XG48ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX291dGxldFwiICNpZ3hGaWx0ZXJpbmdPdmVybGF5T3V0bGV0IGlneE92ZXJsYXlPdXRsZXQ+PC9kaXY+XG4iXX0=