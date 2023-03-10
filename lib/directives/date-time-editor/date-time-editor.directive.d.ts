import { ElementRef, Renderer2, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { IgxMaskDirective } from '../mask/mask.directive';
import { MaskParsingService } from '../mask/mask-parsing.service';
import { PlatformUtil } from '../../core/utils';
import { IgxDateTimeEditorEventArgs, DatePart } from './date-time-editor.common';
import { DatePartDeltas } from './date-time-editor.common';
import * as i0 from "@angular/core";
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
export declare class IgxDateTimeEditorDirective extends IgxMaskDirective implements OnChanges, OnInit, Validator, ControlValueAccessor {
    protected renderer: Renderer2;
    protected elementRef: ElementRef;
    protected maskParser: MaskParsingService;
    protected platform: PlatformUtil;
    private _document;
    private _locale;
    /**
     * Locale settings used for value formatting.
     *
     * @remarks
     * Uses Angular's `LOCALE_ID` by default. Affects both input mask and display format if those are not set.
     * If a `locale` is set, it must be registered via `registerLocaleData`.
     * Please refer to https://angular.io/guide/i18n#i18n-pipes.
     * If it is not registered, `Intl` will be used for formatting.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [locale]="'en'">
     * ```
     */
    locale: string;
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
    get minValue(): string | Date;
    set minValue(value: string | Date);
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
    get maxValue(): string | Date;
    set maxValue(value: string | Date);
    /**
     * Specify if the currently spun date segment should loop over.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [spinLoop]="false">
     * ```
     */
    spinLoop: boolean;
    /**
     * Set both pre-defined format options such as `shortDate` and `longDate`,
     * as well as constructed format string using characters supported by `DatePipe`, e.g. `EE/MM/yyyy`.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [displayFormat]="'shortDate'">
     * ```
     */
    displayFormat: string;
    /**
     * Expected user input format (and placeholder).
     *
     * @example
     * ```html
     * <input [igxDateTimeEditor]="'dd/MM/yyyy'">
     * ```
     */
    set inputFormat(value: string);
    get inputFormat(): string;
    /**
     * Editor value.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [value]="date">
     * ```
     */
    set value(value: Date | string);
    get value(): Date | string;
    /**
     * Delta values used to increment or decrement each editor date part on spin actions.
     * All values default to `1`.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [spinDelta]="{date: 5, minute: 30}">
     * ```
     */
    spinDelta: DatePartDeltas;
    /**
     * Emitted when the editor's value has changed.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor (valueChange)="valueChange($event)"/>
     * ```
     */
    valueChange: EventEmitter<string | Date>;
    /**
     * Emitted when the editor is not within a specified range or when the editor's value is in an invalid state.
     *
     * @example
     * ```html
     * <input igxDateTimeEditor [minValue]="minDate" [maxValue]="maxDate" (validationFailed)="onValidationFailed($event)"/>
     * ```
     */
    validationFailed: EventEmitter<IgxDateTimeEditorEventArgs>;
    private _inputFormat;
    private _oldValue;
    private _dateValue;
    private _onClear;
    private document;
    private _isFocused;
    private _defaultInputFormat;
    private _value;
    private _minValue;
    private _maxValue;
    private _inputDateParts;
    private _datePartDeltas;
    private onTouchCallback;
    private onChangeCallback;
    private onValidatorChange;
    private get datePartDeltas();
    private get emptyMask();
    private get targetDatePart();
    private get hasDateParts();
    private get hasTimeParts();
    private get dateValue();
    constructor(renderer: Renderer2, elementRef: ElementRef, maskParser: MaskParsingService, platform: PlatformUtil, _document: any, _locale: any);
    onWheel(event: WheelEvent): void;
    ngOnInit(): void;
    /** @hidden @internal */
    ngOnChanges(changes: SimpleChanges): void;
    /** Clear the input element value. */
    clear(): void;
    /**
     * Increment specified DatePart.
     *
     * @param datePart The optional DatePart to increment. Defaults to Date or Hours (when Date is absent from the inputFormat - ex:'HH:mm').
     * @param delta The optional delta to increment by. Overrides `spinDelta`.
     */
    increment(datePart?: DatePart, delta?: number): void;
    /**
     * Decrement specified DatePart.
     *
     * @param datePart The optional DatePart to decrement. Defaults to Date or Hours (when Date is absent from the inputFormat - ex:'HH:mm').
     * @param delta The optional delta to decrement by. Overrides `spinDelta`.
     */
    decrement(datePart?: DatePart, delta?: number): void;
    /** @hidden @internal */
    writeValue(value: any): void;
    /** @hidden @internal */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @hidden @internal */
    registerOnValidatorChange?(fn: () => void): void;
    /** @hidden @internal */
    registerOnChange(fn: any): void;
    /** @hidden @internal */
    registerOnTouched(fn: any): void;
    /** @hidden @internal */
    setDisabledState?(_isDisabled: boolean): void;
    /** @hidden @internal */
    onCompositionEnd(): void;
    /** @hidden @internal */
    onInputChanged(event: any): void;
    /** @hidden @internal */
    onKeyDown(event: KeyboardEvent): void;
    /** @hidden @internal */
    onFocus(): void;
    /** @hidden @internal */
    onBlur(value: string): void;
    /** @hidden */
    protected setPlaceholder(_value: string): void;
    private updateDefaultFormat;
    private updateMask;
    private setMask;
    private parseDate;
    private getMaskedValue;
    private valueInRange;
    private spinValue;
    private trySpinValue;
    private setDateValue;
    private updateValue;
    private toTwelveHourFormat;
    private getPartValue;
    private prependValue;
    private spin;
    private inputIsComplete;
    private moveCursor;
    /**
     * Move the cursor in a specific direction until it reaches a date/time separator.
     * Then return its index.
     *
     * @param value The string it operates on.
     * @param direction 0 is left, 1 is right. Default is 0.
     */
    private getNewPosition;
    static ??fac: i0.????FactoryDeclaration<IgxDateTimeEditorDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxDateTimeEditorDirective, "[igxDateTimeEditor]", ["igxDateTimeEditor"], { "locale": "locale"; "minValue": "minValue"; "maxValue": "maxValue"; "spinLoop": "spinLoop"; "displayFormat": "displayFormat"; "inputFormat": "igxDateTimeEditor"; "value": "value"; "spinDelta": "spinDelta"; }, { "valueChange": "valueChange"; "validationFailed": "validationFailed"; }, never>;
}
export declare class IgxDateTimeEditorModule {
    static ??fac: i0.????FactoryDeclaration<IgxDateTimeEditorModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxDateTimeEditorModule, [typeof IgxDateTimeEditorDirective], never, [typeof IgxDateTimeEditorDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxDateTimeEditorModule>;
}
