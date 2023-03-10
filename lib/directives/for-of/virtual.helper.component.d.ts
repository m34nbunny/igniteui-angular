import { ElementRef, ChangeDetectorRef, OnDestroy, OnInit, NgZone } from '@angular/core';
import { VirtualHelperBaseDirective } from './base.helper.component';
import { PlatformUtil } from '../../core/utils';
import * as i0 from "@angular/core";
export declare class VirtualHelperComponent extends VirtualHelperBaseDirective implements OnInit, OnDestroy {
    scrollTop: any;
    scrollWidth: any;
    _vcr: any;
    itemsLength: number;
    cssClasses: string;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, zone: NgZone, document: any, platformUtil: PlatformUtil);
    ngOnInit(): void;
    protected restoreScroll(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VirtualHelperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VirtualHelperComponent, "igx-virtual-helper", never, { "itemsLength": "itemsLength"; }, {}, never, never>;
}
