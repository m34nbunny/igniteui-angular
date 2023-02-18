import { Directive, EventEmitter, HostBinding, HostListener, Input, NgModule, Output, ContentChildren } from '@angular/core';
import { animationFrameScheduler, fromEvent, interval, Subject } from 'rxjs';
import { takeUntil, throttle } from 'rxjs/operators';
import { IgxDefaultDropStrategy } from './drag-drop.strategy';
import * as i0 from "@angular/core";
import * as i1 from "../../core/utils";
export var DragDirection;
(function (DragDirection) {
    DragDirection[DragDirection["VERTICAL"] = 0] = "VERTICAL";
    DragDirection[DragDirection["HORIZONTAL"] = 1] = "HORIZONTAL";
    DragDirection[DragDirection["BOTH"] = 2] = "BOTH";
})(DragDirection || (DragDirection = {}));
export class IgxDragLocation {
    constructor(_pageX, _pageY) {
        this._pageX = _pageX;
        this._pageY = _pageY;
        this.pageX = parseFloat(_pageX);
        this.pageY = parseFloat(_pageY);
    }
}
export class IgxDragHandleDirective {
    constructor(element) {
        this.element = element;
        this.baseClass = true;
    }
}
IgxDragHandleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragHandleDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxDragHandleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDragHandleDirective, selector: "[igxDragHandle]", host: { properties: { "class.igx-drag__handle": "this.baseClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragHandleDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxDragHandle]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { baseClass: [{
                type: HostBinding,
                args: ['class.igx-drag__handle']
            }] } });
export class IgxDragIgnoreDirective {
    constructor(element) {
        this.element = element;
        this.baseClass = true;
    }
}
IgxDragIgnoreDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragIgnoreDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxDragIgnoreDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDragIgnoreDirective, selector: "[igxDragIgnore]", host: { properties: { "class.igx-drag__ignore": "this.baseClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragIgnoreDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxDragIgnore]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { baseClass: [{
                type: HostBinding,
                args: ['class.igx-drag__ignore']
            }] } });
export class IgxDragDirective {
    constructor(cdr, element, viewContainer, zone, renderer, platformUtil) {
        this.cdr = cdr;
        this.element = element;
        this.viewContainer = viewContainer;
        this.zone = zone;
        this.renderer = renderer;
        this.platformUtil = platformUtil;
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
        this.dragTolerance = 5;
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
        this.dragDirection = DragDirection.BOTH;
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
        this.ghost = true;
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
        this.ghostClass = '';
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
        this.dragStart = new EventEmitter();
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
        this.dragMove = new EventEmitter();
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
        this.dragEnd = new EventEmitter();
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
        this.dragClick = new EventEmitter();
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
        this.ghostCreate = new EventEmitter();
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
        this.ghostDestroy = new EventEmitter();
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
        this.transitioned = new EventEmitter();
        /**
         * @hidden
         */
        this.baseClass = true;
        /**
         * @hidden
         */
        this.selectDisabled = false;
        /**
         * @hidden
         */
        this.defaultReturnDuration = '0.5s';
        /**
         * @hidden
         */
        this.animInProgress = false;
        this.ghostContext = null;
        this._startX = 0;
        this._startY = 0;
        this._lastX = 0;
        this._lastY = 0;
        this._dragStarted = false;
        this._ghostHostX = 0;
        this._ghostHostY = 0;
        this._pointerDownId = null;
        this._clicked = false;
        this._lastDropArea = null;
        this._destroy = new Subject();
        this._removeOnDestroy = true;
    }
    /**
     * - Save data inside the `igxDrag` directive. This can be set when instancing `igxDrag` on an element.
     * ```html
     * <div [igxDrag]="{ source: myElement }"></div>
     * ```
     *
     * @memberof IgxDragDirective
     */
    set data(value) {
        this._data = value;
    }
    get data() {
        return this._data;
    }
    /**
     * Gets the current location of the element relative to the page.
     */
    get location() {
        return new IgxDragLocation(this.pageX, this.pageY);
    }
    /**
     * Gets the original location of the element before dragging started.
     */
    get originLocation() {
        return new IgxDragLocation(this.baseOriginLeft, this.baseOriginTop);
    }
    /**
     * @hidden
     */
    get pointerEventsEnabled() {
        return typeof PointerEvent !== 'undefined';
    }
    /**
     * @hidden
     */
    get touchEventsEnabled() {
        return 'ontouchstart' in window;
    }
    /**
     * @hidden
     */
    get pageX() {
        if (this.ghost && this.ghostElement) {
            return this.ghostLeft;
        }
        return this.baseLeft;
    }
    /**
     * @hidden
     */
    get pageY() {
        if (this.ghost && this.ghostElement) {
            return this.ghostTop;
        }
        return this.baseTop;
    }
    get baseLeft() {
        return this.element.nativeElement.getBoundingClientRect().left;
    }
    get baseTop() {
        return this.element.nativeElement.getBoundingClientRect().top;
    }
    get baseOriginLeft() {
        return this.baseLeft - this.getTransformX(this.element.nativeElement);
    }
    get baseOriginTop() {
        return this.baseTop - this.getTransformY(this.element.nativeElement);
    }
    set ghostLeft(pageX) {
        if (this.ghostElement) {
            // We need to take into account marginLeft, since top style does not include margin, but pageX includes the margin.
            const ghostMarginLeft = parseInt(document.defaultView.getComputedStyle(this.ghostElement)['margin-left'], 10);
            // If ghost host is defined it needs to be taken into account.
            this.ghostElement.style.left = (pageX - ghostMarginLeft - this._ghostHostX) + 'px';
        }
    }
    get ghostLeft() {
        return parseInt(this.ghostElement.style.left, 10) + this._ghostHostX;
    }
    set ghostTop(pageY) {
        if (this.ghostElement) {
            // We need to take into account marginTop, since top style does not include margin, but pageY includes the margin.
            const ghostMarginTop = parseInt(document.defaultView.getComputedStyle(this.ghostElement)['margin-top'], 10);
            // If ghost host is defined it needs to be taken into account.
            this.ghostElement.style.top = (pageY - ghostMarginTop - this._ghostHostY) + 'px';
        }
    }
    get ghostTop() {
        return parseInt(this.ghostElement.style.top, 10) + this._ghostHostY;
    }
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
    set ghostOffsetX(value) {
        this._offsetX = parseInt(value, 10);
    }
    get ghostOffsetX() {
        return this._offsetX !== undefined ? this._offsetX : this._defaultOffsetX;
    }
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
    set ghostOffsetY(value) {
        this._offsetY = parseInt(value, 10);
    }
    get ghostOffsetY() {
        return this._offsetY !== undefined ? this._offsetY : this._defaultOffsetY;
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        if (!this.dragHandles || !this.dragHandles.length) {
            // Set user select none to the whole draggable element if no drag handles are defined.
            this.selectDisabled = true;
        }
        // Bind events
        this.zone.runOutsideAngular(() => {
            if (!this.platformUtil.isBrowser) {
                return;
            }
            const targetElements = this.dragHandles && this.dragHandles.length ?
                this.dragHandles.map((item) => item.element.nativeElement) : [this.element.nativeElement];
            targetElements.forEach((element) => {
                if (this.pointerEventsEnabled) {
                    fromEvent(element, 'pointerdown').pipe(takeUntil(this._destroy))
                        .subscribe((res) => this.onPointerDown(res));
                    fromEvent(element, 'pointermove').pipe(throttle(() => interval(0, animationFrameScheduler)), takeUntil(this._destroy)).subscribe((res) => this.onPointerMove(res));
                    fromEvent(element, 'pointerup').pipe(takeUntil(this._destroy))
                        .subscribe((res) => this.onPointerUp(res));
                    if (!this.ghost) {
                        // Do not bind `lostpointercapture` to the target, because we will bind it on the ghost later.
                        fromEvent(element, 'lostpointercapture').pipe(takeUntil(this._destroy))
                            .subscribe((res) => this.onPointerLost(res));
                    }
                }
                else if (this.touchEventsEnabled) {
                    fromEvent(element, 'touchstart').pipe(takeUntil(this._destroy))
                        .subscribe((res) => this.onPointerDown(res));
                }
                else {
                    // We don't have pointer events and touch events. Use then mouse events.
                    fromEvent(element, 'mousedown').pipe(takeUntil(this._destroy))
                        .subscribe((res) => this.onPointerDown(res));
                }
            });
            // We should bind to document events only once when there are no pointer events.
            if (!this.pointerEventsEnabled && this.touchEventsEnabled) {
                fromEvent(document.defaultView, 'touchmove').pipe(throttle(() => interval(0, animationFrameScheduler)), takeUntil(this._destroy)).subscribe((res) => this.onPointerMove(res));
                fromEvent(document.defaultView, 'touchend').pipe(takeUntil(this._destroy))
                    .subscribe((res) => this.onPointerUp(res));
            }
            else if (!this.pointerEventsEnabled) {
                fromEvent(document.defaultView, 'mousemove').pipe(throttle(() => interval(0, animationFrameScheduler)), takeUntil(this._destroy)).subscribe((res) => this.onPointerMove(res));
                fromEvent(document.defaultView, 'mouseup').pipe(takeUntil(this._destroy))
                    .subscribe((res) => this.onPointerUp(res));
            }
            this.element.nativeElement.addEventListener('transitionend', (args) => {
                this.onTransitionEnd(args);
            });
        });
        // Set transition duration to 0s. This also helps with setting `visibility: hidden` to the base to not lag.
        this.element.nativeElement.style.transitionDuration = '0.0s';
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this._destroy.next(true);
        this._destroy.complete();
        if (this.ghost && this.ghostElement && this._removeOnDestroy) {
            this.ghostElement.parentNode.removeChild(this.ghostElement);
            this.ghostElement = null;
            if (this._dynamicGhostRef) {
                this._dynamicGhostRef.destroy();
                this._dynamicGhostRef = null;
            }
        }
    }
    /**
     * Sets desired location of the base element or ghost element if rended relative to the document.
     *
     * @param newLocation New location that should be applied. It is advised to get new location using getBoundingClientRects() + scroll.
     */
    setLocation(newLocation) {
        // We do not subtract marginLeft and marginTop here because here we calculate deltas.
        if (this.ghost && this.ghostElement) {
            const offsetHostX = this.ghostHost ? this.ghostHostOffsetLeft(this.ghostHost) : 0;
            const offsetHostY = this.ghostHost ? this.ghostHostOffsetTop(this.ghostHost) : 0;
            this.ghostLeft = newLocation.pageX - offsetHostX + this.getWindowScrollLeft();
            this.ghostTop = newLocation.pageY - offsetHostY + this.getWindowScrollTop();
        }
        else if (!this.ghost) {
            const deltaX = newLocation.pageX - this.pageX;
            const deltaY = newLocation.pageY - this.pageY;
            const transformX = this.getTransformX(this.element.nativeElement);
            const transformY = this.getTransformY(this.element.nativeElement);
            this.setTransformXY(transformX + deltaX, transformY + deltaY);
        }
        this._startX = this.baseLeft;
        this._startY = this.baseTop;
    }
    /**
     * Animates the base or ghost element depending on the `ghost` input to its initial location.
     * If `ghost` is true but there is not ghost rendered, it will be created and animated.
     * If the base element has changed its DOM position its initial location will be changed accordingly.
     *
     * @param customAnimArgs Custom transition properties that will be applied when performing the transition.
     * @param startLocation Start location from where the transition should start.
     */
    transitionToOrigin(customAnimArgs, startLocation) {
        if ((!!startLocation && startLocation.pageX === this.baseOriginLeft && startLocation.pageY === this.baseOriginLeft) ||
            (!startLocation && this.ghost && !this.ghostElement)) {
            return;
        }
        if (!!startLocation && startLocation.pageX !== this.pageX && startLocation.pageY !== this.pageY) {
            if (this.ghost && !this.ghostElement) {
                this._startX = startLocation.pageX;
                this._startY = startLocation.pageY;
                this._ghostStartX = this._startX;
                this._ghostStartY = this._startY;
                this.createGhost(this._startX, this._startY);
            }
            this.setLocation(startLocation);
        }
        this.animInProgress = true;
        // Use setTimeout because we need to be sure that the element is positioned first correctly if there is start location.
        setTimeout(() => {
            if (this.ghost) {
                this.ghostElement.style.transitionProperty = 'top, left';
                this.ghostElement.style.transitionDuration =
                    customAnimArgs && customAnimArgs.duration ? customAnimArgs.duration + 's' : this.defaultReturnDuration;
                this.ghostElement.style.transitionTimingFunction =
                    customAnimArgs && customAnimArgs.timingFunction ? customAnimArgs.timingFunction : '';
                this.ghostElement.style.transitionDelay = customAnimArgs && customAnimArgs.delay ? customAnimArgs.delay + 's' : '';
                this.setLocation(new IgxDragLocation(this.baseLeft, this.baseTop));
            }
            else if (!this.ghost) {
                this.element.nativeElement.style.transitionProperty = 'transform';
                this.element.nativeElement.style.transitionDuration =
                    customAnimArgs && customAnimArgs.duration ? customAnimArgs.duration + 's' : this.defaultReturnDuration;
                this.element.nativeElement.style.transitionTimingFunction =
                    customAnimArgs && customAnimArgs.timingFunction ? customAnimArgs.timingFunction : '';
                this.element.nativeElement.style.transitionDelay = customAnimArgs && customAnimArgs.delay ? customAnimArgs.delay + 's' : '';
                this._startX = this.baseLeft;
                this._startY = this.baseTop;
                this.setTransformXY(0, 0);
            }
        }, 0);
    }
    /**
     * Animates the base or ghost element to a specific target location or other element using transition.
     * If `ghost` is true but there is not ghost rendered, it will be created and animated.
     * It is recommended to use 'getBoundingClientRects() + pageScroll' when determining desired location.
     *
     * @param target Target that the base or ghost will transition to. It can be either location in the page or another HTML element.
     * @param customAnimArgs Custom transition properties that will be applied when performing the transition.
     * @param startLocation Start location from where the transition should start.
     */
    transitionTo(target, customAnimArgs, startLocation) {
        if (!!startLocation && this.ghost && !this.ghostElement) {
            this._startX = startLocation.pageX;
            this._startY = startLocation.pageY;
            this._ghostStartX = this._startX;
            this._ghostStartY = this._startY;
        }
        else if (!!startLocation && (!this.ghost || this.ghostElement)) {
            this.setLocation(startLocation);
        }
        else if (this.ghost && !this.ghostElement) {
            this._startX = this.baseLeft;
            this._startY = this.baseTop;
            this._ghostStartX = this._startX + this.getWindowScrollLeft();
            this._ghostStartY = this._startY + this.getWindowScrollTop();
        }
        if (this.ghost && !this.ghostElement) {
            this.createGhost(this._startX, this._startY);
        }
        this.animInProgress = true;
        // Use setTimeout because we need to be sure that the element is positioned first correctly if there is start location.
        setTimeout(() => {
            const movedElem = this.ghost ? this.ghostElement : this.element.nativeElement;
            movedElem.style.transitionProperty = this.ghost && this.ghostElement ? 'left, top' : 'transform';
            movedElem.style.transitionDuration =
                customAnimArgs && customAnimArgs.duration ? customAnimArgs.duration + 's' : this.defaultReturnDuration;
            movedElem.style.transitionTimingFunction =
                customAnimArgs && customAnimArgs.timingFunction ? customAnimArgs.timingFunction : '';
            movedElem.style.transitionDelay = customAnimArgs && customAnimArgs.delay ? customAnimArgs.delay + 's' : '';
            if (target instanceof IgxDragLocation) {
                this.setLocation(new IgxDragLocation(target.pageX, target.pageY));
            }
            else {
                const targetRects = target.nativeElement.getBoundingClientRect();
                this.setLocation(new IgxDragLocation(targetRects.left - this.getWindowScrollLeft(), targetRects.top - this.getWindowScrollTop()));
            }
        }, 0);
    }
    /**
     * @hidden
     * Method bound to the PointerDown event of the base element igxDrag is initialized.
     * @param event PointerDown event captured
     */
    onPointerDown(event) {
        const ignoredElement = this.dragIgnoredElems.find(elem => elem.element.nativeElement === event.target);
        if (ignoredElement) {
            return;
        }
        this._clicked = true;
        this._pointerDownId = event.pointerId;
        // Set pointer capture so we detect pointermove even if mouse is out of bounds until ghostElement is created.
        const handleFound = this.dragHandles.find(handle => handle.element.nativeElement === event.currentTarget);
        const targetElement = handleFound ? handleFound.element.nativeElement : this.element.nativeElement;
        if (this.pointerEventsEnabled) {
            targetElement.setPointerCapture(this._pointerDownId);
        }
        else {
            targetElement.focus();
            event.preventDefault();
        }
        if (this.pointerEventsEnabled || !this.touchEventsEnabled) {
            // Check first for pointer events or non touch, because we can have pointer events and touch events at once.
            this._startX = event.pageX;
            this._startY = event.pageY;
        }
        else if (this.touchEventsEnabled) {
            this._startX = event.touches[0].pageX;
            this._startY = event.touches[0].pageY;
        }
        this._defaultOffsetX = this.baseLeft - this._startX + this.getWindowScrollLeft();
        this._defaultOffsetY = this.baseTop - this._startY + this.getWindowScrollTop();
        this._ghostStartX = this._startX + this.ghostOffsetX;
        this._ghostStartY = this._startY + this.ghostOffsetY;
        this._lastX = this._startX;
        this._lastY = this._startY;
    }
    /**
     * @hidden
     * Perform drag move logic when dragging and dispatching events if there is igxDrop under the pointer.
     * This method is bound at first at the base element.
     * If dragging starts and after the ghostElement is rendered the pointerId is reassigned it. Then this method is bound to it.
     * @param event PointerMove event captured
     */
    onPointerMove(event) {
        if (this._clicked) {
            let pageX;
            let pageY;
            if (this.pointerEventsEnabled || !this.touchEventsEnabled) {
                // Check first for pointer events or non touch, because we can have pointer events and touch events at once.
                pageX = event.pageX;
                pageY = event.pageY;
            }
            else if (this.touchEventsEnabled) {
                pageX = event.touches[0].pageX;
                pageY = event.touches[0].pageY;
                // Prevent scrolling on touch while dragging
                event.preventDefault();
            }
            const totalMovedX = pageX - this._startX;
            const totalMovedY = pageY - this._startY;
            if (!this._dragStarted &&
                (Math.abs(totalMovedX) > this.dragTolerance || Math.abs(totalMovedY) > this.dragTolerance)) {
                const dragStartArgs = {
                    originalEvent: event,
                    owner: this,
                    startX: pageX - totalMovedX,
                    startY: pageY - totalMovedY,
                    pageX,
                    pageY,
                    cancel: false
                };
                this.zone.run(() => {
                    this.dragStart.emit(dragStartArgs);
                });
                if (!dragStartArgs.cancel) {
                    this._dragStarted = true;
                    if (this.ghost) {
                        // We moved enough so ghostElement can be rendered and actual dragging to start.
                        // When creating it will take into account any offset set by the user by default.
                        this.createGhost(pageX, pageY);
                    }
                    else if (this._offsetX !== undefined || this._offsetY !== undefined) {
                        // There is no need for ghost, but we will need to position initially the base element to reflect any offset.
                        const transformX = (this._offsetX !== undefined ? this._offsetX - this._defaultOffsetX : 0) +
                            this.getTransformX(this.element.nativeElement);
                        const transformY = (this._offsetY !== undefined ? this._offsetY - this._defaultOffsetY : 0) +
                            this.getTransformY(this.element.nativeElement);
                        this.setTransformXY(transformX, transformY);
                    }
                }
                else {
                    return;
                }
            }
            else if (!this._dragStarted) {
                return;
            }
            const moveArgs = {
                originalEvent: event,
                owner: this,
                startX: this._startX,
                startY: this._startY,
                pageX: this._lastX,
                pageY: this._lastY,
                nextPageX: pageX,
                nextPageY: pageY,
                cancel: false
            };
            this.dragMove.emit(moveArgs);
            const setPageX = moveArgs.nextPageX;
            const setPageY = moveArgs.nextPageY;
            if (!moveArgs.cancel) {
                if (this.ghost) {
                    const updatedTotalMovedX = this.dragDirection === DragDirection.VERTICAL ? 0 : setPageX - this._startX;
                    const updatedTotalMovedY = this.dragDirection === DragDirection.HORIZONTAL ? 0 : setPageY - this._startY;
                    this.ghostLeft = this._ghostStartX + updatedTotalMovedX;
                    this.ghostTop = this._ghostStartY + updatedTotalMovedY;
                }
                else {
                    const lastMovedX = this.dragDirection === DragDirection.VERTICAL ? 0 : setPageX - this._lastX;
                    const lastMovedY = this.dragDirection === DragDirection.HORIZONTAL ? 0 : setPageY - this._lastY;
                    const translateX = this.getTransformX(this.element.nativeElement) + lastMovedX;
                    const translateY = this.getTransformY(this.element.nativeElement) + lastMovedY;
                    this.setTransformXY(translateX, translateY);
                }
                this.dispatchDragEvents(pageX, pageY, event);
            }
            this._lastX = setPageX;
            this._lastY = setPageY;
        }
    }
    /**
     * @hidden
     * Perform drag end logic when releasing the ghostElement and dispatching drop event if igxDrop is under the pointer.
     * This method is bound at first at the base element.
     * If dragging starts and after the ghostElement is rendered the pointerId is reassigned to it. Then this method is bound to it.
     * @param event PointerUp event captured
     */
    onPointerUp(event) {
        if (!this._clicked) {
            return;
        }
        let pageX;
        let pageY;
        if (this.pointerEventsEnabled || !this.touchEventsEnabled) {
            // Check first for pointer events or non touch, because we can have pointer events and touch events at once.
            pageX = event.pageX;
            pageY = event.pageY;
        }
        else if (this.touchEventsEnabled) {
            pageX = event.touches[0].pageX;
            pageY = event.touches[0].pageY;
            // Prevent scrolling on touch while dragging
            event.preventDefault();
        }
        const eventArgs = {
            originalEvent: event,
            owner: this,
            startX: this._startX,
            startY: this._startY,
            pageX,
            pageY
        };
        this._pointerDownId = null;
        this._clicked = false;
        if (this._dragStarted) {
            if (this._lastDropArea && this._lastDropArea !== this.element.nativeElement) {
                this.dispatchDropEvent(event.pageX, event.pageY, event);
            }
            this.zone.run(() => {
                this.dragEnd.emit(eventArgs);
            });
            if (!this.animInProgress) {
                this.onTransitionEnd(null);
            }
        }
        else {
            // Trigger our own click event because when there is no ghost, native click cannot be prevented when dragging.
            this.zone.run(() => {
                this.dragClick.emit(eventArgs);
            });
        }
    }
    /**
     * @hidden
     * Execute this method whe the pointer capture has been lost.
     * This means that during dragging the user has performed other action like right clicking and then clicking somewhere else.
     * This method will ensure that the drag state is being reset in this case as if the user released the dragged element.
     * @param event Event captured
     */
    onPointerLost(event) {
        if (!this._clicked) {
            return;
        }
        const eventArgs = {
            originalEvent: event,
            owner: this,
            startX: this._startX,
            startY: this._startY,
            pageX: event.pageX,
            pageY: event.pageY
        };
        this._pointerDownId = null;
        this._clicked = false;
        if (this._dragStarted) {
            this.zone.run(() => {
                this.dragEnd.emit(eventArgs);
            });
            if (!this.animInProgress) {
                this.onTransitionEnd(null);
            }
        }
    }
    /**
     * @hidden
     */
    onTransitionEnd(event) {
        if ((!this._dragStarted && !this.animInProgress) || this._clicked) {
            // Return if no dragging started and there is no animation in progress.
            return;
        }
        if (this.ghost && this.ghostElement) {
            this._ghostStartX = this.baseLeft + this.getWindowScrollLeft();
            this._ghostStartY = this.baseTop + this.getWindowScrollTop();
            const ghostDestroyArgs = {
                owner: this,
                ghostElement: this.ghostElement,
                cancel: false
            };
            this.ghostDestroy.emit(ghostDestroyArgs);
            if (ghostDestroyArgs.cancel) {
                return;
            }
            this.ghostElement.parentNode.removeChild(this.ghostElement);
            this.ghostElement = null;
            if (this._dynamicGhostRef) {
                this._dynamicGhostRef.destroy();
                this._dynamicGhostRef = null;
            }
        }
        else if (!this.ghost) {
            this.element.nativeElement.style.transitionProperty = '';
            this.element.nativeElement.style.transitionDuration = '0.0s';
            this.element.nativeElement.style.transitionTimingFunction = '';
            this.element.nativeElement.style.transitionDelay = '';
        }
        this.animInProgress = false;
        this._dragStarted = false;
        // Execute transitioned after everything is reset so if the user sets new location on the base now it would work as expected.
        this.zone.run(() => {
            this.transitioned.emit({
                originalEvent: event,
                owner: this,
                startX: this._startX,
                startY: this._startY,
                pageX: this._startX,
                pageY: this._startY
            });
        });
    }
    /**
     * @hidden
     * Create ghost element - if a Node object is provided it creates a clone of that node,
     * otherwise it clones the host element.
     * Bind all needed events.
     * @param pageX Latest pointer position on the X axis relative to the page.
     * @param pageY Latest pointer position on the Y axis relative to the page.
     * @param node The Node object to be cloned.
     */
    createGhost(pageX, pageY, node = null) {
        if (!this.ghost) {
            return;
        }
        if (this.ghostTemplate) {
            this._dynamicGhostRef = this.viewContainer.createEmbeddedView(this.ghostTemplate, this.ghostContext);
            this.ghostElement = this._dynamicGhostRef.rootNodes[0];
        }
        else {
            this.ghostElement = node ? node.cloneNode(true) : this.element.nativeElement.cloneNode(true);
        }
        const totalMovedX = pageX - this._startX;
        const totalMovedY = pageY - this._startY;
        this._ghostHostX = this.ghostHost ? this.ghostHostOffsetLeft(this.ghostHost) : 0;
        this._ghostHostY = this.ghostHost ? this.ghostHostOffsetTop(this.ghostHost) : 0;
        this.ghostElement.style.transitionDuration = '0.0s';
        this.ghostElement.style.position = 'absolute';
        if (this.ghostClass) {
            this.renderer.addClass(this.ghostElement, this.ghostClass);
        }
        const createEventArgs = {
            owner: this,
            ghostElement: this.ghostElement,
            cancel: false
        };
        this.ghostCreate.emit(createEventArgs);
        if (createEventArgs.cancel) {
            this.ghostElement = null;
            if (this.ghostTemplate && this._dynamicGhostRef) {
                this._dynamicGhostRef.destroy();
            }
            return;
        }
        if (this.ghostHost) {
            this.ghostHost.appendChild(this.ghostElement);
        }
        else {
            document.body.appendChild(this.ghostElement);
        }
        const ghostMarginLeft = parseInt(document.defaultView.getComputedStyle(this.ghostElement)['margin-left'], 10);
        const ghostMarginTop = parseInt(document.defaultView.getComputedStyle(this.ghostElement)['margin-top'], 10);
        this.ghostElement.style.left = (this._ghostStartX - ghostMarginLeft + totalMovedX - this._ghostHostX) + 'px';
        this.ghostElement.style.top = (this._ghostStartY - ghostMarginTop + totalMovedY - this._ghostHostX) + 'px';
        if (this.pointerEventsEnabled) {
            // The ghostElement takes control for moving and dragging after it has been rendered.
            if (this._pointerDownId !== null) {
                this.ghostElement.setPointerCapture(this._pointerDownId);
            }
            this.ghostElement.addEventListener('pointermove', (args) => {
                this.onPointerMove(args);
            });
            this.ghostElement.addEventListener('pointerup', (args) => {
                this.onPointerUp(args);
            });
            this.ghostElement.addEventListener('lostpointercapture', (args) => {
                this.onPointerLost(args);
            });
        }
        // Transition animation when the ghostElement is released and it returns to it's original position.
        this.ghostElement.addEventListener('transitionend', (args) => {
            this.onTransitionEnd(args);
        });
        this.cdr.detectChanges();
    }
    /**
     * @hidden
     * Dispatch custom igxDragEnter/igxDragLeave events based on current pointer position and if drop area is under.
     */
    dispatchDragEvents(pageX, pageY, originalEvent) {
        let topDropArea;
        const customEventArgs = {
            startX: this._startX,
            startY: this._startY,
            pageX,
            pageY,
            owner: this,
            originalEvent
        };
        let elementsFromPoint = this.getElementsAtPoint(pageX, pageY);
        // Check for shadowRoot instance and use it if present
        for (const elFromPoint of elementsFromPoint) {
            if (!!elFromPoint?.shadowRoot) {
                elementsFromPoint = elFromPoint.shadowRoot.elementsFromPoint(pageX, pageY);
            }
        }
        for (const element of elementsFromPoint) {
            if (element.getAttribute('droppable') === 'true' &&
                element !== this.ghostElement && element !== this.element.nativeElement) {
                topDropArea = element;
                break;
            }
        }
        if (topDropArea &&
            (!this._lastDropArea || (this._lastDropArea && this._lastDropArea !== topDropArea))) {
            if (this._lastDropArea) {
                this.dispatchEvent(this._lastDropArea, 'igxDragLeave', customEventArgs);
            }
            this._lastDropArea = topDropArea;
            this.dispatchEvent(this._lastDropArea, 'igxDragEnter', customEventArgs);
        }
        else if (!topDropArea && this._lastDropArea) {
            this.dispatchEvent(this._lastDropArea, 'igxDragLeave', customEventArgs);
            this._lastDropArea = null;
            return;
        }
        if (topDropArea) {
            this.dispatchEvent(topDropArea, 'igxDragOver', customEventArgs);
        }
    }
    /**
     * @hidden
     * Dispatch custom igxDrop event based on current pointer position if there is last recorder drop area under the pointer.
     * Last recorder drop area is updated in @dispatchDragEvents method.
     */
    dispatchDropEvent(pageX, pageY, originalEvent) {
        const eventArgs = {
            startX: this._startX,
            startY: this._startY,
            pageX,
            pageY,
            owner: this,
            originalEvent
        };
        this.dispatchEvent(this._lastDropArea, 'igxDrop', eventArgs);
        this.dispatchEvent(this._lastDropArea, 'igxDragLeave', eventArgs);
        this._lastDropArea = null;
    }
    /**
     * @hidden
     */
    getElementsAtPoint(pageX, pageY) {
        // correct the coordinates with the current scroll position, because
        // document.elementsFromPoint consider position within the current viewport
        // window.pageXOffset == window.scrollX; // always true
        // using window.pageXOffset for IE9 compatibility
        const viewPortX = pageX - window.pageXOffset;
        const viewPortY = pageY - window.pageYOffset;
        if (document['msElementsFromPoint']) {
            // Edge and IE special snowflakes
            const elements = document['msElementsFromPoint'](viewPortX, viewPortY);
            return elements === null ? [] : elements;
        }
        else {
            // Other browsers like Chrome, Firefox, Opera
            return document.elementsFromPoint(viewPortX, viewPortY);
        }
    }
    /**
     * @hidden
     */
    dispatchEvent(target, eventName, eventArgs) {
        // This way is IE11 compatible.
        const dragLeaveEvent = document.createEvent('CustomEvent');
        dragLeaveEvent.initCustomEvent(eventName, false, false, eventArgs);
        target.dispatchEvent(dragLeaveEvent);
        // Otherwise can be used `target.dispatchEvent(new CustomEvent(eventName, eventArgs));`
    }
    getTransformX(elem) {
        let posX = 0;
        if (elem.style.transform) {
            const matrix = elem.style.transform;
            const values = matrix ? matrix.match(/-?[\d\.]+/g) : undefined;
            posX = values ? Number(values[1]) : 0;
        }
        return posX;
    }
    getTransformY(elem) {
        let posY = 0;
        if (elem.style.transform) {
            const matrix = elem.style.transform;
            const values = matrix ? matrix.match(/-?[\d\.]+/g) : undefined;
            posY = values ? Number(values[2]) : 0;
        }
        return posY;
    }
    /** Method setting transformation to the base draggable element. */
    setTransformXY(x, y) {
        this.element.nativeElement.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
    }
    getWindowScrollTop() {
        return window.scrollY ? window.scrollY : (window.pageYOffset ? window.pageYOffset : 0);
    }
    getWindowScrollLeft() {
        return window.scrollX ? window.scrollX : (window.pageXOffset ? window.pageXOffset : 0);
    }
    ghostHostOffsetLeft(ghostHost) {
        const ghostPosition = document.defaultView.getComputedStyle(ghostHost).getPropertyValue('position');
        if (ghostPosition === 'static' && ghostHost.offsetParent && ghostHost.offsetParent === document.body) {
            return 0;
        }
        else if (ghostPosition === 'static' && ghostHost.offsetParent) {
            return ghostHost.offsetParent.getBoundingClientRect().left - this.getWindowScrollLeft();
        }
        return ghostHost.getBoundingClientRect().left - this.getWindowScrollLeft();
    }
    ghostHostOffsetTop(ghostHost) {
        const ghostPosition = document.defaultView.getComputedStyle(ghostHost).getPropertyValue('position');
        if (ghostPosition === 'static' && ghostHost.offsetParent && ghostHost.offsetParent === document.body) {
            return 0;
        }
        else if (ghostPosition === 'static' && ghostHost.offsetParent) {
            return ghostHost.offsetParent.getBoundingClientRect().top - this.getWindowScrollTop();
        }
        return ghostHost.getBoundingClientRect().top - this.getWindowScrollTop();
    }
}
IgxDragDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i1.PlatformUtil }], target: i0.ɵɵFactoryTarget.Directive });
IgxDragDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDragDirective, selector: "[igxDrag]", inputs: { data: ["igxDrag", "data"], dragTolerance: "dragTolerance", dragDirection: "dragDirection", dragChannel: "dragChannel", ghost: "ghost", ghostClass: "ghostClass", ghostTemplate: "ghostTemplate", ghostHost: "ghostHost", ghostOffsetX: "ghostOffsetX", ghostOffsetY: "ghostOffsetY" }, outputs: { dragStart: "dragStart", dragMove: "dragMove", dragEnd: "dragEnd", dragClick: "dragClick", ghostCreate: "ghostCreate", ghostDestroy: "ghostDestroy", transitioned: "transitioned" }, host: { properties: { "class.igx-drag": "this.baseClass", "class.igx-drag--select-disabled": "this.selectDisabled" } }, queries: [{ propertyName: "dragHandles", predicate: IgxDragHandleDirective, descendants: true }, { propertyName: "dragIgnoredElems", predicate: IgxDragIgnoreDirective, descendants: true }], exportAs: ["drag"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'drag',
                    selector: '[igxDrag]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i1.PlatformUtil }]; }, propDecorators: { data: [{
                type: Input,
                args: ['igxDrag']
            }], dragTolerance: [{
                type: Input
            }], dragDirection: [{
                type: Input
            }], dragChannel: [{
                type: Input
            }], ghost: [{
                type: Input
            }], ghostClass: [{
                type: Input
            }], ghostTemplate: [{
                type: Input
            }], ghostHost: [{
                type: Input
            }], dragStart: [{
                type: Output
            }], dragMove: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], dragClick: [{
                type: Output
            }], ghostCreate: [{
                type: Output
            }], ghostDestroy: [{
                type: Output
            }], transitioned: [{
                type: Output
            }], dragHandles: [{
                type: ContentChildren,
                args: [IgxDragHandleDirective, { descendants: true }]
            }], dragIgnoredElems: [{
                type: ContentChildren,
                args: [IgxDragIgnoreDirective, { descendants: true }]
            }], baseClass: [{
                type: HostBinding,
                args: ['class.igx-drag']
            }], selectDisabled: [{
                type: HostBinding,
                args: ['class.igx-drag--select-disabled']
            }], ghostOffsetX: [{
                type: Input
            }], ghostOffsetY: [{
                type: Input
            }] } });
