import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, TemplateRef } from '@angular/core';
import { PlatformUtil } from '../../../core/utils';
import { DisplayDensity } from '../../../core/density';
import { IgxFilterItem } from '../../../data-operations/filtering-strategy';
import { BaseFilteringComponent } from './base-filtering.component';
import { ExpressionUI, FilterListItem } from './common';
import { ColumnType, GridType } from '../../common/grid.interface';
import { IgxOverlayService } from '../../../services/overlay/overlay';
import * as i0 from "@angular/core";
export declare class IgxExcelStyleColumnOperationsTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleColumnOperationsTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxExcelStyleColumnOperationsTemplateDirective, "igx-excel-style-column-operations,[igxExcelStyleColumnOperations]", never, {}, {}, never>;
}
export declare class IgxExcelStyleFilterOperationsTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleFilterOperationsTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxExcelStyleFilterOperationsTemplateDirective, "igx-excel-style-filter-operations,[igxExcelStyleFilterOperations]", never, {}, {}, never>;
}
/**
 * A component used for presenting Excel style filtering UI for a specific column.
 * It is used internally in the Grid, but could also be hosted in a container outside of it.
 *
 * Example:
 * ```html
 * <igx-grid-excel-style-filtering
 *     [column]="grid1.columns[0]">
 * </igx-grid-excel-style-filtering>
 * ```
 */
export declare class IgxGridExcelStyleFilteringComponent extends BaseFilteringComponent implements OnDestroy {
    protected cdr: ChangeDetectorRef;
    element: ElementRef<HTMLElement>;
    protected platform: PlatformUtil;
    protected gridAPI?: GridType;
    /**
     * @hidden @internal
     */
    defaultClass: boolean;
    /**
     * @hidden @internal
     */
    inline: boolean;
    /**
     * @hidden @internal
     */
    loadingStart: EventEmitter<any>;
    /**
     * @hidden @internal
     */
    loadingEnd: EventEmitter<any>;
    /**
     * @hidden @internal
     */
    initialized: EventEmitter<any>;
    /**
     * @hidden @internal
     */
    sortingChanged: EventEmitter<any>;
    /**
     * @hidden @internal
     */
    columnChange: EventEmitter<ColumnType>;
    /**
     * @hidden @internal
     */
    listDataLoaded: EventEmitter<any>;
    mainDropdown: ElementRef<HTMLElement>;
    /**
     * @hidden @internal
     */
    excelColumnOperationsDirective: IgxExcelStyleColumnOperationsTemplateDirective;
    /**
     * @hidden @internal
     */
    excelFilterOperationsDirective: IgxExcelStyleFilterOperationsTemplateDirective;
    /**
     * @hidden @internal
     */
    protected defaultExcelColumnOperations: TemplateRef<any>;
    /**
     * @hidden @internal
     */
    protected defaultExcelFilterOperations: TemplateRef<any>;
    /**
     * An @Input property that sets the column.
     */
    set column(value: ColumnType);
    /**
     * Returns the current column.
     */
    get column(): ColumnType;
    /**
     * @hidden @internal
     */
    expressionsList: ExpressionUI[];
    /**
     * @hidden @internal
     */
    listData: FilterListItem[];
    /**
     * @hidden @internal
     */
    uniqueValues: IgxFilterItem[];
    /**
     * @hidden @internal
     */
    overlayService: IgxOverlayService;
    /**
     * @hidden @internal
     */
    overlayComponentId: string;
    /**
     * @hidden @internal
     */
    isHierarchical: boolean;
    private _minHeight;
    /**
     * Gets the minimum height.
     */
    get minHeight(): string;
    /**
     * Sets the minimum height.
     */
    set minHeight(value: string);
    private _maxHeight;
    private containsNullOrEmpty;
    private selectAllSelected;
    private selectAllIndeterminate;
    private filterValues;
    private _column;
    private subscriptions;
    private _originalDisplay;
    /**
     * Gets the maximum height.
     */
    get maxHeight(): string;
    /**
     * Sets the maximum height.
     */
    set maxHeight(value: string);
    /**
     * @hidden @internal
     */
    get grid(): GridType;
    /**
     * @hidden @internal
     */
    get displayDensity(): DisplayDensity;
    constructor(cdr: ChangeDetectorRef, element: ElementRef<HTMLElement>, platform: PlatformUtil, gridAPI?: GridType);
    /**
     * @hidden @internal
     */
    ngOnDestroy(): void;
    /**
     * @hidden @internal
     */
    initialize(column: ColumnType, overlayService: IgxOverlayService): void;
    /**
     * @hidden @internal
     */
    onPin(): void;
    /**
     * @hidden @internal
     */
    onSelect(): void;
    /**
     * @hidden @internal
     */
    columnSelectable(): boolean;
    /**
     * @hidden @internal
     */
    onHideToggle(): void;
    /**
     * @hidden @internal
     */
    cancel(): void;
    /**
     * @hidden @internal
     */
    closeDropdown(): void;
    /**
     * @hidden @internal
     */
    onKeyDown(eventArgs: KeyboardEvent): void;
    /**
     * @hidden @internal
     */
    hide(): void;
    /**
     * @hidden @internal
     */
    detectChanges(): void;
    private init;
    private areExpressionsSelectable;
    private populateColumnData;
    private renderColumnValuesRemotely;
    private renderColumnValuesFromData;
    private renderValues;
    private generateFilterValues;
    private generateListData;
    private getColumnFilterExpressionsTree;
    private addBooleanItems;
    private addItems;
    private generateFilterListItems;
    private addSelectAllItem;
    private generateBlanksItem;
    private getFilterItemLabel;
    private getExpressionValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridExcelStyleFilteringComponent, [null, null, null, { optional: true; host: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridExcelStyleFilteringComponent, "igx-grid-excel-style-filtering", never, { "column": "column"; "minHeight": "minHeight"; "maxHeight": "maxHeight"; }, { "loadingStart": "loadingStart"; "loadingEnd": "loadingEnd"; "initialized": "initialized"; "sortingChanged": "sortingChanged"; "columnChange": "columnChange"; "listDataLoaded": "listDataLoaded"; }, ["excelColumnOperationsDirective", "excelFilterOperationsDirective"], ["igx-excel-style-column-operations,[igxExcelStyleColumnOperations]", "igx-excel-style-filter-operations,[igxExcelStyleFilterOperations]"]>;
}
