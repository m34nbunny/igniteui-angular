import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IgxButtonGroupComponent } from '../../../buttonGroup/buttonGroup.component';
import { BaseFilteringComponent } from './base-filtering.component';
import * as i0 from "@angular/core";
/**
 * A component used for presenting Excel style column sorting UI.
 */
export declare class IgxExcelStyleSortingComponent implements OnDestroy {
    esf: BaseFilteringComponent;
    private cdr;
    /**
     * @hidden @internal
     */
    defaultClass: boolean;
    /**
     * @hidden @internal
     */
    sortButtonGroup: IgxButtonGroupComponent;
    private destroy$;
    constructor(esf: BaseFilteringComponent, cdr: ChangeDetectorRef);
    ngOnDestroy(): void;
    /**
     * @hidden @internal
     */
    onSortButtonClicked(sortDirection: any): void;
    private updateSelectedButtons;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleSortingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExcelStyleSortingComponent, "igx-excel-style-sorting", never, {}, {}, never, never>;
}
