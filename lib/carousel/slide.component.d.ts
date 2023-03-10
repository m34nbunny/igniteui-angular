import { OnDestroy, EventEmitter, ElementRef, AfterContentChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { Direction, IgxSlideComponentBase } from './carousel-base';
import * as i0 from "@angular/core";
/**
 * A slide component that usually holds an image and/or a caption text.
 * IgxSlideComponent is usually a child component of an IgxCarouselComponent.
 *
 * ```
 * <igx-slide [input bindings] >
 *    <ng-content></ng-content>
 * </igx-slide>
 * ```
 *
 * @export
 */
export declare class IgxSlideComponent implements AfterContentChecked, OnDestroy, IgxSlideComponentBase {
    private elementRef;
    /**
     * Gets/sets the `index` of the slide inside the carousel.
     * ```html
     * <igx-carousel>
     *  <igx-slide index = "1"></igx-slide>
     * <igx-carousel>
     * ```
     *
     * @memberOf IgxSlideComponent
     */
    index: number;
    /**
     * Gets/sets the target `direction` for the slide.
     * ```html
     * <igx-carousel>
     *  <igx-slide direction="NEXT"></igx-slide>
     * <igx-carousel>
     * ```
     *
     * @memberOf IgxSlideComponent
     */
    direction: Direction;
    total: number;
    /**
     * Returns the `tabIndex` of the slide component.
     * ```typescript
     * let tabIndex =  this.carousel.tabIndex;
     * ```
     *
     * @memberof IgxSlideComponent
     */
    get tabIndex(): number;
    /**
     * @hidden
     */
    id: string;
    /**
     * Returns the `role` of the slide component.
     * By default is set to `tabpanel`
     *
     * @memberof IgxSlideComponent
     */
    tab: string;
    /** @hidden */
    ariaLabelledBy: any;
    /**
     * Returns the class of the slide component.
     * ```typescript
     * let class =  this.slide.cssClass;
     * ```
     *
     * @memberof IgxSlideComponent
     */
    cssClass: string;
    /**
     * Gets/sets the `active` state of the slide.
     * ```html
     * <igx-carousel>
     *  <igx-slide [active] ="false"></igx-slide>
     * <igx-carousel>
     * ```
     *
     * Two-way data binding.
     * ```html
     * <igx-carousel>
     *  <igx-slide [(active)] ="model.isActive"></igx-slide>
     * <igx-carousel>
     * ```
     *
     * @memberof IgxSlideComponent
     */
    get active(): boolean;
    set active(value: boolean);
    previous: boolean;
    /**
     * @hidden
     */
    activeChange: EventEmitter<boolean>;
    private _active;
    private _destroy$;
    constructor(elementRef: ElementRef);
    /**
     * Returns a reference to the carousel element in the DOM.
     * ```typescript
     * let nativeElement =  this.slide.nativeElement;
     * ```
     *
     * @memberof IgxSlideComponent
     */
    get nativeElement(): any;
    /**
     * @hidden
     */
    get isDestroyed(): Subject<boolean>;
    ngAfterContentChecked(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    static ??fac: i0.????FactoryDeclaration<IgxSlideComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxSlideComponent, "igx-slide", never, { "index": "index"; "direction": "direction"; "total": "total"; "active": "active"; "previous": "previous"; }, { "activeChange": "activeChange"; }, never, ["*"]>;
}
