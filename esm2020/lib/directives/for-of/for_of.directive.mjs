/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import { CommonModule, DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, Input, NgModule, Output, Inject } from '@angular/core';
import { DisplayContainerComponent } from './display.container';
import { HVirtualHelperComponent } from './horizontal.virtual.helper.component';
import { VirtualHelperComponent } from './virtual.helper.component';
import { IgxScrollInertiaModule } from './../scroll-inertia/scroll_inertia.directive';
import { IgxForOfScrollSyncService } from './for_of.sync.service';
import { Subject } from 'rxjs';
import { takeUntil, filter, throttleTime, first } from 'rxjs/operators';
import { getResizeObserver } from '../../core/utils';
import { VirtualHelperBaseDirective } from './base.helper.component';
import * as i0 from "@angular/core";
import * as i1 from "./for_of.sync.service";
import * as i2 from "../../core/utils";
const MAX_PERF_SCROLL_DIFF = 4;
/**
 *  @publicApi
 */
export class IgxForOfContext {
    constructor($implicit, index, count) {
        this.$implicit = $implicit;
        this.index = index;
        this.count = count;
    }
    /**
     * A function that returns whether the element is the first or not
     */
    get first() {
        return this.index === 0;
    }
    /**
     * A function that returns whether the element is the last or not
     */
    get last() {
        return this.index === this.count - 1;
    }
    /**
     * A function that returns whether the element is even or not
     */
    get even() {
        return this.index % 2 === 0;
    }
    /**
     * A function that returns whether the element is odd or not
     */
    get odd() {
        return !this.even;
    }
}
// eslint-disable @angular-eslint/no-conflicting-lifecycle
export class IgxForOfDirective {
    constructor(_viewContainer, _template, _differs, cdr, _zone, syncScrollService, platformUtil, document) {
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this.cdr = cdr;
        this._zone = _zone;
        this.syncScrollService = syncScrollService;
        this.platformUtil = platformUtil;
        this.document = document;
        /**
         * An @Input property that specifies the scroll orientation.
         * Scroll orientation can be "vertical" or "horizontal".
         * ```html
         * <ng-template igxFor let-item [igxForOf]="data" [igxForScrollOrientation]="'horizontal'"></ng-template>
         * ```
         */
        this.igxForScrollOrientation = 'vertical';
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
        this.chunkLoad = new EventEmitter();
        /**
         * @hidden @internal
         * An event that is emitted when scrollbar visibility has changed.
         */
        this.scrollbarVisibilityChanged = new EventEmitter();
        /**
         * An event that is emitted after the rendered content size of the igxForOf has been changed.
         */
        this.contentSizeChange = new EventEmitter();
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
        this.dataChanged = new EventEmitter();
        this.beforeViewDestroyed = new EventEmitter();
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
        this.chunkPreload = new EventEmitter();
        /**
         * The current state of the directive. It contains `startIndex` and `chunkSize`.
         * state.startIndex - The index of the item at which the current visible chunk begins.
         * state.chunkSize - The number of items the current visible chunk holds.
         * These options can be used when implementing remote virtualization as they provide the necessary state information.
         * ```typescript
         * const gridState = this.parentVirtDir.state;
         * ```
         */
        this.state = {
            startIndex: 0,
            chunkSize: 0
        };
        this._sizesCache = [];
        this._differ = null;
        this.heightCache = [];
        /** Internal track for scroll top that is being virtualized */
        this._virtScrollTop = 0;
        /** If the next onScroll event is triggered due to internal setting of scrollTop */
        this._bScrollInternal = false;
        // End properties related to virtual height handling
        this._embeddedViews = [];
        this.contentResizeNotify = new Subject();
        /** Height that is being virtualized. */
        this._virtHeight = 0;
        /**
         * @hidden
         */
        this.destroy$ = new Subject();
        this._totalItemCount = null;
        /**
         * Ratio for height that's being virtualizaed and the one visible
         * If _virtHeightRatio = 1, the visible height and the virtualized are the same, also _maxHeight > _virtHeight.
         */
        this._virtHeightRatio = 1;
    }
    /**
     * The total count of the virtual data items, when using remote service.
     * Similar to the property totalItemCount, but this will allow setting the data count into the template.
     * ```html
     * <ng-template igxFor let-item [igxForOf]="data | async" [igxForTotalItemCount]="count | async"
     *  [igxForContainerSize]="'500px'" [igxForItemSize]="'50px'"></ng-template>
     * ```
     */
    get igxForTotalItemCount() {
        return this.totalItemCount;
    }
    set igxForTotalItemCount(value) {
        this.totalItemCount = value;
    }
    /**
     * The total count of the virtual data items, when using remote service.
     * ```typescript
     * this.parentVirtDir.totalItemCount = data.Count;
     * ```
     */
    get totalItemCount() {
        return this._totalItemCount;
    }
    set totalItemCount(val) {
        if (this._totalItemCount !== val) {
            this._totalItemCount = val;
            // update sizes in case total count changes.
            const newSize = this.initSizesCache(this.igxForOf);
            const sizeDiff = this.scrollComponent.size - newSize;
            this.scrollComponent.size = newSize;
            const lastChunkExceeded = this.state.startIndex + this.state.chunkSize > val;
            if (lastChunkExceeded) {
                this.state.startIndex = val - this.state.chunkSize;
            }
            this._adjustScrollPositionAfterSizeChange(sizeDiff);
        }
    }
    get displayContainer() {
        return this.dc?.instance?._viewContainer?.element?.nativeElement;
    }
    get virtualHelper() {
        return this.scrollComponent.nativeElement;
    }
    /**
     * @hidden
     */
    get isRemote() {
        return this.totalItemCount !== null;
    }
    /**
     *
     * Gets/Sets the scroll position.
     * ```typescript
     * const position = directive.scrollPosition;
     * directive.scrollPosition = value;
     * ```
     */
    get scrollPosition() {
        return this.scrollComponent.scrollAmount;
    }
    set scrollPosition(val) {
        if (val === this.scrollComponent.scrollAmount) {
            return;
        }
        if (this.igxForScrollOrientation === 'horizontal' && this.scrollComponent) {
            this.scrollComponent.nativeElement.scrollLeft = val;
        }
        else if (this.scrollComponent) {
            this.scrollComponent.nativeElement.scrollTop = val;
        }
    }
    /**
     * @hidden
     */
    get isRTL() {
        const dir = window.getComputedStyle(this.dc.instance._viewContainer.element.nativeElement).getPropertyValue('direction');
        return dir === 'rtl';
    }
    get sizesCache() {
        return this._sizesCache;
    }
    set sizesCache(value) {
        this._sizesCache = value;
    }
    get _isScrolledToBottom() {
        if (!this.getScroll()) {
            return true;
        }
        const scrollHeight = this.getScroll().scrollHeight;
        // Use === and not >= because `scrollTop + container size` can't be bigger than `scrollHeight`, unless something isn't updated.
        // Also use Math.round because Chrome has some inconsistencies and `scrollTop + container` can be float when zooming the page.
        return Math.round(this.getScroll().scrollTop + this.igxForContainerSize) === scrollHeight;
    }
    get _isAtBottomIndex() {
        return this.igxForOf && this.state.startIndex + this.state.chunkSize > this.igxForOf.length;
    }
    verticalScrollHandler(event) {
        this.onScroll(event);
    }
    isScrollable() {
        return this.scrollComponent.size > parseInt(this.igxForContainerSize, 10);
    }
    /**
     * @hidden
     */
    ngOnInit() {
        let totalSize = 0;
        const vc = this.igxForScrollContainer ? this.igxForScrollContainer._viewContainer : this._viewContainer;
        this.igxForSizePropName = this.igxForSizePropName || 'width';
        this.dc = this._viewContainer.createComponent(DisplayContainerComponent, { index: 0 });
        this.dc.instance.scrollDirection = this.igxForScrollOrientation;
        if (this.igxForOf && this.igxForOf.length) {
            totalSize = this.initSizesCache(this.igxForOf);
            this.scrollComponent = this.syncScrollService.getScrollMaster(this.igxForScrollOrientation);
            this.state.chunkSize = this._calculateChunkSize();
            this.dc.instance.notVirtual = !(this.igxForContainerSize && this.state.chunkSize < this.igxForOf.length);
            if (this.scrollComponent && !this.scrollComponent.destroyed) {
                this.state.startIndex = Math.min(this.getIndexAt(this.scrollPosition, this.sizesCache), this.igxForOf.length - this.state.chunkSize);
            }
            for (let i = this.state.startIndex; i < this.state.startIndex + this.state.chunkSize &&
                this.igxForOf[i] !== undefined; i++) {
                const input = this.igxForOf[i];
                const embeddedView = this.dc.instance._vcr.createEmbeddedView(this._template, new IgxForOfContext(input, this.getContextIndex(input), this.igxForOf.length));
                this._embeddedViews.push(embeddedView);
            }
        }
        if (this.igxForScrollOrientation === 'vertical') {
            this.dc.instance._viewContainer.element.nativeElement.style.top = '0px';
            this.scrollComponent = this.syncScrollService.getScrollMaster(this.igxForScrollOrientation);
            if (!this.scrollComponent || this.scrollComponent.destroyed) {
                this.scrollComponent = vc.createComponent(VirtualHelperComponent).instance;
            }
            this._maxHeight = this._calcMaxBrowserHeight();
            this.scrollComponent.size = this.igxForOf ? this._calcHeight() : 0;
            this.syncScrollService.setScrollMaster(this.igxForScrollOrientation, this.scrollComponent);
            this._zone.runOutsideAngular(() => {
                this.verticalScrollHandler = this.verticalScrollHandler.bind(this);
                this.scrollComponent.nativeElement.addEventListener('scroll', this.verticalScrollHandler);
                this.dc.instance.scrollContainer = this.scrollComponent.nativeElement;
            });
            const destructor = takeUntil(this.destroy$);
            this.contentResizeNotify.pipe(filter(() => this.igxForContainerSize && this.igxForOf && this.igxForOf.length > 0), throttleTime(40, undefined, { leading: true, trailing: true }), destructor).subscribe(() => this._zone.runTask(() => this.updateSizes()));
        }
        if (this.igxForScrollOrientation === 'horizontal') {
            this.func = (evt) => this.onHScroll(evt);
            this.scrollComponent = this.syncScrollService.getScrollMaster(this.igxForScrollOrientation);
            if (!this.scrollComponent) {
                this.scrollComponent = vc.createComponent(HVirtualHelperComponent).instance;
                this.scrollComponent.size = totalSize;
                this.syncScrollService.setScrollMaster(this.igxForScrollOrientation, this.scrollComponent);
                this._zone.runOutsideAngular(() => {
                    this.scrollComponent.nativeElement.addEventListener('scroll', this.func);
                    this.dc.instance.scrollContainer = this.scrollComponent.nativeElement;
                });
            }
            else {
                this._zone.runOutsideAngular(() => {
                    this.scrollComponent.nativeElement.addEventListener('scroll', this.func);
                    this.dc.instance.scrollContainer = this.scrollComponent.nativeElement;
                });
            }
            this._updateHScrollOffset();
        }
    }
    ngAfterViewInit() {
        if (this.igxForScrollOrientation === 'vertical') {
            this._zone.runOutsideAngular(() => {
                this.contentObserver = new (getResizeObserver())(() => this.contentResizeNotify.next());
                this.contentObserver.observe(this.dc.instance._viewContainer.element.nativeElement);
            });
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this.removeScrollEventListeners();
        this.destroy$.next(true);
        this.destroy$.complete();
        if (this.contentObserver) {
            this.contentObserver.disconnect();
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        const forOf = 'igxForOf';
        if (forOf in changes) {
            const value = changes[forOf].currentValue;
            if (!this._differ && value) {
                try {
                    this._differ = this._differs.find(value).create(this.igxForTrackBy);
                }
                catch (e) {
                    throw new Error(`Cannot find a differ supporting object "${value}" of type "${getTypeNameForDebugging(value)}".
                     NgFor only supports binding to Iterables such as Arrays.`);
                }
            }
        }
        const defaultItemSize = 'igxForItemSize';
        if (defaultItemSize in changes && !changes[defaultItemSize].firstChange &&
            this.igxForScrollOrientation === 'vertical' && this.igxForOf) {
            // handle default item size changed.
            this.initSizesCache(this.igxForOf);
            this._applyChanges();
        }
        const containerSize = 'igxForContainerSize';
        if (containerSize in changes && !changes[containerSize].firstChange && this.igxForOf) {
            this._recalcOnContainerChange();
        }
    }
    /**
     * @hidden
     */
    ngDoCheck() {
        if (this._differ) {
            const changes = this._differ.diff(this.igxForOf);
            if (changes) {
                //  re-init cache.
                if (!this.igxForOf) {
                    this.igxForOf = [];
                }
                this._updateSizeCache();
                this._zone.run(() => {
                    this._applyChanges();
                    this.cdr.markForCheck();
                    this._updateScrollOffset();
                    this.dataChanged.emit();
                });
            }
        }
    }
    /**
     * Shifts the scroll thumb position.
     * ```typescript
     * this.parentVirtDir.addScrollTop(5);
     * ```
     *
     * @param addTop negative value to scroll up and positive to scroll down;
     */
    addScrollTop(addTop) {
        if (addTop === 0 && this.igxForScrollOrientation === 'horizontal') {
            return false;
        }
        const originalVirtScrollTop = this._virtScrollTop;
        const containerSize = parseInt(this.igxForContainerSize, 10);
        const maxVirtScrollTop = this._virtHeight - containerSize;
        this._bScrollInternal = true;
        this._virtScrollTop += addTop;
        this._virtScrollTop = this._virtScrollTop > 0 ?
            (this._virtScrollTop < maxVirtScrollTop ? this._virtScrollTop : maxVirtScrollTop) :
            0;
        this.scrollPosition += addTop / this._virtHeightRatio;
        if (Math.abs(addTop / this._virtHeightRatio) < 1) {
            // Actual scroll delta that was added is smaller than 1 and onScroll handler doesn't trigger when scrolling < 1px
            const scrollOffset = this.fixedUpdateAllElements(this._virtScrollTop);
            // scrollOffset = scrollOffset !== parseInt(this.igxForItemSize, 10) ? scrollOffset : 0;
            this.dc.instance._viewContainer.element.nativeElement.style.top = -(scrollOffset) + 'px';
        }
        const maxRealScrollTop = this.scrollComponent.nativeElement.scrollHeight - containerSize;
        if ((this._virtScrollTop > 0 && this.scrollPosition === 0) ||
            (this._virtScrollTop < maxVirtScrollTop && this.scrollPosition === maxRealScrollTop)) {
            // Actual scroll position is at the top or bottom, but virtual one is not at the top or bottom (there's more to scroll)
            // Recalculate actual scroll position based on the virtual scroll.
            this.scrollPosition = this._virtScrollTop / this._virtHeightRatio;
        }
        else if (this._virtScrollTop === 0 && this.scrollPosition > 0) {
            // Actual scroll position is not at the top, but virtual scroll is. Just update the actual scroll
            this.scrollPosition = 0;
        }
        else if (this._virtScrollTop === maxVirtScrollTop && this.scrollPosition < maxRealScrollTop) {
            // Actual scroll position is not at the bottom, but virtual scroll is. Just update the acual scroll
            this.scrollPosition = maxRealScrollTop;
        }
        return this._virtScrollTop !== originalVirtScrollTop;
    }
    /**
     * Scrolls to the specified index.
     * ```typescript
     * this.parentVirtDir.scrollTo(5);
     * ```
     *
     * @param index
     */
    scrollTo(index) {
        if (index < 0 || index > (this.isRemote ? this.totalItemCount : this.igxForOf.length) - 1) {
            return;
        }
        const containerSize = parseInt(this.igxForContainerSize, 10);
        const isPrevItem = index < this.state.startIndex || this.scrollPosition > this.sizesCache[index];
        let nextScroll = isPrevItem ? this.sizesCache[index] : this.sizesCache[index + 1] - containerSize;
        if (nextScroll < 0) {
            return;
        }
        if (this.igxForScrollOrientation === 'horizontal') {
            this.scrollPosition = this.isRTL ? -nextScroll : nextScroll;
        }
        else {
            const maxVirtScrollTop = this._virtHeight - containerSize;
            if (nextScroll > maxVirtScrollTop) {
                nextScroll = maxVirtScrollTop;
            }
            this._bScrollInternal = true;
            this._virtScrollTop = nextScroll;
            this.scrollPosition = this._virtScrollTop / this._virtHeightRatio;
            this._adjustToIndex = !isPrevItem ? index : null;
        }
    }
    /**
     * Scrolls by one item into the appropriate next direction.
     * For "horizontal" orientation that will be the right column and for "vertical" that is the lower row.
     * ```typescript
     * this.parentVirtDir.scrollNext();
     * ```
     */
    scrollNext() {
        const scr = Math.abs(Math.ceil(this.scrollPosition));
        const endIndex = this.getIndexAt(scr + parseInt(this.igxForContainerSize, 10), this.sizesCache);
        this.scrollTo(endIndex);
    }
    /**
     * Scrolls by one item into the appropriate previous direction.
     * For "horizontal" orientation that will be the left column and for "vertical" that is the upper row.
     * ```typescript
     * this.parentVirtDir.scrollPrev();
     * ```
     */
    scrollPrev() {
        this.scrollTo(this.state.startIndex - 1);
    }
    /**
     * Scrolls by one page into the appropriate next direction.
     * For "horizontal" orientation that will be one view to the right and for "vertical" that is one view to the bottom.
     * ```typescript
     * this.parentVirtDir.scrollNextPage();
     * ```
     */
    scrollNextPage() {
        if (this.igxForScrollOrientation === 'horizontal') {
            this.scrollPosition += this.isRTL ? -parseInt(this.igxForContainerSize, 10) : parseInt(this.igxForContainerSize, 10);
        }
        else {
            this.addScrollTop(parseInt(this.igxForContainerSize, 10));
        }
    }
    /**
     * Scrolls by one page into the appropriate previous direction.
     * For "horizontal" orientation that will be one view to the left and for "vertical" that is one view to the top.
     * ```typescript
     * this.parentVirtDir.scrollPrevPage();
     * ```
     */
    scrollPrevPage() {
        if (this.igxForScrollOrientation === 'horizontal') {
            this.scrollPosition -= this.isRTL ? -parseInt(this.igxForContainerSize, 10) : parseInt(this.igxForContainerSize, 10);
        }
        else {
            const containerSize = (parseInt(this.igxForContainerSize, 10));
            this.addScrollTop(-containerSize);
        }
    }
    /**
     * @hidden
     */
    getColumnScrollLeft(colIndex) {
        return this.sizesCache[colIndex];
    }
    /**
     * Returns the total number of items that are fully visible.
     * ```typescript
     * this.parentVirtDir.getItemCountInView();
     * ```
     */
    getItemCountInView() {
        let startIndex = this.getIndexAt(this.scrollPosition, this.sizesCache);
        if (this.scrollPosition - this.sizesCache[startIndex] > 0) {
            // fisrt item is not fully in view
            startIndex++;
        }
        const endIndex = this.getIndexAt(this.scrollPosition + parseInt(this.igxForContainerSize, 10), this.sizesCache);
        return endIndex - startIndex;
    }
    /**
     * Returns a reference to the scrollbar DOM element.
     * This is either a vertical or horizontal scrollbar depending on the specified igxForScrollOrientation.
     * ```typescript
     * dir.getScroll();
     * ```
     */
    getScroll() {
        return this.scrollComponent?.nativeElement;
    }
    /**
     * Returns the size of the element at the specified index.
     * ```typescript
     * this.parentVirtDir.getSizeAt(1);
     * ```
     */
    getSizeAt(index) {
        return this.sizesCache[index + 1] - this.sizesCache[index];
    }
    /**
     * @hidden
     * Function that is called to get the native scrollbar size that the browsers renders.
     */
    getScrollNativeSize() {
        return this.scrollComponent ? this.scrollComponent.scrollNativeSize : 0;
    }
    /**
     * Returns the scroll offset of the element at the specified index.
     * ```typescript
     * this.parentVirtDir.getScrollForIndex(1);
     * ```
     */
    getScrollForIndex(index, bottom) {
        const containerSize = parseInt(this.igxForContainerSize, 10);
        const scroll = bottom ? Math.max(0, this.sizesCache[index + 1] - containerSize) : this.sizesCache[index];
        return scroll;
    }
    /**
     * Returns the index of the element at the specified offset.
     * ```typescript
     * this.parentVirtDir.getIndexAtScroll(100);
     * ```
     */
    getIndexAtScroll(scrollOffset) {
        return this.getIndexAt(scrollOffset, this.sizesCache);
    }
    /**
     * Returns whether the target index is outside the view.
     * ```typescript
     * this.parentVirtDir.isIndexOutsideView(10);
     * ```
     */
    isIndexOutsideView(index) {
        const targetNode = index >= this.state.startIndex && index <= this.state.startIndex + this.state.chunkSize ?
            this._embeddedViews.map(view => view.rootNodes.find(node => node.nodeType === Node.ELEMENT_NODE) || view.rootNodes[0].nextElementSibling)[index - this.state.startIndex] : null;
        const rowHeight = this.getSizeAt(index);
        const containerSize = parseInt(this.igxForContainerSize, 10);
        const containerOffset = -(this.scrollPosition - this.sizesCache[this.state.startIndex]);
        const endTopOffset = targetNode ? targetNode.offsetTop + rowHeight + containerOffset : containerSize + rowHeight;
        return !targetNode || targetNode.offsetTop < Math.abs(containerOffset)
            || containerSize && endTopOffset - containerSize > 5;
    }
    /**
     * @hidden
     * Function that recalculates and updates cache sizes.
     */
    recalcUpdateSizes() {
        const dimension = this.igxForScrollOrientation === 'horizontal' ?
            this.igxForSizePropName : 'height';
        const diffs = [];
        let totalDiff = 0;
        const l = this._embeddedViews.length;
        const rNodes = this._embeddedViews.map(view => view.rootNodes.find(node => node.nodeType === Node.ELEMENT_NODE) || view.rootNodes[0].nextElementSibling);
        for (let i = 0; i < l; i++) {
            const rNode = rNodes[i];
            if (rNode) {
                const height = window.getComputedStyle(rNode).getPropertyValue('height');
                const h = parseFloat(height) || parseInt(this.igxForItemSize, 10);
                const index = this.state.startIndex + i;
                if (!this.isRemote && !this.igxForOf[index]) {
                    continue;
                }
                const margin = this.getMargin(rNode, dimension);
                const oldVal = dimension === 'height' ? this.heightCache[index] : this.igxForOf[index][dimension];
                const newVal = (dimension === 'height' ? h : rNode.clientWidth) + margin;
                if (dimension === 'height') {
                    this.heightCache[index] = newVal;
                }
                else {
                    this.igxForOf[index][dimension] = newVal;
                }
                const currDiff = newVal - oldVal;
                diffs.push(currDiff);
                totalDiff += currDiff;
                this.sizesCache[index + 1] += totalDiff;
            }
        }
        // update cache
        if (Math.abs(totalDiff) > 0) {
            for (let j = this.state.startIndex + this.state.chunkSize + 1; j < this.sizesCache.length; j++) {
                this.sizesCache[j] += totalDiff;
            }
            // update scrBar heights/widths
            if (this.igxForScrollOrientation === 'horizontal') {
                const firstScrollChild = this.scrollComponent.nativeElement.children.item(0);
                const totalWidth = parseInt(firstScrollChild.style.width, 10) + totalDiff;
                firstScrollChild.style.width = `${totalWidth}px`;
            }
            const reducer = (acc, val) => acc + val;
            if (this.igxForScrollOrientation === 'vertical') {
                const scrToBottom = this._isScrolledToBottom && !this.dc.instance.notVirtual;
                const hSum = this.heightCache.reduce(reducer);
                if (hSum > this._maxHeight) {
                    this._virtHeightRatio = hSum / this._maxHeight;
                }
                this.scrollComponent.size = Math.min(this.scrollComponent.size + totalDiff, this._maxHeight);
                this._virtHeight = hSum;
                if (!this.scrollComponent.destroyed) {
                    this.scrollComponent.cdr.detectChanges();
                }
                if (scrToBottom && !this._isAtBottomIndex) {
                    const containerSize = parseInt(this.igxForContainerSize, 10);
                    const maxVirtScrollTop = this._virtHeight - containerSize;
                    this._bScrollInternal = true;
                    this._virtScrollTop = maxVirtScrollTop;
                    this.scrollPosition = maxVirtScrollTop;
                    return;
                }
                if (this._adjustToIndex) {
                    // in case scrolled to specific index where after scroll heights are changed
                    // need to adjust the offsets so that item is last in view.
                    const updatesToIndex = this._adjustToIndex - this.state.startIndex + 1;
                    const sumDiffs = diffs.slice(0, updatesToIndex).reduce(reducer);
                    if (sumDiffs !== 0) {
                        this.addScrollTop(sumDiffs);
                    }
                    this._adjustToIndex = null;
                }
            }
        }
    }
    /**
     * @hidden
     * Reset scroll position.
     * Needed in case scrollbar is hidden/detached but we still need to reset it.
     */
    resetScrollPosition() {
        this.scrollPosition = 0;
        this.scrollComponent.scrollAmount = 0;
        this.state.startIndex = 0;
    }
    /**
     * @hidden
     */
    removeScrollEventListeners() {
        if (this.igxForScrollOrientation === 'horizontal') {
            this._zone.runOutsideAngular(() => this.scrollComponent?.nativeElement?.removeEventListener('scroll', this.func));
        }
        else {
            this._zone.runOutsideAngular(() => this.scrollComponent?.nativeElement?.removeEventListener('scroll', this.verticalScrollHandler));
        }
    }
    /**
     * @hidden
     * Function that is called when scrolling vertically
     */
    onScroll(event) {
        /* in certain situations this may be called when no scrollbar is visible */
        if (!parseInt(this.scrollComponent.nativeElement.style.height, 10)) {
            return;
        }
        if (!this._bScrollInternal) {
            this._calcVirtualScrollTop(event.target.scrollTop);
        }
        else {
            this._bScrollInternal = false;
        }
        const prevStartIndex = this.state.startIndex;
        const scrollOffset = this.fixedUpdateAllElements(this._virtScrollTop);
        this.dc.instance._viewContainer.element.nativeElement.style.top = -(scrollOffset) + 'px';
        this._zone.onStable.pipe(first()).subscribe(this.recalcUpdateSizes.bind(this));
        this.dc.changeDetectorRef.detectChanges();
        if (prevStartIndex !== this.state.startIndex) {
            this.chunkLoad.emit(this.state);
        }
    }
    updateSizes() {
        const scrollable = this.isScrollable();
        this.recalcUpdateSizes();
        this._applyChanges();
        this._updateScrollOffset();
        if (scrollable !== this.isScrollable()) {
            this.scrollbarVisibilityChanged.emit();
        }
        else {
            this.contentSizeChange.emit();
        }
    }
    /**
     * @hidden
     */
    fixedUpdateAllElements(inScrollTop) {
        const count = this.isRemote ? this.totalItemCount : this.igxForOf.length;
        let newStart = this.getIndexAt(inScrollTop, this.sizesCache);
        if (newStart + this.state.chunkSize > count) {
            newStart = count - this.state.chunkSize;
        }
        const prevStart = this.state.startIndex;
        const diff = newStart - this.state.startIndex;
        this.state.startIndex = newStart;
        if (diff) {
            this.chunkPreload.emit(this.state);
            if (!this.isRemote) {
                // recalculate and apply page size.
                if (diff && Math.abs(diff) <= MAX_PERF_SCROLL_DIFF) {
                    if (diff > 0) {
                        this.moveApplyScrollNext(prevStart);
                    }
                    else {
                        this.moveApplyScrollPrev(prevStart);
                    }
                }
                else {
                    this.fixedApplyScroll();
                }
            }
        }
        return inScrollTop - this.sizesCache[this.state.startIndex];
    }
    /**
     * @hidden
     * The function applies an optimized state change for scrolling down/right employing context change with view rearrangement
     */
    moveApplyScrollNext(prevIndex) {
        const start = prevIndex + this.state.chunkSize;
        const end = start + this.state.startIndex - prevIndex;
        const container = this.dc.instance._vcr;
        for (let i = start; i < end && this.igxForOf[i] !== undefined; i++) {
            const embView = this._embeddedViews.shift();
            this.scrollFocus(embView.rootNodes.find(node => node.nodeType === Node.ELEMENT_NODE)
                || embView.rootNodes[0].nextElementSibling);
            const view = container.detach(0);
            this.updateTemplateContext(embView.context, i);
            container.insert(view);
            this._embeddedViews.push(embView);
        }
    }
    /**
     * @hidden
     * The function applies an optimized state change for scrolling up/left employing context change with view rearrangement
     */
    moveApplyScrollPrev(prevIndex) {
        const container = this.dc.instance._vcr;
        for (let i = prevIndex - 1; i >= this.state.startIndex && this.igxForOf[i] !== undefined; i--) {
            const embView = this._embeddedViews.pop();
            this.scrollFocus(embView.rootNodes.find(node => node.nodeType === Node.ELEMENT_NODE)
                || embView.rootNodes[0].nextElementSibling);
            const view = container.detach(container.length - 1);
            this.updateTemplateContext(embView.context, i);
            container.insert(view, 0);
            this._embeddedViews.unshift(embView);
        }
    }
    /**
     * @hidden
     */
    getContextIndex(input) {
        return this.isRemote ? this.state.startIndex + this.igxForOf.indexOf(input) : this.igxForOf.indexOf(input);
    }
    /**
     * @hidden
     * Function which updates the passed context of an embedded view with the provided index
     * from the view container.
     * Often, called while handling a scroll event.
     */
    updateTemplateContext(context, index = 0) {
        context.$implicit = this.igxForOf[index];
        context.index = this.getContextIndex(this.igxForOf[index]);
        context.count = this.igxForOf.length;
    }
    /**
     * @hidden
     * The function applies an optimized state change through context change for each view
     */
    fixedApplyScroll() {
        let j = 0;
        const endIndex = this.state.startIndex + this.state.chunkSize;
        for (let i = this.state.startIndex; i < endIndex && this.igxForOf[i] !== undefined; i++) {
            const embView = this._embeddedViews[j++];
            this.updateTemplateContext(embView.context, i);
        }
    }
    /**
     * @hidden
     * @internal
     *
     * Clears focus inside the virtualized container on small scroll swaps.
     */
    scrollFocus(node) {
        const activeElement = this.document.activeElement;
        // Remove focus in case the the active element is inside the view container.
        // Otherwise we hit an exception while doing the 'small' scrolls swapping.
        // For more information:
        //
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
        // https://bugs.chromium.org/p/chromium/issues/detail?id=432392
        if (node && node.contains(this.document.activeElement)) {
            activeElement.blur();
        }
    }
    /**
     * @hidden
     * Function that is called when scrolling horizontally
     */
    onHScroll(event) {
        /* in certain situations this may be called when no scrollbar is visible */
        const firstScrollChild = this.scrollComponent.nativeElement.children.item(0);
        if (!parseInt(firstScrollChild.style.width, 10)) {
            return;
        }
        const prevStartIndex = this.state.startIndex;
        const scrLeft = event.target.scrollLeft;
        // Updating horizontal chunks
        const scrollOffset = this.fixedUpdateAllElements(Math.abs(event.target.scrollLeft));
        if (scrLeft < 0) {
            // RTL
            this.dc.instance._viewContainer.element.nativeElement.style.left = scrollOffset + 'px';
        }
        else {
            this.dc.instance._viewContainer.element.nativeElement.style.left = -scrollOffset + 'px';
        }
        this.dc.changeDetectorRef.detectChanges();
        if (prevStartIndex !== this.state.startIndex) {
            this.chunkLoad.emit(this.state);
        }
    }
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
    get igxForTrackBy() {
        return this._trackByFn;
    }
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
    set igxForTrackBy(fn) {
        this._trackByFn = fn;
    }
    /**
     * @hidden
     */
    _applyChanges() {
        const prevChunkSize = this.state.chunkSize;
        this.applyChunkSizeChange();
        this._recalcScrollBarSize();
        if (this.igxForOf && this.igxForOf.length && this.dc) {
            const embeddedViewCopy = Object.assign([], this._embeddedViews);
            let startIndex = this.state.startIndex;
            let endIndex = this.state.chunkSize + this.state.startIndex;
            if (this.isRemote) {
                startIndex = 0;
                endIndex = this.igxForOf.length;
            }
            for (let i = startIndex; i < endIndex && this.igxForOf[i] !== undefined; i++) {
                const embView = embeddedViewCopy.shift();
                this.updateTemplateContext(embView.context, i);
            }
            if (prevChunkSize !== this.state.chunkSize) {
                this.chunkLoad.emit(this.state);
            }
        }
    }
    /**
     * @hidden
     */
    _calcMaxBrowserHeight() {
        if (!this.platformUtil.isBrowser) {
            return 0;
        }
        const div = this.document.createElement('div');
        const style = div.style;
        style.position = 'absolute';
        style.top = '9999999999999999px';
        this.document.body.appendChild(div);
        const size = Math.abs(div.getBoundingClientRect()['top']);
        this.document.body.removeChild(div);
        return size;
    }
    /**
     * @hidden
     * Recalculates the chunkSize based on current startIndex and returns the new size.
     * This should be called after this.state.startIndex is updated, not before.
     */
    _calculateChunkSize() {
        let chunkSize = 0;
        if (this.igxForContainerSize !== null && this.igxForContainerSize !== undefined) {
            if (!this.sizesCache) {
                this.initSizesCache(this.igxForOf);
            }
            chunkSize = this._calcMaxChunkSize();
            if (this.igxForOf && chunkSize > this.igxForOf.length) {
                chunkSize = this.igxForOf.length;
            }
        }
        else {
            if (this.igxForOf) {
                chunkSize = this.igxForOf.length;
            }
        }
        return chunkSize;
    }
    /**
     * @hidden
     */
    getElement(viewref, nodeName) {
        const elem = viewref.element.nativeElement.parentNode.getElementsByTagName(nodeName);
        return elem.length > 0 ? elem[0] : null;
    }
    /**
     * @hidden
     */
    initSizesCache(items) {
        let totalSize = 0;
        let size = 0;
        const dimension = this.igxForSizePropName || 'height';
        let i = 0;
        this.sizesCache = [];
        this.heightCache = [];
        this.sizesCache.push(0);
        const count = this.isRemote ? this.totalItemCount : items.length;
        for (i; i < count; i++) {
            size = this._getItemSize(items[i], dimension);
            if (this.igxForScrollOrientation === 'vertical') {
                this.heightCache.push(size);
            }
            totalSize += size;
            this.sizesCache.push(totalSize);
        }
        return totalSize;
    }
    _updateSizeCache() {
        if (this.igxForScrollOrientation === 'horizontal') {
            this.initSizesCache(this.igxForOf);
            return;
        }
        const oldHeight = this.heightCache.length > 0 ? this.heightCache.reduce((acc, val) => acc + val) : 0;
        const newHeight = this.initSizesCache(this.igxForOf);
        const diff = oldHeight - newHeight;
        this._adjustScrollPositionAfterSizeChange(diff);
    }
    /**
     * @hidden
     */
    _calcMaxChunkSize() {
        let i = 0;
        let length = 0;
        let maxLength = 0;
        const arr = [];
        let sum = 0;
        const availableSize = parseInt(this.igxForContainerSize, 10);
        if (!availableSize) {
            return 0;
        }
        const dimension = this.igxForScrollOrientation === 'horizontal' ?
            this.igxForSizePropName : 'height';
        const reducer = (accumulator, currentItem) => accumulator + this._getItemSize(currentItem, dimension);
        for (i; i < this.igxForOf.length; i++) {
            let item = this.igxForOf[i];
            if (dimension === 'height') {
                item = { value: this.igxForOf[i], height: this.heightCache[i] };
            }
            const size = dimension === 'height' ?
                this.heightCache[i] :
                this._getItemSize(item, dimension);
            sum = arr.reduce(reducer, size);
            if (sum < availableSize) {
                arr.push(item);
                length = arr.length;
                if (i === this.igxForOf.length - 1) {
                    // reached end without exceeding
                    // include prev items until size is filled or first item is reached.
                    let curItem = dimension === 'height' ? arr[0].value : arr[0];
                    let prevIndex = this.igxForOf.indexOf(curItem) - 1;
                    while (prevIndex >= 0 && sum <= availableSize) {
                        curItem = dimension === 'height' ? arr[0].value : arr[0];
                        prevIndex = this.igxForOf.indexOf(curItem) - 1;
                        const prevItem = this.igxForOf[prevIndex];
                        const prevSize = dimension === 'height' ?
                            this.heightCache[prevIndex] :
                            parseInt(prevItem[dimension], 10);
                        sum = arr.reduce(reducer, prevSize);
                        arr.unshift(prevItem);
                        length = arr.length;
                    }
                }
            }
            else {
                arr.push(item);
                length = arr.length + 1;
                arr.shift();
            }
            if (length > maxLength) {
                maxLength = length;
            }
        }
        return maxLength;
    }
    /**
     * @hidden
     */
    getIndexAt(left, set) {
        let start = 0;
        let end = set.length - 1;
        if (left === 0) {
            return 0;
        }
        while (start <= end) {
            const midIdx = Math.floor((start + end) / 2);
            const midLeft = set[midIdx];
            const cmp = left - midLeft;
            if (cmp > 0) {
                start = midIdx + 1;
            }
            else if (cmp < 0) {
                end = midIdx - 1;
            }
            else {
                return midIdx;
            }
        }
        return end;
    }
    _recalcScrollBarSize() {
        const count = this.isRemote ? this.totalItemCount : (this.igxForOf ? this.igxForOf.length : 0);
        this.dc.instance.notVirtual = !(this.igxForContainerSize && this.dc && this.state.chunkSize < count);
        const scrollable = this.isScrollable();
        if (this.igxForScrollOrientation === 'horizontal') {
            const totalWidth = this.igxForContainerSize ? this.initSizesCache(this.igxForOf) : 0;
            this.scrollComponent.nativeElement.style.width = this.igxForContainerSize + 'px';
            this.scrollComponent.size = totalWidth;
            if (totalWidth <= parseInt(this.igxForContainerSize, 10)) {
                this.resetScrollPosition();
            }
        }
        if (this.igxForScrollOrientation === 'vertical') {
            this.scrollComponent.nativeElement.style.height = parseInt(this.igxForContainerSize, 10) + 'px';
            this.scrollComponent.size = this._calcHeight();
            if (this.scrollComponent.size <= parseInt(this.igxForContainerSize, 10)) {
                this.resetScrollPosition();
            }
        }
        if (scrollable !== this.isScrollable()) {
            // scrollbar visibility has changed
            this.scrollbarVisibilityChanged.emit();
        }
    }
    _calcHeight() {
        let height;
        if (this.heightCache) {
            height = this.heightCache.reduce((acc, val) => acc + val, 0);
        }
        else {
            height = this.initSizesCache(this.igxForOf);
        }
        this._virtHeight = height;
        if (height > this._maxHeight) {
            this._virtHeightRatio = height / this._maxHeight;
            height = this._maxHeight;
        }
        return height;
    }
    _recalcOnContainerChange() {
        this.dc.instance._viewContainer.element.nativeElement.style.top = '0px';
        this.dc.instance._viewContainer.element.nativeElement.style.left = '0px';
        const prevChunkSize = this.state.chunkSize;
        this.applyChunkSizeChange();
        this._recalcScrollBarSize();
        if (prevChunkSize !== this.state.chunkSize) {
            this.chunkLoad.emit(this.state);
        }
        if (this.sizesCache && this.igxForScrollOrientation === 'horizontal') {
            // Updating horizontal chunks and offsets based on the new scrollLeft
            const scrollOffset = this.fixedUpdateAllElements(this.scrollPosition);
            this.dc.instance._viewContainer.element.nativeElement.style.left = -scrollOffset + 'px';
        }
    }
    /**
     * @hidden
     * Removes an element from the embedded views and updates chunkSize.
     */
    removeLastElem() {
        const oldElem = this._embeddedViews.pop();
        this.beforeViewDestroyed.emit(oldElem);
        // also detach from ViewContainerRef to make absolutely sure this is removed from the view container.
        this.dc.instance._vcr.detach(this.dc.instance._vcr.length - 1);
        oldElem.destroy();
        this.state.chunkSize--;
    }
    /**
     * @hidden
     * If there exists an element that we can create embedded view for creates it, appends it and updates chunkSize
     */
    addLastElem() {
        let elemIndex = this.state.startIndex + this.state.chunkSize;
        if (!this.isRemote && !this.igxForOf) {
            return;
        }
        if (elemIndex >= this.igxForOf.length) {
            elemIndex = this.igxForOf.length - this.state.chunkSize;
        }
        const input = this.igxForOf[elemIndex];
        const embeddedView = this.dc.instance._vcr.createEmbeddedView(this._template, new IgxForOfContext(input, this.getContextIndex(input), this.igxForOf.length));
        this._embeddedViews.push(embeddedView);
        this.state.chunkSize++;
        this._zone.run(() => this.cdr.markForCheck());
    }
    /**
     * Recalculates chunkSize and adds/removes elements if need due to the change.
     * this.state.chunkSize is updated in @addLastElem() or @removeLastElem()
     */
    applyChunkSizeChange() {
        const chunkSize = this.isRemote ? (this.igxForOf ? this.igxForOf.length : 0) : this._calculateChunkSize();
        if (chunkSize > this.state.chunkSize) {
            const diff = chunkSize - this.state.chunkSize;
            for (let i = 0; i < diff; i++) {
                this.addLastElem();
            }
        }
        else if (chunkSize < this.state.chunkSize) {
            const diff = this.state.chunkSize - chunkSize;
            for (let i = 0; i < diff; i++) {
                this.removeLastElem();
            }
        }
    }
    _updateScrollOffset() {
        if (this.igxForScrollOrientation === 'horizontal') {
            this._updateHScrollOffset();
        }
        else {
            this._updateVScrollOffset();
        }
    }
    _calcVirtualScrollTop(scrollTop) {
        const containerSize = parseInt(this.igxForContainerSize, 10);
        const maxRealScrollTop = this.scrollComponent.size - containerSize;
        const realPercentScrolled = maxRealScrollTop !== 0 ? scrollTop / maxRealScrollTop : 0;
        const maxVirtScrollTop = this._virtHeight - containerSize;
        this._virtScrollTop = realPercentScrolled * maxVirtScrollTop;
    }
    _getItemSize(item, dimension) {
        const dim = item ? item[dimension] : null;
        return typeof dim === 'number' ? dim : parseInt(this.igxForItemSize, 10) || 0;
    }
    _updateVScrollOffset() {
        let scrollOffset = 0;
        let currentScrollTop = this.scrollPosition;
        if (this._virtHeightRatio !== 1) {
            this._calcVirtualScrollTop(this.scrollPosition);
            currentScrollTop = this._virtScrollTop;
        }
        const vScroll = this.scrollComponent.nativeElement;
        scrollOffset = vScroll && this.scrollComponent.size ?
            currentScrollTop - this.sizesCache[this.state.startIndex] : 0;
        this.dc.instance._viewContainer.element.nativeElement.style.top = -(scrollOffset) + 'px';
    }
    _updateHScrollOffset() {
        let scrollOffset = 0;
        scrollOffset = this.scrollComponent.nativeElement &&
            this.scrollComponent.size ?
            this.scrollPosition - this.sizesCache[this.state.startIndex] : 0;
        this.dc.instance._viewContainer.element.nativeElement.style.left = -scrollOffset + 'px';
    }
    _adjustScrollPositionAfterSizeChange(sizeDiff) {
        // if data has been changed while container is scrolled
        // should update scroll top/left according to change so that same startIndex is in view
        if (Math.abs(sizeDiff) > 0 && this.scrollPosition > 0) {
            this.recalcUpdateSizes();
            const offset = this.igxForScrollOrientation === 'horizontal' ?
                parseInt(this.dc.instance._viewContainer.element.nativeElement.style.left, 10) :
                parseInt(this.dc.instance._viewContainer.element.nativeElement.style.top, 10);
            const newSize = this.sizesCache[this.state.startIndex] - offset;
            this.scrollPosition = newSize;
            if (this.scrollPosition !== newSize) {
                this.scrollComponent.scrollAmount = newSize;
            }
        }
    }
    getMargin(node, dimension) {
        const styles = window.getComputedStyle(node);
        if (dimension === 'height') {
            return parseFloat(styles['marginTop']) +
                parseFloat(styles['marginBottom']) || 0;
        }
        return parseFloat(styles['marginLeft']) +
            parseFloat(styles['marginRight']) || 0;
    }
}
IgxForOfDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxForOfDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i1.IgxForOfScrollSyncService }, { token: i2.PlatformUtil }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
IgxForOfDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxForOfDirective, selector: "[igxFor][igxForOf]", inputs: { igxForOf: "igxForOf", igxForSizePropName: "igxForSizePropName", igxForScrollOrientation: "igxForScrollOrientation", igxForScrollContainer: "igxForScrollContainer", igxForContainerSize: "igxForContainerSize", igxForItemSize: "igxForItemSize", igxForTotalItemCount: "igxForTotalItemCount", igxForTrackBy: "igxForTrackBy" }, outputs: { chunkLoad: "chunkLoad", scrollbarVisibilityChanged: "scrollbarVisibilityChanged", contentSizeChange: "contentSizeChange", dataChanged: "dataChanged", beforeViewDestroyed: "beforeViewDestroyed", chunkPreload: "chunkPreload" }, providers: [IgxForOfScrollSyncService], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxForOfDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxFor][igxForOf]',
                    providers: [IgxForOfScrollSyncService]
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i1.IgxForOfScrollSyncService }, { type: i2.PlatformUtil }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { igxForOf: [{
                type: Input
            }], igxForSizePropName: [{
                type: Input
            }], igxForScrollOrientation: [{
                type: Input
            }], igxForScrollContainer: [{
                type: Input
            }], igxForContainerSize: [{
                type: Input
            }], igxForItemSize: [{
                type: Input
            }], chunkLoad: [{
                type: Output
            }], scrollbarVisibilityChanged: [{
                type: Output
            }], contentSizeChange: [{
                type: Output
            }], dataChanged: [{
                type: Output
            }], beforeViewDestroyed: [{
                type: Output
            }], chunkPreload: [{
                type: Output
            }], igxForTotalItemCount: [{
                type: Input
            }], igxForTrackBy: [{
                type: Input
            }] } });
