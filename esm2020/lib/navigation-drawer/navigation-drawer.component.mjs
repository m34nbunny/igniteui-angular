import { Component, ContentChild, ElementRef, EventEmitter, HostBinding, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { HammerGesturesManager } from '../core/touch';
import { IgxNavDrawerMiniTemplateDirective, IgxNavDrawerTemplateDirective } from './navigation-drawer.directives';
import * as i0 from "@angular/core";
import * as i1 from "../core/navigation";
import * as i2 from "../core/touch";
import * as i3 from "../core/utils";
import * as i4 from "./navigation-drawer.directives";
import * as i5 from "@angular/common";
let NEXT_ID = 0;
/**
 * **Ignite UI for Angular Navigation Drawer** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/navdrawer)
 *
 * The Ignite UI Navigation Drawer is a collapsible side navigation container commonly used in combination with the Navbar.
 *
 * Example:
 * ```html
 * <igx-nav-drawer id="navigation" [isOpen]="true">
 *   <ng-template igxDrawer>
 *     <nav>
 *       <span igxDrawerItem [isHeader]="true">Email</span>
 *       <span igxDrawerItem igxRipple>Inbox</span>
 *       <span igxDrawerItem igxRipple>Deleted</span>
 *       <span igxDrawerItem igxRipple>Sent</span>
 *     </nav>
 *   </ng-template>
 * </igx-nav-drawer>
 * ```
 */
export class IgxNavigationDrawerComponent {
    constructor(elementRef, _state, renderer, _touchManager, platformUtil) {
        this.elementRef = elementRef;
        this._state = _state;
        this.renderer = renderer;
        this._touchManager = _touchManager;
        this.platformUtil = platformUtil;
        /** @hidden @internal */
        this.cssClass = true;
        /**
         * ID of the component
         *
         * ```typescript
         * // get
         * let myNavDrawerId = this.navdrawer.id;
         * ```
         *
         * ```html
         * <!--set-->
         *  <igx-nav-drawer id='navdrawer'></igx-nav-drawer>
         * ```
         */
        this.id = `igx-nav-drawer-${NEXT_ID++}`;
        /**
         * Position of the Navigation Drawer. Can be "left"(default) or "right".
         *
         * ```typescript
         * // get
         * let myNavDrawerPosition = this.navdrawer.position;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-nav-drawer [position]="'left'"></igx-nav-drawer>
         * ```
         */
        this.position = 'left';
        /**
         * Enables the use of touch gestures to manipulate the drawer:
         * - swipe/pan from edge to open, swipe-toggle and pan-drag.
         *
         * ```typescript
         * // get
         * let gesturesEnabled = this.navdrawer.enableGestures;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-nav-drawer [enableGestures]='true'></igx-nav-drawer>
         * ```
         */
        this.enableGestures = true;
        /**
         * @hidden
         */
        this.isOpenChange = new EventEmitter();
        /**
         * Minimum device width required for automatic pin to be toggled.
         * Default is 1024, can be set to a falsy value to disable this behavior.
         *
         * ```typescript
         * // get
         * let navDrawerPinThreshold = this.navdrawer.pinThreshold;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-nav-drawer [pinThreshold]='1024'></igx-nav-drawer>
         * ```
         */
        this.pinThreshold = 1024;
        /**
         * When pinned the drawer is relatively positioned instead of sitting above content.
         * May require additional layout styling.
         *
         * ```typescript
         * // get
         * let navDrawerIsPinned = this.navdrawer.pin;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-nav-drawer [pin]='false'></igx-nav-drawer>
         * ```
         */
        this.pin = false;
        /**
         * Width of the drawer in its open state. Defaults to "280px".
         *
         * ```typescript
         * // get
         * let navDrawerWidth = this.navdrawer.width;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-nav-drawer [width]="'228px'"></igx-nav-drawer>
         * ```
         */
        this.width = '280px';
        /**
         * Enables/disables the animation, when toggling the drawer. Set to `false` by default.
         * ````html
         * <igx-nav-drawer [disableAnimation]="true"></igx-nav-drawer>
         * ````
         */
        this.disableAnimation = false;
        /**
         * Width of the drawer in its mini state. Defaults to 68px.
         *
         * ```typescript
         * // get
         * let navDrawerMiniWidth = this.navdrawer.miniWidth;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-nav-drawer [miniWidth]="'34px'"></igx-nav-drawer>
         * ```
         */
        this.miniWidth = '68px';
        /**
         * Pinned state change output for two-way binding.
         *
         * ```html
         * <igx-nav-drawer [(pin)]='isPinned'></igx-nav-drawer>
         * ```
         */
        this.pinChange = new EventEmitter(true);
        /**
         * Event fired as the Navigation Drawer is about to open.
         *
         * ```html
         *  <igx-nav-drawer (opening)='onOpening()'></igx-nav-drawer>
         * ```
         */
        this.opening = new EventEmitter();
        /**
         * Event fired when the Navigation Drawer has opened.
         *
         * ```html
         * <igx-nav-drawer (opened)='onOpened()'></igx-nav-drawer>
         * ```
         */
        this.opened = new EventEmitter();
        /**
         * Event fired as the Navigation Drawer is about to close.
         *
         * ```html
         * <igx-nav-drawer (closing)='onClosing()'></igx-nav-drawer>
         * ```
         */
        this.closing = new EventEmitter();
        /**
         * Event fired when the Navigation Drawer has closed.
         *
         * ```html
         * <igx-nav-drawer (closed)='onClosed()'></igx-nav-drawer>
         * ```
         */
        this.closed = new EventEmitter();
        this._isOpen = false;
        this._gesturesAttached = false;
        this._widthCache = { width: null, miniWidth: null, windowWidth: null };
        this.css = {
            drawer: 'igx-nav-drawer__aside',
            mini: 'igx-nav-drawer__aside--mini',
            overlay: 'igx-nav-drawer__overlay',
            styleDummy: 'igx-nav-drawer__style-dummy'
        };
        /** Pan animation properties */
        this._panning = false;
        this._maxEdgeZone = 50;
        this.checkPinThreshold = (evt) => {
            if (!this.platformUtil.isBrowser) {
                return;
            }
            let windowWidth;
            if (this.pinThreshold) {
                windowWidth = this.getWindowWidth();
                if (evt && this._widthCache.windowWidth === windowWidth) {
                    return;
                }
                this._widthCache.windowWidth = windowWidth;
                if (!this.pin && windowWidth >= this.pinThreshold) {
                    this.pin = true;
                    this.pinChange.emit(true);
                }
                else if (this.pin && windowWidth < this.pinThreshold) {
                    this.pin = false;
                    this.pinChange.emit(false);
                }
            }
        };
        this.swipe = (evt) => {
            // TODO: Could also force input type: http://stackoverflow.com/a/27108052
            if (!this.enableGestures || evt.pointerType !== 'touch') {
                return;
            }
            // HammerJS swipe is horizontal-only by default, don't check deltaY
            let deltaX;
            let startPosition;
            if (this.position === 'right') {
                // when on the right use inverse of deltaX
                deltaX = -evt.deltaX;
                startPosition = this.getWindowWidth() - (evt.center.x + evt.distance);
            }
            else {
                deltaX = evt.deltaX;
                startPosition = evt.center.x - evt.distance;
            }
            // only accept closing swipe (ignoring minEdgeZone) when the drawer is expanded:
            if ((this.isOpen && deltaX < 0) ||
                // positive deltaX from the edge:
                (deltaX > 0 && startPosition < this.maxEdgeZone)) {
                this.toggle();
            }
        };
        this.panstart = (evt) => {
            if (!this.enableGestures || this.pin || evt.pointerType !== 'touch') {
                return;
            }
            const startPosition = this.position === 'right' ? this.getWindowWidth() - (evt.center.x + evt.distance)
                : evt.center.x - evt.distance;
            // cache width during animation, flag to allow further handling
            if (this.isOpen || (startPosition < this.maxEdgeZone)) {
                this._panning = true;
                this._panStartWidth = this.getExpectedWidth(!this.isOpen);
                this._panLimit = this.getExpectedWidth(this.isOpen);
                this.renderer.addClass(this.overlay, 'panning');
                this.renderer.addClass(this.drawer, 'panning');
            }
        };
        this.pan = (evt) => {
            // TODO: input.deltaX = prevDelta.x + (center.x - offset.x);
            // get actual delta (not total session one) from event?
            // pan WILL also fire after a full swipe, only resize on flag
            if (!this._panning) {
                return;
            }
            const right = this.position === 'right';
            // when on the right use inverse of deltaX
            const deltaX = right ? -evt.deltaX : evt.deltaX;
            let newX;
            let percent;
            const visibleWidth = this._panStartWidth + deltaX;
            if (this.isOpen && deltaX < 0) {
                // when visibleWidth hits limit - stop animating
                if (visibleWidth <= this._panLimit) {
                    return;
                }
                if (this.hasAnimateWidth) {
                    percent = (visibleWidth - this._panLimit) / (this._panStartWidth - this._panLimit);
                    newX = visibleWidth;
                }
                else {
                    percent = visibleWidth / this._panStartWidth;
                    newX = evt.deltaX;
                }
                this.setXSize(newX, percent.toPrecision(2));
            }
            else if (!this.isOpen && deltaX > 0) {
                // when visibleWidth hits limit - stop animating
                if (visibleWidth >= this._panLimit) {
                    return;
                }
                if (this.hasAnimateWidth) {
                    percent = (visibleWidth - this._panStartWidth) / (this._panLimit - this._panStartWidth);
                    newX = visibleWidth;
                }
                else {
                    percent = visibleWidth / this._panLimit;
                    newX = (this._panLimit - visibleWidth) * (right ? 1 : -1);
                }
                this.setXSize(newX, percent.toPrecision(2));
            }
        };
        this.panEnd = (evt) => {
            if (this._panning) {
                const deltaX = this.position === 'right' ? -evt.deltaX : evt.deltaX;
                const visibleWidth = this._panStartWidth + deltaX;
                this.resetPan();
                // check if pan brought the drawer to 50%
                if (this.isOpen && visibleWidth <= this._panStartWidth / 2) {
                    this.close();
                }
                else if (!this.isOpen && visibleWidth >= this._panLimit / 2) {
                    this.open();
                }
                this._panStartWidth = null;
            }
        };
        this.toggleOpenedEvent = () => {
            this.elementRef.nativeElement.removeEventListener('transitionend', this.toggleOpenedEvent, false);
            this.opened.emit();
        };
        this.toggleClosedEvent = () => {
            this.elementRef.nativeElement.removeEventListener('transitionend', this.toggleClosedEvent, false);
            this.closed.emit();
        };
    }
    /**
     * State of the drawer.
     *
     * ```typescript
     * // get
     * let navDrawerIsOpen = this.navdrawer.isOpen;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-nav-drawer [isOpen]='false'></igx-nav-drawer>
     * ```
     *
     * Two-way data binding.
     * ```html
     * <!--set-->
     * <igx-nav-drawer [(isOpen)]='model.isOpen'></igx-nav-drawer>
     * ```
     */
    get isOpen() {
        return this._isOpen;
    }
    set isOpen(value) {
        this._isOpen = value;
        this.isOpenChange.emit(this._isOpen);
    }
    /**
     * Returns nativeElement of the component.
     *
     * @hidden
     */
    get element() {
        return this.elementRef.nativeElement;
    }
    /**
     * @hidden
     */
    get template() {
        if (this.miniTemplate && !this.isOpen) {
            return this.miniTemplate.template;
        }
        else if (this.contentTemplate) {
            return this.contentTemplate.template;
        }
    }
    /**
     * @hidden
     */
    get miniTemplate() {
        return this._miniTemplate;
    }
    /**
     * @hidden
     */
    set miniTemplate(v) {
        if (!this.isOpen) {
            this.setDrawerWidth(v ? this.miniWidth : '');
        }
        this._miniTemplate = v;
    }
    /**
     * @hidden
     */
    get flexWidth() {
        if (!this.pin) {
            return '0px';
        }
        if (this.isOpen) {
            return this.width;
        }
        if (this.miniTemplate && this.miniWidth) {
            return this.miniWidth;
        }
        return '0px';
    }
    /** @hidden */
    get isPinnedRight() {
        return this.pin && this.position === 'right' ? '1' : '0';
    }
    /**
     * @hidden
     */
    get drawer() {
        return this._drawer.nativeElement;
    }
    /**
     * @hidden
     */
    get overlay() {
        return this._overlay.nativeElement;
    }
    /**
     * @hidden
     */
    get styleDummy() {
        return this._styleDummy.nativeElement;
    }
    /**
     * Property to decide whether to change width or translate the drawer from pan gesture.
     *
     * @hidden
     */
    get hasAnimateWidth() {
        return this.pin || !!this.miniTemplate;
    }
    /**
     * Used for touch gestures (swipe and pan).
     * Defaults to 50 (in px) and is extended to at least 110% of the mini template width if available.
     *
     * @hidden
     */
    get maxEdgeZone() {
        return this._maxEdgeZone;
    }
    /**
     * Gets the Drawer width for specific state.
     * Will attempt to evaluate requested state and cache.
     *
     *
     * @hidden
     */
    get expectedWidth() {
        return this.getExpectedWidth(false);
    }
    /**
     * Get the Drawer mini width for specific state.
     * Will attempt to evaluate requested state and cache.
     *
     * @hidden
     */
    get expectedMiniWidth() {
        return this.getExpectedWidth(true);
    }
    /**
     * @hidden
     */
    get touchManager() {
        return this._touchManager;
    }
    /**
     * Exposes optional navigation service
     *
     * @hidden
     */
    get state() {
        return this._state;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        // DOM and @Input()-s initialized
        if (this._state) {
            this._state.add(this.id, this);
        }
        if (this.isOpen) {
            this.setDrawerWidth(this.width);
        }
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        // wait for template and ng-content to be ready
        this.updateEdgeZone();
        this.checkPinThreshold();
        this.ensureEvents();
        // TODO: apply platform-safe Ruler from http://plnkr.co/edit/81nWDyreYMzkunihfRgX?p=preview
        // (https://github.com/angular/angular/issues/6515), blocked by https://github.com/angular/angular/issues/6904
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this._touchManager.destroy();
        if (this._state) {
            this._state.remove(this.id);
        }
        if (this._resizeObserver) {
            this._resizeObserver.unsubscribe();
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        // simple settings can come from attribute set (rather than binding), make sure boolean props are converted
        if (changes.enableGestures && changes.enableGestures.currentValue !== undefined) {
            this.enableGestures = !!(this.enableGestures && this.enableGestures.toString() === 'true');
            this.ensureEvents();
        }
        if (changes.pin && changes.pin.currentValue !== undefined) {
            this.pin = !!(this.pin && this.pin.toString() === 'true');
            if (this.pin) {
                this._touchManager.destroy();
                this._gesturesAttached = false;
            }
            else {
                this.ensureEvents();
            }
        }
        if (changes.pinThreshold) {
            if (this.pinThreshold) {
                this.ensureEvents();
                this.checkPinThreshold();
            }
        }
        if (changes.width && this.isOpen) {
            this.setDrawerWidth(changes.width.currentValue);
        }
        if (changes.isOpen) {
            this.setDrawerWidth(this.isOpen ? this.width : (this.miniTemplate ? this.miniWidth : ''));
        }
        if (changes.miniWidth) {
            if (!this.isOpen) {
                this.setDrawerWidth(changes.miniWidth.currentValue);
            }
            this.updateEdgeZone();
        }
    }
    /**
     * Toggle the open state of the Navigation Drawer.
     *
     * ```typescript
     * this.navdrawer.toggle();
     * ```
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Open the Navigation Drawer. Has no effect if already opened.
     *
     * ```typescript
     * this.navdrawer.open();
     * ```
     */
    open() {
        if (this._panning) {
            this.resetPan();
        }
        if (this.isOpen) {
            return;
        }
        this.opening.emit();
        this.isOpen = true;
        // TODO: Switch to animate API when available
        // var animationCss = this.animate.css();
        //     animationCss
        //         .setStyles({'width':'50px'}, {'width':'400px'})
        //         .start(this.elementRef.nativeElement)
        //         .onComplete(() => animationCss.setToStyles({'width':'auto'}).start(this.elementRef.nativeElement));
        this.elementRef.nativeElement.addEventListener('transitionend', this.toggleOpenedEvent, false);
        this.setDrawerWidth(this.width);
    }
    /**
     * Close the Navigation Drawer. Has no effect if already closed.
     *
     * ```typescript
     * this.navdrawer.close();
     * ```
     */
    close() {
        if (this._panning) {
            this.resetPan();
        }
        if (!this.isOpen) {
            return;
        }
        this.closing.emit();
        this.isOpen = false;
        this.setDrawerWidth(this.miniTemplate ? this.miniWidth : '');
        this.elementRef.nativeElement.addEventListener('transitionend', this.toggleClosedEvent, false);
    }
    /**
     * @hidden
     */
    set_maxEdgeZone(value) {
        this._maxEdgeZone = value;
    }
    /**
     * Get the Drawer width for specific state. Will attempt to evaluate requested state and cache.
     *
     * @hidden
     * @param [mini] - Request mini width instead
     */
    getExpectedWidth(mini) {
        if (mini) {
            if (!this.miniTemplate) {
                return 0;
            }
            if (this.miniWidth) {
                return parseFloat(this.miniWidth);
            }
            else {
                // if (!this.isOpen) { // This WON'T work due to transition timings...
                //     return this.elementRef.nativeElement.children[1].offsetWidth;
                // } else {
                if (this._widthCache.miniWidth === null) {
                    // force class for width calc. TODO?
                    // force class for width calc. TODO?
                    this.renderer.addClass(this.styleDummy, this.css.drawer);
                    this.renderer.addClass(this.styleDummy, this.css.mini);
                    this._widthCache.miniWidth = this.styleDummy.offsetWidth;
                    this.renderer.removeClass(this.styleDummy, this.css.drawer);
                    this.renderer.removeClass(this.styleDummy, this.css.mini);
                }
                return this._widthCache.miniWidth;
            }
        }
        else {
            if (this.width) {
                return parseFloat(this.width);
            }
            else {
                if (this._widthCache.width === null) {
                    // force class for width calc. TODO?
                    // force class for width calc. TODO?
                    this.renderer.addClass(this.styleDummy, this.css.drawer);
                    this._widthCache.width = this.styleDummy.offsetWidth;
                    this.renderer.removeClass(this.styleDummy, this.css.drawer);
                }
                return this._widthCache.width;
            }
        }
    }
    getWindowWidth() {
        return (window.innerWidth > 0) ? window.innerWidth : screen.width;
    }
    /**
     * Sets the drawer width.
     */
    setDrawerWidth(width) {
        if (this.platformUtil.isBrowser) {
            requestAnimationFrame(() => {
                if (this.drawer) {
                    this.renderer.setStyle(this.drawer, 'width', width);
                }
            });
        }
        else {
            this.renderer.setStyle(this.drawer, 'width', width);
        }
    }
    /**
     * Get current Drawer width.
     */
    getDrawerWidth() {
        return this.drawer.offsetWidth;
    }
    ensureEvents() {
        // set listeners for swipe/pan only if needed, but just once
        if (this.enableGestures && !this.pin && !this._gesturesAttached) {
            // Built-in manager handler(L20887) causes endless loop and max stack exception.
            // https://github.com/angular/angular/issues/6993
            // Use ours for now (until beta.10):
            // this.renderer.listen(document, "swipe", this.swipe);
            this._touchManager.addGlobalEventListener('document', 'swipe', this.swipe);
            this._gesturesAttached = true;
            // this.renderer.listen(document, "panstart", this.panstart);
            // this.renderer.listen(document, "pan", this.pan);
            this._touchManager.addGlobalEventListener('document', 'panstart', this.panstart);
            this._touchManager.addGlobalEventListener('document', 'panmove', this.pan);
            this._touchManager.addGlobalEventListener('document', 'panend', this.panEnd);
        }
        if (!this._resizeObserver && this.platformUtil.isBrowser) {
            this._resizeObserver = fromEvent(window, 'resize').pipe(debounce(() => interval(150)))
                .subscribe((value) => {
                this.checkPinThreshold(value);
            });
        }
    }
    updateEdgeZone() {
        let maxValue;
        if (this.miniTemplate) {
            maxValue = Math.max(this._maxEdgeZone, this.getExpectedWidth(true) * 1.1);
            this.set_maxEdgeZone(maxValue);
        }
    }
    resetPan() {
        this._panning = false;
        /* styles fail to apply when set on parent due to extra attributes, prob ng bug */
        /* styles fail to apply when set on parent due to extra attributes, prob ng bug */
        this.renderer.removeClass(this.overlay, 'panning');
        this.renderer.removeClass(this.drawer, 'panning');
        this.setXSize(0, '');
    }
    /**
     * Sets the absolute position or width in case the drawer doesn't change position.
     *
     * @param x the number pixels to translate on the X axis or the width to set. 0 width will clear the style instead.
     * @param opacity optional value to apply to the overlay
     */
    setXSize(x, opacity) {
        // Angular polyfills patches window.requestAnimationFrame, but switch to DomAdapter API (TODO)
        window.requestAnimationFrame(() => {
            if (this.hasAnimateWidth) {
                this.renderer.setStyle(this.drawer, 'width', x ? Math.abs(x) + 'px' : '');
            }
            else {
                this.renderer.setStyle(this.drawer, 'transform', x ? 'translate3d(' + x + 'px,0,0)' : '');
                this.renderer.setStyle(this.drawer, '-webkit-transform', x ? 'translate3d(' + x + 'px,0,0)' : '');
            }
            if (opacity !== undefined) {
                this.renderer.setStyle(this.overlay, 'opacity', opacity);
            }
        });
    }
}
IgxNavigationDrawerComponent.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxNavigationDrawerComponent, deps: [{ token: ElementRef }, { token: i1.IgxNavigationService, optional: true }, { token: i0.Renderer2 }, { token: i2.HammerGesturesManager }, { token: i3.PlatformUtil }], target: i0.????FactoryTarget.Component });
IgxNavigationDrawerComponent.??cmp = i0.????ngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxNavigationDrawerComponent, selector: "igx-nav-drawer", inputs: { id: "id", position: "position", enableGestures: "enableGestures", pinThreshold: "pinThreshold", pin: "pin", width: "width", disableAnimation: "disableAnimation", miniWidth: "miniWidth", isOpen: "isOpen" }, outputs: { isOpenChange: "isOpenChange", pinChange: "pinChange", opening: "opening", opened: "opened", closing: "closing", closed: "closed" }, host: { properties: { "class.igx-nav-drawer": "this.cssClass", "attr.id": "this.id", "class.igx-nav-drawer--disable-animation": "this.disableAnimation", "style.flexBasis": "this.flexWidth", "style.order": "this.isPinnedRight" } }, providers: [HammerGesturesManager], queries: [{ propertyName: "contentTemplate", first: true, predicate: IgxNavDrawerTemplateDirective, descendants: true, read: IgxNavDrawerTemplateDirective }, { propertyName: "miniTemplate", first: true, predicate: IgxNavDrawerMiniTemplateDirective, descendants: true, read: IgxNavDrawerMiniTemplateDirective }], viewQueries: [{ propertyName: "_drawer", first: true, predicate: ["aside"], descendants: true, static: true }, { propertyName: "_overlay", first: true, predicate: ["overlay"], descendants: true, static: true }, { propertyName: "_styleDummy", first: true, predicate: ["dummy"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<ng-template #defaultItemsTemplate>\n    <div igxDrawerItem [isHeader]=\"true\">Navigation Drawer</div>\n    <div igxDrawerItem> Start by adding</div>\n    <div igxDrawerItem> <code>&lt;ng-template igxDrawer&gt;</code> </div>\n    <div igxDrawerItem> And some items inside </div>\n    <div igxDrawerItem> Style with igxDrawerItem </div>\n    <div igxDrawerItem> and igxRipple directives</div>\n</ng-template>\n\n<div [hidden]=\"pin\"\n    class=\"igx-nav-drawer__overlay\"\n    [class.igx-nav-drawer__overlay--hidden]=\"!isOpen\"\n    [class.igx-nav-drawer--disable-animation]=\"disableAnimation\"\n    (click)=\"close()\" #overlay>\n</div>\n<aside role=\"navigation\"\n    class=\"igx-nav-drawer__aside\"\n    [class.igx-nav-drawer__aside--collapsed]=\"!miniTemplate && !isOpen\"\n    [class.igx-nav-drawer__aside--mini]=\"miniTemplate && !isOpen\"\n    [class.igx-nav-drawer__aside--normal]=\"!miniTemplate || isOpen\"\n    [class.igx-nav-drawer__aside--pinned]=\"pin\"\n    [class.igx-nav-drawer__aside--right]=\"position === 'right'\" #aside\n    [class.igx-nav-drawer--disable-animation]=\"disableAnimation\">\n\n    <ng-container *ngTemplateOutlet=\"template || defaultItemsTemplate\"></ng-container>\n</aside>\n<div class=\"igx-nav-drawer__style-dummy\" #dummy></div>\n", styles: [":host{display:block;height:100%}\n"], directives: [{ type: i4.IgxNavDrawerItemDirective, selector: "[igxDrawerItem]", inputs: ["active", "isHeader"], exportAs: ["igxDrawerItem"] }, { type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxNavigationDrawerComponent, decorators: [{
            type: Component,
            args: [{ providers: [HammerGesturesManager], selector: 'igx-nav-drawer', styles: [`
        :host {
            display: block;
            height: 100%;
        }
    `], template: "<ng-template #defaultItemsTemplate>\n    <div igxDrawerItem [isHeader]=\"true\">Navigation Drawer</div>\n    <div igxDrawerItem> Start by adding</div>\n    <div igxDrawerItem> <code>&lt;ng-template igxDrawer&gt;</code> </div>\n    <div igxDrawerItem> And some items inside </div>\n    <div igxDrawerItem> Style with igxDrawerItem </div>\n    <div igxDrawerItem> and igxRipple directives</div>\n</ng-template>\n\n<div [hidden]=\"pin\"\n    class=\"igx-nav-drawer__overlay\"\n    [class.igx-nav-drawer__overlay--hidden]=\"!isOpen\"\n    [class.igx-nav-drawer--disable-animation]=\"disableAnimation\"\n    (click)=\"close()\" #overlay>\n</div>\n<aside role=\"navigation\"\n    class=\"igx-nav-drawer__aside\"\n    [class.igx-nav-drawer__aside--collapsed]=\"!miniTemplate && !isOpen\"\n    [class.igx-nav-drawer__aside--mini]=\"miniTemplate && !isOpen\"\n    [class.igx-nav-drawer__aside--normal]=\"!miniTemplate || isOpen\"\n    [class.igx-nav-drawer__aside--pinned]=\"pin\"\n    [class.igx-nav-drawer__aside--right]=\"position === 'right'\" #aside\n    [class.igx-nav-drawer--disable-animation]=\"disableAnimation\">\n\n    <ng-container *ngTemplateOutlet=\"template || defaultItemsTemplate\"></ng-container>\n</aside>\n<div class=\"igx-nav-drawer__style-dummy\" #dummy></div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef, decorators: [{
                    type: Inject,
                    args: [ElementRef]
                }] }, { type: i1.IgxNavigationService, decorators: [{
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i2.HammerGesturesManager }, { type: i3.PlatformUtil }]; }, propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-nav-drawer']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], position: [{
                type: Input
            }], enableGestures: [{
                type: Input
            }], isOpenChange: [{
                type: Output
            }], pinThreshold: [{
                type: Input
            }], pin: [{
                type: Input
            }], width: [{
                type: Input
            }], disableAnimation: [{
                type: HostBinding,
                args: ['class.igx-nav-drawer--disable-animation']
            }, {
                type: Input
            }], miniWidth: [{
                type: Input
            }], pinChange: [{
                type: Output
            }], opening: [{
                type: Output
            }], opened: [{
                type: Output
            }], closing: [{
                type: Output
            }], closed: [{
                type: Output
            }], contentTemplate: [{
                type: ContentChild,
                args: [IgxNavDrawerTemplateDirective, { read: IgxNavDrawerTemplateDirective }]
            }], _drawer: [{
                type: ViewChild,
                args: ['aside', { static: true }]
            }], _overlay: [{
                type: ViewChild,
                args: ['overlay', { static: true }]
            }], _styleDummy: [{
                type: ViewChild,
                args: ['dummy', { static: true }]
            }], isOpen: [{
                type: Input
            }], miniTemplate: [{
                type: ContentChild,
                args: [IgxNavDrawerMiniTemplateDirective, { read: IgxNavDrawerMiniTemplateDirective }]
            }], flexWidth: [{
                type: HostBinding,
                args: ['style.flexBasis']
            }], isPinnedRight: [{
                type: HostBinding,
                args: ['style.order']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi1kcmF3ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL25hdmlnYXRpb24tZHJhd2VyL25hdmlnYXRpb24tZHJhd2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9uYXZpZ2F0aW9uLWRyYXdlci9uYXZpZ2F0aW9uLWRyYXdlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUgsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFdBQVcsRUFDWCxNQUFNLEVBQ04sS0FBSyxFQUlMLFFBQVEsRUFDUixNQUFNLEVBRU4sU0FBUyxFQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7Ozs7O0FBR2xILElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQVlILE1BQU0sT0FBTyw0QkFBNEI7SUFvWHJDLFlBQ2dDLFVBQXNCLEVBQzlCLE1BQTRCLEVBQ3RDLFFBQW1CLEVBQ3JCLGFBQW9DLEVBQ3BDLFlBQTBCO1FBSk4sZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUM5QixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQUN0QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3JCLGtCQUFhLEdBQWIsYUFBYSxDQUF1QjtRQUNwQyxp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SSxFQUFFO2dCQUNZLFFBQVE7c0JBQXZELFNBQVM7dUJBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDUSxXQUFXO3NCQUF4RCxTQUFTO3VCQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBd0J6QixNQUFNO3NCQURoQixLQUFLO2dCQXlDSyxZQUFZO3NCQUR0QixZQUFZO3VCQUFDLGlDQUFpQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlDQUFpQyxFQUFFO2dCQVlqRixTQUFTO3NCQURuQixXQUFXO3VCQUFDLGlCQUFpQjtnQkFpQm5CLGFBQWE7c0JBRHZCLFdBQVc7dUJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPcHRpb25hbCxcbiAgICBPdXRwdXQsXG4gICAgU2ltcGxlQ2hhbmdlLFxuICAgIFZpZXdDaGlsZCxcbiAgICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIGludGVydmFsLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSWd4TmF2aWdhdGlvblNlcnZpY2UsIElUb2dnbGVWaWV3IH0gZnJvbSAnLi4vY29yZS9uYXZpZ2F0aW9uJztcbmltcG9ydCB7IEhhbW1lckdlc3R1cmVzTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvdG91Y2gnO1xuaW1wb3J0IHsgSWd4TmF2RHJhd2VyTWluaVRlbXBsYXRlRGlyZWN0aXZlLCBJZ3hOYXZEcmF3ZXJUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vbmF2aWdhdGlvbi1kcmF3ZXIuZGlyZWN0aXZlcyc7XG5pbXBvcnQgeyBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcblxubGV0IE5FWFRfSUQgPSAwO1xuLyoqXG4gKiAqKklnbml0ZSBVSSBmb3IgQW5ndWxhciBOYXZpZ2F0aW9uIERyYXdlcioqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9uYXZkcmF3ZXIpXG4gKlxuICogVGhlIElnbml0ZSBVSSBOYXZpZ2F0aW9uIERyYXdlciBpcyBhIGNvbGxhcHNpYmxlIHNpZGUgbmF2aWdhdGlvbiBjb250YWluZXIgY29tbW9ubHkgdXNlZCBpbiBjb21iaW5hdGlvbiB3aXRoIHRoZSBOYXZiYXIuXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtbmF2LWRyYXdlciBpZD1cIm5hdmlnYXRpb25cIiBbaXNPcGVuXT1cInRydWVcIj5cbiAqICAgPG5nLXRlbXBsYXRlIGlneERyYXdlcj5cbiAqICAgICA8bmF2PlxuICogICAgICAgPHNwYW4gaWd4RHJhd2VySXRlbSBbaXNIZWFkZXJdPVwidHJ1ZVwiPkVtYWlsPC9zcGFuPlxuICogICAgICAgPHNwYW4gaWd4RHJhd2VySXRlbSBpZ3hSaXBwbGU+SW5ib3g8L3NwYW4+XG4gKiAgICAgICA8c3BhbiBpZ3hEcmF3ZXJJdGVtIGlneFJpcHBsZT5EZWxldGVkPC9zcGFuPlxuICogICAgICAgPHNwYW4gaWd4RHJhd2VySXRlbSBpZ3hSaXBwbGU+U2VudDwvc3Bhbj5cbiAqICAgICA8L25hdj5cbiAqICAgPC9uZy10ZW1wbGF0ZT5cbiAqIDwvaWd4LW5hdi1kcmF3ZXI+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgcHJvdmlkZXJzOiBbSGFtbWVyR2VzdHVyZXNNYW5hZ2VyXSxcbiAgICBzZWxlY3RvcjogJ2lneC1uYXYtZHJhd2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ25hdmlnYXRpb24tZHJhd2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICB9XG4gICAgYF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4TmF2aWdhdGlvbkRyYXdlckNvbXBvbmVudCBpbXBsZW1lbnRzXG4gICAgSVRvZ2dsZVZpZXcsXG4gICAgT25Jbml0LFxuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgT25EZXN0cm95LFxuICAgIE9uQ2hhbmdlcyB7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1uYXYtZHJhd2VyJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogSUQgb2YgdGhlIGNvbXBvbmVudFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteU5hdkRyYXdlcklkID0gdGhpcy5uYXZkcmF3ZXIuaWQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqICA8aWd4LW5hdi1kcmF3ZXIgaWQ9J25hdmRyYXdlcic+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpIHB1YmxpYyBpZCA9IGBpZ3gtbmF2LWRyYXdlci0ke05FWFRfSUQrK31gO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gb2YgdGhlIE5hdmlnYXRpb24gRHJhd2VyLiBDYW4gYmUgXCJsZWZ0XCIoZGVmYXVsdCkgb3IgXCJyaWdodFwiLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteU5hdkRyYXdlclBvc2l0aW9uID0gdGhpcy5uYXZkcmF3ZXIucG9zaXRpb247XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtbmF2LWRyYXdlciBbcG9zaXRpb25dPVwiJ2xlZnQnXCI+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgcG9zaXRpb24gPSAnbGVmdCc7XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIHRoZSB1c2Ugb2YgdG91Y2ggZ2VzdHVyZXMgdG8gbWFuaXB1bGF0ZSB0aGUgZHJhd2VyOlxuICAgICAqIC0gc3dpcGUvcGFuIGZyb20gZWRnZSB0byBvcGVuLCBzd2lwZS10b2dnbGUgYW5kIHBhbi1kcmFnLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBnZXN0dXJlc0VuYWJsZWQgPSB0aGlzLm5hdmRyYXdlci5lbmFibGVHZXN0dXJlcztcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tc2V0LS0+XG4gICAgICogPGlneC1uYXYtZHJhd2VyIFtlbmFibGVHZXN0dXJlc109J3RydWUnPjwvaWd4LW5hdi1kcmF3ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGVuYWJsZUdlc3R1cmVzID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIGlzT3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIE1pbmltdW0gZGV2aWNlIHdpZHRoIHJlcXVpcmVkIGZvciBhdXRvbWF0aWMgcGluIHRvIGJlIHRvZ2dsZWQuXG4gICAgICogRGVmYXVsdCBpcyAxMDI0LCBjYW4gYmUgc2V0IHRvIGEgZmFsc3kgdmFsdWUgdG8gZGlzYWJsZSB0aGlzIGJlaGF2aW9yLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBuYXZEcmF3ZXJQaW5UaHJlc2hvbGQgPSB0aGlzLm5hdmRyYXdlci5waW5UaHJlc2hvbGQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtbmF2LWRyYXdlciBbcGluVGhyZXNob2xkXT0nMTAyNCc+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgcGluVGhyZXNob2xkID0gMTAyNDtcblxuICAgIC8qKlxuICAgICAqIFdoZW4gcGlubmVkIHRoZSBkcmF3ZXIgaXMgcmVsYXRpdmVseSBwb3NpdGlvbmVkIGluc3RlYWQgb2Ygc2l0dGluZyBhYm92ZSBjb250ZW50LlxuICAgICAqIE1heSByZXF1aXJlIGFkZGl0aW9uYWwgbGF5b3V0IHN0eWxpbmcuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0XG4gICAgICogbGV0IG5hdkRyYXdlcklzUGlubmVkID0gdGhpcy5uYXZkcmF3ZXIucGluO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LW5hdi1kcmF3ZXIgW3Bpbl09J2ZhbHNlJz48L2lneC1uYXYtZHJhd2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwaW4gPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSBkcmF3ZXIgaW4gaXRzIG9wZW4gc3RhdGUuIERlZmF1bHRzIHRvIFwiMjgwcHhcIi5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbmF2RHJhd2VyV2lkdGggPSB0aGlzLm5hdmRyYXdlci53aWR0aDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tc2V0LS0+XG4gICAgICogPGlneC1uYXYtZHJhd2VyIFt3aWR0aF09XCInMjI4cHgnXCI+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgd2lkdGggPSAnMjgwcHgnO1xuXG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzL2Rpc2FibGVzIHRoZSBhbmltYXRpb24sIHdoZW4gdG9nZ2xpbmcgdGhlIGRyYXdlci4gU2V0IHRvIGBmYWxzZWAgYnkgZGVmYXVsdC5cbiAgICAgKiBgYGBgaHRtbFxuICAgICAqIDxpZ3gtbmF2LWRyYXdlciBbZGlzYWJsZUFuaW1hdGlvbl09XCJ0cnVlXCI+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nICgnY2xhc3MuaWd4LW5hdi1kcmF3ZXItLWRpc2FibGUtYW5pbWF0aW9uJylcbiAgICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZUFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIGRyYXdlciBpbiBpdHMgbWluaSBzdGF0ZS4gRGVmYXVsdHMgdG8gNjhweC5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbmF2RHJhd2VyTWluaVdpZHRoID0gdGhpcy5uYXZkcmF3ZXIubWluaVdpZHRoO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LW5hdi1kcmF3ZXIgW21pbmlXaWR0aF09XCInMzRweCdcIj48L2lneC1uYXYtZHJhd2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBtaW5pV2lkdGggPSAnNjhweCc7XG5cbiAgICAvKipcbiAgICAgKiBQaW5uZWQgc3RhdGUgY2hhbmdlIG91dHB1dCBmb3IgdHdvLXdheSBiaW5kaW5nLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbmF2LWRyYXdlciBbKHBpbildPSdpc1Bpbm5lZCc+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIHBpbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4odHJ1ZSk7XG4gICAgLyoqXG4gICAgICogRXZlbnQgZmlyZWQgYXMgdGhlIE5hdmlnYXRpb24gRHJhd2VyIGlzIGFib3V0IHRvIG9wZW4uXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtbmF2LWRyYXdlciAob3BlbmluZyk9J29uT3BlbmluZygpJz48L2lneC1uYXYtZHJhd2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb3BlbmluZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCBmaXJlZCB3aGVuIHRoZSBOYXZpZ2F0aW9uIERyYXdlciBoYXMgb3BlbmVkLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbmF2LWRyYXdlciAob3BlbmVkKT0nb25PcGVuZWQoKSc+PC9pZ3gtbmF2LWRyYXdlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9wZW5lZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAvKipcbiAgICAgKiBFdmVudCBmaXJlZCBhcyB0aGUgTmF2aWdhdGlvbiBEcmF3ZXIgaXMgYWJvdXQgdG8gY2xvc2UuXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1uYXYtZHJhd2VyIChjbG9zaW5nKT0nb25DbG9zaW5nKCknPjwvaWd4LW5hdi1kcmF3ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBjbG9zaW5nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIC8qKlxuICAgICAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIE5hdmlnYXRpb24gRHJhd2VyIGhhcyBjbG9zZWQuXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1uYXYtZHJhd2VyIChjbG9zZWQpPSdvbkNsb3NlZCgpJz48L2lneC1uYXYtZHJhd2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4TmF2RHJhd2VyVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogSWd4TmF2RHJhd2VyVGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwcm90ZWN0ZWQgY29udGVudFRlbXBsYXRlOiBJZ3hOYXZEcmF3ZXJUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIEBWaWV3Q2hpbGQoJ2FzaWRlJywgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBfZHJhd2VyOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ292ZXJsYXknLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIF9vdmVybGF5OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ2R1bW15JywgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBfc3R5bGVEdW1teTogRWxlbWVudFJlZjtcblxuICAgIHByaXZhdGUgX2lzT3BlbiA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU3RhdGUgb2YgdGhlIGRyYXdlci5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbmF2RHJhd2VySXNPcGVuID0gdGhpcy5uYXZkcmF3ZXIuaXNPcGVuO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LW5hdi1kcmF3ZXIgW2lzT3Blbl09J2ZhbHNlJz48L2lneC1uYXYtZHJhd2VyPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogVHdvLXdheSBkYXRhIGJpbmRpbmcuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LW5hdi1kcmF3ZXIgWyhpc09wZW4pXT0nbW9kZWwuaXNPcGVuJz48L2lneC1uYXYtZHJhd2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBpc09wZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc09wZW47XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgaXNPcGVuKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2lzT3BlbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLmlzT3BlbkNoYW5nZS5lbWl0KHRoaXMuX2lzT3Blbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBuYXRpdmVFbGVtZW50IG9mIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdGVtcGxhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm1pbmlUZW1wbGF0ZSAmJiAhdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbmlUZW1wbGF0ZS50ZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRlbnRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudFRlbXBsYXRlLnRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbWluaVRlbXBsYXRlOiBJZ3hOYXZEcmF3ZXJNaW5pVGVtcGxhdGVEaXJlY3RpdmU7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbWluaVRlbXBsYXRlKCk6IElneE5hdkRyYXdlck1pbmlUZW1wbGF0ZURpcmVjdGl2ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9taW5pVGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4TmF2RHJhd2VyTWluaVRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneE5hdkRyYXdlck1pbmlUZW1wbGF0ZURpcmVjdGl2ZSB9KVxuICAgIHB1YmxpYyBzZXQgbWluaVRlbXBsYXRlKHY6IElneE5hdkRyYXdlck1pbmlUZW1wbGF0ZURpcmVjdGl2ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLnNldERyYXdlcldpZHRoKHYgPyB0aGlzLm1pbmlXaWR0aCA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9taW5pVGVtcGxhdGUgPSB2O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmZsZXhCYXNpcycpXG4gICAgcHVibGljIGdldCBmbGV4V2lkdGgoKSB7XG4gICAgICAgIGlmICghdGhpcy5waW4pIHtcbiAgICAgICAgICAgIHJldHVybiAnMHB4JztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1pbmlUZW1wbGF0ZSAmJiB0aGlzLm1pbmlXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluaVdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcwcHgnO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5vcmRlcicpXG4gICAgcHVibGljIGdldCBpc1Bpbm5lZFJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5waW4gJiYgdGhpcy5wb3NpdGlvbiA9PT0gJ3JpZ2h0JyA/ICcxJyA6ICcwJztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXN0dXJlc0F0dGFjaGVkID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfd2lkdGhDYWNoZTogeyB3aWR0aDogbnVtYmVyOyBtaW5pV2lkdGg6IG51bWJlcjsgd2luZG93V2lkdGg6IG51bWJlciB9ID0geyB3aWR0aDogbnVsbCwgbWluaVdpZHRoOiBudWxsLCB3aW5kb3dXaWR0aDogbnVsbCB9O1xuICAgIHByaXZhdGUgX3Jlc2l6ZU9ic2VydmVyOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSBjc3M6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAgICAgICBkcmF3ZXI6ICdpZ3gtbmF2LWRyYXdlcl9fYXNpZGUnLFxuICAgICAgICBtaW5pOiAnaWd4LW5hdi1kcmF3ZXJfX2FzaWRlLS1taW5pJyxcbiAgICAgICAgb3ZlcmxheTogJ2lneC1uYXYtZHJhd2VyX19vdmVybGF5JyxcbiAgICAgICAgc3R5bGVEdW1teTogJ2lneC1uYXYtZHJhd2VyX19zdHlsZS1kdW1teSdcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZHJhd2VyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZHJhd2VyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgb3ZlcmxheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXkubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzdHlsZUR1bW15KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGVEdW1teS5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBQYW4gYW5pbWF0aW9uIHByb3BlcnRpZXMgKi9cbiAgICBwcml2YXRlIF9wYW5uaW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfcGFuU3RhcnRXaWR0aDogbnVtYmVyO1xuICAgIHByaXZhdGUgX3BhbkxpbWl0OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBQcm9wZXJ0eSB0byBkZWNpZGUgd2hldGhlciB0byBjaGFuZ2Ugd2lkdGggb3IgdHJhbnNsYXRlIHRoZSBkcmF3ZXIgZnJvbSBwYW4gZ2VzdHVyZS5cbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc0FuaW1hdGVXaWR0aCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGluIHx8ICEhdGhpcy5taW5pVGVtcGxhdGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbWF4RWRnZVpvbmUgPSA1MDtcbiAgICAvKipcbiAgICAgKiBVc2VkIGZvciB0b3VjaCBnZXN0dXJlcyAoc3dpcGUgYW5kIHBhbikuXG4gICAgICogRGVmYXVsdHMgdG8gNTAgKGluIHB4KSBhbmQgaXMgZXh0ZW5kZWQgdG8gYXQgbGVhc3QgMTEwJSBvZiB0aGUgbWluaSB0ZW1wbGF0ZSB3aWR0aCBpZiBhdmFpbGFibGUuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBtYXhFZGdlWm9uZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heEVkZ2Vab25lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIERyYXdlciB3aWR0aCBmb3Igc3BlY2lmaWMgc3RhdGUuXG4gICAgICogV2lsbCBhdHRlbXB0IHRvIGV2YWx1YXRlIHJlcXVlc3RlZCBzdGF0ZSBhbmQgY2FjaGUuXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGV4cGVjdGVkV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEV4cGVjdGVkV2lkdGgoZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgRHJhd2VyIG1pbmkgd2lkdGggZm9yIHNwZWNpZmljIHN0YXRlLlxuICAgICAqIFdpbGwgYXR0ZW1wdCB0byBldmFsdWF0ZSByZXF1ZXN0ZWQgc3RhdGUgYW5kIGNhY2hlLlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZXhwZWN0ZWRNaW5pV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEV4cGVjdGVkV2lkdGgodHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdG91Y2hNYW5hZ2VyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG91Y2hNYW5hZ2VyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4cG9zZXMgb3B0aW9uYWwgbmF2aWdhdGlvbiBzZXJ2aWNlXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfc3RhdGU6IElneE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHJpdmF0ZSBfdG91Y2hNYW5hZ2VyOiBIYW1tZXJHZXN0dXJlc01hbmFnZXIsXG4gICAgICAgIHByaXZhdGUgcGxhdGZvcm1VdGlsOiBQbGF0Zm9ybVV0aWwpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICAvLyBET00gYW5kIEBJbnB1dCgpLXMgaW5pdGlhbGl6ZWRcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZS5hZGQodGhpcy5pZCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLnNldERyYXdlcldpZHRoKHRoaXMud2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIC8vIHdhaXQgZm9yIHRlbXBsYXRlIGFuZCBuZy1jb250ZW50IHRvIGJlIHJlYWR5XG4gICAgICAgIHRoaXMudXBkYXRlRWRnZVpvbmUoKTtcbiAgICAgICAgdGhpcy5jaGVja1BpblRocmVzaG9sZCgpO1xuXG4gICAgICAgIHRoaXMuZW5zdXJlRXZlbnRzKCk7XG5cbiAgICAgICAgLy8gVE9ETzogYXBwbHkgcGxhdGZvcm0tc2FmZSBSdWxlciBmcm9tIGh0dHA6Ly9wbG5rci5jby9lZGl0LzgxbldEeXJlWU16a3VuaWhmUmdYP3A9cHJldmlld1xuICAgICAgICAvLyAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNjUxNSksIGJsb2NrZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNjkwNFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX3RvdWNoTWFuYWdlci5kZXN0cm95KCk7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUucmVtb3ZlKHRoaXMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9yZXNpemVPYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KSB7XG4gICAgICAgIC8vIHNpbXBsZSBzZXR0aW5ncyBjYW4gY29tZSBmcm9tIGF0dHJpYnV0ZSBzZXQgKHJhdGhlciB0aGFuIGJpbmRpbmcpLCBtYWtlIHN1cmUgYm9vbGVhbiBwcm9wcyBhcmUgY29udmVydGVkXG4gICAgICAgIGlmIChjaGFuZ2VzLmVuYWJsZUdlc3R1cmVzICYmIGNoYW5nZXMuZW5hYmxlR2VzdHVyZXMuY3VycmVudFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlR2VzdHVyZXMgPSAhISh0aGlzLmVuYWJsZUdlc3R1cmVzICYmIHRoaXMuZW5hYmxlR2VzdHVyZXMudG9TdHJpbmcoKSA9PT0gJ3RydWUnKTtcbiAgICAgICAgICAgIHRoaXMuZW5zdXJlRXZlbnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXMucGluICYmIGNoYW5nZXMucGluLmN1cnJlbnRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBpbiA9ICEhKHRoaXMucGluICYmIHRoaXMucGluLnRvU3RyaW5nKCkgPT09ICd0cnVlJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5waW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaE1hbmFnZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dlc3R1cmVzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnN1cmVFdmVudHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFuZ2VzLnBpblRocmVzaG9sZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGluVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnN1cmVFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrUGluVGhyZXNob2xkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hhbmdlcy53aWR0aCAmJiB0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgdGhpcy5zZXREcmF3ZXJXaWR0aChjaGFuZ2VzLndpZHRoLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hhbmdlcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RHJhd2VyV2lkdGgodGhpcy5pc09wZW4gPyB0aGlzLndpZHRoIDogKHRoaXMubWluaVRlbXBsYXRlID8gdGhpcy5taW5pV2lkdGggOiAnJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYW5nZXMubWluaVdpZHRoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREcmF3ZXJXaWR0aChjaGFuZ2VzLm1pbmlXaWR0aC5jdXJyZW50VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVFZGdlWm9uZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBvcGVuIHN0YXRlIG9mIHRoZSBOYXZpZ2F0aW9uIERyYXdlci5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLm5hdmRyYXdlci50b2dnbGUoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbiB0aGUgTmF2aWdhdGlvbiBEcmF3ZXIuIEhhcyBubyBlZmZlY3QgaWYgYWxyZWFkeSBvcGVuZWQuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5uYXZkcmF3ZXIub3BlbigpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkge1xuICAgICAgICBpZiAodGhpcy5fcGFubmluZykge1xuICAgICAgICAgICAgdGhpcy5yZXNldFBhbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3BlbmluZy5lbWl0KCk7XG4gICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgICAgICAvLyBUT0RPOiBTd2l0Y2ggdG8gYW5pbWF0ZSBBUEkgd2hlbiBhdmFpbGFibGVcbiAgICAgICAgLy8gdmFyIGFuaW1hdGlvbkNzcyA9IHRoaXMuYW5pbWF0ZS5jc3MoKTtcbiAgICAgICAgLy8gICAgIGFuaW1hdGlvbkNzc1xuICAgICAgICAvLyAgICAgICAgIC5zZXRTdHlsZXMoeyd3aWR0aCc6JzUwcHgnfSwgeyd3aWR0aCc6JzQwMHB4J30pXG4gICAgICAgIC8vICAgICAgICAgLnN0YXJ0KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KVxuICAgICAgICAvLyAgICAgICAgIC5vbkNvbXBsZXRlKCgpID0+IGFuaW1hdGlvbkNzcy5zZXRUb1N0eWxlcyh7J3dpZHRoJzonYXV0byd9KS5zdGFydCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLnRvZ2dsZU9wZW5lZEV2ZW50LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc2V0RHJhd2VyV2lkdGgodGhpcy53aWR0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIE5hdmlnYXRpb24gRHJhd2VyLiBIYXMgbm8gZWZmZWN0IGlmIGFscmVhZHkgY2xvc2VkLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMubmF2ZHJhd2VyLmNsb3NlKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkge1xuICAgICAgICBpZiAodGhpcy5fcGFubmluZykge1xuICAgICAgICAgICAgdGhpcy5yZXNldFBhbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NpbmcuZW1pdCgpO1xuXG4gICAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2V0RHJhd2VyV2lkdGgodGhpcy5taW5pVGVtcGxhdGUgPyB0aGlzLm1pbmlXaWR0aCA6ICcnKTtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMudG9nZ2xlQ2xvc2VkRXZlbnQsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldF9tYXhFZGdlWm9uZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX21heEVkZ2Vab25lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBEcmF3ZXIgd2lkdGggZm9yIHNwZWNpZmljIHN0YXRlLiBXaWxsIGF0dGVtcHQgdG8gZXZhbHVhdGUgcmVxdWVzdGVkIHN0YXRlIGFuZCBjYWNoZS5cbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAcGFyYW0gW21pbmldIC0gUmVxdWVzdCBtaW5pIHdpZHRoIGluc3RlYWRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0RXhwZWN0ZWRXaWR0aChtaW5pPzogYm9vbGVhbik6IG51bWJlciB7XG4gICAgICAgIGlmIChtaW5pKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWluaVRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5taW5pV2lkdGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLm1pbmlXaWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlmICghdGhpcy5pc09wZW4pIHsgLy8gVGhpcyBXT04nVCB3b3JrIGR1ZSB0byB0cmFuc2l0aW9uIHRpbWluZ3MuLi5cbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzFdLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dpZHRoQ2FjaGUubWluaVdpZHRoID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvcmNlIGNsYXNzIGZvciB3aWR0aCBjYWxjLiBUT0RPP1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3JjZSBjbGFzcyBmb3Igd2lkdGggY2FsYy4gVE9ETz9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLnN0eWxlRHVtbXksIHRoaXMuY3NzLmRyYXdlcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5zdHlsZUR1bW15LCB0aGlzLmNzcy5taW5pKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGhDYWNoZS5taW5pV2lkdGggPSB0aGlzLnN0eWxlRHVtbXkub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5zdHlsZUR1bW15LCB0aGlzLmNzcy5kcmF3ZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuc3R5bGVEdW1teSwgdGhpcy5jc3MubWluaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aENhY2hlLm1pbmlXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93aWR0aENhY2hlLndpZHRoID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvcmNlIGNsYXNzIGZvciB3aWR0aCBjYWxjLiBUT0RPP1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3JjZSBjbGFzcyBmb3Igd2lkdGggY2FsYy4gVE9ETz9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLnN0eWxlRHVtbXksIHRoaXMuY3NzLmRyYXdlcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoQ2FjaGUud2lkdGggPSB0aGlzLnN0eWxlRHVtbXkub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5zdHlsZUR1bW15LCB0aGlzLmNzcy5kcmF3ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGhDYWNoZS53aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0V2luZG93V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiAod2luZG93LmlubmVyV2lkdGggPiAwKSA/IHdpbmRvdy5pbm5lcldpZHRoIDogc2NyZWVuLndpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGRyYXdlciB3aWR0aC5cbiAgICAgKi9cbiAgICBwcml2YXRlIHNldERyYXdlcldpZHRoKHdpZHRoOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMucGxhdGZvcm1VdGlsLmlzQnJvd3Nlcikge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmF3ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRyYXdlciwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRyYXdlciwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgRHJhd2VyIHdpZHRoLlxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0RHJhd2VyV2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd2VyLm9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgZW5zdXJlRXZlbnRzKCkge1xuICAgICAgICAvLyBzZXQgbGlzdGVuZXJzIGZvciBzd2lwZS9wYW4gb25seSBpZiBuZWVkZWQsIGJ1dCBqdXN0IG9uY2VcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlR2VzdHVyZXMgJiYgIXRoaXMucGluICYmICF0aGlzLl9nZXN0dXJlc0F0dGFjaGVkKSB7XG4gICAgICAgICAgICAvLyBCdWlsdC1pbiBtYW5hZ2VyIGhhbmRsZXIoTDIwODg3KSBjYXVzZXMgZW5kbGVzcyBsb29wIGFuZCBtYXggc3RhY2sgZXhjZXB0aW9uLlxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNjk5M1xuICAgICAgICAgICAgLy8gVXNlIG91cnMgZm9yIG5vdyAodW50aWwgYmV0YS4xMCk6XG4gICAgICAgICAgICAvLyB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudCwgXCJzd2lwZVwiLCB0aGlzLnN3aXBlKTtcbiAgICAgICAgICAgIHRoaXMuX3RvdWNoTWFuYWdlci5hZGRHbG9iYWxFdmVudExpc3RlbmVyKCdkb2N1bWVudCcsICdzd2lwZScsIHRoaXMuc3dpcGUpO1xuICAgICAgICAgICAgdGhpcy5fZ2VzdHVyZXNBdHRhY2hlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCBcInBhbnN0YXJ0XCIsIHRoaXMucGFuc3RhcnQpO1xuICAgICAgICAgICAgLy8gdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsIFwicGFuXCIsIHRoaXMucGFuKTtcbiAgICAgICAgICAgIHRoaXMuX3RvdWNoTWFuYWdlci5hZGRHbG9iYWxFdmVudExpc3RlbmVyKCdkb2N1bWVudCcsICdwYW5zdGFydCcsIHRoaXMucGFuc3RhcnQpO1xuICAgICAgICAgICAgdGhpcy5fdG91Y2hNYW5hZ2VyLmFkZEdsb2JhbEV2ZW50TGlzdGVuZXIoJ2RvY3VtZW50JywgJ3Bhbm1vdmUnLCB0aGlzLnBhbik7XG4gICAgICAgICAgICB0aGlzLl90b3VjaE1hbmFnZXIuYWRkR2xvYmFsRXZlbnRMaXN0ZW5lcignZG9jdW1lbnQnLCAncGFuZW5kJywgdGhpcy5wYW5FbmQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fcmVzaXplT2JzZXJ2ZXIgJiYgdGhpcy5wbGF0Zm9ybVV0aWwuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemVPYnNlcnZlciA9IGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKS5waXBlKGRlYm91bmNlKCgpID0+IGludGVydmFsKDE1MCkpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQaW5UaHJlc2hvbGQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVFZGdlWm9uZSgpIHtcbiAgICAgICAgbGV0IG1heFZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLm1pbmlUZW1wbGF0ZSkge1xuICAgICAgICAgICAgbWF4VmFsdWUgPSBNYXRoLm1heCh0aGlzLl9tYXhFZGdlWm9uZSwgdGhpcy5nZXRFeHBlY3RlZFdpZHRoKHRydWUpICogMS4xKTtcbiAgICAgICAgICAgIHRoaXMuc2V0X21heEVkZ2Vab25lKG1heFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tQaW5UaHJlc2hvbGQgPSAoZXZ0PzogRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnBsYXRmb3JtVXRpbC5pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgd2luZG93V2lkdGg7XG4gICAgICAgIGlmICh0aGlzLnBpblRocmVzaG9sZCkge1xuICAgICAgICAgICAgd2luZG93V2lkdGggPSB0aGlzLmdldFdpbmRvd1dpZHRoKCk7XG4gICAgICAgICAgICBpZiAoZXZ0ICYmIHRoaXMuX3dpZHRoQ2FjaGUud2luZG93V2lkdGggPT09IHdpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fd2lkdGhDYWNoZS53aW5kb3dXaWR0aCA9IHdpbmRvd1dpZHRoO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBpbiAmJiB3aW5kb3dXaWR0aCA+PSB0aGlzLnBpblRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBpbkNoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBpbiAmJiB3aW5kb3dXaWR0aCA8IHRoaXMucGluVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5waW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBpbkNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIHN3aXBlID0gKGV2dDogSGFtbWVySW5wdXQpID0+IHtcbiAgICAgICAgLy8gVE9ETzogQ291bGQgYWxzbyBmb3JjZSBpbnB1dCB0eXBlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNzEwODA1MlxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlR2VzdHVyZXMgfHwgZXZ0LnBvaW50ZXJUeXBlICE9PSAndG91Y2gnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW1tZXJKUyBzd2lwZSBpcyBob3Jpem9udGFsLW9ubHkgYnkgZGVmYXVsdCwgZG9uJ3QgY2hlY2sgZGVsdGFZXG4gICAgICAgIGxldCBkZWx0YVg7XG4gICAgICAgIGxldCBzdGFydFBvc2l0aW9uO1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgLy8gd2hlbiBvbiB0aGUgcmlnaHQgdXNlIGludmVyc2Ugb2YgZGVsdGFYXG4gICAgICAgICAgICBkZWx0YVggPSAtZXZ0LmRlbHRhWDtcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb24gPSB0aGlzLmdldFdpbmRvd1dpZHRoKCkgLSAoZXZ0LmNlbnRlci54ICsgZXZ0LmRpc3RhbmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbHRhWCA9IGV2dC5kZWx0YVg7XG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uID0gZXZ0LmNlbnRlci54IC0gZXZ0LmRpc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9ubHkgYWNjZXB0IGNsb3Npbmcgc3dpcGUgKGlnbm9yaW5nIG1pbkVkZ2Vab25lKSB3aGVuIHRoZSBkcmF3ZXIgaXMgZXhwYW5kZWQ6XG4gICAgICAgIGlmICgodGhpcy5pc09wZW4gJiYgZGVsdGFYIDwgMCkgfHxcbiAgICAgICAgICAgIC8vIHBvc2l0aXZlIGRlbHRhWCBmcm9tIHRoZSBlZGdlOlxuICAgICAgICAgICAgKGRlbHRhWCA+IDAgJiYgc3RhcnRQb3NpdGlvbiA8IHRoaXMubWF4RWRnZVpvbmUpKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByaXZhdGUgcGFuc3RhcnQgPSAoZXZ0OiBIYW1tZXJJbnB1dCkgPT4geyAvLyBUT0RPOiB0ZXN0IGNvZGVcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZUdlc3R1cmVzIHx8IHRoaXMucGluIHx8IGV2dC5wb2ludGVyVHlwZSAhPT0gJ3RvdWNoJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uID09PSAncmlnaHQnID8gdGhpcy5nZXRXaW5kb3dXaWR0aCgpIC0gKGV2dC5jZW50ZXIueCArIGV2dC5kaXN0YW5jZSlcbiAgICAgICAgICAgIDogZXZ0LmNlbnRlci54IC0gZXZ0LmRpc3RhbmNlO1xuXG4gICAgICAgIC8vIGNhY2hlIHdpZHRoIGR1cmluZyBhbmltYXRpb24sIGZsYWcgdG8gYWxsb3cgZnVydGhlciBoYW5kbGluZ1xuICAgICAgICBpZiAodGhpcy5pc09wZW4gfHwgKHN0YXJ0UG9zaXRpb24gPCB0aGlzLm1heEVkZ2Vab25lKSkge1xuICAgICAgICAgICAgdGhpcy5fcGFubmluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9wYW5TdGFydFdpZHRoID0gdGhpcy5nZXRFeHBlY3RlZFdpZHRoKCF0aGlzLmlzT3Blbik7XG4gICAgICAgICAgICB0aGlzLl9wYW5MaW1pdCA9IHRoaXMuZ2V0RXhwZWN0ZWRXaWR0aCh0aGlzLmlzT3Blbik7XG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5vdmVybGF5LCAncGFubmluZycpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmRyYXdlciwgJ3Bhbm5pbmcnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIHBhbiA9IChldnQ6IEhhbW1lcklucHV0KSA9PiB7XG4gICAgICAgIC8vIFRPRE86IGlucHV0LmRlbHRhWCA9IHByZXZEZWx0YS54ICsgKGNlbnRlci54IC0gb2Zmc2V0LngpO1xuICAgICAgICAvLyBnZXQgYWN0dWFsIGRlbHRhIChub3QgdG90YWwgc2Vzc2lvbiBvbmUpIGZyb20gZXZlbnQ/XG4gICAgICAgIC8vIHBhbiBXSUxMIGFsc28gZmlyZSBhZnRlciBhIGZ1bGwgc3dpcGUsIG9ubHkgcmVzaXplIG9uIGZsYWdcbiAgICAgICAgaWYgKCF0aGlzLl9wYW5uaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmlnaHQ6IGJvb2xlYW4gPSB0aGlzLnBvc2l0aW9uID09PSAncmlnaHQnO1xuICAgICAgICAvLyB3aGVuIG9uIHRoZSByaWdodCB1c2UgaW52ZXJzZSBvZiBkZWx0YVhcbiAgICAgICAgY29uc3QgZGVsdGFYID0gcmlnaHQgPyAtZXZ0LmRlbHRhWCA6IGV2dC5kZWx0YVg7XG4gICAgICAgIGxldCBuZXdYO1xuICAgICAgICBsZXQgcGVyY2VudDtcbiAgICAgICAgY29uc3QgdmlzaWJsZVdpZHRoID0gdGhpcy5fcGFuU3RhcnRXaWR0aCArIGRlbHRhWDtcblxuICAgICAgICBpZiAodGhpcy5pc09wZW4gJiYgZGVsdGFYIDwgMCkge1xuICAgICAgICAgICAgLy8gd2hlbiB2aXNpYmxlV2lkdGggaGl0cyBsaW1pdCAtIHN0b3AgYW5pbWF0aW5nXG4gICAgICAgICAgICBpZiAodmlzaWJsZVdpZHRoIDw9IHRoaXMuX3BhbkxpbWl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBbmltYXRlV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gKHZpc2libGVXaWR0aCAtIHRoaXMuX3BhbkxpbWl0KSAvICh0aGlzLl9wYW5TdGFydFdpZHRoIC0gdGhpcy5fcGFuTGltaXQpO1xuICAgICAgICAgICAgICAgIG5ld1ggPSB2aXNpYmxlV2lkdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSB2aXNpYmxlV2lkdGggLyB0aGlzLl9wYW5TdGFydFdpZHRoO1xuICAgICAgICAgICAgICAgIG5ld1ggPSBldnQuZGVsdGFYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRYU2l6ZShuZXdYLCBwZXJjZW50LnRvUHJlY2lzaW9uKDIpKTtcblxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzT3BlbiAmJiBkZWx0YVggPiAwKSB7XG4gICAgICAgICAgICAvLyB3aGVuIHZpc2libGVXaWR0aCBoaXRzIGxpbWl0IC0gc3RvcCBhbmltYXRpbmdcbiAgICAgICAgICAgIGlmICh2aXNpYmxlV2lkdGggPj0gdGhpcy5fcGFuTGltaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0FuaW1hdGVXaWR0aCkge1xuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAodmlzaWJsZVdpZHRoIC0gdGhpcy5fcGFuU3RhcnRXaWR0aCkgLyAodGhpcy5fcGFuTGltaXQgLSB0aGlzLl9wYW5TdGFydFdpZHRoKTtcbiAgICAgICAgICAgICAgICBuZXdYID0gdmlzaWJsZVdpZHRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gdmlzaWJsZVdpZHRoIC8gdGhpcy5fcGFuTGltaXQ7XG4gICAgICAgICAgICAgICAgbmV3WCA9ICh0aGlzLl9wYW5MaW1pdCAtIHZpc2libGVXaWR0aCkgKiAocmlnaHQgPyAxIDogLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRYU2l6ZShuZXdYLCBwZXJjZW50LnRvUHJlY2lzaW9uKDIpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIHBhbkVuZCA9IChldnQ6IEhhbW1lcklucHV0KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9wYW5uaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YVggPSB0aGlzLnBvc2l0aW9uID09PSAncmlnaHQnID8gLWV2dC5kZWx0YVggOiBldnQuZGVsdGFYO1xuICAgICAgICAgICAgY29uc3QgdmlzaWJsZVdpZHRoOiBudW1iZXIgPSB0aGlzLl9wYW5TdGFydFdpZHRoICsgZGVsdGFYO1xuICAgICAgICAgICAgdGhpcy5yZXNldFBhbigpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwYW4gYnJvdWdodCB0aGUgZHJhd2VyIHRvIDUwJVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNPcGVuICYmIHZpc2libGVXaWR0aCA8PSB0aGlzLl9wYW5TdGFydFdpZHRoIC8gMikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNPcGVuICYmIHZpc2libGVXaWR0aCA+PSB0aGlzLl9wYW5MaW1pdCAvIDIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BhblN0YXJ0V2lkdGggPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByaXZhdGUgcmVzZXRQYW4oKSB7XG4gICAgICAgIHRoaXMuX3Bhbm5pbmcgPSBmYWxzZTtcbiAgICAgICAgLyogc3R5bGVzIGZhaWwgdG8gYXBwbHkgd2hlbiBzZXQgb24gcGFyZW50IGR1ZSB0byBleHRyYSBhdHRyaWJ1dGVzLCBwcm9iIG5nIGJ1ZyAqL1xuICAgICAgICAvKiBzdHlsZXMgZmFpbCB0byBhcHBseSB3aGVuIHNldCBvbiBwYXJlbnQgZHVlIHRvIGV4dHJhIGF0dHJpYnV0ZXMsIHByb2IgbmcgYnVnICovXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5vdmVybGF5LCAncGFubmluZycpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZHJhd2VyLCAncGFubmluZycpO1xuICAgICAgICB0aGlzLnNldFhTaXplKDAsICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvciB3aWR0aCBpbiBjYXNlIHRoZSBkcmF3ZXIgZG9lc24ndCBjaGFuZ2UgcG9zaXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCB0aGUgbnVtYmVyIHBpeGVscyB0byB0cmFuc2xhdGUgb24gdGhlIFggYXhpcyBvciB0aGUgd2lkdGggdG8gc2V0LiAwIHdpZHRoIHdpbGwgY2xlYXIgdGhlIHN0eWxlIGluc3RlYWQuXG4gICAgICogQHBhcmFtIG9wYWNpdHkgb3B0aW9uYWwgdmFsdWUgdG8gYXBwbHkgdG8gdGhlIG92ZXJsYXlcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFhTaXplKHg6IG51bWJlciwgb3BhY2l0eT86IHN0cmluZykge1xuICAgICAgICAvLyBBbmd1bGFyIHBvbHlmaWxscyBwYXRjaGVzIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIGJ1dCBzd2l0Y2ggdG8gRG9tQWRhcHRlciBBUEkgKFRPRE8pXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQW5pbWF0ZVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRyYXdlciwgJ3dpZHRoJywgeCA/IE1hdGguYWJzKHgpICsgJ3B4JyA6ICcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRyYXdlciwgJ3RyYW5zZm9ybScsIHggPyAndHJhbnNsYXRlM2QoJyArIHggKyAncHgsMCwwKScgOiAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRyYXdlciwgJy13ZWJraXQtdHJhbnNmb3JtJywgeCA/ICd0cmFuc2xhdGUzZCgnICsgeCArICdweCwwLDApJyA6ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMub3ZlcmxheSwgJ29wYWNpdHknLCBvcGFjaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b2dnbGVPcGVuZWRFdmVudCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMudG9nZ2xlT3BlbmVkRXZlbnQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5vcGVuZWQuZW1pdCgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHRvZ2dsZUNsb3NlZEV2ZW50ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy50b2dnbGVDbG9zZWRFdmVudCwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCk7XG4gICAgfTtcbn1cbiIsIjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEl0ZW1zVGVtcGxhdGU+XG4gICAgPGRpdiBpZ3hEcmF3ZXJJdGVtIFtpc0hlYWRlcl09XCJ0cnVlXCI+TmF2aWdhdGlvbiBEcmF3ZXI8L2Rpdj5cbiAgICA8ZGl2IGlneERyYXdlckl0ZW0+IFN0YXJ0IGJ5IGFkZGluZzwvZGl2PlxuICAgIDxkaXYgaWd4RHJhd2VySXRlbT4gPGNvZGU+Jmx0O25nLXRlbXBsYXRlIGlneERyYXdlciZndDs8L2NvZGU+IDwvZGl2PlxuICAgIDxkaXYgaWd4RHJhd2VySXRlbT4gQW5kIHNvbWUgaXRlbXMgaW5zaWRlIDwvZGl2PlxuICAgIDxkaXYgaWd4RHJhd2VySXRlbT4gU3R5bGUgd2l0aCBpZ3hEcmF3ZXJJdGVtIDwvZGl2PlxuICAgIDxkaXYgaWd4RHJhd2VySXRlbT4gYW5kIGlneFJpcHBsZSBkaXJlY3RpdmVzPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48ZGl2IFtoaWRkZW5dPVwicGluXCJcbiAgICBjbGFzcz1cImlneC1uYXYtZHJhd2VyX19vdmVybGF5XCJcbiAgICBbY2xhc3MuaWd4LW5hdi1kcmF3ZXJfX292ZXJsYXktLWhpZGRlbl09XCIhaXNPcGVuXCJcbiAgICBbY2xhc3MuaWd4LW5hdi1kcmF3ZXItLWRpc2FibGUtYW5pbWF0aW9uXT1cImRpc2FibGVBbmltYXRpb25cIlxuICAgIChjbGljayk9XCJjbG9zZSgpXCIgI292ZXJsYXk+XG48L2Rpdj5cbjxhc2lkZSByb2xlPVwibmF2aWdhdGlvblwiXG4gICAgY2xhc3M9XCJpZ3gtbmF2LWRyYXdlcl9fYXNpZGVcIlxuICAgIFtjbGFzcy5pZ3gtbmF2LWRyYXdlcl9fYXNpZGUtLWNvbGxhcHNlZF09XCIhbWluaVRlbXBsYXRlICYmICFpc09wZW5cIlxuICAgIFtjbGFzcy5pZ3gtbmF2LWRyYXdlcl9fYXNpZGUtLW1pbmldPVwibWluaVRlbXBsYXRlICYmICFpc09wZW5cIlxuICAgIFtjbGFzcy5pZ3gtbmF2LWRyYXdlcl9fYXNpZGUtLW5vcm1hbF09XCIhbWluaVRlbXBsYXRlIHx8IGlzT3BlblwiXG4gICAgW2NsYXNzLmlneC1uYXYtZHJhd2VyX19hc2lkZS0tcGlubmVkXT1cInBpblwiXG4gICAgW2NsYXNzLmlneC1uYXYtZHJhd2VyX19hc2lkZS0tcmlnaHRdPVwicG9zaXRpb24gPT09ICdyaWdodCdcIiAjYXNpZGVcbiAgICBbY2xhc3MuaWd4LW5hdi1kcmF3ZXItLWRpc2FibGUtYW5pbWF0aW9uXT1cImRpc2FibGVBbmltYXRpb25cIj5cblxuICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZSB8fCBkZWZhdWx0SXRlbXNUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuPC9hc2lkZT5cbjxkaXYgY2xhc3M9XCJpZ3gtbmF2LWRyYXdlcl9fc3R5bGUtZHVtbXlcIiAjZHVtbXk+PC9kaXY+XG4iXX0=