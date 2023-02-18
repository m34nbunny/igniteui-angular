import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxNavigationDrawerComponent } from './navigation-drawer.component';
import { IgxNavDrawerItemDirective, IgxNavDrawerMiniTemplateDirective, IgxNavDrawerTemplateDirective } from './navigation-drawer.directives';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxNavigationDrawerModule {
}
IgxNavigationDrawerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxNavigationDrawerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxNavigationDrawerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxNavigationDrawerModule, declarations: [IgxNavigationDrawerComponent,
        IgxNavDrawerItemDirective,
        IgxNavDrawerMiniTemplateDirective,
        IgxNavDrawerTemplateDirective], imports: [CommonModule], exports: [IgxNavigationDrawerComponent,
        IgxNavDrawerItemDirective,
        IgxNavDrawerMiniTemplateDirective,
        IgxNavDrawerTemplateDirective] });
IgxNavigationDrawerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxNavigationDrawerModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxNavigationDrawerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxNavigationDrawerComponent,
                        IgxNavDrawerItemDirective,
                        IgxNavDrawerMiniTemplateDirective,
                        IgxNavDrawerTemplateDirective
                    ],
                    exports: [
                        IgxNavigationDrawerComponent,
                        IgxNavDrawerItemDirective,
                        IgxNavDrawerMiniTemplateDirective,
                        IgxNavDrawerTemplateDirective
                    ],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi1kcmF3ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL25hdmlnYXRpb24tZHJhd2VyL25hdmlnYXRpb24tZHJhd2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM3RSxPQUFPLEVBQ0gseUJBQXlCLEVBQ3pCLGlDQUFpQyxFQUNqQyw2QkFBNkIsRUFDaEMsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFFeEM7O0dBRUc7QUFnQkgsTUFBTSxPQUFPLHlCQUF5Qjs7c0hBQXpCLHlCQUF5Qjt1SEFBekIseUJBQXlCLGlCQWI5Qiw0QkFBNEI7UUFDNUIseUJBQXlCO1FBQ3pCLGlDQUFpQztRQUNqQyw2QkFBNkIsYUFRdkIsWUFBWSxhQUxsQiw0QkFBNEI7UUFDNUIseUJBQXlCO1FBQ3pCLGlDQUFpQztRQUNqQyw2QkFBNkI7dUhBSXhCLHlCQUF5QixZQUZ6QixDQUFDLFlBQVksQ0FBQzsyRkFFZCx5QkFBeUI7a0JBZnJDLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLDRCQUE0Qjt3QkFDNUIseUJBQXlCO3dCQUN6QixpQ0FBaUM7d0JBQ2pDLDZCQUE2QjtxQkFDaEM7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLDRCQUE0Qjt3QkFDNUIseUJBQXlCO3dCQUN6QixpQ0FBaUM7d0JBQ2pDLDZCQUE2QjtxQkFDaEM7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4TmF2aWdhdGlvbkRyYXdlckNvbXBvbmVudCB9IGZyb20gJy4vbmF2aWdhdGlvbi1kcmF3ZXIuY29tcG9uZW50JztcbmltcG9ydCB7XG4gICAgSWd4TmF2RHJhd2VySXRlbURpcmVjdGl2ZSxcbiAgICBJZ3hOYXZEcmF3ZXJNaW5pVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgSWd4TmF2RHJhd2VyVGVtcGxhdGVEaXJlY3RpdmVcbn0gZnJvbSAnLi9uYXZpZ2F0aW9uLWRyYXdlci5kaXJlY3RpdmVzJztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneE5hdmlnYXRpb25EcmF3ZXJDb21wb25lbnQsXG4gICAgICAgIElneE5hdkRyYXdlckl0ZW1EaXJlY3RpdmUsXG4gICAgICAgIElneE5hdkRyYXdlck1pbmlUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4TmF2RHJhd2VyVGVtcGxhdGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4TmF2aWdhdGlvbkRyYXdlckNvbXBvbmVudCxcbiAgICAgICAgSWd4TmF2RHJhd2VySXRlbURpcmVjdGl2ZSxcbiAgICAgICAgSWd4TmF2RHJhd2VyTWluaVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hOYXZEcmF3ZXJUZW1wbGF0ZURpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4TmF2aWdhdGlvbkRyYXdlck1vZHVsZSB7fVxuIl19