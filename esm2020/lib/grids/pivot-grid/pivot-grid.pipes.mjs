import { Inject, Pipe } from '@angular/core';
import { cloneArray } from '../../core/utils';
import { DataUtil } from '../../data-operations/data-util';
import { FilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { DefaultPivotGridRecordSortingStrategy } from '../../data-operations/pivot-sort-strategy';
import { FilterUtil } from '../../data-operations/filtering-strategy';
import { DimensionValuesFilteringStrategy, PivotColumnDimensionsStrategy, PivotRowDimensionsStrategy } from '../../data-operations/pivot-strategy';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { DEFAULT_PIVOT_KEYS } from './pivot-grid.interface';
import { PivotSortUtil } from './pivot-sort-util';
import { PivotUtil } from './pivot-util';
import * as i0 from "@angular/core";
import * as i1 from "../api.service";
/**
 * @hidden
 */
export class IgxPivotRowPipe {
    constructor() { }
    transform(collection, config, _, _pipeTrigger, __) {
        const pivotKeys = config.pivotKeys || DEFAULT_PIVOT_KEYS;
        const enabledRows = config.rows?.filter(x => x.enabled) || [];
        const enabledColumns = config.columns?.filter(x => x.enabled) || [];
        const enabledValues = config.values?.filter(x => x.enabled) || [];
        if (enabledRows.length === 0 && enabledColumns.length === 0 && enabledValues.length === 0) {
            // nothing to group and aggregate by ...
            return [];
        }
        const rowStrategy = config.rowStrategy || PivotRowDimensionsStrategy.instance();
        const data = cloneArray(collection, true);
        return rowStrategy.process(data, enabledRows, config.values, pivotKeys);
    }
}
IgxPivotRowPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotRowPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowPipe, name: "pivotGridRow" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridRow',
                    pure: true
                }]
        }], ctorParameters: function () { return []; } });
/**
 * @hidden
 * Transforms generic array data into IPivotGridRecord[]
 */
export class IgxPivotAutoTransform {
    transform(collection, config, _pipeTrigger, __) {
        let needsTransformation = false;
        if (collection.length > 0) {
            needsTransformation = !this.isPivotRecord(collection[0]);
        }
        if (!needsTransformation)
            return collection;
        const res = this.processCollectionToPivotRecord(config, collection);
        return res;
    }
    isPivotRecord(arg) {
        return !!arg.aggregationValues;
    }
    processCollectionToPivotRecord(config, collection) {
        const pivotKeys = config.pivotKeys || DEFAULT_PIVOT_KEYS;
        const enabledRows = config.rows.filter(x => x.enabled);
        const allFlat = PivotUtil.flatten(enabledRows);
        const result = [];
        for (const rec of collection) {
            const pivotRec = {
                dimensionValues: new Map(),
                aggregationValues: new Map(),
                children: new Map(),
                dimensions: []
            };
            const keys = Object.keys(rec);
            for (const key of keys) {
                const dim = allFlat.find(x => x.memberName === key);
                if (dim) {
                    //field has matching dimension
                    pivotRec.dimensions.push(dim);
                    pivotRec.dimensionValues.set(key, rec[key]);
                }
                else if (key.indexOf(pivotKeys.rowDimensionSeparator + pivotKeys.records) !== -1) {
                    // field that contains child collection
                    const dimKey = key.slice(0, key.indexOf(pivotKeys.rowDimensionSeparator + pivotKeys.records));
                    const childData = rec[key];
                    const childPivotData = this.processCollectionToPivotRecord(config, childData);
                    pivotRec.children.set(dimKey, childPivotData);
                }
                else {
                    // an aggregation
                    pivotRec.aggregationValues.set(key, rec[key]);
                }
            }
            const flattened = PivotUtil.flatten(config.rows);
            pivotRec.dimensions.sort((x, y) => flattened.indexOf(x) - flattened.indexOf(y));
            result.push(pivotRec);
        }
        return result;
    }
}
IgxPivotAutoTransform.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotAutoTransform, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotAutoTransform.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotAutoTransform, name: "pivotGridAutoTransform" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotAutoTransform, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridAutoTransform',
                    pure: true
                }]
        }] });
/**
 * @hidden
 */
export class IgxPivotRowExpansionPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, config, expansionStates, defaultExpand, _pipeTrigger, __) {
        const enabledRows = config.rows?.filter(x => x.enabled) || [];
        const data = collection ? cloneArray(collection, true) : [];
        for (const row of enabledRows) {
            PivotUtil.flattenGroups(data, row, expansionStates, defaultExpand);
        }
        const finalData = enabledRows.length > 0 ?
            data.filter(x => x.dimensions.length === enabledRows.length) : data;
        if (this.grid) {
            this.grid.setFilteredSortedData(finalData, false);
        }
        return finalData;
    }
}
IgxPivotRowExpansionPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowExpansionPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotRowExpansionPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowExpansionPipe, name: "pivotGridRowExpansion" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotRowExpansionPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridRowExpansion',
                    pure: true
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * @hidden
 */
export class IgxPivotCellMergingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, config, dim, _pipeTrigger) {
        if (collection.length === 0 || config.rows.length === 0)
            return collection;
        const data = collection ? cloneArray(collection, true) : [];
        const res = [];
        const enabledRows = config.rows?.filter(x => x.enabled);
        let groupData = [];
        let prevId;
        const index = enabledRows.indexOf(dim);
        for (let rec of data) {
            const currentDim = rec.dimensions[index];
            const id = PivotUtil.getRecordKey(rec, currentDim);
            if (groupData.length > 0 && prevId !== id) {
                const h = groupData.length > 1 ? groupData.length * this.grid.renderedRowHeight : undefined;
                groupData[0].height = h;
                groupData[0].rowSpan = groupData.length;
                res.push(groupData[0]);
                groupData = [];
            }
            groupData.push(rec);
            prevId = id;
        }
        if (groupData.length > 0) {
            const h = groupData.length > 1 ? groupData.length * this.grid.rowHeight + (groupData.length - 1) + 1 : undefined;
            groupData[0].height = h;
            groupData[0].rowSpan = groupData.length;
            res.push(groupData[0]);
        }
        return res;
    }
}
IgxPivotCellMergingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotCellMergingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotCellMergingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotCellMergingPipe, name: "pivotGridCellMerging" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotCellMergingPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridCellMerging',
                    pure: true
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * @hidden
 */
