import { ElementRef, EventEmitter, OnDestroy, QueryList, IterableDiffers, AfterContentInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { IBaseEventArgs, PlatformUtil } from '../core/utils';
import { AnimationBuilder } from '@angular/animations';
import { IgxSlideComponent } from './slide.component';
import { ICarouselResourceStrings } from '../core/i18n/carousel-resources';
import { HammerGestureConfig } from '@angular/platform-browser';
import { HorizontalAnimationType, Direction, IgxCarouselComponentBase } from './carousel-base';
import * as i0 from "@angular/core";
import * as i1 from "./slide.component";
import * as i2 from "./carousel.directives";
import * as i3 from "@angular/common";
import * as i4 from "../icon/public_api";
export declare const CarouselIndicatorsOrientation: {
    bottom: "bottom";
    top: "top";
};
export declare type CarouselIndicatorsOrientation = (typeof CarouselIndicatorsOrientation)[keyof typeof CarouselIndicatorsOrientation];
export declare class CarouselHammerConfig extends HammerGestureConfig {
    overrides: {
        pan: {
            direction: 6;
        };
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<CarouselHammerConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CarouselHammerConfig>;
}
/**
 * **Ignite UI for Angular Carousel** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/carousel.html)
 *
 * The Ignite UI Carousel is used to browse or navigate through a collection of slides. Slides can contain custom
 * content such as images or cards and be used for things such as on-boarding tutorials or page-based interfaces.
 * It can be used as a separate fullscreen element or inside another component.
 *
 * Example:
 * ```html
 * <igx-carousel>
 *   <igx-slide>
 *     <h3>First Slide Header</h3>
 *     <p>First slide Content</p>
 *   <igx-slide>
 *   <igx-slide>
 *     <h3>Second Slide Header</h3>
 *     <p>Second Slide Content</p>
 * </igx-carousel>
 * ```
 */
export declare class IgxCarouselComponent extends IgxCarouselComponentBase implements OnDestroy, AfterContentInit {
    private element;
    private iterableDiffers;
    private platformUtil;
    /**
     * Sets the `id` of the carousel.
     * If not set, the `id` of the first carousel component will be `"igx-carousel-0"`.
     * ```html
     * <igx-carousel id="my-first-carousel"></igx-carousel>
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    id: string;
    /**
     * Returns the `role` attribute of the carousel.
     * ```typescript
     * let carouselRole =  this.carousel.role;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    role: string;
    /** @hidden */
    roleDescription: string;
    /** @hidden */
    get labelId(): string;
    /**
     * Returns the class of the carousel component.
     * ```typescript
     * let class =  this.carousel.cssClass;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    cssClass: string;
    /**
     * Gets the `touch-action` style of the `list item`.
     * ```typescript
     * let touchAction = this.listItem.touchAction;
     * ```
     */
    get touchAction(): "auto" | "pan-y";
    /**
     * Sets whether the carousel should `loop` back to the first slide after reaching the last slide.
     * Default value is `true`.
     * ```html
     * <igx-carousel [loop]="false"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    loop: boolean;
    /**
     * Sets whether the carousel will `pause` the slide transitions on user interactions.
     * Default value is `true`.
     * ```html
     *  <igx-carousel [pause]="false"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    pause: boolean;
    /**
     * Controls whether the carousel should render the left/right `navigation` buttons.
     * Default value is `true`.
     * ```html
     * <igx-carousel [navigation] = "false"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    navigation: boolean;
    /**
     * Controls whether the carousel should support keyboard navigation.
     * Default value is `true`.
     * ```html
     * <igx-carousel [keyboardSupport] = "false"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    keyboardSupport: boolean;
    /**
     * Controls whether the carousel should support gestures.
     * Default value is `true`.
     * ```html
     * <igx-carousel [gesturesSupport] = "false"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    gesturesSupport: boolean;
    /**
     * Controls the maximum indexes that can be shown.
     * Default value is `5`.
     * ```html
     * <igx-carousel [maximumIndicatorsCount] = "10"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    maximumIndicatorsCount: number;
    /**
     * Gets/sets the display mode of carousel indicators. It can be top or bottom.
     * Default value is `bottom`.
     * ```html
     * <igx-carousel indicatorsOrientation='top'>
     * <igx-carousel>
     * ```
     *
     * @memberOf IgxSlideComponent
     */
    indicatorsOrientation: CarouselIndicatorsOrientation;
    /**
     * Gets/sets the animation type of carousel.
     * Default value is `slide`.
     * ```html
     * <igx-carousel animationType='none'>
     * <igx-carousel>
     * ```
     *
     * @memberOf IgxSlideComponent
     */
    animationType: HorizontalAnimationType;
    /**
     * The custom template, if any, that should be used when rendering carousel indicators
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
     * myComponent.carousel.indicatorTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-carousel #carousel>
     *      ...
     *      <ng-template igxCarouselIndicator let-slide>
     *         <igx-icon *ngIf="slide.active">brightness_7</igx-icon>
     *         <igx-icon *ngIf="!slide.active">brightness_5</igx-icon>
     *      </ng-template>
     *  </igx-carousel>
     * ```
     */
    indicatorTemplate: TemplateRef<any>;
    /**
     * The custom template, if any, that should be used when rendering carousel next button
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
     * myComponent.carousel.nextButtonTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-carousel #carousel>
     *      ...
     *      <ng-template igxCarouselNextButton let-disabled>
     *            <button igxButton="fab" igxRipple="white" [disabled]="disabled">
     *                <igx-icon>add</igx-icon>
     *           </button>
     *      </ng-template>
     *  </igx-carousel>
     * ```
     */
    nextButtonTemplate: TemplateRef<any>;
    /**
     * The custom template, if any, that should be used when rendering carousel previous button
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
     * myComponent.carousel.nextButtonTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-carousel #carousel>
     *      ...
     *      <ng-template igxCarouselPrevButton let-disabled>
     *            <button igxButton="fab" igxRipple="white" [disabled]="disabled">
     *                <igx-icon>remove</igx-icon>
     *           </button>
     *      </ng-template>
     *  </igx-carousel>
     * ```
     */
    prevButtonTemplate: TemplateRef<any>;
    /**
     * The collection of `slides` currently in the carousel.
     * ```typescript
     * let slides: QueryList<IgxSlideComponent> = this.carousel.slides;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    slides: QueryList<IgxSlideComponent>;
    /**
     * An event that is emitted after a slide transition has happened.
     * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
     * ```html
     * <igx-carousel (onSlideChanged)="onSlideChanged($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    onSlideChanged: EventEmitter<ISlideEventArgs>;
    /**
     * An event that is emitted after a slide has been added to the carousel.
     * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
     * ```html
     * <igx-carousel (onSlideAdded)="onSlideAdded($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    onSlideAdded: EventEmitter<ISlideEventArgs>;
    /**
     * An event that is emitted after a slide has been removed from the carousel.
     * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
     * ```html
     * <igx-carousel (onSlideRemoved)="onSlideRemoved($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    onSlideRemoved: EventEmitter<ISlideEventArgs>;
    /**
     * An event that is emitted after the carousel has been paused.
     * Provides a reference to the `IgxCarouselComponent` as an event argument.
     * ```html
     * <igx-carousel (onCarouselPaused)="onCarouselPaused($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    onCarouselPaused: EventEmitter<IgxCarouselComponent>;
    /**
     * An event that is emitted after the carousel has resumed transitioning between `slides`.
     * Provides a reference to the `IgxCarouselComponent` as an event argument.
     * ```html
     * <igx-carousel (onCarouselPlaying)="onCarouselPlaying($event)"></igx-carousel>
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    onCarouselPlaying: EventEmitter<IgxCarouselComponent>;
    private defaultIndicator;
    private defaultNextButton;
    private defaultPrevButton;
    /**
     * @hidden
     * @internal
     */
    stoppedByInteraction: boolean;
    protected currentItem: IgxSlideComponent;
    protected previousItem: IgxSlideComponent;
    private _interval;
    private _resourceStrings;
    private lastInterval;
    private playing;
    private destroyed;
    private destroy$;
    private differ;
    private incomingSlide;
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: ICarouselResourceStrings);
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings(): ICarouselResourceStrings;
    /** @hidden */
    get getIndicatorTemplate(): TemplateRef<any>;
    /** @hidden */
    get getNextButtonTemplate(): TemplateRef<any>;
    /** @hidden */
    get getPrevButtonTemplate(): TemplateRef<any>;
    /** @hidden */
    get indicatorsOrientationClass(): string;
    /** @hidden */
    get showIndicators(): boolean;
    /** @hidden */
    get showIndicatorsLabel(): boolean;
    /** @hidden */
    get getCarouselLabel(): string;
    /**
     * Returns the total number of `slides` in the carousel.
     * ```typescript
     * let slideCount =  this.carousel.total;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get total(): number;
    /**
     * The index of the slide being currently shown.
     * ```typescript
     * let currentSlideNumber =  this.carousel.current;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get current(): number;
    /**
     * Returns a boolean indicating if the carousel is playing.
     * ```typescript
     * let isPlaying =  this.carousel.isPlaying;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get isPlaying(): boolean;
    /**
     * Returns а boolean indicating if the carousel is destroyed.
     * ```typescript
     * let isDestroyed =  this.carousel.isDestroyed;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get isDestroyed(): boolean;
    /**
     * Returns a reference to the carousel element in the DOM.
     * ```typescript
     * let nativeElement =  this.carousel.nativeElement;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    get nativeElement(): any;
    /**
     * Returns the time `interval` in milliseconds before the slide changes.
     * ```typescript
     * let timeInterval = this.carousel.interval;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    get interval(): number;
    /**
     * Sets the time `interval` in milliseconds before the slide changes.
     * If not set, the carousel will not change `slides` automatically.
     * ```html
     * <igx-carousel [interval] = "1000"></igx-carousel>
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    set interval(value: number);
    constructor(cdr: ChangeDetectorRef, element: ElementRef, iterableDiffers: IterableDiffers, builder: AnimationBuilder, platformUtil: PlatformUtil);
    /** @hidden */
    onKeydownArrowRight(event: any): void;
    /** @hidden */
    onKeydownArrowLeft(event: any): void;
    /** @hidden */
    onTap(event: any): void;
    /** @hidden */
    onKeydownHome(event: any): void;
    /** @hidden */
    onKeydownEnd(event: any): void;
    /** @hidden */
    onMouseEnter(): void;
    /** @hidden */
    onMouseLeave(): void;
    /** @hidden */
    onPanLeft(event: any): void;
    /** @hidden */
    onPanRight(event: any): void;
    /**
     * @hidden
     */
    onPanEnd(event: any): void;
    /** @hidden */
    ngAfterContentInit(): void;
    /** @hidden */
    ngOnDestroy(): void;
    /**
     * Returns the slide corresponding to the provided `index` or null.
     * ```typescript
     * let slide1 =  this.carousel.get(1);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get(index: number): IgxSlideComponent;
    /**
     * Adds a new slide to the carousel.
     * ```typescript
     * this.carousel.add(newSlide);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    add(slide: IgxSlideComponent): void;
    /**
     * Removes a slide from the carousel.
     * ```typescript
     * this.carousel.remove(slide);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    remove(slide: IgxSlideComponent): void;
    /**
     * Kicks in a transition for a given slide with a given `direction`.
     * ```typescript
     * this.carousel.select(this.carousel.get(2), Direction.NEXT);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    select(slide: IgxSlideComponent, direction?: Direction): void;
    /**
     * Transitions to the next slide in the carousel.
     * ```typescript
     * this.carousel.next();
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    next(): void;
    /**
     * Transitions to the previous slide in the carousel.
     * ```typescript
     * this.carousel.prev();
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    prev(): void;
    /**
     * Resumes playing of the carousel if in paused state.
     * No operation otherwise.
     * ```typescript
     * this.carousel.play();
     * }
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    play(): void;
    /**
     * Stops slide transitions if the `pause` option is set to `true`.
     * No operation otherwise.
     * ```typescript
     *  this.carousel.stop();
     * }
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    stop(): void;
    protected getPreviousElement(): HTMLElement;
    protected getCurrentElement(): HTMLElement;
    private resetInterval;
    private restartInterval;
    /** @hidden */
    get nextButtonDisabled(): boolean;
    /** @hidden */
    get prevButtonDisabled(): boolean;
    private getNextIndex;
    private getPrevIndex;
    private resetSlideStyles;
    private pan;
    private unsubscriber;
    private onSlideActivated;
    private finishAnimations;
    private initSlides;
    private updateSlidesSelection;
    private focusSlideElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCarouselComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxCarouselComponent, "igx-carousel", never, { "id": "id"; "loop": "loop"; "pause": "pause"; "navigation": "navigation"; "keyboardSupport": "keyboardSupport"; "gesturesSupport": "gesturesSupport"; "maximumIndicatorsCount": "maximumIndicatorsCount"; "indicatorsOrientation": "indicatorsOrientation"; "animationType": "animationType"; "resourceStrings": "resourceStrings"; "interval": "interval"; }, { "onSlideChanged": "onSlideChanged"; "onSlideAdded": "onSlideAdded"; "onSlideRemoved": "onSlideRemoved"; "onCarouselPaused": "onCarouselPaused"; "onCarouselPlaying": "onCarouselPlaying"; }, ["indicatorTemplate", "nextButtonTemplate", "prevButtonTemplate", "slides"], ["*"]>;
}
export interface ISlideEventArgs extends IBaseEventArgs {
    carousel: IgxCarouselComponent;
    slide: IgxSlideComponent;
}
/**
 * @hidden
 */
export declare class IgxCarouselModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCarouselModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IgxCarouselModule, [typeof IgxCarouselComponent, typeof i1.IgxSlideComponent, typeof i2.IgxCarouselIndicatorDirective, typeof i2.IgxCarouselNextButtonDirective, typeof i2.IgxCarouselPrevButtonDirective], [typeof i3.CommonModule, typeof i4.IgxIconModule], [typeof IgxCarouselComponent, typeof i1.IgxSlideComponent, typeof i2.IgxCarouselIndicatorDirective, typeof i2.IgxCarouselNextButtonDirective, typeof i2.IgxCarouselPrevButtonDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IgxCarouselModule>;
}
