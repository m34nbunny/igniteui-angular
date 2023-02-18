import { EventEmitter } from '@angular/core';
import { cloneArray, cloneValue, resolveNestedPath, yieldingLoop } from '../../core/utils';
import { DataUtil } from '../../data-operations/data-util';
import { ExportUtilities } from './export-utilities';
import { TreeGridFilteringStrategy } from '../../grids/tree-grid/tree-grid.filtering.strategy';
import { getHierarchy, isHierarchyMatch } from '../../data-operations/operations';
import { DatePipe } from '@angular/common';
import { FilterUtil } from '../../data-operations/filtering-strategy';
export var ExportRecordType;
(function (ExportRecordType) {
    ExportRecordType["GroupedRecord"] = "GroupedRecord";
    ExportRecordType["TreeGridRecord"] = "TreeGridRecord";
    ExportRecordType["DataRecord"] = "DataRecord";
    ExportRecordType["HierarchicalGridRecord"] = "HierarchicalGridRecord";
    ExportRecordType["HeaderRecord"] = "HeaderRecord";
})(ExportRecordType || (ExportRecordType = {}));
export var HeaderType;
(function (HeaderType) {
    HeaderType["ColumnHeader"] = "ColumnHeader";
    HeaderType["MultiColumnHeader"] = "MultiColumnHeader";
})(HeaderType || (HeaderType = {}));
/**hidden
 * A helper class used to identify whether the user has set a specific columnIndex
 * during columnExporting, so we can honor it at the exported file.
*/
class IgxColumnExportingEventArgs {
    constructor(original) {
        this.userSetIndex = false;
        this.header = original.header;
        this.field = original.field;
        this.cancel = original.cancel;
        this.skipFormatter = original.skipFormatter;
        this.grid = original.grid;
        this.owner = original.owner;
        this._columnIndex = original.columnIndex;
    }
    get columnIndex() {
        return this._columnIndex;
    }
    set columnIndex(value) {
        this._columnIndex = value;
        this.userSetIndex = true;
    }
}
export const DEFAULT_OWNER = 'default';
const DEFAULT_COLUMN_WIDTH = 8.43;
export class IgxBaseExporter {
    constructor() {
        this.exportEnded = new EventEmitter();
        /**
         * This event is emitted when a row is exported.
         * ```typescript
         * this.exporterService.rowExporting.subscribe((args: IRowExportingEventArgs) => {
         * // put event handler code here
         * });
         * ```
         *
         * @memberof IgxBaseExporter
         */
        this.rowExporting = new EventEmitter();
        /**
         * This event is emitted when a column is exported.
         * ```typescript
         * this.exporterService.columnExporting.subscribe((args: IColumnExportingEventArgs) => {
         * // put event handler code here
         * });
         * ```
         *
         * @memberof IgxBaseExporter
         */
        this.columnExporting = new EventEmitter();
        this._sort = null;
        this._ownersMap = new Map();
        this.flatRecords = [];
    }
    /**
     * Method for exporting IgxGrid component's data.
     * ```typescript
     * this.exporterService.export(this.igxGridForExport, this.exportOptions);
     * ```
     *
     * @memberof IgxBaseExporter
     */
    export(grid, options) {
        if (options === undefined || options === null) {
            throw Error('No options provided!');
        }
        this.options = options;
        let columns = grid.columnList.toArray();
        if (this.options.ignoreMultiColumnHeaders) {
            columns = columns.filter(col => col.children === undefined);
        }
        const columnList = this.getColumns(columns);
        const tagName = grid.nativeElement.tagName.toLowerCase();
        if (tagName === 'igx-hierarchical-grid') {
            this._ownersMap.set(grid, columnList);
            const childLayoutList = grid.childLayoutList;
            for (const island of childLayoutList) {
                this.mapHierarchicalGridColumns(island, grid.data[0]);
            }
        }
        else {
            this._ownersMap.set(DEFAULT_OWNER, columnList);
        }
        this.prepareData(grid);
        this.exportGridRecordsData(this.flatRecords, grid);
    }
    /**
     * Method for exporting any kind of array data.
     * ```typescript
     * this.exporterService.exportData(this.arrayForExport, this.exportOptions);
     * ```
     *
     * @memberof IgxBaseExporter
     */
    exportData(data, options) {
        if (options === undefined || options === null) {
            throw Error('No options provided!');
        }
        this.options = options;
        const records = data.map(d => {
            const record = {
                data: d,
                type: ExportRecordType.DataRecord,
                level: 0
            };
            return record;
        });
        this.exportGridRecordsData(records);
    }
    exportGridRecordsData(records, grid) {
        if (this._ownersMap.size === 0) {
            const recordsData = records.map(r => r.data);
            const keys = ExportUtilities.getKeysFromData(recordsData);
            const columns = keys.map((k) => ({ header: k, field: k, skip: false, headerType: HeaderType.ColumnHeader, level: 0, columnSpan: 1 }));
            const columnWidths = new Array(keys.length).fill(DEFAULT_COLUMN_WIDTH);
            const mapRecord = {
                columns,
                columnWidths,
                indexOfLastPinnedColumn: -1,
                maxLevel: 0
            };
            this._ownersMap.set(DEFAULT_OWNER, mapRecord);
        }
        let shouldReorderColumns = false;
        for (const [key, mapRecord] of this._ownersMap) {
            let skippedPinnedColumnsCount = 0;
            let columnsWithoutHeaderCount = 1;
            let indexOfLastPinnedColumn = mapRecord.indexOfLastPinnedColumn;
            mapRecord.columns.forEach((column, index) => {
                if (!column.skip) {
                    const columnExportArgs = {
                        header: !ExportUtilities.isNullOrWhitespaces(column.header) ?
                            column.header :
                            'Column' + columnsWithoutHeaderCount++,
                        field: column.field,
                        columnIndex: index,
                        cancel: false,
                        skipFormatter: false,
                        grid: key === DEFAULT_OWNER ? grid : key
                    };
                    const newColumnExportArgs = new IgxColumnExportingEventArgs(columnExportArgs);
                    this.columnExporting.emit(newColumnExportArgs);
                    column.header = newColumnExportArgs.header;
                    column.skip = newColumnExportArgs.cancel;
                    column.skipFormatter = newColumnExportArgs.skipFormatter;
                    if (newColumnExportArgs.userSetIndex) {
                        column.exportIndex = newColumnExportArgs.columnIndex;
                        shouldReorderColumns = true;
                    }
                    if (column.skip) {
                        if (index <= indexOfLastPinnedColumn) {
                            skippedPinnedColumnsCount++;
                        }
                        this.calculateColumnSpans(column, mapRecord, column.columnSpan);
                        const nonSkippedColumns = mapRecord.columns.filter(c => !c.skip);
                        if (nonSkippedColumns.length > 0) {
                            this._ownersMap.get(key).maxLevel = nonSkippedColumns.sort((a, b) => b.level - a.level)[0].level;
                        }
                    }
                    if (this._sort && this._sort.fieldName === column.field) {
                        if (column.skip) {
                            this._sort = null;
                        }
                        else {
                            this._sort.fieldName = column.header;
                        }
                    }
                }
            });
            indexOfLastPinnedColumn -= skippedPinnedColumnsCount;
            // Reorder columns only if a column has been assigned a specific columnIndex during columnExporting event
            if (shouldReorderColumns) {
                mapRecord.columns = this.reorderColumns(mapRecord.columns);
            }
        }
        const dataToExport = new Array();
        const actualData = records[0]?.data;
        const isSpecialData = ExportUtilities.isSpecialData(actualData);
        yieldingLoop(records.length, 100, (i) => {
            const row = records[i];
            this.exportRow(dataToExport, row, i, isSpecialData);
        }, () => {
            this.exportDataImplementation(dataToExport, this.options, () => {
                this.resetDefaults();
            });
        });
    }
    calculateColumnSpans(column, mapRecord, span) {
        if (column.headerType === HeaderType.MultiColumnHeader && column.skip) {
            const columnGroupChildren = mapRecord.columns.filter(c => c.columnGroupParent === column.columnGroup);
            columnGroupChildren.forEach(cgc => {
                if (cgc.headerType === HeaderType.MultiColumnHeader) {
                    cgc.columnSpan = 0;
                    cgc.columnGroupParent = null;
                    cgc.skip = true;
                    this.calculateColumnSpans(cgc, mapRecord, cgc.columnSpan);
                }
                else {
                    cgc.skip = true;
                }
            });
        }
        const targetCol = mapRecord.columns.filter(c => column.columnGroupParent !== null && c.columnGroup === column.columnGroupParent)[0];
        if (targetCol !== undefined) {
            targetCol.columnSpan -= span;
            if (targetCol.columnGroupParent !== null) {
                this.calculateColumnSpans(targetCol, mapRecord, span);
            }
            if (targetCol.columnSpan === 0) {
                targetCol.skip = true;
            }
        }
    }
    exportRow(data, record, index, isSpecialData) {
        if (!isSpecialData) {
            const owner = record.owner === undefined ? DEFAULT_OWNER : record.owner;
            const ownerCols = this._ownersMap.get(owner).columns;
            if (record.type !== ExportRecordType.HeaderRecord) {
                const columns = ownerCols
                    .filter(c => c.headerType !== HeaderType.MultiColumnHeader && !c.skip)
                    .sort((a, b) => a.startIndex - b.startIndex)
                    .sort((a, b) => a.pinnedIndex - b.pinnedIndex);
                record.data = columns.reduce((a, e) => {
                    if (!e.skip) {
                        let rawValue = resolveNestedPath(record.data, e.field);
                        const shouldApplyFormatter = e.formatter && !e.skipFormatter && record.type !== ExportRecordType.GroupedRecord;
                        if (e.dataType === 'date' &&
                            !(rawValue instanceof Date) &&
                            !shouldApplyFormatter &&
                            rawValue !== undefined &&
                            rawValue !== null) {
                            rawValue = new Date(rawValue);
                        }
                        else if (e.dataType === 'string' && rawValue instanceof Date) {
                            rawValue = rawValue.toString();
                        }
                        a[e.field] = shouldApplyFormatter ? e.formatter(rawValue) : rawValue;
                    }
                    return a;
                }, {});
            }
            else {
                const filteredHeaders = ownerCols.filter(c => c.skip).map(c => c.header ? c.header : c.field);
                record.data = record.data.filter(d => filteredHeaders.indexOf(d) === -1);
            }
        }
        const rowArgs = {
            rowData: record.data,
            rowIndex: index,
            cancel: false
        };
        this.rowExporting.emit(rowArgs);
        if (!rowArgs.cancel) {
            data.push(record);
        }
    }
    reorderColumns(columns) {
        const filteredColumns = columns.filter(c => !c.skip);
        const length = filteredColumns.length;
        const specificIndicesColumns = filteredColumns.filter((col) => !isNaN(col.exportIndex))
            .sort((a, b) => a.exportIndex - b.exportIndex);
        const indices = specificIndicesColumns.map(col => col.exportIndex);
        specificIndicesColumns.forEach(col => {
            filteredColumns.splice(filteredColumns.indexOf(col), 1);
        });
        const reorderedColumns = new Array(length);
        if (specificIndicesColumns.length > Math.max(...indices)) {
            return specificIndicesColumns.concat(filteredColumns);
        }
        else {
            indices.forEach((i, index) => {
                if (i < 0 || i >= length) {
                    filteredColumns.push(specificIndicesColumns[index]);
                }
                else {
                    let k = i;
                    while (k < length && reorderedColumns[k] !== undefined) {
                        ++k;
                    }
                    reorderedColumns[k] = specificIndicesColumns[index];
                }
            });
            for (let i = 0; i < length; i++) {
                if (reorderedColumns[i] === undefined) {
                    reorderedColumns[i] = filteredColumns.splice(0, 1)[0];
                }
            }
        }
        return reorderedColumns;
    }
    prepareData(grid) {
        this.flatRecords = [];
        const tagName = grid.nativeElement.tagName.toLowerCase();
        const hasFiltering = (grid.filteringExpressionsTree && grid.filteringExpressionsTree.filteringOperands.length > 0) ||
            (grid.advancedFilteringExpressionsTree && grid.advancedFilteringExpressionsTree.filteringOperands.length > 0);
        const hasSorting = grid.sortingExpressions &&
            grid.sortingExpressions.length > 0;
        switch (tagName) {
            case 'igx-hierarchical-grid': {
                this.prepareHierarchicalGridData(grid, hasFiltering, hasSorting);
                break;
            }
            case 'igx-tree-grid': {
                this.prepareTreeGridData(grid, hasFiltering, hasSorting);
                break;
            }
            default: {
                this.prepareGridData(grid, hasFiltering, hasSorting);
                break;
            }
        }
    }
    prepareHierarchicalGridData(grid, hasFiltering, hasSorting) {
        const skipOperations = (!hasFiltering || !this.options.ignoreFiltering) &&
            (!hasSorting || !this.options.ignoreSorting);
        if (skipOperations) {
            const data = grid.filteredSortedData;
            this.addHierarchicalGridData(grid, data);
        }
        else {
            let data = grid.data;
            if (hasFiltering && !this.options.ignoreFiltering) {
                const filteringState = {
                    expressionsTree: grid.filteringExpressionsTree,
                    advancedExpressionsTree: grid.advancedFilteringExpressionsTree,
                    strategy: grid.filterStrategy
                };
                data = FilterUtil.filter(data, filteringState, grid);
            }
            if (hasSorting && !this.options.ignoreSorting) {
                this._sort = cloneValue(grid.sortingExpressions[0]);
                data = DataUtil.sort(data, grid.sortingExpressions, grid.sortStrategy, grid);
            }
            this.addHierarchicalGridData(grid, data);
        }
    }
    addHierarchicalGridData(grid, records) {
        const childLayoutList = grid.childLayoutList;
        const columnFields = this._ownersMap.get(grid).columns.map(col => col.field);
        for (const entry of records) {
            const expansionStateVal = grid.expansionStates.has(entry) ? grid.expansionStates.get(entry) : false;
            const dataWithoutChildren = Object.keys(entry)
                .filter(k => columnFields.includes(k))
                .reduce((obj, key) => {
                obj[key] = entry[key];
                return obj;
            }, {});
            const hierarchicalGridRecord = {
                data: dataWithoutChildren,
                level: 0,
                type: ExportRecordType.HierarchicalGridRecord,
                owner: grid,
            };
            this.flatRecords.push(hierarchicalGridRecord);
            for (const island of childLayoutList) {
                const path = {
                    rowID: island.primaryKey ? entry[island.primaryKey] : entry,
                    rowIslandKey: island.key
                };
                const islandGrid = grid?.gridAPI.getChildGrid([path]);
                const keyRecordData = this.prepareIslandData(island, islandGrid, entry[island.key]) || [];
                this.getAllChildColumnsAndData(island, keyRecordData, expansionStateVal, islandGrid);
            }
        }
    }
    prepareIslandData(island, islandGrid, data) {
        if (islandGrid !== undefined) {
            const hasFiltering = (islandGrid.filteringExpressionsTree &&
                islandGrid.filteringExpressionsTree.filteringOperands.length > 0) ||
                (islandGrid.advancedFilteringExpressionsTree &&
                    islandGrid.advancedFilteringExpressionsTree.filteringOperands.length > 0);
            const hasSorting = islandGrid.sortingExpressions &&
                islandGrid.sortingExpressions.length > 0;
            const skipOperations = (!hasFiltering || !this.options.ignoreFiltering) &&
                (!hasSorting || !this.options.ignoreSorting);
            if (skipOperations) {
                data = islandGrid.filteredSortedData;
            }
            else {
                if (hasFiltering && !this.options.ignoreFiltering) {
                    const filteringState = {
                        expressionsTree: islandGrid.filteringExpressionsTree,
                        advancedExpressionsTree: islandGrid.advancedFilteringExpressionsTree,
                        strategy: islandGrid.filterStrategy
                    };
                    data = FilterUtil.filter(data, filteringState, islandGrid);
                }
                if (hasSorting && !this.options.ignoreSorting) {
                    this._sort = cloneValue(islandGrid.sortingExpressions[0]);
                    data = DataUtil.sort(data, islandGrid.sortingExpressions, islandGrid.sortStrategy, islandGrid);
                }
            }
        }
        else {
            const hasFiltering = (island.filteringExpressionsTree &&
                island.filteringExpressionsTree.filteringOperands.length > 0) ||
                (island.advancedFilteringExpressionsTree &&
                    island.advancedFilteringExpressionsTree.filteringOperands.length > 0);
            const hasSorting = island.sortingExpressions &&
                island.sortingExpressions.length > 0;
            const skipOperations = (!hasFiltering || this.options.ignoreFiltering) &&
                (!hasSorting || this.options.ignoreSorting);
            if (!skipOperations) {
                if (hasFiltering && !this.options.ignoreFiltering) {
                    const filteringState = {
                        expressionsTree: island.filteringExpressionsTree,
                        advancedExpressionsTree: island.advancedFilteringExpressionsTree,
                        strategy: island.filterStrategy
                    };
                    data = FilterUtil.filter(data, filteringState, island);
                }
                if (hasSorting && !this.options.ignoreSorting) {
                    this._sort = cloneValue(island.sortingExpressions[0]);
                    data = DataUtil.sort(data, island.sortingExpressions, island.sortStrategy, island);
                }
            }
        }
        return data;
    }
    getAllChildColumnsAndData(island, childData, expansionStateVal, grid) {
        const columnList = this._ownersMap.get(island).columns;
        const columnHeader = columnList
            .filter(col => col.headerType === HeaderType.ColumnHeader)
            .map(col => col.header ? col.header : col.field);
        const headerRecord = {
            data: columnHeader,
            level: island.level,
            type: ExportRecordType.HeaderRecord,
            owner: island,
            hidden: !expansionStateVal
        };
        if (childData && childData.length > 0) {
            this.flatRecords.push(headerRecord);
            for (const rec of childData) {
                const exportRecord = {
                    data: rec,
                    level: island.level,
                    type: ExportRecordType.HierarchicalGridRecord,
                    owner: island,
                    hidden: !expansionStateVal
                };
                this.flatRecords.push(exportRecord);
                if (island.children.length > 0) {
                    const islandExpansionStateVal = grid === undefined ?
                        false :
                        grid.expansionStates.has(rec) ?
                            grid.expansionStates.get(rec) :
                            false;
                    for (const childIsland of island.children) {
                        const path = {
                            rowID: childIsland.primaryKey ? rec[childIsland.primaryKey] : rec,
                            rowIslandKey: childIsland.key
                        };
                        const childIslandGrid = grid?.gridAPI.getChildGrid([path]);
                        const keyRecordData = this.prepareIslandData(island, childIslandGrid, rec[childIsland.key]) || [];
                        this.getAllChildColumnsAndData(childIsland, keyRecordData, islandExpansionStateVal, childIslandGrid);
                    }
                }
            }
        }
    }
    prepareGridData(grid, hasFiltering, hasSorting) {
        const groupedGridGroupingState = {
            expressions: grid.groupingExpressions,
            expansion: grid.groupingExpansionState,
            defaultExpanded: grid.groupsExpanded,
        };
        const hasGrouping = grid.groupingExpressions &&
            grid.groupingExpressions.length > 0;
        const skipOperations = (!hasFiltering || !this.options.ignoreFiltering) &&
            (!hasSorting || !this.options.ignoreSorting) &&
            (!hasGrouping || !this.options.ignoreGrouping);
        if (skipOperations) {
            if (hasGrouping) {
                this.addGroupedData(grid, grid.groupsRecords, groupedGridGroupingState);
            }
            else {
                this.addFlatData(grid.filteredSortedData);
            }
        }
        else {
            let gridData = grid.data;
            if (hasFiltering && !this.options.ignoreFiltering) {
                const filteringState = {
                    expressionsTree: grid.filteringExpressionsTree,
                    advancedExpressionsTree: grid.advancedFilteringExpressionsTree,
                    strategy: grid.filterStrategy
                };
                gridData = FilterUtil.filter(gridData, filteringState, grid);
            }
            if (hasSorting && !this.options.ignoreSorting) {
                // TODO: We should drop support for this since in a grouped grid it doesn't make sense
                // this._sort = !isGroupedGrid ?
                //     cloneValue(grid.sortingExpressions[0]) :
                //     grid.sortingExpressions.length > 1 ?
                //         cloneValue(grid.sortingExpressions[1]) :
                //         cloneValue(grid.sortingExpressions[0]);
                gridData = DataUtil.sort(gridData, grid.sortingExpressions, grid.sortStrategy, grid);
            }
            if (hasGrouping && !this.options.ignoreGrouping) {
                const groupsRecords = [];
                DataUtil.group(cloneArray(gridData), groupedGridGroupingState, grid.groupStrategy, grid, groupsRecords);
                gridData = groupsRecords;
            }
            if (hasGrouping && !this.options.ignoreGrouping) {
                this.addGroupedData(grid, gridData, groupedGridGroupingState);
            }
            else {
                this.addFlatData(gridData);
            }
        }
    }
    prepareTreeGridData(grid, hasFiltering, hasSorting) {
        const skipOperations = (!hasFiltering || !this.options.ignoreFiltering) &&
            (!hasSorting || !this.options.ignoreSorting);
        if (skipOperations) {
            this.addTreeGridData(grid.processedRootRecords);
        }
        else {
            let gridData = grid.rootRecords;
            if (hasFiltering && !this.options.ignoreFiltering) {
                const filteringState = {
                    expressionsTree: grid.filteringExpressionsTree,
                    advancedExpressionsTree: grid.advancedFilteringExpressionsTree,
                    strategy: (grid.filterStrategy) ? grid.filterStrategy : new TreeGridFilteringStrategy()
                };
                gridData = filteringState.strategy
                    .filter(gridData, filteringState.expressionsTree, filteringState.advancedExpressionsTree);
            }
            if (hasSorting && !this.options.ignoreSorting) {
                this._sort = cloneValue(grid.sortingExpressions[0]);
                gridData = DataUtil.treeGridSort(gridData, grid.sortingExpressions, grid.sortStrategy);
            }
            this.addTreeGridData(gridData);
        }
    }
    addTreeGridData(records, parentExpanded = true) {
        if (!records) {
            return;
        }
        for (const record of records) {
            const hierarchicalRecord = {
                data: record.data,
                level: record.level,
                hidden: !parentExpanded,
                type: ExportRecordType.TreeGridRecord
            };
            this.flatRecords.push(hierarchicalRecord);
            this.addTreeGridData(record.children, parentExpanded && record.expanded);
        }
    }
    addFlatData(records) {
        if (!records) {
            return;
        }
        for (const record of records) {
            const data = {
                data: record,
                type: ExportRecordType.DataRecord,
                level: 0
            };
            this.flatRecords.push(data);
        }
    }
    addGroupedData(grid, records, groupingState, parentExpanded = true) {
        if (!records) {
            return;
        }
        const firstCol = this._ownersMap.get(DEFAULT_OWNER).columns[0].field;
        for (const record of records) {
            let recordVal = record.value;
            const hierarchy = getHierarchy(record);
            const expandState = groupingState.expansion.find((s) => isHierarchyMatch(s.hierarchy || [{ fieldName: record.expression.fieldName, value: recordVal }], hierarchy));
            const expanded = expandState ? expandState.expanded : groupingState.defaultExpanded;
            const isDate = recordVal instanceof Date;
            if (isDate) {
                const timeZoneOffset = recordVal.getTimezoneOffset() * 60000;
                const isoString = (new Date(recordVal - timeZoneOffset)).toISOString();
                const pipe = new DatePipe(grid.locale);
                recordVal = pipe.transform(isoString);
            }
            const groupExpressionName = record.column && record.column.header ?
                record.column.header :
                record.expression.fieldName;
            recordVal = recordVal !== null ? recordVal : '';
            const groupExpression = {
                data: { [firstCol]: `${groupExpressionName}: ${recordVal} (${record.records.length})` },
                level: record.level,
                hidden: !parentExpanded,
                type: ExportRecordType.GroupedRecord,
            };
            this.flatRecords.push(groupExpression);
            if (record.groups.length > 0) {
                this.addGroupedData(grid, record.groups, groupingState, expanded && parentExpanded);
            }
            else {
                const rowRecords = record.records;
                for (const rowRecord of rowRecords) {
                    const currentRecord = {
                        data: rowRecord,
                        level: record.level + 1,
                        hidden: !(expanded && parentExpanded),
                        type: ExportRecordType.DataRecord,
                    };
                    this.flatRecords.push(currentRecord);
                }
            }
        }
    }
    getColumns(columns) {
        const colList = [];
        const colWidthList = [];
        const hiddenColumns = [];
        let indexOfLastPinnedColumn = -1;
        let lastVisibleColumnIndex = -1;
        let maxLevel = 0;
        columns.forEach((column) => {
            const columnHeader = !ExportUtilities.isNullOrWhitespaces(column.header) ? column.header : column.field;
            const exportColumn = !column.hidden || this.options.ignoreColumnsVisibility;
            const index = this.options.ignoreColumnsOrder || this.options.ignoreColumnsVisibility ? column.index : column.visibleIndex;
            const columnWidth = Number(column.width?.slice(0, -2)) || DEFAULT_COLUMN_WIDTH;
            const columnLevel = !this.options.ignoreMultiColumnHeaders ? column.level : 0;
            const isMultiColHeader = column.columnGroup;
            const colSpan = isMultiColHeader ?
                column.allChildren
                    .filter(ch => !(ch.columnGroup) && (!this.options.ignoreColumnsVisibility ? !ch.hidden : true))
                    .length :
                1;
            const columnInfo = {
                header: columnHeader,
                dataType: column.dataType,
                field: column.field,
                skip: !exportColumn,
                formatter: column.formatter,
                skipFormatter: false,
                headerType: isMultiColHeader ? HeaderType.MultiColumnHeader : HeaderType.ColumnHeader,
                columnSpan: colSpan,
                level: columnLevel,
                startIndex: index,
                pinnedIndex: !column.pinned ?
                    Number.MAX_VALUE :
                    !column.hidden ?
                        column.grid.pinnedColumns.indexOf(column)
                        : NaN,
                columnGroupParent: column.parent ? column.parent : null,
                columnGroup: isMultiColHeader ? column : null
            };
            if (this.options.ignoreColumnsOrder) {
                if (columnInfo.startIndex !== columnInfo.pinnedIndex) {
                    columnInfo.pinnedIndex = Number.MAX_VALUE;
                }
            }
            if (column.level > maxLevel && !this.options.ignoreMultiColumnHeaders) {
                maxLevel = column.level;
            }
            if (index !== -1) {
                colList.push(columnInfo);
                colWidthList.push(columnWidth);
                lastVisibleColumnIndex = Math.max(lastVisibleColumnIndex, colList.indexOf(columnInfo));
            }
            else {
                hiddenColumns.push(columnInfo);
            }
            if (column.pinned && exportColumn && columnInfo.headerType === HeaderType.ColumnHeader) {
                indexOfLastPinnedColumn++;
            }
        });
        //Append the hidden columns to the end of the list
        hiddenColumns.forEach((hiddenColumn) => {
            colList[++lastVisibleColumnIndex] = hiddenColumn;
        });
        const result = {
            columns: colList,
            columnWidths: colWidthList,
            indexOfLastPinnedColumn,
            maxLevel
        };
        return result;
    }
    mapHierarchicalGridColumns(island, gridData) {
        let columnList;
        let keyData;
        if (island.autoGenerate) {
            keyData = gridData[island.key];
            const islandKeys = island.children.map(i => i.key);
            const islandData = keyData.map(i => {
                const newItem = {};
                Object.keys(i).map(k => {
                    if (!islandKeys.includes(k)) {
                        newItem[k] = i[k];
                    }
                });
                return newItem;
            });
            columnList = this.getAutoGeneratedColumns(islandData);
        }
        else {
            const islandColumnList = island.childColumns.toArray();
            columnList = this.getColumns(islandColumnList);
        }
        this._ownersMap.set(island, columnList);
        if (island.children.length > 0) {
            for (const childIsland of island.children) {
                const islandKeyData = keyData !== undefined ? keyData[0] : {};
                this.mapHierarchicalGridColumns(childIsland, islandKeyData);
            }
        }
    }
    getAutoGeneratedColumns(data) {
        const colList = [];
        const colWidthList = [];
        const keys = Object.keys(data[0]);
        keys.forEach((colKey, i) => {
            const columnInfo = {
                header: colKey,
                field: colKey,
                dataType: 'string',
                skip: false,
                headerType: HeaderType.ColumnHeader,
                columnSpan: 1,
                level: 0,
                startIndex: i,
                pinnedIndex: Number.MAX_VALUE
            };
            colList.push(columnInfo);
            colWidthList.push(DEFAULT_COLUMN_WIDTH);
        });
        const result = {
            columns: colList,
            columnWidths: colWidthList,
            indexOfLastPinnedColumn: -1,
            maxLevel: 0,
        };
        return result;
    }
    resetDefaults() {
        this._sort = null;
        this.flatRecords = [];
        this.options = {};
        this._ownersMap.clear();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1leHBvcnQtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZXJ2aWNlcy9leHBvcnRlci1jb21tb24vYmFzZS1leHBvcnQtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFrQixpQkFBaUIsRUFBRSxZQUFZLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzRyxPQUFPLEVBQXNCLFFBQVEsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUdyRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUUvRixPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHbEYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUV0RSxNQUFNLENBQU4sSUFBWSxnQkFNWDtBQU5ELFdBQVksZ0JBQWdCO0lBQ3hCLG1EQUErQixDQUFBO0lBQy9CLHFEQUFpQyxDQUFBO0lBQ2pDLDZDQUF5QixDQUFBO0lBQ3pCLHFFQUFpRCxDQUFBO0lBQ2pELGlEQUE2QixDQUFBO0FBQ2pDLENBQUMsRUFOVyxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBTTNCO0FBRUQsTUFBTSxDQUFOLElBQVksVUFHWDtBQUhELFdBQVksVUFBVTtJQUNsQiwyQ0FBNkIsQ0FBQTtJQUM3QixxREFBdUMsQ0FBQTtBQUMzQyxDQUFDLEVBSFcsVUFBVSxLQUFWLFVBQVUsUUFHckI7QUFnR0Q7OztFQUdFO0FBQ0YsTUFBTSwy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RUFBRSxNQUFNO2dCQUNkLEtBQUssRUFBRSxNQUFNO2dCQUNiLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixJQUFJLEVBQUUsS0FBSztnQkFDWCxVQUFVLEVBQUUsVUFBVSxDQUFDLFlBQVk7Z0JBQ25DLFVBQVUsRUFBRSxDQUFDO2dCQUNiLEtBQUssRUFBRSxDQUFDO2dCQUNSLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FBUzthQUNoQyxDQUFDO1lBRUYsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN6QixZQUFZLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBZ0I7WUFDeEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1lBQzNCLFFBQVEsRUFBRSxDQUFDO1NBQ2QsQ0FBQztRQUVGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxhQUFhO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBNEIsQ0FBQztRQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzVCLENBQUM7Q0FHSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY2xvbmVBcnJheSwgY2xvbmVWYWx1ZSwgSUJhc2VFdmVudEFyZ3MsIHJlc29sdmVOZXN0ZWRQYXRoLCB5aWVsZGluZ0xvb3AgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IEdyaWRDb2x1bW5EYXRhVHlwZSwgRGF0YVV0aWwgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7IEV4cG9ydFV0aWxpdGllcyB9IGZyb20gJy4vZXhwb3J0LXV0aWxpdGllcyc7XG5pbXBvcnQgeyBJZ3hFeHBvcnRlck9wdGlvbnNCYXNlIH0gZnJvbSAnLi9leHBvcnRlci1vcHRpb25zLWJhc2UnO1xuaW1wb3J0IHsgSVRyZWVHcmlkUmVjb3JkIH0gZnJvbSAnLi4vLi4vZ3JpZHMvdHJlZS1ncmlkL3RyZWUtZ3JpZC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFRyZWVHcmlkRmlsdGVyaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi8uLi9ncmlkcy90cmVlLWdyaWQvdHJlZS1ncmlkLmZpbHRlcmluZy5zdHJhdGVneSc7XG5pbXBvcnQgeyBJR3JvdXBpbmdTdGF0ZSB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGJ5LXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBnZXRIaWVyYXJjaHksIGlzSGllcmFyY2h5TWF0Y2ggfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvb3BlcmF0aW9ucyc7XG5pbXBvcnQgeyBJR3JvdXBCeUV4cGFuZFN0YXRlIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2dyb3VwYnktZXhwYW5kLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRmlsdGVyaW5nU3RhdGUgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEYXRlUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBJR3JvdXBCeVJlY29yZCB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGJ5LXJlY29yZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSwgR3JpZFR5cGUsIElQYXRoU2VnbWVudCB9IGZyb20gJy4uLy4uL2dyaWRzL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBGaWx0ZXJVdGlsIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1zdHJhdGVneSc7XG5cbmV4cG9ydCBlbnVtIEV4cG9ydFJlY29yZFR5cGUge1xuICAgIEdyb3VwZWRSZWNvcmQgPSAnR3JvdXBlZFJlY29yZCcsXG4gICAgVHJlZUdyaWRSZWNvcmQgPSAnVHJlZUdyaWRSZWNvcmQnLFxuICAgIERhdGFSZWNvcmQgPSAnRGF0YVJlY29yZCcsXG4gICAgSGllcmFyY2hpY2FsR3JpZFJlY29yZCA9ICdIaWVyYXJjaGljYWxHcmlkUmVjb3JkJyxcbiAgICBIZWFkZXJSZWNvcmQgPSAnSGVhZGVyUmVjb3JkJyxcbn1cblxuZXhwb3J0IGVudW0gSGVhZGVyVHlwZSB7XG4gICAgQ29sdW1uSGVhZGVyID0gJ0NvbHVtbkhlYWRlcicsXG4gICAgTXVsdGlDb2x1bW5IZWFkZXIgPSAnTXVsdGlDb2x1bW5IZWFkZXInXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUV4cG9ydFJlY29yZCB7XG4gICAgZGF0YTogYW55O1xuICAgIGxldmVsOiBudW1iZXI7XG4gICAgdHlwZTogRXhwb3J0UmVjb3JkVHlwZTtcbiAgICBvd25lcj86IHN0cmluZyB8IEdyaWRUeXBlO1xuICAgIGhpZGRlbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbHVtbkxpc3Qge1xuICAgIGNvbHVtbnM6IElDb2x1bW5JbmZvW107XG4gICAgY29sdW1uV2lkdGhzOiBudW1iZXJbXTtcbiAgICBpbmRleE9mTGFzdFBpbm5lZENvbHVtbjogbnVtYmVyO1xuICAgIG1heExldmVsPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElDb2x1bW5JbmZvIHtcbiAgICBoZWFkZXI6IHN0cmluZztcbiAgICBmaWVsZDogc3RyaW5nO1xuICAgIHNraXA6IGJvb2xlYW47XG4gICAgZGF0YVR5cGU/OiBHcmlkQ29sdW1uRGF0YVR5cGU7XG4gICAgc2tpcEZvcm1hdHRlcj86IGJvb2xlYW47XG4gICAgZm9ybWF0dGVyPzogYW55O1xuICAgIGhlYWRlclR5cGU/OiBIZWFkZXJUeXBlO1xuICAgIHN0YXJ0SW5kZXg/OiBudW1iZXI7XG4gICAgY29sdW1uU3Bhbj86IG51bWJlcjtcbiAgICBsZXZlbD86IG51bWJlcjtcbiAgICBleHBvcnRJbmRleD86IG51bWJlcjtcbiAgICBwaW5uZWRJbmRleD86IG51bWJlcjtcbiAgICBjb2x1bW5Hcm91cFBhcmVudD86IENvbHVtblR5cGU7XG4gICAgY29sdW1uR3JvdXA/OiBDb2x1bW5UeXBlO1xufVxuLyoqXG4gKiByb3dFeHBvcnRpbmcgZXZlbnQgYXJndW1lbnRzXG4gKiB0aGlzLmV4cG9ydGVyU2VydmljZS5yb3dFeHBvcnRpbmcuc3Vic2NyaWJlKChhcmdzOiBJUm93RXhwb3J0aW5nRXZlbnRBcmdzKSA9PiB7XG4gKiAvLyBzZXQgYXJncyBwcm9wZXJ0aWVzIGhlcmVcbiAqIH0pXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJvd0V4cG9ydGluZ0V2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICAvKipcbiAgICAgKiBDb250YWlucyB0aGUgZXhwb3J0aW5nIHJvdyBkYXRhXG4gICAgICovXG4gICAgcm93RGF0YTogYW55O1xuXG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgdGhlIGV4cG9ydGluZyByb3cgaW5kZXhcbiAgICAgKi9cbiAgICByb3dJbmRleDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogU2tpcCB0aGUgZXhwb3J0aW5nIHJvdyB3aGVuIHNldCB0byB0cnVlXG4gICAgICovXG4gICAgY2FuY2VsOiBib29sZWFuO1xufVxuXG4vKipcbiAqIGNvbHVtbkV4cG9ydGluZyBldmVudCBhcmd1bWVudHNcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHRoaXMuZXhwb3J0ZXJTZXJ2aWNlLmNvbHVtbkV4cG9ydGluZy5zdWJzY3JpYmUoKGFyZ3M6IElDb2x1bW5FeHBvcnRpbmdFdmVudEFyZ3MpID0+IHtcbiAqIC8vIHNldCBhcmdzIHByb3BlcnRpZXMgaGVyZVxuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ29sdW1uRXhwb3J0aW5nRXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VFdmVudEFyZ3Mge1xuICAgIC8qKlxuICAgICAqIENvbnRhaW5zIHRoZSBleHBvcnRpbmcgY29sdW1uIGhlYWRlclxuICAgICAqL1xuICAgIGhlYWRlcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgdGhlIGV4cG9ydGluZyBjb2x1bW4gZmllbGQgbmFtZVxuICAgICAqL1xuICAgIGZpZWxkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDb250YWlucyB0aGUgZXhwb3J0aW5nIGNvbHVtbiBpbmRleFxuICAgICAqL1xuICAgIGNvbHVtbkluZGV4OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBTa2lwIHRoZSBleHBvcnRpbmcgY29sdW1uIHdoZW4gc2V0IHRvIHRydWVcbiAgICAgKi9cbiAgICBjYW5jZWw6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBFeHBvcnQgdGhlIGNvbHVtbidzIGRhdGEgd2l0aG91dCBhcHBseWluZyBpdHMgZm9ybWF0dGVyLCB3aGVuIHNldCB0byB0cnVlXG4gICAgICovXG4gICAgc2tpcEZvcm1hdHRlcjogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBncmlkIG93bmVyLlxuICAgICAqL1xuICAgIGdyaWQ/OiBHcmlkVHlwZTtcbn1cblxuLyoqaGlkZGVuXG4gKiBBIGhlbHBlciBjbGFzcyB1c2VkIHRvIGlkZW50aWZ5IHdoZXRoZXIgdGhlIHVzZXIgaGFzIHNldCBhIHNwZWNpZmljIGNvbHVtbkluZGV4XG4gKiBkdXJpbmcgY29sdW1uRXhwb3J0aW5nLCBzbyB3ZSBjYW4gaG9ub3IgaXQgYXQgdGhlIGV4cG9ydGVkIGZpbGUuXG4qL1xuY2xhc3MgSWd4Q29sdW1uRXhwb3J0aW5nRXZlbnRBcmdzIGltcGxlbWVudHMgSUNvbHVtbkV4cG9ydGluZ0V2ZW50QXJncyB7XG4gICAgcHVibGljIGhlYWRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBmaWVsZDogc3RyaW5nO1xuICAgIHB1YmxpYyBjYW5jZWw6IGJvb2xlYW47XG4gICAgcHVibGljIHNraXBGb3JtYXR0ZXI6IGJvb2xlYW47XG4gICAgcHVibGljIGdyaWQ/OiBHcmlkVHlwZTtcbiAgICBwdWJsaWMgb3duZXI/OiBhbnk7XG4gICAgcHVibGljIHVzZXJTZXRJbmRleD8gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgX2NvbHVtbkluZGV4PzogbnVtYmVyO1xuXG4gICAgcHVibGljIGdldCBjb2x1bW5JbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1uSW5kZXg7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBjb2x1bW5JbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2NvbHVtbkluZGV4ID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXNlclNldEluZGV4ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihvcmlnaW5hbDogSUNvbHVtbkV4cG9ydGluZ0V2ZW50QXJncykge1xuICAgICAgICB0aGlzLmhlYWRlciA9IG9yaWdpbmFsLmhlYWRlcjtcbiAgICAgICAgdGhpcy5maWVsZCA9IG9yaWdpbmFsLmZpZWxkO1xuICAgICAgICB0aGlzLmNhbmNlbCA9IG9yaWdpbmFsLmNhbmNlbDtcbiAgICAgICAgdGhpcy5za2lwRm9ybWF0dGVyID0gb3JpZ2luYWwuc2tpcEZvcm1hdHRlcjtcbiAgICAgICAgdGhpcy5ncmlkID0gb3JpZ2luYWwuZ3JpZDtcbiAgICAgICAgdGhpcy5vd25lciA9IG9yaWdpbmFsLm93bmVyO1xuICAgICAgICB0aGlzLl9jb2x1bW5JbmRleCA9IG9yaWdpbmFsLmNvbHVtbkluZGV4O1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1dORVIgPSAnZGVmYXVsdCc7XG5jb25zdCBERUZBVUxUX0NPTFVNTl9XSURUSCA9IDguNDM7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJZ3hCYXNlRXhwb3J0ZXIge1xuXG4gICAgcHVibGljIGV4cG9ydEVuZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgcm93IGlzIGV4cG9ydGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmV4cG9ydGVyU2VydmljZS5yb3dFeHBvcnRpbmcuc3Vic2NyaWJlKChhcmdzOiBJUm93RXhwb3J0aW5nRXZlbnRBcmdzKSA9PiB7XG4gICAgICogLy8gcHV0IGV2ZW50IGhhbmRsZXIgY29kZSBoZXJlXG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4QmFzZUV4cG9ydGVyXG4gICAgICovXG4gICAgcHVibGljIHJvd0V4cG9ydGluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SVJvd0V4cG9ydGluZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIGEgY29sdW1uIGlzIGV4cG9ydGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLmV4cG9ydGVyU2VydmljZS5jb2x1bW5FeHBvcnRpbmcuc3Vic2NyaWJlKChhcmdzOiBJQ29sdW1uRXhwb3J0aW5nRXZlbnRBcmdzKSA9PiB7XG4gICAgICogLy8gcHV0IGV2ZW50IGhhbmRsZXIgY29kZSBoZXJlXG4gICAgICogfSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4QmFzZUV4cG9ydGVyXG4gICAgICovXG4gICAgcHVibGljIGNvbHVtbkV4cG9ydGluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUNvbHVtbkV4cG9ydGluZ0V2ZW50QXJncz4oKTtcblxuICAgIHByb3RlY3RlZCBfc29ydCA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF9vd25lcnNNYXA6IE1hcDxhbnksIElDb2x1bW5MaXN0PiA9IG5ldyBNYXA8YW55LCBJQ29sdW1uTGlzdD4oKTtcblxuICAgIHByaXZhdGUgZmxhdFJlY29yZHM6IElFeHBvcnRSZWNvcmRbXSA9IFtdO1xuICAgIHByaXZhdGUgb3B0aW9uczogSWd4RXhwb3J0ZXJPcHRpb25zQmFzZTtcblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBmb3IgZXhwb3J0aW5nIElneEdyaWQgY29tcG9uZW50J3MgZGF0YS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5leHBvcnRlclNlcnZpY2UuZXhwb3J0KHRoaXMuaWd4R3JpZEZvckV4cG9ydCwgdGhpcy5leHBvcnRPcHRpb25zKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hCYXNlRXhwb3J0ZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwb3J0KGdyaWQ6IGFueSwgb3B0aW9uczogSWd4RXhwb3J0ZXJPcHRpb25zQmFzZSk6IHZvaWQge1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdObyBvcHRpb25zIHByb3ZpZGVkIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgbGV0IGNvbHVtbnMgPSBncmlkLmNvbHVtbkxpc3QudG9BcnJheSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlTXVsdGlDb2x1bW5IZWFkZXJzKSB7XG4gICAgICAgICAgICBjb2x1bW5zID0gY29sdW1ucy5maWx0ZXIoY29sID0+IGNvbC5jaGlsZHJlbiA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbHVtbkxpc3QgPSB0aGlzLmdldENvbHVtbnMoY29sdW1ucyk7XG5cbiAgICAgICAgY29uc3QgdGFnTmFtZSA9IGdyaWQubmF0aXZlRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdpZ3gtaGllcmFyY2hpY2FsLWdyaWQnKSB7XG4gICAgICAgICAgICB0aGlzLl9vd25lcnNNYXAuc2V0KGdyaWQsIGNvbHVtbkxpc3QpO1xuXG4gICAgICAgICAgICBjb25zdCBjaGlsZExheW91dExpc3QgPSBncmlkLmNoaWxkTGF5b3V0TGlzdDtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpc2xhbmQgb2YgY2hpbGRMYXlvdXRMaXN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXBIaWVyYXJjaGljYWxHcmlkQ29sdW1ucyhpc2xhbmQsIGdyaWQuZGF0YVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vd25lcnNNYXAuc2V0KERFRkFVTFRfT1dORVIsIGNvbHVtbkxpc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlRGF0YShncmlkKTtcbiAgICAgICAgdGhpcy5leHBvcnRHcmlkUmVjb3Jkc0RhdGEodGhpcy5mbGF0UmVjb3JkcywgZ3JpZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGZvciBleHBvcnRpbmcgYW55IGtpbmQgb2YgYXJyYXkgZGF0YS5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5leHBvcnRlclNlcnZpY2UuZXhwb3J0RGF0YSh0aGlzLmFycmF5Rm9yRXhwb3J0LCB0aGlzLmV4cG9ydE9wdGlvbnMpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEJhc2VFeHBvcnRlclxuICAgICAqL1xuICAgIHB1YmxpYyBleHBvcnREYXRhKGRhdGE6IGFueVtdLCBvcHRpb25zOiBJZ3hFeHBvcnRlck9wdGlvbnNCYXNlKTogdm9pZCB7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ05vIG9wdGlvbnMgcHJvdmlkZWQhJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBkYXRhLm1hcChkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZDogSUV4cG9ydFJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkLFxuICAgICAgICAgICAgICAgIHR5cGU6IEV4cG9ydFJlY29yZFR5cGUuRGF0YVJlY29yZCxcbiAgICAgICAgICAgICAgICBsZXZlbDogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5leHBvcnRHcmlkUmVjb3Jkc0RhdGEocmVjb3Jkcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHBvcnRHcmlkUmVjb3Jkc0RhdGEocmVjb3JkczogSUV4cG9ydFJlY29yZFtdLCBncmlkPzogR3JpZFR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX293bmVyc01hcC5zaXplID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzRGF0YSA9IHJlY29yZHMubWFwKHIgPT4gci5kYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBFeHBvcnRVdGlsaXRpZXMuZ2V0S2V5c0Zyb21EYXRhKHJlY29yZHNEYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBrZXlzLm1hcCgoaykgPT5cbiAgICAgICAgICAgICAgICAoeyBoZWFkZXI6IGssIGZpZWxkOiBrLCBza2lwOiBmYWxzZSwgaGVhZGVyVHlwZTogSGVhZGVyVHlwZS5Db2x1bW5IZWFkZXIsIGxldmVsOiAwLCBjb2x1bW5TcGFuOiAxIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbldpZHRocyA9IG5ldyBBcnJheTxudW1iZXI+KGtleXMubGVuZ3RoKS5maWxsKERFRkFVTFRfQ09MVU1OX1dJRFRIKTtcblxuICAgICAgICAgICAgY29uc3QgbWFwUmVjb3JkOiBJQ29sdW1uTGlzdCA9IHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLFxuICAgICAgICAgICAgICAgIGNvbHVtbldpZHRocyxcbiAgICAgICAgICAgICAgICBpbmRleE9mTGFzdFBpbm5lZENvbHVtbjogLTEsXG4gICAgICAgICAgICAgICAgbWF4TGV2ZWw6IDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuX293bmVyc01hcC5zZXQoREVGQVVMVF9PV05FUiwgbWFwUmVjb3JkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzaG91bGRSZW9yZGVyQ29sdW1ucyA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIG1hcFJlY29yZF0gb2YgdGhpcy5fb3duZXJzTWFwKSB7XG4gICAgICAgICAgICBsZXQgc2tpcHBlZFBpbm5lZENvbHVtbnNDb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgY29sdW1uc1dpdGhvdXRIZWFkZXJDb3VudCA9IDE7XG4gICAgICAgICAgICBsZXQgaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW4gPSBtYXBSZWNvcmQuaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW47XG5cbiAgICAgICAgICAgIG1hcFJlY29yZC5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbi5za2lwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkV4cG9ydEFyZ3M6IElDb2x1bW5FeHBvcnRpbmdFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXI6ICFFeHBvcnRVdGlsaXRpZXMuaXNOdWxsT3JXaGl0ZXNwYWNlcyhjb2x1bW4uaGVhZGVyKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uLmhlYWRlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbHVtbicgKyBjb2x1bW5zV2l0aG91dEhlYWRlckNvdW50KyssXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogY29sdW1uLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uSW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNraXBGb3JtYXR0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZDoga2V5ID09PSBERUZBVUxUX09XTkVSID8gZ3JpZCA6IGtleVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvbHVtbkV4cG9ydEFyZ3MgPSBuZXcgSWd4Q29sdW1uRXhwb3J0aW5nRXZlbnRBcmdzKGNvbHVtbkV4cG9ydEFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbHVtbkV4cG9ydGluZy5lbWl0KG5ld0NvbHVtbkV4cG9ydEFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5oZWFkZXIgPSBuZXdDb2x1bW5FeHBvcnRBcmdzLmhlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLnNraXAgPSBuZXdDb2x1bW5FeHBvcnRBcmdzLmNhbmNlbDtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uLnNraXBGb3JtYXR0ZXIgPSBuZXdDb2x1bW5FeHBvcnRBcmdzLnNraXBGb3JtYXR0ZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0NvbHVtbkV4cG9ydEFyZ3MudXNlclNldEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uZXhwb3J0SW5kZXggPSBuZXdDb2x1bW5FeHBvcnRBcmdzLmNvbHVtbkluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVvcmRlckNvbHVtbnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5za2lwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPD0gaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBza2lwcGVkUGlubmVkQ29sdW1uc0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ29sdW1uU3BhbnMoY29sdW1uLCBtYXBSZWNvcmQsIGNvbHVtbi5jb2x1bW5TcGFuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9uU2tpcHBlZENvbHVtbnMgPSBtYXBSZWNvcmQuY29sdW1ucy5maWx0ZXIoYyA9PiAhYy5za2lwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vblNraXBwZWRDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lcnNNYXAuZ2V0KGtleSkubWF4TGV2ZWwgPSBub25Ta2lwcGVkQ29sdW1ucy5zb3J0KChhLCBiKSA9PiBiLmxldmVsIC0gYS5sZXZlbClbMF0ubGV2ZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc29ydCAmJiB0aGlzLl9zb3J0LmZpZWxkTmFtZSA9PT0gY29sdW1uLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uLnNraXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3J0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc29ydC5maWVsZE5hbWUgPSBjb2x1bW4uaGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGluZGV4T2ZMYXN0UGlubmVkQ29sdW1uIC09IHNraXBwZWRQaW5uZWRDb2x1bW5zQ291bnQ7XG5cbiAgICAgICAgICAgIC8vIFJlb3JkZXIgY29sdW1ucyBvbmx5IGlmIGEgY29sdW1uIGhhcyBiZWVuIGFzc2lnbmVkIGEgc3BlY2lmaWMgY29sdW1uSW5kZXggZHVyaW5nIGNvbHVtbkV4cG9ydGluZyBldmVudFxuICAgICAgICAgICAgaWYgKHNob3VsZFJlb3JkZXJDb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgbWFwUmVjb3JkLmNvbHVtbnMgPSB0aGlzLnJlb3JkZXJDb2x1bW5zKG1hcFJlY29yZC5jb2x1bW5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgZGF0YVRvRXhwb3J0ID0gbmV3IEFycmF5PElFeHBvcnRSZWNvcmQ+KCk7XG4gICAgICAgIGNvbnN0IGFjdHVhbERhdGEgPSByZWNvcmRzWzBdPy5kYXRhO1xuICAgICAgICBjb25zdCBpc1NwZWNpYWxEYXRhID0gRXhwb3J0VXRpbGl0aWVzLmlzU3BlY2lhbERhdGEoYWN0dWFsRGF0YSk7XG5cbiAgICAgICAgeWllbGRpbmdMb29wKHJlY29yZHMubGVuZ3RoLCAxMDAsIChpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSByZWNvcmRzW2ldO1xuICAgICAgICAgICAgdGhpcy5leHBvcnRSb3coZGF0YVRvRXhwb3J0LCByb3csIGksIGlzU3BlY2lhbERhdGEpO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4cG9ydERhdGFJbXBsZW1lbnRhdGlvbihkYXRhVG9FeHBvcnQsIHRoaXMub3B0aW9ucywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXREZWZhdWx0cygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlQ29sdW1uU3BhbnMoY29sdW1uOiBJQ29sdW1uSW5mbywgbWFwUmVjb3JkOiBJQ29sdW1uTGlzdCwgc3BhbjogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjb2x1bW4uaGVhZGVyVHlwZSA9PT0gSGVhZGVyVHlwZS5NdWx0aUNvbHVtbkhlYWRlciAmJiBjb2x1bW4uc2tpcCkge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uR3JvdXBDaGlsZHJlbiA9IG1hcFJlY29yZC5jb2x1bW5zLmZpbHRlcihjID0+IGMuY29sdW1uR3JvdXBQYXJlbnQgPT09IGNvbHVtbi5jb2x1bW5Hcm91cCk7XG5cbiAgICAgICAgICAgIGNvbHVtbkdyb3VwQ2hpbGRyZW4uZm9yRWFjaChjZ2MgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjZ2MuaGVhZGVyVHlwZSA9PT0gSGVhZGVyVHlwZS5NdWx0aUNvbHVtbkhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBjZ2MuY29sdW1uU3BhbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNnYy5jb2x1bW5Hcm91cFBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGNnYy5za2lwID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNvbHVtblNwYW5zKGNnYywgbWFwUmVjb3JkLCBjZ2MuY29sdW1uU3Bhbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2djLnNraXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0Q29sID0gbWFwUmVjb3JkLmNvbHVtbnMuZmlsdGVyKGMgPT4gY29sdW1uLmNvbHVtbkdyb3VwUGFyZW50ICE9PSBudWxsICYmIGMuY29sdW1uR3JvdXAgPT09IGNvbHVtbi5jb2x1bW5Hcm91cFBhcmVudClbMF07XG4gICAgICAgIGlmICh0YXJnZXRDb2wgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGFyZ2V0Q29sLmNvbHVtblNwYW4gLT0gc3BhbjtcblxuICAgICAgICAgICAgaWYgKHRhcmdldENvbC5jb2x1bW5Hcm91cFBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ29sdW1uU3BhbnModGFyZ2V0Q29sLCBtYXBSZWNvcmQsIHNwYW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0Q29sLmNvbHVtblNwYW4gPT09IDApIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRDb2wuc2tpcCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGV4cG9ydFJvdyhkYXRhOiBJRXhwb3J0UmVjb3JkW10sIHJlY29yZDogSUV4cG9ydFJlY29yZCwgaW5kZXg6IG51bWJlciwgaXNTcGVjaWFsRGF0YTogYm9vbGVhbikge1xuICAgICAgICBpZiAoIWlzU3BlY2lhbERhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gcmVjb3JkLm93bmVyID09PSB1bmRlZmluZWQgPyBERUZBVUxUX09XTkVSIDogcmVjb3JkLm93bmVyO1xuICAgICAgICAgICAgY29uc3Qgb3duZXJDb2xzID0gdGhpcy5fb3duZXJzTWFwLmdldChvd25lcikuY29sdW1ucztcblxuICAgICAgICAgICAgaWYgKHJlY29yZC50eXBlICE9PSBFeHBvcnRSZWNvcmRUeXBlLkhlYWRlclJlY29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBvd25lckNvbHNcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihjID0+IGMuaGVhZGVyVHlwZSAhPT0gSGVhZGVyVHlwZS5NdWx0aUNvbHVtbkhlYWRlciAmJiAhYy5za2lwKVxuICAgICAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5zdGFydEluZGV4IC0gYi5zdGFydEluZGV4KVxuICAgICAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5waW5uZWRJbmRleCAtIGIucGlubmVkSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgcmVjb3JkLmRhdGEgPSBjb2x1bW5zLnJlZHVjZSgoYSwgZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWUuc2tpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJhd1ZhbHVlID0gcmVzb2x2ZU5lc3RlZFBhdGgocmVjb3JkLmRhdGEsIGUuZmllbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG91bGRBcHBseUZvcm1hdHRlciA9IGUuZm9ybWF0dGVyICYmICFlLnNraXBGb3JtYXR0ZXIgJiYgcmVjb3JkLnR5cGUgIT09IEV4cG9ydFJlY29yZFR5cGUuR3JvdXBlZFJlY29yZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUuZGF0YVR5cGUgPT09ICdkYXRlJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEocmF3VmFsdWUgaW5zdGFuY2VvZiBEYXRlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFzaG91bGRBcHBseUZvcm1hdHRlciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhd1ZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhd1ZhbHVlID0gbmV3IERhdGUocmF3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmRhdGFUeXBlID09PSAnc3RyaW5nJyAmJiByYXdWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdWYWx1ZSA9IHJhd1ZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFbZS5maWVsZF0gPSBzaG91bGRBcHBseUZvcm1hdHRlciA/IGUuZm9ybWF0dGVyKHJhd1ZhbHVlKSA6IHJhd1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRIZWFkZXJzID0gb3duZXJDb2xzLmZpbHRlcihjID0+IGMuc2tpcCkubWFwKGMgPT4gYy5oZWFkZXIgPyBjLmhlYWRlciA6IGMuZmllbGQpO1xuICAgICAgICAgICAgICAgIHJlY29yZC5kYXRhID0gcmVjb3JkLmRhdGEuZmlsdGVyKGQgPT4gZmlsdGVyZWRIZWFkZXJzLmluZGV4T2YoZCkgPT09IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJvd0FyZ3MgPSB7XG4gICAgICAgICAgICByb3dEYXRhOiByZWNvcmQuZGF0YSxcbiAgICAgICAgICAgIHJvd0luZGV4OiBpbmRleCxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJvd0V4cG9ydGluZy5lbWl0KHJvd0FyZ3MpO1xuXG4gICAgICAgIGlmICghcm93QXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgIGRhdGEucHVzaChyZWNvcmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW9yZGVyQ29sdW1ucyhjb2x1bW5zOiBJQ29sdW1uSW5mb1tdKTogSUNvbHVtbkluZm9bXSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkQ29sdW1ucyA9IGNvbHVtbnMuZmlsdGVyKGMgPT4gIWMuc2tpcCk7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGZpbHRlcmVkQ29sdW1ucy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNwZWNpZmljSW5kaWNlc0NvbHVtbnMgPSBmaWx0ZXJlZENvbHVtbnMuZmlsdGVyKChjb2wpID0+ICFpc05hTihjb2wuZXhwb3J0SW5kZXgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGEsYikgPT4gYS5leHBvcnRJbmRleCAtIGIuZXhwb3J0SW5kZXgpO1xuICAgICAgICBjb25zdCBpbmRpY2VzID0gc3BlY2lmaWNJbmRpY2VzQ29sdW1ucy5tYXAoY29sID0+IGNvbC5leHBvcnRJbmRleCk7XG5cbiAgICAgICAgc3BlY2lmaWNJbmRpY2VzQ29sdW1ucy5mb3JFYWNoKGNvbCA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJlZENvbHVtbnMuc3BsaWNlKGZpbHRlcmVkQ29sdW1ucy5pbmRleE9mKGNvbCksIDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZW9yZGVyZWRDb2x1bW5zID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgICAgaWYgKHNwZWNpZmljSW5kaWNlc0NvbHVtbnMubGVuZ3RoID4gTWF0aC5tYXgoLi4uaW5kaWNlcykpIHtcbiAgICAgICAgICAgIHJldHVybiBzcGVjaWZpY0luZGljZXNDb2x1bW5zLmNvbmNhdChmaWx0ZXJlZENvbHVtbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kaWNlcy5mb3JFYWNoKChpLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgMCB8fCBpID49IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZENvbHVtbnMucHVzaChzcGVjaWZpY0luZGljZXNDb2x1bW5zW2luZGV4XSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGsgPSBpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoayA8IGxlbmd0aCAmJiByZW9yZGVyZWRDb2x1bW5zW2tdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsraztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZW9yZGVyZWRDb2x1bW5zW2tdID0gc3BlY2lmaWNJbmRpY2VzQ29sdW1uc1tpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocmVvcmRlcmVkQ29sdW1uc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlb3JkZXJlZENvbHVtbnNbaV0gPSBmaWx0ZXJlZENvbHVtbnMuc3BsaWNlKDAsIDEpWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW9yZGVyZWRDb2x1bW5zO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZURhdGEoZ3JpZDogR3JpZFR5cGUpIHtcbiAgICAgICAgdGhpcy5mbGF0UmVjb3JkcyA9IFtdO1xuICAgICAgICBjb25zdCB0YWdOYW1lID0gZ3JpZC5uYXRpdmVFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBjb25zdCBoYXNGaWx0ZXJpbmcgPSAoZ3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgJiYgZ3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZmlsdGVyaW5nT3BlcmFuZHMubGVuZ3RoID4gMCkgfHxcbiAgICAgICAgICAgIChncmlkLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlICYmIGdyaWQuYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZmlsdGVyaW5nT3BlcmFuZHMubGVuZ3RoID4gMCk7XG5cbiAgICAgICAgY29uc3QgaGFzU29ydGluZyA9IGdyaWQuc29ydGluZ0V4cHJlc3Npb25zICYmXG4gICAgICAgICAgICBncmlkLnNvcnRpbmdFeHByZXNzaW9ucy5sZW5ndGggPiAwO1xuXG4gICAgICAgIHN3aXRjaCAodGFnTmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnaWd4LWhpZXJhcmNoaWNhbC1ncmlkJzoge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlcGFyZUhpZXJhcmNoaWNhbEdyaWREYXRhKGdyaWQsIGhhc0ZpbHRlcmluZywgaGFzU29ydGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdpZ3gtdHJlZS1ncmlkJzoge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlcGFyZVRyZWVHcmlkRGF0YShncmlkLCBoYXNGaWx0ZXJpbmcsIGhhc1NvcnRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIHRoaXMucHJlcGFyZUdyaWREYXRhKGdyaWQsIGhhc0ZpbHRlcmluZywgaGFzU29ydGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXBhcmVIaWVyYXJjaGljYWxHcmlkRGF0YShncmlkOiBHcmlkVHlwZSwgaGFzRmlsdGVyaW5nOiBib29sZWFuLCBoYXNTb3J0aW5nOiBib29sZWFuKSB7XG5cbiAgICAgICAgY29uc3Qgc2tpcE9wZXJhdGlvbnMgPVxuICAgICAgICAgICAgKCFoYXNGaWx0ZXJpbmcgfHwgIXRoaXMub3B0aW9ucy5pZ25vcmVGaWx0ZXJpbmcpICYmXG4gICAgICAgICAgICAoIWhhc1NvcnRpbmcgfHwgIXRoaXMub3B0aW9ucy5pZ25vcmVTb3J0aW5nKTtcblxuICAgICAgICBpZiAoc2tpcE9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBncmlkLmZpbHRlcmVkU29ydGVkRGF0YTtcbiAgICAgICAgICAgIHRoaXMuYWRkSGllcmFyY2hpY2FsR3JpZERhdGEoZ3JpZCwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IGdyaWQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKGhhc0ZpbHRlcmluZyAmJiAhdGhpcy5vcHRpb25zLmlnbm9yZUZpbHRlcmluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmluZ1N0YXRlOiBJRmlsdGVyaW5nU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zVHJlZTogZ3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsXG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkRXhwcmVzc2lvbnNUcmVlOiBncmlkLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICAgICAgICAgICAgICBzdHJhdGVneTogZ3JpZC5maWx0ZXJTdHJhdGVneVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gRmlsdGVyVXRpbC5maWx0ZXIoZGF0YSwgZmlsdGVyaW5nU3RhdGUsIGdyaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGFzU29ydGluZyAmJiAhdGhpcy5vcHRpb25zLmlnbm9yZVNvcnRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3J0ID0gY2xvbmVWYWx1ZShncmlkLnNvcnRpbmdFeHByZXNzaW9uc1swXSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gRGF0YVV0aWwuc29ydChkYXRhLCBncmlkLnNvcnRpbmdFeHByZXNzaW9ucywgZ3JpZC5zb3J0U3RyYXRlZ3ksIGdyaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFkZEhpZXJhcmNoaWNhbEdyaWREYXRhKGdyaWQsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRIaWVyYXJjaGljYWxHcmlkRGF0YShncmlkOiBHcmlkVHlwZSwgcmVjb3JkczogYW55W10pIHtcbiAgICAgICAgY29uc3QgY2hpbGRMYXlvdXRMaXN0ID0gZ3JpZC5jaGlsZExheW91dExpc3Q7XG4gICAgICAgIGNvbnN0IGNvbHVtbkZpZWxkcyA9IHRoaXMuX293bmVyc01hcC5nZXQoZ3JpZCkuY29sdW1ucy5tYXAoY29sID0+IGNvbC5maWVsZCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiByZWNvcmRzKSB7XG4gICAgICAgICAgICBjb25zdCBleHBhbnNpb25TdGF0ZVZhbCA9IGdyaWQuZXhwYW5zaW9uU3RhdGVzLmhhcyhlbnRyeSkgPyBncmlkLmV4cGFuc2lvblN0YXRlcy5nZXQoZW50cnkpIDogZmFsc2U7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGFXaXRob3V0Q2hpbGRyZW4gPSBPYmplY3Qua2V5cyhlbnRyeSlcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGsgPT4gY29sdW1uRmllbGRzLmluY2x1ZGVzKGspKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0gZW50cnlba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhpZXJhcmNoaWNhbEdyaWRSZWNvcmQ6IElFeHBvcnRSZWNvcmQgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVdpdGhvdXRDaGlsZHJlbixcbiAgICAgICAgICAgICAgICBsZXZlbDogMCxcbiAgICAgICAgICAgICAgICB0eXBlOiBFeHBvcnRSZWNvcmRUeXBlLkhpZXJhcmNoaWNhbEdyaWRSZWNvcmQsXG4gICAgICAgICAgICAgICAgb3duZXI6IGdyaWQsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmZsYXRSZWNvcmRzLnB1c2goaGllcmFyY2hpY2FsR3JpZFJlY29yZCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgaXNsYW5kIG9mIGNoaWxkTGF5b3V0TGlzdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGg6IElQYXRoU2VnbWVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93SUQ6IGlzbGFuZC5wcmltYXJ5S2V5ID8gZW50cnlbaXNsYW5kLnByaW1hcnlLZXldIDogZW50cnksXG4gICAgICAgICAgICAgICAgICAgIHJvd0lzbGFuZEtleTogaXNsYW5kLmtleVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpc2xhbmRHcmlkID0gZ3JpZD8uZ3JpZEFQSS5nZXRDaGlsZEdyaWQoW3BhdGhdKTtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlSZWNvcmREYXRhID0gdGhpcy5wcmVwYXJlSXNsYW5kRGF0YShpc2xhbmQsIGlzbGFuZEdyaWQsIGVudHJ5W2lzbGFuZC5rZXldKSB8fCBbXTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QWxsQ2hpbGRDb2x1bW5zQW5kRGF0YShpc2xhbmQsIGtleVJlY29yZERhdGEsIGV4cGFuc2lvblN0YXRlVmFsLCBpc2xhbmRHcmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZUlzbGFuZERhdGEoaXNsYW5kOiBhbnksIGlzbGFuZEdyaWQ6IEdyaWRUeXBlLCBkYXRhOiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgaWYgKGlzbGFuZEdyaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgaGFzRmlsdGVyaW5nID0gKGlzbGFuZEdyaWQuZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlICYmXG4gICAgICAgICAgICAgICAgaXNsYW5kR3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZmlsdGVyaW5nT3BlcmFuZHMubGVuZ3RoID4gMCkgfHxcbiAgICAgICAgICAgICAgICAoaXNsYW5kR3JpZC5hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSAmJlxuICAgICAgICAgICAgICAgICAgICBpc2xhbmRHcmlkLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLmZpbHRlcmluZ09wZXJhbmRzLmxlbmd0aCA+IDApO1xuXG4gICAgICAgICAgICBjb25zdCBoYXNTb3J0aW5nID0gaXNsYW5kR3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMgJiZcbiAgICAgICAgICAgICAgICBpc2xhbmRHcmlkLnNvcnRpbmdFeHByZXNzaW9ucy5sZW5ndGggPiAwO1xuXG4gICAgICAgICAgICBjb25zdCBza2lwT3BlcmF0aW9ucyA9XG4gICAgICAgICAgICAgICAgKCFoYXNGaWx0ZXJpbmcgfHwgIXRoaXMub3B0aW9ucy5pZ25vcmVGaWx0ZXJpbmcpICYmXG4gICAgICAgICAgICAgICAgKCFoYXNTb3J0aW5nIHx8ICF0aGlzLm9wdGlvbnMuaWdub3JlU29ydGluZyk7XG5cbiAgICAgICAgICAgIGlmIChza2lwT3BlcmF0aW9ucykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBpc2xhbmRHcmlkLmZpbHRlcmVkU29ydGVkRGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0ZpbHRlcmluZyAmJiAhdGhpcy5vcHRpb25zLmlnbm9yZUZpbHRlcmluZykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJpbmdTdGF0ZTogSUZpbHRlcmluZ1N0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbnNUcmVlOiBpc2xhbmRHcmlkLmZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkRXhwcmVzc2lvbnNUcmVlOiBpc2xhbmRHcmlkLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3k6IGlzbGFuZEdyaWQuZmlsdGVyU3RyYXRlZ3lcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gRmlsdGVyVXRpbC5maWx0ZXIoZGF0YSwgZmlsdGVyaW5nU3RhdGUsIGlzbGFuZEdyaWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChoYXNTb3J0aW5nICYmICF0aGlzLm9wdGlvbnMuaWdub3JlU29ydGluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3J0ID0gY2xvbmVWYWx1ZShpc2xhbmRHcmlkLnNvcnRpbmdFeHByZXNzaW9uc1swXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IERhdGFVdGlsLnNvcnQoZGF0YSwgaXNsYW5kR3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMsIGlzbGFuZEdyaWQuc29ydFN0cmF0ZWd5LCBpc2xhbmRHcmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBoYXNGaWx0ZXJpbmcgPSAoaXNsYW5kLmZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSAmJlxuICAgICAgICAgICAgICAgIGlzbGFuZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZmlsdGVyaW5nT3BlcmFuZHMubGVuZ3RoID4gMCkgfHxcbiAgICAgICAgICAgICAgICAoaXNsYW5kLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlICYmXG4gICAgICAgICAgICAgICAgICAgIGlzbGFuZC5hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZS5maWx0ZXJpbmdPcGVyYW5kcy5sZW5ndGggPiAwKTtcblxuICAgICAgICAgICAgY29uc3QgaGFzU29ydGluZyA9IGlzbGFuZC5zb3J0aW5nRXhwcmVzc2lvbnMgJiZcbiAgICAgICAgICAgICAgICBpc2xhbmQuc29ydGluZ0V4cHJlc3Npb25zLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgICAgIGNvbnN0IHNraXBPcGVyYXRpb25zID1cbiAgICAgICAgICAgICAgICAoIWhhc0ZpbHRlcmluZyB8fCB0aGlzLm9wdGlvbnMuaWdub3JlRmlsdGVyaW5nKSAmJlxuICAgICAgICAgICAgICAgICghaGFzU29ydGluZyB8fCB0aGlzLm9wdGlvbnMuaWdub3JlU29ydGluZyk7XG5cbiAgICAgICAgICAgIGlmICghc2tpcE9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzRmlsdGVyaW5nICYmICF0aGlzLm9wdGlvbnMuaWdub3JlRmlsdGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmluZ1N0YXRlOiBJRmlsdGVyaW5nU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uc1RyZWU6IGlzbGFuZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZHZhbmNlZEV4cHJlc3Npb25zVHJlZTogaXNsYW5kLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3k6IGlzbGFuZC5maWx0ZXJTdHJhdGVneVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBGaWx0ZXJVdGlsLmZpbHRlcihkYXRhLCBmaWx0ZXJpbmdTdGF0ZSwgaXNsYW5kKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzU29ydGluZyAmJiAhdGhpcy5vcHRpb25zLmlnbm9yZVNvcnRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc29ydCA9IGNsb25lVmFsdWUoaXNsYW5kLnNvcnRpbmdFeHByZXNzaW9uc1swXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IERhdGFVdGlsLnNvcnQoZGF0YSwgaXNsYW5kLnNvcnRpbmdFeHByZXNzaW9ucywgaXNsYW5kLnNvcnRTdHJhdGVneSwgaXNsYW5kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFsbENoaWxkQ29sdW1uc0FuZERhdGEoaXNsYW5kOiBhbnksXG4gICAgICAgIGNoaWxkRGF0YTogYW55W10sIGV4cGFuc2lvblN0YXRlVmFsOiBib29sZWFuLCBncmlkOiBHcmlkVHlwZSkge1xuICAgICAgICBjb25zdCBjb2x1bW5MaXN0ID0gdGhpcy5fb3duZXJzTWFwLmdldChpc2xhbmQpLmNvbHVtbnM7XG4gICAgICAgIGNvbnN0IGNvbHVtbkhlYWRlciA9IGNvbHVtbkxpc3RcbiAgICAgICAgICAgIC5maWx0ZXIoY29sID0+IGNvbC5oZWFkZXJUeXBlID09PSBIZWFkZXJUeXBlLkNvbHVtbkhlYWRlcilcbiAgICAgICAgICAgIC5tYXAoY29sID0+IGNvbC5oZWFkZXIgPyBjb2wuaGVhZGVyIDogY29sLmZpZWxkKTtcblxuICAgICAgICBjb25zdCBoZWFkZXJSZWNvcmQ6IElFeHBvcnRSZWNvcmQgPSB7XG4gICAgICAgICAgICBkYXRhOiBjb2x1bW5IZWFkZXIsXG4gICAgICAgICAgICBsZXZlbDogaXNsYW5kLmxldmVsLFxuICAgICAgICAgICAgdHlwZTogRXhwb3J0UmVjb3JkVHlwZS5IZWFkZXJSZWNvcmQsXG4gICAgICAgICAgICBvd25lcjogaXNsYW5kLFxuICAgICAgICAgICAgaGlkZGVuOiAhZXhwYW5zaW9uU3RhdGVWYWxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoY2hpbGREYXRhICYmIGNoaWxkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmZsYXRSZWNvcmRzLnB1c2goaGVhZGVyUmVjb3JkKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCByZWMgb2YgY2hpbGREYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwb3J0UmVjb3JkOiBJRXhwb3J0UmVjb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZWMsXG4gICAgICAgICAgICAgICAgICAgIGxldmVsOiBpc2xhbmQubGV2ZWwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEV4cG9ydFJlY29yZFR5cGUuSGllcmFyY2hpY2FsR3JpZFJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IGlzbGFuZCxcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuOiAhZXhwYW5zaW9uU3RhdGVWYWxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5mbGF0UmVjb3Jkcy5wdXNoKGV4cG9ydFJlY29yZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNsYW5kLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNsYW5kRXhwYW5zaW9uU3RhdGVWYWwgPSBncmlkID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5leHBhbnNpb25TdGF0ZXMuaGFzKHJlYykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuZXhwYW5zaW9uU3RhdGVzLmdldChyZWMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkSXNsYW5kIG9mIGlzbGFuZC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aDogSVBhdGhTZWdtZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0lEOiBjaGlsZElzbGFuZC5wcmltYXJ5S2V5ID8gcmVjW2NoaWxkSXNsYW5kLnByaW1hcnlLZXldIDogcmVjLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0lzbGFuZEtleTogY2hpbGRJc2xhbmQua2V5XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZElzbGFuZEdyaWQgPSBncmlkPy5ncmlkQVBJLmdldENoaWxkR3JpZChbcGF0aF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5UmVjb3JkRGF0YSA9IHRoaXMucHJlcGFyZUlzbGFuZERhdGEoaXNsYW5kLCBjaGlsZElzbGFuZEdyaWQsIHJlY1tjaGlsZElzbGFuZC5rZXldKSB8fCBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRBbGxDaGlsZENvbHVtbnNBbmREYXRhKGNoaWxkSXNsYW5kLCBrZXlSZWNvcmREYXRhLCBpc2xhbmRFeHBhbnNpb25TdGF0ZVZhbCwgY2hpbGRJc2xhbmRHcmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZUdyaWREYXRhKGdyaWQ6IEdyaWRUeXBlLCBoYXNGaWx0ZXJpbmc6IGJvb2xlYW4sIGhhc1NvcnRpbmc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgZ3JvdXBlZEdyaWRHcm91cGluZ1N0YXRlOiBJR3JvdXBpbmdTdGF0ZSA9IHtcbiAgICAgICAgICAgIGV4cHJlc3Npb25zOiBncmlkLmdyb3VwaW5nRXhwcmVzc2lvbnMsXG4gICAgICAgICAgICBleHBhbnNpb246IGdyaWQuZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZSxcbiAgICAgICAgICAgIGRlZmF1bHRFeHBhbmRlZDogZ3JpZC5ncm91cHNFeHBhbmRlZCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYXNHcm91cGluZyA9IGdyaWQuZ3JvdXBpbmdFeHByZXNzaW9ucyAmJlxuICAgICAgICAgICAgZ3JpZC5ncm91cGluZ0V4cHJlc3Npb25zLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgY29uc3Qgc2tpcE9wZXJhdGlvbnMgPVxuICAgICAgICAgICAgKCFoYXNGaWx0ZXJpbmcgfHwgIXRoaXMub3B0aW9ucy5pZ25vcmVGaWx0ZXJpbmcpICYmXG4gICAgICAgICAgICAoIWhhc1NvcnRpbmcgfHwgIXRoaXMub3B0aW9ucy5pZ25vcmVTb3J0aW5nKSAmJlxuICAgICAgICAgICAgKCFoYXNHcm91cGluZyB8fCAhdGhpcy5vcHRpb25zLmlnbm9yZUdyb3VwaW5nKTtcblxuICAgICAgICBpZiAoc2tpcE9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChoYXNHcm91cGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkR3JvdXBlZERhdGEoZ3JpZCwgZ3JpZC5ncm91cHNSZWNvcmRzLCBncm91cGVkR3JpZEdyb3VwaW5nU3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEZsYXREYXRhKGdyaWQuZmlsdGVyZWRTb3J0ZWREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBncmlkRGF0YSA9IGdyaWQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKGhhc0ZpbHRlcmluZyAmJiAhdGhpcy5vcHRpb25zLmlnbm9yZUZpbHRlcmluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmluZ1N0YXRlOiBJRmlsdGVyaW5nU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zVHJlZTogZ3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsXG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkRXhwcmVzc2lvbnNUcmVlOiBncmlkLmFkdmFuY2VkRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICAgICAgICAgICAgICBzdHJhdGVneTogZ3JpZC5maWx0ZXJTdHJhdGVneVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBncmlkRGF0YSA9IEZpbHRlclV0aWwuZmlsdGVyKGdyaWREYXRhLCBmaWx0ZXJpbmdTdGF0ZSwgZ3JpZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoYXNTb3J0aW5nICYmICF0aGlzLm9wdGlvbnMuaWdub3JlU29ydGluZykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IFdlIHNob3VsZCBkcm9wIHN1cHBvcnQgZm9yIHRoaXMgc2luY2UgaW4gYSBncm91cGVkIGdyaWQgaXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fc29ydCA9ICFpc0dyb3VwZWRHcmlkID9cbiAgICAgICAgICAgICAgICAvLyAgICAgY2xvbmVWYWx1ZShncmlkLnNvcnRpbmdFeHByZXNzaW9uc1swXSkgOlxuICAgICAgICAgICAgICAgIC8vICAgICBncmlkLnNvcnRpbmdFeHByZXNzaW9ucy5sZW5ndGggPiAxID9cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNsb25lVmFsdWUoZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnNbMV0pIDpcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNsb25lVmFsdWUoZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnNbMF0pO1xuXG4gICAgICAgICAgICAgICAgZ3JpZERhdGEgPSBEYXRhVXRpbC5zb3J0KGdyaWREYXRhLCBncmlkLnNvcnRpbmdFeHByZXNzaW9ucywgZ3JpZC5zb3J0U3RyYXRlZ3ksIGdyaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaGFzR3JvdXBpbmcgJiYgIXRoaXMub3B0aW9ucy5pZ25vcmVHcm91cGluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3Vwc1JlY29yZHMgPSBbXTtcbiAgICAgICAgICAgICAgICBEYXRhVXRpbC5ncm91cChjbG9uZUFycmF5KGdyaWREYXRhKSwgZ3JvdXBlZEdyaWRHcm91cGluZ1N0YXRlLCBncmlkLmdyb3VwU3RyYXRlZ3ksIGdyaWQsIGdyb3Vwc1JlY29yZHMpO1xuICAgICAgICAgICAgICAgIGdyaWREYXRhID0gZ3JvdXBzUmVjb3JkcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhhc0dyb3VwaW5nICYmICF0aGlzLm9wdGlvbnMuaWdub3JlR3JvdXBpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEdyb3VwZWREYXRhKGdyaWQsIGdyaWREYXRhLCBncm91cGVkR3JpZEdyb3VwaW5nU3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEZsYXREYXRhKGdyaWREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcHJlcGFyZVRyZWVHcmlkRGF0YShncmlkOiBHcmlkVHlwZSwgaGFzRmlsdGVyaW5nOiBib29sZWFuLCBoYXNTb3J0aW5nOiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHNraXBPcGVyYXRpb25zID1cbiAgICAgICAgICAgICghaGFzRmlsdGVyaW5nIHx8ICF0aGlzLm9wdGlvbnMuaWdub3JlRmlsdGVyaW5nKSAmJlxuICAgICAgICAgICAgKCFoYXNTb3J0aW5nIHx8ICF0aGlzLm9wdGlvbnMuaWdub3JlU29ydGluZyk7XG5cbiAgICAgICAgaWYgKHNraXBPcGVyYXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRyZWVHcmlkRGF0YShncmlkLnByb2Nlc3NlZFJvb3RSZWNvcmRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBncmlkRGF0YSA9IGdyaWQucm9vdFJlY29yZHM7XG5cbiAgICAgICAgICAgIGlmIChoYXNGaWx0ZXJpbmcgJiYgIXRoaXMub3B0aW9ucy5pZ25vcmVGaWx0ZXJpbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJpbmdTdGF0ZTogSUZpbHRlcmluZ1N0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uc1RyZWU6IGdyaWQuZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlZEV4cHJlc3Npb25zVHJlZTogZ3JpZC5hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSxcbiAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3k6IChncmlkLmZpbHRlclN0cmF0ZWd5KSA/IGdyaWQuZmlsdGVyU3RyYXRlZ3kgOiBuZXcgVHJlZUdyaWRGaWx0ZXJpbmdTdHJhdGVneSgpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGdyaWREYXRhID0gZmlsdGVyaW5nU3RhdGUuc3RyYXRlZ3lcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihncmlkRGF0YSwgZmlsdGVyaW5nU3RhdGUuZXhwcmVzc2lvbnNUcmVlLCBmaWx0ZXJpbmdTdGF0ZS5hZHZhbmNlZEV4cHJlc3Npb25zVHJlZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoYXNTb3J0aW5nICYmICF0aGlzLm9wdGlvbnMuaWdub3JlU29ydGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvcnQgPSBjbG9uZVZhbHVlKGdyaWQuc29ydGluZ0V4cHJlc3Npb25zWzBdKTtcblxuICAgICAgICAgICAgICAgIGdyaWREYXRhID0gRGF0YVV0aWwudHJlZUdyaWRTb3J0KGdyaWREYXRhLCBncmlkLnNvcnRpbmdFeHByZXNzaW9ucywgZ3JpZC5zb3J0U3RyYXRlZ3kpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFkZFRyZWVHcmlkRGF0YShncmlkRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFRyZWVHcmlkRGF0YShyZWNvcmRzOiBJVHJlZUdyaWRSZWNvcmRbXSwgcGFyZW50RXhwYW5kZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICghcmVjb3Jkcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkcykge1xuICAgICAgICAgICAgY29uc3QgaGllcmFyY2hpY2FsUmVjb3JkOiBJRXhwb3J0UmVjb3JkID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlY29yZC5kYXRhLFxuICAgICAgICAgICAgICAgIGxldmVsOiByZWNvcmQubGV2ZWwsXG4gICAgICAgICAgICAgICAgaGlkZGVuOiAhcGFyZW50RXhwYW5kZWQsXG4gICAgICAgICAgICAgICAgdHlwZTogRXhwb3J0UmVjb3JkVHlwZS5UcmVlR3JpZFJlY29yZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZmxhdFJlY29yZHMucHVzaChoaWVyYXJjaGljYWxSZWNvcmQpO1xuICAgICAgICAgICAgdGhpcy5hZGRUcmVlR3JpZERhdGEocmVjb3JkLmNoaWxkcmVuLCBwYXJlbnRFeHBhbmRlZCAmJiByZWNvcmQuZXhwYW5kZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRGbGF0RGF0YShyZWNvcmRzOiBhbnkpIHtcbiAgICAgICAgaWYgKCFyZWNvcmRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkcykge1xuICAgICAgICAgICAgY29uc3QgZGF0YTogSUV4cG9ydFJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZWNvcmQsXG4gICAgICAgICAgICAgICAgdHlwZTogRXhwb3J0UmVjb3JkVHlwZS5EYXRhUmVjb3JkLFxuICAgICAgICAgICAgICAgIGxldmVsOiAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmZsYXRSZWNvcmRzLnB1c2goZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEdyb3VwZWREYXRhKGdyaWQ6IEdyaWRUeXBlLCByZWNvcmRzOiBJR3JvdXBCeVJlY29yZFtdLFxuICAgICAgICBncm91cGluZ1N0YXRlOiBJR3JvdXBpbmdTdGF0ZSwgcGFyZW50RXhwYW5kZWQ6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICghcmVjb3Jkcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RDb2wgPSB0aGlzLl9vd25lcnNNYXAuZ2V0KERFRkFVTFRfT1dORVIpLmNvbHVtbnNbMF0uZmllbGQ7XG5cbiAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkcykge1xuICAgICAgICAgICAgbGV0IHJlY29yZFZhbCA9IHJlY29yZC52YWx1ZTtcblxuICAgICAgICAgICAgY29uc3QgaGllcmFyY2h5ID0gZ2V0SGllcmFyY2h5KHJlY29yZCk7XG4gICAgICAgICAgICBjb25zdCBleHBhbmRTdGF0ZTogSUdyb3VwQnlFeHBhbmRTdGF0ZSA9IGdyb3VwaW5nU3RhdGUuZXhwYW5zaW9uLmZpbmQoKHMpID0+XG4gICAgICAgICAgICAgICAgaXNIaWVyYXJjaHlNYXRjaChzLmhpZXJhcmNoeSB8fCBbeyBmaWVsZE5hbWU6IHJlY29yZC5leHByZXNzaW9uLmZpZWxkTmFtZSwgdmFsdWU6IHJlY29yZFZhbCB9XSwgaGllcmFyY2h5KSk7XG4gICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGV4cGFuZFN0YXRlID8gZXhwYW5kU3RhdGUuZXhwYW5kZWQgOiBncm91cGluZ1N0YXRlLmRlZmF1bHRFeHBhbmRlZDtcblxuICAgICAgICAgICAgY29uc3QgaXNEYXRlID0gcmVjb3JkVmFsIGluc3RhbmNlb2YgRGF0ZTtcblxuICAgICAgICAgICAgaWYgKGlzRGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVab25lT2Zmc2V0ID0gcmVjb3JkVmFsLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBpc29TdHJpbmcgPSAobmV3IERhdGUocmVjb3JkVmFsIC0gdGltZVpvbmVPZmZzZXQpKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBpcGUgPSBuZXcgRGF0ZVBpcGUoZ3JpZC5sb2NhbGUpO1xuICAgICAgICAgICAgICAgIHJlY29yZFZhbCA9IHBpcGUudHJhbnNmb3JtKGlzb1N0cmluZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwRXhwcmVzc2lvbk5hbWUgPSByZWNvcmQuY29sdW1uICYmIHJlY29yZC5jb2x1bW4uaGVhZGVyID9cbiAgICAgICAgICAgICAgICByZWNvcmQuY29sdW1uLmhlYWRlciA6XG4gICAgICAgICAgICAgICAgcmVjb3JkLmV4cHJlc3Npb24uZmllbGROYW1lO1xuXG4gICAgICAgICAgICByZWNvcmRWYWwgPSByZWNvcmRWYWwgIT09IG51bGwgPyByZWNvcmRWYWwgOiAnJztcblxuICAgICAgICAgICAgY29uc3QgZ3JvdXBFeHByZXNzaW9uOiBJRXhwb3J0UmVjb3JkID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHsgW2ZpcnN0Q29sXTogYCR7Z3JvdXBFeHByZXNzaW9uTmFtZX06ICR7cmVjb3JkVmFsfSAoJHtyZWNvcmQucmVjb3Jkcy5sZW5ndGh9KWAgfSxcbiAgICAgICAgICAgICAgICBsZXZlbDogcmVjb3JkLmxldmVsLFxuICAgICAgICAgICAgICAgIGhpZGRlbjogIXBhcmVudEV4cGFuZGVkLFxuICAgICAgICAgICAgICAgIHR5cGU6IEV4cG9ydFJlY29yZFR5cGUuR3JvdXBlZFJlY29yZCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZmxhdFJlY29yZHMucHVzaChncm91cEV4cHJlc3Npb24pO1xuXG4gICAgICAgICAgICBpZiAocmVjb3JkLmdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRHcm91cGVkRGF0YShncmlkLCByZWNvcmQuZ3JvdXBzLCBncm91cGluZ1N0YXRlLCBleHBhbmRlZCAmJiBwYXJlbnRFeHBhbmRlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd1JlY29yZHMgPSByZWNvcmQucmVjb3JkcztcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgcm93UmVjb3JkIG9mIHJvd1JlY29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFJlY29yZDogSUV4cG9ydFJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHJvd1JlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldmVsOiByZWNvcmQubGV2ZWwgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuOiAhKGV4cGFuZGVkICYmIHBhcmVudEV4cGFuZGVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEV4cG9ydFJlY29yZFR5cGUuRGF0YVJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYXRSZWNvcmRzLnB1c2goY3VycmVudFJlY29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb2x1bW5zKGNvbHVtbnM6IENvbHVtblR5cGVbXSk6IElDb2x1bW5MaXN0IHtcbiAgICAgICAgY29uc3QgY29sTGlzdCA9IFtdO1xuICAgICAgICBjb25zdCBjb2xXaWR0aExpc3QgPSBbXTtcbiAgICAgICAgY29uc3QgaGlkZGVuQ29sdW1ucyA9IFtdO1xuICAgICAgICBsZXQgaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW4gPSAtMTtcbiAgICAgICAgbGV0IGxhc3RWaXNpYmxlQ29sdW1uSW5kZXggPSAtMTtcbiAgICAgICAgbGV0IG1heExldmVsID0gMDtcblxuICAgICAgICBjb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uSGVhZGVyID0gIUV4cG9ydFV0aWxpdGllcy5pc051bGxPcldoaXRlc3BhY2VzKGNvbHVtbi5oZWFkZXIpID8gY29sdW1uLmhlYWRlciA6IGNvbHVtbi5maWVsZDtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9ydENvbHVtbiA9ICFjb2x1bW4uaGlkZGVuIHx8IHRoaXMub3B0aW9ucy5pZ25vcmVDb2x1bW5zVmlzaWJpbGl0eTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5vcHRpb25zLmlnbm9yZUNvbHVtbnNPcmRlciB8fCB0aGlzLm9wdGlvbnMuaWdub3JlQ29sdW1uc1Zpc2liaWxpdHkgPyBjb2x1bW4uaW5kZXggOiBjb2x1bW4udmlzaWJsZUluZGV4O1xuICAgICAgICAgICAgY29uc3QgY29sdW1uV2lkdGggPSBOdW1iZXIoY29sdW1uLndpZHRoPy5zbGljZSgwLCAtMikpIHx8IERFRkFVTFRfQ09MVU1OX1dJRFRIO1xuICAgICAgICAgICAgY29uc3QgY29sdW1uTGV2ZWwgPSAhdGhpcy5vcHRpb25zLmlnbm9yZU11bHRpQ29sdW1uSGVhZGVycyA/IGNvbHVtbi5sZXZlbCA6IDA7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTXVsdGlDb2xIZWFkZXIgPSBjb2x1bW4uY29sdW1uR3JvdXA7XG4gICAgICAgICAgICBjb25zdCBjb2xTcGFuID0gaXNNdWx0aUNvbEhlYWRlciA/XG4gICAgICAgICAgICAgICAgY29sdW1uLmFsbENoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoY2ggPT4gIShjaC5jb2x1bW5Hcm91cCkgJiYgKCF0aGlzLm9wdGlvbnMuaWdub3JlQ29sdW1uc1Zpc2liaWxpdHkgPyAhY2guaGlkZGVuIDogdHJ1ZSkpXG4gICAgICAgICAgICAgICAgICAgIC5sZW5ndGggOlxuICAgICAgICAgICAgICAgIDE7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZm86IElDb2x1bW5JbmZvID0ge1xuICAgICAgICAgICAgICAgIGhlYWRlcjogY29sdW1uSGVhZGVyLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBjb2x1bW4uZGF0YVR5cGUsXG4gICAgICAgICAgICAgICAgZmllbGQ6IGNvbHVtbi5maWVsZCxcbiAgICAgICAgICAgICAgICBza2lwOiAhZXhwb3J0Q29sdW1uLFxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogY29sdW1uLmZvcm1hdHRlcixcbiAgICAgICAgICAgICAgICBza2lwRm9ybWF0dGVyOiBmYWxzZSxcblxuICAgICAgICAgICAgICAgIGhlYWRlclR5cGU6IGlzTXVsdGlDb2xIZWFkZXIgPyBIZWFkZXJUeXBlLk11bHRpQ29sdW1uSGVhZGVyIDogSGVhZGVyVHlwZS5Db2x1bW5IZWFkZXIsXG4gICAgICAgICAgICAgICAgY29sdW1uU3BhbjogY29sU3BhbixcbiAgICAgICAgICAgICAgICBsZXZlbDogY29sdW1uTGV2ZWwsXG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgcGlubmVkSW5kZXg6ICFjb2x1bW4ucGlubmVkID9cbiAgICAgICAgICAgICAgICAgICAgTnVtYmVyLk1BWF9WQUxVRSA6XG4gICAgICAgICAgICAgICAgICAgICFjb2x1bW4uaGlkZGVuID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbi5ncmlkLnBpbm5lZENvbHVtbnMuaW5kZXhPZihjb2x1bW4pXG4gICAgICAgICAgICAgICAgICAgICAgICA6IE5hTixcbiAgICAgICAgICAgICAgICBjb2x1bW5Hcm91cFBhcmVudDogY29sdW1uLnBhcmVudCA/IGNvbHVtbi5wYXJlbnQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbHVtbkdyb3VwOiBpc011bHRpQ29sSGVhZGVyID8gY29sdW1uIDogbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVDb2x1bW5zT3JkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uSW5mby5zdGFydEluZGV4ICE9PSBjb2x1bW5JbmZvLnBpbm5lZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkluZm8ucGlubmVkSW5kZXggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbHVtbi5sZXZlbCA+IG1heExldmVsICYmICF0aGlzLm9wdGlvbnMuaWdub3JlTXVsdGlDb2x1bW5IZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgbWF4TGV2ZWwgPSBjb2x1bW4ubGV2ZWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb2xMaXN0LnB1c2goY29sdW1uSW5mbyk7XG4gICAgICAgICAgICAgICAgY29sV2lkdGhMaXN0LnB1c2goY29sdW1uV2lkdGgpO1xuICAgICAgICAgICAgICAgIGxhc3RWaXNpYmxlQ29sdW1uSW5kZXggPSBNYXRoLm1heChsYXN0VmlzaWJsZUNvbHVtbkluZGV4LCBjb2xMaXN0LmluZGV4T2YoY29sdW1uSW5mbykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoaWRkZW5Db2x1bW5zLnB1c2goY29sdW1uSW5mbyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb2x1bW4ucGlubmVkICYmIGV4cG9ydENvbHVtbiAmJiBjb2x1bW5JbmZvLmhlYWRlclR5cGUgPT09IEhlYWRlclR5cGUuQ29sdW1uSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW4rKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICAvL0FwcGVuZCB0aGUgaGlkZGVuIGNvbHVtbnMgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxuICAgICAgICBoaWRkZW5Db2x1bW5zLmZvckVhY2goKGhpZGRlbkNvbHVtbikgPT4ge1xuICAgICAgICAgICAgY29sTGlzdFsrK2xhc3RWaXNpYmxlQ29sdW1uSW5kZXhdID0gaGlkZGVuQ29sdW1uO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQ6IElDb2x1bW5MaXN0ID0ge1xuICAgICAgICAgICAgY29sdW1uczogY29sTGlzdCxcbiAgICAgICAgICAgIGNvbHVtbldpZHRoczogY29sV2lkdGhMaXN0LFxuICAgICAgICAgICAgaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW4sXG4gICAgICAgICAgICBtYXhMZXZlbFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYXBIaWVyYXJjaGljYWxHcmlkQ29sdW1ucyhpc2xhbmQ6IGFueSwgZ3JpZERhdGE6IGFueSkge1xuICAgICAgICBsZXQgY29sdW1uTGlzdDogSUNvbHVtbkxpc3Q7XG4gICAgICAgIGxldCBrZXlEYXRhO1xuXG4gICAgICAgIGlmIChpc2xhbmQuYXV0b0dlbmVyYXRlKSB7XG4gICAgICAgICAgICBrZXlEYXRhID0gZ3JpZERhdGFbaXNsYW5kLmtleV07XG4gICAgICAgICAgICBjb25zdCBpc2xhbmRLZXlzID0gaXNsYW5kLmNoaWxkcmVuLm1hcChpID0+IGkua2V5KTtcblxuICAgICAgICAgICAgY29uc3QgaXNsYW5kRGF0YSA9IGtleURhdGEubWFwKGkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0l0ZW0gPSB7fTtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGkpLm1hcChrID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc2xhbmRLZXlzLmluY2x1ZGVzKGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJdGVtW2tdID0gaVtrXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0l0ZW07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29sdW1uTGlzdCA9IHRoaXMuZ2V0QXV0b0dlbmVyYXRlZENvbHVtbnMoaXNsYW5kRGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpc2xhbmRDb2x1bW5MaXN0ID0gaXNsYW5kLmNoaWxkQ29sdW1ucy50b0FycmF5KCk7XG4gICAgICAgICAgICBjb2x1bW5MaXN0ID0gdGhpcy5nZXRDb2x1bW5zKGlzbGFuZENvbHVtbkxpc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb3duZXJzTWFwLnNldChpc2xhbmQsIGNvbHVtbkxpc3QpO1xuXG4gICAgICAgIGlmIChpc2xhbmQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZElzbGFuZCBvZiBpc2xhbmQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc2xhbmRLZXlEYXRhID0ga2V5RGF0YSAhPT0gdW5kZWZpbmVkID8ga2V5RGF0YVswXSA6IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMubWFwSGllcmFyY2hpY2FsR3JpZENvbHVtbnMoY2hpbGRJc2xhbmQsIGlzbGFuZEtleURhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRBdXRvR2VuZXJhdGVkQ29sdW1ucyhkYXRhOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBjb2xMaXN0ID0gW107XG4gICAgICAgIGNvbnN0IGNvbFdpZHRoTGlzdCA9IFtdO1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YVswXSk7XG5cbiAgICAgICAga2V5cy5mb3JFYWNoKChjb2xLZXksIGkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZm86IElDb2x1bW5JbmZvID0ge1xuICAgICAgICAgICAgICAgIGhlYWRlcjogY29sS2V5LFxuICAgICAgICAgICAgICAgIGZpZWxkOiBjb2xLZXksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIHNraXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhlYWRlclR5cGU6IEhlYWRlclR5cGUuQ29sdW1uSGVhZGVyLFxuICAgICAgICAgICAgICAgIGNvbHVtblNwYW46IDEsXG4gICAgICAgICAgICAgICAgbGV2ZWw6IDAsXG4gICAgICAgICAgICAgICAgc3RhcnRJbmRleDogaSxcbiAgICAgICAgICAgICAgICBwaW5uZWRJbmRleDogTnVtYmVyLk1BWF9WQUxVRVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29sTGlzdC5wdXNoKGNvbHVtbkluZm8pO1xuICAgICAgICAgICAgY29sV2lkdGhMaXN0LnB1c2goREVGQVVMVF9DT0xVTU5fV0lEVEgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXN1bHQ6IElDb2x1bW5MaXN0ID0ge1xuICAgICAgICAgICAgY29sdW1uczogY29sTGlzdCxcbiAgICAgICAgICAgIGNvbHVtbldpZHRoczogY29sV2lkdGhMaXN0LFxuICAgICAgICAgICAgaW5kZXhPZkxhc3RQaW5uZWRDb2x1bW46IC0xLFxuICAgICAgICAgICAgbWF4TGV2ZWw6IDAsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0RGVmYXVsdHMoKSB7XG4gICAgICAgIHRoaXMuX3NvcnQgPSBudWxsO1xuICAgICAgICB0aGlzLmZsYXRSZWNvcmRzID0gW107XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHt9IGFzIElneEV4cG9ydGVyT3B0aW9uc0Jhc2U7XG4gICAgICAgIHRoaXMuX293bmVyc01hcC5jbGVhcigpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBleHBvcnREYXRhSW1wbGVtZW50YXRpb24oZGF0YTogYW55W10sIG9wdGlvbnM6IElneEV4cG9ydGVyT3B0aW9uc0Jhc2UsIGRvbmU6ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuIl19