import { ColumnType } from '../common/grid.interface';
import * as i0 from "@angular/core";
export declare abstract class IgxColumnActionsBaseDirective {
    /** @hidden @internal */
    actionEnabledColumnsFilter: (value: ColumnType, index: number, array: ColumnType[]) => boolean;
    /**
     * @hidden @internal
     */
    abstract get checkAllLabel(): string;
    /**
     * @hidden @internal
     */
    abstract get uncheckAllLabel(): string;
    /** @hidden @internal */
    abstract columnChecked(column: ColumnType): boolean;
    /** @hidden @internal */
    abstract toggleColumn(column: ColumnType): void;
    /** @hidden @internal */
    abstract uncheckAll(): void;
    /** @hidden @internal */
    abstract checkAll(): void;
    /** @hidden @internal */
    abstract get allChecked(): boolean;
    /** @hidden @internal */
    abstract get allUnchecked(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxColumnActionsBaseDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxColumnActionsBaseDirective, never, never, {}, {}, never>;
}
