import { ElementRef, QueryList, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Navigate, ISelectionEventArgs } from './drop-down.common';
import { IDropDownList } from './drop-down.common';
import { DropDownActionKey } from './drop-down.common';
import { IgxDropDownItemBaseDirective } from './drop-down-item.base';
import { DisplayDensityBase, IDisplayDensityOptions } from '../core/density';
import * as i0 from "@angular/core";
/**
 * An abstract class, defining a drop-down component, with:
 * Properties for display styles and classes
 * A collection items of type `IgxDropDownItemBaseDirective`
 * Properties and methods for navigating (highlighting/focusing) items from the collection
 * Properties and methods for selecting items from the collection
 */
export declare abstract class IgxDropDownBaseDirective extends DisplayDensityBase implements IDropDownList {
    protected elementRef: ElementRef;
    protected cdr: ChangeDetectorRef;
    protected _displayDensityOptions: IDisplayDensityOptions;
    /**
     * Emitted when item selection is changing, before the selection completes
     *
     * ```html
     * <igx-drop-down (selectionChanging)='handleSelection()'></igx-drop-down>
     * ```
     */
    selectionChanging: EventEmitter<ISelectionEventArgs>;
    /**
     *  Gets/Sets the width of the drop down
     *
     * ```typescript
     * // get
     * let myDropDownCurrentWidth = this.dropdown.width;
     * ```
     * ```html
     * <!--set-->
     * <igx-drop-down [width]='160px'></igx-drop-down>
     * ```
     */
    width: string;
    /**
     * Gets/Sets the height of the drop down
     *
     * ```typescript
     * // get
     * let myDropDownCurrentHeight = this.dropdown.height;
     * ```
     * ```html
     * <!--set-->
     * <igx-drop-down [height]='400px'></igx-drop-down>
     * ```
     */
    height: string;
    /**
     * Gets/Sets the drop down's id
     *
     * ```typescript
     * // get
     * let myDropDownCurrentId = this.dropdown.id;
     * ```
     * ```html
     * <!--set-->
     * <igx-drop-down [id]='newDropDownId'></igx-drop-down>
     * ```
     */
    get id(): string;
    set id(value: string);
    /**
     * Gets/Sets the drop down's container max height.
     *
     * ```typescript
     * // get
     * let maxHeight = this.dropdown.maxHeight;
     * ```
     * ```html
     * <!--set-->
     * <igx-drop-down [maxHeight]='200px'></igx-drop-down>
     * ```
     */
    maxHeight: any;
    /**
     * @hidden @internal
     */
    cssClass: boolean;
    /**
     * Get all non-header items
     *
     * ```typescript
     * let myDropDownItems = this.dropdown.items;
     * ```
     */
    get items(): IgxDropDownItemBaseDirective[];
    /**
     * Get all header items
     *
     * ```typescript
     * let myDropDownHeaderItems = this.dropdown.headers;
     * ```
     */
    get headers(): IgxDropDownItemBaseDirective[];
    /**
     * Get dropdown html element
     *
     * ```typescript
     * let myDropDownElement = this.dropdown.element;
     * ```
     */
    get element(): any;
    /**
     * @hidden @internal
     * Get dropdown's html element of its scroll container
     */
    get scrollContainer(): HTMLElement;
    /**
     * @hidden
     * @internal
     */
    children: QueryList<IgxDropDownItemBaseDirective>;
    protected _width: any;
    protected _height: any;
    protected _focusedItem: any;
    protected _id: string;
    /**
     * Gets if the dropdown is collapsed
     */
    abstract readonly collapsed: boolean;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, _displayDensityOptions: IDisplayDensityOptions);
    /** Keydown Handler */
    onItemActionKey(key: DropDownActionKey, event?: Event): void;
    /**
     * Emits selectionChanging with the target item & event
     *
     * @hidden @internal
     * @param newSelection the item selected
     * @param event the event that triggered the call
     */
    selectItem(newSelection?: IgxDropDownItemBaseDirective, event?: Event): void;
    /**
     * @hidden @internal
     */
    get focusedItem(): IgxDropDownItemBaseDirective;
    /**
     * @hidden @internal
     */
    set focusedItem(item: IgxDropDownItemBaseDirective);
    /**
     * Navigates to the item on the specified index
     *
     * @param newIndex number - the index of the item in the `items` collection
     */
    navigateItem(newIndex: number): void;
    /**
     * @hidden @internal
     */
    navigateFirst(): void;
    /**
     * @hidden @internal
     */
    navigateLast(): void;
    /**
     * @hidden @internal
     */
    navigateNext(): void;
    /**
     * @hidden @internal
     */
    navigatePrev(): void;
    protected scrollToHiddenItem(newItem: IgxDropDownItemBaseDirective): void;
    protected navigate(direction: Navigate, currentIndex?: number): void;
    protected getNearestSiblingFocusableItemIndex(startIndex: number, direction: Navigate): number;
    static ??fac: i0.????FactoryDeclaration<IgxDropDownBaseDirective, [null, null, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<IgxDropDownBaseDirective, never, never, { "width": "width"; "height": "height"; "id": "id"; "maxHeight": "maxHeight"; }, { "selectionChanging": "selectionChanging"; }, never>;
}
