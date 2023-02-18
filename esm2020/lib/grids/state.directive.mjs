import { Directive, Optional, Input, NgModule, Host, Inject } from '@angular/core';
import { FilteringExpressionsTree } from '../data-operations/filtering-expressions-tree';
import { IgxColumnComponent } from './columns/column.component';
import { IgxColumnGroupComponent } from './columns/column-group.component';
import { GridColumnDataType } from '../data-operations/data-util';
import { IgxBooleanFilteringOperand, IgxNumberFilteringOperand, IgxDateFilteringOperand, IgxStringFilteringOperand, IgxDateTimeFilteringOperand } from '../data-operations/filtering-condition';
import { IgxGridComponent } from './grid/grid.component';
import { delay, take } from 'rxjs/operators';
import { IGX_GRID_BASE } from './common/grid.interface';
import * as i0 from "@angular/core";
export class IgxGridStateDirective {
    /**
     * @hidden
     */
    constructor(grid, resolver, viewRef) {
        this.grid = grid;
        this.resolver = resolver;
        this.viewRef = viewRef;
        this.featureKeys = [];
        this._options = {
            columns: true,
            filtering: true,
            advancedFiltering: true,
            sorting: true,
            groupBy: true,
            paging: true,
            cellSelection: true,
            rowSelection: true,
            columnSelection: true,
            rowPinning: true,
            expansion: true,
            moving: true,
            rowIslands: true
        };
        this.FEATURES = {
            sorting: {
                getFeatureState: (context) => {
                    const sortingState = context.currGrid.sortingExpressions;
                    sortingState.forEach(s => {
                        delete s.strategy;
                        delete s.owner;
                    });
                    return { sorting: sortingState };
                },
                restoreFeatureState: (context, state) => {
                    context.currGrid.sortingExpressions = state;
                }
            },
            filtering: {
                getFeatureState: (context) => {
                    const filteringState = context.currGrid.filteringExpressionsTree;
                    if (filteringState) {
                        delete filteringState.owner;
                        for (const item of filteringState.filteringOperands) {
                            delete item.owner;
                        }
                    }
                    return { filtering: filteringState };
                },
                restoreFeatureState: (context, state) => {
                    const filterTree = context.createExpressionsTreeFromObject(state);
                    context.currGrid.filteringExpressionsTree = filterTree;
                }
            },
            advancedFiltering: {
                getFeatureState: (context) => {
                    const filteringState = context.currGrid.advancedFilteringExpressionsTree;
                    let advancedFiltering;
                    if (filteringState) {
                        delete filteringState.owner;
                        for (const item of filteringState.filteringOperands) {
                            delete item.owner;
                        }
                        advancedFiltering = filteringState;
                    }
                    else {
                        advancedFiltering = {};
                    }
                    return { advancedFiltering };
                },
                restoreFeatureState: (context, state) => {
                    const filterTree = context.createExpressionsTreeFromObject(state);
                    context.currGrid.advancedFilteringExpressionsTree = filterTree;
                }
            },
            columns: {
                getFeatureState: (context) => {
                    const gridColumns = context.currGrid.columnList.map((c) => ({
                        pinned: c.pinned,
                        sortable: c.sortable,
                        filterable: c.filterable,
                        editable: c.editable,
                        sortingIgnoreCase: c.sortingIgnoreCase,
                        filteringIgnoreCase: c.filteringIgnoreCase,
                        headerClasses: c.headerClasses,
                        headerGroupClasses: c.headerGroupClasses,
                        maxWidth: c.maxWidth,
                        groupable: c.groupable,
                        movable: c.movable,
                        hidden: c.hidden,
                        dataType: c.dataType,
                        hasSummary: c.hasSummary,
                        field: c.field,
                        width: c.width,
                        header: c.header,
                        resizable: c.resizable,
                        searchable: c.searchable,
                        selectable: c.selectable,
                        parent: c.parent ? c.parent.header : null,
                        columnGroup: c.columnGroup,
                        disableHiding: c.disableHiding
                    }));
                    return { columns: gridColumns };
                },
                restoreFeatureState: (context, state) => {
                    const newColumns = [];
                    const factory = context.resolver.resolveComponentFactory(IgxColumnComponent);
                    const groupFactory = context.resolver.resolveComponentFactory(IgxColumnGroupComponent);
                    state.forEach((colState) => {
                        const hasColumnGroup = colState.columnGroup;
                        delete colState.columnGroup;
                        if (hasColumnGroup) {
                            const ref1 = groupFactory.create(context.viewRef.injector);
                            Object.assign(ref1.instance, colState);
                            if (ref1.instance.parent) {
                                const columnGroup = newColumns.find(e => e.header === ref1.instance.parent);
                                columnGroup.children.reset([...columnGroup.children.toArray(), ref1.instance]);
                                ref1.instance.parent = columnGroup;
                            }
                            ref1.changeDetectorRef.detectChanges();
                            newColumns.push(ref1.instance);
                        }
                        else {
                            const ref = factory.create(context.viewRef.injector);
                            Object.assign(ref.instance, colState);
                            if (ref.instance.parent) {
                                const columnGroup = newColumns.find(e => e.header === ref.instance.parent);
                                if (columnGroup) {
                                    ref.instance.parent = columnGroup;
                                    columnGroup.children.reset([...columnGroup.children.toArray(), ref.instance]);
                                }
                            }
                            ref.changeDetectorRef.detectChanges();
                            newColumns.push(ref.instance);
                        }
                    });
                    context.grid.updateColumns(newColumns);
                }
            },
            groupBy: {
                getFeatureState: (context) => {
                    const grid = context.currGrid;
                    const groupingExpressions = grid.groupingExpressions;
                    groupingExpressions.forEach(expr => {
                        delete expr.strategy;
                    });
                    const expansionState = grid.groupingExpansionState;
                    const groupsExpanded = grid.groupsExpanded;
                    return { groupBy: { expressions: groupingExpressions, expansion: expansionState, defaultExpanded: groupsExpanded } };
                },
                restoreFeatureState: (context, state) => {
                    const grid = context.currGrid;
                    grid.groupingExpressions = state.expressions;
                    if (grid.groupsExpanded !== state.defaultExpanded) {
                        grid.toggleAllGroupRows();
                    }
                    else {
                        grid.groupingExpansionState = state.expansion;
                    }
                }
            },
            paging: {
                getFeatureState: (context) => {
                    const pagingState = context.currGrid.pagingState;
                    return { paging: pagingState };
                },
                restoreFeatureState: (context, state) => {
                    if (!context.currGrid.paginator) {
                        return;
                    }
                    if (context.currGrid.paginator.perPage !== state.recordsPerPage) {
                        context.currGrid.paginator.perPage = state.recordsPerPage;
                        context.currGrid.cdr.detectChanges();
                    }
                    context.currGrid.paginator.page = state.index;
                }
            },
            moving: {
                getFeatureState: (context) => {
                    return { moving: context.currGrid.moving };
                },
                restoreFeatureState: (context, state) => {
                    context.currGrid.moving = state;
                }
            },
            rowSelection: {
                getFeatureState: (context) => {
                    const selection = context.currGrid.selectedRows;
                    return { rowSelection: selection };
                },
                restoreFeatureState: (context, state) => {
                    context.currGrid.selectRows(state, true);
                }
            },
            cellSelection: {
                getFeatureState: (context) => {
                    const selection = context.currGrid.getSelectedRanges().map(range => ({ rowStart: range.rowStart, rowEnd: range.rowEnd, columnStart: range.columnStart, columnEnd: range.columnEnd }));
                    return { cellSelection: selection };
                },
                restoreFeatureState: (context, state) => {
                    state.forEach(r => {
                        const range = { rowStart: r.rowStart, rowEnd: r.rowEnd, columnStart: r.columnStart, columnEnd: r.columnEnd };
                        context.currGrid.selectRange(range);
                    });
                }
            },
            columnSelection: {
                getFeatureState: (context) => {
                    const selection = context.currGrid.selectedColumns().map(c => c.field);
                    return { columnSelection: selection };
                },
                restoreFeatureState: (context, state) => {
                    context.currGrid.deselectAllColumns();
                    context.currGrid.selectColumns(state);
                }
            },
            rowPinning: {
                getFeatureState: (context) => {
                    const pinned = context.currGrid.pinnedRows.map(x => x.key);
                    return { rowPinning: pinned };
                },
                restoreFeatureState: (context, state) => {
                    // clear current state.
                    context.currGrid.pinnedRows.forEach(row => row.unpin());
                    state.forEach(rowID => context.currGrid.pinRow(rowID));
                }
            },
            pinningConfig: {
                getFeatureState: (context) => ({ pinningConfig: context.currGrid.pinning }),
                restoreFeatureState: (context, state) => {
                    context.currGrid.pinning = state;
                }
            },
            expansion: {
                getFeatureState: (context) => {
                    const expansionStates = Array.from(context.currGrid.expansionStates);
                    return { expansion: expansionStates };
                },
                restoreFeatureState: (context, state) => {
                    const expansionStates = new Map(state);
                    context.currGrid.expansionStates = expansionStates;
                }
            },
            rowIslands: {
                getFeatureState(context) {
                    const childGridStates = [];
                    const rowIslands = context.currGrid.allLayoutList;
                    if (rowIslands) {
                        rowIslands.forEach(rowIsland => {
                            const childGrids = rowIsland.rowIslandAPI.getChildGrids();
                            childGrids.forEach(chGrid => {
                                const parentRowID = this.getParentRowID(chGrid);
                                context.currGrid = chGrid;
                                if (context.currGrid) {
                                    const childGridState = context.buildState(context.featureKeys);
                                    childGridStates.push({ id: `${rowIsland.id}`, parentRowID, state: childGridState });
                                }
                            });
                        });
                    }
                    context.currGrid = context.grid;
                    return { rowIslands: childGridStates };
                },
                restoreFeatureState(context, state) {
                    const rowIslands = context.currGrid.allLayoutList;
                    if (rowIslands) {
                        rowIslands.forEach(rowIsland => {
                            const childGrids = rowIsland.rowIslandAPI.getChildGrids();
                            childGrids.forEach(chGrid => {
                                const parentRowID = this.getParentRowID(chGrid);
                                context.currGrid = chGrid;
                                const childGridState = state.find(st => st.id === rowIsland.id && st.parentRowID === parentRowID);
                                if (childGridState && context.currGrid) {
                                    context.restoreGridState(childGridState.state, context.featureKeys);
                                }
                            });
                        });
                    }
                    context.currGrid = context.grid;
                },
                /**
                 * Traverses the hierarchy up to the root grid to return the ID of the expanded row.
                 */
                getParentRowID: (grid) => {
                    let childGrid;
                    while (grid.parent) {
                        childGrid = grid;
                        grid = grid.parent;
                    }
                    return grid.gridAPI.getParentRowId(childGrid);
                }
            }
        };
    }
    /**
     *  An object with options determining if a certain feature state should be saved.
     * ```html
     * <igx-grid [igxGridState]="options"></igx-grid>
     * ```
     * ```typescript
     * public options = {selection: false, advancedFiltering: false};
     * ```
     */
    get options() {
        return this._options;
    }
    set options(value) {
        Object.assign(this._options, value);
        if (!(this.grid instanceof IgxGridComponent)) {
            delete this._options.groupBy;
        }
        else {
            delete this._options.rowIslands;
        }
    }
    /**
     * Gets the state of a feature or states of all grid features, unless a certain feature is disabled through the `options` property.
     *
     * @param `serialize` determines whether the returned object will be serialized to JSON string. Default value is true.
     * @param `feature` string or array of strings determining the features to be added in the state. If skipped, all features are added.
     * @returns Returns the serialized to JSON string IGridState object, or the non-serialized IGridState object.
     * ```html
     * <igx-grid [igxGridState]="options"></igx-grid>
     * ```
     * ```typescript
     * @ViewChild(IgxGridStateDirective, { static: true }) public state;
     * let state = this.state.getState(); // returns string
     * let state = this.state(false) // returns `IGridState` object
     * ```
     */
    getState(serialize = true, features) {
        let state;
        this.currGrid = this.grid;
        this.state = state = this.buildState(features);
        if (serialize) {
            state = JSON.stringify(state, this.stringifyCallback);
        }
        return state;
    }
    /**
     * Restores grid features' state based on the IGridState object passed as an argument.
     *
     * @param IGridState object to restore state from.
     * @returns
     * ```html
     * <igx-grid [igxGridState]="options"></igx-grid>
     * ```
     * ```typescript
     * @ViewChild(IgxGridStateDirective, { static: true }) public state;
     * this.state.setState(gridState);
     * ```
     */
    setState(state, features) {
        if (typeof state === 'string') {
            state = JSON.parse(state);
        }
        this.state = state;
        this.currGrid = this.grid;
        this.restoreGridState(state, features);
        this.grid.cdr.detectChanges(); // TODO
    }
    /**
     * Builds an IGridState object.
     */
    buildState(keys) {
        this.applyFeatures(keys);
        let gridState = {};
        this.featureKeys.forEach(f => {
            if (this.options[f]) {
                if (!(this.grid instanceof IgxGridComponent) && f === 'groupBy') {
                    return;
                }
                const feature = this.getFeature(f);
                const featureState = feature.getFeatureState(this);
                gridState = Object.assign(gridState, featureState);
            }
        });
        return gridState;
    }
    /**
     * The method that calls corresponding methods to restore features from the passed IGridState object.
     */
    restoreGridState(state, features) {
        // TODO Notify the grid that columnList.changes is triggered by the state directive
        // instead of piping it like below
        const columns = 'columns';
        this.grid.columnList.changes.pipe(delay(0), take(1)).subscribe(() => {
            this.featureKeys = this.featureKeys.filter(f => f !== columns);
            this.restoreFeatures(state);
        });
        this.applyFeatures(features);
        if (this.featureKeys.includes(columns) && this.options[columns] && state[columns]) {
            this.getFeature(columns).restoreFeatureState(this, state[columns]);
        }
        else {
            this.restoreFeatures(state);
        }
    }
    restoreFeatures(state) {
        this.featureKeys.forEach(f => {
            if (this.options[f]) {
                const featureState = state[f];
                if (f === 'moving' || featureState) {
                    const feature = this.getFeature(f);
                    feature.restoreFeatureState(this, featureState);
                }
            }
        });
    }
    /**
     * Returns a collection of all grid features.
     */
    applyFeatures(keys) {
        this.featureKeys = [];
        if (!keys) {
            for (const key of Object.keys(this.options)) {
                this.featureKeys.push(key);
            }
        }
        else if (Array.isArray(keys)) {
            this.featureKeys = [...keys];
        }
        else {
            this.featureKeys.push(keys);
        }
    }
    /**
     * This method builds a FilteringExpressionsTree from a provided object.
     */
    createExpressionsTreeFromObject(exprTreeObject) {
        if (!exprTreeObject || !exprTreeObject.filteringOperands) {
            return null;
        }
        const expressionsTree = new FilteringExpressionsTree(exprTreeObject.operator, exprTreeObject.fieldName);
        for (const item of exprTreeObject.filteringOperands) {
            // Check if item is an expressions tree or a single expression.
            if (item.filteringOperands) {
                const subTree = this.createExpressionsTreeFromObject(item);
                expressionsTree.filteringOperands.push(subTree);
            }
            else {
                const expr = item;
                let dataType;
                if (this.currGrid.columnList.length > 0) {
                    dataType = this.currGrid.columnList.find(c => c.field === expr.fieldName).dataType;
                }
                else if (this.state.columns) {
                    dataType = this.state.columns.find(c => c.field === expr.fieldName).dataType;
                }
                else {
                    return null;
                }
                // when ESF, values are stored in Set.
                // First those values are converted to an array before returning string in the stringifyCallback
                // now we need to convert those back to Set
                if (Array.isArray(expr.searchVal)) {
                    expr.searchVal = new Set(expr.searchVal);
                }
                else {
                    expr.searchVal = expr.searchVal && (dataType === 'date' || dataType === 'dateTime') ? new Date(Date.parse(expr.searchVal)) : expr.searchVal;
                }
                expr.condition = this.generateFilteringCondition(dataType, expr.condition.name);
                expressionsTree.filteringOperands.push(expr);
            }
        }
        return expressionsTree;
    }
    /**
     * Returns the filtering logic function for a given dataType and condition (contains, greaterThan, etc.)
     */
    generateFilteringCondition(dataType, name) {
        let filters;
        switch (dataType) {
            case GridColumnDataType.Boolean:
                filters = IgxBooleanFilteringOperand.instance();
                break;
            case GridColumnDataType.Number:
                filters = IgxNumberFilteringOperand.instance();
                break;
            case GridColumnDataType.Date:
                filters = IgxDateFilteringOperand.instance();
                break;
            case GridColumnDataType.DateTime:
                filters = IgxDateTimeFilteringOperand.instance();
                break;
            case GridColumnDataType.String:
            default:
                filters = IgxStringFilteringOperand.instance();
                break;
        }
        return filters.condition(name);
    }
    stringifyCallback(key, val) {
        if (key === 'searchVal' && val instanceof Set) {
            return Array.from(val);
        }
        return val;
    }
    getFeature(key) {
        const feature = this.FEATURES[key];
        return feature;
    }
}
IgxGridStateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridStateDirective, deps: [{ token: IGX_GRID_BASE, host: true, optional: true }, { token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxGridStateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridStateDirective, selector: "[igxGridState]", inputs: { options: ["igxGridState", "options"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridStateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxGridState]'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }, { type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }]; }, propDecorators: { options: [{
                type: Input,
                args: ['igxGridState']
            }] } });
