import { ColumnType } from '../common/grid.interface';
import { IgxColumnActionsBaseDirective } from './column-actions-base.directive';
import { IgxColumnActionsComponent } from './column-actions.component';
import * as i0 from "@angular/core";
export declare class IgxColumnPinningDirective extends IgxColumnActionsBaseDirective {
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
    actionEnabledColumnsFilter: (c: ColumnType) => boolean;
    /**
     * @hidden @internal
     */
    columnChecked(column: ColumnType): boolean;
    /**
     * @hidden @internal
     */
    toggleColumn(column: ColumnType): void;
    get allUnchecked(): boolean;
    get allChecked(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxColumnPinningDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxColumnPinningDirective, "[igxColumnPinning]", never, {}, {}, never>;
}
