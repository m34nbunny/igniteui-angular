import { EventEmitter } from '@angular/core';
import { BaseToolbarDirective } from './grid-toolbar.base';
import { IgxExcelTextDirective, IgxCSVTextDirective } from './common';
import { IgxBaseExporter, IgxCsvExporterOptions, IgxCsvExporterService, IgxExcelExporterOptions, IgxExcelExporterService } from '../../services/public_api';
import { IgxToggleDirective } from '../../directives/toggle/toggle.directive';
import { GridType } from '../common/grid.interface';
import { IgxToolbarToken } from './token';
import * as i0 from "@angular/core";
export declare type IgxExporterOptions = IgxCsvExporterOptions | IgxExcelExporterOptions;
export interface IgxExporterEvent {
    exporter: IgxBaseExporter;
    options: IgxExporterOptions;
    grid: GridType;
    cancel: boolean;
}
/**
 * Provides a pre-configured exporter component for the grid.
 *
 * @remarks
 * This component still needs the actual exporter service(s) provided in the DI chain
 * in order to export something.
 *
 * @igxModule IgxGridToolbarModule
 * @igxParent IgxGridToolbarComponent
 *
 */
export declare class IgxGridToolbarExporterComponent extends BaseToolbarDirective {
    protected toolbar: IgxToolbarToken;
    private excelExporter;
    private csvExporter;
    /**
     * @hidden
     * @internal
     */
    hasExcelAttr: IgxExcelTextDirective;
    /**
     * @hidden
     * @internal
     */
    hasCSVAttr: IgxCSVTextDirective;
    /**
     * Show entry for CSV export.
     */
    exportCSV: boolean;
    /**
     * Show entry for Excel export.
     */
    exportExcel: boolean;
    /**
     * The name for the exported file.
     */
    filename: string;
    /**
     * Emitted when starting an export operation. Re-emitted additionally
     * by the grid itself.
     */
    exportStarted: EventEmitter<IgxExporterEvent>;
    /**
     * Emitted on successful ending of an export operation.
     */
    exportEnded: EventEmitter<void>;
    /**
     * Indicates whether there is an export in progress.
     */
    isExporting: boolean;
    constructor(toolbar: IgxToolbarToken, excelExporter: IgxExcelExporterService, csvExporter: IgxCsvExporterService);
    export(type: 'excel' | 'csv', toggleRef?: IgxToggleDirective): void;
    static ??fac: i0.????FactoryDeclaration<IgxGridToolbarExporterComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxGridToolbarExporterComponent, "igx-grid-toolbar-exporter", never, { "exportCSV": "exportCSV"; "exportExcel": "exportExcel"; "filename": "filename"; }, { "exportStarted": "exportStarted"; "exportEnded": "exportEnded"; }, ["hasExcelAttr", "hasCSVAttr"], ["*", "[excelText],excel-text", "[csvText],csv-text"]>;
}
