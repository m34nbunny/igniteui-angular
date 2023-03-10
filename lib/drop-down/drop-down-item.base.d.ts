import { IDropDownBase } from './drop-down.common';
import { ElementRef, DoCheck, EventEmitter } from '@angular/core';
import { IgxSelectionAPIService } from '../core/selection';
import { IgxDropDownGroupComponent } from './drop-down-group.component';
import * as i0 from "@angular/core";
/**
 * An abstract class defining a drop-down item:
 * With properties / styles for selection, highlight, height
 * Bindable property for passing data (`value: any`)
 * Parent component (has to be used under a parent with type `IDropDownBase`)
 * Method for handling click on Host()
 */
export declare class IgxDropDownItemBaseDirective implements DoCheck {
    protected dropDown: IDropDownBase;
    protected elementRef: ElementRef;
    protected group: IgxDropDownGroupComponent;
    protected selection?: IgxSelectionAPIService;
    /**
     * Sets/gets the `id` of the item.
     * ```html
     * <igx-drop-down-item [id] = 'igx-drop-down-item-0'></igx-drop-down-item>
     * ```
     * ```typescript
     * let itemId =  this.item.id;
     * ```
     *
     * @memberof IgxSelectItemComponent
     */
    id: string;
    get ariaLabel(): string;
    /**
     * @hidden @internal
     */
    get itemID(): this;
    /**
     * The data index of the dropdown item.
     *
     * ```typescript
     * // get the data index of the selected dropdown item
     * let selectedItemIndex = this.dropdown.selectedItem.index
     * ```
     */
    get index(): number;
    set index(value: number);
    /**
     * Gets/sets the value of the item if the item is databound
     *
     * ```typescript
     * // usage in IgxDropDownItemComponent
     * // get
     * let mySelectedItemValue = this.dropdown.selectedItem.value;
     *
     * // set
     * let mySelectedItem = this.dropdown.selectedItem;
     * mySelectedItem.value = { id: 123, name: 'Example Name' }
     *
     * // usage in IgxComboItemComponent
     * // get
     * let myComboItemValue = this.combo.items[0].value;
     * ```
     */
    value: any;
    /**
     * @hidden @internal
     */
    get itemStyle(): boolean;
    /**
     * @hidden @internal
     */
    get itemStyleCosy(): boolean;
    /**
     * @hidden @internal
     */
    get itemStyleCompact(): boolean;
    /**
     * Sets/Gets if the item is the currently selected one in the dropdown
     *
     * ```typescript
     *  let mySelectedItem = this.dropdown.selectedItem;
     *  let isMyItemSelected = mySelectedItem.selected; // true
     * ```
     *
     * Two-way data binding
     * ```html
     * <igx-drop-down-item [(selected)]='model.isSelected'></igx-drop-down-item>
     * ```
     */
    get selected(): boolean;
    set selected(value: boolean);
    /**
     * @hidden
     */
    selectedChange: EventEmitter<boolean>;
    /**
     * Sets/gets if the given item is focused
     * ```typescript
     *  let mySelectedItem = this.dropdown.selectedItem;
     *  let isMyItemFocused = mySelectedItem.focused;
     * ```
     */
    get focused(): boolean;
    /**
     * ```html
     *  <igx-drop-down-item *ngFor="let item of items" focused={{!item.focused}}>
     *      <div>
     *          {{item.field}}
     *      </div>
     *  </igx-drop-down-item>
     * ```
     */
    set focused(value: boolean);
    /**
     * Sets/gets if the given item is header
     * ```typescript
     *  // get
     *  let mySelectedItem = this.dropdown.selectedItem;
     *  let isMyItemHeader = mySelectedItem.isHeader;
     * ```
     *
     * ```html
     *  <!--set-->
     *  <igx-drop-down-item *ngFor="let item of items">
     *      <div *ngIf="items.indexOf(item) === 5; then item.isHeader = true">
     *          {{item.field}}
     *      </div>
     *  </igx-drop-down-item>
     * ```
     */
    isHeader: boolean;
    /**
     * @hidden @internal
     */
    get headerClassCosy(): boolean;
    /**
     * @hidden @internal
     */
    get headerClassCompact(): boolean;
    /**
     * Sets/gets if the given item is disabled
     *
     * ```typescript
     *  // get
     *  let mySelectedItem = this.dropdown.selectedItem;
     *  let myItemIsDisabled = mySelectedItem.disabled;
     * ```
     *
     * ```html
     *  <igx-drop-down-item *ngFor="let item of items" disabled={{!item.disabled}}>
     *      <div>
     *          {{item.field}}
     *      </div>
     *  </igx-drop-down-item>
     * ```
     * **NOTE:** Drop-down items inside of a disabled `IgxDropDownGroup` will always count as disabled
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * Gets/sets the `role` attribute of the item. Default is 'option'.
     *
     * ```html
     *  <igx-drop-down-item [role]="customRole"></igx-drop-down-item>
     * ```
     */
    role: string;
    /**
     * Gets item index
     *
     * @hidden @internal
     */
    get itemIndex(): number;
    /**
     * Gets item element height
     *
     * @hidden @internal
     */
    get elementHeight(): number;
    /**
     * Get item html element
     *
     * @hidden @internal
     */
    get element(): ElementRef;
    protected get hasIndex(): boolean;
    /**
     * @hidden
     */
    protected _focused: boolean;
    protected _selected: boolean;
    protected _index: any;
    protected _disabled: boolean;
    constructor(dropDown: IDropDownBase, elementRef: ElementRef, group: IgxDropDownGroupComponent, selection?: IgxSelectionAPIService);
    /**
     * @hidden
     * @internal
     */
    clicked(event: any): void;
    /**
     * @hidden
     * @internal
     */
    handleMousedown(event: MouseEvent): void;
    ngDoCheck(): void;
    /** Returns true if the items is not a header or disabled  */
    protected get isSelectable(): boolean;
    /** If `allowItemsFocus` is enabled, keep the browser focus on the active item */
    protected ensureItemFocus(): void;
    static ??fac: i0.????FactoryDeclaration<IgxDropDownItemBaseDirective, [null, null, { optional: true; }, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<IgxDropDownItemBaseDirective, "[igxDropDownItemBase]", never, { "id": "id"; "ariaLabel": "ariaLabel"; "index": "index"; "value": "value"; "selected": "selected"; "isHeader": "isHeader"; "disabled": "disabled"; "role": "role"; }, { "selectedChange": "selectedChange"; }, never>;
}
