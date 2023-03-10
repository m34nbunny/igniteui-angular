import { AfterContentInit, AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { IDisplayDensityOptions } from '../core/density';
import { EditorProvider } from '../core/edit-provider';
import { IgxSelectionAPIService } from '../core/selection';
import { IBaseCancelableBrowserEventArgs, IBaseEventArgs } from '../core/utils';
import { IgxLabelDirective } from '../directives/label/label.directive';
import { IgxDropDownItemBaseDirective } from '../drop-down/drop-down-item.base';
import { Navigate } from '../drop-down/drop-down.common';
import { IgxInputGroupComponent } from '../input-group/input-group.component';
import { OverlaySettings } from '../services/overlay/utilities';
import { IgxInputDirective } from './../directives/input/input.directive';
import { IgxDropDownComponent } from './../drop-down/drop-down.component';
import { IgxSelectItemComponent } from './select-item.component';
import { IgxSelectBase } from './select.common';
import { IgxInputGroupType } from '../input-group/public_api';
import { ToggleViewCancelableEventArgs, ToggleViewEventArgs } from '../directives/toggle/toggle.directive';
import { IgxOverlayService } from '../services/overlay/overlay';
import * as i0 from "@angular/core";
/** @hidden @internal */
export declare class IgxSelectToggleIconDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSelectToggleIconDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxSelectToggleIconDirective, "[igxSelectToggleIcon]", never, {}, {}, never>;
}
/** @hidden @internal */
export declare class IgxSelectHeaderDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSelectHeaderDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxSelectHeaderDirective, "[igxSelectHeader]", never, {}, {}, never>;
}
/** @hidden @internal */
export declare class IgxSelectFooterDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSelectFooterDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxSelectFooterDirective, "[igxSelectFooter]", never, {}, {}, never>;
}
/**
 * **Ignite UI for Angular Select** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/select)
 *
 * The `igxSelect` provides an input with dropdown list allowing selection of a single item.
 *
 * Example:
 * ```html
 * <igx-select #select1 [placeholder]="'Pick One'">
 *   <label igxLabel>Select Label</label>
 *   <igx-select-item *ngFor="let item of items" [value]="item.field">
 *     {{ item.field }}
 *   </igx-select-item>
 * </igx-select>
 * ```
 */
