import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { PlatformUtil } from '../../core/utils';
import * as i0 from "@angular/core";
export declare class IgxFocusTrapDirective implements AfterViewInit, OnDestroy {
    private elementRef;
    protected platformUtil: PlatformUtil;
    /** @hidden */
    get element(): HTMLElement | null;
    private destroy$;
    private _focusTrap;
    /** @hidden */
    constructor(elementRef: ElementRef, platformUtil: PlatformUtil);
    /**
     * Sets whether the Tab key focus is trapped within the element.
     *
     * @example
     * ```html
     * <div igxFocusTrap="true"></div>
     * ```
     */
    set focusTrap(focusTrap: boolean);
    /** @hidden */
    get focusTrap(): boolean;
    /** @hidden */
    ngAfterViewInit(): void;
    /** @hidden */
    ngOnDestroy(): void;
    private handleTab;
    private getFocusableElements;
    private getFocusedElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxFocusTrapDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxFocusTrapDirective, "[igxFocusTrap]", never, { "focusTrap": "igxFocusTrap"; }, {}, never>;
}
/**
 * @hidden
 */
export declare class IgxFocusTrapModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxFocusTrapModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IgxFocusTrapModule, [typeof IgxFocusTrapDirective], never, [typeof IgxFocusTrapDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IgxFocusTrapModule>;
}
