import { OnInit, OnDestroy, ElementRef, ViewContainerRef, EventEmitter } from '@angular/core';
import { IgxNavigationService } from '../../core/navigation';
import { IBaseEventArgs } from '../../core/utils';
import { IgxToggleActionDirective } from '../toggle/toggle.directive';
import { IgxTooltipDirective } from './tooltip.directive';
import * as i0 from "@angular/core";
export interface ITooltipShowEventArgs extends IBaseEventArgs {
    target: IgxTooltipTargetDirective;
    tooltip: IgxTooltipDirective;
    cancel: boolean;
}
export interface ITooltipHideEventArgs extends IBaseEventArgs {
    target: IgxTooltipTargetDirective;
    tooltip: IgxTooltipDirective;
    cancel: boolean;
}
/**
 * **Ignite UI for Angular Tooltip Target** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/tooltip)
 *
 * The Ignite UI for Angular Tooltip Target directive is used to mark an HTML element in the markup as one that has a tooltip.
 * The tooltip target is used in combination with the Ignite UI for Angular Tooltip by assigning the exported tooltip reference to the
 * target's selector property.
 *
 * Example:
 * ```html
 * <button [igxTooltipTarget]="tooltipRef">Hover me</button>
 * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
 * ```
 */
export declare class IgxTooltipTargetDirective extends IgxToggleActionDirective implements OnInit, OnDestroy {
    private _element;
    private _navigationService;
    private _viewContainerRef;
    /**
     * Gets/sets the amount of milliseconds that should pass before showing the tooltip.
     *
     * ```typescript
     * // get
     * let tooltipShowDelay = this.tooltipTarget.showDelay;
     * ```
     *
     * ```html
     * <!--set-->
     * <button [igxTooltipTarget]="tooltipRef" showDelay="1500">Hover me</button>
     * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
     * ```
     */
    showDelay: number;
    /**
     * Gets/sets the amount of milliseconds that should pass before hiding the tooltip.
     *
     * ```typescript
     * // get
     * let tooltipHideDelay = this.tooltipTarget.hideDelay;
     * ```
     *
     * ```html
     * <!--set-->
     * <button [igxTooltipTarget]="tooltipRef" hideDelay="1500">Hover me</button>
     * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
     * ```
     */
    hideDelay: number;
    /**
     * Specifies if the tooltip should not show when hovering its target with the mouse. (defaults to false)
     * While setting this property to 'true' will disable the user interactions that shows/hides the tooltip,
     * the developer will still be able to show/hide the tooltip through the API.
     *
     * ```typescript
     * // get
     * let tooltipDisabledValue = this.tooltipTarget.tooltipDisabled;
     * ```
     *
     * ```html
     * <!--set-->
     * <button [igxTooltipTarget]="tooltipRef" [tooltipDisabled]="true">Hover me</button>
     * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
     * ```
     */
    tooltipDisabled: boolean;
    /**
     * @hidden
     */
    set target(target: any);
    /**
     * @hidden
     */
    get target(): any;
    /**
    * @hidden
    */
    set tooltip(content: any);
    /**
     * Gets the respective native element of the directive.
     *
     * ```typescript
     * let tooltipTargetElement = this.tooltipTarget.nativeElement;
     * ```
     */
    get nativeElement(): any;
    /**
     * Indicates if the tooltip that is is associated with this target is currently hidden.
     *
     * ```typescript
     * let tooltipHiddenValue = this.tooltipTarget.tooltipHidden;
     * ```
     */
    get tooltipHidden(): boolean;
    /**
     * Emits an event when the tooltip that is associated with this target starts showing.
     * This event is fired before the start of the countdown to showing the tooltip.
     *
     * ```typescript
     * tooltipShowing(args: ITooltipShowEventArgs) {
     *    alert("Tooltip started showing!");
     * }
     * ```
     *
     * ```html
     * <button [igxTooltipTarget]="tooltipRef"
     *         (tooltipShow)='tooltipShowing($event)'>Hover me</button>
     * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
     * ```
     */
    tooltipShow: EventEmitter<ITooltipShowEventArgs>;
    /**
     * Emits an event when the tooltip that is associated with this target starts hiding.
     * This event is fired before the start of the countdown to hiding the tooltip.
     *
     * ```typescript
     * tooltipHiding(args: ITooltipHideEventArgs) {
     *    alert("Tooltip started hiding!");
     * }
     * ```
     *
     * ```html
     * <button [igxTooltipTarget]="tooltipRef"
     *         (tooltipHide)='tooltipHiding($event)'>Hover me</button>
     * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
     * ```
     */
    tooltipHide: EventEmitter<ITooltipHideEventArgs>;
    private destroy$;
    constructor(_element: ElementRef, _navigationService: IgxNavigationService, _viewContainerRef: ViewContainerRef);
    /**
     * @hidden
     */
    onClick(): void;
    /**
     * @hidden
     */
    onMouseEnter(): void;
    /**
     * @hidden
     */
    onMouseLeave(): void;
    /**
     * @hidden
     */
    onTouchStart(): void;
    /**
     * @hidden
     */
    onDocumentTouchStart(event: any): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * Shows the tooltip by respecting the 'showDelay' property.
     *
     * ```typescript
     * this.tooltipTarget.showTooltip();
     * ```
     */
    showTooltip(): void;
    /**
     * Hides the tooltip by respecting the 'hideDelay' property.
     *
     * ```typescript
     * this.tooltipTarget.hideTooltip();
     * ```
     */
    hideTooltip(): void;
    private checkOutletAndOutsideClick;
    private get mergedOverlaySettings();
    private preMouseEnterCheck;
    private preMouseLeaveCheck;
    static ??fac: i0.????FactoryDeclaration<IgxTooltipTargetDirective, [null, { optional: true; }, null]>;
    static ??dir: i0.????DirectiveDeclaration<IgxTooltipTargetDirective, "[igxTooltipTarget]", ["tooltipTarget"], { "showDelay": "showDelay"; "hideDelay": "hideDelay"; "tooltipDisabled": "tooltipDisabled"; "target": "igxTooltipTarget"; "tooltip": "tooltip"; }, { "tooltipShow": "tooltipShow"; "tooltipHide": "tooltipHide"; }, never>;
}
