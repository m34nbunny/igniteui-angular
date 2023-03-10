import { AfterViewInit, ChangeDetectorRef, DoCheck, ElementRef, EventEmitter, InjectionToken, Injector, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { DisplayDensityBase, IDisplayDensityOptions } from '../core/displayDensity';
import { IgxSelectionAPIService } from '../core/selection';
import { CancelableBrowserEventArgs, IBaseCancelableBrowserEventArgs, IBaseEventArgs } from '../core/utils';
import { SortingDirection } from '../data-operations/sorting-strategy';
import { IForOfState, IgxForOfDirective } from '../directives/for-of/for_of.directive';
import { IgxIconService } from '../icon/public_api';
import { IgxInputGroupType } from '../input-group/inputGroupType';
import { IgxInputDirective, IgxInputGroupComponent } from '../input-group/public_api';
import { OverlaySettings } from '../services/public_api';
import { IgxComboDropDownComponent } from './combo-dropdown.component';
import { IgxComboAPIService } from './combo.api';
import { IComboFilteringOptions, IComboItemAdditionEvent, IComboSearchInputEventArgs } from './public_api';
import * as i0 from "@angular/core";
export declare const IGX_COMBO_COMPONENT: InjectionToken<IgxComboBase>;
/** @hidden @internal TODO: Evaluate */
export interface IgxComboBase {
    id: string;
    data: any[] | null;
    valueKey: string;
    groupKey: string;
    isRemote: boolean;
    filteredData: any[] | null;
    totalItemCount: number;
    itemsMaxHeight: number;
    itemHeight: number;
    searchValue: string;
    searchInput: ElementRef<HTMLInputElement>;
    comboInput: ElementRef<HTMLInputElement>;
    opened: EventEmitter<IBaseEventArgs>;
    opening: EventEmitter<CancelableBrowserEventArgs>;
    closing: EventEmitter<CancelableBrowserEventArgs>;
    closed: EventEmitter<IBaseEventArgs>;
    focusSearchInput(opening?: boolean): void;
    triggerCheck(): void;
    addItemToCollection(): void;
    isAddButtonVisible(): boolean;
    handleInputChange(event?: string): void;
    isItemSelected(itemID: any): boolean;
    select(item: any): void;
    select(itemIDs: any[], clearSelection?: boolean, event?: Event): void;
    deselect(...args: [] | [itemIDs: any[], event?: Event]): void;
}
/** @hidden @internal */
export declare enum DataTypes {
    EMPTY = "empty",
    PRIMITIVE = "primitive",
    COMPLEX = "complex",
    PRIMARYKEY = "valueKey"
}
export declare enum IgxComboState {
    /**
     * Combo with initial state.
     */
    INITIAL = 0,
    /**
     * Combo with valid state.
     */
    VALID = 1,
    /**
     * Combo with invalid state.
     */
    INVALID = 2
}
export declare abstract class IgxComboBaseDirective extends DisplayDensityBase implements IgxComboBase, OnInit, DoCheck, AfterViewInit, OnDestroy, ControlValueAccessor {
    protected elementRef: ElementRef;
    protected cdr: ChangeDetectorRef;
    protected selectionService: IgxSelectionAPIService;
    protected comboAPI: IgxComboAPIService;
    protected _iconService: IgxIconService;
    protected _displayDensityOptions: IDisplayDensityOptions;
    protected _inputGroupType: IgxInputGroupType;
    protected _injector: Injector;
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
    showSearchCaseIcon: boolean;
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
    overlaySettings: OverlaySettings;
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
    id: string;
    /**
     * Sets the style width of the element
     *
     * ```typescript
     * // get
     * let myComboWidth = this.combo.width;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-combo [width]='250px'></igx-combo>
     * ```
     */
    width: string;
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
    allowCustomValues: boolean;
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
    get itemsMaxHeight(): number;
    set itemsMaxHeight(val: number);
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
    get itemHeight(): number;
    set itemHeight(val: number);
    /**
     * Configures the drop down list width
     *
     * ```typescript
     * // get
     * let myComboItemsWidth = this.combo.itemsWidth;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-combo [itemsWidth] = '"180px"'></igx-combo>
     * ```
     */
    itemsWidth: string;
    /**
     * Defines the placeholder value for the combo value field
     *
     * ```typescript
     * // get
     * let myComboPlaceholder = this.combo.placeholder;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-combo [placeholder]='newPlaceHolder'></igx-combo>
     * ```
     */
    placeholder: string;
    /**
     * Combo data source.
     *
     * ```html
     * <!--set-->
     * <igx-combo [data]='items'></igx-combo>
     * ```
     */
    get data(): any[] | null;
    set data(val: any[] | null);
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
    valueKey: string;
    set displayKey(val: string);
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
    get displayKey(): string;
    /**
     * The item property by which items should be grouped inside the items list. Not usable if data is not of type Object[].
     *
     * ```html
     * <!--set-->
     * <igx-combo [groupKey]='newGroupKey'></igx-combo>
     * ```
     */
    set groupKey(val: string);
    /**
     * The item property by which items should be grouped inside the items list. Not usable if data is not of type Object[].
     *
     * ```typescript
     * // get
     * let currentGroupKey = this.combo.groupKey;
     * ```
     */
    get groupKey(): string;
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
    get groupSortingDirection(): SortingDirection;
    set groupSortingDirection(val: SortingDirection);
    /**
     * An @Input property that set aria-labelledby attribute
     * ```html
     * <igx-combo [ariaLabelledBy]="'label1'">
     * ```
     */
    ariaLabelledBy: string;
    /** @hidden @internal */
    cssClass: string;
    /** @hidden @internal */
    role: string;
    /** @hidden @internal */
    get ariaExpanded(): boolean;
    /** @hidden @internal */
    get hasPopUp(): string;
    /** @hidden @internal */
    get ariaOwns(): string;
    /**
     * An @Input property that enabled/disables combo. The default is `false`.
     * ```html
     * <igx-combo [disabled]="'true'">
     * ```
     */
    disabled: boolean;
    /**
     * An @Input property that sets how the combo will be styled.
     * The allowed values are `line`, `box`, `border` and `search`. The default is `box`.
     * ```html
     * <igx-combo [type]="'line'">
     * ```
     */
    get type(): IgxInputGroupType;
    set type(val: IgxInputGroupType);
    /**
     * Emitted before the dropdown is opened
     *
     * ```html
     * <igx-combo opening='handleOpening($event)'></igx-combo>
     * ```
     */
    opening: EventEmitter<IBaseCancelableBrowserEventArgs>;
    /**
     * Emitted after the dropdown is opened
     *
     * ```html
     * <igx-combo (opened)='handleOpened($event)'></igx-combo>
     * ```
     */
    opened: EventEmitter<IBaseEventArgs>;
    /**
     * Emitted before the dropdown is closed
     *
     * ```html
     * <igx-combo (closing)='handleClosing($event)'></igx-combo>
     * ```
     */
    closing: EventEmitter<IBaseCancelableBrowserEventArgs>;
    /**
     * Emitted after the dropdown is closed
     *
     * ```html
     * <igx-combo (closed)='handleClosed($event)'></igx-combo>
     * ```
     */
    closed: EventEmitter<IBaseEventArgs>;
    /**
     * Emitted when an item is being added to the data collection
     *
     * ```html
     * <igx-combo (addition)='handleAdditionEvent($event)'></igx-combo>
     * ```
     */
    addition: EventEmitter<IComboItemAdditionEvent>;
    /**
     * Emitted when the value of the search input changes (e.g. typing, pasting, clear, etc.)
     *
     * ```html
     * <igx-combo (searchInputUpdate)='handleSearchInputEvent($event)'></igx-combo>
     * ```
     */
    searchInputUpdate: EventEmitter<IComboSearchInputEventArgs>;
    /**
     * Emitted when new chunk of data is loaded from the virtualization
     *
     * ```html
     * <igx-combo (dataPreLoad)='handleDataPreloadEvent($event)'></igx-combo>
     * ```
     */
    dataPreLoad: EventEmitter<IForOfState>;
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
    itemTemplate: TemplateRef<any>;
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
    headerTemplate: TemplateRef<any>;
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
    footerTemplate: TemplateRef<any>;
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
    headerItemTemplate: TemplateRef<any>;
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
    addItemTemplate: TemplateRef<any>;
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
    emptyTemplate: TemplateRef<any>;
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
    toggleIconTemplate: TemplateRef<any>;
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
    clearIconTemplate: TemplateRef<any>;
    /** @hidden @internal */
    inputGroup: IgxInputGroupComponent;
    /** @hidden @internal */
    comboInput: IgxInputDirective;
    /** @hidden @internal */
    searchInput: ElementRef<HTMLInputElement>;
    /** @hidden @internal */
    virtualScrollContainer: IgxForOfDirective<any>;
    protected virtDir: IgxForOfDirective<any>;
    protected dropdownContainer: ElementRef;
    protected primitiveTemplate: TemplateRef<any>;
    protected complexTemplate: TemplateRef<any>;
    /** @hidden @internal */
    get searchValue(): string;
    set searchValue(val: string);
    /** @hidden @internal */
    get isRemote(): boolean;
    /** @hidden @internal */
    get dataType(): string;
    /**
     * Gets if control is valid, when used in a form
     *
     * ```typescript
     * // get
     * let valid = this.combo.valid;
     * ```
     */
    get valid(): IgxComboState;
    /**
     * Sets if control is valid, when used in a form
     *
     * ```typescript
     * // set
     * this.combo.valid = IgxComboState.INVALID;
     * ```
     */
    set valid(valid: IgxComboState);
    /**
     * The text displayed in the combo input
     *
     * ```typescript
     * // get
     * let comboValue = this.combo.value;
     * ```
     */
    get value(): string;
    /**
     * Defines the current state of the virtualized data. It contains `startIndex` and `chunkSize`
     *
     * ```typescript
     * // get
     * let state = this.combo.virtualizationState;
     * ```
     */
    get virtualizationState(): IForOfState;
    /**
     * Sets the current state of the virtualized data.
     *
     * ```typescript
     * // set
     * this.combo.virtualizationState(state);
     * ```
     */
    set virtualizationState(state: IForOfState);
    /**
     * Gets drop down state.
     *
     * ```typescript
     * let state = this.combo.collapsed;
     * ```
     */
    get collapsed(): boolean;
    /**
     * Gets total count of the virtual data items, when using remote service.
     *
     * ```typescript
     * // get
     * let count = this.combo.totalItemCount;
     * ```
     */
    get totalItemCount(): number;
    /**
     * Sets total count of the virtual data items, when using remote service.
     *
     * ```typescript
     * // set
     * this.combo.totalItemCount(remoteService.count);
     * ```
     */
    set totalItemCount(count: number);
    /** @hidden @internal */
    get template(): TemplateRef<any>;
    /** @hidden @internal */
    customValueFlag: boolean;
    /** @hidden @internal */
    filterValue: string;
    /** @hidden @internal */
    defaultFallbackGroup: string;
    /** @hidden @internal */
    filteringOptions: IComboFilteringOptions;
    protected _data: any[];
    protected _value: string;
    protected _groupKey: string;
    protected _searchValue: string;
    protected _filteredData: any[];
    protected _displayKey: string;
    protected _remoteSelection: {};
    protected _valid: IgxComboState;
    protected ngControl: NgControl;
    protected destroy$: Subject<any>;
    protected _onTouchedCallback: () => void;
    protected _onChangeCallback: (_: any) => void;
    private _type;
    private _dataType;
    private _itemHeight;
    private _itemsMaxHeight;
    private _overlaySettings;
    private _groupSortingDirection;
    abstract dropdown: IgxComboDropDownComponent;
    abstract selectionChanging: EventEmitter<any>;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, selectionService: IgxSelectionAPIService, comboAPI: IgxComboAPIService, _iconService: IgxIconService, _displayDensityOptions: IDisplayDensityOptions, _inputGroupType: IgxInputGroupType, _injector: Injector);
    /** @hidden @internal */
    onArrowDown(event: Event): void;
    /** @hidden @internal */
    ngOnInit(): void;
    /** @hidden @internal */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /**
     * A method that opens/closes the combo.
     *
     * ```html
     * <button (click)="combo.toggle()">Toggle Combo</button>
     * <igx-combo #combo></igx-combo>
     * ```
     */
    toggle(): void;
    /**
     * A method that opens the combo.
     *
     * ```html
     * <button (click)="combo.open()">Open Combo</button>
     * <igx-combo #combo></igx-combo>
     * ```
     */
    open(): void;
    /**
     * A method that closes the combo.
     *
     * ```html
     * <button (click)="combo.close()">Close Combo</button>
     * <igx-combo #combo></igx-combo>
     * ```
     */
    close(): void;
    /**
     * Triggers change detection on the combo view
     */
    triggerCheck(): void;
    /**
     * Get current selection state
     *
     * @returns Array of selected items
     * ```typescript
     * let mySelection = this.combo.selection;
     * ```
     */
    get selection(): any[];
    /**
     * Returns if the specified itemID is selected
     *
     * @hidden
     * @internal
     */
    isItemSelected(item: any): boolean;
    /** @hidden @internal */
    addItemToCollection(): void;
    /** @hidden @internal */
    isAddButtonVisible(): boolean;
    /** @hidden @internal */
    handleInputChange(event?: any): void;
    /**
     * Event handlers
     *
     * @hidden
     * @internal
     */
    handleOpening(e: IBaseCancelableBrowserEventArgs): void;
    /** @hidden @internal */
    handleClosing(e: IBaseCancelableBrowserEventArgs): void;
    /** @hidden @internal */
    handleClosed(): void;
    /** @hidden @internal */
    handleKeyDown(event: KeyboardEvent): void;
    /** @hidden @internal */
    registerOnChange(fn: any): void;
    /** @hidden @internal */
    registerOnTouched(fn: any): void;
    /** @hidden @internal */
    setDisabledState(isDisabled: boolean): void;
    /** @hidden @internal */
    onClick(event: Event): void;
    /** @hidden @internal */
    onBlur(): void;
    /** @hidden @internal */
    toggleCaseSensitive(): void;
    protected onStatusChanged: () => void;
    /** if there is a valueKey - map the keys to data items, else - just return the keys */
    protected convertKeysToItems(keys: any[]): any[];
    protected checkMatch(): void;
    protected findMatch: (element: any) => boolean;
    protected manageRequiredAsterisk(): void;
    /** Contains key-value pairs of the selected valueKeys and their resp. displayKeys */
    protected registerRemoteEntries(ids: any[], add?: boolean): void;
    /**
     * For `id: any[]` returns a mapped `{ [combo.valueKey]: any, [combo.displayKey]: any }[]`
     */
    protected getValueDisplayPairs(ids: any[]): {
        [x: string]: any;
    }[];
    protected getRemoteSelection(newSelection: any[], oldSelection: any[]): string;
    abstract get filteredData(): any[] | null;
    abstract set filteredData(val: any[] | null);
    abstract handleOpened(): any;
    abstract focusSearchInput(opening?: boolean): any;
    abstract select(newItem: any): void;
    abstract select(newItems: Array<any> | any, clearCurrentSelection?: boolean, event?: Event): void;
    abstract deselect(...args: [] | [items: Array<any>, event?: Event]): void;
    abstract writeValue(value: any): void;
    protected abstract setSelection(newSelection: Set<any>, event?: Event): void;
    protected abstract createDisplayText(newSelection: any[], oldSelection: any[]): any;
    static ??fac: i0.????FactoryDeclaration<IgxComboBaseDirective, [null, null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<IgxComboBaseDirective, never, never, { "showSearchCaseIcon": "showSearchCaseIcon"; "overlaySettings": "overlaySettings"; "id": "id"; "width": "width"; "allowCustomValues": "allowCustomValues"; "itemsMaxHeight": "itemsMaxHeight"; "itemHeight": "itemHeight"; "itemsWidth": "itemsWidth"; "placeholder": "placeholder"; "data": "data"; "valueKey": "valueKey"; "displayKey": "displayKey"; "groupKey": "groupKey"; "groupSortingDirection": "groupSortingDirection"; "ariaLabelledBy": "ariaLabelledBy"; "disabled": "disabled"; "type": "type"; }, { "opening": "opening"; "opened": "opened"; "closing": "closing"; "closed": "closed"; "addition": "addition"; "searchInputUpdate": "searchInputUpdate"; "dataPreLoad": "dataPreLoad"; }, ["itemTemplate", "headerTemplate", "footerTemplate", "headerItemTemplate", "addItemTemplate", "emptyTemplate", "toggleIconTemplate", "clearIconTemplate"]>;
}
