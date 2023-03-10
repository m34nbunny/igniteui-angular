import { ChangeDetectorRef, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { IgxNavigationService } from '../core/navigation';
import { IgxOverlayService, PositionSettings } from '../services/public_api';
import { IgxNotificationsDirective } from '../directives/notification/notifications.directive';
import { ToggleViewEventArgs } from '../directives/toggle/toggle.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * **Ignite UI for Angular Toast** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/toast)
 *
 * The Ignite UI Toast provides information and warning messages that are non-interactive and cannot
 * be dismissed by the user. Toasts can be displayed at the bottom, middle, or top of the page.
 *
 * Example:
 * ```html
 * <button (click)="toast.open()">Show notification</button>
 * <igx-toast #toast displayTime="1000">
 *      Notification displayed
 * </igx-toast>
 * ```
 */
export declare class IgxToastComponent extends IgxNotificationsDirective implements OnInit {
    private _element;
    /**
     * @hidden
     */
    cssClass: string;
    /**
     * Sets/gets the `id` of the toast.
     * If not set, the `id` will have value `"igx-toast-0"`.
     * ```html
     * <igx-toast id = "my-first-toast"></igx-toast>
     * ```
     * ```typescript
     * let toastId = this.toast.id;
     * ```
     */
    id: string;
    /**
     * Sets/gets the `role` attribute.
     * If not set, `role` will have value `"alert"`.
     * ```html
     * <igx-toast [role] = "'notify'"></igx-toast>
     * ```
     * ```typescript
     * let toastRole = this.toast.role;
     * ```
     *
     * @memberof IgxToastComponent
     */
    role: string;
    /**
     * @hidden
     */
    isVisibleChange: EventEmitter<ToggleViewEventArgs>;
    /**
     * Get the position and animation settings used by the toast.
     * ```typescript
     * @ViewChild('toast', { static: true }) public toast: IgxToastComponent;
     * let currentPosition: PositionSettings = this.toast.positionSettings
     * ```
     */
    get positionSettings(): PositionSettings;
    /**
     * Set the position and animation settings used by the toast.
     * ```html
     * <igx-toast [positionSettings]="newPositionSettings"></igx-toast>
     * ```
     * ```typescript
     * import { slideInTop, slideOutBottom } from 'igniteui-angular';
     * ...
     * @ViewChild('toast', { static: true }) public toast: IgxToastComponent;
     *  public newPositionSettings: PositionSettings = {
     *      openAnimation: useAnimation(slideInTop, { params: { duration: '1000ms', fromPosition: 'translateY(100%)'}}),
     *      closeAnimation: useAnimation(slideOutBottom, { params: { duration: '1000ms', fromPosition: 'translateY(0)'}}),
     *      horizontalDirection: HorizontalAlignment.Left,
     *      verticalDirection: VerticalAlignment.Middle,
     *      horizontalStartPoint: HorizontalAlignment.Left,
     *      verticalStartPoint: VerticalAlignment.Middle
     *  };
     * this.toast.positionSettings = this.newPositionSettings;
     * ```
     */
    set positionSettings(settings: PositionSettings);
    private _positionSettings;
    /**
     * Gets the nativeElement of the toast.
     * ```typescript
     * let nativeElement = this.toast.element;
     * ```
     *
     * @memberof IgxToastComponent
     */
    get element(): any;
    constructor(_element: ElementRef, cdr: ChangeDetectorRef, navService: IgxNavigationService, overlayService: IgxOverlayService);
    /**
     * Shows the toast.
     * If `autoHide` is enabled, the toast will hide after `displayTime` is over.
     *
     * ```typescript
     * this.toast.open();
     * ```
     */
    open(message?: string, settings?: PositionSettings): void;
    /**
     * Opens or closes the toast, depending on its current state.
     *
     * ```typescript
     * this.toast.toggle();
     * ```
     */
    toggle(): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    static ??fac: i0.????FactoryDeclaration<IgxToastComponent, [null, null, { optional: true; }, null]>;
    static ??cmp: i0.????ComponentDeclaration<IgxToastComponent, "igx-toast", never, { "id": "id"; "role": "role"; "positionSettings": "positionSettings"; }, { "isVisibleChange": "isVisibleChange"; }, never, ["*"]>;
}
/**
 * @hidden
 */
export declare class IgxToastModule {
    static ??fac: i0.????FactoryDeclaration<IgxToastModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxToastModule, [typeof IgxToastComponent], [typeof i1.CommonModule], [typeof IgxToastComponent]>;
    static ??inj: i0.????InjectorDeclaration<IgxToastModule>;
}
