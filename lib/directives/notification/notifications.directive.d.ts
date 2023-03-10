import { ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { IToggleView } from '../../core/navigation';
import { IPositionStrategy } from '../../services/public_api';
import { IgxOverlayOutletDirective, IgxToggleDirective } from '../toggle/toggle.directive';
import * as i0 from "@angular/core";
export declare abstract class IgxNotificationsDirective extends IgxToggleDirective implements IToggleView, OnDestroy {
    /**
     * Sets/gets the `aria-live` attribute.
     * If not set, `aria-live` will have value `"polite"`.
     */
    ariaLive: string;
    /**
     * Sets/gets whether the element will be hidden after the `displayTime` is over.
     * Default value is `true`.
     */
    autoHide: boolean;
    /**
     * Sets/gets the duration of time span (in milliseconds) which the element will be visible
     * after it is being shown.
     * Default value is `4000`.
     */
    displayTime: number;
    /**
     * Gets/Sets the container used for the element.
     *
     * @remarks
     *  `outlet` is an instance of `IgxOverlayOutletDirective` or an `ElementRef`.
     */
    outlet: IgxOverlayOutletDirective | ElementRef<HTMLElement>;
    /**
     * Enables/Disables the visibility of the element.
     * If not set, the `isVisible` attribute will have value `false`.
     */
    get isVisible(): boolean;
    set isVisible(value: boolean);
    /**
     * @hidden
     * @internal
     */
    textMessage: string;
    /**
     * @hidden
     */
    timeoutId: number;
    d$: Subject<boolean>;
    /**
     * @hidden
     */
    protected strategy: IPositionStrategy;
    /**
     * @hidden
     */
    open(): void;
    /**
     * Hides the element.
     */
    close(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxNotificationsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxNotificationsDirective, never, never, { "ariaLive": "ariaLive"; "autoHide": "autoHide"; "displayTime": "displayTime"; "outlet": "outlet"; "isVisible": "isVisible"; }, {}, never>;
}
