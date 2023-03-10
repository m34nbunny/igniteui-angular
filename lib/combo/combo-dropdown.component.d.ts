import { ChangeDetectorRef, ElementRef, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { IgxComboBase } from './combo.common';
import { IDropDownBase } from '../drop-down/drop-down.common';
import { IgxDropDownComponent } from '../drop-down/drop-down.component';
import { DropDownActionKey } from '../drop-down/drop-down.common';
import { IgxComboAPIService } from './combo.api';
import { IgxDropDownItemBaseDirective } from '../drop-down/drop-down-item.base';
import { IgxSelectionAPIService } from '../core/selection';
import { IgxComboItemComponent } from './combo-item.component';
import { IDisplayDensityOptions } from '../core/density';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxComboDropDownComponent extends IgxDropDownComponent implements IDropDownBase, OnDestroy, AfterViewInit {
    protected elementRef: ElementRef;
    protected cdr: ChangeDetectorRef;
    protected selection: IgxSelectionAPIService;
    combo: IgxComboBase;
    protected comboAPI: IgxComboAPIService;
    protected _displayDensityOptions: IDisplayDensityOptions;
    /** @hidden @internal */
    singleMode: boolean;
    /**
     * @hidden
     * @internal
     */
    children: QueryList<IgxDropDownItemBaseDirective>;
    /** @hidden @internal */
    get scrollContainer(): HTMLElement;
    protected get isScrolledToLast(): boolean;
    protected get lastVisibleIndex(): number;
    protected get sortedChildren(): IgxDropDownItemBaseDirective[];
    /**
     * Get all non-header items
     *
     * ```typescript
     * let myDropDownItems = this.dropdown.items;
     * ```
     */
    get items(): IgxComboItemComponent[];
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, selection: IgxSelectionAPIService, combo: IgxComboBase, comboAPI: IgxComboAPIService, _displayDensityOptions: IDisplayDensityOptions);
    /**
     * @hidden @internal
     */
    onFocus(): void;
    /**
     * @hidden @internal
     */
    onBlur(_evt?: any): void;
    /**
     * @hidden @internal
     */
    onToggleOpened(): void;
    /**
     * @hidden
     */
    navigateFirst(): void;
    /**
     * @hidden
     */
    navigatePrev(): void;
    /**
     * @hidden
     */
    navigateNext(): void;
    /**
     * @hidden @internal
     */
    selectItem(item: IgxDropDownItemBaseDirective): void;
    /**
     * @hidden @internal
     */
    updateScrollPosition(): void;
    /**
     * @hidden @internal
     */
    onItemActionKey(key: DropDownActionKey): void;
    ngAfterViewInit(): void;
    /**
     * @hidden @internal
     */
    ngOnDestroy(): void;
    protected scrollToHiddenItem(_newItem: any): void;
    protected scrollHandler: () => void;
    private handleEnter;
    private handleSpace;
    private isAddItemFocused;
    private focusAddItemButton;
    static ??fac: i0.????FactoryDeclaration<IgxComboDropDownComponent, [null, null, null, null, null, { optional: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxComboDropDownComponent, "igx-combo-drop-down", never, { "singleMode": "singleMode"; }, {}, ["children"], ["*"]>;
}
