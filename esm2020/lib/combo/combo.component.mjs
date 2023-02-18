import { CommonModule } from '@angular/common';
import { Component, NgModule, Optional, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IgxComboItemDirective, IgxComboEmptyDirective, IgxComboHeaderItemDirective, IgxComboHeaderDirective, IgxComboFooterDirective, IgxComboAddItemDirective, IgxComboToggleIconDirective, IgxComboClearIconDirective } from './combo.directives';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IgxCheckboxModule } from '../checkbox/checkbox.component';
import { IgxStringFilteringOperand, IgxBooleanFilteringOperand } from '../data-operations/filtering-condition';
import { FilteringLogic } from '../data-operations/filtering-expression.interface';
import { IgxForOfModule } from '../directives/for-of/for_of.directive';
import { IgxIconModule } from '../icon/public_api';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxDropDownModule } from '../drop-down/public_api';
import { IgxInputGroupModule } from '../input-group/input-group.component';
import { IgxComboItemComponent } from './combo-item.component';
import { IgxComboDropDownComponent } from './combo-dropdown.component';
import { IgxComboCleanPipe, IgxComboFilteringPipe, IgxComboGroupingPipe } from './combo.pipes';
import { DisplayDensityToken } from '../core/density';
import { IGX_COMBO_COMPONENT, IgxComboBaseDirective } from './combo.common';
import { IgxComboAddItemComponent } from './combo-add-item.component';
import { IgxComboAPIService } from './combo.api';
import { IGX_INPUT_GROUP_TYPE } from '../input-group/public_api';
import * as i0 from "@angular/core";
import * as i1 from "../core/selection";
import * as i2 from "./combo.api";
import * as i3 from "../icon/public_api";
import * as i4 from "../input-group/input-group.component";
import * as i5 from "../icon/icon.component";
import * as i6 from "../directives/input/input.directive";
import * as i7 from "@angular/common";
import * as i8 from "../directives/suffix/suffix.directive";
import * as i9 from "@angular/forms";
import * as i10 from "../drop-down/drop-down-navigation.directive";
import * as i11 from "../directives/for-of/for_of.directive";
import * as i12 from "../directives/button/button.directive";
import * as i13 from "../directives/ripple/ripple.directive";
/**
 * When called with sets A & B, returns A - B (as array);
 *
 * @hidden
 */
const diffInSets = (set1, set2) => {
    const results = [];
    set1.forEach(entry => {
        if (!set2.has(entry)) {
            results.push(entry);
        }
    });
    return results;
};
/**
 *  Represents a drop-down list that provides editable functionalities, allowing users to choose an option from a predefined list.
 *
 * @igxModule IgxComboModule
 * @igxTheme igx-combo-theme
 * @igxKeywords combobox, combo selection
 * @igxGroup Grids & Lists
 *
 * @remarks
 * It provides the ability to filter items as well as perform selection with the provided data.
 * Additionally, it exposes keyboard navigation and custom styling capabilities.
 * @example
 * ```html
 * <igx-combo [itemsMaxHeight]="250" [data]="locationData"
 *  [displayKey]="'field'" [valueKey]="'field'"
 *  placeholder="Location(s)" searchPlaceholder="Search...">
 * </igx-combo>
 * ```
 */
export class IgxComboComponent extends IgxComboBaseDirective {
    constructor(elementRef, cdr, selectionService, comboAPI, _iconService, _displayDensityOptions, _inputGroupType, _injector) {
        super(elementRef, cdr, selectionService, comboAPI, _iconService, _displayDensityOptions, _inputGroupType, _injector);
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.selectionService = selectionService;
        this.comboAPI = comboAPI;
        this._iconService = _iconService;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        this._injector = _injector;
        /**
         * An @Input property that controls whether the combo's search box
         * should be focused after the `opened` event is called
         * When `false`, the combo's list item container will be focused instead
         */
        this.autoFocusSearch = true;
        /**
         * An @Input property that enabled/disables filtering in the list. The default is `true`.
         * ```html
         * <igx-combo [filterable]="false">
         * ```
         */
        this.filterable = true;
        /**
         * Defines the placeholder value for the combo dropdown search field
         *
         * ```typescript
         * // get
         * let myComboSearchPlaceholder = this.combo.searchPlaceholder;
         * ```
         *
         * ```html
         * <!--set-->
         * <igx-combo [searchPlaceholder]='newPlaceHolder'></igx-combo>
         * ```
         */
        this.searchPlaceholder = 'Enter a Search Term';
        /**
         * Emitted when item selection is changing, before the selection completes
         *
         * ```html
         * <igx-combo (selectionChanging)='handleSelection()'></igx-combo>
         * ```
         */
        this.selectionChanging = new EventEmitter();
        /**
         * @hidden @internal
         */
        this.filteringLogic = FilteringLogic.Or;
        this.stringFilters = IgxStringFilteringOperand;
        this.booleanFilters = IgxBooleanFilteringOperand;
        this._prevInputValue = '';
        this.comboAPI.register(this);
    }
    /**
     * @hidden @internal
     */
    get inputEmpty() {
        return !this.value && !this.placeholder;
    }
    /** @hidden @internal */
    get filteredData() {
        return this.filterable ? this._filteredData : this.data;
    }
    /** @hidden @internal */
    set filteredData(val) {
        this._filteredData = this.groupKey ? (val || []).filter((e) => e.isHeader !== true) : val;
        this.checkMatch();
    }
    /** @hidden @internal */
    get displaySearchInput() {
        return this.filterable || this.allowCustomValues;
    }
    /**
     * @hidden @internal
     */
    handleKeyUp(event) {
        // TODO: use PlatformUtil for keyboard navigation
        if (event.key === 'ArrowDown' || event.key === 'Down') {
            this.dropdown.focusedItem = this.dropdown.items[0];
            this.dropdownContainer.nativeElement.focus();
        }
        else if (event.key === 'Escape' || event.key === 'Esc') {
            this.toggle();
        }
    }
    /**
     * @hidden @internal
     */
    handleSelectAll(evt) {
        if (evt.checked) {
            this.selectAllItems();
        }
        else {
            this.deselectAllItems();
        }
    }
    /**
     * @hidden @internal
     */
    writeValue(value) {
        const selection = Array.isArray(value) ? value : [];
        const oldSelection = this.selection;
        this.selectionService.select_items(this.id, selection, true);
        this.cdr.markForCheck();
        this._value = this.createDisplayText(this.selection, oldSelection);
    }
    /**
     * @hidden
     */
    getEditElement() {
        return this.comboInput.nativeElement;
    }
    /**
     * @hidden @internal
     */
    get context() {
        return {
            $implicit: this
        };
    }
    /**
     * @hidden @internal
     */
    handleClearItems(event) {
        if (this.disabled) {
            return;
        }
        this.deselectAllItems(true, event);
        if (this.collapsed) {
            this.getEditElement().focus();
        }
        else {
            this.focusSearchInput(true);
        }
        event.stopPropagation();
    }
    /**
     * Select defined items
     *
     * @param newItems new items to be selected
     * @param clearCurrentSelection if true clear previous selected items
     * ```typescript
     * this.combo.select(["New York", "New Jersey"]);
     * ```
     */
    select(newItems, clearCurrentSelection, event) {
        if (newItems) {
            const newSelection = this.selectionService.add_items(this.id, newItems, clearCurrentSelection);
            this.setSelection(newSelection, event);
        }
    }
    /**
     * Deselect defined items
     *
     * @param items items to deselected
     * ```typescript
     * this.combo.deselect(["New York", "New Jersey"]);
     * ```
     */
    deselect(items, event) {
        if (items) {
            const newSelection = this.selectionService.delete_items(this.id, items);
            this.setSelection(newSelection, event);
        }
    }
    /**
     * Select all (filtered) items
     *
     * @param ignoreFilter if set to true, selects all items, otherwise selects only the filtered ones.
     * ```typescript
     * this.combo.selectAllItems();
     * ```
     */
    selectAllItems(ignoreFilter, event) {
        const allVisible = this.selectionService.get_all_ids(ignoreFilter ? this.data : this.filteredData, this.valueKey);
        const newSelection = this.selectionService.add_items(this.id, allVisible);
        this.setSelection(newSelection, event);
    }
    /**
     * Deselect all (filtered) items
     *
     * @param ignoreFilter if set to true, deselects all items, otherwise deselects only the filtered ones.
     * ```typescript
     * this.combo.deselectAllItems();
     * ```
     */
    deselectAllItems(ignoreFilter, event) {
        let newSelection = this.selectionService.get_empty();
        if (this.filteredData.length !== this.data.length && !ignoreFilter) {
            newSelection = this.selectionService.delete_items(this.id, this.selectionService.get_all_ids(this.filteredData, this.valueKey));
        }
        this.setSelection(newSelection, event);
    }
    /**
     * Selects/Deselects a single item
     *
     * @param itemID the itemID of the specific item
     * @param select If the item should be selected (true) or deselected (false)
     *
     * Without specified valueKey;
     * ```typescript
     * this.combo.valueKey = null;
     * const items: { field: string, region: string}[] = data;
     * this.combo.setSelectedItem(items[0], true);
     * ```
     * With specified valueKey;
     * ```typescript
     * this.combo.valueKey = 'field';
     * const items: { field: string, region: string}[] = data;
     * this.combo.setSelectedItem('Connecticut', true);
     * ```
     */
    setSelectedItem(itemID, select = true, event) {
        if (itemID === null || itemID === undefined) {
            return;
        }
        if (select) {
            this.select([itemID], false, event);
        }
        else {
            this.deselect([itemID], event);
        }
    }
    /** @hidden @internal */
    handleOpened() {
        this.triggerCheck();
        // Disabling focus of the search input should happen only when drop down opens.
        // During keyboard navigation input should receive focus, even the autoFocusSearch is disabled.
        // That is why in such cases focusing of the dropdownContainer happens outside focusSearchInput method.
        if (this.autoFocusSearch) {
            this.focusSearchInput(true);
        }
        else {
            this.dropdownContainer.nativeElement.focus();
        }
        this.opened.emit({ owner: this });
    }
    /** @hidden @internal */
    focusSearchInput(opening) {
        if (this.displaySearchInput && this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
        else {
            if (opening) {
                this.dropdownContainer.nativeElement.focus();
            }
            else {
                this.comboInput.nativeElement.focus();
                this.toggle();
            }
        }
    }
    setSelection(newSelection, event) {
        const removed = diffInSets(this.selectionService.get(this.id), newSelection);
        const added = diffInSets(newSelection, this.selectionService.get(this.id));
        const newSelectionAsArray = Array.from(newSelection);
        const oldSelectionAsArray = Array.from(this.selectionService.get(this.id) || []);
        const displayText = this.createDisplayText(newSelectionAsArray, oldSelectionAsArray);
        const args = {
            newSelection: newSelectionAsArray,
            oldSelection: oldSelectionAsArray,
            added,
            removed,
            event,
            owner: this,
            displayText,
            cancel: false
        };
        this.selectionChanging.emit(args);
        if (!args.cancel) {
            this.selectionService.select_items(this.id, args.newSelection, true);
            if (displayText !== args.displayText) {
                this._value = args.displayText;
            }
            else {
                this._value = this.createDisplayText(args.newSelection, args.oldSelection);
            }
            this._onChangeCallback(args.newSelection);
        }
    }
    createDisplayText(newSelection, oldSelection) {
        return this.isRemote
            ? this.getRemoteSelection(newSelection, oldSelection)
            : this.concatDisplayText(newSelection);
    }
    /** Returns a string that should be populated in the combo's text box */
    concatDisplayText(selection) {
        const value = this.displayKey !== null && this.displayKey !== undefined ?
            this.convertKeysToItems(selection).map(entry => entry[this.displayKey]).join(', ') :
            selection.join(', ');
        return value;
    }
}
IgxComboComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.IgxSelectionAPIService }, { token: i2.IgxComboAPIService }, { token: i3.IgxIconService }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }, { token: i0.Injector, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxComboComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxComboComponent, selector: "igx-combo", inputs: { autoFocusSearch: "autoFocusSearch", filterable: "filterable", searchPlaceholder: "searchPlaceholder" }, outputs: { selectionChanging: "selectionChanging" }, providers: [
        IgxComboAPIService,
        { provide: IGX_COMBO_COMPONENT, useExisting: IgxComboComponent },
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxComboComponent, multi: true }
    ], viewQueries: [{ propertyName: "dropdown", first: true, predicate: IgxComboDropDownComponent, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<igx-input-group #inputGroup [displayDensity]=\"displayDensity\" [type]=\"type\" (click)=\"onClick($event)\">\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint, [igxHint]\">\n        <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n    </ng-container>\n    <input igxInput #comboInput name=\"comboInput\" type=\"text\" [value]=\"value\" readonly [attr.placeholder]=\"placeholder\"\n        [disabled]=\"disabled\" (blur)=\"onBlur()\" />\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix\"></ng-content>\n    </ng-container>\n    <igx-suffix *ngIf=\"value.length\" aria-label=\"Clear Selection\" class=\"igx-combo__clear-button\"\n        (click)=\"handleClearItems($event)\">\n        <ng-container *ngIf=\"clearIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"clearIconTemplate\"></ng-container>\n        </ng-container>\n        <igx-icon *ngIf=\"!clearIconTemplate\">\n            clear\n        </igx-icon>\n    </igx-suffix>\n    <igx-suffix class=\"igx-combo__toggle-button\">\n        <ng-container *ngIf=\"toggleIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"toggleIconTemplate; context: {$implicit: this.collapsed}\"></ng-container>\n        </ng-container>\n        <igx-icon *ngIf=\"!toggleIconTemplate\">\n            {{ dropdown.collapsed ? 'arrow_drop_down' : 'arrow_drop_up'}}\n        </igx-icon>\n    </igx-suffix>\n</igx-input-group>\n<igx-combo-drop-down #igxComboDropDown class=\"igx-combo__drop-down\" [displayDensity]=\"displayDensity\"\n    [width]=\"itemsWidth || '100%'\" (opening)=\"handleOpening($event)\" (closing)=\"handleClosing($event)\"\n    (opened)=\"handleOpened()\" (closed)=\"handleClosed()\">\n    <igx-input-group *ngIf=\"displaySearchInput\" [displayDensity]=\"displayDensity\" theme=\"material\" class=\"igx-combo__search\">\n        <input class=\"igx-combo-input\" igxInput #searchInput name=\"searchInput\" autocomplete=\"off\" type=\"text\"\n            [(ngModel)]=\"searchValue\" (ngModelChange)=\"handleInputChange($event)\" (keyup)=\"handleKeyUp($event)\"\n            (keydown)=\"handleKeyDown($event)\" (focus)=\"dropdown.onBlur($event)\" [attr.placeholder]=\"searchPlaceholder\"\n            aria-autocomplete=\"both\" [attr.aria-owns]=\"dropdown.id\" [attr.aria-labelledby]=\"ariaLabelledBy\" />\n        <igx-suffix *ngIf=\"showSearchCaseIcon\">\n            <igx-icon family=\"imx-icons\" name=\"case-sensitive\" [active]=\"filteringOptions.caseSensitive\"\n                (click)=\"toggleCaseSensitive()\">\n            </igx-icon>\n        </igx-suffix>\n    </igx-input-group>\n    <ng-container *ngTemplateOutlet=\"headerTemplate\">\n    </ng-container>\n    <div #dropdownItemContainer class=\"igx-combo__content\" [style.overflow]=\"'hidden'\"\n        [style.maxHeight.px]=\"itemsMaxHeight\" [igxDropDownItemNavigation]=\"dropdown\" (focus)=\"dropdown.onFocus()\"\n        [tabindex]=\"dropdown.collapsed ? -1 : 0\" role=\"listbox\" [attr.id]=\"dropdown.id\">\n        <igx-combo-item role=\"option\" [itemHeight]='itemHeight' *igxFor=\"let item of data\n            | comboFiltering:filterValue:displayKey:filteringOptions:filterable\n            | comboGrouping:groupKey:valueKey:groupSortingDirection;\n            index as rowIndex; containerSize: itemsMaxHeight; scrollOrientation: 'vertical'; itemSize: itemHeight\"\n            [value]=\"item\" [isHeader]=\"item.isHeader\" [index]=\"rowIndex\">\n            <ng-container *ngIf=\"item.isHeader\">\n                <ng-container\n                    *ngTemplateOutlet=\"headerItemTemplate ? headerItemTemplate : headerItemBase;\n                    context: {$implicit: item, data: data, valueKey: valueKey, groupKey: groupKey, displayKey: displayKey}\">\n                </ng-container>\n            </ng-container>\n            <ng-container *ngIf=\"!item.isHeader\">\n                <ng-container #listItem\n                    *ngTemplateOutlet=\"template; context: {$implicit: item, data: data, valueKey: valueKey, displayKey: displayKey};\">\n                </ng-container>\n            </ng-container>\n        </igx-combo-item>\n    </div>\n    <div class=\"igx-combo__add\" *ngIf=\"filteredData.length === 0 || isAddButtonVisible()\">\n        <div class=\"igx-combo__empty\" *ngIf=\"filteredData.length === 0\">\n            <ng-container *ngTemplateOutlet=\"emptyTemplate ? emptyTemplate : empty\">\n            </ng-container>\n        </div>\n        <igx-combo-add-item [itemHeight]=\"itemHeight\" *ngIf=\"isAddButtonVisible()\"\n            [tabindex]=\"dropdown.collapsed ? -1 : customValueFlag ? 1 : -1\" class=\"igx-combo__add-item\" role=\"button\"\n            aria-label=\"Add Item\" [index]=\"virtualScrollContainer.igxForOf.length\">\n            <ng-container *ngTemplateOutlet=\"addItemTemplate ? addItemTemplate : addItemDefault\">\n            </ng-container>\n        </igx-combo-add-item>\n    </div>\n    <ng-container *ngTemplateOutlet=\"footerTemplate\">\n    </ng-container>\n</igx-combo-drop-down>\n<ng-template #complex let-display let-data=\"data\" let-key=\"displayKey\">\n    {{display[key]}}\n</ng-template>\n<ng-template #primitive let-display>\n    {{display}}\n</ng-template>\n<ng-template #empty>\n    <span>The list is empty</span>\n</ng-template>\n<ng-template #addItemDefault let-control>\n    <button igxButton=\"flat\" igxRipple>Add item</button>\n</ng-template>\n<ng-template #headerItemBase let-item let-key=\"valueKey\" let-groupKey=\"groupKey\">\n    {{ item[key] }}\n</ng-template>\n", components: [{ type: i0.forwardRef(function () { return i4.IgxInputGroupComponent; }), selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i0.forwardRef(function () { return i5.IgxIconComponent; }), selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i0.forwardRef(function () { return IgxComboDropDownComponent; }), selector: "igx-combo-drop-down", inputs: ["singleMode"] }, { type: i0.forwardRef(function () { return IgxComboItemComponent; }), selector: "igx-combo-item", inputs: ["itemHeight", "singleMode"] }, { type: i0.forwardRef(function () { return IgxComboAddItemComponent; }), selector: "igx-combo-add-item" }], directives: [{ type: i0.forwardRef(function () { return i6.IgxInputDirective; }), selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i0.forwardRef(function () { return i7.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i0.forwardRef(function () { return i8.IgxSuffixDirective; }), selector: "igx-suffix,[igxSuffix]" }, { type: i0.forwardRef(function () { return i7.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i0.forwardRef(function () { return i9.DefaultValueAccessor; }), selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i0.forwardRef(function () { return i9.NgControlStatus; }), selector: "[formControlName],[ngModel],[formControl]" }, { type: i0.forwardRef(function () { return i9.NgModel; }), selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i0.forwardRef(function () { return i10.IgxDropDownItemNavigationDirective; }), selector: "[igxDropDownItemNavigation]", inputs: ["igxDropDownItemNavigation"] }, { type: i0.forwardRef(function () { return i11.IgxForOfDirective; }), selector: "[igxFor][igxForOf]", inputs: ["igxForOf", "igxForSizePropName", "igxForScrollOrientation", "igxForScrollContainer", "igxForContainerSize", "igxForItemSize", "igxForTotalItemCount", "igxForTrackBy"], outputs: ["chunkLoad", "scrollbarVisibilityChanged", "contentSizeChange", "dataChanged", "beforeViewDestroyed", "chunkPreload"] }, { type: i0.forwardRef(function () { return i12.IgxButtonDirective; }), selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i0.forwardRef(function () { return i13.IgxRippleDirective; }), selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }], pipes: { "comboGrouping": i0.forwardRef(function () { return IgxComboGroupingPipe; }), "comboFiltering": i0.forwardRef(function () { return IgxComboFilteringPipe; }) } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-combo', providers: [
                        IgxComboAPIService,
                        { provide: IGX_COMBO_COMPONENT, useExisting: IgxComboComponent },
                        { provide: NG_VALUE_ACCESSOR, useExisting: IgxComboComponent, multi: true }
                    ], template: "<igx-input-group #inputGroup [displayDensity]=\"displayDensity\" [type]=\"type\" (click)=\"onClick($event)\">\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint, [igxHint]\">\n        <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n    </ng-container>\n    <input igxInput #comboInput name=\"comboInput\" type=\"text\" [value]=\"value\" readonly [attr.placeholder]=\"placeholder\"\n        [disabled]=\"disabled\" (blur)=\"onBlur()\" />\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix\"></ng-content>\n    </ng-container>\n    <igx-suffix *ngIf=\"value.length\" aria-label=\"Clear Selection\" class=\"igx-combo__clear-button\"\n        (click)=\"handleClearItems($event)\">\n        <ng-container *ngIf=\"clearIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"clearIconTemplate\"></ng-container>\n        </ng-container>\n        <igx-icon *ngIf=\"!clearIconTemplate\">\n            clear\n        </igx-icon>\n    </igx-suffix>\n    <igx-suffix class=\"igx-combo__toggle-button\">\n        <ng-container *ngIf=\"toggleIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"toggleIconTemplate; context: {$implicit: this.collapsed}\"></ng-container>\n        </ng-container>\n        <igx-icon *ngIf=\"!toggleIconTemplate\">\n            {{ dropdown.collapsed ? 'arrow_drop_down' : 'arrow_drop_up'}}\n        </igx-icon>\n    </igx-suffix>\n</igx-input-group>\n<igx-combo-drop-down #igxComboDropDown class=\"igx-combo__drop-down\" [displayDensity]=\"displayDensity\"\n    [width]=\"itemsWidth || '100%'\" (opening)=\"handleOpening($event)\" (closing)=\"handleClosing($event)\"\n    (opened)=\"handleOpened()\" (closed)=\"handleClosed()\">\n    <igx-input-group *ngIf=\"displaySearchInput\" [displayDensity]=\"displayDensity\" theme=\"material\" class=\"igx-combo__search\">\n        <input class=\"igx-combo-input\" igxInput #searchInput name=\"searchInput\" autocomplete=\"off\" type=\"text\"\n            [(ngModel)]=\"searchValue\" (ngModelChange)=\"handleInputChange($event)\" (keyup)=\"handleKeyUp($event)\"\n            (keydown)=\"handleKeyDown($event)\" (focus)=\"dropdown.onBlur($event)\" [attr.placeholder]=\"searchPlaceholder\"\n            aria-autocomplete=\"both\" [attr.aria-owns]=\"dropdown.id\" [attr.aria-labelledby]=\"ariaLabelledBy\" />\n        <igx-suffix *ngIf=\"showSearchCaseIcon\">\n            <igx-icon family=\"imx-icons\" name=\"case-sensitive\" [active]=\"filteringOptions.caseSensitive\"\n                (click)=\"toggleCaseSensitive()\">\n            </igx-icon>\n        </igx-suffix>\n    </igx-input-group>\n    <ng-container *ngTemplateOutlet=\"headerTemplate\">\n    </ng-container>\n    <div #dropdownItemContainer class=\"igx-combo__content\" [style.overflow]=\"'hidden'\"\n        [style.maxHeight.px]=\"itemsMaxHeight\" [igxDropDownItemNavigation]=\"dropdown\" (focus)=\"dropdown.onFocus()\"\n        [tabindex]=\"dropdown.collapsed ? -1 : 0\" role=\"listbox\" [attr.id]=\"dropdown.id\">\n        <igx-combo-item role=\"option\" [itemHeight]='itemHeight' *igxFor=\"let item of data\n            | comboFiltering:filterValue:displayKey:filteringOptions:filterable\n            | comboGrouping:groupKey:valueKey:groupSortingDirection;\n            index as rowIndex; containerSize: itemsMaxHeight; scrollOrientation: 'vertical'; itemSize: itemHeight\"\n            [value]=\"item\" [isHeader]=\"item.isHeader\" [index]=\"rowIndex\">\n            <ng-container *ngIf=\"item.isHeader\">\n                <ng-container\n                    *ngTemplateOutlet=\"headerItemTemplate ? headerItemTemplate : headerItemBase;\n                    context: {$implicit: item, data: data, valueKey: valueKey, groupKey: groupKey, displayKey: displayKey}\">\n                </ng-container>\n            </ng-container>\n            <ng-container *ngIf=\"!item.isHeader\">\n                <ng-container #listItem\n                    *ngTemplateOutlet=\"template; context: {$implicit: item, data: data, valueKey: valueKey, displayKey: displayKey};\">\n                </ng-container>\n            </ng-container>\n        </igx-combo-item>\n    </div>\n    <div class=\"igx-combo__add\" *ngIf=\"filteredData.length === 0 || isAddButtonVisible()\">\n        <div class=\"igx-combo__empty\" *ngIf=\"filteredData.length === 0\">\n            <ng-container *ngTemplateOutlet=\"emptyTemplate ? emptyTemplate : empty\">\n            </ng-container>\n        </div>\n        <igx-combo-add-item [itemHeight]=\"itemHeight\" *ngIf=\"isAddButtonVisible()\"\n            [tabindex]=\"dropdown.collapsed ? -1 : customValueFlag ? 1 : -1\" class=\"igx-combo__add-item\" role=\"button\"\n            aria-label=\"Add Item\" [index]=\"virtualScrollContainer.igxForOf.length\">\n            <ng-container *ngTemplateOutlet=\"addItemTemplate ? addItemTemplate : addItemDefault\">\n            </ng-container>\n        </igx-combo-add-item>\n    </div>\n    <ng-container *ngTemplateOutlet=\"footerTemplate\">\n    </ng-container>\n</igx-combo-drop-down>\n<ng-template #complex let-display let-data=\"data\" let-key=\"displayKey\">\n    {{display[key]}}\n</ng-template>\n<ng-template #primitive let-display>\n    {{display}}\n</ng-template>\n<ng-template #empty>\n    <span>The list is empty</span>\n</ng-template>\n<ng-template #addItemDefault let-control>\n    <button igxButton=\"flat\" igxRipple>Add item</button>\n</ng-template>\n<ng-template #headerItemBase let-item let-key=\"valueKey\" let-groupKey=\"groupKey\">\n    {{ item[key] }}\n</ng-template>\n" }]
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
                }] }]; }, propDecorators: { autoFocusSearch: [{
                type: Input
            }], filterable: [{
                type: Input
            }], searchPlaceholder: [{
                type: Input
            }], selectionChanging: [{
                type: Output
            }], dropdown: [{
                type: ViewChild,
                args: [IgxComboDropDownComponent, { static: true }]
            }] } });
