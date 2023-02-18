import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, HostListener, Inject, Input, ViewChild, ViewChildren } from '@angular/core';
import { IgxGridHeaderComponent } from './grid-header.component';
import { IgxGridFilteringCellComponent } from '../filtering/base/grid-filtering-cell.component';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { GridSelectionMode } from '../common/enums';
import * as i0 from "@angular/core";
import * as i1 from "../resizing/resizing.service";
import * as i2 from "../filtering/grid-filtering.service";
import * as i3 from "../../core/utils";
import * as i4 from "../../icon/icon.component";
import * as i5 from "./grid-header.component";
import * as i6 from "../filtering/base/grid-filtering-cell.component";
import * as i7 from "@angular/common";
import * as i8 from "../moving/moving.drag.directive";
import * as i9 from "../moving/moving.drop.directive";
import * as i10 from "../resizing/resize-handle.directive";
import * as i11 from "./pipes";
const Z_INDEX = 9999;
/**
 * @hidden
 */
export class IgxGridHeaderGroupComponent {
    constructor(cdr, grid, ref, colResizingService, filteringService, platform) {
        this.cdr = cdr;
        this.grid = grid;
        this.ref = ref;
        this.colResizingService = colResizingService;
        this.filteringService = filteringService;
        this.platform = platform;
        this.defaultCss = true;
    }
    get rowEnd() {
        return this.column.rowEnd;
    }
    get colEnd() {
        return this.column.colEnd;
    }
    get rowStart() {
        return this.column.rowStart;
    }
    get colStart() {
        return this.column.colStart;
    }
    get headerID() {
        return `${this.grid.id}_-1_${this.column.level}_${this.column.visibleIndex}`;
    }
    get active() {
        const node = this.grid.navigation.activeNode;
        return node && !this.column.columnGroup ?
            node.row === -1 && node.column === this.column.visibleIndex && node.level === this.column.level : false;
    }
    get activeGroup() {
        const node = this.grid.navigation.activeNode;
        return node ? node.row === -1 && node.column === this.column.visibleIndex && node.level === this.column.level : false;
    }
    /**
     * Gets the width of the header group.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get width() {
        return this.grid.getHeaderGroupWidth(this.column);
    }
    get pinnedCss() {
        return this.isPinned;
    }
    get pinnedLastCss() {
        return this.isLastPinned;
    }
    get pinnedFirstCSS() {
        return this.isFirstPinned;
    }
    get headerDragCss() {
        return this.isHeaderDragged;
    }
    get filteringCss() {
        return this.isFiltered;
    }
    /**
     * @hidden
     */
    get zIndex() {
        if (!this.column.pinned) {
            return null;
        }
        return Z_INDEX - this.grid.pinnedColumns.indexOf(this.column);
    }
    /**
     * Gets whether the header group belongs to a column that is filtered.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isFiltered() {
        return this.filteringService.filteredColumn === this.column;
    }
    /**
     * Gets whether the header group is stored in the last column in the pinned area.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isLastPinned() {
        return !this.grid.hasColumnLayouts ? this.column.isLastPinned : false;
    }
    /**
     * Gets whether the header group is stored in the first column of the right pinned area.
     */
    get isFirstPinned() {
        return !this.grid.hasColumnLayouts ? this.column.isFirstPinned : false;
    }
    get groupDisplayStyle() {
        return this.grid.hasColumnLayouts && this.column.children ? 'flex' : '';
    }
    /**
     * Gets whether the header group is stored in a pinned column.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isPinned() {
        return this.column.pinned;
    }
    /**
     * Gets whether the header group belongs to a column that is moved.
     *
     * @memberof IgxGridHeaderGroupComponent
     */
    get isHeaderDragged() {
        return this.grid.columnInDrag === this.column;
    }
    /**
     * @hidden
     */
    get hasLastPinnedChildColumn() {
        return this.column.allChildren.some(child => child.isLastPinned);
    }
    /**
     * @hidden
     */
    get hasFirstPinnedChildColumn() {
        return this.column.allChildren.some(child => child.isFirstPinned);
    }
    /**
     * @hidden
     */
    get selectable() {
        const selectableChildren = this.column.allChildren.filter(c => !c.hidden && c.selectable && !c.columnGroup);
        return this.grid.columnSelection !== GridSelectionMode.none &&
            this.column.applySelectableClass
            && !this.selected && selectableChildren.length > 0
            && !this.grid.filteringService.isFilterRowVisible;
    }
    /**
     * @hidden
     */
    get selected() {
        return this.column.selected;
    }
    /**
     * @hidden
     */
    get height() {
        return this.nativeElement.getBoundingClientRect().height;
    }
    /**
     * @hidden
     */
    get title() {
        return this.column.title || this.column.header;
    }
    get nativeElement() {
        return this.ref.nativeElement;
    }
    /**
     * @hidden
     */
    onMouseDown(event) {
        // hack for preventing text selection in IE and Edge while dragging the resize element
        event.preventDefault();
    }
    /**
     * @hidden
     */
    groupClicked(event) {
        const columnsToSelect = this.column.allChildren.filter(c => !c.hidden && c.selectable && !c.columnGroup).map(c => c.field);
        if (this.grid.columnSelection !== GridSelectionMode.none
            && columnsToSelect.length > 0 && !this.grid.filteringService.isFilterRowVisible) {
            const clearSelection = this.grid.columnSelection === GridSelectionMode.single || !event.ctrlKey;
            const rangeSelection = this.grid.columnSelection === GridSelectionMode.multiple && event.shiftKey;
            if (!this.selected) {
                this.grid.selectionService.selectColumns(columnsToSelect, clearSelection, rangeSelection, event);
            }
            else {
                const selectedFields = this.grid.selectionService.getSelectedColumns();
                if ((selectedFields.length === columnsToSelect.length) && selectedFields.every(el => columnsToSelect.includes(el))
                    || !clearSelection) {
                    this.grid.selectionService.deselectColumns(columnsToSelect, event);
                }
                else {
                    this.grid.selectionService.selectColumns(columnsToSelect, clearSelection, rangeSelection, event);
                }
            }
        }
    }
    /**
     * @hidden @internal
     */
    toggleExpandState(event) {
        event.stopPropagation();
        this.column.expanded = !this.column.expanded;
    }
    /**
     * @hidden @internal
     */
    pointerdown(event) {
        event.stopPropagation();
        this.activate();
        this.grid.theadRow.nativeElement.focus();
    }
    /*
     * This method is necessary due to some specifics related with implementation of column moving
     * @hidden
     */
    activate() {
        this.grid.navigation.setActiveNode(this.activeNode);
        this.grid.theadRow.nativeElement.focus();
    }
    ngDoCheck() {
        this.cdr.markForCheck();
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
    get activeNode() {
        return {
            row: -1, column: this.column.visibleIndex, level: this.column.level,
            mchCache: { level: this.column.level, visibleIndex: this.column.visibleIndex },
            layout: this.column.columnLayoutChild ? {
                rowStart: this.column.rowStart,
                colStart: this.column.colStart,
                rowEnd: this.column.rowEnd,
                colEnd: this.column.colEnd,
                columnVisibleIndex: this.column.visibleIndex
            } : null
        };
    }
}
IgxGridHeaderGroupComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridHeaderGroupComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: IGX_GRID_BASE }, { token: i0.ElementRef }, { token: i1.IgxColumnResizingService }, { token: i2.IgxFilteringService }, { token: i3.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxGridHeaderGroupComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridHeaderGroupComponent, selector: "igx-grid-header-group", inputs: { column: "column" }, host: { listeners: { "mousedown": "onMouseDown($event)" }, properties: { "style.grid-row-end": "this.rowEnd", "style.grid-column-end": "this.colEnd", "style.grid-row-start": "this.rowStart", "style.grid-column-start": "this.colStart", "attr.id": "this.headerID", "class.igx-grid-th--active": "this.active", "class.igx-grid-thead__item": "this.defaultCss", "class.igx-grid-th--pinned": "this.pinnedCss", "class.igx-grid-th--pinned-last": "this.pinnedLastCss", "class.igx-grid-th--pinned-first": "this.pinnedFirstCSS", "class.igx-grid__drag-col-header": "this.headerDragCss", "class.igx-grid-th--filtering": "this.filteringCss", "style.z-index": "this.zIndex", "style.display": "this.groupDisplayStyle" } }, viewQueries: [{ propertyName: "header", first: true, predicate: IgxGridHeaderComponent, descendants: true }, { propertyName: "filter", first: true, predicate: IgxGridFilteringCellComponent, descendants: true }, { propertyName: "children", predicate: i0.forwardRef(function () { return IgxGridHeaderGroupComponent; }), descendants: true, read: IgxGridHeaderGroupComponent }], ngImport: i0, template: "<ng-container *ngIf=\"grid.hasColumnLayouts && column.columnGroup\">\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-left\"></span>\n    <div class=\"igx-grid-thead__group igx-grid__mrl-block\"\n     [ngClass]=\"{\n         'igx-grid-th--pinned-last': hasLastPinnedChildColumn,\n         'igx-grid-th--pinned-first': hasFirstPinnedChildColumn\n        }\"\n     [ngStyle]=\"{'grid-template-rows':column.getGridTemplate(true),\n     'grid-template-columns':column.getGridTemplate(false)}\">\n        <ng-container *ngFor=\"let child of column.children\" >\n            <igx-grid-header-group *ngIf=\"!child.hidden\" class=\"igx-grid-thead__subgroup\"\n                [ngClass]=\"child.headerGroupClasses\"\n                [ngStyle]=\"child.headerGroupStyles | igxHeaderGroupStyle:child:grid.pipeTrigger\"\n                [column]=\"child\"\n                [igxColumnMovingDrag]=\"child\"\n                [ghostHost]=\"grid.outlet.nativeElement\"\n                [attr.droppable]=\"true\"\n                [igxColumnMovingDrop]=\"child\">\n            </igx-grid-header-group>\n        </ng-container>\n    </div>\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-right\"></span>\n</ng-container>\n\n\n<ng-template #defaultColumn>\n    <span class=\"igx-grid-th__group-title\" [title]=\"title\">{{column.header}}</span>\n</ng-template>\n\n<ng-template #defaultCollapseIndicator>\n    <igx-icon [attr.draggable]=\"false\" >\n            {{column.expanded ? 'expand_more' : 'chevron_right'}} </igx-icon>\n</ng-template>\n\n<ng-container *ngIf=\"!grid.hasColumnLayouts && column.columnGroup\">\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-left\"></span>\n    <div class=\"igx-grid-thead__title\"\n        role=\"columnheader\"\n        [attr.aria-label]=\"column.header || column.field\"\n        [attr.aria-expanded]=\"column.expanded\"\n        [attr.aria-selected]=\"column.selected\"\n        [ngClass]=\"{\n            'igx-grid-th--pinned-last': hasLastPinnedChildColumn,\n            'igx-grid-th--pinned-first': hasFirstPinnedChildColumn,\n            'igx-grid-th--collapsible': column.collapsible,\n            'igx-grid-th--selectable': selectable,\n            'igx-grid-th--selected': selected,\n            'igx-grid-th--active': activeGroup}\"\n        [igxColumnMovingDrag]=\"column\"\n        [ghostHost]=\"grid.outlet.nativeElement\"\n        [attr.droppable]=\"true\"\n        [igxColumnMovingDrop]=\"column\"\n        (pointerdown)=\"pointerdown($event)\"\n        (click)=\"groupClicked($event)\"\n        (pointerenter)=\"onPinterEnter()\"\n        (pointerleave)=\"onPointerLeave()\"\n        >\n        <ng-container *ngIf=\"column.collapsible\">\n            <div class=\"igx-grid-th__expander\" (click)=\"toggleExpandState($event)\">\n                <ng-container\n                    *ngTemplateOutlet=\"column.collapsibleIndicatorTemplate ? column.collapsibleIndicatorTemplate : defaultCollapseIndicator; context: {$implicit: column, column: column}\">\n                </ng-container>\n            </div>\n        </ng-container>\n        <ng-container *ngTemplateOutlet=\"column.headerTemplate ? column.headerTemplate : defaultColumn; context: { $implicit: column, column: column}\">\n        </ng-container>\n    </div>\n    <div class=\"igx-grid-thead__group\" *ngIf='!grid.isPivot'>\n        <ng-container *ngFor=\"let child of column.children\">\n            <igx-grid-header-group *ngIf=\"!child.hidden\" class=\"igx-grid-thead__subgroup\"\n                [ngClass]=\"child.headerGroupClasses\"\n                [ngStyle]=\"child.headerGroupStyles | igxHeaderGroupStyle:child:grid.pipeTrigger\"\n                [column]=\"child\"\n                [style.min-width]=\"child.calcWidth | igxHeaderGroupWidth:grid.defaultHeaderGroupMinWidth:grid.hasColumnLayouts\"\n                [style.flex-basis]=\"child.calcWidth | igxHeaderGroupWidth:grid.defaultHeaderGroupMinWidth:grid.hasColumnLayouts\">\n            </igx-grid-header-group>\n        </ng-container>\n    </div>\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-right\"></span>\n</ng-container>\n\n<ng-container *ngIf=\"!column.columnGroup\">\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-left\"></span>\n    <igx-grid-header\n        role=\"columnheader\"\n        class=\"igx-grid-th--fw\"\n        [id]=\"grid.id + '_' + column.field\"\n        [ngClass]=\"column.headerClasses\"\n        [ngStyle]=\"column.headerStyles | igxHeaderGroupStyle:column:grid.pipeTrigger\"\n        [igxColumnMovingDrag]=\"column\"\n        [ghostHost]=\"grid.outlet.nativeElement\"\n        [attr.droppable]=\"true\"\n        (pointerdown)=\"activate()\"\n        [igxColumnMovingDrop]=\"column\"\n        [column]=\"column\"\n        [density]=\"grid.displayDensity\"\n    >\n    </igx-grid-header>\n    <igx-grid-filtering-cell *ngIf=\"grid.allowFiltering && grid.filterMode === 'quickFilter'\" [column]=\"column\" [attr.draggable]=\"false\"></igx-grid-filtering-cell>\n    <span *ngIf=\"!column.columnGroup && column.resizable\" class=\"igx-grid-th__resize-handle\"\n        [igxResizeHandle]=\"column\"\n        [attr.draggable]=\"false\"\n        [style.cursor]=\"colResizingService.resizeCursor\">\n    </span>\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-right\"></span>\n</ng-container>\n", components: [{ type: IgxGridHeaderGroupComponent, selector: "igx-grid-header-group", inputs: ["column"] }, { type: i4.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i5.IgxGridHeaderComponent, selector: "igx-grid-header", inputs: ["column", "density"] }, { type: i6.IgxGridFilteringCellComponent, selector: "igx-grid-filtering-cell", inputs: ["column"] }], directives: [{ type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i7.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i7.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i8.IgxColumnMovingDragDirective, selector: "[igxColumnMovingDrag]", inputs: ["igxColumnMovingDrag"] }, { type: i9.IgxColumnMovingDropDirective, selector: "[igxColumnMovingDrop]", inputs: ["igxColumnMovingDrop"] }, { type: i7.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i10.IgxResizeHandleDirective, selector: "[igxResizeHandle]", inputs: ["igxResizeHandle"] }], pipes: { "igxHeaderGroupStyle": i11.IgxHeaderGroupStylePipe, "igxHeaderGroupWidth": i11.IgxHeaderGroupWidthPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridHeaderGroupComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-grid-header-group', template: "<ng-container *ngIf=\"grid.hasColumnLayouts && column.columnGroup\">\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-left\"></span>\n    <div class=\"igx-grid-thead__group igx-grid__mrl-block\"\n     [ngClass]=\"{\n         'igx-grid-th--pinned-last': hasLastPinnedChildColumn,\n         'igx-grid-th--pinned-first': hasFirstPinnedChildColumn\n        }\"\n     [ngStyle]=\"{'grid-template-rows':column.getGridTemplate(true),\n     'grid-template-columns':column.getGridTemplate(false)}\">\n        <ng-container *ngFor=\"let child of column.children\" >\n            <igx-grid-header-group *ngIf=\"!child.hidden\" class=\"igx-grid-thead__subgroup\"\n                [ngClass]=\"child.headerGroupClasses\"\n                [ngStyle]=\"child.headerGroupStyles | igxHeaderGroupStyle:child:grid.pipeTrigger\"\n                [column]=\"child\"\n                [igxColumnMovingDrag]=\"child\"\n                [ghostHost]=\"grid.outlet.nativeElement\"\n                [attr.droppable]=\"true\"\n                [igxColumnMovingDrop]=\"child\">\n            </igx-grid-header-group>\n        </ng-container>\n    </div>\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-right\"></span>\n</ng-container>\n\n\n<ng-template #defaultColumn>\n    <span class=\"igx-grid-th__group-title\" [title]=\"title\">{{column.header}}</span>\n</ng-template>\n\n<ng-template #defaultCollapseIndicator>\n    <igx-icon [attr.draggable]=\"false\" >\n            {{column.expanded ? 'expand_more' : 'chevron_right'}} </igx-icon>\n</ng-template>\n\n<ng-container *ngIf=\"!grid.hasColumnLayouts && column.columnGroup\">\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-left\"></span>\n    <div class=\"igx-grid-thead__title\"\n        role=\"columnheader\"\n        [attr.aria-label]=\"column.header || column.field\"\n        [attr.aria-expanded]=\"column.expanded\"\n        [attr.aria-selected]=\"column.selected\"\n        [ngClass]=\"{\n            'igx-grid-th--pinned-last': hasLastPinnedChildColumn,\n            'igx-grid-th--pinned-first': hasFirstPinnedChildColumn,\n            'igx-grid-th--collapsible': column.collapsible,\n            'igx-grid-th--selectable': selectable,\n            'igx-grid-th--selected': selected,\n            'igx-grid-th--active': activeGroup}\"\n        [igxColumnMovingDrag]=\"column\"\n        [ghostHost]=\"grid.outlet.nativeElement\"\n        [attr.droppable]=\"true\"\n        [igxColumnMovingDrop]=\"column\"\n        (pointerdown)=\"pointerdown($event)\"\n        (click)=\"groupClicked($event)\"\n        (pointerenter)=\"onPinterEnter()\"\n        (pointerleave)=\"onPointerLeave()\"\n        >\n        <ng-container *ngIf=\"column.collapsible\">\n            <div class=\"igx-grid-th__expander\" (click)=\"toggleExpandState($event)\">\n                <ng-container\n                    *ngTemplateOutlet=\"column.collapsibleIndicatorTemplate ? column.collapsibleIndicatorTemplate : defaultCollapseIndicator; context: {$implicit: column, column: column}\">\n                </ng-container>\n            </div>\n        </ng-container>\n        <ng-container *ngTemplateOutlet=\"column.headerTemplate ? column.headerTemplate : defaultColumn; context: { $implicit: column, column: column}\">\n        </ng-container>\n    </div>\n    <div class=\"igx-grid-thead__group\" *ngIf='!grid.isPivot'>\n        <ng-container *ngFor=\"let child of column.children\">\n            <igx-grid-header-group *ngIf=\"!child.hidden\" class=\"igx-grid-thead__subgroup\"\n                [ngClass]=\"child.headerGroupClasses\"\n                [ngStyle]=\"child.headerGroupStyles | igxHeaderGroupStyle:child:grid.pipeTrigger\"\n                [column]=\"child\"\n                [style.min-width]=\"child.calcWidth | igxHeaderGroupWidth:grid.defaultHeaderGroupMinWidth:grid.hasColumnLayouts\"\n                [style.flex-basis]=\"child.calcWidth | igxHeaderGroupWidth:grid.defaultHeaderGroupMinWidth:grid.hasColumnLayouts\">\n            </igx-grid-header-group>\n        </ng-container>\n    </div>\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-right\"></span>\n</ng-container>\n\n<ng-container *ngIf=\"!column.columnGroup\">\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-left\"></span>\n    <igx-grid-header\n        role=\"columnheader\"\n        class=\"igx-grid-th--fw\"\n        [id]=\"grid.id + '_' + column.field\"\n        [ngClass]=\"column.headerClasses\"\n        [ngStyle]=\"column.headerStyles | igxHeaderGroupStyle:column:grid.pipeTrigger\"\n        [igxColumnMovingDrag]=\"column\"\n        [ghostHost]=\"grid.outlet.nativeElement\"\n        [attr.droppable]=\"true\"\n        (pointerdown)=\"activate()\"\n        [igxColumnMovingDrop]=\"column\"\n        [column]=\"column\"\n        [density]=\"grid.displayDensity\"\n    >\n    </igx-grid-header>\n    <igx-grid-filtering-cell *ngIf=\"grid.allowFiltering && grid.filterMode === 'quickFilter'\" [column]=\"column\" [attr.draggable]=\"false\"></igx-grid-filtering-cell>\n    <span *ngIf=\"!column.columnGroup && column.resizable\" class=\"igx-grid-th__resize-handle\"\n        [igxResizeHandle]=\"column\"\n        [attr.draggable]=\"false\"\n        [style.cursor]=\"colResizingService.resizeCursor\">\n    </span>\n    <span *ngIf=\"grid.moving\" class=\"igx-grid-th__drop-indicator-right\"></span>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i0.ElementRef }, { type: i1.IgxColumnResizingService }, { type: i2.IgxFilteringService }, { type: i3.PlatformUtil }]; }, propDecorators: { rowEnd: [{
                type: HostBinding,
                args: ['style.grid-row-end']
            }], colEnd: [{
                type: HostBinding,
                args: ['style.grid-column-end']
            }], rowStart: [{
                type: HostBinding,
                args: ['style.grid-row-start']
            }], colStart: [{
                type: HostBinding,
                args: ['style.grid-column-start']
            }], headerID: [{
                type: HostBinding,
                args: ['attr.id']
            }], column: [{
                type: Input
            }], active: [{
                type: HostBinding,
                args: ['class.igx-grid-th--active']
            }], header: [{
                type: ViewChild,
                args: [IgxGridHeaderComponent]
            }], filter: [{
                type: ViewChild,
                args: [IgxGridFilteringCellComponent]
            }], children: [{
                type: ViewChildren,
                args: [forwardRef(() => IgxGridHeaderGroupComponent), { read: IgxGridHeaderGroupComponent }]
            }], defaultCss: [{
                type: HostBinding,
                args: ['class.igx-grid-thead__item']
            }], pinnedCss: [{
                type: HostBinding,
                args: ['class.igx-grid-th--pinned']
            }], pinnedLastCss: [{
                type: HostBinding,
                args: ['class.igx-grid-th--pinned-last']
            }], pinnedFirstCSS: [{
                type: HostBinding,
                args: ['class.igx-grid-th--pinned-first']
            }], headerDragCss: [{
                type: HostBinding,
                args: ['class.igx-grid__drag-col-header']
            }], filteringCss: [{
                type: HostBinding,
                args: ['class.igx-grid-th--filtering']
            }], zIndex: [{
                type: HostBinding,
                args: ['style.z-index']
            }], groupDisplayStyle: [{
                type: HostBinding,
                args: ['style.display']
            }], onMouseDown: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1oZWFkZXItZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2hlYWRlcnMvZ3JpZC1oZWFkZXItZ3JvdXAuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2hlYWRlcnMvZ3JpZC1oZWFkZXItZ3JvdXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILHVCQUF1QixFQUV2QixTQUFTLEVBR1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFFTCxTQUFTLEVBQ1QsWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQ2hHLE9BQU8sRUFBd0IsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFHcEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBRXJCOztHQUVHO0FBTUgsTUFBTSxPQUFPLDJCQUEyQjtJQTZFcEMsWUFBb0IsR0FBc0IsRUFDUixJQUFjLEVBQ3BDLEdBQTRCLEVBQzdCLGtCQUE0QyxFQUM1QyxnQkFBcUMsRUFDbEMsUUFBc0I7UUFMaEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDUixTQUFJLEdBQUosSUFBSSxDQUFVO1FBQ3BDLFFBQUcsR0FBSCxHQUFHLENBQXlCO1FBQzdCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixD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LDJCQUEyQjtnQkFnQmpDLE1BQU07c0JBRFosU0FBUzt1QkFBQyxzQkFBc0I7Z0JBTzFCLE1BQU07c0JBRFosU0FBUzt1QkFBQyw2QkFBNkI7Z0JBT2pDLFFBQVE7c0JBRGQsWUFBWTt1QkFBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMkJBQTJCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRTtnQkFhM0YsVUFBVTtzQkFEaEIsV0FBVzt1QkFBQyw0QkFBNEI7Z0JBVzlCLFNBQVM7c0JBRG5CLFdBQVc7dUJBQUMsMkJBQTJCO2dCQU03QixhQUFhO3NCQUR2QixXQUFXO3VCQUFDLGdDQUFnQztnQkFNbEMsY0FBYztzQkFEeEIsV0FBVzt1QkFBQyxpQ0FBaUM7Z0JBTW5DLGFBQWE7c0JBRHZCLFdBQVc7dUJBQUMsaUNBQWlDO2dCQU1uQyxZQUFZO3NCQUR0QixXQUFXO3VCQUFDLDhCQUE4QjtnQkFTaEMsTUFBTTtzQkFEaEIsV0FBVzt1QkFBQyxlQUFlO2dCQWtDakIsaUJBQWlCO3NCQUQzQixXQUFXO3VCQUFDLGVBQWU7Z0JBNkVyQixXQUFXO3NCQURqQixZQUFZO3VCQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIERvQ2hlY2ssXG4gICAgRWxlbWVudFJlZixcbiAgICBmb3J3YXJkUmVmLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vZmlsdGVyaW5nL2dyaWQtZmlsdGVyaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4Q29sdW1uUmVzaXppbmdTZXJ2aWNlIH0gZnJvbSAnLi4vcmVzaXppbmcvcmVzaXppbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLWhlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4R3JpZEZpbHRlcmluZ0NlbGxDb21wb25lbnQgfSBmcm9tICcuLi9maWx0ZXJpbmcvYmFzZS9ncmlkLWZpbHRlcmluZy1jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb2x1bW5UeXBlLCBHcmlkVHlwZSwgSUdYX0dSSURfQkFTRSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBHcmlkU2VsZWN0aW9uTW9kZSB9IGZyb20gJy4uL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcblxuY29uc3QgWl9JTkRFWCA9IDk5OTk7XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5AQ29tcG9uZW50KHtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBzZWxlY3RvcjogJ2lneC1ncmlkLWhlYWRlci1ncm91cCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2dyaWQtaGVhZGVyLWdyb3VwLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnQgaW1wbGVtZW50cyBEb0NoZWNrIHtcblxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuZ3JpZC1yb3ctZW5kJylcbiAgICBwdWJsaWMgZ2V0IHJvd0VuZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4ucm93RW5kO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuZ3JpZC1jb2x1bW4tZW5kJylcbiAgICBwdWJsaWMgZ2V0IGNvbEVuZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uY29sRW5kO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuZ3JpZC1yb3ctc3RhcnQnKVxuICAgIHB1YmxpYyBnZXQgcm93U3RhcnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLnJvd1N0YXJ0O1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuZ3JpZC1jb2x1bW4tc3RhcnQnKVxuICAgIHB1YmxpYyBnZXQgY29sU3RhcnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmNvbFN0YXJ0O1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnYXR0ci5pZCcpXG4gICAgcHVibGljIGdldCBoZWFkZXJJRCgpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuZ3JpZC5pZH1fLTFfJHt0aGlzLmNvbHVtbi5sZXZlbH1fJHt0aGlzLmNvbHVtbi52aXNpYmxlSW5kZXh9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb2x1bW4gb2YgdGhlIGhlYWRlciBncm91cC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjb2x1bW46IENvbHVtblR5cGU7XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkLXRoLS1hY3RpdmUnKVxuICAgIHB1YmxpYyBnZXQgYWN0aXZlKCkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ncmlkLm5hdmlnYXRpb24uYWN0aXZlTm9kZTtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgIXRoaXMuY29sdW1uLmNvbHVtbkdyb3VwID9cbiAgICAgICAgICAgIG5vZGUucm93ID09PSAtMSAmJiBub2RlLmNvbHVtbiA9PT0gdGhpcy5jb2x1bW4udmlzaWJsZUluZGV4ICYmIG5vZGUubGV2ZWwgPT09IHRoaXMuY29sdW1uLmxldmVsIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBhY3RpdmVHcm91cCgpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ3JpZC5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGU7XG4gICAgICAgIHJldHVybiBub2RlID8gbm9kZS5yb3cgPT09IC0xICYmIG5vZGUuY29sdW1uID09PSB0aGlzLmNvbHVtbi52aXNpYmxlSW5kZXggJiYgbm9kZS5sZXZlbCA9PT0gdGhpcy5jb2x1bW4ubGV2ZWwgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZChJZ3hHcmlkSGVhZGVyQ29tcG9uZW50KVxuICAgIHB1YmxpYyBoZWFkZXI6IElneEdyaWRIZWFkZXJDb21wb25lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZChJZ3hHcmlkRmlsdGVyaW5nQ2VsbENvbXBvbmVudClcbiAgICBwdWJsaWMgZmlsdGVyOiBJZ3hHcmlkRmlsdGVyaW5nQ2VsbENvbXBvbmVudDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gSWd4R3JpZEhlYWRlckdyb3VwQ29tcG9uZW50KSwgeyByZWFkOiBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnQgfSlcbiAgICBwdWJsaWMgY2hpbGRyZW46IFF1ZXJ5TGlzdDxJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIGhlYWRlciBncm91cC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmdldEhlYWRlckdyb3VwV2lkdGgodGhpcy5jb2x1bW4pO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGhlYWRfX2l0ZW0nKVxuICAgIHB1YmxpYyBkZWZhdWx0Q3NzID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9CQVNFKSBwdWJsaWMgZ3JpZDogR3JpZFR5cGUsXG4gICAgICAgIHByaXZhdGUgcmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHVibGljIGNvbFJlc2l6aW5nU2VydmljZTogSWd4Q29sdW1uUmVzaXppbmdTZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgZmlsdGVyaW5nU2VydmljZTogSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwpIHsgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZC10aC0tcGlubmVkJylcbiAgICBwdWJsaWMgZ2V0IHBpbm5lZENzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNQaW5uZWQ7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZC10aC0tcGlubmVkLWxhc3QnKVxuICAgIHB1YmxpYyBnZXQgcGlubmVkTGFzdENzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNMYXN0UGlubmVkO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGgtLXBpbm5lZC1maXJzdCcpXG4gICAgcHVibGljIGdldCBwaW5uZWRGaXJzdENTUygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaXJzdFBpbm5lZDtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX19kcmFnLWNvbC1oZWFkZXInKVxuICAgIHB1YmxpYyBnZXQgaGVhZGVyRHJhZ0NzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIZWFkZXJEcmFnZ2VkO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtdGgtLWZpbHRlcmluZycpXG4gICAgcHVibGljIGdldCBmaWx0ZXJpbmdDc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRmlsdGVyZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuei1pbmRleCcpXG4gICAgcHVibGljIGdldCB6SW5kZXgoKSB7XG4gICAgICAgIGlmICghdGhpcy5jb2x1bW4ucGlubmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWl9JTkRFWCAtIHRoaXMuZ3JpZC5waW5uZWRDb2x1bW5zLmluZGV4T2YodGhpcy5jb2x1bW4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgaGVhZGVyIGdyb3VwIGJlbG9uZ3MgdG8gYSBjb2x1bW4gdGhhdCBpcyBmaWx0ZXJlZC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzRmlsdGVyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZmlsdGVyZWRDb2x1bW4gPT09IHRoaXMuY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgaGVhZGVyIGdyb3VwIGlzIHN0b3JlZCBpbiB0aGUgbGFzdCBjb2x1bW4gaW4gdGhlIHBpbm5lZCBhcmVhLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRIZWFkZXJHcm91cENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNMYXN0UGlubmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuZ3JpZC5oYXNDb2x1bW5MYXlvdXRzID8gdGhpcy5jb2x1bW4uaXNMYXN0UGlubmVkIDogZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB3aGV0aGVyIHRoZSBoZWFkZXIgZ3JvdXAgaXMgc3RvcmVkIGluIHRoZSBmaXJzdCBjb2x1bW4gb2YgdGhlIHJpZ2h0IHBpbm5lZCBhcmVhLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBpbm5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmdyaWQuaGFzQ29sdW1uTGF5b3V0cyA/IHRoaXMuY29sdW1uLmlzRmlyc3RQaW5uZWQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKVxuICAgIHB1YmxpYyBnZXQgZ3JvdXBEaXNwbGF5U3R5bGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5oYXNDb2x1bW5MYXlvdXRzICYmIHRoaXMuY29sdW1uLmNoaWxkcmVuID8gJ2ZsZXgnIDogJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB3aGV0aGVyIHRoZSBoZWFkZXIgZ3JvdXAgaXMgc3RvcmVkIGluIGEgcGlubmVkIGNvbHVtbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzUGlubmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4ucGlubmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgaGVhZGVyIGdyb3VwIGJlbG9uZ3MgdG8gYSBjb2x1bW4gdGhhdCBpcyBtb3ZlZC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkSGVhZGVyR3JvdXBDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzSGVhZGVyRHJhZ2dlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5jb2x1bW5JbkRyYWcgPT09IHRoaXMuY29sdW1uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhhc0xhc3RQaW5uZWRDaGlsZENvbHVtbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmFsbENoaWxkcmVuLnNvbWUoY2hpbGQgPT4gY2hpbGQuaXNMYXN0UGlubmVkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBoYXNGaXJzdFBpbm5lZENoaWxkQ29sdW1uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uYWxsQ2hpbGRyZW4uc29tZShjaGlsZCA9PiBjaGlsZC5pc0ZpcnN0UGlubmVkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzZWxlY3RhYmxlKCkge1xuICAgICAgICBjb25zdCBzZWxlY3RhYmxlQ2hpbGRyZW4gPSB0aGlzLmNvbHVtbi5hbGxDaGlsZHJlbi5maWx0ZXIoYyA9PiAhYy5oaWRkZW4gJiYgYy5zZWxlY3RhYmxlICYmICFjLmNvbHVtbkdyb3VwKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5jb2x1bW5TZWxlY3Rpb24gIT09IEdyaWRTZWxlY3Rpb25Nb2RlLm5vbmUgJiZcbiAgICAgICAgICAgIHRoaXMuY29sdW1uLmFwcGx5U2VsZWN0YWJsZUNsYXNzXG4gICAgICAgICAgICAmJiAhdGhpcy5zZWxlY3RlZCAmJiBzZWxlY3RhYmxlQ2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgICAgICAgJiYgIXRoaXMuZ3JpZC5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLnNlbGVjdGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi50aXRsZSB8fCB0aGlzLmNvbHVtbi5oZWFkZXI7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgLy8gaGFjayBmb3IgcHJldmVudGluZyB0ZXh0IHNlbGVjdGlvbiBpbiBJRSBhbmQgRWRnZSB3aGlsZSBkcmFnZ2luZyB0aGUgcmVzaXplIGVsZW1lbnRcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdyb3VwQ2xpY2tlZChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjb2x1bW5zVG9TZWxlY3QgPSB0aGlzLmNvbHVtbi5hbGxDaGlsZHJlbi5maWx0ZXIoYyA9PiAhYy5oaWRkZW4gJiYgYy5zZWxlY3RhYmxlICYmICFjLmNvbHVtbkdyb3VwKS5tYXAoYyA9PiBjLmZpZWxkKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5jb2x1bW5TZWxlY3Rpb24gIT09IEdyaWRTZWxlY3Rpb25Nb2RlLm5vbmVcbiAgICAgICAgICAgICYmIGNvbHVtbnNUb1NlbGVjdC5sZW5ndGggPiAwICYmICF0aGlzLmdyaWQuZmlsdGVyaW5nU2VydmljZS5pc0ZpbHRlclJvd1Zpc2libGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZWFyU2VsZWN0aW9uID0gdGhpcy5ncmlkLmNvbHVtblNlbGVjdGlvbiA9PT0gR3JpZFNlbGVjdGlvbk1vZGUuc2luZ2xlIHx8ICFldmVudC5jdHJsS2V5O1xuICAgICAgICAgICAgY29uc3QgcmFuZ2VTZWxlY3Rpb24gPSB0aGlzLmdyaWQuY29sdW1uU2VsZWN0aW9uID09PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZSAmJiBldmVudC5zaGlmdEtleTtcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdENvbHVtbnMoY29sdW1uc1RvU2VsZWN0LCBjbGVhclNlbGVjdGlvbiwgcmFuZ2VTZWxlY3Rpb24sIGV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGaWVsZHMgPSB0aGlzLmdyaWQuc2VsZWN0aW9uU2VydmljZS5nZXRTZWxlY3RlZENvbHVtbnMoKTtcbiAgICAgICAgICAgICAgICBpZiAoKHNlbGVjdGVkRmllbGRzLmxlbmd0aCA9PT0gY29sdW1uc1RvU2VsZWN0Lmxlbmd0aCkgJiYgc2VsZWN0ZWRGaWVsZHMuZXZlcnkoZWwgPT4gY29sdW1uc1RvU2VsZWN0LmluY2x1ZGVzKGVsKSlcbiAgICAgICAgICAgICAgICAgICAgfHwgIWNsZWFyU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmRlc2VsZWN0Q29sdW1ucyhjb2x1bW5zVG9TZWxlY3QsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RDb2x1bW5zKGNvbHVtbnNUb1NlbGVjdCwgY2xlYXJTZWxlY3Rpb24sIHJhbmdlU2VsZWN0aW9uLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlRXhwYW5kU3RhdGUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuY29sdW1uLmV4cGFuZGVkID0gIXRoaXMuY29sdW1uLmV4cGFuZGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHBvaW50ZXJkb3duKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgICAgdGhpcy5ncmlkLnRoZWFkUm93Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIG5lY2Vzc2FyeSBkdWUgdG8gc29tZSBzcGVjaWZpY3MgcmVsYXRlZCB3aXRoIGltcGxlbWVudGF0aW9uIG9mIGNvbHVtbiBtb3ZpbmdcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGFjdGl2YXRlKCkge1xuICAgICAgICB0aGlzLmdyaWQubmF2aWdhdGlvbi5zZXRBY3RpdmVOb2RlKHRoaXMuYWN0aXZlTm9kZSk7XG4gICAgICAgIHRoaXMuZ3JpZC50aGVhZFJvdy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nRG9DaGVjaygpIHtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25QaW50ZXJFbnRlcigpIHtcbiAgICAgICAgdGhpcy5jb2x1bW4uYXBwbHlTZWxlY3RhYmxlQ2xhc3MgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25Qb2ludGVyTGVhdmUoKSB7XG4gICAgICAgIHRoaXMuY29sdW1uLmFwcGx5U2VsZWN0YWJsZUNsYXNzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBhY3RpdmVOb2RlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93OiAtMSwgY29sdW1uOiB0aGlzLmNvbHVtbi52aXNpYmxlSW5kZXgsIGxldmVsOiB0aGlzLmNvbHVtbi5sZXZlbCxcbiAgICAgICAgICAgIG1jaENhY2hlOiB7IGxldmVsOiB0aGlzLmNvbHVtbi5sZXZlbCwgdmlzaWJsZUluZGV4OiB0aGlzLmNvbHVtbi52aXNpYmxlSW5kZXggfSxcbiAgICAgICAgICAgIGxheW91dDogdGhpcy5jb2x1bW4uY29sdW1uTGF5b3V0Q2hpbGQgPyB7XG4gICAgICAgICAgICAgICAgcm93U3RhcnQ6IHRoaXMuY29sdW1uLnJvd1N0YXJ0LFxuICAgICAgICAgICAgICAgIGNvbFN0YXJ0OiB0aGlzLmNvbHVtbi5jb2xTdGFydCxcbiAgICAgICAgICAgICAgICByb3dFbmQ6IHRoaXMuY29sdW1uLnJvd0VuZCxcbiAgICAgICAgICAgICAgICBjb2xFbmQ6IHRoaXMuY29sdW1uLmNvbEVuZCxcbiAgICAgICAgICAgICAgICBjb2x1bW5WaXNpYmxlSW5kZXg6IHRoaXMuY29sdW1uLnZpc2libGVJbmRleFxuICAgICAgICAgICAgfSA6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCI8bmctY29udGFpbmVyICpuZ0lmPVwiZ3JpZC5oYXNDb2x1bW5MYXlvdXRzICYmIGNvbHVtbi5jb2x1bW5Hcm91cFwiPlxuICAgIDxzcGFuICpuZ0lmPVwiZ3JpZC5tb3ZpbmdcIiBjbGFzcz1cImlneC1ncmlkLXRoX19kcm9wLWluZGljYXRvci1sZWZ0XCI+PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZC10aGVhZF9fZ3JvdXAgaWd4LWdyaWRfX21ybC1ibG9ja1wiXG4gICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICdpZ3gtZ3JpZC10aC0tcGlubmVkLWxhc3QnOiBoYXNMYXN0UGlubmVkQ2hpbGRDb2x1bW4sXG4gICAgICAgICAnaWd4LWdyaWQtdGgtLXBpbm5lZC1maXJzdCc6IGhhc0ZpcnN0UGlubmVkQ2hpbGRDb2x1bW5cbiAgICAgICAgfVwiXG4gICAgIFtuZ1N0eWxlXT1cInsnZ3JpZC10ZW1wbGF0ZS1yb3dzJzpjb2x1bW4uZ2V0R3JpZFRlbXBsYXRlKHRydWUpLFxuICAgICAnZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zJzpjb2x1bW4uZ2V0R3JpZFRlbXBsYXRlKGZhbHNlKX1cIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY2hpbGQgb2YgY29sdW1uLmNoaWxkcmVuXCIgPlxuICAgICAgICAgICAgPGlneC1ncmlkLWhlYWRlci1ncm91cCAqbmdJZj1cIiFjaGlsZC5oaWRkZW5cIiBjbGFzcz1cImlneC1ncmlkLXRoZWFkX19zdWJncm91cFwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiY2hpbGQuaGVhZGVyR3JvdXBDbGFzc2VzXCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJjaGlsZC5oZWFkZXJHcm91cFN0eWxlcyB8IGlneEhlYWRlckdyb3VwU3R5bGU6Y2hpbGQ6Z3JpZC5waXBlVHJpZ2dlclwiXG4gICAgICAgICAgICAgICAgW2NvbHVtbl09XCJjaGlsZFwiXG4gICAgICAgICAgICAgICAgW2lneENvbHVtbk1vdmluZ0RyYWddPVwiY2hpbGRcIlxuICAgICAgICAgICAgICAgIFtnaG9zdEhvc3RdPVwiZ3JpZC5vdXRsZXQubmF0aXZlRWxlbWVudFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuZHJvcHBhYmxlXT1cInRydWVcIlxuICAgICAgICAgICAgICAgIFtpZ3hDb2x1bW5Nb3ZpbmdEcm9wXT1cImNoaWxkXCI+XG4gICAgICAgICAgICA8L2lneC1ncmlkLWhlYWRlci1ncm91cD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG4gICAgPHNwYW4gKm5nSWY9XCJncmlkLm1vdmluZ1wiIGNsYXNzPVwiaWd4LWdyaWQtdGhfX2Ryb3AtaW5kaWNhdG9yLXJpZ2h0XCI+PC9zcGFuPlxuPC9uZy1jb250YWluZXI+XG5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Q29sdW1uPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LWdyaWQtdGhfX2dyb3VwLXRpdGxlXCIgW3RpdGxlXT1cInRpdGxlXCI+e3tjb2x1bW4uaGVhZGVyfX08L3NwYW4+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRDb2xsYXBzZUluZGljYXRvcj5cbiAgICA8aWd4LWljb24gW2F0dHIuZHJhZ2dhYmxlXT1cImZhbHNlXCIgPlxuICAgICAgICAgICAge3tjb2x1bW4uZXhwYW5kZWQgPyAnZXhwYW5kX21vcmUnIDogJ2NoZXZyb25fcmlnaHQnfX0gPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy1jb250YWluZXIgKm5nSWY9XCIhZ3JpZC5oYXNDb2x1bW5MYXlvdXRzICYmIGNvbHVtbi5jb2x1bW5Hcm91cFwiPlxuICAgIDxzcGFuICpuZ0lmPVwiZ3JpZC5tb3ZpbmdcIiBjbGFzcz1cImlneC1ncmlkLXRoX19kcm9wLWluZGljYXRvci1sZWZ0XCI+PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJpZ3gtZ3JpZC10aGVhZF9fdGl0bGVcIlxuICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb2x1bW4uaGVhZGVyIHx8IGNvbHVtbi5maWVsZFwiXG4gICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiY29sdW1uLmV4cGFuZGVkXCJcbiAgICAgICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJjb2x1bW4uc2VsZWN0ZWRcIlxuICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAnaWd4LWdyaWQtdGgtLXBpbm5lZC1sYXN0JzogaGFzTGFzdFBpbm5lZENoaWxkQ29sdW1uLFxuICAgICAgICAgICAgJ2lneC1ncmlkLXRoLS1waW5uZWQtZmlyc3QnOiBoYXNGaXJzdFBpbm5lZENoaWxkQ29sdW1uLFxuICAgICAgICAgICAgJ2lneC1ncmlkLXRoLS1jb2xsYXBzaWJsZSc6IGNvbHVtbi5jb2xsYXBzaWJsZSxcbiAgICAgICAgICAgICdpZ3gtZ3JpZC10aC0tc2VsZWN0YWJsZSc6IHNlbGVjdGFibGUsXG4gICAgICAgICAgICAnaWd4LWdyaWQtdGgtLXNlbGVjdGVkJzogc2VsZWN0ZWQsXG4gICAgICAgICAgICAnaWd4LWdyaWQtdGgtLWFjdGl2ZSc6IGFjdGl2ZUdyb3VwfVwiXG4gICAgICAgIFtpZ3hDb2x1bW5Nb3ZpbmdEcmFnXT1cImNvbHVtblwiXG4gICAgICAgIFtnaG9zdEhvc3RdPVwiZ3JpZC5vdXRsZXQubmF0aXZlRWxlbWVudFwiXG4gICAgICAgIFthdHRyLmRyb3BwYWJsZV09XCJ0cnVlXCJcbiAgICAgICAgW2lneENvbHVtbk1vdmluZ0Ryb3BdPVwiY29sdW1uXCJcbiAgICAgICAgKHBvaW50ZXJkb3duKT1cInBvaW50ZXJkb3duKCRldmVudClcIlxuICAgICAgICAoY2xpY2spPVwiZ3JvdXBDbGlja2VkKCRldmVudClcIlxuICAgICAgICAocG9pbnRlcmVudGVyKT1cIm9uUGludGVyRW50ZXIoKVwiXG4gICAgICAgIChwb2ludGVybGVhdmUpPVwib25Qb2ludGVyTGVhdmUoKVwiXG4gICAgICAgID5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5jb2xsYXBzaWJsZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkLXRoX19leHBhbmRlclwiIChjbGljayk9XCJ0b2dnbGVFeHBhbmRTdGF0ZSgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cImNvbHVtbi5jb2xsYXBzaWJsZUluZGljYXRvclRlbXBsYXRlID8gY29sdW1uLmNvbGxhcHNpYmxlSW5kaWNhdG9yVGVtcGxhdGUgOiBkZWZhdWx0Q29sbGFwc2VJbmRpY2F0b3I7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGNvbHVtbiwgY29sdW1uOiBjb2x1bW59XCI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb2x1bW4uaGVhZGVyVGVtcGxhdGUgPyBjb2x1bW4uaGVhZGVyVGVtcGxhdGUgOiBkZWZhdWx0Q29sdW1uOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29sdW1uLCBjb2x1bW46IGNvbHVtbn1cIj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImlneC1ncmlkLXRoZWFkX19ncm91cFwiICpuZ0lmPSchZ3JpZC5pc1Bpdm90Jz5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY2hpbGQgb2YgY29sdW1uLmNoaWxkcmVuXCI+XG4gICAgICAgICAgICA8aWd4LWdyaWQtaGVhZGVyLWdyb3VwICpuZ0lmPVwiIWNoaWxkLmhpZGRlblwiIGNsYXNzPVwiaWd4LWdyaWQtdGhlYWRfX3N1Ymdyb3VwXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJjaGlsZC5oZWFkZXJHcm91cENsYXNzZXNcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImNoaWxkLmhlYWRlckdyb3VwU3R5bGVzIHwgaWd4SGVhZGVyR3JvdXBTdHlsZTpjaGlsZDpncmlkLnBpcGVUcmlnZ2VyXCJcbiAgICAgICAgICAgICAgICBbY29sdW1uXT1cImNoaWxkXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUubWluLXdpZHRoXT1cImNoaWxkLmNhbGNXaWR0aCB8IGlneEhlYWRlckdyb3VwV2lkdGg6Z3JpZC5kZWZhdWx0SGVhZGVyR3JvdXBNaW5XaWR0aDpncmlkLmhhc0NvbHVtbkxheW91dHNcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5mbGV4LWJhc2lzXT1cImNoaWxkLmNhbGNXaWR0aCB8IGlneEhlYWRlckdyb3VwV2lkdGg6Z3JpZC5kZWZhdWx0SGVhZGVyR3JvdXBNaW5XaWR0aDpncmlkLmhhc0NvbHVtbkxheW91dHNcIj5cbiAgICAgICAgICAgIDwvaWd4LWdyaWQtaGVhZGVyLWdyb3VwPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiAqbmdJZj1cImdyaWQubW92aW5nXCIgY2xhc3M9XCJpZ3gtZ3JpZC10aF9fZHJvcC1pbmRpY2F0b3ItcmlnaHRcIj48L3NwYW4+XG48L25nLWNvbnRhaW5lcj5cblxuPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFjb2x1bW4uY29sdW1uR3JvdXBcIj5cbiAgICA8c3BhbiAqbmdJZj1cImdyaWQubW92aW5nXCIgY2xhc3M9XCJpZ3gtZ3JpZC10aF9fZHJvcC1pbmRpY2F0b3ItbGVmdFwiPjwvc3Bhbj5cbiAgICA8aWd4LWdyaWQtaGVhZGVyXG4gICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICBjbGFzcz1cImlneC1ncmlkLXRoLS1md1wiXG4gICAgICAgIFtpZF09XCJncmlkLmlkICsgJ18nICsgY29sdW1uLmZpZWxkXCJcbiAgICAgICAgW25nQ2xhc3NdPVwiY29sdW1uLmhlYWRlckNsYXNzZXNcIlxuICAgICAgICBbbmdTdHlsZV09XCJjb2x1bW4uaGVhZGVyU3R5bGVzIHwgaWd4SGVhZGVyR3JvdXBTdHlsZTpjb2x1bW46Z3JpZC5waXBlVHJpZ2dlclwiXG4gICAgICAgIFtpZ3hDb2x1bW5Nb3ZpbmdEcmFnXT1cImNvbHVtblwiXG4gICAgICAgIFtnaG9zdEhvc3RdPVwiZ3JpZC5vdXRsZXQubmF0aXZlRWxlbWVudFwiXG4gICAgICAgIFthdHRyLmRyb3BwYWJsZV09XCJ0cnVlXCJcbiAgICAgICAgKHBvaW50ZXJkb3duKT1cImFjdGl2YXRlKClcIlxuICAgICAgICBbaWd4Q29sdW1uTW92aW5nRHJvcF09XCJjb2x1bW5cIlxuICAgICAgICBbY29sdW1uXT1cImNvbHVtblwiXG4gICAgICAgIFtkZW5zaXR5XT1cImdyaWQuZGlzcGxheURlbnNpdHlcIlxuICAgID5cbiAgICA8L2lneC1ncmlkLWhlYWRlcj5cbiAgICA8aWd4LWdyaWQtZmlsdGVyaW5nLWNlbGwgKm5nSWY9XCJncmlkLmFsbG93RmlsdGVyaW5nICYmIGdyaWQuZmlsdGVyTW9kZSA9PT0gJ3F1aWNrRmlsdGVyJ1wiIFtjb2x1bW5dPVwiY29sdW1uXCIgW2F0dHIuZHJhZ2dhYmxlXT1cImZhbHNlXCI+PC9pZ3gtZ3JpZC1maWx0ZXJpbmctY2VsbD5cbiAgICA8c3BhbiAqbmdJZj1cIiFjb2x1bW4uY29sdW1uR3JvdXAgJiYgY29sdW1uLnJlc2l6YWJsZVwiIGNsYXNzPVwiaWd4LWdyaWQtdGhfX3Jlc2l6ZS1oYW5kbGVcIlxuICAgICAgICBbaWd4UmVzaXplSGFuZGxlXT1cImNvbHVtblwiXG4gICAgICAgIFthdHRyLmRyYWdnYWJsZV09XCJmYWxzZVwiXG4gICAgICAgIFtzdHlsZS5jdXJzb3JdPVwiY29sUmVzaXppbmdTZXJ2aWNlLnJlc2l6ZUN1cnNvclwiPlxuICAgIDwvc3Bhbj5cbiAgICA8c3BhbiAqbmdJZj1cImdyaWQubW92aW5nXCIgY2xhc3M9XCJpZ3gtZ3JpZC10aF9fZHJvcC1pbmRpY2F0b3ItcmlnaHRcIj48L3NwYW4+XG48L25nLWNvbnRhaW5lcj5cbiJdfQ==