/**
 * @hidden
 */
export class IgxGridStateModule {
}
IgxGridStateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridStateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxGridStateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridStateModule, declarations: [IgxGridStateDirective], exports: [IgxGridStateDirective] });
IgxGridStateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridStateModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridStateModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxGridStateDirective],
                    exports: [IgxGridStateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL3N0YXRlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBOEMsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9ILE9BQU8sRUFBRSx3QkFBd0IsRUFBNkIsTUFBTSwrQ0FBK0MsQ0FBQztBQUVwSCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUczRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQ0gsMEJBQTBCLEVBQUUseUJBQXlCLEVBQUUsdUJBQXVCLEVBQzlFLHlCQUF5QixFQUF1QiwyQkFBMkIsRUFDOUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUdoRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUd6RCxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzdDLE9BQU8sRUFBWSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7QUErRWxFLE1BQU0sT0FBTyxxQkFBcUI7SUF5VDlCOztPQUVHO0lBQ0gsWUFDc0QsSUFBYyxFQUN4RCxRQUFrQyxFQUNsQyxPQUF5QjtRQUZpQixTQUFJLEdBQUosSUFBSSxDQUFVO1FBQ3hELGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBNVQ3QixnQkFBVyxHQUFtQixFQUFFLENBQUM7UUFHakMsYUFBUSxHQUFzQjtZQUNsQyxPQUFPLEVBQUUsSUFBSTtZQUNiLFNBQVMsRUFBRSxJQUFJO1lBQ2YsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSxJQUFJO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixhQUFhLEVBQUUsSUFBSTtZQUNuQixZQUFZLEVBQUUsSUFBSTtZQUNsQixlQUFlLEVBQUUsSUFBSTtZQUNyQixVQUFVLEVBQUUsSUFBSTtZQUNoQixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxJQUFJO1lBQ1osVUFBVSxFQUFFLElBQUk7U0FDbkIsQ0FBQztRQUNNLGFBQVEsR0FBRztZQUNmLE9BQU8sRUFBRztnQkFDTixlQUFlLEVBQUUsQ0FBQyxPQUE4QixFQUFjLEVBQUU7b0JBQzVELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUM7b0JBQ3pELFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3JCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDbEIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUNuQixDQUFDLENBQUMsQ0FBQztvQkFDSCxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDO2dCQUNyQyxDQUFDO2dCQUNELG1CQUFtQixFQUFFLENBQUMsT0FBOEIsRUFBRSxLQUEyQixFQUFRLEVBQUU7b0JBQ3ZGLE9BQU8sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO2dCQUNoRCxDQUFDO2FBQ0o7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFO29CQUM1RCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDO29CQUNqRSxJQUFJLGNBQWMsRUFBRTt3QkFDaEIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO3dCQUM1QixLQUFLLE1BQU0sSUFBSSxJQUFJLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRTs0QkFDakQsT0FBUSxJQUFrQyxDQUFDLEtBQUssQ0FBQzt5QkFDcEQ7cUJBQ0o7b0JBQ0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsQ0FBQztnQkFDekMsQ0FBQztnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBK0IsRUFBUSxFQUFFO29CQUMzRixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2xFLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEdBQUcsVUFBc0MsQ0FBQztnQkFDdkYsQ0FBQzthQUNKO1lBQ0QsaUJBQWlCLEVBQUU7Z0JBQ2YsZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFO29CQUM1RCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGdDQUFnQyxDQUFDO29CQUN6RSxJQUFJLGlCQUFzQixDQUFDO29CQUMzQixJQUFJLGNBQWMsRUFBRTt3QkFDaEIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO3dCQUM1QixLQUFLLE1BQU0sSUFBSSxJQUFJLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRTs0QkFDakQsT0FBUSxJQUFrQyxDQUFDLEtBQUssQ0FBQzt5QkFDcEQ7d0JBQ0QsaUJBQWlCLEdBQUcsY0FBYyxDQUFDO3FCQUN0Qzt5QkFBTTt3QkFDSCxpQkFBaUIsR0FBRyxFQUFFLENBQUM7cUJBQzFCO29CQUNELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDO2dCQUNqQyxDQUFDO2dCQUNELG1CQUFtQixFQUFFLENBQUMsT0FBOEIsRUFBRSxLQUErQixFQUFRLEVBQUU7b0JBQzNGLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbEUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxnQ0FBZ0MsR0FBRyxVQUFzQyxDQUFDO2dCQUMvRixDQUFDO2FBQ0o7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFO29CQUM1RCxNQUFNLFdBQVcsR0FBbUIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUN4RSxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU07d0JBQ2hCLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUTt3QkFDcEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO3dCQUN4QixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7d0JBQ3BCLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxpQkFBaUI7d0JBQ3RDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxtQkFBbUI7d0JBQzFDLGFBQWEsRUFBRSxDQUFDLENBQUMsYUFBYTt3QkFDOUIsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQjt3QkFDeEMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO3dCQUNwQixTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVM7d0JBQ3RCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTzt3QkFDbEIsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO3dCQUNoQixRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7d0JBQ3BCLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVTt3QkFDeEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO3dCQUNkLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSzt3QkFDZCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU07d0JBQ2hCLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUzt3QkFDdEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO3dCQUN4QixVQUFVLEVBQUUsQ0FBQyxDQUFDLFVBQVU7d0JBQ3hCLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSTt3QkFDekMsV0FBVyxFQUFFLENBQUMsQ0FBQyxXQUFXO3dCQUMxQixhQUFhLEVBQUUsQ0FBQyxDQUFDLGFBQWE7cUJBQ2pDLENBQUMsQ0FBQyxDQUFDO29CQUNKLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQ0QsbUJBQW1CLEVBQUUsQ0FBQyxPQUE4QixFQUFFLEtBQXFCLEVBQVEsRUFBRTtvQkFDakYsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUN0QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQzdFLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztvQkFDdkYsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUN2QixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO3dCQUM1QyxPQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUM7d0JBQzVCLElBQUksY0FBYyxFQUFFOzRCQUNoQixNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs0QkFDdkMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtnQ0FDdEIsTUFBTSxXQUFXLEdBQTRCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ3JHLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dDQUMvRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7NkJBQ3RDOzRCQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs0QkFDdkMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQ2xDOzZCQUFNOzRCQUNILE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzRCQUN0QyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2dDQUNyQixNQUFNLFdBQVcsR0FBNEIsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDcEcsSUFBSSxXQUFXLEVBQUU7b0NBQ2IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO29DQUNsQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztpQ0FDakY7NkJBQ0o7NEJBQ0QsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDOzRCQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDakM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNDLENBQUM7YUFDSjtZQUNELE9BQU8sRUFBRTtnQkFDTCxlQUFlLEVBQUUsQ0FBQyxPQUE4QixFQUFjLEVBQUU7b0JBQzVELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUE0QixDQUFDO29CQUNsRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztvQkFDckQsbUJBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUMvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3pCLENBQUMsQ0FBQyxDQUFDO29CQUNILE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztvQkFDbkQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztvQkFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUMsRUFBRyxDQUFDO2dCQUN6SCxDQUFDO2dCQUNELG1CQUFtQixFQUFFLENBQUMsT0FBOEIsRUFBRSxLQUFxQixFQUFRLEVBQUU7b0JBQ2pGLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUE0QixDQUFDO29CQUNsRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLFdBQW9DLENBQUM7b0JBQ3RFLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxLQUFLLENBQUMsZUFBZSxFQUFFO3dCQUMvQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztxQkFDN0I7eUJBQU07d0JBQ0gsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxTQUFrQyxDQUFDO3FCQUMxRTtnQkFDTCxDQUFDO2FBQ0o7WUFDRCxNQUFNLEVBQUU7Z0JBQ0osZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFO29CQUM1RCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztvQkFDakQsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBbUIsRUFBUSxFQUFFO29CQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7d0JBQzdCLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLGNBQWMsRUFBRTt3QkFDN0QsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7d0JBQzFELE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO3FCQUN4QztvQkFDRCxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDbEQsQ0FBQzthQUNKO1lBQ0QsTUFBTSxFQUFFO2dCQUNKLGVBQWUsRUFBRSxDQUFDLE9BQThCLEVBQWMsRUFBRTtvQkFDNUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMvQyxDQUFDO2dCQUNELG1CQUFtQixFQUFFLENBQUMsT0FBOEIsRUFBRSxLQUFjLEVBQVEsRUFBRTtvQkFDMUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNwQyxDQUFDO2FBQ0o7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFO29CQUM1RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztvQkFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsQ0FBQztnQkFDdkMsQ0FBQztnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBWSxFQUFRLEVBQUU7b0JBQ3hFLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0MsQ0FBQzthQUNKO1lBQ0QsYUFBYSxFQUFFO2dCQUNYLGVBQWUsRUFBRSxDQUFDLE9BQThCLEVBQWMsRUFBRTtvQkFDNUQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUMvRCxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RILE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLENBQUM7Z0JBQ3hDLENBQUM7Z0JBQ0QsbUJBQW1CLEVBQUUsQ0FBQyxPQUE4QixFQUFFLEtBQTJCLEVBQVEsRUFBRTtvQkFDdkYsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDZCxNQUFNLEtBQUssR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFDLENBQUM7d0JBQzVHLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2FBQ0o7WUFDRCxlQUFlLEVBQUU7Z0JBQ2IsZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFO29CQUM1RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsQ0FBQztnQkFDMUMsQ0FBQztnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBZSxFQUFRLEVBQUU7b0JBQzNFLE9BQU8sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDdEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLENBQUM7YUFDSjtZQUNELFVBQVUsRUFBRTtnQkFDUixlQUFlLEVBQUUsQ0FBQyxPQUE4QixFQUFjLEVBQUU7b0JBQzVELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDbEMsQ0FBQztnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBWSxFQUFRLEVBQUU7b0JBQ3hFLHVCQUF1QjtvQkFDdkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3hELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDO2FBQ0o7WUFDRCxhQUFhLEVBQUU7Z0JBQ1gsZUFBZSxFQUFFLENBQUMsT0FBOEIsRUFBYyxFQUFFLENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM5RyxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBcUIsRUFBUSxFQUFFO29CQUNqRixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3JDLENBQUM7YUFDSjtZQUNELFNBQVMsRUFBRTtnQkFDUCxlQUFlLEVBQUUsQ0FBQyxPQUE4QixFQUFjLEVBQUU7b0JBQzVELE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDckUsT0FBTyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsQ0FBQztnQkFDMUMsQ0FBQztnQkFDRCxtQkFBbUIsRUFBRSxDQUFDLE9BQThCLEVBQUUsS0FBWSxFQUFRLEVBQUU7b0JBQ3hFLE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxDQUFlLEtBQUssQ0FBQyxDQUFDO29CQUNyRCxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7Z0JBQ3ZELENBQUM7YUFDSjtZQUNELFVBQVUsRUFBRTtnQkFDUixlQUFlLENBQUMsT0FBOEI7b0JBQzFDLE1BQU0sZUFBZSxHQUEyQixFQUFFLENBQUM7b0JBQ25ELE1BQU0sVUFBVSxHQUFJLE9BQU8sQ0FBQyxRQUFnQixDQUFDLGFBQWEsQ0FBQztvQkFDM0QsSUFBSSxVQUFVLEVBQUU7d0JBQ1osVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTs0QkFDM0IsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs0QkFDMUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQ0FDeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDaEQsT0FBTyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7Z0NBQzFCLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtvQ0FDbEIsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFlLENBQUM7b0NBQzdFLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2lDQUN2Rjs0QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDLENBQUMsQ0FBQztxQkFDTjtvQkFDRCxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLENBQUM7Z0JBQzNDLENBQUM7Z0JBQ0QsbUJBQW1CLENBQUMsT0FBOEIsRUFBRSxLQUFVO29CQUMxRCxNQUFNLFVBQVUsR0FBSSxPQUFPLENBQUMsUUFBZ0IsQ0FBQyxhQUFhLENBQUM7b0JBQzNELElBQUksVUFBVSxFQUFFO3dCQUNaLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7NEJBQzNCLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUM7NEJBQzFELFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0NBQ3hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ2hELE9BQU8sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO2dDQUMxQixNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLENBQUM7Z0NBQ2xHLElBQUksY0FBYyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7b0NBQ3BDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztpQ0FDdkU7NEJBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBQ1AsQ0FBQyxDQUFDLENBQUM7cUJBQ047b0JBQ0QsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNwQyxDQUFDO2dCQUNEOzttQkFFRztnQkFDSCxjQUFjLEVBQUUsQ0FBQyxJQUFrQyxFQUFFLEVBQUU7b0JBQ25ELElBQUksU0FBUyxDQUFDO29CQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDaEIsU0FBUyxHQUFHLElBQUksQ0FBQzt3QkFDakIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7cUJBQ3RCO29CQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELENBQUM7YUFDSjtTQUNKLENBQUM7SUErQnVDLENBQUM7SUE3QjFDOzs7Ozs7OztPQVFHO0lBQ0gsSUFDVyxPQUFPO1FBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFXLE9BQU8sQ0FBQyxLQUF3QjtRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxnQkFBZ0IsQ0FBQyxFQUFFO1lBQzFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDaEM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7U0FDbkM7SUFDTCxDQUFDO0lBVUQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSSxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksRUFBRSxRQUF3QztRQUN0RSxJQUFJLEtBQTBCLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFlLENBQUM7UUFDN0QsSUFBSSxTQUFTLEVBQUU7WUFDWCxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFXLENBQUM7U0FDbkU7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0ksUUFBUSxDQUFDLEtBQTBCLEVBQUUsUUFBd0M7UUFDaEYsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDM0IsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFlLENBQUM7U0FDM0M7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLE9BQU87SUFDMUMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssVUFBVSxDQUFDLElBQW9DO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxTQUFTLEdBQUcsRUFBZ0IsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUM3RCxPQUFPO2lCQUNWO2dCQUNELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sWUFBWSxHQUFlLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUN0RDtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssZ0JBQWdCLENBQUMsS0FBaUIsRUFBRSxRQUF3QztRQUNoRixtRkFBbUY7UUFDbkYsa0NBQWtDO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2hFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMvRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUN0RTthQUFNO1lBQ0gsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQjtJQUNMLENBQUM7SUFFTyxlQUFlLENBQUMsS0FBaUI7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNqQixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLFFBQVEsSUFBSSxZQUFZLEVBQUU7b0JBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7aUJBQ25EO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNLLGFBQWEsQ0FBQyxJQUFvQztRQUN0RCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBbUIsQ0FBQyxDQUFDO2FBQzlDO1NBQ0o7YUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsSUFBc0IsQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNLLCtCQUErQixDQUFDLGNBQXdDO1FBQzVFLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUU7WUFDdEQsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELE1BQU0sZUFBZSxHQUFHLElBQUksd0JBQXdCLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFeEcsS0FBSyxNQUFNLElBQUksSUFBSSxjQUFjLENBQUMsaUJBQWlCLEVBQUU7WUFDakQsK0RBQStEO1lBQy9ELElBQUssSUFBaUMsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDdEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLCtCQUErQixDQUFFLElBQWlDLENBQUMsQ0FBQztnQkFDekYsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNuRDtpQkFBTTtnQkFDSCxNQUFNLElBQUksR0FBRyxJQUE0QixDQUFDO2dCQUMxQyxJQUFJLFFBQWdCLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDckMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztpQkFDdEY7cUJBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDM0IsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztpQkFDaEY7cUJBQU07b0JBQ0gsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7Z0JBQ0Qsc0NBQXNDO2dCQUN0QyxnR0FBZ0c7Z0JBQ2hHLDJDQUEyQztnQkFDM0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzVDO3FCQUFNO29CQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUMvSTtnQkFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEYsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoRDtTQUNKO1FBRUQsT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0ssMEJBQTBCLENBQUMsUUFBZ0IsRUFBRSxJQUFZO1FBQzdELElBQUksT0FBTyxDQUFDO1FBQ1osUUFBUSxRQUFRLEVBQUU7WUFDZCxLQUFLLGtCQUFrQixDQUFDLE9BQU87Z0JBQzNCLE9BQU8sR0FBRywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDaEQsTUFBTTtZQUNWLEtBQUssa0JBQWtCLENBQUMsTUFBTTtnQkFDMUIsT0FBTyxHQUFHLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQyxNQUFNO1lBQ1YsS0FBSyxrQkFBa0IsQ0FBQyxJQUFJO2dCQUN4QixPQUFPLEdBQUcsdUJBQXVCLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzdDLE1BQU07WUFDVixLQUFLLGtCQUFrQixDQUFDLFFBQVE7Z0JBQzVCLE9BQU8sR0FBRywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakQsTUFBTTtZQUNWLEtBQUssa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQy9CO2dCQUNJLE9BQU8sR0FBRyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDL0MsTUFBTTtTQUNiO1FBQ0QsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxHQUFXLEVBQUUsR0FBUTtRQUMzQyxJQUFJLEdBQUcsS0FBSyxXQUFXLElBQUksR0FBRyxZQUFZLEdBQUcsRUFBRTtZQUMzQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFTyxVQUFVLENBQUMsR0FBVztRQUMxQixNQUFNLE9BQU8sR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7O2tIQWhnQlEscUJBQXFCLGtCQTZURSxhQUFhO3NHQTdUcEMscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBSGpDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtpQkFDN0I7OzBCQThUUSxJQUFJOzswQkFBSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLGFBQWE7a0hBakJsQyxPQUFPO3NCQURqQixLQUFLO3VCQUFDLGNBQWM7O0FBd056Qjs7R0FFRztBQUtILE1BQU0sT0FBTyxrQkFBa0I7OytHQUFsQixrQkFBa0I7Z0hBQWxCLGtCQUFrQixpQkExZ0JsQixxQkFBcUIsYUFBckIscUJBQXFCO2dIQTBnQnJCLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUo5QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztpQkFDbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE9wdGlvbmFsLCBJbnB1dCwgTmdNb2R1bGUsIEhvc3QsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgVmlld0NvbnRhaW5lclJlZiwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsIElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWV4cHJlc3Npb25zLXRyZWUnO1xuaW1wb3J0IHsgSUZpbHRlcmluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWV4cHJlc3Npb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IElneENvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4vY29sdW1ucy9jb2x1bW4uY29tcG9uZW50JztcbmltcG9ydCB7IElneENvbHVtbkdyb3VwQ29tcG9uZW50IH0gZnJvbSAnLi9jb2x1bW5zL2NvbHVtbi1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSUdyb3VwaW5nRXhwcmVzc2lvbiB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGluZy1leHByZXNzaW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJUGFnaW5nU3RhdGUgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvcGFnaW5nLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBHcmlkQ29sdW1uRGF0YVR5cGUgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7XG4gICAgSWd4Qm9vbGVhbkZpbHRlcmluZ09wZXJhbmQsIElneE51bWJlckZpbHRlcmluZ09wZXJhbmQsIElneERhdGVGaWx0ZXJpbmdPcGVyYW5kLFxuICAgIElneFN0cmluZ0ZpbHRlcmluZ09wZXJhbmQsIElGaWx0ZXJpbmdPcGVyYXRpb24sIElneERhdGVUaW1lRmlsdGVyaW5nT3BlcmFuZFxufSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBJR3JvdXBCeUV4cGFuZFN0YXRlIH0gZnJvbSAnLi4vZGF0YS1vcGVyYXRpb25zL2dyb3VwYnktZXhwYW5kLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJR3JvdXBpbmdTdGF0ZSB9IGZyb20gJy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGJ5LXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkL2dyaWQuY29tcG9uZW50JztcbmltcG9ydCB7IElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnQgfSBmcm9tICcuL2hpZXJhcmNoaWNhbC1ncmlkL2hpZXJhcmNoaWNhbC1ncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJUGlubmluZ0NvbmZpZyB9IGZyb20gJy4vZ3JpZC5jb21tb24nO1xuaW1wb3J0IHsgZGVsYXksIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBHcmlkU2VsZWN0aW9uUmFuZ2UgfSBmcm9tICcuL2NvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBJU29ydGluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBHcmlkVHlwZSwgSUdYX0dSSURfQkFTRSB9IGZyb20gJy4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJR3JpZFN0YXRlIHtcbiAgICBjb2x1bW5zPzogSUNvbHVtblN0YXRlW107XG4gICAgZmlsdGVyaW5nPzogSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZTtcbiAgICBhZHZhbmNlZEZpbHRlcmluZz86IElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWU7XG4gICAgcGFnaW5nPzogSVBhZ2luZ1N0YXRlO1xuICAgIG1vdmluZz86IGJvb2xlYW47XG4gICAgc29ydGluZz86IElTb3J0aW5nRXhwcmVzc2lvbltdO1xuICAgIGdyb3VwQnk/OiBJR3JvdXBpbmdTdGF0ZTtcbiAgICBjZWxsU2VsZWN0aW9uPzogR3JpZFNlbGVjdGlvblJhbmdlW107XG4gICAgcm93U2VsZWN0aW9uPzogYW55W107XG4gICAgY29sdW1uU2VsZWN0aW9uPzogc3RyaW5nW107XG4gICAgcm93UGlubmluZz86IGFueVtdO1xuICAgIHBpbm5pbmdDb25maWc/OiBJUGlubmluZ0NvbmZpZztcbiAgICBleHBhbnNpb24/OiBhbnlbXTtcbiAgICByb3dJc2xhbmRzPzogSUdyaWRTdGF0ZUNvbGxlY3Rpb25bXTtcbiAgICBpZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJR3JpZFN0YXRlQ29sbGVjdGlvbiB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBwYXJlbnRSb3dJRDogYW55O1xuICAgIHN0YXRlOiBJR3JpZFN0YXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElHcmlkU3RhdGVPcHRpb25zIHtcbiAgICBjb2x1bW5zPzogYm9vbGVhbjtcbiAgICBmaWx0ZXJpbmc/OiBib29sZWFuO1xuICAgIGFkdmFuY2VkRmlsdGVyaW5nPzogYm9vbGVhbjtcbiAgICBzb3J0aW5nPzogYm9vbGVhbjtcbiAgICBncm91cEJ5PzogYm9vbGVhbjtcbiAgICBwYWdpbmc/OiBib29sZWFuO1xuICAgIGNlbGxTZWxlY3Rpb24/OiBib29sZWFuO1xuICAgIHJvd1NlbGVjdGlvbj86IGJvb2xlYW47XG4gICAgY29sdW1uU2VsZWN0aW9uPzogYm9vbGVhbjtcbiAgICByb3dQaW5uaW5nPzogYm9vbGVhbjtcbiAgICBwaW5uaW5nQ29uZmlnPzogYm9vbGVhbjtcbiAgICBleHBhbnNpb24/OiBib29sZWFuO1xuICAgIHJvd0lzbGFuZHM/OiBib29sZWFuO1xuICAgIG1vdmluZz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbHVtblN0YXRlIHtcbiAgICBwaW5uZWQ6IGJvb2xlYW47XG4gICAgc29ydGFibGU6IGJvb2xlYW47XG4gICAgZmlsdGVyYWJsZTogYm9vbGVhbjtcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcbiAgICBzb3J0aW5nSWdub3JlQ2FzZTogYm9vbGVhbjtcbiAgICBmaWx0ZXJpbmdJZ25vcmVDYXNlOiBib29sZWFuO1xuICAgIGhlYWRlckNsYXNzZXM6IHN0cmluZztcbiAgICBoZWFkZXJHcm91cENsYXNzZXM6IHN0cmluZztcbiAgICBtYXhXaWR0aDogc3RyaW5nO1xuICAgIGdyb3VwYWJsZTogYm9vbGVhbjtcbiAgICBtb3ZhYmxlOiBib29sZWFuO1xuICAgIGhpZGRlbjogYm9vbGVhbjtcbiAgICBkYXRhVHlwZTogR3JpZENvbHVtbkRhdGFUeXBlO1xuICAgIGhhc1N1bW1hcnk6IGJvb2xlYW47XG4gICAgZmllbGQ6IHN0cmluZztcbiAgICB3aWR0aDogYW55O1xuICAgIGhlYWRlcjogc3RyaW5nO1xuICAgIHJlc2l6YWJsZTogYm9vbGVhbjtcbiAgICBzZWFyY2hhYmxlOiBib29sZWFuO1xuICAgIGNvbHVtbkdyb3VwOiBib29sZWFuO1xuICAgIHBhcmVudDogYW55O1xuICAgIGRpc2FibGVIaWRpbmc6IGJvb2xlYW47XG59XG5cbmV4cG9ydCB0eXBlIEdyaWRGZWF0dXJlcyA9IGtleW9mIElHcmlkU3RhdGVPcHRpb25zO1xuXG5pbnRlcmZhY2UgRmVhdHVyZSB7XG4gICAgZ2V0RmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlKSA9PiBJR3JpZFN0YXRlO1xuICAgIHJlc3RvcmVGZWF0dXJlU3RhdGU6IChjb250ZXh0OiBJZ3hHcmlkU3RhdGVEaXJlY3RpdmUsIHN0YXRlOiBJQ29sdW1uU3RhdGVbXSB8IElQYWdpbmdTdGF0ZSB8IGJvb2xlYW4gfCBJU29ydGluZ0V4cHJlc3Npb25bXSB8XG4gICAgICAgIElHcm91cGluZ1N0YXRlIHwgSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSB8IEdyaWRTZWxlY3Rpb25SYW5nZVtdIHwgSVBpbm5pbmdDb25maWcgfCBhbnlbXSkgPT4gdm9pZDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbaWd4R3JpZFN0YXRlXSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZFN0YXRlRGlyZWN0aXZlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25zOiBJR3JpZFN0YXRlT3B0aW9ucyB8ICcnO1xuXG4gICAgcHJpdmF0ZSBmZWF0dXJlS2V5czogR3JpZEZlYXR1cmVzW10gPSBbXTtcbiAgICBwcml2YXRlIHN0YXRlOiBJR3JpZFN0YXRlO1xuICAgIHByaXZhdGUgY3VyckdyaWQ6IEdyaWRUeXBlO1xuICAgIHByaXZhdGUgX29wdGlvbnM6IElHcmlkU3RhdGVPcHRpb25zID0ge1xuICAgICAgICBjb2x1bW5zOiB0cnVlLFxuICAgICAgICBmaWx0ZXJpbmc6IHRydWUsXG4gICAgICAgIGFkdmFuY2VkRmlsdGVyaW5nOiB0cnVlLFxuICAgICAgICBzb3J0aW5nOiB0cnVlLFxuICAgICAgICBncm91cEJ5OiB0cnVlLFxuICAgICAgICBwYWdpbmc6IHRydWUsXG4gICAgICAgIGNlbGxTZWxlY3Rpb246IHRydWUsXG4gICAgICAgIHJvd1NlbGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgY29sdW1uU2VsZWN0aW9uOiB0cnVlLFxuICAgICAgICByb3dQaW5uaW5nOiB0cnVlLFxuICAgICAgICBleHBhbnNpb246IHRydWUsXG4gICAgICAgIG1vdmluZzogdHJ1ZSxcbiAgICAgICAgcm93SXNsYW5kczogdHJ1ZVxuICAgIH07XG4gICAgcHJpdmF0ZSBGRUFUVVJFUyA9IHtcbiAgICAgICAgc29ydGluZzogIHtcbiAgICAgICAgICAgIGdldEZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSk6IElHcmlkU3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvcnRpbmdTdGF0ZSA9IGNvbnRleHQuY3VyckdyaWQuc29ydGluZ0V4cHJlc3Npb25zO1xuICAgICAgICAgICAgICAgIHNvcnRpbmdTdGF0ZS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcy5zdHJhdGVneTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHMub3duZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc29ydGluZzogc29ydGluZ1N0YXRlIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IElTb3J0aW5nRXhwcmVzc2lvbltdKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMgPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyaW5nOiB7XG4gICAgICAgICAgICBnZXRGZWF0dXJlU3RhdGU6IChjb250ZXh0OiBJZ3hHcmlkU3RhdGVEaXJlY3RpdmUpOiBJR3JpZFN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJpbmdTdGF0ZSA9IGNvbnRleHQuY3VyckdyaWQuZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlO1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJpbmdTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZmlsdGVyaW5nU3RhdGUub3duZXI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBmaWx0ZXJpbmdTdGF0ZS5maWx0ZXJpbmdPcGVyYW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIChpdGVtIGFzIElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpLm93bmVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IGZpbHRlcmluZzogZmlsdGVyaW5nU3RhdGUgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0b3JlRmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlLCBzdGF0ZTogRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyVHJlZSA9IGNvbnRleHQuY3JlYXRlRXhwcmVzc2lvbnNUcmVlRnJvbU9iamVjdChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZC5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgPSBmaWx0ZXJUcmVlIGFzIEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWR2YW5jZWRGaWx0ZXJpbmc6IHtcbiAgICAgICAgICAgIGdldEZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSk6IElHcmlkU3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmluZ1N0YXRlID0gY29udGV4dC5jdXJyR3JpZC5hZHZhbmNlZEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZTtcbiAgICAgICAgICAgICAgICBsZXQgYWR2YW5jZWRGaWx0ZXJpbmc6IGFueTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyaW5nU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZpbHRlcmluZ1N0YXRlLm93bmVyO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmlsdGVyaW5nU3RhdGUuZmlsdGVyaW5nT3BlcmFuZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSAoaXRlbSBhcyBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKS5vd25lcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlZEZpbHRlcmluZyA9IGZpbHRlcmluZ1N0YXRlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkRmlsdGVyaW5nID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IGFkdmFuY2VkRmlsdGVyaW5nIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlclRyZWUgPSBjb250ZXh0LmNyZWF0ZUV4cHJlc3Npb25zVHJlZUZyb21PYmplY3Qoc3RhdGUpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuY3VyckdyaWQuYWR2YW5jZWRGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgPSBmaWx0ZXJUcmVlIGFzIEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29sdW1uczoge1xuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlKTogSUdyaWRTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JpZENvbHVtbnM6IElDb2x1bW5TdGF0ZVtdID0gY29udGV4dC5jdXJyR3JpZC5jb2x1bW5MaXN0Lm1hcCgoYykgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgcGlubmVkOiBjLnBpbm5lZCxcbiAgICAgICAgICAgICAgICAgICAgc29ydGFibGU6IGMuc29ydGFibGUsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmFibGU6IGMuZmlsdGVyYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgZWRpdGFibGU6IGMuZWRpdGFibGUsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRpbmdJZ25vcmVDYXNlOiBjLnNvcnRpbmdJZ25vcmVDYXNlLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJpbmdJZ25vcmVDYXNlOiBjLmZpbHRlcmluZ0lnbm9yZUNhc2UsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlckNsYXNzZXM6IGMuaGVhZGVyQ2xhc3NlcyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyR3JvdXBDbGFzc2VzOiBjLmhlYWRlckdyb3VwQ2xhc3NlcyxcbiAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IGMubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwYWJsZTogYy5ncm91cGFibGUsXG4gICAgICAgICAgICAgICAgICAgIG1vdmFibGU6IGMubW92YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuOiBjLmhpZGRlbixcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IGMuZGF0YVR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGhhc1N1bW1hcnk6IGMuaGFzU3VtbWFyeSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGMuZmllbGQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBjLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IGMuaGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICByZXNpemFibGU6IGMucmVzaXphYmxlLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hhYmxlOiBjLnNlYXJjaGFibGUsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IGMuc2VsZWN0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjLnBhcmVudCA/IGMucGFyZW50LmhlYWRlciA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkdyb3VwOiBjLmNvbHVtbkdyb3VwLFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlSGlkaW5nOiBjLmRpc2FibGVIaWRpbmdcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY29sdW1uczogZ3JpZENvbHVtbnMgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0b3JlRmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlLCBzdGF0ZTogSUNvbHVtblN0YXRlW10pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdDb2x1bW5zID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IGNvbnRleHQucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoSWd4Q29sdW1uQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cEZhY3RvcnkgPSBjb250ZXh0LnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KElneENvbHVtbkdyb3VwQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5mb3JFYWNoKChjb2xTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoYXNDb2x1bW5Hcm91cCA9IGNvbFN0YXRlLmNvbHVtbkdyb3VwO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29sU3RhdGUuY29sdW1uR3JvdXA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNDb2x1bW5Hcm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVmMSA9IGdyb3VwRmFjdG9yeS5jcmVhdGUoY29udGV4dC52aWV3UmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVmMS5pbnN0YW5jZSwgY29sU3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZjEuaW5zdGFuY2UucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sdW1uR3JvdXA6IElneENvbHVtbkdyb3VwQ29tcG9uZW50ID0gbmV3Q29sdW1ucy5maW5kKGUgPT4gZS5oZWFkZXIgPT09IHJlZjEuaW5zdGFuY2UucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5Hcm91cC5jaGlsZHJlbi5yZXNldChbLi4uY29sdW1uR3JvdXAuY2hpbGRyZW4udG9BcnJheSgpLCByZWYxLmluc3RhbmNlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmMS5pbnN0YW5jZS5wYXJlbnQgPSBjb2x1bW5Hcm91cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZjEuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29sdW1ucy5wdXNoKHJlZjEuaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVmID0gZmFjdG9yeS5jcmVhdGUoY29udGV4dC52aWV3UmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVmLmluc3RhbmNlLCBjb2xTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVmLmluc3RhbmNlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkdyb3VwOiBJZ3hDb2x1bW5Hcm91cENvbXBvbmVudCA9IG5ld0NvbHVtbnMuZmluZChlID0+IGUuaGVhZGVyID09PSByZWYuaW5zdGFuY2UucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmLmluc3RhbmNlLnBhcmVudCA9IGNvbHVtbkdyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5Hcm91cC5jaGlsZHJlbi5yZXNldChbLi4uY29sdW1uR3JvdXAuY2hpbGRyZW4udG9BcnJheSgpLCByZWYuaW5zdGFuY2VdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29sdW1ucy5wdXNoKHJlZi5pbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmdyaWQudXBkYXRlQ29sdW1ucyhuZXdDb2x1bW5zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ3JvdXBCeToge1xuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlKTogSUdyaWRTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JpZCA9IGNvbnRleHQuY3VyckdyaWQgYXMgSWd4R3JpZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cGluZ0V4cHJlc3Npb25zID0gZ3JpZC5ncm91cGluZ0V4cHJlc3Npb25zO1xuICAgICAgICAgICAgICAgIGdyb3VwaW5nRXhwcmVzc2lvbnMuZm9yRWFjaChleHByID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV4cHIuc3RyYXRlZ3k7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwYW5zaW9uU3RhdGUgPSBncmlkLmdyb3VwaW5nRXhwYW5zaW9uU3RhdGU7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBzRXhwYW5kZWQgPSBncmlkLmdyb3Vwc0V4cGFuZGVkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZ3JvdXBCeTogeyBleHByZXNzaW9uczogZ3JvdXBpbmdFeHByZXNzaW9ucywgZXhwYW5zaW9uOiBleHBhbnNpb25TdGF0ZSwgZGVmYXVsdEV4cGFuZGVkOiBncm91cHNFeHBhbmRlZH0gIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IElHcm91cGluZ1N0YXRlKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JpZCA9IGNvbnRleHQuY3VyckdyaWQgYXMgSWd4R3JpZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICBncmlkLmdyb3VwaW5nRXhwcmVzc2lvbnMgPSBzdGF0ZS5leHByZXNzaW9ucyBhcyBJR3JvdXBpbmdFeHByZXNzaW9uW107XG4gICAgICAgICAgICAgICAgaWYgKGdyaWQuZ3JvdXBzRXhwYW5kZWQgIT09IHN0YXRlLmRlZmF1bHRFeHBhbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICBncmlkLnRvZ2dsZUFsbEdyb3VwUm93cygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQuZ3JvdXBpbmdFeHBhbnNpb25TdGF0ZSA9IHN0YXRlLmV4cGFuc2lvbiBhcyBJR3JvdXBCeUV4cGFuZFN0YXRlW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwYWdpbmc6IHtcbiAgICAgICAgICAgIGdldEZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSk6IElHcmlkU3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2luZ1N0YXRlID0gY29udGV4dC5jdXJyR3JpZC5wYWdpbmdTdGF0ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwYWdpbmc6IHBhZ2luZ1N0YXRlIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IElQYWdpbmdTdGF0ZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY29udGV4dC5jdXJyR3JpZC5wYWdpbmF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29udGV4dC5jdXJyR3JpZC5wYWdpbmF0b3IucGVyUGFnZSAhPT0gc3RhdGUucmVjb3Jkc1BlclBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZC5wYWdpbmF0b3IucGVyUGFnZSA9IHN0YXRlLnJlY29yZHNQZXJQYWdlO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJHcmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQuY3VyckdyaWQucGFnaW5hdG9yLnBhZ2UgPSBzdGF0ZS5pbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW92aW5nOiB7XG4gICAgICAgICAgICBnZXRGZWF0dXJlU3RhdGU6IChjb250ZXh0OiBJZ3hHcmlkU3RhdGVEaXJlY3RpdmUpOiBJR3JpZFN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBtb3Zpbmc6IGNvbnRleHQuY3VyckdyaWQubW92aW5nIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJHcmlkLm1vdmluZyA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByb3dTZWxlY3Rpb246IHtcbiAgICAgICAgICAgIGdldEZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSk6IElHcmlkU3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQuY3VyckdyaWQuc2VsZWN0ZWRSb3dzO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHJvd1NlbGVjdGlvbjogc2VsZWN0aW9uIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IGFueVtdKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZC5zZWxlY3RSb3dzKHN0YXRlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2VsbFNlbGVjdGlvbjoge1xuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlKTogSUdyaWRTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5jdXJyR3JpZC5nZXRTZWxlY3RlZFJhbmdlcygpLm1hcChyYW5nZSA9PlxuICAgICAgICAgICAgICAgICAgICAoeyByb3dTdGFydDogcmFuZ2Uucm93U3RhcnQsIHJvd0VuZDogcmFuZ2Uucm93RW5kLCBjb2x1bW5TdGFydDogcmFuZ2UuY29sdW1uU3RhcnQsIGNvbHVtbkVuZDogcmFuZ2UuY29sdW1uRW5kIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBjZWxsU2VsZWN0aW9uOiBzZWxlY3Rpb24gfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0b3JlRmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlLCBzdGF0ZTogR3JpZFNlbGVjdGlvblJhbmdlW10pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IHsgcm93U3RhcnQ6IHIucm93U3RhcnQsIHJvd0VuZDogci5yb3dFbmQsIGNvbHVtblN0YXJ0OiByLmNvbHVtblN0YXJ0LCBjb2x1bW5FbmQ6IHIuY29sdW1uRW5kfTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZC5zZWxlY3RSYW5nZShyYW5nZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbHVtblNlbGVjdGlvbjoge1xuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlKTogSUdyaWRTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5jdXJyR3JpZC5zZWxlY3RlZENvbHVtbnMoKS5tYXAoYyA9PiBjLmZpZWxkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBjb2x1bW5TZWxlY3Rpb246IHNlbGVjdGlvbiB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc3RvcmVGZWF0dXJlU3RhdGU6IChjb250ZXh0OiBJZ3hHcmlkU3RhdGVEaXJlY3RpdmUsIHN0YXRlOiBzdHJpbmdbXSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuY3VyckdyaWQuZGVzZWxlY3RBbGxDb2x1bW5zKCk7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZC5zZWxlY3RDb2x1bW5zKHN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcm93UGlubmluZzoge1xuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlKTogSUdyaWRTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGlubmVkID0gY29udGV4dC5jdXJyR3JpZC5waW5uZWRSb3dzLm1hcCh4ID0+IHgua2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3dQaW5uaW5nOiBwaW5uZWQgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0b3JlRmVhdHVyZVN0YXRlOiAoY29udGV4dDogSWd4R3JpZFN0YXRlRGlyZWN0aXZlLCBzdGF0ZTogYW55W10pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBjdXJyZW50IHN0YXRlLlxuICAgICAgICAgICAgICAgIGNvbnRleHQuY3VyckdyaWQucGlubmVkUm93cy5mb3JFYWNoKHJvdyA9PiByb3cudW5waW4oKSk7XG4gICAgICAgICAgICAgICAgc3RhdGUuZm9yRWFjaChyb3dJRCA9PiBjb250ZXh0LmN1cnJHcmlkLnBpblJvdyhyb3dJRCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwaW5uaW5nQ29uZmlnOiB7XG4gICAgICAgICAgICBnZXRGZWF0dXJlU3RhdGU6IChjb250ZXh0OiBJZ3hHcmlkU3RhdGVEaXJlY3RpdmUpOiBJR3JpZFN0YXRlID0+ICh7IHBpbm5pbmdDb25maWc6IGNvbnRleHQuY3VyckdyaWQucGlubmluZyB9KSxcbiAgICAgICAgICAgIHJlc3RvcmVGZWF0dXJlU3RhdGU6IChjb250ZXh0OiBJZ3hHcmlkU3RhdGVEaXJlY3RpdmUsIHN0YXRlOiBJUGlubmluZ0NvbmZpZyk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuY3VyckdyaWQucGlubmluZyA9IHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBleHBhbnNpb246IHtcbiAgICAgICAgICAgIGdldEZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSk6IElHcmlkU3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuc2lvblN0YXRlcyA9IEFycmF5LmZyb20oY29udGV4dC5jdXJyR3JpZC5leHBhbnNpb25TdGF0ZXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGV4cGFuc2lvbjogZXhwYW5zaW9uU3RhdGVzIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdG9yZUZlYXR1cmVTdGF0ZTogKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IGFueVtdKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwYW5zaW9uU3RhdGVzID0gbmV3IE1hcDxhbnksIGJvb2xlYW4+KHN0YXRlKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJHcmlkLmV4cGFuc2lvblN0YXRlcyA9IGV4cGFuc2lvblN0YXRlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcm93SXNsYW5kczoge1xuICAgICAgICAgICAgZ2V0RmVhdHVyZVN0YXRlKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSk6IElHcmlkU3RhdGUge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR3JpZFN0YXRlczogSUdyaWRTdGF0ZUNvbGxlY3Rpb25bXSA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0lzbGFuZHMgPSAoY29udGV4dC5jdXJyR3JpZCBhcyBhbnkpLmFsbExheW91dExpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKHJvd0lzbGFuZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93SXNsYW5kcy5mb3JFYWNoKHJvd0lzbGFuZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEdyaWRzID0gcm93SXNsYW5kLnJvd0lzbGFuZEFQSS5nZXRDaGlsZEdyaWRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdyaWRzLmZvckVhY2goY2hHcmlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRSb3dJRCA9IHRoaXMuZ2V0UGFyZW50Um93SUQoY2hHcmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJHcmlkID0gY2hHcmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZXh0LmN1cnJHcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR3JpZFN0YXRlID0gY29udGV4dC5idWlsZFN0YXRlKGNvbnRleHQuZmVhdHVyZUtleXMpIGFzIElHcmlkU3RhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkR3JpZFN0YXRlcy5wdXNoKHsgaWQ6IGAke3Jvd0lzbGFuZC5pZH1gLCBwYXJlbnRSb3dJRCwgc3RhdGU6IGNoaWxkR3JpZFN0YXRlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGV4dC5jdXJyR3JpZCA9IGNvbnRleHQuZ3JpZDtcbiAgICAgICAgICAgICAgICByZXR1cm4geyByb3dJc2xhbmRzOiBjaGlsZEdyaWRTdGF0ZXMgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0b3JlRmVhdHVyZVN0YXRlKGNvbnRleHQ6IElneEdyaWRTdGF0ZURpcmVjdGl2ZSwgc3RhdGU6IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0lzbGFuZHMgPSAoY29udGV4dC5jdXJyR3JpZCBhcyBhbnkpLmFsbExheW91dExpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKHJvd0lzbGFuZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93SXNsYW5kcy5mb3JFYWNoKHJvd0lzbGFuZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEdyaWRzID0gcm93SXNsYW5kLnJvd0lzbGFuZEFQSS5nZXRDaGlsZEdyaWRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEdyaWRzLmZvckVhY2goY2hHcmlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRSb3dJRCA9IHRoaXMuZ2V0UGFyZW50Um93SUQoY2hHcmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJHcmlkID0gY2hHcmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkR3JpZFN0YXRlID0gc3RhdGUuZmluZChzdCA9PiBzdC5pZCA9PT0gcm93SXNsYW5kLmlkICYmIHN0LnBhcmVudFJvd0lEID09PSBwYXJlbnRSb3dJRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkR3JpZFN0YXRlICYmIGNvbnRleHQuY3VyckdyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXN0b3JlR3JpZFN0YXRlKGNoaWxkR3JpZFN0YXRlLnN0YXRlLCBjb250ZXh0LmZlYXR1cmVLZXlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQuY3VyckdyaWQgPSBjb250ZXh0LmdyaWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUcmF2ZXJzZXMgdGhlIGhpZXJhcmNoeSB1cCB0byB0aGUgcm9vdCBncmlkIHRvIHJldHVybiB0aGUgSUQgb2YgdGhlIGV4cGFuZGVkIHJvdy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UGFyZW50Um93SUQ6IChncmlkOiBJZ3hIaWVyYXJjaGljYWxHcmlkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkR3JpZDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZ3JpZC5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRHcmlkID0gZ3JpZDtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZCA9IGdyaWQucGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JpZC5ncmlkQVBJLmdldFBhcmVudFJvd0lkKGNoaWxkR3JpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogIEFuIG9iamVjdCB3aXRoIG9wdGlvbnMgZGV0ZXJtaW5pbmcgaWYgYSBjZXJ0YWluIGZlYXR1cmUgc3RhdGUgc2hvdWxkIGJlIHNhdmVkLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2lneEdyaWRTdGF0ZV09XCJvcHRpb25zXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIG9wdGlvbnMgPSB7c2VsZWN0aW9uOiBmYWxzZSwgYWR2YW5jZWRGaWx0ZXJpbmc6IGZhbHNlfTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoJ2lneEdyaWRTdGF0ZScpXG4gICAgcHVibGljIGdldCBvcHRpb25zKCk6IElHcmlkU3RhdGVPcHRpb25zIHtcbiAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IG9wdGlvbnModmFsdWU6IElHcmlkU3RhdGVPcHRpb25zKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgdmFsdWUpO1xuICAgICAgICBpZiAoISh0aGlzLmdyaWQgaW5zdGFuY2VvZiBJZ3hHcmlkQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX29wdGlvbnMuZ3JvdXBCeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zLnJvd0lzbGFuZHM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgQEluamVjdChJR1hfR1JJRF9CQVNFKSBwdWJsaWMgZ3JpZDogR3JpZFR5cGUsXG4gICAgICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgcHJpdmF0ZSB2aWV3UmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7IH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHN0YXRlIG9mIGEgZmVhdHVyZSBvciBzdGF0ZXMgb2YgYWxsIGdyaWQgZmVhdHVyZXMsIHVubGVzcyBhIGNlcnRhaW4gZmVhdHVyZSBpcyBkaXNhYmxlZCB0aHJvdWdoIHRoZSBgb3B0aW9uc2AgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYHNlcmlhbGl6ZWAgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSByZXR1cm5lZCBvYmplY3Qgd2lsbCBiZSBzZXJpYWxpemVkIHRvIEpTT04gc3RyaW5nLiBEZWZhdWx0IHZhbHVlIGlzIHRydWUuXG4gICAgICogQHBhcmFtIGBmZWF0dXJlYCBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyBkZXRlcm1pbmluZyB0aGUgZmVhdHVyZXMgdG8gYmUgYWRkZWQgaW4gdGhlIHN0YXRlLiBJZiBza2lwcGVkLCBhbGwgZmVhdHVyZXMgYXJlIGFkZGVkLlxuICAgICAqIEByZXR1cm5zIFJldHVybnMgdGhlIHNlcmlhbGl6ZWQgdG8gSlNPTiBzdHJpbmcgSUdyaWRTdGF0ZSBvYmplY3QsIG9yIHRoZSBub24tc2VyaWFsaXplZCBJR3JpZFN0YXRlIG9iamVjdC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1ncmlkIFtpZ3hHcmlkU3RhdGVdPVwib3B0aW9uc1wiPjwvaWd4LWdyaWQ+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoSWd4R3JpZFN0YXRlRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgc3RhdGU7XG4gICAgICogbGV0IHN0YXRlID0gdGhpcy5zdGF0ZS5nZXRTdGF0ZSgpOyAvLyByZXR1cm5zIHN0cmluZ1xuICAgICAqIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGUoZmFsc2UpIC8vIHJldHVybnMgYElHcmlkU3RhdGVgIG9iamVjdFxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTdGF0ZShzZXJpYWxpemUgPSB0cnVlLCBmZWF0dXJlcz86IEdyaWRGZWF0dXJlcyB8IEdyaWRGZWF0dXJlc1tdKTogSUdyaWRTdGF0ZSB8IHN0cmluZyAge1xuICAgICAgICBsZXQgc3RhdGU6IElHcmlkU3RhdGUgfCBzdHJpbmc7XG4gICAgICAgIHRoaXMuY3VyckdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZSA9IHRoaXMuYnVpbGRTdGF0ZShmZWF0dXJlcykgYXMgSUdyaWRTdGF0ZTtcbiAgICAgICAgaWYgKHNlcmlhbGl6ZSkge1xuICAgICAgICAgICAgc3RhdGUgPSBKU09OLnN0cmluZ2lmeShzdGF0ZSwgdGhpcy5zdHJpbmdpZnlDYWxsYmFjaykgYXMgc3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlcyBncmlkIGZlYXR1cmVzJyBzdGF0ZSBiYXNlZCBvbiB0aGUgSUdyaWRTdGF0ZSBvYmplY3QgcGFzc2VkIGFzIGFuIGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIElHcmlkU3RhdGUgb2JqZWN0IHRvIHJlc3RvcmUgc3RhdGUgZnJvbS5cbiAgICAgKiBAcmV0dXJuc1xuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWdyaWQgW2lneEdyaWRTdGF0ZV09XCJvcHRpb25zXCI+PC9pZ3gtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZChJZ3hHcmlkU3RhdGVEaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyBzdGF0ZTtcbiAgICAgKiB0aGlzLnN0YXRlLnNldFN0YXRlKGdyaWRTdGF0ZSk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldFN0YXRlKHN0YXRlOiBJR3JpZFN0YXRlIHwgc3RyaW5nLCBmZWF0dXJlcz86IEdyaWRGZWF0dXJlcyB8IEdyaWRGZWF0dXJlc1tdKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEpTT04ucGFyc2Uoc3RhdGUpIGFzIElHcmlkU3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLmN1cnJHcmlkID0gdGhpcy5ncmlkO1xuICAgICAgICB0aGlzLnJlc3RvcmVHcmlkU3RhdGUoc3RhdGUsIGZlYXR1cmVzKTtcbiAgICAgICAgdGhpcy5ncmlkLmNkci5kZXRlY3RDaGFuZ2VzKCk7IC8vIFRPRE9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZHMgYW4gSUdyaWRTdGF0ZSBvYmplY3QuXG4gICAgICovXG4gICAgcHJpdmF0ZSBidWlsZFN0YXRlKGtleXM/OiBHcmlkRmVhdHVyZXMgfCBHcmlkRmVhdHVyZXNbXSk6IElHcmlkU3RhdGUge1xuICAgICAgICB0aGlzLmFwcGx5RmVhdHVyZXMoa2V5cyk7XG4gICAgICAgIGxldCBncmlkU3RhdGUgPSB7fSBhcyBJR3JpZFN0YXRlO1xuICAgICAgICB0aGlzLmZlYXR1cmVLZXlzLmZvckVhY2goZiA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zW2ZdKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEodGhpcy5ncmlkIGluc3RhbmNlb2YgSWd4R3JpZENvbXBvbmVudCkgJiYgZiA9PT0gJ2dyb3VwQnknKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0RmVhdHVyZShmKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmZWF0dXJlU3RhdGU6IElHcmlkU3RhdGUgPSBmZWF0dXJlLmdldEZlYXR1cmVTdGF0ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICBncmlkU3RhdGUgPSBPYmplY3QuYXNzaWduKGdyaWRTdGF0ZSwgZmVhdHVyZVN0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBncmlkU3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCB0aGF0IGNhbGxzIGNvcnJlc3BvbmRpbmcgbWV0aG9kcyB0byByZXN0b3JlIGZlYXR1cmVzIGZyb20gdGhlIHBhc3NlZCBJR3JpZFN0YXRlIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlc3RvcmVHcmlkU3RhdGUoc3RhdGU6IElHcmlkU3RhdGUsIGZlYXR1cmVzPzogR3JpZEZlYXR1cmVzIHwgR3JpZEZlYXR1cmVzW10pIHtcbiAgICAgICAgLy8gVE9ETyBOb3RpZnkgdGhlIGdyaWQgdGhhdCBjb2x1bW5MaXN0LmNoYW5nZXMgaXMgdHJpZ2dlcmVkIGJ5IHRoZSBzdGF0ZSBkaXJlY3RpdmVcbiAgICAgICAgLy8gaW5zdGVhZCBvZiBwaXBpbmcgaXQgbGlrZSBiZWxvd1xuICAgICAgICBjb25zdCBjb2x1bW5zID0gJ2NvbHVtbnMnO1xuICAgICAgICB0aGlzLmdyaWQuY29sdW1uTGlzdC5jaGFuZ2VzLnBpcGUoZGVsYXkoMCksIHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZlYXR1cmVLZXlzID0gdGhpcy5mZWF0dXJlS2V5cy5maWx0ZXIoZiA9PiBmICE9PSBjb2x1bW5zKTtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZlYXR1cmVzKHN0YXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXBwbHlGZWF0dXJlcyhmZWF0dXJlcyk7XG4gICAgICAgIGlmICh0aGlzLmZlYXR1cmVLZXlzLmluY2x1ZGVzKGNvbHVtbnMpICYmIHRoaXMub3B0aW9uc1tjb2x1bW5zXSAmJiBzdGF0ZVtjb2x1bW5zXSkge1xuICAgICAgICAgICAgdGhpcy5nZXRGZWF0dXJlKGNvbHVtbnMpLnJlc3RvcmVGZWF0dXJlU3RhdGUodGhpcywgc3RhdGVbY29sdW1uc10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRmVhdHVyZXMoc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXN0b3JlRmVhdHVyZXMoc3RhdGU6IElHcmlkU3RhdGUpIHtcbiAgICAgICAgdGhpcy5mZWF0dXJlS2V5cy5mb3JFYWNoKGYgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1tmXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVTdGF0ZSA9IHN0YXRlW2ZdO1xuICAgICAgICAgICAgICAgIGlmIChmID09PSAnbW92aW5nJyB8fCBmZWF0dXJlU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0RmVhdHVyZShmKTtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5yZXN0b3JlRmVhdHVyZVN0YXRlKHRoaXMsIGZlYXR1cmVTdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgY29sbGVjdGlvbiBvZiBhbGwgZ3JpZCBmZWF0dXJlcy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFwcGx5RmVhdHVyZXMoa2V5cz86IEdyaWRGZWF0dXJlcyB8IEdyaWRGZWF0dXJlc1tdKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZUtleXMgPSBbXTtcbiAgICAgICAgaWYgKCFrZXlzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWF0dXJlS2V5cy5wdXNoKGtleSBhcyBHcmlkRmVhdHVyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoa2V5cykpIHtcbiAgICAgICAgICAgIHRoaXMuZmVhdHVyZUtleXMgPSBbLi4ua2V5cyBhcyBHcmlkRmVhdHVyZXNbXV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZlYXR1cmVLZXlzLnB1c2goa2V5cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBidWlsZHMgYSBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgZnJvbSBhIHByb3ZpZGVkIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNyZWF0ZUV4cHJlc3Npb25zVHJlZUZyb21PYmplY3QoZXhwclRyZWVPYmplY3Q6IEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSk6IEZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSB7XG4gICAgICAgIGlmICghZXhwclRyZWVPYmplY3QgfHwgIWV4cHJUcmVlT2JqZWN0LmZpbHRlcmluZ09wZXJhbmRzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25zVHJlZSA9IG5ldyBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUoZXhwclRyZWVPYmplY3Qub3BlcmF0b3IsIGV4cHJUcmVlT2JqZWN0LmZpZWxkTmFtZSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGV4cHJUcmVlT2JqZWN0LmZpbHRlcmluZ09wZXJhbmRzKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBpdGVtIGlzIGFuIGV4cHJlc3Npb25zIHRyZWUgb3IgYSBzaW5nbGUgZXhwcmVzc2lvbi5cbiAgICAgICAgICAgIGlmICgoaXRlbSBhcyBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpLmZpbHRlcmluZ09wZXJhbmRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViVHJlZSA9IHRoaXMuY3JlYXRlRXhwcmVzc2lvbnNUcmVlRnJvbU9iamVjdCgoaXRlbSBhcyBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUpKTtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uc1RyZWUuZmlsdGVyaW5nT3BlcmFuZHMucHVzaChzdWJUcmVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwciA9IGl0ZW0gYXMgSUZpbHRlcmluZ0V4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgbGV0IGRhdGFUeXBlOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VyckdyaWQuY29sdW1uTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlID0gdGhpcy5jdXJyR3JpZC5jb2x1bW5MaXN0LmZpbmQoYyA9PiBjLmZpZWxkID09PSBleHByLmZpZWxkTmFtZSkuZGF0YVR5cGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGUgPSB0aGlzLnN0YXRlLmNvbHVtbnMuZmluZChjID0+IGMuZmllbGQgPT09IGV4cHIuZmllbGROYW1lKS5kYXRhVHlwZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gd2hlbiBFU0YsIHZhbHVlcyBhcmUgc3RvcmVkIGluIFNldC5cbiAgICAgICAgICAgICAgICAvLyBGaXJzdCB0aG9zZSB2YWx1ZXMgYXJlIGNvbnZlcnRlZCB0byBhbiBhcnJheSBiZWZvcmUgcmV0dXJuaW5nIHN0cmluZyBpbiB0aGUgc3RyaW5naWZ5Q2FsbGJhY2tcbiAgICAgICAgICAgICAgICAvLyBub3cgd2UgbmVlZCB0byBjb252ZXJ0IHRob3NlIGJhY2sgdG8gU2V0XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXhwci5zZWFyY2hWYWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHIuc2VhcmNoVmFsID0gbmV3IFNldChleHByLnNlYXJjaFZhbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwci5zZWFyY2hWYWwgPSBleHByLnNlYXJjaFZhbCAmJiAoZGF0YVR5cGUgPT09ICdkYXRlJyB8fCBkYXRhVHlwZSA9PT0gJ2RhdGVUaW1lJykgPyBuZXcgRGF0ZShEYXRlLnBhcnNlKGV4cHIuc2VhcmNoVmFsKSkgOiBleHByLnNlYXJjaFZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXhwci5jb25kaXRpb24gPSB0aGlzLmdlbmVyYXRlRmlsdGVyaW5nQ29uZGl0aW9uKGRhdGFUeXBlLCBleHByLmNvbmRpdGlvbi5uYW1lKTtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uc1RyZWUuZmlsdGVyaW5nT3BlcmFuZHMucHVzaChleHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByZXNzaW9uc1RyZWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZmlsdGVyaW5nIGxvZ2ljIGZ1bmN0aW9uIGZvciBhIGdpdmVuIGRhdGFUeXBlIGFuZCBjb25kaXRpb24gKGNvbnRhaW5zLCBncmVhdGVyVGhhbiwgZXRjLilcbiAgICAgKi9cbiAgICBwcml2YXRlIGdlbmVyYXRlRmlsdGVyaW5nQ29uZGl0aW9uKGRhdGFUeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IElGaWx0ZXJpbmdPcGVyYXRpb24ge1xuICAgICAgICBsZXQgZmlsdGVycztcbiAgICAgICAgc3dpdGNoIChkYXRhVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuQm9vbGVhbjpcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0gSWd4Qm9vbGVhbkZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLk51bWJlcjpcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0gSWd4TnVtYmVyRmlsdGVyaW5nT3BlcmFuZC5pbnN0YW5jZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHcmlkQ29sdW1uRGF0YVR5cGUuRGF0ZTpcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0gSWd4RGF0ZUZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkRhdGVUaW1lOlxuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSBJZ3hEYXRlVGltZUZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLlN0cmluZzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZmlsdGVycyA9IElneFN0cmluZ0ZpbHRlcmluZ09wZXJhbmQuaW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVycy5jb25kaXRpb24obmFtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJpbmdpZnlDYWxsYmFjayhrZXk6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ3NlYXJjaFZhbCcgJiYgdmFsIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGZWF0dXJlKGtleTogc3RyaW5nKTogRmVhdHVyZSB7XG4gICAgICAgIGNvbnN0IGZlYXR1cmU6IEZlYXR1cmUgPSB0aGlzLkZFQVRVUkVTW2tleV07XG4gICAgICAgIHJldHVybiBmZWF0dXJlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4R3JpZFN0YXRlRGlyZWN0aXZlXSxcbiAgICBleHBvcnRzOiBbSWd4R3JpZFN0YXRlRGlyZWN0aXZlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hHcmlkU3RhdGVNb2R1bGUgeyB9XG4iXX0=