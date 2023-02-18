import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, NgModule, Output, ViewChild, ContentChild, Directive } from '@angular/core';
import { IgxProcessBarTextTemplateDirective, IgxProgressBarGradientDirective, } from './progressbar.common';
import { mkenum } from '../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../services/direction/directionality";
const ONE_PERCENT = 0.01;
const MIN_VALUE = 0;
export const IgxTextAlign = mkenum({
    START: 'start',
    CENTER: 'center',
    END: 'end'
});
export const IgxProgressType = mkenum({
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
    SUCCESS: 'success'
});
/**
 * @hidden
 */
export class BaseProgressDirective {
    constructor() {
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
        this.progressChanged = new EventEmitter();
        /**
         * Sets/Gets progressbar in indeterminate. By default it is set to false.
         * ```html
         * <igx-linear-bar [indeterminate]="true"></igx-linear-bar>
         * <igx-circular-bar [indeterminate]="true"></igx-circular-bar>
         * ```
         */
        this.indeterminate = false;
        /**
         * Sets/Gets progressbar animation duration. By default it is 2000ms.
         * ```html
         * <igx-linear-bar [indeterminate]="true"></igx-linear-bar>
         * ```
         */
        this.animationDuration = 2000;
        this._initValue = 0;
        this._contentInit = false;
        this._max = 100;
        this._value = MIN_VALUE;
        this._newVal = MIN_VALUE;
        this._animate = true;
        this._internalState = {
            oldVal: 0,
            newVal: 0
        };
    }
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
    get step() {
        if (this._step) {
            return this._step;
        }
        return this._max * ONE_PERCENT;
    }
    /**
     * Sets the value by which progress indicator is updated. By default it is 1.
     * ```html
     * <igx-linear-bar [max]="200" [value]="0" [step]="1"></igx-linear-bar>
     * <igx-circular-bar [max]="200" [value]="0" [step]="1"></igx-circular-bar>
     * ```
     */
    set step(val) {
        const step = Number(val);
        if (step > this.max) {
            return;
        }
        this._step = step;
    }
    /**
     * Animating the progress. By default it is set to true.
     * ```html
     * <igx-linear-bar [animate]="false" [max]="200" [value]="50"></igx-linear-bar>
     * <igx-circular-bar [animate]="false" [max]="200" [value]="50"></igx-circular-bar>
     * ```
     */
    set animate(animate) {
        this._animate = animate;
        if (animate) {
            this.animationDuration = 2000;
        }
        else {
            this.animationDuration = 0;
        }
    }
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
    get animate() {
        return this._animate;
    }
    /**
     * Set maximum value that can be passed. By default it is set to 100.
     * ```html
     * <igx-linear-bar [max]="200" [value]="0"></igx-linear-bar>
     * <igx-circular-bar [max]="200" [value]="0"></igx-circular-bar>
     * ```
     */
    set max(maxNum) {
        if (maxNum < MIN_VALUE || this._max === maxNum ||
            (this._animation && this._animation.playState !== 'finished')) {
            return;
        }
        this._internalState.newVal = Math.round(toValue(toPercent(this.value, maxNum), maxNum));
        this._value = this._internalState.oldVal = Math.round(toValue(this.valueInPercent, maxNum));
        this._max = maxNum;
        this.triggerProgressTransition(this._internalState.oldVal, this._internalState.newVal, true);
    }
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
    get max() {
        return this._max;
    }
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
    get valueInPercent() {
        const val = toPercent(this._value, this._max);
        return val;
    }
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
    get value() {
        return this._value;
    }
    /**
     * Set value that indicates the current `IgxLinearProgressBarComponent` position.
     * ```html
     * <igx-linear-bar [striped]="false" [max]="200" [value]="50"></igx-linear-bar>
     * ```
     */
    set value(val) {
        if (this._animation && this._animation.playState !== 'finished' || val < 0) {
            return;
        }
        const valInRange = valueInRange(val, this.max);
        if (isNaN(valInRange) || this._value === val || this.indeterminate) {
            return;
        }
        if (this._contentInit) {
            this.triggerProgressTransition(this._value, valInRange);
        }
        else {
            this._initValue = valInRange;
        }
    }
    triggerProgressTransition(oldVal, newVal, maxUpdate = false) {
        if (oldVal === newVal) {
            return;
        }
        const changedValues = {
            currentValue: newVal,
            previousValue: oldVal
        };
        const stepDirection = this.directionFlow(oldVal, newVal);
        if (this._animate) {
            const newToPercent = toPercent(newVal, this.max);
            const oldToPercent = toPercent(oldVal, this.max);
            const duration = this.animationDuration / Math.abs(newToPercent - oldToPercent) / (this._step ? this._step : 1);
            this.runAnimation(newVal);
            this._interval = setInterval(() => this.increase(newVal, stepDirection), duration);
        }
        else {
            this.updateProgress(newVal);
        }
        if (maxUpdate) {
            return;
        }
        this.progressChanged.emit(changedValues);
    }
    /**
     * @hidden
     */
    increase(newValue, step) {
        const targetValue = toPercent(newValue, this._max);
        this._value = valueInRange(this._value, this._max) + step;
        if ((step > 0 && this.valueInPercent >= targetValue) || (step < 0 && this.valueInPercent <= targetValue)) {
            if (this._value !== newValue) {
                this._value = newValue;
            }
            return clearInterval(this._interval);
        }
    }
    /**
     * @hidden
     */
    directionFlow(currentValue, prevValue) {
        return currentValue < prevValue ? this.step : -this.step;
    }
    /**
     * @hidden
     * @param step
     */
    updateProgress(val) {
        this._value = valueInRange(val, this._max);
        // this.valueInPercent = toPercent(val, this._max);
        this.runAnimation(val);
    }
}
BaseProgressDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: BaseProgressDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
BaseProgressDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: BaseProgressDirective, inputs: { indeterminate: "indeterminate", animationDuration: "animationDuration", step: "step", animate: "animate", max: "max", value: "value" }, outputs: { progressChanged: "progressChanged" }, host: { properties: { "attr.aria-valuemax": "this.max", "attr.aria-valuenow": "this.value" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: BaseProgressDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return []; }, propDecorators: { progressChanged: [{
                type: Output
            }], indeterminate: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }], step: [{
                type: Input
            }], animate: [{
                type: Input
            }], max: [{
                type: HostBinding,
                args: ['attr.aria-valuemax']
            }, {
                type: Input
            }], value: [{
                type: HostBinding,
                args: ['attr.aria-valuenow']
            }, {
                type: Input
            }] } });
