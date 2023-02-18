import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IgxGridModule } from '../grid/grid.module';
import { IgxChildGridRowComponent, IgxHierarchicalGridComponent } from './hierarchical-grid.component';
import { IgxHierarchicalRowComponent } from './hierarchical-row.component';
import { IgxGridHierarchicalPipe, IgxGridHierarchicalPagingPipe } from './hierarchical-grid.pipes';
import { IgxRowIslandComponent } from './row-island.component';
import { IgxHierarchicalGridCellComponent } from './hierarchical-cell.component';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxHierarchicalGridModule {
}
IgxHierarchicalGridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxHierarchicalGridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridModule, declarations: [IgxHierarchicalGridComponent,
        IgxHierarchicalRowComponent,
        IgxRowIslandComponent,
        IgxChildGridRowComponent,
        IgxHierarchicalGridCellComponent,
        IgxGridHierarchicalPipe,
        IgxGridHierarchicalPagingPipe], imports: [IgxGridModule], exports: [IgxGridModule,
        IgxHierarchicalGridComponent,
        IgxHierarchicalRowComponent,
        IgxHierarchicalGridCellComponent,
        IgxRowIslandComponent,
        IgxChildGridRowComponent] });
IgxHierarchicalGridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridModule, imports: [[
            IgxGridModule,
        ], IgxGridModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxHierarchicalGridComponent,
                        IgxHierarchicalRowComponent,
                        IgxRowIslandComponent,
                        IgxChildGridRowComponent,
                        IgxHierarchicalGridCellComponent,
                        IgxGridHierarchicalPipe,
                        IgxGridHierarchicalPagingPipe
                    ],
                    exports: [
                        IgxGridModule,
                        IgxHierarchicalGridComponent,
                        IgxHierarchicalRowComponent,
                        IgxHierarchicalGridCellComponent,
                        IgxRowIslandComponent,
                        IgxChildGridRowComponent
                    ],
                    imports: [
                        IgxGridModule,
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2hpY2FsLWdyaWQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2hpZXJhcmNoaWNhbC1ncmlkL2hpZXJhcmNoaWNhbC1ncmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN2RyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7QUFFakY7O0dBRUc7QUF3QkgsTUFBTSxPQUFPLHlCQUF5Qjs7c0hBQXpCLHlCQUF5Qjt1SEFBekIseUJBQXlCLGlCQXJCOUIsNEJBQTRCO1FBQzVCLDJCQUEyQjtRQUMzQixxQkFBcUI7UUFDckIsd0JBQXdCO1FBQ3hCLGdDQUFnQztRQUNoQyx1QkFBdUI7UUFDdkIsNkJBQTZCLGFBVzdCLGFBQWEsYUFSYixhQUFhO1FBQ2IsNEJBQTRCO1FBQzVCLDJCQUEyQjtRQUMzQixnQ0FBZ0M7UUFDaEMscUJBQXFCO1FBQ3JCLHdCQUF3Qjt1SEFPbkIseUJBQXlCLFlBTHpCO1lBQ0wsYUFBYTtTQUNoQixFQVRHLGFBQWE7MkZBWVIseUJBQXlCO2tCQXZCckMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsNEJBQTRCO3dCQUM1QiwyQkFBMkI7d0JBQzNCLHFCQUFxQjt3QkFDckIsd0JBQXdCO3dCQUN4QixnQ0FBZ0M7d0JBQ2hDLHVCQUF1Qjt3QkFDdkIsNkJBQTZCO3FCQUNoQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsYUFBYTt3QkFDYiw0QkFBNEI7d0JBQzVCLDJCQUEyQjt3QkFDM0IsZ0NBQWdDO3dCQUNoQyxxQkFBcUI7d0JBQ3JCLHdCQUF3QjtxQkFDM0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLGFBQWE7cUJBQ2hCO29CQUNELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hHcmlkTW9kdWxlIH0gZnJvbSAnLi4vZ3JpZC9ncmlkLm1vZHVsZSc7XG5pbXBvcnQgeyBJZ3hDaGlsZEdyaWRSb3dDb21wb25lbnQsIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnQgfSBmcm9tICcuL2hpZXJhcmNoaWNhbC1ncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hIaWVyYXJjaGljYWxSb3dDb21wb25lbnQgfSBmcm9tICcuL2hpZXJhcmNoaWNhbC1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRIaWVyYXJjaGljYWxQaXBlLCBJZ3hHcmlkSGllcmFyY2hpY2FsUGFnaW5nUGlwZSB9IGZyb20gJy4vaGllcmFyY2hpY2FsLWdyaWQucGlwZXMnO1xuaW1wb3J0IHsgSWd4Um93SXNsYW5kQ29tcG9uZW50IH0gZnJvbSAnLi9yb3ctaXNsYW5kLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hIaWVyYXJjaGljYWxHcmlkQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vaGllcmFyY2hpY2FsLWNlbGwuY29tcG9uZW50JztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneEhpZXJhcmNoaWNhbEdyaWRDb21wb25lbnQsXG4gICAgICAgIElneEhpZXJhcmNoaWNhbFJvd0NvbXBvbmVudCxcbiAgICAgICAgSWd4Um93SXNsYW5kQ29tcG9uZW50LFxuICAgICAgICBJZ3hDaGlsZEdyaWRSb3dDb21wb25lbnQsXG4gICAgICAgIElneEhpZXJhcmNoaWNhbEdyaWRDZWxsQ29tcG9uZW50LFxuICAgICAgICBJZ3hHcmlkSGllcmFyY2hpY2FsUGlwZSxcbiAgICAgICAgSWd4R3JpZEhpZXJhcmNoaWNhbFBhZ2luZ1BpcGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4R3JpZE1vZHVsZSxcbiAgICAgICAgSWd4SGllcmFyY2hpY2FsR3JpZENvbXBvbmVudCxcbiAgICAgICAgSWd4SGllcmFyY2hpY2FsUm93Q29tcG9uZW50LFxuICAgICAgICBJZ3hIaWVyYXJjaGljYWxHcmlkQ2VsbENvbXBvbmVudCxcbiAgICAgICAgSWd4Um93SXNsYW5kQ29tcG9uZW50LFxuICAgICAgICBJZ3hDaGlsZEdyaWRSb3dDb21wb25lbnRcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgSWd4R3JpZE1vZHVsZSxcbiAgICBdLFxuICAgIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hIaWVyYXJjaGljYWxHcmlkTW9kdWxlIHtcbn1cbiJdfQ==