import { ContentChild, Directive, EventEmitter, HostBinding, HostListener, Inject, InjectionToken, Input, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { caseSensitive } from '@igniteui/material-icons-extended';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayDensityBase, DisplayDensityToken } from '../core/displayDensity';
import { cloneArray } from '../core/utils';
import { SortingDirection } from '../data-operations/sorting-strategy';
import { IgxForOfDirective } from '../directives/for-of/for_of.directive';
import { IGX_INPUT_GROUP_TYPE } from '../input-group/inputGroupType';
import { IgxInputDirective, IgxInputGroupComponent, IgxInputState } from '../input-group/public_api';
import { AbsoluteScrollStrategy, AutoPositionStrategy } from '../services/public_api';
import { IgxComboAddItemDirective, IgxComboClearIconDirective, IgxComboEmptyDirective, IgxComboFooterDirective, IgxComboHeaderDirective, IgxComboHeaderItemDirective, IgxComboItemDirective, IgxComboToggleIconDirective } from './combo.directives';
import * as i0 from "@angular/core";
import * as i1 from "../core/selection";
import * as i2 from "./combo.api";
import * as i3 from "../icon/public_api";
export const IGX_COMBO_COMPONENT = new InjectionToken('IgxComboComponentToken');
let NEXT_ID = 0;
/**
 * @hidden
 * The default number of items that should be in the combo's
 * drop-down list if no `[itemsMaxHeight]` is specified
 */
