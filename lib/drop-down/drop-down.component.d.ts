import { ChangeDetectorRef, ElementRef, QueryList, OnChanges, OnDestroy, AfterViewInit, EventEmitter, SimpleChanges } from '@angular/core';
import { IgxToggleDirective, ToggleViewEventArgs } from '../directives/toggle/toggle.directive';
import { IgxDropDownBaseDirective } from './drop-down.base';
import { DropDownActionKey, Navigate } from './drop-down.common';
import { IDropDownBase } from './drop-down.common';
import { IBaseCancelableBrowserEventArgs, IBaseEventArgs } from '../core/utils';
import { IgxSelectionAPIService } from '../core/selection';
import { Subject } from 'rxjs';
import { IgxDropDownItemBaseDirective } from './drop-down-item.base';
import { IgxForOfDirective } from '../directives/for-of/for_of.directive';
import { IDisplayDensityOptions } from '../core/density';
import { OverlaySettings } from '../services/overlay/utilities';
import * as i0 from "@angular/core";
/**
 * **Ignite UI for Angular DropDown** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/drop-down)
 *
 * The Ignite UI for Angular Drop Down displays a scrollable list of items which may be visually grouped and
 * supports selection of a single item. Clicking or tapping an item selects it and closes the Drop Down
 *
 * Example:
 * ```html
 * <igx-drop-down>
 *   <igx-drop-down-item *ngFor="let item of items" disabled={{item.disabled}} isHeader={{item.header}}>
 *     {{ item.value }}
 *   </igx-drop-down-item>
 * </igx-drop-down>
 * ```
 */
export declare class IgxDropDownComponent extends IgxDropDownBaseDirective implements IDropDownBase, OnChanges, AfterViewInit, OnDestroy {
    protected elementRef: ElementRef;
    protected cdr: ChangeDetectorRef;
    protected selection: IgxSelectionAPIService;
    protected _displayDensityOptions: IDisplayDensityOptions;
    /**
     * @hidden
     * @internal
     */
    children: QueryList<IgxDropDownItemBaseDirective>;
    /**
     * Emitted before the dropdown is opened
     *
     * ```html
     * <igx-drop-down (opening)='handleOpening($event)'></igx-drop-down>
     * ```
     */
    opening: EventEmitter<IBaseCancelableBrowserEventArgs>;
    /**
     * Emitted after the dropdown is opened
     *
     * ```html
     * <igx-drop-down (opened)='handleOpened($event)'></igx-drop-down>
     * ```
     */
    opened: EventEmitter<IBaseEventArgs>;
    /**
     * Emitted before the dropdown is closed
     *
     * ```html
     * <igx-drop-down (closing)='handleClosing($event)'></igx-drop-down>
     * ```
     */
    closing: EventEmitter<IBaseCancelableBrowserEventArgs>;
    /**
     * Emitted after the dropdown is closed
     *
     * ```html
     * <igx-drop-down (closed)='handleClosed($event)'></igx-drop-down>
     * ```
     */
    closed: EventEmitter<IBaseEventArgs>;
    /**
     * Gets/sets whether items take focus. Disabled by default.
     * When enabled, drop down items gain tab index and are focused when active -
     * this includes activating the selected item when opening the drop down and moving with keyboard navigation.
     *
     * Note: Keep that focus shift in mind when using the igxDropDownItemNavigation directive
     * and ensure it's placed either on each focusable item or a common ancestor to allow it to handle keyboard events.
     *
     * ```typescript
     * // get
     * let dropDownAllowsItemFocus = this.dropdown.allowItemsFocus;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-drop-down [allowItemsFocus]='true'></igx-drop-down>
     * ```
     */
    allowItemsFocus: boolean;
    protected virtDir: IgxForOfDirective<any>;
    protected toggleDirective: IgxToggleDirective;
    protected scrollContainerRef: ElementRef;
    /**
     * @hidden @internal
     */
    get focusedItem(): IgxDropDownItemBaseDirective;
    set focusedItem(value: IgxDropDownItemBaseDirective);
    get id(): string;
    set id(value: string);
    /** Id of the internal listbox of the drop down */
    get listId(): string;
    /**
     * Get currently selected item
     *
     * ```typescript
     * let currentItem = this.dropdown.selectedItem;
     * ```
     */
    get selectedItem(): IgxDropDownItemBaseDirective;
    /**
     * Gets if the dropdown is collapsed
     *
     * ```typescript
     * let isCollapsed = this.dropdown.collapsed;
     * ```
     */
    get collapsed(): boolean;
    /** @hidden @internal */
    get scrollContainer(): HTMLElement;
    protected get collectionLength(): number;
    protected destroy$: Subject<boolean>;
    protected _scrollPosition: number;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, selection: IgxSelectionAPIService, _displayDensityOptions: IDisplayDensityOptions);
    /**
     * Opens the dropdown
     *
     * ```typescript
     * this.dropdown.open();
     * ```
     */
    open(overlaySettings?: OverlaySettings): void;
    /**
     * Closes the dropdown
     *
     * ```typescript
     * this.dropdown.close();
     * ```
     */
    close(event?: Event): void;
    /**
     * Toggles the dropdown
     *
     * ```typescript
     * this.dropdown.toggle();
     * ```
     */
    toggle(overlaySettings?: OverlaySettings): void;
    /**
     * Select an item by index
     *
     * @param index of the item to select; If the drop down uses *igxFor, pass the index in data
     */
    setSelectedItem(index: number): void;
    /**
     * Navigates to the item on the specified index
     * If the data in the drop-down is virtualized, pass the index of the item in the virtualized data.
     *
     * @param newIndex number
     */
    navigateItem(index: number): void;
    /**
     * @hidden @internal
     */
    updateScrollPosition(): void;
    /**
     * @hidden @internal
     */
    onToggleOpening(e: IBaseCancelableBrowserEventArgs): void;
    /**
     * @hidden @internal
     */
    onToggleContentAppended(_event: ToggleViewEventArgs): void;
    /**
     * @hidden @internal
     */
    onToggleOpened(): void;
    /**
     * @hidden @internal
     */
    onToggleClosing(e: IBaseCancelableBrowserEventArgs): void;
    /**
     * @hidden @internal
     */
    onToggleClosed(): void;
    /**
     * @hidden @internal
     */
    ngOnDestroy(): void;
    /** @hidden @internal */
    calculateScrollPosition(item: IgxDropDownItemBaseDirective): number;
    /**
     * @hidden @internal
     */
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    /** Keydown Handler */
    onItemActionKey(key: DropDownActionKey, event?: Event): void;
    /**
     * Virtual scroll implementation
     *
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
    /**
     * Handles the `selectionChanging` emit and the drop down toggle when selection changes
     *
     * @hidden
     * @internal
     * @param newSelection
     * @param event
     */
    selectItem(newSelection?: IgxDropDownItemBaseDirective, event?: Event): void;
    /**
     * Clears the selection of the dropdown
     * ```typescript
     * this.dropdown.clearSelection();
     * ```
     */
    clearSelection(): void;
    /**
     * Checks whether the selection is valid
     * `null` - the selection should be emptied
     * Virtual? - the selection should at least have and `index` and `value` property
     * Non-virtual? - the selection should be a valid drop-down item and **not** be a header
     */
    protected isSelectionValid(selection: any): boolean;
    protected scrollToItem(item: IgxDropDownItemBaseDirective): void;
    protected focusItem(value: boolean): void;
    protected updateItemFocus(): void;
    protected skipHeader(direction: Navigate): void;
    private isIndexOutOfBounds;
    static ??fac: i0.????FactoryDeclaration<IgxDropDownComponent, [null, null, null, { optional: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxDropDownComponent, "igx-drop-down", never, { "allowItemsFocus": "allowItemsFocus"; }, { "opening": "opening"; "opened": "opened"; "closing": "closing"; "closed": "closed"; }, ["virtDir", "children"], ["*"]>;
}
