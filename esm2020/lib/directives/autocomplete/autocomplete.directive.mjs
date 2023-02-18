import { Directive, EventEmitter, HostBinding, HostListener, Inject, Input, NgModule, Optional, Output, Self } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsoluteScrollStrategy, AutoPositionStrategy } from '../../services/public_api';
import { IgxDropDownItemNavigationDirective, IgxDropDownModule } from '../../drop-down/public_api';
import * as i0 from "@angular/core";
import * as i1 from "../../input-group/public_api";
import * as i2 from "@angular/forms";
/**
 * **Ignite UI for Angular Autocomplete** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/autocomplete.html)
 *
 * The igxAutocomplete directive provides a way to enhance a text input
 * by showing a drop down of suggested options, provided by the developer.
 *
 * Example:
 * ```html
 * <input type="text" [igxAutocomplete]="townsPanel" #autocompleteRef="igxAutocomplete"/>
 * <igx-drop-down #townsPanel>
 *     <igx-drop-down-item *ngFor="let town of towns | startsWith:townSelected" [value]="town">
 *         {{town}}
 *     </igx-drop-down-item>
 * </igx-drop-down>
 * ```
 */
export class IgxAutocompleteDirective extends IgxDropDownItemNavigationDirective {
    constructor(ngModel, formControl, group, elementRef, cdr) {
        super(null);
        this.ngModel = ngModel;
        this.formControl = formControl;
        this.group = group;
        this.elementRef = elementRef;
        this.cdr = cdr;
        /** @hidden @internal */
        this.autofill = 'off';
        /** @hidden  @internal */
        this.role = 'combobox';
        /**
         * Enables/disables autocomplete component
         *
         * ```typescript
         * // get
         * let disabled = this.autocomplete.disabled;
         * ```
         * ```html
         * <!--set-->
         * <input type="text" [igxAutocomplete]="townsPanel" [igxAutocompleteDisabled]="disabled"/>
         * ```
         * ```typescript
         * // set
         * public disabled = true;
         * ```
         */
        this.disabled = false;
        /**
         * Emitted after item from the drop down is selected
         *
         * ```html
         * <input igxInput [igxAutocomplete]="townsPanel" (selectionChanging)='selectionChanging($event)' />
         * ```
         */
        this.selectionChanging = new EventEmitter();
        this._shouldBeOpen = false;
        this.destroy$ = new Subject();
    }
    /**
     * Sets the target of the autocomplete directive
     *
     * ```html
     * <!-- Set -->
     * <input [igxAutocomplete]="dropdown" />
     * ...
     * <igx-drop-down #dropdown>
     * ...
     * </igx-drop-down>
     * ```
     */
    get target() {
        return this._target;
    }
    set target(v) {
        this._target = v;
    }
    /** @hidden @internal */
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    /** @hidden @internal */
    get parentElement() {
        return this.group ? this.group.element.nativeElement : this.nativeElement;
    }
    get settings() {
        const settings = Object.assign({}, this.defaultSettings, this.autocompleteSettings);
        const target = settings.target || settings.positionStrategy.settings.target;
        if (!target) {
            const positionStrategyClone = settings.positionStrategy.clone();
            settings.target = this.parentElement;
            settings.positionStrategy = positionStrategyClone;
        }
        return settings;
    }
    /** @hidden  @internal */
    get ariaExpanded() {
        return !this.collapsed;
    }
    /** @hidden  @internal */
    get hasPopUp() {
        return 'listbox';
    }
    /** @hidden  @internal */
    get ariaOwns() {
        return this.target.listId;
    }
    /** @hidden  @internal */
    get ariaActiveDescendant() {
        return !this.target.collapsed && this.target.focusedItem ? this.target.focusedItem.id : null;
    }
    /** @hidden  @internal */
    get ariaAutocomplete() {
        return 'list';
    }
    get model() {
        return this.ngModel || this.formControl;
    }
    /** @hidden  @internal */
    onInput() {
        this.open();
    }
    /** @hidden  @internal */
    onArrowDown(event) {
        event.preventDefault();
        this.open();
    }
    /** @hidden  @internal */
    onTab() {
        this.close();
    }
    /** @hidden  @internal */
    handleKeyDown(event) {
        if (!this.collapsed) {
            switch (event.key.toLowerCase()) {
                case 'space':
                case 'spacebar':
                case ' ':
                case 'home':
                case 'end':
                    return;
                default:
                    super.handleKeyDown(event);
            }
        }
    }
    /** @hidden  @internal */
    onArrowDownKeyDown() {
        super.onArrowDownKeyDown();
    }
    /** @hidden  @internal */
    onArrowUpKeyDown() {
        super.onArrowUpKeyDown();
    }
    /** @hidden  @internal */
    onEndKeyDown() {
        super.onEndKeyDown();
    }
    /** @hidden  @internal */
    onHomeKeyDown() {
        super.onHomeKeyDown();
    }
    /**
     * Closes autocomplete drop down
     */
    close() {
        this._shouldBeOpen = false;
        if (this.collapsed) {
            return;
        }
        this.target.close();
    }
    /**
     * Opens autocomplete drop down
     */
    open() {
        this._shouldBeOpen = true;
        if (this.disabled || !this.collapsed || this.target.children.length === 0) {
            return;
        }
        // if no drop-down width is set, the drop-down will be as wide as the autocomplete input;
        this.target.width = this.target.width || (this.parentElement.clientWidth + 'px');
        this.target.open(this.settings);
        this.highlightFirstItem();
    }
    /** @hidden @internal */
    ngOnInit() {
        const targetElement = this.parentElement;
        this.defaultSettings = {
            target: targetElement,
            modal: false,
            scrollStrategy: new AbsoluteScrollStrategy(),
            positionStrategy: new AutoPositionStrategy(),
            excludeFromOutsideClick: [targetElement]
        };
    }
    /** @hidden */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngAfterViewInit() {
        this.target.children.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.target.children.length) {
                if (!this.collapsed) {
                    this.highlightFirstItem();
                }
                else if (this._shouldBeOpen) {
                    this.open();
                }
            }
            else {
                // _shouldBeOpen flag should remain unchanged since this state change doesn't come from outside of the component
                // (like in the case of public API or user interaction).
                this.target.close();
            }
        });
        this.target.selectionChanging.pipe(takeUntil(this.destroy$)).subscribe(this.select.bind(this));
    }
    get collapsed() {
        return this.target ? this.target.collapsed : true;
    }
    select(value) {
        if (!value.newSelection) {
            return;
        }
        value.cancel = true; // Disable selection in the drop down, because in autocomplete we do not save selection.
        const newValue = value.newSelection.value;
        const args = { value: newValue, cancel: false };
        this.selectionChanging.emit(args);
        if (args.cancel) {
            return;
        }
        this.close();
        // Update model after the input is re-focused, in order to have proper valid styling.
        // Otherwise when item is selected using mouse (and input is blurred), then valid style will be removed.
        if (this.model) {
            this.model.control.setValue(newValue);
        }
        else {
            this.nativeElement.value = newValue;
        }
    }
    ;
    highlightFirstItem() {
        if (this.target.focusedItem) {
            this.target.focusedItem.focused = false;
            this.target.focusedItem = null;
        }
        this.target.navigateFirst();
        this.cdr.detectChanges();
    }
    ;
}
IgxAutocompleteDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAutocompleteDirective, deps: [{ token: NgModel, optional: true, self: true }, { token: FormControlName, optional: true, self: true }, { token: i1.IgxInputGroupComponent, optional: true }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxAutocompleteDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxAutocompleteDirective, selector: "[igxAutocomplete]", inputs: { target: ["igxAutocomplete", "target"], autocompleteSettings: ["igxAutocompleteSettings", "autocompleteSettings"], disabled: ["igxAutocompleteDisabled", "disabled"] }, outputs: { selectionChanging: "selectionChanging" }, host: { listeners: { "input": "onInput()", "keydown.ArrowDown": "onArrowDown($event)", "keydown.Alt.ArrowDown": "onArrowDown($event)", "keydown.ArrowUp": "onArrowDown($event)", "keydown.Alt.ArrowUp": "onArrowDown($event)", "keydown.Tab": "onTab()", "keydown.Shift.Tab": "onTab()" }, properties: { "attr.autocomplete": "this.autofill", "attr.role": "this.role", "attr.aria-expanded": "this.ariaExpanded", "attr.aria-haspopup": "this.hasPopUp", "attr.aria-owns": "this.ariaOwns", "attr.aria-activedescendant": "this.ariaActiveDescendant", "attr.aria-autocomplete": "this.ariaAutocomplete" } }, exportAs: ["igxAutocomplete"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAutocompleteDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxAutocomplete]',
                    exportAs: 'igxAutocomplete'
                }]
        }], ctorParameters: function () { return [{ type: i2.NgModel, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }, {
                    type: Inject,
                    args: [NgModel]
                }] }, { type: i2.FormControlName, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }, {
                    type: Inject,
                    args: [FormControlName]
                }] }, { type: i1.IgxInputGroupComponent, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { target: [{
                type: Input,
                args: ['igxAutocomplete']
            }], autocompleteSettings: [{
                type: Input,
                args: ['igxAutocompleteSettings']
            }], autofill: [{
                type: HostBinding,
                args: ['attr.autocomplete']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], disabled: [{
                type: Input,
                args: ['igxAutocompleteDisabled']
            }], selectionChanging: [{
                type: Output
            }], ariaExpanded: [{
                type: HostBinding,
                args: ['attr.aria-expanded']
            }], hasPopUp: [{
                type: HostBinding,
                args: ['attr.aria-haspopup']
            }], ariaOwns: [{
                type: HostBinding,
                args: ['attr.aria-owns']
            }], ariaActiveDescendant: [{
                type: HostBinding,
                args: ['attr.aria-activedescendant']
            }], ariaAutocomplete: [{
                type: HostBinding,
                args: ['attr.aria-autocomplete']
            }], onInput: [{
                type: HostListener,
                args: ['input']
            }], onArrowDown: [{
                type: HostListener,
                args: ['keydown.ArrowDown', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.Alt.ArrowDown', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.ArrowUp', ['$event']]
            }, {
                type: HostListener,
                args: ['keydown.Alt.ArrowUp', ['$event']]
            }], onTab: [{
                type: HostListener,
                args: ['keydown.Tab']
            }, {
                type: HostListener,
                args: ['keydown.Shift.Tab']
            }] } });
