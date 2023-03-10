import { ElementRef, NgZone } from '@angular/core';
import { ColumnType } from '../../common/grid.interface';
import { PivotRowHeaderGroupType } from '../../pivot-grid/pivot-grid.interface';
import { IgxPivotColumnResizingService } from './pivot-resizing.service';
import { IgxResizeHandleDirective } from '../resize-handle.directive';
import * as i0 from "@angular/core";
/**
 * @hidden
 * @internal
 */
export declare class IgxPivotResizeHandleDirective extends IgxResizeHandleDirective {
    protected zone: NgZone;
    protected element: ElementRef;
    colResizingService: IgxPivotColumnResizingService;
    /**
     * @hidden
     */
    set pivotColumn(value: ColumnType);
    get pivotColumn(): ColumnType;
    /**
     * @hidden
     */
    rowHeaderGroup: PivotRowHeaderGroupType;
    constructor(zone: NgZone, element: ElementRef, colResizingService: IgxPivotColumnResizingService);
    /**
     * @hidden
     */
    onDoubleClick(): void;
    /**
     * @hidden
     */
    protected initResizeService(event?: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPivotResizeHandleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxPivotResizeHandleDirective, "[igxPivotResizeHandle]", never, { "pivotColumn": "igxPivotResizeHandle"; "rowHeaderGroup": "igxPivotResizeHandleHeader"; }, {}, never>;
}
