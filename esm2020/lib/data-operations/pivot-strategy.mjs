import { DEFAULT_PIVOT_KEYS, PivotDimensionType } from '../grids/pivot-grid/pivot-grid.interface';
import { PivotUtil } from '../grids/pivot-grid/pivot-util';
import { FilteringStrategy } from './filtering-strategy';
import { cloneArray } from '../core/utils';
export class NoopPivotDimensionsStrategy {
    static instance() {
        return this._instance || (this._instance = new NoopPivotDimensionsStrategy());
    }
    process(collection, _, __) {
        return collection;
    }
}
NoopPivotDimensionsStrategy._instance = null;
export class PivotRowDimensionsStrategy {
    static instance() {
        return this._instance || (this._instance = new PivotRowDimensionsStrategy());
    }
    process(collection, rows, values, pivotKeys = DEFAULT_PIVOT_KEYS) {
        let hierarchies;
        let data;
        const prevRowDims = [];
        let prevDim;
        let prevDimTopRecords = [];
        const currRows = cloneArray(rows, true);
        PivotUtil.assignLevels(currRows);
        if (currRows.length === 0) {
            hierarchies = PivotUtil.getFieldsHierarchy(collection, [{ memberName: '', enabled: true }], PivotDimensionType.Row, pivotKeys);
            // generate flat data from the hierarchies
            data = PivotUtil.processHierarchy(hierarchies, pivotKeys, 0, true);
            return data;
        }
        for (const row of currRows) {
            if (!data) {
                // build hierarchies - groups and subgroups
                hierarchies = PivotUtil.getFieldsHierarchy(collection, [row], PivotDimensionType.Row, pivotKeys);
                // generate flat data from the hierarchies
                data = PivotUtil.processHierarchy(hierarchies, pivotKeys, 0, true);
                prevRowDims.push(row);
                prevDim = row;
                prevDimTopRecords = data;
            }
            else {
                PivotUtil.processGroups(data, row, pivotKeys);
            }
        }
        return data;
    }
}
PivotRowDimensionsStrategy._instance = null;
export class PivotColumnDimensionsStrategy {
    static instance() {
        return this._instance || (this._instance = new PivotColumnDimensionsStrategy());
    }
    process(collection, columns, values, pivotKeys = DEFAULT_PIVOT_KEYS) {
        const res = this.processHierarchy(collection, columns, values, pivotKeys);
        return res;
    }
    processHierarchy(collection, columns, values, pivotKeys) {
        const result = [];
        collection.forEach(rec => {
            // apply aggregations based on the created groups and generate column fields based on the hierarchies
            this.groupColumns(rec, columns, values, pivotKeys);
            result.push(rec);
        });
        return result;
    }
    groupColumns(rec, columns, values, pivotKeys) {
        const children = rec.children;
        if (children && children.size > 0) {
            children.forEach((childRecs, key) => {
                if (childRecs) {
                    childRecs.forEach(child => {
                        this.groupColumns(child, columns, values, pivotKeys);
                    });
                }
            });
        }
        this.applyAggregates(rec, columns, values, pivotKeys);
    }
    applyAggregates(rec, columns, values, pivotKeys) {
        const leafRecords = this.getLeafs(rec.records, pivotKeys);
        const hierarchy = PivotUtil.getFieldsHierarchy(leafRecords, columns, PivotDimensionType.Column, pivotKeys);
        PivotUtil.applyAggregations(rec, hierarchy, values, pivotKeys);
    }
    getLeafs(records, pivotKeys) {
        let leafs = [];
        for (const rec of records) {
            if (rec[pivotKeys.records]) {
                leafs = leafs.concat(this.getLeafs(rec[pivotKeys.records], pivotKeys));
            }
            else {
                leafs.push(rec);
            }
        }
        return leafs;
    }
}
PivotColumnDimensionsStrategy._instance = null;
export class DimensionValuesFilteringStrategy extends FilteringStrategy {
    /**
     * Creates a new instance of FormattedValuesFilteringStrategy.
     *
     * @param fields An array of column field names that should be formatted.
     * If omitted the values of all columns which has formatter will be formatted.
     */
    constructor(fields) {
        super();
        this.fields = fields;
    }
    getFieldValue(rec, fieldName, isDate = false, isTime = false, grid) {
        const allDimensions = grid.allDimensions;
        const enabledDimensions = allDimensions.filter(x => x && x.enabled);
        const dim = PivotUtil.flatten(enabledDimensions).find(x => x.memberName === fieldName);
        const value = dim.childLevel ? this._getDimensionValueHierarchy(dim, rec).map(x => `[` + x + `]`).join('.') : PivotUtil.extractValueFromDimension(dim, rec);
        return value;
    }
    getFilterItems(column, tree) {
        const grid = column.grid;
        const enabledDimensions = grid.allDimensions.filter(x => x && x.enabled);
        let data = column.grid.gridAPI.filterDataByExpressions(tree);
        const dim = enabledDimensions.find(x => x.memberName === column.field);
        const allValuesHierarchy = PivotUtil.getFieldsHierarchy(data, [dim], PivotDimensionType.Column, grid.pivotKeys);
        const isNoop = grid.pivotConfiguration.columnStrategy instanceof NoopPivotDimensionsStrategy || grid.pivotConfiguration.rowStrategy instanceof NoopPivotDimensionsStrategy;
        const items = !isNoop ? this._getFilterItems(allValuesHierarchy, grid.pivotKeys) : [{ value: '' }];
        return Promise.resolve(items);
    }
    _getFilterItems(hierarchy, pivotKeys) {
        const items = [];
        hierarchy.forEach((value) => {
            const val = value.value;
            const path = val.split(pivotKeys.columnDimensionSeparator);
            const hierarchicalValue = path.length > 1 ? path.map(x => `[` + x + `]`).join('.') : val;
            const text = path[path.length - 1];
            items.push({
                value: hierarchicalValue,
                label: text,
                children: this._getFilterItems(value.children, pivotKeys)
            });
        });
        return items;
    }
    _getDimensionValueHierarchy(dim, rec) {
        let path = [];
        let value = PivotUtil.extractValueFromDimension(dim, rec);
        path.push(value);
        if (dim.childLevel) {
            const childVals = this._getDimensionValueHierarchy(dim.childLevel, rec);
            path = path.concat(childVals);
        }
        return path;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3Qtc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZGF0YS1vcGVyYXRpb25zL3Bpdm90LXN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxrQkFBa0IsRUFBdUYsa0JBQWtCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUN2TCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0QsT0FBTyxFQUFFLGlCQUFpQixFQUFpQixNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsTUFBTSxPQUFPLDJCQUEyQjtJQUc3QixNQUFNLENBQUMsUUFBUTtRQUNsQixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFTSxPQUFPLENBQUMsVUFBaUIsRUFBRSxDQUFvQixFQUFFLEVBQWlCO1FBQ3JFLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7O0FBUmMscUNBQVMsR0FBZ0MsSUFBSSxDQUFDO0FBWWpFLE1BQU0sT0FBTywwQkFBMEI7SUFHNUIsTUFBTSxDQUFDLFFBQVE7UUFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDBCQUEwQixFQUFFLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRU0sT0FBTyxDQUNWLFVBQWUsRUFDZixJQUF1QixFQUN2QixNQUFzQixFQUN0QixZQUF3QixrQkFBa0I7UUFFMUMsSUFBSSxXQUFXLENBQUM7UUFDaEIsSUFBSSxJQUF3QixDQUFDO1FBQzdCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLE9BQU8sQ0FBQztR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Li9ncmlkcy9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgREVGQVVMVF9QSVZPVF9LRVlTLCBJUGl2b3REaW1lbnNpb24sIElQaXZvdERpbWVuc2lvblN0cmF0ZWd5LCBJUGl2b3RHcmlkUmVjb3JkLCBJUGl2b3RLZXlzLCBJUGl2b3RWYWx1ZSwgUGl2b3REaW1lbnNpb25UeXBlIH0gZnJvbSAnLi4vZ3JpZHMvcGl2b3QtZ3JpZC9waXZvdC1ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBQaXZvdFV0aWwgfSBmcm9tICcuLi9ncmlkcy9waXZvdC1ncmlkL3Bpdm90LXV0aWwnO1xuaW1wb3J0IHsgRmlsdGVyaW5nU3RyYXRlZ3ksIElneEZpbHRlckl0ZW0gfSBmcm9tICcuL2ZpbHRlcmluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBjbG9uZUFycmF5IH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlIH0gZnJvbSAnLi9maWx0ZXJpbmctZXhwcmVzc2lvbnMtdHJlZSc7XG5cbmV4cG9ydCBjbGFzcyBOb29wUGl2b3REaW1lbnNpb25zU3RyYXRlZ3kgaW1wbGVtZW50cyBJUGl2b3REaW1lbnNpb25TdHJhdGVneSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBOb29wUGl2b3REaW1lbnNpb25zU3RyYXRlZ3kgPSBudWxsO1xuXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlIHx8ICh0aGlzLl9pbnN0YW5jZSA9IG5ldyBOb29wUGl2b3REaW1lbnNpb25zU3RyYXRlZ3koKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3MoY29sbGVjdGlvbjogYW55W10sIF86IElQaXZvdERpbWVuc2lvbltdLCBfXzogSVBpdm90VmFsdWVbXSk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBQaXZvdFJvd0RpbWVuc2lvbnNTdHJhdGVneSBpbXBsZW1lbnRzIElQaXZvdERpbWVuc2lvblN0cmF0ZWd5IHtcbiAgICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IFBpdm90Um93RGltZW5zaW9uc1N0cmF0ZWd5ID0gbnVsbDtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZSB8fCAodGhpcy5faW5zdGFuY2UgPSBuZXcgUGl2b3RSb3dEaW1lbnNpb25zU3RyYXRlZ3koKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3MoXG4gICAgICAgIGNvbGxlY3Rpb246IGFueSxcbiAgICAgICAgcm93czogSVBpdm90RGltZW5zaW9uW10sXG4gICAgICAgIHZhbHVlcz86IElQaXZvdFZhbHVlW10sXG4gICAgICAgIHBpdm90S2V5czogSVBpdm90S2V5cyA9IERFRkFVTFRfUElWT1RfS0VZU1xuICAgICk6IElQaXZvdEdyaWRSZWNvcmRbXSB7XG4gICAgICAgIGxldCBoaWVyYXJjaGllcztcbiAgICAgICAgbGV0IGRhdGE6IElQaXZvdEdyaWRSZWNvcmRbXTtcbiAgICAgICAgY29uc3QgcHJldlJvd0RpbXMgPSBbXTtcbiAgICAgICAgbGV0IHByZXZEaW07XG4gICAgICAgIGxldCBwcmV2RGltVG9wUmVjb3JkcyA9IFtdO1xuICAgICAgICBjb25zdCBjdXJyUm93cyA9IGNsb25lQXJyYXkocm93cywgdHJ1ZSk7XG4gICAgICAgIFBpdm90VXRpbC5hc3NpZ25MZXZlbHMoY3VyclJvd3MpO1xuXG4gICAgICAgIGlmIChjdXJyUm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGhpZXJhcmNoaWVzID0gUGl2b3RVdGlsLmdldEZpZWxkc0hpZXJhcmNoeShjb2xsZWN0aW9uLCBbeyBtZW1iZXJOYW1lOiAnJywgZW5hYmxlZDogdHJ1ZSB9XSwgUGl2b3REaW1lbnNpb25UeXBlLlJvdywgcGl2b3RLZXlzKTtcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIGZsYXQgZGF0YSBmcm9tIHRoZSBoaWVyYXJjaGllc1xuICAgICAgICAgICAgZGF0YSA9IFBpdm90VXRpbC5wcm9jZXNzSGllcmFyY2h5KGhpZXJhcmNoaWVzLCBwaXZvdEtleXMsIDAsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBjdXJyUm93cykge1xuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgaGllcmFyY2hpZXMgLSBncm91cHMgYW5kIHN1Ymdyb3Vwc1xuICAgICAgICAgICAgICAgIGhpZXJhcmNoaWVzID0gUGl2b3RVdGlsLmdldEZpZWxkc0hpZXJhcmNoeShjb2xsZWN0aW9uLCBbcm93XSwgUGl2b3REaW1lbnNpb25UeXBlLlJvdywgcGl2b3RLZXlzKTtcbiAgICAgICAgICAgICAgICAvLyBnZW5lcmF0ZSBmbGF0IGRhdGEgZnJvbSB0aGUgaGllcmFyY2hpZXNcbiAgICAgICAgICAgICAgICBkYXRhID0gUGl2b3RVdGlsLnByb2Nlc3NIaWVyYXJjaHkoaGllcmFyY2hpZXMsIHBpdm90S2V5cywgMCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcHJldlJvd0RpbXMucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIHByZXZEaW0gPSByb3c7XG4gICAgICAgICAgICAgICAgcHJldkRpbVRvcFJlY29yZHMgPSBkYXRhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBQaXZvdFV0aWwucHJvY2Vzc0dyb3VwcyhkYXRhLCByb3csIHBpdm90S2V5cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGl2b3RDb2x1bW5EaW1lbnNpb25zU3RyYXRlZ3kgaW1wbGVtZW50cyBJUGl2b3REaW1lbnNpb25TdHJhdGVneSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBQaXZvdFJvd0RpbWVuc2lvbnNTdHJhdGVneSA9IG51bGw7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2UgfHwgKHRoaXMuX2luc3RhbmNlID0gbmV3IFBpdm90Q29sdW1uRGltZW5zaW9uc1N0cmF0ZWd5KCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcm9jZXNzKFxuICAgICAgICBjb2xsZWN0aW9uOiBJUGl2b3RHcmlkUmVjb3JkW10sXG4gICAgICAgIGNvbHVtbnM6IElQaXZvdERpbWVuc2lvbltdLFxuICAgICAgICB2YWx1ZXM6IElQaXZvdFZhbHVlW10sXG4gICAgICAgIHBpdm90S2V5czogSVBpdm90S2V5cyA9IERFRkFVTFRfUElWT1RfS0VZU1xuICAgICk6IGFueVtdIHtcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy5wcm9jZXNzSGllcmFyY2h5KGNvbGxlY3Rpb24sIGNvbHVtbnMsIHZhbHVlcywgcGl2b3RLZXlzKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NIaWVyYXJjaHkoY29sbGVjdGlvbjogSVBpdm90R3JpZFJlY29yZFtdLCBjb2x1bW5zOiBJUGl2b3REaW1lbnNpb25bXSwgdmFsdWVzLCBwaXZvdEtleXMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJUGl2b3RHcmlkUmVjb3JkW10gPSBbXTtcbiAgICAgICAgY29sbGVjdGlvbi5mb3JFYWNoKHJlYyA9PiB7XG4gICAgICAgICAgICAvLyBhcHBseSBhZ2dyZWdhdGlvbnMgYmFzZWQgb24gdGhlIGNyZWF0ZWQgZ3JvdXBzIGFuZCBnZW5lcmF0ZSBjb2x1bW4gZmllbGRzIGJhc2VkIG9uIHRoZSBoaWVyYXJjaGllc1xuICAgICAgICAgICAgdGhpcy5ncm91cENvbHVtbnMocmVjLCBjb2x1bW5zLCB2YWx1ZXMsIHBpdm90S2V5cyk7XG4gICAgICAgICAgICByZXN1bHQucHVzaChyZWMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyb3VwQ29sdW1ucyhyZWM6IElQaXZvdEdyaWRSZWNvcmQsIGNvbHVtbnMsIHZhbHVlcywgcGl2b3RLZXlzKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gcmVjLmNoaWxkcmVuO1xuICAgICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4uc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkUmVjcywga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVjcykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFJlY3MuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ29sdW1ucyhjaGlsZCwgY29sdW1ucywgdmFsdWVzLCBwaXZvdEtleXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXBwbHlBZ2dyZWdhdGVzKHJlYywgY29sdW1ucywgdmFsdWVzLCBwaXZvdEtleXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXBwbHlBZ2dyZWdhdGVzKHJlYywgY29sdW1ucywgdmFsdWVzLCBwaXZvdEtleXMpIHtcbiAgICAgICAgY29uc3QgbGVhZlJlY29yZHMgPSB0aGlzLmdldExlYWZzKHJlYy5yZWNvcmRzLCBwaXZvdEtleXMpO1xuICAgICAgICBjb25zdCBoaWVyYXJjaHkgPSBQaXZvdFV0aWwuZ2V0RmllbGRzSGllcmFyY2h5KGxlYWZSZWNvcmRzLCBjb2x1bW5zLCBQaXZvdERpbWVuc2lvblR5cGUuQ29sdW1uLCBwaXZvdEtleXMpO1xuICAgICAgICBQaXZvdFV0aWwuYXBwbHlBZ2dyZWdhdGlvbnMocmVjLCBoaWVyYXJjaHksIHZhbHVlcywgcGl2b3RLZXlzKVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TGVhZnMocmVjb3JkcywgcGl2b3RLZXlzKSB7XG4gICAgICAgIGxldCBsZWFmcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJlYyBvZiByZWNvcmRzKSB7XG4gICAgICAgICAgICBpZiAocmVjW3Bpdm90S2V5cy5yZWNvcmRzXSkge1xuICAgICAgICAgICAgICAgIGxlYWZzID0gbGVhZnMuY29uY2F0KHRoaXMuZ2V0TGVhZnMocmVjW3Bpdm90S2V5cy5yZWNvcmRzXSwgcGl2b3RLZXlzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxlYWZzLnB1c2gocmVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGVhZnM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGltZW5zaW9uVmFsdWVzRmlsdGVyaW5nU3RyYXRlZ3kgZXh0ZW5kcyBGaWx0ZXJpbmdTdHJhdGVneSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBGb3JtYXR0ZWRWYWx1ZXNGaWx0ZXJpbmdTdHJhdGVneS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWVsZHMgQW4gYXJyYXkgb2YgY29sdW1uIGZpZWxkIG5hbWVzIHRoYXQgc2hvdWxkIGJlIGZvcm1hdHRlZC5cbiAgICAgKiBJZiBvbWl0dGVkIHRoZSB2YWx1ZXMgb2YgYWxsIGNvbHVtbnMgd2hpY2ggaGFzIGZvcm1hdHRlciB3aWxsIGJlIGZvcm1hdHRlZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpZWxkcz86IHN0cmluZ1tdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldEZpZWxkVmFsdWUocmVjOiBhbnksIGZpZWxkTmFtZTogc3RyaW5nLCBpc0RhdGU6IGJvb2xlYW4gPSBmYWxzZSwgaXNUaW1lOiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGdyaWQ/OiBQaXZvdEdyaWRUeXBlKTogYW55IHtcbiAgICAgICAgY29uc3QgYWxsRGltZW5zaW9ucyA9IGdyaWQuYWxsRGltZW5zaW9ucztcbiAgICAgICAgY29uc3QgZW5hYmxlZERpbWVuc2lvbnMgPSBhbGxEaW1lbnNpb25zLmZpbHRlcih4ID0+IHggJiYgeC5lbmFibGVkKTtcbiAgICAgICAgY29uc3QgZGltIDpJUGl2b3REaW1lbnNpb24gPSBQaXZvdFV0aWwuZmxhdHRlbihlbmFibGVkRGltZW5zaW9ucykuZmluZCh4ID0+IHgubWVtYmVyTmFtZSA9PT0gZmllbGROYW1lKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBkaW0uY2hpbGRMZXZlbCA/IHRoaXMuX2dldERpbWVuc2lvblZhbHVlSGllcmFyY2h5KGRpbSwgcmVjKS5tYXAoeCA9PiBgW2AgKyB4ICtgXWApLmpvaW4oJy4nKSA6IFBpdm90VXRpbC5leHRyYWN0VmFsdWVGcm9tRGltZW5zaW9uKGRpbSwgcmVjKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGaWx0ZXJJdGVtcyhjb2x1bW46IENvbHVtblR5cGUsIHRyZWU6IElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpOiBQcm9taXNlPElneEZpbHRlckl0ZW1bXT4ge1xuICAgICAgICBjb25zdCBncmlkID0gKGNvbHVtbi5ncmlkIGFzIGFueSk7XG4gICAgICAgIGNvbnN0IGVuYWJsZWREaW1lbnNpb25zID0gZ3JpZC5hbGxEaW1lbnNpb25zLmZpbHRlcih4ID0+IHggJiYgeC5lbmFibGVkKTtcbiAgICAgICAgbGV0IGRhdGEgPSBjb2x1bW4uZ3JpZC5ncmlkQVBJLmZpbHRlckRhdGFCeUV4cHJlc3Npb25zKHRyZWUpO1xuICAgICAgICBjb25zdCBkaW0gPSBlbmFibGVkRGltZW5zaW9ucy5maW5kKHggPT4geC5tZW1iZXJOYW1lID09PSBjb2x1bW4uZmllbGQpO1xuICAgICAgICBjb25zdCBhbGxWYWx1ZXNIaWVyYXJjaHkgPSBQaXZvdFV0aWwuZ2V0RmllbGRzSGllcmFyY2h5KFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIFtkaW1dLFxuICAgICAgICAgICAgUGl2b3REaW1lbnNpb25UeXBlLkNvbHVtbixcbiAgICAgICAgICAgIGdyaWQucGl2b3RLZXlzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGlzTm9vcCA9IGdyaWQucGl2b3RDb25maWd1cmF0aW9uLmNvbHVtblN0cmF0ZWd5IGluc3RhbmNlb2YgTm9vcFBpdm90RGltZW5zaW9uc1N0cmF0ZWd5IHx8IGdyaWQucGl2b3RDb25maWd1cmF0aW9uLnJvd1N0cmF0ZWd5IGluc3RhbmNlb2YgTm9vcFBpdm90RGltZW5zaW9uc1N0cmF0ZWd5O1xuICAgICAgICBjb25zdCBpdGVtczogSWd4RmlsdGVySXRlbVtdID0gIWlzTm9vcCA/IHRoaXMuX2dldEZpbHRlckl0ZW1zKGFsbFZhbHVlc0hpZXJhcmNoeSwgZ3JpZC5waXZvdEtleXMpIDogW3t2YWx1ZSA6ICcnfV07XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaXRlbXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldEZpbHRlckl0ZW1zKGhpZXJhcmNoeTogTWFwPHN0cmluZywgYW55PiwgcGl2b3RLZXlzOiBJUGl2b3RLZXlzKSA6IElneEZpbHRlckl0ZW1bXSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zOiAgSWd4RmlsdGVySXRlbVtdID0gW107XG4gICAgICAgIGhpZXJhcmNoeS5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdmFsdWUudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdmFsLnNwbGl0KHBpdm90S2V5cy5jb2x1bW5EaW1lbnNpb25TZXBhcmF0b3IpO1xuICAgICAgICAgICAgY29uc3QgaGllcmFyY2hpY2FsVmFsdWUgPSBwYXRoLmxlbmd0aCA+IDEgPyBwYXRoLm1hcCh4ID0+IGBbYCArIHggK2BdYCkuam9pbignLicpIDogdmFsO1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IHBhdGhbcGF0aC5sZW5ndGggLTFdO1xuICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGhpZXJhcmNoaWNhbFZhbHVlLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0ZXh0LFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiB0aGlzLl9nZXRGaWx0ZXJJdGVtcyh2YWx1ZS5jaGlsZHJlbiwgcGl2b3RLZXlzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0RGltZW5zaW9uVmFsdWVIaWVyYXJjaHkoZGltOiBJUGl2b3REaW1lbnNpb24sIHJlYzogYW55KSA6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IHBhdGggPSBbXTtcbiAgICAgICAgbGV0IHZhbHVlID0gUGl2b3RVdGlsLmV4dHJhY3RWYWx1ZUZyb21EaW1lbnNpb24oZGltLCByZWMpO1xuICAgICAgICBwYXRoLnB1c2godmFsdWUpO1xuICAgICAgICBpZiAoZGltLmNoaWxkTGV2ZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkVmFscyA9IHRoaXMuX2dldERpbWVuc2lvblZhbHVlSGllcmFyY2h5KGRpbS5jaGlsZExldmVsLCByZWMpO1xuICAgICAgICAgICAgcGF0aCA9IHBhdGguY29uY2F0KGNoaWxkVmFscyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxufVxuIl19