import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxCalendarModule } from '../calendar/public_api';
import { IgxCalendarContainerModule } from '../date-common/calendar-container/calendar-container.component';
import { IgxPickersCommonModule } from '../date-common/picker-icons.common';
import { IgxDateTimeEditorModule } from '../directives/date-time-editor/public_api';
import { IgxMaskModule } from '../directives/mask/mask.directive';
import { IgxTextSelectionModule } from '../directives/text-selection/text-selection.directive';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule } from '../input-group/public_api';
import { IgxDatePickerComponent } from './date-picker.component';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxDatePickerModule {
}
IgxDatePickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDatePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxDatePickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDatePickerModule, declarations: [IgxDatePickerComponent], imports: [FormsModule,
        CommonModule,
        IgxIconModule,
        IgxMaskModule,
        IgxCalendarModule,
        IgxInputGroupModule,
        IgxPickersCommonModule,
        IgxTextSelectionModule,
        IgxDateTimeEditorModule,
        IgxCalendarContainerModule], exports: [IgxDatePickerComponent,
        IgxPickersCommonModule] });
IgxDatePickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDatePickerModule, imports: [[
            FormsModule,
            CommonModule,
            IgxIconModule,
            IgxMaskModule,
            IgxCalendarModule,
            IgxInputGroupModule,
            IgxPickersCommonModule,
            IgxTextSelectionModule,
            IgxDateTimeEditorModule,
            IgxCalendarContainerModule,
        ], IgxPickersCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDatePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxDatePickerComponent
                    ],
                    exports: [
                        IgxDatePickerComponent,
                        IgxPickersCommonModule
                    ],
                    imports: [
                        FormsModule,
                        CommonModule,
                        IgxIconModule,
                        IgxMaskModule,
                        IgxCalendarModule,
                        IgxInputGroupModule,
                        IgxPickersCommonModule,
                        IgxTextSelectionModule,
                        IgxDateTimeEditorModule,
                        IgxCalendarContainerModule,
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDNUcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQy9GLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7QUFFakUsY0FBYztBQXNCZCxNQUFNLE9BQU8sbUJBQW1COztnSEFBbkIsbUJBQW1CO2lIQUFuQixtQkFBbUIsaUJBbkJ4QixzQkFBc0IsYUFPdEIsV0FBVztRQUNYLFlBQVk7UUFDWixhQUFhO1FBQ2IsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLHNCQUFzQjtRQUN0Qix1QkFBdUI7UUFDdkIsMEJBQTBCLGFBYjFCLHNCQUFzQjtRQUN0QixzQkFBc0I7aUhBZWpCLG1CQUFtQixZQWJuQjtZQUNMLFdBQVc7WUFDWCxZQUFZO1lBQ1osYUFBYTtZQUNiLGFBQWE7WUFDYixpQkFBaUI7WUFDakIsbUJBQW1CO1lBQ25CLHNCQUFzQjtZQUN0QixzQkFBc0I7WUFDdEIsdUJBQXVCO1lBQ3ZCLDBCQUEwQjtTQUM3QixFQWJHLHNCQUFzQjsyRkFlakIsbUJBQW1CO2tCQXJCL0IsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysc0JBQXNCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsc0JBQXNCO3dCQUN0QixzQkFBc0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxXQUFXO3dCQUNYLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixhQUFhO3dCQUNiLGlCQUFpQjt3QkFDakIsbUJBQW1CO3dCQUNuQixzQkFBc0I7d0JBQ3RCLHNCQUFzQjt3QkFDdEIsdUJBQXVCO3dCQUN2QiwwQkFBMEI7cUJBQzdCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IElneENhbGVuZGFyTW9kdWxlIH0gZnJvbSAnLi4vY2FsZW5kYXIvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hDYWxlbmRhckNvbnRhaW5lck1vZHVsZSB9IGZyb20gJy4uL2RhdGUtY29tbW9uL2NhbGVuZGFyLWNvbnRhaW5lci9jYWxlbmRhci1jb250YWluZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneFBpY2tlcnNDb21tb25Nb2R1bGUgfSBmcm9tICcuLi9kYXRlLWNvbW1vbi9waWNrZXItaWNvbnMuY29tbW9uJztcbmltcG9ydCB7IElneERhdGVUaW1lRWRpdG9yTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9kYXRlLXRpbWUtZWRpdG9yL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4TWFza01vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbWFzay9tYXNrLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hUZXh0U2VsZWN0aW9uTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90ZXh0LXNlbGVjdGlvbi90ZXh0LXNlbGVjdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4SWNvbk1vZHVsZSB9IGZyb20gJy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwTW9kdWxlIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hEYXRlUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuXG4vKiogQGhpZGRlbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4RGF0ZVBpY2tlckNvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hEYXRlUGlja2VyQ29tcG9uZW50LFxuICAgICAgICBJZ3hQaWNrZXJzQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIElneEljb25Nb2R1bGUsXG4gICAgICAgIElneE1hc2tNb2R1bGUsXG4gICAgICAgIElneENhbGVuZGFyTW9kdWxlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlLFxuICAgICAgICBJZ3hQaWNrZXJzQ29tbW9uTW9kdWxlLFxuICAgICAgICBJZ3hUZXh0U2VsZWN0aW9uTW9kdWxlLFxuICAgICAgICBJZ3hEYXRlVGltZUVkaXRvck1vZHVsZSxcbiAgICAgICAgSWd4Q2FsZW5kYXJDb250YWluZXJNb2R1bGUsXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hEYXRlUGlja2VyTW9kdWxlIHsgfVxuIl19