export class IgxDropDirective {
    constructor(element, _renderer, _zone) {
        this.element = element;
        this._renderer = _renderer;
        this._zone = _zone;
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
        this.enter = new EventEmitter();
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
        this.over = new EventEmitter();
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
        this.leave = new EventEmitter();
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
        this.dropped = new EventEmitter();
        /**
         * @hidden
         */
        this.droppable = true;
        /**
         * @hidden
         */
        this.dragover = false;
        /**
         * @hidden
         */
        this._destroy = new Subject();
        this._dropStrategy = new IgxDefaultDropStrategy();
    }
    /**
     * - Save data inside the `igxDrop` directive. This can be set when instancing `igxDrop` on an element.
     * ```html
     * <div [igxDrop]="{ source: myElement }"></div>
     * ```
     *
     * @memberof IgxDropDirective
     */
    set data(v) {
        this._data = v;
    }
    get data() {
        return this._data;
    }
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
    set dropStrategy(classRef) {
        this._dropStrategy = new classRef(this._renderer);
    }
    get dropStrategy() {
        return this._dropStrategy;
    }
    /**
     * @hidden
     */
    onDragDrop(event) {
        if (!this.isDragLinked(event.detail.owner)) {
            return;
        }
        const elementPosX = this.element.nativeElement.getBoundingClientRect().left + this.getWindowScrollLeft();
        const elementPosY = this.element.nativeElement.getBoundingClientRect().top + this.getWindowScrollTop();
        const offsetX = event.detail.pageX - elementPosX;
        const offsetY = event.detail.pageY - elementPosY;
        const args = {
            owner: this,
            originalEvent: event.detail.originalEvent,
            drag: event.detail.owner,
            dragData: event.detail.owner.data,
            startX: event.detail.startX,
            startY: event.detail.startY,
            pageX: event.detail.pageX,
            pageY: event.detail.pageY,
            offsetX,
            offsetY,
            cancel: false
        };
        this._zone.run(() => {
            this.dropped.emit(args);
        });
        if (this._dropStrategy && !args.cancel) {
            const elementsAtPoint = event.detail.owner.getElementsAtPoint(event.detail.pageX, event.detail.pageY);
            const insertIndex = this.getInsertIndexAt(event.detail.owner, elementsAtPoint);
            this._dropStrategy.dropAction(event.detail.owner, this, insertIndex);
        }
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this._zone.runOutsideAngular(() => {
            fromEvent(this.element.nativeElement, 'igxDragEnter').pipe(takeUntil(this._destroy))
                .subscribe((res) => this.onDragEnter(res));
            fromEvent(this.element.nativeElement, 'igxDragLeave').pipe(takeUntil(this._destroy)).subscribe((res) => this.onDragLeave(res));
            fromEvent(this.element.nativeElement, 'igxDragOver').pipe(takeUntil(this._destroy)).subscribe((res) => this.onDragOver(res));
        });
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this._destroy.next(true);
        this._destroy.complete();
    }
    /**
     * @hidden
     */
    onDragOver(event) {
        const elementPosX = this.element.nativeElement.getBoundingClientRect().left + this.getWindowScrollLeft();
        const elementPosY = this.element.nativeElement.getBoundingClientRect().top + this.getWindowScrollTop();
        const offsetX = event.detail.pageX - elementPosX;
        const offsetY = event.detail.pageY - elementPosY;
        const eventArgs = {
            originalEvent: event.detail.originalEvent,
            owner: this,
            drag: event.detail.owner,
            dragData: event.detail.owner.data,
            startX: event.detail.startX,
            startY: event.detail.startY,
            pageX: event.detail.pageX,
            pageY: event.detail.pageY,
            offsetX,
            offsetY
        };
        this.over.emit(eventArgs);
    }
    /**
     * @hidden
     */
    onDragEnter(event) {
        if (!this.isDragLinked(event.detail.owner)) {
            return;
        }
        this.dragover = true;
        const elementPosX = this.element.nativeElement.getBoundingClientRect().left + this.getWindowScrollLeft();
        const elementPosY = this.element.nativeElement.getBoundingClientRect().top + this.getWindowScrollTop();
        const offsetX = event.detail.pageX - elementPosX;
        const offsetY = event.detail.pageY - elementPosY;
        const eventArgs = {
            originalEvent: event.detail.originalEvent,
            owner: this,
            drag: event.detail.owner,
            dragData: event.detail.owner.data,
            startX: event.detail.startX,
            startY: event.detail.startY,
            pageX: event.detail.pageX,
            pageY: event.detail.pageY,
            offsetX,
            offsetY
        };
        this._zone.run(() => {
            this.enter.emit(eventArgs);
        });
    }
    /**
     * @hidden
     */
    onDragLeave(event) {
        if (!this.isDragLinked(event.detail.owner)) {
            return;
        }
        this.dragover = false;
        const elementPosX = this.element.nativeElement.getBoundingClientRect().left + this.getWindowScrollLeft();
        const elementPosY = this.element.nativeElement.getBoundingClientRect().top + this.getWindowScrollTop();
        const offsetX = event.detail.pageX - elementPosX;
        const offsetY = event.detail.pageY - elementPosY;
        const eventArgs = {
            originalEvent: event.detail.originalEvent,
            owner: this,
            drag: event.detail.owner,
            dragData: event.detail.owner.data,
            startX: event.detail.startX,
            startY: event.detail.startY,
            pageX: event.detail.pageX,
            pageY: event.detail.pageY,
            offsetX,
            offsetY
        };
        this._zone.run(() => {
            this.leave.emit(eventArgs);
        });
    }
    getWindowScrollTop() {
        return window.scrollY ? window.scrollY : (window.pageYOffset ? window.pageYOffset : 0);
    }
    getWindowScrollLeft() {
        return window.scrollX ? window.scrollX : (window.pageXOffset ? window.pageXOffset : 0);
    }
    isDragLinked(drag) {
        const dragLinkArray = drag.dragChannel instanceof Array;
        const dropLinkArray = this.dropChannel instanceof Array;
        if (!dragLinkArray && !dropLinkArray) {
            return this.dropChannel === drag.dragChannel;
        }
        else if (!dragLinkArray && dropLinkArray) {
            const dropLinks = this.dropChannel;
            for (const link of dropLinks) {
                if (link === drag.dragChannel) {
                    return true;
                }
            }
        }
        else if (dragLinkArray && !dropLinkArray) {
            const dragLinks = drag.dragChannel;
            for (const link of dragLinks) {
                if (link === this.dropChannel) {
                    return true;
                }
            }
        }
        else {
            const dragLinks = drag.dragChannel;
            const dropLinks = this.dropChannel;
            for (const draglink of dragLinks) {
                for (const droplink of dropLinks) {
                    if (draglink === droplink) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getInsertIndexAt(draggedDir, elementsAtPoint) {
        let insertIndex = -1;
        const dropChildren = Array.prototype.slice.call(this.element.nativeElement.children);
        if (!dropChildren.length) {
            return insertIndex;
        }
        let i = 0;
        let childUnder = null;
        while (!childUnder && i < elementsAtPoint.length) {
            if (elementsAtPoint[i].parentElement === this.element.nativeElement) {
                childUnder = elementsAtPoint[i];
            }
            i++;
        }
        const draggedElemIndex = dropChildren.indexOf(draggedDir.element.nativeElement);
        insertIndex = dropChildren.indexOf(childUnder);
        if (draggedElemIndex !== -1 && draggedElemIndex < insertIndex) {
            insertIndex++;
        }
        return insertIndex;
    }
}
IgxDropDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
IgxDropDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDropDirective, selector: "[igxDrop]", inputs: { data: ["igxDrop", "data"], dropChannel: "dropChannel", dropStrategy: "dropStrategy" }, outputs: { enter: "enter", over: "over", leave: "leave", dropped: "dropped" }, host: { listeners: { "igxDrop": "onDragDrop($event)" }, properties: { "attr.droppable": "this.droppable", "class.dragOver": "this.dragover" } }, exportAs: ["drop"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'drop',
                    selector: '[igxDrop]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { data: [{
                type: Input,
                args: ['igxDrop']
            }], dropChannel: [{
                type: Input
            }], dropStrategy: [{
                type: Input
            }], enter: [{
                type: Output
            }], over: [{
                type: Output
            }], leave: [{
                type: Output
            }], dropped: [{
                type: Output
            }], droppable: [{
                type: HostBinding,
                args: ['attr.droppable']
            }], dragover: [{
                type: HostBinding,
                args: ['class.dragOver']
            }], onDragDrop: [{
                type: HostListener,
                args: ['igxDrop', ['$event']]
            }] } });
