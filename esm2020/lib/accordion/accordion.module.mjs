import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxExpansionPanelModule } from '../expansion-panel/expansion-panel.module';
import { IgxAccordionComponent } from './accordion.component';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxAccordionModule {
}
IgxAccordionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxAccordionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAccordionModule, declarations: [IgxAccordionComponent], imports: [IgxExpansionPanelModule,
        CommonModule], exports: [IgxAccordionComponent,
        IgxExpansionPanelModule] });
IgxAccordionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAccordionModule, imports: [[
            IgxExpansionPanelModule,
            CommonModule,
        ], IgxExpansionPanelModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxAccordionComponent
                    ],
                    imports: [
                        IgxExpansionPanelModule,
                        CommonModule,
                    ],
                    exports: [
                        IgxAccordionComponent,
                        IgxExpansionPanelModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNwRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFOUQ7O0dBRUc7QUFjSCxNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBWHZCLHFCQUFxQixhQUdyQix1QkFBdUI7UUFDdkIsWUFBWSxhQUdaLHFCQUFxQjtRQUNyQix1QkFBdUI7Z0hBR2xCLGtCQUFrQixZQVRsQjtZQUNMLHVCQUF1QjtZQUN2QixZQUFZO1NBQ2YsRUFHRyx1QkFBdUI7MkZBR2xCLGtCQUFrQjtrQkFiOUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YscUJBQXFCO3FCQUN4QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsdUJBQXVCO3dCQUN2QixZQUFZO3FCQUNmO29CQUNELE9BQU8sRUFBRTt3QkFDTCxxQkFBcUI7d0JBQ3JCLHVCQUF1QjtxQkFDMUI7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsTW9kdWxlIH0gZnJvbSAnLi4vZXhwYW5zaW9uLXBhbmVsL2V4cGFuc2lvbi1wYW5lbC5tb2R1bGUnO1xuaW1wb3J0IHsgSWd4QWNjb3JkaW9uQ29tcG9uZW50IH0gZnJvbSAnLi9hY2NvcmRpb24uY29tcG9uZW50JztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneEFjY29yZGlvbkNvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBJZ3hFeHBhbnNpb25QYW5lbE1vZHVsZSxcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hBY2NvcmRpb25Db21wb25lbnQsXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsTW9kdWxlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hBY2NvcmRpb25Nb2R1bGUge1xufVxuIl19