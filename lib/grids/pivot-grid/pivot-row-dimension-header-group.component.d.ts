import { ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { PlatformUtil } from '../../core/utils';
import { PivotGridType } from '../common/grid.interface';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { IgxGridHeaderGroupComponent } from '../headers/grid-header-group.component';
import { IgxPivotColumnResizingService } from '../resizing/pivot-grid/pivot-resizing.service';
import { PivotRowHeaderGroupType } from './pivot-grid.interface';
import { IgxPivotRowDimensionHeaderComponent } from './pivot-row-dimension-header.component';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxPivotRowDimensionHeaderGroupComponent extends IgxGridHeaderGroupComponent implements PivotRowHeaderGroupType {
    private cdRef;
    grid: PivotGridType;
    private elementRef;
    colResizingService: IgxPivotColumnResizingService;
    filteringService: IgxFilteringService;
    protected platform: PlatformUtil;
    protected zone: NgZone;
    /**
     * @hidden
     */
    userSelect: string;
    constructor(cdRef: ChangeDetectorRef, grid: PivotGridType, elementRef: ElementRef<HTMLElement>, colResizingService: IgxPivotColumnResizingService, filteringService: IgxFilteringService, platform: PlatformUtil, zone: NgZone);
    /**
     * @hidden
     * @internal
     */
    rowIndex: number;
    /**
    * @hidden
    * @internal
    */
    parent: any;
    header: IgxPivotRowDimensionHeaderComponent;
    get headerID(): string;
    get title(): string;
    /**
     * @hidden @internal
     */
    onClick(event: MouseEvent): void;
    /**
     * @hidden
     * @internal
     */
    get visibleIndex(): number;
    get active(): boolean;
    protected get activeNode(): {
        row: number;
        column: number;
        level: any;
        mchCache: any;
        layout: any;
    };
    private findRootDimension;
    activate(): void;
    /**
     * @hidden @internal
     */
    pointerdown(_event: PointerEvent): void;
    /**
     * @hidden @internal
     */
    onMouseDown(_event: MouseEvent): void;
    get selectable(): boolean;
    static ??fac: i0.????FactoryDeclaration<IgxPivotRowDimensionHeaderGroupComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxPivotRowDimensionHeaderGroupComponent, "igx-pivot-row-dimension-header-group", never, { "rowIndex": "rowIndex"; "parent": "parent"; }, {}, never, never>;
}
