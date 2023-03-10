import { Renderer2, ViewContainerRef, QueryList, TemplateRef, AfterContentInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DisplayDensityBase, IDisplayDensityOptions } from '../core/density';
import { IActionStripResourceStrings } from '../core/i18n/action-strip-resources';
import { IgxDropDownComponent } from '../drop-down/public_api';
import { OverlaySettings } from '../services/public_api';
import { IgxGridActionsBaseDirective } from './grid-actions/grid-actions-base.directive';
import * as i0 from "@angular/core";
export declare class IgxActionStripMenuItemDirective {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxActionStripMenuItemDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxActionStripMenuItemDirective, "[igxActionStripMenuItem]", never, {}, {}, never>;
}
/**
 * Action Strip provides templatable area for one or more actions.
 *
 * @igxModule IgxActionStripModule
 *
 * @igxTheme igx-action-strip-theme
 *
 * @igxKeywords action, strip, actionStrip, pinning, editing
 *
 * @igxGroup Data Entry & Display
 *
 * @remarks
 * The Ignite UI Action Strip is a container, overlaying its parent container,
 * and displaying action buttons with action applicable to the parent component the strip is instantiated or shown for.
 *
 * @example
 * ```html
 * <igx-action-strip #actionStrip>
 *     <igx-icon (click)="doSomeAction()"></igx-icon>
 * </igx-action-strip>
 */
export declare class IgxActionStripComponent extends DisplayDensityBase implements AfterContentInit, AfterViewInit {
    private _viewContainer;
    private renderer;
    protected _displayDensityOptions: IDisplayDensityOptions;
    cdr: ChangeDetectorRef;
    /**
     * Sets the context of an action strip.
     * The context should be an instance of a @Component, that has element property.
     * This element will be the placeholder of the action strip.
     *
     * @example
     * ```html
     * <igx-action-strip [context]="cell"></igx-action-strip>
     * ```
     */
    context: any;
    /**
     * Menu Items ContentChildren inside the Action Strip
     *
     * @hidden
     * @internal
     */
    _menuItems: QueryList<IgxActionStripMenuItemDirective>;
    /**
     * ActionButton as ContentChildren inside the Action Strip
     *
     * @hidden
     * @internal
     */
    actionButtons: QueryList<IgxGridActionsBaseDirective>;
    /**
     * An @Input property that set the visibility of the Action Strip.
     * Could be used to set if the Action Strip will be initially hidden.
     *
     * @example
     * ```html
     *  <igx-action-strip [hidden]="false">
     * ```
     */
    set hidden(value: boolean);
    get hidden(): boolean;
    /**
     * Host `class.igx-action-strip` binding.
     *
     * @hidden
     * @internal
     */
    hostClass: string;
    /**
     * Gets/Sets the resource strings.
     *
     * @remarks
     * By default it uses EN resources.
     */
    set resourceStrings(value: IActionStripResourceStrings);
    get resourceStrings(): IActionStripResourceStrings;
    /**
     * Reference to the menu
     *
     * @hidden
     * @internal
     */
    menu: IgxDropDownComponent;
    /**
     * Getter for menu overlay settings
     *
     * @hidden
     * @internal
     */
    menuOverlaySettings: OverlaySettings;
    private _hidden;
    private _resourceStrings;
    constructor(_viewContainer: ViewContainerRef, renderer: Renderer2, _displayDensityOptions: IDisplayDensityOptions, cdr: ChangeDetectorRef);
    /**
     * Getter for the 'display' property of the current `IgxActionStrip`
     *
     * @hidden
     * @internal
     */
    get display(): string;
    /**
     * Host `attr.class` binding.
     *
     * @hidden
     * @internal
     */
    get hostClasses(): string;
    /**
     * Menu Items list.
     *
     * @hidden
     * @internal
     */
    get menuItems(): any[];
    /**
     * @hidden
     * @internal
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     * @internal
     */
    ngAfterViewInit(): void;
    /**
     * Showing the Action Strip and appending it the specified context element.
     *
     * @param context
     * @example
     * ```typescript
     * this.actionStrip.show(row);
     * ```
     */
    show(context?: any): void;
    /**
     * Hiding the Action Strip and removing it from its current context element.
     *
     * @example
     * ```typescript
     * this.actionStrip.hide();
     * ```
     */
    hide(): void;
    /**
     * Close the menu if opened
     *
     * @hidden
     * @internal
     */
    private closeMenu;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxActionStripComponent, [null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxActionStripComponent, "igx-action-strip", never, { "context": "context"; "hidden": "hidden"; "hostClass": "class"; "resourceStrings": "resourceStrings"; }, {}, ["_menuItems", "actionButtons"], ["*"]>;
}
