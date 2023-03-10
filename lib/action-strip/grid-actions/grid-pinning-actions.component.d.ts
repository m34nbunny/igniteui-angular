import { IgxGridActionsBaseDirective } from './grid-actions-base.directive';
import * as i0 from "@angular/core";
export declare class IgxGridPinningActionsComponent extends IgxGridActionsBaseDirective {
    /**
     * Host `class.igx-action-strip` binding.
     *
     * @hidden
     * @internal
     */
    cssClass: string;
    private iconsRendered;
    /**
     * Getter to know if the row is pinned
     *
     * @hidden
     * @internal
     */
    get pinned(): boolean;
    /**
     * Getter to know if the row is in pinned and ghost
     *
     * @hidden
     * @internal
     */
    get inPinnedArea(): boolean;
    /**
     * Getter to know if the row pinning is set to top or bottom
     *
     * @hidden
     * @internal
     */
    get pinnedTop(): boolean;
    /**
     * Pin the row according to the context.
     *
     * @example
     * ```typescript
     * this.gridPinningActions.pin();
     * ```
     */
    pin(event?: any): void;
    /**
     * Unpin the row according to the context.
     *
     * @example
     * ```typescript
     * this.gridPinningActions.unpin();
     * ```
     */
    unpin(event?: any): void;
    scrollToRow(event: any): void;
    private registerSVGIcons;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridPinningActionsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridPinningActionsComponent, "igx-grid-pinning-actions", never, {}, {}, never, never>;
}
