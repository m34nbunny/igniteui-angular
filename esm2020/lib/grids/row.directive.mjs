import { Directive, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IgxCheckboxComponent } from '../checkbox/checkbox.component';
import { IgxGridForOfDirective } from '../directives/for-of/for_of.directive';
import { TransactionType } from '../services/transaction/transaction';
import { IgxAddRow, IgxEditRow } from './common/crud.service';
import { IGX_GRID_BASE } from './common/grid.interface';
import mergeWith from 'lodash.mergewith';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./selection/selection.service";
export class IgxRowDirective {
    constructor(grid, selectionService, element, cdr) {
        this.grid = grid;
        this.selectionService = selectionService;
        this.element = element;
        this.cdr = cdr;
        /**
         * @hidden
         */
        this.addAnimationEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.role = 'row';
        /**
         * Sets whether this specific row has disabled functionality for editing and row selection.
         * Default value is `false`.
         * ```typescript
         * this.grid.selectedRows[0].pinned = true;
         * ```
         */
        this.disabled = false;
        /**
         * @hidden
         */
        this.focused = false;
        /**
         * @hidden
         * @internal
         */
        this.defaultCssClass = 'igx-grid__tr';
        /**
         * @hidden
         */
        this.triggerAddAnimationClass = false;
        this.destroy$ = new Subject();
    }
    /**
     *  The data passed to the row component.
     *
     * ```typescript
     * // get the row data for the first selected row
     * let selectedRowData = this.grid.selectedRows[0].data;
     * ```
     */
    get data() {
        if (this.inEditMode) {
            return mergeWith(this.grid.dataCloneStrategy.clone(this._data), this.grid.transactions.getAggregatedValue(this.key, false), (objValue, srcValue) => {
                if (Array.isArray(srcValue)) {
                    return objValue = srcValue;
                }
            });
        }
        return this._data;
    }
    set data(v) {
        this._data = v;
    }
    /**
     * Sets whether the row is pinned.
     * Default value is `false`.
     * ```typescript
     * this.grid.selectedRows[0].pinned = true;
     * ```
     */
    set pinned(value) {
        if (value) {
            this.grid.pinRow(this.key);
        }
        else {
            this.grid.unpinRow(this.key);
        }
    }
    /**
     * Gets whether the row is pinned.
     * ```typescript
     * let isPinned = row.pinned;
     * ```
     */
    get pinned() {
        return this.grid.isRecordPinned(this.data);
    }
    /**
     * Gets the expanded state of the row.
     * ```typescript
     * let isExpanded = row.expanded;
     * ```
     */
    get expanded() {
        return this.grid.gridAPI.get_row_expansion_state(this.data);
    }
    /**
     * Expands/collapses the current row.
     *
     * ```typescript
     * this.grid.selectedRows[2].expanded = true;
     * ```
     */
    set expanded(val) {
        this.grid.gridAPI.set_row_expansion_state(this.key, val);
    }
    get addRowUI() {
        return !!this.grid.crudService.row &&
            this.grid.crudService.row.getClassName() === IgxAddRow.name &&
            this.grid.crudService.row.id === this.key;
    }
    get rowHeight() {
        let height = this.grid.rowHeight || 32;
        if (this.grid.hasColumnLayouts) {
            const maxRowSpan = this.grid.multiRowLayoutRowSize;
            height = height * maxRowSpan;
        }
        return this.addRowUI ? height : null;
    }
    get cellHeight() {
        return this.addRowUI && !this.inEditMode ? null : this.grid.rowHeight || 32;
    }
    get virtDirRow() {
        return this._virtDirRow ? this._virtDirRow.first : null;
    }
    /**
     * Gets the rendered cells in the row component.
     *
     * ```typescript
     * // get the cells of the third selected row
     * let selectedRowCells = this.grid.selectedRows[2].cells;
     * ```
     */
    get cells() {
        const res = new QueryList();
        if (!this._cells) {
            return res;
        }
        const cList = this._cells.filter((item) => item.nativeElement.parentElement !== null)
            .sort((item1, item2) => item1.column.visibleIndex - item2.column.visibleIndex);
        res.reset(cList);
        return res;
    }
    get dataRowIndex() {
        return this.index;
    }
    /**
     * @hidden
     */
    get selected() {
        return this.selectionService.isRowSelected(this.key);
    }
    set selected(value) {
        if (value) {
            this.selectionService.selectRowsWithNoEvent([this.key]);
        }
        else {
            this.selectionService.deselectRowsWithNoEvent([this.key]);
        }
        this.grid.cdr.markForCheck();
    }
    /**
     * @hidden
     */
    get columns() {
        return this.grid.visibleColumns;
    }
    /**
     * @hidden
     * @internal
     */
    get viewIndex() {
        if (this.grid.groupingExpressions.length) {
            return this.grid.filteredSortedData.indexOf(this.data);
        }
        return this.index + this.grid.page * this.grid.perPage;
    }
    /**
     * @hidden
     */
    get pinnedColumns() {
        return this.grid.pinnedColumns;
    }
    /**
     * @hidden
     */
    get isRoot() {
        return true;
    }
    /**
     * @hidden
     */
    get hasChildren() {
        return false;
    }
    /**
     * @hidden
     */
    get unpinnedColumns() {
        return this.grid.unpinnedColumns;
    }
    /**
     * @hidden
     */
    get showRowSelectors() {
        return this.grid.showRowSelectors;
    }
    /** @hidden */
    get dirty() {
        const row = this.grid.transactions.getState(this.key);
        if (row) {
            return row.type === TransactionType.ADD || row.type === TransactionType.UPDATE;
        }
        return false;
    }
    /**
     * @hidden
     */
    get rowDraggable() {
        return this.grid.rowDraggable;
    }
    /** @hidden */
    get added() {
        const row = this.grid.transactions.getState(this.key);
        if (row) {
            return row.type === TransactionType.ADD;
        }
        return false;
    }
    /** @hidden */
    get deleted() {
        return this.grid.gridAPI.row_deleted_transaction(this.key);
    }
    /**
     * @hidden
     */
    get dragging() {
        return this.grid.dragRowID === this.key;
    }
    // TODO: Refactor
    get inEditMode() {
        if (this.grid.rowEditable) {
            const editRowState = this.grid.crudService.row;
            return (editRowState && editRowState.id === this.key) || false;
        }
        else {
            return false;
        }
    }
    /**
     * Gets the ID of the row.
     * A row in the grid is identified either by:
     * - primaryKey data value,
     * - the whole data, if the primaryKey is omitted.
     *
     * ```typescript
     * let rowID = this.grid.selectedRows[2].key;
     * ```
     */
    get key() {
        const primaryKey = this.grid.primaryKey;
        if (this._data) {
            return primaryKey ? this._data[primaryKey] : this._data;
        }
        else {
            return undefined;
        }
    }
    /**
     * The native DOM element representing the row. Could be null in certain environments.
     *
     * ```typescript
     * // get the nativeElement of the second selected row
     * let selectedRowNativeElement = this.grid.selectedRows[1].nativeElement;
     * ```
     */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /**
     * @hidden
     * @internal
     */
    onClick(event) {
        if (this.grid.rowSelection === 'none' || this.deleted || !this.grid.selectRowOnClick) {
            return;
        }
        if (event.shiftKey && this.grid.isMultiRowSelectionEnabled) {
            this.selectionService.selectMultipleRows(this.key, this.data, event);
            return;
        }
        // eslint-disable-next-line no-bitwise
        const clearSelection = !(+event.ctrlKey ^ +event.metaKey);
        this.selectionService.selectRowById(this.key, clearSelection, event);
    }
    /**
     * @hidden
     * @internal
     */
    showActionStrip() {
        if (this.grid.actionStrip) {
            this.grid.actionStrip.show(this);
        }
    }
    /**
     * @hidden
     * @internal
     */
    ngAfterViewInit() {
        // If the template of the row changes, the forOf in it is recreated and is not detected by the grid and rows can't be scrolled.
        this._virtDirRow.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.grid.resetHorizontalVirtualization());
    }
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /**
     * @hidden
     */
    onRowSelectorClick(event) {
        event.stopPropagation();
        if (event.shiftKey && this.grid.isMultiRowSelectionEnabled) {
            this.selectionService.selectMultipleRows(this.key, this.data, event);
            return;
        }
        if (this.selected) {
            this.selectionService.deselectRow(this.key, event);
        }
        else {
            this.selectionService.selectRowById(this.key, false, event);
        }
    }
    /**
     * Updates the specified row object and the data source record with the passed value.
     *
     * ```typescript
     * // update the second selected row's value
     * let newValue = "Apple";
     * this.grid.selectedRows[1].update(newValue);
     * ```
     */
    update(value) {
        const crudService = this.grid.crudService;
        if (crudService.cellInEditMode && crudService.cell.id.key === this.key) {
            this.grid.transactions.endPending(false);
        }
        const row = new IgxEditRow(this.key, this.index, this.data, this.grid);
        this.grid.gridAPI.update_row(row, value);
        this.cdr.markForCheck();
    }
    /**
     * Removes the specified row from the grid's data source.
     * This method emits `rowDeleted` event.
     *
     * ```typescript
     * // delete the third selected row from the grid
     * this.grid.selectedRows[2].delete();
     * ```
     */
    delete() {
        this.grid.deleteRowById(this.key);
    }
    isCellActive(visibleColumnIndex) {
        const node = this.grid.navigation.activeNode;
        return node ? node.row === this.index && node.column === visibleColumnIndex : false;
    }
    /**
     * Pins the specified row.
     * This method emits `rowPinning`\`rowPinned` event.
     *
     * ```typescript
     * // pin the selected row from the grid
     * this.grid.selectedRows[0].pin();
     * ```
     */
    pin() {
        return this.grid.pinRow(this.key);
    }
    /**
     * Unpins the specified row.
     * This method emits `rowPinning`\`rowPinned` event.
     *
     * ```typescript
     * // unpin the selected row from the grid
     * this.grid.selectedRows[0].unpin();
     * ```
     */
    unpin() {
        return this.grid.unpinRow(this.key);
    }
    /**
     * @hidden
     */
    get rowCheckboxAriaLabel() {
        return this.grid.primaryKey ?
            this.selected ? 'Deselect row with key ' + this.key : 'Select row with key ' + this.key :
            this.selected ? 'Deselect row' : 'Select row';
    }
    /**
     * @hidden
     */
    ngDoCheck() {
        this.cdr.markForCheck();
    }
    /**
     * @hidden
     */
    shouldDisplayPinnedChip(visibleColumnIndex) {
        return this.pinned && this.disabled && visibleColumnIndex === 0;
    }
    /**
     * Spawns the add row UI for the specific row.
     *
     * @example
     * ```typescript
     * const row = this.grid1.getRowByIndex(1);
     * row.beginAddRow();
     * ```
     */
    beginAddRow() {
        this.grid.crudService.enterAddRowMode(this);
    }
    /**
     * @hidden
     */
    triggerAddAnimation() {
        this.triggerAddAnimationClass = true;
    }
    /**
     * @hidden
     */
    animationEndHandler() {
        this.triggerAddAnimationClass = false;
        this.addAnimationEnd.emit(this);
    }
    /**
     * @hidden
     */
    get resolveDragIndicatorClasses() {
        const defaultDragIndicatorCssClass = 'igx-grid__drag-indicator';
        const dragIndicatorOff = this.grid.rowDragging && !this.dragging ? 'igx-grid__drag-indicator--off' : '';
        return `${defaultDragIndicatorCssClass} ${dragIndicatorOff}`;
    }
}
IgxRowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRowDirective, deps: [{ token: IGX_GRID_BASE }, { token: i1.IgxGridSelectionService }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxRowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxRowDirective, selector: "[igxRowBaseComponent]", inputs: { data: "data", index: "index", disabled: "disabled", gridID: "gridID", selected: "selected" }, outputs: { addAnimationEnd: "addAnimationEnd" }, host: { listeners: { "click": "onClick($event)", "mouseenter": "showActionStrip()" }, properties: { "attr.role": "this.role", "attr.aria-disabled": "this.disabled", "class.igx-grid__tr--disabled": "this.disabled", "style.min-height.px": "this.rowHeight", "attr.data-rowIndex": "this.dataRowIndex", "attr.aria-selected": "this.selected" } }, viewQueries: [{ propertyName: "checkboxElement", first: true, predicate: i0.forwardRef(function () { return IgxCheckboxComponent; }), descendants: true, read: IgxCheckboxComponent }, { propertyName: "_virtDirRow", predicate: ["igxDirRef"], descendants: true, read: IgxGridForOfDirective }, { propertyName: "_cells", predicate: ["cell"], descendants: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRowDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[igxRowBaseComponent]' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i1.IgxGridSelectionService }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { addAnimationEnd: [{
                type: Output
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], data: [{
                type: Input
            }], index: [{
                type: Input
            }], disabled: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-disabled']
            }, {
                type: HostBinding,
                args: ['class.igx-grid__tr--disabled']
            }], rowHeight: [{
                type: HostBinding,
                args: ['style.min-height.px']
            }], gridID: [{
                type: Input
            }], _virtDirRow: [{
                type: ViewChildren,
                args: ['igxDirRef', { read: IgxGridForOfDirective }]
            }], checkboxElement: [{
                type: ViewChild,
                args: [forwardRef(() => IgxCheckboxComponent), { read: IgxCheckboxComponent }]
            }], _cells: [{
                type: ViewChildren,
                args: ['cell']
            }], dataRowIndex: [{
                type: HostBinding,
                args: ['attr.data-rowIndex']
            }], selected: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-selected']
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], showActionStrip: [{
                type: HostListener,
                args: ['mouseenter']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9yb3cuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFHSCxTQUFTLEVBR1QsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNmLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV0RSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzlELE9BQU8sRUFBa0MsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDeEYsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQUczQyxNQUFNLE9BQU8sZUFBZTtJQTBWeEIsWUFDa0MsSUFBYyxFQUNyQyxnQkFBeUMsRUFDekMsT0FBZ0MsRUFDaEMsR0FBc0I7UUFIQyxTQUFJLEdBQUosSUFBSSxDQUFVO1FBQ3JDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDekMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7UUFDaEMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUE3VmpDOztXQUVHO1FBRUksb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUU3RDs7V0FF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O2dCQUl2RSxNQUFNO3NCQURmLFlBQVk7dUJBQUMsTUFBTTtnQkF1QlQsWUFBWTtzQkFEdEIsV0FBVzt1QkFBQyxvQkFBb0I7Z0JBVXRCLFFBQVE7c0JBRmxCLEtBQUs7O3NCQUNMLFdBQVc7dUJBQUMsb0JBQW9CO2dCQWtMMUIsT0FBTztzQkFEYixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFvQjFCLGVBQWU7c0JBRHJCLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBEaXJlY3RpdmUsXG4gICAgRG9DaGVjayxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBmb3J3YXJkUmVmLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgT25EZXN0cm95LFxuICAgIE91dHB1dCxcbiAgICBRdWVyeUxpc3QsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneENoZWNrYm94Q29tcG9uZW50IH0gZnJvbSAnLi4vY2hlY2tib3gvY2hlY2tib3guY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRGb3JPZkRpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvZm9yLW9mL2Zvcl9vZi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25UeXBlIH0gZnJvbSAnLi4vc2VydmljZXMvdHJhbnNhY3Rpb24vdHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3NlbGVjdGlvbi9zZWxlY3Rpb24uc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hBZGRSb3csIElneEVkaXRSb3cgfSBmcm9tICcuL2NvbW1vbi9jcnVkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VsbFR5cGUsIENvbHVtblR5cGUsIEdyaWRUeXBlLCBJR1hfR1JJRF9CQVNFIH0gZnJvbSAnLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IG1lcmdlV2l0aCBmcm9tICdsb2Rhc2gubWVyZ2V3aXRoJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2lneFJvd0Jhc2VDb21wb25lbnRdJyB9KVxuZXhwb3J0IGNsYXNzIElneFJvd0RpcmVjdGl2ZSBpbXBsZW1lbnRzIERvQ2hlY2ssIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBhZGRBbmltYXRpb25FbmQgPSBuZXcgRXZlbnRFbWl0dGVyPElneFJvd0RpcmVjdGl2ZT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIHJvbGUgPSAncm93JztcblxuICAgIC8qKlxuICAgICAqICBUaGUgZGF0YSBwYXNzZWQgdG8gdGhlIHJvdyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0IHRoZSByb3cgZGF0YSBmb3IgdGhlIGZpcnN0IHNlbGVjdGVkIHJvd1xuICAgICAqIGxldCBzZWxlY3RlZFJvd0RhdGEgPSB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzBdLmRhdGE7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXMuaW5FZGl0TW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lcmdlV2l0aCh0aGlzLmdyaWQuZGF0YUNsb25lU3RyYXRlZ3kuY2xvbmUodGhpcy5fZGF0YSksIHRoaXMuZ3JpZC50cmFuc2FjdGlvbnMuZ2V0QWdncmVnYXRlZFZhbHVlKHRoaXMua2V5LCBmYWxzZSksXG4gICAgICAgICAgICAgICAgKG9ialZhbHVlLCBzcmNWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzcmNWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBkYXRhKHY6IGFueSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gdjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGluZGV4IG9mIHRoZSByb3cuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgc2Vjb25kIHNlbGVjdGVkIHJvd1xuICAgICAqIGxldCBzZWxlY3RlZFJvd0luZGV4ID0gdGhpcy5ncmlkLnNlbGVjdGVkUm93c1sxXS5pbmRleDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpbmRleDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB3aGV0aGVyIHRoaXMgc3BlY2lmaWMgcm93IGhhcyBkaXNhYmxlZCBmdW5jdGlvbmFsaXR5IGZvciBlZGl0aW5nIGFuZCByb3cgc2VsZWN0aW9uLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYGZhbHNlYC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLnNlbGVjdGVkUm93c1swXS5waW5uZWQgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtZGlzYWJsZWQnKVxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWRfX3RyLS1kaXNhYmxlZCcpXG4gICAgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHdoZXRoZXIgdGhlIHJvdyBpcyBwaW5uZWQuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzBdLnBpbm5lZCA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBwaW5uZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQucGluUm93KHRoaXMua2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC51bnBpblJvdyh0aGlzLmtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIHJvdyBpcyBwaW5uZWQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc1Bpbm5lZCA9IHJvdy5waW5uZWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBwaW5uZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQuaXNSZWNvcmRQaW5uZWQodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgcm93LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNFeHBhbmRlZCA9IHJvdy5leHBhbmRlZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmdyaWRBUEkuZ2V0X3Jvd19leHBhbnNpb25fc3RhdGUodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHBhbmRzL2NvbGxhcHNlcyB0aGUgY3VycmVudCByb3cuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5ncmlkLnNlbGVjdGVkUm93c1syXS5leHBhbmRlZCA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBleHBhbmRlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5ncmlkLmdyaWRBUEkuc2V0X3Jvd19leHBhbnNpb25fc3RhdGUodGhpcy5rZXksIHZhbCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBhZGRSb3dVSSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93ICYmXG4gICAgICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93LmdldENsYXNzTmFtZSgpID09PSBJZ3hBZGRSb3cubmFtZSAmJlxuICAgICAgICAgICAgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLnJvdy5pZCA9PT0gdGhpcy5rZXk7XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5taW4taGVpZ2h0LnB4JylcbiAgICBwdWJsaWMgZ2V0IHJvd0hlaWdodCgpIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuZ3JpZC5yb3dIZWlnaHQgfHwgMzI7XG4gICAgICAgIGlmICh0aGlzLmdyaWQuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgY29uc3QgbWF4Um93U3BhbiA9IHRoaXMuZ3JpZC5tdWx0aVJvd0xheW91dFJvd1NpemU7XG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgKiBtYXhSb3dTcGFuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFJvd1VJID8gaGVpZ2h0IDogbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNlbGxIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFJvd1VJICYmICF0aGlzLmluRWRpdE1vZGUgPyBudWxsIDogdGhpcy5ncmlkLnJvd0hlaWdodCB8fCAzMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ3JpZElEOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbignaWd4RGlyUmVmJywgeyByZWFkOiBJZ3hHcmlkRm9yT2ZEaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgX3ZpcnREaXJSb3c6IFF1ZXJ5TGlzdDxJZ3hHcmlkRm9yT2ZEaXJlY3RpdmU8YW55Pj47XG5cbiAgICBwdWJsaWMgZ2V0IHZpcnREaXJSb3coKTogSWd4R3JpZEZvck9mRGlyZWN0aXZlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlydERpclJvdyA/IHRoaXMuX3ZpcnREaXJSb3cuZmlyc3QgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKGZvcndhcmRSZWYoKCkgPT4gSWd4Q2hlY2tib3hDb21wb25lbnQpLCB7IHJlYWQ6IElneENoZWNrYm94Q29tcG9uZW50IH0pXG4gICAgcHVibGljIGNoZWNrYm94RWxlbWVudDogSWd4Q2hlY2tib3hDb21wb25lbnQ7XG5cbiAgICBAVmlld0NoaWxkcmVuKCdjZWxsJylcbiAgICBwcm90ZWN0ZWQgX2NlbGxzOiBRdWVyeUxpc3Q8Q2VsbFR5cGU+O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcmVuZGVyZWQgY2VsbHMgaW4gdGhlIHJvdyBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogLy8gZ2V0IHRoZSBjZWxscyBvZiB0aGUgdGhpcmQgc2VsZWN0ZWQgcm93XG4gICAgICogbGV0IHNlbGVjdGVkUm93Q2VsbHMgPSB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzJdLmNlbGxzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY2VsbHMoKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBRdWVyeUxpc3Q8Q2VsbFR5cGU+KCk7XG4gICAgICAgIGlmICghdGhpcy5fY2VsbHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY0xpc3QgPSB0aGlzLl9jZWxscy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBudWxsKVxuICAgICAgICAgICAgLnNvcnQoKGl0ZW0xLCBpdGVtMikgPT4gaXRlbTEuY29sdW1uLnZpc2libGVJbmRleCAtIGl0ZW0yLmNvbHVtbi52aXNpYmxlSW5kZXgpO1xuICAgICAgICByZXMucmVzZXQoY0xpc3QpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnYXR0ci5kYXRhLXJvd0luZGV4JylcbiAgICBwdWJsaWMgZ2V0IGRhdGFSb3dJbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtc2VsZWN0ZWQnKVxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuaXNSb3dTZWxlY3RlZCh0aGlzLmtleSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RSb3dzV2l0aE5vRXZlbnQoW3RoaXMua2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZGVzZWxlY3RSb3dzV2l0aE5vRXZlbnQoW3RoaXMua2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmlkLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgIHB1YmxpYyBnZXQgY29sdW1ucygpOiBDb2x1bW5UeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnZpc2libGVDb2x1bW5zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHZpZXdJbmRleCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoKHRoaXMuZ3JpZCBhcyBhbnkpLmdyb3VwaW5nRXhwcmVzc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmZpbHRlcmVkU29ydGVkRGF0YS5pbmRleE9mKHRoaXMuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggKyB0aGlzLmdyaWQucGFnZSAqIHRoaXMuZ3JpZC5wZXJQYWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZENvbHVtbnMoKTogQ29sdW1uVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5waW5uZWRDb2x1bW5zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzUm9vdCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCB1bnBpbm5lZENvbHVtbnMoKTogQ29sdW1uVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC51bnBpbm5lZENvbHVtbnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd1Jvd1NlbGVjdG9ycygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5zaG93Um93U2VsZWN0b3JzO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBkaXJ0eSgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkLnRyYW5zYWN0aW9ucy5nZXRTdGF0ZSh0aGlzLmtleSk7XG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiByb3cudHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFERCB8fCByb3cudHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLlVQREFURTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCByb3dEcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQucm93RHJhZ2dhYmxlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBhZGRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkLnRyYW5zYWN0aW9ucy5nZXRTdGF0ZSh0aGlzLmtleSk7XG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiByb3cudHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFERDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgZGVsZXRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5ncmlkQVBJLnJvd19kZWxldGVkX3RyYW5zYWN0aW9uKHRoaXMua2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBkcmFnZ2luZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5kcmFnUm93SUQgPT09IHRoaXMua2V5O1xuICAgIH1cblxuICAgIC8vIFRPRE86IFJlZmFjdG9yXG4gICAgcHVibGljIGdldCBpbkVkaXRNb2RlKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5ncmlkLnJvd0VkaXRhYmxlKSB7XG4gICAgICAgICAgICBjb25zdCBlZGl0Um93U3RhdGUgPSB0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93O1xuICAgICAgICAgICAgcmV0dXJuIChlZGl0Um93U3RhdGUgJiYgZWRpdFJvd1N0YXRlLmlkID09PSB0aGlzLmtleSkgfHwgZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBJRCBvZiB0aGUgcm93LlxuICAgICAqIEEgcm93IGluIHRoZSBncmlkIGlzIGlkZW50aWZpZWQgZWl0aGVyIGJ5OlxuICAgICAqIC0gcHJpbWFyeUtleSBkYXRhIHZhbHVlLFxuICAgICAqIC0gdGhlIHdob2xlIGRhdGEsIGlmIHRoZSBwcmltYXJ5S2V5IGlzIG9taXR0ZWQuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHJvd0lEID0gdGhpcy5ncmlkLnNlbGVjdGVkUm93c1syXS5rZXk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBrZXkoKSB7XG4gICAgICAgIGNvbnN0IHByaW1hcnlLZXkgPSB0aGlzLmdyaWQucHJpbWFyeUtleTtcbiAgICAgICAgaWYgKHRoaXMuX2RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmltYXJ5S2V5ID8gdGhpcy5fZGF0YVtwcmltYXJ5S2V5XSA6IHRoaXMuX2RhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG5hdGl2ZSBET00gZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIHJvdy4gQ291bGQgYmUgbnVsbCBpbiBjZXJ0YWluIGVudmlyb25tZW50cy5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXQgdGhlIG5hdGl2ZUVsZW1lbnQgb2YgdGhlIHNlY29uZCBzZWxlY3RlZCByb3dcbiAgICAgKiBsZXQgc2VsZWN0ZWRSb3dOYXRpdmVFbGVtZW50ID0gdGhpcy5ncmlkLnNlbGVjdGVkUm93c1sxXS5uYXRpdmVFbGVtZW50O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXNlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZhdWx0Q3NzQ2xhc3MgPSAnaWd4LWdyaWRfX3RyJztcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJpZ2dlckFkZEFuaW1hdGlvbkNsYXNzID0gZmFsc2U7XG5cbiAgICBwcm90ZWN0ZWQgZGVzdHJveSQgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gICAgcHJvdGVjdGVkIF9kYXRhOiBhbnk7XG4gICAgcHJvdGVjdGVkIF9hZGRSb3c6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9CQVNFKSBwdWJsaWMgZ3JpZDogR3JpZFR5cGUsXG4gICAgICAgIHB1YmxpYyBzZWxlY3Rpb25TZXJ2aWNlOiBJZ3hHcmlkU2VsZWN0aW9uU2VydmljZSxcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBwdWJsaWMgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmdyaWQucm93U2VsZWN0aW9uID09PSAnbm9uZScgfHwgdGhpcy5kZWxldGVkIHx8ICF0aGlzLmdyaWQuc2VsZWN0Um93T25DbGljaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiB0aGlzLmdyaWQuaXNNdWx0aVJvd1NlbGVjdGlvbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RNdWx0aXBsZVJvd3ModGhpcy5rZXksIHRoaXMuZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgICAgICAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAhKCtldmVudC5jdHJsS2V5IF4gK2V2ZW50Lm1ldGFLZXkpO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0Um93QnlJZCh0aGlzLmtleSwgY2xlYXJTZWxlY3Rpb24sIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gICAgcHVibGljIHNob3dBY3Rpb25TdHJpcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5hY3Rpb25TdHJpcCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLmFjdGlvblN0cmlwLnNob3codGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgLy8gSWYgdGhlIHRlbXBsYXRlIG9mIHRoZSByb3cgY2hhbmdlcywgdGhlIGZvck9mIGluIGl0IGlzIHJlY3JlYXRlZCBhbmQgaXMgbm90IGRldGVjdGVkIGJ5IHRoZSBncmlkIGFuZCByb3dzIGNhbid0IGJlIHNjcm9sbGVkLlxuICAgICAgICB0aGlzLl92aXJ0RGlyUm93LmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmdyaWQucmVzZXRIb3Jpem9udGFsVmlydHVhbGl6YXRpb24oKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBvblJvd1NlbGVjdG9yQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiB0aGlzLmdyaWQuaXNNdWx0aVJvd1NlbGVjdGlvbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RNdWx0aXBsZVJvd3ModGhpcy5rZXksIHRoaXMuZGF0YSwgZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuZGVzZWxlY3RSb3codGhpcy5rZXksIGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RSb3dCeUlkKHRoaXMua2V5LCBmYWxzZSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc3BlY2lmaWVkIHJvdyBvYmplY3QgYW5kIHRoZSBkYXRhIHNvdXJjZSByZWNvcmQgd2l0aCB0aGUgcGFzc2VkIHZhbHVlLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIHVwZGF0ZSB0aGUgc2Vjb25kIHNlbGVjdGVkIHJvdydzIHZhbHVlXG4gICAgICogbGV0IG5ld1ZhbHVlID0gXCJBcHBsZVwiO1xuICAgICAqIHRoaXMuZ3JpZC5zZWxlY3RlZFJvd3NbMV0udXBkYXRlKG5ld1ZhbHVlKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgY29uc3QgY3J1ZFNlcnZpY2UgPSB0aGlzLmdyaWQuY3J1ZFNlcnZpY2U7XG4gICAgICAgIGlmIChjcnVkU2VydmljZS5jZWxsSW5FZGl0TW9kZSAmJiBjcnVkU2VydmljZS5jZWxsLmlkLmtleSA9PT0gdGhpcy5rZXkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC50cmFuc2FjdGlvbnMuZW5kUGVuZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm93ID0gbmV3IElneEVkaXRSb3codGhpcy5rZXksIHRoaXMuaW5kZXgsIHRoaXMuZGF0YSwgdGhpcy5ncmlkKTtcbiAgICAgICAgdGhpcy5ncmlkLmdyaWRBUEkudXBkYXRlX3Jvdyhyb3csIHZhbHVlKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIHJvdyBmcm9tIHRoZSBncmlkJ3MgZGF0YSBzb3VyY2UuXG4gICAgICogVGhpcyBtZXRob2QgZW1pdHMgYHJvd0RlbGV0ZWRgIGV2ZW50LlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGRlbGV0ZSB0aGUgdGhpcmQgc2VsZWN0ZWQgcm93IGZyb20gdGhlIGdyaWRcbiAgICAgKiB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzJdLmRlbGV0ZSgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBkZWxldGUoKSB7XG4gICAgICAgIHRoaXMuZ3JpZC5kZWxldGVSb3dCeUlkKHRoaXMua2V5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNDZWxsQWN0aXZlKHZpc2libGVDb2x1bW5JbmRleCkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ncmlkLm5hdmlnYXRpb24uYWN0aXZlTm9kZTtcbiAgICAgICAgcmV0dXJuIG5vZGUgPyBub2RlLnJvdyA9PT0gdGhpcy5pbmRleCAmJiBub2RlLmNvbHVtbiA9PT0gdmlzaWJsZUNvbHVtbkluZGV4IDogZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlucyB0aGUgc3BlY2lmaWVkIHJvdy5cbiAgICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBgcm93UGlubmluZ2BcXGByb3dQaW5uZWRgIGV2ZW50LlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIHBpbiB0aGUgc2VsZWN0ZWQgcm93IGZyb20gdGhlIGdyaWRcbiAgICAgKiB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzBdLnBpbigpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBwaW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWQucGluUm93KHRoaXMua2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnBpbnMgdGhlIHNwZWNpZmllZCByb3cuXG4gICAgICogVGhpcyBtZXRob2QgZW1pdHMgYHJvd1Bpbm5pbmdgXFxgcm93UGlubmVkYCBldmVudC5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyB1bnBpbiB0aGUgc2VsZWN0ZWQgcm93IGZyb20gdGhlIGdyaWRcbiAgICAgKiB0aGlzLmdyaWQuc2VsZWN0ZWRSb3dzWzBdLnVucGluKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHVucGluKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnVucGluUm93KHRoaXMua2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCByb3dDaGVja2JveEFyaWFMYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5wcmltYXJ5S2V5ID9cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPyAnRGVzZWxlY3Qgcm93IHdpdGgga2V5ICcgKyB0aGlzLmtleSA6ICdTZWxlY3Qgcm93IHdpdGgga2V5ICcgKyB0aGlzLmtleSA6XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID8gJ0Rlc2VsZWN0IHJvdycgOiAnU2VsZWN0IHJvdyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0RvQ2hlY2soKSB7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvdWxkRGlzcGxheVBpbm5lZENoaXAodmlzaWJsZUNvbHVtbkluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlubmVkICYmIHRoaXMuZGlzYWJsZWQgJiYgdmlzaWJsZUNvbHVtbkluZGV4ID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwYXducyB0aGUgYWRkIHJvdyBVSSBmb3IgdGhlIHNwZWNpZmljIHJvdy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZDEuZ2V0Um93QnlJbmRleCgxKTtcbiAgICAgKiByb3cuYmVnaW5BZGRSb3coKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgYmVnaW5BZGRSb3coKSB7XG4gICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5lbnRlckFkZFJvd01vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB0cmlnZ2VyQWRkQW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLnRyaWdnZXJBZGRBbmltYXRpb25DbGFzcyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBhbmltYXRpb25FbmRIYW5kbGVyKCkge1xuICAgICAgICB0aGlzLnRyaWdnZXJBZGRBbmltYXRpb25DbGFzcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFkZEFuaW1hdGlvbkVuZC5lbWl0KHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlc29sdmVEcmFnSW5kaWNhdG9yQ2xhc3NlcygpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBkZWZhdWx0RHJhZ0luZGljYXRvckNzc0NsYXNzID0gJ2lneC1ncmlkX19kcmFnLWluZGljYXRvcic7XG4gICAgICAgIGNvbnN0IGRyYWdJbmRpY2F0b3JPZmYgPSB0aGlzLmdyaWQucm93RHJhZ2dpbmcgJiYgIXRoaXMuZHJhZ2dpbmcgPyAnaWd4LWdyaWRfX2RyYWctaW5kaWNhdG9yLS1vZmYnIDogJyc7XG4gICAgICAgIHJldHVybiBgJHtkZWZhdWx0RHJhZ0luZGljYXRvckNzc0NsYXNzfSAke2RyYWdJbmRpY2F0b3JPZmZ9YDtcbiAgICB9XG59XG4iXX0=