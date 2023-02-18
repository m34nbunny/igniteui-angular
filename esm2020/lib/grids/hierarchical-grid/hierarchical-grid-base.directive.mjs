import { Directive, EventEmitter, Inject, Input, LOCALE_ID, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { IgxGridBaseDirective } from '../grid-base.directive';
import { DisplayDensityToken } from '../../core/displayDensity';
import { IgxSummaryOperand } from '../summaries/grid-summary';
import { DOCUMENT } from '@angular/common';
import { IGX_GRID_SERVICE_BASE } from '../common/grid.interface';
import { IgxColumnGroupComponent } from '../columns/column-group.component';
import { IgxColumnComponent } from '../columns/column.component';
import { takeUntil } from 'rxjs/operators';
import { IgxTransactionService } from '../../services/transaction/igx-transaction';
import { IgxOverlayService } from '../../services/overlay/overlay';
import { IgxGridTransaction } from '../common/types';
import * as i0 from "@angular/core";
import * as i1 from "../selection/selection.service";
import * as i2 from "../resizing/resizing.service";
import * as i3 from "../../services/transaction/transaction-factory.service";
import * as i4 from "./hierarchical-grid-navigation.service";
import * as i5 from "../filtering/grid-filtering.service";
import * as i6 from "../summaries/grid-summary.service";
import * as i7 from "../../core/utils";
import * as i8 from "./hierarchical-grid-api.service";
import * as i9 from "../../services/overlay/overlay";
export const hierarchicalTransactionServiceFactory = () => new IgxTransactionService();
export const IgxHierarchicalTransactionServiceFactory = {
    provide: IgxGridTransaction,
    useFactory: hierarchicalTransactionServiceFactory
};
export class IgxHierarchicalGridBaseDirective extends IgxGridBaseDirective {
    constructor(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform, _diTransactions) {
        super(selectionService, colResizingService, gridAPI, transactionFactory, elementRef, zone, document, cdr, resolver, differs, viewRef, appRef, moduleRef, injector, navigation, filteringService, overlayService, summaryService, _displayDensityOptions, localeId, platform);
        this.selectionService = selectionService;
        this.colResizingService = colResizingService;
        this.gridAPI = gridAPI;
        this.transactionFactory = transactionFactory;
        this.document = document;
        this.overlayService = overlayService;
        this.summaryService = summaryService;
        this._displayDensityOptions = _displayDensityOptions;
        this.platform = platform;
        this._diTransactions = _diTransactions;
        /**
         * Gets/Sets whether the expand/collapse all button in the header should be rendered.
         *
         * @remark
         * The default value is false.
         * @example
         * ```html
         * <igx-hierarchical-grid #grid [data]="localData" [showExpandAll]="true">
         * </igx-hierarchical-grid>
         * ```
         */
        this.showExpandAll = false;
        /**
         * Emitted when a new chunk of data is loaded from virtualization.
         *
         * @example
         * ```typescript
         *  <igx-hierarchical-grid [id]="'igx-grid-1'" [data]="Data" [autoGenerate]="true" (dataPreLoad)="handleEvent()">
         *  </igx-hierarchical-grid>
         * ```
         */
        this.dataPreLoad = new EventEmitter();
        /** @hidden @internal */
        this.batchEditingChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    get maxLevelHeaderDepth() {
        if (this._maxLevelHeaderDepth === null) {
            this._maxLevelHeaderDepth = this.columnList.reduce((acc, col) => Math.max(acc, col.level), 0);
        }
        return this._maxLevelHeaderDepth;
    }
    /**
     * Gets the outlet used to attach the grid's overlays to.
     *
     * @remark
     * If set, returns the outlet defined outside the grid. Otherwise returns the grid's internal outlet directive.
     */
    get outlet() {
        return this.rootGrid ? this.rootGrid.resolveOutlet() : this.resolveOutlet();
    }
    /**
     * Sets the outlet used to attach the grid's overlays to.
     */
    set outlet(val) {
        this._userOutletDirective = val;
    }
    get batchEditing() {
        return this._batchEditing;
    }
    set batchEditing(val) {
        if (val !== this._batchEditing) {
            delete this._transactions;
            this.switchTransactionService(val);
            this.subscribeToTransactions();
            this.batchEditingChange.emit(val);
            this._batchEditing = val;
        }
    }
    /**
     * @hidden
     */
    createColumnsList(cols) {
        const columns = [];
        const topLevelCols = cols.filter(c => c.level === 0);
        topLevelCols.forEach((col) => {
            const ref = this._createColumn(col);
            ref.changeDetectorRef.detectChanges();
            columns.push(ref.instance);
        });
        const result = flatten(columns);
        this.columnList.reset(result);
        this.columnList.notifyOnChanges();
        this.initPinning();
        const factoryColumn = this.resolver.resolveComponentFactory(IgxColumnComponent);
        const outputs = factoryColumn.outputs.filter(o => o.propName !== 'columnChange');
        outputs.forEach(output => {
            this.columnList.forEach(column => {
                if (column[output.propName]) {
                    column[output.propName].pipe(takeUntil(column.destroy$)).subscribe((args) => {
                        const rowIslandColumn = this.parentIsland.childColumns.find(col => col.field === column.field);
                        rowIslandColumn[output.propName].emit({ args, owner: this });
                    });
                }
            });
        });
    }
    _createColumn(col) {
        let ref;
        if (col instanceof IgxColumnGroupComponent) {
            ref = this._createColGroupComponent(col);
        }
        else {
            ref = this._createColComponent(col);
        }
        return ref;
    }
    _createColGroupComponent(col) {
        const factoryGroup = this.resolver.resolveComponentFactory(IgxColumnGroupComponent);
        const ref = this.viewRef.createComponent(IgxColumnGroupComponent, { injector: this.viewRef.injector });
        ref.changeDetectorRef.detectChanges();
        factoryGroup.inputs.forEach((input) => {
            const propName = input.propName;
            ref.instance[propName] = col[propName];
        });
        if (col.children.length > 0) {
            const newChildren = [];
            col.children.forEach(child => {
                const newCol = this._createColumn(child).instance;
                newCol.parent = ref.instance;
                newChildren.push(newCol);
            });
            ref.instance.children.reset(newChildren);
            ref.instance.children.notifyOnChanges();
        }
        return ref;
    }
    _createColComponent(col) {
        const factoryColumn = this.resolver.resolveComponentFactory(IgxColumnComponent);
        const ref = this.viewRef.createComponent(IgxColumnComponent, { injector: this.viewRef.injector });
        factoryColumn.inputs.forEach((input) => {
            const propName = input.propName;
            if (!(col[propName] instanceof IgxSummaryOperand)) {
                ref.instance[propName] = col[propName];
            }
            else {
                ref.instance[propName] = col[propName].constructor;
            }
        });
        return ref;
    }
    getGridsForIsland(rowIslandID) {
        return this.gridAPI.getChildGridsForRowIsland(rowIslandID);
    }
    getChildGrid(path) {
        if (!path) {
            return;
        }
        return this.gridAPI.getChildGrid(path);
    }
}
IgxHierarchicalGridBaseDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridBaseDirective, deps: [{ token: i1.IgxGridSelectionService }, { token: i2.IgxColumnResizingService }, { token: IGX_GRID_SERVICE_BASE }, { token: i3.IgxFlatTransactionFactory }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }, { token: i0.IterableDiffers }, { token: i0.ViewContainerRef }, { token: i0.ApplicationRef }, { token: i0.NgModuleRef }, { token: i0.Injector }, { token: i4.IgxHierarchicalGridNavigationService }, { token: i5.IgxFilteringService }, { token: IgxOverlayService }, { token: i6.IgxGridSummaryService }, { token: DisplayDensityToken, optional: true }, { token: LOCALE_ID }, { token: i7.PlatformUtil }, { token: IgxGridTransaction, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
IgxHierarchicalGridBaseDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxHierarchicalGridBaseDirective, inputs: { hasChildrenKey: "hasChildrenKey", showExpandAll: "showExpandAll" }, outputs: { dataPreLoad: "dataPreLoad" }, viewQueries: [{ propertyName: "dragIndicatorIconBase", first: true, predicate: ["dragIndicatorIconBase"], descendants: true, read: TemplateRef, static: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridBaseDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.IgxGridSelectionService }, { type: i2.IgxColumnResizingService }, { type: i8.IgxHierarchicalGridAPIService, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_SERVICE_BASE]
                }] }, { type: i3.IgxFlatTransactionFactory }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }, { type: i0.IterableDiffers }, { type: i0.ViewContainerRef }, { type: i0.ApplicationRef }, { type: i0.NgModuleRef }, { type: i0.Injector }, { type: i4.IgxHierarchicalGridNavigationService }, { type: i5.IgxFilteringService }, { type: i9.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }, { type: i6.IgxGridSummaryService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i7.PlatformUtil }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IgxGridTransaction]
                }] }]; }, propDecorators: { hasChildrenKey: [{
                type: Input
            }], showExpandAll: [{
                type: Input
            }], dataPreLoad: [{
                type: Output
            }], dragIndicatorIconBase: [{
                type: ViewChild,
                args: ['dragIndicatorIconBase', { read: TemplateRef, static: true }]
            }] } });
const flatten = (arr) => {
    let result = [];
    arr.forEach(el => {
        result.push(el);
        if (el.children) {
            result = result.concat(flatten(el.children.toArray()));
        }
    });
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2hpY2FsLWdyaWQtYmFzZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvaGllcmFyY2hpY2FsLWdyaWQvaGllcmFyY2hpY2FsLWdyaWQtYmFzZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUlILFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUVOLEtBQUssRUFFTCxTQUFTLEVBR1QsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBSTlELE9BQU8sRUFBMEIsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN4RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLM0MsT0FBTyxFQUFZLHFCQUFxQixFQUFnQixNQUFNLDBCQUEwQixDQUFDO0FBQ3pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRWpFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUczQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVuRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7QUFFckQsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxx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LFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsbUJBQW1COzswQkFDdEMsTUFBTTsyQkFBQyxTQUFTOzswQkFFaEIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxrQkFBa0I7NENBN0duQyxjQUFjO3NCQURwQixLQUFLO2dCQWVDLGFBQWE7c0JBRG5CLEtBQUs7Z0JBYUMsV0FBVztzQkFEakIsTUFBTTtnQkFRQSxxQkFBcUI7c0JBRDNCLFNBQVM7dUJBQUMsdUJBQXVCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0FBNkwzRSxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQVUsRUFBRSxFQUFFO0lBQzNCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVoQixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDYixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDMUQ7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXBwbGljYXRpb25SZWYsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIERpcmVjdGl2ZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbmplY3QsXG4gICAgSW5qZWN0b3IsXG4gICAgSW5wdXQsXG4gICAgSXRlcmFibGVEaWZmZXJzLFxuICAgIExPQ0FMRV9JRCxcbiAgICBOZ01vZHVsZVJlZixcbiAgICBOZ1pvbmUsXG4gICAgT3B0aW9uYWwsXG4gICAgT3V0cHV0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4R3JpZEJhc2VEaXJlY3RpdmUgfSBmcm9tICcuLi9ncmlkLWJhc2UuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEhpZXJhcmNoaWNhbEdyaWRBUElTZXJ2aWNlIH0gZnJvbSAnLi9oaWVyYXJjaGljYWwtZ3JpZC1hcGkuc2VydmljZSc7XG5pbXBvcnQgeyBJZ3hSb3dJc2xhbmRDb21wb25lbnQgfSBmcm9tICcuL3Jvdy1pc2xhbmQuY29tcG9uZW50JztcbmltcG9ydCB7IElneEZpbHRlcmluZ1NlcnZpY2UgfSBmcm9tICcuLi9maWx0ZXJpbmcvZ3JpZC1maWx0ZXJpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJRGlzcGxheURlbnNpdHlPcHRpb25zLCBEaXNwbGF5RGVuc2l0eVRva2VuIH0gZnJvbSAnLi4vLi4vY29yZS9kaXNwbGF5RGVuc2l0eSc7XG5pbXBvcnQgeyBJZ3hTdW1tYXJ5T3BlcmFuZCB9IGZyb20gJy4uL3N1bW1hcmllcy9ncmlkLXN1bW1hcnknO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSWd4SGllcmFyY2hpY2FsR3JpZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9oaWVyYXJjaGljYWwtZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4R3JpZFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi4vc3VtbWFyaWVzL2dyaWQtc3VtbWFyeS5zZXJ2aWNlJztcbmltcG9ydCB7IElneEdyaWRTZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElneENvbHVtblJlc2l6aW5nU2VydmljZSB9IGZyb20gJy4uL3Jlc2l6aW5nL3Jlc2l6aW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JpZFR5cGUsIElHWF9HUklEX1NFUlZJQ0VfQkFTRSwgSVBhdGhTZWdtZW50IH0gZnJvbSAnLi4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElneENvbHVtbkdyb3VwQ29tcG9uZW50IH0gZnJvbSAnLi4vY29sdW1ucy9jb2x1bW4tZ3JvdXAuY29tcG9uZW50JztcbmltcG9ydCB7IElneENvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbHVtbnMvY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJRm9yT2ZTdGF0ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvZm9yLW9mL2Zvcl9vZi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJZ3hGbGF0VHJhbnNhY3Rpb25GYWN0b3J5IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdHJhbnNhY3Rpb24vdHJhbnNhY3Rpb24tZmFjdG9yeS5zZXJ2aWNlJztcbmltcG9ydCB7IElneFRyYW5zYWN0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zYWN0aW9uL2lneC10cmFuc2FjdGlvbic7XG5pbXBvcnQgeyBJZ3hPdmVybGF5U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL292ZXJsYXkvb3ZlcmxheSc7XG5pbXBvcnQgeyBTdGF0ZSwgVHJhbnNhY3Rpb24sIFRyYW5zYWN0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zYWN0aW9uL3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IElneEdyaWRUcmFuc2FjdGlvbiB9IGZyb20gJy4uL2NvbW1vbi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBoaWVyYXJjaGljYWxUcmFuc2FjdGlvblNlcnZpY2VGYWN0b3J5ID0gKCkgPT4gbmV3IElneFRyYW5zYWN0aW9uU2VydmljZSgpO1xuXG5leHBvcnQgY29uc3QgSWd4SGllcmFyY2hpY2FsVHJhbnNhY3Rpb25TZXJ2aWNlRmFjdG9yeSA9IHtcbiAgICBwcm92aWRlOiBJZ3hHcmlkVHJhbnNhY3Rpb24sXG4gICAgdXNlRmFjdG9yeTogaGllcmFyY2hpY2FsVHJhbnNhY3Rpb25TZXJ2aWNlRmFjdG9yeVxufTtcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSWd4SGllcmFyY2hpY2FsR3JpZEJhc2VEaXJlY3RpdmUgZXh0ZW5kcyBJZ3hHcmlkQmFzZURpcmVjdGl2ZSBpbXBsZW1lbnRzIEdyaWRUeXBlIHtcbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGtleSBpbmRpY2F0aW5nIHdoZXRoZXIgYSByb3cgaGFzIGNoaWxkcmVuLiBJZiByb3cgaGFzIG5vIGNoaWxkcmVuIGl0IGRvZXMgbm90IHJlbmRlciBhbiBleHBhbmQgaW5kaWNhdG9yLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1oaWVyYXJjaGljYWwtZ3JpZCAjZ3JpZCBbZGF0YV09XCJsb2NhbERhdGFcIiBbaGFzQ2hpbGRyZW5LZXldPVwiJ2hhc0VtcGxveWVlcydcIj5cbiAgICAgKiA8L2lneC1oaWVyYXJjaGljYWwtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoYXNDaGlsZHJlbktleTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHdoZXRoZXIgdGhlIGV4cGFuZC9jb2xsYXBzZSBhbGwgYnV0dG9uIGluIHRoZSBoZWFkZXIgc2hvdWxkIGJlIHJlbmRlcmVkLlxuICAgICAqXG4gICAgICogQHJlbWFya1xuICAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIGZhbHNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgI2dyaWQgW2RhdGFdPVwibG9jYWxEYXRhXCIgW3Nob3dFeHBhbmRBbGxdPVwidHJ1ZVwiPlxuICAgICAqIDwvaWd4LWhpZXJhcmNoaWNhbC1ncmlkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNob3dFeHBhbmRBbGwgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiBhIG5ldyBjaHVuayBvZiBkYXRhIGlzIGxvYWRlZCBmcm9tIHZpcnR1YWxpemF0aW9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIDxpZ3gtaGllcmFyY2hpY2FsLWdyaWQgW2lkXT1cIidpZ3gtZ3JpZC0xJ1wiIFtkYXRhXT1cIkRhdGFcIiBbYXV0b0dlbmVyYXRlXT1cInRydWVcIiAoZGF0YVByZUxvYWQpPVwiaGFuZGxlRXZlbnQoKVwiPlxuICAgICAqICA8L2lneC1oaWVyYXJjaGljYWwtZ3JpZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZGF0YVByZUxvYWQgPSBuZXcgRXZlbnRFbWl0dGVyPElGb3JPZlN0YXRlPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RyYWdJbmRpY2F0b3JJY29uQmFzZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyBkcmFnSW5kaWNhdG9ySWNvbkJhc2U6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldCBtYXhMZXZlbEhlYWRlckRlcHRoKCkge1xuICAgICAgICBpZiAodGhpcy5fbWF4TGV2ZWxIZWFkZXJEZXB0aCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWF4TGV2ZWxIZWFkZXJEZXB0aCA9IHRoaXMuY29sdW1uTGlzdC5yZWR1Y2UoKGFjYywgY29sKSA9PiBNYXRoLm1heChhY2MsIGNvbC5sZXZlbCksIDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhMZXZlbEhlYWRlckRlcHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG91dGxldCB1c2VkIHRvIGF0dGFjaCB0aGUgZ3JpZCdzIG92ZXJsYXlzIHRvLlxuICAgICAqXG4gICAgICogQHJlbWFya1xuICAgICAqIElmIHNldCwgcmV0dXJucyB0aGUgb3V0bGV0IGRlZmluZWQgb3V0c2lkZSB0aGUgZ3JpZC4gT3RoZXJ3aXNlIHJldHVybnMgdGhlIGdyaWQncyBpbnRlcm5hbCBvdXRsZXQgZGlyZWN0aXZlLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgb3V0bGV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb290R3JpZCA/IHRoaXMucm9vdEdyaWQucmVzb2x2ZU91dGxldCgpIDogdGhpcy5yZXNvbHZlT3V0bGV0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgb3V0bGV0IHVzZWQgdG8gYXR0YWNoIHRoZSBncmlkJ3Mgb3ZlcmxheXMgdG8uXG4gICAgICovXG4gICAgcHVibGljIHNldCBvdXRsZXQodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fdXNlck91dGxldERpcmVjdGl2ZSA9IHZhbDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgYmF0Y2hFZGl0aW5nQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICBwdWJsaWMgZ2V0IGJhdGNoRWRpdGluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhdGNoRWRpdGluZztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGJhdGNoRWRpdGluZyh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHZhbCAhPT0gdGhpcy5fYmF0Y2hFZGl0aW5nKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fdHJhbnNhY3Rpb25zO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hUcmFuc2FjdGlvblNlcnZpY2UodmFsKTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlVG9UcmFuc2FjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuYmF0Y2hFZGl0aW5nQ2hhbmdlLmVtaXQodmFsKTtcbiAgICAgICAgICAgIHRoaXMuX2JhdGNoRWRpdGluZyA9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgcGFyZW50SXNsYW5kOiBJZ3hSb3dJc2xhbmRDb21wb25lbnQ7XG4gICAgcHVibGljIGFic3RyYWN0IHJvb3RHcmlkOiBHcmlkVHlwZTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBleHBhbmRDaGlsZHJlbjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgc2VsZWN0aW9uU2VydmljZTogSWd4R3JpZFNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBjb2xSZXNpemluZ1NlcnZpY2U6IElneENvbHVtblJlc2l6aW5nU2VydmljZSxcbiAgICAgICAgQEluamVjdChJR1hfR1JJRF9TRVJWSUNFX0JBU0UpIHB1YmxpYyBncmlkQVBJOiBJZ3hIaWVyYXJjaGljYWxHcmlkQVBJU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHRyYW5zYWN0aW9uRmFjdG9yeTogSWd4RmxhdFRyYW5zYWN0aW9uRmFjdG9yeSxcbiAgICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHpvbmU6IE5nWm9uZSxcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHVibGljIGRvY3VtZW50LFxuICAgICAgICBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICAgIHZpZXdSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgICAgIG1vZHVsZVJlZjogTmdNb2R1bGVSZWY8YW55PixcbiAgICAgICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICBuYXZpZ2F0aW9uOiBJZ3hIaWVyYXJjaGljYWxHcmlkTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIGZpbHRlcmluZ1NlcnZpY2U6IElneEZpbHRlcmluZ1NlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoSWd4T3ZlcmxheVNlcnZpY2UpIHByb3RlY3RlZCBvdmVybGF5U2VydmljZTogSWd4T3ZlcmxheVNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBzdW1tYXJ5U2VydmljZTogSWd4R3JpZFN1bW1hcnlTZXJ2aWNlLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERpc3BsYXlEZW5zaXR5VG9rZW4pIHByb3RlY3RlZCBfZGlzcGxheURlbnNpdHlPcHRpb25zOiBJRGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICBASW5qZWN0KExPQ0FMRV9JRCkgbG9jYWxlSWQ6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoSWd4R3JpZFRyYW5zYWN0aW9uKSBwcm90ZWN0ZWQgX2RpVHJhbnNhY3Rpb25zPzogVHJhbnNhY3Rpb25TZXJ2aWNlPFRyYW5zYWN0aW9uLCBTdGF0ZT4pIHtcbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICBzZWxlY3Rpb25TZXJ2aWNlLFxuICAgICAgICAgICAgY29sUmVzaXppbmdTZXJ2aWNlLFxuICAgICAgICAgICAgZ3JpZEFQSSxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uRmFjdG9yeSxcbiAgICAgICAgICAgIGVsZW1lbnRSZWYsXG4gICAgICAgICAgICB6b25lLFxuICAgICAgICAgICAgZG9jdW1lbnQsXG4gICAgICAgICAgICBjZHIsXG4gICAgICAgICAgICByZXNvbHZlcixcbiAgICAgICAgICAgIGRpZmZlcnMsXG4gICAgICAgICAgICB2aWV3UmVmLFxuICAgICAgICAgICAgYXBwUmVmLFxuICAgICAgICAgICAgbW9kdWxlUmVmLFxuICAgICAgICAgICAgaW5qZWN0b3IsXG4gICAgICAgICAgICBuYXZpZ2F0aW9uLFxuICAgICAgICAgICAgZmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgICAgIG92ZXJsYXlTZXJ2aWNlLFxuICAgICAgICAgICAgc3VtbWFyeVNlcnZpY2UsXG4gICAgICAgICAgICBfZGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICAgICAgbG9jYWxlSWQsXG4gICAgICAgICAgICBwbGF0Zm9ybSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBjcmVhdGVDb2x1bW5zTGlzdChjb2xzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXTtcbiAgICAgICAgY29uc3QgdG9wTGV2ZWxDb2xzID0gY29scy5maWx0ZXIoYyA9PiBjLmxldmVsID09PSAwKTtcbiAgICAgICAgdG9wTGV2ZWxDb2xzLmZvckVhY2goKGNvbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVmID0gdGhpcy5fY3JlYXRlQ29sdW1uKGNvbCk7XG4gICAgICAgICAgICByZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgY29sdW1ucy5wdXNoKHJlZi5pbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBmbGF0dGVuKGNvbHVtbnMpO1xuICAgICAgICB0aGlzLmNvbHVtbkxpc3QucmVzZXQocmVzdWx0KTtcbiAgICAgICAgdGhpcy5jb2x1bW5MaXN0Lm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgICB0aGlzLmluaXRQaW5uaW5nKCk7XG5cbiAgICAgICAgY29uc3QgZmFjdG9yeUNvbHVtbiA9IHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoSWd4Q29sdW1uQ29tcG9uZW50KTtcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGZhY3RvcnlDb2x1bW4ub3V0cHV0cy5maWx0ZXIobyA9PiBvLnByb3BOYW1lICE9PSAnY29sdW1uQ2hhbmdlJyk7XG4gICAgICAgIG91dHB1dHMuZm9yRWFjaChvdXRwdXQgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5MaXN0LmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uW291dHB1dC5wcm9wTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uW291dHB1dC5wcm9wTmFtZV0ucGlwZSh0YWtlVW50aWwoY29sdW1uLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJc2xhbmRDb2x1bW4gPSB0aGlzLnBhcmVudElzbGFuZC5jaGlsZENvbHVtbnMuZmluZChjb2wgPT4gY29sLmZpZWxkID09PSBjb2x1bW4uZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93SXNsYW5kQ29sdW1uW291dHB1dC5wcm9wTmFtZV0uZW1pdCh7IGFyZ3MsIG93bmVyOiB0aGlzIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVDb2x1bW4oY29sKSB7XG4gICAgICAgIGxldCByZWY7XG4gICAgICAgIGlmIChjb2wgaW5zdGFuY2VvZiBJZ3hDb2x1bW5Hcm91cENvbXBvbmVudCkge1xuICAgICAgICAgICAgcmVmID0gdGhpcy5fY3JlYXRlQ29sR3JvdXBDb21wb25lbnQoY29sKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlZiA9IHRoaXMuX2NyZWF0ZUNvbENvbXBvbmVudChjb2wpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWY7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVDb2xHcm91cENvbXBvbmVudChjb2w6IElneENvbHVtbkdyb3VwQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlHcm91cCA9IHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoSWd4Q29sdW1uR3JvdXBDb21wb25lbnQpO1xuICAgICAgICBjb25zdCByZWYgPSB0aGlzLnZpZXdSZWYuY3JlYXRlQ29tcG9uZW50KElneENvbHVtbkdyb3VwQ29tcG9uZW50LCB7IGluamVjdG9yOiB0aGlzLnZpZXdSZWYuaW5qZWN0b3IgfSk7XG4gICAgICAgIHJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIGZhY3RvcnlHcm91cC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BOYW1lID0gaW5wdXQucHJvcE5hbWU7XG4gICAgICAgICAgICByZWYuaW5zdGFuY2VbcHJvcE5hbWVdID0gY29sW3Byb3BOYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjb2wuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbmV3Q2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIGNvbC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdDb2wgPSB0aGlzLl9jcmVhdGVDb2x1bW4oY2hpbGQpLmluc3RhbmNlO1xuICAgICAgICAgICAgICAgIG5ld0NvbC5wYXJlbnQgPSByZWYuaW5zdGFuY2U7XG4gICAgICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaChuZXdDb2wpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWYuaW5zdGFuY2UuY2hpbGRyZW4ucmVzZXQobmV3Q2hpbGRyZW4pO1xuICAgICAgICAgICAgcmVmLmluc3RhbmNlLmNoaWxkcmVuLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWY7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVDb2xDb21wb25lbnQoY29sKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlDb2x1bW4gPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KElneENvbHVtbkNvbXBvbmVudCk7XG4gICAgICAgIGNvbnN0IHJlZiA9IHRoaXMudmlld1JlZi5jcmVhdGVDb21wb25lbnQoSWd4Q29sdW1uQ29tcG9uZW50LCB7IGluamVjdG9yOiB0aGlzLnZpZXdSZWYuaW5qZWN0b3IgfSk7XG4gICAgICAgIGZhY3RvcnlDb2x1bW4uaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9wTmFtZSA9IGlucHV0LnByb3BOYW1lO1xuICAgICAgICAgICAgaWYgKCEoY29sW3Byb3BOYW1lXSBpbnN0YW5jZW9mIElneFN1bW1hcnlPcGVyYW5kKSkge1xuICAgICAgICAgICAgICAgIHJlZi5pbnN0YW5jZVtwcm9wTmFtZV0gPSBjb2xbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWYuaW5zdGFuY2VbcHJvcE5hbWVdID0gY29sW3Byb3BOYW1lXS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZWY7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldEdyaWRzRm9ySXNsYW5kKHJvd0lzbGFuZElEOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEFQSS5nZXRDaGlsZEdyaWRzRm9yUm93SXNsYW5kKHJvd0lzbGFuZElEKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0Q2hpbGRHcmlkKHBhdGg6IEFycmF5PElQYXRoU2VnbWVudD4pIHtcbiAgICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEFQSS5nZXRDaGlsZEdyaWQocGF0aCk7XG4gICAgfVxufVxuXG5jb25zdCBmbGF0dGVuID0gKGFycjogYW55W10pID0+IHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGVsKTtcbiAgICAgICAgaWYgKGVsLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KGZsYXR0ZW4oZWwuY2hpbGRyZW4udG9BcnJheSgpKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiJdfQ==