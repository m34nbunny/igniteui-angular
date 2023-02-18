import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { IgxAccordionModule } from '../../accordion/accordion.module';
import { IgxDragDropModule } from "../../directives/drag-drop/drag-drop.directive";
import { IgxExpansionPanelModule } from "../../expansion-panel/expansion-panel.module";
import { IgxGridComponent } from "../grid/grid.component";
import { IgxGridModule } from "../grid/grid.module";
import { IgxListModule } from '../../list/list.component';
import { IgxPivotDataSelectorComponent } from "./pivot-data-selector.component";
import { IgxPivotGridComponent } from "./pivot-grid.component";
import { IgxFilterPivotItemsPipe, IgxPivotAutoTransform, IgxPivotCellMergingPipe, IgxPivotColumnPipe, IgxPivotGridColumnSortingPipe, IgxPivotGridFilterPipe, IgxPivotGridSortingPipe, IgxPivotRowExpansionPipe, IgxPivotRowPipe } from "./pivot-grid.pipes";
import { IgxPivotHeaderRowComponent } from "./pivot-header-row.component";
import { IgxPivotRowDimensionContentComponent } from "./pivot-row-dimension-content.component";
import { IgxPivotRowDimensionHeaderGroupComponent } from "./pivot-row-dimension-header-group.component";
import { IgxPivotRowDimensionHeaderComponent } from "./pivot-row-dimension-header.component";
import { IgxPivotRowComponent } from "./pivot-row.component";
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxPivotGridModule {
}
IgxPivotGridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxPivotGridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridModule, declarations: [IgxPivotGridComponent,
        IgxPivotRowComponent,
        IgxPivotHeaderRowComponent,
        IgxPivotRowDimensionContentComponent,
        IgxPivotRowDimensionHeaderComponent,
        IgxPivotRowDimensionHeaderGroupComponent,
        IgxPivotRowPipe,
        IgxPivotRowExpansionPipe,
        IgxPivotAutoTransform,
        IgxPivotColumnPipe,
        IgxPivotGridFilterPipe,
        IgxPivotGridSortingPipe,
        IgxPivotGridColumnSortingPipe,
        IgxPivotCellMergingPipe,
        IgxFilterPivotItemsPipe,
        IgxPivotDataSelectorComponent], imports: [IgxGridModule, IgxExpansionPanelModule, IgxDragDropModule, IgxListModule, IgxAccordionModule], exports: [IgxGridModule,
        IgxPivotGridComponent,
        IgxPivotRowComponent,
        IgxPivotHeaderRowComponent,
        IgxPivotRowDimensionContentComponent,
        IgxPivotRowDimensionHeaderComponent,
        IgxPivotRowDimensionHeaderGroupComponent,
        IgxPivotRowExpansionPipe,
        IgxPivotAutoTransform,
        IgxPivotRowPipe,
        IgxPivotColumnPipe,
        IgxPivotGridFilterPipe,
        IgxPivotGridSortingPipe,
        IgxPivotGridColumnSortingPipe,
        IgxPivotCellMergingPipe,
        IgxFilterPivotItemsPipe,
        IgxPivotDataSelectorComponent] });
IgxPivotGridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridModule, imports: [[IgxGridModule, IgxExpansionPanelModule, IgxDragDropModule, IgxListModule, IgxAccordionModule], IgxGridModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxPivotGridComponent,
                        IgxPivotRowComponent,
                        IgxPivotHeaderRowComponent,
                        IgxPivotRowDimensionContentComponent,
                        IgxPivotRowDimensionHeaderComponent,
                        IgxPivotRowDimensionHeaderGroupComponent,
                        IgxPivotRowPipe,
                        IgxPivotRowExpansionPipe,
                        IgxPivotAutoTransform,
                        IgxPivotColumnPipe,
                        IgxPivotGridFilterPipe,
                        IgxPivotGridSortingPipe,
                        IgxPivotGridColumnSortingPipe,
                        IgxPivotCellMergingPipe,
                        IgxFilterPivotItemsPipe,
                        IgxPivotDataSelectorComponent,
                    ],
                    exports: [
                        IgxGridModule,
                        IgxPivotGridComponent,
                        IgxPivotRowComponent,
                        IgxPivotHeaderRowComponent,
                        IgxPivotRowDimensionContentComponent,
                        IgxPivotRowDimensionHeaderComponent,
                        IgxPivotRowDimensionHeaderGroupComponent,
                        IgxPivotRowExpansionPipe,
                        IgxPivotAutoTransform,
                        IgxPivotRowPipe,
                        IgxPivotColumnPipe,
                        IgxPivotGridFilterPipe,
                        IgxPivotGridSortingPipe,
                        IgxPivotGridColumnSortingPipe,
                        IgxPivotCellMergingPipe,
                        IgxFilterPivotItemsPipe,
                        IgxPivotDataSelectorComponent,
                    ],
                    imports: [IgxGridModule, IgxExpansionPanelModule, IgxDragDropModule, IgxListModule, IgxAccordionModule],
                    entryComponents: [IgxGridComponent],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3QtZ3JpZC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvcGl2b3QtZ3JpZC9waXZvdC1ncmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ25GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUNILHVCQUF1QixFQUN2QixxQkFBcUIsRUFDckIsdUJBQXVCLEVBQ3ZCLGtCQUFrQixFQUNsQiw2QkFBNkIsRUFDN0Isc0JBQXNCLEVBQ3RCLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsZUFBZSxFQUNsQixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzFFLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQy9GLE9BQU8sRUFBRSx3Q0FBd0MsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3hHLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzdGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztBQUU3RDs7R0FFRztBQTJDSCxNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBeEN2QixxQkFBcUI7UUFDckIsb0JBQW9CO1FBQ3BCLDBCQUEwQjtRQUMxQixvQ0FBb0M7UUFDcEMsbUNBQW1DO1FBQ25DLHdDQUF3QztRQUN4QyxlQUFlO1FBQ2Ysd0JBQXdCO1FBQ3hCLHFCQUFxQjtRQUNyQixrQkFBa0I7UUFDbEIsc0JBQXNCO1FBQ3RCLHVCQUF1QjtRQUN2Qiw2QkFBNkI7UUFDN0IsdUJBQXVCO1FBQ3ZCLHVCQUF1QjtRQUN2Qiw2QkFBNkIsYUFxQnZCLGFBQWEsRUFBRSx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLGFBbEJsRyxhQUFhO1FBQ2IscUJBQXFCO1FBQ3JCLG9CQUFvQjtRQUNwQiwwQkFBMEI7UUFDMUIsb0NBQW9DO1FBQ3BDLG1DQUFtQztRQUNuQyx3Q0FBd0M7UUFDeEMsd0JBQXdCO1FBQ3hCLHFCQUFxQjtRQUNyQixlQUFlO1FBQ2Ysa0JBQWtCO1FBQ2xCLHNCQUFzQjtRQUN0Qix1QkFBdUI7UUFDdkIsNkJBQTZCO1FBQzdCLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsNkJBQTZCO2dIQU14QixrQkFBa0IsWUFKbEIsQ0FBQyxhQUFhLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixDQUFDLEVBbEJuRyxhQUFhOzJGQXNCUixrQkFBa0I7a0JBMUM5QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixxQkFBcUI7d0JBQ3JCLG9CQUFvQjt3QkFDcEIsMEJBQTBCO3dCQUMxQixvQ0FBb0M7d0JBQ3BDLG1DQUFtQzt3QkFDbkMsd0NBQXdDO3dCQUN4QyxlQUFlO3dCQUNmLHdCQUF3Qjt3QkFDeEIscUJBQXFCO3dCQUNyQixrQkFBa0I7d0JBQ2xCLHNCQUFzQjt3QkFDdEIsdUJBQXVCO3dCQUN2Qiw2QkFBNkI7d0JBQzdCLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qiw2QkFBNkI7cUJBQ2hDO29CQUNELE9BQU8sRUFBRTt3QkFDTCxhQUFhO3dCQUNiLHFCQUFxQjt3QkFDckIsb0JBQW9CO3dCQUNwQiwwQkFBMEI7d0JBQzFCLG9DQUFvQzt3QkFDcEMsbUNBQW1DO3dCQUNuQyx3Q0FBd0M7d0JBQ3hDLHdCQUF3Qjt3QkFDeEIscUJBQXFCO3dCQUNyQixlQUFlO3dCQUNmLGtCQUFrQjt3QkFDbEIsc0JBQXNCO3dCQUN0Qix1QkFBdUI7d0JBQ3ZCLDZCQUE2Qjt3QkFDN0IsdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLDZCQUE2QjtxQkFDaEM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQztvQkFDdkcsZUFBZSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQ25DLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IElneEFjY29yZGlvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2FjY29yZGlvbi9hY2NvcmRpb24ubW9kdWxlJztcbmltcG9ydCB7IElneERyYWdEcm9wTW9kdWxlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvZHJhZy1kcm9wL2RyYWctZHJvcC5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsTW9kdWxlIH0gZnJvbSBcIi4uLy4uL2V4cGFuc2lvbi1wYW5lbC9leHBhbnNpb24tcGFuZWwubW9kdWxlXCI7XG5pbXBvcnQgeyBJZ3hHcmlkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2dyaWQvZ3JpZC5jb21wb25lbnRcIjtcbmltcG9ydCB7IElneEdyaWRNb2R1bGUgfSBmcm9tIFwiLi4vZ3JpZC9ncmlkLm1vZHVsZVwiO1xuaW1wb3J0IHsgSWd4TGlzdE1vZHVsZSB9IGZyb20gJy4uLy4uL2xpc3QvbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4UGl2b3REYXRhU2VsZWN0b3JDb21wb25lbnQgfSBmcm9tIFwiLi9waXZvdC1kYXRhLXNlbGVjdG9yLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSWd4UGl2b3RHcmlkQ29tcG9uZW50IH0gZnJvbSBcIi4vcGl2b3QtZ3JpZC5jb21wb25lbnRcIjtcbmltcG9ydCB7XG4gICAgSWd4RmlsdGVyUGl2b3RJdGVtc1BpcGUsXG4gICAgSWd4UGl2b3RBdXRvVHJhbnNmb3JtLFxuICAgIElneFBpdm90Q2VsbE1lcmdpbmdQaXBlLFxuICAgIElneFBpdm90Q29sdW1uUGlwZSxcbiAgICBJZ3hQaXZvdEdyaWRDb2x1bW5Tb3J0aW5nUGlwZSxcbiAgICBJZ3hQaXZvdEdyaWRGaWx0ZXJQaXBlLFxuICAgIElneFBpdm90R3JpZFNvcnRpbmdQaXBlLFxuICAgIElneFBpdm90Um93RXhwYW5zaW9uUGlwZSxcbiAgICBJZ3hQaXZvdFJvd1BpcGVcbn0gZnJvbSBcIi4vcGl2b3QtZ3JpZC5waXBlc1wiO1xuaW1wb3J0IHsgSWd4UGl2b3RIZWFkZXJSb3dDb21wb25lbnQgfSBmcm9tIFwiLi9waXZvdC1oZWFkZXItcm93LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSWd4UGl2b3RSb3dEaW1lbnNpb25Db250ZW50Q29tcG9uZW50IH0gZnJvbSBcIi4vcGl2b3Qtcm93LWRpbWVuc2lvbi1jb250ZW50LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSWd4UGl2b3RSb3dEaW1lbnNpb25IZWFkZXJHcm91cENvbXBvbmVudCB9IGZyb20gXCIuL3Bpdm90LXJvdy1kaW1lbnNpb24taGVhZGVyLWdyb3VwLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSWd4UGl2b3RSb3dEaW1lbnNpb25IZWFkZXJDb21wb25lbnQgfSBmcm9tIFwiLi9waXZvdC1yb3ctZGltZW5zaW9uLWhlYWRlci5jb21wb25lbnRcIjtcbmltcG9ydCB7IElneFBpdm90Um93Q29tcG9uZW50IH0gZnJvbSBcIi4vcGl2b3Qtcm93LmNvbXBvbmVudFwiO1xuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4UGl2b3RHcmlkQ29tcG9uZW50LFxuICAgICAgICBJZ3hQaXZvdFJvd0NvbXBvbmVudCxcbiAgICAgICAgSWd4UGl2b3RIZWFkZXJSb3dDb21wb25lbnQsXG4gICAgICAgIElneFBpdm90Um93RGltZW5zaW9uQ29udGVudENvbXBvbmVudCxcbiAgICAgICAgSWd4UGl2b3RSb3dEaW1lbnNpb25IZWFkZXJDb21wb25lbnQsXG4gICAgICAgIElneFBpdm90Um93RGltZW5zaW9uSGVhZGVyR3JvdXBDb21wb25lbnQsXG4gICAgICAgIElneFBpdm90Um93UGlwZSxcbiAgICAgICAgSWd4UGl2b3RSb3dFeHBhbnNpb25QaXBlLFxuICAgICAgICBJZ3hQaXZvdEF1dG9UcmFuc2Zvcm0sXG4gICAgICAgIElneFBpdm90Q29sdW1uUGlwZSxcbiAgICAgICAgSWd4UGl2b3RHcmlkRmlsdGVyUGlwZSxcbiAgICAgICAgSWd4UGl2b3RHcmlkU29ydGluZ1BpcGUsXG4gICAgICAgIElneFBpdm90R3JpZENvbHVtblNvcnRpbmdQaXBlLFxuICAgICAgICBJZ3hQaXZvdENlbGxNZXJnaW5nUGlwZSxcbiAgICAgICAgSWd4RmlsdGVyUGl2b3RJdGVtc1BpcGUsXG4gICAgICAgIElneFBpdm90RGF0YVNlbGVjdG9yQ29tcG9uZW50LFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hHcmlkTW9kdWxlLFxuICAgICAgICBJZ3hQaXZvdEdyaWRDb21wb25lbnQsXG4gICAgICAgIElneFBpdm90Um93Q29tcG9uZW50LFxuICAgICAgICBJZ3hQaXZvdEhlYWRlclJvd0NvbXBvbmVudCxcbiAgICAgICAgSWd4UGl2b3RSb3dEaW1lbnNpb25Db250ZW50Q29tcG9uZW50LFxuICAgICAgICBJZ3hQaXZvdFJvd0RpbWVuc2lvbkhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgSWd4UGl2b3RSb3dEaW1lbnNpb25IZWFkZXJHcm91cENvbXBvbmVudCxcbiAgICAgICAgSWd4UGl2b3RSb3dFeHBhbnNpb25QaXBlLFxuICAgICAgICBJZ3hQaXZvdEF1dG9UcmFuc2Zvcm0sXG4gICAgICAgIElneFBpdm90Um93UGlwZSxcbiAgICAgICAgSWd4UGl2b3RDb2x1bW5QaXBlLFxuICAgICAgICBJZ3hQaXZvdEdyaWRGaWx0ZXJQaXBlLFxuICAgICAgICBJZ3hQaXZvdEdyaWRTb3J0aW5nUGlwZSxcbiAgICAgICAgSWd4UGl2b3RHcmlkQ29sdW1uU29ydGluZ1BpcGUsXG4gICAgICAgIElneFBpdm90Q2VsbE1lcmdpbmdQaXBlLFxuICAgICAgICBJZ3hGaWx0ZXJQaXZvdEl0ZW1zUGlwZSxcbiAgICAgICAgSWd4UGl2b3REYXRhU2VsZWN0b3JDb21wb25lbnQsXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbSWd4R3JpZE1vZHVsZSwgSWd4RXhwYW5zaW9uUGFuZWxNb2R1bGUsIElneERyYWdEcm9wTW9kdWxlLCBJZ3hMaXN0TW9kdWxlLCBJZ3hBY2NvcmRpb25Nb2R1bGVdLFxuICAgIGVudHJ5Q29tcG9uZW50czogW0lneEdyaWRDb21wb25lbnRdLFxuICAgIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RHcmlkTW9kdWxlIHt9XG4iXX0=