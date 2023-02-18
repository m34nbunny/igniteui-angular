import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, NgModule, Optional, Output, ViewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IgxCheckboxModule } from '../checkbox/checkbox.component';
import { IgxComboAddItemComponent } from '../combo/combo-add-item.component';
import { IgxComboDropDownComponent } from '../combo/combo-dropdown.component';
import { IgxComboAPIService } from '../combo/combo.api';
import { IgxComboBaseDirective, IGX_COMBO_COMPONENT } from '../combo/combo.common';
import { IgxComboModule } from '../combo/combo.component';
import { DisplayDensityToken } from '../core/displayDensity';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxForOfModule } from '../directives/for-of/for_of.directive';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxTextSelectionDirective, IgxTextSelectionModule } from '../directives/text-selection/text-selection.directive';
import { IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxDropDownModule } from '../drop-down/public_api';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule, IGX_INPUT_GROUP_TYPE } from '../input-group/public_api';
import * as i0 from "@angular/core";
import * as i1 from "../core/selection";
import * as i2 from "../combo/combo.api";
import * as i3 from "../icon/public_api";
import * as i4 from "../core/utils";
import * as i5 from "../input-group/input-group.component";
import * as i6 from "../icon/icon.component";
import * as i7 from "../combo/combo-dropdown.component";
import * as i8 from "../combo/combo-item.component";
import * as i9 from "../combo/combo-add-item.component";
import * as i10 from "../directives/input/input.directive";
import * as i11 from "../directives/text-selection/text-selection.directive";
import * as i12 from "@angular/common";
import * as i13 from "../directives/suffix/suffix.directive";
import * as i14 from "../drop-down/drop-down-navigation.directive";
import * as i15 from "../directives/for-of/for_of.directive";
import * as i16 from "../directives/button/button.directive";
import * as i17 from "../directives/ripple/ripple.directive";
import * as i18 from "../combo/combo.pipes";
/**
 * Represents a drop-down list that provides filtering functionality, allowing users to choose a single option from a predefined list.
 *
 * @igxModule IgxSimpleComboModule
 * @igxTheme igx-combo-theme
 * @igxKeywords combobox, single combo selection
 * @igxGroup Grids & Lists
 *
 * @remarks
 * It provides the ability to filter items as well as perform single selection on the provided data.
 * Additionally, it exposes keyboard navigation and custom styling capabilities.
 * @example
 * ```html
 * <igx-simple-combo [itemsMaxHeight]="250" [data]="locationData"
 *  [displayKey]="'field'" [valueKey]="'field'"
 *  placeholder="Location" searchPlaceholder="Search...">
 * </igx-simple-combo>
 * ```
 */
