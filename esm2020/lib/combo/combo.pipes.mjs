import { Inject, Pipe } from '@angular/core';
import { cloneArray } from '../core/utils';
import { DataUtil } from '../data-operations/data-util';
import { IGX_COMBO_COMPONENT } from './combo.common';
import { DefaultSortingStrategy } from '../data-operations/sorting-strategy';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxComboCleanPipe {
    transform(collection) {
        return collection.filter(e => !!e);
    }
}
IgxComboCleanPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboCleanPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxComboCleanPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboCleanPipe, name: "comboClean" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboCleanPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'comboClean'
                }]
        }] });
/** @hidden */
export class IgxComboFilteringPipe {
    transform(collection, searchValue, displayKey, filteringOptions, shouldFilter = false) {
        if (!collection) {
            return [];
        }
        if (!searchValue || !shouldFilter) {
            return collection;
        }
        else {
            const searchTerm = filteringOptions.caseSensitive ? searchValue.trim() : searchValue.toLowerCase().trim();
            if (displayKey != null) {
                return collection.filter(e => filteringOptions.caseSensitive ? e[displayKey]?.includes(searchTerm) :
                    e[displayKey]?.toString().toLowerCase().includes(searchTerm));
            }
            else {
                return collection.filter(e => filteringOptions.caseSensitive ? e.includes(searchTerm) :
                    e.toString().toLowerCase().includes(searchTerm));
            }
        }
    }
}
IgxComboFilteringPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboFilteringPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxComboFilteringPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboFilteringPipe, name: "comboFiltering" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboFilteringPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'comboFiltering'
                }]
        }] });