/**
 * @hidden
 */
export class IgxComboModule {
}
IgxComboModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxComboModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboModule, declarations: [IgxComboAddItemComponent,
        IgxComboAddItemDirective,
        IgxComboClearIconDirective, IgxComboComponent, IgxComboDropDownComponent,
        IgxComboEmptyDirective,
        IgxComboFilteringPipe,
        IgxComboCleanPipe,
        IgxComboFooterDirective,
        IgxComboGroupingPipe,
        IgxComboHeaderDirective,
        IgxComboHeaderItemDirective,
        IgxComboItemComponent,
        IgxComboItemDirective,
        IgxComboToggleIconDirective], imports: [CommonModule,
        FormsModule,
        IgxButtonModule,
        IgxCheckboxModule,
        IgxDropDownModule,
        IgxForOfModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxRippleModule,
        IgxToggleModule,
        ReactiveFormsModule], exports: [IgxComboAddItemComponent,
        IgxComboAddItemDirective,
        IgxComboClearIconDirective, IgxComboComponent, IgxComboDropDownComponent,
        IgxComboEmptyDirective,
        IgxComboFilteringPipe,
        IgxComboCleanPipe,
        IgxComboFooterDirective,
        IgxComboGroupingPipe,
        IgxComboHeaderDirective,
        IgxComboHeaderItemDirective,
        IgxComboItemComponent,
        IgxComboItemDirective,
        IgxComboToggleIconDirective,
        IgxInputGroupModule] });
IgxComboModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboModule, imports: [[
            CommonModule,
            FormsModule,
            IgxButtonModule,
            IgxCheckboxModule,
            IgxDropDownModule,
            IgxForOfModule,
            IgxIconModule,
            IgxInputGroupModule,
            IgxRippleModule,
            IgxToggleModule,
            ReactiveFormsModule
        ], IgxInputGroupModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxComboAddItemComponent,
                        IgxComboAddItemDirective,
                        IgxComboClearIconDirective,
                        IgxComboComponent,
                        IgxComboDropDownComponent,
                        IgxComboEmptyDirective,
                        IgxComboFilteringPipe,
                        IgxComboCleanPipe,
                        IgxComboFooterDirective,
                        IgxComboGroupingPipe,
                        IgxComboHeaderDirective,
                        IgxComboHeaderItemDirective,
                        IgxComboItemComponent,
                        IgxComboItemDirective,
                        IgxComboToggleIconDirective
                    ],
                    exports: [
                        IgxComboAddItemComponent,
                        IgxComboAddItemDirective,
                        IgxComboClearIconDirective,
                        IgxComboComponent,
                        IgxComboDropDownComponent,
                        IgxComboEmptyDirective,
                        IgxComboFilteringPipe,
                        IgxComboCleanPipe,
                        IgxComboFooterDirective,
                        IgxComboGroupingPipe,
                        IgxComboHeaderDirective,
                        IgxComboHeaderItemDirective,
                        IgxComboItemComponent,
                        IgxComboItemDirective,
                        IgxComboToggleIconDirective,
                        IgxInputGroupModule
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        IgxButtonModule,
                        IgxCheckboxModule,
                        IgxDropDownModule,
                        IgxForOfModule,
                        IgxIconModule,
                        IgxInputGroupModule,
                        IgxRippleModule,
                        IgxToggleModule,
                        ReactiveFormsModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NvbWJvL2NvbWJvLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jb21iby9jb21iby5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUMrQixTQUFTLEVBQWMsUUFBUSxFQUNqRSxRQUFRLEVBQUUsTUFBTSxFQUFZLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFDckUsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNILHFCQUFxQixFQUNyQixzQkFBc0IsRUFDdEIsMkJBQTJCLEVBQzNCLHVCQUF1QixFQUN2Qix1QkFBdUIsRUFDdkIsd0JBQXdCLEVBQ3hCLDJCQUEyQixFQUMzQiwwQkFBMEIsRUFDN0IsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBR25FLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQy9HLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUNuRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGFBQWEsRUFBa0IsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVB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QWM7a0JBbEQxQixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVix3QkFBd0I7d0JBQ3hCLHdCQUF3Qjt3QkFDeEIsMEJBQTBCO3dCQUMxQixpQkFBaUI7d0JBQ2pCLHlCQUF5Qjt3QkFDekIsc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLGlCQUFpQjt3QkFDakIsdUJBQXVCO3dCQUN2QixvQkFBb0I7d0JBQ3BCLHVCQUF1Qjt3QkFDdkIsMkJBQTJCO3dCQUMzQixxQkFBcUI7d0JBQ3JCLHFCQUFxQjt3QkFDckIsMkJBQTJCO3FCQUM5QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsd0JBQXdCO3dCQUN4Qix3QkFBd0I7d0JBQ3hCLDBCQUEwQjt3QkFDMUIsaUJBQWlCO3dCQUNqQix5QkFBeUI7d0JBQ3pCLHNCQUFzQjt3QkFDdEIscUJBQXFCO3dCQUNyQixpQkFBaUI7d0JBQ2pCLHVCQUF1Qjt3QkFDdkIsb0JBQW9CO3dCQUNwQix1QkFBdUI7d0JBQ3ZCLDJCQUEyQjt3QkFDM0IscUJBQXFCO3dCQUNyQixxQkFBcUI7d0JBQ3JCLDJCQUEyQjt3QkFDM0IsbUJBQW1CO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsaUJBQWlCO3dCQUNqQixpQkFBaUI7d0JBQ2pCLGNBQWM7d0JBQ2QsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixtQkFBbUI7cUJBQ3RCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgTmdNb2R1bGUsIE9uSW5pdCwgT25EZXN0cm95LFxuICAgIE9wdGlvbmFsLCBJbmplY3QsIEluamVjdG9yLCBWaWV3Q2hpbGQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgSWd4Q29tYm9JdGVtRGlyZWN0aXZlLFxuICAgIElneENvbWJvRW1wdHlEaXJlY3RpdmUsXG4gICAgSWd4Q29tYm9IZWFkZXJJdGVtRGlyZWN0aXZlLFxuICAgIElneENvbWJvSGVhZGVyRGlyZWN0aXZlLFxuICAgIElneENvbWJvRm9vdGVyRGlyZWN0aXZlLFxuICAgIElneENvbWJvQWRkSXRlbURpcmVjdGl2ZSxcbiAgICBJZ3hDb21ib1RvZ2dsZUljb25EaXJlY3RpdmUsXG4gICAgSWd4Q29tYm9DbGVhckljb25EaXJlY3RpdmVcbn0gZnJvbSAnLi9jb21iby5kaXJlY3RpdmVzJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBJZ3hDaGVja2JveE1vZHVsZSB9IGZyb20gJy4uL2NoZWNrYm94L2NoZWNrYm94LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hTZWxlY3Rpb25BUElTZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZWxlY3Rpb24nO1xuaW1wb3J0IHsgSUJhc2VFdmVudEFyZ3MsIElCYXNlQ2FuY2VsYWJsZUV2ZW50QXJncywgQ2FuY2VsYWJsZUV2ZW50QXJncyB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSWd4U3RyaW5nRmlsdGVyaW5nT3BlcmFuZCwgSWd4Qm9vbGVhbkZpbHRlcmluZ09wZXJhbmQgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBGaWx0ZXJpbmdMb2dpYyB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctZXhwcmVzc2lvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSWd4Rm9yT2ZNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2Zvci1vZi9mb3Jfb2YuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEljb25Nb2R1bGUsIElneEljb25TZXJ2aWNlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvcmlwcGxlL3JpcHBsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4VG9nZ2xlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90b2dnbGUvdG9nZ2xlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElneERyb3BEb3duTW9kdWxlIH0gZnJvbSAnLi4vZHJvcC1kb3duL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4SW5wdXRHcm91cE1vZHVsZSB9IGZyb20gJy4uL2lucHV0LWdyb3VwL2lucHV0LWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hDb21ib0l0ZW1Db21wb25lbnQgfSBmcm9tICcuL2NvbWJvLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IElneENvbWJvRHJvcERvd25Db21wb25lbnQgfSBmcm9tICcuL2NvbWJvLWRyb3Bkb3duLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hDb21ib0NsZWFuUGlwZSwgSWd4Q29tYm9GaWx0ZXJpbmdQaXBlLCBJZ3hDb21ib0dyb3VwaW5nUGlwZSB9IGZyb20gJy4vY29tYm8ucGlwZXMnO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5pbXBvcnQgeyBJR1hfQ09NQk9fQ09NUE9ORU5ULCBJZ3hDb21ib0Jhc2VEaXJlY3RpdmUgfSBmcm9tICcuL2NvbWJvLmNvbW1vbic7XG5pbXBvcnQgeyBJZ3hDb21ib0FkZEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2NvbWJvLWFkZC1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hDb21ib0FQSVNlcnZpY2UgfSBmcm9tICcuL2NvbWJvLmFwaSc7XG5pbXBvcnQgeyBFZGl0b3JQcm92aWRlciB9IGZyb20gJy4uL2NvcmUvZWRpdC1wcm92aWRlcic7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwVHlwZSwgSUdYX0lOUFVUX0dST1VQX1RZUEUgfSBmcm9tICcuLi9pbnB1dC1ncm91cC9wdWJsaWNfYXBpJztcblxuLyoqIFRoZSBmaWx0ZXJpbmcgY3JpdGVyaWEgdG8gYmUgYXBwbGllZCBvbiBkYXRhIHNlYXJjaCAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ29tYm9GaWx0ZXJpbmdPcHRpb25zIHtcbiAgICAvKiogRGVmaW5lcyBmaWx0ZXJpbmcgY2FzZS1zZW5zaXRpdml0eSAqL1xuICAgIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW47XG59XG5cbi8qKiBFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWd4LWNvbWJvJ3Mgc2VsZWN0aW9uIGlzIGNoYW5naW5nICovXG5leHBvcnQgaW50ZXJmYWNlIElDb21ib1NlbGVjdGlvbkNoYW5naW5nRXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VDYW5jZWxhYmxlRXZlbnRBcmdzIHtcbiAgICAvKiogQW4gYXJyYXkgY29udGFpbmluZyB0aGUgdmFsdWVzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZCAqL1xuICAgIG9sZFNlbGVjdGlvbjogYW55W107XG4gICAgLyoqIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZhbHVlcyB0aGF0IHdpbGwgYmUgc2VsZWN0ZWQgYWZ0ZXIgdGhpcyBldmVudCAqL1xuICAgIG5ld1NlbGVjdGlvbjogYW55W107XG4gICAgLyoqIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZhbHVlcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHNlbGVjdGlvbiAoaWYgYW55KSAqL1xuICAgIGFkZGVkOiBhbnlbXTtcbiAgICAvKiogQW4gYXJyYXkgY29udGFpbmluZyB0aGUgdmFsdWVzIHRoYXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIHNlbGVjdGlvbiAoaWYgYW55KSAqL1xuICAgIHJlbW92ZWQ6IGFueVtdO1xuICAgIC8qKiBUaGUgdGV4dCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSBjb21ibyB0ZXh0IGJveCAqL1xuICAgIGRpc3BsYXlUZXh0OiBzdHJpbmc7XG4gICAgLyoqIFRoZSB1c2VyIGludGVyYWN0aW9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBzZWxlY3Rpb24gY2hhbmdlICovXG4gICAgZXZlbnQ/OiBFdmVudDtcbn1cblxuLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgaWd4LWNvbWJvJ3Mgc2VhcmNoIGlucHV0IGNoYW5nZXMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbWJvU2VhcmNoSW5wdXRFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUNhbmNlbGFibGVFdmVudEFyZ3Mge1xuICAgIC8qKiBUaGUgdGV4dCB0aGF0IGhhcyBiZWVuIHR5cGVkIGludG8gdGhlIHNlYXJjaCBpbnB1dCAqL1xuICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ29tYm9JdGVtQWRkaXRpb25FdmVudCBleHRlbmRzIElCYXNlRXZlbnRBcmdzLCBDYW5jZWxhYmxlRXZlbnRBcmdzIHtcbiAgICBvbGRDb2xsZWN0aW9uOiBhbnlbXTtcbiAgICBhZGRlZEl0ZW06IGFueTtcbiAgICBuZXdDb2xsZWN0aW9uOiBhbnlbXTtcbn1cblxuLyoqXG4gKiBXaGVuIGNhbGxlZCB3aXRoIHNldHMgQSAmIEIsIHJldHVybnMgQSAtIEIgKGFzIGFycmF5KTtcbiAqXG4gKiBAaGlkZGVuXG4gKi9cbmNvbnN0IGRpZmZJblNldHMgPSAoc2V0MTogU2V0PGFueT4sIHNldDI6IFNldDxhbnk+KTogYW55W10gPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICBzZXQxLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBpZiAoIXNldDIuaGFzKGVudHJ5KSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudHJ5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiAgUmVwcmVzZW50cyBhIGRyb3AtZG93biBsaXN0IHRoYXQgcHJvdmlkZXMgZWRpdGFibGUgZnVuY3Rpb25hbGl0aWVzLCBhbGxvd2luZyB1c2VycyB0byBjaG9vc2UgYW4gb3B0aW9uIGZyb20gYSBwcmVkZWZpbmVkIGxpc3QuXG4gKlxuICogQGlneE1vZHVsZSBJZ3hDb21ib01vZHVsZVxuICogQGlneFRoZW1lIGlneC1jb21iby10aGVtZVxuICogQGlneEtleXdvcmRzIGNvbWJvYm94LCBjb21ibyBzZWxlY3Rpb25cbiAqIEBpZ3hHcm91cCBHcmlkcyAmIExpc3RzXG4gKlxuICogQHJlbWFya3NcbiAqIEl0IHByb3ZpZGVzIHRoZSBhYmlsaXR5IHRvIGZpbHRlciBpdGVtcyBhcyB3ZWxsIGFzIHBlcmZvcm0gc2VsZWN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXG4gKiBBZGRpdGlvbmFsbHksIGl0IGV4cG9zZXMga2V5Ym9hcmQgbmF2aWdhdGlvbiBhbmQgY3VzdG9tIHN0eWxpbmcgY2FwYWJpbGl0aWVzLlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtY29tYm8gW2l0ZW1zTWF4SGVpZ2h0XT1cIjI1MFwiIFtkYXRhXT1cImxvY2F0aW9uRGF0YVwiXG4gKiAgW2Rpc3BsYXlLZXldPVwiJ2ZpZWxkJ1wiIFt2YWx1ZUtleV09XCInZmllbGQnXCJcbiAqICBwbGFjZWhvbGRlcj1cIkxvY2F0aW9uKHMpXCIgc2VhcmNoUGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIj5cbiAqIDwvaWd4LWNvbWJvPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWNvbWJvJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2NvbWJvLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSWd4Q29tYm9BUElTZXJ2aWNlLFxuICAgICAgICB7IHByb3ZpZGU6IElHWF9DT01CT19DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBJZ3hDb21ib0NvbXBvbmVudCB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogSWd4Q29tYm9Db21wb25lbnQsIG11bHRpOiB0cnVlIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneENvbWJvQ29tcG9uZW50IGV4dGVuZHMgSWd4Q29tYm9CYXNlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCxcbiAgICBPbkRlc3Ryb3ksIEVkaXRvclByb3ZpZGVyIHtcbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBjb250cm9scyB3aGV0aGVyIHRoZSBjb21ibydzIHNlYXJjaCBib3hcbiAgICAgKiBzaG91bGQgYmUgZm9jdXNlZCBhZnRlciB0aGUgYG9wZW5lZGAgZXZlbnQgaXMgY2FsbGVkXG4gICAgICogV2hlbiBgZmFsc2VgLCB0aGUgY29tYm8ncyBsaXN0IGl0ZW0gY29udGFpbmVyIHdpbGwgYmUgZm9jdXNlZCBpbnN0ZWFkXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgYXV0b0ZvY3VzU2VhcmNoID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IGVuYWJsZWQvZGlzYWJsZXMgZmlsdGVyaW5nIGluIHRoZSBsaXN0LiBUaGUgZGVmYXVsdCBpcyBgdHJ1ZWAuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY29tYm8gW2ZpbHRlcmFibGVdPVwiZmFsc2VcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmaWx0ZXJhYmxlID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgdGhlIHBsYWNlaG9sZGVyIHZhbHVlIGZvciB0aGUgY29tYm8gZHJvcGRvd24gc2VhcmNoIGZpZWxkXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0XG4gICAgICogbGV0IG15Q29tYm9TZWFyY2hQbGFjZWhvbGRlciA9IHRoaXMuY29tYm8uc2VhcmNoUGxhY2Vob2xkZXI7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtY29tYm8gW3NlYXJjaFBsYWNlaG9sZGVyXT0nbmV3UGxhY2VIb2xkZXInPjwvaWd4LWNvbWJvPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNlYXJjaFBsYWNlaG9sZGVyID0gJ0VudGVyIGEgU2VhcmNoIFRlcm0nO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIGl0ZW0gc2VsZWN0aW9uIGlzIGNoYW5naW5nLCBiZWZvcmUgdGhlIHNlbGVjdGlvbiBjb21wbGV0ZXNcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNvbWJvIChzZWxlY3Rpb25DaGFuZ2luZyk9J2hhbmRsZVNlbGVjdGlvbigpJz48L2lneC1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2VsZWN0aW9uQ2hhbmdpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElDb21ib1NlbGVjdGlvbkNoYW5naW5nRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQFZpZXdDaGlsZChJZ3hDb21ib0Ryb3BEb3duQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBkcm9wZG93bjogSWd4Q29tYm9Ecm9wRG93bkNvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpbnB1dEVtcHR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWUgJiYgIXRoaXMucGxhY2Vob2xkZXI7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBmaWx0ZXJlZERhdGEoKTogYW55W10gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyYWJsZSA/IHRoaXMuX2ZpbHRlcmVkRGF0YSA6IHRoaXMuZGF0YTtcbiAgICB9XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHNldCBmaWx0ZXJlZERhdGEodmFsOiBhbnlbXSB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5fZmlsdGVyZWREYXRhID0gdGhpcy5ncm91cEtleSA/ICh2YWwgfHwgW10pLmZpbHRlcigoZSkgPT4gZS5pc0hlYWRlciAhPT0gdHJ1ZSkgOiB2YWw7XG4gICAgICAgIHRoaXMuY2hlY2tNYXRjaCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGZpbHRlcmluZ0xvZ2ljID0gRmlsdGVyaW5nTG9naWMuT3I7XG5cbiAgICBwcm90ZWN0ZWQgc3RyaW5nRmlsdGVycyA9IElneFN0cmluZ0ZpbHRlcmluZ09wZXJhbmQ7XG4gICAgcHJvdGVjdGVkIGJvb2xlYW5GaWx0ZXJzID0gSWd4Qm9vbGVhbkZpbHRlcmluZ09wZXJhbmQ7XG4gICAgcHJvdGVjdGVkIF9wcmV2SW5wdXRWYWx1ZSA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcm90ZWN0ZWQgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdGlvblNlcnZpY2U6IElneFNlbGVjdGlvbkFQSVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBjb21ib0FQSTogSWd4Q29tYm9BUElTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgX2ljb25TZXJ2aWNlOiBJZ3hJY29uU2VydmljZSxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9uczogSURpc3BsYXlEZW5zaXR5T3B0aW9ucyxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChJR1hfSU5QVVRfR1JPVVBfVFlQRSkgcHJvdGVjdGVkIF9pbnB1dEdyb3VwVHlwZTogSWd4SW5wdXRHcm91cFR5cGUsXG4gICAgICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBfaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNkciwgc2VsZWN0aW9uU2VydmljZSwgY29tYm9BUEksIF9pY29uU2VydmljZSwgX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucywgX2lucHV0R3JvdXBUeXBlLCBfaW5qZWN0b3IpO1xuICAgICAgICB0aGlzLmNvbWJvQVBJLnJlZ2lzdGVyKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgZGlzcGxheVNlYXJjaElucHV0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJhYmxlIHx8IHRoaXMuYWxsb3dDdXN0b21WYWx1ZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgLy8gVE9ETzogdXNlIFBsYXRmb3JtVXRpbCBmb3Iga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJyB8fCBldmVudC5rZXkgPT09ICdEb3duJykge1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5mb2N1c2VkSXRlbSA9IHRoaXMuZHJvcGRvd24uaXRlbXNbMF07XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnIHx8IGV2ZW50LmtleSA9PT0gJ0VzYycpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVTZWxlY3RBbGwoZXZ0KSB7XG4gICAgICAgIGlmIChldnQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RBbGxJdGVtcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdEFsbEl0ZW1zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW107XG4gICAgICAgIGNvbnN0IG9sZFNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0X2l0ZW1zKHRoaXMuaWQsIHNlbGVjdGlvbiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuY3JlYXRlRGlzcGxheVRleHQodGhpcy5zZWxlY3Rpb24sIG9sZFNlbGVjdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRFZGl0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbWJvSW5wdXQubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29udGV4dCgpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJGltcGxpY2l0OiB0aGlzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlQ2xlYXJJdGVtcyhldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc2VsZWN0QWxsSXRlbXModHJ1ZSwgZXZlbnQpO1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0RWRpdEVsZW1lbnQoKS5mb2N1cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb2N1c1NlYXJjaElucHV0KHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdCBkZWZpbmVkIGl0ZW1zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmV3SXRlbXMgbmV3IGl0ZW1zIHRvIGJlIHNlbGVjdGVkXG4gICAgICogQHBhcmFtIGNsZWFyQ3VycmVudFNlbGVjdGlvbiBpZiB0cnVlIGNsZWFyIHByZXZpb3VzIHNlbGVjdGVkIGl0ZW1zXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY29tYm8uc2VsZWN0KFtcIk5ldyBZb3JrXCIsIFwiTmV3IEplcnNleVwiXSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdChuZXdJdGVtczogQXJyYXk8YW55PiwgY2xlYXJDdXJyZW50U2VsZWN0aW9uPzogYm9vbGVhbiwgZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICBpZiAobmV3SXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uU2VydmljZS5hZGRfaXRlbXModGhpcy5pZCwgbmV3SXRlbXMsIGNsZWFyQ3VycmVudFNlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihuZXdTZWxlY3Rpb24sIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0IGRlZmluZWQgaXRlbXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpdGVtcyBpdGVtcyB0byBkZXNlbGVjdGVkXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY29tYm8uZGVzZWxlY3QoW1wiTmV3IFlvcmtcIiwgXCJOZXcgSmVyc2V5XCJdKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzZWxlY3QoaXRlbXM6IEFycmF5PGFueT4sIGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgaWYgKGl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZGVsZXRlX2l0ZW1zKHRoaXMuaWQsIGl0ZW1zKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKG5ld1NlbGVjdGlvbiwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IGFsbCAoZmlsdGVyZWQpIGl0ZW1zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWdub3JlRmlsdGVyIGlmIHNldCB0byB0cnVlLCBzZWxlY3RzIGFsbCBpdGVtcywgb3RoZXJ3aXNlIHNlbGVjdHMgb25seSB0aGUgZmlsdGVyZWQgb25lcy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb21iby5zZWxlY3RBbGxJdGVtcygpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RBbGxJdGVtcyhpZ25vcmVGaWx0ZXI/OiBib29sZWFuLCBldmVudD86IEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGFsbFZpc2libGUgPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0X2FsbF9pZHMoaWdub3JlRmlsdGVyID8gdGhpcy5kYXRhIDogdGhpcy5maWx0ZXJlZERhdGEsIHRoaXMudmFsdWVLZXkpO1xuICAgICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWRkX2l0ZW1zKHRoaXMuaWQsIGFsbFZpc2libGUpO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihuZXdTZWxlY3Rpb24sIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXNlbGVjdCBhbGwgKGZpbHRlcmVkKSBpdGVtc1xuICAgICAqXG4gICAgICogQHBhcmFtIGlnbm9yZUZpbHRlciBpZiBzZXQgdG8gdHJ1ZSwgZGVzZWxlY3RzIGFsbCBpdGVtcywgb3RoZXJ3aXNlIGRlc2VsZWN0cyBvbmx5IHRoZSBmaWx0ZXJlZCBvbmVzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNvbWJvLmRlc2VsZWN0QWxsSXRlbXMoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzZWxlY3RBbGxJdGVtcyhpZ25vcmVGaWx0ZXI/OiBib29sZWFuLCBldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0X2VtcHR5KCk7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGggIT09IHRoaXMuZGF0YS5sZW5ndGggJiYgIWlnbm9yZUZpbHRlcikge1xuICAgICAgICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmRlbGV0ZV9pdGVtcyh0aGlzLmlkLCB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0X2FsbF9pZHModGhpcy5maWx0ZXJlZERhdGEsIHRoaXMudmFsdWVLZXkpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihuZXdTZWxlY3Rpb24sIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzL0Rlc2VsZWN0cyBhIHNpbmdsZSBpdGVtXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaXRlbUlEIHRoZSBpdGVtSUQgb2YgdGhlIHNwZWNpZmljIGl0ZW1cbiAgICAgKiBAcGFyYW0gc2VsZWN0IElmIHRoZSBpdGVtIHNob3VsZCBiZSBzZWxlY3RlZCAodHJ1ZSkgb3IgZGVzZWxlY3RlZCAoZmFsc2UpXG4gICAgICpcbiAgICAgKiBXaXRob3V0IHNwZWNpZmllZCB2YWx1ZUtleTtcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb21iby52YWx1ZUtleSA9IG51bGw7XG4gICAgICogY29uc3QgaXRlbXM6IHsgZmllbGQ6IHN0cmluZywgcmVnaW9uOiBzdHJpbmd9W10gPSBkYXRhO1xuICAgICAqIHRoaXMuY29tYm8uc2V0U2VsZWN0ZWRJdGVtKGl0ZW1zWzBdLCB0cnVlKTtcbiAgICAgKiBgYGBcbiAgICAgKiBXaXRoIHNwZWNpZmllZCB2YWx1ZUtleTtcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb21iby52YWx1ZUtleSA9ICdmaWVsZCc7XG4gICAgICogY29uc3QgaXRlbXM6IHsgZmllbGQ6IHN0cmluZywgcmVnaW9uOiBzdHJpbmd9W10gPSBkYXRhO1xuICAgICAqIHRoaXMuY29tYm8uc2V0U2VsZWN0ZWRJdGVtKCdDb25uZWN0aWN1dCcsIHRydWUpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRTZWxlY3RlZEl0ZW0oaXRlbUlEOiBhbnksIHNlbGVjdCA9IHRydWUsIGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGl0ZW1JRCA9PT0gbnVsbCB8fCBpdGVtSUQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KFtpdGVtSURdLCBmYWxzZSwgZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdChbaXRlbUlEXSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZU9wZW5lZCgpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyQ2hlY2soKTtcblxuICAgICAgICAvLyBEaXNhYmxpbmcgZm9jdXMgb2YgdGhlIHNlYXJjaCBpbnB1dCBzaG91bGQgaGFwcGVuIG9ubHkgd2hlbiBkcm9wIGRvd24gb3BlbnMuXG4gICAgICAgIC8vIER1cmluZyBrZXlib2FyZCBuYXZpZ2F0aW9uIGlucHV0IHNob3VsZCByZWNlaXZlIGZvY3VzLCBldmVuIHRoZSBhdXRvRm9jdXNTZWFyY2ggaXMgZGlzYWJsZWQuXG4gICAgICAgIC8vIFRoYXQgaXMgd2h5IGluIHN1Y2ggY2FzZXMgZm9jdXNpbmcgb2YgdGhlIGRyb3Bkb3duQ29udGFpbmVyIGhhcHBlbnMgb3V0c2lkZSBmb2N1c1NlYXJjaElucHV0IG1ldGhvZC5cbiAgICAgICAgaWYgKHRoaXMuYXV0b0ZvY3VzU2VhcmNoKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzU2VhcmNoSW5wdXQodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wZW5lZC5lbWl0KHsgb3duZXI6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGZvY3VzU2VhcmNoSW5wdXQob3BlbmluZz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVNlYXJjaElucHV0ICYmIHRoaXMuc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9wZW5pbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21ib0lucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFNlbGVjdGlvbihuZXdTZWxlY3Rpb246IFNldDxhbnk+LCBldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbW92ZWQgPSBkaWZmSW5TZXRzKHRoaXMuc2VsZWN0aW9uU2VydmljZS5nZXQodGhpcy5pZCksIG5ld1NlbGVjdGlvbik7XG4gICAgICAgIGNvbnN0IGFkZGVkID0gZGlmZkluU2V0cyhuZXdTZWxlY3Rpb24sIHRoaXMuc2VsZWN0aW9uU2VydmljZS5nZXQodGhpcy5pZCkpO1xuICAgICAgICBjb25zdCBuZXdTZWxlY3Rpb25Bc0FycmF5ID0gQXJyYXkuZnJvbShuZXdTZWxlY3Rpb24pO1xuICAgICAgICBjb25zdCBvbGRTZWxlY3Rpb25Bc0FycmF5ID0gQXJyYXkuZnJvbSh0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0KHRoaXMuaWQpIHx8IFtdKTtcbiAgICAgICAgY29uc3QgZGlzcGxheVRleHQgPSB0aGlzLmNyZWF0ZURpc3BsYXlUZXh0KG5ld1NlbGVjdGlvbkFzQXJyYXksIG9sZFNlbGVjdGlvbkFzQXJyYXkpO1xuICAgICAgICBjb25zdCBhcmdzOiBJQ29tYm9TZWxlY3Rpb25DaGFuZ2luZ0V2ZW50QXJncyA9IHtcbiAgICAgICAgICAgIG5ld1NlbGVjdGlvbjogbmV3U2VsZWN0aW9uQXNBcnJheSxcbiAgICAgICAgICAgIG9sZFNlbGVjdGlvbjogb2xkU2VsZWN0aW9uQXNBcnJheSxcbiAgICAgICAgICAgIGFkZGVkLFxuICAgICAgICAgICAgcmVtb3ZlZCxcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICBkaXNwbGF5VGV4dCxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2luZy5lbWl0KGFyZ3MpO1xuICAgICAgICBpZiAoIWFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0X2l0ZW1zKHRoaXMuaWQsIGFyZ3MubmV3U2VsZWN0aW9uLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChkaXNwbGF5VGV4dCAhPT0gYXJncy5kaXNwbGF5VGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gYXJncy5kaXNwbGF5VGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLmNyZWF0ZURpc3BsYXlUZXh0KGFyZ3MubmV3U2VsZWN0aW9uLCBhcmdzLm9sZFNlbGVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKGFyZ3MubmV3U2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjcmVhdGVEaXNwbGF5VGV4dChuZXdTZWxlY3Rpb246IGFueVtdLCBvbGRTZWxlY3Rpb246IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzUmVtb3RlXG4gICAgICAgICAgICA/IHRoaXMuZ2V0UmVtb3RlU2VsZWN0aW9uKG5ld1NlbGVjdGlvbiwgb2xkU2VsZWN0aW9uKVxuICAgICAgICAgICAgOiB0aGlzLmNvbmNhdERpc3BsYXlUZXh0KG5ld1NlbGVjdGlvbik7XG4gICAgfVxuXG4gICAgLyoqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBzaG91bGQgYmUgcG9wdWxhdGVkIGluIHRoZSBjb21ibydzIHRleHQgYm94ICovXG4gICAgcHJpdmF0ZSBjb25jYXREaXNwbGF5VGV4dChzZWxlY3Rpb246IGFueVtdKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRpc3BsYXlLZXkgIT09IG51bGwgJiYgdGhpcy5kaXNwbGF5S2V5ICE9PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0S2V5c1RvSXRlbXMoc2VsZWN0aW9uKS5tYXAoZW50cnkgPT4gZW50cnlbdGhpcy5kaXNwbGF5S2V5XSkuam9pbignLCAnKSA6XG4gICAgICAgICAgICBzZWxlY3Rpb24uam9pbignLCAnKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneENvbWJvQWRkSXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4Q29tYm9BZGRJdGVtRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb21ib0NsZWFySWNvbkRpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29tYm9Db21wb25lbnQsXG4gICAgICAgIElneENvbWJvRHJvcERvd25Db21wb25lbnQsXG4gICAgICAgIElneENvbWJvRW1wdHlEaXJlY3RpdmUsXG4gICAgICAgIElneENvbWJvRmlsdGVyaW5nUGlwZSxcbiAgICAgICAgSWd4Q29tYm9DbGVhblBpcGUsXG4gICAgICAgIElneENvbWJvRm9vdGVyRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb21ib0dyb3VwaW5nUGlwZSxcbiAgICAgICAgSWd4Q29tYm9IZWFkZXJEaXJlY3RpdmUsXG4gICAgICAgIElneENvbWJvSGVhZGVySXRlbURpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29tYm9JdGVtQ29tcG9uZW50LFxuICAgICAgICBJZ3hDb21ib0l0ZW1EaXJlY3RpdmUsXG4gICAgICAgIElneENvbWJvVG9nZ2xlSWNvbkRpcmVjdGl2ZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hDb21ib0FkZEl0ZW1Db21wb25lbnQsXG4gICAgICAgIElneENvbWJvQWRkSXRlbURpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29tYm9DbGVhckljb25EaXJlY3RpdmUsXG4gICAgICAgIElneENvbWJvQ29tcG9uZW50LFxuICAgICAgICBJZ3hDb21ib0Ryb3BEb3duQ29tcG9uZW50LFxuICAgICAgICBJZ3hDb21ib0VtcHR5RGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb21ib0ZpbHRlcmluZ1BpcGUsXG4gICAgICAgIElneENvbWJvQ2xlYW5QaXBlLFxuICAgICAgICBJZ3hDb21ib0Zvb3RlckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29tYm9Hcm91cGluZ1BpcGUsXG4gICAgICAgIElneENvbWJvSGVhZGVyRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb21ib0hlYWRlckl0ZW1EaXJlY3RpdmUsXG4gICAgICAgIElneENvbWJvSXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4Q29tYm9JdGVtRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb21ib1RvZ2dsZUljb25EaXJlY3RpdmUsXG4gICAgICAgIElneElucHV0R3JvdXBNb2R1bGVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgSWd4QnV0dG9uTW9kdWxlLFxuICAgICAgICBJZ3hDaGVja2JveE1vZHVsZSxcbiAgICAgICAgSWd4RHJvcERvd25Nb2R1bGUsXG4gICAgICAgIElneEZvck9mTW9kdWxlLFxuICAgICAgICBJZ3hJY29uTW9kdWxlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlLFxuICAgICAgICBJZ3hSaXBwbGVNb2R1bGUsXG4gICAgICAgIElneFRvZ2dsZU1vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4Q29tYm9Nb2R1bGUgeyB9XG4iLCI8aWd4LWlucHV0LWdyb3VwICNpbnB1dEdyb3VwIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiIFt0eXBlXT1cInR5cGVcIiAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCI+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cIltpZ3hMYWJlbF1cIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2lneExhYmVsXVwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiaWd4LXByZWZpeFwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtcHJlZml4XCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJpZ3gtaGludCwgW2lneEhpbnRdXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1oaW50LCBbaWd4SGludF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPGlucHV0IGlneElucHV0ICNjb21ib0lucHV0IG5hbWU9XCJjb21ib0lucHV0XCIgdHlwZT1cInRleHRcIiBbdmFsdWVdPVwidmFsdWVcIiByZWFkb25seSBbYXR0ci5wbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIChibHVyKT1cIm9uQmx1cigpXCIgLz5cbiAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiaWd4LXN1ZmZpeFwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtc3VmZml4XCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxpZ3gtc3VmZml4ICpuZ0lmPVwidmFsdWUubGVuZ3RoXCIgYXJpYS1sYWJlbD1cIkNsZWFyIFNlbGVjdGlvblwiIGNsYXNzPVwiaWd4LWNvbWJvX19jbGVhci1idXR0b25cIlxuICAgICAgICAoY2xpY2spPVwiaGFuZGxlQ2xlYXJJdGVtcygkZXZlbnQpXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjbGVhckljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNsZWFySWNvblRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8aWd4LWljb24gKm5nSWY9XCIhY2xlYXJJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgIGNsZWFyXG4gICAgICAgIDwvaWd4LWljb24+XG4gICAgPC9pZ3gtc3VmZml4PlxuICAgIDxpZ3gtc3VmZml4IGNsYXNzPVwiaWd4LWNvbWJvX190b2dnbGUtYnV0dG9uXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0b2dnbGVJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0b2dnbGVJY29uVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHRoaXMuY29sbGFwc2VkfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPGlneC1pY29uICpuZ0lmPVwiIXRvZ2dsZUljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAge3sgZHJvcGRvd24uY29sbGFwc2VkID8gJ2Fycm93X2Ryb3BfZG93bicgOiAnYXJyb3dfZHJvcF91cCd9fVxuICAgICAgICA8L2lneC1pY29uPlxuICAgIDwvaWd4LXN1ZmZpeD5cbjwvaWd4LWlucHV0LWdyb3VwPlxuPGlneC1jb21iby1kcm9wLWRvd24gI2lneENvbWJvRHJvcERvd24gY2xhc3M9XCJpZ3gtY29tYm9fX2Ryb3AtZG93blwiIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiXG4gICAgW3dpZHRoXT1cIml0ZW1zV2lkdGggfHwgJzEwMCUnXCIgKG9wZW5pbmcpPVwiaGFuZGxlT3BlbmluZygkZXZlbnQpXCIgKGNsb3NpbmcpPVwiaGFuZGxlQ2xvc2luZygkZXZlbnQpXCJcbiAgICAob3BlbmVkKT1cImhhbmRsZU9wZW5lZCgpXCIgKGNsb3NlZCk9XCJoYW5kbGVDbG9zZWQoKVwiPlxuICAgIDxpZ3gtaW5wdXQtZ3JvdXAgKm5nSWY9XCJkaXNwbGF5U2VhcmNoSW5wdXRcIiBbZGlzcGxheURlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIiB0aGVtZT1cIm1hdGVyaWFsXCIgY2xhc3M9XCJpZ3gtY29tYm9fX3NlYXJjaFwiPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJpZ3gtY29tYm8taW5wdXRcIiBpZ3hJbnB1dCAjc2VhcmNoSW5wdXQgbmFtZT1cInNlYXJjaElucHV0XCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJzZWFyY2hWYWx1ZVwiIChuZ01vZGVsQ2hhbmdlKT1cImhhbmRsZUlucHV0Q2hhbmdlKCRldmVudClcIiAoa2V5dXApPVwiaGFuZGxlS2V5VXAoJGV2ZW50KVwiXG4gICAgICAgICAgICAoa2V5ZG93bik9XCJoYW5kbGVLZXlEb3duKCRldmVudClcIiAoZm9jdXMpPVwiZHJvcGRvd24ub25CbHVyKCRldmVudClcIiBbYXR0ci5wbGFjZWhvbGRlcl09XCJzZWFyY2hQbGFjZWhvbGRlclwiXG4gICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT1cImJvdGhcIiBbYXR0ci5hcmlhLW93bnNdPVwiZHJvcGRvd24uaWRcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIiAvPlxuICAgICAgICA8aWd4LXN1ZmZpeCAqbmdJZj1cInNob3dTZWFyY2hDYXNlSWNvblwiPlxuICAgICAgICAgICAgPGlneC1pY29uIGZhbWlseT1cImlteC1pY29uc1wiIG5hbWU9XCJjYXNlLXNlbnNpdGl2ZVwiIFthY3RpdmVdPVwiZmlsdGVyaW5nT3B0aW9ucy5jYXNlU2Vuc2l0aXZlXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlQ2FzZVNlbnNpdGl2ZSgpXCI+XG4gICAgICAgICAgICA8L2lneC1pY29uPlxuICAgICAgICA8L2lneC1zdWZmaXg+XG4gICAgPC9pZ3gtaW5wdXQtZ3JvdXA+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlXCI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPGRpdiAjZHJvcGRvd25JdGVtQ29udGFpbmVyIGNsYXNzPVwiaWd4LWNvbWJvX19jb250ZW50XCIgW3N0eWxlLm92ZXJmbG93XT1cIidoaWRkZW4nXCJcbiAgICAgICAgW3N0eWxlLm1heEhlaWdodC5weF09XCJpdGVtc01heEhlaWdodFwiIFtpZ3hEcm9wRG93bkl0ZW1OYXZpZ2F0aW9uXT1cImRyb3Bkb3duXCIgKGZvY3VzKT1cImRyb3Bkb3duLm9uRm9jdXMoKVwiXG4gICAgICAgIFt0YWJpbmRleF09XCJkcm9wZG93bi5jb2xsYXBzZWQgPyAtMSA6IDBcIiByb2xlPVwibGlzdGJveFwiIFthdHRyLmlkXT1cImRyb3Bkb3duLmlkXCI+XG4gICAgICAgIDxpZ3gtY29tYm8taXRlbSByb2xlPVwib3B0aW9uXCIgW2l0ZW1IZWlnaHRdPSdpdGVtSGVpZ2h0JyAqaWd4Rm9yPVwibGV0IGl0ZW0gb2YgZGF0YVxuICAgICAgICAgICAgfCBjb21ib0ZpbHRlcmluZzpmaWx0ZXJWYWx1ZTpkaXNwbGF5S2V5OmZpbHRlcmluZ09wdGlvbnM6ZmlsdGVyYWJsZVxuICAgICAgICAgICAgfCBjb21ib0dyb3VwaW5nOmdyb3VwS2V5OnZhbHVlS2V5Omdyb3VwU29ydGluZ0RpcmVjdGlvbjtcbiAgICAgICAgICAgIGluZGV4IGFzIHJvd0luZGV4OyBjb250YWluZXJTaXplOiBpdGVtc01heEhlaWdodDsgc2Nyb2xsT3JpZW50YXRpb246ICd2ZXJ0aWNhbCc7IGl0ZW1TaXplOiBpdGVtSGVpZ2h0XCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJpdGVtXCIgW2lzSGVhZGVyXT1cIml0ZW0uaXNIZWFkZXJcIiBbaW5kZXhdPVwicm93SW5kZXhcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpdGVtLmlzSGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlckl0ZW1UZW1wbGF0ZSA/IGhlYWRlckl0ZW1UZW1wbGF0ZSA6IGhlYWRlckl0ZW1CYXNlO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtLCBkYXRhOiBkYXRhLCB2YWx1ZUtleTogdmFsdWVLZXksIGdyb3VwS2V5OiBncm91cEtleSwgZGlzcGxheUtleTogZGlzcGxheUtleX1cIj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpdGVtLmlzSGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjbGlzdEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogaXRlbSwgZGF0YTogZGF0YSwgdmFsdWVLZXk6IHZhbHVlS2V5LCBkaXNwbGF5S2V5OiBkaXNwbGF5S2V5fTtcIj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2lneC1jb21iby1pdGVtPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtY29tYm9fX2FkZFwiICpuZ0lmPVwiZmlsdGVyZWREYXRhLmxlbmd0aCA9PT0gMCB8fCBpc0FkZEJ1dHRvblZpc2libGUoKVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWNvbWJvX19lbXB0eVwiICpuZ0lmPVwiZmlsdGVyZWREYXRhLmxlbmd0aCA9PT0gMFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVtcHR5VGVtcGxhdGUgPyBlbXB0eVRlbXBsYXRlIDogZW1wdHlcIj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGlneC1jb21iby1hZGQtaXRlbSBbaXRlbUhlaWdodF09XCJpdGVtSGVpZ2h0XCIgKm5nSWY9XCJpc0FkZEJ1dHRvblZpc2libGUoKVwiXG4gICAgICAgICAgICBbdGFiaW5kZXhdPVwiZHJvcGRvd24uY29sbGFwc2VkID8gLTEgOiBjdXN0b21WYWx1ZUZsYWcgPyAxIDogLTFcIiBjbGFzcz1cImlneC1jb21ib19fYWRkLWl0ZW1cIiByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJBZGQgSXRlbVwiIFtpbmRleF09XCJ2aXJ0dWFsU2Nyb2xsQ29udGFpbmVyLmlneEZvck9mLmxlbmd0aFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImFkZEl0ZW1UZW1wbGF0ZSA/IGFkZEl0ZW1UZW1wbGF0ZSA6IGFkZEl0ZW1EZWZhdWx0XCI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9pZ3gtY29tYm8tYWRkLWl0ZW0+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZvb3RlclRlbXBsYXRlXCI+XG4gICAgPC9uZy1jb250YWluZXI+XG48L2lneC1jb21iby1kcm9wLWRvd24+XG48bmctdGVtcGxhdGUgI2NvbXBsZXggbGV0LWRpc3BsYXkgbGV0LWRhdGE9XCJkYXRhXCIgbGV0LWtleT1cImRpc3BsYXlLZXlcIj5cbiAgICB7e2Rpc3BsYXlba2V5XX19XG48L25nLXRlbXBsYXRlPlxuPG5nLXRlbXBsYXRlICNwcmltaXRpdmUgbGV0LWRpc3BsYXk+XG4gICAge3tkaXNwbGF5fX1cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2VtcHR5PlxuICAgIDxzcGFuPlRoZSBsaXN0IGlzIGVtcHR5PC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjYWRkSXRlbURlZmF1bHQgbGV0LWNvbnRyb2w+XG4gICAgPGJ1dHRvbiBpZ3hCdXR0b249XCJmbGF0XCIgaWd4UmlwcGxlPkFkZCBpdGVtPC9idXR0b24+XG48L25nLXRlbXBsYXRlPlxuPG5nLXRlbXBsYXRlICNoZWFkZXJJdGVtQmFzZSBsZXQtaXRlbSBsZXQta2V5PVwidmFsdWVLZXlcIiBsZXQtZ3JvdXBLZXk9XCJncm91cEtleVwiPlxuICAgIHt7IGl0ZW1ba2V5XSB9fVxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==