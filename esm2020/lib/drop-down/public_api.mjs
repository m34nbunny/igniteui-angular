import { NgModule } from '@angular/core';
import { IgxDropDownComponent } from './drop-down.component';
import { IgxDropDownItemComponent } from './drop-down-item.component';
import { IgxDropDownItemNavigationDirective } from './drop-down-navigation.directive';
import { CommonModule } from '@angular/common';
import { IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxDropDownGroupComponent } from './drop-down-group.component';
import { IgxDropDownItemBaseDirective } from './drop-down-item.base';
import * as i0 from "@angular/core";
export * from './drop-down.component';
export * from './drop-down-item.component';
export * from './drop-down-navigation.directive';
export * from './drop-down.base';
export * from './drop-down-item.base';
export * from './drop-down-group.component';
/**
 * @hidden
 */
export class IgxDropDownModule {
}
IgxDropDownModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxDropDownModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownModule, declarations: [IgxDropDownComponent,
        IgxDropDownItemBaseDirective,
        IgxDropDownItemComponent,
        IgxDropDownGroupComponent,
        IgxDropDownItemNavigationDirective], imports: [CommonModule,
        IgxToggleModule], exports: [IgxDropDownComponent,
        IgxDropDownItemComponent,
        IgxDropDownGroupComponent,
        IgxDropDownItemNavigationDirective] });
IgxDropDownModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownModule, imports: [[
            CommonModule,
            IgxToggleModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxDropDownComponent,
                        IgxDropDownItemBaseDirective,
                        IgxDropDownItemComponent,
                        IgxDropDownGroupComponent,
                        IgxDropDownItemNavigationDirective
                    ],
                    exports: [
                        IgxDropDownComponent,
                        IgxDropDownItemComponent,
                        IgxDropDownGroupComponent,
                        IgxDropDownItemNavigationDirective
                    ],
                    imports: [
                        CommonModule,
                        IgxToggleModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kcm9wLWRvd24vcHVibGljX2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDeEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7O0FBRXJFLGNBQWMsdUJBQXVCLENBQUM7QUFDdEMsY0FBYyw0QkFBNEIsQ0FBQztBQUUzQyxjQUFjLGtDQUFrQyxDQUFDO0FBQ2pELGNBQWMsa0JBQWtCLENBQUM7QUFDakMsY0FBYyx1QkFBdUIsQ0FBQztBQUN0QyxjQUFjLDZCQUE2QixDQUFDO0FBRTVDOztHQUVHO0FBb0JILE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFqQnRCLG9CQUFvQjtRQUNwQiw0QkFBNEI7UUFDNUIsd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6QixrQ0FBa0MsYUFTbEMsWUFBWTtRQUNaLGVBQWUsYUFQZixvQkFBb0I7UUFDcEIsd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6QixrQ0FBa0M7K0dBTzdCLGlCQUFpQixZQUxqQjtZQUNMLFlBQVk7WUFDWixlQUFlO1NBQ2xCOzJGQUVRLGlCQUFpQjtrQkFuQjdCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLG9CQUFvQjt3QkFDcEIsNEJBQTRCO3dCQUM1Qix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsa0NBQWtDO3FCQUNyQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsb0JBQW9CO3dCQUNwQix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsa0NBQWtDO3FCQUNyQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixlQUFlO3FCQUNsQjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hEcm9wRG93bkNvbXBvbmVudCB9IGZyb20gJy4vZHJvcC1kb3duLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hEcm9wRG93bkl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2Ryb3AtZG93bi1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hEcm9wRG93bkl0ZW1OYXZpZ2F0aW9uRGlyZWN0aXZlIH0gZnJvbSAnLi9kcm9wLWRvd24tbmF2aWdhdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IElneFRvZ2dsZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdG9nZ2xlL3RvZ2dsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4RHJvcERvd25Hcm91cENvbXBvbmVudCB9IGZyb20gJy4vZHJvcC1kb3duLWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi9kcm9wLWRvd24taXRlbS5iYXNlJztcblxuZXhwb3J0ICogZnJvbSAnLi9kcm9wLWRvd24uY29tcG9uZW50JztcbmV4cG9ydCAqIGZyb20gJy4vZHJvcC1kb3duLWl0ZW0uY29tcG9uZW50JztcbmV4cG9ydCB7IElTZWxlY3Rpb25FdmVudEFyZ3MsIElEcm9wRG93bk5hdmlnYXRpb25EaXJlY3RpdmUgfSBmcm9tICcuL2Ryb3AtZG93bi5jb21tb24nO1xuZXhwb3J0ICogZnJvbSAnLi9kcm9wLWRvd24tbmF2aWdhdGlvbi5kaXJlY3RpdmUnO1xuZXhwb3J0ICogZnJvbSAnLi9kcm9wLWRvd24uYmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL2Ryb3AtZG93bi1pdGVtLmJhc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9kcm9wLWRvd24tZ3JvdXAuY29tcG9uZW50JztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneERyb3BEb3duQ29tcG9uZW50LFxuICAgICAgICBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hEcm9wRG93bkl0ZW1Db21wb25lbnQsXG4gICAgICAgIElneERyb3BEb3duR3JvdXBDb21wb25lbnQsXG4gICAgICAgIElneERyb3BEb3duSXRlbU5hdmlnYXRpb25EaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4RHJvcERvd25Db21wb25lbnQsXG4gICAgICAgIElneERyb3BEb3duSXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4RHJvcERvd25Hcm91cENvbXBvbmVudCxcbiAgICAgICAgSWd4RHJvcERvd25JdGVtTmF2aWdhdGlvbkRpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIElneFRvZ2dsZU1vZHVsZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4RHJvcERvd25Nb2R1bGUgeyB9XG4iXX0=