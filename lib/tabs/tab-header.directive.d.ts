import { ElementRef } from '@angular/core';
import { PlatformUtil } from '../core/utils';
import { IgxTabItemDirective } from './tab-item.directive';
import { IgxTabHeaderBase, IgxTabsBase } from './tabs.base';
import * as i0 from "@angular/core";
export declare abstract class IgxTabHeaderDirective implements IgxTabHeaderBase {
    protected tabs: IgxTabsBase;
    tab: IgxTabItemDirective;
    private elementRef;
    protected platform: PlatformUtil;
    /** @hidden */
    role: string;
    /** @hidden */
    constructor(tabs: IgxTabsBase, tab: IgxTabItemDirective, elementRef: ElementRef<HTMLElement>, platform: PlatformUtil);
    /** @hidden */
    get tabIndex(): -1 | 0;
    /** @hidden */
    get ariaSelected(): boolean;
    /** @hidden */
    get ariaDisabled(): boolean;
    /** @hidden */
    onClick(): void;
    /** @hidden */
    get nativeElement(): HTMLElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTabHeaderDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxTabHeaderDirective, never, never, {}, {}, never>;
}
