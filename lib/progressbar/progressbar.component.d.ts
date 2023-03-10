import { EventEmitter, Renderer2, AfterViewInit, AfterContentInit } from '@angular/core';
import { IgxProcessBarTextTemplateDirective, IgxProgressBarGradientDirective } from './progressbar.common';
import { IBaseEventArgs } from '../core/utils';
import { IgxDirectionality } from '../services/direction/directionality';
import * as i0 from "@angular/core";
import * as i1 from "./progressbar.common";
import * as i2 from "@angular/common";
export declare const IgxTextAlign: {
    START: "start";
    CENTER: "center";
    END: "end";
};
export declare type IgxTextAlign = (typeof IgxTextAlign)[keyof typeof IgxTextAlign];
export declare const IgxProgressType: {
    ERROR: "error";
    INFO: "info";
    WARNING: "warning";
    SUCCESS: "success";
};
export declare type IgxProgressType = (typeof IgxProgressType)[keyof typeof IgxProgressType];
export interface IChangeProgressEventArgs extends IBaseEventArgs {
    previousValue: number;
    currentValue: number;
}
/**
 * @hidden
 */
export declare abstract class BaseProgressDirective {
    /**
     * An event, which is triggered after a progress is changed.
     * ```typescript
     * public progressChange(event) {
     *     alert("Progress made!");
     * }
     *  //...
     * ```
     * ```html
     * <igx-circular-bar [value]="currentValue" (progressChanged)="progressChange($event)"></igx-circular-bar>
     * <igx-linear-bar [value]="currentValue" (progressChanged)="progressChange($event)"></igx-linear-bar>
     * ```
     */
    progressChanged: EventEmitter<IChangeProgressEventArgs>;
    /**
     * Sets/Gets progressbar in indeterminate. By default it is set to false.
     * ```html
     * <igx-linear-bar [indeterminate]="true"></igx-linear-bar>
     * <igx-circular-bar [indeterminate]="true"></igx-circular-bar>
     * ```
     */
    indeterminate: boolean;
    /**
     * Sets/Gets progressbar animation duration. By default it is 2000ms.
     * ```html
     * <igx-linear-bar [indeterminate]="true"></igx-linear-bar>
     * ```
     */
    animationDuration: number;
    _interval: any;
    protected _initValue: number;
    protected _contentInit: boolean;
    protected _max: number;
    protected _value: number;
    protected _newVal: number;
    protected _animate: boolean;
    protected _step: any;
    protected _animation: any;
    protected _valueInPercent: any;
    protected _internalState: {
        oldVal: number;
        newVal: number;
    };
    constructor();
    /**
     * Returns the value which update the progress indicator of the `progress bar`.
     * ```typescript
     * @ViewChild("MyProgressBar")
     * public progressBar: IgxLinearProgressBarComponent | IgxCircularBarComponent;
     * public stepValue(event) {
     *     let step = this.progressBar.step;
     *     alert(step);
     * }
     * ```
     */
    get step(): number;
    /**
     * Sets the value by which progress indicator is updated. By default it is 1.
     * ```html
     * <igx-linear-bar [max]="200" [value]="0" [step]="1"></igx-linear-bar>
     * <igx-circular-bar [max]="200" [value]="0" [step]="1"></igx-circular-bar>
     * ```
     */
    set step(val: number);
    /**
     * Animating the progress. By default it is set to true.
     * ```html
     * <igx-linear-bar [animate]="false" [max]="200" [value]="50"></igx-linear-bar>
     * <igx-circular-bar [animate]="false" [max]="200" [value]="50"></igx-circular-bar>
     * ```
     */
    set animate(animate: boolean);
    /**
     * Returns whether the `progress bar` has animation true/false.
     * ```typescript
     * @ViewChild("MyProgressBar")
     * public progressBar: IgxLinearProgressBarComponent | IgxCircularBarComponent;
     * public animationStatus(event) {
     *     let animationStatus = this.progressBar.animate;
     *     alert(animationStatus);
     * }
     * ```
     */
    get animate(): boolean;
    /**
     * Set maximum value that can be passed. By default it is set to 100.
     * ```html
     * <igx-linear-bar [max]="200" [value]="0"></igx-linear-bar>
     * <igx-circular-bar [max]="200" [value]="0"></igx-circular-bar>
     * ```
     */
    set max(maxNum: number);
    /**
     * Returns the the maximum progress value of the `progress bar`.
     * ```typescript
     * @ViewChild("MyProgressBar")
     * public progressBar: IgxLinearProgressBarComponent | IgxCircularBarComponent;
     * public maxValue(event) {
     *     let max = this.progressBar.max;
     *     alert(max);
     * }
     * ```
     */
    get max(): number;
    /**
     * Returns the `IgxLinearProgressBarComponent`/`IgxCircularProgressBarComponent` value in percentage.
     * ```typescript
     * @ViewChild("MyProgressBar")
     * public progressBar: IgxLinearProgressBarComponent; // IgxCircularProgressBarComponent
     * public valuePercent(event){
     *     let percentValue = this.progressBar.valueInPercent;
     *     alert(percentValue);
     * }
     * ```
     */
    get valueInPercent(): number;
    /**
     * Returns value that indicates the current `IgxLinearProgressBarComponent` position.
     * ```typescript
     * @ViewChild("MyProgressBar")
     * public progressBar: IgxLinearProgressBarComponent;
     * public getValue(event) {
     *     let value = this.progressBar.value;
     *     alert(value);
     * }
     * ```
     */
    get value(): number;
    /**
     * Set value that indicates the current `IgxLinearProgressBarComponent` position.
     * ```html
     * <igx-linear-bar [striped]="false" [max]="200" [value]="50"></igx-linear-bar>
     * ```
     */
    set value(val: number);
    protected triggerProgressTransition(oldVal: any, newVal: any, maxUpdate?: boolean): void;
    /**
     * @hidden
     */
    protected increase(newValue: number, step: number): void;
    /**
     * @hidden
     */
    protected directionFlow(currentValue: number, prevValue: number): number;
    protected abstract runAnimation(value: number): any;
    /**
     * @hidden
     * @param step
     */
    private updateProgress;
    static ??fac: i0.????FactoryDeclaration<BaseProgressDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<BaseProgressDirective, never, never, { "indeterminate": "indeterminate"; "animationDuration": "animationDuration"; "step": "step"; "animate": "animate"; "max": "max"; "value": "value"; }, { "progressChanged": "progressChanged"; }, never>;
}
export declare class IgxLinearProgressBarComponent extends BaseProgressDirective implements AfterContentInit {
    valueMin: number;
    cssClass: string;
    /**
     * Set `IgxLinearProgressBarComponent` to have striped style. By default it is set to false.
     * ```html
     * <igx-linear-bar [striped]="true" [max]="200" [value]="50"></igx-linear-bar>
     * ```
     */
    striped: boolean;
    /**
     * @hidden
     * ```
     */
    get isIndeterminate(): boolean;
    /**
     * An @Input property that sets the value of the `role` attribute. If not provided it will be automatically set to `progressbar`.
     * ```html
     * <igx-linear-bar role="progressbar"></igx-linear-bar>
     * ```
     */
    role: string;
    /**
     * An @Input property that sets the value of `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-linear-bar [id]="'igx-linear-bar-55'" [striped]="true" [max]="200" [value]="50"></igx-linear-bar>
     * ```
     */
    id: string;
    /**
     * Set the position that defines where the text is aligned.
     * Possible options - `IgxTextAlign.START` (default), `IgxTextAlign.CENTER`, `IgxTextAlign.END`.
     * ```typescript
     * public positionCenter: IgxTextAlign;
     * public ngOnInit() {
     *     this.positionCenter = IgxTextAlign.CENTER;
     * }
     *  //...
     * ```
     *  ```html
     * <igx-linear-bar type="warning" [text]="'Custom text'" [textAlign]="positionCenter" [striped]="true"></igx-linear-bar>
     * ```
     */
    textAlign: IgxTextAlign;
    /**
     * Set the text to be visible. By default it is set to true.
     * ```html
     *  <igx-linear-bar type="default" [textVisibility]="false"></igx-linear-bar>
     * ```
     */
    textVisibility: boolean;
    /**
     * Set the position that defines if the text should be aligned above the progress line. By default is set to false.
     * ```html
     *  <igx-linear-bar type="error" [textTop]="true"></igx-linear-bar>
     * ```
     */
    textTop: boolean;
    /**
     * Set a custom text that is displayed according to the defined position.
     *  ```html
     * <igx-linear-bar type="warning" [text]="'Custom text'" [textAlign]="positionCenter" [striped]="true"></igx-linear-bar>
     * ```
     */
    text: string;
    /**
     * Set type of the `IgxLinearProgressBarComponent`. Possible options - `default`, `success`, `info`, `warning`, and `error`.
     * ```html
     * <igx-linear-bar [striped]="false" [max]="100" [value]="0" type="error"></igx-linear-bar>
     * ```
     */
    type: string;
    private _progressIndicator;
    private animationState;
    /**
     * @hidden
     */
    get error(): boolean;
    /**
     * @hidden
     */
    get info(): boolean;
    /**
     * @hidden
     */
    get warning(): boolean;
    /**
     * @hidden
     */
    get success(): boolean;
    ngAfterContentInit(): void;
    runAnimation(value: number): void;
    static ??fac: i0.????FactoryDeclaration<IgxLinearProgressBarComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxLinearProgressBarComponent, "igx-linear-bar", never, { "striped": "striped"; "role": "role"; "id": "id"; "textAlign": "textAlign"; "textVisibility": "textVisibility"; "textTop": "textTop"; "text": "text"; "type": "type"; }, {}, never, never>;
}
export declare class IgxCircularProgressBarComponent extends BaseProgressDirective implements AfterViewInit, AfterContentInit {
    private renderer;
    private _directionality;
    /** @hidden */
    cssClass: string;
    /**
     * An @Input property that sets the value of `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-circular-bar [id]="'igx-circular-bar-55'" [value]="50"></igx-circular-bar>
     * ```
     */
    id: string;
    /**
     * @hidden
     */
    get isIndeterminate(): boolean;
    /**
     * Sets the text visibility. By default it is set to true.
     * ```html
     * <igx-circular-bar [textVisibility]="false"></igx-circular-bar>
     * ```
     */
    textVisibility: boolean;
    /**
     * Sets/gets the text to be displayed inside the `igxCircularBar`.
     * ```html
     * <igx-circular-bar text="Progress"></igx-circular-bar>
     * ```
     * ```typescript
     * let text = this.circularBar.text;
     * ```
     */
    text: string;
    textTemplate: IgxProcessBarTextTemplateDirective;
    gradientTemplate: IgxProgressBarGradientDirective;
    private _svgCircle;
    /**
     * @hidden
     */
    gradientId: string;
    /**
     * @hidden
     */
    get context(): any;
    private _circleRadius;
    private _circumference;
    private readonly STROKE_OPACITY_DVIDER;
    private readonly STROKE_OPACITY_ADDITION;
    private animationState;
    constructor(renderer: Renderer2, _directionality: IgxDirectionality);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    get textContent(): string;
    runAnimation(value: number): void;
    private getProgress;
    static ??fac: i0.????FactoryDeclaration<IgxCircularProgressBarComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxCircularProgressBarComponent, "igx-circular-bar", never, { "id": "id"; "isIndeterminate": "isIndeterminate"; "textVisibility": "textVisibility"; "text": "text"; }, {}, ["textTemplate", "gradientTemplate"], never>;
}
export declare const valueInRange: (value: number, max: number, min?: number) => number;
export declare const toPercent: (value: number, max: number) => number;
export declare const toValue: (value: number, max: number) => number;
/**
 * @hidden
 */
export declare class IgxProgressBarModule {
    static ??fac: i0.????FactoryDeclaration<IgxProgressBarModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxProgressBarModule, [typeof IgxLinearProgressBarComponent, typeof IgxCircularProgressBarComponent, typeof i1.IgxProcessBarTextTemplateDirective, typeof i1.IgxProgressBarGradientDirective], [typeof i2.CommonModule], [typeof IgxLinearProgressBarComponent, typeof IgxCircularProgressBarComponent, typeof i1.IgxProcessBarTextTemplateDirective, typeof i1.IgxProgressBarGradientDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxProgressBarModule>;
}
