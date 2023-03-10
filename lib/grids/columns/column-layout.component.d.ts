import { AfterContentInit } from '@angular/core';
import { IgxColumnGroupComponent } from './column-group.component';
import * as i0 from "@angular/core";
export declare class IgxColumnLayoutComponent extends IgxColumnGroupComponent implements AfterContentInit {
    childrenVisibleIndexes: any[];
    /**
     * Gets the width of the column layout.
     * ```typescript
     * let columnGroupWidth = this.columnGroup.width;
     * ```
     *
     * @memberof IgxColumnGroupComponent
     */
    get width(): any;
    set width(val: any);
    get columnLayout(): boolean;
    /**
     * @hidden
     */
    getCalcWidth(): any;
    /**
     * Gets the column visible index.
     * If the column is not visible, returns `-1`.
     * ```typescript
     * let visibleColumnIndex =  this.column.visibleIndex;
     * ```
     *
     * @memberof IgxColumnComponent
     */
    get visibleIndex(): number;
    get hidden(): boolean;
    /**
     * Sets the column layout hidden property.
     * ```typescript
     * <igx-column-layout [hidden] = "true"></igx-column->
     * ```
     *
     * @memberof IgxColumnGroupComponent
     */
    set hidden(value: boolean);
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    get hasLastPinnedChildColumn(): boolean;
    get hasFirstPinnedChildColumn(): boolean;
    /**
     * @hidden
     */
    populateVisibleIndexes(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxColumnLayoutComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxColumnLayoutComponent, "igx-column-layout", never, { "hidden": "hidden"; }, {}, never, never>;
}
