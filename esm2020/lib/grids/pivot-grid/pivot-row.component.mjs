import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, Inject, Input } from '@angular/core';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { IgxRowDirective } from '../row.directive';
import { PivotUtil } from './pivot-util';
import * as i0 from "@angular/core";
import * as i1 from "../selection/selection.service";
import * as i2 from "../cell.component";
import * as i3 from "../../checkbox/checkbox.component";
import * as i4 from "../../directives/for-of/for_of.directive";
import * as i5 from "@angular/common";
import * as i6 from "../common/pipes";
const MINIMUM_COLUMN_WIDTH = 200;
export class IgxPivotRowComponent extends IgxRowDirective {
    constructor(grid, selectionService, element, cdr, resolver, viewRef) {
        super(grid, selectionService, element, cdr);
        this.grid = grid;
        this.selectionService = selectionService;
        this.element = element;
        this.cdr = cdr;
        this.resolver = resolver;
        this.viewRef = viewRef;
        /**
         * @hidden
         * @internal
         */
        this.disabled = false;
    }
    /**
     * @hidden
     */
    get selected() {
        let isSelected = false;
        for (let rowDim of this.data.dimensions) {
            const key = PivotUtil.getRecordKey(this.data, rowDim);
            if (this.selectionService.isPivotRowSelected(key)) {
                isSelected = true;
            }
        }
        return isSelected;
    }
    /**
     * @hidden
     * @internal
     */
    get viewIndex() {
        return this.index;
    }
    /**
     * @hidden
     * @internal
     */
    get addRowUI() {
        return false;
    }
    /**
     * @hidden
     * @internal
     */
    get inEditMode() {
        return false;
    }
    /**
     * @hidden
     * @internal
     */
    set pinned(_value) {
    }
    get pinned() {
        return false;
    }
    /**
     * @hidden
     * @internal
     */
    delete() {
    }
    /**
     * @hidden
     * @internal
     */
    beginAddRow() {
    }
    /**
     * @hidden
     * @internal
     */
    update(_value) {
    }
    /**
     * @hidden
     * @internal
     */
    pin() {
        return false;
    }
    /**
    * @hidden
    * @internal
    */
    unpin() {
        return false;
    }
    /**
    *  The pivot record data passed to the row component.
    *
    * ```typescript
    * // get the pivot row data for the first selected row
    * let selectedRowData = this.grid.selectedRows[0].data;
    * ```
    */
    get data() {
        return this._data;
    }
    set data(v) {
        this._data = v;
    }
    /**
     * @hidden
     * @internal
     */
    get pivotAggregationData() {
        const aggregations = this.data.aggregationValues;
        const obj = {};
        aggregations.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    getCellClass(col) {
        const values = this.grid.values;
        if (values.length === 1) {
            return values[0].styles;
        }
        const colName = col.field.split(this.grid.pivotKeys.columnDimensionSeparator);
        const measureName = colName[colName.length - 1];
        return values.find(v => v.member === measureName)?.styles;
    }
    isCellActive(visibleColumnIndex) {
        const nav = this.grid.navigation;
        const node = nav.activeNode;
        return node && Object.keys(node).length !== 0 ?
            !nav.isRowHeaderActive &&
                super.isCellActive(visibleColumnIndex) :
            false;
    }
}
IgxPivotRowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowComponent, deps: [{ token: IGX_GRID_BASE }, { token: i1.IgxGridSelectionService }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component });
IgxPivotRowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxPivotRowComponent, selector: "igx-pivot-row", inputs: { selected: "selected", data: "data" }, host: { properties: { "attr.aria-selected": "this.selected" } }, providers: [{ provide: IgxRowDirective, useExisting: forwardRef(() => IgxPivotRowComponent) }], usesInheritance: true, ngImport: i0, template: "<ng-template igxGridFor let-col [igxGridForOf]=\"unpinnedColumns | igxNotGrouped\"\n    [igxForScrollContainer]=\"grid.parentVirtDir\" let-colIndex=\"index\" [igxForSizePropName]='\"calcPixelWidth\"'\n    [igxForScrollOrientation]=\"'horizontal'\" [igxForContainerSize]='grid.unpinnedWidth'\n    [igxForTrackBy]='grid.trackColumnChanges' #igxDirRef>\n    <igx-grid-cell #cell class=\"igx-grid__td igx-grid__td--fw\"\n        [class.igx-grid__td--edited]=\"key | transactionState:col.field:grid.rowEditable:grid.transactions:grid.pipeTrigger:grid.gridAPI.crudService.cell:grid.gridAPI.crudService.row\"\n        [attr.aria-describedby]=\"gridID + '_' + col.field | igxStringReplace:'.':'_'\"\n        [class.igx-grid__td--number]=\"col.dataType === 'number' || col.dataType === 'percent' || col.dataType === 'currency'\"\n        [class.igx-grid__td--bool]=\"col.dataType === 'boolean'\"\n        [ngClass]=\"this.getCellClass(col) | igxCellStyleClasses:data[col.field]:pivotAggregationData:col.field:viewIndex:grid.pipeTrigger\"\n        [ngStyle]=\"col.cellStyles | igxCellStyles:pivotAggregationData[col.field]:pivotAggregationData:col.field:viewIndex:grid.pipeTrigger\"\n        [editMode]=\"col.editable && this.grid.crudService.targetInEdit(index, col.index)\" [column]=\"col\"\n        [formatter]=\"col.formatter\" [intRow]=\"this\" [active]=\"isCellActive(col.visibleIndex)\"\n        [style.min-height.px]=\"cellHeight\" [rowData]=\"pivotAggregationData\" [style.min-width]=\"col.width\" [style.max-width]=\"col.width\"\n        [style.flex-basis]=\"col.width\" [width]=\"col.getCellWidth()\" [visibleColumnIndex]=\"col.visibleIndex\"\n        [value]=\"pivotAggregationData[col.field] | dataMapper:col.field:grid.pipeTrigger:pivotAggregationData[col.field]:col.hasNestedPath\"\n        [cellTemplate]=\"col.bodyTemplate\" [lastSearchInfo]=\"grid.lastSearchInfo\"\n        [cellSelectionMode]=\"grid.cellSelection\" [displayPinnedChip]=\"shouldDisplayPinnedChip(col.visibleIndex)\"\n        (pointerdown)=\"grid.navigation.focusOutRowHeader($event)\">\n    </igx-grid-cell>\n</ng-template>\n\n<ng-template #rowSelectorBaseTemplate>\n    <div class=\"igx-grid__cbx-padding\">\n        <igx-checkbox [tabindex]=\"-1\" [readonly]=\"true\" [checked]=\"selected\" [disableRipple]=\"true\" [disabled]=\"deleted\"\n            [disableTransitions]=\"grid.disableTransitions\" [aria-label]=\"rowCheckboxAriaLabel\">\n        </igx-checkbox>\n    </div>\n</ng-template>\n\n", components: [{ type: i2.IgxGridCellComponent, selector: "igx-grid-cell", inputs: ["column", "intRow", "row", "rowData", "cellTemplate", "pinnedIndicator", "value", "formatter", "visibleColumnIndex", "cellSelectionMode", "lastSearchInfo", "lastPinned", "firstPinned", "editMode", "width", "active", "displayPinnedChip"] }, { type: i3.IgxCheckboxComponent, selector: "igx-checkbox", inputs: ["id", "labelId", "value", "name", "tabindex", "labelPosition", "disableRipple", "required", "aria-labelledby", "aria-label", "indeterminate", "checked", "disabled", "readonly", "disableTransitions"], outputs: ["change"] }], directives: [{ type: i4.IgxGridForOfDirective, selector: "[igxGridFor][igxGridForOf]", inputs: ["igxGridForOf", "igxGridForOfUniqueSizeCache", "igxGridForOfVariableSizes"], outputs: ["dataChanging"] }, { type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i5.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], pipes: { "igxNotGrouped": i6.IgxGridNotGroupedPipe, "transactionState": i6.IgxGridTransactionStatePipe, "igxStringReplace": i6.IgxStringReplacePipe, "igxCellStyleClasses": i6.IgxGridCellStyleClassesPipe, "igxCellStyles": i6.IgxGridCellStylesPipe, "dataMapper": i6.IgxGridDataMapperPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-pivot-row', providers: [{ provide: IgxRowDirective, useExisting: forwardRef(() => IgxPivotRowComponent) }], template: "<ng-template igxGridFor let-col [igxGridForOf]=\"unpinnedColumns | igxNotGrouped\"\n    [igxForScrollContainer]=\"grid.parentVirtDir\" let-colIndex=\"index\" [igxForSizePropName]='\"calcPixelWidth\"'\n    [igxForScrollOrientation]=\"'horizontal'\" [igxForContainerSize]='grid.unpinnedWidth'\n    [igxForTrackBy]='grid.trackColumnChanges' #igxDirRef>\n    <igx-grid-cell #cell class=\"igx-grid__td igx-grid__td--fw\"\n        [class.igx-grid__td--edited]=\"key | transactionState:col.field:grid.rowEditable:grid.transactions:grid.pipeTrigger:grid.gridAPI.crudService.cell:grid.gridAPI.crudService.row\"\n        [attr.aria-describedby]=\"gridID + '_' + col.field | igxStringReplace:'.':'_'\"\n        [class.igx-grid__td--number]=\"col.dataType === 'number' || col.dataType === 'percent' || col.dataType === 'currency'\"\n        [class.igx-grid__td--bool]=\"col.dataType === 'boolean'\"\n        [ngClass]=\"this.getCellClass(col) | igxCellStyleClasses:data[col.field]:pivotAggregationData:col.field:viewIndex:grid.pipeTrigger\"\n        [ngStyle]=\"col.cellStyles | igxCellStyles:pivotAggregationData[col.field]:pivotAggregationData:col.field:viewIndex:grid.pipeTrigger\"\n        [editMode]=\"col.editable && this.grid.crudService.targetInEdit(index, col.index)\" [column]=\"col\"\n        [formatter]=\"col.formatter\" [intRow]=\"this\" [active]=\"isCellActive(col.visibleIndex)\"\n        [style.min-height.px]=\"cellHeight\" [rowData]=\"pivotAggregationData\" [style.min-width]=\"col.width\" [style.max-width]=\"col.width\"\n        [style.flex-basis]=\"col.width\" [width]=\"col.getCellWidth()\" [visibleColumnIndex]=\"col.visibleIndex\"\n        [value]=\"pivotAggregationData[col.field] | dataMapper:col.field:grid.pipeTrigger:pivotAggregationData[col.field]:col.hasNestedPath\"\n        [cellTemplate]=\"col.bodyTemplate\" [lastSearchInfo]=\"grid.lastSearchInfo\"\n        [cellSelectionMode]=\"grid.cellSelection\" [displayPinnedChip]=\"shouldDisplayPinnedChip(col.visibleIndex)\"\n        (pointerdown)=\"grid.navigation.focusOutRowHeader($event)\">\n    </igx-grid-cell>\n</ng-template>\n\n<ng-template #rowSelectorBaseTemplate>\n    <div class=\"igx-grid__cbx-padding\">\n        <igx-checkbox [tabindex]=\"-1\" [readonly]=\"true\" [checked]=\"selected\" [disableRipple]=\"true\" [disabled]=\"deleted\"\n            [disableTransitions]=\"grid.disableTransitions\" [aria-label]=\"rowCheckboxAriaLabel\">\n        </igx-checkbox>\n    </div>\n</ng-template>\n\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i1.IgxGridSelectionService }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }]; }, propDecorators: { selected: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-selected']
            }], data: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3Qtcm93LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9waXZvdC1ncmlkL3Bpdm90LXJvdy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvcGl2b3QtZ3JpZC9waXZvdC1yb3cuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILHVCQUF1QixFQUV2QixTQUFTLEVBR1QsVUFBVSxFQUNWLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUM3QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsYUFBYSxFQUFpQixNQUFNLDBCQUEwQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUduRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDOzs7Ozs7OztBQUd6QyxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQU9qQyxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsZUFBZTtJQWlCckQsWUFDa0MsSUFBbUIsRUFDMUMsZ0JBQXlDLEVBQ3pDLE9BQWdDLEVBQ2hDLEdBQXNCLEVBQ25CLFFBQWtDLEVBQ2xDLE9BQXlCO1FBRW5DLEtBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBUGQsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUMxQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBQ3pDLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQ2hDLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBYXZDOzs7V0FH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QUFDO1FBQzVCLE9BQU8sSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNDLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtnQkFDdEIsS0FBSyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDeEMsS0FBSyxDQUFDO0lBQ2QsQ0FBQzs7aUhBekpRLG9CQUFvQixrQkFrQmpCLGFBQWE7cUdBbEJoQixvQkFBb0IseUpBRmxCLENBQUMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLGlEQ3RCbEcsMjZFQThCQTsyRkROYSxvQkFBb0I7a0JBTmhDLFNBQVM7c0NBQ1csdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxlQUFlLGFBRWQsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUMsRUFBRSxDQUFDOzswQkFvQnpGLE1BQU07MkJBQUMsYUFBYTtpTkFaZCxRQUFRO3NCQUZsQixLQUFLOztzQkFDTCxXQUFXO3VCQUFDLG9CQUFvQjtnQkE4R3RCLElBQUk7c0JBRGQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBFbGVtZW50UmVmLFxuICAgIGZvcndhcmRSZWYsXG4gICAgSG9zdEJpbmRpbmcsIEluamVjdCwgSW5wdXQsIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuLi9jb2x1bW5zL2NvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgSUdYX0dSSURfQkFTRSwgUGl2b3RHcmlkVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hSb3dEaXJlY3RpdmUgfSBmcm9tICcuLi9yb3cuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEdyaWRTZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElQaXZvdEdyaWRSZWNvcmQgfSBmcm9tICcuL3Bpdm90LWdyaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFBpdm90VXRpbCB9IGZyb20gJy4vcGl2b3QtdXRpbCc7XG5cblxuY29uc3QgTUlOSU1VTV9DT0xVTU5fV0lEVEggPSAyMDA7XG5AQ29tcG9uZW50KHtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBzZWxlY3RvcjogJ2lneC1waXZvdC1yb3cnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9waXZvdC1yb3cuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogSWd4Um93RGlyZWN0aXZlLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBJZ3hQaXZvdFJvd0NvbXBvbmVudCkgfV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RSb3dDb21wb25lbnQgZXh0ZW5kcyBJZ3hSb3dEaXJlY3RpdmUge1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXNlbGVjdGVkJylcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgaXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCByb3dEaW0gb2YgdGhpcy5kYXRhLmRpbWVuc2lvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IFBpdm90VXRpbC5nZXRSZWNvcmRLZXkodGhpcy5kYXRhLCByb3dEaW0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uU2VydmljZS5pc1Bpdm90Um93U2VsZWN0ZWQoa2V5KSkge1xuICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1NlbGVjdGVkO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KElHWF9HUklEX0JBU0UpIHB1YmxpYyBncmlkOiBQaXZvdEdyaWRUeXBlLFxuICAgICAgICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICBwcm90ZWN0ZWQgdmlld1JlZjogVmlld0NvbnRhaW5lclJlZlxuICAgICkge1xuICAgICAgICBzdXBlcihncmlkLCBzZWxlY3Rpb25TZXJ2aWNlLCBlbGVtZW50LCBjZHIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHZpZXdJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBhZGRSb3dVSSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaW5FZGl0TW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHBpbm5lZChfdmFsdWU6IGJvb2xlYW4pIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVsZXRlKCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgYmVnaW5BZGRSb3coKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyB1cGRhdGUoX3ZhbHVlOiBhbnkpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHBpbigpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQGhpZGRlblxuICAgICogQGludGVybmFsXG4gICAgKi9cbiAgICBwdWJsaWMgdW5waW4oKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqICBUaGUgcGl2b3QgcmVjb3JkIGRhdGEgcGFzc2VkIHRvIHRoZSByb3cgY29tcG9uZW50LlxuICAgICpcbiAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAqIC8vIGdldCB0aGUgcGl2b3Qgcm93IGRhdGEgZm9yIHRoZSBmaXJzdCBzZWxlY3RlZCByb3dcbiAgICAqIGxldCBzZWxlY3RlZFJvd0RhdGEgPSB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzBdLmRhdGE7XG4gICAgKiBgYGBcbiAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBkYXRhKCk6IElQaXZvdEdyaWRSZWNvcmQge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGRhdGEodjogSVBpdm90R3JpZFJlY29yZCkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBwaXZvdEFnZ3JlZ2F0aW9uRGF0YSgpIHtcbiAgICAgICAgY29uc3QgYWdncmVnYXRpb25zID0gdGhpcy5kYXRhLmFnZ3JlZ2F0aW9uVmFsdWVzO1xuICAgICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgICAgYWdncmVnYXRpb25zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDZWxsQ2xhc3MoY29sOiBJZ3hDb2x1bW5Db21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5ncmlkLnZhbHVlcztcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbMF0uc3R5bGVzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbE5hbWUgPSBjb2wuZmllbGQuc3BsaXQodGhpcy5ncmlkLnBpdm90S2V5cy5jb2x1bW5EaW1lbnNpb25TZXBhcmF0b3IpO1xuICAgICAgICBjb25zdCBtZWFzdXJlTmFtZSA9IGNvbE5hbWVbY29sTmFtZS5sZW5ndGggLSAxXTtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5maW5kKHYgPT4gdi5tZW1iZXIgPT09IG1lYXN1cmVOYW1lKT8uc3R5bGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0NlbGxBY3RpdmUodmlzaWJsZUNvbHVtbkluZGV4KSB7XG4gICAgICAgIGNvbnN0IG5hdiA9IHRoaXMuZ3JpZC5uYXZpZ2F0aW9uXG4gICAgICAgIGNvbnN0IG5vZGUgPSBuYXYuYWN0aXZlTm9kZTtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgT2JqZWN0LmtleXMobm9kZSkubGVuZ3RoICE9PSAwID9cbiAgICAgICAgICAgICFuYXYuaXNSb3dIZWFkZXJBY3RpdmUgJiZcbiAgICAgICAgICAgIHN1cGVyLmlzQ2VsbEFjdGl2ZSh2aXNpYmxlQ29sdW1uSW5kZXgpIDpcbiAgICAgICAgICAgIGZhbHNlO1xuICAgIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZSBpZ3hHcmlkRm9yIGxldC1jb2wgW2lneEdyaWRGb3JPZl09XCJ1bnBpbm5lZENvbHVtbnMgfCBpZ3hOb3RHcm91cGVkXCJcbiAgICBbaWd4Rm9yU2Nyb2xsQ29udGFpbmVyXT1cImdyaWQucGFyZW50VmlydERpclwiIGxldC1jb2xJbmRleD1cImluZGV4XCIgW2lneEZvclNpemVQcm9wTmFtZV09J1wiY2FsY1BpeGVsV2lkdGhcIidcbiAgICBbaWd4Rm9yU2Nyb2xsT3JpZW50YXRpb25dPVwiJ2hvcml6b250YWwnXCIgW2lneEZvckNvbnRhaW5lclNpemVdPSdncmlkLnVucGlubmVkV2lkdGgnXG4gICAgW2lneEZvclRyYWNrQnldPSdncmlkLnRyYWNrQ29sdW1uQ2hhbmdlcycgI2lneERpclJlZj5cbiAgICA8aWd4LWdyaWQtY2VsbCAjY2VsbCBjbGFzcz1cImlneC1ncmlkX190ZCBpZ3gtZ3JpZF9fdGQtLWZ3XCJcbiAgICAgICAgW2NsYXNzLmlneC1ncmlkX190ZC0tZWRpdGVkXT1cImtleSB8IHRyYW5zYWN0aW9uU3RhdGU6Y29sLmZpZWxkOmdyaWQucm93RWRpdGFibGU6Z3JpZC50cmFuc2FjdGlvbnM6Z3JpZC5waXBlVHJpZ2dlcjpncmlkLmdyaWRBUEkuY3J1ZFNlcnZpY2UuY2VsbDpncmlkLmdyaWRBUEkuY3J1ZFNlcnZpY2Uucm93XCJcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJncmlkSUQgKyAnXycgKyBjb2wuZmllbGQgfCBpZ3hTdHJpbmdSZXBsYWNlOicuJzonXydcIlxuICAgICAgICBbY2xhc3MuaWd4LWdyaWRfX3RkLS1udW1iZXJdPVwiY29sLmRhdGFUeXBlID09PSAnbnVtYmVyJyB8fCBjb2wuZGF0YVR5cGUgPT09ICdwZXJjZW50JyB8fCBjb2wuZGF0YVR5cGUgPT09ICdjdXJyZW5jeSdcIlxuICAgICAgICBbY2xhc3MuaWd4LWdyaWRfX3RkLS1ib29sXT1cImNvbC5kYXRhVHlwZSA9PT0gJ2Jvb2xlYW4nXCJcbiAgICAgICAgW25nQ2xhc3NdPVwidGhpcy5nZXRDZWxsQ2xhc3MoY29sKSB8IGlneENlbGxTdHlsZUNsYXNzZXM6ZGF0YVtjb2wuZmllbGRdOnBpdm90QWdncmVnYXRpb25EYXRhOmNvbC5maWVsZDp2aWV3SW5kZXg6Z3JpZC5waXBlVHJpZ2dlclwiXG4gICAgICAgIFtuZ1N0eWxlXT1cImNvbC5jZWxsU3R5bGVzIHwgaWd4Q2VsbFN0eWxlczpwaXZvdEFnZ3JlZ2F0aW9uRGF0YVtjb2wuZmllbGRdOnBpdm90QWdncmVnYXRpb25EYXRhOmNvbC5maWVsZDp2aWV3SW5kZXg6Z3JpZC5waXBlVHJpZ2dlclwiXG4gICAgICAgIFtlZGl0TW9kZV09XCJjb2wuZWRpdGFibGUgJiYgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLnRhcmdldEluRWRpdChpbmRleCwgY29sLmluZGV4KVwiIFtjb2x1bW5dPVwiY29sXCJcbiAgICAgICAgW2Zvcm1hdHRlcl09XCJjb2wuZm9ybWF0dGVyXCIgW2ludFJvd109XCJ0aGlzXCIgW2FjdGl2ZV09XCJpc0NlbGxBY3RpdmUoY29sLnZpc2libGVJbmRleClcIlxuICAgICAgICBbc3R5bGUubWluLWhlaWdodC5weF09XCJjZWxsSGVpZ2h0XCIgW3Jvd0RhdGFdPVwicGl2b3RBZ2dyZWdhdGlvbkRhdGFcIiBbc3R5bGUubWluLXdpZHRoXT1cImNvbC53aWR0aFwiIFtzdHlsZS5tYXgtd2lkdGhdPVwiY29sLndpZHRoXCJcbiAgICAgICAgW3N0eWxlLmZsZXgtYmFzaXNdPVwiY29sLndpZHRoXCIgW3dpZHRoXT1cImNvbC5nZXRDZWxsV2lkdGgoKVwiIFt2aXNpYmxlQ29sdW1uSW5kZXhdPVwiY29sLnZpc2libGVJbmRleFwiXG4gICAgICAgIFt2YWx1ZV09XCJwaXZvdEFnZ3JlZ2F0aW9uRGF0YVtjb2wuZmllbGRdIHwgZGF0YU1hcHBlcjpjb2wuZmllbGQ6Z3JpZC5waXBlVHJpZ2dlcjpwaXZvdEFnZ3JlZ2F0aW9uRGF0YVtjb2wuZmllbGRdOmNvbC5oYXNOZXN0ZWRQYXRoXCJcbiAgICAgICAgW2NlbGxUZW1wbGF0ZV09XCJjb2wuYm9keVRlbXBsYXRlXCIgW2xhc3RTZWFyY2hJbmZvXT1cImdyaWQubGFzdFNlYXJjaEluZm9cIlxuICAgICAgICBbY2VsbFNlbGVjdGlvbk1vZGVdPVwiZ3JpZC5jZWxsU2VsZWN0aW9uXCIgW2Rpc3BsYXlQaW5uZWRDaGlwXT1cInNob3VsZERpc3BsYXlQaW5uZWRDaGlwKGNvbC52aXNpYmxlSW5kZXgpXCJcbiAgICAgICAgKHBvaW50ZXJkb3duKT1cImdyaWQubmF2aWdhdGlvbi5mb2N1c091dFJvd0hlYWRlcigkZXZlbnQpXCI+XG4gICAgPC9pZ3gtZ3JpZC1jZWxsPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNyb3dTZWxlY3RvckJhc2VUZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWdyaWRfX2NieC1wYWRkaW5nXCI+XG4gICAgICAgIDxpZ3gtY2hlY2tib3ggW3RhYmluZGV4XT1cIi0xXCIgW3JlYWRvbmx5XT1cInRydWVcIiBbY2hlY2tlZF09XCJzZWxlY3RlZFwiIFtkaXNhYmxlUmlwcGxlXT1cInRydWVcIiBbZGlzYWJsZWRdPVwiZGVsZXRlZFwiXG4gICAgICAgICAgICBbZGlzYWJsZVRyYW5zaXRpb25zXT1cImdyaWQuZGlzYWJsZVRyYW5zaXRpb25zXCIgW2FyaWEtbGFiZWxdPVwicm93Q2hlY2tib3hBcmlhTGFiZWxcIj5cbiAgICAgICAgPC9pZ3gtY2hlY2tib3g+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG4iXX0=