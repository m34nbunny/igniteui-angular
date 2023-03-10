import { IgxGridActionButtonComponent } from './grid-action-button.component';
import { AfterViewInit, QueryList, IterableDiffers } from '@angular/core';
import { IgxActionStripComponent } from '../action-strip.component';
import { IgxRowDirective } from '../../grids/row.directive';
import { IgxIconService } from '../../icon/icon.service';
import * as i0 from "@angular/core";
export declare class IgxGridActionsBaseDirective implements AfterViewInit {
    protected iconService: IgxIconService;
    protected differs: IterableDiffers;
    buttons: QueryList<IgxGridActionButtonComponent>;
    /**
     * Gets/Sets if the action buttons will be rendered as menu items. When in menu, items will be rendered with text label.
     *
     * @example
     * ```html
     *  <igx-grid-pinning-actions [asMenuItems]='true'></igx-grid-pinning-actions>
     *  <igx-grid-editing-actions [asMenuItems]='true'></igx-grid-editing-actions>
     * ```
     */
    asMenuItems: boolean;
    strip: IgxActionStripComponent;
    /**
     * @hidden
     * @internal
     */
    get grid(): any;
    /**
     * Getter to be used in template
     *
     * @hidden
     * @internal
     */
    get isRowContext(): boolean;
    constructor(iconService: IgxIconService, differs: IterableDiffers);
    /**
     * @hidden
     * @internal
     */
    ngAfterViewInit(): void;
    /**
     * Check if the param is a row from a grid
     *
     * @hidden
     * @internal
     * @param context
     */
    protected isRow(context: any): context is IgxRowDirective;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridActionsBaseDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxGridActionsBaseDirective, "[igxGridActionsBase]", never, { "asMenuItems": "asMenuItems"; }, {}, never>;
}
