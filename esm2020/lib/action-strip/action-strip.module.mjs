import { NgModule } from '@angular/core';
import { IgxActionStripComponent, IgxActionStripMenuItemDirective } from './action-strip.component';
import { IgxGridPinningActionsComponent } from './grid-actions/grid-pinning-actions.component';
import { IgxGridEditingActionsComponent } from './grid-actions/grid-editing-actions.component';
import { IgxGridActionsBaseDirective } from './grid-actions/grid-actions-base.directive';
import { CommonModule } from '@angular/common';
import { IgxDropDownModule } from '../drop-down/public_api';
import { IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxIconModule } from '../icon/public_api';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxGridActionButtonComponent } from './grid-actions/grid-action-button.component';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxActionStripModule {
}
IgxActionStripModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxActionStripModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxActionStripModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxActionStripModule, declarations: [IgxActionStripComponent,
        IgxActionStripMenuItemDirective,
        IgxGridPinningActionsComponent,
        IgxGridEditingActionsComponent,
        IgxGridActionsBaseDirective,
        IgxGridActionButtonComponent], imports: [CommonModule, IgxDropDownModule, IgxToggleModule, IgxButtonModule, IgxIconModule, IgxRippleModule], exports: [IgxActionStripComponent,
        IgxActionStripMenuItemDirective,
        IgxGridPinningActionsComponent,
        IgxGridEditingActionsComponent,
        IgxGridActionsBaseDirective,
        IgxGridActionButtonComponent] });
IgxActionStripModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxActionStripModule, imports: [[CommonModule, IgxDropDownModule, IgxToggleModule, IgxButtonModule, IgxIconModule, IgxRippleModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxActionStripModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxActionStripComponent,
                        IgxActionStripMenuItemDirective,
                        IgxGridPinningActionsComponent,
                        IgxGridEditingActionsComponent,
                        IgxGridActionsBaseDirective,
                        IgxGridActionButtonComponent
                    ],
                    exports: [
                        IgxActionStripComponent,
                        IgxActionStripMenuItemDirective,
                        IgxGridPinningActionsComponent,
                        IgxGridEditingActionsComponent,
                        IgxGridActionsBaseDirective,
                        IgxGridActionButtonComponent
                    ],
                    imports: [CommonModule, IgxDropDownModule, IgxToggleModule, IgxButtonModule, IgxIconModule, IgxRippleModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLXN0cmlwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9hY3Rpb24tc3RyaXAvYWN0aW9uLXN0cmlwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSwrQkFBK0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3BHLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQy9GLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQy9GLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7O0FBRTNGOztHQUVHO0FBb0JILE1BQU0sT0FBTyxvQkFBb0I7O2lIQUFwQixvQkFBb0I7a0hBQXBCLG9CQUFvQixpQkFqQnpCLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsOEJBQThCO1FBQzlCLDhCQUE4QjtRQUM5QiwyQkFBMkI7UUFDM0IsNEJBQTRCLGFBVXRCLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxlQUFlLGFBUHZHLHVCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsOEJBQThCO1FBQzlCLDhCQUE4QjtRQUM5QiwyQkFBMkI7UUFDM0IsNEJBQTRCO2tIQUl2QixvQkFBb0IsWUFGcEIsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDOzJGQUVuRyxvQkFBb0I7a0JBbkJoQyxRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVix1QkFBdUI7d0JBQ3ZCLCtCQUErQjt3QkFDL0IsOEJBQThCO3dCQUM5Qiw4QkFBOEI7d0JBQzlCLDJCQUEyQjt3QkFDM0IsNEJBQTRCO3FCQUMvQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsdUJBQXVCO3dCQUN2QiwrQkFBK0I7d0JBQy9CLDhCQUE4Qjt3QkFDOUIsOEJBQThCO3dCQUM5QiwyQkFBMkI7d0JBQzNCLDRCQUE0QjtxQkFDL0I7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQztpQkFDL0ciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4QWN0aW9uU3RyaXBDb21wb25lbnQsIElneEFjdGlvblN0cmlwTWVudUl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuL2FjdGlvbi1zdHJpcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4R3JpZFBpbm5pbmdBY3Rpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLWFjdGlvbnMvZ3JpZC1waW5uaW5nLWFjdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IElneEdyaWRFZGl0aW5nQWN0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC1hY3Rpb25zL2dyaWQtZWRpdGluZy1hY3Rpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hHcmlkQWN0aW9uc0Jhc2VEaXJlY3RpdmUgfSBmcm9tICcuL2dyaWQtYWN0aW9ucy9ncmlkLWFjdGlvbnMtYmFzZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IElneERyb3BEb3duTW9kdWxlIH0gZnJvbSAnLi4vZHJvcC1kb3duL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4VG9nZ2xlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90b2dnbGUvdG9nZ2xlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEljb25Nb2R1bGUgfSBmcm9tICcuLi9pY29uL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hHcmlkQWN0aW9uQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLWFjdGlvbnMvZ3JpZC1hY3Rpb24tYnV0dG9uLmNvbXBvbmVudCc7XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBJZ3hBY3Rpb25TdHJpcENvbXBvbmVudCxcbiAgICAgICAgSWd4QWN0aW9uU3RyaXBNZW51SXRlbURpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZFBpbm5pbmdBY3Rpb25zQ29tcG9uZW50LFxuICAgICAgICBJZ3hHcmlkRWRpdGluZ0FjdGlvbnNDb21wb25lbnQsXG4gICAgICAgIElneEdyaWRBY3Rpb25zQmFzZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZEFjdGlvbkJ1dHRvbkNvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hBY3Rpb25TdHJpcENvbXBvbmVudCxcbiAgICAgICAgSWd4QWN0aW9uU3RyaXBNZW51SXRlbURpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZFBpbm5pbmdBY3Rpb25zQ29tcG9uZW50LFxuICAgICAgICBJZ3hHcmlkRWRpdGluZ0FjdGlvbnNDb21wb25lbnQsXG4gICAgICAgIElneEdyaWRBY3Rpb25zQmFzZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4R3JpZEFjdGlvbkJ1dHRvbkNvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSWd4RHJvcERvd25Nb2R1bGUsIElneFRvZ2dsZU1vZHVsZSwgSWd4QnV0dG9uTW9kdWxlLCBJZ3hJY29uTW9kdWxlLCBJZ3hSaXBwbGVNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIElneEFjdGlvblN0cmlwTW9kdWxlIHsgfVxuIl19