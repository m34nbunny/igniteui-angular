import { ChangeDetectorRef, EventEmitter, Renderer2 } from "@angular/core";
import { DisplayDensity } from "../../core/displayDensity";
import { IDragBaseEventArgs, IDragGhostBaseEventArgs, IDragMoveEventArgs, IDropBaseEventArgs, IDropDroppedEventArgs } from "../../directives/drag-drop/drag-drop.directive";
import { ISelectionEventArgs } from "../../drop-down/drop-down.common";
import { IgxDropDownComponent } from "../../drop-down/drop-down.component";
import { PivotGridType } from "../common/grid.interface";
import { IPivotAggregator, IPivotDimension, IPivotValue, PivotDimensionType } from "./pivot-grid.interface";
import * as i0 from "@angular/core";
interface IDataSelectorPanel {
    name: string;
    i18n: string;
    type?: PivotDimensionType;
    dataKey: string;
    icon: string;
    itemKey: string;
    displayKey?: string;
    sortable: boolean;
    dragChannels: string[];
}
/**
 * Pivot Data Selector provides means to configure the pivot state of the Pivot Grid via a vertical panel UI
 *
 * @igxModule IgxPivotGridModule
 * @igxGroup Grids & Lists
 * @igxKeywords data selector, pivot, grid
 * @igxTheme pivot-data-selector-theme
 * @remarks
 * The Ignite UI Data Selector has a searchable list with the grid data columns,
 * there are also four expandable areas underneath for filters, rows, columns, and values
 * is used for grouping and aggregating simple flat data into a pivot table.
 * @example
 * ```html
 * <igx-pivot-grid #grid1 [data]="data" [pivotConfiguration]="configuration">
 * </igx-pivot-grid>
 * <igx-pivot-data-selector [grid]="grid1"></igx-pivot-data-selector>
 * ```
 */
