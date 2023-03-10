import { Subject } from 'rxjs';
import { IFilteringExpressionsTree } from '../data-operations/filtering-expressions-tree';
import { IgxCell, IgxGridCRUDService, IgxEditRow } from './common/crud.service';
import { CellType, ColumnType, GridServiceType, GridType, RowType } from './common/grid.interface';
import { IGridEditEventArgs } from './common/events';
import { IgxColumnMovingService } from './moving/moving.service';
import { ISortingExpression } from '../data-operations/sorting-strategy';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class GridBaseAPIService<T extends GridType> implements GridServiceType {
    crudService: IgxGridCRUDService;
    cms: IgxColumnMovingService;
    grid: T;
    protected destroyMap: Map<string, Subject<boolean>>;
    constructor(crudService: IgxGridCRUDService, cms: IgxColumnMovingService);
    get_column_by_name(name: string): ColumnType;
    get_summary_data(): any[];
    /**
     * @hidden
     * @internal
     */
    getRowData(rowID: any): any;
    get_row_index_in_data(rowID: any, dataCollection?: any[]): number;
    get_row_by_key(rowSelector: any): RowType;
    get_row_by_index(rowIndex: number): RowType;
    /**
     * Gets the rowID of the record at the specified data view index
     *
     * @param index
     * @param dataCollection
     */
    get_rec_id_by_index(index: number, dataCollection?: any[]): any;
    get_cell_by_key(rowSelector: any, field: string): CellType;
    get_cell_by_index(rowIndex: number, columnID: number | string): CellType;
    get_cell_by_visible_index(rowIndex: number, columnIndex: number): CellType;
    update_cell(cell: IgxCell): IGridEditEventArgs;
    update_row(row: IgxEditRow, value: any, event?: Event): IGridEditEventArgs;
    sort(expression: ISortingExpression): void;
    sort_multiple(expressions: ISortingExpression[]): void;
    clear_sort(fieldName: string): void;
    clear_groupby(_name?: string | Array<string>): void;
    should_apply_number_style(column: ColumnType): boolean;
    get_data(): any[];
    get_all_data(includeTransactions?: boolean): any[];
    get_filtered_data(): any[];
    addRowToData(rowData: any, _parentID?: any): void;
    deleteRowFromData(rowID: any, index: number): void;
    deleteRowById(rowId: any): any;
    get_row_id(rowData: any): any;
    row_deleted_transaction(rowID: any): boolean;
    get_row_expansion_state(record: any): boolean;
    set_row_expansion_state(rowID: any, expanded: boolean, event?: Event): void;
    get_rec_by_id(rowID: any): any;
    /**
     * Returns the index of the record in the data view by pk or -1 if not found or primaryKey is not set.
     *
     * @param pk
     * @param dataCollection
     */
    get_rec_index_by_id(pk: string | number, dataCollection?: any[]): number;
    allow_expansion_state_change(rowID: any, expanded: any): boolean;
    prepare_sorting_expression(stateCollections: Array<Array<any>>, expression: ISortingExpression): void;
    remove_grouping_expression(_fieldName: any): void;
    filterDataByExpressions(expressionsTree: IFilteringExpressionsTree): any[];
    sortDataByExpressions(data: any[], expressions: ISortingExpression[]): any[];
    /**
     * Updates related row of provided grid's data source with provided new row value
     *
     * @param grid Grid to update data for
     * @param rowID ID of the row to update
     * @param rowValueInDataSource Initial value of the row as it is in data source
     * @param rowCurrentValue Current value of the row as it is with applied previous transactions
     * @param rowNewValue New value of the row
     */
    protected updateData(grid: any, rowID: any, rowValueInDataSource: any, rowCurrentValue: any, rowNewValue: {
        [x: string]: any;
    }): void;
    protected update_row_in_array(value: any, rowID: any, index: number): void;
    protected getSortStrategyPerColumn(fieldName: string): import("../data-operations/sorting-strategy").ISortingStrategy;
    static ??fac: i0.????FactoryDeclaration<GridBaseAPIService<any>, never>;
    static ??prov: i0.????InjectableDeclaration<GridBaseAPIService<any>>;
}
