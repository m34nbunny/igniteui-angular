import { Directive, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxScrollInertiaDirective {
    constructor(element, _zone) {
        this.element = element;
        this._zone = _zone;
        this.wheelStep = 50;
        this.inertiaStep = 1.5;
        this.smoothingStep = 1.5;
        this.smoothingDuration = 0.5;
        this.swipeToleranceX = 20;
        this.inertiaDeltaY = 3;
        this.inertiaDeltaX = 2;
        this.inertiaDuration = 0.5;
        this._savedSpeedsX = [];
        this.baseDeltaMultiplier = 1 / 120;
        this.firefoxDeltaMultiplier = 1 / 30;
    }
    ngOnInit() {
        this._zone.runOutsideAngular(() => {
            this.parentElement = this.element.nativeElement.parentElement || this.element.nativeElement.parentNode;
            if (!this.parentElement) {
                return;
            }
            const targetElem = this.parentElement;
            targetElem.addEventListener('wheel', this.onWheel.bind(this));
            targetElem.addEventListener('touchstart', this.onTouchStart.bind(this));
            targetElem.addEventListener('touchmove', this.onTouchMove.bind(this));
            targetElem.addEventListener('touchend', this.onTouchEnd.bind(this));
        });
    }
    ngOnDestroy() {
        this._zone.runOutsideAngular(() => {
            const targetElem = this.parentElement;
            if (!targetElem) {
                return;
            }
            targetElem.removeEventListener('wheel', this.onWheel);
            targetElem.removeEventListener('touchstart', this.onTouchStart);
            targetElem.removeEventListener('touchmove', this.onTouchMove);
            targetElem.removeEventListener('touchend', this.onTouchEnd);
        });
    }
    /**
     * @hidden
     * Function that is called when scrolling with the mouse wheel or using touchpad
     */
    onWheel(evt) {
        // if no scrollbar return
        if (!this.IgxScrollInertiaScrollContainer) {
            return;
        }
        // if ctrl key is pressed and the user want to zoom in/out the page
        if (evt.ctrlKey) {
            return;
        }
        let scrollDeltaX;
        let scrollDeltaY;
        const scrollStep = this.wheelStep;
        const minWheelStep = 1 / this.wheelStep;
        const smoothing = this.smoothingDuration !== 0;
        this._startX = this.IgxScrollInertiaScrollContainer.scrollLeft;
        this._startY = this.IgxScrollInertiaScrollContainer.scrollTop;
        if (evt.wheelDeltaX) {
            /* Option supported on Chrome, Safari, Opera.
            /* 120 is default for mousewheel on these browsers. Other values are for trackpads */
            scrollDeltaX = -evt.wheelDeltaX * this.baseDeltaMultiplier;
            if (-minWheelStep < scrollDeltaX && scrollDeltaX < minWheelStep) {
                scrollDeltaX = Math.sign(scrollDeltaX) * minWheelStep;
            }
        }
        else if (evt.deltaX) {
            /* For other browsers that don't provide wheelDelta, use the deltaY to determine direction and pass default values. */
            const deltaScaledX = evt.deltaX * (evt.deltaMode === 0 ? this.firefoxDeltaMultiplier : 1);
            scrollDeltaX = this.calcAxisCoords(deltaScaledX, -1, 1);
        }
        /** Get delta for the Y axis */
        if (evt.wheelDeltaY) {
            /* Option supported on Chrome, Safari, Opera.
            /* 120 is default for mousewheel on these browsers. Other values are for trackpads */
            scrollDeltaY = -evt.wheelDeltaY * this.baseDeltaMultiplier;
            if (-minWheelStep < scrollDeltaY && scrollDeltaY < minWheelStep) {
                scrollDeltaY = Math.sign(scrollDeltaY) * minWheelStep;
            }
        }
        else if (evt.deltaY) {
            /* For other browsers that don't provide wheelDelta, use the deltaY to determine direction and pass default values. */
            const deltaScaledY = evt.deltaY * (evt.deltaMode === 0 ? this.firefoxDeltaMultiplier : 1);
            scrollDeltaY = this.calcAxisCoords(deltaScaledY, -1, 1);
        }
        if (evt.composedPath && this.didChildScroll(evt, scrollDeltaX, scrollDeltaY)) {
            return;
        }
        if (scrollDeltaX && this.IgxScrollInertiaDirection === 'horizontal') {
            const nextLeft = this._startX + scrollDeltaX * scrollStep;
            if (!smoothing) {
                this._scrollToX(nextLeft);
            }
            else {
                this._smoothWheelScroll(scrollDeltaX);
            }
            const maxScrollLeft = parseInt(this.IgxScrollInertiaScrollContainer.children[0].style.width, 10);
            if (0 < nextLeft && nextLeft < maxScrollLeft) {
                // Prevent navigating through pages when scrolling on Mac
                evt.preventDefault();
            }
        }
        else if (evt.shiftKey && scrollDeltaY && this.IgxScrollInertiaDirection === 'horizontal') {
            if (!smoothing) {
                const step = this._startX + scrollDeltaY * scrollStep;
                this._scrollToX(step);
            }
            else {
                this._smoothWheelScroll(scrollDeltaY);
            }
        }
        else if (!evt.shiftKey && scrollDeltaY && this.IgxScrollInertiaDirection === 'vertical') {
            const nextTop = this._startY + scrollDeltaY * scrollStep;
            if (!smoothing) {
                this._scrollToY(nextTop);
            }
            else {
                this._smoothWheelScroll(scrollDeltaY);
            }
            this.preventParentScroll(evt, true, nextTop);
        }
    }
    /**
     * @hidden
     * When there is still room to scroll up/down prevent the parent elements from scrolling too.
     */
    preventParentScroll(evt, preventDefault, nextTop = 0) {
        const curScrollTop = nextTop === 0 ? this.IgxScrollInertiaScrollContainer.scrollTop : nextTop;
        const maxScrollTop = this.IgxScrollInertiaScrollContainer.children[0].scrollHeight -
            this.IgxScrollInertiaScrollContainer.offsetHeight;
        if (0 < curScrollTop && curScrollTop < maxScrollTop) {
            if (preventDefault) {
                evt.preventDefault();
            }
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
        }
    }
    /**
     * @hidden
     * Checks if the wheel event would have scrolled an element under the display container
     * in DOM tree so that it can correctly be ignored until that element can no longer be scrolled.
     */
    didChildScroll(evt, scrollDeltaX, scrollDeltaY) {
        const path = evt.composedPath();
        let i = 0;
        while (i < path.length && path[i].localName !== 'igx-display-container') {
            const e = path[i++];
            if (e.scrollHeight > e.clientHeight) {
                const overflowY = window.getComputedStyle(e)['overflow-y'];
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    if (scrollDeltaY > 0 && e.scrollHeight - Math.abs(Math.round(e.scrollTop)) !== e.clientHeight) {
                        return true;
                    }
                    if (scrollDeltaY < 0 && e.scrollTop !== 0) {
                        return true;
                    }
                }
            }
            if (e.scrollWidth > e.clientWidth) {
                const overflowX = window.getComputedStyle(e)['overflow-x'];
                if (overflowX === 'auto' || overflowX === 'scroll') {
                    if (scrollDeltaX > 0 && e.scrollWidth - Math.abs(Math.round(e.scrollLeft)) !== e.clientWidth) {
                        return true;
                    }
                    if (scrollDeltaX < 0 && e.scrollLeft !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * @hidden
     * Function that is called the first moment we start interacting with the content on a touch device
     */
    onTouchStart(event) {
        if (!this.IgxScrollInertiaScrollContainer) {
            return false;
        }
        // stops any current ongoing inertia
        cancelAnimationFrame(this._touchInertiaAnimID);
        const touch = event.touches[0];
        this._startX = this.IgxScrollInertiaScrollContainer.scrollLeft;
        this._startY = this.IgxScrollInertiaScrollContainer.scrollTop;
        this._touchStartX = touch.pageX;
        this._touchStartY = touch.pageY;
        this._lastTouchEnd = new Date().getTime();
        this._lastTouchX = touch.pageX;
        this._lastTouchY = touch.pageY;
        this._savedSpeedsX = [];
        this._savedSpeedsY = [];
        // Vars regarding swipe offset
        this._totalMovedX = 0;
        this._offsetRecorded = false;
        this._offsetDirection = 0;
        if (this.IgxScrollInertiaDirection === 'vertical') {
            this.preventParentScroll(event, false);
        }
    }
    /**
     * @hidden
     * Function that is called when we need to scroll the content based on touch interactions
     */
    onTouchMove(event) {
        if (!this.IgxScrollInertiaScrollContainer) {
            return;
        }
        const touch = event.touches[0];
        const destX = this._startX + (this._touchStartX - touch.pageX) * Math.sign(this.inertiaStep);
        const destY = this._startY + (this._touchStartY - touch.pageY) * Math.sign(this.inertiaStep);
        /* Handle complex touchmoves when swipe stops but the toch doesn't end and then a swipe is initiated again */
        /* **********************************************************/
        const timeFromLastTouch = (new Date().getTime()) - this._lastTouchEnd;
        if (timeFromLastTouch !== 0 && timeFromLastTouch < 100) {
            const speedX = (this._lastTouchX - touch.pageX) / timeFromLastTouch;
            const speedY = (this._lastTouchY - touch.pageY) / timeFromLastTouch;
            // Save the last 5 speeds between two touchmoves on X axis
            if (this._savedSpeedsX.length < 5) {
                this._savedSpeedsX.push(speedX);
            }
            else {
                this._savedSpeedsX.shift();
                this._savedSpeedsX.push(speedX);
            }
            // Save the last 5 speeds between two touchmoves on Y axis
            if (this._savedSpeedsY.length < 5) {
                this._savedSpeedsY.push(speedY);
            }
            else {
                this._savedSpeedsY.shift();
                this._savedSpeedsY.push(speedY);
            }
        }
        this._lastTouchEnd = new Date().getTime();
        this._lastMovedX = this._lastTouchX - touch.pageX;
        this._lastMovedY = this._lastTouchY - touch.pageY;
        this._lastTouchX = touch.pageX;
        this._lastTouchY = touch.pageY;
        this._totalMovedX += this._lastMovedX;
        /*	Do not scroll using touch untill out of the swipeToleranceX bounds */
        if (Math.abs(this._totalMovedX) < this.swipeToleranceX && !this._offsetRecorded) {
            this._scrollTo(this._startX, destY);
        }
        else {
            /*	Record the direction the first time we are out of the swipeToleranceX bounds.
            *	That way we know which direction we apply the offset so it doesn't hickup when moving out of the swipeToleranceX bounds */
            if (!this._offsetRecorded) {
                this._offsetDirection = Math.sign(destX - this._startX);
                this._offsetRecorded = true;
            }
            /*	Scroll with offset ammout of swipeToleranceX in the direction we have exited the bounds and
            don't change it after that ever until touchend and again touchstart */
            this._scrollTo(destX - this._offsetDirection * this.swipeToleranceX, destY);
        }
        // On Safari preventing the touchmove would prevent default page scroll behaviour even if there is the element doesn't have overflow
        if (this.IgxScrollInertiaDirection === 'vertical') {
            this.preventParentScroll(event, true);
        }
    }
    onTouchEnd(event) {
        let speedX = 0;
        let speedY = 0;
        // savedSpeedsX and savedSpeedsY have same length
        for (let i = 0; i < this._savedSpeedsX.length; i++) {
            speedX += this._savedSpeedsX[i];
            speedY += this._savedSpeedsY[i];
        }
        speedX = this._savedSpeedsX.length ? speedX / this._savedSpeedsX.length : 0;
        speedY = this._savedSpeedsX.length ? speedY / this._savedSpeedsY.length : 0;
        // Use the lastMovedX and lastMovedY to determine if the swipe stops without lifting the finger so we don't start inertia
        if ((Math.abs(speedX) > 0.1 || Math.abs(speedY) > 0.1) &&
            (Math.abs(this._lastMovedX) > 2 || Math.abs(this._lastMovedY) > 2)) {
            this._inertiaInit(speedX, speedY);
        }
        if (this.IgxScrollInertiaDirection === 'vertical') {
            this.preventParentScroll(event, false);
        }
    }
    _smoothWheelScroll(delta) {
        this._nextY = this.IgxScrollInertiaScrollContainer.scrollTop;
        this._nextX = this.IgxScrollInertiaScrollContainer.scrollLeft;
        let x = -1;
        let wheelInertialAnimation = null;
        const inertiaWheelStep = () => {
            if (x > 1) {
                cancelAnimationFrame(wheelInertialAnimation);
                return;
            }
            const nextScroll = ((-3 * x * x + 3) * delta * 2) * this.smoothingStep;
            if (this.IgxScrollInertiaDirection === 'vertical') {
                this._nextY += nextScroll;
                this._scrollToY(this._nextY);
            }
            else {
                this._nextX += nextScroll;
                this._scrollToX(this._nextX);
            }
            //continue the inertia
            x += 0.08 * (1 / this.smoothingDuration);
            wheelInertialAnimation = requestAnimationFrame(inertiaWheelStep);
        };
        wheelInertialAnimation = requestAnimationFrame(inertiaWheelStep);
    }
    _inertiaInit(speedX, speedY) {
        const stepModifer = this.inertiaStep;
        const inertiaDuration = this.inertiaDuration;
        let x = 0;
        this._nextX = this.IgxScrollInertiaScrollContainer.scrollLeft;
        this._nextY = this.IgxScrollInertiaScrollContainer.scrollTop;
        // Sets timeout until executing next movement iteration of the inertia
        const inertiaStep = () => {
            if (x > 6) {
                cancelAnimationFrame(this._touchInertiaAnimID);
                return;
            }
            if (Math.abs(speedX) > Math.abs(speedY)) {
                x += 0.05 / (1 * inertiaDuration);
            }
            else {
                x += 0.05 / (1 * inertiaDuration);
            }
            if (x <= 1) {
                // We use constant quation to determine the offset without speed falloff befor x reaches 1
                if (Math.abs(speedY) <= Math.abs(speedX) * this.inertiaDeltaY) {
                    this._nextX += 1 * speedX * 15 * stepModifer;
                }
                if (Math.abs(speedY) >= Math.abs(speedX) * this.inertiaDeltaX) {
                    this._nextY += 1 * speedY * 15 * stepModifer;
                }
            }
            else {
                // We use the quation "y = 2 / (x + 0.55) - 0.3" to determine the offset
                if (Math.abs(speedY) <= Math.abs(speedX) * this.inertiaDeltaY) {
                    this._nextX += Math.abs(2 / (x + 0.55) - 0.3) * speedX * 15 * stepModifer;
                }
                if (Math.abs(speedY) >= Math.abs(speedX) * this.inertiaDeltaX) {
                    this._nextY += Math.abs(2 / (x + 0.55) - 0.3) * speedY * 15 * stepModifer;
                }
            }
            // If we have mixed environment we use the default behaviour. i.e. touchscreen + mouse
            this._scrollTo(this._nextX, this._nextY);
            this._touchInertiaAnimID = requestAnimationFrame(inertiaStep);
        };
        // Start inertia and continue it recursively
        this._touchInertiaAnimID = requestAnimationFrame(inertiaStep);
    }
    calcAxisCoords(target, min, max) {
        if (target === undefined || target < min) {
            target = min;
        }
        else if (target > max) {
            target = max;
        }
        return target;
    }
    _scrollTo(destX, destY) {
        // TODO Trigger scrolling event?
        const scrolledX = this._scrollToX(destX);
        const scrolledY = this._scrollToY(destY);
        return { x: scrolledX, y: scrolledY };
    }
    _scrollToX(dest) {
        this.IgxScrollInertiaScrollContainer.scrollLeft = dest;
    }
    _scrollToY(dest) {
        this.IgxScrollInertiaScrollContainer.scrollTop = dest;
    }
}
IgxScrollInertiaDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxScrollInertiaDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
IgxScrollInertiaDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxScrollInertiaDirective, selector: "[igxScrollInertia]", inputs: { IgxScrollInertiaDirection: "IgxScrollInertiaDirection", IgxScrollInertiaScrollContainer: "IgxScrollInertiaScrollContainer", wheelStep: "wheelStep", inertiaStep: "inertiaStep", smoothingStep: "smoothingStep", smoothingDuration: "smoothingDuration", swipeToleranceX: "swipeToleranceX", inertiaDeltaY: "inertiaDeltaY", inertiaDeltaX: "inertiaDeltaX", inertiaDuration: "inertiaDuration" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxScrollInertiaDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[igxScrollInertia]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { IgxScrollInertiaDirection: [{
                type: Input
            }], IgxScrollInertiaScrollContainer: [{
                type: Input
            }], wheelStep: [{
                type: Input
            }], inertiaStep: [{
                type: Input
            }], smoothingStep: [{
                type: Input
            }], smoothingDuration: [{
                type: Input
            }], swipeToleranceX: [{
                type: Input
            }], inertiaDeltaY: [{
                type: Input
            }], inertiaDeltaX: [{
                type: Input
            }], inertiaDuration: [{
                type: Input
            }] } });
/**
 * @hidden
 */
export class IgxScrollInertiaModule {
}
IgxScrollInertiaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxScrollInertiaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxScrollInertiaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxScrollInertiaModule, declarations: [IgxScrollInertiaDirective], imports: [CommonModule], exports: [IgxScrollInertiaDirective] });
IgxScrollInertiaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxScrollInertiaModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxScrollInertiaModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxScrollInertiaDirective],
                    exports: [IgxScrollInertiaDirective],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsX2luZXJ0aWEuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RpcmVjdGl2ZXMvc2Nyb2xsLWluZXJ0aWEvc2Nyb2xsX2luZXJ0aWEuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE4QixRQUFRLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDbEcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUUvQzs7R0FFRztBQUVILE1BQU0sT0FBTyx5QkFBeUI7SUFxRGxDLFlBQW9CLE9BQW1CLEVBQVUsS0FBYTtRQUExQyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQTVDdkQsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUdmLGdCQUFXLEdBQUcsR0FBRyxDQUFDO1FBR2xCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1FBR3BCLHNCQUFpQixHQUFHLEdBQUcsQ0FBQztRQUd4QixvQkFBZSxHQUFHLEVBQUUsQ0FBQztRQUdyQixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUdsQixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUdsQixvQkFBZSxHQUFHLEdBQUcsQ0FBQztRQVVyQixrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQVVuQix3QkFBbUIsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzlCLDJCQUFzQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFMEIsQ0FBQztJQUU1RCxRQUFRO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FB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O2dCQUlDLGlCQUFpQjtzQkFEdkIsS0FBSztnQkFJQyxlQUFlO3NCQURyQixLQUFLO2dCQUlDLGFBQWE7c0JBRG5CLEtBQUs7Z0JBSUMsYUFBYTtzQkFEbkIsS0FBSztnQkFJQyxlQUFlO3NCQURyQixLQUFLOztBQWlhVjs7R0FFRztBQU9ILE1BQU0sT0FBTyxzQkFBc0I7O21IQUF0QixzQkFBc0I7b0hBQXRCLHNCQUFzQixpQkF2Y3RCLHlCQUF5QixhQW9jeEIsWUFBWSxhQXBjYix5QkFBeUI7b0hBdWN6QixzQkFBc0IsWUFIdEIsQ0FBQyxZQUFZLENBQUM7MkZBR2Qsc0JBQXNCO2tCQU5sQyxRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLHlCQUF5QixDQUFDO29CQUN6QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIEVsZW1lbnRSZWYsIE5nWm9uZSwgT25Jbml0LCBOZ01vZHVsZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2lneFNjcm9sbEluZXJ0aWFdJyB9KVxuZXhwb3J0IGNsYXNzIElneFNjcm9sbEluZXJ0aWFEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBJZ3hTY3JvbGxJbmVydGlhRGlyZWN0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBJZ3hTY3JvbGxJbmVydGlhU2Nyb2xsQ29udGFpbmVyOiBhbnk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aGVlbFN0ZXAgPSA1MDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGluZXJ0aWFTdGVwID0gMS41O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc21vb3RoaW5nU3RlcCA9IDEuNTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNtb290aGluZ0R1cmF0aW9uID0gMC41O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc3dpcGVUb2xlcmFuY2VYID0gMjA7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpbmVydGlhRGVsdGFZID0gMztcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGluZXJ0aWFEZWx0YVggPSAyO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5lcnRpYUR1cmF0aW9uID0gMC41O1xuXG4gICAgcHJpdmF0ZSBfdG91Y2hJbmVydGlhQW5pbUlEO1xuICAgIHByaXZhdGUgX3N0YXJ0WDtcbiAgICBwcml2YXRlIF9zdGFydFk7XG4gICAgcHJpdmF0ZSBfdG91Y2hTdGFydFg7XG4gICAgcHJpdmF0ZSBfdG91Y2hTdGFydFk7XG4gICAgcHJpdmF0ZSBfbGFzdFRvdWNoRW5kO1xuICAgIHByaXZhdGUgX2xhc3RUb3VjaFg7XG4gICAgcHJpdmF0ZSBfbGFzdFRvdWNoWTtcbiAgICBwcml2YXRlIF9zYXZlZFNwZWVkc1ggPSBbXTtcbiAgICBwcml2YXRlIF9zYXZlZFNwZWVkc1k7XG4gICAgcHJpdmF0ZSBfdG90YWxNb3ZlZFg7XG4gICAgcHJpdmF0ZSBfb2Zmc2V0UmVjb3JkZWQ7XG4gICAgcHJpdmF0ZSBfb2Zmc2V0RGlyZWN0aW9uO1xuICAgIHByaXZhdGUgX2xhc3RNb3ZlZFg7XG4gICAgcHJpdmF0ZSBfbGFzdE1vdmVkWTtcbiAgICBwcml2YXRlIF9uZXh0WDtcbiAgICBwcml2YXRlIF9uZXh0WTtcbiAgICBwcml2YXRlIHBhcmVudEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBiYXNlRGVsdGFNdWx0aXBsaWVyID0gMSAvIDEyMDtcbiAgICBwcml2YXRlIGZpcmVmb3hEZWx0YU11bHRpcGxpZXIgPSAxIC8gMzA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkgeyB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCB8fCB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRFbGVtID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgdGFyZ2V0RWxlbS5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIHRoaXMub25XaGVlbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRhcmdldEVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGFyZ2V0RWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGFyZ2V0RWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEVsZW0gPSB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIXRhcmdldEVsZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3doZWVsJywgdGhpcy5vbldoZWVsKTtcbiAgICAgICAgICAgIHRhcmdldEVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0KTtcbiAgICAgICAgICAgIHRhcmdldEVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgICAgICAgICB0YXJnZXRFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gc2Nyb2xsaW5nIHdpdGggdGhlIG1vdXNlIHdoZWVsIG9yIHVzaW5nIHRvdWNocGFkXG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uV2hlZWwoZXZ0KSB7XG4gICAgICAgIC8vIGlmIG5vIHNjcm9sbGJhciByZXR1cm5cbiAgICAgICAgaWYgKCF0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBjdHJsIGtleSBpcyBwcmVzc2VkIGFuZCB0aGUgdXNlciB3YW50IHRvIHpvb20gaW4vb3V0IHRoZSBwYWdlXG4gICAgICAgIGlmIChldnQuY3RybEtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzY3JvbGxEZWx0YVg7XG4gICAgICAgIGxldCBzY3JvbGxEZWx0YVk7XG4gICAgICAgIGNvbnN0IHNjcm9sbFN0ZXAgPSB0aGlzLndoZWVsU3RlcDtcbiAgICAgICAgY29uc3QgbWluV2hlZWxTdGVwID0gMSAvIHRoaXMud2hlZWxTdGVwO1xuICAgICAgICBjb25zdCBzbW9vdGhpbmcgPSB0aGlzLnNtb290aGluZ0R1cmF0aW9uICE9PSAwO1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0WCA9IHRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0O1xuICAgICAgICB0aGlzLl9zdGFydFkgPSB0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wO1xuXG4gICAgICAgIGlmIChldnQud2hlZWxEZWx0YVgpIHtcbiAgICAgICAgICAgIC8qIE9wdGlvbiBzdXBwb3J0ZWQgb24gQ2hyb21lLCBTYWZhcmksIE9wZXJhLlxuICAgICAgICAgICAgLyogMTIwIGlzIGRlZmF1bHQgZm9yIG1vdXNld2hlZWwgb24gdGhlc2UgYnJvd3NlcnMuIE90aGVyIHZhbHVlcyBhcmUgZm9yIHRyYWNrcGFkcyAqL1xuICAgICAgICAgICAgc2Nyb2xsRGVsdGFYID0gLWV2dC53aGVlbERlbHRhWCAqIHRoaXMuYmFzZURlbHRhTXVsdGlwbGllcjtcblxuICAgICAgICAgICAgaWYgKC1taW5XaGVlbFN0ZXAgPCBzY3JvbGxEZWx0YVggJiYgc2Nyb2xsRGVsdGFYIDwgbWluV2hlZWxTdGVwKSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsRGVsdGFYID0gTWF0aC5zaWduKHNjcm9sbERlbHRhWCkgKiBtaW5XaGVlbFN0ZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LmRlbHRhWCkge1xuICAgICAgICAgICAgLyogRm9yIG90aGVyIGJyb3dzZXJzIHRoYXQgZG9uJ3QgcHJvdmlkZSB3aGVlbERlbHRhLCB1c2UgdGhlIGRlbHRhWSB0byBkZXRlcm1pbmUgZGlyZWN0aW9uIGFuZCBwYXNzIGRlZmF1bHQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgY29uc3QgZGVsdGFTY2FsZWRYID0gZXZ0LmRlbHRhWCAqIChldnQuZGVsdGFNb2RlID09PSAwID8gdGhpcy5maXJlZm94RGVsdGFNdWx0aXBsaWVyIDogMSk7XG4gICAgICAgICAgICBzY3JvbGxEZWx0YVggPSB0aGlzLmNhbGNBeGlzQ29vcmRzKGRlbHRhU2NhbGVkWCwgLTEsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIEdldCBkZWx0YSBmb3IgdGhlIFkgYXhpcyAqL1xuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGFZKSB7XG4gICAgICAgICAgICAvKiBPcHRpb24gc3VwcG9ydGVkIG9uIENocm9tZSwgU2FmYXJpLCBPcGVyYS5cbiAgICAgICAgICAgIC8qIDEyMCBpcyBkZWZhdWx0IGZvciBtb3VzZXdoZWVsIG9uIHRoZXNlIGJyb3dzZXJzLiBPdGhlciB2YWx1ZXMgYXJlIGZvciB0cmFja3BhZHMgKi9cbiAgICAgICAgICAgIHNjcm9sbERlbHRhWSA9IC1ldnQud2hlZWxEZWx0YVkgKiB0aGlzLmJhc2VEZWx0YU11bHRpcGxpZXI7XG5cbiAgICAgICAgICAgIGlmICgtbWluV2hlZWxTdGVwIDwgc2Nyb2xsRGVsdGFZICYmIHNjcm9sbERlbHRhWSA8IG1pbldoZWVsU3RlcCkge1xuICAgICAgICAgICAgICAgIHNjcm9sbERlbHRhWSA9IE1hdGguc2lnbihzY3JvbGxEZWx0YVkpICogbWluV2hlZWxTdGVwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2dC5kZWx0YVkpIHtcbiAgICAgICAgICAgIC8qIEZvciBvdGhlciBicm93c2VycyB0aGF0IGRvbid0IHByb3ZpZGUgd2hlZWxEZWx0YSwgdXNlIHRoZSBkZWx0YVkgdG8gZGV0ZXJtaW5lIGRpcmVjdGlvbiBhbmQgcGFzcyBkZWZhdWx0IHZhbHVlcy4gKi9cbiAgICAgICAgICAgIGNvbnN0IGRlbHRhU2NhbGVkWSA9IGV2dC5kZWx0YVkgKiAoZXZ0LmRlbHRhTW9kZSA9PT0gMCA/IHRoaXMuZmlyZWZveERlbHRhTXVsdGlwbGllciA6IDEpO1xuICAgICAgICAgICAgc2Nyb2xsRGVsdGFZID0gdGhpcy5jYWxjQXhpc0Nvb3JkcyhkZWx0YVNjYWxlZFksIC0xLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldnQuY29tcG9zZWRQYXRoICYmIHRoaXMuZGlkQ2hpbGRTY3JvbGwoZXZ0LCBzY3JvbGxEZWx0YVgsIHNjcm9sbERlbHRhWSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxEZWx0YVggJiYgdGhpcy5JZ3hTY3JvbGxJbmVydGlhRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRMZWZ0ID0gdGhpcy5fc3RhcnRYICsgc2Nyb2xsRGVsdGFYICogc2Nyb2xsU3RlcDtcbiAgICAgICAgICAgIGlmICghc21vb3RoaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9YKG5leHRMZWZ0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc21vb3RoV2hlZWxTY3JvbGwoc2Nyb2xsRGVsdGFYKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1heFNjcm9sbExlZnQgPSBwYXJzZUludCh0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuY2hpbGRyZW5bMF0uc3R5bGUud2lkdGgsIDEwKTtcbiAgICAgICAgICAgIGlmICgwIDwgbmV4dExlZnQgJiYgbmV4dExlZnQgPCBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCBuYXZpZ2F0aW5nIHRocm91Z2ggcGFnZXMgd2hlbiBzY3JvbGxpbmcgb24gTWFjXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LnNoaWZ0S2V5ICYmIHNjcm9sbERlbHRhWSAmJiB0aGlzLklneFNjcm9sbEluZXJ0aWFEaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgaWYgKCFzbW9vdGhpbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gdGhpcy5fc3RhcnRYICsgc2Nyb2xsRGVsdGFZICogc2Nyb2xsU3RlcDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxUb1goc3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Ntb290aFdoZWVsU2Nyb2xsKHNjcm9sbERlbHRhWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWV2dC5zaGlmdEtleSAmJiBzY3JvbGxEZWx0YVkgJiYgdGhpcy5JZ3hTY3JvbGxJbmVydGlhRGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0VG9wID0gdGhpcy5fc3RhcnRZICsgc2Nyb2xsRGVsdGFZICogc2Nyb2xsU3RlcDtcbiAgICAgICAgICAgIGlmICghc21vb3RoaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9ZKG5leHRUb3ApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zbW9vdGhXaGVlbFNjcm9sbChzY3JvbGxEZWx0YVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmV2ZW50UGFyZW50U2Nyb2xsKGV2dCwgdHJ1ZSwgbmV4dFRvcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogV2hlbiB0aGVyZSBpcyBzdGlsbCByb29tIHRvIHNjcm9sbCB1cC9kb3duIHByZXZlbnQgdGhlIHBhcmVudCBlbGVtZW50cyBmcm9tIHNjcm9sbGluZyB0b28uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHByZXZlbnRQYXJlbnRTY3JvbGwoZXZ0LCBwcmV2ZW50RGVmYXVsdCwgbmV4dFRvcCA9IDApIHtcbiAgICAgICAgY29uc3QgY3VyU2Nyb2xsVG9wID0gbmV4dFRvcCA9PT0gMCA/IHRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3AgOiBuZXh0VG9wO1xuICAgICAgICBjb25zdCBtYXhTY3JvbGxUb3AgPSB0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuY2hpbGRyZW5bMF0uc2Nyb2xsSGVpZ2h0IC1cbiAgICAgICAgICAgIHRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGlmICgwIDwgY3VyU2Nyb2xsVG9wICYmIGN1clNjcm9sbFRvcCA8IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgaWYgKHByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZ0LnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBDaGVja3MgaWYgdGhlIHdoZWVsIGV2ZW50IHdvdWxkIGhhdmUgc2Nyb2xsZWQgYW4gZWxlbWVudCB1bmRlciB0aGUgZGlzcGxheSBjb250YWluZXJcbiAgICAgKiBpbiBET00gdHJlZSBzbyB0aGF0IGl0IGNhbiBjb3JyZWN0bHkgYmUgaWdub3JlZCB1bnRpbCB0aGF0IGVsZW1lbnQgY2FuIG5vIGxvbmdlciBiZSBzY3JvbGxlZC5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZGlkQ2hpbGRTY3JvbGwoZXZ0LCBzY3JvbGxEZWx0YVgsIHNjcm9sbERlbHRhWSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBwYXRoID0gZXZ0LmNvbXBvc2VkUGF0aCgpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgcGF0aC5sZW5ndGggJiYgcGF0aFtpXS5sb2NhbE5hbWUgIT09ICdpZ3gtZGlzcGxheS1jb250YWluZXInKSB7XG4gICAgICAgICAgICBjb25zdCBlID0gcGF0aFtpKytdO1xuICAgICAgICAgICAgaWYgKGUuc2Nyb2xsSGVpZ2h0ID4gZS5jbGllbnRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdmVyZmxvd1kgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlKVsnb3ZlcmZsb3cteSddO1xuICAgICAgICAgICAgICAgIGlmIChvdmVyZmxvd1kgPT09ICdhdXRvJyB8fCBvdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxEZWx0YVkgPiAwICYmIGUuc2Nyb2xsSGVpZ2h0IC0gTWF0aC5hYnMoTWF0aC5yb3VuZChlLnNjcm9sbFRvcCkpICE9PSBlLmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbERlbHRhWSA8IDAgJiYgZS5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUuc2Nyb2xsV2lkdGggPiBlLmNsaWVudFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3ZlcmZsb3dYID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZSlbJ292ZXJmbG93LXgnXTtcbiAgICAgICAgICAgICAgICBpZiAob3ZlcmZsb3dYID09PSAnYXV0bycgfHwgb3ZlcmZsb3dYID09PSAnc2Nyb2xsJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsRGVsdGFYID4gMCAmJiBlLnNjcm9sbFdpZHRoIC0gTWF0aC5hYnMoTWF0aC5yb3VuZChlLnNjcm9sbExlZnQpKSAhPT0gZS5jbGllbnRXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbERlbHRhWCA8IDAgJiYgZS5zY3JvbGxMZWZ0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHRoZSBmaXJzdCBtb21lbnQgd2Ugc3RhcnQgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgY29udGVudCBvbiBhIHRvdWNoIGRldmljZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBvblRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3BzIGFueSBjdXJyZW50IG9uZ29pbmcgaW5lcnRpYVxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl90b3VjaEluZXJ0aWFBbmltSUQpO1xuXG4gICAgICAgIGNvbnN0IHRvdWNoID0gZXZlbnQudG91Y2hlc1swXTtcblxuICAgICAgICB0aGlzLl9zdGFydFggPSB0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcblxuICAgICAgICB0aGlzLl9zdGFydFkgPSB0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wO1xuXG4gICAgICAgIHRoaXMuX3RvdWNoU3RhcnRYID0gdG91Y2gucGFnZVg7XG4gICAgICAgIHRoaXMuX3RvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XG5cbiAgICAgICAgdGhpcy5fbGFzdFRvdWNoRW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMuX2xhc3RUb3VjaFggPSB0b3VjaC5wYWdlWDtcbiAgICAgICAgdGhpcy5fbGFzdFRvdWNoWSA9IHRvdWNoLnBhZ2VZO1xuICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1ggPSBbXTtcbiAgICAgICAgdGhpcy5fc2F2ZWRTcGVlZHNZID0gW107XG5cbiAgICAgICAgLy8gVmFycyByZWdhcmRpbmcgc3dpcGUgb2Zmc2V0XG4gICAgICAgIHRoaXMuX3RvdGFsTW92ZWRYID0gMDtcbiAgICAgICAgdGhpcy5fb2Zmc2V0UmVjb3JkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fb2Zmc2V0RGlyZWN0aW9uID0gMDtcblxuICAgICAgICBpZiAodGhpcy5JZ3hTY3JvbGxJbmVydGlhRGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZlbnRQYXJlbnRTY3JvbGwoZXZlbnQsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHdlIG5lZWQgdG8gc2Nyb2xsIHRoZSBjb250ZW50IGJhc2VkIG9uIHRvdWNoIGludGVyYWN0aW9uc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBvblRvdWNoTW92ZShldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG91Y2ggPSBldmVudC50b3VjaGVzWzBdO1xuICAgICAgICBjb25zdCBkZXN0WCA9IHRoaXMuX3N0YXJ0WCArICh0aGlzLl90b3VjaFN0YXJ0WCAtIHRvdWNoLnBhZ2VYKSAqIE1hdGguc2lnbih0aGlzLmluZXJ0aWFTdGVwKTtcbiAgICAgICAgY29uc3QgZGVzdFkgPSB0aGlzLl9zdGFydFkgKyAodGhpcy5fdG91Y2hTdGFydFkgLSB0b3VjaC5wYWdlWSkgKiBNYXRoLnNpZ24odGhpcy5pbmVydGlhU3RlcCk7XG5cbiAgICAgICAgLyogSGFuZGxlIGNvbXBsZXggdG91Y2htb3ZlcyB3aGVuIHN3aXBlIHN0b3BzIGJ1dCB0aGUgdG9jaCBkb2Vzbid0IGVuZCBhbmQgdGhlbiBhIHN3aXBlIGlzIGluaXRpYXRlZCBhZ2FpbiAqL1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAgICAgY29uc3QgdGltZUZyb21MYXN0VG91Y2ggPSAobmV3IERhdGUoKS5nZXRUaW1lKCkpIC0gdGhpcy5fbGFzdFRvdWNoRW5kO1xuICAgICAgICBpZiAodGltZUZyb21MYXN0VG91Y2ggIT09IDAgJiYgdGltZUZyb21MYXN0VG91Y2ggPCAxMDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNwZWVkWCA9ICh0aGlzLl9sYXN0VG91Y2hYIC0gdG91Y2gucGFnZVgpIC8gdGltZUZyb21MYXN0VG91Y2g7XG4gICAgICAgICAgICBjb25zdCBzcGVlZFkgPSAodGhpcy5fbGFzdFRvdWNoWSAtIHRvdWNoLnBhZ2VZKSAvIHRpbWVGcm9tTGFzdFRvdWNoO1xuXG4gICAgICAgICAgICAvLyBTYXZlIHRoZSBsYXN0IDUgc3BlZWRzIGJldHdlZW4gdHdvIHRvdWNobW92ZXMgb24gWCBheGlzXG4gICAgICAgICAgICBpZiAodGhpcy5fc2F2ZWRTcGVlZHNYLmxlbmd0aCA8IDUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1gucHVzaChzcGVlZFgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1guc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1gucHVzaChzcGVlZFgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTYXZlIHRoZSBsYXN0IDUgc3BlZWRzIGJldHdlZW4gdHdvIHRvdWNobW92ZXMgb24gWSBheGlzXG4gICAgICAgICAgICBpZiAodGhpcy5fc2F2ZWRTcGVlZHNZLmxlbmd0aCA8IDUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1kucHVzaChzcGVlZFkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1kuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zYXZlZFNwZWVkc1kucHVzaChzcGVlZFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xhc3RUb3VjaEVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLl9sYXN0TW92ZWRYID0gdGhpcy5fbGFzdFRvdWNoWCAtIHRvdWNoLnBhZ2VYO1xuICAgICAgICB0aGlzLl9sYXN0TW92ZWRZID0gdGhpcy5fbGFzdFRvdWNoWSAtIHRvdWNoLnBhZ2VZO1xuICAgICAgICB0aGlzLl9sYXN0VG91Y2hYID0gdG91Y2gucGFnZVg7XG4gICAgICAgIHRoaXMuX2xhc3RUb3VjaFkgPSB0b3VjaC5wYWdlWTtcblxuICAgICAgICB0aGlzLl90b3RhbE1vdmVkWCArPSB0aGlzLl9sYXN0TW92ZWRYO1xuXG4gICAgICAgIC8qXHREbyBub3Qgc2Nyb2xsIHVzaW5nIHRvdWNoIHVudGlsbCBvdXQgb2YgdGhlIHN3aXBlVG9sZXJhbmNlWCBib3VuZHMgKi9cbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuX3RvdGFsTW92ZWRYKSA8IHRoaXMuc3dpcGVUb2xlcmFuY2VYICYmICF0aGlzLl9vZmZzZXRSZWNvcmRlZCkge1xuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG8odGhpcy5fc3RhcnRYLCBkZXN0WSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKlx0UmVjb3JkIHRoZSBkaXJlY3Rpb24gdGhlIGZpcnN0IHRpbWUgd2UgYXJlIG91dCBvZiB0aGUgc3dpcGVUb2xlcmFuY2VYIGJvdW5kcy5cbiAgICAgICAgICAgICpcdFRoYXQgd2F5IHdlIGtub3cgd2hpY2ggZGlyZWN0aW9uIHdlIGFwcGx5IHRoZSBvZmZzZXQgc28gaXQgZG9lc24ndCBoaWNrdXAgd2hlbiBtb3Zpbmcgb3V0IG9mIHRoZSBzd2lwZVRvbGVyYW5jZVggYm91bmRzICovXG4gICAgICAgICAgICBpZiAoIXRoaXMuX29mZnNldFJlY29yZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0RGlyZWN0aW9uID0gTWF0aC5zaWduKGRlc3RYIC0gdGhpcy5fc3RhcnRYKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vZmZzZXRSZWNvcmRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qXHRTY3JvbGwgd2l0aCBvZmZzZXQgYW1tb3V0IG9mIHN3aXBlVG9sZXJhbmNlWCBpbiB0aGUgZGlyZWN0aW9uIHdlIGhhdmUgZXhpdGVkIHRoZSBib3VuZHMgYW5kXG4gICAgICAgICAgICBkb24ndCBjaGFuZ2UgaXQgYWZ0ZXIgdGhhdCBldmVyIHVudGlsIHRvdWNoZW5kIGFuZCBhZ2FpbiB0b3VjaHN0YXJ0ICovXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxUbyhkZXN0WCAtIHRoaXMuX29mZnNldERpcmVjdGlvbiAqIHRoaXMuc3dpcGVUb2xlcmFuY2VYLCBkZXN0WSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPbiBTYWZhcmkgcHJldmVudGluZyB0aGUgdG91Y2htb3ZlIHdvdWxkIHByZXZlbnQgZGVmYXVsdCBwYWdlIHNjcm9sbCBiZWhhdmlvdXIgZXZlbiBpZiB0aGVyZSBpcyB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgb3ZlcmZsb3dcbiAgICAgICAgaWYgKHRoaXMuSWd4U2Nyb2xsSW5lcnRpYURpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50UGFyZW50U2Nyb2xsKGV2ZW50LCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIGxldCBzcGVlZFggPSAwO1xuICAgICAgICBsZXQgc3BlZWRZID0gMDtcblxuICAgICAgICAvLyBzYXZlZFNwZWVkc1ggYW5kIHNhdmVkU3BlZWRzWSBoYXZlIHNhbWUgbGVuZ3RoXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2F2ZWRTcGVlZHNYLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzcGVlZFggKz0gdGhpcy5fc2F2ZWRTcGVlZHNYW2ldO1xuICAgICAgICAgICAgc3BlZWRZICs9IHRoaXMuX3NhdmVkU3BlZWRzWVtpXTtcbiAgICAgICAgfVxuICAgICAgICBzcGVlZFggPSB0aGlzLl9zYXZlZFNwZWVkc1gubGVuZ3RoID8gc3BlZWRYIC8gdGhpcy5fc2F2ZWRTcGVlZHNYLmxlbmd0aCA6IDA7XG4gICAgICAgIHNwZWVkWSA9IHRoaXMuX3NhdmVkU3BlZWRzWC5sZW5ndGggPyBzcGVlZFkgLyB0aGlzLl9zYXZlZFNwZWVkc1kubGVuZ3RoIDogMDtcblxuICAgICAgICAvLyBVc2UgdGhlIGxhc3RNb3ZlZFggYW5kIGxhc3RNb3ZlZFkgdG8gZGV0ZXJtaW5lIGlmIHRoZSBzd2lwZSBzdG9wcyB3aXRob3V0IGxpZnRpbmcgdGhlIGZpbmdlciBzbyB3ZSBkb24ndCBzdGFydCBpbmVydGlhXG4gICAgICAgIGlmICgoTWF0aC5hYnMoc3BlZWRYKSA+IDAuMSB8fCBNYXRoLmFicyhzcGVlZFkpID4gMC4xKSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKHRoaXMuX2xhc3RNb3ZlZFgpID4gMiB8fCBNYXRoLmFicyh0aGlzLl9sYXN0TW92ZWRZKSA+IDIpKSB7XG4gICAgICAgICAgICB0aGlzLl9pbmVydGlhSW5pdChzcGVlZFgsIHNwZWVkWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuSWd4U2Nyb2xsSW5lcnRpYURpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50UGFyZW50U2Nyb2xsKGV2ZW50LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3Ntb290aFdoZWVsU2Nyb2xsKGRlbHRhKSB7XG4gICAgICAgIHRoaXMuX25leHRZID0gdGhpcy5JZ3hTY3JvbGxJbmVydGlhU2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcDtcbiAgICAgICAgdGhpcy5fbmV4dFggPSB0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgbGV0IHggPSAtMTtcbiAgICAgICAgbGV0IHdoZWVsSW5lcnRpYWxBbmltYXRpb24gPSBudWxsO1xuICAgICAgICBjb25zdCBpbmVydGlhV2hlZWxTdGVwID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHggPiAxKSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUod2hlZWxJbmVydGlhbEFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmV4dFNjcm9sbCA9ICgoLTMgKiB4ICogeCArIDMpICogZGVsdGEgKiAyKSAqIHRoaXMuc21vb3RoaW5nU3RlcDtcbiAgICAgICAgICAgIGlmICh0aGlzLklneFNjcm9sbEluZXJ0aWFEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0WSArPSBuZXh0U2Nyb2xsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvWSh0aGlzLl9uZXh0WSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX25leHRYICs9IG5leHRTY3JvbGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9YKHRoaXMuX25leHRYKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29udGludWUgdGhlIGluZXJ0aWFcbiAgICAgICAgICAgIHggKz0gMC4wOCAqICgxIC8gdGhpcy5zbW9vdGhpbmdEdXJhdGlvbik7XG4gICAgICAgICAgICB3aGVlbEluZXJ0aWFsQW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGluZXJ0aWFXaGVlbFN0ZXApO1xuICAgICAgICB9O1xuICAgICAgICB3aGVlbEluZXJ0aWFsQW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGluZXJ0aWFXaGVlbFN0ZXApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfaW5lcnRpYUluaXQoc3BlZWRYLCBzcGVlZFkpIHtcbiAgICAgICAgY29uc3Qgc3RlcE1vZGlmZXIgPSB0aGlzLmluZXJ0aWFTdGVwO1xuICAgICAgICBjb25zdCBpbmVydGlhRHVyYXRpb24gPSB0aGlzLmluZXJ0aWFEdXJhdGlvbjtcbiAgICAgICAgbGV0IHggPSAwO1xuICAgICAgICB0aGlzLl9uZXh0WCA9IHRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lci5zY3JvbGxMZWZ0O1xuICAgICAgICB0aGlzLl9uZXh0WSA9IHRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3A7XG5cbiAgICAgICAgLy8gU2V0cyB0aW1lb3V0IHVudGlsIGV4ZWN1dGluZyBuZXh0IG1vdmVtZW50IGl0ZXJhdGlvbiBvZiB0aGUgaW5lcnRpYVxuICAgICAgICBjb25zdCBpbmVydGlhU3RlcCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4ID4gNikge1xuICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RvdWNoSW5lcnRpYUFuaW1JRCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoc3BlZWRYKSA+IE1hdGguYWJzKHNwZWVkWSkpIHtcbiAgICAgICAgICAgICAgICB4ICs9IDAuMDUgLyAoMSAqIGluZXJ0aWFEdXJhdGlvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHggKz0gMC4wNSAvICgxICogaW5lcnRpYUR1cmF0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHggPD0gMSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIHVzZSBjb25zdGFudCBxdWF0aW9uIHRvIGRldGVybWluZSB0aGUgb2Zmc2V0IHdpdGhvdXQgc3BlZWQgZmFsbG9mZiBiZWZvciB4IHJlYWNoZXMgMVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzcGVlZFkpIDw9IE1hdGguYWJzKHNwZWVkWCkgKiB0aGlzLmluZXJ0aWFEZWx0YVkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dFggKz0gMSAqIHNwZWVkWCAqIDE1ICogc3RlcE1vZGlmZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzcGVlZFkpID49IE1hdGguYWJzKHNwZWVkWCkgKiB0aGlzLmluZXJ0aWFEZWx0YVgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dFkgKz0gMSAqIHNwZWVkWSAqIDE1ICogc3RlcE1vZGlmZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBXZSB1c2UgdGhlIHF1YXRpb24gXCJ5ID0gMiAvICh4ICsgMC41NSkgLSAwLjNcIiB0byBkZXRlcm1pbmUgdGhlIG9mZnNldFxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzcGVlZFkpIDw9IE1hdGguYWJzKHNwZWVkWCkgKiB0aGlzLmluZXJ0aWFEZWx0YVkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dFggKz0gTWF0aC5hYnMoMiAvICh4ICsgMC41NSkgLSAwLjMpICogc3BlZWRYICogMTUgKiBzdGVwTW9kaWZlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNwZWVkWSkgPj0gTWF0aC5hYnMoc3BlZWRYKSAqIHRoaXMuaW5lcnRpYURlbHRhWCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXh0WSArPSBNYXRoLmFicygyIC8gKHggKyAwLjU1KSAtIDAuMykgKiBzcGVlZFkgKiAxNSAqIHN0ZXBNb2RpZmVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBtaXhlZCBlbnZpcm9ubWVudCB3ZSB1c2UgdGhlIGRlZmF1bHQgYmVoYXZpb3VyLiBpLmUuIHRvdWNoc2NyZWVuICsgbW91c2VcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvKHRoaXMuX25leHRYLCB0aGlzLl9uZXh0WSk7XG5cbiAgICAgICAgICAgIHRoaXMuX3RvdWNoSW5lcnRpYUFuaW1JRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShpbmVydGlhU3RlcCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gU3RhcnQgaW5lcnRpYSBhbmQgY29udGludWUgaXQgcmVjdXJzaXZlbHlcbiAgICAgICAgdGhpcy5fdG91Y2hJbmVydGlhQW5pbUlEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGluZXJ0aWFTdGVwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNBeGlzQ29vcmRzKHRhcmdldCwgbWluLCBtYXgpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA8IG1pbikge1xuICAgICAgICAgICAgdGFyZ2V0ID0gbWluO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldCA+IG1heCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gbWF4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zY3JvbGxUbyhkZXN0WCwgZGVzdFkpIHtcbiAgICAgICAgLy8gVE9ETyBUcmlnZ2VyIHNjcm9sbGluZyBldmVudD9cbiAgICAgICAgY29uc3Qgc2Nyb2xsZWRYID0gdGhpcy5fc2Nyb2xsVG9YKGRlc3RYKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsZWRZID0gdGhpcy5fc2Nyb2xsVG9ZKGRlc3RZKTtcblxuICAgICAgICByZXR1cm4geyB4OiBzY3JvbGxlZFgsIHk6IHNjcm9sbGVkWSB9O1xuICAgIH1cbiAgICBwcml2YXRlIF9zY3JvbGxUb1goZGVzdCkge1xuICAgICAgICB0aGlzLklneFNjcm9sbEluZXJ0aWFTY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdCA9IGRlc3Q7XG4gICAgfVxuICAgIHByaXZhdGUgX3Njcm9sbFRvWShkZXN0KSB7XG4gICAgICAgIHRoaXMuSWd4U2Nyb2xsSW5lcnRpYVNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3AgPSBkZXN0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4U2Nyb2xsSW5lcnRpYURpcmVjdGl2ZV0sXG4gICAgZXhwb3J0czogW0lneFNjcm9sbEluZXJ0aWFEaXJlY3RpdmVdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdXG59KVxuXG5leHBvcnQgY2xhc3MgSWd4U2Nyb2xsSW5lcnRpYU1vZHVsZSB7XG59XG5cbiJdfQ==