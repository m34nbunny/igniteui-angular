import { ChangeDetectorRef, ElementRef, OnChanges, QueryList, Renderer2, SimpleChanges } from '@angular/core';
import { IBaseChipEventArgs, IgxChipComponent } from '../../chips/chip.component';
import { IgxChipsAreaComponent } from '../../chips/chips-area.component';
import { IgxGridForOfDirective } from '../../directives/for-of/for_of.directive';
import { ISelectionEventArgs } from '../../drop-down/drop-down.common';
import { IgxDropDownComponent } from '../../drop-down/drop-down.component';
import { ColumnType, PivotGridType } from '../common/grid.interface';
import { IgxGridHeaderGroupComponent } from '../headers/grid-header-group.component';
import { IgxGridHeaderRowComponent } from '../headers/grid-header-row.component';
import { IPivotAggregator, IPivotDimension, IPivotValue, PivotDimensionType } from './pivot-grid.interface';
import * as i0 from "@angular/core";
/**
 *
 * For all intents & purposes treat this component as what a <thead> usually is in the default <table> element.
 *
 * This container holds the pivot grid header elements and their behavior/interactions.
 *
 * @hidden @internal
 */
export declare class IgxPivotHeaderRowComponent extends IgxGridHeaderRowComponent implements OnChanges {
    grid: PivotGridType;
    protected ref: ElementRef<HTMLElement>;
    protected cdr: ChangeDetectorRef;
    protected renderer: Renderer2;
    aggregateList: IPivotAggregator[];
    value: IPivotValue;
    filterDropdownDimensions: Set<any>;
    filterAreaDimensions: Set<any>;
    private _dropPos;
    private valueData;
    private _subMenuPositionSettings;
    private _subMenuOverlaySettings;
    /**
     * @hidden @internal
     */
    esf: any;
    /**
     * @hidden @internal
     */
    filterArea: any;
    /**
     * @hidden @internal
     */
    filtersButton: any;
    /**
     * @hidden @internal
     */
    dropdownChips: any;
    /**
     * @hidden @internal
     */
    pivotFilterContainer: any;
    /**
    * @hidden
    * @internal
    */
    notificationChips: QueryList<IgxChipComponent>;
    /**
    * @hidden
    * @internal
    * The virtualized part of the header row containing the unpinned header groups.
    */
    headerContainers: QueryList<IgxGridForOfDirective<IgxGridHeaderGroupComponent>>;
    get headerForOf(): IgxGridForOfDirective<IgxGridHeaderGroupComponent>;
    constructor(grid: PivotGridType, ref: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, renderer: Renderer2);
    /**
    * @hidden
    * @internal
    * Default is a single empty level since default depth is 1
    */
    columnDimensionsByLevel: any[];
    /**
    * @hidden @internal
    */
    get isFiltersButton(): boolean;
    /**
    * @hidden
    * @internal
    */
    get totalDepth(): number;
    /**
    * @hidden
    * @internal
    */
    get maxContainerHeight(): number;
    /**
    * @hidden
    * @internal
    */
    calcHeight(col: ColumnType, index: number): number;
    /**
    * @hidden
    * @internal
    */
    isDuplicateOfExistingParent(col: ColumnType, lvl: number): boolean;
    /**
    * @hidden
    * @internal
    */
    isMultiRow(col: ColumnType, lvl: number): boolean;
    /**
    * @hidden
    * @internal
    */
    populateColumnDimensionsByLevel(): void;
    protected populateDimensionRecursively(currentLevelColumns: ColumnType[], level: number, res: any[]): void;
    /**
    * @hidden
    * @internal
    */
    ngOnChanges(changes: SimpleChanges): void;
    /**
    * @hidden
    * @internal
    */
    onDimDragStart(event: any, area: any): void;
    /**
    * @hidden
    * @internal
    */
    onDimDragEnd(): void;
    /**
    * @hidden
    * @internal
    */
    getAreaHeight(area: IgxChipsAreaComponent): number;
    /**
    * @hidden
    * @internal
    */
    rowRemoved(event: IBaseChipEventArgs): void;
    /**
    * @hidden
    * @internal
    */
    columnRemoved(event: IBaseChipEventArgs): void;
    /**
    * @hidden
    * @internal
    */
    valueRemoved(event: IBaseChipEventArgs): void;
    /**
    * @hidden
    * @internal
    */
    filterRemoved(event: IBaseChipEventArgs): void;
    onFiltersSelectionChanged(event?: IBaseChipEventArgs): void;
    /**
    * @hidden
    * @internal
    */
    onFilteringIconPointerDown(event: any): void;
    /**
    * @hidden
    * @internal
    */
    onFilteringIconClick(event: any, dimension: any): void;
    /**
    * @hidden
    * @internal
    */
    onSummaryClick(eventArgs: any, value: IPivotValue, dropdown: IgxDropDownComponent, chip: IgxChipComponent): void;
    /**
     * @hidden @internal
     */
    onFiltersAreaDropdownClick(event: any, dimension?: any, shouldReattach?: boolean): void;
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
    onChipSort(_event: any, dimension: IPivotDimension): void;
    /**
    * @hidden
    * @internal
    */
    onDimDragOver(event: any, dimension?: PivotDimensionType): void;
    /**
    * @hidden
    * @internal
    */
    onDimDragLeave(event: any): void;
    /**
    * @hidden
    * @internal
    */
    onAreaDragLeave(event: any, area: any): void;
    /**
    * @hidden
    * @internal
    */
    onValueDrop(event: any, area: any): void;
    /**
    * @hidden
    * @internal
    */
    onDimDrop(event: any, area: any, dimensionType: PivotDimensionType): void;
    protected updateDropDown(value: IPivotValue, dropdown: IgxDropDownComponent, chip: IgxChipComponent): void;
    static ??fac: i0.????FactoryDeclaration<IgxPivotHeaderRowComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxPivotHeaderRowComponent, "igx-pivot-header-row", never, {}, {}, never, never>;
}
