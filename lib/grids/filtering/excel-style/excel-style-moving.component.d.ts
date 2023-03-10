import { BaseFilteringComponent } from './base-filtering.component';
import * as i0 from "@angular/core";
/**
 * A component used for presenting Excel style column moving UI.
 */
export declare class IgxExcelStyleMovingComponent {
    esf: BaseFilteringComponent;
    /**
     * @hidden @internal
     */
    defaultClass: boolean;
    constructor(esf: BaseFilteringComponent);
    private get visibleColumns();
    /**
     * @hidden @internal
     */
    get canNotMoveLeft(): any;
    /**
     * @hidden @internal
     */
    get canNotMoveRight(): boolean;
    /**
     * @hidden @internal
     */
    onMoveButtonClicked(moveDirection: any): void;
    private findColumn;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExcelStyleMovingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExcelStyleMovingComponent, "igx-excel-style-moving", never, {}, {}, never, never>;
}
