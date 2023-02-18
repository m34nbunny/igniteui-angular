import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IgxSelectModule } from '../select/public_api';
import { IgxIconModule } from '../icon/public_api';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxInputGroupModule } from '../input-group/public_api';
import { IgxPageNavigationComponent, IgxPageSizeSelectorComponent, IgxPaginatorComponent, IgxPaginatorTemplateDirective } from './paginator.component';
import { IgxPaginatorDirective } from './paginator-interfaces';
import * as i0 from "@angular/core";
export * from './paginator.component';
export class IgxPaginatorModule {
}
IgxPaginatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPaginatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxPaginatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPaginatorModule, declarations: [IgxPaginatorComponent,
        IgxPageNavigationComponent,
        IgxPageSizeSelectorComponent,
        IgxPaginatorTemplateDirective,
        IgxPaginatorDirective], imports: [CommonModule,
        FormsModule,
        IgxButtonModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxRippleModule,
        IgxSelectModule], exports: [IgxPaginatorComponent,
        IgxPageNavigationComponent,
        IgxPageSizeSelectorComponent,
        IgxPaginatorTemplateDirective,
        IgxPaginatorDirective] });
IgxPaginatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPaginatorModule, imports: [[
            CommonModule,
            FormsModule,
            IgxButtonModule,
            IgxIconModule,
            IgxInputGroupModule,
            IgxRippleModule,
            IgxSelectModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPaginatorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxPaginatorComponent,
                        IgxPageNavigationComponent,
                        IgxPageSizeSelectorComponent,
                        IgxPaginatorTemplateDirective,
                        IgxPaginatorDirective
                    ],
                    exports: [
                        IgxPaginatorComponent,
                        IgxPageNavigationComponent,
                        IgxPageSizeSelectorComponent,
                        IgxPaginatorTemplateDirective,
                        IgxPaginatorDirective
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        IgxButtonModule,
                        IgxIconModule,
                        IgxInputGroupModule,
                        IgxRippleModule,
                        IgxSelectModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9wYWdpbmF0b3IvcHVibGljX2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBR2hFLE9BQU8sRUFDSCwwQkFBMEIsRUFDMUIsNEJBQTRCLEVBQzVCLHFCQUFxQixFQUNyQiw2QkFBNkIsRUFDaEMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFL0QsY0FBYyx1QkFBdUIsQ0FBQztBQTJCdEMsTUFBTSxPQUFPLGtCQUFrQjs7K0dBQWxCLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQXZCdkIscUJBQXFCO1FBQ3JCLDBCQUEwQjtRQUMxQiw0QkFBNEI7UUFDNUIsNkJBQTZCO1FBQzdCLHFCQUFxQixhQVVyQixZQUFZO1FBQ1osV0FBVztRQUNYLGVBQWU7UUFDZixhQUFhO1FBQ2IsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixlQUFlLGFBYmYscUJBQXFCO1FBQ3JCLDBCQUEwQjtRQUMxQiw0QkFBNEI7UUFDNUIsNkJBQTZCO1FBQzdCLHFCQUFxQjtnSEFZaEIsa0JBQWtCLFlBVmxCO1lBQ0wsWUFBWTtZQUNaLFdBQVc7WUFDWCxlQUFlO1lBQ2YsYUFBYTtZQUNiLG1CQUFtQjtZQUNuQixlQUFlO1lBQ2YsZUFBZTtTQUNsQjsyRkFFUSxrQkFBa0I7a0JBekI5QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixxQkFBcUI7d0JBQ3JCLDBCQUEwQjt3QkFDMUIsNEJBQTRCO3dCQUM1Qiw2QkFBNkI7d0JBQzdCLHFCQUFxQjtxQkFDeEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLHFCQUFxQjt3QkFDckIsMEJBQTBCO3dCQUMxQiw0QkFBNEI7d0JBQzVCLDZCQUE2Qjt3QkFDN0IscUJBQXFCO3FCQUN4QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsZUFBZTtxQkFDbEI7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBJZ3hTZWxlY3RNb2R1bGUgfSBmcm9tICcuLi9zZWxlY3QvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneEJ1dHRvbk1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvYnV0dG9uL2J1dHRvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwTW9kdWxlIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5cblxuaW1wb3J0IHtcbiAgICBJZ3hQYWdlTmF2aWdhdGlvbkNvbXBvbmVudCxcbiAgICBJZ3hQYWdlU2l6ZVNlbGVjdG9yQ29tcG9uZW50LFxuICAgIElneFBhZ2luYXRvckNvbXBvbmVudCxcbiAgICBJZ3hQYWdpbmF0b3JUZW1wbGF0ZURpcmVjdGl2ZVxufSBmcm9tICcuL3BhZ2luYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4UGFnaW5hdG9yRGlyZWN0aXZlIH0gZnJvbSAnLi9wYWdpbmF0b3ItaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vcGFnaW5hdG9yLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneFBhZ2luYXRvckNvbXBvbmVudCxcbiAgICAgICAgSWd4UGFnZU5hdmlnYXRpb25Db21wb25lbnQsXG4gICAgICAgIElneFBhZ2VTaXplU2VsZWN0b3JDb21wb25lbnQsXG4gICAgICAgIElneFBhZ2luYXRvclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hQYWdpbmF0b3JEaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4UGFnaW5hdG9yQ29tcG9uZW50LFxuICAgICAgICBJZ3hQYWdlTmF2aWdhdGlvbkNvbXBvbmVudCxcbiAgICAgICAgSWd4UGFnZVNpemVTZWxlY3RvckNvbXBvbmVudCxcbiAgICAgICAgSWd4UGFnaW5hdG9yVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneFBhZ2luYXRvckRpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBJZ3hCdXR0b25Nb2R1bGUsXG4gICAgICAgIElneEljb25Nb2R1bGUsXG4gICAgICAgIElneElucHV0R3JvdXBNb2R1bGUsXG4gICAgICAgIElneFJpcHBsZU1vZHVsZSxcbiAgICAgICAgSWd4U2VsZWN0TW9kdWxlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hQYWdpbmF0b3JNb2R1bGUgeyB9XG4iXX0=