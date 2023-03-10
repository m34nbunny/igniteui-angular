import { NgForOfContext } from '@angular/common';
import { ChangeDetectorRef, ComponentRef, DoCheck, EmbeddedViewRef, EventEmitter, IterableChanges, IterableDiffer, IterableDiffers, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, TrackByFunction, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DisplayContainerComponent } from './display.container';
import { IgxForOfSyncService, IgxForOfScrollSyncService } from './for_of.sync.service';
import { Subject } from 'rxjs';
import { IBaseEventArgs, PlatformUtil } from '../../core/utils';
import { VirtualHelperBaseDirective } from './base.helper.component';
import * as i0 from "@angular/core";
import * as i1 from "./display.container";
import * as i2 from "./virtual.helper.component";
import * as i3 from "./horizontal.virtual.helper.component";
import * as i4 from "./base.helper.component";
import * as i5 from "../scroll-inertia/scroll_inertia.directive";
import * as i6 from "@angular/common";
/**
 *  @publicApi
 */
export declare class IgxForOfContext<T> {
    $implicit: T;
    index: number;
    count: number;
    constructor($implicit: T, index: number, count: number);
    /**
     * A function that returns whether the element is the first or not
     */
    get first(): boolean;
    /**
     * A function that returns whether the element is the last or not
     */
    get last(): boolean;
    /**
     * A function that returns whether the element is even or not
     */
    get even(): boolean;
    /**
     * A function that returns whether the element is odd or not
     */
    get odd(): boolean;
}
export declare class IgxForOfDirective<T> implements OnInit, OnChanges, DoCheck, OnDestroy, AfterViewInit {
    private _viewContainer;
    protected _template: TemplateRef<NgForOfContext<T>>;
    protected _differs: IterableDiffers;
    cdr: ChangeDetectorRef;
    protected _zone: NgZone;
    protected syncScrollService: IgxForOfScrollSyncService;
    protected platformUtil: PlatformUtil;
    protected document: any;
    /**
     * An @Input property that sets the data to be rendered.
     * ```html
     * <ng-template igxFor let-item [igxForOf]="data" [igxForScrollOrientation]="'horizontal'"></ng-template>
     * ```
     */
    igxForOf: any[] | null;
    /**
     * An @Input property that sets the property name from which to read the size in the data object.
     */
    igxForSizePropName: any;
    /**
     * An @Input property that specifies the scroll orientation.
     * Scroll orientation can be "vertical" or "horizontal".
     * ```html
     * <ng-template igxFor let-item [igxForOf]="data" [igxForScrollOrientation]="'horizontal'"></ng-template>
     * ```
     */
    igxForScrollOrientation: string;
    /**
     * Optionally pass the parent `igxFor` instance to create a virtual template scrolling both horizontally and vertically.
     * ```html
     * <ng-template #scrollContainer igxFor let-rowData [igxForOf]="data"
     *       [igxForScrollOrientation]="'vertical'"
     *       [igxForContainerSize]="'500px'"
     *       [igxForItemSize]="'50px'"
     *       let-rowIndex="index">
     *       <div [style.display]="'flex'" [style.height]="'50px'">
     *           <ng-template #childContainer igxFor let-item [igxForOf]="data"
     *               [igxForScrollOrientation]="'horizontal'"
     *               [igxForScrollContainer]="parentVirtDir"
     *               [igxForContainerSize]="'500px'">
     *                   <div [style.min-width]="'50px'">{{rowIndex}} : {{item.text}}</div>
     *           </ng-template>
     *       </div>
     * </ng-template>
     * ```
     */
    igxForScrollContainer: any;
    /**
     * An @Input property that sets the px-affixed size of the container along the axis of scrolling.
     * For "horizontal" orientation this value is the width of the container and for "vertical" is the height.
     * ```html
     * <ng-template igxFor let-item [igxForOf]="data" [igxForContainerSize]="'500px'"
     *      [igxForScrollOrientation]="'horizontal'">
     * </ng-template>
     * ```
     */
    igxForContainerSize: any;
    /**
     * An @Input property that sets the px-affixed size of the item along the axis of scrolling.
     * For "horizontal" orientation this value is the width of the column and for "vertical" is the height or the row.
     * ```html
     * <ng-template igxFor let-item [igxForOf]="data" [igxForScrollOrientation]="'horizontal'" [igxForItemSize]="'50px'"></ng-template>
     * ```
     */
    igxForItemSize: any;
    /**
     * An event that is emitted after a new chunk has been loaded.
     * ```html
     * <ng-template igxFor [igxForOf]="data" [igxForScrollOrientation]="'horizontal'" (chunkLoad)="loadChunk($event)"></ng-template>
     * ```
     * ```typescript
     * loadChunk(e){
     * alert("chunk loaded!");
     * }
     * ```
     */
    chunkLoad: EventEmitter<IForOfState>;
    /**
     * @hidden @internal
     * An event that is emitted when scrollbar visibility has changed.
     */
    scrollbarVisibilityChanged: EventEmitter<any>;
    /**
     * An event that is emitted after the rendered content size of the igxForOf has been changed.
     */
    contentSizeChange: EventEmitter<any>;
    /**
     * An event that is emitted after data has been changed.
     * ```html
     * <ng-template igxFor [igxForOf]="data" [igxForScrollOrientation]="'horizontal'" (dataChanged)="dataChanged($event)"></ng-template>
     * ```
     * ```typescript
     * dataChanged(e){
     * alert("data changed!");
     * }
     * ```
     */
    dataChanged: EventEmitter<any>;
    beforeViewDestroyed: EventEmitter<EmbeddedViewRef<any>>;
    /**
     * An event that is emitted on chunk loading to emit the current state information - startIndex, endIndex, totalCount.
     * Can be used for implementing remote load on demand for the igxFor data.
     * ```html
     * <ng-template igxFor [igxForOf]="data" [igxForScrollOrientation]="'horizontal'" (chunkPreload)="chunkPreload($event)"></ng-template>
     * ```
     * ```typescript
     * chunkPreload(e){
     * alert("chunk is loading!");
     * }
     * ```
     */
    chunkPreload: EventEmitter<IForOfState>;
    /**
     * @hidden
     */
    dc: ComponentRef<DisplayContainerComponent>;
    /**
     * The current state of the directive. It contains `startIndex` and `chunkSize`.
     * state.startIndex - The index of the item at which the current visible chunk begins.
     * state.chunkSize - The number of items the current visible chunk holds.
     * These options can be used when implementing remote virtualization as they provide the necessary state information.
     * ```typescript
     * const gridState = this.parentVirtDir.state;
     * ```
     */
    state: IForOfState;
    protected func: any;
    protected _sizesCache: number[];
    protected scrollComponent: VirtualHelperBaseDirective;
    protected _differ: IterableDiffer<T> | null;
    protected _trackByFn: TrackByFunction<T>;
    protected heightCache: any[];
    /** Internal track for scroll top that is being virtualized */
    protected _virtScrollTop: number;
    /** If the next onScroll event is triggered due to internal setting of scrollTop */
    protected _bScrollInternal: boolean;
    protected _embeddedViews: Array<EmbeddedViewRef<any>>;
    protected contentResizeNotify: Subject<unknown>;
    protected contentObserver: ResizeObserver;
    /** Height that is being virtualized. */
    protected _virtHeight: number;
    /**
     * @hidden
     */
    protected destroy$: Subject<any>;
    private _totalItemCount;
    private _adjustToIndex;
    /** Maximum height for an element of the browser. */
    private _maxHeight;
    /**
     * Ratio for height that's being virtualizaed and the one visible
     * If _virtHeightRatio = 1, the visible height and the virtualized are the same, also _maxHeight > _virtHeight.
     */
    private _virtHeightRatio;
    /**
     * The total count of the virtual data items, when using remote service.
     * Similar to the property totalItemCount, but this will allow setting the data count into the template.
     * ```html
     * <ng-template igxFor let-item [igxForOf]="data | async" [igxForTotalItemCount]="count | async"
     *  [igxForContainerSize]="'500px'" [igxForItemSize]="'50px'"></ng-template>
     * ```
     */
    get igxForTotalItemCount(): number;
    set igxForTotalItemCount(value: number);
    /**
     * The total count of the virtual data items, when using remote service.
     * ```typescript
     * this.parentVirtDir.totalItemCount = data.Count;
     * ```
     */
    get totalItemCount(): number;
    set totalItemCount(val: number);
    get displayContainer(): HTMLElement | undefined;
    get virtualHelper(): HTMLElement;
    /**
     * @hidden
     */
    get isRemote(): boolean;
    /**
     *
     * Gets/Sets the scroll position.
     * ```typescript
     * const position = directive.scrollPosition;
     * directive.scrollPosition = value;
     * ```
     */
    get scrollPosition(): number;
    set scrollPosition(val: number);
    /**
     * @hidden
     */
    protected get isRTL(): boolean;
    protected get sizesCache(): number[];
    protected set sizesCache(value: number[]);
    private get _isScrolledToBottom();
    private get _isAtBottomIndex();
    constructor(_viewContainer: ViewContainerRef, _template: TemplateRef<NgForOfContext<T>>, _differs: IterableDiffers, cdr: ChangeDetectorRef, _zone: NgZone, syncScrollService: IgxForOfScrollSyncService, platformUtil: PlatformUtil, document: any);
    verticalScrollHandler(event: any): void;
    isScrollable(): boolean;
    /**
     * @hidden
     */
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @hidden
     */
    ngDoCheck(): void;
    /**
     * Shifts the scroll thumb position.
     * ```typescript
     * this.parentVirtDir.addScrollTop(5);
     * ```
     *
     * @param addTop negative value to scroll up and positive to scroll down;
     */
    addScrollTop(addTop: number): boolean;
    /**
     * Scrolls to the specified index.
     * ```typescript
     * this.parentVirtDir.scrollTo(5);
     * ```
     *
     * @param index
     */
    scrollTo(index: any): void;
    /**
     * Scrolls by one item into the appropriate next direction.
     * For "horizontal" orientation that will be the right column and for "vertical" that is the lower row.
     * ```typescript
     * this.parentVirtDir.scrollNext();
     * ```
     */
    scrollNext(): void;
    /**
     * Scrolls by one item into the appropriate previous direction.
     * For "horizontal" orientation that will be the left column and for "vertical" that is the upper row.
     * ```typescript
     * this.parentVirtDir.scrollPrev();
     * ```
     */
    scrollPrev(): void;
    /**
     * Scrolls by one page into the appropriate next direction.
     * For "horizontal" orientation that will be one view to the right and for "vertical" that is one view to the bottom.
     * ```typescript
     * this.parentVirtDir.scrollNextPage();
     * ```
     */
    scrollNextPage(): void;
    /**
     * Scrolls by one page into the appropriate previous direction.
     * For "horizontal" orientation that will be one view to the left and for "vertical" that is one view to the top.
     * ```typescript
     * this.parentVirtDir.scrollPrevPage();
     * ```
     */
    scrollPrevPage(): void;
    /**
     * @hidden
     */
    getColumnScrollLeft(colIndex: any): number;
    /**
     * Returns the total number of items that are fully visible.
     * ```typescript
     * this.parentVirtDir.getItemCountInView();
     * ```
     */
    getItemCountInView(): number;
    /**
     * Returns a reference to the scrollbar DOM element.
     * This is either a vertical or horizontal scrollbar depending on the specified igxForScrollOrientation.
     * ```typescript
     * dir.getScroll();
     * ```
     */
    getScroll(): HTMLElement;
    /**
     * Returns the size of the element at the specified index.
     * ```typescript
     * this.parentVirtDir.getSizeAt(1);
     * ```
     */
    getSizeAt(index: number): number;
    /**
     * @hidden
     * Function that is called to get the native scrollbar size that the browsers renders.
     */
    getScrollNativeSize(): number;
    /**
     * Returns the scroll offset of the element at the specified index.
     * ```typescript
     * this.parentVirtDir.getScrollForIndex(1);
     * ```
     */
    getScrollForIndex(index: number, bottom?: boolean): number;
    /**
     * Returns the index of the element at the specified offset.
     * ```typescript
     * this.parentVirtDir.getIndexAtScroll(100);
     * ```
     */
    getIndexAtScroll(scrollOffset: number): number;
    /**
     * Returns whether the target index is outside the view.
     * ```typescript
     * this.parentVirtDir.isIndexOutsideView(10);
     * ```
     */
    isIndexOutsideView(index: number): boolean;
    /**
     * @hidden
     * Function that recalculates and updates cache sizes.
     */
    recalcUpdateSizes(): void;
    /**
     * @hidden
     * Reset scroll position.
     * Needed in case scrollbar is hidden/detached but we still need to reset it.
     */
    resetScrollPosition(): void;
    /**
     * @hidden
     */
    protected removeScrollEventListeners(): void;
    /**
     * @hidden
     * Function that is called when scrolling vertically
     */
    protected onScroll(event: any): void;
    protected updateSizes(): void;
    /**
     * @hidden
     */
    protected fixedUpdateAllElements(inScrollTop: number): number;
    /**
     * @hidden
     * The function applies an optimized state change for scrolling down/right employing context change with view rearrangement
     */
    protected moveApplyScrollNext(prevIndex: number): void;
    /**
     * @hidden
     * The function applies an optimized state change for scrolling up/left employing context change with view rearrangement
     */
    protected moveApplyScrollPrev(prevIndex: number): void;
    /**
     * @hidden
     */
    protected getContextIndex(input: any): number;
    /**
     * @hidden
     * Function which updates the passed context of an embedded view with the provided index
     * from the view container.
     * Often, called while handling a scroll event.
     */
    protected updateTemplateContext(context: any, index?: number): void;
    /**
     * @hidden
     * The function applies an optimized state change through context change for each view
     */
    protected fixedApplyScroll(): void;
    /**
     * @hidden
     * @internal
     *
     * Clears focus inside the virtualized container on small scroll swaps.
     */
    protected scrollFocus(node?: HTMLElement): void;
    /**
     * @hidden
     * Function that is called when scrolling horizontally
     */
    protected onHScroll(event: any): void;
    /**
     * Gets the function used to track changes in the items collection.
     * By default the object references are compared. However this can be optimized if you have unique identifier
     * value that can be used for the comparison instead of the object ref or if you have some other property values
     * in the item object that should be tracked for changes.
     * This option is similar to ngForTrackBy.
     * ```typescript
     * const trackFunc = this.parentVirtDir.igxForTrackBy;
     * ```
     */
    get igxForTrackBy(): TrackByFunction<T>;
    /**
     * Sets the function used to track changes in the items collection.
     * This function can be set in scenarios where you want to optimize or
     * customize the tracking of changes for the items in the collection.
     * The igxForTrackBy function takes the index and the current item as arguments and needs to return the unique identifier for this item.
     * ```typescript
     * this.parentVirtDir.igxForTrackBy = (index, item) => {
     *      return item.id + item.width;
     * };
     * ```
     */
    set igxForTrackBy(fn: TrackByFunction<T>);
    /**
     * @hidden
     */
    protected _applyChanges(): void;
    /**
     * @hidden
     */
    protected _calcMaxBrowserHeight(): number;
    /**
     * @hidden
     * Recalculates the chunkSize based on current startIndex and returns the new size.
     * This should be called after this.state.startIndex is updated, not before.
     */
    protected _calculateChunkSize(): number;
    /**
     * @hidden
     */
    protected getElement(viewref: any, nodeName: any): any;
    /**
     * @hidden
     */
    protected initSizesCache(items: any[]): number;
    protected _updateSizeCache(): void;
    /**
     * @hidden
     */
    protected _calcMaxChunkSize(): number;
    /**
     * @hidden
     */
    protected getIndexAt(left: any, set: any): number;
    protected _recalcScrollBarSize(): void;
    protected _calcHeight(): number;
    protected _recalcOnContainerChange(): void;
    /**
     * @hidden
     * Removes an element from the embedded views and updates chunkSize.
     */
    protected removeLastElem(): void;
    /**
     * @hidden
     * If there exists an element that we can create embedded view for creates it, appends it and updates chunkSize
     */
    protected addLastElem(): void;
    /**
     * Recalculates chunkSize and adds/removes elements if need due to the change.
     * this.state.chunkSize is updated in @addLastElem() or @removeLastElem()
     */
    protected applyChunkSizeChange(): void;
    protected _updateScrollOffset(): void;
    protected _calcVirtualScrollTop(scrollTop: number): void;
    protected _getItemSize(item: any, dimension: string): number;
    private _updateVScrollOffset;
    private _updateHScrollOffset;
    protected _adjustScrollPositionAfterSizeChange(sizeDiff: any): void;
    private getMargin;
    static ??fac: i0.????FactoryDeclaration<IgxForOfDirective<any>, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxForOfDirective<any>, "[igxFor][igxForOf]", never, { "igxForOf": "igxForOf"; "igxForSizePropName": "igxForSizePropName"; "igxForScrollOrientation": "igxForScrollOrientation"; "igxForScrollContainer": "igxForScrollContainer"; "igxForContainerSize": "igxForContainerSize"; "igxForItemSize": "igxForItemSize"; "igxForTotalItemCount": "igxForTotalItemCount"; "igxForTrackBy": "igxForTrackBy"; }, { "chunkLoad": "chunkLoad"; "scrollbarVisibilityChanged": "scrollbarVisibilityChanged"; "contentSizeChange": "contentSizeChange"; "dataChanged": "dataChanged"; "beforeViewDestroyed": "beforeViewDestroyed"; "chunkPreload": "chunkPreload"; }, never>;
}
export declare const getTypeNameForDebugging: (type: any) => string;
export interface IForOfState extends IBaseEventArgs {
    startIndex?: number;
    chunkSize?: number;
}
export interface IForOfDataChangingEventArgs extends IBaseEventArgs {
    containerSize: number;
}
export declare class IgxGridForOfDirective<T> extends IgxForOfDirective<T> implements OnInit, OnChanges, DoCheck {
    protected syncScrollService: IgxForOfScrollSyncService;
    protected syncService: IgxForOfSyncService;
    set igxGridForOf(value: any[]);
    igxGridForOfUniqueSizeCache: boolean;
    igxGridForOfVariableSizes: boolean;
    get igxGridForOf(): any[];
    /**
     * @hidden
     * @internal
     */
    get sizesCache(): number[];
    /**
     * @hidden
     * @internal
     */
    set sizesCache(value: number[]);
    protected get itemsDimension(): any;
    recalcUpdateSizes(): void;
    /**
     * @hidden @internal
     * An event that is emitted after data has been changed but before the view is refreshed
     */
    dataChanging: EventEmitter<IForOfDataChangingEventArgs>;
    constructor(_viewContainer: ViewContainerRef, _template: TemplateRef<NgForOfContext<T>>, _differs: IterableDiffers, cdr: ChangeDetectorRef, _zone: NgZone, _platformUtil: PlatformUtil, _document: any, syncScrollService: IgxForOfScrollSyncService, syncService: IgxForOfSyncService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @hidden
     * @internal
     */
    assumeMaster(): void;
    ngDoCheck(): void;
    onScroll(event: any): void;
    onHScroll(scrollAmount: any): void;
    protected getItemSize(item: any): number;
    protected initSizesCache(items: any[]): number;
    protected _updateSizeCache(changes?: IterableChanges<T>): number;
    protected handleCacheChanges(changes: IterableChanges<T>): number;
    protected addLastElem(): void;
    protected _updateViews(prevChunkSize: any): void;
    protected _applyChanges(): void;
    /**
     * @hidden
     */
    protected _calcMaxChunkSize(): number;
    static ??fac: i0.????FactoryDeclaration<IgxGridForOfDirective<any>, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxGridForOfDirective<any>, "[igxGridFor][igxGridForOf]", never, { "igxGridForOf": "igxGridForOf"; "igxGridForOfUniqueSizeCache": "igxGridForOfUniqueSizeCache"; "igxGridForOfVariableSizes": "igxGridForOfVariableSizes"; }, { "dataChanging": "dataChanging"; }, never>;
}
/**
 * @hidden
 */
export declare class IgxForOfModule {
    static ??fac: i0.????FactoryDeclaration<IgxForOfModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxForOfModule, [typeof IgxForOfDirective, typeof IgxGridForOfDirective, typeof i1.DisplayContainerComponent, typeof i2.VirtualHelperComponent, typeof i3.HVirtualHelperComponent, typeof i4.VirtualHelperBaseDirective], [typeof i5.IgxScrollInertiaModule, typeof i6.CommonModule], [typeof IgxForOfDirective, typeof IgxGridForOfDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxForOfModule>;
}
