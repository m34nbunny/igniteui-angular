import { Inject, Pipe } from '@angular/core';
import { GridSummaryCalculationMode, GridSummaryPosition } from '../common/enums';
import { IGX_GRID_BASE } from '../common/grid.interface';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxTreeGridSummaryPipe {
    constructor(grid) {
        this.grid = grid;
    }
    transform(flatData, hasSummary, summaryCalculationMode, summaryPosition, showSummaryOnCollapse, _, __) {
        if (!flatData || !hasSummary || summaryCalculationMode === GridSummaryCalculationMode.rootLevelOnly) {
            return flatData;
        }
        return this.addSummaryRows(this.grid, flatData, summaryPosition, showSummaryOnCollapse);
    }
    addSummaryRows(grid, collection, summaryPosition, showSummaryOnCollapse) {
        const recordsWithSummary = [];
        const maxSummaryHeight = grid.summaryService.calcMaxSummaryHeight();
        for (const record of collection) {
            recordsWithSummary.push(record);
            const isCollapsed = !record.expanded && record.children && record.children.length > 0 && showSummaryOnCollapse;
            if (isCollapsed) {
                let childData = record.children.filter(r => !r.isFilteredOutParent).map(r => r.data);
                childData = this.removeDeletedRecord(grid, record.key, childData);
                const summaries = grid.summaryService.calculateSummaries(record.key, childData);
                const summaryRecord = {
                    summaries,
                    max: maxSummaryHeight,
                    cellIndentation: record.level + 1
                };
                recordsWithSummary.push(summaryRecord);
            }
            const isExpanded = record.children && record.children.length > 0 && record.expanded;
            if (summaryPosition === GridSummaryPosition.bottom && !isExpanded) {
                let childRecord = record;
                let parent = record.parent;
                while (parent) {
                    const children = parent.children;
                    if (children[children.length - 1] === childRecord) {
                        let childData = children.filter(r => !r.isFilteredOutParent).map(r => r.data);
                        childData = this.removeDeletedRecord(grid, parent.key, childData);
                        const summaries = grid.summaryService.calculateSummaries(parent.key, childData);
                        const summaryRecord = {
                            summaries,
                            max: maxSummaryHeight,
                            cellIndentation: parent.level + 1
                        };
                        recordsWithSummary.push(summaryRecord);
                        childRecord = parent;
                        parent = childRecord.parent;
                    }
                    else {
                        break;
                    }
                }
            }
            else if (summaryPosition === GridSummaryPosition.top && isExpanded) {
                let childData = record.children.filter(r => !r.isFilteredOutParent).map(r => r.data);
                childData = this.removeDeletedRecord(grid, record.key, childData);
                const summaries = grid.summaryService.calculateSummaries(record.key, childData);
                const summaryRecord = {
                    summaries,
                    max: maxSummaryHeight,
                    cellIndentation: record.level + 1
                };
                recordsWithSummary.push(summaryRecord);
            }
        }
        return recordsWithSummary;
    }
    removeDeletedRecord(grid, rowId, data) {
        if (!grid.transactions.enabled || !grid.cascadeOnDelete) {
            return data;
        }
        const deletedRows = grid.transactions.getTransactionLog().filter(t => t.type === 'delete').map(t => t.id);
        let row = grid.records.get(rowId);
        if (!row && deletedRows.lenght === 0) {
            return [];
        }
        row = row.children ? row : row.parent;
        while (row) {
            rowId = row.key;
            if (deletedRows.indexOf(rowId) !== -1) {
                return [];
            }
            row = row.parent;
        }
        deletedRows.forEach(rowID => {
            const tempData = grid.primaryKey ? data.map(rec => rec[grid.primaryKey]) : data;
            const index = tempData.indexOf(rowID);
            if (index !== -1) {
                data.splice(index, 1);
            }
        });
        return data;
    }
}
IgxTreeGridSummaryPipe.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridSummaryPipe, deps: [{ token: IGX_GRID_BASE }], target: i0.????FactoryTarget.Pipe });
IgxTreeGridSummaryPipe.??pipe = i0.????ngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridSummaryPipe, name: "treeGridSummary" });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridSummaryPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'treeGridSummary' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_GRID_BASE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ncmlkLnN1bW1hcnkucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy90cmVlLWdyaWQvdHJlZS1ncmlkLnN1bW1hcnkucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFHNUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEYsT0FBTyxFQUFZLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQUVuRSxjQUFjO0FBRWQsTUFBTSxPQUFPLHNCQUFzQjtJQUUvQixZQUEyQyxJQUFjO1FBQWQsU0FBSSxHQUFKLElBQUksQ0FBVTtJQUFHLENBQUM7SUFFdEQsU0FBUyxDQUFDLFFBQTJCLEVBQ3hDLFVBQW1CLEVBQ25CLHNCQUFrRCxFQUNsRCxlQUFvQyxFQUFFLHFCQUE4QixFQUFFLENBQVMsRUFBRSxFQUFVO1FBRTNGLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxVQUFVLElBQUksc0JBQXNCLEtBQUssMEJBQTBCLENBQUMsYUFBYSxFQUFFO1lBQ2pHLE9BQU8sUUFBUSxDQUFDO1NBQ25CO1FBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFTyxjQUFjLENBQUMsSUFBYyxFQUFFLFVBQTZCLEVBQ2hFLGVBQW9DLEVBQUUscUJBQThCO1FBQ3BFLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQzlCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRXBFLEtBQUssTUFBTSxNQUFNLElBQUksVUFB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QVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3RDLE9BQU8sR0FBRyxFQUFFO1lBQ1IsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDaEIsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQzthQUNiO1lBQ0QsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7U0FDcEI7UUFDRCxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNoRixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzttSEFyR1Esc0JBQXNCLGtCQUVYLGFBQWE7aUhBRnhCLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxJQUFJO21CQUFDLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFDOzswQkFHZCxNQUFNOzJCQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElUcmVlR3JpZFJlY29yZCB9IGZyb20gJy4vdHJlZS1ncmlkLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgSVN1bW1hcnlSZWNvcmQgfSBmcm9tICcuLi9zdW1tYXJpZXMvZ3JpZC1zdW1tYXJ5JztcbmltcG9ydCB7IEdyaWRTdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlLCBHcmlkU3VtbWFyeVBvc2l0aW9uIH0gZnJvbSAnLi4vY29tbW9uL2VudW1zJztcbmltcG9ydCB7IEdyaWRUeXBlLCBJR1hfR1JJRF9CQVNFIH0gZnJvbSAnLi4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcblxuLyoqIEBoaWRkZW4gKi9cbkBQaXBlKHtuYW1lOiAndHJlZUdyaWRTdW1tYXJ5J30pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUdyaWRTdW1tYXJ5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChJR1hfR1JJRF9CQVNFKSBwcml2YXRlIGdyaWQ6IEdyaWRUeXBlKSB7fVxuXG4gICAgcHVibGljIHRyYW5zZm9ybShmbGF0RGF0YTogSVRyZWVHcmlkUmVjb3JkW10sXG4gICAgICAgIGhhc1N1bW1hcnk6IGJvb2xlYW4sXG4gICAgICAgIHN1bW1hcnlDYWxjdWxhdGlvbk1vZGU6IEdyaWRTdW1tYXJ5Q2FsY3VsYXRpb25Nb2RlLFxuICAgICAgICBzdW1tYXJ5UG9zaXRpb246IEdyaWRTdW1tYXJ5UG9zaXRpb24sIHNob3dTdW1tYXJ5T25Db2xsYXBzZTogYm9vbGVhbiwgXzogbnVtYmVyLCBfXzogbnVtYmVyKTogYW55W10ge1xuXG4gICAgICAgIGlmICghZmxhdERhdGEgfHwgIWhhc1N1bW1hcnkgfHwgc3VtbWFyeUNhbGN1bGF0aW9uTW9kZSA9PT0gR3JpZFN1bW1hcnlDYWxjdWxhdGlvbk1vZGUucm9vdExldmVsT25seSkge1xuICAgICAgICAgICAgcmV0dXJuIGZsYXREYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU3VtbWFyeVJvd3ModGhpcy5ncmlkLCBmbGF0RGF0YSwgc3VtbWFyeVBvc2l0aW9uLCBzaG93U3VtbWFyeU9uQ29sbGFwc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkU3VtbWFyeVJvd3MoZ3JpZDogR3JpZFR5cGUsIGNvbGxlY3Rpb246IElUcmVlR3JpZFJlY29yZFtdLFxuICAgICAgICBzdW1tYXJ5UG9zaXRpb246IEdyaWRTdW1tYXJ5UG9zaXRpb24sIHNob3dTdW1tYXJ5T25Db2xsYXBzZTogYm9vbGVhbik6IGFueVtdIHtcbiAgICAgICAgY29uc3QgcmVjb3Jkc1dpdGhTdW1tYXJ5ID0gW107XG4gICAgICAgIGNvbnN0IG1heFN1bW1hcnlIZWlnaHQgPSBncmlkLnN1bW1hcnlTZXJ2aWNlLmNhbGNNYXhTdW1tYXJ5SGVpZ2h0KCk7XG5cbiAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgY29sbGVjdGlvbikge1xuICAgICAgICAgICAgcmVjb3Jkc1dpdGhTdW1tYXJ5LnB1c2gocmVjb3JkKTtcblxuICAgICAgICAgICAgY29uc3QgaXNDb2xsYXBzZWQgPSAhcmVjb3JkLmV4cGFuZGVkICYmIHJlY29yZC5jaGlsZHJlbiAmJiByZWNvcmQuY2hpbGRyZW4ubGVuZ3RoID4gMCAmJiBzaG93U3VtbWFyeU9uQ29sbGFwc2U7XG4gICAgICAgICAgICBpZiAoaXNDb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGREYXRhID0gcmVjb3JkLmNoaWxkcmVuLmZpbHRlcihyID0+ICFyLmlzRmlsdGVyZWRPdXRQYXJlbnQpLm1hcChyID0+IHIuZGF0YSk7XG4gICAgICAgICAgICAgICAgY2hpbGREYXRhID0gdGhpcy5yZW1vdmVEZWxldGVkUmVjb3JkKGdyaWQsIHJlY29yZC5rZXksIGNoaWxkRGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtbWFyaWVzID0gZ3JpZC5zdW1tYXJ5U2VydmljZS5jYWxjdWxhdGVTdW1tYXJpZXMocmVjb3JkLmtleSwgY2hpbGREYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5UmVjb3JkOiBJU3VtbWFyeVJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyaWVzLFxuICAgICAgICAgICAgICAgICAgICBtYXg6IG1heFN1bW1hcnlIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxJbmRlbnRhdGlvbjogcmVjb3JkLmxldmVsICsgMVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVjb3Jkc1dpdGhTdW1tYXJ5LnB1c2goc3VtbWFyeVJlY29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpc0V4cGFuZGVkID0gcmVjb3JkLmNoaWxkcmVuICYmIHJlY29yZC5jaGlsZHJlbi5sZW5ndGggPiAwICYmIHJlY29yZC5leHBhbmRlZDtcbiAgICAgICAgICAgIGlmIChzdW1tYXJ5UG9zaXRpb24gPT09IEdyaWRTdW1tYXJ5UG9zaXRpb24uYm90dG9tICYmICFpc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkUmVjb3JkID0gcmVjb3JkO1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSByZWNvcmQucGFyZW50O1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlbjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0gPT09IGNoaWxkUmVjb3JkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkRGF0YSA9IGNoaWxkcmVuLmZpbHRlcihyID0+ICFyLmlzRmlsdGVyZWRPdXRQYXJlbnQpLm1hcChyID0+IHIuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZERhdGEgPSB0aGlzLnJlbW92ZURlbGV0ZWRSZWNvcmQoZ3JpZCwgcGFyZW50LmtleSwgY2hpbGREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1bW1hcmllcyA9IGdyaWQuc3VtbWFyeVNlcnZpY2UuY2FsY3VsYXRlU3VtbWFyaWVzKHBhcmVudC5rZXksIGNoaWxkRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5UmVjb3JkOiBJU3VtbWFyeVJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdW1tYXJpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4OiBtYXhTdW1tYXJ5SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxJbmRlbnRhdGlvbjogcGFyZW50LmxldmVsICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZHNXaXRoU3VtbWFyeS5wdXNoKHN1bW1hcnlSZWNvcmQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFJlY29yZCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGNoaWxkUmVjb3JkLnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdW1tYXJ5UG9zaXRpb24gPT09IEdyaWRTdW1tYXJ5UG9zaXRpb24udG9wICYmIGlzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGREYXRhID0gcmVjb3JkLmNoaWxkcmVuLmZpbHRlcihyID0+ICFyLmlzRmlsdGVyZWRPdXRQYXJlbnQpLm1hcChyID0+IHIuZGF0YSk7XG4gICAgICAgICAgICAgICAgY2hpbGREYXRhID0gdGhpcy5yZW1vdmVEZWxldGVkUmVjb3JkKGdyaWQsIHJlY29yZC5rZXksIGNoaWxkRGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtbWFyaWVzID0gZ3JpZC5zdW1tYXJ5U2VydmljZS5jYWxjdWxhdGVTdW1tYXJpZXMocmVjb3JkLmtleSwgY2hpbGREYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5UmVjb3JkOiBJU3VtbWFyeVJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyaWVzLFxuICAgICAgICAgICAgICAgICAgICBtYXg6IG1heFN1bW1hcnlIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxJbmRlbnRhdGlvbjogcmVjb3JkLmxldmVsICsgMVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVjb3Jkc1dpdGhTdW1tYXJ5LnB1c2goc3VtbWFyeVJlY29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlY29yZHNXaXRoU3VtbWFyeTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZURlbGV0ZWRSZWNvcmQoZ3JpZCwgcm93SWQsIGRhdGEpIHtcbiAgICAgICAgaWYgKCFncmlkLnRyYW5zYWN0aW9ucy5lbmFibGVkIHx8ICFncmlkLmNhc2NhZGVPbkRlbGV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVsZXRlZFJvd3MgPSBncmlkLnRyYW5zYWN0aW9ucy5nZXRUcmFuc2FjdGlvbkxvZygpLmZpbHRlcih0ID0+IHQudHlwZSA9PT0gJ2RlbGV0ZScpLm1hcCh0ID0+IHQuaWQpO1xuICAgICAgICBsZXQgcm93ID0gZ3JpZC5yZWNvcmRzLmdldChyb3dJZCk7XG4gICAgICAgIGlmICghcm93ICYmIGRlbGV0ZWRSb3dzLmxlbmdodCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJvdyA9IHJvdy5jaGlsZHJlbiA/IHJvdyA6IHJvdy5wYXJlbnQ7XG4gICAgICAgIHdoaWxlIChyb3cpIHtcbiAgICAgICAgICAgIHJvd0lkID0gcm93LmtleTtcbiAgICAgICAgICAgIGlmIChkZWxldGVkUm93cy5pbmRleE9mKHJvd0lkKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3cgPSByb3cucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZWRSb3dzLmZvckVhY2gocm93SUQgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGVtcERhdGEgPSBncmlkLnByaW1hcnlLZXkgPyBkYXRhLm1hcChyZWMgPT4gcmVjW2dyaWQucHJpbWFyeUtleV0pIDogZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGVtcERhdGEuaW5kZXhPZihyb3dJRCk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufVxuIl19