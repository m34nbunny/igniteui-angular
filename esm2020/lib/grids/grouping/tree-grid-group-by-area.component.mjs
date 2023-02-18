import { Component, Input, } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IgxGroupByAreaDirective } from './group-by-area.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../core/utils";
import * as i2 from "../../chips/chips-area.component";
import * as i3 from "../../chips/chip.component";
import * as i4 from "../../icon/icon.component";
import * as i5 from "@angular/common";
import * as i6 from "../../directives/suffix/suffix.directive";
import * as i7 from "../grid/grid.directives";
import * as i8 from "../../directives/drag-drop/drag-drop.directive";
import * as i9 from "./group-by-area.directive";
/**
 * An internal component representing the group-by drop area for the igx-grid component.
 *
 * @hidden @internal
 */
export class IgxTreeGridGroupByAreaComponent extends IgxGroupByAreaDirective {
    constructor(differs, ref, platform) {
        super(ref, platform);
        this.differs = differs;
        this._hideGroupedColumns = false;
        this.destroy$ = new Subject();
    }
    get hideGroupedColumns() {
        return this._hideGroupedColumns;
    }
    set hideGroupedColumns(value) {
        if (this.grid.columnList && this.expressions) {
            this.setColumnsVisibility(value);
        }
        this._hideGroupedColumns = value;
    }
    ngAfterContentInit() {
        if (this.grid.columnList && this.expressions) {
            this.groupingDiffer = this.differs.find(this.expressions).create();
            this.updateColumnsVisibility();
        }
        this.grid.sortingExpressionsChange.pipe(takeUntil(this.destroy$)).subscribe((sortingExpressions) => {
            if (!this.expressions || !this.expressions.length) {
                return;
            }
            let changed = false;
            sortingExpressions.forEach((sortExpr) => {
                const fieldName = sortExpr.fieldName;
                const groupingExpr = this.expressions.find(ex => ex.fieldName === fieldName);
                if (groupingExpr && groupingExpr.dir !== sortExpr.dir) {
                    groupingExpr.dir = sortExpr.dir;
                    changed = true;
                }
            });
            if (changed) {
                this.expressions = [...this.expressions];
            }
        });
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    handleReorder(event) {
        const { chipsArray, originalEvent } = event;
        const newExpressions = this.getReorderedExpressions(chipsArray);
        this.chipExpressions = newExpressions;
        // When reordered using keyboard navigation, we don't have `onMoveEnd` event.
        if (originalEvent instanceof KeyboardEvent) {
            this.expressions = newExpressions;
        }
    }
    handleMoveEnd() {
        this.expressions = this.chipExpressions;
    }
    groupBy(expression) {
        this.expressions.push(expression);
        this.expressions = [...this.expressions];
    }
    clearGrouping(name) {
        this.expressions = this.expressions.filter(item => item.fieldName !== name);
        this.grid.sortingExpressions = this.grid.sortingExpressions.filter(item => item.fieldName !== name);
        this.grid.notifyChanges(true);
    }
    expressionsChanged() {
        this.updateSortingExpressions();
        this.updateColumnsVisibility();
    }
    updateSortingExpressions() {
        const sortingExpressions = this.grid.sortingExpressions;
        let changed = false;
        this.expressions.forEach((expr, index) => {
            const sortingIndex = sortingExpressions.findIndex(s => s.fieldName === expr.fieldName);
            if (sortingIndex > -1) {
                if (sortingIndex !== index) {
                    const sortExpr = sortingExpressions.splice(sortingIndex, 1)[0];
                    sortExpr.dir = expr.dir;
                    sortingExpressions.splice(index, 0, sortExpr);
                    changed = true;
                }
                else if (sortingExpressions[sortingIndex].dir !== expr.dir) {
                    sortingExpressions[sortingIndex].dir = expr.dir;
                    changed = true;
                }
            }
            else {
                const exprCopy = { ...expr };
                sortingExpressions.splice(index, 0, exprCopy);
                changed = true;
            }
        });
        if (changed) {
            this.grid.sortingExpressions = [...sortingExpressions];
        }
    }
    updateColumnsVisibility() {
        if (this.groupingDiffer && this.grid.columnList && !this.grid.hasColumnLayouts) {
            const changes = this.groupingDiffer.diff(this.expressions);
            if (changes && this.grid.columnList.length > 0) {
                changes.forEachAddedItem((rec) => {
                    const col = this.grid.getColumnByName(rec.item.fieldName);
                    col.hidden = this.hideGroupedColumns;
                });
                changes.forEachRemovedItem((rec) => {
                    const col = this.grid.getColumnByName(rec.item.fieldName);
                    col.hidden = false;
                });
            }
        }
    }
    setColumnsVisibility(value) {
        if (this.grid.columnList.length > 0 && !this.grid.hasColumnLayouts) {
            this.expressions.forEach((expr) => {
                const col = this.grid.getColumnByName(expr.fieldName);
                col.hidden = value;
            });
        }
    }
}
IgxTreeGridGroupByAreaComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridGroupByAreaComponent, deps: [{ token: i0.IterableDiffers }, { token: i0.ElementRef }, { token: i1.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxTreeGridGroupByAreaComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeGridGroupByAreaComponent, selector: "igx-tree-grid-group-by-area", inputs: { hideGroupedColumns: "hideGroupedColumns" }, providers: [{ provide: IgxGroupByAreaDirective, useExisting: IgxTreeGridGroupByAreaComponent }], usesInheritance: true, ngImport: i0, template: "<igx-chips-area (reorder)=\"handleReorder($event)\" (moveEnd)=\"handleMoveEnd()\">\n    <ng-container *ngFor=\"let expression of chipExpressions; let last = last;\">\n        <igx-chip\n            [id]=\"expression.fieldName\"\n            [title]=\"(expression.fieldName | igxGroupByMeta:grid).title\"\n            [displayDensity]=\"grid.displayDensity\"\n            [removable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [draggable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [disabled]=\"!(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            (keyDown)=\"handleKeyDown($event.owner.id, $event.originalEvent)\"\n            (remove)=\"clearGrouping($event.owner.id)\"\n            (chipClick)=\"handleClick(expression.fieldName)\"\n        >\n            <span>{{ (expression.fieldName | igxGroupByMeta:grid).title }}</span>\n            <igx-icon igxSuffix>{{ expression.dir === 1 ? 'arrow_upward' : 'arrow_downward' }}</igx-icon>\n        </igx-chip>\n\n        <span class=\"igx-grid-grouparea__connector\">\n            <igx-icon [hidden]=\"(last && !dropAreaVisible)\">arrow_forward</igx-icon>\n        </span>\n    </ng-container>\n    <div igxGroupAreaDrop class=\"igx-drop-area{{ density !== 'comfortable' ? '--' + density : ''}}\"\n        [attr.gridId]=\"grid.id\"\n        [hidden]=\"!dropAreaVisible\"\n        (igxDrop)=\"onDragDrop($event)\"\n    >\n        <ng-container *ngTemplateOutlet=\"dropAreaTemplate || default\"></ng-container>\n    </div>\n</igx-chips-area>\n\n<ng-template #default>\n    <igx-icon class=\"igx-drop-area__icon\">group_work</igx-icon>\n    <span class=\"igx-drop-area__text\">{{ dropAreaMessage }}</span>\n</ng-template>\n", components: [{ type: i2.IgxChipsAreaComponent, selector: "igx-chips-area", inputs: ["class", "width", "height"], outputs: ["reorder", "selectionChange", "moveStart", "moveEnd"] }, { type: i3.IgxChipComponent, selector: "igx-chip", inputs: ["id", "tabIndex", "data", "draggable", "animateOnRelease", "hideBaseOnDrag", "removable", "removeIcon", "selectable", "selectIcon", "class", "disabled", "selected", "color", "resourceStrings"], outputs: ["selectedChange", "moveStart", "moveEnd", "remove", "chipClick", "selectedChanging", "selectedChanged", "keyDown", "dragEnter", "dragLeave", "dragOver", "dragDrop"] }, { type: i4.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i6.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i7.IgxGroupAreaDropDirective, selector: "[igxGroupAreaDrop]" }, { type: i8.IgxDropDirective, selector: "[igxDrop]", inputs: ["igxDrop", "dropChannel", "dropStrategy"], outputs: ["enter", "over", "leave", "dropped"], exportAs: ["drop"] }, { type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "igxGroupByMeta": i9.IgxGroupByMetaPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridGroupByAreaComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-tree-grid-group-by-area', providers: [{ provide: IgxGroupByAreaDirective, useExisting: IgxTreeGridGroupByAreaComponent }], template: "<igx-chips-area (reorder)=\"handleReorder($event)\" (moveEnd)=\"handleMoveEnd()\">\n    <ng-container *ngFor=\"let expression of chipExpressions; let last = last;\">\n        <igx-chip\n            [id]=\"expression.fieldName\"\n            [title]=\"(expression.fieldName | igxGroupByMeta:grid).title\"\n            [displayDensity]=\"grid.displayDensity\"\n            [removable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [draggable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [disabled]=\"!(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            (keyDown)=\"handleKeyDown($event.owner.id, $event.originalEvent)\"\n            (remove)=\"clearGrouping($event.owner.id)\"\n            (chipClick)=\"handleClick(expression.fieldName)\"\n        >\n            <span>{{ (expression.fieldName | igxGroupByMeta:grid).title }}</span>\n            <igx-icon igxSuffix>{{ expression.dir === 1 ? 'arrow_upward' : 'arrow_downward' }}</igx-icon>\n        </igx-chip>\n\n        <span class=\"igx-grid-grouparea__connector\">\n            <igx-icon [hidden]=\"(last && !dropAreaVisible)\">arrow_forward</igx-icon>\n        </span>\n    </ng-container>\n    <div igxGroupAreaDrop class=\"igx-drop-area{{ density !== 'comfortable' ? '--' + density : ''}}\"\n        [attr.gridId]=\"grid.id\"\n        [hidden]=\"!dropAreaVisible\"\n        (igxDrop)=\"onDragDrop($event)\"\n    >\n        <ng-container *ngTemplateOutlet=\"dropAreaTemplate || default\"></ng-container>\n    </div>\n</igx-chips-area>\n\n<ng-template #default>\n    <igx-icon class=\"igx-drop-area__icon\">group_work</igx-icon>\n    <span class=\"igx-drop-area__text\">{{ dropAreaMessage }}</span>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.IterableDiffers }, { type: i0.ElementRef }, { type: i1.PlatformUtil }]; }, propDecorators: { hideGroupedColumns: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ncmlkLWdyb3VwLWJ5LWFyZWEuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2dyb3VwaW5nL3RyZWUtZ3JpZC1ncm91cC1ieS1hcmVhLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9ncm91cGluZy9ncm91cC1ieS1hcmVhLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCxTQUFTLEVBRVQsS0FBSyxHQUlSLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7Ozs7OztBQUVwRTs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLCtCQUFnQyxTQUFRLHVCQUF1QjtJQWtCeEUsWUFBb0IsT0FBd0IsRUFBRSxHQUE0QixFQUFFLFFBQXNCO1FBQzlGLEtBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFETCxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUpwQyx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFFNUIsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7SUFJdEMsQ0FBQztJQW5CRCxJQUNXLGtCQUFrQjtRQUN6QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBVyxrQkFBa0IsQ0FBQyxLQUFjO1FBQ3hDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUMxQyxJQUFJLENBQUMs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QUFTLENBQUMsQ0FBQztvQkFDMUQsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxLQUFLO1FBQzlCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0RCxHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQzs7NEhBNUlRLCtCQUErQjtnSEFBL0IsK0JBQStCLDRHQUY3QixDQUFDLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFdBQVcsRUFBRSwrQkFBK0IsRUFBRSxDQUFDLGlEQ3pCbkcsZ3REQWtDQTsyRkRQYSwrQkFBK0I7a0JBTDNDLFNBQVM7K0JBQ0ksNkJBQTZCLGFBRTVCLENBQUMsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxpQ0FBaUMsRUFBRSxDQUFDOzBKQUlwRixrQkFBa0I7c0JBRDVCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSW5wdXQsXG4gICAgSXRlcmFibGVEaWZmZXIsXG4gICAgSXRlcmFibGVEaWZmZXJzLFxuICAgIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJQ2hpcHNBcmVhUmVvcmRlckV2ZW50QXJncyB9IGZyb20gJy4uLy4uL2NoaXBzL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJR3JvdXBpbmdFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2dyb3VwaW5nLWV4cHJlc3Npb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IElTb3J0aW5nRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9zb3J0aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IElneEdyb3VwQnlBcmVhRGlyZWN0aXZlIH0gZnJvbSAnLi9ncm91cC1ieS1hcmVhLmRpcmVjdGl2ZSc7XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHJlcHJlc2VudGluZyB0aGUgZ3JvdXAtYnkgZHJvcCBhcmVhIGZvciB0aGUgaWd4LWdyaWQgY29tcG9uZW50LlxuICpcbiAqIEBoaWRkZW4gQGludGVybmFsXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LXRyZWUtZ3JpZC1ncm91cC1ieS1hcmVhJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2dyb3VwLWJ5LWFyZWEuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogSWd4R3JvdXBCeUFyZWFEaXJlY3RpdmUsIHVzZUV4aXN0aW5nOiBJZ3hUcmVlR3JpZEdyb3VwQnlBcmVhQ29tcG9uZW50IH1dXG59KVxuZXhwb3J0IGNsYXNzIElneFRyZWVHcmlkR3JvdXBCeUFyZWFDb21wb25lbnQgZXh0ZW5kcyBJZ3hHcm91cEJ5QXJlYURpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGhpZGVHcm91cGVkQ29sdW1ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hpZGVHcm91cGVkQ29sdW1ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGhpZGVHcm91cGVkQ29sdW1ucyh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAodGhpcy5ncmlkLmNvbHVtbkxpc3QgJiYgdGhpcy5leHByZXNzaW9ucykge1xuICAgICAgICAgICAgdGhpcy5zZXRDb2x1bW5zVmlzaWJpbGl0eSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oaWRlR3JvdXBlZENvbHVtbnMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oaWRlR3JvdXBlZENvbHVtbnMgPSBmYWxzZTtcbiAgICBwcml2YXRlIGdyb3VwaW5nRGlmZmVyOiBJdGVyYWJsZURpZmZlcjxJR3JvdXBpbmdFeHByZXNzaW9uPjtcbiAgICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsIHJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwpIHtcbiAgICAgICAgc3VwZXIocmVmLCBwbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5jb2x1bW5MaXN0ICYmIHRoaXMuZXhwcmVzc2lvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBpbmdEaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmV4cHJlc3Npb25zKS5jcmVhdGUoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sdW1uc1Zpc2liaWxpdHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnNDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoc29ydGluZ0V4cHJlc3Npb25zOiBJU29ydGluZ0V4cHJlc3Npb25bXSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmV4cHJlc3Npb25zIHx8ICF0aGlzLmV4cHJlc3Npb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgc29ydGluZ0V4cHJlc3Npb25zLmZvckVhY2goKHNvcnRFeHByOiBJU29ydGluZ0V4cHJlc3Npb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSBzb3J0RXhwci5maWVsZE5hbWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBpbmdFeHByID0gdGhpcy5leHByZXNzaW9ucy5maW5kKGV4ID0+IGV4LmZpZWxkTmFtZSA9PT0gZmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBpbmdFeHByICYmIGdyb3VwaW5nRXhwci5kaXIgIT09IHNvcnRFeHByLmRpcikge1xuICAgICAgICAgICAgICAgICAgICBncm91cGluZ0V4cHIuZGlyID0gc29ydEV4cHIuZGlyO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0gWy4uLnRoaXMuZXhwcmVzc2lvbnNdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVSZW9yZGVyKGV2ZW50OiBJQ2hpcHNBcmVhUmVvcmRlckV2ZW50QXJncykge1xuICAgICAgICBjb25zdCB7IGNoaXBzQXJyYXksIG9yaWdpbmFsRXZlbnQgfSA9IGV2ZW50O1xuICAgICAgICBjb25zdCBuZXdFeHByZXNzaW9ucyA9IHRoaXMuZ2V0UmVvcmRlcmVkRXhwcmVzc2lvbnMoY2hpcHNBcnJheSk7XG5cbiAgICAgICAgdGhpcy5jaGlwRXhwcmVzc2lvbnMgPSBuZXdFeHByZXNzaW9ucztcblxuICAgICAgICAvLyBXaGVuIHJlb3JkZXJlZCB1c2luZyBrZXlib2FyZCBuYXZpZ2F0aW9uLCB3ZSBkb24ndCBoYXZlIGBvbk1vdmVFbmRgIGV2ZW50LlxuICAgICAgICBpZiAob3JpZ2luYWxFdmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbnMgPSBuZXdFeHByZXNzaW9ucztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVNb3ZlRW5kKCkge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0gdGhpcy5jaGlwRXhwcmVzc2lvbnM7XG4gICAgfVxuXG4gICAgcHVibGljIGdyb3VwQnkoZXhwcmVzc2lvbjogSUdyb3VwaW5nRXhwcmVzc2lvbikge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbnMgPSBbLi4udGhpcy5leHByZXNzaW9uc107XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyR3JvdXBpbmcobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbnMgPSB0aGlzLmV4cHJlc3Npb25zLmZpbHRlcihpdGVtID0+IGl0ZW0uZmllbGROYW1lICE9PSBuYW1lKTtcbiAgICAgICAgdGhpcy5ncmlkLnNvcnRpbmdFeHByZXNzaW9ucyA9IHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5maWVsZE5hbWUgIT09IG5hbWUpO1xuICAgICAgICB0aGlzLmdyaWQubm90aWZ5Q2hhbmdlcyh0cnVlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZXhwcmVzc2lvbnNDaGFuZ2VkKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNvcnRpbmdFeHByZXNzaW9ucygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbHVtbnNWaXNpYmlsaXR5KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTb3J0aW5nRXhwcmVzc2lvbnMoKSB7XG4gICAgICAgIGNvbnN0IHNvcnRpbmdFeHByZXNzaW9ucyA9IHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnM7XG4gICAgICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5leHByZXNzaW9ucy5mb3JFYWNoKChleHByLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc29ydGluZ0luZGV4ID0gc29ydGluZ0V4cHJlc3Npb25zLmZpbmRJbmRleChzID0+IHMuZmllbGROYW1lID09PSBleHByLmZpZWxkTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChzb3J0aW5nSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3J0aW5nSW5kZXggIT09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvcnRFeHByID0gc29ydGluZ0V4cHJlc3Npb25zLnNwbGljZShzb3J0aW5nSW5kZXgsIDEpWzBdO1xuICAgICAgICAgICAgICAgICAgICBzb3J0RXhwci5kaXIgPSBleHByLmRpcjtcbiAgICAgICAgICAgICAgICAgICAgc29ydGluZ0V4cHJlc3Npb25zLnNwbGljZShpbmRleCwgMCwgc29ydEV4cHIpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNvcnRpbmdFeHByZXNzaW9uc1tzb3J0aW5nSW5kZXhdLmRpciAhPT0gZXhwci5kaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydGluZ0V4cHJlc3Npb25zW3NvcnRpbmdJbmRleF0uZGlyID0gZXhwci5kaXI7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwckNvcHkgPSB7IC4uLmV4cHIgfTtcbiAgICAgICAgICAgICAgICBzb3J0aW5nRXhwcmVzc2lvbnMuc3BsaWNlKGluZGV4LCAwLCBleHByQ29weSk7XG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMgPSBbLi4uc29ydGluZ0V4cHJlc3Npb25zXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQ29sdW1uc1Zpc2liaWxpdHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmdyb3VwaW5nRGlmZmVyICYmIHRoaXMuZ3JpZC5jb2x1bW5MaXN0ICYmICF0aGlzLmdyaWQuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuZ3JvdXBpbmdEaWZmZXIuZGlmZih0aGlzLmV4cHJlc3Npb25zKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VzICYmIHRoaXMuZ3JpZC5jb2x1bW5MaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzLmZvckVhY2hBZGRlZEl0ZW0oKHJlYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmdyaWQuZ2V0Q29sdW1uQnlOYW1lKHJlYy5pdGVtLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5oaWRkZW4gPSB0aGlzLmhpZGVHcm91cGVkQ29sdW1ucztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgocmVjKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuZ3JpZC5nZXRDb2x1bW5CeU5hbWUocmVjLml0ZW0uZmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgY29sLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDb2x1bW5zVmlzaWJpbGl0eSh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5ncmlkLmNvbHVtbkxpc3QubGVuZ3RoID4gMCAmJiAhdGhpcy5ncmlkLmhhc0NvbHVtbkxheW91dHMpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbnMuZm9yRWFjaCgoZXhwcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuZ3JpZC5nZXRDb2x1bW5CeU5hbWUoZXhwci5maWVsZE5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbC5oaWRkZW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4iLCI8aWd4LWNoaXBzLWFyZWEgKHJlb3JkZXIpPVwiaGFuZGxlUmVvcmRlcigkZXZlbnQpXCIgKG1vdmVFbmQpPVwiaGFuZGxlTW92ZUVuZCgpXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgZXhwcmVzc2lvbiBvZiBjaGlwRXhwcmVzc2lvbnM7IGxldCBsYXN0ID0gbGFzdDtcIj5cbiAgICAgICAgPGlneC1jaGlwXG4gICAgICAgICAgICBbaWRdPVwiZXhwcmVzc2lvbi5maWVsZE5hbWVcIlxuICAgICAgICAgICAgW3RpdGxlXT1cIihleHByZXNzaW9uLmZpZWxkTmFtZSB8IGlneEdyb3VwQnlNZXRhOmdyaWQpLnRpdGxlXCJcbiAgICAgICAgICAgIFtkaXNwbGF5RGVuc2l0eV09XCJncmlkLmRpc3BsYXlEZW5zaXR5XCJcbiAgICAgICAgICAgIFtyZW1vdmFibGVdPVwiKGV4cHJlc3Npb24uZmllbGROYW1lIHwgaWd4R3JvdXBCeU1ldGE6Z3JpZCkuZ3JvdXBhYmxlXCJcbiAgICAgICAgICAgIFtkcmFnZ2FibGVdPVwiKGV4cHJlc3Npb24uZmllbGROYW1lIHwgaWd4R3JvdXBCeU1ldGE6Z3JpZCkuZ3JvdXBhYmxlXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCIhKGV4cHJlc3Npb24uZmllbGROYW1lIHwgaWd4R3JvdXBCeU1ldGE6Z3JpZCkuZ3JvdXBhYmxlXCJcbiAgICAgICAgICAgIChrZXlEb3duKT1cImhhbmRsZUtleURvd24oJGV2ZW50Lm93bmVyLmlkLCAkZXZlbnQub3JpZ2luYWxFdmVudClcIlxuICAgICAgICAgICAgKHJlbW92ZSk9XCJjbGVhckdyb3VwaW5nKCRldmVudC5vd25lci5pZClcIlxuICAgICAgICAgICAgKGNoaXBDbGljayk9XCJoYW5kbGVDbGljayhleHByZXNzaW9uLmZpZWxkTmFtZSlcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8c3Bhbj57eyAoZXhwcmVzc2lvbi5maWVsZE5hbWUgfCBpZ3hHcm91cEJ5TWV0YTpncmlkKS50aXRsZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxpZ3gtaWNvbiBpZ3hTdWZmaXg+e3sgZXhwcmVzc2lvbi5kaXIgPT09IDEgPyAnYXJyb3dfdXB3YXJkJyA6ICdhcnJvd19kb3dud2FyZCcgfX08L2lneC1pY29uPlxuICAgICAgICA8L2lneC1jaGlwPlxuXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaWd4LWdyaWQtZ3JvdXBhcmVhX19jb25uZWN0b3JcIj5cbiAgICAgICAgICAgIDxpZ3gtaWNvbiBbaGlkZGVuXT1cIihsYXN0ICYmICFkcm9wQXJlYVZpc2libGUpXCI+YXJyb3dfZm9yd2FyZDwvaWd4LWljb24+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8ZGl2IGlneEdyb3VwQXJlYURyb3AgY2xhc3M9XCJpZ3gtZHJvcC1hcmVhe3sgZGVuc2l0eSAhPT0gJ2NvbWZvcnRhYmxlJyA/ICctLScgKyBkZW5zaXR5IDogJyd9fVwiXG4gICAgICAgIFthdHRyLmdyaWRJZF09XCJncmlkLmlkXCJcbiAgICAgICAgW2hpZGRlbl09XCIhZHJvcEFyZWFWaXNpYmxlXCJcbiAgICAgICAgKGlneERyb3ApPVwib25EcmFnRHJvcCgkZXZlbnQpXCJcbiAgICA+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJkcm9wQXJlYVRlbXBsYXRlIHx8IGRlZmF1bHRcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbjwvaWd4LWNoaXBzLWFyZWE+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdD5cbiAgICA8aWd4LWljb24gY2xhc3M9XCJpZ3gtZHJvcC1hcmVhX19pY29uXCI+Z3JvdXBfd29yazwvaWd4LWljb24+XG4gICAgPHNwYW4gY2xhc3M9XCJpZ3gtZHJvcC1hcmVhX190ZXh0XCI+e3sgZHJvcEFyZWFNZXNzYWdlIH19PC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==