import { AnimationBuilder } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, Renderer2, TemplateRef } from '@angular/core';
import { Direction, IgxSlideComponentBase } from '../../carousel/carousel-base';
import { PlatformUtil } from '../../core/utils';
import { ToggleAnimationPlayer, ToggleAnimationSettings } from '../../expansion-panel/toggle-animation-component';
import { IgxDirectionality } from '../../services/direction/directionality';
import { IgxStep, IgxStepper } from '../stepper.common';
import { IgxStepContentDirective, IgxStepIndicatorDirective } from '../stepper.directive';
import { IgxStepperService } from '../stepper.service';
import * as i0 from "@angular/core";
/**
 * The IgxStepComponent is used within the `igx-stepper` element and it holds the content of each step.
 * It also supports custom indicators, title and subtitle.
 *
 * @igxModule IgxStepperModule
 *
 * @igxKeywords step
 *
 * @example
 * ```html
 *  <igx-stepper>
 *  ...
 *    <igx-step [active]="true" [completed]="true">
 *      ...
 *    </igx-step>
 *  ...
 *  </igx-stepper>
 * ```
 */
export declare class IgxStepComponent extends ToggleAnimationPlayer implements IgxStep, AfterViewInit, OnDestroy, IgxSlideComponentBase {
    stepper: IgxStepper;
    cdr: ChangeDetectorRef;
    renderer: Renderer2;
    protected platform: PlatformUtil;
    protected stepperService: IgxStepperService;
    protected builder: AnimationBuilder;
    private element;
    private dir;
    /**
     * Get/Set the `id` of the step component.
     * Default value is `"igx-step-0"`;
     * ```html
     * <igx-step id="my-first-step"></igx-step>
     * ```
     * ```typescript
     * const stepId = this.step.id;
     * ```
     */
    id: string;
    /**
     * Get/Set whether the step is interactable.
     *
     * ```html
     * <igx-stepper>
     * ...
     *     <igx-step [disabled]="true"></igx-step>
     * ...
     * </igx-stepper>
     * ```
     *
     * ```typescript
     * this.stepper.steps[1].disabled = true;
     * ```
     */
    set disabled(value: boolean);
    get disabled(): boolean;
    /**
     * Get/Set whether the step is completed.
     *
     * @remarks
     * When set to `true` the following separator is styled `solid`.
     *
     * ```html
     * <igx-stepper>
     * ...
     *     <igx-step [completed]="true"></igx-step>
     * ...
     * </igx-stepper>
     * ```
     *
     * ```typescript
     * this.stepper.steps[1].completed = true;
     * ```
     */
    completed: boolean;
    /**
     * Get/Set whether the step is valid.
     *```html
     * <igx-step [isValid]="form.form.valid">
     *      ...
     *      <div igxStepContent>
     *          <form #form="ngForm">
     *              ...
     *          </form>
     *      </div>
     * </igx-step>
     * ```
     */
    get isValid(): boolean;
    set isValid(value: boolean);
    /**
     * Get/Set whether the step is optional.
     *
     * @remarks
     * Optional steps validity does not affect the default behavior when the stepper is in linear mode i.e.
     * if optional step is invalid the user could still move to the next step.
     *
     * ```html
     * <igx-step [optional]="true"></igx-step>
     * ```
     * ```typescript
     * this.stepper.steps[1].optional = true;
     * ```
     */
    optional: boolean;
    /**
     * Get/Set the active state of the step
     *
     * ```html
     * <igx-step [active]="true"></igx-step>
     * ```
     *
     * ```typescript
     * this.stepper.steps[1].active = true;
     * ```
     *
     * @param value: boolean
     */
    set active(value: boolean);
    get active(): boolean;
    /** @hidden @internal */
    set tabIndex(value: number);
    get tabIndex(): number;
    /** @hidden @internal **/
    role: string;
    /** @hidden @internal */
    get contentId(): string;
    /** @hidden @internal */
    cssClass: boolean;
    /** @hidden @internal */
    get generalDisabled(): boolean;
    /** @hidden @internal */
    get titlePositionTop(): string;
    /**
     * Emitted when the step's `active` property changes. Can be used for two-way binding.
     *
     * ```html
     * <igx-step [(active)]="this.isActive">
     * </igx-step>
     * ```
     *
     * ```typescript
     * const step: IgxStepComponent = this.stepper.step[0];
     * step.activeChange.subscribe((e: boolean) => console.log("Step active state change to ", e))
     * ```
     */
    activeChange: EventEmitter<boolean>;
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
    /**
     * Get the step index inside of the stepper.
     *
     * ```typescript
     * const step = this.stepper.steps[1];
     * const stepIndex: number = step.index;
     * ```
     */
    get index(): number;
    /** @hidden @internal */
    get indicatorTemplate(): TemplateRef<any>;
    /** @hidden @internal */
    get direction(): Direction;
    /** @hidden @internal */
    get isAccessible(): boolean;
    /** @hidden @internal */
    get isHorizontal(): boolean;
    /** @hidden @internal */
    get isTitleVisible(): boolean;
    /** @hidden @internal */
    get isIndicatorVisible(): boolean;
    /** @hidden @internal */
    get titlePosition(): string;
    /** @hidden @internal */
    get linearDisabled(): boolean;
    /** @hidden @internal */
    get collapsing(): boolean;
    /** @hidden @internal */
    get animationSettings(): ToggleAnimationSettings;
    /** @hidden @internal */
    get contentClasses(): any;
    /** @hidden @internal */
    get stepHeaderClasses(): any;
    /** @hidden @internal */
    get nativeElement(): HTMLElement;
    /** @hidden @internal */
    previous: boolean;
    /** @hidden @internal */
    _index: number;
    private _tabIndex;
    private _valid;
    private _focused;
    private _disabled;
    constructor(stepper: IgxStepper, cdr: ChangeDetectorRef, renderer: Renderer2, platform: PlatformUtil, stepperService: IgxStepperService, builder: AnimationBuilder, element: ElementRef<HTMLElement>, dir: IgxDirectionality);
    /** @hidden @internal */
    onFocus(): void;
    /** @hidden @internal */
    onBlur(): void;
    /** @hidden @internal */
    handleKeydown(event: KeyboardEvent): void;
    /** @hidden @internal */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /** @hidden @internal */
    onPointerDown(event: MouseEvent): void;
    /** @hidden @internal */
    handleNavigation(key: string): void;
    /** @hidden @internal */
    changeHorizontalActiveStep(): void;
    private get nextStep();
    private get previousStep();
    private changeVerticalActiveStep;
    static ??fac: i0.????FactoryDeclaration<IgxStepComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxStepComponent, "igx-step", never, { "id": "id"; "disabled": "disabled"; "completed": "completed"; "isValid": "isValid"; "optional": "optional"; "active": "active"; "tabIndex": "tabIndex"; }, { "activeChange": "activeChange"; }, ["indicator", "content"], ["[igxStepTitle]", "[igxStepSubTitle]", "[igxStepContent]", "[igxStepIndicator]"]>;
}
