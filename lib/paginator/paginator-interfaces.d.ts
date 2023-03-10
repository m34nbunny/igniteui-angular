import { TemplateRef } from '@angular/core';
import { CancelableEventArgs, IBaseEventArgs } from '../core/utils';
import * as i0 from "@angular/core";
export interface IPageEventArgs extends IBaseEventArgs {
    previous: number;
    current: number;
}
export interface IPageCancellableEventArgs extends CancelableEventArgs {
    current: number;
    next: number;
}
export declare class IgxPaginatorDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxPaginatorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxPaginatorDirective, "[igxPaginator]", never, {}, {}, never>;
}
