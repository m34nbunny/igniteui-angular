import { NgModule } from '@angular/core';
import { IgxGridSharedModules } from '../common/shared.module';
import { IgxColumnHidingDirective } from './column-hiding.directive';
import { IgxColumnPinningDirective } from './column-pinning.directive';
import { IgxColumnActionEnabledPipe, IgxColumnActionsComponent, IgxFilterActionColumnsPipe, IgxSortActionColumnsPipe } from './column-actions.component';
import { IgxGridPipesModule } from '../common/grid-pipes.module';
import * as i0 from "@angular/core";
export * from './column-actions.component';
export * from './column-hiding.directive';
export * from './column-pinning.directive';
export class IgxColumnActionsModule {
}
IgxColumnActionsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnActionsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxColumnActionsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnActionsModule, declarations: [IgxColumnHidingDirective,
        IgxColumnPinningDirective,
        IgxColumnActionsComponent,
        IgxColumnActionEnabledPipe,
        IgxFilterActionColumnsPipe,
        IgxSortActionColumnsPipe], imports: [IgxGridSharedModules,
        IgxGridPipesModule], exports: [IgxColumnHidingDirective,
        IgxColumnPinningDirective,
        IgxColumnActionsComponent,
        IgxColumnActionEnabledPipe,
        IgxFilterActionColumnsPipe,
        IgxSortActionColumnsPipe] });
IgxColumnActionsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnActionsModule, imports: [[
            IgxGridSharedModules,
            IgxGridPipesModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnActionsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxColumnHidingDirective,
                        IgxColumnPinningDirective,
                        IgxColumnActionsComponent,
                        IgxColumnActionEnabledPipe,
                        IgxFilterActionColumnsPipe,
                        IgxSortActionColumnsPipe
                    ],
                    imports: [
                        IgxGridSharedModules,
                        IgxGridPipesModule
                    ],
                    exports: [
                        IgxColumnHidingDirective,
                        IgxColumnPinningDirective,
                        IgxColumnActionsComponent,
                        IgxColumnActionEnabledPipe,
                        IgxFilterActionColumnsPipe,
                        IgxSortActionColumnsPipe
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLWFjdGlvbnMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2NvbHVtbi1hY3Rpb25zL2NvbHVtbi1hY3Rpb25zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZFLE9BQU8sRUFDSCwwQkFBMEIsRUFDMUIseUJBQXlCLEVBQ3pCLDBCQUEwQixFQUMxQix3QkFBd0IsRUFDM0IsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFDakUsY0FBYyw0QkFBNEIsQ0FBQztBQUMzQyxjQUFjLDJCQUEyQixDQUFDO0FBQzFDLGNBQWMsNEJBQTRCLENBQUM7QUF3QjNDLE1BQU0sT0FBTyxzQkFBc0I7O21IQUF0QixzQkFBc0I7b0hBQXRCLHNCQUFzQixpQkFwQjNCLHdCQUF3QjtRQUN4Qix5QkFBeUI7UUFDekIseUJBQXlCO1FBQ3pCLDBCQUEwQjtRQUMxQiwwQkFBMEI7UUFDMUIsd0JBQXdCLGFBR3hCLG9CQUFvQjtRQUNwQixrQkFBa0IsYUFHbEIsd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6Qix5QkFBeUI7UUFDekIsMEJBQTBCO1FBQzFCLDBCQUEwQjtRQUMxQix3QkFBd0I7b0hBR25CLHNCQUFzQixZQWJ0QjtZQUNMLG9CQUFvQjtZQUNwQixrQkFBa0I7U0FDckI7MkZBVVEsc0JBQXNCO2tCQXRCbEMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysd0JBQXdCO3dCQUN4Qix5QkFBeUI7d0JBQ3pCLHlCQUF5Qjt3QkFDekIsMEJBQTBCO3dCQUMxQiwwQkFBMEI7d0JBQzFCLHdCQUF3QjtxQkFDM0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3FCQUNyQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsd0JBQXdCO3dCQUN4Qix5QkFBeUI7d0JBQ3pCLHlCQUF5Qjt3QkFDekIsMEJBQTBCO3dCQUMxQiwwQkFBMEI7d0JBQzFCLHdCQUF3QjtxQkFDM0I7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4R3JpZFNoYXJlZE1vZHVsZXMgfSBmcm9tICcuLi9jb21tb24vc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5IaWRpbmdEaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbi1oaWRpbmcuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneENvbHVtblBpbm5pbmdEaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbi1waW5uaW5nLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1xuICAgIElneENvbHVtbkFjdGlvbkVuYWJsZWRQaXBlLFxuICAgIElneENvbHVtbkFjdGlvbnNDb21wb25lbnQsXG4gICAgSWd4RmlsdGVyQWN0aW9uQ29sdW1uc1BpcGUsXG4gICAgSWd4U29ydEFjdGlvbkNvbHVtbnNQaXBlXG59IGZyb20gJy4vY29sdW1uLWFjdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRQaXBlc01vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLXBpcGVzLm1vZHVsZSc7XG5leHBvcnQgKiBmcm9tICcuL2NvbHVtbi1hY3Rpb25zLmNvbXBvbmVudCc7XG5leHBvcnQgKiBmcm9tICcuL2NvbHVtbi1oaWRpbmcuZGlyZWN0aXZlJztcbmV4cG9ydCAqIGZyb20gJy4vY29sdW1uLXBpbm5pbmcuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4Q29sdW1uSGlkaW5nRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb2x1bW5QaW5uaW5nRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDb2x1bW5BY3Rpb25zQ29tcG9uZW50LFxuICAgICAgICBJZ3hDb2x1bW5BY3Rpb25FbmFibGVkUGlwZSxcbiAgICAgICAgSWd4RmlsdGVyQWN0aW9uQ29sdW1uc1BpcGUsXG4gICAgICAgIElneFNvcnRBY3Rpb25Db2x1bW5zUGlwZVxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBJZ3hHcmlkU2hhcmVkTW9kdWxlcyxcbiAgICAgICAgSWd4R3JpZFBpcGVzTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIElneENvbHVtbkhpZGluZ0RpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29sdW1uUGlubmluZ0RpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29sdW1uQWN0aW9uc0NvbXBvbmVudCxcbiAgICAgICAgSWd4Q29sdW1uQWN0aW9uRW5hYmxlZFBpcGUsXG4gICAgICAgIElneEZpbHRlckFjdGlvbkNvbHVtbnNQaXBlLFxuICAgICAgICBJZ3hTb3J0QWN0aW9uQ29sdW1uc1BpcGVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneENvbHVtbkFjdGlvbnNNb2R1bGUgeyB9XG4iXX0=