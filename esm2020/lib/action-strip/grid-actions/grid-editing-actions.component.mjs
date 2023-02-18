import { Component, HostBinding, Input } from '@angular/core';
import { IgxGridActionsBaseDirective } from './grid-actions-base.directive';
import { showMessage } from '../../core/utils';
import { addRow, addChild } from '@igniteui/material-icons-extended';
import * as i0 from "@angular/core";
import * as i1 from "./grid-action-button.component";
import * as i2 from "@angular/common";
export class IgxGridEditingActionsComponent extends IgxGridActionsBaseDirective {
    constructor() {
        super(...arguments);
        /**
         * Host `class.igx-action-strip` binding.
         *
         * @hidden
         * @internal
         */
        this.cssClass = 'igx-action-strip__editing-actions';
        /**
         * An input to enable/disable action strip child row adding button
         */
        this.addChild = false;
        this.isMessageShown = false;
        this._addRow = false;
        this.iconsRendered = false;
    }
    /**
     * An input to enable/disable action strip row adding button
     */
    set addRow(value) {
        this._addRow = value;
    }
    get addRow() {
        if (!this.iconsRendered) {
            this.registerIcons();
            this.iconsRendered = true;
        }
        return this._addRow;
    }
    /**
     * Getter if the row is disabled
     *
     * @hidden
     * @internal
     */
    get disabled() {
        if (!this.isRow(this.strip.context)) {
            return;
        }
        return this.strip.context.disabled;
    }
    /**
     * Getter if the row is root.
     *
     * @hidden
     * @internal
     */
    get isRootRow() {
        if (!this.isRow(this.strip.context)) {
            return false;
        }
        return this.strip.context.isRoot;
    }
    get hasChildren() {
        if (!this.isRow(this.strip.context)) {
            return false;
        }
        return this.strip.context.hasChildren;
    }
    /**
     * Enter row or cell edit mode depending the grid rowEditable option
     *
     * @example
     * ```typescript
     * this.gridEditingActions.startEdit();
     * ```
     */
    startEdit(event) {
        if (event) {
            event.stopPropagation();
        }
        if (!this.isRow(this.strip.context)) {
            return;
        }
        const row = this.strip.context;
        const firstEditable = row.cells.filter(cell => cell.editable)[0];
        const grid = row.grid;
        if (!grid.hasEditableColumns) {
            this.isMessageShown = showMessage('The grid should be editable in order to use IgxGridEditingActionsComponent', this.isMessageShown);
            return;
        }
        // be sure row is in view
        if (grid.rowList.filter(r => r === row).length !== 0) {
            grid.gridAPI.crudService.enterEditMode(firstEditable, event);
            firstEditable.activate(event);
        }
        this.strip.hide();
    }
    /**
     * Delete a row according to the context
     *
     * @example
     * ```typescript
     * this.gridEditingActions.deleteRow();
     * ```
     */
    deleteRow(event) {
        if (event) {
            event.stopPropagation();
        }
        if (!this.isRow(this.strip.context)) {
            return;
        }
        const context = this.strip.context;
        const grid = context.grid;
        grid.deleteRow(context.key);
        this.strip.hide();
    }
    addRowHandler(event, asChild) {
        if (event) {
            event.stopPropagation();
        }
        if (!this.isRow(this.strip.context)) {
            return;
        }
        const context = this.strip.context;
        const grid = context.grid;
        if (!grid.rowEditable) {
            console.warn('The grid must use row edit mode to perform row adding! Please set rowEditable to true.');
            return;
        }
        grid.gridAPI.crudService.enterAddRowMode(context, asChild, event);
        this.strip.hide();
    }
    /**
     * @hidden
     * @internal
     */
    registerIcons() {
        this.iconService.addSvgIconFromText(addRow.name, addRow.value, 'imx-icons', true);
        this.iconService.addSvgIconFromText(addChild.name, addChild.value, 'imx-icons', true);
    }
}
IgxGridEditingActionsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridEditingActionsComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxGridEditingActionsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridEditingActionsComponent, selector: "igx-grid-editing-actions", inputs: { addRow: "addRow", addChild: "addChild" }, host: { properties: { "class.igx-action-strip__editing-actions": "this.cssClass" } }, providers: [{ provide: IgxGridActionsBaseDirective, useExisting: IgxGridEditingActionsComponent }], usesInheritance: true, ngImport: i0, template: "\n<ng-container *ngIf=\"isRowContext\">\n    <igx-grid-action-button *ngIf=\"!disabled\" [asMenuItem]=\"asMenuItems\" iconName=\"edit\" [labelText]=\"grid.resourceStrings.igx_grid_actions_edit_label\" (actionClick)=\"startEdit($event)\"></igx-grid-action-button>\n    <igx-grid-action-button *ngIf=\"addRow && isRootRow\" [asMenuItem]=\"asMenuItems\" iconName=\"add-row\" iconSet=\"imx-icons\" [labelText]=\"grid.resourceStrings.igx_grid_actions_add_label\" (actionClick)=\"addRowHandler($event)\"></igx-grid-action-button>\n    <igx-grid-action-button *ngIf=\"addChild && hasChildren\" [asMenuItem]=\"asMenuItems\" iconName=\"add-child\" iconSet=\"imx-icons\" [labelText]=\"grid.resourceStrings.igx_grid_actions_add_child_label\" (actionClick)=\"addRowHandler($event, true)\"></igx-grid-action-button>\n    <igx-grid-action-button *ngIf=\"!disabled\" class=\"igx-action-strip__delete\" classNames='igx-action-strip__menu-item--danger' [asMenuItem]=\"asMenuItems\" iconName=\"delete\" [labelText]=\"grid.resourceStrings.igx_grid_actions_delete_label\" (actionClick)=\"deleteRow($event)\"></igx-grid-action-button>\n</ng-container>\n\n", components: [{ type: i1.IgxGridActionButtonComponent, selector: "igx-grid-action-button", inputs: ["asMenuItem", "iconName", "classNames", "iconSet", "labelText"], outputs: ["actionClick"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridEditingActionsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-grid-editing-actions', providers: [{ provide: IgxGridActionsBaseDirective, useExisting: IgxGridEditingActionsComponent }], template: "\n<ng-container *ngIf=\"isRowContext\">\n    <igx-grid-action-button *ngIf=\"!disabled\" [asMenuItem]=\"asMenuItems\" iconName=\"edit\" [labelText]=\"grid.resourceStrings.igx_grid_actions_edit_label\" (actionClick)=\"startEdit($event)\"></igx-grid-action-button>\n    <igx-grid-action-button *ngIf=\"addRow && isRootRow\" [asMenuItem]=\"asMenuItems\" iconName=\"add-row\" iconSet=\"imx-icons\" [labelText]=\"grid.resourceStrings.igx_grid_actions_add_label\" (actionClick)=\"addRowHandler($event)\"></igx-grid-action-button>\n    <igx-grid-action-button *ngIf=\"addChild && hasChildren\" [asMenuItem]=\"asMenuItems\" iconName=\"add-child\" iconSet=\"imx-icons\" [labelText]=\"grid.resourceStrings.igx_grid_actions_add_child_label\" (actionClick)=\"addRowHandler($event, true)\"></igx-grid-action-button>\n    <igx-grid-action-button *ngIf=\"!disabled\" class=\"igx-action-strip__delete\" classNames='igx-action-strip__menu-item--danger' [asMenuItem]=\"asMenuItems\" iconName=\"delete\" [labelText]=\"grid.resourceStrings.igx_grid_actions_delete_label\" (actionClick)=\"deleteRow($event)\"></igx-grid-action-button>\n</ng-container>\n\n" }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-action-strip__editing-actions']
            }], addRow: [{
                type: Input
            }], addChild: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1lZGl0aW5nLWFjdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2FjdGlvbi1zdHJpcC9ncmlkLWFjdGlvbnMvZ3JpZC1lZGl0aW5nLWFjdGlvbnMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2FjdGlvbi1zdHJpcC9ncmlkLWFjdGlvbnMvZ3JpZC1lZGl0aW5nLWFjdGlvbnMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRyxNQUFNLG1DQUFtQyxDQUFDOzs7O0FBUXRFLE1BQU0sT0FBTyw4QkFBK0IsU0FBUSwyQkFBMkI7SUFOL0U7O1FBUUk7Ozs7O1dBS0c7UUFFSSxhQUFRLEdBQUcsbUNBQW1DLENBQUM7UUFrRHREOztXQUVHO1FBRUksYUFBUSxHQUFHLEtBQUssQ0FBQztRQUVoQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO0tBaUZqQztJQXpJRzs7T0FFRztJQUNILElBQ1csTUFBTSxDQUFDLEtBQWM7UUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUNELElBQVcsTUFBTTtRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxh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QUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxnQ0FBZ0MsRUFBRSxDQUFDOzhCQVkzRixRQUFRO3NCQURkLFdBQVc7dUJBQUMseUNBQXlDO2dCQU8zQyxNQUFNO3NCQURoQixLQUFLO2dCQWlEQyxRQUFRO3NCQURkLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4R3JpZEFjdGlvbnNCYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi9ncmlkLWFjdGlvbnMtYmFzZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgc2hvd01lc3NhZ2UgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IGFkZFJvdywgYWRkQ2hpbGQgIH0gZnJvbSAnQGlnbml0ZXVpL21hdGVyaWFsLWljb25zLWV4dGVuZGVkJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtZ3JpZC1lZGl0aW5nLWFjdGlvbnMnLFxuICAgIHRlbXBsYXRlVXJsOiAnZ3JpZC1lZGl0aW5nLWFjdGlvbnMuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogSWd4R3JpZEFjdGlvbnNCYXNlRGlyZWN0aXZlLCB1c2VFeGlzdGluZzogSWd4R3JpZEVkaXRpbmdBY3Rpb25zQ29tcG9uZW50IH1dXG59KVxuXG5leHBvcnQgY2xhc3MgSWd4R3JpZEVkaXRpbmdBY3Rpb25zQ29tcG9uZW50IGV4dGVuZHMgSWd4R3JpZEFjdGlvbnNCYXNlRGlyZWN0aXZlIHtcblxuICAgIC8qKlxuICAgICAqIEhvc3QgYGNsYXNzLmlneC1hY3Rpb24tc3RyaXBgIGJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtYWN0aW9uLXN0cmlwX19lZGl0aW5nLWFjdGlvbnMnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtYWN0aW9uLXN0cmlwX19lZGl0aW5nLWFjdGlvbnMnO1xuXG4gICAgLyoqXG4gICAgICogQW4gaW5wdXQgdG8gZW5hYmxlL2Rpc2FibGUgYWN0aW9uIHN0cmlwIHJvdyBhZGRpbmcgYnV0dG9uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGFkZFJvdyh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9hZGRSb3cgPSB2YWx1ZTtcbiAgICB9XG4gICAgcHVibGljIGdldCBhZGRSb3coKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5pY29uc1JlbmRlcmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVySWNvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuaWNvbnNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFJvdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgaWYgdGhlIHJvdyBpcyBkaXNhYmxlZFxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5pc1Jvdyh0aGlzLnN0cmlwLmNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaXAuY29udGV4dC5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgaWYgdGhlIHJvdyBpcyByb290LlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNSb290Um93KCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNSb3codGhpcy5zdHJpcC5jb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmlwLmNvbnRleHQuaXNSb290O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5pc1Jvdyh0aGlzLnN0cmlwLmNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaXAuY29udGV4dC5oYXNDaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBpbnB1dCB0byBlbmFibGUvZGlzYWJsZSBhY3Rpb24gc3RyaXAgY2hpbGQgcm93IGFkZGluZyBidXR0b25cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBhZGRDaGlsZCA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBpc01lc3NhZ2VTaG93biA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2FkZFJvdyA9IGZhbHNlO1xuICAgIHByaXZhdGUgaWNvbnNSZW5kZXJlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogRW50ZXIgcm93IG9yIGNlbGwgZWRpdCBtb2RlIGRlcGVuZGluZyB0aGUgZ3JpZCByb3dFZGl0YWJsZSBvcHRpb25cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZ3JpZEVkaXRpbmdBY3Rpb25zLnN0YXJ0RWRpdCgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGFydEVkaXQoZXZlbnQ/KTogdm9pZCB7XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzUm93KHRoaXMuc3RyaXAuY29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3cgPSB0aGlzLnN0cmlwLmNvbnRleHQ7XG4gICAgICAgIGNvbnN0IGZpcnN0RWRpdGFibGUgPSByb3cuY2VsbHMuZmlsdGVyKGNlbGwgPT4gY2VsbC5lZGl0YWJsZSlbMF07XG4gICAgICAgIGNvbnN0IGdyaWQgPSByb3cuZ3JpZDtcbiAgICAgICAgaWYgKCFncmlkLmhhc0VkaXRhYmxlQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5pc01lc3NhZ2VTaG93biA9IHNob3dNZXNzYWdlKFxuICAgICAgICAgICAgICAgICdUaGUgZ3JpZCBzaG91bGQgYmUgZWRpdGFibGUgaW4gb3JkZXIgdG8gdXNlIElneEdyaWRFZGl0aW5nQWN0aW9uc0NvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgdGhpcy5pc01lc3NhZ2VTaG93bik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGJlIHN1cmUgcm93IGlzIGluIHZpZXdcbiAgICAgICAgaWYgKGdyaWQucm93TGlzdC5maWx0ZXIociA9PiByID09PSByb3cpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgZ3JpZC5ncmlkQVBJLmNydWRTZXJ2aWNlLmVudGVyRWRpdE1vZGUoZmlyc3RFZGl0YWJsZSwgZXZlbnQpO1xuICAgICAgICAgICAgZmlyc3RFZGl0YWJsZS5hY3RpdmF0ZShldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJpcC5oaWRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsZXRlIGEgcm93IGFjY29yZGluZyB0byB0aGUgY29udGV4dFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkRWRpdGluZ0FjdGlvbnMuZGVsZXRlUm93KCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGRlbGV0ZVJvdyhldmVudD8pOiB2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNSb3codGhpcy5zdHJpcC5jb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLnN0cmlwLmNvbnRleHQ7XG4gICAgICAgIGNvbnN0IGdyaWQgPSBjb250ZXh0LmdyaWQ7XG4gICAgICAgIGdyaWQuZGVsZXRlUm93KGNvbnRleHQua2V5KTtcblxuICAgICAgICB0aGlzLnN0cmlwLmhpZGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkUm93SGFuZGxlcihldmVudD8sIGFzQ2hpbGQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzUm93KHRoaXMuc3RyaXAuY29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5zdHJpcC5jb250ZXh0O1xuICAgICAgICBjb25zdCBncmlkID0gY29udGV4dC5ncmlkO1xuICAgICAgICBpZiAoIWdyaWQucm93RWRpdGFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIGdyaWQgbXVzdCB1c2Ugcm93IGVkaXQgbW9kZSB0byBwZXJmb3JtIHJvdyBhZGRpbmchIFBsZWFzZSBzZXQgcm93RWRpdGFibGUgdG8gdHJ1ZS4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBncmlkLmdyaWRBUEkuY3J1ZFNlcnZpY2UuZW50ZXJBZGRSb3dNb2RlKGNvbnRleHQsIGFzQ2hpbGQsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5zdHJpcC5oaWRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByaXZhdGUgcmVnaXN0ZXJJY29ucygpIHtcbiAgICAgICAgdGhpcy5pY29uU2VydmljZS5hZGRTdmdJY29uRnJvbVRleHQoYWRkUm93Lm5hbWUsIGFkZFJvdy52YWx1ZSwgJ2lteC1pY29ucycsIHRydWUsKTtcbiAgICAgICAgdGhpcy5pY29uU2VydmljZS5hZGRTdmdJY29uRnJvbVRleHQoYWRkQ2hpbGQubmFtZSwgYWRkQ2hpbGQudmFsdWUsICdpbXgtaWNvbnMnLCB0cnVlKTtcbiAgICB9XG59XG4iLCJcbjxuZy1jb250YWluZXIgKm5nSWY9XCJpc1Jvd0NvbnRleHRcIj5cbiAgICA8aWd4LWdyaWQtYWN0aW9uLWJ1dHRvbiAqbmdJZj1cIiFkaXNhYmxlZFwiIFthc01lbnVJdGVtXT1cImFzTWVudUl0ZW1zXCIgaWNvbk5hbWU9XCJlZGl0XCIgW2xhYmVsVGV4dF09XCJncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9hY3Rpb25zX2VkaXRfbGFiZWxcIiAoYWN0aW9uQ2xpY2spPVwic3RhcnRFZGl0KCRldmVudClcIj48L2lneC1ncmlkLWFjdGlvbi1idXR0b24+XG4gICAgPGlneC1ncmlkLWFjdGlvbi1idXR0b24gKm5nSWY9XCJhZGRSb3cgJiYgaXNSb290Um93XCIgW2FzTWVudUl0ZW1dPVwiYXNNZW51SXRlbXNcIiBpY29uTmFtZT1cImFkZC1yb3dcIiBpY29uU2V0PVwiaW14LWljb25zXCIgW2xhYmVsVGV4dF09XCJncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9hY3Rpb25zX2FkZF9sYWJlbFwiIChhY3Rpb25DbGljayk9XCJhZGRSb3dIYW5kbGVyKCRldmVudClcIj48L2lneC1ncmlkLWFjdGlvbi1idXR0b24+XG4gICAgPGlneC1ncmlkLWFjdGlvbi1idXR0b24gKm5nSWY9XCJhZGRDaGlsZCAmJiBoYXNDaGlsZHJlblwiIFthc01lbnVJdGVtXT1cImFzTWVudUl0ZW1zXCIgaWNvbk5hbWU9XCJhZGQtY2hpbGRcIiBpY29uU2V0PVwiaW14LWljb25zXCIgW2xhYmVsVGV4dF09XCJncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9hY3Rpb25zX2FkZF9jaGlsZF9sYWJlbFwiIChhY3Rpb25DbGljayk9XCJhZGRSb3dIYW5kbGVyKCRldmVudCwgdHJ1ZSlcIj48L2lneC1ncmlkLWFjdGlvbi1idXR0b24+XG4gICAgPGlneC1ncmlkLWFjdGlvbi1idXR0b24gKm5nSWY9XCIhZGlzYWJsZWRcIiBjbGFzcz1cImlneC1hY3Rpb24tc3RyaXBfX2RlbGV0ZVwiIGNsYXNzTmFtZXM9J2lneC1hY3Rpb24tc3RyaXBfX21lbnUtaXRlbS0tZGFuZ2VyJyBbYXNNZW51SXRlbV09XCJhc01lbnVJdGVtc1wiIGljb25OYW1lPVwiZGVsZXRlXCIgW2xhYmVsVGV4dF09XCJncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9hY3Rpb25zX2RlbGV0ZV9sYWJlbFwiIChhY3Rpb25DbGljayk9XCJkZWxldGVSb3coJGV2ZW50KVwiPjwvaWd4LWdyaWQtYWN0aW9uLWJ1dHRvbj5cbjwvbmctY29udGFpbmVyPlxuXG4iXX0=