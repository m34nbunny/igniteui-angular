import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxAvatarModule } from '../avatar/avatar.component';
import { IgxIconModule } from '../icon/public_api';
import { IgxChipComponent } from './chip.component';
import { IgxChipsAreaComponent } from './chips-area.component';
import { IgxDragDropModule } from '../directives/drag-drop/drag-drop.directive';
import { IgxPrefixModule, IgxPrefixDirective } from '../directives/prefix/prefix.directive';
import { IgxSuffixModule, IgxSuffixDirective } from '../directives/suffix/suffix.directive';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxChipsModule {
}
IgxChipsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxChipsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxChipsModule, declarations: [IgxChipsAreaComponent,
        IgxChipComponent], imports: [CommonModule,
        IgxRippleModule,
        IgxIconModule,
        IgxButtonModule,
        IgxAvatarModule,
        IgxDragDropModule,
        IgxPrefixModule,
        IgxSuffixModule], exports: [IgxChipsAreaComponent,
        IgxChipComponent,
        IgxPrefixDirective,
        IgxSuffixDirective] });
IgxChipsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxChipsModule, imports: [[
            CommonModule,
            IgxRippleModule,
            IgxIconModule,
            IgxButtonModule,
            IgxAvatarModule,
            IgxDragDropModule,
            IgxPrefixModule,
            IgxSuffixModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxChipsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxChipsAreaComponent,
                        IgxChipComponent
                    ],
                    exports: [
                        IgxChipsAreaComponent,
                        IgxChipComponent,
                        IgxPrefixDirective,
                        IgxSuffixDirective
                    ],
                    imports: [
                        CommonModule,
                        IgxRippleModule,
                        IgxIconModule,
                        IgxButtonModule,
                        IgxAvatarModule,
                        IgxDragDropModule,
                        IgxPrefixModule,
                        IgxSuffixModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NoaXBzL2NoaXBzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQzs7QUFFNUY7O0dBRUc7QUF1QkgsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkFwQnZCLHFCQUFxQjtRQUNyQixnQkFBZ0IsYUFTaEIsWUFBWTtRQUNaLGVBQWU7UUFDZixhQUFhO1FBQ2IsZUFBZTtRQUNmLGVBQWU7UUFDZixpQkFBaUI7UUFDakIsZUFBZTtRQUNmLGVBQWUsYUFiZixxQkFBcUI7UUFDckIsZ0JBQWdCO1FBQ2hCLGtCQUFrQjtRQUNsQixrQkFBa0I7NEdBYVQsY0FBYyxZQVhoQjtZQUNQLFlBQVk7WUFDWixlQUFlO1lBQ2YsYUFBYTtZQUNiLGVBQWU7WUFDZixlQUFlO1lBQ2YsaUJBQWlCO1lBQ2pCLGVBQWU7WUFDZixlQUFlO1NBQ2hCOzJGQUVVLGNBQWM7a0JBdEIxQixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWixxQkFBcUI7d0JBQ3JCLGdCQUFnQjtxQkFDakI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLHFCQUFxQjt3QkFDckIsZ0JBQWdCO3dCQUNoQixrQkFBa0I7d0JBQ2xCLGtCQUFrQjtxQkFDbkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixhQUFhO3dCQUNiLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLGVBQWU7d0JBQ2YsZUFBZTtxQkFDaEI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvcmlwcGxlL3JpcHBsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4QnV0dG9uTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9idXR0b24vYnV0dG9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hBdmF0YXJNb2R1bGUgfSBmcm9tICcuLi9hdmF0YXIvYXZhdGFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneENoaXBDb21wb25lbnQgfSBmcm9tICcuL2NoaXAuY29tcG9uZW50JztcbmltcG9ydCB7IElneENoaXBzQXJlYUNvbXBvbmVudCB9IGZyb20gJy4vY2hpcHMtYXJlYS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4RHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2RyYWctZHJvcC9kcmFnLWRyb3AuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFByZWZpeE1vZHVsZSwgSWd4UHJlZml4RGlyZWN0aXZlfSBmcm9tICcuLi9kaXJlY3RpdmVzL3ByZWZpeC9wcmVmaXguZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFN1ZmZpeE1vZHVsZSwgSWd4U3VmZml4RGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9zdWZmaXgvc3VmZml4LmRpcmVjdGl2ZSc7XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBJZ3hDaGlwc0FyZWFDb21wb25lbnQsXG4gICAgSWd4Q2hpcENvbXBvbmVudFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgSWd4Q2hpcHNBcmVhQ29tcG9uZW50LFxuICAgIElneENoaXBDb21wb25lbnQsXG4gICAgSWd4UHJlZml4RGlyZWN0aXZlLFxuICAgIElneFN1ZmZpeERpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIElneFJpcHBsZU1vZHVsZSxcbiAgICBJZ3hJY29uTW9kdWxlLFxuICAgIElneEJ1dHRvbk1vZHVsZSxcbiAgICBJZ3hBdmF0YXJNb2R1bGUsXG4gICAgSWd4RHJhZ0Ryb3BNb2R1bGUsXG4gICAgSWd4UHJlZml4TW9kdWxlLFxuICAgIElneFN1ZmZpeE1vZHVsZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIElneENoaXBzTW9kdWxlIHsgfVxuIl19