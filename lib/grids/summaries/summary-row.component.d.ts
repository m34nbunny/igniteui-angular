import { QueryList, ElementRef, ChangeDetectorRef, DoCheck } from '@angular/core';
import { IgxSummaryResult } from './grid-summary';
import { IgxSummaryCellComponent } from './summary-cell.component';
import { IgxGridForOfDirective } from '../../directives/for-of/for_of.directive';
import { ColumnType, GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
export declare class IgxSummaryRowComponent implements DoCheck {
    grid: GridType;
    element: ElementRef<HTMLElement>;
    cdr: ChangeDetectorRef;
    summaries: Map<string, IgxSummaryResult[]>;
    gridID: any;
    index: number;
    firstCellIndentation: number;
    get dataRowIndex(): number;
    get minHeight(): number;
    _summaryCells: QueryList<IgxSummaryCellComponent>;
    get summaryCells(): QueryList<IgxSummaryCellComponent>;
    set summaryCells(cells: QueryList<IgxSummaryCellComponent>);
    /**
     * @hidden
     */
    virtDirRow: IgxGridForOfDirective<any>;
    constructor(grid: GridType, element: ElementRef<HTMLElement>, cdr: ChangeDetectorRef);
    ngDoCheck(): void;
    get nativeElement(): HTMLElement;
    getColumnSummaries(columnName: string): IgxSummaryResult[];
    /**
     * @hidden
     * @internal
     */
    isCellActive(visibleColumnIndex: any): boolean;
    /**
     * @hidden
     */
    get pinnedColumns(): ColumnType[];
    /**
     * @hidden
     */
    get unpinnedColumns(): ColumnType[];
    getContext(row: any): {
        $implicit: any;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSummaryRowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxSummaryRowComponent, "igx-grid-summary-row", never, { "summaries": "summaries"; "gridID": "gridID"; "index": "index"; "firstCellIndentation": "firstCellIndentation"; }, {}, never, never>;
}
