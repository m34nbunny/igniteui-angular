import { Directive, EventEmitter, HostBinding, Input, Output, Pipe, ViewChildren } from '@angular/core';
import { IgxChipComponent } from '../../chips/public_api';
import { DisplayDensity } from '../../core/displayDensity';
import { SortingDirection } from '../../data-operations/sorting-strategy';
import { IgxColumnMovingDragDirective } from '../moving/moving.drag.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../core/utils";
/**
 * An internal component representing a base group-by drop area.
 *
 * @hidden @internal
 */
export class IgxGroupByAreaDirective {
    constructor(ref, platform) {
        this.ref = ref;
        this.platform = platform;
        this.density = DisplayDensity.comfortable;
        this.defaultClass = true;
        this.expressionsChange = new EventEmitter();
        this._expressions = [];
    }
    get cosyStyle() {
        return this.density === 'cosy';
    }
    get compactStyle() {
        return this.density === 'compact';
    }
    /**
     * The group-by expressions provided by the parent grid.
     */
    get expressions() {
        return this._expressions;
    }
    set expressions(value) {
        this._expressions = value;
        this.chipExpressions = this._expressions;
        this.expressionsChanged();
        this.expressionsChange.emit(this._expressions);
    }
    /**
     * The default message for the default drop area template.
     * Obviously, if another template is provided, this is ignored.
     */
    get dropAreaMessage() {
        return this._dropAreaMessage ?? this.grid.resourceStrings.igx_grid_groupByArea_message;
    }
    set dropAreaMessage(value) {
        this._dropAreaMessage = value;
    }
    /** The native DOM element. Used in sizing calculations. */
    get nativeElement() {
        return this.ref.nativeElement;
    }
    get dropAreaVisible() {
        return (this.grid.columnInDrag && this.grid.columnInDrag.groupable) ||
            !this.expressions.length;
    }
    handleKeyDown(id, event) {
        if (this.platform.isActivationKey(event)) {
            this.updateSorting(id);
        }
    }
    handleClick(id) {
        if (!this.grid.getColumnByName(id).groupable) {
            return;
        }
        this.updateSorting(id);
    }
    onDragDrop(event) {
        const drag = event.detail.owner;
        if (drag instanceof IgxColumnMovingDragDirective) {
            const column = drag.column;
            if (!this.grid.columnList.find(c => c === column)) {
                return;
            }
            const isGrouped = this.expressions.findIndex((item) => item.fieldName === column.field) !== -1;
            if (column.groupable && !isGrouped && !column.columnGroup && !!column.field) {
                const groupingExpression = {
                    fieldName: column.field,
                    dir: this.grid.sortingExpressions.find(expr => expr.fieldName === column.field)?.dir || SortingDirection.Asc,
                    ignoreCase: column.sortingIgnoreCase,
                    strategy: column.sortStrategy,
                    groupingComparer: column.groupingComparer
                };
                this.groupBy(groupingExpression);
            }
        }
    }
    getReorderedExpressions(chipsArray) {
        const newExpressions = [];
        chipsArray.forEach(chip => {
            const expr = this.expressions.find(item => item.fieldName === chip.id);
            // disallow changing order if there are columns with groupable: false
            if (!this.grid.getColumnByName(expr.fieldName)?.groupable) {
                return;
            }
            newExpressions.push(expr);
        });
        return newExpressions;
    }
    updateSorting(id) {
        const expr = this.grid.sortingExpressions.find(e => e.fieldName === id);
        expr.dir = 3 - expr.dir;
        this.grid.sort(expr);
    }
    expressionsChanged() {
    }
}
IgxGroupByAreaDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGroupByAreaDirective, deps: [{ token: i0.ElementRef }, { token: i1.PlatformUtil }], target: i0.ɵɵFactoryTarget.Directive });
IgxGroupByAreaDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxGroupByAreaDirective, inputs: { dropAreaTemplate: "dropAreaTemplate", density: "density", grid: "grid", expressions: "expressions", dropAreaMessage: "dropAreaMessage" }, outputs: { expressionsChange: "expressionsChange" }, host: { properties: { "class.igx-grid-grouparea": "this.defaultClass", "class.igx-grid-grouparea--cosy": "this.cosyStyle", "class.igx-grid-grouparea--compact": "this.compactStyle" } }, viewQueries: [{ propertyName: "chips", predicate: IgxChipComponent, descendants: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGroupByAreaDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.PlatformUtil }]; }, propDecorators: { dropAreaTemplate: [{
                type: Input
            }], density: [{
                type: Input
            }], defaultClass: [{
                type: HostBinding,
                args: ['class.igx-grid-grouparea']
            }], cosyStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-grouparea--cosy']
            }], compactStyle: [{
                type: HostBinding,
                args: ['class.igx-grid-grouparea--compact']
            }], grid: [{
                type: Input
            }], expressions: [{
                type: Input
            }], dropAreaMessage: [{
                type: Input
            }], expressionsChange: [{
                type: Output
            }], chips: [{
                type: ViewChildren,
                args: [IgxChipComponent]
            }] } });
