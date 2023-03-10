import { QueryList, DoCheck } from '@angular/core';
import { IgxRowDirective } from '../row.directive';
import { ITreeGridRecord } from './tree-grid.interfaces';
import * as i0 from "@angular/core";
export declare class IgxTreeGridRowComponent extends IgxRowDirective implements DoCheck {
    protected _cells: QueryList<any>;
    /**
     * @hidden
     */
    isLoading: boolean;
    private _treeRow;
    /**
     * The `ITreeGridRecord` passed to the row component.
     *
     * ```typescript
     * const row = this.grid.getRowByKey(1) as IgxTreeGridRowComponent;
     * const treeRow = row.treeRow;
     * ```
     */
    get treeRow(): ITreeGridRecord;
    set treeRow(value: ITreeGridRecord);
    /**
     * Sets whether the row is pinned.
     * Default value is `false`.
     * ```typescript
     * this.grid.selectedRows[0].pinned = true;
     * ```
     */
    set pinned(value: boolean);
    /**
     * Gets whether the row is pinned.
     * ```typescript
     * let isPinned = row.pinned;
     * ```
     */
    get pinned(): boolean;
    /**
     * @hidden
     */
    get isRoot(): boolean;
    /**
     * @hidden
     */
    get hasChildren(): boolean;
    /**
     * Returns a value indicating whether the row component is expanded.
     *
     * ```typescript
     * const row = this.grid.getRowByKey(1) as IgxTreeGridRowComponent;
     * const expanded = row.expanded;
     * ```
     */
    get expanded(): boolean;
    /**
     * Sets a value indicating whether the row component is expanded.
     *
     * ```typescript
     * const row = this.grid.getRowByKey(1) as IgxTreeGridRowComponent;
     * row.expanded = true;
     * ```
     */
    set expanded(value: boolean);
    /**
     * @hidden
     * @internal
     */
    get viewIndex(): number;
    /**
     * @hidden
     */
    get showIndicator(): any;
    /**
     * @hidden
     */
    get indeterminate(): boolean;
    /**
     * @hidden
     */
    ngDoCheck(): void;
    /**
     * Spawns the add child row UI for the specific row.
     *
     * @example
     * ```typescript
     * const row = this.grid.getRowByKey(1) as IgxTreeGridRowComponent;
     * row.beginAddChild();
     * ```
     * @param rowID
     */
    beginAddChild(): void;
    static ??fac: i0.????FactoryDeclaration<IgxTreeGridRowComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxTreeGridRowComponent, "igx-tree-grid-row", never, { "treeRow": "treeRow"; }, {}, never, never>;
}
