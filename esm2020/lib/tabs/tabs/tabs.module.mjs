import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxRippleModule } from '../../directives/ripple/ripple.directive';
import { IgxIconModule } from '../../icon/public_api';
import { IgxTabHeaderComponent } from './tab-header.component';
import { IgxTabHeaderIconDirective, IgxTabHeaderLabelDirective } from './tabs.directives';
import { IgxTabItemComponent } from './tab-item.component';
import { IgxTabContentComponent } from './tab-content.component';
import { IgxTabsComponent } from './tabs.component';
import { IgxPrefixModule } from '../../directives/prefix/prefix.directive';
import { IgxSuffixModule } from '../../directives/suffix/suffix.directive';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxTabsModule {
}
IgxTabsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxTabsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsModule, declarations: [IgxTabsComponent,
        IgxTabItemComponent,
        IgxTabHeaderComponent,
        IgxTabContentComponent,
        IgxTabHeaderLabelDirective,
        IgxTabHeaderIconDirective], imports: [CommonModule, IgxIconModule, IgxRippleModule, IgxPrefixModule, IgxSuffixModule], exports: [IgxTabsComponent,
        IgxTabItemComponent,
        IgxTabHeaderComponent,
        IgxTabContentComponent,
        IgxTabHeaderLabelDirective,
        IgxTabHeaderIconDirective,
        IgxPrefixModule,
        IgxSuffixModule] });
IgxTabsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsModule, imports: [[CommonModule, IgxIconModule, IgxRippleModule, IgxPrefixModule, IgxSuffixModule], IgxPrefixModule,
        IgxSuffixModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxTabsComponent,
                        IgxTabItemComponent,
                        IgxTabHeaderComponent,
                        IgxTabContentComponent,
                        IgxTabHeaderLabelDirective,
                        IgxTabHeaderIconDirective
                    ],
                    exports: [
                        IgxTabsComponent,
                        IgxTabItemComponent,
                        IgxTabHeaderComponent,
                        IgxTabContentComponent,
                        IgxTabHeaderLabelDirective,
                        IgxTabHeaderIconDirective,
                        IgxPrefixModule,
                        IgxSuffixModule
                    ],
                    imports: [CommonModule, IgxIconModule, IgxRippleModule, IgxPrefixModule, IgxSuffixModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvdGFicy90YWJzL3RhYnMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLHlCQUF5QixFQUFFLDBCQUEwQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDMUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7QUFFM0UsY0FBYztBQXNCZCxNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQW5CbEIsZ0JBQWdCO1FBQ2hCLG1CQUFtQjtRQUNuQixxQkFBcUI7UUFDckIsc0JBQXNCO1FBQ3RCLDBCQUEwQjtRQUMxQix5QkFBeUIsYUFZbkIsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsYUFUcEYsZ0JBQWdCO1FBQ2hCLG1CQUFtQjtRQUNuQixxQkFBcUI7UUFDckIsc0JBQXNCO1FBQ3RCLDBCQUEwQjtRQUMxQix5QkFBeUI7UUFDekIsZUFBZTtRQUNmLGVBQWU7MkdBSVYsYUFBYSxZQUZiLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxFQUhyRixlQUFlO1FBQ2YsZUFBZTsyRkFJVixhQUFhO2tCQXJCekIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsZ0JBQWdCO3dCQUNoQixtQkFBbUI7d0JBQ25CLHFCQUFxQjt3QkFDckIsc0JBQXNCO3dCQUN0QiwwQkFBMEI7d0JBQzFCLHlCQUF5QjtxQkFDNUI7b0JBQ0QsT0FBTyxFQUFHO3dCQUNOLGdCQUFnQjt3QkFDaEIsbUJBQW1CO3dCQUNuQixxQkFBcUI7d0JBQ3JCLHNCQUFzQjt3QkFDdEIsMEJBQTBCO3dCQUMxQix5QkFBeUI7d0JBQ3pCLGVBQWU7d0JBQ2YsZUFBZTtxQkFDbEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQztpQkFDNUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlL3JpcHBsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4SWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hUYWJIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL3RhYi1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneFRhYkhlYWRlckljb25EaXJlY3RpdmUsIElneFRhYkhlYWRlckxhYmVsRGlyZWN0aXZlIH0gZnJvbSAnLi90YWJzLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgSWd4VGFiSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vdGFiLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IElneFRhYkNvbnRlbnRDb21wb25lbnQgfSBmcm9tICcuL3RhYi1jb250ZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hUYWJzQ29tcG9uZW50IH0gZnJvbSAnLi90YWJzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hQcmVmaXhNb2R1bGUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3ByZWZpeC9wcmVmaXguZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFN1ZmZpeE1vZHVsZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvc3VmZml4L3N1ZmZpeC5kaXJlY3RpdmUnO1xuXG4vKiogQGhpZGRlbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4VGFic0NvbXBvbmVudCxcbiAgICAgICAgSWd4VGFiSXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4VGFiSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hUYWJDb250ZW50Q29tcG9uZW50LFxuICAgICAgICBJZ3hUYWJIZWFkZXJMYWJlbERpcmVjdGl2ZSxcbiAgICAgICAgSWd4VGFiSGVhZGVySWNvbkRpcmVjdGl2ZVxuICAgIF0sXG4gICAgZXhwb3J0czogIFtcbiAgICAgICAgSWd4VGFic0NvbXBvbmVudCxcbiAgICAgICAgSWd4VGFiSXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4VGFiSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hUYWJDb250ZW50Q29tcG9uZW50LFxuICAgICAgICBJZ3hUYWJIZWFkZXJMYWJlbERpcmVjdGl2ZSxcbiAgICAgICAgSWd4VGFiSGVhZGVySWNvbkRpcmVjdGl2ZSxcbiAgICAgICAgSWd4UHJlZml4TW9kdWxlLFxuICAgICAgICBJZ3hTdWZmaXhNb2R1bGVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIElneEljb25Nb2R1bGUsIElneFJpcHBsZU1vZHVsZSwgSWd4UHJlZml4TW9kdWxlLCBJZ3hTdWZmaXhNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIElneFRhYnNNb2R1bGUge1xufVxuIl19