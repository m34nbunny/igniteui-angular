import { ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { IgxScrollInertiaDirective } from '../scroll-inertia/scroll_inertia.directive';
import * as i0 from "@angular/core";
export declare class DisplayContainerComponent {
    cdr: ChangeDetectorRef;
    _viewContainer: ViewContainerRef;
    _vcr: any;
    _scrollInertia: IgxScrollInertiaDirective;
    cssClass: string;
    notVirtual: boolean;
    scrollDirection: string;
    scrollContainer: any;
    constructor(cdr: ChangeDetectorRef, _viewContainer: ViewContainerRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<DisplayContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DisplayContainerComponent, "igx-display-container", never, {}, {}, never, never>;
}