let NEXT_LINEAR_ID = 0;
let NEXT_CIRCULAR_ID = 0;
let NEXT_GRADIENT_ID = 0;
export class IgxLinearProgressBarComponent extends BaseProgressDirective {
    constructor() {
        super(...arguments);
        this.valueMin = 0;
        this.cssClass = 'igx-linear-bar';
        /**
         * Set `IgxLinearProgressBarComponent` to have striped style. By default it is set to false.
         * ```html
         * <igx-linear-bar [striped]="true" [max]="200" [value]="50"></igx-linear-bar>
         * ```
         */
        this.striped = false;
        /**
         * An @Input property that sets the value of the `role` attribute. If not provided it will be automatically set to `progressbar`.
         * ```html
         * <igx-linear-bar role="progressbar"></igx-linear-bar>
         * ```
         */
        this.role = 'progressbar';
        /**
         * An @Input property that sets the value of `id` attribute. If not provided it will be automatically generated.
         * ```html
         * <igx-linear-bar [id]="'igx-linear-bar-55'" [striped]="true" [max]="200" [value]="50"></igx-linear-bar>
         * ```
         */
        this.id = `igx-linear-bar-${NEXT_LINEAR_ID++}`;
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
        this.textAlign = IgxTextAlign.START;
        /**
         * Set the text to be visible. By default it is set to true.
         * ```html
         *  <igx-linear-bar type="default" [textVisibility]="false"></igx-linear-bar>
         * ```
         */
        this.textVisibility = true;
        /**
         * Set the position that defines if the text should be aligned above the progress line. By default is set to false.
         * ```html
         *  <igx-linear-bar type="error" [textTop]="true"></igx-linear-bar>
         * ```
         */
        this.textTop = false;
        /**
         * Set type of the `IgxLinearProgressBarComponent`. Possible options - `default`, `success`, `info`, `warning`, and `error`.
         * ```html
         * <igx-linear-bar [striped]="false" [max]="100" [value]="0" type="error"></igx-linear-bar>
         * ```
         */
        this.type = 'default';
        this.animationState = {
            width: '0%'
        };
    }
    /**
     * @hidden
     * ```
     */
    get isIndeterminate() {
        return this.indeterminate;
    }
    /**
     * @hidden
     */
    get error() {
        return this.type === IgxProgressType.ERROR;
    }
    /**
     * @hidden
     */
    get info() {
        return this.type === IgxProgressType.INFO;
    }
    /**
     * @hidden
     */
    get warning() {
        return this.type === IgxProgressType.WARNING;
    }
    /**
     * @hidden
     */
    get success() {
        return this.type === IgxProgressType.SUCCESS;
    }
    ngAfterContentInit() {
        this.triggerProgressTransition(MIN_VALUE, this._initValue);
        this._contentInit = true;
    }
    runAnimation(value) {
        if (this._animation && this._animation.playState !== 'finished') {
            return;
        }
        const valueInPercent = this.max <= 0 ? 0 : toPercent(value, this.max);
        const FRAMES = [];
        FRAMES[0] = {
            ...this.animationState
        };
        this.animationState.width = valueInPercent + '%';
        FRAMES[1] = {
            ...this.animationState
        };
        this._animation = this._progressIndicator.nativeElement.animate(FRAMES, {
            easing: 'ease-out',
            fill: 'forwards',
            duration: this.animationDuration
        });
    }
}
IgxLinearProgressBarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxLinearProgressBarComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxLinearProgressBarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxLinearProgressBarComponent, selector: "igx-linear-bar", inputs: { striped: "striped", role: "role", id: "id", textAlign: "textAlign", textVisibility: "textVisibility", textTop: "textTop", text: "text", type: "type" }, host: { properties: { "attr.aria-valuemin": "this.valueMin", "class.igx-linear-bar": "this.cssClass", "class.igx-linear-bar--striped": "this.striped", "class.igx-linear-bar--indeterminate": "this.isIndeterminate", "attr.role": "this.role", "attr.id": "this.id", "class.igx-linear-bar--danger": "this.error", "class.igx-linear-bar--info": "this.info", "class.igx-linear-bar--warning": "this.warning", "class.igx-linear-bar--success": "this.success" } }, viewQueries: [{ propertyName: "_progressIndicator", first: true, predicate: ["indicator"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"igx-linear-bar__base\">\n    <div #indicator class=\"igx-linear-bar__indicator\" [style.width]=\"0\"></div>\n</div>\n\n<span\n    class=\"igx-linear-bar__value\"\n    [ngClass]=\"{\n        'igx-linear-bar__value--start': textAlign === 'start',\n        'igx-linear-bar__value--center': textAlign === 'center',\n        'igx-linear-bar__value--end': textAlign === 'end',\n        'igx-linear-bar__value--top': textTop,\n        'igx-linear-bar__value--hidden': !textVisibility\n    }\">\n        {{text ? text : valueInPercent + '%'}}\n</span>\n", directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxLinearProgressBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-linear-bar', template: "<div class=\"igx-linear-bar__base\">\n    <div #indicator class=\"igx-linear-bar__indicator\" [style.width]=\"0\"></div>\n</div>\n\n<span\n    class=\"igx-linear-bar__value\"\n    [ngClass]=\"{\n        'igx-linear-bar__value--start': textAlign === 'start',\n        'igx-linear-bar__value--center': textAlign === 'center',\n        'igx-linear-bar__value--end': textAlign === 'end',\n        'igx-linear-bar__value--top': textTop,\n        'igx-linear-bar__value--hidden': !textVisibility\n    }\">\n        {{text ? text : valueInPercent + '%'}}\n</span>\n" }]
        }], propDecorators: { valueMin: [{
                type: HostBinding,
                args: ['attr.aria-valuemin']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-linear-bar']
            }], striped: [{
                type: HostBinding,
                args: ['class.igx-linear-bar--striped']
            }, {
                type: Input
            }], isIndeterminate: [{
                type: HostBinding,
                args: ['class.igx-linear-bar--indeterminate']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], textAlign: [{
                type: Input
            }], textVisibility: [{
                type: Input
            }], textTop: [{
                type: Input
            }], text: [{
                type: Input
            }], type: [{
                type: Input
            }], _progressIndicator: [{
                type: ViewChild,
                args: ['indicator', { static: true }]
            }], error: [{
                type: HostBinding,
                args: ['class.igx-linear-bar--danger']
            }], info: [{
                type: HostBinding,
                args: ['class.igx-linear-bar--info']
            }], warning: [{
                type: HostBinding,
                args: ['class.igx-linear-bar--warning']
            }], success: [{
                type: HostBinding,
                args: ['class.igx-linear-bar--success']
            }] } });
