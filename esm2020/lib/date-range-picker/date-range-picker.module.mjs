import { NgModule } from '@angular/core';
import { IgxDateRangePickerComponent } from './date-range-picker.component';
import { IgxCalendarModule } from '../calendar/public_api';
import { IgxToggleModule } from '../directives/toggle/toggle.directive';
import { CommonModule } from '@angular/common';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxInputGroupModule } from '../input-group/public_api';
import { IgxIconModule } from '../icon/public_api';
import { IgxDateRangeStartComponent, IgxDateRangeEndComponent, DateRangePickerFormatPipe, IgxDateRangeSeparatorDirective, IgxDateRangeInputsBaseComponent } from './date-range-picker-inputs.common';
import { IgxDateTimeEditorModule } from '../directives/date-time-editor/public_api';
import { IgxPickersCommonModule } from '../date-common/picker-icons.common';
import { IgxCalendarContainerModule } from '../date-common/calendar-container/calendar-container.component';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxDateRangePickerModule {
}
IgxDateRangePickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateRangePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxDateRangePickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateRangePickerModule, declarations: [IgxDateRangePickerComponent,
        IgxDateRangeStartComponent,
        IgxDateRangeEndComponent,
        IgxDateRangeInputsBaseComponent,
        DateRangePickerFormatPipe,
        IgxDateRangeSeparatorDirective], imports: [CommonModule,
        IgxIconModule,
        IgxButtonModule,
        IgxToggleModule,
        IgxCalendarModule,
        IgxInputGroupModule,
        IgxPickersCommonModule,
        IgxDateTimeEditorModule,
        IgxCalendarContainerModule], exports: [IgxDateRangePickerComponent,
        IgxDateRangeStartComponent,
        IgxDateRangeEndComponent,
        IgxDateRangeSeparatorDirective,
        IgxDateTimeEditorModule,
        IgxPickersCommonModule,
        IgxInputGroupModule] });
IgxDateRangePickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateRangePickerModule, imports: [[
            CommonModule,
            IgxIconModule,
            IgxButtonModule,
            IgxToggleModule,
            IgxCalendarModule,
            IgxInputGroupModule,
            IgxPickersCommonModule,
            IgxDateTimeEditorModule,
            IgxCalendarContainerModule
        ], IgxDateTimeEditorModule,
        IgxPickersCommonModule,
        IgxInputGroupModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateRangePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxDateRangePickerComponent,
                        IgxDateRangeStartComponent,
                        IgxDateRangeEndComponent,
                        IgxDateRangeInputsBaseComponent,
                        DateRangePickerFormatPipe,
                        IgxDateRangeSeparatorDirective,
                    ],
                    imports: [
                        CommonModule,
                        IgxIconModule,
                        IgxButtonModule,
                        IgxToggleModule,
                        IgxCalendarModule,
                        IgxInputGroupModule,
                        IgxPickersCommonModule,
                        IgxDateTimeEditorModule,
                        IgxCalendarContainerModule
                    ],
                    exports: [
                        IgxDateRangePickerComponent,
                        IgxDateRangeStartComponent,
                        IgxDateRangeEndComponent,
                        IgxDateRangeSeparatorDirective,
                        IgxDateTimeEditorModule,
                        IgxPickersCommonModule,
                        IgxInputGroupModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RhdGUtcmFuZ2UtcGlja2VyL2RhdGUtcmFuZ2UtcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQ0gsMEJBQTBCLEVBQUUsd0JBQXdCLEVBQ3BELHlCQUF5QixFQUN6Qiw4QkFBOEIsRUFDOUIsK0JBQStCLEVBQ2xDLE1BQU0sbUNBQW1DLENBQUM7QUFDM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDNUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7O0FBRTVHLGNBQWM7QUErQmQsTUFBTSxPQUFPLHdCQUF3Qjs7cUhBQXhCLHdCQUF3QjtzSEFBeEIsd0JBQXdCLGlCQTVCN0IsMkJBQTJCO1FBQzNCLDBCQUEwQjtRQUMxQix3QkFBd0I7UUFDeEIsK0JBQStCO1FBQy9CLHlCQUF5QjtRQUN6Qiw4QkFBOEIsYUFHOUIsWUFBWTtRQUNaLGFBQWE7UUFDYixlQUFlO1FBQ2YsZUFBZTtRQUNmLGlCQUFpQjtRQUNqQixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLHVCQUF1QjtRQUN2QiwwQkFBMEIsYUFHMUIsMkJBQTJCO1FBQzNCLDBCQUEwQjtRQUMxQix3QkFBd0I7UUFDeEIsOEJBQThCO1FBQzlCLHVCQUF1QjtRQUN2QixzQkFBc0I7UUFDdEIsbUJBQW1CO3NIQUdkLHdCQUF3QixZQXJCeEI7WUFDTCxZQUFZO1lBQ1osYUFBYTtZQUNiLGVBQWU7WUFDZixlQUFlO1lBQ2YsaUJBQWlCO1lBQ2pCLG1CQUFtQjtZQUNuQixzQkFBc0I7WUFDdEIsdUJBQXVCO1lBQ3ZCLDBCQUEwQjtTQUM3QixFQU1HLHVCQUF1QjtRQUN2QixzQkFBc0I7UUFDdEIsbUJBQW1COzJGQUdkLHdCQUF3QjtrQkE5QnBDLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLDJCQUEyQjt3QkFDM0IsMEJBQTBCO3dCQUMxQix3QkFBd0I7d0JBQ3hCLCtCQUErQjt3QkFDL0IseUJBQXlCO3dCQUN6Qiw4QkFBOEI7cUJBQ2pDO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixlQUFlO3dCQUNmLGlCQUFpQjt3QkFDakIsbUJBQW1CO3dCQUNuQixzQkFBc0I7d0JBQ3RCLHVCQUF1Qjt3QkFDdkIsMEJBQTBCO3FCQUM3QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsMkJBQTJCO3dCQUMzQiwwQkFBMEI7d0JBQzFCLHdCQUF3Qjt3QkFDeEIsOEJBQThCO3dCQUM5Qix1QkFBdUI7d0JBQ3ZCLHNCQUFzQjt3QkFDdEIsbUJBQW1CO3FCQUN0QjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hDYWxlbmRhck1vZHVsZSB9IGZyb20gJy4uL2NhbGVuZGFyL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4VG9nZ2xlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90b2dnbGUvdG9nZ2xlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSWd4QnV0dG9uTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9idXR0b24vYnV0dG9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwTW9kdWxlIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7XG4gICAgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQsIElneERhdGVSYW5nZUVuZENvbXBvbmVudCxcbiAgICBEYXRlUmFuZ2VQaWNrZXJGb3JtYXRQaXBlLFxuICAgIElneERhdGVSYW5nZVNlcGFyYXRvckRpcmVjdGl2ZSxcbiAgICBJZ3hEYXRlUmFuZ2VJbnB1dHNCYXNlQ29tcG9uZW50XG59IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXItaW5wdXRzLmNvbW1vbic7XG5pbXBvcnQgeyBJZ3hEYXRlVGltZUVkaXRvck1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvZGF0ZS10aW1lLWVkaXRvci9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneFBpY2tlcnNDb21tb25Nb2R1bGUgfSBmcm9tICcuLi9kYXRlLWNvbW1vbi9waWNrZXItaWNvbnMuY29tbW9uJztcbmltcG9ydCB7IElneENhbGVuZGFyQ29udGFpbmVyTW9kdWxlIH0gZnJvbSAnLi4vZGF0ZS1jb21tb24vY2FsZW5kYXItY29udGFpbmVyL2NhbGVuZGFyLWNvbnRhaW5lci5jb21wb25lbnQnO1xuXG4vKiogQGhpZGRlbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50LFxuICAgICAgICBJZ3hEYXRlUmFuZ2VTdGFydENvbXBvbmVudCxcbiAgICAgICAgSWd4RGF0ZVJhbmdlRW5kQ29tcG9uZW50LFxuICAgICAgICBJZ3hEYXRlUmFuZ2VJbnB1dHNCYXNlQ29tcG9uZW50LFxuICAgICAgICBEYXRlUmFuZ2VQaWNrZXJGb3JtYXRQaXBlLFxuICAgICAgICBJZ3hEYXRlUmFuZ2VTZXBhcmF0b3JEaXJlY3RpdmUsXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgSWd4SWNvbk1vZHVsZSxcbiAgICAgICAgSWd4QnV0dG9uTW9kdWxlLFxuICAgICAgICBJZ3hUb2dnbGVNb2R1bGUsXG4gICAgICAgIElneENhbGVuZGFyTW9kdWxlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlLFxuICAgICAgICBJZ3hQaWNrZXJzQ29tbW9uTW9kdWxlLFxuICAgICAgICBJZ3hEYXRlVGltZUVkaXRvck1vZHVsZSxcbiAgICAgICAgSWd4Q2FsZW5kYXJDb250YWluZXJNb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50LFxuICAgICAgICBJZ3hEYXRlUmFuZ2VTdGFydENvbXBvbmVudCxcbiAgICAgICAgSWd4RGF0ZVJhbmdlRW5kQ29tcG9uZW50LFxuICAgICAgICBJZ3hEYXRlUmFuZ2VTZXBhcmF0b3JEaXJlY3RpdmUsXG4gICAgICAgIElneERhdGVUaW1lRWRpdG9yTW9kdWxlLFxuICAgICAgICBJZ3hQaWNrZXJzQ29tbW9uTW9kdWxlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hEYXRlUmFuZ2VQaWNrZXJNb2R1bGUgeyB9XG4iXX0=