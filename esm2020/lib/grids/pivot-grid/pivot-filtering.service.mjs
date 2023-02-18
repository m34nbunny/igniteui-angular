import { Injectable } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { FilteringLogic } from '../../data-operations/filtering-expression.interface';
import { FilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { DimensionValuesFilteringStrategy } from '../../data-operations/pivot-strategy';
import { IgxFilteringService } from '../filtering/grid-filtering.service';
import { PivotUtil } from './pivot-util';
import * as i0 from "@angular/core";
export class IgxPivotFilteringService extends IgxFilteringService {
    clearFilter(field) {
        this.clear_filter(field);
    }
    clear_filter(fieldName) {
        super.clear_filter(fieldName);
        const grid = this.grid;
        const allDimensions = grid.allDimensions;
        const allDimensionsFlat = PivotUtil.flatten(allDimensions);
        const dim = allDimensionsFlat.find(x => x.memberName === fieldName);
        dim.filter = undefined;
        grid.filteringPipeTrigger++;
        if (allDimensions.indexOf(dim) !== -1) {
            // update columns
            grid.setupColumns();
        }
    }
    filter_internal(fieldName, term, conditionOrExpressionsTree, ignoreCase) {
        super.filter_internal(fieldName, term, conditionOrExpressionsTree, ignoreCase);
        const grid = this.grid;
        const config = grid.pivotConfiguration;
        const allDimensions = PivotUtil.flatten(config.rows.concat(config.columns).concat(config.filters).filter(x => x !== null && x !== undefined));
        const enabledDimensions = allDimensions.filter(x => x && x.enabled);
        const dim = enabledDimensions.find(x => x.memberName === fieldName || x.member === fieldName);
        const filteringTree = dim.filter || new FilteringExpressionsTree(FilteringLogic.And);
        const fieldFilterIndex = filteringTree.findIndex(fieldName);
        if (fieldFilterIndex > -1) {
            filteringTree.filteringOperands.splice(fieldFilterIndex, 1);
        }
        this.prepare_filtering_expression(filteringTree, fieldName, term, conditionOrExpressionsTree, ignoreCase, fieldFilterIndex);
        dim.filter = filteringTree;
        grid.filteringPipeTrigger++;
        grid.filterStrategy = grid.filterStrategy ?? new DimensionValuesFilteringStrategy();
        if (allDimensions.indexOf(dim) !== -1) {
            // update columns
            grid.setupColumns();
        }
    }
    toggleFiltersESF(dropdown, element, column, shouldReattach) {
        const filterIcon = column.filteringExpressionsTree ? 'igx-excel-filter__icon--filtered' : 'igx-excel-filter__icon';
        const filterIconTarget = element.querySelector(`.${filterIcon}`) || element;
        const { id, ref } = this.grid.createFilterESF(dropdown, column, {
            ...this._filterMenuOverlaySettings,
            ...{ target: filterIconTarget }
        }, shouldReattach);
        this.filtersESFId = id;
        if (shouldReattach) {
            this._overlayService.opening
                .pipe(first(overlay => overlay.id === id), takeUntil(this.destroy$))
                .subscribe(() => this.lastActiveNode = this.grid.navigation.activeNode);
            this._overlayService.closed
                .pipe(first(overlay => overlay.id === id), takeUntil(this.destroy$))
                .subscribe(() => {
                this._overlayService.detach(id);
                ref?.destroy();
                this.grid.navigation.activeNode = this.lastActiveNode;
                this.grid.theadRow.nativeElement.focus();
            });
            this.grid.columnPinned.pipe(first()).subscribe(() => ref?.destroy());
            this._overlayService.show(id);
        }
    }
    hideESF() {
        this._overlayService.hide(this.filtersESFId);
    }
}
IgxPivotFilteringService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotFilteringService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
IgxPivotFilteringService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotFilteringService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotFilteringService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3QtZmlsdGVyaW5nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvcGl2b3QtZ3JpZC9waXZvdC1maWx0ZXJpbmcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSx3QkFBd0IsRUFBNkIsTUFBTSxrREFBa0QsQ0FBQztBQUN2SCxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUV4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUUxRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQUd6QyxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsbUJBQW1CO0lBR3RELFdBQVcsQ0FBQyxLQUFhO1FBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFpQjtRQUNqQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUE2QixDQUFDO1FBQ2hELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDekMsTUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNELE1BQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFV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O1lBQ3JFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVNLE9BQU87UUFDVixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDakQsQ0FBQzs7cUhBbEZRLHdCQUF3Qjt5SEFBeEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBRHBDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmaXJzdCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSUZpbHRlcmluZ09wZXJhdGlvbiB9IGZyb20gJy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctY29uZGl0aW9uJztcbmltcG9ydCB7IEZpbHRlcmluZ0xvZ2ljIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1leHByZXNzaW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsIElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZmlsdGVyaW5nLWV4cHJlc3Npb25zLXRyZWUnO1xuaW1wb3J0IHsgRGltZW5zaW9uVmFsdWVzRmlsdGVyaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvcGl2b3Qtc3RyYXRlZ3knO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vZmlsdGVyaW5nL2dyaWQtZmlsdGVyaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4UGl2b3RHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9waXZvdC1ncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQaXZvdFV0aWwgfSBmcm9tICcuL3Bpdm90LXV0aWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSWd4UGl2b3RGaWx0ZXJpbmdTZXJ2aWNlIGV4dGVuZHMgSWd4RmlsdGVyaW5nU2VydmljZSB7XG4gICAgcHJpdmF0ZSBmaWx0ZXJzRVNGSWQ7XG5cbiAgICBwdWJsaWMgY2xlYXJGaWx0ZXIoZmllbGQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsZWFyX2ZpbHRlcihmaWVsZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyX2ZpbHRlcihmaWVsZE5hbWU6IHN0cmluZykge1xuICAgICAgICBzdXBlci5jbGVhcl9maWx0ZXIoZmllbGROYW1lKTtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ3JpZCBhcyBJZ3hQaXZvdEdyaWRDb21wb25lbnQ7XG4gICAgICAgIGNvbnN0IGFsbERpbWVuc2lvbnMgPSBncmlkLmFsbERpbWVuc2lvbnM7XG4gICAgICAgIGNvbnN0IGFsbERpbWVuc2lvbnNGbGF0ID0gUGl2b3RVdGlsLmZsYXR0ZW4oYWxsRGltZW5zaW9ucyk7XG4gICAgICAgIGNvbnN0IGRpbSA9IGFsbERpbWVuc2lvbnNGbGF0LmZpbmQoeCA9PiB4Lm1lbWJlck5hbWUgPT09IGZpZWxkTmFtZSk7XG4gICAgICAgIGRpbS5maWx0ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIGdyaWQuZmlsdGVyaW5nUGlwZVRyaWdnZXIrKztcbiAgICAgICAgaWYgKGFsbERpbWVuc2lvbnMuaW5kZXhPZihkaW0pICE9PSAtMSkge1xuICAgICAgICAgICAgLy8gdXBkYXRlIGNvbHVtbnNcbiAgICAgICAgICAgIChncmlkIGFzIGFueSkuc2V0dXBDb2x1bW5zKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvdGVjdGVkIGZpbHRlcl9pbnRlcm5hbChmaWVsZE5hbWU6IHN0cmluZywgdGVybSwgY29uZGl0aW9uT3JFeHByZXNzaW9uc1RyZWU6IElGaWx0ZXJpbmdPcGVyYXRpb24gfCBJRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlLFxuICAgICAgICBpZ25vcmVDYXNlOiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyLmZpbHRlcl9pbnRlcm5hbChmaWVsZE5hbWUsIHRlcm0sIGNvbmRpdGlvbk9yRXhwcmVzc2lvbnNUcmVlLCBpZ25vcmVDYXNlKTtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgY29uc3QgY29uZmlnID0gKGdyaWQgYXMgSWd4UGl2b3RHcmlkQ29tcG9uZW50KS5waXZvdENvbmZpZ3VyYXRpb247XG4gICAgICAgIGNvbnN0IGFsbERpbWVuc2lvbnMgPSBQaXZvdFV0aWwuZmxhdHRlbihjb25maWcucm93cy5jb25jYXQoY29uZmlnLmNvbHVtbnMpLmNvbmNhdChjb25maWcuZmlsdGVycykuZmlsdGVyKHggPT4geCAhPT0gbnVsbCAmJiB4ICE9PSB1bmRlZmluZWQpKTtcbiAgICAgICAgY29uc3QgZW5hYmxlZERpbWVuc2lvbnMgPSBhbGxEaW1lbnNpb25zLmZpbHRlcih4ID0+IHggJiYgeC5lbmFibGVkKTtcbiAgICAgICAgY29uc3QgZGltID0gZW5hYmxlZERpbWVuc2lvbnMuZmluZCh4ID0+IHgubWVtYmVyTmFtZSA9PT0gZmllbGROYW1lIHx8IHgubWVtYmVyID09PSBmaWVsZE5hbWUpO1xuICAgICAgICBjb25zdCBmaWx0ZXJpbmdUcmVlID0gZGltLmZpbHRlciB8fCBuZXcgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlKEZpbHRlcmluZ0xvZ2ljLkFuZCk7XG4gICAgICAgIGNvbnN0IGZpZWxkRmlsdGVySW5kZXggPSBmaWx0ZXJpbmdUcmVlLmZpbmRJbmRleChmaWVsZE5hbWUpO1xuICAgICAgICBpZiAoZmllbGRGaWx0ZXJJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBmaWx0ZXJpbmdUcmVlLmZpbHRlcmluZ09wZXJhbmRzLnNwbGljZShmaWVsZEZpbHRlckluZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJlcGFyZV9maWx0ZXJpbmdfZXhwcmVzc2lvbihmaWx0ZXJpbmdUcmVlLCBmaWVsZE5hbWUsIHRlcm0sIGNvbmRpdGlvbk9yRXhwcmVzc2lvbnNUcmVlLCBpZ25vcmVDYXNlLCBmaWVsZEZpbHRlckluZGV4KTtcbiAgICAgICAgZGltLmZpbHRlciA9IGZpbHRlcmluZ1RyZWU7XG4gICAgICAgIGdyaWQuZmlsdGVyaW5nUGlwZVRyaWdnZXIrKztcbiAgICAgICAgZ3JpZC5maWx0ZXJTdHJhdGVneSA9IGdyaWQuZmlsdGVyU3RyYXRlZ3kgPz8gbmV3IERpbWVuc2lvblZhbHVlc0ZpbHRlcmluZ1N0cmF0ZWd5KCk7XG4gICAgICAgIGlmIChhbGxEaW1lbnNpb25zLmluZGV4T2YoZGltKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBjb2x1bW5zXG4gICAgICAgICAgICAoZ3JpZCBhcyBhbnkpLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZUZpbHRlcnNFU0YoZHJvcGRvd246IGFueSwgZWxlbWVudDogSFRNTEVsZW1lbnQsIGNvbHVtbjogQ29sdW1uVHlwZSwgc2hvdWxkUmVhdHRhY2g6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgZmlsdGVySWNvbiA9IGNvbHVtbi5maWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUgPyAnaWd4LWV4Y2VsLWZpbHRlcl9faWNvbi0tZmlsdGVyZWQnIDogJ2lneC1leGNlbC1maWx0ZXJfX2ljb24nO1xuICAgICAgICBjb25zdCBmaWx0ZXJJY29uVGFyZ2V0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuJHtmaWx0ZXJJY29ufWApIGFzIEhUTUxFbGVtZW50IHx8IGVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3QgeyBpZCwgcmVmIH0gPSAodGhpcy5ncmlkIGFzIElneFBpdm90R3JpZENvbXBvbmVudCkuY3JlYXRlRmlsdGVyRVNGKGRyb3Bkb3duLCBjb2x1bW4sIHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2ZpbHRlck1lbnVPdmVybGF5U2V0dGluZ3MsXG4gICAgICAgICAgICAuLi57IHRhcmdldDogZmlsdGVySWNvblRhcmdldCB9XG4gICAgICAgIH0sIHNob3VsZFJlYXR0YWNoKTtcblxuICAgICAgICB0aGlzLmZpbHRlcnNFU0ZJZCA9IGlkO1xuXG4gICAgICAgIGlmIChzaG91bGRSZWF0dGFjaCkge1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVNlcnZpY2Uub3BlbmluZ1xuICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICBmaXJzdChvdmVybGF5ID0+IG92ZXJsYXkuaWQgPT09IGlkKSxcbiAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5sYXN0QWN0aXZlTm9kZSA9IHRoaXMuZ3JpZC5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUpO1xuXG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5jbG9zZWRcbiAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Qob3ZlcmxheSA9PiBvdmVybGF5LmlkID09PSBpZCksXG4gICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVNlcnZpY2UuZGV0YWNoKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgcmVmPy5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5uYXZpZ2F0aW9uLmFjdGl2ZU5vZGUgPSB0aGlzLmxhc3RBY3RpdmVOb2RlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQudGhlYWRSb3cubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmdyaWQuY29sdW1uUGlubmVkLnBpcGUoZmlyc3QoKSkuc3Vic2NyaWJlKCgpID0+IHJlZj8uZGVzdHJveSgpKTtcbiAgICAgICAgICAgIHRoaXMuX292ZXJsYXlTZXJ2aWNlLnNob3coaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGVFU0YoKSB7XG4gICAgICAgIHRoaXMuX292ZXJsYXlTZXJ2aWNlLmhpZGUodGhpcy5maWx0ZXJzRVNGSWQpO1xuICAgIH1cbn1cbiJdfQ==