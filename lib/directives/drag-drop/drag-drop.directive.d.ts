import { ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Renderer2, ChangeDetectorRef, ViewContainerRef, AfterContentInit, TemplateRef, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { IBaseEventArgs, PlatformUtil } from '../../core/utils';
import { IDropStrategy } from './drag-drop.strategy';
import * as i0 from "@angular/core";
export declare enum DragDirection {
    VERTICAL = 0,
    HORIZONTAL = 1,
    BOTH = 2
}
export interface IgxDragCustomEventDetails {
    startX: number;
    startY: number;
    pageX: number;
    pageY: number;
    owner: IgxDragDirective;
    originalEvent: any;
}
export interface IDropBaseEventArgs extends IBaseEventArgs {
    /**
     * Reference to the original event that caused the draggable element to enter the igxDrop element.
     * Can be PointerEvent, TouchEvent or MouseEvent.
     */
    originalEvent: any;
    /** The owner igxDrop directive that triggered this event. */
    owner: IgxDropDirective;
    /** The igxDrag directive instanced on an element that entered the area of the igxDrop element */
    drag: IgxDragDirective;
    /** The data contained for the draggable element in igxDrag directive. */
    dragData: any;
    /** The initial position of the pointer on X axis when the dragged element began moving */
    startX: number;
    /** The initial position of the pointer on Y axis when the dragged element began moving */
    startY: number;
    /**
     * The current position of the pointer on X axis when the event was triggered.
     * Note: The browser might trigger the event with some delay and pointer would be already inside the igxDrop.
     */
    pageX: number;
    /**
     * The current position of the pointer on Y axis when the event was triggered.
     * Note: The browser might trigger the event with some delay and pointer would be already inside the igxDrop.
     */
    pageY: number;
    /**
     * The current position of the pointer on X axis relative to the container that initializes the igxDrop.
     * Note: The browser might trigger the event with some delay and pointer would be already inside the igxDrop.
     */
    offsetX: number;
    /**
     * The current position of the pointer on Y axis relative to the container that initializes the igxDrop.
     * Note: The browser might trigger the event with some delay and pointer would be already inside the igxDrop.
     */
    offsetY: number;
}
export interface IDropDroppedEventArgs extends IDropBaseEventArgs {
    /** Specifies if the default drop logic related to the event should be canceled. */
    cancel: boolean;
}
export interface IDragBaseEventArgs extends IBaseEventArgs {
    /**
     * Reference to the original event that caused the interaction with the element.
     * Can be PointerEvent, TouchEvent or MouseEvent.
     */
    originalEvent: PointerEvent | MouseEvent | TouchEvent;
    /** The owner igxDrag directive that triggered this event. */
    owner: IgxDragDirective;
    /** The initial position of the pointer on X axis when the dragged element began moving */
    startX: number;
    /** The initial position of the pointer on Y axis when the dragged element began moving */
    startY: number;
    /**
     * The current position of the pointer on X axis when the event was triggered.
     * Note: The browser might trigger the event with some delay and pointer would be already inside the igxDrop.
     */
    pageX: number;
    /**
     * The current position of the pointer on Y axis when the event was triggered.
     * Note: The browser might trigger the event with some delay and pointer would be already inside the igxDrop.
     */
    pageY: number;
}
export interface IDragStartEventArgs extends IDragBaseEventArgs {
    /** Set if the the dragging should be canceled. */
    cancel: boolean;
}
export interface IDragMoveEventArgs extends IDragStartEventArgs {
    /** The new pageX position of the pointer that the igxDrag will use. It can be overridden to limit dragged element X movement. */
    nextPageX: number;
    /** The new pageX position of the pointer that the igxDrag will use. It can be overridden to limit dragged element Y movement. */
    nextPageY: number;
}
export interface IDragGhostBaseEventArgs extends IBaseEventArgs {
    /** The owner igxDrag directive that triggered this event. */
    owner: IgxDragDirective;
    /** Instance to the ghost element that is created when dragging starts. */
    ghostElement: any;
    /** Set if the ghost creation/destruction should be canceled. */
    cancel: boolean;
}
export interface IDragCustomTransitionArgs {
    duration?: number;
    timingFunction?: string;
    delay?: number;
}
export declare class IgxDragLocation {
    private _pageX;
    private _pageY;
    pageX: number;
    pageY: number;
    constructor(_pageX: any, _pageY: any);
}
export declare class IgxDragHandleDirective {
    element: ElementRef<any>;
    baseClass: boolean;
    constructor(element: ElementRef<any>);
    static ??fac: i0.????FactoryDeclaration<IgxDragHandleDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxDragHandleDirective, "[igxDragHandle]", never, {}, {}, never>;
}
export declare class IgxDragIgnoreDirective {
    element: ElementRef<any>;
    baseClass: boolean;
    constructor(element: ElementRef<any>);
    static ??fac: i0.????FactoryDeclaration<IgxDragIgnoreDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxDragIgnoreDirective, "[igxDragIgnore]", never, {}, {}, never>;
}
export declare class IgxDragDirective implements AfterContentInit, OnDestroy {
    cdr: ChangeDetectorRef;
    element: ElementRef;
    viewContainer: ViewContainerRef;
    zone: NgZone;
    renderer: Renderer2;
    protected platformUtil: PlatformUtil;
    /**
     * - Save data inside the `igxDrag` directive. This can be set when instancing `igxDrag` on an element.
     * ```html
     * <div [igxDrag]="{ source: myElement }"></div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    set data(value: any);
    get data(): any;
    /**
     * An @Input property that indicates when the drag should start.
     * By default the drag starts after the draggable element is moved by 5px.
     * ```html
     * <div igxDrag [dragTolerance]="100">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragTolerance: number;
    /**
     * An @Input property that indicates the directions that the element can be dragged.
     * By default it is set to both horizontal and vertical directions.
     * ```html
     * <div igxDrag [dragDirection]="dragDir">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public dragDir = DragDirection.HORIZONTAL;
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragDirection: DragDirection;
    /**
     * An @Input property that provide a way for igxDrag and igxDrop to be linked through channels.
     * It accepts single value or an array of values and evaluates then using strict equality.
     * ```html
     * <div igxDrag [dragChannel]="'odd'">
     *         <span>95</span>
     * </div>
     * <div igxDrop [dropChannel]="['odd', 'irrational']">
     *         <span>Numbers drop area!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragChannel: number | string | number[] | string[];
    /**
     * An @Input property that specifies if the base element should not be moved and a ghost element should be rendered that represents it.
     * By default it is set to `true`.
     * If it is set to `false` when dragging the base element is moved instead and no ghost elements are rendered.
     * ```html
     * <div igxDrag [ghost]="false">
     *      <span>Drag Me!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    ghost: boolean;
    /**
     * Sets a custom class that will be added to the `ghostElement` element.
     * ```html
     * <div igxDrag [ghostClass]="'ghostElement'">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    ghostClass: string;
    /**
     * An @Input property that specifies a template for the ghost element created when dragging starts and `ghost` is true.
     * By default a clone of the base element the igxDrag is instanced is created.
     * ```html
     * <div igxDrag [ghostTemplate]="customGhost">
     *         <span>Drag Me!</span>
     * </div>
     * <ng-template #customGhost>
     *      <div class="customGhostStyle">
     *          <span>I am being dragged!</span>
     *      </div>
     * </ng-template>
     * ```
     *
     * @memberof IgxDragDirective
     */
    ghostTemplate: TemplateRef<any>;
    /**
     * An @Input property that sets the element to which the dragged element will be appended.
     * By default it's set to null and the dragged element is appended to the body.
     * ```html
     * <div #hostDiv></div>
     * <div igxDrag [ghostHost]="hostDiv">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    ghostHost: any;
    /**
     * Event triggered when the draggable element drag starts.
     * ```html
     * <div igxDrag (dragStart)="onDragStart()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public onDragStart(){
     *      alert("The drag has stared!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragStart: EventEmitter<IDragStartEventArgs>;
    /**
     * Event triggered when the draggable element has been moved.
     * ```html
     * <div igxDrag  (dragMove)="onDragMove()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public onDragMove(){
     *      alert("The element has moved!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragMove: EventEmitter<IDragMoveEventArgs>;
    /**
     * Event triggered when the draggable element is released.
     * ```html
     * <div igxDrag (dragEnd)="onDragEnd()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public onDragEnd(){
     *      alert("The drag has ended!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragEnd: EventEmitter<IDragBaseEventArgs>;
    /**
     * Event triggered when the draggable element is clicked.
     * ```html
     * <div igxDrag (dragClick)="onDragClick()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public onDragClick(){
     *      alert("The element has been clicked!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    dragClick: EventEmitter<IDragBaseEventArgs>;
    /**
     * Event triggered when the drag ghost element is created.
     * ```html
     * <div igxDrag (ghostCreate)="ghostCreated()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public ghostCreated(){
     *      alert("The ghost has been created!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    ghostCreate: EventEmitter<IDragGhostBaseEventArgs>;
    /**
     * Event triggered when the drag ghost element is created.
     * ```html
     * <div igxDrag (ghostDestroy)="ghostDestroyed()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public ghostDestroyed(){
     *      alert("The ghost has been destroyed!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    ghostDestroy: EventEmitter<IDragGhostBaseEventArgs>;
    /**
     * Event triggered after the draggable element is released and after its animation has finished.
     * ```html
     * <div igxDrag (transitioned)="onMoveEnd()">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     * ```typescript
     * public onMoveEnd(){
     *      alert("The move has ended!");
     * }
     * ```
     *
     * @memberof IgxDragDirective
     */
    transitioned: EventEmitter<IDragBaseEventArgs>;
    /**
     * @hidden
     */
    dragHandles: QueryList<IgxDragHandleDirective>;
    /**
     * @hidden
     */
    dragIgnoredElems: QueryList<IgxDragIgnoreDirective>;
    /**
     * @hidden
     */
    baseClass: boolean;
    /**
     * @hidden
     */
    selectDisabled: boolean;
    /**
     * Gets the current location of the element relative to the page.
     */
    get location(): IgxDragLocation;
    /**
     * Gets the original location of the element before dragging started.
     */
    get originLocation(): IgxDragLocation;
    /**
     * @hidden
     */
    get pointerEventsEnabled(): boolean;
    /**
     * @hidden
     */
    get touchEventsEnabled(): boolean;
    /**
     * @hidden
     */
    get pageX(): number;
    /**
     * @hidden
     */
    get pageY(): number;
    protected get baseLeft(): number;
    protected get baseTop(): number;
    protected get baseOriginLeft(): number;
    protected get baseOriginTop(): number;
    protected set ghostLeft(pageX: number);
    protected get ghostLeft(): number;
    protected set ghostTop(pageY: number);
    protected get ghostTop(): number;
    /**
     * @hidden
     */
    defaultReturnDuration: string;
    /**
     * @hidden
     */
    ghostElement: any;
    /**
     * @hidden
     */
    animInProgress: boolean;
    protected ghostContext: any;
    protected _startX: number;
    protected _startY: number;
    protected _lastX: number;
    protected _lastY: number;
    protected _dragStarted: boolean;
    /** Drag ghost related properties */
    protected _defaultOffsetX: any;
    protected _defaultOffsetY: any;
    protected _offsetX: any;
    protected _offsetY: any;
    protected _ghostStartX: any;
    protected _ghostStartY: any;
    protected _ghostHostX: number;
    protected _ghostHostY: number;
    protected _dynamicGhostRef: any;
    protected _pointerDownId: any;
    protected _clicked: boolean;
    protected _lastDropArea: any;
    protected _destroy: Subject<boolean>;
    protected _removeOnDestroy: boolean;
    protected _data: any;
    /**
     * An @Input property that specifies the offset of the dragged element relative to the mouse in pixels.
     * By default it's taking the relative position to the mouse when the drag started and keeps it the same.
     * ```html
     * <div #hostDiv></div>
     * <div igxDrag [ghostOffsetX]="0">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    set ghostOffsetX(value: any);
    get ghostOffsetX(): any;
    /**
     * An @Input property that specifies the offset of the dragged element relative to the mouse in pixels.
     * By default it's taking the relative position to the mouse when the drag started and keeps it the same.
     * ```html
     * <div #hostDiv></div>
     * <div igxDrag [ghostOffsetY]="0">
     *         <span>Drag Me!</span>
     * </div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    set ghostOffsetY(value: any);
    get ghostOffsetY(): any;
    constructor(cdr: ChangeDetectorRef, element: ElementRef, viewContainer: ViewContainerRef, zone: NgZone, renderer: Renderer2, platformUtil: PlatformUtil);
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * Sets desired location of the base element or ghost element if rended relative to the document.
     *
     * @param newLocation New location that should be applied. It is advised to get new location using getBoundingClientRects() + scroll.
     */
    setLocation(newLocation: IgxDragLocation): void;
    /**
     * Animates the base or ghost element depending on the `ghost` input to its initial location.
     * If `ghost` is true but there is not ghost rendered, it will be created and animated.
     * If the base element has changed its DOM position its initial location will be changed accordingly.
     *
     * @param customAnimArgs Custom transition properties that will be applied when performing the transition.
     * @param startLocation Start location from where the transition should start.
     */
    transitionToOrigin(customAnimArgs?: IDragCustomTransitionArgs, startLocation?: IgxDragLocation): void;
    /**
     * Animates the base or ghost element to a specific target location or other element using transition.
     * If `ghost` is true but there is not ghost rendered, it will be created and animated.
     * It is recommended to use 'getBoundingClientRects() + pageScroll' when determining desired location.
     *
     * @param target Target that the base or ghost will transition to. It can be either location in the page or another HTML element.
     * @param customAnimArgs Custom transition properties that will be applied when performing the transition.
     * @param startLocation Start location from where the transition should start.
     */
    transitionTo(target: IgxDragLocation | ElementRef, customAnimArgs?: IDragCustomTransitionArgs, startLocation?: IgxDragLocation): void;
    /**
     * @hidden
     * Method bound to the PointerDown event of the base element igxDrag is initialized.
     * @param event PointerDown event captured
     */
    onPointerDown(event: any): void;
    /**
     * @hidden
     * Perform drag move logic when dragging and dispatching events if there is igxDrop under the pointer.
     * This method is bound at first at the base element.
     * If dragging starts and after the ghostElement is rendered the pointerId is reassigned it. Then this method is bound to it.
     * @param event PointerMove event captured
     */
    onPointerMove(event: any): void;
    /**
     * @hidden
     * Perform drag end logic when releasing the ghostElement and dispatching drop event if igxDrop is under the pointer.
     * This method is bound at first at the base element.
     * If dragging starts and after the ghostElement is rendered the pointerId is reassigned to it. Then this method is bound to it.
     * @param event PointerUp event captured
     */
    onPointerUp(event: any): void;
    /**
     * @hidden
     * Execute this method whe the pointer capture has been lost.
     * This means that during dragging the user has performed other action like right clicking and then clicking somewhere else.
     * This method will ensure that the drag state is being reset in this case as if the user released the dragged element.
     * @param event Event captured
     */
    onPointerLost(event: any): void;
    /**
     * @hidden
     */
    onTransitionEnd(event: any): void;
    /**
     * @hidden
     * Create ghost element - if a Node object is provided it creates a clone of that node,
     * otherwise it clones the host element.
     * Bind all needed events.
     * @param pageX Latest pointer position on the X axis relative to the page.
     * @param pageY Latest pointer position on the Y axis relative to the page.
     * @param node The Node object to be cloned.
     */
    protected createGhost(pageX: any, pageY: any, node?: any): void;
    /**
     * @hidden
     * Dispatch custom igxDragEnter/igxDragLeave events based on current pointer position and if drop area is under.
     */
    protected dispatchDragEvents(pageX: number, pageY: number, originalEvent: any): void;
    /**
     * @hidden
     * Dispatch custom igxDrop event based on current pointer position if there is last recorder drop area under the pointer.
     * Last recorder drop area is updated in @dispatchDragEvents method.
     */
    protected dispatchDropEvent(pageX: number, pageY: number, originalEvent: any): void;
    /**
     * @hidden
     */
    protected getElementsAtPoint(pageX: number, pageY: number): any;
    /**
     * @hidden
     */
    protected dispatchEvent(target: any, eventName: string, eventArgs: IgxDragCustomEventDetails): void;
    protected getTransformX(elem: any): number;
    protected getTransformY(elem: any): number;
    /** Method setting transformation to the base draggable element. */
    protected setTransformXY(x: number, y: number): void;
    protected getWindowScrollTop(): number;
    protected getWindowScrollLeft(): number;
    protected ghostHostOffsetLeft(ghostHost: any): number;
    protected ghostHostOffsetTop(ghostHost: any): number;
    static ??fac: i0.????FactoryDeclaration<IgxDragDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxDragDirective, "[igxDrag]", ["drag"], { "data": "igxDrag"; "dragTolerance": "dragTolerance"; "dragDirection": "dragDirection"; "dragChannel": "dragChannel"; "ghost": "ghost"; "ghostClass": "ghostClass"; "ghostTemplate": "ghostTemplate"; "ghostHost": "ghostHost"; "ghostOffsetX": "ghostOffsetX"; "ghostOffsetY": "ghostOffsetY"; }, { "dragStart": "dragStart"; "dragMove": "dragMove"; "dragEnd": "dragEnd"; "dragClick": "dragClick"; "ghostCreate": "ghostCreate"; "ghostDestroy": "ghostDestroy"; "transitioned": "transitioned"; }, ["dragHandles", "dragIgnoredElems"]>;
}
export declare class IgxDropDirective implements OnInit, OnDestroy {
    element: ElementRef;
    private _renderer;
    private _zone;
    /**
     * - Save data inside the `igxDrop` directive. This can be set when instancing `igxDrop` on an element.
     * ```html
     * <div [igxDrop]="{ source: myElement }"></div>
     * ```
     *
     * @memberof IgxDropDirective
     */
    set data(v: any);
    get data(): any;
    /**
     * An @Input property that provide a way for igxDrag and igxDrop to be linked through channels.
     * It accepts single value or an array of values and evaluates then using strict equality.
     * ```html
     * <div igxDrag [dragChannel]="'odd'">
     *         <span>95</span>
     * </div>
     * <div igxDrop [dropChannel]="['odd', 'irrational']">
     *         <span>Numbers drop area!</span>
     * </div>
     * ```
     *
     * @memberof IgxDropDirective
     */
    dropChannel: number | string | number[] | string[];
    /**
     * An @Input property that specifies a drop strategy type that will be executed when an `IgxDrag` element is released inside
     *  the current drop area. The provided strategies are:
     *  - IgxDefaultDropStrategy - This is the default base strategy and it doesn't perform any actions.
     *  - IgxAppendDropStrategy - Appends the dropped element to last position as a direct child to the `igxDrop`.
     *  - IgxPrependDropStrategy - Prepends the dropped element to first position as a direct child to the `igxDrop`.
     *  - IgxInsertDropStrategy - If the dropped element is released above a child element of the `igxDrop`, it will be inserted
     *      at that position. Otherwise the dropped element will be appended if released outside any child of the `igxDrop`.
     * ```html
     * <div igxDrag>
     *      <span>DragMe</span>
     * </div>
     * <div igxDrop [dropStrategy]="myDropStrategy">
     *         <span>Numbers drop area!</span>
     * </div>
     * ```
     * ```typescript
     * import { IgxAppendDropStrategy } from 'igniteui-angular';
     *
     * export class App {
     *      public myDropStrategy = IgxAppendDropStrategy;
     * }
     * ```
     *
     * @memberof IgxDropDirective
     */
    set dropStrategy(classRef: any);
    get dropStrategy(): any;
    /**
     * Event triggered when dragged element enters the area of the element.
     * ```html
     * <div class="cageArea" igxDrop (enter)="dragEnter()" (igxDragEnter)="onDragCageEnter()" (igxDragLeave)="onDragCageLeave()">
     * </div>
     * ```
     * ```typescript
     * public dragEnter(){
     *     alert("A draggable element has entered the chip area!");
     * }
     * ```
     *
     * @memberof IgxDropDirective
     */
    enter: EventEmitter<IDropBaseEventArgs>;
    /**
     * Event triggered when dragged element enters the area of the element.
     * ```html
     * <div class="cageArea" igxDrop (enter)="dragEnter()" (igxDragEnter)="onDragCageEnter()" (igxDragLeave)="onDragCageLeave()">
     * </div>
     * ```
     * ```typescript
     * public dragEnter(){
     *     alert("A draggable element has entered the chip area!");
     * }
     * ```
     *
     * @memberof IgxDropDirective
     */
    over: EventEmitter<IDropBaseEventArgs>;
    /**
     * Event triggered when dragged element leaves the area of the element.
     * ```html
     * <div class="cageArea" igxDrop (leave)="dragLeave()" (igxDragEnter)="onDragCageEnter()" (igxDragLeave)="onDragCageLeave()">
     * </div>
     * ```
     * ```typescript
     * public dragLeave(){
     *     alert("A draggable element has left the chip area!");
     * }
     * ```
     *
     * @memberof IgxDropDirective
     */
    leave: EventEmitter<IDropBaseEventArgs>;
    /**
     * Event triggered when dragged element is dropped in the area of the element.
     * Since the `igxDrop` has default logic that appends the dropped element as a child, it can be canceled here.
     * To cancel the default logic the `cancel` property of the event needs to be set to true.
     * ```html
     * <div class="cageArea" igxDrop (dropped)="dragDrop()" (igxDragEnter)="onDragCageEnter()" (igxDragLeave)="onDragCageLeave()">
     * </div>
     * ```
     * ```typescript
     * public dragDrop(){
     *     alert("A draggable element has been dropped in the chip area!");
     * }
     * ```
     *
     * @memberof IgxDropDirective
     */
    dropped: EventEmitter<IDropDroppedEventArgs>;
    /**
     * @hidden
     */
    droppable: boolean;
    /**
     * @hidden
     */
    dragover: boolean;
    /**
     * @hidden
     */
    protected _destroy: Subject<boolean>;
    protected _dropStrategy: IDropStrategy;
    private _data;
    constructor(element: ElementRef, _renderer: Renderer2, _zone: NgZone);
    /**
     * @hidden
     */
    onDragDrop(event: any): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    onDragOver(event: any): void;
    /**
     * @hidden
     */
    onDragEnter(event: CustomEvent<IgxDragCustomEventDetails>): void;
    /**
     * @hidden
     */
    onDragLeave(event: any): void;
    protected getWindowScrollTop(): number;
    protected getWindowScrollLeft(): number;
    protected isDragLinked(drag: IgxDragDirective): boolean;
    protected getInsertIndexAt(draggedDir: IgxDragDirective, elementsAtPoint: any[]): number;
    static ??fac: i0.????FactoryDeclaration<IgxDropDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxDropDirective, "[igxDrop]", ["drop"], { "data": "igxDrop"; "dropChannel": "dropChannel"; "dropStrategy": "dropStrategy"; }, { "enter": "enter"; "over": "over"; "leave": "leave"; "dropped": "dropped"; }, never>;
}
/**
 * @hidden
 */
export declare class IgxDragDropModule {
    static ??fac: i0.????FactoryDeclaration<IgxDragDropModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxDragDropModule, [typeof IgxDragDirective, typeof IgxDropDirective, typeof IgxDragHandleDirective, typeof IgxDragIgnoreDirective], never, [typeof IgxDragDirective, typeof IgxDropDirective, typeof IgxDragHandleDirective, typeof IgxDragIgnoreDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxDragDropModule>;
}
