/* eslint-disable @angular-eslint/no-conflicting-lifecycle */
import { Directive, Input, NgModule, Output, EventEmitter, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { IgxMaskDirective } from '../mask/mask.directive';
import { isDate } from '../../core/utils';
import { DatePart } from './date-time-editor.common';
import { noop } from 'rxjs';
import { DateTimeUtil } from '../../date-common/util/date-time.util';
import * as i0 from "@angular/core";
import * as i1 from "../mask/mask-parsing.service";
import * as i2 from "../../core/utils";
/**
 * Date Time Editor provides a functionality to input, edit and format date and time.
 *
 * @igxModule IgxDateTimeEditorModule
 *
 * @igxParent IgxInputGroup
 *
 * @igxTheme igx-input-theme
 *
 * @igxKeywords date, time, editor
 *
 * @igxGroup Scheduling
 *
 * @remarks
 *
 * The Ignite UI Date Time Editor Directive makes it easy for developers to manipulate date/time user input.
 * It requires input in a specified or default input format which is visible in the input element as a placeholder.
 * It allows the input of only date (ex: 'dd/MM/yyyy'), only time (ex:'HH:mm tt') or both at once, if needed.
 * Supports display format that may differ from the input format.
 * Provides methods to increment and decrement any specific/targeted `DatePart`.
 *
 * @example
 * ```html
 * <igx-input-group>
 *   <input type="text" igxInput [igxDateTimeEditor]="'dd/MM/yyyy'" [displayFormat]="'shortDate'" [(ngModel)]="date"/>
 * </igx-input-group>
 * ```
 */
export class IgxDateTimeEditorDirective extends IgxMaskDirective {
    constructor(renderer, elementRef, maskParser, platform, _document, _locale) {
        super(elementRef, maskParser, renderer, platform);
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.maskParser = maskParser;
        this.platform = platform;
        this._document = _document;
        this._locale = _locale;
        /**
         * Specify if the currently spun date segment should loop over.
         *
         * @example
         * ```html
         * <input igxDateTimeEditor [spinLoop]="false">
         * ```
         */
        this.spinLoop = true;
        /**
         * Emitted when the editor's value has changed.
         *
         * @example
         * ```html
         * <input igxDateTimeEditor (valueChange)="valueChange($event)"/>
         * ```
         */
        this.valueChange = new EventEmitter();
        /**
         * Emitted when the editor is not within a specified range or when the editor's value is in an invalid state.
         *
         * @example
         * ```html
         * <input igxDateTimeEditor [minValue]="minDate" [maxValue]="maxDate" (validationFailed)="onValidationFailed($event)"/>
         * ```
         */
        this.validationFailed = new EventEmitter();
        this._datePartDeltas = {
            date: 1,
            month: 1,
            year: 1,
            hours: 1,
            minutes: 1,
            seconds: 1
        };
        this.onTouchCallback = noop;
        this.onChangeCallback = noop;
        this.onValidatorChange = noop;
        this.document = this._document;
        this.locale = this.locale || this._locale;
    }
    /**
     * Minimum value required for the editor to remain valid.
     *
     * @remarks
     * If a `string` value is passed, it must be in the defined input format.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [minValue]="minDate">
     * ```
     */
    get minValue() {
        return this._minValue;
    }
    set minValue(value) {
        this._minValue = value;
        this.onValidatorChange();
    }
    /**
     * Maximum value required for the editor to remain valid.
     *
     * @remarks
     * If a `string` value is passed in, it must be in the defined input format.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [maxValue]="maxDate">
     * ```
     */
    get maxValue() {
        return this._maxValue;
    }
    set maxValue(value) {
        this._maxValue = value;
        this.onValidatorChange();
    }
    /**
     * Expected user input format (and placeholder).
     *
     * @example
     * ```html
     * <input [igxDateTimeEditor]="'dd/MM/yyyy'">
     * ```
     */
    set inputFormat(value) {
        if (value) {
            this.setMask(value);
            this._inputFormat = value;
        }
    }
    get inputFormat() {
        return this._inputFormat || this._defaultInputFormat;
    }
    /**
     * Editor value.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [value]="date">
     * ```
     */
    set value(value) {
        this._value = value;
        this.setDateValue(value);
        this.onChangeCallback(value);
        this.updateMask();
    }
    get value() {
        return this._value;
    }
    get datePartDeltas() {
        return Object.assign({}, this._datePartDeltas, this.spinDelta);
    }
    get emptyMask() {
        return this.maskParser.applyMask(null, this.maskOptions);
    }
    get targetDatePart() {
        // V.K. May 16th, 2022 #11556 Get correct date part in shadow DOM
        if (this.document.activeElement === this.nativeElement ||
            this.document.activeElement?.shadowRoot?.activeElement === this.nativeElement) {
            return this._inputDateParts
                .find(p => p.start <= this.selectionStart && this.selectionStart <= p.end && p.type !== DatePart.Literal)?.type;
        }
        else {
            if (this._inputDateParts.some(p => p.type === DatePart.Date)) {
                return DatePart.Date;
            }
            else if (this._inputDateParts.some(p => p.type === DatePart.Hours)) {
                return DatePart.Hours;
            }
        }
    }
    get hasDateParts() {
        return this._inputDateParts.some(p => p.type === DatePart.Date
            || p.type === DatePart.Month
            || p.type === DatePart.Year);
    }
    get hasTimeParts() {
        return this._inputDateParts.some(p => p.type === DatePart.Hours
            || p.type === DatePart.Minutes
            || p.type === DatePart.Seconds);
    }
    get dateValue() {
        return this._dateValue;
    }
    onWheel(event) {
        if (!this._isFocused) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (event.deltaY > 0) {
            this.decrement();
        }
        else {
            this.increment();
        }
    }
    ngOnInit() {
        this.updateDefaultFormat();
        this.setMask(this.inputFormat);
        this.updateMask();
    }
    /** @hidden @internal */
    ngOnChanges(changes) {
        if (changes['locale'] && !changes['locale'].firstChange) {
            this.updateDefaultFormat();
            if (!this._inputFormat) {
                this.setMask(this.inputFormat);
                this.updateMask();
            }
        }
        if (changes['inputFormat'] && !changes['inputFormat'].firstChange) {
            this.updateMask();
        }
    }
    /** Clear the input element value. */
    clear() {
        this._onClear = true;
        this.updateValue(null);
        this.setSelectionRange(0, this.inputValue.length);
        this._onClear = false;
    }
    /**
     * Increment specified DatePart.
     *
     * @param datePart The optional DatePart to increment. Defaults to Date or Hours (when Date is absent from the inputFormat - ex:'HH:mm').
     * @param delta The optional delta to increment by. Overrides `spinDelta`.
     */
    increment(datePart, delta) {
        const targetPart = datePart || this.targetDatePart;
        if (!targetPart) {
            return;
        }
        const newValue = this.trySpinValue(targetPart, delta);
        this.updateValue(newValue);
    }
    /**
     * Decrement specified DatePart.
     *
     * @param datePart The optional DatePart to decrement. Defaults to Date or Hours (when Date is absent from the inputFormat - ex:'HH:mm').
     * @param delta The optional delta to decrement by. Overrides `spinDelta`.
     */
    decrement(datePart, delta) {
        const targetPart = datePart || this.targetDatePart;
        if (!targetPart) {
            return;
        }
        const newValue = this.trySpinValue(targetPart, delta, true);
        this.updateValue(newValue);
    }
    /** @hidden @internal */
    writeValue(value) {
        this._value = value;
        this.setDateValue(value);
        this.updateMask();
    }
    /** @hidden @internal */
    validate(control) {
        if (!control.value) {
            return null;
        }
        // InvalidDate handling
        if (isDate(control.value) && !DateTimeUtil.isValidDate(control.value)) {
            return { value: true };
        }
        let errors = {};
        const value = DateTimeUtil.isValidDate(control.value) ? control.value : DateTimeUtil.parseIsoDate(control.value);
        const minValueDate = DateTimeUtil.isValidDate(this.minValue) ? this.minValue : this.parseDate(this.minValue);
        const maxValueDate = DateTimeUtil.isValidDate(this.maxValue) ? this.maxValue : this.parseDate(this.maxValue);
        if (minValueDate || maxValueDate) {
            errors = DateTimeUtil.validateMinMax(value, minValueDate, maxValueDate, this.hasTimeParts, this.hasDateParts);
        }
        return Object.keys(errors).length > 0 ? errors : null;
    }
    /** @hidden @internal */
    registerOnValidatorChange(fn) {
        this.onValidatorChange = fn;
    }
    /** @hidden @internal */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /** @hidden @internal */
    registerOnTouched(fn) {
        this.onTouchCallback = fn;
    }
    /** @hidden @internal */
    setDisabledState(_isDisabled) { }
    /** @hidden @internal */
    onCompositionEnd() {
        super.onCompositionEnd();
        this.updateValue(this.parseDate(this.inputValue));
        this.updateMask();
    }
    /** @hidden @internal */
    onInputChanged(event) {
        super.onInputChanged(event);
        if (this._composing) {
            return;
        }
        if (this.inputIsComplete()) {
            const parsedDate = this.parseDate(this.inputValue);
            if (DateTimeUtil.isValidDate(parsedDate)) {
                this.updateValue(parsedDate);
            }
            else {
                const oldValue = this.value && new Date(this.dateValue.getTime());
                const args = { oldValue, newValue: parsedDate, userInput: this.inputValue };
                this.validationFailed.emit(args);
                if (DateTimeUtil.isValidDate(args.newValue)) {
                    this.updateValue(args.newValue);
                }
                else {
                    this.updateValue(null);
                }
            }
        }
        else {
            this.updateValue(null);
        }
    }
    /** @hidden @internal */
    onKeyDown(event) {
        if (this.nativeElement.readOnly) {
            return;
        }
        super.onKeyDown(event);
        const key = event.key;
        if (event.altKey) {
            return;
        }
        if (key === this.platform.KEYMAP.ARROW_DOWN || key === this.platform.KEYMAP.ARROW_UP) {
            this.spin(event);
            return;
        }
        if (event.ctrlKey && key === this.platform.KEYMAP.SEMICOLON) {
            this.updateValue(new Date());
        }
        this.moveCursor(event);
    }
    /** @hidden @internal */
    onFocus() {
        if (this.nativeElement.readOnly) {
            return;
        }
        this._isFocused = true;
        this.onTouchCallback();
        this.updateMask();
        super.onFocus();
    }
    /** @hidden @internal */
    onBlur(value) {
        this._isFocused = false;
        if (!this.inputIsComplete() && this.inputValue !== this.emptyMask) {
            this.updateValue(this.parseDate(this.inputValue));
        }
        else {
            this.updateMask();
        }
        // TODO: think of a better way to set displayValuePipe in mask directive
        if (this.displayValuePipe) {
            return;
        }
        super.onBlur(value);
    }
    // the date editor sets its own inputFormat as its placeholder if none is provided
    /** @hidden */
    setPlaceholder(_value) { }
    updateDefaultFormat() {
        this._defaultInputFormat = DateTimeUtil.getDefaultInputFormat(this.locale);
    }
    updateMask() {
        if (this._isFocused) {
            // store the cursor position as it will be moved during masking
            const cursor = this.selectionEnd;
            this.inputValue = this.getMaskedValue();
            this.setSelectionRange(cursor);
        }
        else {
            if (!this.dateValue || !DateTimeUtil.isValidDate(this.dateValue)) {
                this.inputValue = '';
                return;
            }
            if (this.displayValuePipe) {
                // TODO: remove when formatter func has been deleted
                this.inputValue = this.displayValuePipe.transform(this.value);
                return;
            }
            const format = this.displayFormat || this.inputFormat;
            if (format) {
                this.inputValue = DateTimeUtil.formatDate(this.dateValue, format.replace('tt', 'aa'), this.locale);
            }
            else {
                this.inputValue = this.dateValue.toLocaleString();
            }
        }
    }
    setMask(inputFormat) {
        const oldFormat = this._inputDateParts?.map(p => p.format).join('');
        this._inputDateParts = DateTimeUtil.parseDateTimeFormat(inputFormat);
        inputFormat = this._inputDateParts.map(p => p.format).join('');
        const mask = (inputFormat || DateTimeUtil.DEFAULT_INPUT_FORMAT)
            .replace(new RegExp(/(?=[^t])[\w]/, 'g'), '0');
        this.mask = mask.indexOf('tt') !== -1 ? mask.replace(new RegExp('tt', 'g'), 'LL') : mask;
        const placeholder = this.nativeElement.placeholder;
        if (!placeholder || oldFormat === placeholder) {
            this.renderer.setAttribute(this.nativeElement, 'placeholder', inputFormat);
        }
    }
    parseDate(val) {
        if (!val) {
            return null;
        }
        return DateTimeUtil.parseValueFromMask(val, this._inputDateParts, this.promptChar);
    }
    getMaskedValue() {
        let mask = this.emptyMask;
        if (DateTimeUtil.isValidDate(this.value)) {
            for (const part of this._inputDateParts) {
                if (part.type === DatePart.Literal) {
                    continue;
                }
                const targetValue = this.getPartValue(part, part.format.length);
                mask = this.maskParser.replaceInMask(mask, targetValue, this.maskOptions, part.start, part.end).value;
            }
            return mask;
        }
        if (!this.inputIsComplete() || !this._onClear) {
            return this.inputValue;
        }
        return mask;
    }
    valueInRange(value) {
        if (!value) {
            return false;
        }
        let errors = {};
        const minValueDate = DateTimeUtil.isValidDate(this.minValue) ? this.minValue : this.parseDate(this.minValue);
        const maxValueDate = DateTimeUtil.isValidDate(this.maxValue) ? this.maxValue : this.parseDate(this.maxValue);
        if (minValueDate || maxValueDate) {
            errors = DateTimeUtil.validateMinMax(value, this.minValue, this.maxValue, this.hasTimeParts, this.hasDateParts);
        }
        return Object.keys(errors).length === 0;
    }
    spinValue(datePart, delta) {
        if (!this.dateValue || !DateTimeUtil.isValidDate(this.dateValue)) {
            return null;
        }
        const newDate = new Date(this.dateValue.getTime());
        switch (datePart) {
            case DatePart.Date:
                DateTimeUtil.spinDate(delta, newDate, this.spinLoop);
                break;
            case DatePart.Month:
                DateTimeUtil.spinMonth(delta, newDate, this.spinLoop);
                break;
            case DatePart.Year:
                DateTimeUtil.spinYear(delta, newDate);
                break;
            case DatePart.Hours:
                DateTimeUtil.spinHours(delta, newDate, this.spinLoop);
                break;
            case DatePart.Minutes:
                DateTimeUtil.spinMinutes(delta, newDate, this.spinLoop);
                break;
            case DatePart.Seconds:
                DateTimeUtil.spinSeconds(delta, newDate, this.spinLoop);
                break;
            case DatePart.AmPm:
                const formatPart = this._inputDateParts.find(dp => dp.type === DatePart.AmPm);
                const amPmFromMask = this.inputValue.substring(formatPart.start, formatPart.end);
                return DateTimeUtil.spinAmPm(newDate, this.dateValue, amPmFromMask);
        }
        return newDate;
    }
    trySpinValue(datePart, delta, negative = false) {
        if (!delta) {
            // default to 1 if a delta is set to 0 or any other falsy value
            delta = this.datePartDeltas[datePart] || 1;
        }
        const spinValue = negative ? -Math.abs(delta) : Math.abs(delta);
        return this.spinValue(datePart, spinValue) || new Date();
    }
    setDateValue(value) {
        this._dateValue = DateTimeUtil.isValidDate(value)
            ? value
            : DateTimeUtil.parseIsoDate(value);
    }
    updateValue(newDate) {
        this._oldValue = this.dateValue;
        this.value = newDate;
        // TODO: should we emit events here?
        if (this.inputIsComplete() || this.inputValue === this.emptyMask) {
            this.valueChange.emit(this.dateValue);
        }
        if (this.dateValue && !this.valueInRange(this.dateValue)) {
            this.validationFailed.emit({ oldValue: this._oldValue, newValue: this.dateValue, userInput: this.inputValue });
        }
    }
    toTwelveHourFormat(value) {
        let hour = parseInt(value.replace(new RegExp(this.promptChar, 'g'), '0'), 10);
        if (hour > 12) {
            hour -= 12;
        }
        else if (hour === 0) {
            hour = 12;
        }
        return hour;
    }
    getPartValue(datePartInfo, partLength) {
        let maskedValue;
        const datePart = datePartInfo.type;
        switch (datePart) {
            case DatePart.Date:
                maskedValue = this.dateValue.getDate();
                break;
            case DatePart.Month:
                // months are zero based
                maskedValue = this.dateValue.getMonth() + 1;
                break;
            case DatePart.Year:
                if (partLength === 2) {
                    maskedValue = this.prependValue(parseInt(this.dateValue.getFullYear().toString().slice(-2), 10), partLength, '0');
                }
                else {
                    maskedValue = this.dateValue.getFullYear();
                }
                break;
            case DatePart.Hours:
                if (datePartInfo.format.indexOf('h') !== -1) {
                    maskedValue = this.prependValue(this.toTwelveHourFormat(this.dateValue.getHours().toString()), partLength, '0');
                }
                else {
                    maskedValue = this.dateValue.getHours();
                }
                break;
            case DatePart.Minutes:
                maskedValue = this.dateValue.getMinutes();
                break;
            case DatePart.Seconds:
                maskedValue = this.dateValue.getSeconds();
                break;
            case DatePart.AmPm:
                maskedValue = this.dateValue.getHours() >= 12 ? 'PM' : 'AM';
                break;
        }
        if (datePartInfo.type !== DatePart.AmPm) {
            return this.prependValue(maskedValue, partLength, '0');
        }
        return maskedValue;
    }
    prependValue(value, partLength, prependChar) {
        return (prependChar + value.toString()).slice(-partLength);
    }
    spin(event) {
        event.preventDefault();
        switch (event.key) {
            case this.platform.KEYMAP.ARROW_UP:
                this.increment();
                break;
            case this.platform.KEYMAP.ARROW_DOWN:
                this.decrement();
                break;
        }
    }
    inputIsComplete() {
        return this.inputValue.indexOf(this.promptChar) === -1;
    }
    moveCursor(event) {
        const value = event.target.value;
        switch (event.key) {
            case this.platform.KEYMAP.ARROW_LEFT:
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.setSelectionRange(this.getNewPosition(value));
                }
                break;
            case this.platform.KEYMAP.ARROW_RIGHT:
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.setSelectionRange(this.getNewPosition(value, 1));
                }
                break;
        }
    }
    /**
     * Move the cursor in a specific direction until it reaches a date/time separator.
     * Then return its index.
     *
     * @param value The string it operates on.
     * @param direction 0 is left, 1 is right. Default is 0.
     */
    getNewPosition(value, direction = 0) {
        const literals = this._inputDateParts.filter(p => p.type === DatePart.Literal);
        let cursorPos = this.selectionStart;
        if (!direction) {
            do {
                cursorPos = cursorPos > 0 ? --cursorPos : cursorPos;
            } while (!literals.some(l => l.end === cursorPos) && cursorPos > 0);
            return cursorPos;
        }
        else {
            do {
                cursorPos++;
            } while (!literals.some(l => l.start === cursorPos) && cursorPos < value.length);
            return cursorPos;
        }
    }
}
IgxDateTimeEditorDirective.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateTimeEditorDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.MaskParsingService }, { token: i2.PlatformUtil }, { token: DOCUMENT }, { token: LOCALE_ID }], target: i0.????FactoryTarget.Directive });
IgxDateTimeEditorDirective.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDateTimeEditorDirective, selector: "[igxDateTimeEditor]", inputs: { locale: "locale", minValue: "minValue", maxValue: "maxValue", spinLoop: "spinLoop", displayFormat: "displayFormat", inputFormat: ["igxDateTimeEditor", "inputFormat"], value: "value", spinDelta: "spinDelta" }, outputs: { valueChange: "valueChange", validationFailed: "validationFailed" }, host: { listeners: { "wheel": "onWheel($event)" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDateTimeEditorDirective, multi: true },
        { provide: NG_VALIDATORS, useExisting: IgxDateTimeEditorDirective, multi: true }
    ], exportAs: ["igxDateTimeEditor"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateTimeEditorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxDateTimeEditor]',
                    exportAs: 'igxDateTimeEditor',
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDateTimeEditorDirective, multi: true },
                        { provide: NG_VALIDATORS, useExisting: IgxDateTimeEditorDirective, multi: true }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.MaskParsingService }, { type: i2.PlatformUtil }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; }, propDecorators: { locale: [{
                type: Input
            }], minValue: [{
                type: Input
            }], maxValue: [{
                type: Input
            }], spinLoop: [{
                type: Input
            }], displayFormat: [{
                type: Input
            }], inputFormat: [{
                type: Input,
                args: [`igxDateTimeEditor`]
            }], value: [{
                type: Input
            }], spinDelta: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], validationFailed: [{
                type: Output
            }], onWheel: [{
                type: HostListener,
                args: ['wheel', ['$event']]
            }] } });
