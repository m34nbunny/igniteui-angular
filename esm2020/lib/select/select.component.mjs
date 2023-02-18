import { Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, HostBinding, Inject, Input, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayDensityToken } from '../core/density';
import { IgxLabelDirective } from '../directives/label/label.directive';
import { IGX_DROPDOWN_BASE } from '../drop-down/drop-down.common';
import { IgxInputGroupComponent } from '../input-group/input-group.component';
import { AbsoluteScrollStrategy } from '../services/overlay/scroll/absolute-scroll-strategy';
import { IgxInputDirective, IgxInputState } from './../directives/input/input.directive';
import { IgxDropDownComponent } from './../drop-down/drop-down.component';
import { IgxSelectItemComponent } from './select-item.component';
import { SelectPositioningStrategy } from './select-positioning-strategy';
import { IgxHintDirective, IGX_INPUT_GROUP_TYPE } from '../input-group/public_api';
import { IgxOverlayService } from '../services/overlay/overlay';
import * as i0 from "@angular/core";
import * as i1 from "../core/selection";
import * as i2 from "../input-group/input-group.component";
import * as i3 from "../icon/icon.component";
import * as i4 from "../directives/input/input.directive";
import * as i5 from "./select-navigation.directive";
import * as i6 from "../directives/suffix/suffix.directive";
import * as i7 from "@angular/common";
import * as i8 from "../directives/toggle/toggle.directive";
import * as i9 from "../services/overlay/overlay";
/** @hidden @internal */
export class IgxSelectToggleIconDirective {
}
IgxSelectToggleIconDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectToggleIconDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxSelectToggleIconDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxSelectToggleIconDirective, selector: "[igxSelectToggleIcon]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectToggleIconDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxSelectToggleIcon]'
                }]
        }] });
/** @hidden @internal */
export class IgxSelectHeaderDirective {
}
IgxSelectHeaderDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectHeaderDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxSelectHeaderDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxSelectHeaderDirective, selector: "[igxSelectHeader]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectHeaderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxSelectHeader]'
                }]
        }] });