export class IgxCircularProgressBarComponent extends BaseProgressDirective {
    constructor(renderer, _directionality) {
        super();
        this.renderer = renderer;
        this._directionality = _directionality;
        /** @hidden */
        this.cssClass = 'igx-circular-bar';
        /**
         * An @Input property that sets the value of `id` attribute. If not provided it will be automatically generated.
         * ```html
         * <igx-circular-bar [id]="'igx-circular-bar-55'" [value]="50"></igx-circular-bar>
         * ```
         */
        this.id = `igx-circular-bar-${NEXT_CIRCULAR_ID++}`;
        /**
         * Sets the text visibility. By default it is set to true.
         * ```html
         * <igx-circular-bar [textVisibility]="false"></igx-circular-bar>
         * ```
         */
        this.textVisibility = true;
        /**
         * @hidden
         */
        this.gradientId = `igx-circular-gradient-${NEXT_GRADIENT_ID++}`;
        this._circleRadius = 46;
        this._circumference = 2 * Math.PI * this._circleRadius;
        this.STROKE_OPACITY_DVIDER = 100;
        this.STROKE_OPACITY_ADDITION = .2;
        this.animationState = {
            strokeDashoffset: 289,
            strokeOpacity: 1
        };
    }
    /**
     * @hidden
     */
    get isIndeterminate() {
        return this.indeterminate;
    }
    /**
     * @hidden
     */
    get context() {
        return {
            $implicit: { value: this.value, valueInPercent: this.valueInPercent, max: this.max }
        };
    }
    ngAfterContentInit() {
        this.triggerProgressTransition(MIN_VALUE, this._initValue);
        this._contentInit = true;
    }
    ngAfterViewInit() {
        this.renderer.setStyle(this._svgCircle.nativeElement, 'stroke', `url(#${this.gradientId})`);
    }
    /**
     * @hidden
     */
    get textContent() {
        return this.text;
    }
    runAnimation(value) {
        if (this._animation && this._animation.playState !== 'finished') {
            return;
        }
        const valueInPercent = this.max <= 0 ? 0 : toPercent(value, this.max);
        const FRAMES = [];
        FRAMES[0] = { ...this.animationState };
        this.animationState.strokeDashoffset = this.getProgress(valueInPercent);
        this.animationState.strokeOpacity = toPercent(value, this.max) / this.STROKE_OPACITY_DVIDER + this.STROKE_OPACITY_ADDITION;
        FRAMES[1] = {
            ...this.animationState
        };
        this._animation = this._svgCircle.nativeElement.animate(FRAMES, {
            easing: 'ease-out',
            fill: 'forwards',
            duration: this.animationDuration
        });
    }
    getProgress(percentage) {
        return this._directionality.rtl ?
            this._circumference + (percentage * this._circumference / 100) :
            this._circumference - (percentage * this._circumference / 100);
    }
}
IgxCircularProgressBarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCircularProgressBarComponent, deps: [{ token: i0.Renderer2 }, { token: i2.IgxDirectionality }], target: i0.ɵɵFactoryTarget.Component });
IgxCircularProgressBarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: { id: "id", isIndeterminate: "isIndeterminate", textVisibility: "textVisibility", text: "text" }, host: { properties: { "class.igx-circular-bar": "this.cssClass", "attr.id": "this.id", "class.igx-circular-bar--indeterminate": "this.isIndeterminate" } }, queries: [{ propertyName: "textTemplate", first: true, predicate: IgxProcessBarTextTemplateDirective, descendants: true, read: IgxProcessBarTextTemplateDirective }, { propertyName: "gradientTemplate", first: true, predicate: IgxProgressBarGradientDirective, descendants: true, read: IgxProgressBarGradientDirective }], viewQueries: [{ propertyName: "_svgCircle", first: true, predicate: ["circle"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<svg #svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\"\n    viewBox=\"0 0 100 100\"\n    preserveAspectRatio=\"xMidYMid meet\"\n    role=\"progressbar\"\n    aria-valuemin=\"0\"\n    [attr.aria-valuemax]=\"max\"\n    [attr.aria-valuenow]=\"value\">\n    <svg:circle class=\"igx-circular-bar__inner\" cx=\"50\" cy=\"50\" r=\"46\" />\n    <svg:circle #circle class=\"igx-circular-bar__outer\" cx=\"50\" cy=\"50\" r=\"46\" />\n    <svg:text *ngIf=\"textVisibility\" text-anchor=\"middle\" x=\"50\" y=\"60\">\n        <ng-container *ngTemplateOutlet=\"textTemplate ? textTemplate.template : defaultTextTemplate;\n            context: context\">\n        </ng-container>\n    </svg:text>\n\n    <svg:defs>\n        <ng-container\n            *ngTemplateOutlet=\"gradientTemplate ? gradientTemplate.template : defaultGradientTemplate;\n            context: { $implicit: gradientId }\">\n        </ng-container>\n    </svg:defs>\n\n    <ng-template #defaultTextTemplate>\n        <svg:tspan class=\"igx-circular-bar__text\">\n            {{textContent ? textContent: valueInPercent + '%'}}\n        </svg:tspan>\n    </ng-template>\n\n    <ng-template #defaultGradientTemplate>\n        <svg:linearGradient [id]=\"gradientId\" gradientTransform=\"rotate(90)\">\n          <stop offset=\"0%\"   class=\"igx-circular-bar__gradient-start\" />\n          <stop offset=\"100%\" class=\"igx-circular-bar__gradient-end\" />\n        </svg:linearGradient>\n    </ng-template>\n</svg>\n\n", directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCircularProgressBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-circular-bar', template: "<svg #svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\"\n    viewBox=\"0 0 100 100\"\n    preserveAspectRatio=\"xMidYMid meet\"\n    role=\"progressbar\"\n    aria-valuemin=\"0\"\n    [attr.aria-valuemax]=\"max\"\n    [attr.aria-valuenow]=\"value\">\n    <svg:circle class=\"igx-circular-bar__inner\" cx=\"50\" cy=\"50\" r=\"46\" />\n    <svg:circle #circle class=\"igx-circular-bar__outer\" cx=\"50\" cy=\"50\" r=\"46\" />\n    <svg:text *ngIf=\"textVisibility\" text-anchor=\"middle\" x=\"50\" y=\"60\">\n        <ng-container *ngTemplateOutlet=\"textTemplate ? textTemplate.template : defaultTextTemplate;\n            context: context\">\n        </ng-container>\n    </svg:text>\n\n    <svg:defs>\n        <ng-container\n            *ngTemplateOutlet=\"gradientTemplate ? gradientTemplate.template : defaultGradientTemplate;\n            context: { $implicit: gradientId }\">\n        </ng-container>\n    </svg:defs>\n\n    <ng-template #defaultTextTemplate>\n        <svg:tspan class=\"igx-circular-bar__text\">\n            {{textContent ? textContent: valueInPercent + '%'}}\n        </svg:tspan>\n    </ng-template>\n\n    <ng-template #defaultGradientTemplate>\n        <svg:linearGradient [id]=\"gradientId\" gradientTransform=\"rotate(90)\">\n          <stop offset=\"0%\"   class=\"igx-circular-bar__gradient-start\" />\n          <stop offset=\"100%\" class=\"igx-circular-bar__gradient-end\" />\n        </svg:linearGradient>\n    </ng-template>\n</svg>\n\n" }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i2.IgxDirectionality }]; }, propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-circular-bar']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], isIndeterminate: [{
                type: HostBinding,
                args: ['class.igx-circular-bar--indeterminate']
            }, {
                type: Input
            }], textVisibility: [{
                type: Input
            }], text: [{
                type: Input
            }], textTemplate: [{
                type: ContentChild,
                args: [IgxProcessBarTextTemplateDirective, { read: IgxProcessBarTextTemplateDirective }]
            }], gradientTemplate: [{
                type: ContentChild,
                args: [IgxProgressBarGradientDirective, { read: IgxProgressBarGradientDirective }]
            }], _svgCircle: [{
                type: ViewChild,
                args: ['circle', { static: true }]
            }] } });
export const valueInRange = (value, max, min = 0) => Math.max(Math.min(value, max), min);
export const toPercent = (value, max) => !max ? 0 : Math.floor(100 * value / max);
export const toValue = (value, max) => max * value / 100;
/**
 * @hidden
 */
export class IgxProgressBarModule {
}
IgxProgressBarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxProgressBarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxProgressBarModule, declarations: [IgxLinearProgressBarComponent, IgxCircularProgressBarComponent, IgxProcessBarTextTemplateDirective,
        IgxProgressBarGradientDirective], imports: [CommonModule], exports: [IgxLinearProgressBarComponent, IgxCircularProgressBarComponent, IgxProcessBarTextTemplateDirective,
        IgxProgressBarGradientDirective] });
IgxProgressBarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxProgressBarModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxLinearProgressBarComponent,
                        IgxCircularProgressBarComponent,
                        IgxProcessBarTextTemplateDirective,
                        IgxProgressBarGradientDirective,
                    ],
                    exports: [
                        IgxLinearProgressBarComponent,
                        IgxCircularProgressBarComponent,
                        IgxProcessBarTextTemplateDirective,
                        IgxProgressBarGradientDirective,
                    ],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3Byb2dyZXNzYmFyL3Byb2dyZXNzYmFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9wcm9ncmVzc2Jhci90ZW1wbGF0ZXMvbGluZWFyLWJhci5jb21wb25lbnQuaHRtbCIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9wcm9ncmVzc2Jhci90ZW1wbGF0ZXMvY2lyY3VsYXItYmFyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0gsU0FBUyxFQUVULFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBRU4sU0FBUyxFQUNULFlBQVksRUFHWixTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNILGtDQUFrQyxFQUNsQywrQkFBK0IsR0FDbEMsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQWtCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUV2RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDekIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRXBCLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDL0IsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsUUFBUTtJQUNoQixHQUFHLEVBQUUsS0FBSztDQUNiLENBQUMsQ0FBQztBQUdILE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUM7SUFDbEMsS0FBSyxFQUFFLE9BQU87SUFDZCxJ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b0JBQW9COztpSEFBcEIsb0JBQW9CO2tIQUFwQixvQkFBb0IsaUJBMVVwQiw2QkFBNkIsRUE0SzdCLCtCQUErQixFQW1KcEMsa0NBQWtDO1FBQ2xDLCtCQUErQixhQVF6QixZQUFZLGFBeFViLDZCQUE2QixFQTRLN0IsK0JBQStCLEVBeUpwQyxrQ0FBa0M7UUFDbEMsK0JBQStCO2tIQUkxQixvQkFBb0IsWUFGcEIsQ0FBQyxZQUFZLENBQUM7MkZBRWQsb0JBQW9CO2tCQWZoQyxRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDViw2QkFBNkI7d0JBQzdCLCtCQUErQjt3QkFDL0Isa0NBQWtDO3dCQUNsQywrQkFBK0I7cUJBQ2xDO29CQUNELE9BQU8sRUFBRTt3QkFDTCw2QkFBNkI7d0JBQzdCLCtCQUErQjt3QkFDL0Isa0NBQWtDO3dCQUNsQywrQkFBK0I7cUJBQ2xDO29CQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgT3V0cHV0LFxuICAgIFJlbmRlcmVyMixcbiAgICBWaWV3Q2hpbGQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBEaXJlY3RpdmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIElneFByb2Nlc3NCYXJUZXh0VGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgSWd4UHJvZ3Jlc3NCYXJHcmFkaWVudERpcmVjdGl2ZSxcbn0gZnJvbSAnLi9wcm9ncmVzc2Jhci5jb21tb24nO1xuaW1wb3J0IHsgSUJhc2VFdmVudEFyZ3MsIG1rZW51bSB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSWd4RGlyZWN0aW9uYWxpdHkgfSBmcm9tICcuLi9zZXJ2aWNlcy9kaXJlY3Rpb24vZGlyZWN0aW9uYWxpdHknO1xuY29uc3QgT05FX1BFUkNFTlQgPSAwLjAxO1xuY29uc3QgTUlOX1ZBTFVFID0gMDtcblxuZXhwb3J0IGNvbnN0IElneFRleHRBbGlnbiA9IG1rZW51bSh7XG4gICAgU1RBUlQ6ICdzdGFydCcsXG4gICAgQ0VOVEVSOiAnY2VudGVyJyxcbiAgICBFTkQ6ICdlbmQnXG59KTtcbmV4cG9ydCB0eXBlIElneFRleHRBbGlnbiA9ICh0eXBlb2YgSWd4VGV4dEFsaWduKVtrZXlvZiB0eXBlb2YgSWd4VGV4dEFsaWduXTtcblxuZXhwb3J0IGNvbnN0IElneFByb2dyZXNzVHlwZSA9IG1rZW51bSh7XG4gICAgRVJST1I6ICdlcnJvcicsXG4gICAgSU5GTzogJ2luZm8nLFxuICAgIFdBUk5JTkc6ICd3YXJuaW5nJyxcbiAgICBTVUNDRVNTOiAnc3VjY2Vzcydcbn0pO1xuZXhwb3J0IHR5cGUgSWd4UHJvZ3Jlc3NUeXBlID0gKHR5cGVvZiBJZ3hQcm9ncmVzc1R5cGUpW2tleW9mIHR5cGVvZiBJZ3hQcm9ncmVzc1R5cGVdO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGFuZ2VQcm9ncmVzc0V2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICBwcmV2aW91c1ZhbHVlOiBudW1iZXI7XG4gICAgY3VycmVudFZhbHVlOiBudW1iZXI7XG59XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlUHJvZ3Jlc3NEaXJlY3RpdmUge1xuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50LCB3aGljaCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgYSBwcm9ncmVzcyBpcyBjaGFuZ2VkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgcHJvZ3Jlc3NDaGFuZ2UoZXZlbnQpIHtcbiAgICAgKiAgICAgYWxlcnQoXCJQcm9ncmVzcyBtYWRlIVwiKTtcbiAgICAgKiB9XG4gICAgICogIC8vLi4uXG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2lyY3VsYXItYmFyIFt2YWx1ZV09XCJjdXJyZW50VmFsdWVcIiAocHJvZ3Jlc3NDaGFuZ2VkKT1cInByb2dyZXNzQ2hhbmdlKCRldmVudClcIj48L2lneC1jaXJjdWxhci1iYXI+XG4gICAgICogPGlneC1saW5lYXItYmFyIFt2YWx1ZV09XCJjdXJyZW50VmFsdWVcIiAocHJvZ3Jlc3NDaGFuZ2VkKT1cInByb2dyZXNzQ2hhbmdlKCRldmVudClcIj48L2lneC1saW5lYXItYmFyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBwcm9ncmVzc0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElDaGFuZ2VQcm9ncmVzc0V2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvR2V0cyBwcm9ncmVzc2JhciBpbiBpbmRldGVybWluYXRlLiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byBmYWxzZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saW5lYXItYmFyIFtpbmRldGVybWluYXRlXT1cInRydWVcIj48L2lneC1saW5lYXItYmFyPlxuICAgICAqIDxpZ3gtY2lyY3VsYXItYmFyIFtpbmRldGVybWluYXRlXT1cInRydWVcIj48L2lneC1jaXJjdWxhci1iYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9HZXRzIHByb2dyZXNzYmFyIGFuaW1hdGlvbiBkdXJhdGlvbi4gQnkgZGVmYXVsdCBpdCBpcyAyMDAwbXMuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGluZWFyLWJhciBbaW5kZXRlcm1pbmF0ZV09XCJ0cnVlXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBhbmltYXRpb25EdXJhdGlvbiA9IDIwMDA7XG4gICAgcHVibGljIF9pbnRlcnZhbDtcblxuICAgIHByb3RlY3RlZCBfaW5pdFZhbHVlID0gMDtcbiAgICBwcm90ZWN0ZWQgX2NvbnRlbnRJbml0ID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIF9tYXggPSAxMDA7XG4gICAgcHJvdGVjdGVkIF92YWx1ZSA9IE1JTl9WQUxVRTtcbiAgICBwcm90ZWN0ZWQgX25ld1ZhbCA9IE1JTl9WQUxVRTtcbiAgICBwcm90ZWN0ZWQgX2FuaW1hdGUgPSB0cnVlO1xuICAgIHByb3RlY3RlZCBfc3RlcDtcbiAgICBwcm90ZWN0ZWQgX2FuaW1hdGlvbjtcbiAgICBwcm90ZWN0ZWQgX3ZhbHVlSW5QZXJjZW50O1xuICAgIHByb3RlY3RlZCBfaW50ZXJuYWxTdGF0ZSA9IHtcbiAgICAgICAgb2xkVmFsOiAwLFxuICAgICAgICBuZXdWYWw6IDBcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIHdoaWNoIHVwZGF0ZSB0aGUgcHJvZ3Jlc3MgaW5kaWNhdG9yIG9mIHRoZSBgcHJvZ3Jlc3MgYmFyYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15UHJvZ3Jlc3NCYXJcIilcbiAgICAgKiBwdWJsaWMgcHJvZ3Jlc3NCYXI6IElneExpbmVhclByb2dyZXNzQmFyQ29tcG9uZW50IHwgSWd4Q2lyY3VsYXJCYXJDb21wb25lbnQ7XG4gICAgICogcHVibGljIHN0ZXBWYWx1ZShldmVudCkge1xuICAgICAqICAgICBsZXQgc3RlcCA9IHRoaXMucHJvZ3Jlc3NCYXIuc3RlcDtcbiAgICAgKiAgICAgYWxlcnQoc3RlcCk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzdGVwKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLl9zdGVwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RlcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4ICogT05FX1BFUkNFTlQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgYnkgd2hpY2ggcHJvZ3Jlc3MgaW5kaWNhdG9yIGlzIHVwZGF0ZWQuIEJ5IGRlZmF1bHQgaXQgaXMgMS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saW5lYXItYmFyIFttYXhdPVwiMjAwXCIgW3ZhbHVlXT1cIjBcIiBbc3RlcF09XCIxXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiA8aWd4LWNpcmN1bGFyLWJhciBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCIwXCIgW3N0ZXBdPVwiMVwiPjwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHN0ZXAodmFsOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgc3RlcCA9IE51bWJlcih2YWwpO1xuICAgICAgICBpZiAoc3RlcCA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmltYXRpbmcgdGhlIHByb2dyZXNzLiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byB0cnVlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpbmVhci1iYXIgW2FuaW1hdGVdPVwiZmFsc2VcIiBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCI1MFwiPjwvaWd4LWxpbmVhci1iYXI+XG4gICAgICogPGlneC1jaXJjdWxhci1iYXIgW2FuaW1hdGVdPVwiZmFsc2VcIiBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCI1MFwiPjwvaWd4LWNpcmN1bGFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgYW5pbWF0ZShhbmltYXRlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGUgPSBhbmltYXRlO1xuICAgICAgICBpZiAoYW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25EdXJhdGlvbiA9IDIwMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkR1cmF0aW9uID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgYHByb2dyZXNzIGJhcmAgaGFzIGFuaW1hdGlvbiB0cnVlL2ZhbHNlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlQcm9ncmVzc0JhclwiKVxuICAgICAqIHB1YmxpYyBwcm9ncmVzc0JhcjogSWd4TGluZWFyUHJvZ3Jlc3NCYXJDb21wb25lbnQgfCBJZ3hDaXJjdWxhckJhckNvbXBvbmVudDtcbiAgICAgKiBwdWJsaWMgYW5pbWF0aW9uU3RhdHVzKGV2ZW50KSB7XG4gICAgICogICAgIGxldCBhbmltYXRpb25TdGF0dXMgPSB0aGlzLnByb2dyZXNzQmFyLmFuaW1hdGU7XG4gICAgICogICAgIGFsZXJ0KGFuaW1hdGlvblN0YXR1cyk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgYW5pbWF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IG1heGltdW0gdmFsdWUgdGhhdCBjYW4gYmUgcGFzc2VkLiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byAxMDAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGluZWFyLWJhciBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCIwXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiA8aWd4LWNpcmN1bGFyLWJhciBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCIwXCI+PC9pZ3gtY2lyY3VsYXItYmFyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXZhbHVlbWF4JylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgbWF4KG1heE51bTogbnVtYmVyKSB7XG4gICAgICAgIGlmIChtYXhOdW0gPCBNSU5fVkFMVUUgfHwgdGhpcy5fbWF4ID09PSBtYXhOdW0gfHxcbiAgICAgICAgICAgICh0aGlzLl9hbmltYXRpb24gJiYgdGhpcy5fYW5pbWF0aW9uLnBsYXlTdGF0ZSAhPT0gJ2ZpbmlzaGVkJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ludGVybmFsU3RhdGUubmV3VmFsID0gTWF0aC5yb3VuZCh0b1ZhbHVlKHRvUGVyY2VudCh0aGlzLnZhbHVlLCBtYXhOdW0pLCBtYXhOdW0pKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLl9pbnRlcm5hbFN0YXRlLm9sZFZhbCA9IE1hdGgucm91bmQodG9WYWx1ZSh0aGlzLnZhbHVlSW5QZXJjZW50LCBtYXhOdW0pKTtcbiAgICAgICAgdGhpcy5fbWF4ID0gbWF4TnVtO1xuICAgICAgICB0aGlzLnRyaWdnZXJQcm9ncmVzc1RyYW5zaXRpb24odGhpcy5faW50ZXJuYWxTdGF0ZS5vbGRWYWwsIHRoaXMuX2ludGVybmFsU3RhdGUubmV3VmFsLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0aGUgbWF4aW11bSBwcm9ncmVzcyB2YWx1ZSBvZiB0aGUgYHByb2dyZXNzIGJhcmAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeVByb2dyZXNzQmFyXCIpXG4gICAgICogcHVibGljIHByb2dyZXNzQmFyOiBJZ3hMaW5lYXJQcm9ncmVzc0JhckNvbXBvbmVudCB8IElneENpcmN1bGFyQmFyQ29tcG9uZW50O1xuICAgICAqIHB1YmxpYyBtYXhWYWx1ZShldmVudCkge1xuICAgICAqICAgICBsZXQgbWF4ID0gdGhpcy5wcm9ncmVzc0Jhci5tYXg7XG4gICAgICogICAgIGFsZXJ0KG1heCk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbWF4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGBJZ3hMaW5lYXJQcm9ncmVzc0JhckNvbXBvbmVudGAvYElneENpcmN1bGFyUHJvZ3Jlc3NCYXJDb21wb25lbnRgIHZhbHVlIGluIHBlcmNlbnRhZ2UuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeVByb2dyZXNzQmFyXCIpXG4gICAgICogcHVibGljIHByb2dyZXNzQmFyOiBJZ3hMaW5lYXJQcm9ncmVzc0JhckNvbXBvbmVudDsgLy8gSWd4Q2lyY3VsYXJQcm9ncmVzc0JhckNvbXBvbmVudFxuICAgICAqIHB1YmxpYyB2YWx1ZVBlcmNlbnQoZXZlbnQpe1xuICAgICAqICAgICBsZXQgcGVyY2VudFZhbHVlID0gdGhpcy5wcm9ncmVzc0Jhci52YWx1ZUluUGVyY2VudDtcbiAgICAgKiAgICAgYWxlcnQocGVyY2VudFZhbHVlKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB2YWx1ZUluUGVyY2VudCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB2YWwgPSB0b1BlcmNlbnQodGhpcy5fdmFsdWUsIHRoaXMuX21heCk7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB2YWx1ZSB0aGF0IGluZGljYXRlcyB0aGUgY3VycmVudCBgSWd4TGluZWFyUHJvZ3Jlc3NCYXJDb21wb25lbnRgIHBvc2l0aW9uLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlQcm9ncmVzc0JhclwiKVxuICAgICAqIHB1YmxpYyBwcm9ncmVzc0JhcjogSWd4TGluZWFyUHJvZ3Jlc3NCYXJDb21wb25lbnQ7XG4gICAgICogcHVibGljIGdldFZhbHVlKGV2ZW50KSB7XG4gICAgICogICAgIGxldCB2YWx1ZSA9IHRoaXMucHJvZ3Jlc3NCYXIudmFsdWU7XG4gICAgICogICAgIGFsZXJ0KHZhbHVlKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtdmFsdWVub3cnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHZhbHVlIHRoYXQgaW5kaWNhdGVzIHRoZSBjdXJyZW50IGBJZ3hMaW5lYXJQcm9ncmVzc0JhckNvbXBvbmVudGAgcG9zaXRpb24uXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGluZWFyLWJhciBbc3RyaXBlZF09XCJmYWxzZVwiIFttYXhdPVwiMjAwXCIgW3ZhbHVlXT1cIjUwXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbCkge1xuICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uICYmIHRoaXMuX2FuaW1hdGlvbi5wbGF5U3RhdGUgIT09ICdmaW5pc2hlZCcgfHwgdmFsIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsSW5SYW5nZSA9IHZhbHVlSW5SYW5nZSh2YWwsIHRoaXMubWF4KTtcblxuICAgICAgICBpZiAoaXNOYU4odmFsSW5SYW5nZSkgfHwgdGhpcy5fdmFsdWUgPT09IHZhbCB8fCB0aGlzLmluZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50SW5pdCkge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyUHJvZ3Jlc3NUcmFuc2l0aW9uKHRoaXMuX3ZhbHVlLCB2YWxJblJhbmdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IHZhbEluUmFuZ2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJpZ2dlclByb2dyZXNzVHJhbnNpdGlvbihvbGRWYWwsIG5ld1ZhbCwgbWF4VXBkYXRlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG9sZFZhbCA9PT0gbmV3VmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjaGFuZ2VkVmFsdWVzID0ge1xuICAgICAgICAgICAgY3VycmVudFZhbHVlOiBuZXdWYWwsXG4gICAgICAgICAgICBwcmV2aW91c1ZhbHVlOiBvbGRWYWxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzdGVwRGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb25GbG93KG9sZFZhbCwgbmV3VmFsKTtcbiAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1RvUGVyY2VudCA9IHRvUGVyY2VudChuZXdWYWwsIHRoaXMubWF4KTtcbiAgICAgICAgICAgIGNvbnN0IG9sZFRvUGVyY2VudCA9IHRvUGVyY2VudChvbGRWYWwsIHRoaXMubWF4KTtcbiAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5hbmltYXRpb25EdXJhdGlvbiAvIE1hdGguYWJzKG5ld1RvUGVyY2VudCAtIG9sZFRvUGVyY2VudCkgLyAodGhpcy5fc3RlcCA/IHRoaXMuX3N0ZXAgOiAxKTtcbiAgICAgICAgICAgIHRoaXMucnVuQW5pbWF0aW9uKG5ld1ZhbCk7XG4gICAgICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuaW5jcmVhc2UobmV3VmFsLCBzdGVwRGlyZWN0aW9uKSwgZHVyYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcyhuZXdWYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1heFVwZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvZ3Jlc3NDaGFuZ2VkLmVtaXQoY2hhbmdlZFZhbHVlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbmNyZWFzZShuZXdWYWx1ZTogbnVtYmVyLCBzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0VmFsdWUgPSB0b1BlcmNlbnQobmV3VmFsdWUsIHRoaXMuX21heCk7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVJblJhbmdlKHRoaXMuX3ZhbHVlLCB0aGlzLl9tYXgpICsgc3RlcDtcbiAgICAgICAgaWYgKChzdGVwID4gMCAmJiB0aGlzLnZhbHVlSW5QZXJjZW50ID49IHRhcmdldFZhbHVlKSB8fCAoc3RlcCA8IDAgJiYgdGhpcy52YWx1ZUluUGVyY2VudCA8PSB0YXJnZXRWYWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBkaXJlY3Rpb25GbG93KGN1cnJlbnRWYWx1ZTogbnVtYmVyLCBwcmV2VmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBjdXJyZW50VmFsdWUgPCBwcmV2VmFsdWUgPyB0aGlzLnN0ZXAgOiAtdGhpcy5zdGVwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBydW5BbmltYXRpb24odmFsdWU6IG51bWJlcik7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQHBhcmFtIHN0ZXBcbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVByb2dyZXNzKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVJblJhbmdlKHZhbCwgdGhpcy5fbWF4KTtcbiAgICAgICAgLy8gdGhpcy52YWx1ZUluUGVyY2VudCA9IHRvUGVyY2VudCh2YWwsIHRoaXMuX21heCk7XG4gICAgICAgIHRoaXMucnVuQW5pbWF0aW9uKHZhbCk7XG4gICAgfVxufVxubGV0IE5FWFRfTElORUFSX0lEID0gMDtcbmxldCBORVhUX0NJUkNVTEFSX0lEID0gMDtcbmxldCBORVhUX0dSQURJRU5UX0lEID0gMDtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWxpbmVhci1iYXInLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xpbmVhci1iYXIuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneExpbmVhclByb2dyZXNzQmFyQ29tcG9uZW50IGV4dGVuZHMgQmFzZVByb2dyZXNzRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtdmFsdWVtaW4nKVxuICAgIHB1YmxpYyB2YWx1ZU1pbiA9IDA7XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1saW5lYXItYmFyJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LWxpbmVhci1iYXInO1xuXG4gICAgLyoqXG4gICAgICogU2V0IGBJZ3hMaW5lYXJQcm9ncmVzc0JhckNvbXBvbmVudGAgdG8gaGF2ZSBzdHJpcGVkIHN0eWxlLiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byBmYWxzZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saW5lYXItYmFyIFtzdHJpcGVkXT1cInRydWVcIiBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCI1MFwiPjwvaWd4LWxpbmVhci1iYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtbGluZWFyLWJhci0tc3RyaXBlZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc3RyaXBlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWxpbmVhci1iYXItLWluZGV0ZXJtaW5hdGUnKVxuICAgIHB1YmxpYyBnZXQgaXNJbmRldGVybWluYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRldGVybWluYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIHZhbHVlIG9mIHRoZSBgcm9sZWAgYXR0cmlidXRlLiBJZiBub3QgcHJvdmlkZWQgaXQgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHNldCB0byBgcHJvZ3Jlc3NiYXJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpbmVhci1iYXIgcm9sZT1cInByb2dyZXNzYmFyXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcm9sZSA9ICdwcm9ncmVzc2Jhcic7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSB2YWx1ZSBvZiBgaWRgIGF0dHJpYnV0ZS4gSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGluZWFyLWJhciBbaWRdPVwiJ2lneC1saW5lYXItYmFyLTU1J1wiIFtzdHJpcGVkXT1cInRydWVcIiBbbWF4XT1cIjIwMFwiIFt2YWx1ZV09XCI1MFwiPjwvaWd4LWxpbmVhci1iYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtbGluZWFyLWJhci0ke05FWFRfTElORUFSX0lEKyt9YDtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcG9zaXRpb24gdGhhdCBkZWZpbmVzIHdoZXJlIHRoZSB0ZXh0IGlzIGFsaWduZWQuXG4gICAgICogUG9zc2libGUgb3B0aW9ucyAtIGBJZ3hUZXh0QWxpZ24uU1RBUlRgIChkZWZhdWx0KSwgYElneFRleHRBbGlnbi5DRU5URVJgLCBgSWd4VGV4dEFsaWduLkVORGAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBwb3NpdGlvbkNlbnRlcjogSWd4VGV4dEFsaWduO1xuICAgICAqIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgKiAgICAgdGhpcy5wb3NpdGlvbkNlbnRlciA9IElneFRleHRBbGlnbi5DRU5URVI7XG4gICAgICogfVxuICAgICAqICAvLy4uLlxuICAgICAqIGBgYFxuICAgICAqICBgYGBodG1sXG4gICAgICogPGlneC1saW5lYXItYmFyIHR5cGU9XCJ3YXJuaW5nXCIgW3RleHRdPVwiJ0N1c3RvbSB0ZXh0J1wiIFt0ZXh0QWxpZ25dPVwicG9zaXRpb25DZW50ZXJcIiBbc3RyaXBlZF09XCJ0cnVlXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0ZXh0QWxpZ246IElneFRleHRBbGlnbiA9IElneFRleHRBbGlnbi5TVEFSVDtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdGV4dCB0byBiZSB2aXNpYmxlLiBCeSBkZWZhdWx0IGl0IGlzIHNldCB0byB0cnVlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1saW5lYXItYmFyIHR5cGU9XCJkZWZhdWx0XCIgW3RleHRWaXNpYmlsaXR5XT1cImZhbHNlXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0ZXh0VmlzaWJpbGl0eSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHBvc2l0aW9uIHRoYXQgZGVmaW5lcyBpZiB0aGUgdGV4dCBzaG91bGQgYmUgYWxpZ25lZCBhYm92ZSB0aGUgcHJvZ3Jlc3MgbGluZS4gQnkgZGVmYXVsdCBpcyBzZXQgdG8gZmFsc2UuXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWxpbmVhci1iYXIgdHlwZT1cImVycm9yXCIgW3RleHRUb3BdPVwidHJ1ZVwiPjwvaWd4LWxpbmVhci1iYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdGV4dFRvcCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU2V0IGEgY3VzdG9tIHRleHQgdGhhdCBpcyBkaXNwbGF5ZWQgYWNjb3JkaW5nIHRvIHRoZSBkZWZpbmVkIHBvc2l0aW9uLlxuICAgICAqICBgYGBodG1sXG4gICAgICogPGlneC1saW5lYXItYmFyIHR5cGU9XCJ3YXJuaW5nXCIgW3RleHRdPVwiJ0N1c3RvbSB0ZXh0J1wiIFt0ZXh0QWxpZ25dPVwicG9zaXRpb25DZW50ZXJcIiBbc3RyaXBlZF09XCJ0cnVlXCI+PC9pZ3gtbGluZWFyLWJhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdHlwZSBvZiB0aGUgYElneExpbmVhclByb2dyZXNzQmFyQ29tcG9uZW50YC4gUG9zc2libGUgb3B0aW9ucyAtIGBkZWZhdWx0YCwgYHN1Y2Nlc3NgLCBgaW5mb2AsIGB3YXJuaW5nYCwgYW5kIGBlcnJvcmAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGluZWFyLWJhciBbc3RyaXBlZF09XCJmYWxzZVwiIFttYXhdPVwiMTAwXCIgW3ZhbHVlXT1cIjBcIiB0eXBlPVwiZXJyb3JcIj48L2lneC1saW5lYXItYmFyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHR5cGUgPSAnZGVmYXVsdCc7XG5cbiAgICBAVmlld0NoaWxkKCdpbmRpY2F0b3InLCB7c3RhdGljOiB0cnVlfSlcbiAgICBwcml2YXRlIF9wcm9ncmVzc0luZGljYXRvcjogRWxlbWVudFJlZjtcblxuICAgIHByaXZhdGUgYW5pbWF0aW9uU3RhdGUgPSB7XG4gICAgICAgIHdpZHRoOiAnMCUnXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1saW5lYXItYmFyLS1kYW5nZXInKVxuICAgIHB1YmxpYyBnZXQgZXJyb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09IElneFByb2dyZXNzVHlwZS5FUlJPUjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtbGluZWFyLWJhci0taW5mbycpXG4gICAgcHVibGljIGdldCBpbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBJZ3hQcm9ncmVzc1R5cGUuSU5GTztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtbGluZWFyLWJhci0td2FybmluZycpXG4gICAgcHVibGljIGdldCB3YXJuaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBJZ3hQcm9ncmVzc1R5cGUuV0FSTklORztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtbGluZWFyLWJhci0tc3VjY2VzcycpXG4gICAgcHVibGljIGdldCBzdWNjZXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBJZ3hQcm9ncmVzc1R5cGUuU1VDQ0VTUztcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRyaWdnZXJQcm9ncmVzc1RyYW5zaXRpb24oTUlOX1ZBTFVFLCB0aGlzLl9pbml0VmFsdWUpO1xuICAgICAgICB0aGlzLl9jb250ZW50SW5pdCA9IHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIHJ1bkFuaW1hdGlvbih2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLl9hbmltYXRpb24gJiYgdGhpcy5fYW5pbWF0aW9uLnBsYXlTdGF0ZSAhPT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsdWVJblBlcmNlbnQgPSB0aGlzLm1heCA8PSAwID8gMCA6IHRvUGVyY2VudCh2YWx1ZSwgdGhpcy5tYXgpO1xuXG4gICAgICAgIGNvbnN0IEZSQU1FUyA9IFtdO1xuICAgICAgICBGUkFNRVNbMF0gPSB7XG4gICAgICAgICAgICAuLi50aGlzLmFuaW1hdGlvblN0YXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZS53aWR0aCA9IHZhbHVlSW5QZXJjZW50ICsgJyUnO1xuICAgICAgICBGUkFNRVNbMV0gPSB7XG4gICAgICAgICAgICAuLi50aGlzLmFuaW1hdGlvblN0YXRlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uID0gdGhpcy5fcHJvZ3Jlc3NJbmRpY2F0b3IubmF0aXZlRWxlbWVudC5hbmltYXRlKEZSQU1FUywge1xuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZS1vdXQnLFxuICAgICAgICAgICAgZmlsbDogJ2ZvcndhcmRzJyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLmFuaW1hdGlvbkR1cmF0aW9uXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtY2lyY3VsYXItYmFyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9jaXJjdWxhci1iYXIuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneENpcmN1bGFyUHJvZ3Jlc3NCYXJDb21wb25lbnQgZXh0ZW5kcyBCYXNlUHJvZ3Jlc3NEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBBZnRlckNvbnRlbnRJbml0IHtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2lyY3VsYXItYmFyJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LWNpcmN1bGFyLWJhcic7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSB2YWx1ZSBvZiBgaWRgIGF0dHJpYnV0ZS4gSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2lyY3VsYXItYmFyIFtpZF09XCInaWd4LWNpcmN1bGFyLWJhci01NSdcIiBbdmFsdWVdPVwiNTBcIj48L2lneC1jaXJjdWxhci1iYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtY2lyY3VsYXItYmFyLSR7TkVYVF9DSVJDVUxBUl9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2lyY3VsYXItYmFyLS1pbmRldGVybWluYXRlJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaXNJbmRldGVybWluYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRldGVybWluYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHRleHQgdmlzaWJpbGl0eS4gQnkgZGVmYXVsdCBpdCBpcyBzZXQgdG8gdHJ1ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jaXJjdWxhci1iYXIgW3RleHRWaXNpYmlsaXR5XT1cImZhbHNlXCI+PC9pZ3gtY2lyY3VsYXItYmFyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRleHRWaXNpYmlsaXR5ID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgdGV4dCB0byBiZSBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBgaWd4Q2lyY3VsYXJCYXJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNpcmN1bGFyLWJhciB0ZXh0PVwiUHJvZ3Jlc3NcIj48L2lneC1jaXJjdWxhci1iYXI+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCB0ZXh0ID0gdGhpcy5jaXJjdWxhckJhci50ZXh0O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcblxuICAgIEBDb250ZW50Q2hpbGQoSWd4UHJvY2Vzc0JhclRleHRUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBJZ3hQcm9jZXNzQmFyVGV4dFRlbXBsYXRlRGlyZWN0aXZlIH0pXG4gICAgcHVibGljIHRleHRUZW1wbGF0ZTogSWd4UHJvY2Vzc0JhclRleHRUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIEBDb250ZW50Q2hpbGQoSWd4UHJvZ3Jlc3NCYXJHcmFkaWVudERpcmVjdGl2ZSwgeyByZWFkOiBJZ3hQcm9ncmVzc0JhckdyYWRpZW50RGlyZWN0aXZlIH0pXG4gICAgcHVibGljIGdyYWRpZW50VGVtcGxhdGU6IElneFByb2dyZXNzQmFyR3JhZGllbnREaXJlY3RpdmU7XG5cbiAgICBAVmlld0NoaWxkKCdjaXJjbGUnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByaXZhdGUgX3N2Z0NpcmNsZTogRWxlbWVudFJlZjtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ3JhZGllbnRJZCA9IGBpZ3gtY2lyY3VsYXItZ3JhZGllbnQtJHtORVhUX0dSQURJRU5UX0lEKyt9YDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGNvbnRleHQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICRpbXBsaWNpdDogeyB2YWx1ZTogdGhpcy52YWx1ZSwgdmFsdWVJblBlcmNlbnQ6IHRoaXMudmFsdWVJblBlcmNlbnQsIG1heDogdGhpcy5tYXggfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NpcmNsZVJhZGl1cyA9IDQ2O1xuICAgIHByaXZhdGUgX2NpcmN1bWZlcmVuY2UgPSAyICogTWF0aC5QSSAqIHRoaXMuX2NpcmNsZVJhZGl1cztcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgU1RST0tFX09QQUNJVFlfRFZJREVSID0gMTAwO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgU1RST0tFX09QQUNJVFlfQURESVRJT04gPSAuMjtcblxuICAgIHByaXZhdGUgYW5pbWF0aW9uU3RhdGUgPSB7XG4gICAgICAgIHN0cm9rZURhc2hvZmZzZXQ6IDI4OSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogMVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2RpcmVjdGlvbmFsaXR5OiBJZ3hEaXJlY3Rpb25hbGl0eSkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlclByb2dyZXNzVHJhbnNpdGlvbihNSU5fVkFMVUUsIHRoaXMuX2luaXRWYWx1ZSk7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRJbml0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgdGhpcy5fc3ZnQ2lyY2xlLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAnc3Ryb2tlJyxcbiAgICAgICAgICAgIGB1cmwoIyR7dGhpcy5ncmFkaWVudElkfSlgXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdGV4dENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcnVuQW5pbWF0aW9uKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbiAmJiB0aGlzLl9hbmltYXRpb24ucGxheVN0YXRlICE9PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWx1ZUluUGVyY2VudCA9IHRoaXMubWF4IDw9IDAgPyAwIDogdG9QZXJjZW50KHZhbHVlLCB0aGlzLm1heCk7XG5cbiAgICAgICAgY29uc3QgRlJBTUVTID0gW107XG4gICAgICAgIEZSQU1FU1swXSA9IHsuLi50aGlzLmFuaW1hdGlvblN0YXRlfTtcblxuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YXRlLnN0cm9rZURhc2hvZmZzZXQgPSB0aGlzLmdldFByb2dyZXNzKHZhbHVlSW5QZXJjZW50KTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZS5zdHJva2VPcGFjaXR5ID0gdG9QZXJjZW50KHZhbHVlLCB0aGlzLm1heCkgLyB0aGlzLlNUUk9LRV9PUEFDSVRZX0RWSURFUiArIHRoaXMuU1RST0tFX09QQUNJVFlfQURESVRJT047XG5cbiAgICAgICAgRlJBTUVTWzFdID0ge1xuICAgICAgICAgICAgLi4udGhpcy5hbmltYXRpb25TdGF0ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbiA9IHRoaXMuX3N2Z0NpcmNsZS5uYXRpdmVFbGVtZW50LmFuaW1hdGUoRlJBTUVTLCB7XG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlLW91dCcsXG4gICAgICAgICAgICBmaWxsOiAnZm9yd2FyZHMnLFxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuYW5pbWF0aW9uRHVyYXRpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQcm9ncmVzcyhwZXJjZW50YWdlOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbmFsaXR5LnJ0bCA/XG4gICAgICAgICAgICB0aGlzLl9jaXJjdW1mZXJlbmNlICsgKHBlcmNlbnRhZ2UgKiB0aGlzLl9jaXJjdW1mZXJlbmNlIC8gMTAwKSA6XG4gICAgICAgICAgICB0aGlzLl9jaXJjdW1mZXJlbmNlIC0gKHBlcmNlbnRhZ2UgKiB0aGlzLl9jaXJjdW1mZXJlbmNlIC8gMTAwKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCB2YWx1ZUluUmFuZ2UgPSAodmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIsIG1pbiA9IDApOiBudW1iZXIgPT4gTWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIG1heCksIG1pbik7XG5cbmV4cG9ydCBjb25zdCB0b1BlcmNlbnQgPSAodmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIpID0+ICAhbWF4ID8gMCA6IE1hdGguZmxvb3IoMTAwICogdmFsdWUgLyBtYXgpO1xuXG5leHBvcnQgY29uc3QgdG9WYWx1ZSA9ICh2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlcikgPT4gbWF4ICogdmFsdWUgLyAxMDA7XG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4TGluZWFyUHJvZ3Jlc3NCYXJDb21wb25lbnQsXG4gICAgICAgIElneENpcmN1bGFyUHJvZ3Jlc3NCYXJDb21wb25lbnQsXG4gICAgICAgIElneFByb2Nlc3NCYXJUZXh0VGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneFByb2dyZXNzQmFyR3JhZGllbnREaXJlY3RpdmUsXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIElneExpbmVhclByb2dyZXNzQmFyQ29tcG9uZW50LFxuICAgICAgICBJZ3hDaXJjdWxhclByb2dyZXNzQmFyQ29tcG9uZW50LFxuICAgICAgICBJZ3hQcm9jZXNzQmFyVGV4dFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hQcm9ncmVzc0JhckdyYWRpZW50RGlyZWN0aXZlLFxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4UHJvZ3Jlc3NCYXJNb2R1bGUgeyB9XG5cbiIsIjxkaXYgY2xhc3M9XCJpZ3gtbGluZWFyLWJhcl9fYmFzZVwiPlxuICAgIDxkaXYgI2luZGljYXRvciBjbGFzcz1cImlneC1saW5lYXItYmFyX19pbmRpY2F0b3JcIiBbc3R5bGUud2lkdGhdPVwiMFwiPjwvZGl2PlxuPC9kaXY+XG5cbjxzcGFuXG4gICAgY2xhc3M9XCJpZ3gtbGluZWFyLWJhcl9fdmFsdWVcIlxuICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgJ2lneC1saW5lYXItYmFyX192YWx1ZS0tc3RhcnQnOiB0ZXh0QWxpZ24gPT09ICdzdGFydCcsXG4gICAgICAgICdpZ3gtbGluZWFyLWJhcl9fdmFsdWUtLWNlbnRlcic6IHRleHRBbGlnbiA9PT0gJ2NlbnRlcicsXG4gICAgICAgICdpZ3gtbGluZWFyLWJhcl9fdmFsdWUtLWVuZCc6IHRleHRBbGlnbiA9PT0gJ2VuZCcsXG4gICAgICAgICdpZ3gtbGluZWFyLWJhcl9fdmFsdWUtLXRvcCc6IHRleHRUb3AsXG4gICAgICAgICdpZ3gtbGluZWFyLWJhcl9fdmFsdWUtLWhpZGRlbic6ICF0ZXh0VmlzaWJpbGl0eVxuICAgIH1cIj5cbiAgICAgICAge3t0ZXh0ID8gdGV4dCA6IHZhbHVlSW5QZXJjZW50ICsgJyUnfX1cbjwvc3Bhbj5cbiIsIjxzdmcgI3N2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgdmVyc2lvbj1cIjEuMVwiXG4gICAgdmlld0JveD1cIjAgMCAxMDAgMTAwXCJcbiAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiXG4gICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIlxuICAgIFthdHRyLmFyaWEtdmFsdWVub3ddPVwidmFsdWVcIj5cbiAgICA8c3ZnOmNpcmNsZSBjbGFzcz1cImlneC1jaXJjdWxhci1iYXJfX2lubmVyXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDZcIiAvPlxuICAgIDxzdmc6Y2lyY2xlICNjaXJjbGUgY2xhc3M9XCJpZ3gtY2lyY3VsYXItYmFyX19vdXRlclwiIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjQ2XCIgLz5cbiAgICA8c3ZnOnRleHQgKm5nSWY9XCJ0ZXh0VmlzaWJpbGl0eVwiIHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeD1cIjUwXCIgeT1cIjYwXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZXh0VGVtcGxhdGUgPyB0ZXh0VGVtcGxhdGUudGVtcGxhdGUgOiBkZWZhdWx0VGV4dFRlbXBsYXRlO1xuICAgICAgICAgICAgY29udGV4dDogY29udGV4dFwiPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L3N2Zzp0ZXh0PlxuXG4gICAgPHN2ZzpkZWZzPlxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cImdyYWRpZW50VGVtcGxhdGUgPyBncmFkaWVudFRlbXBsYXRlLnRlbXBsYXRlIDogZGVmYXVsdEdyYWRpZW50VGVtcGxhdGU7XG4gICAgICAgICAgICBjb250ZXh0OiB7ICRpbXBsaWNpdDogZ3JhZGllbnRJZCB9XCI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvc3ZnOmRlZnM+XG5cbiAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZXh0VGVtcGxhdGU+XG4gICAgICAgIDxzdmc6dHNwYW4gY2xhc3M9XCJpZ3gtY2lyY3VsYXItYmFyX190ZXh0XCI+XG4gICAgICAgICAgICB7e3RleHRDb250ZW50ID8gdGV4dENvbnRlbnQ6IHZhbHVlSW5QZXJjZW50ICsgJyUnfX1cbiAgICAgICAgPC9zdmc6dHNwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdEdyYWRpZW50VGVtcGxhdGU+XG4gICAgICAgIDxzdmc6bGluZWFyR3JhZGllbnQgW2lkXT1cImdyYWRpZW50SWRcIiBncmFkaWVudFRyYW5zZm9ybT1cInJvdGF0ZSg5MClcIj5cbiAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiICAgY2xhc3M9XCJpZ3gtY2lyY3VsYXItYmFyX19ncmFkaWVudC1zdGFydFwiIC8+XG4gICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIGNsYXNzPVwiaWd4LWNpcmN1bGFyLWJhcl9fZ3JhZGllbnQtZW5kXCIgLz5cbiAgICAgICAgPC9zdmc6bGluZWFyR3JhZGllbnQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbjwvc3ZnPlxuXG4iXX0=