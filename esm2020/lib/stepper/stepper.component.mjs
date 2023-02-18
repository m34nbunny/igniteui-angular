import { useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, Output, EventEmitter, ContentChildren, NgModule, TemplateRef, ContentChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { growVerIn, growVerOut } from '../animations/grow';
import { fadeIn } from '../animations/main';
import { IgxCarouselComponentBase } from '../carousel/carousel-base';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxStepperTitlePosition, IgxStepperOrientation, IgxStepType, IGX_STEPPER_COMPONENT, VerticalAnimationType } from './stepper.common';
import { IgxStepActiveIndicatorDirective, IgxStepCompletedIndicatorDirective, IgxStepContentDirective, IgxStepIndicatorDirective, IgxStepInvalidIndicatorDirective, IgxStepSubTitleDirective, IgxStepTitleDirective } from './stepper.directive';
import { IgxStepComponent } from './step/step.component';
import { IgxStepperService } from './stepper.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "./stepper.service";
import * as i3 from "@angular/common";
// TODO: common interface between IgxCarouselComponentBase and ToggleAnimationPlayer?
/**
 * IgxStepper provides a wizard-like workflow by dividing content into logical steps.
 *
 * @igxModule IgxStepperModule
 *
 * @igxKeywords stepper
 *
 * @igxGroup Layouts
 *
 * @remarks
 * The Ignite UI for Angular Stepper component allows the user to navigate between multiple steps.
 * It supports horizontal and vertical orientation as well as keyboard navigation and provides API methods to control the active step.
 * The component offers keyboard navigation and API to control the active step.
 *
 * @example
 * ```html
 * <igx-stepper>
 *  <igx-step [active]="true">
 *      <igx-icon igxStepIndicator>home</igx-icon>
 *      <p igxStepTitle>Home</p>
 *      <div igxStepContent>
 *         ...
 *      </div>
 *  </igx-step>
 *  <igx-step [optional]="true">
 *      <div igxStepContent>
 *          ...
 *      </div>
 *  </igx-step>
 *  <igx-step>
 *      <div igxStepContent>
 *          ...
 *      </div>
 *  </igx-step>
 * </igx-stepper>
 * ```
 */
