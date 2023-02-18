import { mkenum } from '../../core/utils';
export const FilterMode = mkenum({
    quickFilter: 'quickFilter',
    excelStyleFilter: 'excelStyleFilter'
});
export const GridSummaryPosition = mkenum({
    top: 'top',
    bottom: 'bottom'
});
export const GridSummaryCalculationMode = mkenum({
    rootLevelOnly: 'rootLevelOnly',
    childLevelsOnly: 'childLevelsOnly',
    rootAndChildLevels: 'rootAndChildLevels'
});
export const GridSelectionMode = mkenum({
    none: 'none',
    single: 'single',
    multiple: 'multiple',
    multipleCascade: 'multipleCascade'
});
export const ColumnDisplayOrder = mkenum({
    Alphabetical: 'Alphabetical',
    DisplayOrder: 'DisplayOrder'
});
export var ColumnPinningPosition;
(function (ColumnPinningPosition) {
    ColumnPinningPosition[ColumnPinningPosition["Start"] = 0] = "Start";
    ColumnPinningPosition[ColumnPinningPosition["End"] = 1] = "End";
})(ColumnPinningPosition || (ColumnPinningPosition = {}));
export var RowPinningPosition;
(function (RowPinningPosition) {
    RowPinningPosition[RowPinningPosition["Top"] = 0] = "Top";
    RowPinningPosition[RowPinningPosition["Bottom"] = 1] = "Bottom";
})(RowPinningPosition || (RowPinningPosition = {}));
export var GridPagingMode;
(function (GridPagingMode) {
    GridPagingMode[GridPagingMode["Local"] = 0] = "Local";
    GridPagingMode[GridPagingMode["Remote"] = 1] = "Remote";
})(GridPagingMode || (GridPagingMode = {}));
export var GridInstanceType;
(function (GridInstanceType) {
    GridInstanceType[GridInstanceType["Grid"] = 0] = "Grid";
    GridInstanceType[GridInstanceType["TreeGrid"] = 1] = "TreeGrid";
})(GridInstanceType || (GridInstanceType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvY29tbW9uL2VudW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQyxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQzdCLFdBQVcsRUFBRSxhQUFhO0lBQzFCLGdCQUFnQixFQUFFLGtCQUFrQjtDQUN2QyxDQUFDLENBQUM7QUFHSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUM7SUFDdEMsR0FBRyxFQUFFLEtBQUs7SUFDVixNQUFNLEVBQUUsUUFBUTtDQUNuQixDQUFDLENBQUM7QUFHSCxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxNQUFNLENBQUM7SUFDN0MsYUFBYSxFQUFFLGVBQWU7SUFDOUIsZUFBZSxFQUFFLGlCQUFpQjtJQUNsQyxrQkFBa0IsRUFBRSxvQkFBb0I7Q0FDM0MsQ0FBQyxDQUFDO0FBWUgsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDO0lBQ3BDLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFFBQVE7SUFDaEIsUUFBUSxFQUFFLFVBQVU7SUFDcEIsZUFBZSxFQUFFLGlCQUFpQjtDQUNyQyxDQUFDLENBQUM7QUFHSCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUM7SUFDckMsWUFBWSxFQUFFLGNBQWM7SUFDNUIsWUFBWSxFQUFFLGNBQWM7Q0FDL0IsQ0FBQyxDQUFDO0FBR0gsTUFBTSxDQUFOLElBQVkscUJBR1g7QUFIRCxXQUFZLHFCQUFxQjtJQUM3QixtRUFBSyxDQUFBO0lBQ0wsK0RBQUcsQ0FBQTtBQUNQLENBQUMsRUFIVyxxQkFBcUIsS0FBckIscUJBQXFCLFFBR2hDO0FBRUQsTUFBTSxDQUFOLElBQVksa0JBR1g7QUFIRCxXQUFZLGtCQUFrQjtJQUMxQix5REFBRyxDQUFBO0lBQ0gsK0RBQU0sQ0FBQTtBQUNWLENBQUMsRUFIVyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBRzdCO0FBRUQsTUFBTSxDQUFOLElBQVksY0FHWDtBQUhELFdBQVksY0FBYztJQUN0QixxREFBSyxDQUFBO0lBQ0wsdURBQU0sQ0FBQTtBQUNWLENBQUMsRUFIVyxjQUFjLEtBQWQsY0FBYyxRQUd6QjtBQUVELE1BQU0sQ0FBTixJQUFZLGdCQUdYO0FBSEQsV0FBWSxnQkFBZ0I7SUFDeEIsdURBQUksQ0FBQTtJQUNKLCtEQUFRLENBQUE7QUFDWixDQUFDLEVBSFcsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQUczQiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgbWtlbnVtIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5leHBvcnQgY29uc3QgRmlsdGVyTW9kZSA9IG1rZW51bSh7XG4gICAgcXVpY2tGaWx0ZXI6ICdxdWlja0ZpbHRlcicsXG4gICAgZXhjZWxTdHlsZUZpbHRlcjogJ2V4Y2VsU3R5bGVGaWx0ZXInXG59KTtcbmV4cG9ydCB0eXBlIEZpbHRlck1vZGUgPSAodHlwZW9mIEZpbHRlck1vZGUpW2tleW9mIHR5cGVvZiBGaWx0ZXJNb2RlXTtcblxuZXhwb3J0IGNvbnN0IEdyaWRTdW1tYXJ5UG9zaXRpb24gPSBta2VudW0oe1xuICAgIHRvcDogJ3RvcCcsXG4gICAgYm90dG9tOiAnYm90dG9tJ1xufSk7XG5leHBvcnQgdHlwZSBHcmlkU3VtbWFyeVBvc2l0aW9uID0gKHR5cGVvZiBHcmlkU3VtbWFyeVBvc2l0aW9uKVtrZXlvZiB0eXBlb2YgR3JpZFN1bW1hcnlQb3NpdGlvbl07XG5cbmV4cG9ydCBjb25zdCBHcmlkU3VtbWFyeUNhbGN1bGF0aW9uTW9kZSA9IG1rZW51bSh7XG4gICAgcm9vdExldmVsT25seTogJ3Jvb3RMZXZlbE9ubHknLFxuICAgIGNoaWxkTGV2ZWxzT25seTogJ2NoaWxkTGV2ZWxzT25seScsXG4gICAgcm9vdEFuZENoaWxkTGV2ZWxzOiAncm9vdEFuZENoaWxkTGV2ZWxzJ1xufSk7XG5leHBvcnQgdHlwZSBHcmlkU3VtbWFyeUNhbGN1bGF0aW9uTW9kZSA9ICh0eXBlb2YgR3JpZFN1bW1hcnlDYWxjdWxhdGlvbk1vZGUpW2tleW9mIHR5cGVvZiBHcmlkU3VtbWFyeUNhbGN1bGF0aW9uTW9kZV07XG5cblxuZXhwb3J0IHR5cGUgR3JpZEtleWRvd25UYXJnZXRUeXBlID1cbiAgICAnZGF0YUNlbGwnIHxcbiAgICAnc3VtbWFyeUNlbGwnIHxcbiAgICAnZ3JvdXBSb3cnIHxcbiAgICAnaGllcmFyY2hpY2FsUm93JyB8XG4gICAgJ2hlYWRlckNlbGwnIHxcbiAgICAnbWFzdGVyRGV0YWlsUm93JztcblxuZXhwb3J0IGNvbnN0IEdyaWRTZWxlY3Rpb25Nb2RlID0gbWtlbnVtKHtcbiAgICBub25lOiAnbm9uZScsXG4gICAgc2luZ2xlOiAnc2luZ2xlJyxcbiAgICBtdWx0aXBsZTogJ211bHRpcGxlJyxcbiAgICBtdWx0aXBsZUNhc2NhZGU6ICdtdWx0aXBsZUNhc2NhZGUnXG59KTtcbmV4cG9ydCB0eXBlIEdyaWRTZWxlY3Rpb25Nb2RlID0gKHR5cGVvZiBHcmlkU2VsZWN0aW9uTW9kZSlba2V5b2YgdHlwZW9mIEdyaWRTZWxlY3Rpb25Nb2RlXTtcblxuZXhwb3J0IGNvbnN0IENvbHVtbkRpc3BsYXlPcmRlciA9IG1rZW51bSh7XG4gICAgQWxwaGFiZXRpY2FsOiAnQWxwaGFiZXRpY2FsJyxcbiAgICBEaXNwbGF5T3JkZXI6ICdEaXNwbGF5T3JkZXInXG59KTtcbmV4cG9ydCB0eXBlIENvbHVtbkRpc3BsYXlPcmRlciA9ICh0eXBlb2YgQ29sdW1uRGlzcGxheU9yZGVyKVtrZXlvZiB0eXBlb2YgQ29sdW1uRGlzcGxheU9yZGVyXTtcblxuZXhwb3J0IGVudW0gQ29sdW1uUGlubmluZ1Bvc2l0aW9uIHtcbiAgICBTdGFydCxcbiAgICBFbmRcbn1cblxuZXhwb3J0IGVudW0gUm93UGlubmluZ1Bvc2l0aW9uIHtcbiAgICBUb3AsXG4gICAgQm90dG9tXG59XG5cbmV4cG9ydCBlbnVtIEdyaWRQYWdpbmdNb2RlIHtcbiAgICBMb2NhbCxcbiAgICBSZW1vdGVcbn1cblxuZXhwb3J0IGVudW0gR3JpZEluc3RhbmNlVHlwZSB7XG4gICAgR3JpZCxcbiAgICBUcmVlR3JpZFxufVxuIl19