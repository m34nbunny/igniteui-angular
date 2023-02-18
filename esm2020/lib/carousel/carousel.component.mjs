import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, HostListener, Input, NgModule, Output, ContentChildren, TemplateRef, ViewChild, ContentChild, Injectable } from '@angular/core';
import { IgxIconModule } from '../icon/public_api';
import { mkenum } from '../core/utils';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IgxCarouselIndicatorDirective, IgxCarouselNextButtonDirective, IgxCarouselPrevButtonDirective } from './carousel.directives';
import { IgxSlideComponent } from './slide.component';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HorizontalAnimationType, Direction, IgxCarouselComponentBase } from './carousel-base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "../core/utils";
import * as i3 from "../icon/icon.component";
import * as i4 from "@angular/common";
let NEXT_ID = 0;
export const CarouselIndicatorsOrientation = mkenum({
    bottom: 'bottom',
    top: 'top'
});
export class CarouselHammerConfig extends HammerGestureConfig {
    constructor() {
        super(...arguments);
        this.overrides = {
            pan: { direction: Hammer.DIRECTION_HORIZONTAL }
        };
    }
}
CarouselHammerConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: CarouselHammerConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
CarouselHammerConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: CarouselHammerConfig });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: CarouselHammerConfig, decorators: [{
            type: Injectable
        }] });
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
export class IgxCarouselComponent extends IgxCarouselComponentBase {
    constructor(cdr, element, iterableDiffers, builder, platformUtil) {
        super(builder, cdr);
        this.element = element;
        this.iterableDiffers = iterableDiffers;
        this.platformUtil = platformUtil;
        /**
         * Sets the `id` of the carousel.
         * If not set, the `id` of the first carousel component will be `"igx-carousel-0"`.
         * ```html
         * <igx-carousel id="my-first-carousel"></igx-carousel>
         * ```
         *
         * @memberof IgxCarouselComponent
         */
        this.id = `igx-carousel-${NEXT_ID++}`;
        /**
         * Returns the `role` attribute of the carousel.
         * ```typescript
         * let carouselRole =  this.carousel.role;
         * ```
         *
         * @memberof IgxCarouselComponent
         */
        this.role = 'region';
        /** @hidden */
        this.roleDescription = 'carousel';
        /**
         * Returns the class of the carousel component.
         * ```typescript
         * let class =  this.carousel.cssClass;
         * ```
         *
         * @memberof IgxCarouselComponent
         */
        this.cssClass = 'igx-carousel';
        /**
         * Sets whether the carousel should `loop` back to the first slide after reaching the last slide.
         * Default value is `true`.
         * ```html
         * <igx-carousel [loop]="false"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.loop = true;
        /**
         * Sets whether the carousel will `pause` the slide transitions on user interactions.
         * Default value is `true`.
         * ```html
         *  <igx-carousel [pause]="false"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.pause = true;
        /**
         * Controls whether the carousel should render the left/right `navigation` buttons.
         * Default value is `true`.
         * ```html
         * <igx-carousel [navigation] = "false"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.navigation = true;
        /**
         * Controls whether the carousel should support keyboard navigation.
         * Default value is `true`.
         * ```html
         * <igx-carousel [keyboardSupport] = "false"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.keyboardSupport = true;
        /**
         * Controls whether the carousel should support gestures.
         * Default value is `true`.
         * ```html
         * <igx-carousel [gesturesSupport] = "false"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.gesturesSupport = true;
        /**
         * Controls the maximum indexes that can be shown.
         * Default value is `5`.
         * ```html
         * <igx-carousel [maximumIndicatorsCount] = "10"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.maximumIndicatorsCount = 5;
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
        this.indicatorsOrientation = CarouselIndicatorsOrientation.bottom;
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
        this.animationType = HorizontalAnimationType.slide;
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
        this.indicatorTemplate = null;
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
        this.nextButtonTemplate = null;
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
        this.prevButtonTemplate = null;
        /**
         * An event that is emitted after a slide transition has happened.
         * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
         * ```html
         * <igx-carousel (onSlideChanged)="onSlideChanged($event)"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.onSlideChanged = new EventEmitter();
        /**
         * An event that is emitted after a slide has been added to the carousel.
         * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
         * ```html
         * <igx-carousel (onSlideAdded)="onSlideAdded($event)"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.onSlideAdded = new EventEmitter();
        /**
         * An event that is emitted after a slide has been removed from the carousel.
         * Provides references to the `IgxCarouselComponent` and `IgxSlideComponent` as event arguments.
         * ```html
         * <igx-carousel (onSlideRemoved)="onSlideRemoved($event)"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.onSlideRemoved = new EventEmitter();
        /**
         * An event that is emitted after the carousel has been paused.
         * Provides a reference to the `IgxCarouselComponent` as an event argument.
         * ```html
         * <igx-carousel (onCarouselPaused)="onCarouselPaused($event)"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.onCarouselPaused = new EventEmitter();
        /**
         * An event that is emitted after the carousel has resumed transitioning between `slides`.
         * Provides a reference to the `IgxCarouselComponent` as an event argument.
         * ```html
         * <igx-carousel (onCarouselPlaying)="onCarouselPlaying($event)"></igx-carousel>
         * ```
         *
         * @memberOf IgxCarouselComponent
         */
        this.onCarouselPlaying = new EventEmitter();
        this._resourceStrings = CurrentResourceStrings.CarouselResStrings;
        this.destroy$ = new Subject();
        this.differ = null;
        this.differ = this.iterableDiffers.find([]).create(null);
    }
    /** @hidden */
    get labelId() {
        return this.showIndicatorsLabel ? `${this.id}-label` : null;
    }
    /**
     * Gets the `touch-action` style of the `list item`.
     * ```typescript
     * let touchAction = this.listItem.touchAction;
     * ```
     */
    get touchAction() {
        return this.gesturesSupport ? 'pan-y' : 'auto';
    }
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings() {
        return this._resourceStrings;
    }
    /** @hidden */
    get getIndicatorTemplate() {
        if (this.indicatorTemplate) {
            return this.indicatorTemplate;
        }
        return this.defaultIndicator;
    }
    /** @hidden */
    get getNextButtonTemplate() {
        if (this.nextButtonTemplate) {
            return this.nextButtonTemplate;
        }
        return this.defaultNextButton;
    }
    /** @hidden */
    get getPrevButtonTemplate() {
        if (this.prevButtonTemplate) {
            return this.prevButtonTemplate;
        }
        return this.defaultPrevButton;
    }
    /** @hidden */
    get indicatorsOrientationClass() {
        return `igx-carousel-indicators--${this.indicatorsOrientation}`;
    }
    /** @hidden */
    get showIndicators() {
        return this.total <= this.maximumIndicatorsCount && this.total > 0;
    }
    /** @hidden */
    get showIndicatorsLabel() {
        return this.total > this.maximumIndicatorsCount;
    }
    /** @hidden */
    get getCarouselLabel() {
        return `${this.current + 1} ${this.resourceStrings.igx_carousel_of} ${this.total}`;
    }
    /**
     * Returns the total number of `slides` in the carousel.
     * ```typescript
     * let slideCount =  this.carousel.total;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get total() {
        return this.slides?.length;
    }
    /**
     * The index of the slide being currently shown.
     * ```typescript
     * let currentSlideNumber =  this.carousel.current;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get current() {
        return !this.currentItem ? 0 : this.currentItem.index;
    }
    /**
     * Returns a boolean indicating if the carousel is playing.
     * ```typescript
     * let isPlaying =  this.carousel.isPlaying;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get isPlaying() {
        return this.playing;
    }
    /**
     * Returns а boolean indicating if the carousel is destroyed.
     * ```typescript
     * let isDestroyed =  this.carousel.isDestroyed;
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get isDestroyed() {
        return this.destroyed;
    }
    /**
     * Returns a reference to the carousel element in the DOM.
     * ```typescript
     * let nativeElement =  this.carousel.nativeElement;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /**
     * Returns the time `interval` in milliseconds before the slide changes.
     * ```typescript
     * let timeInterval = this.carousel.interval;
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    get interval() {
        return this._interval;
    }
    /**
     * Sets the time `interval` in milliseconds before the slide changes.
     * If not set, the carousel will not change `slides` automatically.
     * ```html
     * <igx-carousel [interval] = "1000"></igx-carousel>
     * ```
     *
     * @memberof IgxCarouselComponent
     */
    set interval(value) {
        this._interval = +value;
        this.restartInterval();
    }
    /** @hidden */
    onKeydownArrowRight(event) {
        if (this.keyboardSupport) {
            event.preventDefault();
            this.next();
            this.focusSlideElement();
        }
    }
    /** @hidden */
    onKeydownArrowLeft(event) {
        if (this.keyboardSupport) {
            event.preventDefault();
            this.prev();
            this.focusSlideElement();
        }
    }
    /** @hidden */
    onTap(event) {
        // play pause only when tap on slide
        if (event.target && event.target.classList.contains('igx-slide')) {
            if (this.isPlaying) {
                if (this.pause) {
                    this.stoppedByInteraction = true;
                }
                this.stop();
            }
            else if (this.stoppedByInteraction) {
                this.play();
            }
        }
    }
    /** @hidden */
    onKeydownHome(event) {
        if (this.keyboardSupport && this.slides.length > 0) {
            event.preventDefault();
            this.slides.first.active = true;
            this.focusSlideElement();
        }
    }
    /** @hidden */
    onKeydownEnd(event) {
        if (this.keyboardSupport && this.slides.length > 0) {
            event.preventDefault();
            this.slides.last.active = true;
            this.focusSlideElement();
        }
    }
    /** @hidden */
    onMouseEnter() {
        if (this.pause && this.isPlaying) {
            this.stoppedByInteraction = true;
        }
        this.stop();
    }
    /** @hidden */
    onMouseLeave() {
        if (this.stoppedByInteraction) {
            this.play();
        }
    }
    /** @hidden */
    onPanLeft(event) {
        this.pan(event);
    }
    /** @hidden */
    onPanRight(event) {
        this.pan(event);
    }
    /**
     * @hidden
     */
    onPanEnd(event) {
        if (!this.gesturesSupport) {
            return;
        }
        event.preventDefault();
        const slideWidth = this.currentItem.nativeElement.offsetWidth;
        const panOffset = (slideWidth / 1000);
        const deltaX = Math.abs(event.deltaX) + panOffset < slideWidth ? Math.abs(event.deltaX) : slideWidth - panOffset;
        const velocity = Math.abs(event.velocity);
        this.resetSlideStyles(this.currentItem);
        if (this.incomingSlide) {
            this.resetSlideStyles(this.incomingSlide);
            if (slideWidth / 2 < deltaX || velocity > 1) {
                this.incomingSlide.direction = event.deltaX < 0 ? Direction.NEXT : Direction.PREV;
                this.incomingSlide.previous = false;
                this.animationPosition = this.animationType === HorizontalAnimationType.fade ?
                    deltaX / slideWidth : (slideWidth - deltaX) / slideWidth;
                if (velocity > 1) {
                    this.newDuration = this.defaultAnimationDuration / velocity;
                }
                this.incomingSlide.active = true;
            }
            else {
                this.currentItem.direction = event.deltaX > 0 ? Direction.NEXT : Direction.PREV;
                this.previousItem = this.incomingSlide;
                this.previousItem.previous = true;
                this.animationPosition = this.animationType === HorizontalAnimationType.fade ?
                    Math.abs((slideWidth - deltaX) / slideWidth) : deltaX / slideWidth;
                this.playAnimations();
            }
        }
        if (this.stoppedByInteraction) {
            this.play();
        }
    }
    /** @hidden */
    ngAfterContentInit() {
        this.slides.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((change) => this.initSlides(change));
        this.initSlides(this.slides);
    }
    /** @hidden */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroyed = true;
        if (this.lastInterval) {
            clearInterval(this.lastInterval);
        }
    }
    /**
     * Returns the slide corresponding to the provided `index` or null.
     * ```typescript
     * let slide1 =  this.carousel.get(1);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    get(index) {
        return this.slides.find((slide) => slide.index === index);
    }
    /**
     * Adds a new slide to the carousel.
     * ```typescript
     * this.carousel.add(newSlide);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    add(slide) {
        const newSlides = this.slides.toArray();
        newSlides.push(slide);
        this.slides.reset(newSlides);
        this.slides.notifyOnChanges();
    }
    /**
     * Removes a slide from the carousel.
     * ```typescript
     * this.carousel.remove(slide);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    remove(slide) {
        if (slide && slide === this.get(slide.index)) { // check if the requested slide for delete is present in the carousel
            const newSlides = this.slides.toArray();
            newSlides.splice(slide.index, 1);
            this.slides.reset(newSlides);
            this.slides.notifyOnChanges();
        }
    }
    /**
     * Kicks in a transition for a given slide with a given `direction`.
     * ```typescript
     * this.carousel.select(this.carousel.get(2), Direction.NEXT);
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    select(slide, direction = Direction.NONE) {
        if (slide && slide !== this.currentItem) {
            slide.direction = direction;
            slide.active = true;
        }
    }
    /**
     * Transitions to the next slide in the carousel.
     * ```typescript
     * this.carousel.next();
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    next() {
        const index = this.getNextIndex();
        if (index === 0 && !this.loop) {
            this.stop();
            return;
        }
        return this.select(this.get(index), Direction.NEXT);
    }
    /**
     * Transitions to the previous slide in the carousel.
     * ```typescript
     * this.carousel.prev();
     * ```
     *
     * @memberOf IgxCarouselComponent
     */
    prev() {
        const index = this.getPrevIndex();
        if (!this.loop && index === this.total - 1) {
            this.stop();
            return;
        }
        return this.select(this.get(index), Direction.PREV);
    }
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
    play() {
        if (!this.playing) {
            this.playing = true;
            this.onCarouselPlaying.emit(this);
            this.restartInterval();
            this.stoppedByInteraction = false;
        }
    }
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
    stop() {
        if (this.pause) {
            this.playing = false;
            this.onCarouselPaused.emit(this);
            this.resetInterval();
        }
    }
    getPreviousElement() {
        return this.previousItem.nativeElement;
    }
    getCurrentElement() {
        return this.currentItem.nativeElement;
    }
    resetInterval() {
        if (this.lastInterval) {
            clearInterval(this.lastInterval);
            this.lastInterval = null;
        }
    }
    restartInterval() {
        this.resetInterval();
        if (!isNaN(this.interval) && this.interval > 0 && this.platformUtil.isBrowser) {
            this.lastInterval = setInterval(() => {
                const tick = +this.interval;
                if (this.playing && this.total && !isNaN(tick) && tick > 0) {
                    this.next();
                }
                else {
                    this.stop();
                }
            }, this.interval);
        }
    }
    /** @hidden */
    get nextButtonDisabled() {
        return !this.loop && this.current === (this.total - 1);
    }
    /** @hidden */
    get prevButtonDisabled() {
        return !this.loop && this.current === 0;
    }
    getNextIndex() {
        return (this.current + 1) % this.total;
    }
    getPrevIndex() {
        return this.current - 1 < 0 ? this.total - 1 : this.current - 1;
    }
    resetSlideStyles(slide) {
        slide.nativeElement.style.transform = '';
        slide.nativeElement.style.opacity = '';
    }
    pan(event) {
        const slideWidth = this.currentItem.nativeElement.offsetWidth;
        const panOffset = (slideWidth / 1000);
        const deltaX = event.deltaX;
        const index = deltaX < 0 ? this.getNextIndex() : this.getPrevIndex();
        const offset = deltaX < 0 ? slideWidth + deltaX : -slideWidth + deltaX;
        if (!this.gesturesSupport || event.isFinal || Math.abs(deltaX) + panOffset >= slideWidth) {
            return;
        }
        if (!this.loop && ((this.current === 0 && deltaX > 0) || (this.current === this.total - 1 && deltaX < 0))) {
            this.incomingSlide = null;
            return;
        }
        event.preventDefault();
        if (this.isPlaying) {
            this.stoppedByInteraction = true;
            this.stop();
        }
        if (this.previousItem && this.previousItem.previous) {
            this.previousItem.previous = false;
        }
        this.finishAnimations();
        if (this.incomingSlide) {
            if (index !== this.incomingSlide.index) {
                this.resetSlideStyles(this.incomingSlide);
                this.incomingSlide.previous = false;
                this.incomingSlide = this.get(index);
            }
        }
        else {
            this.incomingSlide = this.get(index);
        }
        this.incomingSlide.previous = true;
        if (this.animationType === HorizontalAnimationType.fade) {
            this.currentItem.nativeElement.style.opacity = `${Math.abs(offset) / slideWidth}`;
        }
        else {
            this.currentItem.nativeElement.style.transform = `translateX(${deltaX}px)`;
            this.incomingSlide.nativeElement.style.transform = `translateX(${offset}px)`;
        }
    }
    unsubscriber(slide) {
        return merge(this.destroy$, slide.isDestroyed);
    }
    onSlideActivated(slide) {
        if (slide.active && slide !== this.currentItem) {
            if (slide.direction === Direction.NONE) {
                const newIndex = slide.index;
                slide.direction = newIndex > this.current ? Direction.NEXT : Direction.PREV;
            }
            if (this.currentItem) {
                if (this.previousItem && this.previousItem.previous) {
                    this.previousItem.previous = false;
                }
                this.currentItem.direction = slide.direction;
                this.currentItem.active = false;
                this.previousItem = this.currentItem;
                this.currentItem = slide;
                this.triggerAnimations();
            }
            else {
                this.currentItem = slide;
            }
            this.onSlideChanged.emit({ carousel: this, slide });
            this.restartInterval();
        }
    }
    finishAnimations() {
        if (this.animationStarted(this.leaveAnimationPlayer)) {
            this.leaveAnimationPlayer.finish();
        }
        if (this.animationStarted(this.enterAnimationPlayer)) {
            this.enterAnimationPlayer.finish();
        }
    }
    initSlides(change) {
        const diff = this.differ.diff(change.toArray());
        if (diff) {
            this.slides.reduce((any, c, ind) => c.index = ind, 0); // reset slides indexes
            diff.forEachAddedItem((record) => {
                const slide = record.item;
                slide.total = this.total;
                this.onSlideAdded.emit({ carousel: this, slide });
                if (slide.active) {
                    this.currentItem = slide;
                }
                slide.activeChange.pipe(takeUntil(this.unsubscriber(slide))).subscribe(() => this.onSlideActivated(slide));
            });
            diff.forEachRemovedItem((record) => {
                const slide = record.item;
                this.onSlideRemoved.emit({ carousel: this, slide });
                if (slide.active) {
                    slide.active = false;
                    this.currentItem = this.get(slide.index < this.total ? slide.index : this.total - 1);
                }
            });
            this.updateSlidesSelection();
        }
    }
    updateSlidesSelection() {
        if (this.platformUtil.isBrowser) {
            requestAnimationFrame(() => {
                if (this.currentItem) {
                    this.currentItem.active = true;
                    const activeSlides = this.slides.filter(slide => slide.active && slide.index !== this.currentItem.index);
                    activeSlides.forEach(slide => slide.active = false);
                }
                else if (this.total) {
                    this.slides.first.active = true;
                }
                this.play();
            });
        }
    }
    focusSlideElement() {
        if (this.leaveAnimationPlayer) {
            this.leaveAnimationPlayer.onDone(() => {
                this.slides.find(s => s.active).nativeElement.focus();
            });
        }
        else {
            requestAnimationFrame(() => this.slides.find(s => s.active).nativeElement.focus());
        }
    }
}
IgxCarouselComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCarouselComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i0.IterableDiffers }, { token: i1.AnimationBuilder }, { token: i2.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxCarouselComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCarouselComponent, selector: "igx-carousel", inputs: { id: "id", loop: "loop", pause: "pause", navigation: "navigation", keyboardSupport: "keyboardSupport", gesturesSupport: "gesturesSupport", maximumIndicatorsCount: "maximumIndicatorsCount", indicatorsOrientation: "indicatorsOrientation", animationType: "animationType", resourceStrings: "resourceStrings", interval: "interval" }, outputs: { onSlideChanged: "onSlideChanged", onSlideAdded: "onSlideAdded", onSlideRemoved: "onSlideRemoved", onCarouselPaused: "onCarouselPaused", onCarouselPlaying: "onCarouselPlaying" }, host: { listeners: { "keydown.arrowright": "onKeydownArrowRight($event)", "keydown.arrowleft": "onKeydownArrowLeft($event)", "tap": "onTap($event)", "keydown.home": "onKeydownHome($event)", "keydown.end": "onKeydownEnd($event)", "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()", "panleft": "onPanLeft($event)", "panright": "onPanRight($event)", "panend": "onPanEnd($event)" }, properties: { "attr.id": "this.id", "attr.role": "this.role", "attr.aria-roledescription": "this.roleDescription", "attr.aria-labelledby": "this.labelId", "class.igx-carousel": "this.cssClass", "style.touch-action": "this.touchAction" } }, providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: CarouselHammerConfig
        }
    ], queries: [{ propertyName: "indicatorTemplate", first: true, predicate: IgxCarouselIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "nextButtonTemplate", first: true, predicate: IgxCarouselNextButtonDirective, descendants: true, read: TemplateRef }, { propertyName: "prevButtonTemplate", first: true, predicate: IgxCarouselPrevButtonDirective, descendants: true, read: TemplateRef }, { propertyName: "slides", predicate: IgxSlideComponent }], viewQueries: [{ propertyName: "defaultIndicator", first: true, predicate: ["defaultIndicator"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultNextButton", first: true, predicate: ["defaultNextButton"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultPrevButton", first: true, predicate: ["defaultPrevButton"], descendants: true, read: TemplateRef, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-template #defaultIndicator let-slide>\n    <div class=\"igx-nav-dot\"\n        [class.igx-nav-dot--active]=\"slide.active\">\n    </div>\n</ng-template>\n\n<ng-template #defaultNextButton let-disabled>\n    <span class=\"igx-nav-arrow\"\n          [class.igx-nav-arrow--disabled]=\"disabled\">\n        <igx-icon>arrow_forward</igx-icon>\n    </span>\n</ng-template>\n\n<ng-template #defaultPrevButton let-disabled>\n    <span class=\"igx-nav-arrow\"\n          [class.igx-nav-arrow--disabled]=\"disabled\">\n        <igx-icon>arrow_back</igx-icon>\n    </span>\n</ng-template>\n\n<div *ngIf=\"showIndicators\" [ngClass]=\"indicatorsOrientationClass\" [attr.role]=\"'tablist'\">\n    <div *ngFor=\"let slide of slides\"\n        class=\"igx-carousel-indicators__indicator\"\n        (click)=\"select(slide)\"\n        [id]=\"'tab-'+ slide.index + '-' + total\"\n        [attr.role]=\"'tab'\"\n        [attr.aria-label]=\"resourceStrings.igx_carousel_slide + ' ' + (slide.index + 1) + ' ' + resourceStrings.igx_carousel_of + ' ' + this.total\"\n        [attr.aria-controls]=\"'panel-' + slide.index\"\n        [attr.aria-selected]=\"slide.active\">\n        <ng-container *ngTemplateOutlet=\"getIndicatorTemplate; context: {$implicit: slide};\"></ng-container>\n    </div>\n</div>\n\n<div *ngIf=\"showIndicatorsLabel\" [ngClass]=\"indicatorsOrientationClass\">\n    <span [id]=\"labelId\" class=\"igx-carousel__label\">{{getCarouselLabel}}</span>\n</div>\n\n<div class=\"igx-carousel__inner\" [attr.aria-live]=\"!interval || stoppedByInteraction ? 'polite' : 'off'\">\n    <ng-content></ng-content>\n</div>\n\n<div *ngIf=\"navigation && slides.length\" role=\"button\" tabindex=\"0\" class=\"igx-carousel__arrow--prev\" [attr.aria-label]=\"resourceStrings.igx_carousel_previous_slide\" (keydown.enter)=\"prev()\" (click)=\"prev()\">\n    <ng-container *ngTemplateOutlet=\"getPrevButtonTemplate; context: {$implicit: prevButtonDisabled};\"></ng-container>\n</div>\n\n<div *ngIf=\"navigation && slides.length\" role=\"button\" tabindex=\"0\" class=\"igx-carousel__arrow--next\" [attr.aria-label]=\"resourceStrings.igx_carousel_next_slide\" (keydown.enter)=\"next()\" (click)=\"next()\">\n    <ng-container *ngTemplateOutlet=\"getNextButtonTemplate; context: {$implicit: nextButtonDisabled};\"></ng-container>\n</div>\n\n\n\n", styles: [":host{display:block;outline-style:none}\n"], components: [{ type: i3.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCarouselComponent, decorators: [{
            type: Component,
            args: [{ providers: [
                        {
                            provide: HAMMER_GESTURE_CONFIG,
                            useClass: CarouselHammerConfig
                        }
                    ], selector: 'igx-carousel', styles: [`
    :host {
        display: block;
        outline-style: none;
    }`], template: "<ng-template #defaultIndicator let-slide>\n    <div class=\"igx-nav-dot\"\n        [class.igx-nav-dot--active]=\"slide.active\">\n    </div>\n</ng-template>\n\n<ng-template #defaultNextButton let-disabled>\n    <span class=\"igx-nav-arrow\"\n          [class.igx-nav-arrow--disabled]=\"disabled\">\n        <igx-icon>arrow_forward</igx-icon>\n    </span>\n</ng-template>\n\n<ng-template #defaultPrevButton let-disabled>\n    <span class=\"igx-nav-arrow\"\n          [class.igx-nav-arrow--disabled]=\"disabled\">\n        <igx-icon>arrow_back</igx-icon>\n    </span>\n</ng-template>\n\n<div *ngIf=\"showIndicators\" [ngClass]=\"indicatorsOrientationClass\" [attr.role]=\"'tablist'\">\n    <div *ngFor=\"let slide of slides\"\n        class=\"igx-carousel-indicators__indicator\"\n        (click)=\"select(slide)\"\n        [id]=\"'tab-'+ slide.index + '-' + total\"\n        [attr.role]=\"'tab'\"\n        [attr.aria-label]=\"resourceStrings.igx_carousel_slide + ' ' + (slide.index + 1) + ' ' + resourceStrings.igx_carousel_of + ' ' + this.total\"\n        [attr.aria-controls]=\"'panel-' + slide.index\"\n        [attr.aria-selected]=\"slide.active\">\n        <ng-container *ngTemplateOutlet=\"getIndicatorTemplate; context: {$implicit: slide};\"></ng-container>\n    </div>\n</div>\n\n<div *ngIf=\"showIndicatorsLabel\" [ngClass]=\"indicatorsOrientationClass\">\n    <span [id]=\"labelId\" class=\"igx-carousel__label\">{{getCarouselLabel}}</span>\n</div>\n\n<div class=\"igx-carousel__inner\" [attr.aria-live]=\"!interval || stoppedByInteraction ? 'polite' : 'off'\">\n    <ng-content></ng-content>\n</div>\n\n<div *ngIf=\"navigation && slides.length\" role=\"button\" tabindex=\"0\" class=\"igx-carousel__arrow--prev\" [attr.aria-label]=\"resourceStrings.igx_carousel_previous_slide\" (keydown.enter)=\"prev()\" (click)=\"prev()\">\n    <ng-container *ngTemplateOutlet=\"getPrevButtonTemplate; context: {$implicit: prevButtonDisabled};\"></ng-container>\n</div>\n\n<div *ngIf=\"navigation && slides.length\" role=\"button\" tabindex=\"0\" class=\"igx-carousel__arrow--next\" [attr.aria-label]=\"resourceStrings.igx_carousel_next_slide\" (keydown.enter)=\"next()\" (click)=\"next()\">\n    <ng-container *ngTemplateOutlet=\"getNextButtonTemplate; context: {$implicit: nextButtonDisabled};\"></ng-container>\n</div>\n\n\n\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i0.IterableDiffers }, { type: i1.AnimationBuilder }, { type: i2.PlatformUtil }]; }, propDecorators: { id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], roleDescription: [{
                type: HostBinding,
                args: ['attr.aria-roledescription']
            }], labelId: [{
                type: HostBinding,
                args: ['attr.aria-labelledby']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-carousel']
            }], touchAction: [{
                type: HostBinding,
                args: ['style.touch-action']
            }], loop: [{
                type: Input
            }], pause: [{
                type: Input
            }], navigation: [{
                type: Input
            }], keyboardSupport: [{
                type: Input
            }], gesturesSupport: [{
                type: Input
            }], maximumIndicatorsCount: [{
                type: Input
            }], indicatorsOrientation: [{
                type: Input
            }], animationType: [{
                type: Input
            }], indicatorTemplate: [{
                type: ContentChild,
                args: [IgxCarouselIndicatorDirective, { read: TemplateRef, static: false }]
            }], nextButtonTemplate: [{
                type: ContentChild,
                args: [IgxCarouselNextButtonDirective, { read: TemplateRef, static: false }]
            }], prevButtonTemplate: [{
                type: ContentChild,
                args: [IgxCarouselPrevButtonDirective, { read: TemplateRef, static: false }]
            }], slides: [{
                type: ContentChildren,
                args: [IgxSlideComponent]
            }], onSlideChanged: [{
                type: Output
            }], onSlideAdded: [{
                type: Output
            }], onSlideRemoved: [{
                type: Output
            }], onCarouselPaused: [{
                type: Output
            }], onCarouselPlaying: [{
                type: Output
            }], defaultIndicator: [{
                type: ViewChild,
                args: ['defaultIndicator', { read: TemplateRef, static: true }]
            }], defaultNextButton: [{
                type: ViewChild,
                args: ['defaultNextButton', { read: TemplateRef, static: true }]
            }], defaultPrevButton: [{
                type: ViewChild,
                args: ['defaultPrevButton', { read: TemplateRef, static: true }]
            }], resourceStrings: [{
                type: Input
            }], interval: [{
                type: Input
            }], onKeydownArrowRight: [{
                type: HostListener,
                args: ['keydown.arrowright', ['$event']]
            }], onKeydownArrowLeft: [{
                type: HostListener,
                args: ['keydown.arrowleft', ['$event']]
            }], onTap: [{
                type: HostListener,
                args: ['tap', ['$event']]
            }], onKeydownHome: [{
                type: HostListener,
                args: ['keydown.home', ['$event']]
            }], onKeydownEnd: [{
                type: HostListener,
                args: ['keydown.end', ['$event']]
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }], onPanLeft: [{
                type: HostListener,
                args: ['panleft', ['$event']]
            }], onPanRight: [{
                type: HostListener,
                args: ['panright', ['$event']]
            }], onPanEnd: [{
                type: HostListener,
                args: ['panend', ['$event']]
            }] } });
/**
 * @hidden
 */
export class IgxCarouselModule {
}
IgxCarouselModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCarouselModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxCarouselModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCarouselModule, declarations: [IgxCarouselComponent, IgxSlideComponent,
        IgxCarouselIndicatorDirective,
        IgxCarouselNextButtonDirective,
        IgxCarouselPrevButtonDirective], imports: [CommonModule, IgxIconModule], exports: [IgxCarouselComponent, IgxSlideComponent,
        IgxCarouselIndicatorDirective,
        IgxCarouselNextButtonDirective,
        IgxCarouselPrevButtonDirective] });
IgxCarouselModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCarouselModule, imports: [[CommonModule, IgxIconModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCarouselModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxCarouselComponent,
                        IgxSlideComponent,
                        IgxCarouselIndicatorDirective,
                        IgxCarouselNextButtonDirective,
                        IgxCarouselPrevButtonDirective
                    ],
                    exports: [
                        IgxCarouselComponent,
                        IgxSlideComponent,
                        IgxCarouselIndicatorDirective,
                        IgxCarouselNextButtonDirective,
                        IgxCarouselPrevButtonDirective
                    ],
                    imports: [CommonModule, IgxIconModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2Nhcm91c2VsL2Nhcm91c2VsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jYXJvdXNlbC9jYXJvdXNlbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNILFNBQVMsRUFFVCxZQUFZLEVBQ1osV0FBVyxFQUNYLFlBQVksRUFDWixLQUFLLEVBQ0wsUUFBUSxFQUVSLE1BQU0sRUFDTixlQUFlLEVBTWYsV0FBVyxFQUNYLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUViLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQWtCLE1BQU0sRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSw4QkFBOEIsRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXRJLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXRELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsd0JBQXdCLEVBQUUs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aUJBQWlCLGlCQTM3QmpCLG9CQUFvQixFQTY2QnpCLGlCQUFpQjtRQUNqQiw2QkFBNkI7UUFDN0IsOEJBQThCO1FBQzlCLDhCQUE4QixhQVN4QixZQUFZLEVBQUUsYUFBYSxhQXo3QjVCLG9CQUFvQixFQW83QnpCLGlCQUFpQjtRQUNqQiw2QkFBNkI7UUFDN0IsOEJBQThCO1FBQzlCLDhCQUE4QjsrR0FJekIsaUJBQWlCLFlBRmpCLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQzsyRkFFN0IsaUJBQWlCO2tCQWpCN0IsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysb0JBQW9CO3dCQUNwQixpQkFBaUI7d0JBQ2pCLDZCQUE2Qjt3QkFDN0IsOEJBQThCO3dCQUM5Qiw4QkFBOEI7cUJBQ2pDO29CQUNELE9BQU8sRUFBRTt3QkFDTCxvQkFBb0I7d0JBQ3BCLGlCQUFpQjt3QkFDakIsNkJBQTZCO3dCQUM3Qiw4QkFBOEI7d0JBQzlCLDhCQUE4QjtxQkFDakM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztpQkFDekMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE9uRGVzdHJveSxcbiAgICBPdXRwdXQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBJdGVyYWJsZURpZmZlcixcbiAgICBJdGVyYWJsZURpZmZlcnMsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBJdGVyYWJsZUNoYW5nZVJlY29yZCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEluamVjdGFibGUsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzLCBta2VudW0sIFBsYXRmb3JtVXRpbCB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgU3ViamVjdCwgbWVyZ2UgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IElneENhcm91c2VsSW5kaWNhdG9yRGlyZWN0aXZlLCBJZ3hDYXJvdXNlbE5leHRCdXR0b25EaXJlY3RpdmUsIElneENhcm91c2VsUHJldkJ1dHRvbkRpcmVjdGl2ZSB9IGZyb20gJy4vY2Fyb3VzZWwuZGlyZWN0aXZlcyc7XG5pbXBvcnQgeyBBbmltYXRpb25CdWlsZGVyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBJZ3hTbGlkZUNvbXBvbmVudCB9IGZyb20gJy4vc2xpZGUuY29tcG9uZW50JztcbmltcG9ydCB7IElDYXJvdXNlbFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9jYXJvdXNlbC1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgSGFtbWVyR2VzdHVyZUNvbmZpZywgSEFNTUVSX0dFU1RVUkVfQ09ORklHIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBIb3Jpem9udGFsQW5pbWF0aW9uVHlwZSwgRGlyZWN0aW9uLCBJZ3hDYXJvdXNlbENvbXBvbmVudEJhc2UgfSBmcm9tICcuL2Nhcm91c2VsLWJhc2UnO1xuXG5sZXQgTkVYVF9JRCA9IDA7XG5cbmV4cG9ydCBjb25zdCBDYXJvdXNlbEluZGljYXRvcnNPcmllbnRhdGlvbiA9IG1rZW51bSh7XG4gICAgYm90dG9tOiAnYm90dG9tJyxcbiAgICB0b3A6ICd0b3AnXG59KTtcbmV4cG9ydCB0eXBlIENhcm91c2VsSW5kaWNhdG9yc09yaWVudGF0aW9uID0gKHR5cGVvZiBDYXJvdXNlbEluZGljYXRvcnNPcmllbnRhdGlvbilba2V5b2YgdHlwZW9mIENhcm91c2VsSW5kaWNhdG9yc09yaWVudGF0aW9uXTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhcm91c2VsSGFtbWVyQ29uZmlnIGV4dGVuZHMgSGFtbWVyR2VzdHVyZUNvbmZpZyB7XG4gICAgcHVibGljIG92ZXJyaWRlcyA9IHtcbiAgICAgICAgcGFuOiB7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9IT1JJWk9OVEFMIH1cbiAgICB9O1xufVxuLyoqXG4gKiAqKklnbml0ZSBVSSBmb3IgQW5ndWxhciBDYXJvdXNlbCoqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9jYXJvdXNlbC5odG1sKVxuICpcbiAqIFRoZSBJZ25pdGUgVUkgQ2Fyb3VzZWwgaXMgdXNlZCB0byBicm93c2Ugb3IgbmF2aWdhdGUgdGhyb3VnaCBhIGNvbGxlY3Rpb24gb2Ygc2xpZGVzLiBTbGlkZXMgY2FuIGNvbnRhaW4gY3VzdG9tXG4gKiBjb250ZW50IHN1Y2ggYXMgaW1hZ2VzIG9yIGNhcmRzIGFuZCBiZSB1c2VkIGZvciB0aGluZ3Mgc3VjaCBhcyBvbi1ib2FyZGluZyB0dXRvcmlhbHMgb3IgcGFnZS1iYXNlZCBpbnRlcmZhY2VzLlxuICogSXQgY2FuIGJlIHVzZWQgYXMgYSBzZXBhcmF0ZSBmdWxsc2NyZWVuIGVsZW1lbnQgb3IgaW5zaWRlIGFub3RoZXIgY29tcG9uZW50LlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBodG1sXG4gKiA8aWd4LWNhcm91c2VsPlxuICogICA8aWd4LXNsaWRlPlxuICogICAgIDxoMz5GaXJzdCBTbGlkZSBIZWFkZXI8L2gzPlxuICogICAgIDxwPkZpcnN0IHNsaWRlIENvbnRlbnQ8L3A+XG4gKiAgIDxpZ3gtc2xpZGU+XG4gKiAgIDxpZ3gtc2xpZGU+XG4gKiAgICAgPGgzPlNlY29uZCBTbGlkZSBIZWFkZXI8L2gzPlxuICogICAgIDxwPlNlY29uZCBTbGlkZSBDb250ZW50PC9wPlxuICogPC9pZ3gtY2Fyb3VzZWw+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IEhBTU1FUl9HRVNUVVJFX0NPTkZJRyxcbiAgICAgICAgICAgIHVzZUNsYXNzOiBDYXJvdXNlbEhhbW1lckNvbmZpZ1xuICAgICAgICB9XG4gICAgXSxcbiAgICBzZWxlY3RvcjogJ2lneC1jYXJvdXNlbCcsXG4gICAgdGVtcGxhdGVVcmw6ICdjYXJvdXNlbC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVzOiBbYFxuICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIG91dGxpbmUtc3R5bGU6IG5vbmU7XG4gICAgfWBdXG59KVxuXG5leHBvcnQgY2xhc3MgSWd4Q2Fyb3VzZWxDb21wb25lbnQgZXh0ZW5kcyBJZ3hDYXJvdXNlbENvbXBvbmVudEJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQge1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgYGlkYCBvZiB0aGUgY2Fyb3VzZWwuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgb2YgdGhlIGZpcnN0IGNhcm91c2VsIGNvbXBvbmVudCB3aWxsIGJlIGBcImlneC1jYXJvdXNlbC0wXCJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIGlkPVwibXktZmlyc3QtY2Fyb3VzZWxcIj48L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5pZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWQgPSBgaWd4LWNhcm91c2VsLSR7TkVYVF9JRCsrfWA7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYHJvbGVgIGF0dHJpYnV0ZSBvZiB0aGUgY2Fyb3VzZWwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjYXJvdXNlbFJvbGUgPSAgdGhpcy5jYXJvdXNlbC5yb2xlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKSBwdWJsaWMgcm9sZSA9ICdyZWdpb24nO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1yb2xlZGVzY3JpcHRpb24nKVxuICAgIHB1YmxpYyByb2xlRGVzY3JpcHRpb24gPSAnY2Fyb3VzZWwnO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sYWJlbGxlZGJ5JylcbiAgICBwdWJsaWMgZ2V0IGxhYmVsSWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNob3dJbmRpY2F0b3JzTGFiZWwgPyBgJHt0aGlzLmlkfS1sYWJlbGAgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNsYXNzIG9mIHRoZSBjYXJvdXNlbCBjb21wb25lbnQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjbGFzcyA9ICB0aGlzLmNhcm91c2VsLmNzc0NsYXNzO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2Fyb3VzZWwnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtY2Fyb3VzZWwnO1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYHRvdWNoLWFjdGlvbmAgc3R5bGUgb2YgdGhlIGBsaXN0IGl0ZW1gLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdG91Y2hBY3Rpb24gPSB0aGlzLmxpc3RJdGVtLnRvdWNoQWN0aW9uO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUudG91Y2gtYWN0aW9uJylcbiAgICBwdWJsaWMgZ2V0IHRvdWNoQWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXN0dXJlc1N1cHBvcnQgPyAncGFuLXknIDogJ2F1dG8nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgd2hldGhlciB0aGUgY2Fyb3VzZWwgc2hvdWxkIGBsb29wYCBiYWNrIHRvIHRoZSBmaXJzdCBzbGlkZSBhZnRlciByZWFjaGluZyB0aGUgbGFzdCBzbGlkZS5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGB0cnVlYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYXJvdXNlbCBbbG9vcF09XCJmYWxzZVwiPjwvaWd4LWNhcm91c2VsPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGxvb3AgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB3aGV0aGVyIHRoZSBjYXJvdXNlbCB3aWxsIGBwYXVzZWAgdGhlIHNsaWRlIHRyYW5zaXRpb25zIG9uIHVzZXIgaW50ZXJhY3Rpb25zLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1jYXJvdXNlbCBbcGF1c2VdPVwiZmFsc2VcIj48L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwYXVzZSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBDb250cm9scyB3aGV0aGVyIHRoZSBjYXJvdXNlbCBzaG91bGQgcmVuZGVyIHRoZSBsZWZ0L3JpZ2h0IGBuYXZpZ2F0aW9uYCBidXR0b25zLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIFtuYXZpZ2F0aW9uXSA9IFwiZmFsc2VcIj48L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBuYXZpZ2F0aW9uID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIENvbnRyb2xzIHdoZXRoZXIgdGhlIGNhcm91c2VsIHNob3VsZCBzdXBwb3J0IGtleWJvYXJkIG5hdmlnYXRpb24uXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2Fyb3VzZWwgW2tleWJvYXJkU3VwcG9ydF0gPSBcImZhbHNlXCI+PC9pZ3gtY2Fyb3VzZWw+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4Q2Fyb3VzZWxDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMga2V5Ym9hcmRTdXBwb3J0ID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIENvbnRyb2xzIHdoZXRoZXIgdGhlIGNhcm91c2VsIHNob3VsZCBzdXBwb3J0IGdlc3R1cmVzLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYHRydWVgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIFtnZXN0dXJlc1N1cHBvcnRdID0gXCJmYWxzZVwiPjwvaWd4LWNhcm91c2VsPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGdlc3R1cmVzU3VwcG9ydCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBDb250cm9scyB0aGUgbWF4aW11bSBpbmRleGVzIHRoYXQgY2FuIGJlIHNob3duLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYDVgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIFttYXhpbXVtSW5kaWNhdG9yc0NvdW50XSA9IFwiMTBcIj48L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBtYXhpbXVtSW5kaWNhdG9yc0NvdW50ID0gNTtcblxuICAgIC8qKlxuICAgICAqIEdldHMvc2V0cyB0aGUgZGlzcGxheSBtb2RlIG9mIGNhcm91c2VsIGluZGljYXRvcnMuIEl0IGNhbiBiZSB0b3Agb3IgYm90dG9tLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGJvdHRvbWAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2Fyb3VzZWwgaW5kaWNhdG9yc09yaWVudGF0aW9uPSd0b3AnPlxuICAgICAqIDxpZ3gtY2Fyb3VzZWw+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4U2xpZGVDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgaW5kaWNhdG9yc09yaWVudGF0aW9uOiBDYXJvdXNlbEluZGljYXRvcnNPcmllbnRhdGlvbiA9IENhcm91c2VsSW5kaWNhdG9yc09yaWVudGF0aW9uLmJvdHRvbTtcblxuICAgIC8qKlxuICAgICAqIEdldHMvc2V0cyB0aGUgYW5pbWF0aW9uIHR5cGUgb2YgY2Fyb3VzZWwuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgc2xpZGVgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIGFuaW1hdGlvblR5cGU9J25vbmUnPlxuICAgICAqIDxpZ3gtY2Fyb3VzZWw+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4U2xpZGVDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYW5pbWF0aW9uVHlwZTogSG9yaXpvbnRhbEFuaW1hdGlvblR5cGUgPSBIb3Jpem9udGFsQW5pbWF0aW9uVHlwZS5zbGlkZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXN0b20gdGVtcGxhdGUsIGlmIGFueSwgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIHJlbmRlcmluZyBjYXJvdXNlbCBpbmRpY2F0b3JzXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gU2V0IGluIHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbXlDb21wb25lbnQuY3VzdG9tVGVtcGxhdGU7XG4gICAgICogbXlDb21wb25lbnQuY2Fyb3VzZWwuaW5kaWNhdG9yVGVtcGxhdGUgPSBteUN1c3RvbVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCBpbiBtYXJrdXAgLS0+XG4gICAgICogIDxpZ3gtY2Fyb3VzZWwgI2Nhcm91c2VsPlxuICAgICAqICAgICAgLi4uXG4gICAgICogICAgICA8bmctdGVtcGxhdGUgaWd4Q2Fyb3VzZWxJbmRpY2F0b3IgbGV0LXNsaWRlPlxuICAgICAqICAgICAgICAgPGlneC1pY29uICpuZ0lmPVwic2xpZGUuYWN0aXZlXCI+YnJpZ2h0bmVzc183PC9pZ3gtaWNvbj5cbiAgICAgKiAgICAgICAgIDxpZ3gtaWNvbiAqbmdJZj1cIiFzbGlkZS5hY3RpdmVcIj5icmlnaHRuZXNzXzU8L2lneC1pY29uPlxuICAgICAqICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiAgPC9pZ3gtY2Fyb3VzZWw+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hDYXJvdXNlbEluZGljYXRvckRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICAgIHB1YmxpYyBpbmRpY2F0b3JUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tIHRlbXBsYXRlLCBpZiBhbnksIHRoYXQgc2hvdWxkIGJlIHVzZWQgd2hlbiByZW5kZXJpbmcgY2Fyb3VzZWwgbmV4dCBidXR0b25cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBTZXQgaW4gdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBteUNvbXBvbmVudC5jdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBteUNvbXBvbmVudC5jYXJvdXNlbC5uZXh0QnV0dG9uVGVtcGxhdGUgPSBteUN1c3RvbVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCBpbiBtYXJrdXAgLS0+XG4gICAgICogIDxpZ3gtY2Fyb3VzZWwgI2Nhcm91c2VsPlxuICAgICAqICAgICAgLi4uXG4gICAgICogICAgICA8bmctdGVtcGxhdGUgaWd4Q2Fyb3VzZWxOZXh0QnV0dG9uIGxldC1kaXNhYmxlZD5cbiAgICAgKiAgICAgICAgICAgIDxidXR0b24gaWd4QnV0dG9uPVwiZmFiXCIgaWd4UmlwcGxlPVwid2hpdGVcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgKiAgICAgICAgICAgICAgICA8aWd4LWljb24+YWRkPC9pZ3gtaWNvbj5cbiAgICAgKiAgICAgICAgICAgPC9idXR0b24+XG4gICAgICogICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAqICA8L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneENhcm91c2VsTmV4dEJ1dHRvbkRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICAgIHB1YmxpYyBuZXh0QnV0dG9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIGNhcm91c2VsIHByZXZpb3VzIGJ1dHRvblxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIFNldCBpbiB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG15Q29tcG9uZW50LmN1c3RvbVRlbXBsYXRlO1xuICAgICAqIG15Q29tcG9uZW50LmNhcm91c2VsLm5leHRCdXR0b25UZW1wbGF0ZSA9IG15Q3VzdG9tVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS0gU2V0IGluIG1hcmt1cCAtLT5cbiAgICAgKiAgPGlneC1jYXJvdXNlbCAjY2Fyb3VzZWw+XG4gICAgICogICAgICAuLi5cbiAgICAgKiAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hDYXJvdXNlbFByZXZCdXR0b24gbGV0LWRpc2FibGVkPlxuICAgICAqICAgICAgICAgICAgPGJ1dHRvbiBpZ3hCdXR0b249XCJmYWJcIiBpZ3hSaXBwbGU9XCJ3aGl0ZVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAqICAgICAgICAgICAgICAgIDxpZ3gtaWNvbj5yZW1vdmU8L2lneC1pY29uPlxuICAgICAqICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgKiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogIDwvaWd4LWNhcm91c2VsPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4Q2Fyb3VzZWxQcmV2QnV0dG9uRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gICAgcHVibGljIHByZXZCdXR0b25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29sbGVjdGlvbiBvZiBgc2xpZGVzYCBjdXJyZW50bHkgaW4gdGhlIGNhcm91c2VsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgc2xpZGVzOiBRdWVyeUxpc3Q8SWd4U2xpZGVDb21wb25lbnQ+ID0gdGhpcy5jYXJvdXNlbC5zbGlkZXM7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4Q2Fyb3VzZWxDb21wb25lbnRcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFNsaWRlQ29tcG9uZW50KVxuICAgIHB1YmxpYyBzbGlkZXM6IFF1ZXJ5TGlzdDxJZ3hTbGlkZUNvbXBvbmVudD47XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgYWZ0ZXIgYSBzbGlkZSB0cmFuc2l0aW9uIGhhcyBoYXBwZW5lZC5cbiAgICAgKiBQcm92aWRlcyByZWZlcmVuY2VzIHRvIHRoZSBgSWd4Q2Fyb3VzZWxDb21wb25lbnRgIGFuZCBgSWd4U2xpZGVDb21wb25lbnRgIGFzIGV2ZW50IGFyZ3VtZW50cy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYXJvdXNlbCAob25TbGlkZUNoYW5nZWQpPVwib25TbGlkZUNoYW5nZWQoJGV2ZW50KVwiPjwvaWd4LWNhcm91c2VsPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblNsaWRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVNsaWRlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdGhhdCBpcyBlbWl0dGVkIGFmdGVyIGEgc2xpZGUgaGFzIGJlZW4gYWRkZWQgdG8gdGhlIGNhcm91c2VsLlxuICAgICAqIFByb3ZpZGVzIHJlZmVyZW5jZXMgdG8gdGhlIGBJZ3hDYXJvdXNlbENvbXBvbmVudGAgYW5kIGBJZ3hTbGlkZUNvbXBvbmVudGAgYXMgZXZlbnQgYXJndW1lbnRzLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIChvblNsaWRlQWRkZWQpPVwib25TbGlkZUFkZGVkKCRldmVudClcIj48L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25TbGlkZUFkZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJU2xpZGVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgYWZ0ZXIgYSBzbGlkZSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIGNhcm91c2VsLlxuICAgICAqIFByb3ZpZGVzIHJlZmVyZW5jZXMgdG8gdGhlIGBJZ3hDYXJvdXNlbENvbXBvbmVudGAgYW5kIGBJZ3hTbGlkZUNvbXBvbmVudGAgYXMgZXZlbnQgYXJndW1lbnRzLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcm91c2VsIChvblNsaWRlUmVtb3ZlZCk9XCJvblNsaWRlUmVtb3ZlZCgkZXZlbnQpXCI+PC9pZ3gtY2Fyb3VzZWw+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4Q2Fyb3VzZWxDb21wb25lbnRcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uU2xpZGVSZW1vdmVkID0gbmV3IEV2ZW50RW1pdHRlcjxJU2xpZGVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgYWZ0ZXIgdGhlIGNhcm91c2VsIGhhcyBiZWVuIHBhdXNlZC5cbiAgICAgKiBQcm92aWRlcyBhIHJlZmVyZW5jZSB0byB0aGUgYElneENhcm91c2VsQ29tcG9uZW50YCBhcyBhbiBldmVudCBhcmd1bWVudC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYXJvdXNlbCAob25DYXJvdXNlbFBhdXNlZCk9XCJvbkNhcm91c2VsUGF1c2VkKCRldmVudClcIj48L2lneC1jYXJvdXNlbD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25DYXJvdXNlbFBhdXNlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SWd4Q2Fyb3VzZWxDb21wb25lbnQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0aGF0IGlzIGVtaXR0ZWQgYWZ0ZXIgdGhlIGNhcm91c2VsIGhhcyByZXN1bWVkIHRyYW5zaXRpb25pbmcgYmV0d2VlbiBgc2xpZGVzYC5cbiAgICAgKiBQcm92aWRlcyBhIHJlZmVyZW5jZSB0byB0aGUgYElneENhcm91c2VsQ29tcG9uZW50YCBhcyBhbiBldmVudCBhcmd1bWVudC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYXJvdXNlbCAob25DYXJvdXNlbFBsYXlpbmcpPVwib25DYXJvdXNlbFBsYXlpbmcoJGV2ZW50KVwiPjwvaWd4LWNhcm91c2VsPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkNhcm91c2VsUGxheWluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SWd4Q2Fyb3VzZWxDb21wb25lbnQ+KCk7XG5cbiAgICBAVmlld0NoaWxkKCdkZWZhdWx0SW5kaWNhdG9yJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJpdmF0ZSBkZWZhdWx0SW5kaWNhdG9yOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdE5leHRCdXR0b24nLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcml2YXRlIGRlZmF1bHROZXh0QnV0dG9uOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdFByZXZCdXR0b24nLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcml2YXRlIGRlZmF1bHRQcmV2QnV0dG9uOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdG9wcGVkQnlJbnRlcmFjdGlvbjogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgY3VycmVudEl0ZW06IElneFNsaWRlQ29tcG9uZW50O1xuICAgIHByb3RlY3RlZCBwcmV2aW91c0l0ZW06IElneFNsaWRlQ29tcG9uZW50O1xuICAgIHByaXZhdGUgX2ludGVydmFsOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfcmVzb3VyY2VTdHJpbmdzID0gQ3VycmVudFJlc291cmNlU3RyaW5ncy5DYXJvdXNlbFJlc1N0cmluZ3M7XG4gICAgcHJpdmF0ZSBsYXN0SW50ZXJ2YWw6IGFueTtcbiAgICBwcml2YXRlIHBsYXlpbmc6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBkZXN0cm95ZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBwcml2YXRlIGRpZmZlcjogSXRlcmFibGVEaWZmZXI8SWd4U2xpZGVDb21wb25lbnQ+IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBpbmNvbWluZ1NsaWRlOiBJZ3hTbGlkZUNvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEFuIGFjY2Vzc29yIHRoYXQgc2V0cyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKiBCeSBkZWZhdWx0IGl0IHVzZXMgRU4gcmVzb3VyY2VzLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCByZXNvdXJjZVN0cmluZ3ModmFsdWU6IElDYXJvdXNlbFJlc291cmNlU3RyaW5ncykge1xuICAgICAgICB0aGlzLl9yZXNvdXJjZVN0cmluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9yZXNvdXJjZVN0cmluZ3MsIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhY2Nlc3NvciB0aGF0IHJldHVybnMgdGhlIHJlc291cmNlIHN0cmluZ3MuXG4gICAgICovXG4gICAgcHVibGljIGdldCByZXNvdXJjZVN0cmluZ3MoKTogSUNhcm91c2VsUmVzb3VyY2VTdHJpbmdzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlU3RyaW5ncztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgZ2V0SW5kaWNhdG9yVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIGlmICh0aGlzLmluZGljYXRvclRlbXBsYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRpY2F0b3JUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0SW5kaWNhdG9yO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBnZXROZXh0QnV0dG9uVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIGlmICh0aGlzLm5leHRCdXR0b25UZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEJ1dHRvblRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHROZXh0QnV0dG9uO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBnZXRQcmV2QnV0dG9uVGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgICAgIGlmICh0aGlzLnByZXZCdXR0b25UZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldkJ1dHRvblRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRQcmV2QnV0dG9uO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBpbmRpY2F0b3JzT3JpZW50YXRpb25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIGBpZ3gtY2Fyb3VzZWwtaW5kaWNhdG9ycy0tJHt0aGlzLmluZGljYXRvcnNPcmllbnRhdGlvbn1gO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBzaG93SW5kaWNhdG9ycygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG90YWwgPD0gdGhpcy5tYXhpbXVtSW5kaWNhdG9yc0NvdW50ICYmIHRoaXMudG90YWwgPiAwO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBzaG93SW5kaWNhdG9yc0xhYmVsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b3RhbCA+IHRoaXMubWF4aW11bUluZGljYXRvcnNDb3VudDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgZ2V0Q2Fyb3VzZWxMYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY3VycmVudCArIDF9ICR7dGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2Nhcm91c2VsX29mfSAke3RoaXMudG90YWx9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0b3RhbCBudW1iZXIgb2YgYHNsaWRlc2AgaW4gdGhlIGNhcm91c2VsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgc2xpZGVDb3VudCA9ICB0aGlzLmNhcm91c2VsLnRvdGFsO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCB0b3RhbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZXM/Lmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW5kZXggb2YgdGhlIHNsaWRlIGJlaW5nIGN1cnJlbnRseSBzaG93bi5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGN1cnJlbnRTbGlkZU51bWJlciA9ICB0aGlzLmNhcm91c2VsLmN1cnJlbnQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4Q2Fyb3VzZWxDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmN1cnJlbnRJdGVtID8gMCA6IHRoaXMuY3VycmVudEl0ZW0uaW5kZXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgY2Fyb3VzZWwgaXMgcGxheWluZy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzUGxheWluZyA9ICB0aGlzLmNhcm91c2VsLmlzUGxheWluZztcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNQbGF5aW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5aW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMg0LAgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBjYXJvdXNlbCBpcyBkZXN0cm95ZWQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0Rlc3Ryb3llZCA9ICB0aGlzLmNhcm91c2VsLmlzRGVzdHJveWVkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBpc0Rlc3Ryb3llZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdHJveWVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBjYXJvdXNlbCBlbGVtZW50IGluIHRoZSBET00uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBuYXRpdmVFbGVtZW50ID0gIHRoaXMuY2Fyb3VzZWwubmF0aXZlRWxlbWVudDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdGltZSBgaW50ZXJ2YWxgIGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIHNsaWRlIGNoYW5nZXMuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCB0aW1lSW50ZXJ2YWwgPSB0aGlzLmNhcm91c2VsLmludGVydmFsO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGludGVydmFsKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRlcnZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB0aW1lIGBpbnRlcnZhbGAgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgc2xpZGUgY2hhbmdlcy5cbiAgICAgKiBJZiBub3Qgc2V0LCB0aGUgY2Fyb3VzZWwgd2lsbCBub3QgY2hhbmdlIGBzbGlkZXNgIGF1dG9tYXRpY2FsbHkuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2Fyb3VzZWwgW2ludGVydmFsXSA9IFwiMTAwMFwiPjwvaWd4LWNhcm91c2VsPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNldCBpbnRlcnZhbCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2ludGVydmFsID0gK3ZhbHVlO1xuICAgICAgICB0aGlzLnJlc3RhcnRJbnRlcnZhbCgpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBpdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlciwgcHJpdmF0ZSBwbGF0Zm9ybVV0aWw6IFBsYXRmb3JtVXRpbCkge1xuICAgICAgICBzdXBlcihidWlsZGVyLCBjZHIpO1xuICAgICAgICB0aGlzLmRpZmZlciA9IHRoaXMuaXRlcmFibGVEaWZmZXJzLmZpbmQoW10pLmNyZWF0ZShudWxsKTtcbiAgICB9XG5cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd3JpZ2h0JywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25LZXlkb3duQXJyb3dSaWdodChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5rZXlib2FyZFN1cHBvcnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNTbGlkZUVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5hcnJvd2xlZnQnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbktleWRvd25BcnJvd0xlZnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRTdXBwb3J0KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgICAgICAgICB0aGlzLmZvY3VzU2xpZGVFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ3RhcCcsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uVGFwKGV2ZW50KSB7XG4gICAgICAgIC8vIHBsYXkgcGF1c2Ugb25seSB3aGVuIHRhcCBvbiBzbGlkZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2lneC1zbGlkZScpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXVzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BwZWRCeUludGVyYWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RvcHBlZEJ5SW50ZXJhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5ob21lJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25LZXlkb3duSG9tZShldmVudCkge1xuICAgICAgICBpZiAodGhpcy5rZXlib2FyZFN1cHBvcnQgJiYgdGhpcy5zbGlkZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVzLmZpcnN0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZvY3VzU2xpZGVFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uZW5kJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25LZXlkb3duRW5kKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmtleWJvYXJkU3VwcG9ydCAmJiB0aGlzLnNsaWRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zbGlkZXMubGFzdC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5mb2N1c1NsaWRlRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgICBwdWJsaWMgb25Nb3VzZUVudGVyKCkge1xuICAgICAgICBpZiAodGhpcy5wYXVzZSAmJiB0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5zdG9wcGVkQnlJbnRlcmFjdGlvbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgICBwdWJsaWMgb25Nb3VzZUxlYXZlKCkge1xuICAgICAgICBpZiAodGhpcy5zdG9wcGVkQnlJbnRlcmFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ3BhbmxlZnQnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvblBhbkxlZnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wYW4oZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcigncGFucmlnaHQnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvblBhblJpZ2h0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMucGFuKGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcigncGFuZW5kJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25QYW5FbmQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdlc3R1cmVzU3VwcG9ydCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVXaWR0aCA9IHRoaXMuY3VycmVudEl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgY29uc3QgcGFuT2Zmc2V0ID0gKHNsaWRlV2lkdGggLyAxMDAwKTtcbiAgICAgICAgY29uc3QgZGVsdGFYID0gTWF0aC5hYnMoZXZlbnQuZGVsdGFYKSArIHBhbk9mZnNldCA8IHNsaWRlV2lkdGggPyBNYXRoLmFicyhldmVudC5kZWx0YVgpIDogc2xpZGVXaWR0aCAtIHBhbk9mZnNldDtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSBNYXRoLmFicyhldmVudC52ZWxvY2l0eSk7XG4gICAgICAgIHRoaXMucmVzZXRTbGlkZVN0eWxlcyh0aGlzLmN1cnJlbnRJdGVtKTtcbiAgICAgICAgaWYgKHRoaXMuaW5jb21pbmdTbGlkZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldFNsaWRlU3R5bGVzKHRoaXMuaW5jb21pbmdTbGlkZSk7XG4gICAgICAgICAgICBpZiAoc2xpZGVXaWR0aCAvIDIgPCBkZWx0YVggfHwgdmVsb2NpdHkgPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvbWluZ1NsaWRlLmRpcmVjdGlvbiA9IGV2ZW50LmRlbHRhWCA8IDAgPyBEaXJlY3Rpb24uTkVYVCA6IERpcmVjdGlvbi5QUkVWO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb21pbmdTbGlkZS5wcmV2aW91cyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Qb3NpdGlvbiA9IHRoaXMuYW5pbWF0aW9uVHlwZSA9PT0gSG9yaXpvbnRhbEFuaW1hdGlvblR5cGUuZmFkZSA/XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhWCAvIHNsaWRlV2lkdGggOiAoc2xpZGVXaWR0aCAtIGRlbHRhWCkgLyBzbGlkZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZlbG9jaXR5ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld0R1cmF0aW9uID0gdGhpcy5kZWZhdWx0QW5pbWF0aW9uRHVyYXRpb24gLyB2ZWxvY2l0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvbWluZ1NsaWRlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEl0ZW0uZGlyZWN0aW9uID0gZXZlbnQuZGVsdGFYID4gMCA/IERpcmVjdGlvbi5ORVhUIDogRGlyZWN0aW9uLlBSRVY7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c0l0ZW0gPSB0aGlzLmluY29taW5nU2xpZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c0l0ZW0ucHJldmlvdXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uUG9zaXRpb24gPSB0aGlzLmFuaW1hdGlvblR5cGUgPT09IEhvcml6b250YWxBbmltYXRpb25UeXBlLmZhZGUgP1xuICAgICAgICAgICAgICAgICAgICBNYXRoLmFicygoc2xpZGVXaWR0aCAtIGRlbHRhWCkgLyBzbGlkZVdpZHRoKSA6IGRlbHRhWCAvIHNsaWRlV2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9ucygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc3RvcHBlZEJ5SW50ZXJhY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnNsaWRlcy5jaGFuZ2VzXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChjaGFuZ2U6IFF1ZXJ5TGlzdDxJZ3hTbGlkZUNvbXBvbmVudD4pID0+IHRoaXMuaW5pdFNsaWRlcyhjaGFuZ2UpKTtcblxuICAgICAgICB0aGlzLmluaXRTbGlkZXModGhpcy5zbGlkZXMpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5sYXN0SW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5sYXN0SW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2xpZGUgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvdmlkZWQgYGluZGV4YCBvciBudWxsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgc2xpZGUxID0gIHRoaXMuY2Fyb3VzZWwuZ2V0KDEpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldChpbmRleDogbnVtYmVyKTogSWd4U2xpZGVDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zbGlkZXMuZmluZCgoc2xpZGUpID0+IHNsaWRlLmluZGV4ID09PSBpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIG5ldyBzbGlkZSB0byB0aGUgY2Fyb3VzZWwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2Fyb3VzZWwuYWRkKG5ld1NsaWRlKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGQoc2xpZGU6IElneFNsaWRlQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IG5ld1NsaWRlcyA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcbiAgICAgICAgbmV3U2xpZGVzLnB1c2goc2xpZGUpO1xuICAgICAgICB0aGlzLnNsaWRlcy5yZXNldChuZXdTbGlkZXMpO1xuICAgICAgICB0aGlzLnNsaWRlcy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgc2xpZGUgZnJvbSB0aGUgY2Fyb3VzZWwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2Fyb3VzZWwucmVtb3ZlKHNsaWRlKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmUoc2xpZGU6IElneFNsaWRlQ29tcG9uZW50KSB7XG4gICAgICAgIGlmIChzbGlkZSAmJiBzbGlkZSA9PT0gdGhpcy5nZXQoc2xpZGUuaW5kZXgpKSB7IC8vIGNoZWNrIGlmIHRoZSByZXF1ZXN0ZWQgc2xpZGUgZm9yIGRlbGV0ZSBpcyBwcmVzZW50IGluIHRoZSBjYXJvdXNlbFxuICAgICAgICAgICAgY29uc3QgbmV3U2xpZGVzID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuICAgICAgICAgICAgbmV3U2xpZGVzLnNwbGljZShzbGlkZS5pbmRleCwgMSk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlcy5yZXNldChuZXdTbGlkZXMpO1xuICAgICAgICAgICAgdGhpcy5zbGlkZXMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBLaWNrcyBpbiBhIHRyYW5zaXRpb24gZm9yIGEgZ2l2ZW4gc2xpZGUgd2l0aCBhIGdpdmVuIGBkaXJlY3Rpb25gLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNhcm91c2VsLnNlbGVjdCh0aGlzLmNhcm91c2VsLmdldCgyKSwgRGlyZWN0aW9uLk5FWFQpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdChzbGlkZTogSWd4U2xpZGVDb21wb25lbnQsIGRpcmVjdGlvbjogRGlyZWN0aW9uID0gRGlyZWN0aW9uLk5PTkUpIHtcbiAgICAgICAgaWYgKHNsaWRlICYmIHNsaWRlICE9PSB0aGlzLmN1cnJlbnRJdGVtKSB7XG4gICAgICAgICAgICBzbGlkZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBzbGlkZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNpdGlvbnMgdG8gdGhlIG5leHQgc2xpZGUgaW4gdGhlIGNhcm91c2VsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNhcm91c2VsLm5leHQoKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBuZXh0KCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0TmV4dEluZGV4KCk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwICYmICF0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdCh0aGlzLmdldChpbmRleCksIERpcmVjdGlvbi5ORVhUKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2l0aW9ucyB0byB0aGUgcHJldmlvdXMgc2xpZGUgaW4gdGhlIGNhcm91c2VsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNhcm91c2VsLnByZXYoKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBJZ3hDYXJvdXNlbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBwcmV2KCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0UHJldkluZGV4KCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmxvb3AgJiYgaW5kZXggPT09IHRoaXMudG90YWwgLSAxKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5nZXQoaW5kZXgpLCBEaXJlY3Rpb24uUFJFVik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdW1lcyBwbGF5aW5nIG9mIHRoZSBjYXJvdXNlbCBpZiBpbiBwYXVzZWQgc3RhdGUuXG4gICAgICogTm8gb3BlcmF0aW9uIG90aGVyd2lzZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jYXJvdXNlbC5wbGF5KCk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlck9mIElneENhcm91c2VsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIHBsYXkoKSB7XG4gICAgICAgIGlmICghdGhpcy5wbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbkNhcm91c2VsUGxheWluZy5lbWl0KHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcHBlZEJ5SW50ZXJhY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHNsaWRlIHRyYW5zaXRpb25zIGlmIHRoZSBgcGF1c2VgIG9wdGlvbiBpcyBzZXQgdG8gYHRydWVgLlxuICAgICAqIE5vIG9wZXJhdGlvbiBvdGhlcndpc2UuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICB0aGlzLmNhcm91c2VsLnN0b3AoKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgSWd4Q2Fyb3VzZWxDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGF1c2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5vbkNhcm91c2VsUGF1c2VkLmVtaXQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnJlc2V0SW50ZXJ2YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRQcmV2aW91c0VsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmV2aW91c0l0ZW0ubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0Q3VycmVudEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRJdGVtLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldEludGVydmFsKCkge1xuICAgICAgICBpZiAodGhpcy5sYXN0SW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5sYXN0SW50ZXJ2YWwpO1xuICAgICAgICAgICAgdGhpcy5sYXN0SW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXN0YXJ0SW50ZXJ2YWwoKSB7XG4gICAgICAgIHRoaXMucmVzZXRJbnRlcnZhbCgpO1xuXG4gICAgICAgIGlmICghaXNOYU4odGhpcy5pbnRlcnZhbCkgJiYgdGhpcy5pbnRlcnZhbCA+IDAgJiYgdGhpcy5wbGF0Zm9ybVV0aWwuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aWNrID0gK3RoaXMuaW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWluZyAmJiB0aGlzLnRvdGFsICYmICFpc05hTih0aWNrKSAmJiB0aWNrID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLmludGVydmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBuZXh0QnV0dG9uRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5sb29wICYmIHRoaXMuY3VycmVudCA9PT0gKHRoaXMudG90YWwgLSAxKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgcHJldkJ1dHRvbkRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMubG9vcCAmJiB0aGlzLmN1cnJlbnQgPT09IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXh0SW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnQgKyAxKSAlIHRoaXMudG90YWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQcmV2SW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudCAtIDEgPCAwID8gdGhpcy50b3RhbCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzZXRTbGlkZVN0eWxlcyhzbGlkZTogSWd4U2xpZGVDb21wb25lbnQpIHtcbiAgICAgICAgc2xpZGUubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICAgICAgc2xpZGUubmF0aXZlRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJyc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYW4oZXZlbnQpIHtcbiAgICAgICAgY29uc3Qgc2xpZGVXaWR0aCA9IHRoaXMuY3VycmVudEl0ZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgY29uc3QgcGFuT2Zmc2V0ID0gKHNsaWRlV2lkdGggLyAxMDAwKTtcbiAgICAgICAgY29uc3QgZGVsdGFYID0gZXZlbnQuZGVsdGFYO1xuICAgICAgICBjb25zdCBpbmRleCA9IGRlbHRhWCA8IDAgPyB0aGlzLmdldE5leHRJbmRleCgpIDogdGhpcy5nZXRQcmV2SW5kZXgoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZGVsdGFYIDwgMCA/IHNsaWRlV2lkdGggKyBkZWx0YVggOiAtc2xpZGVXaWR0aCArIGRlbHRhWDtcblxuICAgICAgICBpZiAoIXRoaXMuZ2VzdHVyZXNTdXBwb3J0IHx8IGV2ZW50LmlzRmluYWwgfHwgTWF0aC5hYnMoZGVsdGFYKSArIHBhbk9mZnNldCA+PSBzbGlkZVdpZHRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubG9vcCAmJiAoKHRoaXMuY3VycmVudCA9PT0gMCAmJiBkZWx0YVggPiAwKSB8fCAodGhpcy5jdXJyZW50ID09PSB0aGlzLnRvdGFsIC0gMSAmJiBkZWx0YVggPCAwKSkpIHtcbiAgICAgICAgICAgIHRoaXMuaW5jb21pbmdTbGlkZSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcHBlZEJ5SW50ZXJhY3Rpb24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmV2aW91c0l0ZW0gJiYgdGhpcy5wcmV2aW91c0l0ZW0ucHJldmlvdXMpIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNJdGVtLnByZXZpb3VzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5pc2hBbmltYXRpb25zKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5jb21pbmdTbGlkZSkge1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluY29taW5nU2xpZGUuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0U2xpZGVTdHlsZXModGhpcy5pbmNvbWluZ1NsaWRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29taW5nU2xpZGUucHJldmlvdXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29taW5nU2xpZGUgPSB0aGlzLmdldChpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluY29taW5nU2xpZGUgPSB0aGlzLmdldChpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmNvbWluZ1NsaWRlLnByZXZpb3VzID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25UeXBlID09PSBIb3Jpem9udGFsQW5pbWF0aW9uVHlwZS5mYWRlKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJdGVtLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IGAke01hdGguYWJzKG9mZnNldCkgLyBzbGlkZVdpZHRofWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJdGVtLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtkZWx0YVh9cHgpYDtcbiAgICAgICAgICAgIHRoaXMuaW5jb21pbmdTbGlkZS5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7b2Zmc2V0fXB4KWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVuc3Vic2NyaWJlcihzbGlkZTogSWd4U2xpZGVDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlKHRoaXMuZGVzdHJveSQsIHNsaWRlLmlzRGVzdHJveWVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uU2xpZGVBY3RpdmF0ZWQoc2xpZGU6IElneFNsaWRlQ29tcG9uZW50KSB7XG4gICAgICAgIGlmIChzbGlkZS5hY3RpdmUgJiYgc2xpZGUgIT09IHRoaXMuY3VycmVudEl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChzbGlkZS5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5OT05FKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3SW5kZXggPSBzbGlkZS5pbmRleDtcbiAgICAgICAgICAgICAgICBzbGlkZS5kaXJlY3Rpb24gPSBuZXdJbmRleCA+IHRoaXMuY3VycmVudCA/IERpcmVjdGlvbi5ORVhUIDogRGlyZWN0aW9uLlBSRVY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJldmlvdXNJdGVtICYmIHRoaXMucHJldmlvdXNJdGVtLnByZXZpb3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNJdGVtLnByZXZpb3VzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEl0ZW0uZGlyZWN0aW9uID0gc2xpZGUuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEl0ZW0uYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzSXRlbSA9IHRoaXMuY3VycmVudEl0ZW07XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SXRlbSA9IHNsaWRlO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckFuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SXRlbSA9IHNsaWRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vblNsaWRlQ2hhbmdlZC5lbWl0KHsgY2Fyb3VzZWw6IHRoaXMsIHNsaWRlIH0pO1xuICAgICAgICAgICAgdGhpcy5yZXN0YXJ0SW50ZXJ2YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBmaW5pc2hBbmltYXRpb25zKCkge1xuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25TdGFydGVkKHRoaXMubGVhdmVBbmltYXRpb25QbGF5ZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmxlYXZlQW5pbWF0aW9uUGxheWVyLmZpbmlzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uU3RhcnRlZCh0aGlzLmVudGVyQW5pbWF0aW9uUGxheWVyKSkge1xuICAgICAgICAgICAgdGhpcy5lbnRlckFuaW1hdGlvblBsYXllci5maW5pc2goKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdFNsaWRlcyhjaGFuZ2U6IFF1ZXJ5TGlzdDxJZ3hTbGlkZUNvbXBvbmVudD4pIHtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMuZGlmZmVyLmRpZmYoY2hhbmdlLnRvQXJyYXkoKSk7XG4gICAgICAgIGlmIChkaWZmKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlcy5yZWR1Y2UoKGFueSwgYywgaW5kKSA9PiBjLmluZGV4ID0gaW5kLCAwKTsgLy8gcmVzZXQgc2xpZGVzIGluZGV4ZXNcbiAgICAgICAgICAgIGRpZmYuZm9yRWFjaEFkZGVkSXRlbSgocmVjb3JkOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxJZ3hTbGlkZUNvbXBvbmVudD4pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzbGlkZSA9IHJlY29yZC5pdGVtO1xuICAgICAgICAgICAgICAgIHNsaWRlLnRvdGFsID0gdGhpcy50b3RhbDtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2xpZGVBZGRlZC5lbWl0KHsgY2Fyb3VzZWw6IHRoaXMsIHNsaWRlIH0pO1xuICAgICAgICAgICAgICAgIGlmIChzbGlkZS5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50SXRlbSA9IHNsaWRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzbGlkZS5hY3RpdmVDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZXIoc2xpZGUpKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMub25TbGlkZUFjdGl2YXRlZChzbGlkZSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRpZmYuZm9yRWFjaFJlbW92ZWRJdGVtKChyZWNvcmQ6IEl0ZXJhYmxlQ2hhbmdlUmVjb3JkPElneFNsaWRlQ29tcG9uZW50PikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsaWRlID0gcmVjb3JkLml0ZW07XG4gICAgICAgICAgICAgICAgdGhpcy5vblNsaWRlUmVtb3ZlZC5lbWl0KHsgY2Fyb3VzZWw6IHRoaXMsIHNsaWRlIH0pO1xuICAgICAgICAgICAgICAgIGlmIChzbGlkZS5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEl0ZW0gPSB0aGlzLmdldChzbGlkZS5pbmRleCA8IHRoaXMudG90YWwgPyBzbGlkZS5pbmRleCA6IHRoaXMudG90YWwgLSAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTbGlkZXNTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlU2xpZGVzU2VsZWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5wbGF0Zm9ybVV0aWwuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEl0ZW0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlU2xpZGVzID0gdGhpcy5zbGlkZXMuZmlsdGVyKHNsaWRlID0+IHNsaWRlLmFjdGl2ZSAmJiBzbGlkZS5pbmRleCAhPT0gdGhpcy5jdXJyZW50SXRlbS5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZVNsaWRlcy5mb3JFYWNoKHNsaWRlID0+IHNsaWRlLmFjdGl2ZSA9IGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXMuZmlyc3QuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGZvY3VzU2xpZGVFbGVtZW50KCkge1xuICAgICAgICBpZiAodGhpcy5sZWF2ZUFuaW1hdGlvblBsYXllcikge1xuICAgICAgICAgICAgdGhpcy5sZWF2ZUFuaW1hdGlvblBsYXllci5vbkRvbmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVzLmZpbmQocyA9PiBzLmFjdGl2ZSkubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5zbGlkZXMuZmluZChzID0+IHMuYWN0aXZlKS5uYXRpdmVFbGVtZW50LmZvY3VzKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNsaWRlRXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VFdmVudEFyZ3Mge1xuICAgIGNhcm91c2VsOiBJZ3hDYXJvdXNlbENvbXBvbmVudDtcbiAgICBzbGlkZTogSWd4U2xpZGVDb21wb25lbnQ7XG59XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBJZ3hDYXJvdXNlbENvbXBvbmVudCxcbiAgICAgICAgSWd4U2xpZGVDb21wb25lbnQsXG4gICAgICAgIElneENhcm91c2VsSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYXJvdXNlbE5leHRCdXR0b25EaXJlY3RpdmUsXG4gICAgICAgIElneENhcm91c2VsUHJldkJ1dHRvbkRpcmVjdGl2ZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hDYXJvdXNlbENvbXBvbmVudCxcbiAgICAgICAgSWd4U2xpZGVDb21wb25lbnQsXG4gICAgICAgIElneENhcm91c2VsSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYXJvdXNlbE5leHRCdXR0b25EaXJlY3RpdmUsXG4gICAgICAgIElneENhcm91c2VsUHJldkJ1dHRvbkRpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSWd4SWNvbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2Fyb3VzZWxNb2R1bGUge1xufVxuIiwiPG5nLXRlbXBsYXRlICNkZWZhdWx0SW5kaWNhdG9yIGxldC1zbGlkZT5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LW5hdi1kb3RcIlxuICAgICAgICBbY2xhc3MuaWd4LW5hdi1kb3QtLWFjdGl2ZV09XCJzbGlkZS5hY3RpdmVcIj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdE5leHRCdXR0b24gbGV0LWRpc2FibGVkPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LW5hdi1hcnJvd1wiXG4gICAgICAgICAgW2NsYXNzLmlneC1uYXYtYXJyb3ctLWRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgIDxpZ3gtaWNvbj5hcnJvd19mb3J3YXJkPC9pZ3gtaWNvbj5cbiAgICA8L3NwYW4+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRQcmV2QnV0dG9uIGxldC1kaXNhYmxlZD5cbiAgICA8c3BhbiBjbGFzcz1cImlneC1uYXYtYXJyb3dcIlxuICAgICAgICAgIFtjbGFzcy5pZ3gtbmF2LWFycm93LS1kaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAgICA8aWd4LWljb24+YXJyb3dfYmFjazwvaWd4LWljb24+XG4gICAgPC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cblxuPGRpdiAqbmdJZj1cInNob3dJbmRpY2F0b3JzXCIgW25nQ2xhc3NdPVwiaW5kaWNhdG9yc09yaWVudGF0aW9uQ2xhc3NcIiBbYXR0ci5yb2xlXT1cIid0YWJsaXN0J1wiPlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IHNsaWRlIG9mIHNsaWRlc1wiXG4gICAgICAgIGNsYXNzPVwiaWd4LWNhcm91c2VsLWluZGljYXRvcnNfX2luZGljYXRvclwiXG4gICAgICAgIChjbGljayk9XCJzZWxlY3Qoc2xpZGUpXCJcbiAgICAgICAgW2lkXT1cIid0YWItJysgc2xpZGUuaW5kZXggKyAnLScgKyB0b3RhbFwiXG4gICAgICAgIFthdHRyLnJvbGVdPVwiJ3RhYidcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInJlc291cmNlU3RyaW5ncy5pZ3hfY2Fyb3VzZWxfc2xpZGUgKyAnICcgKyAoc2xpZGUuaW5kZXggKyAxKSArICcgJyArIHJlc291cmNlU3RyaW5ncy5pZ3hfY2Fyb3VzZWxfb2YgKyAnICcgKyB0aGlzLnRvdGFsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCIncGFuZWwtJyArIHNsaWRlLmluZGV4XCJcbiAgICAgICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJzbGlkZS5hY3RpdmVcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImdldEluZGljYXRvclRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBzbGlkZX07XCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPGRpdiAqbmdJZj1cInNob3dJbmRpY2F0b3JzTGFiZWxcIiBbbmdDbGFzc109XCJpbmRpY2F0b3JzT3JpZW50YXRpb25DbGFzc1wiPlxuICAgIDxzcGFuIFtpZF09XCJsYWJlbElkXCIgY2xhc3M9XCJpZ3gtY2Fyb3VzZWxfX2xhYmVsXCI+e3tnZXRDYXJvdXNlbExhYmVsfX08L3NwYW4+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cImlneC1jYXJvdXNlbF9faW5uZXJcIiBbYXR0ci5hcmlhLWxpdmVdPVwiIWludGVydmFsIHx8IHN0b3BwZWRCeUludGVyYWN0aW9uID8gJ3BvbGl0ZScgOiAnb2ZmJ1wiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PlxuXG48ZGl2ICpuZ0lmPVwibmF2aWdhdGlvbiAmJiBzbGlkZXMubGVuZ3RoXCIgcm9sZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiIGNsYXNzPVwiaWd4LWNhcm91c2VsX19hcnJvdy0tcHJldlwiIFthdHRyLmFyaWEtbGFiZWxdPVwicmVzb3VyY2VTdHJpbmdzLmlneF9jYXJvdXNlbF9wcmV2aW91c19zbGlkZVwiIChrZXlkb3duLmVudGVyKT1cInByZXYoKVwiIChjbGljayk9XCJwcmV2KClcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZ2V0UHJldkJ1dHRvblRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBwcmV2QnV0dG9uRGlzYWJsZWR9O1wiPjwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxkaXYgKm5nSWY9XCJuYXZpZ2F0aW9uICYmIHNsaWRlcy5sZW5ndGhcIiByb2xlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCIwXCIgY2xhc3M9XCJpZ3gtY2Fyb3VzZWxfX2Fycm93LS1uZXh0XCIgW2F0dHIuYXJpYS1sYWJlbF09XCJyZXNvdXJjZVN0cmluZ3MuaWd4X2Nhcm91c2VsX25leHRfc2xpZGVcIiAoa2V5ZG93bi5lbnRlcik9XCJuZXh0KClcIiAoY2xpY2spPVwibmV4dCgpXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImdldE5leHRCdXR0b25UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogbmV4dEJ1dHRvbkRpc2FibGVkfTtcIj48L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG5cblxuIl19