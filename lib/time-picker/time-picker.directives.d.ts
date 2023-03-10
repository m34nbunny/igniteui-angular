/**
 * This file contains all the directives used by the @link IgxTimePickerComponent.
 * You should generally not use them directly.
 *
 * @preferred
 */
import { ElementRef, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { HammerGesturesManager } from '../core/touch';
import { IgxTimePickerBase } from './time-picker.common';
import * as i0 from "@angular/core";
/** @hidden */
export declare class IgxItemListDirective implements OnInit, OnDestroy {
    timePicker: IgxTimePickerBase;
    private elementRef;
    private touchManager;
    tabindex: number;
    type: string;
    isActive: boolean;
    constructor(timePicker: IgxTimePickerBase, elementRef: ElementRef, touchManager: HammerGesturesManager);
    get defaultCSS(): boolean;
    get hourCSS(): boolean;
    get minuteCSS(): boolean;
    get secondsCSS(): boolean;
    get ampmCSS(): boolean;
    onFocus(): void;
    onBlur(): void;
    /**
     * @hidden
     */
    onKeydownArrowDown(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowUp(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowRight(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownArrowLeft(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownEnter(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onKeydownEscape(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    onHover(): void;
    /**
     * @hidden
     */
    onScroll(event: any): void;
    /**
     * @hidden @internal
     */
    ngOnInit(): void;
    /**
     * @hidden @internal
     */
    ngOnDestroy(): void;
    private onPanMove;
    private nextItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxItemListDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxItemListDirective, "[igxItemList]", never, { "type": "igxItemList"; }, {}, never>;
}
/**
 * @hidden
 */
export declare class IgxTimeItemDirective {
    timePicker: IgxTimePickerBase;
    private itemList;
    value: string;
    get defaultCSS(): boolean;
    get selectedCSS(): boolean;
    get activeCSS(): boolean;
    get isSelectedTime(): boolean;
    get minValue(): string;
    get maxValue(): string;
    get hourValue(): string;
    constructor(timePicker: IgxTimePickerBase, itemList: IgxItemListDirective);
    onClick(item: any): void;
    private getHourPart;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTimeItemDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxTimeItemDirective, "[igxTimeItem]", ["timeItem"], { "value": "igxTimeItem"; }, {}, never>;
}
/**
 * This directive should be used to mark which ng-template will be used from IgxTimePicker when re-templating its input group.
 */
export declare class IgxTimePickerTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTimePickerTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxTimePickerTemplateDirective, "[igxTimePickerTemplate]", never, {}, {}, never>;
}
/**
 * This directive can be used to add custom action buttons to the dropdown/dialog.
 */
export declare class IgxTimePickerActionsDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTimePickerActionsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxTimePickerActionsDirective, "[igxTimePickerActions]", never, {}, {}, never>;
}
