import { AfterContentInit, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange, Renderer2 } from '@angular/core';
import { IgxNavigationService, IToggleView } from '../core/navigation';
import { HammerGesturesManager } from '../core/touch';
import { IgxNavDrawerMiniTemplateDirective, IgxNavDrawerTemplateDirective } from './navigation-drawer.directives';
import { PlatformUtil } from '../core/utils';
import * as i0 from "@angular/core";
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
export declare class IgxNavigationDrawerComponent implements IToggleView, OnInit, AfterContentInit, OnDestroy, OnChanges {
    private elementRef;
    private _state;
    protected renderer: Renderer2;
    private _touchManager;
    private platformUtil;
    /** @hidden @internal */
    cssClass: boolean;
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
    id: string;
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
    position: string;
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
    enableGestures: boolean;
    /**
     * @hidden
     */
    isOpenChange: EventEmitter<boolean>;
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
    pinThreshold: number;
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
    pin: boolean;
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
    width: string;
    /**
     * Enables/disables the animation, when toggling the drawer. Set to `false` by default.
     * ````html
     * <igx-nav-drawer [disableAnimation]="true"></igx-nav-drawer>
     * ````
     */
    disableAnimation: boolean;
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
    miniWidth: string;
    /**
     * Pinned state change output for two-way binding.
     *
     * ```html
     * <igx-nav-drawer [(pin)]='isPinned'></igx-nav-drawer>
     * ```
     */
    pinChange: EventEmitter<boolean>;
    /**
     * Event fired as the Navigation Drawer is about to open.
     *
     * ```html
     *  <igx-nav-drawer (opening)='onOpening()'></igx-nav-drawer>
     * ```
     */
    opening: EventEmitter<any>;
    /**
     * Event fired when the Navigation Drawer has opened.
     *
     * ```html
     * <igx-nav-drawer (opened)='onOpened()'></igx-nav-drawer>
     * ```
     */
    opened: EventEmitter<any>;
    /**
     * Event fired as the Navigation Drawer is about to close.
     *
     * ```html
     * <igx-nav-drawer (closing)='onClosing()'></igx-nav-drawer>
     * ```
     */
    closing: EventEmitter<any>;
    /**
     * Event fired when the Navigation Drawer has closed.
     *
     * ```html
     * <igx-nav-drawer (closed)='onClosed()'></igx-nav-drawer>
     * ```
     */
    closed: EventEmitter<any>;
    /**
     * @hidden
     */
    protected contentTemplate: IgxNavDrawerTemplateDirective;
    private _drawer;
    private _overlay;
    private _styleDummy;
    private _isOpen;
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
    get isOpen(): boolean;
    set isOpen(value: boolean);
    /**
     * Returns nativeElement of the component.
     *
     * @hidden
     */
    get element(): any;
    /**
     * @hidden
     */
    get template(): import("@angular/core").TemplateRef<any>;
    private _miniTemplate;
    /**
     * @hidden
     */
    get miniTemplate(): IgxNavDrawerMiniTemplateDirective;
    /**
     * @hidden
     */
    set miniTemplate(v: IgxNavDrawerMiniTemplateDirective);
    /**
     * @hidden
     */
    get flexWidth(): string;
    /** @hidden */
    get isPinnedRight(): "0" | "1";
    private _gesturesAttached;
    private _widthCache;
    private _resizeObserver;
    private css;
    /**
     * @hidden
     */
    get drawer(): any;
    /**
     * @hidden
     */
    get overlay(): any;
    /**
     * @hidden
     */
    get styleDummy(): any;
    /** Pan animation properties */
    private _panning;
    private _panStartWidth;
    private _panLimit;
    /**
     * Property to decide whether to change width or translate the drawer from pan gesture.
     *
     * @hidden
     */
    get hasAnimateWidth(): boolean;
    private _maxEdgeZone;
    /**
     * Used for touch gestures (swipe and pan).
     * Defaults to 50 (in px) and is extended to at least 110% of the mini template width if available.
     *
     * @hidden
     */
    get maxEdgeZone(): number;
    /**
     * Gets the Drawer width for specific state.
     * Will attempt to evaluate requested state and cache.
     *
     *
     * @hidden
     */
    get expectedWidth(): number;
    /**
     * Get the Drawer mini width for specific state.
     * Will attempt to evaluate requested state and cache.
     *
     * @hidden
     */
    get expectedMiniWidth(): number;
    /**
     * @hidden
     */
    get touchManager(): HammerGesturesManager;
    /**
     * Exposes optional navigation service
     *
     * @hidden
     */
    get state(): IgxNavigationService;
    constructor(elementRef: ElementRef, _state: IgxNavigationService, renderer: Renderer2, _touchManager: HammerGesturesManager, platformUtil: PlatformUtil);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    /**
     * Toggle the open state of the Navigation Drawer.
     *
     * ```typescript
     * this.navdrawer.toggle();
     * ```
     */
    toggle(): void;
    /**
     * Open the Navigation Drawer. Has no effect if already opened.
     *
     * ```typescript
     * this.navdrawer.open();
     * ```
     */
    open(): void;
    /**
     * Close the Navigation Drawer. Has no effect if already closed.
     *
     * ```typescript
     * this.navdrawer.close();
     * ```
     */
    close(): void;
    /**
     * @hidden
     */
    protected set_maxEdgeZone(value: number): void;
    /**
     * Get the Drawer width for specific state. Will attempt to evaluate requested state and cache.
     *
     * @hidden
     * @param [mini] - Request mini width instead
     */
    protected getExpectedWidth(mini?: boolean): number;
    private getWindowWidth;
    /**
     * Sets the drawer width.
     */
    private setDrawerWidth;
    /**
     * Get current Drawer width.
     */
    private getDrawerWidth;
    private ensureEvents;
    private updateEdgeZone;
    private checkPinThreshold;
    private swipe;
    private panstart;
    private pan;
    private panEnd;
    private resetPan;
    /**
     * Sets the absolute position or width in case the drawer doesn't change position.
     *
     * @param x the number pixels to translate on the X axis or the width to set. 0 width will clear the style instead.
     * @param opacity optional value to apply to the overlay
     */
    private setXSize;
    private toggleOpenedEvent;
    private toggleClosedEvent;
    static ??fac: i0.????FactoryDeclaration<IgxNavigationDrawerComponent, [null, { optional: true; }, null, null, null]>;
    static ??cmp: i0.????ComponentDeclaration<IgxNavigationDrawerComponent, "igx-nav-drawer", never, { "id": "id"; "position": "position"; "enableGestures": "enableGestures"; "pinThreshold": "pinThreshold"; "pin": "pin"; "width": "width"; "disableAnimation": "disableAnimation"; "miniWidth": "miniWidth"; "isOpen": "isOpen"; }, { "isOpenChange": "isOpenChange"; "pinChange": "pinChange"; "opening": "opening"; "opened": "opened"; "closing": "closing"; "closed": "closed"; }, ["contentTemplate", "miniTemplate"], never>;
}
