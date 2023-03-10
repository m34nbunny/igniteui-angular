import { AfterViewInit, ChangeDetectorRef, DoCheck, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { IFilteringExpression } from '../../../data-operations/filtering-expression.interface';
import { IgxFilteringService } from '../grid-filtering.service';
import { DisplayDensity } from '../../../core/displayDensity';
import { ExpressionUI } from '../excel-style/common';
import { IgxChipsAreaComponent } from '../../../chips/chips-area.component';
import { IBaseChipEventArgs, IgxChipComponent } from '../../../chips/chip.component';
import { ColumnType } from '../../common/grid.interface';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxGridFilteringCellComponent implements AfterViewInit, OnInit, DoCheck {
    cdr: ChangeDetectorRef;
    filteringService: IgxFilteringService;
    column: ColumnType;
    protected emptyFilter: TemplateRef<any>;
    protected defaultFilter: TemplateRef<any>;
    protected complexFilter: TemplateRef<any>;
    protected chipsArea: IgxChipsAreaComponent;
    protected moreIcon: ElementRef;
    protected ghostChip: IgxChipComponent;
    protected complexChip: IgxChipComponent;
    get styleClasses(): string;
    expressionsList: ExpressionUI[];
    moreFiltersCount: number;
    private baseClass;
    constructor(cdr: ChangeDetectorRef, filteringService: IgxFilteringService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    /**
     * Returns whether a chip with a given index is visible or not.
     */
    isChipVisible(index: number): boolean;
    /**
     * Updates the filtering cell area.
     */
    updateFilterCellArea(): void;
    get displayDensity(): DisplayDensity;
    get template(): TemplateRef<any>;
    /**
     * Gets the context passed to the filter template.
     *
     * @memberof IgxGridFilteringCellComponent
     */
    get context(): {
        column: ColumnType;
    };
    /**
     * Chip clicked event handler.
     */
    onChipClicked(expression?: IFilteringExpression): void;
    /**
     * Chip removed event handler.
     */
    onChipRemoved(eventArgs: IBaseChipEventArgs, item: ExpressionUI): void;
    /**
     * Clears the filtering.
     */
    clearFiltering(): void;
    /**
     * Returns the filtering indicator class.
     */
    filteringIndicatorClass(): {
        [x: string]: boolean;
    };
    private removeExpression;
    private isMoreIconHidden;
    private updateVisibleFilters;
    static ??fac: i0.????FactoryDeclaration<IgxGridFilteringCellComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxGridFilteringCellComponent, "igx-grid-filtering-cell", never, { "column": "column"; }, {}, never, never>;
}
