import { ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, TemplateRef } from '@angular/core';
import { IBaseCancelableBrowserEventArgs, IBaseEventArgs } from '../core/utils';
import { IgxStepperComponent } from './stepper.component';
import { IgxStepComponent } from './step/step.component';
import { IgxStepActiveIndicatorDirective, IgxStepCompletedIndicatorDirective, IgxStepContentDirective, IgxStepIndicatorDirective, IgxStepInvalidIndicatorDirective } from './stepper.directive';
import { Direction, HorizontalAnimationType, IgxCarouselComponentBase } from '../carousel/carousel-base';
import { ToggleAnimationPlayer, ToggleAnimationSettings } from '../expansion-panel/toggle-animation-component';
export interface IgxStepper extends IgxCarouselComponentBase {
    steps: IgxStepComponent[];
    /** @hidden @internal */
    nativeElement: HTMLElement;
    /** @hidden @internal */
    invalidIndicatorTemplate: TemplateRef<IgxStepInvalidIndicatorDirective>;
    /** @hidden @internal */
    completedIndicatorTemplate: TemplateRef<IgxStepCompletedIndicatorDirective>;
    /** @hidden @internal */
    activeIndicatorTemplate: TemplateRef<IgxStepActiveIndicatorDirective>;
    verticalAnimationType: VerticalAnimationType;
    horizontalAnimationType: HorizontalAnimationType;
    animationDuration: number;
    linear: boolean;
    orientation: IgxStepperOrientation;
    stepType: IgxStepType;
    contentTop: boolean;
    titlePosition: IgxStepperTitlePosition;
    /** @hidden @internal */
    verticalAnimationSettings: ToggleAnimationSettings;
    /** @hidden @internal */
    _defaultTitlePosition: IgxStepperTitlePosition;
    activeStepChanging: EventEmitter<IStepChangingEventArgs>;
    activeStepChanged: EventEmitter<IStepChangedEventArgs>;
    navigateTo(index: number): void;
    next(): void;
    prev(): void;
    reset(): void;
    /** @hidden @internal */
    playHorizontalAnimations(): void;
}
export interface IgxStep extends ToggleAnimationPlayer {
    id: string;
    /** @hidden @internal */
    contentTemplate: TemplateRef<any>;
    /** @hidden @internal */
    customIndicatorTemplate: TemplateRef<any>;
    /** @hidden @internal */
    contentContainer: ElementRef;
    /** @hidden @internal */
    indicator: IgxStepIndicatorDirective;
    /** @hidden @internal */
    content: IgxStepContentDirective;
    /** @hidden @internal */
    indicatorTemplate: TemplateRef<any>;
    index: number;
    disabled: boolean;
    completed: boolean;
    isValid: boolean;
    optional: boolean;
    active: boolean;
    tabIndex: number;
    /** @hidden @internal */
    contentId: string;
    /** @hidden @internal */
    generalDisabled: boolean;
    /** @hidden @internal */
    titlePositionTop: string;
    /** @hidden @internal */
    direction: Direction;
    /** @hidden @internal */
    isAccessible: boolean;
    /** @hidden @internal */
    isHorizontal: boolean;
    /** @hidden @internal */
    isTitleVisible: boolean;
    /** @hidden @internal */
    isIndicatorVisible: boolean;
    /** @hidden @internal */
    titlePosition: string;
    /** @hidden @internal */
    linearDisabled: boolean;
    /** @hidden @internal */
    collapsing: boolean;
    /** @hidden @internal */
    animationSettings: ToggleAnimationSettings;
    /** @hidden @internal */
    contentClasses: any;
    /** @hidden @internal */
    stepHeaderClasses: any;
    /** @hidden @internal */
    nativeElement: HTMLElement;
    /** @hidden @internal */
    previous: boolean;
    cdr: ChangeDetectorRef;
    activeChange: EventEmitter<boolean>;
}
export interface IStepChangingEventArgs extends IBaseEventArgs, IBaseCancelableBrowserEventArgs {
    newIndex: number;
    oldIndex: number;
    owner: IgxStepper;
}
export interface IStepChangedEventArgs extends IBaseEventArgs {
    index: number;
    owner: IgxStepper;
}
export declare const IgxStepperOrientation: {
    readonly Horizontal: "horizontal";
    readonly Vertical: "vertical";
};
export declare type IgxStepperOrientation = (typeof IgxStepperOrientation)[keyof typeof IgxStepperOrientation];
export declare const IgxStepType: {
    readonly Indicator: "indicator";
    readonly Title: "title";
    readonly Full: "full";
};
export declare type IgxStepType = (typeof IgxStepType)[keyof typeof IgxStepType];
export declare const IgxStepperTitlePosition: {
    readonly Bottom: "bottom";
    readonly Top: "top";
    readonly End: "end";
    readonly Start: "start";
};
export declare type IgxStepperTitlePosition = (typeof IgxStepperTitlePosition)[keyof typeof IgxStepperTitlePosition];
export declare const VerticalAnimationType: {
    readonly Grow: "grow";
    readonly Fade: "fade";
    readonly None: "none";
};
export declare type VerticalAnimationType = (typeof VerticalAnimationType)[keyof typeof VerticalAnimationType];
export declare const IGX_STEPPER_COMPONENT: InjectionToken<IgxStepperComponent>;
export declare const IGX_STEP_COMPONENT: InjectionToken<IgxStepComponent>;
