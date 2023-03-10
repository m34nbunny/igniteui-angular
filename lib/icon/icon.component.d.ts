import { ElementRef, OnInit, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IgxIconService } from './icon.service';
import { SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
/**
 * Icon provides a way to include material icons to markup
 *
 * @igxModule IgxIconModule
 *
 * @igxTheme igx-icon-theme
 *
 * @igxKeywords icon, picture
 *
 * @igxGroup Display
 *
 * @remarks
 *
 * The Ignite UI Icon makes it easy for developers to include material design icons directly in their markup. The icons
 * support different icon families and can be marked as active or disabled using the `active` property. This will change the appearance
 * of the icon.
 *
 * @example
 * ```html
 * <igx-icon family="filter-icons" active="true">home</igx-icon>
 * ```
 */
export declare class IgxIconComponent implements OnInit, OnDestroy {
    el: ElementRef;
    private iconService;
    private ref;
    /**
     *  This allows you to change the value of `class.igx-icon`. By default it's `igx-icon`.
     *
     * @hidden
     * @internal
     */
    cssClass: string;
    /**
     *  This allows you to disable the `aria-hidden` attribute. By default it's applied.
     *
     * @example
     * ```typescript
     * @ViewChild("MyIcon") public icon: IgxIconComponent;
     * constructor(private cdRef:ChangeDetectorRef) {}
     * ngAfterViewInit() {
     *     this.icon.ariaHidden = false;
     *     this.cdRef.detectChanges();
     * }
     * ```
     */
    ariaHidden: boolean;
    /**
     * An @Input property that sets the value of the `family`. By default it's "material".
     *
     * @example
     * ```html
     * <igx-icon family="material">settings</igx-icon>
     * ```
     */
    family: string;
    /**
     * An @Input property that allows you to disable the `active` property. By default it's applied.
     *
     * @example
     * ```html
     * <igx-icon [active]="false">settings</igx-icon>
     * ```
     */
    active: boolean;
    /**
     *  An @Input property that allows you to set the `name` of the icon.
     *
     *  @example
     * ```html
     * <igx-icon name="contains" family="filter-icons"></igx-icon>
     * ```
     */
    name: string;
    private noLigature;
    private explicitLigature;
    private svgImage;
    private destroy$;
    constructor(el: ElementRef, iconService: IgxIconService, ref: ChangeDetectorRef);
    /**
     * @hidden
     * @internal
     */
    ngOnInit(): void;
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy(): void;
    /**
     *  An accessor that returns the value of the family property.
     *
     * @example
     * ```typescript
     *  @ViewChild("MyIcon")
     * public icon: IgxIconComponent;
     * ngAfterViewInit() {
     *    let iconFamily = this.icon.getFamily;
     * }
     * ```
     */
    get getFamily(): string;
    /**
     *  An accessor that returns the value of the active property.
     *
     * @example
     * ```typescript
     * @ViewChild("MyIcon")
     * public icon: IgxIconComponent;
     * ngAfterViewInit() {
     *    let iconActive = this.icon.getActive;
     * }
     * ```
     */
    get getActive(): boolean;
    /**
     *  An accessor that returns inactive property.
     *
     * @example
     * ```typescript
     * @ViewChild("MyIcon")
     * public icon: IgxIconComponent;
     * ngAfterViewInit() {
     *    let iconActive = this.icon.getInactive;
     * }
     * ```
     */
    get getInactive(): boolean;
    /**
     * An accessor that returns the value of the iconName property.
     *
     * @example
     * ```typescript
     * @ViewChild("MyIcon")
     * public icon: IgxIconComponent;
     * ngAfterViewInit() {
     *    let name = this.icon.getName;
     * }
     * ```
     */
    get getName(): string;
    /**
     *  An accessor that returns the underlying SVG image as SafeHtml.
     *
     * @example
     * ```typescript
     * @ViewChild("MyIcon")
     * public icon: IgxIconComponent;
     * ngAfterViewInit() {
     *    let svg: SafeHtml = this.icon.getSvg;
     * }
     * ```
     */
    get getSvg(): SafeHtml;
    /**
     *   An accessor that returns a TemplateRef to explicit, svg or no ligature.
     *
     * @example
     * ```typescript
     * @ViewChild("MyIcon")
     * public icon: IgxIconComponent;
     * ngAfterViewInit() {
     *    let iconTemplate = this.icon.template;
     * }
     * ```
     */
    get template(): TemplateRef<HTMLElement>;
    /**
     * @hidden
     * @internal
     */
    private updateIconClass;
    static ??fac: i0.????FactoryDeclaration<IgxIconComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxIconComponent, "igx-icon", never, { "family": "family"; "active": "active"; "name": "name"; }, {}, never, ["*"]>;
}
