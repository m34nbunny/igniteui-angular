import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CancelableBrowserEventArgs, IBaseEventArgs } from '../../core/utils';
import { IgxNavigationService, IToggleView } from '../../core/navigation';
import { IgxOverlayService } from '../../services/overlay/overlay';
import { OverlaySettings } from '../../services/overlay/utilities';
import * as i0 from "@angular/core";
export interface ToggleViewEventArgs extends IBaseEventArgs {
    /** Id of the toggle view */
    id: string;
    event?: Event;
}
export interface ToggleViewCancelableEventArgs extends ToggleViewEventArgs, CancelableBrowserEventArgs {
}
export declare class IgxToggleDirective implements IToggleView, OnInit, OnDestroy {
    private elementRef;
    private cdr;
    protected overlayService: IgxOverlayService;
    private navigationService;
    /**
     * Emits an event after the toggle container is opened.
     *
     * ```typescript
     * onToggleOpened(event) {
     *    alert("Toggle opened!");
     * }
     * ```
     *
     * ```html
     * <div
     *   igxToggle
     *   (onOpened)='onToggleOpened($event)'>
     * </div>
     * ```
     */
    opened: EventEmitter<ToggleViewEventArgs>;
    /**
     * Emits an event before the toggle container is opened.
     *
     * ```typescript
     * onToggleOpening(event) {
     *  alert("Toggle opening!");
     * }
     * ```
     *
     * ```html
     * <div
     *   igxToggle
     *   (onOpening)='onToggleOpening($event)'>
     * </div>
     * ```
     */
    opening: EventEmitter<ToggleViewCancelableEventArgs>;
    /**
     * Emits an event after the toggle container is closed.
     *
     * ```typescript
     * onToggleClosed(event) {
     *  alert("Toggle closed!");
     * }
     * ```
     *
     * ```html
     * <div
     *   igxToggle
     *   (onClosed)='onToggleClosed($event)'>
     * </div>
     * ```
     */
    closed: EventEmitter<ToggleViewEventArgs>;
    /**
     * Emits an event before the toggle container is closed.
     *
     * ```typescript
     * onToggleClosing(event) {
     *  alert("Toggle closing!");
     * }
     * ```
     *
     * ```html
     * <div
     *  igxToggle
     *  (closing)='onToggleClosing($event)'>
     * </div>
     * ```
     */
    closing: EventEmitter<ToggleViewCancelableEventArgs>;
    /**
     * Emits an event after the toggle element is appended to the overlay container.
     *
     * ```typescript
     * onAppended() {
     *  alert("Content appended!");
     * }
     * ```
     *
     * ```html
     * <div
     *   igxToggle
     *   (onAppended)='onToggleAppended()'>
     * </div>
     * ```
     */
    appended: EventEmitter<ToggleViewEventArgs>;
    /**
     * @hidden
     */
    get collapsed(): boolean;
    /**
     * Identifier which is registered into `IgxNavigationService`
     *
     * ```typescript
     * let myToggleId = this.toggle.id;
     * ```
     */
    id: string;
    /**
     * @hidden
     */
    get element(): HTMLElement;
    /**
     * @hidden
     */
    get hiddenClass(): boolean;
    /**
     * @hidden
     */
    get defaultClass(): boolean;
    protected _overlayId: string;
    private _collapsed;
    private destroy$;
    private _overlaySubFilter;
    private _overlayOpenedSub;
    private _overlayClosingSub;
    private _overlayClosedSub;
    private _overlayContentAppendedSub;
    /**
     * @hidden
     */
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, overlayService: IgxOverlayService, navigationService: IgxNavigationService);
    /**
     * Opens the toggle.
     *
     * ```typescript
     * this.myToggle.open();
     * ```
     */
    open(overlaySettings?: OverlaySettings): void;
    /**
     * Closes the toggle.
     *
     * ```typescript
     * this.myToggle.close();
     * ```
     */
    close(event?: Event): void;
    /**
     * Opens or closes the toggle, depending on its current state.
     *
     * ```typescript
     * this.myToggle.toggle();
     * ```
     */
    toggle(overlaySettings?: OverlaySettings): void;
    /** @hidden @internal */
    get isClosing(): boolean;
    /**
     * Returns the id of the overlay the content is rendered in.
     * ```typescript
     * this.myToggle.overlayId;
     * ```
     */
    get overlayId(): string;
    /**
     * Repositions the toggle.
     * ```typescript
     * this.myToggle.reposition();
     * ```
     */
    reposition(): void;
    /**
     * Offsets the content along the corresponding axis by the provided amount
     */
    setOffset(deltaX: number, deltaY: number): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    private overlayClosed;
    private subscribe;
    private unsubscribe;
    private clearSubscription;
    static ??fac: i0.????FactoryDeclaration<IgxToggleDirective, [null, null, null, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<IgxToggleDirective, "[igxToggle]", ["toggle"], { "id": "id"; }, { "opened": "opened"; "opening": "opening"; "closed": "closed"; "closing": "closing"; "appended": "appended"; }, never>;
}
export declare class IgxToggleActionDirective implements OnInit {
    private element;
    private navigationService;
    /**
     * Provide settings that control the toggle overlay positioning, interaction and scroll behavior.
     * ```typescript
     * const settings: OverlaySettings = {
     *      closeOnOutsideClick: false,
     *      modal: false
     *  }
     * ```
     * ---
     * ```html
     * <!--set-->
     * <div igxToggleAction [overlaySettings]="settings"></div>
     * ```
     */
    overlaySettings: OverlaySettings;
    /**
     * Determines where the toggle element overlay should be attached.
     *
     * ```html
     * <!--set-->
     * <div igxToggleAction [igxToggleOutlet]="outlet"></div>
     * ```
     * Where `outlet` in an instance of `IgxOverlayOutletDirective` or an `ElementRef`
     */
    outlet: IgxOverlayOutletDirective | ElementRef;
    /**
     * @hidden
     */
    set target(target: any);
    /**
     * @hidden
     */
    get target(): any;
    protected _overlayDefaults: OverlaySettings;
    protected _target: IToggleView | string;
    constructor(element: ElementRef, navigationService: IgxNavigationService);
    /**
     * @hidden
     */
    onClick(): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * Updates provided overlay settings
     *
     * @param settings settings to update
     * @returns returns updated copy of provided overlay settings
     */
    protected updateOverlaySettings(settings: OverlaySettings): OverlaySettings;
    static ??fac: i0.????FactoryDeclaration<IgxToggleActionDirective, [null, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<IgxToggleActionDirective, "[igxToggleAction]", ["toggle-action"], { "overlaySettings": "overlaySettings"; "outlet": "igxToggleOutlet"; "target": "igxToggleAction"; }, {}, never>;
}
/**
 * Mark an element as an igxOverlay outlet container.
 * Directive instance is exported as `overlay-outlet` to be assigned to templates variables:
 * ```html
 * <div igxOverlayOutlet #outlet="overlay-outlet"></div>
 * ```
 */
export declare class IgxOverlayOutletDirective {
    element: ElementRef<HTMLElement>;
    constructor(element: ElementRef<HTMLElement>);
    /** @hidden */
    get nativeElement(): HTMLElement;
    static ??fac: i0.????FactoryDeclaration<IgxOverlayOutletDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxOverlayOutletDirective, "[igxOverlayOutlet]", ["overlay-outlet"], {}, {}, never>;
}
/**
 * @hidden
 */
export declare class IgxToggleModule {
    static ??fac: i0.????FactoryDeclaration<IgxToggleModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxToggleModule, [typeof IgxToggleDirective, typeof IgxToggleActionDirective, typeof IgxOverlayOutletDirective], never, [typeof IgxToggleDirective, typeof IgxToggleActionDirective, typeof IgxOverlayOutletDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxToggleModule>;
}
