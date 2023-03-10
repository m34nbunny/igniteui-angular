import { ColumnType } from '../common/grid.interface';
import { IgxColumnActionsBaseDirective } from './column-actions-base.directive';
import { IgxColumnActionsComponent } from './column-actions.component';
import * as i0 from "@angular/core";
export declare class IgxColumnHidingDirective extends IgxColumnActionsBaseDirective {
    protected columnActions: IgxColumnActionsComponent;
    constructor(columnActions: IgxColumnActionsComponent);
    /**
     * @hidden @internal
     */
    get checkAllLabel(): string;
    /**
     * @hidden @internal
     */
    get uncheckAllLabel(): string;
    /**
     * @hidden @internal
     */
    checkAll(): void;
    /**
     * @hidden @internal
     */
    uncheckAll(): void;
    /**
     * @hidden @internal
     */
    actionEnabledColumnsFilter: (c: any) => boolean;
    /**
     * @hidden @internal
     */
    columnChecked(column: ColumnType): boolean;
    /**
     * @hidden @internal
     */
    toggleColumn(column: ColumnType): void;
    get allChecked(): boolean;
    get allUnchecked(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxColumnHidingDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxColumnHidingDirective, "[igxColumnHiding]", never, {}, {}, never>;
}