export class IgxPivotColumnPipe {
    transform(collection, config, _, _pipeTrigger, __) {
        const pivotKeys = config.pivotKeys || DEFAULT_PIVOT_KEYS;
        const enabledColumns = config.columns?.filter(x => x.enabled) || [];
        const enabledValues = config.values?.filter(x => x.enabled) || [];
        const colStrategy = config.columnStrategy || PivotColumnDimensionsStrategy.instance();
        const data = cloneArray(collection, true);
        return colStrategy.process(data, enabledColumns, enabledValues, pivotKeys);
    }
}
IgxPivotColumnPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotColumnPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotColumnPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotColumnPipe, name: "pivotGridColumn" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotColumnPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridColumn',
                    pure: true
                }]
        }] });
/**
 * @hidden
 */
export class IgxPivotGridFilterPipe {
    constructor(gridAPI) {
        this.gridAPI = gridAPI;
    }
    transform(collection, config, filterStrategy, advancedExpressionsTree, _filterPipeTrigger, _pipeTrigger) {
        const expressionsTree = PivotUtil.buildExpressionTree(config);
        const state = {
            expressionsTree,
            strategy: filterStrategy || new DimensionValuesFilteringStrategy(),
            advancedExpressionsTree
        };
        if (FilteringExpressionsTree.empty(state.expressionsTree) && FilteringExpressionsTree.empty(state.advancedExpressionsTree)) {
            return collection;
        }
        const result = FilterUtil.filter(cloneArray(collection, true), state, this.gridAPI.grid);
        return result;
    }
}
IgxPivotGridFilterPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridFilterPipe, deps: [{ token: i1.GridBaseAPIService }], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotGridFilterPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridFilterPipe, name: "pivotGridFilter" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridFilter',
                    pure: true
                }]
        }], ctorParameters: function () { return [{ type: i1.GridBaseAPIService }]; } });
/**
 * @hidden
 */
export class IgxPivotGridColumnSortingPipe {
    transform(collection, expressions, sorting, _pipeTrigger) {
        let result;
        if (!expressions.length) {
            result = collection;
        }
        else {
            for (const expr of expressions) {
                expr.strategy = DefaultPivotGridRecordSortingStrategy.instance();
            }
            result = PivotUtil.sort(cloneArray(collection, true), expressions, sorting);
        }
        return result;
    }
}
IgxPivotGridColumnSortingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridColumnSortingPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotGridColumnSortingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridColumnSortingPipe, name: "pivotGridColumnSort" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridColumnSortingPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridColumnSort',
                    pure: true
                }]
        }] });
/**
 * @hidden
 */
export class IgxPivotGridSortingPipe {
    constructor(gridAPI) {
        this.gridAPI = gridAPI;
    }
    transform(collection, config, sorting, _pipeTrigger) {
        let result;
        const allDimensions = config.rows || [];
        const enabledDimensions = allDimensions.filter(x => x && x.enabled);
        const expressions = PivotSortUtil.generateDimensionSortingExpressions(enabledDimensions);
        if (!expressions.length) {
            result = collection;
        }
        else {
            result = DataUtil.sort(cloneArray(collection, true), expressions, sorting, this.gridAPI.grid);
        }
        return result;
    }
}
IgxPivotGridSortingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridSortingPipe, deps: [{ token: i1.GridBaseAPIService }], target: i0.ɵɵFactoryTarget.Pipe });
IgxPivotGridSortingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridSortingPipe, name: "pivotGridSort" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridSortingPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pivotGridSort',
                    pure: true
                }]
        }], ctorParameters: function () { return [{ type: i1.GridBaseAPIService }]; } });
/**
 * @hidden
 */
