import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxAvatarModule } from '../avatar/avatar.component';
import { IgxIconModule } from '../icon/public_api';
import { IgxExpansionPanelComponent } from './expansion-panel.component';
import { IgxExpansionPanelHeaderComponent } from './expansion-panel-header.component';
import { IgxExpansionPanelBodyComponent } from './expansion-panel-body.component';
import { IgxExpansionPanelDescriptionDirective, IgxExpansionPanelTitleDirective, IgxExpansionPanelIconDirective } from './expansion-panel.directives';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxExpansionPanelModule {
}
IgxExpansionPanelModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxExpansionPanelModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelModule, declarations: [IgxExpansionPanelComponent,
        IgxExpansionPanelHeaderComponent,
        IgxExpansionPanelBodyComponent,
        IgxExpansionPanelDescriptionDirective,
        IgxExpansionPanelTitleDirective,
        IgxExpansionPanelIconDirective], imports: [CommonModule,
        IgxRippleModule,
        IgxIconModule,
        IgxButtonModule,
        IgxAvatarModule], exports: [IgxExpansionPanelComponent,
        IgxExpansionPanelHeaderComponent,
        IgxExpansionPanelBodyComponent,
        IgxExpansionPanelDescriptionDirective,
        IgxExpansionPanelTitleDirective,
        IgxExpansionPanelIconDirective] });
IgxExpansionPanelModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelModule, imports: [[
            CommonModule,
            IgxRippleModule,
            IgxIconModule,
            IgxButtonModule,
            IgxAvatarModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxExpansionPanelComponent,
                        IgxExpansionPanelHeaderComponent,
                        IgxExpansionPanelBodyComponent,
                        IgxExpansionPanelDescriptionDirective,
                        IgxExpansionPanelTitleDirective,
                        IgxExpansionPanelIconDirective
                    ],
                    exports: [
                        IgxExpansionPanelComponent,
                        IgxExpansionPanelHeaderComponent,
                        IgxExpansionPanelBodyComponent,
                        IgxExpansionPanelDescriptionDirective,
                        IgxExpansionPanelTitleDirective,
                        IgxExpansionPanelIconDirective
                    ],
                    imports: [
                        CommonModule,
                        IgxRippleModule,
                        IgxIconModule,
                        IgxButtonModule,
                        IgxAvatarModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9leHBhbnNpb24tcGFuZWwvZXhwYW5zaW9uLXBhbmVsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDekUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdEYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEYsT0FBTyxFQUNILHFDQUFxQyxFQUNyQywrQkFBK0IsRUFDL0IsOEJBQThCLEVBQ2pDLE1BQU0sOEJBQThCLENBQUM7O0FBRXRDOztHQUVHO0FBMEJILE1BQU0sT0FBTyx1QkFBdUI7O29IQUF2Qix1QkFBdUI7cUhBQXZCLHVCQUF1QixpQkF2QjVCLDBCQUEwQjtRQUMxQixnQ0FBZ0M7UUFDaEMsOEJBQThCO1FBQzlCLHFDQUFxQztRQUNyQywrQkFBK0I7UUFDL0IsOEJBQThCLGFBVzlCLFlBQVk7UUFDWixlQUFlO1FBQ2YsYUFBYTtRQUNiLGVBQWU7UUFDZixlQUFlLGFBWmYsMEJBQTBCO1FBQzFCLGdDQUFnQztRQUNoQyw4QkFBOEI7UUFDOUIscUNBQXFDO1FBQ3JDLCtCQUErQjtRQUMvQiw4QkFBOEI7cUhBVXpCLHVCQUF1QixZQVJ2QjtZQUNMLFlBQVk7WUFDWixlQUFlO1lBQ2YsYUFBYTtZQUNiLGVBQWU7WUFDZixlQUFlO1NBQ2xCOzJGQUVRLHVCQUF1QjtrQkF6Qm5DLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLDBCQUEwQjt3QkFDMUIsZ0NBQWdDO3dCQUNoQyw4QkFBOEI7d0JBQzlCLHFDQUFxQzt3QkFDckMsK0JBQStCO3dCQUMvQiw4QkFBOEI7cUJBQ2pDO29CQUNELE9BQU8sRUFBRTt3QkFDTCwwQkFBMEI7d0JBQzFCLGdDQUFnQzt3QkFDaEMsOEJBQThCO3dCQUM5QixxQ0FBcUM7d0JBQ3JDLCtCQUErQjt3QkFDL0IsOEJBQThCO3FCQUNqQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixlQUFlO3FCQUNsQjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEF2YXRhck1vZHVsZSB9IGZyb20gJy4uL2F2YXRhci9hdmF0YXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneEljb25Nb2R1bGUgfSBmcm9tICcuLi9pY29uL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4RXhwYW5zaW9uUGFuZWxDb21wb25lbnQgfSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4RXhwYW5zaW9uUGFuZWxIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsQm9keUNvbXBvbmVudCB9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWJvZHkuY29tcG9uZW50JztcbmltcG9ydCB7XG4gICAgSWd4RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbkRpcmVjdGl2ZSxcbiAgICBJZ3hFeHBhbnNpb25QYW5lbFRpdGxlRGlyZWN0aXZlLFxuICAgIElneEV4cGFuc2lvblBhbmVsSWNvbkRpcmVjdGl2ZVxufSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC5kaXJlY3RpdmVzJztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsQ29tcG9uZW50LFxuICAgICAgICBJZ3hFeHBhbnNpb25QYW5lbEhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgSWd4RXhwYW5zaW9uUGFuZWxCb2R5Q29tcG9uZW50LFxuICAgICAgICBJZ3hFeHBhbnNpb25QYW5lbERlc2NyaXB0aW9uRGlyZWN0aXZlLFxuICAgICAgICBJZ3hFeHBhbnNpb25QYW5lbFRpdGxlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hFeHBhbnNpb25QYW5lbEljb25EaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4RXhwYW5zaW9uUGFuZWxDb21wb25lbnQsXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hFeHBhbnNpb25QYW5lbEJvZHlDb21wb25lbnQsXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb25EaXJlY3RpdmUsXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsVGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsSWNvbkRpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIElneFJpcHBsZU1vZHVsZSxcbiAgICAgICAgSWd4SWNvbk1vZHVsZSxcbiAgICAgICAgSWd4QnV0dG9uTW9kdWxlLFxuICAgICAgICBJZ3hBdmF0YXJNb2R1bGVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneEV4cGFuc2lvblBhbmVsTW9kdWxlIHsgfVxuIl19