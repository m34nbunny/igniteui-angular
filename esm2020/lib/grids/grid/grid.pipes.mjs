import { Inject, Pipe } from '@angular/core';
import { cloneArray } from '../../core/utils';
import { DataUtil } from '../../data-operations/data-util';
import { FilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { IGX_GRID_BASE } from '../common/grid.interface';
import { FilterUtil } from '../../data-operations/filtering-strategy';
import { GridPagingMode } from '../common/enums';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxGridSortingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, expressions, sorting, id, pipeTrigger, pinned) {
        let result;
        if (!expressions.length) {
            result = collection;
        }
        else {
            result = DataUtil.sort(cloneArray(collection), expressions, sorting, this.grid);
        }
        this.grid.setFilteredSortedData(result, pinned);
        return result;
    }
}
IgxGridSortingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridSortingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxGridSortingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridSortingPipe, name: "gridSort" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridSortingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'gridSort' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * @hidden
 */
export class IgxGridGroupingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, expression, expansion, groupingStrategy, defaultExpanded, id, groupsRecords, _pipeTrigger) {
        const state = { expressions: [], expansion: [], defaultExpanded };
        state.expressions = this.grid.groupingExpressions;
        let result;
        const fullResult = { data: [], metadata: [] };
        if (!state.expressions.length) {
            // empty the array without changing reference
            groupsRecords.splice(0, groupsRecords.length);
            result = {
                data: collection,
                metadata: collection
            };
        }
        else {
            state.expansion = this.grid.groupingExpansionState;
            state.defaultExpanded = this.grid.groupsExpanded;
            result = DataUtil.group(cloneArray(collection), state, groupingStrategy, this.grid, groupsRecords, fullResult);
        }
        this.grid.groupingFlatResult = result.data;
        this.grid.groupingResult = fullResult.data;
        this.grid.groupingMetadata = fullResult.metadata;
        return result;
    }
}
IgxGridGroupingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridGroupingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxGridGroupingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridGroupingPipe, name: "gridGroupBy" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridGroupingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'gridGroupBy' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * @hidden
 */
export class IgxGridPagingPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, page = 0, perPage = 15, _id, _) {
        if (!this.grid.paginator || this.grid.pagingMode !== GridPagingMode.Local) {
            return collection;
        }
        const state = {
            index: page,
            recordsPerPage: perPage
        };
        const total = this.grid._totalRecords >= 0 ? this.grid._totalRecords : collection.data.length;
        DataUtil.correctPagingState(state, total);
        const result = {
            data: DataUtil.page(cloneArray(collection.data), state, total),
            metadata: DataUtil.page(cloneArray(collection.metadata), state, total)
        };
        if (this.grid.paginator && this.grid.paginator.page !== state.index) {
            this.grid.paginator.page = state.index;
        }
        this.grid.pagingState = state;
        return result;
    }
}
IgxGridPagingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridPagingPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxGridPagingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridPagingPipe, name: "gridPaging" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridPagingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'gridPaging' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
/**
 * @hidden
 */
