import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxIconModule } from '../icon/public_api';
import { IgxDropDownModule } from '../drop-down/public_api';
import { IgxToggleModule } from './../directives/toggle/toggle.directive';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxInputGroupModule } from '../input-group/input-group.component';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxSelectComponent, IgxSelectToggleIconDirective, IgxSelectHeaderDirective, IgxSelectFooterDirective } from './select.component';
import { IgxSelectItemComponent } from './select-item.component';
import { IgxSelectItemNavigationDirective } from './select-navigation.directive';
import { IgxSelectGroupComponent } from './select-group.component';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxSelectModule {
}
IgxSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectModule, declarations: [IgxSelectComponent,
        IgxSelectFooterDirective,
        IgxSelectGroupComponent,
        IgxSelectHeaderDirective,
        IgxSelectItemComponent,
        IgxSelectItemNavigationDirective,
        IgxSelectToggleIconDirective], imports: [CommonModule,
        FormsModule,
        IgxButtonModule,
        IgxDropDownModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxRippleModule,
        IgxToggleModule,
        ReactiveFormsModule], exports: [IgxSelectComponent,
        IgxSelectFooterDirective,
        IgxSelectGroupComponent,
        IgxSelectHeaderDirective,
        IgxSelectItemComponent,
        IgxSelectItemNavigationDirective,
        IgxSelectToggleIconDirective,
        IgxInputGroupModule] });
IgxSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectModule, providers: [], imports: [[
            CommonModule,
            FormsModule,
            IgxButtonModule,
            IgxDropDownModule,
            IgxIconModule,
            IgxInputGroupModule,
            IgxRippleModule,
            IgxToggleModule,
            ReactiveFormsModule
        ], IgxInputGroupModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxSelectComponent,
                        IgxSelectFooterDirective,
                        IgxSelectGroupComponent,
                        IgxSelectHeaderDirective,
                        IgxSelectItemComponent,
                        IgxSelectItemNavigationDirective,
                        IgxSelectToggleIconDirective
                    ],
                    exports: [
                        IgxSelectComponent,
                        IgxSelectFooterDirective,
                        IgxSelectGroupComponent,
                        IgxSelectHeaderDirective,
                        IgxSelectItemComponent,
                        IgxSelectItemNavigationDirective,
                        IgxSelectToggleIconDirective,
                        IgxInputGroupModule
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        IgxButtonModule,
                        IgxDropDownModule,
                        IgxIconModule,
                        IgxInputGroupModule,
                        IgxRippleModule,
                        IgxToggleModule,
                        ReactiveFormsModule
                    ],
                    providers: []
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZWxlY3Qvc2VsZWN0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSw0QkFBNEIsRUFBRSx3QkFBd0IsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFJLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQUVuRSxjQUFjO0FBa0NkLE1BQU0sT0FBTyxlQUFlOzs0R0FBZixlQUFlOzZHQUFmLGVBQWUsaUJBL0JwQixrQkFBa0I7UUFDbEIsd0JBQXdCO1FBQ3hCLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIsc0JBQXNCO1FBQ3RCLGdDQUFnQztRQUNoQyw0QkFBNEIsYUFhNUIsWUFBWTtRQUNaLFdBQVc7UUFDWCxlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLGFBQWE7UUFDYixtQkFBbUI7UUFDbkIsZUFBZTtRQUNmLGVBQWU7UUFDZixtQkFBbUIsYUFsQm5CLGtCQUFrQjtRQUNsQix3QkFBd0I7UUFDeEIsdUJBQXVCO1FBQ3ZCLHdCQUF3QjtRQUN4QixzQkFBc0I7UUFDdEIsZ0NBQWdDO1FBQ2hDLDRCQUE0QjtRQUM1QixtQkFBbUI7NkdBZWQsZUFBZSxhQUZiLEVBQUUsWUFYSjtZQUNMLFlBQVk7WUFDWixXQUFXO1lBQ1gsZUFBZTtZQUNmLGlCQUFpQjtZQUNqQixhQUFhO1lBQ2IsbUJBQW1CO1lBQ25CLGVBQWU7WUFDZixlQUFlO1lBQ2YsbUJBQW1CO1NBQ3RCLEVBWkcsbUJBQW1COzJGQWVkLGVBQWU7a0JBakMzQixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixrQkFBa0I7d0JBQ2xCLHdCQUF3Qjt3QkFDeEIsdUJBQXVCO3dCQUN2Qix3QkFBd0I7d0JBQ3hCLHNCQUFzQjt3QkFDdEIsZ0NBQWdDO3dCQUNoQyw0QkFBNEI7cUJBQy9CO29CQUNELE9BQU8sRUFBRTt3QkFDTCxrQkFBa0I7d0JBQ2xCLHdCQUF3Qjt3QkFDeEIsdUJBQXVCO3dCQUN2Qix3QkFBd0I7d0JBQ3hCLHNCQUFzQjt3QkFDdEIsZ0NBQWdDO3dCQUNoQyw0QkFBNEI7d0JBQzVCLG1CQUFtQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxlQUFlO3dCQUNmLGlCQUFpQjt3QkFDakIsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixtQkFBbUI7cUJBQ3RCO29CQUNELFNBQVMsRUFBRSxFQUFFO2lCQUNoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneERyb3BEb3duTW9kdWxlIH0gZnJvbSAnLi4vZHJvcC1kb3duL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4VG9nZ2xlTW9kdWxlIH0gZnJvbSAnLi8uLi9kaXJlY3RpdmVzL3RvZ2dsZS90b2dnbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvcmlwcGxlL3JpcHBsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4SW5wdXRHcm91cE1vZHVsZSB9IGZyb20gJy4uL2lucHV0LWdyb3VwL2lucHV0LWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcblxuaW1wb3J0IHsgSWd4U2VsZWN0Q29tcG9uZW50LCBJZ3hTZWxlY3RUb2dnbGVJY29uRGlyZWN0aXZlLCBJZ3hTZWxlY3RIZWFkZXJEaXJlY3RpdmUsIElneFNlbGVjdEZvb3RlckRpcmVjdGl2ZSB9IGZyb20gJy4vc2VsZWN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hTZWxlY3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4U2VsZWN0SXRlbU5hdmlnYXRpb25EaXJlY3RpdmUgfSBmcm9tICcuL3NlbGVjdC1uYXZpZ2F0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hTZWxlY3RHcm91cENvbXBvbmVudCB9IGZyb20gJy4vc2VsZWN0LWdyb3VwLmNvbXBvbmVudCc7XG5cbi8qKiBAaGlkZGVuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBJZ3hTZWxlY3RDb21wb25lbnQsXG4gICAgICAgIElneFNlbGVjdEZvb3RlckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4U2VsZWN0R3JvdXBDb21wb25lbnQsXG4gICAgICAgIElneFNlbGVjdEhlYWRlckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4U2VsZWN0SXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4U2VsZWN0SXRlbU5hdmlnYXRpb25EaXJlY3RpdmUsXG4gICAgICAgIElneFNlbGVjdFRvZ2dsZUljb25EaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4U2VsZWN0Q29tcG9uZW50LFxuICAgICAgICBJZ3hTZWxlY3RGb290ZXJEaXJlY3RpdmUsXG4gICAgICAgIElneFNlbGVjdEdyb3VwQ29tcG9uZW50LFxuICAgICAgICBJZ3hTZWxlY3RIZWFkZXJEaXJlY3RpdmUsXG4gICAgICAgIElneFNlbGVjdEl0ZW1Db21wb25lbnQsXG4gICAgICAgIElneFNlbGVjdEl0ZW1OYXZpZ2F0aW9uRGlyZWN0aXZlLFxuICAgICAgICBJZ3hTZWxlY3RUb2dnbGVJY29uRGlyZWN0aXZlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgIElneEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgSWd4RHJvcERvd25Nb2R1bGUsXG4gICAgICAgIElneEljb25Nb2R1bGUsXG4gICAgICAgIElneElucHV0R3JvdXBNb2R1bGUsXG4gICAgICAgIElneFJpcHBsZU1vZHVsZSxcbiAgICAgICAgSWd4VG9nZ2xlTW9kdWxlLFxuICAgICAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIElneFNlbGVjdE1vZHVsZSB7IH1cbiJdfQ==