export class IgxFilterPivotItemsPipe {
    transform(collection, filterCriteria, _pipeTrigger) {
        if (!collection) {
            return collection;
        }
        let copy = collection.slice(0);
        if (filterCriteria && filterCriteria.length > 0) {
            const filterFunc = (c) => {
                const filterText = c.member || c.memberName;
                if (!filterText) {
                    return false;
                }
                return (filterText
                    .toLocaleLowerCase()
                    .indexOf(filterCriteria.toLocaleLowerCase()) >= 0 ||
                    (c.children?.some(filterFunc) ?? false));
            };
            copy = collection.filter(filterFunc);
        }
        return copy;
    }
}
IgxFilterPivotItemsPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterPivotItemsPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxFilterPivotItemsPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterPivotItemsPipe, name: "filterPivotItems" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterPivotItemsPipe, decorators: [{
            type: Pipe,
            args: [{ name: "filterPivotItems" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3QtZ3JpZC5waXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9waXZvdC1ncmlkL3Bpdm90LWdyaWQucGlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDM0QsT0FBTyxFQUFFLHdCQUF3QixFQUE2QixNQUFNLGtEQUFrRCxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxVQUFVLEVBQXNCLE1BQU0sMENBQTBDLENBQUM7QUFDMUYsT0FBTyxFQUNILGdDQUFnQyxFQUFFLDZCQUE2QixFQUMvRCwwQkFBMEIsRUFDN0IsTUFBTSxzQ0FBc0MsQ0FBQztBQUc5QyxPQUFPLEVBQVksYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHbkUsT0FBTyxFQUFFLGtCQUFrQixFQUEwRyxNQUFNLHdCQUF3QixDQUFDO0FBQ3BLLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDOzs7QUFFekM7O0dBRUc7QUFLSCxNQUFNLE9BQU8sZUFBZTtJQUV4QixnQkFBZ0IsQ0FBQztJQUVWLFNBQVMsQ0FDWixVQUFlLEVBQ2YsTUFBMkIsRUFDM0IsQ0FBb0IsRUFDcEIsWUFBcUIsRUFDckIsRUFBRztRQUVILE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUM7UUFDekQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwRSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEUsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2Rix3Q0FBd0M7WUFDeEMsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksMEJBQTBCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEYsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQyxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7OzRHQXRCUSxlQUFlOzBHQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFKM0IsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsY0FBYztvQkFDcEIsSUFBSSxFQUFFLElBQUk7aUJBQ2I7O0FBMEJEOzs7R0FHRztBQUtILE1BQU0sT0FBTyxxQkFBcUI7SUFDdkIsU0FBUyxDQUNaLFVBQWlCLEVBQ2pCLE1BQTJCLEVBQzNCLFlBQXFCLEVBQ3JCLEVBQUc7UUFFSCxJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQztRQUNoQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLG1CQUFtQixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RDtRQUVELElBQUksQ0FBQyxtQkFBbUI7WUFBRSxPQUFPLFVBQVUsQ0FBQztRQUU1QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsOEJBQThCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVTLGFBQWEsQ0FBQyxHQUFxQjtRQUN6QyxPQUFPLENBQUMsQ0FBRSxHQUF3QixDQUFDLGlCQUFpQixDQUFDO0lBQ3pELENBQUM7SUFFUyw4QkFBOEIsQ0FBQyxNQUEyQixFQUFFLFVBQWlCO1FBQ25GLE1BQU0sU0FBUyxHQUFlLE1BQU0sQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUM7UUFDckUsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsTUFBTSxPQUFPLEdBQXNCLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEUsTUFBTSxNQUFNLEdBQXVCLEVBQUUsQ0FBQztRQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRTtZQUMxQixNQUFNLFFBQVEsR0FBcUI7Z0JBQy9CLGVBQWUsRUFBRSxJQUFJLEdBQUcsRUFBa0I7Z0JBQzFDLGlCQUFpQixFQUFFLElBQUksR0FBRyxFQUFrQjtnQkFDNUMsUUFBUSxFQUFFLElBQUksR0FBRyxFQUE4QjtnQkFDL0MsVUFBVSxFQUFFLEVBQUU7YUFDakIsQ0FBQztZQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDN0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7Z0JBQ3BCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLEdBQUcsRUFBRTtvQkFDTCw4QkFBOEI7b0JBQzlCLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM5QixRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQy9DO3FCQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNoRix1Q0FBdUM7b0JBQ3ZDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM5RixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzNCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzlFLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDakQ7cUJBQU07b0JBQ0gsaUJBQWlCO29CQUNqQixRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDakQ7YUFDSjtZQUNELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN6QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7O2tIQXpEUSxxQkFBcUI7Z0hBQXJCLHFCQUFxQjsyRkFBckIscUJBQXFCO2tCQUpqQyxJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSx3QkFBd0I7b0JBQzlCLElBQUksRUFBRSxJQUFJO2lCQUNiOztBQThERDs7R0FFRztBQUtILE1BQU0sT0FBTyx3QkFBd0I7SUFFakMsWUFBMkMsSUFBZTtRQUFmLFNBQUksR0FBSixJQUFJLENBQVc7SUFBSSxDQUFDO0lBRXhELFNBQVMsQ0FDWixVQUE4QixFQUM5QixNQUEyQixFQUMzQixlQUFrQyxFQUNsQyxhQUFzQixFQUN0QixZQUFxQixFQUNyQixFQUFHO1FBRUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlELE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVELEtBQUssTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFO1lBQzNCLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDdEU7UUFDRCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVyRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7O3FIQXhCUSx3QkFBd0Isa0JBRWIsYUFBYTttSEFGeEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBSnBDLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLHVCQUF1QjtvQkFDN0IsSUFBSSxFQUFFLElBQUk7aUJBQ2I7OzBCQUdnQixNQUFNOzJCQUFDLGFBQWE7O0FBeUJyQzs7R0FFRztBQUtILE1BQU0sT0FBTyx1QkFBdUI7SUFDaEMsWUFBMkMsSUFBYztRQUFkLFNBQUksR0FBSixJQUFJLENBQVU7SUFBSSxDQUFDO0lBQ3ZELFNBQVMsQ0FDWixVQUE4QixFQUM5QixNQUEyQixFQUMzQixHQUFvQixFQUNwQixZQUFxQjtRQUVyQixJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7WUFBRSxPQUFPLFVBQVUsQ0FBQztRQUMzRSxNQUFNLElBQUksR0FBNEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDckYsTUFBTSxHQUFHLEdBQTRCLEVBQUUsQ0FBQztRQUV4QyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxJQUFJLFNBQVMsR0FBNEIsRUFBRSxDQUFDO1FBQzVDLElBQUksTUFBTSxDQUFDO1FBQ1gsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNsQixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtnQkFDdkMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUM1RixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDeEIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixTQUFTLEdBQUcsRUFBRSxDQUFDO2FBQ2xCO1lBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQixNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNqSCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN4QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFDeEMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7b0hBcENRLHVCQUF1QixrQkFDWixhQUFhO2tIQUR4Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFKbkMsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsc0JBQXNCO29CQUM1QixJQUFJLEVBQUUsSUFBSTtpQkFDYjs7MEJBRWdCLE1BQU07MkJBQUMsYUFBYTs7QUF1Q3JDOztHQUVHO0FBS0gsTUFBTSxPQUFPLGtCQUFrQjtJQUVwQixTQUFTLENBQ1osVUFBOEIsRUFDOUIsTUFBMkIsRUFDM0IsQ0FBb0IsRUFDcEIsWUFBcUIsRUFDckIsRUFBRztRQUVILE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUM7UUFDekQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BFLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVsRSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsY0FBYyxJQUFJLDZCQUE2QixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RGLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7OytHQWhCUSxrQkFBa0I7NkdBQWxCLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUo5QixJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLElBQUksRUFBRSxJQUFJO2lCQUNiOztBQW9CRDs7R0FFRztBQUtILE1BQU0sT0FBTyxzQkFBc0I7SUFDL0IsWUFBb0IsT0FBNEQ7UUFBNUQsWUFBTyxHQUFQLE9BQU8sQ0FBcUQ7SUFBSSxDQUFDO0lBQzlFLFNBQVMsQ0FBQyxVQUFpQixFQUM5QixNQUEyQixFQUMzQixjQUFrQyxFQUNsQyx1QkFBa0QsRUFDbEQsa0JBQTBCLEVBQzFCLFlBQW9CO1FBQ3BCLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RCxNQUFNLEtBQUssR0FBRztZQUNWLGVBQWU7WUFDZixRQUFRLEVBQUUsY0FBYyxJQUFJLElBQUksZ0NBQWdDLEVBQUU7WUFDbEUsdUJBQXVCO1NBQzFCLENBQUM7UUFFRixJQUFJLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksd0JBQXdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO1lBQ3hILE9BQU8sVUFBVSxDQUFDO1NBQ3JCO1FBRUQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7O21IQXZCUSxzQkFBc0I7aUhBQXRCLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQUpsQyxJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLElBQUksRUFBRSxJQUFJO2lCQUNiOztBQTRCRDs7R0FFRztBQUtILE1BQU0sT0FBTyw2QkFBNkI7SUFDL0IsU0FBUyxDQUNaLFVBQThCLEVBQzlCLFdBQWlDLEVBQ2pDLE9BQTZCLEVBQzdCLFlBQW9CO1FBRXBCLElBQUksTUFBMEIsQ0FBQztRQUUvQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNyQixNQUFNLEdBQUcsVUFBVSxDQUFDO1NBQ3ZCO2FBQU07WUFDSCxLQUFJLE1BQU0sSUFBSSxJQUFJLFdBQVcsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxxQ0FBcUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNwRTtZQUNELE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQy9FO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7MEhBbEJRLDZCQUE2Qjt3SEFBN0IsNkJBQTZCOzJGQUE3Qiw2QkFBNkI7a0JBSnpDLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLHFCQUFxQjtvQkFDM0IsSUFBSSxFQUFFLElBQUk7aUJBQ2I7O0FBc0JEOztHQUVHO0FBS0gsTUFBTSxPQUFPLHVCQUF1QjtJQUNoQyxZQUFvQixPQUE0RDtRQUE1RCxZQUFPLEdBQVAsT0FBTyxDQUFxRDtJQUFJLENBQUM7SUFDOUUsU0FBUyxDQUFDLFVBQWlCLEVBQUUsTUFBMkIsRUFBRSxPQUE2QixFQUFFLFlBQW9CO1FBQ2hILElBQUksTUFBYSxDQUFDO1FBQ2xCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3hDLE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEUsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLG1DQUFtQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDckIsTUFBTSxHQUFHLFVBQVUsQ0FBQztTQUN2QjthQUFNO1lBQ0gsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakc7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOztvSEFkUSx1QkFBdUI7a0hBQXZCLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQUpuQyxJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxlQUFlO29CQUNyQixJQUFJLEVBQUUsSUFBSTtpQkFDYjs7QUFrQkQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sdUJBQXVCO0lBQ3pCLFNBQVMsQ0FDWixVQUE2QyxFQUM3QyxjQUFzQixFQUN0QixZQUFvQjtRQUVwQixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2IsT0FBTyxVQUFVLENBQUM7U0FDckI7UUFDRCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzdDLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JCLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDYixPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ0QsT0FBTyxDQUNILFVBQVU7cUJBQ0wsaUJBQWlCLEVBQUU7cUJBQ25CLE9BQU8sQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQ3JELENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLENBQzFDLENBQUM7WUFDTixDQUFDLENBQUM7WUFDRixJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O29IQTFCUSx1QkFBdUI7a0hBQXZCLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQURuQyxJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjbG9uZUFycmF5IH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBEYXRhVXRpbCB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9kYXRhLXV0aWwnO1xuaW1wb3J0IHsgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLCBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1leHByZXNzaW9ucy10cmVlJztcbmltcG9ydCB7IERlZmF1bHRQaXZvdEdyaWRSZWNvcmRTb3J0aW5nU3RyYXRlZ3kgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvcGl2b3Qtc29ydC1zdHJhdGVneSc7XG5pbXBvcnQgeyBGaWx0ZXJVdGlsLCBJRmlsdGVyaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7XG4gICAgRGltZW5zaW9uVmFsdWVzRmlsdGVyaW5nU3RyYXRlZ3ksIFBpdm90Q29sdW1uRGltZW5zaW9uc1N0cmF0ZWd5LFxuICAgIFBpdm90Um93RGltZW5zaW9uc1N0cmF0ZWd5XG59IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9waXZvdC1zdHJhdGVneSc7XG5pbXBvcnQgeyBJU29ydGluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBHcmlkQmFzZUFQSVNlcnZpY2UgfSBmcm9tICcuLi9hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBHcmlkVHlwZSwgSUdYX0dSSURfQkFTRSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJR3JpZFNvcnRpbmdTdHJhdGVneSB9IGZyb20gJy4uL2NvbW1vbi9zdHJhdGVneSc7XG5pbXBvcnQgeyBJZ3hHcmlkQmFzZURpcmVjdGl2ZSB9IGZyb20gJy4uL2dyaWQtYmFzZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVZPVF9LRVlTLCBJUGl2b3RDb25maWd1cmF0aW9uLCBJUGl2b3REaW1lbnNpb24sIElQaXZvdEdyaWRHcm91cFJlY29yZCwgSVBpdm90R3JpZFJlY29yZCwgSVBpdm90S2V5cywgSVBpdm90VmFsdWUgfSBmcm9tICcuL3Bpdm90LWdyaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFBpdm90U29ydFV0aWwgfSBmcm9tICcuL3Bpdm90LXNvcnQtdXRpbCc7XG5pbXBvcnQgeyBQaXZvdFV0aWwgfSBmcm9tICcuL3Bpdm90LXV0aWwnO1xuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQFBpcGUoe1xuICAgIG5hbWU6ICdwaXZvdEdyaWRSb3cnLFxuICAgIHB1cmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RSb3dQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgcHVibGljIHRyYW5zZm9ybShcbiAgICAgICAgY29sbGVjdGlvbjogYW55LFxuICAgICAgICBjb25maWc6IElQaXZvdENvbmZpZ3VyYXRpb24sXG4gICAgICAgIF86IE1hcDxhbnksIGJvb2xlYW4+LFxuICAgICAgICBfcGlwZVRyaWdnZXI/OiBudW1iZXIsXG4gICAgICAgIF9fP1xuICAgICk6IElQaXZvdEdyaWRSZWNvcmRbXSB7XG4gICAgICAgIGNvbnN0IHBpdm90S2V5cyA9IGNvbmZpZy5waXZvdEtleXMgfHwgREVGQVVMVF9QSVZPVF9LRVlTO1xuICAgICAgICBjb25zdCBlbmFibGVkUm93cyA9IGNvbmZpZy5yb3dzPy5maWx0ZXIoeCA9PiB4LmVuYWJsZWQpIHx8IFtdO1xuICAgICAgICBjb25zdCBlbmFibGVkQ29sdW1ucyA9IGNvbmZpZy5jb2x1bW5zPy5maWx0ZXIoeCA9PiB4LmVuYWJsZWQpIHx8IFtdO1xuICAgICAgICBjb25zdCBlbmFibGVkVmFsdWVzID0gY29uZmlnLnZhbHVlcz8uZmlsdGVyKHggPT4geC5lbmFibGVkKSB8fCBbXTtcbiAgICAgICAgaWYgKGVuYWJsZWRSb3dzLmxlbmd0aCA9PT0gMCAmJiBlbmFibGVkQ29sdW1ucy5sZW5ndGggPT09IDAgJiYgZW5hYmxlZFZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZ3JvdXAgYW5kIGFnZ3JlZ2F0ZSBieSAuLi5cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3dTdHJhdGVneSA9IGNvbmZpZy5yb3dTdHJhdGVneSB8fCBQaXZvdFJvd0RpbWVuc2lvbnNTdHJhdGVneS5pbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBkYXRhID0gY2xvbmVBcnJheShjb2xsZWN0aW9uLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHJvd1N0cmF0ZWd5LnByb2Nlc3MoZGF0YSwgZW5hYmxlZFJvd3MsIGNvbmZpZy52YWx1ZXMsIHBpdm90S2V5cyk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqIFRyYW5zZm9ybXMgZ2VuZXJpYyBhcnJheSBkYXRhIGludG8gSVBpdm90R3JpZFJlY29yZFtdXG4gKi9cbkBQaXBlKHtcbiAgICBuYW1lOiAncGl2b3RHcmlkQXV0b1RyYW5zZm9ybScsXG4gICAgcHVyZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hQaXZvdEF1dG9UcmFuc2Zvcm0gaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBwdWJsaWMgdHJhbnNmb3JtKFxuICAgICAgICBjb2xsZWN0aW9uOiBhbnlbXSxcbiAgICAgICAgY29uZmlnOiBJUGl2b3RDb25maWd1cmF0aW9uLFxuICAgICAgICBfcGlwZVRyaWdnZXI/OiBudW1iZXIsXG4gICAgICAgIF9fPyxcbiAgICApOiBJUGl2b3RHcmlkUmVjb3JkW10ge1xuICAgICAgICBsZXQgbmVlZHNUcmFuc2Zvcm1hdGlvbiA9IGZhbHNlO1xuICAgICAgICBpZiAoY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBuZWVkc1RyYW5zZm9ybWF0aW9uID0gIXRoaXMuaXNQaXZvdFJlY29yZChjb2xsZWN0aW9uWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbmVlZHNUcmFuc2Zvcm1hdGlvbikgcmV0dXJuIGNvbGxlY3Rpb247XG5cbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5wcm9jZXNzQ29sbGVjdGlvblRvUGl2b3RSZWNvcmQoY29uZmlnLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNQaXZvdFJlY29yZChhcmc6IElQaXZvdEdyaWRSZWNvcmQpOiBhcmcgaXMgSVBpdm90R3JpZFJlY29yZCB7XG4gICAgICAgIHJldHVybiAhIShhcmcgYXMgSVBpdm90R3JpZFJlY29yZCkuYWdncmVnYXRpb25WYWx1ZXM7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NDb2xsZWN0aW9uVG9QaXZvdFJlY29yZChjb25maWc6IElQaXZvdENvbmZpZ3VyYXRpb24sIGNvbGxlY3Rpb246IGFueVtdKTogSVBpdm90R3JpZFJlY29yZFtdIHtcbiAgICAgICAgY29uc3QgcGl2b3RLZXlzOiBJUGl2b3RLZXlzID0gY29uZmlnLnBpdm90S2V5cyB8fCBERUZBVUxUX1BJVk9UX0tFWVM7XG4gICAgICAgIGNvbnN0IGVuYWJsZWRSb3dzID0gY29uZmlnLnJvd3MuZmlsdGVyKHggPT4geC5lbmFibGVkKTtcbiAgICAgICAgY29uc3QgYWxsRmxhdDogSVBpdm90RGltZW5zaW9uW10gPSBQaXZvdFV0aWwuZmxhdHRlbihlbmFibGVkUm93cyk7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSVBpdm90R3JpZFJlY29yZFtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcmVjIG9mIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHBpdm90UmVjOiBJUGl2b3RHcmlkUmVjb3JkID0ge1xuICAgICAgICAgICAgICAgIGRpbWVuc2lvblZhbHVlczogbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKSxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGlvblZhbHVlczogbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbmV3IE1hcDxzdHJpbmcsIElQaXZvdEdyaWRSZWNvcmRbXT4oKSxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZWMpXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGltID0gYWxsRmxhdC5maW5kKHggPT4geC5tZW1iZXJOYW1lID09PSBrZXkpO1xuICAgICAgICAgICAgICAgIGlmIChkaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy9maWVsZCBoYXMgbWF0Y2hpbmcgZGltZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgIHBpdm90UmVjLmRpbWVuc2lvbnMucHVzaChkaW0pO1xuICAgICAgICAgICAgICAgICAgICBwaXZvdFJlYy5kaW1lbnNpb25WYWx1ZXMuc2V0KGtleSwgcmVjW2tleV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5LmluZGV4T2YocGl2b3RLZXlzLnJvd0RpbWVuc2lvblNlcGFyYXRvciArIHBpdm90S2V5cy5yZWNvcmRzKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmllbGQgdGhhdCBjb250YWlucyBjaGlsZCBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpbUtleSA9IGtleS5zbGljZSgwLCBrZXkuaW5kZXhPZihwaXZvdEtleXMucm93RGltZW5zaW9uU2VwYXJhdG9yICsgcGl2b3RLZXlzLnJlY29yZHMpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGREYXRhID0gcmVjW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUGl2b3REYXRhID0gdGhpcy5wcm9jZXNzQ29sbGVjdGlvblRvUGl2b3RSZWNvcmQoY29uZmlnLCBjaGlsZERhdGEpO1xuICAgICAgICAgICAgICAgICAgICBwaXZvdFJlYy5jaGlsZHJlbi5zZXQoZGltS2V5LCBjaGlsZFBpdm90RGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYW4gYWdncmVnYXRpb25cbiAgICAgICAgICAgICAgICAgICAgcGl2b3RSZWMuYWdncmVnYXRpb25WYWx1ZXMuc2V0KGtleSwgcmVjW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFBpdm90VXRpbC5mbGF0dGVuKGNvbmZpZy5yb3dzKTtcbiAgICAgICAgICAgIHBpdm90UmVjLmRpbWVuc2lvbnMuc29ydCgoeCx5KSA9PiBmbGF0dGVuZWQuaW5kZXhPZih4KSAtIGZsYXR0ZW5lZC5pbmRleE9mKHkpKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBpdm90UmVjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQFBpcGUoe1xuICAgIG5hbWU6ICdwaXZvdEdyaWRSb3dFeHBhbnNpb24nLFxuICAgIHB1cmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RSb3dFeHBhbnNpb25QaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KElHWF9HUklEX0JBU0UpIHByaXZhdGUgZ3JpZD86IEdyaWRUeXBlKSB7IH1cblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oXG4gICAgICAgIGNvbGxlY3Rpb246IElQaXZvdEdyaWRSZWNvcmRbXSxcbiAgICAgICAgY29uZmlnOiBJUGl2b3RDb25maWd1cmF0aW9uLFxuICAgICAgICBleHBhbnNpb25TdGF0ZXM6IE1hcDxhbnksIGJvb2xlYW4+LFxuICAgICAgICBkZWZhdWx0RXhwYW5kOiBib29sZWFuLFxuICAgICAgICBfcGlwZVRyaWdnZXI/OiBudW1iZXIsXG4gICAgICAgIF9fPyxcbiAgICApOiBJUGl2b3RHcmlkUmVjb3JkW10ge1xuICAgICAgICBjb25zdCBlbmFibGVkUm93cyA9IGNvbmZpZy5yb3dzPy5maWx0ZXIoeCA9PiB4LmVuYWJsZWQpIHx8IFtdO1xuICAgICAgICBjb25zdCBkYXRhID0gY29sbGVjdGlvbiA/IGNsb25lQXJyYXkoY29sbGVjdGlvbiwgdHJ1ZSkgOiBbXTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZW5hYmxlZFJvd3MpIHtcbiAgICAgICAgICAgIFBpdm90VXRpbC5mbGF0dGVuR3JvdXBzKGRhdGEsIHJvdywgZXhwYW5zaW9uU3RhdGVzLCBkZWZhdWx0RXhwYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaW5hbERhdGEgPSBlbmFibGVkUm93cy5sZW5ndGggPiAwID9cbiAgICAgICAgIGRhdGEuZmlsdGVyKHggPT4geC5kaW1lbnNpb25zLmxlbmd0aCA9PT0gZW5hYmxlZFJvd3MubGVuZ3RoKSA6IGRhdGE7XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JpZCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnNldEZpbHRlcmVkU29ydGVkRGF0YShmaW5hbERhdGEsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmluYWxEYXRhO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBQaXBlKHtcbiAgICBuYW1lOiAncGl2b3RHcmlkQ2VsbE1lcmdpbmcnLFxuICAgIHB1cmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RDZWxsTWVyZ2luZ1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KElHWF9HUklEX0JBU0UpIHByaXZhdGUgZ3JpZDogR3JpZFR5cGUpIHsgfVxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oXG4gICAgICAgIGNvbGxlY3Rpb246IElQaXZvdEdyaWRSZWNvcmRbXSxcbiAgICAgICAgY29uZmlnOiBJUGl2b3RDb25maWd1cmF0aW9uLFxuICAgICAgICBkaW06IElQaXZvdERpbWVuc2lvbixcbiAgICAgICAgX3BpcGVUcmlnZ2VyPzogbnVtYmVyXG4gICAgKTogSVBpdm90R3JpZEdyb3VwUmVjb3JkW10ge1xuICAgICAgICBpZiAoY29sbGVjdGlvbi5sZW5ndGggPT09IDAgfHwgY29uZmlnLnJvd3MubGVuZ3RoID09PSAwKSByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgZGF0YTogSVBpdm90R3JpZEdyb3VwUmVjb3JkW10gPSBjb2xsZWN0aW9uID8gY2xvbmVBcnJheShjb2xsZWN0aW9uLCB0cnVlKSA6IFtdO1xuICAgICAgICBjb25zdCByZXM6IElQaXZvdEdyaWRHcm91cFJlY29yZFtdID0gW107XG5cbiAgICAgICAgY29uc3QgZW5hYmxlZFJvd3MgPSBjb25maWcucm93cz8uZmlsdGVyKHggPT4geC5lbmFibGVkKTtcbiAgICAgICAgbGV0IGdyb3VwRGF0YTogSVBpdm90R3JpZEdyb3VwUmVjb3JkW10gPSBbXTtcbiAgICAgICAgbGV0IHByZXZJZDtcbiAgICAgICAgY29uc3QgaW5kZXggPSBlbmFibGVkUm93cy5pbmRleE9mKGRpbSk7XG4gICAgICAgIGZvciAobGV0IHJlYyBvZiBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RGltID0gcmVjLmRpbWVuc2lvbnNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgaWQgPSBQaXZvdFV0aWwuZ2V0UmVjb3JkS2V5KHJlYywgY3VycmVudERpbSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXBEYXRhLmxlbmd0aCA+IDAgJiYgcHJldklkICE9PSBpZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGggPSBncm91cERhdGEubGVuZ3RoID4gMSA/IGdyb3VwRGF0YS5sZW5ndGggKiB0aGlzLmdyaWQucmVuZGVyZWRSb3dIZWlnaHQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgZ3JvdXBEYXRhWzBdLmhlaWdodCA9IGg7XG4gICAgICAgICAgICAgICAgZ3JvdXBEYXRhWzBdLnJvd1NwYW4gPSBncm91cERhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGdyb3VwRGF0YVswXSk7XG4gICAgICAgICAgICAgICAgZ3JvdXBEYXRhID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cERhdGEucHVzaChyZWMpO1xuICAgICAgICAgICAgcHJldklkID0gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdyb3VwRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBoID0gZ3JvdXBEYXRhLmxlbmd0aCA+IDEgPyBncm91cERhdGEubGVuZ3RoICogdGhpcy5ncmlkLnJvd0hlaWdodCArIChncm91cERhdGEubGVuZ3RoIC0gMSkgKyAxIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgZ3JvdXBEYXRhWzBdLmhlaWdodCA9IGg7XG4gICAgICAgICAgICBncm91cERhdGFbMF0ucm93U3BhbiA9IGdyb3VwRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICByZXMucHVzaChncm91cERhdGFbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGhpZGRlblxuICovXG5AUGlwZSh7XG4gICAgbmFtZTogJ3Bpdm90R3JpZENvbHVtbicsXG4gICAgcHVyZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hQaXZvdENvbHVtblBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oXG4gICAgICAgIGNvbGxlY3Rpb246IElQaXZvdEdyaWRSZWNvcmRbXSxcbiAgICAgICAgY29uZmlnOiBJUGl2b3RDb25maWd1cmF0aW9uLFxuICAgICAgICBfOiBNYXA8YW55LCBib29sZWFuPixcbiAgICAgICAgX3BpcGVUcmlnZ2VyPzogbnVtYmVyLFxuICAgICAgICBfXz9cbiAgICApOiBJUGl2b3RHcmlkUmVjb3JkW10ge1xuICAgICAgICBjb25zdCBwaXZvdEtleXMgPSBjb25maWcucGl2b3RLZXlzIHx8IERFRkFVTFRfUElWT1RfS0VZUztcbiAgICAgICAgY29uc3QgZW5hYmxlZENvbHVtbnMgPSBjb25maWcuY29sdW1ucz8uZmlsdGVyKHggPT4geC5lbmFibGVkKSB8fCBbXTtcbiAgICAgICAgY29uc3QgZW5hYmxlZFZhbHVlcyA9IGNvbmZpZy52YWx1ZXM/LmZpbHRlcih4ID0+IHguZW5hYmxlZCkgfHwgW107XG5cbiAgICAgICAgY29uc3QgY29sU3RyYXRlZ3kgPSBjb25maWcuY29sdW1uU3RyYXRlZ3kgfHwgUGl2b3RDb2x1bW5EaW1lbnNpb25zU3RyYXRlZ3kuaW5zdGFuY2UoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNsb25lQXJyYXkoY29sbGVjdGlvbiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBjb2xTdHJhdGVneS5wcm9jZXNzKGRhdGEsIGVuYWJsZWRDb2x1bW5zLCBlbmFibGVkVmFsdWVzLCBwaXZvdEtleXMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBQaXBlKHtcbiAgICBuYW1lOiAncGl2b3RHcmlkRmlsdGVyJyxcbiAgICBwdXJlOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIElneFBpdm90R3JpZEZpbHRlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyaWRBUEk6IEdyaWRCYXNlQVBJU2VydmljZTxJZ3hHcmlkQmFzZURpcmVjdGl2ZSAmIEdyaWRUeXBlPikgeyB9XG4gICAgcHVibGljIHRyYW5zZm9ybShjb2xsZWN0aW9uOiBhbnlbXSxcbiAgICAgICAgY29uZmlnOiBJUGl2b3RDb25maWd1cmF0aW9uLFxuICAgICAgICBmaWx0ZXJTdHJhdGVneTogSUZpbHRlcmluZ1N0cmF0ZWd5LFxuICAgICAgICBhZHZhbmNlZEV4cHJlc3Npb25zVHJlZTogSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSxcbiAgICAgICAgX2ZpbHRlclBpcGVUcmlnZ2VyOiBudW1iZXIsXG4gICAgICAgIF9waXBlVHJpZ2dlcjogbnVtYmVyKTogYW55W10ge1xuICAgICAgICBjb25zdCBleHByZXNzaW9uc1RyZWUgPSBQaXZvdFV0aWwuYnVpbGRFeHByZXNzaW9uVHJlZShjb25maWcpO1xuXG4gICAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICAgICAgc3RyYXRlZ3k6IGZpbHRlclN0cmF0ZWd5IHx8IG5ldyBEaW1lbnNpb25WYWx1ZXNGaWx0ZXJpbmdTdHJhdGVneSgpLFxuICAgICAgICAgICAgYWR2YW5jZWRFeHByZXNzaW9uc1RyZWVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLmVtcHR5KHN0YXRlLmV4cHJlc3Npb25zVHJlZSkgJiYgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLmVtcHR5KHN0YXRlLmFkdmFuY2VkRXhwcmVzc2lvbnNUcmVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBGaWx0ZXJVdGlsLmZpbHRlcihjbG9uZUFycmF5KGNvbGxlY3Rpb24sIHRydWUpLCBzdGF0ZSwgdGhpcy5ncmlkQVBJLmdyaWQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGhpZGRlblxuICovXG5AUGlwZSh7XG4gICAgbmFtZTogJ3Bpdm90R3JpZENvbHVtblNvcnQnLFxuICAgIHB1cmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RHcmlkQ29sdW1uU29ydGluZ1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBwdWJsaWMgdHJhbnNmb3JtKFxuICAgICAgICBjb2xsZWN0aW9uOiBJUGl2b3RHcmlkUmVjb3JkW10sXG4gICAgICAgIGV4cHJlc3Npb25zOiBJU29ydGluZ0V4cHJlc3Npb25bXSxcbiAgICAgICAgc29ydGluZzogSUdyaWRTb3J0aW5nU3RyYXRlZ3ksXG4gICAgICAgIF9waXBlVHJpZ2dlcjogbnVtYmVyXG4gICAgKTogSVBpdm90R3JpZFJlY29yZFtdIHtcbiAgICAgICAgbGV0IHJlc3VsdDogSVBpdm90R3JpZFJlY29yZFtdO1xuXG4gICAgICAgIGlmICghZXhwcmVzc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBjb2xsZWN0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yKGNvbnN0IGV4cHIgb2YgZXhwcmVzc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBleHByLnN0cmF0ZWd5ID0gRGVmYXVsdFBpdm90R3JpZFJlY29yZFNvcnRpbmdTdHJhdGVneS5pbnN0YW5jZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0ID0gUGl2b3RVdGlsLnNvcnQoY2xvbmVBcnJheShjb2xsZWN0aW9uLCB0cnVlKSwgZXhwcmVzc2lvbnMsIHNvcnRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQFBpcGUoe1xuICAgIG5hbWU6ICdwaXZvdEdyaWRTb3J0JyxcbiAgICBwdXJlOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIElneFBpdm90R3JpZFNvcnRpbmdQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBncmlkQVBJOiBHcmlkQmFzZUFQSVNlcnZpY2U8SWd4R3JpZEJhc2VEaXJlY3RpdmUgJiBHcmlkVHlwZT4pIHsgfVxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oY29sbGVjdGlvbjogYW55W10sIGNvbmZpZzogSVBpdm90Q29uZmlndXJhdGlvbiwgc29ydGluZzogSUdyaWRTb3J0aW5nU3RyYXRlZ3ksIF9waXBlVHJpZ2dlcjogbnVtYmVyKTogYW55W10ge1xuICAgICAgICBsZXQgcmVzdWx0OiBhbnlbXTtcbiAgICAgICAgY29uc3QgYWxsRGltZW5zaW9ucyA9IGNvbmZpZy5yb3dzIHx8IFtdO1xuICAgICAgICBjb25zdCBlbmFibGVkRGltZW5zaW9ucyA9IGFsbERpbWVuc2lvbnMuZmlsdGVyKHggPT4geCAmJiB4LmVuYWJsZWQpO1xuICAgICAgICBjb25zdCBleHByZXNzaW9ucyA9IFBpdm90U29ydFV0aWwuZ2VuZXJhdGVEaW1lbnNpb25Tb3J0aW5nRXhwcmVzc2lvbnMoZW5hYmxlZERpbWVuc2lvbnMpO1xuICAgICAgICBpZiAoIWV4cHJlc3Npb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gY29sbGVjdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IERhdGFVdGlsLnNvcnQoY2xvbmVBcnJheShjb2xsZWN0aW9uLCB0cnVlKSwgZXhwcmVzc2lvbnMsIHNvcnRpbmcsIHRoaXMuZ3JpZEFQSS5ncmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQFBpcGUoeyBuYW1lOiBcImZpbHRlclBpdm90SXRlbXNcIiB9KVxuZXhwb3J0IGNsYXNzIElneEZpbHRlclBpdm90SXRlbXNQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgcHVibGljIHRyYW5zZm9ybShcbiAgICAgICAgY29sbGVjdGlvbjogKElQaXZvdERpbWVuc2lvbiB8IElQaXZvdFZhbHVlKVtdLFxuICAgICAgICBmaWx0ZXJDcml0ZXJpYTogc3RyaW5nLFxuICAgICAgICBfcGlwZVRyaWdnZXI6IG51bWJlclxuICAgICk6IGFueVtdIHtcbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29weSA9IGNvbGxlY3Rpb24uc2xpY2UoMCk7XG4gICAgICAgIGlmIChmaWx0ZXJDcml0ZXJpYSAmJiBmaWx0ZXJDcml0ZXJpYS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJGdW5jID0gKGMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJUZXh0ID0gYy5tZW1iZXIgfHwgYy5tZW1iZXJOYW1lO1xuICAgICAgICAgICAgICAgIGlmICghZmlsdGVyVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlclRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIC50b0xvY2FsZUxvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaW5kZXhPZihmaWx0ZXJDcml0ZXJpYS50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgIChjLmNoaWxkcmVuPy5zb21lKGZpbHRlckZ1bmMpID8/IGZhbHNlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29weSA9IGNvbGxlY3Rpb24uZmlsdGVyKGZpbHRlckZ1bmMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn1cbiJdfQ==