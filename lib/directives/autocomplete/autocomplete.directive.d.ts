import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';
import { CancelableEventArgs, IBaseEventArgs } from '../../core/utils';
import { IPositionStrategy, IScrollStrategy } from '../../services/public_api';
import { IgxDropDownComponent, IgxDropDownItemNavigationDirective } from '../../drop-down/public_api';
import { IgxInputGroupComponent } from '../../input-group/public_api';
import { IgxOverlayOutletDirective } from '../toggle/toggle.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../drop-down/public_api";
import * as i2 from "@angular/common";
/**
 * Interface that encapsulates onItemSelection event arguments - new value and cancel selection.
 *
 * @export
 */
export interface AutocompleteSelectionChangingEventArgs extends CancelableEventArgs, IBaseEventArgs {
    /**
     * New value selected from the drop down
     */
    value: string;
}
export interface AutocompleteOverlaySettings {
    /** Position strategy to use with this settings */
    positionStrategy?: IPositionStrategy;
    /** Scroll strategy to use with this settings */
    scrollStrategy?: IScrollStrategy;
    /** Set the outlet container to attach the overlay to */
    outlet?: IgxOverlayOutletDirective | ElementRef;
}
/**
 * **Ignite UI for Angular Autocomplete** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/autocomplete.html)
 *
 * The igxAutocomplete directive provides a way to enhance a text input
 * by showing a drop down of suggested options, provided by the developer.
 *
 * Example:
 * ```html
 * <input type="text" [igxAutocomplete]="townsPanel" #autocompleteRef="igxAutocomplete"/>
 * <igx-drop-down #townsPanel>
 *     <igx-drop-down-item *ngFor="let town of towns | startsWith:townSelected" [value]="town">
 *         {{town}}
 *     </igx-drop-down-item>
 * </igx-drop-down>
 * ```
 */
export declare class IgxAutocompleteDirective extends IgxDropDownItemNavigationDirective implements OnDestroy, AfterViewInit, OnInit {
    protected ngModel: NgModel;
    protected formControl: FormControlName;
    protected group: IgxInputGroupComponent;
    protected elementRef: ElementRef;
    protected cdr: ChangeDetectorRef;
    /**
     * Sets the target of the autocomplete directive
     *
     * ```html
     * <!-- Set -->
     * <input [igxAutocomplete]="dropdown" />
     * ...
     * <igx-drop-down #dropdown>
     * ...
     * </igx-drop-down>
     * ```
     */
    get target(): IgxDropDownComponent;
    set target(v: IgxDropDownComponent);
    /**
     * Provide overlay settings for the autocomplete drop down
     *
     * ```typescript
     * // get
     * let settings = this.autocomplete.autocompleteSettings;
     * ```
     * ```html
     * <!--set-->
     * <input type="text" [igxAutocomplete]="townsPanel" [igxAutocompleteSettings]="settings"/>
     * ```
     * ```typescript
     * // set
     * this.settings = {
     *  positionStrategy: new ConnectedPositioningStrategy({
     *      closeAnimation: null,
     *      openAnimation: null
     *  })
     * };
     * ```
     */
    autocompleteSettings: AutocompleteOverlaySettings;
    /** @hidden @internal */
    autofill: string;
    /** @hidden  @internal */
    role: string;
    /**
     * Enables/disables autocomplete component
     *
     * ```typescript
     * // get
     * let disabled = this.autocomplete.disabled;
     * ```
     * ```html
     * <!--set-->
     * <input type="text" [igxAutocomplete]="townsPanel" [igxAutocompleteDisabled]="disabled"/>
     * ```
     * ```typescript
     * // set
     * public disabled = true;
     * ```
     */
    disabled: boolean;
    /**
     * Emitted after item from the drop down is selected
     *
     * ```html
     * <input igxInput [igxAutocomplete]="townsPanel" (selectionChanging)='selectionChanging($event)' />
     * ```
     */
    selectionChanging: EventEmitter<AutocompleteSelectionChangingEventArgs>;
    /** @hidden @internal */
    get nativeElement(): HTMLInputElement;
    /** @hidden @internal */
    get parentElement(): HTMLElement;
    private get settings();
    /** @hidden  @internal */
    get ariaExpanded(): boolean;
    /** @hidden  @internal */
    get hasPopUp(): string;
    /** @hidden  @internal */
    get ariaOwns(): string;
    /** @hidden  @internal */
    get ariaActiveDescendant(): string;
    /** @hidden  @internal */
    get ariaAutocomplete(): string;
    protected id: string;
    protected get model(): FormControlName | NgModel;
    private _shouldBeOpen;
    private destroy$;
    private defaultSettings;
    constructor(ngModel: NgModel, formControl: FormControlName, group: IgxInputGroupComponent, elementRef: ElementRef, cdr: ChangeDetectorRef);
    /** @hidden  @internal */
    onInput(): void;
    /** @hidden  @internal */
    onArrowDown(event: Event): void;
    /** @hidden  @internal */
    onTab(): void;
    /** @hidden  @internal */
    handleKeyDown(event: any): void;
    /** @hidden  @internal */
    onArrowDownKeyDown(): void;
    /** @hidden  @internal */
    onArrowUpKeyDown(): void;
    /** @hidden  @internal */
    onEndKeyDown(): void;
    /** @hidden  @internal */
    onHomeKeyDown(): void;
    /**
     * Closes autocomplete drop down
     */
    close(): void;
    /**
     * Opens autocomplete drop down
     */
    open(): void;
    /** @hidden @internal */
    ngOnInit(): void;
    /** @hidden */
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    private get collapsed();
    private select;
    private highlightFirstItem;
    static ??fac: i0.????FactoryDeclaration<IgxAutocompleteDirective, [{ optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }, null, null]>;
    static ??dir: i0.????DirectiveDeclaration<IgxAutocompleteDirective, "[igxAutocomplete]", ["igxAutocomplete"], { "target": "igxAutocomplete"; "autocompleteSettings": "igxAutocompleteSettings"; "disabled": "igxAutocompleteDisabled"; }, { "selectionChanging": "selectionChanging"; }, never>;
}
/** @hidden */
export declare class IgxAutocompleteModule {
    static ??fac: i0.????FactoryDeclaration<IgxAutocompleteModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxAutocompleteModule, [typeof IgxAutocompleteDirective], [typeof i1.IgxDropDownModule, typeof i2.CommonModule], [typeof IgxAutocompleteDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxAutocompleteModule>;
}