export class IgxStepperComponent extends IgxCarouselComponentBase {
    constructor(cdr, animBuilder, stepperService, element) {
        super(animBuilder, cdr);
        this.animBuilder = animBuilder;
        this.stepperService = stepperService;
        this.element = element;
        /**
         * Get/Set the type of the steps.
         *
         * ```typescript
         * this.stepper.stepType = IgxStepType.Indicator;
         * ```
         */
        this.stepType = IgxStepType.Full;
        /**
         * Get/Set whether the content is displayed above the steps.
         *
         * @remarks
         * Default value is `false` and the content is below the steps.
         *
         * ```typescript
         * this.stepper.contentTop = true;
         * ```
         */
        this.contentTop = false;
        /**
         * Get/Set the position of the steps title.
         *
         * @remarks
         * The default value when the stepper is horizontally orientated is `bottom`.
         * In vertical layout the default title position is `end`.
         *
         * ```typescript
         * this.stepper.titlePosition = IgxStepperTitlePosition.Top;
         * ```
         */
        this.titlePosition = null;
        /** @hidden @internal **/
        this.cssClass = 'igx-stepper';
        /** @hidden @internal **/
        this.role = 'tablist';
        /**
         * Emitted when the stepper's active step is changing.
         *
         *```html
         * <igx-stepper (activeStepChanging)="handleActiveStepChanging($event)">
         * </igx-stepper>
         * ```
         *
         *```typescript
         * public handleActiveStepChanging(event: IStepChangingEventArgs) {
         *  if (event.newIndex < event.oldIndex) {
         *      event.cancel = true;
         *  }
         * }
         *```
         */
        this.activeStepChanging = new EventEmitter();
        /**
         * Emitted when the active step is changed.
         *
         * @example
         * ```
         * <igx-stepper (activeStepChanged)="handleActiveStepChanged($event)"></igx-stepper>
         * ```
         */
        this.activeStepChanged = new EventEmitter();
        /** @hidden @internal */
        this.verticalAnimationSettings = {
            openAnimation: growVerIn,
            closeAnimation: growVerOut,
        };
        /** @hidden @internal */
        this._defaultTitlePosition = IgxStepperTitlePosition.Bottom;
        this.destroy$ = new Subject();
        this._orientation = IgxStepperOrientation.Horizontal;
        this._verticalAnimationType = VerticalAnimationType.Grow;
        this._linear = false;
        this._defaultAnimationDuration = 350;
        this.stepperService.stepper = this;
    }
    /**
     * Get/Set the animation type of the stepper when the orientation direction is vertical.
     *
     * @remarks
     * Default value is `grow`. Other possible values are `fade` and `none`.
     *
     * ```html
     * <igx-stepper verticalAnimationType="none">
     * <igx-stepper>
     * ```
     */
    get verticalAnimationType() {
        return this._verticalAnimationType;
    }
    set verticalAnimationType(value) {
        // TODO: activeChange event is not emitted for the collapsing steps (loop through collapsing steps and emit)
        this.stepperService.collapsingSteps.clear();
        this._verticalAnimationType = value;
        switch (value) {
            case 'grow':
                this.verticalAnimationSettings = this.updateVerticalAnimationSettings(growVerIn, growVerOut);
                break;
            case 'fade':
                this.verticalAnimationSettings = this.updateVerticalAnimationSettings(fadeIn, null);
                break;
            case 'none':
                this.verticalAnimationSettings = this.updateVerticalAnimationSettings(null, null);
                break;
        }
    }
    /**
     * Get/Set the animation type of the stepper when the orientation direction is horizontal.
     *
     * @remarks
     * Default value is `grow`. Other possible values are `fade` and `none`.
     *
     * ```html
     * <igx-stepper animationType="none">
     * <igx-stepper>
     * ```
     */
    get horizontalAnimationType() {
        return this.animationType;
    }
    set horizontalAnimationType(value) {
        // TODO: activeChange event is not emitted for the collapsing steps (loop through collapsing steps and emit)
        this.stepperService.collapsingSteps.clear();
        this.animationType = value;
    }
    /**
     * Get/Set the animation duration.
     * ```html
     * <igx-stepper [animationDuration]="500">
     * <igx-stepper>
     * ```
     */
    get animationDuration() {
        return this.defaultAnimationDuration;
    }
    set animationDuration(value) {
        if (value && value > 0) {
            this.defaultAnimationDuration = value;
            return;
        }
        this.defaultAnimationDuration = this._defaultAnimationDuration;
    }
    /**
     * Get/Set whether the stepper is linear.
     *
     * @remarks
     * If the stepper is in linear mode and if the active step is valid only then the user is able to move forward.
     *
     * ```html
     * <igx-stepper [linear]="true"></igx-stepper>
     * ```
     */
    get linear() {
        return this._linear;
    }
    set linear(value) {
        this._linear = value;
        if (this._linear && this.steps.length > 0) {
            // when the stepper is in linear mode we should calculate which steps should be disabled
            // and which are visited i.e. their validity should be correctly displayed.
            this.stepperService.calculateVisitedSteps();
            this.stepperService.calculateLinearDisabledSteps();
        }
        else {
            this.stepperService.linearDisabledSteps.clear();
        }
    }
    /**
     * Get/Set the stepper orientation.
     *
     * ```typescript
     * this.stepper.orientation = IgxStepperOrientation.Vertical;
     * ```
     */
    get orientation() {
        return this._orientation;
    }
    set orientation(value) {
        if (this._orientation === value) {
            return;
        }
        // TODO: activeChange event is not emitted for the collapsing steps
        this.stepperService.collapsingSteps.clear();
        this._orientation = value;
        this._defaultTitlePosition = this._orientation === IgxStepperOrientation.Horizontal ?
            IgxStepperTitlePosition.Bottom : IgxStepperTitlePosition.End;
    }
    /** @hidden @internal **/
    get directionClass() {
        return this.orientation === IgxStepperOrientation.Horizontal;
    }
    /**
     * Get all steps.
     *
     * ```typescript
     * const steps: IgxStepComponent[] = this.stepper.steps;
     * ```
     */
    get steps() {
        return this._steps?.toArray() || [];
    }
    /** @hidden @internal */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /** @hidden @internal */
    ngOnChanges(changes) {
        if (changes['animationDuration']) {
            this.verticalAnimationType = this._verticalAnimationType;
        }
    }
    /** @hidden @internal */
    ngOnInit() {
        this.enterAnimationDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.activeStepChanged.emit({ owner: this, index: this.stepperService.activeStep.index });
        });
        this.leaveAnimationDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.stepperService.collapsingSteps.size === 1) {
                this.stepperService.collapse(this.stepperService.previousActiveStep);
            }
            else {
                Array.from(this.stepperService.collapsingSteps).slice(0, this.stepperService.collapsingSteps.size - 1)
                    .forEach(step => this.stepperService.collapse(step));
            }
        });
    }
    /** @hidden @internal */
    ngAfterContentInit() {
        let activeStep;
        this.steps.forEach((step, index) => {
            this.updateStepAria(step, index);
            if (!activeStep && step.active) {
                activeStep = step;
            }
        });
        if (!activeStep) {
            this.activateFirstStep(true);
        }
        this.handleStepChanges();
    }
    /** @hidden @internal */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    /**
     * Activates the step at a given index.
     *
     *```typescript
     * this.stepper.navigateTo(1);
     *```
     */
    navigateTo(index) {
        const step = this.steps[index];
        if (!step || this.stepperService.activeStep === step) {
            return;
        }
        this.activateStep(step);
    }
    /**
     * Activates the next enabled step.
     *
     *```typescript
     * this.stepper.next();
     *```
     */
    next() {
        this.moveToNextStep();
    }
    /**
     * Activates the previous enabled step.
     *
     *```typescript
     * this.stepper.prev();
     *```
     */
    prev() {
        this.moveToNextStep(false);
    }
    /**
     * Resets the stepper to its initial state i.e. activates the first step.
     *
     * @remarks
     * The steps' content will not be automatically reset.
     *```typescript
     * this.stepper.reset();
     *```
     */
    reset() {
        this.stepperService.visitedSteps.clear();
        const activeStep = this.steps.find(s => !s.disabled);
        if (activeStep) {
            this.activateStep(activeStep);
        }
    }
    /** @hidden @internal */
    playHorizontalAnimations() {
        this.previousItem = this.stepperService.previousActiveStep;
        this.currentItem = this.stepperService.activeStep;
        this.triggerAnimations();
    }
    getPreviousElement() {
        return this.stepperService.previousActiveStep?.contentContainer.nativeElement;
    }
    getCurrentElement() {
        return this.stepperService.activeStep.contentContainer.nativeElement;
    }
    updateVerticalAnimationSettings(openAnimation, closeAnimation) {
        const customCloseAnimation = useAnimation(closeAnimation, {
            params: {
                duration: this.animationDuration + 'ms'
            }
        });
        const customOpenAnimation = useAnimation(openAnimation, {
            params: {
                duration: this.animationDuration + 'ms'
            }
        });
        return {
            openAnimation: openAnimation ? customOpenAnimation : null,
            closeAnimation: closeAnimation ? customCloseAnimation : null
        };
    }
    updateStepAria(step, index) {
        step._index = index;
        step.renderer.setAttribute(step.nativeElement, 'aria-setsize', (this.steps.length).toString());
        step.renderer.setAttribute(step.nativeElement, 'aria-posinset', (index + 1).toString());
    }
    handleStepChanges() {
        this._steps.changes.pipe(takeUntil(this.destroy$)).subscribe(steps => {
            Promise.resolve().then(() => {
                steps.forEach((step, index) => {
                    this.updateStepAria(step, index);
                });
                // when the active step is removed
                const hasActiveStep = this.steps.find(s => s === this.stepperService.activeStep);
                if (!hasActiveStep) {
                    this.activateFirstStep();
                }
                // TO DO: mark step added before the active as visited?
                if (this.linear) {
                    this.stepperService.calculateLinearDisabledSteps();
                }
            });
        });
    }
    activateFirstStep(activateInitially = false) {
        const firstEnabledStep = this.steps.find(s => !s.disabled);
        if (firstEnabledStep) {
            firstEnabledStep.active = true;
            if (activateInitially) {
                firstEnabledStep.activeChange.emit(true);
                this.activeStepChanged.emit({ owner: this, index: firstEnabledStep.index });
            }
        }
    }
    activateStep(step) {
        if (this.orientation === IgxStepperOrientation.Horizontal) {
            step.changeHorizontalActiveStep();
        }
        else {
            this.stepperService.expand(step);
        }
    }
    moveToNextStep(next = true) {
        let steps = this.steps;
        let activeStepIndex = this.stepperService.activeStep.index;
        if (!next) {
            steps = this.steps.reverse();
            activeStepIndex = steps.findIndex(s => s === this.stepperService.activeStep);
        }
        const nextStep = steps.find((s, i) => i > activeStepIndex && s.isAccessible);
        if (nextStep) {
            this.activateStep(nextStep);
        }
    }
}
IgxStepperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxStepperComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.AnimationBuilder }, { token: i2.IgxStepperService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxStepperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxStepperComponent, selector: "igx-stepper", inputs: { verticalAnimationType: "verticalAnimationType", horizontalAnimationType: "horizontalAnimationType", animationDuration: "animationDuration", linear: "linear", orientation: "orientation", stepType: "stepType", contentTop: "contentTop", titlePosition: "titlePosition" }, outputs: { activeStepChanging: "activeStepChanging", activeStepChanged: "activeStepChanged" }, host: { properties: { "attr.aria-orientation": "this.orientation", "class.igx-stepper": "this.cssClass", "attr.role": "this.role", "class.igx-stepper--horizontal": "this.directionClass" } }, providers: [
        IgxStepperService,
        { provide: IGX_STEPPER_COMPONENT, useExisting: IgxStepperComponent },
    ], queries: [{ propertyName: "invalidIndicatorTemplate", first: true, predicate: IgxStepInvalidIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "completedIndicatorTemplate", first: true, predicate: IgxStepCompletedIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "activeIndicatorTemplate", first: true, predicate: IgxStepActiveIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "_steps", predicate: IgxStepComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div *ngIf=\"!contentTop || orientation !== 'horizontal'\" class=\"igx-stepper__header\">\n    <ng-template *ngTemplateOutlet=\"stepTemplate\"></ng-template>\n</div>\n\n<div *ngIf=\"orientation === 'horizontal'\" class=\"igx-stepper__body\">\n    <ng-container *ngFor=\"let step of steps\">\n        <ng-container *ngTemplateOutlet=\"step.contentTemplate\"></ng-container>\n    </ng-container>\n</div>\n\n<div *ngIf=\"contentTop && orientation === 'horizontal'\" class=\"igx-stepper__header\">\n    <ng-template *ngTemplateOutlet=\"stepTemplate\"></ng-template>\n</div>\n\n<ng-template #stepTemplate>\n    <ng-content select=\"igx-step\"></ng-content>\n</ng-template>\n", directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxStepperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-stepper', providers: [
                        IgxStepperService,
                        { provide: IGX_STEPPER_COMPONENT, useExisting: IgxStepperComponent },
                    ], template: "<div *ngIf=\"!contentTop || orientation !== 'horizontal'\" class=\"igx-stepper__header\">\n    <ng-template *ngTemplateOutlet=\"stepTemplate\"></ng-template>\n</div>\n\n<div *ngIf=\"orientation === 'horizontal'\" class=\"igx-stepper__body\">\n    <ng-container *ngFor=\"let step of steps\">\n        <ng-container *ngTemplateOutlet=\"step.contentTemplate\"></ng-container>\n    </ng-container>\n</div>\n\n<div *ngIf=\"contentTop && orientation === 'horizontal'\" class=\"igx-stepper__header\">\n    <ng-template *ngTemplateOutlet=\"stepTemplate\"></ng-template>\n</div>\n\n<ng-template #stepTemplate>\n    <ng-content select=\"igx-step\"></ng-content>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.AnimationBuilder }, { type: i2.IgxStepperService }, { type: i0.ElementRef }]; }, propDecorators: { verticalAnimationType: [{
                type: Input
            }], horizontalAnimationType: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }], linear: [{
                type: Input
            }], orientation: [{
                type: HostBinding,
                args: ['attr.aria-orientation']
            }, {
                type: Input
            }], stepType: [{
                type: Input
            }], contentTop: [{
                type: Input
            }], titlePosition: [{
                type: Input
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-stepper']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], directionClass: [{
                type: HostBinding,
                args: ['class.igx-stepper--horizontal']
            }], activeStepChanging: [{
                type: Output
            }], activeStepChanged: [{
                type: Output
            }], invalidIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxStepInvalidIndicatorDirective, { read: TemplateRef }]
            }], completedIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxStepCompletedIndicatorDirective, { read: TemplateRef }]
            }], activeIndicatorTemplate: [{
                type: ContentChild,
                args: [IgxStepActiveIndicatorDirective, { read: TemplateRef }]
            }], _steps: [{
                type: ContentChildren,
                args: [IgxStepComponent, { descendants: false }]
            }] } });
