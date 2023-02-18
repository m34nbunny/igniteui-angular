import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, LOCALE_ID, Optional, Output, QueryList, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { DisplayDensityToken } from '../../core/displayDensity';
import { IgxHierarchicalGridBaseDirective } from './hierarchical-grid-base.directive';
import { IgxGridSelectionService } from '../selection/selection.service';
import { IgxOverlayService } from '../../services/public_api';
import { first, filter, takeUntil, pluck } from 'rxjs/operators';
import { IgxColumnComponent } from '../columns/column.component';
import { IgxRowIslandAPIService } from './row-island-api.service';
import { IGX_GRID_SERVICE_BASE } from '../common/grid.interface';
import { IgxGridToolbarDirective } from '../toolbar/common';
import { IgxActionStripComponent } from '../../action-strip/action-strip.component';
import { IgxPaginatorDirective } from '../../paginator/paginator-interfaces';
import * as i0 from "@angular/core";
import * as i1 from "../selection/selection.service";
import * as i2 from "../resizing/resizing.service";
import * as i3 from "../../services/transaction/transaction-factory.service";
import * as i4 from "./hierarchical-grid-navigation.service";
import * as i5 from "../filtering/grid-filtering.service";
import * as i6 from "../summaries/grid-summary.service";
import * as i7 from "./row-island-api.service";
import * as i8 from "../../core/utils";
import * as i9 from "./hierarchical-grid-api.service";
import * as i10 from "../../services/public_api";
export class IgxRowIslandComponent extends IgxHierarchicalGridBaseDirective {
    constructor(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, moduleRef, injector, appRef, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, rowIslandAPI, localeId, platform) {
        super(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform);
        this.selectionService = selectionService;
        this.colResizingService = colResizingService;
        this.transactionFactory = transactionFactory;
        this.document = document;
        this.overlayService = overlayService;
        this.summaryService = summaryService;
        this._displayDensityOptions = _displayDensityOptions;
        this.rowIslandAPI = rowIslandAPI;
        this.platform = platform;
        /**
         * @hidden
         */
        this.children = new QueryList();
        /**
         * @hidden
         */
        this.childColumns = new QueryList();
        /**
         * @hidden
         */
        this.layoutChange = new EventEmitter();
        /**
         * Event emmited when a grid is being created based on this row island.
         * ```html
         * <igx-hierarchical-grid [data]="Data" [autoGenerate]="true">
         *      <igx-row-island [key]="'childData'" (gridCreated)="gridCreated($event)" #rowIsland>
         *          <!-- ... -->
         *      </igx-row-island>
         * </igx-hierarchical-grid>
         * ```
         *
         * @memberof IgxRowIslandComponent
         */
        this.gridCreated = new EventEmitter();
        /**
         * Emitted after a grid is being initialized for this row island.
         * The emitting is done in `ngAfterViewInit`.
         * ```html
         * <igx-hierarchical-grid [data]="Data" [autoGenerate]="true">
         *      <igx-row-island [key]="'childData'" (gridInitialized)="gridInitialized($event)" #rowIsland>
         *          <!-- ... -->
         *      </igx-row-island>
         * </igx-hierarchical-grid>
         * ```
         *
         * @memberof IgxRowIslandComponent
         */
        this.gridInitialized = new EventEmitter();
        /**
         * @hidden
         */
        this.initialChanges = [];
        /**
         * @hidden
         */
        this.rootGrid = null;
        this.layout_id = `igx-row-island-`;
        this.isInit = false;
    }
    /**
     * Sets if all immediate children of the grids for this `IgxRowIslandComponent` should be expanded/collapsed.
     * ```html
     * <igx-hierarchical-grid [data]="Data" [autoGenerate]="true">
     *      <igx-row-island [key]="'childData'" [expandChildren]="true" #rowIsland>
     *          <!-- ... -->
     *      </igx-row-island>
     * </igx-hierarchical-grid>
     * ```
     *
     * @memberof IgxRowIslandComponent
     */
    set expandChildren(value) {
        this._defaultExpandState = value;
        this.rowIslandAPI.getChildGrids().forEach((grid) => {
            if (document.body.contains(grid.nativeElement)) {
                // Detect changes right away if the grid is visible
                grid.expandChildren = value;
                grid.cdr.detectChanges();
            }
            else {
                // Else defer the detection on changes when the grid gets into view for performance.
                grid.updateOnRender = true;
            }
        });
    }
    /**
     * Gets if all immediate children of the grids for this `IgxRowIslandComponent` have been set to be expanded/collapsed.
     * ```typescript
     * const expanded = this.rowIsland.expandChildren;
     * ```
     *
     * @memberof IgxRowIslandComponent
     */
    get expandChildren() {
        return this._defaultExpandState;
    }
    /**
     * @hidden
     */
    get id() {
        const pId = this.parentId ? this.parentId.substring(this.parentId.indexOf(this.layout_id) + this.layout_id.length) + '-' : '';
        return this.layout_id + pId + this.key;
    }
    /**
     * @hidden
     */
    get parentId() {
        return this.parentIsland ? this.parentIsland.id : null;
    }
    /**
     * @hidden
     */
    get level() {
        let ptr = this.parentIsland;
        let lvl = 0;
        while (ptr) {
            lvl++;
            ptr = ptr.parentIsland;
        }
        return lvl + 1;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.filteringService.grid = this;
        this.rootGrid = this.gridAPI.grid;
        this.rowIslandAPI.rowIsland = this;
        this.ri_columnListDiffer = this.differs.find([]).create(null);
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this.updateChildren();
        this.children.notifyOnChanges();
        this.children.changes.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.updateChildren();
            // update existing grids since their child ri have been changed.
            this.getGridsForIsland(this.key).forEach(grid => {
                grid.onRowIslandChange(this.children);
            });
        });
        const nestedColumns = this.children.map((layout) => layout.columnList.toArray());
        const colsArray = [].concat.apply([], nestedColumns);
        const topCols = this.columnList.filter((item) => colsArray.indexOf(item) === -1);
        this.childColumns.reset(topCols);
        this.columnList.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            Promise.resolve().then(() => {
                this.updateColumnList();
            });
        });
        // handle column changes so that they are passed to child grid instances when columnChange is emitted.
        this.ri_columnListDiffer.diff(this.childColumns);
        this.childColumns.toArray().forEach(x => x.columnChange.pipe(takeUntil(x.destroy$)).subscribe(() => this.updateColumnList()));
        this.childColumns.changes.pipe(takeUntil(this.destroy$)).subscribe((change) => {
            const diff = this.ri_columnListDiffer.diff(change);
            if (diff) {
                diff.forEachAddedItem((record) => {
                    record.item.columnChange.pipe(takeUntil(record.item.destroy$)).subscribe(() => this.updateColumnList());
                });
            }
        });
        this.actionStrip = this.actionStrips.first;
        if (this.actionStrip) {
            this.actionStrip.menuOverlaySettings.outlet = this.outlet;
        }
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        this.rowIslandAPI.register(this);
        if (this.parentIsland) {
            this.parentIsland.rowIslandAPI.registerChildRowIsland(this);
        }
        else {
            this.rootGrid.gridAPI.registerChildRowIsland(this);
        }
        this._init = false;
        // Create the child toolbar if the parent island has a toolbar definition
        this.gridCreated.pipe(pluck('grid'), takeUntil(this.destroy$)).subscribe(grid => {
            grid.rendered$.pipe(first(), filter(() => !!this.islandToolbarTemplate))
                .subscribe(() => grid.toolbarOutlet.createEmbeddedView(this.islandToolbarTemplate, { $implicit: grid }));
            grid.rendered$.pipe(first(), filter(() => !!this.islandPaginatorTemplate))
                .subscribe(() => {
                this.rootGrid.paginatorList.changes.pipe(takeUntil(this.destroy$)).subscribe(() => grid.setUpPaginator());
                grid.paginatorOutlet.createEmbeddedView(this.islandPaginatorTemplate);
            });
        });
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        this.layoutChange.emit(changes);
        if (!this.isInit) {
            this.initialChanges.push(changes);
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        // Override the base destroy because we don't have rendered anything to use removeEventListener on
        this.destroy$.next(true);
        this.destroy$.complete();
        this._destroyed = true;
        this.rowIslandAPI.unset(this.id);
        if (this.parentIsland) {
            this.getGridsForIsland(this.key).forEach(grid => {
                this.cleanGridState(grid);
                grid.gridAPI.unsetChildRowIsland(this);
            });
            this.parentIsland.rowIslandAPI.unsetChildRowIsland(this);
        }
        else {
            this.rootGrid.gridAPI.unsetChildRowIsland(this);
            this.cleanGridState(this.rootGrid);
        }
    }
    /**
     * @hidden
     */
    reflow() { }
    /**
     * @hidden
     */
    calculateGridHeight() { }
    updateColumnList() {
        const nestedColumns = this.children.map((layout) => layout.columnList.toArray());
        const colsArray = [].concat.apply([], nestedColumns);
        const topCols = this.columnList.filter((item) => {
            if (colsArray.indexOf(item) === -1) {
                /* Reset the default width of the columns that come into this row island,
                because the root catches them first during the detectChanges() and sets their defaultWidth. */
                item.defaultWidth = undefined;
                return true;
            }
            return false;
        });
        this.childColumns.reset(topCols);
        if (this.parentIsland) {
            this.parentIsland.columnList.notifyOnChanges();
        }
        else {
            this.rootGrid.columnList.notifyOnChanges();
        }
        this.rowIslandAPI.getChildGrids().forEach((grid) => {
            grid.createColumnsList(this.childColumns.toArray());
            if (!document.body.contains(grid.nativeElement)) {
                grid.updateOnRender = true;
            }
        });
    }
    updateChildren() {
        if (this.children.first === this) {
            this.children.reset(this.children.toArray().slice(1));
        }
        this.children.forEach(child => {
            child.parentIsland = this;
        });
    }
    cleanGridState(grid) {
        grid.childGridTemplates.forEach((tmpl) => {
            tmpl.owner.cleanView(tmpl.context.templateID);
        });
        grid.childGridTemplates.clear();
        grid.onRowIslandChange();
    }
}
IgxRowIslandComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRowIslandComponent, deps: [{ token: i1.IgxGridSelectionService }, { token: i2.IgxColumnResizingService }, { token: IGX_GRID_SERVICE_BASE }, { token: i3.IgxFlatTransactionFactory }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }, { token: i0.IterableDiffers }, { token: i0.ViewContainerRef }, { token: i0.NgModuleRef }, { token: i0.Injector }, { token: i0.ApplicationRef }, { token: i4.IgxHierarchicalGridNavigationService }, { token: i5.IgxFilteringService }, { token: IgxOverlayService }, { token: i6.IgxGridSummaryService }, { token: DisplayDensityToken, optional: true }, { token: i7.IgxRowIslandAPIService }, { token: LOCALE_ID }, { token: i8.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxRowIslandComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxRowIslandComponent, selector: "igx-row-island", inputs: { key: "key", expandChildren: "expandChildren" }, outputs: { layoutChange: "layoutChange", gridCreated: "gridCreated", gridInitialized: "gridInitialized" }, providers: [
        IgxRowIslandAPIService,
        IgxFilteringService,
        IgxGridSelectionService
    ], queries: [{ propertyName: "islandToolbarTemplate", first: true, predicate: IgxGridToolbarDirective, descendants: true, read: TemplateRef }, { propertyName: "islandPaginatorTemplate", first: true, predicate: IgxPaginatorDirective, descendants: true, read: TemplateRef }, { propertyName: "children", predicate: IgxRowIslandComponent, read: IgxRowIslandComponent }, { propertyName: "childColumns", predicate: IgxColumnComponent, read: IgxColumnComponent }, { propertyName: "actionStrips", predicate: IgxActionStripComponent, read: IgxActionStripComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: ``, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxRowIslandComponent, decorators: [{
            type: Component,
            args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    selector: 'igx-row-island',
                    template: ``,
                    providers: [
                        IgxRowIslandAPIService,
                        IgxFilteringService,
                        IgxGridSelectionService
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i1.IgxGridSelectionService }, { type: i2.IgxColumnResizingService }, { type: i9.IgxHierarchicalGridAPIService, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_SERVICE_BASE]
                }] }, { type: i3.IgxFlatTransactionFactory }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }, { type: i0.IterableDiffers }, { type: i0.ViewContainerRef }, { type: i0.NgModuleRef }, { type: i0.Injector }, { type: i0.ApplicationRef }, { type: i4.IgxHierarchicalGridNavigationService }, { type: i5.IgxFilteringService }, { type: i10.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }, { type: i6.IgxGridSummaryService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: i7.IgxRowIslandAPIService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i8.PlatformUtil }]; }, propDecorators: { key: [{
                type: Input
            }], children: [{
                type: ContentChildren,
                args: [IgxRowIslandComponent, { read: IgxRowIslandComponent, descendants: false }]
            }], childColumns: [{
                type: ContentChildren,
                args: [IgxColumnComponent, { read: IgxColumnComponent, descendants: false }]
            }], islandToolbarTemplate: [{
                type: ContentChild,
                args: [IgxGridToolbarDirective, { read: TemplateRef }]
            }], islandPaginatorTemplate: [{
                type: ContentChild,
                args: [IgxPaginatorDirective, { read: TemplateRef }]
            }], actionStrips: [{
                type: ContentChildren,
                args: [IgxActionStripComponent, { read: IgxActionStripComponent, descendants: false }]
            }], layoutChange: [{
                type: Output
            }], gridCreated: [{
                type: Output
            }], gridInitialized: [{
                type: Output
            }], expandChildren: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWlzbGFuZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvaGllcmFyY2hpY2FsLWdyaWQvcm93LWlzbGFuZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUlILHVCQUF1QixFQUV2QixTQUFTLEVBRVQsWUFBWSxFQUNaLGVBQWUsRUFFZixZQUFZLEVBQ1osTUFBTSxFQUVOLEtBQUssRUFHTCxTQUFTLEVBTVQsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUVkLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMxRSxPQUFPLEVBQTBCLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFeEYsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFFdEYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBR2xFLE9BQU8sRUFBWSxxQkFBcUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNFLE9BQU8sRUFBRSx1QkFBdUIsRUFBaUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRixPQUFPLEVBQUUsdUJBQXVCLEVB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RUFBRSxXQUFXLEVBQUU7Z0JBSW5ELFlBQVk7c0JBRGxCLGVBQWU7dUJBQUMsdUJBQXVCLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRTtnQkFPeEYsWUFBWTtzQkFEbEIsTUFBTTtnQkFnQkEsV0FBVztzQkFEakIsTUFBTTtnQkFpQkEsZUFBZTtzQkFEckIsTUFBTTtnQkFnQ0ksY0FBYztzQkFEeEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIEFwcGxpY2F0aW9uUmVmLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQ29udGVudENoaWxkLFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbmplY3QsXG4gICAgSW5qZWN0b3IsXG4gICAgSW5wdXQsXG4gICAgSXRlcmFibGVDaGFuZ2VSZWNvcmQsXG4gICAgSXRlcmFibGVEaWZmZXJzLFxuICAgIExPQ0FMRV9JRCxcbiAgICBOZ01vZHVsZVJlZixcbiAgICBOZ1pvbmUsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3B0aW9uYWwsXG4gICAgT3V0cHV0LFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4SGllcmFyY2hpY2FsR3JpZEFQSVNlcnZpY2UgfSBmcm9tICcuL2hpZXJhcmNoaWNhbC1ncmlkLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IElneEZpbHRlcmluZ1NlcnZpY2UgfSBmcm9tICcuLi9maWx0ZXJpbmcvZ3JpZC1maWx0ZXJpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJRGlzcGxheURlbnNpdHlPcHRpb25zLCBEaXNwbGF5RGVuc2l0eVRva2VuIH0gZnJvbSAnLi4vLi4vY29yZS9kaXNwbGF5RGVuc2l0eSc7XG5pbXBvcnQgeyBJZ3hHcmlkU3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi9zdW1tYXJpZXMvZ3JpZC1zdW1tYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4SGllcmFyY2hpY2FsR3JpZEJhc2VEaXJlY3RpdmUgfSBmcm9tICcuL2hpZXJhcmNoaWNhbC1ncmlkLWJhc2UuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEhpZXJhcmNoaWNhbEdyaWROYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vaGllcmFyY2hpY2FsLWdyaWQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElneEdyaWRTZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElneE92ZXJsYXlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBmaXJzdCwgZmlsdGVyLCB0YWtlVW50aWwsIHBsdWNrIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSWd4Q29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi4vY29sdW1ucy9jb2x1bW4uY29tcG9uZW50JztcbmltcG9ydCB7IElneFJvd0lzbGFuZEFQSVNlcnZpY2UgfSBmcm9tICcuL3Jvdy1pc2xhbmQtYXBpLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJZ3hDb2x1bW5SZXNpemluZ1NlcnZpY2UgfSBmcm9tICcuLi9yZXNpemluZy9yZXNpemluZy5zZXJ2aWNlJztcbmltcG9ydCB7IEdyaWRUeXBlLCBJR1hfR1JJRF9TRVJWSUNFX0JBU0UgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSWd4R3JpZFRvb2xiYXJEaXJlY3RpdmUsIElneEdyaWRUb29sYmFyVGVtcGxhdGVDb250ZXh0IH0gZnJvbSAnLi4vdG9vbGJhci9jb21tb24nO1xuaW1wb3J0IHsgSWd4QWN0aW9uU3RyaXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hY3Rpb24tc3RyaXAvYWN0aW9uLXN0cmlwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hQYWdpbmF0b3JEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9wYWdpbmF0b3IvcGFnaW5hdG9yLWludGVyZmFjZXMnO1xuaW1wb3J0IHsgSWd4RmxhdFRyYW5zYWN0aW9uRmFjdG9yeSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zYWN0aW9uL3RyYW5zYWN0aW9uLWZhY3Rvcnkuc2VydmljZSc7XG5pbXBvcnQgeyBJR3JpZENyZWF0ZWRFdmVudEFyZ3MgfSBmcm9tICcuL2V2ZW50cyc7XG5cbkBDb21wb25lbnQoe1xuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHNlbGVjdG9yOiAnaWd4LXJvdy1pc2xhbmQnLFxuICAgIHRlbXBsYXRlOiBgYCxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSWd4Um93SXNsYW5kQVBJU2VydmljZSxcbiAgICAgICAgSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgSWd4R3JpZFNlbGVjdGlvblNlcnZpY2VcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneFJvd0lzbGFuZENvbXBvbmVudCBleHRlbmRzIElneEhpZXJhcmNoaWNhbEdyaWRCYXNlRGlyZWN0aXZlXG4gICAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBrZXkgb2YgdGhlIHJvdyBpc2xhbmQgYnkgd2hpY2ggY2hpbGQgZGF0YSB3b3VsZCBiZSB0YWtlbiBmcm9tIHRoZSByb3cgZGF0YSBpZiBzdWNoIGlzIHByb3ZpZGVkLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWhpZXJhcmNoaWNhbC1ncmlkIFtkYXRhXT1cIkRhdGFcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIj5cbiAgICAgKiAgICAgIDxpZ3gtcm93LWlzbGFuZCBba2V5XT1cIidjaGlsZERhdGEnXCI+XG4gICAgICogICAgICAgICAgPCEtLSAuLi4gLS0+XG4gICAgICogICAgICA8L2lneC1yb3ctaXNsYW5kPlxuICAgICAqIDwvaWd4LWhpZXJhcmNoaWNhbC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJvd0lzbGFuZENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGtleTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4Um93SXNsYW5kQ29tcG9uZW50LCB7IHJlYWQ6IElneFJvd0lzbGFuZENvbXBvbmVudCwgZGVzY2VuZGFudHM6IGZhbHNlIH0pXG4gICAgcHVibGljIGNoaWxkcmVuID0gbmV3IFF1ZXJ5TGlzdDxJZ3hSb3dJc2xhbmRDb21wb25lbnQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJZ3hDb2x1bW5Db21wb25lbnQsIHsgcmVhZDogSWd4Q29sdW1uQ29tcG9uZW50LCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgY2hpbGRDb2x1bW5zID0gbmV3IFF1ZXJ5TGlzdDxJZ3hDb2x1bW5Db21wb25lbnQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkKElneEdyaWRUb29sYmFyRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGlzbGFuZFRvb2xiYXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8SWd4R3JpZFRvb2xiYXJUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gICAgQENvbnRlbnRDaGlsZChJZ3hQYWdpbmF0b3JEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgaXNsYW5kUGFnaW5hdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBAQ29udGVudENoaWxkcmVuKElneEFjdGlvblN0cmlwQ29tcG9uZW50LCB7IHJlYWQ6IElneEFjdGlvblN0cmlwQ29tcG9uZW50LCBkZXNjZW5kYW50czogZmFsc2UgfSlcbiAgICBwdWJsaWMgYWN0aW9uU3RyaXBzOiBRdWVyeUxpc3Q8SWd4QWN0aW9uU3RyaXBDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBsYXlvdXRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGVtbWl0ZWQgd2hlbiBhIGdyaWQgaXMgYmVpbmcgY3JlYXRlZCBiYXNlZCBvbiB0aGlzIHJvdyBpc2xhbmQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPlxuICAgICAqICAgICAgPGlneC1yb3ctaXNsYW5kIFtrZXldPVwiJ2NoaWxkRGF0YSdcIiAoZ3JpZENyZWF0ZWQpPVwiZ3JpZENyZWF0ZWQoJGV2ZW50KVwiICNyb3dJc2xhbmQ+XG4gICAgICogICAgICAgICAgPCEtLSAuLi4gLS0+XG4gICAgICogICAgICA8L2lneC1yb3ctaXNsYW5kPlxuICAgICAqIDwvaWd4LWhpZXJhcmNoaWNhbC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJvd0lzbGFuZENvbXBvbmVudFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBncmlkQ3JlYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUdyaWRDcmVhdGVkRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBhZnRlciBhIGdyaWQgaXMgYmVpbmcgaW5pdGlhbGl6ZWQgZm9yIHRoaXMgcm93IGlzbGFuZC5cbiAgICAgKiBUaGUgZW1pdHRpbmcgaXMgZG9uZSBpbiBgbmdBZnRlclZpZXdJbml0YC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1oaWVyYXJjaGljYWwtZ3JpZCBbZGF0YV09XCJEYXRhXCIgW2F1dG9HZW5lcmF0ZV09XCJ0cnVlXCI+XG4gICAgICogICAgICA8aWd4LXJvdy1pc2xhbmQgW2tleV09XCInY2hpbGREYXRhJ1wiIChncmlkSW5pdGlhbGl6ZWQpPVwiZ3JpZEluaXRpYWxpemVkKCRldmVudClcIiAjcm93SXNsYW5kPlxuICAgICAqICAgICAgICAgIDwhLS0gLi4uIC0tPlxuICAgICAqICAgICAgPC9pZ3gtcm93LWlzbGFuZD5cbiAgICAgKiA8L2lneC1oaWVyYXJjaGljYWwtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hSb3dJc2xhbmRDb21wb25lbnRcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZ3JpZEluaXRpYWxpemVkID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JpZENyZWF0ZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGluaXRpYWxDaGFuZ2VzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJvb3RHcmlkOiBHcmlkVHlwZSA9IG51bGw7XG4gICAgcHVibGljIHJlYWRvbmx5IGRhdGE6IGFueVtdIHwgbnVsbDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZmlsdGVyZWREYXRhOiBhbnlbXTtcblxuICAgIHByaXZhdGUgcmlfY29sdW1uTGlzdERpZmZlcjtcbiAgICBwcml2YXRlIGxheW91dF9pZCA9IGBpZ3gtcm93LWlzbGFuZC1gO1xuICAgIHByaXZhdGUgaXNJbml0ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGlmIGFsbCBpbW1lZGlhdGUgY2hpbGRyZW4gb2YgdGhlIGdyaWRzIGZvciB0aGlzIGBJZ3hSb3dJc2xhbmRDb21wb25lbnRgIHNob3VsZCBiZSBleHBhbmRlZC9jb2xsYXBzZWQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgW2RhdGFdPVwiRGF0YVwiIFthdXRvR2VuZXJhdGVdPVwidHJ1ZVwiPlxuICAgICAqICAgICAgPGlneC1yb3ctaXNsYW5kIFtrZXldPVwiJ2NoaWxkRGF0YSdcIiBbZXhwYW5kQ2hpbGRyZW5dPVwidHJ1ZVwiICNyb3dJc2xhbmQ+XG4gICAgICogICAgICAgICAgPCEtLSAuLi4gLS0+XG4gICAgICogICAgICA8L2lneC1yb3ctaXNsYW5kPlxuICAgICAqIDwvaWd4LWhpZXJhcmNoaWNhbC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneFJvd0lzbGFuZENvbXBvbmVudFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBleHBhbmRDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kZWZhdWx0RXhwYW5kU3RhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5yb3dJc2xhbmRBUEkuZ2V0Q2hpbGRHcmlkcygpLmZvckVhY2goKGdyaWQpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGdyaWQubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAvLyBEZXRlY3QgY2hhbmdlcyByaWdodCBhd2F5IGlmIHRoZSBncmlkIGlzIHZpc2libGVcbiAgICAgICAgICAgICAgICBncmlkLmV4cGFuZENoaWxkcmVuID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgZ3JpZC5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBFbHNlIGRlZmVyIHRoZSBkZXRlY3Rpb24gb24gY2hhbmdlcyB3aGVuIHRoZSBncmlkIGdldHMgaW50byB2aWV3IGZvciBwZXJmb3JtYW5jZS5cbiAgICAgICAgICAgICAgICBncmlkLnVwZGF0ZU9uUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBpZiBhbGwgaW1tZWRpYXRlIGNoaWxkcmVuIG9mIHRoZSBncmlkcyBmb3IgdGhpcyBgSWd4Um93SXNsYW5kQ29tcG9uZW50YCBoYXZlIGJlZW4gc2V0IHRvIGJlIGV4cGFuZGVkL2NvbGxhcHNlZC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgZXhwYW5kZWQgPSB0aGlzLnJvd0lzbGFuZC5leHBhbmRDaGlsZHJlbjtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hSb3dJc2xhbmRDb21wb25lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGV4cGFuZENoaWxkcmVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmYXVsdEV4cGFuZFN0YXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlkKCkge1xuICAgICAgICBjb25zdCBwSWQgPSB0aGlzLnBhcmVudElkID8gdGhpcy5wYXJlbnRJZC5zdWJzdHJpbmcodGhpcy5wYXJlbnRJZC5pbmRleE9mKHRoaXMubGF5b3V0X2lkKSArIHRoaXMubGF5b3V0X2lkLmxlbmd0aCkgKyAnLScgOiAnJztcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5b3V0X2lkICsgcElkICsgdGhpcy5rZXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcGFyZW50SWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudElzbGFuZCA/IHRoaXMucGFyZW50SXNsYW5kLmlkIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBsZXZlbCgpIHtcbiAgICAgICAgbGV0IHB0ciA9IHRoaXMucGFyZW50SXNsYW5kO1xuICAgICAgICBsZXQgbHZsID0gMDtcbiAgICAgICAgd2hpbGUgKHB0cikge1xuICAgICAgICAgICAgbHZsKys7XG4gICAgICAgICAgICBwdHIgPSBwdHIucGFyZW50SXNsYW5kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsdmwgKyAxO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBjb2xSZXNpemluZ1NlcnZpY2U6IElneENvbHVtblJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9TRVJWSUNFX0JBU0UpIGdyaWRBUEk6IElneEhpZXJhcmNoaWNhbEdyaWRBUElTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgdHJhbnNhY3Rpb25GYWN0b3J5OiBJZ3hGbGF0VHJhbnNhY3Rpb25GYWN0b3J5LFxuICAgICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgem9uZTogTmdab25lLFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwdWJsaWMgZG9jdW1lbnQsXG4gICAgICAgIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgdmlld1JlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LFxuICAgICAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAgIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgICAgIG5hdmlnYXRpb246IElneEhpZXJhcmNoaWNhbEdyaWROYXZpZ2F0aW9uU2VydmljZSxcbiAgICAgICAgZmlsdGVyaW5nU2VydmljZTogSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgQEluamVjdChJZ3hPdmVybGF5U2VydmljZSkgcHJvdGVjdGVkIG92ZXJsYXlTZXJ2aWNlOiBJZ3hPdmVybGF5U2VydmljZSxcbiAgICAgICAgcHVibGljIHN1bW1hcnlTZXJ2aWNlOiBJZ3hHcmlkU3VtbWFyeVNlcnZpY2UsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRGlzcGxheURlbnNpdHlUb2tlbikgcHJvdGVjdGVkIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnM6IElEaXNwbGF5RGVuc2l0eU9wdGlvbnMsXG4gICAgICAgIHB1YmxpYyByb3dJc2xhbmRBUEk6IElneFJvd0lzbGFuZEFQSVNlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGVJZDogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCkge1xuICAgICAgICBzdXBlcihcbiAgICAgICAgICAgIHNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgICAgICBjb2xSZXNpemluZ1NlcnZpY2UsXG4gICAgICAgICAgICBncmlkQVBJLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25GYWN0b3J5LFxuICAgICAgICAgICAgZWxlbWVudFJlZixcbiAgICAgICAgICAgIHpvbmUsXG4gICAgICAgICAgICBkb2N1bWVudCxcbiAgICAgICAgICAgIGNkcixcbiAgICAgICAgICAgIHJlc29sdmVyLFxuICAgICAgICAgICAgZGlmZmVycyxcbiAgICAgICAgICAgIHZpZXdSZWYsXG4gICAgICAgICAgICBhcHBSZWYsXG4gICAgICAgICAgICBtb2R1bGVSZWYsXG4gICAgICAgICAgICBpbmplY3RvcixcbiAgICAgICAgICAgIG5hdmlnYXRpb24sXG4gICAgICAgICAgICBmaWx0ZXJpbmdTZXJ2aWNlLFxuICAgICAgICAgICAgb3ZlcmxheVNlcnZpY2UsXG4gICAgICAgICAgICBzdW1tYXJ5U2VydmljZSxcbiAgICAgICAgICAgIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnMsXG4gICAgICAgICAgICBsb2NhbGVJZCxcbiAgICAgICAgICAgIHBsYXRmb3JtXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmdyaWQgPSB0aGlzIGFzIEdyaWRUeXBlO1xuICAgICAgICB0aGlzLnJvb3RHcmlkID0gdGhpcy5ncmlkQVBJLmdyaWQ7XG4gICAgICAgIHRoaXMucm93SXNsYW5kQVBJLnJvd0lzbGFuZCA9IHRoaXM7XG4gICAgICAgIHRoaXMucmlfY29sdW1uTGlzdERpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKFtdKS5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ2hpbGRyZW4oKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDaGlsZHJlbigpO1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBleGlzdGluZyBncmlkcyBzaW5jZSB0aGVpciBjaGlsZCByaSBoYXZlIGJlZW4gY2hhbmdlZC5cbiAgICAgICAgICAgICAgICB0aGlzLmdldEdyaWRzRm9ySXNsYW5kKHRoaXMua2V5KS5mb3JFYWNoKGdyaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAoZ3JpZCBhcyBhbnkpLm9uUm93SXNsYW5kQ2hhbmdlKHRoaXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG5lc3RlZENvbHVtbnMgPSB0aGlzLmNoaWxkcmVuLm1hcCgobGF5b3V0KSA9PiBsYXlvdXQuY29sdW1uTGlzdC50b0FycmF5KCkpO1xuICAgICAgICBjb25zdCBjb2xzQXJyYXkgPSBbXS5jb25jYXQuYXBwbHkoW10sIG5lc3RlZENvbHVtbnMpO1xuICAgICAgICBjb25zdCB0b3BDb2xzID0gdGhpcy5jb2x1bW5MaXN0LmZpbHRlcigoaXRlbSkgPT4gY29sc0FycmF5LmluZGV4T2YoaXRlbSkgPT09IC0xKTtcbiAgICAgICAgdGhpcy5jaGlsZENvbHVtbnMucmVzZXQodG9wQ29scyk7XG4gICAgICAgIHRoaXMuY29sdW1uTGlzdC5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb2x1bW5MaXN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGNvbHVtbiBjaGFuZ2VzIHNvIHRoYXQgdGhleSBhcmUgcGFzc2VkIHRvIGNoaWxkIGdyaWQgaW5zdGFuY2VzIHdoZW4gY29sdW1uQ2hhbmdlIGlzIGVtaXR0ZWQuXG4gICAgICAgIHRoaXMucmlfY29sdW1uTGlzdERpZmZlci5kaWZmKHRoaXMuY2hpbGRDb2x1bW5zKTtcbiAgICAgICAgdGhpcy5jaGlsZENvbHVtbnMudG9BcnJheSgpLmZvckVhY2goeCA9PiB4LmNvbHVtbkNoYW5nZS5waXBlKHRha2VVbnRpbCh4LmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlQ29sdW1uTGlzdCgpKSk7XG4gICAgICAgIHRoaXMuY2hpbGRDb2x1bW5zLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoY2hhbmdlOiBRdWVyeUxpc3Q8SWd4Q29sdW1uQ29tcG9uZW50PikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMucmlfY29sdW1uTGlzdERpZmZlci5kaWZmKGNoYW5nZSk7XG4gICAgICAgICAgICBpZiAoZGlmZikge1xuICAgICAgICAgICAgICAgIGRpZmYuZm9yRWFjaEFkZGVkSXRlbSgocmVjb3JkOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxJZ3hDb2x1bW5Db21wb25lbnQ+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5pdGVtLmNvbHVtbkNoYW5nZS5waXBlKHRha2VVbnRpbChyZWNvcmQuaXRlbS5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUNvbHVtbkxpc3QoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFjdGlvblN0cmlwID0gdGhpcy5hY3Rpb25TdHJpcHMuZmlyc3Q7XG4gICAgICAgIGlmICh0aGlzLmFjdGlvblN0cmlwKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGlvblN0cmlwLm1lbnVPdmVybGF5U2V0dGluZ3Mub3V0bGV0ID0gdGhpcy5vdXRsZXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5yb3dJc2xhbmRBUEkucmVnaXN0ZXIodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudElzbGFuZCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRJc2xhbmQucm93SXNsYW5kQVBJLnJlZ2lzdGVyQ2hpbGRSb3dJc2xhbmQodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3RHcmlkLmdyaWRBUEkucmVnaXN0ZXJDaGlsZFJvd0lzbGFuZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjaGlsZCB0b29sYmFyIGlmIHRoZSBwYXJlbnQgaXNsYW5kIGhhcyBhIHRvb2xiYXIgZGVmaW5pdGlvblxuICAgICAgICB0aGlzLmdyaWRDcmVhdGVkLnBpcGUocGx1Y2soJ2dyaWQnKSwgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoZ3JpZCA9PiB7XG4gICAgICAgICAgICBncmlkLnJlbmRlcmVkJC5waXBlKGZpcnN0KCksIGZpbHRlcigoKSA9PiAhIXRoaXMuaXNsYW5kVG9vbGJhclRlbXBsYXRlKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IGdyaWQudG9vbGJhck91dGxldC5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5pc2xhbmRUb29sYmFyVGVtcGxhdGUsIHsgJGltcGxpY2l0OiBncmlkIH0pKTtcbiAgICAgICAgICAgIGdyaWQucmVuZGVyZWQkLnBpcGUoZmlyc3QoKSwgZmlsdGVyKCgpID0+ICEhdGhpcy5pc2xhbmRQYWdpbmF0b3JUZW1wbGF0ZSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdEdyaWQucGFnaW5hdG9yTGlzdC5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4gZ3JpZC5zZXRVcFBhZ2luYXRvcigpKTtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5wYWdpbmF0b3JPdXRsZXQuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuaXNsYW5kUGFnaW5hdG9yVGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5sYXlvdXRDaGFuZ2UuZW1pdChjaGFuZ2VzKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5pdCkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsQ2hhbmdlcy5wdXNoKGNoYW5nZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGJhc2UgZGVzdHJveSBiZWNhdXNlIHdlIGRvbid0IGhhdmUgcmVuZGVyZWQgYW55dGhpbmcgdG8gdXNlIHJlbW92ZUV2ZW50TGlzdGVuZXIgb25cbiAgICAgICAgdGhpcy5kZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMucm93SXNsYW5kQVBJLnVuc2V0KHRoaXMuaWQpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRJc2xhbmQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0R3JpZHNGb3JJc2xhbmQodGhpcy5rZXkpLmZvckVhY2goZ3JpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhbkdyaWRTdGF0ZShncmlkKTtcbiAgICAgICAgICAgICAgICBncmlkLmdyaWRBUEkudW5zZXRDaGlsZFJvd0lzbGFuZCh0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRJc2xhbmQucm93SXNsYW5kQVBJLnVuc2V0Q2hpbGRSb3dJc2xhbmQodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3RHcmlkLmdyaWRBUEkudW5zZXRDaGlsZFJvd0lzbGFuZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYW5HcmlkU3RhdGUodGhpcy5yb290R3JpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIHJlZmxvdygpIHsgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBjYWxjdWxhdGVHcmlkSGVpZ2h0KCkgeyB9XG5cbiAgICBwcm90ZWN0ZWQgdXBkYXRlQ29sdW1uTGlzdCgpIHtcbiAgICAgICAgY29uc3QgbmVzdGVkQ29sdW1ucyA9IHRoaXMuY2hpbGRyZW4ubWFwKChsYXlvdXQpID0+IGxheW91dC5jb2x1bW5MaXN0LnRvQXJyYXkoKSk7XG4gICAgICAgIGNvbnN0IGNvbHNBcnJheSA9IFtdLmNvbmNhdC5hcHBseShbXSwgbmVzdGVkQ29sdW1ucyk7XG4gICAgICAgIGNvbnN0IHRvcENvbHMgPSB0aGlzLmNvbHVtbkxpc3QuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29sc0FycmF5LmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLyogUmVzZXQgdGhlIGRlZmF1bHQgd2lkdGggb2YgdGhlIGNvbHVtbnMgdGhhdCBjb21lIGludG8gdGhpcyByb3cgaXNsYW5kLFxuICAgICAgICAgICAgICAgIGJlY2F1c2UgdGhlIHJvb3QgY2F0Y2hlcyB0aGVtIGZpcnN0IGR1cmluZyB0aGUgZGV0ZWN0Q2hhbmdlcygpIGFuZCBzZXRzIHRoZWlyIGRlZmF1bHRXaWR0aC4gKi9cbiAgICAgICAgICAgICAgICBpdGVtLmRlZmF1bHRXaWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2hpbGRDb2x1bW5zLnJlc2V0KHRvcENvbHMpO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudElzbGFuZCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRJc2xhbmQuY29sdW1uTGlzdC5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm9vdEdyaWQuY29sdW1uTGlzdC5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucm93SXNsYW5kQVBJLmdldENoaWxkR3JpZHMoKS5mb3JFYWNoKChncmlkOiBHcmlkVHlwZSkgPT4ge1xuICAgICAgICAgICAgZ3JpZC5jcmVhdGVDb2x1bW5zTGlzdCh0aGlzLmNoaWxkQ29sdW1ucy50b0FycmF5KCkpO1xuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGdyaWQubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBncmlkLnVwZGF0ZU9uUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUNoaWxkcmVuKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5maXJzdCA9PT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5yZXNldCh0aGlzLmNoaWxkcmVuLnRvQXJyYXkoKS5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudElzbGFuZCA9IHRoaXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW5HcmlkU3RhdGUoZ3JpZCkge1xuICAgICAgICBncmlkLmNoaWxkR3JpZFRlbXBsYXRlcy5mb3JFYWNoKCh0bXBsKSA9PiB7XG4gICAgICAgICAgICB0bXBsLm93bmVyLmNsZWFuVmlldyh0bXBsLmNvbnRleHQudGVtcGxhdGVJRCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkLmNoaWxkR3JpZFRlbXBsYXRlcy5jbGVhcigpO1xuICAgICAgICBncmlkLm9uUm93SXNsYW5kQ2hhbmdlKCk7XG4gICAgfVxufVxuIl19