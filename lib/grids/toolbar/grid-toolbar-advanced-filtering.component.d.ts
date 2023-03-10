import { IgxToolbarToken } from './token';
import { OverlaySettings } from '../../services/overlay/utilities';
import * as i0 from "@angular/core";
/**
 * Provides a pre-configured button to open the advanced filtering dialog of the grid.
 *
 *
 * @igxModule IgxGridToolbarModule
 * @igxParent IgxGridToolbarComponent
 *
 * @example
 * ```html
 * <igx-grid-toolbar-advanced-filtering></igx-grid-toolbar-advanced-filtering>
 * <igx-grid-toolbar-advanced-filtering>Custom text</igx-grid-toolbar-advanced-filtering>
 * ```
 */
export declare class IgxGridToolbarAdvancedFilteringComponent {
    private toolbar;
    /**
     * Returns the grid containing this component.
     */
    get grid(): import("../common/grid.interface").GridType;
    overlaySettings: OverlaySettings;
    constructor(toolbar: IgxToolbarToken);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridToolbarAdvancedFilteringComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridToolbarAdvancedFilteringComponent, "igx-grid-toolbar-advanced-filtering", never, { "overlaySettings": "overlaySettings"; }, {}, never, ["*"]>;
}
