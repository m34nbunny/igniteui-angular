import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { NAVIGATION_KEYS, ROW_COLLAPSE_KEYS, ROW_EXPAND_KEYS, SUPPORTED_KEYS, HORIZONTAL_NAV_KEYS, HEADER_KEYS, ROW_ADD_KEYS } from '../core/utils';
import { GridSelectionMode, FilterMode } from './common/enums';
import { SortingDirection } from '../data-operations/sorting-strategy';
import * as i0 from "@angular/core";
import * as i1 from "../core/utils";
/** @hidden */
export class IgxGridNavigationService {
    constructor(platform) {
        this.platform = platform;
        this._activeNode = {};
        this.lastActiveNode = {};
        this.pendingNavigation = false;
    }
    get activeNode() {
        return this._activeNode;
    }
    set activeNode(value) {
        this._activeNode = value;
    }
    handleNavigation(event) {
        const key = event.key.toLowerCase();
        if (NAVIGATION_KEYS.has(key)) {
            event.stopPropagation();
        }
        if (this.grid.crudService.cell && NAVIGATION_KEYS.has(key)) {
            return;
        }
        if (event.repeat && SUPPORTED_KEYS.has(key) || (key === 'tab' && this.grid.crudService.cell)) {
            event.preventDefault();
        }
        if (event.repeat) {
            setTimeout(() => this.dispatchEvent(event), 1);
        }
        else {
            this.dispatchEvent(event);
        }
    }
    dispatchEvent(event) {
        const key = event.key.toLowerCase();
        if (!this.activeNode || !(SUPPORTED_KEYS.has(key) || (key === 'tab' && this.grid.crudService.cell)) &&
            !this.grid.crudService.rowEditingBlocked && !this.grid.crudService.rowInEditMode) {
            return;
        }
        const shift = event.shiftKey;
        const ctrl = event.ctrlKey;
        if (NAVIGATION_KEYS.has(key) && this.pendingNavigation) {
            event.preventDefault();
            return;
        }
        const type = this.isDataRow(this.activeNode.row) ? 'dataCell' :
            this.isDataRow(this.activeNode.row, true) ? 'summaryCell' : 'groupRow';
        if (this.emitKeyDown(type, this.activeNode.row, event)) {
            return;
        }
        if (event.altKey) {
            this.handleAlt(key, event);
            return;
        }
        if ([' ', 'spacebar', 'space'].indexOf(key) === -1) {
            this.grid.selectionService.keyboardStateOnKeydown(this.activeNode, shift, shift && key === 'tab');
        }
        const position = this.getNextPosition(this.activeNode.row, this.activeNode.column, key, shift, ctrl, event);
        if (NAVIGATION_KEYS.has(key)) {
            event.preventDefault();
            this.navigateInBody(position.rowIndex, position.colIndex, (obj) => {
                obj.target.activate(event);
                this.grid.cdr.detectChanges();
            });
        }
        this.grid.cdr.detectChanges();
    }
    summaryNav(event) {
        if (this.grid.hasSummarizedColumns) {
            this.horizontalNav(event, event.key.toLowerCase(), this.grid.dataView.length, 'summaryCell');
        }
    }
    headerNavigation(event) {
        const key = event.key.toLowerCase();
        if (!HEADER_KEYS.has(key)) {
            return;
        }
        event.preventDefault();
        const ctrl = event.ctrlKey;
        const shift = event.shiftKey;
        const alt = event.altKey;
        this.performHeaderKeyCombination(this.currentActiveColumn, key, shift, ctrl, alt, event);
        if (shift || alt || (ctrl && (key.includes('down') || key.includes('down')))) {
            return;
        }
        if (this.grid.hasColumnGroups) {
            this.handleMCHeaderNav(key, ctrl);
        }
        else {
            this.horizontalNav(event, key, -1, 'headerCell');
        }
    }
    focusTbody(event) {
        const gridRows = this.grid.verticalScrollContainer.totalItemCount ?? this.grid.dataView.length;
        if (gridRows < 1) {
            this.activeNode = null;
            return;
        }
        if (!this.activeNode || !Object.keys(this.activeNode).length || this.activeNode.row < 0 || this.activeNode.row > gridRows - 1) {
            const hasLastActiveNode = Object.keys(this.lastActiveNode).length;
            const shouldClearSelection = hasLastActiveNode && (this.lastActiveNode.row < 0 || this.lastActiveNode.row > gridRows - 1);
            this.setActiveNode(this.lastActiveNode.row >= 0 && this.lastActiveNode.row < gridRows ?
                this.firstVisibleNode(this.lastActiveNode.row) : this.firstVisibleNode());
            if (shouldClearSelection || (this.grid.cellSelection !== GridSelectionMode.multiple)) {
                this.grid.clearCellSelection();
                this.grid.navigateTo(this.activeNode.row, this.activeNode.column, (obj) => {
                    obj.target?.activate(event);
                    this.grid.cdr.detectChanges();
                });
            }
            else {
                const range = {
                    rowStart: this.activeNode.row, rowEnd: this.activeNode.row,
                    columnStart: this.activeNode.column, columnEnd: this.activeNode.column
                };
                this.grid.selectRange(range);
                this.grid.notifyChanges();
            }
        }
    }
    focusFirstCell(header = true) {
        if ((header || this.grid.dataView.length) && this.activeNode &&
            (this.activeNode.row === -1 || this.activeNode.row === this.grid.dataView.length ||
                (!header && !this.grid.hasSummarizedColumns))) {
            return;
        }
        const shouldScrollIntoView = this.lastActiveNode && (header && this.lastActiveNode.row !== -1) ||
            (!header && this.lastActiveNode.row !== this.grid.dataView.length);
        this.setActiveNode(this.firstVisibleNode(header ? -1 : this.grid.dataView.length));
        if (shouldScrollIntoView) {
            this.performHorizontalScrollToCell(this.activeNode.column);
        }
    }
    isColumnFullyVisible(columnIndex) {
        if (columnIndex < 0 || this.isColumnPinned(columnIndex, this.forOfDir())) {
            return true;
        }
        const index = this.getColumnUnpinnedIndex(columnIndex);
        const width = this.forOfDir().getColumnScrollLeft(index + 1) - this.forOfDir().getColumnScrollLeft(index);
        if (this.displayContainerWidth < width && this.displayContainerScrollLeft === this.forOfDir().getColumnScrollLeft(index)) {
            return true;
        }
        return this.displayContainerWidth >= this.forOfDir().getColumnScrollLeft(index + 1) - this.displayContainerScrollLeft &&
            this.displayContainerScrollLeft <= this.forOfDir().getColumnScrollLeft(index);
    }
    shouldPerformHorizontalScroll(visibleColIndex, rowIndex = -1) {
        if (visibleColIndex < 0 || visibleColIndex > this.grid.visibleColumns.length - 1) {
            return false;
        }
        if (rowIndex < 0 || rowIndex > this.grid.dataView.length - 1) {
            return !this.isColumnFullyVisible(visibleColIndex);
        }
        const row = this.grid.dataView[rowIndex];
        return row.expression || row.detailsData ? false : !this.isColumnFullyVisible(visibleColIndex);
    }
    shouldPerformVerticalScroll(targetRowIndex, visibleColIndex) {
        if (this.grid.isRecordPinnedByViewIndex(targetRowIndex)) {
            return false;
        }
        const scrollRowIndex = this.grid.hasPinnedRecords && this.grid.isRowPinningToTop ?
            targetRowIndex - this.grid.pinnedDataView.length : targetRowIndex;
        const targetRow = this.getRowElementByIndex(targetRowIndex);
        const rowHeight = this.grid.verticalScrollContainer.getSizeAt(scrollRowIndex);
        const containerHeight = this.grid.calcHeight ? Math.ceil(this.grid.calcHeight) : 0;
        const endTopOffset = targetRow ? targetRow.offsetTop + rowHeight + this.containerTopOffset : containerHeight + rowHeight;
        // this is workaround: endTopOffset - containerHeight > 5 and should be replaced with: containerHeight < endTopOffset
        // when the page is zoomed the grid does not scroll the row completely in the view
        return !targetRow || targetRow.offsetTop < Math.abs(this.containerTopOffset)
            || containerHeight && endTopOffset - containerHeight > 5;
    }
    performVerticalScrollToCell(rowIndex, visibleColIndex = -1, cb) {
        if (!this.shouldPerformVerticalScroll(rowIndex, visibleColIndex)) {
            return;
        }
        this.pendingNavigation = true;
        // Only for top pinning we need to subtract pinned count because virtualization indexing doesn't count pinned rows.
        const scrollRowIndex = this.grid.hasPinnedRecords && this.grid.isRowPinningToTop ?
            rowIndex - this.grid.pinnedDataView.length : rowIndex;
        this.grid.verticalScrollContainer.scrollTo(scrollRowIndex);
        this.grid.verticalScrollContainer.chunkLoad
            .pipe(first()).subscribe(() => {
            this.pendingNavigation = false;
            if (cb) {
                cb();
            }
        });
    }
    performHorizontalScrollToCell(visibleColumnIndex, cb) {
        if (this.grid.rowList < 1 && this.grid.summariesRowList.length < 1 && this.grid.hasColumnGroups) {
            let column = this.grid.getColumnByVisibleIndex(visibleColumnIndex);
            while (column.parent) {
                column = column.parent;
            }
            visibleColumnIndex = this.forOfDir().igxForOf.indexOf(column);
        }
        if (!this.shouldPerformHorizontalScroll(visibleColumnIndex)) {
            return;
        }
        this.pendingNavigation = true;
        this.grid.parentVirtDir.chunkLoad
            .pipe(first())
            .subscribe(() => {
            this.pendingNavigation = false;
            if (cb) {
                cb();
            }
        });
        this.forOfDir().scrollTo(this.getColumnUnpinnedIndex(visibleColumnIndex));
    }
    isDataRow(rowIndex, includeSummary = false) {
        let curRow;
        if (rowIndex < 0 || rowIndex > this.grid.dataView.length - 1) {
            curRow = this.grid.dataView[rowIndex - this.grid.virtualizationState.startIndex];
            if (!curRow) {
                // if data is remote, record might not be in the view yet.
                return this.grid.verticalScrollContainer.isRemote && rowIndex >= 0 && rowIndex <= this.grid.totalItemCount - 1;
            }
        }
        else {
            curRow = this.grid.dataView[rowIndex];
        }
        return curRow && !this.grid.isGroupByRecord(curRow) && !this.grid.isDetailRecord(curRow)
            && !curRow.childGridsData && (includeSummary || !curRow.summaries);
    }
    isGroupRow(rowIndex) {
        if (rowIndex < 0 || rowIndex > this.grid.dataView.length - 1) {
            return false;
        }
        const curRow = this.grid.dataView[rowIndex];
        return curRow && this.grid.isGroupByRecord(curRow);
    }
    setActiveNode(activeNode) {
        if (!this.isActiveNodeChanged(activeNode)) {
            return;
        }
        if (!this.activeNode) {
            this.activeNode = activeNode;
        }
        Object.assign(this.activeNode, activeNode);
        const currRow = this.grid.dataView[activeNode.row];
        const type = activeNode.row < 0 ? 'headerCell' :
            this.isDataRow(activeNode.row) ? 'dataCell' :
                currRow && this.grid.isGroupByRecord(currRow) ? 'groupRow' :
                    currRow && this.grid.isDetailRecord(currRow) ? 'masterDetailRow' : 'summaryCell';
        const args = {
            row: this.activeNode.row,
            column: this.activeNode.column,
            level: this.activeNode.level,
            tag: type
        };
        this.grid.activeNodeChange.emit(args);
    }
    isActiveNodeChanged(activeNode) {
        let isChanged = false;
        const checkInnerProp = (aciveNode, prop) => {
            if (!aciveNode) {
                isChanged = true;
                return;
            }
            props = Object.getOwnPropertyNames(aciveNode);
            for (const propName of props) {
                if (this.activeNode[prop][propName] !== aciveNode[propName]) {
                    isChanged = true;
                }
            }
        };
        if (!this.activeNode) {
            return isChanged = true;
        }
        let props = Object.getOwnPropertyNames(activeNode);
        for (const propName of props) {
            if (!!this.activeNode[propName] && typeof this.activeNode[propName] === 'object') {
                checkInnerProp(activeNode[propName], propName);
            }
            else if (this.activeNode[propName] !== activeNode[propName]) {
                isChanged = true;
            }
        }
        return isChanged;
    }
    getNextPosition(rowIndex, colIndex, key, shift, ctrl, event) {
        if (!this.isDataRow(rowIndex, true) && (key.indexOf('down') < 0 || key.indexOf('up') < 0) && ctrl) {
            return { rowIndex, colIndex };
        }
        switch (key) {
            case 'pagedown':
            case 'pageup':
                event.preventDefault();
                if (key === 'pagedown') {
                    this.grid.verticalScrollContainer.scrollNextPage();
                }
                else {
                    this.grid.verticalScrollContainer.scrollPrevPage();
                }
                const editCell = this.grid.crudService.cell;
                this.grid.verticalScrollContainer.chunkLoad
                    .pipe(first()).subscribe(() => {
                    if (editCell && this.grid.rowList.map(r => r.index).indexOf(editCell.rowIndex) < 0) {
                        this.grid.tbody.nativeElement.focus({ preventScroll: true });
                    }
                });
                break;
            case 'tab':
                this.handleEditing(shift, event);
                break;
            case 'end':
                rowIndex = ctrl ? this.findLastDataRowIndex() : this.activeNode.row;
                colIndex = this.lastColumnIndex;
                break;
            case 'home':
                rowIndex = ctrl ? this.findFirstDataRowIndex() : this.activeNode.row;
                colIndex = 0;
                break;
            case 'arrowleft':
            case 'left':
                colIndex = ctrl ? 0 : this.activeNode.column - 1;
                break;
            case 'arrowright':
            case 'right':
                colIndex = ctrl ? this.lastColumnIndex : this.activeNode.column + 1;
                break;
            case 'arrowup':
            case 'up':
                if (ctrl && !this.isDataRow(rowIndex) || (this.grid.rowEditable && this.grid.crudService.rowEditingBlocked)) {
                    break;
                }
                colIndex = this.activeNode.column !== undefined ? this.activeNode.column : 0;
                rowIndex = ctrl ? this.findFirstDataRowIndex() : this.activeNode.row - 1;
                break;
            case 'arrowdown':
            case 'down':
                if ((ctrl && !this.isDataRow(rowIndex)) || (this.grid.rowEditable && this.grid.crudService.rowEditingBlocked)) {
                    break;
                }
                colIndex = this.activeNode.column !== undefined ? this.activeNode.column : 0;
                rowIndex = ctrl ? this.findLastDataRowIndex() : this.activeNode.row + 1;
                break;
            case 'enter':
            case 'f2':
                const cell = this.grid.gridAPI.get_cell_by_visible_index(this.activeNode.row, this.activeNode.column);
                if (!this.isDataRow(rowIndex) || !cell.editable) {
                    break;
                }
                this.grid.crudService.enterEditMode(cell, event);
                break;
            case 'escape':
            case 'esc':
                if (!this.isDataRow(rowIndex)) {
                    break;
                }
                if (this.grid.crudService.isInCompositionMode) {
                    return;
                }
                if (this.grid.crudService.cellInEditMode || this.grid.crudService.rowInEditMode) {
                    this.grid.crudService.endEdit(false, event);
                    if (this.platform.isEdge) {
                        this.grid.cdr.detectChanges();
                    }
                    this.grid.tbody.nativeElement.focus();
                }
                break;
            case ' ':
            case 'spacebar':
            case 'space':
                const rowObj = this.grid.gridAPI.get_row_by_index(this.activeNode.row);
                if (this.grid.isRowSelectable && rowObj) {
                    if (this.isDataRow(rowIndex)) {
                        if (rowObj.selected) {
                            this.grid.selectionService.deselectRow(rowObj.key, event);
                        }
                        else {
                            this.grid.selectionService.selectRowById(rowObj.key, false, event);
                        }
                    }
                    if (this.isGroupRow(rowIndex)) {
                        rowObj.onGroupSelectorClick(event);
                    }
                }
                break;
            default:
                return;
        }
        return { rowIndex, colIndex };
    }
    horizontalNav(event, key, rowIndex, tag) {
        const ctrl = event.ctrlKey;
        if (!HORIZONTAL_NAV_KEYS.has(event.key.toLowerCase())) {
            return;
        }
        event.preventDefault();
        this.activeNode.row = rowIndex;
        if (rowIndex > 0) {
            if (this.emitKeyDown('summaryCell', this.activeNode.row, event)) {
                return;
            }
        }
        const newActiveNode = {
            column: this.activeNode.column,
            mchCache: {
                level: this.activeNode.level,
                visibleIndex: this.activeNode.column
            }
        };
        if ((key.includes('left') || key === 'home') && this.activeNode.column > 0) {
            newActiveNode.column = ctrl || key === 'home' ? 0 : this.activeNode.column - 1;
        }
        if ((key.includes('right') || key === 'end') && this.activeNode.column < this.lastColumnIndex) {
            newActiveNode.column = ctrl || key === 'end' ? this.lastColumnIndex : this.activeNode.column + 1;
        }
        if (tag === 'headerCell') {
            const column = this.grid.getColumnByVisibleIndex(newActiveNode.column);
            newActiveNode.mchCache.level = column.level;
            newActiveNode.mchCache.visibleIndex = column.visibleIndex;
        }
        this.setActiveNode({ row: this.activeNode.row, column: newActiveNode.column, mchCache: newActiveNode.mchCache });
        this.performHorizontalScrollToCell(this.activeNode.column);
    }
    get lastColumnIndex() {
        return Math.max(...this.grid.visibleColumns.map(col => col.visibleIndex));
    }
    get displayContainerWidth() {
        return Math.round(this.grid.parentVirtDir.dc.instance._viewContainer.element.nativeElement.offsetWidth);
    }
    get displayContainerScrollLeft() {
        return Math.ceil(this.grid.headerContainer.scrollPosition);
    }
    get containerTopOffset() {
        return parseInt(this.grid.verticalScrollContainer.dc.instance._viewContainer.element.nativeElement.style.top, 10);
    }
    getColumnUnpinnedIndex(visibleColumnIndex) {
        const column = this.grid.unpinnedColumns.find((col) => !col.columnGroup && col.visibleIndex === visibleColumnIndex);
        return this.grid.pinnedColumns.length ? this.grid.unpinnedColumns.filter((c) => !c.columnGroup).indexOf(column) :
            visibleColumnIndex;
    }
    forOfDir() {
        const forOfDir = this.grid.dataRowList.length > 0 ? this.grid.dataRowList.first.virtDirRow : this.grid.summariesRowList.length ?
            this.grid.summariesRowList.first.virtDirRow : this.grid.headerContainer;
        return forOfDir;
    }
    handleAlt(key, event) {
        event.preventDefault();
        // todo TODO ROW
        const row = this.grid.gridAPI.get_row_by_index(this.activeNode.row);
        if (!(this.isToggleKey(key) || this.isAddKey(key)) || !row) {
            return;
        }
        if (this.isAddKey(key)) {
            if (!this.grid.rowEditable) {
                console.warn('The grid must be in row edit mode to perform row adding!');
                return;
            }
            if (event.shiftKey && row.treeRow !== undefined) {
                this.grid.crudService.enterAddRowMode(row, true, event);
            }
            else if (!event.shiftKey) {
                this.grid.crudService.enterAddRowMode(row, false, event);
            }
        }
        else if (!row.expanded && ROW_EXPAND_KEYS.has(key)) {
            if (row.key === undefined) {
                // TODO use expanded row.expanded = !row.expanded;
                row.toggle();
            }
            else {
                this.grid.gridAPI.set_row_expansion_state(row.key, true, event);
            }
        }
        else if (row.expanded && ROW_COLLAPSE_KEYS.has(key)) {
            if (row.key === undefined) {
                // TODO use expanded row.expanded = !row.expanded;
                row.toggle();
            }
            else {
                this.grid.gridAPI.set_row_expansion_state(row.key, false, event);
            }
        }
        this.grid.notifyChanges();
    }
    handleEditing(shift, event) {
        const next = shift ? this.grid.getPreviousCell(this.activeNode.row, this.activeNode.column, col => col.editable) :
            this.grid.getNextCell(this.activeNode.row, this.activeNode.column, col => col.editable);
        if (!this.grid.crudService.rowInEditMode && this.isActiveNode(next.rowIndex, next.visibleColumnIndex)) {
            this.grid.crudService.endEdit(true, event);
            this.grid.tbody.nativeElement.focus();
            return;
        }
        event.preventDefault();
        if ((this.grid.crudService.rowInEditMode && this.grid.rowEditTabs.length) &&
            (this.activeNode.row !== next.rowIndex || this.isActiveNode(next.rowIndex, next.visibleColumnIndex))) {
            const args = this.grid.crudService.updateCell(true, event);
            if (args.cancel) {
                return;
            }
            else if (shift) {
                this.grid.rowEditTabs.last.element.nativeElement.focus();
            }
            else {
                this.grid.rowEditTabs.first.element.nativeElement.focus();
            }
            return;
        }
        if (this.grid.crudService.rowInEditMode && !this.grid.rowEditTabs.length) {
            if (shift && next.rowIndex === this.activeNode.row && next.visibleColumnIndex === this.activeNode.column) {
                next.visibleColumnIndex = this.grid.lastEditableColumnIndex;
            }
            else if (!shift && next.rowIndex === this.activeNode.row && next.visibleColumnIndex === this.activeNode.column) {
                next.visibleColumnIndex = this.grid.firstEditableColumnIndex;
            }
            else {
                next.rowIndex = this.activeNode.row;
            }
        }
        this.navigateInBody(next.rowIndex, next.visibleColumnIndex, (obj) => {
            obj.target.activate(event);
            this.grid.cdr.detectChanges();
        });
    }
    navigateInBody(rowIndex, visibleColIndex, cb = null) {
        if (!this.isValidPosition(rowIndex, visibleColIndex) || this.isActiveNode(rowIndex, visibleColIndex)) {
            return;
        }
        this.grid.navigateTo(rowIndex, visibleColIndex, cb);
    }
    emitKeyDown(type, rowIndex, event) {
        const row = this.grid.summariesRowList.toArray().concat(this.grid.rowList.toArray()).find(r => r.index === rowIndex);
        if (!row) {
            return;
        }
        const target = type === 'groupRow' ? row :
            type === 'dataCell' ? row.cells?.find(c => c.visibleColumnIndex === this.activeNode.column) :
                row.summaryCells?.find(c => c.visibleColumnIndex === this.activeNode.column);
        const keydownArgs = { targetType: type, event, cancel: false, target };
        this.grid.gridKeydown.emit(keydownArgs);
        if (keydownArgs.cancel && type === 'dataCell') {
            this.grid.selectionService.clear();
            this.grid.selectionService.keyboardState.active = true;
            return keydownArgs.cancel;
        }
    }
    isColumnPinned(columnIndex, forOfDir) {
        const horizontalScroll = forOfDir.getScroll();
        return (!horizontalScroll.clientWidth || this.grid.getColumnByVisibleIndex(columnIndex)?.pinned);
    }
    findFirstDataRowIndex() {
        return this.grid.dataView.findIndex(rec => !this.grid.isGroupByRecord(rec) && !this.grid.isDetailRecord(rec) && !rec.summaries);
    }
    findLastDataRowIndex() {
        if (this.grid.totalItemCount) {
            return this.grid.totalItemCount - 1;
        }
        let i = this.grid.dataView.length;
        while (i--) {
            if (this.isDataRow(i)) {
                return i;
            }
        }
    }
    getRowElementByIndex(index) {
        if (this.grid.hasDetails) {
            const detail = this.grid.nativeElement.querySelector(`[detail="true"][data-rowindex="${index}"]`);
            if (detail) {
                return detail;
            }
        }
        return this.grid.rowList.toArray().concat(this.grid.summariesRowList.toArray()).find(r => r.index === index)?.nativeElement;
    }
    isValidPosition(rowIndex, colIndex) {
        const length = this.grid.totalItemCount ?? this.grid.dataView.length;
        if (rowIndex < 0 || colIndex < 0 || length - 1 < rowIndex || this.lastColumnIndex < colIndex) {
            return false;
        }
        return this.activeNode.column !== colIndex && !this.isDataRow(rowIndex, true) ? false : true;
    }
    performHeaderKeyCombination(column, key, shift, ctrl, alt, event) {
        let direction = this.grid.sortingExpressions.find(expr => expr.fieldName === column.field)?.dir;
        if (ctrl && key.includes('up') && column.sortable && !column.columnGroup) {
            direction = direction === SortingDirection.Asc ? SortingDirection.None : SortingDirection.Asc;
            this.grid.sort({ fieldName: column.field, dir: direction, ignoreCase: false });
            return;
        }
        if (ctrl && key.includes('down') && column.sortable && !column.columnGroup) {
            direction = direction === SortingDirection.Desc ? SortingDirection.None : SortingDirection.Desc;
            this.grid.sort({ fieldName: column.field, dir: direction, ignoreCase: false });
            return;
        }
        if (shift && alt && this.isToggleKey(key) && !column.columnGroup && column.groupable) {
            direction = direction || SortingDirection.Asc;
            if (key.includes('right')) {
                this.grid.groupBy({
                    fieldName: column.field,
                    dir: direction,
                    ignoreCase: column.sortingIgnoreCase,
                    strategy: column.sortStrategy,
                    groupingComparer: column.groupingComparer,
                });
            }
            else {
                this.grid.clearGrouping(column.field);
            }
            this.activeNode.column = key.includes('right') && this.grid.hideGroupedColumns &&
                column.visibleIndex === this.lastColumnIndex ? this.lastColumnIndex - 1 : this.activeNode.column;
            return;
        }
        if (alt && (ROW_EXPAND_KEYS.has(key) || ROW_COLLAPSE_KEYS.has(key))) {
            this.handleMCHExpandCollapse(key, column);
            return;
        }
        if ([' ', 'spacebar', 'space'].indexOf(key) !== -1) {
            this.handleColumnSelection(column, event);
        }
        if (alt && (key === 'l' || key === '??') && this.grid.allowAdvancedFiltering) {
            this.grid.openAdvancedFilteringDialog();
        }
        if (ctrl && shift && key === 'l' && this.grid.allowFiltering && !column.columnGroup && column.filterable) {
            if (this.grid.filterMode === FilterMode.excelStyleFilter) {
                const headerEl = this.grid.headerGroups.find(g => g.active).nativeElement;
                this.grid.filteringService.toggleFilterDropdown(headerEl, column);
            }
            else {
                this.performHorizontalScrollToCell(column.visibleIndex);
                this.grid.filteringService.filteredColumn = column;
                this.grid.filteringService.isFilterRowVisible = true;
            }
        }
    }
    firstVisibleNode(rowIndex) {
        const colIndex = this.lastActiveNode.column !== undefined ? this.lastActiveNode.column :
            this.grid.visibleColumns.sort((c1, c2) => c1.visibleIndex - c2.visibleIndex)
                .find(c => this.isColumnFullyVisible(c.visibleIndex))?.visibleIndex;
        const column = this.grid.visibleColumns.find((col) => !col.columnLayout && col.visibleIndex === colIndex);
        const rowInd = rowIndex ? rowIndex : this.grid.rowList.find(r => !this.shouldPerformVerticalScroll(r.index, colIndex))?.index;
        const node = {
            row: rowInd ?? 0,
            column: column?.visibleIndex ?? 0, level: column?.level ?? 0,
            mchCache: column ? { level: column.level, visibleIndex: column.visibleIndex } : {},
            layout: column && column.columnLayoutChild ? {
                rowStart: column.rowStart, colStart: column.colStart,
                rowEnd: column.rowEnd, colEnd: column.colEnd, columnVisibleIndex: column.visibleIndex
            } : null
        };
        return node;
    }
    handleMCHeaderNav(key, ctrl) {
        const newHeaderNode = {
            visibleIndex: this.activeNode.mchCache.visibleIndex,
            level: this.activeNode.mchCache.level
        };
        const activeCol = this.currentActiveColumn;
        const lastGroupIndex = Math.max(...this.grid.visibleColumns.
            filter(c => c.level <= this.activeNode.level).map(col => col.visibleIndex));
        let nextCol = activeCol;
        if ((key.includes('left') || key === 'home') && this.activeNode.column > 0) {
            const index = ctrl || key === 'home' ? 0 : this.activeNode.column - 1;
            nextCol = this.getNextColumnMCH(index);
            newHeaderNode.visibleIndex = nextCol.visibleIndex;
        }
        if ((key.includes('right') || key === 'end') && activeCol.visibleIndex < lastGroupIndex) {
            const nextVIndex = activeCol.children ? Math.max(...activeCol.allChildren.map(c => c.visibleIndex)) + 1 :
                activeCol.visibleIndex + 1;
            nextCol = ctrl || key === 'end' ? this.getNextColumnMCH(this.lastColumnIndex) : this.getNextColumnMCH(nextVIndex);
            newHeaderNode.visibleIndex = nextCol.visibleIndex;
        }
        if (!ctrl && key.includes('up') && this.activeNode.level > 0) {
            nextCol = activeCol.parent;
            newHeaderNode.level = nextCol.level;
        }
        if (!ctrl && key.includes('down') && activeCol.children) {
            nextCol = activeCol.children.find(c => c.visibleIndex === newHeaderNode.visibleIndex) ||
                activeCol.children.toArray().sort((a, b) => b.visibleIndex - a.visibleIndex)
                    .filter(col => col.visibleIndex < newHeaderNode.visibleIndex)[0];
            newHeaderNode.level = nextCol.level;
        }
        this.setActiveNode({
            row: this.activeNode.row,
            column: nextCol.visibleIndex,
            level: nextCol.level,
            mchCache: newHeaderNode
        });
        this.performHorizontalScrollToCell(nextCol.visibleIndex);
    }
    handleMCHExpandCollapse(key, column) {
        if (!column.children || !column.collapsible) {
            return;
        }
        if (!column.expanded && ROW_EXPAND_KEYS.has(key)) {
            column.expanded = true;
        }
        else if (column.expanded && ROW_COLLAPSE_KEYS.has(key)) {
            column.expanded = false;
        }
    }
    handleColumnSelection(column, event) {
        if (!column.selectable || this.grid.columnSelection === GridSelectionMode.none) {
            return;
        }
        const clearSelection = this.grid.columnSelection === GridSelectionMode.single;
        const columnsToSelect = !column.children ? [column.field] :
            column.allChildren.filter(c => !c.hidden && c.selectable && !c.columnGroup).map(c => c.field);
        if (column.selected) {
            this.grid.selectionService.deselectColumns(columnsToSelect, event);
        }
        else {
            this.grid.selectionService.selectColumns(columnsToSelect, clearSelection, false, event);
        }
    }
    getNextColumnMCH(visibleIndex) {
        let col = this.grid.getColumnByVisibleIndex(visibleIndex);
        let parent = col.parent;
        while (parent && col.level > this.activeNode.mchCache.level) {
            col = col.parent;
            parent = col.parent;
        }
        return col;
    }
    get currentActiveColumn() {
        return this.grid.visibleColumns.find(c => c.visibleIndex === this.activeNode.column && c.level === this.activeNode.level);
    }
    isActiveNode(rIndex, cIndex) {
        return this.activeNode ? this.activeNode.row === rIndex && this.activeNode.column === cIndex : false;
    }
    isToggleKey(key) {
        return ROW_COLLAPSE_KEYS.has(key) || ROW_EXPAND_KEYS.has(key);
    }
    isAddKey(key) {
        return ROW_ADD_KEYS.has(key);
    }
}
IgxGridNavigationService.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridNavigationService, deps: [{ token: i1.PlatformUtil }], target: i0.????FactoryTarget.Injectable });
IgxGridNavigationService.??prov = i0.????ngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridNavigationService });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridNavigationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.PlatformUtil }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHdkMsT0FBTyxFQUNILGVBQWUsRUFDZixpQkFBaUIsRUFDakIsZUFBZSxFQUNmLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsV0FBVyxFQUNYLFlBQVksRUFFZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXlCLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXRGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDOzs7QUFjdkUsY0FBYztBQUVkLE1BQU0sT0FBTyx3QkFBd0I7SUFjakMsWUFBc0IsUUFBc0I7UUFBdEIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQVpyQyxnQkFBVyxHQUFnQixFQUFpQixDQUFDO1FBQzdDLG1CQUFjLEdBQWdCLEVBQWlCLENBQUM7UUFDN0Msc0JBQWlCLEdBQUcsS0FBSyxDQUFDO0lBVVksQ0FBQztJQVJqRCxJQUFXLFVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFXLFVBQVUsQ0FBQyxLQUFrQjtRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBSU0sZ0JBQWdCLENBQUMsS0FBb0I7UUFDeEMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQyxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFD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RyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN6RyxDQUFDO0lBRU8sV0FBVyxDQUFDLEdBQVc7UUFDM0IsT0FBTyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU8sUUFBUSxDQUFDLEdBQVc7UUFDeEIsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7O3FIQWp3QlEsd0JBQXdCO3lIQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSWd4Rm9yT2ZEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2Zvci1vZi9mb3Jfb2YuZGlyZWN0aXZlJztcbmltcG9ydCB7IEdyaWRUeXBlIH0gZnJvbSAnLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtcbiAgICBOQVZJR0FUSU9OX0tFWVMsXG4gICAgUk9XX0NPTExBUFNFX0tFWVMsXG4gICAgUk9XX0VYUEFORF9LRVlTLFxuICAgIFNVUFBPUlRFRF9LRVlTLFxuICAgIEhPUklaT05UQUxfTkFWX0tFWVMsXG4gICAgSEVBREVSX0tFWVMsXG4gICAgUk9XX0FERF9LRVlTLFxuICAgIFBsYXRmb3JtVXRpbFxufSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IEdyaWRLZXlkb3duVGFyZ2V0VHlwZSwgR3JpZFNlbGVjdGlvbk1vZGUsIEZpbHRlck1vZGUgfSBmcm9tICcuL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBJQWN0aXZlTm9kZUNoYW5nZUV2ZW50QXJncyB9IGZyb20gJy4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyBJZ3hHcmlkR3JvdXBCeVJvd0NvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC9ncm91cGJ5LXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSU11bHRpUm93TGF5b3V0Tm9kZSB9IGZyb20gJy4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IFNvcnRpbmdEaXJlY3Rpb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5leHBvcnQgaW50ZXJmYWNlIENvbHVtbkdyb3Vwc0NhY2hlIHtcbiAgICBsZXZlbDogbnVtYmVyO1xuICAgIHZpc2libGVJbmRleDogbnVtYmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQWN0aXZlTm9kZSB7XG4gICAgZ3JpZElEPzogc3RyaW5nO1xuICAgIHJvdzogbnVtYmVyO1xuICAgIGNvbHVtbj86IG51bWJlcjtcbiAgICBsZXZlbD86IG51bWJlcjtcbiAgICBtY2hDYWNoZT86IENvbHVtbkdyb3Vwc0NhY2hlO1xuICAgIGxheW91dD86IElNdWx0aVJvd0xheW91dE5vZGU7XG59XG5cbi8qKiBAaGlkZGVuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSWd4R3JpZE5hdmlnYXRpb25TZXJ2aWNlIHtcbiAgICBwdWJsaWMgZ3JpZDogR3JpZFR5cGU7XG4gICAgcHVibGljIF9hY3RpdmVOb2RlOiBJQWN0aXZlTm9kZSA9IHt9IGFzIElBY3RpdmVOb2RlO1xuICAgIHB1YmxpYyBsYXN0QWN0aXZlTm9kZTogSUFjdGl2ZU5vZGUgPSB7fSBhcyBJQWN0aXZlTm9kZTtcbiAgICBwcm90ZWN0ZWQgcGVuZGluZ05hdmlnYXRpb24gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBnZXQgYWN0aXZlTm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZU5vZGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBhY3RpdmVOb2RlKHZhbHVlOiBJQWN0aXZlTm9kZSkge1xuICAgICAgICB0aGlzLl9hY3RpdmVOb2RlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwpIHsgfVxuXG4gICAgcHVibGljIGhhbmRsZU5hdmlnYXRpb24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChOQVZJR0FUSU9OX0tFWVMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbCAmJiBOQVZJR0FUSU9OX0tFWVMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQucmVwZWF0ICYmIFNVUFBPUlRFRF9LRVlTLmhhcyhrZXkpIHx8IChrZXkgPT09ICd0YWInICYmIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5jZWxsKSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQucmVwZWF0KSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCksIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBkaXNwYXRjaEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlTm9kZSB8fCAhKFNVUFBPUlRFRF9LRVlTLmhhcyhrZXkpIHx8IChrZXkgPT09ICd0YWInICYmIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5jZWxsKSkgJiZcbiAgICAgICAgICAgICF0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93RWRpdGluZ0Jsb2NrZWQgJiYgIXRoaXMuZ3JpZC5jcnVkU2VydmljZS5yb3dJbkVkaXRNb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2hpZnQgPSBldmVudC5zaGlmdEtleTtcbiAgICAgICAgY29uc3QgY3RybCA9IGV2ZW50LmN0cmxLZXk7XG4gICAgICAgIGlmIChOQVZJR0FUSU9OX0tFWVMuaGFzKGtleSkgJiYgdGhpcy5wZW5kaW5nTmF2aWdhdGlvbikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmlzRGF0YVJvdyh0aGlzLmFjdGl2ZU5vZGUucm93KSA/ICdkYXRhQ2VsbCcgOlxuICAgICAgICAgICAgdGhpcy5pc0RhdGFSb3codGhpcy5hY3RpdmVOb2RlLnJvdywgdHJ1ZSkgPyAnc3VtbWFyeUNlbGwnIDogJ2dyb3VwUm93JztcbiAgICAgICAgaWYgKHRoaXMuZW1pdEtleURvd24odHlwZSwgdGhpcy5hY3RpdmVOb2RlLnJvdywgZXZlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmFsdEtleSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVBbHQoa2V5LCBldmVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFsnICcsICdzcGFjZWJhcicsICdzcGFjZSddLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmtleWJvYXJkU3RhdGVPbktleWRvd24odGhpcy5hY3RpdmVOb2RlLCBzaGlmdCwgc2hpZnQgJiYga2V5ID09PSAndGFiJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldE5leHRQb3NpdGlvbih0aGlzLmFjdGl2ZU5vZGUucm93LCB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uLCBrZXksIHNoaWZ0LCBjdHJsLCBldmVudCk7XG4gICAgICAgIGlmIChOQVZJR0FUSU9OX0tFWVMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRlSW5Cb2R5KHBvc2l0aW9uLnJvd0luZGV4LCBwb3NpdGlvbi5jb2xJbmRleCwgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgIG9iai50YXJnZXQuYWN0aXZhdGUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN1bW1hcnlOYXYoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5oYXNTdW1tYXJpemVkQ29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsTmF2KGV2ZW50LCBldmVudC5rZXkudG9Mb3dlckNhc2UoKSwgdGhpcy5ncmlkLmRhdGFWaWV3Lmxlbmd0aCwgJ3N1bW1hcnlDZWxsJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGVhZGVyTmF2aWdhdGlvbihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBjb25zdCBrZXkgPSBldmVudC5rZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCFIRUFERVJfS0VZUy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgY3RybCA9IGV2ZW50LmN0cmxLZXk7XG4gICAgICAgIGNvbnN0IHNoaWZ0ID0gZXZlbnQuc2hpZnRLZXk7XG4gICAgICAgIGNvbnN0IGFsdCA9IGV2ZW50LmFsdEtleTtcblxuICAgICAgICB0aGlzLnBlcmZvcm1IZWFkZXJLZXlDb21iaW5hdGlvbih0aGlzLmN1cnJlbnRBY3RpdmVDb2x1bW4sIGtleSwgc2hpZnQsIGN0cmwsIGFsdCwgZXZlbnQpO1xuICAgICAgICBpZiAoc2hpZnQgfHwgYWx0IHx8IChjdHJsICYmIChrZXkuaW5jbHVkZXMoJ2Rvd24nKSB8fCBrZXkuaW5jbHVkZXMoJ2Rvd24nKSkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5oYXNDb2x1bW5Hcm91cHMpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTUNIZWFkZXJOYXYoa2V5LCBjdHJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbE5hdihldmVudCwga2V5LCAtMSwgJ2hlYWRlckNlbGwnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBmb2N1c1Rib2R5KGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGdyaWRSb3dzID0gdGhpcy5ncmlkLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLnRvdGFsSXRlbUNvdW50ID8/IHRoaXMuZ3JpZC5kYXRhVmlldy5sZW5ndGg7XG4gICAgICAgIGlmIChncmlkUm93cyA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlTm9kZSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZU5vZGUgfHwgIU9iamVjdC5rZXlzKHRoaXMuYWN0aXZlTm9kZSkubGVuZ3RoIHx8IHRoaXMuYWN0aXZlTm9kZS5yb3cgPCAwIHx8IHRoaXMuYWN0aXZlTm9kZS5yb3cgPiBncmlkUm93cyAtIDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0xhc3RBY3RpdmVOb2RlID0gT2JqZWN0LmtleXModGhpcy5sYXN0QWN0aXZlTm9kZSkubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3Qgc2hvdWxkQ2xlYXJTZWxlY3Rpb24gPSBoYXNMYXN0QWN0aXZlTm9kZSAmJiAodGhpcy5sYXN0QWN0aXZlTm9kZS5yb3cgPCAwIHx8IHRoaXMubGFzdEFjdGl2ZU5vZGUucm93ID4gZ3JpZFJvd3MgLSAxKTtcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlTm9kZSh0aGlzLmxhc3RBY3RpdmVOb2RlLnJvdyA+PSAwICYmIHRoaXMubGFzdEFjdGl2ZU5vZGUucm93IDwgZ3JpZFJvd3MgP1xuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RWaXNpYmxlTm9kZSh0aGlzLmxhc3RBY3RpdmVOb2RlLnJvdykgOiB0aGlzLmZpcnN0VmlzaWJsZU5vZGUoKSk7XG4gICAgICAgICAgICBpZiAoc2hvdWxkQ2xlYXJTZWxlY3Rpb24gfHwgKHRoaXMuZ3JpZC5jZWxsU2VsZWN0aW9uICE9PSBHcmlkU2VsZWN0aW9uTW9kZS5tdWx0aXBsZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuY2xlYXJDZWxsU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLm5hdmlnYXRlVG8odGhpcy5hY3RpdmVOb2RlLnJvdywgdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiwgKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvYmoudGFyZ2V0Py5hY3RpdmF0ZShldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93U3RhcnQ6IHRoaXMuYWN0aXZlTm9kZS5yb3csIHJvd0VuZDogdGhpcy5hY3RpdmVOb2RlLnJvdyxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uU3RhcnQ6IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4sIGNvbHVtbkVuZDogdGhpcy5hY3RpdmVOb2RlLmNvbHVtblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdFJhbmdlKHJhbmdlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQubm90aWZ5Q2hhbmdlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGZvY3VzRmlyc3RDZWxsKGhlYWRlciA9IHRydWUpIHtcbiAgICAgICAgaWYgKChoZWFkZXIgfHwgdGhpcy5ncmlkLmRhdGFWaWV3Lmxlbmd0aCkgJiYgdGhpcy5hY3RpdmVOb2RlICYmXG4gICAgICAgICAgICAodGhpcy5hY3RpdmVOb2RlLnJvdyA9PT0gLTEgfHwgdGhpcy5hY3RpdmVOb2RlLnJvdyA9PT0gdGhpcy5ncmlkLmRhdGFWaWV3Lmxlbmd0aCB8fFxuICAgICAgICAgICAgICAgICghaGVhZGVyICYmICF0aGlzLmdyaWQuaGFzU3VtbWFyaXplZENvbHVtbnMpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNob3VsZFNjcm9sbEludG9WaWV3ID0gdGhpcy5sYXN0QWN0aXZlTm9kZSAmJiAoaGVhZGVyICYmIHRoaXMubGFzdEFjdGl2ZU5vZGUucm93ICE9PSAtMSkgfHxcbiAgICAgICAgICAgICghaGVhZGVyICYmIHRoaXMubGFzdEFjdGl2ZU5vZGUucm93ICE9PSB0aGlzLmdyaWQuZGF0YVZpZXcubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVOb2RlKHRoaXMuZmlyc3RWaXNpYmxlTm9kZShoZWFkZXIgPyAtMSA6IHRoaXMuZ3JpZC5kYXRhVmlldy5sZW5ndGgpKTtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbEludG9WaWV3KSB7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1Ib3Jpem9udGFsU2Nyb2xsVG9DZWxsKHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGlzQ29sdW1uRnVsbHlWaXNpYmxlKGNvbHVtbkluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGNvbHVtbkluZGV4IDwgMCB8fCB0aGlzLmlzQ29sdW1uUGlubmVkKGNvbHVtbkluZGV4LCB0aGlzLmZvck9mRGlyKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0Q29sdW1uVW5waW5uZWRJbmRleChjb2x1bW5JbmRleCk7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5mb3JPZkRpcigpLmdldENvbHVtblNjcm9sbExlZnQoaW5kZXggKyAxKSAtIHRoaXMuZm9yT2ZEaXIoKS5nZXRDb2x1bW5TY3JvbGxMZWZ0KGluZGV4KTtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheUNvbnRhaW5lcldpZHRoIDwgd2lkdGggJiYgdGhpcy5kaXNwbGF5Q29udGFpbmVyU2Nyb2xsTGVmdCA9PT0gdGhpcy5mb3JPZkRpcigpLmdldENvbHVtblNjcm9sbExlZnQoaW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kaXNwbGF5Q29udGFpbmVyV2lkdGggPj0gdGhpcy5mb3JPZkRpcigpLmdldENvbHVtblNjcm9sbExlZnQoaW5kZXggKyAxKSAtIHRoaXMuZGlzcGxheUNvbnRhaW5lclNjcm9sbExlZnQgJiZcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUNvbnRhaW5lclNjcm9sbExlZnQgPD0gdGhpcy5mb3JPZkRpcigpLmdldENvbHVtblNjcm9sbExlZnQoaW5kZXgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG91bGRQZXJmb3JtSG9yaXpvbnRhbFNjcm9sbCh2aXNpYmxlQ29sSW5kZXg6IG51bWJlciwgcm93SW5kZXggPSAtMSkge1xuICAgICAgICBpZiAodmlzaWJsZUNvbEluZGV4IDwgMCB8fCB2aXNpYmxlQ29sSW5kZXggPiB0aGlzLmdyaWQudmlzaWJsZUNvbHVtbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiB0aGlzLmdyaWQuZGF0YVZpZXcubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLmlzQ29sdW1uRnVsbHlWaXNpYmxlKHZpc2libGVDb2xJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkLmRhdGFWaWV3W3Jvd0luZGV4XTtcbiAgICAgICAgcmV0dXJuIHJvdy5leHByZXNzaW9uIHx8IHJvdy5kZXRhaWxzRGF0YSA/IGZhbHNlIDogIXRoaXMuaXNDb2x1bW5GdWxseVZpc2libGUodmlzaWJsZUNvbEluZGV4KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvdWxkUGVyZm9ybVZlcnRpY2FsU2Nyb2xsKHRhcmdldFJvd0luZGV4OiBudW1iZXIsIHZpc2libGVDb2xJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmdyaWQuaXNSZWNvcmRQaW5uZWRCeVZpZXdJbmRleCh0YXJnZXRSb3dJbmRleCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzY3JvbGxSb3dJbmRleCA9IHRoaXMuZ3JpZC5oYXNQaW5uZWRSZWNvcmRzICYmIHRoaXMuZ3JpZC5pc1Jvd1Bpbm5pbmdUb1RvcCA/XG4gICAgICAgICAgICB0YXJnZXRSb3dJbmRleCAtIHRoaXMuZ3JpZC5waW5uZWREYXRhVmlldy5sZW5ndGggOiB0YXJnZXRSb3dJbmRleDtcbiAgICAgICAgY29uc3QgdGFyZ2V0Um93ID0gdGhpcy5nZXRSb3dFbGVtZW50QnlJbmRleCh0YXJnZXRSb3dJbmRleCk7XG4gICAgICAgIGNvbnN0IHJvd0hlaWdodCA9IHRoaXMuZ3JpZC52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5nZXRTaXplQXQoc2Nyb2xsUm93SW5kZXgpO1xuICAgICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSB0aGlzLmdyaWQuY2FsY0hlaWdodCA/IE1hdGguY2VpbCh0aGlzLmdyaWQuY2FsY0hlaWdodCkgOiAwO1xuICAgICAgICBjb25zdCBlbmRUb3BPZmZzZXQgPSB0YXJnZXRSb3cgPyB0YXJnZXRSb3cub2Zmc2V0VG9wICsgcm93SGVpZ2h0ICsgdGhpcy5jb250YWluZXJUb3BPZmZzZXQgOiBjb250YWluZXJIZWlnaHQgKyByb3dIZWlnaHQ7XG4gICAgICAgIC8vIHRoaXMgaXMgd29ya2Fyb3VuZDogZW5kVG9wT2Zmc2V0IC0gY29udGFpbmVySGVpZ2h0ID4gNSBhbmQgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGg6IGNvbnRhaW5lckhlaWdodCA8IGVuZFRvcE9mZnNldFxuICAgICAgICAvLyB3aGVuIHRoZSBwYWdlIGlzIHpvb21lZCB0aGUgZ3JpZCBkb2VzIG5vdCBzY3JvbGwgdGhlIHJvdyBjb21wbGV0ZWx5IGluIHRoZSB2aWV3XG4gICAgICAgIHJldHVybiAhdGFyZ2V0Um93IHx8IHRhcmdldFJvdy5vZmZzZXRUb3AgPCBNYXRoLmFicyh0aGlzLmNvbnRhaW5lclRvcE9mZnNldClcbiAgICAgICAgICAgIHx8IGNvbnRhaW5lckhlaWdodCAmJiBlbmRUb3BPZmZzZXQgLSBjb250YWluZXJIZWlnaHQgPiA1O1xuICAgIH1cblxuICAgIHB1YmxpYyBwZXJmb3JtVmVydGljYWxTY3JvbGxUb0NlbGwocm93SW5kZXg6IG51bWJlciwgdmlzaWJsZUNvbEluZGV4ID0gLTEsIGNiPzogKCkgPT4gdm9pZCkge1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkUGVyZm9ybVZlcnRpY2FsU2Nyb2xsKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZW5kaW5nTmF2aWdhdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIE9ubHkgZm9yIHRvcCBwaW5uaW5nIHdlIG5lZWQgdG8gc3VidHJhY3QgcGlubmVkIGNvdW50IGJlY2F1c2UgdmlydHVhbGl6YXRpb24gaW5kZXhpbmcgZG9lc24ndCBjb3VudCBwaW5uZWQgcm93cy5cbiAgICAgICAgY29uc3Qgc2Nyb2xsUm93SW5kZXggPSB0aGlzLmdyaWQuaGFzUGlubmVkUmVjb3JkcyAmJiB0aGlzLmdyaWQuaXNSb3dQaW5uaW5nVG9Ub3AgP1xuICAgICAgICAgICAgcm93SW5kZXggLSB0aGlzLmdyaWQucGlubmVkRGF0YVZpZXcubGVuZ3RoIDogcm93SW5kZXg7XG4gICAgICAgIHRoaXMuZ3JpZC52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5zY3JvbGxUbyhzY3JvbGxSb3dJbmRleCk7XG4gICAgICAgIHRoaXMuZ3JpZC52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5jaHVua0xvYWRcbiAgICAgICAgICAgIC5waXBlKGZpcnN0KCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nTmF2aWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwZXJmb3JtSG9yaXpvbnRhbFNjcm9sbFRvQ2VsbCh2aXNpYmxlQ29sdW1uSW5kZXg6IG51bWJlciwgY2I/OiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICh0aGlzLmdyaWQucm93TGlzdCA8IDEgJiYgdGhpcy5ncmlkLnN1bW1hcmllc1Jvd0xpc3QubGVuZ3RoIDwgMSAmJiB0aGlzLmdyaWQuaGFzQ29sdW1uR3JvdXBzKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uID0gdGhpcy5ncmlkLmdldENvbHVtbkJ5VmlzaWJsZUluZGV4KHZpc2libGVDb2x1bW5JbmRleCk7XG4gICAgICAgICAgICB3aGlsZSAoY29sdW1uLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbiA9IGNvbHVtbi5wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpYmxlQ29sdW1uSW5kZXggPSB0aGlzLmZvck9mRGlyKCkuaWd4Rm9yT2YuaW5kZXhPZihjb2x1bW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5zaG91bGRQZXJmb3JtSG9yaXpvbnRhbFNjcm9sbCh2aXNpYmxlQ29sdW1uSW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZW5kaW5nTmF2aWdhdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMuZ3JpZC5wYXJlbnRWaXJ0RGlyLmNodW5rTG9hZFxuICAgICAgICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ05hdmlnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mb3JPZkRpcigpLnNjcm9sbFRvKHRoaXMuZ2V0Q29sdW1uVW5waW5uZWRJbmRleCh2aXNpYmxlQ29sdW1uSW5kZXgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNEYXRhUm93KHJvd0luZGV4OiBudW1iZXIsIGluY2x1ZGVTdW1tYXJ5ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IGN1clJvdzogYW55O1xuXG4gICAgICAgIGlmIChyb3dJbmRleCA8IDAgfHwgcm93SW5kZXggPiB0aGlzLmdyaWQuZGF0YVZpZXcubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY3VyUm93ID0gdGhpcy5ncmlkLmRhdGFWaWV3W3Jvd0luZGV4IC0gdGhpcy5ncmlkLnZpcnR1YWxpemF0aW9uU3RhdGUuc3RhcnRJbmRleF07XG4gICAgICAgICAgICBpZiAoIWN1clJvdykge1xuICAgICAgICAgICAgICAgIC8vIGlmIGRhdGEgaXMgcmVtb3RlLCByZWNvcmQgbWlnaHQgbm90IGJlIGluIHRoZSB2aWV3IHlldC5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnZlcnRpY2FsU2Nyb2xsQ29udGFpbmVyLmlzUmVtb3RlICYmIHJvd0luZGV4ID49IDAgJiYgcm93SW5kZXggPD0gKHRoaXMuZ3JpZCBhcyBhbnkpLnRvdGFsSXRlbUNvdW50IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1clJvdyA9IHRoaXMuZ3JpZC5kYXRhVmlld1tyb3dJbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1clJvdyAmJiAhdGhpcy5ncmlkLmlzR3JvdXBCeVJlY29yZChjdXJSb3cpICYmICF0aGlzLmdyaWQuaXNEZXRhaWxSZWNvcmQoY3VyUm93KVxuICAgICAgICAgICAgJiYgIWN1clJvdy5jaGlsZEdyaWRzRGF0YSAmJiAoaW5jbHVkZVN1bW1hcnkgfHwgIWN1clJvdy5zdW1tYXJpZXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0dyb3VwUm93KHJvd0luZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHJvd0luZGV4IDwgMCB8fCByb3dJbmRleCA+IHRoaXMuZ3JpZC5kYXRhVmlldy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VyUm93ID0gdGhpcy5ncmlkLmRhdGFWaWV3W3Jvd0luZGV4XTtcbiAgICAgICAgcmV0dXJuIGN1clJvdyAmJiB0aGlzLmdyaWQuaXNHcm91cEJ5UmVjb3JkKGN1clJvdyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldEFjdGl2ZU5vZGUoYWN0aXZlTm9kZTogSUFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlTm9kZUNoYW5nZWQoYWN0aXZlTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZU5vZGUgPSBhY3RpdmVOb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmFjdGl2ZU5vZGUsIGFjdGl2ZU5vZGUpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJSb3cgPSB0aGlzLmdyaWQuZGF0YVZpZXdbYWN0aXZlTm9kZS5yb3ddO1xuICAgICAgICBjb25zdCB0eXBlOiBHcmlkS2V5ZG93blRhcmdldFR5cGUgPSBhY3RpdmVOb2RlLnJvdyA8IDAgPyAnaGVhZGVyQ2VsbCcgOlxuICAgICAgICAgICAgdGhpcy5pc0RhdGFSb3coYWN0aXZlTm9kZS5yb3cpID8gJ2RhdGFDZWxsJyA6XG4gICAgICAgICAgICAgICAgY3VyclJvdyAmJiB0aGlzLmdyaWQuaXNHcm91cEJ5UmVjb3JkKGN1cnJSb3cpID8gJ2dyb3VwUm93JyA6XG4gICAgICAgICAgICAgICAgICAgIGN1cnJSb3cgJiYgdGhpcy5ncmlkLmlzRGV0YWlsUmVjb3JkKGN1cnJSb3cpID8gJ21hc3RlckRldGFpbFJvdycgOiAnc3VtbWFyeUNlbGwnO1xuXG4gICAgICAgIGNvbnN0IGFyZ3M6IElBY3RpdmVOb2RlQ2hhbmdlRXZlbnRBcmdzID0ge1xuICAgICAgICAgICAgcm93OiB0aGlzLmFjdGl2ZU5vZGUucm93LFxuICAgICAgICAgICAgY29sdW1uOiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uLFxuICAgICAgICAgICAgbGV2ZWw6IHRoaXMuYWN0aXZlTm9kZS5sZXZlbCxcbiAgICAgICAgICAgIHRhZzogdHlwZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ3JpZC5hY3RpdmVOb2RlQ2hhbmdlLmVtaXQoYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzQWN0aXZlTm9kZUNoYW5nZWQoYWN0aXZlTm9kZTogSUFjdGl2ZU5vZGUpIHtcbiAgICAgICAgbGV0IGlzQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBjaGVja0lubmVyUHJvcCA9IChhY2l2ZU5vZGU6IENvbHVtbkdyb3Vwc0NhY2hlIHwgSU11bHRpUm93TGF5b3V0Tm9kZSwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFhY2l2ZU5vZGUpIHtcbiAgICAgICAgICAgICAgICBpc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhY2l2ZU5vZGUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wTmFtZSBvZiBwcm9wcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZU5vZGVbcHJvcF1bcHJvcE5hbWVdICE9PSBhY2l2ZU5vZGVbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghdGhpcy5hY3RpdmVOb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGFjdGl2ZU5vZGUpO1xuICAgICAgICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIHByb3BzKSB7XG4gICAgICAgICAgICBpZiAoISF0aGlzLmFjdGl2ZU5vZGVbcHJvcE5hbWVdICYmIHR5cGVvZiB0aGlzLmFjdGl2ZU5vZGVbcHJvcE5hbWVdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNoZWNrSW5uZXJQcm9wKGFjdGl2ZU5vZGVbcHJvcE5hbWVdLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZlTm9kZVtwcm9wTmFtZV0gIT09IGFjdGl2ZU5vZGVbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgaXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc0NoYW5nZWQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5leHRQb3NpdGlvbihyb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyLCBrZXk6IHN0cmluZywgc2hpZnQ6IGJvb2xlYW4sIGN0cmw6IGJvb2xlYW4sIGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0RhdGFSb3cocm93SW5kZXgsIHRydWUpICYmIChrZXkuaW5kZXhPZignZG93bicpIDwgMCB8fCBrZXkuaW5kZXhPZigndXAnKSA8IDApICYmIGN0cmwpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHJvd0luZGV4LCBjb2xJbmRleCB9O1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdwYWdlZG93bic6XG4gICAgICAgICAgICBjYXNlICdwYWdldXAnOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3BhZ2Vkb3duJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQudmVydGljYWxTY3JvbGxDb250YWluZXIuc2Nyb2xsTmV4dFBhZ2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQudmVydGljYWxTY3JvbGxDb250YWluZXIuc2Nyb2xsUHJldlBhZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZWRpdENlbGwgPSB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuY2VsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQudmVydGljYWxTY3JvbGxDb250YWluZXIuY2h1bmtMb2FkXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKGZpcnN0KCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdENlbGwgJiYgdGhpcy5ncmlkLnJvd0xpc3QubWFwKHIgPT4gci5pbmRleCkuaW5kZXhPZihlZGl0Q2VsbC5yb3dJbmRleCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLnRib2R5Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RhYic6XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFZGl0aW5nKHNoaWZ0LCBldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgIHJvd0luZGV4ID0gY3RybCA/IHRoaXMuZmluZExhc3REYXRhUm93SW5kZXgoKSA6IHRoaXMuYWN0aXZlTm9kZS5yb3c7XG4gICAgICAgICAgICAgICAgY29sSW5kZXggPSB0aGlzLmxhc3RDb2x1bW5JbmRleDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2hvbWUnOlxuICAgICAgICAgICAgICAgIHJvd0luZGV4ID0gY3RybCA/IHRoaXMuZmluZEZpcnN0RGF0YVJvd0luZGV4KCkgOiB0aGlzLmFjdGl2ZU5vZGUucm93O1xuICAgICAgICAgICAgICAgIGNvbEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Fycm93bGVmdCc6XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICBjb2xJbmRleCA9IGN0cmwgPyAwIDogdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcnJvd3JpZ2h0JzpcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjb2xJbmRleCA9IGN0cmwgPyB0aGlzLmxhc3RDb2x1bW5JbmRleCA6IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4gKyAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJyb3d1cCc6XG4gICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgaWYgKGN0cmwgJiYgIXRoaXMuaXNEYXRhUm93KHJvd0luZGV4KSB8fCAodGhpcy5ncmlkLnJvd0VkaXRhYmxlICYmIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5yb3dFZGl0aW5nQmxvY2tlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbEluZGV4ID0gdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiAhPT0gdW5kZWZpbmVkID8gdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiA6IDA7XG4gICAgICAgICAgICAgICAgcm93SW5kZXggPSBjdHJsID8gdGhpcy5maW5kRmlyc3REYXRhUm93SW5kZXgoKSA6IHRoaXMuYWN0aXZlTm9kZS5yb3cgLSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJyb3dkb3duJzpcbiAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgIGlmICgoY3RybCAmJiAhdGhpcy5pc0RhdGFSb3cocm93SW5kZXgpKSB8fCAodGhpcy5ncmlkLnJvd0VkaXRhYmxlICYmIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5yb3dFZGl0aW5nQmxvY2tlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbEluZGV4ID0gdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiAhPT0gdW5kZWZpbmVkID8gdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiA6IDA7XG4gICAgICAgICAgICAgICAgcm93SW5kZXggPSBjdHJsID8gdGhpcy5maW5kTGFzdERhdGFSb3dJbmRleCgpIDogdGhpcy5hY3RpdmVOb2RlLnJvdyArIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbnRlcic6XG4gICAgICAgICAgICBjYXNlICdmMic6XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IHRoaXMuZ3JpZC5ncmlkQVBJLmdldF9jZWxsX2J5X3Zpc2libGVfaW5kZXgodGhpcy5hY3RpdmVOb2RlLnJvdywgdGhpcy5hY3RpdmVOb2RlLmNvbHVtbik7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzRGF0YVJvdyhyb3dJbmRleCkgfHwgIWNlbGwuZWRpdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5jcnVkU2VydmljZS5lbnRlckVkaXRNb2RlKGNlbGwsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2VzY2FwZSc6XG4gICAgICAgICAgICBjYXNlICdlc2MnOlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0RhdGFSb3cocm93SW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuaXNJbkNvbXBvc2l0aW9uTW9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5jcnVkU2VydmljZS5jZWxsSW5FZGl0TW9kZSB8fCB0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93SW5FZGl0TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuY3J1ZFNlcnZpY2UuZW5kRWRpdChmYWxzZSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF0Zm9ybS5pc0VkZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC50Ym9keS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgICBjYXNlICdzcGFjZWJhcic6XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93T2JqID0gdGhpcy5ncmlkLmdyaWRBUEkuZ2V0X3Jvd19ieV9pbmRleCh0aGlzLmFjdGl2ZU5vZGUucm93KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmlkLmlzUm93U2VsZWN0YWJsZSAmJiByb3dPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNEYXRhUm93KHJvd0luZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd09iai5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmRlc2VsZWN0Um93KHJvd09iai5rZXksIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0Um93QnlJZChyb3dPYmoua2V5LCBmYWxzZSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzR3JvdXBSb3cocm93SW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoKHJvd09iaiBhcyBhbnkpIGFzIElneEdyaWRHcm91cEJ5Um93Q29tcG9uZW50KS5vbkdyb3VwU2VsZWN0b3JDbGljayhldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyByb3dJbmRleCwgY29sSW5kZXggfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaG9yaXpvbnRhbE5hdihldmVudDogS2V5Ym9hcmRFdmVudCwga2V5OiBzdHJpbmcsIHJvd0luZGV4OiBudW1iZXIsIHRhZzogR3JpZEtleWRvd25UYXJnZXRUeXBlKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSBldmVudC5jdHJsS2V5O1xuICAgICAgICBpZiAoIUhPUklaT05UQUxfTkFWX0tFWVMuaGFzKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuYWN0aXZlTm9kZS5yb3cgPSByb3dJbmRleDtcbiAgICAgICAgaWYgKHJvd0luZGV4ID4gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW1pdEtleURvd24oJ3N1bW1hcnlDZWxsJywgdGhpcy5hY3RpdmVOb2RlLnJvdywgZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3QWN0aXZlTm9kZSA9IHtcbiAgICAgICAgICAgIGNvbHVtbjogdGhpcy5hY3RpdmVOb2RlLmNvbHVtbixcbiAgICAgICAgICAgIG1jaENhY2hlOiB7XG4gICAgICAgICAgICAgICAgbGV2ZWw6IHRoaXMuYWN0aXZlTm9kZS5sZXZlbCxcbiAgICAgICAgICAgICAgICB2aXNpYmxlSW5kZXg6IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoKGtleS5pbmNsdWRlcygnbGVmdCcpIHx8IGtleSA9PT0gJ2hvbWUnKSAmJiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uID4gMCkge1xuICAgICAgICAgICAgbmV3QWN0aXZlTm9kZS5jb2x1bW4gPSBjdHJsIHx8IGtleSA9PT0gJ2hvbWUnID8gMCA6IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4gLSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoa2V5LmluY2x1ZGVzKCdyaWdodCcpIHx8IGtleSA9PT0gJ2VuZCcpICYmIHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4gPCB0aGlzLmxhc3RDb2x1bW5JbmRleCkge1xuICAgICAgICAgICAgbmV3QWN0aXZlTm9kZS5jb2x1bW4gPSBjdHJsIHx8IGtleSA9PT0gJ2VuZCcgPyB0aGlzLmxhc3RDb2x1bW5JbmRleCA6IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4gKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhZyA9PT0gJ2hlYWRlckNlbGwnKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmdyaWQuZ2V0Q29sdW1uQnlWaXNpYmxlSW5kZXgobmV3QWN0aXZlTm9kZS5jb2x1bW4pO1xuICAgICAgICAgICAgbmV3QWN0aXZlTm9kZS5tY2hDYWNoZS5sZXZlbCA9IGNvbHVtbi5sZXZlbDtcbiAgICAgICAgICAgIG5ld0FjdGl2ZU5vZGUubWNoQ2FjaGUudmlzaWJsZUluZGV4ID0gY29sdW1uLnZpc2libGVJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlTm9kZSh7IHJvdzogdGhpcy5hY3RpdmVOb2RlLnJvdywgY29sdW1uOiBuZXdBY3RpdmVOb2RlLmNvbHVtbiwgbWNoQ2FjaGU6IG5ld0FjdGl2ZU5vZGUubWNoQ2FjaGUgfSk7XG4gICAgICAgIHRoaXMucGVyZm9ybUhvcml6b250YWxTY3JvbGxUb0NlbGwodGhpcy5hY3RpdmVOb2RlLmNvbHVtbik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBsYXN0Q29sdW1uSW5kZXgoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCguLi50aGlzLmdyaWQudmlzaWJsZUNvbHVtbnMubWFwKGNvbCA9PiBjb2wudmlzaWJsZUluZGV4KSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZGlzcGxheUNvbnRhaW5lcldpZHRoKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmdyaWQucGFyZW50VmlydERpci5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGgpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGRpc3BsYXlDb250YWluZXJTY3JvbGxMZWZ0KCkge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuZ3JpZC5oZWFkZXJDb250YWluZXIuc2Nyb2xsUG9zaXRpb24pO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGNvbnRhaW5lclRvcE9mZnNldCgpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZ3JpZC52ZXJ0aWNhbFNjcm9sbENvbnRhaW5lci5kYy5pbnN0YW5jZS5fdmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wLCAxMCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldENvbHVtblVucGlubmVkSW5kZXgodmlzaWJsZUNvbHVtbkluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgY29sdW1uID0gdGhpcy5ncmlkLnVucGlubmVkQ29sdW1ucy5maW5kKChjb2wpID0+ICFjb2wuY29sdW1uR3JvdXAgJiYgY29sLnZpc2libGVJbmRleCA9PT0gdmlzaWJsZUNvbHVtbkluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5waW5uZWRDb2x1bW5zLmxlbmd0aCA/IHRoaXMuZ3JpZC51bnBpbm5lZENvbHVtbnMuZmlsdGVyKChjKSA9PiAhYy5jb2x1bW5Hcm91cCkuaW5kZXhPZihjb2x1bW4pIDpcbiAgICAgICAgICAgIHZpc2libGVDb2x1bW5JbmRleDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZm9yT2ZEaXIoKTogSWd4Rm9yT2ZEaXJlY3RpdmU8YW55PiB7XG4gICAgICAgIGNvbnN0IGZvck9mRGlyID0gdGhpcy5ncmlkLmRhdGFSb3dMaXN0Lmxlbmd0aCA+IDAgPyB0aGlzLmdyaWQuZGF0YVJvd0xpc3QuZmlyc3QudmlydERpclJvdyA6IHRoaXMuZ3JpZC5zdW1tYXJpZXNSb3dMaXN0Lmxlbmd0aCA/XG4gICAgICAgICAgICB0aGlzLmdyaWQuc3VtbWFyaWVzUm93TGlzdC5maXJzdC52aXJ0RGlyUm93IDogdGhpcy5ncmlkLmhlYWRlckNvbnRhaW5lcjtcbiAgICAgICAgcmV0dXJuIGZvck9mRGlyIGFzIElneEZvck9mRGlyZWN0aXZlPGFueT47XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhbmRsZUFsdChrZXk6IHN0cmluZywgZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gdG9kbyBUT0RPIFJPV1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdyaWQuZ3JpZEFQSS5nZXRfcm93X2J5X2luZGV4KHRoaXMuYWN0aXZlTm9kZS5yb3cpO1xuXG4gICAgICAgIGlmICghKHRoaXMuaXNUb2dnbGVLZXkoa2V5KSB8fCB0aGlzLmlzQWRkS2V5KGtleSkpIHx8ICFyb3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0FkZEtleShrZXkpKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZ3JpZC5yb3dFZGl0YWJsZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIGdyaWQgbXVzdCBiZSBpbiByb3cgZWRpdCBtb2RlIHRvIHBlcmZvcm0gcm93IGFkZGluZyEnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiByb3cudHJlZVJvdyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLmVudGVyQWRkUm93TW9kZShyb3csIHRydWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLmVudGVyQWRkUm93TW9kZShyb3csIGZhbHNlLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIXJvdy5leHBhbmRlZCAmJiBST1dfRVhQQU5EX0tFWVMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIGlmIChyb3cua2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHVzZSBleHBhbmRlZCByb3cuZXhwYW5kZWQgPSAhcm93LmV4cGFuZGVkO1xuICAgICAgICAgICAgICAgIChyb3cgYXMgYW55KS50b2dnbGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmdyaWRBUEkuc2V0X3Jvd19leHBhbnNpb25fc3RhdGUocm93LmtleSwgdHJ1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJvdy5leHBhbmRlZCAmJiBST1dfQ09MTEFQU0VfS0VZUy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgaWYgKHJvdy5rZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8gdXNlIGV4cGFuZGVkIHJvdy5leHBhbmRlZCA9ICFyb3cuZXhwYW5kZWQ7XG4gICAgICAgICAgICAgICAgKHJvdyBhcyBhbnkpLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuZ3JpZEFQSS5zZXRfcm93X2V4cGFuc2lvbl9zdGF0ZShyb3cua2V5LCBmYWxzZSwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JpZC5ub3RpZnlDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhbmRsZUVkaXRpbmcoc2hpZnQ6IGJvb2xlYW4sIGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBzaGlmdCA/IHRoaXMuZ3JpZC5nZXRQcmV2aW91c0NlbGwodGhpcy5hY3RpdmVOb2RlLnJvdywgdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiwgY29sID0+IGNvbC5lZGl0YWJsZSkgOlxuICAgICAgICAgICAgdGhpcy5ncmlkLmdldE5leHRDZWxsKHRoaXMuYWN0aXZlTm9kZS5yb3csIHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4sIGNvbCA9PiBjb2wuZWRpdGFibGUpO1xuICAgICAgICBpZiAoIXRoaXMuZ3JpZC5jcnVkU2VydmljZS5yb3dJbkVkaXRNb2RlICYmIHRoaXMuaXNBY3RpdmVOb2RlKG5leHQucm93SW5kZXgsIG5leHQudmlzaWJsZUNvbHVtbkluZGV4KSkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLmNydWRTZXJ2aWNlLmVuZEVkaXQodHJ1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ncmlkLnRib2R5Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoKHRoaXMuZ3JpZC5jcnVkU2VydmljZS5yb3dJbkVkaXRNb2RlICYmIHRoaXMuZ3JpZC5yb3dFZGl0VGFicy5sZW5ndGgpICYmXG4gICAgICAgICAgICAodGhpcy5hY3RpdmVOb2RlLnJvdyAhPT0gbmV4dC5yb3dJbmRleCB8fCB0aGlzLmlzQWN0aXZlTm9kZShuZXh0LnJvd0luZGV4LCBuZXh0LnZpc2libGVDb2x1bW5JbmRleCkpKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5ncmlkLmNydWRTZXJ2aWNlLnVwZGF0ZUNlbGwodHJ1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGlmdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5yb3dFZGl0VGFicy5sYXN0LmVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQucm93RWRpdFRhYnMuZmlyc3QuZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmlkLmNydWRTZXJ2aWNlLnJvd0luRWRpdE1vZGUgJiYgIXRoaXMuZ3JpZC5yb3dFZGl0VGFicy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChzaGlmdCAmJiBuZXh0LnJvd0luZGV4ID09PSB0aGlzLmFjdGl2ZU5vZGUucm93ICYmIG5leHQudmlzaWJsZUNvbHVtbkluZGV4ID09PSB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgbmV4dC52aXNpYmxlQ29sdW1uSW5kZXggPSB0aGlzLmdyaWQubGFzdEVkaXRhYmxlQ29sdW1uSW5kZXg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzaGlmdCAmJiBuZXh0LnJvd0luZGV4ID09PSB0aGlzLmFjdGl2ZU5vZGUucm93ICYmIG5leHQudmlzaWJsZUNvbHVtbkluZGV4ID09PSB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgbmV4dC52aXNpYmxlQ29sdW1uSW5kZXggPSB0aGlzLmdyaWQuZmlyc3RFZGl0YWJsZUNvbHVtbkluZGV4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0LnJvd0luZGV4ID0gdGhpcy5hY3RpdmVOb2RlLnJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmF2aWdhdGVJbkJvZHkobmV4dC5yb3dJbmRleCwgbmV4dC52aXNpYmxlQ29sdW1uSW5kZXgsIChvYmopID0+IHtcbiAgICAgICAgICAgIG9iai50YXJnZXQuYWN0aXZhdGUoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ncmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBuYXZpZ2F0ZUluQm9keShyb3dJbmRleCwgdmlzaWJsZUNvbEluZGV4LCBjYjogKGFyZzogYW55KSA9PiB2b2lkID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZFBvc2l0aW9uKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgpIHx8IHRoaXMuaXNBY3RpdmVOb2RlKHJvd0luZGV4LCB2aXNpYmxlQ29sSW5kZXgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmlkLm5hdmlnYXRlVG8ocm93SW5kZXgsIHZpc2libGVDb2xJbmRleCwgY2IpO1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIGVtaXRLZXlEb3duKHR5cGU6IEdyaWRLZXlkb3duVGFyZ2V0VHlwZSwgcm93SW5kZXgsIGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZC5zdW1tYXJpZXNSb3dMaXN0LnRvQXJyYXkoKS5jb25jYXQodGhpcy5ncmlkLnJvd0xpc3QudG9BcnJheSgpKS5maW5kKHIgPT4gci5pbmRleCA9PT0gcm93SW5kZXgpO1xuICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdHlwZSA9PT0gJ2dyb3VwUm93JyA/IHJvdyA6XG4gICAgICAgICAgICB0eXBlID09PSAnZGF0YUNlbGwnID8gcm93LmNlbGxzPy5maW5kKGMgPT4gYy52aXNpYmxlQ29sdW1uSW5kZXggPT09IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4pIDpcbiAgICAgICAgICAgICAgICByb3cuc3VtbWFyeUNlbGxzPy5maW5kKGMgPT4gYy52aXNpYmxlQ29sdW1uSW5kZXggPT09IHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4pO1xuICAgICAgICBjb25zdCBrZXlkb3duQXJncyA9IHsgdGFyZ2V0VHlwZTogdHlwZSwgZXZlbnQsIGNhbmNlbDogZmFsc2UsIHRhcmdldCB9O1xuICAgICAgICB0aGlzLmdyaWQuZ3JpZEtleWRvd24uZW1pdChrZXlkb3duQXJncyk7XG4gICAgICAgIGlmIChrZXlkb3duQXJncy5jYW5jZWwgJiYgdHlwZSA9PT0gJ2RhdGFDZWxsJykge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdGlvblNlcnZpY2UuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmtleWJvYXJkU3RhdGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBrZXlkb3duQXJncy5jYW5jZWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNDb2x1bW5QaW5uZWQoY29sdW1uSW5kZXg6IG51bWJlciwgZm9yT2ZEaXI6IElneEZvck9mRGlyZWN0aXZlPGFueT4pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgaG9yaXpvbnRhbFNjcm9sbCA9IGZvck9mRGlyLmdldFNjcm9sbCgpO1xuICAgICAgICByZXR1cm4gKCFob3Jpem9udGFsU2Nyb2xsLmNsaWVudFdpZHRoIHx8IHRoaXMuZ3JpZC5nZXRDb2x1bW5CeVZpc2libGVJbmRleChjb2x1bW5JbmRleCk/LnBpbm5lZCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZpbmRGaXJzdERhdGFSb3dJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmRhdGFWaWV3LmZpbmRJbmRleChyZWMgPT4gIXRoaXMuZ3JpZC5pc0dyb3VwQnlSZWNvcmQocmVjKSAmJiAhdGhpcy5ncmlkLmlzRGV0YWlsUmVjb3JkKHJlYykgJiYgIXJlYy5zdW1tYXJpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmaW5kTGFzdERhdGFSb3dJbmRleCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoKHRoaXMuZ3JpZCBhcyBhbnkpLnRvdGFsSXRlbUNvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZ3JpZCBhcyBhbnkpLnRvdGFsSXRlbUNvdW50IC0gMTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaSA9IHRoaXMuZ3JpZC5kYXRhVmlldy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGF0YVJvdyhpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFJvd0VsZW1lbnRCeUluZGV4KGluZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLmdyaWQuaGFzRGV0YWlscykge1xuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gdGhpcy5ncmlkLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihgW2RldGFpbD1cInRydWVcIl1bZGF0YS1yb3dpbmRleD1cIiR7aW5kZXh9XCJdYCk7XG4gICAgICAgICAgICBpZiAoZGV0YWlsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRldGFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnJvd0xpc3QudG9BcnJheSgpLmNvbmNhdCh0aGlzLmdyaWQuc3VtbWFyaWVzUm93TGlzdC50b0FycmF5KCkpLmZpbmQociA9PiByLmluZGV4ID09PSBpbmRleCk/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzVmFsaWRQb3NpdGlvbihyb3dJbmRleDogbnVtYmVyLCBjb2xJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9ICh0aGlzLmdyaWQgYXMgYW55KS50b3RhbEl0ZW1Db3VudCA/PyB0aGlzLmdyaWQuZGF0YVZpZXcubGVuZ3RoO1xuICAgICAgICBpZiAocm93SW5kZXggPCAwIHx8IGNvbEluZGV4IDwgMCB8fCBsZW5ndGggLSAxIDwgcm93SW5kZXggfHwgdGhpcy5sYXN0Q29sdW1uSW5kZXggPCBjb2xJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uICE9PSBjb2xJbmRleCAmJiAhdGhpcy5pc0RhdGFSb3cocm93SW5kZXgsIHRydWUpID8gZmFsc2UgOiB0cnVlO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgcGVyZm9ybUhlYWRlcktleUNvbWJpbmF0aW9uKGNvbHVtbiwga2V5LCBzaGlmdCwgY3RybCwgYWx0LCBldmVudCkge1xuICAgICAgICBsZXQgZGlyZWN0aW9uID0gdGhpcy5ncmlkLnNvcnRpbmdFeHByZXNzaW9ucy5maW5kKGV4cHIgPT4gZXhwci5maWVsZE5hbWUgPT09IGNvbHVtbi5maWVsZCk/LmRpcjtcbiAgICAgICAgaWYgKGN0cmwgJiYga2V5LmluY2x1ZGVzKCd1cCcpICYmIGNvbHVtbi5zb3J0YWJsZSAmJiAhY29sdW1uLmNvbHVtbkdyb3VwKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBkaXJlY3Rpb24gPT09IFNvcnRpbmdEaXJlY3Rpb24uQXNjID8gU29ydGluZ0RpcmVjdGlvbi5Ob25lIDogU29ydGluZ0RpcmVjdGlvbi5Bc2M7XG4gICAgICAgICAgICB0aGlzLmdyaWQuc29ydCh7IGZpZWxkTmFtZTogY29sdW1uLmZpZWxkLCBkaXI6IGRpcmVjdGlvbiwgaWdub3JlQ2FzZTogZmFsc2UgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0cmwgJiYga2V5LmluY2x1ZGVzKCdkb3duJykgJiYgY29sdW1uLnNvcnRhYmxlICYmICFjb2x1bW4uY29sdW1uR3JvdXApIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IGRpcmVjdGlvbiA9PT0gU29ydGluZ0RpcmVjdGlvbi5EZXNjID8gU29ydGluZ0RpcmVjdGlvbi5Ob25lIDogU29ydGluZ0RpcmVjdGlvbi5EZXNjO1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNvcnQoeyBmaWVsZE5hbWU6IGNvbHVtbi5maWVsZCwgZGlyOiBkaXJlY3Rpb24sIGlnbm9yZUNhc2U6IGZhbHNlIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGlmdCAmJiBhbHQgJiYgdGhpcy5pc1RvZ2dsZUtleShrZXkpICYmICFjb2x1bW4uY29sdW1uR3JvdXAgJiYgY29sdW1uLmdyb3VwYWJsZSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gZGlyZWN0aW9uIHx8IFNvcnRpbmdEaXJlY3Rpb24uQXNjO1xuICAgICAgICAgICAgaWYgKGtleS5pbmNsdWRlcygncmlnaHQnKSkge1xuICAgICAgICAgICAgICAgICh0aGlzLmdyaWQgYXMgYW55KS5ncm91cEJ5KHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOiBjb2x1bW4uZmllbGQsXG4gICAgICAgICAgICAgICAgICAgIGRpcjogZGlyZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpZ25vcmVDYXNlOiBjb2x1bW4uc29ydGluZ0lnbm9yZUNhc2UsXG4gICAgICAgICAgICAgICAgICAgIHN0cmF0ZWd5OiBjb2x1bW4uc29ydFN0cmF0ZWd5LFxuICAgICAgICAgICAgICAgICAgICBncm91cGluZ0NvbXBhcmVyOiBjb2x1bW4uZ3JvdXBpbmdDb21wYXJlcixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgKHRoaXMuZ3JpZCBhcyBhbnkpLmNsZWFyR3JvdXBpbmcoY29sdW1uLmZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4gPSBrZXkuaW5jbHVkZXMoJ3JpZ2h0JykgJiYgKHRoaXMuZ3JpZCBhcyBhbnkpLmhpZGVHcm91cGVkQ29sdW1ucyAmJlxuICAgICAgICAgICAgICAgIGNvbHVtbi52aXNpYmxlSW5kZXggPT09IHRoaXMubGFzdENvbHVtbkluZGV4ID8gdGhpcy5sYXN0Q29sdW1uSW5kZXggLSAxIDogdGhpcy5hY3RpdmVOb2RlLmNvbHVtbjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWx0ICYmIChST1dfRVhQQU5EX0tFWVMuaGFzKGtleSkgfHwgUk9XX0NPTExBUFNFX0tFWVMuaGFzKGtleSkpKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZU1DSEV4cGFuZENvbGxhcHNlKGtleSwgY29sdW1uKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoWycgJywgJ3NwYWNlYmFyJywgJ3NwYWNlJ10uaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDb2x1bW5TZWxlY3Rpb24oY29sdW1uLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsdCAmJiAoa2V5ID09PSAnbCcgfHwga2V5ID09PSAnwqwnKSAmJiB0aGlzLmdyaWQuYWxsb3dBZHZhbmNlZEZpbHRlcmluZykge1xuICAgICAgICAgICAgdGhpcy5ncmlkLm9wZW5BZHZhbmNlZEZpbHRlcmluZ0RpYWxvZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdHJsICYmIHNoaWZ0ICYmIGtleSA9PT0gJ2wnICYmIHRoaXMuZ3JpZC5hbGxvd0ZpbHRlcmluZyAmJiAhY29sdW1uLmNvbHVtbkdyb3VwICYmIGNvbHVtbi5maWx0ZXJhYmxlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkLmZpbHRlck1vZGUgPT09IEZpbHRlck1vZGUuZXhjZWxTdHlsZUZpbHRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckVsID0gdGhpcy5ncmlkLmhlYWRlckdyb3Vwcy5maW5kKGcgPT4gZy5hY3RpdmUpLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmZpbHRlcmluZ1NlcnZpY2UudG9nZ2xlRmlsdGVyRHJvcGRvd24oaGVhZGVyRWwsIGNvbHVtbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybUhvcml6b250YWxTY3JvbGxUb0NlbGwoY29sdW1uLnZpc2libGVJbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmZpbHRlcmluZ1NlcnZpY2UuZmlsdGVyZWRDb2x1bW4gPSBjb2x1bW47XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmZpbHRlcmluZ1NlcnZpY2UuaXNGaWx0ZXJSb3dWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZmlyc3RWaXNpYmxlTm9kZShyb3dJbmRleD8pIHtcbiAgICAgICAgY29uc3QgY29sSW5kZXggPSB0aGlzLmxhc3RBY3RpdmVOb2RlLmNvbHVtbiAhPT0gdW5kZWZpbmVkID8gdGhpcy5sYXN0QWN0aXZlTm9kZS5jb2x1bW4gOlxuICAgICAgICAgICAgdGhpcy5ncmlkLnZpc2libGVDb2x1bW5zLnNvcnQoKGMxLCBjMikgPT4gYzEudmlzaWJsZUluZGV4IC0gYzIudmlzaWJsZUluZGV4KVxuICAgICAgICAgICAgICAgIC5maW5kKGMgPT4gdGhpcy5pc0NvbHVtbkZ1bGx5VmlzaWJsZShjLnZpc2libGVJbmRleCkpPy52aXNpYmxlSW5kZXg7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHRoaXMuZ3JpZC52aXNpYmxlQ29sdW1ucy5maW5kKChjb2wpID0+ICFjb2wuY29sdW1uTGF5b3V0ICYmIGNvbC52aXNpYmxlSW5kZXggPT09IGNvbEluZGV4KTtcbiAgICAgICAgY29uc3Qgcm93SW5kID0gcm93SW5kZXggPyByb3dJbmRleCA6IHRoaXMuZ3JpZC5yb3dMaXN0LmZpbmQociA9PiAhdGhpcy5zaG91bGRQZXJmb3JtVmVydGljYWxTY3JvbGwoci5pbmRleCwgY29sSW5kZXgpKT8uaW5kZXg7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB7XG4gICAgICAgICAgICByb3c6IHJvd0luZCA/PyAwLFxuICAgICAgICAgICAgY29sdW1uOiBjb2x1bW4/LnZpc2libGVJbmRleCA/PyAwLCBsZXZlbDogY29sdW1uPy5sZXZlbCA/PyAwLFxuICAgICAgICAgICAgbWNoQ2FjaGU6IGNvbHVtbiA/IHsgbGV2ZWw6IGNvbHVtbi5sZXZlbCwgdmlzaWJsZUluZGV4OiBjb2x1bW4udmlzaWJsZUluZGV4IH0gOiB7fSBhcyBDb2x1bW5Hcm91cHNDYWNoZSxcbiAgICAgICAgICAgIGxheW91dDogY29sdW1uICYmIGNvbHVtbi5jb2x1bW5MYXlvdXRDaGlsZCA/IHtcbiAgICAgICAgICAgICAgICByb3dTdGFydDogY29sdW1uLnJvd1N0YXJ0LCBjb2xTdGFydDogY29sdW1uLmNvbFN0YXJ0LFxuICAgICAgICAgICAgICAgIHJvd0VuZDogY29sdW1uLnJvd0VuZCwgY29sRW5kOiBjb2x1bW4uY29sRW5kLCBjb2x1bW5WaXNpYmxlSW5kZXg6IGNvbHVtbi52aXNpYmxlSW5kZXhcbiAgICAgICAgICAgIH0gOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlTUNIZWFkZXJOYXYoa2V5OiBzdHJpbmcsIGN0cmw6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgbmV3SGVhZGVyTm9kZTogQ29sdW1uR3JvdXBzQ2FjaGUgPSB7XG4gICAgICAgICAgICB2aXNpYmxlSW5kZXg6IHRoaXMuYWN0aXZlTm9kZS5tY2hDYWNoZS52aXNpYmxlSW5kZXgsXG4gICAgICAgICAgICBsZXZlbDogdGhpcy5hY3RpdmVOb2RlLm1jaENhY2hlLmxldmVsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFjdGl2ZUNvbCA9IHRoaXMuY3VycmVudEFjdGl2ZUNvbHVtbjtcbiAgICAgICAgY29uc3QgbGFzdEdyb3VwSW5kZXggPSBNYXRoLm1heCguLi4gdGhpcy5ncmlkLnZpc2libGVDb2x1bW5zLlxuICAgICAgICAgICAgZmlsdGVyKGMgPT4gYy5sZXZlbCA8PSB0aGlzLmFjdGl2ZU5vZGUubGV2ZWwpLm1hcChjb2wgPT4gY29sLnZpc2libGVJbmRleCkpO1xuICAgICAgICBsZXQgbmV4dENvbCA9IGFjdGl2ZUNvbDtcbiAgICAgICAgaWYgKChrZXkuaW5jbHVkZXMoJ2xlZnQnKSB8fCBrZXkgPT09ICdob21lJykgJiYgdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY3RybCB8fCBrZXkgPT09ICdob21lJyA/IDAgOiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uIC0gMTtcbiAgICAgICAgICAgIG5leHRDb2wgPSB0aGlzLmdldE5leHRDb2x1bW5NQ0goaW5kZXgpO1xuICAgICAgICAgICAgbmV3SGVhZGVyTm9kZS52aXNpYmxlSW5kZXggPSBuZXh0Q29sLnZpc2libGVJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKGtleS5pbmNsdWRlcygncmlnaHQnKSB8fCBrZXkgPT09ICdlbmQnKSAmJiBhY3RpdmVDb2wudmlzaWJsZUluZGV4IDwgbGFzdEdyb3VwSW5kZXgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRWSW5kZXggPSBhY3RpdmVDb2wuY2hpbGRyZW4gPyBNYXRoLm1heCguLi5hY3RpdmVDb2wuYWxsQ2hpbGRyZW4ubWFwKGMgPT4gYy52aXNpYmxlSW5kZXgpKSArIDEgOlxuICAgICAgICAgICAgICAgIGFjdGl2ZUNvbC52aXNpYmxlSW5kZXggKyAxO1xuICAgICAgICAgICAgbmV4dENvbCA9IGN0cmwgfHwga2V5ID09PSAnZW5kJyA/IHRoaXMuZ2V0TmV4dENvbHVtbk1DSCh0aGlzLmxhc3RDb2x1bW5JbmRleCkgOiB0aGlzLmdldE5leHRDb2x1bW5NQ0gobmV4dFZJbmRleCk7XG4gICAgICAgICAgICBuZXdIZWFkZXJOb2RlLnZpc2libGVJbmRleCA9IG5leHRDb2wudmlzaWJsZUluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmICghY3RybCAmJiBrZXkuaW5jbHVkZXMoJ3VwJykgJiYgdGhpcy5hY3RpdmVOb2RlLmxldmVsID4gMCkge1xuICAgICAgICAgICAgbmV4dENvbCA9IGFjdGl2ZUNvbC5wYXJlbnQ7XG4gICAgICAgICAgICBuZXdIZWFkZXJOb2RlLmxldmVsID0gbmV4dENvbC5sZXZlbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN0cmwgJiYga2V5LmluY2x1ZGVzKCdkb3duJykgJiYgYWN0aXZlQ29sLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBuZXh0Q29sID0gYWN0aXZlQ29sLmNoaWxkcmVuLmZpbmQoYyA9PiBjLnZpc2libGVJbmRleCA9PT0gbmV3SGVhZGVyTm9kZS52aXNpYmxlSW5kZXgpIHx8XG4gICAgICAgICAgICAgICAgYWN0aXZlQ29sLmNoaWxkcmVuLnRvQXJyYXkoKS5zb3J0KChhLCBiKSA9PiBiLnZpc2libGVJbmRleCAtIGEudmlzaWJsZUluZGV4KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGNvbCA9PiBjb2wudmlzaWJsZUluZGV4IDwgbmV3SGVhZGVyTm9kZS52aXNpYmxlSW5kZXgpWzBdO1xuICAgICAgICAgICAgbmV3SGVhZGVyTm9kZS5sZXZlbCA9IG5leHRDb2wubGV2ZWw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEFjdGl2ZU5vZGUoe1xuICAgICAgICAgICAgcm93OiB0aGlzLmFjdGl2ZU5vZGUucm93LFxuICAgICAgICAgICAgY29sdW1uOiBuZXh0Q29sLnZpc2libGVJbmRleCxcbiAgICAgICAgICAgIGxldmVsOiBuZXh0Q29sLmxldmVsLFxuICAgICAgICAgICAgbWNoQ2FjaGU6IG5ld0hlYWRlck5vZGVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGVyZm9ybUhvcml6b250YWxTY3JvbGxUb0NlbGwobmV4dENvbC52aXNpYmxlSW5kZXgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlTUNIRXhwYW5kQ29sbGFwc2Uoa2V5LCBjb2x1bW4pIHtcbiAgICAgICAgaWYgKCFjb2x1bW4uY2hpbGRyZW4gfHwgIWNvbHVtbi5jb2xsYXBzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29sdW1uLmV4cGFuZGVkICYmIFJPV19FWFBBTkRfS0VZUy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgY29sdW1uLmV4cGFuZGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2x1bW4uZXhwYW5kZWQgJiYgUk9XX0NPTExBUFNFX0tFWVMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIGNvbHVtbi5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVDb2x1bW5TZWxlY3Rpb24oY29sdW1uLCBldmVudCkge1xuICAgICAgICBpZiAoIWNvbHVtbi5zZWxlY3RhYmxlIHx8IHRoaXMuZ3JpZC5jb2x1bW5TZWxlY3Rpb24gPT09IEdyaWRTZWxlY3Rpb25Nb2RlLm5vbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGVhclNlbGVjdGlvbiA9IHRoaXMuZ3JpZC5jb2x1bW5TZWxlY3Rpb24gPT09IEdyaWRTZWxlY3Rpb25Nb2RlLnNpbmdsZTtcbiAgICAgICAgY29uc3QgY29sdW1uc1RvU2VsZWN0ID0gIWNvbHVtbi5jaGlsZHJlbiA/IFtjb2x1bW4uZmllbGRdIDpcbiAgICAgICAgICAgIGNvbHVtbi5hbGxDaGlsZHJlbi5maWx0ZXIoYyA9PiAhYy5oaWRkZW4gJiYgYy5zZWxlY3RhYmxlICYmICFjLmNvbHVtbkdyb3VwKS5tYXAoYyA9PiBjLmZpZWxkKTtcbiAgICAgICAgaWYgKGNvbHVtbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdGlvblNlcnZpY2UuZGVzZWxlY3RDb2x1bW5zKGNvbHVtbnNUb1NlbGVjdCwgZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0Q29sdW1ucyhjb2x1bW5zVG9TZWxlY3QsIGNsZWFyU2VsZWN0aW9uLCBmYWxzZSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXROZXh0Q29sdW1uTUNIKHZpc2libGVJbmRleCkge1xuICAgICAgICBsZXQgY29sID0gdGhpcy5ncmlkLmdldENvbHVtbkJ5VmlzaWJsZUluZGV4KHZpc2libGVJbmRleCk7XG4gICAgICAgIGxldCBwYXJlbnQgPSBjb2wucGFyZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50ICYmIGNvbC5sZXZlbCA+IHRoaXMuYWN0aXZlTm9kZS5tY2hDYWNoZS5sZXZlbCkge1xuICAgICAgICAgICAgY29sID0gY29sLnBhcmVudDtcbiAgICAgICAgICAgIHBhcmVudCA9IGNvbC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBjdXJyZW50QWN0aXZlQ29sdW1uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnZpc2libGVDb2x1bW5zLmZpbmQoYyA9PiBjLnZpc2libGVJbmRleCA9PT0gdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiAmJiBjLmxldmVsID09PSB0aGlzLmFjdGl2ZU5vZGUubGV2ZWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNBY3RpdmVOb2RlKHJJbmRleDogbnVtYmVyLCBjSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVOb2RlID8gdGhpcy5hY3RpdmVOb2RlLnJvdyA9PT0gckluZGV4ICYmIHRoaXMuYWN0aXZlTm9kZS5jb2x1bW4gPT09IGNJbmRleCA6IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNUb2dnbGVLZXkoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFJPV19DT0xMQVBTRV9LRVlTLmhhcyhrZXkpIHx8IFJPV19FWFBBTkRfS0VZUy5oYXMoa2V5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQWRkS2V5KGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBST1dfQUREX0tFWVMuaGFzKGtleSk7XG4gICAgfVxufVxuIl19