/**
 * A pipe to circumvent the use of getters/methods just to get some additional
 * information from the grouping expression and pass it to the chip representing
 * that expression.
 *
 * @hidden @internal
 */
export class IgxGroupByMetaPipe {
    transform(key, grid) {
        const column = grid.getColumnByName(key);
        return { groupable: !!column?.groupable, title: column?.header || key };
    }
}
IgxGroupByMetaPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGroupByMetaPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxGroupByMetaPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGroupByMetaPipe, name: "igxGroupByMeta" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGroupByMetaPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'igxGroupByMeta' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtYnktYXJlYS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvZ3JvdXBpbmcvZ3JvdXAtYnktYXJlYS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFFVCxZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFDTCxNQUFNLEVBQ04sSUFBSSxFQUlKLFlBQVksRUFDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQThCLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRzNELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRTFFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOzs7QUFFL0U7Ozs7R0FJRztBQUVILE1BQU0sT0FBZ0IsdUJBQXVCO0lBd0V6QyxZQUFvQixHQUE0QixFQUFZLFFBQXNCO1FBQTlELFFBQUcsR0FBSCxHQUFHLENBQXlCO1FBQVksYUFBUSxHQUFSLFFBQVEsQ0FBYztRQS9EM0UsWUFBTyxHQUFtQixjQUFjLENBQUMsV0FBVyxDQUFDO1FBR3JELGlCQUFZLEdBQUksSUFBSSxDQUFDO1FBNkNyQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBeUIsQ0FBQztRQVk3RCxpQkFBWSxHQUEwQixFQUFFLENBQUM7SUFHcUMsQ0FBQztJQTFEdkYsSUFDVyxTQUFTO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQ1csWUFBWTtRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDO0lBQ3RDLENBQUM7SUFNRDs7T0FFRztJQUNILElBQ1csV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQVcsV0FBVyxDQUFDLEtBQTRCO1FBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN6QyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFDVyxlQUFlO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLDRCQUE0QixDQUFDO0lBQzNGLENBQUM7SUFFRCxJQUFXLGVBQWUsQ0FBQyxLQUFhO1FBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQVVELDJEQUEyRDtJQUMzRCxJQUFXLGFBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztJQUNsQyxDQUFDO0lBUUQsSUFBVyxlQUFlO1FBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7WUFDL0QsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxDQUFDO0lBRU0sYUFBYSxDQUFDLEVBQVUsRUFBRSxLQUFvQjtRQUNqRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRU0sV0FBVyxDQUFDLEVBQVU7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRTtZQUMxQyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFTyxVQUFVLENBQUMsS0FBSztRQUNwQixNQUFNLElBQUksR0FBaUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDOUQsSUFBSSxJQUFJLFlBQVksNEJBQTRCLEVBQUU7WUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxFQUFFO2dCQUMvQyxPQUFPO2FBQ1Y7WUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDL0YsSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDekUsTUFBTSxrQkFBa0IsR0FBRztvQkFDdkIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLO29CQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksZ0JBQWdCLENBQUMsR0FBRztvQkFDNUcsVUFBVSxFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7b0JBQ3BDLFFBQVEsRUFBRSxNQUFNLENBQUMsWUFBWTtvQkFDN0IsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLGdCQUFnQjtpQkFDNUMsQ0FBQztnQkFFRixJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDcEM7U0FDSjtJQUNMLENBQUM7SUFFUyx1QkFBdUIsQ0FBQyxVQUE4QjtRQUM1RCxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFFMUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXZFLHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRTtnQkFDdkQsT0FBTzthQUNWO1lBRUQsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFUyxhQUFhLENBQUMsRUFBVTtRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRVMsa0JBQWtCO0lBQzVCLENBQUM7O29IQTVJaUIsdUJBQXVCO3dHQUF2Qix1QkFBdUIsc2JBMkQzQixnQkFBZ0I7MkZBM0RaLHVCQUF1QjtrQkFEM0MsU0FBUzs0SEFPQSxnQkFBZ0I7c0JBRHRCLEtBQUs7Z0JBSUMsT0FBTztzQkFEYixLQUFLO2dCQUlDLFlBQVk7c0JBRGxCLFdBQVc7dUJBQUMsMEJBQTBCO2dCQUk1QixTQUFTO3NCQURuQixXQUFXO3VCQUFDLGdDQUFnQztnQkFNbEMsWUFBWTtzQkFEdEIsV0FBVzt1QkFBQyxtQ0FBbUM7Z0JBT3pDLElBQUk7c0JBRFYsS0FBSztnQkFPSyxXQUFXO3NCQURyQixLQUFLO2dCQWlCSyxlQUFlO3NCQUR6QixLQUFLO2dCQVVDLGlCQUFpQjtzQkFEdkIsTUFBTTtnQkFJQSxLQUFLO3NCQURYLFlBQVk7dUJBQUMsZ0JBQWdCOztBQTZGbEM7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQUVwQixTQUFTLENBQUMsR0FBVyxFQUFFLElBQWM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzVFLENBQUM7OytHQUxRLGtCQUFrQjs2R0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIERpcmVjdGl2ZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBIb3N0QmluZGluZyxcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgUGlwZSxcbiAgICBQaXBlVHJhbnNmb3JtLFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJQ2hpcHNBcmVhUmVvcmRlckV2ZW50QXJncywgSWd4Q2hpcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NoaXBzL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHkgfSBmcm9tICcuLi8uLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IFBsYXRmb3JtVXRpbCB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSUdyb3VwaW5nRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9ncm91cGluZy1leHByZXNzaW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBTb3J0aW5nRGlyZWN0aW9uIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgR3JpZFR5cGUgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSWd4Q29sdW1uTW92aW5nRHJhZ0RpcmVjdGl2ZSB9IGZyb20gJy4uL21vdmluZy9tb3ZpbmcuZHJhZy5kaXJlY3RpdmUnO1xuXG4vKipcbiAqIEFuIGludGVybmFsIGNvbXBvbmVudCByZXByZXNlbnRpbmcgYSBiYXNlIGdyb3VwLWJ5IGRyb3AgYXJlYS5cbiAqXG4gKiBAaGlkZGVuIEBpbnRlcm5hbFxuICovXG4gQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSWd4R3JvdXBCeUFyZWFEaXJlY3RpdmUge1xuICAgIC8qKlxuICAgICAqIFRoZSBkcm9wIGFyZWEgdGVtcGxhdGUgaWYgcHJvdmlkZWQgYnkgdGhlIHBhcmVudCBncmlkLlxuICAgICAqIE90aGVyd2lzZSwgdXNlcyB0aGUgZGVmYXVsdCBpbnRlcm5hbCBvbmUuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZHJvcEFyZWFUZW1wbGF0ZTogVGVtcGxhdGVSZWY8dm9pZD47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkZW5zaXR5OiBEaXNwbGF5RGVuc2l0eSA9IERpc3BsYXlEZW5zaXR5LmNvbWZvcnRhYmxlO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtZ3JpZC1ncm91cGFyZWEnKVxuICAgIHB1YmxpYyBkZWZhdWx0Q2xhc3MgPSAgdHJ1ZTtcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtZ3JvdXBhcmVhLS1jb3N5JylcbiAgICBwdWJsaWMgZ2V0IGNvc3lTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVuc2l0eSA9PT0gJ2Nvc3knO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWQtZ3JvdXBhcmVhLS1jb21wYWN0JylcbiAgICBwdWJsaWMgZ2V0IGNvbXBhY3RTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVuc2l0eSA9PT0gJ2NvbXBhY3QnO1xuICAgIH1cblxuICAgIC8qKiBUaGUgcGFyZW50IGdyaWQgY29udGFpbmluZyB0aGUgY29tcG9uZW50LiAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdyaWQ6IEdyaWRUeXBlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGdyb3VwLWJ5IGV4cHJlc3Npb25zIHByb3ZpZGVkIGJ5IHRoZSBwYXJlbnQgZ3JpZC5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZXhwcmVzc2lvbnMoKTogSUdyb3VwaW5nRXhwcmVzc2lvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4cHJlc3Npb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZXhwcmVzc2lvbnModmFsdWU6IElHcm91cGluZ0V4cHJlc3Npb25bXSkge1xuICAgICAgICB0aGlzLl9leHByZXNzaW9ucyA9IHZhbHVlO1xuICAgICAgICB0aGlzLmNoaXBFeHByZXNzaW9ucyA9IHRoaXMuX2V4cHJlc3Npb25zO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zQ2hhbmdlZCgpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25zQ2hhbmdlLmVtaXQodGhpcy5fZXhwcmVzc2lvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG1lc3NhZ2UgZm9yIHRoZSBkZWZhdWx0IGRyb3AgYXJlYSB0ZW1wbGF0ZS5cbiAgICAgKiBPYnZpb3VzbHksIGlmIGFub3RoZXIgdGVtcGxhdGUgaXMgcHJvdmlkZWQsIHRoaXMgaXMgaWdub3JlZC5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgZHJvcEFyZWFNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kcm9wQXJlYU1lc3NhZ2UgPz8gdGhpcy5ncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9ncm91cEJ5QXJlYV9tZXNzYWdlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZHJvcEFyZWFNZXNzYWdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZHJvcEFyZWFNZXNzYWdlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGV4cHJlc3Npb25zQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxJR3JvdXBpbmdFeHByZXNzaW9uW10+KCk7XG5cbiAgICBAVmlld0NoaWxkcmVuKElneENoaXBDb21wb25lbnQpXG4gICAgcHVibGljIGNoaXBzOiBRdWVyeUxpc3Q8SWd4Q2hpcENvbXBvbmVudD47XG5cbiAgICBwdWJsaWMgY2hpcEV4cHJlc3Npb25zOiBJR3JvdXBpbmdFeHByZXNzaW9uW107XG5cbiAgICAvKiogVGhlIG5hdGl2ZSBET00gZWxlbWVudC4gVXNlZCBpbiBzaXppbmcgY2FsY3VsYXRpb25zLiAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZXhwcmVzc2lvbnM6IElHcm91cGluZ0V4cHJlc3Npb25bXSA9IFtdO1xuICAgIHByaXZhdGUgX2Ryb3BBcmVhTWVzc2FnZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCkgeyB9XG5cblxuICAgIHB1YmxpYyBnZXQgZHJvcEFyZWFWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHRoaXMuZ3JpZC5jb2x1bW5JbkRyYWcgJiYgdGhpcy5ncmlkLmNvbHVtbkluRHJhZy5ncm91cGFibGUpIHx8XG4gICAgICAgICAgICAhdGhpcy5leHByZXNzaW9ucy5sZW5ndGg7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUtleURvd24oaWQ6IHN0cmluZywgZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucGxhdGZvcm0uaXNBY3RpdmF0aW9uS2V5KGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTb3J0aW5nKGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVDbGljayhpZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy5ncmlkLmdldENvbHVtbkJ5TmFtZShpZCkuZ3JvdXBhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVTb3J0aW5nKGlkKTtcbiAgICB9XG5cbiAgICAgcHVibGljIG9uRHJhZ0Ryb3AoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgZHJhZzogSWd4Q29sdW1uTW92aW5nRHJhZ0RpcmVjdGl2ZSA9IGV2ZW50LmRldGFpbC5vd25lcjtcbiAgICAgICAgaWYgKGRyYWcgaW5zdGFuY2VvZiBJZ3hDb2x1bW5Nb3ZpbmdEcmFnRGlyZWN0aXZlKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW4gPSBkcmFnLmNvbHVtbjtcbiAgICAgICAgICAgIGlmICghdGhpcy5ncmlkLmNvbHVtbkxpc3QuZmluZChjID0+IGMgPT09IGNvbHVtbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlzR3JvdXBlZCA9IHRoaXMuZXhwcmVzc2lvbnMuZmluZEluZGV4KChpdGVtKSA9PiBpdGVtLmZpZWxkTmFtZSA9PT0gY29sdW1uLmZpZWxkKSAhPT0gLTE7XG4gICAgICAgICAgICBpZiAoY29sdW1uLmdyb3VwYWJsZSAmJiAhaXNHcm91cGVkICYmICFjb2x1bW4uY29sdW1uR3JvdXAgJiYgISFjb2x1bW4uZmllbGQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBncm91cGluZ0V4cHJlc3Npb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogY29sdW1uLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICBkaXI6IHRoaXMuZ3JpZC5zb3J0aW5nRXhwcmVzc2lvbnMuZmluZChleHByID0+IGV4cHIuZmllbGROYW1lID09PSBjb2x1bW4uZmllbGQpPy5kaXIgfHwgU29ydGluZ0RpcmVjdGlvbi5Bc2MsXG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZUNhc2U6IGNvbHVtbi5zb3J0aW5nSWdub3JlQ2FzZSxcbiAgICAgICAgICAgICAgICAgICAgc3RyYXRlZ3k6IGNvbHVtbi5zb3J0U3RyYXRlZ3ksXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwaW5nQ29tcGFyZXI6IGNvbHVtbi5ncm91cGluZ0NvbXBhcmVyXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBCeShncm91cGluZ0V4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFJlb3JkZXJlZEV4cHJlc3Npb25zKGNoaXBzQXJyYXk6IElneENoaXBDb21wb25lbnRbXSkge1xuICAgICAgICBjb25zdCBuZXdFeHByZXNzaW9ucyA9IFtdO1xuXG4gICAgICAgIGNoaXBzQXJyYXkuZm9yRWFjaChjaGlwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLmV4cHJlc3Npb25zLmZpbmQoaXRlbSA9PiBpdGVtLmZpZWxkTmFtZSA9PT0gY2hpcC5pZCk7XG5cbiAgICAgICAgICAgIC8vIGRpc2FsbG93IGNoYW5naW5nIG9yZGVyIGlmIHRoZXJlIGFyZSBjb2x1bW5zIHdpdGggZ3JvdXBhYmxlOiBmYWxzZVxuICAgICAgICAgICAgaWYgKCF0aGlzLmdyaWQuZ2V0Q29sdW1uQnlOYW1lKGV4cHIuZmllbGROYW1lKT8uZ3JvdXBhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9ucy5wdXNoKGV4cHIpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3RXhwcmVzc2lvbnM7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVNvcnRpbmcoaWQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBleHByID0gdGhpcy5ncmlkLnNvcnRpbmdFeHByZXNzaW9ucy5maW5kKGUgPT4gZS5maWVsZE5hbWUgPT09IGlkKTtcbiAgICAgICAgZXhwci5kaXIgPSAzIC0gZXhwci5kaXI7XG4gICAgICAgIHRoaXMuZ3JpZC5zb3J0KGV4cHIpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBleHByZXNzaW9uc0NoYW5nZWQoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGhhbmRsZVJlb3JkZXIoZXZlbnQ6IElDaGlwc0FyZWFSZW9yZGVyRXZlbnRBcmdzKTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVNb3ZlRW5kKCk7XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgZ3JvdXBCeShleHByZXNzaW9uOiBJR3JvdXBpbmdFeHByZXNzaW9uKTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGVhckdyb3VwaW5nKG5hbWU6IHN0cmluZyk7XG5cbn1cblxuLyoqXG4gKiBBIHBpcGUgdG8gY2lyY3VtdmVudCB0aGUgdXNlIG9mIGdldHRlcnMvbWV0aG9kcyBqdXN0IHRvIGdldCBzb21lIGFkZGl0aW9uYWxcbiAqIGluZm9ybWF0aW9uIGZyb20gdGhlIGdyb3VwaW5nIGV4cHJlc3Npb24gYW5kIHBhc3MgaXQgdG8gdGhlIGNoaXAgcmVwcmVzZW50aW5nXG4gKiB0aGF0IGV4cHJlc3Npb24uXG4gKlxuICogQGhpZGRlbiBAaW50ZXJuYWxcbiAqL1xuQFBpcGUoeyBuYW1lOiAnaWd4R3JvdXBCeU1ldGEnIH0pXG5leHBvcnQgY2xhc3MgSWd4R3JvdXBCeU1ldGFQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgICBwdWJsaWMgdHJhbnNmb3JtKGtleTogc3RyaW5nLCBncmlkOiBHcmlkVHlwZSkge1xuICAgICAgICBjb25zdCBjb2x1bW4gPSBncmlkLmdldENvbHVtbkJ5TmFtZShrZXkpO1xuICAgICAgICByZXR1cm4geyBncm91cGFibGU6ICEhY29sdW1uPy5ncm91cGFibGUsIHRpdGxlOiBjb2x1bW4/LmhlYWRlciB8fCBrZXkgfTtcbiAgICB9XG59XG4iXX0=