/** @hidden */
export class IgxAutocompleteModule {
}
IgxAutocompleteModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAutocompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxAutocompleteModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAutocompleteModule, declarations: [IgxAutocompleteDirective], imports: [IgxDropDownModule, CommonModule], exports: [IgxAutocompleteDirective] });
IgxAutocompleteModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAutocompleteModule, imports: [[IgxDropDownModule, CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAutocompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [IgxDropDownModule, CommonModule],
                    declarations: [IgxAutocompleteDirective],
                    exports: [IgxAutocompleteDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kaXJlY3RpdmVzL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCxTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBRVIsUUFBUSxFQUNSLE1BQU0sRUFDTixJQUFJLEVBR1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUNILHNCQUFzQixFQUN0QixvQkFBb0IsRUFJdkIsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBRUgsa0NBQWtDLEVBQ2xDLGlCQUFpQixFQUVwQixNQUFNLDRCQUE0QixDQUFDOzs7O0FBeUJwQzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUtILE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxrQ0FBa0M7SUE4STVFLFlBQTJELE9BQWdCLEVBQ2hCLFdBQTRCLEVBQzdELEtBQTZCLEVBQ3pDLFVBQXNCLEVBQ3RCLEdBQXNCO1FBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUwyQyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUM3RCxVQUFLLEdBQUwsS0FBSyxDQUF3QjtRQUN6QyxlQUFVLEdBQVYsVUFBVSxDQUFZ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LG9CQUFvQjtnQkFPdEIsUUFBUTtzQkFEbEIsV0FBVzt1QkFBQyxnQkFBZ0I7Z0JBT2xCLG9CQUFvQjtzQkFEOUIsV0FBVzt1QkFBQyw0QkFBNEI7Z0JBTzlCLGdCQUFnQjtzQkFEMUIsV0FBVzt1QkFBQyx3QkFBd0I7Z0JBd0I5QixPQUFPO3NCQURiLFlBQVk7dUJBQUMsT0FBTztnQkFVZCxXQUFXO3NCQUpqQixZQUFZO3VCQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxDQUFDOztzQkFDNUMsWUFBWTt1QkFBQyx1QkFBdUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7c0JBQ2hELFlBQVk7dUJBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUM7O3NCQUMxQyxZQUFZO3VCQUFDLHFCQUFxQixFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVN4QyxLQUFLO3NCQUZYLFlBQVk7dUJBQUMsYUFBYTs7c0JBQzFCLFlBQVk7dUJBQUMsbUJBQW1COztBQXlJckMsY0FBYztBQU1kLE1BQU0sT0FBTyxxQkFBcUI7O2tIQUFyQixxQkFBcUI7bUhBQXJCLHFCQUFxQixpQkF2VHJCLHdCQUF3QixhQW1UdkIsaUJBQWlCLEVBQUUsWUFBWSxhQW5UaEMsd0JBQXdCO21IQXVUeEIscUJBQXFCLFlBSnJCLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDOzJGQUlqQyxxQkFBcUI7a0JBTGpDLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDO29CQUMxQyxZQUFZLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztvQkFDeEMsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7aUJBQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT3B0aW9uYWwsXG4gICAgT3V0cHV0LFxuICAgIFNlbGYsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBPbkluaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ01vZGVsLCBGb3JtQ29udHJvbE5hbWUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2FuY2VsYWJsZUV2ZW50QXJncywgSUJhc2VFdmVudEFyZ3MgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7XG4gICAgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSxcbiAgICBBdXRvUG9zaXRpb25TdHJhdGVneSxcbiAgICBJUG9zaXRpb25TdHJhdGVneSxcbiAgICBJU2Nyb2xsU3RyYXRlZ3ksXG4gICAgT3ZlcmxheVNldHRpbmdzXG59IGZyb20gJy4uLy4uL3NlcnZpY2VzL3B1YmxpY19hcGknO1xuaW1wb3J0IHtcbiAgICBJZ3hEcm9wRG93bkNvbXBvbmVudCxcbiAgICBJZ3hEcm9wRG93bkl0ZW1OYXZpZ2F0aW9uRGlyZWN0aXZlLFxuICAgIElneERyb3BEb3duTW9kdWxlLFxuICAgIElTZWxlY3Rpb25FdmVudEFyZ3Ncbn0gZnJvbSAnLi4vLi4vZHJvcC1kb3duL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4SW5wdXRHcm91cENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2lucHV0LWdyb3VwL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZSB9IGZyb20gJy4uL3RvZ2dsZS90b2dnbGUuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBlbmNhcHN1bGF0ZXMgb25JdGVtU2VsZWN0aW9uIGV2ZW50IGFyZ3VtZW50cyAtIG5ldyB2YWx1ZSBhbmQgY2FuY2VsIHNlbGVjdGlvbi5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b2NvbXBsZXRlU2VsZWN0aW9uQ2hhbmdpbmdFdmVudEFyZ3MgZXh0ZW5kcyBDYW5jZWxhYmxlRXZlbnRBcmdzLCBJQmFzZUV2ZW50QXJncyB7XG4gICAgLyoqXG4gICAgICogTmV3IHZhbHVlIHNlbGVjdGVkIGZyb20gdGhlIGRyb3AgZG93blxuICAgICAqL1xuICAgIHZhbHVlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b2NvbXBsZXRlT3ZlcmxheVNldHRpbmdzIHtcbiAgICAvKiogUG9zaXRpb24gc3RyYXRlZ3kgdG8gdXNlIHdpdGggdGhpcyBzZXR0aW5ncyAqL1xuICAgIHBvc2l0aW9uU3RyYXRlZ3k/OiBJUG9zaXRpb25TdHJhdGVneTtcbiAgICAvKiogU2Nyb2xsIHN0cmF0ZWd5IHRvIHVzZSB3aXRoIHRoaXMgc2V0dGluZ3MgKi9cbiAgICBzY3JvbGxTdHJhdGVneT86IElTY3JvbGxTdHJhdGVneTtcbiAgICAvKiogU2V0IHRoZSBvdXRsZXQgY29udGFpbmVyIHRvIGF0dGFjaCB0aGUgb3ZlcmxheSB0byAqL1xuICAgIG91dGxldD86IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmUgfCBFbGVtZW50UmVmO1xufVxuXG4vKipcbiAqICoqSWduaXRlIFVJIGZvciBBbmd1bGFyIEF1dG9jb21wbGV0ZSoqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9hdXRvY29tcGxldGUuaHRtbClcbiAqXG4gKiBUaGUgaWd4QXV0b2NvbXBsZXRlIGRpcmVjdGl2ZSBwcm92aWRlcyBhIHdheSB0byBlbmhhbmNlIGEgdGV4dCBpbnB1dFxuICogYnkgc2hvd2luZyBhIGRyb3AgZG93biBvZiBzdWdnZXN0ZWQgb3B0aW9ucywgcHJvdmlkZWQgYnkgdGhlIGRldmVsb3Blci5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBgaHRtbFxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgW2lneEF1dG9jb21wbGV0ZV09XCJ0b3duc1BhbmVsXCIgI2F1dG9jb21wbGV0ZVJlZj1cImlneEF1dG9jb21wbGV0ZVwiLz5cbiAqIDxpZ3gtZHJvcC1kb3duICN0b3duc1BhbmVsPlxuICogICAgIDxpZ3gtZHJvcC1kb3duLWl0ZW0gKm5nRm9yPVwibGV0IHRvd24gb2YgdG93bnMgfCBzdGFydHNXaXRoOnRvd25TZWxlY3RlZFwiIFt2YWx1ZV09XCJ0b3duXCI+XG4gKiAgICAgICAgIHt7dG93bn19XG4gKiAgICAgPC9pZ3gtZHJvcC1kb3duLWl0ZW0+XG4gKiA8L2lneC1kcm9wLWRvd24+XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbaWd4QXV0b2NvbXBsZXRlXScsXG4gICAgZXhwb3J0QXM6ICdpZ3hBdXRvY29tcGxldGUnXG59KVxuZXhwb3J0IGNsYXNzIElneEF1dG9jb21wbGV0ZURpcmVjdGl2ZSBleHRlbmRzIElneERyb3BEb3duSXRlbU5hdmlnYXRpb25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdGFyZ2V0IG9mIHRoZSBhdXRvY29tcGxldGUgZGlyZWN0aXZlXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLSBTZXQgLS0+XG4gICAgICogPGlucHV0IFtpZ3hBdXRvY29tcGxldGVdPVwiZHJvcGRvd25cIiAvPlxuICAgICAqIC4uLlxuICAgICAqIDxpZ3gtZHJvcC1kb3duICNkcm9wZG93bj5cbiAgICAgKiAuLi5cbiAgICAgKiA8L2lneC1kcm9wLWRvd24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdpZ3hBdXRvY29tcGxldGUnKVxuICAgIHB1YmxpYyBnZXQgdGFyZ2V0KCk6IElneERyb3BEb3duQ29tcG9uZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldCBhcyBJZ3hEcm9wRG93bkNvbXBvbmVudDtcbiAgICB9XG4gICAgcHVibGljIHNldCB0YXJnZXQodjogSWd4RHJvcERvd25Db21wb25lbnQpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlIG92ZXJsYXkgc2V0dGluZ3MgZm9yIHRoZSBhdXRvY29tcGxldGUgZHJvcCBkb3duXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0XG4gICAgICogbGV0IHNldHRpbmdzID0gdGhpcy5hdXRvY29tcGxldGUuYXV0b2NvbXBsZXRlU2V0dGluZ3M7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBbaWd4QXV0b2NvbXBsZXRlXT1cInRvd25zUGFuZWxcIiBbaWd4QXV0b2NvbXBsZXRlU2V0dGluZ3NdPVwic2V0dGluZ3NcIi8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIHNldFxuICAgICAqIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICogIHBvc2l0aW9uU3RyYXRlZ3k6IG5ldyBDb25uZWN0ZWRQb3NpdGlvbmluZ1N0cmF0ZWd5KHtcbiAgICAgKiAgICAgIGNsb3NlQW5pbWF0aW9uOiBudWxsLFxuICAgICAqICAgICAgb3BlbkFuaW1hdGlvbjogbnVsbFxuICAgICAqICB9KVxuICAgICAqIH07XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdpZ3hBdXRvY29tcGxldGVTZXR0aW5ncycpXG4gICAgcHVibGljIGF1dG9jb21wbGV0ZVNldHRpbmdzOiBBdXRvY29tcGxldGVPdmVybGF5U2V0dGluZ3M7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXV0b2NvbXBsZXRlJylcbiAgICBwdWJsaWMgYXV0b2ZpbGwgPSAnb2ZmJztcblxuICAgIC8qKiBAaGlkZGVuICBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIHJvbGUgPSAnY29tYm9ib3gnO1xuXG4gICAgLyoqXG4gICAgICogRW5hYmxlcy9kaXNhYmxlcyBhdXRvY29tcGxldGUgY29tcG9uZW50XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0XG4gICAgICogbGV0IGRpc2FibGVkID0gdGhpcy5hdXRvY29tcGxldGUuZGlzYWJsZWQ7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDwhLS1zZXQtLT5cbiAgICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIiBbaWd4QXV0b2NvbXBsZXRlXT1cInRvd25zUGFuZWxcIiBbaWd4QXV0b2NvbXBsZXRlRGlzYWJsZWRdPVwiZGlzYWJsZWRcIi8+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIHNldFxuICAgICAqIHB1YmxpYyBkaXNhYmxlZCA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdpZ3hBdXRvY29tcGxldGVEaXNhYmxlZCcpXG4gICAgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIGl0ZW0gZnJvbSB0aGUgZHJvcCBkb3duIGlzIHNlbGVjdGVkXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IGlneElucHV0IFtpZ3hBdXRvY29tcGxldGVdPVwidG93bnNQYW5lbFwiIChzZWxlY3Rpb25DaGFuZ2luZyk9J3NlbGVjdGlvbkNoYW5naW5nKCRldmVudCknIC8+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGlvbkNoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxBdXRvY29tcGxldGVTZWxlY3Rpb25DaGFuZ2luZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgcGFyZW50RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyb3VwID8gdGhpcy5ncm91cC5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgOiB0aGlzLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgc2V0dGluZ3MoKTogT3ZlcmxheVNldHRpbmdzIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5hdXRvY29tcGxldGVTZXR0aW5ncyk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHNldHRpbmdzLnRhcmdldCB8fCBzZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5LnNldHRpbmdzLnRhcmdldDtcbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3lDbG9uZTogSVBvc2l0aW9uU3RyYXRlZ3kgPSBzZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5LmNsb25lKCk7XG4gICAgICAgICAgICBzZXR0aW5ncy50YXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBzZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5ID0gcG9zaXRpb25TdHJhdGVneUNsb25lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAgQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtZXhwYW5kZWQnKVxuICAgIHB1YmxpYyBnZXQgYXJpYUV4cGFuZGVkKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY29sbGFwc2VkO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1oYXNwb3B1cCcpXG4gICAgcHVibGljIGdldCBoYXNQb3BVcCgpIHtcbiAgICAgICAgcmV0dXJuICdsaXN0Ym94JztcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAgQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtb3ducycpXG4gICAgcHVibGljIGdldCBhcmlhT3ducygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Lmxpc3RJZDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAgQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudCcpXG4gICAgcHVibGljIGdldCBhcmlhQWN0aXZlRGVzY2VuZGFudCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnRhcmdldC5jb2xsYXBzZWQgJiYgdGhpcy50YXJnZXQuZm9jdXNlZEl0ZW0gPyB0aGlzLnRhcmdldC5mb2N1c2VkSXRlbS5pZCA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWF1dG9jb21wbGV0ZScpXG4gICAgcHVibGljIGdldCBhcmlhQXV0b2NvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gJ2xpc3QnO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpZDogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBnZXQgbW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5nTW9kZWwgfHwgdGhpcy5mb3JtQ29udHJvbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zaG91bGRCZU9wZW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcbiAgICBwcml2YXRlIGRlZmF1bHRTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzO1xuXG4gICAgY29uc3RydWN0b3IoQFNlbGYoKSBAT3B0aW9uYWwoKSBASW5qZWN0KE5nTW9kZWwpIHByb3RlY3RlZCBuZ01vZGVsOiBOZ01vZGVsLFxuICAgICAgICBAU2VsZigpIEBPcHRpb25hbCgpIEBJbmplY3QoRm9ybUNvbnRyb2xOYW1lKSBwcm90ZWN0ZWQgZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sTmFtZSxcbiAgICAgICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50LFxuICAgICAgICBwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgc3VwZXIobnVsbCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JylcbiAgICBwdWJsaWMgb25JbnB1dCgpIHtcbiAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uQXJyb3dEb3duJywgWyckZXZlbnQnXSlcbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duLkFsdC5BcnJvd0Rvd24nLCBbJyRldmVudCddKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uQXJyb3dVcCcsIFsnJGV2ZW50J10pXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5BbHQuQXJyb3dVcCcsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uQXJyb3dEb3duKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAgQGludGVybmFsICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bi5UYWInKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uU2hpZnQuVGFiJylcbiAgICBwdWJsaWMgb25UYWIoKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAgQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUtleURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzcGFjZWJhcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgICAgICAgY2FzZSAnaG9tZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyLmhhbmRsZUtleURvd24oZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBvbkFycm93RG93bktleURvd24oKSB7XG4gICAgICAgIHN1cGVyLm9uQXJyb3dEb3duS2V5RG93bigpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25BcnJvd1VwS2V5RG93bigpIHtcbiAgICAgICAgc3VwZXIub25BcnJvd1VwS2V5RG93bigpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25FbmRLZXlEb3duKCkge1xuICAgICAgICBzdXBlci5vbkVuZEtleURvd24oKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAgQGludGVybmFsICovXG4gICAgcHVibGljIG9uSG9tZUtleURvd24oKSB7XG4gICAgICAgIHN1cGVyLm9uSG9tZUtleURvd24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgYXV0b2NvbXBsZXRlIGRyb3AgZG93blxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5fc2hvdWxkQmVPcGVuID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0LmNsb3NlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgYXV0b2NvbXBsZXRlIGRyb3AgZG93blxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkge1xuICAgICAgICB0aGlzLl9zaG91bGRCZU9wZW4gPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5jb2xsYXBzZWQgfHwgdGhpcy50YXJnZXQuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgbm8gZHJvcC1kb3duIHdpZHRoIGlzIHNldCwgdGhlIGRyb3AtZG93biB3aWxsIGJlIGFzIHdpZGUgYXMgdGhlIGF1dG9jb21wbGV0ZSBpbnB1dDtcbiAgICAgICAgdGhpcy50YXJnZXQud2lkdGggPSB0aGlzLnRhcmdldC53aWR0aCB8fCAodGhpcy5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoICsgJ3B4Jyk7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9wZW4odGhpcy5zZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gdGhpcy5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLmRlZmF1bHRTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0RWxlbWVudCxcbiAgICAgICAgICAgIG1vZGFsOiBmYWxzZSxcbiAgICAgICAgICAgIHNjcm9sbFN0cmF0ZWd5OiBuZXcgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICAgICAgcG9zaXRpb25TdHJhdGVneTogbmV3IEF1dG9Qb3NpdGlvblN0cmF0ZWd5KCksXG4gICAgICAgICAgICBleGNsdWRlRnJvbU91dHNpZGVDbGljazogW3RhcmdldEVsZW1lbnRdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy50YXJnZXQuY2hpbGRyZW4uY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zaG91bGRCZU9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBfc2hvdWxkQmVPcGVuIGZsYWcgc2hvdWxkIHJlbWFpbiB1bmNoYW5nZWQgc2luY2UgdGhpcyBzdGF0ZSBjaGFuZ2UgZG9lc24ndCBjb21lIGZyb20gb3V0c2lkZSBvZiB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgLy8gKGxpa2UgaW4gdGhlIGNhc2Ugb2YgcHVibGljIEFQSSBvciB1c2VyIGludGVyYWN0aW9uKS5cbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YXJnZXQuc2VsZWN0aW9uQ2hhbmdpbmcucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSh0aGlzLnNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBjb2xsYXBzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhcmdldCA/IHRoaXMudGFyZ2V0LmNvbGxhcHNlZCA6IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3QodmFsdWU6IElTZWxlY3Rpb25FdmVudEFyZ3MpIHtcbiAgICAgICAgaWYgKCF2YWx1ZS5uZXdTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZS5jYW5jZWwgPSB0cnVlOyAvLyBEaXNhYmxlIHNlbGVjdGlvbiBpbiB0aGUgZHJvcCBkb3duLCBiZWNhdXNlIGluIGF1dG9jb21wbGV0ZSB3ZSBkbyBub3Qgc2F2ZSBzZWxlY3Rpb24uXG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUubmV3U2VsZWN0aW9uLnZhbHVlO1xuICAgICAgICBjb25zdCBhcmdzOiBBdXRvY29tcGxldGVTZWxlY3Rpb25DaGFuZ2luZ0V2ZW50QXJncyA9IHsgdmFsdWU6IG5ld1ZhbHVlLCBjYW5jZWw6IGZhbHNlIH07XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdpbmcuZW1pdChhcmdzKTtcbiAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBtb2RlbCBhZnRlciB0aGUgaW5wdXQgaXMgcmUtZm9jdXNlZCwgaW4gb3JkZXIgdG8gaGF2ZSBwcm9wZXIgdmFsaWQgc3R5bGluZy5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdoZW4gaXRlbSBpcyBzZWxlY3RlZCB1c2luZyBtb3VzZSAoYW5kIGlucHV0IGlzIGJsdXJyZWQpLCB0aGVuIHZhbGlkIHN0eWxlIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuY29udHJvbC5zZXRWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIGhpZ2hsaWdodEZpcnN0SXRlbSgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0LmZvY3VzZWRJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5mb2N1c2VkSXRlbS5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5mb2N1c2VkSXRlbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YXJnZXQubmF2aWdhdGVGaXJzdCgpO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfTtcbn1cblxuLyoqIEBoaWRkZW4gKi9cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0lneERyb3BEb3duTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0lneEF1dG9jb21wbGV0ZURpcmVjdGl2ZV0sXG4gICAgZXhwb3J0czogW0lneEF1dG9jb21wbGV0ZURpcmVjdGl2ZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4QXV0b2NvbXBsZXRlTW9kdWxlIHsgfVxuIl19