import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IgxColumnResizingService } from './resizing.service';
import { IgxGridColumnResizerComponent } from './resizer.component';
import { IgxResizeHandleDirective } from './resize-handle.directive';
import { IgxColumnResizerDirective } from './resizer.directive';
import { IgxPivotColumnResizingService } from './pivot-grid/pivot-resizing.service';
import { IgxPivotResizeHandleDirective } from './pivot-grid/pivot-resize-handle.directive';
import { IgxPivotGridColumnResizerComponent } from './pivot-grid/pivot-resizer.component';
import * as i0 from "@angular/core";
export { IgxGridColumnResizerComponent } from './resizer.component';
export { IgxPivotGridColumnResizerComponent } from './pivot-grid/pivot-resizer.component';
export { IgxResizeHandleDirective } from './resize-handle.directive';
export { IgxPivotResizeHandleDirective } from './pivot-grid/pivot-resize-handle.directive';
export { IgxColumnResizerDirective } from './resizer.directive';
export class IgxGridResizingModule {
}
IgxGridResizingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridResizingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxGridResizingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridResizingModule, declarations: [IgxGridColumnResizerComponent,
        IgxResizeHandleDirective,
        IgxColumnResizerDirective,
        IgxPivotGridColumnResizerComponent,
        IgxPivotResizeHandleDirective], imports: [CommonModule], exports: [IgxGridColumnResizerComponent,
        IgxResizeHandleDirective,
        IgxColumnResizerDirective,
        IgxPivotGridColumnResizerComponent,
        IgxPivotResizeHandleDirective] });
IgxGridResizingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridResizingModule, providers: [
        IgxColumnResizingService,
        IgxPivotColumnResizingService
    ], imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridResizingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxGridColumnResizerComponent,
                        IgxResizeHandleDirective,
                        IgxColumnResizerDirective,
                        IgxPivotGridColumnResizerComponent,
                        IgxPivotResizeHandleDirective
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        IgxGridColumnResizerComponent,
                        IgxResizeHandleDirective,
                        IgxColumnResizerDirective,
                        IgxPivotGridColumnResizerComponent,
                        IgxPivotResizeHandleDirective
                    ],
                    providers: [
                        IgxColumnResizingService,
                        IgxPivotColumnResizingService
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9yZXNpemluZy9yZXNpemUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOztBQUUxRixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMzRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQXlCaEUsTUFBTSxPQUFPLHFCQUFxQjs7a0hBQXJCLHFCQUFxQjttSEFBckIscUJBQXFCLGlCQXJCMUIsNkJBQTZCO1FBQzdCLHdCQUF3QjtRQUN4Qix5QkFBeUI7UUFDekIsa0NBQWtDO1FBQ2xDLDZCQUE2QixhQUc3QixZQUFZLGFBR1osNkJBQTZCO1FBQzdCLHdCQUF3QjtRQUN4Qix5QkFBeUI7UUFDekIsa0NBQWtDO1FBQ2xDLDZCQUE2QjttSEFPeEIscUJBQXFCLGFBTG5CO1FBQ1Asd0JBQXdCO1FBQ3hCLDZCQUE2QjtLQUNoQyxZQWJRO1lBQ0wsWUFBWTtTQUNmOzJGQWFRLHFCQUFxQjtrQkF2QmpDLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLDZCQUE2Qjt3QkFDN0Isd0JBQXdCO3dCQUN4Qix5QkFBeUI7d0JBQ3pCLGtDQUFrQzt3QkFDbEMsNkJBQTZCO3FCQUNoQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTtxQkFDZjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsNkJBQTZCO3dCQUM3Qix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsa0NBQWtDO3dCQUNsQyw2QkFBNkI7cUJBQ2hDO29CQUNELFNBQVMsRUFBRTt3QkFDUCx3QkFBd0I7d0JBQ3hCLDZCQUE2QjtxQkFDaEM7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IElneENvbHVtblJlc2l6aW5nU2VydmljZSB9IGZyb20gJy4vcmVzaXppbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudCB9IGZyb20gJy4vcmVzaXplci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4UmVzaXplSGFuZGxlRGlyZWN0aXZlIH0gZnJvbSAnLi9yZXNpemUtaGFuZGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5SZXNpemVyRGlyZWN0aXZlIH0gZnJvbSAnLi9yZXNpemVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hQaXZvdENvbHVtblJlc2l6aW5nU2VydmljZSB9IGZyb20gJy4vcGl2b3QtZ3JpZC9waXZvdC1yZXNpemluZy5zZXJ2aWNlJztcbmltcG9ydCB7IElneFBpdm90UmVzaXplSGFuZGxlRGlyZWN0aXZlIH0gZnJvbSAnLi9waXZvdC1ncmlkL3Bpdm90LXJlc2l6ZS1oYW5kbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFBpdm90R3JpZENvbHVtblJlc2l6ZXJDb21wb25lbnQgfSBmcm9tICcuL3Bpdm90LWdyaWQvcGl2b3QtcmVzaXplci5jb21wb25lbnQnO1xuXG5leHBvcnQgeyBJZ3hHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudCB9IGZyb20gJy4vcmVzaXplci5jb21wb25lbnQnO1xuZXhwb3J0IHsgSWd4UGl2b3RHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudCB9IGZyb20gJy4vcGl2b3QtZ3JpZC9waXZvdC1yZXNpemVyLmNvbXBvbmVudCc7XG5leHBvcnQgeyBJZ3hSZXNpemVIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL3Jlc2l6ZS1oYW5kbGUuZGlyZWN0aXZlJztcbmV4cG9ydCB7IElneFBpdm90UmVzaXplSGFuZGxlRGlyZWN0aXZlIH0gZnJvbSAnLi9waXZvdC1ncmlkL3Bpdm90LXJlc2l6ZS1oYW5kbGUuZGlyZWN0aXZlJztcbmV4cG9ydCB7IElneENvbHVtblJlc2l6ZXJEaXJlY3RpdmUgfSBmcm9tICcuL3Jlc2l6ZXIuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4R3JpZENvbHVtblJlc2l6ZXJDb21wb25lbnQsXG4gICAgICAgIElneFJlc2l6ZUhhbmRsZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q29sdW1uUmVzaXplckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4UGl2b3RHcmlkQ29sdW1uUmVzaXplckNvbXBvbmVudCxcbiAgICAgICAgSWd4UGl2b3RSZXNpemVIYW5kbGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIElneEdyaWRDb2x1bW5SZXNpemVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hSZXNpemVIYW5kbGVEaXJlY3RpdmUsXG4gICAgICAgIElneENvbHVtblJlc2l6ZXJEaXJlY3RpdmUsXG4gICAgICAgIElneFBpdm90R3JpZENvbHVtblJlc2l6ZXJDb21wb25lbnQsXG4gICAgICAgIElneFBpdm90UmVzaXplSGFuZGxlRGlyZWN0aXZlXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSWd4Q29sdW1uUmVzaXppbmdTZXJ2aWNlLFxuICAgICAgICBJZ3hQaXZvdENvbHVtblJlc2l6aW5nU2VydmljZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZFJlc2l6aW5nTW9kdWxlIHt9XG4iXX0=