export class IgxSimpleComboComponent extends IgxComboBaseDirective {
    constructor(elementRef, cdr, selectionService, comboAPI, _iconService, platformUtil, _displayDensityOptions, _inputGroupType, _injector) {
        super(elementRef, cdr, selectionService, comboAPI, _iconService, _displayDensityOptions, _inputGroupType, _injector);
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.selectionService = selectionService;
        this.comboAPI = comboAPI;
        this._iconService = _iconService;
        this.platformUtil = platformUtil;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        this._injector = _injector;
        /**
         * Emitted when item selection is changing, before the selection completes
         *
         * ```html
         * <igx-simple-combo (selectionChanging)='handleSelection()'></igx-simple-combo>
         * ```
         */
        this.selectionChanging = new EventEmitter();
        /** @hidden @internal */
        this.composing = false;
        this._updateInput = true;
        // stores the last filtered value - move to common?
        this._internalFilter = '';
        this.findMatch = (element) => {
            const value = this.displayKey ? element[this.displayKey] : element;
            if (value === null || value === undefined || value === '') {
                // we can accept null, undefined and empty strings as empty display values
                return true;
            }
            const searchValue = this.searchValue || this.comboInput.value;
            return !!searchValue && value.toString().toLowerCase().includes(searchValue.trim().toLowerCase());
        };
        this.comboAPI.register(this);
    }
    /** @hidden @internal */
    get filteredData() {
        return this._filteredData;
    }
    /** @hidden @internal */
    set filteredData(val) {
        this._filteredData = this.groupKey ? (val || []).filter((e) => e.isHeader !== true) : val;
        this.checkMatch();
    }
    /** @hidden @internal */
    get searchValue() {
        return this._searchValue;
    }
    set searchValue(val) {
        this._searchValue = val;
    }
    get selectedItem() {
        return this.selectionService.get(this.id).values().next().value;
    }
    /** @hidden @internal */
    onArrowDown(event) {
        if (this.collapsed) {
            event.preventDefault();
            event.stopPropagation();
            this.open();
        }
        else {
            if (this.virtDir.igxForOf.length > 0) {
                this.dropdown.navigateFirst();
                this.dropdownContainer.nativeElement.focus();
            }
            else if (this.allowCustomValues) {
                this.addItem.element.nativeElement.focus();
            }
        }
    }
    /**
     * Select a defined item
     *
     * @param item the item to be selected
     * ```typescript
     * this.combo.select("New York");
     * ```
     */
    select(item) {
        if (item !== null && item !== undefined) {
            const newSelection = this.selectionService.add_items(this.id, item instanceof Array ? item : [item], true);
            this.setSelection(newSelection);
        }
    }
    /**
     * Deselect the currently selected item
     *
     * @param item the items to be deselected
     * ```typescript
     * this.combo.deselect("New York");
     * ```
     */
    deselect() {
        this.clearSelection();
    }
    /** @hidden @internal */
    writeValue(value) {
        const oldSelection = this.selection;
        this.selectionService.select_items(this.id, value ? [value] : [], true);
        this.cdr.markForCheck();
        this._value = this.createDisplayText(this.selection, oldSelection);
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        this.virtDir.contentSizeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.selection.length > 0) {
                const index = this.virtDir.igxForOf.findIndex(e => {
                    let current = e[this.valueKey];
                    if (this.valueKey === null || this.valueKey === undefined) {
                        current = e;
                    }
                    return current === this.selection[0];
                });
                this.dropdown.navigateItem(index);
            }
        });
        this.dropdown.opening.pipe(takeUntil(this.destroy$)).subscribe(() => {
            const filtered = this.filteredData.find(this.findMatch);
            if (filtered === undefined || filtered === null) {
                this.filterValue = this.searchValue = this.comboInput.value;
                return;
            }
            this.filterValue = this.searchValue = '';
        });
        this.dropdown.opened.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.composing) {
                this.comboInput.focus();
            }
            this._internalFilter = this.comboInput.value;
        });
        this.dropdown.closing.pipe(takeUntil(this.destroy$)).subscribe((args) => {
            if (this.getEditElement() && !args.event) {
                this.comboInput.focus();
            }
            else {
                this.clearOnBlur();
                this._onTouchedCallback();
            }
        });
        this.dropdown.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.filterValue = this._internalFilter = this.comboInput.value;
        });
        super.ngAfterViewInit();
    }
    /** @hidden @internal */
    handleInputChange(event) {
        if (event !== undefined) {
            this.filterValue = this._internalFilter = this.searchValue = typeof event === 'string' ? event : event.target.value;
        }
        this._onChangeCallback(this.searchValue);
        if (this.collapsed && this.comboInput.focused) {
            this.open();
        }
        if (!this.comboInput.value.trim()) {
            // handle clearing of input by space
            this.clearSelection();
            this._onChangeCallback(null);
        }
        // when filtering the focused item should be the first item or the currently selected item
        if (!this.dropdown.focusedItem || this.dropdown.focusedItem.id !== this.dropdown.items[0].id) {
            this.dropdown.navigateFirst();
        }
        super.handleInputChange(event);
        this.composing = true;
    }
    /** @hidden @internal */
    handleKeyDown(event) {
        if (event.key === this.platformUtil.KEYMAP.ENTER) {
            const filtered = this.filteredData.find(this.findMatch);
            if (filtered === null || filtered === undefined) {
                return;
            }
            this.select(this.dropdown.focusedItem.itemID);
            event.preventDefault();
            event.stopPropagation();
            this.close();
            // manually trigger text selection as it will not be triggered during editing
            this.textSelection.trigger();
            this.filterValue = this.getElementVal(filtered);
            return;
        }
        if (event.key === this.platformUtil.KEYMAP.BACKSPACE
            || event.key === this.platformUtil.KEYMAP.DELETE) {
            this._updateInput = false;
            this.clearSelection(true);
        }
        if (!this.collapsed && event.key === this.platformUtil.KEYMAP.TAB) {
            this.clearOnBlur();
        }
        this.composing = false;
        super.handleKeyDown(event);
    }
    /** @hidden @internal */
    handleKeyUp(event) {
        if (event.key === this.platformUtil.KEYMAP.ARROW_DOWN) {
            const firstItem = this.selectionService.first_item(this.id);
            this.dropdown.focusedItem = firstItem && this.filteredData.length > 0
                ? this.dropdown.items.find(i => i.itemID === firstItem)
                : this.dropdown.items[0];
            this.dropdownContainer.nativeElement.focus();
        }
    }
    /** @hidden @internal */
    handleItemKeyDown(event) {
        if (event.key === this.platformUtil.KEYMAP.ARROW_UP && event.altKey) {
            this.close();
            this.comboInput.focus();
            return;
        }
        if (event.key === this.platformUtil.KEYMAP.ENTER) {
            this.comboInput.focus();
        }
    }
    /** @hidden @internal */
    handleItemClick() {
        this.close();
        this.comboInput.focus();
    }
    /** @hidden @internal */
    onBlur() {
        if (this.collapsed) {
            this.clearOnBlur();
        }
        super.onBlur();
    }
    /** @hidden @internal */
    onFocus() {
        this._internalFilter = this.comboInput.value || '';
    }
    /** @hidden @internal */
    getEditElement() {
        return this.comboInput.nativeElement;
    }
    /** @hidden @internal */
    handleClear(event) {
        if (this.disabled) {
            return;
        }
        this.clearSelection(true);
        if (this.collapsed) {
            this.open();
            this.dropdown.navigateFirst();
        }
        else {
            this.focusSearchInput(true);
        }
        event.stopPropagation();
        this.comboInput.value = this.filterValue = this.searchValue = '';
        this.dropdown.focusedItem = null;
        this.composing = false;
        this.comboInput.focus();
    }
    /** @hidden @internal */
    handleOpened() {
        this.triggerCheck();
        this.dropdownContainer.nativeElement.focus();
        this.opened.emit({ owner: this });
    }
    /** @hidden @internal */
    handleClosing(e) {
        const args = { owner: this, event: e.event, cancel: e.cancel };
        this.closing.emit(args);
        e.cancel = args.cancel;
        if (e.cancel) {
            return;
        }
        this.composing = false;
        // explicitly update selection and trigger text selection so that we don't have to force CD
        this.textSelection.selected = true;
        this.textSelection.trigger();
    }
    /** @hidden @internal */
    focusSearchInput(opening) {
        if (opening) {
            this.dropdownContainer.nativeElement.focus();
        }
        else {
            this.comboInput.nativeElement.focus();
            this.toggle();
        }
    }
    /** @hidden @internal */
    onClick(event) {
        super.onClick(event);
        if (this.comboInput.value.length === 0) {
            this.virtDir.scrollTo(0);
        }
    }
    setSelection(newSelection) {
        const newSelectionAsArray = newSelection ? Array.from(newSelection) : [];
        const oldSelectionAsArray = Array.from(this.selectionService.get(this.id) || []);
        const displayText = this.createDisplayText(newSelectionAsArray, oldSelectionAsArray);
        const args = {
            newSelection: newSelectionAsArray[0],
            oldSelection: oldSelectionAsArray[0],
            displayText,
            owner: this,
            cancel: false
        };
        this.selectionChanging.emit(args);
        if (!args.cancel) {
            let argsSelection = args.newSelection !== undefined
                && args.newSelection !== null
                ? args.newSelection
                : [];
            argsSelection = Array.isArray(argsSelection) ? argsSelection : [argsSelection];
            this.selectionService.select_items(this.id, argsSelection, true);
            if (this._updateInput) {
                this.comboInput.value = this._internalFilter = this._value = displayText !== args.displayText
                    ? args.displayText
                    : this.createDisplayText(argsSelection, [args.oldSelection]);
            }
            this._onChangeCallback(args.newSelection);
            this._updateInput = true;
        }
    }
    createDisplayText(newSelection, oldSelection) {
        if (this.isRemote) {
            return this.getRemoteSelection(newSelection, oldSelection);
        }
        if (this.displayKey !== null && this.displayKey !== undefined
            && newSelection.length > 0) {
            return this.convertKeysToItems(newSelection).map(e => e[this.displayKey])[0];
        }
        return newSelection[0] || '';
    }
    clearSelection(ignoreFilter) {
        let newSelection = this.selectionService.get_empty();
        if (this.filteredData.length !== this.data.length && !ignoreFilter) {
            newSelection = this.selectionService.delete_items(this.id, this.selectionService.get_all_ids(this.filteredData, this.valueKey));
        }
        this.setSelection(newSelection);
    }
    clearOnBlur() {
        const filtered = this.filteredData.find(this.findMatch);
        if (filtered === undefined || filtered === null || !this.selectedItem) {
            this.clearAndClose();
            return;
        }
        if (this.isPartialMatch(filtered) || this.getElementVal(filtered) !== this._internalFilter) {
            this.clearAndClose();
        }
    }
    isPartialMatch(filtered) {
        return !!this._internalFilter && this._internalFilter.length !== this.getElementVal(filtered).length;
    }
    getElementVal(element) {
        if (!element) {
            return null;
        }
        const elementVal = this.displayKey ? element[this.displayKey] : element;
        return (elementVal === 0 ? '0' : elementVal) || '';
    }
    clearAndClose() {
        this.clearSelection(true);
        this._internalFilter = '';
        this.searchValue = '';
        if (!this.collapsed) {
            this.close();
        }
    }
}
IgxSimpleComboComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSimpleComboComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.IgxSelectionAPIService }, { token: i2.IgxComboAPIService }, { token: i3.IgxIconService }, { token: i4.PlatformUtil }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }, { token: i0.Injector, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxSimpleComboComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSimpleComboComponent, selector: "igx-simple-combo", outputs: { selectionChanging: "selectionChanging" }, host: { listeners: { "keydown.ArrowDown": "onArrowDown($event)", "keydown.Alt.ArrowDown": "onArrowDown($event)" } }, providers: [
        IgxComboAPIService,
        { provide: IGX_COMBO_COMPONENT, useExisting: IgxSimpleComboComponent },
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxSimpleComboComponent, multi: true }
    ], viewQueries: [{ propertyName: "dropdown", first: true, predicate: IgxComboDropDownComponent, descendants: true, static: true }, { propertyName: "addItem", first: true, predicate: IgxComboAddItemComponent, descendants: true }, { propertyName: "textSelection", first: true, predicate: IgxTextSelectionDirective, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<igx-input-group #inputGroup [displayDensity]=\"displayDensity\" [suppressInputAutofocus]=\"true\" [type]=\"type\">\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint, [igxHint]\">\n        <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n    </ng-container>\n\n    <input #comboInput igxInput [value]=\"value\" (focus)=\"onFocus()\" (input)=\"handleInputChange($event)\" (keyup)=\"handleKeyUp($event)\"\n        (keydown)=\"handleKeyDown($event)\" (blur)=\"onBlur()\" [attr.placeholder]=\"placeholder\" aria-autocomplete=\"both\"\n        [attr.aria-owns]=\"dropdown.id\" [attr.aria-labelledby]=\"ariaLabelledBy\" [disabled]=\"disabled\"\n        [igxTextSelection]=\"!composing\" />\n\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix\"></ng-content>\n    </ng-container>\n    <igx-suffix *ngIf=\"comboInput.value.length\" aria-label=\"Clear Selection\" class=\"igx-combo__clear-button\"\n        (click)=\"handleClear($event)\">\n        <ng-container *ngIf=\"clearIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"clearIconTemplate\"></ng-container>\n        </ng-container>\n        <igx-icon *ngIf=\"!clearIconTemplate\">\n            clear\n        </igx-icon>\n    </igx-suffix>\n    <igx-suffix *ngIf=\"showSearchCaseIcon\">\n        <igx-icon family=\"imx-icons\" name=\"case-sensitive\" [active]=\"filteringOptions.caseSensitive\"\n            (click)=\"toggleCaseSensitive()\">\n        </igx-icon>\n    </igx-suffix>\n    <igx-suffix class=\"igx-combo__toggle-button\">\n        <ng-container *ngIf=\"toggleIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"toggleIconTemplate; context: {$implicit: collapsed}\"></ng-container>\n        </ng-container>\n        <igx-icon (click)=\"onClick($event)\" *ngIf=\"!toggleIconTemplate\">\n            {{ dropdown.collapsed ? 'arrow_drop_down' : 'arrow_drop_up'}}\n        </igx-icon>\n    </igx-suffix>\n</igx-input-group>\n\n<igx-combo-drop-down #igxComboDropDown class=\"igx-combo__drop-down\" [displayDensity]=\"displayDensity\"\n    [width]=\"itemsWidth || '100%'\" (opening)=\"handleOpening($event)\" (closing)=\"handleClosing($event)\"\n    (opened)=\"handleOpened()\" (closed)=\"handleClosed()\" [singleMode]=\"true\">\n    <ng-container *ngTemplateOutlet=\"headerTemplate\">\n    </ng-container>\n    <div #dropdownItemContainer class=\"igx-combo__content\" [style.overflow]=\"'hidden'\"\n        [style.maxHeight.px]=\"itemsMaxHeight\" [igxDropDownItemNavigation]=\"dropdown\" (focus)=\"dropdown.onFocus()\"\n        [tabindex]=\"dropdown.collapsed ? -1 : 0\" role=\"listbox\" [attr.id]=\"dropdown.id\"\n        (keydown)=\"handleItemKeyDown($event)\">\n        <igx-combo-item role=\"option\" [singleMode]=\"true\" [itemHeight]='itemHeight' (click)=\"handleItemClick()\" *igxFor=\"let item of data\n            | comboClean\n            | comboFiltering:filterValue:displayKey:filteringOptions:true\n            | comboGrouping:groupKey:valueKey:groupSortingDirection;\n            index as rowIndex; containerSize: itemsMaxHeight; scrollOrientation: 'vertical'; itemSize: itemHeight\"\n            [value]=\"item\" [isHeader]=\"item.isHeader\" [index]=\"rowIndex\">\n            <ng-container *ngIf=\"item.isHeader\">\n                <ng-container\n                    *ngTemplateOutlet=\"headerItemTemplate ? headerItemTemplate : headerItemBase;\n                    context: {$implicit: item, data: data, valueKey: valueKey, groupKey: groupKey, displayKey: displayKey}\">\n                </ng-container>\n            </ng-container>\n            <ng-container *ngIf=\"!item.isHeader\">\n                <ng-container #listItem\n                    *ngTemplateOutlet=\"template; context: {$implicit: item, data: data, valueKey: valueKey, displayKey: displayKey};\">\n                </ng-container>\n            </ng-container>\n        </igx-combo-item>\n    </div>\n\n    <div class=\"igx-combo__add\" *ngIf=\"filteredData.length === 0 || isAddButtonVisible()\">\n        <div class=\"igx-combo__empty\" *ngIf=\"filteredData.length === 0\">\n            <ng-container *ngTemplateOutlet=\"emptyTemplate ? emptyTemplate : empty\">\n            </ng-container>\n        </div>\n        <igx-combo-add-item #addItem [itemHeight]=\"itemHeight\" *ngIf=\"isAddButtonVisible()\"\n            [tabindex]=\"dropdown.collapsed ? -1 : customValueFlag ? 1 : -1\" class=\"igx-combo__add-item\" role=\"button\"\n            aria-label=\"Add Item\" [index]=\"virtualScrollContainer.igxForOf.length\">\n            <ng-container *ngTemplateOutlet=\"addItemTemplate ? addItemTemplate : addItemDefault\">\n            </ng-container>\n        </igx-combo-add-item>\n    </div>\n    <ng-container *ngTemplateOutlet=\"footerTemplate\">\n    </ng-container>\n</igx-combo-drop-down>\n\n<ng-template #complex let-display let-data=\"data\" let-key=\"displayKey\">\n    {{display[key]}}\n</ng-template>\n<ng-template #primitive let-display>\n    {{display}}\n</ng-template>\n<ng-template #empty>\n    <span>The list is empty</span>\n</ng-template>\n<ng-template #addItemDefault let-control>\n    <button igxButton=\"flat\" igxRipple>Add item</button>\n</ng-template>\n<ng-template #headerItemBase let-item let-key=\"valueKey\" let-groupKey=\"groupKey\">\n    {{ item[key] }}\n</ng-template>\n", components: [{ type: i5.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i6.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i7.IgxComboDropDownComponent, selector: "igx-combo-drop-down", inputs: ["singleMode"] }, { type: i8.IgxComboItemComponent, selector: "igx-combo-item", inputs: ["itemHeight", "singleMode"] }, { type: i9.IgxComboAddItemComponent, selector: "igx-combo-add-item" }], directives: [{ type: i10.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i11.IgxTextSelectionDirective, selector: "[igxTextSelection]", inputs: ["igxTextSelection"], exportAs: ["igxTextSelection"] }, { type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i13.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i12.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i14.IgxDropDownItemNavigationDirective, selector: "[igxDropDownItemNavigation]", inputs: ["igxDropDownItemNavigation"] }, { type: i15.IgxForOfDirective, selector: "[igxFor][igxForOf]", inputs: ["igxForOf", "igxForSizePropName", "igxForScrollOrientation", "igxForScrollContainer", "igxForContainerSize", "igxForItemSize", "igxForTotalItemCount", "igxForTrackBy"], outputs: ["chunkLoad", "scrollbarVisibilityChanged", "contentSizeChange", "dataChanged", "beforeViewDestroyed", "chunkPreload"] }, { type: i16.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i17.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }], pipes: { "comboGrouping": i18.IgxComboGroupingPipe, "comboFiltering": i18.IgxComboFilteringPipe, "comboClean": i18.IgxComboCleanPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSimpleComboComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-simple-combo', providers: [
                        IgxComboAPIService,
                        { provide: IGX_COMBO_COMPONENT, useExisting: IgxSimpleComboComponent },
                        { provide: NG_VALUE_ACCESSOR, useExisting: IgxSimpleComboComponent, multi: true }
                    ], template: "<igx-input-group #inputGroup [displayDensity]=\"displayDensity\" [suppressInputAutofocus]=\"true\" [type]=\"type\">\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint, [igxHint]\">\n        <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n    </ng-container>\n\n    <input #comboInput igxInput [value]=\"value\" (focus)=\"onFocus()\" (input)=\"handleInputChange($event)\" (keyup)=\"handleKeyUp($event)\"\n        (keydown)=\"handleKeyDown($event)\" (blur)=\"onBlur()\" [attr.placeholder]=\"placeholder\" aria-autocomplete=\"both\"\n        [attr.aria-owns]=\"dropdown.id\" [attr.aria-labelledby]=\"ariaLabelledBy\" [disabled]=\"disabled\"\n        [igxTextSelection]=\"!composing\" />\n\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix\"></ng-content>\n    </ng-container>\n    <igx-suffix *ngIf=\"comboInput.value.length\" aria-label=\"Clear Selection\" class=\"igx-combo__clear-button\"\n        (click)=\"handleClear($event)\">\n        <ng-container *ngIf=\"clearIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"clearIconTemplate\"></ng-container>\n        </ng-container>\n        <igx-icon *ngIf=\"!clearIconTemplate\">\n            clear\n        </igx-icon>\n    </igx-suffix>\n    <igx-suffix *ngIf=\"showSearchCaseIcon\">\n        <igx-icon family=\"imx-icons\" name=\"case-sensitive\" [active]=\"filteringOptions.caseSensitive\"\n            (click)=\"toggleCaseSensitive()\">\n        </igx-icon>\n    </igx-suffix>\n    <igx-suffix class=\"igx-combo__toggle-button\">\n        <ng-container *ngIf=\"toggleIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"toggleIconTemplate; context: {$implicit: collapsed}\"></ng-container>\n        </ng-container>\n        <igx-icon (click)=\"onClick($event)\" *ngIf=\"!toggleIconTemplate\">\n            {{ dropdown.collapsed ? 'arrow_drop_down' : 'arrow_drop_up'}}\n        </igx-icon>\n    </igx-suffix>\n</igx-input-group>\n\n<igx-combo-drop-down #igxComboDropDown class=\"igx-combo__drop-down\" [displayDensity]=\"displayDensity\"\n    [width]=\"itemsWidth || '100%'\" (opening)=\"handleOpening($event)\" (closing)=\"handleClosing($event)\"\n    (opened)=\"handleOpened()\" (closed)=\"handleClosed()\" [singleMode]=\"true\">\n    <ng-container *ngTemplateOutlet=\"headerTemplate\">\n    </ng-container>\n    <div #dropdownItemContainer class=\"igx-combo__content\" [style.overflow]=\"'hidden'\"\n        [style.maxHeight.px]=\"itemsMaxHeight\" [igxDropDownItemNavigation]=\"dropdown\" (focus)=\"dropdown.onFocus()\"\n        [tabindex]=\"dropdown.collapsed ? -1 : 0\" role=\"listbox\" [attr.id]=\"dropdown.id\"\n        (keydown)=\"handleItemKeyDown($event)\">\n        <igx-combo-item role=\"option\" [singleMode]=\"true\" [itemHeight]='itemHeight' (click)=\"handleItemClick()\" *igxFor=\"let item of data\n            | comboClean\n            | comboFiltering:filterValue:displayKey:filteringOptions:true\n            | comboGrouping:groupKey:valueKey:groupSortingDirection;\n            index as rowIndex; containerSize: itemsMaxHeight; scrollOrientation: 'vertical'; itemSize: itemHeight\"\n            [value]=\"item\" [isHeader]=\"item.isHeader\" [index]=\"rowIndex\">\n            <ng-container *ngIf=\"item.isHeader\">\n                <ng-container\n                    *ngTemplateOutlet=\"headerItemTemplate ? headerItemTemplate : headerItemBase;\n                    context: {$implicit: item, data: data, valueKey: valueKey, groupKey: groupKey, displayKey: displayKey}\">\n                </ng-container>\n            </ng-container>\n            <ng-container *ngIf=\"!item.isHeader\">\n                <ng-container #listItem\n                    *ngTemplateOutlet=\"template; context: {$implicit: item, data: data, valueKey: valueKey, displayKey: displayKey};\">\n                </ng-container>\n            </ng-container>\n        </igx-combo-item>\n    </div>\n\n    <div class=\"igx-combo__add\" *ngIf=\"filteredData.length === 0 || isAddButtonVisible()\">\n        <div class=\"igx-combo__empty\" *ngIf=\"filteredData.length === 0\">\n            <ng-container *ngTemplateOutlet=\"emptyTemplate ? emptyTemplate : empty\">\n            </ng-container>\n        </div>\n        <igx-combo-add-item #addItem [itemHeight]=\"itemHeight\" *ngIf=\"isAddButtonVisible()\"\n            [tabindex]=\"dropdown.collapsed ? -1 : customValueFlag ? 1 : -1\" class=\"igx-combo__add-item\" role=\"button\"\n            aria-label=\"Add Item\" [index]=\"virtualScrollContainer.igxForOf.length\">\n            <ng-container *ngTemplateOutlet=\"addItemTemplate ? addItemTemplate : addItemDefault\">\n            </ng-container>\n        </igx-combo-add-item>\n    </div>\n    <ng-container *ngTemplateOutlet=\"footerTemplate\">\n    </ng-container>\n</igx-combo-drop-down>\n\n<ng-template #complex let-display let-data=\"data\" let-key=\"displayKey\">\n    {{display[key]}}\n</ng-template>\n<ng-template #primitive let-display>\n    {{display}}\n</ng-template>\n<ng-template #empty>\n    <span>The list is empty</span>\n</ng-template>\n<ng-template #addItemDefault let-control>\n    <button igxButton=\"flat\" igxRipple>Add item</button>\n</ng-template>\n<ng-template #headerItemBase let-item let-key=\"valueKey\" let-groupKey=\"groupKey\">\n    {{ item[key] }}\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.IgxSelectionAPIService }, { type: i2.IgxComboAPIService }, { type: i3.IgxIconService }, { type: i4.PlatformUtil }, { type: undefined, decorators: [{
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
                }] }]; }, propDecorators: { dropdown: [{
                type: ViewChild,
                args: [IgxComboDropDownComponent, { static: true }]
            }], addItem: [{
                type: ViewChild,
                args: [IgxComboAddItemComponent]
            }], selectionChanging: [{
                type: Output
            }], textSelection: [{
                type: ViewChild,
                args: [IgxTextSelectionDirective, { static: true }]
            }], onArrowDown: [{
                type: HostListener,
                args: ['keydown.ArrowDown', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.Alt.ArrowDown', ['$event']]
            }] } });
