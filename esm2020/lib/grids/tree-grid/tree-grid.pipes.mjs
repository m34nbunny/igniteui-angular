import { Inject, Pipe } from '@angular/core';
import { cloneArray, cloneHierarchicalArray } from '../../core/utils';
import { DataUtil } from '../../data-operations/data-util';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { GridPagingMode } from '../common/enums';
import { TransactionType } from '../../services/public_api';
import { IgxAddRow } from '../common/crud.service';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxTreeGridHierarchizingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, primaryKey, foreignKey, childDataKey, _) {
        let hierarchicalRecords = [];
        const treeGridRecordsMap = new Map();
        const flatData = [];
        if (primaryKey && foreignKey) {
            hierarchicalRecords = this.hierarchizeFlatData(collection, primaryKey, foreignKey, treeGridRecordsMap, flatData);
        }
        else if (childDataKey) {
            hierarchicalRecords = this.hierarchizeRecursive(collection, primaryKey, childDataKey, undefined, flatData, 0, treeGridRecordsMap);
        }
        this.grid.flatData = this.grid.transactions.enabled ?
            flatData.filter(rec => {
                const state = this.grid.transactions.getState(this.getRowID(primaryKey, rec));
                return !state || state.type !== TransactionType.ADD;
            }) : flatData;
        this.grid.records = treeGridRecordsMap;
        this.grid.rootRecords = hierarchicalRecords;
        return hierarchicalRecords;
    }
    getRowID(primaryKey, rowData) {
        return primaryKey ? rowData[primaryKey] : rowData;
    }
    hierarchizeFlatData(collection, primaryKey, foreignKey, map, flatData) {
        const result = [];
        const missingParentRecords = [];
        collection.forEach(row => {
            const record = {
                key: this.getRowID(primaryKey, row),
                data: row,
                children: []
            };
            const parent = map.get(row[foreignKey]);
            if (parent) {
                record.parent = parent;
                parent.children.push(record);
            }
            else {
                missingParentRecords.push(record);
            }
            map.set(row[primaryKey], record);
        });
        missingParentRecords.forEach(record => {
            const parent = map.get(record.data[foreignKey]);
            if (parent) {
                record.parent = parent;
                parent.children.push(record);
            }
            else {
                result.push(record);
            }
        });
        this.setIndentationLevels(result, 0, flatData);
        return result;
    }
    setIndentationLevels(collection, indentationLevel, flatData) {
        for (const record of collection) {
            record.level = indentationLevel;
            record.expanded = this.grid.gridAPI.get_row_expansion_state(record);
            flatData.push(record.data);
            if (record.children && record.children.length > 0) {
                this.setIndentationLevels(record.children, indentationLevel + 1, flatData);
            }
        }
    }
    hierarchizeRecursive(collection, primaryKey, childDataKey, parent, flatData, indentationLevel, map) {
        const result = [];
        for (const item of collection) {
            const record = {
                key: this.getRowID(primaryKey, item),
                data: item,
                parent,
                level: indentationLevel
            };
            record.expanded = this.grid.gridAPI.get_row_expansion_state(record);
            flatData.push(item);
            map.set(record.key, record);
            record.children = item[childDataKey] ?
                this.hierarchizeRecursive(item[childDataKey], primaryKey, childDataKey, record, flatData, indentationLevel + 1, map) :
                undefined;
            result.push(record);
        }
        return result;
    }
}
IgxTreeGridHierarchizingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridHierarchizingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridHierarchizingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridHierarchizingPipe, name: "treeGridHierarchizing" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridHierarchizingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridHierarchizing' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * @hidden
 */
export class IgxTreeGridFlatteningPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, expandedLevels, expandedStates, _) {
        const data = [];
        this.grid.processedRootRecords = collection;
        this.grid.processedRecords = new Map();
        this.getFlatDataRecursive(collection, data, expandedLevels, expandedStates, true);
        this.grid.processedExpandedFlatData = data.map(r => r.data);
        return data;
    }
    getFlatDataRecursive(collection, data, expandedLevels, expandedStates, parentExpanded) {
        if (!collection || !collection.length) {
            return;
        }
        for (const hierarchicalRecord of collection) {
            if (parentExpanded) {
                data.push(hierarchicalRecord);
            }
            hierarchicalRecord.expanded = this.grid.gridAPI.get_row_expansion_state(hierarchicalRecord);
            this.updateNonProcessedRecordExpansion(this.grid, hierarchicalRecord);
            this.grid.processedRecords.set(hierarchicalRecord.key, hierarchicalRecord);
            this.getFlatDataRecursive(hierarchicalRecord.children, data, expandedLevels, expandedStates, parentExpanded && hierarchicalRecord.expanded);
        }
    }
    updateNonProcessedRecordExpansion(grid, record) {
        const rec = grid.records.get(record.key);
        rec.expanded = record.expanded;
    }
}
IgxTreeGridFlatteningPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridFlatteningPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridFlatteningPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridFlatteningPipe, name: "treeGridFlattening" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridFlatteningPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridFlattening' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/** @hidden */
export class IgxTreeGridSortingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(hierarchicalData, expressions, sorting, _, pinned) {
        let result;
        if (!expressions.length) {
            result = hierarchicalData;
        }
        else {
            result = DataUtil.treeGridSort(hierarchicalData, expressions, sorting, null, this.grid);
        }
        const filteredSortedData = [];
        this.flattenTreeGridRecords(result, filteredSortedData);
        this.grid.setFilteredSortedData(filteredSortedData, pinned);
        return result;
    }
    flattenTreeGridRecords(records, flatData) {
        if (records && records.length) {
            for (const record of records) {
                flatData.push(record.data);
                this.flattenTreeGridRecords(record.children, flatData);
            }
        }
    }
}
IgxTreeGridSortingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridSortingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridSortingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridSortingPipe, name: "treeGridSorting" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridSortingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridSorting' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/** @hidden */
export class IgxTreeGridPagingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, page = 0, perPage = 15, _) {
        if (!this.grid.paginator || this.grid.pagingMode !== GridPagingMode.Local) {
            return collection;
        }
        const len = this.grid._totalRecords >= 0 ? this.grid._totalRecords : collection.length;
        const totalPages = Math.ceil(len / perPage);
        const state = {
            index: (totalPages > 0 && page >= totalPages) ? totalPages - 1 : page,
            recordsPerPage: perPage
        };
        const result = DataUtil.page(cloneArray(collection), state, len);
        this.grid.pagingState = state;
        this.grid.paginator.page = state.index;
        return result;
    }
}
IgxTreeGridPagingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridPagingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridPagingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridPagingPipe, name: "treeGridPaging" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridPagingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridPaging' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/** @hidden */
export class IgxTreeGridTransactionPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, _) {
        if (this.grid.transactions.enabled) {
            const aggregatedChanges = this.grid.transactions.getAggregatedChanges(true);
            if (aggregatedChanges.length > 0) {
                const primaryKey = this.grid.primaryKey;
                if (!primaryKey) {
                    return collection;
                }
                const foreignKey = this.grid.foreignKey;
                const childDataKey = this.grid.childDataKey;
                if (foreignKey) {
                    const flatDataClone = cloneArray(collection);
                    return DataUtil.mergeTransactions(flatDataClone, aggregatedChanges, this.grid.primaryKey, this.grid.dataCloneStrategy);
                }
                else if (childDataKey) {
                    const hierarchicalDataClone = cloneHierarchicalArray(collection, childDataKey);
                    return DataUtil.mergeHierarchicalTransactions(hierarchicalDataClone, aggregatedChanges, childDataKey, this.grid.primaryKey, this.grid.dataCloneStrategy);
                }
            }
        }
        return collection;
    }
}
IgxTreeGridTransactionPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridTransactionPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridTransactionPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridTransactionPipe, name: "treeGridTransaction" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridTransactionPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridTransaction' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * This pipe maps the original record to ITreeGridRecord format used in TreeGrid.
 */
export class IgxTreeGridNormalizeRecordsPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(_, __) {
        const primaryKey = this.grid.primaryKey;
        // using flattened data because origin data may be hierarchical.
        const flatData = this.grid.flatData;
        const res = flatData.map(rec => ({
            rowID: this.grid.primaryKey ? rec[primaryKey] : rec,
            data: rec,
            level: 0,
            children: []
        }));
        return res;
    }
}
IgxTreeGridNormalizeRecordsPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridNormalizeRecordsPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridNormalizeRecordsPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridNormalizeRecordsPipe, name: "treeGridNormalizeRecord" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridNormalizeRecordsPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridNormalizeRecord' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
export class IgxTreeGridAddRowPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, isPinned = false, _pipeTrigger) {
        if (!this.grid.rowEditable || !this.grid.crudService.row || this.grid.crudService.row.getClassName() !== IgxAddRow.name ||
            !this.grid.gridAPI.crudService.addRowParent || isPinned !== this.grid.gridAPI.crudService.addRowParent.isPinned) {
            return collection;
        }
        const copy = collection.slice(0);
        const rec = this.grid.crudService.row.recordRef;
        copy.splice(this.grid.crudService.row.index, 0, rec);
        this.grid.records.set(rec.key, rec);
        return copy;
    }
}
IgxTreeGridAddRowPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridAddRowPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxTreeGridAddRowPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridAddRowPipe, name: "treeGridAddRow" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridAddRowPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridAddRow' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ncmlkLnBpcGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL3RyZWUtZ3JpZC90cmVlLWdyaWQucGlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBRSxVQUFVLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFM0QsT0FBTyxFQUFZLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztBQUluRDs7R0FFRztBQUVILE1BQU0sT0FBTyw0QkFBNEI7SUFFckMsWUFBMkMsSUFBYztRQUFkLFNBQUksR0FBSixJQUFJLENBQVU7SUFBSSxDQUFDO0lBRXZELFNBQVMsQ0FBQyxVQUFpQixFQUFFLFVBQWtCLEVBQUUsVUFBa0IsRUFBRSxZQUFvQixFQUFFLENBQVM7UUFDdkcsSUFBSSxtQkFBbUIsR0FBc0IsRUFBRSxDQUFDO1FBQ2hELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFDM0QsTUFBTSxRQUFRLEdBQVUsRUFBRSxDQUFDO1FBRTNCLElBQUksVUFBVSxJQUFJLFVBQVUsRUFBRTtZQUMxQixtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDcEg7YUFBTSxJQUFJLFlBQVksRUFBRTtZQUNyQixtQkFBbUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUMzRixRQUFRLEVBQUUsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUUsT0FBTyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztRQUM1QyxPQUFPLG1CQUFtQixDQUFDO0lBQy9CLENBQUM7SUFFTyxRQUFRLENBQUMsVUFBZSxFQUFFLE9BQVk7UUFDMUMsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3RELENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxVQUFpQixFQUFFLFVBQWtCLEVBQUUsVUFBa0IsRUFDakYsR0FBOEIsRUFBRSxRQUFlO1FBRS9DLE1BQU0sTUFBTSxHQUFzQixFQUFFLENBQUM7UUFDckMsTUFBTSxvQkFBb0IsR0FBc0IsRUFBRSxDQUFDO1FBQ25ELFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxNQUFNLEdBQW9CO2dCQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsR0FBRztnQkFDVCxRQUFRLEVBQUUsRUFBRTthQUNmLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksTUFBTSxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO2dCQUN2QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoQztpQkFBTTtnQkFDSCxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckM7WUFFRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQyxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLE1BQU0sRUFBRTtnQkFDUixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztnQkFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDaEM7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN2QjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFL0MsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLG9CQUFvQixDQUFDLFVBQTZCLEVBQUUsZ0JBQXdCLEVBQUUsUUFBZTtRQUNqRyxLQUFLLE1BQU0sTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUM3QixNQUFNLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0IsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzlFO1NBQ0o7SUFDTCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsVUFBaUIsRUFBRSxVQUFrQixFQUFFLFlBQW9CLEVBQ3BGLE1BQXVCLEVBQUUsUUFBZSxFQUFFLGdCQUF3QixFQUFFLEdBQThCO1FBQ2xHLE1BQU0sTUFBTSxHQUFzQixFQUFFLENBQUM7UUFFckMsS0FBSyxNQUFNLElBQUksSUFBSSxVQUFVLEVBQUU7WUFDM0IsTUFBTSxNQUFNLEdBQW9CO2dCQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO2dCQUNwQyxJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNO2dCQUNOLEtBQUssRUFBRSxnQkFBZ0I7YUFDMUIsQ0FBQztZQUNGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RILFNBQVMsQ0FBQztZQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOzt5SEFwR1EsNEJBQTRCLGtCQUVqQixhQUFhO3VIQUZ4Qiw0QkFBNEI7MkZBQTVCLDRCQUE0QjtrQkFEeEMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRTs7MEJBR3RCLE1BQU07MkJBQUMsYUFBYTs7QUFxR3JDOztHQUVHO0FBRUgsTUFBTSxPQUFPLHlCQUF5QjtJQUVsQyxZQUEyQyxJQUFjO1FBQWQsU0FBSSxHQUFKLElBQUksQ0FBVTtJQUFJLENBQUM7SUFFdkQsU0FBUyxDQUFDLFVBQTZCLEVBQzFDLGNBQXNCLEVBQUUsY0FBaUMsRUFBRSxDQUFTO1FBRXBFLE1BQU0sSUFBSSxHQUFzQixFQUFFLENBQUM7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztRQUU3RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxGLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1RCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sb0JBQW9CLENBQUMsVUFBNkIsRUFBRSxJQUF1QixFQUMvRSxjQUFzQixFQUFFLGNBQWlDLEVBQUUsY0FBdUI7UUFDbEYsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDbkMsT0FBTztTQUNWO1FBRUQsS0FBSyxNQUFNLGtCQUFrQixJQUFJLFVBQVUsRUFBRTtZQUN6QyxJQUFJLGNBQWMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2FBQ2pDO1lBRUQsa0JBQWtCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFNUYsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUV0RSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUUzRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQ3ZFLGNBQWMsRUFBRSxjQUFjLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdEU7SUFDTCxDQUFDO0lBRU8saUNBQWlDLENBQUMsSUFBYyxFQUFFLE1BQXVCO1FBQzdFLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxHQUFHLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQzs7c0hBNUNRLHlCQUF5QixrQkFFZCxhQUFhO29IQUZ4Qix5QkFBeUI7MkZBQXpCLHlCQUF5QjtrQkFEckMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRTs7MEJBR25CLE1BQU07MkJBQUMsYUFBYTs7QUE2Q3JDLGNBQWM7QUFFZCxNQUFNLE9BQU8sc0JBQXNCO0lBRS9CLFlBQTJDLElBQWM7UUFBZCxTQUFJLEdBQUosSUFBSSxDQUFVO0lBQUksQ0FBQztJQUV2RCxTQUFTLENBQ1osZ0JBQW1DLEVBQ25DLFdBQWlDLEVBQ2pDLE9BQTZCLEVBQzdCLENBQVMsRUFDVCxNQUFnQjtRQUVoQixJQUFJLE1BQXlCLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDckIsTUFBTSxHQUFHLGdCQUFnQixDQUFDO1NBQzdCO2FBQU07WUFDSCxNQUFNLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0Y7UUFFRCxNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU1RCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU8sc0JBQXNCLENBQUMsT0FBMEIsRUFBRSxRQUFlO1FBQ3RFLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDM0IsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMxRDtTQUNKO0lBQ0wsQ0FBQzs7bUhBaENRLHNCQUFzQixrQkFFWCxhQUFhO2lIQUZ4QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTs7MEJBR2hCLE1BQU07MkJBQUMsYUFBYTs7QUFpQ3JDLGNBQWM7QUFFZCxNQUFNLE9BQU8scUJBQXFCO0lBRTlCLFlBQTJDLElBQWM7UUFBZCxTQUFJLEdBQUosSUFBSSxDQUFVO0lBQUksQ0FBQztJQUV2RCxTQUFTLENBQUMsVUFBNkIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsQ0FBUztRQUM3RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssY0FBYyxDQUFDLEtBQUssRUFBRTtZQUN2RSxPQUFPLFVBQVUsQ0FBQztTQUNyQjtRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDdkYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFNUMsTUFBTSxLQUFLLEdBQUc7WUFDVixLQUFLLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUNyRSxjQUFjLEVBQUUsT0FBTztTQUMxQixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFdkMsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7a0hBdEJRLHFCQUFxQixrQkFFVixhQUFhO2dIQUZ4QixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTs7MEJBR2YsTUFBTTsyQkFBQyxhQUFhOztBQXNCckMsY0FBYztBQUVkLE1BQU0sT0FBTywwQkFBMEI7SUFHbkMsWUFBMkMsSUFBYztRQUFkLFNBQUksR0FBSixJQUFJLENBQVU7SUFBSSxDQUFDO0lBRXZELFNBQVMsQ0FBQyxVQUFpQixFQUFFLENBQVM7UUFFekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDaEMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RSxJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNiLE9BQU8sVUFBVSxDQUFDO2lCQUNyQjtnQkFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDeEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBRTVDLElBQUksVUFBVSxFQUFFO29CQUNaLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxRQUFRLENBQUMsaUJBQWlCLENBQzdCLGFBQWEsRUFDYixpQkFBaUIsRUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDcEM7cUJBQU0sSUFBSSxZQUFZLEVBQUU7b0JBQ3JCLE1BQU0scUJBQXFCLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUMvRSxPQUFPLFFBQVEsQ0FBQyw2QkFBNkIsQ0FDekMscUJBQXFCLEVBQ3JCLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQzFCLENBQUM7aUJBQ1Q7YUFDSjtTQUNKO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQzs7dUhBdENRLDBCQUEwQixrQkFHZixhQUFhO3FIQUh4QiwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFEdEMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRTs7MEJBSXBCLE1BQU07MkJBQUMsYUFBYTs7QUFzQ3JDOztHQUVHO0FBRUgsTUFBTSxPQUFPLCtCQUErQjtJQUV4QyxZQUEyQyxJQUFjO1FBQWQsU0FBSSxHQUFKLElBQUksQ0FBVTtJQUFJLENBQUM7SUFFdkQsU0FBUyxDQUFDLENBQVEsRUFBRSxFQUFVO1FBQ2pDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3hDLGdFQUFnRTtRQUNoRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNwQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQy9CLENBQUM7WUFDRyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRztZQUNuRCxJQUFJLEVBQUUsR0FBRztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLEVBQUU7U0FDZixDQUFDLENBQUMsQ0FBQztRQUNKLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7NEhBaEJRLCtCQUErQixrQkFFcEIsYUFBYTswSEFGeEIsK0JBQStCOzJGQUEvQiwrQkFBK0I7a0JBRDNDLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUU7OzBCQUd4QixNQUFNOzJCQUFDLGFBQWE7O0FBa0JyQyxNQUFNLE9BQU8scUJBQXFCO0lBRTlCLFlBQTJDLElBQWM7UUFBZCxTQUFJLEdBQUosSUFBSSxDQUFVO0lBQUksQ0FBQztJQUV2RCxTQUFTLENBQUMsVUFBZSxFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsWUFBb0I7UUFDcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsS0FBSyxTQUFTLENBQUMsSUFBSTtZQUNuSCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO1lBQ2pILE9BQU8sVUFBVSxDQUFDO1NBQ3JCO1FBQ0QsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLEdBQUcsR0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFpQixDQUFDLFNBQVMsQ0FBQztRQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O2tIQWRRLHFCQUFxQixrQkFFVixhQUFhO2dIQUZ4QixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTs7MEJBR2YsTUFBTTsyQkFBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjbG9uZUFycmF5LCBjbG9uZUhpZXJhcmNoaWNhbEFycmF5IH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBEYXRhVXRpbCB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9kYXRhLXV0aWwnO1xuaW1wb3J0IHsgSVRyZWVHcmlkUmVjb3JkIH0gZnJvbSAnLi90cmVlLWdyaWQuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBHcmlkVHlwZSwgSUdYX0dSSURfQkFTRSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBHcmlkUGFnaW5nTW9kZSB9IGZyb20gJy4uL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvblR5cGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneEFkZFJvdyB9IGZyb20gJy4uL2NvbW1vbi9jcnVkLnNlcnZpY2UnO1xuaW1wb3J0IHsgSVNvcnRpbmdFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgSUdyaWRTb3J0aW5nU3RyYXRlZ3kgfSBmcm9tICcuLi9jb21tb24vc3RyYXRlZ3knO1xuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQFBpcGUoeyBuYW1lOiAndHJlZUdyaWRIaWVyYXJjaGl6aW5nJyB9KVxuZXhwb3J0IGNsYXNzIElneFRyZWVHcmlkSGllcmFyY2hpemluZ1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoSUdYX0dSSURfQkFTRSkgcHJpdmF0ZSBncmlkOiBHcmlkVHlwZSkgeyB9XG5cbiAgICBwdWJsaWMgdHJhbnNmb3JtKGNvbGxlY3Rpb246IGFueVtdLCBwcmltYXJ5S2V5OiBzdHJpbmcsIGZvcmVpZ25LZXk6IHN0cmluZywgY2hpbGREYXRhS2V5OiBzdHJpbmcsIF86IG51bWJlcik6IElUcmVlR3JpZFJlY29yZFtdIHtcbiAgICAgICAgbGV0IGhpZXJhcmNoaWNhbFJlY29yZHM6IElUcmVlR3JpZFJlY29yZFtdID0gW107XG4gICAgICAgIGNvbnN0IHRyZWVHcmlkUmVjb3Jkc01hcCA9IG5ldyBNYXA8YW55LCBJVHJlZUdyaWRSZWNvcmQ+KCk7XG4gICAgICAgIGNvbnN0IGZsYXREYXRhOiBhbnlbXSA9IFtdO1xuXG4gICAgICAgIGlmIChwcmltYXJ5S2V5ICYmIGZvcmVpZ25LZXkpIHtcbiAgICAgICAgICAgIGhpZXJhcmNoaWNhbFJlY29yZHMgPSB0aGlzLmhpZXJhcmNoaXplRmxhdERhdGEoY29sbGVjdGlvbiwgcHJpbWFyeUtleSwgZm9yZWlnbktleSwgdHJlZUdyaWRSZWNvcmRzTWFwLCBmbGF0RGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGREYXRhS2V5KSB7XG4gICAgICAgICAgICBoaWVyYXJjaGljYWxSZWNvcmRzID0gdGhpcy5oaWVyYXJjaGl6ZVJlY3Vyc2l2ZShjb2xsZWN0aW9uLCBwcmltYXJ5S2V5LCBjaGlsZERhdGFLZXksIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmbGF0RGF0YSwgMCwgdHJlZUdyaWRSZWNvcmRzTWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JpZC5mbGF0RGF0YSA9IHRoaXMuZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCA/XG4gICAgICAgICAgICBmbGF0RGF0YS5maWx0ZXIocmVjID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZ3JpZC50cmFuc2FjdGlvbnMuZ2V0U3RhdGUodGhpcy5nZXRSb3dJRChwcmltYXJ5S2V5LCByZWMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXN0YXRlIHx8IHN0YXRlLnR5cGUgIT09IFRyYW5zYWN0aW9uVHlwZS5BREQ7XG4gICAgICAgICAgICB9KSA6IGZsYXREYXRhO1xuICAgICAgICB0aGlzLmdyaWQucmVjb3JkcyA9IHRyZWVHcmlkUmVjb3Jkc01hcDtcbiAgICAgICAgdGhpcy5ncmlkLnJvb3RSZWNvcmRzID0gaGllcmFyY2hpY2FsUmVjb3JkcztcbiAgICAgICAgcmV0dXJuIGhpZXJhcmNoaWNhbFJlY29yZHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSb3dJRChwcmltYXJ5S2V5OiBhbnksIHJvd0RhdGE6IGFueSkge1xuICAgICAgICByZXR1cm4gcHJpbWFyeUtleSA/IHJvd0RhdGFbcHJpbWFyeUtleV0gOiByb3dEYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGllcmFyY2hpemVGbGF0RGF0YShjb2xsZWN0aW9uOiBhbnlbXSwgcHJpbWFyeUtleTogc3RyaW5nLCBmb3JlaWduS2V5OiBzdHJpbmcsXG4gICAgICAgIG1hcDogTWFwPGFueSwgSVRyZWVHcmlkUmVjb3JkPiwgZmxhdERhdGE6IGFueVtdKTpcbiAgICAgICAgSVRyZWVHcmlkUmVjb3JkW10ge1xuICAgICAgICBjb25zdCByZXN1bHQ6IElUcmVlR3JpZFJlY29yZFtdID0gW107XG4gICAgICAgIGNvbnN0IG1pc3NpbmdQYXJlbnRSZWNvcmRzOiBJVHJlZUdyaWRSZWNvcmRbXSA9IFtdO1xuICAgICAgICBjb2xsZWN0aW9uLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZDogSVRyZWVHcmlkUmVjb3JkID0ge1xuICAgICAgICAgICAgICAgIGtleTogdGhpcy5nZXRSb3dJRChwcmltYXJ5S2V5LCByb3cpLFxuICAgICAgICAgICAgICAgIGRhdGE6IHJvdyxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBtYXAuZ2V0KHJvd1tmb3JlaWduS2V5XSk7XG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaXNzaW5nUGFyZW50UmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hcC5zZXQocm93W3ByaW1hcnlLZXldLCByZWNvcmQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtaXNzaW5nUGFyZW50UmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBtYXAuZ2V0KHJlY29yZC5kYXRhW2ZvcmVpZ25LZXldKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZWNvcmQucGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0SW5kZW50YXRpb25MZXZlbHMocmVzdWx0LCAwLCBmbGF0RGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEluZGVudGF0aW9uTGV2ZWxzKGNvbGxlY3Rpb246IElUcmVlR3JpZFJlY29yZFtdLCBpbmRlbnRhdGlvbkxldmVsOiBudW1iZXIsIGZsYXREYXRhOiBhbnlbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IHJlY29yZCBvZiBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICByZWNvcmQubGV2ZWwgPSBpbmRlbnRhdGlvbkxldmVsO1xuICAgICAgICAgICAgcmVjb3JkLmV4cGFuZGVkID0gdGhpcy5ncmlkLmdyaWRBUEkuZ2V0X3Jvd19leHBhbnNpb25fc3RhdGUocmVjb3JkKTtcbiAgICAgICAgICAgIGZsYXREYXRhLnB1c2gocmVjb3JkLmRhdGEpO1xuXG4gICAgICAgICAgICBpZiAocmVjb3JkLmNoaWxkcmVuICYmIHJlY29yZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbmRlbnRhdGlvbkxldmVscyhyZWNvcmQuY2hpbGRyZW4sIGluZGVudGF0aW9uTGV2ZWwgKyAxLCBmbGF0RGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZXJhcmNoaXplUmVjdXJzaXZlKGNvbGxlY3Rpb246IGFueVtdLCBwcmltYXJ5S2V5OiBzdHJpbmcsIGNoaWxkRGF0YUtleTogc3RyaW5nLFxuICAgICAgICBwYXJlbnQ6IElUcmVlR3JpZFJlY29yZCwgZmxhdERhdGE6IGFueVtdLCBpbmRlbnRhdGlvbkxldmVsOiBudW1iZXIsIG1hcDogTWFwPGFueSwgSVRyZWVHcmlkUmVjb3JkPik6IElUcmVlR3JpZFJlY29yZFtdIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJVHJlZUdyaWRSZWNvcmRbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmQ6IElUcmVlR3JpZFJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICBrZXk6IHRoaXMuZ2V0Um93SUQocHJpbWFyeUtleSwgaXRlbSksXG4gICAgICAgICAgICAgICAgZGF0YTogaXRlbSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgbGV2ZWw6IGluZGVudGF0aW9uTGV2ZWxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWNvcmQuZXhwYW5kZWQgPSB0aGlzLmdyaWQuZ3JpZEFQSS5nZXRfcm93X2V4cGFuc2lvbl9zdGF0ZShyZWNvcmQpO1xuICAgICAgICAgICAgZmxhdERhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgIG1hcC5zZXQocmVjb3JkLmtleSwgcmVjb3JkKTtcbiAgICAgICAgICAgIHJlY29yZC5jaGlsZHJlbiA9IGl0ZW1bY2hpbGREYXRhS2V5XSA/XG4gICAgICAgICAgICAgICAgdGhpcy5oaWVyYXJjaGl6ZVJlY3Vyc2l2ZShpdGVtW2NoaWxkRGF0YUtleV0sIHByaW1hcnlLZXksIGNoaWxkRGF0YUtleSwgcmVjb3JkLCBmbGF0RGF0YSwgaW5kZW50YXRpb25MZXZlbCArIDEsIG1hcCkgOlxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHJlY29yZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBQaXBlKHsgbmFtZTogJ3RyZWVHcmlkRmxhdHRlbmluZycgfSlcbmV4cG9ydCBjbGFzcyBJZ3hUcmVlR3JpZEZsYXR0ZW5pbmdQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KElHWF9HUklEX0JBU0UpIHByaXZhdGUgZ3JpZDogR3JpZFR5cGUpIHsgfVxuXG4gICAgcHVibGljIHRyYW5zZm9ybShjb2xsZWN0aW9uOiBJVHJlZUdyaWRSZWNvcmRbXSxcbiAgICAgICAgZXhwYW5kZWRMZXZlbHM6IG51bWJlciwgZXhwYW5kZWRTdGF0ZXM6IE1hcDxhbnksIGJvb2xlYW4+LCBfOiBudW1iZXIpOiBhbnlbXSB7XG5cbiAgICAgICAgY29uc3QgZGF0YTogSVRyZWVHcmlkUmVjb3JkW10gPSBbXTtcblxuICAgICAgICB0aGlzLmdyaWQucHJvY2Vzc2VkUm9vdFJlY29yZHMgPSBjb2xsZWN0aW9uO1xuICAgICAgICB0aGlzLmdyaWQucHJvY2Vzc2VkUmVjb3JkcyA9IG5ldyBNYXA8YW55LCBJVHJlZUdyaWRSZWNvcmQ+KCk7XG5cbiAgICAgICAgdGhpcy5nZXRGbGF0RGF0YVJlY3Vyc2l2ZShjb2xsZWN0aW9uLCBkYXRhLCBleHBhbmRlZExldmVscywgZXhwYW5kZWRTdGF0ZXMsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuZ3JpZC5wcm9jZXNzZWRFeHBhbmRlZEZsYXREYXRhID0gZGF0YS5tYXAociA9PiByLmRhdGEpO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmxhdERhdGFSZWN1cnNpdmUoY29sbGVjdGlvbjogSVRyZWVHcmlkUmVjb3JkW10sIGRhdGE6IElUcmVlR3JpZFJlY29yZFtdLFxuICAgICAgICBleHBhbmRlZExldmVsczogbnVtYmVyLCBleHBhbmRlZFN0YXRlczogTWFwPGFueSwgYm9vbGVhbj4sIHBhcmVudEV4cGFuZGVkOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghY29sbGVjdGlvbiB8fCAhY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgaGllcmFyY2hpY2FsUmVjb3JkIG9mIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnRFeHBhbmRlZCkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChoaWVyYXJjaGljYWxSZWNvcmQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoaWVyYXJjaGljYWxSZWNvcmQuZXhwYW5kZWQgPSB0aGlzLmdyaWQuZ3JpZEFQSS5nZXRfcm93X2V4cGFuc2lvbl9zdGF0ZShoaWVyYXJjaGljYWxSZWNvcmQpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU5vblByb2Nlc3NlZFJlY29yZEV4cGFuc2lvbih0aGlzLmdyaWQsIGhpZXJhcmNoaWNhbFJlY29yZCk7XG5cbiAgICAgICAgICAgIHRoaXMuZ3JpZC5wcm9jZXNzZWRSZWNvcmRzLnNldChoaWVyYXJjaGljYWxSZWNvcmQua2V5LCBoaWVyYXJjaGljYWxSZWNvcmQpO1xuXG4gICAgICAgICAgICB0aGlzLmdldEZsYXREYXRhUmVjdXJzaXZlKGhpZXJhcmNoaWNhbFJlY29yZC5jaGlsZHJlbiwgZGF0YSwgZXhwYW5kZWRMZXZlbHMsXG4gICAgICAgICAgICAgICAgZXhwYW5kZWRTdGF0ZXMsIHBhcmVudEV4cGFuZGVkICYmIGhpZXJhcmNoaWNhbFJlY29yZC5leHBhbmRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZU5vblByb2Nlc3NlZFJlY29yZEV4cGFuc2lvbihncmlkOiBHcmlkVHlwZSwgcmVjb3JkOiBJVHJlZUdyaWRSZWNvcmQpIHtcbiAgICAgICAgY29uc3QgcmVjID0gZ3JpZC5yZWNvcmRzLmdldChyZWNvcmQua2V5KTtcbiAgICAgICAgcmVjLmV4cGFuZGVkID0gcmVjb3JkLmV4cGFuZGVkO1xuICAgIH1cbn1cblxuLyoqIEBoaWRkZW4gKi9cbkBQaXBlKHsgbmFtZTogJ3RyZWVHcmlkU29ydGluZycgfSlcbmV4cG9ydCBjbGFzcyBJZ3hUcmVlR3JpZFNvcnRpbmdQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KElHWF9HUklEX0JBU0UpIHByaXZhdGUgZ3JpZDogR3JpZFR5cGUpIHsgfVxuXG4gICAgcHVibGljIHRyYW5zZm9ybShcbiAgICAgICAgaGllcmFyY2hpY2FsRGF0YTogSVRyZWVHcmlkUmVjb3JkW10sXG4gICAgICAgIGV4cHJlc3Npb25zOiBJU29ydGluZ0V4cHJlc3Npb25bXSxcbiAgICAgICAgc29ydGluZzogSUdyaWRTb3J0aW5nU3RyYXRlZ3ksXG4gICAgICAgIF86IG51bWJlcixcbiAgICAgICAgcGlubmVkPzogYm9vbGVhbik6IElUcmVlR3JpZFJlY29yZFtdIHtcblxuICAgICAgICBsZXQgcmVzdWx0OiBJVHJlZUdyaWRSZWNvcmRbXTtcbiAgICAgICAgaWYgKCFleHByZXNzaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhpZXJhcmNoaWNhbERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBEYXRhVXRpbC50cmVlR3JpZFNvcnQoaGllcmFyY2hpY2FsRGF0YSwgZXhwcmVzc2lvbnMsIHNvcnRpbmcsIG51bGwsIHRoaXMuZ3JpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWx0ZXJlZFNvcnRlZERhdGEgPSBbXTtcbiAgICAgICAgdGhpcy5mbGF0dGVuVHJlZUdyaWRSZWNvcmRzKHJlc3VsdCwgZmlsdGVyZWRTb3J0ZWREYXRhKTtcbiAgICAgICAgdGhpcy5ncmlkLnNldEZpbHRlcmVkU29ydGVkRGF0YShmaWx0ZXJlZFNvcnRlZERhdGEsIHBpbm5lZCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZsYXR0ZW5UcmVlR3JpZFJlY29yZHMocmVjb3JkczogSVRyZWVHcmlkUmVjb3JkW10sIGZsYXREYXRhOiBhbnlbXSkge1xuICAgICAgICBpZiAocmVjb3JkcyAmJiByZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIGZsYXREYXRhLnB1c2gocmVjb3JkLmRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmxhdHRlblRyZWVHcmlkUmVjb3JkcyhyZWNvcmQuY2hpbGRyZW4sIGZsYXREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqIEBoaWRkZW4gKi9cbkBQaXBlKHsgbmFtZTogJ3RyZWVHcmlkUGFnaW5nJyB9KVxuZXhwb3J0IGNsYXNzIElneFRyZWVHcmlkUGFnaW5nUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChJR1hfR1JJRF9CQVNFKSBwcml2YXRlIGdyaWQ6IEdyaWRUeXBlKSB7IH1cblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oY29sbGVjdGlvbjogSVRyZWVHcmlkUmVjb3JkW10sIHBhZ2UgPSAwLCBwZXJQYWdlID0gMTUsIF86IG51bWJlcik6IElUcmVlR3JpZFJlY29yZFtdIHtcbiAgICAgICAgaWYgKCF0aGlzLmdyaWQucGFnaW5hdG9yIHx8IHRoaXMuZ3JpZC5wYWdpbmdNb2RlICE9PSBHcmlkUGFnaW5nTW9kZS5Mb2NhbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZW4gPSB0aGlzLmdyaWQuX3RvdGFsUmVjb3JkcyA+PSAwID8gdGhpcy5ncmlkLl90b3RhbFJlY29yZHMgOiBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdG90YWxQYWdlcyA9IE1hdGguY2VpbChsZW4gLyBwZXJQYWdlKTtcblxuICAgICAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGluZGV4OiAodG90YWxQYWdlcyA+IDAgJiYgcGFnZSA+PSB0b3RhbFBhZ2VzKSA/IHRvdGFsUGFnZXMgLSAxIDogcGFnZSxcbiAgICAgICAgICAgIHJlY29yZHNQZXJQYWdlOiBwZXJQYWdlXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBJVHJlZUdyaWRSZWNvcmRbXSA9IERhdGFVdGlsLnBhZ2UoY2xvbmVBcnJheShjb2xsZWN0aW9uKSwgc3RhdGUsIGxlbik7XG4gICAgICAgIHRoaXMuZ3JpZC5wYWdpbmdTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLmdyaWQucGFnaW5hdG9yLnBhZ2UgPSBzdGF0ZS5pbmRleDtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbi8qKiBAaGlkZGVuICovXG5AUGlwZSh7IG5hbWU6ICd0cmVlR3JpZFRyYW5zYWN0aW9uJyB9KVxuZXhwb3J0IGNsYXNzIElneFRyZWVHcmlkVHJhbnNhY3Rpb25QaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoSUdYX0dSSURfQkFTRSkgcHJpdmF0ZSBncmlkOiBHcmlkVHlwZSkgeyB9XG5cbiAgICBwdWJsaWMgdHJhbnNmb3JtKGNvbGxlY3Rpb246IGFueVtdLCBfOiBudW1iZXIpOiBhbnlbXSB7XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JpZC50cmFuc2FjdGlvbnMuZW5hYmxlZCkge1xuICAgICAgICAgICAgY29uc3QgYWdncmVnYXRlZENoYW5nZXMgPSB0aGlzLmdyaWQudHJhbnNhY3Rpb25zLmdldEFnZ3JlZ2F0ZWRDaGFuZ2VzKHRydWUpO1xuICAgICAgICAgICAgaWYgKGFnZ3JlZ2F0ZWRDaGFuZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmltYXJ5S2V5ID0gdGhpcy5ncmlkLnByaW1hcnlLZXk7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmltYXJ5S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcmVpZ25LZXkgPSB0aGlzLmdyaWQuZm9yZWlnbktleTtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZERhdGFLZXkgPSB0aGlzLmdyaWQuY2hpbGREYXRhS2V5O1xuXG4gICAgICAgICAgICAgICAgaWYgKGZvcmVpZ25LZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmxhdERhdGFDbG9uZSA9IGNsb25lQXJyYXkoY29sbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBEYXRhVXRpbC5tZXJnZVRyYW5zYWN0aW9ucyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXREYXRhQ2xvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGVkQ2hhbmdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5wcmltYXJ5S2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLmRhdGFDbG9uZVN0cmF0ZWd5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkRGF0YUtleSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoaWVyYXJjaGljYWxEYXRhQ2xvbmUgPSBjbG9uZUhpZXJhcmNoaWNhbEFycmF5KGNvbGxlY3Rpb24sIGNoaWxkRGF0YUtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBEYXRhVXRpbC5tZXJnZUhpZXJhcmNoaWNhbFRyYW5zYWN0aW9ucyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZXJhcmNoaWNhbERhdGFDbG9uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZWRDaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGREYXRhS2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLnByaW1hcnlLZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuZGF0YUNsb25lU3RyYXRlZ3lcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGlzIHBpcGUgbWFwcyB0aGUgb3JpZ2luYWwgcmVjb3JkIHRvIElUcmVlR3JpZFJlY29yZCBmb3JtYXQgdXNlZCBpbiBUcmVlR3JpZC5cbiAqL1xuQFBpcGUoeyBuYW1lOiAndHJlZUdyaWROb3JtYWxpemVSZWNvcmQnIH0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUdyaWROb3JtYWxpemVSZWNvcmRzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChJR1hfR1JJRF9CQVNFKSBwcml2YXRlIGdyaWQ6IEdyaWRUeXBlKSB7IH1cblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oXzogYW55W10sIF9fOiBudW1iZXIpOiBhbnlbXSB7XG4gICAgICAgIGNvbnN0IHByaW1hcnlLZXkgPSB0aGlzLmdyaWQucHJpbWFyeUtleTtcbiAgICAgICAgLy8gdXNpbmcgZmxhdHRlbmVkIGRhdGEgYmVjYXVzZSBvcmlnaW4gZGF0YSBtYXkgYmUgaGllcmFyY2hpY2FsLlxuICAgICAgICBjb25zdCBmbGF0RGF0YSA9IHRoaXMuZ3JpZC5mbGF0RGF0YTtcbiAgICAgICAgY29uc3QgcmVzID0gZmxhdERhdGEubWFwKHJlYyA9PlxuICAgICAgICAoe1xuICAgICAgICAgICAgcm93SUQ6IHRoaXMuZ3JpZC5wcmltYXJ5S2V5ID8gcmVjW3ByaW1hcnlLZXldIDogcmVjLFxuICAgICAgICAgICAgZGF0YTogcmVjLFxuICAgICAgICAgICAgbGV2ZWw6IDAsXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuQFBpcGUoeyBuYW1lOiAndHJlZUdyaWRBZGRSb3cnIH0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUdyaWRBZGRSb3dQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KElHWF9HUklEX0JBU0UpIHByaXZhdGUgZ3JpZDogR3JpZFR5cGUpIHsgfVxuXG4gICAgcHVibGljIHRyYW5zZm9ybShjb2xsZWN0aW9uOiBhbnksIGlzUGlubmVkID0gZmFsc2UsIF9waXBlVHJpZ2dlcjogbnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5ncmlkLnJvd0VkaXRhYmxlIHx8ICF0aGlzLmdyaWQuY3J1ZFNlcnZpY2Uucm93IHx8IHRoaXMuZ3JpZC5jcnVkU2VydmljZS5yb3cuZ2V0Q2xhc3NOYW1lKCkgIT09IElneEFkZFJvdy5uYW1lIHx8XG4gICAgICAgICAgICAhdGhpcy5ncmlkLmdyaWRBUEkuY3J1ZFNlcnZpY2UuYWRkUm93UGFyZW50IHx8IGlzUGlubmVkICE9PSB0aGlzLmdyaWQuZ3JpZEFQSS5jcnVkU2VydmljZS5hZGRSb3dQYXJlbnQuaXNQaW5uZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvcHkgPSBjb2xsZWN0aW9uLnNsaWNlKDApO1xuICAgICAgICBjb25zdCByZWMgPSAodGhpcy5ncmlkLmNydWRTZXJ2aWNlLnJvdyBhcyBJZ3hBZGRSb3cpLnJlY29yZFJlZjtcbiAgICAgICAgY29weS5zcGxpY2UodGhpcy5ncmlkLmNydWRTZXJ2aWNlLnJvdy5pbmRleCwgMCwgcmVjKTtcbiAgICAgICAgdGhpcy5ncmlkLnJlY29yZHMuc2V0KHJlYy5rZXksIHJlYyk7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn1cbiJdfQ==