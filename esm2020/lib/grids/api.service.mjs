import { Injectable } from '@angular/core';
import { cloneArray, reverseMapper, mergeObjects } from '../core/utils';
import { DataUtil, GridColumnDataType } from '../data-operations/data-util';
import { TransactionType } from '../services/transaction/transaction';
import { SortingDirection } from '../data-operations/sorting-strategy';
import { FilterUtil } from '../data-operations/filtering-strategy';
import * as i0 from "@angular/core";
import * as i1 from "./common/crud.service";
import * as i2 from "./moving/moving.service";
/**
 * @hidden
 */
export class GridBaseAPIService {
    constructor(crudService, cms) {
        this.crudService = crudService;
        this.cms = cms;
        this.destroyMap = new Map();
    }
    get_column_by_name(name) {
        return this.grid.columnList.find((col) => col.field === name);
    }
    get_summary_data() {
        const grid = this.grid;
        let data = grid.filteredData;
        if (data && grid.hasPinnedRecords) {
            data = grid._filteredUnpinnedData;
        }
        if (!data) {
            if (grid.transactions.enabled) {
                data = DataUtil.mergeTransactions(cloneArray(grid.data), grid.transactions.getAggregatedChanges(true), grid.primaryKey, grid.dataCloneStrategy);
                const deletedRows = grid.transactions.getTransactionLog().filter(t => t.type === TransactionType.DELETE).map(t => t.id);
                deletedRows.forEach(rowID => {
                    const tempData = grid.primaryKey ? data.map(rec => rec[grid.primaryKey]) : data;
                    const index = tempData.indexOf(rowID);
                    if (index !== -1) {
                        data.splice(index, 1);
                    }
                });
            }
            else {
                data = grid.data;
            }
        }
        return data;
    }
    /**
     * @hidden
     * @internal
     */
    getRowData(rowID) {
        const data = this.get_all_data(this.grid.transactions.enabled);
        const index = this.get_row_index_in_data(rowID, data);
        return data[index];
    }
    get_row_index_in_data(rowID, dataCollection) {
        const grid = this.grid;
        if (!grid) {
            return -1;
        }
        const data = dataCollection ?? this.get_all_data(grid.transactions.enabled);
        return grid.primaryKey ? data.findIndex(record => record.recordRef ? record.recordRef[grid.primaryKey] === rowID
            : record[grid.primaryKey] === rowID) : data.indexOf(rowID);
    }
    get_row_by_key(rowSelector) {
        if (!this.grid) {
            return null;
        }
        const primaryKey = this.grid.primaryKey;
        if (primaryKey !== undefined && primaryKey !== null) {
            return this.grid.dataRowList.find((row) => row.data[primaryKey] === rowSelector);
        }
        else {
            return this.grid.dataRowList.find((row) => row.data === rowSelector);
        }
    }
    get_row_by_index(rowIndex) {
        return this.grid.rowList.find((row) => row.index === rowIndex);
    }
    /**
     * Gets the rowID of the record at the specified data view index
     *
     * @param index
     * @param dataCollection
     */
    get_rec_id_by_index(index, dataCollection) {
        dataCollection = dataCollection || this.grid.data;
        if (index >= 0 && index < dataCollection.length) {
            const rec = dataCollection[index];
            return this.grid.primaryKey ? rec[this.grid.primaryKey] : rec;
        }
        return null;
    }
    get_cell_by_key(rowSelector, field) {
        const row = this.get_row_by_key(rowSelector);
        if (row && row.cells) {
            return row.cells.find((cell) => cell.column.field === field);
        }
    }
    get_cell_by_index(rowIndex, columnID) {
        const row = this.get_row_by_index(rowIndex);
        const hasCells = row && row.cells;
        if (hasCells && typeof columnID === 'number') {
            return row.cells.find((cell) => cell.column.index === columnID);
        }
        if (hasCells && typeof columnID === 'string') {
            return row.cells.find((cell) => cell.column.field === columnID);
        }
    }
    get_cell_by_visible_index(rowIndex, columnIndex) {
        const row = this.get_row_by_index(rowIndex);
        if (row && row.cells) {
            return row.cells.find((cell) => cell.visibleColumnIndex === columnIndex);
        }
    }
    update_cell(cell) {
        if (!cell) {
            return;
        }
        const args = cell.createEditEventArgs(true);
        this.grid.summaryService.clearSummaryCache(args);
        const data = this.getRowData(cell.id.rowID);
        this.updateData(this.grid, cell.id.rowID, data, cell.rowData, reverseMapper(cell.column.field, args.newValue));
        if (this.grid.primaryKey === cell.column.field) {
            if (this.grid.selectionService.isRowSelected(cell.id.rowID)) {
                this.grid.selectionService.deselectRow(cell.id.rowID);
                this.grid.selectionService.selectRowById(args.newValue);
            }
            if (this.grid.hasSummarizedColumns) {
                this.grid.summaryService.removeSummaries(cell.id.rowID);
            }
        }
        if (!this.grid.rowEditable || !this.crudService.row ||
            this.crudService.row.id !== cell.id.rowID || !this.grid.transactions.enabled) {
            this.grid.summaryService.clearSummaryCache(args);
            this.grid.pipeTrigger++;
        }
        return args;
    }
    // TODO: CRUD refactor to not emit editing evts.
    update_row(row, value, event) {
        const grid = this.grid;
        const selected = grid.selectionService.isRowSelected(row.id);
        const rowInEditMode = this.crudService.row;
        const data = this.get_all_data(grid.transactions.enabled);
        const index = this.get_row_index_in_data(row.id, data);
        const hasSummarized = grid.hasSummarizedColumns;
        this.crudService.updateRowEditData(row, value);
        const args = row.createEditEventArgs(true, event);
        // If no valid row is found
        if (index === -1) {
            return args;
        }
        if (rowInEditMode) {
            const hasChanges = grid.transactions.getState(args.rowID, true);
            grid.transactions.endPending(false);
            if (!hasChanges) {
                return args;
            }
        }
        if (!args.newValue) {
            return args;
        }
        if (hasSummarized) {
            grid.summaryService.removeSummaries(args.rowID);
        }
        this.updateData(grid, row.id, data[index], args.oldValue, args.newValue);
        const newId = grid.primaryKey ? args.newValue[grid.primaryKey] : args.newValue;
        if (selected) {
            grid.selectionService.deselectRow(row.id);
            grid.selectionService.selectRowById(newId);
        }
        // make sure selection is handled prior to updating the row.id
        row.id = newId;
        if (hasSummarized) {
            grid.summaryService.removeSummaries(newId);
        }
        grid.pipeTrigger++;
        return args;
    }
    sort(expression) {
        if (expression.dir === SortingDirection.None) {
            this.remove_grouping_expression(expression.fieldName);
        }
        const sortingState = cloneArray(this.grid.sortingExpressions);
        this.prepare_sorting_expression([sortingState], expression);
        this.grid.sortingExpressions = sortingState;
    }
    sort_multiple(expressions) {
        const sortingState = cloneArray(this.grid.sortingExpressions);
        for (const each of expressions) {
            if (each.dir === SortingDirection.None) {
                this.remove_grouping_expression(each.fieldName);
            }
            this.prepare_sorting_expression([sortingState], each);
        }
        this.grid.sortingExpressions = sortingState;
    }
    clear_sort(fieldName) {
        const sortingState = this.grid.sortingExpressions;
        const index = sortingState.findIndex((expr) => expr.fieldName === fieldName);
        if (index > -1) {
            sortingState.splice(index, 1);
            this.grid.sortingExpressions = sortingState;
        }
    }
    clear_groupby(_name) {
    }
    should_apply_number_style(column) {
        return column.dataType === GridColumnDataType.Number;
    }
    get_data() {
        const grid = this.grid;
        const data = grid.data ? grid.data : [];
        return data;
    }
    get_all_data(includeTransactions = false) {
        const grid = this.grid;
        let data = grid && grid.data ? grid.data : [];
        data = includeTransactions ? grid.dataWithAddedInTransactionRows : data;
        return data;
    }
    get_filtered_data() {
        return this.grid.filteredData;
    }
    addRowToData(rowData, _parentID) {
        // Add row goes to transactions and if rowEditable is properly implemented, added rows will go to pending transactions
        // If there is a row in edit - > commit and close
        const grid = this.grid;
        if (grid.transactions.enabled) {
            const transactionId = grid.primaryKey ? rowData[grid.primaryKey] : rowData;
            const transaction = { id: transactionId, type: TransactionType.ADD, newValue: rowData };
            grid.transactions.add(transaction);
        }
        else {
            grid.data.push(rowData);
        }
    }
    deleteRowFromData(rowID, index) {
        //  if there is a row (index !== 0) delete it
        //  if there is a row in ADD or UPDATE state change it's state to DELETE
        const grid = this.grid;
        if (index !== -1) {
            if (grid.transactions.enabled) {
                const transaction = { id: rowID, type: TransactionType.DELETE, newValue: null };
                grid.transactions.add(transaction, grid.data[index]);
            }
            else {
                grid.data.splice(index, 1);
            }
        }
        else {
            const state = grid.transactions.getState(rowID);
            grid.transactions.add({ id: rowID, type: TransactionType.DELETE, newValue: null }, state && state.recordRef);
        }
    }
    deleteRowById(rowId) {
        let index;
        const grid = this.grid;
        const data = this.get_all_data();
        if (grid.primaryKey) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            index = data.map((record) => record[grid.primaryKey]).indexOf(rowId);
        }
        else {
            index = data.indexOf(rowId);
        }
        const state = grid.transactions.getState(rowId);
        const hasRowInNonDeletedState = state && state.type !== TransactionType.DELETE;
        //  if there is a row (index !== -1) and the we have cell in edit mode on same row exit edit mode
        //  if there is no row (index === -1), but there is a row in ADD or UPDATE state do as above
        //  Otherwise just exit - there is nothing to delete
        if (index !== -1 || hasRowInNonDeletedState) {
            // Always exit edit when row is deleted
            this.crudService.endEdit(true);
        }
        else {
            return;
        }
        const record = data[index];
        // //  TODO: should we emit this when cascadeOnDelete is true for each row?!?!
        grid.rowDeletedNotifier.next({ data: data[index] });
        this.deleteRowFromData(rowId, index);
        if (grid.selectionService.isRowSelected(rowId)) {
            grid.selectionService.deselectRow(rowId);
        }
        else {
            grid.selectionService.clearHeaderCBState();
        }
        grid.pipeTrigger++;
        grid.notifyChanges();
        // Data needs to be recalculated if transactions are in place
        // If no transactions, `data` will be a reference to the grid getter, otherwise it will be stale
        const dataAfterDelete = grid.transactions.enabled ? grid.dataWithAddedInTransactionRows : data;
        grid.refreshSearch();
        if (dataAfterDelete.length % grid.perPage === 0 && dataAfterDelete.length / grid.perPage - 1 < grid.page && grid.page !== 0) {
            grid.page--;
        }
        return record;
    }
    get_row_id(rowData) {
        return this.grid.primaryKey ? rowData[this.grid.primaryKey] : rowData;
    }
    row_deleted_transaction(rowID) {
        const grid = this.grid;
        if (!grid) {
            return false;
        }
        if (!grid.transactions.enabled) {
            return false;
        }
        const state = grid.transactions.getState(rowID);
        if (state) {
            return state.type === TransactionType.DELETE;
        }
        return false;
    }
    get_row_expansion_state(record) {
        const grid = this.grid;
        const states = grid.expansionStates;
        const rowID = grid.primaryKey ? record[grid.primaryKey] : record;
        const expanded = states.get(rowID);
        if (expanded !== undefined) {
            return expanded;
        }
        else {
            return grid.getDefaultExpandState(record);
        }
    }
    set_row_expansion_state(rowID, expanded, event) {
        const grid = this.grid;
        const expandedStates = grid.expansionStates;
        if (!this.allow_expansion_state_change(rowID, expanded)) {
            return;
        }
        const args = {
            rowID,
            expanded,
            event,
            cancel: false
        };
        grid.rowToggle.emit(args);
        if (args.cancel) {
            return;
        }
        expandedStates.set(rowID, expanded);
        grid.expansionStates = expandedStates;
        // K.D. 28 Feb, 2022 #10634 Don't trigger endEdit/commit upon row expansion state change
        // this.crudService.endEdit(false);
    }
    get_rec_by_id(rowID) {
        return this.grid.primaryKey ? this.getRowData(rowID) : rowID;
    }
    /**
     * Returns the index of the record in the data view by pk or -1 if not found or primaryKey is not set.
     *
     * @param pk
     * @param dataCollection
     */
    get_rec_index_by_id(pk, dataCollection) {
        dataCollection = dataCollection || this.grid.data;
        return this.grid.primaryKey ? dataCollection.findIndex(rec => rec[this.grid.primaryKey] === pk) : -1;
    }
    allow_expansion_state_change(rowID, expanded) {
        return this.grid.expansionStates.get(rowID) !== expanded;
    }
    prepare_sorting_expression(stateCollections, expression) {
        if (expression.dir === SortingDirection.None) {
            stateCollections.forEach(state => {
                state.splice(state.findIndex((expr) => expr.fieldName === expression.fieldName), 1);
            });
            return;
        }
        /**
         * We need to make sure the states in each collection with same fields point to the same object reference.
         * If the different state collections provided have different sizes we need to get the largest one.
         * That way we can get the state reference from the largest one that has the same fieldName as the expression to prepare.
         */
        let maxCollection = stateCollections[0];
        for (let i = 1; i < stateCollections.length; i++) {
            if (maxCollection.length < stateCollections[i].length) {
                maxCollection = stateCollections[i];
            }
        }
        const maxExpr = maxCollection.find((expr) => expr.fieldName === expression.fieldName);
        stateCollections.forEach(collection => {
            const myExpr = collection.find((expr) => expr.fieldName === expression.fieldName);
            if (!myExpr && !maxExpr) {
                // Expression with this fieldName is missing from the current and the max collection.
                collection.push(expression);
            }
            else if (!myExpr && maxExpr) {
                // Expression with this fieldName is missing from the current and but the max collection has.
                collection.push(maxExpr);
                Object.assign(maxExpr, expression);
            }
            else {
                // The current collection has the expression so just update it.
                Object.assign(myExpr, expression);
            }
        });
    }
    remove_grouping_expression(_fieldName) {
    }
    filterDataByExpressions(expressionsTree) {
        let data = this.get_all_data();
        if (expressionsTree.filteringOperands.length) {
            const state = { expressionsTree, strategy: this.grid.filterStrategy };
            data = FilterUtil.filter(cloneArray(data), state, this.grid);
        }
        return data;
    }
    sortDataByExpressions(data, expressions) {
        return DataUtil.sort(cloneArray(data), expressions, this.grid.sortStrategy, this.grid);
    }
    /**
     * Updates related row of provided grid's data source with provided new row value
     *
     * @param grid Grid to update data for
     * @param rowID ID of the row to update
     * @param rowValueInDataSource Initial value of the row as it is in data source
     * @param rowCurrentValue Current value of the row as it is with applied previous transactions
     * @param rowNewValue New value of the row
     */
    updateData(grid, rowID, rowValueInDataSource, rowCurrentValue, rowNewValue) {
        if (grid.transactions.enabled) {
            const transaction = {
                id: rowID,
                type: TransactionType.UPDATE,
                newValue: rowNewValue
            };
            grid.transactions.add(transaction, rowCurrentValue);
        }
        else {
            mergeObjects(rowValueInDataSource, rowNewValue);
        }
    }
    update_row_in_array(value, rowID, index) {
        const grid = this.grid;
        grid.data[index] = value;
    }
    getSortStrategyPerColumn(fieldName) {
        return this.get_column_by_name(fieldName) ?
            this.get_column_by_name(fieldName).sortStrategy : undefined;
    }
}
GridBaseAPIService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: GridBaseAPIService, deps: [{ token: i1.IgxGridCRUDService }, { token: i2.IgxColumnMovingService }], target: i0.ɵɵFactoryTarget.Injectable });
GridBaseAPIService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: GridBaseAPIService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: GridBaseAPIService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.IgxGridCRUDService }, { type: i2.IgxColumnMovingService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRTVFLE9BQU8sRUFBZSxlQUFlLEVBQVMsTUFBTSxxQ0FBcUMsQ0FBQztBQUsxRixPQUFPLEVBQXNCLGdCQUFnQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDOzs7O0FBRW5FOztHQUVHO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQU0zQixZQUNXLFdBQStCLEVBQy9CLEdBQTJCO1FBRDNCLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixRQUFHLEdBQUgsR0FBRyxDQUF3QjtRQUo1QixlQUFVLEdBQWtDLElBQUksR0FBRyxFQUE0QixDQUFDO0lBS3RGLENBQUM7SUFFRSxrQkFBa0IsQ0FBQyxJQUFZO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBZSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZ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LEVBQUUsS0FBSyxFQUFFLG9CQUF5QixFQUFFLGVBQW9CLEVBQUUsV0FBaUM7UUFDaEgsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUMzQixNQUFNLFdBQVcsR0FBZ0I7Z0JBQzdCLEVBQUUsRUFBRSxLQUFLO2dCQUNULElBQUksRUFBRSxlQUFlLENBQUMsTUFBTTtnQkFDNUIsUUFBUSxFQUFFLFdBQVc7YUFDeEIsQ0FBQztZQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztTQUN2RDthQUFNO1lBQ0gsWUFBWSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztJQUdTLG1CQUFtQixDQUFDLEtBQVUsRUFBRSxLQUFVLEVBQUUsS0FBYTtRQUMvRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFUyx3QkFBd0IsQ0FBQyxTQUFpQjtRQUNoRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNwRSxDQUFDOzsrR0E5ZVEsa0JBQWtCO21IQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNsb25lQXJyYXksIHJldmVyc2VNYXBwZXIsIG1lcmdlT2JqZWN0cyB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgRGF0YVV0aWwsIEdyaWRDb2x1bW5EYXRhVHlwZSB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9kYXRhLXV0aWwnO1xuaW1wb3J0IHsgSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctZXhwcmVzc2lvbnMtdHJlZSc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbiwgVHJhbnNhY3Rpb25UeXBlLCBTdGF0ZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zYWN0aW9uL3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IElneENlbGwsIElneEdyaWRDUlVEU2VydmljZSwgSWd4RWRpdFJvdyB9IGZyb20gJy4vY29tbW9uL2NydWQuc2VydmljZSc7XG5pbXBvcnQgeyBDZWxsVHlwZSwgQ29sdW1uVHlwZSwgR3JpZFNlcnZpY2VUeXBlLCBHcmlkVHlwZSwgUm93VHlwZSB9IGZyb20gJy4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElHcmlkRWRpdEV2ZW50QXJncywgSVJvd1RvZ2dsZUV2ZW50QXJncyB9IGZyb20gJy4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5Nb3ZpbmdTZXJ2aWNlIH0gZnJvbSAnLi9tb3ZpbmcvbW92aW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSVNvcnRpbmdFeHByZXNzaW9uLCBTb3J0aW5nRGlyZWN0aW9uIH0gZnJvbSAnLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRmlsdGVyVXRpbCB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctc3RyYXRlZ3knO1xuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdyaWRCYXNlQVBJU2VydmljZTxUIGV4dGVuZHMgR3JpZFR5cGU+IGltcGxlbWVudHMgR3JpZFNlcnZpY2VUeXBlIHtcblxuXG4gICAgcHVibGljIGdyaWQ6IFQ7XG4gICAgcHJvdGVjdGVkIGRlc3Ryb3lNYXA6IE1hcDxzdHJpbmcsIFN1YmplY3Q8Ym9vbGVhbj4+ID0gbmV3IE1hcDxzdHJpbmcsIFN1YmplY3Q8Ym9vbGVhbj4+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGNydWRTZXJ2aWNlOiBJZ3hHcmlkQ1JVRFNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBjbXM6IElneENvbHVtbk1vdmluZ1NlcnZpY2VcbiAgICApIHsgfVxuXG4gICAgcHVibGljIGdldF9jb2x1bW5fYnlfbmFtZShuYW1lOiBzdHJpbmcpOiBDb2x1bW5UeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5jb2x1bW5MaXN0LmZpbmQoKGNvbDogQ29sdW1uVHlwZSkgPT4gY29sLmZpZWxkID09PSBuYW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X3N1bW1hcnlfZGF0YSgpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgbGV0IGRhdGEgPSBncmlkLmZpbHRlcmVkRGF0YTtcbiAgICAgICAgaWYgKGRhdGEgJiYgZ3JpZC5oYXNQaW5uZWRSZWNvcmRzKSB7XG4gICAgICAgICAgICBkYXRhID0gZ3JpZC5fZmlsdGVyZWRVbnBpbm5lZERhdGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBEYXRhVXRpbC5tZXJnZVRyYW5zYWN0aW9ucyhcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVBcnJheShncmlkLmRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBncmlkLnRyYW5zYWN0aW9ucy5nZXRBZ2dyZWdhdGVkQ2hhbmdlcyh0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5wcmltYXJ5S2V5LFxuICAgICAgICAgICAgICAgICAgICBncmlkLmRhdGFDbG9uZVN0cmF0ZWd5XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVkUm93cyA9IGdyaWQudHJhbnNhY3Rpb25zLmdldFRyYW5zYWN0aW9uTG9nKCkuZmlsdGVyKHQgPT4gdC50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuREVMRVRFKS5tYXAodCA9PiB0LmlkKTtcbiAgICAgICAgICAgICAgICBkZWxldGVkUm93cy5mb3JFYWNoKHJvd0lEID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcERhdGEgPSBncmlkLnByaW1hcnlLZXkgPyBkYXRhLm1hcChyZWMgPT4gcmVjW2dyaWQucHJpbWFyeUtleV0pIDogZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0ZW1wRGF0YS5pbmRleE9mKHJvd0lEKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBncmlkLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSb3dEYXRhKHJvd0lEOiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0X2FsbF9kYXRhKHRoaXMuZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRfcm93X2luZGV4X2luX2RhdGEocm93SUQsIGRhdGEpO1xuICAgICAgICByZXR1cm4gZGF0YVtpbmRleF07XG4gICAgfVxuXG4gICAgcHVibGljIGdldF9yb3dfaW5kZXhfaW5fZGF0YShyb3dJRDogYW55LCBkYXRhQ29sbGVjdGlvbj86IGFueVtdKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgaWYgKCFncmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFDb2xsZWN0aW9uID8/IHRoaXMuZ2V0X2FsbF9kYXRhKGdyaWQudHJhbnNhY3Rpb25zLmVuYWJsZWQpO1xuICAgICAgICByZXR1cm4gZ3JpZC5wcmltYXJ5S2V5ID8gZGF0YS5maW5kSW5kZXgocmVjb3JkID0+IHJlY29yZC5yZWNvcmRSZWYgPyByZWNvcmQucmVjb3JkUmVmW2dyaWQucHJpbWFyeUtleV0gPT09IHJvd0lEXG4gICAgICAgICAgICA6IHJlY29yZFtncmlkLnByaW1hcnlLZXldID09PSByb3dJRCkgOiBkYXRhLmluZGV4T2Yocm93SUQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfcm93X2J5X2tleShyb3dTZWxlY3RvcjogYW55KTogUm93VHlwZSB7XG4gICAgICAgIGlmICghdGhpcy5ncmlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmltYXJ5S2V5ID0gdGhpcy5ncmlkLnByaW1hcnlLZXk7XG4gICAgICAgIGlmIChwcmltYXJ5S2V5ICE9PSB1bmRlZmluZWQgJiYgcHJpbWFyeUtleSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5kYXRhUm93TGlzdC5maW5kKChyb3cpID0+IHJvdy5kYXRhW3ByaW1hcnlLZXldID09PSByb3dTZWxlY3Rvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmRhdGFSb3dMaXN0LmZpbmQoKHJvdykgPT4gcm93LmRhdGEgPT09IHJvd1NlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfcm93X2J5X2luZGV4KHJvd0luZGV4OiBudW1iZXIpOiBSb3dUeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5yb3dMaXN0LmZpbmQoKHJvdykgPT4gcm93LmluZGV4ID09PSByb3dJbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcm93SUQgb2YgdGhlIHJlY29yZCBhdCB0aGUgc3BlY2lmaWVkIGRhdGEgdmlldyBpbmRleFxuICAgICAqXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICogQHBhcmFtIGRhdGFDb2xsZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIGdldF9yZWNfaWRfYnlfaW5kZXgoaW5kZXg6IG51bWJlciwgZGF0YUNvbGxlY3Rpb24/OiBhbnlbXSk6IGFueSB7XG4gICAgICAgIGRhdGFDb2xsZWN0aW9uID0gZGF0YUNvbGxlY3Rpb24gfHwgdGhpcy5ncmlkLmRhdGE7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgZGF0YUNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCByZWMgPSBkYXRhQ29sbGVjdGlvbltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnByaW1hcnlLZXkgPyByZWNbdGhpcy5ncmlkLnByaW1hcnlLZXldIDogcmVjO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfY2VsbF9ieV9rZXkocm93U2VsZWN0b3I6IGFueSwgZmllbGQ6IHN0cmluZyk6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRfcm93X2J5X2tleShyb3dTZWxlY3Rvcik7XG4gICAgICAgIGlmIChyb3cgJiYgcm93LmNlbGxzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm93LmNlbGxzLmZpbmQoKGNlbGwpID0+IGNlbGwuY29sdW1uLmZpZWxkID09PSBmaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X2NlbGxfYnlfaW5kZXgocm93SW5kZXg6IG51bWJlciwgY29sdW1uSUQ6IG51bWJlciB8IHN0cmluZyk6IENlbGxUeXBlIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRfcm93X2J5X2luZGV4KHJvd0luZGV4KTtcbiAgICAgICAgY29uc3QgaGFzQ2VsbHMgPSByb3cgJiYgcm93LmNlbGxzO1xuICAgICAgICBpZiAoaGFzQ2VsbHMgJiYgdHlwZW9mIGNvbHVtbklEID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIHJvdy5jZWxscy5maW5kKChjZWxsKSA9PiBjZWxsLmNvbHVtbi5pbmRleCA9PT0gY29sdW1uSUQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNDZWxscyAmJiB0eXBlb2YgY29sdW1uSUQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gcm93LmNlbGxzLmZpbmQoKGNlbGwpID0+IGNlbGwuY29sdW1uLmZpZWxkID09PSBjb2x1bW5JRCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfY2VsbF9ieV92aXNpYmxlX2luZGV4KHJvd0luZGV4OiBudW1iZXIsIGNvbHVtbkluZGV4OiBudW1iZXIpOiBDZWxsVHlwZSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0X3Jvd19ieV9pbmRleChyb3dJbmRleCk7XG4gICAgICAgIGlmIChyb3cgJiYgcm93LmNlbGxzKSB7XG4gICAgICAgICAgICByZXR1cm4gcm93LmNlbGxzLmZpbmQoKGNlbGwpID0+IGNlbGwudmlzaWJsZUNvbHVtbkluZGV4ID09PSBjb2x1bW5JbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlX2NlbGwoY2VsbDogSWd4Q2VsbCk6IElHcmlkRWRpdEV2ZW50QXJncyB7XG4gICAgICAgIGlmICghY2VsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBjZWxsLmNyZWF0ZUVkaXRFdmVudEFyZ3ModHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5ncmlkLnN1bW1hcnlTZXJ2aWNlLmNsZWFyU3VtbWFyeUNhY2hlKGFyZ3MpO1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRSb3dEYXRhKGNlbGwuaWQucm93SUQpO1xuICAgICAgICB0aGlzLnVwZGF0ZURhdGEodGhpcy5ncmlkLCBjZWxsLmlkLnJvd0lELCBkYXRhLCBjZWxsLnJvd0RhdGEsIHJldmVyc2VNYXBwZXIoY2VsbC5jb2x1bW4uZmllbGQsIGFyZ3MubmV3VmFsdWUpKTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5wcmltYXJ5S2V5ID09PSBjZWxsLmNvbHVtbi5maWVsZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmlzUm93U2VsZWN0ZWQoY2VsbC5pZC5yb3dJRCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdFJvdyhjZWxsLmlkLnJvd0lEKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuc2VsZWN0aW9uU2VydmljZS5zZWxlY3RSb3dCeUlkKGFyZ3MubmV3VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5oYXNTdW1tYXJpemVkQ29sdW1ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5zdW1tYXJ5U2VydmljZS5yZW1vdmVTdW1tYXJpZXMoY2VsbC5pZC5yb3dJRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdyaWQucm93RWRpdGFibGUgfHwgIXRoaXMuY3J1ZFNlcnZpY2Uucm93IHx8XG4gICAgICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLnJvdy5pZCAhPT0gY2VsbC5pZC5yb3dJRCB8fCAhdGhpcy5ncmlkLnRyYW5zYWN0aW9ucy5lbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQuc3VtbWFyeVNlcnZpY2UuY2xlYXJTdW1tYXJ5Q2FjaGUoYXJncyk7XG4gICAgICAgICAgICB0aGlzLmdyaWQucGlwZVRyaWdnZXIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IENSVUQgcmVmYWN0b3IgdG8gbm90IGVtaXQgZWRpdGluZyBldnRzLlxuICAgIHB1YmxpYyB1cGRhdGVfcm93KHJvdzogSWd4RWRpdFJvdywgdmFsdWU6IGFueSwgZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5ncmlkO1xuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IGdyaWQuc2VsZWN0aW9uU2VydmljZS5pc1Jvd1NlbGVjdGVkKHJvdy5pZCk7XG4gICAgICAgIGNvbnN0IHJvd0luRWRpdE1vZGUgPSB0aGlzLmNydWRTZXJ2aWNlLnJvdztcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0X2FsbF9kYXRhKGdyaWQudHJhbnNhY3Rpb25zLmVuYWJsZWQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZ2V0X3Jvd19pbmRleF9pbl9kYXRhKHJvdy5pZCwgZGF0YSk7XG4gICAgICAgIGNvbnN0IGhhc1N1bW1hcml6ZWQgPSBncmlkLmhhc1N1bW1hcml6ZWRDb2x1bW5zO1xuICAgICAgICB0aGlzLmNydWRTZXJ2aWNlLnVwZGF0ZVJvd0VkaXREYXRhKHJvdywgdmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSByb3cuY3JlYXRlRWRpdEV2ZW50QXJncyh0cnVlLCBldmVudCk7XG5cbiAgICAgICAgLy8gSWYgbm8gdmFsaWQgcm93IGlzIGZvdW5kXG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvd0luRWRpdE1vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0NoYW5nZXMgPSBncmlkLnRyYW5zYWN0aW9ucy5nZXRTdGF0ZShhcmdzLnJvd0lELCB0cnVlKTtcbiAgICAgICAgICAgIGdyaWQudHJhbnNhY3Rpb25zLmVuZFBlbmRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgaWYgKCFoYXNDaGFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWFyZ3MubmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc1N1bW1hcml6ZWQpIHtcbiAgICAgICAgICAgIGdyaWQuc3VtbWFyeVNlcnZpY2UucmVtb3ZlU3VtbWFyaWVzKGFyZ3Mucm93SUQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVEYXRhKGdyaWQsIHJvdy5pZCwgZGF0YVtpbmRleF0sIGFyZ3Mub2xkVmFsdWUsIGFyZ3MubmV3VmFsdWUpO1xuICAgICAgICBjb25zdCBuZXdJZCA9IGdyaWQucHJpbWFyeUtleSA/IGFyZ3MubmV3VmFsdWVbZ3JpZC5wcmltYXJ5S2V5XSA6IGFyZ3MubmV3VmFsdWU7XG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgZ3JpZC5zZWxlY3Rpb25TZXJ2aWNlLmRlc2VsZWN0Um93KHJvdy5pZCk7XG4gICAgICAgICAgICBncmlkLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0Um93QnlJZChuZXdJZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBzdXJlIHNlbGVjdGlvbiBpcyBoYW5kbGVkIHByaW9yIHRvIHVwZGF0aW5nIHRoZSByb3cuaWRcbiAgICAgICAgcm93LmlkID0gbmV3SWQ7XG4gICAgICAgIGlmIChoYXNTdW1tYXJpemVkKSB7XG4gICAgICAgICAgICBncmlkLnN1bW1hcnlTZXJ2aWNlLnJlbW92ZVN1bW1hcmllcyhuZXdJZCk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JpZC5waXBlVHJpZ2dlcisrO1xuXG4gICAgICAgIHJldHVybiBhcmdzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzb3J0KGV4cHJlc3Npb246IElTb3J0aW5nRXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgICBpZiAoZXhwcmVzc2lvbi5kaXIgPT09IFNvcnRpbmdEaXJlY3Rpb24uTm9uZSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVfZ3JvdXBpbmdfZXhwcmVzc2lvbihleHByZXNzaW9uLmZpZWxkTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29ydGluZ1N0YXRlID0gY2xvbmVBcnJheSh0aGlzLmdyaWQuc29ydGluZ0V4cHJlc3Npb25zKTtcbiAgICAgICAgdGhpcy5wcmVwYXJlX3NvcnRpbmdfZXhwcmVzc2lvbihbc29ydGluZ1N0YXRlXSwgZXhwcmVzc2lvbik7XG4gICAgICAgIHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMgPSBzb3J0aW5nU3RhdGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNvcnRfbXVsdGlwbGUoZXhwcmVzc2lvbnM6IElTb3J0aW5nRXhwcmVzc2lvbltdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNvcnRpbmdTdGF0ZSA9IGNsb25lQXJyYXkodGhpcy5ncmlkLnNvcnRpbmdFeHByZXNzaW9ucyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlYWNoIG9mIGV4cHJlc3Npb25zKSB7XG4gICAgICAgICAgICBpZiAoZWFjaC5kaXIgPT09IFNvcnRpbmdEaXJlY3Rpb24uTm9uZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlX2dyb3VwaW5nX2V4cHJlc3Npb24oZWFjaC5maWVsZE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlX3NvcnRpbmdfZXhwcmVzc2lvbihbc29ydGluZ1N0YXRlXSwgZWFjaCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyaWQuc29ydGluZ0V4cHJlc3Npb25zID0gc29ydGluZ1N0YXRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhcl9zb3J0KGZpZWxkTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHNvcnRpbmdTdGF0ZSA9IHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnM7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc29ydGluZ1N0YXRlLmZpbmRJbmRleCgoZXhwcikgPT4gZXhwci5maWVsZE5hbWUgPT09IGZpZWxkTmFtZSk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBzb3J0aW5nU3RhdGUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMgPSBzb3J0aW5nU3RhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJfZ3JvdXBieShfbmFtZT86IHN0cmluZyB8IEFycmF5PHN0cmluZz4pIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvdWxkX2FwcGx5X251bWJlcl9zdHlsZShjb2x1bW46IENvbHVtblR5cGUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLk51bWJlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X2RhdGEoKTogYW55W10ge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5ncmlkO1xuICAgICAgICBjb25zdCBkYXRhID0gZ3JpZC5kYXRhID8gZ3JpZC5kYXRhIDogW107XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfYWxsX2RhdGEoaW5jbHVkZVRyYW5zYWN0aW9ucyA9IGZhbHNlKTogYW55W10ge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5ncmlkO1xuICAgICAgICBsZXQgZGF0YSA9IGdyaWQgJiYgZ3JpZC5kYXRhID8gZ3JpZC5kYXRhIDogW107XG4gICAgICAgIGRhdGEgPSBpbmNsdWRlVHJhbnNhY3Rpb25zID8gZ3JpZC5kYXRhV2l0aEFkZGVkSW5UcmFuc2FjdGlvblJvd3MgOiBkYXRhO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X2ZpbHRlcmVkX2RhdGEoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLmZpbHRlcmVkRGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkUm93VG9EYXRhKHJvd0RhdGE6IGFueSwgX3BhcmVudElEPzogYW55KSB7XG4gICAgICAgIC8vIEFkZCByb3cgZ29lcyB0byB0cmFuc2FjdGlvbnMgYW5kIGlmIHJvd0VkaXRhYmxlIGlzIHByb3Blcmx5IGltcGxlbWVudGVkLCBhZGRlZCByb3dzIHdpbGwgZ28gdG8gcGVuZGluZyB0cmFuc2FjdGlvbnNcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSByb3cgaW4gZWRpdCAtID4gY29tbWl0IGFuZCBjbG9zZVxuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5ncmlkO1xuXG4gICAgICAgIGlmIChncmlkLnRyYW5zYWN0aW9ucy5lbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbklkID0gZ3JpZC5wcmltYXJ5S2V5ID8gcm93RGF0YVtncmlkLnByaW1hcnlLZXldIDogcm93RGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uOiBUcmFuc2FjdGlvbiA9IHsgaWQ6IHRyYW5zYWN0aW9uSWQsIHR5cGU6IFRyYW5zYWN0aW9uVHlwZS5BREQsIG5ld1ZhbHVlOiByb3dEYXRhIH07XG4gICAgICAgICAgICBncmlkLnRyYW5zYWN0aW9ucy5hZGQodHJhbnNhY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JpZC5kYXRhLnB1c2gocm93RGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlUm93RnJvbURhdGEocm93SUQ6IGFueSwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICAvLyAgaWYgdGhlcmUgaXMgYSByb3cgKGluZGV4ICE9PSAwKSBkZWxldGUgaXRcbiAgICAgICAgLy8gIGlmIHRoZXJlIGlzIGEgcm93IGluIEFERCBvciBVUERBVEUgc3RhdGUgY2hhbmdlIGl0J3Mgc3RhdGUgdG8gREVMRVRFXG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmIChncmlkLnRyYW5zYWN0aW9ucy5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb246IFRyYW5zYWN0aW9uID0geyBpZDogcm93SUQsIHR5cGU6IFRyYW5zYWN0aW9uVHlwZS5ERUxFVEUsIG5ld1ZhbHVlOiBudWxsIH07XG4gICAgICAgICAgICAgICAgZ3JpZC50cmFuc2FjdGlvbnMuYWRkKHRyYW5zYWN0aW9uLCBncmlkLmRhdGFbaW5kZXhdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ3JpZC5kYXRhLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZTogU3RhdGUgPSBncmlkLnRyYW5zYWN0aW9ucy5nZXRTdGF0ZShyb3dJRCk7XG4gICAgICAgICAgICBncmlkLnRyYW5zYWN0aW9ucy5hZGQoeyBpZDogcm93SUQsIHR5cGU6IFRyYW5zYWN0aW9uVHlwZS5ERUxFVEUsIG5ld1ZhbHVlOiBudWxsIH0sIHN0YXRlICYmIHN0YXRlLnJlY29yZFJlZik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlUm93QnlJZChyb3dJZDogYW55KTogYW55IHtcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXI7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldF9hbGxfZGF0YSgpO1xuICAgICAgICBpZiAoZ3JpZC5wcmltYXJ5S2V5KSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXNoYWRvd1xuICAgICAgICAgICAgaW5kZXggPSBkYXRhLm1hcCgocmVjb3JkKSA9PiByZWNvcmRbZ3JpZC5wcmltYXJ5S2V5XSkuaW5kZXhPZihyb3dJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleCA9IGRhdGEuaW5kZXhPZihyb3dJZCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhdGU6IFN0YXRlID0gZ3JpZC50cmFuc2FjdGlvbnMuZ2V0U3RhdGUocm93SWQpO1xuICAgICAgICBjb25zdCBoYXNSb3dJbk5vbkRlbGV0ZWRTdGF0ZSA9IHN0YXRlICYmIHN0YXRlLnR5cGUgIT09IFRyYW5zYWN0aW9uVHlwZS5ERUxFVEU7XG5cbiAgICAgICAgLy8gIGlmIHRoZXJlIGlzIGEgcm93IChpbmRleCAhPT0gLTEpIGFuZCB0aGUgd2UgaGF2ZSBjZWxsIGluIGVkaXQgbW9kZSBvbiBzYW1lIHJvdyBleGl0IGVkaXQgbW9kZVxuICAgICAgICAvLyAgaWYgdGhlcmUgaXMgbm8gcm93IChpbmRleCA9PT0gLTEpLCBidXQgdGhlcmUgaXMgYSByb3cgaW4gQUREIG9yIFVQREFURSBzdGF0ZSBkbyBhcyBhYm92ZVxuICAgICAgICAvLyAgT3RoZXJ3aXNlIGp1c3QgZXhpdCAtIHRoZXJlIGlzIG5vdGhpbmcgdG8gZGVsZXRlXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEgfHwgaGFzUm93SW5Ob25EZWxldGVkU3RhdGUpIHtcbiAgICAgICAgICAgIC8vIEFsd2F5cyBleGl0IGVkaXQgd2hlbiByb3cgaXMgZGVsZXRlZFxuICAgICAgICAgICAgdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkID0gZGF0YVtpbmRleF07XG4gICAgICAgIC8vIC8vICBUT0RPOiBzaG91bGQgd2UgZW1pdCB0aGlzIHdoZW4gY2FzY2FkZU9uRGVsZXRlIGlzIHRydWUgZm9yIGVhY2ggcm93PyE/IVxuICAgICAgICBncmlkLnJvd0RlbGV0ZWROb3RpZmllci5uZXh0KHsgZGF0YTogZGF0YVtpbmRleF0gfSk7XG5cbiAgICAgICAgdGhpcy5kZWxldGVSb3dGcm9tRGF0YShyb3dJZCwgaW5kZXgpO1xuXG4gICAgICAgIGlmIChncmlkLnNlbGVjdGlvblNlcnZpY2UuaXNSb3dTZWxlY3RlZChyb3dJZCkpIHtcbiAgICAgICAgICAgIGdyaWQuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdFJvdyhyb3dJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncmlkLnNlbGVjdGlvblNlcnZpY2UuY2xlYXJIZWFkZXJDQlN0YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JpZC5waXBlVHJpZ2dlcisrO1xuICAgICAgICBncmlkLm5vdGlmeUNoYW5nZXMoKTtcbiAgICAgICAgLy8gRGF0YSBuZWVkcyB0byBiZSByZWNhbGN1bGF0ZWQgaWYgdHJhbnNhY3Rpb25zIGFyZSBpbiBwbGFjZVxuICAgICAgICAvLyBJZiBubyB0cmFuc2FjdGlvbnMsIGBkYXRhYCB3aWxsIGJlIGEgcmVmZXJlbmNlIHRvIHRoZSBncmlkIGdldHRlciwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgc3RhbGVcbiAgICAgICAgY29uc3QgZGF0YUFmdGVyRGVsZXRlID0gZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCA/IGdyaWQuZGF0YVdpdGhBZGRlZEluVHJhbnNhY3Rpb25Sb3dzIDogZGF0YTtcbiAgICAgICAgZ3JpZC5yZWZyZXNoU2VhcmNoKCk7XG4gICAgICAgIGlmIChkYXRhQWZ0ZXJEZWxldGUubGVuZ3RoICUgZ3JpZC5wZXJQYWdlID09PSAwICYmIGRhdGFBZnRlckRlbGV0ZS5sZW5ndGggLyBncmlkLnBlclBhZ2UgLSAxIDwgZ3JpZC5wYWdlICYmIGdyaWQucGFnZSAhPT0gMCkge1xuICAgICAgICAgICAgZ3JpZC5wYWdlLS07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfcm93X2lkKHJvd0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5wcmltYXJ5S2V5ID8gcm93RGF0YVt0aGlzLmdyaWQucHJpbWFyeUtleV0gOiByb3dEYXRhO1xuICAgIH1cblxuICAgIHB1YmxpYyByb3dfZGVsZXRlZF90cmFuc2FjdGlvbihyb3dJRDogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIGlmICghZ3JpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXRlID0gZ3JpZC50cmFuc2FjdGlvbnMuZ2V0U3RhdGUocm93SUQpO1xuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuREVMRVRFO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRfcm93X2V4cGFuc2lvbl9zdGF0ZShyZWNvcmQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5ncmlkO1xuICAgICAgICBjb25zdCBzdGF0ZXMgPSBncmlkLmV4cGFuc2lvblN0YXRlcztcbiAgICAgICAgY29uc3Qgcm93SUQgPSBncmlkLnByaW1hcnlLZXkgPyByZWNvcmRbZ3JpZC5wcmltYXJ5S2V5XSA6IHJlY29yZDtcbiAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBzdGF0ZXMuZ2V0KHJvd0lEKTtcblxuICAgICAgICBpZiAoZXhwYW5kZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdyaWQuZ2V0RGVmYXVsdEV4cGFuZFN0YXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0X3Jvd19leHBhbnNpb25fc3RhdGUocm93SUQ6IGFueSwgZXhwYW5kZWQ6IGJvb2xlYW4sIGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgY29uc3QgZXhwYW5kZWRTdGF0ZXMgPSBncmlkLmV4cGFuc2lvblN0YXRlcztcblxuICAgICAgICBpZiAoIXRoaXMuYWxsb3dfZXhwYW5zaW9uX3N0YXRlX2NoYW5nZShyb3dJRCwgZXhwYW5kZWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcmdzOiBJUm93VG9nZ2xlRXZlbnRBcmdzID0ge1xuICAgICAgICAgICAgcm93SUQsXG4gICAgICAgICAgICBleHBhbmRlZCxcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgY2FuY2VsOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIGdyaWQucm93VG9nZ2xlLmVtaXQoYXJncyk7XG5cbiAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXhwYW5kZWRTdGF0ZXMuc2V0KHJvd0lELCBleHBhbmRlZCk7XG4gICAgICAgIGdyaWQuZXhwYW5zaW9uU3RhdGVzID0gZXhwYW5kZWRTdGF0ZXM7XG4gICAgICAgIC8vIEsuRC4gMjggRmViLCAyMDIyICMxMDYzNCBEb24ndCB0cmlnZ2VyIGVuZEVkaXQvY29tbWl0IHVwb24gcm93IGV4cGFuc2lvbiBzdGF0ZSBjaGFuZ2VcbiAgICAgICAgLy8gdGhpcy5jcnVkU2VydmljZS5lbmRFZGl0KGZhbHNlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X3JlY19ieV9pZChyb3dJRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnByaW1hcnlLZXkgPyB0aGlzLmdldFJvd0RhdGEocm93SUQpIDogcm93SUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHJlY29yZCBpbiB0aGUgZGF0YSB2aWV3IGJ5IHBrIG9yIC0xIGlmIG5vdCBmb3VuZCBvciBwcmltYXJ5S2V5IGlzIG5vdCBzZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGtcbiAgICAgKiBAcGFyYW0gZGF0YUNvbGxlY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0X3JlY19pbmRleF9ieV9pZChwazogc3RyaW5nIHwgbnVtYmVyLCBkYXRhQ29sbGVjdGlvbj86IGFueVtdKTogbnVtYmVyIHtcbiAgICAgICAgZGF0YUNvbGxlY3Rpb24gPSBkYXRhQ29sbGVjdGlvbiB8fCB0aGlzLmdyaWQuZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5wcmltYXJ5S2V5ID8gZGF0YUNvbGxlY3Rpb24uZmluZEluZGV4KHJlYyA9PiByZWNbdGhpcy5ncmlkLnByaW1hcnlLZXldID09PSBwaykgOiAtMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWxsb3dfZXhwYW5zaW9uX3N0YXRlX2NoYW5nZShyb3dJRCwgZXhwYW5kZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5leHBhbnNpb25TdGF0ZXMuZ2V0KHJvd0lEKSAhPT0gZXhwYW5kZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXBhcmVfc29ydGluZ19leHByZXNzaW9uKHN0YXRlQ29sbGVjdGlvbnM6IEFycmF5PEFycmF5PGFueT4+LCBleHByZXNzaW9uOiBJU29ydGluZ0V4cHJlc3Npb24pIHtcbiAgICAgICAgaWYgKGV4cHJlc3Npb24uZGlyID09PSBTb3J0aW5nRGlyZWN0aW9uLk5vbmUpIHtcbiAgICAgICAgICAgIHN0YXRlQ29sbGVjdGlvbnMuZm9yRWFjaChzdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgc3RhdGUuc3BsaWNlKHN0YXRlLmZpbmRJbmRleCgoZXhwcikgPT4gZXhwci5maWVsZE5hbWUgPT09IGV4cHJlc3Npb24uZmllbGROYW1lKSwgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgc3RhdGVzIGluIGVhY2ggY29sbGVjdGlvbiB3aXRoIHNhbWUgZmllbGRzIHBvaW50IHRvIHRoZSBzYW1lIG9iamVjdCByZWZlcmVuY2UuXG4gICAgICAgICAqIElmIHRoZSBkaWZmZXJlbnQgc3RhdGUgY29sbGVjdGlvbnMgcHJvdmlkZWQgaGF2ZSBkaWZmZXJlbnQgc2l6ZXMgd2UgbmVlZCB0byBnZXQgdGhlIGxhcmdlc3Qgb25lLlxuICAgICAgICAgKiBUaGF0IHdheSB3ZSBjYW4gZ2V0IHRoZSBzdGF0ZSByZWZlcmVuY2UgZnJvbSB0aGUgbGFyZ2VzdCBvbmUgdGhhdCBoYXMgdGhlIHNhbWUgZmllbGROYW1lIGFzIHRoZSBleHByZXNzaW9uIHRvIHByZXBhcmUuXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbWF4Q29sbGVjdGlvbiA9IHN0YXRlQ29sbGVjdGlvbnNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3RhdGVDb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG1heENvbGxlY3Rpb24ubGVuZ3RoIDwgc3RhdGVDb2xsZWN0aW9uc1tpXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXhDb2xsZWN0aW9uID0gc3RhdGVDb2xsZWN0aW9uc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXhFeHByID0gbWF4Q29sbGVjdGlvbi5maW5kKChleHByKSA9PiBleHByLmZpZWxkTmFtZSA9PT0gZXhwcmVzc2lvbi5maWVsZE5hbWUpO1xuXG4gICAgICAgIHN0YXRlQ29sbGVjdGlvbnMuZm9yRWFjaChjb2xsZWN0aW9uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG15RXhwciA9IGNvbGxlY3Rpb24uZmluZCgoZXhwcikgPT4gZXhwci5maWVsZE5hbWUgPT09IGV4cHJlc3Npb24uZmllbGROYW1lKTtcbiAgICAgICAgICAgIGlmICghbXlFeHByICYmICFtYXhFeHByKSB7XG4gICAgICAgICAgICAgICAgLy8gRXhwcmVzc2lvbiB3aXRoIHRoaXMgZmllbGROYW1lIGlzIG1pc3NpbmcgZnJvbSB0aGUgY3VycmVudCBhbmQgdGhlIG1heCBjb2xsZWN0aW9uLlxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucHVzaChleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW15RXhwciAmJiBtYXhFeHByKSB7XG4gICAgICAgICAgICAgICAgLy8gRXhwcmVzc2lvbiB3aXRoIHRoaXMgZmllbGROYW1lIGlzIG1pc3NpbmcgZnJvbSB0aGUgY3VycmVudCBhbmQgYnV0IHRoZSBtYXggY29sbGVjdGlvbiBoYXMuXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5wdXNoKG1heEV4cHIpO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24obWF4RXhwciwgZXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGNvbGxlY3Rpb24gaGFzIHRoZSBleHByZXNzaW9uIHNvIGp1c3QgdXBkYXRlIGl0LlxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24obXlFeHByLCBleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZV9ncm91cGluZ19leHByZXNzaW9uKF9maWVsZE5hbWUpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmlsdGVyRGF0YUJ5RXhwcmVzc2lvbnMoZXhwcmVzc2lvbnNUcmVlOiBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKTogYW55W10ge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZ2V0X2FsbF9kYXRhKCk7XG5cbiAgICAgICAgaWYgKGV4cHJlc3Npb25zVHJlZS5maWx0ZXJpbmdPcGVyYW5kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0geyBleHByZXNzaW9uc1RyZWUsIHN0cmF0ZWd5OiB0aGlzLmdyaWQuZmlsdGVyU3RyYXRlZ3kgfTtcbiAgICAgICAgICAgIGRhdGEgPSBGaWx0ZXJVdGlsLmZpbHRlcihjbG9uZUFycmF5KGRhdGEpLCBzdGF0ZSwgdGhpcy5ncmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHB1YmxpYyBzb3J0RGF0YUJ5RXhwcmVzc2lvbnMoZGF0YTogYW55W10sIGV4cHJlc3Npb25zOiBJU29ydGluZ0V4cHJlc3Npb25bXSkge1xuICAgICAgICByZXR1cm4gRGF0YVV0aWwuc29ydChjbG9uZUFycmF5KGRhdGEpLCBleHByZXNzaW9ucywgdGhpcy5ncmlkLnNvcnRTdHJhdGVneSwgdGhpcy5ncmlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHJlbGF0ZWQgcm93IG9mIHByb3ZpZGVkIGdyaWQncyBkYXRhIHNvdXJjZSB3aXRoIHByb3ZpZGVkIG5ldyByb3cgdmFsdWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBncmlkIEdyaWQgdG8gdXBkYXRlIGRhdGEgZm9yXG4gICAgICogQHBhcmFtIHJvd0lEIElEIG9mIHRoZSByb3cgdG8gdXBkYXRlXG4gICAgICogQHBhcmFtIHJvd1ZhbHVlSW5EYXRhU291cmNlIEluaXRpYWwgdmFsdWUgb2YgdGhlIHJvdyBhcyBpdCBpcyBpbiBkYXRhIHNvdXJjZVxuICAgICAqIEBwYXJhbSByb3dDdXJyZW50VmFsdWUgQ3VycmVudCB2YWx1ZSBvZiB0aGUgcm93IGFzIGl0IGlzIHdpdGggYXBwbGllZCBwcmV2aW91cyB0cmFuc2FjdGlvbnNcbiAgICAgKiBAcGFyYW0gcm93TmV3VmFsdWUgTmV3IHZhbHVlIG9mIHRoZSByb3dcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlRGF0YShncmlkLCByb3dJRCwgcm93VmFsdWVJbkRhdGFTb3VyY2U6IGFueSwgcm93Q3VycmVudFZhbHVlOiBhbnksIHJvd05ld1ZhbHVlOiB7IFt4OiBzdHJpbmddOiBhbnkgfSkge1xuICAgICAgICBpZiAoZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCkge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb246IFRyYW5zYWN0aW9uID0ge1xuICAgICAgICAgICAgICAgIGlkOiByb3dJRCxcbiAgICAgICAgICAgICAgICB0eXBlOiBUcmFuc2FjdGlvblR5cGUuVVBEQVRFLFxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlOiByb3dOZXdWYWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdyaWQudHJhbnNhY3Rpb25zLmFkZCh0cmFuc2FjdGlvbiwgcm93Q3VycmVudFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lcmdlT2JqZWN0cyhyb3dWYWx1ZUluRGF0YVNvdXJjZSwgcm93TmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdXBkYXRlX3Jvd19pbl9hcnJheSh2YWx1ZTogYW55LCByb3dJRDogYW55LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIGdyaWQuZGF0YVtpbmRleF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U29ydFN0cmF0ZWd5UGVyQ29sdW1uKGZpZWxkTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldF9jb2x1bW5fYnlfbmFtZShmaWVsZE5hbWUpID9cbiAgICAgICAgICAgIHRoaXMuZ2V0X2NvbHVtbl9ieV9uYW1lKGZpZWxkTmFtZSkuc29ydFN0cmF0ZWd5IDogdW5kZWZpbmVkO1xuICAgIH1cblxufVxuIl19