export declare class IgxPivotDataSelectorComponent {
    private renderer;
    private cdr;
    /**
     * Gets/sets whether the columns panel is expanded
     * Get
     * ```typescript
     *  const columnsPanelState: boolean = this.dataSelector.columnsExpanded;
     * ```
     * Set
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [columnsExpanded]="columnsPanelState"></igx-pivot-data-selector>
     * ```
     *
     * Two-way data binding:
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [(columnsExpanded)]="columnsPanelState"></igx-pivot-data-selector>
     * ```
     */
    columnsExpanded: boolean;
    /**
     * @hidden
     */
    columnsExpandedChange: EventEmitter<boolean>;
    /**
     * Gets/sets whether the rows panel is expanded
     * Get
     * ```typescript
     *  const rowsPanelState: boolean = this.dataSelector.rowsExpanded;
     * ```
     * Set
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [rowsExpanded]="rowsPanelState"></igx-pivot-data-selector>
     * ```
     *
     * Two-way data binding:
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [(rowsExpanded)]="rowsPanelState"></igx-pivot-data-selector>
     * ```
     */
    rowsExpanded: boolean;
    /**
     * @hidden
     */
    rowsExpandedChange: EventEmitter<boolean>;
    /**
     * Gets/sets whether the filters panel is expanded
     * Get
     * ```typescript
     *  const filtersPanelState: boolean = this.dataSelector.filtersExpanded;
     * ```
     * Set
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [filtersExpanded]="filtersPanelState"></igx-pivot-data-selector>
     * ```
     *
     * Two-way data binding:
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [(filtersExpanded)]="filtersPanelState"></igx-pivot-data-selector>
     * ```
     */
    filtersExpanded: boolean;
    /**
     * @hidden
     */
    filtersExpandedChange: EventEmitter<boolean>;
    /**
     * Gets/sets whether the values panel is expanded
     * Get
     * ```typescript
     *  const valuesPanelState: boolean = this.dataSelector.valuesExpanded;
     * ```
     * Set
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [valuesExpanded]="valuesPanelState"></igx-pivot-data-selector>
     * ```
     *
     * Two-way data binding:
     * ```html
     * <igx-pivot-data-selector [grid]="grid1" [(valuesExpanded)]="valuesPanelState"></igx-pivot-data-selector>
     * ```
     */
    valuesExpanded: boolean;
    /**
     * @hidden
     */
    valuesExpandedChange: EventEmitter<boolean>;
    private _grid;
    private _dropDelta;
    /** @hidden @internal **/
    cssClass: string;
    /** @hidden @internal **/
    dimensions: IPivotDimension[];
    private _subMenuPositionSettings;
    private _subMenuOverlaySettings;
    animationSettings: {
        closeAnimation: import("@angular/animations").AnimationAnimateRefMetadata;
        openAnimation: import("@angular/animations").AnimationAnimateRefMetadata;
    };
    /** @hidden @internal */
    aggregateList: IPivotAggregator[];
    /** @hidden @internal */
    value: IPivotValue;
    /** @hidden @internal */
    ghostText: string;
    /** @hidden @internal */
    ghostWidth: number;
    /** @hidden @internal */
    dropAllowed: boolean;
    /** @hidden @internal */
    get dims(): IPivotDimension[];
    /** @hidden @internal */
    get values(): IPivotValue[];
    constructor(renderer: Renderer2, cdr: ChangeDetectorRef);
    /**
     * @hidden @internal
     */
    _panels: IDataSelectorPanel[];
    /**
     * @hidden @internal
     */
    get displayDensity(): DisplayDensity;
    /**
     * An @Input property that sets the grid.
     */
    set grid(value: PivotGridType);
    /**
     * Returns the grid.
     */
    get grid(): PivotGridType;
    /**
     * @hidden
     * @internal
     */
    onItemSort(_: Event, dimension: IPivotDimension, dimensionType: PivotDimensionType): void;
    /**
     * @hidden
     * @internal
     */
    onFilteringIconPointerDown(event: PointerEvent): void;
    /**
     * @hidden
     * @internal
     */
    onFilteringIconClick(event: MouseEvent, dimension: IPivotDimension): void;
    /**
     * @hidden
     * @internal
     */
    protected getDimensionState(dimensionType: PivotDimensionType): IPivotDimension[];
    /**
     * @hidden
     * @internal
     */
    protected moveValueItem(itemId: string): void;
    /**
     * @hidden
     * @internal
     */
    onItemDropped(event: IDropDroppedEventArgs, dimensionType: PivotDimensionType): void;
    /**
     * @hidden
     * @internal
     */
    protected updateDropDown(value: IPivotValue, dropdown: IgxDropDownComponent): void;
    /**
     * @hidden
     * @internal
     */
    onSummaryClick(event: MouseEvent, value: IPivotValue, dropdown: IgxDropDownComponent): void;
    /**
     * @hidden
     * @internal
     */
    onAggregationChange(event: ISelectionEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    isSelected(val: IPivotAggregator): boolean;
    /**
     * @hidden
     * @internal
     */
    ghostCreated(event: IDragGhostBaseEventArgs, value: string): void;
    /**
     * @hidden
     * @internal
     */
    toggleItem(item: IPivotDimension | IPivotValue): void;
    /**
     * @hidden
     * @internal
     */
    onPanelEntry(event: IDropBaseEventArgs, panel: string): void;
    /**
     * @hidden
     * @internal
     */
    onItemDragMove(event: IDragMoveEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onItemDragEnd(event: IDragBaseEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onItemDragOver(event: IDropBaseEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onItemDragLeave(event: IDropBaseEventArgs): void;
    getPanelCollapsed(panelType: PivotDimensionType): boolean;
    onCollapseChange(value: boolean, panelType: PivotDimensionType): void;
    static ??fac: i0.????FactoryDeclaration<IgxPivotDataSelectorComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxPivotDataSelectorComponent, "igx-pivot-data-selector", never, { "columnsExpanded": "columnsExpanded"; "rowsExpanded": "rowsExpanded"; "filtersExpanded": "filtersExpanded"; "valuesExpanded": "valuesExpanded"; "grid": "grid"; }, { "columnsExpandedChange": "columnsExpandedChange"; "rowsExpandedChange": "rowsExpandedChange"; "filtersExpandedChange": "filtersExpandedChange"; "valuesExpandedChange": "valuesExpandedChange"; }, never, never>;
}
export {};