export const getTypeNameForDebugging = (type) => type.name || typeof type;
export class IgxGridForOfDirective extends IgxForOfDirective {
    constructor(_viewContainer, _template, _differs, cdr, _zone, _platformUtil, _document, syncScrollService, syncService) {
        super(_viewContainer, _template, _differs, cdr, _zone, syncScrollService, _platformUtil, _document);
        this.syncScrollService = syncScrollService;
        this.syncService = syncService;
        this.igxGridForOfUniqueSizeCache = false;
        this.igxGridForOfVariableSizes = true;
        /**
         * @hidden @internal
         * An event that is emitted after data has been changed but before the view is refreshed
         */
        this.dataChanging = new EventEmitter();
    }
    set igxGridForOf(value) {
        this.igxForOf = value;
    }
    get igxGridForOf() {
        return this.igxForOf;
    }
    /**
     * @hidden
     * @internal
     */
    get sizesCache() {
        if (this.igxForScrollOrientation === 'horizontal') {
            if (this.igxGridForOfUniqueSizeCache || this.syncService.isMaster(this)) {
                return this._sizesCache;
            }
            return this.syncService.sizesCache(this.igxForScrollOrientation);
        }
        else {
            return this._sizesCache;
        }
    }
    /**
     * @hidden
     * @internal
     */
    set sizesCache(value) {
        this._sizesCache = value;
    }
    get itemsDimension() {
        return this.igxForSizePropName || 'height';
    }
    recalcUpdateSizes() {
        if (this.igxGridForOfVariableSizes) {
            super.recalcUpdateSizes();
        }
    }
    ngOnInit() {
        this.syncService.setMaster(this);
        super.ngOnInit();
        this.removeScrollEventListeners();
    }
    ngOnChanges(changes) {
        const forOf = 'igxGridForOf';
        this.syncService.setMaster(this);
        if (forOf in changes) {
            const value = changes[forOf].currentValue;
            if (!this._differ && value) {
                try {
                    this._differ = this._differs.find(value).create(this.igxForTrackBy);
                }
                catch (e) {
                    throw new Error(`Cannot find a differ supporting object "${value}" of type "${getTypeNameForDebugging(value)}".
                     NgFor only supports binding to Iterables such as Arrays.`);
                }
            }
            if (this.igxForScrollOrientation === 'horizontal') {
                // in case collection has changes, reset sync service
                this.syncService.setMaster(this, true);
            }
        }
        const defaultItemSize = 'igxForItemSize';
        if (defaultItemSize in changes && !changes[defaultItemSize].firstChange &&
            this.igxForScrollOrientation === 'vertical' && this.igxForOf) {
            // handle default item size changed.
            this.initSizesCache(this.igxForOf);
        }
        const containerSize = 'igxForContainerSize';
        if (containerSize in changes && !changes[containerSize].firstChange && this.igxForOf) {
            this._recalcOnContainerChange();
        }
    }
    /**
     * @hidden
     * @internal
     */
    assumeMaster() {
        this._sizesCache = this.syncService.sizesCache(this.igxForScrollOrientation);
        this.syncService.setMaster(this, true);
    }
    ngDoCheck() {
        if (this._differ) {
            const changes = this._differ.diff(this.igxForOf);
            if (changes) {
                const args = {
                    containerSize: this.igxForContainerSize
                };
                this.dataChanging.emit(args);
                //  re-init cache.
                if (!this.igxForOf) {
                    this.igxForOf = [];
                }
                /* we need to reset the master dir if all rows are removed
                (e.g. because of filtering); if all columns are hidden, rows are
                still rendered empty, so we should not reset master */
                if (!this.igxForOf.length &&
                    this.igxForScrollOrientation === 'vertical') {
                    this.syncService.resetMaster();
                }
                this.syncService.setMaster(this);
                this.igxForContainerSize = args.containerSize;
                const sizeDiff = this._updateSizeCache(changes);
                this._applyChanges();
                if (sizeDiff) {
                    this._adjustScrollPositionAfterSizeChange(sizeDiff);
                }
                this._updateScrollOffset();
                this.dataChanged.emit();
            }
        }
    }
    onScroll(event) {
        if (!parseInt(this.scrollComponent.nativeElement.style.height, 10)) {
            return;
        }
        if (!this._bScrollInternal) {
            this._calcVirtualScrollTop(event.target.scrollTop);
        }
        else {
            this._bScrollInternal = false;
        }
        const scrollOffset = this.fixedUpdateAllElements(this._virtScrollTop);
        this.dc.instance._viewContainer.element.nativeElement.style.top = -(scrollOffset) + 'px';
        this._zone.onStable.pipe(first()).subscribe(this.recalcUpdateSizes.bind(this));
        this.cdr.markForCheck();
    }
    onHScroll(scrollAmount) {
        /* in certain situations this may be called when no scrollbar is visible */
        const firstScrollChild = this.scrollComponent.nativeElement.children.item(0);
        if (!this.scrollComponent || !parseInt(firstScrollChild.style.width, 10)) {
            return;
        }
        // Updating horizontal chunks
        const scrollOffset = this.fixedUpdateAllElements(Math.abs(scrollAmount));
        if (scrollAmount < 0) {
            // RTL
            this.dc.instance._viewContainer.element.nativeElement.style.left = scrollOffset + 'px';
        }
        else {
            // LTR
            this.dc.instance._viewContainer.element.nativeElement.style.left = -scrollOffset + 'px';
        }
    }
    getItemSize(item) {
        let size = 0;
        const dimension = this.igxForSizePropName || 'height';
        if (this.igxForScrollOrientation === 'vertical') {
            size = this._getItemSize(item, dimension);
            if (item && item.summaries) {
                size = item.max;
            }
            else if (item && item.groups && item.height) {
                size = item.height;
            }
        }
        else {
            size = parseInt(item[dimension], 10) || 0;
        }
        return size;
    }
    initSizesCache(items) {
        if (!this.syncService.isMaster(this) && this.igxForScrollOrientation === 'horizontal') {
            const masterSizesCache = this.syncService.sizesCache(this.igxForScrollOrientation);
            return masterSizesCache[masterSizesCache.length - 1];
        }
        let totalSize = 0;
        let size = 0;
        let i = 0;
        this.sizesCache = [];
        this.heightCache = [];
        this.sizesCache.push(0);
        const count = this.isRemote ? this.totalItemCount : items.length;
        for (i; i < count; i++) {
            size = this.getItemSize(items[i]);
            if (this.igxForScrollOrientation === 'vertical') {
                this.heightCache.push(size);
            }
            totalSize += size;
            this.sizesCache.push(totalSize);
        }
        return totalSize;
    }
    _updateSizeCache(changes = null) {
        if (this.igxForScrollOrientation === 'horizontal') {
            const oldSize = this.sizesCache[this.sizesCache.length - 1];
            const newSize = this.initSizesCache(this.igxForOf);
            const diff = oldSize - newSize;
            return diff;
        }
        const oldHeight = this.heightCache.length > 0 ? this.heightCache.reduce((acc, val) => acc + val) : 0;
        let newHeight = oldHeight;
        if (changes && !this.isRemote) {
            newHeight = this.handleCacheChanges(changes);
        }
        else {
            return;
        }
        const diff = oldHeight - newHeight;
        // if data has been changed while container is scrolled
        // should update scroll top/left according to change so that same startIndex is in view
        if (Math.abs(diff) > 0 && this.platformUtil.isBrowser) {
            // TODO: This code can be removed. However tests need to be rewritten in a way that they wait for ResizeObserved to complete.
            // So leaving as is for the moment.
            requestAnimationFrame(() => {
                this.recalcUpdateSizes();
                const offset = parseInt(this.dc.instance._viewContainer.element.nativeElement.style.top, 10);
                if (this.scrollPosition !== 0) {
                    this.scrollPosition = this.sizesCache[this.state.startIndex] - offset;
                }
                else {
                    this._updateScrollOffset();
                }
            });
        }
        return diff;
    }
    handleCacheChanges(changes) {
        const identityChanges = [];
        const newHeightCache = [];
        const newSizesCache = [];
        newSizesCache.push(0);
        let newHeight = 0;
        // When there are more than one removed items the changes are not reliable so those with identity change should be default size.
        let numRemovedItems = 0;
        changes.forEachRemovedItem(() => numRemovedItems++);
        // Get the identity changes to determine later if those that have changed their indexes should be assigned default item size.
        changes.forEachIdentityChange((item) => {
            if (item.currentIndex !== item.previousIndex) {
                // Filter out ones that have not changed their index.
                identityChanges[item.currentIndex] = item;
            }
        });
        // Processing each item that is passed to the igxForOf so far seem to be most reliable. We parse the updated list of items.
        changes.forEachItem((item) => {
            if (item.previousIndex !== null &&
                (numRemovedItems < 2 || !identityChanges.length || identityChanges[item.currentIndex])) {
                // Reuse cache on those who have previousIndex.
                // When there are more than one removed items currently the changes are not readable so ones with identity change
                // should be racalculated.
                newHeightCache[item.currentIndex] = this.heightCache[item.previousIndex];
            }
            else {
                // Assign default item size.
                newHeightCache[item.currentIndex] = this.getItemSize(item.item);
            }
            newSizesCache[item.currentIndex + 1] = newSizesCache[item.currentIndex] + newHeightCache[item.currentIndex];
            newHeight += newHeightCache[item.currentIndex];
        });
        this.heightCache = newHeightCache;
        this.sizesCache = newSizesCache;
        return newHeight;
    }
    addLastElem() {
        let elemIndex = this.state.startIndex + this.state.chunkSize;
        if (!this.isRemote && !this.igxForOf) {
            return;
        }
        if (elemIndex >= this.igxForOf.length) {
            elemIndex = this.igxForOf.length - this.state.chunkSize;
        }
        const input = this.igxForOf[elemIndex];
        const embeddedView = this.dc.instance._vcr.createEmbeddedView(this._template, new IgxForOfContext(input, this.getContextIndex(input), this.igxForOf.length));
        this._embeddedViews.push(embeddedView);
        this.state.chunkSize++;
    }
    _updateViews(prevChunkSize) {
        if (this.igxForOf && this.igxForOf.length && this.dc) {
            const embeddedViewCopy = Object.assign([], this._embeddedViews);
            let startIndex;
            let endIndex;
            if (this.isRemote) {
                startIndex = 0;
                endIndex = this.igxForOf.length;
            }
            else {
                startIndex = this.getIndexAt(this.scrollPosition, this.sizesCache);
                if (startIndex + this.state.chunkSize > this.igxForOf.length) {
                    startIndex = this.igxForOf.length - this.state.chunkSize;
                }
                this.state.startIndex = startIndex;
                endIndex = this.state.chunkSize + this.state.startIndex;
            }
            for (let i = startIndex; i < endIndex && this.igxForOf[i] !== undefined; i++) {
                const embView = embeddedViewCopy.shift();
                this.updateTemplateContext(embView.context, i);
            }
            if (prevChunkSize !== this.state.chunkSize) {
                this.chunkLoad.emit(this.state);
            }
        }
    }
    _applyChanges() {
        const prevChunkSize = this.state.chunkSize;
        this.applyChunkSizeChange();
        this._recalcScrollBarSize();
        this._updateViews(prevChunkSize);
    }
    /**
     * @hidden
     */
    _calcMaxChunkSize() {
        if (this.igxForScrollOrientation === 'horizontal') {
            if (this.syncService.isMaster(this)) {
                return super._calcMaxChunkSize();
            }
            return this.syncService.chunkSize(this.igxForScrollOrientation);
        }
        else {
            return super._calcMaxChunkSize();
        }
    }
}
IgxGridForOfDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridForOfDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i2.PlatformUtil }, { token: DOCUMENT }, { token: i1.IgxForOfScrollSyncService }, { token: i1.IgxForOfSyncService }], target: i0.ɵɵFactoryTarget.Directive });
IgxGridForOfDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridForOfDirective, selector: "[igxGridFor][igxGridForOf]", inputs: { igxGridForOf: "igxGridForOf", igxGridForOfUniqueSizeCache: "igxGridForOfUniqueSizeCache", igxGridForOfVariableSizes: "igxGridForOfVariableSizes" }, outputs: { dataChanging: "dataChanging" }, usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridForOfDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxGridFor][igxGridForOf]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i2.PlatformUtil }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.IgxForOfScrollSyncService }, { type: i1.IgxForOfSyncService }]; }, propDecorators: { igxGridForOf: [{
                type: Input
            }], igxGridForOfUniqueSizeCache: [{
                type: Input
            }], igxGridForOfVariableSizes: [{
                type: Input
            }], dataChanging: [{
                type: Output
            }] } });
