import { NgModule } from '@angular/core';
import { IgxGridSharedModules } from '../common/shared.module';
import { IgxColumnActionsModule } from '../column-actions/column-actions.module';
import { IgxGridToolbarComponent } from './grid-toolbar.component';
import { IgxGridToolbarAdvancedFilteringComponent } from './grid-toolbar-advanced-filtering.component';
import { IgxGridToolbarExporterComponent } from './grid-toolbar-exporter.component';
import { IgxGridToolbarHidingComponent } from './grid-toolbar-hiding.component';
import { IgxGridToolbarPinningComponent } from './grid-toolbar-pinning.component';
import { IgxCSVTextDirective, IgxExcelTextDirective, IgxGridToolbarActionsDirective, IgxGridToolbarDirective, IgxGridToolbarTitleDirective } from './common';
import * as i0 from "@angular/core";
export * from './grid-toolbar.component';
export * from './common';
export * from './grid-toolbar-advanced-filtering.component';
export * from './grid-toolbar-exporter.component';
export * from './grid-toolbar-hiding.component';
export * from './grid-toolbar-pinning.component';
export class IgxGridToolbarModule {
}
IgxGridToolbarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridToolbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxGridToolbarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridToolbarModule, declarations: [IgxCSVTextDirective,
        IgxExcelTextDirective,
        IgxGridToolbarActionsDirective,
        IgxGridToolbarAdvancedFilteringComponent,
        IgxGridToolbarComponent,
        IgxGridToolbarExporterComponent,
        IgxGridToolbarHidingComponent,
        IgxGridToolbarPinningComponent,
        IgxGridToolbarTitleDirective,
        IgxGridToolbarDirective], imports: [IgxColumnActionsModule,
        IgxGridSharedModules], exports: [IgxCSVTextDirective,
        IgxExcelTextDirective,
        IgxGridToolbarActionsDirective,
        IgxGridToolbarAdvancedFilteringComponent,
        IgxGridToolbarComponent,
        IgxGridToolbarExporterComponent,
        IgxGridToolbarHidingComponent,
        IgxGridToolbarPinningComponent,
        IgxGridToolbarTitleDirective,
        IgxGridToolbarDirective] });
IgxGridToolbarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridToolbarModule, imports: [[
            IgxColumnActionsModule,
            IgxGridSharedModules
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridToolbarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxCSVTextDirective,
                        IgxExcelTextDirective,
                        IgxGridToolbarActionsDirective,
                        IgxGridToolbarAdvancedFilteringComponent,
                        IgxGridToolbarComponent,
                        IgxGridToolbarExporterComponent,
                        IgxGridToolbarHidingComponent,
                        IgxGridToolbarPinningComponent,
                        IgxGridToolbarTitleDirective,
                        IgxGridToolbarDirective
                    ],
                    imports: [
                        IgxColumnActionsModule,
                        IgxGridSharedModules
                    ],
                    exports: [
                        IgxCSVTextDirective,
                        IgxExcelTextDirective,
                        IgxGridToolbarActionsDirective,
                        IgxGridToolbarAdvancedFilteringComponent,
                        IgxGridToolbarComponent,
                        IgxGridToolbarExporterComponent,
                        IgxGridToolbarHidingComponent,
                        IgxGridToolbarPinningComponent,
                        IgxGridToolbarTitleDirective,
                        IgxGridToolbarDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvdG9vbGJhci90b29sYmFyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSx3Q0FBd0MsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xGLE9BQU8sRUFDSCxtQkFBbUIsRUFDbkIscUJBQXFCLEVBQ3JCLDhCQUE4QixFQUM5Qix1QkFBdUIsRUFDdkIsNEJBQTRCLEVBQy9CLE1BQU0sVUFBVSxDQUFDOztBQUNsQixjQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGNBQWMsVUFBVSxDQUFDO0FBQ3pCLGNBQWMsNkNBQTZDLENBQUM7QUFDNUQsY0FBYyxtQ0FBbUMsQ0FBQztBQUNsRCxjQUFjLGlDQUFpQyxDQUFDO0FBQ2hELGNBQWMsa0NBQWtDLENBQUM7QUFpQ2pELE1BQU0sT0FBTyxvQkFBb0I7O2lIQUFwQixvQkFBb0I7a0hBQXBCLG9CQUFvQixpQkE1QnpCLG1CQUFtQjtRQUNuQixxQkFBcUI7UUFDckIsOEJBQThCO1FBQzlCLHdDQUF3QztRQUN4Qyx1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLDZCQUE2QjtRQUM3Qiw4QkFBOEI7UUFDOUIsNEJBQTRCO1FBQzVCLHVCQUF1QixhQUd2QixzQkFBc0I7UUFDdEIsb0JBQW9CLGFBR3BCLG1CQUFtQjtRQUNuQixxQkFBcUI7UUFDckIsOEJBQThCO1FBQzlCLHdDQUF3QztRQUN4Qyx1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLDZCQUE2QjtRQUM3Qiw4QkFBOEI7UUFDOUIsNEJBQTRCO1FBQzVCLHVCQUF1QjtrSEFHbEIsb0JBQW9CLFlBakJwQjtZQUNMLHNCQUFzQjtZQUN0QixvQkFBb0I7U0FDdkI7MkZBY1Esb0JBQW9CO2tCQTlCaEMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsbUJBQW1CO3dCQUNuQixxQkFBcUI7d0JBQ3JCLDhCQUE4Qjt3QkFDOUIsd0NBQXdDO3dCQUN4Qyx1QkFBdUI7d0JBQ3ZCLCtCQUErQjt3QkFDL0IsNkJBQTZCO3dCQUM3Qiw4QkFBOEI7d0JBQzlCLDRCQUE0Qjt3QkFDNUIsdUJBQXVCO3FCQUMxQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsc0JBQXNCO3dCQUN0QixvQkFBb0I7cUJBQ3ZCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxtQkFBbUI7d0JBQ25CLHFCQUFxQjt3QkFDckIsOEJBQThCO3dCQUM5Qix3Q0FBd0M7d0JBQ3hDLHVCQUF1Qjt3QkFDdkIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLDhCQUE4Qjt3QkFDOUIsNEJBQTRCO3dCQUM1Qix1QkFBdUI7cUJBQzFCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneEdyaWRTaGFyZWRNb2R1bGVzIH0gZnJvbSAnLi4vY29tbW9uL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgSWd4Q29sdW1uQWN0aW9uc01vZHVsZSB9IGZyb20gJy4uL2NvbHVtbi1hY3Rpb25zL2NvbHVtbi1hY3Rpb25zLm1vZHVsZSc7XG5pbXBvcnQgeyBJZ3hHcmlkVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkVG9vbGJhckFkdmFuY2VkRmlsdGVyaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLXRvb2xiYXItYWR2YW5jZWQtZmlsdGVyaW5nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkVG9vbGJhckV4cG9ydGVyQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLXRvb2xiYXItZXhwb3J0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRUb29sYmFySGlkaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLXRvb2xiYXItaGlkaW5nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkVG9vbGJhclBpbm5pbmdDb21wb25lbnQgfSBmcm9tICcuL2dyaWQtdG9vbGJhci1waW5uaW5nLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICAgIElneENTVlRleHREaXJlY3RpdmUsXG4gICAgSWd4RXhjZWxUZXh0RGlyZWN0aXZlLFxuICAgIElneEdyaWRUb29sYmFyQWN0aW9uc0RpcmVjdGl2ZSxcbiAgICBJZ3hHcmlkVG9vbGJhckRpcmVjdGl2ZSxcbiAgICBJZ3hHcmlkVG9vbGJhclRpdGxlRGlyZWN0aXZlXG59IGZyb20gJy4vY29tbW9uJztcbmV4cG9ydCAqIGZyb20gJy4vZ3JpZC10b29sYmFyLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2NvbW1vbic7XG5leHBvcnQgKiBmcm9tICcuL2dyaWQtdG9vbGJhci1hZHZhbmNlZC1maWx0ZXJpbmcuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vZ3JpZC10b29sYmFyLWV4cG9ydGVyLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2dyaWQtdG9vbGJhci1oaWRpbmcuY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vZ3JpZC10b29sYmFyLXBpbm5pbmcuY29tcG9uZW50JztcblxuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBJZ3hDU1ZUZXh0RGlyZWN0aXZlLFxuICAgICAgICBJZ3hFeGNlbFRleHREaXJlY3RpdmUsXG4gICAgICAgIElneEdyaWRUb29sYmFyQWN0aW9uc0RpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJBZHZhbmNlZEZpbHRlcmluZ0NvbXBvbmVudCxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJDb21wb25lbnQsXG4gICAgICAgIElneEdyaWRUb29sYmFyRXhwb3J0ZXJDb21wb25lbnQsXG4gICAgICAgIElneEdyaWRUb29sYmFySGlkaW5nQ29tcG9uZW50LFxuICAgICAgICBJZ3hHcmlkVG9vbGJhclBpbm5pbmdDb21wb25lbnQsXG4gICAgICAgIElneEdyaWRUb29sYmFyVGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneEdyaWRUb29sYmFyRGlyZWN0aXZlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIElneENvbHVtbkFjdGlvbnNNb2R1bGUsXG4gICAgICAgIElneEdyaWRTaGFyZWRNb2R1bGVzXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIElneENTVlRleHREaXJlY3RpdmUsXG4gICAgICAgIElneEV4Y2VsVGV4dERpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJBY3Rpb25zRGlyZWN0aXZlLFxuICAgICAgICBJZ3hHcmlkVG9vbGJhckFkdmFuY2VkRmlsdGVyaW5nQ29tcG9uZW50LFxuICAgICAgICBJZ3hHcmlkVG9vbGJhckNvbXBvbmVudCxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJFeHBvcnRlckNvbXBvbmVudCxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJIaWRpbmdDb21wb25lbnQsXG4gICAgICAgIElneEdyaWRUb29sYmFyUGlubmluZ0NvbXBvbmVudCxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJUaXRsZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZFRvb2xiYXJEaXJlY3RpdmVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneEdyaWRUb29sYmFyTW9kdWxlIHsgfVxuIl19