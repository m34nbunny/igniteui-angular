import { QueryList, AfterContentInit, ElementRef, EventEmitter } from '@angular/core';
import { IgxSplitterPaneComponent } from './splitter-pane/splitter-pane.component';
import { DragDirection, IDragMoveEventArgs, IDragStartEventArgs } from '../directives/drag-drop/drag-drop.directive';
import * as i0 from "@angular/core";
/**
 * An enumeration that defines the `SplitterComponent` panes orientation.
 */
export declare enum SplitterType {
    Horizontal = 0,
    Vertical = 1
}
export declare interface ISplitterBarResizeEventArgs {
    pane: IgxSplitterPaneComponent;
    sibling: IgxSplitterPaneComponent;
}
/**
 * Provides a framework for a simple layout, splitting the view horizontally or vertically
 * into multiple smaller resizable and collapsible areas.
 *
 * @igxModule IgxSplitterModule
 *
 * @igxParent Layouts
 *
 * @igxTheme igx-splitter-theme
 *
 * @igxKeywords splitter panes layout
 *
 * @igxGroup presentation
 *
 * @example
 * ```html
 * <igx-splitter>
 *  <igx-splitter-pane>
 *      ...
 *  </igx-splitter-pane>
 *  <igx-splitter-pane>
 *      ...
 *  </igx-splitter-pane>
 * </igx-splitter>
 * ```
 */
export declare class IgxSplitterComponent implements AfterContentInit {
    document: any;
    private elementRef;
    /**
     * Gets the list of splitter panes.
     *
     * @example
     * ```typescript
     * const panes = this.splitter.panes;
     * ```
     */
    panes: QueryList<IgxSplitterPaneComponent>;
    /**
     * @hidden @internal
     * Gets/Sets the `overflow` property of the current splitter.
     */
    overflow: string;
    /**
     * @hidden @internal
     * Sets/Gets the `display` property of the current splitter.
     */
    display: string;
    /**
     * Event fired when resizing of panes starts.
     *
     * @example
     * ```html
     * <igx-splitter (resizeStart)='resizeStart($event)'>
     *  <igx-splitter-pane>...</igx-splitter-pane>
     * </igx-splitter>
     * ```
     */
    resizeStart: EventEmitter<ISplitterBarResizeEventArgs>;
    /**
     * Event fired when resizing of panes is in progress.
     *
     * @example
     * ```html
     * <igx-splitter (resizing)='resizing($event)'>
     *  <igx-splitter-pane>...</igx-splitter-pane>
     * </igx-splitter>
     * ```
     */
    resizing: EventEmitter<ISplitterBarResizeEventArgs>;
    /**
     * Event fired when resizing of panes ends.
     *
     * @example
     * ```html
     * <igx-splitter (resizeEnd)='resizeEnd($event)'>
     *  <igx-splitter-pane>...</igx-splitter-pane>
     * </igx-splitter>
     * ```
     */
    resizeEnd: EventEmitter<ISplitterBarResizeEventArgs>;
    private _type;
    /**
     * @hidden @internal
     * A field that holds the initial size of the main `IgxSplitterPaneComponent` in each pair of panes divided by a splitter bar.
     */
    private initialPaneSize;
    /**
     * @hidden @internal
     * A field that holds the initial size of the sibling pane in each pair of panes divided by a gripper.
     * @memberof SplitterComponent
     */
    private initialSiblingSize;
    /**
     * @hidden @internal
     * The main pane in each pair of panes divided by a gripper.
     */
    private pane;
    /**
     * The sibling pane in each pair of panes divided by a splitter bar.
     */
    private sibling;
    constructor(document: any, elementRef: ElementRef);
    /**
     * Gets/Sets the splitter orientation.
     *
     * @example
     * ```html
     * <igx-splitter [type]="type">...</igx-splitter>
     * ```
     */
    get type(): SplitterType;
    set type(value: SplitterType);
    /**
     * @hidden @internal
     * Gets the `flex-direction` property of the current `SplitterComponent`.
     */
    get direction(): string;
    /** @hidden @internal */
    ngAfterContentInit(): void;
    /**
     * @hidden @internal
     * This method performs  initialization logic when the user starts dragging the splitter bar between each pair of panes.
     * @param pane - the main pane associated with the currently dragged bar.
     */
    onMoveStart(pane: IgxSplitterPaneComponent): void;
    /**
     * @hidden @internal
     * This method performs calculations concerning the sizes of each pair of panes when the bar between them is dragged.
     * @param delta - The difference along the X (or Y) axis between the initial and the current point when dragging the bar.
     */
    onMoving(delta: number): void;
    onMoveEnd(delta: number): void;
    /** @hidden @internal */
    getPaneSiblingsByOrder(order: number, barIndex: number): Array<IgxSplitterPaneComponent>;
    private getTotalSize;
    /**
     * @hidden @internal
     * This method inits panes with properties.
     */
    private initPanes;
    /**
     * @hidden @internal
     * This method reset pane sizes.
     */
    private resetPaneSizes;
    /**
     * @hidden @internal
     * This method assigns the order of each pane.
     */
    private assignFlexOrder;
    static ??fac: i0.????FactoryDeclaration<IgxSplitterComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxSplitterComponent, "igx-splitter", never, { "type": "type"; }, { "resizeStart": "resizeStart"; "resizing": "resizing"; "resizeEnd": "resizeEnd"; }, ["panes"], ["igx-splitter-pane"]>;
}
export declare const SPLITTER_INTERACTION_KEYS: Set<string>;
/**
 * @hidden @internal
 * Represents the draggable bar that visually separates panes and allows for changing their sizes.
 */
export declare class IgxSplitBarComponent {
    /**
     * Set css class to the host element.
     */
    cssClass: string;
    /**
     * Gets/Sets the orientation.
     */
    type: SplitterType;
    /**
     * Sets/gets the element order.
     */
    order: number;
    /**
     * @hidden
     * @internal
     */
    get tabindex(): number;
    /**
     * @hidden
     * @internal
     */
    get orientation(): "horizontal" | "vertical";
    /**
     * @hidden
     * @internal
     */
    get cursor(): "" | "col-resize" | "row-resize";
    /**
     * Sets/gets the `SplitPaneComponent` associated with the current `SplitBarComponent`.
     *
     * @memberof SplitBarComponent
     */
    pane: IgxSplitterPaneComponent;
    /**
     * Sets/Gets the `SplitPaneComponent` sibling components associated with the current `SplitBarComponent`.
     */
    siblings: Array<IgxSplitterPaneComponent>;
    /**
     * An event that is emitted whenever we start dragging the current `SplitBarComponent`.
     */
    moveStart: EventEmitter<IgxSplitterPaneComponent>;
    /**
     * An event that is emitted while we are dragging the current `SplitBarComponent`.
     */
    moving: EventEmitter<number>;
    movingEnd: EventEmitter<number>;
    /**
     * A temporary holder for the pointer coordinates.
     */
    private startPoint;
    /**
     * @hidden @internal
     */
    get prevButtonHidden(): boolean;
    /**
     * @hidden @internal
     */
    keyEvent(event: KeyboardEvent): void;
    /**
     * @hidden @internal
     */
    get dragDir(): DragDirection.VERTICAL | DragDirection.HORIZONTAL;
    /**
     * @hidden @internal
     */
    get nextButtonHidden(): boolean;
    /**
     * @hidden @internal
     */
    onDragStart(event: IDragStartEventArgs): void;
    /**
     * @hidden @internal
     */
    onDragMove(event: IDragMoveEventArgs): void;
    onDragEnd(event: any): void;
    protected get resizeDisallowed(): boolean;
    /**
     * @hidden @internal
     */
    onCollapsing(next: boolean): void;
    static ??fac: i0.????FactoryDeclaration<IgxSplitBarComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxSplitBarComponent, "igx-splitter-bar", never, { "type": "type"; "order": "order"; "pane": "pane"; "siblings": "siblings"; }, { "moveStart": "moveStart"; "moving": "moving"; "movingEnd": "movingEnd"; }, never, never>;
}
