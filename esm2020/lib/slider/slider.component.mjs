import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, NgModule, Output, ViewChild, TemplateRef, ContentChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { IgxSliderThumbComponent } from './thumb/thumb-slider.component';
import { Subject, merge, timer, noop } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { SliderHandle, IgxThumbFromTemplateDirective, IgxThumbToTemplateDirective, IgxSliderType, TicksOrientation, TickLabelsOrientation, IgxTickLabelTemplateDirective } from './slider.common';
import { IgxThumbLabelComponent } from './label/thumb-label.component';
import { IgxTicksComponent } from './ticks/ticks.component';
import { IgxTickLabelsPipe } from './ticks/tick.pipe';
import { resizeObservable } from '../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "../services/direction/directionality";
import * as i2 from "../core/utils";
import * as i3 from "@angular/common";
let NEXT_ID = 0;
/**
 * **Ignite UI for Angular Slider** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/slider/slider)
 *
 * The Ignite UI Slider allows selection in a given range by moving the thumb along the track. The track
 * can be defined as continuous or stepped, and you can choose between single and range slider types.
 *
 * Example:
 * ```html
 * <igx-slider id="slider"
 *            [minValue]="0" [maxValue]="100"
 *            [continuous]=true [(ngModel)]="volume">
 * </igx-slider>
 * ```
 */
