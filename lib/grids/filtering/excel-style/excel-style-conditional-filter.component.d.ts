import { OnDestroy } from '@angular/core';
import { IFilteringOperation } from '../../../data-operations/filtering-condition';
import { ISelectionEventArgs, IgxDropDownComponent } from '../../../drop-down/public_api';
import { IgxExcelStyleCustomDialogComponent } from './excel-style-custom-dialog.component';
import { PlatformUtil } from '../../../core/utils';
import { BaseFilteringComponent } from './base-filtering.component';
import * as i0 from "@angular/core";
/**
 * A component used for presenting Excel style conditional filter UI.
 */
export declare class IgxExcelStyleConditionalFilterComponent implements OnDestroy {
    esf: BaseFilteringComponent;
    protected platform: PlatformUtil;
    /**
     * @hidden @internal
     */
    customDialog: IgxExcelStyleCustomDialogComponent;
    /**
     * @hidden @internal
     */
    subMenu: IgxDropDownComponent;
    private shouldOpenSubMenu;
    private destroy$;
    private _subMenuPositionSettings;
    private _subMenuOverlaySettings;
    constructor(esf: BaseFilteringComponent, platform: PlatformUtil);
    ngOnDestroy(): void;
    /**
     * @hidden @internal
     */
    onTextFilterKeyDown(eventArgs: KeyboardEvent): void;
    /**
     * @hidden @internal
     */
    onTextFilterClick(eventArgs: any): void;
    /**
     * @hidden @internal
     */
    getCondition(value: string): IFilteringOperation;
    /**
     * @hidden @internal
     */
    translateCondition(value: string): string;
    /**
     * @hidden @internal
     */
    onSubMenuSelection(eventArgs: ISelectionEventArgs): void;
    /**
     * @hidden @internal
     */
    onSubMenuClosed(): void;
    /**
     * @hidden @internal
     */
    showCustomFilterItem(): boolean;
    /**
     * @hidden @internal
     */
    get subMenuText(): any;
    /**
     * @hidden @internal
     */
    get conditions(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleConditionalFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExcelStyleConditionalFilterComponent, "igx-excel-style-conditional-filter", never, {}, {}, never, never>;
}