export class IgxGridFilteringPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(collection, expressionsTree, filterStrategy, advancedExpressionsTree, id, pipeTrigger, filteringPipeTrigger, pinned) {
        const state = {
            expressionsTree,
            strategy: filterStrategy,
            advancedExpressionsTree
        };
        if (FilteringExpressionsTree.empty(state.expressionsTree) && FilteringExpressionsTree.empty(state.advancedExpressionsTree)) {
            return collection;
        }
        const result = FilterUtil.filter(cloneArray(collection), state, this.grid);
        this.grid.setFilteredData(result, pinned);
        return result;
    }
}
IgxGridFilteringPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridFilteringPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.ɵɵFactoryTarget.Pipe });
IgxGridFilteringPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridFilteringPipe, name: "gridFiltering" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridFilteringPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'gridFiltering' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5waXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9ncmlkL2dyaWQucGlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFHM0QsT0FBTyxFQUE2Qix3QkFBd0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBRXZILE9BQU8sRUFBWSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFzQixNQUFNLDBDQUEwQyxDQUFDO0FBQzFGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFJakQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sa0JBQWtCO0lBRTNCLFlBQTJDLElBQWM7UUFBZCxTQUFJLEdBQUosSUFBSSxDQUFVO0lBQUksQ0FBQztJQUV2RCxTQUFTLENBQUMsVUFBaUIsRUFBRSxXQUFpQyxFQUFFLE9BQTZCLEVBQ2hHLEVBQVUsRUFBRSxXQUFtQixFQUFFLE1BQU87UUFDeEMsSUFBSSxNQUFhLENBQUM7UUFFbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDckIsTUFBTSxHQUFHLFVBQVUsQ0FBQztTQUN2QjthQUFNO1lBQ0gsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25GO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxD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QUc7WUFDVixlQUFlO1lBQ2YsUUFBUSxFQUFFLGNBQWM7WUFDeEIsdUJBQXVCO1NBQzFCLENBQUM7UUFFRixJQUFJLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksd0JBQXdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO1lBQ3hILE9BQU8sVUFBVSxDQUFDO1NBQ3JCO1FBRUQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUMsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7aUhBcEJRLG9CQUFvQixrQkFFVCxhQUFhOytHQUZ4QixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUU7OzBCQUdkLE1BQU07MkJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY2xvbmVBcnJheSB9IGZyb20gJy4uLy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgRGF0YVV0aWwgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7IElHcm91cEJ5RXhwYW5kU3RhdGUgfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZ3JvdXBieS1leHBhbmQtc3RhdGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IElHcm91cEJ5UmVzdWx0IH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2dyb3VwaW5nLXJlc3VsdC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSwgRmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1leHByZXNzaW9ucy10cmVlJztcbmltcG9ydCB7IElHcm91cGluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZ3JvdXBpbmctZXhwcmVzc2lvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgR3JpZFR5cGUsIElHWF9HUklEX0JBU0UgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRmlsdGVyVXRpbCwgSUZpbHRlcmluZ1N0cmF0ZWd5IH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL2ZpbHRlcmluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBHcmlkUGFnaW5nTW9kZSB9IGZyb20gJy4uL2NvbW1vbi9lbnVtcyc7XG5pbXBvcnQgeyBJU29ydGluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBJR3JpZFNvcnRpbmdTdHJhdGVneSwgSUdyaWRHcm91cGluZ1N0cmF0ZWd5IH0gZnJvbSAnLi4vY29tbW9uL3N0cmF0ZWd5JztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBQaXBlKHsgbmFtZTogJ2dyaWRTb3J0JyB9KVxuZXhwb3J0IGNsYXNzIElneEdyaWRTb3J0aW5nUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChJR1hfR1JJRF9CQVNFKSBwcml2YXRlIGdyaWQ6IEdyaWRUeXBlKSB7IH1cblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oY29sbGVjdGlvbjogYW55W10sIGV4cHJlc3Npb25zOiBJU29ydGluZ0V4cHJlc3Npb25bXSwgc29ydGluZzogSUdyaWRTb3J0aW5nU3RyYXRlZ3ksXG4gICAgICAgIGlkOiBzdHJpbmcsIHBpcGVUcmlnZ2VyOiBudW1iZXIsIHBpbm5lZD8pOiBhbnlbXSB7XG4gICAgICAgIGxldCByZXN1bHQ6IGFueVtdO1xuXG4gICAgICAgIGlmICghZXhwcmVzc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBjb2xsZWN0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gRGF0YVV0aWwuc29ydChjbG9uZUFycmF5KGNvbGxlY3Rpb24pLCBleHByZXNzaW9ucywgc29ydGluZywgdGhpcy5ncmlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyaWQuc2V0RmlsdGVyZWRTb3J0ZWREYXRhKHJlc3VsdCwgcGlubmVkKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBQaXBlKHsgbmFtZTogJ2dyaWRHcm91cEJ5JyB9KVxuZXhwb3J0IGNsYXNzIElneEdyaWRHcm91cGluZ1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoSUdYX0dSSURfQkFTRSkgcHJpdmF0ZSBncmlkOiBHcmlkVHlwZSkgeyB9XG5cbiAgICBwdWJsaWMgdHJhbnNmb3JtKGNvbGxlY3Rpb246IGFueVtdLCBleHByZXNzaW9uOiBJR3JvdXBpbmdFeHByZXNzaW9uIHwgSUdyb3VwaW5nRXhwcmVzc2lvbltdLFxuICAgICAgICBleHBhbnNpb246IElHcm91cEJ5RXhwYW5kU3RhdGUgfCBJR3JvdXBCeUV4cGFuZFN0YXRlW10sXG4gICAgICAgIGdyb3VwaW5nU3RyYXRlZ3k6IElHcmlkR3JvdXBpbmdTdHJhdGVneSwgZGVmYXVsdEV4cGFuZGVkOiBib29sZWFuLFxuICAgICAgICBpZDogc3RyaW5nLCBncm91cHNSZWNvcmRzOiBhbnlbXSwgX3BpcGVUcmlnZ2VyOiBudW1iZXIpOiBJR3JvdXBCeVJlc3VsdCB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB7IGV4cHJlc3Npb25zOiBbXSwgZXhwYW5zaW9uOiBbXSwgZGVmYXVsdEV4cGFuZGVkIH07XG4gICAgICAgIHN0YXRlLmV4cHJlc3Npb25zID0gdGhpcy5ncmlkLmdyb3VwaW5nRXhwcmVzc2lvbnM7XG4gICAgICAgIGxldCByZXN1bHQ6IElHcm91cEJ5UmVzdWx0O1xuICAgICAgICBjb25zdCBmdWxsUmVzdWx0OiBJR3JvdXBCeVJlc3VsdCA9IHsgZGF0YTogW10sIG1ldGFkYXRhOiBbXSB9O1xuXG4gICAgICAgIGlmICghc3RhdGUuZXhwcmVzc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBlbXB0eSB0aGUgYXJyYXkgd2l0aG91dCBjaGFuZ2luZyByZWZlcmVuY2VcbiAgICAgICAgICAgIGdyb3Vwc1JlY29yZHMuc3BsaWNlKDAsIGdyb3Vwc1JlY29yZHMubGVuZ3RoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGFkYXRhOiBjb2xsZWN0aW9uXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUuZXhwYW5zaW9uID0gdGhpcy5ncmlkLmdyb3VwaW5nRXhwYW5zaW9uU3RhdGU7XG4gICAgICAgICAgICBzdGF0ZS5kZWZhdWx0RXhwYW5kZWQgPSB0aGlzLmdyaWQuZ3JvdXBzRXhwYW5kZWQ7XG4gICAgICAgICAgICByZXN1bHQgPSBEYXRhVXRpbC5ncm91cChjbG9uZUFycmF5KGNvbGxlY3Rpb24pLCBzdGF0ZSwgZ3JvdXBpbmdTdHJhdGVneSwgdGhpcy5ncmlkLCBncm91cHNSZWNvcmRzLCBmdWxsUmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyaWQuZ3JvdXBpbmdGbGF0UmVzdWx0ID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRoaXMuZ3JpZC5ncm91cGluZ1Jlc3VsdCA9IGZ1bGxSZXN1bHQuZGF0YTtcbiAgICAgICAgdGhpcy5ncmlkLmdyb3VwaW5nTWV0YWRhdGEgPSBmdWxsUmVzdWx0Lm1ldGFkYXRhO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBQaXBlKHsgbmFtZTogJ2dyaWRQYWdpbmcnIH0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZFBhZ2luZ1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoSUdYX0dSSURfQkFTRSkgcHJpdmF0ZSBncmlkOiBHcmlkVHlwZSkgeyB9XG5cbiAgICBwdWJsaWMgdHJhbnNmb3JtKGNvbGxlY3Rpb246IElHcm91cEJ5UmVzdWx0LCBwYWdlID0gMCwgcGVyUGFnZSA9IDE1LCBfaWQ6IHN0cmluZywgXzogbnVtYmVyKTogSUdyb3VwQnlSZXN1bHQge1xuICAgICAgICBpZiAoIXRoaXMuZ3JpZC5wYWdpbmF0b3IgfHwgdGhpcy5ncmlkLnBhZ2luZ01vZGUgIT09IEdyaWRQYWdpbmdNb2RlLkxvY2FsKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGluZGV4OiBwYWdlLFxuICAgICAgICAgICAgcmVjb3Jkc1BlclBhZ2U6IHBlclBhZ2VcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdG90YWwgPSB0aGlzLmdyaWQuX3RvdGFsUmVjb3JkcyA+PSAwID8gdGhpcy5ncmlkLl90b3RhbFJlY29yZHMgOiBjb2xsZWN0aW9uLmRhdGEubGVuZ3RoO1xuICAgICAgICBEYXRhVXRpbC5jb3JyZWN0UGFnaW5nU3RhdGUoc3RhdGUsIHRvdGFsKTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICBkYXRhOiBEYXRhVXRpbC5wYWdlKGNsb25lQXJyYXkoY29sbGVjdGlvbi5kYXRhKSwgc3RhdGUsIHRvdGFsKSxcbiAgICAgICAgICAgIG1ldGFkYXRhOiBEYXRhVXRpbC5wYWdlKGNsb25lQXJyYXkoY29sbGVjdGlvbi5tZXRhZGF0YSksIHN0YXRlLCB0b3RhbClcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5wYWdpbmF0b3IgJiYgdGhpcy5ncmlkLnBhZ2luYXRvci5wYWdlICE9PSBzdGF0ZS5pbmRleCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnBhZ2luYXRvci5wYWdlID0gc3RhdGUuaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmlkLnBhZ2luZ1N0YXRlID0gc3RhdGU7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQFBpcGUoeyBuYW1lOiAnZ3JpZEZpbHRlcmluZycgfSlcbmV4cG9ydCBjbGFzcyBJZ3hHcmlkRmlsdGVyaW5nUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChJR1hfR1JJRF9CQVNFKSBwcml2YXRlIGdyaWQ6IEdyaWRUeXBlKSB7IH1cblxuICAgIHB1YmxpYyB0cmFuc2Zvcm0oY29sbGVjdGlvbjogYW55W10sIGV4cHJlc3Npb25zVHJlZTogSUZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZSxcbiAgICAgICAgZmlsdGVyU3RyYXRlZ3k6IElGaWx0ZXJpbmdTdHJhdGVneSxcbiAgICAgICAgYWR2YW5jZWRFeHByZXNzaW9uc1RyZWU6IElGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUsIGlkOiBzdHJpbmcsIHBpcGVUcmlnZ2VyOiBudW1iZXIsIGZpbHRlcmluZ1BpcGVUcmlnZ2VyOiBudW1iZXIsIHBpbm5lZD8pIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgICAgICBleHByZXNzaW9uc1RyZWUsXG4gICAgICAgICAgICBzdHJhdGVneTogZmlsdGVyU3RyYXRlZ3ksXG4gICAgICAgICAgICBhZHZhbmNlZEV4cHJlc3Npb25zVHJlZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZW1wdHkoc3RhdGUuZXhwcmVzc2lvbnNUcmVlKSAmJiBGaWx0ZXJpbmdFeHByZXNzaW9uc1RyZWUuZW1wdHkoc3RhdGUuYWR2YW5jZWRFeHByZXNzaW9uc1RyZWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IEZpbHRlclV0aWwuZmlsdGVyKGNsb25lQXJyYXkoY29sbGVjdGlvbiksIHN0YXRlLCB0aGlzLmdyaWQpO1xuICAgICAgICB0aGlzLmdyaWQuc2V0RmlsdGVyZWREYXRhKHJlc3VsdCwgcGlubmVkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iXX0=