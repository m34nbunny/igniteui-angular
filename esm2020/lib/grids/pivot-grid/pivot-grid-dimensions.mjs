import { CurrentResourceStrings } from '../../core/i18n/resources';
import { PivotUtil } from './pivot-util';
// Equals to pretty much this configuration:
// {
//     member: () => 'All Periods',
//     enabled: true,
//     fieldName: 'AllPeriods',
//     childLevel: {
//         fieldName: 'Years',
//         member: (rec) => {
//             const recordValue = rec['Date'];
//             return recordValue ? (new Date(recordValue)).getFullYear().toString() : rec['Years'];
//         },
//         enabled: true,
//         childLevel: {
//                 member: (rec) => {
//                     const recordValue = rec['Date'];
//                     return recordValue ? new Date(recordValue).toLocaleString('default', { month: 'long' }) : rec['Months'];
//                 },
//                 enabled: true,
//                 fieldName: 'Months',
//                 childLevel: {
//                         member: 'Date',
//                         fieldName:'Date',
//                         enabled: true
//                     }
//             }
//     }
// },
export class IgxPivotDateDimension {
    /**
     * Creates additional pivot date dimensions based on a provided dimension describing date data:
     *
     * @param inDateDimension Base dimension that is used by this class to determine the other dimensions and their values.
     * @param inOptions Options for the predefined date dimensions whether to show quarter, years and etc.
     * @example
     * ```typescript
     * // Displays only years as parent dimension to the base dimension provided.
     * new IgxPivotDateDimension({ memberName: 'Date', enabled: true }, { total: false, months: false });
     * ```
     */
    constructor(inBaseDimension, inOptions = {}) {
        this.inBaseDimension = inBaseDimension;
        this.inOptions = inOptions;
        /** Enables/Disables a particular dimension from pivot structure. */
        this.enabled = true;
        /** Default options used for initialization. */
        this.defaultOptions = {
            total: true,
            years: true,
            months: true,
            fullDate: true
        };
        /** @hidden @internal */
        this.memberName = 'AllPeriods';
        this._resourceStrings = CurrentResourceStrings.GridResStrings;
        /** @hidden @internal */
        this.memberFunction = (_data) => this.resourceStrings.igx_grid_pivot_date_dimension_total;
        const options = { ...this.defaultOptions, ...inOptions };
        if (!inBaseDimension) {
            console.warn(`Please provide data child level to the pivot dimension.`);
            return;
        }
        const baseDimension = options.fullDate ? inBaseDimension : null;
        const monthDimensionDef = {
            memberName: 'Months',
            memberFunction: (rec) => {
                const recordValue = PivotUtil.extractValueFromDimension(inBaseDimension, rec);
                return recordValue ? new Date(recordValue).toLocaleString('default', { month: 'long' }) : rec['Months'];
            },
            enabled: true,
            childLevel: baseDimension
        };
        const monthDimension = options.months ? monthDimensionDef : baseDimension;
        const quarterDimensionDef = {
            memberName: 'Quarters',
            memberFunction: (rec) => {
                const recordValue = PivotUtil.extractValueFromDimension(inBaseDimension, rec);
                return recordValue ? `Q` + Math.ceil((new Date(recordValue).getMonth() + 1) / 3) : rec['Quarters'];
            },
            enabled: true,
            childLevel: monthDimension
        };
        const quarterDimension = options.quarters ? quarterDimensionDef : monthDimension;
        const yearsDimensionDef = {
            memberName: 'Years',
            memberFunction: (rec) => {
                const recordValue = PivotUtil.extractValueFromDimension(inBaseDimension, rec);
                return recordValue ? (new Date(recordValue)).getFullYear().toString() : rec['Years'];
            },
            enabled: true,
            childLevel: quarterDimension
        };
        const yearsDimension = options.years ? yearsDimensionDef : quarterDimension;
        this.childLevel = yearsDimension;
        if (!options.total) {
            this.memberName = yearsDimension.memberName;
            this.memberFunction = yearsDimension.memberFunction;
            this.childLevel = yearsDimension.childLevel;
        }
    }
    /**
     * Gets/Sets the resource strings.
     *
     * @remarks
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    get resourceStrings() {
        return this._resourceStrings;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3QtZ3JpZC1kaW1lbnNpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL3Bpdm90LWdyaWQvcGl2b3QtZ3JpZC1kaW1lbnNpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRW5FLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFlekMsNENBQTRDO0FBQzVDLElBQUk7QUFDSixtQ0FBbUM7QUFDbkMscUJBQXFCO0FBQ3JCLCtCQUErQjtBQUMvQixvQkFBb0I7QUFDcEIsOEJBQThCO0FBQzlCLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0Msb0dBQW9HO0FBQ3BHLGFBQWE7QUFDYix5QkFBeUI7QUFDekIsd0JBQXdCO0FBQ3hCLHFDQUFxQztBQUNyQyx1REFBdUQ7QUFDdkQsK0hBQStIO0FBQy9ILHFCQUFxQjtBQUNyQixpQ0FBaUM7QUFDakMsdUNBQXVDO0FBQ3ZDLGdDQUFnQztBQUNoQywwQ0FBMEM7QUFDMUMsNENBQTRDO0FBQzVDLHdDQUF3QztBQUN4Qyx3QkFBd0I7QUFDeEIsZ0JBQWdCO0FBQ2hCLFFBQVE7QUFDUixLQUFLO0FBQ0wsTUFBTSxPQUFPLHFCQUFxQjtJQWdDOUI7Ozs7Ozs7Ozs7T0FVRztJQUNILFlBQW1CLGVBQWdDLEVBQVMsWUFBd0MsRUFBRTtRQUFuRixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFpQztRQTFDdEcsb0VBQW9FO1FBQzdELFlBQU8sR0FBRyxJQUFJLENBQUM7UUFFdEIsK0NBQStDO1FBQ3hDLG1CQUFjLEdBQUc7WUFDcEIsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxJQUFJO1lBQ1osUUFBUSxFQUFFLElBQUk7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QUFDO1FBRWpDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQztZQUM1QyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUM7WUFDcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztJQS9FRDs7Ozs7T0FLRztJQUNILElBQVcsZUFBZSxDQUFDLEtBQTJCO1FBQ2xELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELElBQVcsZUFBZTtRQUN0QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqQyxDQUFDO0NBdUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUdyaWRSZXNvdXJjZVN0cmluZ3MgfSBmcm9tICcuLi8uLi9jb3JlL2kxOG4vZ3JpZC1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uLy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgSVBpdm90RGltZW5zaW9uIH0gZnJvbSAnLi9waXZvdC1ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBQaXZvdFV0aWwgfSBmcm9tICcuL3Bpdm90LXV0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQaXZvdERhdGVEaW1lbnNpb25PcHRpb25zIHtcbiAgICAvKiogRW5hYmxlcy9EaXNhYmxlcyB0b3RhbCB2YWx1ZSBvZiBhbGwgcGVyaW9kcy4gKi9cbiAgICB0b3RhbD86IGJvb2xlYW47XG4gICAgLyoqIEVuYWJsZXMvRGlzYWJsZXMgZGltZW5zaW9ucyBwZXIgeWVhciBmcm9tIHByb3ZpZGVkIHBlcmlvZHMuICovXG4gICAgeWVhcnM/OiBib29sZWFuO1xuICAgIC8qLyoqIEVuYWJsZXMvRGlzYWJsZXMgZGltZW5zaW9ucyBwZXIgcXVhcnRlciBmcm9tIHByb3ZpZGVkIHBlcmlvZHMuICovXG4gICAgcXVhcnRlcnM/OiBib29sZWFuO1xuICAgIC8qKiBFbmFibGVzL0Rpc2FibGVzIGRpbWVuc2lvbnMgcGVyIG1vbnRoIGZyb20gcHJvdmlkZWQgcGVyaW9kcy4gKi9cbiAgICBtb250aHM/OiBib29sZWFuO1xuICAgIC8qKiBFbmFibGVkL0Rpc2FibGVzIGRpbWVuc2lvbnMgZm9yIHRoZSBmdWxsIGRhdGUgcHJvdmlkZWQgKi9cbiAgICBmdWxsRGF0ZT86IGJvb2xlYW47XG59XG5cbi8vIEVxdWFscyB0byBwcmV0dHkgbXVjaCB0aGlzIGNvbmZpZ3VyYXRpb246XG4vLyB7XG4vLyAgICAgbWVtYmVyOiAoKSA9PiAnQWxsIFBlcmlvZHMnLFxuLy8gICAgIGVuYWJsZWQ6IHRydWUsXG4vLyAgICAgZmllbGROYW1lOiAnQWxsUGVyaW9kcycsXG4vLyAgICAgY2hpbGRMZXZlbDoge1xuLy8gICAgICAgICBmaWVsZE5hbWU6ICdZZWFycycsXG4vLyAgICAgICAgIG1lbWJlcjogKHJlYykgPT4ge1xuLy8gICAgICAgICAgICAgY29uc3QgcmVjb3JkVmFsdWUgPSByZWNbJ0RhdGUnXTtcbi8vICAgICAgICAgICAgIHJldHVybiByZWNvcmRWYWx1ZSA/IChuZXcgRGF0ZShyZWNvcmRWYWx1ZSkpLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSA6IHJlY1snWWVhcnMnXTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbi8vICAgICAgICAgY2hpbGRMZXZlbDoge1xuLy8gICAgICAgICAgICAgICAgIG1lbWJlcjogKHJlYykgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICBjb25zdCByZWNvcmRWYWx1ZSA9IHJlY1snRGF0ZSddO1xuLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjb3JkVmFsdWUgPyBuZXcgRGF0ZShyZWNvcmRWYWx1ZSkudG9Mb2NhbGVTdHJpbmcoJ2RlZmF1bHQnLCB7IG1vbnRoOiAnbG9uZycgfSkgOiByZWNbJ01vbnRocyddO1xuLy8gICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICBmaWVsZE5hbWU6ICdNb250aHMnLFxuLy8gICAgICAgICAgICAgICAgIGNoaWxkTGV2ZWw6IHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIG1lbWJlcjogJ0RhdGUnLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOidEYXRlJyxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH0sXG5leHBvcnQgY2xhc3MgSWd4UGl2b3REYXRlRGltZW5zaW9uIGltcGxlbWVudHMgSVBpdm90RGltZW5zaW9uIHtcbiAgICAvKiogRW5hYmxlcy9EaXNhYmxlcyBhIHBhcnRpY3VsYXIgZGltZW5zaW9uIGZyb20gcGl2b3Qgc3RydWN0dXJlLiAqL1xuICAgIHB1YmxpYyBlbmFibGVkID0gdHJ1ZTtcblxuICAgIC8qKiBEZWZhdWx0IG9wdGlvbnMgdXNlZCBmb3IgaW5pdGlhbGl6YXRpb24uICovXG4gICAgcHVibGljIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICB0b3RhbDogdHJ1ZSxcbiAgICAgICAgeWVhcnM6IHRydWUsXG4gICAgICAgIG1vbnRoczogdHJ1ZSxcbiAgICAgICAgZnVsbERhdGU6IHRydWVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IGl0IHVzZXMgRU4gcmVzb3VyY2VzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgcmVzb3VyY2VTdHJpbmdzKHZhbHVlOiBJR3JpZFJlc291cmNlU3RyaW5ncykge1xuICAgICAgICB0aGlzLl9yZXNvdXJjZVN0cmluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9yZXNvdXJjZVN0cmluZ3MsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlU3RyaW5ncygpOiBJR3JpZFJlc291cmNlU3RyaW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZVN0cmluZ3M7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGNoaWxkTGV2ZWw/OiBJUGl2b3REaW1lbnNpb247XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG1lbWJlck5hbWUgPSAnQWxsUGVyaW9kcyc7XG4gICAgcHJpdmF0ZSBfcmVzb3VyY2VTdHJpbmdzID0gQ3VycmVudFJlc291cmNlU3RyaW5ncy5HcmlkUmVzU3RyaW5ncztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYWRkaXRpb25hbCBwaXZvdCBkYXRlIGRpbWVuc2lvbnMgYmFzZWQgb24gYSBwcm92aWRlZCBkaW1lbnNpb24gZGVzY3JpYmluZyBkYXRlIGRhdGE6XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5EYXRlRGltZW5zaW9uIEJhc2UgZGltZW5zaW9uIHRoYXQgaXMgdXNlZCBieSB0aGlzIGNsYXNzIHRvIGRldGVybWluZSB0aGUgb3RoZXIgZGltZW5zaW9ucyBhbmQgdGhlaXIgdmFsdWVzLlxuICAgICAqIEBwYXJhbSBpbk9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHByZWRlZmluZWQgZGF0ZSBkaW1lbnNpb25zIHdoZXRoZXIgdG8gc2hvdyBxdWFydGVyLCB5ZWFycyBhbmQgZXRjLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIERpc3BsYXlzIG9ubHkgeWVhcnMgYXMgcGFyZW50IGRpbWVuc2lvbiB0byB0aGUgYmFzZSBkaW1lbnNpb24gcHJvdmlkZWQuXG4gICAgICogbmV3IElneFBpdm90RGF0ZURpbWVuc2lvbih7IG1lbWJlck5hbWU6ICdEYXRlJywgZW5hYmxlZDogdHJ1ZSB9LCB7IHRvdGFsOiBmYWxzZSwgbW9udGhzOiBmYWxzZSB9KTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5CYXNlRGltZW5zaW9uOiBJUGl2b3REaW1lbnNpb24sIHB1YmxpYyBpbk9wdGlvbnM6IElQaXZvdERhdGVEaW1lbnNpb25PcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4udGhpcy5kZWZhdWx0T3B0aW9ucywgLi4uaW5PcHRpb25zIH07XG5cbiAgICAgICAgaWYgKCFpbkJhc2VEaW1lbnNpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgUGxlYXNlIHByb3ZpZGUgZGF0YSBjaGlsZCBsZXZlbCB0byB0aGUgcGl2b3QgZGltZW5zaW9uLmApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFzZURpbWVuc2lvbiA9IG9wdGlvbnMuZnVsbERhdGUgPyBpbkJhc2VEaW1lbnNpb24gOiBudWxsO1xuICAgICAgICBjb25zdCBtb250aERpbWVuc2lvbkRlZjogSVBpdm90RGltZW5zaW9uID0ge1xuICAgICAgICAgICAgbWVtYmVyTmFtZTogJ01vbnRocycsXG4gICAgICAgICAgICBtZW1iZXJGdW5jdGlvbjogKHJlYykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZFZhbHVlID0gUGl2b3RVdGlsLmV4dHJhY3RWYWx1ZUZyb21EaW1lbnNpb24oaW5CYXNlRGltZW5zaW9uLCByZWMpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZWNvcmRWYWx1ZSA/IG5ldyBEYXRlKHJlY29yZFZhbHVlKS50b0xvY2FsZVN0cmluZygnZGVmYXVsdCcsIHsgbW9udGg6ICdsb25nJyB9KSA6IHJlY1snTW9udGhzJ107XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNoaWxkTGV2ZWw6IGJhc2VEaW1lbnNpb25cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbW9udGhEaW1lbnNpb24gPSBvcHRpb25zLm1vbnRocyA/IG1vbnRoRGltZW5zaW9uRGVmIDogYmFzZURpbWVuc2lvbjtcblxuICAgICAgICBjb25zdCBxdWFydGVyRGltZW5zaW9uRGVmOiBJUGl2b3REaW1lbnNpb24gPSB7XG4gICAgICAgICAgICBtZW1iZXJOYW1lOiAnUXVhcnRlcnMnLFxuICAgICAgICAgICAgbWVtYmVyRnVuY3Rpb246IChyZWMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNvcmRWYWx1ZSA9IFBpdm90VXRpbC5leHRyYWN0VmFsdWVGcm9tRGltZW5zaW9uKGluQmFzZURpbWVuc2lvbiwgcmVjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjb3JkVmFsdWUgPyBgUWAgKyBNYXRoLmNlaWwoKG5ldyBEYXRlKHJlY29yZFZhbHVlKS5nZXRNb250aCgpICsgMSkgLyAzKSA6IHJlY1snUXVhcnRlcnMnXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgY2hpbGRMZXZlbDogbW9udGhEaW1lbnNpb25cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcXVhcnRlckRpbWVuc2lvbiA9IG9wdGlvbnMucXVhcnRlcnMgPyBxdWFydGVyRGltZW5zaW9uRGVmIDogbW9udGhEaW1lbnNpb247XG5cbiAgICAgICAgY29uc3QgeWVhcnNEaW1lbnNpb25EZWYgPSB7XG4gICAgICAgICAgICBtZW1iZXJOYW1lOiAnWWVhcnMnLFxuICAgICAgICAgICAgbWVtYmVyRnVuY3Rpb246IChyZWMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNvcmRWYWx1ZSA9IFBpdm90VXRpbC5leHRyYWN0VmFsdWVGcm9tRGltZW5zaW9uKGluQmFzZURpbWVuc2lvbiwgcmVjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjb3JkVmFsdWUgPyAobmV3IERhdGUocmVjb3JkVmFsdWUpKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgOiByZWNbJ1llYXJzJ107XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNoaWxkTGV2ZWw6IHF1YXJ0ZXJEaW1lbnNpb25cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgeWVhcnNEaW1lbnNpb24gPSBvcHRpb25zLnllYXJzID8geWVhcnNEaW1lbnNpb25EZWYgOiBxdWFydGVyRGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNoaWxkTGV2ZWwgPSB5ZWFyc0RpbWVuc2lvbjtcblxuICAgICAgICBpZiAoIW9wdGlvbnMudG90YWwpIHtcbiAgICAgICAgICAgIHRoaXMubWVtYmVyTmFtZSA9IHllYXJzRGltZW5zaW9uLm1lbWJlck5hbWU7XG4gICAgICAgICAgICB0aGlzLm1lbWJlckZ1bmN0aW9uID0geWVhcnNEaW1lbnNpb24ubWVtYmVyRnVuY3Rpb247XG4gICAgICAgICAgICB0aGlzLmNoaWxkTGV2ZWwgPSB5ZWFyc0RpbWVuc2lvbi5jaGlsZExldmVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG1lbWJlckZ1bmN0aW9uID0gKF9kYXRhKSA9PiB0aGlzLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9waXZvdF9kYXRlX2RpbWVuc2lvbl90b3RhbDtcbn1cbiJdfQ==