import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IgxOverlayService } from '../../services/overlay/overlay';
import { IgxTooltipTargetDirective } from './tooltip-target.directive';
import { IgxTooltipComponent } from './tooltip.component';
import { IgxTooltipDirective } from './tooltip.directive';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxTooltipModule {
}
IgxTooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxTooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTooltipModule, declarations: [IgxTooltipDirective, IgxTooltipTargetDirective, IgxTooltipComponent], imports: [CommonModule], exports: [IgxTooltipDirective, IgxTooltipTargetDirective] });
IgxTooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTooltipModule, providers: [IgxOverlayService], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxTooltipDirective, IgxTooltipTargetDirective, IgxTooltipComponent],
                    exports: [IgxTooltipDirective, IgxTooltipTargetDirective],
                    imports: [CommonModule],
                    providers: [IgxOverlayService]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZGlyZWN0aXZlcy90b29sdGlwL3Rvb2x0aXAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQUUxRDs7R0FFRztBQU9ILE1BQU0sT0FBTyxnQkFBZ0I7OzZHQUFoQixnQkFBZ0I7OEdBQWhCLGdCQUFnQixpQkFMVixtQkFBbUIsRUFBRSx5QkFBeUIsRUFBRSxtQkFBbUIsYUFFeEUsWUFBWSxhQURaLG1CQUFtQixFQUFFLHlCQUF5Qjs4R0FJL0MsZ0JBQWdCLGFBRmQsQ0FBQyxpQkFBaUIsQ0FBQyxZQURyQixDQUFDLFlBQVksQ0FBQzsyRkFHZCxnQkFBZ0I7a0JBTjNCLFFBQVE7bUJBQUM7b0JBQ1AsWUFBWSxFQUFFLENBQUMsbUJBQW1CLEVBQUUseUJBQXlCLEVBQUUsbUJBQW1CLENBQUM7b0JBQ25GLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLHlCQUF5QixDQUFDO29CQUN6RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2lCQUNqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4T3ZlcmxheVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9vdmVybGF5L292ZXJsYXknO1xuaW1wb3J0IHsgSWd4VG9vbHRpcFRhcmdldERpcmVjdGl2ZSB9IGZyb20gJy4vdG9vbHRpcC10YXJnZXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFRvb2x0aXBDb21wb25lbnQgfSBmcm9tICcuL3Rvb2x0aXAuY29tcG9uZW50JztcbmltcG9ydCB7IElneFRvb2x0aXBEaXJlY3RpdmUgfSBmcm9tICcuL3Rvb2x0aXAuZGlyZWN0aXZlJztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbiBATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0lneFRvb2x0aXBEaXJlY3RpdmUsIElneFRvb2x0aXBUYXJnZXREaXJlY3RpdmUsIElneFRvb2x0aXBDb21wb25lbnRdLFxuICAgIGV4cG9ydHM6IFtJZ3hUb29sdGlwRGlyZWN0aXZlLCBJZ3hUb29sdGlwVGFyZ2V0RGlyZWN0aXZlXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBwcm92aWRlcnM6IFtJZ3hPdmVybGF5U2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4VG9vbHRpcE1vZHVsZSB7IH0iXX0=