/** @hidden @internal */
export class IgxSelectFooterDirective {
}
IgxSelectFooterDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectFooterDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxSelectFooterDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxSelectFooterDirective, selector: "[igxSelectFooter]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectFooterDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxSelectFooter]'
                }]
        }] });
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
export class IgxSelectComponent extends IgxDropDownComponent {
    constructor(elementRef, cdr, selection, overlayService, _displayDensityOptions, _inputGroupType, _injector) {
        super(elementRef, cdr, selection, _displayDensityOptions);
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.selection = selection;
        this.overlayService = overlayService;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        this._injector = _injector;
        /**
         * An @Input property that disables the `IgxSelectComponent`.
         * ```html
         * <igx-select [disabled]="'true'"></igx-select>
         * ```
         */
        this.disabled = false;
        /** @hidden @internal */
        this.maxHeight = '256px';
        /**
         * Emitted before the dropdown is opened
         *
         * ```html
         * <igx-select opening='handleOpening($event)'></igx-select>
         * ```
         */
        this.opening = new EventEmitter();
        /**
         * Emitted after the dropdown is opened
         *
         * ```html
         * <igx-select (opened)='handleOpened($event)'></igx-select>
         * ```
         */
        this.opened = new EventEmitter();
        /**
         * Emitted before the dropdown is closed
         *
         * ```html
         * <igx-select (closing)='handleClosing($event)'></igx-select>
         * ```
         */
        this.closing = new EventEmitter();
        /**
         * Emitted after the dropdown is closed
         *
         * ```html
         * <igx-select (closed)='handleClosed($event)'></igx-select>
         * ```
         */
        this.closed = new EventEmitter();
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
        this.toggleIconTemplate = null;
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
        this.headerTemplate = null;
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
        this.footerTemplate = null;
        /** @hidden @internal do not use the drop-down container class */
        this.cssClass = false;
        /** @hidden @internal */
        this.allowItemsFocus = false;
        this.destroy$ = new Subject();
        this.ngControl = null;
        this._type = null;
        this._onChangeCallback = noop;
        this._onTouchedCallback = noop;
        //#region ControlValueAccessor
        /** @hidden @internal */
        this.writeValue = (value) => {
            this.value = value;
        };
    }
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
    get value() {
        return this._value;
    }
    set value(v) {
        if (this._value === v) {
            return;
        }
        this._value = v;
        this.setSelection(this.items.find(x => x.value === this.value));
    }
    /**
     * An @Input property that sets how the select will be styled.
     * The allowed values are `line`, `box` and `border`. The input-group default is `line`.
     * ```html
     * <igx-select [type]="'box'"></igx-select>
     * ```
     */
    get type() {
        return this._type || this._inputGroupType || 'line';
    }
    set type(val) {
        this._type = val;
    }
    /** @hidden @internal */
    get selectionValue() {
        const selectedItem = this.selectedItem;
        return selectedItem ? selectedItem.itemText : '';
    }
    /** @hidden @internal */
    get selectedItem() {
        return this.selection.first_item(this.id);
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
    //#endregion
    /** @hidden @internal */
    getEditElement() {
        return this.input.nativeElement;
    }
    /** @hidden @internal */
    selectItem(newSelection, event) {
        const oldSelection = this.selectedItem;
        if (newSelection === null || newSelection.disabled || newSelection.isHeader) {
            return;
        }
        if (newSelection === oldSelection) {
            this.toggleDirective.close();
            return;
        }
        const args = { oldSelection, newSelection, cancel: false };
        this.selectionChanging.emit(args);
        if (args.cancel) {
            return;
        }
        this.setSelection(newSelection);
        this._value = newSelection.value;
        if (event) {
            this.toggleDirective.close();
        }
        this.cdr.detectChanges();
        this._onChangeCallback(this.value);
    }
    /** @hidden @internal */
    getFirstItemElement() {
        return this.children.first.element.nativeElement;
    }
    /**
     * Opens the select
     *
     * ```typescript
     * this.select.open();
     * ```
     */
    open(overlaySettings) {
        if (this.disabled || this.items.length === 0) {
            return;
        }
        if (!this.selectedItem) {
            this.navigateFirst();
        }
        super.open(Object.assign({}, this._overlayDefaults, this.overlaySettings, overlaySettings));
    }
    inputGroupClick(event, overlaySettings) {
        const targetElement = event.target;
        if (this.hintElement && targetElement.contains(this.hintElement.nativeElement)) {
            return;
        }
        this.toggle(Object.assign({}, this._overlayDefaults, this.overlaySettings, overlaySettings));
    }
    /** @hidden @internal */
    ngAfterContentInit() {
        this._overlayDefaults = {
            target: this.getEditElement(),
            modal: false,
            positionStrategy: new SelectPositioningStrategy(this),
            scrollStrategy: new AbsoluteScrollStrategy(),
            excludeFromOutsideClick: [this.inputGroup.element.nativeElement]
        };
        const changes$ = this.children.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.setSelection(this.items.find(x => x.value === this.value));
            this.cdr.detectChanges();
        });
        Promise.resolve().then(() => {
            if (!changes$.closed) {
                this.children.notifyOnChanges();
            }
        });
    }
    /**
     * Event handlers
     *
     * @hidden @internal
     */
    handleOpening(e) {
        const args = { owner: this, event: e.event, cancel: e.cancel };
        this.opening.emit(args);
        e.cancel = args.cancel;
        if (args.cancel) {
            return;
        }
    }
    /** @hidden @internal */
    onToggleContentAppended(event) {
        const info = this.overlayService.getOverlayById(event.id);
        if (info?.settings?.positionStrategy instanceof SelectPositioningStrategy) {
            return;
        }
        super.onToggleContentAppended(event);
    }
    /** @hidden @internal */
    handleOpened() {
        this.updateItemFocus();
        this.opened.emit({ owner: this });
    }
    /** @hidden @internal */
    handleClosing(e) {
        const args = { owner: this, event: e.event, cancel: e.cancel };
        this.closing.emit(args);
        e.cancel = args.cancel;
    }
    /** @hidden @internal */
    handleClosed() {
        this.focusItem(false);
        this.closed.emit({ owner: this });
    }
    /** @hidden @internal */
    onBlur() {
        this._onTouchedCallback();
        if (this.ngControl && this.ngControl.invalid) {
            this.input.valid = IgxInputState.INVALID;
        }
        else {
            this.input.valid = IgxInputState.INITIAL;
        }
    }
    /** @hidden @internal */
    onFocus() {
        this._onTouchedCallback();
    }
    /**
     * @hidden @internal
     */
    ngOnInit() {
        this.ngControl = this._injector.get(NgControl, null);
    }
    /**
     * @hidden @internal
     */
    ngAfterViewInit() {
        if (this.ngControl) {
            this.ngControl.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(this.onStatusChanged.bind(this));
            this.manageRequiredAsterisk();
        }
        this.cdr.detectChanges();
    }
    /**
     * @hidden @internal
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.selection.clear(this.id);
    }
    /**
     * @hidden @internal
     * Prevent input blur - closing the items container on Header/Footer Template click.
     */
    mousedownHandler(event) {
        event.preventDefault();
    }
    onStatusChanged() {
        if ((this.ngControl.control.touched || this.ngControl.control.dirty) &&
            (this.ngControl.control.validator || this.ngControl.control.asyncValidator)) {
            if (this.inputGroup.isFocused) {
                this.input.valid = this.ngControl.invalid ? IgxInputState.INVALID : IgxInputState.VALID;
            }
            else {
                this.input.valid = this.ngControl.invalid ? IgxInputState.INVALID : IgxInputState.INITIAL;
            }
        }
        else {
            // B.P. 18 May 2021: IgxDatePicker does not reset its state upon resetForm #9526
            this.input.valid = IgxInputState.INITIAL;
        }
        this.manageRequiredAsterisk();
    }
    navigate(direction, currentIndex) {
        if (this.collapsed && this.selectedItem) {
            this.navigateItem(this.selectedItem.itemIndex);
        }
        super.navigate(direction, currentIndex);
    }
    manageRequiredAsterisk() {
        const hasRequiredHTMLAttribute = this.elementRef.nativeElement.hasAttribute('required');
        if (this.ngControl && this.ngControl.control.validator) {
            // Run the validation with empty object to check if required is enabled.
            const error = this.ngControl.control.validator({});
            this.inputGroup.isRequired = error && error.required;
            this.cdr.markForCheck();
            // If validator is dynamically cleared and no required HTML attribute is set,
            // reset label's required class(asterisk) and IgxInputState #6896
        }
        else if (this.inputGroup.isRequired && this.ngControl && !this.ngControl.control.validator && !hasRequiredHTMLAttribute) {
            this.input.valid = IgxInputState.INITIAL;
            this.inputGroup.isRequired = false;
            this.cdr.markForCheck();
        }
    }
    setSelection(item) {
        if (item && item.value !== undefined && item.value !== null) {
            this.selection.set(this.id, new Set([item]));
        }
        else {
            this.selection.clear(this.id);
        }
    }
}
IgxSelectComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.IgxSelectionAPIService }, { token: IgxOverlayService }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Component });
IgxSelectComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSelectComponent, selector: "igx-select", inputs: { placeholder: "placeholder", disabled: "disabled", overlaySettings: "overlaySettings", value: "value", type: "type" }, outputs: { opening: "opening", opened: "opened", closing: "closing", closed: "closed" }, host: { properties: { "style.maxHeight": "this.maxHeight" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxSelectComponent, multi: true },
        { provide: IGX_DROPDOWN_BASE, useExisting: IgxSelectComponent }
    ], queries: [{ propertyName: "label", first: true, predicate: i0.forwardRef(function () { return IgxLabelDirective; }), descendants: true, static: true }, { propertyName: "toggleIconTemplate", first: true, predicate: IgxSelectToggleIconDirective, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: IgxSelectHeaderDirective, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: IgxSelectFooterDirective, descendants: true, read: TemplateRef }, { propertyName: "hintElement", first: true, predicate: IgxHintDirective, descendants: true, read: ElementRef }, { propertyName: "children", predicate: i0.forwardRef(function () { return IgxSelectItemComponent; }), descendants: true }], viewQueries: [{ propertyName: "inputGroup", first: true, predicate: ["inputGroup"], descendants: true, read: IgxInputGroupComponent, static: true }, { propertyName: "input", first: true, predicate: ["input"], descendants: true, read: IgxInputDirective, static: true }], usesInheritance: true, ngImport: i0, template: "<igx-input-group #inputGroup class=\"input-group\" (click)=\"inputGroupClick($event)\" [type]=\"type\" [displayDensity]=\"displayDensity\">\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n    </ng-container>\n    <input #input class=\"input\" type=\"text\" igxInput [igxSelectItemNavigation]=\"this\"\n        [disabled]=\"disabled\"\n        readonly=\"true\"\n        [attr.placeholder]=\"this.placeholder\"\n        [value]=\"this.selectionValue\"\n        role=\"combobox\"\n        aria-haspopup=\"listbox\"\n        [attr.aria-labelledby]=\"this.label?.id\"\n        [attr.aria-expanded]=\"!this.collapsed\"\n        [attr.aria-owns]=\"this.listId\"\n        [attr.aria-activedescendant]=\"!this.collapsed ? this.focusedItem?.id : null\"\n        (blur)=\"onBlur()\"\n        (focus)=\"onFocus()\"\n    />\n    <ng-container ngProjectAs=\"igx-suffix\">\n            <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n    </ng-container>\n    <igx-suffix>\n        <ng-container *ngIf=\"toggleIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"toggleIconTemplate; context: {$implicit: this.collapsed}\"></ng-container>\n            </ng-container>\n        <igx-icon *ngIf=\"!toggleIconTemplate\">{{ collapsed ? 'arrow_drop_down' : 'arrow_drop_up'}}</igx-icon>\n    </igx-suffix>\n    <ng-container ngProjectAs=\"igx-hint, [igxHint]\" >\n        <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n    </ng-container>\n</igx-input-group>\n<div igxToggle class=\"igx-drop-down__list\" (mousedown)=\"mousedownHandler($event);\"\n    (appended)=\"onToggleContentAppended($event)\"\n    (opening)=\"handleOpening($event)\"\n    (opened)=\"handleOpened()\"\n    (closing)=\"handleClosing($event)\"\n    (closed)=\"handleClosed()\">\n\n    <div *ngIf=\"headerTemplate\" class=\"igx-drop-down__select-header\">\n        <ng-content *ngTemplateOutlet=\"headerTemplate\"></ng-content>\n    </div>\n\n    <!-- #7436 LMB scrolling closes items container - unselectable attribute is IE specific  -->\n    <div #scrollContainer class=\"igx-drop-down__list-scroll\" unselectable=\"on\" [style.maxHeight]=\"maxHeight\"\n        [attr.id]=\"this.listId\" role=\"listbox\" [attr.aria-labelledby]=\"this.label?.id\">\n        <ng-content select=\"igx-select-item, igx-select-item-group\"></ng-content>\n    </div>\n\n    <div *ngIf=\"footerTemplate\" class=\"igx-drop-down__select-footer\">\n        <ng-container *ngTemplateOutlet=\"footerTemplate\"></ng-container>\n    </div>\n</div>\n", styles: [":host{display:block}\n"], components: [{ type: i2.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i3.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i4.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i5.IgxSelectItemNavigationDirective, selector: "[igxSelectItemNavigation]", inputs: ["igxSelectItemNavigation"] }, { type: i6.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i7.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i8.IgxToggleDirective, selector: "[igxToggle]", inputs: ["id"], outputs: ["opened", "opening", "closed", "closing", "appended"], exportAs: ["toggle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-select', providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: IgxSelectComponent, multi: true },
                        { provide: IGX_DROPDOWN_BASE, useExisting: IgxSelectComponent }
                    ], styles: [`
        :host {
            display: block;
        }
    `], template: "<igx-input-group #inputGroup class=\"input-group\" (click)=\"inputGroupClick($event)\" [type]=\"type\" [displayDensity]=\"displayDensity\">\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n    </ng-container>\n    <input #input class=\"input\" type=\"text\" igxInput [igxSelectItemNavigation]=\"this\"\n        [disabled]=\"disabled\"\n        readonly=\"true\"\n        [attr.placeholder]=\"this.placeholder\"\n        [value]=\"this.selectionValue\"\n        role=\"combobox\"\n        aria-haspopup=\"listbox\"\n        [attr.aria-labelledby]=\"this.label?.id\"\n        [attr.aria-expanded]=\"!this.collapsed\"\n        [attr.aria-owns]=\"this.listId\"\n        [attr.aria-activedescendant]=\"!this.collapsed ? this.focusedItem?.id : null\"\n        (blur)=\"onBlur()\"\n        (focus)=\"onFocus()\"\n    />\n    <ng-container ngProjectAs=\"igx-suffix\">\n            <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n    </ng-container>\n    <igx-suffix>\n        <ng-container *ngIf=\"toggleIconTemplate\">\n            <ng-container *ngTemplateOutlet=\"toggleIconTemplate; context: {$implicit: this.collapsed}\"></ng-container>\n            </ng-container>\n        <igx-icon *ngIf=\"!toggleIconTemplate\">{{ collapsed ? 'arrow_drop_down' : 'arrow_drop_up'}}</igx-icon>\n    </igx-suffix>\n    <ng-container ngProjectAs=\"igx-hint, [igxHint]\" >\n        <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n    </ng-container>\n</igx-input-group>\n<div igxToggle class=\"igx-drop-down__list\" (mousedown)=\"mousedownHandler($event);\"\n    (appended)=\"onToggleContentAppended($event)\"\n    (opening)=\"handleOpening($event)\"\n    (opened)=\"handleOpened()\"\n    (closing)=\"handleClosing($event)\"\n    (closed)=\"handleClosed()\">\n\n    <div *ngIf=\"headerTemplate\" class=\"igx-drop-down__select-header\">\n        <ng-content *ngTemplateOutlet=\"headerTemplate\"></ng-content>\n    </div>\n\n    <!-- #7436 LMB scrolling closes items container - unselectable attribute is IE specific  -->\n    <div #scrollContainer class=\"igx-drop-down__list-scroll\" unselectable=\"on\" [style.maxHeight]=\"maxHeight\"\n        [attr.id]=\"this.listId\" role=\"listbox\" [attr.aria-labelledby]=\"this.label?.id\">\n        <ng-content select=\"igx-select-item, igx-select-item-group\"></ng-content>\n    </div>\n\n    <div *ngIf=\"footerTemplate\" class=\"igx-drop-down__select-footer\">\n        <ng-container *ngTemplateOutlet=\"footerTemplate\"></ng-container>\n    </div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.IgxSelectionAPIService }, { type: i9.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_INPUT_GROUP_TYPE]
                }] }, { type: i0.Injector }]; }, propDecorators: { inputGroup: [{
                type: ViewChild,
                args: ['inputGroup', { read: IgxInputGroupComponent, static: true }]
            }], input: [{
                type: ViewChild,
                args: ['input', { read: IgxInputDirective, static: true }]
            }], children: [{
                type: ContentChildren,
                args: [forwardRef(() => IgxSelectItemComponent), { descendants: true }]
            }], label: [{
                type: ContentChild,
                args: [forwardRef(() => IgxLabelDirective), { static: true }]
            }], placeholder: [{
                type: Input
            }], disabled: [{
                type: Input
            }], overlaySettings: [{
                type: Input
            }], maxHeight: [{
                type: HostBinding,
                args: ['style.maxHeight']
            }], opening: [{
                type: Output
            }], opened: [{
                type: Output
            }], closing: [{
                type: Output
            }], closed: [{
                type: Output
            }], toggleIconTemplate: [{
                type: ContentChild,
                args: [IgxSelectToggleIconDirective, { read: TemplateRef }]
            }], headerTemplate: [{
                type: ContentChild,
                args: [IgxSelectHeaderDirective, { read: TemplateRef, static: false }]
            }], footerTemplate: [{
                type: ContentChild,
                args: [IgxSelectFooterDirective, { read: TemplateRef, static: false }]
            }], hintElement: [{
                type: ContentChild,
                args: [IgxHintDirective, { read: ElementRef }]
            }], value: [{
                type: Input
            }], type: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZWxlY3Qvc2VsZWN0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZWxlY3Qvc2VsZWN0LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFJSCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLE1BQU0sRUFFTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixXQUFXLEVBQ1gsU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBeUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckcsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBMEIsTUFBTSxpQkFBaUIsQ0FBQztBQUk5RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4RSxPQUFPLEVBQUUsaUJBQWlCLEVBQWlDLE1BQU0sK0JBQStCLENBQUM7QUFDakcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFFN0YsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FB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QUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFNbkQsV0FBVztzQkFBMUIsS0FBSztnQkFTVSxRQUFRO3NCQUF2QixLQUFLO2dCQVNDLGVBQWU7c0JBRHJCLEtBQUs7Z0JBS0MsU0FBUztzQkFEZixXQUFXO3VCQUFDLGlCQUFpQjtnQkFXdkIsT0FBTztzQkFEYixNQUFNO2dCQVdBLE1BQU07c0JBRFosTUFBTTtnQkFXQSxPQUFPO3NCQURiLE1BQU07Z0JBV0EsTUFBTTtzQkFEWixNQUFNO2dCQXNCQSxrQkFBa0I7c0JBRHhCLFlBQVk7dUJBQUMsNEJBQTRCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQXdCMUQsY0FBYztzQkFEcEIsWUFBWTt1QkFBQyx3QkFBd0IsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQkF3QnJFLGNBQWM7c0JBRHBCLFlBQVk7dUJBQUMsd0JBQXdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBR2QsV0FBVztzQkFBeEUsWUFBWTt1QkFBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBc0N6QyxLQUFLO3NCQURmLEtBQUs7Z0JBb0JLLElBQUk7c0JBRGQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIERpcmVjdGl2ZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBmb3J3YXJkUmVmLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEluamVjdCxcbiAgICBJbmplY3RvcixcbiAgICBJbnB1dCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE9wdGlvbmFsLFxuICAgIE91dHB1dCxcbiAgICBRdWVyeUxpc3QsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTmdDb250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IG5vb3AsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERpc3BsYXlEZW5zaXR5VG9rZW4sIElEaXNwbGF5RGVuc2l0eU9wdGlvbnMgfSBmcm9tICcuLi9jb3JlL2RlbnNpdHknO1xuaW1wb3J0IHsgRWRpdG9yUHJvdmlkZXIgfSBmcm9tICcuLi9jb3JlL2VkaXQtcHJvdmlkZXInO1xuaW1wb3J0IHsgSWd4U2VsZWN0aW9uQVBJU2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VsZWN0aW9uJztcbmltcG9ydCB7IElCYXNlQ2FuY2VsYWJsZUJyb3dzZXJFdmVudEFyZ3MsIElCYXNlRXZlbnRBcmdzIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJZ3hMYWJlbERpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbGFiZWwvbGFiZWwuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneERyb3BEb3duSXRlbUJhc2VEaXJlY3RpdmUgfSBmcm9tICcuLi9kcm9wLWRvd24vZHJvcC1kb3duLWl0ZW0uYmFzZSc7XG5pbXBvcnQgeyBJR1hfRFJPUERPV05fQkFTRSwgSVNlbGVjdGlvbkV2ZW50QXJncywgTmF2aWdhdGUgfSBmcm9tICcuLi9kcm9wLWRvd24vZHJvcC1kb3duLmNvbW1vbic7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50IH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvaW5wdXQtZ3JvdXAuY29tcG9uZW50JztcbmltcG9ydCB7IEFic29sdXRlU2Nyb2xsU3RyYXRlZ3kgfSBmcm9tICcuLi9zZXJ2aWNlcy9vdmVybGF5L3Njcm9sbC9hYnNvbHV0ZS1zY3JvbGwtc3RyYXRlZ3knO1xuaW1wb3J0IHsgT3ZlcmxheVNldHRpbmdzIH0gZnJvbSAnLi4vc2VydmljZXMvb3ZlcmxheS91dGlsaXRpZXMnO1xuaW1wb3J0IHsgSWd4SW5wdXREaXJlY3RpdmUsIElneElucHV0U3RhdGUgfSBmcm9tICcuLy4uL2RpcmVjdGl2ZXMvaW5wdXQvaW5wdXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneERyb3BEb3duQ29tcG9uZW50IH0gZnJvbSAnLi8uLi9kcm9wLWRvd24vZHJvcC1kb3duLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hTZWxlY3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VsZWN0UG9zaXRpb25pbmdTdHJhdGVneSB9IGZyb20gJy4vc2VsZWN0LXBvc2l0aW9uaW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IElneFNlbGVjdEJhc2UgfSBmcm9tICcuL3NlbGVjdC5jb21tb24nO1xuaW1wb3J0IHsgSWd4SGludERpcmVjdGl2ZSwgSWd4SW5wdXRHcm91cFR5cGUsIElHWF9JTlBVVF9HUk9VUF9UWVBFIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBUb2dnbGVWaWV3Q2FuY2VsYWJsZUV2ZW50QXJncywgVG9nZ2xlVmlld0V2ZW50QXJncyB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdG9nZ2xlL3RvZ2dsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4T3ZlcmxheVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9vdmVybGF5L292ZXJsYXknO1xuXG4vKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneFNlbGVjdFRvZ2dsZUljb25dJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hTZWxlY3RUb2dnbGVJY29uRGlyZWN0aXZlIHtcbn1cblxuLyoqIEBoaWRkZW4gQGludGVybmFsICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tpZ3hTZWxlY3RIZWFkZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hTZWxlY3RIZWFkZXJEaXJlY3RpdmUge1xufVxuXG4vKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneFNlbGVjdEZvb3Rlcl0nXG59KVxuZXhwb3J0IGNsYXNzIElneFNlbGVjdEZvb3RlckRpcmVjdGl2ZSB7XG59XG5cbi8qKlxuICogKipJZ25pdGUgVUkgZm9yIEFuZ3VsYXIgU2VsZWN0KiogLVxuICogW0RvY3VtZW50YXRpb25dKGh0dHBzOi8vd3d3LmluZnJhZ2lzdGljcy5jb20vcHJvZHVjdHMvaWduaXRlLXVpLWFuZ3VsYXIvYW5ndWxhci9jb21wb25lbnRzL3NlbGVjdClcbiAqXG4gKiBUaGUgYGlneFNlbGVjdGAgcHJvdmlkZXMgYW4gaW5wdXQgd2l0aCBkcm9wZG93biBsaXN0IGFsbG93aW5nIHNlbGVjdGlvbiBvZiBhIHNpbmdsZSBpdGVtLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBodG1sXG4gKiA8aWd4LXNlbGVjdCAjc2VsZWN0MSBbcGxhY2Vob2xkZXJdPVwiJ1BpY2sgT25lJ1wiPlxuICogICA8bGFiZWwgaWd4TGFiZWw+U2VsZWN0IExhYmVsPC9sYWJlbD5cbiAqICAgPGlneC1zZWxlY3QtaXRlbSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtc1wiIFt2YWx1ZV09XCJpdGVtLmZpZWxkXCI+XG4gKiAgICAge3sgaXRlbS5maWVsZCB9fVxuICogICA8L2lneC1zZWxlY3QtaXRlbT5cbiAqIDwvaWd4LXNlbGVjdD5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lneC1zZWxlY3QnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zZWxlY3QuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogSWd4U2VsZWN0Q29tcG9uZW50LCBtdWx0aTogdHJ1ZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IElHWF9EUk9QRE9XTl9CQVNFLCB1c2VFeGlzdGluZzogSWd4U2VsZWN0Q29tcG9uZW50IH1dLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIH1cbiAgICBgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hTZWxlY3RDb21wb25lbnQgZXh0ZW5kcyBJZ3hEcm9wRG93bkNvbXBvbmVudCBpbXBsZW1lbnRzIElneFNlbGVjdEJhc2UsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIEFmdGVyQ29udGVudEluaXQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBFZGl0b3JQcm92aWRlciB7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAVmlld0NoaWxkKCdpbnB1dEdyb3VwJywgeyByZWFkOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50LCBzdGF0aWM6IHRydWUgfSkgcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAVmlld0NoaWxkKCdpbnB1dCcsIHsgcmVhZDogSWd4SW5wdXREaXJlY3RpdmUsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgaW5wdXQ6IElneElucHV0RGlyZWN0aXZlO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IElneFNlbGVjdEl0ZW1Db21wb25lbnQpLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIGNoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4U2VsZWN0SXRlbUNvbXBvbmVudD47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkKGZvcndhcmRSZWYoKCkgPT4gSWd4TGFiZWxEaXJlY3RpdmUpLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgbGFiZWw6IElneExhYmVsRGlyZWN0aXZlO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyBpbnB1dCBwbGFjZWhvbGRlci5cbiAgICAgKlxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwbGFjZWhvbGRlcjtcblxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgZGlzYWJsZXMgdGhlIGBJZ3hTZWxlY3RDb21wb25lbnRgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNlbGVjdCBbZGlzYWJsZWRdPVwiJ3RydWUnXCI+PC9pZ3gtc2VsZWN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyBjdXN0b20gT3ZlcmxheVNldHRpbmdzIGBJZ3hTZWxlY3RDb21wb25lbnRgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNlbGVjdCBbb3ZlcmxheVNldHRpbmdzXSA9IFwiY3VzdG9tT3ZlcmxheVNldHRpbmdzXCI+PC9pZ3gtc2VsZWN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG92ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXhIZWlnaHQnKVxuICAgIHB1YmxpYyBtYXhIZWlnaHQgPSAnMjU2cHgnO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBiZWZvcmUgdGhlIGRyb3Bkb3duIGlzIG9wZW5lZFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2VsZWN0IG9wZW5pbmc9J2hhbmRsZU9wZW5pbmcoJGV2ZW50KSc+PC9pZ3gtc2VsZWN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvcGVuaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUNhbmNlbGFibGVCcm93c2VyRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBhZnRlciB0aGUgZHJvcGRvd24gaXMgb3BlbmVkXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zZWxlY3QgKG9wZW5lZCk9J2hhbmRsZU9wZW5lZCgkZXZlbnQpJz48L2lneC1zZWxlY3Q+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9wZW5lZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUJhc2VFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGJlZm9yZSB0aGUgZHJvcGRvd24gaXMgY2xvc2VkXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zZWxlY3QgKGNsb3NpbmcpPSdoYW5kbGVDbG9zaW5nKCRldmVudCknPjwvaWd4LXNlbGVjdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgdGhlIGRyb3Bkb3duIGlzIGNsb3NlZFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2VsZWN0IChjbG9zZWQpPSdoYW5kbGVDbG9zZWQoJGV2ZW50KSc+PC9pZ3gtc2VsZWN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjbG9zZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElCYXNlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBzZWxlY3QgVE9HR0xFKG9wZW4vY2xvc2UpIGJ1dHRvblxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIFNldCBpbiB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG15Q29tcG9uZW50LmN1c3RvbVRlbXBsYXRlO1xuICAgICAqIG15Q29tcG9uZW50LnNlbGVjdC50b2dnbGVJY29uVGVtcGxhdGUgPSBteUN1c3RvbVRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCBpbiBtYXJrdXAgLS0+XG4gICAgICogIDxpZ3gtc2VsZWN0ICNzZWxlY3Q+XG4gICAgICogICAgICAuLi5cbiAgICAgKiAgICAgIDxuZy10ZW1wbGF0ZSBpZ3hTZWxlY3RUb2dnbGVJY29uIGxldC1jb2xsYXBzZWQ+XG4gICAgICogICAgICAgICAgPGlneC1pY29uPnt7IGNvbGxhcHNlZCA/ICdyZW1vdmVfY2lyY2xlJyA6ICdyZW1vdmVfY2lyY2xlX291dGxpbmUnfX08L2lneC1pY29uPlxuICAgICAqICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiAgPC9pZ3gtc2VsZWN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4U2VsZWN0VG9nZ2xlSWNvbkRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyB0b2dnbGVJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1c3RvbSB0ZW1wbGF0ZSwgaWYgYW55LCB0aGF0IHNob3VsZCBiZSB1c2VkIHdoZW4gcmVuZGVyaW5nIHRoZSBIRUFERVIgZm9yIHRoZSBzZWxlY3QgaXRlbXMgbGlzdFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIFNldCBpbiB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG15Q29tcG9uZW50LmN1c3RvbVRlbXBsYXRlO1xuICAgICAqIG15Q29tcG9uZW50LnNlbGVjdC5oZWFkZXJUZW1wbGF0ZSA9IG15Q3VzdG9tVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS0gU2V0IGluIG1hcmt1cCAtLT5cbiAgICAgKiAgPGlneC1zZWxlY3QgI3NlbGVjdD5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICAgICAgPG5nLXRlbXBsYXRlIGlneFNlbGVjdEhlYWRlcj5cbiAgICAgKiAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VsZWN0X19oZWFkZXJcIj5cbiAgICAgKiAgICAgICAgICAgICAgVGhpcyBpcyBhIGN1c3RvbSBoZWFkZXJcbiAgICAgKiAgICAgICAgICA8L2Rpdj5cbiAgICAgKiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogIDwvaWd4LXNlbGVjdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneFNlbGVjdEhlYWRlckRpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICAgIHB1YmxpYyBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tIHRlbXBsYXRlLCBpZiBhbnksIHRoYXQgc2hvdWxkIGJlIHVzZWQgd2hlbiByZW5kZXJpbmcgdGhlIEZPT1RFUiBmb3IgdGhlIHNlbGVjdCBpdGVtcyBsaXN0XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gU2V0IGluIHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteUN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbXlDb21wb25lbnQuY3VzdG9tVGVtcGxhdGU7XG4gICAgICogbXlDb21wb25lbnQuc2VsZWN0LmZvb3RlclRlbXBsYXRlID0gbXlDdXN0b21UZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLSBTZXQgaW4gbWFya3VwIC0tPlxuICAgICAqICA8aWd4LXNlbGVjdCAjc2VsZWN0PlxuICAgICAqICAgICAgLi4uXG4gICAgICogICAgICA8bmctdGVtcGxhdGUgaWd4U2VsZWN0Rm9vdGVyPlxuICAgICAqICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RfX2Zvb3RlclwiPlxuICAgICAqICAgICAgICAgICAgICBUaGlzIGlzIGEgY3VzdG9tIGZvb3RlclxuICAgICAqICAgICAgICAgIDwvZGl2PlxuICAgICAqICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiAgPC9pZ3gtc2VsZWN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4U2VsZWN0Rm9vdGVyRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gICAgcHVibGljIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+ID0gbnVsbDtcblxuICAgIEBDb250ZW50Q2hpbGQoSWd4SGludERpcmVjdGl2ZSwgeyByZWFkOiBFbGVtZW50UmVmIH0pIHByaXZhdGUgaGludEVsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgd2lkdGg6IHN0cmluZztcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCBkbyBub3QgdXNlIHRoZSBkcm9wLWRvd24gY29udGFpbmVyIGNsYXNzICovXG4gICAgcHVibGljIGNzc0NsYXNzID0gZmFsc2U7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgYWxsb3dJdGVtc0ZvY3VzID0gZmFsc2U7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaGVpZ2h0OiBzdHJpbmc7XG5cbiAgICBwcm90ZWN0ZWQgZGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgcHJpdmF0ZSBuZ0NvbnRyb2w6IE5nQ29udHJvbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBfb3ZlcmxheURlZmF1bHRzOiBPdmVybGF5U2V0dGluZ3M7XG4gICAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcbiAgICBwcml2YXRlIF90eXBlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IGdldHMvc2V0cyB0aGUgY29tcG9uZW50IHZhbHVlLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBzZWxlY3RWYWx1ZSA9IHRoaXMuc2VsZWN0LnZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIHNldFxuICAgICAqIHRoaXMuc2VsZWN0LnZhbHVlID0gJ0xvbmRvbic7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc2VsZWN0IFt2YWx1ZV09XCJ2YWx1ZVwiPjwvaWd4LXNlbGVjdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IHZhbHVlKHY6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5fdmFsdWUgPT09IHYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92YWx1ZSA9IHY7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKHRoaXMuaXRlbXMuZmluZCh4ID0+IHgudmFsdWUgPT09IHRoaXMudmFsdWUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIGhvdyB0aGUgc2VsZWN0IHdpbGwgYmUgc3R5bGVkLlxuICAgICAqIFRoZSBhbGxvd2VkIHZhbHVlcyBhcmUgYGxpbmVgLCBgYm94YCBhbmQgYGJvcmRlcmAuIFRoZSBpbnB1dC1ncm91cCBkZWZhdWx0IGlzIGBsaW5lYC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zZWxlY3QgW3R5cGVdPVwiJ2JveCdcIj48L2lneC1zZWxlY3Q+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogSWd4SW5wdXRHcm91cFR5cGUge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGUgfHwgdGhpcy5faW5wdXRHcm91cFR5cGUgfHwgJ2xpbmUnO1xuICAgICAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHR5cGUodmFsOiBJZ3hJbnB1dEdyb3VwVHlwZSkge1xuICAgICAgICB0aGlzLl90eXBlID0gdmFsO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgc2VsZWN0aW9uVmFsdWUoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtO1xuICAgICAgICByZXR1cm4gc2VsZWN0ZWRJdGVtID8gc2VsZWN0ZWRJdGVtLml0ZW1UZXh0IDogJyc7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBzZWxlY3RlZEl0ZW0oKTogSWd4U2VsZWN0SXRlbUNvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5maXJzdF9pdGVtKHRoaXMuaWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX29uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuICAgIHByaXZhdGUgX29uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3Rpb246IElneFNlbGVjdGlvbkFQSVNlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoSWd4T3ZlcmxheVNlcnZpY2UpIHByb3RlY3RlZCBvdmVybGF5U2VydmljZTogSWd4T3ZlcmxheVNlcnZpY2UsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRGlzcGxheURlbnNpdHlUb2tlbikgcHJvdGVjdGVkIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnM6IElEaXNwbGF5RGVuc2l0eU9wdGlvbnMsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoSUdYX0lOUFVUX0dST1VQX1RZUEUpIHByaXZhdGUgX2lucHV0R3JvdXBUeXBlOiBJZ3hJbnB1dEdyb3VwVHlwZSxcbiAgICAgICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNkciwgc2VsZWN0aW9uLCBfZGlzcGxheURlbnNpdHlPcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyNyZWdpb24gQ29udHJvbFZhbHVlQWNjZXNzb3JcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlID0gKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgfVxuICAgIC8vI2VuZHJlZ2lvblxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldEVkaXRFbGVtZW50KCk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBzZWxlY3RJdGVtKG5ld1NlbGVjdGlvbjogSWd4RHJvcERvd25JdGVtQmFzZURpcmVjdGl2ZSwgZXZlbnQ/KSB7XG4gICAgICAgIGNvbnN0IG9sZFNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0ZWRJdGVtO1xuXG4gICAgICAgIGlmIChuZXdTZWxlY3Rpb24gPT09IG51bGwgfHwgbmV3U2VsZWN0aW9uLmRpc2FibGVkIHx8IG5ld1NlbGVjdGlvbi5pc0hlYWRlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld1NlbGVjdGlvbiA9PT0gb2xkU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZURpcmVjdGl2ZS5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJnczogSVNlbGVjdGlvbkV2ZW50QXJncyA9IHsgb2xkU2VsZWN0aW9uLCBuZXdTZWxlY3Rpb24sIGNhbmNlbDogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2luZy5lbWl0KGFyZ3MpO1xuXG4gICAgICAgIGlmIChhcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obmV3U2VsZWN0aW9uKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBuZXdTZWxlY3Rpb24udmFsdWU7XG5cbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZURpcmVjdGl2ZS5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXRGaXJzdEl0ZW1FbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlyc3QuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wZW5zIHRoZSBzZWxlY3RcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnNlbGVjdC5vcGVuKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIG9wZW4ob3ZlcmxheVNldHRpbmdzPzogT3ZlcmxheVNldHRpbmdzKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZUZpcnN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5vcGVuKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX292ZXJsYXlEZWZhdWx0cywgdGhpcy5vdmVybGF5U2V0dGluZ3MsIG92ZXJsYXlTZXR0aW5ncykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbnB1dEdyb3VwQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQsIG92ZXJsYXlTZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncykge1xuICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIGlmICh0aGlzLmhpbnRFbGVtZW50ICYmIHRhcmdldEVsZW1lbnQuY29udGFpbnModGhpcy5oaW50RWxlbWVudC5uYXRpdmVFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudG9nZ2xlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX292ZXJsYXlEZWZhdWx0cywgdGhpcy5vdmVybGF5U2V0dGluZ3MsIG92ZXJsYXlTZXR0aW5ncykpO1xufVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheURlZmF1bHRzID0ge1xuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmdldEVkaXRFbGVtZW50KCksXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBuZXcgU2VsZWN0UG9zaXRpb25pbmdTdHJhdGVneSh0aGlzKSxcbiAgICAgICAgICAgIHNjcm9sbFN0cmF0ZWd5OiBuZXcgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICAgICAgZXhjbHVkZUZyb21PdXRzaWRlQ2xpY2s6IFt0aGlzLmlucHV0R3JvdXAuZWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50XVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjaGFuZ2VzJCA9IHRoaXMuY2hpbGRyZW4uY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKHRoaXMuaXRlbXMuZmluZCh4ID0+IHgudmFsdWUgPT09IHRoaXMudmFsdWUpKTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjaGFuZ2VzJC5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyc1xuICAgICAqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlT3BlbmluZyhlOiBUb2dnbGVWaWV3Q2FuY2VsYWJsZUV2ZW50QXJncykge1xuICAgICAgICBjb25zdCBhcmdzOiBJQmFzZUNhbmNlbGFibGVCcm93c2VyRXZlbnRBcmdzID0geyBvd25lcjp0aGlzLCBldmVudDplLmV2ZW50LCBjYW5jZWw6IGUuY2FuY2VsIH07XG4gICAgICAgIHRoaXMub3BlbmluZy5lbWl0KGFyZ3MpO1xuXG4gICAgICAgIGUuY2FuY2VsID0gYXJncy5jYW5jZWw7XG4gICAgICAgIGlmIChhcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG9uVG9nZ2xlQ29udGVudEFwcGVuZGVkKGV2ZW50OiBUb2dnbGVWaWV3RXZlbnRBcmdzKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLm92ZXJsYXlTZXJ2aWNlLmdldE92ZXJsYXlCeUlkKGV2ZW50LmlkKTtcbiAgICAgICAgaWYgKGluZm8/LnNldHRpbmdzPy5wb3NpdGlvblN0cmF0ZWd5IGluc3RhbmNlb2YgU2VsZWN0UG9zaXRpb25pbmdTdHJhdGVneSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLm9uVG9nZ2xlQ29udGVudEFwcGVuZGVkKGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaGFuZGxlT3BlbmVkKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1Gb2N1cygpO1xuICAgICAgICB0aGlzLm9wZW5lZC5lbWl0KHsgb3duZXI6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUNsb3NpbmcoZTogVG9nZ2xlVmlld0NhbmNlbGFibGVFdmVudEFyZ3MpIHtcbiAgICAgICAgY29uc3QgYXJnczogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyA9IHsgb3duZXI6dGhpcywgZXZlbnQ6ZS5ldmVudCwgY2FuY2VsOiBlLmNhbmNlbCB9O1xuICAgICAgICB0aGlzLmNsb3NpbmcuZW1pdChhcmdzKTtcbiAgICAgICAgZS5jYW5jZWwgPSBhcmdzLmNhbmNlbDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgaGFuZGxlQ2xvc2VkKCkge1xuICAgICAgICB0aGlzLmZvY3VzSXRlbShmYWxzZSk7XG4gICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoeyBvd25lcjogdGhpcyB9KTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25CbHVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjaygpO1xuICAgICAgICBpZiAodGhpcy5uZ0NvbnRyb2wgJiYgdGhpcy5uZ0NvbnRyb2wuaW52YWxpZCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dC52YWxpZCA9IElneElucHV0U3RhdGUuSU5WQUxJRDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsaWQgPSBJZ3hJbnB1dFN0YXRlLklOSVRJQUw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25Gb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5uZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQ8TmdDb250cm9sPihOZ0NvbnRyb2wsIG51bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAgICAgICB0aGlzLm5nQ29udHJvbC5zdGF0dXNDaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUodGhpcy5vblN0YXR1c0NoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZVJlcXVpcmVkQXN0ZXJpc2soKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcih0aGlzLmlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIFByZXZlbnQgaW5wdXQgYmx1ciAtIGNsb3NpbmcgdGhlIGl0ZW1zIGNvbnRhaW5lciBvbiBIZWFkZXIvRm9vdGVyIFRlbXBsYXRlIGNsaWNrLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3VzZWRvd25IYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uU3RhdHVzQ2hhbmdlZCgpIHtcbiAgICAgICAgaWYgKCh0aGlzLm5nQ29udHJvbC5jb250cm9sLnRvdWNoZWQgfHwgdGhpcy5uZ0NvbnRyb2wuY29udHJvbC5kaXJ0eSkgJiZcbiAgICAgICAgICAgICh0aGlzLm5nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvciB8fCB0aGlzLm5nQ29udHJvbC5jb250cm9sLmFzeW5jVmFsaWRhdG9yKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRHcm91cC5pc0ZvY3VzZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0LnZhbGlkID0gdGhpcy5uZ0NvbnRyb2wuaW52YWxpZCA/IElneElucHV0U3RhdGUuSU5WQUxJRCA6IElneElucHV0U3RhdGUuVkFMSUQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsaWQgPSB0aGlzLm5nQ29udHJvbC5pbnZhbGlkID8gSWd4SW5wdXRTdGF0ZS5JTlZBTElEIDogSWd4SW5wdXRTdGF0ZS5JTklUSUFMO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQi5QLiAxOCBNYXkgMjAyMTogSWd4RGF0ZVBpY2tlciBkb2VzIG5vdCByZXNldCBpdHMgc3RhdGUgdXBvbiByZXNldEZvcm0gIzk1MjZcbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmFsaWQgPSBJZ3hJbnB1dFN0YXRlLklOSVRJQUw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYW5hZ2VSZXF1aXJlZEFzdGVyaXNrKCk7XG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgbmF2aWdhdGUoZGlyZWN0aW9uOiBOYXZpZ2F0ZSwgY3VycmVudEluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZCAmJiB0aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZUl0ZW0odGhpcy5zZWxlY3RlZEl0ZW0uaXRlbUluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5uYXZpZ2F0ZShkaXJlY3Rpb24sIGN1cnJlbnRJbmRleCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hbmFnZVJlcXVpcmVkQXN0ZXJpc2soKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGhhc1JlcXVpcmVkSFRNTEF0dHJpYnV0ZSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKTtcbiAgICAgICAgaWYgKHRoaXMubmdDb250cm9sICYmIHRoaXMubmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAvLyBSdW4gdGhlIHZhbGlkYXRpb24gd2l0aCBlbXB0eSBvYmplY3QgdG8gY2hlY2sgaWYgcmVxdWlyZWQgaXMgZW5hYmxlZC5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gdGhpcy5uZ0NvbnRyb2wuY29udHJvbC52YWxpZGF0b3Ioe30gYXMgQWJzdHJhY3RDb250cm9sKTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRHcm91cC5pc1JlcXVpcmVkID0gZXJyb3IgJiYgZXJyb3IucmVxdWlyZWQ7XG4gICAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgICAvLyBJZiB2YWxpZGF0b3IgaXMgZHluYW1pY2FsbHkgY2xlYXJlZCBhbmQgbm8gcmVxdWlyZWQgSFRNTCBhdHRyaWJ1dGUgaXMgc2V0LFxuICAgICAgICAvLyByZXNldCBsYWJlbCdzIHJlcXVpcmVkIGNsYXNzKGFzdGVyaXNrKSBhbmQgSWd4SW5wdXRTdGF0ZSAjNjg5NlxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXRHcm91cC5pc1JlcXVpcmVkICYmIHRoaXMubmdDb250cm9sICYmICF0aGlzLm5nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvciAmJiAhaGFzUmVxdWlyZWRIVE1MQXR0cmlidXRlKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbGlkID0gSWd4SW5wdXRTdGF0ZS5JTklUSUFMO1xuICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwLmlzUmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTZWxlY3Rpb24oaXRlbTogSWd4RHJvcERvd25JdGVtQmFzZURpcmVjdGl2ZSkge1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLnZhbHVlICE9PSB1bmRlZmluZWQgJiYgaXRlbS52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2V0KHRoaXMuaWQsIG5ldyBTZXQoW2l0ZW1dKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcih0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwiPGlneC1pbnB1dC1ncm91cCAjaW5wdXRHcm91cCBjbGFzcz1cImlucHV0LWdyb3VwXCIgKGNsaWNrKT1cImlucHV0R3JvdXBDbGljaygkZXZlbnQpXCIgW3R5cGVdPVwidHlwZVwiIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiPlxuICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJbaWd4TGFiZWxdXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltpZ3hMYWJlbF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1wcmVmaXhcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LXByZWZpeCxbaWd4UHJlZml4XVwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8aW5wdXQgI2lucHV0IGNsYXNzPVwiaW5wdXRcIiB0eXBlPVwidGV4dFwiIGlneElucHV0IFtpZ3hTZWxlY3RJdGVtTmF2aWdhdGlvbl09XCJ0aGlzXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgcmVhZG9ubHk9XCJ0cnVlXCJcbiAgICAgICAgW2F0dHIucGxhY2Vob2xkZXJdPVwidGhpcy5wbGFjZWhvbGRlclwiXG4gICAgICAgIFt2YWx1ZV09XCJ0aGlzLnNlbGVjdGlvblZhbHVlXCJcbiAgICAgICAgcm9sZT1cImNvbWJvYm94XCJcbiAgICAgICAgYXJpYS1oYXNwb3B1cD1cImxpc3Rib3hcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwidGhpcy5sYWJlbD8uaWRcIlxuICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIiF0aGlzLmNvbGxhcHNlZFwiXG4gICAgICAgIFthdHRyLmFyaWEtb3duc109XCJ0aGlzLmxpc3RJZFwiXG4gICAgICAgIFthdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF09XCIhdGhpcy5jb2xsYXBzZWQgPyB0aGlzLmZvY3VzZWRJdGVtPy5pZCA6IG51bGxcIlxuICAgICAgICAoYmx1cik9XCJvbkJsdXIoKVwiXG4gICAgICAgIChmb2N1cyk9XCJvbkZvY3VzKClcIlxuICAgIC8+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1zdWZmaXhcIj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1zdWZmaXgsW2lneFN1ZmZpeF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPGlneC1zdWZmaXg+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0b2dnbGVJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0b2dnbGVJY29uVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHRoaXMuY29sbGFwc2VkfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxpZ3gtaWNvbiAqbmdJZj1cIiF0b2dnbGVJY29uVGVtcGxhdGVcIj57eyBjb2xsYXBzZWQgPyAnYXJyb3dfZHJvcF9kb3duJyA6ICdhcnJvd19kcm9wX3VwJ319PC9pZ3gtaWNvbj5cbiAgICA8L2lneC1zdWZmaXg+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1oaW50LCBbaWd4SGludF1cIiA+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1oaW50LCBbaWd4SGludF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG48L2lneC1pbnB1dC1ncm91cD5cbjxkaXYgaWd4VG9nZ2xlIGNsYXNzPVwiaWd4LWRyb3AtZG93bl9fbGlzdFwiIChtb3VzZWRvd24pPVwibW91c2Vkb3duSGFuZGxlcigkZXZlbnQpO1wiXG4gICAgKGFwcGVuZGVkKT1cIm9uVG9nZ2xlQ29udGVudEFwcGVuZGVkKCRldmVudClcIlxuICAgIChvcGVuaW5nKT1cImhhbmRsZU9wZW5pbmcoJGV2ZW50KVwiXG4gICAgKG9wZW5lZCk9XCJoYW5kbGVPcGVuZWQoKVwiXG4gICAgKGNsb3NpbmcpPVwiaGFuZGxlQ2xvc2luZygkZXZlbnQpXCJcbiAgICAoY2xvc2VkKT1cImhhbmRsZUNsb3NlZCgpXCI+XG5cbiAgICA8ZGl2ICpuZ0lmPVwiaGVhZGVyVGVtcGxhdGVcIiBjbGFzcz1cImlneC1kcm9wLWRvd25fX3NlbGVjdC1oZWFkZXJcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gIzc0MzYgTE1CIHNjcm9sbGluZyBjbG9zZXMgaXRlbXMgY29udGFpbmVyIC0gdW5zZWxlY3RhYmxlIGF0dHJpYnV0ZSBpcyBJRSBzcGVjaWZpYyAgLS0+XG4gICAgPGRpdiAjc2Nyb2xsQ29udGFpbmVyIGNsYXNzPVwiaWd4LWRyb3AtZG93bl9fbGlzdC1zY3JvbGxcIiB1bnNlbGVjdGFibGU9XCJvblwiIFtzdHlsZS5tYXhIZWlnaHRdPVwibWF4SGVpZ2h0XCJcbiAgICAgICAgW2F0dHIuaWRdPVwidGhpcy5saXN0SWRcIiByb2xlPVwibGlzdGJveFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJ0aGlzLmxhYmVsPy5pZFwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtc2VsZWN0LWl0ZW0sIGlneC1zZWxlY3QtaXRlbS1ncm91cFwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgKm5nSWY9XCJmb290ZXJUZW1wbGF0ZVwiIGNsYXNzPVwiaWd4LWRyb3AtZG93bl9fc2VsZWN0LWZvb3RlclwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuIl19