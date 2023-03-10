import { OnDestroy, ElementRef, ViewContainerRef, NgZone, Renderer2, ChangeDetectorRef } from '@angular/core';
import { IgxDragDirective } from '../../directives/drag-drop/drag-drop.directive';
import { PlatformUtil } from '../../core/utils';
import { IgxColumnMovingService } from './moving.service';
import { ColumnType } from '../common/grid.interface';
import * as i0 from "@angular/core";
/**
 * @hidden
 * @internal
 */
export declare class IgxColumnMovingDragDirective extends IgxDragDirective implements OnDestroy {
    element: ElementRef<HTMLElement>;
    viewContainer: ViewContainerRef;
    zone: NgZone;
    renderer: Renderer2;
    cdr: ChangeDetectorRef;
    private cms;
    column: ColumnType;
    get draggable(): boolean;
    get icon(): HTMLElement;
    protected _data: any;
    private subscription$;
    private _ghostClass;
    private ghostImgIconClass;
    private ghostImgIconGroupClass;
    private columnSelectedClass;
    constructor(element: ElementRef<HTMLElement>, viewContainer: ViewContainerRef, zone: NgZone, renderer: Renderer2, cdr: ChangeDetectorRef, cms: IgxColumnMovingService, _platformUtil: PlatformUtil);
    ngOnDestroy(): void;
    onEscape(event: Event): void;
    onPointerDown(event: Event): void;
    onPointerMove(event: Event): void;
    onPointerUp(event: Event): void;
    protected createGhost(pageX: number, pageY: number): void;
    private _unsubscribe;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxColumnMovingDragDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxColumnMovingDragDirective, "[igxColumnMovingDrag]", never, { "column": "igxColumnMovingDrag"; }, {}, never>;
}
