import { AnimationBuilder } from '@angular/animations';
import { ApplicationRef, ComponentFactoryResolver, ElementRef, EventEmitter, Injector, NgModuleRef, NgZone, OnDestroy, Type } from '@angular/core';
import { PlatformUtil } from '../../core/utils';
import { IgxOverlayOutletDirective } from '../../directives/toggle/toggle.directive';
import { AbsolutePosition, OverlayAnimationEventArgs, OverlayCancelableEventArgs, OverlayClosingEventArgs, OverlayEventArgs, OverlayInfo, OverlaySettings, Point, RelativePosition, RelativePositionStrategy } from './utilities';
import * as i0 from "@angular/core";
/**
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/overlay-main)
 * The overlay service allows users to show components on overlay div above all other elements in the page.
 */
export declare class IgxOverlayService implements OnDestroy {
    private _factoryResolver;
    private _appRef;
    private _injector;
    private builder;
    private document;
    private _zone;
    protected platformUtil: PlatformUtil;
    /**
     * Emitted just before the overlay content starts to open.
     * ```typescript
     * opening(event: OverlayCancelableEventArgs){
     *     const opening = event;
     * }
     * ```
     */
    opening: EventEmitter<OverlayCancelableEventArgs>;
    /**
     * Emitted after the overlay content is opened and all animations are finished.
     * ```typescript
     * opened(event: OverlayEventArgs){
     *     const opened = event;
     * }
     * ```
     */
    opened: EventEmitter<OverlayEventArgs>;
    /**
     * Emitted just before the overlay content starts to close.
     * ```typescript
     * closing(event: OverlayCancelableEventArgs){
     *     const closing = event;
     * }
     * ```
     */
    closing: EventEmitter<OverlayClosingEventArgs>;
    /**
     * Emitted after the overlay content is closed and all animations are finished.
     * ```typescript
     * closed(event: OverlayEventArgs){
     *     const closed = event;
     * }
     * ```
     */
    closed: EventEmitter<OverlayEventArgs>;
    /**
     * Emitted after the content is appended to the overlay, and before animations are started.
     * ```typescript
     * contentAppended(event: OverlayEventArgs){
     *     const contentAppended = event;
     * }
     * ```
     */
    contentAppended: EventEmitter<OverlayEventArgs>;
    /**
     * Emitted just before the overlay animation start.
     * ```typescript
     * animationStarting(event: OverlayAnimationEventArgs){
     *     const animationStarting = event;
     * }
     * ```
     */
    animationStarting: EventEmitter<OverlayAnimationEventArgs>;
    private _componentId;
    private _overlayInfos;
    private _overlayElement;
    private _document;
    private _keyPressEventListener;
    private destroy$;
    private _cursorStyleIsSet;
    private _cursorOriginalValue;
    private _defaultSettings;
    constructor(_factoryResolver: ComponentFactoryResolver, _appRef: ApplicationRef, _injector: Injector, builder: AnimationBuilder, document: any, _zone: NgZone, platformUtil: PlatformUtil);
    /**
     * Creates overlay settings with global or container position strategy and preset position settings
     *
     * @param position Preset position settings. Default position is 'center'
     * @param outlet The outlet container to attach the overlay to
     * @returns Non-modal overlay settings based on Global or Container position strategy and the provided position.
     */
    static createAbsoluteOverlaySettings(position?: AbsolutePosition, outlet?: IgxOverlayOutletDirective | ElementRef): OverlaySettings;
    /**
     * Creates overlay settings with auto, connected or elastic position strategy and preset position settings
     *
     * @param target Attaching target for the component to show
     * @param strategy The relative position strategy to be applied to the overlay settings. Default is Auto positioning strategy.
     * @param position Preset position settings. By default the element is positioned below the target, left aligned.
     * @returns Non-modal overlay settings based on the provided target, strategy and position.
     */
    static createRelativeOverlaySettings(target: Point | HTMLElement, position?: RelativePosition, strategy?: RelativePositionStrategy): OverlaySettings;
    private static createAbsolutePositionSettings;
    private static createRelativePositionSettings;
    private static createPositionStrategy;
    /**
     * Generates Id. Provide this Id when call `show(id)` method
     *
     * @param component ElementRef to show in overlay
     * @param settings Display settings for the overlay, such as positioning and scroll/close behavior.
     * @returns Id of the created overlay. Valid until `detach` is called.
     */
    attach(element: ElementRef, settings?: OverlaySettings): string;
    /**
     * Generates Id. Provide this Id when call `show(id)` method
     *
     * @param component Component Type to show in overlay
     * @param settings Display settings for the overlay, such as positioning and scroll/close behavior.
     * @param moduleRef Optional reference to an object containing Injector and ComponentFactoryResolver
     * that can resolve the component's factory
     * @returns Id of the created overlay. Valid until `detach` is called.
     */
    attach(component: Type<any>, settings?: OverlaySettings, moduleRef?: Pick<NgModuleRef<any>, 'injector' | 'componentFactoryResolver'>): string;
    /**
     * Remove overlay with the provided id.
     *
     * @param id Id of the overlay to remove
     * ```typescript
     * this.overlay.detach(id);
     * ```
     */
    detach(id: string): void;
    /**
     * Remove all the overlays.
     * ```typescript
     * this.overlay.detachAll();
     * ```
     */
    detachAll(): void;
    /**
     * Shows the overlay for provided id.
     *
     * @param id Id to show overlay for
     * @param settings Display settings for the overlay, such as positioning and scroll/close behavior.
     */
    show(id: string, settings?: OverlaySettings): void;
    /**
     * Hides the component with the ID provided as a parameter.
     * ```typescript
     * this.overlay.hide(id);
     * ```
     */
    hide(id: string, event?: Event): void;
    /**
     * Hides all the components and the overlay.
     * ```typescript
     * this.overlay.hideAll();
     * ```
     */
    hideAll(): void;
    /**
     * Repositions the component with ID provided as a parameter.
     *
     * @param id Id to reposition overlay for
     * ```typescript
     * this.overlay.reposition(id);
     * ```
     */
    reposition(id: string): void;
    /**
     * Offsets the content along the corresponding axis by the provided amount
     *
     * @param id Id to offset overlay for
     * @param deltaX Amount of offset in horizontal direction
     * @param deltaY Amount of offset in vertical direction
     * ```typescript
     * this.overlay.setOffset(id, deltaX, deltaY);
     * ```
     */
    setOffset(id: string, deltaX: number, deltaY: number): void;
    /** @hidden */
    repositionAll: () => void;
    /** @hidden */
    ngOnDestroy(): void;
    /** @hidden @internal */
    getOverlayById(id: string): OverlayInfo;
    private _hide;
    private getOverlayInfo;
    private placeElementHook;
    private moveElementToOverlay;
    private getWrapperElement;
    private getContentElement;
    private getOverlayElement;
    private updateSize;
    private closeDone;
    private cleanUp;
    private playOpenAnimation;
    private playCloseAnimation;
    private applyAnimationParams;
    private documentClicked;
    private addOutsideClickListener;
    private removeOutsideClickListener;
    private addResizeHandler;
    private removeResizeHandler;
    private addCloseOnEscapeListener;
    private removeCloseOnEscapeListener;
    private addModalClasses;
    private removeModalClasses;
    private buildAnimationPlayers;
    private openAnimationDone;
    private closeAnimationDone;
    private finishAnimations;
    static ??fac: i0.????FactoryDeclaration<IgxOverlayService, never>;
    static ??prov: i0.????InjectableDeclaration<IgxOverlayService>;
}
