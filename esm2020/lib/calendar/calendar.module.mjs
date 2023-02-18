import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxIconModule } from '../icon/public_api';
import { IgxCalendarComponent } from './calendar.component';
import { IgxCalendarHeaderTemplateDirective, IgxCalendarMonthDirective, IgxCalendarSubheaderTemplateDirective, IgxCalendarYearDirective, IgxCalendarScrollMonthDirective } from './calendar.directives';
import { IgxMonthsViewComponent } from './months-view/months-view.component';
import { IgxYearsViewComponent } from './years-view/years-view.component';
import { IgxDaysViewComponent } from './days-view/days-view.component';
import { IgxDayItemComponent } from './days-view/day-item.component';
import { IgxMonthPickerComponent } from './month-picker/month-picker.component';
import { IgxCalendarBaseDirective } from './calendar-base';
import { IgxMonthPickerBaseDirective } from './month-picker-base';
import { IgxMonthViewSlotsCalendar, IgxGetViewDateCalendar } from './months-view.pipe';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxCalendarModule {
}
IgxCalendarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxCalendarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarModule, declarations: [IgxCalendarBaseDirective,
        IgxMonthPickerBaseDirective,
        IgxDayItemComponent,
        IgxDaysViewComponent,
        IgxCalendarComponent,
        IgxCalendarHeaderTemplateDirective,
        IgxCalendarMonthDirective,
        IgxCalendarYearDirective,
        IgxCalendarSubheaderTemplateDirective,
        IgxCalendarScrollMonthDirective,
        IgxMonthsViewComponent,
        IgxYearsViewComponent,
        IgxMonthPickerComponent,
        IgxMonthViewSlotsCalendar,
        IgxGetViewDateCalendar], imports: [CommonModule, FormsModule, IgxIconModule], exports: [IgxCalendarComponent,
        IgxDaysViewComponent,
        IgxMonthsViewComponent,
        IgxYearsViewComponent,
        IgxMonthPickerComponent,
        IgxCalendarHeaderTemplateDirective,
        IgxCalendarMonthDirective,
        IgxCalendarYearDirective,
        IgxCalendarSubheaderTemplateDirective] });
IgxCalendarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarModule, imports: [[CommonModule, FormsModule, IgxIconModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxCalendarBaseDirective,
                        IgxMonthPickerBaseDirective,
                        IgxDayItemComponent,
                        IgxDaysViewComponent,
                        IgxCalendarComponent,
                        IgxCalendarHeaderTemplateDirective,
                        IgxCalendarMonthDirective,
                        IgxCalendarYearDirective,
                        IgxCalendarSubheaderTemplateDirective,
                        IgxCalendarScrollMonthDirective,
                        IgxMonthsViewComponent,
                        IgxYearsViewComponent,
                        IgxMonthPickerComponent,
                        IgxMonthViewSlotsCalendar,
                        IgxGetViewDateCalendar
                    ],
                    exports: [
                        IgxCalendarComponent,
                        IgxDaysViewComponent,
                        IgxMonthsViewComponent,
                        IgxYearsViewComponent,
                        IgxMonthPickerComponent,
                        IgxCalendarHeaderTemplateDirective,
                        IgxCalendarMonthDirective,
                        IgxCalendarYearDirective,
                        IgxCalendarSubheaderTemplateDirective
                    ],
                    imports: [CommonModule, FormsModule, IgxIconModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NhbGVuZGFyL2NhbGVuZGFyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFDSCxrQ0FBa0MsRUFDbEMseUJBQXlCLEVBQ3pCLHFDQUFxQyxFQUNyQyx3QkFBd0IsRUFDeEIsK0JBQStCLEVBQ2xDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDMUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDckUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLHNCQUFzQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBRXZGOztHQUVHO0FBZ0NILE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkE3QnRCLHdCQUF3QjtRQUN4QiwyQkFBMkI7UUFDM0IsbUJBQW1CO1FBQ25CLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsa0NBQWtDO1FBQ2xDLHlCQUF5QjtRQUN6Qix3QkFBd0I7UUFDeEIscUNBQXFDO1FBQ3JDLCtCQUErQjtRQUMvQixzQkFBc0I7UUFDdEIscUJBQXFCO1FBQ3JCLHVCQUF1QjtRQUN2Qix5QkFBeUI7UUFDekIsc0JBQXNCLGFBYWhCLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxhQVY5QyxvQkFBb0I7UUFDcEIsb0JBQW9CO1FBQ3BCLHNCQUFzQjtRQUN0QixxQkFBcUI7UUFDckIsdUJBQXVCO1FBQ3ZCLGtDQUFrQztRQUNsQyx5QkFBeUI7UUFDekIsd0JBQXdCO1FBQ3hCLHFDQUFxQzsrR0FJaEMsaUJBQWlCLFlBRmpCLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUM7MkZBRTFDLGlCQUFpQjtrQkEvQjdCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLHdCQUF3Qjt3QkFDeEIsMkJBQTJCO3dCQUMzQixtQkFBbUI7d0JBQ25CLG9CQUFvQjt3QkFDcEIsb0JBQW9CO3dCQUNwQixrQ0FBa0M7d0JBQ2xDLHlCQUF5Qjt3QkFDekIsd0JBQXdCO3dCQUN4QixxQ0FBcUM7d0JBQ3JDLCtCQUErQjt3QkFDL0Isc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLHVCQUF1Qjt3QkFDdkIseUJBQXlCO3dCQUN6QixzQkFBc0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxvQkFBb0I7d0JBQ3BCLG9CQUFvQjt3QkFDcEIsc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLHVCQUF1Qjt3QkFDdkIsa0NBQWtDO3dCQUNsQyx5QkFBeUI7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIscUNBQXFDO3FCQUN4QztvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztpQkFDdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgSWd4SWNvbk1vZHVsZSB9IGZyb20gJy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hDYWxlbmRhckNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7XG4gICAgSWd4Q2FsZW5kYXJIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJZ3hDYWxlbmRhck1vbnRoRGlyZWN0aXZlLFxuICAgIElneENhbGVuZGFyU3ViaGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgSWd4Q2FsZW5kYXJZZWFyRGlyZWN0aXZlLFxuICAgIElneENhbGVuZGFyU2Nyb2xsTW9udGhEaXJlY3RpdmVcbn0gZnJvbSAnLi9jYWxlbmRhci5kaXJlY3RpdmVzJztcbmltcG9ydCB7IElneE1vbnRoc1ZpZXdDb21wb25lbnQgfSBmcm9tICcuL21vbnRocy12aWV3L21vbnRocy12aWV3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hZZWFyc1ZpZXdDb21wb25lbnQgfSBmcm9tICcuL3llYXJzLXZpZXcveWVhcnMtdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4RGF5c1ZpZXdDb21wb25lbnQgfSBmcm9tICcuL2RheXMtdmlldy9kYXlzLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IElneERheUl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2RheXMtdmlldy9kYXktaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4TW9udGhQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL21vbnRoLXBpY2tlci9tb250aC1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneENhbGVuZGFyQmFzZURpcmVjdGl2ZSB9IGZyb20gJy4vY2FsZW5kYXItYmFzZSc7XG5pbXBvcnQgeyBJZ3hNb250aFBpY2tlckJhc2VEaXJlY3RpdmUgfSBmcm9tICcuL21vbnRoLXBpY2tlci1iYXNlJztcbmltcG9ydCB7IElneE1vbnRoVmlld1Nsb3RzQ2FsZW5kYXIsIElneEdldFZpZXdEYXRlQ2FsZW5kYXIgfSBmcm9tICcuL21vbnRocy12aWV3LnBpcGUnO1xuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4Q2FsZW5kYXJCYXNlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hNb250aFBpY2tlckJhc2VEaXJlY3RpdmUsXG4gICAgICAgIElneERheUl0ZW1Db21wb25lbnQsXG4gICAgICAgIElneERheXNWaWV3Q29tcG9uZW50LFxuICAgICAgICBJZ3hDYWxlbmRhckNvbXBvbmVudCxcbiAgICAgICAgSWd4Q2FsZW5kYXJIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FsZW5kYXJNb250aERpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FsZW5kYXJZZWFyRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYWxlbmRhclN1YmhlYWRlclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYWxlbmRhclNjcm9sbE1vbnRoRGlyZWN0aXZlLFxuICAgICAgICBJZ3hNb250aHNWaWV3Q29tcG9uZW50LFxuICAgICAgICBJZ3hZZWFyc1ZpZXdDb21wb25lbnQsXG4gICAgICAgIElneE1vbnRoUGlja2VyQ29tcG9uZW50LFxuICAgICAgICBJZ3hNb250aFZpZXdTbG90c0NhbGVuZGFyLFxuICAgICAgICBJZ3hHZXRWaWV3RGF0ZUNhbGVuZGFyXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIElneENhbGVuZGFyQ29tcG9uZW50LFxuICAgICAgICBJZ3hEYXlzVmlld0NvbXBvbmVudCxcbiAgICAgICAgSWd4TW9udGhzVmlld0NvbXBvbmVudCxcbiAgICAgICAgSWd4WWVhcnNWaWV3Q29tcG9uZW50LFxuICAgICAgICBJZ3hNb250aFBpY2tlckNvbXBvbmVudCxcbiAgICAgICAgSWd4Q2FsZW5kYXJIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FsZW5kYXJNb250aERpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FsZW5kYXJZZWFyRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYWxlbmRhclN1YmhlYWRlclRlbXBsYXRlRGlyZWN0aXZlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgSWd4SWNvbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FsZW5kYXJNb2R1bGUgeyB9XG4iXX0=