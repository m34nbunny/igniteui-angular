import { ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { VirtualHelperBaseDirective } from './base.helper.component';
import { PlatformUtil } from '../../core/utils';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class HVirtualHelperComponent extends VirtualHelperBaseDirective {
    _vcr: any;
    width: number;
    cssClasses: string;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, zone: NgZone, document: any, platformUtil: PlatformUtil);
    protected restoreScroll(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HVirtualHelperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HVirtualHelperComponent, "igx-horizontal-virtual-helper", never, { "width": "width"; }, {}, never, never>;
}
