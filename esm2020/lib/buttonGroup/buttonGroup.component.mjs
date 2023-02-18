import { CommonModule } from '@angular/common';
import { Component, ContentChildren, EventEmitter, HostBinding, Inject, Input, NgModule, Output, Optional, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { IgxButtonDirective, IgxButtonModule } from '../directives/button/button.directive';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxIconModule } from '../icon/public_api';
import { takeUntil } from 'rxjs/operators';
import { DisplayDensityBase, DisplayDensityToken } from '../core/density';
import { mkenum } from '../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "../icon/icon.component";
import * as i2 from "@angular/common";
import * as i3 from "../directives/button/button.directive";
import * as i4 from "../directives/ripple/ripple.directive";
/**
 * Determines the Button Group alignment
 */
export const ButtonGroupAlignment = mkenum({
    horizontal: 'horizontal',
    vertical: 'vertical'
});
let NEXT_ID = 0;
/**
 * **Ignite UI for Angular Button Group** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/buttongroup.html)
 *
 * The Ignite UI Button Group displays a group of buttons either vertically or horizontally.  The group supports
 * single, multiple and toggle selection.
 *
 * Example:
 * ```html
 * <igx-buttongroup multiSelection="true" [values]="fontOptions">
 * </igx-buttongroup>
 * ```
 * The `fontOptions` value shown above is defined as:
 * ```typescript
 * this.fontOptions = [
 *   { icon: 'format_bold', selected: false },
 *   { icon: 'format_italic', selected: false },
 *   { icon: 'format_underlined', selected: false }];
 * ```
 */
