import { PlatformUtil } from '../../../core/utils';
import { BaseFilteringComponent } from './base-filtering.component';
import * as i0 from "@angular/core";
/**
 * A component used for presenting Excel style clear filters UI.
 */
export declare class IgxExcelStyleClearFiltersComponent {
    esf: BaseFilteringComponent;
    protected platform: PlatformUtil;
    constructor(esf: BaseFilteringComponent, platform: PlatformUtil);
    /**
     * @hidden @internal
     */
    clearFilterClass(): "igx-excel-filter__actions-clear" | "igx-excel-filter__actions-clear--disabled";
    /**
     * @hidden @internal
     */
    clearFilter(): void;
    /**
     * @hidden @internal
     */
    onClearFilterKeyDown(eventArgs: KeyboardEvent): void;
    private selectAllFilterItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleClearFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExcelStyleClearFiltersComponent, "igx-excel-style-clear-filters", never, {}, {}, never, never>;
}
