import { AfterViewChecked, ChangeDetectorRef, ElementRef, OnDestroy, QueryList } from '@angular/core';
import { DisplayDensityBase, IDisplayDensityOptions } from '../core/displayDensity';
import { IInputResourceStrings } from '../core/i18n/input-resources';
import { PlatformUtil } from '../core/utils';
import { IgxHintDirective } from '../directives/hint/hint.directive';
import { IgxInputDirective } from '../directives/input/input.directive';
import { IgxInputGroupBase } from './input-group.common';
import { IgxInputGroupType } from './inputGroupType';
import * as i0 from "@angular/core";
import * as i1 from "../directives/hint/hint.directive";
import * as i2 from "../directives/input/input.directive";
import * as i3 from "../directives/label/label.directive";
import * as i4 from "@angular/common";
import * as i5 from "../directives/prefix/prefix.directive";
import * as i6 from "../directives/suffix/suffix.directive";
import * as i7 from "../directives/button/button.directive";
import * as i8 from "../icon/public_api";
declare const IgxInputGroupTheme: {
    Material: "material";
    Fluent: "fluent";
    Bootstrap: "bootstrap";
    IndigoDesign: "indigo-design";
};
/**
 * Determines the Input Group theme.
 */
export declare type IgxInputGroupTheme = (typeof IgxInputGroupTheme)[keyof typeof IgxInputGroupTheme];
export declare class IgxInputGroupComponent extends DisplayDensityBase implements IgxInputGroupBase, AfterViewChecked, OnDestroy {
    element: ElementRef<HTMLElement>;
    private _inputGroupType;
    private document;
    private platform;
    private cdr;
    /**
     * Sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: IInputResourceStrings);
    /**
     * Returns the resource strings.
     */
    get resourceStrings(): IInputResourceStrings;
    /**
     * Property that enables/disables the auto-generated class of the `IgxInputGroupComponent`.
     * By default applied the class is applied.
     * ```typescript
     *  @ViewChild("MyInputGroup")
     *  public inputGroup: IgxInputGroupComponent;
     *  ngAfterViewInit(){
     *  this.inputGroup.defaultClass = false;
     * ```
     * }
     */
    defaultClass: boolean;
    /** @hidden */
    hasPlaceholder: boolean;
    /** @hidden */
    isRequired: boolean;
    /** @hidden */
    isFocused: boolean;
    /**
     * @hidden @internal
     * When truthy, disables the `IgxInputGroupComponent`.
     * Controlled by the underlying `IgxInputDirective`.
     * ```html
     * <igx-input-group [disabled]="true"></igx-input-group>
     * ```
     */
    disabled: boolean;
    /**
     * Prevents automatically focusing the input when clicking on other elements in the input group (e.g. prefix or suffix).
     *
     * @remarks Automatic focus causes software keyboard to show on mobile devices.
     *
     * @example
     * ```html
     * <igx-input-group [suppressInputAutofocus]="true"></igx-input-group>
     * ```
     */
    suppressInputAutofocus: boolean;
    /** @hidden */
    hasWarning: boolean;
    /** @hidden */
    protected hints: QueryList<IgxHintDirective>;
    /** @hidden */
    protected input: IgxInputDirective;
    private _type;
    private _filled;
    private _theme;
    private _theme$;
    private _subscription;
    private _resourceStrings;
    /** @hidden */
    get validClass(): boolean;
    /** @hidden */
    get invalidClass(): boolean;
    /** @hidden */
    get isFilled(): any;
    /** @hidden */
    get isDisplayDensityCosy(): boolean;
    /** @hidden */
    get isDisplayDensityComfortable(): boolean;
    /** @hidden */
    get isDisplayDensityCompact(): boolean;
    /**
     * An @Input property that sets how the input will be styled.
     * Allowed values of type IgxInputGroupType.
     * ```html
     * <igx-input-group [type]="'search'">
     * ```
     */
    set type(value: IgxInputGroupType);
    /**
     * Returns the type of the `IgxInputGroupComponent`. How the input is styled.
     * The default is `line`.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputType = this.inputGroup.type;
     * }
     * ```
     */
    get type(): IgxInputGroupType;
    /**
     * Sets the theme of the input.
     * Allowed values of type IgxInputGroupTheme.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit() {
     *  let inputTheme = 'fluent';
     * }
     */
    set theme(value: IgxInputGroupTheme);
    /**
     * Returns the theme of the input.
     * The returned value is of type IgxInputGroupType.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit() {
     *  let inputTheme = this.inputGroup.theme;
     * }
     */
    get theme(): IgxInputGroupTheme;
    constructor(element: ElementRef<HTMLElement>, _displayDensityOptions: IDisplayDensityOptions, _inputGroupType: IgxInputGroupType, document: any, platform: PlatformUtil, cdr: ChangeDetectorRef);
    /** @hidden */
    onClick(event: MouseEvent): void;
    /** @hidden */
    onPointerDown(event: PointerEvent): void;
    /** @hidden @internal */
    hintClickHandler(event: MouseEvent): void;
    /**
     * Returns whether the `IgxInputGroupComponent` has hints.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputHints = this.inputGroup.hasHints;
     * }
     * ```
     */
    get hasHints(): boolean;
    /**
     * Returns whether the `IgxInputGroupComponent` has border.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputBorder = this.inputGroup.hasBorder;
     * }
     * ```
     */
    get hasBorder(): boolean;
    /**
     * Returns whether the `IgxInputGroupComponent` type is line.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeLine = this.inputGroup.isTypeLine;
     * }
     * ```
     */
    get isTypeLine(): boolean;
    /**
     * Returns whether the `IgxInputGroupComponent` type is box.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBox = this.inputGroup.isTypeBox;
     * }
     * ```
     */
    get isTypeBox(): boolean;
    /** @hidden @internal */
    uploadButtonHandler(): void;
    /** @hidden @internal */
    clearValueHandler(): void;
    /** @hidden @internal */
    get isFileType(): boolean;
    /** @hidden @internal */
    get fileNames(): any;
    /**
     * Returns whether the `IgxInputGroupComponent` type is border.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBorder = this.inputGroup.isTypeBorder;
     * }
     * ```
     */
    get isTypeBorder(): boolean;
    /**
     * Returns true if the `IgxInputGroupComponent` theme is Fluent.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeFluent = this.inputGroup.isTypeFluent;
     * }
     * ```
     */
    get isTypeFluent(): boolean;
    /**
     * Returns true if the `IgxInputGroupComponent` theme is Bootstrap.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBootstrap = this.inputGroup.isTypeBootstrap;
     * }
     * ```
     */
    get isTypeBootstrap(): boolean;
    /**
     * Returns true if the `IgxInputGroupComponent` theme is Indigo.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeIndigo = this.inputGroup.isTypeIndigo;
     * }
     * ```
     */
    get isTypeIndigo(): boolean;
    /**
     * Returns whether the `IgxInputGroupComponent` type is search.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeSearch = this.inputGroup.isTypeSearch;
     * }
     * ```
     */
    get isTypeSearch(): boolean;
    /** @hidden */
    get filled(): boolean;
    /** @hidden */
    set filled(val: boolean);
    /** @hidden @internal */
    ngAfterViewChecked(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    static ??fac: i0.????FactoryDeclaration<IgxInputGroupComponent, [null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ??cmp: i0.????ComponentDeclaration<IgxInputGroupComponent, "igx-input-group", never, { "resourceStrings": "resourceStrings"; "suppressInputAutofocus": "suppressInputAutofocus"; "type": "type"; "theme": "theme"; }, {}, ["input", "hints"], ["igx-hint, [igxHint]", "[igxLabel]", "[igxInput]", "igx-prefix, [igxPrefix]", "igx-suffix, [igxSuffix]"]>;
}
/** @hidden */
export declare class IgxInputGroupModule {
    static ??fac: i0.????FactoryDeclaration<IgxInputGroupModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxInputGroupModule, [typeof IgxInputGroupComponent, typeof i1.IgxHintDirective, typeof i2.IgxInputDirective, typeof i3.IgxLabelDirective], [typeof i4.CommonModule, typeof i5.IgxPrefixModule, typeof i6.IgxSuffixModule, typeof i7.IgxButtonModule, typeof i8.IgxIconModule], [typeof IgxInputGroupComponent, typeof i1.IgxHintDirective, typeof i2.IgxInputDirective, typeof i3.IgxLabelDirective, typeof i5.IgxPrefixModule, typeof i6.IgxSuffixModule, typeof i7.IgxButtonModule, typeof i8.IgxIconModule]>;
    static ??inj: i0.????InjectorDeclaration<IgxInputGroupModule>;
}
export {};