export class IgxButtonGroupComponent extends DisplayDensityBase {
    constructor(_cdr, _renderer, _displayDensityOptions) {
        super(_displayDensityOptions);
        this._cdr = _cdr;
        this._renderer = _renderer;
        this._displayDensityOptions = _displayDensityOptions;
        /**
         * An @Input property that sets the value of the `id` attribute. If not set it will be automatically generated.
         * ```html
         *  <igx-buttongroup [id]="'igx-dialog-56'" [multiSelection]="!multi" [values]="alignOptions">
         * ```
         */
        this.id = `igx-buttongroup-${NEXT_ID++}`;
        /**
         * @hidden
         */
        this.zIndex = 0;
        /**
         * An @Input property that enables selecting multiple buttons. By default, multi-selection is false.
         * ```html
         * <igx-buttongroup [multiSelection]="false" [alignment]="alignment"></igx-buttongroup>
         * ```
         */
        this.multiSelection = false;
        /**
         * An @Ouput property that emits an event when a button is selected.
         * ```typescript
         * @ViewChild("toast")
         * private toast: IgxToastComponent;
         * public selectedHandler(buttongroup) {
         *     this.toast.open()
         * }
         *  //...
         * ```
         * ```html
         * <igx-buttongroup #MyChild [multiSelection]="!multi" (selected)="selectedHandler($event)"></igx-buttongroup>
         * <igx-toast #toast>You have made a selection!</igx-toast>
         * ```
         */
        this.selected = new EventEmitter();
        /**
         * An @Ouput property that emits an event when a button is deselected.
         * ```typescript
         *  @ViewChild("toast")
         *  private toast: IgxToastComponent;
         *  public deselectedHandler(buttongroup){
         *     this.toast.open()
         * }
         *  //...
         * ```
         * ```html
         * <igx-buttongroup> #MyChild [multiSelection]="multi" (deselected)="deselectedHandler($event)"></igx-buttongroup>
         * <igx-toast #toast>You have deselected a button!</igx-toast>
         * ```
         */
        this.deselected = new EventEmitter();
        /**
         * @hidden
         */
        this.selectedIndexes = [];
        this.buttonClickNotifier$ = new Subject();
        this.buttonSelectedNotifier$ = new Subject();
        this.queryListNotifier$ = new Subject();
        this._disabled = false;
    }
    /**
     * A collection containing all buttons inside the button group.
     */
    get buttons() {
        return [...this.viewButtons.toArray(), ...this.templateButtons.toArray()];
    }
    /**
     * Allows you to set a style using the `itemContentCssClass` input.
     * The value should be the CSS class name that will be applied to the button group.
     * ```typescript
     * public style1 = "styleClass";
     *  //..
     * ```
     *  ```html
     * <igx-buttongroup [itemContentCssClass]="style1" [multiSelection]="!multi" [values]="alignOptions">
     * ```
     */
    set itemContentCssClass(value) {
        this._itemContentCssClass = value || this._itemContentCssClass;
    }
    /**
     * Returns the CSS class of the item content of the `IgxButtonGroup`.
     * ```typescript
     *  @ViewChild("MyChild")
     * public buttonG: IgxButtonGroupComponent;
     * ngAfterViewInit(){
     *    let buttonSelect = this.buttonG.itemContentCssClass;
     * }
     * ```
     */
    get itemContentCssClass() {
        return this._itemContentCssClass;
    }
    /**
     * An @Input property that allows you to disable the `igx-buttongroup` component. By default it's false.
     * ```html
     * <igx-buttongroup [disabled]="true" [multiSelection]="multi" [values]="fontOptions"></igx-buttongroup>
     * ```
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (this._disabled !== value) {
            this._disabled = value;
            if (this.viewButtons && this.templateButtons) {
                this.buttons.forEach((b) => (b.disabled = this._disabled));
            }
        }
    }
    /**
     * Allows you to set the button group alignment.
     * Available options are `ButtonGroupAlignment.horizontal` (default) and `ButtonGroupAlignment.vertical`.
     * ```typescript
     * public alignment = ButtonGroupAlignment.vertical;
     * //..
     * ```
     * ```html
     * <igx-buttongroup [multiSelection]="false" [values]="cities" [alignment]="alignment"></igx-buttongroup>
     * ```
     */
    set alignment(value) {
        this._isVertical = value === ButtonGroupAlignment.vertical;
    }
    /**
     * Returns the alignment of the `igx-buttongroup`.
     * ```typescript
     * @ViewChild("MyChild")
     * public buttonG: IgxButtonGroupComponent;
     * ngAfterViewInit(){
     *    let buttonAlignment = this.buttonG.alignment;
     * }
     * ```
     */
    get alignment() {
        return this._isVertical ? ButtonGroupAlignment.vertical : ButtonGroupAlignment.horizontal;
    }
    /**
     * Returns true if the `igx-buttongroup` alignment is vertical.
     * Note that in order for the accessor to work correctly the property should be set explicitly.
     * ```html
     * <igx-buttongroup #MyChild [alignment]="alignment" [values]="alignOptions">
     * ```
     * ```typescript
     * //...
     * @ViewChild("MyChild")
     * private buttonG: IgxButtonGroupComponent;
     * ngAfterViewInit(){
     *    let orientation = this.buttonG.isVertical;
     * }
     * ```
     */
    get isVertical() {
        return this._isVertical;
    }
    /**
     * Gets the selected button/buttons.
     * ```typescript
     * @ViewChild("MyChild")
     * private buttonG: IgxButtonGroupComponent;
     * ngAfterViewInit(){
     *    let selectedButton = this.buttonG.selectedButtons;
     * }
     * ```
     */
    get selectedButtons() {
        return this.buttons.filter((_, i) => this.selectedIndexes.indexOf(i) !== -1);
    }
    /**
     * Selects a button by its index.
     * ```typescript
     * @ViewChild("MyChild")
     * private buttonG: IgxButtonGroupComponent;
     * ngAfterViewInit(){
     *    this.buttonG.selectButton(2);
     *    this.cdr.detectChanges();
     * }
     * ```
     *
     * @memberOf {@link IgxButtonGroupComponent}
     */
    selectButton(index) {
        if (index >= this.buttons.length || index < 0) {
            return;
        }
        const button = this.buttons[index];
        button.select();
    }
    /**
     * @hidden
     * @internal
     */
    updateSelected(index) {
        const button = this.buttons[index];
        if (this.selectedIndexes.indexOf(index) === -1) {
            this.selectedIndexes.push(index);
            this.selected.emit({ button, index });
        }
        this._renderer.setAttribute(button.nativeElement, 'aria-pressed', 'true');
        this._renderer.addClass(button.nativeElement, 'igx-button-group__item--selected');
        const indexInViewButtons = this.viewButtons.toArray().indexOf(button);
        if (indexInViewButtons !== -1) {
            this.values[indexInViewButtons].selected = true;
        }
        // deselect other buttons if multiSelection is not enabled
        if (!this.multiSelection && this.selectedIndexes.length > 1) {
            this.buttons.forEach((_, i) => {
                if (i !== index && this.selectedIndexes.indexOf(i) !== -1) {
                    this.deselectButton(i);
                }
            });
        }
    }
    /**
     * Deselects a button by its index.
     * ```typescript
     * @ViewChild("MyChild")
     * private buttonG: IgxButtonGroupComponent;
     * ngAfterViewInit(){
     *    this.buttonG.deselectButton(2);
     *    this.cdr.detectChanges();
     * }
     * ```
     *
     * @memberOf {@link IgxButtonGroupComponent}
     */
    deselectButton(index) {
        if (index >= this.buttons.length || index < 0) {
            return;
        }
        const button = this.buttons[index];
        this.selectedIndexes.splice(this.selectedIndexes.indexOf(index), 1);
        this._renderer.setAttribute(button.nativeElement, 'aria-pressed', 'false');
        this._renderer.removeClass(button.nativeElement, 'igx-button-group__item--selected');
        button.deselect();
        const indexInViewButtons = this.viewButtons.toArray().indexOf(button);
        if (indexInViewButtons !== -1) {
            this.values[indexInViewButtons].selected = false;
        }
        this.deselected.emit({ button, index });
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this.templateButtons.forEach((button) => {
            if (!button.initialDensity) {
                button.displayDensity = this.displayDensity;
            }
        });
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        const initButtons = () => {
            // Cancel any existing buttonClick subscriptions
            this.buttonClickNotifier$.next();
            this.selectedIndexes.splice(0, this.selectedIndexes.length);
            // initial configuration
            this.buttons.forEach((button, index) => {
                const buttonElement = button.nativeElement;
                this._renderer.addClass(buttonElement, 'igx-button-group__item');
                if (this.disabled) {
                    button.disabled = true;
                }
                if (button.selected) {
                    this.updateSelected(index);
                }
                button.buttonClick.pipe(takeUntil(this.buttonClickNotifier$)).subscribe((_) => this._clickHandler(index));
                button.buttonSelected
                    .pipe(takeUntil(this.buttonSelectedNotifier$))
                    .subscribe((_) => this.updateSelected(index));
            });
        };
        this.viewButtons.changes.pipe(takeUntil(this.queryListNotifier$)).subscribe(() => initButtons());
        this.templateButtons.changes.pipe(takeUntil(this.queryListNotifier$)).subscribe(() => initButtons());
        initButtons();
        this._cdr.detectChanges();
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this.buttonClickNotifier$.next();
        this.buttonClickNotifier$.complete();
        this.buttonSelectedNotifier$.next();
        this.buttonSelectedNotifier$.complete();
        this.queryListNotifier$.next();
        this.queryListNotifier$.complete();
    }
    /**
     * @hidden
     */
    _clickHandler(i) {
        if (this.selectedIndexes.indexOf(i) === -1) {
            this.selectButton(i);
        }
        else {
            this.deselectButton(i);
        }
    }
}
IgxButtonGroupComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxButtonGroupComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: DisplayDensityToken, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxButtonGroupComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxButtonGroupComponent, selector: "igx-buttongroup", inputs: { id: "id", itemContentCssClass: "itemContentCssClass", multiSelection: "multiSelection", values: "values", disabled: "disabled", alignment: "alignment" }, outputs: { selected: "selected", deselected: "deselected" }, host: { properties: { "attr.id": "this.id", "style.zIndex": "this.zIndex" } }, queries: [{ propertyName: "templateButtons", predicate: IgxButtonDirective }], viewQueries: [{ propertyName: "viewButtons", predicate: IgxButtonDirective, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"igx-button-group\" role=\"group\" [class.igx-button-group--vertical]=\"isVertical\">\n    <button *ngFor=\"let button of values; let i = 'index'\"\n        type=\"button\"\n        igxButton=\"flat\"\n        [displayDensity]=\"displayDensity\"\n        [selected]=\"button.selected\"\n        [attr.data-togglable]=\"button.togglable\"\n        [disabled]=\"disabled || button.disabled\"\n        [igxButtonColor]=\"button.color\"\n        [igxButtonBackground]=\"button.bgcolor\"\n        [igxLabel]=\"button.label\"\n        [igxRipple]=\"button.ripple\"\n    >\n        <span class=\"igx-button-group__item-content {{ itemContentCssClass }}\">\n            <igx-icon *ngIf=\"button.icon\">{{button.icon}}</igx-icon>\n            <span class=\"igx-button-group__button-text\" *ngIf=\"button.label\">{{button.label}}</span>\n        </span>\n    </button>\n    <ng-content></ng-content>\n</div>\n", components: [{ type: i1.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i3.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i4.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxButtonGroupComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-buttongroup', template: "<div class=\"igx-button-group\" role=\"group\" [class.igx-button-group--vertical]=\"isVertical\">\n    <button *ngFor=\"let button of values; let i = 'index'\"\n        type=\"button\"\n        igxButton=\"flat\"\n        [displayDensity]=\"displayDensity\"\n        [selected]=\"button.selected\"\n        [attr.data-togglable]=\"button.togglable\"\n        [disabled]=\"disabled || button.disabled\"\n        [igxButtonColor]=\"button.color\"\n        [igxButtonBackground]=\"button.bgcolor\"\n        [igxLabel]=\"button.label\"\n        [igxRipple]=\"button.ripple\"\n    >\n        <span class=\"igx-button-group__item-content {{ itemContentCssClass }}\">\n            <igx-icon *ngIf=\"button.icon\">{{button.icon}}</igx-icon>\n            <span class=\"igx-button-group__button-text\" *ngIf=\"button.label\">{{button.label}}</span>\n        </span>\n    </button>\n    <ng-content></ng-content>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }]; }, propDecorators: { id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], zIndex: [{
                type: HostBinding,
                args: ['style.zIndex']
            }], itemContentCssClass: [{
                type: Input
            }], multiSelection: [{
                type: Input
            }], values: [{
                type: Input
            }], disabled: [{
                type: Input
            }], alignment: [{
                type: Input
            }], selected: [{
                type: Output
            }], deselected: [{
                type: Output
            }], viewButtons: [{
                type: ViewChildren,
                args: [IgxButtonDirective]
            }], templateButtons: [{
                type: ContentChildren,
                args: [IgxButtonDirective]
            }] } });
