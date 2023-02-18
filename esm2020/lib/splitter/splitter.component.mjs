import { Component, Input, ContentChildren, HostBinding, Inject, Output, EventEmitter, HostListener } from '@angular/core';
import { IgxSplitterPaneComponent } from './splitter-pane/splitter-pane.component';
import { DOCUMENT } from '@angular/common';
import { DragDirection } from '../directives/drag-drop/drag-drop.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../directives/drag-drop/drag-drop.directive";
/**
 * An enumeration that defines the `SplitterComponent` panes orientation.
 */
export var SplitterType;
(function (SplitterType) {
    SplitterType[SplitterType["Horizontal"] = 0] = "Horizontal";
    SplitterType[SplitterType["Vertical"] = 1] = "Vertical";
})(SplitterType || (SplitterType = {}));
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
export class IgxSplitterComponent {
    constructor(document, elementRef) {
        this.document = document;
        this.elementRef = elementRef;
        /**
         * @hidden @internal
         * Gets/Sets the `overflow` property of the current splitter.
         */
        this.overflow = 'hidden';
        /**
         * @hidden @internal
         * Sets/Gets the `display` property of the current splitter.
         */
        this.display = 'flex';
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
        this.resizeStart = new EventEmitter();
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
        this.resizing = new EventEmitter();
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
        this.resizeEnd = new EventEmitter();
        this._type = SplitterType.Horizontal;
    }
    /**
     * Gets/Sets the splitter orientation.
     *
     * @example
     * ```html
     * <igx-splitter [type]="type">...</igx-splitter>
     * ```
     */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
        this.resetPaneSizes();
    }
    /**
     * @hidden @internal
     * Gets the `flex-direction` property of the current `SplitterComponent`.
     */
    get direction() {
        return this.type === SplitterType.Horizontal ? 'row' : 'column';
    }
    /** @hidden @internal */
    ngAfterContentInit() {
        this.initPanes();
        this.panes.changes.subscribe(() => {
            this.initPanes();
        });
    }
    /**
     * @hidden @internal
     * This method performs  initialization logic when the user starts dragging the splitter bar between each pair of panes.
     * @param pane - the main pane associated with the currently dragged bar.
     */
    onMoveStart(pane) {
        const panes = this.panes.toArray();
        this.pane = pane;
        this.sibling = panes[panes.indexOf(this.pane) + 1];
        const paneRect = this.pane.element.getBoundingClientRect();
        this.initialPaneSize = this.type === SplitterType.Horizontal ? paneRect.width : paneRect.height;
        const siblingRect = this.sibling.element.getBoundingClientRect();
        this.initialSiblingSize = this.type === SplitterType.Horizontal ? siblingRect.width : siblingRect.height;
        const args = { pane: this.pane, sibling: this.sibling };
        this.resizeStart.emit(args);
    }
    /**
     * @hidden @internal
     * This method performs calculations concerning the sizes of each pair of panes when the bar between them is dragged.
     * @param delta - The difference along the X (or Y) axis between the initial and the current point when dragging the bar.
     */
    onMoving(delta) {
        const min = parseInt(this.pane.minSize, 10) || 0;
        const max = parseInt(this.pane.maxSize, 10) || this.initialPaneSize + this.initialSiblingSize;
        const minSibling = parseInt(this.sibling.minSize, 10) || 0;
        const maxSibling = parseInt(this.sibling.maxSize, 10) || this.initialPaneSize + this.initialSiblingSize;
        const paneSize = this.initialPaneSize - delta;
        const siblingSize = this.initialSiblingSize + delta;
        if (paneSize < min || paneSize > max || siblingSize < minSibling || siblingSize > maxSibling) {
            return;
        }
        this.pane.dragSize = paneSize + 'px';
        this.sibling.dragSize = siblingSize + 'px';
        const args = { pane: this.pane, sibling: this.sibling };
        this.resizing.emit(args);
    }
    onMoveEnd(delta) {
        const min = parseInt(this.pane.minSize, 10) || 0;
        const max = parseInt(this.pane.maxSize, 10) || this.initialPaneSize + this.initialSiblingSize;
        const minSibling = parseInt(this.sibling.minSize, 10) || 0;
        const maxSibling = parseInt(this.sibling.maxSize, 10) || this.initialPaneSize + this.initialSiblingSize;
        const paneSize = this.initialPaneSize - delta;
        const siblingSize = this.initialSiblingSize + delta;
        if (paneSize < min || paneSize > max || siblingSize < minSibling || siblingSize > maxSibling) {
            return;
        }
        if (this.pane.isPercentageSize) {
            // handle % resizes
            const totalSize = this.getTotalSize();
            const percentPaneSize = (paneSize / totalSize) * 100;
            this.pane.size = percentPaneSize + '%';
        }
        else {
            // px resize
            this.pane.size = paneSize + 'px';
        }
        if (this.sibling.isPercentageSize) {
            // handle % resizes
            const totalSize = this.getTotalSize();
            const percentSiblingPaneSize = (siblingSize / totalSize) * 100;
            this.sibling.size = percentSiblingPaneSize + '%';
        }
        else {
            // px resize
            this.sibling.size = siblingSize + 'px';
        }
        this.pane.dragSize = null;
        this.sibling.dragSize = null;
        const args = { pane: this.pane, sibling: this.sibling };
        this.resizeEnd.emit(args);
    }
    /** @hidden @internal */
    getPaneSiblingsByOrder(order, barIndex) {
        const panes = this.panes.toArray();
        const prevPane = panes[order - barIndex - 1];
        const nextPane = panes[order - barIndex];
        const siblings = [prevPane, nextPane];
        return siblings;
    }
    getTotalSize() {
        const computed = this.document.defaultView.getComputedStyle(this.elementRef.nativeElement);
        const totalSize = this.type === SplitterType.Horizontal ? computed.getPropertyValue('width') : computed.getPropertyValue('height');
        return parseFloat(totalSize);
    }
    /**
     * @hidden @internal
     * This method inits panes with properties.
     */
    initPanes() {
        this.panes.forEach(pane => pane.owner = this);
        this.assignFlexOrder();
        if (this.panes.filter(x => x.collapsed).length > 0) {
            // if any panes are collapsed, reset sizes.
            this.resetPaneSizes();
        }
    }
    /**
     * @hidden @internal
     * This method reset pane sizes.
     */
    resetPaneSizes() {
        if (this.panes) {
            // if type is changed runtime, should reset sizes.
            this.panes.forEach(x => x.size = 'auto');
        }
    }
    /**
     * @hidden @internal
     * This method assigns the order of each pane.
     */
    assignFlexOrder() {
        let k = 0;
        this.panes.forEach((pane) => {
            pane.order = k;
            k += 2;
        });
    }
}
IgxSplitterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterComponent, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxSplitterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSplitterComponent, selector: "igx-splitter", inputs: { type: "type" }, outputs: { resizeStart: "resizeStart", resizing: "resizing", resizeEnd: "resizeEnd" }, host: { properties: { "style.overflow": "this.overflow", "style.display": "this.display", "style.flex-direction": "this.direction" } }, queries: [{ propertyName: "panes", predicate: IgxSplitterPaneComponent, read: IgxSplitterPaneComponent }], ngImport: i0, template: "<ng-content select=\"igx-splitter-pane\"></ng-content>\n<ng-container *ngFor=\"let pane of panes; let last = last; let index= index;\">\n    <igx-splitter-bar *ngIf=\"!last\" [order]='pane.order + 1' role='separator'\n                    [type]=\"type\"\n                    [pane]=\"pane\"\n                    [siblings]='getPaneSiblingsByOrder(pane.order + 1, index)'\n                    (moveStart)=\"onMoveStart($event)\"\n                    (moving)=\"onMoving($event)\"\n                    (movingEnd)='onMoveEnd($event)'>\n    </igx-splitter-bar>\n</ng-container>\n", components: [{ type: i0.forwardRef(function () { return IgxSplitBarComponent; }), selector: "igx-splitter-bar", inputs: ["type", "order", "pane", "siblings"], outputs: ["moveStart", "moving", "movingEnd"] }], directives: [{ type: i0.forwardRef(function () { return i1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i0.forwardRef(function () { return i1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-splitter', template: "<ng-content select=\"igx-splitter-pane\"></ng-content>\n<ng-container *ngFor=\"let pane of panes; let last = last; let index= index;\">\n    <igx-splitter-bar *ngIf=\"!last\" [order]='pane.order + 1' role='separator'\n                    [type]=\"type\"\n                    [pane]=\"pane\"\n                    [siblings]='getPaneSiblingsByOrder(pane.order + 1, index)'\n                    (moveStart)=\"onMoveStart($event)\"\n                    (moving)=\"onMoving($event)\"\n                    (movingEnd)='onMoveEnd($event)'>\n    </igx-splitter-bar>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { panes: [{
                type: ContentChildren,
                args: [IgxSplitterPaneComponent, { read: IgxSplitterPaneComponent }]
            }], overflow: [{
                type: HostBinding,
                args: ['style.overflow']
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }], resizeStart: [{
                type: Output
            }], resizing: [{
                type: Output
            }], resizeEnd: [{
                type: Output
            }], type: [{
                type: Input
            }], direction: [{
                type: HostBinding,
                args: ['style.flex-direction']
            }] } });
export const SPLITTER_INTERACTION_KEYS = new Set('right down left up arrowright arrowdown arrowleft arrowup'.split(' '));
/**
 * @hidden @internal
 * Represents the draggable bar that visually separates panes and allows for changing their sizes.
 */
export class IgxSplitBarComponent {
    constructor() {
        /**
         * Set css class to the host element.
         */
        this.cssClass = 'igx-splitter-bar-host';
        /**
         * Gets/Sets the orientation.
         */
        this.type = SplitterType.Horizontal;
        /**
         * An event that is emitted whenever we start dragging the current `SplitBarComponent`.
         */
        this.moveStart = new EventEmitter();
        /**
         * An event that is emitted while we are dragging the current `SplitBarComponent`.
         */
        this.moving = new EventEmitter();
        this.movingEnd = new EventEmitter();
    }
    /**
     * @hidden
     * @internal
     */
    get tabindex() {
        return this.resizeDisallowed ? null : 0;
    }
    /**
     * @hidden
     * @internal
     */
    get orientation() {
        return this.type === SplitterType.Horizontal ? 'horizontal' : 'vertical';
    }
    /**
     * @hidden
     * @internal
     */
    get cursor() {
        if (this.resizeDisallowed) {
            return '';
        }
        return this.type === SplitterType.Horizontal ? 'col-resize' : 'row-resize';
    }
    /**
     * @hidden @internal
     */
    get prevButtonHidden() {
        return this.siblings[0].collapsed && !this.siblings[1].collapsed;
    }
    /**
     * @hidden @internal
     */
    keyEvent(event) {
        const key = event.key.toLowerCase();
        const ctrl = event.ctrlKey;
        event.stopPropagation();
        if (SPLITTER_INTERACTION_KEYS.has(key)) {
            event.preventDefault();
        }
        switch (key) {
            case 'arrowup':
            case 'up':
                if (this.type === SplitterType.Vertical) {
                    if (ctrl) {
                        this.onCollapsing(false);
                        break;
                    }
                    if (!this.resizeDisallowed) {
                        event.preventDefault();
                        this.moveStart.emit(this.pane);
                        this.moving.emit(10);
                    }
                }
                break;
            case 'arrowdown':
            case 'down':
                if (this.type === SplitterType.Vertical) {
                    if (ctrl) {
                        this.onCollapsing(true);
                        break;
                    }
                    if (!this.resizeDisallowed) {
                        event.preventDefault();
                        this.moveStart.emit(this.pane);
                        this.moving.emit(-10);
                    }
                }
                break;
            case 'arrowleft':
            case 'left':
                if (this.type === SplitterType.Horizontal) {
                    if (ctrl) {
                        this.onCollapsing(false);
                        break;
                    }
                    if (!this.resizeDisallowed) {
                        event.preventDefault();
                        this.moveStart.emit(this.pane);
                        this.moving.emit(10);
                    }
                }
                break;
            case 'arrowright':
            case 'right':
                if (this.type === SplitterType.Horizontal) {
                    if (ctrl) {
                        this.onCollapsing(true);
                        break;
                    }
                    if (!this.resizeDisallowed) {
                        event.preventDefault();
                        this.moveStart.emit(this.pane);
                        this.moving.emit(-10);
                    }
                }
                break;
            default:
                break;
        }
    }
    /**
     * @hidden @internal
     */
    get dragDir() {
        return this.type === SplitterType.Horizontal ? DragDirection.VERTICAL : DragDirection.HORIZONTAL;
    }
    /**
     * @hidden @internal
     */
    get nextButtonHidden() {
        return this.siblings[1].collapsed && !this.siblings[0].collapsed;
    }
    /**
     * @hidden @internal
     */
    onDragStart(event) {
        if (this.resizeDisallowed) {
            event.cancel = true;
            return;
        }
        this.startPoint = this.type === SplitterType.Horizontal ? event.startX : event.startY;
        this.moveStart.emit(this.pane);
    }
    /**
     * @hidden @internal
     */
    onDragMove(event) {
        const isHorizontal = this.type === SplitterType.Horizontal;
        const curr = isHorizontal ? event.pageX : event.pageY;
        const delta = this.startPoint - curr;
        if (delta !== 0) {
            this.moving.emit(delta);
            event.cancel = true;
            event.owner.element.nativeElement.style.transform = '';
        }
    }
    onDragEnd(event) {
        const isHorizontal = this.type === SplitterType.Horizontal;
        const curr = isHorizontal ? event.pageX : event.pageY;
        const delta = this.startPoint - curr;
        if (delta !== 0) {
            this.movingEnd.emit(delta);
        }
    }
    get resizeDisallowed() {
        const relatedTabs = this.siblings;
        return !!relatedTabs.find(x => x.resizable === false || x.collapsed === true);
    }
    /**
     * @hidden @internal
     */
    onCollapsing(next) {
        const prevSibling = this.siblings[0];
        const nextSibling = this.siblings[1];
        let target;
        if (next) {
            // if next is clicked when prev pane is hidden, show prev pane, else hide next pane.
            target = prevSibling.collapsed ? prevSibling : nextSibling;
        }
        else {
            // if prev is clicked when next pane is hidden, show next pane, else hide prev pane.
            target = nextSibling.collapsed ? nextSibling : prevSibling;
        }
        target.toggle();
    }
}
IgxSplitBarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxSplitBarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSplitBarComponent, selector: "igx-splitter-bar", inputs: { type: "type", order: "order", pane: "pane", siblings: "siblings" }, outputs: { moveStart: "moveStart", moving: "moving", movingEnd: "movingEnd" }, host: { listeners: { "keydown": "keyEvent($event)" }, properties: { "class.igx-splitter-bar-host": "this.cssClass", "style.order": "this.order", "attr.tabindex": "this.tabindex", "attr.aria-orientation": "this.orientation" } }, ngImport: i0, template: "<div class=\"igx-splitter-bar\"\n    [class.igx-splitter-bar--vertical]='type === 0'\n    [style.cursor]='cursor'\n    igxDrag\n    [ghost]=\"false\"\n    [dragDirection]='dragDir'\n    (dragStart)='onDragStart($event)'\n    (dragMove)=\"onDragMove($event)\"\n    (dragEnd)=\"onDragEnd($event)\"\n>\n    <div class=\"igx-splitter-bar__expander--start\" igxDragIgnore (click)='onCollapsing(false)' [hidden]='prevButtonHidden'></div>\n    <div class=\"igx-splitter-bar__handle\" ></div>\n    <div class=\"igx-splitter-bar__expander--end\" igxDragIgnore (click)='onCollapsing(true)' [hidden]='nextButtonHidden'></div>\n</div>\n", directives: [{ type: i2.IgxDragDirective, selector: "[igxDrag]", inputs: ["igxDrag", "dragTolerance", "dragDirection", "dragChannel", "ghost", "ghostClass", "ghostTemplate", "ghostHost", "ghostOffsetX", "ghostOffsetY"], outputs: ["dragStart", "dragMove", "dragEnd", "dragClick", "ghostCreate", "ghostDestroy", "transitioned"], exportAs: ["drag"] }, { type: i2.IgxDragIgnoreDirective, selector: "[igxDragIgnore]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-splitter-bar', template: "<div class=\"igx-splitter-bar\"\n    [class.igx-splitter-bar--vertical]='type === 0'\n    [style.cursor]='cursor'\n    igxDrag\n    [ghost]=\"false\"\n    [dragDirection]='dragDir'\n    (dragStart)='onDragStart($event)'\n    (dragMove)=\"onDragMove($event)\"\n    (dragEnd)=\"onDragEnd($event)\"\n>\n    <div class=\"igx-splitter-bar__expander--start\" igxDragIgnore (click)='onCollapsing(false)' [hidden]='prevButtonHidden'></div>\n    <div class=\"igx-splitter-bar__handle\" ></div>\n    <div class=\"igx-splitter-bar__expander--end\" igxDragIgnore (click)='onCollapsing(true)' [hidden]='nextButtonHidden'></div>\n</div>\n" }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-splitter-bar-host']
            }], type: [{
                type: Input
            }], order: [{
                type: HostBinding,
                args: ['style.order']
            }, {
                type: Input
            }], tabindex: [{
                type: HostBinding,
                args: ['attr.tabindex']
            }], orientation: [{
                type: HostBinding,
                args: ['attr.aria-orientation']
            }], pane: [{
                type: Input
            }], siblings: [{
                type: Input
            }], moveStart: [{
                type: Output
            }], moving: [{
                type: Output
            }], movingEnd: [{
                type: Output
            }], keyEvent: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3NwbGl0dGVyL3NwbGl0dGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zcGxpdHRlci9zcGxpdHRlci5jb21wb25lbnQuaHRtbCIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zcGxpdHRlci9zcGxpdHRlci1iYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxLQUFLLEVBQUUsZUFBZSxFQUFvQixXQUFXLEVBQUUsTUFBTSxFQUN2RixNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNuRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBMkMsTUFBTSw2Q0FBNkMsQ0FBQzs7OztBQUVySDs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDcEIsMkRBQVUsQ0FBQTtJQUNWLHVEQUFRLENBQUE7QUFDWixDQUFDLEVBSFcsWUFBWSxLQUFaLFlBQVksUUFHdkI7QUFPRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlCRztBQUtILE1BQU0sT0FBTyxvQkFBb0I7SUE0RjdCLFlBQXFDLFFBQVEsRUFBVSxVQUFzQjtRQUF4QyxhQUFRLEdBQVIsUUFBUSxDQUFBO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQWhGN0U7OztXQUdHO1FBRUksYUFBUSxHQUFHLFFBQVEsQ0FBQztRQUUzQjs7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ZW50LCBRdWVyeUxpc3QsIElucHV0LCBDb250ZW50Q2hpbGRyZW4sIEFmdGVyQ29udGVudEluaXQsIEhvc3RCaW5kaW5nLCBJbmplY3QsIEVsZW1lbnRSZWYsXG4gICAgIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneFNwbGl0dGVyUGFuZUNvbXBvbmVudCB9IGZyb20gJy4vc3BsaXR0ZXItcGFuZS9zcGxpdHRlci1wYW5lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEcmFnRGlyZWN0aW9uLCBJRHJhZ01vdmVFdmVudEFyZ3MsIElEcmFnU3RhcnRFdmVudEFyZ3MgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2RyYWctZHJvcC9kcmFnLWRyb3AuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBBbiBlbnVtZXJhdGlvbiB0aGF0IGRlZmluZXMgdGhlIGBTcGxpdHRlckNvbXBvbmVudGAgcGFuZXMgb3JpZW50YXRpb24uXG4gKi9cbmV4cG9ydCBlbnVtIFNwbGl0dGVyVHlwZSB7XG4gICAgSG9yaXpvbnRhbCxcbiAgICBWZXJ0aWNhbFxufVxuXG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSVNwbGl0dGVyQmFyUmVzaXplRXZlbnRBcmdzIHtcbiAgICBwYW5lOiBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQ7XG4gICAgc2libGluZzogSWd4U3BsaXR0ZXJQYW5lQ29tcG9uZW50O1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgZnJhbWV3b3JrIGZvciBhIHNpbXBsZSBsYXlvdXQsIHNwbGl0dGluZyB0aGUgdmlldyBob3Jpem9udGFsbHkgb3IgdmVydGljYWxseVxuICogaW50byBtdWx0aXBsZSBzbWFsbGVyIHJlc2l6YWJsZSBhbmQgY29sbGFwc2libGUgYXJlYXMuXG4gKlxuICogQGlneE1vZHVsZSBJZ3hTcGxpdHRlck1vZHVsZVxuICpcbiAqIEBpZ3hQYXJlbnQgTGF5b3V0c1xuICpcbiAqIEBpZ3hUaGVtZSBpZ3gtc3BsaXR0ZXItdGhlbWVcbiAqXG4gKiBAaWd4S2V5d29yZHMgc3BsaXR0ZXIgcGFuZXMgbGF5b3V0XG4gKlxuICogQGlneEdyb3VwIHByZXNlbnRhdGlvblxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8aWd4LXNwbGl0dGVyPlxuICogIDxpZ3gtc3BsaXR0ZXItcGFuZT5cbiAqICAgICAgLi4uXG4gKiAgPC9pZ3gtc3BsaXR0ZXItcGFuZT5cbiAqICA8aWd4LXNwbGl0dGVyLXBhbmU+XG4gKiAgICAgIC4uLlxuICogIDwvaWd4LXNwbGl0dGVyLXBhbmU+XG4gKiA8L2lneC1zcGxpdHRlcj5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lneC1zcGxpdHRlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NwbGl0dGVyLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hTcGxpdHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxpc3Qgb2Ygc3BsaXR0ZXIgcGFuZXMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBwYW5lcyA9IHRoaXMuc3BsaXR0ZXIucGFuZXM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQsIHsgcmVhZDogSWd4U3BsaXR0ZXJQYW5lQ29tcG9uZW50IH0pXG4gICAgcHVibGljIHBhbmVzITogUXVlcnlMaXN0PElneFNwbGl0dGVyUGFuZUNvbXBvbmVudD47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIEdldHMvU2V0cyB0aGUgYG92ZXJmbG93YCBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBzcGxpdHRlci5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLm92ZXJmbG93JylcbiAgICBwdWJsaWMgb3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogU2V0cy9HZXRzIHRoZSBgZGlzcGxheWAgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgc3BsaXR0ZXIuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5kaXNwbGF5JylcbiAgICBwdWJsaWMgZGlzcGxheSA9ICdmbGV4JztcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGZpcmVkIHdoZW4gcmVzaXppbmcgb2YgcGFuZXMgc3RhcnRzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zcGxpdHRlciAocmVzaXplU3RhcnQpPSdyZXNpemVTdGFydCgkZXZlbnQpJz5cbiAgICAgKiAgPGlneC1zcGxpdHRlci1wYW5lPi4uLjwvaWd4LXNwbGl0dGVyLXBhbmU+XG4gICAgICogPC9pZ3gtc3BsaXR0ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJlc2l6ZVN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxJU3BsaXR0ZXJCYXJSZXNpemVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBmaXJlZCB3aGVuIHJlc2l6aW5nIG9mIHBhbmVzIGlzIGluIHByb2dyZXNzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zcGxpdHRlciAocmVzaXppbmcpPSdyZXNpemluZygkZXZlbnQpJz5cbiAgICAgKiAgPGlneC1zcGxpdHRlci1wYW5lPi4uLjwvaWd4LXNwbGl0dGVyLXBhbmU+XG4gICAgICogPC9pZ3gtc3BsaXR0ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJU3BsaXR0ZXJCYXJSZXNpemVFdmVudEFyZ3M+KCk7XG5cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGZpcmVkIHdoZW4gcmVzaXppbmcgb2YgcGFuZXMgZW5kcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc3BsaXR0ZXIgKHJlc2l6ZUVuZCk9J3Jlc2l6ZUVuZCgkZXZlbnQpJz5cbiAgICAgKiAgPGlneC1zcGxpdHRlci1wYW5lPi4uLjwvaWd4LXNwbGl0dGVyLXBhbmU+XG4gICAgICogPC9pZ3gtc3BsaXR0ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJlc2l6ZUVuZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVNwbGl0dGVyQmFyUmVzaXplRXZlbnRBcmdzPigpO1xuXG4gICAgcHJpdmF0ZSBfdHlwZTogU3BsaXR0ZXJUeXBlID0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWw7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIEEgZmllbGQgdGhhdCBob2xkcyB0aGUgaW5pdGlhbCBzaXplIG9mIHRoZSBtYWluIGBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnRgIGluIGVhY2ggcGFpciBvZiBwYW5lcyBkaXZpZGVkIGJ5IGEgc3BsaXR0ZXIgYmFyLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdGlhbFBhbmVTaXplITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBBIGZpZWxkIHRoYXQgaG9sZHMgdGhlIGluaXRpYWwgc2l6ZSBvZiB0aGUgc2libGluZyBwYW5lIGluIGVhY2ggcGFpciBvZiBwYW5lcyBkaXZpZGVkIGJ5IGEgZ3JpcHBlci5cbiAgICAgKiBAbWVtYmVyb2YgU3BsaXR0ZXJDb21wb25lbnRcbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRpYWxTaWJsaW5nU2l6ZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogVGhlIG1haW4gcGFuZSBpbiBlYWNoIHBhaXIgb2YgcGFuZXMgZGl2aWRlZCBieSBhIGdyaXBwZXIuXG4gICAgICovXG4gICAgcHJpdmF0ZSBwYW5lITogSWd4U3BsaXR0ZXJQYW5lQ29tcG9uZW50O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNpYmxpbmcgcGFuZSBpbiBlYWNoIHBhaXIgb2YgcGFuZXMgZGl2aWRlZCBieSBhIHNwbGl0dGVyIGJhci5cbiAgICAgKi9cbiAgICBwcml2YXRlIHNpYmxpbmchOiBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwdWJsaWMgZG9jdW1lbnQsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIHNwbGl0dGVyIG9yaWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zcGxpdHRlciBbdHlwZV09XCJ0eXBlXCI+Li4uPC9pZ3gtc3BsaXR0ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IHR5cGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnJlc2V0UGFuZVNpemVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBHZXRzIHRoZSBgZmxleC1kaXJlY3Rpb25gIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IGBTcGxpdHRlckNvbXBvbmVudGAuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5mbGV4LWRpcmVjdGlvbicpXG4gICAgcHVibGljIGdldCBkaXJlY3Rpb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWwgPyAncm93JyA6ICdjb2x1bW4nO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdFBhbmVzKCk7XG4gICAgICAgIHRoaXMucGFuZXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0UGFuZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBUaGlzIG1ldGhvZCBwZXJmb3JtcyAgaW5pdGlhbGl6YXRpb24gbG9naWMgd2hlbiB0aGUgdXNlciBzdGFydHMgZHJhZ2dpbmcgdGhlIHNwbGl0dGVyIGJhciBiZXR3ZWVuIGVhY2ggcGFpciBvZiBwYW5lcy5cbiAgICAgKiBAcGFyYW0gcGFuZSAtIHRoZSBtYWluIHBhbmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50bHkgZHJhZ2dlZCBiYXIuXG4gICAgICovXG4gICAgcHVibGljIG9uTW92ZVN0YXJ0KHBhbmU6IElneFNwbGl0dGVyUGFuZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBwYW5lcyA9IHRoaXMucGFuZXMudG9BcnJheSgpO1xuICAgICAgICB0aGlzLnBhbmUgPSBwYW5lO1xuICAgICAgICB0aGlzLnNpYmxpbmcgPSBwYW5lc1twYW5lcy5pbmRleE9mKHRoaXMucGFuZSkgKyAxXTtcblxuICAgICAgICBjb25zdCBwYW5lUmVjdCA9IHRoaXMucGFuZS5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLmluaXRpYWxQYW5lU2l6ZSA9IHRoaXMudHlwZSA9PT0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWwgPyBwYW5lUmVjdC53aWR0aCA6IHBhbmVSZWN0LmhlaWdodDtcblxuICAgICAgICBjb25zdCBzaWJsaW5nUmVjdCA9IHRoaXMuc2libGluZy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLmluaXRpYWxTaWJsaW5nU2l6ZSA9IHRoaXMudHlwZSA9PT0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWwgPyBzaWJsaW5nUmVjdC53aWR0aCA6IHNpYmxpbmdSZWN0LmhlaWdodDtcbiAgICAgICAgY29uc3QgYXJnczogSVNwbGl0dGVyQmFyUmVzaXplRXZlbnRBcmdzID0ge3BhbmU6IHRoaXMucGFuZSwgc2libGluZzogdGhpcy5zaWJsaW5nfTtcbiAgICAgICAgdGhpcy5yZXNpemVTdGFydC5lbWl0KGFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogVGhpcyBtZXRob2QgcGVyZm9ybXMgY2FsY3VsYXRpb25zIGNvbmNlcm5pbmcgdGhlIHNpemVzIG9mIGVhY2ggcGFpciBvZiBwYW5lcyB3aGVuIHRoZSBiYXIgYmV0d2VlbiB0aGVtIGlzIGRyYWdnZWQuXG4gICAgICogQHBhcmFtIGRlbHRhIC0gVGhlIGRpZmZlcmVuY2UgYWxvbmcgdGhlIFggKG9yIFkpIGF4aXMgYmV0d2VlbiB0aGUgaW5pdGlhbCBhbmQgdGhlIGN1cnJlbnQgcG9pbnQgd2hlbiBkcmFnZ2luZyB0aGUgYmFyLlxuICAgICAqL1xuICAgIHB1YmxpYyBvbk1vdmluZyhkZWx0YTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG1pbiA9IHBhcnNlSW50KHRoaXMucGFuZS5taW5TaXplLCAxMCkgfHwgMDtcbiAgICAgICAgY29uc3QgbWF4ID0gcGFyc2VJbnQodGhpcy5wYW5lLm1heFNpemUsIDEwKSB8fCB0aGlzLmluaXRpYWxQYW5lU2l6ZSArIHRoaXMuaW5pdGlhbFNpYmxpbmdTaXplO1xuICAgICAgICBjb25zdCBtaW5TaWJsaW5nID0gcGFyc2VJbnQodGhpcy5zaWJsaW5nLm1pblNpemUsIDEwKSB8fCAwO1xuICAgICAgICBjb25zdCBtYXhTaWJsaW5nID0gcGFyc2VJbnQodGhpcy5zaWJsaW5nLm1heFNpemUsIDEwKSB8fCB0aGlzLmluaXRpYWxQYW5lU2l6ZSArIHRoaXMuaW5pdGlhbFNpYmxpbmdTaXplO1xuXG4gICAgICAgIGNvbnN0IHBhbmVTaXplID0gdGhpcy5pbml0aWFsUGFuZVNpemUgLSBkZWx0YTtcbiAgICAgICAgY29uc3Qgc2libGluZ1NpemUgPSB0aGlzLmluaXRpYWxTaWJsaW5nU2l6ZSArIGRlbHRhO1xuICAgICAgICBpZiAocGFuZVNpemUgPCBtaW4gfHwgcGFuZVNpemUgPiBtYXggfHwgc2libGluZ1NpemUgPCBtaW5TaWJsaW5nIHx8IHNpYmxpbmdTaXplID4gbWF4U2libGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFuZS5kcmFnU2l6ZSA9IHBhbmVTaXplICsgJ3B4JztcbiAgICAgICAgdGhpcy5zaWJsaW5nLmRyYWdTaXplID0gc2libGluZ1NpemUgKyAncHgnO1xuXG4gICAgICAgIGNvbnN0IGFyZ3M6IElTcGxpdHRlckJhclJlc2l6ZUV2ZW50QXJncyA9IHsgcGFuZTogdGhpcy5wYW5lLCBzaWJsaW5nOiB0aGlzLnNpYmxpbmcgfTtcbiAgICAgICAgdGhpcy5yZXNpemluZy5lbWl0KGFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1vdmVFbmQoZGVsdGE6IG51bWJlcikge1xuICAgICAgICBjb25zdCBtaW4gPSBwYXJzZUludCh0aGlzLnBhbmUubWluU2l6ZSwgMTApIHx8IDA7XG4gICAgICAgIGNvbnN0IG1heCA9IHBhcnNlSW50KHRoaXMucGFuZS5tYXhTaXplLCAxMCkgfHwgdGhpcy5pbml0aWFsUGFuZVNpemUgKyB0aGlzLmluaXRpYWxTaWJsaW5nU2l6ZTtcbiAgICAgICAgY29uc3QgbWluU2libGluZyA9IHBhcnNlSW50KHRoaXMuc2libGluZy5taW5TaXplLCAxMCkgfHwgMDtcbiAgICAgICAgY29uc3QgbWF4U2libGluZyA9IHBhcnNlSW50KHRoaXMuc2libGluZy5tYXhTaXplLCAxMCkgfHwgdGhpcy5pbml0aWFsUGFuZVNpemUgKyB0aGlzLmluaXRpYWxTaWJsaW5nU2l6ZTtcblxuICAgICAgICBjb25zdCBwYW5lU2l6ZSA9IHRoaXMuaW5pdGlhbFBhbmVTaXplIC0gZGVsdGE7XG4gICAgICAgIGNvbnN0IHNpYmxpbmdTaXplID0gdGhpcy5pbml0aWFsU2libGluZ1NpemUgKyBkZWx0YTtcblxuICAgICAgICBpZiAocGFuZVNpemUgPCBtaW4gfHwgcGFuZVNpemUgPiBtYXggfHwgc2libGluZ1NpemUgPCBtaW5TaWJsaW5nIHx8IHNpYmxpbmdTaXplID4gbWF4U2libGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhbmUuaXNQZXJjZW50YWdlU2l6ZSkge1xuICAgICAgICAgICAgLy8gaGFuZGxlICUgcmVzaXplc1xuICAgICAgICAgICAgY29uc3QgdG90YWxTaXplID0gdGhpcy5nZXRUb3RhbFNpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRQYW5lU2l6ZSA9IChwYW5lU2l6ZSAvIHRvdGFsU2l6ZSkgKiAxMDA7XG4gICAgICAgICAgICB0aGlzLnBhbmUuc2l6ZSA9IHBlcmNlbnRQYW5lU2l6ZSArICclJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHB4IHJlc2l6ZVxuICAgICAgICAgICAgdGhpcy5wYW5lLnNpemUgPSBwYW5lU2l6ZSArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaWJsaW5nLmlzUGVyY2VudGFnZVNpemUpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSAlIHJlc2l6ZXNcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsU2l6ZSA9IHRoaXMuZ2V0VG90YWxTaXplKCk7XG4gICAgICAgICAgICBjb25zdCBwZXJjZW50U2libGluZ1BhbmVTaXplID0gIChzaWJsaW5nU2l6ZSAvIHRvdGFsU2l6ZSkgKiAxMDA7XG4gICAgICAgICAgICB0aGlzLnNpYmxpbmcuc2l6ZSA9IHBlcmNlbnRTaWJsaW5nUGFuZVNpemUgKyAnJSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBweCByZXNpemVcbiAgICAgICAgICAgIHRoaXMuc2libGluZy5zaXplID0gc2libGluZ1NpemUgKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFuZS5kcmFnU2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2libGluZy5kcmFnU2l6ZSA9IG51bGw7XG5cbiAgICAgICAgY29uc3QgYXJnczogSVNwbGl0dGVyQmFyUmVzaXplRXZlbnRBcmdzID0geyBwYW5lOiB0aGlzLnBhbmUsIHNpYmxpbmc6IHRoaXMuc2libGluZyB9O1xuICAgICAgICB0aGlzLnJlc2l6ZUVuZC5lbWl0KGFyZ3MpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXRQYW5lU2libGluZ3NCeU9yZGVyKG9yZGVyOiBudW1iZXIsIGJhckluZGV4OiBudW1iZXIpOiBBcnJheTxJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQ+IHtcbiAgICAgICAgY29uc3QgcGFuZXMgPSB0aGlzLnBhbmVzLnRvQXJyYXkoKTtcbiAgICAgICAgY29uc3QgcHJldlBhbmUgPSBwYW5lc1tvcmRlciAtIGJhckluZGV4IC0gMV07XG4gICAgICAgIGNvbnN0IG5leHRQYW5lID0gcGFuZXNbb3JkZXIgLSBiYXJJbmRleF07XG4gICAgICAgIGNvbnN0IHNpYmxpbmdzID0gW3ByZXZQYW5lLCBuZXh0UGFuZV07XG4gICAgICAgIHJldHVybiBzaWJsaW5ncztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRvdGFsU2l6ZSgpIHtcbiAgICAgICAgY29uc3QgY29tcHV0ZWQgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICBjb25zdCB0b3RhbFNpemUgPSB0aGlzLnR5cGUgPT09IFNwbGl0dGVyVHlwZS5Ib3Jpem9udGFsID8gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSA6IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpO1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh0b3RhbFNpemUpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBUaGlzIG1ldGhvZCBpbml0cyBwYW5lcyB3aXRoIHByb3BlcnRpZXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBpbml0UGFuZXMoKSB7XG4gICAgICAgIHRoaXMucGFuZXMuZm9yRWFjaChwYW5lID0+IHBhbmUub3duZXIgPSB0aGlzKTtcbiAgICAgICAgdGhpcy5hc3NpZ25GbGV4T3JkZXIoKTtcbiAgICAgICAgaWYgKHRoaXMucGFuZXMuZmlsdGVyKHggPT4geC5jb2xsYXBzZWQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGlmIGFueSBwYW5lcyBhcmUgY29sbGFwc2VkLCByZXNldCBzaXplcy5cbiAgICAgICAgICAgIHRoaXMucmVzZXRQYW5lU2l6ZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogVGhpcyBtZXRob2QgcmVzZXQgcGFuZSBzaXplcy5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlc2V0UGFuZVNpemVzKCkge1xuICAgICAgICBpZiAodGhpcy5wYW5lcykge1xuICAgICAgICAgICAgLy8gaWYgdHlwZSBpcyBjaGFuZ2VkIHJ1bnRpbWUsIHNob3VsZCByZXNldCBzaXplcy5cbiAgICAgICAgICAgIHRoaXMucGFuZXMuZm9yRWFjaCh4ID0+IHguc2l6ZSA9ICdhdXRvJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIFRoaXMgbWV0aG9kIGFzc2lnbnMgdGhlIG9yZGVyIG9mIGVhY2ggcGFuZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzc2lnbkZsZXhPcmRlcigpIHtcbiAgICAgICAgbGV0IGsgPSAwO1xuICAgICAgICB0aGlzLnBhbmVzLmZvckVhY2goKHBhbmU6IElneFNwbGl0dGVyUGFuZUNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgcGFuZS5vcmRlciA9IGs7XG4gICAgICAgICAgICBrICs9IDI7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNQTElUVEVSX0lOVEVSQUNUSU9OX0tFWVMgPSBuZXcgU2V0KCdyaWdodCBkb3duIGxlZnQgdXAgYXJyb3dyaWdodCBhcnJvd2Rvd24gYXJyb3dsZWZ0IGFycm93dXAnLnNwbGl0KCcgJykpO1xuXG4vKipcbiAqIEBoaWRkZW4gQGludGVybmFsXG4gKiBSZXByZXNlbnRzIHRoZSBkcmFnZ2FibGUgYmFyIHRoYXQgdmlzdWFsbHkgc2VwYXJhdGVzIHBhbmVzIGFuZCBhbGxvd3MgZm9yIGNoYW5naW5nIHRoZWlyIHNpemVzLlxuICovXG4gQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtc3BsaXR0ZXItYmFyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vc3BsaXR0ZXItYmFyLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hTcGxpdEJhckNvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogU2V0IGNzcyBjbGFzcyB0byB0aGUgaG9zdCBlbGVtZW50LlxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LXNwbGl0dGVyLWJhci1ob3N0JylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LXNwbGl0dGVyLWJhci1ob3N0JztcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgb3JpZW50YXRpb24uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdHlwZTogU3BsaXR0ZXJUeXBlID0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWw7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGVsZW1lbnQgb3JkZXIuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5vcmRlcicpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgb3JkZXIhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnRhYmluZGV4JylcbiAgICBwdWJsaWMgZ2V0IHRhYmluZGV4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNpemVEaXNhbGxvd2VkID8gbnVsbCA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLW9yaWVudGF0aW9uJylcbiAgICBwdWJsaWMgZ2V0IG9yaWVudGF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBTcGxpdHRlclR5cGUuSG9yaXpvbnRhbCA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY3Vyc29yKCkge1xuICAgICAgICBpZiAodGhpcy5yZXNpemVEaXNhbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWwgPyAnY29sLXJlc2l6ZScgOiAncm93LXJlc2l6ZSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgU3BsaXRQYW5lQ29tcG9uZW50YCBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgYFNwbGl0QmFyQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBTcGxpdEJhckNvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBhbmUhOiBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL0dldHMgdGhlIGBTcGxpdFBhbmVDb21wb25lbnRgIHNpYmxpbmcgY29tcG9uZW50cyBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgYFNwbGl0QmFyQ29tcG9uZW50YC5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzaWJsaW5ncyE6IEFycmF5PElneFNwbGl0dGVyUGFuZUNvbXBvbmVudD47XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbmV2ZXIgd2Ugc3RhcnQgZHJhZ2dpbmcgdGhlIGN1cnJlbnQgYFNwbGl0QmFyQ29tcG9uZW50YC5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbW92ZVN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hpbGUgd2UgYXJlIGRyYWdnaW5nIHRoZSBjdXJyZW50IGBTcGxpdEJhckNvbXBvbmVudGAuXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG1vdmluZyA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG1vdmluZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gICAgLyoqXG4gICAgICogQSB0ZW1wb3JhcnkgaG9sZGVyIGZvciB0aGUgcG9pbnRlciBjb29yZGluYXRlcy5cbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXJ0UG9pbnQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcHJldkJ1dHRvbkhpZGRlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2libGluZ3NbMF0uY29sbGFwc2VkICYmICF0aGlzLnNpYmxpbmdzWzFdLmNvbGxhcHNlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBrZXlFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBrZXkgPSBldmVudC5rZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY3RybCA9IGV2ZW50LmN0cmxLZXk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiAoU1BMSVRURVJfSU5URVJBQ1RJT05fS0VZUy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhcnJvd3VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IFNwbGl0dGVyVHlwZS5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29sbGFwc2luZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmVzaXplRGlzYWxsb3dlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlU3RhcnQuZW1pdCh0aGlzLnBhbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nLmVtaXQoMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Fycm93ZG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnZG93bic6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IFNwbGl0dGVyVHlwZS5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29sbGFwc2luZyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZXNpemVEaXNhbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTdGFydC5lbWl0KHRoaXMucGFuZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcuZW1pdCgtMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Fycm93bGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IFNwbGl0dGVyVHlwZS5Ib3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3RybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db2xsYXBzaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZXNpemVEaXNhbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTdGFydC5lbWl0KHRoaXMucGFuZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcuZW1pdCgxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYXJyb3dyaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBTcGxpdHRlclR5cGUuSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29sbGFwc2luZyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZXNpemVEaXNhbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVTdGFydC5lbWl0KHRoaXMucGFuZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcuZW1pdCgtMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBkcmFnRGlyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBTcGxpdHRlclR5cGUuSG9yaXpvbnRhbCA/IERyYWdEaXJlY3Rpb24uVkVSVElDQUwgOiBEcmFnRGlyZWN0aW9uLkhPUklaT05UQUw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG5leHRCdXR0b25IaWRkZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpYmxpbmdzWzFdLmNvbGxhcHNlZCAmJiAhdGhpcy5zaWJsaW5nc1swXS5jb2xsYXBzZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnU3RhcnQoZXZlbnQ6IElEcmFnU3RhcnRFdmVudEFyZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplRGlzYWxsb3dlZCkge1xuICAgICAgICAgICAgZXZlbnQuY2FuY2VsID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSB0aGlzLnR5cGUgPT09IFNwbGl0dGVyVHlwZS5Ib3Jpem9udGFsID8gZXZlbnQuc3RhcnRYIDogZXZlbnQuc3RhcnRZO1xuICAgICAgICB0aGlzLm1vdmVTdGFydC5lbWl0KHRoaXMucGFuZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnTW92ZShldmVudDogSURyYWdNb3ZlRXZlbnRBcmdzKSB7XG4gICAgICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHRoaXMudHlwZSA9PT0gU3BsaXR0ZXJUeXBlLkhvcml6b250YWw7XG4gICAgICAgIGNvbnN0IGN1cnIgPSAgaXNIb3Jpem9udGFsID8gZXZlbnQucGFnZVggOiBldmVudC5wYWdlWTtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLnN0YXJ0UG9pbnQgLSBjdXJyO1xuICAgICAgICBpZiAoZGVsdGEgIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubW92aW5nLmVtaXQoZGVsdGEpO1xuICAgICAgICAgICAgZXZlbnQuY2FuY2VsID0gdHJ1ZTtcbiAgICAgICAgICAgIGV2ZW50Lm93bmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkRyYWdFbmQoZXZlbnQ6IGFueSkge1xuICAgICAgICBjb25zdCBpc0hvcml6b250YWwgPSB0aGlzLnR5cGUgPT09IFNwbGl0dGVyVHlwZS5Ib3Jpem9udGFsO1xuICAgICAgICBjb25zdCBjdXJyID0gIGlzSG9yaXpvbnRhbCA/IGV2ZW50LnBhZ2VYIDogZXZlbnQucGFnZVk7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5zdGFydFBvaW50IC0gY3VycjtcbiAgICAgICAgaWYgKGRlbHRhICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmluZ0VuZC5lbWl0KGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgcmVzaXplRGlzYWxsb3dlZCgpIHtcbiAgICAgICAgY29uc3QgcmVsYXRlZFRhYnMgPSB0aGlzLnNpYmxpbmdzO1xuICAgICAgICByZXR1cm4gISFyZWxhdGVkVGFicy5maW5kKHggPT4geC5yZXNpemFibGUgPT09IGZhbHNlIHx8IHguY29sbGFwc2VkID09PSB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNvbGxhcHNpbmcobmV4dDogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBwcmV2U2libGluZyA9IHRoaXMuc2libGluZ3NbMF07XG4gICAgICAgIGNvbnN0IG5leHRTaWJsaW5nID0gdGhpcy5zaWJsaW5nc1sxXTtcbiAgICAgICAgbGV0IHRhcmdldDtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgIC8vIGlmIG5leHQgaXMgY2xpY2tlZCB3aGVuIHByZXYgcGFuZSBpcyBoaWRkZW4sIHNob3cgcHJldiBwYW5lLCBlbHNlIGhpZGUgbmV4dCBwYW5lLlxuICAgICAgICAgICAgdGFyZ2V0ID0gcHJldlNpYmxpbmcuY29sbGFwc2VkID8gcHJldlNpYmxpbmcgOiBuZXh0U2libGluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHByZXYgaXMgY2xpY2tlZCB3aGVuIG5leHQgcGFuZSBpcyBoaWRkZW4sIHNob3cgbmV4dCBwYW5lLCBlbHNlIGhpZGUgcHJldiBwYW5lLlxuICAgICAgICAgICAgdGFyZ2V0ID0gbmV4dFNpYmxpbmcuY29sbGFwc2VkID8gbmV4dFNpYmxpbmcgOiBwcmV2U2libGluZztcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQudG9nZ2xlKCk7XG4gICAgfVxufVxuIiwiPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LXNwbGl0dGVyLXBhbmVcIj48L25nLWNvbnRlbnQ+XG48bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBwYW5lIG9mIHBhbmVzOyBsZXQgbGFzdCA9IGxhc3Q7IGxldCBpbmRleD0gaW5kZXg7XCI+XG4gICAgPGlneC1zcGxpdHRlci1iYXIgKm5nSWY9XCIhbGFzdFwiIFtvcmRlcl09J3BhbmUub3JkZXIgKyAxJyByb2xlPSdzZXBhcmF0b3InXG4gICAgICAgICAgICAgICAgICAgIFt0eXBlXT1cInR5cGVcIlxuICAgICAgICAgICAgICAgICAgICBbcGFuZV09XCJwYW5lXCJcbiAgICAgICAgICAgICAgICAgICAgW3NpYmxpbmdzXT0nZ2V0UGFuZVNpYmxpbmdzQnlPcmRlcihwYW5lLm9yZGVyICsgMSwgaW5kZXgpJ1xuICAgICAgICAgICAgICAgICAgICAobW92ZVN0YXJ0KT1cIm9uTW92ZVN0YXJ0KCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAobW92aW5nKT1cIm9uTW92aW5nKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAobW92aW5nRW5kKT0nb25Nb3ZlRW5kKCRldmVudCknPlxuICAgIDwvaWd4LXNwbGl0dGVyLWJhcj5cbjwvbmctY29udGFpbmVyPlxuIiwiPGRpdiBjbGFzcz1cImlneC1zcGxpdHRlci1iYXJcIlxuICAgIFtjbGFzcy5pZ3gtc3BsaXR0ZXItYmFyLS12ZXJ0aWNhbF09J3R5cGUgPT09IDAnXG4gICAgW3N0eWxlLmN1cnNvcl09J2N1cnNvcidcbiAgICBpZ3hEcmFnXG4gICAgW2dob3N0XT1cImZhbHNlXCJcbiAgICBbZHJhZ0RpcmVjdGlvbl09J2RyYWdEaXInXG4gICAgKGRyYWdTdGFydCk9J29uRHJhZ1N0YXJ0KCRldmVudCknXG4gICAgKGRyYWdNb3ZlKT1cIm9uRHJhZ01vdmUoJGV2ZW50KVwiXG4gICAgKGRyYWdFbmQpPVwib25EcmFnRW5kKCRldmVudClcIlxuPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtc3BsaXR0ZXItYmFyX19leHBhbmRlci0tc3RhcnRcIiBpZ3hEcmFnSWdub3JlIChjbGljayk9J29uQ29sbGFwc2luZyhmYWxzZSknIFtoaWRkZW5dPSdwcmV2QnV0dG9uSGlkZGVuJz48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LXNwbGl0dGVyLWJhcl9faGFuZGxlXCIgPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtc3BsaXR0ZXItYmFyX19leHBhbmRlci0tZW5kXCIgaWd4RHJhZ0lnbm9yZSAoY2xpY2spPSdvbkNvbGxhcHNpbmcodHJ1ZSknIFtoaWRkZW5dPSduZXh0QnV0dG9uSGlkZGVuJz48L2Rpdj5cbjwvZGl2PlxuIl19