import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IgxSplitterPaneComponent } from './splitter-pane/splitter-pane.component';
import { IgxSplitterComponent, IgxSplitBarComponent } from './splitter.component';
import { IgxIconModule } from '../icon/public_api';
import { IgxDragDropModule } from '../directives/drag-drop/drag-drop.directive';
import * as i0 from "@angular/core";
export class IgxSplitterModule {
}
IgxSplitterModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxSplitterModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterModule, declarations: [IgxSplitterComponent,
        IgxSplitterPaneComponent,
        IgxSplitBarComponent], imports: [CommonModule, IgxIconModule, IgxDragDropModule], exports: [IgxSplitterComponent,
        IgxSplitterPaneComponent] });
IgxSplitterModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterModule, imports: [[
            CommonModule, IgxIconModule, IgxDragDropModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule, IgxIconModule, IgxDragDropModule
                    ],
                    declarations: [
                        IgxSplitterComponent,
                        IgxSplitterPaneComponent,
                        IgxSplitBarComponent
                    ],
                    exports: [
                        IgxSplitterComponent,
                        IgxSplitterPaneComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3NwbGl0dGVyL3NwbGl0dGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNuRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7O0FBZ0JoRixNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBVHRCLG9CQUFvQjtRQUNwQix3QkFBd0I7UUFDeEIsb0JBQW9CLGFBTHBCLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLGFBUTlDLG9CQUFvQjtRQUNwQix3QkFBd0I7K0dBR25CLGlCQUFpQixZQWJqQjtZQUNMLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCO1NBQ2pEOzJGQVdRLGlCQUFpQjtrQkFkN0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUU7d0JBQ0wsWUFBWSxFQUFFLGFBQWEsRUFBRSxpQkFBaUI7cUJBQ2pEO29CQUNELFlBQVksRUFBRTt3QkFDVixvQkFBb0I7d0JBQ3BCLHdCQUF3Qjt3QkFDeEIsb0JBQW9CO3FCQUN2QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsb0JBQW9CO3dCQUNwQix3QkFBd0I7cUJBQzNCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQgfSBmcm9tICcuL3NwbGl0dGVyLXBhbmUvc3BsaXR0ZXItcGFuZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4U3BsaXR0ZXJDb21wb25lbnQsIElneFNwbGl0QmFyQ29tcG9uZW50IH0gZnJvbSAnLi9zcGxpdHRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4SWNvbk1vZHVsZSB9IGZyb20gJy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hEcmFnRHJvcE1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvZHJhZy1kcm9wL2RyYWctZHJvcC5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLCBJZ3hJY29uTW9kdWxlLCBJZ3hEcmFnRHJvcE1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneFNwbGl0dGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnQsXG4gICAgICAgIElneFNwbGl0QmFyQ29tcG9uZW50XG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIElneFNwbGl0dGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneFNwbGl0dGVyTW9kdWxlIHsgfVxuIl19