/**
 * This file contains all the directives used by the @link IgxCalendarComponent.
 * Except for the directives which are used for templating the calendar itself
 * you should generally not use them directly.
 *
 * @preferred
 */
import { EventEmitter, TemplateRef, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { PlatformUtil } from '../core/utils';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxCalendarYearDirective {
    elementRef: ElementRef;
    value: Date;
    date: Date;
    yearSelection: EventEmitter<Date>;
    get currentCSS(): boolean;
    get role(): string;
    get valuenow(): number;
    get tabIndex(): number;
    get isCurrentYear(): boolean;
    get nativeElement(): any;
    constructor(elementRef: ElementRef);
    onClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCalendarYearDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxCalendarYearDirective, "[igxCalendarYear]", never, { "value": "igxCalendarYear"; "date": "date"; }, { "yearSelection": "yearSelection"; }, never>;
}
export declare class IgxCalendarMonthDirective {
    elementRef: ElementRef;
    value: Date;
    date: Date;
    index: any;
    monthSelection: EventEmitter<Date>;
    get currentCSS(): boolean;
    get isCurrentMonth(): boolean;
    get nativeElement(): any;
    constructor(elementRef: ElementRef);
    onClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCalendarMonthDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxCalendarMonthDirective, "[igxCalendarMonth]", never, { "value": "igxCalendarMonth"; "date": "date"; "index": "index"; }, { "monthSelection": "monthSelection"; }, never>;
}
/**
 * @hidden
 */
export declare class IgxCalendarHeaderTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCalendarHeaderTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxCalendarHeaderTemplateDirective, "[igxCalendarHeader]", never, {}, {}, never>;
}
/**
 * @hidden
 */
export declare class IgxCalendarSubheaderTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCalendarSubheaderTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxCalendarSubheaderTemplateDirective, "[igxCalendarSubheader]", never, {}, {}, never>;
}
/**
 * @hidden
 */
export declare class IgxCalendarScrollMonthDirective implements AfterViewInit, OnDestroy {
    private element;
    private zone;
    protected platform: PlatformUtil;
    /**
     * A callback function to be invoked when month increment/decrement starts.
     *
     * @hidden
     */
    startScroll: (keydown?: boolean) => void;
    /**
     * A callback function to be invoked when month increment/decrement stops.
     *
     * @hidden
     */
    stopScroll: (event: any) => void;
    /**
     * @hidden
     */
    private destroy$;
    constructor(element: ElementRef, zone: NgZone, platform: PlatformUtil);
    /**
     * @hidden
     */
    onMouseDown(): void;
    /**
     * @hidden
     */
    onMouseUp(event: MouseEvent): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxCalendarScrollMonthDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxCalendarScrollMonthDirective, "[igxCalendarScrollMonth]", never, { "startScroll": "startScroll"; "stopScroll": "stopScroll"; }, {}, never>;
}
