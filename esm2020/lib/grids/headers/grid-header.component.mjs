import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { GridColumnDataType } from '../../data-operations/data-util';
import { Subject } from 'rxjs';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { GridSelectionMode } from '../common/enums';
import { SortingDirection } from '../../data-operations/sorting-strategy';
import * as i0 from "@angular/core";
import * as i1 from "../resizing/resizing.service";
import * as i2 from "../../icon/icon.component";
import * as i3 from "@angular/common";
import * as i4 from "./pipes";
/**
 * @hidden
 */
export class IgxGridHeaderComponent {
    constructor(grid, colResizingService, cdr, ref) {
        this.grid = grid;
        this.colResizingService = colResizingService;
        this.cdr = cdr;
        this.ref = ref;
        this.sortDirection = SortingDirection.None;
        this._destroy$ = new Subject();
    }
    /**
     * Returns the `aria-selected` of the header.
     */
    get ariaSelected() {
        return this.column.selected;
    }
    get columnGroupStyle() {
        return !this.column.columnGroup;
    }
    /**
     * @hidden
     * @internal
     */
    get cosyStyle() {
        return this.density === 'cosy';
    }
    /**
     * @hidden
     * @internal
     */
    get compactStyle() {
        return this.density === 'compact';
    }
    get sortAscendingStyle() {
        return this.sortDirection === SortingDirection.Asc;
    }
    get sortDescendingStyle() {
        return this.sortDirection === SortingDirection.Desc;
    }
    get numberStyle() {
        return this.column.dataType === GridColumnDataType.Number;
    }
    get sortableStyle() {
        return this.column.sortable;
    }
    get selectableStyle() {
        return this.selectable;
    }
    get filterableStyle() {
        return this.column.filterable && this.grid.filteringService.isFilterRowVisible;
    }
    get sortedStyle() {
        return this.sorted;
    }
    get selectedStyle() {
        return this.selected;
    }
    get height() {
        if (!this.grid.hasColumnGroups || this.grid.isPivot) {
            return null;
        }
        return (this.grid.maxLevelHeaderDepth + 1 - this.column.level) * this.grid.defaultRowHeight / this.grid._baseFontSize;
    }
    /**
     * @hidden
     */
    get esfIconTemplate() {
        return this.grid.excelStyleHeaderIconTemplate || this.defaultESFHeaderIconTemplate;
    }
    /**
     * @hidden
     */
    get sortIconTemplate() {
        if (this.sortDirection === SortingDirection.None && this.grid.sortHeaderIconTemplate) {
            return this.grid.sortHeaderIconTemplate;
        }
        else if (this.sortDirection === SortingDirection.Asc && this.grid.sortAscendingHeaderIconTemplate) {
            return this.grid.sortAscendingHeaderIconTemplate;
        }
        else if (this.sortDirection === SortingDirection.Desc && this.grid.sortDescendingHeaderIconTemplate) {
            return this.grid.sortDescendingHeaderIconTemplate;
        }
        else {
            return this.defaultSortHeaderIconTemplate;
        }
    }
    get sorted() {
        return this.sortDirection !== SortingDirection.None;
    }
    get filterIconClassName() {
        return this.column.filteringExpressionsTree ? 'igx-excel-filter__icon--filtered' : 'igx-excel-filter__icon';
    }
    get selectable() {
        return this.grid.columnSelection !== GridSelectionMode.none &&
            this.column.applySelectableClass &&
            !this.column.selected &&
            !this.grid.filteringService.isFilterRowVisible;
    }
    get selected() {
        return this.column.selected
            && (!this.grid.filteringService.isFilterRowVisible || this.grid.filteringService.filteredColumn !== this.column);
    }
    get title() {
        return this.column.title || this.column.header || this.column.field;
    }
    get nativeElement() {
        return this.ref.nativeElement;
    }
    onClick(event) {
        if (!this.colResizingService.isColumnResizing) {
            if (this.grid.filteringService.isFilterRowVisible) {
                if (this.column.filterCellTemplate) {
                    this.grid.filteringRow.close();
                    return;
                }
                if (this.column.filterable && !this.column.columnGroup &&
                    !this.grid.filteringService.isFilterComplex(this.column.field)) {
                    this.grid.filteringService.filteredColumn = this.column;
                }
            }
            else if (this.grid.columnSelection !== GridSelectionMode.none && this.column.selectable) {
                const clearSelection = this.grid.columnSelection === GridSelectionMode.single || !event.ctrlKey;
                const rangeSelection = this.grid.columnSelection === GridSelectionMode.multiple && event.shiftKey;
                if (!this.column.selected || (this.grid.selectionService.getSelectedColumns().length > 1 && clearSelection)) {
                    this.grid.selectionService.selectColumn(this.column.field, clearSelection, rangeSelection, event);
                }
                else {
                    this.grid.selectionService.deselectColumn(this.column.field, event);
                }
            }
        }
        this.grid.theadRow.nativeElement.focus();
    }
    /**
     * @hidden
     */
    onPinterEnter() {
        this.column.applySelectableClass = true;
    }
    /**
     * @hidden
     */
    onPointerLeave() {
        this.column.applySelectableClass = false;
    }
    ngDoCheck() {
        this.getSortDirection();
        this.cdr.markForCheck();
    }
    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
    onFilteringIconClick(event) {
        event.stopPropagation();
        this.grid.filteringService.toggleFilterDropdown(this.nativeElement, this.column);
    }
    onSortingIconClick(event) {
        event.stopPropagation();
        this.triggerSort();
    }
    getSortDirection() {
        const expr = this.grid.sortingExpressions.find((x) => x.fieldName === this.column.field);
        this.sortDirection = expr ? expr.dir : SortingDirection.None;
    }
    triggerSort() {
        const groupingExpr = this.grid.groupingExpressions ?
            this.grid.groupingExpressions.find((expr) => expr.fieldName === this.column.field) :
            this.grid.groupArea?.expressions ? this.grid.groupArea?.expressions.find((expr) => expr.fieldName === this.column.field) : null;
        const sortDir = groupingExpr ?
            this.sortDirection + 1 > SortingDirection.Desc ? SortingDirection.Asc : SortingDirection.Desc
            : this.sortDirection + 1 > SortingDirection.Desc ? SortingDirection.None : this.sortDirection + 1;
        this.sortDirection = sortDir;
        this.grid.sort({
            fieldName: this.column.field, dir: this.sortDirection, ignoreCase: this.column.sortingIgnoreCase,
            strategy: this.column.sortStrategy
        });
    }
}
IgxGridHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridHeaderComponent, deps: [{ token: IGX_GRID_BASE }, { token: i1.IgxColumnResizingService }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxGridHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridHeaderComponent, selector: "igx-grid-header", inputs: { column: "column", density: "density" }, host: { listeners: { "click": "onClick($event)", "pointerenter": "onPinterEnter()", "pointerleave": "onPointerLeave()" }, properties: { "attr.aria-selected": "this.ariaSelected", "class.igx-grid-th": "this.columnGroupStyle", "class.igx-grid-th--cosy": "this.cosyStyle", "class.igx-grid-th--compact": "this.compactStyle", "class.asc": "this.sortAscendingStyle", "class.desc": "this.sortDescendingStyle", "class.igx-grid-th--number": "this.numberStyle", "class.igx-grid-th--sortable": "this.sortableStyle", "class.igx-grid-th--selectable": "this.selectableStyle", "class.igx-grid-th--filtrable": "this.filterableStyle", "class.igx-grid-th--sorted": "this.sortedStyle", "class.igx-grid-th--selected": "this.selectedStyle", "style.height.rem": "this.height" } }, viewQueries: [{ propertyName: "defaultESFHeaderIconTemplate", first: true, predicate: ["defaultESFHeaderIconTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultSortHeaderIconTemplate", first: true, predicate: ["defaultSortHeaderIconTemplate"], descendants: true, read: TemplateRef, static: true }], ngImport: i0, template: "<ng-template #defaultColumn>\n    <span [title]=\"title\">{{ column.header || column.field }}</span>\n</ng-template>\n\n<ng-template #defaultESFHeaderIconTemplate>\n    <igx-icon>more_vert</igx-icon>\n</ng-template>\n\n<ng-template #defaultSortHeaderIconTemplate>\n    <igx-icon>{{ sortDirection < 2 ? 'arrow_upward' : 'arrow_downward' }}</igx-icon>\n</ng-template>\n\n<span class=\"igx-grid-th__title\">\n    <ng-container\n        *ngTemplateOutlet=\"column.headerTemplate ? column.headerTemplate : defaultColumn; context: { $implicit: column, column: column}\">\n    </ng-container>\n</span>\n<ng-container *ngIf=\"!column.columnGroup\">\n    <div class=\"igx-grid-th__icons\">\n        <ng-container *ngIf=\"column.sortable\">\n            <div class=\"sort-icon\" [attr.data-sortIndex]=\"column.field | sortingIndex:grid.sortingExpressions\"\n                [attr.draggable]=\"false\" (click)=\"onSortingIconClick($event)\" (pointerdown)=\"$event.stopPropagation()\">\n                <ng-container *ngTemplateOutlet=\"sortIconTemplate; context: { $implicit:  this }\"></ng-container>\n            </div>\n        </ng-container>\n        <ng-container *ngIf=\"grid.allowFiltering && column.filterable && grid.filterMode === 'excelStyleFilter'\">\n            <div [ngClass]=\"filterIconClassName\" (click)=\"onFilteringIconClick($event)\"\n                (pointerdown)=\"$event.stopPropagation()\">\n                <ng-container *ngTemplateOutlet=\"esfIconTemplate; context: { $implicit:  this }\"></ng-container>\n            </div>\n        </ng-container>\n    </div>\n</ng-container>", components: [{ type: i2.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], pipes: { "sortingIndex": i4.SortingIndexPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridHeaderComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-grid-header', template: "<ng-template #defaultColumn>\n    <span [title]=\"title\">{{ column.header || column.field }}</span>\n</ng-template>\n\n<ng-template #defaultESFHeaderIconTemplate>\n    <igx-icon>more_vert</igx-icon>\n</ng-template>\n\n<ng-template #defaultSortHeaderIconTemplate>\n    <igx-icon>{{ sortDirection < 2 ? 'arrow_upward' : 'arrow_downward' }}</igx-icon>\n</ng-template>\n\n<span class=\"igx-grid-th__title\">\n    <ng-container\n        *ngTemplateOutlet=\"column.headerTemplate ? column.headerTemplate : defaultColumn; context: { $implicit: column, column: column}\">\n    </ng-container>\n</span>\n<ng-container *ngIf=\"!column.columnGroup\">\n    <div class=\"igx-grid-th__icons\">\n        <ng-container *ngIf=\"column.sortable\">\n            <div class=\"sort-icon\" [attr.data-sortIndex]=\"column.field | sortingIndex:grid.sortingExpressions\"\n                [attr.draggable]=\"false\" (click)=\"onSortingIconClick($event)\" (pointerdown)=\"$event.stopPropagation()\">\n                <ng-container *ngTemplateOutlet=\"sortIconTemplate; context: { $implicit:  this }\"></ng-container>\n            </div>\n        </ng-container>\n        <ng-container *ngIf=\"grid.allowFiltering && column.filterable && grid.filterMode === 'excelStyleFilter'\">\n            <div [ngClass]=\"filterIconClassName\" (click)=\"onFilteringIconClick($event)\"\n                (pointerdown)=\"$event.stopPropagation()\">\n                <ng-container *ngTemplateOutlet=\"esfIconTemplate; context: { $implicit:  this }\"></ng-container>\n            </div>\n        </ng-container>\n    </div>\n</ng-container>" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i1.IgxColumnResizingService }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { column: [{
                type: Input
            }], density: [{
                type: Input
            }], defaultESFHeaderIconTemplate: [{
                type: ViewChild,
                args: ['defaultESFHeaderIconTemplate', { read: TemplateRef, static: true }]
            }], defaultSortHeaderIconTemplate: [{
                type: ViewChild,
                args: ['defaultSortHeaderIconTemplate', { read: TemplateRef, static: true }]
            }], ariaSelected: [{
                type: HostBinding,
                args: ['attr.aria-selected']
            }], columnGroupStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th']
            }], cosyStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--cosy']
            }], compactStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--compact']
            }], sortAscendingStyle: [{
                type: HostBinding,
                args: ['class.asc']
            }], sortDescendingStyle: [{
                type: HostBinding,
                args: ['class.desc']
            }], numberStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--number']
            }], sortableStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--sortable']
            }], selectableStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--selectable']
            }], filterableStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--filtrable']
            }], sortedStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--sorted']
            }], selectedStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-th--selected']
            }], height: [{
                type: HostBinding,
                args: ['style.height.rem']
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onPinterEnter: [{
                type: HostListener,
                args: ['pointerenter']
            }], onPointerLeave: [{
                type: HostListener,
                args: ['pointerleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2hlYWRlcnMvZ3JpZC1oZWFkZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2hlYWRlcnMvZ3JpZC1oZWFkZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILHVCQUF1QixFQUV2QixTQUFTLEVBR1QsV0FBVyxFQUNYLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLFdBQVcsRUFDWCxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFckUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQXdCLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXBELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDOzs7Ozs7QUFFMUU7O0dBRUc7QUFNSCxNQUFNLE9BQU8sc0JBQXNCO0lBeUovQixZQUNrQyxJQUFjLEVBQ3JDLGtCQUE0QyxFQUM1QyxHQUFzQixFQUNyQixHQUE0QjtRQUhOLFNBQUksR0FBSixJQUFJLENBQVU7UUFDckMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUEwQjtRQUM1QyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNyQixRQUFHLEdBQUgsR0FBRyxDQUF5QjtRQVBqQyxrQkFBYSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQztRQUNyQyxjQUFTLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztJ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Z0JBTS9CLGVBQWU7c0JBRHpCLFdBQVc7dUJBQUMsK0JBQStCO2dCQU1qQyxlQUFlO3NCQUR6QixXQUFXO3VCQUFDLDhCQUE4QjtnQkFNaEMsV0FBVztzQkFEckIsV0FBVzt1QkFBQywyQkFBMkI7Z0JBTTdCLGFBQWE7c0JBRHZCLFdBQVc7dUJBQUMsNkJBQTZCO2dCQU0vQixNQUFNO3NCQURoQixXQUFXO3VCQUFDLGtCQUFrQjtnQkFzRXhCLE9BQU87c0JBRGIsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBZ0MxQixhQUFhO3NCQURuQixZQUFZO3VCQUFDLGNBQWM7Z0JBU3JCLGNBQWM7c0JBRHBCLFlBQVk7dUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIERvQ2hlY2ssXG4gICAgRWxlbWVudFJlZixcbiAgICBIb3N0QmluZGluZyxcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE9uRGVzdHJveSxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkQ29sdW1uRGF0YVR5cGUgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7IElneENvbHVtblJlc2l6aW5nU2VydmljZSB9IGZyb20gJy4uL3Jlc2l6aW5nL3Jlc2l6aW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSwgR3JpZFR5cGUsIElHWF9HUklEX0JBU0UgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgR3JpZFNlbGVjdGlvbk1vZGUgfSBmcm9tICcuLi9jb21tb24vZW51bXMnO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHkgfSBmcm9tICcuLi8uLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IFNvcnRpbmdEaXJlY3Rpb24gfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5AQ29tcG9uZW50KHtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBzZWxlY3RvcjogJ2lneC1ncmlkLWhlYWRlcicsXG4gICAgdGVtcGxhdGVVcmw6ICdncmlkLWhlYWRlci5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZEhlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjb2x1bW46IENvbHVtblR5cGU7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkZW5zaXR5OiBEaXNwbGF5RGVuc2l0eTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdkZWZhdWx0RVNGSGVhZGVySWNvblRlbXBsYXRlJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRFU0ZIZWFkZXJJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdFNvcnRIZWFkZXJJY29uVGVtcGxhdGUnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdFNvcnRIZWFkZXJJY29uVGVtcGxhdGU7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBgYXJpYS1zZWxlY3RlZGAgb2YgdGhlIGhlYWRlci5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1zZWxlY3RlZCcpXG4gICAgcHVibGljIGdldCBhcmlhU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5zZWxlY3RlZDtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkLXRoJylcbiAgICBwdWJsaWMgZ2V0IGNvbHVtbkdyb3VwU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jb2x1bW4uY29sdW1uR3JvdXA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGgtLWNvc3knKVxuICAgIHB1YmxpYyBnZXQgY29zeVN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZW5zaXR5ID09PSAnY29zeSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGgtLWNvbXBhY3QnKVxuICAgIHB1YmxpYyBnZXQgY29tcGFjdFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZW5zaXR5ID09PSAnY29tcGFjdCc7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hc2MnKVxuICAgIHB1YmxpYyBnZXQgc29ydEFzY2VuZGluZ1N0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0RGlyZWN0aW9uID09PSBTb3J0aW5nRGlyZWN0aW9uLkFzYztcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRlc2MnKVxuICAgIHB1YmxpYyBnZXQgc29ydERlc2NlbmRpbmdTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ydERpcmVjdGlvbiA9PT0gU29ydGluZ0RpcmVjdGlvbi5EZXNjO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGgtLW51bWJlcicpXG4gICAgcHVibGljIGdldCBudW1iZXJTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmRhdGFUeXBlID09PSBHcmlkQ29sdW1uRGF0YVR5cGUuTnVtYmVyO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGgtLXNvcnRhYmxlJylcbiAgICBwdWJsaWMgZ2V0IHNvcnRhYmxlU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5zb3J0YWJsZTtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkLXRoLS1zZWxlY3RhYmxlJylcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGFibGVTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0YWJsZTtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkLXRoLS1maWx0cmFibGUnKVxuICAgIHB1YmxpYyBnZXQgZmlsdGVyYWJsZVN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uZmlsdGVyYWJsZSAmJiB0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5pc0ZpbHRlclJvd1Zpc2libGU7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZC10aC0tc29ydGVkJylcbiAgICBwdWJsaWMgZ2V0IHNvcnRlZFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0ZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZC10aC0tc2VsZWN0ZWQnKVxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQucmVtJylcbiAgICBwdWJsaWMgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdyaWQuaGFzQ29sdW1uR3JvdXBzIHx8IHRoaXMuZ3JpZC5pc1Bpdm90KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodGhpcy5ncmlkLm1heExldmVsSGVhZGVyRGVwdGggKyAxIC0gdGhpcy5jb2x1bW4ubGV2ZWwpICogdGhpcy5ncmlkLmRlZmF1bHRSb3dIZWlnaHQgLyB0aGlzLmdyaWQuX2Jhc2VGb250U2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBlc2ZJY29uVGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQuZXhjZWxTdHlsZUhlYWRlckljb25UZW1wbGF0ZSB8fCB0aGlzLmRlZmF1bHRFU0ZIZWFkZXJJY29uVGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc29ydEljb25UZW1wbGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ydERpcmVjdGlvbiA9PT0gU29ydGluZ0RpcmVjdGlvbi5Ob25lICYmIHRoaXMuZ3JpZC5zb3J0SGVhZGVySWNvblRlbXBsYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnNvcnRIZWFkZXJJY29uVGVtcGxhdGU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zb3J0RGlyZWN0aW9uID09PSBTb3J0aW5nRGlyZWN0aW9uLkFzYyAmJiB0aGlzLmdyaWQuc29ydEFzY2VuZGluZ0hlYWRlckljb25UZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5zb3J0QXNjZW5kaW5nSGVhZGVySWNvblRlbXBsYXRlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc29ydERpcmVjdGlvbiA9PT0gU29ydGluZ0RpcmVjdGlvbi5EZXNjICYmIHRoaXMuZ3JpZC5zb3J0RGVzY2VuZGluZ0hlYWRlckljb25UZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5zb3J0RGVzY2VuZGluZ0hlYWRlckljb25UZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRTb3J0SGVhZGVySWNvblRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvcnREaXJlY3Rpb24gIT09IFNvcnRpbmdEaXJlY3Rpb24uTm9uZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGZpbHRlckljb25DbGFzc05hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgPyAnaWd4LWV4Y2VsLWZpbHRlcl9faWNvbi0tZmlsdGVyZWQnIDogJ2lneC1leGNlbC1maWx0ZXJfX2ljb24nO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2VsZWN0YWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5jb2x1bW5TZWxlY3Rpb24gIT09IEdyaWRTZWxlY3Rpb25Nb2RlLm5vbmUgJiZcbiAgICAgICAgICAgIHRoaXMuY29sdW1uLmFwcGx5U2VsZWN0YWJsZUNsYXNzICYmXG4gICAgICAgICAgICAhdGhpcy5jb2x1bW4uc2VsZWN0ZWQgJiZcbiAgICAgICAgICAgICF0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5pc0ZpbHRlclJvd1Zpc2libGU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLnNlbGVjdGVkXG4gICAgICAgICAgICAmJiAoIXRoaXMuZ3JpZC5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZSB8fCB0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5maWx0ZXJlZENvbHVtbiAhPT0gdGhpcy5jb2x1bW4pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi50aXRsZSB8fCB0aGlzLmNvbHVtbi5oZWFkZXIgfHwgdGhpcy5jb2x1bW4uZmllbGQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc29ydERpcmVjdGlvbiA9IFNvcnRpbmdEaXJlY3Rpb24uTm9uZTtcbiAgICBwcml2YXRlIF9kZXN0cm95JCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9CQVNFKSBwdWJsaWMgZ3JpZDogR3JpZFR5cGUsXG4gICAgICAgIHB1YmxpYyBjb2xSZXNpemluZ1NlcnZpY2U6IElneENvbHVtblJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByaXZhdGUgcmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PlxuICAgICkgeyB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbFJlc2l6aW5nU2VydmljZS5pc0NvbHVtblJlc2l6aW5nKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5pc0ZpbHRlclJvd1Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb2x1bW4uZmlsdGVyQ2VsbFRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5maWx0ZXJpbmdSb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbHVtbi5maWx0ZXJhYmxlICYmICF0aGlzLmNvbHVtbi5jb2x1bW5Hcm91cCAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5ncmlkLmZpbHRlcmluZ1NlcnZpY2UuaXNGaWx0ZXJDb21wbGV4KHRoaXMuY29sdW1uLmZpZWxkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5maWx0ZXJlZENvbHVtbiA9IHRoaXMuY29sdW1uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkLmNvbHVtblNlbGVjdGlvbiAhPT0gR3JpZFNlbGVjdGlvbk1vZGUubm9uZSAmJiB0aGlzLmNvbHVtbi5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSB0aGlzLmdyaWQuY29sdW1uU2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5zaW5nbGUgfHwgIWV2ZW50LmN0cmxLZXk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZ2VTZWxlY3Rpb24gPSB0aGlzLmdyaWQuY29sdW1uU2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZSAmJiBldmVudC5zaGlmdEtleTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb2x1bW4uc2VsZWN0ZWQgfHwgKHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmdldFNlbGVjdGVkQ29sdW1ucygpLmxlbmd0aCA+IDEgJiYgY2xlYXJTZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdENvbHVtbih0aGlzLmNvbHVtbi5maWVsZCwgY2xlYXJTZWxlY3Rpb24sIHJhbmdlU2VsZWN0aW9uLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdGlvblNlcnZpY2UuZGVzZWxlY3RDb2x1bW4odGhpcy5jb2x1bW4uZmllbGQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmlkLnRoZWFkUm93Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcigncG9pbnRlcmVudGVyJylcbiAgICBwdWJsaWMgb25QaW50ZXJFbnRlcigpIHtcbiAgICAgICAgdGhpcy5jb2x1bW4uYXBwbHlTZWxlY3RhYmxlQ2xhc3MgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdwb2ludGVybGVhdmUnKVxuICAgIHB1YmxpYyBvblBvaW50ZXJMZWF2ZSgpIHtcbiAgICAgICAgdGhpcy5jb2x1bW4uYXBwbHlTZWxlY3RhYmxlQ2xhc3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdEb0NoZWNrKCkge1xuICAgICAgICB0aGlzLmdldFNvcnREaXJlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9kZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLl9kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuXG4gICAgcHVibGljIG9uRmlsdGVyaW5nSWNvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS50b2dnbGVGaWx0ZXJEcm9wZG93bih0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY29sdW1uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Tb3J0aW5nSWNvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnRyaWdnZXJTb3J0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFNvcnREaXJlY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLmdyaWQuc29ydGluZ0V4cHJlc3Npb25zLmZpbmQoKHgpID0+IHguZmllbGROYW1lID09PSB0aGlzLmNvbHVtbi5maWVsZCk7XG4gICAgICAgIHRoaXMuc29ydERpcmVjdGlvbiA9IGV4cHIgPyBleHByLmRpciA6IFNvcnRpbmdEaXJlY3Rpb24uTm9uZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyaWdnZXJTb3J0KCkge1xuICAgICAgICBjb25zdCBncm91cGluZ0V4cHIgPSB0aGlzLmdyaWQuZ3JvdXBpbmdFeHByZXNzaW9ucyA/XG4gICAgICAgICAgICB0aGlzLmdyaWQuZ3JvdXBpbmdFeHByZXNzaW9ucy5maW5kKChleHByKSA9PiBleHByLmZpZWxkTmFtZSA9PT0gdGhpcy5jb2x1bW4uZmllbGQpIDpcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5ncm91cEFyZWE/LmV4cHJlc3Npb25zID8gdGhpcy5ncmlkLmdyb3VwQXJlYT8uZXhwcmVzc2lvbnMuZmluZCgoZXhwcikgPT4gZXhwci5maWVsZE5hbWUgPT09IHRoaXMuY29sdW1uLmZpZWxkKSA6IG51bGw7XG4gICAgICAgIGNvbnN0IHNvcnREaXIgPSBncm91cGluZ0V4cHIgP1xuICAgICAgICAgICAgdGhpcy5zb3J0RGlyZWN0aW9uICsgMSA+IFNvcnRpbmdEaXJlY3Rpb24uRGVzYyA/IFNvcnRpbmdEaXJlY3Rpb24uQXNjIDogU29ydGluZ0RpcmVjdGlvbi5EZXNjXG4gICAgICAgICAgICA6IHRoaXMuc29ydERpcmVjdGlvbiArIDEgPiBTb3J0aW5nRGlyZWN0aW9uLkRlc2MgPyBTb3J0aW5nRGlyZWN0aW9uLk5vbmUgOiB0aGlzLnNvcnREaXJlY3Rpb24gKyAxO1xuICAgICAgICB0aGlzLnNvcnREaXJlY3Rpb24gPSBzb3J0RGlyO1xuICAgICAgICB0aGlzLmdyaWQuc29ydCh7XG4gICAgICAgICAgICBmaWVsZE5hbWU6IHRoaXMuY29sdW1uLmZpZWxkLCBkaXI6IHRoaXMuc29ydERpcmVjdGlvbiwgaWdub3JlQ2FzZTogdGhpcy5jb2x1bW4uc29ydGluZ0lnbm9yZUNhc2UsXG4gICAgICAgICAgICBzdHJhdGVneTogdGhpcy5jb2x1bW4uc29ydFN0cmF0ZWd5XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZSAjZGVmYXVsdENvbHVtbj5cbiAgICA8c3BhbiBbdGl0bGVdPVwidGl0bGVcIj57eyBjb2x1bW4uaGVhZGVyIHx8IGNvbHVtbi5maWVsZCB9fTwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEVTRkhlYWRlckljb25UZW1wbGF0ZT5cbiAgICA8aWd4LWljb24+bW9yZV92ZXJ0PC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdFNvcnRIZWFkZXJJY29uVGVtcGxhdGU+XG4gICAgPGlneC1pY29uPnt7IHNvcnREaXJlY3Rpb24gPCAyID8gJ2Fycm93X3Vwd2FyZCcgOiAnYXJyb3dfZG93bndhcmQnIH19PC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxzcGFuIGNsYXNzPVwiaWd4LWdyaWQtdGhfX3RpdGxlXCI+XG4gICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cImNvbHVtbi5oZWFkZXJUZW1wbGF0ZSA/IGNvbHVtbi5oZWFkZXJUZW1wbGF0ZSA6IGRlZmF1bHRDb2x1bW47IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBjb2x1bW4sIGNvbHVtbjogY29sdW1ufVwiPlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9zcGFuPlxuPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFjb2x1bW4uY29sdW1uR3JvdXBcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWQtdGhfX2ljb25zXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uc29ydGFibGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzb3J0LWljb25cIiBbYXR0ci5kYXRhLXNvcnRJbmRleF09XCJjb2x1bW4uZmllbGQgfCBzb3J0aW5nSW5kZXg6Z3JpZC5zb3J0aW5nRXhwcmVzc2lvbnNcIlxuICAgICAgICAgICAgICAgIFthdHRyLmRyYWdnYWJsZV09XCJmYWxzZVwiIChjbGljayk9XCJvblNvcnRpbmdJY29uQ2xpY2soJGV2ZW50KVwiIChwb2ludGVyZG93bik9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic29ydEljb25UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6ICB0aGlzIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImdyaWQuYWxsb3dGaWx0ZXJpbmcgJiYgY29sdW1uLmZpbHRlcmFibGUgJiYgZ3JpZC5maWx0ZXJNb2RlID09PSAnZXhjZWxTdHlsZUZpbHRlcidcIj5cbiAgICAgICAgICAgIDxkaXYgW25nQ2xhc3NdPVwiZmlsdGVySWNvbkNsYXNzTmFtZVwiIChjbGljayk9XCJvbkZpbHRlcmluZ0ljb25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAocG9pbnRlcmRvd24pPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVzZkljb25UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6ICB0aGlzIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbjwvbmctY29udGFpbmVyPiJdfQ==