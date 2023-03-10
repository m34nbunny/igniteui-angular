import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { IgxOverlayService } from '../../services/overlay/overlay';
import { OverlaySettings } from '../../services/public_api';
import { IgxNavigationService } from '../../core/navigation';
import { IgxToggleDirective } from '../toggle/toggle.directive';
import * as i0 from "@angular/core";
/**
 * **Ignite UI for Angular Tooltip** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/tooltip)
 *
 * The Ignite UI for Angular Tooltip directive is used to mark an HTML element in the markup as one that should behave as a tooltip.
 * The tooltip is used in combination with the Ignite UI for Angular Tooltip Target by assigning the exported tooltip reference to the
 * respective target's selector property.
 *
 * Example:
 * ```html
 * <button [igxTooltipTarget]="tooltipRef">Hover me</button>
 * <span #tooltipRef="tooltip" igxTooltip>Hello there, I am a tooltip!</span>
 * ```
 */
export declare class IgxTooltipDirective extends IgxToggleDirective {
    /**
     * @hidden
     */
    get hiddenClass(): boolean;
    /**
     * @hidden
     */
    get defaultClass(): boolean;
    /**
     * Gets/sets any tooltip related data.
     * The 'context' can be used for storing any information that is necessary
     * to access when working with the tooltip.
     *
     * ```typescript
     * // get
     * let tooltipContext = this.tooltip.context;
     * ```
     *
     * ```typescript
     * // set
     * this.tooltip.context = "Tooltip's context";
     * ```
     */
    context: any;
    /**
     * Identifier for the tooltip.
     * If this is property is not explicitly set, it will be automatically generated.
     *
     * ```typescript
     * let tooltipId = this.tooltip.id;
     * ```
     */
    id: string;
    /**
     * Get the role attribute of the tooltip.
     *
     * ```typescript
     * let tooltipRole = this.tooltip.role;
     * ```
     */
    get role(): string;
    /**
     * @hidden
     */
    timeoutId: any;
    /**
     * @hidden
     * Returns whether close time out has started
     */
    toBeHidden: boolean;
    /**
     * @hidden
     * Returns whether open time out has started
     */
    toBeShown: boolean;
    /** @hidden */
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, overlayService: IgxOverlayService, navigationService: IgxNavigationService);
    /**
     * If there is open animation in progress this method will finish is.
     * If there is no open animation in progress this method will open the toggle with no animation.
     *
     * @param overlaySettings setting to use for opening the toggle
     */
    protected forceOpen(overlaySettings?: OverlaySettings): void;
    /**
     * If there is close animation in progress this method will finish is.
     * If there is no close animation in progress this method will close the toggle with no animation.
     *
     * @param overlaySettings settings to use for closing the toggle
     */
    protected forceClose(overlaySettings?: OverlaySettings): void;
    static ??fac: i0.????FactoryDeclaration<IgxTooltipDirective, [null, null, null, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<IgxTooltipDirective, "[igxTooltip]", ["tooltip"], { "context": "context"; "id": "id"; }, {}, never>;
}