export class IgxDateTimeEditorModule {
}
IgxDateTimeEditorModule.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateTimeEditorModule, deps: [], target: i0.????FactoryTarget.NgModule });
IgxDateTimeEditorModule.??mod = i0.????ngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateTimeEditorModule, declarations: [IgxDateTimeEditorDirective], exports: [IgxDateTimeEditorDirective] });
IgxDateTimeEditorModule.??inj = i0.????ngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateTimeEditorModule });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateTimeEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxDateTimeEditorDirective],
                    exports: [IgxDateTimeEditorDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLWVkaXRvci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZGlyZWN0aXZlcy9kYXRlLXRpbWUtZWRpdG9yL2RhdGUtdGltZS1lZGl0b3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZEQUE2RDtBQUM3RCxPQUFPLEVBQ0wsU0FBUyxFQUFFLEtBQUssRUFDTCxRQUFRLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQ2pELFNBQVMsRUFBNEIsWUFBWSxFQUNsRCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBRXlDLGFBQWEsRUFBRSxpQkFBaUIsR0FDL0UsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFMUQsT0FBTyxFQUFFLE1BQU0sRUFBZ0IsTUFBTSxrQkFBa0IsQ0FBQztBQUN4RCxPQUFPLEVBQTRDLFFBQVEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9GLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVDQUF1QyxDQUFDOzs7O0FBRXJFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQkc7QUFTSCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsZ0JBQWdCO0lBNk45RCxZQUNZLFFBQW1CLEVBQ25CLFVBQXNCLEVBQ3RCLFVBQThCLEVBQzlCLFFBQXNCLEVBQ04sU0FBYyxFQUNiLE9BQVk7UUFDdkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBTnhDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIs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MkZBRVUsMEJBQTBCO2tCQVJ0QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFNBQVMsRUFBRTt3QkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLDRCQUE0QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7d0JBQ3BGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLDRCQUE0QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7cUJBQ2pGO2lCQUNGOzswQkFtT0ksTUFBTTsyQkFBQyxRQUFROzswQkFDZixNQUFNOzJCQUFDLFNBQVM7NENBbk5aLE1BQU07c0JBRFosS0FBSztnQkFtQkssUUFBUTtzQkFEbEIsS0FBSztnQkFzQkssUUFBUTtzQkFEbEIsS0FBSztnQkFlQyxRQUFRO3NCQURkLEtBQUs7Z0JBYUMsYUFBYTtzQkFEbkIsS0FBSztnQkFZSyxXQUFXO3NCQURyQixLQUFLO3VCQUFDLG1CQUFtQjtnQkFxQmYsS0FBSztzQkFEZixLQUFLO2dCQXNCQyxTQUFTO3NCQURmLEtBQUs7Z0JBWUMsV0FBVztzQkFEakIsTUFBTTtnQkFZQSxnQkFBZ0I7c0JBRHRCLE1BQU07Z0JBZ0ZBLE9BQU87c0JBRGIsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBaWVuQyxNQUFNLE9BQU8sdUJBQXVCOztvSEFBdkIsdUJBQXVCO3FIQUF2Qix1QkFBdUIsaUJBMXNCdkIsMEJBQTBCLGFBQTFCLDBCQUEwQjtxSEEwc0IxQix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFKbkMsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMsMEJBQTBCLENBQUM7aUJBQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQGFuZ3VsYXItZXNsaW50L25vLWNvbmZsaWN0aW5nLWxpZmVjeWNsZSAqL1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBJbnB1dCwgRWxlbWVudFJlZixcbiAgUmVuZGVyZXIyLCBOZ01vZHVsZSwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEluamVjdCxcbiAgTE9DQUxFX0lELCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEhvc3RMaXN0ZW5lciwgT25Jbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUixcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSWd4TWFza0RpcmVjdGl2ZSB9IGZyb20gJy4uL21hc2svbWFzay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTWFza1BhcnNpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vbWFzay9tYXNrLXBhcnNpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBpc0RhdGUsIFBsYXRmb3JtVXRpbCB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSWd4RGF0ZVRpbWVFZGl0b3JFdmVudEFyZ3MsIERhdGVQYXJ0SW5mbywgRGF0ZVBhcnQgfSBmcm9tICcuL2RhdGUtdGltZS1lZGl0b3IuY29tbW9uJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IERhdGVQYXJ0RGVsdGFzIH0gZnJvbSAnLi9kYXRlLXRpbWUtZWRpdG9yLmNvbW1vbic7XG5pbXBvcnQgeyBEYXRlVGltZVV0aWwgfSBmcm9tICcuLi8uLi9kYXRlLWNvbW1vbi91dGlsL2RhdGUtdGltZS51dGlsJztcblxuLyoqXG4gKiBEYXRlIFRpbWUgRWRpdG9yIHByb3ZpZGVzIGEgZnVuY3Rpb25hbGl0eSB0byBpbnB1dCwgZWRpdCBhbmQgZm9ybWF0IGRhdGUgYW5kIHRpbWUuXG4gKlxuICogQGlneE1vZHVsZSBJZ3hEYXRlVGltZUVkaXRvck1vZHVsZVxuICpcbiAqIEBpZ3hQYXJlbnQgSWd4SW5wdXRHcm91cFxuICpcbiAqIEBpZ3hUaGVtZSBpZ3gtaW5wdXQtdGhlbWVcbiAqXG4gKiBAaWd4S2V5d29yZHMgZGF0ZSwgdGltZSwgZWRpdG9yXG4gKlxuICogQGlneEdyb3VwIFNjaGVkdWxpbmdcbiAqXG4gKiBAcmVtYXJrc1xuICpcbiAqIFRoZSBJZ25pdGUgVUkgRGF0ZSBUaW1lIEVkaXRvciBEaXJlY3RpdmUgbWFrZXMgaXQgZWFzeSBmb3IgZGV2ZWxvcGVycyB0byBtYW5pcHVsYXRlIGRhdGUvdGltZSB1c2VyIGlucHV0LlxuICogSXQgcmVxdWlyZXMgaW5wdXQgaW4gYSBzcGVjaWZpZWQgb3IgZGVmYXVsdCBpbnB1dCBmb3JtYXQgd2hpY2ggaXMgdmlzaWJsZSBpbiB0aGUgaW5wdXQgZWxlbWVudCBhcyBhIHBsYWNlaG9sZGVyLlxuICogSXQgYWxsb3dzIHRoZSBpbnB1dCBvZiBvbmx5IGRhdGUgKGV4OiAnZGQvTU0veXl5eScpLCBvbmx5IHRpbWUgKGV4OidISDptbSB0dCcpIG9yIGJvdGggYXQgb25jZSwgaWYgbmVlZGVkLlxuICogU3VwcG9ydHMgZGlzcGxheSBmb3JtYXQgdGhhdCBtYXkgZGlmZmVyIGZyb20gdGhlIGlucHV0IGZvcm1hdC5cbiAqIFByb3ZpZGVzIG1ldGhvZHMgdG8gaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYW55IHNwZWNpZmljL3RhcmdldGVkIGBEYXRlUGFydGAuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtaW5wdXQtZ3JvdXA+XG4gKiAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlneElucHV0IFtpZ3hEYXRlVGltZUVkaXRvcl09XCInZGQvTU0veXl5eSdcIiBbZGlzcGxheUZvcm1hdF09XCInc2hvcnREYXRlJ1wiIFsobmdNb2RlbCldPVwiZGF0ZVwiLz5cbiAqIDwvaWd4LWlucHV0LWdyb3VwPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tpZ3hEYXRlVGltZUVkaXRvcl0nLFxuICBleHBvcnRBczogJ2lneERhdGVUaW1lRWRpdG9yJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IElneERhdGVUaW1lRWRpdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZSB9LFxuICAgIHsgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IElneERhdGVUaW1lRWRpdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZSB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4RGF0ZVRpbWVFZGl0b3JEaXJlY3RpdmUgZXh0ZW5kcyBJZ3hNYXNrRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIFZhbGlkYXRvciwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogTG9jYWxlIHNldHRpbmdzIHVzZWQgZm9yIHZhbHVlIGZvcm1hdHRpbmcuXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqIFVzZXMgQW5ndWxhcidzIGBMT0NBTEVfSURgIGJ5IGRlZmF1bHQuIEFmZmVjdHMgYm90aCBpbnB1dCBtYXNrIGFuZCBkaXNwbGF5IGZvcm1hdCBpZiB0aG9zZSBhcmUgbm90IHNldC5cbiAgICogSWYgYSBgbG9jYWxlYCBpcyBzZXQsIGl0IG11c3QgYmUgcmVnaXN0ZXJlZCB2aWEgYHJlZ2lzdGVyTG9jYWxlRGF0YWAuXG4gICAqIFBsZWFzZSByZWZlciB0byBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4biNpMThuLXBpcGVzLlxuICAgKiBJZiBpdCBpcyBub3QgcmVnaXN0ZXJlZCwgYEludGxgIHdpbGwgYmUgdXNlZCBmb3IgZm9ybWF0dGluZy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgaWd4RGF0ZVRpbWVFZGl0b3IgW2xvY2FsZV09XCInZW4nXCI+XG4gICAqIGBgYFxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIGxvY2FsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBNaW5pbXVtIHZhbHVlIHJlcXVpcmVkIGZvciB0aGUgZWRpdG9yIHRvIHJlbWFpbiB2YWxpZC5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICogSWYgYSBgc3RyaW5nYCB2YWx1ZSBpcyBwYXNzZWQsIGl0IG11c3QgYmUgaW4gdGhlIGRlZmluZWQgaW5wdXQgZm9ybWF0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBodG1sXG4gICAqIDxpbnB1dCBpZ3hEYXRlVGltZUVkaXRvciBbbWluVmFsdWVdPVwibWluRGF0ZVwiPlxuICAgKiBgYGBcbiAgICovXG4gIHB1YmxpYyBnZXQgbWluVmFsdWUoKTogc3RyaW5nIHwgRGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX21pblZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNldCBtaW5WYWx1ZSh2YWx1ZTogc3RyaW5nIHwgRGF0ZSkge1xuICAgIHRoaXMuX21pblZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5vblZhbGlkYXRvckNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1heGltdW0gdmFsdWUgcmVxdWlyZWQgZm9yIHRoZSBlZGl0b3IgdG8gcmVtYWluIHZhbGlkLlxuICAgKlxuICAgKiBAcmVtYXJrc1xuICAgKiBJZiBhIGBzdHJpbmdgIHZhbHVlIGlzIHBhc3NlZCBpbiwgaXQgbXVzdCBiZSBpbiB0aGUgZGVmaW5lZCBpbnB1dCBmb3JtYXQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGh0bWxcbiAgICogPGlucHV0IGlneERhdGVUaW1lRWRpdG9yIFttYXhWYWx1ZV09XCJtYXhEYXRlXCI+XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIGdldCBtYXhWYWx1ZSgpOiBzdHJpbmcgfCBEYXRlIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4VmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IG1heFZhbHVlKHZhbHVlOiBzdHJpbmcgfCBEYXRlKSB7XG4gICAgdGhpcy5fbWF4VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmeSBpZiB0aGUgY3VycmVudGx5IHNwdW4gZGF0ZSBzZWdtZW50IHNob3VsZCBsb29wIG92ZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYGh0bWxcbiAgICogPGlucHV0IGlneERhdGVUaW1lRWRpdG9yIFtzcGluTG9vcF09XCJmYWxzZVwiPlxuICAgKiBgYGBcbiAgICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzcGluTG9vcCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFNldCBib3RoIHByZS1kZWZpbmVkIGZvcm1hdCBvcHRpb25zIHN1Y2ggYXMgYHNob3J0RGF0ZWAgYW5kIGBsb25nRGF0ZWAsXG4gICAqIGFzIHdlbGwgYXMgY29uc3RydWN0ZWQgZm9ybWF0IHN0cmluZyB1c2luZyBjaGFyYWN0ZXJzIHN1cHBvcnRlZCBieSBgRGF0ZVBpcGVgLCBlLmcuIGBFRS9NTS95eXl5YC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgaWd4RGF0ZVRpbWVFZGl0b3IgW2Rpc3BsYXlGb3JtYXRdPVwiJ3Nob3J0RGF0ZSdcIj5cbiAgICogYGBgXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgZGlzcGxheUZvcm1hdDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeHBlY3RlZCB1c2VyIGlucHV0IGZvcm1hdCAoYW5kIHBsYWNlaG9sZGVyKS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgW2lneERhdGVUaW1lRWRpdG9yXT1cIidkZC9NTS95eXl5J1wiPlxuICAgKiBgYGBcbiAgICovXG4gIEBJbnB1dChgaWd4RGF0ZVRpbWVFZGl0b3JgKVxuICBwdWJsaWMgc2V0IGlucHV0Rm9ybWF0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0TWFzayh2YWx1ZSk7XG4gICAgICB0aGlzLl9pbnB1dEZvcm1hdCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgaW5wdXRGb3JtYXQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faW5wdXRGb3JtYXQgfHwgdGhpcy5fZGVmYXVsdElucHV0Rm9ybWF0O1xuICB9XG5cbiAgLyoqXG4gICAqIEVkaXRvciB2YWx1ZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgaWd4RGF0ZVRpbWVFZGl0b3IgW3ZhbHVlXT1cImRhdGVcIj5cbiAgICogYGBgXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnNldERhdGVWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZU1hc2soKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgdmFsdWUoKTogRGF0ZSB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbHRhIHZhbHVlcyB1c2VkIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgZWFjaCBlZGl0b3IgZGF0ZSBwYXJ0IG9uIHNwaW4gYWN0aW9ucy5cbiAgICogQWxsIHZhbHVlcyBkZWZhdWx0IHRvIGAxYC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgaWd4RGF0ZVRpbWVFZGl0b3IgW3NwaW5EZWx0YV09XCJ7ZGF0ZTogNSwgbWludXRlOiAzMH1cIj5cbiAgICogYGBgXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgc3BpbkRlbHRhOiBEYXRlUGFydERlbHRhcztcblxuICAvKipcbiAgICogRW1pdHRlZCB3aGVuIHRoZSBlZGl0b3IncyB2YWx1ZSBoYXMgY2hhbmdlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgaWd4RGF0ZVRpbWVFZGl0b3IgKHZhbHVlQ2hhbmdlKT1cInZhbHVlQ2hhbmdlKCRldmVudClcIi8+XG4gICAqIGBgYFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RGF0ZSB8IHN0cmluZz4oKTtcblxuICAvKipcbiAgICogRW1pdHRlZCB3aGVuIHRoZSBlZGl0b3IgaXMgbm90IHdpdGhpbiBhIHNwZWNpZmllZCByYW5nZSBvciB3aGVuIHRoZSBlZGl0b3IncyB2YWx1ZSBpcyBpbiBhbiBpbnZhbGlkIHN0YXRlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGBodG1sXG4gICAqIDxpbnB1dCBpZ3hEYXRlVGltZUVkaXRvciBbbWluVmFsdWVdPVwibWluRGF0ZVwiIFttYXhWYWx1ZV09XCJtYXhEYXRlXCIgKHZhbGlkYXRpb25GYWlsZWQpPVwib25WYWxpZGF0aW9uRmFpbGVkKCRldmVudClcIi8+XG4gICAqIGBgYFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB2YWxpZGF0aW9uRmFpbGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJZ3hEYXRlVGltZUVkaXRvckV2ZW50QXJncz4oKTtcblxuICBwcml2YXRlIF9pbnB1dEZvcm1hdDogc3RyaW5nO1xuICBwcml2YXRlIF9vbGRWYWx1ZTogRGF0ZTtcbiAgcHJpdmF0ZSBfZGF0ZVZhbHVlOiBEYXRlO1xuICBwcml2YXRlIF9vbkNsZWFyOiBib29sZWFuO1xuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSBfaXNGb2N1c2VkOiBib29sZWFuO1xuICBwcml2YXRlIF9kZWZhdWx0SW5wdXRGb3JtYXQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfdmFsdWU6IERhdGUgfCBzdHJpbmc7XG4gIHByaXZhdGUgX21pblZhbHVlOiBEYXRlIHwgc3RyaW5nO1xuICBwcml2YXRlIF9tYXhWYWx1ZTogRGF0ZSB8IHN0cmluZztcbiAgcHJpdmF0ZSBfaW5wdXREYXRlUGFydHM6IERhdGVQYXJ0SW5mb1tdO1xuICBwcml2YXRlIF9kYXRlUGFydERlbHRhczogRGF0ZVBhcnREZWx0YXMgPSB7XG4gICAgZGF0ZTogMSxcbiAgICBtb250aDogMSxcbiAgICB5ZWFyOiAxLFxuICAgIGhvdXJzOiAxLFxuICAgIG1pbnV0ZXM6IDEsXG4gICAgc2Vjb25kczogMVxuICB9O1xuICBwcml2YXRlIG9uVG91Y2hDYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkID0gbm9vcDtcbiAgcHJpdmF0ZSBvbkNoYW5nZUNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQgPSBub29wO1xuICBwcml2YXRlIG9uVmFsaWRhdG9yQ2hhbmdlOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQgPSBub29wO1xuXG4gIHByaXZhdGUgZ2V0IGRhdGVQYXJ0RGVsdGFzKCk6IERhdGVQYXJ0RGVsdGFzIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGF0ZVBhcnREZWx0YXMsIHRoaXMuc3BpbkRlbHRhKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGVtcHR5TWFzaygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1hc2tQYXJzZXIuYXBwbHlNYXNrKG51bGwsIHRoaXMubWFza09wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdGFyZ2V0RGF0ZVBhcnQoKTogRGF0ZVBhcnQge1xuICAgIC8vIFYuSy4gTWF5IDE2dGgsIDIwMjIgIzExNTU2IEdldCBjb3JyZWN0IGRhdGUgcGFydCBpbiBzaGFkb3cgRE9NXG4gICAgaWYgKHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5uYXRpdmVFbGVtZW50IHx8XG4gICAgICB0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ/LnNoYWRvd1Jvb3Q/LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMubmF0aXZlRWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lucHV0RGF0ZVBhcnRzXG4gICAgICAgIC5maW5kKHAgPT4gcC5zdGFydCA8PSB0aGlzLnNlbGVjdGlvblN0YXJ0ICYmIHRoaXMuc2VsZWN0aW9uU3RhcnQgPD0gcC5lbmQgJiYgcC50eXBlICE9PSBEYXRlUGFydC5MaXRlcmFsKT8udHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2lucHV0RGF0ZVBhcnRzLnNvbWUocCA9PiBwLnR5cGUgPT09IERhdGVQYXJ0LkRhdGUpKSB7XG4gICAgICAgIHJldHVybiBEYXRlUGFydC5EYXRlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9pbnB1dERhdGVQYXJ0cy5zb21lKHAgPT4gcC50eXBlID09PSBEYXRlUGFydC5Ib3VycykpIHtcbiAgICAgICAgcmV0dXJuIERhdGVQYXJ0LkhvdXJzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGhhc0RhdGVQYXJ0cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5wdXREYXRlUGFydHMuc29tZShcbiAgICAgIHAgPT4gcC50eXBlID09PSBEYXRlUGFydC5EYXRlXG4gICAgICAgIHx8IHAudHlwZSA9PT0gRGF0ZVBhcnQuTW9udGhcbiAgICAgICAgfHwgcC50eXBlID09PSBEYXRlUGFydC5ZZWFyKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGhhc1RpbWVQYXJ0cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5wdXREYXRlUGFydHMuc29tZShcbiAgICAgIHAgPT4gcC50eXBlID09PSBEYXRlUGFydC5Ib3Vyc1xuICAgICAgICB8fCBwLnR5cGUgPT09IERhdGVQYXJ0Lk1pbnV0ZXNcbiAgICAgICAgfHwgcC50eXBlID09PSBEYXRlUGFydC5TZWNvbmRzKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGRhdGVWYWx1ZSgpOiBEYXRlIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZVZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJvdGVjdGVkIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIG1hc2tQYXJzZXI6IE1hc2tQYXJzaW5nU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9sb2NhbGU6IGFueSkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIG1hc2tQYXJzZXIsIHJlbmRlcmVyLCBwbGF0Zm9ybSk7XG4gICAgdGhpcy5kb2N1bWVudCA9IHRoaXMuX2RvY3VtZW50IGFzIERvY3VtZW50O1xuICAgIHRoaXMubG9jYWxlID0gdGhpcy5sb2NhbGUgfHwgdGhpcy5fbG9jYWxlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2hlZWwnLCBbJyRldmVudCddKVxuICBwdWJsaWMgb25XaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNGb2N1c2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGV2ZW50LmRlbHRhWSA+IDApIHtcbiAgICAgIHRoaXMuZGVjcmVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5jcmVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlRGVmYXVsdEZvcm1hdCgpO1xuICAgIHRoaXMuc2V0TWFzayh0aGlzLmlucHV0Rm9ybWF0KTtcbiAgICB0aGlzLnVwZGF0ZU1hc2soKTtcbiAgfVxuXG4gIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydsb2NhbGUnXSAmJiAhY2hhbmdlc1snbG9jYWxlJ10uZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMudXBkYXRlRGVmYXVsdEZvcm1hdCgpO1xuICAgICAgaWYgKCF0aGlzLl9pbnB1dEZvcm1hdCkge1xuICAgICAgICB0aGlzLnNldE1hc2sodGhpcy5pbnB1dEZvcm1hdCk7XG4gICAgICAgIHRoaXMudXBkYXRlTWFzaygpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snaW5wdXRGb3JtYXQnXSAmJiAhY2hhbmdlc1snaW5wdXRGb3JtYXQnXS5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy51cGRhdGVNYXNrKCk7XG4gICAgfVxuICB9XG5cblxuICAvKiogQ2xlYXIgdGhlIGlucHV0IGVsZW1lbnQgdmFsdWUuICovXG4gIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNsZWFyID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlKG51bGwpO1xuICAgIHRoaXMuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgdGhpcy5pbnB1dFZhbHVlLmxlbmd0aCk7XG4gICAgdGhpcy5fb25DbGVhciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY3JlbWVudCBzcGVjaWZpZWQgRGF0ZVBhcnQuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRlUGFydCBUaGUgb3B0aW9uYWwgRGF0ZVBhcnQgdG8gaW5jcmVtZW50LiBEZWZhdWx0cyB0byBEYXRlIG9yIEhvdXJzICh3aGVuIERhdGUgaXMgYWJzZW50IGZyb20gdGhlIGlucHV0Rm9ybWF0IC0gZXg6J0hIOm1tJykuXG4gICAqIEBwYXJhbSBkZWx0YSBUaGUgb3B0aW9uYWwgZGVsdGEgdG8gaW5jcmVtZW50IGJ5LiBPdmVycmlkZXMgYHNwaW5EZWx0YWAuXG4gICAqL1xuICBwdWJsaWMgaW5jcmVtZW50KGRhdGVQYXJ0PzogRGF0ZVBhcnQsIGRlbHRhPzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgdGFyZ2V0UGFydCA9IGRhdGVQYXJ0IHx8IHRoaXMudGFyZ2V0RGF0ZVBhcnQ7XG4gICAgaWYgKCF0YXJnZXRQYXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy50cnlTcGluVmFsdWUodGFyZ2V0UGFydCwgZGVsdGEpO1xuICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY3JlbWVudCBzcGVjaWZpZWQgRGF0ZVBhcnQuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRlUGFydCBUaGUgb3B0aW9uYWwgRGF0ZVBhcnQgdG8gZGVjcmVtZW50LiBEZWZhdWx0cyB0byBEYXRlIG9yIEhvdXJzICh3aGVuIERhdGUgaXMgYWJzZW50IGZyb20gdGhlIGlucHV0Rm9ybWF0IC0gZXg6J0hIOm1tJykuXG4gICAqIEBwYXJhbSBkZWx0YSBUaGUgb3B0aW9uYWwgZGVsdGEgdG8gZGVjcmVtZW50IGJ5LiBPdmVycmlkZXMgYHNwaW5EZWx0YWAuXG4gICAqL1xuICBwdWJsaWMgZGVjcmVtZW50KGRhdGVQYXJ0PzogRGF0ZVBhcnQsIGRlbHRhPzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgdGFyZ2V0UGFydCA9IGRhdGVQYXJ0IHx8IHRoaXMudGFyZ2V0RGF0ZVBhcnQ7XG4gICAgaWYgKCF0YXJnZXRQYXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy50cnlTcGluVmFsdWUodGFyZ2V0UGFydCwgZGVsdGEsIHRydWUpO1xuICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUpO1xuICB9XG5cbiAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuc2V0RGF0ZVZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZU1hc2soKTtcbiAgfVxuXG4gIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgIGlmICghY29udHJvbC52YWx1ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIEludmFsaWREYXRlIGhhbmRsaW5nXG4gICAgaWYgKGlzRGF0ZShjb250cm9sLnZhbHVlKSAmJiAhRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogdHJ1ZSB9O1xuICAgIH1cblxuICAgIGxldCBlcnJvcnMgPSB7fTtcbiAgICBjb25zdCB2YWx1ZSA9IERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZShjb250cm9sLnZhbHVlKSA/IGNvbnRyb2wudmFsdWUgOiBEYXRlVGltZVV0aWwucGFyc2VJc29EYXRlKGNvbnRyb2wudmFsdWUpO1xuICAgIGNvbnN0IG1pblZhbHVlRGF0ZSA9IERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZSh0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiB0aGlzLnBhcnNlRGF0ZSh0aGlzLm1pblZhbHVlKTtcbiAgICBjb25zdCBtYXhWYWx1ZURhdGUgPSBEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogdGhpcy5wYXJzZURhdGUodGhpcy5tYXhWYWx1ZSk7XG4gICAgaWYgKG1pblZhbHVlRGF0ZSB8fCBtYXhWYWx1ZURhdGUpIHtcbiAgICAgIGVycm9ycyA9IERhdGVUaW1lVXRpbC52YWxpZGF0ZU1pbk1heCh2YWx1ZSxcbiAgICAgICAgbWluVmFsdWVEYXRlLCBtYXhWYWx1ZURhdGUsXG4gICAgICAgIHRoaXMuaGFzVGltZVBhcnRzLCB0aGlzLmhhc0RhdGVQYXJ0cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID4gMCA/IGVycm9ycyA6IG51bGw7XG4gIH1cblxuICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U/KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vblZhbGlkYXRvckNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaENhbGxiYWNrID0gZm47XG4gIH1cblxuICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIHNldERpc2FibGVkU3RhdGU/KF9pc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7IH1cblxuICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIG9uQ29tcG9zaXRpb25FbmQoKTogdm9pZCB7XG4gICAgc3VwZXIub25Db21wb3NpdGlvbkVuZCgpO1xuXG4gICAgdGhpcy51cGRhdGVWYWx1ZSh0aGlzLnBhcnNlRGF0ZSh0aGlzLmlucHV0VmFsdWUpKTtcbiAgICB0aGlzLnVwZGF0ZU1hc2soKTtcbiAgfVxuXG4gIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgb25JbnB1dENoYW5nZWQoZXZlbnQpOiB2b2lkIHtcbiAgICBzdXBlci5vbklucHV0Q2hhbmdlZChldmVudCk7XG4gICAgaWYgKHRoaXMuX2NvbXBvc2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlucHV0SXNDb21wbGV0ZSgpKSB7XG4gICAgICBjb25zdCBwYXJzZWREYXRlID0gdGhpcy5wYXJzZURhdGUodGhpcy5pbnB1dFZhbHVlKTtcbiAgICAgIGlmIChEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUocGFyc2VkRGF0ZSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShwYXJzZWREYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy52YWx1ZSAmJiBuZXcgRGF0ZSh0aGlzLmRhdGVWYWx1ZS5nZXRUaW1lKCkpO1xuICAgICAgICBjb25zdCBhcmdzOiBJZ3hEYXRlVGltZUVkaXRvckV2ZW50QXJncyA9IHsgb2xkVmFsdWUsIG5ld1ZhbHVlOiBwYXJzZWREYXRlLCB1c2VySW5wdXQ6IHRoaXMuaW5wdXRWYWx1ZSB9O1xuICAgICAgICB0aGlzLnZhbGlkYXRpb25GYWlsZWQuZW1pdChhcmdzKTtcbiAgICAgICAgaWYgKERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZShhcmdzLm5ld1ZhbHVlKSkge1xuICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoYXJncy5uZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbHVlKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubmF0aXZlRWxlbWVudC5yZWFkT25seSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdXBlci5vbktleURvd24oZXZlbnQpO1xuICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleTtcblxuICAgIGlmIChldmVudC5hbHRLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoa2V5ID09PSB0aGlzLnBsYXRmb3JtLktFWU1BUC5BUlJPV19ET1dOIHx8IGtleSA9PT0gdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQVJST1dfVVApIHtcbiAgICAgIHRoaXMuc3BpbihldmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYga2V5ID09PSB0aGlzLnBsYXRmb3JtLktFWU1BUC5TRU1JQ09MT04pIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsdWUobmV3IERhdGUoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5tb3ZlQ3Vyc29yKGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgb25Gb2N1cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uYXRpdmVFbGVtZW50LnJlYWRPbmx5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2lzRm9jdXNlZCA9IHRydWU7XG4gICAgdGhpcy5vblRvdWNoQ2FsbGJhY2soKTtcbiAgICB0aGlzLnVwZGF0ZU1hc2soKTtcbiAgICBzdXBlci5vbkZvY3VzKCk7XG4gIH1cblxuICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIG9uQmx1cih2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5faXNGb2N1c2VkID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLmlucHV0SXNDb21wbGV0ZSgpICYmIHRoaXMuaW5wdXRWYWx1ZSAhPT0gdGhpcy5lbXB0eU1hc2spIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsdWUodGhpcy5wYXJzZURhdGUodGhpcy5pbnB1dFZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBkYXRlTWFzaygpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHRoaW5rIG9mIGEgYmV0dGVyIHdheSB0byBzZXQgZGlzcGxheVZhbHVlUGlwZSBpbiBtYXNrIGRpcmVjdGl2ZVxuICAgIGlmICh0aGlzLmRpc3BsYXlWYWx1ZVBpcGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdXBlci5vbkJsdXIodmFsdWUpO1xuICB9XG5cbiAgLy8gdGhlIGRhdGUgZWRpdG9yIHNldHMgaXRzIG93biBpbnB1dEZvcm1hdCBhcyBpdHMgcGxhY2Vob2xkZXIgaWYgbm9uZSBpcyBwcm92aWRlZFxuICAvKiogQGhpZGRlbiAqL1xuICBwcm90ZWN0ZWQgc2V0UGxhY2Vob2xkZXIoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHsgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGVmYXVsdEZvcm1hdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9kZWZhdWx0SW5wdXRGb3JtYXQgPSBEYXRlVGltZVV0aWwuZ2V0RGVmYXVsdElucHV0Rm9ybWF0KHRoaXMubG9jYWxlKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTWFzaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNGb2N1c2VkKSB7XG4gICAgICAvLyBzdG9yZSB0aGUgY3Vyc29yIHBvc2l0aW9uIGFzIGl0IHdpbGwgYmUgbW92ZWQgZHVyaW5nIG1hc2tpbmdcbiAgICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuc2VsZWN0aW9uRW5kO1xuICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5nZXRNYXNrZWRWYWx1ZSgpO1xuICAgICAgdGhpcy5zZXRTZWxlY3Rpb25SYW5nZShjdXJzb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXRoaXMuZGF0ZVZhbHVlIHx8ICFEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodGhpcy5kYXRlVmFsdWUpKSB7XG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9ICcnO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNwbGF5VmFsdWVQaXBlKSB7XG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSB3aGVuIGZvcm1hdHRlciBmdW5jIGhhcyBiZWVuIGRlbGV0ZWRcbiAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5kaXNwbGF5VmFsdWVQaXBlLnRyYW5zZm9ybSh0aGlzLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9ybWF0ID0gdGhpcy5kaXNwbGF5Rm9ybWF0IHx8IHRoaXMuaW5wdXRGb3JtYXQ7XG4gICAgICBpZiAoZm9ybWF0KSB7XG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IERhdGVUaW1lVXRpbC5mb3JtYXREYXRlKHRoaXMuZGF0ZVZhbHVlLCBmb3JtYXQucmVwbGFjZSgndHQnLCAnYWEnKSwgdGhpcy5sb2NhbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5kYXRlVmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldE1hc2soaW5wdXRGb3JtYXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG9sZEZvcm1hdCA9IHRoaXMuX2lucHV0RGF0ZVBhcnRzPy5tYXAocCA9PiBwLmZvcm1hdCkuam9pbignJyk7XG4gICAgdGhpcy5faW5wdXREYXRlUGFydHMgPSBEYXRlVGltZVV0aWwucGFyc2VEYXRlVGltZUZvcm1hdChpbnB1dEZvcm1hdCk7XG4gICAgaW5wdXRGb3JtYXQgPSB0aGlzLl9pbnB1dERhdGVQYXJ0cy5tYXAocCA9PiBwLmZvcm1hdCkuam9pbignJyk7XG4gICAgY29uc3QgbWFzayA9IChpbnB1dEZvcm1hdCB8fCBEYXRlVGltZVV0aWwuREVGQVVMVF9JTlBVVF9GT1JNQVQpXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKC8oPz1bXnRdKVtcXHddLywgJ2cnKSwgJzAnKTtcbiAgICB0aGlzLm1hc2sgPSBtYXNrLmluZGV4T2YoJ3R0JykgIT09IC0xID8gbWFzay5yZXBsYWNlKG5ldyBSZWdFeHAoJ3R0JywgJ2cnKSwgJ0xMJykgOiBtYXNrO1xuXG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLm5hdGl2ZUVsZW1lbnQucGxhY2Vob2xkZXI7XG4gICAgaWYgKCFwbGFjZWhvbGRlciB8fCBvbGRGb3JtYXQgPT09IHBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdwbGFjZWhvbGRlcicsIGlucHV0Rm9ybWF0KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRGF0ZSh2YWw6IHN0cmluZyk6IERhdGUgfCBudWxsIHtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIERhdGVUaW1lVXRpbC5wYXJzZVZhbHVlRnJvbU1hc2sodmFsLCB0aGlzLl9pbnB1dERhdGVQYXJ0cywgdGhpcy5wcm9tcHRDaGFyKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TWFza2VkVmFsdWUoKTogc3RyaW5nIHtcbiAgICBsZXQgbWFzayA9IHRoaXMuZW1wdHlNYXNrO1xuICAgIGlmIChEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodGhpcy52YWx1ZSkpIHtcbiAgICAgIGZvciAoY29uc3QgcGFydCBvZiB0aGlzLl9pbnB1dERhdGVQYXJ0cykge1xuICAgICAgICBpZiAocGFydC50eXBlID09PSBEYXRlUGFydC5MaXRlcmFsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0VmFsdWUgPSB0aGlzLmdldFBhcnRWYWx1ZShwYXJ0LCBwYXJ0LmZvcm1hdC5sZW5ndGgpO1xuICAgICAgICBtYXNrID0gdGhpcy5tYXNrUGFyc2VyLnJlcGxhY2VJbk1hc2sobWFzaywgdGFyZ2V0VmFsdWUsIHRoaXMubWFza09wdGlvbnMsIHBhcnQuc3RhcnQsIHBhcnQuZW5kKS52YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXNrO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaW5wdXRJc0NvbXBsZXRlKCkgfHwgIXRoaXMuX29uQ2xlYXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmlucHV0VmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBtYXNrO1xuICB9XG5cblxuICBwcml2YXRlIHZhbHVlSW5SYW5nZSh2YWx1ZTogRGF0ZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgZXJyb3JzID0ge307XG4gICAgY29uc3QgbWluVmFsdWVEYXRlID0gRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IHRoaXMucGFyc2VEYXRlKHRoaXMubWluVmFsdWUpO1xuICAgIGNvbnN0IG1heFZhbHVlRGF0ZSA9IERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZSh0aGlzLm1heFZhbHVlKSA/IHRoaXMubWF4VmFsdWUgOiB0aGlzLnBhcnNlRGF0ZSh0aGlzLm1heFZhbHVlKTtcbiAgICBpZiAobWluVmFsdWVEYXRlIHx8IG1heFZhbHVlRGF0ZSkge1xuICAgICAgZXJyb3JzID0gRGF0ZVRpbWVVdGlsLnZhbGlkYXRlTWluTWF4KHZhbHVlLFxuICAgICAgICB0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlLFxuICAgICAgICB0aGlzLmhhc1RpbWVQYXJ0cywgdGhpcy5oYXNEYXRlUGFydHMpO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhlcnJvcnMpLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHByaXZhdGUgc3BpblZhbHVlKGRhdGVQYXJ0OiBEYXRlUGFydCwgZGVsdGE6IG51bWJlcik6IERhdGUge1xuICAgIGlmICghdGhpcy5kYXRlVmFsdWUgfHwgIURhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZSh0aGlzLmRhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUodGhpcy5kYXRlVmFsdWUuZ2V0VGltZSgpKTtcbiAgICBzd2l0Y2ggKGRhdGVQYXJ0KSB7XG4gICAgICBjYXNlIERhdGVQYXJ0LkRhdGU6XG4gICAgICAgIERhdGVUaW1lVXRpbC5zcGluRGF0ZShkZWx0YSwgbmV3RGF0ZSwgdGhpcy5zcGluTG9vcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5Nb250aDpcbiAgICAgICAgRGF0ZVRpbWVVdGlsLnNwaW5Nb250aChkZWx0YSwgbmV3RGF0ZSwgdGhpcy5zcGluTG9vcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5ZZWFyOlxuICAgICAgICBEYXRlVGltZVV0aWwuc3BpblllYXIoZGVsdGEsIG5ld0RhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRGF0ZVBhcnQuSG91cnM6XG4gICAgICAgIERhdGVUaW1lVXRpbC5zcGluSG91cnMoZGVsdGEsIG5ld0RhdGUsIHRoaXMuc3Bpbkxvb3ApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRGF0ZVBhcnQuTWludXRlczpcbiAgICAgICAgRGF0ZVRpbWVVdGlsLnNwaW5NaW51dGVzKGRlbHRhLCBuZXdEYXRlLCB0aGlzLnNwaW5Mb29wKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERhdGVQYXJ0LlNlY29uZHM6XG4gICAgICAgIERhdGVUaW1lVXRpbC5zcGluU2Vjb25kcyhkZWx0YSwgbmV3RGF0ZSwgdGhpcy5zcGluTG9vcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5BbVBtOlxuICAgICAgICBjb25zdCBmb3JtYXRQYXJ0ID0gdGhpcy5faW5wdXREYXRlUGFydHMuZmluZChkcCA9PiBkcC50eXBlID09PSBEYXRlUGFydC5BbVBtKTtcbiAgICAgICAgY29uc3QgYW1QbUZyb21NYXNrID0gdGhpcy5pbnB1dFZhbHVlLnN1YnN0cmluZyhmb3JtYXRQYXJ0LnN0YXJ0LCBmb3JtYXRQYXJ0LmVuZCk7XG4gICAgICAgIHJldHVybiBEYXRlVGltZVV0aWwuc3BpbkFtUG0obmV3RGF0ZSwgdGhpcy5kYXRlVmFsdWUsIGFtUG1Gcm9tTWFzayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0RhdGU7XG4gIH1cblxuICBwcml2YXRlIHRyeVNwaW5WYWx1ZShkYXRlUGFydDogRGF0ZVBhcnQsIGRlbHRhPzogbnVtYmVyLCBuZWdhdGl2ZSA9IGZhbHNlKTogRGF0ZSB7XG4gICAgaWYgKCFkZWx0YSkge1xuICAgICAgLy8gZGVmYXVsdCB0byAxIGlmIGEgZGVsdGEgaXMgc2V0IHRvIDAgb3IgYW55IG90aGVyIGZhbHN5IHZhbHVlXG4gICAgICBkZWx0YSA9IHRoaXMuZGF0ZVBhcnREZWx0YXNbZGF0ZVBhcnRdIHx8IDE7XG4gICAgfVxuICAgIGNvbnN0IHNwaW5WYWx1ZSA9IG5lZ2F0aXZlID8gLU1hdGguYWJzKGRlbHRhKSA6IE1hdGguYWJzKGRlbHRhKTtcbiAgICByZXR1cm4gdGhpcy5zcGluVmFsdWUoZGF0ZVBhcnQsIHNwaW5WYWx1ZSkgfHwgbmV3IERhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RGF0ZVZhbHVlKHZhbHVlOiBEYXRlIHwgc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZGF0ZVZhbHVlID0gRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBEYXRlVGltZVV0aWwucGFyc2VJc29EYXRlKHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVmFsdWUobmV3RGF0ZTogRGF0ZSk6IHZvaWQge1xuICAgIHRoaXMuX29sZFZhbHVlID0gdGhpcy5kYXRlVmFsdWU7XG4gICAgdGhpcy52YWx1ZSA9IG5ld0RhdGU7XG5cbiAgICAvLyBUT0RPOiBzaG91bGQgd2UgZW1pdCBldmVudHMgaGVyZT9cbiAgICBpZiAodGhpcy5pbnB1dElzQ29tcGxldGUoKSB8fCB0aGlzLmlucHV0VmFsdWUgPT09IHRoaXMuZW1wdHlNYXNrKSB7XG4gICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5kYXRlVmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5kYXRlVmFsdWUgJiYgIXRoaXMudmFsdWVJblJhbmdlKHRoaXMuZGF0ZVZhbHVlKSkge1xuICAgICAgdGhpcy52YWxpZGF0aW9uRmFpbGVkLmVtaXQoeyBvbGRWYWx1ZTogdGhpcy5fb2xkVmFsdWUsIG5ld1ZhbHVlOiB0aGlzLmRhdGVWYWx1ZSwgdXNlcklucHV0OiB0aGlzLmlucHV0VmFsdWUgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0b1R3ZWx2ZUhvdXJGb3JtYXQodmFsdWU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgbGV0IGhvdXIgPSBwYXJzZUludCh2YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAodGhpcy5wcm9tcHRDaGFyLCAnZycpLCAnMCcpLCAxMCk7XG4gICAgaWYgKGhvdXIgPiAxMikge1xuICAgICAgaG91ciAtPSAxMjtcbiAgICB9IGVsc2UgaWYgKGhvdXIgPT09IDApIHtcbiAgICAgIGhvdXIgPSAxMjtcbiAgICB9XG5cbiAgICByZXR1cm4gaG91cjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGFydFZhbHVlKGRhdGVQYXJ0SW5mbzogRGF0ZVBhcnRJbmZvLCBwYXJ0TGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGxldCBtYXNrZWRWYWx1ZTtcbiAgICBjb25zdCBkYXRlUGFydCA9IGRhdGVQYXJ0SW5mby50eXBlO1xuICAgIHN3aXRjaCAoZGF0ZVBhcnQpIHtcbiAgICAgIGNhc2UgRGF0ZVBhcnQuRGF0ZTpcbiAgICAgICAgbWFza2VkVmFsdWUgPSB0aGlzLmRhdGVWYWx1ZS5nZXREYXRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5Nb250aDpcbiAgICAgICAgLy8gbW9udGhzIGFyZSB6ZXJvIGJhc2VkXG4gICAgICAgIG1hc2tlZFZhbHVlID0gdGhpcy5kYXRlVmFsdWUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5ZZWFyOlxuICAgICAgICBpZiAocGFydExlbmd0aCA9PT0gMikge1xuICAgICAgICAgIG1hc2tlZFZhbHVlID0gdGhpcy5wcmVwZW5kVmFsdWUoXG4gICAgICAgICAgICBwYXJzZUludCh0aGlzLmRhdGVWYWx1ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkuc2xpY2UoLTIpLCAxMCksIHBhcnRMZW5ndGgsICcwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFza2VkVmFsdWUgPSB0aGlzLmRhdGVWYWx1ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5Ib3VyczpcbiAgICAgICAgaWYgKGRhdGVQYXJ0SW5mby5mb3JtYXQuaW5kZXhPZignaCcpICE9PSAtMSkge1xuICAgICAgICAgIG1hc2tlZFZhbHVlID0gdGhpcy5wcmVwZW5kVmFsdWUoXG4gICAgICAgICAgICB0aGlzLnRvVHdlbHZlSG91ckZvcm1hdCh0aGlzLmRhdGVWYWx1ZS5nZXRIb3VycygpLnRvU3RyaW5nKCkpLCBwYXJ0TGVuZ3RoLCAnMCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hc2tlZFZhbHVlID0gdGhpcy5kYXRlVmFsdWUuZ2V0SG91cnMoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRGF0ZVBhcnQuTWludXRlczpcbiAgICAgICAgbWFza2VkVmFsdWUgPSB0aGlzLmRhdGVWYWx1ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBEYXRlUGFydC5TZWNvbmRzOlxuICAgICAgICBtYXNrZWRWYWx1ZSA9IHRoaXMuZGF0ZVZhbHVlLmdldFNlY29uZHMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERhdGVQYXJ0LkFtUG06XG4gICAgICAgIG1hc2tlZFZhbHVlID0gdGhpcy5kYXRlVmFsdWUuZ2V0SG91cnMoKSA+PSAxMiA/ICdQTScgOiAnQU0nO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoZGF0ZVBhcnRJbmZvLnR5cGUgIT09IERhdGVQYXJ0LkFtUG0pIHtcbiAgICAgIHJldHVybiB0aGlzLnByZXBlbmRWYWx1ZShtYXNrZWRWYWx1ZSwgcGFydExlbmd0aCwgJzAnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFza2VkVmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHByZXBlbmRWYWx1ZSh2YWx1ZTogbnVtYmVyLCBwYXJ0TGVuZ3RoOiBudW1iZXIsIHByZXBlbmRDaGFyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiAocHJlcGVuZENoYXIgKyB2YWx1ZS50b1N0cmluZygpKS5zbGljZSgtcGFydExlbmd0aCk7XG4gIH1cblxuICBwcml2YXRlIHNwaW4oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICBjYXNlIHRoaXMucGxhdGZvcm0uS0VZTUFQLkFSUk9XX1VQOlxuICAgICAgICB0aGlzLmluY3JlbWVudCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQVJST1dfRE9XTjpcbiAgICAgICAgdGhpcy5kZWNyZW1lbnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbnB1dElzQ29tcGxldGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRWYWx1ZS5pbmRleE9mKHRoaXMucHJvbXB0Q2hhcikgPT09IC0xO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlQ3Vyc29yKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICBjYXNlIHRoaXMucGxhdGZvcm0uS0VZTUFQLkFSUk9XX0xFRlQ6XG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHRoaXMuZ2V0TmV3UG9zaXRpb24odmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQVJST1dfUklHSFQ6XG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHRoaXMuZ2V0TmV3UG9zaXRpb24odmFsdWUsIDEpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgY3Vyc29yIGluIGEgc3BlY2lmaWMgZGlyZWN0aW9uIHVudGlsIGl0IHJlYWNoZXMgYSBkYXRlL3RpbWUgc2VwYXJhdG9yLlxuICAgKiBUaGVuIHJldHVybiBpdHMgaW5kZXguXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgc3RyaW5nIGl0IG9wZXJhdGVzIG9uLlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIDAgaXMgbGVmdCwgMSBpcyByaWdodC4gRGVmYXVsdCBpcyAwLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXROZXdQb3NpdGlvbih2YWx1ZTogc3RyaW5nLCBkaXJlY3Rpb24gPSAwKTogbnVtYmVyIHtcbiAgICBjb25zdCBsaXRlcmFscyA9IHRoaXMuX2lucHV0RGF0ZVBhcnRzLmZpbHRlcihwID0+IHAudHlwZSA9PT0gRGF0ZVBhcnQuTGl0ZXJhbCk7XG4gICAgbGV0IGN1cnNvclBvcyA9IHRoaXMuc2VsZWN0aW9uU3RhcnQ7XG4gICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY3Vyc29yUG9zID0gY3Vyc29yUG9zID4gMCA/IC0tY3Vyc29yUG9zIDogY3Vyc29yUG9zO1xuICAgICAgfSB3aGlsZSAoIWxpdGVyYWxzLnNvbWUobCA9PiBsLmVuZCA9PT0gY3Vyc29yUG9zKSAmJiBjdXJzb3JQb3MgPiAwKTtcbiAgICAgIHJldHVybiBjdXJzb3JQb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY3Vyc29yUG9zKys7XG4gICAgICB9IHdoaWxlICghbGl0ZXJhbHMuc29tZShsID0+IGwuc3RhcnQgPT09IGN1cnNvclBvcykgJiYgY3Vyc29yUG9zIDwgdmFsdWUubGVuZ3RoKTtcbiAgICAgIHJldHVybiBjdXJzb3JQb3M7XG4gICAgfVxuICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0lneERhdGVUaW1lRWRpdG9yRGlyZWN0aXZlXSxcbiAgZXhwb3J0czogW0lneERhdGVUaW1lRWRpdG9yRGlyZWN0aXZlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hEYXRlVGltZUVkaXRvck1vZHVsZSB7IH1cbiJdfQ==