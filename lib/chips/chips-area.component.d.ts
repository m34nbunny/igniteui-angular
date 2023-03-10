import { ChangeDetectorRef, EventEmitter, IterableDiffers, QueryList, DoCheck, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { IgxChipComponent, IChipSelectEventArgs, IChipKeyDownEventArgs, IChipEnterDragAreaEventArgs, IBaseChipEventArgs } from './chip.component';
import { IDropBaseEventArgs, IDragBaseEventArgs } from '../directives/drag-drop/drag-drop.directive';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export interface IBaseChipsAreaEventArgs {
    originalEvent: IDragBaseEventArgs | IDropBaseEventArgs | KeyboardEvent | MouseEvent | TouchEvent;
    owner: IgxChipsAreaComponent;
}
export interface IChipsAreaReorderEventArgs extends IBaseChipsAreaEventArgs {
    chipsArray: IgxChipComponent[];
}
export interface IChipsAreaSelectEventArgs extends IBaseChipsAreaEventArgs {
    newSelection: IgxChipComponent[];
}
/**
 * The chip area allows you to perform more complex scenarios with chips that require interaction,
 * like dragging, selection, navigation, etc.
 *
 * @igxModule IgxChipsModule
 *
 * @igxTheme igx-chip-theme
 *
 * @igxKeywords chip area, chip
 *
 * @igxGroup display
 *
 * @example
 * ```html
 * <igx-chips-area>
 *    <igx-chip *ngFor="let chip of chipList" [id]="chip.id">
 *        <span>{{chip.text}}</span>
 *    </igx-chip>
 * </igx-chips-area>
 * ```
 */
export declare class IgxChipsAreaComponent implements DoCheck, AfterViewInit, OnDestroy {
    cdr: ChangeDetectorRef;
    element: ElementRef;
    private _iterableDiffers;
    /**
     * @hidden
     * @internal
     */
    class: string;
    /**
     * @hidden
     * @internal
     */
    get hostClass(): string;
    /**
     * Returns the `role` attribute of the chips area.
     *
     * @example
     * ```typescript
     * let chipsAreaRole = this.chipsArea.role;
     * ```
     */
    role: string;
    /**
     * Returns the `aria-label` attribute of the chips area.
     *
     * @example
     * ```typescript
     * let ariaLabel = this.chipsArea.ariaLabel;
     * ```
     *
     */
    ariaLabel: string;
    /**
     * An @Input property that sets the width of the `IgxChipsAreaComponent`.
     *
     * @example
     * ```html
     * <igx-chips-area #chipsArea [width]="'300'" [height]="'10'" (onReorder)="chipsOrderChanged($event)"></igx-chips-area>
     * ```
     */
    width: number;
    /**
     * An @Input property that sets the height of the `IgxChipsAreaComponent`.
     *
     * @example
     * ```html
     * <igx-chips-area #chipsArea [width]="'300'" [height]="'10'" (onReorder)="chipsOrderChanged($event)"></igx-chips-area>
     * ```
     */
    height: number;
    /**
     * Emits an event when `IgxChipComponent`s in the `IgxChipsAreaComponent` should be reordered.
     * Returns an array of `IgxChipComponent`s.
     *
     * @example
     * ```html
     * <igx-chips-area #chipsArea [width]="'300'" [height]="'10'" (onReorder)="changedOrder($event)"></igx-chips-area>
     * ```
     */
    reorder: EventEmitter<IChipsAreaReorderEventArgs>;
    /**
     * Emits an event when an `IgxChipComponent` in the `IgxChipsAreaComponent` is selected/deselected.
     * Fired after the chips area is initialized if there are initially selected chips as well.
     * Returns an array of selected `IgxChipComponent`s and the `IgxChipAreaComponent`.
     *
     * @example
     * ```html
     * <igx-chips-area #chipsArea [width]="'300'" [height]="'10'" (selectionChange)="selection($event)"></igx-chips-area>
     * ```
     */
    selectionChange: EventEmitter<IChipsAreaSelectEventArgs>;
    /**
     * Emits an event when an `IgxChipComponent` in the `IgxChipsAreaComponent` is moved.
     *
     * @example
     * ```html
     * <igx-chips-area #chipsArea [width]="'300'" [height]="'10'" (moveStart)="moveStart($event)"></igx-chips-area>
     * ```
     */
    moveStart: EventEmitter<IBaseChipsAreaEventArgs>;
    /**
     * Emits an event after an `IgxChipComponent` in the `IgxChipsAreaComponent` is moved.
     *
     * @example
     * ```html
     * <igx-chips-area #chipsArea [width]="'300'" [height]="'10'" (moveEnd)="moveEnd($event)"></igx-chips-area>
     * ```
     */
    moveEnd: EventEmitter<IBaseChipsAreaEventArgs>;
    /**
     * Holds the `IgxChipComponent` in the `IgxChipsAreaComponent`.
     *
     * @example
     * ```typescript
     * ngAfterViewInit(){
     *    let chips = this.chipsArea.chipsList;
     * }
     * ```
     */
    chipsList: QueryList<IgxChipComponent>;
    protected destroy$: Subject<boolean>;
    private modifiedChipsArray;
    private _differ;
    constructor(cdr: ChangeDetectorRef, element: ElementRef, _iterableDiffers: IterableDiffers);
    /**
     * @hidden
     * @internal
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     * @internal
     */
    ngDoCheck(): void;
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     * @internal
     */
    protected onChipKeyDown(event: IChipKeyDownEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    protected onChipMoveStart(event: IBaseChipEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    protected onChipMoveEnd(event: IBaseChipEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    protected onChipDragEnter(event: IChipEnterDragAreaEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    protected positionChipAtIndex(chipIndex: any, targetIndex: any, shiftRestLeft: any, originalEvent: any): boolean;
    /**
     * @hidden
     * @internal
     */
    protected onChipSelectionChange(event: IChipSelectEventArgs): void;
    static ??fac: i0.????FactoryDeclaration<IgxChipsAreaComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxChipsAreaComponent, "igx-chips-area", never, { "class": "class"; "width": "width"; "height": "height"; }, { "reorder": "reorder"; "selectionChange": "selectionChange"; "moveStart": "moveStart"; "moveEnd": "moveEnd"; }, ["chipsList"], ["*"]>;
}
