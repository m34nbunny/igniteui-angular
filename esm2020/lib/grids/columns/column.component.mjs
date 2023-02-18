import { __decorate } from "tslib";
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Input, Output, EventEmitter, Inject, } from '@angular/core';
import { notifyChanges } from '../watch-changes';
import { WatchColumnChanges } from '../watch-changes';
import { GridColumnDataType } from '../../data-operations/data-util';
import { IgxBooleanFilteringOperand, IgxNumberFilteringOperand, IgxDateFilteringOperand, IgxStringFilteringOperand, IgxDateTimeFilteringOperand, IgxTimeFilteringOperand } from '../../data-operations/filtering-condition';
import { DefaultSortingStrategy } from '../../data-operations/sorting-strategy';
import { DisplayDensity } from '../../core/displayDensity';
import { IgxRowDirective } from '../row.directive';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { IgxSummaryOperand, IgxNumberSummaryOperand, IgxDateSummaryOperand, IgxTimeSummaryOperand } from '../summaries/grid-summary';
import { IgxCellTemplateDirective, IgxCellHeaderTemplateDirective, IgxCellEditorTemplateDirective, IgxCollapsibleIndicatorTemplateDirective, IgxFilterCellTemplateDirective, IgxSummaryTemplateDirective } from './templates.directive';
import { DropPosition } from '../moving/moving.service';
import { isConstructor } from '../../core/utils';
import { IgxGridCell } from '../grid-public-cell';
import * as i0 from "@angular/core";
import * as i1 from "../../core/utils";
const DEFAULT_DATE_FORMAT = 'mediumDate';
const DEFAULT_TIME_FORMAT = 'mediumTime';
const DEFAULT_DATE_TIME_FORMAT = 'medium';
const DEFAULT_DIGITS_INFO = '1.0-3';
/**
 * **Ignite UI for Angular Column** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid/grid#columns-configuration)
 *
 * The Ignite UI Column is used within an `igx-grid` element to define what data the column will show. Features such as sorting,
 * filtering & editing are enabled at the column level.  You can also provide a template containing custom content inside
 * the column using `ng-template` which will be used for all cells within the column.
 */
