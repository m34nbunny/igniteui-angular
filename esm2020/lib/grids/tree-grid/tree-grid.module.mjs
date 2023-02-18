import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';
import { IgxGridCommonModule } from '../grid-common.module';
import { IgxTreeGridHierarchizingPipe, IgxTreeGridNormalizeRecordsPipe, IgxTreeGridAddRowPipe } from './tree-grid.pipes';
import { IgxTreeGridFlatteningPipe, IgxTreeGridSortingPipe, IgxTreeGridPagingPipe, IgxTreeGridTransactionPipe } from './tree-grid.pipes';
import { IgxTreeGridCellComponent } from './tree-cell.component';
import { IgxTreeGridFilteringPipe } from './tree-grid.filtering.pipe';
import { IgxTreeGridSummaryPipe } from './tree-grid.summary.pipe';
import { IgxRowLoadingIndicatorTemplateDirective } from './tree-grid.directives';
import { IgxTreeGridGroupingPipe } from './tree-grid.grouping.pipe';
import { IgxTreeGridGroupByAreaComponent } from '../grouping/tree-grid-group-by-area.component';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxTreeGridModule {
}
IgxTreeGridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxTreeGridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridModule, declarations: [IgxTreeGridComponent,
        IgxTreeGridRowComponent,
        IgxTreeGridCellComponent,
        IgxTreeGridHierarchizingPipe,
        IgxTreeGridFlatteningPipe,
        IgxTreeGridSortingPipe,
        IgxTreeGridFilteringPipe,
        IgxTreeGridPagingPipe,
        IgxTreeGridTransactionPipe,
        IgxTreeGridSummaryPipe,
        IgxRowLoadingIndicatorTemplateDirective,
        IgxTreeGridNormalizeRecordsPipe,
        IgxTreeGridGroupingPipe,
        IgxTreeGridGroupByAreaComponent,
        IgxTreeGridAddRowPipe], imports: [IgxGridCommonModule], exports: [IgxTreeGridComponent,
        IgxTreeGridRowComponent,
        IgxTreeGridCellComponent,
        IgxRowLoadingIndicatorTemplateDirective,
        IgxGridCommonModule,
        IgxTreeGridGroupingPipe,
        IgxTreeGridGroupByAreaComponent,
        IgxTreeGridAddRowPipe] });
IgxTreeGridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridModule, imports: [[
            IgxGridCommonModule
        ], IgxGridCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxTreeGridComponent,
                        IgxTreeGridRowComponent,
                        IgxTreeGridCellComponent,
                        IgxTreeGridHierarchizingPipe,
                        IgxTreeGridFlatteningPipe,
                        IgxTreeGridSortingPipe,
                        IgxTreeGridFilteringPipe,
                        IgxTreeGridPagingPipe,
                        IgxTreeGridTransactionPipe,
                        IgxTreeGridSummaryPipe,
                        IgxRowLoadingIndicatorTemplateDirective,
                        IgxTreeGridNormalizeRecordsPipe,
                        IgxTreeGridGroupingPipe,
                        IgxTreeGridGroupByAreaComponent,
                        IgxTreeGridAddRowPipe
                    ],
                    exports: [
                        IgxTreeGridComponent,
                        IgxTreeGridRowComponent,
                        IgxTreeGridCellComponent,
                        IgxRowLoadingIndicatorTemplateDirective,
                        IgxGridCommonModule,
                        IgxTreeGridGroupingPipe,
                        IgxTreeGridGroupByAreaComponent,
                        IgxTreeGridAddRowPipe
                    ],
                    imports: [
                        IgxGridCommonModule
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ncmlkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy90cmVlLWdyaWQvdHJlZS1ncmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSwrQkFBK0IsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pILE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxzQkFBc0IsRUFBRSxxQkFBcUIsRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pJLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtDQUErQyxDQUFDOztBQUNoRzs7R0FFRztBQWtDSCxNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBL0IxQixvQkFBb0I7UUFDcEIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4Qiw0QkFBNEI7UUFDNUIseUJBQXlCO1FBQ3pCLHNCQUFzQjtRQUN0Qix3QkFBd0I7UUFDeEIscUJBQXFCO1FBQ3JCLDBCQUEwQjtRQUMxQixzQkFBc0I7UUFDdEIsdUNBQXVDO1FBQ3ZDLCtCQUErQjtRQUMvQix1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLHFCQUFxQixhQWFyQixtQkFBbUIsYUFWbkIsb0JBQW9CO1FBQ3BCLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIsdUNBQXVDO1FBQ3ZDLG1CQUFtQjtRQUNuQix1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLHFCQUFxQjsrR0FPWixpQkFBaUIsWUFMbkI7WUFDUCxtQkFBbUI7U0FDcEIsRUFQQyxtQkFBbUI7MkZBVVYsaUJBQWlCO2tCQWpDN0IsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIsNEJBQTRCO3dCQUM1Qix5QkFBeUI7d0JBQ3pCLHNCQUFzQjt3QkFDdEIsd0JBQXdCO3dCQUN4QixxQkFBcUI7d0JBQ3JCLDBCQUEwQjt3QkFDMUIsc0JBQXNCO3dCQUN0Qix1Q0FBdUM7d0JBQ3ZDLCtCQUErQjt3QkFDL0IsdUJBQXVCO3dCQUN2QiwrQkFBK0I7d0JBQy9CLHFCQUFxQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLG9CQUFvQjt3QkFDcEIsdUJBQXVCO3dCQUN2Qix3QkFBd0I7d0JBQ3hCLHVDQUF1Qzt3QkFDdkMsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLCtCQUErQjt3QkFDL0IscUJBQXFCO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsbUJBQW1CO3FCQUNwQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4VHJlZUdyaWRDb21wb25lbnQgfSBmcm9tICcuL3RyZWUtZ3JpZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4VHJlZUdyaWRSb3dDb21wb25lbnQgfSBmcm9tICcuL3RyZWUtZ3JpZC1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRDb21tb25Nb2R1bGUgfSBmcm9tICcuLi9ncmlkLWNvbW1vbi5tb2R1bGUnO1xuaW1wb3J0IHsgSWd4VHJlZUdyaWRIaWVyYXJjaGl6aW5nUGlwZSwgSWd4VHJlZUdyaWROb3JtYWxpemVSZWNvcmRzUGlwZSwgSWd4VHJlZUdyaWRBZGRSb3dQaXBlIH0gZnJvbSAnLi90cmVlLWdyaWQucGlwZXMnO1xuaW1wb3J0IHsgSWd4VHJlZUdyaWRGbGF0dGVuaW5nUGlwZSwgSWd4VHJlZUdyaWRTb3J0aW5nUGlwZSwgSWd4VHJlZUdyaWRQYWdpbmdQaXBlLCBJZ3hUcmVlR3JpZFRyYW5zYWN0aW9uUGlwZSB9IGZyb20gJy4vdHJlZS1ncmlkLnBpcGVzJztcbmltcG9ydCB7IElneFRyZWVHcmlkQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vdHJlZS1jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hUcmVlR3JpZEZpbHRlcmluZ1BpcGUgfSBmcm9tICcuL3RyZWUtZ3JpZC5maWx0ZXJpbmcucGlwZSc7XG5pbXBvcnQgeyBJZ3hUcmVlR3JpZFN1bW1hcnlQaXBlIH0gZnJvbSAnLi90cmVlLWdyaWQuc3VtbWFyeS5waXBlJztcbmltcG9ydCB7IElneFJvd0xvYWRpbmdJbmRpY2F0b3JUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gJy4vdHJlZS1ncmlkLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgSWd4VHJlZUdyaWRHcm91cGluZ1BpcGUgfSBmcm9tICcuL3RyZWUtZ3JpZC5ncm91cGluZy5waXBlJztcbmltcG9ydCB7IElneFRyZWVHcmlkR3JvdXBCeUFyZWFDb21wb25lbnQgfSBmcm9tICcuLi9ncm91cGluZy90cmVlLWdyaWQtZ3JvdXAtYnktYXJlYS5jb21wb25lbnQnO1xuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIElneFRyZWVHcmlkQ29tcG9uZW50LFxuICAgIElneFRyZWVHcmlkUm93Q29tcG9uZW50LFxuICAgIElneFRyZWVHcmlkQ2VsbENvbXBvbmVudCxcbiAgICBJZ3hUcmVlR3JpZEhpZXJhcmNoaXppbmdQaXBlLFxuICAgIElneFRyZWVHcmlkRmxhdHRlbmluZ1BpcGUsXG4gICAgSWd4VHJlZUdyaWRTb3J0aW5nUGlwZSxcbiAgICBJZ3hUcmVlR3JpZEZpbHRlcmluZ1BpcGUsXG4gICAgSWd4VHJlZUdyaWRQYWdpbmdQaXBlLFxuICAgIElneFRyZWVHcmlkVHJhbnNhY3Rpb25QaXBlLFxuICAgIElneFRyZWVHcmlkU3VtbWFyeVBpcGUsXG4gICAgSWd4Um93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIElneFRyZWVHcmlkTm9ybWFsaXplUmVjb3Jkc1BpcGUsXG4gICAgSWd4VHJlZUdyaWRHcm91cGluZ1BpcGUsXG4gICAgSWd4VHJlZUdyaWRHcm91cEJ5QXJlYUNvbXBvbmVudCxcbiAgICBJZ3hUcmVlR3JpZEFkZFJvd1BpcGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIElneFRyZWVHcmlkQ29tcG9uZW50LFxuICAgIElneFRyZWVHcmlkUm93Q29tcG9uZW50LFxuICAgIElneFRyZWVHcmlkQ2VsbENvbXBvbmVudCxcbiAgICBJZ3hSb3dMb2FkaW5nSW5kaWNhdG9yVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgSWd4R3JpZENvbW1vbk1vZHVsZSxcbiAgICBJZ3hUcmVlR3JpZEdyb3VwaW5nUGlwZSxcbiAgICBJZ3hUcmVlR3JpZEdyb3VwQnlBcmVhQ29tcG9uZW50LFxuICAgIElneFRyZWVHcmlkQWRkUm93UGlwZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgSWd4R3JpZENvbW1vbk1vZHVsZVxuICBdLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUdyaWRNb2R1bGUge1xufVxuIl19