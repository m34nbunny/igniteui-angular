import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxRippleModule } from '../../directives/ripple/ripple.directive';
import { IgxIconModule } from '../../icon/public_api';
import { IgxBottomNavHeaderComponent } from './bottom-nav-header.component';
import { IgxBottomNavHeaderIconDirective, IgxBottomNavHeaderLabelDirective } from './bottom-nav.directives';
import { IgxBottomNavItemComponent } from './bottom-nav-item.component';
import { IgxBottomNavContentComponent } from './bottom-nav-content.component';
import { IgxBottomNavComponent } from './bottom-nav.component';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxBottomNavModule {
}
IgxBottomNavModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBottomNavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxBottomNavModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBottomNavModule, declarations: [IgxBottomNavComponent,
        IgxBottomNavItemComponent,
        IgxBottomNavHeaderComponent,
        IgxBottomNavContentComponent,
        IgxBottomNavHeaderLabelDirective,
        IgxBottomNavHeaderIconDirective], imports: [CommonModule, IgxIconModule, IgxRippleModule], exports: [IgxBottomNavComponent,
        IgxBottomNavItemComponent,
        IgxBottomNavHeaderComponent,
        IgxBottomNavContentComponent,
        IgxBottomNavHeaderLabelDirective,
        IgxBottomNavHeaderIconDirective] });
IgxBottomNavModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBottomNavModule, imports: [[CommonModule, IgxIconModule, IgxRippleModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBottomNavModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxBottomNavComponent,
                        IgxBottomNavItemComponent,
                        IgxBottomNavHeaderComponent,
                        IgxBottomNavContentComponent,
                        IgxBottomNavHeaderLabelDirective,
                        IgxBottomNavHeaderIconDirective
                    ],
                    exports: [
                        IgxBottomNavComponent,
                        IgxBottomNavItemComponent,
                        IgxBottomNavHeaderComponent,
                        IgxBottomNavContentComponent,
                        IgxBottomNavHeaderLabelDirective,
                        IgxBottomNavHeaderIconDirective
                    ],
                    imports: [CommonModule, IgxIconModule, IgxRippleModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLW5hdi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvdGFicy9ib3R0b20tbmF2L2JvdHRvbS1uYXYubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDNUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLGdDQUFnQyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDeEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDOUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBRS9ELGNBQWM7QUFvQmQsTUFBTSxPQUFPLGtCQUFrQjs7K0dBQWxCLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQWpCdkIscUJBQXFCO1FBQ3JCLHlCQUF5QjtRQUN6QiwyQkFBMkI7UUFDM0IsNEJBQTRCO1FBQzVCLGdDQUFnQztRQUNoQywrQkFBK0IsYUFVekIsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLGFBUGxELHFCQUFxQjtRQUNyQix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLDRCQUE0QjtRQUM1QixnQ0FBZ0M7UUFDaEMsK0JBQStCO2dIQUkxQixrQkFBa0IsWUFGbEIsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQzsyRkFFOUMsa0JBQWtCO2tCQW5COUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YscUJBQXFCO3dCQUNyQix5QkFBeUI7d0JBQ3pCLDJCQUEyQjt3QkFDM0IsNEJBQTRCO3dCQUM1QixnQ0FBZ0M7d0JBQ2hDLCtCQUErQjtxQkFDbEM7b0JBQ0QsT0FBTyxFQUFHO3dCQUNOLHFCQUFxQjt3QkFDckIseUJBQXlCO3dCQUN6QiwyQkFBMkI7d0JBQzNCLDRCQUE0Qjt3QkFDNUIsZ0NBQWdDO3dCQUNoQywrQkFBK0I7cUJBQ2xDO29CQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneEJvdHRvbU5hdkhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vYm90dG9tLW5hdi1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneEJvdHRvbU5hdkhlYWRlckljb25EaXJlY3RpdmUsIElneEJvdHRvbU5hdkhlYWRlckxhYmVsRGlyZWN0aXZlIH0gZnJvbSAnLi9ib3R0b20tbmF2LmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgSWd4Qm90dG9tTmF2SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vYm90dG9tLW5hdi1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hCb3R0b21OYXZDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9ib3R0b20tbmF2LWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IElneEJvdHRvbU5hdkNvbXBvbmVudCB9IGZyb20gJy4vYm90dG9tLW5hdi5jb21wb25lbnQnO1xuXG4vKiogQGhpZGRlbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4Qm90dG9tTmF2Q29tcG9uZW50LFxuICAgICAgICBJZ3hCb3R0b21OYXZJdGVtQ29tcG9uZW50LFxuICAgICAgICBJZ3hCb3R0b21OYXZIZWFkZXJDb21wb25lbnQsXG4gICAgICAgIElneEJvdHRvbU5hdkNvbnRlbnRDb21wb25lbnQsXG4gICAgICAgIElneEJvdHRvbU5hdkhlYWRlckxhYmVsRGlyZWN0aXZlLFxuICAgICAgICBJZ3hCb3R0b21OYXZIZWFkZXJJY29uRGlyZWN0aXZlXG4gICAgXSxcbiAgICBleHBvcnRzOiAgW1xuICAgICAgICBJZ3hCb3R0b21OYXZDb21wb25lbnQsXG4gICAgICAgIElneEJvdHRvbU5hdkl0ZW1Db21wb25lbnQsXG4gICAgICAgIElneEJvdHRvbU5hdkhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgSWd4Qm90dG9tTmF2Q29udGVudENvbXBvbmVudCxcbiAgICAgICAgSWd4Qm90dG9tTmF2SGVhZGVyTGFiZWxEaXJlY3RpdmUsXG4gICAgICAgIElneEJvdHRvbU5hdkhlYWRlckljb25EaXJlY3RpdmVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIElneEljb25Nb2R1bGUsIElneFJpcHBsZU1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4Qm90dG9tTmF2TW9kdWxlIHtcbn1cbiJdfQ==