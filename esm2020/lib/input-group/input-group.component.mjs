import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ContentChild, ContentChildren, HostBinding, HostListener, Inject, Input, NgModule, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { DisplayDensity, DisplayDensityBase, DisplayDensityToken } from '../core/displayDensity';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { mkenum } from '../core/utils';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxHintDirective } from '../directives/hint/hint.directive';
import { IgxInputDirective, IgxInputState } from '../directives/input/input.directive';
import { IgxLabelDirective } from '../directives/label/label.directive';
import { IgxPrefixModule } from '../directives/prefix/prefix.directive';
import { IgxSuffixModule } from '../directives/suffix/suffix.directive';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupBase } from './input-group.common';
import { IGX_INPUT_GROUP_TYPE } from './inputGroupType';
import * as i0 from "@angular/core";
import * as i1 from "../core/utils";
import * as i2 from "../icon/icon.component";
import * as i3 from "@angular/common";
import * as i4 from "../directives/prefix/prefix.directive";
import * as i5 from "../directives/button/button.directive";
import * as i6 from "../directives/suffix/suffix.directive";
const IgxInputGroupTheme = mkenum({
    Material: 'material',
    Fluent: 'fluent',
    Bootstrap: 'bootstrap',
    IndigoDesign: 'indigo-design'
});
export class IgxInputGroupComponent extends DisplayDensityBase {
    constructor(element, _displayDensityOptions, _inputGroupType, document, platform, cdr) {
        super(_displayDensityOptions);
        this.element = element;
        this._inputGroupType = _inputGroupType;
        this.document = document;
        this.platform = platform;
        this.cdr = cdr;
        /**
         * Property that enables/disables the auto-generated class of the `IgxInputGroupComponent`.
         * By default applied the class is applied.
         * ```typescript
         *  @ViewChild("MyInputGroup")
         *  public inputGroup: IgxInputGroupComponent;
         *  ngAfterViewInit(){
         *  this.inputGroup.defaultClass = false;
         * ```
         * }
         */
        this.defaultClass = true;
        /** @hidden */
        this.hasPlaceholder = false;
        /** @hidden */
        this.isRequired = false;
        /** @hidden */
        this.isFocused = false;
        /**
         * @hidden @internal
         * When truthy, disables the `IgxInputGroupComponent`.
         * Controlled by the underlying `IgxInputDirective`.
         * ```html
         * <igx-input-group [disabled]="true"></igx-input-group>
         * ```
         */
        this.disabled = false;
        /**
         * Prevents automatically focusing the input when clicking on other elements in the input group (e.g. prefix or suffix).
         *
         * @remarks Automatic focus causes software keyboard to show on mobile devices.
         *
         * @example
         * ```html
         * <igx-input-group [suppressInputAutofocus]="true"></igx-input-group>
         * ```
         */
        this.suppressInputAutofocus = false;
        /** @hidden */
        this.hasWarning = false;
        this._type = null;
        this._filled = false;
        this._theme$ = new Subject();
        this._resourceStrings = CurrentResourceStrings.InputResStrings;
        this._subscription = this._theme$.asObservable().subscribe(value => {
            this._theme = value;
            this.cdr.detectChanges();
        });
    }
    /**
     * Sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    /**
     * Returns the resource strings.
     */
    get resourceStrings() {
        return this._resourceStrings;
    }
    /** @hidden */
    get validClass() {
        return this.input.valid === IgxInputState.VALID;
    }
    /** @hidden */
    get invalidClass() {
        return this.input.valid === IgxInputState.INVALID;
    }
    /** @hidden */
    get isFilled() {
        return this._filled || (this.input && this.input.value);
    }
    /** @hidden */
    get isDisplayDensityCosy() {
        return this.displayDensity === DisplayDensity.cosy;
    }
    /** @hidden */
    get isDisplayDensityComfortable() {
        return this.displayDensity === DisplayDensity.comfortable;
    }
    /** @hidden */
    get isDisplayDensityCompact() {
        return this.displayDensity === DisplayDensity.compact;
    }
    /**
     * An @Input property that sets how the input will be styled.
     * Allowed values of type IgxInputGroupType.
     * ```html
     * <igx-input-group [type]="'search'">
     * ```
     */
    set type(value) {
        this._type = value;
    }
    /**
     * Returns the type of the `IgxInputGroupComponent`. How the input is styled.
     * The default is `line`.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputType = this.inputGroup.type;
     * }
     * ```
     */
    get type() {
        return this._type || this._inputGroupType || 'line';
    }
    /**
     * Sets the theme of the input.
     * Allowed values of type IgxInputGroupTheme.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit() {
     *  let inputTheme = 'fluent';
     * }
     */
    set theme(value) {
        this._theme = value;
    }
    /**
     * Returns the theme of the input.
     * The returned value is of type IgxInputGroupType.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit() {
     *  let inputTheme = this.inputGroup.theme;
     * }
     */
    get theme() {
        return this._theme;
    }
    /** @hidden */
    onClick(event) {
        if (!this.isFocused &&
            event.target !== this.input.nativeElement &&
            !this.suppressInputAutofocus) {
            this.input.focus();
        }
    }
    /** @hidden */
    onPointerDown(event) {
        if (this.isFocused && event.target !== this.input.nativeElement) {
            event.preventDefault();
        }
    }
    /** @hidden @internal */
    hintClickHandler(event) {
        event.stopPropagation();
    }
    /**
     * Returns whether the `IgxInputGroupComponent` has hints.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputHints = this.inputGroup.hasHints;
     * }
     * ```
     */
    get hasHints() {
        return this.hints.length > 0;
    }
    /**
     * Returns whether the `IgxInputGroupComponent` has border.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputBorder = this.inputGroup.hasBorder;
     * }
     * ```
     */
    get hasBorder() {
        return ((this.type === 'line' || this.type === 'box') &&
            this._theme === 'material');
    }
    /**
     * Returns whether the `IgxInputGroupComponent` type is line.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeLine = this.inputGroup.isTypeLine;
     * }
     * ```
     */
    get isTypeLine() {
        return this.type === 'line' && this._theme === 'material';
    }
    /**
     * Returns whether the `IgxInputGroupComponent` type is box.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBox = this.inputGroup.isTypeBox;
     * }
     * ```
     */
    get isTypeBox() {
        return this.type === 'box' && this._theme === 'material';
    }
    /** @hidden @internal */
    uploadButtonHandler() {
        this.input.nativeElement.click();
    }
    /** @hidden @internal */
    clearValueHandler() {
        this.input.clear();
    }
    /** @hidden @internal */
    get isFileType() {
        return this.input.type === 'file';
    }
    /** @hidden @internal */
    get fileNames() {
        return this.input.fileNames || this._resourceStrings.igx_input_file_placeholder;
    }
    /**
     * Returns whether the `IgxInputGroupComponent` type is border.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBorder = this.inputGroup.isTypeBorder;
     * }
     * ```
     */
    get isTypeBorder() {
        return this.type === 'border' && this._theme === 'material';
    }
    /**
     * Returns true if the `IgxInputGroupComponent` theme is Fluent.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeFluent = this.inputGroup.isTypeFluent;
     * }
     * ```
     */
    get isTypeFluent() {
        return this._theme === 'fluent';
    }
    /**
     * Returns true if the `IgxInputGroupComponent` theme is Bootstrap.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBootstrap = this.inputGroup.isTypeBootstrap;
     * }
     * ```
     */
    get isTypeBootstrap() {
        return this._theme === 'bootstrap';
    }
    /**
     * Returns true if the `IgxInputGroupComponent` theme is Indigo.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeIndigo = this.inputGroup.isTypeIndigo;
     * }
     * ```
     */
    get isTypeIndigo() {
        return this._theme === 'indigo-design';
    }
    /**
     * Returns whether the `IgxInputGroupComponent` type is search.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeSearch = this.inputGroup.isTypeSearch;
     * }
     * ```
     */
    get isTypeSearch() {
        return this.type === 'search';
    }
    /** @hidden */
    get filled() {
        return this._filled;
    }
    /** @hidden */
    set filled(val) {
        this._filled = val;
    }
    /** @hidden @internal */
    ngAfterViewChecked() {
        if (!this._theme) {
            const cssProp = this.document.defaultView
                .getComputedStyle(this.element.nativeElement)
                .getPropertyValue('--theme')
                .trim();
            if (cssProp !== '') {
                Promise.resolve().then(() => {
                    this._theme$.next(cssProp);
                    this.cdr.markForCheck();
                });
            }
        }
    }
    /** @hidden @internal */
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
IgxInputGroupComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputGroupComponent, deps: [{ token: i0.ElementRef }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }, { token: DOCUMENT }, { token: i1.PlatformUtil }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
IgxInputGroupComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxInputGroupComponent, selector: "igx-input-group", inputs: { resourceStrings: "resourceStrings", suppressInputAutofocus: "suppressInputAutofocus", type: "type", theme: "theme" }, host: { listeners: { "click": "onClick($event)", "pointerdown": "onPointerDown($event)" }, properties: { "class.igx-input-group": "this.defaultClass", "class.igx-input-group--placeholder": "this.hasPlaceholder", "class.igx-input-group--required": "this.isRequired", "class.igx-input-group--focused": "this.isFocused", "class.igx-input-group--disabled": "this.disabled", "class.igx-input-group--warning": "this.hasWarning", "class.igx-input-group--valid": "this.validClass", "class.igx-input-group--invalid": "this.invalidClass", "class.igx-input-group--filled": "this.isFilled", "class.igx-input-group--cosy": "this.isDisplayDensityCosy", "class.igx-input-group--comfortable": "this.isDisplayDensityComfortable", "class.igx-input-group--compact": "this.isDisplayDensityCompact", "class.igx-input-group--box": "this.isTypeBox", "class.igx-input-group--file": "this.isFileType", "class.igx-input-group--border": "this.isTypeBorder", "class.igx-input-group--fluent": "this.isTypeFluent", "class.igx-input-group--bootstrap": "this.isTypeBootstrap", "class.igx-input-group--indigo": "this.isTypeIndigo", "class.igx-input-group--search": "this.isTypeSearch" } }, providers: [{ provide: IgxInputGroupBase, useExisting: IgxInputGroupComponent }], queries: [{ propertyName: "input", first: true, predicate: IgxInputDirective, descendants: true, read: IgxInputDirective, static: true }, { propertyName: "hints", predicate: IgxHintDirective, read: IgxHintDirective }], usesInheritance: true, ngImport: i0, template: "<div class=\"igx-input-group__wrapper\" *ngIf=\"isTypeBox; else bundle\">\n    <ng-container *ngTemplateOutlet=\"bundle\"></ng-container>\n</div>\n\n<div class=\"igx-input-group__border\" *ngIf=\"hasBorder\"></div>\n\n<div class=\"igx-input-group__hint\" (click)=\"hintClickHandler($event)\">\n    <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n</div>\n\n<ng-template #label>\n    <ng-content select=\"[igxLabel]\"></ng-content>\n</ng-template>\n\n<ng-template #input>\n    <ng-content select=\"[igxInput]\"></ng-content>\n</ng-template>\n\n<ng-template #prefix>\n    <ng-content select=\"igx-prefix, [igxPrefix]\"></ng-content>\n</ng-template>\n\n<ng-template #uploadButton>\n    <igx-prefix *ngIf=\"isFileType\" class=\"igx-prefix--upload\">\n        <button\n            igxButton=\"raised\"\n            (click)=\"uploadButtonHandler()\"\n            [displayDensity]=\"displayDensity\"\n            [disabled]=\"disabled\"\n            [ngClass]=\"{ 'igx-input-group__upload-button': isTypeLine }\"\n        >\n            {{ resourceStrings.igx_input_upload_button }}\n        </button>\n    </igx-prefix>\n</ng-template>\n\n<ng-template #files>\n    <div\n        *ngIf=\"isFileType\"\n        class=\"igx-input-group__file-input\"\n        [title]=\"fileNames\"\n    >\n        <span>{{ fileNames }}</span>\n    </div>\n</ng-template>\n\n<ng-template #clear>\n    <igx-suffix\n        class=\"igx-input-group__clear-icon\"\n        *ngIf=\"isFileType && isFilled\"\n        (click)=\"clearValueHandler()\"\n        (keydown.Enter)=\"clearValueHandler()\"\n        title=\"clear files\"\n        tabindex=\"0\"\n    >\n        <igx-icon>{{ resourceStrings.igx_input_clear_button }}</igx-icon>\n    </igx-suffix>\n</ng-template>\n\n<ng-template #suffix>\n    <ng-content select=\"igx-suffix, [igxSuffix]\"></ng-content>\n</ng-template>\n\n<ng-template #materialBundle>\n    <div class=\"igx-input-group__bundle\">\n        <ng-container *ngTemplateOutlet=\"prefix\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"uploadButton\"></ng-container>\n\n        <div class=\"igx-input-group__bundle-main\">\n            <ng-container *ngTemplateOutlet=\"label\"></ng-container>\n            <ng-container *ngTemplateOutlet=\"input\"></ng-container>\n            <ng-container *ngTemplateOutlet=\"files\"></ng-container>\n        </div>\n\n        <ng-container *ngTemplateOutlet=\"clear\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"suffix\"></ng-container>\n    </div>\n</ng-template>\n\n<ng-template #fluentBundle>\n    <ng-container *ngTemplateOutlet=\"label\"></ng-container>\n\n    <div class=\"igx-input-group__bundle\">\n        <ng-container *ngTemplateOutlet=\"prefix\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"uploadButton\"></ng-container>\n\n        <div class=\"igx-input-group__bundle-main\">\n            <ng-container *ngTemplateOutlet=\"input\"></ng-container>\n            <ng-container *ngTemplateOutlet=\"files\"></ng-container>\n        </div>\n\n        <ng-container *ngTemplateOutlet=\"clear\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"suffix\"></ng-container>\n    </div>\n</ng-template>\n\n<ng-template #bootstrapBundle>\n    <ng-container *ngTemplateOutlet=\"label\"></ng-container>\n\n    <div class=\"igx-input-group__bundle\">\n        <ng-container *ngTemplateOutlet=\"prefix\"></ng-container>\n\n        <ng-container *ngTemplateOutlet=\"uploadButton\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"input\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"files\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"clear\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"suffix\"></ng-container>\n    </div>\n</ng-template>\n\n<ng-template #bundle>\n    <ng-container [ngSwitch]=\"theme\">\n        <ng-container *ngSwitchCase=\"'bootstrap'\">\n            <ng-container *ngTemplateOutlet=\"bootstrapBundle\"></ng-container>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"'fluent'\">\n            <ng-container *ngTemplateOutlet=\"fluentBundle\"></ng-container>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"'indigo-design'\">\n            <ng-container *ngTemplateOutlet=\"fluentBundle\"></ng-container>\n        </ng-container>\n\n        <ng-container *ngSwitchDefault>\n            <ng-container *ngTemplateOutlet=\"materialBundle\"></ng-container>\n        </ng-container>\n    </ng-container>\n</ng-template>\n", components: [{ type: i2.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i4.IgxPrefixDirective, selector: "igx-prefix,[igxPrefix]" }, { type: i5.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i6.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { type: i3.NgSwitchDefault, selector: "[ngSwitchDefault]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputGroupComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-input-group', providers: [{ provide: IgxInputGroupBase, useExisting: IgxInputGroupComponent }], template: "<div class=\"igx-input-group__wrapper\" *ngIf=\"isTypeBox; else bundle\">\n    <ng-container *ngTemplateOutlet=\"bundle\"></ng-container>\n</div>\n\n<div class=\"igx-input-group__border\" *ngIf=\"hasBorder\"></div>\n\n<div class=\"igx-input-group__hint\" (click)=\"hintClickHandler($event)\">\n    <ng-content select=\"igx-hint, [igxHint]\"></ng-content>\n</div>\n\n<ng-template #label>\n    <ng-content select=\"[igxLabel]\"></ng-content>\n</ng-template>\n\n<ng-template #input>\n    <ng-content select=\"[igxInput]\"></ng-content>\n</ng-template>\n\n<ng-template #prefix>\n    <ng-content select=\"igx-prefix, [igxPrefix]\"></ng-content>\n</ng-template>\n\n<ng-template #uploadButton>\n    <igx-prefix *ngIf=\"isFileType\" class=\"igx-prefix--upload\">\n        <button\n            igxButton=\"raised\"\n            (click)=\"uploadButtonHandler()\"\n            [displayDensity]=\"displayDensity\"\n            [disabled]=\"disabled\"\n            [ngClass]=\"{ 'igx-input-group__upload-button': isTypeLine }\"\n        >\n            {{ resourceStrings.igx_input_upload_button }}\n        </button>\n    </igx-prefix>\n</ng-template>\n\n<ng-template #files>\n    <div\n        *ngIf=\"isFileType\"\n        class=\"igx-input-group__file-input\"\n        [title]=\"fileNames\"\n    >\n        <span>{{ fileNames }}</span>\n    </div>\n</ng-template>\n\n<ng-template #clear>\n    <igx-suffix\n        class=\"igx-input-group__clear-icon\"\n        *ngIf=\"isFileType && isFilled\"\n        (click)=\"clearValueHandler()\"\n        (keydown.Enter)=\"clearValueHandler()\"\n        title=\"clear files\"\n        tabindex=\"0\"\n    >\n        <igx-icon>{{ resourceStrings.igx_input_clear_button }}</igx-icon>\n    </igx-suffix>\n</ng-template>\n\n<ng-template #suffix>\n    <ng-content select=\"igx-suffix, [igxSuffix]\"></ng-content>\n</ng-template>\n\n<ng-template #materialBundle>\n    <div class=\"igx-input-group__bundle\">\n        <ng-container *ngTemplateOutlet=\"prefix\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"uploadButton\"></ng-container>\n\n        <div class=\"igx-input-group__bundle-main\">\n            <ng-container *ngTemplateOutlet=\"label\"></ng-container>\n            <ng-container *ngTemplateOutlet=\"input\"></ng-container>\n            <ng-container *ngTemplateOutlet=\"files\"></ng-container>\n        </div>\n\n        <ng-container *ngTemplateOutlet=\"clear\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"suffix\"></ng-container>\n    </div>\n</ng-template>\n\n<ng-template #fluentBundle>\n    <ng-container *ngTemplateOutlet=\"label\"></ng-container>\n\n    <div class=\"igx-input-group__bundle\">\n        <ng-container *ngTemplateOutlet=\"prefix\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"uploadButton\"></ng-container>\n\n        <div class=\"igx-input-group__bundle-main\">\n            <ng-container *ngTemplateOutlet=\"input\"></ng-container>\n            <ng-container *ngTemplateOutlet=\"files\"></ng-container>\n        </div>\n\n        <ng-container *ngTemplateOutlet=\"clear\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"suffix\"></ng-container>\n    </div>\n</ng-template>\n\n<ng-template #bootstrapBundle>\n    <ng-container *ngTemplateOutlet=\"label\"></ng-container>\n\n    <div class=\"igx-input-group__bundle\">\n        <ng-container *ngTemplateOutlet=\"prefix\"></ng-container>\n\n        <ng-container *ngTemplateOutlet=\"uploadButton\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"input\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"files\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"clear\"></ng-container>\n        <ng-container *ngTemplateOutlet=\"suffix\"></ng-container>\n    </div>\n</ng-template>\n\n<ng-template #bundle>\n    <ng-container [ngSwitch]=\"theme\">\n        <ng-container *ngSwitchCase=\"'bootstrap'\">\n            <ng-container *ngTemplateOutlet=\"bootstrapBundle\"></ng-container>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"'fluent'\">\n            <ng-container *ngTemplateOutlet=\"fluentBundle\"></ng-container>\n        </ng-container>\n\n        <ng-container *ngSwitchCase=\"'indigo-design'\">\n            <ng-container *ngTemplateOutlet=\"fluentBundle\"></ng-container>\n        </ng-container>\n\n        <ng-container *ngSwitchDefault>\n            <ng-container *ngTemplateOutlet=\"materialBundle\"></ng-container>\n        </ng-container>\n    </ng-container>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_INPUT_GROUP_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PlatformUtil }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { resourceStrings: [{
                type: Input
            }], defaultClass: [{
                type: HostBinding,
                args: ['class.igx-input-group']
            }], hasPlaceholder: [{
                type: HostBinding,
                args: ['class.igx-input-group--placeholder']
            }], isRequired: [{
                type: HostBinding,
                args: ['class.igx-input-group--required']
            }], isFocused: [{
                type: HostBinding,
                args: ['class.igx-input-group--focused']
            }], disabled: [{
                type: HostBinding,
                args: ['class.igx-input-group--disabled']
            }], suppressInputAutofocus: [{
                type: Input
            }], hasWarning: [{
                type: HostBinding,
                args: ['class.igx-input-group--warning']
            }], hints: [{
                type: ContentChildren,
                args: [IgxHintDirective, { read: IgxHintDirective }]
            }], input: [{
                type: ContentChild,
                args: [IgxInputDirective, { read: IgxInputDirective, static: true }]
            }], validClass: [{
                type: HostBinding,
                args: ['class.igx-input-group--valid']
            }], invalidClass: [{
                type: HostBinding,
                args: ['class.igx-input-group--invalid']
            }], isFilled: [{
                type: HostBinding,
                args: ['class.igx-input-group--filled']
            }], isDisplayDensityCosy: [{
                type: HostBinding,
                args: ['class.igx-input-group--cosy']
            }], isDisplayDensityComfortable: [{
                type: HostBinding,
                args: ['class.igx-input-group--comfortable']
            }], isDisplayDensityCompact: [{
                type: HostBinding,
                args: ['class.igx-input-group--compact']
            }], type: [{
                type: Input,
                args: ['type']
            }], theme: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onPointerDown: [{
                type: HostListener,
                args: ['pointerdown', ['$event']]
            }], isTypeBox: [{
                type: HostBinding,
                args: ['class.igx-input-group--box']
            }], isFileType: [{
                type: HostBinding,
                args: ['class.igx-input-group--file']
            }], isTypeBorder: [{
                type: HostBinding,
                args: ['class.igx-input-group--border']
            }], isTypeFluent: [{
                type: HostBinding,
                args: ['class.igx-input-group--fluent']
            }], isTypeBootstrap: [{
                type: HostBinding,
                args: ['class.igx-input-group--bootstrap']
            }], isTypeIndigo: [{
                type: HostBinding,
                args: ['class.igx-input-group--indigo']
            }], isTypeSearch: [{
                type: HostBinding,
                args: ['class.igx-input-group--search']
            }] } });