/**
 * @hidden
 */
export class IgxForOfModule {
}
IgxForOfModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxForOfModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxForOfModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxForOfModule, declarations: [IgxForOfDirective, IgxGridForOfDirective, DisplayContainerComponent,
        VirtualHelperComponent,
        HVirtualHelperComponent,
        VirtualHelperBaseDirective], imports: [IgxScrollInertiaModule, CommonModule], exports: [IgxForOfDirective, IgxGridForOfDirective] });
IgxForOfModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxForOfModule, imports: [[IgxScrollInertiaModule, CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxForOfModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxForOfDirective,
                        IgxGridForOfDirective,
                        DisplayContainerComponent,
                        VirtualHelperComponent,
                        HVirtualHelperComponent,
                        VirtualHelperBaseDirective
                    ],
                    exports: [IgxForOfDirective, IgxGridForOfDirective],
                    imports: [IgxScrollInertiaModule, CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yX29mLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kaXJlY3RpdmVzL2Zvci1vZi9mb3Jfb2YuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZEQUE2RDtBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBa0IsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RSxPQUFPLEVBR0gsU0FBUyxFQUdULFlBQVksRUFDWixLQUFLLEVBSUwsUUFBUSxFQUtSLE1BQU0sRUFNTixNQUFNLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDdEYsT0FBTyxFQUF1Qix5QkFBeUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXJELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDOzs7O0FBRXJFLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO0FBRS9COztHQUVHO0FBQ0gsTUFBTSxPQUFPLGVBQWU7SUFDeEIsWUFDVyxTQUFZLEVBQ1osS0FBYSxFQUNiLEtBQWE7UUFGYixjQUFTLEdBQVQsU0FBUyxDQUFH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UUFDekIsc0JBQXNCO1FBQ3RCLHVCQUF1QjtRQUN2QiwwQkFBMEIsYUFHcEIsc0JBQXNCLEVBQUUsWUFBWSxhQXR1RHJDLGlCQUFpQixFQSsyQ2pCLHFCQUFxQjs0R0EwWHJCLGNBQWMsWUFIZCxDQUFDLHNCQUFzQixFQUFFLFlBQVksQ0FBQzsyRkFHdEMsY0FBYztrQkFiMUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsaUJBQWlCO3dCQUNqQixxQkFBcUI7d0JBQ3JCLHlCQUF5Qjt3QkFDekIsc0JBQXNCO3dCQUN0Qix1QkFBdUI7d0JBQ3ZCLDBCQUEwQjtxQkFDN0I7b0JBQ0QsT0FBTyxFQUFFLENBQUMsaUJBQWlCLEVBQUUscUJBQXFCLENBQUM7b0JBQ25ELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQVksQ0FBQztpQkFDbEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAYW5ndWxhci1lc2xpbnQvbm8tY29uZmxpY3RpbmctbGlmZWN5Y2xlICovXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBOZ0Zvck9mQ29udGV4dCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudFJlZixcbiAgICBEaXJlY3RpdmUsXG4gICAgRG9DaGVjayxcbiAgICBFbWJlZGRlZFZpZXdSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIEl0ZXJhYmxlQ2hhbmdlcyxcbiAgICBJdGVyYWJsZURpZmZlcixcbiAgICBJdGVyYWJsZURpZmZlcnMsXG4gICAgTmdNb2R1bGUsXG4gICAgTmdab25lLFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFRyYWNrQnlGdW5jdGlvbixcbiAgICBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEaXNwbGF5Q29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9kaXNwbGF5LmNvbnRhaW5lcic7XG5pbXBvcnQgeyBIVmlydHVhbEhlbHBlckNvbXBvbmVudCB9IGZyb20gJy4vaG9yaXpvbnRhbC52aXJ0dWFsLmhlbHBlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlydHVhbEhlbHBlckNvbXBvbmVudCB9IGZyb20gJy4vdmlydHVhbC5oZWxwZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneFNjcm9sbEluZXJ0aWFNb2R1bGUgfSBmcm9tICcuLy4uL3Njcm9sbC1pbmVydGlhL3Njcm9sbF9pbmVydGlhLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hGb3JPZlN5bmNTZXJ2aWNlLCBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlIH0gZnJvbSAnLi9mb3Jfb2Yuc3luYy5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgZmlsdGVyLCB0aHJvdHRsZVRpbWUsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgZ2V0UmVzaXplT2JzZXJ2ZXIgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IFZpcnR1YWxIZWxwZXJCYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi9iYXNlLmhlbHBlci5jb21wb25lbnQnO1xuXG5jb25zdCBNQVhfUEVSRl9TQ1JPTExfRElGRiA9IDQ7XG5cbi8qKlxuICogIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIElneEZvck9mQ29udGV4dDxUPiB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyAkaW1wbGljaXQ6IFQsXG4gICAgICAgIHB1YmxpYyBpbmRleDogbnVtYmVyLFxuICAgICAgICBwdWJsaWMgY291bnQ6IG51bWJlclxuICAgICkgeyB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIHRoZSBmaXJzdCBvciBub3RcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZpcnN0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA9PT0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIHRoZSBsYXN0IG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGFzdCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPT09IHRoaXMuY291bnQgLSAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgZXZlbiBvciBub3RcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGV2ZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICUgMiA9PT0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIG9kZCBvciBub3RcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG9kZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmV2ZW47XG4gICAgfVxuXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneEZvcl1baWd4Rm9yT2ZdJyxcbiAgICBwcm92aWRlcnM6IFtJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlXVxufSlcbi8vIGVzbGludC1kaXNhYmxlIEBhbmd1bGFyLWVzbGludC9uby1jb25mbGljdGluZy1saWZlY3ljbGVcbmV4cG9ydCBjbGFzcyBJZ3hGb3JPZkRpcmVjdGl2ZTxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBEb0NoZWNrLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlIGlneEZvciBsZXQtaXRlbSBbaWd4Rm9yT2ZdPVwiZGF0YVwiIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIj48L25nLXRlbXBsYXRlPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlneEZvck9mOiBhbnlbXSB8IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSBwcm9wZXJ0eSBuYW1lIGZyb20gd2hpY2ggdG8gcmVhZCB0aGUgc2l6ZSBpbiB0aGUgZGF0YSBvYmplY3QuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWd4Rm9yU2l6ZVByb3BOYW1lO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc3BlY2lmaWVzIHRoZSBzY3JvbGwgb3JpZW50YXRpb24uXG4gICAgICogU2Nyb2xsIG9yaWVudGF0aW9uIGNhbiBiZSBcInZlcnRpY2FsXCIgb3IgXCJob3Jpem9udGFsXCIuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxuZy10ZW1wbGF0ZSBpZ3hGb3IgbGV0LWl0ZW0gW2lneEZvck9mXT1cImRhdGFcIiBbaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb25dPVwiJ2hvcml6b250YWwnXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9ICd2ZXJ0aWNhbCc7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25hbGx5IHBhc3MgdGhlIHBhcmVudCBgaWd4Rm9yYCBpbnN0YW5jZSB0byBjcmVhdGUgYSB2aXJ0dWFsIHRlbXBsYXRlIHNjcm9sbGluZyBib3RoIGhvcml6b250YWxseSBhbmQgdmVydGljYWxseS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlICNzY3JvbGxDb250YWluZXIgaWd4Rm9yIGxldC1yb3dEYXRhIFtpZ3hGb3JPZl09XCJkYXRhXCJcbiAgICAgKiAgICAgICBbaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb25dPVwiJ3ZlcnRpY2FsJ1wiXG4gICAgICogICAgICAgW2lneEZvckNvbnRhaW5lclNpemVdPVwiJzUwMHB4J1wiXG4gICAgICogICAgICAgW2lneEZvckl0ZW1TaXplXT1cIic1MHB4J1wiXG4gICAgICogICAgICAgbGV0LXJvd0luZGV4PVwiaW5kZXhcIj5cbiAgICAgKiAgICAgICA8ZGl2IFtzdHlsZS5kaXNwbGF5XT1cIidmbGV4J1wiIFtzdHlsZS5oZWlnaHRdPVwiJzUwcHgnXCI+XG4gICAgICogICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjY2hpbGRDb250YWluZXIgaWd4Rm9yIGxldC1pdGVtIFtpZ3hGb3JPZl09XCJkYXRhXCJcbiAgICAgKiAgICAgICAgICAgICAgIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIlxuICAgICAqICAgICAgICAgICAgICAgW2lneEZvclNjcm9sbENvbnRhaW5lcl09XCJwYXJlbnRWaXJ0RGlyXCJcbiAgICAgKiAgICAgICAgICAgICAgIFtpZ3hGb3JDb250YWluZXJTaXplXT1cIic1MDBweCdcIj5cbiAgICAgKiAgICAgICAgICAgICAgICAgICA8ZGl2IFtzdHlsZS5taW4td2lkdGhdPVwiJzUwcHgnXCI+e3tyb3dJbmRleH19IDoge3tpdGVtLnRleHR9fTwvZGl2PlxuICAgICAqICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAqICAgICAgIDwvZGl2PlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWd4Rm9yU2Nyb2xsQ29udGFpbmVyOiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSBweC1hZmZpeGVkIHNpemUgb2YgdGhlIGNvbnRhaW5lciBhbG9uZyB0aGUgYXhpcyBvZiBzY3JvbGxpbmcuXG4gICAgICogRm9yIFwiaG9yaXpvbnRhbFwiIG9yaWVudGF0aW9uIHRoaXMgdmFsdWUgaXMgdGhlIHdpZHRoIG9mIHRoZSBjb250YWluZXIgYW5kIGZvciBcInZlcnRpY2FsXCIgaXMgdGhlIGhlaWdodC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlIGlneEZvciBsZXQtaXRlbSBbaWd4Rm9yT2ZdPVwiZGF0YVwiIFtpZ3hGb3JDb250YWluZXJTaXplXT1cIic1MDBweCdcIlxuICAgICAqICAgICAgW2lneEZvclNjcm9sbE9yaWVudGF0aW9uXT1cIidob3Jpem9udGFsJ1wiPlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWd4Rm9yQ29udGFpbmVyU2l6ZTogYW55O1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgcHgtYWZmaXhlZCBzaXplIG9mIHRoZSBpdGVtIGFsb25nIHRoZSBheGlzIG9mIHNjcm9sbGluZy5cbiAgICAgKiBGb3IgXCJob3Jpem9udGFsXCIgb3JpZW50YXRpb24gdGhpcyB2YWx1ZSBpcyB0aGUgd2lkdGggb2YgdGhlIGNvbHVtbiBhbmQgZm9yIFwidmVydGljYWxcIiBpcyB0aGUgaGVpZ2h0IG9yIHRoZSByb3cuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxuZy10ZW1wbGF0ZSBpZ3hGb3IgbGV0LWl0ZW0gW2lneEZvck9mXT1cImRhdGFcIiBbaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb25dPVwiJ2hvcml6b250YWwnXCIgW2lneEZvckl0ZW1TaXplXT1cIic1MHB4J1wiPjwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWd4Rm9ySXRlbVNpemU6IGFueTtcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRoYXQgaXMgZW1pdHRlZCBhZnRlciBhIG5ldyBjaHVuayBoYXMgYmVlbiBsb2FkZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxuZy10ZW1wbGF0ZSBpZ3hGb3IgW2lneEZvck9mXT1cImRhdGFcIiBbaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb25dPVwiJ2hvcml6b250YWwnXCIgKGNodW5rTG9hZCk9XCJsb2FkQ2h1bmsoJGV2ZW50KVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxvYWRDaHVuayhlKXtcbiAgICAgKiBhbGVydChcImNodW5rIGxvYWRlZCFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjaHVua0xvYWQgPSBuZXcgRXZlbnRFbWl0dGVyPElGb3JPZlN0YXRlPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBzY3JvbGxiYXIgdmlzaWJpbGl0eSBoYXMgY2hhbmdlZC5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2Nyb2xsYmFyVmlzaWJpbGl0eUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRoYXQgaXMgZW1pdHRlZCBhZnRlciB0aGUgcmVuZGVyZWQgY29udGVudCBzaXplIG9mIHRoZSBpZ3hGb3JPZiBoYXMgYmVlbiBjaGFuZ2VkLlxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjb250ZW50U2l6ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdGhhdCBpcyBlbWl0dGVkIGFmdGVyIGRhdGEgaGFzIGJlZW4gY2hhbmdlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlIGlneEZvciBbaWd4Rm9yT2ZdPVwiZGF0YVwiIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIiAoZGF0YUNoYW5nZWQpPVwiZGF0YUNoYW5nZWQoJGV2ZW50KVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGRhdGFDaGFuZ2VkKGUpe1xuICAgICAqIGFsZXJ0KFwiZGF0YSBjaGFuZ2VkIVwiKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGRhdGFDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgYmVmb3JlVmlld0Rlc3Ryb3llZCA9IG5ldyBFdmVudEVtaXR0ZXI8RW1iZWRkZWRWaWV3UmVmPGFueT4+KCk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgb24gY2h1bmsgbG9hZGluZyB0byBlbWl0IHRoZSBjdXJyZW50IHN0YXRlIGluZm9ybWF0aW9uIC0gc3RhcnRJbmRleCwgZW5kSW5kZXgsIHRvdGFsQ291bnQuXG4gICAgICogQ2FuIGJlIHVzZWQgZm9yIGltcGxlbWVudGluZyByZW1vdGUgbG9hZCBvbiBkZW1hbmQgZm9yIHRoZSBpZ3hGb3IgZGF0YS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlIGlneEZvciBbaWd4Rm9yT2ZdPVwiZGF0YVwiIFtpZ3hGb3JTY3JvbGxPcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIiAoY2h1bmtQcmVsb2FkKT1cImNodW5rUHJlbG9hZCgkZXZlbnQpXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY2h1bmtQcmVsb2FkKGUpe1xuICAgICAqIGFsZXJ0KFwiY2h1bmsgaXMgbG9hZGluZyFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjaHVua1ByZWxvYWQgPSBuZXcgRXZlbnRFbWl0dGVyPElGb3JPZlN0YXRlPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBkYzogQ29tcG9uZW50UmVmPERpc3BsYXlDb250YWluZXJDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRpcmVjdGl2ZS4gSXQgY29udGFpbnMgYHN0YXJ0SW5kZXhgIGFuZCBgY2h1bmtTaXplYC5cbiAgICAgKiBzdGF0ZS5zdGFydEluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBpdGVtIGF0IHdoaWNoIHRoZSBjdXJyZW50IHZpc2libGUgY2h1bmsgYmVnaW5zLlxuICAgICAqIHN0YXRlLmNodW5rU2l6ZSAtIFRoZSBudW1iZXIgb2YgaXRlbXMgdGhlIGN1cnJlbnQgdmlzaWJsZSBjaHVuayBob2xkcy5cbiAgICAgKiBUaGVzZSBvcHRpb25zIGNhbiBiZSB1c2VkIHdoZW4gaW1wbGVtZW50aW5nIHJlbW90ZSB2aXJ0dWFsaXphdGlvbiBhcyB0aGV5IHByb3ZpZGUgdGhlIG5lY2Vzc2FyeSBzdGF0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZ3JpZFN0YXRlID0gdGhpcy5wYXJlbnRWaXJ0RGlyLnN0YXRlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0ZTogSUZvck9mU3RhdGUgPSB7XG4gICAgICAgIHN0YXJ0SW5kZXg6IDAsXG4gICAgICAgIGNodW5rU2l6ZTogMFxuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgZnVuYztcbiAgICBwcm90ZWN0ZWQgX3NpemVzQ2FjaGU6IG51bWJlcltdID0gW107XG4gICAgcHJvdGVjdGVkIHNjcm9sbENvbXBvbmVudDogVmlydHVhbEhlbHBlckJhc2VEaXJlY3RpdmU7XG4gICAgcHJvdGVjdGVkIF9kaWZmZXI6IEl0ZXJhYmxlRGlmZmVyPFQ+IHwgbnVsbCA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF90cmFja0J5Rm46IFRyYWNrQnlGdW5jdGlvbjxUPjtcbiAgICBwcm90ZWN0ZWQgaGVpZ2h0Q2FjaGUgPSBbXTtcbiAgICAvKiogSW50ZXJuYWwgdHJhY2sgZm9yIHNjcm9sbCB0b3AgdGhhdCBpcyBiZWluZyB2aXJ0dWFsaXplZCAqL1xuICAgIHByb3RlY3RlZCBfdmlydFNjcm9sbFRvcCA9IDA7XG4gICAgLyoqIElmIHRoZSBuZXh0IG9uU2Nyb2xsIGV2ZW50IGlzIHRyaWdnZXJlZCBkdWUgdG8gaW50ZXJuYWwgc2V0dGluZyBvZiBzY3JvbGxUb3AgKi9cbiAgICBwcm90ZWN0ZWQgX2JTY3JvbGxJbnRlcm5hbCA9IGZhbHNlO1xuICAgIC8vIEVuZCBwcm9wZXJ0aWVzIHJlbGF0ZWQgdG8gdmlydHVhbCBoZWlnaHQgaGFuZGxpbmdcbiAgICBwcm90ZWN0ZWQgX2VtYmVkZGVkVmlld3M6IEFycmF5PEVtYmVkZGVkVmlld1JlZjxhbnk+PiA9IFtdO1xuICAgIHByb3RlY3RlZCBjb250ZW50UmVzaXplTm90aWZ5ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwcm90ZWN0ZWQgY29udGVudE9ic2VydmVyOiBSZXNpemVPYnNlcnZlcjtcbiAgICAvKiogSGVpZ2h0IHRoYXQgaXMgYmVpbmcgdmlydHVhbGl6ZWQuICovXG4gICAgcHJvdGVjdGVkIF92aXJ0SGVpZ2h0ID0gMDtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgcHJpdmF0ZSBfdG90YWxJdGVtQ291bnQ6IG51bWJlciA9IG51bGw7XG4gICAgcHJpdmF0ZSBfYWRqdXN0VG9JbmRleDtcbiAgICAvLyBTdGFydCBwcm9wZXJ0aWVzIHJlbGF0ZWQgdG8gdmlydHVhbCBoZWlnaHQgaGFuZGxpbmcgZHVlIHRvIGJyb3dzZXIgbGltaXRhdGlvblxuICAgIC8qKiBNYXhpbXVtIGhlaWdodCBmb3IgYW4gZWxlbWVudCBvZiB0aGUgYnJvd3Nlci4gKi9cbiAgICBwcml2YXRlIF9tYXhIZWlnaHQ7XG4gICAgLyoqXG4gICAgICogUmF0aW8gZm9yIGhlaWdodCB0aGF0J3MgYmVpbmcgdmlydHVhbGl6YWVkIGFuZCB0aGUgb25lIHZpc2libGVcbiAgICAgKiBJZiBfdmlydEhlaWdodFJhdGlvID0gMSwgdGhlIHZpc2libGUgaGVpZ2h0IGFuZCB0aGUgdmlydHVhbGl6ZWQgYXJlIHRoZSBzYW1lLCBhbHNvIF9tYXhIZWlnaHQgPiBfdmlydEhlaWdodC5cbiAgICAgKi9cbiAgICBwcml2YXRlIF92aXJ0SGVpZ2h0UmF0aW8gPSAxO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRvdGFsIGNvdW50IG9mIHRoZSB2aXJ0dWFsIGRhdGEgaXRlbXMsIHdoZW4gdXNpbmcgcmVtb3RlIHNlcnZpY2UuXG4gICAgICogU2ltaWxhciB0byB0aGUgcHJvcGVydHkgdG90YWxJdGVtQ291bnQsIGJ1dCB0aGlzIHdpbGwgYWxsb3cgc2V0dGluZyB0aGUgZGF0YSBjb3VudCBpbnRvIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPG5nLXRlbXBsYXRlIGlneEZvciBsZXQtaXRlbSBbaWd4Rm9yT2ZdPVwiZGF0YSB8IGFzeW5jXCIgW2lneEZvclRvdGFsSXRlbUNvdW50XT1cImNvdW50IHwgYXN5bmNcIlxuICAgICAqICBbaWd4Rm9yQ29udGFpbmVyU2l6ZV09XCInNTAwcHgnXCIgW2lneEZvckl0ZW1TaXplXT1cIic1MHB4J1wiPjwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGlneEZvclRvdGFsSXRlbUNvdW50KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdGFsSXRlbUNvdW50O1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGlneEZvclRvdGFsSXRlbUNvdW50KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50b3RhbEl0ZW1Db3VudCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSB0b3RhbCBjb3VudCBvZiB0aGUgdmlydHVhbCBkYXRhIGl0ZW1zLCB3aGVuIHVzaW5nIHJlbW90ZSBzZXJ2aWNlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnBhcmVudFZpcnREaXIudG90YWxJdGVtQ291bnQgPSBkYXRhLkNvdW50O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG90YWxJdGVtQ291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b3RhbEl0ZW1Db3VudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHRvdGFsSXRlbUNvdW50KHZhbCkge1xuICAgICAgICBpZiAodGhpcy5fdG90YWxJdGVtQ291bnQgIT09IHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fdG90YWxJdGVtQ291bnQgPSB2YWw7XG4gICAgICAgICAgICAvLyB1cGRhdGUgc2l6ZXMgaW4gY2FzZSB0b3RhbCBjb3VudCBjaGFuZ2VzLlxuICAgICAgICAgICAgY29uc3QgbmV3U2l6ZSA9IHRoaXMuaW5pdFNpemVzQ2FjaGUodGhpcy5pZ3hGb3JPZik7XG4gICAgICAgICAgICBjb25zdCBzaXplRGlmZiA9IHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNpemUgLSBuZXdTaXplO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQuc2l6ZSA9IG5ld1NpemU7XG4gICAgICAgICAgICBjb25zdCBsYXN0Q2h1bmtFeGNlZWRlZCA9IHRoaXMuc3RhdGUuc3RhcnRJbmRleCArIHRoaXMuc3RhdGUuY2h1bmtTaXplID4gdmFsO1xuICAgICAgICAgICAgaWYgKGxhc3RDaHVua0V4Y2VlZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydEluZGV4ID0gdmFsIC0gdGhpcy5zdGF0ZS5jaHVua1NpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hZGp1c3RTY3JvbGxQb3NpdGlvbkFmdGVyU2l6ZUNoYW5nZShzaXplRGlmZik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGRpc3BsYXlDb250YWluZXIoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5kYz8uaW5zdGFuY2U/Ll92aWV3Q29udGFpbmVyPy5lbGVtZW50Py5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdmlydHVhbEhlbHBlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNSZW1vdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdGFsSXRlbUNvdW50ICE9PSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0cy9TZXRzIHRoZSBzY3JvbGwgcG9zaXRpb24uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHBvc2l0aW9uID0gZGlyZWN0aXZlLnNjcm9sbFBvc2l0aW9uO1xuICAgICAqIGRpcmVjdGl2ZS5zY3JvbGxQb3NpdGlvbiA9IHZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2Nyb2xsUG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNjcm9sbEFtb3VudDtcbiAgICB9XG4gICAgcHVibGljIHNldCBzY3JvbGxQb3NpdGlvbih2YWw6IG51bWJlcikge1xuICAgICAgICBpZiAodmFsID09PSB0aGlzLnNjcm9sbENvbXBvbmVudC5zY3JvbGxBbW91bnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnICYmIHRoaXMuc2Nyb2xsQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbXBvbmVudC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSB2YWw7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXQgaXNSVEwoKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXJlY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuIGRpciA9PT0gJ3J0bCc7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBzaXplc0NhY2hlKCk6IG51bWJlcltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemVzQ2FjaGU7XG4gICAgfVxuICAgIHByb3RlY3RlZCBzZXQgc2l6ZXNDYWNoZSh2YWx1ZTogbnVtYmVyW10pIHtcbiAgICAgICAgdGhpcy5fc2l6ZXNDYWNoZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IF9pc1Njcm9sbGVkVG9Cb3R0b20oKSB7XG4gICAgICAgIGlmICghdGhpcy5nZXRTY3JvbGwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGwoKS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIC8vIFVzZSA9PT0gYW5kIG5vdCA+PSBiZWNhdXNlIGBzY3JvbGxUb3AgKyBjb250YWluZXIgc2l6ZWAgY2FuJ3QgYmUgYmlnZ2VyIHRoYW4gYHNjcm9sbEhlaWdodGAsIHVubGVzcyBzb21ldGhpbmcgaXNuJ3QgdXBkYXRlZC5cbiAgICAgICAgLy8gQWxzbyB1c2UgTWF0aC5yb3VuZCBiZWNhdXNlIENocm9tZSBoYXMgc29tZSBpbmNvbnNpc3RlbmNpZXMgYW5kIGBzY3JvbGxUb3AgKyBjb250YWluZXJgIGNhbiBiZSBmbG9hdCB3aGVuIHpvb21pbmcgdGhlIHBhZ2UuXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuZ2V0U2Nyb2xsKCkuc2Nyb2xsVG9wICsgdGhpcy5pZ3hGb3JDb250YWluZXJTaXplKSA9PT0gc2Nyb2xsSGVpZ2h0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IF9pc0F0Qm90dG9tSW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlneEZvck9mICYmIHRoaXMuc3RhdGUuc3RhcnRJbmRleCArIHRoaXMuc3RhdGUuY2h1bmtTaXplID4gdGhpcy5pZ3hGb3JPZi5sZW5ndGg7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIHByb3RlY3RlZCBfdGVtcGxhdGU6IFRlbXBsYXRlUmVmPE5nRm9yT2ZDb250ZXh0PFQ+PixcbiAgICAgICAgcHJvdGVjdGVkIF9kaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcm90ZWN0ZWQgX3pvbmU6IE5nWm9uZSxcbiAgICAgICAgcHJvdGVjdGVkIHN5bmNTY3JvbGxTZXJ2aWNlOiBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm1VdGlsOiBQbGF0Zm9ybVV0aWwsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpXG4gICAgICAgIHByb3RlY3RlZCBkb2N1bWVudDogYW55LFxuICAgICkgeyB9XG5cbiAgICBwdWJsaWMgdmVydGljYWxTY3JvbGxIYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMub25TY3JvbGwoZXZlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1Njcm9sbGFibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjcm9sbENvbXBvbmVudC5zaXplID4gcGFyc2VJbnQodGhpcy5pZ3hGb3JDb250YWluZXJTaXplLCAxMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHRvdGFsU2l6ZSA9IDA7XG4gICAgICAgIGNvbnN0IHZjID0gdGhpcy5pZ3hGb3JTY3JvbGxDb250YWluZXIgPyB0aGlzLmlneEZvclNjcm9sbENvbnRhaW5lci5fdmlld0NvbnRhaW5lciA6IHRoaXMuX3ZpZXdDb250YWluZXI7XG4gICAgICAgIHRoaXMuaWd4Rm9yU2l6ZVByb3BOYW1lID0gdGhpcy5pZ3hGb3JTaXplUHJvcE5hbWUgfHwgJ3dpZHRoJztcbiAgICAgICAgdGhpcy5kYyA9IHRoaXMuX3ZpZXdDb250YWluZXIuY3JlYXRlQ29tcG9uZW50KERpc3BsYXlDb250YWluZXJDb21wb25lbnQsIHsgaW5kZXg6IDAgfSk7XG4gICAgICAgIHRoaXMuZGMuaW5zdGFuY2Uuc2Nyb2xsRGlyZWN0aW9uID0gdGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbjtcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yT2YgJiYgdGhpcy5pZ3hGb3JPZi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRvdGFsU2l6ZSA9IHRoaXMuaW5pdFNpemVzQ2FjaGUodGhpcy5pZ3hGb3JPZik7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbXBvbmVudCA9IHRoaXMuc3luY1Njcm9sbFNlcnZpY2UuZ2V0U2Nyb2xsTWFzdGVyKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24pO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jaHVua1NpemUgPSB0aGlzLl9jYWxjdWxhdGVDaHVua1NpemUoKTtcbiAgICAgICAgICAgIHRoaXMuZGMuaW5zdGFuY2Uubm90VmlydHVhbCA9ICEodGhpcy5pZ3hGb3JDb250YWluZXJTaXplICYmIHRoaXMuc3RhdGUuY2h1bmtTaXplIDwgdGhpcy5pZ3hGb3JPZi5sZW5ndGgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsQ29tcG9uZW50ICYmICF0aGlzLnNjcm9sbENvbXBvbmVudC5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggPSBNYXRoLm1pbih0aGlzLmdldEluZGV4QXQodGhpcy5zY3JvbGxQb3NpdGlvbiwgdGhpcy5zaXplc0NhY2hlKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pZ3hGb3JPZi5sZW5ndGggLSB0aGlzLnN0YXRlLmNodW5rU2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGF0ZS5zdGFydEluZGV4OyBpIDwgdGhpcy5zdGF0ZS5zdGFydEluZGV4ICsgdGhpcy5zdGF0ZS5jaHVua1NpemUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmlneEZvck9mW2ldICE9PSB1bmRlZmluZWQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pZ3hGb3JPZltpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbWJlZGRlZFZpZXcgPSB0aGlzLmRjLmluc3RhbmNlLl92Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IElneEZvck9mQ29udGV4dDxUPihpbnB1dCwgdGhpcy5nZXRDb250ZXh0SW5kZXgoaW5wdXQpLCB0aGlzLmlneEZvck9mLmxlbmd0aClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtYmVkZGVkVmlld3MucHVzaChlbWJlZGRlZFZpZXcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQgPSB0aGlzLnN5bmNTY3JvbGxTZXJ2aWNlLmdldFNjcm9sbE1hc3Rlcih0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY3JvbGxDb21wb25lbnQgfHwgdGhpcy5zY3JvbGxDb21wb25lbnQuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQgPSB2Yy5jcmVhdGVDb21wb25lbnQoVmlydHVhbEhlbHBlckNvbXBvbmVudCkuaW5zdGFuY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tYXhIZWlnaHQgPSB0aGlzLl9jYWxjTWF4QnJvd3NlckhlaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQuc2l6ZSA9IHRoaXMuaWd4Rm9yT2YgPyB0aGlzLl9jYWxjSGVpZ2h0KCkgOiAwO1xuICAgICAgICAgICAgdGhpcy5zeW5jU2Nyb2xsU2VydmljZS5zZXRTY3JvbGxNYXN0ZXIodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiwgdGhpcy5zY3JvbGxDb21wb25lbnQpO1xuICAgICAgICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEhhbmRsZXIgPSB0aGlzLnZlcnRpY2FsU2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy52ZXJ0aWNhbFNjcm9sbEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGMuaW5zdGFuY2Uuc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5zY3JvbGxDb21wb25lbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgZGVzdHJ1Y3RvciA9IHRha2VVbnRpbDxhbnk+KHRoaXMuZGVzdHJveSQpO1xuICAgICAgICAgICAgdGhpcy5jb250ZW50UmVzaXplTm90aWZ5LnBpcGUoXG4gICAgICAgICAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSAmJiB0aGlzLmlneEZvck9mICYmIHRoaXMuaWd4Rm9yT2YubGVuZ3RoID4gMCksXG4gICAgICAgICAgICAgICAgdGhyb3R0bGVUaW1lKDQwLCB1bmRlZmluZWQsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fem9uZS5ydW5UYXNrKCgpID0+IHRoaXMudXBkYXRlU2l6ZXMoKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgdGhpcy5mdW5jID0gKGV2dCkgPT4gdGhpcy5vbkhTY3JvbGwoZXZ0KTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50ID0gdGhpcy5zeW5jU2Nyb2xsU2VydmljZS5nZXRTY3JvbGxNYXN0ZXIodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbik7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQgPSB2Yy5jcmVhdGVDb21wb25lbnQoSFZpcnR1YWxIZWxwZXJDb21wb25lbnQpLmluc3RhbmNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNpemUgPSB0b3RhbFNpemU7XG4gICAgICAgICAgICAgICAgdGhpcy5zeW5jU2Nyb2xsU2VydmljZS5zZXRTY3JvbGxNYXN0ZXIodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiwgdGhpcy5zY3JvbGxDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbXBvbmVudC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuZnVuYyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGMuaW5zdGFuY2Uuc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5zY3JvbGxDb21wb25lbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5mdW5jKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5zY3JvbGxDb250YWluZXIgPSB0aGlzLnNjcm9sbENvbXBvbmVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSFNjcm9sbE9mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudE9ic2VydmVyID0gbmV3IChnZXRSZXNpemVPYnNlcnZlcigpKSgoKSA9PiB0aGlzLmNvbnRlbnRSZXNpemVOb3RpZnkubmV4dCgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVTY3JvbGxFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudE9ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZm9yT2YgPSAnaWd4Rm9yT2YnO1xuICAgICAgICBpZiAoZm9yT2YgaW4gY2hhbmdlcykge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjaGFuZ2VzW2Zvck9mXS5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RpZmZlciAmJiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh2YWx1ZSkuY3JlYXRlKHRoaXMuaWd4Rm9yVHJhY2tCeSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgQ2Fubm90IGZpbmQgYSBkaWZmZXIgc3VwcG9ydGluZyBvYmplY3QgXCIke3ZhbHVlfVwiIG9mIHR5cGUgXCIke2dldFR5cGVOYW1lRm9yRGVidWdnaW5nKHZhbHVlKX1cIi5cbiAgICAgICAgICAgICAgICAgICAgIE5nRm9yIG9ubHkgc3VwcG9ydHMgYmluZGluZyB0byBJdGVyYWJsZXMgc3VjaCBhcyBBcnJheXMuYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlZmF1bHRJdGVtU2l6ZSA9ICdpZ3hGb3JJdGVtU2l6ZSc7XG4gICAgICAgIGlmIChkZWZhdWx0SXRlbVNpemUgaW4gY2hhbmdlcyAmJiAhY2hhbmdlc1tkZWZhdWx0SXRlbVNpemVdLmZpcnN0Q2hhbmdlICYmXG4gICAgICAgICAgICB0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAndmVydGljYWwnICYmIHRoaXMuaWd4Rm9yT2YpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBkZWZhdWx0IGl0ZW0gc2l6ZSBjaGFuZ2VkLlxuICAgICAgICAgICAgdGhpcy5pbml0U2l6ZXNDYWNoZSh0aGlzLmlneEZvck9mKTtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lclNpemUgPSAnaWd4Rm9yQ29udGFpbmVyU2l6ZSc7XG4gICAgICAgIGlmIChjb250YWluZXJTaXplIGluIGNoYW5nZXMgJiYgIWNoYW5nZXNbY29udGFpbmVyU2l6ZV0uZmlyc3RDaGFuZ2UgJiYgdGhpcy5pZ3hGb3JPZikge1xuICAgICAgICAgICAgdGhpcy5fcmVjYWxjT25Db250YWluZXJDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fZGlmZmVyKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5pZ3hGb3JPZik7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcykge1xuICAgICAgICAgICAgICAgIC8vICByZS1pbml0IGNhY2hlLlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pZ3hGb3JPZikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlneEZvck9mID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNpemVDYWNoZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2hhbmdlZC5lbWl0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaGlmdHMgdGhlIHNjcm9sbCB0aHVtYiBwb3NpdGlvbi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLmFkZFNjcm9sbFRvcCg1KTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhZGRUb3AgbmVnYXRpdmUgdmFsdWUgdG8gc2Nyb2xsIHVwIGFuZCBwb3NpdGl2ZSB0byBzY3JvbGwgZG93bjtcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkU2Nyb2xsVG9wKGFkZFRvcDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChhZGRUb3AgPT09IDAgJiYgdGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWaXJ0U2Nyb2xsVG9wID0gdGhpcy5fdmlydFNjcm9sbFRvcDtcbiAgICAgICAgY29uc3QgY29udGFpbmVyU2l6ZSA9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApO1xuICAgICAgICBjb25zdCBtYXhWaXJ0U2Nyb2xsVG9wID0gdGhpcy5fdmlydEhlaWdodCAtIGNvbnRhaW5lclNpemU7XG5cbiAgICAgICAgdGhpcy5fYlNjcm9sbEludGVybmFsID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdmlydFNjcm9sbFRvcCArPSBhZGRUb3A7XG4gICAgICAgIHRoaXMuX3ZpcnRTY3JvbGxUb3AgPSB0aGlzLl92aXJ0U2Nyb2xsVG9wID4gMCA/XG4gICAgICAgICAgICAodGhpcy5fdmlydFNjcm9sbFRvcCA8IG1heFZpcnRTY3JvbGxUb3AgPyB0aGlzLl92aXJ0U2Nyb2xsVG9wIDogbWF4VmlydFNjcm9sbFRvcCkgOlxuICAgICAgICAgICAgMDtcblxuICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uICs9IGFkZFRvcCAvIHRoaXMuX3ZpcnRIZWlnaHRSYXRpbztcbiAgICAgICAgaWYgKE1hdGguYWJzKGFkZFRvcCAvIHRoaXMuX3ZpcnRIZWlnaHRSYXRpbykgPCAxKSB7XG4gICAgICAgICAgICAvLyBBY3R1YWwgc2Nyb2xsIGRlbHRhIHRoYXQgd2FzIGFkZGVkIGlzIHNtYWxsZXIgdGhhbiAxIGFuZCBvblNjcm9sbCBoYW5kbGVyIGRvZXNuJ3QgdHJpZ2dlciB3aGVuIHNjcm9sbGluZyA8IDFweFxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsT2Zmc2V0ID0gdGhpcy5maXhlZFVwZGF0ZUFsbEVsZW1lbnRzKHRoaXMuX3ZpcnRTY3JvbGxUb3ApO1xuICAgICAgICAgICAgLy8gc2Nyb2xsT2Zmc2V0ID0gc2Nyb2xsT2Zmc2V0ICE9PSBwYXJzZUludCh0aGlzLmlneEZvckl0ZW1TaXplLCAxMCkgPyBzY3JvbGxPZmZzZXQgOiAwO1xuICAgICAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gLShzY3JvbGxPZmZzZXQpICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1heFJlYWxTY3JvbGxUb3AgPSB0aGlzLnNjcm9sbENvbXBvbmVudC5uYXRpdmVFbGVtZW50LnNjcm9sbEhlaWdodCAtIGNvbnRhaW5lclNpemU7XG4gICAgICAgIGlmICgodGhpcy5fdmlydFNjcm9sbFRvcCA+IDAgJiYgdGhpcy5zY3JvbGxQb3NpdGlvbiA9PT0gMCkgfHxcbiAgICAgICAgICAgICh0aGlzLl92aXJ0U2Nyb2xsVG9wIDwgbWF4VmlydFNjcm9sbFRvcCAmJiB0aGlzLnNjcm9sbFBvc2l0aW9uID09PSBtYXhSZWFsU2Nyb2xsVG9wKSkge1xuICAgICAgICAgICAgLy8gQWN0dWFsIHNjcm9sbCBwb3NpdGlvbiBpcyBhdCB0aGUgdG9wIG9yIGJvdHRvbSwgYnV0IHZpcnR1YWwgb25lIGlzIG5vdCBhdCB0aGUgdG9wIG9yIGJvdHRvbSAodGhlcmUncyBtb3JlIHRvIHNjcm9sbClcbiAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIGFjdHVhbCBzY3JvbGwgcG9zaXRpb24gYmFzZWQgb24gdGhlIHZpcnR1YWwgc2Nyb2xsLlxuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IHRoaXMuX3ZpcnRTY3JvbGxUb3AgLyB0aGlzLl92aXJ0SGVpZ2h0UmF0aW87XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdmlydFNjcm9sbFRvcCA9PT0gMCAmJiB0aGlzLnNjcm9sbFBvc2l0aW9uID4gMCkge1xuICAgICAgICAgICAgLy8gQWN0dWFsIHNjcm9sbCBwb3NpdGlvbiBpcyBub3QgYXQgdGhlIHRvcCwgYnV0IHZpcnR1YWwgc2Nyb2xsIGlzLiBKdXN0IHVwZGF0ZSB0aGUgYWN0dWFsIHNjcm9sbFxuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdmlydFNjcm9sbFRvcCA9PT0gbWF4VmlydFNjcm9sbFRvcCAmJiB0aGlzLnNjcm9sbFBvc2l0aW9uIDwgbWF4UmVhbFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgLy8gQWN0dWFsIHNjcm9sbCBwb3NpdGlvbiBpcyBub3QgYXQgdGhlIGJvdHRvbSwgYnV0IHZpcnR1YWwgc2Nyb2xsIGlzLiBKdXN0IHVwZGF0ZSB0aGUgYWN1YWwgc2Nyb2xsXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uID0gbWF4UmVhbFNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fdmlydFNjcm9sbFRvcCAhPT0gb3JpZ2luYWxWaXJ0U2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjcm9sbHMgdG8gdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLnNjcm9sbFRvKDUpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgcHVibGljIHNjcm9sbFRvKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiAodGhpcy5pc1JlbW90ZSA/IHRoaXMudG90YWxJdGVtQ291bnQgOiB0aGlzLmlneEZvck9mLmxlbmd0aCkgLSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGFpbmVyU2l6ZSA9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApO1xuICAgICAgICBjb25zdCBpc1ByZXZJdGVtID0gaW5kZXggPCB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggfHwgdGhpcy5zY3JvbGxQb3NpdGlvbiA+IHRoaXMuc2l6ZXNDYWNoZVtpbmRleF07XG4gICAgICAgIGxldCBuZXh0U2Nyb2xsID0gaXNQcmV2SXRlbSA/IHRoaXMuc2l6ZXNDYWNoZVtpbmRleF0gOiB0aGlzLnNpemVzQ2FjaGVbaW5kZXggKyAxXSAtIGNvbnRhaW5lclNpemU7XG4gICAgICAgIGlmIChuZXh0U2Nyb2xsIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gPSB0aGlzLmlzUlRMID8gLW5leHRTY3JvbGwgOiBuZXh0U2Nyb2xsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbWF4VmlydFNjcm9sbFRvcCA9IHRoaXMuX3ZpcnRIZWlnaHQgLSBjb250YWluZXJTaXplO1xuICAgICAgICAgICAgaWYgKG5leHRTY3JvbGwgPiBtYXhWaXJ0U2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgbmV4dFNjcm9sbCA9IG1heFZpcnRTY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9iU2Nyb2xsSW50ZXJuYWwgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fdmlydFNjcm9sbFRvcCA9IG5leHRTY3JvbGw7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uID0gdGhpcy5fdmlydFNjcm9sbFRvcCAvIHRoaXMuX3ZpcnRIZWlnaHRSYXRpbztcbiAgICAgICAgICAgIHRoaXMuX2FkanVzdFRvSW5kZXggPSAhaXNQcmV2SXRlbSA/IGluZGV4IDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjcm9sbHMgYnkgb25lIGl0ZW0gaW50byB0aGUgYXBwcm9wcmlhdGUgbmV4dCBkaXJlY3Rpb24uXG4gICAgICogRm9yIFwiaG9yaXpvbnRhbFwiIG9yaWVudGF0aW9uIHRoYXQgd2lsbCBiZSB0aGUgcmlnaHQgY29sdW1uIGFuZCBmb3IgXCJ2ZXJ0aWNhbFwiIHRoYXQgaXMgdGhlIGxvd2VyIHJvdy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLnNjcm9sbE5leHQoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2Nyb2xsTmV4dCgpIHtcbiAgICAgICAgY29uc3Qgc2NyID0gTWF0aC5hYnMoTWF0aC5jZWlsKHRoaXMuc2Nyb2xsUG9zaXRpb24pKTtcbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB0aGlzLmdldEluZGV4QXQoc2NyICsgcGFyc2VJbnQodGhpcy5pZ3hGb3JDb250YWluZXJTaXplLCAxMCksIHRoaXMuc2l6ZXNDYWNoZSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG8oZW5kSW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjcm9sbHMgYnkgb25lIGl0ZW0gaW50byB0aGUgYXBwcm9wcmlhdGUgcHJldmlvdXMgZGlyZWN0aW9uLlxuICAgICAqIEZvciBcImhvcml6b250YWxcIiBvcmllbnRhdGlvbiB0aGF0IHdpbGwgYmUgdGhlIGxlZnQgY29sdW1uIGFuZCBmb3IgXCJ2ZXJ0aWNhbFwiIHRoYXQgaXMgdGhlIHVwcGVyIHJvdy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLnNjcm9sbFByZXYoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2Nyb2xsUHJldigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLnN0YXRlLnN0YXJ0SW5kZXggLSAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY3JvbGxzIGJ5IG9uZSBwYWdlIGludG8gdGhlIGFwcHJvcHJpYXRlIG5leHQgZGlyZWN0aW9uLlxuICAgICAqIEZvciBcImhvcml6b250YWxcIiBvcmllbnRhdGlvbiB0aGF0IHdpbGwgYmUgb25lIHZpZXcgdG8gdGhlIHJpZ2h0IGFuZCBmb3IgXCJ2ZXJ0aWNhbFwiIHRoYXQgaXMgb25lIHZpZXcgdG8gdGhlIGJvdHRvbS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLnNjcm9sbE5leHRQYWdlKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNjcm9sbE5leHRQYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFBvc2l0aW9uICs9IHRoaXMuaXNSVEwgPyAtcGFyc2VJbnQodGhpcy5pZ3hGb3JDb250YWluZXJTaXplLCAxMCkgOiBwYXJzZUludCh0aGlzLmlneEZvckNvbnRhaW5lclNpemUsIDEwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkU2Nyb2xsVG9wKHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjcm9sbHMgYnkgb25lIHBhZ2UgaW50byB0aGUgYXBwcm9wcmlhdGUgcHJldmlvdXMgZGlyZWN0aW9uLlxuICAgICAqIEZvciBcImhvcml6b250YWxcIiBvcmllbnRhdGlvbiB0aGF0IHdpbGwgYmUgb25lIHZpZXcgdG8gdGhlIGxlZnQgYW5kIGZvciBcInZlcnRpY2FsXCIgdGhhdCBpcyBvbmUgdmlldyB0byB0aGUgdG9wLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnBhcmVudFZpcnREaXIuc2Nyb2xsUHJldlBhZ2UoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2Nyb2xsUHJldlBhZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gLT0gdGhpcy5pc1JUTCA/IC1wYXJzZUludCh0aGlzLmlneEZvckNvbnRhaW5lclNpemUsIDEwKSA6IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyU2l6ZSA9IChwYXJzZUludCh0aGlzLmlneEZvckNvbnRhaW5lclNpemUsIDEwKSk7XG4gICAgICAgICAgICB0aGlzLmFkZFNjcm9sbFRvcCgtY29udGFpbmVyU2l6ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldENvbHVtblNjcm9sbExlZnQoY29sSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZXNDYWNoZVtjb2xJbmRleF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIHRoYXQgYXJlIGZ1bGx5IHZpc2libGUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMucGFyZW50VmlydERpci5nZXRJdGVtQ291bnRJblZpZXcoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SXRlbUNvdW50SW5WaWV3KCkge1xuICAgICAgICBsZXQgc3RhcnRJbmRleCA9IHRoaXMuZ2V0SW5kZXhBdCh0aGlzLnNjcm9sbFBvc2l0aW9uLCB0aGlzLnNpemVzQ2FjaGUpO1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxQb3NpdGlvbiAtIHRoaXMuc2l6ZXNDYWNoZVtzdGFydEluZGV4XSA+IDApIHtcbiAgICAgICAgICAgIC8vIGZpc3J0IGl0ZW0gaXMgbm90IGZ1bGx5IGluIHZpZXdcbiAgICAgICAgICAgIHN0YXJ0SW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmRJbmRleCA9IHRoaXMuZ2V0SW5kZXhBdCh0aGlzLnNjcm9sbFBvc2l0aW9uICsgcGFyc2VJbnQodGhpcy5pZ3hGb3JDb250YWluZXJTaXplLCAxMCksIHRoaXMuc2l6ZXNDYWNoZSk7XG4gICAgICAgIHJldHVybiBlbmRJbmRleCAtIHN0YXJ0SW5kZXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgc2Nyb2xsYmFyIERPTSBlbGVtZW50LlxuICAgICAqIFRoaXMgaXMgZWl0aGVyIGEgdmVydGljYWwgb3IgaG9yaXpvbnRhbCBzY3JvbGxiYXIgZGVwZW5kaW5nIG9uIHRoZSBzcGVjaWZpZWQgaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGRpci5nZXRTY3JvbGwoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U2Nyb2xsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY3JvbGxDb21wb25lbnQ/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLmdldFNpemVBdCgxKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U2l6ZUF0KGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZXNDYWNoZVtpbmRleCArIDFdIC0gdGhpcy5zaXplc0NhY2hlW2luZGV4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgdG8gZ2V0IHRoZSBuYXRpdmUgc2Nyb2xsYmFyIHNpemUgdGhhdCB0aGUgYnJvd3NlcnMgcmVuZGVycy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U2Nyb2xsTmF0aXZlU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsQ29tcG9uZW50ID8gdGhpcy5zY3JvbGxDb21wb25lbnQuc2Nyb2xsTmF0aXZlU2l6ZSA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2Nyb2xsIG9mZnNldCBvZiB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnBhcmVudFZpcnREaXIuZ2V0U2Nyb2xsRm9ySW5kZXgoMSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldFNjcm9sbEZvckluZGV4KGluZGV4OiBudW1iZXIsIGJvdHRvbT86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyU2l6ZSA9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApO1xuICAgICAgICBjb25zdCBzY3JvbGwgPSBib3R0b20gPyBNYXRoLm1heCgwLCB0aGlzLnNpemVzQ2FjaGVbaW5kZXggKyAxXSAtIGNvbnRhaW5lclNpemUpIDogdGhpcy5zaXplc0NhY2hlW2luZGV4XTtcbiAgICAgICAgcmV0dXJuIHNjcm9sbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIG9mZnNldC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLmdldEluZGV4QXRTY3JvbGwoMTAwKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SW5kZXhBdFNjcm9sbChzY3JvbGxPZmZzZXQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbmRleEF0KHNjcm9sbE9mZnNldCwgdGhpcy5zaXplc0NhY2hlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSB0YXJnZXQgaW5kZXggaXMgb3V0c2lkZSB0aGUgdmlldy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5wYXJlbnRWaXJ0RGlyLmlzSW5kZXhPdXRzaWRlVmlldygxMCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGlzSW5kZXhPdXRzaWRlVmlldyhpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSBpbmRleCA+PSB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggJiYgaW5kZXggPD0gdGhpcy5zdGF0ZS5zdGFydEluZGV4ICsgdGhpcy5zdGF0ZS5jaHVua1NpemUgP1xuICAgICAgICB0aGlzLl9lbWJlZGRlZFZpZXdzLm1hcCh2aWV3ID0+XG4gICAgICAgICAgICB2aWV3LnJvb3ROb2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHx8IHZpZXcucm9vdE5vZGVzWzBdLm5leHRFbGVtZW50U2libGluZylbaW5kZXggLSB0aGlzLnN0YXRlLnN0YXJ0SW5kZXhdIDogbnVsbDtcbiAgICAgICAgY29uc3Qgcm93SGVpZ2h0ID0gdGhpcy5nZXRTaXplQXQoaW5kZXgpO1xuICAgICAgICBjb25zdCBjb250YWluZXJTaXplID0gcGFyc2VJbnQodGhpcy5pZ3hGb3JDb250YWluZXJTaXplLCAxMCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lck9mZnNldCA9IC0odGhpcy5zY3JvbGxQb3NpdGlvbiAtIHRoaXMuc2l6ZXNDYWNoZVt0aGlzLnN0YXRlLnN0YXJ0SW5kZXhdKTtcbiAgICAgICAgY29uc3QgZW5kVG9wT2Zmc2V0ID0gdGFyZ2V0Tm9kZSA/IHRhcmdldE5vZGUub2Zmc2V0VG9wICsgcm93SGVpZ2h0ICsgY29udGFpbmVyT2Zmc2V0IDogY29udGFpbmVyU2l6ZSArIHJvd0hlaWdodDtcbiAgICAgICAgcmV0dXJuICF0YXJnZXROb2RlIHx8IHRhcmdldE5vZGUub2Zmc2V0VG9wIDwgTWF0aC5hYnMoY29udGFpbmVyT2Zmc2V0KVxuICAgICAgICAgICAgfHwgY29udGFpbmVyU2l6ZSAmJiBlbmRUb3BPZmZzZXQgLSBjb250YWluZXJTaXplID4gNTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBGdW5jdGlvbiB0aGF0IHJlY2FsY3VsYXRlcyBhbmQgdXBkYXRlcyBjYWNoZSBzaXplcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVjYWxjVXBkYXRlU2l6ZXMoKSB7XG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyA/XG4gICAgICAgICAgICB0aGlzLmlneEZvclNpemVQcm9wTmFtZSA6ICdoZWlnaHQnO1xuICAgICAgICBjb25zdCBkaWZmcyA9IFtdO1xuICAgICAgICBsZXQgdG90YWxEaWZmID0gMDtcbiAgICAgICAgY29uc3QgbCA9IHRoaXMuX2VtYmVkZGVkVmlld3MubGVuZ3RoO1xuICAgICAgICBjb25zdCByTm9kZXMgPSB0aGlzLl9lbWJlZGRlZFZpZXdzLm1hcCh2aWV3ID0+XG4gICAgICAgICAgICB2aWV3LnJvb3ROb2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHx8IHZpZXcucm9vdE5vZGVzWzBdLm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByTm9kZSA9IHJOb2Rlc1tpXTtcbiAgICAgICAgICAgIGlmIChyTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHJOb2RlKS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gcGFyc2VGbG9hdChoZWlnaHQpIHx8IHBhcnNlSW50KHRoaXMuaWd4Rm9ySXRlbVNpemUsIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc3RhdGUuc3RhcnRJbmRleCArIGk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzUmVtb3RlICYmICF0aGlzLmlneEZvck9mW2luZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbWFyZ2luID0gdGhpcy5nZXRNYXJnaW4ock5vZGUsIGRpbWVuc2lvbik7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkVmFsID0gZGltZW5zaW9uID09PSAnaGVpZ2h0JyA/IHRoaXMuaGVpZ2h0Q2FjaGVbaW5kZXhdIDogdGhpcy5pZ3hGb3JPZltpbmRleF1bZGltZW5zaW9uXTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdWYWwgPSAoZGltZW5zaW9uID09PSAnaGVpZ2h0JyA/IGggOiByTm9kZS5jbGllbnRXaWR0aCkgKyBtYXJnaW47XG4gICAgICAgICAgICAgICAgaWYgKGRpbWVuc2lvbiA9PT0gJ2hlaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRDYWNoZVtpbmRleF0gPSBuZXdWYWw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pZ3hGb3JPZltpbmRleF1bZGltZW5zaW9uXSA9IG5ld1ZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY3VyckRpZmYgPSBuZXdWYWwgLSBvbGRWYWw7XG4gICAgICAgICAgICAgICAgZGlmZnMucHVzaChjdXJyRGlmZik7XG4gICAgICAgICAgICAgICAgdG90YWxEaWZmICs9IGN1cnJEaWZmO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZXNDYWNoZVtpbmRleCArIDFdICs9IHRvdGFsRGlmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB1cGRhdGUgY2FjaGVcbiAgICAgICAgaWYgKE1hdGguYWJzKHRvdGFsRGlmZikgPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gdGhpcy5zdGF0ZS5zdGFydEluZGV4ICsgdGhpcy5zdGF0ZS5jaHVua1NpemUgKyAxOyBqIDwgdGhpcy5zaXplc0NhY2hlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplc0NhY2hlW2pdICs9IHRvdGFsRGlmZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdXBkYXRlIHNjckJhciBoZWlnaHRzL3dpZHRoc1xuICAgICAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0U2Nyb2xsQ2hpbGQgPSB0aGlzLnNjcm9sbENvbXBvbmVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLml0ZW0oMCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgY29uc3QgdG90YWxXaWR0aCA9IHBhcnNlSW50KGZpcnN0U2Nyb2xsQ2hpbGQuc3R5bGUud2lkdGgsIDEwKSArIHRvdGFsRGlmZjtcbiAgICAgICAgICAgICAgICBmaXJzdFNjcm9sbENoaWxkLnN0eWxlLndpZHRoID0gYCR7dG90YWxXaWR0aH1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VyID0gKGFjYywgdmFsKSA9PiBhY2MgKyB2YWw7XG4gICAgICAgICAgICBpZiAodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjclRvQm90dG9tID0gdGhpcy5faXNTY3JvbGxlZFRvQm90dG9tICYmICF0aGlzLmRjLmluc3RhbmNlLm5vdFZpcnR1YWw7XG4gICAgICAgICAgICAgICAgY29uc3QgaFN1bSA9IHRoaXMuaGVpZ2h0Q2FjaGUucmVkdWNlKHJlZHVjZXIpO1xuICAgICAgICAgICAgICAgIGlmIChoU3VtID4gdGhpcy5fbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpcnRIZWlnaHRSYXRpbyA9IGhTdW0gLyB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNpemUgPSBNYXRoLm1pbih0aGlzLnNjcm9sbENvbXBvbmVudC5zaXplICsgdG90YWxEaWZmLCB0aGlzLl9tYXhIZWlnaHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZpcnRIZWlnaHQgPSBoU3VtO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zY3JvbGxDb21wb25lbnQuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50LmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzY3JUb0JvdHRvbSAmJiAhdGhpcy5faXNBdEJvdHRvbUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclNpemUgPSBwYXJzZUludCh0aGlzLmlneEZvckNvbnRhaW5lclNpemUsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF4VmlydFNjcm9sbFRvcCA9IHRoaXMuX3ZpcnRIZWlnaHQgLSBjb250YWluZXJTaXplO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iU2Nyb2xsSW50ZXJuYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aXJ0U2Nyb2xsVG9wID0gbWF4VmlydFNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IG1heFZpcnRTY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FkanVzdFRvSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gY2FzZSBzY3JvbGxlZCB0byBzcGVjaWZpYyBpbmRleCB3aGVyZSBhZnRlciBzY3JvbGwgaGVpZ2h0cyBhcmUgY2hhbmdlZFxuICAgICAgICAgICAgICAgICAgICAvLyBuZWVkIHRvIGFkanVzdCB0aGUgb2Zmc2V0cyBzbyB0aGF0IGl0ZW0gaXMgbGFzdCBpbiB2aWV3LlxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVzVG9JbmRleCA9IHRoaXMuX2FkanVzdFRvSW5kZXggLSB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdW1EaWZmcyA9IGRpZmZzLnNsaWNlKDAsIHVwZGF0ZXNUb0luZGV4KS5yZWR1Y2UocmVkdWNlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdW1EaWZmcyAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTY3JvbGxUb3Aoc3VtRGlmZnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkanVzdFRvSW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBSZXNldCBzY3JvbGwgcG9zaXRpb24uXG4gICAgICogTmVlZGVkIGluIGNhc2Ugc2Nyb2xsYmFyIGlzIGhpZGRlbi9kZXRhY2hlZCBidXQgd2Ugc3RpbGwgbmVlZCB0byByZXNldCBpdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXRTY3JvbGxQb3NpdGlvbigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IDA7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNjcm9sbEFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnRJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCByZW1vdmVTY3JvbGxFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLnNjcm9sbENvbXBvbmVudD8ubmF0aXZlRWxlbWVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5mdW5jKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQ/Lm5hdGl2ZUVsZW1lbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMudmVydGljYWxTY3JvbGxIYW5kbGVyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHNjcm9sbGluZyB2ZXJ0aWNhbGx5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uU2Nyb2xsKGV2ZW50KSB7XG4gICAgICAgIC8qIGluIGNlcnRhaW4gc2l0dWF0aW9ucyB0aGlzIG1heSBiZSBjYWxsZWQgd2hlbiBubyBzY3JvbGxiYXIgaXMgdmlzaWJsZSAqL1xuICAgICAgICBpZiAoIXBhcnNlSW50KHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0LCAxMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2JTY3JvbGxJbnRlcm5hbCkge1xuICAgICAgICAgICAgdGhpcy5fY2FsY1ZpcnR1YWxTY3JvbGxUb3AoZXZlbnQudGFyZ2V0LnNjcm9sbFRvcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9iU2Nyb2xsSW50ZXJuYWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmV2U3RhcnRJbmRleCA9IHRoaXMuc3RhdGUuc3RhcnRJbmRleDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsT2Zmc2V0ID0gdGhpcy5maXhlZFVwZGF0ZUFsbEVsZW1lbnRzKHRoaXMuX3ZpcnRTY3JvbGxUb3ApO1xuXG4gICAgICAgIHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IC0oc2Nyb2xsT2Zmc2V0KSArICdweCc7XG5cbiAgICAgICAgdGhpcy5fem9uZS5vblN0YWJsZS5waXBlKGZpcnN0KCkpLnN1YnNjcmliZSh0aGlzLnJlY2FsY1VwZGF0ZVNpemVzLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuZGMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICBpZiAocHJldlN0YXJ0SW5kZXggIT09IHRoaXMuc3RhdGUuc3RhcnRJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5jaHVua0xvYWQuZW1pdCh0aGlzLnN0YXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1cGRhdGVTaXplcygpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsYWJsZSA9IHRoaXMuaXNTY3JvbGxhYmxlKCk7XG4gICAgICAgIHRoaXMucmVjYWxjVXBkYXRlU2l6ZXMoKTtcbiAgICAgICAgdGhpcy5fYXBwbHlDaGFuZ2VzKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNjcm9sbE9mZnNldCgpO1xuICAgICAgICBpZiAoc2Nyb2xsYWJsZSAhPT0gdGhpcy5pc1Njcm9sbGFibGUoKSkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJWaXNpYmlsaXR5Q2hhbmdlZC5lbWl0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRTaXplQ2hhbmdlLmVtaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZml4ZWRVcGRhdGVBbGxFbGVtZW50cyhpblNjcm9sbFRvcDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLmlzUmVtb3RlID8gdGhpcy50b3RhbEl0ZW1Db3VudCA6IHRoaXMuaWd4Rm9yT2YubGVuZ3RoO1xuICAgICAgICBsZXQgbmV3U3RhcnQgPSB0aGlzLmdldEluZGV4QXQoaW5TY3JvbGxUb3AsIHRoaXMuc2l6ZXNDYWNoZSk7XG5cbiAgICAgICAgaWYgKG5ld1N0YXJ0ICsgdGhpcy5zdGF0ZS5jaHVua1NpemUgPiBjb3VudCkge1xuICAgICAgICAgICAgbmV3U3RhcnQgPSBjb3VudCAtIHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJldlN0YXJ0ID0gdGhpcy5zdGF0ZS5zdGFydEluZGV4O1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3U3RhcnQgLSB0aGlzLnN0YXRlLnN0YXJ0SW5kZXg7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnRJbmRleCA9IG5ld1N0YXJ0O1xuXG4gICAgICAgIGlmIChkaWZmKSB7XG4gICAgICAgICAgICB0aGlzLmNodW5rUHJlbG9hZC5lbWl0KHRoaXMuc3RhdGUpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzUmVtb3RlKSB7XG5cbiAgICAgICAgICAgICAgICAvLyByZWNhbGN1bGF0ZSBhbmQgYXBwbHkgcGFnZSBzaXplLlxuICAgICAgICAgICAgICAgIGlmIChkaWZmICYmIE1hdGguYWJzKGRpZmYpIDw9IE1BWF9QRVJGX1NDUk9MTF9ESUZGKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQXBwbHlTY3JvbGxOZXh0KHByZXZTdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVBcHBseVNjcm9sbFByZXYocHJldlN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZml4ZWRBcHBseVNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpblNjcm9sbFRvcCAtIHRoaXMuc2l6ZXNDYWNoZVt0aGlzLnN0YXRlLnN0YXJ0SW5kZXhdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBUaGUgZnVuY3Rpb24gYXBwbGllcyBhbiBvcHRpbWl6ZWQgc3RhdGUgY2hhbmdlIGZvciBzY3JvbGxpbmcgZG93bi9yaWdodCBlbXBsb3lpbmcgY29udGV4dCBjaGFuZ2Ugd2l0aCB2aWV3IHJlYXJyYW5nZW1lbnRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbW92ZUFwcGx5U2Nyb2xsTmV4dChwcmV2SW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBzdGFydCA9IHByZXZJbmRleCArIHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIHRoaXMuc3RhdGUuc3RhcnRJbmRleCAtIHByZXZJbmRleDtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5kYy5pbnN0YW5jZS5fdmNyIGFzIFZpZXdDb250YWluZXJSZWY7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kICYmIHRoaXMuaWd4Rm9yT2ZbaV0gIT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBlbWJWaWV3ID0gdGhpcy5fZW1iZWRkZWRWaWV3cy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxGb2N1cyhlbWJWaWV3LnJvb3ROb2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpXG4gICAgICAgICAgICAgICAgfHwgZW1iVmlldy5yb290Tm9kZXNbMF0ubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBjb250YWluZXIuZGV0YWNoKDApO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlQ29udGV4dChlbWJWaWV3LmNvbnRleHQsIGkpO1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydCh2aWV3KTtcbiAgICAgICAgICAgIHRoaXMuX2VtYmVkZGVkVmlld3MucHVzaChlbWJWaWV3KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBUaGUgZnVuY3Rpb24gYXBwbGllcyBhbiBvcHRpbWl6ZWQgc3RhdGUgY2hhbmdlIGZvciBzY3JvbGxpbmcgdXAvbGVmdCBlbXBsb3lpbmcgY29udGV4dCBjaGFuZ2Ugd2l0aCB2aWV3IHJlYXJyYW5nZW1lbnRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbW92ZUFwcGx5U2Nyb2xsUHJldihwcmV2SW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmRjLmluc3RhbmNlLl92Y3IgYXMgVmlld0NvbnRhaW5lclJlZjtcbiAgICAgICAgZm9yIChsZXQgaSA9IHByZXZJbmRleCAtIDE7IGkgPj0gdGhpcy5zdGF0ZS5zdGFydEluZGV4ICYmIHRoaXMuaWd4Rm9yT2ZbaV0gIT09IHVuZGVmaW5lZDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBlbWJWaWV3ID0gdGhpcy5fZW1iZWRkZWRWaWV3cy5wb3AoKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRm9jdXMoZW1iVmlldy5yb290Tm9kZXMuZmluZChub2RlID0+IG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKVxuICAgICAgICAgICAgICAgIHx8IGVtYlZpZXcucm9vdE5vZGVzWzBdLm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gY29udGFpbmVyLmRldGFjaChjb250YWluZXIubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGVtcGxhdGVDb250ZXh0KGVtYlZpZXcuY29udGV4dCwgaSk7XG4gICAgICAgICAgICBjb250YWluZXIuaW5zZXJ0KHZpZXcsIDApO1xuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWRWaWV3cy51bnNoaWZ0KGVtYlZpZXcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRDb250ZXh0SW5kZXgoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZW1vdGUgPyB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggKyB0aGlzLmlneEZvck9mLmluZGV4T2YoaW5wdXQpIDogdGhpcy5pZ3hGb3JPZi5pbmRleE9mKGlucHV0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogRnVuY3Rpb24gd2hpY2ggdXBkYXRlcyB0aGUgcGFzc2VkIGNvbnRleHQgb2YgYW4gZW1iZWRkZWQgdmlldyB3aXRoIHRoZSBwcm92aWRlZCBpbmRleFxuICAgICAqIGZyb20gdGhlIHZpZXcgY29udGFpbmVyLlxuICAgICAqIE9mdGVuLCBjYWxsZWQgd2hpbGUgaGFuZGxpbmcgYSBzY3JvbGwgZXZlbnQuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVRlbXBsYXRlQ29udGV4dChjb250ZXh0OiBhbnksIGluZGV4OiBudW1iZXIgPSAwKTogdm9pZCB7XG4gICAgICAgIGNvbnRleHQuJGltcGxpY2l0ID0gdGhpcy5pZ3hGb3JPZltpbmRleF07XG4gICAgICAgIGNvbnRleHQuaW5kZXggPSB0aGlzLmdldENvbnRleHRJbmRleCh0aGlzLmlneEZvck9mW2luZGV4XSk7XG4gICAgICAgIGNvbnRleHQuY291bnQgPSB0aGlzLmlneEZvck9mLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogVGhlIGZ1bmN0aW9uIGFwcGxpZXMgYW4gb3B0aW1pemVkIHN0YXRlIGNoYW5nZSB0aHJvdWdoIGNvbnRleHQgY2hhbmdlIGZvciBlYWNoIHZpZXdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZml4ZWRBcHBseVNjcm9sbCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICBjb25zdCBlbmRJbmRleCA9IHRoaXMuc3RhdGUuc3RhcnRJbmRleCArIHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGF0ZS5zdGFydEluZGV4OyBpIDwgZW5kSW5kZXggJiYgdGhpcy5pZ3hGb3JPZltpXSAhPT0gdW5kZWZpbmVkOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVtYlZpZXcgPSB0aGlzLl9lbWJlZGRlZFZpZXdzW2orK107XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlQ29udGV4dChlbWJWaWV3LmNvbnRleHQsIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqXG4gICAgICogQ2xlYXJzIGZvY3VzIGluc2lkZSB0aGUgdmlydHVhbGl6ZWQgY29udGFpbmVyIG9uIHNtYWxsIHNjcm9sbCBzd2Fwcy5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Nyb2xsRm9jdXMobm9kZT86IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGZvY3VzIGluIGNhc2UgdGhlIHRoZSBhY3RpdmUgZWxlbWVudCBpcyBpbnNpZGUgdGhlIHZpZXcgY29udGFpbmVyLlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgaGl0IGFuIGV4Y2VwdGlvbiB3aGlsZSBkb2luZyB0aGUgJ3NtYWxsJyBzY3JvbGxzIHN3YXBwaW5nLlxuICAgICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbjpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvcmVtb3ZlQ2hpbGRcbiAgICAgICAgLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDMyMzkyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuY29udGFpbnModGhpcy5kb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiBzY3JvbGxpbmcgaG9yaXpvbnRhbGx5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uSFNjcm9sbChldmVudCkge1xuICAgICAgICAvKiBpbiBjZXJ0YWluIHNpdHVhdGlvbnMgdGhpcyBtYXkgYmUgY2FsbGVkIHdoZW4gbm8gc2Nyb2xsYmFyIGlzIHZpc2libGUgKi9cbiAgICAgICAgY29uc3QgZmlyc3RTY3JvbGxDaGlsZCA9IHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4uaXRlbSgwKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKCFwYXJzZUludChmaXJzdFNjcm9sbENoaWxkLnN0eWxlLndpZHRoLCAxMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmV2U3RhcnRJbmRleCA9IHRoaXMuc3RhdGUuc3RhcnRJbmRleDtcbiAgICAgICAgY29uc3Qgc2NyTGVmdCA9IGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0O1xuICAgICAgICAvLyBVcGRhdGluZyBob3Jpem9udGFsIGNodW5rc1xuICAgICAgICBjb25zdCBzY3JvbGxPZmZzZXQgPSB0aGlzLmZpeGVkVXBkYXRlQWxsRWxlbWVudHMoTWF0aC5hYnMoZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQpKTtcbiAgICAgICAgaWYgKHNjckxlZnQgPCAwKSB7XG4gICAgICAgICAgICAvLyBSVExcbiAgICAgICAgICAgIHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSBzY3JvbGxPZmZzZXQgKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IC1zY3JvbGxPZmZzZXQgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIGlmIChwcmV2U3RhcnRJbmRleCAhPT0gdGhpcy5zdGF0ZS5zdGFydEluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmNodW5rTG9hZC5lbWl0KHRoaXMuc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZnVuY3Rpb24gdXNlZCB0byB0cmFjayBjaGFuZ2VzIGluIHRoZSBpdGVtcyBjb2xsZWN0aW9uLlxuICAgICAqIEJ5IGRlZmF1bHQgdGhlIG9iamVjdCByZWZlcmVuY2VzIGFyZSBjb21wYXJlZC4gSG93ZXZlciB0aGlzIGNhbiBiZSBvcHRpbWl6ZWQgaWYgeW91IGhhdmUgdW5pcXVlIGlkZW50aWZpZXJcbiAgICAgKiB2YWx1ZSB0aGF0IGNhbiBiZSB1c2VkIGZvciB0aGUgY29tcGFyaXNvbiBpbnN0ZWFkIG9mIHRoZSBvYmplY3QgcmVmIG9yIGlmIHlvdSBoYXZlIHNvbWUgb3RoZXIgcHJvcGVydHkgdmFsdWVzXG4gICAgICogaW4gdGhlIGl0ZW0gb2JqZWN0IHRoYXQgc2hvdWxkIGJlIHRyYWNrZWQgZm9yIGNoYW5nZXMuXG4gICAgICogVGhpcyBvcHRpb24gaXMgc2ltaWxhciB0byBuZ0ZvclRyYWNrQnkuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHRyYWNrRnVuYyA9IHRoaXMucGFyZW50VmlydERpci5pZ3hGb3JUcmFja0J5O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBpZ3hGb3JUcmFja0J5KCk6IFRyYWNrQnlGdW5jdGlvbjxUPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFja0J5Rm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgZnVuY3Rpb24gdXNlZCB0byB0cmFjayBjaGFuZ2VzIGluIHRoZSBpdGVtcyBjb2xsZWN0aW9uLlxuICAgICAqIFRoaXMgZnVuY3Rpb24gY2FuIGJlIHNldCBpbiBzY2VuYXJpb3Mgd2hlcmUgeW91IHdhbnQgdG8gb3B0aW1pemUgb3JcbiAgICAgKiBjdXN0b21pemUgdGhlIHRyYWNraW5nIG9mIGNoYW5nZXMgZm9yIHRoZSBpdGVtcyBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBUaGUgaWd4Rm9yVHJhY2tCeSBmdW5jdGlvbiB0YWtlcyB0aGUgaW5kZXggYW5kIHRoZSBjdXJyZW50IGl0ZW0gYXMgYXJndW1lbnRzIGFuZCBuZWVkcyB0byByZXR1cm4gdGhlIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIGl0ZW0uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMucGFyZW50VmlydERpci5pZ3hGb3JUcmFja0J5ID0gKGluZGV4LCBpdGVtKSA9PiB7XG4gICAgICogICAgICByZXR1cm4gaXRlbS5pZCArIGl0ZW0ud2lkdGg7XG4gICAgICogfTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGlneEZvclRyYWNrQnkoZm46IFRyYWNrQnlGdW5jdGlvbjxUPikge1xuICAgICAgICB0aGlzLl90cmFja0J5Rm4gPSBmbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIF9hcHBseUNoYW5nZXMoKSB7XG4gICAgICAgIGNvbnN0IHByZXZDaHVua1NpemUgPSB0aGlzLnN0YXRlLmNodW5rU2l6ZTtcbiAgICAgICAgdGhpcy5hcHBseUNodW5rU2l6ZUNoYW5nZSgpO1xuICAgICAgICB0aGlzLl9yZWNhbGNTY3JvbGxCYXJTaXplKCk7XG4gICAgICAgIGlmICh0aGlzLmlneEZvck9mICYmIHRoaXMuaWd4Rm9yT2YubGVuZ3RoICYmIHRoaXMuZGMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVtYmVkZGVkVmlld0NvcHkgPSBPYmplY3QuYXNzaWduKFtdLCB0aGlzLl9lbWJlZGRlZFZpZXdzKTtcbiAgICAgICAgICAgIGxldCBzdGFydEluZGV4ID0gdGhpcy5zdGF0ZS5zdGFydEluZGV4O1xuICAgICAgICAgICAgbGV0IGVuZEluZGV4ID0gdGhpcy5zdGF0ZS5jaHVua1NpemUgKyB0aGlzLnN0YXRlLnN0YXJ0SW5kZXg7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlbW90ZSkge1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gdGhpcy5pZ3hGb3JPZi5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4ICYmIHRoaXMuaWd4Rm9yT2ZbaV0gIT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1iVmlldyA9IGVtYmVkZGVkVmlld0NvcHkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlQ29udGV4dChlbWJWaWV3LmNvbnRleHQsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXZDaHVua1NpemUgIT09IHRoaXMuc3RhdGUuY2h1bmtTaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaHVua0xvYWQuZW1pdCh0aGlzLnN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2NhbGNNYXhCcm93c2VySGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy5wbGF0Zm9ybVV0aWwuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXYgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCBzdHlsZSA9IGRpdi5zdHlsZTtcbiAgICAgICAgc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBzdHlsZS50b3AgPSAnOTk5OTk5OTk5OTk5OTk5OXB4JztcbiAgICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLmFicyhkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbJ3RvcCddKTtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpdik7XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBSZWNhbGN1bGF0ZXMgdGhlIGNodW5rU2l6ZSBiYXNlZCBvbiBjdXJyZW50IHN0YXJ0SW5kZXggYW5kIHJldHVybnMgdGhlIG5ldyBzaXplLlxuICAgICAqIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggaXMgdXBkYXRlZCwgbm90IGJlZm9yZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2NhbGN1bGF0ZUNodW5rU2l6ZSgpOiBudW1iZXIge1xuICAgICAgICBsZXQgY2h1bmtTaXplID0gMDtcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSAhPT0gbnVsbCAmJiB0aGlzLmlneEZvckNvbnRhaW5lclNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNpemVzQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRTaXplc0NhY2hlKHRoaXMuaWd4Rm9yT2YpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2h1bmtTaXplID0gdGhpcy5fY2FsY01heENodW5rU2l6ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaWd4Rm9yT2YgJiYgY2h1bmtTaXplID4gdGhpcy5pZ3hGb3JPZi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaHVua1NpemUgPSB0aGlzLmlneEZvck9mLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlneEZvck9mKSB7XG4gICAgICAgICAgICAgICAgY2h1bmtTaXplID0gdGhpcy5pZ3hGb3JPZi5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNodW5rU2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEVsZW1lbnQodmlld3JlZiwgbm9kZU5hbWUpIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IHZpZXdyZWYuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUobm9kZU5hbWUpO1xuICAgICAgICByZXR1cm4gZWxlbS5sZW5ndGggPiAwID8gZWxlbVswXSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbml0U2l6ZXNDYWNoZShpdGVtczogYW55W10pOiBudW1iZXIge1xuICAgICAgICBsZXQgdG90YWxTaXplID0gMDtcbiAgICAgICAgbGV0IHNpemUgPSAwO1xuICAgICAgICBjb25zdCBkaW1lbnNpb24gPSB0aGlzLmlneEZvclNpemVQcm9wTmFtZSB8fCAnaGVpZ2h0JztcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB0aGlzLnNpemVzQ2FjaGUgPSBbXTtcbiAgICAgICAgdGhpcy5oZWlnaHRDYWNoZSA9IFtdO1xuICAgICAgICB0aGlzLnNpemVzQ2FjaGUucHVzaCgwKTtcbiAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLmlzUmVtb3RlID8gdGhpcy50b3RhbEl0ZW1Db3VudCA6IGl0ZW1zLmxlbmd0aDtcbiAgICAgICAgZm9yIChpOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgc2l6ZSA9IHRoaXMuX2dldEl0ZW1TaXplKGl0ZW1zW2ldLCBkaW1lbnNpb24pO1xuICAgICAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodENhY2hlLnB1c2goc2l6ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b3RhbFNpemUgKz0gc2l6ZTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZXNDYWNoZS5wdXNoKHRvdGFsU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdGFsU2l6ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVNpemVDYWNoZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgdGhpcy5pbml0U2l6ZXNDYWNoZSh0aGlzLmlneEZvck9mKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRIZWlnaHQgPSB0aGlzLmhlaWdodENhY2hlLmxlbmd0aCA+IDAgPyB0aGlzLmhlaWdodENhY2hlLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkgOiAwO1xuICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSB0aGlzLmluaXRTaXplc0NhY2hlKHRoaXMuaWd4Rm9yT2YpO1xuXG4gICAgICAgIGNvbnN0IGRpZmYgPSBvbGRIZWlnaHQgLSBuZXdIZWlnaHQ7XG4gICAgICAgIHRoaXMuX2FkanVzdFNjcm9sbFBvc2l0aW9uQWZ0ZXJTaXplQ2hhbmdlKGRpZmYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2NhbGNNYXhDaHVua1NpemUoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgICAgbGV0IG1heExlbmd0aCA9IDA7XG4gICAgICAgIGNvbnN0IGFyciA9IFtdO1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlU2l6ZSA9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApO1xuICAgICAgICBpZiAoIWF2YWlsYWJsZVNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyA/XG4gICAgICAgICAgICB0aGlzLmlneEZvclNpemVQcm9wTmFtZSA6ICdoZWlnaHQnO1xuICAgICAgICBjb25zdCByZWR1Y2VyID0gKGFjY3VtdWxhdG9yLCBjdXJyZW50SXRlbSkgPT4gYWNjdW11bGF0b3IgKyB0aGlzLl9nZXRJdGVtU2l6ZShjdXJyZW50SXRlbSwgZGltZW5zaW9uKTtcbiAgICAgICAgZm9yIChpOyBpIDwgdGhpcy5pZ3hGb3JPZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmlneEZvck9mW2ldO1xuICAgICAgICAgICAgaWYgKGRpbWVuc2lvbiA9PT0gJ2hlaWdodCcpIHtcbiAgICAgICAgICAgICAgICBpdGVtID0geyB2YWx1ZTogdGhpcy5pZ3hGb3JPZltpXSwgaGVpZ2h0OiB0aGlzLmhlaWdodENhY2hlW2ldIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzaXplID0gZGltZW5zaW9uID09PSAnaGVpZ2h0JyA/XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRDYWNoZVtpXSA6XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbVNpemUoaXRlbSwgZGltZW5zaW9uKTtcbiAgICAgICAgICAgIHN1bSA9IGFyci5yZWR1Y2UocmVkdWNlciwgc2l6ZSk7XG4gICAgICAgICAgICBpZiAoc3VtIDwgYXZhaWxhYmxlU2l6ZSkge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IGFyci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMuaWd4Rm9yT2YubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZWFjaGVkIGVuZCB3aXRob3V0IGV4Y2VlZGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBpbmNsdWRlIHByZXYgaXRlbXMgdW50aWwgc2l6ZSBpcyBmaWxsZWQgb3IgZmlyc3QgaXRlbSBpcyByZWFjaGVkLlxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VySXRlbSA9IGRpbWVuc2lvbiA9PT0gJ2hlaWdodCcgPyBhcnJbMF0udmFsdWUgOiBhcnJbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcmV2SW5kZXggPSB0aGlzLmlneEZvck9mLmluZGV4T2YoY3VySXRlbSkgLSAxO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAocHJldkluZGV4ID49IDAgJiYgc3VtIDw9IGF2YWlsYWJsZVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckl0ZW0gPSBkaW1lbnNpb24gPT09ICdoZWlnaHQnID8gYXJyWzBdLnZhbHVlIDogYXJyWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkluZGV4ID0gdGhpcy5pZ3hGb3JPZi5pbmRleE9mKGN1ckl0ZW0pIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZJdGVtID0gdGhpcy5pZ3hGb3JPZltwcmV2SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldlNpemUgPSBkaW1lbnNpb24gPT09ICdoZWlnaHQnID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodENhY2hlW3ByZXZJbmRleF0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHByZXZJdGVtW2RpbWVuc2lvbl0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSA9IGFyci5yZWR1Y2UocmVkdWNlciwgcHJldlNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnVuc2hpZnQocHJldkl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aCArIDE7XG4gICAgICAgICAgICAgICAgYXJyLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVuZ3RoID4gbWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXhMZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRJbmRleEF0KGxlZnQsIHNldCkge1xuICAgICAgICBsZXQgc3RhcnQgPSAwO1xuICAgICAgICBsZXQgZW5kID0gc2V0Lmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChsZWZ0ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XG4gICAgICAgICAgICBjb25zdCBtaWRJZHggPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IG1pZExlZnQgPSBzZXRbbWlkSWR4XTtcbiAgICAgICAgICAgIGNvbnN0IGNtcCA9IGxlZnQgLSBtaWRMZWZ0O1xuICAgICAgICAgICAgaWYgKGNtcCA+IDApIHtcbiAgICAgICAgICAgICAgICBzdGFydCA9IG1pZElkeCArIDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNtcCA8IDApIHtcbiAgICAgICAgICAgICAgICBlbmQgPSBtaWRJZHggLSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWlkSWR4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9yZWNhbGNTY3JvbGxCYXJTaXplKCkge1xuICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMuaXNSZW1vdGUgPyB0aGlzLnRvdGFsSXRlbUNvdW50IDogKHRoaXMuaWd4Rm9yT2YgPyB0aGlzLmlneEZvck9mLmxlbmd0aCA6IDApO1xuICAgICAgICB0aGlzLmRjLmluc3RhbmNlLm5vdFZpcnR1YWwgPSAhKHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSAmJiB0aGlzLmRjICYmIHRoaXMuc3RhdGUuY2h1bmtTaXplIDwgY291bnQpO1xuICAgICAgICBjb25zdCBzY3JvbGxhYmxlID0gdGhpcy5pc1Njcm9sbGFibGUoKTtcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgY29uc3QgdG90YWxXaWR0aCA9IHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSA/IHRoaXMuaW5pdFNpemVzQ2FjaGUodGhpcy5pZ3hGb3JPZikgOiAwO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSArICdweCc7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbXBvbmVudC5zaXplID0gdG90YWxXaWR0aDtcbiAgICAgICAgICAgIGlmICh0b3RhbFdpZHRoIDw9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5pZ3hGb3JDb250YWluZXJTaXplLCAxMCkgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb21wb25lbnQuc2l6ZSA9IHRoaXMuX2NhbGNIZWlnaHQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbENvbXBvbmVudC5zaXplIDw9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNjcm9sbGFibGUgIT09IHRoaXMuaXNTY3JvbGxhYmxlKCkpIHtcbiAgICAgICAgICAgIC8vIHNjcm9sbGJhciB2aXNpYmlsaXR5IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGJhclZpc2liaWxpdHlDaGFuZ2VkLmVtaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBfY2FsY0hlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgaGVpZ2h0O1xuICAgICAgICBpZiAodGhpcy5oZWlnaHRDYWNoZSkge1xuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5oZWlnaHRDYWNoZS5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5pbml0U2l6ZXNDYWNoZSh0aGlzLmlneEZvck9mKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92aXJ0SGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBpZiAoaGVpZ2h0ID4gdGhpcy5fbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0SGVpZ2h0UmF0aW8gPSBoZWlnaHQgLyB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgICAgICBoZWlnaHQgPSB0aGlzLl9tYXhIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3JlY2FsY09uQ29udGFpbmVyQ2hhbmdlKCkge1xuICAgICAgICB0aGlzLmRjLmluc3RhbmNlLl92aWV3Q29udGFpbmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICBjb25zdCBwcmV2Q2h1bmtTaXplID0gdGhpcy5zdGF0ZS5jaHVua1NpemU7XG4gICAgICAgIHRoaXMuYXBwbHlDaHVua1NpemVDaGFuZ2UoKTtcbiAgICAgICAgdGhpcy5fcmVjYWxjU2Nyb2xsQmFyU2l6ZSgpO1xuICAgICAgICBpZiAocHJldkNodW5rU2l6ZSAhPT0gdGhpcy5zdGF0ZS5jaHVua1NpemUpIHtcbiAgICAgICAgICAgIHRoaXMuY2h1bmtMb2FkLmVtaXQodGhpcy5zdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2l6ZXNDYWNoZSAmJiB0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIC8vIFVwZGF0aW5nIGhvcml6b250YWwgY2h1bmtzIGFuZCBvZmZzZXRzIGJhc2VkIG9uIHRoZSBuZXcgc2Nyb2xsTGVmdFxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsT2Zmc2V0ID0gdGhpcy5maXhlZFVwZGF0ZUFsbEVsZW1lbnRzKHRoaXMuc2Nyb2xsUG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IC1zY3JvbGxPZmZzZXQgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIFJlbW92ZXMgYW4gZWxlbWVudCBmcm9tIHRoZSBlbWJlZGRlZCB2aWV3cyBhbmQgdXBkYXRlcyBjaHVua1NpemUuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHJlbW92ZUxhc3RFbGVtKCkge1xuICAgICAgICBjb25zdCBvbGRFbGVtID0gdGhpcy5fZW1iZWRkZWRWaWV3cy5wb3AoKTtcbiAgICAgICAgdGhpcy5iZWZvcmVWaWV3RGVzdHJveWVkLmVtaXQob2xkRWxlbSk7XG4gICAgICAgIC8vIGFsc28gZGV0YWNoIGZyb20gVmlld0NvbnRhaW5lclJlZiB0byBtYWtlIGFic29sdXRlbHkgc3VyZSB0aGlzIGlzIHJlbW92ZWQgZnJvbSB0aGUgdmlldyBjb250YWluZXIuXG4gICAgICAgIHRoaXMuZGMuaW5zdGFuY2UuX3Zjci5kZXRhY2godGhpcy5kYy5pbnN0YW5jZS5fdmNyLmxlbmd0aCAtIDEpO1xuICAgICAgICBvbGRFbGVtLmRlc3Ryb3koKTtcblxuICAgICAgICB0aGlzLnN0YXRlLmNodW5rU2l6ZS0tO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBJZiB0aGVyZSBleGlzdHMgYW4gZWxlbWVudCB0aGF0IHdlIGNhbiBjcmVhdGUgZW1iZWRkZWQgdmlldyBmb3IgY3JlYXRlcyBpdCwgYXBwZW5kcyBpdCBhbmQgdXBkYXRlcyBjaHVua1NpemVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkTGFzdEVsZW0oKSB7XG4gICAgICAgIGxldCBlbGVtSW5kZXggPSB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggKyB0aGlzLnN0YXRlLmNodW5rU2l6ZTtcbiAgICAgICAgaWYgKCF0aGlzLmlzUmVtb3RlICYmICF0aGlzLmlneEZvck9mKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbUluZGV4ID49IHRoaXMuaWd4Rm9yT2YubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtSW5kZXggPSB0aGlzLmlneEZvck9mLmxlbmd0aCAtIHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pZ3hGb3JPZltlbGVtSW5kZXhdO1xuICAgICAgICBjb25zdCBlbWJlZGRlZFZpZXcgPSB0aGlzLmRjLmluc3RhbmNlLl92Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUsXG4gICAgICAgICAgICBuZXcgSWd4Rm9yT2ZDb250ZXh0PFQ+KGlucHV0LCB0aGlzLmdldENvbnRleHRJbmRleChpbnB1dCksIHRoaXMuaWd4Rm9yT2YubGVuZ3RoKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuX2VtYmVkZGVkVmlld3MucHVzaChlbWJlZGRlZFZpZXcpO1xuICAgICAgICB0aGlzLnN0YXRlLmNodW5rU2l6ZSsrO1xuXG4gICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWNhbGN1bGF0ZXMgY2h1bmtTaXplIGFuZCBhZGRzL3JlbW92ZXMgZWxlbWVudHMgaWYgbmVlZCBkdWUgdG8gdGhlIGNoYW5nZS5cbiAgICAgKiB0aGlzLnN0YXRlLmNodW5rU2l6ZSBpcyB1cGRhdGVkIGluIEBhZGRMYXN0RWxlbSgpIG9yIEByZW1vdmVMYXN0RWxlbSgpXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFwcGx5Q2h1bmtTaXplQ2hhbmdlKCkge1xuICAgICAgICBjb25zdCBjaHVua1NpemUgPSB0aGlzLmlzUmVtb3RlID8gKHRoaXMuaWd4Rm9yT2YgPyB0aGlzLmlneEZvck9mLmxlbmd0aCA6IDApIDogdGhpcy5fY2FsY3VsYXRlQ2h1bmtTaXplKCk7XG4gICAgICAgIGlmIChjaHVua1NpemUgPiB0aGlzLnN0YXRlLmNodW5rU2l6ZSkge1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IGNodW5rU2l6ZSAtIHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZExhc3RFbGVtKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2h1bmtTaXplIDwgdGhpcy5zdGF0ZS5jaHVua1NpemUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLnN0YXRlLmNodW5rU2l6ZSAtIGNodW5rU2l6ZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMYXN0RWxlbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF91cGRhdGVTY3JvbGxPZmZzZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUhTY3JvbGxPZmZzZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZTY3JvbGxPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBfY2FsY1ZpcnR1YWxTY3JvbGxUb3Aoc2Nyb2xsVG9wOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyU2l6ZSA9IHBhcnNlSW50KHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSwgMTApO1xuICAgICAgICBjb25zdCBtYXhSZWFsU2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxDb21wb25lbnQuc2l6ZSAtIGNvbnRhaW5lclNpemU7XG4gICAgICAgIGNvbnN0IHJlYWxQZXJjZW50U2Nyb2xsZWQgPSBtYXhSZWFsU2Nyb2xsVG9wICE9PSAwID8gc2Nyb2xsVG9wIC8gbWF4UmVhbFNjcm9sbFRvcCA6IDA7XG4gICAgICAgIGNvbnN0IG1heFZpcnRTY3JvbGxUb3AgPSB0aGlzLl92aXJ0SGVpZ2h0IC0gY29udGFpbmVyU2l6ZTtcbiAgICAgICAgdGhpcy5fdmlydFNjcm9sbFRvcCA9IHJlYWxQZXJjZW50U2Nyb2xsZWQgKiBtYXhWaXJ0U2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfZ2V0SXRlbVNpemUoaXRlbSwgZGltZW5zaW9uOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBkaW0gPSBpdGVtID8gaXRlbVtkaW1lbnNpb25dIDogbnVsbDtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkaW0gPT09ICdudW1iZXInID8gZGltIDogcGFyc2VJbnQodGhpcy5pZ3hGb3JJdGVtU2l6ZSwgMTApIHx8IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdXBkYXRlVlNjcm9sbE9mZnNldCgpIHtcbiAgICAgICAgbGV0IHNjcm9sbE9mZnNldCA9IDA7XG4gICAgICAgIGxldCBjdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxQb3NpdGlvbjtcbiAgICAgICAgaWYgKHRoaXMuX3ZpcnRIZWlnaHRSYXRpbyAhPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fY2FsY1ZpcnR1YWxTY3JvbGxUb3AodGhpcy5zY3JvbGxQb3NpdGlvbik7XG4gICAgICAgICAgICBjdXJyZW50U2Nyb2xsVG9wID0gdGhpcy5fdmlydFNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2U2Nyb2xsID0gdGhpcy5zY3JvbGxDb21wb25lbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgc2Nyb2xsT2Zmc2V0ID0gdlNjcm9sbCAmJiB0aGlzLnNjcm9sbENvbXBvbmVudC5zaXplID9cbiAgICAgICAgICAgIGN1cnJlbnRTY3JvbGxUb3AgLSB0aGlzLnNpemVzQ2FjaGVbdGhpcy5zdGF0ZS5zdGFydEluZGV4XSA6IDA7XG4gICAgICAgIHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IC0oc2Nyb2xsT2Zmc2V0KSArICdweCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdXBkYXRlSFNjcm9sbE9mZnNldCgpIHtcbiAgICAgICAgbGV0IHNjcm9sbE9mZnNldCA9IDA7XG4gICAgICAgIHNjcm9sbE9mZnNldCA9IHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNpemUgP1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiAtIHRoaXMuc2l6ZXNDYWNoZVt0aGlzLnN0YXRlLnN0YXJ0SW5kZXhdIDogMDtcbiAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IC1zY3JvbGxPZmZzZXQgKyAncHgnO1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIF9hZGp1c3RTY3JvbGxQb3NpdGlvbkFmdGVyU2l6ZUNoYW5nZShzaXplRGlmZikge1xuICAgICAgICAvLyBpZiBkYXRhIGhhcyBiZWVuIGNoYW5nZWQgd2hpbGUgY29udGFpbmVyIGlzIHNjcm9sbGVkXG4gICAgICAgIC8vIHNob3VsZCB1cGRhdGUgc2Nyb2xsIHRvcC9sZWZ0IGFjY29yZGluZyB0byBjaGFuZ2Ugc28gdGhhdCBzYW1lIHN0YXJ0SW5kZXggaXMgaW4gdmlld1xuICAgICAgICBpZiAoTWF0aC5hYnMoc2l6ZURpZmYpID4gMCAmJiB0aGlzLnNjcm9sbFBvc2l0aW9uID4gMCkge1xuICAgICAgICAgICAgdGhpcy5yZWNhbGNVcGRhdGVTaXplcygpO1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnID9cbiAgICAgICAgICAgICBwYXJzZUludCh0aGlzLmRjLmluc3RhbmNlLl92aWV3Q29udGFpbmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0LCAxMCkgOlxuICAgICAgICAgICAgIHBhcnNlSW50KHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCwgMTApO1xuICAgICAgICAgICAgY29uc3QgbmV3U2l6ZSA9IHRoaXMuc2l6ZXNDYWNoZVt0aGlzLnN0YXRlLnN0YXJ0SW5kZXhdIC0gb2Zmc2V0O1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxQb3NpdGlvbiA9IG5ld1NpemU7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxQb3NpdGlvbiAhPT0gbmV3U2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29tcG9uZW50LnNjcm9sbEFtb3VudCA9IG5ld1NpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1hcmdpbihub2RlLCBkaW1lbnNpb246IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgICBpZiAoZGltZW5zaW9uID09PSAnaGVpZ2h0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc3R5bGVzWydtYXJnaW5Ub3AnXSkgK1xuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoc3R5bGVzWydtYXJnaW5Cb3R0b20nXSkgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZXNbJ21hcmdpbkxlZnQnXSkgK1xuICAgICAgICAgICAgcGFyc2VGbG9hdChzdHlsZXNbJ21hcmdpblJpZ2h0J10pIHx8IDA7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0VHlwZU5hbWVGb3JEZWJ1Z2dpbmcgPSAodHlwZTogYW55KTogc3RyaW5nID0+IHR5cGUubmFtZSB8fCB0eXBlb2YgdHlwZTtcblxuZXhwb3J0IGludGVyZmFjZSBJRm9yT2ZTdGF0ZSBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICBzdGFydEluZGV4PzogbnVtYmVyO1xuICAgIGNodW5rU2l6ZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRm9yT2ZEYXRhQ2hhbmdpbmdFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncyB7XG4gICAgY29udGFpbmVyU2l6ZTogbnVtYmVyO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tpZ3hHcmlkRm9yXVtpZ3hHcmlkRm9yT2ZdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmU8VD4gZXh0ZW5kcyBJZ3hGb3JPZkRpcmVjdGl2ZTxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBEb0NoZWNrIHtcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgaWd4R3JpZEZvck9mKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuaWd4Rm9yT2YgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZ3hHcmlkRm9yT2ZVbmlxdWVTaXplQ2FjaGUgPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlneEdyaWRGb3JPZlZhcmlhYmxlU2l6ZXMgPSB0cnVlO1xuXG4gICAgcHVibGljIGdldCBpZ3hHcmlkRm9yT2YoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlneEZvck9mO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNpemVzQ2FjaGUoKTogbnVtYmVyW10ge1xuICAgICAgICBpZiAodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pZ3hHcmlkRm9yT2ZVbmlxdWVTaXplQ2FjaGUgfHwgdGhpcy5zeW5jU2VydmljZS5pc01hc3Rlcih0aGlzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaXplc0NhY2hlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3luY1NlcnZpY2Uuc2l6ZXNDYWNoZSh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaXplc0NhY2hlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHNpemVzQ2FjaGUodmFsdWU6IG51bWJlcltdKSB7XG4gICAgICAgIHRoaXMuX3NpemVzQ2FjaGUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGl0ZW1zRGltZW5zaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZ3hGb3JTaXplUHJvcE5hbWUgfHwgJ2hlaWdodCc7XG4gICAgfVxuXG4gICAgcHVibGljIHJlY2FsY1VwZGF0ZVNpemVzKCkge1xuICAgICAgICBpZiAodGhpcy5pZ3hHcmlkRm9yT2ZWYXJpYWJsZVNpemVzKSB7XG4gICAgICAgICAgICBzdXBlci5yZWNhbGNVcGRhdGVTaXplcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgYWZ0ZXIgZGF0YSBoYXMgYmVlbiBjaGFuZ2VkIGJ1dCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVmcmVzaGVkXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGRhdGFDaGFuZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUZvck9mRGF0YUNoYW5naW5nRXZlbnRBcmdzPigpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIF92aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICBfdGVtcGxhdGU6IFRlbXBsYXRlUmVmPE5nRm9yT2ZDb250ZXh0PFQ+PixcbiAgICAgICAgX2RpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgX3pvbmU6IE5nWm9uZSxcbiAgICAgICAgX3BsYXRmb3JtVXRpbDogUGxhdGZvcm1VdGlsLFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgcHJvdGVjdGVkIHN5bmNTY3JvbGxTZXJ2aWNlOiBJZ3hGb3JPZlNjcm9sbFN5bmNTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgc3luY1NlcnZpY2U6IElneEZvck9mU3luY1NlcnZpY2UpIHtcbiAgICAgICAgc3VwZXIoX3ZpZXdDb250YWluZXIsIF90ZW1wbGF0ZSwgX2RpZmZlcnMsIGNkciwgX3pvbmUsIHN5bmNTY3JvbGxTZXJ2aWNlLCBfcGxhdGZvcm1VdGlsLCBfZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5zeW5jU2VydmljZS5zZXRNYXN0ZXIodGhpcyk7XG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgICAgIHRoaXMucmVtb3ZlU2Nyb2xsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBjb25zdCBmb3JPZiA9ICdpZ3hHcmlkRm9yT2YnO1xuICAgICAgICB0aGlzLnN5bmNTZXJ2aWNlLnNldE1hc3Rlcih0aGlzKTtcbiAgICAgICAgaWYgKGZvck9mIGluIGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY2hhbmdlc1tmb3JPZl0uY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kaWZmZXIgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodmFsdWUpLmNyZWF0ZSh0aGlzLmlneEZvclRyYWNrQnkpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYENhbm5vdCBmaW5kIGEgZGlmZmVyIHN1cHBvcnRpbmcgb2JqZWN0IFwiJHt2YWx1ZX1cIiBvZiB0eXBlIFwiJHtnZXRUeXBlTmFtZUZvckRlYnVnZ2luZyh2YWx1ZSl9XCIuXG4gICAgICAgICAgICAgICAgICAgICBOZ0ZvciBvbmx5IHN1cHBvcnRzIGJpbmRpbmcgdG8gSXRlcmFibGVzIHN1Y2ggYXMgQXJyYXlzLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgICAgICAvLyBpbiBjYXNlIGNvbGxlY3Rpb24gaGFzIGNoYW5nZXMsIHJlc2V0IHN5bmMgc2VydmljZVxuICAgICAgICAgICAgICAgIHRoaXMuc3luY1NlcnZpY2Uuc2V0TWFzdGVyKHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlZmF1bHRJdGVtU2l6ZSA9ICdpZ3hGb3JJdGVtU2l6ZSc7XG4gICAgICAgIGlmIChkZWZhdWx0SXRlbVNpemUgaW4gY2hhbmdlcyAmJiAhY2hhbmdlc1tkZWZhdWx0SXRlbVNpemVdLmZpcnN0Q2hhbmdlICYmXG4gICAgICAgICAgICB0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAndmVydGljYWwnICYmIHRoaXMuaWd4Rm9yT2YpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBkZWZhdWx0IGl0ZW0gc2l6ZSBjaGFuZ2VkLlxuICAgICAgICAgICAgdGhpcy5pbml0U2l6ZXNDYWNoZSh0aGlzLmlneEZvck9mKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250YWluZXJTaXplID0gJ2lneEZvckNvbnRhaW5lclNpemUnO1xuICAgICAgICBpZiAoY29udGFpbmVyU2l6ZSBpbiBjaGFuZ2VzICYmICFjaGFuZ2VzW2NvbnRhaW5lclNpemVdLmZpcnN0Q2hhbmdlICYmIHRoaXMuaWd4Rm9yT2YpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlY2FsY09uQ29udGFpbmVyQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGFzc3VtZU1hc3RlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc2l6ZXNDYWNoZSA9IHRoaXMuc3luY1NlcnZpY2Uuc2l6ZXNDYWNoZSh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uKTtcbiAgICAgICAgdGhpcy5zeW5jU2VydmljZS5zZXRNYXN0ZXIodGhpcywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nRG9DaGVjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RpZmZlcikge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuX2RpZmZlci5kaWZmKHRoaXMuaWd4Rm9yT2YpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcmdzOiBJRm9yT2ZEYXRhQ2hhbmdpbmdFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclNpemU6IHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2hhbmdpbmcuZW1pdChhcmdzKTtcbiAgICAgICAgICAgICAgICAvLyAgcmUtaW5pdCBjYWNoZS5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaWd4Rm9yT2YpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pZ3hGb3JPZiA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiB3ZSBuZWVkIHRvIHJlc2V0IHRoZSBtYXN0ZXIgZGlyIGlmIGFsbCByb3dzIGFyZSByZW1vdmVkXG4gICAgICAgICAgICAgICAgKGUuZy4gYmVjYXVzZSBvZiBmaWx0ZXJpbmcpOyBpZiBhbGwgY29sdW1ucyBhcmUgaGlkZGVuLCByb3dzIGFyZVxuICAgICAgICAgICAgICAgIHN0aWxsIHJlbmRlcmVkIGVtcHR5LCBzbyB3ZSBzaG91bGQgbm90IHJlc2V0IG1hc3RlciAqL1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pZ3hGb3JPZi5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNTZXJ2aWNlLnJlc2V0TWFzdGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3luY1NlcnZpY2Uuc2V0TWFzdGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuaWd4Rm9yQ29udGFpbmVyU2l6ZSA9IGFyZ3MuY29udGFpbmVyU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplRGlmZiA9IHRoaXMuX3VwZGF0ZVNpemVDYWNoZShjaGFuZ2VzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUNoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2l6ZURpZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRqdXN0U2Nyb2xsUG9zaXRpb25BZnRlclNpemVDaGFuZ2Uoc2l6ZURpZmYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFDaGFuZ2VkLmVtaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvblNjcm9sbChldmVudCkge1xuICAgICAgICBpZiAoIXBhcnNlSW50KHRoaXMuc2Nyb2xsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0LCAxMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2JTY3JvbGxJbnRlcm5hbCkge1xuICAgICAgICAgICAgdGhpcy5fY2FsY1ZpcnR1YWxTY3JvbGxUb3AoZXZlbnQudGFyZ2V0LnNjcm9sbFRvcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9iU2Nyb2xsSW50ZXJuYWwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzY3JvbGxPZmZzZXQgPSB0aGlzLmZpeGVkVXBkYXRlQWxsRWxlbWVudHModGhpcy5fdmlydFNjcm9sbFRvcCk7XG5cbiAgICAgICAgdGhpcy5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gLShzY3JvbGxPZmZzZXQpICsgJ3B4JztcblxuICAgICAgICB0aGlzLl96b25lLm9uU3RhYmxlLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKHRoaXMucmVjYWxjVXBkYXRlU2l6ZXMuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkhTY3JvbGwoc2Nyb2xsQW1vdW50KSB7XG4gICAgICAgIC8qIGluIGNlcnRhaW4gc2l0dWF0aW9ucyB0aGlzIG1heSBiZSBjYWxsZWQgd2hlbiBubyBzY3JvbGxiYXIgaXMgdmlzaWJsZSAqL1xuICAgICAgICBjb25zdCBmaXJzdFNjcm9sbENoaWxkID0gdGhpcy5zY3JvbGxDb21wb25lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5pdGVtKDApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsQ29tcG9uZW50IHx8ICFwYXJzZUludChmaXJzdFNjcm9sbENoaWxkLnN0eWxlLndpZHRoLCAxMCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGluZyBob3Jpem9udGFsIGNodW5rc1xuICAgICAgICBjb25zdCBzY3JvbGxPZmZzZXQgPSB0aGlzLmZpeGVkVXBkYXRlQWxsRWxlbWVudHMoTWF0aC5hYnMoc2Nyb2xsQW1vdW50KSk7XG4gICAgICAgIGlmIChzY3JvbGxBbW91bnQgPCAwKSB7XG4gICAgICAgICAgICAvLyBSVExcbiAgICAgICAgICAgIHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSBzY3JvbGxPZmZzZXQgKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTFRSXG4gICAgICAgICAgICB0aGlzLmRjLmluc3RhbmNlLl92aWV3Q29udGFpbmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gLXNjcm9sbE9mZnNldCArICdweCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0SXRlbVNpemUoaXRlbSkge1xuICAgICAgICBsZXQgc2l6ZSA9IDA7XG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IHRoaXMuaWd4Rm9yU2l6ZVByb3BOYW1lICB8fCAnaGVpZ2h0JztcbiAgICAgICAgaWYgKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIHNpemUgPSAgdGhpcy5fZ2V0SXRlbVNpemUoaXRlbSwgZGltZW5zaW9uKTtcbiAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uc3VtbWFyaWVzKSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IGl0ZW0ubWF4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtICYmIGl0ZW0uZ3JvdXBzICYmIGl0ZW0uaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IGl0ZW0uaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2l6ZSA9IHBhcnNlSW50KGl0ZW1bZGltZW5zaW9uXSwgMTApIHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRTaXplc0NhY2hlKGl0ZW1zOiBhbnlbXSk6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy5zeW5jU2VydmljZS5pc01hc3Rlcih0aGlzKSAmJiB0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1hc3RlclNpemVzQ2FjaGUgPSB0aGlzLnN5bmNTZXJ2aWNlLnNpemVzQ2FjaGUodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gbWFzdGVyU2l6ZXNDYWNoZVttYXN0ZXJTaXplc0NhY2hlLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0b3RhbFNpemUgPSAwO1xuICAgICAgICBsZXQgc2l6ZSA9IDA7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgdGhpcy5zaXplc0NhY2hlID0gW107XG4gICAgICAgIHRoaXMuaGVpZ2h0Q2FjaGUgPSBbXTtcbiAgICAgICAgdGhpcy5zaXplc0NhY2hlLnB1c2goMCk7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5pc1JlbW90ZSA/IHRoaXMudG90YWxJdGVtQ291bnQgOiBpdGVtcy5sZW5ndGg7XG4gICAgICAgIGZvciAoaTsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHNpemUgPSB0aGlzLmdldEl0ZW1TaXplKGl0ZW1zW2ldKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlneEZvclNjcm9sbE9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRDYWNoZS5wdXNoKHNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG90YWxTaXplICs9IHNpemU7XG4gICAgICAgICAgICB0aGlzLnNpemVzQ2FjaGUucHVzaCh0b3RhbFNpemUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3RhbFNpemU7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF91cGRhdGVTaXplQ2FjaGUoY2hhbmdlczogSXRlcmFibGVDaGFuZ2VzPFQ+ID0gbnVsbCkge1xuICAgICAgICBpZiAodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRTaXplID0gdGhpcy5zaXplc0NhY2hlW3RoaXMuc2l6ZXNDYWNoZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NpemUgPSB0aGlzLmluaXRTaXplc0NhY2hlKHRoaXMuaWd4Rm9yT2YpO1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IG9sZFNpemUgLSBuZXdTaXplO1xuICAgICAgICAgICAgcmV0dXJuIGRpZmY7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvbGRIZWlnaHQgPSB0aGlzLmhlaWdodENhY2hlLmxlbmd0aCA+IDAgPyB0aGlzLmhlaWdodENhY2hlLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCkgOiAwO1xuICAgICAgICBsZXQgbmV3SGVpZ2h0ID0gb2xkSGVpZ2h0O1xuICAgICAgICBpZiAoY2hhbmdlcyAmJiAhdGhpcy5pc1JlbW90ZSkge1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gdGhpcy5oYW5kbGVDYWNoZUNoYW5nZXMoY2hhbmdlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaWZmID0gb2xkSGVpZ2h0IC0gbmV3SGVpZ2h0O1xuXG4gICAgICAgIC8vIGlmIGRhdGEgaGFzIGJlZW4gY2hhbmdlZCB3aGlsZSBjb250YWluZXIgaXMgc2Nyb2xsZWRcbiAgICAgICAgLy8gc2hvdWxkIHVwZGF0ZSBzY3JvbGwgdG9wL2xlZnQgYWNjb3JkaW5nIHRvIGNoYW5nZSBzbyB0aGF0IHNhbWUgc3RhcnRJbmRleCBpcyBpbiB2aWV3XG4gICAgICAgIGlmIChNYXRoLmFicyhkaWZmKSA+IDAgJiYgdGhpcy5wbGF0Zm9ybVV0aWwuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBUaGlzIGNvZGUgY2FuIGJlIHJlbW92ZWQuIEhvd2V2ZXIgdGVzdHMgbmVlZCB0byBiZSByZXdyaXR0ZW4gaW4gYSB3YXkgdGhhdCB0aGV5IHdhaXQgZm9yIFJlc2l6ZU9ic2VydmVkIHRvIGNvbXBsZXRlLlxuICAgICAgICAgICAgLy8gU28gbGVhdmluZyBhcyBpcyBmb3IgdGhlIG1vbWVudC5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNhbGNVcGRhdGVTaXplcygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlSW50KHRoaXMuZGMuaW5zdGFuY2UuX3ZpZXdDb250YWluZXIuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCwgMTApO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbFBvc2l0aW9uICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsUG9zaXRpb24gPSB0aGlzLnNpemVzQ2FjaGVbdGhpcy5zdGF0ZS5zdGFydEluZGV4XSAtIG9mZnNldDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaGFuZGxlQ2FjaGVDaGFuZ2VzKGNoYW5nZXM6IEl0ZXJhYmxlQ2hhbmdlczxUPikge1xuICAgICAgICBjb25zdCBpZGVudGl0eUNoYW5nZXMgPSBbXTtcbiAgICAgICAgY29uc3QgbmV3SGVpZ2h0Q2FjaGUgPSBbXTtcbiAgICAgICAgY29uc3QgbmV3U2l6ZXNDYWNoZSA9IFtdO1xuICAgICAgICBuZXdTaXplc0NhY2hlLnB1c2goMCk7XG4gICAgICAgIGxldCBuZXdIZWlnaHQgPSAwO1xuXG4gICAgICAgIC8vIFdoZW4gdGhlcmUgYXJlIG1vcmUgdGhhbiBvbmUgcmVtb3ZlZCBpdGVtcyB0aGUgY2hhbmdlcyBhcmUgbm90IHJlbGlhYmxlIHNvIHRob3NlIHdpdGggaWRlbnRpdHkgY2hhbmdlIHNob3VsZCBiZSBkZWZhdWx0IHNpemUuXG4gICAgICAgIGxldCBudW1SZW1vdmVkSXRlbXMgPSAwO1xuICAgICAgICBjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgoKSA9PiBudW1SZW1vdmVkSXRlbXMrKyk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBpZGVudGl0eSBjaGFuZ2VzIHRvIGRldGVybWluZSBsYXRlciBpZiB0aG9zZSB0aGF0IGhhdmUgY2hhbmdlZCB0aGVpciBpbmRleGVzIHNob3VsZCBiZSBhc3NpZ25lZCBkZWZhdWx0IGl0ZW0gc2l6ZS5cbiAgICAgICAgY2hhbmdlcy5mb3JFYWNoSWRlbnRpdHlDaGFuZ2UoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmN1cnJlbnRJbmRleCAhPT0gaXRlbS5wcmV2aW91c0luZGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBvbmVzIHRoYXQgaGF2ZSBub3QgY2hhbmdlZCB0aGVpciBpbmRleC5cbiAgICAgICAgICAgICAgICBpZGVudGl0eUNoYW5nZXNbaXRlbS5jdXJyZW50SW5kZXhdID0gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUHJvY2Vzc2luZyBlYWNoIGl0ZW0gdGhhdCBpcyBwYXNzZWQgdG8gdGhlIGlneEZvck9mIHNvIGZhciBzZWVtIHRvIGJlIG1vc3QgcmVsaWFibGUuIFdlIHBhcnNlIHRoZSB1cGRhdGVkIGxpc3Qgb2YgaXRlbXMuXG4gICAgICAgIGNoYW5nZXMuZm9yRWFjaEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnByZXZpb3VzSW5kZXggIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAobnVtUmVtb3ZlZEl0ZW1zIDwgMiB8fCAhaWRlbnRpdHlDaGFuZ2VzLmxlbmd0aCB8fCBpZGVudGl0eUNoYW5nZXNbaXRlbS5jdXJyZW50SW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIC8vIFJldXNlIGNhY2hlIG9uIHRob3NlIHdobyBoYXZlIHByZXZpb3VzSW5kZXguXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIG9uZSByZW1vdmVkIGl0ZW1zIGN1cnJlbnRseSB0aGUgY2hhbmdlcyBhcmUgbm90IHJlYWRhYmxlIHNvIG9uZXMgd2l0aCBpZGVudGl0eSBjaGFuZ2VcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgcmFjYWxjdWxhdGVkLlxuICAgICAgICAgICAgICAgIG5ld0hlaWdodENhY2hlW2l0ZW0uY3VycmVudEluZGV4XSA9IHRoaXMuaGVpZ2h0Q2FjaGVbaXRlbS5wcmV2aW91c0luZGV4XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQXNzaWduIGRlZmF1bHQgaXRlbSBzaXplLlxuICAgICAgICAgICAgICAgIG5ld0hlaWdodENhY2hlW2l0ZW0uY3VycmVudEluZGV4XSA9IHRoaXMuZ2V0SXRlbVNpemUoaXRlbS5pdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1NpemVzQ2FjaGVbaXRlbS5jdXJyZW50SW5kZXggKyAxXSA9IG5ld1NpemVzQ2FjaGVbaXRlbS5jdXJyZW50SW5kZXhdICsgbmV3SGVpZ2h0Q2FjaGVbaXRlbS5jdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgbmV3SGVpZ2h0ICs9IG5ld0hlaWdodENhY2hlW2l0ZW0uY3VycmVudEluZGV4XTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaGVpZ2h0Q2FjaGUgPSBuZXdIZWlnaHRDYWNoZTtcbiAgICAgICAgdGhpcy5zaXplc0NhY2hlID0gbmV3U2l6ZXNDYWNoZTtcbiAgICAgICAgcmV0dXJuIG5ld0hlaWdodDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkTGFzdEVsZW0oKSB7XG4gICAgICAgIGxldCBlbGVtSW5kZXggPSB0aGlzLnN0YXRlLnN0YXJ0SW5kZXggKyB0aGlzLnN0YXRlLmNodW5rU2l6ZTtcbiAgICAgICAgaWYgKCF0aGlzLmlzUmVtb3RlICYmICF0aGlzLmlneEZvck9mKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbUluZGV4ID49IHRoaXMuaWd4Rm9yT2YubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtSW5kZXggPSB0aGlzLmlneEZvck9mLmxlbmd0aCAtIHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pZ3hGb3JPZltlbGVtSW5kZXhdO1xuICAgICAgICBjb25zdCBlbWJlZGRlZFZpZXcgPSB0aGlzLmRjLmluc3RhbmNlLl92Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUsXG4gICAgICAgICAgICBuZXcgSWd4Rm9yT2ZDb250ZXh0PFQ+KGlucHV0LCB0aGlzLmdldENvbnRleHRJbmRleChpbnB1dCksIHRoaXMuaWd4Rm9yT2YubGVuZ3RoKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuX2VtYmVkZGVkVmlld3MucHVzaChlbWJlZGRlZFZpZXcpO1xuICAgICAgICB0aGlzLnN0YXRlLmNodW5rU2l6ZSsrO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfdXBkYXRlVmlld3MocHJldkNodW5rU2l6ZSkge1xuICAgICAgICBpZiAodGhpcy5pZ3hGb3JPZiAmJiB0aGlzLmlneEZvck9mLmxlbmd0aCAmJiB0aGlzLmRjKSB7XG4gICAgICAgICAgICBjb25zdCBlbWJlZGRlZFZpZXdDb3B5ID0gT2JqZWN0LmFzc2lnbihbXSwgdGhpcy5fZW1iZWRkZWRWaWV3cyk7XG4gICAgICAgICAgICBsZXQgc3RhcnRJbmRleDtcbiAgICAgICAgICAgIGxldCBlbmRJbmRleDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUmVtb3RlKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggPSB0aGlzLmlneEZvck9mLmxlbmd0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IHRoaXMuZ2V0SW5kZXhBdCh0aGlzLnNjcm9sbFBvc2l0aW9uLCB0aGlzLnNpemVzQ2FjaGUpO1xuICAgICAgICAgICAgICAgIGlmIChzdGFydEluZGV4ICsgdGhpcy5zdGF0ZS5jaHVua1NpemUgPiB0aGlzLmlneEZvck9mLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gdGhpcy5pZ3hGb3JPZi5sZW5ndGggLSB0aGlzLnN0YXRlLmNodW5rU2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydEluZGV4ID0gc3RhcnRJbmRleDtcbiAgICAgICAgICAgICAgICBlbmRJbmRleCA9IHRoaXMuc3RhdGUuY2h1bmtTaXplICsgdGhpcy5zdGF0ZS5zdGFydEluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4ICYmIHRoaXMuaWd4Rm9yT2ZbaV0gIT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1iVmlldyA9IGVtYmVkZGVkVmlld0NvcHkuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlQ29udGV4dChlbWJWaWV3LmNvbnRleHQsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXZDaHVua1NpemUgIT09IHRoaXMuc3RhdGUuY2h1bmtTaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaHVua0xvYWQuZW1pdCh0aGlzLnN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcm90ZWN0ZWQgX2FwcGx5Q2hhbmdlcygpIHtcbiAgICAgICAgY29uc3QgcHJldkNodW5rU2l6ZSA9IHRoaXMuc3RhdGUuY2h1bmtTaXplO1xuICAgICAgICB0aGlzLmFwcGx5Q2h1bmtTaXplQ2hhbmdlKCk7XG4gICAgICAgIHRoaXMuX3JlY2FsY1Njcm9sbEJhclNpemUoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmlld3MocHJldkNodW5rU2l6ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBfY2FsY01heENodW5rU2l6ZSgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5pZ3hGb3JTY3JvbGxPcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zeW5jU2VydmljZS5pc01hc3Rlcih0aGlzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5fY2FsY01heENodW5rU2l6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3luY1NlcnZpY2UuY2h1bmtTaXplKHRoaXMuaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9jYWxjTWF4Q2h1bmtTaXplKCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneEZvck9mRGlyZWN0aXZlLFxuICAgICAgICBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmUsXG4gICAgICAgIERpc3BsYXlDb250YWluZXJDb21wb25lbnQsXG4gICAgICAgIFZpcnR1YWxIZWxwZXJDb21wb25lbnQsXG4gICAgICAgIEhWaXJ0dWFsSGVscGVyQ29tcG9uZW50LFxuICAgICAgICBWaXJ0dWFsSGVscGVyQmFzZURpcmVjdGl2ZVxuICAgIF0sXG4gICAgZXhwb3J0czogW0lneEZvck9mRGlyZWN0aXZlLCBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmVdLFxuICAgIGltcG9ydHM6IFtJZ3hTY3JvbGxJbmVydGlhTW9kdWxlLCBDb21tb25Nb2R1bGVdXG59KVxuXG5leHBvcnQgY2xhc3MgSWd4Rm9yT2ZNb2R1bGUge1xufVxuIl19