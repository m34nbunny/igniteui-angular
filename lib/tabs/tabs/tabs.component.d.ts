import { AnimationBuilder } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { IgxDirectionality } from '../../services/direction/directionality';
import { IgxTabsDirective } from '../tabs.directive';
import * as i0 from "@angular/core";
export declare const IgxTabsAlignment: {
    start: "start";
    end: "end";
    center: "center";
    justify: "justify";
};
export declare type IgxTabsAlignment = (typeof IgxTabsAlignment)[keyof typeof IgxTabsAlignment];
/**
 * Tabs component is used to organize or switch between similar data sets.
 *
 * @igxModule IgxTabsModule
 *
 * @igxTheme igx-tabs-theme
 *
 * @igxKeywords tabs
 *
 * @igxGroup Layouts
 *
 * @remarks
 * The Ignite UI for Angular Tabs component places tabs at the top and allows for scrolling when there are multiple tab items on the screen.
 *
 * @example
 * ```html
 * <igx-tabs>
 *     <igx-tab-item>
 *         <igx-tab-header>
 *             <igx-icon igxTabHeaderIcon>folder</igx-icon>
 *             <span igxTabHeaderLabel>Tab 1</span>
 *         </igx-tab-header>
 *         <igx-tab-content>
 *             Content 1
 *         </igx-tab-content>
 *     </igx-tab-item>
 *     ...
 * </igx-tabs>
 * ```
 */
export declare class IgxTabsComponent extends IgxTabsDirective implements AfterViewInit, OnDestroy {
    private ngZone;
    dir: IgxDirectionality;
    /**
     * An @Input property which determines the tab alignment. Defaults to `start`.
     */
    get tabAlignment(): string | IgxTabsAlignment;
    set tabAlignment(value: string | IgxTabsAlignment);
    /** @hidden */
    headerContainer: ElementRef<HTMLElement>;
    /** @hidden */
    viewPort: ElementRef<HTMLElement>;
    /** @hidden */
    itemsWrapper: ElementRef<HTMLElement>;
    /** @hidden */
    itemsContainer: ElementRef<HTMLElement>;
    /** @hidden */
    selectedIndicator: ElementRef<HTMLElement>;
    /** @hidden */
    scrollPrevButton: ElementRef<HTMLElement>;
    /** @hidden */
    scrollNextButton: ElementRef<HTMLElement>;
    /** @hidden */
    defaultClass: boolean;
    /**  @hidden */
    offset: number;
    /** @hidden */
    protected componentName: string;
    private _tabAlignment;
    private _resizeObserver;
    constructor(builder: AnimationBuilder, cdr: ChangeDetectorRef, ngZone: NgZone, dir: IgxDirectionality);
    /** @hidden @internal */
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /** @hidden */
    scrollPrev(): void;
    /** @hidden */
    scrollNext(): void;
    /** @hidden */
    realignSelectedIndicator(): void;
    /** @hidden */
    resolveHeaderScrollClasses(): {
        'igx-tabs__header-scroll--start': boolean;
        'igx-tabs__header-scroll--end': boolean;
        'igx-tabs__header-scroll--center': boolean;
        'igx-tabs__header-scroll--justify': boolean;
    };
    /** @hidden */
    protected scrollTabHeaderIntoView(): void;
    /** @hidden */
    protected getNextTabId(): number;
    /** @hidden */
    protected onItemChanges(): void;
    private alignSelectedIndicator;
    private hideSelectedIndicator;
    private scroll;
    private scrollElement;
    private updateScrollButtons;
    private setScrollButtonStyle;
    private resolveLeftScrollButtonStyle;
    private resolveRightScrollButtonStyle;
    private getTabItemsContainerWidth;
    private getOffset;
    private getElementOffset;
    static ??fac: i0.????FactoryDeclaration<IgxTabsComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxTabsComponent, "igx-tabs", never, { "tabAlignment": "tabAlignment"; }, {}, never, never>;
}