/** @hidden */
export class IgxInputGroupModule {
}
IgxInputGroupModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxInputGroupModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputGroupModule, declarations: [IgxInputGroupComponent, IgxHintDirective,
        IgxInputDirective,
        IgxLabelDirective], imports: [CommonModule, IgxPrefixModule, IgxSuffixModule, IgxButtonModule, IgxIconModule], exports: [IgxInputGroupComponent, IgxHintDirective,
        IgxInputDirective,
        IgxLabelDirective,
        IgxPrefixModule,
        IgxSuffixModule,
        IgxButtonModule,
        IgxIconModule] });
IgxInputGroupModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputGroupModule, imports: [[CommonModule, IgxPrefixModule, IgxSuffixModule, IgxButtonModule, IgxIconModule], IgxPrefixModule,
        IgxSuffixModule,
        IgxButtonModule,
        IgxIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxInputGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxInputGroupComponent,
                        IgxHintDirective,
                        IgxInputDirective,
                        IgxLabelDirective,
                    ],
                    exports: [
                        IgxInputGroupComponent,
                        IgxHintDirective,
                        IgxInputDirective,
                        IgxLabelDirective,
                        IgxPrefixModule,
                        IgxSuffixModule,
                        IgxButtonModule,
                        IgxIconModule
                    ],
                    imports: [CommonModule, IgxPrefixModule, IgxSuffixModule, IgxButtonModule, IgxIconModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2lucHV0LWdyb3VwL2lucHV0LWdyb3VwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9pbnB1dC1ncm91cC9pbnB1dC1ncm91cC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFDa0MsU0FBUyxFQUM5QyxZQUFZLEVBQ1osZUFBZSxFQUVmLFdBQVcsRUFDWCxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFDM0IsUUFBUSxFQUFhLFFBQVEsRUFDaEMsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUNILGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFDMUQsTUFBTSx3QkFBd0IsQ0FBQztBQUVoQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsTUFBTSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUNILGlCQUFpQixFQUNqQixhQUFhLEVBQ2hCLE1BQU0scUNBQXFDLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxl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QWxibkIsc0JBQXNCLEVBaWEzQixnQkFBZ0I7UUFDaEIsaUJBQWlCO1FBQ2pCLGlCQUFpQixhQVlYLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxhQUFhLGFBL2EvRSxzQkFBc0IsRUF1YTNCLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLGVBQWU7UUFDZixlQUFlO1FBQ2YsZUFBZTtRQUNmLGFBQWE7aUhBS1IsbUJBQW1CLFlBSG5CLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQyxFQUxyRixlQUFlO1FBQ2YsZUFBZTtRQUNmLGVBQWU7UUFDZixhQUFhOzJGQUtSLG1CQUFtQjtrQkFwQi9CLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLHNCQUFzQjt3QkFDdEIsZ0JBQWdCO3dCQUNoQixpQkFBaUI7d0JBQ2pCLGlCQUFpQjtxQkFDcEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLHNCQUFzQjt3QkFDdEIsZ0JBQWdCO3dCQUNoQixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsZUFBZTt3QkFDZixlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsYUFBYTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQztpQkFDNUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3Q2hlY2tlZCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLCBJbmplY3QsIElucHV0LFxuICAgIE5nTW9kdWxlLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBRdWVyeUxpc3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gICAgRGlzcGxheURlbnNpdHksIERpc3BsYXlEZW5zaXR5QmFzZSwgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9uc1xufSBmcm9tICcuLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IElJbnB1dFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9pbnB1dC1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgbWtlbnVtLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneEJ1dHRvbk1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvYnV0dG9uL2J1dHRvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4SGludERpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvaGludC9oaW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQge1xuICAgIElneElucHV0RGlyZWN0aXZlLFxuICAgIElneElucHV0U3RhdGVcbn0gZnJvbSAnLi4vZGlyZWN0aXZlcy9pbnB1dC9pbnB1dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4TGFiZWxEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2xhYmVsL2xhYmVsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hQcmVmaXhNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3ByZWZpeC9wcmVmaXguZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFN1ZmZpeE1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvc3VmZml4L3N1ZmZpeC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4SWNvbk1vZHVsZSB9IGZyb20gJy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwQmFzZSB9IGZyb20gJy4vaW5wdXQtZ3JvdXAuY29tbW9uJztcbmltcG9ydCB7IElneElucHV0R3JvdXBUeXBlLCBJR1hfSU5QVVRfR1JPVVBfVFlQRSB9IGZyb20gJy4vaW5wdXRHcm91cFR5cGUnO1xuXG5cbmNvbnN0IElneElucHV0R3JvdXBUaGVtZSA9IG1rZW51bSh7XG4gICAgTWF0ZXJpYWw6ICdtYXRlcmlhbCcsXG4gICAgRmx1ZW50OiAnZmx1ZW50JyxcbiAgICBCb290c3RyYXA6ICdib290c3RyYXAnLFxuICAgIEluZGlnb0Rlc2lnbjogJ2luZGlnby1kZXNpZ24nXG59KTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBJbnB1dCBHcm91cCB0aGVtZS5cbiAqL1xuZXhwb3J0IHR5cGUgSWd4SW5wdXRHcm91cFRoZW1lID0gKHR5cGVvZiBJZ3hJbnB1dEdyb3VwVGhlbWUpW2tleW9mIHR5cGVvZiBJZ3hJbnB1dEdyb3VwVGhlbWVdO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lneC1pbnB1dC1ncm91cCcsXG4gICAgdGVtcGxhdGVVcmw6ICdpbnB1dC1ncm91cC5jb21wb25lbnQuaHRtbCcsXG4gICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBJZ3hJbnB1dEdyb3VwQmFzZSwgdXNlRXhpc3Rpbmc6IElneElucHV0R3JvdXBDb21wb25lbnQgfV0sXG59KVxuZXhwb3J0IGNsYXNzIElneElucHV0R3JvdXBDb21wb25lbnQgZXh0ZW5kcyBEaXNwbGF5RGVuc2l0eUJhc2UgaW1wbGVtZW50cyBJZ3hJbnB1dEdyb3VwQmFzZSwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqIEJ5IGRlZmF1bHQgaXQgdXNlcyBFTiByZXNvdXJjZXMuXG4gICAgICovXG4gICBASW5wdXQoKVxuICAgcHVibGljIHNldCByZXNvdXJjZVN0cmluZ3ModmFsdWU6IElJbnB1dFJlc291cmNlU3RyaW5ncykge1xuICAgICAgIHRoaXMuX3Jlc291cmNlU3RyaW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Jlc291cmNlU3RyaW5ncywgdmFsdWUpO1xuICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlU3RyaW5ncygpOiBJSW5wdXRSZXNvdXJjZVN0cmluZ3Mge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VTdHJpbmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb3BlcnR5IHRoYXQgZW5hYmxlcy9kaXNhYmxlcyB0aGUgYXV0by1nZW5lcmF0ZWQgY2xhc3Mgb2YgdGhlIGBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50YC5cbiAgICAgKiBCeSBkZWZhdWx0IGFwcGxpZWQgdGhlIGNsYXNzIGlzIGFwcGxpZWQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICBAVmlld0NoaWxkKFwiTXlJbnB1dEdyb3VwXCIpXG4gICAgICogIHB1YmxpYyBpbnB1dEdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50O1xuICAgICAqICBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgdGhpcy5pbnB1dEdyb3VwLmRlZmF1bHRDbGFzcyA9IGZhbHNlO1xuICAgICAqIGBgYFxuICAgICAqIH1cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cCcpXG4gICAgcHVibGljIGRlZmF1bHRDbGFzcyA9IHRydWU7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1wbGFjZWhvbGRlcicpXG4gICAgcHVibGljIGhhc1BsYWNlaG9sZGVyID0gZmFsc2U7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1yZXF1aXJlZCcpXG4gICAgcHVibGljIGlzUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtaW5wdXQtZ3JvdXAtLWZvY3VzZWQnKVxuICAgIHB1YmxpYyBpc0ZvY3VzZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogV2hlbiB0cnV0aHksIGRpc2FibGVzIHRoZSBgSWd4SW5wdXRHcm91cENvbXBvbmVudGAuXG4gICAgICogQ29udHJvbGxlZCBieSB0aGUgdW5kZXJseWluZyBgSWd4SW5wdXREaXJlY3RpdmVgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWlucHV0LWdyb3VwIFtkaXNhYmxlZF09XCJ0cnVlXCI+PC9pZ3gtaW5wdXQtZ3JvdXA+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtaW5wdXQtZ3JvdXAtLWRpc2FibGVkJylcbiAgICBwdWJsaWMgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFByZXZlbnRzIGF1dG9tYXRpY2FsbHkgZm9jdXNpbmcgdGhlIGlucHV0IHdoZW4gY2xpY2tpbmcgb24gb3RoZXIgZWxlbWVudHMgaW4gdGhlIGlucHV0IGdyb3VwIChlLmcuIHByZWZpeCBvciBzdWZmaXgpLlxuICAgICAqXG4gICAgICogQHJlbWFya3MgQXV0b21hdGljIGZvY3VzIGNhdXNlcyBzb2Z0d2FyZSBrZXlib2FyZCB0byBzaG93IG9uIG1vYmlsZSBkZXZpY2VzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1pbnB1dC1ncm91cCBbc3VwcHJlc3NJbnB1dEF1dG9mb2N1c109XCJ0cnVlXCI+PC9pZ3gtaW5wdXQtZ3JvdXA+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc3VwcHJlc3NJbnB1dEF1dG9mb2N1cyA9IGZhbHNlO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cC0td2FybmluZycpXG4gICAgcHVibGljIGhhc1dhcm5pbmcgPSBmYWxzZTtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hIaW50RGlyZWN0aXZlLCB7IHJlYWQ6IElneEhpbnREaXJlY3RpdmUgfSlcbiAgICBwcm90ZWN0ZWQgaGludHM6IFF1ZXJ5TGlzdDxJZ3hIaW50RGlyZWN0aXZlPjtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hJbnB1dERpcmVjdGl2ZSwgeyByZWFkOiBJZ3hJbnB1dERpcmVjdGl2ZSwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGlucHV0OiBJZ3hJbnB1dERpcmVjdGl2ZTtcblxuICAgIHByaXZhdGUgX3R5cGU6IElneElucHV0R3JvdXBUeXBlID0gbnVsbDtcbiAgICBwcml2YXRlIF9maWxsZWQgPSBmYWxzZTtcbiAgICBwcml2YXRlIF90aGVtZTogSWd4SW5wdXRHcm91cFRoZW1lO1xuICAgIHByaXZhdGUgX3RoZW1lJCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSBfcmVzb3VyY2VTdHJpbmdzID0gQ3VycmVudFJlc291cmNlU3RyaW5ncy5JbnB1dFJlc1N0cmluZ3M7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS12YWxpZCcpXG4gICAgcHVibGljIGdldCB2YWxpZENsYXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dC52YWxpZCA9PT0gSWd4SW5wdXRTdGF0ZS5WQUxJRDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1pbnZhbGlkJylcbiAgICBwdWJsaWMgZ2V0IGludmFsaWRDbGFzcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXQudmFsaWQgPT09IElneElucHV0U3RhdGUuSU5WQUxJRDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1maWxsZWQnKVxuICAgIHB1YmxpYyBnZXQgaXNGaWxsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maWxsZWQgfHwgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC52YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cC0tY29zeScpXG4gICAgcHVibGljIGdldCBpc0Rpc3BsYXlEZW5zaXR5Q29zeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheURlbnNpdHkgPT09IERpc3BsYXlEZW5zaXR5LmNvc3k7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cC0tY29tZm9ydGFibGUnKVxuICAgIHB1YmxpYyBnZXQgaXNEaXNwbGF5RGVuc2l0eUNvbWZvcnRhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNwbGF5RGVuc2l0eSA9PT0gRGlzcGxheURlbnNpdHkuY29tZm9ydGFibGU7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cC0tY29tcGFjdCcpXG4gICAgcHVibGljIGdldCBpc0Rpc3BsYXlEZW5zaXR5Q29tcGFjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheURlbnNpdHkgPT09IERpc3BsYXlEZW5zaXR5LmNvbXBhY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyBob3cgdGhlIGlucHV0IHdpbGwgYmUgc3R5bGVkLlxuICAgICAqIEFsbG93ZWQgdmFsdWVzIG9mIHR5cGUgSWd4SW5wdXRHcm91cFR5cGUuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtaW5wdXQtZ3JvdXAgW3R5cGVdPVwiJ3NlYXJjaCdcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoJ3R5cGUnKVxuICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogSWd4SW5wdXRHcm91cFR5cGUpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHR5cGUgb2YgdGhlIGBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50YC4gSG93IHRoZSBpbnB1dCBpcyBzdHlsZWQuXG4gICAgICogVGhlIGRlZmF1bHQgaXMgYGxpbmVgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlJbnB1dEdyb3VwXCIpXG4gICAgICogcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgbGV0IGlucHV0VHlwZSA9IHRoaXMuaW5wdXRHcm91cC50eXBlO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlIHx8IHRoaXMuX2lucHV0R3JvdXBUeXBlIHx8ICdsaW5lJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB0aGVtZSBvZiB0aGUgaW5wdXQuXG4gICAgICogQWxsb3dlZCB2YWx1ZXMgb2YgdHlwZSBJZ3hJbnB1dEdyb3VwVGhlbWUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUlucHV0R3JvdXBcIilcbiAgICAgKiBwdWJsaWMgaW5wdXRHcm91cDogSWd4SW5wdXRHcm91cENvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICogIGxldCBpbnB1dFRoZW1lID0gJ2ZsdWVudCc7XG4gICAgICogfVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB0aGVtZSh2YWx1ZTogSWd4SW5wdXRHcm91cFRoZW1lKSB7XG4gICAgICAgIHRoaXMuX3RoZW1lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdGhlbWUgb2YgdGhlIGlucHV0LlxuICAgICAqIFRoZSByZXR1cm5lZCB2YWx1ZSBpcyBvZiB0eXBlIElneElucHV0R3JvdXBUeXBlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlJbnB1dEdyb3VwXCIpXG4gICAgICogcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAqICBsZXQgaW5wdXRUaGVtZSA9IHRoaXMuaW5wdXRHcm91cC50aGVtZTtcbiAgICAgKiB9XG4gICAgICovXG4gICAgcHVibGljIGdldCB0aGVtZSgpOiBJZ3hJbnB1dEdyb3VwVGhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGhlbWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgQE9wdGlvbmFsKClcbiAgICAgICAgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKVxuICAgICAgICBfZGlzcGxheURlbnNpdHlPcHRpb25zOiBJRGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICBAT3B0aW9uYWwoKVxuICAgICAgICBASW5qZWN0KElHWF9JTlBVVF9HUk9VUF9UWVBFKVxuICAgICAgICBwcml2YXRlIF9pbnB1dEdyb3VwVHlwZTogSWd4SW5wdXRHcm91cFR5cGUsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpXG4gICAgICAgIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgcHJpdmF0ZSBwbGF0Zm9ybTogUGxhdGZvcm1VdGlsLFxuICAgICAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgICApIHtcbiAgICAgICAgc3VwZXIoX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gdGhpcy5fdGhlbWUkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLl90aGVtZSA9IHZhbHVlIGFzIElneElucHV0R3JvdXBUaGVtZTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuaXNGb2N1c2VkICYmXG4gICAgICAgICAgICBldmVudC50YXJnZXQgIT09IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgIXRoaXMuc3VwcHJlc3NJbnB1dEF1dG9mb2N1c1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvblBvaW50ZXJEb3duKGV2ZW50OiBQb2ludGVyRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNGb2N1c2VkICYmIGV2ZW50LnRhcmdldCAhPT0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhpbnRDbGlja0hhbmRsZXIoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBgSWd4SW5wdXRHcm91cENvbXBvbmVudGAgaGFzIGhpbnRzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlJbnB1dEdyb3VwXCIpXG4gICAgICogcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgbGV0IGlucHV0SGludHMgPSB0aGlzLmlucHV0R3JvdXAuaGFzSGludHM7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzSGludHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpbnRzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBgSWd4SW5wdXRHcm91cENvbXBvbmVudGAgaGFzIGJvcmRlci5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15SW5wdXRHcm91cFwiKVxuICAgICAqIHB1YmxpYyBpbnB1dEdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgIGxldCBpbnB1dEJvcmRlciA9IHRoaXMuaW5wdXRHcm91cC5oYXNCb3JkZXI7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzQm9yZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKHRoaXMudHlwZSA9PT0gJ2xpbmUnIHx8IHRoaXMudHlwZSA9PT0gJ2JveCcpICYmXG4gICAgICAgICAgICB0aGlzLl90aGVtZSA9PT0gJ21hdGVyaWFsJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgYElneElucHV0R3JvdXBDb21wb25lbnRgIHR5cGUgaXMgbGluZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15SW5wdXRHcm91cDFcIilcbiAgICAgKiBwdWJsaWMgaW5wdXRHcm91cDogSWd4SW5wdXRHcm91cENvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICBsZXQgaXNUeXBlTGluZSA9IHRoaXMuaW5wdXRHcm91cC5pc1R5cGVMaW5lO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzVHlwZUxpbmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdsaW5lJyAmJiB0aGlzLl90aGVtZSA9PT0gJ21hdGVyaWFsJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50YCB0eXBlIGlzIGJveC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15SW5wdXRHcm91cDFcIilcbiAgICAgKiBwdWJsaWMgaW5wdXRHcm91cDogSWd4SW5wdXRHcm91cENvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICBsZXQgaXNUeXBlQm94ID0gdGhpcy5pbnB1dEdyb3VwLmlzVHlwZUJveDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtaW5wdXQtZ3JvdXAtLWJveCcpXG4gICAgcHVibGljIGdldCBpc1R5cGVCb3goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdib3gnICYmIHRoaXMuX3RoZW1lID09PSAnbWF0ZXJpYWwnO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB1cGxvYWRCdXR0b25IYW5kbGVyKCkge1xuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgY2xlYXJWYWx1ZUhhbmRsZXIoKSB7XG4gICAgICAgIHRoaXMuaW5wdXQuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cC0tZmlsZScpXG4gICAgcHVibGljIGdldCBpc0ZpbGVUeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dC50eXBlID09PSAnZmlsZSc7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBmaWxlTmFtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0LmZpbGVOYW1lcyB8fCB0aGlzLl9yZXNvdXJjZVN0cmluZ3MuaWd4X2lucHV0X2ZpbGVfcGxhY2Vob2xkZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBgSWd4SW5wdXRHcm91cENvbXBvbmVudGAgdHlwZSBpcyBib3JkZXIuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUlucHV0R3JvdXAxXCIpXG4gICAgICogcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgbGV0IGlzVHlwZUJvcmRlciA9IHRoaXMuaW5wdXRHcm91cC5pc1R5cGVCb3JkZXI7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1ib3JkZXInKVxuICAgIHB1YmxpYyBnZXQgaXNUeXBlQm9yZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnYm9yZGVyJyAmJiB0aGlzLl90aGVtZSA9PT0gJ21hdGVyaWFsJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50YCB0aGVtZSBpcyBGbHVlbnQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUlucHV0R3JvdXAxXCIpXG4gICAgICogcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgbGV0IGlzVHlwZUZsdWVudCA9IHRoaXMuaW5wdXRHcm91cC5pc1R5cGVGbHVlbnQ7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1mbHVlbnQnKVxuICAgIHB1YmxpYyBnZXQgaXNUeXBlRmx1ZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGhlbWUgPT09ICdmbHVlbnQnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYElneElucHV0R3JvdXBDb21wb25lbnRgIHRoZW1lIGlzIEJvb3RzdHJhcC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15SW5wdXRHcm91cDFcIilcbiAgICAgKiBwdWJsaWMgaW5wdXRHcm91cDogSWd4SW5wdXRHcm91cENvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICBsZXQgaXNUeXBlQm9vdHN0cmFwID0gdGhpcy5pbnB1dEdyb3VwLmlzVHlwZUJvb3RzdHJhcDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtaW5wdXQtZ3JvdXAtLWJvb3RzdHJhcCcpXG4gICAgcHVibGljIGdldCBpc1R5cGVCb290c3RyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aGVtZSA9PT0gJ2Jvb3RzdHJhcCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBgSWd4SW5wdXRHcm91cENvbXBvbmVudGAgdGhlbWUgaXMgSW5kaWdvLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKFwiTXlJbnB1dEdyb3VwMVwiKVxuICAgICAqIHB1YmxpYyBpbnB1dEdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgIGxldCBpc1R5cGVJbmRpZ28gPSB0aGlzLmlucHV0R3JvdXAuaXNUeXBlSW5kaWdvO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1pbnB1dC1ncm91cC0taW5kaWdvJylcbiAgICBwdWJsaWMgZ2V0IGlzVHlwZUluZGlnbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RoZW1lID09PSAnaW5kaWdvLWRlc2lnbic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBgSWd4SW5wdXRHcm91cENvbXBvbmVudGAgdHlwZSBpcyBzZWFyY2guXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUlucHV0R3JvdXAxXCIpXG4gICAgICogcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgbGV0IGlzVHlwZVNlYXJjaCA9IHRoaXMuaW5wdXRHcm91cC5pc1R5cGVTZWFyY2g7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwLS1zZWFyY2gnKVxuICAgIHB1YmxpYyBnZXQgaXNUeXBlU2VhcmNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnc2VhcmNoJztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgZmlsbGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsbGVkO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIHNldCBmaWxsZWQodmFsKSB7XG4gICAgICAgIHRoaXMuX2ZpbGxlZCA9IHZhbDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3RoZW1lKSB7XG4gICAgICAgICAgICBjb25zdCBjc3NQcm9wID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0Vmlld1xuICAgICAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KVxuICAgICAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKCctLXRoZW1lJylcbiAgICAgICAgICAgICAgICAudHJpbSgpO1xuXG4gICAgICAgICAgICBpZihjc3NQcm9wICE9PSAnJykge1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90aGVtZSQubmV4dChjc3NQcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbn1cblxuLyoqIEBoaWRkZW4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneElucHV0R3JvdXBDb21wb25lbnQsXG4gICAgICAgIElneEhpbnREaXJlY3RpdmUsXG4gICAgICAgIElneElucHV0RGlyZWN0aXZlLFxuICAgICAgICBJZ3hMYWJlbERpcmVjdGl2ZSxcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4SW5wdXRHcm91cENvbXBvbmVudCxcbiAgICAgICAgSWd4SGludERpcmVjdGl2ZSxcbiAgICAgICAgSWd4SW5wdXREaXJlY3RpdmUsXG4gICAgICAgIElneExhYmVsRGlyZWN0aXZlLFxuICAgICAgICBJZ3hQcmVmaXhNb2R1bGUsXG4gICAgICAgIElneFN1ZmZpeE1vZHVsZSxcbiAgICAgICAgSWd4QnV0dG9uTW9kdWxlLFxuICAgICAgICBJZ3hJY29uTW9kdWxlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBJZ3hQcmVmaXhNb2R1bGUsIElneFN1ZmZpeE1vZHVsZSwgSWd4QnV0dG9uTW9kdWxlLCBJZ3hJY29uTW9kdWxlXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBJZ3hJbnB1dEdyb3VwTW9kdWxlIHt9XG4iLCI8ZGl2IGNsYXNzPVwiaWd4LWlucHV0LWdyb3VwX193cmFwcGVyXCIgKm5nSWY9XCJpc1R5cGVCb3g7IGVsc2UgYnVuZGxlXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImJ1bmRsZVwiPjwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtaW5wdXQtZ3JvdXBfX2JvcmRlclwiICpuZ0lmPVwiaGFzQm9yZGVyXCI+PC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtaW5wdXQtZ3JvdXBfX2hpbnRcIiAoY2xpY2spPVwiaGludENsaWNrSGFuZGxlcigkZXZlbnQpXCI+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LWhpbnQsIFtpZ3hIaW50XVwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2xhYmVsPlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltpZ3hMYWJlbF1cIj48L25nLWNvbnRlbnQ+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2lucHV0PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltpZ3hJbnB1dF1cIj48L25nLWNvbnRlbnQ+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI3ByZWZpeD5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtcHJlZml4LCBbaWd4UHJlZml4XVwiPjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjdXBsb2FkQnV0dG9uPlxuICAgIDxpZ3gtcHJlZml4ICpuZ0lmPVwiaXNGaWxlVHlwZVwiIGNsYXNzPVwiaWd4LXByZWZpeC0tdXBsb2FkXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGlneEJ1dHRvbj1cInJhaXNlZFwiXG4gICAgICAgICAgICAoY2xpY2spPVwidXBsb2FkQnV0dG9uSGFuZGxlcigpXCJcbiAgICAgICAgICAgIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAnaWd4LWlucHV0LWdyb3VwX191cGxvYWQtYnV0dG9uJzogaXNUeXBlTGluZSB9XCJcbiAgICAgICAgPlxuICAgICAgICAgICAge3sgcmVzb3VyY2VTdHJpbmdzLmlneF9pbnB1dF91cGxvYWRfYnV0dG9uIH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgIDwvaWd4LXByZWZpeD5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZmlsZXM+XG4gICAgPGRpdlxuICAgICAgICAqbmdJZj1cImlzRmlsZVR5cGVcIlxuICAgICAgICBjbGFzcz1cImlneC1pbnB1dC1ncm91cF9fZmlsZS1pbnB1dFwiXG4gICAgICAgIFt0aXRsZV09XCJmaWxlTmFtZXNcIlxuICAgID5cbiAgICAgICAgPHNwYW4+e3sgZmlsZU5hbWVzIH19PC9zcGFuPlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNjbGVhcj5cbiAgICA8aWd4LXN1ZmZpeFxuICAgICAgICBjbGFzcz1cImlneC1pbnB1dC1ncm91cF9fY2xlYXItaWNvblwiXG4gICAgICAgICpuZ0lmPVwiaXNGaWxlVHlwZSAmJiBpc0ZpbGxlZFwiXG4gICAgICAgIChjbGljayk9XCJjbGVhclZhbHVlSGFuZGxlcigpXCJcbiAgICAgICAgKGtleWRvd24uRW50ZXIpPVwiY2xlYXJWYWx1ZUhhbmRsZXIoKVwiXG4gICAgICAgIHRpdGxlPVwiY2xlYXIgZmlsZXNcIlxuICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgID5cbiAgICAgICAgPGlneC1pY29uPnt7IHJlc291cmNlU3RyaW5ncy5pZ3hfaW5wdXRfY2xlYXJfYnV0dG9uIH19PC9pZ3gtaWNvbj5cbiAgICA8L2lneC1zdWZmaXg+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI3N1ZmZpeD5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtc3VmZml4LCBbaWd4U3VmZml4XVwiPjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjbWF0ZXJpYWxCdW5kbGU+XG4gICAgPGRpdiBjbGFzcz1cImlneC1pbnB1dC1ncm91cF9fYnVuZGxlXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwcmVmaXhcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInVwbG9hZEJ1dHRvblwiPjwvbmctY29udGFpbmVyPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtaW5wdXQtZ3JvdXBfX2J1bmRsZS1tYWluXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibGFiZWxcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpbnB1dFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZpbGVzXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjbGVhclwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic3VmZml4XCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2ZsdWVudEJ1bmRsZT5cbiAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibGFiZWxcIj48L25nLWNvbnRhaW5lcj5cblxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtaW5wdXQtZ3JvdXBfX2J1bmRsZVwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicHJlZml4XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ1cGxvYWRCdXR0b25cIj48L25nLWNvbnRhaW5lcj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWlucHV0LWdyb3VwX19idW5kbGUtbWFpblwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImlucHV0XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZmlsZXNcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNsZWFyXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzdWZmaXhcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjYm9vdHN0cmFwQnVuZGxlPlxuICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsYWJlbFwiPjwvbmctY29udGFpbmVyPlxuXG4gICAgPGRpdiBjbGFzcz1cImlneC1pbnB1dC1ncm91cF9fYnVuZGxlXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwcmVmaXhcIj48L25nLWNvbnRhaW5lcj5cblxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidXBsb2FkQnV0dG9uXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpbnB1dFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZmlsZXNcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNsZWFyXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzdWZmaXhcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjYnVuZGxlPlxuICAgIDxuZy1jb250YWluZXIgW25nU3dpdGNoXT1cInRoZW1lXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidib290c3RyYXAnXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYm9vdHN0cmFwQnVuZGxlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidmbHVlbnQnXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZmx1ZW50QnVuZGxlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidpbmRpZ28tZGVzaWduJ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZsdWVudEJ1bmRsZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaERlZmF1bHQ+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibWF0ZXJpYWxCdW5kbGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG48L25nLXRlbXBsYXRlPlxuIl19