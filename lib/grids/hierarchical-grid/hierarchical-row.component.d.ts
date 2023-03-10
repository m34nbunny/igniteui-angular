import { ElementRef, QueryList, TemplateRef } from '@angular/core';
import { IgxRowDirective } from '../row.directive';
import { IgxHierarchicalGridCellComponent } from './hierarchical-cell.component';
import { GridType } from '../common/grid.interface';
import * as i0 from "@angular/core";
export declare class IgxHierarchicalRowComponent extends IgxRowDirective {
    expander: ElementRef<HTMLElement>;
    protected _cells: QueryList<IgxHierarchicalGridCellComponent>;
    /**
     * @hidden
     */
    protected defaultExpandedTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected defaultEmptyTemplate: TemplateRef<any>;
    /**
     * @hidden
     */
    protected defaultCollapsedTemplate: TemplateRef<any>;
    protected expanderClass: string;
    protected rolActionClass: string;
    /**
     * @hidden
     */
    get expanderClassResolved(): {
        [x: string]: boolean;
    };
    get viewIndex(): number;
    /**
     * Returns whether the row is expanded.
     * ```typescript
     * const RowExpanded = this.grid1.rowList.first.expanded;
     * ```
     */
    get expanded(): boolean;
    /**
     * @hidden
     */
    get expandedClass(): boolean;
    get hasChildren(): boolean;
    /**
     * @hidden
     */
    get highlighted(): boolean;
    /**
     * @hidden
     */
    expanderClick(event: any): void;
    /**
     * Toggles the hierarchical row.
     * ```typescript
     * this.grid1.rowList.first.toggle()
     * ```
     */
    toggle(): void;
    /**
     * @hidden
     * @internal
     */
    select: () => void;
    /**
     * @hidden
     * @internal
     */
    deselect: () => void;
    /**
     * @hidden
     */
    get iconTemplate(): TemplateRef<any>;
    protected endEdit(grid: GridType): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxHierarchicalRowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxHierarchicalRowComponent, "igx-hierarchical-grid-row", never, {}, {}, never, never>;
}