export class IgxSliderComponent {
    constructor(renderer, _el, _cdr, _ngZone, _dir, platform) {
        this.renderer = renderer;
        this._el = _el;
        this._cdr = _cdr;
        this._ngZone = _ngZone;
        this._dir = _dir;
        this.platform = platform;
        /**
         * @hidden
         */
        this.role = 'slider';
        /**
         * @hidden
         */
        this.slierClass = true;
        /**
         * An @Input property that sets the value of the `id` attribute.
         * If not provided it will be automatically generated.
         * ```html
         * <igx-slider [id]="'igx-slider-32'" [(ngModel)]="task.percentCompleted" [step]="5" [lowerBound]="20">
         * ```
         */
        this.id = `igx-slider-${NEXT_ID++}`;
        /**
         * An @Input property that sets the duration visibility of thumbs labels. The default value is 750 milliseconds.
         * ```html
         * <igx-slider #slider [thumbLabelVisibilityDuration]="3000" [(ngModel)]="task.percentCompleted" [step]="5">
         * ```
         */
        this.thumbLabelVisibilityDuration = 750;
        /**
         * Show/hide slider ticks
         * ```html
         * <igx-slier [showTicks]="true" [primaryTicks]="5"></igx-slier>
         * ```
         */
        this.showTicks = false;
        /**
         * show/hide primary tick labels
         * ```html
         * <igx-slider [primaryTicks]="5" [primaryTickLabels]="false"></igx-slider>
         * ```
         */
        this.primaryTickLabels = true;
        /**
         * show/hide secondary tick labels
         * ```html
         * <igx-slider [secondaryTicks]="5" [secondaryTickLabels]="false"></igx-slider>
         * ```
         */
        this.secondaryTickLabels = true;
        /**
         * Changes ticks orientation:
         * bottom - The default orienation, below the slider track.
         * top - Above the slider track
         * mirror - combines top and bottom orientation.
         * ```html
         * <igx-slider [primaryTicks]="5" [ticksOrientation]="ticksOrientation"></igx-slider>
         * ```
         */
        this.ticksOrientation = TicksOrientation.Bottom;
        /**
         * Changes tick labels rotation:
         * horizontal - The default rotation
         * toptobottom - Rotates tick labels vertically to 90deg
         * bottomtotop - Rotate tick labels vertically to -90deg
         * ```html
         * <igx-slider [primaryTicks]="5" [secondaryTicks]="3" [tickLabelsOrientation]="tickLabelsOrientaiton"></igx-slider>
         * ```
         */
        this.tickLabelsOrientation = TickLabelsOrientation.Horizontal;
        /**
         * This event is emitted every time the value is changed.
         * ```typescript
         * public change(event){
         *    alert("The value has been changed!");
         * }
         * ```
         * ```html
         * <igx-slider (valueChange)="change($event)" #slider [(ngModel)]="task.percentCompleted" [step]="5">
         * ```
         */
        this.valueChange = new EventEmitter();
        /**
         * This event is emitted at the end of every slide interaction.
         * ```typescript
         * public change(event){
         *    alert("The value has been changed!");
         * }
         * ```
         * ```html
         * <igx-slider (dragFinished)="change($event)" #slider [(ngModel)]="task.percentCompleted" [step]="5">
         * ```
         */
        this.dragFinished = new EventEmitter();
        /**
         * @hidden
         */
        this.thumbs = new QueryList();
        /**
         * @hidden
         */
        this.labelRefs = new QueryList();
        /**
         * @hidden
         */
        this.onPan = new Subject();
        // Limit handle travel zone
        this._pMin = 0;
        this._pMax = 1;
        // From/upperValue in percent values
        this._hasViewInit = false;
        this._minValue = 0;
        this._maxValue = 100;
        this._continuous = false;
        this._disabled = false;
        this._step = 1;
        this._value = 0;
        // ticks
        this._primaryTicks = 0;
        this._secondaryTicks = 0;
        this._labels = new Array();
        this._type = IgxSliderType.SLIDER;
        this._destroyer$ = new Subject();
        this._indicatorsDestroyer$ = new Subject();
        this._onChangeCallback = noop;
        this._onTouchedCallback = noop;
        this.stepDistance = this._step;
    }
    /**
     * @hidden
     */
    get thumbFrom() {
        return this.thumbs.find(thumb => thumb.type === SliderHandle.FROM);
    }
    /**
     * @hidden
     */
    get thumbTo() {
        return this.thumbs.find(thumb => thumb.type === SliderHandle.TO);
    }
    get labelFrom() {
        return this.labelRefs.find(label => label.type === SliderHandle.FROM);
    }
    get labelTo() {
        return this.labelRefs.find(label => label.type === SliderHandle.TO);
    }
    /**
     * @hidden
     */
    get valuemin() {
        return this.minValue;
    }
    /**
     * @hidden
     */
    get valuemax() {
        return this.maxValue;
    }
    /**
     * @hidden
     */
    get readonly() {
        return this.disabled;
    }
    /**
     * @hidden
     */
    get disabledClass() {
        return this.disabled;
    }
    /**
     * An @Input property that gets the type of the `IgxSliderComponent`.
     * The slider can be IgxSliderType.SLIDER(default) or IgxSliderType.RANGE.
     * ```typescript
     * @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let type = this.slider.type;
     * }
     */
    get type() {
        return this._type;
    }
    /**
     * An @Input property that sets the type of the `IgxSliderComponent`.
     * The slider can be IgxSliderType.SLIDER(default) or IgxSliderType.RANGE.
     * ```typescript
     * sliderType: IgxSliderType = IgxSliderType.RANGE;
     * ```
     * ```html
     * <igx-slider #slider2 [type]="sliderType" [(ngModel)]="rangeValue" [minValue]="0" [maxValue]="100">
     * ```
     */
    set type(type) {
        this._type = type;
        if (type === IgxSliderType.SLIDER) {
            this.lowerValue = 0;
        }
        if (this.labelsViewEnabled && this.upperValue > this.maxValue) {
            this.upperValue = this.labels.length - 1;
        }
        if (this._hasViewInit) {
            this.updateTrack();
        }
    }
    /**
     * Enables `labelView`, by accepting a collection of primitive values with more than one element.
     * Each element will be equally spread over the slider and it will serve as a thumb label.
     * Once the property is set, it will precendence over {@link maxValue}, {@link minValue}, {@link step}.
     * This means that the manipulation for those properties won't be allowed.
     */
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        this._labels = labels;
        this._pMax = this.valueToFraction(this.upperBound, 0, 1);
        this._pMin = this.valueToFraction(this.lowerBound, 0, 1);
        this.positionHandlersAndUpdateTrack();
        if (this._hasViewInit) {
            this.stepDistance = this.calculateStepDistance();
            this.setTickInterval();
        }
    }
    /**
     * Returns the template context corresponding
     * to {@link IgxThumbFromTemplateDirective} and {@link IgxThumbToTemplateDirective} templates.
     *
     * ```typescript
     * return {
     *  $implicit // returns the value of the label,
     *  labels // returns the labels collection the user has passed.
     * }
     * ```
     */
    get context() {
        return {
            $implicit: this.value,
            labels: this.labels
        };
    }
    /**
     * An @Input property that sets the incremental/decremental step of the value when dragging the thumb.
     * The default step is 1, and step should not be less or equal than 0.
     * ```html
     * <igx-slider #slider [(ngModel)]="task.percentCompleted" [step]="5">
     * ```
     */
    set step(step) {
        this._step = step;
        if (this._hasViewInit) {
            this.stepDistance = this.calculateStepDistance();
            this.normalizeByStep(this._value);
            this.setValue(this._value, true);
            this.positionHandlersAndUpdateTrack();
            this.setTickInterval();
        }
    }
    /**
     * Returns the incremental/decremental dragging step of the {@link IgxSliderComponent}.
     * ```typescript
     * @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let step = this.slider.step;
     * }
     * ```
     */
    get step() {
        return this.labelsViewEnabled ? 1 : this._step;
    }
    /**
     * Returns if the {@link IgxSliderComponent} is disabled.
     * ```typescript
     * @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let isDisabled = this.slider.disabled;
     * }
     * ```
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * An @Input property that disables or enables UI interaction.
     * ```html
     * <igx-slider #slider [disabled]="'true'" [(ngModel)]="task.percentCompleted" [step]="5" [lowerBound]="20">
     * ```
     */
    set disabled(disable) {
        this._disabled = disable;
        if (this._hasViewInit) {
            this.changeThumbFocusableState(disable);
        }
    }
    /**
     * Returns if the {@link IgxSliderComponent} is set as continuous.
     * ```typescript
     * @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let continuous = this.slider.continuous;
     * }
     * ```
     */
    get continuous() {
        return this._continuous;
    }
    /**
     * An @Input property that marks the {@link IgxSliderComponent} as continuous.
     * By default is considered that the {@link IgxSliderComponent} is discrete.
     * Discrete {@link IgxSliderComponent} slider has step indicators over the track and visible thumb labels during interaction.
     * Continuous {@link IgxSliderComponent} does not have ticks and does not show bubble labels for values.
     * ```html
     * <igx-slider #slider [continuous]="'true'" [(ngModel)]="task.percentCompleted" [step]="5" [lowerBound]="20">
     * ```
     */
    set continuous(continuous) {
        this._continuous = continuous;
        if (this._hasViewInit) {
            this.setTickInterval();
        }
    }
    /**
     * Returns the minimal value of the `IgxSliderComponent`.
     * ```typescript
     *  @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let sliderMin = this.slider.minValue;
     * }
     * ```
     */
    get minValue() {
        if (this.labelsViewEnabled) {
            return 0;
        }
        return this._minValue;
    }
    /**
     * Sets the minimal value for the `IgxSliderComponent`.
     * The default minimal value is 0.
     * ```html
     * <igx-slider [type]="sliderType" [minValue]="56" [maxValue]="100">
     * ```
     */
    set minValue(value) {
        if (value >= this.maxValue) {
            return;
        }
        else {
            this._minValue = value;
        }
        if (value > this.upperBound) {
            this.updateUpperBoundAndMaxTravelZone();
            this.lowerBound = value;
        }
        // Refresh min travel zone limit.
        this._pMin = 0;
        // Recalculate step distance.
        this.positionHandlersAndUpdateTrack();
        if (this._hasViewInit) {
            this.stepDistance = this.calculateStepDistance();
            this.setTickInterval();
        }
    }
    /**
     * Returns the maximum value for the {@link IgxSliderComponent}.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let sliderMax = this.slider.maxValue;
     * }
     *  ```
     */
    get maxValue() {
        return this.labelsViewEnabled ?
            this.labels.length - 1 :
            this._maxValue;
    }
    /**
     * Sets the maximal value for the `IgxSliderComponent`.
     * The default maximum value is 100.
     * ```html
     * <igx-slider [type]="sliderType" [minValue]="56" [maxValue]="256">
     * ```
     */
    set maxValue(value) {
        if (value <= this._minValue) {
            return;
        }
        else {
            this._maxValue = value;
        }
        if (value < this.lowerBound) {
            this.updateLowerBoundAndMinTravelZone();
            this.upperBound = value;
        }
        // refresh max travel zone limits.
        this._pMax = 1;
        // recalculate step distance.
        this.positionHandlersAndUpdateTrack();
        if (this._hasViewInit) {
            this.stepDistance = this.calculateStepDistance();
            this.setTickInterval();
        }
    }
    /**
     * Returns the lower boundary of the `IgxSliderComponent`.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let sliderLowBound = this.slider.lowerBound;
     * }
     * ```
     */
    get lowerBound() {
        if (!Number.isNaN(this._lowerBound) && this._lowerBound !== undefined) {
            return this.valueInRange(this._lowerBound, this.minValue, this.maxValue);
        }
        return this.minValue;
    }
    /**
     * Sets the lower boundary of the `IgxSliderComponent`.
     * If not set is the same as min value.
     * ```html
     * <igx-slider [step]="5" [lowerBound]="20">
     * ```
     */
    set lowerBound(value) {
        if (value >= this.upperBound || (this.labelsViewEnabled && value < 0)) {
            return;
        }
        this._lowerBound = this.valueInRange(value, this.minValue, this.maxValue);
        // Refresh min travel zone.
        this._pMin = this.valueToFraction(this._lowerBound, 0, 1);
        this.positionHandlersAndUpdateTrack();
    }
    /**
     * Returns the upper boundary of the `IgxSliderComponent`.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *    let sliderUpBound = this.slider.upperBound;
     * }
     * ```
     */
    get upperBound() {
        if (!Number.isNaN(this._upperBound) && this._upperBound !== undefined) {
            return this.valueInRange(this._upperBound, this.minValue, this.maxValue);
        }
        return this.maxValue;
    }
    /**
     * Sets the upper boundary of the `IgxSliderComponent`.
     * If not set is the same as max value.
     * ```html
     * <igx-slider [step]="5" [upperBound]="20">
     * ```
     */
    set upperBound(value) {
        if (value <= this.lowerBound || (this.labelsViewEnabled && value > this.labels.length - 1)) {
            return;
        }
        this._upperBound = this.valueInRange(value, this.minValue, this.maxValue);
        // Refresh time travel zone.
        this._pMax = this.valueToFraction(this._upperBound, 0, 1);
        this.positionHandlersAndUpdateTrack();
    }
    /**
     * Returns the slider value. If the slider is of type {@link IgxSliderType.SLIDER} the returned value is number.
     * If the slider type is {@link IgxSliderType.RANGE}.
     * The returned value represents an object of {@link lowerValue} and {@link upperValue}.
     * ```typescript
     * @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * public sliderValue(event){
     *     let sliderVal = this.slider.value;
     * }
     * ```
     */
    get value() {
        if (this.isRange) {
            return {
                lower: this.valueInRange(this.lowerValue, this.lowerBound, this.upperBound),
                upper: this.valueInRange(this.upperValue, this.lowerBound, this.upperBound)
            };
        }
        else {
            return this.valueInRange(this.upperValue, this.lowerBound, this.upperBound);
        }
    }
    /**
     * Sets the slider value.
     * If the slider is of type {@link IgxSliderType.SLIDER}.
     * The argument is number. By default the {@link value} gets the {@link lowerBound}.
     * If the slider type is {@link IgxSliderType.RANGE} the argument
     * represents an object of {@link lowerValue} and {@link upperValue} properties.
     * By default the object is associated with the {@link lowerBound} and {@link upperBound} property values.
     * ```typescript
     * rangeValue = {
     *   lower: 30,
     *   upper: 60
     * };
     * ```
     * ```html
     * <igx-slider [type]="sliderType" [(ngModel)]="rangeValue" [minValue]="56" [maxValue]="256">
     * ```
     */
    set value(value) {
        this.normalizeByStep(value);
        if (this._hasViewInit) {
            this.setValue(this._value, true);
            this.positionHandlersAndUpdateTrack();
        }
    }
    /**
     * Returns the number of the presented primary ticks.
     * ```typescript
     * const primaryTicks = this.slider.primaryTicks;
     * ```
     */
    get primaryTicks() {
        if (this.labelsViewEnabled) {
            return this._primaryTicks = this.labels.length;
        }
        return this._primaryTicks;
    }
    /**
     * Sets the number of primary ticks. If {@link @labels} is enabled, this property won't function.
     * Insted enable ticks by {@link showTicks} property.
     * ```typescript
     * this.slider.primaryTicks = 5;
     * ```
     */
    set primaryTicks(val) {
        if (val <= 1) {
            return;
        }
        this._primaryTicks = val;
    }
    /**
     * Returns the number of the presented secondary ticks.
     * ```typescript
     * const secondaryTicks = this.slider.secondaryTicks;
     * ```
     */
    get secondaryTicks() {
        return this._secondaryTicks;
    }
    /**
     * Sets the number of secondary ticks. The property functions even when {@link labels} is enabled,
     * but all secondary ticks won't present any tick labels.
     * ```typescript
     * this.slider.secondaryTicks = 5;
     * ```
     */
    set secondaryTicks(val) {
        if (val < 1) {
            return;
        }
        this._secondaryTicks = val;
    }
    /**
     * @hidden
     */
    get deactivateThumbLabel() {
        return ((this.primaryTicks && this.primaryTickLabels) || (this.secondaryTicks && this.secondaryTickLabels)) &&
            (this.ticksOrientation === TicksOrientation.Top || this.ticksOrientation === TicksOrientation.Mirror);
    }
    /**
     * @hidden
     */
    onPointerDown($event) {
        this.findClosestThumb($event);
        if (!this.thumbTo.isActive && this.thumbFrom === undefined) {
            return;
        }
        const activeThumb = this.thumbTo.isActive ? this.thumbTo : this.thumbFrom;
        activeThumb.nativeElement.setPointerCapture($event.pointerId);
        this.showSliderIndicators();
        $event.preventDefault();
    }
    /**
     * @hidden
     */
    onPointerUp($event) {
        if (!this.thumbTo.isActive && this.thumbFrom === undefined) {
            return;
        }
        const activeThumb = this.thumbTo.isActive ? this.thumbTo : this.thumbTo;
        activeThumb.nativeElement.releasePointerCapture($event.pointerId);
        this.hideSliderIndicators();
        this.dragFinished.emit(this.value);
    }
    /**
     * @hidden
     */
    onFocus() {
        this.toggleSliderIndicators();
    }
    /**
     * @hidden
     */
    onPanListener($event) {
        this.update($event.srcEvent.clientX);
    }
    /**
     * Returns whether the `IgxSliderComponent` type is RANGE.
     * ```typescript
     *  @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * ngAfterViewInit(){
     *     let sliderRange = this.slider.isRange;
     * }
     * ```
     */
    get isRange() {
        return this.type === IgxSliderType.RANGE;
    }
    /**
     * Returns the lower value of the `IgxSliderComponent`.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * public lowValue(event){
     *    let sliderLowValue = this.slider.lowerValue;
     * }
     * ```
     */
    get lowerValue() {
        if (!Number.isNaN(this._lowerValue) && this._lowerValue !== undefined && this._lowerValue >= this.lowerBound) {
            return this._lowerValue;
        }
        return this.lowerBound;
    }
    /**
     * @hidden @internal
     */
    set lowerValue(value) {
        value = this.valueInRange(value, this.lowerBound, this.upperBound);
        this._lowerValue = value;
    }
    /**
     * Returns the upper value of the `IgxSliderComponent`.
     * ```typescript
     *  @ViewChild("slider2")
     * public slider: IgxSliderComponent;
     * public upperValue(event){
     *     let upperValue = this.slider.upperValue;
     * }
     * ```
     */
    get upperValue() {
        if (!Number.isNaN(this._upperValue) && this._upperValue !== undefined && this._upperValue <= this.upperBound) {
            return this._upperValue;
        }
        return this.upperBound;
    }
    /**
     * @hidden @internal
     */
    set upperValue(value) {
        value = this.valueInRange(value, this.lowerBound, this.upperBound);
        this._upperValue = value;
    }
    /**
     * Returns the value corresponding the lower label.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * let label = this.slider.lowerLabel;
     * ```
     */
    get lowerLabel() {
        return this.labelsViewEnabled ?
            this.labels[this.lowerValue] :
            this.lowerValue;
    }
    /**
     * Returns the value corresponding the upper label.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * let label = this.slider.upperLabel;
     * ```
     */
    get upperLabel() {
        return this.labelsViewEnabled ?
            this.labels[this.upperValue] :
            this.upperValue;
    }
    /**
     * Returns if label view is enabled.
     * If the {@link labels} is set, the view is automatically activated.
     * ```typescript
     * @ViewChild("slider")
     * public slider: IgxSliderComponent;
     * let labelView = this.slider.labelsViewEnabled;
     * ```
     */
    get labelsViewEnabled() {
        return !!(this.labels && this.labels.length > 1);
    }
    /**
     * @hidden
     */
    get showTopTicks() {
        return this.ticksOrientation === TicksOrientation.Top ||
            this.ticksOrientation === TicksOrientation.Mirror;
    }
    /**
     * @hidden
     */
    get showBottomTicks() {
        return this.ticksOrientation === TicksOrientation.Bottom ||
            this.ticksOrientation === TicksOrientation.Mirror;
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        if (changes.minValue && changes.maxValue &&
            changes.minValue.currentValue < changes.maxValue.currentValue) {
            this._maxValue = changes.maxValue.currentValue;
            this._minValue = changes.minValue.currentValue;
        }
        if (changes.step && changes.step.isFirstChange()) {
            this.normalizeByStep(this._value);
        }
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.sliderSetup();
        // Set track travel zone
        this._pMin = this.valueToFraction(this.lowerBound) || 0;
        this._pMax = this.valueToFraction(this.upperBound) || 1;
    }
    ngAfterContentInit() {
        this.setValue(this._value, false);
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        this._hasViewInit = true;
        this.stepDistance = this.calculateStepDistance();
        this.positionHandlersAndUpdateTrack();
        this.setTickInterval();
        this.changeThumbFocusableState(this.disabled);
        this.subscribeTo(this.thumbFrom, this.thumbChanged.bind(this));
        this.subscribeTo(this.thumbTo, this.thumbChanged.bind(this));
        this.thumbs.changes.pipe(takeUntil(this._destroyer$)).subscribe(change => {
            const thumbFrom = change.find((thumb) => thumb.type === SliderHandle.FROM);
            this.positionHandler(thumbFrom, null, this.lowerValue);
            this.subscribeTo(thumbFrom, this.thumbChanged.bind(this));
            this.changeThumbFocusableState(this.disabled);
        });
        this.labelRefs.changes.pipe(takeUntil(this._destroyer$)).subscribe(() => {
            const labelFrom = this.labelRefs.find((label) => label.type === SliderHandle.FROM);
            this.positionHandler(null, labelFrom, this.lowerValue);
        });
        this._ngZone.runOutsideAngular(() => {
            resizeObservable(this._el.nativeElement).pipe(throttleTime(40), takeUntil(this._destroyer$)).subscribe(() => this._ngZone.run(() => {
                this.stepDistance = this.calculateStepDistance();
            }));
        });
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this._destroyer$.next(true);
        this._destroyer$.complete();
        this._indicatorsDestroyer$.next(true);
        this._indicatorsDestroyer$.complete();
    }
    /**
     * @hidden
     */
    writeValue(value) {
        if (!value) {
            return;
        }
        this.normalizeByStep(value);
        this.setValue(this._value, false);
        this.positionHandlersAndUpdateTrack();
    }
    /**
     * @hidden
     */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /**
     * @hidden
     */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /** @hidden */
    getEditElement() {
        return this.isRange ? this.thumbFrom.nativeElement : this.thumbTo.nativeElement;
    }
    /**
     *
     * @hidden
     */
    update(mouseX) {
        if (this.disabled) {
            return;
        }
        // Update To/From Values
        this.onPan.next(mouseX);
        // Finally do positionHandlersAndUpdateTrack the DOM
        // based on data values
        this.positionHandlersAndUpdateTrack();
        this._onTouchedCallback();
    }
    /**
     * @hidden
     */
    thumbChanged(value, thumbType) {
        const oldValue = this.value;
        let newVal;
        if (this.isRange) {
            if (thumbType === SliderHandle.FROM) {
                newVal = {
                    lower: this.value.lower + value,
                    upper: this.value.upper
                };
            }
            else {
                newVal = {
                    lower: this.value.lower,
                    upper: this.value.upper + value
                };
            }
            // Swap the thumbs if a collision appears.
            if (newVal.lower >= newVal.upper) {
                this.value = this.swapThumb(newVal);
            }
            else {
                this.value = newVal;
            }
        }
        else {
            this.value = this.value + value;
        }
        if (this.hasValueChanged(oldValue)) {
            this.emitValueChange(oldValue);
        }
    }
    /**
     * @hidden
     */
    onThumbChange() {
        this.toggleSliderIndicators();
    }
    /**
     * @hidden
     */
    onHoverChange(state) {
        return state ? this.showSliderIndicators() : this.hideSliderIndicators();
    }
    setValue(value, triggerChange) {
        let res;
        if (!this.isRange) {
            this.upperValue = value - (value % this.step);
            res = this.upperValue;
        }
        else {
            value = this.validateInitialValue(value);
            this.upperValue = value.upper;
            this.lowerValue = value.lower;
            res = { lower: this.lowerValue, upper: this.upperValue };
        }
        if (triggerChange) {
            this._onChangeCallback(res);
        }
    }
    swapThumb(value) {
        if (this.thumbFrom.isActive) {
            value.upper = this.upperValue;
            value.lower = this.upperValue;
        }
        else {
            value.upper = this.lowerValue;
            value.lower = this.lowerValue;
        }
        this.toggleThumb();
        return value;
    }
    findClosestThumb(event) {
        if (this.isRange) {
            this.closestHandle(event);
        }
        else {
            this.thumbTo.nativeElement.focus();
        }
        this.update(event.clientX);
    }
    updateLowerBoundAndMinTravelZone() {
        this.lowerBound = this.minValue;
        this._pMin = 0;
    }
    updateUpperBoundAndMaxTravelZone() {
        this.upperBound = this.maxValue;
        this._pMax = 1;
    }
    sliderSetup() {
        /**
         * if {@link SliderType.SLIDER} than the initial value shold be the lowest one.
         */
        if (!this.isRange && this._upperValue === undefined) {
            this._upperValue = this.lowerBound;
        }
    }
    calculateStepDistance() {
        return this._el.nativeElement.getBoundingClientRect().width / (this.maxValue - this.minValue) * this.step;
    }
    toggleThumb() {
        return this.thumbFrom.isActive ?
            this.thumbTo.nativeElement.focus() :
            this.thumbFrom.nativeElement.focus();
    }
    valueInRange(value, min = 0, max = 100) {
        return Math.max(Math.min(value, max), min);
    }
    generateTickMarks(color, interval) {
        return interval !== null ? `repeating-linear-gradient(
            ${'to left'},
            ${color},
            ${color} 1.5px,
            transparent 1.5px,
            transparent ${interval}%
        ), repeating-linear-gradient(
            ${'to right'},
            ${color},
            ${color} 1.5px,
            transparent 1.5px,
            transparent ${interval}%
        )` : interval;
    }
    positionHandler(thumbHandle, labelHandle, position) {
        const percent = `${this.valueToFraction(position) * 100}%`;
        const dir = this._dir.rtl ? 'right' : 'left';
        if (thumbHandle) {
            thumbHandle.nativeElement.style[dir] = percent;
        }
        if (labelHandle) {
            labelHandle.nativeElement.style[dir] = percent;
        }
    }
    positionHandlersAndUpdateTrack() {
        if (!this.isRange) {
            this.positionHandler(this.thumbTo, this.labelTo, this.value);
        }
        else {
            this.positionHandler(this.thumbTo, this.labelTo, this.value.upper);
            this.positionHandler(this.thumbFrom, this.labelFrom, this.value.lower);
        }
        if (this._hasViewInit) {
            this.updateTrack();
        }
    }
    closestHandle(event) {
        const fromOffset = this.thumbFrom.nativeElement.offsetLeft + this.thumbFrom.nativeElement.offsetWidth / 2;
        const toOffset = this.thumbTo.nativeElement.offsetLeft + this.thumbTo.nativeElement.offsetWidth / 2;
        const xPointer = event.clientX - this._el.nativeElement.getBoundingClientRect().left;
        const match = this.closestTo(xPointer, [fromOffset, toOffset]);
        if (fromOffset === toOffset && toOffset < xPointer) {
            this.thumbTo.nativeElement.focus();
        }
        else if (fromOffset === toOffset && toOffset > xPointer) {
            this.thumbFrom.nativeElement.focus();
        }
        else if (match === fromOffset) {
            this.thumbFrom.nativeElement.focus();
        }
        else {
            this.thumbTo.nativeElement.focus();
        }
    }
    setTickInterval() {
        let interval;
        const trackProgress = 100;
        if (this.labelsViewEnabled) {
            // Calc ticks depending on the labels length;
            interval = ((trackProgress / (this.labels.length - 1) * 10)) / 10;
        }
        else {
            const trackRange = this.maxValue - this.minValue;
            interval = this.step > 1 ?
                (trackProgress / ((trackRange / this.step)) * 10) / 10
                : null;
        }
        const renderCallbackExecution = !this.continuous ? this.generateTickMarks('var(--igx-slider-track-step-color, var(--track-step-color, white))', interval) : null;
        this.renderer.setStyle(this.ticks.nativeElement, 'background', renderCallbackExecution);
    }
    showSliderIndicators() {
        if (this.disabled) {
            return;
        }
        if (this._indicatorsTimer) {
            this._indicatorsDestroyer$.next(true);
            this._indicatorsTimer = null;
        }
        this.thumbTo.showThumbIndicators();
        this.labelTo.active = true;
        if (this.thumbFrom) {
            this.thumbFrom.showThumbIndicators();
        }
        if (this.labelFrom) {
            this.labelFrom.active = true;
        }
    }
    hideSliderIndicators() {
        if (this.disabled) {
            return;
        }
        this._indicatorsTimer = timer(this.thumbLabelVisibilityDuration);
        this._indicatorsTimer.pipe(takeUntil(this._indicatorsDestroyer$)).subscribe(() => {
            this.thumbTo.hideThumbIndicators();
            this.labelTo.active = false;
            if (this.thumbFrom) {
                this.thumbFrom.hideThumbIndicators();
            }
            if (this.labelFrom) {
                this.labelFrom.active = false;
            }
        });
    }
    toggleSliderIndicators() {
        this.showSliderIndicators();
        this.hideSliderIndicators();
    }
    changeThumbFocusableState(state) {
        const value = state ? -1 : 1;
        if (this.isRange) {
            this.thumbFrom.tabindex = value;
        }
        this.thumbTo.tabindex = value;
        this._cdr.detectChanges();
    }
    closestTo(goal, positions) {
        return positions.reduce((previous, current) => (Math.abs(goal - current) < Math.abs(goal - previous) ? current : previous));
    }
    valueToFraction(value, pMin = this._pMin, pMax = this._pMax) {
        return this.valueInRange((value - this.minValue) / (this.maxValue - this.minValue), pMin, pMax);
    }
    /**
     * @hidden
     * Normalizе the value when two-way data bind is used and {@link this.step} is set.
     * @param value
     */
    normalizeByStep(value) {
        if (this.isRange) {
            this._value = {
                lower: value.lower - (value.lower % this.step),
                upper: value.upper - (value.upper % this.step)
            };
        }
        else {
            this._value = value - (value % this.step);
        }
    }
    updateTrack() {
        const fromPosition = this.valueToFraction(this.lowerValue);
        const toPosition = this.valueToFraction(this.upperValue);
        const positionGap = toPosition - fromPosition;
        let trackLeftIndention = fromPosition;
        if (this.isRange) {
            if (positionGap) {
                trackLeftIndention = Math.round((1 / positionGap * fromPosition) * 100);
            }
            trackLeftIndention = this._dir.rtl ? -trackLeftIndention : trackLeftIndention;
            this.renderer.setStyle(this.trackRef.nativeElement, 'transform', `scaleX(${positionGap}) translateX(${trackLeftIndention}%)`);
        }
        else {
            this.renderer.setStyle(this.trackRef.nativeElement, 'transform', `scaleX(${toPosition})`);
        }
    }
    validateInitialValue(value) {
        if (value.lower < this.lowerBound && value.upper < this.lowerBound) {
            value.upper = this.lowerBound;
            value.lower = this.lowerBound;
        }
        if (value.lower > this.upperBound && value.upper > this.upperBound) {
            value.upper = this.upperBound;
            value.lower = this.upperBound;
        }
        if (value.upper < value.lower) {
            value.upper = this.upperValue;
            value.lower = this.lowerValue;
        }
        return value;
    }
    subscribeTo(thumb, callback) {
        if (!thumb) {
            return;
        }
        thumb.thumbValueChange
            .pipe(takeUntil(this.unsubscriber(thumb)))
            .subscribe(value => callback(value, thumb.type));
    }
    unsubscriber(thumb) {
        return merge(this._destroyer$, thumb.destroy);
    }
    hasValueChanged(oldValue) {
        const isSliderWithDifferentValue = !this.isRange && oldValue !== this.value;
        const isRangeWithOneDifferentValue = this.isRange &&
            (oldValue.lower !== this.value.lower ||
                oldValue.upper !== this.value.upper);
        return isSliderWithDifferentValue || isRangeWithOneDifferentValue;
    }
    emitValueChange(oldValue) {
        this.valueChange.emit({ oldValue, value: this.value });
    }
}
IgxSliderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSliderComponent, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i1.IgxDirectionality }, { token: i2.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxSliderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSliderComponent, selector: "igx-slider", inputs: { id: "id", thumbLabelVisibilityDuration: "thumbLabelVisibilityDuration", type: "type", labels: "labels", step: "step", disabled: "disabled", continuous: "continuous", minValue: "minValue", maxValue: "maxValue", lowerBound: "lowerBound", upperBound: "upperBound", value: "value", primaryTicks: "primaryTicks", secondaryTicks: "secondaryTicks", showTicks: "showTicks", primaryTickLabels: "primaryTickLabels", secondaryTickLabels: "secondaryTickLabels", ticksOrientation: "ticksOrientation", tickLabelsOrientation: "tickLabelsOrientation" }, outputs: { valueChange: "valueChange", dragFinished: "dragFinished" }, host: { listeners: { "pointerdown": "onPointerDown($event)", "pointerup": "onPointerUp($event)", "focus": "onFocus()", "pan": "onPanListener($event)" }, properties: { "attr.role": "this.role", "class.igx-slider": "this.slierClass", "attr.id": "this.id", "attr.aria-valuemin": "this.valuemin", "attr.aria-valuemax": "this.valuemax", "attr.aria-readonly": "this.readonly", "class.igx-slider--disabled": "this.disabledClass" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxSliderComponent, multi: true }], queries: [{ propertyName: "thumbFromTemplateRef", first: true, predicate: IgxThumbFromTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "thumbToTemplateRef", first: true, predicate: IgxThumbToTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "tickLabelTemplateRef", first: true, predicate: IgxTickLabelTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "trackRef", first: true, predicate: ["track"], descendants: true, static: true }, { propertyName: "ticks", first: true, predicate: ["ticks"], descendants: true, static: true }, { propertyName: "thumbs", predicate: IgxSliderThumbComponent, descendants: true }, { propertyName: "labelRefs", predicate: IgxThumbLabelComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"igx-slider__track\">\n    <igx-ticks\n        *ngIf=\"showTicks && showTopTicks\"\n        ticksOrientation=\"top\"\n        [primaryTicks]=\"primaryTicks\"\n        [secondaryTicks]=\"secondaryTicks\"\n        [primaryTickLabels]=\"primaryTickLabels\"\n        [secondaryTickLabels]=\"secondaryTickLabels\"\n        [tickLabelsOrientation]=\"tickLabelsOrientation\"\n        [labelsViewEnabled]=\"labelsViewEnabled\"\n        [labels]=\"labels | spreadTickLabels:secondaryTicks\"\n        [tickLabelTemplateRef]=\"tickLabelTemplateRef\"\n        [minValue]=\"minValue\"\n        [maxValue]=\"maxValue\"></igx-ticks>\n\n    <div #track class=\"igx-slider__track-fill\"></div>\n    <div #ticks class=\"igx-slider__track-steps\"></div>\n\n    <igx-ticks\n        *ngIf=\"showTicks && showBottomTicks\"\n        ticksOrientation=\"bottom\"\n        [primaryTicks]=\"primaryTicks\"\n        [secondaryTicks]=\"secondaryTicks\"\n        [primaryTickLabels]=\"primaryTickLabels\"\n        [secondaryTickLabels]=\"secondaryTickLabels\"\n        [tickLabelsOrientation]=\"tickLabelsOrientation\"\n        [labelsViewEnabled]=\"labelsViewEnabled\"\n        [labels]=\"labels | spreadTickLabels:secondaryTicks\"\n        [tickLabelTemplateRef]=\"tickLabelTemplateRef\"\n        [minValue]=\"minValue\"\n        [maxValue]=\"maxValue\"></igx-ticks>\n</div>\n<div class=\"igx-slider__thumbs\">\n    <igx-thumb-label\n        *ngIf=\"isRange\"\n        type=\"from\"\n        [value]=\"lowerLabel\"\n        [templateRef]=\"thumbFromTemplateRef\"\n        [continuous]=\"continuous\"\n        [context]=\"context\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumb]=\"thumbFrom\"></igx-thumb-label>\n\n    <igx-thumb\n        *ngIf=\"isRange\"\n        #thumbFrom\n        type=\"from\"\n        [value]=\"lowerLabel\"\n        [disabled]=\"disabled\"\n        [continuous]=\"continuous\"\n        [onPan]=\"onPan\"\n        [stepDistance]=\"stepDistance\"\n        [step]=\"step\"\n        [templateRef]=\"thumbFromTemplateRef\"\n        [context]=\"context\"\n        (thumbChange)=\"onThumbChange()\"\n        (hoverChange)=\"onHoverChange($event)\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumbLabelVisibilityDuration]=\"thumbLabelVisibilityDuration\"></igx-thumb>\n\n    <igx-thumb-label\n        [value]=\"upperLabel\"\n        type=\"to\"\n        [templateRef]=\"thumbToTemplateRef\"\n        [continuous]=\"continuous\"\n        [context]=\"context\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumb]=\"thumbTo\"></igx-thumb-label>\n\n    <igx-thumb\n        #thumbTo\n        type=\"to\"\n        [value]=\"upperLabel\"\n        [disabled]=\"disabled\"\n        [continuous]=\"continuous\"\n        [onPan]=\"onPan\"\n        [stepDistance]=\"stepDistance\"\n        [step]=\"step\"\n        [templateRef]=\"thumbToTemplateRef\"\n        [context]=\"context\"\n        (thumbChange)=\"onThumbChange()\"\n        (hoverChange)=\"onHoverChange($event)\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumbLabelVisibilityDuration]=\"thumbLabelVisibilityDuration\"></igx-thumb>\n</div>\n", components: [{ type: i0.forwardRef(function () { return IgxTicksComponent; }), selector: "igx-ticks", inputs: ["primaryTicks", "secondaryTicks", "primaryTickLabels", "secondaryTickLabels", "ticksOrientation", "tickLabelsOrientation", "maxValue", "minValue", "labelsViewEnabled", "labels", "tickLabelTemplateRef"] }, { type: i0.forwardRef(function () { return IgxThumbLabelComponent; }), selector: "igx-thumb-label", inputs: ["value", "templateRef", "context", "type", "continuous", "deactiveState", "thumb"] }, { type: i0.forwardRef(function () { return IgxSliderThumbComponent; }), selector: "igx-thumb", inputs: ["value", "continuous", "thumbLabelVisibilityDuration", "disabled", "onPan", "stepDistance", "step", "templateRef", "context", "type", "deactiveState"], outputs: ["thumbValueChange", "thumbChange", "hoverChange"] }], directives: [{ type: i0.forwardRef(function () { return i3.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "spreadTickLabels": i0.forwardRef(function () { return IgxTickLabelsPipe; }) } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSliderComponent, decorators: [{
            type: Component,
            args: [{ providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxSliderComponent, multi: true }], selector: 'igx-slider', template: "<div class=\"igx-slider__track\">\n    <igx-ticks\n        *ngIf=\"showTicks && showTopTicks\"\n        ticksOrientation=\"top\"\n        [primaryTicks]=\"primaryTicks\"\n        [secondaryTicks]=\"secondaryTicks\"\n        [primaryTickLabels]=\"primaryTickLabels\"\n        [secondaryTickLabels]=\"secondaryTickLabels\"\n        [tickLabelsOrientation]=\"tickLabelsOrientation\"\n        [labelsViewEnabled]=\"labelsViewEnabled\"\n        [labels]=\"labels | spreadTickLabels:secondaryTicks\"\n        [tickLabelTemplateRef]=\"tickLabelTemplateRef\"\n        [minValue]=\"minValue\"\n        [maxValue]=\"maxValue\"></igx-ticks>\n\n    <div #track class=\"igx-slider__track-fill\"></div>\n    <div #ticks class=\"igx-slider__track-steps\"></div>\n\n    <igx-ticks\n        *ngIf=\"showTicks && showBottomTicks\"\n        ticksOrientation=\"bottom\"\n        [primaryTicks]=\"primaryTicks\"\n        [secondaryTicks]=\"secondaryTicks\"\n        [primaryTickLabels]=\"primaryTickLabels\"\n        [secondaryTickLabels]=\"secondaryTickLabels\"\n        [tickLabelsOrientation]=\"tickLabelsOrientation\"\n        [labelsViewEnabled]=\"labelsViewEnabled\"\n        [labels]=\"labels | spreadTickLabels:secondaryTicks\"\n        [tickLabelTemplateRef]=\"tickLabelTemplateRef\"\n        [minValue]=\"minValue\"\n        [maxValue]=\"maxValue\"></igx-ticks>\n</div>\n<div class=\"igx-slider__thumbs\">\n    <igx-thumb-label\n        *ngIf=\"isRange\"\n        type=\"from\"\n        [value]=\"lowerLabel\"\n        [templateRef]=\"thumbFromTemplateRef\"\n        [continuous]=\"continuous\"\n        [context]=\"context\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumb]=\"thumbFrom\"></igx-thumb-label>\n\n    <igx-thumb\n        *ngIf=\"isRange\"\n        #thumbFrom\n        type=\"from\"\n        [value]=\"lowerLabel\"\n        [disabled]=\"disabled\"\n        [continuous]=\"continuous\"\n        [onPan]=\"onPan\"\n        [stepDistance]=\"stepDistance\"\n        [step]=\"step\"\n        [templateRef]=\"thumbFromTemplateRef\"\n        [context]=\"context\"\n        (thumbChange)=\"onThumbChange()\"\n        (hoverChange)=\"onHoverChange($event)\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumbLabelVisibilityDuration]=\"thumbLabelVisibilityDuration\"></igx-thumb>\n\n    <igx-thumb-label\n        [value]=\"upperLabel\"\n        type=\"to\"\n        [templateRef]=\"thumbToTemplateRef\"\n        [continuous]=\"continuous\"\n        [context]=\"context\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumb]=\"thumbTo\"></igx-thumb-label>\n\n    <igx-thumb\n        #thumbTo\n        type=\"to\"\n        [value]=\"upperLabel\"\n        [disabled]=\"disabled\"\n        [continuous]=\"continuous\"\n        [onPan]=\"onPan\"\n        [stepDistance]=\"stepDistance\"\n        [step]=\"step\"\n        [templateRef]=\"thumbToTemplateRef\"\n        [context]=\"context\"\n        (thumbChange)=\"onThumbChange()\"\n        (hoverChange)=\"onHoverChange($event)\"\n        [deactiveState]=\"deactivateThumbLabel\"\n        [thumbLabelVisibilityDuration]=\"thumbLabelVisibilityDuration\"></igx-thumb>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i1.IgxDirectionality }, { type: i2.PlatformUtil }]; }, propDecorators: { trackRef: [{
                type: ViewChild,
                args: ['track', { static: true }]
            }], thumbFromTemplateRef: [{
                type: ContentChild,
                args: [IgxThumbFromTemplateDirective, { read: TemplateRef }]
            }], thumbToTemplateRef: [{
                type: ContentChild,
                args: [IgxThumbToTemplateDirective, { read: TemplateRef }]
            }], tickLabelTemplateRef: [{
                type: ContentChild,
                args: [IgxTickLabelTemplateDirective, { read: TemplateRef, static: false }]
            }], role: [{
                type: HostBinding,
                args: [`attr.role`]
            }], slierClass: [{
                type: HostBinding,
                args: ['class.igx-slider']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], thumbLabelVisibilityDuration: [{
                type: Input
            }], valuemin: [{
                type: HostBinding,
                args: [`attr.aria-valuemin`]
            }], valuemax: [{
                type: HostBinding,
                args: [`attr.aria-valuemax`]
            }], readonly: [{
                type: HostBinding,
                args: [`attr.aria-readonly`]
            }], disabledClass: [{
                type: HostBinding,
                args: ['class.igx-slider--disabled']
            }], type: [{
                type: Input
            }], labels: [{
                type: Input
            }], step: [{
                type: Input
            }], disabled: [{
                type: Input
            }], continuous: [{
                type: Input
            }], minValue: [{
                type: Input
            }], maxValue: [{
                type: Input
            }], lowerBound: [{
                type: Input
            }], upperBound: [{
                type: Input
            }], value: [{
                type: Input
            }], primaryTicks: [{
                type: Input
            }], secondaryTicks: [{
                type: Input
            }], showTicks: [{
                type: Input
            }], primaryTickLabels: [{
                type: Input
            }], secondaryTickLabels: [{
                type: Input
            }], ticksOrientation: [{
                type: Input
            }], tickLabelsOrientation: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], dragFinished: [{
                type: Output
            }], ticks: [{
                type: ViewChild,
                args: ['ticks', { static: true }]
            }], thumbs: [{
                type: ViewChildren,
                args: [IgxSliderThumbComponent]
            }], labelRefs: [{
                type: ViewChildren,
                args: [IgxThumbLabelComponent]
            }], onPointerDown: [{
                type: HostListener,
                args: ['pointerdown', ['$event']]
            }], onPointerUp: [{
                type: HostListener,
                args: ['pointerup', ['$event']]
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onPanListener: [{
                type: HostListener,
                args: ['pan', ['$event']]
            }] } });
/**
 * @hidden
 */
export class IgxSliderModule {
}
IgxSliderModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxSliderModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSliderModule, declarations: [IgxSliderComponent, IgxThumbFromTemplateDirective,
        IgxThumbToTemplateDirective,
        IgxTickLabelTemplateDirective,
        IgxSliderThumbComponent,
        IgxThumbLabelComponent,
        IgxTicksComponent,
        IgxTickLabelsPipe], imports: [CommonModule, FormsModule], exports: [IgxSliderComponent, IgxThumbFromTemplateDirective,
        IgxThumbToTemplateDirective,
        IgxTickLabelTemplateDirective] });
IgxSliderModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSliderModule, imports: [[CommonModule, FormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSliderModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxSliderComponent,
                        IgxThumbFromTemplateDirective,
                        IgxThumbToTemplateDirective,
                        IgxTickLabelTemplateDirective,
                        IgxSliderThumbComponent,
                        IgxThumbLabelComponent,
                        IgxTicksComponent,
                        IgxTickLabelsPipe
                    ],
                    exports: [
                        IgxSliderComponent,
                        IgxThumbFromTemplateDirective,
                        IgxThumbToTemplateDirective,
                        IgxTickLabelTemplateDirective
                    ],
                    imports: [CommonModule, FormsModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zbGlkZXIvc2xpZGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zbGlkZXIvc2xpZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ1ksU0FBUyxFQUFjLFlBQVksRUFDbEQsV0FBVyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQVUsTUFBTSxFQUM1QyxTQUFTLEVBQ1QsV0FBVyxFQUNYLFlBQVksRUFFWixZQUFZLEVBQ1osWUFBWSxFQUNaLFNBQVMsRUFNWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFjLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQ0gsWUFBWSxFQUNaLDZCQUE2QixFQUM3QiwyQkFBMkIsRUFFM0IsYUFBYSxFQUViLGdCQUFnQixFQUNoQixxQkFBcUIsRUFDckIsNkJBQTZCLEVBQ2hDLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGlCQUFp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LDZCQUE2Qjs2R0FJeEIsZUFBZSxZQUZmLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQzsyRkFFM0IsZUFBZTtrQkFuQjNCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLGtCQUFrQjt3QkFDbEIsNkJBQTZCO3dCQUM3QiwyQkFBMkI7d0JBQzNCLDZCQUE2Qjt3QkFDN0IsdUJBQXVCO3dCQUN2QixzQkFBc0I7d0JBQ3RCLGlCQUFpQjt3QkFDakIsaUJBQWlCO3FCQUNwQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsa0JBQWtCO3dCQUNsQiw2QkFBNkI7d0JBQzdCLDJCQUEyQjt3QkFDM0IsNkJBQTZCO3FCQUNoQztvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO2lCQUN2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RCaW5kaW5nLCBJbnB1dCwgTmdNb2R1bGUsIE9uSW5pdCwgT3V0cHV0LCBSZW5kZXJlcjIsXG4gICAgVmlld0NoaWxkLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBRdWVyeUxpc3QsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgT25DaGFuZ2VzLFxuICAgIE5nWm9uZSxcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IsIEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRWRpdG9yUHJvdmlkZXIgfSBmcm9tICcuLi9jb3JlL2VkaXQtcHJvdmlkZXInO1xuaW1wb3J0IHsgSWd4U2xpZGVyVGh1bWJDb21wb25lbnQgfSBmcm9tICcuL3RodW1iL3RodW1iLXNsaWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3ViamVjdCwgbWVyZ2UsIE9ic2VydmFibGUsIHRpbWVyLCBub29wIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIHRocm90dGxlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gICAgU2xpZGVySGFuZGxlLFxuICAgIElneFRodW1iRnJvbVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIElneFRodW1iVG9UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJUmFuZ2VTbGlkZXJWYWx1ZSxcbiAgICBJZ3hTbGlkZXJUeXBlLFxuICAgIElTbGlkZXJWYWx1ZUNoYW5nZUV2ZW50QXJncyxcbiAgICBUaWNrc09yaWVudGF0aW9uLFxuICAgIFRpY2tMYWJlbHNPcmllbnRhdGlvbixcbiAgICBJZ3hUaWNrTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZVxufSBmcm9tICcuL3NsaWRlci5jb21tb24nO1xuaW1wb3J0IHsgSWd4VGh1bWJMYWJlbENvbXBvbmVudCB9IGZyb20gJy4vbGFiZWwvdGh1bWItbGFiZWwuY29tcG9uZW50JztcbmltcG9ydCB7IElneFRpY2tzQ29tcG9uZW50IH0gZnJvbSAnLi90aWNrcy90aWNrcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4VGlja0xhYmVsc1BpcGUgfSBmcm9tICcuL3RpY2tzL3RpY2sucGlwZSc7XG5pbXBvcnQgeyBQbGF0Zm9ybVV0aWwsIHJlc2l6ZU9ic2VydmFibGUgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnLi4vc2VydmljZXMvZGlyZWN0aW9uL2RpcmVjdGlvbmFsaXR5JztcblxubGV0IE5FWFRfSUQgPSAwO1xuXG4vKipcbiAqICoqSWduaXRlIFVJIGZvciBBbmd1bGFyIFNsaWRlcioqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9zbGlkZXIvc2xpZGVyKVxuICpcbiAqIFRoZSBJZ25pdGUgVUkgU2xpZGVyIGFsbG93cyBzZWxlY3Rpb24gaW4gYSBnaXZlbiByYW5nZSBieSBtb3ZpbmcgdGhlIHRodW1iIGFsb25nIHRoZSB0cmFjay4gVGhlIHRyYWNrXG4gKiBjYW4gYmUgZGVmaW5lZCBhcyBjb250aW51b3VzIG9yIHN0ZXBwZWQsIGFuZCB5b3UgY2FuIGNob29zZSBiZXR3ZWVuIHNpbmdsZSBhbmQgcmFuZ2Ugc2xpZGVyIHR5cGVzLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBodG1sXG4gKiA8aWd4LXNsaWRlciBpZD1cInNsaWRlclwiXG4gKiAgICAgICAgICAgIFttaW5WYWx1ZV09XCIwXCIgW21heFZhbHVlXT1cIjEwMFwiXG4gKiAgICAgICAgICAgIFtjb250aW51b3VzXT10cnVlIFsobmdNb2RlbCldPVwidm9sdW1lXCI+XG4gKiA8L2lneC1zbGlkZXI+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IElneFNsaWRlckNvbXBvbmVudCwgbXVsdGk6IHRydWUgfV0sXG4gICAgc2VsZWN0b3I6ICdpZ3gtc2xpZGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3NsaWRlci5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4U2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHNcbiAgICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBFZGl0b3JQcm92aWRlcixcbiAgICBPbkluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3kge1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRodW1iRnJvbSgpOiBJZ3hTbGlkZXJUaHVtYkNvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnRodW1icy5maW5kKHRodW1iID0+IHRodW1iLnR5cGUgPT09IFNsaWRlckhhbmRsZS5GUk9NKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCB0aHVtYlRvKCk6IElneFNsaWRlclRodW1iQ29tcG9uZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGh1bWJzLmZpbmQodGh1bWIgPT4gdGh1bWIudHlwZSA9PT0gU2xpZGVySGFuZGxlLlRPKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBsYWJlbEZyb20oKTogSWd4VGh1bWJMYWJlbENvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhYmVsUmVmcy5maW5kKGxhYmVsID0+IGxhYmVsLnR5cGUgPT09IFNsaWRlckhhbmRsZS5GUk9NKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBsYWJlbFRvKCk6IElneFRodW1iTGFiZWxDb21wb25lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5sYWJlbFJlZnMuZmluZChsYWJlbCA9PiBsYWJlbC50eXBlID09PSBTbGlkZXJIYW5kbGUuVE8pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCd0cmFjaycsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIHRyYWNrUmVmOiBFbGVtZW50UmVmO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4VGh1bWJGcm9tVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgdGh1bWJGcm9tVGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hUaHVtYlRvVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgdGh1bWJUb1RlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4VGlja0xhYmVsVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgICBwdWJsaWMgdGlja0xhYmVsVGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKGBhdHRyLnJvbGVgKVxuICAgIHB1YmxpYyByb2xlID0gJ3NsaWRlcic7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtc2xpZGVyJylcbiAgICBwdWJsaWMgc2xpZXJDbGFzcyA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYGlkYCBhdHRyaWJ1dGUuXG4gICAgICogSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2xpZGVyIFtpZF09XCInaWd4LXNsaWRlci0zMidcIiBbKG5nTW9kZWwpXT1cInRhc2sucGVyY2VudENvbXBsZXRlZFwiIFtzdGVwXT1cIjVcIiBbbG93ZXJCb3VuZF09XCIyMFwiPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5pZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWQgPSBgaWd4LXNsaWRlci0ke05FWFRfSUQrK31gO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgZHVyYXRpb24gdmlzaWJpbGl0eSBvZiB0aHVtYnMgbGFiZWxzLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyA3NTAgbWlsbGlzZWNvbmRzLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNsaWRlciAjc2xpZGVyIFt0aHVtYkxhYmVsVmlzaWJpbGl0eUR1cmF0aW9uXT1cIjMwMDBcIiBbKG5nTW9kZWwpXT1cInRhc2sucGVyY2VudENvbXBsZXRlZFwiIFtzdGVwXT1cIjVcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0aHVtYkxhYmVsVmlzaWJpbGl0eUR1cmF0aW9uID0gNzUwO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZyhgYXR0ci5hcmlhLXZhbHVlbWluYClcbiAgICBwdWJsaWMgZ2V0IHZhbHVlbWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taW5WYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKGBhdHRyLmFyaWEtdmFsdWVtYXhgKVxuICAgIHB1YmxpYyBnZXQgdmFsdWVtYXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1heFZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoYGF0dHIuYXJpYS1yZWFkb25seWApXG4gICAgcHVibGljIGdldCByZWFkb25seSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LXNsaWRlci0tZGlzYWJsZWQnKVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWRDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgZ2V0cyB0aGUgdHlwZSBvZiB0aGUgYElneFNsaWRlckNvbXBvbmVudGAuXG4gICAgICogVGhlIHNsaWRlciBjYW4gYmUgSWd4U2xpZGVyVHlwZS5TTElERVIoZGVmYXVsdCkgb3IgSWd4U2xpZGVyVHlwZS5SQU5HRS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlcjJcIilcbiAgICAgKiBwdWJsaWMgc2xpZGVyOiBJZ3hTbGlkZXJDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgIGxldCB0eXBlID0gdGhpcy5zbGlkZXIudHlwZTtcbiAgICAgKiB9XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlIGFzIElneFNsaWRlclR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgdHlwZSBvZiB0aGUgYElneFNsaWRlckNvbXBvbmVudGAuXG4gICAgICogVGhlIHNsaWRlciBjYW4gYmUgSWd4U2xpZGVyVHlwZS5TTElERVIoZGVmYXVsdCkgb3IgSWd4U2xpZGVyVHlwZS5SQU5HRS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogc2xpZGVyVHlwZTogSWd4U2xpZGVyVHlwZSA9IElneFNsaWRlclR5cGUuUkFOR0U7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2xpZGVyICNzbGlkZXIyIFt0eXBlXT1cInNsaWRlclR5cGVcIiBbKG5nTW9kZWwpXT1cInJhbmdlVmFsdWVcIiBbbWluVmFsdWVdPVwiMFwiIFttYXhWYWx1ZV09XCIxMDBcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHR5cGUodHlwZTogSWd4U2xpZGVyVHlwZSkge1xuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gSWd4U2xpZGVyVHlwZS5TTElERVIpIHtcbiAgICAgICAgICAgIHRoaXMubG93ZXJWYWx1ZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sYWJlbHNWaWV3RW5hYmxlZCAmJiB0aGlzLnVwcGVyVmFsdWUgPiB0aGlzLm1heFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnVwcGVyVmFsdWUgPSB0aGlzLmxhYmVscy5sZW5ndGggLSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc1ZpZXdJbml0KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEVuYWJsZXMgYGxhYmVsVmlld2AsIGJ5IGFjY2VwdGluZyBhIGNvbGxlY3Rpb24gb2YgcHJpbWl0aXZlIHZhbHVlcyB3aXRoIG1vcmUgdGhhbiBvbmUgZWxlbWVudC5cbiAgICAgKiBFYWNoIGVsZW1lbnQgd2lsbCBiZSBlcXVhbGx5IHNwcmVhZCBvdmVyIHRoZSBzbGlkZXIgYW5kIGl0IHdpbGwgc2VydmUgYXMgYSB0aHVtYiBsYWJlbC5cbiAgICAgKiBPbmNlIHRoZSBwcm9wZXJ0eSBpcyBzZXQsIGl0IHdpbGwgcHJlY2VuZGVuY2Ugb3ZlciB7QGxpbmsgbWF4VmFsdWV9LCB7QGxpbmsgbWluVmFsdWV9LCB7QGxpbmsgc3RlcH0uXG4gICAgICogVGhpcyBtZWFucyB0aGF0IHRoZSBtYW5pcHVsYXRpb24gZm9yIHRob3NlIHByb3BlcnRpZXMgd29uJ3QgYmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgbGFiZWxzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgbGFiZWxzKGxhYmVsczogQXJyYXk8bnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWQ+KSB7XG4gICAgICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscztcblxuICAgICAgICB0aGlzLl9wTWF4ID0gdGhpcy52YWx1ZVRvRnJhY3Rpb24odGhpcy51cHBlckJvdW5kLCAwLCAxKTtcbiAgICAgICAgdGhpcy5fcE1pbiA9IHRoaXMudmFsdWVUb0ZyYWN0aW9uKHRoaXMubG93ZXJCb3VuZCwgMCwgMSk7XG5cbiAgICAgICAgdGhpcy5wb3NpdGlvbkhhbmRsZXJzQW5kVXBkYXRlVHJhY2soKTtcblxuICAgICAgICBpZiAodGhpcy5faGFzVmlld0luaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcERpc3RhbmNlID0gdGhpcy5jYWxjdWxhdGVTdGVwRGlzdGFuY2UoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlja0ludGVydmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0ZW1wbGF0ZSBjb250ZXh0IGNvcnJlc3BvbmRpbmdcbiAgICAgKiB0byB7QGxpbmsgSWd4VGh1bWJGcm9tVGVtcGxhdGVEaXJlY3RpdmV9IGFuZCB7QGxpbmsgSWd4VGh1bWJUb1RlbXBsYXRlRGlyZWN0aXZlfSB0ZW1wbGF0ZXMuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcmV0dXJuIHtcbiAgICAgKiAgJGltcGxpY2l0IC8vIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBsYWJlbCxcbiAgICAgKiAgbGFiZWxzIC8vIHJldHVybnMgdGhlIGxhYmVscyBjb2xsZWN0aW9uIHRoZSB1c2VyIGhhcyBwYXNzZWQuXG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29udGV4dCgpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGltcGxpY2l0OiB0aGlzLnZhbHVlLFxuICAgICAgICAgICAgbGFiZWxzOiB0aGlzLmxhYmVsc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIGluY3JlbWVudGFsL2RlY3JlbWVudGFsIHN0ZXAgb2YgdGhlIHZhbHVlIHdoZW4gZHJhZ2dpbmcgdGhlIHRodW1iLlxuICAgICAqIFRoZSBkZWZhdWx0IHN0ZXAgaXMgMSwgYW5kIHN0ZXAgc2hvdWxkIG5vdCBiZSBsZXNzIG9yIGVxdWFsIHRoYW4gMC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbGlkZXIgI3NsaWRlciBbKG5nTW9kZWwpXT1cInRhc2sucGVyY2VudENvbXBsZXRlZFwiIFtzdGVwXT1cIjVcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgc3RlcChzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc3RlcCA9IHN0ZXA7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc1ZpZXdJbml0KSB7XG4gICAgICAgICAgICB0aGlzLnN0ZXBEaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXRlU3RlcERpc3RhbmNlKCk7XG4gICAgICAgICAgICB0aGlzLm5vcm1hbGl6ZUJ5U3RlcCh0aGlzLl92YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuX3ZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25IYW5kbGVyc0FuZFVwZGF0ZVRyYWNrKCk7XG4gICAgICAgICAgICB0aGlzLnNldFRpY2tJbnRlcnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5jcmVtZW50YWwvZGVjcmVtZW50YWwgZHJhZ2dpbmcgc3RlcCBvZiB0aGUge0BsaW5rIElneFNsaWRlckNvbXBvbmVudH0uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJzbGlkZXIyXCIpXG4gICAgICogcHVibGljIHNsaWRlcjogSWd4U2xpZGVyQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgICBsZXQgc3RlcCA9IHRoaXMuc2xpZGVyLnN0ZXA7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc3RlcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFiZWxzVmlld0VuYWJsZWQgPyAxIDogdGhpcy5fc3RlcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGlmIHRoZSB7QGxpbmsgSWd4U2xpZGVyQ29tcG9uZW50fSBpcyBkaXNhYmxlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlcjJcIilcbiAgICAgKiBwdWJsaWMgc2xpZGVyOiBJZ3hTbGlkZXJDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgIGxldCBpc0Rpc2FibGVkID0gdGhpcy5zbGlkZXIuZGlzYWJsZWQ7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IGRpc2FibGVzIG9yIGVuYWJsZXMgVUkgaW50ZXJhY3Rpb24uXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2xpZGVyICNzbGlkZXIgW2Rpc2FibGVkXT1cIid0cnVlJ1wiIFsobmdNb2RlbCldPVwidGFzay5wZXJjZW50Q29tcGxldGVkXCIgW3N0ZXBdPVwiNVwiIFtsb3dlckJvdW5kXT1cIjIwXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBkaXNhYmxlZChkaXNhYmxlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZGlzYWJsZTtcblxuICAgICAgICBpZiAodGhpcy5faGFzVmlld0luaXQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlVGh1bWJGb2N1c2FibGVTdGF0ZShkaXNhYmxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIHtAbGluayBJZ3hTbGlkZXJDb21wb25lbnR9IGlzIHNldCBhcyBjb250aW51b3VzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwic2xpZGVyMlwiKVxuICAgICAqIHB1YmxpYyBzbGlkZXI6IElneFNsaWRlckNvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICAgbGV0IGNvbnRpbnVvdXMgPSB0aGlzLnNsaWRlci5jb250aW51b3VzO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgY29udGludW91cygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRpbnVvdXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgbWFya3MgdGhlIHtAbGluayBJZ3hTbGlkZXJDb21wb25lbnR9IGFzIGNvbnRpbnVvdXMuXG4gICAgICogQnkgZGVmYXVsdCBpcyBjb25zaWRlcmVkIHRoYXQgdGhlIHtAbGluayBJZ3hTbGlkZXJDb21wb25lbnR9IGlzIGRpc2NyZXRlLlxuICAgICAqIERpc2NyZXRlIHtAbGluayBJZ3hTbGlkZXJDb21wb25lbnR9IHNsaWRlciBoYXMgc3RlcCBpbmRpY2F0b3JzIG92ZXIgdGhlIHRyYWNrIGFuZCB2aXNpYmxlIHRodW1iIGxhYmVscyBkdXJpbmcgaW50ZXJhY3Rpb24uXG4gICAgICogQ29udGludW91cyB7QGxpbmsgSWd4U2xpZGVyQ29tcG9uZW50fSBkb2VzIG5vdCBoYXZlIHRpY2tzIGFuZCBkb2VzIG5vdCBzaG93IGJ1YmJsZSBsYWJlbHMgZm9yIHZhbHVlcy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbGlkZXIgI3NsaWRlciBbY29udGludW91c109XCIndHJ1ZSdcIiBbKG5nTW9kZWwpXT1cInRhc2sucGVyY2VudENvbXBsZXRlZFwiIFtzdGVwXT1cIjVcIiBbbG93ZXJCb3VuZF09XCIyMFwiPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgY29udGludW91cyhjb250aW51b3VzOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVvdXMgPSBjb250aW51b3VzO1xuICAgICAgICBpZiAodGhpcy5faGFzVmlld0luaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlja0ludGVydmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbWFsIHZhbHVlIG9mIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIEBWaWV3Q2hpbGQoXCJzbGlkZXIyXCIpXG4gICAgICogcHVibGljIHNsaWRlcjogSWd4U2xpZGVyQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgICBsZXQgc2xpZGVyTWluID0gdGhpcy5zbGlkZXIubWluVmFsdWU7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbWluVmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMubGFiZWxzVmlld0VuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX21pblZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG1pbmltYWwgdmFsdWUgZm9yIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YC5cbiAgICAgKiBUaGUgZGVmYXVsdCBtaW5pbWFsIHZhbHVlIGlzIDAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2xpZGVyIFt0eXBlXT1cInNsaWRlclR5cGVcIiBbbWluVmFsdWVdPVwiNTZcIiBbbWF4VmFsdWVdPVwiMTAwXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IG1pblZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHZhbHVlID49IHRoaXMubWF4VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21pblZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgPiB0aGlzLnVwcGVyQm91bmQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVXBwZXJCb3VuZEFuZE1heFRyYXZlbFpvbmUoKTtcbiAgICAgICAgICAgIHRoaXMubG93ZXJCb3VuZCA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVmcmVzaCBtaW4gdHJhdmVsIHpvbmUgbGltaXQuXG4gICAgICAgIHRoaXMuX3BNaW4gPSAwO1xuICAgICAgICAvLyBSZWNhbGN1bGF0ZSBzdGVwIGRpc3RhbmNlLlxuICAgICAgICB0aGlzLnBvc2l0aW9uSGFuZGxlcnNBbmRVcGRhdGVUcmFjaygpO1xuICAgICAgICBpZiAodGhpcy5faGFzVmlld0luaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcERpc3RhbmNlID0gdGhpcy5jYWxjdWxhdGVTdGVwRGlzdGFuY2UoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VGlja0ludGVydmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlIGZvciB0aGUge0BsaW5rIElneFNsaWRlckNvbXBvbmVudH0uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJzbGlkZXJcIilcbiAgICAgKiBwdWJsaWMgc2xpZGVyOiBJZ3hTbGlkZXJDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgIGxldCBzbGlkZXJNYXggPSB0aGlzLnNsaWRlci5tYXhWYWx1ZTtcbiAgICAgKiB9XG4gICAgICogIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbWF4VmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFiZWxzVmlld0VuYWJsZWQgP1xuICAgICAgICAgICAgdGhpcy5sYWJlbHMubGVuZ3RoIC0gMSA6XG4gICAgICAgICAgICB0aGlzLl9tYXhWYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBtYXhpbWFsIHZhbHVlIGZvciB0aGUgYElneFNsaWRlckNvbXBvbmVudGAuXG4gICAgICogVGhlIGRlZmF1bHQgbWF4aW11bSB2YWx1ZSBpcyAxMDAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2xpZGVyIFt0eXBlXT1cInNsaWRlclR5cGVcIiBbbWluVmFsdWVdPVwiNTZcIiBbbWF4VmFsdWVdPVwiMjU2XCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IG1heFZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHZhbHVlIDw9IHRoaXMuX21pblZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgdGhpcy5sb3dlckJvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvd2VyQm91bmRBbmRNaW5UcmF2ZWxab25lKCk7XG4gICAgICAgICAgICB0aGlzLnVwcGVyQm91bmQgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZnJlc2ggbWF4IHRyYXZlbCB6b25lIGxpbWl0cy5cbiAgICAgICAgdGhpcy5fcE1heCA9IDE7XG4gICAgICAgIC8vIHJlY2FsY3VsYXRlIHN0ZXAgZGlzdGFuY2UuXG4gICAgICAgIHRoaXMucG9zaXRpb25IYW5kbGVyc0FuZFVwZGF0ZVRyYWNrKCk7XG4gICAgICAgIGlmICh0aGlzLl9oYXNWaWV3SW5pdCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwRGlzdGFuY2UgPSB0aGlzLmNhbGN1bGF0ZVN0ZXBEaXN0YW5jZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRUaWNrSW50ZXJ2YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxvd2VyIGJvdW5kYXJ5IG9mIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlclwiKVxuICAgICAqIHB1YmxpYyBzbGlkZXI6IElneFNsaWRlckNvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICAgbGV0IHNsaWRlckxvd0JvdW5kID0gdGhpcy5zbGlkZXIubG93ZXJCb3VuZDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBsb3dlckJvdW5kKCk6IG51bWJlciB7XG4gICAgICAgIGlmICghTnVtYmVyLmlzTmFOKHRoaXMuX2xvd2VyQm91bmQpICYmIHRoaXMuX2xvd2VyQm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVJblJhbmdlKHRoaXMuX2xvd2VyQm91bmQsIHRoaXMubWluVmFsdWUsIHRoaXMubWF4VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWluVmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbG93ZXIgYm91bmRhcnkgb2YgdGhlIGBJZ3hTbGlkZXJDb21wb25lbnRgLlxuICAgICAqIElmIG5vdCBzZXQgaXMgdGhlIHNhbWUgYXMgbWluIHZhbHVlLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNsaWRlciBbc3RlcF09XCI1XCIgW2xvd2VyQm91bmRdPVwiMjBcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgbG93ZXJCb3VuZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh2YWx1ZSA+PSB0aGlzLnVwcGVyQm91bmQgfHwgKHRoaXMubGFiZWxzVmlld0VuYWJsZWQgJiYgdmFsdWUgPCAwKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG93ZXJCb3VuZCA9IHRoaXMudmFsdWVJblJhbmdlKHZhbHVlLCB0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlKTtcblxuICAgICAgICAvLyBSZWZyZXNoIG1pbiB0cmF2ZWwgem9uZS5cbiAgICAgICAgdGhpcy5fcE1pbiA9IHRoaXMudmFsdWVUb0ZyYWN0aW9uKHRoaXMuX2xvd2VyQm91bmQsIDAsIDEpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uSGFuZGxlcnNBbmRVcGRhdGVUcmFjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHVwcGVyIGJvdW5kYXJ5IG9mIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlclwiKVxuICAgICAqIHB1YmxpYyBzbGlkZXI6IElneFNsaWRlckNvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICBsZXQgc2xpZGVyVXBCb3VuZCA9IHRoaXMuc2xpZGVyLnVwcGVyQm91bmQ7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdXBwZXJCb3VuZCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoIU51bWJlci5pc05hTih0aGlzLl91cHBlckJvdW5kKSAmJiB0aGlzLl91cHBlckJvdW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlSW5SYW5nZSh0aGlzLl91cHBlckJvdW5kLCB0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1heFZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHVwcGVyIGJvdW5kYXJ5IG9mIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YC5cbiAgICAgKiBJZiBub3Qgc2V0IGlzIHRoZSBzYW1lIGFzIG1heCB2YWx1ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbGlkZXIgW3N0ZXBdPVwiNVwiIFt1cHBlckJvdW5kXT1cIjIwXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHVwcGVyQm91bmQodmFsdWU6IG51bWJlcikge1xuICAgICAgICBpZiAodmFsdWUgPD0gdGhpcy5sb3dlckJvdW5kIHx8ICh0aGlzLmxhYmVsc1ZpZXdFbmFibGVkICYmIHZhbHVlID4gdGhpcy5sYWJlbHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwcGVyQm91bmQgPSB0aGlzLnZhbHVlSW5SYW5nZSh2YWx1ZSwgdGhpcy5taW5WYWx1ZSwgdGhpcy5tYXhWYWx1ZSk7XG4gICAgICAgIC8vIFJlZnJlc2ggdGltZSB0cmF2ZWwgem9uZS5cbiAgICAgICAgdGhpcy5fcE1heCA9IHRoaXMudmFsdWVUb0ZyYWN0aW9uKHRoaXMuX3VwcGVyQm91bmQsIDAsIDEpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uSGFuZGxlcnNBbmRVcGRhdGVUcmFjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNsaWRlciB2YWx1ZS4gSWYgdGhlIHNsaWRlciBpcyBvZiB0eXBlIHtAbGluayBJZ3hTbGlkZXJUeXBlLlNMSURFUn0gdGhlIHJldHVybmVkIHZhbHVlIGlzIG51bWJlci5cbiAgICAgKiBJZiB0aGUgc2xpZGVyIHR5cGUgaXMge0BsaW5rIElneFNsaWRlclR5cGUuUkFOR0V9LlxuICAgICAqIFRoZSByZXR1cm5lZCB2YWx1ZSByZXByZXNlbnRzIGFuIG9iamVjdCBvZiB7QGxpbmsgbG93ZXJWYWx1ZX0gYW5kIHtAbGluayB1cHBlclZhbHVlfS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlcjJcIilcbiAgICAgKiBwdWJsaWMgc2xpZGVyOiBJZ3hTbGlkZXJDb21wb25lbnQ7XG4gICAgICogcHVibGljIHNsaWRlclZhbHVlKGV2ZW50KXtcbiAgICAgKiAgICAgbGV0IHNsaWRlclZhbCA9IHRoaXMuc2xpZGVyLnZhbHVlO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IG51bWJlciB8IElSYW5nZVNsaWRlclZhbHVlIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsb3dlcjogdGhpcy52YWx1ZUluUmFuZ2UodGhpcy5sb3dlclZhbHVlLCB0aGlzLmxvd2VyQm91bmQsIHRoaXMudXBwZXJCb3VuZCksXG4gICAgICAgICAgICAgICAgdXBwZXI6IHRoaXMudmFsdWVJblJhbmdlKHRoaXMudXBwZXJWYWx1ZSwgdGhpcy5sb3dlckJvdW5kLCB0aGlzLnVwcGVyQm91bmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVJblJhbmdlKHRoaXMudXBwZXJWYWx1ZSwgdGhpcy5sb3dlckJvdW5kLCB0aGlzLnVwcGVyQm91bmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc2xpZGVyIHZhbHVlLlxuICAgICAqIElmIHRoZSBzbGlkZXIgaXMgb2YgdHlwZSB7QGxpbmsgSWd4U2xpZGVyVHlwZS5TTElERVJ9LlxuICAgICAqIFRoZSBhcmd1bWVudCBpcyBudW1iZXIuIEJ5IGRlZmF1bHQgdGhlIHtAbGluayB2YWx1ZX0gZ2V0cyB0aGUge0BsaW5rIGxvd2VyQm91bmR9LlxuICAgICAqIElmIHRoZSBzbGlkZXIgdHlwZSBpcyB7QGxpbmsgSWd4U2xpZGVyVHlwZS5SQU5HRX0gdGhlIGFyZ3VtZW50XG4gICAgICogcmVwcmVzZW50cyBhbiBvYmplY3Qgb2Yge0BsaW5rIGxvd2VyVmFsdWV9IGFuZCB7QGxpbmsgdXBwZXJWYWx1ZX0gcHJvcGVydGllcy5cbiAgICAgKiBCeSBkZWZhdWx0IHRoZSBvYmplY3QgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSB7QGxpbmsgbG93ZXJCb3VuZH0gYW5kIHtAbGluayB1cHBlckJvdW5kfSBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHJhbmdlVmFsdWUgPSB7XG4gICAgICogICBsb3dlcjogMzAsXG4gICAgICogICB1cHBlcjogNjBcbiAgICAgKiB9O1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNsaWRlciBbdHlwZV09XCJzbGlkZXJUeXBlXCIgWyhuZ01vZGVsKV09XCJyYW5nZVZhbHVlXCIgW21pblZhbHVlXT1cIjU2XCIgW21heFZhbHVlXT1cIjI1NlwiPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogbnVtYmVyIHwgSVJhbmdlU2xpZGVyVmFsdWUpIHtcbiAgICAgICAgdGhpcy5ub3JtYWxpemVCeVN0ZXAodmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNWaWV3SW5pdCkge1xuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLl92YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uSGFuZGxlcnNBbmRVcGRhdGVUcmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHRoZSBwcmVzZW50ZWQgcHJpbWFyeSB0aWNrcy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgcHJpbWFyeVRpY2tzID0gdGhpcy5zbGlkZXIucHJpbWFyeVRpY2tzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBwcmltYXJ5VGlja3MoKSB7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsc1ZpZXdFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJpbWFyeVRpY2tzID0gdGhpcy5sYWJlbHMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9wcmltYXJ5VGlja3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbnVtYmVyIG9mIHByaW1hcnkgdGlja3MuIElmIHtAbGluayBAbGFiZWxzfSBpcyBlbmFibGVkLCB0aGlzIHByb3BlcnR5IHdvbid0IGZ1bmN0aW9uLlxuICAgICAqIEluc3RlZCBlbmFibGUgdGlja3MgYnkge0BsaW5rIHNob3dUaWNrc30gcHJvcGVydHkuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc2xpZGVyLnByaW1hcnlUaWNrcyA9IDU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBwcmltYXJ5VGlja3ModmFsOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHZhbCA8PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcmltYXJ5VGlja3MgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHRoZSBwcmVzZW50ZWQgc2Vjb25kYXJ5IHRpY2tzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBzZWNvbmRhcnlUaWNrcyA9IHRoaXMuc2xpZGVyLnNlY29uZGFyeVRpY2tzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzZWNvbmRhcnlUaWNrcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlY29uZGFyeVRpY2tzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG51bWJlciBvZiBzZWNvbmRhcnkgdGlja3MuIFRoZSBwcm9wZXJ0eSBmdW5jdGlvbnMgZXZlbiB3aGVuIHtAbGluayBsYWJlbHN9IGlzIGVuYWJsZWQsXG4gICAgICogYnV0IGFsbCBzZWNvbmRhcnkgdGlja3Mgd29uJ3QgcHJlc2VudCBhbnkgdGljayBsYWJlbHMuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc2xpZGVyLnNlY29uZGFyeVRpY2tzID0gNTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHNlY29uZGFyeVRpY2tzKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh2YWwgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZWNvbmRhcnlUaWNrcyA9IHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93L2hpZGUgc2xpZGVyIHRpY2tzXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2xpZXIgW3Nob3dUaWNrc109XCJ0cnVlXCIgW3ByaW1hcnlUaWNrc109XCI1XCI+PC9pZ3gtc2xpZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd1RpY2tzID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBzaG93L2hpZGUgcHJpbWFyeSB0aWNrIGxhYmVsc1xuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNsaWRlciBbcHJpbWFyeVRpY2tzXT1cIjVcIiBbcHJpbWFyeVRpY2tMYWJlbHNdPVwiZmFsc2VcIj48L2lneC1zbGlkZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcHJpbWFyeVRpY2tMYWJlbHMgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogc2hvdy9oaWRlIHNlY29uZGFyeSB0aWNrIGxhYmVsc1xuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNsaWRlciBbc2Vjb25kYXJ5VGlja3NdPVwiNVwiIFtzZWNvbmRhcnlUaWNrTGFiZWxzXT1cImZhbHNlXCI+PC9pZ3gtc2xpZGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNlY29uZGFyeVRpY2tMYWJlbHMgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlcyB0aWNrcyBvcmllbnRhdGlvbjpcbiAgICAgKiBib3R0b20gLSBUaGUgZGVmYXVsdCBvcmllbmF0aW9uLCBiZWxvdyB0aGUgc2xpZGVyIHRyYWNrLlxuICAgICAqIHRvcCAtIEFib3ZlIHRoZSBzbGlkZXIgdHJhY2tcbiAgICAgKiBtaXJyb3IgLSBjb21iaW5lcyB0b3AgYW5kIGJvdHRvbSBvcmllbnRhdGlvbi5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbGlkZXIgW3ByaW1hcnlUaWNrc109XCI1XCIgW3RpY2tzT3JpZW50YXRpb25dPVwidGlja3NPcmllbnRhdGlvblwiPjwvaWd4LXNsaWRlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0aWNrc09yaWVudGF0aW9uOiBUaWNrc09yaWVudGF0aW9uID0gVGlja3NPcmllbnRhdGlvbi5Cb3R0b207XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRpY2sgbGFiZWxzIHJvdGF0aW9uOlxuICAgICAqIGhvcml6b250YWwgLSBUaGUgZGVmYXVsdCByb3RhdGlvblxuICAgICAqIHRvcHRvYm90dG9tIC0gUm90YXRlcyB0aWNrIGxhYmVscyB2ZXJ0aWNhbGx5IHRvIDkwZGVnXG4gICAgICogYm90dG9tdG90b3AgLSBSb3RhdGUgdGljayBsYWJlbHMgdmVydGljYWxseSB0byAtOTBkZWdcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbGlkZXIgW3ByaW1hcnlUaWNrc109XCI1XCIgW3NlY29uZGFyeVRpY2tzXT1cIjNcIiBbdGlja0xhYmVsc09yaWVudGF0aW9uXT1cInRpY2tMYWJlbHNPcmllbnRhaXRvblwiPjwvaWd4LXNsaWRlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0aWNrTGFiZWxzT3JpZW50YXRpb246IFRpY2tMYWJlbHNPcmllbnRhdGlvbiA9IFRpY2tMYWJlbHNPcmllbnRhdGlvbi5Ib3Jpem9udGFsO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGVhY3RpdmF0ZVRodW1iTGFiZWwoKSB7XG4gICAgICAgIHJldHVybiAoKHRoaXMucHJpbWFyeVRpY2tzICYmIHRoaXMucHJpbWFyeVRpY2tMYWJlbHMpIHx8ICh0aGlzLnNlY29uZGFyeVRpY2tzICYmIHRoaXMuc2Vjb25kYXJ5VGlja0xhYmVscykpICYmXG4gICAgICAgICAgICAodGhpcy50aWNrc09yaWVudGF0aW9uID09PSBUaWNrc09yaWVudGF0aW9uLlRvcCB8fCB0aGlzLnRpY2tzT3JpZW50YXRpb24gPT09IFRpY2tzT3JpZW50YXRpb24uTWlycm9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZXZlcnkgdGltZSB0aGUgdmFsdWUgaXMgY2hhbmdlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGNoYW5nZShldmVudCl7XG4gICAgICogICAgYWxlcnQoXCJUaGUgdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCFcIik7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNsaWRlciAodmFsdWVDaGFuZ2UpPVwiY2hhbmdlKCRldmVudClcIiAjc2xpZGVyIFsobmdNb2RlbCldPVwidGFzay5wZXJjZW50Q29tcGxldGVkXCIgW3N0ZXBdPVwiNVwiPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8SVNsaWRlclZhbHVlQ2hhbmdlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBldmVudCBpcyBlbWl0dGVkIGF0IHRoZSBlbmQgb2YgZXZlcnkgc2xpZGUgaW50ZXJhY3Rpb24uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBjaGFuZ2UoZXZlbnQpe1xuICAgICAqICAgIGFsZXJ0KFwiVGhlIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQhXCIpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbGlkZXIgKGRyYWdGaW5pc2hlZCk9XCJjaGFuZ2UoJGV2ZW50KVwiICNzbGlkZXIgWyhuZ01vZGVsKV09XCJ0YXNrLnBlcmNlbnRDb21wbGV0ZWRcIiBbc3RlcF09XCI1XCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGRyYWdGaW5pc2hlZCA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgSVJhbmdlU2xpZGVyVmFsdWU+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgndGlja3MnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByaXZhdGUgdGlja3M6IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hTbGlkZXJUaHVtYkNvbXBvbmVudClcbiAgICBwcml2YXRlIHRodW1iczogUXVlcnlMaXN0PElneFNsaWRlclRodW1iQ29tcG9uZW50PiA9IG5ldyBRdWVyeUxpc3Q8SWd4U2xpZGVyVGh1bWJDb21wb25lbnQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihJZ3hUaHVtYkxhYmVsQ29tcG9uZW50KVxuICAgIHByaXZhdGUgbGFiZWxSZWZzOiBRdWVyeUxpc3Q8SWd4VGh1bWJMYWJlbENvbXBvbmVudD4gPSBuZXcgUXVlcnlMaXN0PElneFRodW1iTGFiZWxDb21wb25lbnQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG9uUGFuOiBTdWJqZWN0PG51bWJlcj4gPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHN0ZXBEaXN0YW5jZTogbnVtYmVyO1xuXG4gICAgLy8gTGltaXQgaGFuZGxlIHRyYXZlbCB6b25lXG4gICAgcHJpdmF0ZSBfcE1pbiA9IDA7XG4gICAgcHJpdmF0ZSBfcE1heCA9IDE7XG5cbiAgICAvLyBGcm9tL3VwcGVyVmFsdWUgaW4gcGVyY2VudCB2YWx1ZXNcbiAgICBwcml2YXRlIF9oYXNWaWV3SW5pdCA9IGZhbHNlO1xuICAgIHByaXZhdGUgX21pblZhbHVlID0gMDtcbiAgICBwcml2YXRlIF9tYXhWYWx1ZSA9IDEwMDtcbiAgICBwcml2YXRlIF9sb3dlckJvdW5kPzogbnVtYmVyO1xuICAgIHByaXZhdGUgX3VwcGVyQm91bmQ/OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfbG93ZXJWYWx1ZT86IG51bWJlcjtcbiAgICBwcml2YXRlIF91cHBlclZhbHVlPzogbnVtYmVyO1xuICAgIHByaXZhdGUgX2NvbnRpbnVvdXMgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3N0ZXAgPSAxO1xuICAgIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgfCBJUmFuZ2VTbGlkZXJWYWx1ZSA9IDA7XG5cbiAgICAvLyB0aWNrc1xuICAgIHByaXZhdGUgX3ByaW1hcnlUaWNrcyA9IDA7XG4gICAgcHJpdmF0ZSBfc2Vjb25kYXJ5VGlja3MgPSAwO1xuXG4gICAgcHJpdmF0ZSBfbGFiZWxzID0gbmV3IEFycmF5PG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkPigpO1xuICAgIHByaXZhdGUgX3R5cGUgPSBJZ3hTbGlkZXJUeXBlLlNMSURFUjtcblxuICAgIHByaXZhdGUgX2Rlc3Ryb3llciQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICAgIHByaXZhdGUgX2luZGljYXRvcnNEZXN0cm95ZXIkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgICBwcml2YXRlIF9pbmRpY2F0b3JzVGltZXI6IE9ic2VydmFibGU8YW55PjtcblxuICAgIHByaXZhdGUgX29uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuICAgIHByaXZhdGUgX29uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9lbDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX2RpcjogSWd4RGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBwbGF0Zm9ybTogUGxhdGZvcm1VdGlsKSB7XG4gICAgICAgIHRoaXMuc3RlcERpc3RhbmNlID0gdGhpcy5fc3RlcDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvblBvaW50ZXJEb3duKCRldmVudDogUG9pbnRlckV2ZW50KSB7XG4gICAgICAgIHRoaXMuZmluZENsb3Nlc3RUaHVtYigkZXZlbnQpO1xuXG4gICAgICAgIGlmICghdGhpcy50aHVtYlRvLmlzQWN0aXZlICYmIHRoaXMudGh1bWJGcm9tID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVRodW1iID0gdGhpcy50aHVtYlRvLmlzQWN0aXZlID8gdGhpcy50aHVtYlRvIDogdGhpcy50aHVtYkZyb207XG4gICAgICAgIGFjdGl2ZVRodW1iLm5hdGl2ZUVsZW1lbnQuc2V0UG9pbnRlckNhcHR1cmUoJGV2ZW50LnBvaW50ZXJJZCk7XG4gICAgICAgIHRoaXMuc2hvd1NsaWRlckluZGljYXRvcnMoKTtcblxuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdwb2ludGVydXAnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvblBvaW50ZXJVcCgkZXZlbnQ6IFBvaW50ZXJFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMudGh1bWJUby5pc0FjdGl2ZSAmJiB0aGlzLnRodW1iRnJvbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVUaHVtYiA9IHRoaXMudGh1bWJUby5pc0FjdGl2ZSA/IHRoaXMudGh1bWJUbyA6IHRoaXMudGh1bWJUbztcbiAgICAgICAgYWN0aXZlVGh1bWIubmF0aXZlRWxlbWVudC5yZWxlYXNlUG9pbnRlckNhcHR1cmUoJGV2ZW50LnBvaW50ZXJJZCk7XG5cbiAgICAgICAgdGhpcy5oaWRlU2xpZGVySW5kaWNhdG9ycygpO1xuICAgICAgICB0aGlzLmRyYWdGaW5pc2hlZC5lbWl0KHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdmb2N1cycpXG4gICAgcHVibGljIG9uRm9jdXMoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlU2xpZGVySW5kaWNhdG9ycygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdwYW4nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvblBhbkxpc3RlbmVyKCRldmVudCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSgkZXZlbnQuc3JjRXZlbnQuY2xpZW50WCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YCB0eXBlIGlzIFJBTkdFLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgQFZpZXdDaGlsZChcInNsaWRlclwiKVxuICAgICAqIHB1YmxpYyBzbGlkZXI6IElneFNsaWRlckNvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICAgbGV0IHNsaWRlclJhbmdlID0gdGhpcy5zbGlkZXIuaXNSYW5nZTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1JhbmdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBJZ3hTbGlkZXJUeXBlLlJBTkdFO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxvd2VyIHZhbHVlIG9mIHRoZSBgSWd4U2xpZGVyQ29tcG9uZW50YC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlclwiKVxuICAgICAqIHB1YmxpYyBzbGlkZXI6IElneFNsaWRlckNvbXBvbmVudDtcbiAgICAgKiBwdWJsaWMgbG93VmFsdWUoZXZlbnQpe1xuICAgICAqICAgIGxldCBzbGlkZXJMb3dWYWx1ZSA9IHRoaXMuc2xpZGVyLmxvd2VyVmFsdWU7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbG93ZXJWYWx1ZSgpOiBudW1iZXIge1xuICAgICAgICBpZiAoIU51bWJlci5pc05hTih0aGlzLl9sb3dlclZhbHVlKSAmJiB0aGlzLl9sb3dlclZhbHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fbG93ZXJWYWx1ZSA+PSB0aGlzLmxvd2VyQm91bmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb3dlclZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubG93ZXJCb3VuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgbG93ZXJWYWx1ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy52YWx1ZUluUmFuZ2UodmFsdWUsIHRoaXMubG93ZXJCb3VuZCwgdGhpcy51cHBlckJvdW5kKTtcbiAgICAgICAgdGhpcy5fbG93ZXJWYWx1ZSA9IHZhbHVlO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdXBwZXIgdmFsdWUgb2YgdGhlIGBJZ3hTbGlkZXJDb21wb25lbnRgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgQFZpZXdDaGlsZChcInNsaWRlcjJcIilcbiAgICAgKiBwdWJsaWMgc2xpZGVyOiBJZ3hTbGlkZXJDb21wb25lbnQ7XG4gICAgICogcHVibGljIHVwcGVyVmFsdWUoZXZlbnQpe1xuICAgICAqICAgICBsZXQgdXBwZXJWYWx1ZSA9IHRoaXMuc2xpZGVyLnVwcGVyVmFsdWU7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdXBwZXJWYWx1ZSgpIHtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNOYU4odGhpcy5fdXBwZXJWYWx1ZSkgJiYgdGhpcy5fdXBwZXJWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3VwcGVyVmFsdWUgPD0gdGhpcy51cHBlckJvdW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXJWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnVwcGVyQm91bmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHVwcGVyVmFsdWUodmFsdWU6IG51bWJlcikge1xuICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVJblJhbmdlKHZhbHVlLCB0aGlzLmxvd2VyQm91bmQsIHRoaXMudXBwZXJCb3VuZCk7XG4gICAgICAgIHRoaXMuX3VwcGVyVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRoZSBsb3dlciBsYWJlbC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInNsaWRlclwiKVxuICAgICAqIHB1YmxpYyBzbGlkZXI6IElneFNsaWRlckNvbXBvbmVudDtcbiAgICAgKiBsZXQgbGFiZWwgPSB0aGlzLnNsaWRlci5sb3dlckxhYmVsO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbG93ZXJMYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFiZWxzVmlld0VuYWJsZWQgP1xuICAgICAgICAgICAgdGhpcy5sYWJlbHNbdGhpcy5sb3dlclZhbHVlXSA6XG4gICAgICAgICAgICB0aGlzLmxvd2VyVmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdmFsdWUgY29ycmVzcG9uZGluZyB0aGUgdXBwZXIgbGFiZWwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJzbGlkZXJcIilcbiAgICAgKiBwdWJsaWMgc2xpZGVyOiBJZ3hTbGlkZXJDb21wb25lbnQ7XG4gICAgICogbGV0IGxhYmVsID0gdGhpcy5zbGlkZXIudXBwZXJMYWJlbDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHVwcGVyTGFiZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhYmVsc1ZpZXdFbmFibGVkID9cbiAgICAgICAgICAgIHRoaXMubGFiZWxzW3RoaXMudXBwZXJWYWx1ZV0gOlxuICAgICAgICAgICAgdGhpcy51cHBlclZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgbGFiZWwgdmlldyBpcyBlbmFibGVkLlxuICAgICAqIElmIHRoZSB7QGxpbmsgbGFiZWxzfSBpcyBzZXQsIHRoZSB2aWV3IGlzIGF1dG9tYXRpY2FsbHkgYWN0aXZhdGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwic2xpZGVyXCIpXG4gICAgICogcHVibGljIHNsaWRlcjogSWd4U2xpZGVyQ29tcG9uZW50O1xuICAgICAqIGxldCBsYWJlbFZpZXcgPSB0aGlzLnNsaWRlci5sYWJlbHNWaWV3RW5hYmxlZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGxhYmVsc1ZpZXdFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5sYWJlbHMgJiYgdGhpcy5sYWJlbHMubGVuZ3RoID4gMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd1RvcFRpY2tzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aWNrc09yaWVudGF0aW9uID09PSBUaWNrc09yaWVudGF0aW9uLlRvcCB8fFxuICAgICAgICAgICAgdGhpcy50aWNrc09yaWVudGF0aW9uID09PSBUaWNrc09yaWVudGF0aW9uLk1pcnJvcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzaG93Qm90dG9tVGlja3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpY2tzT3JpZW50YXRpb24gPT09IFRpY2tzT3JpZW50YXRpb24uQm90dG9tIHx8XG4gICAgICAgICAgICB0aGlzLnRpY2tzT3JpZW50YXRpb24gPT09IFRpY2tzT3JpZW50YXRpb24uTWlycm9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoY2hhbmdlcy5taW5WYWx1ZSAmJiBjaGFuZ2VzLm1heFZhbHVlICYmXG4gICAgICAgICAgICBjaGFuZ2VzLm1pblZhbHVlLmN1cnJlbnRWYWx1ZSA8IGNoYW5nZXMubWF4VmFsdWUuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhWYWx1ZSA9IGNoYW5nZXMubWF4VmFsdWUuY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fbWluVmFsdWUgPSBjaGFuZ2VzLm1pblZhbHVlLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFuZ2VzLnN0ZXAgJiYgY2hhbmdlcy5zdGVwLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgICAgICAgdGhpcy5ub3JtYWxpemVCeVN0ZXAodGhpcy5fdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5zbGlkZXJTZXR1cCgpO1xuXG4gICAgICAgIC8vIFNldCB0cmFjayB0cmF2ZWwgem9uZVxuICAgICAgICB0aGlzLl9wTWluID0gdGhpcy52YWx1ZVRvRnJhY3Rpb24odGhpcy5sb3dlckJvdW5kKSB8fCAwO1xuICAgICAgICB0aGlzLl9wTWF4ID0gdGhpcy52YWx1ZVRvRnJhY3Rpb24odGhpcy51cHBlckJvdW5kKSB8fCAxO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5fdmFsdWUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5faGFzVmlld0luaXQgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0ZXBEaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXRlU3RlcERpc3RhbmNlKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb25IYW5kbGVyc0FuZFVwZGF0ZVRyYWNrKCk7XG4gICAgICAgIHRoaXMuc2V0VGlja0ludGVydmFsKCk7XG4gICAgICAgIHRoaXMuY2hhbmdlVGh1bWJGb2N1c2FibGVTdGF0ZSh0aGlzLmRpc2FibGVkKTtcblxuICAgICAgICB0aGlzLnN1YnNjcmliZVRvKHRoaXMudGh1bWJGcm9tLCB0aGlzLnRodW1iQ2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUbyh0aGlzLnRodW1iVG8sIHRoaXMudGh1bWJDaGFuZ2VkLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMudGh1bWJzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVyJCkpLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGh1bWJGcm9tID0gY2hhbmdlLmZpbmQoKHRodW1iOiBJZ3hTbGlkZXJUaHVtYkNvbXBvbmVudCkgPT4gdGh1bWIudHlwZSA9PT0gU2xpZGVySGFuZGxlLkZST00pO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkhhbmRsZXIodGh1bWJGcm9tLCBudWxsLCB0aGlzLmxvd2VyVmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVUbyh0aHVtYkZyb20sIHRoaXMudGh1bWJDaGFuZ2VkLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VUaHVtYkZvY3VzYWJsZVN0YXRlKHRoaXMuZGlzYWJsZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmxhYmVsUmVmcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llciQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxGcm9tID0gdGhpcy5sYWJlbFJlZnMuZmluZCgobGFiZWw6IElneFRodW1iTGFiZWxDb21wb25lbnQpID0+IGxhYmVsLnR5cGUgPT09IFNsaWRlckhhbmRsZS5GUk9NKTtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25IYW5kbGVyKG51bGwsIGxhYmVsRnJvbSwgdGhpcy5sb3dlclZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHJlc2l6ZU9ic2VydmFibGUodGhpcy5fZWwubmF0aXZlRWxlbWVudCkucGlwZShcbiAgICAgICAgICAgICAgICB0aHJvdHRsZVRpbWUoNDApLFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZXIkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXBEaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXRlU3RlcERpc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9kZXN0cm95ZXIkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llciQuY29tcGxldGUoKTtcblxuICAgICAgICB0aGlzLl9pbmRpY2F0b3JzRGVzdHJveWVyJC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLl9pbmRpY2F0b3JzRGVzdHJveWVyJC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogSVJhbmdlU2xpZGVyVmFsdWUgfCBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3JtYWxpemVCeVN0ZXAodmFsdWUpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuX3ZhbHVlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMucG9zaXRpb25IYW5kbGVyc0FuZFVwZGF0ZVRyYWNrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldEVkaXRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1JhbmdlID8gdGhpcy50aHVtYkZyb20ubmF0aXZlRWxlbWVudCA6IHRoaXMudGh1bWJUby5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGUobW91c2VYKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgVG8vRnJvbSBWYWx1ZXNcbiAgICAgICAgdGhpcy5vblBhbi5uZXh0KG1vdXNlWCk7XG5cbiAgICAgICAgLy8gRmluYWxseSBkbyBwb3NpdGlvbkhhbmRsZXJzQW5kVXBkYXRlVHJhY2sgdGhlIERPTVxuICAgICAgICAvLyBiYXNlZCBvbiBkYXRhIHZhbHVlc1xuICAgICAgICB0aGlzLnBvc2l0aW9uSGFuZGxlcnNBbmRVcGRhdGVUcmFjaygpO1xuICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgdGh1bWJDaGFuZ2VkKHZhbHVlOiBudW1iZXIsIHRodW1iVHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgICAgICBsZXQgbmV3VmFsOiBJUmFuZ2VTbGlkZXJWYWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgICAgICAgaWYgKHRodW1iVHlwZSA9PT0gU2xpZGVySGFuZGxlLkZST00pIHtcbiAgICAgICAgICAgICAgICBuZXdWYWwgPSB7XG4gICAgICAgICAgICAgICAgICAgIGxvd2VyOiAodGhpcy52YWx1ZSBhcyBJUmFuZ2VTbGlkZXJWYWx1ZSkubG93ZXIgKyB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdXBwZXI6ICh0aGlzLnZhbHVlIGFzIElSYW5nZVNsaWRlclZhbHVlKS51cHBlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1ZhbCA9IHtcbiAgICAgICAgICAgICAgICAgICAgbG93ZXI6ICh0aGlzLnZhbHVlIGFzIElSYW5nZVNsaWRlclZhbHVlKS5sb3dlcixcbiAgICAgICAgICAgICAgICAgICAgdXBwZXI6ICh0aGlzLnZhbHVlIGFzIElSYW5nZVNsaWRlclZhbHVlKS51cHBlciArIHZhbHVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3dhcCB0aGUgdGh1bWJzIGlmIGEgY29sbGlzaW9uIGFwcGVhcnMuXG4gICAgICAgICAgICBpZiAobmV3VmFsLmxvd2VyID49IG5ld1ZhbC51cHBlcikge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnN3YXBUaHVtYihuZXdWYWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3VmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZSBhcyBudW1iZXIgKyB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlQ2hhbmdlZChvbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdFZhbHVlQ2hhbmdlKG9sZFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25UaHVtYkNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy50b2dnbGVTbGlkZXJJbmRpY2F0b3JzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBvbkhvdmVyQ2hhbmdlKHN0YXRlOiBib29sZWFuKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZSA/IHRoaXMuc2hvd1NsaWRlckluZGljYXRvcnMoKSA6IHRoaXMuaGlkZVNsaWRlckluZGljYXRvcnMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0VmFsdWUodmFsdWU6IG51bWJlciB8IElSYW5nZVNsaWRlclZhbHVlLCB0cmlnZ2VyQ2hhbmdlOiBib29sZWFuKSB7XG4gICAgICAgIGxldCByZXM7XG4gICAgICAgIGlmICghdGhpcy5pc1JhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLnVwcGVyVmFsdWUgPSB2YWx1ZSBhcyBudW1iZXIgLSAodmFsdWUgYXMgbnVtYmVyICUgdGhpcy5zdGVwKTtcbiAgICAgICAgICAgIHJlcyA9IHRoaXMudXBwZXJWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy52YWxpZGF0ZUluaXRpYWxWYWx1ZSh2YWx1ZSBhcyBJUmFuZ2VTbGlkZXJWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnVwcGVyVmFsdWUgPSAodmFsdWUgYXMgSVJhbmdlU2xpZGVyVmFsdWUpLnVwcGVyO1xuICAgICAgICAgICAgdGhpcy5sb3dlclZhbHVlID0gKHZhbHVlIGFzIElSYW5nZVNsaWRlclZhbHVlKS5sb3dlcjtcbiAgICAgICAgICAgIHJlcyA9IHsgbG93ZXI6IHRoaXMubG93ZXJWYWx1ZSwgdXBwZXI6IHRoaXMudXBwZXJWYWx1ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2socmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3dhcFRodW1iKHZhbHVlOiBJUmFuZ2VTbGlkZXJWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy50aHVtYkZyb20uaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIHZhbHVlLnVwcGVyID0gdGhpcy51cHBlclZhbHVlO1xuICAgICAgICAgICAgdmFsdWUubG93ZXIgPSB0aGlzLnVwcGVyVmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZS51cHBlciA9IHRoaXMubG93ZXJWYWx1ZTtcbiAgICAgICAgICAgIHZhbHVlLmxvd2VyID0gdGhpcy5sb3dlclZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2dnbGVUaHVtYigpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kQ2xvc2VzdFRodW1iKGV2ZW50OiBQb2ludGVyRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZXN0SGFuZGxlKGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGh1bWJUby5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZShldmVudC5jbGllbnRYKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxvd2VyQm91bmRBbmRNaW5UcmF2ZWxab25lKCkge1xuICAgICAgICB0aGlzLmxvd2VyQm91bmQgPSB0aGlzLm1pblZhbHVlO1xuICAgICAgICB0aGlzLl9wTWluID0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVVwcGVyQm91bmRBbmRNYXhUcmF2ZWxab25lKCkge1xuICAgICAgICB0aGlzLnVwcGVyQm91bmQgPSB0aGlzLm1heFZhbHVlO1xuICAgICAgICB0aGlzLl9wTWF4ID0gMTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNsaWRlclNldHVwKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogaWYge0BsaW5rIFNsaWRlclR5cGUuU0xJREVSfSB0aGFuIHRoZSBpbml0aWFsIHZhbHVlIHNob2xkIGJlIHRoZSBsb3dlc3Qgb25lLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCF0aGlzLmlzUmFuZ2UgJiYgdGhpcy5fdXBwZXJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl91cHBlclZhbHVlID0gdGhpcy5sb3dlckJvdW5kO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVTdGVwRGlzdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAqIHRoaXMuc3RlcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZVRodW1iKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50aHVtYkZyb20uaXNBY3RpdmUgP1xuICAgICAgICAgICAgdGhpcy50aHVtYlRvLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSA6XG4gICAgICAgICAgICB0aGlzLnRodW1iRnJvbS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWx1ZUluUmFuZ2UodmFsdWUsIG1pbiA9IDAsIG1heCA9IDEwMCkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIG1heCksIG1pbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVRpY2tNYXJrcyhjb2xvcjogc3RyaW5nLCBpbnRlcnZhbDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBpbnRlcnZhbCAhPT0gbnVsbCA/IGByZXBlYXRpbmctbGluZWFyLWdyYWRpZW50KFxuICAgICAgICAgICAgJHsndG8gbGVmdCd9LFxuICAgICAgICAgICAgJHtjb2xvcn0sXG4gICAgICAgICAgICAke2NvbG9yfSAxLjVweCxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50IDEuNXB4LFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQgJHtpbnRlcnZhbH0lXG4gICAgICAgICksIHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnQoXG4gICAgICAgICAgICAkeyd0byByaWdodCd9LFxuICAgICAgICAgICAgJHtjb2xvcn0sXG4gICAgICAgICAgICAke2NvbG9yfSAxLjVweCxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50IDEuNXB4LFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQgJHtpbnRlcnZhbH0lXG4gICAgICAgIClgIDogaW50ZXJ2YWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkhhbmRsZXIodGh1bWJIYW5kbGU6IEVsZW1lbnRSZWYsIGxhYmVsSGFuZGxlOiBFbGVtZW50UmVmLCBwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnQgPSBgJHt0aGlzLnZhbHVlVG9GcmFjdGlvbihwb3NpdGlvbikgKiAxMDB9JWA7XG4gICAgICAgIGNvbnN0IGRpciA9IHRoaXMuX2Rpci5ydGwgPyAncmlnaHQnIDogJ2xlZnQnO1xuXG4gICAgICAgIGlmICh0aHVtYkhhbmRsZSkge1xuICAgICAgICAgICAgdGh1bWJIYW5kbGUubmF0aXZlRWxlbWVudC5zdHlsZVtkaXJdID0gcGVyY2VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsYWJlbEhhbmRsZSkge1xuICAgICAgICAgICAgbGFiZWxIYW5kbGUubmF0aXZlRWxlbWVudC5zdHlsZVtkaXJdID0gcGVyY2VudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcG9zaXRpb25IYW5kbGVyc0FuZFVwZGF0ZVRyYWNrKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNSYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkhhbmRsZXIodGhpcy50aHVtYlRvLCB0aGlzLmxhYmVsVG8sIHRoaXMudmFsdWUgYXMgbnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25IYW5kbGVyKHRoaXMudGh1bWJUbywgdGhpcy5sYWJlbFRvLCAodGhpcy52YWx1ZSBhcyBJUmFuZ2VTbGlkZXJWYWx1ZSkudXBwZXIpO1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkhhbmRsZXIodGhpcy50aHVtYkZyb20sIHRoaXMubGFiZWxGcm9tLCAodGhpcy52YWx1ZSBhcyBJUmFuZ2VTbGlkZXJWYWx1ZSkubG93ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc1ZpZXdJbml0KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsb3Nlc3RIYW5kbGUoZXZlbnQ6IFBvaW50ZXJFdmVudCkge1xuICAgICAgICBjb25zdCBmcm9tT2Zmc2V0ID0gdGhpcy50aHVtYkZyb20ubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0ICsgdGhpcy50aHVtYkZyb20ubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IHRvT2Zmc2V0ID0gdGhpcy50aHVtYlRvLm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCArIHRoaXMudGh1bWJUby5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgeFBvaW50ZXIgPSBldmVudC5jbGllbnRYIC0gdGhpcy5fZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMuY2xvc2VzdFRvKHhQb2ludGVyLCBbZnJvbU9mZnNldCwgdG9PZmZzZXRdKTtcblxuICAgICAgICBpZiAoZnJvbU9mZnNldCA9PT0gdG9PZmZzZXQgJiYgdG9PZmZzZXQgPCB4UG9pbnRlcikge1xuICAgICAgICAgICAgdGhpcy50aHVtYlRvLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChmcm9tT2Zmc2V0ID09PSB0b09mZnNldCAmJiB0b09mZnNldCA+IHhQb2ludGVyKSB7XG4gICAgICAgICAgICB0aGlzLnRodW1iRnJvbS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPT09IGZyb21PZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMudGh1bWJGcm9tLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGh1bWJUby5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRpY2tJbnRlcnZhbCgpIHtcbiAgICAgICAgbGV0IGludGVydmFsO1xuICAgICAgICBjb25zdCB0cmFja1Byb2dyZXNzID0gMTAwO1xuICAgICAgICBpZiAodGhpcy5sYWJlbHNWaWV3RW5hYmxlZCkge1xuICAgICAgICAgICAgLy8gQ2FsYyB0aWNrcyBkZXBlbmRpbmcgb24gdGhlIGxhYmVscyBsZW5ndGg7XG4gICAgICAgICAgICBpbnRlcnZhbCA9ICgodHJhY2tQcm9ncmVzcyAvICh0aGlzLmxhYmVscy5sZW5ndGggLSAxKSAqIDEwKSkgLyAxMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWNrUmFuZ2UgPSB0aGlzLm1heFZhbHVlIC0gdGhpcy5taW5WYWx1ZTtcbiAgICAgICAgICAgIGludGVydmFsID0gdGhpcy5zdGVwID4gMSA/XG4gICAgICAgICAgICAgICAgKHRyYWNrUHJvZ3Jlc3MgLyAoKHRyYWNrUmFuZ2UgLyB0aGlzLnN0ZXApKSAqIDEwKSAvIDEwXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVuZGVyQ2FsbGJhY2tFeGVjdXRpb24gPSAhdGhpcy5jb250aW51b3VzID8gdGhpcy5nZW5lcmF0ZVRpY2tNYXJrcyhcbiAgICAgICAgICAgICd2YXIoLS1pZ3gtc2xpZGVyLXRyYWNrLXN0ZXAtY29sb3IsIHZhcigtLXRyYWNrLXN0ZXAtY29sb3IsIHdoaXRlKSknLCBpbnRlcnZhbCkgOiBudWxsO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMudGlja3MubmF0aXZlRWxlbWVudCwgJ2JhY2tncm91bmQnLCByZW5kZXJDYWxsYmFja0V4ZWN1dGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG93U2xpZGVySW5kaWNhdG9ycygpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pbmRpY2F0b3JzVGltZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2luZGljYXRvcnNEZXN0cm95ZXIkLm5leHQodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLl9pbmRpY2F0b3JzVGltZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50aHVtYlRvLnNob3dUaHVtYkluZGljYXRvcnMoKTtcbiAgICAgICAgdGhpcy5sYWJlbFRvLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnRodW1iRnJvbSkge1xuICAgICAgICAgICAgdGhpcy50aHVtYkZyb20uc2hvd1RodW1iSW5kaWNhdG9ycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGFiZWxGcm9tKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsRnJvbS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZGVTbGlkZXJJbmRpY2F0b3JzKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5kaWNhdG9yc1RpbWVyID0gdGltZXIodGhpcy50aHVtYkxhYmVsVmlzaWJpbGl0eUR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy5faW5kaWNhdG9yc1RpbWVyLnBpcGUodGFrZVVudGlsKHRoaXMuX2luZGljYXRvcnNEZXN0cm95ZXIkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1bWJUby5oaWRlVGh1bWJJbmRpY2F0b3JzKCk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsVG8uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy50aHVtYkZyb20pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRodW1iRnJvbS5oaWRlVGh1bWJJbmRpY2F0b3JzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhYmVsRnJvbSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxGcm9tLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZVNsaWRlckluZGljYXRvcnMoKSB7XG4gICAgICAgIHRoaXMuc2hvd1NsaWRlckluZGljYXRvcnMoKTtcbiAgICAgICAgdGhpcy5oaWRlU2xpZGVySW5kaWNhdG9ycygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hhbmdlVGh1bWJGb2N1c2FibGVTdGF0ZShzdGF0ZTogYm9vbGVhbikge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHN0YXRlID8gLTEgOiAxO1xuXG4gICAgICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMudGh1bWJGcm9tLnRhYmluZGV4ID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRodW1iVG8udGFiaW5kZXggPSB2YWx1ZTtcblxuICAgICAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xvc2VzdFRvKGdvYWw6IG51bWJlciwgcG9zaXRpb25zOiBudW1iZXJbXSk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbnMucmVkdWNlKChwcmV2aW91cywgY3VycmVudCkgPT4gKE1hdGguYWJzKGdvYWwgLSBjdXJyZW50KSA8IE1hdGguYWJzKGdvYWwgLSBwcmV2aW91cykgPyBjdXJyZW50IDogcHJldmlvdXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbHVlVG9GcmFjdGlvbih2YWx1ZTogbnVtYmVyLCBwTWluID0gdGhpcy5fcE1pbiwgcE1heCA9IHRoaXMuX3BNYXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVJblJhbmdlKCh2YWx1ZSAtIHRoaXMubWluVmFsdWUpIC8gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSwgcE1pbiwgcE1heCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIE5vcm1hbGl60LUgdGhlIHZhbHVlIHdoZW4gdHdvLXdheSBkYXRhIGJpbmQgaXMgdXNlZCBhbmQge0BsaW5rIHRoaXMuc3RlcH0gaXMgc2V0LlxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHByaXZhdGUgbm9ybWFsaXplQnlTdGVwKHZhbHVlOiBJUmFuZ2VTbGlkZXJWYWx1ZSB8IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHtcbiAgICAgICAgICAgICAgICBsb3dlcjogKHZhbHVlIGFzIElSYW5nZVNsaWRlclZhbHVlKS5sb3dlciAtICgodmFsdWUgYXMgSVJhbmdlU2xpZGVyVmFsdWUpLmxvd2VyICUgdGhpcy5zdGVwKSxcbiAgICAgICAgICAgICAgICB1cHBlcjogKHZhbHVlIGFzIElSYW5nZVNsaWRlclZhbHVlKS51cHBlciAtICgodmFsdWUgYXMgSVJhbmdlU2xpZGVyVmFsdWUpLnVwcGVyICUgdGhpcy5zdGVwKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gKHZhbHVlIGFzIG51bWJlcikgLSAoKHZhbHVlIGFzIG51bWJlcikgJSB0aGlzLnN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVUcmFjaygpIHtcbiAgICAgICAgY29uc3QgZnJvbVBvc2l0aW9uID0gdGhpcy52YWx1ZVRvRnJhY3Rpb24odGhpcy5sb3dlclZhbHVlKTtcbiAgICAgICAgY29uc3QgdG9Qb3NpdGlvbiA9IHRoaXMudmFsdWVUb0ZyYWN0aW9uKHRoaXMudXBwZXJWYWx1ZSk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uR2FwID0gdG9Qb3NpdGlvbiAtIGZyb21Qb3NpdGlvbjtcblxuICAgICAgICBsZXQgdHJhY2tMZWZ0SW5kZW50aW9uID0gZnJvbVBvc2l0aW9uO1xuICAgICAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICAgICAgICBpZiAocG9zaXRpb25HYXApIHtcbiAgICAgICAgICAgICAgICB0cmFja0xlZnRJbmRlbnRpb24gPSBNYXRoLnJvdW5kKCgxIC8gcG9zaXRpb25HYXAgKiBmcm9tUG9zaXRpb24pICogMTAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJhY2tMZWZ0SW5kZW50aW9uID0gdGhpcy5fZGlyLnJ0bCA/IC10cmFja0xlZnRJbmRlbnRpb24gOiB0cmFja0xlZnRJbmRlbnRpb247XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMudHJhY2tSZWYubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsIGBzY2FsZVgoJHtwb3NpdGlvbkdhcH0pIHRyYW5zbGF0ZVgoJHt0cmFja0xlZnRJbmRlbnRpb259JSlgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy50cmFja1JlZi5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgYHNjYWxlWCgke3RvUG9zaXRpb259KWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUluaXRpYWxWYWx1ZSh2YWx1ZTogSVJhbmdlU2xpZGVyVmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlLmxvd2VyIDwgdGhpcy5sb3dlckJvdW5kICYmIHZhbHVlLnVwcGVyIDwgdGhpcy5sb3dlckJvdW5kKSB7XG4gICAgICAgICAgICB2YWx1ZS51cHBlciA9IHRoaXMubG93ZXJCb3VuZDtcbiAgICAgICAgICAgIHZhbHVlLmxvd2VyID0gdGhpcy5sb3dlckJvdW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLmxvd2VyID4gdGhpcy51cHBlckJvdW5kICYmIHZhbHVlLnVwcGVyID4gdGhpcy51cHBlckJvdW5kKSB7XG4gICAgICAgICAgICB2YWx1ZS51cHBlciA9IHRoaXMudXBwZXJCb3VuZDtcbiAgICAgICAgICAgIHZhbHVlLmxvd2VyID0gdGhpcy51cHBlckJvdW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLnVwcGVyIDwgdmFsdWUubG93ZXIpIHtcbiAgICAgICAgICAgIHZhbHVlLnVwcGVyID0gdGhpcy51cHBlclZhbHVlO1xuICAgICAgICAgICAgdmFsdWUubG93ZXIgPSB0aGlzLmxvd2VyVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdWJzY3JpYmVUbyh0aHVtYjogSWd4U2xpZGVyVGh1bWJDb21wb25lbnQsIGNhbGxiYWNrOiAoYTogbnVtYmVyLCBiOiBzdHJpbmcpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKCF0aHVtYikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGh1bWIudGh1bWJWYWx1ZUNoYW5nZVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmVyKHRodW1iKSkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHZhbHVlID0+IGNhbGxiYWNrKHZhbHVlLCB0aHVtYi50eXBlKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1bnN1YnNjcmliZXIodGh1bWI6IElneFNsaWRlclRodW1iQ29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBtZXJnZSh0aGlzLl9kZXN0cm95ZXIkLCB0aHVtYi5kZXN0cm95KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhc1ZhbHVlQ2hhbmdlZChvbGRWYWx1ZSkge1xuICAgICAgICBjb25zdCBpc1NsaWRlcldpdGhEaWZmZXJlbnRWYWx1ZTogYm9vbGVhbiA9ICF0aGlzLmlzUmFuZ2UgJiYgb2xkVmFsdWUgIT09IHRoaXMudmFsdWU7XG4gICAgICAgIGNvbnN0IGlzUmFuZ2VXaXRoT25lRGlmZmVyZW50VmFsdWU6IGJvb2xlYW4gPSB0aGlzLmlzUmFuZ2UgJiZcbiAgICAgICAgICAgICgob2xkVmFsdWUgYXMgSVJhbmdlU2xpZGVyVmFsdWUpLmxvd2VyICE9PSAodGhpcy52YWx1ZSBhcyBJUmFuZ2VTbGlkZXJWYWx1ZSkubG93ZXIgfHxcbiAgICAgICAgICAgICAgICAob2xkVmFsdWUgYXMgSVJhbmdlU2xpZGVyVmFsdWUpLnVwcGVyICE9PSAodGhpcy52YWx1ZSBhcyBJUmFuZ2VTbGlkZXJWYWx1ZSkudXBwZXIpO1xuXG4gICAgICAgIHJldHVybiBpc1NsaWRlcldpdGhEaWZmZXJlbnRWYWx1ZSB8fCBpc1JhbmdlV2l0aE9uZURpZmZlcmVudFZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZW1pdFZhbHVlQ2hhbmdlKG9sZFZhbHVlOiBudW1iZXIgfCBJUmFuZ2VTbGlkZXJWYWx1ZSkge1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQoeyBvbGRWYWx1ZSwgdmFsdWU6IHRoaXMudmFsdWUgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4U2xpZGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hUaHVtYkZyb21UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4VGh1bWJUb1RlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hUaWNrTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4U2xpZGVyVGh1bWJDb21wb25lbnQsXG4gICAgICAgIElneFRodW1iTGFiZWxDb21wb25lbnQsXG4gICAgICAgIElneFRpY2tzQ29tcG9uZW50LFxuICAgICAgICBJZ3hUaWNrTGFiZWxzUGlwZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hTbGlkZXJDb21wb25lbnQsXG4gICAgICAgIElneFRodW1iRnJvbVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hUaHVtYlRvVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneFRpY2tMYWJlbFRlbXBsYXRlRGlyZWN0aXZlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4U2xpZGVyTW9kdWxlIHtcbn1cbiIsIjxkaXYgY2xhc3M9XCJpZ3gtc2xpZGVyX190cmFja1wiPlxuICAgIDxpZ3gtdGlja3NcbiAgICAgICAgKm5nSWY9XCJzaG93VGlja3MgJiYgc2hvd1RvcFRpY2tzXCJcbiAgICAgICAgdGlja3NPcmllbnRhdGlvbj1cInRvcFwiXG4gICAgICAgIFtwcmltYXJ5VGlja3NdPVwicHJpbWFyeVRpY2tzXCJcbiAgICAgICAgW3NlY29uZGFyeVRpY2tzXT1cInNlY29uZGFyeVRpY2tzXCJcbiAgICAgICAgW3ByaW1hcnlUaWNrTGFiZWxzXT1cInByaW1hcnlUaWNrTGFiZWxzXCJcbiAgICAgICAgW3NlY29uZGFyeVRpY2tMYWJlbHNdPVwic2Vjb25kYXJ5VGlja0xhYmVsc1wiXG4gICAgICAgIFt0aWNrTGFiZWxzT3JpZW50YXRpb25dPVwidGlja0xhYmVsc09yaWVudGF0aW9uXCJcbiAgICAgICAgW2xhYmVsc1ZpZXdFbmFibGVkXT1cImxhYmVsc1ZpZXdFbmFibGVkXCJcbiAgICAgICAgW2xhYmVsc109XCJsYWJlbHMgfCBzcHJlYWRUaWNrTGFiZWxzOnNlY29uZGFyeVRpY2tzXCJcbiAgICAgICAgW3RpY2tMYWJlbFRlbXBsYXRlUmVmXT1cInRpY2tMYWJlbFRlbXBsYXRlUmVmXCJcbiAgICAgICAgW21pblZhbHVlXT1cIm1pblZhbHVlXCJcbiAgICAgICAgW21heFZhbHVlXT1cIm1heFZhbHVlXCI+PC9pZ3gtdGlja3M+XG5cbiAgICA8ZGl2ICN0cmFjayBjbGFzcz1cImlneC1zbGlkZXJfX3RyYWNrLWZpbGxcIj48L2Rpdj5cbiAgICA8ZGl2ICN0aWNrcyBjbGFzcz1cImlneC1zbGlkZXJfX3RyYWNrLXN0ZXBzXCI+PC9kaXY+XG5cbiAgICA8aWd4LXRpY2tzXG4gICAgICAgICpuZ0lmPVwic2hvd1RpY2tzICYmIHNob3dCb3R0b21UaWNrc1wiXG4gICAgICAgIHRpY2tzT3JpZW50YXRpb249XCJib3R0b21cIlxuICAgICAgICBbcHJpbWFyeVRpY2tzXT1cInByaW1hcnlUaWNrc1wiXG4gICAgICAgIFtzZWNvbmRhcnlUaWNrc109XCJzZWNvbmRhcnlUaWNrc1wiXG4gICAgICAgIFtwcmltYXJ5VGlja0xhYmVsc109XCJwcmltYXJ5VGlja0xhYmVsc1wiXG4gICAgICAgIFtzZWNvbmRhcnlUaWNrTGFiZWxzXT1cInNlY29uZGFyeVRpY2tMYWJlbHNcIlxuICAgICAgICBbdGlja0xhYmVsc09yaWVudGF0aW9uXT1cInRpY2tMYWJlbHNPcmllbnRhdGlvblwiXG4gICAgICAgIFtsYWJlbHNWaWV3RW5hYmxlZF09XCJsYWJlbHNWaWV3RW5hYmxlZFwiXG4gICAgICAgIFtsYWJlbHNdPVwibGFiZWxzIHwgc3ByZWFkVGlja0xhYmVsczpzZWNvbmRhcnlUaWNrc1wiXG4gICAgICAgIFt0aWNrTGFiZWxUZW1wbGF0ZVJlZl09XCJ0aWNrTGFiZWxUZW1wbGF0ZVJlZlwiXG4gICAgICAgIFttaW5WYWx1ZV09XCJtaW5WYWx1ZVwiXG4gICAgICAgIFttYXhWYWx1ZV09XCJtYXhWYWx1ZVwiPjwvaWd4LXRpY2tzPlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwiaWd4LXNsaWRlcl9fdGh1bWJzXCI+XG4gICAgPGlneC10aHVtYi1sYWJlbFxuICAgICAgICAqbmdJZj1cImlzUmFuZ2VcIlxuICAgICAgICB0eXBlPVwiZnJvbVwiXG4gICAgICAgIFt2YWx1ZV09XCJsb3dlckxhYmVsXCJcbiAgICAgICAgW3RlbXBsYXRlUmVmXT1cInRodW1iRnJvbVRlbXBsYXRlUmVmXCJcbiAgICAgICAgW2NvbnRpbnVvdXNdPVwiY29udGludW91c1wiXG4gICAgICAgIFtjb250ZXh0XT1cImNvbnRleHRcIlxuICAgICAgICBbZGVhY3RpdmVTdGF0ZV09XCJkZWFjdGl2YXRlVGh1bWJMYWJlbFwiXG4gICAgICAgIFt0aHVtYl09XCJ0aHVtYkZyb21cIj48L2lneC10aHVtYi1sYWJlbD5cblxuICAgIDxpZ3gtdGh1bWJcbiAgICAgICAgKm5nSWY9XCJpc1JhbmdlXCJcbiAgICAgICAgI3RodW1iRnJvbVxuICAgICAgICB0eXBlPVwiZnJvbVwiXG4gICAgICAgIFt2YWx1ZV09XCJsb3dlckxhYmVsXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgW2NvbnRpbnVvdXNdPVwiY29udGludW91c1wiXG4gICAgICAgIFtvblBhbl09XCJvblBhblwiXG4gICAgICAgIFtzdGVwRGlzdGFuY2VdPVwic3RlcERpc3RhbmNlXCJcbiAgICAgICAgW3N0ZXBdPVwic3RlcFwiXG4gICAgICAgIFt0ZW1wbGF0ZVJlZl09XCJ0aHVtYkZyb21UZW1wbGF0ZVJlZlwiXG4gICAgICAgIFtjb250ZXh0XT1cImNvbnRleHRcIlxuICAgICAgICAodGh1bWJDaGFuZ2UpPVwib25UaHVtYkNoYW5nZSgpXCJcbiAgICAgICAgKGhvdmVyQ2hhbmdlKT1cIm9uSG92ZXJDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtkZWFjdGl2ZVN0YXRlXT1cImRlYWN0aXZhdGVUaHVtYkxhYmVsXCJcbiAgICAgICAgW3RodW1iTGFiZWxWaXNpYmlsaXR5RHVyYXRpb25dPVwidGh1bWJMYWJlbFZpc2liaWxpdHlEdXJhdGlvblwiPjwvaWd4LXRodW1iPlxuXG4gICAgPGlneC10aHVtYi1sYWJlbFxuICAgICAgICBbdmFsdWVdPVwidXBwZXJMYWJlbFwiXG4gICAgICAgIHR5cGU9XCJ0b1wiXG4gICAgICAgIFt0ZW1wbGF0ZVJlZl09XCJ0aHVtYlRvVGVtcGxhdGVSZWZcIlxuICAgICAgICBbY29udGludW91c109XCJjb250aW51b3VzXCJcbiAgICAgICAgW2NvbnRleHRdPVwiY29udGV4dFwiXG4gICAgICAgIFtkZWFjdGl2ZVN0YXRlXT1cImRlYWN0aXZhdGVUaHVtYkxhYmVsXCJcbiAgICAgICAgW3RodW1iXT1cInRodW1iVG9cIj48L2lneC10aHVtYi1sYWJlbD5cblxuICAgIDxpZ3gtdGh1bWJcbiAgICAgICAgI3RodW1iVG9cbiAgICAgICAgdHlwZT1cInRvXCJcbiAgICAgICAgW3ZhbHVlXT1cInVwcGVyTGFiZWxcIlxuICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICBbY29udGludW91c109XCJjb250aW51b3VzXCJcbiAgICAgICAgW29uUGFuXT1cIm9uUGFuXCJcbiAgICAgICAgW3N0ZXBEaXN0YW5jZV09XCJzdGVwRGlzdGFuY2VcIlxuICAgICAgICBbc3RlcF09XCJzdGVwXCJcbiAgICAgICAgW3RlbXBsYXRlUmVmXT1cInRodW1iVG9UZW1wbGF0ZVJlZlwiXG4gICAgICAgIFtjb250ZXh0XT1cImNvbnRleHRcIlxuICAgICAgICAodGh1bWJDaGFuZ2UpPVwib25UaHVtYkNoYW5nZSgpXCJcbiAgICAgICAgKGhvdmVyQ2hhbmdlKT1cIm9uSG92ZXJDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtkZWFjdGl2ZVN0YXRlXT1cImRlYWN0aXZhdGVUaHVtYkxhYmVsXCJcbiAgICAgICAgW3RodW1iTGFiZWxWaXNpYmlsaXR5RHVyYXRpb25dPVwidGh1bWJMYWJlbFZpc2liaWxpdHlEdXJhdGlvblwiPjwvaWd4LXRodW1iPlxuPC9kaXY+XG4iXX0=