import { ChangeDetectorRef, DoCheck, ElementRef, QueryList } from '@angular/core';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { IgxColumnResizingService } from '../resizing/resizing.service';
import { IgxGridHeaderComponent } from './grid-header.component';
import { IgxGridFilteringCellComponent } from '../filtering/base/grid-filtering-cell.component';
import { ColumnType, GridType } from '../common/grid.interface';
import { PlatformUtil } from '../../core/utils';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxGridHeaderGroupComponent implements DoCheck {
    private cdr;
    grid: GridType;
    private ref;
    colResizingService: IgxColumnResizingService;
    filteringService: IgxFilteringService;
    protected platform: PlatformUtil;
    get rowEnd(): number;
    get colEnd(): number;
    get rowStart(): number;
    get colStart(): number;
    get headerID(): string;
    /**
     * Gets the column of the header group.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    column: ColumnType;
    get active(): boolean;
    get activeGroup(): boolean;
    /**
     * @hidden
     */
    header: IgxGridHeaderComponent;
    /**
     * @hidden
     */
    filter: IgxGridFilteringCellComponent;
    /**
     * @hidden
     */
    children: QueryList<IgxGridHeaderGroupComponent>;
    /**
     * Gets the width of the header group.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get width(): string;
    defaultCss: boolean;
    constructor(cdr: ChangeDetectorRef, grid: GridType, ref: ElementRef<HTMLElement>, colResizingService: IgxColumnResizingService, filteringService: IgxFilteringService, platform: PlatformUtil);
    get pinnedCss(): boolean;
    get pinnedLastCss(): boolean;
    get pinnedFirstCSS(): boolean;
    get headerDragCss(): boolean;
    get filteringCss(): boolean;
    /**
     * @hidden
     */
    get zIndex(): number;
    /**
     * Gets whether the header group belongs to a column that is filtered.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isFiltered(): boolean;
    /**
     * Gets whether the header group is stored in the last column in the pinned area.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isLastPinned(): boolean;
    /**
     * Gets whether the header group is stored in the first column of the right pinned area.
     */
    get isFirstPinned(): boolean;
    get groupDisplayStyle(): string;
    /**
     * Gets whether the header group is stored in a pinned column.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isPinned(): boolean;
    /**
     * Gets whether the header group belongs to a column that is moved.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isHeaderDragged(): boolean;
    /**
     * @hidden
     */
    get hasLastPinnedChildColumn(): boolean;
    /**
     * @hidden
     */
    get hasFirstPinnedChildColumn(): boolean;
    /**
     * @hidden
     */
    get selectable(): boolean;
    /**
     * @hidden
     */
    get selected(): boolean;
    /**
     * @hidden
     */
    get height(): number;
    /**
     * @hidden
     */
    get title(): string;
    get nativeElement(): HTMLElement;
    /**
     * @hidden
     */
    onMouseDown(event: MouseEvent): void;
    /**
     * @hidden
     */
    groupClicked(event: MouseEvent): void;
    /**
     * @hidden @internal
     */
    toggleExpandState(event: MouseEvent): void;
    /**
     * @hidden @internal
     */
    pointerdown(event: PointerEvent): void;
    activate(): void;
    ngDoCheck(): void;
    /**
     * @hidden
     */
    onPinterEnter(): void;
    /**
     * @hidden
     */
    onPointerLeave(): void;
    protected get activeNode(): {
        row: number;
        column: number;
        level: number;
        mchCache: {
            level: number;
            visibleIndex: number;
        };
        layout: {
            rowStart: number;
            colStart: number;
            rowEnd: number;
            colEnd: number;
            columnVisibleIndex: number;
        };
    };
    static ??fac: i0.????FactoryDeclaration<IgxGridHeaderGroupComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxGridHeaderGroupComponent, "igx-grid-header-group", never, { "column": "column"; }, {}, never, never>;
}