/** @hidden */
export class IgxComboGroupingPipe {
    constructor(combo) {
        this.combo = combo;
    }
    transform(collection, groupKey, valueKey, sortingDirection) {
        this.combo.filteredData = collection;
        if ((!groupKey && groupKey !== 0) || !collection.length) {
            return collection;
        }
        const sorted = DataUtil.sort(cloneArray(collection), [{
                fieldName: groupKey,
                dir: sortingDirection,
                ignoreCase: true,
                strategy: DefaultSortingStrategy.instance()
            }]);
        const data = cloneArray(sorted);
        let inserts = 0;
        let currentHeader = null;
        for (let i = 0; i < sorted.length; i++) {
            let insertFlag = 0;
            if (currentHeader !== sorted[i][groupKey]) {
                currentHeader = sorted[i][groupKey];
                insertFlag = 1;
            }
            if (insertFlag) {
                data.splice(i + inserts, 0, {
                    [valueKey]: currentHeader,
                    [groupKey]: currentHeader,
                    isHeader: true
                });
                inserts++;
            }
        }
        return data;
    }
}
IgxComboGroupingPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboGroupingPipe, deps: [{ token: IGX_COMBO_COMPONENT }], target: i0.ɵɵFactoryTarget.Pipe });
IgxComboGroupingPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboGroupingPipe, name: "comboGrouping" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboGroupingPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'comboGrouping' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_COMBO_COMPONENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm8ucGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvY29tYm8vY29tYm8ucGlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxtQkFBbUIsRUFBZ0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsc0JBQXNCLEVBQW9CLE1BQU0scUNBQXFDLENBQUM7O0FBRy9GLGNBQWM7QUFJZCxNQUFNLE9BQU8saUJBQWlCO0lBQ25CLFNBQVMsQ0FBQyxVQUFpQjtRQUM5QixPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7OEdBSFEsaUJBQWlCOzRHQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFIN0IsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsWUFBWTtpQkFDckI7O0FBT0QsY0FBYztBQUlkLE1BQU0sT0FBTyxxQkFBcUI7SUFDdkIsU0FBUyxDQUFDLFVBQWlCLEVBQUUsV0FBZ0IsRUFBRSxVQUFlLEVBQ2pFLGdCQUF3QyxFQUFFLFlBQVksR0FBRyxLQUFLO1FBQzlELElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDYixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUMvQixPQUFPLFVBQVUsQ0FBQztTQUNyQjthQUFNO1lBQ0gsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FB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OUIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFOzswQkFHZCxNQUFNOzJCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY2xvbmVBcnJheSB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgRGF0YVV0aWwgfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7IElHWF9DT01CT19DT01QT05FTlQsIElneENvbWJvQmFzZSB9IGZyb20gJy4vY29tYm8uY29tbW9uJztcbmltcG9ydCB7IERlZmF1bHRTb3J0aW5nU3RyYXRlZ3ksIFNvcnRpbmdEaXJlY3Rpb24gfSBmcm9tICcuLi9kYXRhLW9wZXJhdGlvbnMvc29ydGluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBJQ29tYm9GaWx0ZXJpbmdPcHRpb25zIH0gZnJvbSAnLi9jb21iby5jb21wb25lbnQnO1xuXG4vKiogQGhpZGRlbiAqL1xuQFBpcGUoe1xuICAgIG5hbWU6ICdjb21ib0NsZWFuJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hDb21ib0NsZWFuUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAgIHB1YmxpYyB0cmFuc2Zvcm0oY29sbGVjdGlvbjogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyKGUgPT4gISFlKTtcbiAgICB9XG59XG5cbi8qKiBAaGlkZGVuICovXG5AUGlwZSh7XG4gICAgbmFtZTogJ2NvbWJvRmlsdGVyaW5nJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hDb21ib0ZpbHRlcmluZ1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBwdWJsaWMgdHJhbnNmb3JtKGNvbGxlY3Rpb246IGFueVtdLCBzZWFyY2hWYWx1ZTogYW55LCBkaXNwbGF5S2V5OiBhbnksXG4gICAgICAgIGZpbHRlcmluZ09wdGlvbnM6IElDb21ib0ZpbHRlcmluZ09wdGlvbnMsIHNob3VsZEZpbHRlciA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VhcmNoVmFsdWUgfHwgIXNob3VsZEZpbHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gZmlsdGVyaW5nT3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gc2VhcmNoVmFsdWUudHJpbSgpIDogc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgICAgICAgICBpZiAoZGlzcGxheUtleSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyKGUgPT4gZmlsdGVyaW5nT3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gZVtkaXNwbGF5S2V5XT8uaW5jbHVkZXMoc2VhcmNoVGVybSkgOlxuICAgICAgICAgICAgICAgICAgICBlW2Rpc3BsYXlLZXldPy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5maWx0ZXIoZSA9PiBmaWx0ZXJpbmdPcHRpb25zLmNhc2VTZW5zaXRpdmUgPyBlLmluY2x1ZGVzKHNlYXJjaFRlcm0pIDpcbiAgICAgICAgICAgICAgICAgICAgZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKiogQGhpZGRlbiAqL1xuQFBpcGUoeyBuYW1lOiAnY29tYm9Hcm91cGluZycgfSlcbmV4cG9ydCBjbGFzcyBJZ3hDb21ib0dyb3VwaW5nUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChJR1hfQ09NQk9fQ09NUE9ORU5UKSBwdWJsaWMgY29tYm86IElneENvbWJvQmFzZSkgeyB9XG5cbiAgICBwdWJsaWMgdHJhbnNmb3JtKGNvbGxlY3Rpb246IGFueVtdLCBncm91cEtleTogYW55LCB2YWx1ZUtleTogYW55LCBzb3J0aW5nRGlyZWN0aW9uOiBTb3J0aW5nRGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuY29tYm8uZmlsdGVyZWREYXRhID0gY29sbGVjdGlvbjtcbiAgICAgICAgaWYgKCghZ3JvdXBLZXkgJiYgZ3JvdXBLZXkgIT09IDApIHx8ICFjb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29ydGVkID0gRGF0YVV0aWwuc29ydChjbG9uZUFycmF5KGNvbGxlY3Rpb24pLCBbe1xuICAgICAgICAgICAgZmllbGROYW1lOiBncm91cEtleSxcbiAgICAgICAgICAgIGRpcjogc29ydGluZ0RpcmVjdGlvbixcbiAgICAgICAgICAgIGlnbm9yZUNhc2U6IHRydWUsXG4gICAgICAgICAgICBzdHJhdGVneTogRGVmYXVsdFNvcnRpbmdTdHJhdGVneS5pbnN0YW5jZSgpXG4gICAgICAgIH1dKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNsb25lQXJyYXkoc29ydGVkKTtcbiAgICAgICAgbGV0IGluc2VydHMgPSAwO1xuICAgICAgICBsZXQgY3VycmVudEhlYWRlciA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29ydGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaW5zZXJ0RmxhZyA9IDA7XG4gICAgICAgICAgICBpZiAoY3VycmVudEhlYWRlciAhPT0gc29ydGVkW2ldW2dyb3VwS2V5XSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRIZWFkZXIgPSBzb3J0ZWRbaV1bZ3JvdXBLZXldO1xuICAgICAgICAgICAgICAgIGluc2VydEZsYWcgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluc2VydEZsYWcpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnNwbGljZShpICsgaW5zZXJ0cywgMCwge1xuICAgICAgICAgICAgICAgICAgICBbdmFsdWVLZXldOiBjdXJyZW50SGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICBbZ3JvdXBLZXldOiBjdXJyZW50SGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICBpc0hlYWRlcjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGluc2VydHMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG59XG4iXX0=