/**
 * @hidden
 */
export class IgxButtonGroupModule {
}
IgxButtonGroupModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxButtonGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxButtonGroupModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxButtonGroupModule, declarations: [IgxButtonGroupComponent], imports: [IgxButtonModule, CommonModule, IgxRippleModule, IgxIconModule], exports: [IgxButtonGroupComponent] });
IgxButtonGroupModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxButtonGroupModule, imports: [[IgxButtonModule, CommonModule, IgxRippleModule, IgxIconModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxButtonGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxButtonGroupComponent],
                    exports: [IgxButtonGroupComponent],
                    imports: [IgxButtonModule, CommonModule, IgxRippleModule, IgxIconModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uR3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2J1dHRvbkdyb3VwL2J1dHRvbkdyb3VwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9idXR0b25Hcm91cC9idXR0b25ncm91cC1jb250ZW50LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBR0gsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osV0FBVyxFQUNYLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBR1IsWUFBWSxFQUVmLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzVGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBMEIsTUFBTSxpQkFBaUIsQ0FBQztBQUVsRyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7QUFFdkM7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUM7SUFDdkMsVUFBVSxFQUFFLFlBQVk7SUFDeEIsUUFBUSxFQUFFLFVBQVU7Q0FDdkIsQ0FBQyxDQUFDO0FB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LGlCQXBacEIsdUJBQXVCLGFBa1p0QixlQUFlLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxhQUFhLGFBbFo5RCx1QkFBdUI7a0hBb1p2QixvQkFBb0IsWUFGcEIsQ0FBQyxlQUFlLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUM7MkZBRS9ELG9CQUFvQjtrQkFMaEMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGFBQWEsQ0FBQztpQkFDM0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE91dHB1dCxcbiAgICBPcHRpb25hbCxcbiAgICBRdWVyeUxpc3QsXG4gICAgUmVuZGVyZXIyLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBJZ3hCdXR0b25EaXJlY3RpdmUsIElneEJ1dHRvbk1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvYnV0dG9uL2J1dHRvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERpc3BsYXlEZW5zaXR5QmFzZSwgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5pbXBvcnQgeyBJQmFzZUV2ZW50QXJncyB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgbWtlbnVtIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgQnV0dG9uIEdyb3VwIGFsaWdubWVudFxuICovXG5leHBvcnQgY29uc3QgQnV0dG9uR3JvdXBBbGlnbm1lbnQgPSBta2VudW0oe1xuICAgIGhvcml6b250YWw6ICdob3Jpem9udGFsJyxcbiAgICB2ZXJ0aWNhbDogJ3ZlcnRpY2FsJ1xufSk7XG5leHBvcnQgdHlwZSBCdXR0b25Hcm91cEFsaWdubWVudCA9IHR5cGVvZiBCdXR0b25Hcm91cEFsaWdubWVudFtrZXlvZiB0eXBlb2YgQnV0dG9uR3JvdXBBbGlnbm1lbnRdO1xuXG5sZXQgTkVYVF9JRCA9IDA7XG5cbi8qKlxuICogKipJZ25pdGUgVUkgZm9yIEFuZ3VsYXIgQnV0dG9uIEdyb3VwKiogLVxuICogW0RvY3VtZW50YXRpb25dKGh0dHBzOi8vd3d3LmluZnJhZ2lzdGljcy5jb20vcHJvZHVjdHMvaWduaXRlLXVpLWFuZ3VsYXIvYW5ndWxhci9jb21wb25lbnRzL2J1dHRvbmdyb3VwLmh0bWwpXG4gKlxuICogVGhlIElnbml0ZSBVSSBCdXR0b24gR3JvdXAgZGlzcGxheXMgYSBncm91cCBvZiBidXR0b25zIGVpdGhlciB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseS4gIFRoZSBncm91cCBzdXBwb3J0c1xuICogc2luZ2xlLCBtdWx0aXBsZSBhbmQgdG9nZ2xlIHNlbGVjdGlvbi5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBgaHRtbFxuICogPGlneC1idXR0b25ncm91cCBtdWx0aVNlbGVjdGlvbj1cInRydWVcIiBbdmFsdWVzXT1cImZvbnRPcHRpb25zXCI+XG4gKiA8L2lneC1idXR0b25ncm91cD5cbiAqIGBgYFxuICogVGhlIGBmb250T3B0aW9uc2AgdmFsdWUgc2hvd24gYWJvdmUgaXMgZGVmaW5lZCBhczpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRoaXMuZm9udE9wdGlvbnMgPSBbXG4gKiAgIHsgaWNvbjogJ2Zvcm1hdF9ib2xkJywgc2VsZWN0ZWQ6IGZhbHNlIH0sXG4gKiAgIHsgaWNvbjogJ2Zvcm1hdF9pdGFsaWMnLCBzZWxlY3RlZDogZmFsc2UgfSxcbiAqICAgeyBpY29uOiAnZm9ybWF0X3VuZGVybGluZWQnLCBzZWxlY3RlZDogZmFsc2UgfV07XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtYnV0dG9uZ3JvdXAnLFxuICAgIHRlbXBsYXRlVXJsOiAnYnV0dG9uZ3JvdXAtY29udGVudC5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4QnV0dG9uR3JvdXBDb21wb25lbnQgZXh0ZW5kcyBEaXNwbGF5RGVuc2l0eUJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIC8qKlxuICAgICAqIEEgY29sbGVjdGlvbiBjb250YWluaW5nIGFsbCBidXR0b25zIGluc2lkZSB0aGUgYnV0dG9uIGdyb3VwLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgYnV0dG9ucygpOiBJZ3hCdXR0b25EaXJlY3RpdmVbXSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy52aWV3QnV0dG9ucy50b0FycmF5KCksIC4uLnRoaXMudGVtcGxhdGVCdXR0b25zLnRvQXJyYXkoKV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBpZGAgYXR0cmlidXRlLiBJZiBub3Qgc2V0IGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWJ1dHRvbmdyb3VwIFtpZF09XCInaWd4LWRpYWxvZy01NidcIiBbbXVsdGlTZWxlY3Rpb25dPVwiIW11bHRpXCIgW3ZhbHVlc109XCJhbGlnbk9wdGlvbnNcIj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlkID0gYGlneC1idXR0b25ncm91cC0ke05FWFRfSUQrK31gO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuekluZGV4JylcbiAgICBwdWJsaWMgekluZGV4ID0gMDtcblxuICAgIC8qKlxuICAgICAqIEFsbG93cyB5b3UgdG8gc2V0IGEgc3R5bGUgdXNpbmcgdGhlIGBpdGVtQ29udGVudENzc0NsYXNzYCBpbnB1dC5cbiAgICAgKiBUaGUgdmFsdWUgc2hvdWxkIGJlIHRoZSBDU1MgY2xhc3MgbmFtZSB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgYnV0dG9uIGdyb3VwLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3R5bGUxID0gXCJzdHlsZUNsYXNzXCI7XG4gICAgICogIC8vLi5cbiAgICAgKiBgYGBcbiAgICAgKiAgYGBgaHRtbFxuICAgICAqIDxpZ3gtYnV0dG9uZ3JvdXAgW2l0ZW1Db250ZW50Q3NzQ2xhc3NdPVwic3R5bGUxXCIgW211bHRpU2VsZWN0aW9uXT1cIiFtdWx0aVwiIFt2YWx1ZXNdPVwiYWxpZ25PcHRpb25zXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGl0ZW1Db250ZW50Q3NzQ2xhc3ModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pdGVtQ29udGVudENzc0NsYXNzID0gdmFsdWUgfHwgdGhpcy5faXRlbUNvbnRlbnRDc3NDbGFzcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBDU1MgY2xhc3Mgb2YgdGhlIGl0ZW0gY29udGVudCBvZiB0aGUgYElneEJ1dHRvbkdyb3VwYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIEBWaWV3Q2hpbGQoXCJNeUNoaWxkXCIpXG4gICAgICogcHVibGljIGJ1dHRvbkc6IElneEJ1dHRvbkdyb3VwQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgIGxldCBidXR0b25TZWxlY3QgPSB0aGlzLmJ1dHRvbkcuaXRlbUNvbnRlbnRDc3NDbGFzcztcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBpdGVtQ29udGVudENzc0NsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtQ29udGVudENzc0NsYXNzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IGVuYWJsZXMgc2VsZWN0aW5nIG11bHRpcGxlIGJ1dHRvbnMuIEJ5IGRlZmF1bHQsIG11bHRpLXNlbGVjdGlvbiBpcyBmYWxzZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1idXR0b25ncm91cCBbbXVsdGlTZWxlY3Rpb25dPVwiZmFsc2VcIiBbYWxpZ25tZW50XT1cImFsaWdubWVudFwiPjwvaWd4LWJ1dHRvbmdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBtdWx0aVNlbGVjdGlvbiA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgYWxsb3dzIHNldHRpbmcgdGhlIGJ1dHRvbnMgaW4gdGhlIGJ1dHRvbiBncm91cC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgKiAgICAgIHRoaXMuY2l0aWVzID0gW1xuICAgICAqICAgICAgICBuZXcgQnV0dG9uKHtcbiAgICAgKiAgICAgICAgICBsYWJlbDogXCJTb2ZpYVwiXG4gICAgICogICAgICB9KSxcbiAgICAgKiAgICAgICAgbmV3IEJ1dHRvbih7XG4gICAgICogICAgICAgICAgbGFiZWw6IFwiTG9uZG9uXCJcbiAgICAgKiAgICAgIH0pLFxuICAgICAqICAgICAgICBuZXcgQnV0dG9uKHtcbiAgICAgKiAgICAgICAgICBsYWJlbDogXCJOZXcgWW9ya1wiLFxuICAgICAqICAgICAgICAgIHNlbGVjdGVkOiB0cnVlXG4gICAgICogICAgICB9KSxcbiAgICAgKiAgICAgICAgbmV3IEJ1dHRvbih7XG4gICAgICogICAgICAgICAgbGFiZWw6IFwiVG9reW9cIlxuICAgICAqICAgICAgfSlcbiAgICAgKiAgXTtcbiAgICAgKiAgfVxuICAgICAqICAvLy4uXG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWJ1dHRvbmdyb3VwIFttdWx0aVNlbGVjdGlvbl09XCJmYWxzZVwiIFt2YWx1ZXNdPVwiY2l0aWVzXCI+PC9pZ3gtYnV0dG9uZ3JvdXA+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHZhbHVlczogYW55O1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgYWxsb3dzIHlvdSB0byBkaXNhYmxlIHRoZSBgaWd4LWJ1dHRvbmdyb3VwYCBjb21wb25lbnQuIEJ5IGRlZmF1bHQgaXQncyBmYWxzZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1idXR0b25ncm91cCBbZGlzYWJsZWRdPVwidHJ1ZVwiIFttdWx0aVNlbGVjdGlvbl09XCJtdWx0aVwiIFt2YWx1ZXNdPVwiZm9udE9wdGlvbnNcIj48L2lneC1idXR0b25ncm91cD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG4gICAgcHVibGljIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52aWV3QnV0dG9ucyAmJiB0aGlzLnRlbXBsYXRlQnV0dG9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKChiKSA9PiAoYi5kaXNhYmxlZCA9IHRoaXMuX2Rpc2FibGVkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbGxvd3MgeW91IHRvIHNldCB0aGUgYnV0dG9uIGdyb3VwIGFsaWdubWVudC5cbiAgICAgKiBBdmFpbGFibGUgb3B0aW9ucyBhcmUgYEJ1dHRvbkdyb3VwQWxpZ25tZW50Lmhvcml6b250YWxgIChkZWZhdWx0KSBhbmQgYEJ1dHRvbkdyb3VwQWxpZ25tZW50LnZlcnRpY2FsYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGFsaWdubWVudCA9IEJ1dHRvbkdyb3VwQWxpZ25tZW50LnZlcnRpY2FsO1xuICAgICAqIC8vLi5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1idXR0b25ncm91cCBbbXVsdGlTZWxlY3Rpb25dPVwiZmFsc2VcIiBbdmFsdWVzXT1cImNpdGllc1wiIFthbGlnbm1lbnRdPVwiYWxpZ25tZW50XCI+PC9pZ3gtYnV0dG9uZ3JvdXA+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGFsaWdubWVudCh2YWx1ZTogQnV0dG9uR3JvdXBBbGlnbm1lbnQpIHtcbiAgICAgICAgdGhpcy5faXNWZXJ0aWNhbCA9IHZhbHVlID09PSBCdXR0b25Hcm91cEFsaWdubWVudC52ZXJ0aWNhbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYWxpZ25tZW50IG9mIHRoZSBgaWd4LWJ1dHRvbmdyb3VwYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15Q2hpbGRcIilcbiAgICAgKiBwdWJsaWMgYnV0dG9uRzogSWd4QnV0dG9uR3JvdXBDb21wb25lbnQ7XG4gICAgICogbmdBZnRlclZpZXdJbml0KCl7XG4gICAgICogICAgbGV0IGJ1dHRvbkFsaWdubWVudCA9IHRoaXMuYnV0dG9uRy5hbGlnbm1lbnQ7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgYWxpZ25tZW50KCk6IEJ1dHRvbkdyb3VwQWxpZ25tZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVmVydGljYWwgPyBCdXR0b25Hcm91cEFsaWdubWVudC52ZXJ0aWNhbCA6IEJ1dHRvbkdyb3VwQWxpZ25tZW50Lmhvcml6b250YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQE91cHV0IHByb3BlcnR5IHRoYXQgZW1pdHMgYW4gZXZlbnQgd2hlbiBhIGJ1dHRvbiBpcyBzZWxlY3RlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcInRvYXN0XCIpXG4gICAgICogcHJpdmF0ZSB0b2FzdDogSWd4VG9hc3RDb21wb25lbnQ7XG4gICAgICogcHVibGljIHNlbGVjdGVkSGFuZGxlcihidXR0b25ncm91cCkge1xuICAgICAqICAgICB0aGlzLnRvYXN0Lm9wZW4oKVxuICAgICAqIH1cbiAgICAgKiAgLy8uLi5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1idXR0b25ncm91cCAjTXlDaGlsZCBbbXVsdGlTZWxlY3Rpb25dPVwiIW11bHRpXCIgKHNlbGVjdGVkKT1cInNlbGVjdGVkSGFuZGxlcigkZXZlbnQpXCI+PC9pZ3gtYnV0dG9uZ3JvdXA+XG4gICAgICogPGlneC10b2FzdCAjdG9hc3Q+WW91IGhhdmUgbWFkZSBhIHNlbGVjdGlvbiE8L2lneC10b2FzdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElCdXR0b25Hcm91cEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEFuIEBPdXB1dCBwcm9wZXJ0eSB0aGF0IGVtaXRzIGFuIGV2ZW50IHdoZW4gYSBidXR0b24gaXMgZGVzZWxlY3RlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIEBWaWV3Q2hpbGQoXCJ0b2FzdFwiKVxuICAgICAqICBwcml2YXRlIHRvYXN0OiBJZ3hUb2FzdENvbXBvbmVudDtcbiAgICAgKiAgcHVibGljIGRlc2VsZWN0ZWRIYW5kbGVyKGJ1dHRvbmdyb3VwKXtcbiAgICAgKiAgICAgdGhpcy50b2FzdC5vcGVuKClcbiAgICAgKiB9XG4gICAgICogIC8vLi4uXG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYnV0dG9uZ3JvdXA+ICNNeUNoaWxkIFttdWx0aVNlbGVjdGlvbl09XCJtdWx0aVwiIChkZXNlbGVjdGVkKT1cImRlc2VsZWN0ZWRIYW5kbGVyKCRldmVudClcIj48L2lneC1idXR0b25ncm91cD5cbiAgICAgKiA8aWd4LXRvYXN0ICN0b2FzdD5Zb3UgaGF2ZSBkZXNlbGVjdGVkIGEgYnV0dG9uITwvaWd4LXRvYXN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBkZXNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJQnV0dG9uR3JvdXBFdmVudEFyZ3M+KCk7XG5cbiAgICBAVmlld0NoaWxkcmVuKElneEJ1dHRvbkRpcmVjdGl2ZSkgcHJpdmF0ZSB2aWV3QnV0dG9uczogUXVlcnlMaXN0PElneEJ1dHRvbkRpcmVjdGl2ZT47XG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hCdXR0b25EaXJlY3RpdmUpIHByaXZhdGUgdGVtcGxhdGVCdXR0b25zOiBRdWVyeUxpc3Q8SWd4QnV0dG9uRGlyZWN0aXZlPjtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYGlneC1idXR0b25ncm91cGAgYWxpZ25tZW50IGlzIHZlcnRpY2FsLlxuICAgICAqIE5vdGUgdGhhdCBpbiBvcmRlciBmb3IgdGhlIGFjY2Vzc29yIHRvIHdvcmsgY29ycmVjdGx5IHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgc2V0IGV4cGxpY2l0bHkuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYnV0dG9uZ3JvdXAgI015Q2hpbGQgW2FsaWdubWVudF09XCJhbGlnbm1lbnRcIiBbdmFsdWVzXT1cImFsaWduT3B0aW9uc1wiPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLy4uLlxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUNoaWxkXCIpXG4gICAgICogcHJpdmF0ZSBidXR0b25HOiBJZ3hCdXR0b25Hcm91cENvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICBsZXQgb3JpZW50YXRpb24gPSB0aGlzLmJ1dHRvbkcuaXNWZXJ0aWNhbDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNWZXJ0aWNhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdGVkSW5kZXhlczogbnVtYmVyW10gPSBbXTtcblxuICAgIHByb3RlY3RlZCBidXR0b25DbGlja05vdGlmaWVyJCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gICAgcHJvdGVjdGVkIGJ1dHRvblNlbGVjdGVkTm90aWZpZXIkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgICBwcm90ZWN0ZWQgcXVlcnlMaXN0Tm90aWZpZXIkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIHByaXZhdGUgX2lzVmVydGljYWw6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfaXRlbUNvbnRlbnRDc3NDbGFzczogc3RyaW5nO1xuICAgIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBfY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9uczogSURpc3BsYXlEZW5zaXR5T3B0aW9uc1xuICAgICkge1xuICAgICAgICBzdXBlcihfZGlzcGxheURlbnNpdHlPcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzZWxlY3RlZCBidXR0b24vYnV0dG9ucy5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15Q2hpbGRcIilcbiAgICAgKiBwcml2YXRlIGJ1dHRvbkc6IElneEJ1dHRvbkdyb3VwQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgIGxldCBzZWxlY3RlZEJ1dHRvbiA9IHRoaXMuYnV0dG9uRy5zZWxlY3RlZEJ1dHRvbnM7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRCdXR0b25zKCk6IElneEJ1dHRvbkRpcmVjdGl2ZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnV0dG9ucy5maWx0ZXIoKF8sIGkpID0+IHRoaXMuc2VsZWN0ZWRJbmRleGVzLmluZGV4T2YoaSkgIT09IC0xKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIGEgYnV0dG9uIGJ5IGl0cyBpbmRleC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChcIk15Q2hpbGRcIilcbiAgICAgKiBwcml2YXRlIGJ1dHRvbkc6IElneEJ1dHRvbkdyb3VwQ29tcG9uZW50O1xuICAgICAqIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgICAqICAgIHRoaXMuYnV0dG9uRy5zZWxlY3RCdXR0b24oMik7XG4gICAgICogICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiB7QGxpbmsgSWd4QnV0dG9uR3JvdXBDb21wb25lbnR9XG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdEJ1dHRvbihpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmJ1dHRvbnMubGVuZ3RoIHx8IGluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYnV0dG9uID0gdGhpcy5idXR0b25zW2luZGV4XTtcbiAgICAgICAgYnV0dG9uLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlU2VsZWN0ZWQoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBjb25zdCBidXR0b24gPSB0aGlzLmJ1dHRvbnNbaW5kZXhdO1xuXG4gICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRJbmRleGVzLmluZGV4T2YoaW5kZXgpID09PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmVtaXQoeyBidXR0b24sIGluZGV4IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0QXR0cmlidXRlKGJ1dHRvbi5uYXRpdmVFbGVtZW50LCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MoYnV0dG9uLm5hdGl2ZUVsZW1lbnQsICdpZ3gtYnV0dG9uLWdyb3VwX19pdGVtLS1zZWxlY3RlZCcpO1xuXG4gICAgICAgIGNvbnN0IGluZGV4SW5WaWV3QnV0dG9ucyA9IHRoaXMudmlld0J1dHRvbnMudG9BcnJheSgpLmluZGV4T2YoYnV0dG9uKTtcbiAgICAgICAgaWYgKGluZGV4SW5WaWV3QnV0dG9ucyAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzW2luZGV4SW5WaWV3QnV0dG9uc10uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVzZWxlY3Qgb3RoZXIgYnV0dG9ucyBpZiBtdWx0aVNlbGVjdGlvbiBpcyBub3QgZW5hYmxlZFxuICAgICAgICBpZiAoIXRoaXMubXVsdGlTZWxlY3Rpb24gJiYgdGhpcy5zZWxlY3RlZEluZGV4ZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXggJiYgdGhpcy5zZWxlY3RlZEluZGV4ZXMuaW5kZXhPZihpKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlbGVjdEJ1dHRvbihpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0cyBhIGJ1dHRvbiBieSBpdHMgaW5kZXguXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoXCJNeUNoaWxkXCIpXG4gICAgICogcHJpdmF0ZSBidXR0b25HOiBJZ3hCdXR0b25Hcm91cENvbXBvbmVudDtcbiAgICAgKiBuZ0FmdGVyVmlld0luaXQoKXtcbiAgICAgKiAgICB0aGlzLmJ1dHRvbkcuZGVzZWxlY3RCdXR0b24oMik7XG4gICAgICogICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiB7QGxpbmsgSWd4QnV0dG9uR3JvdXBDb21wb25lbnR9XG4gICAgICovXG4gICAgcHVibGljIGRlc2VsZWN0QnV0dG9uKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuYnV0dG9ucy5sZW5ndGggfHwgaW5kZXggPCAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBidXR0b24gPSB0aGlzLmJ1dHRvbnNbaW5kZXhdO1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXhlcy5zcGxpY2UodGhpcy5zZWxlY3RlZEluZGV4ZXMuaW5kZXhPZihpbmRleCksIDEpO1xuXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldEF0dHJpYnV0ZShidXR0b24ubmF0aXZlRWxlbWVudCwgJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyhidXR0b24ubmF0aXZlRWxlbWVudCwgJ2lneC1idXR0b24tZ3JvdXBfX2l0ZW0tLXNlbGVjdGVkJyk7XG4gICAgICAgIGJ1dHRvbi5kZXNlbGVjdCgpO1xuXG4gICAgICAgIGNvbnN0IGluZGV4SW5WaWV3QnV0dG9ucyA9IHRoaXMudmlld0J1dHRvbnMudG9BcnJheSgpLmluZGV4T2YoYnV0dG9uKTtcbiAgICAgICAgaWYgKGluZGV4SW5WaWV3QnV0dG9ucyAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzW2luZGV4SW5WaWV3QnV0dG9uc10uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVzZWxlY3RlZC5lbWl0KHsgYnV0dG9uLCBpbmRleCB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWJ1dHRvbi5pbml0aWFsRGVuc2l0eSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5kaXNwbGF5RGVuc2l0eSA9IHRoaXMuZGlzcGxheURlbnNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBjb25zdCBpbml0QnV0dG9ucyA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIENhbmNlbCBhbnkgZXhpc3RpbmcgYnV0dG9uQ2xpY2sgc3Vic2NyaXB0aW9uc1xuICAgICAgICAgICAgdGhpcy5idXR0b25DbGlja05vdGlmaWVyJC5uZXh0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleGVzLnNwbGljZSgwLCB0aGlzLnNlbGVjdGVkSW5kZXhlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IGJ1dHRvbi5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKGJ1dHRvbkVsZW1lbnQsICdpZ3gtYnV0dG9uLWdyb3VwX19pdGVtJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChidXR0b24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZChpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnV0dG9uLmJ1dHRvbkNsaWNrLnBpcGUodGFrZVVudGlsKHRoaXMuYnV0dG9uQ2xpY2tOb3RpZmllciQpKS5zdWJzY3JpYmUoKF8pID0+IHRoaXMuX2NsaWNrSGFuZGxlcihpbmRleCkpO1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5idXR0b25TZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5idXR0b25TZWxlY3RlZE5vdGlmaWVyJCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKF8pID0+IHRoaXMudXBkYXRlU2VsZWN0ZWQoaW5kZXgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudmlld0J1dHRvbnMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLnF1ZXJ5TGlzdE5vdGlmaWVyJCkpLnN1YnNjcmliZSgoKSA9PiBpbml0QnV0dG9ucygpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUJ1dHRvbnMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLnF1ZXJ5TGlzdE5vdGlmaWVyJCkpLnN1YnNjcmliZSgoKSA9PiBpbml0QnV0dG9ucygpKTtcbiAgICAgICAgaW5pdEJ1dHRvbnMoKTtcblxuICAgICAgICB0aGlzLl9jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uQ2xpY2tOb3RpZmllciQubmV4dCgpO1xuICAgICAgICB0aGlzLmJ1dHRvbkNsaWNrTm90aWZpZXIkLmNvbXBsZXRlKCk7XG5cbiAgICAgICAgdGhpcy5idXR0b25TZWxlY3RlZE5vdGlmaWVyJC5uZXh0KCk7XG4gICAgICAgIHRoaXMuYnV0dG9uU2VsZWN0ZWROb3RpZmllciQuY29tcGxldGUoKTtcblxuICAgICAgICB0aGlzLnF1ZXJ5TGlzdE5vdGlmaWVyJC5uZXh0KCk7XG4gICAgICAgIHRoaXMucXVlcnlMaXN0Tm90aWZpZXIkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBfY2xpY2tIYW5kbGVyKGk6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ZXMuaW5kZXhPZihpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uKGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdEJ1dHRvbihpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQnV0dG9uR3JvdXBFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncyB7XG4gICAgYnV0dG9uOiBJZ3hCdXR0b25EaXJlY3RpdmU7XG4gICAgaW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4QnV0dG9uR3JvdXBDb21wb25lbnRdLFxuICAgIGV4cG9ydHM6IFtJZ3hCdXR0b25Hcm91cENvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW0lneEJ1dHRvbk1vZHVsZSwgQ29tbW9uTW9kdWxlLCBJZ3hSaXBwbGVNb2R1bGUsIElneEljb25Nb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIElneEJ1dHRvbkdyb3VwTW9kdWxlIHt9XG4iLCI8ZGl2IGNsYXNzPVwiaWd4LWJ1dHRvbi1ncm91cFwiIHJvbGU9XCJncm91cFwiIFtjbGFzcy5pZ3gtYnV0dG9uLWdyb3VwLS12ZXJ0aWNhbF09XCJpc1ZlcnRpY2FsXCI+XG4gICAgPGJ1dHRvbiAqbmdGb3I9XCJsZXQgYnV0dG9uIG9mIHZhbHVlczsgbGV0IGkgPSAnaW5kZXgnXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGlneEJ1dHRvbj1cImZsYXRcIlxuICAgICAgICBbZGlzcGxheURlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIlxuICAgICAgICBbc2VsZWN0ZWRdPVwiYnV0dG9uLnNlbGVjdGVkXCJcbiAgICAgICAgW2F0dHIuZGF0YS10b2dnbGFibGVdPVwiYnV0dG9uLnRvZ2dsYWJsZVwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZCB8fCBidXR0b24uZGlzYWJsZWRcIlxuICAgICAgICBbaWd4QnV0dG9uQ29sb3JdPVwiYnV0dG9uLmNvbG9yXCJcbiAgICAgICAgW2lneEJ1dHRvbkJhY2tncm91bmRdPVwiYnV0dG9uLmJnY29sb3JcIlxuICAgICAgICBbaWd4TGFiZWxdPVwiYnV0dG9uLmxhYmVsXCJcbiAgICAgICAgW2lneFJpcHBsZV09XCJidXR0b24ucmlwcGxlXCJcbiAgICA+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaWd4LWJ1dHRvbi1ncm91cF9faXRlbS1jb250ZW50IHt7IGl0ZW1Db250ZW50Q3NzQ2xhc3MgfX1cIj5cbiAgICAgICAgICAgIDxpZ3gtaWNvbiAqbmdJZj1cImJ1dHRvbi5pY29uXCI+e3tidXR0b24uaWNvbn19PC9pZ3gtaWNvbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWd4LWJ1dHRvbi1ncm91cF9fYnV0dG9uLXRleHRcIiAqbmdJZj1cImJ1dHRvbi5sYWJlbFwiPnt7YnV0dG9uLmxhYmVsfX08L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbiJdfQ==