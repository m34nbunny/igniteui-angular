import { AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { IgxTabItemDirective } from '../tab-item.directive';
import { IgxTabHeaderDirective } from '../tab-header.directive';
import { IgxTabsComponent } from './tabs.component';
import { PlatformUtil } from '../../core/utils';
import { IgxDirectionality } from '../../services/direction/directionality';
import * as i0 from "@angular/core";
export declare class IgxTabHeaderComponent extends IgxTabHeaderDirective implements AfterViewInit, OnDestroy {
    protected tabs: IgxTabsComponent;
    protected platform: PlatformUtil;
    private ngZone;
    private dir;
    /** @hidden @internal */
    get provideCssClassSelected(): boolean;
    /** @hidden @internal */
    get provideCssClassDisabled(): boolean;
    /** @hidden @internal */
    cssClass: boolean;
    private _resizeObserver;
    /** @hidden @internal */
    constructor(tabs: IgxTabsComponent, tab: IgxTabItemDirective, elementRef: ElementRef<HTMLElement>, platform: PlatformUtil, ngZone: NgZone, dir: IgxDirectionality);
    /** @hidden @internal */
    keyDown(event: KeyboardEvent): void;
    /** @hidden @internal */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    private getNewSelectionIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTabHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxTabHeaderComponent, "igx-tab-header", never, {}, {}, never, ["igx-prefix,[igxPrefix]", "*", "igx-suffix,[igxSuffix]"]>;
}