export declare class IgxSelectComponent extends IgxDropDownComponent implements IgxSelectBase, ControlValueAccessor, AfterContentInit, OnInit, AfterViewInit, OnDestroy, EditorProvider {
    protected elementRef: ElementRef;
    protected cdr: ChangeDetectorRef;
    protected selection: IgxSelectionAPIService;
    protected overlayService: IgxOverlayService;
    protected _displayDensityOptions: IDisplayDensityOptions;
    private _inputGroupType;
    private _injector;
    /** @hidden @internal */
    inputGroup: IgxInputGroupComponent;
    /** @hidden @internal */
    input: IgxInputDirective;
    /** @hidden @internal */
    children: QueryList<IgxSelectItemComponent>;
    /** @hidden @internal */
    label: IgxLabelDirective;
    /**
     * An @Input property that sets input placeholder.
     *
     */
    placeholder: any;
    /**
     * An @Input property that disables the `IgxSelectComponent`.
     * ```html
     * <igx-select [disabled]="'true'"></igx-select>
     * ```
     */
    disabled: boolean;
    /**
     * An @Input property that sets custom OverlaySettings `IgxSelectComponent`.
     * ```html
     * <igx-select [overlaySettings] = "customOverlaySettings"></igx-select>
     * ```
     */
    overlaySettings: OverlaySettings;
    /** @hidden @internal */
    maxHeight: string;
    /**
     * Emitted before the dropdown is opened
     *
     * ```html
     * <igx-select opening='handleOpening($event)'></igx-select>
     * ```
     */
    opening: EventEmitter<IBaseCancelableBrowserEventArgs>;
    /**
     * Emitted after the dropdown is opened
     *
     * ```html
     * <igx-select (opened)='handleOpened($event)'></igx-select>
     * ```
     */
    opened: EventEmitter<IBaseEventArgs>;
    /**
     * Emitted before the dropdown is closed
     *
     * ```html
     * <igx-select (closing)='handleClosing($event)'></igx-select>
     * ```
     */
    closing: EventEmitter<IBaseCancelableBrowserEventArgs>;
    /**
     * Emitted after the dropdown is closed
     *
     * ```html
     * <igx-select (closed)='handleClosed($event)'></igx-select>
     * ```
     */
    closed: EventEmitter<IBaseEventArgs>;
    /**
     * The custom template, if any, that should be used when rendering the select TOGGLE(open/close) button
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
     * myComponent.select.toggleIconTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-select #select>
     *      ...
     *      <ng-template igxSelectToggleIcon let-collapsed>
     *          <igx-icon>{{ collapsed ? 'remove_circle' : 'remove_circle_outline'}}</igx-icon>
     *      </ng-template>
     *  </igx-select>
     * ```
     */
    toggleIconTemplate: TemplateRef<any>;
    /**
     * The custom template, if any, that should be used when rendering the HEADER for the select items list
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
     * myComponent.select.headerTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-select #select>
     *      ...
     *      <ng-template igxSelectHeader>
     *          <div class="select__header">
     *              This is a custom header
     *          </div>
     *      </ng-template>
     *  </igx-select>
     * ```
     */
    headerTemplate: TemplateRef<any>;
    /**
     * The custom template, if any, that should be used when rendering the FOOTER for the select items list
     *
     * ```typescript
     * // Set in typescript
     * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
     * myComponent.select.footerTemplate = myCustomTemplate;
     * ```
     * ```html
     * <!-- Set in markup -->
     *  <igx-select #select>
     *      ...
     *      <ng-template igxSelectFooter>
     *          <div class="select__footer">
     *              This is a custom footer
     *          </div>
     *      </ng-template>
     *  </igx-select>
     * ```
     */
    footerTemplate: TemplateRef<any>;
    private hintElement;
    /** @hidden @internal */
    width: string;
    /** @hidden @internal do not use the drop-down container class */
    cssClass: boolean;
    /** @hidden @internal */
    allowItemsFocus: boolean;
    /** @hidden @internal */
    height: string;
    protected destroy$: Subject<boolean>;
    private ngControl;
    private _overlayDefaults;
    private _value;
    private _type;
    /**
     * An @Input property that gets/sets the component value.
     *
     * ```typescript
     * // get
     * let selectValue = this.select.value;
     * ```
     *
     * ```typescript
     * // set
     * this.select.value = 'London';
     * ```
     * ```html
     * <igx-select [value]="value"></igx-select>
     * ```
     */
    get value(): any;
    set value(v: any);
    /**
     * An @Input property that sets how the select will be styled.
     * The allowed values are `line`, `box` and `border`. The input-group default is `line`.
     * ```html
     * <igx-select [type]="'box'"></igx-select>
     * ```
     */
    get type(): IgxInputGroupType;
    set type(val: IgxInputGroupType);
    /** @hidden @internal */
    get selectionValue(): any;
    /** @hidden @internal */
    get selectedItem(): IgxSelectItemComponent;
    private _onChangeCallback;
    private _onTouchedCallback;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, selection: IgxSelectionAPIService, overlayService: IgxOverlayService, _displayDensityOptions: IDisplayDensityOptions, _inputGroupType: IgxInputGroupType, _injector: Injector);
    /** @hidden @internal */
    writeValue: (value: any) => void;
    /** @hidden @internal */
    registerOnChange(fn: any): void;
    /** @hidden @internal */
    registerOnTouched(fn: any): void;
    /** @hidden @internal */
    setDisabledState(isDisabled: boolean): void;
    /** @hidden @internal */
    getEditElement(): HTMLInputElement;
    /** @hidden @internal */
    selectItem(newSelection: IgxDropDownItemBaseDirective, event?: any): void;
    /** @hidden @internal */
    getFirstItemElement(): HTMLElement;
    /**
     * Opens the select
     *
     * ```typescript
     * this.select.open();
     * ```
     */
    open(overlaySettings?: OverlaySettings): void;
    inputGroupClick(event: MouseEvent, overlaySettings?: OverlaySettings): void;
    /** @hidden @internal */
    ngAfterContentInit(): void;
    /**
     * Event handlers
     *
     * @hidden @internal
     */
    handleOpening(e: ToggleViewCancelableEventArgs): void;
    /** @hidden @internal */
    onToggleContentAppended(event: ToggleViewEventArgs): void;
    /** @hidden @internal */
    handleOpened(): void;
    /** @hidden @internal */
    handleClosing(e: ToggleViewCancelableEventArgs): void;
    /** @hidden @internal */
    handleClosed(): void;
    /** @hidden @internal */
    onBlur(): void;
    /** @hidden @internal */
    onFocus(): void;
    /**
     * @hidden @internal
     */
    ngOnInit(): void;
    /**
     * @hidden @internal
     */
    ngAfterViewInit(): void;
    /**
     * @hidden @internal
     */
    ngOnDestroy(): void;
    /**
     * @hidden @internal
     * Prevent input blur - closing the items container on Header/Footer Template click.
     */
    mousedownHandler(event: any): void;
    protected onStatusChanged(): void;
    protected navigate(direction: Navigate, currentIndex?: number): void;
    protected manageRequiredAsterisk(): void;
    private setSelection;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSelectComponent, [null, null, null, null, { optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxSelectComponent, "igx-select", never, { "placeholder": "placeholder"; "disabled": "disabled"; "overlaySettings": "overlaySettings"; "value": "value"; "type": "type"; }, { "opening": "opening"; "opened": "opened"; "closing": "closing"; "closed": "closed"; }, ["label", "toggleIconTemplate", "headerTemplate", "footerTemplate", "hintElement", "children"], ["[igxLabel]", "igx-prefix,[igxPrefix]", "igx-suffix,[igxSuffix]", "igx-hint, [igxHint]", "*", "igx-select-item, igx-select-item-group"]>;
}
