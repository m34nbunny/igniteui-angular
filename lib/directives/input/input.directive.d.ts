import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { FormControlName, NgModel } from '@angular/forms';
import { IgxInputGroupBase } from '../../input-group/input-group.common';
import * as i0 from "@angular/core";
export declare enum IgxInputState {
    INITIAL = 0,
    VALID = 1,
    INVALID = 2
}
/**
 * The `igxInput` directive creates single- or multiline text elements, covering common scenarios when dealing with form inputs.
 *
 * @igxModule IgxInputGroupModule
 *
 * @igxParent Data Entry & Display
 *
 * @igxTheme igx-input-group-theme
 *
 * @igxKeywords input, input group, form, field, validation
 *
 * @igxGroup presentation
 *
 * @example
 * ```html
 * <input-group>
 *  <label for="address">Address</label>
 *  <input igxInput name="address" type="text" [(ngModel)]="customer.address">
 * </input-group>
 * ```
 */
export declare class IgxInputDirective implements AfterViewInit, OnDestroy {
    inputGroup: IgxInputGroupBase;
    protected ngModel: NgModel;
    protected formControl: FormControlName;
    protected element: ElementRef<HTMLInputElement>;
    protected cdr: ChangeDetectorRef;
    protected renderer: Renderer2;
    private static ngAcceptInputType_required;
    private static ngAcceptInputType_disabled;
    /**
     * Sets/gets whether the `"igx-input-group__input"` class is added to the host element.
     * Default value is `false`.
     *
     * @example
     * ```typescript
     * this.igxInput.isInput = true;
     * ```
     *
     * @example
     * ```typescript
     * let isCLassAdded = this.igxInput.isInput;
     * ```
     */
    isInput: boolean;
    /**
     * Sets/gets whether the `"class.igx-input-group__textarea"` class is added to the host element.
     * Default value is `false`.
     *
     * @example
     * ```typescript
     * this.igxInput.isTextArea = true;
     * ```
     *
     * @example
     * ```typescript
     * let isCLassAdded = this.igxInput.isTextArea;
     * ```
     */
    isTextArea: boolean;
    private _valid;
    private _statusChanges$;
    private _fileNames;
    private _disabled;
    constructor(inputGroup: IgxInputGroupBase, ngModel: NgModel, formControl: FormControlName, element: ElementRef<HTMLInputElement>, cdr: ChangeDetectorRef, renderer: Renderer2);
    private get ngControl();
    /**
     * Sets the `value` property.
     *
     * @example
     * ```html
     * <input-group>
     *  <input igxInput #igxInput [value]="'IgxInput Value'">
     * </input-group>
     * ```
     */
    set value(value: any);
    /**
     * Gets the `value` property.
     *
     * @example
     * ```typescript
     * @ViewChild('igxInput', {read: IgxInputDirective})
     *  public igxInput: IgxInputDirective;
     * let inputValue = this.igxInput.value;
     * ```
     */
    get value(): any;
    /**
     * Sets the `disabled` property.
     *
     * @example
     * ```html
     * <input-group>
     *  <input igxInput #igxInput [disabled]="true">
     * </input-group>
     * ```
     */
    set disabled(value: boolean);
    /**
     * Gets the `disabled` property
     *
     * @example
     * ```typescript
     * @ViewChild('igxInput', {read: IgxInputDirective})
     *  public igxInput: IgxInputDirective;
     * let isDisabled = this.igxInput.disabled;
     * ```
     */
    get disabled(): boolean;
    /**
     * Sets the `required` property.
     *
     * @example
     * ```html
     * <input-group>
     *  <input igxInput #igxInput required>
     * </input-group>
     * ```
     */
    set required(value: boolean);
    /**
     * Gets whether the igxInput is required.
     *
     * @example
     * ```typescript
     * let isRequired = this.igxInput.required;
     * ```
     */
    get required(): boolean;
    /**
     * @hidden
     * @internal
     */
    onFocus(): void;
    /**
     * @param event The event to invoke the handler
     *
     * @hidden
     * @internal
     */
    onBlur(): void;
    /** @hidden @internal */
    onInput(): void;
    /** @hidden @internal */
    change(event: Event): void;
    /** @hidden @internal */
    get fileNames(): string;
    /** @hidden @internal */
    clear(): void;
    /** @hidden @internal */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /**
     * Sets a focus on the igxInput.
     *
     * @example
     * ```typescript
     * this.igxInput.focus();
     * ```
     */
    focus(): void;
    /**
     * Gets the `nativeElement` of the igxInput.
     *
     * @example
     * ```typescript
     * let igxInputNativeElement = this.igxInput.nativeElement;
     * ```
     */
    get nativeElement(): HTMLInputElement;
    /** @hidden @internal */
    protected onStatusChanged(): void;
    /**
     * @hidden
     * @internal
     */
    protected updateValidityState(): void;
    /**
     * Gets whether the igxInput has a placeholder.
     *
     * @example
     * ```typescript
     * let hasPlaceholder = this.igxInput.hasPlaceholder;
     * ```
     */
    get hasPlaceholder(): boolean;
    /**
     * Gets the placeholder element of the igxInput.
     *
     * @example
     * ```typescript
     * let igxInputPlaceholder = this.igxInput.placeholder;
     * ```
     */
    get placeholder(): string;
    /**
     * @returns An indicator of whether the input has validator attributes or not
     *
     * @hidden
     * @internal
     */
    private _hasValidators;
    /**
     * Gets whether the igxInput is focused.
     *
     * @example
     * ```typescript
     * let isFocused = this.igxInput.focused;
     * ```
     */
    get focused(): boolean;
    /**
     * Gets the state of the igxInput.
     *
     * @example
     * ```typescript
     * let igxInputState = this.igxInput.valid;
     * ```
     */
    get valid(): IgxInputState;
    /**
     * Sets the state of the igxInput.
     *
     * @example
     * ```typescript
     * this.igxInput.valid = IgxInputState.INVALID;
     * ```
     */
    set valid(value: IgxInputState);
    /**
     * Gets whether the igxInput is valid.
     *
     * @example
     * ```typescript
     * let valid = this.igxInput.isValid;
     * ```
     */
    get isValid(): boolean;
    /**
     * A function to assign a native validity property of an input.
     * This should be used when there's no ngControl
     *
     * @hidden
     * @internal
     */
    private checkNativeValidity;
    /**
     * Returns the input type.
     *
     * @hidden
     * @internal
     */
    get type(): string;
    static ??fac: i0.????FactoryDeclaration<IgxInputDirective, [null, { optional: true; self: true; }, { optional: true; self: true; }, null, null, null]>;
    static ??dir: i0.????DirectiveDeclaration<IgxInputDirective, "[igxInput]", ["igxInput"], { "value": "value"; "disabled": "disabled"; "required": "required"; }, {}, never>;
}