/**
 * @hidden
 */
export class IgxDragDropModule {
}
IgxDragDropModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragDropModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxDragDropModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragDropModule, declarations: [IgxDragDirective, IgxDropDirective, IgxDragHandleDirective, IgxDragIgnoreDirective], exports: [IgxDragDirective, IgxDropDirective, IgxDragHandleDirective, IgxDragIgnoreDirective] });
IgxDragDropModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragDropModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDragDropModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxDragDirective, IgxDropDirective, IgxDragHandleDirective, IgxDragIgnoreDirective],
                    exports: [IgxDragDirective, IgxDropDirective, IgxDragHandleDirective, IgxDragIgnoreDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1kcm9wLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kaXJlY3RpdmVzL2RyYWctZHJvcC9kcmFnLWRyb3AuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osS0FBSyxFQUNMLFFBQVEsRUFJUixNQUFNLEVBTU4sZUFBZSxFQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyRCxPQUFPLEVBQWlCLHNCQUFzQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQUU3RSxNQUFNLENBQU4sSUFBWSxhQUlYO0FBSkQsV0FBWSxhQUFhO0lBQ3JCLHlEQUFRLENBQUE7SUFDUiw2REFBVSxDQUFBO0lBQ1YsaURBQUksQ0FBQTtBQUNSLENBQUMsRUFKVyxhQUFhLEtBQWIsYUFBYSxRQUl4QjtBQTBHRCxNQUFNLE9BQU8sZUFBZTtJQUl4QixZQUFvQixNQUFNLEVBQVUsTUFBTTtRQUF0QixXQUFNLEdBQU4sTUFBTSxDQUFBO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBQTtRQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0o7QUFLRCxNQUFNLE9BQU8sc0JBQXNCO0lBSy9CLFlBQW1CLE9BQXdCO1FBQXhCLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBRnBDLGNBQVMs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aW1wb3J0IHtcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBSZW5kZXJlcjIsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgVmlld0NvbnRhaW5lclJlZixcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBRdWVyeUxpc3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBhbmltYXRpb25GcmFtZVNjaGVkdWxlciwgZnJvbUV2ZW50LCBpbnRlcnZhbCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCB0aHJvdHRsZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElEcm9wU3RyYXRlZ3ksIElneERlZmF1bHREcm9wU3RyYXRlZ3kgfSBmcm9tICcuL2RyYWctZHJvcC5zdHJhdGVneSc7XG5cbmV4cG9ydCBlbnVtIERyYWdEaXJlY3Rpb24ge1xuICAgIFZFUlRJQ0FMLFxuICAgIEhPUklaT05UQUwsXG4gICAgQk9USFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElneERyYWdDdXN0b21FdmVudERldGFpbHMge1xuICAgIHN0YXJ0WDogbnVtYmVyO1xuICAgIHN0YXJ0WTogbnVtYmVyO1xuICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgcGFnZVk6IG51bWJlcjtcbiAgICBvd25lcjogSWd4RHJhZ0RpcmVjdGl2ZTtcbiAgICBvcmlnaW5hbEV2ZW50OiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSURyb3BCYXNlRXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VFdmVudEFyZ3Mge1xuICAgIC8qKlxuICAgICAqIFJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgZXZlbnQgdGhhdCBjYXVzZWQgdGhlIGRyYWdnYWJsZSBlbGVtZW50IHRvIGVudGVyIHRoZSBpZ3hEcm9wIGVsZW1lbnQuXG4gICAgICogQ2FuIGJlIFBvaW50ZXJFdmVudCwgVG91Y2hFdmVudCBvciBNb3VzZUV2ZW50LlxuICAgICAqL1xuICAgIG9yaWdpbmFsRXZlbnQ6IGFueTtcbiAgICAvKiogVGhlIG93bmVyIGlneERyb3AgZGlyZWN0aXZlIHRoYXQgdHJpZ2dlcmVkIHRoaXMgZXZlbnQuICovXG4gICAgb3duZXI6IElneERyb3BEaXJlY3RpdmU7XG4gICAgLyoqIFRoZSBpZ3hEcmFnIGRpcmVjdGl2ZSBpbnN0YW5jZWQgb24gYW4gZWxlbWVudCB0aGF0IGVudGVyZWQgdGhlIGFyZWEgb2YgdGhlIGlneERyb3AgZWxlbWVudCAqL1xuICAgIGRyYWc6IElneERyYWdEaXJlY3RpdmU7XG4gICAgLyoqIFRoZSBkYXRhIGNvbnRhaW5lZCBmb3IgdGhlIGRyYWdnYWJsZSBlbGVtZW50IGluIGlneERyYWcgZGlyZWN0aXZlLiAqL1xuICAgIGRyYWdEYXRhOiBhbnk7XG4gICAgLyoqIFRoZSBpbml0aWFsIHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIG9uIFggYXhpcyB3aGVuIHRoZSBkcmFnZ2VkIGVsZW1lbnQgYmVnYW4gbW92aW5nICovXG4gICAgc3RhcnRYOiBudW1iZXI7XG4gICAgLyoqIFRoZSBpbml0aWFsIHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIG9uIFkgYXhpcyB3aGVuIHRoZSBkcmFnZ2VkIGVsZW1lbnQgYmVnYW4gbW92aW5nICovXG4gICAgc3RhcnRZOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgb24gWCBheGlzIHdoZW4gdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQuXG4gICAgICogTm90ZTogVGhlIGJyb3dzZXIgbWlnaHQgdHJpZ2dlciB0aGUgZXZlbnQgd2l0aCBzb21lIGRlbGF5IGFuZCBwb2ludGVyIHdvdWxkIGJlIGFscmVhZHkgaW5zaWRlIHRoZSBpZ3hEcm9wLlxuICAgICAqL1xuICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgb24gWSBheGlzIHdoZW4gdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQuXG4gICAgICogTm90ZTogVGhlIGJyb3dzZXIgbWlnaHQgdHJpZ2dlciB0aGUgZXZlbnQgd2l0aCBzb21lIGRlbGF5IGFuZCBwb2ludGVyIHdvdWxkIGJlIGFscmVhZHkgaW5zaWRlIHRoZSBpZ3hEcm9wLlxuICAgICAqL1xuICAgIHBhZ2VZOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgb24gWCBheGlzIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXIgdGhhdCBpbml0aWFsaXplcyB0aGUgaWd4RHJvcC5cbiAgICAgKiBOb3RlOiBUaGUgYnJvd3NlciBtaWdodCB0cmlnZ2VyIHRoZSBldmVudCB3aXRoIHNvbWUgZGVsYXkgYW5kIHBvaW50ZXIgd291bGQgYmUgYWxyZWFkeSBpbnNpZGUgdGhlIGlneERyb3AuXG4gICAgICovXG4gICAgb2Zmc2V0WDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIG9uIFkgYXhpcyByZWxhdGl2ZSB0byB0aGUgY29udGFpbmVyIHRoYXQgaW5pdGlhbGl6ZXMgdGhlIGlneERyb3AuXG4gICAgICogTm90ZTogVGhlIGJyb3dzZXIgbWlnaHQgdHJpZ2dlciB0aGUgZXZlbnQgd2l0aCBzb21lIGRlbGF5IGFuZCBwb2ludGVyIHdvdWxkIGJlIGFscmVhZHkgaW5zaWRlIHRoZSBpZ3hEcm9wLlxuICAgICAqL1xuICAgIG9mZnNldFk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRHJvcERyb3BwZWRFdmVudEFyZ3MgZXh0ZW5kcyBJRHJvcEJhc2VFdmVudEFyZ3Mge1xuICAgIC8qKiBTcGVjaWZpZXMgaWYgdGhlIGRlZmF1bHQgZHJvcCBsb2dpYyByZWxhdGVkIHRvIHRoZSBldmVudCBzaG91bGQgYmUgY2FuY2VsZWQuICovXG4gICAgY2FuY2VsOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElEcmFnQmFzZUV2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICAvKipcbiAgICAgKiBSZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIGV2ZW50IHRoYXQgY2F1c2VkIHRoZSBpbnRlcmFjdGlvbiB3aXRoIHRoZSBlbGVtZW50LlxuICAgICAqIENhbiBiZSBQb2ludGVyRXZlbnQsIFRvdWNoRXZlbnQgb3IgTW91c2VFdmVudC5cbiAgICAgKi9cbiAgICBvcmlnaW5hbEV2ZW50OiBQb2ludGVyRXZlbnQgfCBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudDtcbiAgICAvKiogVGhlIG93bmVyIGlneERyYWcgZGlyZWN0aXZlIHRoYXQgdHJpZ2dlcmVkIHRoaXMgZXZlbnQuICovXG4gICAgb3duZXI6IElneERyYWdEaXJlY3RpdmU7XG4gICAgLyoqIFRoZSBpbml0aWFsIHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIG9uIFggYXhpcyB3aGVuIHRoZSBkcmFnZ2VkIGVsZW1lbnQgYmVnYW4gbW92aW5nICovXG4gICAgc3RhcnRYOiBudW1iZXI7XG4gICAgLyoqIFRoZSBpbml0aWFsIHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyIG9uIFkgYXhpcyB3aGVuIHRoZSBkcmFnZ2VkIGVsZW1lbnQgYmVnYW4gbW92aW5nICovXG4gICAgc3RhcnRZOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgb24gWCBheGlzIHdoZW4gdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQuXG4gICAgICogTm90ZTogVGhlIGJyb3dzZXIgbWlnaHQgdHJpZ2dlciB0aGUgZXZlbnQgd2l0aCBzb21lIGRlbGF5IGFuZCBwb2ludGVyIHdvdWxkIGJlIGFscmVhZHkgaW5zaWRlIHRoZSBpZ3hEcm9wLlxuICAgICAqL1xuICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgb24gWSBheGlzIHdoZW4gdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQuXG4gICAgICogTm90ZTogVGhlIGJyb3dzZXIgbWlnaHQgdHJpZ2dlciB0aGUgZXZlbnQgd2l0aCBzb21lIGRlbGF5IGFuZCBwb2ludGVyIHdvdWxkIGJlIGFscmVhZHkgaW5zaWRlIHRoZSBpZ3hEcm9wLlxuICAgICAqL1xuICAgIHBhZ2VZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSURyYWdTdGFydEV2ZW50QXJncyBleHRlbmRzIElEcmFnQmFzZUV2ZW50QXJncyB7XG4gICAgLyoqIFNldCBpZiB0aGUgdGhlIGRyYWdnaW5nIHNob3VsZCBiZSBjYW5jZWxlZC4gKi9cbiAgICBjYW5jZWw6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSURyYWdNb3ZlRXZlbnRBcmdzIGV4dGVuZHMgSURyYWdTdGFydEV2ZW50QXJncyB7XG4gICAgLyoqIFRoZSBuZXcgcGFnZVggcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgdGhhdCB0aGUgaWd4RHJhZyB3aWxsIHVzZS4gSXQgY2FuIGJlIG92ZXJyaWRkZW4gdG8gbGltaXQgZHJhZ2dlZCBlbGVtZW50IFggbW92ZW1lbnQuICovXG4gICAgbmV4dFBhZ2VYOiBudW1iZXI7XG4gICAgLyoqIFRoZSBuZXcgcGFnZVggcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIgdGhhdCB0aGUgaWd4RHJhZyB3aWxsIHVzZS4gSXQgY2FuIGJlIG92ZXJyaWRkZW4gdG8gbGltaXQgZHJhZ2dlZCBlbGVtZW50IFkgbW92ZW1lbnQuICovXG4gICAgbmV4dFBhZ2VZOiBudW1iZXI7XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBJRHJhZ0dob3N0QmFzZUV2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICAvKiogVGhlIG93bmVyIGlneERyYWcgZGlyZWN0aXZlIHRoYXQgdHJpZ2dlcmVkIHRoaXMgZXZlbnQuICovXG4gICAgb3duZXI6IElneERyYWdEaXJlY3RpdmU7XG4gICAgLyoqIEluc3RhbmNlIHRvIHRoZSBnaG9zdCBlbGVtZW50IHRoYXQgaXMgY3JlYXRlZCB3aGVuIGRyYWdnaW5nIHN0YXJ0cy4gKi9cbiAgICBnaG9zdEVsZW1lbnQ6IGFueTtcbiAgICAvKiogU2V0IGlmIHRoZSBnaG9zdCBjcmVhdGlvbi9kZXN0cnVjdGlvbiBzaG91bGQgYmUgY2FuY2VsZWQuICovXG4gICAgY2FuY2VsOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElEcmFnQ3VzdG9tVHJhbnNpdGlvbkFyZ3Mge1xuICAgIGR1cmF0aW9uPzogbnVtYmVyO1xuICAgIHRpbWluZ0Z1bmN0aW9uPzogc3RyaW5nO1xuICAgIGRlbGF5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgSWd4RHJhZ0xvY2F0aW9uIHtcbiAgICBwdWJsaWMgcGFnZVg6IG51bWJlcjtcbiAgICBwdWJsaWMgcGFnZVk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhZ2VYLCBwcml2YXRlIF9wYWdlWSkge1xuICAgICAgICB0aGlzLnBhZ2VYID0gcGFyc2VGbG9hdChfcGFnZVgpO1xuICAgICAgICB0aGlzLnBhZ2VZID0gcGFyc2VGbG9hdChfcGFnZVkpO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbaWd4RHJhZ0hhbmRsZV0nXG59KVxuZXhwb3J0IGNsYXNzIElneERyYWdIYW5kbGVEaXJlY3RpdmUge1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZHJhZ19faGFuZGxlJylcbiAgICBwdWJsaWMgYmFzZUNsYXNzID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmPGFueT4pIHt9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneERyYWdJZ25vcmVdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hEcmFnSWdub3JlRGlyZWN0aXZlIHtcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWRyYWdfX2lnbm9yZScpXG4gICAgcHVibGljIGJhc2VDbGFzcyA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjxhbnk+KSB7fVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBleHBvcnRBczogJ2RyYWcnLFxuICAgIHNlbGVjdG9yOiAnW2lneERyYWddJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hEcmFnRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiAtIFNhdmUgZGF0YSBpbnNpZGUgdGhlIGBpZ3hEcmFnYCBkaXJlY3RpdmUuIFRoaXMgY2FuIGJlIHNldCB3aGVuIGluc3RhbmNpbmcgYGlneERyYWdgIG9uIGFuIGVsZW1lbnQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgW2lneERyYWddPVwieyBzb3VyY2U6IG15RWxlbWVudCB9XCI+PC9kaXY+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgnaWd4RHJhZycpXG4gICAgcHVibGljIHNldCBkYXRhKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBpbmRpY2F0ZXMgd2hlbiB0aGUgZHJhZyBzaG91bGQgc3RhcnQuXG4gICAgICogQnkgZGVmYXVsdCB0aGUgZHJhZyBzdGFydHMgYWZ0ZXIgdGhlIGRyYWdnYWJsZSBlbGVtZW50IGlzIG1vdmVkIGJ5IDVweC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnIFtkcmFnVG9sZXJhbmNlXT1cIjEwMFwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRyYWdUb2xlcmFuY2UgPSA1O1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgaW5kaWNhdGVzIHRoZSBkaXJlY3Rpb25zIHRoYXQgdGhlIGVsZW1lbnQgY2FuIGJlIGRyYWdnZWQuXG4gICAgICogQnkgZGVmYXVsdCBpdCBpcyBzZXQgdG8gYm90aCBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBkaXJlY3Rpb25zLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneERyYWcgW2RyYWdEaXJlY3Rpb25dPVwiZHJhZ0RpclwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBkcmFnRGlyID0gRHJhZ0RpcmVjdGlvbi5IT1JJWk9OVEFMO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyYWdEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkcmFnRGlyZWN0aW9uID0gRHJhZ0RpcmVjdGlvbi5CT1RIO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgcHJvdmlkZSBhIHdheSBmb3IgaWd4RHJhZyBhbmQgaWd4RHJvcCB0byBiZSBsaW5rZWQgdGhyb3VnaCBjaGFubmVscy5cbiAgICAgKiBJdCBhY2NlcHRzIHNpbmdsZSB2YWx1ZSBvciBhbiBhcnJheSBvZiB2YWx1ZXMgYW5kIGV2YWx1YXRlcyB0aGVuIHVzaW5nIHN0cmljdCBlcXVhbGl0eS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnIFtkcmFnQ2hhbm5lbF09XCInb2RkJ1wiPlxuICAgICAqICAgICAgICAgPHNwYW4+OTU8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogPGRpdiBpZ3hEcm9wIFtkcm9wQ2hhbm5lbF09XCJbJ29kZCcsICdpcnJhdGlvbmFsJ11cIj5cbiAgICAgKiAgICAgICAgIDxzcGFuPk51bWJlcnMgZHJvcCBhcmVhITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hEcmFnRGlyZWN0aXZlXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZHJhZ0NoYW5uZWw6IG51bWJlciB8IHN0cmluZyB8IG51bWJlcltdIHwgc3RyaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzcGVjaWZpZXMgaWYgdGhlIGJhc2UgZWxlbWVudCBzaG91bGQgbm90IGJlIG1vdmVkIGFuZCBhIGdob3N0IGVsZW1lbnQgc2hvdWxkIGJlIHJlbmRlcmVkIHRoYXQgcmVwcmVzZW50cyBpdC5cbiAgICAgKiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byBgdHJ1ZWAuXG4gICAgICogSWYgaXQgaXMgc2V0IHRvIGBmYWxzZWAgd2hlbiBkcmFnZ2luZyB0aGUgYmFzZSBlbGVtZW50IGlzIG1vdmVkIGluc3RlYWQgYW5kIG5vIGdob3N0IGVsZW1lbnRzIGFyZSByZW5kZXJlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnIFtnaG9zdF09XCJmYWxzZVwiPlxuICAgICAqICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdob3N0ID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBjdXN0b20gY2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBgZ2hvc3RFbGVtZW50YCBlbGVtZW50LlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneERyYWcgW2dob3N0Q2xhc3NdPVwiJ2dob3N0RWxlbWVudCdcIj5cbiAgICAgKiAgICAgICAgIDxzcGFuPkRyYWcgTWUhPC9zcGFuPlxuICAgICAqIDwvZGl2PlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyYWdEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnaG9zdENsYXNzID0gJyc7XG5cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNwZWNpZmllcyBhIHRlbXBsYXRlIGZvciB0aGUgZ2hvc3QgZWxlbWVudCBjcmVhdGVkIHdoZW4gZHJhZ2dpbmcgc3RhcnRzIGFuZCBgZ2hvc3RgIGlzIHRydWUuXG4gICAgICogQnkgZGVmYXVsdCBhIGNsb25lIG9mIHRoZSBiYXNlIGVsZW1lbnQgdGhlIGlneERyYWcgaXMgaW5zdGFuY2VkIGlzIGNyZWF0ZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgaWd4RHJhZyBbZ2hvc3RUZW1wbGF0ZV09XCJjdXN0b21HaG9zdFwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogPG5nLXRlbXBsYXRlICNjdXN0b21HaG9zdD5cbiAgICAgKiAgICAgIDxkaXYgY2xhc3M9XCJjdXN0b21HaG9zdFN0eWxlXCI+XG4gICAgICogICAgICAgICAgPHNwYW4+SSBhbSBiZWluZyBkcmFnZ2VkITwvc3Bhbj5cbiAgICAgKiAgICAgIDwvZGl2PlxuICAgICAqIDwvbmctdGVtcGxhdGU+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdob3N0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSBlbGVtZW50IHRvIHdoaWNoIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2lsbCBiZSBhcHBlbmRlZC5cbiAgICAgKiBCeSBkZWZhdWx0IGl0J3Mgc2V0IHRvIG51bGwgYW5kIHRoZSBkcmFnZ2VkIGVsZW1lbnQgaXMgYXBwZW5kZWQgdG8gdGhlIGJvZHkuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgI2hvc3REaXY+PC9kaXY+XG4gICAgICogPGRpdiBpZ3hEcmFnIFtnaG9zdEhvc3RdPVwiaG9zdERpdlwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdob3N0SG9zdDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHRyaWdnZXJlZCB3aGVuIHRoZSBkcmFnZ2FibGUgZWxlbWVudCBkcmFnIHN0YXJ0cy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnIChkcmFnU3RhcnQpPVwib25EcmFnU3RhcnQoKVwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBvbkRyYWdTdGFydCgpe1xuICAgICAqICAgICAgYWxlcnQoXCJUaGUgZHJhZyBoYXMgc3RhcmVkIVwiKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElEcmFnU3RhcnRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgd2hlbiB0aGUgZHJhZ2dhYmxlIGVsZW1lbnQgaGFzIGJlZW4gbW92ZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgaWd4RHJhZyAgKGRyYWdNb3ZlKT1cIm9uRHJhZ01vdmUoKVwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBvbkRyYWdNb3ZlKCl7XG4gICAgICogICAgICBhbGVydChcIlRoZSBlbGVtZW50IGhhcyBtb3ZlZCFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyYWdEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZHJhZ01vdmUgPSBuZXcgRXZlbnRFbWl0dGVyPElEcmFnTW92ZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHRyaWdnZXJlZCB3aGVuIHRoZSBkcmFnZ2FibGUgZWxlbWVudCBpcyByZWxlYXNlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnIChkcmFnRW5kKT1cIm9uRHJhZ0VuZCgpXCI+XG4gICAgICogICAgICAgICA8c3Bhbj5EcmFnIE1lITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIG9uRHJhZ0VuZCgpe1xuICAgICAqICAgICAgYWxlcnQoXCJUaGUgZHJhZyBoYXMgZW5kZWQhXCIpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hEcmFnRGlyZWN0aXZlXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPElEcmFnQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHRyaWdnZXJlZCB3aGVuIHRoZSBkcmFnZ2FibGUgZWxlbWVudCBpcyBjbGlja2VkLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneERyYWcgKGRyYWdDbGljayk9XCJvbkRyYWdDbGljaygpXCI+XG4gICAgICogICAgICAgICA8c3Bhbj5EcmFnIE1lITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIG9uRHJhZ0NsaWNrKCl7XG4gICAgICogICAgICBhbGVydChcIlRoZSBlbGVtZW50IGhhcyBiZWVuIGNsaWNrZWQhXCIpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hEcmFnRGlyZWN0aXZlXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGRyYWdDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SURyYWdCYXNlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIHdoZW4gdGhlIGRyYWcgZ2hvc3QgZWxlbWVudCBpcyBjcmVhdGVkLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneERyYWcgKGdob3N0Q3JlYXRlKT1cImdob3N0Q3JlYXRlZCgpXCI+XG4gICAgICogICAgICAgICA8c3Bhbj5EcmFnIE1lITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGdob3N0Q3JlYXRlZCgpe1xuICAgICAqICAgICAgYWxlcnQoXCJUaGUgZ2hvc3QgaGFzIGJlZW4gY3JlYXRlZCFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyYWdEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZ2hvc3RDcmVhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPElEcmFnR2hvc3RCYXNlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIHdoZW4gdGhlIGRyYWcgZ2hvc3QgZWxlbWVudCBpcyBjcmVhdGVkLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneERyYWcgKGdob3N0RGVzdHJveSk9XCJnaG9zdERlc3Ryb3llZCgpXCI+XG4gICAgICogICAgICAgICA8c3Bhbj5EcmFnIE1lITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGdob3N0RGVzdHJveWVkKCl7XG4gICAgICogICAgICBhbGVydChcIlRoZSBnaG9zdCBoYXMgYmVlbiBkZXN0cm95ZWQhXCIpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hEcmFnRGlyZWN0aXZlXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGdob3N0RGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXI8SURyYWdHaG9zdEJhc2VFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIGRyYWdnYWJsZSBlbGVtZW50IGlzIHJlbGVhc2VkIGFuZCBhZnRlciBpdHMgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnICh0cmFuc2l0aW9uZWQpPVwib25Nb3ZlRW5kKClcIj5cbiAgICAgKiAgICAgICAgIDxzcGFuPkRyYWcgTWUhPC9zcGFuPlxuICAgICAqIDwvZGl2PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgb25Nb3ZlRW5kKCl7XG4gICAgICogICAgICBhbGVydChcIlRoZSBtb3ZlIGhhcyBlbmRlZCFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyYWdEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgdHJhbnNpdGlvbmVkID0gbmV3IEV2ZW50RW1pdHRlcjxJRHJhZ0Jhc2VFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hEcmFnSGFuZGxlRGlyZWN0aXZlLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIGRyYWdIYW5kbGVzOiBRdWVyeUxpc3Q8SWd4RHJhZ0hhbmRsZURpcmVjdGl2ZT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hEcmFnSWdub3JlRGlyZWN0aXZlLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIGRyYWdJZ25vcmVkRWxlbXM6IFF1ZXJ5TGlzdDxJZ3hEcmFnSWdub3JlRGlyZWN0aXZlPjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1kcmFnJylcbiAgICBwdWJsaWMgYmFzZUNsYXNzID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1kcmFnLS1zZWxlY3QtZGlzYWJsZWQnKVxuICAgIHB1YmxpYyBzZWxlY3REaXNhYmxlZCA9IGZhbHNlO1xuXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IGxvY2F0aW9uIG9mIHRoZSBlbGVtZW50IHJlbGF0aXZlIHRvIHRoZSBwYWdlLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbG9jYXRpb24oKTogSWd4RHJhZ0xvY2F0aW9uIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJZ3hEcmFnTG9jYXRpb24odGhpcy5wYWdlWCwgdGhpcy5wYWdlWSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgb3JpZ2luYWwgbG9jYXRpb24gb2YgdGhlIGVsZW1lbnQgYmVmb3JlIGRyYWdnaW5nIHN0YXJ0ZWQuXG4gICAgICovXG4gICAgcHVibGljIGdldCBvcmlnaW5Mb2NhdGlvbigpOiBJZ3hEcmFnTG9jYXRpb24ge1xuICAgICAgICByZXR1cm4gbmV3IElneERyYWdMb2NhdGlvbih0aGlzLmJhc2VPcmlnaW5MZWZ0LCB0aGlzLmJhc2VPcmlnaW5Ub3ApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBvaW50ZXJFdmVudHNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIFBvaW50ZXJFdmVudCAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG91Y2hFdmVudHNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBhZ2VYKCkge1xuICAgICAgICBpZiAodGhpcy5naG9zdCAmJiB0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2hvc3RMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2VMZWZ0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBhZ2VZKCkge1xuICAgICAgICBpZiAodGhpcy5naG9zdCAmJiB0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2hvc3RUb3A7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVRvcDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGJhc2VMZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgYmFzZVRvcCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgYmFzZU9yaWdpbkxlZnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZUxlZnQgLSB0aGlzLmdldFRyYW5zZm9ybVgodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgYmFzZU9yaWdpblRvcCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNlVG9wIC0gdGhpcy5nZXRUcmFuc2Zvcm1ZKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0IGdob3N0TGVmdChwYWdlWDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byB0YWtlIGludG8gYWNjb3VudCBtYXJnaW5MZWZ0LCBzaW5jZSB0b3Agc3R5bGUgZG9lcyBub3QgaW5jbHVkZSBtYXJnaW4sIGJ1dCBwYWdlWCBpbmNsdWRlcyB0aGUgbWFyZ2luLlxuICAgICAgICAgICAgY29uc3QgZ2hvc3RNYXJnaW5MZWZ0ID0gcGFyc2VJbnQoZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmdob3N0RWxlbWVudClbJ21hcmdpbi1sZWZ0J10sIDEwKTtcbiAgICAgICAgICAgIC8vIElmIGdob3N0IGhvc3QgaXMgZGVmaW5lZCBpdCBuZWVkcyB0byBiZSB0YWtlbiBpbnRvIGFjY291bnQuXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gKHBhZ2VYIC0gZ2hvc3RNYXJnaW5MZWZ0IC0gdGhpcy5fZ2hvc3RIb3N0WCkgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBnaG9zdExlZnQoKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmdob3N0RWxlbWVudC5zdHlsZS5sZWZ0LCAxMCkgKyB0aGlzLl9naG9zdEhvc3RYO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXQgZ2hvc3RUb3AocGFnZVk6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gdGFrZSBpbnRvIGFjY291bnQgbWFyZ2luVG9wLCBzaW5jZSB0b3Agc3R5bGUgZG9lcyBub3QgaW5jbHVkZSBtYXJnaW4sIGJ1dCBwYWdlWSBpbmNsdWRlcyB0aGUgbWFyZ2luLlxuICAgICAgICAgICAgY29uc3QgZ2hvc3RNYXJnaW5Ub3AgPSBwYXJzZUludChkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZ2hvc3RFbGVtZW50KVsnbWFyZ2luLXRvcCddLCAxMCk7XG4gICAgICAgICAgICAvLyBJZiBnaG9zdCBob3N0IGlzIGRlZmluZWQgaXQgbmVlZHMgdG8gYmUgdGFrZW4gaW50byBhY2NvdW50LlxuICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuc3R5bGUudG9wID0gKHBhZ2VZIC0gZ2hvc3RNYXJnaW5Ub3AgLSB0aGlzLl9naG9zdEhvc3RZKSArICdweCc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGdob3N0VG9wKCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5naG9zdEVsZW1lbnQuc3R5bGUudG9wLCAxMCkgKyB0aGlzLl9naG9zdEhvc3RZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmYXVsdFJldHVybkR1cmF0aW9uID0gJzAuNXMnO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnaG9zdEVsZW1lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGFuaW1JblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICBwcm90ZWN0ZWQgZ2hvc3RDb250ZXh0OiBhbnkgPSBudWxsO1xuICAgIHByb3RlY3RlZCBfc3RhcnRYID0gMDtcbiAgICBwcm90ZWN0ZWQgX3N0YXJ0WSA9IDA7XG4gICAgcHJvdGVjdGVkIF9sYXN0WCA9IDA7XG4gICAgcHJvdGVjdGVkIF9sYXN0WSA9IDA7XG4gICAgcHJvdGVjdGVkIF9kcmFnU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLyoqIERyYWcgZ2hvc3QgcmVsYXRlZCBwcm9wZXJ0aWVzICovXG4gICAgcHJvdGVjdGVkIF9kZWZhdWx0T2Zmc2V0WDtcbiAgICBwcm90ZWN0ZWQgX2RlZmF1bHRPZmZzZXRZO1xuICAgIHByb3RlY3RlZCBfb2Zmc2V0WDtcbiAgICBwcm90ZWN0ZWQgX29mZnNldFk7XG4gICAgcHJvdGVjdGVkIF9naG9zdFN0YXJ0WDtcbiAgICBwcm90ZWN0ZWQgX2dob3N0U3RhcnRZO1xuICAgIHByb3RlY3RlZCBfZ2hvc3RIb3N0WCA9IDA7XG4gICAgcHJvdGVjdGVkIF9naG9zdEhvc3RZID0gMDtcbiAgICBwcm90ZWN0ZWQgX2R5bmFtaWNHaG9zdFJlZjtcblxuICAgIHByb3RlY3RlZCBfcG9pbnRlckRvd25JZCA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF9jbGlja2VkID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIF9sYXN0RHJvcEFyZWEgPSBudWxsO1xuXG4gICAgcHJvdGVjdGVkIF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgICBwcm90ZWN0ZWQgX3JlbW92ZU9uRGVzdHJveSA9IHRydWU7XG4gICAgcHJvdGVjdGVkIF9kYXRhOiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzcGVjaWZpZXMgdGhlIG9mZnNldCBvZiB0aGUgZHJhZ2dlZCBlbGVtZW50IHJlbGF0aXZlIHRvIHRoZSBtb3VzZSBpbiBwaXhlbHMuXG4gICAgICogQnkgZGVmYXVsdCBpdCdzIHRha2luZyB0aGUgcmVsYXRpdmUgcG9zaXRpb24gdG8gdGhlIG1vdXNlIHdoZW4gdGhlIGRyYWcgc3RhcnRlZCBhbmQga2VlcHMgaXQgdGhlIHNhbWUuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgI2hvc3REaXY+PC9kaXY+XG4gICAgICogPGRpdiBpZ3hEcmFnIFtnaG9zdE9mZnNldFhdPVwiMFwiPlxuICAgICAqICAgICAgICAgPHNwYW4+RHJhZyBNZSE8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJhZ0RpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBnaG9zdE9mZnNldFgodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0WCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBnaG9zdE9mZnNldFgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRYICE9PSB1bmRlZmluZWQgPyB0aGlzLl9vZmZzZXRYIDogdGhpcy5fZGVmYXVsdE9mZnNldFg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc3BlY2lmaWVzIHRoZSBvZmZzZXQgb2YgdGhlIGRyYWdnZWQgZWxlbWVudCByZWxhdGl2ZSB0byB0aGUgbW91c2UgaW4gcGl4ZWxzLlxuICAgICAqIEJ5IGRlZmF1bHQgaXQncyB0YWtpbmcgdGhlIHJlbGF0aXZlIHBvc2l0aW9uIHRvIHRoZSBtb3VzZSB3aGVuIHRoZSBkcmFnIHN0YXJ0ZWQgYW5kIGtlZXBzIGl0IHRoZSBzYW1lLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2ICNob3N0RGl2PjwvZGl2PlxuICAgICAqIDxkaXYgaWd4RHJhZyBbZ2hvc3RPZmZzZXRZXT1cIjBcIj5cbiAgICAgKiAgICAgICAgIDxzcGFuPkRyYWcgTWUhPC9zcGFuPlxuICAgICAqIDwvZGl2PlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyYWdEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZ2hvc3RPZmZzZXRZKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX29mZnNldFkgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZ2hvc3RPZmZzZXRZKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0WSAhPT0gdW5kZWZpbmVkID8gdGhpcy5fb2Zmc2V0WSA6IHRoaXMuX2RlZmF1bHRPZmZzZXRZIDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICBwdWJsaWMgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgcHVibGljIHpvbmU6IE5nWm9uZSxcbiAgICAgICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByb3RlY3RlZCBwbGF0Zm9ybVV0aWw6IFBsYXRmb3JtVXRpbCxcbiAgICApIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdIYW5kbGVzIHx8ICF0aGlzLmRyYWdIYW5kbGVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIC8vIFNldCB1c2VyIHNlbGVjdCBub25lIHRvIHRoZSB3aG9sZSBkcmFnZ2FibGUgZWxlbWVudCBpZiBubyBkcmFnIGhhbmRsZXMgYXJlIGRlZmluZWQuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdERpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmQgZXZlbnRzXG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGxhdGZvcm1VdGlsLmlzQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnRzID0gdGhpcy5kcmFnSGFuZGxlcyAmJiB0aGlzLmRyYWdIYW5kbGVzLmxlbmd0aCA/XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnSGFuZGxlcy5tYXAoKGl0ZW0pID0+IGl0ZW0uZWxlbWVudC5uYXRpdmVFbGVtZW50KSA6IFt0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudF07XG4gICAgICAgICAgICB0YXJnZXRFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRlckV2ZW50c0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQsICdwb2ludGVyZG93bicpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25Qb2ludGVyRG93bihyZXMpKTtcblxuICAgICAgICAgICAgICAgICAgICBmcm9tRXZlbnQoZWxlbWVudCwgJ3BvaW50ZXJtb3ZlJykucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlKCgpID0+IGludGVydmFsKDAsIGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveSlcbiAgICAgICAgICAgICAgICAgICAgKS5zdWJzY3JpYmUoKHJlcykgPT4gdGhpcy5vblBvaW50ZXJNb3ZlKHJlcykpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZyb21FdmVudChlbGVtZW50LCAncG9pbnRlcnVwJykucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25Qb2ludGVyVXAocmVzKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdob3N0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3QgYmluZCBgbG9zdHBvaW50ZXJjYXB0dXJlYCB0byB0aGUgdGFyZ2V0LCBiZWNhdXNlIHdlIHdpbGwgYmluZCBpdCBvbiB0aGUgZ2hvc3QgbGF0ZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tRXZlbnQoZWxlbWVudCwgJ2xvc3Rwb2ludGVyY2FwdHVyZScpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgocmVzKSA9PiB0aGlzLm9uUG9pbnRlckxvc3QocmVzKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG91Y2hFdmVudHNFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FdmVudChlbGVtZW50LCAndG91Y2hzdGFydCcpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25Qb2ludGVyRG93bihyZXMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCBoYXZlIHBvaW50ZXIgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMuIFVzZSB0aGVuIG1vdXNlIGV2ZW50cy5cbiAgICAgICAgICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQsICdtb3VzZWRvd24nKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgocmVzKSA9PiB0aGlzLm9uUG9pbnRlckRvd24ocmVzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFdlIHNob3VsZCBiaW5kIHRvIGRvY3VtZW50IGV2ZW50cyBvbmx5IG9uY2Ugd2hlbiB0aGVyZSBhcmUgbm8gcG9pbnRlciBldmVudHMuXG4gICAgICAgICAgICBpZiAoIXRoaXMucG9pbnRlckV2ZW50c0VuYWJsZWQgJiYgdGhpcy50b3VjaEV2ZW50c0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBmcm9tRXZlbnQoZG9jdW1lbnQuZGVmYXVsdFZpZXcsICd0b3VjaG1vdmUnKS5waXBlKFxuICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZSgoKSA9PiBpbnRlcnZhbCgwLCBhbmltYXRpb25GcmFtZVNjaGVkdWxlcikpLFxuICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveSlcbiAgICAgICAgICAgICAgICApLnN1YnNjcmliZSgocmVzKSA9PiB0aGlzLm9uUG9pbnRlck1vdmUocmVzKSk7XG5cbiAgICAgICAgICAgICAgICBmcm9tRXZlbnQoZG9jdW1lbnQuZGVmYXVsdFZpZXcsICd0b3VjaGVuZCcpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25Qb2ludGVyVXAocmVzKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnBvaW50ZXJFdmVudHNFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgZnJvbUV2ZW50KGRvY3VtZW50LmRlZmF1bHRWaWV3LCAnbW91c2Vtb3ZlJykucGlwZShcbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGUoKCkgPT4gaW50ZXJ2YWwoMCwgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpKSxcbiAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpXG4gICAgICAgICAgICAgICAgKS5zdWJzY3JpYmUoKHJlcykgPT4gdGhpcy5vblBvaW50ZXJNb3ZlKHJlcykpO1xuXG4gICAgICAgICAgICAgICAgZnJvbUV2ZW50KGRvY3VtZW50LmRlZmF1bHRWaWV3LCAnbW91c2V1cCcpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25Qb2ludGVyVXAocmVzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25UcmFuc2l0aW9uRW5kKGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNldCB0cmFuc2l0aW9uIGR1cmF0aW9uIHRvIDBzLiBUaGlzIGFsc28gaGVscHMgd2l0aCBzZXR0aW5nIGB2aXNpYmlsaXR5OiBoaWRkZW5gIHRvIHRoZSBiYXNlIHRvIG5vdCBsYWcuXG4gICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwLjBzJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9kZXN0cm95Lm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcblxuICAgICAgICBpZiAodGhpcy5naG9zdCAmJiB0aGlzLmdob3N0RWxlbWVudCAmJiB0aGlzLl9yZW1vdmVPbkRlc3Ryb3kpIHtcbiAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5naG9zdEVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fZHluYW1pY0dob3N0UmVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZHluYW1pY0dob3N0UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9keW5hbWljR2hvc3RSZWYgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBkZXNpcmVkIGxvY2F0aW9uIG9mIHRoZSBiYXNlIGVsZW1lbnQgb3IgZ2hvc3QgZWxlbWVudCBpZiByZW5kZWQgcmVsYXRpdmUgdG8gdGhlIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIG5ld0xvY2F0aW9uIE5ldyBsb2NhdGlvbiB0aGF0IHNob3VsZCBiZSBhcHBsaWVkLiBJdCBpcyBhZHZpc2VkIHRvIGdldCBuZXcgbG9jYXRpb24gdXNpbmcgZ2V0Qm91bmRpbmdDbGllbnRSZWN0cygpICsgc2Nyb2xsLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRMb2NhdGlvbihuZXdMb2NhdGlvbjogSWd4RHJhZ0xvY2F0aW9uKSB7XG4gICAgICAgIC8vIFdlIGRvIG5vdCBzdWJ0cmFjdCBtYXJnaW5MZWZ0IGFuZCBtYXJnaW5Ub3AgaGVyZSBiZWNhdXNlIGhlcmUgd2UgY2FsY3VsYXRlIGRlbHRhcy5cbiAgICAgICAgaWYgKHRoaXMuZ2hvc3QgJiYgdGhpcy5naG9zdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldEhvc3RYID0gdGhpcy5naG9zdEhvc3QgPyB0aGlzLmdob3N0SG9zdE9mZnNldExlZnQodGhpcy5naG9zdEhvc3QpIDogMDtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldEhvc3RZID0gdGhpcy5naG9zdEhvc3QgPyB0aGlzLmdob3N0SG9zdE9mZnNldFRvcCh0aGlzLmdob3N0SG9zdCkgOiAwO1xuICAgICAgICAgICAgdGhpcy5naG9zdExlZnQgPSBuZXdMb2NhdGlvbi5wYWdlWCAtIG9mZnNldEhvc3RYICsgdGhpcy5nZXRXaW5kb3dTY3JvbGxMZWZ0KCk7XG4gICAgICAgICAgICB0aGlzLmdob3N0VG9wID0gbmV3TG9jYXRpb24ucGFnZVkgLSBvZmZzZXRIb3N0WSArIHRoaXMuZ2V0V2luZG93U2Nyb2xsVG9wKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ2hvc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IG5ld0xvY2F0aW9uLnBhZ2VYIC0gdGhpcy5wYWdlWDtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWSA9IG5ld0xvY2F0aW9uLnBhZ2VZIC0gdGhpcy5wYWdlWTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVggPSB0aGlzLmdldFRyYW5zZm9ybVgodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtWSA9IHRoaXMuZ2V0VHJhbnNmb3JtWSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybVhZKHRyYW5zZm9ybVggKyBkZWx0YVgsIHRyYW5zZm9ybVkgKyBkZWx0YVkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc3RhcnRYID0gdGhpcy5iYXNlTGVmdDtcbiAgICAgICAgdGhpcy5fc3RhcnRZID0gdGhpcy5iYXNlVG9wO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuaW1hdGVzIHRoZSBiYXNlIG9yIGdob3N0IGVsZW1lbnQgZGVwZW5kaW5nIG9uIHRoZSBgZ2hvc3RgIGlucHV0IHRvIGl0cyBpbml0aWFsIGxvY2F0aW9uLlxuICAgICAqIElmIGBnaG9zdGAgaXMgdHJ1ZSBidXQgdGhlcmUgaXMgbm90IGdob3N0IHJlbmRlcmVkLCBpdCB3aWxsIGJlIGNyZWF0ZWQgYW5kIGFuaW1hdGVkLlxuICAgICAqIElmIHRoZSBiYXNlIGVsZW1lbnQgaGFzIGNoYW5nZWQgaXRzIERPTSBwb3NpdGlvbiBpdHMgaW5pdGlhbCBsb2NhdGlvbiB3aWxsIGJlIGNoYW5nZWQgYWNjb3JkaW5nbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY3VzdG9tQW5pbUFyZ3MgQ3VzdG9tIHRyYW5zaXRpb24gcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgYXBwbGllZCB3aGVuIHBlcmZvcm1pbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICogQHBhcmFtIHN0YXJ0TG9jYXRpb24gU3RhcnQgbG9jYXRpb24gZnJvbSB3aGVyZSB0aGUgdHJhbnNpdGlvbiBzaG91bGQgc3RhcnQuXG4gICAgICovXG4gICAgcHVibGljIHRyYW5zaXRpb25Ub09yaWdpbihjdXN0b21BbmltQXJncz86IElEcmFnQ3VzdG9tVHJhbnNpdGlvbkFyZ3MsIHN0YXJ0TG9jYXRpb24/OiBJZ3hEcmFnTG9jYXRpb24pIHtcbiAgICAgICAgaWYgKCghIXN0YXJ0TG9jYXRpb24gJiYgc3RhcnRMb2NhdGlvbi5wYWdlWCA9PT0gdGhpcy5iYXNlT3JpZ2luTGVmdCAmJiBzdGFydExvY2F0aW9uLnBhZ2VZID09PSB0aGlzLmJhc2VPcmlnaW5MZWZ0KSB8fFxuICAgICAgICAgICAgKCFzdGFydExvY2F0aW9uICYmIHRoaXMuZ2hvc3QgJiYgIXRoaXMuZ2hvc3RFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEhc3RhcnRMb2NhdGlvbiAmJiBzdGFydExvY2F0aW9uLnBhZ2VYICE9PSB0aGlzLnBhZ2VYICYmIHN0YXJ0TG9jYXRpb24ucGFnZVkgIT09IHRoaXMucGFnZVkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0ICYmICF0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0WCA9IHN0YXJ0TG9jYXRpb24ucGFnZVg7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnRZID0gc3RhcnRMb2NhdGlvbi5wYWdlWTtcbiAgICAgICAgICAgICAgICB0aGlzLl9naG9zdFN0YXJ0WCA9IHRoaXMuX3N0YXJ0WDtcbiAgICAgICAgICAgICAgICB0aGlzLl9naG9zdFN0YXJ0WSA9IHRoaXMuX3N0YXJ0WTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUdob3N0KHRoaXMuX3N0YXJ0WCwgdGhpcy5fc3RhcnRZKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRMb2NhdGlvbihzdGFydExvY2F0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5pbUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAvLyBVc2Ugc2V0VGltZW91dCBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgc3VyZSB0aGF0IHRoZSBlbGVtZW50IGlzIHBvc2l0aW9uZWQgZmlyc3QgY29ycmVjdGx5IGlmIHRoZXJlIGlzIHN0YXJ0IGxvY2F0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gJ3RvcCwgbGVmdCc7XG4gICAgICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tQW5pbUFyZ3MgJiYgY3VzdG9tQW5pbUFyZ3MuZHVyYXRpb24gPyBjdXN0b21BbmltQXJncy5kdXJhdGlvbiArICdzJyA6IHRoaXMuZGVmYXVsdFJldHVybkR1cmF0aW9uIDtcbiAgICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudC5zdHlsZS50cmFuc2l0aW9uVGltaW5nRnVuY3Rpb24gPVxuICAgICAgICAgICAgICAgICAgICBjdXN0b21BbmltQXJncyAmJiBjdXN0b21BbmltQXJncy50aW1pbmdGdW5jdGlvbiA/IGN1c3RvbUFuaW1BcmdzLnRpbWluZ0Z1bmN0aW9uIDogJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gY3VzdG9tQW5pbUFyZ3MgJiYgY3VzdG9tQW5pbUFyZ3MuZGVsYXkgPyBjdXN0b21BbmltQXJncy5kZWxheSArICdzJyA6ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYXRpb24obmV3IElneERyYWdMb2NhdGlvbih0aGlzLmJhc2VMZWZ0LCB0aGlzLmJhc2VUb3ApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ2hvc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPVxuICAgICAgICAgICAgICAgICAgICBjdXN0b21BbmltQXJncyAmJiBjdXN0b21BbmltQXJncy5kdXJhdGlvbiA/IGN1c3RvbUFuaW1BcmdzLmR1cmF0aW9uICsgJ3MnIDogdGhpcy5kZWZhdWx0UmV0dXJuRHVyYXRpb24gO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbUFuaW1BcmdzICYmIGN1c3RvbUFuaW1BcmdzLnRpbWluZ0Z1bmN0aW9uID8gY3VzdG9tQW5pbUFyZ3MudGltaW5nRnVuY3Rpb24gOiAnJztcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBjdXN0b21BbmltQXJncyAmJiBjdXN0b21BbmltQXJncy5kZWxheSA/IGN1c3RvbUFuaW1BcmdzLmRlbGF5ICsgJ3MnIDogJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnRYID0gdGhpcy5iYXNlTGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGFydFkgPSB0aGlzLmJhc2VUb3A7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1YWSgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5pbWF0ZXMgdGhlIGJhc2Ugb3IgZ2hvc3QgZWxlbWVudCB0byBhIHNwZWNpZmljIHRhcmdldCBsb2NhdGlvbiBvciBvdGhlciBlbGVtZW50IHVzaW5nIHRyYW5zaXRpb24uXG4gICAgICogSWYgYGdob3N0YCBpcyB0cnVlIGJ1dCB0aGVyZSBpcyBub3QgZ2hvc3QgcmVuZGVyZWQsIGl0IHdpbGwgYmUgY3JlYXRlZCBhbmQgYW5pbWF0ZWQuXG4gICAgICogSXQgaXMgcmVjb21tZW5kZWQgdG8gdXNlICdnZXRCb3VuZGluZ0NsaWVudFJlY3RzKCkgKyBwYWdlU2Nyb2xsJyB3aGVuIGRldGVybWluaW5nIGRlc2lyZWQgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRhcmdldCB0aGF0IHRoZSBiYXNlIG9yIGdob3N0IHdpbGwgdHJhbnNpdGlvbiB0by4gSXQgY2FuIGJlIGVpdGhlciBsb2NhdGlvbiBpbiB0aGUgcGFnZSBvciBhbm90aGVyIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gY3VzdG9tQW5pbUFyZ3MgQ3VzdG9tIHRyYW5zaXRpb24gcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgYXBwbGllZCB3aGVuIHBlcmZvcm1pbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICogQHBhcmFtIHN0YXJ0TG9jYXRpb24gU3RhcnQgbG9jYXRpb24gZnJvbSB3aGVyZSB0aGUgdHJhbnNpdGlvbiBzaG91bGQgc3RhcnQuXG4gICAgICovXG4gICAgcHVibGljIHRyYW5zaXRpb25Ubyh0YXJnZXQ6IElneERyYWdMb2NhdGlvbiB8IEVsZW1lbnRSZWYsIGN1c3RvbUFuaW1BcmdzPzogSURyYWdDdXN0b21UcmFuc2l0aW9uQXJncywgc3RhcnRMb2NhdGlvbj86IElneERyYWdMb2NhdGlvbikge1xuICAgICAgICBpZiAoISFzdGFydExvY2F0aW9uICYmIHRoaXMuZ2hvc3QgJiYgIXRoaXMuZ2hvc3RFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFggPSBzdGFydExvY2F0aW9uLnBhZ2VYO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRZID0gc3RhcnRMb2NhdGlvbi5wYWdlWTtcbiAgICAgICAgICAgIHRoaXMuX2dob3N0U3RhcnRYID0gdGhpcy5fc3RhcnRYO1xuICAgICAgICAgICAgdGhpcy5fZ2hvc3RTdGFydFkgPSB0aGlzLl9zdGFydFk7XG4gICAgICAgIH0gZWxzZSBpZiAoISFzdGFydExvY2F0aW9uICYmICghdGhpcy5naG9zdCB8fCB0aGlzLmdob3N0RWxlbWVudCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYXRpb24oc3RhcnRMb2NhdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5naG9zdCAmJiAhdGhpcy5naG9zdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0WCA9IHRoaXMuYmFzZUxlZnQ7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFkgPSB0aGlzLmJhc2VUb3A7XG4gICAgICAgICAgICB0aGlzLl9naG9zdFN0YXJ0WCA9IHRoaXMuX3N0YXJ0WCArIHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgdGhpcy5fZ2hvc3RTdGFydFkgPSB0aGlzLl9zdGFydFkgKyB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2hvc3QgJiYgIXRoaXMuZ2hvc3RFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUdob3N0KHRoaXMuX3N0YXJ0WCwgdGhpcy5fc3RhcnRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5pbUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAvLyBVc2Ugc2V0VGltZW91dCBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgc3VyZSB0aGF0IHRoZSBlbGVtZW50IGlzIHBvc2l0aW9uZWQgZmlyc3QgY29ycmVjdGx5IGlmIHRoZXJlIGlzIHN0YXJ0IGxvY2F0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vdmVkRWxlbSA9IHRoaXMuZ2hvc3QgPyB0aGlzLmdob3N0RWxlbWVudCA6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgbW92ZWRFbGVtLnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IHRoaXMuZ2hvc3QgJiYgdGhpcy5naG9zdEVsZW1lbnQgPyAnbGVmdCwgdG9wJyA6ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgbW92ZWRFbGVtLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9XG4gICAgICAgICAgICAgICAgY3VzdG9tQW5pbUFyZ3MgJiYgY3VzdG9tQW5pbUFyZ3MuZHVyYXRpb24gPyBjdXN0b21BbmltQXJncy5kdXJhdGlvbiArICdzJyA6IHRoaXMuZGVmYXVsdFJldHVybkR1cmF0aW9uIDtcbiAgICAgICAgICAgIG1vdmVkRWxlbS5zdHlsZS50cmFuc2l0aW9uVGltaW5nRnVuY3Rpb24gPVxuICAgICAgICAgICAgICAgIGN1c3RvbUFuaW1BcmdzICYmIGN1c3RvbUFuaW1BcmdzLnRpbWluZ0Z1bmN0aW9uID8gY3VzdG9tQW5pbUFyZ3MudGltaW5nRnVuY3Rpb24gOiAnJztcbiAgICAgICAgICAgIG1vdmVkRWxlbS5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBjdXN0b21BbmltQXJncyAmJiBjdXN0b21BbmltQXJncy5kZWxheSA/IGN1c3RvbUFuaW1BcmdzLmRlbGF5ICsgJ3MnIDogJyc7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJZ3hEcmFnTG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExvY2F0aW9uKG5ldyBJZ3hEcmFnTG9jYXRpb24gKHRhcmdldC5wYWdlWCwgdGFyZ2V0LnBhZ2VZKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFJlY3RzID0gdGFyZ2V0Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhdGlvbihuZXcgSWd4RHJhZ0xvY2F0aW9uKFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRSZWN0cy5sZWZ0IC0gIHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRSZWN0cy50b3AgLSB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBNZXRob2QgYm91bmQgdG8gdGhlIFBvaW50ZXJEb3duIGV2ZW50IG9mIHRoZSBiYXNlIGVsZW1lbnQgaWd4RHJhZyBpcyBpbml0aWFsaXplZC5cbiAgICAgKiBAcGFyYW0gZXZlbnQgUG9pbnRlckRvd24gZXZlbnQgY2FwdHVyZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25Qb2ludGVyRG93bihldmVudCkge1xuICAgICAgICBjb25zdCBpZ25vcmVkRWxlbWVudCA9IHRoaXMuZHJhZ0lnbm9yZWRFbGVtcy5maW5kKGVsZW0gPT4gZWxlbS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCk7XG4gICAgICAgIGlmIChpZ25vcmVkRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2xpY2tlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BvaW50ZXJEb3duSWQgPSBldmVudC5wb2ludGVySWQ7XG5cbiAgICAgICAgLy8gU2V0IHBvaW50ZXIgY2FwdHVyZSBzbyB3ZSBkZXRlY3QgcG9pbnRlcm1vdmUgZXZlbiBpZiBtb3VzZSBpcyBvdXQgb2YgYm91bmRzIHVudGlsIGdob3N0RWxlbWVudCBpcyBjcmVhdGVkLlxuICAgICAgICBjb25zdCBoYW5kbGVGb3VuZCA9IHRoaXMuZHJhZ0hhbmRsZXMuZmluZChoYW5kbGUgPT4gaGFuZGxlLmVsZW1lbnQubmF0aXZlRWxlbWVudCA9PT0gZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBoYW5kbGVGb3VuZCA/IGhhbmRsZUZvdW5kLmVsZW1lbnQubmF0aXZlRWxlbWVudCA6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpZiAodGhpcy5wb2ludGVyRXZlbnRzRW5hYmxlZCkge1xuICAgICAgICAgICAgdGFyZ2V0RWxlbWVudC5zZXRQb2ludGVyQ2FwdHVyZSh0aGlzLl9wb2ludGVyRG93bklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wb2ludGVyRXZlbnRzRW5hYmxlZCB8fCAhdGhpcy50b3VjaEV2ZW50c0VuYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGZpcnN0IGZvciBwb2ludGVyIGV2ZW50cyBvciBub24gdG91Y2gsIGJlY2F1c2Ugd2UgY2FuIGhhdmUgcG9pbnRlciBldmVudHMgYW5kIHRvdWNoIGV2ZW50cyBhdCBvbmNlLlxuICAgICAgICAgICAgdGhpcy5fc3RhcnRYID0gZXZlbnQucGFnZVg7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFkgPSBldmVudC5wYWdlWTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnRvdWNoRXZlbnRzRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kZWZhdWx0T2Zmc2V0WCA9IHRoaXMuYmFzZUxlZnQgLSB0aGlzLl9zdGFydFggKyB0aGlzLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdE9mZnNldFkgPSB0aGlzLmJhc2VUb3AgLSB0aGlzLl9zdGFydFkgKyB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICB0aGlzLl9naG9zdFN0YXJ0WCA9IHRoaXMuX3N0YXJ0WCArIHRoaXMuZ2hvc3RPZmZzZXRYO1xuICAgICAgICB0aGlzLl9naG9zdFN0YXJ0WSA9IHRoaXMuX3N0YXJ0WSArIHRoaXMuZ2hvc3RPZmZzZXRZO1xuICAgICAgICB0aGlzLl9sYXN0WCA9IHRoaXMuX3N0YXJ0WDtcbiAgICAgICAgdGhpcy5fbGFzdFkgPSB0aGlzLl9zdGFydFk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIFBlcmZvcm0gZHJhZyBtb3ZlIGxvZ2ljIHdoZW4gZHJhZ2dpbmcgYW5kIGRpc3BhdGNoaW5nIGV2ZW50cyBpZiB0aGVyZSBpcyBpZ3hEcm9wIHVuZGVyIHRoZSBwb2ludGVyLlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGJvdW5kIGF0IGZpcnN0IGF0IHRoZSBiYXNlIGVsZW1lbnQuXG4gICAgICogSWYgZHJhZ2dpbmcgc3RhcnRzIGFuZCBhZnRlciB0aGUgZ2hvc3RFbGVtZW50IGlzIHJlbmRlcmVkIHRoZSBwb2ludGVySWQgaXMgcmVhc3NpZ25lZCBpdC4gVGhlbiB0aGlzIG1ldGhvZCBpcyBib3VuZCB0byBpdC5cbiAgICAgKiBAcGFyYW0gZXZlbnQgUG9pbnRlck1vdmUgZXZlbnQgY2FwdHVyZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25Qb2ludGVyTW92ZShldmVudCkge1xuICAgICAgICBpZiAodGhpcy5fY2xpY2tlZCkge1xuICAgICAgICAgICAgbGV0IHBhZ2VYOyBsZXQgcGFnZVk7XG4gICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyRXZlbnRzRW5hYmxlZCB8fCAhdGhpcy50b3VjaEV2ZW50c0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmaXJzdCBmb3IgcG9pbnRlciBldmVudHMgb3Igbm9uIHRvdWNoLCBiZWNhdXNlIHdlIGNhbiBoYXZlIHBvaW50ZXIgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMgYXQgb25jZS5cbiAgICAgICAgICAgICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICAgICAgICAgIHBhZ2VZID0gZXZlbnQucGFnZVk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG91Y2hFdmVudHNFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcGFnZVggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgICAgICAgICAgIHBhZ2VZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWTtcblxuICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIG9uIHRvdWNoIHdoaWxlIGRyYWdnaW5nXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG90YWxNb3ZlZFggPSBwYWdlWCAtIHRoaXMuX3N0YXJ0WDtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsTW92ZWRZID0gcGFnZVkgLSB0aGlzLl9zdGFydFk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RyYWdTdGFydGVkICYmXG4gICAgICAgICAgICAgICAgKE1hdGguYWJzKHRvdGFsTW92ZWRYKSA+IHRoaXMuZHJhZ1RvbGVyYW5jZSB8fCBNYXRoLmFicyh0b3RhbE1vdmVkWSkgPiB0aGlzLmRyYWdUb2xlcmFuY2UpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZHJhZ1N0YXJ0QXJnczogSURyYWdTdGFydEV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBzdGFydFg6IHBhZ2VYIC0gdG90YWxNb3ZlZFgsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WTogcGFnZVkgLSB0b3RhbE1vdmVkWSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVgsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VZLFxuICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQuZW1pdChkcmFnU3RhcnRBcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghZHJhZ1N0YXJ0QXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5naG9zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgbW92ZWQgZW5vdWdoIHNvIGdob3N0RWxlbWVudCBjYW4gYmUgcmVuZGVyZWQgYW5kIGFjdHVhbCBkcmFnZ2luZyB0byBzdGFydC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gY3JlYXRpbmcgaXQgd2lsbCB0YWtlIGludG8gYWNjb3VudCBhbnkgb2Zmc2V0IHNldCBieSB0aGUgdXNlciBieSBkZWZhdWx0LlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVHaG9zdChwYWdlWCwgcGFnZVkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX29mZnNldFggIT09IHVuZGVmaW5lZCB8fCB0aGlzLl9vZmZzZXRZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIG5lZWQgZm9yIGdob3N0LCBidXQgd2Ugd2lsbCBuZWVkIHRvIHBvc2l0aW9uIGluaXRpYWxseSB0aGUgYmFzZSBlbGVtZW50IHRvIHJlZmxlY3QgYW55IG9mZnNldC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVggPSAodGhpcy5fb2Zmc2V0WCAhPT0gdW5kZWZpbmVkID8gdGhpcy5fb2Zmc2V0WCAtIHRoaXMuX2RlZmF1bHRPZmZzZXRYIDogMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0VHJhbnNmb3JtWCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1ZID0gKHRoaXMuX29mZnNldFkgIT09IHVuZGVmaW5lZCA/IHRoaXMuX29mZnNldFkgLSB0aGlzLl9kZWZhdWx0T2Zmc2V0WSA6IDApICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFRyYW5zZm9ybVkodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2Zvcm1YWSh0cmFuc2Zvcm1YLCB0cmFuc2Zvcm1ZKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9kcmFnU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbW92ZUFyZ3M6IElEcmFnTW92ZUV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgICAgICBzdGFydFg6IHRoaXMuX3N0YXJ0WCxcbiAgICAgICAgICAgICAgICBzdGFydFk6IHRoaXMuX3N0YXJ0WSxcbiAgICAgICAgICAgICAgICBwYWdlWDogdGhpcy5fbGFzdFgsXG4gICAgICAgICAgICAgICAgcGFnZVk6IHRoaXMuX2xhc3RZLFxuICAgICAgICAgICAgICAgIG5leHRQYWdlWDogcGFnZVgsXG4gICAgICAgICAgICAgICAgbmV4dFBhZ2VZOiBwYWdlWSxcbiAgICAgICAgICAgICAgICBjYW5jZWw6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kcmFnTW92ZS5lbWl0KG1vdmVBcmdzKTtcblxuICAgICAgICAgICAgY29uc3Qgc2V0UGFnZVggPSBtb3ZlQXJncy5uZXh0UGFnZVg7XG4gICAgICAgICAgICBjb25zdCBzZXRQYWdlWSA9IG1vdmVBcmdzLm5leHRQYWdlWTtcbiAgICAgICAgICAgIGlmICghbW92ZUFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2hvc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZFRvdGFsTW92ZWRYID0gdGhpcy5kcmFnRGlyZWN0aW9uID09PSBEcmFnRGlyZWN0aW9uLlZFUlRJQ0FMID8gMCA6IHNldFBhZ2VYIC0gdGhpcy5fc3RhcnRYO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cGRhdGVkVG90YWxNb3ZlZFkgPSB0aGlzLmRyYWdEaXJlY3Rpb24gPT09IERyYWdEaXJlY3Rpb24uSE9SSVpPTlRBTCA/IDAgOiBzZXRQYWdlWSAtIHRoaXMuX3N0YXJ0WTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naG9zdExlZnQgPSB0aGlzLl9naG9zdFN0YXJ0WCArIHVwZGF0ZWRUb3RhbE1vdmVkWDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naG9zdFRvcCA9IHRoaXMuX2dob3N0U3RhcnRZICsgdXBkYXRlZFRvdGFsTW92ZWRZO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RNb3ZlZFggPSB0aGlzLmRyYWdEaXJlY3Rpb24gPT09IERyYWdEaXJlY3Rpb24uVkVSVElDQUwgPyAwIDogc2V0UGFnZVggLSB0aGlzLl9sYXN0WDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdE1vdmVkWSA9IHRoaXMuZHJhZ0RpcmVjdGlvbiA9PT0gRHJhZ0RpcmVjdGlvbi5IT1JJWk9OVEFMID8gMCA6IHNldFBhZ2VZIC0gdGhpcy5fbGFzdFk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZVggPSB0aGlzLmdldFRyYW5zZm9ybVgodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpICsgbGFzdE1vdmVkWDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlWSA9IHRoaXMuZ2V0VHJhbnNmb3JtWSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCkgKyBsYXN0TW92ZWRZO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRyYW5zZm9ybVhZKHRyYW5zbGF0ZVgsIHRyYW5zbGF0ZVkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRHJhZ0V2ZW50cyhwYWdlWCwgcGFnZVksIGV2ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbGFzdFggPSBzZXRQYWdlWDtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RZID0gc2V0UGFnZVk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogUGVyZm9ybSBkcmFnIGVuZCBsb2dpYyB3aGVuIHJlbGVhc2luZyB0aGUgZ2hvc3RFbGVtZW50IGFuZCBkaXNwYXRjaGluZyBkcm9wIGV2ZW50IGlmIGlneERyb3AgaXMgdW5kZXIgdGhlIHBvaW50ZXIuXG4gICAgICogVGhpcyBtZXRob2QgaXMgYm91bmQgYXQgZmlyc3QgYXQgdGhlIGJhc2UgZWxlbWVudC5cbiAgICAgKiBJZiBkcmFnZ2luZyBzdGFydHMgYW5kIGFmdGVyIHRoZSBnaG9zdEVsZW1lbnQgaXMgcmVuZGVyZWQgdGhlIHBvaW50ZXJJZCBpcyByZWFzc2lnbmVkIHRvIGl0LiBUaGVuIHRoaXMgbWV0aG9kIGlzIGJvdW5kIHRvIGl0LlxuICAgICAqIEBwYXJhbSBldmVudCBQb2ludGVyVXAgZXZlbnQgY2FwdHVyZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25Qb2ludGVyVXAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jbGlja2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFnZVg7IGxldCBwYWdlWTtcbiAgICAgICAgaWYgKHRoaXMucG9pbnRlckV2ZW50c0VuYWJsZWQgfHwgIXRoaXMudG91Y2hFdmVudHNFbmFibGVkKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBmaXJzdCBmb3IgcG9pbnRlciBldmVudHMgb3Igbm9uIHRvdWNoLCBiZWNhdXNlIHdlIGNhbiBoYXZlIHBvaW50ZXIgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMgYXQgb25jZS5cbiAgICAgICAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVg7XG4gICAgICAgICAgICBwYWdlWSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG91Y2hFdmVudHNFbmFibGVkKSB7XG4gICAgICAgICAgICBwYWdlWCA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICBwYWdlWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XG5cbiAgICAgICAgICAgIC8vIFByZXZlbnQgc2Nyb2xsaW5nIG9uIHRvdWNoIHdoaWxlIGRyYWdnaW5nXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnRBcmdzOiBJRHJhZ0Jhc2VFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgc3RhcnRYOiB0aGlzLl9zdGFydFgsXG4gICAgICAgICAgICBzdGFydFk6IHRoaXMuX3N0YXJ0WSxcbiAgICAgICAgICAgIHBhZ2VYLFxuICAgICAgICAgICAgcGFnZVlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcG9pbnRlckRvd25JZCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2RyYWdTdGFydGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGFzdERyb3BBcmVhICYmIHRoaXMuX2xhc3REcm9wQXJlYSAhPT0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaERyb3BFdmVudChldmVudC5wYWdlWCwgZXZlbnQucGFnZVksIGV2ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoZXZlbnRBcmdzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYW5pbUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkVuZChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgb3VyIG93biBjbGljayBldmVudCBiZWNhdXNlIHdoZW4gdGhlcmUgaXMgbm8gZ2hvc3QsIG5hdGl2ZSBjbGljayBjYW5ub3QgYmUgcHJldmVudGVkIHdoZW4gZHJhZ2dpbmcuXG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdDbGljay5lbWl0KGV2ZW50QXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBFeGVjdXRlIHRoaXMgbWV0aG9kIHdoZSB0aGUgcG9pbnRlciBjYXB0dXJlIGhhcyBiZWVuIGxvc3QuXG4gICAgICogVGhpcyBtZWFucyB0aGF0IGR1cmluZyBkcmFnZ2luZyB0aGUgdXNlciBoYXMgcGVyZm9ybWVkIG90aGVyIGFjdGlvbiBsaWtlIHJpZ2h0IGNsaWNraW5nIGFuZCB0aGVuIGNsaWNraW5nIHNvbWV3aGVyZSBlbHNlLlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgZW5zdXJlIHRoYXQgdGhlIGRyYWcgc3RhdGUgaXMgYmVpbmcgcmVzZXQgaW4gdGhpcyBjYXNlIGFzIGlmIHRoZSB1c2VyIHJlbGVhc2VkIHRoZSBkcmFnZ2VkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGV2ZW50IEV2ZW50IGNhcHR1cmVkXG4gICAgICovXG4gICAgcHVibGljIG9uUG9pbnRlckxvc3QoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jbGlja2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgc3RhcnRYOiB0aGlzLl9zdGFydFgsXG4gICAgICAgICAgICBzdGFydFk6IHRoaXMuX3N0YXJ0WSxcbiAgICAgICAgICAgIHBhZ2VYOiBldmVudC5wYWdlWCxcbiAgICAgICAgICAgIHBhZ2VZOiBldmVudC5wYWdlWVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9wb2ludGVyRG93bklkID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY2xpY2tlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5fZHJhZ1N0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0VuZC5lbWl0KGV2ZW50QXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghdGhpcy5hbmltSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHRoaXMub25UcmFuc2l0aW9uRW5kKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBvblRyYW5zaXRpb25FbmQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCghdGhpcy5fZHJhZ1N0YXJ0ZWQgJiYgIXRoaXMuYW5pbUluUHJvZ3Jlc3MpIHx8IHRoaXMuX2NsaWNrZWQpIHtcbiAgICAgICAgICAgIC8vIFJldHVybiBpZiBubyBkcmFnZ2luZyBzdGFydGVkIGFuZCB0aGVyZSBpcyBubyBhbmltYXRpb24gaW4gcHJvZ3Jlc3MuXG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2hvc3QgJiYgdGhpcy5naG9zdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2dob3N0U3RhcnRYID0gdGhpcy5iYXNlTGVmdCArIHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgdGhpcy5fZ2hvc3RTdGFydFkgPSB0aGlzLmJhc2VUb3AgKyB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICBjb25zdCBnaG9zdERlc3Ryb3lBcmdzOiBJRHJhZ0dob3N0QmFzZUV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgICAgICBnaG9zdEVsZW1lbnQ6IHRoaXMuZ2hvc3RFbGVtZW50LFxuICAgICAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmdob3N0RGVzdHJveS5lbWl0KGdob3N0RGVzdHJveUFyZ3MpO1xuICAgICAgICAgICAgaWYgKGdob3N0RGVzdHJveUFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdob3N0RWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5fZHluYW1pY0dob3N0UmVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZHluYW1pY0dob3N0UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9keW5hbWljR2hvc3RSZWYgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmdob3N0KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwLjBzJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbiA9ICcnO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kcmFnU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIEV4ZWN1dGUgdHJhbnNpdGlvbmVkIGFmdGVyIGV2ZXJ5dGhpbmcgaXMgcmVzZXQgc28gaWYgdGhlIHVzZXIgc2V0cyBuZXcgbG9jYXRpb24gb24gdGhlIGJhc2Ugbm93IGl0IHdvdWxkIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgc3RhcnRYOiB0aGlzLl9zdGFydFgsXG4gICAgICAgICAgICAgICAgc3RhcnRZOiB0aGlzLl9zdGFydFksXG4gICAgICAgICAgICAgICAgcGFnZVg6IHRoaXMuX3N0YXJ0WCxcbiAgICAgICAgICAgICAgICBwYWdlWTogdGhpcy5fc3RhcnRZXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIENyZWF0ZSBnaG9zdCBlbGVtZW50IC0gaWYgYSBOb2RlIG9iamVjdCBpcyBwcm92aWRlZCBpdCBjcmVhdGVzIGEgY2xvbmUgb2YgdGhhdCBub2RlLFxuICAgICAqIG90aGVyd2lzZSBpdCBjbG9uZXMgdGhlIGhvc3QgZWxlbWVudC5cbiAgICAgKiBCaW5kIGFsbCBuZWVkZWQgZXZlbnRzLlxuICAgICAqIEBwYXJhbSBwYWdlWCBMYXRlc3QgcG9pbnRlciBwb3NpdGlvbiBvbiB0aGUgWCBheGlzIHJlbGF0aXZlIHRvIHRoZSBwYWdlLlxuICAgICAqIEBwYXJhbSBwYWdlWSBMYXRlc3QgcG9pbnRlciBwb3NpdGlvbiBvbiB0aGUgWSBheGlzIHJlbGF0aXZlIHRvIHRoZSBwYWdlLlxuICAgICAqIEBwYXJhbSBub2RlIFRoZSBOb2RlIG9iamVjdCB0byBiZSBjbG9uZWQuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUdob3N0KHBhZ2VYLCBwYWdlWSwgbm9kZTogYW55ID0gbnVsbCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2hvc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdob3N0VGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2R5bmFtaWNHaG9zdFJlZiA9IHRoaXMudmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5naG9zdFRlbXBsYXRlLCB0aGlzLmdob3N0Q29udGV4dCk7XG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IHRoaXMuX2R5bmFtaWNHaG9zdFJlZi5yb290Tm9kZXNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IG5vZGUgPyBub2RlLmNsb25lTm9kZSh0cnVlKSA6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvdGFsTW92ZWRYID0gcGFnZVggLSB0aGlzLl9zdGFydFg7XG4gICAgICAgIGNvbnN0IHRvdGFsTW92ZWRZID0gcGFnZVkgLSB0aGlzLl9zdGFydFk7XG4gICAgICAgIHRoaXMuX2dob3N0SG9zdFggPSB0aGlzLmdob3N0SG9zdCA/IHRoaXMuZ2hvc3RIb3N0T2Zmc2V0TGVmdCh0aGlzLmdob3N0SG9zdCkgOiAwO1xuICAgICAgICB0aGlzLl9naG9zdEhvc3RZID0gdGhpcy5naG9zdEhvc3QgPyB0aGlzLmdob3N0SG9zdE9mZnNldFRvcCh0aGlzLmdob3N0SG9zdCkgOiAwO1xuXG4gICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwLjBzJztcbiAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuZ2hvc3RDbGFzcykge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmdob3N0RWxlbWVudCwgdGhpcy5naG9zdENsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNyZWF0ZUV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgZ2hvc3RFbGVtZW50OiB0aGlzLmdob3N0RWxlbWVudCxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5naG9zdENyZWF0ZS5lbWl0KGNyZWF0ZUV2ZW50QXJncyk7XG4gICAgICAgIGlmIChjcmVhdGVFdmVudEFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdFRlbXBsYXRlICYmIHRoaXMuX2R5bmFtaWNHaG9zdFJlZikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2R5bmFtaWNHaG9zdFJlZi5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5naG9zdEhvc3QpIHtcbiAgICAgICAgICAgIHRoaXMuZ2hvc3RIb3N0LmFwcGVuZENoaWxkKHRoaXMuZ2hvc3RFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5naG9zdEVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2hvc3RNYXJnaW5MZWZ0ID0gcGFyc2VJbnQoZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmdob3N0RWxlbWVudClbJ21hcmdpbi1sZWZ0J10sIDEwKTtcbiAgICAgICAgY29uc3QgZ2hvc3RNYXJnaW5Ub3AgPSBwYXJzZUludChkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZ2hvc3RFbGVtZW50KVsnbWFyZ2luLXRvcCddLCAxMCk7XG4gICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSAodGhpcy5fZ2hvc3RTdGFydFggLSBnaG9zdE1hcmdpbkxlZnQgKyB0b3RhbE1vdmVkWCAtIHRoaXMuX2dob3N0SG9zdFgpICsgJ3B4JztcbiAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuc3R5bGUudG9wID0gKHRoaXMuX2dob3N0U3RhcnRZIC0gZ2hvc3RNYXJnaW5Ub3AgKyB0b3RhbE1vdmVkWSAtIHRoaXMuX2dob3N0SG9zdFgpICsgJ3B4JztcblxuICAgICAgICBpZiAodGhpcy5wb2ludGVyRXZlbnRzRW5hYmxlZCkge1xuICAgICAgICAgICAgLy8gVGhlIGdob3N0RWxlbWVudCB0YWtlcyBjb250cm9sIGZvciBtb3ZpbmcgYW5kIGRyYWdnaW5nIGFmdGVyIGl0IGhhcyBiZWVuIHJlbmRlcmVkLlxuICAgICAgICAgICAgaWYgKHRoaXMuX3BvaW50ZXJEb3duSWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudC5zZXRQb2ludGVyQ2FwdHVyZSh0aGlzLl9wb2ludGVyRG93bklkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgKGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUG9pbnRlck1vdmUoYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIChhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblBvaW50ZXJVcChhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9zdHBvaW50ZXJjYXB0dXJlJywgKGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUG9pbnRlckxvc3QoYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRyYW5zaXRpb24gYW5pbWF0aW9uIHdoZW4gdGhlIGdob3N0RWxlbWVudCBpcyByZWxlYXNlZCBhbmQgaXQgcmV0dXJucyB0byBpdCdzIG9yaWdpbmFsIHBvc2l0aW9uLlxuICAgICAgICB0aGlzLmdob3N0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25UcmFuc2l0aW9uRW5kKGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIERpc3BhdGNoIGN1c3RvbSBpZ3hEcmFnRW50ZXIvaWd4RHJhZ0xlYXZlIGV2ZW50cyBiYXNlZCBvbiBjdXJyZW50IHBvaW50ZXIgcG9zaXRpb24gYW5kIGlmIGRyb3AgYXJlYSBpcyB1bmRlci5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZGlzcGF0Y2hEcmFnRXZlbnRzKHBhZ2VYOiBudW1iZXIsIHBhZ2VZOiBudW1iZXIsIG9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgbGV0IHRvcERyb3BBcmVhO1xuICAgICAgICBjb25zdCBjdXN0b21FdmVudEFyZ3M6IElneERyYWdDdXN0b21FdmVudERldGFpbHMgPSB7XG4gICAgICAgICAgICBzdGFydFg6IHRoaXMuX3N0YXJ0WCxcbiAgICAgICAgICAgIHN0YXJ0WTogdGhpcy5fc3RhcnRZLFxuICAgICAgICAgICAgcGFnZVgsXG4gICAgICAgICAgICBwYWdlWSxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBlbGVtZW50c0Zyb21Qb2ludCA9IHRoaXMuZ2V0RWxlbWVudHNBdFBvaW50KHBhZ2VYLCBwYWdlWSk7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHNoYWRvd1Jvb3QgaW5zdGFuY2UgYW5kIHVzZSBpdCBpZiBwcmVzZW50XG4gICAgICAgIGZvciAoY29uc3QgZWxGcm9tUG9pbnQgb2YgZWxlbWVudHNGcm9tUG9pbnQpIHtcbiAgICAgICAgICAgIGlmICghIWVsRnJvbVBvaW50Py5zaGFkb3dSb290KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHNGcm9tUG9pbnQgPSBlbEZyb21Qb2ludC5zaGFkb3dSb290LmVsZW1lbnRzRnJvbVBvaW50KHBhZ2VYLCBwYWdlWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHNGcm9tUG9pbnQpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnZHJvcHBhYmxlJykgPT09ICd0cnVlJyAmJlxuICAgICAgICAgICAgZWxlbWVudCAhPT0gdGhpcy5naG9zdEVsZW1lbnQgJiYgZWxlbWVudCAhPT0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0b3BEcm9wQXJlYSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9wRHJvcEFyZWEgJiZcbiAgICAgICAgICAgICghdGhpcy5fbGFzdERyb3BBcmVhIHx8ICh0aGlzLl9sYXN0RHJvcEFyZWEgJiYgdGhpcy5fbGFzdERyb3BBcmVhICE9PSB0b3BEcm9wQXJlYSkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3REcm9wQXJlYSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fbGFzdERyb3BBcmVhLCAnaWd4RHJhZ0xlYXZlJywgY3VzdG9tRXZlbnRBcmdzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0RHJvcEFyZWEgPSB0b3BEcm9wQXJlYTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fbGFzdERyb3BBcmVhLCAnaWd4RHJhZ0VudGVyJywgY3VzdG9tRXZlbnRBcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRvcERyb3BBcmVhICYmIHRoaXMuX2xhc3REcm9wQXJlYSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9sYXN0RHJvcEFyZWEsICdpZ3hEcmFnTGVhdmUnLCBjdXN0b21FdmVudEFyZ3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3REcm9wQXJlYSA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3BEcm9wQXJlYSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHRvcERyb3BBcmVhLCAnaWd4RHJhZ092ZXInLCBjdXN0b21FdmVudEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIERpc3BhdGNoIGN1c3RvbSBpZ3hEcm9wIGV2ZW50IGJhc2VkIG9uIGN1cnJlbnQgcG9pbnRlciBwb3NpdGlvbiBpZiB0aGVyZSBpcyBsYXN0IHJlY29yZGVyIGRyb3AgYXJlYSB1bmRlciB0aGUgcG9pbnRlci5cbiAgICAgKiBMYXN0IHJlY29yZGVyIGRyb3AgYXJlYSBpcyB1cGRhdGVkIGluIEBkaXNwYXRjaERyYWdFdmVudHMgbWV0aG9kLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBkaXNwYXRjaERyb3BFdmVudChwYWdlWDogbnVtYmVyLCBwYWdlWTogbnVtYmVyLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGV2ZW50QXJnczogSWd4RHJhZ0N1c3RvbUV2ZW50RGV0YWlscyA9IHtcbiAgICAgICAgICAgIHN0YXJ0WDogdGhpcy5fc3RhcnRYLFxuICAgICAgICAgICAgc3RhcnRZOiB0aGlzLl9zdGFydFksXG4gICAgICAgICAgICBwYWdlWCxcbiAgICAgICAgICAgIHBhZ2VZLFxuICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX2xhc3REcm9wQXJlYSwgJ2lneERyb3AnLCBldmVudEFyZ3MpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fbGFzdERyb3BBcmVhLCAnaWd4RHJhZ0xlYXZlJywgZXZlbnRBcmdzKTtcbiAgICAgICAgdGhpcy5fbGFzdERyb3BBcmVhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEVsZW1lbnRzQXRQb2ludChwYWdlWDogbnVtYmVyLCBwYWdlWTogbnVtYmVyKSB7XG4gICAgICAgIC8vIGNvcnJlY3QgdGhlIGNvb3JkaW5hdGVzIHdpdGggdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uLCBiZWNhdXNlXG4gICAgICAgIC8vIGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50IGNvbnNpZGVyIHBvc2l0aW9uIHdpdGhpbiB0aGUgY3VycmVudCB2aWV3cG9ydFxuICAgICAgICAvLyB3aW5kb3cucGFnZVhPZmZzZXQgPT0gd2luZG93LnNjcm9sbFg7IC8vIGFsd2F5cyB0cnVlXG4gICAgICAgIC8vIHVzaW5nIHdpbmRvdy5wYWdlWE9mZnNldCBmb3IgSUU5IGNvbXBhdGliaWxpdHlcbiAgICAgICAgY29uc3Qgdmlld1BvcnRYID0gcGFnZVggLSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIGNvbnN0IHZpZXdQb3J0WSA9IHBhZ2VZIC0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICBpZiAoZG9jdW1lbnRbJ21zRWxlbWVudHNGcm9tUG9pbnQnXSkge1xuICAgICAgICAgICAgLy8gRWRnZSBhbmQgSUUgc3BlY2lhbCBzbm93Zmxha2VzXG4gICAgICAgICAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50Wydtc0VsZW1lbnRzRnJvbVBvaW50J10odmlld1BvcnRYLCB2aWV3UG9ydFkpO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRzID09PSBudWxsID8gW10gOiBlbGVtZW50cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyIGJyb3dzZXJzIGxpa2UgQ2hyb21lLCBGaXJlZm94LCBPcGVyYVxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KHZpZXdQb3J0WCwgdmlld1BvcnRZKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIGV2ZW50TmFtZTogc3RyaW5nLCBldmVudEFyZ3M6IElneERyYWdDdXN0b21FdmVudERldGFpbHMpIHtcbiAgICAgICAgLy8gVGhpcyB3YXkgaXMgSUUxMSBjb21wYXRpYmxlLlxuICAgICAgICBjb25zdCBkcmFnTGVhdmVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgICBkcmFnTGVhdmVFdmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCBmYWxzZSwgZmFsc2UsIGV2ZW50QXJncyk7XG4gICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGRyYWdMZWF2ZUV2ZW50KTtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGNhbiBiZSB1c2VkIGB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCBldmVudEFyZ3MpKTtgXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFRyYW5zZm9ybVgoZWxlbSkge1xuICAgICAgICBsZXQgcG9zWCA9IDA7XG4gICAgICAgIGlmIChlbGVtLnN0eWxlLnRyYW5zZm9ybSkge1xuICAgICAgICAgICAgY29uc3QgbWF0cml4ID0gZWxlbS5zdHlsZS50cmFuc2Zvcm07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBtYXRyaXggPyBtYXRyaXgubWF0Y2goLy0/W1xcZFxcLl0rL2cpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgcG9zWCA9IHZhbHVlcyA/IE51bWJlcih2YWx1ZXNbIDEgXSkgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBvc1g7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFRyYW5zZm9ybVkoZWxlbSkge1xuICAgICAgICBsZXQgcG9zWSA9IDA7XG4gICAgICAgIGlmIChlbGVtLnN0eWxlLnRyYW5zZm9ybSkge1xuICAgICAgICAgICAgY29uc3QgbWF0cml4ID0gZWxlbS5zdHlsZS50cmFuc2Zvcm07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBtYXRyaXggPyBtYXRyaXgubWF0Y2goLy0/W1xcZFxcLl0rL2cpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgcG9zWSA9IHZhbHVlcyA/IE51bWJlcih2YWx1ZXNbIDIgXSkgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBvc1k7XG4gICAgfVxuXG4gICAgLyoqIE1ldGhvZCBzZXR0aW5nIHRyYW5zZm9ybWF0aW9uIHRvIHRoZSBiYXNlIGRyYWdnYWJsZSBlbGVtZW50LiAqL1xuICAgIHByb3RlY3RlZCBzZXRUcmFuc2Zvcm1YWSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAncHgsICcgKyB5ICsgJ3B4LCAwcHgpJztcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0V2luZG93U2Nyb2xsVG9wKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnNjcm9sbFkgPyB3aW5kb3cuc2Nyb2xsWSA6ICh3aW5kb3cucGFnZVlPZmZzZXQgPyB3aW5kb3cucGFnZVlPZmZzZXQgOiAwKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0V2luZG93U2Nyb2xsTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zY3JvbGxYID8gd2luZG93LnNjcm9sbFggOiAod2luZG93LnBhZ2VYT2Zmc2V0ID8gd2luZG93LnBhZ2VYT2Zmc2V0IDogMCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdob3N0SG9zdE9mZnNldExlZnQoZ2hvc3RIb3N0OiBhbnkpIHtcbiAgICAgICAgY29uc3QgZ2hvc3RQb3NpdGlvbiA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZ2hvc3RIb3N0KS5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpO1xuICAgICAgICBpZiAoZ2hvc3RQb3NpdGlvbiA9PT0gJ3N0YXRpYycgJiYgZ2hvc3RIb3N0Lm9mZnNldFBhcmVudCAmJiBnaG9zdEhvc3Qub2Zmc2V0UGFyZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIGlmIChnaG9zdFBvc2l0aW9uID09PSAnc3RhdGljJyAmJiBnaG9zdEhvc3Qub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZ2hvc3RIb3N0Lm9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gdGhpcy5nZXRXaW5kb3dTY3JvbGxMZWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdob3N0SG9zdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gdGhpcy5nZXRXaW5kb3dTY3JvbGxMZWZ0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdob3N0SG9zdE9mZnNldFRvcChnaG9zdEhvc3Q6IGFueSkge1xuICAgICAgICBjb25zdCBnaG9zdFBvc2l0aW9uID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShnaG9zdEhvc3QpLmdldFByb3BlcnR5VmFsdWUoJ3Bvc2l0aW9uJyk7XG4gICAgICAgIGlmIChnaG9zdFBvc2l0aW9uID09PSAnc3RhdGljJyAmJiBnaG9zdEhvc3Qub2Zmc2V0UGFyZW50ICYmIGdob3N0SG9zdC5vZmZzZXRQYXJlbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2UgaWYgKGdob3N0UG9zaXRpb24gPT09ICdzdGF0aWMnICYmIGdob3N0SG9zdC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBnaG9zdEhvc3Qub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIHRoaXMuZ2V0V2luZG93U2Nyb2xsVG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdob3N0SG9zdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgZXhwb3J0QXM6ICdkcm9wJyxcbiAgICBzZWxlY3RvcjogJ1tpZ3hEcm9wXSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4RHJvcERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiAtIFNhdmUgZGF0YSBpbnNpZGUgdGhlIGBpZ3hEcm9wYCBkaXJlY3RpdmUuIFRoaXMgY2FuIGJlIHNldCB3aGVuIGluc3RhbmNpbmcgYGlneERyb3BgIG9uIGFuIGVsZW1lbnQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgW2lneERyb3BdPVwieyBzb3VyY2U6IG15RWxlbWVudCB9XCI+PC9kaXY+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJvcERpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgnaWd4RHJvcCcpXG4gICAgcHVibGljIHNldCBkYXRhKHY6IGFueSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgcHJvdmlkZSBhIHdheSBmb3IgaWd4RHJhZyBhbmQgaWd4RHJvcCB0byBiZSBsaW5rZWQgdGhyb3VnaCBjaGFubmVscy5cbiAgICAgKiBJdCBhY2NlcHRzIHNpbmdsZSB2YWx1ZSBvciBhbiBhcnJheSBvZiB2YWx1ZXMgYW5kIGV2YWx1YXRlcyB0aGVuIHVzaW5nIHN0cmljdCBlcXVhbGl0eS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hEcmFnIFtkcmFnQ2hhbm5lbF09XCInb2RkJ1wiPlxuICAgICAqICAgICAgICAgPHNwYW4+OTU8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogPGRpdiBpZ3hEcm9wIFtkcm9wQ2hhbm5lbF09XCJbJ29kZCcsICdpcnJhdGlvbmFsJ11cIj5cbiAgICAgKiAgICAgICAgIDxzcGFuPk51bWJlcnMgZHJvcCBhcmVhITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hEcm9wRGlyZWN0aXZlXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZHJvcENoYW5uZWw6IG51bWJlciB8IHN0cmluZyB8IG51bWJlcltdIHwgc3RyaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzcGVjaWZpZXMgYSBkcm9wIHN0cmF0ZWd5IHR5cGUgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gYW4gYElneERyYWdgIGVsZW1lbnQgaXMgcmVsZWFzZWQgaW5zaWRlXG4gICAgICogIHRoZSBjdXJyZW50IGRyb3AgYXJlYS4gVGhlIHByb3ZpZGVkIHN0cmF0ZWdpZXMgYXJlOlxuICAgICAqICAtIElneERlZmF1bHREcm9wU3RyYXRlZ3kgLSBUaGlzIGlzIHRoZSBkZWZhdWx0IGJhc2Ugc3RyYXRlZ3kgYW5kIGl0IGRvZXNuJ3QgcGVyZm9ybSBhbnkgYWN0aW9ucy5cbiAgICAgKiAgLSBJZ3hBcHBlbmREcm9wU3RyYXRlZ3kgLSBBcHBlbmRzIHRoZSBkcm9wcGVkIGVsZW1lbnQgdG8gbGFzdCBwb3NpdGlvbiBhcyBhIGRpcmVjdCBjaGlsZCB0byB0aGUgYGlneERyb3BgLlxuICAgICAqICAtIElneFByZXBlbmREcm9wU3RyYXRlZ3kgLSBQcmVwZW5kcyB0aGUgZHJvcHBlZCBlbGVtZW50IHRvIGZpcnN0IHBvc2l0aW9uIGFzIGEgZGlyZWN0IGNoaWxkIHRvIHRoZSBgaWd4RHJvcGAuXG4gICAgICogIC0gSWd4SW5zZXJ0RHJvcFN0cmF0ZWd5IC0gSWYgdGhlIGRyb3BwZWQgZWxlbWVudCBpcyByZWxlYXNlZCBhYm92ZSBhIGNoaWxkIGVsZW1lbnQgb2YgdGhlIGBpZ3hEcm9wYCwgaXQgd2lsbCBiZSBpbnNlcnRlZFxuICAgICAqICAgICAgYXQgdGhhdCBwb3NpdGlvbi4gT3RoZXJ3aXNlIHRoZSBkcm9wcGVkIGVsZW1lbnQgd2lsbCBiZSBhcHBlbmRlZCBpZiByZWxlYXNlZCBvdXRzaWRlIGFueSBjaGlsZCBvZiB0aGUgYGlneERyb3BgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneERyYWc+XG4gICAgICogICAgICA8c3Bhbj5EcmFnTWU8L3NwYW4+XG4gICAgICogPC9kaXY+XG4gICAgICogPGRpdiBpZ3hEcm9wIFtkcm9wU3RyYXRlZ3ldPVwibXlEcm9wU3RyYXRlZ3lcIj5cbiAgICAgKiAgICAgICAgIDxzcGFuPk51bWJlcnMgZHJvcCBhcmVhITwvc3Bhbj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogaW1wb3J0IHsgSWd4QXBwZW5kRHJvcFN0cmF0ZWd5IH0gZnJvbSAnaWduaXRldWktYW5ndWxhcic7XG4gICAgICpcbiAgICAgKiBleHBvcnQgY2xhc3MgQXBwIHtcbiAgICAgKiAgICAgIHB1YmxpYyBteURyb3BTdHJhdGVneSA9IElneEFwcGVuZERyb3BTdHJhdGVneTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJvcERpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBkcm9wU3RyYXRlZ3koY2xhc3NSZWY6IGFueSkge1xuICAgICAgICB0aGlzLl9kcm9wU3RyYXRlZ3kgPSBuZXcgY2xhc3NSZWYodGhpcy5fcmVuZGVyZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZHJvcFN0cmF0ZWd5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZHJvcFN0cmF0ZWd5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGRyYWdnZWQgZWxlbWVudCBlbnRlcnMgdGhlIGFyZWEgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgY2xhc3M9XCJjYWdlQXJlYVwiIGlneERyb3AgKGVudGVyKT1cImRyYWdFbnRlcigpXCIgKGlneERyYWdFbnRlcik9XCJvbkRyYWdDYWdlRW50ZXIoKVwiIChpZ3hEcmFnTGVhdmUpPVwib25EcmFnQ2FnZUxlYXZlKClcIj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGRyYWdFbnRlcigpe1xuICAgICAqICAgICBhbGVydChcIkEgZHJhZ2dhYmxlIGVsZW1lbnQgaGFzIGVudGVyZWQgdGhlIGNoaXAgYXJlYSFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyb3BEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPElEcm9wQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGRyYWdnZWQgZWxlbWVudCBlbnRlcnMgdGhlIGFyZWEgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgY2xhc3M9XCJjYWdlQXJlYVwiIGlneERyb3AgKGVudGVyKT1cImRyYWdFbnRlcigpXCIgKGlneERyYWdFbnRlcik9XCJvbkRyYWdDYWdlRW50ZXIoKVwiIChpZ3hEcmFnTGVhdmUpPVwib25EcmFnQ2FnZUxlYXZlKClcIj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGRyYWdFbnRlcigpe1xuICAgICAqICAgICBhbGVydChcIkEgZHJhZ2dhYmxlIGVsZW1lbnQgaGFzIGVudGVyZWQgdGhlIGNoaXAgYXJlYSFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneERyb3BEaXJlY3RpdmVcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8SURyb3BCYXNlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZHJhZ2dlZCBlbGVtZW50IGxlYXZlcyB0aGUgYXJlYSBvZiB0aGUgZWxlbWVudC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBjbGFzcz1cImNhZ2VBcmVhXCIgaWd4RHJvcCAobGVhdmUpPVwiZHJhZ0xlYXZlKClcIiAoaWd4RHJhZ0VudGVyKT1cIm9uRHJhZ0NhZ2VFbnRlcigpXCIgKGlneERyYWdMZWF2ZSk9XCJvbkRyYWdDYWdlTGVhdmUoKVwiPlxuICAgICAqIDwvZGl2PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgZHJhZ0xlYXZlKCl7XG4gICAgICogICAgIGFsZXJ0KFwiQSBkcmFnZ2FibGUgZWxlbWVudCBoYXMgbGVmdCB0aGUgY2hpcCBhcmVhIVwiKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RHJvcERpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBsZWF2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8SURyb3BCYXNlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZHJhZ2dlZCBlbGVtZW50IGlzIGRyb3BwZWQgaW4gdGhlIGFyZWEgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogU2luY2UgdGhlIGBpZ3hEcm9wYCBoYXMgZGVmYXVsdCBsb2dpYyB0aGF0IGFwcGVuZHMgdGhlIGRyb3BwZWQgZWxlbWVudCBhcyBhIGNoaWxkLCBpdCBjYW4gYmUgY2FuY2VsZWQgaGVyZS5cbiAgICAgKiBUbyBjYW5jZWwgdGhlIGRlZmF1bHQgbG9naWMgdGhlIGBjYW5jZWxgIHByb3BlcnR5IG9mIHRoZSBldmVudCBuZWVkcyB0byBiZSBzZXQgdG8gdHJ1ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBjbGFzcz1cImNhZ2VBcmVhXCIgaWd4RHJvcCAoZHJvcHBlZCk9XCJkcmFnRHJvcCgpXCIgKGlneERyYWdFbnRlcik9XCJvbkRyYWdDYWdlRW50ZXIoKVwiIChpZ3hEcmFnTGVhdmUpPVwib25EcmFnQ2FnZUxlYXZlKClcIj5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGRyYWdEcm9wKCl7XG4gICAgICogICAgIGFsZXJ0KFwiQSBkcmFnZ2FibGUgZWxlbWVudCBoYXMgYmVlbiBkcm9wcGVkIGluIHRoZSBjaGlwIGFyZWEhXCIpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hEcm9wRGlyZWN0aXZlXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGRyb3BwZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElEcm9wRHJvcHBlZEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuZHJvcHBhYmxlJylcbiAgICBwdWJsaWMgZHJvcHBhYmxlID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRyYWdPdmVyJylcbiAgICBwdWJsaWMgZHJhZ292ZXIgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICAgIHByb3RlY3RlZCBfZHJvcFN0cmF0ZWd5OiBJRHJvcFN0cmF0ZWd5O1xuXG4gICAgcHJpdmF0ZSBfZGF0YTogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkge1xuICAgICAgICB0aGlzLl9kcm9wU3RyYXRlZ3kgPSBuZXcgSWd4RGVmYXVsdERyb3BTdHJhdGVneSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdpZ3hEcm9wJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25EcmFnRHJvcChldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNEcmFnTGlua2VkKGV2ZW50LmRldGFpbC5vd25lcikpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRQb3NYID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICBjb25zdCBlbGVtZW50UG9zWSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHRoaXMuZ2V0V2luZG93U2Nyb2xsVG9wKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBldmVudC5kZXRhaWwucGFnZVggLSBlbGVtZW50UG9zWDtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGV2ZW50LmRldGFpbC5wYWdlWSAtIGVsZW1lbnRQb3NZO1xuICAgICAgICBjb25zdCBhcmdzOiBJRHJvcERyb3BwZWRFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LmRldGFpbC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICAgICAgZHJhZzogZXZlbnQuZGV0YWlsLm93bmVyLFxuICAgICAgICAgICAgZHJhZ0RhdGE6IGV2ZW50LmRldGFpbC5vd25lci5kYXRhLFxuICAgICAgICAgICAgc3RhcnRYOiBldmVudC5kZXRhaWwuc3RhcnRYLFxuICAgICAgICAgICAgc3RhcnRZOiBldmVudC5kZXRhaWwuc3RhcnRZLFxuICAgICAgICAgICAgcGFnZVg6IGV2ZW50LmRldGFpbC5wYWdlWCxcbiAgICAgICAgICAgIHBhZ2VZOiBldmVudC5kZXRhaWwucGFnZVksXG4gICAgICAgICAgICBvZmZzZXRYLFxuICAgICAgICAgICAgb2Zmc2V0WSxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcm9wcGVkLmVtaXQoYXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9kcm9wU3RyYXRlZ3kgJiYgIWFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50c0F0UG9pbnQgPSBldmVudC5kZXRhaWwub3duZXIuZ2V0RWxlbWVudHNBdFBvaW50KGV2ZW50LmRldGFpbC5wYWdlWCwgZXZlbnQuZGV0YWlsLnBhZ2VZKTtcbiAgICAgICAgICAgIGNvbnN0IGluc2VydEluZGV4ID0gdGhpcy5nZXRJbnNlcnRJbmRleEF0KGV2ZW50LmRldGFpbC5vd25lciwgZWxlbWVudHNBdFBvaW50KTtcbiAgICAgICAgICAgIHRoaXMuX2Ryb3BTdHJhdGVneS5kcm9wQWN0aW9uKGV2ZW50LmRldGFpbC5vd25lciwgdGhpcywgaW5zZXJ0SW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdpZ3hEcmFnRW50ZXInKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25EcmFnRW50ZXIocmVzIGFzIEN1c3RvbUV2ZW50PElneERyYWdDdXN0b21FdmVudERldGFpbHM+KSk7XG5cbiAgICAgICAgICAgIGZyb21FdmVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2lneERyYWdMZWF2ZScpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKHJlcykgPT4gdGhpcy5vbkRyYWdMZWF2ZShyZXMpKTtcbiAgICAgICAgICAgIGZyb21FdmVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2lneERyYWdPdmVyJykucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgocmVzKSA9PiB0aGlzLm9uRHJhZ092ZXIocmVzKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnT3ZlcihldmVudCkge1xuICAgICAgICBjb25zdCBlbGVtZW50UG9zWCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyB0aGlzLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgY29uc3QgZWxlbWVudFBvc1kgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gZXZlbnQuZGV0YWlsLnBhZ2VYIC0gZWxlbWVudFBvc1g7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBldmVudC5kZXRhaWwucGFnZVkgLSBlbGVtZW50UG9zWTtcbiAgICAgICAgY29uc3QgZXZlbnRBcmdzOiBJRHJvcEJhc2VFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudC5kZXRhaWwub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgZHJhZzogZXZlbnQuZGV0YWlsLm93bmVyLFxuICAgICAgICAgICAgZHJhZ0RhdGE6IGV2ZW50LmRldGFpbC5vd25lci5kYXRhLFxuICAgICAgICAgICAgc3RhcnRYOiBldmVudC5kZXRhaWwuc3RhcnRYLFxuICAgICAgICAgICAgc3RhcnRZOiBldmVudC5kZXRhaWwuc3RhcnRZLFxuICAgICAgICAgICAgcGFnZVg6IGV2ZW50LmRldGFpbC5wYWdlWCxcbiAgICAgICAgICAgIHBhZ2VZOiBldmVudC5kZXRhaWwucGFnZVksXG4gICAgICAgICAgICBvZmZzZXRYLFxuICAgICAgICAgICAgb2Zmc2V0WVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMub3Zlci5lbWl0KGV2ZW50QXJncyk7XG4gICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnRW50ZXIoZXZlbnQ6IEN1c3RvbUV2ZW50PElneERyYWdDdXN0b21FdmVudERldGFpbHM+KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0RyYWdMaW5rZWQoZXZlbnQuZGV0YWlsLm93bmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnb3ZlciA9IHRydWU7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRQb3NYID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICBjb25zdCBlbGVtZW50UG9zWSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHRoaXMuZ2V0V2luZG93U2Nyb2xsVG9wKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBldmVudC5kZXRhaWwucGFnZVggLSBlbGVtZW50UG9zWDtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGV2ZW50LmRldGFpbC5wYWdlWSAtIGVsZW1lbnRQb3NZO1xuICAgICAgICBjb25zdCBldmVudEFyZ3M6IElEcm9wQmFzZUV2ZW50QXJncyA9IHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LmRldGFpbC5vcmlnaW5hbEV2ZW50LFxuICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICBkcmFnOiBldmVudC5kZXRhaWwub3duZXIsXG4gICAgICAgICAgICBkcmFnRGF0YTogZXZlbnQuZGV0YWlsLm93bmVyLmRhdGEsXG4gICAgICAgICAgICBzdGFydFg6IGV2ZW50LmRldGFpbC5zdGFydFgsXG4gICAgICAgICAgICBzdGFydFk6IGV2ZW50LmRldGFpbC5zdGFydFksXG4gICAgICAgICAgICBwYWdlWDogZXZlbnQuZGV0YWlsLnBhZ2VYLFxuICAgICAgICAgICAgcGFnZVk6IGV2ZW50LmRldGFpbC5wYWdlWSxcbiAgICAgICAgICAgIG9mZnNldFgsXG4gICAgICAgICAgICBvZmZzZXRZXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW50ZXIuZW1pdChldmVudEFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG9uRHJhZ0xlYXZlKGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0RyYWdMaW5rZWQoZXZlbnQuZGV0YWlsLm93bmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnb3ZlciA9IGZhbHNlO1xuICAgICAgICBjb25zdCBlbGVtZW50UG9zWCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyB0aGlzLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgY29uc3QgZWxlbWVudFBvc1kgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB0aGlzLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gZXZlbnQuZGV0YWlsLnBhZ2VYIC0gZWxlbWVudFBvc1g7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBldmVudC5kZXRhaWwucGFnZVkgLSBlbGVtZW50UG9zWTtcbiAgICAgICAgY29uc3QgZXZlbnRBcmdzOiBJRHJvcEJhc2VFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudC5kZXRhaWwub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgZHJhZzogZXZlbnQuZGV0YWlsLm93bmVyLFxuICAgICAgICAgICAgZHJhZ0RhdGE6IGV2ZW50LmRldGFpbC5vd25lci5kYXRhLFxuICAgICAgICAgICAgc3RhcnRYOiBldmVudC5kZXRhaWwuc3RhcnRYLFxuICAgICAgICAgICAgc3RhcnRZOiBldmVudC5kZXRhaWwuc3RhcnRZLFxuICAgICAgICAgICAgcGFnZVg6IGV2ZW50LmRldGFpbC5wYWdlWCxcbiAgICAgICAgICAgIHBhZ2VZOiBldmVudC5kZXRhaWwucGFnZVksXG4gICAgICAgICAgICBvZmZzZXRYLFxuICAgICAgICAgICAgb2Zmc2V0WVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxlYXZlLmVtaXQoZXZlbnRBcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFdpbmRvd1Njcm9sbFRvcCgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zY3JvbGxZID8gd2luZG93LnNjcm9sbFkgOiAod2luZG93LnBhZ2VZT2Zmc2V0ID8gd2luZG93LnBhZ2VZT2Zmc2V0IDogMCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFdpbmRvd1Njcm9sbExlZnQoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsWCA/IHdpbmRvdy5zY3JvbGxYIDogKHdpbmRvdy5wYWdlWE9mZnNldCA/IHdpbmRvdy5wYWdlWE9mZnNldCA6IDApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0RyYWdMaW5rZWQoZHJhZzogSWd4RHJhZ0RpcmVjdGl2ZSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBkcmFnTGlua0FycmF5ID0gZHJhZy5kcmFnQ2hhbm5lbCBpbnN0YW5jZW9mIEFycmF5O1xuICAgICAgICBjb25zdCBkcm9wTGlua0FycmF5ID0gdGhpcy5kcm9wQ2hhbm5lbCBpbnN0YW5jZW9mIEFycmF5O1xuXG4gICAgICAgIGlmICghZHJhZ0xpbmtBcnJheSAmJiAhZHJvcExpbmtBcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJvcENoYW5uZWwgPT09IGRyYWcuZHJhZ0NoYW5uZWw7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRyYWdMaW5rQXJyYXkgJiYgZHJvcExpbmtBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgZHJvcExpbmtzID0gdGhpcy5kcm9wQ2hhbm5lbCBhcyBhbnkgW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxpbmsgb2YgZHJvcExpbmtzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmsgPT09IGRyYWcuZHJhZ0NoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRyYWdMaW5rQXJyYXkgJiYgIWRyb3BMaW5rQXJyYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRyYWdMaW5rcyA9IGRyYWcuZHJhZ0NoYW5uZWwgYXMgYW55IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaW5rIG9mIGRyYWdMaW5rcykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rID09PSB0aGlzLmRyb3BDaGFubmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRyYWdMaW5rcyA9IGRyYWcuZHJhZ0NoYW5uZWwgYXMgYW55IFtdO1xuICAgICAgICAgICAgY29uc3QgZHJvcExpbmtzID0gdGhpcy5kcm9wQ2hhbm5lbCBhcyBhbnkgW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRyYWdsaW5rIG9mIGRyYWdMaW5rcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZHJvcGxpbmsgb2YgZHJvcExpbmtzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkcmFnbGluayA9PT0gZHJvcGxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRJbnNlcnRJbmRleEF0KGRyYWdnZWREaXI6IElneERyYWdEaXJlY3RpdmUsIGVsZW1lbnRzQXRQb2ludDogYW55W10pOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5zZXJ0SW5kZXggPSAtMTtcbiAgICAgICAgY29uc3QgZHJvcENoaWxkcmVuID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pO1xuICAgICAgICBpZiAoIWRyb3BDaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnNlcnRJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGNoaWxkVW5kZXIgPSBudWxsO1xuICAgICAgICB3aGlsZSAoIWNoaWxkVW5kZXIgJiYgaSA8IGVsZW1lbnRzQXRQb2ludC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50c0F0UG9pbnRbaV0ucGFyZW50RWxlbWVudCA9PT0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFVuZGVyID0gZWxlbWVudHNBdFBvaW50W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJhZ2dlZEVsZW1JbmRleCA9IGRyb3BDaGlsZHJlbi5pbmRleE9mKGRyYWdnZWREaXIuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgaW5zZXJ0SW5kZXggPSBkcm9wQ2hpbGRyZW4uaW5kZXhPZihjaGlsZFVuZGVyKTtcbiAgICAgICAgaWYgKGRyYWdnZWRFbGVtSW5kZXggIT09IC0xICYmIGRyYWdnZWRFbGVtSW5kZXggPCBpbnNlcnRJbmRleCkge1xuICAgICAgICAgICAgaW5zZXJ0SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnNlcnRJbmRleDtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4RHJhZ0RpcmVjdGl2ZSwgSWd4RHJvcERpcmVjdGl2ZSwgSWd4RHJhZ0hhbmRsZURpcmVjdGl2ZSwgSWd4RHJhZ0lnbm9yZURpcmVjdGl2ZV0sXG4gICAgZXhwb3J0czogW0lneERyYWdEaXJlY3RpdmUsIElneERyb3BEaXJlY3RpdmUsIElneERyYWdIYW5kbGVEaXJlY3RpdmUsIElneERyYWdJZ25vcmVEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIElneERyYWdEcm9wTW9kdWxlIHsgfVxuIl19