export class IgxColumnComponent {
    constructor(grid, cdr, platform) {
        this.grid = grid;
        this.cdr = cdr;
        this.platform = platform;
        /**
         * Sets/gets the `header` value.
         * ```typescript
         * let columnHeader = this.column.header;
         * ```
         * ```html
         * <igx-column [header] = "'ID'"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.header = '';
        /**
         * Sets/gets the `title` value.
         * ```typescript
         * let title = this.column.title;
         * ```
         * ```html
         * <igx-column [title] = "'Some column tooltip'"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.title = '';
        /**
         * Sets/gets whether the column is sortable.
         * Default value is `false`.
         * ```typescript
         * let isSortable = this.column.sortable;
         * ```
         * ```html
         * <igx-column [sortable] = "true"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.sortable = false;
        /**
         * Sets/gets whether the column is groupable.
         * Default value is `false`.
         * ```typescript
         * let isGroupable = this.column.groupable;
         * ```
         * ```html
         * <igx-column [groupable] = "true"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.groupable = false;
        /**
         * Sets/gets whether the column is filterable.
         * Default value is `true`.
         * ```typescript
         * let isFilterable = this.column.filterable;
         * ```
         * ```html
         * <igx-column [filterable] = "false"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.filterable = true;
        /**
         * Sets/gets whether the column is resizable.
         * Default value is `false`.
         * ```typescript
         * let isResizable = this.column.resizable;
         * ```
         * ```html
         * <igx-column [resizable] = "true"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.resizable = false;
        /**
         * Sets/gets whether the column header is included in autosize logic.
         * Useful when template for a column header is sized based on parent, for example a default `div`.
         * Default value is `false`.
         * ```typescript
         * let isResizable = this.column.resizable;
         * ```
         * ```html
         * <igx-column [resizable] = "true"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.autosizeHeader = true;
        /**
         * @hidden
         */
        this.hiddenChange = new EventEmitter();
        /** @hidden */
        this.expandedChange = new EventEmitter();
        /** @hidden */
        this.collapsibleChange = new EventEmitter();
        /** @hidden */
        this.visibleWhenCollapsedChange = new EventEmitter();
        /** @hidden */
        this.columnChange = new EventEmitter();
        /**
         * Gets whether the hiding is disabled.
         * ```typescript
         * let isHidingDisabled =  this.column.disableHiding;
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.disableHiding = false;
        /**
         * Gets whether the pinning is disabled.
         * ```typescript
         * let isPinningDisabled =  this.column.disablePinning;
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.disablePinning = false;
        /**
         * @deprecated in version 13.1.0. Use `IgxGridComponent.moving` instead.
         *
         * Sets/gets whether the column is movable.
         * Default value is `false`.
         *
         * ```typescript
         * let isMovable = this.column.movable;
         * ```
         * ```html
         * <igx-column [movable] = "true"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.movable = false;
        /**
         * Sets/gets the class selector of the column header.
         * ```typescript
         * let columnHeaderClass = this.column.headerClasses;
         * ```
         * ```html
         * <igx-column [headerClasses] = "'column-header'"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.headerClasses = '';
        /**
         * Sets conditional style properties on the column header.
         * Similar to `ngStyle` it accepts an object literal where the keys are
         * the style properties and the value is the expression to be evaluated.
         * ```typescript
         * styles = {
         *  background: 'royalblue',
         *  color: (column) => column.pinned ? 'red': 'inherit'
         * }
         * ```
         * ```html
         * <igx-column [headerStyles]="styles"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.headerStyles = null;
        /**
         * Sets/gets the class selector of the column group header.
         * ```typescript
         * let columnHeaderClass = this.column.headerGroupClasses;
         * ```
         * ```html
         * <igx-column [headerGroupClasses] = "'column-group-header'"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.headerGroupClasses = '';
        /**
         * Sets conditional style properties on the column header group wrapper.
         * Similar to `ngStyle` it accepts an object literal where the keys are
         * the style properties and the value is the expression to be evaluated.
         * ```typescript
         * styles = {
         *  background: 'royalblue',
         *  color: (column) => column.pinned ? 'red': 'inherit'
         * }
         * ```
         * ```html
         * <igx-column [headerGroupStyles]="styles"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.headerGroupStyles = null;
        /**
         * Sets conditional style properties on the column cells.
         * Similar to `ngStyle` it accepts an object literal where the keys are
         * the style properties and the value is the expression to be evaluated.
         * As with `cellClasses` it accepts a callback function.
         * ```typescript
         * styles = {
         *  background: 'royalblue',
         *  color: (rowData, columnKey, cellValue, rowIndex) => value.startsWith('Important') ? 'red': 'inherit'
         * }
         * ```
         * ```html
         * <igx-column [cellStyles]="styles"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.cellStyles = null;
        /**
         * Sets/gets whether the column filtering should be case sensitive.
         * Default value is `true`.
         * ```typescript
         * let filteringIgnoreCase = this.column.filteringIgnoreCase;
         * ```
         * ```html
         * <igx-column [filteringIgnoreCase] = "false"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.filteringIgnoreCase = true;
        /**
         * Sets/gets whether the column sorting should be case sensitive.
         * Default value is `true`.
         * ```typescript
         * let sortingIgnoreCase = this.column.sortingIgnoreCase;
         * ```
         * ```html
         * <igx-column [sortingIgnoreCase] = "false"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.sortingIgnoreCase = true;
        /**
         * Sets/gets whether the column is `searchable`.
         * Default value is `true`.
         * ```typescript
         * let isSearchable =  this.column.searchable';
         * ```
         * ```html
         *  <igx-column [searchable] = "false"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.searchable = true;
        /**
         * Sets/gets the data type of the column values.
         * Default value is `string`.
         * ```typescript
         * let columnDataType = this.column.dataType;
         * ```
         * ```html
         * <igx-column [dataType] = "'number'"></igx-column>
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.dataType = GridColumnDataType.String;
        /**
         * @hidden
         */
        this.widthChange = new EventEmitter();
        /**
         * @hidden
         */
        this.pinnedChange = new EventEmitter();
        /**
         * @hidden
         * @internal
         */
        this.defaultTimeFormat = 'hh:mm:ss tt';
        /**
         * @hidden
         * @internal
         */
        this.defaultDateTimeFormat = 'dd/MM/yyyy HH:mm:ss tt';
        /**
         * Sets/gets the parent column.
         * ```typescript
         * let parentColumn = this.column.parent;
         * ```
         * ```typescript
         * this.column.parent = higherLevelColumn;
         * ```
         *
         * @memberof IgxColumnComponent
         */
        this.parent = null;
        /**
         * @hidden
         */
        this.destroy$ = new Subject();
        /**
         * @hidden
         */
        this._applySelectableClass = false;
        this._vIndex = NaN;
        /**
         * @hidden
         */
        this._pinned = false;
        /**
         * @hidden
         */
        this._summaries = null;
        /**
         * @hidden
         */
        this._filters = null;
        /**
         * @hidden
         */
        this._sortStrategy = DefaultSortingStrategy.instance();
        /**
         * @hidden
         */
        this._hidden = false;
        /**
         * @hidden
         */
        this._disablePinning = false;
        /**
         * @hidden
         */
        this._defaultMinWidth = '';
        /**
         * @hidden
         */
        this._hasSummary = false;
        /**
         * @hidden
         */
        this._collapsible = false;
        /**
         * @hidden
         */
        this._expanded = true;
        /**
         * @hidden
         */
        this._selectable = true;
        this._calcWidth = null;
        this._columnPipeArgs = { digitsInfo: DEFAULT_DIGITS_INFO };
    }
    /**
     * Sets/gets the `field` value.
     * ```typescript
     * let columnField = this.column.field;
     * ```
     * ```html
     * <igx-column [field] = "'ID'"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set field(value) {
        this._field = value;
        this.hasNestedPath = value?.includes('.');
    }
    get field() {
        return this._field;
    }
    /**
     * Returns if the column is selectable.
     * ```typescript
     * let columnSelectable = this.column.selectable;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get selectable() {
        return this._selectable;
    }
    /**
     * Sets if the column is selectable.
     * Default value is `true`.
     * ```html
     * <igx-column [selectable] = "false"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set selectable(value) {
        this._selectable = value;
    }
    /**
     * Gets whether the column is editable.
     * Default value is `false`.
     * ```typescript
     * let isEditable = this.column.editable;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get editable() {
        // Updating the primary key when grid has transactions (incl. row edit)
        // should not be allowed, as that can corrupt transaction state.
        const rowEditable = this.grid && this.grid.rowEditable;
        const hasTransactions = this.grid && this.grid.transactions.enabled;
        if (this.isPrimaryColumn && (rowEditable || hasTransactions)) {
            return false;
        }
        if (this._editable !== undefined) {
            return this._editable;
        }
        else {
            return rowEditable;
        }
    }
    /**
     * Sets whether the column is editable.
     * ```typescript
     * this.column.editable = true;
     * ```
     * ```html
     * <igx-column [editable] = "true"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set editable(editable) {
        this._editable = editable;
    }
    /**
     * Gets a value indicating whether the summary for the column is enabled.
     * ```typescript
     * let hasSummary = this.column.hasSummary;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get hasSummary() {
        return this._hasSummary;
    }
    /**
     * Sets a value indicating whether the summary for the column is enabled.
     * Default value is `false`.
     * ```html
     * <igx-column [hasSummary] = "true"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set hasSummary(value) {
        this._hasSummary = value;
        if (this.grid) {
            this.grid.summaryService.resetSummaryHeight();
        }
    }
    /**
     * Gets whether the column is hidden.
     * ```typescript
     * let isHidden = this.column.hidden;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get hidden() {
        return this._hidden;
    }
    /**
     * Sets the column hidden property.
     * Default value is `false`.
     * ```html
     * <igx-column [hidden] = "true"></igx-column>
     * ```
     *
     * Two-way data binding.
     * ```html
     * <igx-column [(hidden)] = "model.isHidden"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set hidden(value) {
        if (this._hidden !== value) {
            this._hidden = value;
            this.hiddenChange.emit(this._hidden);
            if (this.columnLayoutChild && this.parent.hidden !== value) {
                this.parent.hidden = value;
                return;
            }
            if (this.grid) {
                this.grid.crudService.endEdit(false);
                this.grid.summaryService.resetSummaryHeight();
                this.grid.filteringService.refreshExpressions();
                this.grid.filteringService.hideFilteringRowOnColumnVisibilityChange(this);
                this.grid.notifyChanges();
            }
        }
    }
    /**
     * Returns if the column is selected.
     * ```typescript
     * let isSelected = this.column.selected;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get selected() {
        return this.grid.selectionService.isColumnSelected(this.field);
    }
    /**
     * Select/deselect a column.
     * Default value is `false`.
     * ```typescript
     * this.column.selected = true;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set selected(value) {
        if (this.selectable && value !== this.selected) {
            if (value) {
                this.grid.selectionService.selectColumnsWithNoEvent([this.field]);
            }
            else {
                this.grid.selectionService.deselectColumnsWithNoEvent([this.field]);
            }
            this.grid.notifyChanges();
        }
    }
    /**
     * Gets the `width` of the column.
     * ```typescript
     * let columnWidth = this.column.width;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get width() {
        return this.widthSetByUser ? this._width : this.defaultWidth;
    }
    /**
     * Sets the `width` of the column.
     * ```html
     * <igx-column [width] = "'25%'"></igx-column>
     * ```
     *
     * Two-way data binding.
     * ```html
     * <igx-column [(width)]="model.columns[0].width"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set width(value) {
        if (value) {
            this._calcWidth = null;
            this.calcPixelWidth = NaN;
            this.widthSetByUser = true;
            // width could be passed as number from the template
            // host bindings are not px affixed so we need to ensure we affix simple number strings
            if (typeof (value) === 'number' || value.match(/^[0-9]*$/)) {
                value = value + 'px';
            }
            this._width = value;
            if (this.grid) {
                this.cacheCalcWidth();
            }
            this.widthChange.emit(this._width);
        }
    }
    /**
     * @hidden
     */
    get calcWidth() {
        return this.getCalcWidth();
    }
    /**
     * @hidden
     */
    get maxWidthPx() {
        const gridAvailableSize = this.grid.calcWidth;
        const isPercentageWidth = this.maxWidth && typeof this.maxWidth === 'string' && this.maxWidth.indexOf('%') !== -1;
        return isPercentageWidth ? parseFloat(this.maxWidth) / 100 * gridAvailableSize : parseFloat(this.maxWidth);
    }
    /**
     * @hidden
     */
    get maxWidthPercent() {
        const gridAvailableSize = this.grid.calcWidth;
        const isPercentageWidth = this.maxWidth && typeof this.maxWidth === 'string' && this.maxWidth.indexOf('%') !== -1;
        return isPercentageWidth ? parseFloat(this.maxWidth) : parseFloat(this.maxWidth) / gridAvailableSize * 100;
    }
    /**
     * @hidden
     */
    get minWidthPx() {
        const gridAvailableSize = this.grid.calcWidth;
        const isPercentageWidth = this.minWidth && typeof this.minWidth === 'string' && this.minWidth.indexOf('%') !== -1;
        return isPercentageWidth ? parseFloat(this.minWidth) / 100 * gridAvailableSize : parseFloat(this.minWidth);
    }
    /**
     * @hidden
     */
    get minWidthPercent() {
        const gridAvailableSize = this.grid.calcWidth;
        const isPercentageWidth = this.minWidth && typeof this.minWidth === 'string' && this.minWidth.indexOf('%') !== -1;
        return isPercentageWidth ? parseFloat(this.minWidth) : parseFloat(this.minWidth) / gridAvailableSize * 100;
    }
    /**
     * Sets/gets the minimum `width` of the column.
     * Default value is `88`;
     * ```typescript
     * let columnMinWidth = this.column.minWidth;
     * ```
     * ```html
     * <igx-column [minWidth] = "'100px'"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set minWidth(value) {
        const minVal = parseFloat(value);
        if (Number.isNaN(minVal)) {
            return;
        }
        this._defaultMinWidth = value;
    }
    get minWidth() {
        return !this._defaultMinWidth ? this.defaultMinWidth : this._defaultMinWidth;
    }
    /**
     * Gets the column index.
     * ```typescript
     * let columnIndex = this.column.index;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get index() {
        return this.grid._columns.indexOf(this);
    }
    /**
     * Gets whether the column is `pinned`.
     * ```typescript
     * let isPinned = this.column.pinned;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get pinned() {
        return this._pinned;
    }
    /**
     * Sets whether the column is pinned.
     * Default value is `false`.
     * ```html
     * <igx-column [pinned] = "true"></igx-column>
     * ```
     *
     * Two-way data binding.
     * ```html
     * <igx-column [(pinned)] = "model.columns[0].isPinned"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set pinned(value) {
        if (this._pinned !== value) {
            if (this.grid && this.width && !isNaN(parseInt(this.width, 10))) {
                if (value) {
                    this.pin();
                }
                else {
                    this.unpin();
                }
                return;
            }
            /* No grid/width available at initialization. `initPinning` in the grid
               will re-init the group (if present)
            */
            this._pinned = value;
            this.pinnedChange.emit(this._pinned);
        }
    }
    /**
     * Gets the column `summaries`.
     * ```typescript
     * let columnSummaries = this.column.summaries;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get summaries() {
        return this._summaries;
    }
    /**
     * Sets the column `summaries`.
     * ```typescript
     * this.column.summaries = IgxNumberSummaryOperand;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set summaries(classRef) {
        if (isConstructor(classRef)) {
            this._summaries = new classRef();
        }
        if (this.grid) {
            this.grid.summaryService.removeSummariesCachePerColumn(this.field);
            this.grid.summaryPipeTrigger++;
            this.grid.summaryService.resetSummaryHeight();
        }
    }
    /**
     * Gets the column `filters`.
     * ```typescript
     * let columnFilters = this.column.filters'
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filters() {
        return this._filters;
    }
    /**
     * Sets the column `filters`.
     * ```typescript
     * this.column.filters = IgxBooleanFilteringOperand.instance().
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set filters(instance) {
        this._filters = instance;
    }
    /**
     * Gets the column `sortStrategy`.
     * ```typescript
     * let sortStrategy = this.column.sortStrategy
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get sortStrategy() {
        return this._sortStrategy;
    }
    /**
     * Sets the column `sortStrategy`.
     * ```typescript
     * this.column.sortStrategy = new CustomSortingStrategy().
     * class CustomSortingStrategy extends SortingStrategy {...}
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set sortStrategy(classRef) {
        this._sortStrategy = classRef;
    }
    /**
     * Gets the function that compares values for grouping.
     * ```typescript
     * let groupingComparer = this.column.groupingComparer'
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get groupingComparer() {
        return this._groupingComparer;
    }
    /**
     * Sets a custom function to compare values for grouping.
     * Subsequent values in the sorted data that the function returns 0 for are grouped.
     * ```typescript
     * this.column.groupingComparer = (a: any, b: any) => { return a === b ? 0 : -1; }
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set groupingComparer(funcRef) {
        this._groupingComparer = funcRef;
    }
    /**
     * Gets the default minimum `width` of the column.
     * ```typescript
     * let defaultMinWidth =  this.column.defaultMinWidth;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get defaultMinWidth() {
        if (!this.grid) {
            return '80';
        }
        switch (this.grid.displayDensity) {
            case DisplayDensity.cosy:
                return '64';
            case DisplayDensity.compact:
                return '56';
            default:
                return '80';
        }
    }
    /**
     * Returns a reference to the `summaryTemplate`.
     * ```typescript
     * let summaryTemplate = this.column.summaryTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get summaryTemplate() {
        return this._summaryTemplate;
    }
    /**
     * Sets the summary template.
     * ```html
     * <ng-template #summaryTemplate igxSummary let-summaryResults>
     *    <p>{{ summaryResults[0].label }}: {{ summaryResults[0].summaryResult }}</p>
     *    <p>{{ summaryResults[1].label }}: {{ summaryResults[1].summaryResult }}</p>
     * </ng-template>
     * ```
     * ```typescript
     * @ViewChild("'summaryTemplate'", {read: TemplateRef })
     * public summaryTemplate: TemplateRef<any>;
     * this.column.summaryTemplate = this.summaryTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set summaryTemplate(template) {
        this._summaryTemplate = template;
    }
    /**
     * Returns a reference to the `bodyTemplate`.
     * ```typescript
     * let bodyTemplate = this.column.bodyTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get bodyTemplate() {
        return this._bodyTemplate;
    }
    /**
     * Sets the body template.
     * ```html
     * <ng-template #bodyTemplate igxCell let-val>
     *    <div style = "background-color: yellowgreen" (click) = "changeColor(val)">
     *       <span> {{val}} </span>
     *    </div>
     * </ng-template>
     * ```
     * ```typescript
     * @ViewChild("'bodyTemplate'", {read: TemplateRef })
     * public bodyTemplate: TemplateRef<any>;
     * this.column.bodyTemplate = this.bodyTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set bodyTemplate(template) {
        this._bodyTemplate = template;
    }
    /**
     * Returns a reference to the header template.
     * ```typescript
     * let headerTemplate = this.column.headerTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get headerTemplate() {
        return this._headerTemplate;
    }
    /**
     * Sets the header template.
     * Note that the column header height is fixed and any content bigger than it will be cut off.
     * ```html
     * <ng-template #headerTemplate>
     *   <div style = "background-color:black" (click) = "changeColor(val)">
     *       <span style="color:red" >{{column.field}}</span>
     *   </div>
     * </ng-template>
     * ```
     * ```typescript
     * @ViewChild("'headerTemplate'", {read: TemplateRef })
     * public headerTemplate: TemplateRef<any>;
     * this.column.headerTemplate = this.headerTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set headerTemplate(template) {
        this._headerTemplate = template;
    }
    /**
     * Returns a reference to the inline editor template.
     * ```typescript
     * let inlineEditorTemplate = this.column.inlineEditorTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get inlineEditorTemplate() {
        return this._inlineEditorTemplate;
    }
    /**
     * Sets the inline editor template.
     * ```html
     * <ng-template #inlineEditorTemplate igxCellEditor let-cell="cell">
     *     <input type="string" [(ngModel)]="cell.value"/>
     * </ng-template>
     * ```
     * ```typescript
     * @ViewChild("'inlineEditorTemplate'", {read: TemplateRef })
     * public inlineEditorTemplate: TemplateRef<any>;
     * this.column.inlineEditorTemplate = this.inlineEditorTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set inlineEditorTemplate(template) {
        this._inlineEditorTemplate = template;
    }
    /**
     * Returns a reference to the `filterCellTemplate`.
     * ```typescript
     * let filterCellTemplate = this.column.filterCellTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filterCellTemplate() {
        return this._filterCellTemplate;
    }
    /**
     * Sets the quick filter template.
     * ```html
     * <ng-template #filterCellTemplate IgxFilterCellTemplate let-column="column">
     *    <input (input)="onInput()">
     * </ng-template>
     * ```
     * ```typescript
     * @ViewChild("'filterCellTemplate'", {read: TemplateRef })
     * public filterCellTemplate: TemplateRef<any>;
     * this.column.filterCellTemplate = this.filterCellTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set filterCellTemplate(template) {
        this._filterCellTemplate = template;
    }
    /**
     * Gets the cells of the column.
     * ```typescript
     * let columnCells = this.column.cells;
     * ```
     *
     */
    get cells() {
        return this.grid.dataView
            .map((rec, index) => {
            if (!this.grid.isGroupByRecord(rec) && !this.grid.isSummaryRow(rec)) {
                this.grid.pagingMode === 1 && this.grid.paginator.page !== 0 ? index = index + this.grid.paginator.perPage * this.grid.paginator.page : index = this.grid.dataRowList.first.index + index;
                const cell = new IgxGridCell(this.grid, index, this.field);
                return cell;
            }
        }).filter(cell => cell);
    }
    /**
     * @hidden @internal
     */
    get _cells() {
        return this.grid.rowList.filter((row) => row instanceof IgxRowDirective)
            .map((row) => {
            if (row._cells) {
                return row._cells.filter((cell) => cell.columnIndex === this.index);
            }
        }).reduce((a, b) => a.concat(b), []);
    }
    /**
     * Gets the column visible index.
     * If the column is not visible, returns `-1`.
     * ```typescript
     * let visibleColumnIndex =  this.column.visibleIndex;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get visibleIndex() {
        if (!isNaN(this._vIndex)) {
            return this._vIndex;
        }
        const unpinnedColumns = this.grid.unpinnedColumns.filter(c => !c.columnGroup);
        const pinnedColumns = this.grid.pinnedColumns.filter(c => !c.columnGroup);
        let col = this;
        let vIndex = -1;
        if (this.columnGroup) {
            col = this.allChildren.filter(c => !c.columnGroup && !c.hidden)[0];
        }
        if (this.columnLayoutChild) {
            return this.parent.childrenVisibleIndexes.find(x => x.column === this).index;
        }
        if (!this.pinned) {
            const indexInCollection = unpinnedColumns.indexOf(col);
            vIndex = indexInCollection === -1 ?
                -1 :
                (this.grid.isPinningToStart ?
                    pinnedColumns.length + indexInCollection :
                    indexInCollection);
        }
        else {
            const indexInCollection = pinnedColumns.indexOf(col);
            vIndex = this.grid.isPinningToStart ?
                indexInCollection :
                unpinnedColumns.length + indexInCollection;
        }
        this._vIndex = vIndex;
        return vIndex;
    }
    /**
     * Returns a boolean indicating if the column is a `ColumnGroup`.
     * ```typescript
     * let columnGroup =  this.column.columnGroup;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get columnGroup() {
        return false;
    }
    /**
     * Returns a boolean indicating if the column is a `ColumnLayout` for multi-row layout.
     * ```typescript
     * let columnGroup =  this.column.columnGroup;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get columnLayout() {
        return false;
    }
    /**
     * Returns a boolean indicating if the column is a child of a `ColumnLayout` for multi-row layout.
     * ```typescript
     * let columnLayoutChild =  this.column.columnLayoutChild;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get columnLayoutChild() {
        return this.parent && this.parent.columnLayout;
    }
    /**
     * Returns the children columns collection.
     * Returns an empty array if the column does not contain children columns.
     * ```typescript
     * let childrenColumns =  this.column.allChildren;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get allChildren() {
        return [];
    }
    /**
     * Returns the level of the column in a column group.
     * Returns `0` if the column doesn't have a `parent`.
     * ```typescript
     * let columnLevel =  this.column.level;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get level() {
        let ptr = this.parent;
        let lvl = 0;
        while (ptr) {
            lvl++;
            ptr = ptr.parent;
        }
        return lvl;
    }
    get isLastPinned() {
        return this.grid.isPinningToStart &&
            this.grid.pinnedColumns[this.grid.pinnedColumns.length - 1] === this;
    }
    get isFirstPinned() {
        const pinnedCols = this.grid.pinnedColumns.filter(x => !x.columnGroup);
        return !this.grid.isPinningToStart && pinnedCols[0] === this;
    }
    get rightPinnedOffset() {
        return this.pinned && !this.grid.isPinningToStart ?
            -this.grid.pinnedWidth - this.grid.headerFeaturesWidth + 'px' :
            null;
    }
    get gridRowSpan() {
        return this.rowEnd && this.rowStart ? this.rowEnd - this.rowStart : 1;
    }
    get gridColumnSpan() {
        return this.colEnd && this.colStart ? this.colEnd - this.colStart : 1;
    }
    /**
     * Indicates whether the column will be visible when its parent is collapsed.
     * ```html
     * <igx-column-group>
     *   <igx-column [visibleWhenCollapsed]="true"></igx-column>
     * </igx-column-group>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set visibleWhenCollapsed(value) {
        this._visibleWhenCollapsed = value;
        this.visibleWhenCollapsedChange.emit(this._visibleWhenCollapsed);
        if (this.parent) {
            this.parent.setExpandCollapseState();
        }
    }
    get visibleWhenCollapsed() {
        return this._visibleWhenCollapsed;
    }
    /**
     * @remarks
     * Pass optional parameters for DatePipe and/or DecimalPipe to format the display value for date and numeric columns.
     * Accepts an `IColumnPipeArgs` object with any of the `format`, `timezone` and `digitsInfo` properties.
     * For more details see https://angular.io/api/common/DatePipe and https://angular.io/api/common/DecimalPipe
     * @example
     * ```typescript
     * const pipeArgs: IColumnPipeArgs = {
     *      format: 'longDate',
     *      timezone: 'UTC',
     *      digitsInfo: '1.1-2'
     * }
     * ```
     * ```html
     * <igx-column dataType="date" [pipeArgs]="pipeArgs"></igx-column>
     * <igx-column dataType="number" [pipeArgs]="pipeArgs"></igx-column>
     * ```
     * @memberof IgxColumnComponent
     */
    set pipeArgs(value) {
        this._columnPipeArgs = Object.assign(this._columnPipeArgs, value);
        this.grid.summaryService.clearSummaryCache();
        this.grid.pipeTrigger++;
    }
    get pipeArgs() {
        return this._columnPipeArgs;
    }
    /**
     * @hidden
     * @internal
     */
    get collapsible() {
        return false;
    }
    set collapsible(_value) { }
    /**
     * @hidden
     * @internal
     */
    get expanded() {
        return true;
    }
    set expanded(_value) { }
    /**
     * Returns the filteringExpressionsTree of the column.
     * ```typescript
     * let tree =  this.column.filteringExpressionsTree;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filteringExpressionsTree() {
        return this.grid.filteringExpressionsTree.find(this.field);
    }
    /**
     * @hidden
     */
    get isPrimaryColumn() {
        return this.field !== undefined && this.grid !== undefined && this.field === this.grid.primaryKey;
    }
    /**
     * @hidden
     * @internal
     */
    resetCaches() {
        this._vIndex = NaN;
        if (this.grid) {
            this.cacheCalcWidth();
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        if (this.summaryTemplateDirective) {
            this._summaryTemplate = this.summaryTemplateDirective.template;
        }
        if (this.cellTemplate) {
            this._bodyTemplate = this.cellTemplate.template;
        }
        if (this.headTemplate && this.headTemplate.length) {
            this._headerTemplate = this.headTemplate.toArray()[0].template;
        }
        if (this.editorTemplate) {
            this._inlineEditorTemplate = this.editorTemplate.template;
        }
        if (this.filterCellTemplateDirective) {
            this._filterCellTemplate = this.filterCellTemplateDirective.template;
        }
        if (!this._columnPipeArgs.format) {
            this._columnPipeArgs.format = this.dataType === GridColumnDataType.Time ?
                DEFAULT_TIME_FORMAT : this.dataType === GridColumnDataType.DateTime ?
                DEFAULT_DATE_TIME_FORMAT : DEFAULT_DATE_FORMAT;
        }
        if (!this.summaries) {
            switch (this.dataType) {
                case GridColumnDataType.String:
                case GridColumnDataType.Boolean:
                    this.summaries = IgxSummaryOperand;
                    break;
                case GridColumnDataType.Number:
                case GridColumnDataType.Currency:
                case GridColumnDataType.Percent:
                    this.summaries = IgxNumberSummaryOperand;
                    break;
                case GridColumnDataType.Date:
                case GridColumnDataType.DateTime:
                    this.summaries = IgxDateSummaryOperand;
                    break;
                case GridColumnDataType.Time:
                    this.summaries = IgxTimeSummaryOperand;
                    break;
                default:
                    this.summaries = IgxSummaryOperand;
                    break;
            }
        }
        if (!this.filters) {
            switch (this.dataType) {
                case GridColumnDataType.Boolean:
                    this.filters = IgxBooleanFilteringOperand.instance();
                    break;
                case GridColumnDataType.Number:
                case GridColumnDataType.Currency:
                case GridColumnDataType.Percent:
                    this.filters = IgxNumberFilteringOperand.instance();
                    break;
                case GridColumnDataType.Date:
                    this.filters = IgxDateFilteringOperand.instance();
                    break;
                case GridColumnDataType.Time:
                    this.filters = IgxTimeFilteringOperand.instance();
                    break;
                case GridColumnDataType.DateTime:
                    this.filters = IgxDateTimeFilteringOperand.instance();
                    break;
                case GridColumnDataType.String:
                default:
                    this.filters = IgxStringFilteringOperand.instance();
                    break;
            }
        }
    }
    /**
     * @hidden
     */
    getGridTemplate(isRow) {
        if (isRow) {
            const rowsCount = !this.grid.isPivot ? this.grid.multiRowLayoutRowSize : this.children.length - 1;
            return `repeat(${rowsCount},1fr)`;
        }
        else {
            return this.getColumnSizesString(this.children);
        }
    }
    getInitialChildColumnSizes(children) {
        const columnSizes = [];
        // find the smallest col spans
        children.forEach(col => {
            if (!col.colStart) {
                return;
            }
            const newWidthSet = col.widthSetByUser && columnSizes[col.colStart - 1] && !columnSizes[col.colStart - 1].widthSetByUser;
            const newSpanSmaller = columnSizes[col.colStart - 1] && columnSizes[col.colStart - 1].colSpan > col.gridColumnSpan;
            const bothWidthsSet = col.widthSetByUser && columnSizes[col.colStart - 1] && columnSizes[col.colStart - 1].widthSetByUser;
            const bothWidthsNotSet = !col.widthSetByUser && columnSizes[col.colStart - 1] && !columnSizes[col.colStart - 1].widthSetByUser;
            if (columnSizes[col.colStart - 1] === undefined) {
                // If nothing is defined yet take any column at first
                // We use colEnd to know where the column actually ends, because not always it starts where we have it set in columnSizes.
                columnSizes[col.colStart - 1] = {
                    ref: col,
                    width: col.widthSetByUser || this.grid.columnWidthSetByUser ? parseInt(col.calcWidth, 10) : null,
                    colSpan: col.gridColumnSpan,
                    colEnd: col.colStart + col.gridColumnSpan,
                    widthSetByUser: col.widthSetByUser
                };
            }
            else if (newWidthSet || (newSpanSmaller && ((bothWidthsSet) || (bothWidthsNotSet)))) {
                // If a column is set already it should either not have width defined or have width with bigger span than the new one.
                /**
                 *  If replaced column has bigger span, we want to fill the remaining columns
                 *  that the replacing column does not fill with the old one.
                 */
                if (bothWidthsSet && newSpanSmaller) {
                    // Start from where the new column set would end and apply the old column to the rest depending on how much it spans.
                    // We have not yet replaced it so we can use it directly from the columnSizes collection.
                    // This is where colEnd is used because the colStart of the old column is not actually i + 1.
                    for (let i = col.colStart - 1 + col.gridColumnSpan; i < columnSizes[col.colStart - 1].colEnd - 1; i++) {
                        if (!columnSizes[i] || !columnSizes[i].widthSetByUser) {
                            columnSizes[i] = columnSizes[col.colStart - 1];
                        }
                        else {
                            break;
                        }
                    }
                }
                // Replace the old column with the new one.
                columnSizes[col.colStart - 1] = {
                    ref: col,
                    width: col.widthSetByUser || this.grid.columnWidthSetByUser ? parseInt(col.calcWidth, 10) : null,
                    colSpan: col.gridColumnSpan,
                    colEnd: col.colStart + col.gridColumnSpan,
                    widthSetByUser: col.widthSetByUser
                };
            }
            else if (bothWidthsSet && columnSizes[col.colStart - 1].colSpan < col.gridColumnSpan) {
                // If the column already in the columnSizes has smaller span, we still need to fill any empty places with the current col.
                // Start from where the smaller column set would end and apply the bigger column to the rest depending on how much it spans.
                // Since here we do not have it in columnSizes we set it as a new column keeping the same colSpan.
                for (let i = col.colStart - 1 + columnSizes[col.colStart - 1].colSpan; i < col.colStart - 1 + col.gridColumnSpan; i++) {
                    if (!columnSizes[i] || !columnSizes[i].widthSetByUser) {
                        columnSizes[i] = {
                            ref: col,
                            width: col.widthSetByUser || this.grid.columnWidthSetByUser ? parseInt(col.calcWidth, 10) : null,
                            colSpan: col.gridColumnSpan,
                            colEnd: col.colStart + col.gridColumnSpan,
                            widthSetByUser: col.widthSetByUser
                        };
                    }
                    else {
                        break;
                    }
                }
            }
        });
        // Flatten columnSizes so there are not columns with colSpan > 1
        for (let i = 0; i < columnSizes.length; i++) {
            if (columnSizes[i] && columnSizes[i].colSpan > 1) {
                let j = 1;
                // Replace all empty places depending on how much the current column spans starting from next col.
                for (; j < columnSizes[i].colSpan && i + j + 1 < columnSizes[i].colEnd; j++) {
                    if (columnSizes[i + j] &&
                        ((!columnSizes[i].width && columnSizes[i + j].width) ||
                            (!columnSizes[i].width && !columnSizes[i + j].width && columnSizes[i + j].colSpan <= columnSizes[i].colSpan) ||
                            (!!columnSizes[i + j].width && columnSizes[i + j].colSpan <= columnSizes[i].colSpan))) {
                        // If we reach an already defined column that has width and the current doesn't have or
                        // if the reached column has bigger colSpan we stop.
                        break;
                    }
                    else {
                        const width = columnSizes[i].widthSetByUser ?
                            columnSizes[i].width / columnSizes[i].colSpan :
                            columnSizes[i].width;
                        columnSizes[i + j] = {
                            ref: columnSizes[i].ref,
                            width,
                            colSpan: 1,
                            colEnd: columnSizes[i].colEnd,
                            widthSetByUser: columnSizes[i].widthSetByUser
                        };
                    }
                }
                // Update the current column width so it is divided between all columns it spans and set it to 1.
                columnSizes[i].width = columnSizes[i].widthSetByUser ?
                    columnSizes[i].width / columnSizes[i].colSpan :
                    columnSizes[i].width;
                columnSizes[i].colSpan = 1;
                // Update the index based on how much we have replaced. Subtract 1 because we started from 1.
                i += j - 1;
            }
        }
        return columnSizes;
    }
    getFilledChildColumnSizes(children) {
        const columnSizes = this.getInitialChildColumnSizes(children);
        // fill the gaps if there are any
        const result = [];
        for (const size of columnSizes) {
            if (size && !!size.width) {
                result.push(size.width + 'px');
            }
            else {
                result.push(parseInt(this.grid.getPossibleColumnWidth(), 10) + 'px');
            }
        }
        return result;
    }
    getResizableColUnderEnd() {
        if (this.columnLayout || !this.columnLayoutChild || this.columnGroup) {
            return [{ target: this, spanUsed: 1 }];
        }
        const columnSized = this.getInitialChildColumnSizes(this.parent.children);
        const targets = [];
        const colEnd = this.colEnd ? this.colEnd : this.colStart + 1;
        for (let i = 0; i < columnSized.length; i++) {
            if (this.colStart <= i + 1 && i + 1 < colEnd) {
                targets.push({ target: columnSized[i].ref, spanUsed: 1 });
            }
        }
        const targetsSquashed = [];
        for (const target of targets) {
            if (targetsSquashed.length && targetsSquashed[targetsSquashed.length - 1].target.field === target.target.field) {
                targetsSquashed[targetsSquashed.length - 1].spanUsed++;
            }
            else {
                targetsSquashed.push(target);
            }
        }
        return targetsSquashed;
    }
    /**
     * Pins the column at the provided index in the pinned area.
     * Defaults to index `0` if not provided, or to the initial index in the pinned area.
     * Returns `true` if the column is successfully pinned. Returns `false` if the column cannot be pinned.
     * Column cannot be pinned if:
     * - Is already pinned
     * - index argument is out of range
     * - The pinned area exceeds 80% of the grid width
     * ```typescript
     * let success = this.column.pin();
     * ```
     *
     * @memberof IgxColumnComponent
     */
    pin(index) {
        // TODO: Probably should the return type of the old functions
        // should be moved as a event parameter.
        const grid = this.grid;
        if (this._pinned) {
            return false;
        }
        if (this.parent && !this.parent.pinned) {
            return this.topLevelParent.pin(index);
        }
        const hasIndex = index !== undefined;
        if (hasIndex && (index < 0 || index > grid.pinnedColumns.length)) {
            return false;
        }
        if (!this.parent && !this.pinnable) {
            return false;
        }
        const rootPinnedCols = grid._pinnedColumns.filter((c) => c.level === 0);
        index = hasIndex ? index : rootPinnedCols.length;
        const args = { column: this, insertAtIndex: index, isPinned: false, cancel: false };
        this.grid.columnPin.emit(args);
        if (args.cancel) {
            return;
        }
        this.grid.crudService.endEdit(false);
        this._pinned = true;
        this.pinnedChange.emit(this._pinned);
        // it is possible that index is the last position, so will need to find target column by [index-1]
        const targetColumn = args.insertAtIndex === grid._pinnedColumns.length ?
            grid._pinnedColumns[args.insertAtIndex - 1] : grid._pinnedColumns[args.insertAtIndex];
        if (grid._pinnedColumns.indexOf(this) === -1) {
            if (!grid.hasColumnGroups) {
                grid._pinnedColumns.splice(args.insertAtIndex, 0, this);
            }
            else {
                // insert based only on root collection
                rootPinnedCols.splice(args.insertAtIndex, 0, this);
                let allPinned = [];
                // re-create hierarchy
                rootPinnedCols.forEach(group => {
                    allPinned.push(group);
                    allPinned = allPinned.concat(group.allChildren);
                });
                grid._pinnedColumns = allPinned;
            }
            if (grid._unpinnedColumns.indexOf(this) !== -1) {
                const childrenCount = this.allChildren.length;
                grid._unpinnedColumns.splice(grid._unpinnedColumns.indexOf(this), 1 + childrenCount);
            }
        }
        if (hasIndex) {
            grid._moveColumns(this, targetColumn);
        }
        if (this.columnGroup) {
            this.allChildren.forEach(child => child.pin());
            grid.reinitPinStates();
        }
        grid.resetCaches();
        grid.notifyChanges();
        if (this.columnLayoutChild) {
            this.grid.columnList.filter(x => x.columnLayout).forEach(x => x.populateVisibleIndexes());
        }
        this.grid.filteringService.refreshExpressions();
        const eventArgs = { column: this, insertAtIndex: index, isPinned: true };
        this.grid.columnPinned.emit(eventArgs);
        return true;
    }
    /**
     * Unpins the column and place it at the provided index in the unpinned area.
     * Defaults to index `0` if not provided, or to the initial index in the unpinned area.
     * Returns `true` if the column is successfully unpinned. Returns `false` if the column cannot be unpinned.
     * Column cannot be unpinned if:
     * - Is already unpinned
     * - index argument is out of range
     * ```typescript
     * let success = this.column.unpin();
     * ```
     *
     * @memberof IgxColumnComponent
     */
    unpin(index) {
        const grid = this.grid;
        if (!this._pinned) {
            return false;
        }
        if (this.parent && this.parent.pinned) {
            return this.topLevelParent.unpin(index);
        }
        const hasIndex = index !== undefined;
        if (hasIndex && (index < 0 || index > grid._unpinnedColumns.length)) {
            return false;
        }
        // estimate the exact index at which column will be inserted
        // takes into account initial unpinned index of the column
        if (!hasIndex) {
            const indices = grid.unpinnedColumns.map(col => col.index);
            indices.push(this.index);
            indices.sort((a, b) => a - b);
            index = indices.indexOf(this.index);
        }
        const args = { column: this, insertAtIndex: index, isPinned: true, cancel: false };
        this.grid.columnPin.emit(args);
        if (args.cancel) {
            return;
        }
        this.grid.crudService.endEdit(false);
        this._pinned = false;
        this.pinnedChange.emit(this._pinned);
        // it is possible that index is the last position, so will need to find target column by [index-1]
        const targetColumn = args.insertAtIndex === grid._unpinnedColumns.length ?
            grid._unpinnedColumns[args.insertAtIndex - 1] : grid._unpinnedColumns[args.insertAtIndex];
        if (!hasIndex) {
            grid._unpinnedColumns.splice(index, 0, this);
            if (grid._pinnedColumns.indexOf(this) !== -1) {
                grid._pinnedColumns.splice(grid._pinnedColumns.indexOf(this), 1);
            }
        }
        if (hasIndex) {
            grid.moveColumn(this, targetColumn);
        }
        if (this.columnGroup) {
            this.allChildren.forEach(child => child.unpin());
        }
        grid.reinitPinStates();
        grid.resetCaches();
        grid.notifyChanges();
        if (this.columnLayoutChild) {
            this.grid.columnList.filter(x => x.columnLayout).forEach(x => x.populateVisibleIndexes());
        }
        this.grid.filteringService.refreshExpressions();
        this.grid.columnPinned.emit({ column: this, insertAtIndex: index, isPinned: false });
        return true;
    }
    /**
     * Moves a column to the specified visible index.
     * If passed index is invalid, or if column would receive a different visible index after moving, moving is not performed.
     * If passed index would move the column to a different column group. moving is not performed.
     *
     * @example
     * ```typescript
     * column.move(index);
     * ```
     * @memberof IgxColumnComponent
     */
    move(index) {
        let target;
        let columns = this.grid.columnList.filter(c => c.visibleIndex > -1);
        // grid last visible index
        const li = columns.map(c => c.visibleIndex).reduce((a, b) => Math.max(a, b));
        const parent = this.parent;
        const isPreceding = this.visibleIndex < index;
        if (index === this.visibleIndex || index < 0 || index > li) {
            return;
        }
        if (parent) {
            columns = columns.filter(c => c.level >= this.level && c !== this && c.parent !== this &&
                c.topLevelParent === this.topLevelParent);
        }
        /* eslint-disable max-len */
        // If isPreceding, find a target such that when the current column is placed after it, current colummn will receive a visibleIndex === index. This takes into account visible children of the columns.
        // If !isPreceding, finds a column of the same level and visible index that equals the passed index agument (c.visibleIndex === index). No need to consider the children here.
        /* eslint-enable max-len */
        if (isPreceding) {
            columns = columns.filter(c => c.visibleIndex > this.visibleIndex);
            target = columns.find(c => c.level === this.level && c.visibleIndex + c.calcChildren() - this.calcChildren() === index);
        }
        else {
            columns = columns.filter(c => c.visibleIndex < this.visibleIndex);
            target = columns.find(c => c.level === this.level && c.visibleIndex === index);
        }
        if (!target || (target.pinned && this.disablePinning)) {
            return;
        }
        const pos = isPreceding ? DropPosition.AfterDropTarget : DropPosition.BeforeDropTarget;
        this.grid.moveColumn(this, target, pos);
    }
    /**
     * No children for the column, so will returns 1 or 0, if the column is hidden.
     *
     * @hidden
     */
    calcChildren() {
        const children = this.hidden ? 0 : 1;
        return children;
    }
    /**
     * Toggles column vibisility and emits the respective event.
     *
     * @hidden
     */
    toggleVisibility(value) {
        const newValue = value ?? !this.hidden;
        const eventArgs = { column: this, newValue, cancel: false };
        this.grid.columnVisibilityChanging.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.hidden = newValue;
        this.grid.columnVisibilityChanged.emit({ column: this, newValue });
    }
    /**
     * Returns a reference to the top level parent column.
     * ```typescript
     * let topLevelParent =  this.column.topLevelParent;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get topLevelParent() {
        let parent = this.parent;
        while (parent && parent.parent) {
            parent = parent.parent;
        }
        return parent;
    }
    /**
     * Returns a reference to the header of the column.
     * ```typescript
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     * let headerCell = column.headerCell;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get headerCell() {
        return this.grid.headerCellList.find((header) => header.column === this);
    }
    /**
     * Returns a reference to the filter cell of the column.
     * ```typescript
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     * let filterell = column.filterell;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filterCell() {
        return this.grid.filterCellList.find((filterCell) => filterCell.column === this);
    }
    /**
     * Returns a reference to the header group of the column.
     *
     * @memberof IgxColumnComponent
     */
    get headerGroup() {
        return this.grid.headerGroupsList.find(group => group.column === this);
    }
    /**
     * Autosize the column to the longest currently visible cell value, including the header cell.
     * ```typescript
     * @ViewChild('grid') grid: IgxGridComponent;
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     * column.autosize();
     * ```
     *
     * @memberof IgxColumnComponent
     * @param byHeaderOnly Set if column should be autosized based only on the header content.
     */
    autosize(byHeaderOnly = false) {
        if (!this.columnGroup) {
            this.width = this.getAutoSize(byHeaderOnly);
            this.grid.reflow();
        }
    }
    /**
     * @hidden
     */
    getAutoSize(byHeader = false) {
        const size = !byHeader ? this.getLargestCellWidth() :
            (Object.values(this.getHeaderCellWidths()).reduce((a, b) => a + b) + 'px');
        const isPercentageWidth = this.width && typeof this.width === 'string' && this.width.indexOf('%') !== -1;
        let newWidth;
        if (isPercentageWidth) {
            const gridAvailableSize = this.grid.calcWidth;
            const percentageSize = parseFloat(size) / gridAvailableSize * 100;
            newWidth = percentageSize + '%';
        }
        else {
            newWidth = size;
        }
        const maxWidth = isPercentageWidth ? this.maxWidthPercent : this.maxWidthPx;
        const minWidth = isPercentageWidth ? this.minWidthPercent : this.minWidthPx;
        if (this.maxWidth && (parseFloat(newWidth) > maxWidth)) {
            newWidth = isPercentageWidth ? maxWidth + '%' : maxWidth + 'px';
        }
        else if (parseFloat(newWidth) < minWidth) {
            newWidth = isPercentageWidth ? minWidth + '%' : minWidth + 'px';
        }
        return newWidth;
    }
    /**
     * @hidden
     */
    getCalcWidth() {
        if (this._calcWidth && !isNaN(this.calcPixelWidth)) {
            return this._calcWidth;
        }
        this.cacheCalcWidth();
        return this._calcWidth;
    }
    /**
     * @hidden
     * Returns the width and padding of a header cell.
     */
    getHeaderCellWidths() {
        return this.grid.getHeaderCellWidth(this.headerCell.nativeElement);
    }
    /**
     * @hidden
     * Returns the size (in pixels) of the longest currently visible cell, including the header cell.
     * ```typescript
     * @ViewChild('grid') grid: IgxGridComponent;
     *
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     * let size = column.getLargestCellWidth();
     * ```
     * @memberof IgxColumnComponent
     */
    getLargestCellWidth() {
        const range = this.grid.document.createRange();
        const largest = new Map();
        if (this._cells.length > 0) {
            const cellsContentWidths = [];
            this._cells.forEach((cell) => cellsContentWidths.push(cell.calculateSizeToFit(range)));
            const index = cellsContentWidths.indexOf(Math.max(...cellsContentWidths));
            const cellStyle = this.grid.document.defaultView.getComputedStyle(this._cells[index].nativeElement);
            const cellPadding = parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight) +
                parseFloat(cellStyle.borderLeftWidth) + parseFloat(cellStyle.borderRightWidth);
            largest.set(Math.max(...cellsContentWidths), cellPadding);
        }
        if (this.headerCell && this.autosizeHeader) {
            const headerCellWidths = this.getHeaderCellWidths();
            largest.set(headerCellWidths.width, headerCellWidths.padding);
        }
        const largestCell = Math.max(...Array.from(largest.keys()));
        const width = Math.ceil(largestCell + largest.get(largestCell));
        if (Number.isNaN(width)) {
            return this.width;
        }
        else {
            return width + 'px';
        }
    }
    /**
     * @hidden
     */
    getCellWidth() {
        const colWidth = this.width;
        const isPercentageWidth = colWidth && typeof colWidth === 'string' && colWidth.indexOf('%') !== -1;
        if (this.columnLayoutChild) {
            return '';
        }
        if (colWidth && !isPercentageWidth) {
            let cellWidth = colWidth;
            if (typeof cellWidth !== 'string' || cellWidth.endsWith('px') === false) {
                cellWidth += 'px';
            }
            return cellWidth;
        }
        else {
            return colWidth;
        }
    }
    /**
     * @hidden
     */
    populateVisibleIndexes() { }
    getColumnSizesString(children) {
        const res = this.getFilledChildColumnSizes(children);
        return res.join(' ');
    }
    /**
     * @hidden
     * @internal
     */
    cacheCalcWidth() {
        const colWidth = this.width;
        const isPercentageWidth = colWidth && typeof colWidth === 'string' && colWidth.indexOf('%') !== -1;
        if (isPercentageWidth) {
            this._calcWidth = parseFloat(colWidth) / 100 * this.grid.calcWidth;
        }
        else if (!colWidth) {
            // no width
            this._calcWidth = this.defaultWidth || this.grid.getPossibleColumnWidth();
        }
        else {
            this._calcWidth = this.width;
        }
        this.calcPixelWidth = parseFloat(this._calcWidth);
    }
    /**
     * @hidden
     * @internal
     */
    setExpandCollapseState() {
        this.children.filter(col => (col.visibleWhenCollapsed !== undefined)).forEach(c => {
            if (!this.collapsible) {
                c.hidden = this.hidden;
                return;
            }
            c.hidden = this._expanded ? c.visibleWhenCollapsed : !c.visibleWhenCollapsed;
        });
    }
    /**
     * @hidden
     * @internal
     */
    checkCollapsibleState() {
        if (!this.children) {
            return false;
        }
        const cols = this.children.map(child => child.visibleWhenCollapsed);
        return (cols.some(c => c === true) && cols.some(c => c === false));
    }
    /**
     * @hidden
     */
    get pinnable() {
        return this.grid._init || !this.pinned;
    }
    /**
     * @hidden
     */
    get applySelectableClass() {
        return this._applySelectableClass;
    }
    /**
     * @hidden
     */
    set applySelectableClass(value) {
        if (this.selectable) {
            this._applySelectableClass = value;
        }
    }
}
IgxColumnComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnComponent, deps: [{ token: IGX_GRID_BASE }, { token: i0.ChangeDetectorRef }, { token: i1.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxColumnComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxColumnComponent, selector: "igx-column", inputs: { field: "field", header: "header", title: "title", sortable: "sortable", selectable: "selectable", groupable: "groupable", editable: "editable", filterable: "filterable", resizable: "resizable", autosizeHeader: "autosizeHeader", hasSummary: "hasSummary", hidden: "hidden", disableHiding: "disableHiding", disablePinning: "disablePinning", movable: "movable", width: "width", maxWidth: "maxWidth", headerClasses: "headerClasses", headerStyles: "headerStyles", headerGroupClasses: "headerGroupClasses", headerGroupStyles: "headerGroupStyles", cellClasses: "cellClasses", cellStyles: "cellStyles", formatter: "formatter", summaryFormatter: "summaryFormatter", filteringIgnoreCase: "filteringIgnoreCase", sortingIgnoreCase: "sortingIgnoreCase", searchable: "searchable", dataType: "dataType", collapsibleIndicatorTemplate: "collapsibleIndicatorTemplate", rowEnd: "rowEnd", colEnd: "colEnd", rowStart: "rowStart", colStart: "colStart", additionalTemplateContext: "additionalTemplateContext", minWidth: "minWidth", pinned: "pinned", summaries: "summaries", filters: "filters", sortStrategy: "sortStrategy", groupingComparer: "groupingComparer", summaryTemplate: "summaryTemplate", bodyTemplate: ["cellTemplate", "bodyTemplate"], headerTemplate: "headerTemplate", inlineEditorTemplate: ["cellEditorTemplate", "inlineEditorTemplate"], filterCellTemplate: "filterCellTemplate", visibleWhenCollapsed: "visibleWhenCollapsed", pipeArgs: "pipeArgs" }, outputs: { hiddenChange: "hiddenChange", expandedChange: "expandedChange", collapsibleChange: "collapsibleChange", visibleWhenCollapsedChange: "visibleWhenCollapsedChange", columnChange: "columnChange", widthChange: "widthChange", pinnedChange: "pinnedChange" }, queries: [{ propertyName: "filterCellTemplateDirective", first: true, predicate: IgxFilterCellTemplateDirective, descendants: true, read: IgxFilterCellTemplateDirective }, { propertyName: "summaryTemplateDirective", first: true, predicate: IgxSummaryTemplateDirective, descendants: true, read: IgxSummaryTemplateDirective }, { propertyName: "cellTemplate", first: true, predicate: IgxCellTemplateDirective, descendants: true, read: IgxCellTemplateDirective }, { propertyName: "editorTemplate", first: true, predicate: IgxCellEditorTemplateDirective, descendants: true, read: IgxCellEditorTemplateDirective }, { propertyName: "collapseIndicatorTemplate", first: true, predicate: IgxCollapsibleIndicatorTemplateDirective, descendants: true, read: IgxCollapsibleIndicatorTemplateDirective }, { propertyName: "headTemplate", predicate: IgxCellHeaderTemplateDirective, read: IgxCellHeaderTemplateDirective }], ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "header", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "title", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "sortable", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "selectable", null);
__decorate([
    notifyChanges(true),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "groupable", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "editable", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "filterable", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "resizable", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "autosizeHeader", void 0);
__decorate([
    notifyChanges(true),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "hasSummary", null);
__decorate([
    notifyChanges(true),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "hidden", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "disableHiding", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "disablePinning", void 0);
__decorate([
    notifyChanges(true),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "width", null);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "maxWidth", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "headerClasses", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "headerStyles", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "headerGroupClasses", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "headerGroupStyles", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "cellClasses", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "cellStyles", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "formatter", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "summaryFormatter", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "filteringIgnoreCase", void 0);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "sortingIgnoreCase", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "searchable", void 0);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "minWidth", null);
__decorate([
    WatchColumnChanges()
], IgxColumnComponent.prototype, "pinned", null);
__decorate([
    notifyChanges(true),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "summaries", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "summaryTemplate", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "bodyTemplate", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "headerTemplate", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "inlineEditorTemplate", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "filterCellTemplate", null);
__decorate([
    notifyChanges(true)
], IgxColumnComponent.prototype, "visibleWhenCollapsed", null);
__decorate([
    notifyChanges(),
    WatchColumnChanges()
], IgxColumnComponent.prototype, "pipeArgs", null);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnComponent, decorators: [{
            type: Component,
            args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    selector: 'igx-column',
                    template: ``
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i0.ChangeDetectorRef }, { type: i1.PlatformUtil }]; }, propDecorators: { field: [{
                type: Input
            }], header: [{
                type: Input
            }], title: [{
                type: Input
            }], sortable: [{
                type: Input
            }], selectable: [{
                type: Input
            }], groupable: [{
                type: Input
            }], editable: [{
                type: Input
            }], filterable: [{
                type: Input
            }], resizable: [{
                type: Input
            }], autosizeHeader: [{
                type: Input
            }], hasSummary: [{
                type: Input
            }], hidden: [{
                type: Input
            }], hiddenChange: [{
                type: Output
            }], expandedChange: [{
                type: Output
            }], collapsibleChange: [{
                type: Output
            }], visibleWhenCollapsedChange: [{
                type: Output
            }], columnChange: [{
                type: Output
            }], disableHiding: [{
                type: Input
            }], disablePinning: [{
                type: Input
            }], movable: [{
                type: Input
            }], width: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], headerClasses: [{
                type: Input
            }], headerStyles: [{
                type: Input
            }], headerGroupClasses: [{
                type: Input
            }], headerGroupStyles: [{
                type: Input
            }], cellClasses: [{
                type: Input
            }], cellStyles: [{
                type: Input
            }], formatter: [{
                type: Input
            }], summaryFormatter: [{
                type: Input
            }], filteringIgnoreCase: [{
                type: Input
            }], sortingIgnoreCase: [{
                type: Input
            }], searchable: [{
                type: Input
            }], dataType: [{
                type: Input
            }], collapsibleIndicatorTemplate: [{
                type: Input
            }], rowEnd: [{
                type: Input
            }], colEnd: [{
                type: Input
            }], rowStart: [{
                type: Input
            }], colStart: [{
                type: Input
            }], additionalTemplateContext: [{
                type: Input
            }], widthChange: [{
                type: Output
            }], pinnedChange: [{
                type: Output
            }], filterCellTemplateDirective: [{
                type: ContentChild,
                args: [IgxFilterCellTemplateDirective, { read: IgxFilterCellTemplateDirective }]
            }], summaryTemplateDirective: [{
                type: ContentChild,
                args: [IgxSummaryTemplateDirective, { read: IgxSummaryTemplateDirective }]
            }], cellTemplate: [{
                type: ContentChild,
                args: [IgxCellTemplateDirective, { read: IgxCellTemplateDirective }]
            }], headTemplate: [{
                type: ContentChildren,
                args: [IgxCellHeaderTemplateDirective, { read: IgxCellHeaderTemplateDirective, descendants: false }]
            }], editorTemplate: [{
                type: ContentChild,
                args: [IgxCellEditorTemplateDirective, { read: IgxCellEditorTemplateDirective }]
            }], collapseIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxCollapsibleIndicatorTemplateDirective, { read: IgxCollapsibleIndicatorTemplateDirective, static: false }]
            }], minWidth: [{
                type: Input
            }], pinned: [{
                type: Input
            }], summaries: [{
                type: Input
            }], filters: [{
                type: Input
            }], sortStrategy: [{
                type: Input
            }], groupingComparer: [{
                type: Input
            }], summaryTemplate: [{
                type: Input
            }], bodyTemplate: [{
                type: Input,
                args: ['cellTemplate']
            }], headerTemplate: [{
                type: Input
            }], inlineEditorTemplate: [{
                type: Input,
                args: ['cellEditorTemplate']
            }], filterCellTemplate: [{
                type: Input,
                args: ['filterCellTemplate']
            }], visibleWhenCollapsed: [{
                type: Input
            }], pipeArgs: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9jb2x1bW5zL2NvbHVtbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUdILHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixLQUFLLEVBR0wsTUFBTSxFQUNOLFlBQVksRUFFWixNQUFNLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3JFLE9BQU8sRUFFSCwwQkFBMEIsRUFDMUIseUJBQXlCLEVBQ3pCLHVCQUF1QixFQUN2Qix5QkFBeUIsRUFDekIsMkJBQTJCLEVBQzNCLHVCQUF1QixFQUMxQixNQUFNLDJDQUEyQyxDQUFDO0FBQ25ELE9BQU8sRUFBb0Isc0JBQXNCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNsRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRW5ELE9BQU8sRUFBa0MsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekYsT0FBTyxFQUNILGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLHFCQUFxQixFQUMvQyxxQkFBcUIsRUFDMUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQ0gsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5Qiw4QkFBOEIsRUFDOUIsd0NBQXdD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UTtzQkFEbEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBJbnB1dCxcbiAgICBRdWVyeUxpc3QsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBPbkRlc3Ryb3ksXG4gICAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG5vdGlmeUNoYW5nZXMgfSBmcm9tICcuLi93YXRjaC1jaGFuZ2VzJztcbmltcG9ydCB7IFdhdGNoQ29sdW1uQ2hhbmdlcyB9IGZyb20gJy4uL3dhdGNoLWNoYW5nZXMnO1xuaW1wb3J0IHsgR3JpZENvbHVtbkRhdGFUeXBlIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2RhdGEtdXRpbCc7XG5pbXBvcnQge1xuICAgIElneEZpbHRlcmluZ09wZXJhbmQsXG4gICAgSWd4Qm9vbGVhbkZpbHRlcmluZ09wZXJhbmQsXG4gICAgSWd4TnVtYmVyRmlsdGVyaW5nT3BlcmFuZCxcbiAgICBJZ3hEYXRlRmlsdGVyaW5nT3BlcmFuZCxcbiAgICBJZ3hTdHJpbmdGaWx0ZXJpbmdPcGVyYW5kLFxuICAgIElneERhdGVUaW1lRmlsdGVyaW5nT3BlcmFuZCxcbiAgICBJZ3hUaW1lRmlsdGVyaW5nT3BlcmFuZFxufSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBJU29ydGluZ1N0cmF0ZWd5LCBEZWZhdWx0U29ydGluZ1N0cmF0ZWd5IH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHkgfSBmcm9tICcuLi8uLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IElneFJvd0RpcmVjdGl2ZSB9IGZyb20gJy4uL3Jvdy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1leHByZXNzaW9ucy10cmVlJztcbmltcG9ydCB7IENlbGxUeXBlLCBDb2x1bW5UeXBlLCBHcmlkVHlwZSwgSUdYX0dSSURfQkFTRSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hHcmlkSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi4vaGVhZGVycy9ncmlkLWhlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4R3JpZEZpbHRlcmluZ0NlbGxDb21wb25lbnQgfSBmcm9tICcuLi9maWx0ZXJpbmcvYmFzZS9ncmlkLWZpbHRlcmluZy1jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnQgfSBmcm9tICcuLi9oZWFkZXJzL2dyaWQtaGVhZGVyLWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICAgIElneFN1bW1hcnlPcGVyYW5kLCBJZ3hOdW1iZXJTdW1tYXJ5T3BlcmFuZCwgSWd4RGF0ZVN1bW1hcnlPcGVyYW5kLFxuICAgIElneFN1bW1hcnlSZXN1bHQsIElneFRpbWVTdW1tYXJ5T3BlcmFuZFxufSBmcm9tICcuLi9zdW1tYXJpZXMvZ3JpZC1zdW1tYXJ5JztcbmltcG9ydCB7XG4gICAgSWd4Q2VsbFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIElneENlbGxIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJZ3hDZWxsRWRpdG9yVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgSWd4Q29sbGFwc2libGVJbmRpY2F0b3JUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJZ3hGaWx0ZXJDZWxsVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgSWd4U3VtbWFyeVRlbXBsYXRlRGlyZWN0aXZlXG59IGZyb20gJy4vdGVtcGxhdGVzLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBNUkxSZXNpemVDb2x1bW5JbmZvLCBNUkxDb2x1bW5TaXplSW5mbywgSUNvbHVtblBpcGVBcmdzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IERyb3BQb3NpdGlvbiB9IGZyb20gJy4uL21vdmluZy9tb3Zpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJQ29sdW1uVmlzaWJpbGl0eUNoYW5naW5nRXZlbnRBcmdzLCBJUGluQ29sdW1uQ2FuY2VsbGFibGVFdmVudEFyZ3MsIElQaW5Db2x1bW5FdmVudEFyZ3MgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IGlzQ29uc3RydWN0b3IsIFBsYXRmb3JtVXRpbCB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSWd4R3JpZENlbGwgfSBmcm9tICcuLi9ncmlkLXB1YmxpYy1jZWxsJztcblxuY29uc3QgREVGQVVMVF9EQVRFX0ZPUk1BVCA9ICdtZWRpdW1EYXRlJztcbmNvbnN0IERFRkFVTFRfVElNRV9GT1JNQVQgPSAnbWVkaXVtVGltZSc7XG5jb25zdCBERUZBVUxUX0RBVEVfVElNRV9GT1JNQVQgPSAnbWVkaXVtJztcbmNvbnN0IERFRkFVTFRfRElHSVRTX0lORk8gPSAnMS4wLTMnO1xuXG4vKipcbiAqICoqSWduaXRlIFVJIGZvciBBbmd1bGFyIENvbHVtbioqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9ncmlkL2dyaWQjY29sdW1ucy1jb25maWd1cmF0aW9uKVxuICpcbiAqIFRoZSBJZ25pdGUgVUkgQ29sdW1uIGlzIHVzZWQgd2l0aGluIGFuIGBpZ3gtZ3JpZGAgZWxlbWVudCB0byBkZWZpbmUgd2hhdCBkYXRhIHRoZSBjb2x1bW4gd2lsbCBzaG93LiBGZWF0dXJlcyBzdWNoIGFzIHNvcnRpbmcsXG4gKiBmaWx0ZXJpbmcgJiBlZGl0aW5nIGFyZSBlbmFibGVkIGF0IHRoZSBjb2x1bW4gbGV2ZWwuICBZb3UgY2FuIGFsc28gcHJvdmlkZSBhIHRlbXBsYXRlIGNvbnRhaW5pbmcgY3VzdG9tIGNvbnRlbnQgaW5zaWRlXG4gKiB0aGUgY29sdW1uIHVzaW5nIGBuZy10ZW1wbGF0ZWAgd2hpY2ggd2lsbCBiZSB1c2VkIGZvciBhbGwgY2VsbHMgd2l0aGluIHRoZSBjb2x1bW4uXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHNlbGVjdG9yOiAnaWd4LWNvbHVtbicsXG4gICAgdGVtcGxhdGU6IGBgXG59KVxuZXhwb3J0IGNsYXNzIElneENvbHVtbkNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgQ29sdW1uVHlwZSB7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgZmllbGRgIHZhbHVlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY29sdW1uRmllbGQgPSB0aGlzLmNvbHVtbi5maWVsZDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW2ZpZWxkXSA9IFwiJ0lEJ1wiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZmllbGQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9maWVsZCA9IHZhbHVlO1xuICAgICAgICB0aGlzLmhhc05lc3RlZFBhdGggPSB2YWx1ZT8uaW5jbHVkZXMoJy4nKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBmaWVsZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmllbGQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGhlYWRlcmAgdmFsdWUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5IZWFkZXIgPSB0aGlzLmNvbHVtbi5oZWFkZXI7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtoZWFkZXJdID0gXCInSUQnXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoZWFkZXIgPSAnJztcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGB0aXRsZWAgdmFsdWUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCB0aXRsZSA9IHRoaXMuY29sdW1uLnRpdGxlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbdGl0bGVdID0gXCInU29tZSBjb2x1bW4gdG9vbHRpcCdcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXMoKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRpdGxlID0gJyc7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBpcyBzb3J0YWJsZS5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc1NvcnRhYmxlID0gdGhpcy5jb2x1bW4uc29ydGFibGU7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtzb3J0YWJsZV0gPSBcInRydWVcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc29ydGFibGUgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGlmIHRoZSBjb2x1bW4gaXMgc2VsZWN0YWJsZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtblNlbGVjdGFibGUgPSB0aGlzLmNvbHVtbi5zZWxlY3RhYmxlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzZWxlY3RhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0YWJsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGlmIHRoZSBjb2x1bW4gaXMgc2VsZWN0YWJsZS5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGB0cnVlYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW3NlbGVjdGFibGVdID0gXCJmYWxzZVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHNlbGVjdGFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0YWJsZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBjb2x1bW4gaXMgZ3JvdXBhYmxlLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzR3JvdXBhYmxlID0gdGhpcy5jb2x1bW4uZ3JvdXBhYmxlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbZ3JvdXBhYmxlXSA9IFwidHJ1ZVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcyh0cnVlKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdyb3VwYWJsZSA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgY29sdW1uIGlzIGVkaXRhYmxlLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzRWRpdGFibGUgPSB0aGlzLmNvbHVtbi5lZGl0YWJsZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFVwZGF0aW5nIHRoZSBwcmltYXJ5IGtleSB3aGVuIGdyaWQgaGFzIHRyYW5zYWN0aW9ucyAoaW5jbC4gcm93IGVkaXQpXG4gICAgICAgIC8vIHNob3VsZCBub3QgYmUgYWxsb3dlZCwgYXMgdGhhdCBjYW4gY29ycnVwdCB0cmFuc2FjdGlvbiBzdGF0ZS5cbiAgICAgICAgY29uc3Qgcm93RWRpdGFibGUgPSB0aGlzLmdyaWQgJiYgdGhpcy5ncmlkLnJvd0VkaXRhYmxlO1xuICAgICAgICBjb25zdCBoYXNUcmFuc2FjdGlvbnMgPSB0aGlzLmdyaWQgJiYgdGhpcy5ncmlkLnRyYW5zYWN0aW9ucy5lbmFibGVkO1xuXG4gICAgICAgIGlmICh0aGlzLmlzUHJpbWFyeUNvbHVtbiAmJiAocm93RWRpdGFibGUgfHwgaGFzVHJhbnNhY3Rpb25zKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2VkaXRhYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lZGl0YWJsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb3dFZGl0YWJsZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBpcyBlZGl0YWJsZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb2x1bW4uZWRpdGFibGUgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbZWRpdGFibGVdID0gXCJ0cnVlXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgZWRpdGFibGUoZWRpdGFibGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZWRpdGFibGUgPSBlZGl0YWJsZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBpcyBmaWx0ZXJhYmxlLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNGaWx0ZXJhYmxlID0gdGhpcy5jb2x1bW4uZmlsdGVyYWJsZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW2ZpbHRlcmFibGVdID0gXCJmYWxzZVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZmlsdGVyYWJsZSA9IHRydWU7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBpcyByZXNpemFibGUuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNSZXNpemFibGUgPSB0aGlzLmNvbHVtbi5yZXNpemFibGU7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtyZXNpemFibGVdID0gXCJ0cnVlXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJlc2l6YWJsZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBoZWFkZXIgaXMgaW5jbHVkZWQgaW4gYXV0b3NpemUgbG9naWMuXG4gICAgICogVXNlZnVsIHdoZW4gdGVtcGxhdGUgZm9yIGEgY29sdW1uIGhlYWRlciBpcyBzaXplZCBiYXNlZCBvbiBwYXJlbnQsIGZvciBleGFtcGxlIGEgZGVmYXVsdCBgZGl2YC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc1Jlc2l6YWJsZSA9IHRoaXMuY29sdW1uLnJlc2l6YWJsZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW3Jlc2l6YWJsZV0gPSBcInRydWVcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgYXV0b3NpemVIZWFkZXIgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgc3VtbWFyeSBmb3IgdGhlIGNvbHVtbiBpcyBlbmFibGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaGFzU3VtbWFyeSA9IHRoaXMuY29sdW1uLmhhc1N1bW1hcnk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXModHJ1ZSlcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaGFzU3VtbWFyeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc1N1bW1hcnk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIHN1bW1hcnkgZm9yIHRoZSBjb2x1bW4gaXMgZW5hYmxlZC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtoYXNTdW1tYXJ5XSA9IFwidHJ1ZVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGhhc1N1bW1hcnkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5faGFzU3VtbWFyeSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmdyaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5zdW1tYXJ5U2VydmljZS5yZXNldFN1bW1hcnlIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBpcyBoaWRkZW4uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0hpZGRlbiA9IHRoaXMuY29sdW1uLmhpZGRlbjtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcyh0cnVlKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBoaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oaWRkZW47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbHVtbiBoaWRkZW4gcHJvcGVydHkuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbaGlkZGVuXSA9IFwidHJ1ZVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIFR3by13YXkgZGF0YSBiaW5kaW5nLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbKGhpZGRlbildID0gXCJtb2RlbC5pc0hpZGRlblwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGhpZGRlbih2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5faGlkZGVuICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5faGlkZGVuID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmhpZGRlbkNoYW5nZS5lbWl0KHRoaXMuX2hpZGRlbik7XG4gICAgICAgICAgICBpZiAodGhpcy5jb2x1bW5MYXlvdXRDaGlsZCAmJiB0aGlzLnBhcmVudC5oaWRkZW4gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuaGlkZGVuID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5lbmRFZGl0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuc3VtbWFyeVNlcnZpY2UucmVzZXRTdW1tYXJ5SGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmZpbHRlcmluZ1NlcnZpY2UucmVmcmVzaEV4cHJlc3Npb25zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmZpbHRlcmluZ1NlcnZpY2UuaGlkZUZpbHRlcmluZ1Jvd09uQ29sdW1uVmlzaWJpbGl0eUNoYW5nZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGUgY29sdW1uIGlzIHNlbGVjdGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNTZWxlY3RlZCA9IHRoaXMuY29sdW1uLnNlbGVjdGVkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQuc2VsZWN0aW9uU2VydmljZS5pc0NvbHVtblNlbGVjdGVkKHRoaXMuZmllbGQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdC9kZXNlbGVjdCBhIGNvbHVtbi5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY29sdW1uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGFibGUgJiYgdmFsdWUgIT09IHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdENvbHVtbnNXaXRoTm9FdmVudChbdGhpcy5maWVsZF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdENvbHVtbnNXaXRoTm9FdmVudChbdGhpcy5maWVsZF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ncmlkLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgaGlkZGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZXhwYW5kZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjb2xsYXBzaWJsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB2aXNpYmxlV2hlbkNvbGxhcHNlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbHVtbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgaGlkaW5nIGlzIGRpc2FibGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNIaWRpbmdEaXNhYmxlZCA9ICB0aGlzLmNvbHVtbi5kaXNhYmxlSGlkaW5nO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlSGlkaW5nID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogR2V0cyB3aGV0aGVyIHRoZSBwaW5uaW5nIGlzIGRpc2FibGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNQaW5uaW5nRGlzYWJsZWQgPSAgdGhpcy5jb2x1bW4uZGlzYWJsZVBpbm5pbmc7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXMoKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc2FibGVQaW5uaW5nID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAxMy4xLjAuIFVzZSBgSWd4R3JpZENvbXBvbmVudC5tb3ZpbmdgIGluc3RlYWQuXG4gICAgICogXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBpcyBtb3ZhYmxlLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNNb3ZhYmxlID0gdGhpcy5jb2x1bW4ubW92YWJsZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW21vdmFibGVdID0gXCJ0cnVlXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1vdmFibGUgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBgd2lkdGhgIG9mIHRoZSBjb2x1bW4uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5XaWR0aCA9IHRoaXMuY29sdW1uLndpZHRoO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKHRydWUpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHdpZHRoKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoU2V0QnlVc2VyID8gdGhpcy5fd2lkdGggOiB0aGlzLmRlZmF1bHRXaWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgd2lkdGhgIG9mIHRoZSBjb2x1bW4uXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFt3aWR0aF0gPSBcIicyNSUnXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogVHdvLXdheSBkYXRhIGJpbmRpbmcuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFsod2lkdGgpXT1cIm1vZGVsLmNvbHVtbnNbMF0ud2lkdGhcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCB3aWR0aCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FsY1dpZHRoID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2FsY1BpeGVsV2lkdGggPSBOYU47XG4gICAgICAgICAgICB0aGlzLndpZHRoU2V0QnlVc2VyID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHdpZHRoIGNvdWxkIGJlIHBhc3NlZCBhcyBudW1iZXIgZnJvbSB0aGUgdGVtcGxhdGVcbiAgICAgICAgICAgIC8vIGhvc3QgYmluZGluZ3MgYXJlIG5vdCBweCBhZmZpeGVkIHNvIHdlIG5lZWQgdG8gZW5zdXJlIHdlIGFmZml4IHNpbXBsZSBudW1iZXIgc3RyaW5nc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnbnVtYmVyJyB8fCB2YWx1ZS5tYXRjaCgvXlswLTldKiQvKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlQ2FsY1dpZHRoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLndpZHRoQ2hhbmdlLmVtaXQodGhpcy5fd2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBtYXhpbXVtIGB3aWR0aGAgb2YgdGhlIGNvbHVtbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtbk1heFdpZHRoID0gdGhpcy5jb2x1bW4ud2lkdGg7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFttYXhXaWR0aF0gPSBcIicxNTBweCdcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWF4V2lkdGg6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgY2xhc3Mgc2VsZWN0b3Igb2YgdGhlIGNvbHVtbiBoZWFkZXIuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5IZWFkZXJDbGFzcyA9IHRoaXMuY29sdW1uLmhlYWRlckNsYXNzZXM7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtoZWFkZXJDbGFzc2VzXSA9IFwiJ2NvbHVtbi1oZWFkZXInXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoZWFkZXJDbGFzc2VzID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGNvbmRpdGlvbmFsIHN0eWxlIHByb3BlcnRpZXMgb24gdGhlIGNvbHVtbiBoZWFkZXIuXG4gICAgICogU2ltaWxhciB0byBgbmdTdHlsZWAgaXQgYWNjZXB0cyBhbiBvYmplY3QgbGl0ZXJhbCB3aGVyZSB0aGUga2V5cyBhcmVcbiAgICAgKiB0aGUgc3R5bGUgcHJvcGVydGllcyBhbmQgdGhlIHZhbHVlIGlzIHRoZSBleHByZXNzaW9uIHRvIGJlIGV2YWx1YXRlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogc3R5bGVzID0ge1xuICAgICAqICBiYWNrZ3JvdW5kOiAncm95YWxibHVlJyxcbiAgICAgKiAgY29sb3I6IChjb2x1bW4pID0+IGNvbHVtbi5waW5uZWQgPyAncmVkJzogJ2luaGVyaXQnXG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbaGVhZGVyU3R5bGVzXT1cInN0eWxlc1wiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGVhZGVyU3R5bGVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgY2xhc3Mgc2VsZWN0b3Igb2YgdGhlIGNvbHVtbiBncm91cCBoZWFkZXIuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5IZWFkZXJDbGFzcyA9IHRoaXMuY29sdW1uLmhlYWRlckdyb3VwQ2xhc3NlcztcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW2hlYWRlckdyb3VwQ2xhc3Nlc10gPSBcIidjb2x1bW4tZ3JvdXAtaGVhZGVyJ1wiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGVhZGVyR3JvdXBDbGFzc2VzID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGNvbmRpdGlvbmFsIHN0eWxlIHByb3BlcnRpZXMgb24gdGhlIGNvbHVtbiBoZWFkZXIgZ3JvdXAgd3JhcHBlci5cbiAgICAgKiBTaW1pbGFyIHRvIGBuZ1N0eWxlYCBpdCBhY2NlcHRzIGFuIG9iamVjdCBsaXRlcmFsIHdoZXJlIHRoZSBrZXlzIGFyZVxuICAgICAqIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIGFuZCB0aGUgdmFsdWUgaXMgdGhlIGV4cHJlc3Npb24gdG8gYmUgZXZhbHVhdGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBzdHlsZXMgPSB7XG4gICAgICogIGJhY2tncm91bmQ6ICdyb3lhbGJsdWUnLFxuICAgICAqICBjb2xvcjogKGNvbHVtbikgPT4gY29sdW1uLnBpbm5lZCA/ICdyZWQnOiAnaW5oZXJpdCdcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtoZWFkZXJHcm91cFN0eWxlc109XCJzdHlsZXNcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXMoKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGhlYWRlckdyb3VwU3R5bGVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBjb25kaXRpb25hbCBjbGFzcyBzZWxlY3RvciBvZiB0aGUgY29sdW1uIGNlbGxzLlxuICAgICAqIEFjY2VwdHMgYW4gb2JqZWN0IGxpdGVyYWwsIGNvbnRhaW5pbmcga2V5LXZhbHVlIHBhaXJzLFxuICAgICAqIHdoZXJlIHRoZSBrZXkgaXMgdGhlIG5hbWUgb2YgdGhlIENTUyBjbGFzcywgd2hpbGUgdGhlXG4gICAgICogdmFsdWUgaXMgZWl0aGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgYm9vbGVhbixcbiAgICAgKiBvciBib29sZWFuLCBsaWtlIHNvOlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjYWxsYmFjayA9IChyb3dEYXRhLCBjb2x1bW5LZXksIGNlbGxWYWx1ZSwgcm93SW5kZXgpID0+IHsgcmV0dXJuIHJvd0RhdGFbY29sdW1uS2V5XSA+IDY7IH1cbiAgICAgKiBjZWxsQ2xhc3NlcyA9IHsgJ2NsYXNzTmFtZScgOiB0aGlzLmNhbGxiYWNrIH07XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtjZWxsQ2xhc3Nlc10gPSBcImNlbGxDbGFzc2VzXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIDxpZ3gtY29sdW1uIFtjZWxsQ2xhc3Nlc10gPSBcInsnY2xhc3MxJyA6IHRydWUgfVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2VsbENsYXNzZXM6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgY29uZGl0aW9uYWwgc3R5bGUgcHJvcGVydGllcyBvbiB0aGUgY29sdW1uIGNlbGxzLlxuICAgICAqIFNpbWlsYXIgdG8gYG5nU3R5bGVgIGl0IGFjY2VwdHMgYW4gb2JqZWN0IGxpdGVyYWwgd2hlcmUgdGhlIGtleXMgYXJlXG4gICAgICogdGhlIHN0eWxlIHByb3BlcnRpZXMgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgZXhwcmVzc2lvbiB0byBiZSBldmFsdWF0ZWQuXG4gICAgICogQXMgd2l0aCBgY2VsbENsYXNzZXNgIGl0IGFjY2VwdHMgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogc3R5bGVzID0ge1xuICAgICAqICBiYWNrZ3JvdW5kOiAncm95YWxibHVlJyxcbiAgICAgKiAgY29sb3I6IChyb3dEYXRhLCBjb2x1bW5LZXksIGNlbGxWYWx1ZSwgcm93SW5kZXgpID0+IHZhbHVlLnN0YXJ0c1dpdGgoJ0ltcG9ydGFudCcpID8gJ3JlZCc6ICdpbmhlcml0J1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW2NlbGxTdHlsZXNdPVwic3R5bGVzXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjZWxsU3R5bGVzID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIGRpc3BsYXkgZm9ybWF0IHRvIGNlbGwgdmFsdWVzIGluIHRoZSBjb2x1bW4uIERvZXMgbm90IG1vZGlmeSB0aGUgdW5kZXJseWluZyBkYXRhLlxuICAgICAqXG4gICAgICogQHJlbWFya1xuICAgICAqIE5vdGU6IEFzIHRoZSBmb3JtYXR0ZXIgaXMgdXNlZCBpbiBwbGFjZXMgbGlrZSB0aGUgRXhjZWwgc3R5bGUgZmlsdGVyaW5nIGRpYWxvZywgaW4gY2VydGFpblxuICAgICAqIHNjZW5hcmlvcyAocmVtb3RlIGZpbHRlcmluZyBmb3IgZXhhbXBsZSksIHRoZSByb3cgZGF0YSBhcmd1bWVudCBjYW4gYmUgYHVuZGVmaW5lZGAuXG4gICAgICpcbiAgICAgKlxuICAgICAqIEluIHRoaXMgZXhhbXBsZSwgd2UgY2hlY2sgdG8gc2VlIGlmIHRoZSBjb2x1bW4gbmFtZSBpcyBTYWxhcnksIGFuZCB0aGVuIHByb3ZpZGUgYSBtZXRob2QgYXMgdGhlIGNvbHVtbiBmb3JtYXR0ZXJcbiAgICAgKiB0byBmb3JtYXQgdGhlIHZhbHVlIGludG8gYSBjdXJyZW5jeSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb2x1bW5Jbml0KGNvbHVtbjogSWd4Q29sdW1uQ29tcG9uZW50KSB7XG4gICAgICogICBpZiAoY29sdW1uLmZpZWxkID09IFwiU2FsYXJ5XCIpIHtcbiAgICAgKiAgICAgY29sdW1uLmZvcm1hdHRlciA9IChzYWxhcnkgPT4gdGhpcy5mb3JtYXQoc2FsYXJ5KSk7XG4gICAgICogICB9XG4gICAgICogfVxuICAgICAqXG4gICAgICogZm9ybWF0KHZhbHVlOiBudW1iZXIpIDogc3RyaW5nIHtcbiAgICAgKiAgIHJldHVybiBmb3JtYXRDdXJyZW5jeSh2YWx1ZSwgXCJlbi11c1wiLCBcIiRcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgY29sdW1uID0gdGhpcy5ncmlkLmdldENvbHVtbkJ5TmFtZSgnQWRkcmVzcycpO1xuICAgICAqIGNvbnN0IGFkZHJlc3NGb3JtYXR0ZXIgPSAoYWRkcmVzczogc3RyaW5nLCByb3dEYXRhOiBhbnkpID0+IGRhdGEucHJpdmFjeUVuYWJsZWQgPyAndW5rbm93bicgOiBhZGRyZXNzO1xuICAgICAqIGNvbHVtbi5mb3JtYXR0ZXIgPSBhZGRyZXNzRm9ybWF0dGVyO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmb3JtYXR0ZXI6ICh2YWx1ZTogYW55LCByb3dEYXRhPzogYW55KSA9PiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3VtbWFyeUZvcm1hdHRlciBpcyB1c2VkIHRvIGZvcm1hdCB0aGUgZGlzcGxheSBvZiB0aGUgY29sdW1uIHN1bW1hcmllcy5cbiAgICAgKlxuICAgICAqIEluIHRoaXMgZXhhbXBsZSwgd2UgY2hlY2sgdG8gc2VlIGlmIHRoZSBjb2x1bW4gbmFtZSBpcyBPcmRlckRhdGUsIGFuZCB0aGVuIHByb3ZpZGUgYSBtZXRob2QgYXMgdGhlIHN1bW1hcnlGb3JtYXR0ZXJcbiAgICAgKiB0byBjaGFuZ2UgdGhlIGxvY2FsZSBmb3IgdGhlIGRhdGVzIHRvICdmci1GUicuIFRoZSBzdW1tYXJpZXMgd2l0aCB0aGUgY291bnQga2V5IGFyZSBza2lwcGVkIHNvIHRoZXkgYXJlIGRpc3BsYXllZCBhcyBudW1iZXJzLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbHVtbkluaXQoY29sdW1uOiBJZ3hDb2x1bW5Db21wb25lbnQpIHtcbiAgICAgKiAgIGlmIChjb2x1bW4uZmllbGQgPT0gXCJPcmRlckRhdGVcIikge1xuICAgICAqICAgICBjb2x1bW4uc3VtbWFyeUZvcm1hdHRlciA9IHRoaXMuc3VtbWFyeUZvcm1hdDtcbiAgICAgKiAgIH1cbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBzdW1tYXJ5Rm9ybWF0KHN1bW1hcnk6IElneFN1bW1hcnlSZXN1bHQsIHN1bW1hcnlPcGVyYW5kOiBJZ3hTdW1tYXJ5T3BlcmFuZCk6IHN0cmluZyB7XG4gICAgICogICBjb25zdCByZXN1bHQgPSBzdW1tYXJ5LnN1bW1hcnlSZXN1bHQ7XG4gICAgICogICBpZihzdW1tYXJ5UmVzdWx0LmtleSAhPT0gJ2NvdW50JyAmJiByZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgKiAgICAgIGNvbnN0IHBpcGUgPSBuZXcgRGF0ZVBpcGUoJ2ZyLUZSJyk7XG4gICAgICogICAgICByZXR1cm4gcGlwZS50cmFuc2Zvcm0ocmVzdWx0LCdtZWRpdW1EYXRlJyk7XG4gICAgICogICB9XG4gICAgICogICByZXR1cm4gcmVzdWx0O1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc3VtbWFyeUZvcm1hdHRlcjogKHN1bW1hcnk6IElneFN1bW1hcnlSZXN1bHQsIHN1bW1hcnlPcGVyYW5kOiBJZ3hTdW1tYXJ5T3BlcmFuZCkgPT4gYW55O1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBmaWx0ZXJpbmcgc2hvdWxkIGJlIGNhc2Ugc2Vuc2l0aXZlLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZmlsdGVyaW5nSWdub3JlQ2FzZSA9IHRoaXMuY29sdW1uLmZpbHRlcmluZ0lnbm9yZUNhc2U7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtmaWx0ZXJpbmdJZ25vcmVDYXNlXSA9IFwiZmFsc2VcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZmlsdGVyaW5nSWdub3JlQ2FzZSA9IHRydWU7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBzb3J0aW5nIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZS5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGB0cnVlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHNvcnRpbmdJZ25vcmVDYXNlID0gdGhpcy5jb2x1bW4uc29ydGluZ0lnbm9yZUNhc2U7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uIFtzb3J0aW5nSWdub3JlQ2FzZV0gPSBcImZhbHNlXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNvcnRpbmdJZ25vcmVDYXNlID0gdHJ1ZTtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgd2hldGhlciB0aGUgY29sdW1uIGlzIGBzZWFyY2hhYmxlYC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGB0cnVlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzU2VhcmNoYWJsZSA9ICB0aGlzLmNvbHVtbi5zZWFyY2hhYmxlJztcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtY29sdW1uIFtzZWFyY2hhYmxlXSA9IFwiZmFsc2VcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXMoKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNlYXJjaGFibGUgPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgZGF0YSB0eXBlIG9mIHRoZSBjb2x1bW4gdmFsdWVzLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYHN0cmluZ2AuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5EYXRhVHlwZSA9IHRoaXMuY29sdW1uLmRhdGFUeXBlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBbZGF0YVR5cGVdID0gXCInbnVtYmVyJ1wiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkYXRhVHlwZTogR3JpZENvbHVtbkRhdGFUeXBlID0gR3JpZENvbHVtbkRhdGFUeXBlLlN0cmluZztcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY29sbGFwc2libGVJbmRpY2F0b3JUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIFJvdyBpbmRleCB3aGVyZSB0aGUgY3VycmVudCBmaWVsZCBzaG91bGQgZW5kLlxuICAgICAqIFRoZSBhbW91bnQgb2Ygcm93cyBiZXR3ZWVuIHJvd1N0YXJ0IGFuZCByb3dFbmQgd2lsbCBkZXRlcm1pbmUgdGhlIGFtb3VudCBvZiBzcGFubmluZyByb3dzIHRvIHRoYXQgZmllbGRcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4tbGF5b3V0PlxuICAgICAqICAgPGlneC1jb2x1bW4gW3Jvd0VuZF09XCIyXCIgW3Jvd1N0YXJ0XT1cIjFcIiBbY29sU3RhcnRdPVwiMVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiA8L2lneC1jb2x1bW4tbGF5b3V0PlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJvd0VuZDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQ29sdW1uIGluZGV4IHdoZXJlIHRoZSBjdXJyZW50IGZpZWxkIHNob3VsZCBlbmQuXG4gICAgICogVGhlIGFtb3VudCBvZiBjb2x1bW5zIGJldHdlZW4gY29sU3RhcnQgYW5kIGNvbEVuZCB3aWxsIGRldGVybWluZSB0aGUgYW1vdW50IG9mIHNwYW5uaW5nIGNvbHVtbnMgdG8gdGhhdCBmaWVsZFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbi1sYXlvdXQ+XG4gICAgICogICA8aWd4LWNvbHVtbiBbY29sRW5kXT1cIjNcIiBbcm93U3RhcnRdPVwiMVwiIFtjb2xTdGFydF09XCIxXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIDwvaWd4LWNvbHVtbi1sYXlvdXQ+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY29sRW5kOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBSb3cgaW5kZXggZnJvbSB3aGljaCB0aGUgZmllbGQgaXMgc3RhcnRpbmcuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29sdW1uLWxheW91dD5cbiAgICAgKiAgIDxpZ3gtY29sdW1uIFtyb3dTdGFydF09XCIxXCIgW2NvbFN0YXJ0XT1cIjFcIj48L2lneC1jb2x1bW4+XG4gICAgICogPC9pZ3gtY29sdW1uLWxheW91dD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByb3dTdGFydDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQ29sdW1uIGluZGV4IGZyb20gd2hpY2ggdGhlIGZpZWxkIGlzIHN0YXJ0aW5nLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbi1sYXlvdXQ+XG4gICAgICogICA8aWd4LWNvbHVtbiBbY29sU3RhcnRdPVwiMVwiIFtyb3dTdGFydF09XCIxXCI+PC9pZ3gtY29sdW1uPlxuICAgICAqIDwvaWd4LWNvbHVtbi1sYXlvdXQ+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY29sU3RhcnQ6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyBjdXN0b20gcHJvcGVydGllcyBwcm92aWRlZCBpbiBhZGRpdGlvbmFsIHRlbXBsYXRlIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW2FkZGl0aW9uYWxUZW1wbGF0ZUNvbnRleHRdPVwiY29udGV4dE9iamVjdFwiPlxuICAgICAqICAgPG5nLXRlbXBsYXRlIGlneENlbGwgbGV0LWNlbGw9XCJjZWxsXCIgbGV0LXByb3BzPVwiYWRkaXRpb25hbFRlbXBsYXRlQ29udGV4dFwiPlxuICAgICAqICAgICAge3sgcHJvcHMgfX1cbiAgICAgKiAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogPC9pZ3gtY29sdW1uPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGFkZGl0aW9uYWxUZW1wbGF0ZUNvbnRleHQ6IGFueTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgd2lkdGhDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcGlubmVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneEZpbHRlckNlbGxUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBJZ3hGaWx0ZXJDZWxsVGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgZmlsdGVyQ2VsbFRlbXBsYXRlRGlyZWN0aXZlOiBJZ3hGaWx0ZXJDZWxsVGVtcGxhdGVEaXJlY3RpdmU7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4U3VtbWFyeVRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneFN1bW1hcnlUZW1wbGF0ZURpcmVjdGl2ZSB9KVxuICAgIHByb3RlY3RlZCBzdW1tYXJ5VGVtcGxhdGVEaXJlY3RpdmU6IElneFN1bW1hcnlUZW1wbGF0ZURpcmVjdGl2ZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hDZWxsVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogSWd4Q2VsbFRlbXBsYXRlRGlyZWN0aXZlIH0pXG4gICAgcHJvdGVjdGVkIGNlbGxUZW1wbGF0ZTogSWd4Q2VsbFRlbXBsYXRlRGlyZWN0aXZlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneENlbGxIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBJZ3hDZWxsSGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUsIGRlc2NlbmRhbnRzOiBmYWxzZSB9KVxuICAgIHByb3RlY3RlZCBoZWFkVGVtcGxhdGU6IFF1ZXJ5TGlzdDxJZ3hDZWxsSGVhZGVyVGVtcGxhdGVEaXJlY3RpdmU+O1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneENlbGxFZGl0b3JUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBJZ3hDZWxsRWRpdG9yVGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwcm90ZWN0ZWQgZWRpdG9yVGVtcGxhdGU6IElneENlbGxFZGl0b3JUZW1wbGF0ZURpcmVjdGl2ZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hDb2xsYXBzaWJsZUluZGljYXRvclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneENvbGxhcHNpYmxlSW5kaWNhdG9yVGVtcGxhdGVEaXJlY3RpdmUsIHN0YXRpYzogZmFsc2UgfSlcbiAgICBwcm90ZWN0ZWQgY29sbGFwc2VJbmRpY2F0b3JUZW1wbGF0ZTogSWd4Q29sbGFwc2libGVJbmRpY2F0b3JUZW1wbGF0ZURpcmVjdGl2ZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBjYWxjV2lkdGgoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2FsY1dpZHRoKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNhbGNQaXhlbFdpZHRoOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBtYXhXaWR0aFB4KCkge1xuICAgICAgICBjb25zdCBncmlkQXZhaWxhYmxlU2l6ZSA9IHRoaXMuZ3JpZC5jYWxjV2lkdGg7XG4gICAgICAgIGNvbnN0IGlzUGVyY2VudGFnZVdpZHRoID0gdGhpcy5tYXhXaWR0aCAmJiB0eXBlb2YgdGhpcy5tYXhXaWR0aCA9PT0gJ3N0cmluZycgJiYgdGhpcy5tYXhXaWR0aC5pbmRleE9mKCclJykgIT09IC0xO1xuICAgICAgICByZXR1cm4gaXNQZXJjZW50YWdlV2lkdGggPyBwYXJzZUZsb2F0KHRoaXMubWF4V2lkdGgpIC8gMTAwICogZ3JpZEF2YWlsYWJsZVNpemUgOiBwYXJzZUZsb2F0KHRoaXMubWF4V2lkdGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG1heFdpZHRoUGVyY2VudCgpIHtcbiAgICAgICAgY29uc3QgZ3JpZEF2YWlsYWJsZVNpemUgPSB0aGlzLmdyaWQuY2FsY1dpZHRoO1xuICAgICAgICBjb25zdCBpc1BlcmNlbnRhZ2VXaWR0aCA9IHRoaXMubWF4V2lkdGggJiYgdHlwZW9mIHRoaXMubWF4V2lkdGggPT09ICdzdHJpbmcnICYmIHRoaXMubWF4V2lkdGguaW5kZXhPZignJScpICE9PSAtMTtcbiAgICAgICAgcmV0dXJuIGlzUGVyY2VudGFnZVdpZHRoID8gcGFyc2VGbG9hdCh0aGlzLm1heFdpZHRoKSA6IHBhcnNlRmxvYXQodGhpcy5tYXhXaWR0aCkgLyBncmlkQXZhaWxhYmxlU2l6ZSAqIDEwMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBtaW5XaWR0aFB4KCkge1xuICAgICAgICBjb25zdCBncmlkQXZhaWxhYmxlU2l6ZSA9IHRoaXMuZ3JpZC5jYWxjV2lkdGg7XG4gICAgICAgIGNvbnN0IGlzUGVyY2VudGFnZVdpZHRoID0gdGhpcy5taW5XaWR0aCAmJiB0eXBlb2YgdGhpcy5taW5XaWR0aCA9PT0gJ3N0cmluZycgJiYgdGhpcy5taW5XaWR0aC5pbmRleE9mKCclJykgIT09IC0xO1xuICAgICAgICByZXR1cm4gaXNQZXJjZW50YWdlV2lkdGggPyBwYXJzZUZsb2F0KHRoaXMubWluV2lkdGgpIC8gMTAwICogZ3JpZEF2YWlsYWJsZVNpemUgOiBwYXJzZUZsb2F0KHRoaXMubWluV2lkdGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG1pbldpZHRoUGVyY2VudCgpIHtcbiAgICAgICAgY29uc3QgZ3JpZEF2YWlsYWJsZVNpemUgPSB0aGlzLmdyaWQuY2FsY1dpZHRoO1xuICAgICAgICBjb25zdCBpc1BlcmNlbnRhZ2VXaWR0aCA9IHRoaXMubWluV2lkdGggJiYgdHlwZW9mIHRoaXMubWluV2lkdGggPT09ICdzdHJpbmcnICYmIHRoaXMubWluV2lkdGguaW5kZXhPZignJScpICE9PSAtMTtcbiAgICAgICAgcmV0dXJuIGlzUGVyY2VudGFnZVdpZHRoID8gcGFyc2VGbG9hdCh0aGlzLm1pbldpZHRoKSA6IHBhcnNlRmxvYXQodGhpcy5taW5XaWR0aCkgLyBncmlkQXZhaWxhYmxlU2l6ZSAqIDEwMDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgbWluaW11bSBgd2lkdGhgIG9mIHRoZSBjb2x1bW4uXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgODhgO1xuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY29sdW1uTWluV2lkdGggPSB0aGlzLmNvbHVtbi5taW5XaWR0aDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW21pbldpZHRoXSA9IFwiJzEwMHB4J1wiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IG1pbldpZHRoKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbWluVmFsID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4obWluVmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RlZmF1bHRNaW5XaWR0aCA9IHZhbHVlO1xuXG4gICAgfVxuICAgIHB1YmxpYyBnZXQgbWluV2lkdGgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9kZWZhdWx0TWluV2lkdGggPyB0aGlzLmRlZmF1bHRNaW5XaWR0aCA6IHRoaXMuX2RlZmF1bHRNaW5XaWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb2x1bW4gaW5kZXguXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5JbmRleCA9IHRoaXMuY29sdW1uLmluZGV4O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmdyaWQgYXMgYW55KS5fY29sdW1ucy5pbmRleE9mKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgY29sdW1uIGlzIGBwaW5uZWRgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNQaW5uZWQgPSB0aGlzLmNvbHVtbi5waW5uZWQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHBpbm5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bpbm5lZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB3aGV0aGVyIHRoZSBjb2x1bW4gaXMgcGlubmVkLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gW3Bpbm5lZF0gPSBcInRydWVcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUd28td2F5IGRhdGEgYmluZGluZy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4gWyhwaW5uZWQpXSA9IFwibW9kZWwuY29sdW1uc1swXS5pc1Bpbm5lZFwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHBpbm5lZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5fcGlubmVkICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZCAmJiB0aGlzLndpZHRoICYmICFpc05hTihwYXJzZUludCh0aGlzLndpZHRoLCAxMCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGluKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnBpbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBObyBncmlkL3dpZHRoIGF2YWlsYWJsZSBhdCBpbml0aWFsaXphdGlvbi4gYGluaXRQaW5uaW5nYCBpbiB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgd2lsbCByZS1pbml0IHRoZSBncm91cCAoaWYgcHJlc2VudClcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLl9waW5uZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMucGlubmVkQ2hhbmdlLmVtaXQodGhpcy5fcGlubmVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvbHVtbiBgc3VtbWFyaWVzYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtblN1bW1hcmllcyA9IHRoaXMuY29sdW1uLnN1bW1hcmllcztcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcyh0cnVlKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzdW1tYXJpZXMoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1bW1hcmllcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY29sdW1uIGBzdW1tYXJpZXNgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNvbHVtbi5zdW1tYXJpZXMgPSBJZ3hOdW1iZXJTdW1tYXJ5T3BlcmFuZDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHN1bW1hcmllcyhjbGFzc1JlZjogYW55KSB7XG4gICAgICAgIGlmIChpc0NvbnN0cnVjdG9yKGNsYXNzUmVmKSkge1xuICAgICAgICAgICAgdGhpcy5fc3VtbWFyaWVzID0gbmV3IGNsYXNzUmVmKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmlkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQuc3VtbWFyeVNlcnZpY2UucmVtb3ZlU3VtbWFyaWVzQ2FjaGVQZXJDb2x1bW4odGhpcy5maWVsZCk7XG4gICAgICAgICAgICB0aGlzLmdyaWQuc3VtbWFyeVBpcGVUcmlnZ2VyKys7XG4gICAgICAgICAgICB0aGlzLmdyaWQuc3VtbWFyeVNlcnZpY2UucmVzZXRTdW1tYXJ5SGVpZ2h0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY29sdW1uIGBmaWx0ZXJzYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtbkZpbHRlcnMgPSB0aGlzLmNvbHVtbi5maWx0ZXJzJ1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBmaWx0ZXJzKCk6IElneEZpbHRlcmluZ09wZXJhbmQge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsdGVycztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY29sdW1uIGBmaWx0ZXJzYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb2x1bW4uZmlsdGVycyA9IElneEJvb2xlYW5GaWx0ZXJpbmdPcGVyYW5kLmluc3RhbmNlKCkuXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCBmaWx0ZXJzKGluc3RhbmNlOiBJZ3hGaWx0ZXJpbmdPcGVyYW5kKSB7XG4gICAgICAgIHRoaXMuX2ZpbHRlcnMgPSBpbnN0YW5jZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY29sdW1uIGBzb3J0U3RyYXRlZ3lgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgc29ydFN0cmF0ZWd5ID0gdGhpcy5jb2x1bW4uc29ydFN0cmF0ZWd5XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHNvcnRTdHJhdGVneSgpOiBJU29ydGluZ1N0cmF0ZWd5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvcnRTdHJhdGVneTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY29sdW1uIGBzb3J0U3RyYXRlZ3lgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNvbHVtbi5zb3J0U3RyYXRlZ3kgPSBuZXcgQ3VzdG9tU29ydGluZ1N0cmF0ZWd5KCkuXG4gICAgICogY2xhc3MgQ3VzdG9tU29ydGluZ1N0cmF0ZWd5IGV4dGVuZHMgU29ydGluZ1N0cmF0ZWd5IHsuLi59XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCBzb3J0U3RyYXRlZ3koY2xhc3NSZWY6IElTb3J0aW5nU3RyYXRlZ3kpIHtcbiAgICAgICAgdGhpcy5fc29ydFN0cmF0ZWd5ID0gY2xhc3NSZWY7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGZ1bmN0aW9uIHRoYXQgY29tcGFyZXMgdmFsdWVzIGZvciBncm91cGluZy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGdyb3VwaW5nQ29tcGFyZXIgPSB0aGlzLmNvbHVtbi5ncm91cGluZ0NvbXBhcmVyJ1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBncm91cGluZ0NvbXBhcmVyKCk6IChhOiBhbnksIGI6IGFueSkgPT4gbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwaW5nQ29tcGFyZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSBjdXN0b20gZnVuY3Rpb24gdG8gY29tcGFyZSB2YWx1ZXMgZm9yIGdyb3VwaW5nLlxuICAgICAqIFN1YnNlcXVlbnQgdmFsdWVzIGluIHRoZSBzb3J0ZWQgZGF0YSB0aGF0IHRoZSBmdW5jdGlvbiByZXR1cm5zIDAgZm9yIGFyZSBncm91cGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNvbHVtbi5ncm91cGluZ0NvbXBhcmVyID0gKGE6IGFueSwgYjogYW55KSA9PiB7IHJldHVybiBhID09PSBiID8gMCA6IC0xOyB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCBncm91cGluZ0NvbXBhcmVyKGZ1bmNSZWY6IChhOiBhbnksIGI6IGFueSkgPT4gbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2dyb3VwaW5nQ29tcGFyZXIgPSBmdW5jUmVmO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBkZWZhdWx0IG1pbmltdW0gYHdpZHRoYCBvZiB0aGUgY29sdW1uLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZGVmYXVsdE1pbldpZHRoID0gIHRoaXMuY29sdW1uLmRlZmF1bHRNaW5XaWR0aDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGRlZmF1bHRNaW5XaWR0aCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuZ3JpZCkge1xuICAgICAgICAgICAgcmV0dXJuICc4MCc7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLmdyaWQuZGlzcGxheURlbnNpdHkpIHtcbiAgICAgICAgICAgIGNhc2UgRGlzcGxheURlbnNpdHkuY29zeTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzY0JztcbiAgICAgICAgICAgIGNhc2UgRGlzcGxheURlbnNpdHkuY29tcGFjdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJzU2JztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICc4MCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgYHN1bW1hcnlUZW1wbGF0ZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBzdW1tYXJ5VGVtcGxhdGUgPSB0aGlzLmNvbHVtbi5zdW1tYXJ5VGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXMoKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzdW1tYXJ5VGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdW1tYXJ5VGVtcGxhdGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHN1bW1hcnkgdGVtcGxhdGUuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxuZy10ZW1wbGF0ZSAjc3VtbWFyeVRlbXBsYXRlIGlneFN1bW1hcnkgbGV0LXN1bW1hcnlSZXN1bHRzPlxuICAgICAqICAgIDxwPnt7IHN1bW1hcnlSZXN1bHRzWzBdLmxhYmVsIH19OiB7eyBzdW1tYXJ5UmVzdWx0c1swXS5zdW1tYXJ5UmVzdWx0IH19PC9wPlxuICAgICAqICAgIDxwPnt7IHN1bW1hcnlSZXN1bHRzWzFdLmxhYmVsIH19OiB7eyBzdW1tYXJ5UmVzdWx0c1sxXS5zdW1tYXJ5UmVzdWx0IH19PC9wPlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCInc3VtbWFyeVRlbXBsYXRlJ1wiLCB7cmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICAgKiBwdWJsaWMgc3VtbWFyeVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgICAqIHRoaXMuY29sdW1uLnN1bW1hcnlUZW1wbGF0ZSA9IHRoaXMuc3VtbWFyeVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgc3VtbWFyeVRlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX3N1bW1hcnlUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBgYm9keVRlbXBsYXRlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGJvZHlUZW1wbGF0ZSA9IHRoaXMuY29sdW1uLmJvZHlUZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KCdjZWxsVGVtcGxhdGUnKVxuICAgIHB1YmxpYyBnZXQgYm9keVRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYm9keVRlbXBsYXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBib2R5IHRlbXBsYXRlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8bmctdGVtcGxhdGUgI2JvZHlUZW1wbGF0ZSBpZ3hDZWxsIGxldC12YWw+XG4gICAgICogICAgPGRpdiBzdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogeWVsbG93Z3JlZW5cIiAoY2xpY2spID0gXCJjaGFuZ2VDb2xvcih2YWwpXCI+XG4gICAgICogICAgICAgPHNwYW4+IHt7dmFsfX0gPC9zcGFuPlxuICAgICAqICAgIDwvZGl2PlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCInYm9keVRlbXBsYXRlJ1wiLCB7cmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICAgKiBwdWJsaWMgYm9keVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgICAqIHRoaXMuY29sdW1uLmJvZHlUZW1wbGF0ZSA9IHRoaXMuYm9keVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgYm9keVRlbXBsYXRlKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBoZWFkZXIgdGVtcGxhdGUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBoZWFkZXJUZW1wbGF0ZSA9IHRoaXMuY29sdW1uLmhlYWRlclRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaGVhZGVyVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXJUZW1wbGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgaGVhZGVyIHRlbXBsYXRlLlxuICAgICAqIE5vdGUgdGhhdCB0aGUgY29sdW1uIGhlYWRlciBoZWlnaHQgaXMgZml4ZWQgYW5kIGFueSBjb250ZW50IGJpZ2dlciB0aGFuIGl0IHdpbGwgYmUgY3V0IG9mZi5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlICNoZWFkZXJUZW1wbGF0ZT5cbiAgICAgKiAgIDxkaXYgc3R5bGUgPSBcImJhY2tncm91bmQtY29sb3I6YmxhY2tcIiAoY2xpY2spID0gXCJjaGFuZ2VDb2xvcih2YWwpXCI+XG4gICAgICogICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjpyZWRcIiA+e3tjb2x1bW4uZmllbGR9fTwvc3Bhbj5cbiAgICAgKiAgIDwvZGl2PlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCInaGVhZGVyVGVtcGxhdGUnXCIsIHtyZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgICAqIHB1YmxpYyBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAgKiB0aGlzLmNvbHVtbi5oZWFkZXJUZW1wbGF0ZSA9IHRoaXMuaGVhZGVyVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCBoZWFkZXJUZW1wbGF0ZSh0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge1xuICAgICAgICB0aGlzLl9oZWFkZXJUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBpbmxpbmUgZWRpdG9yIHRlbXBsYXRlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaW5saW5lRWRpdG9yVGVtcGxhdGUgPSB0aGlzLmNvbHVtbi5pbmxpbmVFZGl0b3JUZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBAbm90aWZ5Q2hhbmdlcygpXG4gICAgQFdhdGNoQ29sdW1uQ2hhbmdlcygpXG4gICAgQElucHV0KCdjZWxsRWRpdG9yVGVtcGxhdGUnKVxuICAgIHB1YmxpYyBnZXQgaW5saW5lRWRpdG9yVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbmxpbmVFZGl0b3JUZW1wbGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgaW5saW5lIGVkaXRvciB0ZW1wbGF0ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlICNpbmxpbmVFZGl0b3JUZW1wbGF0ZSBpZ3hDZWxsRWRpdG9yIGxldC1jZWxsPVwiY2VsbFwiPlxuICAgICAqICAgICA8aW5wdXQgdHlwZT1cInN0cmluZ1wiIFsobmdNb2RlbCldPVwiY2VsbC52YWx1ZVwiLz5cbiAgICAgKiA8L25nLXRlbXBsYXRlPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiJ2lubGluZUVkaXRvclRlbXBsYXRlJ1wiLCB7cmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICAgKiBwdWJsaWMgaW5saW5lRWRpdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgICogdGhpcy5jb2x1bW4uaW5saW5lRWRpdG9yVGVtcGxhdGUgPSB0aGlzLmlubGluZUVkaXRvclRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgaW5saW5lRWRpdG9yVGVtcGxhdGUodGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHtcbiAgICAgICAgdGhpcy5faW5saW5lRWRpdG9yVGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgYGZpbHRlckNlbGxUZW1wbGF0ZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBmaWx0ZXJDZWxsVGVtcGxhdGUgPSB0aGlzLmNvbHVtbi5maWx0ZXJDZWxsVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXMoKVxuICAgIEBXYXRjaENvbHVtbkNoYW5nZXMoKVxuICAgIEBJbnB1dCgnZmlsdGVyQ2VsbFRlbXBsYXRlJylcbiAgICBwdWJsaWMgZ2V0IGZpbHRlckNlbGxUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbHRlckNlbGxUZW1wbGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgcXVpY2sgZmlsdGVyIHRlbXBsYXRlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8bmctdGVtcGxhdGUgI2ZpbHRlckNlbGxUZW1wbGF0ZSBJZ3hGaWx0ZXJDZWxsVGVtcGxhdGUgbGV0LWNvbHVtbj1cImNvbHVtblwiPlxuICAgICAqICAgIDxpbnB1dCAoaW5wdXQpPVwib25JbnB1dCgpXCI+XG4gICAgICogPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIidmaWx0ZXJDZWxsVGVtcGxhdGUnXCIsIHtyZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgICAqIHB1YmxpYyBmaWx0ZXJDZWxsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgICogdGhpcy5jb2x1bW4uZmlsdGVyQ2VsbFRlbXBsYXRlID0gdGhpcy5maWx0ZXJDZWxsVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCBmaWx0ZXJDZWxsVGVtcGxhdGUodGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHtcbiAgICAgICAgdGhpcy5fZmlsdGVyQ2VsbFRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY2VsbHMgb2YgdGhlIGNvbHVtbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtbkNlbGxzID0gdGhpcy5jb2x1bW4uY2VsbHM7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGNlbGxzKCk6IENlbGxUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmRhdGFWaWV3XG4gICAgICAgICAgICAubWFwKChyZWMsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdyaWQuaXNHcm91cEJ5UmVjb3JkKHJlYykgJiYgIXRoaXMuZ3JpZC5pc1N1bW1hcnlSb3cocmVjKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQucGFnaW5nTW9kZSA9PT0gMSAmJiB0aGlzLmdyaWQucGFnaW5hdG9yLnBhZ2UgIT09IDAgPyBpbmRleCA9IGluZGV4ICsgdGhpcy5ncmlkLnBhZ2luYXRvci5wZXJQYWdlICogdGhpcy5ncmlkLnBhZ2luYXRvci5wYWdlIDogaW5kZXggPSB0aGlzLmdyaWQuZGF0YVJvd0xpc3QuZmlyc3QuaW5kZXggKyBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IG5ldyBJZ3hHcmlkQ2VsbCh0aGlzLmdyaWQgYXMgYW55LCBpbmRleCwgdGhpcy5maWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZpbHRlcihjZWxsID0+IGNlbGwpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IF9jZWxscygpOiBDZWxsVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5yb3dMaXN0LmZpbHRlcigocm93KSA9PiByb3cgaW5zdGFuY2VvZiBJZ3hSb3dEaXJlY3RpdmUpXG4gICAgICAgICAgICAubWFwKChyb3cpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocm93Ll9jZWxscykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm93Ll9jZWxscy5maWx0ZXIoKGNlbGwpID0+IGNlbGwuY29sdW1uSW5kZXggPT09IHRoaXMuaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYiksIFtdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb2x1bW4gdmlzaWJsZSBpbmRleC5cbiAgICAgKiBJZiB0aGUgY29sdW1uIGlzIG5vdCB2aXNpYmxlLCByZXR1cm5zIGAtMWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCB2aXNpYmxlQ29sdW1uSW5kZXggPSAgdGhpcy5jb2x1bW4udmlzaWJsZUluZGV4O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdmlzaWJsZUluZGV4KCk6IG51bWJlciB7XG4gICAgICAgIGlmICghaXNOYU4odGhpcy5fdkluZGV4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1bnBpbm5lZENvbHVtbnMgPSB0aGlzLmdyaWQudW5waW5uZWRDb2x1bW5zLmZpbHRlcihjID0+ICFjLmNvbHVtbkdyb3VwKTtcbiAgICAgICAgY29uc3QgcGlubmVkQ29sdW1ucyA9IHRoaXMuZ3JpZC5waW5uZWRDb2x1bW5zLmZpbHRlcihjID0+ICFjLmNvbHVtbkdyb3VwKTtcbiAgICAgICAgbGV0IGNvbCA9IHRoaXM7XG4gICAgICAgIGxldCB2SW5kZXggPSAtMTtcblxuICAgICAgICBpZiAodGhpcy5jb2x1bW5Hcm91cCkge1xuICAgICAgICAgICAgY29sID0gdGhpcy5hbGxDaGlsZHJlbi5maWx0ZXIoYyA9PiAhYy5jb2x1bW5Hcm91cCAmJiAhYy5oaWRkZW4pWzBdIGFzIGFueTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb2x1bW5MYXlvdXRDaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmNoaWxkcmVuVmlzaWJsZUluZGV4ZXMuZmluZCh4ID0+IHguY29sdW1uID09PSB0aGlzKS5pbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5waW5uZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4SW5Db2xsZWN0aW9uID0gdW5waW5uZWRDb2x1bW5zLmluZGV4T2YoY29sKTtcbiAgICAgICAgICAgIHZJbmRleCA9IGluZGV4SW5Db2xsZWN0aW9uID09PSAtMSA/XG4gICAgICAgICAgICAgICAgLTEgOlxuICAgICAgICAgICAgICAgICh0aGlzLmdyaWQuaXNQaW5uaW5nVG9TdGFydCA/XG4gICAgICAgICAgICAgICAgICAgIHBpbm5lZENvbHVtbnMubGVuZ3RoICsgaW5kZXhJbkNvbGxlY3Rpb24gOlxuICAgICAgICAgICAgICAgICAgICBpbmRleEluQ29sbGVjdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleEluQ29sbGVjdGlvbiA9IHBpbm5lZENvbHVtbnMuaW5kZXhPZihjb2wpO1xuICAgICAgICAgICAgdkluZGV4ID0gdGhpcy5ncmlkLmlzUGlubmluZ1RvU3RhcnQgP1xuICAgICAgICAgICAgICAgIGluZGV4SW5Db2xsZWN0aW9uIDpcbiAgICAgICAgICAgICAgICB1bnBpbm5lZENvbHVtbnMubGVuZ3RoICsgaW5kZXhJbkNvbGxlY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdkluZGV4ID0gdkluZGV4O1xuICAgICAgICByZXR1cm4gdkluZGV4O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBjb2x1bW4gaXMgYSBgQ29sdW1uR3JvdXBgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY29sdW1uR3JvdXAgPSAgdGhpcy5jb2x1bW4uY29sdW1uR3JvdXA7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBjb2x1bW5Hcm91cCgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBjb2x1bW4gaXMgYSBgQ29sdW1uTGF5b3V0YCBmb3IgbXVsdGktcm93IGxheW91dC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtbkdyb3VwID0gIHRoaXMuY29sdW1uLmNvbHVtbkdyb3VwO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29sdW1uTGF5b3V0KCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgY29sdW1uIGlzIGEgY2hpbGQgb2YgYSBgQ29sdW1uTGF5b3V0YCBmb3IgbXVsdGktcm93IGxheW91dC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNvbHVtbkxheW91dENoaWxkID0gIHRoaXMuY29sdW1uLmNvbHVtbkxheW91dENoaWxkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29sdW1uTGF5b3V0Q2hpbGQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5jb2x1bW5MYXlvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY2hpbGRyZW4gY29sdW1ucyBjb2xsZWN0aW9uLlxuICAgICAqIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgdGhlIGNvbHVtbiBkb2VzIG5vdCBjb250YWluIGNoaWxkcmVuIGNvbHVtbnMuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjaGlsZHJlbkNvbHVtbnMgPSAgdGhpcy5jb2x1bW4uYWxsQ2hpbGRyZW47XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBhbGxDaGlsZHJlbigpOiBJZ3hDb2x1bW5Db21wb25lbnRbXSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGV2ZWwgb2YgdGhlIGNvbHVtbiBpbiBhIGNvbHVtbiBncm91cC5cbiAgICAgKiBSZXR1cm5zIGAwYCBpZiB0aGUgY29sdW1uIGRvZXNuJ3QgaGF2ZSBhIGBwYXJlbnRgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY29sdW1uTGV2ZWwgPSAgdGhpcy5jb2x1bW4ubGV2ZWw7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBsZXZlbCgpIHtcbiAgICAgICAgbGV0IHB0ciA9IHRoaXMucGFyZW50O1xuICAgICAgICBsZXQgbHZsID0gMDtcblxuICAgICAgICB3aGlsZSAocHRyKSB7XG4gICAgICAgICAgICBsdmwrKztcbiAgICAgICAgICAgIHB0ciA9IHB0ci5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGx2bDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGlzTGFzdFBpbm5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5pc1Bpbm5pbmdUb1N0YXJ0ICYmXG4gICAgICAgICAgICB0aGlzLmdyaWQucGlubmVkQ29sdW1uc1t0aGlzLmdyaWQucGlubmVkQ29sdW1ucy5sZW5ndGggLSAxXSA9PT0gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGlzRmlyc3RQaW5uZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHBpbm5lZENvbHMgPSB0aGlzLmdyaWQucGlubmVkQ29sdW1ucy5maWx0ZXIoeCA9PiAheC5jb2x1bW5Hcm91cCk7XG4gICAgICAgIHJldHVybiAhdGhpcy5ncmlkLmlzUGlubmluZ1RvU3RhcnQgJiYgcGlubmVkQ29sc1swXSA9PT0gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHJpZ2h0UGlubmVkT2Zmc2V0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpbm5lZCAmJiAhdGhpcy5ncmlkLmlzUGlubmluZ1RvU3RhcnQgP1xuICAgICAgICAgICAgLSB0aGlzLmdyaWQucGlubmVkV2lkdGggLSB0aGlzLmdyaWQuaGVhZGVyRmVhdHVyZXNXaWR0aCArICdweCcgOlxuICAgICAgICAgICAgbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGdyaWRSb3dTcGFuKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd0VuZCAmJiB0aGlzLnJvd1N0YXJ0ID8gdGhpcy5yb3dFbmQgLSB0aGlzLnJvd1N0YXJ0IDogMTtcbiAgICB9XG4gICAgcHVibGljIGdldCBncmlkQ29sdW1uU3BhbigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xFbmQgJiYgdGhpcy5jb2xTdGFydCA/IHRoaXMuY29sRW5kIC0gdGhpcy5jb2xTdGFydCA6IDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNvbHVtbiB3aWxsIGJlIHZpc2libGUgd2hlbiBpdHMgcGFyZW50IGlzIGNvbGxhcHNlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb2x1bW4tZ3JvdXA+XG4gICAgICogICA8aWd4LWNvbHVtbiBbdmlzaWJsZVdoZW5Db2xsYXBzZWRdPVwidHJ1ZVwiPjwvaWd4LWNvbHVtbj5cbiAgICAgKiA8L2lneC1jb2x1bW4tZ3JvdXA+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgQG5vdGlmeUNoYW5nZXModHJ1ZSlcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZVdoZW5Db2xsYXBzZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZVdoZW5Db2xsYXBzZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy52aXNpYmxlV2hlbkNvbGxhcHNlZENoYW5nZS5lbWl0KHRoaXMuX3Zpc2libGVXaGVuQ29sbGFwc2VkKTtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5zZXRFeHBhbmRDb2xsYXBzZVN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHZpc2libGVXaGVuQ29sbGFwc2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZVdoZW5Db2xsYXBzZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBQYXNzIG9wdGlvbmFsIHBhcmFtZXRlcnMgZm9yIERhdGVQaXBlIGFuZC9vciBEZWNpbWFsUGlwZSB0byBmb3JtYXQgdGhlIGRpc3BsYXkgdmFsdWUgZm9yIGRhdGUgYW5kIG51bWVyaWMgY29sdW1ucy5cbiAgICAgKiBBY2NlcHRzIGFuIGBJQ29sdW1uUGlwZUFyZ3NgIG9iamVjdCB3aXRoIGFueSBvZiB0aGUgYGZvcm1hdGAsIGB0aW1lem9uZWAgYW5kIGBkaWdpdHNJbmZvYCBwcm9wZXJ0aWVzLlxuICAgICAqIEZvciBtb3JlIGRldGFpbHMgc2VlIGh0dHBzOi8vYW5ndWxhci5pby9hcGkvY29tbW9uL0RhdGVQaXBlIGFuZCBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2NvbW1vbi9EZWNpbWFsUGlwZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHBpcGVBcmdzOiBJQ29sdW1uUGlwZUFyZ3MgPSB7XG4gICAgICogICAgICBmb3JtYXQ6ICdsb25nRGF0ZScsXG4gICAgICogICAgICB0aW1lem9uZTogJ1VUQycsXG4gICAgICogICAgICBkaWdpdHNJbmZvOiAnMS4xLTInXG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbHVtbiBkYXRhVHlwZT1cImRhdGVcIiBbcGlwZUFyZ3NdPVwicGlwZUFyZ3NcIj48L2lneC1jb2x1bW4+XG4gICAgICogPGlneC1jb2x1bW4gZGF0YVR5cGU9XCJudW1iZXJcIiBbcGlwZUFyZ3NdPVwicGlwZUFyZ3NcIj48L2lneC1jb2x1bW4+XG4gICAgICogYGBgXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIEBub3RpZnlDaGFuZ2VzKClcbiAgICBAV2F0Y2hDb2x1bW5DaGFuZ2VzKClcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgcGlwZUFyZ3ModmFsdWU6IElDb2x1bW5QaXBlQXJncykge1xuICAgICAgICB0aGlzLl9jb2x1bW5QaXBlQXJncyA9IE9iamVjdC5hc3NpZ24odGhpcy5fY29sdW1uUGlwZUFyZ3MsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5ncmlkLnN1bW1hcnlTZXJ2aWNlLmNsZWFyU3VtbWFyeUNhY2hlKCk7XG4gICAgICAgIHRoaXMuZ3JpZC5waXBlVHJpZ2dlcisrO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHBpcGVBcmdzKCk6IElDb2x1bW5QaXBlQXJncyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2x1bW5QaXBlQXJncztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBjb2xsYXBzaWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGNvbGxhcHNpYmxlKF92YWx1ZTogYm9vbGVhbikgeyB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBleHBhbmRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgZXhwYW5kZWQoX3ZhbHVlOiBib29sZWFuKSB7IH1cblxuICAgIC8qKlxuICAgICAqIGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZhdWx0V2lkdGg6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB3aWR0aFNldEJ5VXNlcjogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzTmVzdGVkUGF0aDogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmYXVsdFRpbWVGb3JtYXQgPSAnaGg6bW06c3MgdHQnO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZhdWx0RGF0ZVRpbWVGb3JtYXQgPSAnZGQvTU0veXl5eSBISDptbTpzcyB0dCc7XG5cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSBvZiB0aGUgY29sdW1uLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdHJlZSA9ICB0aGlzLmNvbHVtbi5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBmaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUoKTogRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZmluZCh0aGlzLmZpZWxkKSBhcyBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgcGFyZW50IGNvbHVtbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHBhcmVudENvbHVtbiA9IHRoaXMuY29sdW1uLnBhcmVudDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb2x1bW4ucGFyZW50ID0gaGlnaGVyTGV2ZWxDb2x1bW47XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHBhcmVudCA9IG51bGw7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBjaGlsZHJlbiBjb2x1bW5zLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY29sdW1uQ2hpbGRyZW4gPSB0aGlzLmNvbHVtbi5jaGlsZHJlbjtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb2x1bW4uY2hpbGRyZW4gPSBjaGlsZHJlbkNvbHVtbnM7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGNoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4Q29sdW1uQ29tcG9uZW50PjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfYXBwbHlTZWxlY3RhYmxlQ2xhc3MgPSBmYWxzZTtcblxuICAgIHByb3RlY3RlZCBfdkluZGV4ID0gTmFOO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX3Bpbm5lZCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2JvZHlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9oZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9zdW1tYXJ5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfaW5saW5lRWRpdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZmlsdGVyQ2VsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX3N1bW1hcmllcyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZmlsdGVycyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfc29ydFN0cmF0ZWd5OiBJU29ydGluZ1N0cmF0ZWd5ID0gRGVmYXVsdFNvcnRpbmdTdHJhdGVneS5pbnN0YW5jZSgpO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2dyb3VwaW5nQ29tcGFyZXI6IChhOiBhbnksIGI6IGFueSkgPT4gbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2hpZGRlbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2luZGV4OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfZGlzYWJsZVBpbm5pbmcgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF93aWR0aDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2RlZmF1bHRNaW5XaWR0aCA9ICcnO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2hhc1N1bW1hcnkgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9lZGl0YWJsZTogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiAgQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfdmlzaWJsZVdoZW5Db2xsYXBzZWQ7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfY29sbGFwc2libGUgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9leHBhbmRlZCA9IHRydWU7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfc2VsZWN0YWJsZSA9IHRydWU7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXQgaXNQcmltYXJ5Q29sdW1uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZ3JpZCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZmllbGQgPT09IHRoaXMuZ3JpZC5wcmltYXJ5S2V5O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2ZpZWxkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfY2FsY1dpZHRoID0gbnVsbDtcbiAgICBwcml2YXRlIF9jb2x1bW5QaXBlQXJnczogSUNvbHVtblBpcGVBcmdzID0geyBkaWdpdHNJbmZvOiBERUZBVUxUX0RJR0lUU19JTkZPIH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9CQVNFKSBwdWJsaWMgZ3JpZDogR3JpZFR5cGUsXG4gICAgICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCxcbiAgICApIHsgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldENhY2hlcygpIHtcbiAgICAgICAgdGhpcy5fdkluZGV4ID0gTmFOO1xuICAgICAgICBpZiAodGhpcy5ncmlkKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlQ2FsY1dpZHRoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnN1bW1hcnlUZW1wbGF0ZURpcmVjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3VtbWFyeVRlbXBsYXRlID0gdGhpcy5zdW1tYXJ5VGVtcGxhdGVEaXJlY3RpdmUudGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2VsbFRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5VGVtcGxhdGUgPSB0aGlzLmNlbGxUZW1wbGF0ZS50ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oZWFkVGVtcGxhdGUgJiYgdGhpcy5oZWFkVGVtcGxhdGUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJUZW1wbGF0ZSA9IHRoaXMuaGVhZFRlbXBsYXRlLnRvQXJyYXkoKVswXS50ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lZGl0b3JUZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5faW5saW5lRWRpdG9yVGVtcGxhdGUgPSB0aGlzLmVkaXRvclRlbXBsYXRlLnRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbHRlckNlbGxUZW1wbGF0ZURpcmVjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5fZmlsdGVyQ2VsbFRlbXBsYXRlID0gdGhpcy5maWx0ZXJDZWxsVGVtcGxhdGVEaXJlY3RpdmUudGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9jb2x1bW5QaXBlQXJncy5mb3JtYXQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtblBpcGVBcmdzLmZvcm1hdCA9IHRoaXMuZGF0YVR5cGUgPT09IEdyaWRDb2x1bW5EYXRhVHlwZS5UaW1lID9cbiAgICAgICAgICAgICAgICBERUZBVUxUX1RJTUVfRk9STUFUIDogdGhpcy5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLkRhdGVUaW1lID9cbiAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9EQVRFX1RJTUVfRk9STUFUIDogREVGQVVMVF9EQVRFX0ZPUk1BVDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuc3VtbWFyaWVzKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRDb2x1bW5EYXRhVHlwZS5TdHJpbmc6XG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuQm9vbGVhbjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdW1tYXJpZXMgPSBJZ3hTdW1tYXJ5T3BlcmFuZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuTnVtYmVyOlxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkN1cnJlbmN5OlxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLlBlcmNlbnQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyaWVzID0gSWd4TnVtYmVyU3VtbWFyeU9wZXJhbmQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkRhdGU6XG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuRGF0ZVRpbWU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VtbWFyaWVzID0gSWd4RGF0ZVN1bW1hcnlPcGVyYW5kO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRDb2x1bW5EYXRhVHlwZS5UaW1lOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1bW1hcmllcyA9IElneFRpbWVTdW1tYXJ5T3BlcmFuZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdW1tYXJpZXMgPSBJZ3hTdW1tYXJ5T3BlcmFuZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZpbHRlcnMpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkJvb2xlYW46XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVycyA9IElneEJvb2xlYW5GaWx0ZXJpbmdPcGVyYW5kLmluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLk51bWJlcjpcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRDb2x1bW5EYXRhVHlwZS5DdXJyZW5jeTpcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRDb2x1bW5EYXRhVHlwZS5QZXJjZW50OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcnMgPSBJZ3hOdW1iZXJGaWx0ZXJpbmdPcGVyYW5kLmluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkRhdGU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVycyA9IElneERhdGVGaWx0ZXJpbmdPcGVyYW5kLmluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLlRpbWU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVycyA9IElneFRpbWVGaWx0ZXJpbmdPcGVyYW5kLmluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkRhdGVUaW1lOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcnMgPSBJZ3hEYXRlVGltZUZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuU3RyaW5nOlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVycyA9IElneFN0cmluZ0ZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldEdyaWRUZW1wbGF0ZShpc1JvdzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgIGlmIChpc1Jvdykge1xuICAgICAgICAgICAgY29uc3Qgcm93c0NvdW50ID0gIXRoaXMuZ3JpZC5pc1Bpdm90ID8gdGhpcy5ncmlkLm11bHRpUm93TGF5b3V0Um93U2l6ZSA6IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIHJldHVybiBgcmVwZWF0KCR7cm93c0NvdW50fSwxZnIpYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENvbHVtblNpemVzU3RyaW5nKHRoaXMuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldEluaXRpYWxDaGlsZENvbHVtblNpemVzKGNoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4Q29sdW1uQ29tcG9uZW50Pik6IEFycmF5PE1STENvbHVtblNpemVJbmZvPiB7XG4gICAgICAgIGNvbnN0IGNvbHVtblNpemVzOiBNUkxDb2x1bW5TaXplSW5mb1tdID0gW107XG4gICAgICAgIC8vIGZpbmQgdGhlIHNtYWxsZXN0IGNvbCBzcGFuc1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNvbC5jb2xTdGFydCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld1dpZHRoU2V0ID0gY29sLndpZHRoU2V0QnlVc2VyICYmIGNvbHVtblNpemVzW2NvbC5jb2xTdGFydCAtIDFdICYmICFjb2x1bW5TaXplc1tjb2wuY29sU3RhcnQgLSAxXS53aWR0aFNldEJ5VXNlcjtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NwYW5TbWFsbGVyID0gY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV0gJiYgY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV0uY29sU3BhbiA+IGNvbC5ncmlkQ29sdW1uU3BhbjtcbiAgICAgICAgICAgIGNvbnN0IGJvdGhXaWR0aHNTZXQgPSBjb2wud2lkdGhTZXRCeVVzZXIgJiYgY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV0gJiYgY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV0ud2lkdGhTZXRCeVVzZXI7XG4gICAgICAgICAgICBjb25zdCBib3RoV2lkdGhzTm90U2V0ID0gIWNvbC53aWR0aFNldEJ5VXNlciAmJiBjb2x1bW5TaXplc1tjb2wuY29sU3RhcnQgLSAxXSAmJiAhY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV0ud2lkdGhTZXRCeVVzZXI7XG5cbiAgICAgICAgICAgIGlmIChjb2x1bW5TaXplc1tjb2wuY29sU3RhcnQgLSAxXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbm90aGluZyBpcyBkZWZpbmVkIHlldCB0YWtlIGFueSBjb2x1bW4gYXQgZmlyc3RcbiAgICAgICAgICAgICAgICAvLyBXZSB1c2UgY29sRW5kIHRvIGtub3cgd2hlcmUgdGhlIGNvbHVtbiBhY3R1YWxseSBlbmRzLCBiZWNhdXNlIG5vdCBhbHdheXMgaXQgc3RhcnRzIHdoZXJlIHdlIGhhdmUgaXQgc2V0IGluIGNvbHVtblNpemVzLlxuICAgICAgICAgICAgICAgIGNvbHVtblNpemVzW2NvbC5jb2xTdGFydCAtIDFdID0ge1xuICAgICAgICAgICAgICAgICAgICByZWY6IGNvbCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbC53aWR0aFNldEJ5VXNlciB8fCB0aGlzLmdyaWQuY29sdW1uV2lkdGhTZXRCeVVzZXIgPyBwYXJzZUludChjb2wuY2FsY1dpZHRoLCAxMCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBjb2xTcGFuOiBjb2wuZ3JpZENvbHVtblNwYW4sXG4gICAgICAgICAgICAgICAgICAgIGNvbEVuZDogY29sLmNvbFN0YXJ0ICsgY29sLmdyaWRDb2x1bW5TcGFuLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aFNldEJ5VXNlcjogY29sLndpZHRoU2V0QnlVc2VyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3V2lkdGhTZXQgfHwgKG5ld1NwYW5TbWFsbGVyICYmICgoYm90aFdpZHRoc1NldCkgfHwgKGJvdGhXaWR0aHNOb3RTZXQpKSkpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBhIGNvbHVtbiBpcyBzZXQgYWxyZWFkeSBpdCBzaG91bGQgZWl0aGVyIG5vdCBoYXZlIHdpZHRoIGRlZmluZWQgb3IgaGF2ZSB3aWR0aCB3aXRoIGJpZ2dlciBzcGFuIHRoYW4gdGhlIG5ldyBvbmUuXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiAgSWYgcmVwbGFjZWQgY29sdW1uIGhhcyBiaWdnZXIgc3Bhbiwgd2Ugd2FudCB0byBmaWxsIHRoZSByZW1haW5pbmcgY29sdW1uc1xuICAgICAgICAgICAgICAgICAqICB0aGF0IHRoZSByZXBsYWNpbmcgY29sdW1uIGRvZXMgbm90IGZpbGwgd2l0aCB0aGUgb2xkIG9uZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoYm90aFdpZHRoc1NldCAmJiBuZXdTcGFuU21hbGxlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdGFydCBmcm9tIHdoZXJlIHRoZSBuZXcgY29sdW1uIHNldCB3b3VsZCBlbmQgYW5kIGFwcGx5IHRoZSBvbGQgY29sdW1uIHRvIHRoZSByZXN0IGRlcGVuZGluZyBvbiBob3cgbXVjaCBpdCBzcGFucy5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBub3QgeWV0IHJlcGxhY2VkIGl0IHNvIHdlIGNhbiB1c2UgaXQgZGlyZWN0bHkgZnJvbSB0aGUgY29sdW1uU2l6ZXMgY29sbGVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyB3aGVyZSBjb2xFbmQgaXMgdXNlZCBiZWNhdXNlIHRoZSBjb2xTdGFydCBvZiB0aGUgb2xkIGNvbHVtbiBpcyBub3QgYWN0dWFsbHkgaSArIDEuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBjb2wuY29sU3RhcnQgLSAxICsgY29sLmdyaWRDb2x1bW5TcGFuOyBpIDwgY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV0uY29sRW5kIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbHVtblNpemVzW2ldIHx8ICFjb2x1bW5TaXplc1tpXS53aWR0aFNldEJ5VXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNpemVzW2ldID0gY29sdW1uU2l6ZXNbY29sLmNvbFN0YXJ0IC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgb2xkIGNvbHVtbiB3aXRoIHRoZSBuZXcgb25lLlxuICAgICAgICAgICAgICAgIGNvbHVtblNpemVzW2NvbC5jb2xTdGFydCAtIDFdID0ge1xuICAgICAgICAgICAgICAgICAgICByZWY6IGNvbCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNvbC53aWR0aFNldEJ5VXNlciB8fCB0aGlzLmdyaWQuY29sdW1uV2lkdGhTZXRCeVVzZXIgPyBwYXJzZUludChjb2wuY2FsY1dpZHRoLCAxMCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBjb2xTcGFuOiBjb2wuZ3JpZENvbHVtblNwYW4sXG4gICAgICAgICAgICAgICAgICAgIGNvbEVuZDogY29sLmNvbFN0YXJ0ICsgY29sLmdyaWRDb2x1bW5TcGFuLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aFNldEJ5VXNlcjogY29sLndpZHRoU2V0QnlVc2VyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYm90aFdpZHRoc1NldCAmJiBjb2x1bW5TaXplc1tjb2wuY29sU3RhcnQgLSAxXS5jb2xTcGFuIDwgY29sLmdyaWRDb2x1bW5TcGFuKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGNvbHVtbiBhbHJlYWR5IGluIHRoZSBjb2x1bW5TaXplcyBoYXMgc21hbGxlciBzcGFuLCB3ZSBzdGlsbCBuZWVkIHRvIGZpbGwgYW55IGVtcHR5IHBsYWNlcyB3aXRoIHRoZSBjdXJyZW50IGNvbC5cbiAgICAgICAgICAgICAgICAvLyBTdGFydCBmcm9tIHdoZXJlIHRoZSBzbWFsbGVyIGNvbHVtbiBzZXQgd291bGQgZW5kIGFuZCBhcHBseSB0aGUgYmlnZ2VyIGNvbHVtbiB0byB0aGUgcmVzdCBkZXBlbmRpbmcgb24gaG93IG11Y2ggaXQgc3BhbnMuXG4gICAgICAgICAgICAgICAgLy8gU2luY2UgaGVyZSB3ZSBkbyBub3QgaGF2ZSBpdCBpbiBjb2x1bW5TaXplcyB3ZSBzZXQgaXQgYXMgYSBuZXcgY29sdW1uIGtlZXBpbmcgdGhlIHNhbWUgY29sU3Bhbi5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gY29sLmNvbFN0YXJ0IC0gMSArIGNvbHVtblNpemVzW2NvbC5jb2xTdGFydCAtIDFdLmNvbFNwYW47IGkgPCBjb2wuY29sU3RhcnQgLSAxICsgY29sLmdyaWRDb2x1bW5TcGFuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5TaXplc1tpXSB8fCAhY29sdW1uU2l6ZXNbaV0ud2lkdGhTZXRCeVVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNpemVzW2ldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZjogY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjb2wud2lkdGhTZXRCeVVzZXIgfHwgdGhpcy5ncmlkLmNvbHVtbldpZHRoU2V0QnlVc2VyID8gcGFyc2VJbnQoY29sLmNhbGNXaWR0aCwgMTApIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xTcGFuOiBjb2wuZ3JpZENvbHVtblNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sRW5kOiBjb2wuY29sU3RhcnQgKyBjb2wuZ3JpZENvbHVtblNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGhTZXRCeVVzZXI6IGNvbC53aWR0aFNldEJ5VXNlclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGbGF0dGVuIGNvbHVtblNpemVzIHNvIHRoZXJlIGFyZSBub3QgY29sdW1ucyB3aXRoIGNvbFNwYW4gPiAxXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1uU2l6ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5TaXplc1tpXSAmJiBjb2x1bW5TaXplc1tpXS5jb2xTcGFuID4gMSkge1xuICAgICAgICAgICAgICAgIGxldCBqID0gMTtcblxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgYWxsIGVtcHR5IHBsYWNlcyBkZXBlbmRpbmcgb24gaG93IG11Y2ggdGhlIGN1cnJlbnQgY29sdW1uIHNwYW5zIHN0YXJ0aW5nIGZyb20gbmV4dCBjb2wuXG4gICAgICAgICAgICAgICAgZm9yICg7IGogPCBjb2x1bW5TaXplc1tpXS5jb2xTcGFuICYmIGkgKyBqICsgMSA8IGNvbHVtblNpemVzW2ldLmNvbEVuZDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5TaXplc1tpICsgal0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICgoIWNvbHVtblNpemVzW2ldLndpZHRoICYmIGNvbHVtblNpemVzW2kgKyBqXS53aWR0aCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIWNvbHVtblNpemVzW2ldLndpZHRoICYmICFjb2x1bW5TaXplc1tpICsgal0ud2lkdGggJiYgY29sdW1uU2l6ZXNbaSArIGpdLmNvbFNwYW4gPD0gY29sdW1uU2l6ZXNbaV0uY29sU3BhbikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoISFjb2x1bW5TaXplc1tpICsgal0ud2lkdGggJiYgY29sdW1uU2l6ZXNbaSArIGpdLmNvbFNwYW4gPD0gY29sdW1uU2l6ZXNbaV0uY29sU3BhbikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSByZWFjaCBhbiBhbHJlYWR5IGRlZmluZWQgY29sdW1uIHRoYXQgaGFzIHdpZHRoIGFuZCB0aGUgY3VycmVudCBkb2Vzbid0IGhhdmUgb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByZWFjaGVkIGNvbHVtbiBoYXMgYmlnZ2VyIGNvbFNwYW4gd2Ugc3RvcC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBjb2x1bW5TaXplc1tpXS53aWR0aFNldEJ5VXNlciA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2l6ZXNbaV0ud2lkdGggLyBjb2x1bW5TaXplc1tpXS5jb2xTcGFuIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TaXplc1tpXS53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNpemVzW2kgKyBqXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWY6IGNvbHVtblNpemVzW2ldLnJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xTcGFuOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbEVuZDogY29sdW1uU2l6ZXNbaV0uY29sRW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoU2V0QnlVc2VyOiBjb2x1bW5TaXplc1tpXS53aWR0aFNldEJ5VXNlclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgY3VycmVudCBjb2x1bW4gd2lkdGggc28gaXQgaXMgZGl2aWRlZCBiZXR3ZWVuIGFsbCBjb2x1bW5zIGl0IHNwYW5zIGFuZCBzZXQgaXQgdG8gMS5cbiAgICAgICAgICAgICAgICBjb2x1bW5TaXplc1tpXS53aWR0aCA9IGNvbHVtblNpemVzW2ldLndpZHRoU2V0QnlVc2VyID9cbiAgICAgICAgICAgICAgICAgICAgY29sdW1uU2l6ZXNbaV0ud2lkdGggLyBjb2x1bW5TaXplc1tpXS5jb2xTcGFuIDpcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uU2l6ZXNbaV0ud2lkdGg7XG4gICAgICAgICAgICAgICAgY29sdW1uU2l6ZXNbaV0uY29sU3BhbiA9IDE7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGluZGV4IGJhc2VkIG9uIGhvdyBtdWNoIHdlIGhhdmUgcmVwbGFjZWQuIFN1YnRyYWN0IDEgYmVjYXVzZSB3ZSBzdGFydGVkIGZyb20gMS5cbiAgICAgICAgICAgICAgICBpICs9IGogLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbHVtblNpemVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGaWxsZWRDaGlsZENvbHVtblNpemVzKGNoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4Q29sdW1uQ29tcG9uZW50Pik6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBjb25zdCBjb2x1bW5TaXplcyA9IHRoaXMuZ2V0SW5pdGlhbENoaWxkQ29sdW1uU2l6ZXMoY2hpbGRyZW4pO1xuXG4gICAgICAgIC8vIGZpbGwgdGhlIGdhcHMgaWYgdGhlcmUgYXJlIGFueVxuICAgICAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgc2l6ZSBvZiBjb2x1bW5TaXplcykge1xuICAgICAgICAgICAgaWYgKHNpemUgJiYgISFzaXplLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc2l6ZS53aWR0aCArICdweCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludCh0aGlzLmdyaWQuZ2V0UG9zc2libGVDb2x1bW5XaWR0aCgpLCAxMCkgKyAncHgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSZXNpemFibGVDb2xVbmRlckVuZCgpOiBNUkxSZXNpemVDb2x1bW5JbmZvW10ge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW5MYXlvdXQgfHwgIXRoaXMuY29sdW1uTGF5b3V0Q2hpbGQgfHwgdGhpcy5jb2x1bW5Hcm91cCkge1xuICAgICAgICAgICAgcmV0dXJuIFt7IHRhcmdldDogdGhpcywgc3BhblVzZWQ6IDEgfV07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb2x1bW5TaXplZCA9IHRoaXMuZ2V0SW5pdGlhbENoaWxkQ29sdW1uU2l6ZXModGhpcy5wYXJlbnQuY2hpbGRyZW4pO1xuICAgICAgICBjb25zdCB0YXJnZXRzOiBNUkxSZXNpemVDb2x1bW5JbmZvW10gPSBbXTtcbiAgICAgICAgY29uc3QgY29sRW5kID0gdGhpcy5jb2xFbmQgPyB0aGlzLmNvbEVuZCA6IHRoaXMuY29sU3RhcnQgKyAxO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1uU2l6ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbFN0YXJ0IDw9IGkgKyAxICYmIGkgKyAxIDwgY29sRW5kKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0cy5wdXNoKHsgdGFyZ2V0OiBjb2x1bW5TaXplZFtpXS5yZWYsIHNwYW5Vc2VkOiAxIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0c1NxdWFzaGVkOiBNUkxSZXNpemVDb2x1bW5JbmZvW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgdGFyZ2V0cykge1xuICAgICAgICAgICAgaWYgKHRhcmdldHNTcXVhc2hlZC5sZW5ndGggJiYgdGFyZ2V0c1NxdWFzaGVkW3RhcmdldHNTcXVhc2hlZC5sZW5ndGggLSAxXS50YXJnZXQuZmllbGQgPT09IHRhcmdldC50YXJnZXQuZmllbGQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRzU3F1YXNoZWRbdGFyZ2V0c1NxdWFzaGVkLmxlbmd0aCAtIDFdLnNwYW5Vc2VkKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldHNTcXVhc2hlZC5wdXNoKHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0c1NxdWFzaGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpbnMgdGhlIGNvbHVtbiBhdCB0aGUgcHJvdmlkZWQgaW5kZXggaW4gdGhlIHBpbm5lZCBhcmVhLlxuICAgICAqIERlZmF1bHRzIHRvIGluZGV4IGAwYCBpZiBub3QgcHJvdmlkZWQsIG9yIHRvIHRoZSBpbml0aWFsIGluZGV4IGluIHRoZSBwaW5uZWQgYXJlYS5cbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgY29sdW1uIGlzIHN1Y2Nlc3NmdWxseSBwaW5uZWQuIFJldHVybnMgYGZhbHNlYCBpZiB0aGUgY29sdW1uIGNhbm5vdCBiZSBwaW5uZWQuXG4gICAgICogQ29sdW1uIGNhbm5vdCBiZSBwaW5uZWQgaWY6XG4gICAgICogLSBJcyBhbHJlYWR5IHBpbm5lZFxuICAgICAqIC0gaW5kZXggYXJndW1lbnQgaXMgb3V0IG9mIHJhbmdlXG4gICAgICogLSBUaGUgcGlubmVkIGFyZWEgZXhjZWVkcyA4MCUgb2YgdGhlIGdyaWQgd2lkdGhcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHN1Y2Nlc3MgPSB0aGlzLmNvbHVtbi5waW4oKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgcGluKGluZGV4PzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIFRPRE86IFByb2JhYmx5IHNob3VsZCB0aGUgcmV0dXJuIHR5cGUgb2YgdGhlIG9sZCBmdW5jdGlvbnNcbiAgICAgICAgLy8gc2hvdWxkIGJlIG1vdmVkIGFzIGEgZXZlbnQgcGFyYW1ldGVyLlxuICAgICAgICBjb25zdCBncmlkID0gKHRoaXMuZ3JpZCBhcyBhbnkpO1xuICAgICAgICBpZiAodGhpcy5fcGlubmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LnBpbm5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9wTGV2ZWxQYXJlbnQucGluKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhc0luZGV4ID0gaW5kZXggIT09IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGhhc0luZGV4ICYmIChpbmRleCA8IDAgfHwgaW5kZXggPiBncmlkLnBpbm5lZENvbHVtbnMubGVuZ3RoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudCAmJiAhdGhpcy5waW5uYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm9vdFBpbm5lZENvbHMgPSBncmlkLl9waW5uZWRDb2x1bW5zLmZpbHRlcigoYykgPT4gYy5sZXZlbCA9PT0gMCk7XG4gICAgICAgIGluZGV4ID0gaGFzSW5kZXggPyBpbmRleCA6IHJvb3RQaW5uZWRDb2xzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgYXJnczogSVBpbkNvbHVtbkNhbmNlbGxhYmxlRXZlbnRBcmdzID0geyBjb2x1bW46IHRoaXMsIGluc2VydEF0SW5kZXg6IGluZGV4LCBpc1Bpbm5lZDogZmFsc2UsIGNhbmNlbDogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5ncmlkLmNvbHVtblBpbi5lbWl0KGFyZ3MpO1xuXG4gICAgICAgIGlmIChhcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLmVuZEVkaXQoZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuX3Bpbm5lZCA9IHRydWU7XG4gICAgICAgIHRoaXMucGlubmVkQ2hhbmdlLmVtaXQodGhpcy5fcGlubmVkKTtcbiAgICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhhdCBpbmRleCBpcyB0aGUgbGFzdCBwb3NpdGlvbiwgc28gd2lsbCBuZWVkIHRvIGZpbmQgdGFyZ2V0IGNvbHVtbiBieSBbaW5kZXgtMV1cbiAgICAgICAgY29uc3QgdGFyZ2V0Q29sdW1uID0gYXJncy5pbnNlcnRBdEluZGV4ID09PSBncmlkLl9waW5uZWRDb2x1bW5zLmxlbmd0aCA/XG4gICAgICAgICAgICBncmlkLl9waW5uZWRDb2x1bW5zW2FyZ3MuaW5zZXJ0QXRJbmRleCAtIDFdIDogZ3JpZC5fcGlubmVkQ29sdW1uc1thcmdzLmluc2VydEF0SW5kZXhdO1xuXG4gICAgICAgIGlmIChncmlkLl9waW5uZWRDb2x1bW5zLmluZGV4T2YodGhpcykgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoIWdyaWQuaGFzQ29sdW1uR3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgZ3JpZC5fcGlubmVkQ29sdW1ucy5zcGxpY2UoYXJncy5pbnNlcnRBdEluZGV4LCAwLCB0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGJhc2VkIG9ubHkgb24gcm9vdCBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgcm9vdFBpbm5lZENvbHMuc3BsaWNlKGFyZ3MuaW5zZXJ0QXRJbmRleCwgMCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgbGV0IGFsbFBpbm5lZCA9IFtdO1xuICAgICAgICAgICAgICAgIC8vIHJlLWNyZWF0ZSBoaWVyYXJjaHlcbiAgICAgICAgICAgICAgICByb290UGlubmVkQ29scy5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWxsUGlubmVkLnB1c2goZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBhbGxQaW5uZWQgPSBhbGxQaW5uZWQuY29uY2F0KGdyb3VwLmFsbENoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBncmlkLl9waW5uZWRDb2x1bW5zID0gYWxsUGlubmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZ3JpZC5fdW5waW5uZWRDb2x1bW5zLmluZGV4T2YodGhpcykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRyZW5Db3VudCA9IHRoaXMuYWxsQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGdyaWQuX3VucGlubmVkQ29sdW1ucy5zcGxpY2UoZ3JpZC5fdW5waW5uZWRDb2x1bW5zLmluZGV4T2YodGhpcyksIDEgKyBjaGlsZHJlbkNvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNJbmRleCkge1xuICAgICAgICAgICAgZ3JpZC5fbW92ZUNvbHVtbnModGhpcywgdGFyZ2V0Q29sdW1uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbHVtbkdyb3VwKSB7XG4gICAgICAgICAgICB0aGlzLmFsbENoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQucGluKCkpO1xuICAgICAgICAgICAgZ3JpZC5yZWluaXRQaW5TdGF0ZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyaWQucmVzZXRDYWNoZXMoKTtcbiAgICAgICAgZ3JpZC5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbkxheW91dENoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQuY29sdW1uTGlzdC5maWx0ZXIoeCA9PiB4LmNvbHVtbkxheW91dCkuZm9yRWFjaCh4ID0+IHgucG9wdWxhdGVWaXNpYmxlSW5kZXhlcygpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5yZWZyZXNoRXhwcmVzc2lvbnMoKTtcbiAgICAgICAgY29uc3QgZXZlbnRBcmdzOiBJUGluQ29sdW1uRXZlbnRBcmdzID0geyBjb2x1bW46IHRoaXMsIGluc2VydEF0SW5kZXg6IGluZGV4LCBpc1Bpbm5lZDogdHJ1ZSB9O1xuICAgICAgICB0aGlzLmdyaWQuY29sdW1uUGlubmVkLmVtaXQoZXZlbnRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVucGlucyB0aGUgY29sdW1uIGFuZCBwbGFjZSBpdCBhdCB0aGUgcHJvdmlkZWQgaW5kZXggaW4gdGhlIHVucGlubmVkIGFyZWEuXG4gICAgICogRGVmYXVsdHMgdG8gaW5kZXggYDBgIGlmIG5vdCBwcm92aWRlZCwgb3IgdG8gdGhlIGluaXRpYWwgaW5kZXggaW4gdGhlIHVucGlubmVkIGFyZWEuXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGNvbHVtbiBpcyBzdWNjZXNzZnVsbHkgdW5waW5uZWQuIFJldHVybnMgYGZhbHNlYCBpZiB0aGUgY29sdW1uIGNhbm5vdCBiZSB1bnBpbm5lZC5cbiAgICAgKiBDb2x1bW4gY2Fubm90IGJlIHVucGlubmVkIGlmOlxuICAgICAqIC0gSXMgYWxyZWFkeSB1bnBpbm5lZFxuICAgICAqIC0gaW5kZXggYXJndW1lbnQgaXMgb3V0IG9mIHJhbmdlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBzdWNjZXNzID0gdGhpcy5jb2x1bW4udW5waW4oKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdW5waW4oaW5kZXg/OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9ICh0aGlzLmdyaWQgYXMgYW55KTtcbiAgICAgICAgaWYgKCF0aGlzLl9waW5uZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5waW5uZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvcExldmVsUGFyZW50LnVucGluKGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoYXNJbmRleCA9IGluZGV4ICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChoYXNJbmRleCAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gZ3JpZC5fdW5waW5uZWRDb2x1bW5zLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVzdGltYXRlIHRoZSBleGFjdCBpbmRleCBhdCB3aGljaCBjb2x1bW4gd2lsbCBiZSBpbnNlcnRlZFxuICAgICAgICAvLyB0YWtlcyBpbnRvIGFjY291bnQgaW5pdGlhbCB1bnBpbm5lZCBpbmRleCBvZiB0aGUgY29sdW1uXG4gICAgICAgIGlmICghaGFzSW5kZXgpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBncmlkLnVucGlubmVkQ29sdW1ucy5tYXAoY29sID0+IGNvbC5pbmRleCk7XG4gICAgICAgICAgICBpbmRpY2VzLnB1c2godGhpcy5pbmRleCk7XG4gICAgICAgICAgICBpbmRpY2VzLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAgICAgICAgIGluZGV4ID0gaW5kaWNlcy5pbmRleE9mKHRoaXMuaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJnczogSVBpbkNvbHVtbkNhbmNlbGxhYmxlRXZlbnRBcmdzID0geyBjb2x1bW46IHRoaXMsIGluc2VydEF0SW5kZXg6IGluZGV4LCBpc1Bpbm5lZDogdHJ1ZSwgY2FuY2VsOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLmdyaWQuY29sdW1uUGluLmVtaXQoYXJncyk7XG5cbiAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuZW5kRWRpdChmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5fcGlubmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGlubmVkQ2hhbmdlLmVtaXQodGhpcy5fcGlubmVkKTtcblxuICAgICAgICAvLyBpdCBpcyBwb3NzaWJsZSB0aGF0IGluZGV4IGlzIHRoZSBsYXN0IHBvc2l0aW9uLCBzbyB3aWxsIG5lZWQgdG8gZmluZCB0YXJnZXQgY29sdW1uIGJ5IFtpbmRleC0xXVxuICAgICAgICBjb25zdCB0YXJnZXRDb2x1bW4gPSBhcmdzLmluc2VydEF0SW5kZXggPT09IGdyaWQuX3VucGlubmVkQ29sdW1ucy5sZW5ndGggP1xuICAgICAgICAgICAgZ3JpZC5fdW5waW5uZWRDb2x1bW5zW2FyZ3MuaW5zZXJ0QXRJbmRleCAtIDFdIDogZ3JpZC5fdW5waW5uZWRDb2x1bW5zW2FyZ3MuaW5zZXJ0QXRJbmRleF07XG5cbiAgICAgICAgaWYgKCFoYXNJbmRleCkge1xuICAgICAgICAgICAgZ3JpZC5fdW5waW5uZWRDb2x1bW5zLnNwbGljZShpbmRleCwgMCwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoZ3JpZC5fcGlubmVkQ29sdW1ucy5pbmRleE9mKHRoaXMpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGdyaWQuX3Bpbm5lZENvbHVtbnMuc3BsaWNlKGdyaWQuX3Bpbm5lZENvbHVtbnMuaW5kZXhPZih0aGlzKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzSW5kZXgpIHtcbiAgICAgICAgICAgIGdyaWQubW92ZUNvbHVtbih0aGlzLCB0YXJnZXRDb2x1bW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29sdW1uR3JvdXApIHtcbiAgICAgICAgICAgIHRoaXMuYWxsQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC51bnBpbigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdyaWQucmVpbml0UGluU3RhdGVzKCk7XG4gICAgICAgIGdyaWQucmVzZXRDYWNoZXMoKTtcblxuICAgICAgICBncmlkLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uTGF5b3V0Q2hpbGQpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5jb2x1bW5MaXN0LmZpbHRlcih4ID0+IHguY29sdW1uTGF5b3V0KS5mb3JFYWNoKHggPT4geC5wb3B1bGF0ZVZpc2libGVJbmRleGVzKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JpZC5maWx0ZXJpbmdTZXJ2aWNlLnJlZnJlc2hFeHByZXNzaW9ucygpO1xuXG4gICAgICAgIHRoaXMuZ3JpZC5jb2x1bW5QaW5uZWQuZW1pdCh7IGNvbHVtbjogdGhpcywgaW5zZXJ0QXRJbmRleDogaW5kZXgsIGlzUGlubmVkOiBmYWxzZSB9KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlcyBhIGNvbHVtbiB0byB0aGUgc3BlY2lmaWVkIHZpc2libGUgaW5kZXguXG4gICAgICogSWYgcGFzc2VkIGluZGV4IGlzIGludmFsaWQsIG9yIGlmIGNvbHVtbiB3b3VsZCByZWNlaXZlIGEgZGlmZmVyZW50IHZpc2libGUgaW5kZXggYWZ0ZXIgbW92aW5nLCBtb3ZpbmcgaXMgbm90IHBlcmZvcm1lZC5cbiAgICAgKiBJZiBwYXNzZWQgaW5kZXggd291bGQgbW92ZSB0aGUgY29sdW1uIHRvIGEgZGlmZmVyZW50IGNvbHVtbiBncm91cC4gbW92aW5nIGlzIG5vdCBwZXJmb3JtZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb2x1bW4ubW92ZShpbmRleCk7XG4gICAgICogYGBgXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZlKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHRhcmdldDtcbiAgICAgICAgbGV0IGNvbHVtbnMgPSAodGhpcy5ncmlkLmNvbHVtbkxpc3QgYXMgUXVlcnlMaXN0PElneENvbHVtbkNvbXBvbmVudD4pLmZpbHRlcihjID0+IGMudmlzaWJsZUluZGV4ID4gLTEpO1xuICAgICAgICAvLyBncmlkIGxhc3QgdmlzaWJsZSBpbmRleFxuICAgICAgICBjb25zdCBsaSA9IGNvbHVtbnMubWFwKGMgPT4gYy52aXNpYmxlSW5kZXgpLnJlZHVjZSgoYSwgYikgPT4gTWF0aC5tYXgoYSwgYikpO1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgY29uc3QgaXNQcmVjZWRpbmcgPSB0aGlzLnZpc2libGVJbmRleCA8IGluZGV4O1xuXG4gICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy52aXNpYmxlSW5kZXggfHwgaW5kZXggPCAwIHx8IGluZGV4ID4gbGkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbHVtbnMgPSBjb2x1bW5zLmZpbHRlcihjID0+IGMubGV2ZWwgPj0gdGhpcy5sZXZlbCAmJiBjICE9PSB0aGlzICYmIGMucGFyZW50ICE9PSB0aGlzICYmXG4gICAgICAgICAgICAgICAgYy50b3BMZXZlbFBhcmVudCA9PT0gdGhpcy50b3BMZXZlbFBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgICAgICAvLyBJZiBpc1ByZWNlZGluZywgZmluZCBhIHRhcmdldCBzdWNoIHRoYXQgd2hlbiB0aGUgY3VycmVudCBjb2x1bW4gaXMgcGxhY2VkIGFmdGVyIGl0LCBjdXJyZW50IGNvbHVtbW4gd2lsbCByZWNlaXZlIGEgdmlzaWJsZUluZGV4ID09PSBpbmRleC4gVGhpcyB0YWtlcyBpbnRvIGFjY291bnQgdmlzaWJsZSBjaGlsZHJlbiBvZiB0aGUgY29sdW1ucy5cbiAgICAgICAgLy8gSWYgIWlzUHJlY2VkaW5nLCBmaW5kcyBhIGNvbHVtbiBvZiB0aGUgc2FtZSBsZXZlbCBhbmQgdmlzaWJsZSBpbmRleCB0aGF0IGVxdWFscyB0aGUgcGFzc2VkIGluZGV4IGFndW1lbnQgKGMudmlzaWJsZUluZGV4ID09PSBpbmRleCkuIE5vIG5lZWQgdG8gY29uc2lkZXIgdGhlIGNoaWxkcmVuIGhlcmUuXG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuICAgICAgICBpZiAoaXNQcmVjZWRpbmcpIHtcbiAgICAgICAgICAgIGNvbHVtbnMgPSBjb2x1bW5zLmZpbHRlcihjID0+IGMudmlzaWJsZUluZGV4ID4gdGhpcy52aXNpYmxlSW5kZXgpO1xuICAgICAgICAgICAgdGFyZ2V0ID0gY29sdW1ucy5maW5kKGMgPT4gYy5sZXZlbCA9PT0gdGhpcy5sZXZlbCAmJiBjLnZpc2libGVJbmRleCArIGMuY2FsY0NoaWxkcmVuKCkgLSB0aGlzLmNhbGNDaGlsZHJlbigpID09PSBpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2x1bW5zID0gY29sdW1ucy5maWx0ZXIoYyA9PiBjLnZpc2libGVJbmRleCA8IHRoaXMudmlzaWJsZUluZGV4KTtcbiAgICAgICAgICAgIHRhcmdldCA9IGNvbHVtbnMuZmluZChjID0+IGMubGV2ZWwgPT09IHRoaXMubGV2ZWwgJiYgYy52aXNpYmxlSW5kZXggPT09IGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGFyZ2V0IHx8ICh0YXJnZXQucGlubmVkICYmIHRoaXMuZGlzYWJsZVBpbm5pbmcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSBpc1ByZWNlZGluZyA/IERyb3BQb3NpdGlvbi5BZnRlckRyb3BUYXJnZXQgOiBEcm9wUG9zaXRpb24uQmVmb3JlRHJvcFRhcmdldDtcbiAgICAgICAgdGhpcy5ncmlkLm1vdmVDb2x1bW4odGhpcywgdGFyZ2V0IGFzIElneENvbHVtbkNvbXBvbmVudCwgcG9zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBObyBjaGlsZHJlbiBmb3IgdGhlIGNvbHVtbiwgc28gd2lsbCByZXR1cm5zIDEgb3IgMCwgaWYgdGhlIGNvbHVtbiBpcyBoaWRkZW4uXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGNhbGNDaGlsZHJlbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuaGlkZGVuID8gMCA6IDE7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIGNvbHVtbiB2aWJpc2lsaXR5IGFuZCBlbWl0cyB0aGUgcmVzcGVjdGl2ZSBldmVudC5cbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlVmlzaWJpbGl0eSh2YWx1ZT86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSA/PyAhdGhpcy5oaWRkZW47XG4gICAgICAgIGNvbnN0IGV2ZW50QXJnczogSUNvbHVtblZpc2liaWxpdHlDaGFuZ2luZ0V2ZW50QXJncyA9IHsgY29sdW1uOiB0aGlzLCBuZXdWYWx1ZSwgY2FuY2VsOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLmdyaWQuY29sdW1uVmlzaWJpbGl0eUNoYW5naW5nLmVtaXQoZXZlbnRBcmdzKTtcblxuICAgICAgICBpZiAoZXZlbnRBcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZGVuID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuZ3JpZC5jb2x1bW5WaXNpYmlsaXR5Q2hhbmdlZC5lbWl0KHsgY29sdW1uOiB0aGlzLCBuZXdWYWx1ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSB0b3AgbGV2ZWwgcGFyZW50IGNvbHVtbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHRvcExldmVsUGFyZW50ID0gIHRoaXMuY29sdW1uLnRvcExldmVsUGFyZW50O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG9wTGV2ZWxQYXJlbnQoKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQucGFyZW50KSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgaGVhZGVyIG9mIHRoZSBjb2x1bW4uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW4gPSB0aGlzLmdyaWQuY29sdW1uTGlzdC5maWx0ZXIoYyA9PiBjLmZpZWxkID09PSAnSUQnKVswXTtcbiAgICAgKiBsZXQgaGVhZGVyQ2VsbCA9IGNvbHVtbi5oZWFkZXJDZWxsO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGVhZGVyQ2VsbCgpOiBJZ3hHcmlkSGVhZGVyQ29tcG9uZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5oZWFkZXJDZWxsTGlzdC5maW5kKChoZWFkZXIpID0+IGhlYWRlci5jb2x1bW4gPT09IHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGZpbHRlciBjZWxsIG9mIHRoZSBjb2x1bW4uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW4gPSB0aGlzLmdyaWQuY29sdW1uTGlzdC5maWx0ZXIoYyA9PiBjLmZpZWxkID09PSAnSUQnKVswXTtcbiAgICAgKiBsZXQgZmlsdGVyZWxsID0gY29sdW1uLmZpbHRlcmVsbDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZpbHRlckNlbGwoKTogSWd4R3JpZEZpbHRlcmluZ0NlbGxDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmZpbHRlckNlbGxMaXN0LmZpbmQoKGZpbHRlckNlbGwpID0+IGZpbHRlckNlbGwuY29sdW1uID09PSB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBoZWFkZXIgZ3JvdXAgb2YgdGhlIGNvbHVtbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDb2x1bW5Db21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRlckdyb3VwKCk6IElneEdyaWRIZWFkZXJHcm91cENvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQuaGVhZGVyR3JvdXBzTGlzdC5maW5kKGdyb3VwID0+IGdyb3VwLmNvbHVtbiA9PT0gdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXV0b3NpemUgdGhlIGNvbHVtbiB0byB0aGUgbG9uZ2VzdCBjdXJyZW50bHkgdmlzaWJsZSBjZWxsIHZhbHVlLCBpbmNsdWRpbmcgdGhlIGhlYWRlciBjZWxsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKCdncmlkJykgZ3JpZDogSWd4R3JpZENvbXBvbmVudDtcbiAgICAgKiBsZXQgY29sdW1uID0gdGhpcy5ncmlkLmNvbHVtbkxpc3QuZmlsdGVyKGMgPT4gYy5maWVsZCA9PT0gJ0lEJylbMF07XG4gICAgICogY29sdW1uLmF1dG9zaXplKCk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4Q29sdW1uQ29tcG9uZW50XG4gICAgICogQHBhcmFtIGJ5SGVhZGVyT25seSBTZXQgaWYgY29sdW1uIHNob3VsZCBiZSBhdXRvc2l6ZWQgYmFzZWQgb25seSBvbiB0aGUgaGVhZGVyIGNvbnRlbnQuXG4gICAgICovXG4gICAgcHVibGljIGF1dG9zaXplKGJ5SGVhZGVyT25seSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghdGhpcy5jb2x1bW5Hcm91cCkge1xuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuZ2V0QXV0b1NpemUoYnlIZWFkZXJPbmx5KTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5yZWZsb3coKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QXV0b1NpemUoYnlIZWFkZXIgPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHNpemUgPSAhYnlIZWFkZXIgPyB0aGlzLmdldExhcmdlc3RDZWxsV2lkdGgoKSA6XG4gICAgICAgICAgICAoT2JqZWN0LnZhbHVlcyh0aGlzLmdldEhlYWRlckNlbGxXaWR0aHMoKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYikgKyAncHgnKTtcbiAgICAgICAgY29uc3QgaXNQZXJjZW50YWdlV2lkdGggPSB0aGlzLndpZHRoICYmIHR5cGVvZiB0aGlzLndpZHRoID09PSAnc3RyaW5nJyAmJiB0aGlzLndpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTE7XG5cbiAgICAgICAgbGV0IG5ld1dpZHRoO1xuICAgICAgICBpZiAoaXNQZXJjZW50YWdlV2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyaWRBdmFpbGFibGVTaXplID0gdGhpcy5ncmlkLmNhbGNXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2VTaXplID0gcGFyc2VGbG9hdChzaXplKSAvIGdyaWRBdmFpbGFibGVTaXplICogMTAwO1xuICAgICAgICAgICAgbmV3V2lkdGggPSBwZXJjZW50YWdlU2l6ZSArICclJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gc2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gaXNQZXJjZW50YWdlV2lkdGggPyB0aGlzLm1heFdpZHRoUGVyY2VudCA6IHRoaXMubWF4V2lkdGhQeDtcbiAgICAgICAgY29uc3QgbWluV2lkdGggPSBpc1BlcmNlbnRhZ2VXaWR0aCA/IHRoaXMubWluV2lkdGhQZXJjZW50IDogdGhpcy5taW5XaWR0aFB4O1xuICAgICAgICBpZiAodGhpcy5tYXhXaWR0aCAmJiAocGFyc2VGbG9hdChuZXdXaWR0aCkgPiBtYXhXaWR0aCkpIHtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gaXNQZXJjZW50YWdlV2lkdGggPyBtYXhXaWR0aCArICclJyA6IG1heFdpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIGlmIChwYXJzZUZsb2F0KG5ld1dpZHRoKSA8IG1pbldpZHRoKSB7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IGlzUGVyY2VudGFnZVdpZHRoID8gbWluV2lkdGggKyAnJScgOiBtaW5XaWR0aCArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3V2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDYWxjV2lkdGgoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGNXaWR0aCAmJiAhaXNOYU4odGhpcy5jYWxjUGl4ZWxXaWR0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWxjV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWNoZUNhbGNXaWR0aCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FsY1dpZHRoO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIFJldHVybnMgdGhlIHdpZHRoIGFuZCBwYWRkaW5nIG9mIGEgaGVhZGVyIGNlbGwuXG4gICAgICovXG4gICAgcHVibGljIGdldEhlYWRlckNlbGxXaWR0aHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQuZ2V0SGVhZGVyQ2VsbFdpZHRoKHRoaXMuaGVhZGVyQ2VsbC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogUmV0dXJucyB0aGUgc2l6ZSAoaW4gcGl4ZWxzKSBvZiB0aGUgbG9uZ2VzdCBjdXJyZW50bHkgdmlzaWJsZSBjZWxsLCBpbmNsdWRpbmcgdGhlIGhlYWRlciBjZWxsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKCdncmlkJykgZ3JpZDogSWd4R3JpZENvbXBvbmVudDtcbiAgICAgKlxuICAgICAqIGxldCBjb2x1bW4gPSB0aGlzLmdyaWQuY29sdW1uTGlzdC5maWx0ZXIoYyA9PiBjLmZpZWxkID09PSAnSUQnKVswXTtcbiAgICAgKiBsZXQgc2l6ZSA9IGNvbHVtbi5nZXRMYXJnZXN0Q2VsbFdpZHRoKCk7XG4gICAgICogYGBgXG4gICAgICogQG1lbWJlcm9mIElneENvbHVtbkNvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRMYXJnZXN0Q2VsbFdpZHRoKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5ncmlkLmRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIGNvbnN0IGxhcmdlc3QgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXG4gICAgICAgIGlmICh0aGlzLl9jZWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsc0NvbnRlbnRXaWR0aHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2NlbGxzLmZvckVhY2goKGNlbGwpID0+IGNlbGxzQ29udGVudFdpZHRocy5wdXNoKGNlbGwuY2FsY3VsYXRlU2l6ZVRvRml0KHJhbmdlKSkpO1xuXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNlbGxzQ29udGVudFdpZHRocy5pbmRleE9mKE1hdGgubWF4KC4uLmNlbGxzQ29udGVudFdpZHRocykpO1xuICAgICAgICAgICAgY29uc3QgY2VsbFN0eWxlID0gdGhpcy5ncmlkLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUodGhpcy5fY2VsbHNbaW5kZXhdLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgY29uc3QgY2VsbFBhZGRpbmcgPSBwYXJzZUZsb2F0KGNlbGxTdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KGNlbGxTdHlsZS5wYWRkaW5nUmlnaHQpICtcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNlbGxTdHlsZS5ib3JkZXJMZWZ0V2lkdGgpICsgcGFyc2VGbG9hdChjZWxsU3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XG5cbiAgICAgICAgICAgIGxhcmdlc3Quc2V0KE1hdGgubWF4KC4uLmNlbGxzQ29udGVudFdpZHRocyksIGNlbGxQYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhlYWRlckNlbGwgJiYgdGhpcy5hdXRvc2l6ZUhlYWRlcikge1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyQ2VsbFdpZHRocyA9IHRoaXMuZ2V0SGVhZGVyQ2VsbFdpZHRocygpO1xuICAgICAgICAgICAgbGFyZ2VzdC5zZXQoaGVhZGVyQ2VsbFdpZHRocy53aWR0aCwgaGVhZGVyQ2VsbFdpZHRocy5wYWRkaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxhcmdlc3RDZWxsID0gTWF0aC5tYXgoLi4uQXJyYXkuZnJvbShsYXJnZXN0LmtleXMoKSkpO1xuICAgICAgICBjb25zdCB3aWR0aCA9IE1hdGguY2VpbChsYXJnZXN0Q2VsbCArIGxhcmdlc3QuZ2V0KGxhcmdlc3RDZWxsKSk7XG5cbiAgICAgICAgaWYgKE51bWJlci5pc05hTih3aWR0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHdpZHRoICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q2VsbFdpZHRoKCkge1xuICAgICAgICBjb25zdCBjb2xXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIGNvbnN0IGlzUGVyY2VudGFnZVdpZHRoID0gY29sV2lkdGggJiYgdHlwZW9mIGNvbFdpZHRoID09PSAnc3RyaW5nJyAmJiBjb2xXaWR0aC5pbmRleE9mKCclJykgIT09IC0xO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbHVtbkxheW91dENoaWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29sV2lkdGggJiYgIWlzUGVyY2VudGFnZVdpZHRoKSB7XG5cbiAgICAgICAgICAgIGxldCBjZWxsV2lkdGggPSBjb2xXaWR0aDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2VsbFdpZHRoICE9PSAnc3RyaW5nJyB8fCBjZWxsV2lkdGguZW5kc1dpdGgoJ3B4JykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY2VsbFdpZHRoICs9ICdweCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjZWxsV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29sV2lkdGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHBvcHVsYXRlVmlzaWJsZUluZGV4ZXMoKSB7IH1cblxuICAgIHByb3RlY3RlZCBnZXRDb2x1bW5TaXplc1N0cmluZyhjaGlsZHJlbjogUXVlcnlMaXN0PElneENvbHVtbkNvbXBvbmVudD4pOiBzdHJpbmcge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLmdldEZpbGxlZENoaWxkQ29sdW1uU2l6ZXMoY2hpbGRyZW4pO1xuICAgICAgICByZXR1cm4gcmVzLmpvaW4oJyAnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNhY2hlQ2FsY1dpZHRoKCk6IGFueSB7XG4gICAgICAgIGNvbnN0IGNvbFdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgY29uc3QgaXNQZXJjZW50YWdlV2lkdGggPSBjb2xXaWR0aCAmJiB0eXBlb2YgY29sV2lkdGggPT09ICdzdHJpbmcnICYmIGNvbFdpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTE7XG4gICAgICAgIGlmIChpc1BlcmNlbnRhZ2VXaWR0aCkge1xuICAgICAgICAgICAgdGhpcy5fY2FsY1dpZHRoID0gcGFyc2VGbG9hdChjb2xXaWR0aCkgLyAxMDAgKiB0aGlzLmdyaWQuY2FsY1dpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKCFjb2xXaWR0aCkge1xuICAgICAgICAgICAgLy8gbm8gd2lkdGhcbiAgICAgICAgICAgIHRoaXMuX2NhbGNXaWR0aCA9IHRoaXMuZGVmYXVsdFdpZHRoIHx8IHRoaXMuZ3JpZC5nZXRQb3NzaWJsZUNvbHVtbldpZHRoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxjV2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsY1BpeGVsV2lkdGggPSBwYXJzZUZsb2F0KHRoaXMuX2NhbGNXaWR0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzZXRFeHBhbmRDb2xsYXBzZVN0YXRlKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZpbHRlcihjb2wgPT4gKGNvbC52aXNpYmxlV2hlbkNvbGxhcHNlZCAhPT0gdW5kZWZpbmVkKSkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb2xsYXBzaWJsZSkge1xuICAgICAgICAgICAgICAgIGMuaGlkZGVuID0gdGhpcy5oaWRkZW47IHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMuaGlkZGVuID0gdGhpcy5fZXhwYW5kZWQgPyBjLnZpc2libGVXaGVuQ29sbGFwc2VkIDogIWMudmlzaWJsZVdoZW5Db2xsYXBzZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoZWNrQ29sbGFwc2libGVTdGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29scyA9IHRoaXMuY2hpbGRyZW4ubWFwKGNoaWxkID0+IGNoaWxkLnZpc2libGVXaGVuQ29sbGFwc2VkKTtcbiAgICAgICAgcmV0dXJuIChjb2xzLnNvbWUoYyA9PiBjID09PSB0cnVlKSAmJiBjb2xzLnNvbWUoYyA9PiBjID09PSBmYWxzZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5hYmxlKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ3JpZCBhcyBhbnkpLl9pbml0IHx8ICF0aGlzLnBpbm5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBhcHBseVNlbGVjdGFibGVDbGFzcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5U2VsZWN0YWJsZUNsYXNzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGFwcGx5U2VsZWN0YWJsZUNsYXNzKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5U2VsZWN0YWJsZUNsYXNzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=