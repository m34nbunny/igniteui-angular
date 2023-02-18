import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Input, TemplateRef, ViewChild, Inject } from '@angular/core';
import { formatPercent } from '@angular/common';
import { IgxTextHighlightDirective } from '../directives/text-highlight/text-highlight.directive';
import { formatCurrency, formatDate } from '../core/utils';
import { HammerGesturesManager } from '../core/touch';
import { GridSelectionMode } from './common/enums';
import { IGX_GRID_BASE } from './common/grid.interface';
import { getCurrencySymbol, getLocaleCurrencyCode } from '@angular/common';
import { GridColumnDataType } from '../data-operations/data-util';
import { IgxGridCell } from './grid-public-cell';
import * as i0 from "@angular/core";
import * as i1 from "./selection/selection.service";
import * as i2 from "../core/touch";
import * as i3 from "../core/utils";
import * as i4 from "../chips/chip.component";
import * as i5 from "../icon/icon.component";
import * as i6 from "../input-group/input-group.component";
import * as i7 from "../checkbox/checkbox.component";
import * as i8 from "../date-picker/date-picker.component";
import * as i9 from "../time-picker/time-picker.component";
import * as i10 from "@angular/common";
import * as i11 from "../directives/text-highlight/text-highlight.directive";
import * as i12 from "@angular/forms";
import * as i13 from "../directives/input/input.directive";
import * as i14 from "../directives/focus/focus.directive";
import * as i15 from "../directives/date-time-editor/date-time-editor.directive";
import * as i16 from "../directives/prefix/prefix.directive";
import * as i17 from "../directives/suffix/suffix.directive";
import * as i18 from "./common/pipes";
/**
 * Providing reference to `IgxGridCellComponent`:
 * ```typescript
 * @ViewChild('grid', { read: IgxGridComponent })
 *  public grid: IgxGridComponent;
 * ```
 * ```typescript
 *  let column = this.grid.columnList.first;
 * ```
 * ```typescript
 *  let cell = column.cells[0];
 * ```
 */
export class IgxGridCellComponent {
    constructor(selectionService, grid, cdr, element, zone, touchManager, platformUtil) {
        this.selectionService = selectionService;
        this.grid = grid;
        this.cdr = cdr;
        this.element = element;
        this.zone = zone;
        this.touchManager = touchManager;
        this.platformUtil = platformUtil;
        /**
         * @hidden
         * @internal
         */
        this.lastPinned = false;
        /**
         * @hidden
         * @internal
         */
        this.firstPinned = false;
        /**
         * Returns whether the cell is in edit mode.
         */
        this.editMode = false;
        /**
         * Sets/get the `role` property of the cell.
         * Default value is `"gridcell"`.
         * ```typescript
         * this.cell.role = 'grid-cell';
         * ```
         * ```typescript
         * let cellRole = this.cell.role;
         * ```
         *
         * @memberof IgxGridCellComponent
         */
        this.role = 'gridcell';
        /**
         * Gets the width of the cell.
         * ```typescript
         * let cellWidth = this.cell.width;
         * ```
         *
         * @memberof IgxGridCellComponent
         */
        this.width = '';
        /**
         * @hidden
         */
        this.active = false;
        /**
         * @hidden
         */
        this.displayPinnedChip = false;
        /**
         * Sets/gets the highlight class of the cell.
         * Default value is `"igx-highlight"`.
         * ```typescript
         * let highlightClass = this.cell.highlightClass;
         * ```
         * ```typescript
         * this.cell.highlightClass = 'igx-cell-highlight';
         * ```
         *
         * @memberof IgxGridCellComponent
         */
        this.highlightClass = 'igx-highlight';
        /**
         * Sets/gets the active highlight class class of the cell.
         * Default value is `"igx-highlight__active"`.
         * ```typescript
         * let activeHighlightClass = this.cell.activeHighlightClass;
         * ```
         * ```typescript
         * this.cell.activeHighlightClass = 'igx-cell-highlight_active';
         * ```
         *
         * @memberof IgxGridCellComponent
         */
        this.activeHighlightClass = 'igx-highlight__active';
        this._cellSelection = GridSelectionMode.multiple;
        this._vIndex = -1;
        /**
         * @hidden
         * @internal
         */
        this.onDoubleClick = (event) => {
            if (event.type === 'doubletap') {
                // prevent double-tap to zoom on iOS
                event.preventDefault();
            }
            if (this.editable && !this.editMode && !this.intRow.deleted && !this.grid.crudService.rowEditingBlocked) {
                this.grid.crudService.enterEditMode(this, event);
            }
            this.grid.doubleClick.emit({
                cell: this.getCellType(),
                event
            });
        };
        /**
         *
         * @hidden
         * @internal
         */
        this.pointerdown = (event) => {
            if (this.cellSelectionMode !== GridSelectionMode.multiple) {
                this.activate(event);
                return;
            }
            if (!this.platformUtil.isLeftClick(event)) {
                event.preventDefault();
                this.grid.navigation.setActiveNode({ rowIndex: this.rowIndex, colIndex: this.visibleColumnIndex });
                this.selectionService.addKeyboardRange();
                this.selectionService.initKeyboardState();
                this.selectionService.primaryButton = false;
                // Ensure RMB Click on edited cell does not end cell editing
                if (!this.selected) {
                    this.grid.crudService.updateCell(true, event);
                }
                return;
            }
            this.selectionService.pointerDown(this.selectionNode, event.shiftKey, event.ctrlKey);
            this.activate(event);
        };
        /**
         *
         * @hidden
         * @internal
         */
        this.pointerenter = (event) => {
            const isHierarchicalGrid = this.grid.nativeElement.tagName.toLowerCase() === 'igx-hierarchical-grid';
            if (isHierarchicalGrid && (!this.grid.navigation?.activeNode?.gridID || this.grid.navigation.activeNode.gridID !== this.gridID)) {
                return;
            }
            const dragMode = this.selectionService.pointerEnter(this.selectionNode, event);
            if (dragMode) {
                this.grid.cdr.detectChanges();
            }
        };
        /**
         * @hidden
         * @internal
         */
        this.pointerup = (event) => {
            const isHierarchicalGrid = this.grid.nativeElement.tagName.toLowerCase() === 'igx-hierarchical-grid';
            if (!this.platformUtil.isLeftClick(event) || (isHierarchicalGrid && (!this.grid.navigation?.activeNode?.gridID ||
                this.grid.navigation.activeNode.gridID !== this.gridID))) {
                return;
            }
            if (this.selectionService.pointerUp(this.selectionNode, this.grid.rangeSelected)) {
                this.grid.cdr.detectChanges();
            }
        };
    }
    /**
     * @hidden
     * @internal
     */
    get isEmptyAddRowCell() {
        return this.intRow.addRowUI && (this.value === undefined || this.value === null);
    }
    /**
     * Gets the row of the cell.
     * ```typescript
     * let cellRow = this.cell.row;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get row() {
        return this.grid.createRow(this.intRow.index);
    }
    /**
     * Gets the cell template context object.
     * ```typescript
     *  let context = this.cell.context();
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get context() {
        const ctx = {
            $implicit: this.value,
            additionalTemplateContext: this.column.additionalTemplateContext,
        };
        /* Turns the `cell` property from the template context object into lazy-evaluated one.
         * Otherwise on each detection cycle the cell template is recreating N cell instances where
         * N = number of visible cells in the grid, leading to massive performance degradation in large grids.
         */
        Object.defineProperty(ctx, 'cell', {
            get: () => this.getCellType(true)
        });
        return ctx;
    }
    /**
     * Gets the cell template.
     * ```typescript
     * let template = this.cell.template;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get template() {
        if (this.editMode) {
            const inlineEditorTemplate = this.column.inlineEditorTemplate;
            return inlineEditorTemplate ? inlineEditorTemplate : this.inlineEditorTemplate;
        }
        if (this.cellTemplate) {
            return this.cellTemplate;
        }
        if (this.grid.rowEditable && this.intRow.addRowUI) {
            return this.addRowCellTemplate;
        }
        return this.defaultCellTemplate;
    }
    /**
     * Gets the pinned indicator template.
     * ```typescript
     * let template = this.cell.pinnedIndicatorTemplate;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get pinnedIndicatorTemplate() {
        if (this.pinnedIndicator) {
            return this.pinnedIndicator;
        }
        return this.defaultPinnedIndicator;
    }
    /**
     * Gets the `id` of the grid in which the cell is stored.
     * ```typescript
     * let gridId = this.cell.gridID;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get gridID() {
        return this.intRow.gridID;
    }
    /**
     * Gets the `index` of the row where the cell is stored.
     * ```typescript
     * let rowIndex = this.cell.rowIndex;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get rowIndex() {
        return this.intRow.index;
    }
    /**
     * Gets the `index` of the cell column.
     * ```typescript
     * let columnIndex = this.cell.columnIndex;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get columnIndex() {
        return this.column.index;
    }
    /**
     * Returns the column visible index.
     * ```typescript
     * let visibleColumnIndex = this.cell.visibleColumnIndex;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get visibleColumnIndex() {
        return this.column.columnLayoutChild ? this.column.visibleIndex : this._vIndex;
    }
    set visibleColumnIndex(val) {
        this._vIndex = val;
    }
    /**
     * Gets the ID of the cell.
     * ```typescript
     * let cellID = this.cell.cellID;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get cellID() {
        const primaryKey = this.grid.primaryKey;
        const rowID = primaryKey ? this.rowData[primaryKey] : this.rowData;
        return { rowID, columnID: this.columnIndex, rowIndex: this.rowIndex };
    }
    get attrCellID() {
        return `${this.intRow.gridID}_${this.rowIndex}_${this.visibleColumnIndex}`;
    }
    get title() {
        if (this.editMode || this.cellTemplate) {
            return '';
        }
        if (this.formatter) {
            return this.formatter(this.value, this.rowData);
        }
        const args = this.column.pipeArgs;
        const locale = this.grid.locale;
        switch (this.column.dataType) {
            case GridColumnDataType.Percent:
                return formatPercent(this.value, locale, args.digitsInfo);
            case GridColumnDataType.Currency:
                return formatCurrency(this.value, this.currencyCode, args.display, args.digitsInfo, locale);
            case GridColumnDataType.Date:
            case GridColumnDataType.DateTime:
            case GridColumnDataType.Time:
                return formatDate(this.value, args.format, locale, args.timezone);
        }
        return this.value;
    }
    get booleanClass() {
        return this.column.dataType === 'boolean' && this.value;
    }
    /**
     * Returns a reference to the nativeElement of the cell.
     * ```typescript
     * let cellNativeElement = this.cell.nativeElement;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /**
     * @hidden
     * @internal
     */
    get cellSelectionMode() {
        return this._cellSelection;
    }
    set cellSelectionMode(value) {
        if (this._cellSelection === value) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            if (value === GridSelectionMode.multiple) {
                this.addPointerListeners(value);
            }
            else {
                this.removePointerListeners(this._cellSelection);
            }
        });
        this._cellSelection = value;
    }
    /**
     * @hidden
     * @internal
     */
    set lastSearchInfo(value) {
        this._lastSearchInfo = value;
        this.highlightText(this._lastSearchInfo.searchText, this._lastSearchInfo.caseSensitive, this._lastSearchInfo.exactMatch);
    }
    /**
     * Gets whether the cell is editable.
     * ```typescript
     * let isCellReadonly = this.cell.readonly;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get readonly() {
        return !this.editable;
    }
    get gridRowSpan() {
        return this.column.gridRowSpan;
    }
    get gridColumnSpan() {
        return this.column.gridColumnSpan;
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
    get ariaSelected() {
        return this.selected || this.column.selected || this.intRow.selected;
    }
    /**
     * Gets whether the cell is selected.
     * ```typescript
     * let isSelected = this.cell.selected;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get selected() {
        return this.selectionService.selected(this.selectionNode);
    }
    /**
     * Selects/deselects the cell.
     * ```typescript
     * this.cell.selected = true.
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    set selected(val) {
        const node = this.selectionNode;
        if (val) {
            this.selectionService.add(node);
        }
        else {
            this.selectionService.remove(node);
        }
        this.grid.notifyChanges();
    }
    /**
     * Gets whether the cell column is selected.
     * ```typescript
     * let isCellColumnSelected = this.cell.columnSelected;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get columnSelected() {
        return this.selectionService.isColumnSelected(this.column.field);
    }
    /**
     * Sets the current edit value while a cell is in edit mode.
     * Only for cell editing mode.
     * ```typescript
     * this.cell.editValue = value;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    set editValue(value) {
        if (this.grid.crudService.cellInEditMode) {
            this.grid.crudService.cell.editValue = value;
        }
    }
    /**
     * Gets the current edit value while a cell is in edit mode.
     * Only for cell editing mode.
     * ```typescript
     * let editValue = this.cell.editValue;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get editValue() {
        if (this.grid.crudService.cellInEditMode) {
            return this.grid.crudService.cell.editValue;
        }
    }
    /**
     * Returns whether the cell is editable.
     */
    get editable() {
        return this.column.editable && !this.intRow.disabled;
    }
    set highlight(value) {
        this._highlight = value;
        if (this._highlight && this.grid.lastSearchInfo.searchText) {
            this._highlight.highlight(this.grid.lastSearchInfo.searchText, this.grid.lastSearchInfo.caseSensitive, this.grid.lastSearchInfo.exactMatch);
            this._highlight.activateIfNecessary();
        }
    }
    get highlight() {
        return this._highlight;
    }
    get selectionNode() {
        return {
            row: this.rowIndex,
            column: this.column.columnLayoutChild ? this.column.parent.visibleIndex : this.visibleColumnIndex,
            layout: this.column.columnLayoutChild ? {
                rowStart: this.column.rowStart,
                colStart: this.column.colStart,
                rowEnd: this.column.rowEnd,
                colEnd: this.column.colEnd,
                columnVisibleIndex: this.visibleColumnIndex
            } : null
        };
    }
    /** @hidden @internal */
    get step() {
        const digitsInfo = this.column.pipeArgs.digitsInfo;
        if (!digitsInfo) {
            return 1;
        }
        const step = +digitsInfo.substr(digitsInfo.indexOf('.') + 1, 1);
        return 1 / (Math.pow(10, step));
    }
    /** @hidden @internal */
    get currencyCode() {
        return this.column.pipeArgs.currencyCode ?
            this.column.pipeArgs.currencyCode : getLocaleCurrencyCode(this.grid.locale);
    }
    /** @hidden @internal */
    get currencyCodeSymbol() {
        return getCurrencySymbol(this.currencyCode, 'wide', this.grid.locale);
    }
    /**
     * @hidden
     * @internal
     */
    onClick(event) {
        this.grid.cellClick.emit({
            cell: this.getCellType(),
            event
        });
    }
    /**
     * @hidden
     * @internal
     */
    onContextMenu(event) {
        this.grid.contextMenu.emit({
            cell: this.getCellType(),
            event
        });
    }
    /**
     * @hidden
     * @internal
     */
    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.nativeElement.addEventListener('pointerdown', this.pointerdown);
            this.addPointerListeners(this.cellSelectionMode);
        });
        if (this.platformUtil.isIOS) {
            this.touchManager.addEventListener(this.nativeElement, 'doubletap', this.onDoubleClick, {
                cssProps: {} /* don't disable user-select, etc */
            });
        }
    }
    /**
     * @hidden
     * @internal
     */
    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            this.nativeElement.removeEventListener('pointerdown', this.pointerdown);
            this.removePointerListeners(this.cellSelectionMode);
        });
        this.touchManager.destroy();
    }
    /**
     * @hidden
     * @internal
     */
    ngOnChanges(changes) {
        if (changes.value && !changes.value.firstChange) {
            if (this.highlight) {
                this.highlight.lastSearchInfo.searchedText = this.grid.lastSearchInfo.searchText;
                this.highlight.lastSearchInfo.caseSensitive = this.grid.lastSearchInfo.caseSensitive;
                this.highlight.lastSearchInfo.exactMatch = this.grid.lastSearchInfo.exactMatch;
            }
        }
    }
    /**
     * Starts/ends edit mode for the cell.
     *
     * ```typescript
     * cell.setEditMode(true);
     * ```
     */
    setEditMode(value) {
        if (this.intRow.deleted) {
            return;
        }
        if (this.editable && value) {
            if (this.grid.crudService.cellInEditMode) {
                this.grid.gridAPI.update_cell(this.grid.crudService.cell);
                this.grid.crudService.endCellEdit();
            }
            this.grid.crudService.enterEditMode(this);
        }
        else {
            this.grid.crudService.endCellEdit();
        }
        this.grid.notifyChanges();
    }
    /**
     * Sets new value to the cell.
     * ```typescript
     * this.cell.update('New Value');
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    // TODO: Refactor
    update(val) {
        if (this.intRow.deleted) {
            return;
        }
        let cell = this.grid.crudService.cell;
        if (!cell) {
            cell = this.grid.crudService.createCell(this);
        }
        cell.editValue = val;
        this.grid.gridAPI.update_cell(cell);
        this.grid.crudService.endCellEdit();
        this.cdr.markForCheck();
    }
    /**
     * @hidden
     * @internal
     */
    activate(event) {
        const node = this.selectionNode;
        const shouldEmitSelection = !this.selectionService.isActiveNode(node);
        if (this.selectionService.primaryButton) {
            const currentActive = this.selectionService.activeElement;
            this.selectionService.activeElement = node;
            const cancel = this._updateCRUDStatus(event);
            if (cancel) {
                this.selectionService.activeElement = currentActive;
                return;
            }
            const activeElement = this.selectionService.activeElement;
            const row = activeElement ? this.grid.gridAPI.get_row_by_index(activeElement.row) : null;
            if (this.grid.crudService.rowEditingBlocked && row && this.intRow.key !== row.key) {
                return;
            }
        }
        else {
            this.selectionService.activeElement = null;
            if (this.grid.crudService.cellInEditMode && !this.editMode) {
                this.grid.crudService.updateCell(true, event);
            }
        }
        this.grid.navigation.setActiveNode({ row: this.rowIndex, column: this.visibleColumnIndex });
        this.selectionService.primaryButton = true;
        if (this.cellSelectionMode === GridSelectionMode.multiple && this.selectionService.activeElement) {
            this.selectionService.add(this.selectionService.activeElement, false); // pointer events handle range generation
            this.selectionService.keyboardStateOnFocus(node, this.grid.rangeSelected, this.nativeElement);
        }
        if (this.grid.isCellSelectable && shouldEmitSelection) {
            this.grid.selected.emit({ cell: this.getCellType(), event });
        }
    }
    /**
     * If the provided string matches the text in the cell, the text gets highlighted.
     * ```typescript
     * this.cell.highlightText('Cell Value', true);
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    highlightText(text, caseSensitive, exactMatch) {
        return this.highlight && this.column.searchable ? this.highlight.highlight(text, caseSensitive, exactMatch) : 0;
    }
    /**
     * Clears the highlight of the text in the cell.
     * ```typescript
     * this.cell.clearHighLight();
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    clearHighlight() {
        if (this.highlight && this.column.searchable) {
            this.highlight.clearHighlight();
        }
    }
    /**
     * @hidden
     * @internal
     */
    calculateSizeToFit(range) {
        return this.platformUtil.getNodeSizeViaRange(range, this.nativeElement);
    }
    /**
     * @hidden
     * @internal
     */
    get searchMetadata() {
        const meta = new Map();
        meta.set('pinned', this.grid.isRecordPinnedByViewIndex(this.intRow.index));
        return meta;
    }
    /**
     * @hidden
     * @internal
     */
    _updateCRUDStatus(event) {
        if (this.editMode) {
            return;
        }
        let editableArgs;
        const crud = this.grid.crudService;
        const editableCell = this.grid.crudService.cell;
        const editMode = !!(crud.row || crud.cell);
        if (this.editable && editMode && !this.intRow.deleted) {
            if (editableCell) {
                editableArgs = this.grid.crudService.updateCell(false, event);
                /* This check is related with the following issue #6517:
                 * when edit cell that belongs to a column which is sorted and press tab,
                 * the next cell in edit mode is with wrong value /its context is not updated/;
                 * So we reapply sorting before the next cell enters edit mode.
                 * Also we need to keep the notifyChanges below, because of the current
                 * change detection cycle when we have editing with enabled transactions
                 */
                if (this.grid.sortingExpressions.length && this.grid.sortingExpressions.indexOf(editableCell.column.field)) {
                    this.grid.cdr.detectChanges();
                }
                if (editableArgs && editableArgs.cancel) {
                    return true;
                }
                crud.exitCellEdit(event);
            }
            this.grid.tbody.nativeElement.focus({ preventScroll: true });
            this.grid.notifyChanges();
            crud.enterEditMode(this, event);
            return false;
        }
        if (editableCell && crud.sameRow(this.cellID.rowID)) {
            this.grid.crudService.updateCell(true, event);
        }
        else if (editMode && !crud.sameRow(this.cellID.rowID)) {
            this.grid.crudService.endEdit(true, event);
        }
    }
    addPointerListeners(selection) {
        if (selection !== GridSelectionMode.multiple) {
            return;
        }
        this.nativeElement.addEventListener('pointerenter', this.pointerenter);
        this.nativeElement.addEventListener('pointerup', this.pointerup);
    }
    removePointerListeners(selection) {
        if (selection !== GridSelectionMode.multiple) {
            return;
        }
        this.nativeElement.removeEventListener('pointerenter', this.pointerenter);
        this.nativeElement.removeEventListener('pointerup', this.pointerup);
    }
    getCellType(useRow) {
        const rowID = useRow ? this.grid.createRow(this.intRow.index, this.intRow.data) : this.intRow.index;
        return new IgxGridCell(this.grid, rowID, this.column.field);
    }
}
IgxGridCellComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridCellComponent, deps: [{ token: i1.IgxGridSelectionService }, { token: IGX_GRID_BASE }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i2.HammerGesturesManager }, { token: i3.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxGridCellComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridCellComponent, selector: "igx-grid-cell", inputs: { column: "column", intRow: "intRow", row: "row", rowData: "rowData", cellTemplate: "cellTemplate", pinnedIndicator: "pinnedIndicator", value: "value", formatter: "formatter", visibleColumnIndex: "visibleColumnIndex", cellSelectionMode: "cellSelectionMode", lastSearchInfo: "lastSearchInfo", lastPinned: "lastPinned", firstPinned: "firstPinned", editMode: "editMode", width: "width", active: "active", displayPinnedChip: "displayPinnedChip" }, host: { listeners: { "dblclick": "onDoubleClick($event)", "click": "onClick($event)", "contextmenu": "onContextMenu($event)" }, properties: { "class.igx-grid__td--new": "this.isEmptyAddRowCell", "attr.data-rowIndex": "this.rowIndex", "attr.data-visibleIndex": "this.visibleColumnIndex", "attr.id": "this.attrCellID", "attr.title": "this.title", "class.igx-grid__td--bool-true": "this.booleanClass", "class.igx-grid__td--pinned-last": "this.lastPinned", "class.igx-grid__td--pinned-first": "this.firstPinned", "class.igx-grid__td--editing": "this.editMode", "attr.role": "this.role", "attr.aria-readonly": "this.readonly", "class.igx-grid__td--active": "this.active", "attr.aria-selected": "this.ariaSelected", "class.igx-grid__td--selected": "this.selected", "class.igx-grid__td--column-selected": "this.columnSelected", "class.igx-grid__td--row-pinned-first": "this.displayPinnedChip" } }, providers: [HammerGesturesManager], viewQueries: [{ propertyName: "defaultCellTemplate", first: true, predicate: ["defaultCell"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultPinnedIndicator", first: true, predicate: ["defaultPinnedIndicator"], descendants: true, read: TemplateRef, static: true }, { propertyName: "inlineEditorTemplate", first: true, predicate: ["inlineEditor"], descendants: true, read: TemplateRef, static: true }, { propertyName: "addRowCellTemplate", first: true, predicate: ["addRowCell"], descendants: true, read: TemplateRef, static: true }, { propertyName: "highlight", first: true, predicate: IgxTextHighlightDirective, descendants: true, read: IgxTextHighlightDirective }], usesOnChanges: true, ngImport: i0, template: "<ng-template #defaultPinnedIndicator>\n    <igx-chip\n        *ngIf=\"displayPinnedChip\"\n        class=\"igx-grid__td--pinned-chip\"\n        [disabled]=\"true\"\n        [displayDensity]=\"'compact'\"\n        >{{ grid.resourceStrings.igx_grid_pinned_row_indicator }}</igx-chip\n    >\n</ng-template>\n<ng-template #defaultCell>\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n        igxTextHighlight\n        class=\"igx-grid__td-text\"\n        style=\"pointer-events: none;\"\n        [cssClass]=\"highlightClass\"\n        [activeCssClass]=\"activeHighlightClass\"\n        [groupName]=\"gridID\"\n        [value]=\"\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === 'number'\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        \"\n        [row]=\"rowData\"\n        [column]=\"this.column.field\"\n        [containerClass]=\"'igx-grid__td-text'\"\n        [metadata]=\"searchMetadata\"\n    >{{\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === \"number\"\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        }}</div>\n    <igx-icon\n        *ngIf=\"column.dataType === 'boolean' && !this.formatter\"\n        [ngClass]=\"{ 'igx-icon--success': value, 'igx-icon--error': !value }\"\n        >{{ value ? \"check\" : \"close\" }}</igx-icon\n    >\n</ng-template>\n<ng-template #addRowCell let-cell=\"cell\">\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n        igxTextHighlight class=\"igx-grid__td-text\" style=\"pointer-events: none\"\n    [cssClass]=\"highlightClass\"\n    [activeCssClass]=\"activeHighlightClass\"\n    [groupName]=\"gridID\"\n    [value]=\"formatter ? (value | columnFormatter:formatter:rowData) : column.dataType === 'number' ?\n        (value | number:column.pipeArgs.digitsInfo:grid.locale) : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime') ?\n        (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale) : column.dataType === 'currency' ?\n        (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale) : column.dataType === 'percent' ?\n        (value | percent:column.pipeArgs.digitsInfo:grid.locale) : value\"\n    [row]=\"rowData\"\n    [column]=\"this.column.field\"\n    [containerClass]=\"'igx-grid__td-text'\"\n    [metadata]=\"searchMetadata\">{{\n        !isEmptyAddRowCell ? value : (column.header || column.field)\n    }}</div>\n</ng-template>\n<ng-template #inlineEditor let-cell=\"cell\">\n    <ng-container *ngIf=\"column.dataType === 'string'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n            />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'number'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'boolean'\">\n        <igx-checkbox\n            [checked]=\"editValue\"\n            (change)=\"editValue = $event.checked\"\n            [igxFocus]=\"true\"\n            [disableRipple]=\"true\"\n        ></igx-checkbox>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'date'\">\n        <igx-date-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [locale]=\"grid.locale\"\n            [(value)]=\"editValue\"\n            [igxFocus]=\"true\"\n        >\n        </igx-date-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'time'\">\n        <igx-time-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [locale]=\"grid.locale\"\n            [inputFormat]=\"column.defaultTimeFormat\"\n            [(value)]=\"editValue\"\n            [igxFocus]=\"true\"\n            >\n        </igx-time-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'dateTime'\">\n        <igx-input-group>\n            <input type=\"text\" igxInput [igxDateTimeEditor]=\"column.defaultDateTimeFormat\" [(ngModel)]=\"editValue\" [igxFocus]=\"true\"/>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'currency'\">\n        <igx-input-group displayDensity=\"compact\">\n            <igx-prefix *ngIf=\"grid.currencyPositionLeft\">{{ currencyCodeSymbol }}</igx-prefix>\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix *ngIf=\"!grid.currencyPositionLeft\" >{{ currencyCodeSymbol }}</igx-suffix>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'percent'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix> {{ editValue | percent:column.pipeArgs.digitsInfo:grid.locale }} </igx-suffix>\n        </igx-input-group>\n    </ng-container>\n</ng-template>\n<ng-container *ngTemplateOutlet=\"pinnedIndicatorTemplate; context: context\">\n</ng-container>\n<ng-container *ngTemplateOutlet=\"template; context: context\"></ng-container>\n", components: [{ type: i4.IgxChipComponent, selector: "igx-chip", inputs: ["id", "tabIndex", "data", "draggable", "animateOnRelease", "hideBaseOnDrag", "removable", "removeIcon", "selectable", "selectIcon", "class", "disabled", "selected", "color", "resourceStrings"], outputs: ["selectedChange", "moveStart", "moveEnd", "remove", "chipClick", "selectedChanging", "selectedChanged", "keyDown", "dragEnter", "dragLeave", "dragOver", "dragDrop"] }, { type: i5.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i6.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i7.IgxCheckboxComponent, selector: "igx-checkbox", inputs: ["id", "labelId", "value", "name", "tabindex", "labelPosition", "disableRipple", "required", "aria-labelledby", "aria-label", "indeterminate", "checked", "disabled", "readonly", "disableTransitions"], outputs: ["change"] }, { type: i8.IgxDatePickerComponent, selector: "igx-date-picker", inputs: ["weekStart", "hideOutsideDays", "displayMonthsCount", "showWeekNumbers", "formatter", "headerOrientation", "todayButtonLabel", "cancelButtonLabel", "spinLoop", "spinDelta", "outlet", "id", "formatViews", "disabledDates", "specialDates", "calendarFormat", "value", "minValue", "maxValue", "resourceStrings", "readOnly"], outputs: ["valueChange", "validationFailed"] }, { type: i9.IgxTimePickerComponent, selector: "igx-time-picker", inputs: ["id", "displayFormat", "inputFormat", "mode", "minValue", "maxValue", "spinLoop", "formatter", "headerOrientation", "readOnly", "value", "resourceStrings", "okButtonLabel", "cancelButtonLabel", "itemsDelta"], outputs: ["selected", "valueChange", "validationFailed"] }], directives: [{ type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i11.IgxTextHighlightDirective, selector: "[igxTextHighlight]", inputs: ["cssClass", "activeCssClass", "containerClass", "groupName", "value", "row", "column", "metadata"] }, { type: i10.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i12.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i13.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i12.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i12.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i14.IgxFocusDirective, selector: "[igxFocus]", inputs: ["igxFocus"], exportAs: ["igxFocus"] }, { type: i12.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { type: i15.IgxDateTimeEditorDirective, selector: "[igxDateTimeEditor]", inputs: ["locale", "minValue", "maxValue", "spinLoop", "displayFormat", "igxDateTimeEditor", "value", "spinDelta"], outputs: ["valueChange", "validationFailed"], exportAs: ["igxDateTimeEditor"] }, { type: i16.IgxPrefixDirective, selector: "igx-prefix,[igxPrefix]" }, { type: i17.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i10.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "columnFormatter": i18.IgxColumnFormatterPipe, "number": i10.DecimalPipe, "date": i10.DatePipe, "currency": i10.CurrencyPipe, "percent": i10.PercentPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridCellComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-grid-cell', providers: [HammerGesturesManager], template: "<ng-template #defaultPinnedIndicator>\n    <igx-chip\n        *ngIf=\"displayPinnedChip\"\n        class=\"igx-grid__td--pinned-chip\"\n        [disabled]=\"true\"\n        [displayDensity]=\"'compact'\"\n        >{{ grid.resourceStrings.igx_grid_pinned_row_indicator }}</igx-chip\n    >\n</ng-template>\n<ng-template #defaultCell>\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n        igxTextHighlight\n        class=\"igx-grid__td-text\"\n        style=\"pointer-events: none;\"\n        [cssClass]=\"highlightClass\"\n        [activeCssClass]=\"activeHighlightClass\"\n        [groupName]=\"gridID\"\n        [value]=\"\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === 'number'\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        \"\n        [row]=\"rowData\"\n        [column]=\"this.column.field\"\n        [containerClass]=\"'igx-grid__td-text'\"\n        [metadata]=\"searchMetadata\"\n    >{{\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === \"number\"\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        }}</div>\n    <igx-icon\n        *ngIf=\"column.dataType === 'boolean' && !this.formatter\"\n        [ngClass]=\"{ 'igx-icon--success': value, 'igx-icon--error': !value }\"\n        >{{ value ? \"check\" : \"close\" }}</igx-icon\n    >\n</ng-template>\n<ng-template #addRowCell let-cell=\"cell\">\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n        igxTextHighlight class=\"igx-grid__td-text\" style=\"pointer-events: none\"\n    [cssClass]=\"highlightClass\"\n    [activeCssClass]=\"activeHighlightClass\"\n    [groupName]=\"gridID\"\n    [value]=\"formatter ? (value | columnFormatter:formatter:rowData) : column.dataType === 'number' ?\n        (value | number:column.pipeArgs.digitsInfo:grid.locale) : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime') ?\n        (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale) : column.dataType === 'currency' ?\n        (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale) : column.dataType === 'percent' ?\n        (value | percent:column.pipeArgs.digitsInfo:grid.locale) : value\"\n    [row]=\"rowData\"\n    [column]=\"this.column.field\"\n    [containerClass]=\"'igx-grid__td-text'\"\n    [metadata]=\"searchMetadata\">{{\n        !isEmptyAddRowCell ? value : (column.header || column.field)\n    }}</div>\n</ng-template>\n<ng-template #inlineEditor let-cell=\"cell\">\n    <ng-container *ngIf=\"column.dataType === 'string'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n            />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'number'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'boolean'\">\n        <igx-checkbox\n            [checked]=\"editValue\"\n            (change)=\"editValue = $event.checked\"\n            [igxFocus]=\"true\"\n            [disableRipple]=\"true\"\n        ></igx-checkbox>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'date'\">\n        <igx-date-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [locale]=\"grid.locale\"\n            [(value)]=\"editValue\"\n            [igxFocus]=\"true\"\n        >\n        </igx-date-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'time'\">\n        <igx-time-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [locale]=\"grid.locale\"\n            [inputFormat]=\"column.defaultTimeFormat\"\n            [(value)]=\"editValue\"\n            [igxFocus]=\"true\"\n            >\n        </igx-time-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'dateTime'\">\n        <igx-input-group>\n            <input type=\"text\" igxInput [igxDateTimeEditor]=\"column.defaultDateTimeFormat\" [(ngModel)]=\"editValue\" [igxFocus]=\"true\"/>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'currency'\">\n        <igx-input-group displayDensity=\"compact\">\n            <igx-prefix *ngIf=\"grid.currencyPositionLeft\">{{ currencyCodeSymbol }}</igx-prefix>\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix *ngIf=\"!grid.currencyPositionLeft\" >{{ currencyCodeSymbol }}</igx-suffix>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'percent'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix> {{ editValue | percent:column.pipeArgs.digitsInfo:grid.locale }} </igx-suffix>\n        </igx-input-group>\n    </ng-container>\n</ng-template>\n<ng-container *ngTemplateOutlet=\"pinnedIndicatorTemplate; context: context\">\n</ng-container>\n<ng-container *ngTemplateOutlet=\"template; context: context\"></ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i1.IgxGridSelectionService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i2.HammerGesturesManager }, { type: i3.PlatformUtil }]; }, propDecorators: { isEmptyAddRowCell: [{
                type: HostBinding,
                args: ['class.igx-grid__td--new']
            }], column: [{
                type: Input
            }], intRow: [{
                type: Input
            }], row: [{
                type: Input
            }], rowData: [{
                type: Input
            }], cellTemplate: [{
                type: Input
            }], pinnedIndicator: [{
                type: Input
            }], value: [{
                type: Input
            }], formatter: [{
                type: Input
            }], rowIndex: [{
                type: HostBinding,
                args: ['attr.data-rowIndex']
            }], visibleColumnIndex: [{
                type: HostBinding,
                args: ['attr.data-visibleIndex']
            }, {
                type: Input
            }], attrCellID: [{
                type: HostBinding,
                args: ['attr.id']
            }], title: [{
                type: HostBinding,
                args: ['attr.title']
            }], booleanClass: [{
                type: HostBinding,
                args: ['class.igx-grid__td--bool-true']
            }], cellSelectionMode: [{
                type: Input
            }], lastSearchInfo: [{
                type: Input
            }], lastPinned: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.igx-grid__td--pinned-last']
            }], firstPinned: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.igx-grid__td--pinned-first']
            }], editMode: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.igx-grid__td--editing']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], readonly: [{
                type: HostBinding,
                args: ['attr.aria-readonly']
            }], width: [{
                type: Input
            }], active: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.igx-grid__td--active']
            }], ariaSelected: [{
                type: HostBinding,
                args: ['attr.aria-selected']
            }], selected: [{
                type: HostBinding,
                args: ['class.igx-grid__td--selected']
            }], columnSelected: [{
                type: HostBinding,
                args: ['class.igx-grid__td--column-selected']
            }], displayPinnedChip: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.igx-grid__td--row-pinned-first']
            }], defaultCellTemplate: [{
                type: ViewChild,
                args: ['defaultCell', { read: TemplateRef, static: true }]
            }], defaultPinnedIndicator: [{
                type: ViewChild,
                args: ['defaultPinnedIndicator', { read: TemplateRef, static: true }]
            }], inlineEditorTemplate: [{
                type: ViewChild,
                args: ['inlineEditor', { read: TemplateRef, static: true }]
            }], addRowCellTemplate: [{
                type: ViewChild,
                args: ['addRowCell', { read: TemplateRef, static: true }]
            }], highlight: [{
                type: ViewChild,
                args: [IgxTextHighlightDirective, { read: IgxTextHighlightDirective }]
            }], onDoubleClick: [{
                type: HostListener,
                args: ['dblclick', ['$event']]
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }], onContextMenu: [{
                type: HostListener,
                args: ['contextmenu', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvY2VsbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvY2VsbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxXQUFXLEVBQ1gsU0FBUyxFQU1ULE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDbEcsT0FBTyxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBRXpFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQWtDLGFBQWEsRUFBVyxNQUFNLHlCQUF5QixDQUFDO0FBQ2pHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBR2xFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHakQ7Ozs7Ozs7Ozs7OztHQVlHO0FBT0gsTUFBTSxPQUFPLG9CQUFvQjtJQXVsQjdCLFlBQ2MsZ0JBQXlDLEVBQ3JCLElBQWMsRUFDckMsR0FBc0IsRUFDckIsT0FBZ0MsRUFDOUIsSUFB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RSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUlwRCxrQkFBa0I7c0JBRDNCLFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUk5QyxTQUFTO3NCQUR0QixTQUFTO3VCQUFDLHlCQUF5QixFQUFFLEVBQUUsSUFBSSxFQUFFLHlCQUF5QixFQUFFO2dCQW1HbEUsYUFBYTtzQkFEbkIsWUFBWTt1QkFBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBcUI3QixPQUFPO3NCQURiLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQWExQixhQUFhO3NCQURuQixZQUFZO3VCQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIElucHV0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBOZ1pvbmUsXG4gICAgT25Jbml0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkNoYW5nZXMsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmb3JtYXRQZXJjZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IElneFRleHRIaWdobGlnaHREaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3RleHQtaGlnaGxpZ2h0L3RleHQtaGlnaGxpZ2h0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBmb3JtYXRDdXJyZW5jeSwgZm9ybWF0RGF0ZSwgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJZ3hHcmlkU2VsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vc2VsZWN0aW9uL3NlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEhhbW1lckdlc3R1cmVzTWFuYWdlciB9IGZyb20gJy4uL2NvcmUvdG91Y2gnO1xuaW1wb3J0IHsgR3JpZFNlbGVjdGlvbk1vZGUgfSBmcm9tICcuL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBDZWxsVHlwZSwgQ29sdW1uVHlwZSwgR3JpZFR5cGUsIElHWF9HUklEX0JBU0UsIFJvd1R5cGUgfSBmcm9tICcuL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBnZXRDdXJyZW5jeVN5bWJvbCwgZ2V0TG9jYWxlQ3VycmVuY3lDb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEdyaWRDb2x1bW5EYXRhVHlwZSB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9kYXRhLXV0aWwnO1xuaW1wb3J0IHsgSWd4Um93RGlyZWN0aXZlIH0gZnJvbSAnLi9yb3cuZGlyZWN0aXZlJztcbmltcG9ydCB7IElTZWFyY2hJbmZvIH0gZnJvbSAnLi9jb21tb24vZXZlbnRzJztcbmltcG9ydCB7IElneEdyaWRDZWxsIH0gZnJvbSAnLi9ncmlkLXB1YmxpYy1jZWxsJztcbmltcG9ydCB7IElTZWxlY3Rpb25Ob2RlIH0gZnJvbSAnLi9jb21tb24vdHlwZXMnO1xuXG4vKipcbiAqIFByb3ZpZGluZyByZWZlcmVuY2UgdG8gYElneEdyaWRDZWxsQ29tcG9uZW50YDpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBWaWV3Q2hpbGQoJ2dyaWQnLCB7IHJlYWQ6IElneEdyaWRDb21wb25lbnQgfSlcbiAqICBwdWJsaWMgZ3JpZDogSWd4R3JpZENvbXBvbmVudDtcbiAqIGBgYFxuICogYGBgdHlwZXNjcmlwdFxuICogIGxldCBjb2x1bW4gPSB0aGlzLmdyaWQuY29sdW1uTGlzdC5maXJzdDtcbiAqIGBgYFxuICogYGBgdHlwZXNjcmlwdFxuICogIGxldCBjZWxsID0gY29sdW1uLmNlbGxzWzBdO1xuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHNlbGVjdG9yOiAnaWd4LWdyaWQtY2VsbCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NlbGwuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW0hhbW1lckdlc3R1cmVzTWFuYWdlcl1cbn0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZENlbGxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBDZWxsVHlwZSB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWRfX3RkLS1uZXcnKVxuICAgIHB1YmxpYyBnZXQgaXNFbXB0eUFkZFJvd0NlbGwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludFJvdy5hZGRSb3dVSSAmJiAodGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMudmFsdWUgPT09IG51bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvbHVtbiBvZiB0aGUgY2VsbC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGxldCBjZWxsQ29sdW1uID0gdGhpcy5jZWxsLmNvbHVtbjtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbHVtbjogQ29sdW1uVHlwZTtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpbnRSb3c6IElneFJvd0RpcmVjdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHJvdyBvZiB0aGUgY2VsbC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNlbGxSb3cgPSB0aGlzLmNlbGwucm93O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHJvdygpOiBSb3dUeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5jcmVhdGVSb3codGhpcy5pbnRSb3cuaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGRhdGEgb2YgdGhlIHJvdyBvZiB0aGUgY2VsbC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHJvd0RhdGEgPSB0aGlzLmNlbGwucm93RGF0YTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJvd0RhdGE6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgdGVtcGxhdGUgb2YgdGhlIGNlbGwuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxuZy10ZW1wbGF0ZSAjY2VsbFRlbXBsYXRlIGlneENlbGwgbGV0LXZhbHVlPlxuICAgICAqICAgPGRpdiBzdHlsZT1cImZvbnQtc3R5bGU6IG9ibGlxdWU7IGNvbG9yOmJsdWV2aW9sZXQ7IGJhY2tncm91bmQ6cmVkXCI+XG4gICAgICogICAgICAgPHNwYW4+e3t2YWx1ZX19PC9zcGFuPlxuICAgICAqICAgPC9kaXY+XG4gICAgICogPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZCgnY2VsbFRlbXBsYXRlJyx7cmVhZDogVGVtcGxhdGVSZWZ9KVxuICAgICAqIGNlbGxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jZWxsLmNlbGxUZW1wbGF0ZSA9IHRoaXMuY2VsbFRlbXBsYXRlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdGVtcGxhdGUgPSAgdGhpcy5jZWxsLmNlbGxUZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNlbGxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBpbm5lZEluZGljYXRvcjogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgY2VsbCB2YWx1ZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jZWxsLnZhbHVlID0gXCJDZWxsIFZhbHVlXCI7XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjZWxsVmFsdWUgPSB0aGlzLmNlbGwudmFsdWU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB2YWx1ZTogYW55O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY2VsbCBmb3JtYXR0ZXIuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjZWxsRm9yYW1hdHRlciA9IHRoaXMuY2VsbC5mb3JtYXR0ZXI7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmb3JtYXR0ZXI6ICh2YWx1ZTogYW55LCByb3dEYXRhPzogYW55KSA9PiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjZWxsIHRlbXBsYXRlIGNvbnRleHQgb2JqZWN0LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgbGV0IGNvbnRleHQgPSB0aGlzLmNlbGwuY29udGV4dCgpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBjb250ZXh0KCk6IGFueSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgICRpbXBsaWNpdDogdGhpcy52YWx1ZSxcbiAgICAgICAgICAgIGFkZGl0aW9uYWxUZW1wbGF0ZUNvbnRleHQ6IHRoaXMuY29sdW1uLmFkZGl0aW9uYWxUZW1wbGF0ZUNvbnRleHQsXG4gICAgICAgIH07XG4gICAgICAgIC8qIFR1cm5zIHRoZSBgY2VsbGAgcHJvcGVydHkgZnJvbSB0aGUgdGVtcGxhdGUgY29udGV4dCBvYmplY3QgaW50byBsYXp5LWV2YWx1YXRlZCBvbmUuXG4gICAgICAgICAqIE90aGVyd2lzZSBvbiBlYWNoIGRldGVjdGlvbiBjeWNsZSB0aGUgY2VsbCB0ZW1wbGF0ZSBpcyByZWNyZWF0aW5nIE4gY2VsbCBpbnN0YW5jZXMgd2hlcmVcbiAgICAgICAgICogTiA9IG51bWJlciBvZiB2aXNpYmxlIGNlbGxzIGluIHRoZSBncmlkLCBsZWFkaW5nIHRvIG1hc3NpdmUgcGVyZm9ybWFuY2UgZGVncmFkYXRpb24gaW4gbGFyZ2UgZ3JpZHMuXG4gICAgICAgICAqL1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3R4LCAnY2VsbCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5nZXRDZWxsVHlwZSh0cnVlKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGN0eDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjZWxsIHRlbXBsYXRlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdGVtcGxhdGUgPSB0aGlzLmNlbGwudGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xuICAgICAgICAgICAgY29uc3QgaW5saW5lRWRpdG9yVGVtcGxhdGUgPSB0aGlzLmNvbHVtbi5pbmxpbmVFZGl0b3JUZW1wbGF0ZTtcbiAgICAgICAgICAgIHJldHVybiBpbmxpbmVFZGl0b3JUZW1wbGF0ZSA/IGlubGluZUVkaXRvclRlbXBsYXRlIDogdGhpcy5pbmxpbmVFZGl0b3JUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jZWxsVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNlbGxUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ncmlkLnJvd0VkaXRhYmxlICYmIHRoaXMuaW50Um93LmFkZFJvd1VJKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGRSb3dDZWxsVGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdENlbGxUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBwaW5uZWQgaW5kaWNhdG9yIHRlbXBsYXRlLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdGVtcGxhdGUgPSB0aGlzLmNlbGwucGlubmVkSW5kaWNhdG9yVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBpbm5lZEluZGljYXRvclRlbXBsYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5waW5uZWRJbmRpY2F0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBpbm5lZEluZGljYXRvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0UGlubmVkSW5kaWNhdG9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGBpZGAgb2YgdGhlIGdyaWQgaW4gd2hpY2ggdGhlIGNlbGwgaXMgc3RvcmVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZ3JpZElkID0gdGhpcy5jZWxsLmdyaWRJRDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZ3JpZElEKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludFJvdy5ncmlkSUQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBgaW5kZXhgIG9mIHRoZSByb3cgd2hlcmUgdGhlIGNlbGwgaXMgc3RvcmVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgcm93SW5kZXggPSB0aGlzLmNlbGwucm93SW5kZXg7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuZGF0YS1yb3dJbmRleCcpXG4gICAgcHVibGljIGdldCByb3dJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRSb3cuaW5kZXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYGluZGV4YCBvZiB0aGUgY2VsbCBjb2x1bW4uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjb2x1bW5JbmRleCA9IHRoaXMuY2VsbC5jb2x1bW5JbmRleDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29sdW1uSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmluZGV4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNvbHVtbiB2aXNpYmxlIGluZGV4LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdmlzaWJsZUNvbHVtbkluZGV4ID0gdGhpcy5jZWxsLnZpc2libGVDb2x1bW5JbmRleDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5kYXRhLXZpc2libGVJbmRleCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVDb2x1bW5JbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmNvbHVtbkxheW91dENoaWxkID8gdGhpcy5jb2x1bW4udmlzaWJsZUluZGV4IDogdGhpcy5fdkluZGV4O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZUNvbHVtbkluZGV4KHZhbCkge1xuICAgICAgICB0aGlzLl92SW5kZXggPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgSUQgb2YgdGhlIGNlbGwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjZWxsSUQgPSB0aGlzLmNlbGwuY2VsbElEO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBjZWxsSUQoKSB7XG4gICAgICAgIGNvbnN0IHByaW1hcnlLZXkgPSB0aGlzLmdyaWQucHJpbWFyeUtleTtcbiAgICAgICAgY29uc3Qgcm93SUQgPSBwcmltYXJ5S2V5ID8gdGhpcy5yb3dEYXRhW3ByaW1hcnlLZXldIDogdGhpcy5yb3dEYXRhO1xuICAgICAgICByZXR1cm4geyByb3dJRCwgY29sdW1uSUQ6IHRoaXMuY29sdW1uSW5kZXgsIHJvd0luZGV4OiB0aGlzLnJvd0luZGV4IH07XG4gICAgfVxuXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBwdWJsaWMgZ2V0IGF0dHJDZWxsSUQoKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmludFJvdy5ncmlkSUR9XyR7dGhpcy5yb3dJbmRleH1fJHt0aGlzLnZpc2libGVDb2x1bW5JbmRleH1gO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnYXR0ci50aXRsZScpXG4gICAgcHVibGljIGdldCB0aXRsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWRpdE1vZGUgfHwgdGhpcy5jZWxsVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZvcm1hdHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0dGVyKHRoaXMudmFsdWUsIHRoaXMucm93RGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5jb2x1bW4ucGlwZUFyZ3M7XG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IHRoaXMuZ3JpZC5sb2NhbGU7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmNvbHVtbi5kYXRhVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuUGVyY2VudDpcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0UGVyY2VudCh0aGlzLnZhbHVlLCBsb2NhbGUsIGFyZ3MuZGlnaXRzSW5mbyk7XG4gICAgICAgICAgICBjYXNlIEdyaWRDb2x1bW5EYXRhVHlwZS5DdXJyZW5jeTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0Q3VycmVuY3kodGhpcy52YWx1ZSwgdGhpcy5jdXJyZW5jeUNvZGUsIGFyZ3MuZGlzcGxheSwgYXJncy5kaWdpdHNJbmZvLCBsb2NhbGUpO1xuICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuRGF0ZTpcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkRhdGVUaW1lOlxuICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuVGltZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0RGF0ZSh0aGlzLnZhbHVlLCBhcmdzLmZvcm1hdCwgbG9jYWxlLCBhcmdzLnRpbWV6b25lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX190ZC0tYm9vbC10cnVlJylcbiAgICBwdWJsaWMgZ2V0IGJvb2xlYW5DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmRhdGFUeXBlID09PSAnYm9vbGVhbicgJiYgdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBuYXRpdmVFbGVtZW50IG9mIHRoZSBjZWxsLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY2VsbE5hdGl2ZUVsZW1lbnQgPSB0aGlzLmNlbGwubmF0aXZlRWxlbWVudDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGNlbGxTZWxlY3Rpb25Nb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2VsbFNlbGVjdGlvbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGNlbGxTZWxlY3Rpb25Nb2RlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9jZWxsU2VsZWN0aW9uID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IEdyaWRTZWxlY3Rpb25Nb2RlLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQb2ludGVyTGlzdGVuZXJzKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQb2ludGVyTGlzdGVuZXJzKHRoaXMuX2NlbGxTZWxlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fY2VsbFNlbGVjdGlvbiA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgbGFzdFNlYXJjaEluZm8odmFsdWU6IElTZWFyY2hJbmZvKSB7XG4gICAgICAgIHRoaXMuX2xhc3RTZWFyY2hJbmZvID0gdmFsdWU7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0VGV4dCh0aGlzLl9sYXN0U2VhcmNoSW5mby5zZWFyY2hUZXh0LCB0aGlzLl9sYXN0U2VhcmNoSW5mby5jYXNlU2Vuc2l0aXZlLCB0aGlzLl9sYXN0U2VhcmNoSW5mby5leGFjdE1hdGNoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX190ZC0tcGlubmVkLWxhc3QnKVxuICAgIHB1YmxpYyBsYXN0UGlubmVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX190ZC0tcGlubmVkLWZpcnN0JylcbiAgICBwdWJsaWMgZmlyc3RQaW5uZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgY2VsbCBpcyBpbiBlZGl0IG1vZGUuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX190ZC0tZWRpdGluZycpXG4gICAgcHVibGljIGVkaXRNb2RlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldCB0aGUgYHJvbGVgIHByb3BlcnR5IG9mIHRoZSBjZWxsLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYFwiZ3JpZGNlbGxcImAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2VsbC5yb2xlID0gJ2dyaWQtY2VsbCc7XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjZWxsUm9sZSA9IHRoaXMuY2VsbC5yb2xlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxuICAgIHB1YmxpYyByb2xlID0gJ2dyaWRjZWxsJztcblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgY2VsbCBpcyBlZGl0YWJsZS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzQ2VsbFJlYWRvbmx5ID0gdGhpcy5jZWxsLnJlYWRvbmx5O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtcmVhZG9ubHknKVxuICAgIHB1YmxpYyBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5lZGl0YWJsZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGdyaWRSb3dTcGFuKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5ncmlkUm93U3BhbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGdyaWRDb2x1bW5TcGFuKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5ncmlkQ29sdW1uU3BhbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHJvd0VuZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4ucm93RW5kO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY29sRW5kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5jb2xFbmQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCByb3dTdGFydCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4ucm93U3RhcnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjb2xTdGFydCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uY29sU3RhcnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgd2lkdGggb2YgdGhlIGNlbGwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjZWxsV2lkdGggPSB0aGlzLmNlbGwud2lkdGg7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aWR0aCA9ICcnO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZF9fdGQtLWFjdGl2ZScpXG4gICAgcHVibGljIGFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtc2VsZWN0ZWQnKVxuICAgIHB1YmxpYyBnZXQgYXJpYVNlbGVjdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZCB8fCB0aGlzLmNvbHVtbi5zZWxlY3RlZCB8fCB0aGlzLmludFJvdy5zZWxlY3RlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIGNlbGwgaXMgc2VsZWN0ZWQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc1NlbGVjdGVkID0gdGhpcy5jZWxsLnNlbGVjdGVkO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZF9fdGQtLXNlbGVjdGVkJylcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGVkKHRoaXMuc2VsZWN0aW9uTm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0cy9kZXNlbGVjdHMgdGhlIGNlbGwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2VsbC5zZWxlY3RlZCA9IHRydWUuXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKHZhbDogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zZWxlY3Rpb25Ob2RlO1xuICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWRkKG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnJlbW92ZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyaWQubm90aWZ5Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGUgY2VsbCBjb2x1bW4gaXMgc2VsZWN0ZWQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0NlbGxDb2x1bW5TZWxlY3RlZCA9IHRoaXMuY2VsbC5jb2x1bW5TZWxlY3RlZDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWRfX3RkLS1jb2x1bW4tc2VsZWN0ZWQnKVxuICAgIHB1YmxpYyBnZXQgY29sdW1uU2VsZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuaXNDb2x1bW5TZWxlY3RlZCh0aGlzLmNvbHVtbi5maWVsZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCBlZGl0IHZhbHVlIHdoaWxlIGEgY2VsbCBpcyBpbiBlZGl0IG1vZGUuXG4gICAgICogT25seSBmb3IgY2VsbCBlZGl0aW5nIG1vZGUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2VsbC5lZGl0VmFsdWUgPSB2YWx1ZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hHcmlkQ2VsbENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgZWRpdFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbEluRWRpdE1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5jZWxsLmVkaXRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBlZGl0IHZhbHVlIHdoaWxlIGEgY2VsbCBpcyBpbiBlZGl0IG1vZGUuXG4gICAgICogT25seSBmb3IgY2VsbCBlZGl0aW5nIG1vZGUuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBlZGl0VmFsdWUgPSB0aGlzLmNlbGwuZWRpdFZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGdldCBlZGl0VmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbEluRWRpdE1vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbC5lZGl0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGNlbGwgaXMgZWRpdGFibGUuXG4gICAgICovXG4gICAgcHVibGljIGdldCBlZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmVkaXRhYmxlICYmICF0aGlzLmludFJvdy5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX190ZC0tcm93LXBpbm5lZC1maXJzdCcpXG4gICAgcHVibGljIGRpc3BsYXlQaW5uZWRDaGlwID0gZmFsc2U7XG5cblxuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRDZWxsJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRDZWxsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdkZWZhdWx0UGlubmVkSW5kaWNhdG9yJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRQaW5uZWRJbmRpY2F0b3I6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdpbmxpbmVFZGl0b3InLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgaW5saW5lRWRpdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdhZGRSb3dDZWxsJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGFkZFJvd0NlbGxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoSWd4VGV4dEhpZ2hsaWdodERpcmVjdGl2ZSwgeyByZWFkOiBJZ3hUZXh0SGlnaGxpZ2h0RGlyZWN0aXZlIH0pXG4gICAgcHJvdGVjdGVkIHNldCBoaWdobGlnaHQodmFsdWU6IElneFRleHRIaWdobGlnaHREaXJlY3RpdmUpIHtcbiAgICAgICAgdGhpcy5faGlnaGxpZ2h0ID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hpZ2hsaWdodCAmJiB0aGlzLmdyaWQubGFzdFNlYXJjaEluZm8uc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0LmhpZ2hsaWdodCh0aGlzLmdyaWQubGFzdFNlYXJjaEluZm8uc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQubGFzdFNlYXJjaEluZm8uY2FzZVNlbnNpdGl2ZSxcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQubGFzdFNlYXJjaEluZm8uZXhhY3RNYXRjaCk7XG4gICAgICAgICAgICB0aGlzLl9oaWdobGlnaHQuYWN0aXZhdGVJZk5lY2Vzc2FyeSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBoaWdobGlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oaWdobGlnaHQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBzZWxlY3Rpb25Ob2RlKCk6IElTZWxlY3Rpb25Ob2RlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdzogdGhpcy5yb3dJbmRleCxcbiAgICAgICAgICAgIGNvbHVtbjogdGhpcy5jb2x1bW4uY29sdW1uTGF5b3V0Q2hpbGQgPyB0aGlzLmNvbHVtbi5wYXJlbnQudmlzaWJsZUluZGV4IDogdGhpcy52aXNpYmxlQ29sdW1uSW5kZXgsXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMuY29sdW1uLmNvbHVtbkxheW91dENoaWxkID8ge1xuICAgICAgICAgICAgICAgIHJvd1N0YXJ0OiB0aGlzLmNvbHVtbi5yb3dTdGFydCxcbiAgICAgICAgICAgICAgICBjb2xTdGFydDogdGhpcy5jb2x1bW4uY29sU3RhcnQsXG4gICAgICAgICAgICAgICAgcm93RW5kOiB0aGlzLmNvbHVtbi5yb3dFbmQsXG4gICAgICAgICAgICAgICAgY29sRW5kOiB0aGlzLmNvbHVtbi5jb2xFbmQsXG4gICAgICAgICAgICAgICAgY29sdW1uVmlzaWJsZUluZGV4OiB0aGlzLnZpc2libGVDb2x1bW5JbmRleFxuICAgICAgICAgICAgfSA6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGhpZ2hsaWdodCBjbGFzcyBvZiB0aGUgY2VsbC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBcImlneC1oaWdobGlnaHRcImAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBoaWdobGlnaHRDbGFzcyA9IHRoaXMuY2VsbC5oaWdobGlnaHRDbGFzcztcbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jZWxsLmhpZ2hsaWdodENsYXNzID0gJ2lneC1jZWxsLWhpZ2hsaWdodCc7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZENlbGxDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaGlnaGxpZ2h0Q2xhc3MgPSAnaWd4LWhpZ2hsaWdodCc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGFjdGl2ZSBoaWdobGlnaHQgY2xhc3MgY2xhc3Mgb2YgdGhlIGNlbGwuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgXCJpZ3gtaGlnaGxpZ2h0X19hY3RpdmVcImAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBhY3RpdmVIaWdobGlnaHRDbGFzcyA9IHRoaXMuY2VsbC5hY3RpdmVIaWdobGlnaHRDbGFzcztcbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5jZWxsLmFjdGl2ZUhpZ2hsaWdodENsYXNzID0gJ2lneC1jZWxsLWhpZ2hsaWdodF9hY3RpdmUnO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGFjdGl2ZUhpZ2hsaWdodENsYXNzID0gJ2lneC1oaWdobGlnaHRfX2FjdGl2ZSc7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZGlnaXRzSW5mbyA9IHRoaXMuY29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm87XG4gICAgICAgIGlmICghZGlnaXRzSW5mbykge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RlcCA9ICtkaWdpdHNJbmZvLnN1YnN0cihkaWdpdHNJbmZvLmluZGV4T2YoJy4nKSArIDEsIDEpO1xuICAgICAgICByZXR1cm4gMSAvIChNYXRoLnBvdygxMCwgc3RlcCkpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgY3VycmVuY3lDb2RlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5waXBlQXJncy5jdXJyZW5jeUNvZGUgP1xuICAgICAgICAgICAgdGhpcy5jb2x1bW4ucGlwZUFyZ3MuY3VycmVuY3lDb2RlIDogZ2V0TG9jYWxlQ3VycmVuY3lDb2RlKHRoaXMuZ3JpZC5sb2NhbGUpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgY3VycmVuY3lDb2RlU3ltYm9sKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBnZXRDdXJyZW5jeVN5bWJvbCh0aGlzLmN1cnJlbmN5Q29kZSwgJ3dpZGUnLCB0aGlzLmdyaWQubG9jYWxlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX2xhc3RTZWFyY2hJbmZvOiBJU2VhcmNoSW5mbztcbiAgICBwcml2YXRlIF9oaWdobGlnaHQ6IElneFRleHRIaWdobGlnaHREaXJlY3RpdmU7XG4gICAgcHJpdmF0ZSBfY2VsbFNlbGVjdGlvbiA9IEdyaWRTZWxlY3Rpb25Nb2RlLm11bHRpcGxlO1xuICAgIHByaXZhdGUgX3ZJbmRleCA9IC0xO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3Rpb25TZXJ2aWNlOiBJZ3hHcmlkU2VsZWN0aW9uU2VydmljZSxcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9CQVNFKSBwdWJsaWMgZ3JpZDogR3JpZFR5cGUsXG4gICAgICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBwcm90ZWN0ZWQgem9uZTogTmdab25lLFxuICAgICAgICBwcml2YXRlIHRvdWNoTWFuYWdlcjogSGFtbWVyR2VzdHVyZXNNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm1VdGlsOiBQbGF0Zm9ybVV0aWxcbiAgICApIHsgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2RibGNsaWNrJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25Eb3VibGVDbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2RvdWJsZXRhcCcpIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnQgZG91YmxlLXRhcCB0byB6b29tIG9uIGlPU1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lZGl0YWJsZSAmJiAhdGhpcy5lZGl0TW9kZSAmJiAhdGhpcy5pbnRSb3cuZGVsZXRlZCAmJiAhdGhpcy5ncmlkLmNydWRTZXJ2aWNlLnJvd0VkaXRpbmdCbG9ja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuZW50ZXJFZGl0TW9kZSh0aGlzLCBldmVudCBhcyBFdmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyaWQuZG91YmxlQ2xpY2suZW1pdCh7XG4gICAgICAgICAgICBjZWxsOiB0aGlzLmdldENlbGxUeXBlKCksXG4gICAgICAgICAgICBldmVudFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmdyaWQuY2VsbENsaWNrLmVtaXQoe1xuICAgICAgICAgICAgY2VsbDogdGhpcy5nZXRDZWxsVHlwZSgpLFxuICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25Db250ZXh0TWVudShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmdyaWQuY29udGV4dE1lbnUuZW1pdCh7XG4gICAgICAgICAgICBjZWxsOiB0aGlzLmdldENlbGxUeXBlKCksXG4gICAgICAgICAgICBldmVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5wb2ludGVyZG93bik7XG4gICAgICAgICAgICB0aGlzLmFkZFBvaW50ZXJMaXN0ZW5lcnModGhpcy5jZWxsU2VsZWN0aW9uTW9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5wbGF0Zm9ybVV0aWwuaXNJT1MpIHtcbiAgICAgICAgICAgIHRoaXMudG91Y2hNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5uYXRpdmVFbGVtZW50LCAnZG91YmxldGFwJywgdGhpcy5vbkRvdWJsZUNsaWNrLCB7XG4gICAgICAgICAgICAgICAgY3NzUHJvcHM6IHt9IC8qIGRvbid0IGRpc2FibGUgdXNlci1zZWxlY3QsIGV0YyAqL1xuICAgICAgICAgICAgfSBhcyBIYW1tZXJPcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLnBvaW50ZXJkb3duKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUG9pbnRlckxpc3RlbmVycyh0aGlzLmNlbGxTZWxlY3Rpb25Nb2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG91Y2hNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoYW5nZXMudmFsdWUgJiYgIWNoYW5nZXMudmFsdWUuZmlyc3RDaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0Lmxhc3RTZWFyY2hJbmZvLnNlYXJjaGVkVGV4dCA9IHRoaXMuZ3JpZC5sYXN0U2VhcmNoSW5mby5zZWFyY2hUZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0Lmxhc3RTZWFyY2hJbmZvLmNhc2VTZW5zaXRpdmUgPSB0aGlzLmdyaWQubGFzdFNlYXJjaEluZm8uY2FzZVNlbnNpdGl2ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodC5sYXN0U2VhcmNoSW5mby5leGFjdE1hdGNoID0gdGhpcy5ncmlkLmxhc3RTZWFyY2hJbmZvLmV4YWN0TWF0Y2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydHMvZW5kcyBlZGl0IG1vZGUgZm9yIHRoZSBjZWxsLlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNlbGwuc2V0RWRpdE1vZGUodHJ1ZSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldEVkaXRNb2RlKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmludFJvdy5kZWxldGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWRpdGFibGUgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbEluRWRpdE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuZ3JpZEFQSS51cGRhdGVfY2VsbCh0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLmVuZENlbGxFZGl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuZW50ZXJFZGl0TW9kZSh0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5lbmRDZWxsRWRpdCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JpZC5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBuZXcgdmFsdWUgdG8gdGhlIGNlbGwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2VsbC51cGRhdGUoJ05ldyBWYWx1ZScpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgLy8gVE9ETzogUmVmYWN0b3JcbiAgICBwdWJsaWMgdXBkYXRlKHZhbDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmludFJvdy5kZWxldGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2VsbCA9IHRoaXMuZ3JpZC5jcnVkU2VydmljZS5jZWxsO1xuICAgICAgICBpZiAoIWNlbGwpIHtcbiAgICAgICAgICAgIGNlbGwgPSB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY3JlYXRlQ2VsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBjZWxsLmVkaXRWYWx1ZSA9IHZhbDtcbiAgICAgICAgdGhpcy5ncmlkLmdyaWRBUEkudXBkYXRlX2NlbGwoY2VsbCk7XG4gICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5lbmRDZWxsRWRpdCgpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcG9pbnRlcmRvd24gPSAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jZWxsU2VsZWN0aW9uTW9kZSAhPT0gR3JpZFNlbGVjdGlvbk1vZGUubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZhdGUoZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5wbGF0Zm9ybVV0aWwuaXNMZWZ0Q2xpY2soZXZlbnQpKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5ncmlkLm5hdmlnYXRpb24uc2V0QWN0aXZlTm9kZSh7IHJvd0luZGV4OiB0aGlzLnJvd0luZGV4LCBjb2xJbmRleDogdGhpcy52aXNpYmxlQ29sdW1uSW5kZXggfSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UuYWRkS2V5Ym9hcmRSYW5nZSgpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmluaXRLZXlib2FyZFN0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2UucHJpbWFyeUJ1dHRvbiA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gRW5zdXJlIFJNQiBDbGljayBvbiBlZGl0ZWQgY2VsbCBkb2VzIG5vdCBlbmQgY2VsbCBlZGl0aW5nXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UudXBkYXRlQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnBvaW50ZXJEb3duKHRoaXMuc2VsZWN0aW9uTm9kZSwgZXZlbnQuc2hpZnRLZXksIGV2ZW50LmN0cmxLZXkpO1xuICAgICAgICB0aGlzLmFjdGl2YXRlKGV2ZW50KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHBvaW50ZXJlbnRlciA9IChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlzSGllcmFyY2hpY2FsR3JpZCA9IHRoaXMuZ3JpZC5uYXRpdmVFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2lneC1oaWVyYXJjaGljYWwtZ3JpZCc7XG4gICAgICAgIGlmIChpc0hpZXJhcmNoaWNhbEdyaWQgJiYgKCF0aGlzLmdyaWQubmF2aWdhdGlvbj8uYWN0aXZlTm9kZT8uZ3JpZElEIHx8IHRoaXMuZ3JpZC5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUuZ3JpZElEICE9PSB0aGlzLmdyaWRJRCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkcmFnTW9kZSA9IHRoaXMuc2VsZWN0aW9uU2VydmljZS5wb2ludGVyRW50ZXIodGhpcy5zZWxlY3Rpb25Ob2RlLCBldmVudCk7XG4gICAgICAgIGlmIChkcmFnTW9kZSkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBwb2ludGVydXAgPSAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBpc0hpZXJhcmNoaWNhbEdyaWQgPSB0aGlzLmdyaWQubmF0aXZlRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpZ3gtaGllcmFyY2hpY2FsLWdyaWQnO1xuICAgICAgICBpZiAoIXRoaXMucGxhdGZvcm1VdGlsLmlzTGVmdENsaWNrKGV2ZW50KSB8fCAoaXNIaWVyYXJjaGljYWxHcmlkICYmICghdGhpcy5ncmlkLm5hdmlnYXRpb24/LmFjdGl2ZU5vZGU/LmdyaWRJRCB8fFxuICAgICAgICAgICAgdGhpcy5ncmlkLm5hdmlnYXRpb24uYWN0aXZlTm9kZS5ncmlkSUQgIT09IHRoaXMuZ3JpZElEKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnBvaW50ZXJVcCh0aGlzLnNlbGVjdGlvbk5vZGUsIHRoaXMuZ3JpZC5yYW5nZVNlbGVjdGVkKSkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBhY3RpdmF0ZShldmVudDogRm9jdXNFdmVudCB8IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc2VsZWN0aW9uTm9kZTtcbiAgICAgICAgY29uc3Qgc2hvdWxkRW1pdFNlbGVjdGlvbiA9ICF0aGlzLnNlbGVjdGlvblNlcnZpY2UuaXNBY3RpdmVOb2RlKG5vZGUpO1xuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblNlcnZpY2UucHJpbWFyeUJ1dHRvbikge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEFjdGl2ZSA9IHRoaXMuc2VsZWN0aW9uU2VydmljZS5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFjdGl2ZUVsZW1lbnQgPSBub2RlO1xuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gdGhpcy5fdXBkYXRlQ1JVRFN0YXR1cyhldmVudCk7XG4gICAgICAgICAgICBpZiAoY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFjdGl2ZUVsZW1lbnQgPSBjdXJyZW50QWN0aXZlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuc2VsZWN0aW9uU2VydmljZS5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gYWN0aXZlRWxlbWVudCA/IHRoaXMuZ3JpZC5ncmlkQVBJLmdldF9yb3dfYnlfaW5kZXgoYWN0aXZlRWxlbWVudC5yb3cpIDogbnVsbDtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93RWRpdGluZ0Jsb2NrZWQgJiYgcm93ICYmIHRoaXMuaW50Um93LmtleSAhPT0gcm93LmtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFjdGl2ZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5jcnVkU2VydmljZS5jZWxsSW5FZGl0TW9kZSAmJiAhdGhpcy5lZGl0TW9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS51cGRhdGVDZWxsKHRydWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JpZC5uYXZpZ2F0aW9uLnNldEFjdGl2ZU5vZGUoeyByb3c6IHRoaXMucm93SW5kZXgsIGNvbHVtbjogdGhpcy52aXNpYmxlQ29sdW1uSW5kZXggfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnByaW1hcnlCdXR0b24gPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5jZWxsU2VsZWN0aW9uTW9kZSA9PT0gR3JpZFNlbGVjdGlvbk1vZGUubXVsdGlwbGUgJiYgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5hZGQodGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmFjdGl2ZUVsZW1lbnQsIGZhbHNlKTsgLy8gcG9pbnRlciBldmVudHMgaGFuZGxlIHJhbmdlIGdlbmVyYXRpb25cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5rZXlib2FyZFN0YXRlT25Gb2N1cyhub2RlLCB0aGlzLmdyaWQucmFuZ2VTZWxlY3RlZCwgdGhpcy5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5ncmlkLmlzQ2VsbFNlbGVjdGFibGUgJiYgc2hvdWxkRW1pdFNlbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdGVkLmVtaXQoeyBjZWxsOiB0aGlzLmdldENlbGxUeXBlKCksIGV2ZW50IH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHByb3ZpZGVkIHN0cmluZyBtYXRjaGVzIHRoZSB0ZXh0IGluIHRoZSBjZWxsLCB0aGUgdGV4dCBnZXRzIGhpZ2hsaWdodGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmNlbGwuaGlnaGxpZ2h0VGV4dCgnQ2VsbCBWYWx1ZScsIHRydWUpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGhpZ2hsaWdodFRleHQodGV4dDogc3RyaW5nLCBjYXNlU2Vuc2l0aXZlPzogYm9vbGVhbiwgZXhhY3RNYXRjaD86IGJvb2xlYW4pOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWdobGlnaHQgJiYgdGhpcy5jb2x1bW4uc2VhcmNoYWJsZSA/IHRoaXMuaGlnaGxpZ2h0LmhpZ2hsaWdodCh0ZXh0LCBjYXNlU2Vuc2l0aXZlLCBleGFjdE1hdGNoKSA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYXJzIHRoZSBoaWdobGlnaHQgb2YgdGhlIHRleHQgaW4gdGhlIGNlbGwuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuY2VsbC5jbGVhckhpZ2hMaWdodCgpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgcHVibGljIGNsZWFySGlnaGxpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHQgJiYgdGhpcy5jb2x1bW4uc2VhcmNoYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHQuY2xlYXJIaWdobGlnaHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgY2FsY3VsYXRlU2l6ZVRvRml0KHJhbmdlOiBhbnkpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF0Zm9ybVV0aWwuZ2V0Tm9kZVNpemVWaWFSYW5nZShyYW5nZSwgdGhpcy5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBzZWFyY2hNZXRhZGF0YSgpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gICAgICAgIG1ldGEuc2V0KCdwaW5uZWQnLCB0aGlzLmdyaWQuaXNSZWNvcmRQaW5uZWRCeVZpZXdJbmRleCh0aGlzLmludFJvdy5pbmRleCkpO1xuICAgICAgICByZXR1cm4gbWV0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfdXBkYXRlQ1JVRFN0YXR1cyhldmVudD86IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmVkaXRNb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWRpdGFibGVBcmdzO1xuICAgICAgICBjb25zdCBjcnVkID0gdGhpcy5ncmlkLmNydWRTZXJ2aWNlO1xuICAgICAgICBjb25zdCBlZGl0YWJsZUNlbGwgPSB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbDtcbiAgICAgICAgY29uc3QgZWRpdE1vZGUgPSAhIShjcnVkLnJvdyB8fCBjcnVkLmNlbGwpO1xuXG4gICAgICAgIGlmICh0aGlzLmVkaXRhYmxlICYmIGVkaXRNb2RlICYmICF0aGlzLmludFJvdy5kZWxldGVkKSB7XG4gICAgICAgICAgICBpZiAoZWRpdGFibGVDZWxsKSB7XG4gICAgICAgICAgICAgICAgZWRpdGFibGVBcmdzID0gdGhpcy5ncmlkLmNydWRTZXJ2aWNlLnVwZGF0ZUNlbGwoZmFsc2UsIGV2ZW50KTtcblxuICAgICAgICAgICAgICAgIC8qIFRoaXMgY2hlY2sgaXMgcmVsYXRlZCB3aXRoIHRoZSBmb2xsb3dpbmcgaXNzdWUgIzY1MTc6XG4gICAgICAgICAgICAgICAgICogd2hlbiBlZGl0IGNlbGwgdGhhdCBiZWxvbmdzIHRvIGEgY29sdW1uIHdoaWNoIGlzIHNvcnRlZCBhbmQgcHJlc3MgdGFiLFxuICAgICAgICAgICAgICAgICAqIHRoZSBuZXh0IGNlbGwgaW4gZWRpdCBtb2RlIGlzIHdpdGggd3JvbmcgdmFsdWUgL2l0cyBjb250ZXh0IGlzIG5vdCB1cGRhdGVkLztcbiAgICAgICAgICAgICAgICAgKiBTbyB3ZSByZWFwcGx5IHNvcnRpbmcgYmVmb3JlIHRoZSBuZXh0IGNlbGwgZW50ZXJzIGVkaXQgbW9kZS5cbiAgICAgICAgICAgICAgICAgKiBBbHNvIHdlIG5lZWQgdG8ga2VlcCB0aGUgbm90aWZ5Q2hhbmdlcyBiZWxvdywgYmVjYXVzZSBvZiB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgICAqIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUgd2hlbiB3ZSBoYXZlIGVkaXRpbmcgd2l0aCBlbmFibGVkIHRyYW5zYWN0aW9uc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWQuc29ydGluZ0V4cHJlc3Npb25zLmxlbmd0aCAmJiB0aGlzLmdyaWQuc29ydGluZ0V4cHJlc3Npb25zLmluZGV4T2YoZWRpdGFibGVDZWxsLmNvbHVtbi5maWVsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRhYmxlQXJncyAmJiBlZGl0YWJsZUFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNydWQuZXhpdENlbGxFZGl0KGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ3JpZC50Ym9keS5uYXRpdmVFbGVtZW50LmZvY3VzKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgICAgICAgICBjcnVkLmVudGVyRWRpdE1vZGUodGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVkaXRhYmxlQ2VsbCAmJiBjcnVkLnNhbWVSb3codGhpcy5jZWxsSUQucm93SUQpKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UudXBkYXRlQ2VsbCh0cnVlLCBldmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRpdE1vZGUgJiYgIWNydWQuc2FtZVJvdyh0aGlzLmNlbGxJRC5yb3dJRCkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5lbmRFZGl0KHRydWUsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkUG9pbnRlckxpc3RlbmVycyhzZWxlY3Rpb24pIHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbiAhPT0gR3JpZFNlbGVjdGlvbk1vZGUubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmVudGVyJywgdGhpcy5wb2ludGVyZW50ZXIpO1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5wb2ludGVydXApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlUG9pbnRlckxpc3RlbmVycyhzZWxlY3Rpb24pIHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbiAhPT0gR3JpZFNlbGVjdGlvbk1vZGUubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmVudGVyJywgdGhpcy5wb2ludGVyZW50ZXIpO1xuICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5wb2ludGVydXApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2VsbFR5cGUodXNlUm93PzogYm9vbGVhbik6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93SUQgPSB1c2VSb3cgPyB0aGlzLmdyaWQuY3JlYXRlUm93KHRoaXMuaW50Um93LmluZGV4LCB0aGlzLmludFJvdy5kYXRhKSA6IHRoaXMuaW50Um93LmluZGV4O1xuICAgICAgICByZXR1cm4gbmV3IElneEdyaWRDZWxsKHRoaXMuZ3JpZCwgcm93SUQsIHRoaXMuY29sdW1uLmZpZWxkKTtcbiAgICB9XG59XG4iLCI8bmctdGVtcGxhdGUgI2RlZmF1bHRQaW5uZWRJbmRpY2F0b3I+XG4gICAgPGlneC1jaGlwXG4gICAgICAgICpuZ0lmPVwiZGlzcGxheVBpbm5lZENoaXBcIlxuICAgICAgICBjbGFzcz1cImlneC1ncmlkX190ZC0tcGlubmVkLWNoaXBcIlxuICAgICAgICBbZGlzYWJsZWRdPVwidHJ1ZVwiXG4gICAgICAgIFtkaXNwbGF5RGVuc2l0eV09XCInY29tcGFjdCdcIlxuICAgICAgICA+e3sgZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfcGlubmVkX3Jvd19pbmRpY2F0b3IgfX08L2lneC1jaGlwXG4gICAgPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdENlbGw+XG4gICAgPGRpdiAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSAhPT0gJ2Jvb2xlYW4nIHx8IChjb2x1bW4uZGF0YVR5cGUgPT09ICdib29sZWFuJyAmJiB0aGlzLmZvcm1hdHRlcilcIlxuICAgICAgICBpZ3hUZXh0SGlnaGxpZ2h0XG4gICAgICAgIGNsYXNzPVwiaWd4LWdyaWRfX3RkLXRleHRcIlxuICAgICAgICBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiXG4gICAgICAgIFtjc3NDbGFzc109XCJoaWdobGlnaHRDbGFzc1wiXG4gICAgICAgIFthY3RpdmVDc3NDbGFzc109XCJhY3RpdmVIaWdobGlnaHRDbGFzc1wiXG4gICAgICAgIFtncm91cE5hbWVdPVwiZ3JpZElEXCJcbiAgICAgICAgW3ZhbHVlXT1cIlxuICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBjb2x1bW5Gb3JtYXR0ZXI6Zm9ybWF0dGVyOnJvd0RhdGEpXG4gICAgICAgICAgICAgICAgOiBjb2x1bW4uZGF0YVR5cGUgPT09ICdudW1iZXInXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBudW1iZXI6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpXG4gICAgICAgICAgICAgICAgOiAoY29sdW1uLmRhdGFUeXBlID09PSAnZGF0ZScgfHwgY29sdW1uLmRhdGFUeXBlID09PSAndGltZScgfHwgY29sdW1uLmRhdGFUeXBlID09PSAnZGF0ZVRpbWUnKVxuICAgICAgICAgICAgICAgID8gKHZhbHVlIHwgZGF0ZTpjb2x1bW4ucGlwZUFyZ3MuZm9ybWF0OmNvbHVtbi5waXBlQXJncy50aW1lem9uZTpncmlkLmxvY2FsZSlcbiAgICAgICAgICAgICAgICA6IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ2N1cnJlbmN5J1xuICAgICAgICAgICAgICAgID8gKHZhbHVlIHwgY3VycmVuY3k6Y3VycmVuY3lDb2RlOmNvbHVtbi5waXBlQXJncy5kaXNwbGF5OmNvbHVtbi5waXBlQXJncy5kaWdpdHNJbmZvOmdyaWQubG9jYWxlKVxuICAgICAgICAgICAgICAgIDogY29sdW1uLmRhdGFUeXBlID09PSAncGVyY2VudCdcbiAgICAgICAgICAgICAgICA/ICh2YWx1ZSB8IHBlcmNlbnQ6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpXG4gICAgICAgICAgICAgICAgOiB2YWx1ZVxuICAgICAgICBcIlxuICAgICAgICBbcm93XT1cInJvd0RhdGFcIlxuICAgICAgICBbY29sdW1uXT1cInRoaXMuY29sdW1uLmZpZWxkXCJcbiAgICAgICAgW2NvbnRhaW5lckNsYXNzXT1cIidpZ3gtZ3JpZF9fdGQtdGV4dCdcIlxuICAgICAgICBbbWV0YWRhdGFdPVwic2VhcmNoTWV0YWRhdGFcIlxuICAgID57e1xuICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBjb2x1bW5Gb3JtYXR0ZXI6Zm9ybWF0dGVyOnJvd0RhdGEpXG4gICAgICAgICAgICAgICAgOiBjb2x1bW4uZGF0YVR5cGUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICA/ICh2YWx1ZSB8IG51bWJlcjpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSlcbiAgICAgICAgICAgICAgICA6IChjb2x1bW4uZGF0YVR5cGUgPT09ICdkYXRlJyB8fCBjb2x1bW4uZGF0YVR5cGUgPT09ICd0aW1lJyB8fCBjb2x1bW4uZGF0YVR5cGUgPT09ICdkYXRlVGltZScpXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBkYXRlOmNvbHVtbi5waXBlQXJncy5mb3JtYXQ6Y29sdW1uLnBpcGVBcmdzLnRpbWV6b25lOmdyaWQubG9jYWxlKVxuICAgICAgICAgICAgICAgIDogY29sdW1uLmRhdGFUeXBlID09PSAnY3VycmVuY3knXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBjdXJyZW5jeTpjdXJyZW5jeUNvZGU6Y29sdW1uLnBpcGVBcmdzLmRpc3BsYXk6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpXG4gICAgICAgICAgICAgICAgOiBjb2x1bW4uZGF0YVR5cGUgPT09ICdwZXJjZW50J1xuICAgICAgICAgICAgICAgID8gKHZhbHVlIHwgcGVyY2VudDpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSlcbiAgICAgICAgICAgICAgICA6IHZhbHVlXG4gICAgICAgIH19PC9kaXY+XG4gICAgPGlneC1pY29uXG4gICAgICAgICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAnYm9vbGVhbicgJiYgIXRoaXMuZm9ybWF0dGVyXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyAnaWd4LWljb24tLXN1Y2Nlc3MnOiB2YWx1ZSwgJ2lneC1pY29uLS1lcnJvcic6ICF2YWx1ZSB9XCJcbiAgICAgICAgPnt7IHZhbHVlID8gXCJjaGVja1wiIDogXCJjbG9zZVwiIH19PC9pZ3gtaWNvblxuICAgID5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2FkZFJvd0NlbGwgbGV0LWNlbGw9XCJjZWxsXCI+XG4gICAgPGRpdiAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSAhPT0gJ2Jvb2xlYW4nIHx8IChjb2x1bW4uZGF0YVR5cGUgPT09ICdib29sZWFuJyAmJiB0aGlzLmZvcm1hdHRlcilcIlxuICAgICAgICBpZ3hUZXh0SGlnaGxpZ2h0IGNsYXNzPVwiaWd4LWdyaWRfX3RkLXRleHRcIiBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lXCJcbiAgICBbY3NzQ2xhc3NdPVwiaGlnaGxpZ2h0Q2xhc3NcIlxuICAgIFthY3RpdmVDc3NDbGFzc109XCJhY3RpdmVIaWdobGlnaHRDbGFzc1wiXG4gICAgW2dyb3VwTmFtZV09XCJncmlkSURcIlxuICAgIFt2YWx1ZV09XCJmb3JtYXR0ZXIgPyAodmFsdWUgfCBjb2x1bW5Gb3JtYXR0ZXI6Zm9ybWF0dGVyOnJvd0RhdGEpIDogY29sdW1uLmRhdGFUeXBlID09PSAnbnVtYmVyJyA/XG4gICAgICAgICh2YWx1ZSB8IG51bWJlcjpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSkgOiAoY29sdW1uLmRhdGFUeXBlID09PSAnZGF0ZScgfHwgY29sdW1uLmRhdGFUeXBlID09PSAndGltZScgfHwgY29sdW1uLmRhdGFUeXBlID09PSAnZGF0ZVRpbWUnKSA/XG4gICAgICAgICh2YWx1ZSB8IGRhdGU6Y29sdW1uLnBpcGVBcmdzLmZvcm1hdDpjb2x1bW4ucGlwZUFyZ3MudGltZXpvbmU6Z3JpZC5sb2NhbGUpIDogY29sdW1uLmRhdGFUeXBlID09PSAnY3VycmVuY3knID9cbiAgICAgICAgKHZhbHVlIHwgY3VycmVuY3k6Y3VycmVuY3lDb2RlOmNvbHVtbi5waXBlQXJncy5kaXNwbGF5OmNvbHVtbi5waXBlQXJncy5kaWdpdHNJbmZvOmdyaWQubG9jYWxlKSA6IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ3BlcmNlbnQnID9cbiAgICAgICAgKHZhbHVlIHwgcGVyY2VudDpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSkgOiB2YWx1ZVwiXG4gICAgW3Jvd109XCJyb3dEYXRhXCJcbiAgICBbY29sdW1uXT1cInRoaXMuY29sdW1uLmZpZWxkXCJcbiAgICBbY29udGFpbmVyQ2xhc3NdPVwiJ2lneC1ncmlkX190ZC10ZXh0J1wiXG4gICAgW21ldGFkYXRhXT1cInNlYXJjaE1ldGFkYXRhXCI+e3tcbiAgICAgICAgIWlzRW1wdHlBZGRSb3dDZWxsID8gdmFsdWUgOiAoY29sdW1uLmhlYWRlciB8fCBjb2x1bW4uZmllbGQpXG4gICAgfX08L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2lubGluZUVkaXRvciBsZXQtY2VsbD1cImNlbGxcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAnc3RyaW5nJ1wiPlxuICAgICAgICA8aWd4LWlucHV0LWdyb3VwIGRpc3BsYXlEZW5zaXR5PVwiY29tcGFjdFwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgaWd4SW5wdXRcbiAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cImVkaXRWYWx1ZVwiXG4gICAgICAgICAgICAgICAgW2lneEZvY3VzXT1cInRydWVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9pZ3gtaW5wdXQtZ3JvdXA+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSA9PT0gJ251bWJlcidcIj5cbiAgICAgICAgPGlneC1pbnB1dC1ncm91cCBkaXNwbGF5RGVuc2l0eT1cImNvbXBhY3RcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGlneElucHV0XG4gICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJlZGl0VmFsdWVcIlxuICAgICAgICAgICAgICAgIFtpZ3hGb2N1c109XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBbc3RlcF09XCJzdGVwXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvaWd4LWlucHV0LWdyb3VwPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZGF0YVR5cGUgPT09ICdib29sZWFuJ1wiPlxuICAgICAgICA8aWd4LWNoZWNrYm94XG4gICAgICAgICAgICBbY2hlY2tlZF09XCJlZGl0VmFsdWVcIlxuICAgICAgICAgICAgKGNoYW5nZSk9XCJlZGl0VmFsdWUgPSAkZXZlbnQuY2hlY2tlZFwiXG4gICAgICAgICAgICBbaWd4Rm9jdXNdPVwidHJ1ZVwiXG4gICAgICAgICAgICBbZGlzYWJsZVJpcHBsZV09XCJ0cnVlXCJcbiAgICAgICAgPjwvaWd4LWNoZWNrYm94PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZGF0YVR5cGUgPT09ICdkYXRlJ1wiPlxuICAgICAgICA8aWd4LWRhdGUtcGlja2VyXG4gICAgICAgICAgICBbc3R5bGUud2lkdGguJV09XCIxMDBcIlxuICAgICAgICAgICAgW291dGxldF09XCJncmlkLm91dGxldFwiXG4gICAgICAgICAgICBtb2RlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgW2xvY2FsZV09XCJncmlkLmxvY2FsZVwiXG4gICAgICAgICAgICBbKHZhbHVlKV09XCJlZGl0VmFsdWVcIlxuICAgICAgICAgICAgW2lneEZvY3VzXT1cInRydWVcIlxuICAgICAgICA+XG4gICAgICAgIDwvaWd4LWRhdGUtcGlja2VyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZGF0YVR5cGUgPT09ICd0aW1lJ1wiPlxuICAgICAgICA8aWd4LXRpbWUtcGlja2VyXG4gICAgICAgICAgICBbc3R5bGUud2lkdGguJV09XCIxMDBcIlxuICAgICAgICAgICAgW291dGxldF09XCJncmlkLm91dGxldFwiXG4gICAgICAgICAgICBtb2RlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgW2xvY2FsZV09XCJncmlkLmxvY2FsZVwiXG4gICAgICAgICAgICBbaW5wdXRGb3JtYXRdPVwiY29sdW1uLmRlZmF1bHRUaW1lRm9ybWF0XCJcbiAgICAgICAgICAgIFsodmFsdWUpXT1cImVkaXRWYWx1ZVwiXG4gICAgICAgICAgICBbaWd4Rm9jdXNdPVwidHJ1ZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgIDwvaWd4LXRpbWUtcGlja2VyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZGF0YVR5cGUgPT09ICdkYXRlVGltZSdcIj5cbiAgICAgICAgPGlneC1pbnB1dC1ncm91cD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlneElucHV0IFtpZ3hEYXRlVGltZUVkaXRvcl09XCJjb2x1bW4uZGVmYXVsdERhdGVUaW1lRm9ybWF0XCIgWyhuZ01vZGVsKV09XCJlZGl0VmFsdWVcIiBbaWd4Rm9jdXNdPVwidHJ1ZVwiLz5cbiAgICAgICAgPC9pZ3gtaW5wdXQtZ3JvdXA+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSA9PT0gJ2N1cnJlbmN5J1wiPlxuICAgICAgICA8aWd4LWlucHV0LWdyb3VwIGRpc3BsYXlEZW5zaXR5PVwiY29tcGFjdFwiPlxuICAgICAgICAgICAgPGlneC1wcmVmaXggKm5nSWY9XCJncmlkLmN1cnJlbmN5UG9zaXRpb25MZWZ0XCI+e3sgY3VycmVuY3lDb2RlU3ltYm9sIH19PC9pZ3gtcHJlZml4PlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgaWd4SW5wdXRcbiAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cImVkaXRWYWx1ZVwiXG4gICAgICAgICAgICAgICAgW2lneEZvY3VzXT1cInRydWVcIlxuICAgICAgICAgICAgICAgIFtzdGVwXT1cInN0ZXBcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxpZ3gtc3VmZml4ICpuZ0lmPVwiIWdyaWQuY3VycmVuY3lQb3NpdGlvbkxlZnRcIiA+e3sgY3VycmVuY3lDb2RlU3ltYm9sIH19PC9pZ3gtc3VmZml4PlxuICAgICAgICA8L2lneC1pbnB1dC1ncm91cD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAncGVyY2VudCdcIj5cbiAgICAgICAgPGlneC1pbnB1dC1ncm91cCBkaXNwbGF5RGVuc2l0eT1cImNvbXBhY3RcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGlneElucHV0XG4gICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJlZGl0VmFsdWVcIlxuICAgICAgICAgICAgICAgIFtpZ3hGb2N1c109XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBbc3RlcF09XCJzdGVwXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8aWd4LXN1ZmZpeD4ge3sgZWRpdFZhbHVlIHwgcGVyY2VudDpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSB9fSA8L2lneC1zdWZmaXg+XG4gICAgICAgIDwvaWd4LWlucHV0LWdyb3VwPlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwaW5uZWRJbmRpY2F0b3JUZW1wbGF0ZTsgY29udGV4dDogY29udGV4dFwiPlxuPC9uZy1jb250YWluZXI+XG48bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IGNvbnRleHRcIj48L25nLWNvbnRhaW5lcj5cbiJdfQ==