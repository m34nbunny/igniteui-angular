import { AnimationPlayer, AnimationReferenceMetadata } from '@angular/animations';
import { ComponentRef, ElementRef, NgZone } from '@angular/core';
import { CancelableBrowserEventArgs, CancelableEventArgs, IBaseEventArgs } from '../../core/utils';
import { IgxOverlayOutletDirective } from '../../directives/toggle/toggle.directive';
import { IPositionStrategy } from './position/IPositionStrategy';
import { IScrollStrategy } from './scroll';
export declare enum HorizontalAlignment {
    Left = -1,
    Center = -0.5,
    Right = 0
}
export declare enum VerticalAlignment {
    Top = -1,
    Middle = -0.5,
    Bottom = 0
}
/**
 * Defines the possible values of the overlays' position strategy.
 */
export declare enum RelativePositionStrategy {
    Connected = "connected",
    Auto = "auto",
    Elastic = "elastic"
}
/**
 * Defines the possible positions for the relative overlay settings presets.
 */
export declare enum RelativePosition {
    Above = "above",
    Below = "below",
    Before = "before",
    After = "after",
    Default = "default"
}
/**
 * Defines the possible positions for the absolute overlay settings presets.
 */
export declare enum AbsolutePosition {
    Bottom = "bottom",
    Top = "top",
    Center = "center"
}
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
/** @hidden */
export interface OutOfViewPort {
    /** Out of view port at Top or Left */
    back: number;
    /** Out of view port at Bottom or Right */
    forward: number;
}
export interface PositionSettings {
    /**
     * @deprecated in version 10.2.0. Set the target point/element in the overlay settings instead
     *
     * Attaching target for the component to show
     */
    target?: Point | HTMLElement;
    /** Direction in which the component should show */
    horizontalDirection?: HorizontalAlignment;
    /** Direction in which the component should show */
    verticalDirection?: VerticalAlignment;
    /** Target's starting point */
    horizontalStartPoint?: HorizontalAlignment;
    /** Target's starting point */
    verticalStartPoint?: VerticalAlignment;
    /** Animation applied while overlay opens */
    openAnimation?: AnimationReferenceMetadata;
    /** Animation applied while overlay closes */
    closeAnimation?: AnimationReferenceMetadata;
    /** The size up to which element may shrink when shown in elastic position strategy */
    minSize?: Size;
}
export interface OverlaySettings {
    /** Attaching target for the component to show */
    target?: Point | HTMLElement;
    /** Position strategy to use with these settings */
    positionStrategy?: IPositionStrategy;
    /** Scroll strategy to use with these settings */
    scrollStrategy?: IScrollStrategy;
    /** Set if the overlay should be in modal mode */
    modal?: boolean;
    /** Set if the overlay should close on outside click */
    closeOnOutsideClick?: boolean;
    /** Set if the overlay should close when `Esc` key is pressed */
    closeOnEscape?: boolean;
    /** Set the outlet container to attach the overlay to */
    outlet?: IgxOverlayOutletDirective | ElementRef;
    /**
     * @hidden @internal
     * Elements to be excluded for closeOnOutsideClick.
     * Clicking on the elements in this collection will not close the overlay when closeOnOutsideClick = true.
     */
    excludeFromOutsideClick?: HTMLElement[];
}
export interface OverlayEventArgs extends IBaseEventArgs {
    /** Id of the overlay generated with `attach()` method */
    id: string;
    /** Available when `Type<T>` is provided to the `attach()` method and allows access to the created Component instance */
    componentRef?: ComponentRef<any>;
    /** Will provide the original keyboard event if closed from ESC or click */
    event?: Event;
}
export interface OverlayCancelableEventArgs extends OverlayEventArgs, CancelableEventArgs {
}
export interface OverlayClosingEventArgs extends OverlayEventArgs, CancelableBrowserEventArgs {
}
export interface OverlayAnimationEventArgs extends IBaseEventArgs {
    /** Id of the overlay generated with `attach()` method */
    id: string;
    /** Animation player that will play the animation */
    animationPlayer: AnimationPlayer;
    /** Type of animation to be played. It should be either 'open' or 'close' */
    animationType: 'open' | 'close';
}
export interface Size {
    /** Gets or sets the horizontal component of Size */
    width: number;
    /** Gets or sets the vertical component of Size */
    height: number;
}
/** @hidden */
export interface OverlayInfo {
    id?: string;
    visible?: boolean;
    detached?: boolean;
    elementRef?: ElementRef;
    componentRef?: ComponentRef<any>;
    settings?: OverlaySettings;
    initialSize?: Size;
    hook?: HTMLElement;
    openAnimationPlayer?: AnimationPlayer;
    openAnimationInnerPlayer?: any;
    openAnimationDetaching?: boolean;
    closeAnimationPlayer?: AnimationPlayer;
    closeAnimationDetaching?: boolean;
    closeAnimationInnerPlayer?: any;
    ngZone: NgZone;
    transformX?: number;
    transformY?: number;
    event?: Event;
    wrapperElement?: HTMLElement;
}
/** @hidden */
export interface ConnectedFit {
    contentElementRect?: Partial<DOMRect>;
    targetRect?: Partial<DOMRect>;
    viewPortRect?: Partial<DOMRect>;
    fitHorizontal?: OutOfViewPort;
    fitVertical?: OutOfViewPort;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    horizontalOffset?: number;
    verticalOffset?: number;
}
/** @hidden @internal */
export declare class Util {
    /**
     * Calculates the rectangle of target for provided overlay settings. Defaults to 0,0,0,0,0,0 rectangle
     * if no target is provided
     *
     * @param settings Overlay settings for which to calculate target rectangle
     */
    static getTargetRect(target?: Point | HTMLElement): Partial<DOMRect>;
    static getViewportRect(document: Document): Partial<DOMRect>;
    static getViewportScrollPosition(document: Document): Point;
    static cloneInstance(object: any): any;
}