export class IgxSimpleComboModule {
}
IgxSimpleComboModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSimpleComboModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxSimpleComboModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSimpleComboModule, declarations: [IgxSimpleComboComponent], imports: [IgxComboModule, IgxRippleModule, CommonModule,
        IgxInputGroupModule, FormsModule, ReactiveFormsModule,
        IgxForOfModule, IgxToggleModule, IgxCheckboxModule,
        IgxDropDownModule, IgxButtonModule, IgxIconModule,
        IgxTextSelectionModule], exports: [IgxSimpleComboComponent, IgxComboModule] });
IgxSimpleComboModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSimpleComboModule, imports: [[
            IgxComboModule, IgxRippleModule, CommonModule,
            IgxInputGroupModule, FormsModule, ReactiveFormsModule,
            IgxForOfModule, IgxToggleModule, IgxCheckboxModule,
            IgxDropDownModule, IgxButtonModule, IgxIconModule,
            IgxTextSelectionModule
        ], IgxComboModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSimpleComboModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxSimpleComboComponent],
                    imports: [
                        IgxComboModule, IgxRippleModule, CommonModule,
                        IgxInputGroupModule, FormsModule, ReactiveFormsModule,
                        IgxForOfModule, IgxToggleModule, IgxCheckboxModule,
                        IgxDropDownModule, IgxButtonModule, IgxIconModule,
                        IgxTextSelectionModule
                    ],
                    exports: [IgxSimpleComboComponent, IgxComboModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLWNvbWJvLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zaW1wbGUtY29tYm8vc2ltcGxlLWNvbWJvLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zaW1wbGUtY29tYm8vc2ltcGxlLWNvbWJvLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQytCLFNBQVMsRUFBYyxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFDM0YsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUN4QyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUU5RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUEwQixNQUFNLHdCQUF3QixDQUFDO0FBR3JGLE9BQU8sRUFBRSxlQUFlLEVBQUUs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ci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5qZWN0LCBJbmplY3RvcixcbiAgICBOZ01vZHVsZSwgT3B0aW9uYWwsIE91dHB1dCwgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEZvcm1zTW9kdWxlLCBOR19WQUxVRV9BQ0NFU1NPUiwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IElneENoZWNrYm94TW9kdWxlIH0gZnJvbSAnLi4vY2hlY2tib3gvY2hlY2tib3guY29tcG9uZW50JztcbmltcG9ydCB7IElneENvbWJvQWRkSXRlbUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbWJvL2NvbWJvLWFkZC1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hDb21ib0Ryb3BEb3duQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tYm8vY29tYm8tZHJvcGRvd24uY29tcG9uZW50JztcbmltcG9ydCB7IElneENvbWJvSXRlbUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbWJvL2NvbWJvLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IElneENvbWJvQVBJU2VydmljZSB9IGZyb20gJy4uL2NvbWJvL2NvbWJvLmFwaSc7XG5pbXBvcnQgeyBJZ3hDb21ib0Jhc2VEaXJlY3RpdmUsIElHWF9DT01CT19DT01QT05FTlQgfSBmcm9tICcuLi9jb21iby9jb21iby5jb21tb24nO1xuaW1wb3J0IHsgSWd4Q29tYm9Nb2R1bGUgfSBmcm9tICcuLi9jb21iby9jb21iby5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGlzcGxheURlbnNpdHknO1xuaW1wb3J0IHsgSWd4U2VsZWN0aW9uQVBJU2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VsZWN0aW9uJztcbmltcG9ydCB7IENhbmNlbGFibGVFdmVudEFyZ3MsIElCYXNlQ2FuY2VsYWJsZUJyb3dzZXJFdmVudEFyZ3MsIElCYXNlRXZlbnRBcmdzLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneEJ1dHRvbk1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvYnV0dG9uL2J1dHRvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4Rm9yT2ZNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2Zvci1vZi9mb3Jfb2YuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvcmlwcGxlL3JpcHBsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4VGV4dFNlbGVjdGlvbkRpcmVjdGl2ZSwgSWd4VGV4dFNlbGVjdGlvbk1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdGV4dC1zZWxlY3Rpb24vdGV4dC1zZWxlY3Rpb24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFRvZ2dsZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdG9nZ2xlL3RvZ2dsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4RHJvcERvd25Nb2R1bGUgfSBmcm9tICcuLi9kcm9wLWRvd24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlLCBJZ3hJY29uU2VydmljZSB9IGZyb20gJy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwTW9kdWxlLCBJZ3hJbnB1dEdyb3VwVHlwZSwgSUdYX0lOUFVUX0dST1VQX1RZUEUgfSBmcm9tICcuLi9pbnB1dC1ncm91cC9wdWJsaWNfYXBpJztcblxuLyoqIEVtaXR0ZWQgd2hlbiBhbiBpZ3gtc2ltcGxlLWNvbWJvJ3Mgc2VsZWN0aW9uIGlzIGNoYW5naW5nLiAgKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNpbXBsZUNvbWJvU2VsZWN0aW9uQ2hhbmdpbmdFdmVudEFyZ3MgZXh0ZW5kcyBDYW5jZWxhYmxlRXZlbnRBcmdzLCBJQmFzZUV2ZW50QXJncyB7XG4gICAgLyoqIEFuIG9iamVjdCB3aGljaCByZXByZXNlbnRzIHRoZSB2YWx1ZSB0aGF0IGlzIGN1cnJlbnRseSBzZWxlY3RlZCAqL1xuICAgIG9sZFNlbGVjdGlvbjogYW55O1xuICAgIC8qKiBBbiBvYmplY3Qgd2hpY2ggcmVwcmVzZW50cyB0aGUgdmFsdWUgdGhhdCB3aWxsIGJlIHNlbGVjdGVkIGFmdGVyIHRoaXMgZXZlbnQgKi9cbiAgICBuZXdTZWxlY3Rpb246IGFueTtcbiAgICAvKiogVGhlIHRleHQgdGhhdCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0aGUgY29tYm8gdGV4dCBib3ggKi9cbiAgICBkaXNwbGF5VGV4dDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBkcm9wLWRvd24gbGlzdCB0aGF0IHByb3ZpZGVzIGZpbHRlcmluZyBmdW5jdGlvbmFsaXR5LCBhbGxvd2luZyB1c2VycyB0byBjaG9vc2UgYSBzaW5nbGUgb3B0aW9uIGZyb20gYSBwcmVkZWZpbmVkIGxpc3QuXG4gKlxuICogQGlneE1vZHVsZSBJZ3hTaW1wbGVDb21ib01vZHVsZVxuICogQGlneFRoZW1lIGlneC1jb21iby10aGVtZVxuICogQGlneEtleXdvcmRzIGNvbWJvYm94LCBzaW5nbGUgY29tYm8gc2VsZWN0aW9uXG4gKiBAaWd4R3JvdXAgR3JpZHMgJiBMaXN0c1xuICpcbiAqIEByZW1hcmtzXG4gKiBJdCBwcm92aWRlcyB0aGUgYWJpbGl0eSB0byBmaWx0ZXIgaXRlbXMgYXMgd2VsbCBhcyBwZXJmb3JtIHNpbmdsZSBzZWxlY3Rpb24gb24gdGhlIHByb3ZpZGVkIGRhdGEuXG4gKiBBZGRpdGlvbmFsbHksIGl0IGV4cG9zZXMga2V5Ym9hcmQgbmF2aWdhdGlvbiBhbmQgY3VzdG9tIHN0eWxpbmcgY2FwYWJpbGl0aWVzLlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtc2ltcGxlLWNvbWJvIFtpdGVtc01heEhlaWdodF09XCIyNTBcIiBbZGF0YV09XCJsb2NhdGlvbkRhdGFcIlxuICogIFtkaXNwbGF5S2V5XT1cIidmaWVsZCdcIiBbdmFsdWVLZXldPVwiJ2ZpZWxkJ1wiXG4gKiAgcGxhY2Vob2xkZXI9XCJMb2NhdGlvblwiIHNlYXJjaFBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCI+XG4gKiA8L2lneC1zaW1wbGUtY29tYm8+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtc2ltcGxlLWNvbWJvJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3NpbXBsZS1jb21iby5jb21wb25lbnQuaHRtbCcsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIElneENvbWJvQVBJU2VydmljZSxcbiAgICAgICAgeyBwcm92aWRlOiBJR1hfQ09NQk9fQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogSWd4U2ltcGxlQ29tYm9Db21wb25lbnQgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IElneFNpbXBsZUNvbWJvQ29tcG9uZW50LCBtdWx0aTogdHJ1ZSB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hTaW1wbGVDb21ib0NvbXBvbmVudCBleHRlbmRzIElneENvbWJvQmFzZURpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0IHtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAVmlld0NoaWxkKElneENvbWJvRHJvcERvd25Db21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIGRyb3Bkb3duOiBJZ3hDb21ib0Ryb3BEb3duQ29tcG9uZW50O1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQFZpZXdDaGlsZChJZ3hDb21ib0FkZEl0ZW1Db21wb25lbnQpXG4gICAgcHVibGljIGFkZEl0ZW06IElneENvbWJvQWRkSXRlbUNvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBpdGVtIHNlbGVjdGlvbiBpcyBjaGFuZ2luZywgYmVmb3JlIHRoZSBzZWxlY3Rpb24gY29tcGxldGVzXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zaW1wbGUtY29tYm8gKHNlbGVjdGlvbkNoYW5naW5nKT0naGFuZGxlU2VsZWN0aW9uKCknPjwvaWd4LXNpbXBsZS1jb21ibz5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2VsZWN0aW9uQ2hhbmdpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElTaW1wbGVDb21ib1NlbGVjdGlvbkNoYW5naW5nRXZlbnRBcmdzPigpO1xuXG4gICAgQFZpZXdDaGlsZChJZ3hUZXh0U2VsZWN0aW9uRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByaXZhdGUgdGV4dFNlbGVjdGlvbjogSWd4VGV4dFNlbGVjdGlvbkRpcmVjdGl2ZTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBjb21wb3NpbmcgPSBmYWxzZTtcblxuICAgIHByaXZhdGUgX3VwZGF0ZUlucHV0ID0gdHJ1ZTtcblxuICAgIC8vIHN0b3JlcyB0aGUgbGFzdCBmaWx0ZXJlZCB2YWx1ZSAtIG1vdmUgdG8gY29tbW9uP1xuICAgIHByaXZhdGUgX2ludGVybmFsRmlsdGVyID0gJyc7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IGZpbHRlcmVkRGF0YSgpOiBhbnlbXSB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsdGVyZWREYXRhO1xuICAgIH1cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgc2V0IGZpbHRlcmVkRGF0YSh2YWw6IGFueVtdIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9maWx0ZXJlZERhdGEgPSB0aGlzLmdyb3VwS2V5ID8gKHZhbCB8fCBbXSkuZmlsdGVyKChlKSA9PiBlLmlzSGVhZGVyICE9PSB0cnVlKSA6IHZhbDtcbiAgICAgICAgdGhpcy5jaGVja01hdGNoKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBzZWFyY2hWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VhcmNoVmFsdWU7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgc2VhcmNoVmFsdWUodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2VhcmNoVmFsdWUgPSB2YWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgc2VsZWN0ZWRJdGVtKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0KHRoaXMuaWQpLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3Rpb25TZXJ2aWNlOiBJZ3hTZWxlY3Rpb25BUElTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgY29tYm9BUEk6IElneENvbWJvQVBJU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIF9pY29uU2VydmljZTogSWd4SWNvblNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcGxhdGZvcm1VdGlsOiBQbGF0Zm9ybVV0aWwsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRGlzcGxheURlbnNpdHlUb2tlbikgcHJvdGVjdGVkIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnM6IElEaXNwbGF5RGVuc2l0eU9wdGlvbnMsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoSUdYX0lOUFVUX0dST1VQX1RZUEUpIHByb3RlY3RlZCBfaW5wdXRHcm91cFR5cGU6IElneElucHV0R3JvdXBUeXBlLFxuICAgICAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgX2luamVjdG9yOiBJbmplY3Rvcikge1xuICAgICAgICBzdXBlcihlbGVtZW50UmVmLCBjZHIsIHNlbGVjdGlvblNlcnZpY2UsIGNvbWJvQVBJLFxuICAgICAgICAgICAgX2ljb25TZXJ2aWNlLCBfZGlzcGxheURlbnNpdHlPcHRpb25zLCBfaW5wdXRHcm91cFR5cGUsIF9pbmplY3Rvcik7XG4gICAgICAgIHRoaXMuY29tYm9BUEkucmVnaXN0ZXIodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5BcnJvd0Rvd24nLCBbJyRldmVudCddKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uQWx0LkFycm93RG93bicsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uQXJyb3dEb3duKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudmlydERpci5pZ3hGb3JPZi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5uYXZpZ2F0ZUZpcnN0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bkNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWxsb3dDdXN0b21WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0uZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3QgYSBkZWZpbmVkIGl0ZW1cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGJlIHNlbGVjdGVkXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY29tYm8uc2VsZWN0KFwiTmV3IFlvcmtcIik7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWRkX2l0ZW1zKHRoaXMuaWQsIGl0ZW0gaW5zdGFuY2VvZiBBcnJheSA/IGl0ZW0gOiBbaXRlbV0sIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obmV3U2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbVxuICAgICAqXG4gICAgICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW1zIHRvIGJlIGRlc2VsZWN0ZWRcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jb21iby5kZXNlbGVjdChcIk5ldyBZb3JrXCIpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBkZXNlbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgb2xkU2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb247XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RfaXRlbXModGhpcy5pZCwgdmFsdWUgPyBbdmFsdWVdIDogW10sIHRydWUpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLmNyZWF0ZURpc3BsYXlUZXh0KHRoaXMuc2VsZWN0aW9uLCBvbGRTZWxlY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmlydERpci5jb250ZW50U2l6ZUNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnZpcnREaXIuaWd4Rm9yT2YuZmluZEluZGV4KGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudCA9IGVbdGhpcy52YWx1ZUtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlS2V5ID09PSBudWxsIHx8IHRoaXMudmFsdWVLZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQgPT09IHRoaXMuc2VsZWN0aW9uWzBdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24ubmF2aWdhdGVJdGVtKGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJvcGRvd24ub3BlbmluZy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5maWx0ZXJlZERhdGEuZmluZCh0aGlzLmZpbmRNYXRjaCk7XG4gICAgICAgICAgICBpZiAoZmlsdGVyZWQgPT09IHVuZGVmaW5lZCB8fCBmaWx0ZXJlZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyVmFsdWUgPSB0aGlzLnNlYXJjaFZhbHVlID0gdGhpcy5jb21ib0lucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsdGVyVmFsdWUgPSB0aGlzLnNlYXJjaFZhbHVlID0gJyc7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRyb3Bkb3duLm9wZW5lZC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvc2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tYm9JbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faW50ZXJuYWxGaWx0ZXIgPSB0aGlzLmNvbWJvSW5wdXQudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRyb3Bkb3duLmNsb3NpbmcucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoYXJncykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RWRpdEVsZW1lbnQoKSAmJiAhYXJncy5ldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tYm9JbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyT25CbHVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZHJvcGRvd24uY2xvc2VkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZSA9IHRoaXMuX2ludGVybmFsRmlsdGVyID0gdGhpcy5jb21ib0lucHV0LnZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaGFuZGxlSW5wdXRDaGFuZ2UoZXZlbnQ/OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyVmFsdWUgPSB0aGlzLl9pbnRlcm5hbEZpbHRlciA9IHRoaXMuc2VhcmNoVmFsdWUgPSB0eXBlb2YgZXZlbnQgPT09ICdzdHJpbmcnID8gZXZlbnQgOiBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlYXJjaFZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuY29sbGFwc2VkICYmIHRoaXMuY29tYm9JbnB1dC5mb2N1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY29tYm9JbnB1dC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBjbGVhcmluZyBvZiBpbnB1dCBieSBzcGFjZVxuICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB3aGVuIGZpbHRlcmluZyB0aGUgZm9jdXNlZCBpdGVtIHNob3VsZCBiZSB0aGUgZmlyc3QgaXRlbSBvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgaWYgKCF0aGlzLmRyb3Bkb3duLmZvY3VzZWRJdGVtIHx8IHRoaXMuZHJvcGRvd24uZm9jdXNlZEl0ZW0uaWQgIT09IHRoaXMuZHJvcGRvd24uaXRlbXNbMF0uaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24ubmF2aWdhdGVGaXJzdCgpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmhhbmRsZUlucHV0Q2hhbmdlKGV2ZW50KTtcbiAgICAgICAgdGhpcy5jb21wb3NpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBoYW5kbGVLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IHRoaXMucGxhdGZvcm1VdGlsLktFWU1BUC5FTlRFUikge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyZWQgPSB0aGlzLmZpbHRlcmVkRGF0YS5maW5kKHRoaXMuZmluZE1hdGNoKTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJlZCA9PT0gbnVsbCB8fCBmaWx0ZXJlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5kcm9wZG93bi5mb2N1c2VkSXRlbS5pdGVtSUQpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgLy8gbWFudWFsbHkgdHJpZ2dlciB0ZXh0IHNlbGVjdGlvbiBhcyBpdCB3aWxsIG5vdCBiZSB0cmlnZ2VyZWQgZHVyaW5nIGVkaXRpbmdcbiAgICAgICAgICAgIHRoaXMudGV4dFNlbGVjdGlvbi50cmlnZ2VyKCk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclZhbHVlID0gdGhpcy5nZXRFbGVtZW50VmFsKGZpbHRlcmVkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSB0aGlzLnBsYXRmb3JtVXRpbC5LRVlNQVAuQkFDS1NQQUNFXG4gICAgICAgICAgICB8fCBldmVudC5rZXkgPT09IHRoaXMucGxhdGZvcm1VdGlsLktFWU1BUC5ERUxFVEUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUlucHV0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5jb2xsYXBzZWQgJiYgZXZlbnQua2V5ID09PSB0aGlzLnBsYXRmb3JtVXRpbC5LRVlNQVAuVEFCKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyT25CbHVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAgICAgc3VwZXIuaGFuZGxlS2V5RG93bihldmVudCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUtleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IHRoaXMucGxhdGZvcm1VdGlsLktFWU1BUC5BUlJPV19ET1dOKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdEl0ZW0gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZmlyc3RfaXRlbSh0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uZm9jdXNlZEl0ZW0gPSBmaXJzdEl0ZW0gJiYgdGhpcy5maWx0ZXJlZERhdGEubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgID8gdGhpcy5kcm9wZG93bi5pdGVtcy5maW5kKGkgPT4gaS5pdGVtSUQgPT09IGZpcnN0SXRlbSlcbiAgICAgICAgICAgICAgICA6IHRoaXMuZHJvcGRvd24uaXRlbXNbMF07XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBoYW5kbGVJdGVtS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSB0aGlzLnBsYXRmb3JtVXRpbC5LRVlNQVAuQVJST1dfVVAgJiYgZXZlbnQuYWx0S2V5KSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB0aGlzLmNvbWJvSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSB0aGlzLnBsYXRmb3JtVXRpbC5LRVlNQVAuRU5URVIpIHtcbiAgICAgICAgICAgIHRoaXMuY29tYm9JbnB1dC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUl0ZW1DbGljaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLmNvbWJvSW5wdXQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25CbHVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJPbkJsdXIoKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5vbkJsdXIoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25Gb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5faW50ZXJuYWxGaWx0ZXIgPSB0aGlzLmNvbWJvSW5wdXQudmFsdWUgfHwgJyc7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldEVkaXRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tYm9JbnB1dC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBoYW5kbGVDbGVhcihldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKHRydWUpO1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5uYXZpZ2F0ZUZpcnN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzU2VhcmNoSW5wdXQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5jb21ib0lucHV0LnZhbHVlID0gdGhpcy5maWx0ZXJWYWx1ZSA9IHRoaXMuc2VhcmNoVmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5kcm9wZG93bi5mb2N1c2VkSXRlbSA9IG51bGw7XG4gICAgICAgIHRoaXMuY29tcG9zaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29tYm9JbnB1dC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBoYW5kbGVPcGVuZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudHJpZ2dlckNoZWNrKCk7XG4gICAgICAgIHRoaXMuZHJvcGRvd25Db250YWluZXIubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB0aGlzLm9wZW5lZC5lbWl0KHsgb3duZXI6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUNsb3NpbmcoZTogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyk6IHZvaWQge1xuICAgICAgICBjb25zdCBhcmdzOiBJQmFzZUNhbmNlbGFibGVCcm93c2VyRXZlbnRBcmdzID0geyBvd25lcjogdGhpcywgZXZlbnQ6IGUuZXZlbnQsIGNhbmNlbDogZS5jYW5jZWwgfTtcbiAgICAgICAgdGhpcy5jbG9zaW5nLmVtaXQoYXJncyk7XG4gICAgICAgIGUuY2FuY2VsID0gYXJncy5jYW5jZWw7XG4gICAgICAgIGlmIChlLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb21wb3NpbmcgPSBmYWxzZTtcbiAgICAgICAgLy8gZXhwbGljaXRseSB1cGRhdGUgc2VsZWN0aW9uIGFuZCB0cmlnZ2VyIHRleHQgc2VsZWN0aW9uIHNvIHRoYXQgd2UgZG9uJ3QgaGF2ZSB0byBmb3JjZSBDRFxuICAgICAgICB0aGlzLnRleHRTZWxlY3Rpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnRleHRTZWxlY3Rpb24udHJpZ2dlcigpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBmb2N1c1NlYXJjaElucHV0KG9wZW5pbmc/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmIChvcGVuaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29tYm9JbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uQ2xpY2soZXZlbnQpO1xuICAgICAgICBpZiAodGhpcy5jb21ib0lucHV0LnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy52aXJ0RGlyLnNjcm9sbFRvKDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZpbmRNYXRjaCA9IChlbGVtZW50OiBhbnkpOiBib29sZWFuID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRpc3BsYXlLZXkgPyBlbGVtZW50W3RoaXMuZGlzcGxheUtleV0gOiBlbGVtZW50O1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIC8vIHdlIGNhbiBhY2NlcHQgbnVsbCwgdW5kZWZpbmVkIGFuZCBlbXB0eSBzdHJpbmdzIGFzIGVtcHR5IGRpc3BsYXkgdmFsdWVzXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWFyY2hWYWx1ZSA9IHRoaXMuc2VhcmNoVmFsdWUgfHwgdGhpcy5jb21ib0lucHV0LnZhbHVlO1xuICAgICAgICByZXR1cm4gISFzZWFyY2hWYWx1ZSAmJiB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCkpO1xuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2VsZWN0aW9uKG5ld1NlbGVjdGlvbjogYW55KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbkFzQXJyYXkgPSBuZXdTZWxlY3Rpb24gPyBBcnJheS5mcm9tKG5ld1NlbGVjdGlvbikgYXMgSWd4Q29tYm9JdGVtQ29tcG9uZW50W10gOiBbXTtcbiAgICAgICAgY29uc3Qgb2xkU2VsZWN0aW9uQXNBcnJheSA9IEFycmF5LmZyb20odGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmdldCh0aGlzLmlkKSB8fCBbXSk7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlUZXh0ID0gdGhpcy5jcmVhdGVEaXNwbGF5VGV4dChuZXdTZWxlY3Rpb25Bc0FycmF5LCBvbGRTZWxlY3Rpb25Bc0FycmF5KTtcbiAgICAgICAgY29uc3QgYXJnczogSVNpbXBsZUNvbWJvU2VsZWN0aW9uQ2hhbmdpbmdFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBuZXdTZWxlY3Rpb246IG5ld1NlbGVjdGlvbkFzQXJyYXlbMF0sXG4gICAgICAgICAgICBvbGRTZWxlY3Rpb246IG9sZFNlbGVjdGlvbkFzQXJyYXlbMF0sXG4gICAgICAgICAgICBkaXNwbGF5VGV4dCxcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgY2FuY2VsOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5naW5nLmVtaXQoYXJncyk7XG4gICAgICAgIGlmICghYXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgIGxldCBhcmdzU2VsZWN0aW9uID0gYXJncy5uZXdTZWxlY3Rpb24gIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICYmIGFyZ3MubmV3U2VsZWN0aW9uICE9PSBudWxsXG4gICAgICAgICAgICAgICAgPyBhcmdzLm5ld1NlbGVjdGlvblxuICAgICAgICAgICAgICAgIDogW107XG4gICAgICAgICAgICBhcmdzU2VsZWN0aW9uID0gQXJyYXkuaXNBcnJheShhcmdzU2VsZWN0aW9uKSA/IGFyZ3NTZWxlY3Rpb24gOiBbYXJnc1NlbGVjdGlvbl07XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0X2l0ZW1zKHRoaXMuaWQsIGFyZ3NTZWxlY3Rpb24sIHRydWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZUlucHV0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21ib0lucHV0LnZhbHVlID0gdGhpcy5faW50ZXJuYWxGaWx0ZXIgPSB0aGlzLl92YWx1ZSA9IGRpc3BsYXlUZXh0ICE9PSBhcmdzLmRpc3BsYXlUZXh0XG4gICAgICAgICAgICAgICAgICAgID8gYXJncy5kaXNwbGF5VGV4dFxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuY3JlYXRlRGlzcGxheVRleHQoYXJnc1NlbGVjdGlvbiwgW2FyZ3Mub2xkU2VsZWN0aW9uXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKGFyZ3MubmV3U2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUlucHV0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjcmVhdGVEaXNwbGF5VGV4dChuZXdTZWxlY3Rpb246IGFueVtdLCBvbGRTZWxlY3Rpb246IGFueVtdKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZW1vdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJlbW90ZVNlbGVjdGlvbihuZXdTZWxlY3Rpb24sIG9sZFNlbGVjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5S2V5ICE9PSBudWxsICYmIHRoaXMuZGlzcGxheUtleSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAmJiBuZXdTZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydEtleXNUb0l0ZW1zKG5ld1NlbGVjdGlvbikubWFwKGUgPT4gZVt0aGlzLmRpc3BsYXlLZXldKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdTZWxlY3Rpb25bMF0gfHwgJyc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhclNlbGVjdGlvbihpZ25vcmVGaWx0ZXI/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0X2VtcHR5KCk7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGggIT09IHRoaXMuZGF0YS5sZW5ndGggJiYgIWlnbm9yZUZpbHRlcikge1xuICAgICAgICAgICAgbmV3U2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmRlbGV0ZV9pdGVtcyh0aGlzLmlkLCB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZ2V0X2FsbF9pZHModGhpcy5maWx0ZXJlZERhdGEsIHRoaXMudmFsdWVLZXkpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihuZXdTZWxlY3Rpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJPbkJsdXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5maWx0ZXJlZERhdGEuZmluZCh0aGlzLmZpbmRNYXRjaCk7XG4gICAgICAgIGlmIChmaWx0ZXJlZCA9PT0gdW5kZWZpbmVkIHx8IGZpbHRlcmVkID09PSBudWxsIHx8ICF0aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckFuZENsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNQYXJ0aWFsTWF0Y2goZmlsdGVyZWQpIHx8IHRoaXMuZ2V0RWxlbWVudFZhbChmaWx0ZXJlZCkgIT09IHRoaXMuX2ludGVybmFsRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQW5kQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNQYXJ0aWFsTWF0Y2goZmlsdGVyZWQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9pbnRlcm5hbEZpbHRlciAmJiB0aGlzLl9pbnRlcm5hbEZpbHRlci5sZW5ndGggIT09IHRoaXMuZ2V0RWxlbWVudFZhbChmaWx0ZXJlZCkubGVuZ3RoO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RWxlbWVudFZhbChlbGVtZW50OiBhbnkpOiBhbnkgfCBudWxsIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRWYWwgPSB0aGlzLmRpc3BsYXlLZXkgPyBlbGVtZW50W3RoaXMuZGlzcGxheUtleV0gOiBlbGVtZW50O1xuICAgICAgICByZXR1cm4gKGVsZW1lbnRWYWwgPT09IDAgPyAnMCcgOiBlbGVtZW50VmFsKSB8fCAnJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyQW5kQ2xvc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24odHJ1ZSk7XG4gICAgICAgIHRoaXMuX2ludGVybmFsRmlsdGVyID0gJyc7XG4gICAgICAgIHRoaXMuc2VhcmNoVmFsdWUgPSAnJztcbiAgICAgICAgaWYgKCF0aGlzLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0lneFNpbXBsZUNvbWJvQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIElneENvbWJvTW9kdWxlLCBJZ3hSaXBwbGVNb2R1bGUsIENvbW1vbk1vZHVsZSxcbiAgICAgICAgSWd4SW5wdXRHcm91cE1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICAgIElneEZvck9mTW9kdWxlLCBJZ3hUb2dnbGVNb2R1bGUsIElneENoZWNrYm94TW9kdWxlLFxuICAgICAgICBJZ3hEcm9wRG93bk1vZHVsZSwgSWd4QnV0dG9uTW9kdWxlLCBJZ3hJY29uTW9kdWxlLFxuICAgICAgICBJZ3hUZXh0U2VsZWN0aW9uTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbSWd4U2ltcGxlQ29tYm9Db21wb25lbnQsIElneENvbWJvTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hTaW1wbGVDb21ib01vZHVsZSB7IH1cbiIsIjxpZ3gtaW5wdXQtZ3JvdXAgI2lucHV0R3JvdXAgW2Rpc3BsYXlEZW5zaXR5XT1cImRpc3BsYXlEZW5zaXR5XCIgW3N1cHByZXNzSW5wdXRBdXRvZm9jdXNdPVwidHJ1ZVwiIFt0eXBlXT1cInR5cGVcIj5cbiAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiW2lneExhYmVsXVwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbaWd4TGFiZWxdXCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJpZ3gtcHJlZml4XCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1wcmVmaXhcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1oaW50LCBbaWd4SGludF1cIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LWhpbnQsIFtpZ3hIaW50XVwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgIDxpbnB1dCAjY29tYm9JbnB1dCBpZ3hJbnB1dCBbdmFsdWVdPVwidmFsdWVcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGlucHV0KT1cImhhbmRsZUlucHV0Q2hhbmdlKCRldmVudClcIiAoa2V5dXApPVwiaGFuZGxlS2V5VXAoJGV2ZW50KVwiXG4gICAgICAgIChrZXlkb3duKT1cImhhbmRsZUtleURvd24oJGV2ZW50KVwiIChibHVyKT1cIm9uQmx1cigpXCIgW2F0dHIucGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJcIiBhcmlhLWF1dG9jb21wbGV0ZT1cImJvdGhcIlxuICAgICAgICBbYXR0ci5hcmlhLW93bnNdPVwiZHJvcGRvd24uaWRcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICBbaWd4VGV4dFNlbGVjdGlvbl09XCIhY29tcG9zaW5nXCIgLz5cblxuICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJpZ3gtc3VmZml4XCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1zdWZmaXhcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPGlneC1zdWZmaXggKm5nSWY9XCJjb21ib0lucHV0LnZhbHVlLmxlbmd0aFwiIGFyaWEtbGFiZWw9XCJDbGVhciBTZWxlY3Rpb25cIiBjbGFzcz1cImlneC1jb21ib19fY2xlYXItYnV0dG9uXCJcbiAgICAgICAgKGNsaWNrKT1cImhhbmRsZUNsZWFyKCRldmVudClcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNsZWFySWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY2xlYXJJY29uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxpZ3gtaWNvbiAqbmdJZj1cIiFjbGVhckljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgY2xlYXJcbiAgICAgICAgPC9pZ3gtaWNvbj5cbiAgICA8L2lneC1zdWZmaXg+XG4gICAgPGlneC1zdWZmaXggKm5nSWY9XCJzaG93U2VhcmNoQ2FzZUljb25cIj5cbiAgICAgICAgPGlneC1pY29uIGZhbWlseT1cImlteC1pY29uc1wiIG5hbWU9XCJjYXNlLXNlbnNpdGl2ZVwiIFthY3RpdmVdPVwiZmlsdGVyaW5nT3B0aW9ucy5jYXNlU2Vuc2l0aXZlXCJcbiAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVDYXNlU2Vuc2l0aXZlKClcIj5cbiAgICAgICAgPC9pZ3gtaWNvbj5cbiAgICA8L2lneC1zdWZmaXg+XG4gICAgPGlneC1zdWZmaXggY2xhc3M9XCJpZ3gtY29tYm9fX3RvZ2dsZS1idXR0b25cIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInRvZ2dsZUljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRvZ2dsZUljb25UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogY29sbGFwc2VkfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPGlneC1pY29uIChjbGljayk9XCJvbkNsaWNrKCRldmVudClcIiAqbmdJZj1cIiF0b2dnbGVJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgIHt7IGRyb3Bkb3duLmNvbGxhcHNlZCA/ICdhcnJvd19kcm9wX2Rvd24nIDogJ2Fycm93X2Ryb3BfdXAnfX1cbiAgICAgICAgPC9pZ3gtaWNvbj5cbiAgICA8L2lneC1zdWZmaXg+XG48L2lneC1pbnB1dC1ncm91cD5cblxuPGlneC1jb21iby1kcm9wLWRvd24gI2lneENvbWJvRHJvcERvd24gY2xhc3M9XCJpZ3gtY29tYm9fX2Ryb3AtZG93blwiIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiXG4gICAgW3dpZHRoXT1cIml0ZW1zV2lkdGggfHwgJzEwMCUnXCIgKG9wZW5pbmcpPVwiaGFuZGxlT3BlbmluZygkZXZlbnQpXCIgKGNsb3NpbmcpPVwiaGFuZGxlQ2xvc2luZygkZXZlbnQpXCJcbiAgICAob3BlbmVkKT1cImhhbmRsZU9wZW5lZCgpXCIgKGNsb3NlZCk9XCJoYW5kbGVDbG9zZWQoKVwiIFtzaW5nbGVNb2RlXT1cInRydWVcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8ZGl2ICNkcm9wZG93bkl0ZW1Db250YWluZXIgY2xhc3M9XCJpZ3gtY29tYm9fX2NvbnRlbnRcIiBbc3R5bGUub3ZlcmZsb3ddPVwiJ2hpZGRlbidcIlxuICAgICAgICBbc3R5bGUubWF4SGVpZ2h0LnB4XT1cIml0ZW1zTWF4SGVpZ2h0XCIgW2lneERyb3BEb3duSXRlbU5hdmlnYXRpb25dPVwiZHJvcGRvd25cIiAoZm9jdXMpPVwiZHJvcGRvd24ub25Gb2N1cygpXCJcbiAgICAgICAgW3RhYmluZGV4XT1cImRyb3Bkb3duLmNvbGxhcHNlZCA/IC0xIDogMFwiIHJvbGU9XCJsaXN0Ym94XCIgW2F0dHIuaWRdPVwiZHJvcGRvd24uaWRcIlxuICAgICAgICAoa2V5ZG93bik9XCJoYW5kbGVJdGVtS2V5RG93bigkZXZlbnQpXCI+XG4gICAgICAgIDxpZ3gtY29tYm8taXRlbSByb2xlPVwib3B0aW9uXCIgW3NpbmdsZU1vZGVdPVwidHJ1ZVwiIFtpdGVtSGVpZ2h0XT0naXRlbUhlaWdodCcgKGNsaWNrKT1cImhhbmRsZUl0ZW1DbGljaygpXCIgKmlneEZvcj1cImxldCBpdGVtIG9mIGRhdGFcbiAgICAgICAgICAgIHwgY29tYm9DbGVhblxuICAgICAgICAgICAgfCBjb21ib0ZpbHRlcmluZzpmaWx0ZXJWYWx1ZTpkaXNwbGF5S2V5OmZpbHRlcmluZ09wdGlvbnM6dHJ1ZVxuICAgICAgICAgICAgfCBjb21ib0dyb3VwaW5nOmdyb3VwS2V5OnZhbHVlS2V5Omdyb3VwU29ydGluZ0RpcmVjdGlvbjtcbiAgICAgICAgICAgIGluZGV4IGFzIHJvd0luZGV4OyBjb250YWluZXJTaXplOiBpdGVtc01heEhlaWdodDsgc2Nyb2xsT3JpZW50YXRpb246ICd2ZXJ0aWNhbCc7IGl0ZW1TaXplOiBpdGVtSGVpZ2h0XCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJpdGVtXCIgW2lzSGVhZGVyXT1cIml0ZW0uaXNIZWFkZXJcIiBbaW5kZXhdPVwicm93SW5kZXhcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpdGVtLmlzSGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlckl0ZW1UZW1wbGF0ZSA/IGhlYWRlckl0ZW1UZW1wbGF0ZSA6IGhlYWRlckl0ZW1CYXNlO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtLCBkYXRhOiBkYXRhLCB2YWx1ZUtleTogdmFsdWVLZXksIGdyb3VwS2V5OiBncm91cEtleSwgZGlzcGxheUtleTogZGlzcGxheUtleX1cIj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpdGVtLmlzSGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjbGlzdEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogaXRlbSwgZGF0YTogZGF0YSwgdmFsdWVLZXk6IHZhbHVlS2V5LCBkaXNwbGF5S2V5OiBkaXNwbGF5S2V5fTtcIj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2lneC1jb21iby1pdGVtPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImlneC1jb21ib19fYWRkXCIgKm5nSWY9XCJmaWx0ZXJlZERhdGEubGVuZ3RoID09PSAwIHx8IGlzQWRkQnV0dG9uVmlzaWJsZSgpXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtY29tYm9fX2VtcHR5XCIgKm5nSWY9XCJmaWx0ZXJlZERhdGEubGVuZ3RoID09PSAwXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW1wdHlUZW1wbGF0ZSA/IGVtcHR5VGVtcGxhdGUgOiBlbXB0eVwiPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aWd4LWNvbWJvLWFkZC1pdGVtICNhZGRJdGVtIFtpdGVtSGVpZ2h0XT1cIml0ZW1IZWlnaHRcIiAqbmdJZj1cImlzQWRkQnV0dG9uVmlzaWJsZSgpXCJcbiAgICAgICAgICAgIFt0YWJpbmRleF09XCJkcm9wZG93bi5jb2xsYXBzZWQgPyAtMSA6IGN1c3RvbVZhbHVlRmxhZyA/IDEgOiAtMVwiIGNsYXNzPVwiaWd4LWNvbWJvX19hZGQtaXRlbVwiIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkFkZCBJdGVtXCIgW2luZGV4XT1cInZpcnR1YWxTY3JvbGxDb250YWluZXIuaWd4Rm9yT2YubGVuZ3RoXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYWRkSXRlbVRlbXBsYXRlID8gYWRkSXRlbVRlbXBsYXRlIDogYWRkSXRlbURlZmF1bHRcIj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2lneC1jb21iby1hZGQtaXRlbT5cbiAgICA8L2Rpdj5cbiAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyVGVtcGxhdGVcIj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbjwvaWd4LWNvbWJvLWRyb3AtZG93bj5cblxuPG5nLXRlbXBsYXRlICNjb21wbGV4IGxldC1kaXNwbGF5IGxldC1kYXRhPVwiZGF0YVwiIGxldC1rZXk9XCJkaXNwbGF5S2V5XCI+XG4gICAge3tkaXNwbGF5W2tleV19fVxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjcHJpbWl0aXZlIGxldC1kaXNwbGF5PlxuICAgIHt7ZGlzcGxheX19XG48L25nLXRlbXBsYXRlPlxuPG5nLXRlbXBsYXRlICNlbXB0eT5cbiAgICA8c3Bhbj5UaGUgbGlzdCBpcyBlbXB0eTwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2FkZEl0ZW1EZWZhdWx0IGxldC1jb250cm9sPlxuICAgIDxidXR0b24gaWd4QnV0dG9uPVwiZmxhdFwiIGlneFJpcHBsZT5BZGQgaXRlbTwvYnV0dG9uPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjaGVhZGVySXRlbUJhc2UgbGV0LWl0ZW0gbGV0LWtleT1cInZhbHVlS2V5XCIgbGV0LWdyb3VwS2V5PVwiZ3JvdXBLZXlcIj5cbiAgICB7eyBpdGVtW2tleV0gfX1cbjwvbmctdGVtcGxhdGU+XG4iXX0=