const itemsInContainer = 10; // TODO: make private readonly
/** @hidden @internal */
const ItemHeights = {
    comfortable: 40,
    cosy: 32,
    compact: 28,
};
/** @hidden @internal */
export var DataTypes;
(function (DataTypes) {
    DataTypes["EMPTY"] = "empty";
    DataTypes["PRIMITIVE"] = "primitive";
    DataTypes["COMPLEX"] = "complex";
    DataTypes["PRIMARYKEY"] = "valueKey";
})(DataTypes || (DataTypes = {}));
export var IgxComboState;
(function (IgxComboState) {
    /**
     * Combo with initial state.
     */
    IgxComboState[IgxComboState["INITIAL"] = 0] = "INITIAL";
    /**
     * Combo with valid state.
     */
    IgxComboState[IgxComboState["VALID"] = 1] = "VALID";
    /**
     * Combo with invalid state.
     */
    IgxComboState[IgxComboState["INVALID"] = 2] = "INVALID";
})(IgxComboState || (IgxComboState = {}));
export class IgxComboBaseDirective extends DisplayDensityBase {
    constructor(elementRef, cdr, selectionService, comboAPI, _iconService, _displayDensityOptions, _inputGroupType, _injector) {
        super(_displayDensityOptions);
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.selectionService = selectionService;
        this.comboAPI = comboAPI;
        this._iconService = _iconService;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        this._injector = _injector;
        /**
         * Defines whether the caseSensitive icon should be shown in the search input
         *
         * ```typescript
         * // get
         * let myComboShowSearchCaseIcon = this.combo.showSearchCaseIcon;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-combo [showSearchCaseIcon]='true'></igx-combo>
         * ```
         */
        this.showSearchCaseIcon = false;
        /**
         * Set custom overlay settings that control how the combo's list of items is displayed.
         * Set:
         * ```html
         * <igx-combo [overlaySettings] = "customOverlaySettings"></igx-combo>
         * ```
         *
         * ```typescript
         *  const customSettings = { positionStrategy: { settings: { target: myTarget } } };
         *  combo.overlaySettings = customSettings;
         * ```
         * Get any custom overlay settings used by the combo:
         * ```typescript
         *  const comboOverlaySettings: OverlaySettings = myCombo.overlaySettings;
         * ```
         */
        this.overlaySettings = null;
        /**
         * Gets/gets combo id.
         *
         * ```typescript
         * // get
         * let id = this.combo.id;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-combo [id]='combo1'></igx-combo>
         * ```
         */
        this.id = `igx-combo-${NEXT_ID++}`;
        /**
         * Controls whether custom values can be added to the collection
         *
         * ```typescript
         * // get
         * let comboAllowsCustomValues = this.combo.allowCustomValues;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-combo [allowCustomValues]='true'></igx-combo>
         * ```
         */
        this.allowCustomValues = false;
        /**
         * Determines which column in the data source is used to determine the value.
         *
         * ```typescript
         * // get
         * let myComboValueKey = this.combo.valueKey;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-combo [valueKey]='myKey'></igx-combo>
         * ```
         */
        this.valueKey = null;
        /** @hidden @internal */
        this.cssClass = 'igx-combo'; // Independent of display density for the time being
        /** @hidden @internal */
        this.role = 'combobox';
        /**
         * An @Input property that enabled/disables combo. The default is `false`.
         * ```html
         * <igx-combo [disabled]="'true'">
         * ```
         */
        this.disabled = false;
        /**
         * Emitted before the dropdown is opened
         *
         * ```html
         * <igx-combo opening='handleOpening($event)'></igx-combo>
         * ```
         */
        this.opening = new EventEmitter();
        /**
         * Emitted after the dropdown is opened
         *
         * ```html
         * <igx-combo (opened)='handleOpened($event)'></igx-combo>
         * ```
         */
        this.opened = new EventEmitter();
        /**
         * Emitted before the dropdown is closed
         *
         * ```html
         * <igx-combo (closing)='handleClosing($event)'></igx-combo>
         * ```
         */
        this.closing = new EventEmitter();
        /**
         * Emitted after the dropdown is closed
         *
         * ```html
         * <igx-combo (closed)='handleClosed($event)'></igx-combo>
         * ```
         */
        this.closed = new EventEmitter();
        /**
         * Emitted when an item is being added to the data collection
         *
         * ```html
         * <igx-combo (addition)='handleAdditionEvent($event)'></igx-combo>
         * ```
         */
        this.addition = new EventEmitter();
        /**
         * Emitted when the value of the search input changes (e.g. typing, pasting, clear, etc.)
         *
         * ```html
         * <igx-combo (searchInputUpdate)='handleSearchInputEvent($event)'></igx-combo>
         * ```
         */
        this.searchInputUpdate = new EventEmitter();
        /**
         * Emitted when new chunk of data is loaded from the virtualization
         *
         * ```html
         * <igx-combo (dataPreLoad)='handleDataPreloadEvent($event)'></igx-combo>
         * ```
         */
        this.dataPreLoad = new EventEmitter();
        /**
         * The custom template, if any, that should be used when rendering ITEMS in the combo list
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.itemTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboItem>
         *          <div class="custom-item" let-item let-key="valueKey">
         *              <div class="custom-item__name">{{ item[key] }}</div>
         *              <div class="custom-item__cost">{{ item.cost }}</div>
         *          </div>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.itemTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering the HEADER for the combo items list
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.headerTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboHeader>
         *          <div class="combo__header">
         *              This is a custom header
         *          </div>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.headerTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering the FOOTER for the combo items list
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.footerTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboFooter>
         *          <div class="combo__footer">
         *              This is a custom footer
         *          </div>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.footerTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering HEADER ITEMS for groups in the combo list
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.headerItemTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboHeaderItem let-item let-key="groupKey">
         *          <div class="custom-item--group">Group header for {{ item[key] }}</div>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.headerItemTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering the ADD BUTTON in the combo drop down
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.addItemTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboAddItem>
         *          <button class="combo__add-button">
         *              Click to add item
         *          </button>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.addItemTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering the ADD BUTTON in the combo drop down
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.emptyTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboEmpty>
         *          <div class="combo--empty">
         *              There are no items to display
         *          </div>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.emptyTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering the combo TOGGLE(open/close) button
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.toggleIconTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboToggleIcon let-collapsed>
         *          <igx-icon>{{ collapsed ? 'remove_circle' : 'remove_circle_outline'}}</igx-icon>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.toggleIconTemplate = null;
        /**
         * The custom template, if any, that should be used when rendering the combo CLEAR button
         *
         * ```typescript
         * // Set in typescript
         * const myCustomTemplate: TemplateRef<any> = myComponent.customTemplate;
         * myComponent.combo.clearIconTemplate = myCustomTemplate;
         * ```
         * ```html
         * <!-- Set in markup -->
         *  <igx-combo #combo>
         *      ...
         *      <ng-template igxComboClearIcon>
         *          <igx-icon>clear</igx-icon>
         *      </ng-template>
         *  </igx-combo>
         * ```
         */
        this.clearIconTemplate = null;
        /** @hidden @internal */
        this.searchInput = null;
        this.dropdownContainer = null;
        /** @hidden @internal */
        this.customValueFlag = true;
        /** @hidden @internal */
        this.filterValue = '';
        /** @hidden @internal */
        this.defaultFallbackGroup = 'Other';
        /** @hidden @internal */
        this.filteringOptions = {
            caseSensitive: false
        };
        this._data = [];
        this._value = '';
        this._groupKey = '';
        this._searchValue = '';
        this._filteredData = [];
        this._remoteSelection = {};
        this._valid = IgxComboState.INITIAL;
        this.ngControl = null;
        this.destroy$ = new Subject();
        this._onTouchedCallback = noop;
        this._onChangeCallback = noop;
        this._type = null;
        this._dataType = '';
        this._itemHeight = null;
        this._itemsMaxHeight = null;
        this._groupSortingDirection = SortingDirection.Asc;
        this.onStatusChanged = () => {
            if ((this.ngControl.control.touched || this.ngControl.control.dirty) &&
                (this.ngControl.control.validator || this.ngControl.control.asyncValidator)) {
                if (!this.collapsed || this.inputGroup.isFocused) {
                    this.valid = this.ngControl.invalid ? IgxComboState.INVALID : IgxComboState.VALID;
                }
                else {
                    this.valid = this.ngControl.invalid ? IgxComboState.INVALID : IgxComboState.INITIAL;
                }
            }
            else {
                // B.P. 18 May 2021: IgxDatePicker does not reset its state upon resetForm #9526
                this.valid = IgxComboState.INITIAL;
            }
            this.manageRequiredAsterisk();
        };
        this.findMatch = (element) => {
            const value = this.displayKey ? element[this.displayKey] : element;
            return value?.toString().toLowerCase() === this.searchValue.trim().toLowerCase();
        };
    }
    /**
     * Configures the drop down list height
     *
     * ```typescript
     * // get
     * let myComboItemsMaxHeight = this.combo.itemsMaxHeight;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-combo [itemsMaxHeight]='320'></igx-combo>
     * ```
     */
    get itemsMaxHeight() {
        if (this._itemsMaxHeight === null || this._itemsMaxHeight === undefined) {
            return this.itemHeight * itemsInContainer;
        }
        return this._itemsMaxHeight;
    }
    set itemsMaxHeight(val) {
        this._itemsMaxHeight = val;
    }
    /**
     * Configures the drop down list item height
     *
     * ```typescript
     * // get
     * let myComboItemHeight = this.combo.itemHeight;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-combo [itemHeight]='32'></igx-combo>
     * ```
     */
    get itemHeight() {
        if (this._itemHeight === null || this._itemHeight === undefined) {
            return ItemHeights[this.displayDensity];
        }
        return this._itemHeight;
    }
    set itemHeight(val) {
        this._itemHeight = val;
    }
    /**
     * Combo data source.
     *
     * ```html
     * <!--set-->
     * <igx-combo [data]='items'></igx-combo>
     * ```
     */
    get data() {
        return this._data;
    }
    set data(val) {
        this._data = (val) ? val : [];
    }
    set displayKey(val) {
        this._displayKey = val;
    }
    /**
     * Determines which column in the data source is used to determine the display value.
     *
     * ```typescript
     * // get
     * let myComboDisplayKey = this.combo.displayKey;
     *
     * // set
     * this.combo.displayKey = 'val';
     *
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-combo [displayKey]='myDisplayKey'></igx-combo>
     * ```
     */
    get displayKey() {
        return this._displayKey ? this._displayKey : this.valueKey;
    }
    /**
     * The item property by which items should be grouped inside the items list. Not usable if data is not of type Object[].
     *
     * ```html
     * <!--set-->
     * <igx-combo [groupKey]='newGroupKey'></igx-combo>
     * ```
     */
    set groupKey(val) {
        this._groupKey = val;
    }
    /**
     * The item property by which items should be grouped inside the items list. Not usable if data is not of type Object[].
     *
     * ```typescript
     * // get
     * let currentGroupKey = this.combo.groupKey;
     * ```
     */
    get groupKey() {
        return this._groupKey;
    }
    /**
     * An @Input property that sets groups sorting order.
     *
     * @example
     * ```html
     * <igx-combo [groupSortingDirection]="groupSortingDirection"></igx-combo>
     * ```
     * ```typescript
     * public groupSortingDirection = SortingDirection.Asc;
     * ```
     */
    get groupSortingDirection() {
        return this._groupSortingDirection;
    }
    set groupSortingDirection(val) {
        this._groupSortingDirection = val;
    }
    /** @hidden @internal */
    get ariaExpanded() {
        return !this.dropdown.collapsed;
    }
    /** @hidden @internal */
    get hasPopUp() {
        return 'listbox';
    }
    /** @hidden @internal */
    get ariaOwns() {
        return this.dropdown.id;
    }
    /**
     * An @Input property that sets how the combo will be styled.
     * The allowed values are `line`, `box`, `border` and `search`. The default is `box`.
     * ```html
     * <igx-combo [type]="'line'">
     * ```
     */
    get type() {
        return this._type || this._inputGroupType || 'box';
    }
    set type(val) {
        this._type = val;
    }
    /** @hidden @internal */
    get searchValue() {
        return this._searchValue;
    }
    set searchValue(val) {
        this.filterValue = val;
        this._searchValue = val;
    }
    /** @hidden @internal */
    get isRemote() {
        return this.totalItemCount > 0 &&
            this.valueKey &&
            this.dataType === DataTypes.COMPLEX;
    }
    /** @hidden @internal */
    get dataType() {
        if (this.displayKey) {
            return DataTypes.COMPLEX;
        }
        return DataTypes.PRIMITIVE;
    }
    /**
     * Gets if control is valid, when used in a form
     *
     * ```typescript
     * // get
     * let valid = this.combo.valid;
     * ```
     */
    get valid() {
        return this._valid;
    }
    /**
     * Sets if control is valid, when used in a form
     *
     * ```typescript
     * // set
     * this.combo.valid = IgxComboState.INVALID;
     * ```
     */
    set valid(valid) {
        this._valid = valid;
        this.comboInput.valid = IgxInputState[IgxComboState[valid]];
    }
    /**
     * The text displayed in the combo input
     *
     * ```typescript
     * // get
     * let comboValue = this.combo.value;
     * ```
     */
    get value() {
        return this._value;
    }
    /**
     * Defines the current state of the virtualized data. It contains `startIndex` and `chunkSize`
     *
     * ```typescript
     * // get
     * let state = this.combo.virtualizationState;
     * ```
     */
    get virtualizationState() {
        return this.virtDir.state;
    }
    /**
     * Sets the current state of the virtualized data.
     *
     * ```typescript
     * // set
     * this.combo.virtualizationState(state);
     * ```
     */
    set virtualizationState(state) {
        this.virtDir.state = state;
    }
    /**
     * Gets drop down state.
     *
     * ```typescript
     * let state = this.combo.collapsed;
     * ```
     */
    get collapsed() {
        return this.dropdown.collapsed;
    }
    /**
     * Gets total count of the virtual data items, when using remote service.
     *
     * ```typescript
     * // get
     * let count = this.combo.totalItemCount;
     * ```
     */
    get totalItemCount() {
        return this.virtDir.totalItemCount;
    }
    /**
     * Sets total count of the virtual data items, when using remote service.
     *
     * ```typescript
     * // set
     * this.combo.totalItemCount(remoteService.count);
     * ```
     */
    set totalItemCount(count) {
        this.virtDir.totalItemCount = count;
    }
    /** @hidden @internal */
    get template() {
        this._dataType = this.dataType;
        if (this.itemTemplate) {
            return this.itemTemplate;
        }
        if (this._dataType === DataTypes.COMPLEX) {
            return this.complexTemplate;
        }
        return this.primitiveTemplate;
    }
    /** @hidden @internal */
    onArrowDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.open();
    }
    /** @hidden @internal */
    ngOnInit() {
        this.ngControl = this._injector.get(NgControl, null);
        const targetElement = this.elementRef.nativeElement;
        this._overlaySettings = {
            target: targetElement,
            scrollStrategy: new AbsoluteScrollStrategy(),
            positionStrategy: new AutoPositionStrategy(),
            modal: false,
            closeOnOutsideClick: true,
            excludeFromOutsideClick: [targetElement]
        };
        this.selectionService.set(this.id, new Set());
        this._iconService.addSvgIconFromText(caseSensitive.name, caseSensitive.value, 'imx-icons');
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        this.filteredData = [...this.data];
        if (this.ngControl) {
            this.ngControl.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(this.onStatusChanged);
            this.manageRequiredAsterisk();
            this.cdr.detectChanges();
        }
        this.virtDir.chunkPreload.pipe(takeUntil(this.destroy$)).subscribe((e) => {
            const eventArgs = Object.assign({}, e, { owner: this });
            this.dataPreLoad.emit(eventArgs);
        });
    }
    /** @hidden @internal */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.comboAPI.clear();
        this.selectionService.clear(this.id);
    }
    /**
     * A method that opens/closes the combo.
     *
     * ```html
     * <button (click)="combo.toggle()">Toggle Combo</button>
     * <igx-combo #combo></igx-combo>
     * ```
     */
    toggle() {
        const overlaySettings = Object.assign({}, this._overlaySettings, this.overlaySettings);
        this.dropdown.toggle(overlaySettings);
    }
    /**
     * A method that opens the combo.
     *
     * ```html
     * <button (click)="combo.open()">Open Combo</button>
     * <igx-combo #combo></igx-combo>
     * ```
     */
    open() {
        const overlaySettings = Object.assign({}, this._overlaySettings, this.overlaySettings);
        this.dropdown.open(overlaySettings);
    }
    /**
     * A method that closes the combo.
     *
     * ```html
     * <button (click)="combo.close()">Close Combo</button>
     * <igx-combo #combo></igx-combo>
     * ```
     */
    close() {
        this.dropdown.close();
    }
    /**
     * Triggers change detection on the combo view
     */
    triggerCheck() {
        this.cdr.detectChanges();
    }
    /**
     * Get current selection state
     *
     * @returns Array of selected items
     * ```typescript
     * let mySelection = this.combo.selection;
     * ```
     */
    get selection() {
        const items = Array.from(this.selectionService.get(this.id));
        return items;
    }
    /**
     * Returns if the specified itemID is selected
     *
     * @hidden
     * @internal
     */
    isItemSelected(item) {
        return this.selectionService.is_item_selected(this.id, item);
    }
    /** @hidden @internal */
    addItemToCollection() {
        if (!this.searchValue) {
            return;
        }
        const newValue = this.searchValue.trim();
        const addedItem = this.displayKey ? {
            [this.valueKey]: newValue,
            [this.displayKey]: newValue
        } : newValue;
        if (this.groupKey) {
            Object.assign(addedItem, { [this.groupKey]: this.defaultFallbackGroup });
        }
        // expose shallow copy instead of this.data in event args so this.data can't be mutated
        const oldCollection = [...this.data];
        const newCollection = [...this.data, addedItem];
        const args = {
            oldCollection, addedItem, newCollection, owner: this, cancel: false
        };
        this.addition.emit(args);
        if (args.cancel) {
            return;
        }
        this.data.push(args.addedItem);
        // trigger re-render
        this.data = cloneArray(this.data);
        this.select(this.valueKey !== null && this.valueKey !== undefined ?
            [args.addedItem[this.valueKey]] : [args.addedItem], false);
        this.customValueFlag = false;
        this.searchInput?.nativeElement.focus();
        this.dropdown.focusedItem = null;
        this.virtDir.scrollTo(0);
    }
    /** @hidden @internal */
    isAddButtonVisible() {
        // This should always return a boolean value. If this.searchValue was '', it returns '' instead of false;
        return this.searchValue !== '' && this.customValueFlag;
    }
    /** @hidden @internal */
    handleInputChange(event) {
        if (event !== undefined) {
            const args = {
                searchText: typeof event === 'string' ? event : event.target.value,
                owner: this,
                cancel: false
            };
            this.searchInputUpdate.emit(args);
            if (args.cancel) {
                this.filterValue = null;
            }
        }
        this.checkMatch();
    }
    /**
     * Event handlers
     *
     * @hidden
     * @internal
     */
    handleOpening(e) {
        const args = { owner: this, event: e.event, cancel: e.cancel };
        this.opening.emit(args);
        e.cancel = args.cancel;
    }
    /** @hidden @internal */
    handleClosing(e) {
        const args = { owner: this, event: e.event, cancel: e.cancel };
        this.closing.emit(args);
        e.cancel = args.cancel;
        if (e.cancel) {
            return;
        }
        this.searchValue = '';
        if (!e.event) {
            this.comboInput?.nativeElement.focus();
        }
    }
    /** @hidden @internal */
    handleClosed() {
        this.closed.emit({ owner: this });
    }
    /** @hidden @internal */
    handleKeyDown(event) {
        if (event.key === 'ArrowUp' || event.key === 'Up') {
            event.preventDefault();
            event.stopPropagation();
            this.close();
        }
    }
    /** @hidden @internal */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /** @hidden @internal */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /** @hidden @internal */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** @hidden @internal */
    onClick(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this.disabled) {
            this.toggle();
        }
    }
    /** @hidden @internal */
    onBlur() {
        if (this.collapsed) {
            this._onTouchedCallback();
            if (this.ngControl && this.ngControl.invalid) {
                this.valid = IgxComboState.INVALID;
            }
            else {
                this.valid = IgxComboState.INITIAL;
            }
        }
    }
    /** @hidden @internal */
    toggleCaseSensitive() {
        this.filteringOptions = { caseSensitive: !this.filteringOptions.caseSensitive };
    }
    /** if there is a valueKey - map the keys to data items, else - just return the keys */
    convertKeysToItems(keys) {
        if (this.comboAPI.valueKey === null) {
            return keys;
        }
        // map keys vs. filter data to retain the order of the selected items
        return keys.map(key => this.data.find(entry => entry[this.valueKey] === key)).filter(e => e !== undefined);
    }
    checkMatch() {
        const itemMatch = this.filteredData.some(this.findMatch);
        this.customValueFlag = this.allowCustomValues && !itemMatch;
    }
    manageRequiredAsterisk() {
        if (this.ngControl) {
            if (this.ngControl.control.validator) {
                // Run the validation with empty object to check if required is enabled.
                const error = this.ngControl.control.validator({});
                this.inputGroup.isRequired = error && error.required;
            }
            else {
                // P.M. 18 May 2022: IgxCombo's asterisk not removed when removing required validator dynamically in reactive form #11543
                this.inputGroup.isRequired = false;
            }
        }
    }
    /** Contains key-value pairs of the selected valueKeys and their resp. displayKeys */
    registerRemoteEntries(ids, add = true) {
        if (add) {
            const selection = this.getValueDisplayPairs(ids);
            for (const entry of selection) {
                this._remoteSelection[entry[this.valueKey]] = entry[this.displayKey];
            }
        }
        else {
            for (const entry of ids) {
                delete this._remoteSelection[entry];
            }
        }
    }
    /**
     * For `id: any[]` returns a mapped `{ [combo.valueKey]: any, [combo.displayKey]: any }[]`
     */
    getValueDisplayPairs(ids) {
        return this.data.filter(entry => ids.indexOf(entry[this.valueKey]) > -1).map(e => ({
            [this.valueKey]: e[this.valueKey],
            [this.displayKey]: e[this.displayKey]
        }));
    }
    getRemoteSelection(newSelection, oldSelection) {
        if (!newSelection.length) {
            // If new selection is empty, clear all items
            this.registerRemoteEntries(oldSelection, false);
            return '';
        }
        const removedItems = oldSelection.filter(e => newSelection.indexOf(e) < 0);
        const addedItems = newSelection.filter(e => oldSelection.indexOf(e) < 0);
        this.registerRemoteEntries(addedItems);
        this.registerRemoteEntries(removedItems, false);
        return Object.keys(this._remoteSelection).map(e => this._remoteSelection[e]).join(', ');
    }
}
IgxComboBaseDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboBaseDirective, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.IgxSelectionAPIService }, { token: i2.IgxComboAPIService }, { token: i3.IgxIconService }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }, { token: i0.Injector, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
IgxComboBaseDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxComboBaseDirective, inputs: { showSearchCaseIcon: "showSearchCaseIcon", overlaySettings: "overlaySettings", id: "id", width: "width", allowCustomValues: "allowCustomValues", itemsMaxHeight: "itemsMaxHeight", itemHeight: "itemHeight", itemsWidth: "itemsWidth", placeholder: "placeholder", data: "data", valueKey: "valueKey", displayKey: "displayKey", groupKey: "groupKey", groupSortingDirection: "groupSortingDirection", ariaLabelledBy: "ariaLabelledBy", disabled: "disabled", type: "type" }, outputs: { opening: "opening", opened: "opened", closing: "closing", closed: "closed", addition: "addition", searchInputUpdate: "searchInputUpdate", dataPreLoad: "dataPreLoad" }, host: { listeners: { "keydown.ArrowDown": "onArrowDown($event)", "keydown.Alt.ArrowDown": "onArrowDown($event)" }, properties: { "attr.id": "this.id", "style.width": "this.width", "attr.aria-labelledby": "this.ariaLabelledBy", "class.igx-combo": "this.cssClass", "attr.role": "this.role", "attr.aria-expanded": "this.ariaExpanded", "attr.aria-haspopup": "this.hasPopUp", "attr.aria-owns": "this.ariaOwns" } }, queries: [{ propertyName: "itemTemplate", first: true, predicate: IgxComboItemDirective, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: IgxComboHeaderDirective, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: IgxComboFooterDirective, descendants: true, read: TemplateRef }, { propertyName: "headerItemTemplate", first: true, predicate: IgxComboHeaderItemDirective, descendants: true, read: TemplateRef }, { propertyName: "addItemTemplate", first: true, predicate: IgxComboAddItemDirective, descendants: true, read: TemplateRef }, { propertyName: "emptyTemplate", first: true, predicate: IgxComboEmptyDirective, descendants: true, read: TemplateRef }, { propertyName: "toggleIconTemplate", first: true, predicate: IgxComboToggleIconDirective, descendants: true, read: TemplateRef }, { propertyName: "clearIconTemplate", first: true, predicate: IgxComboClearIconDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "inputGroup", first: true, predicate: ["inputGroup"], descendants: true, read: IgxInputGroupComponent, static: true }, { propertyName: "comboInput", first: true, predicate: ["comboInput"], descendants: true, read: IgxInputDirective, static: true }, { propertyName: "searchInput", first: true, predicate: ["searchInput"], descendants: true }, { propertyName: "virtualScrollContainer", first: true, predicate: IgxForOfDirective, descendants: true, static: true }, { propertyName: "virtDir", first: true, predicate: IgxForOfDirective, descendants: true, read: IgxForOfDirective, static: true }, { propertyName: "dropdownContainer", first: true, predicate: ["dropdownItemContainer"], descendants: true, static: true }, { propertyName: "primitiveTemplate", first: true, predicate: ["primitive"], descendants: true, read: TemplateRef, static: true }, { propertyName: "complexTemplate", first: true, predicate: ["complex"], descendants: true, read: TemplateRef, static: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboBaseDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.IgxSelectionAPIService }, { type: i2.IgxComboAPIService }, { type: i3.IgxIconService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_INPUT_GROUP_TYPE]
                }] }, { type: i0.Injector, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { showSearchCaseIcon: [{
                type: Input
            }], overlaySettings: [{
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], width: [{
                type: HostBinding,
                args: ['style.width']
            }, {
                type: Input
            }], allowCustomValues: [{
                type: Input
            }], itemsMaxHeight: [{
                type: Input
            }], itemHeight: [{
                type: Input
            }], itemsWidth: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], data: [{
                type: Input
            }], valueKey: [{
                type: Input
            }], displayKey: [{
                type: Input
            }], groupKey: [{
                type: Input
            }], groupSortingDirection: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-labelledby']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-combo']
            }], role: [{
                type: HostBinding,
                args: [`attr.role`]
            }], ariaExpanded: [{
                type: HostBinding,
                args: ['attr.aria-expanded']
            }], hasPopUp: [{
                type: HostBinding,
                args: ['attr.aria-haspopup']
            }], ariaOwns: [{
                type: HostBinding,
                args: ['attr.aria-owns']
            }], disabled: [{
                type: Input
            }], type: [{
                type: Input
            }], opening: [{
                type: Output
            }], opened: [{
                type: Output
            }], closing: [{
                type: Output
            }], closed: [{
                type: Output
            }], addition: [{
                type: Output
            }], searchInputUpdate: [{
                type: Output
            }], dataPreLoad: [{
                type: Output
            }], itemTemplate: [{
                type: ContentChild,
                args: [IgxComboItemDirective, { read: TemplateRef }]
            }], headerTemplate: [{
                type: ContentChild,
                args: [IgxComboHeaderDirective, { read: TemplateRef }]
            }], footerTemplate: [{
                type: ContentChild,
                args: [IgxComboFooterDirective, { read: TemplateRef }]
            }], headerItemTemplate: [{
                type: ContentChild,
                args: [IgxComboHeaderItemDirective, { read: TemplateRef }]
            }], addItemTemplate: [{
                type: ContentChild,
                args: [IgxComboAddItemDirective, { read: TemplateRef }]
            }], emptyTemplate: [{
                type: ContentChild,
                args: [IgxComboEmptyDirective, { read: TemplateRef }]
            }], toggleIconTemplate: [{
                type: ContentChild,
                args: [IgxComboToggleIconDirective, { read: TemplateRef }]
            }], clearIconTemplate: [{
                type: ContentChild,
                args: [IgxComboClearIconDirective, { read: TemplateRef }]
            }], inputGroup: [{
                type: ViewChild,
                args: ['inputGroup', { read: IgxInputGroupComponent, static: true }]
            }], comboInput: [{
                type: ViewChild,
                args: ['comboInput', { read: IgxInputDirective, static: true }]
            }], searchInput: [{
                type: ViewChild,
                args: ['searchInput']
            }], virtualScrollContainer: [{
                type: ViewChild,
                args: [IgxForOfDirective, { static: true }]
            }], virtDir: [{
                type: ViewChild,
                args: [IgxForOfDirective, { read: IgxForOfDirective, static: true }]
            }], dropdownContainer: [{
                type: ViewChild,
                args: ['dropdownItemContainer', { static: true }]
            }], primitiveTemplate: [{
                type: ViewChild,
                args: ['primitive', { read: TemplateRef, static: true }]
            }], complexTemplate: [{
                type: ViewChild,
                args: ['complex', { read: TemplateRef, static: true }]
            }], onArrowDown: [{
                type: HostListener,
                args: ['keydown.ArrowDown', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.Alt.ArrowDown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm8uY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NvbWJvL2NvbWJvLmNvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0gsWUFBWSxFQUNaLFNBQVMsRUFHVCxZQUFZLEVBQ1osV0FBVyxFQUNYLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUVkLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QyxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDbEUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBMEIsTUFBTSx3QkFBd0IsQ0FBQztBQUV6RyxPQUFPLEVBQThCLFVBQVUsRUFBbUQsTUFBTSxlQUFlLENBQUM7QUFDeEgsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDdkUsT0FBTyxFQUFlLGlCQUFpQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFFdkYsT0FBTyxFQUFxQixvQkFBb0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQW1CLE1BQU0sd0JBQXdCLENBQUM7QUFHdkcsT0FBTyxFQUNILHdCQUF3QixFQUFFLDBCQUEwQixFQUFFLHNCQUFz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QXNCekQsaUJBQWlCO3NCQUR2QixZQUFZO3VCQUFDLDBCQUEwQixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFLeEQsVUFBVTtzQkFEaEIsU0FBUzt1QkFBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFLaEUsVUFBVTtzQkFEaEIsU0FBUzt1QkFBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFLM0QsV0FBVztzQkFEakIsU0FBUzt1QkFBQyxhQUFhO2dCQUtqQixzQkFBc0I7c0JBRDVCLFNBQVM7dUJBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUlwQyxPQUFPO3NCQURoQixTQUFTO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBSTdELGlCQUFpQjtzQkFEMUIsU0FBUzt1QkFBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBSTFDLGlCQUFpQjtzQkFEMUIsU0FBUzt1QkFBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBSWpELGVBQWU7c0JBRHhCLFNBQVM7dUJBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQXVMbEQsV0FBVztzQkFGakIsWUFBWTt1QkFBQyxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7c0JBQzVDLFlBQVk7dUJBQUMsdUJBQXVCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29udGVudENoaWxkLFxuICAgIERpcmVjdGl2ZSxcbiAgICBEb0NoZWNrLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbmplY3QsXG4gICAgSW5qZWN0aW9uVG9rZW4sXG4gICAgSW5qZWN0b3IsXG4gICAgSW5wdXQsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPcHRpb25hbCxcbiAgICBPdXRwdXQsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgY2FzZVNlbnNpdGl2ZSB9IGZyb20gJ0BpZ25pdGV1aS9tYXRlcmlhbC1pY29ucy1leHRlbmRlZCc7XG5pbXBvcnQgeyBub29wLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBEaXNwbGF5RGVuc2l0eUJhc2UsIERpc3BsYXlEZW5zaXR5VG9rZW4sIElEaXNwbGF5RGVuc2l0eU9wdGlvbnMgfSBmcm9tICcuLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IElneFNlbGVjdGlvbkFQSVNlcnZpY2UgfSBmcm9tICcuLi9jb3JlL3NlbGVjdGlvbic7XG5pbXBvcnQgeyBDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncywgY2xvbmVBcnJheSwgSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncywgSUJhc2VFdmVudEFyZ3MgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IFNvcnRpbmdEaXJlY3Rpb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBJRm9yT2ZTdGF0ZSwgSWd4Rm9yT2ZEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2Zvci1vZi9mb3Jfb2YuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEljb25TZXJ2aWNlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneElucHV0R3JvdXBUeXBlLCBJR1hfSU5QVVRfR1JPVVBfVFlQRSB9IGZyb20gJy4uL2lucHV0LWdyb3VwL2lucHV0R3JvdXBUeXBlJztcbmltcG9ydCB7IElneElucHV0RGlyZWN0aXZlLCBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50LCBJZ3hJbnB1dFN0YXRlIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBBYnNvbHV0ZVNjcm9sbFN0cmF0ZWd5LCBBdXRvUG9zaXRpb25TdHJhdGVneSwgT3ZlcmxheVNldHRpbmdzIH0gZnJvbSAnLi4vc2VydmljZXMvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hDb21ib0Ryb3BEb3duQ29tcG9uZW50IH0gZnJvbSAnLi9jb21iby1kcm9wZG93bi5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4Q29tYm9BUElTZXJ2aWNlIH0gZnJvbSAnLi9jb21iby5hcGknO1xuaW1wb3J0IHtcbiAgICBJZ3hDb21ib0FkZEl0ZW1EaXJlY3RpdmUsIElneENvbWJvQ2xlYXJJY29uRGlyZWN0aXZlLCBJZ3hDb21ib0VtcHR5RGlyZWN0aXZlLFxuICAgIElneENvbWJvRm9vdGVyRGlyZWN0aXZlLCBJZ3hDb21ib0hlYWRlckRpcmVjdGl2ZSwgSWd4Q29tYm9IZWFkZXJJdGVtRGlyZWN0aXZlLCBJZ3hDb21ib0l0ZW1EaXJlY3RpdmUsIElneENvbWJvVG9nZ2xlSWNvbkRpcmVjdGl2ZVxufSBmcm9tICcuL2NvbWJvLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHtcbiAgICBJQ29tYm9GaWx0ZXJpbmdPcHRpb25zLCBJQ29tYm9JdGVtQWRkaXRpb25FdmVudCwgSUNvbWJvU2VhcmNoSW5wdXRFdmVudEFyZ3Ncbn0gZnJvbSAnLi9wdWJsaWNfYXBpJztcblxuZXhwb3J0IGNvbnN0IElHWF9DT01CT19DT01QT05FTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48SWd4Q29tYm9CYXNlPignSWd4Q29tYm9Db21wb25lbnRUb2tlbicpO1xuXG4vKiogQGhpZGRlbiBAaW50ZXJuYWwgVE9ETzogRXZhbHVhdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSWd4Q29tYm9CYXNlIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGRhdGE6IGFueVtdIHwgbnVsbDtcbiAgICB2YWx1ZUtleTogc3RyaW5nO1xuICAgIGdyb3VwS2V5OiBzdHJpbmc7XG4gICAgaXNSZW1vdGU6IGJvb2xlYW47XG4gICAgZmlsdGVyZWREYXRhOiBhbnlbXSB8IG51bGw7XG4gICAgdG90YWxJdGVtQ291bnQ6IG51bWJlcjtcbiAgICBpdGVtc01heEhlaWdodDogbnVtYmVyO1xuICAgIGl0ZW1IZWlnaHQ6IG51bWJlcjtcbiAgICBzZWFyY2hWYWx1ZTogc3RyaW5nO1xuICAgIHNlYXJjaElucHV0OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuICAgIGNvbWJvSW5wdXQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG4gICAgb3BlbmVkOiBFdmVudEVtaXR0ZXI8SUJhc2VFdmVudEFyZ3M+O1xuICAgIG9wZW5pbmc6IEV2ZW50RW1pdHRlcjxDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncz47XG4gICAgY2xvc2luZzogRXZlbnRFbWl0dGVyPENhbmNlbGFibGVCcm93c2VyRXZlbnRBcmdzPjtcbiAgICBjbG9zZWQ6IEV2ZW50RW1pdHRlcjxJQmFzZUV2ZW50QXJncz47XG4gICAgZm9jdXNTZWFyY2hJbnB1dChvcGVuaW5nPzogYm9vbGVhbik6IHZvaWQ7XG4gICAgdHJpZ2dlckNoZWNrKCk6IHZvaWQ7XG4gICAgYWRkSXRlbVRvQ29sbGVjdGlvbigpOiB2b2lkO1xuICAgIGlzQWRkQnV0dG9uVmlzaWJsZSgpOiBib29sZWFuO1xuICAgIGhhbmRsZUlucHV0Q2hhbmdlKGV2ZW50Pzogc3RyaW5nKTogdm9pZDtcbiAgICBpc0l0ZW1TZWxlY3RlZChpdGVtSUQ6IGFueSk6IGJvb2xlYW47XG4gICAgc2VsZWN0KGl0ZW06IGFueSk6IHZvaWQ7XG4gICAgc2VsZWN0KGl0ZW1JRHM6IGFueVtdLCBjbGVhclNlbGVjdGlvbj86IGJvb2xlYW4sIGV2ZW50PzogRXZlbnQpOiB2b2lkO1xuICAgIGRlc2VsZWN0KC4uLmFyZ3M6IFtdIHwgW2l0ZW1JRHM6IGFueVtdLCBldmVudD86IEV2ZW50XSk6IHZvaWQ7XG59XG5cbmxldCBORVhUX0lEID0gMDtcblxuLyoqXG4gKiBAaGlkZGVuXG4gKiBUaGUgZGVmYXVsdCBudW1iZXIgb2YgaXRlbXMgdGhhdCBzaG91bGQgYmUgaW4gdGhlIGNvbWJvJ3NcbiAqIGRyb3AtZG93biBsaXN0IGlmIG5vIGBbaXRlbXNNYXhIZWlnaHRdYCBpcyBzcGVjaWZpZWRcbiAqL1xuY29uc3QgaXRlbXNJbkNvbnRhaW5lciA9IDEwOyAvLyBUT0RPOiBtYWtlIHByaXZhdGUgcmVhZG9ubHlcblxuLyoqIEBoaWRkZW4gQGludGVybmFsICovXG5jb25zdCBJdGVtSGVpZ2h0cyA9IHtcbiAgICBjb21mb3J0YWJsZTogNDAsXG4gICAgY29zeTogMzIsXG4gICAgY29tcGFjdDogMjgsXG59O1xuXG4vKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBlbnVtIERhdGFUeXBlcyB7XG4gICAgRU1QVFkgPSAnZW1wdHknLFxuICAgIFBSSU1JVElWRSA9ICdwcmltaXRpdmUnLFxuICAgIENPTVBMRVggPSAnY29tcGxleCcsXG4gICAgUFJJTUFSWUtFWSA9ICd2YWx1ZUtleSdcbn1cblxuZXhwb3J0IGVudW0gSWd4Q29tYm9TdGF0ZSB7XG4gICAgLyoqXG4gICAgICogQ29tYm8gd2l0aCBpbml0aWFsIHN0YXRlLlxuICAgICAqL1xuICAgIElOSVRJQUwgPSBJZ3hJbnB1dFN0YXRlLklOSVRJQUwsXG4gICAgLyoqXG4gICAgICogQ29tYm8gd2l0aCB2YWxpZCBzdGF0ZS5cbiAgICAgKi9cbiAgICBWQUxJRCA9IElneElucHV0U3RhdGUuVkFMSUQsXG4gICAgLyoqXG4gICAgICogQ29tYm8gd2l0aCBpbnZhbGlkIHN0YXRlLlxuICAgICAqL1xuICAgIElOVkFMSUQgPSBJZ3hJbnB1dFN0YXRlLklOVkFMSURcbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSWd4Q29tYm9CYXNlRGlyZWN0aXZlIGV4dGVuZHMgRGlzcGxheURlbnNpdHlCYXNlIGltcGxlbWVudHMgSWd4Q29tYm9CYXNlLCBPbkluaXQsIERvQ2hlY2ssXG4gICAgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSBjYXNlU2Vuc2l0aXZlIGljb24gc2hvdWxkIGJlIHNob3duIGluIHRoZSBzZWFyY2ggaW5wdXRcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbXlDb21ib1Nob3dTZWFyY2hDYXNlSWNvbiA9IHRoaXMuY29tYm8uc2hvd1NlYXJjaENhc2VJY29uO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LWNvbWJvIFtzaG93U2VhcmNoQ2FzZUljb25dPSd0cnVlJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzaG93U2VhcmNoQ2FzZUljb24gPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFNldCBjdXN0b20gb3ZlcmxheSBzZXR0aW5ncyB0aGF0IGNvbnRyb2wgaG93IHRoZSBjb21ibydzIGxpc3Qgb2YgaXRlbXMgaXMgZGlzcGxheWVkLlxuICAgICAqIFNldDpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb21ibyBbb3ZlcmxheVNldHRpbmdzXSA9IFwiY3VzdG9tT3ZlcmxheVNldHRpbmdzXCI+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGNvbnN0IGN1c3RvbVNldHRpbmdzID0geyBwb3NpdGlvblN0cmF0ZWd5OiB7IHNldHRpbmdzOiB7IHRhcmdldDogbXlUYXJnZXQgfSB9IH07XG4gICAgICogIGNvbWJvLm92ZXJsYXlTZXR0aW5ncyA9IGN1c3RvbVNldHRpbmdzO1xuICAgICAqIGBgYFxuICAgICAqIEdldCBhbnkgY3VzdG9tIG92ZXJsYXkgc2V0dGluZ3MgdXNlZCBieSB0aGUgY29tYm86XG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICBjb25zdCBjb21ib092ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0gbXlDb21iby5vdmVybGF5U2V0dGluZ3M7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgb3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3MgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9nZXRzIGNvbWJvIGlkLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBpZCA9IHRoaXMuY29tYm8uaWQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtY29tYm8gW2lkXT0nY29tYm8xJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlkID0gYGlneC1jb21iby0ke05FWFRfSUQrK31gO1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3R5bGUgd2lkdGggb2YgdGhlIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbXlDb21ib1dpZHRoID0gdGhpcy5jb21iby53aWR0aDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tc2V0LS0+XG4gICAgICogPGlneC1jb21ibyBbd2lkdGhdPScyNTBweCc+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgd2lkdGg6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENvbnRyb2xzIHdoZXRoZXIgY3VzdG9tIHZhbHVlcyBjYW4gYmUgYWRkZWQgdG8gdGhlIGNvbGxlY3Rpb25cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgY29tYm9BbGxvd3NDdXN0b21WYWx1ZXMgPSB0aGlzLmNvbWJvLmFsbG93Q3VzdG9tVmFsdWVzO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LWNvbWJvIFthbGxvd0N1c3RvbVZhbHVlc109J3RydWUnPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGFsbG93Q3VzdG9tVmFsdWVzID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmVzIHRoZSBkcm9wIGRvd24gbGlzdCBoZWlnaHRcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbXlDb21ib0l0ZW1zTWF4SGVpZ2h0ID0gdGhpcy5jb21iby5pdGVtc01heEhlaWdodDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tc2V0LS0+XG4gICAgICogPGlneC1jb21ibyBbaXRlbXNNYXhIZWlnaHRdPSczMjAnPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBpdGVtc01heEhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5faXRlbXNNYXhIZWlnaHQgPT09IG51bGwgfHwgdGhpcy5faXRlbXNNYXhIZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbUhlaWdodCAqIGl0ZW1zSW5Db250YWluZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zTWF4SGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaXRlbXNNYXhIZWlnaHQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5faXRlbXNNYXhIZWlnaHQgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlcyB0aGUgZHJvcCBkb3duIGxpc3QgaXRlbSBoZWlnaHRcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbXlDb21ib0l0ZW1IZWlnaHQgPSB0aGlzLmNvbWJvLml0ZW1IZWlnaHQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtY29tYm8gW2l0ZW1IZWlnaHRdPSczMic+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGl0ZW1IZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1IZWlnaHQgPT09IG51bGwgfHwgdGhpcy5faXRlbUhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gSXRlbUhlaWdodHNbdGhpcy5kaXNwbGF5RGVuc2l0eV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1IZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBpdGVtSGVpZ2h0KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2l0ZW1IZWlnaHQgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlcyB0aGUgZHJvcCBkb3duIGxpc3Qgd2lkdGhcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbXlDb21ib0l0ZW1zV2lkdGggPSB0aGlzLmNvbWJvLml0ZW1zV2lkdGg7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtY29tYm8gW2l0ZW1zV2lkdGhdID0gJ1wiMTgwcHhcIic+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaXRlbXNXaWR0aDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB0aGUgcGxhY2Vob2xkZXIgdmFsdWUgZm9yIHRoZSBjb21ibyB2YWx1ZSBmaWVsZFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteUNvbWJvUGxhY2Vob2xkZXIgPSB0aGlzLmNvbWJvLnBsYWNlaG9sZGVyO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LWNvbWJvIFtwbGFjZWhvbGRlcl09J25ld1BsYWNlSG9sZGVyJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ29tYm8gZGF0YSBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtY29tYm8gW2RhdGFdPSdpdGVtcyc+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55W10gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgZGF0YSh2YWw6IGFueVtdIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9kYXRhID0gKHZhbCkgPyB2YWwgOiBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoaWNoIGNvbHVtbiBpbiB0aGUgZGF0YSBzb3VyY2UgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteUNvbWJvVmFsdWVLZXkgPSB0aGlzLmNvbWJvLnZhbHVlS2V5O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aWd4LWNvbWJvIFt2YWx1ZUtleV09J215S2V5Jz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB2YWx1ZUtleTogc3RyaW5nID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBkaXNwbGF5S2V5KHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlLZXkgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGljaCBjb2x1bW4gaW4gdGhlIGRhdGEgc291cmNlIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBkaXNwbGF5IHZhbHVlLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteUNvbWJvRGlzcGxheUtleSA9IHRoaXMuY29tYm8uZGlzcGxheUtleTtcbiAgICAgKlxuICAgICAqIC8vIHNldFxuICAgICAqIHRoaXMuY29tYm8uZGlzcGxheUtleSA9ICd2YWwnO1xuICAgICAqXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtY29tYm8gW2Rpc3BsYXlLZXldPSdteURpc3BsYXlLZXknPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGlzcGxheUtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BsYXlLZXkgPyB0aGlzLl9kaXNwbGF5S2V5IDogdGhpcy52YWx1ZUtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaXRlbSBwcm9wZXJ0eSBieSB3aGljaCBpdGVtcyBzaG91bGQgYmUgZ3JvdXBlZCBpbnNpZGUgdGhlIGl0ZW1zIGxpc3QuIE5vdCB1c2FibGUgaWYgZGF0YSBpcyBub3Qgb2YgdHlwZSBPYmplY3RbXS5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tc2V0LS0+XG4gICAgICogPGlneC1jb21ibyBbZ3JvdXBLZXldPSduZXdHcm91cEtleSc+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGdyb3VwS2V5KHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2dyb3VwS2V5ID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBpdGVtIHByb3BlcnR5IGJ5IHdoaWNoIGl0ZW1zIHNob3VsZCBiZSBncm91cGVkIGluc2lkZSB0aGUgaXRlbXMgbGlzdC4gTm90IHVzYWJsZSBpZiBkYXRhIGlzIG5vdCBvZiB0eXBlIE9iamVjdFtdLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBjdXJyZW50R3JvdXBLZXkgPSB0aGlzLmNvbWJvLmdyb3VwS2V5O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZ3JvdXBLZXkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwS2V5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgZ3JvdXBzIHNvcnRpbmcgb3JkZXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbWJvIFtncm91cFNvcnRpbmdEaXJlY3Rpb25dPVwiZ3JvdXBTb3J0aW5nRGlyZWN0aW9uXCI+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBncm91cFNvcnRpbmdEaXJlY3Rpb24gPSBTb3J0aW5nRGlyZWN0aW9uLkFzYztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZ3JvdXBTb3J0aW5nRGlyZWN0aW9uKCk6IFNvcnRpbmdEaXJlY3Rpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdXBTb3J0aW5nRGlyZWN0aW9uO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGdyb3VwU29ydGluZ0RpcmVjdGlvbih2YWw6IFNvcnRpbmdEaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fZ3JvdXBTb3J0aW5nRGlyZWN0aW9uID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldCBhcmlhLWxhYmVsbGVkYnkgYXR0cmlidXRlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29tYm8gW2FyaWFMYWJlbGxlZEJ5XT1cIidsYWJlbDEnXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sYWJlbGxlZGJ5JylcbiAgICBwdWJsaWMgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWNvbWJvJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LWNvbWJvJzsgLy8gSW5kZXBlbmRlbnQgb2YgZGlzcGxheSBkZW5zaXR5IGZvciB0aGUgdGltZSBiZWluZ1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKGBhdHRyLnJvbGVgKVxuICAgIHB1YmxpYyByb2xlID0gJ2NvbWJvYm94JztcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWV4cGFuZGVkJylcbiAgICBwdWJsaWMgZ2V0IGFyaWFFeHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmRyb3Bkb3duLmNvbGxhcHNlZDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1oYXNwb3B1cCcpXG4gICAgcHVibGljIGdldCBoYXNQb3BVcCgpIHtcbiAgICAgICAgcmV0dXJuICdsaXN0Ym94JztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1vd25zJylcbiAgICBwdWJsaWMgZ2V0IGFyaWFPd25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5pZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBlbmFibGVkL2Rpc2FibGVzIGNvbWJvLiBUaGUgZGVmYXVsdCBpcyBgZmFsc2VgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbWJvIFtkaXNhYmxlZF09XCIndHJ1ZSdcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyBob3cgdGhlIGNvbWJvIHdpbGwgYmUgc3R5bGVkLlxuICAgICAqIFRoZSBhbGxvd2VkIHZhbHVlcyBhcmUgYGxpbmVgLCBgYm94YCwgYGJvcmRlcmAgYW5kIGBzZWFyY2hgLiBUaGUgZGVmYXVsdCBpcyBgYm94YC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb21ibyBbdHlwZV09XCInbGluZSdcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBJZ3hJbnB1dEdyb3VwVHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlIHx8IHRoaXMuX2lucHV0R3JvdXBUeXBlIHx8ICdib3gnO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgdHlwZSh2YWw6IElneElucHV0R3JvdXBUeXBlKSB7XG4gICAgICAgIHRoaXMuX3R5cGUgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBiZWZvcmUgdGhlIGRyb3Bkb3duIGlzIG9wZW5lZFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29tYm8gb3BlbmluZz0naGFuZGxlT3BlbmluZygkZXZlbnQpJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb3BlbmluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgdGhlIGRyb3Bkb3duIGlzIG9wZW5lZFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29tYm8gKG9wZW5lZCk9J2hhbmRsZU9wZW5lZCgkZXZlbnQpJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb3BlbmVkID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYmVmb3JlIHRoZSBkcm9wZG93biBpcyBjbG9zZWRcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbWJvIChjbG9zaW5nKT0naGFuZGxlQ2xvc2luZygkZXZlbnQpJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgdGhlIGRyb3Bkb3duIGlzIGNsb3NlZFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29tYm8gKGNsb3NlZCk9J2hhbmRsZUNsb3NlZCgkZXZlbnQpJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBhbiBpdGVtIGlzIGJlaW5nIGFkZGVkIHRvIHRoZSBkYXRhIGNvbGxlY3Rpb25cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbWJvIChhZGRpdGlvbik9J2hhbmRsZUFkZGl0aW9uRXZlbnQoJGV2ZW50KSc+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGFkZGl0aW9uID0gbmV3IEV2ZW50RW1pdHRlcjxJQ29tYm9JdGVtQWRkaXRpb25FdmVudD4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgdmFsdWUgb2YgdGhlIHNlYXJjaCBpbnB1dCBjaGFuZ2VzIChlLmcuIHR5cGluZywgcGFzdGluZywgY2xlYXIsIGV0Yy4pXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb21ibyAoc2VhcmNoSW5wdXRVcGRhdGUpPSdoYW5kbGVTZWFyY2hJbnB1dEV2ZW50KCRldmVudCknPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBzZWFyY2hJbnB1dFVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbWJvU2VhcmNoSW5wdXRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gbmV3IGNodW5rIG9mIGRhdGEgaXMgbG9hZGVkIGZyb20gdGhlIHZpcnR1YWxpemF0aW9uXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jb21ibyAoZGF0YVByZUxvYWQpPSdoYW5kbGVEYXRhUHJlbG9hZEV2ZW50KCRldmVudCknPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBkYXRhUHJlTG9hZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUZvck9mU3RhdGU+KCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tIHRlbXBsYXRlLCBpZiBhbnksIHRoYXQgc2hvdWxkIGJlIHVzZWQgd2hlbiByZW5kZXJpbmcgSVRFTVMgaW4gdGhlIGNvbWJvIGxpc3RcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBTZXQgaW4gdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBteUNvbXBvbmVudC5jdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBteUNvbXBvbmVudC5jb21iby5pdGVtVGVtcGxhdGUgPSBteUN1c3RvbVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCBpbiBtYXJrdXAgLS0+XG4gICAgICogIDxpZ3gtY29tYm8gI2NvbWJvPlxuICAgICAqICAgICAgLi4uXG4gICAgICogICAgICA8bmctdGVtcGxhdGUgaWd4Q29tYm9JdGVtPlxuICAgICAqICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXN0b20taXRlbVwiIGxldC1pdGVtIGxldC1rZXk9XCJ2YWx1ZUtleVwiPlxuICAgICAqICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3VzdG9tLWl0ZW1fX25hbWVcIj57eyBpdGVtW2tleV0gfX08L2Rpdj5cbiAgICAgKiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImN1c3RvbS1pdGVtX19jb3N0XCI+e3sgaXRlbS5jb3N0IH19PC9kaXY+XG4gICAgICogICAgICAgICAgPC9kaXY+XG4gICAgICogICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAqICA8L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneENvbWJvSXRlbURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBIRUFERVIgZm9yIHRoZSBjb21ibyBpdGVtcyBsaXN0XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gU2V0IGluIHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbXlDb21wb25lbnQuY3VzdG9tVGVtcGxhdGU7XG4gICAgICogbXlDb21wb25lbnQuY29tYm8uaGVhZGVyVGVtcGxhdGUgPSBteUN1c3RvbVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCBpbiBtYXJrdXAgLS0+XG4gICAgICogIDxpZ3gtY29tYm8gI2NvbWJvPlxuICAgICAqICAgICAgLi4uXG4gICAgICogICAgICA8bmctdGVtcGxhdGUgaWd4Q29tYm9IZWFkZXI+XG4gICAgICogICAgICAgICAgPGRpdiBjbGFzcz1cImNvbWJvX19oZWFkZXJcIj5cbiAgICAgKiAgICAgICAgICAgICAgVGhpcyBpcyBhIGN1c3RvbSBoZWFkZXJcbiAgICAgKiAgICAgICAgICA8L2Rpdj5cbiAgICAgKiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogIDwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4Q29tYm9IZWFkZXJEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBGT09URVIgZm9yIHRoZSBjb21ibyBpdGVtcyBsaXN0XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gU2V0IGluIHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbXlDb21wb25lbnQuY3VzdG9tVGVtcGxhdGU7XG4gICAgICogbXlDb21wb25lbnQuY29tYm8uZm9vdGVyVGVtcGxhdGUgPSBteUN1c3RvbVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCBpbiBtYXJrdXAgLS0+XG4gICAgICogIDxpZ3gtY29tYm8gI2NvbWJvPlxuICAgICAqICAgICAgLi4uXG4gICAgICogICAgICA8bmctdGVtcGxhdGUgaWd4Q29tYm9Gb290ZXI+XG4gICAgICogICAgICAgICAgPGRpdiBjbGFzcz1cImNvbWJvX19mb290ZXJcIj5cbiAgICAgKiAgICAgICAgICAgICAgVGhpcyBpcyBhIGN1c3RvbSBmb290ZXJcbiAgICAgKiAgICAgICAgICA8L2Rpdj5cbiAgICAgKiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogIDwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4Q29tYm9Gb290ZXJEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIEhFQURFUiBJVEVNUyBmb3IgZ3JvdXBzIGluIHRoZSBjb21ibyBsaXN0XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gU2V0IGluIHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbXlDb21wb25lbnQuY3VzdG9tVGVtcGxhdGU7XG4gICAgICogbXlDb21wb25lbnQuY29tYm8uaGVhZGVySXRlbVRlbXBsYXRlID0gbXlDdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLSBTZXQgaW4gbWFya3VwIC0tPlxuICAgICAqICA8aWd4LWNvbWJvICNjb21ibz5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICAgICAgPG5nLXRlbXBsYXRlIGlneENvbWJvSGVhZGVySXRlbSBsZXQtaXRlbSBsZXQta2V5PVwiZ3JvdXBLZXlcIj5cbiAgICAgKiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3VzdG9tLWl0ZW0tLWdyb3VwXCI+R3JvdXAgaGVhZGVyIGZvciB7eyBpdGVtW2tleV0gfX08L2Rpdj5cbiAgICAgKiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogIDwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4Q29tYm9IZWFkZXJJdGVtRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGhlYWRlckl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tIHRlbXBsYXRlLCBpZiBhbnksIHRoYXQgc2hvdWxkIGJlIHVzZWQgd2hlbiByZW5kZXJpbmcgdGhlIEFERCBCVVRUT04gaW4gdGhlIGNvbWJvIGRyb3AgZG93blxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIFNldCBpbiB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG15Q29tcG9uZW50LmN1c3RvbVRlbXBsYXRlO1xuICAgICAqIG15Q29tcG9uZW50LmNvbWJvLmFkZEl0ZW1UZW1wbGF0ZSA9IG15Q3VzdG9tVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS0gU2V0IGluIG1hcmt1cCAtLT5cbiAgICAgKiAgPGlneC1jb21ibyAjY29tYm8+XG4gICAgICogICAgICAuLi5cbiAgICAgKiAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hDb21ib0FkZEl0ZW0+XG4gICAgICogICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNvbWJvX19hZGQtYnV0dG9uXCI+XG4gICAgICogICAgICAgICAgICAgIENsaWNrIHRvIGFkZCBpdGVtXG4gICAgICogICAgICAgICAgPC9idXR0b24+XG4gICAgICogICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAqICA8L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneENvbWJvQWRkSXRlbURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBhZGRJdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBBREQgQlVUVE9OIGluIHRoZSBjb21ibyBkcm9wIGRvd25cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBTZXQgaW4gdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG15Q3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBteUNvbXBvbmVudC5jdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBteUNvbXBvbmVudC5jb21iby5lbXB0eVRlbXBsYXRlID0gbXlDdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLSBTZXQgaW4gbWFya3VwIC0tPlxuICAgICAqICA8aWd4LWNvbWJvICNjb21ibz5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICAgICAgPG5nLXRlbXBsYXRlIGlneENvbWJvRW1wdHk+XG4gICAgICogICAgICAgICAgPGRpdiBjbGFzcz1cImNvbWJvLS1lbXB0eVwiPlxuICAgICAqICAgICAgICAgICAgICBUaGVyZSBhcmUgbm8gaXRlbXMgdG8gZGlzcGxheVxuICAgICAqICAgICAgICAgIDwvZGl2PlxuICAgICAqICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiAgPC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hDb21ib0VtcHR5RGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGVtcHR5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBjb21ibyBUT0dHTEUob3Blbi9jbG9zZSkgYnV0dG9uXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gU2V0IGluIHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbXlDb21wb25lbnQuY3VzdG9tVGVtcGxhdGU7XG4gICAgICogbXlDb21wb25lbnQuY29tYm8udG9nZ2xlSWNvblRlbXBsYXRlID0gbXlDdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLSBTZXQgaW4gbWFya3VwIC0tPlxuICAgICAqICA8aWd4LWNvbWJvICNjb21ibz5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICAgICAgPG5nLXRlbXBsYXRlIGlneENvbWJvVG9nZ2xlSWNvbiBsZXQtY29sbGFwc2VkPlxuICAgICAqICAgICAgICAgIDxpZ3gtaWNvbj57eyBjb2xsYXBzZWQgPyAncmVtb3ZlX2NpcmNsZScgOiAncmVtb3ZlX2NpcmNsZV9vdXRsaW5lJ319PC9pZ3gtaWNvbj5cbiAgICAgKiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogIDwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4Q29tYm9Ub2dnbGVJY29uRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIHRvZ2dsZUljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tIHRlbXBsYXRlLCBpZiBhbnksIHRoYXQgc2hvdWxkIGJlIHVzZWQgd2hlbiByZW5kZXJpbmcgdGhlIGNvbWJvIENMRUFSIGJ1dHRvblxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIFNldCBpbiB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG15Q29tcG9uZW50LmN1c3RvbVRlbXBsYXRlO1xuICAgICAqIG15Q29tcG9uZW50LmNvbWJvLmNsZWFySWNvblRlbXBsYXRlID0gbXlDdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLSBTZXQgaW4gbWFya3VwIC0tPlxuICAgICAqICA8aWd4LWNvbWJvICNjb21ibz5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICAgICAgPG5nLXRlbXBsYXRlIGlneENvbWJvQ2xlYXJJY29uPlxuICAgICAqICAgICAgICAgIDxpZ3gtaWNvbj5jbGVhcjwvaWd4LWljb24+XG4gICAgICogICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAqICA8L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneENvbWJvQ2xlYXJJY29uRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGNsZWFySWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ2lucHV0R3JvdXAnLCB7IHJlYWQ6IElneElucHV0R3JvdXBDb21wb25lbnQsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBpbnB1dEdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50O1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQFZpZXdDaGlsZCgnY29tYm9JbnB1dCcsIHsgcmVhZDogSWd4SW5wdXREaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBjb21ib0lucHV0OiBJZ3hJbnB1dERpcmVjdGl2ZTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ3NlYXJjaElucHV0JylcbiAgICBwdWJsaWMgc2VhcmNoSW5wdXQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4gPSBudWxsO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQFZpZXdDaGlsZChJZ3hGb3JPZkRpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgdmlydHVhbFNjcm9sbENvbnRhaW5lcjogSWd4Rm9yT2ZEaXJlY3RpdmU8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoSWd4Rm9yT2ZEaXJlY3RpdmUsIHsgcmVhZDogSWd4Rm9yT2ZEaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCB2aXJ0RGlyOiBJZ3hGb3JPZkRpcmVjdGl2ZTxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnZHJvcGRvd25JdGVtQ29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZHJvcGRvd25Db250YWluZXI6IEVsZW1lbnRSZWYgPSBudWxsO1xuXG4gICAgQFZpZXdDaGlsZCgncHJpbWl0aXZlJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIHByaW1pdGl2ZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnY29tcGxleCcsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBjb21wbGV4VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHNlYXJjaFZhbHVlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWFyY2hWYWx1ZTtcbiAgICB9XG4gICAgcHVibGljIHNldCBzZWFyY2hWYWx1ZSh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLmZpbHRlclZhbHVlID0gdmFsO1xuICAgICAgICB0aGlzLl9zZWFyY2hWYWx1ZSA9IHZhbDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IGlzUmVtb3RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3RhbEl0ZW1Db3VudCA+IDAgJiZcbiAgICAgICAgICAgIHRoaXMudmFsdWVLZXkgJiZcbiAgICAgICAgICAgIHRoaXMuZGF0YVR5cGUgPT09IERhdGFUeXBlcy5DT01QTEVYO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgZGF0YVR5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheUtleSkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGFUeXBlcy5DT01QTEVYO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBEYXRhVHlwZXMuUFJJTUlUSVZFO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgaWYgY29udHJvbCBpcyB2YWxpZCwgd2hlbiB1c2VkIGluIGEgZm9ybVxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCB2YWxpZCA9IHRoaXMuY29tYm8udmFsaWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB2YWxpZCgpOiBJZ3hDb21ib1N0YXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgaWYgY29udHJvbCBpcyB2YWxpZCwgd2hlbiB1c2VkIGluIGEgZm9ybVxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIHNldFxuICAgICAqIHRoaXMuY29tYm8udmFsaWQgPSBJZ3hDb21ib1N0YXRlLklOVkFMSUQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCB2YWxpZCh2YWxpZDogSWd4Q29tYm9TdGF0ZSkge1xuICAgICAgICB0aGlzLl92YWxpZCA9IHZhbGlkO1xuICAgICAgICB0aGlzLmNvbWJvSW5wdXQudmFsaWQgPSBJZ3hJbnB1dFN0YXRlW0lneENvbWJvU3RhdGVbdmFsaWRdXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgaW4gdGhlIGNvbWJvIGlucHV0XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0XG4gICAgICogbGV0IGNvbWJvVmFsdWUgPSB0aGlzLmNvbWJvLnZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHZpcnR1YWxpemVkIGRhdGEuIEl0IGNvbnRhaW5zIGBzdGFydEluZGV4YCBhbmQgYGNodW5rU2l6ZWBcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgc3RhdGUgPSB0aGlzLmNvbWJvLnZpcnR1YWxpemF0aW9uU3RhdGU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB2aXJ0dWFsaXphdGlvblN0YXRlKCk6IElGb3JPZlN0YXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlydERpci5zdGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdmlydHVhbGl6ZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBzZXRcbiAgICAgKiB0aGlzLmNvbWJvLnZpcnR1YWxpemF0aW9uU3RhdGUoc3RhdGUpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgdmlydHVhbGl6YXRpb25TdGF0ZShzdGF0ZTogSUZvck9mU3RhdGUpIHtcbiAgICAgICAgdGhpcy52aXJ0RGlyLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBkcm9wIGRvd24gc3RhdGUuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHN0YXRlID0gdGhpcy5jb21iby5jb2xsYXBzZWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBjb2xsYXBzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLmNvbGxhcHNlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRvdGFsIGNvdW50IG9mIHRoZSB2aXJ0dWFsIGRhdGEgaXRlbXMsIHdoZW4gdXNpbmcgcmVtb3RlIHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0XG4gICAgICogbGV0IGNvdW50ID0gdGhpcy5jb21iby50b3RhbEl0ZW1Db3VudDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRvdGFsSXRlbUNvdW50KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpcnREaXIudG90YWxJdGVtQ291bnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdG90YWwgY291bnQgb2YgdGhlIHZpcnR1YWwgZGF0YSBpdGVtcywgd2hlbiB1c2luZyByZW1vdGUgc2VydmljZS5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBzZXRcbiAgICAgKiB0aGlzLmNvbWJvLnRvdGFsSXRlbUNvdW50KHJlbW90ZVNlcnZpY2UuY291bnQpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgdG90YWxJdGVtQ291bnQoY291bnQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLnZpcnREaXIudG90YWxJdGVtQ291bnQgPSBjb3VudDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICB0aGlzLl9kYXRhVHlwZSA9IHRoaXMuZGF0YVR5cGU7XG4gICAgICAgIGlmICh0aGlzLml0ZW1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbVRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9kYXRhVHlwZSA9PT0gRGF0YVR5cGVzLkNPTVBMRVgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBsZXhUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgY3VzdG9tVmFsdWVGbGFnID0gdHJ1ZTtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZmlsdGVyVmFsdWUgPSAnJztcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZGVmYXVsdEZhbGxiYWNrR3JvdXAgPSAnT3RoZXInO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBmaWx0ZXJpbmdPcHRpb25zOiBJQ29tYm9GaWx0ZXJpbmdPcHRpb25zID0ge1xuICAgICAgICBjYXNlU2Vuc2l0aXZlOiBmYWxzZVxuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgX2RhdGEgPSBbXTtcbiAgICBwcm90ZWN0ZWQgX3ZhbHVlID0gJyc7XG4gICAgcHJvdGVjdGVkIF9ncm91cEtleSA9ICcnO1xuICAgIHByb3RlY3RlZCBfc2VhcmNoVmFsdWUgPSAnJztcbiAgICBwcm90ZWN0ZWQgX2ZpbHRlcmVkRGF0YSA9IFtdO1xuICAgIHByb3RlY3RlZCBfZGlzcGxheUtleTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBfcmVtb3RlU2VsZWN0aW9uID0ge307XG4gICAgcHJvdGVjdGVkIF92YWxpZCA9IElneENvbWJvU3RhdGUuSU5JVElBTDtcbiAgICBwcm90ZWN0ZWQgbmdDb250cm9sOiBOZ0NvbnRyb2wgPSBudWxsO1xuICAgIHByb3RlY3RlZCBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcbiAgICBwcm90ZWN0ZWQgX29uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuXG4gICAgcHJpdmF0ZSBfdHlwZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGF0YVR5cGUgPSAnJztcbiAgICBwcml2YXRlIF9pdGVtSGVpZ2h0ID0gbnVsbDtcbiAgICBwcml2YXRlIF9pdGVtc01heEhlaWdodCA9IG51bGw7XG4gICAgcHJpdmF0ZSBfb3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3M7XG4gICAgcHJpdmF0ZSBfZ3JvdXBTb3J0aW5nRGlyZWN0aW9uOiBTb3J0aW5nRGlyZWN0aW9uID0gU29ydGluZ0RpcmVjdGlvbi5Bc2M7XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgZHJvcGRvd246IElneENvbWJvRHJvcERvd25Db21wb25lbnQ7XG5cbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2VsZWN0aW9uQ2hhbmdpbmc6IEV2ZW50RW1pdHRlcjxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcm90ZWN0ZWQgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdGlvblNlcnZpY2U6IElneFNlbGVjdGlvbkFQSVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBjb21ib0FQSTogSWd4Q29tYm9BUElTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgX2ljb25TZXJ2aWNlOiBJZ3hJY29uU2VydmljZSxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9uczogSURpc3BsYXlEZW5zaXR5T3B0aW9ucyxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChJR1hfSU5QVVRfR1JPVVBfVFlQRSkgcHJvdGVjdGVkIF9pbnB1dEdyb3VwVHlwZTogSWd4SW5wdXRHcm91cFR5cGUsXG4gICAgICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBfaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgICAgIHN1cGVyKF9kaXNwbGF5RGVuc2l0eU9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uQXJyb3dEb3duJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLkFsdC5BcnJvd0Rvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbkFycm93RG93bihldmVudDogRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5uZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQ8TmdDb250cm9sPihOZ0NvbnRyb2wsIG51bGwpO1xuICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX292ZXJsYXlTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0RWxlbWVudCxcbiAgICAgICAgICAgIHNjcm9sbFN0cmF0ZWd5OiBuZXcgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICAgICAgcG9zaXRpb25TdHJhdGVneTogbmV3IEF1dG9Qb3NpdGlvblN0cmF0ZWd5KCksXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICAgICAgZXhjbHVkZUZyb21PdXRzaWRlQ2xpY2s6IFt0YXJnZXRFbGVtZW50IGFzIEhUTUxFbGVtZW50XVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2V0KHRoaXMuaWQsIG5ldyBTZXQoKSk7XG4gICAgICAgIHRoaXMuX2ljb25TZXJ2aWNlLmFkZFN2Z0ljb25Gcm9tVGV4dChjYXNlU2Vuc2l0aXZlLm5hbWUsIGNhc2VTZW5zaXRpdmUudmFsdWUsICdpbXgtaWNvbnMnKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IFsuLi50aGlzLmRhdGFdO1xuXG4gICAgICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgICAgICAgdGhpcy5uZ0NvbnRyb2wuc3RhdHVzQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKHRoaXMub25TdGF0dXNDaGFuZ2VkKTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlUmVxdWlyZWRBc3RlcmlzaygpO1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlydERpci5jaHVua1ByZWxvYWQucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZTogSUZvck9mU3RhdGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50QXJnczogSUZvck9mU3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBlLCB7IG93bmVyOiB0aGlzIH0pO1xuICAgICAgICAgICAgdGhpcy5kYXRhUHJlTG9hZC5lbWl0KGV2ZW50QXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICAgICAgdGhpcy5jb21ib0FQSS5jbGVhcigpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuY2xlYXIodGhpcy5pZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgdGhhdCBvcGVucy9jbG9zZXMgdGhlIGNvbWJvLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxidXR0b24gKGNsaWNrKT1cImNvbWJvLnRvZ2dsZSgpXCI+VG9nZ2xlIENvbWJvPC9idXR0b24+XG4gICAgICogPGlneC1jb21ibyAjY29tYm8+PC9pZ3gtY29tYm8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fb3ZlcmxheVNldHRpbmdzLCB0aGlzLm92ZXJsYXlTZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuZHJvcGRvd24udG9nZ2xlKG92ZXJsYXlTZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgdGhhdCBvcGVucyB0aGUgY29tYm8uXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGJ1dHRvbiAoY2xpY2spPVwiY29tYm8ub3BlbigpXCI+T3BlbiBDb21ibzwvYnV0dG9uPlxuICAgICAqIDxpZ3gtY29tYm8gI2NvbWJvPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBvdmVybGF5U2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9vdmVybGF5U2V0dGluZ3MsIHRoaXMub3ZlcmxheVNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5kcm9wZG93bi5vcGVuKG92ZXJsYXlTZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgdGhhdCBjbG9zZXMgdGhlIGNvbWJvLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxidXR0b24gKGNsaWNrKT1cImNvbWJvLmNsb3NlKClcIj5DbG9zZSBDb21ibzwvYnV0dG9uPlxuICAgICAqIDxpZ3gtY29tYm8gI2NvbWJvPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bi5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24gb24gdGhlIGNvbWJvIHZpZXdcbiAgICAgKi9cbiAgICBwdWJsaWMgdHJpZ2dlckNoZWNrKCkge1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgc2VsZWN0aW9uIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBzZWxlY3RlZCBpdGVtc1xuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbXlTZWxlY3Rpb24gPSB0aGlzLmNvbWJvLnNlbGVjdGlvbjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGlvbigpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKHRoaXMuc2VsZWN0aW9uU2VydmljZS5nZXQodGhpcy5pZCkpO1xuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGUgc3BlY2lmaWVkIGl0ZW1JRCBpcyBzZWxlY3RlZFxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBpc0l0ZW1TZWxlY3RlZChpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uU2VydmljZS5pc19pdGVtX3NlbGVjdGVkKHRoaXMuaWQsIGl0ZW0pO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBhZGRJdGVtVG9Db2xsZWN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2VhcmNoVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuc2VhcmNoVmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBhZGRlZEl0ZW0gPSB0aGlzLmRpc3BsYXlLZXkgPyB7XG4gICAgICAgICAgICBbdGhpcy52YWx1ZUtleV06IG5ld1ZhbHVlLFxuICAgICAgICAgICAgW3RoaXMuZGlzcGxheUtleV06IG5ld1ZhbHVlXG4gICAgICAgIH0gOiBuZXdWYWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuZ3JvdXBLZXkpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oYWRkZWRJdGVtLCB7IFt0aGlzLmdyb3VwS2V5XTogdGhpcy5kZWZhdWx0RmFsbGJhY2tHcm91cCB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBleHBvc2Ugc2hhbGxvdyBjb3B5IGluc3RlYWQgb2YgdGhpcy5kYXRhIGluIGV2ZW50IGFyZ3Mgc28gdGhpcy5kYXRhIGNhbid0IGJlIG11dGF0ZWRcbiAgICAgICAgY29uc3Qgb2xkQ29sbGVjdGlvbiA9IFsuLi50aGlzLmRhdGFdO1xuICAgICAgICBjb25zdCBuZXdDb2xsZWN0aW9uID0gWy4uLnRoaXMuZGF0YSwgYWRkZWRJdGVtXTtcbiAgICAgICAgY29uc3QgYXJnczogSUNvbWJvSXRlbUFkZGl0aW9uRXZlbnQgPSB7XG4gICAgICAgICAgICBvbGRDb2xsZWN0aW9uLCBhZGRlZEl0ZW0sIG5ld0NvbGxlY3Rpb24sIG93bmVyOiB0aGlzLCBjYW5jZWw6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkaXRpb24uZW1pdChhcmdzKTtcbiAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhLnB1c2goYXJncy5hZGRlZEl0ZW0pO1xuICAgICAgICAvLyB0cmlnZ2VyIHJlLXJlbmRlclxuICAgICAgICB0aGlzLmRhdGEgPSBjbG9uZUFycmF5KHRoaXMuZGF0YSk7XG4gICAgICAgIHRoaXMuc2VsZWN0KHRoaXMudmFsdWVLZXkgIT09IG51bGwgJiYgdGhpcy52YWx1ZUtleSAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgICAgIFthcmdzLmFkZGVkSXRlbVt0aGlzLnZhbHVlS2V5XV0gOiBbYXJncy5hZGRlZEl0ZW1dLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY3VzdG9tVmFsdWVGbGFnID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2VhcmNoSW5wdXQ/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5kcm9wZG93bi5mb2N1c2VkSXRlbSA9IG51bGw7XG4gICAgICAgIHRoaXMudmlydERpci5zY3JvbGxUbygwKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaXNBZGRCdXR0b25WaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBUaGlzIHNob3VsZCBhbHdheXMgcmV0dXJuIGEgYm9vbGVhbiB2YWx1ZS4gSWYgdGhpcy5zZWFyY2hWYWx1ZSB3YXMgJycsIGl0IHJldHVybnMgJycgaW5zdGVhZCBvZiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoVmFsdWUgIT09ICcnICYmIHRoaXMuY3VzdG9tVmFsdWVGbGFnO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBoYW5kbGVJbnB1dENoYW5nZShldmVudD86IGFueSkge1xuICAgICAgICBpZiAoZXZlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXJnczogSUNvbWJvU2VhcmNoSW5wdXRFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoVGV4dDogdHlwZW9mIGV2ZW50ID09PSAnc3RyaW5nJyA/IGV2ZW50IDogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0VXBkYXRlLmVtaXQoYXJncyk7XG4gICAgICAgICAgICBpZiAoYXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlclZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoZWNrTWF0Y2goKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyc1xuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVPcGVuaW5nKGU6IElCYXNlQ2FuY2VsYWJsZUJyb3dzZXJFdmVudEFyZ3MpIHtcbiAgICAgICAgY29uc3QgYXJnczogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIGV2ZW50OiBlLmV2ZW50LCBjYW5jZWw6IGUuY2FuY2VsIH07XG4gICAgICAgIHRoaXMub3BlbmluZy5lbWl0KGFyZ3MpO1xuICAgICAgICBlLmNhbmNlbCA9IGFyZ3MuY2FuY2VsO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBoYW5kbGVDbG9zaW5nKGU6IElCYXNlQ2FuY2VsYWJsZUJyb3dzZXJFdmVudEFyZ3MpIHtcbiAgICAgICAgY29uc3QgYXJnczogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIGV2ZW50OiBlLmV2ZW50LCBjYW5jZWw6IGUuY2FuY2VsIH07XG4gICAgICAgIHRoaXMuY2xvc2luZy5lbWl0KGFyZ3MpO1xuICAgICAgICBlLmNhbmNlbCA9IGFyZ3MuY2FuY2VsO1xuICAgICAgICBpZiAoZS5jYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlYXJjaFZhbHVlID0gJyc7XG4gICAgICAgIGlmICghZS5ldmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb21ib0lucHV0Py5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaGFuZGxlQ2xvc2VkKCkge1xuICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KHsgb3duZXI6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnIHx8IGV2ZW50LmtleSA9PT0gJ1VwJykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG9uQmx1cigpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMubmdDb250cm9sICYmIHRoaXMubmdDb250cm9sLmludmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkID0gSWd4Q29tYm9TdGF0ZS5JTlZBTElEO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkID0gSWd4Q29tYm9TdGF0ZS5JTklUSUFMO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHRvZ2dsZUNhc2VTZW5zaXRpdmUoKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nT3B0aW9ucyA9IHsgY2FzZVNlbnNpdGl2ZTogIXRoaXMuZmlsdGVyaW5nT3B0aW9ucy5jYXNlU2Vuc2l0aXZlIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdHVzQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCh0aGlzLm5nQ29udHJvbC5jb250cm9sLnRvdWNoZWQgfHwgdGhpcy5uZ0NvbnRyb2wuY29udHJvbC5kaXJ0eSkgJiZcbiAgICAgICAgICAgICh0aGlzLm5nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvciB8fCB0aGlzLm5nQ29udHJvbC5jb250cm9sLmFzeW5jVmFsaWRhdG9yKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbGxhcHNlZCB8fCB0aGlzLmlucHV0R3JvdXAuaXNGb2N1c2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWxpZCA9IHRoaXMubmdDb250cm9sLmludmFsaWQgPyBJZ3hDb21ib1N0YXRlLklOVkFMSUQgOiBJZ3hDb21ib1N0YXRlLlZBTElEO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkID0gdGhpcy5uZ0NvbnRyb2wuaW52YWxpZCA/IElneENvbWJvU3RhdGUuSU5WQUxJRCA6IElneENvbWJvU3RhdGUuSU5JVElBTDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEIuUC4gMTggTWF5IDIwMjE6IElneERhdGVQaWNrZXIgZG9lcyBub3QgcmVzZXQgaXRzIHN0YXRlIHVwb24gcmVzZXRGb3JtICM5NTI2XG4gICAgICAgICAgICB0aGlzLnZhbGlkID0gSWd4Q29tYm9TdGF0ZS5JTklUSUFMO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFuYWdlUmVxdWlyZWRBc3RlcmlzaygpO1xuICAgIH07XG5cbiAgICAvKiogaWYgdGhlcmUgaXMgYSB2YWx1ZUtleSAtIG1hcCB0aGUga2V5cyB0byBkYXRhIGl0ZW1zLCBlbHNlIC0ganVzdCByZXR1cm4gdGhlIGtleXMgKi9cbiAgICBwcm90ZWN0ZWQgY29udmVydEtleXNUb0l0ZW1zKGtleXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbWJvQVBJLnZhbHVlS2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgfVxuICAgICAgICAvLyBtYXAga2V5cyB2cy4gZmlsdGVyIGRhdGEgdG8gcmV0YWluIHRoZSBvcmRlciBvZiB0aGUgc2VsZWN0ZWQgaXRlbXNcbiAgICAgICAgcmV0dXJuIGtleXMubWFwKGtleSA9PiB0aGlzLmRhdGEuZmluZChlbnRyeSA9PiBlbnRyeVt0aGlzLnZhbHVlS2V5XSA9PT0ga2V5KSkuZmlsdGVyKGUgPT4gZSAhPT0gdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2hlY2tNYXRjaCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXRlbU1hdGNoID0gdGhpcy5maWx0ZXJlZERhdGEuc29tZSh0aGlzLmZpbmRNYXRjaCk7XG4gICAgICAgIHRoaXMuY3VzdG9tVmFsdWVGbGFnID0gdGhpcy5hbGxvd0N1c3RvbVZhbHVlcyAmJiAhaXRlbU1hdGNoO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmaW5kTWF0Y2ggPSAoZWxlbWVudDogYW55KTogYm9vbGVhbiA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kaXNwbGF5S2V5ID8gZWxlbWVudFt0aGlzLmRpc3BsYXlLZXldIDogZWxlbWVudDtcbiAgICAgICAgcmV0dXJuIHZhbHVlPy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuc2VhcmNoVmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBtYW5hZ2VSZXF1aXJlZEFzdGVyaXNrKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvcikge1xuICAgICAgICAgICAgICAgIC8vIFJ1biB0aGUgdmFsaWRhdGlvbiB3aXRoIGVtcHR5IG9iamVjdCB0byBjaGVjayBpZiByZXF1aXJlZCBpcyBlbmFibGVkLlxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gdGhpcy5uZ0NvbnRyb2wuY29udHJvbC52YWxpZGF0b3Ioe30gYXMgQWJzdHJhY3RDb250cm9sKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0R3JvdXAuaXNSZXF1aXJlZCA9IGVycm9yICYmIGVycm9yLnJlcXVpcmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBQLk0uIDE4IE1heSAyMDIyOiBJZ3hDb21ibydzIGFzdGVyaXNrIG5vdCByZW1vdmVkIHdoZW4gcmVtb3ZpbmcgcmVxdWlyZWQgdmFsaWRhdG9yIGR5bmFtaWNhbGx5IGluIHJlYWN0aXZlIGZvcm0gIzExNTQzXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwLmlzUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBDb250YWlucyBrZXktdmFsdWUgcGFpcnMgb2YgdGhlIHNlbGVjdGVkIHZhbHVlS2V5cyBhbmQgdGhlaXIgcmVzcC4gZGlzcGxheUtleXMgKi9cbiAgICBwcm90ZWN0ZWQgcmVnaXN0ZXJSZW1vdGVFbnRyaWVzKGlkczogYW55W10sIGFkZCA9IHRydWUpIHtcbiAgICAgICAgaWYgKGFkZCkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5nZXRWYWx1ZURpc3BsYXlQYWlycyhpZHMpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdGVTZWxlY3Rpb25bZW50cnlbdGhpcy52YWx1ZUtleV1dID0gZW50cnlbdGhpcy5kaXNwbGF5S2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgaWRzKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3JlbW90ZVNlbGVjdGlvbltlbnRyeV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb3IgYGlkOiBhbnlbXWAgcmV0dXJucyBhIG1hcHBlZCBgeyBbY29tYm8udmFsdWVLZXldOiBhbnksIFtjb21iby5kaXNwbGF5S2V5XTogYW55IH1bXWBcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0VmFsdWVEaXNwbGF5UGFpcnMoaWRzOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmZpbHRlcihlbnRyeSA9PiBpZHMuaW5kZXhPZihlbnRyeVt0aGlzLnZhbHVlS2V5XSkgPiAtMSkubWFwKGUgPT4gKHtcbiAgICAgICAgICAgIFt0aGlzLnZhbHVlS2V5XTogZVt0aGlzLnZhbHVlS2V5XSxcbiAgICAgICAgICAgIFt0aGlzLmRpc3BsYXlLZXldOiBlW3RoaXMuZGlzcGxheUtleV1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRSZW1vdGVTZWxlY3Rpb24obmV3U2VsZWN0aW9uOiBhbnlbXSwgb2xkU2VsZWN0aW9uOiBhbnlbXSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghbmV3U2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gSWYgbmV3IHNlbGVjdGlvbiBpcyBlbXB0eSwgY2xlYXIgYWxsIGl0ZW1zXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyUmVtb3RlRW50cmllcyhvbGRTZWxlY3Rpb24sIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW1vdmVkSXRlbXMgPSBvbGRTZWxlY3Rpb24uZmlsdGVyKGUgPT4gbmV3U2VsZWN0aW9uLmluZGV4T2YoZSkgPCAwKTtcbiAgICAgICAgY29uc3QgYWRkZWRJdGVtcyA9IG5ld1NlbGVjdGlvbi5maWx0ZXIoZSA9PiBvbGRTZWxlY3Rpb24uaW5kZXhPZihlKSA8IDApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyUmVtb3RlRW50cmllcyhhZGRlZEl0ZW1zKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclJlbW90ZUVudHJpZXMocmVtb3ZlZEl0ZW1zLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9yZW1vdGVTZWxlY3Rpb24pLm1hcChlID0+IHRoaXMuX3JlbW90ZVNlbGVjdGlvbltlXSkuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0IGZpbHRlcmVkRGF0YSgpOiBhbnlbXSB8IG51bGw7XG4gICAgcHVibGljIGFic3RyYWN0IHNldCBmaWx0ZXJlZERhdGEodmFsOiBhbnlbXSB8IG51bGwpO1xuXG4gICAgcHVibGljIGFic3RyYWN0IGhhbmRsZU9wZW5lZCgpO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBmb2N1c1NlYXJjaElucHV0KG9wZW5pbmc/OiBib29sZWFuKTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZWxlY3QobmV3SXRlbTogYW55KTogdm9pZDtcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2VsZWN0KG5ld0l0ZW1zOiBBcnJheTxhbnk+IHwgYW55LCBjbGVhckN1cnJlbnRTZWxlY3Rpb24/OiBib29sZWFuLCBldmVudD86IEV2ZW50KTogdm9pZDtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXNlbGVjdCguLi5hcmdzOiBbXSB8IFtpdGVtczogQXJyYXk8YW55PiwgZXZlbnQ/OiBFdmVudF0pOiB2b2lkO1xuXG4gICAgcHVibGljIGFic3RyYWN0IHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgc2V0U2VsZWN0aW9uKG5ld1NlbGVjdGlvbjogU2V0PGFueT4sIGV2ZW50PzogRXZlbnQpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBjcmVhdGVEaXNwbGF5VGV4dChuZXdTZWxlY3Rpb246IGFueVtdLCBvbGRTZWxlY3Rpb246IGFueVtdKTtcbn1cbiJdfQ==