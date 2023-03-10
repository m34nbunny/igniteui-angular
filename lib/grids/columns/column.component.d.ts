import { Subject } from 'rxjs';
import { AfterContentInit, ChangeDetectorRef, QueryList, TemplateRef, EventEmitter, OnDestroy } from '@angular/core';
import { GridColumnDataType } from '../../data-operations/data-util';
import { IgxFilteringOperand } from '../../data-operations/filtering-condition';
import { ISortingStrategy } from '../../data-operations/sorting-strategy';
import { FilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { CellType, ColumnType, GridType } from '../common/grid.interface';
import { IgxGridHeaderComponent } from '../headers/grid-header.component';
import { IgxGridFilteringCellComponent } from '../filtering/base/grid-filtering-cell.component';
import { IgxGridHeaderGroupComponent } from '../headers/grid-header-group.component';
import { IgxSummaryOperand, IgxSummaryResult } from '../summaries/grid-summary';
import { IgxCellTemplateDirective, IgxCellHeaderTemplateDirective, IgxCellEditorTemplateDirective, IgxCollapsibleIndicatorTemplateDirective, IgxFilterCellTemplateDirective, IgxSummaryTemplateDirective } from './templates.directive';
import { MRLResizeColumnInfo, MRLColumnSizeInfo, IColumnPipeArgs } from './interfaces';
import { PlatformUtil } from '../../core/utils';
import * as i0 from "@angular/core";
/**
 * **Ignite UI for Angular Column** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid/grid#columns-configuration)
 *
 * The Ignite UI Column is used within an `igx-grid` element to define what data the column will show. Features such as sorting,
 * filtering & editing are enabled at the column level.  You can also provide a template containing custom content inside
 * the column using `ng-template` which will be used for all cells within the column.
 */
export declare class IgxColumnComponent implements AfterContentInit, OnDestroy, ColumnType {
    grid: GridType;
    cdr: ChangeDetectorRef;
    protected platform: PlatformUtil;
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
    set field(value: string);
    get field(): string;
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
    header: string;
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
    title: string;
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
    sortable: boolean;
    /**
     * Returns if the column is selectable.
     * ```typescript
     * let columnSelectable = this.column.selectable;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get selectable(): boolean;
    /**
     * Sets if the column is selectable.
     * Default value is `true`.
     * ```html
     * <igx-column [selectable] = "false"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set selectable(value: boolean);
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
    groupable: boolean;
    /**
     * Gets whether the column is editable.
     * Default value is `false`.
     * ```typescript
     * let isEditable = this.column.editable;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get editable(): boolean;
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
    set editable(editable: boolean);
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
    filterable: boolean;
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
    resizable: boolean;
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
    autosizeHeader: boolean;
    /**
     * Gets a value indicating whether the summary for the column is enabled.
     * ```typescript
     * let hasSummary = this.column.hasSummary;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get hasSummary(): boolean;
    /**
     * Sets a value indicating whether the summary for the column is enabled.
     * Default value is `false`.
     * ```html
     * <igx-column [hasSummary] = "true"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set hasSummary(value: boolean);
    /**
     * Gets whether the column is hidden.
     * ```typescript
     * let isHidden = this.column.hidden;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get hidden(): boolean;
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
    set hidden(value: boolean);
    /**
     * Returns if the column is selected.
     * ```typescript
     * let isSelected = this.column.selected;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get selected(): boolean;
    /**
     * Select/deselect a column.
     * Default value is `false`.
     * ```typescript
     * this.column.selected = true;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set selected(value: boolean);
    /**
     * @hidden
     */
    hiddenChange: EventEmitter<boolean>;
    /** @hidden */
    expandedChange: EventEmitter<boolean>;
    /** @hidden */
    collapsibleChange: EventEmitter<boolean>;
    /** @hidden */
    visibleWhenCollapsedChange: EventEmitter<boolean>;
    /** @hidden */
    columnChange: EventEmitter<void>;
    /**
     * Gets whether the hiding is disabled.
     * ```typescript
     * let isHidingDisabled =  this.column.disableHiding;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    disableHiding: boolean;
    /**
     * Gets whether the pinning is disabled.
     * ```typescript
     * let isPinningDisabled =  this.column.disablePinning;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    disablePinning: boolean;
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
    movable: boolean;
    /**
     * Gets the `width` of the column.
     * ```typescript
     * let columnWidth = this.column.width;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get width(): string;
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
    set width(value: string);
    /**
     * Sets/gets the maximum `width` of the column.
     * ```typescript
     * let columnMaxWidth = this.column.width;
     * ```
     * ```html
     * <igx-column [maxWidth] = "'150px'"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    maxWidth: string;
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
    headerClasses: string;
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
    headerStyles: any;
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
    headerGroupClasses: string;
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
    headerGroupStyles: any;
    /**
     * Sets a conditional class selector of the column cells.
     * Accepts an object literal, containing key-value pairs,
     * where the key is the name of the CSS class, while the
     * value is either a callback function that returns a boolean,
     * or boolean, like so:
     * ```typescript
     * callback = (rowData, columnKey, cellValue, rowIndex) => { return rowData[columnKey] > 6; }
     * cellClasses = { 'className' : this.callback };
     * ```
     * ```html
     * <igx-column [cellClasses] = "cellClasses"></igx-column>
     * <igx-column [cellClasses] = "{'class1' : true }"></igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    cellClasses: any;
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
    cellStyles: any;
    /**
     * Applies display format to cell values in the column. Does not modify the underlying data.
     *
     * @remark
     * Note: As the formatter is used in places like the Excel style filtering dialog, in certain
     * scenarios (remote filtering for example), the row data argument can be `undefined`.
     *
     *
     * In this example, we check to see if the column name is Salary, and then provide a method as the column formatter
     * to format the value into a currency string.
     *
     * @example
     * ```typescript
     * columnInit(column: IgxColumnComponent) {
     *   if (column.field == "Salary") {
     *     column.formatter = (salary => this.format(salary));
     *   }
     * }
     *
     * format(value: number) : string {
     *   return formatCurrency(value, "en-us", "$");
     * }
     * ```
     *
     * @example
     * ```typescript
     * const column = this.grid.getColumnByName('Address');
     * const addressFormatter = (address: string, rowData: any) => data.privacyEnabled ? 'unknown' : address;
     * column.formatter = addressFormatter;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    formatter: (value: any, rowData?: any) => any;
    /**
     * The summaryFormatter is used to format the display of the column summaries.
     *
     * In this example, we check to see if the column name is OrderDate, and then provide a method as the summaryFormatter
     * to change the locale for the dates to 'fr-FR'. The summaries with the count key are skipped so they are displayed as numbers.
     *
     * ```typescript
     * columnInit(column: IgxColumnComponent) {
     *   if (column.field == "OrderDate") {
     *     column.summaryFormatter = this.summaryFormat;
     *   }
     * }
     *
     * summaryFormat(summary: IgxSummaryResult, summaryOperand: IgxSummaryOperand): string {
     *   const result = summary.summaryResult;
     *   if(summaryResult.key !== 'count' && result !== null && result !== undefined) {
     *      const pipe = new DatePipe('fr-FR');
     *      return pipe.transform(result,'mediumDate');
     *   }
     *   return result;
     * }
     * ```
     *
     * @memberof IgxColumnComponent
     */
    summaryFormatter: (summary: IgxSummaryResult, summaryOperand: IgxSummaryOperand) => any;
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
    filteringIgnoreCase: boolean;
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
    sortingIgnoreCase: boolean;
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
    searchable: boolean;
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
    dataType: GridColumnDataType;
    /** @hidden */
    collapsibleIndicatorTemplate: TemplateRef<any>;
    /**
     * Row index where the current field should end.
     * The amount of rows between rowStart and rowEnd will determine the amount of spanning rows to that field
     * ```html
     * <igx-column-layout>
     *   <igx-column [rowEnd]="2" [rowStart]="1" [colStart]="1"></igx-column>
     * </igx-column-layout>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    rowEnd: number;
    /**
     * Column index where the current field should end.
     * The amount of columns between colStart and colEnd will determine the amount of spanning columns to that field
     * ```html
     * <igx-column-layout>
     *   <igx-column [colEnd]="3" [rowStart]="1" [colStart]="1"></igx-column>
     * </igx-column-layout>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    colEnd: number;
    /**
     * Row index from which the field is starting.
     * ```html
     * <igx-column-layout>
     *   <igx-column [rowStart]="1" [colStart]="1"></igx-column>
     * </igx-column-layout>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    rowStart: number;
    /**
     * Column index from which the field is starting.
     * ```html
     * <igx-column-layout>
     *   <igx-column [colStart]="1" [rowStart]="1"></igx-column>
     * </igx-column-layout>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    colStart: number;
    /**
     * Sets/gets custom properties provided in additional template context.
     *
     * ```html
     * <igx-column [additionalTemplateContext]="contextObject">
     *   <ng-template igxCell let-cell="cell" let-props="additionalTemplateContext">
     *      {{ props }}
     *   </ng-template>
     * </igx-column>
     * ```
     *
     * @memberof IgxColumnComponent
     */
    additionalTemplateContext: any;
    /**
     * @hidden
     */
    widthChange: EventEmitter<string>;
    /**
     * @hidden
     */
    pinnedChange: EventEmitter<boolean>;
    /**
     * @hidden
     */
    filterCellTemplateDirective: IgxFilterCellTemplateDirective;
    /**
     * @hidden
     */
    protected summaryTemplateDirective: IgxSummaryTemplateDirective;
    /**
     * @hidden
     */
    protected cellTemplate: IgxCellTemplateDirective;
    /**
     * @hidden
     */
    protected headTemplate: QueryList<IgxCellHeaderTemplateDirective>;
    /**
     * @hidden
     */
    protected editorTemplate: IgxCellEditorTemplateDirective;
    /**
     * @hidden
     */
    protected collapseIndicatorTemplate: IgxCollapsibleIndicatorTemplateDirective;
    /**
     * @hidden
     */
    get calcWidth(): any;
    calcPixelWidth: number;
    /**
     * @hidden
     */
    get maxWidthPx(): number;
    /**
     * @hidden
     */
    get maxWidthPercent(): number;
    /**
     * @hidden
     */
    get minWidthPx(): number;
    /**
     * @hidden
     */
    get minWidthPercent(): number;
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
    set minWidth(value: string);
    get minWidth(): string;
    /**
     * Gets the column index.
     * ```typescript
     * let columnIndex = this.column.index;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get index(): number;
    /**
     * Gets whether the column is `pinned`.
     * ```typescript
     * let isPinned = this.column.pinned;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get pinned(): boolean;
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
    set pinned(value: boolean);
    /**
     * Gets the column `summaries`.
     * ```typescript
     * let columnSummaries = this.column.summaries;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get summaries(): any;
    /**
     * Sets the column `summaries`.
     * ```typescript
     * this.column.summaries = IgxNumberSummaryOperand;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set summaries(classRef: any);
    /**
     * Gets the column `filters`.
     * ```typescript
     * let columnFilters = this.column.filters'
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filters(): IgxFilteringOperand;
    /**
     * Sets the column `filters`.
     * ```typescript
     * this.column.filters = IgxBooleanFilteringOperand.instance().
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set filters(instance: IgxFilteringOperand);
    /**
     * Gets the column `sortStrategy`.
     * ```typescript
     * let sortStrategy = this.column.sortStrategy
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get sortStrategy(): ISortingStrategy;
    /**
     * Sets the column `sortStrategy`.
     * ```typescript
     * this.column.sortStrategy = new CustomSortingStrategy().
     * class CustomSortingStrategy extends SortingStrategy {...}
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set sortStrategy(classRef: ISortingStrategy);
    /**
     * Gets the function that compares values for grouping.
     * ```typescript
     * let groupingComparer = this.column.groupingComparer'
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get groupingComparer(): (a: any, b: any) => number;
    /**
     * Sets a custom function to compare values for grouping.
     * Subsequent values in the sorted data that the function returns 0 for are grouped.
     * ```typescript
     * this.column.groupingComparer = (a: any, b: any) => { return a === b ? 0 : -1; }
     * ```
     *
     * @memberof IgxColumnComponent
     */
    set groupingComparer(funcRef: (a: any, b: any) => number);
    /**
     * Gets the default minimum `width` of the column.
     * ```typescript
     * let defaultMinWidth =  this.column.defaultMinWidth;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get defaultMinWidth(): string;
    /**
     * Returns a reference to the `summaryTemplate`.
     * ```typescript
     * let summaryTemplate = this.column.summaryTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get summaryTemplate(): TemplateRef<any>;
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
    set summaryTemplate(template: TemplateRef<any>);
    /**
     * Returns a reference to the `bodyTemplate`.
     * ```typescript
     * let bodyTemplate = this.column.bodyTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get bodyTemplate(): TemplateRef<any>;
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
    set bodyTemplate(template: TemplateRef<any>);
    /**
     * Returns a reference to the header template.
     * ```typescript
     * let headerTemplate = this.column.headerTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get headerTemplate(): TemplateRef<any>;
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
    set headerTemplate(template: TemplateRef<any>);
    /**
     * Returns a reference to the inline editor template.
     * ```typescript
     * let inlineEditorTemplate = this.column.inlineEditorTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get inlineEditorTemplate(): TemplateRef<any>;
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
    set inlineEditorTemplate(template: TemplateRef<any>);
    /**
     * Returns a reference to the `filterCellTemplate`.
     * ```typescript
     * let filterCellTemplate = this.column.filterCellTemplate;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filterCellTemplate(): TemplateRef<any>;
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
    set filterCellTemplate(template: TemplateRef<any>);
    /**
     * Gets the cells of the column.
     * ```typescript
     * let columnCells = this.column.cells;
     * ```
     *
     */
    get cells(): CellType[];
    /**
     * @hidden @internal
     */
    get _cells(): CellType[];
    /**
     * Gets the column visible index.
     * If the column is not visible, returns `-1`.
     * ```typescript
     * let visibleColumnIndex =  this.column.visibleIndex;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get visibleIndex(): number;
    /**
     * Returns a boolean indicating if the column is a `ColumnGroup`.
     * ```typescript
     * let columnGroup =  this.column.columnGroup;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get columnGroup(): boolean;
    /**
     * Returns a boolean indicating if the column is a `ColumnLayout` for multi-row layout.
     * ```typescript
     * let columnGroup =  this.column.columnGroup;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get columnLayout(): boolean;
    /**
     * Returns a boolean indicating if the column is a child of a `ColumnLayout` for multi-row layout.
     * ```typescript
     * let columnLayoutChild =  this.column.columnLayoutChild;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get columnLayoutChild(): any;
    /**
     * Returns the children columns collection.
     * Returns an empty array if the column does not contain children columns.
     * ```typescript
     * let childrenColumns =  this.column.allChildren;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get allChildren(): IgxColumnComponent[];
    /**
     * Returns the level of the column in a column group.
     * Returns `0` if the column doesn't have a `parent`.
     * ```typescript
     * let columnLevel =  this.column.level;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get level(): number;
    get isLastPinned(): boolean;
    get isFirstPinned(): boolean;
    get rightPinnedOffset(): string;
    get gridRowSpan(): number;
    get gridColumnSpan(): number;
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
    set visibleWhenCollapsed(value: boolean);
    get visibleWhenCollapsed(): boolean;
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
    set pipeArgs(value: IColumnPipeArgs);
    get pipeArgs(): IColumnPipeArgs;
    /**
     * @hidden
     * @internal
     */
    get collapsible(): boolean;
    set collapsible(_value: boolean);
    /**
     * @hidden
     * @internal
     */
    get expanded(): boolean;
    set expanded(_value: boolean);
    /**
     * hidden
     */
    defaultWidth: string;
    /**
     * hidden
     */
    widthSetByUser: boolean;
    /**
     * @hidden
     */
    hasNestedPath: boolean;
    /**
     * @hidden
     * @internal
     */
    defaultTimeFormat: string;
    /**
     * @hidden
     * @internal
     */
    defaultDateTimeFormat: string;
    /**
     * Returns the filteringExpressionsTree of the column.
     * ```typescript
     * let tree =  this.column.filteringExpressionsTree;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filteringExpressionsTree(): FilteringExpressionsTree;
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
    parent: any;
    /**
     * Sets/gets the children columns.
     * ```typescript
     * let columnChildren = this.column.children;
     * ```
     * ```typescript
     * this.column.children = childrenColumns;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    children: QueryList<IgxColumnComponent>;
    /**
     * @hidden
     */
    destroy$: Subject<any>;
    /**
     * @hidden
     */
    protected _applySelectableClass: boolean;
    protected _vIndex: number;
    /**
     * @hidden
     */
    protected _pinned: boolean;
    /**
     * @hidden
     */
    protected _bodyTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected _headerTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected _summaryTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected _inlineEditorTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected _filterCellTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected _summaries: any;
    /**
     * @hidden
     */
    protected _filters: any;
    /**
     * @hidden
     */
    protected _sortStrategy: ISortingStrategy;
    /**
     * @hidden
     */
    protected _groupingComparer: (a: any, b: any) => number;
    /**
     * @hidden
     */
    protected _hidden: boolean;
    /**
     * @hidden
     */
    protected _index: number;
    /**
     * @hidden
     */
    protected _disablePinning: boolean;
    /**
     * @hidden
     */
    protected _width: string;
    /**
     * @hidden
     */
    protected _defaultMinWidth: string;
    /**
     * @hidden
     */
    protected _hasSummary: boolean;
    /**
     * @hidden
     */
    protected _editable: boolean;
    /**
     *  @hidden
     */
    protected _visibleWhenCollapsed: any;
    /**
     * @hidden
     */
    protected _collapsible: boolean;
    /**
     * @hidden
     */
    protected _expanded: boolean;
    /**
     * @hidden
     */
    protected _selectable: boolean;
    /**
     * @hidden
     */
    protected get isPrimaryColumn(): boolean;
    private _field;
    private _calcWidth;
    private _columnPipeArgs;
    constructor(grid: GridType, cdr: ChangeDetectorRef, platform: PlatformUtil);
    /**
     * @hidden
     * @internal
     */
    resetCaches(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    getGridTemplate(isRow: boolean): string;
    getInitialChildColumnSizes(children: QueryList<IgxColumnComponent>): Array<MRLColumnSizeInfo>;
    getFilledChildColumnSizes(children: QueryList<IgxColumnComponent>): Array<string>;
    getResizableColUnderEnd(): MRLResizeColumnInfo[];
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
    pin(index?: number): boolean;
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
    unpin(index?: number): boolean;
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
    move(index: number): void;
    /**
     * No children for the column, so will returns 1 or 0, if the column is hidden.
     *
     * @hidden
     */
    calcChildren(): number;
    /**
     * Toggles column vibisility and emits the respective event.
     *
     * @hidden
     */
    toggleVisibility(value?: boolean): void;
    /**
     * Returns a reference to the top level parent column.
     * ```typescript
     * let topLevelParent =  this.column.topLevelParent;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get topLevelParent(): any;
    /**
     * Returns a reference to the header of the column.
     * ```typescript
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     * let headerCell = column.headerCell;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get headerCell(): IgxGridHeaderComponent;
    /**
     * Returns a reference to the filter cell of the column.
     * ```typescript
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     * let filterell = column.filterell;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get filterCell(): IgxGridFilteringCellComponent;
    /**
     * Returns a reference to the header group of the column.
     *
     * @memberof IgxColumnComponent
     */
    get headerGroup(): IgxGridHeaderGroupComponent;
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
    autosize(byHeaderOnly?: boolean): void;
    /**
     * @hidden
     */
    getAutoSize(byHeader?: boolean): string;
    /**
     * @hidden
     */
    getCalcWidth(): any;
    /**
     * @hidden
     * Returns the width and padding of a header cell.
     */
    getHeaderCellWidths(): import("../common/grid.interface").ISizeInfo;
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
    getLargestCellWidth(): string;
    /**
     * @hidden
     */
    getCellWidth(): string;
    /**
     * @hidden
     */
    populateVisibleIndexes(): void;
    protected getColumnSizesString(children: QueryList<IgxColumnComponent>): string;
    /**
     * @hidden
     * @internal
     */
    protected cacheCalcWidth(): any;
    /**
     * @hidden
     * @internal
     */
    protected setExpandCollapseState(): void;
    /**
     * @hidden
     * @internal
     */
    protected checkCollapsibleState(): boolean;
    /**
     * @hidden
     */
    get pinnable(): any;
    /**
     * @hidden
     */
    get applySelectableClass(): boolean;
    /**
     * @hidden
     */
    set applySelectableClass(value: boolean);
    static ??fac: i0.????FactoryDeclaration<IgxColumnComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxColumnComponent, "igx-column", never, { "field": "field"; "header": "header"; "title": "title"; "sortable": "sortable"; "selectable": "selectable"; "groupable": "groupable"; "editable": "editable"; "filterable": "filterable"; "resizable": "resizable"; "autosizeHeader": "autosizeHeader"; "hasSummary": "hasSummary"; "hidden": "hidden"; "disableHiding": "disableHiding"; "disablePinning": "disablePinning"; "movable": "movable"; "width": "width"; "maxWidth": "maxWidth"; "headerClasses": "headerClasses"; "headerStyles": "headerStyles"; "headerGroupClasses": "headerGroupClasses"; "headerGroupStyles": "headerGroupStyles"; "cellClasses": "cellClasses"; "cellStyles": "cellStyles"; "formatter": "formatter"; "summaryFormatter": "summaryFormatter"; "filteringIgnoreCase": "filteringIgnoreCase"; "sortingIgnoreCase": "sortingIgnoreCase"; "searchable": "searchable"; "dataType": "dataType"; "collapsibleIndicatorTemplate": "collapsibleIndicatorTemplate"; "rowEnd": "rowEnd"; "colEnd": "colEnd"; "rowStart": "rowStart"; "colStart": "colStart"; "additionalTemplateContext": "additionalTemplateContext"; "minWidth": "minWidth"; "pinned": "pinned"; "summaries": "summaries"; "filters": "filters"; "sortStrategy": "sortStrategy"; "groupingComparer": "groupingComparer"; "summaryTemplate": "summaryTemplate"; "bodyTemplate": "cellTemplate"; "headerTemplate": "headerTemplate"; "inlineEditorTemplate": "cellEditorTemplate"; "filterCellTemplate": "filterCellTemplate"; "visibleWhenCollapsed": "visibleWhenCollapsed"; "pipeArgs": "pipeArgs"; }, { "hiddenChange": "hiddenChange"; "expandedChange": "expandedChange"; "collapsibleChange": "collapsibleChange"; "visibleWhenCollapsedChange": "visibleWhenCollapsedChange"; "columnChange": "columnChange"; "widthChange": "widthChange"; "pinnedChange": "pinnedChange"; }, ["filterCellTemplateDirective", "summaryTemplateDirective", "cellTemplate", "editorTemplate", "collapseIndicatorTemplate", "headTemplate"], never>;
}
