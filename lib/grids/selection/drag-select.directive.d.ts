import { EventEmitter, ElementRef, OnDestroy, NgZone, OnInit } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import * as i0 from "@angular/core";
declare enum DragScrollDirection {
    NONE = 0,
    LEFT = 1,
    TOP = 2,
    RIGHT = 3,
    BOTTOM = 4,
    TOPLEFT = 5,
    TOPRIGHT = 6,
    BOTTOMLEFT = 7,
    BOTTOMRIGHT = 8
}
/**
 * An internal directive encapsulating the drag scroll behavior in the grid.
 *
 * @hidden @internal
 */
export declare class IgxGridDragSelectDirective implements OnInit, OnDestroy {
    private ref;
    private zone;
    dragStop: EventEmitter<boolean>;
    dragScroll: EventEmitter<{
        left: number;
        top: number;
    }>;
    get activeDrag(): boolean;
    set activeDrag(val: boolean);
    get nativeElement(): HTMLElement;
    protected end$: Subject<any>;
    protected lastDirection: DragScrollDirection;
    protected _interval$: Observable<any>;
    protected _sub: Subscription;
    private _activeDrag;
    constructor(ref: ElementRef<HTMLElement>, zone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected startDragSelection: (ev: PointerEvent) => void;
    protected stopDragSelection: () => void;
    protected _measureDimensions(x: number, y: number): {
        direction: DragScrollDirection;
        delta: {
            left: number;
            top: number;
        };
    };
    protected unsubscribe(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridDragSelectDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxGridDragSelectDirective, "[igxGridDragSelect]", never, { "activeDrag": "igxGridDragSelect"; }, { "dragStop": "dragStop"; "dragScroll": "dragScroll"; }, never>;
}
export {};