export class IgxStepperModule {
}
IgxStepperModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxStepperModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxStepperModule, declarations: [IgxStepComponent, IgxStepperComponent, IgxStepTitleDirective,
        IgxStepSubTitleDirective,
        IgxStepIndicatorDirective,
        IgxStepContentDirective,
        IgxStepActiveIndicatorDirective,
        IgxStepCompletedIndicatorDirective,
        IgxStepInvalidIndicatorDirective], imports: [CommonModule,
        IgxRippleModule], exports: [IgxStepComponent, IgxStepperComponent, IgxStepTitleDirective,
        IgxStepSubTitleDirective,
        IgxStepIndicatorDirective,
        IgxStepContentDirective,
        IgxStepActiveIndicatorDirective,
        IgxStepCompletedIndicatorDirective,
        IgxStepInvalidIndicatorDirective] });
IgxStepperModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxStepperModule, imports: [[
            CommonModule,
            IgxRippleModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        IgxRippleModule
                    ],
                    declarations: [
                        IgxStepComponent,
                        IgxStepperComponent,
                        IgxStepTitleDirective,
                        IgxStepSubTitleDirective,
                        IgxStepIndicatorDirective,
                        IgxStepContentDirective,
                        IgxStepActiveIndicatorDirective,
                        IgxStepCompletedIndicatorDirective,
                        IgxStepInvalidIndicatorDirective,
                    ],
                    exports: [
                        IgxStepComponent,
                        IgxStepperComponent,
                        IgxStepTitleDirective,
                        IgxStepSubTitleDirective,
                        IgxStepIndicatorDirective,
                        IgxStepContentDirective,
                        IgxStepActiveIndicatorDirective,
                        IgxStepCompletedIndicatorDirective,
                        IgxStepInvalidIndicatorDirective,
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvc3RlcHBlci9zdGVwcGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zdGVwcGVyL3N0ZXBwZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFnRCxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNILFNBQVMsRUFBRSxXQUFXLEVBQ3RCLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFDNUMsUUFBUSxFQUE0QixXQUFXLEVBQUUsWUFBWSxFQUNoRSxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzNELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBQTJCLHdCQUF3QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXhFLE9BQU8sRUFDUyx1QkFBdUIsRUFBRSxxQkFBcUIsRUFDMUQsV0FBVyxFQUFFLHFCQUFxQixFQUFpRCxxQkFBcUIsRUFDM0csTUFBTSxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEVBQ0gsK0JBQStCLEVBQy9CLGtDQUFrQyxFQUNsQyx1QkFBdUIsRUFDdkIseUJBQXlCLEVBQUUsZ0NB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RUFBRTtnQkFLNUQsTUFBTTtzQkFEYixlQUFlO3VCQUFDLGdCQUFnQixFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRTs7QUF3UTdELE1BQU0sT0FBTyxnQkFBZ0I7OzZHQUFoQixnQkFBZ0I7OEdBQWhCLGdCQUFnQixpQkF0QnJCLGdCQUFnQixFQWxkWCxtQkFBbUIsRUFvZHhCLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIseUJBQXlCO1FBQ3pCLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0Isa0NBQWtDO1FBQ2xDLGdDQUFnQyxhQVpoQyxZQUFZO1FBQ1osZUFBZSxhQWNmLGdCQUFnQixFQTdkWCxtQkFBbUIsRUErZHhCLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIseUJBQXlCO1FBQ3pCLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0Isa0NBQWtDO1FBQ2xDLGdDQUFnQzs4R0FHM0IsZ0JBQWdCLFlBM0JoQjtZQUNMLFlBQVk7WUFDWixlQUFlO1NBQ2xCOzJGQXdCUSxnQkFBZ0I7a0JBNUI1QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGVBQWU7cUJBQ2xCO29CQUNELFlBQVksRUFBRTt3QkFDVixnQkFBZ0I7d0JBQ2hCLG1CQUFtQjt3QkFDbkIscUJBQXFCO3dCQUNyQix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsdUJBQXVCO3dCQUN2QiwrQkFBK0I7d0JBQy9CLGtDQUFrQzt3QkFDbEMsZ0NBQWdDO3FCQUNuQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsZ0JBQWdCO3dCQUNoQixtQkFBbUI7d0JBQ25CLHFCQUFxQjt3QkFDckIsd0JBQXdCO3dCQUN4Qix5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsK0JBQStCO3dCQUMvQixrQ0FBa0M7d0JBQ2xDLGdDQUFnQztxQkFDbkM7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb25CdWlsZGVyLCBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSwgdXNlQW5pbWF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBPbkRlc3Ryb3ksIE9uSW5pdCxcbiAgICBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBFbGVtZW50UmVmLFxuICAgIE5nTW9kdWxlLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIFRlbXBsYXRlUmVmLCBDb250ZW50Q2hpbGQsIEFmdGVyQ29udGVudEluaXQsIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgZ3Jvd1ZlckluLCBncm93VmVyT3V0IH0gZnJvbSAnLi4vYW5pbWF0aW9ucy9ncm93JztcbmltcG9ydCB7IGZhZGVJbiB9IGZyb20gJy4uL2FuaW1hdGlvbnMvbWFpbic7XG5pbXBvcnQgeyBIb3Jpem9udGFsQW5pbWF0aW9uVHlwZSwgSWd4Q2Fyb3VzZWxDb21wb25lbnRCYXNlIH0gZnJvbSAnLi4vY2Fyb3VzZWwvY2Fyb3VzZWwtYmFzZSc7XG5pbXBvcnQgeyBJZ3hSaXBwbGVNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3JpcHBsZS9yaXBwbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRvZ2dsZUFuaW1hdGlvblNldHRpbmdzIH0gZnJvbSAnLi4vZXhwYW5zaW9uLXBhbmVsL3RvZ2dsZS1hbmltYXRpb24tY29tcG9uZW50JztcbmltcG9ydCB7XG4gICAgSWd4U3RlcHBlciwgSWd4U3RlcHBlclRpdGxlUG9zaXRpb24sIElneFN0ZXBwZXJPcmllbnRhdGlvbixcbiAgICBJZ3hTdGVwVHlwZSwgSUdYX1NURVBQRVJfQ09NUE9ORU5ULCBJU3RlcENoYW5nZWRFdmVudEFyZ3MsIElTdGVwQ2hhbmdpbmdFdmVudEFyZ3MsIFZlcnRpY2FsQW5pbWF0aW9uVHlwZVxufSBmcm9tICcuL3N0ZXBwZXIuY29tbW9uJztcbmltcG9ydCB7XG4gICAgSWd4U3RlcEFjdGl2ZUluZGljYXRvckRpcmVjdGl2ZSxcbiAgICBJZ3hTdGVwQ29tcGxldGVkSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgIElneFN0ZXBDb250ZW50RGlyZWN0aXZlLFxuICAgIElneFN0ZXBJbmRpY2F0b3JEaXJlY3RpdmUsIElneFN0ZXBJbnZhbGlkSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgIElneFN0ZXBTdWJUaXRsZURpcmVjdGl2ZSwgSWd4U3RlcFRpdGxlRGlyZWN0aXZlXG59IGZyb20gJy4vc3RlcHBlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4U3RlcENvbXBvbmVudCB9IGZyb20gJy4vc3RlcC9zdGVwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hTdGVwcGVyU2VydmljZSB9IGZyb20gJy4vc3RlcHBlci5zZXJ2aWNlJztcblxuXG4vLyBUT0RPOiBjb21tb24gaW50ZXJmYWNlIGJldHdlZW4gSWd4Q2Fyb3VzZWxDb21wb25lbnRCYXNlIGFuZCBUb2dnbGVBbmltYXRpb25QbGF5ZXI/XG5cbi8qKlxuICogSWd4U3RlcHBlciBwcm92aWRlcyBhIHdpemFyZC1saWtlIHdvcmtmbG93IGJ5IGRpdmlkaW5nIGNvbnRlbnQgaW50byBsb2dpY2FsIHN0ZXBzLlxuICpcbiAqIEBpZ3hNb2R1bGUgSWd4U3RlcHBlck1vZHVsZVxuICpcbiAqIEBpZ3hLZXl3b3JkcyBzdGVwcGVyXG4gKlxuICogQGlneEdyb3VwIExheW91dHNcbiAqXG4gKiBAcmVtYXJrc1xuICogVGhlIElnbml0ZSBVSSBmb3IgQW5ndWxhciBTdGVwcGVyIGNvbXBvbmVudCBhbGxvd3MgdGhlIHVzZXIgdG8gbmF2aWdhdGUgYmV0d2VlbiBtdWx0aXBsZSBzdGVwcy5cbiAqIEl0IHN1cHBvcnRzIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yaWVudGF0aW9uIGFzIHdlbGwgYXMga2V5Ym9hcmQgbmF2aWdhdGlvbiBhbmQgcHJvdmlkZXMgQVBJIG1ldGhvZHMgdG8gY29udHJvbCB0aGUgYWN0aXZlIHN0ZXAuXG4gKiBUaGUgY29tcG9uZW50IG9mZmVycyBrZXlib2FyZCBuYXZpZ2F0aW9uIGFuZCBBUEkgdG8gY29udHJvbCB0aGUgYWN0aXZlIHN0ZXAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtc3RlcHBlcj5cbiAqICA8aWd4LXN0ZXAgW2FjdGl2ZV09XCJ0cnVlXCI+XG4gKiAgICAgIDxpZ3gtaWNvbiBpZ3hTdGVwSW5kaWNhdG9yPmhvbWU8L2lneC1pY29uPlxuICogICAgICA8cCBpZ3hTdGVwVGl0bGU+SG9tZTwvcD5cbiAqICAgICAgPGRpdiBpZ3hTdGVwQ29udGVudD5cbiAqICAgICAgICAgLi4uXG4gKiAgICAgIDwvZGl2PlxuICogIDwvaWd4LXN0ZXA+XG4gKiAgPGlneC1zdGVwIFtvcHRpb25hbF09XCJ0cnVlXCI+XG4gKiAgICAgIDxkaXYgaWd4U3RlcENvbnRlbnQ+XG4gKiAgICAgICAgICAuLi5cbiAqICAgICAgPC9kaXY+XG4gKiAgPC9pZ3gtc3RlcD5cbiAqICA8aWd4LXN0ZXA+XG4gKiAgICAgIDxkaXYgaWd4U3RlcENvbnRlbnQ+XG4gKiAgICAgICAgICAuLi5cbiAqICAgICAgPC9kaXY+XG4gKiAgPC9pZ3gtc3RlcD5cbiAqIDwvaWd4LXN0ZXBwZXI+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtc3RlcHBlcicsXG4gICAgdGVtcGxhdGVVcmw6ICdzdGVwcGVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSWd4U3RlcHBlclNlcnZpY2UsXG4gICAgICAgIHsgcHJvdmlkZTogSUdYX1NURVBQRVJfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogSWd4U3RlcHBlckNvbXBvbmVudCB9LFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4U3RlcHBlckNvbXBvbmVudCBleHRlbmRzIElneENhcm91c2VsQ29tcG9uZW50QmFzZSBpbXBsZW1lbnRzIElneFN0ZXBwZXIsIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgLyoqXG4gICAgICogR2V0L1NldCB0aGUgYW5pbWF0aW9uIHR5cGUgb2YgdGhlIHN0ZXBwZXIgd2hlbiB0aGUgb3JpZW50YXRpb24gZGlyZWN0aW9uIGlzIHZlcnRpY2FsLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBncm93YC4gT3RoZXIgcG9zc2libGUgdmFsdWVzIGFyZSBgZmFkZWAgYW5kIGBub25lYC5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN0ZXBwZXIgdmVydGljYWxBbmltYXRpb25UeXBlPVwibm9uZVwiPlxuICAgICAqIDxpZ3gtc3RlcHBlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgdmVydGljYWxBbmltYXRpb25UeXBlKCk6IFZlcnRpY2FsQW5pbWF0aW9uVHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbEFuaW1hdGlvblR5cGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB2ZXJ0aWNhbEFuaW1hdGlvblR5cGUodmFsdWU6IFZlcnRpY2FsQW5pbWF0aW9uVHlwZSkge1xuICAgICAgICAvLyBUT0RPOiBhY3RpdmVDaGFuZ2UgZXZlbnQgaXMgbm90IGVtaXR0ZWQgZm9yIHRoZSBjb2xsYXBzaW5nIHN0ZXBzIChsb29wIHRocm91Z2ggY29sbGFwc2luZyBzdGVwcyBhbmQgZW1pdClcbiAgICAgICAgdGhpcy5zdGVwcGVyU2VydmljZS5jb2xsYXBzaW5nU3RlcHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fdmVydGljYWxBbmltYXRpb25UeXBlID0gdmFsdWU7XG5cbiAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnZ3Jvdyc6XG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbEFuaW1hdGlvblNldHRpbmdzID0gdGhpcy51cGRhdGVWZXJ0aWNhbEFuaW1hdGlvblNldHRpbmdzKGdyb3dWZXJJbiwgZ3Jvd1Zlck91dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmYWRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsQW5pbWF0aW9uU2V0dGluZ3MgPSB0aGlzLnVwZGF0ZVZlcnRpY2FsQW5pbWF0aW9uU2V0dGluZ3MoZmFkZUluLCBudWxsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxBbmltYXRpb25TZXR0aW5ncyA9IHRoaXMudXBkYXRlVmVydGljYWxBbmltYXRpb25TZXR0aW5ncyhudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldC9TZXQgdGhlIGFuaW1hdGlvbiB0eXBlIG9mIHRoZSBzdGVwcGVyIHdoZW4gdGhlIG9yaWVudGF0aW9uIGRpcmVjdGlvbiBpcyBob3Jpem9udGFsLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBncm93YC4gT3RoZXIgcG9zc2libGUgdmFsdWVzIGFyZSBgZmFkZWAgYW5kIGBub25lYC5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN0ZXBwZXIgYW5pbWF0aW9uVHlwZT1cIm5vbmVcIj5cbiAgICAgKiA8aWd4LXN0ZXBwZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGhvcml6b250YWxBbmltYXRpb25UeXBlKCk6IEhvcml6b250YWxBbmltYXRpb25UeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uVHlwZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGhvcml6b250YWxBbmltYXRpb25UeXBlKHZhbHVlOiBIb3Jpem9udGFsQW5pbWF0aW9uVHlwZSkge1xuICAgICAgICAvLyBUT0RPOiBhY3RpdmVDaGFuZ2UgZXZlbnQgaXMgbm90IGVtaXR0ZWQgZm9yIHRoZSBjb2xsYXBzaW5nIHN0ZXBzIChsb29wIHRocm91Z2ggY29sbGFwc2luZyBzdGVwcyBhbmQgZW1pdClcbiAgICAgICAgdGhpcy5zdGVwcGVyU2VydmljZS5jb2xsYXBzaW5nU3RlcHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25UeXBlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0L1NldCB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXN0ZXBwZXIgW2FuaW1hdGlvbkR1cmF0aW9uXT1cIjUwMFwiPlxuICAgICAqIDxpZ3gtc3RlcHBlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgYW5pbWF0aW9uRHVyYXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdEFuaW1hdGlvbkR1cmF0aW9uO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYW5pbWF0aW9uRHVyYXRpb24odmFsdWU6IG51bWJlcikge1xuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRBbmltYXRpb25EdXJhdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVmYXVsdEFuaW1hdGlvbkR1cmF0aW9uID0gdGhpcy5fZGVmYXVsdEFuaW1hdGlvbkR1cmF0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldC9TZXQgd2hldGhlciB0aGUgc3RlcHBlciBpcyBsaW5lYXIuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIHRoZSBzdGVwcGVyIGlzIGluIGxpbmVhciBtb2RlIGFuZCBpZiB0aGUgYWN0aXZlIHN0ZXAgaXMgdmFsaWQgb25seSB0aGVuIHRoZSB1c2VyIGlzIGFibGUgdG8gbW92ZSBmb3J3YXJkLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc3RlcHBlciBbbGluZWFyXT1cInRydWVcIj48L2lneC1zdGVwcGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBsaW5lYXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saW5lYXI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBsaW5lYXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fbGluZWFyID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLl9saW5lYXIgJiYgdGhpcy5zdGVwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyB3aGVuIHRoZSBzdGVwcGVyIGlzIGluIGxpbmVhciBtb2RlIHdlIHNob3VsZCBjYWxjdWxhdGUgd2hpY2ggc3RlcHMgc2hvdWxkIGJlIGRpc2FibGVkXG4gICAgICAgICAgICAvLyBhbmQgd2hpY2ggYXJlIHZpc2l0ZWQgaS5lLiB0aGVpciB2YWxpZGl0eSBzaG91bGQgYmUgY29ycmVjdGx5IGRpc3BsYXllZC5cbiAgICAgICAgICAgIHRoaXMuc3RlcHBlclNlcnZpY2UuY2FsY3VsYXRlVmlzaXRlZFN0ZXBzKCk7XG4gICAgICAgICAgICB0aGlzLnN0ZXBwZXJTZXJ2aWNlLmNhbGN1bGF0ZUxpbmVhckRpc2FibGVkU3RlcHMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcHBlclNlcnZpY2UubGluZWFyRGlzYWJsZWRTdGVwcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0L1NldCB0aGUgc3RlcHBlciBvcmllbnRhdGlvbi5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnN0ZXBwZXIub3JpZW50YXRpb24gPSBJZ3hTdGVwcGVyT3JpZW50YXRpb24uVmVydGljYWw7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtb3JpZW50YXRpb24nKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBvcmllbnRhdGlvbigpOiBJZ3hTdGVwcGVyT3JpZW50YXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZW50YXRpb247XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBvcmllbnRhdGlvbih2YWx1ZTogSWd4U3RlcHBlck9yaWVudGF0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl9vcmllbnRhdGlvbiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IGFjdGl2ZUNoYW5nZSBldmVudCBpcyBub3QgZW1pdHRlZCBmb3IgdGhlIGNvbGxhcHNpbmcgc3RlcHNcbiAgICAgICAgdGhpcy5zdGVwcGVyU2VydmljZS5jb2xsYXBzaW5nU3RlcHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fb3JpZW50YXRpb24gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFRpdGxlUG9zaXRpb24gPSB0aGlzLl9vcmllbnRhdGlvbiA9PT0gSWd4U3RlcHBlck9yaWVudGF0aW9uLkhvcml6b250YWwgP1xuICAgICAgICAgICAgSWd4U3RlcHBlclRpdGxlUG9zaXRpb24uQm90dG9tIDogSWd4U3RlcHBlclRpdGxlUG9zaXRpb24uRW5kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldC9TZXQgdGhlIHR5cGUgb2YgdGhlIHN0ZXBzLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc3RlcHBlci5zdGVwVHlwZSA9IElneFN0ZXBUeXBlLkluZGljYXRvcjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzdGVwVHlwZTogSWd4U3RlcFR5cGUgPSBJZ3hTdGVwVHlwZS5GdWxsO1xuXG4gICAgLyoqXG4gICAgICogR2V0L1NldCB3aGV0aGVyIHRoZSBjb250ZW50IGlzIGRpc3BsYXllZCBhYm92ZSB0aGUgc3RlcHMuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYCBhbmQgdGhlIGNvbnRlbnQgaXMgYmVsb3cgdGhlIHN0ZXBzLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc3RlcHBlci5jb250ZW50VG9wID0gdHJ1ZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjb250ZW50VG9wID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBHZXQvU2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgc3RlcHMgdGl0bGUuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIHdoZW4gdGhlIHN0ZXBwZXIgaXMgaG9yaXpvbnRhbGx5IG9yaWVudGF0ZWQgaXMgYGJvdHRvbWAuXG4gICAgICogSW4gdmVydGljYWwgbGF5b3V0IHRoZSBkZWZhdWx0IHRpdGxlIHBvc2l0aW9uIGlzIGBlbmRgLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc3RlcHBlci50aXRsZVBvc2l0aW9uID0gSWd4U3RlcHBlclRpdGxlUG9zaXRpb24uVG9wO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRpdGxlUG9zaXRpb246IElneFN0ZXBwZXJUaXRsZVBvc2l0aW9uID0gbnVsbDtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1zdGVwcGVyJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LXN0ZXBwZXInO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICoqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBwdWJsaWMgcm9sZSA9ICd0YWJsaXN0JztcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1zdGVwcGVyLS1ob3Jpem9udGFsJylcbiAgICBwdWJsaWMgZ2V0IGRpcmVjdGlvbkNsYXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gSWd4U3RlcHBlck9yaWVudGF0aW9uLkhvcml6b250YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBzdGVwcGVyJ3MgYWN0aXZlIHN0ZXAgaXMgY2hhbmdpbmcuXG4gICAgICpcbiAgICAgKmBgYGh0bWxcbiAgICAgKiA8aWd4LXN0ZXBwZXIgKGFjdGl2ZVN0ZXBDaGFuZ2luZyk9XCJoYW5kbGVBY3RpdmVTdGVwQ2hhbmdpbmcoJGV2ZW50KVwiPlxuICAgICAqIDwvaWd4LXN0ZXBwZXI+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKmBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlQWN0aXZlU3RlcENoYW5naW5nKGV2ZW50OiBJU3RlcENoYW5naW5nRXZlbnRBcmdzKSB7XG4gICAgICogIGlmIChldmVudC5uZXdJbmRleCA8IGV2ZW50Lm9sZEluZGV4KSB7XG4gICAgICogICAgICBldmVudC5jYW5jZWwgPSB0cnVlO1xuICAgICAqICB9XG4gICAgICogfVxuICAgICAqYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGFjdGl2ZVN0ZXBDaGFuZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SVN0ZXBDaGFuZ2luZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgYWN0aXZlIHN0ZXAgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgXG4gICAgICogPGlneC1zdGVwcGVyIChhY3RpdmVTdGVwQ2hhbmdlZCk9XCJoYW5kbGVBY3RpdmVTdGVwQ2hhbmdlZCgkZXZlbnQpXCI+PC9pZ3gtc3RlcHBlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgYWN0aXZlU3RlcENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElTdGVwQ2hhbmdlZEV2ZW50QXJncz4oKTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4U3RlcEludmFsaWRJbmRpY2F0b3JEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgaW52YWxpZEluZGljYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJZ3hTdGVwSW52YWxpZEluZGljYXRvckRpcmVjdGl2ZT47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkKElneFN0ZXBDb21wbGV0ZWRJbmRpY2F0b3JEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgY29tcGxldGVkSW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPElneFN0ZXBDb21wbGV0ZWRJbmRpY2F0b3JEaXJlY3RpdmU+O1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hTdGVwQWN0aXZlSW5kaWNhdG9yRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGFjdGl2ZUluZGljYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJZ3hTdGVwQWN0aXZlSW5kaWNhdG9yRGlyZWN0aXZlPjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4U3RlcENvbXBvbmVudCwgeyBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwcml2YXRlIF9zdGVwczogUXVlcnlMaXN0PElneFN0ZXBDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBzdGVwcy5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBzdGVwczogSWd4U3RlcENvbXBvbmVudFtdID0gdGhpcy5zdGVwcGVyLnN0ZXBzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc3RlcHMoKTogSWd4U3RlcENvbXBvbmVudFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXBzPy50b0FycmF5KCkgfHwgW107XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB2ZXJ0aWNhbEFuaW1hdGlvblNldHRpbmdzOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncyA9IHtcbiAgICAgICAgb3BlbkFuaW1hdGlvbjogZ3Jvd1ZlckluLFxuICAgICAgICBjbG9zZUFuaW1hdGlvbjogZ3Jvd1Zlck91dCxcbiAgICB9O1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBfZGVmYXVsdFRpdGxlUG9zaXRpb246IElneFN0ZXBwZXJUaXRsZVBvc2l0aW9uID0gSWd4U3RlcHBlclRpdGxlUG9zaXRpb24uQm90dG9tO1xuICAgIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICAgIHByaXZhdGUgX29yaWVudGF0aW9uOiBJZ3hTdGVwcGVyT3JpZW50YXRpb24gPSBJZ3hTdGVwcGVyT3JpZW50YXRpb24uSG9yaXpvbnRhbDtcbiAgICBwcml2YXRlIF92ZXJ0aWNhbEFuaW1hdGlvblR5cGU6IFZlcnRpY2FsQW5pbWF0aW9uVHlwZSA9IFZlcnRpY2FsQW5pbWF0aW9uVHlwZS5Hcm93O1xuICAgIHByaXZhdGUgX2xpbmVhciA9IGZhbHNlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2RlZmF1bHRBbmltYXRpb25EdXJhdGlvbiA9IDM1MDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIGFuaW1CdWlsZGVyOiBBbmltYXRpb25CdWlsZGVyLFxuICAgICAgICBwcml2YXRlIHN0ZXBwZXJTZXJ2aWNlOiBJZ3hTdGVwcGVyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgICAgICBzdXBlcihhbmltQnVpbGRlciwgY2RyKTtcbiAgICAgICAgdGhpcy5zdGVwcGVyU2VydmljZS5zdGVwcGVyID0gdGhpcztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlc1snYW5pbWF0aW9uRHVyYXRpb24nXSkge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbEFuaW1hdGlvblR5cGUgPSB0aGlzLl92ZXJ0aWNhbEFuaW1hdGlvblR5cGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZW50ZXJBbmltYXRpb25Eb25lLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVTdGVwQ2hhbmdlZC5lbWl0KHsgb3duZXI6IHRoaXMsIGluZGV4OiB0aGlzLnN0ZXBwZXJTZXJ2aWNlLmFjdGl2ZVN0ZXAuaW5kZXggfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxlYXZlQW5pbWF0aW9uRG9uZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXBwZXJTZXJ2aWNlLmNvbGxhcHNpbmdTdGVwcy5zaXplID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwcGVyU2VydmljZS5jb2xsYXBzZSh0aGlzLnN0ZXBwZXJTZXJ2aWNlLnByZXZpb3VzQWN0aXZlU3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIEFycmF5LmZyb20odGhpcy5zdGVwcGVyU2VydmljZS5jb2xsYXBzaW5nU3RlcHMpLnNsaWNlKDAsIHRoaXMuc3RlcHBlclNlcnZpY2UuY29sbGFwc2luZ1N0ZXBzLnNpemUgLSAxKVxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChzdGVwID0+IHRoaXMuc3RlcHBlclNlcnZpY2UuY29sbGFwc2Uoc3RlcCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGFjdGl2ZVN0ZXA7XG4gICAgICAgIHRoaXMuc3RlcHMuZm9yRWFjaCgoc3RlcCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RlcEFyaWEoc3RlcCwgaW5kZXgpO1xuICAgICAgICAgICAgaWYgKCFhY3RpdmVTdGVwICYmIHN0ZXAuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlU3RlcCA9IHN0ZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWFjdGl2ZVN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVGaXJzdFN0ZXAodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhhbmRsZVN0ZXBDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRlcyB0aGUgc3RlcCBhdCBhIGdpdmVuIGluZGV4LlxuICAgICAqXG4gICAgICpgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5zdGVwcGVyLm5hdmlnYXRlVG8oMSk7XG4gICAgICpgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgbmF2aWdhdGVUbyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnN0ZXBzW2luZGV4XTtcbiAgICAgICAgaWYgKCFzdGVwIHx8IHRoaXMuc3RlcHBlclNlcnZpY2UuYWN0aXZlU3RlcCA9PT0gc3RlcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWN0aXZhdGVTdGVwKHN0ZXApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRlcyB0aGUgbmV4dCBlbmFibGVkIHN0ZXAuXG4gICAgICpcbiAgICAgKmBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnN0ZXBwZXIubmV4dCgpO1xuICAgICAqYGBgXG4gICAgICovXG4gICAgcHVibGljIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW92ZVRvTmV4dFN0ZXAoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBY3RpdmF0ZXMgdGhlIHByZXZpb3VzIGVuYWJsZWQgc3RlcC5cbiAgICAgKlxuICAgICAqYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc3RlcHBlci5wcmV2KCk7XG4gICAgICpgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJldigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb3ZlVG9OZXh0U3RlcChmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBzdGVwcGVyIHRvIGl0cyBpbml0aWFsIHN0YXRlIGkuZS4gYWN0aXZhdGVzIHRoZSBmaXJzdCBzdGVwLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGUgc3RlcHMnIGNvbnRlbnQgd2lsbCBub3QgYmUgYXV0b21hdGljYWxseSByZXNldC5cbiAgICAgKmBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnN0ZXBwZXIucmVzZXQoKTtcbiAgICAgKmBgYFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGVwcGVyU2VydmljZS52aXNpdGVkU3RlcHMuY2xlYXIoKTtcbiAgICAgICAgY29uc3QgYWN0aXZlU3RlcCA9IHRoaXMuc3RlcHMuZmluZChzID0+ICFzLmRpc2FibGVkKTtcbiAgICAgICAgaWYgKGFjdGl2ZVN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVTdGVwKGFjdGl2ZVN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHBsYXlIb3Jpem9udGFsQW5pbWF0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmV2aW91c0l0ZW0gPSB0aGlzLnN0ZXBwZXJTZXJ2aWNlLnByZXZpb3VzQWN0aXZlU3RlcDtcbiAgICAgICAgdGhpcy5jdXJyZW50SXRlbSA9IHRoaXMuc3RlcHBlclNlcnZpY2UuYWN0aXZlU3RlcDtcbiAgICAgICAgdGhpcy50cmlnZ2VyQW5pbWF0aW9ucygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRQcmV2aW91c0VsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGVwcGVyU2VydmljZS5wcmV2aW91c0FjdGl2ZVN0ZXA/LmNvbnRlbnRDb250YWluZXIubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0Q3VycmVudEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGVwcGVyU2VydmljZS5hY3RpdmVTdGVwLmNvbnRlbnRDb250YWluZXIubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVZlcnRpY2FsQW5pbWF0aW9uU2V0dGluZ3MoXG4gICAgICAgIG9wZW5BbmltYXRpb246IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhLFxuICAgICAgICBjbG9zZUFuaW1hdGlvbjogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEpOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncyB7XG4gICAgICAgIGNvbnN0IGN1c3RvbUNsb3NlQW5pbWF0aW9uID0gdXNlQW5pbWF0aW9uKGNsb3NlQW5pbWF0aW9uLCB7XG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5hbmltYXRpb25EdXJhdGlvbiArICdtcydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGN1c3RvbU9wZW5BbmltYXRpb24gPSB1c2VBbmltYXRpb24ob3BlbkFuaW1hdGlvbiwge1xuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gKyAnbXMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcGVuQW5pbWF0aW9uOiBvcGVuQW5pbWF0aW9uID8gY3VzdG9tT3BlbkFuaW1hdGlvbiA6IG51bGwsXG4gICAgICAgICAgICBjbG9zZUFuaW1hdGlvbjogY2xvc2VBbmltYXRpb24gPyBjdXN0b21DbG9zZUFuaW1hdGlvbiA6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVN0ZXBBcmlhKHN0ZXA6IElneFN0ZXBDb21wb25lbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgc3RlcC5faW5kZXggPSBpbmRleDtcbiAgICAgICAgc3RlcC5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoc3RlcC5uYXRpdmVFbGVtZW50LCAnYXJpYS1zZXRzaXplJywgKHRoaXMuc3RlcHMubGVuZ3RoKS50b1N0cmluZygpKTtcbiAgICAgICAgc3RlcC5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoc3RlcC5uYXRpdmVFbGVtZW50LCAnYXJpYS1wb3NpbnNldCcsIChpbmRleCArIDEpLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlU3RlcENoYW5nZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3N0ZXBzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShzdGVwcyA9PiB7XG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwcy5mb3JFYWNoKChzdGVwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0ZXBBcmlhKHN0ZXAsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGFjdGl2ZSBzdGVwIGlzIHJlbW92ZWRcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNBY3RpdmVTdGVwID0gdGhpcy5zdGVwcy5maW5kKHMgPT4gcyA9PT0gdGhpcy5zdGVwcGVyU2VydmljZS5hY3RpdmVTdGVwKTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0FjdGl2ZVN0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZUZpcnN0U3RlcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBUTyBETzogbWFyayBzdGVwIGFkZGVkIGJlZm9yZSB0aGUgYWN0aXZlIGFzIHZpc2l0ZWQ/XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGluZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcHBlclNlcnZpY2UuY2FsY3VsYXRlTGluZWFyRGlzYWJsZWRTdGVwcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGl2YXRlRmlyc3RTdGVwKGFjdGl2YXRlSW5pdGlhbGx5ID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgZmlyc3RFbmFibGVkU3RlcCA9IHRoaXMuc3RlcHMuZmluZChzID0+ICFzLmRpc2FibGVkKTtcbiAgICAgICAgaWYgKGZpcnN0RW5hYmxlZFN0ZXApIHtcbiAgICAgICAgICAgIGZpcnN0RW5hYmxlZFN0ZXAuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChhY3RpdmF0ZUluaXRpYWxseSkge1xuICAgICAgICAgICAgICAgIGZpcnN0RW5hYmxlZFN0ZXAuYWN0aXZlQ2hhbmdlLmVtaXQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVTdGVwQ2hhbmdlZC5lbWl0KHsgb3duZXI6IHRoaXMsIGluZGV4OiBmaXJzdEVuYWJsZWRTdGVwLmluZGV4IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhY3RpdmF0ZVN0ZXAoc3RlcDogSWd4U3RlcENvbXBvbmVudCkge1xuICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gSWd4U3RlcHBlck9yaWVudGF0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgIHN0ZXAuY2hhbmdlSG9yaXpvbnRhbEFjdGl2ZVN0ZXAoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcHBlclNlcnZpY2UuZXhwYW5kKHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3ZlVG9OZXh0U3RlcChuZXh0ID0gdHJ1ZSkge1xuICAgICAgICBsZXQgc3RlcHM6IElneFN0ZXBDb21wb25lbnRbXSA9IHRoaXMuc3RlcHM7XG4gICAgICAgIGxldCBhY3RpdmVTdGVwSW5kZXggPSB0aGlzLnN0ZXBwZXJTZXJ2aWNlLmFjdGl2ZVN0ZXAuaW5kZXg7XG4gICAgICAgIGlmICghbmV4dCkge1xuICAgICAgICAgICAgc3RlcHMgPSB0aGlzLnN0ZXBzLnJldmVyc2UoKTtcbiAgICAgICAgICAgIGFjdGl2ZVN0ZXBJbmRleCA9IHN0ZXBzLmZpbmRJbmRleChzID0+IHMgPT09IHRoaXMuc3RlcHBlclNlcnZpY2UuYWN0aXZlU3RlcCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0U3RlcCA9IHN0ZXBzLmZpbmQoKHMsIGkpID0+IGkgPiBhY3RpdmVTdGVwSW5kZXggJiYgcy5pc0FjY2Vzc2libGUpO1xuICAgICAgICBpZiAobmV4dFN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGVTdGVwKG5leHRTdGVwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgSWd4UmlwcGxlTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4U3RlcENvbXBvbmVudCxcbiAgICAgICAgSWd4U3RlcHBlckNvbXBvbmVudCxcbiAgICAgICAgSWd4U3RlcFRpdGxlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwU3ViVGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneFN0ZXBJbmRpY2F0b3JEaXJlY3RpdmUsXG4gICAgICAgIElneFN0ZXBDb250ZW50RGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwQWN0aXZlSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwQ29tcGxldGVkSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwSW52YWxpZEluZGljYXRvckRpcmVjdGl2ZSxcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4U3RlcENvbXBvbmVudCxcbiAgICAgICAgSWd4U3RlcHBlckNvbXBvbmVudCxcbiAgICAgICAgSWd4U3RlcFRpdGxlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwU3ViVGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneFN0ZXBJbmRpY2F0b3JEaXJlY3RpdmUsXG4gICAgICAgIElneFN0ZXBDb250ZW50RGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwQWN0aXZlSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwQ29tcGxldGVkSW5kaWNhdG9yRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTdGVwSW52YWxpZEluZGljYXRvckRpcmVjdGl2ZSxcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneFN0ZXBwZXJNb2R1bGUgeyB9XG4iLCI8ZGl2ICpuZ0lmPVwiIWNvbnRlbnRUb3AgfHwgb3JpZW50YXRpb24gIT09ICdob3Jpem9udGFsJ1wiIGNsYXNzPVwiaWd4LXN0ZXBwZXJfX2hlYWRlclwiPlxuICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cInN0ZXBUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG48L2Rpdj5cblxuPGRpdiAqbmdJZj1cIm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCdcIiBjbGFzcz1cImlneC1zdGVwcGVyX19ib2R5XCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgc3RlcCBvZiBzdGVwc1wiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic3RlcC5jb250ZW50VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG48ZGl2ICpuZ0lmPVwiY29udGVudFRvcCAmJiBvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnXCIgY2xhc3M9XCJpZ3gtc3RlcHBlcl9faGVhZGVyXCI+XG4gICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwic3RlcFRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI3N0ZXBUZW1wbGF0ZT5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtc3RlcFwiPjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG4iXX0=