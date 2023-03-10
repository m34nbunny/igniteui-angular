import { AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { ColumnType } from '../common/grid.interface';
import { IgxColumnResizingService } from './resizing.service';
import * as i0 from "@angular/core";
/**
 * @hidden
 * @internal
 */
export declare class IgxResizeHandleDirective implements AfterViewInit, OnDestroy {
    protected zone: NgZone;
    protected element: ElementRef;
    colResizingService: IgxColumnResizingService;
    /**
     * @hidden
     */
    column: ColumnType;
    /**
     * @hidden
     */
    protected _dblClick: boolean;
    /**
     * @hidden
     */
    private destroy$;
    private readonly DEBOUNCE_TIME;
    constructor(zone: NgZone, element: ElementRef, colResizingService: IgxColumnResizingService);
    /**
     * @hidden
     */
    onMouseOver(): void;
    /**
     * @hidden
     */
    onDoubleClick(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    private _onResizeAreaMouseDown;
    /**
     * @hidden
     */
    protected initResizeService(event?: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxResizeHandleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxResizeHandleDirective, "[igxResizeHandle]", never, { "column": "igxResizeHandle"; }, {}, never>;
}
