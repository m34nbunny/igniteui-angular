import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Inject, Input, NgModule, Optional, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { IgxOverlayService, HorizontalAlignment, VerticalAlignment, GlobalPositionStrategy } from '../services/public_api';
import { IgxNotificationsDirective } from '../directives/notification/notifications.directive';
import { useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from '../animations/fade';
import * as i0 from "@angular/core";
import * as i1 from "../core/navigation";
import * as i2 from "../services/public_api";
let NEXT_ID = 0;
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
export class IgxToastComponent extends IgxNotificationsDirective {
    constructor(_element, cdr, navService, overlayService) {
        super(_element, cdr, overlayService, navService);
        this._element = _element;
        /**
         * @hidden
         */
        this.cssClass = 'igx-toast';
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
        this.id = `igx-toast-${NEXT_ID++}`;
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
        this.role = 'alert';
        /**
         * @hidden
         */
        this.isVisibleChange = new EventEmitter();
        this._positionSettings = {
            horizontalDirection: HorizontalAlignment.Center,
            verticalDirection: VerticalAlignment.Bottom,
            openAnimation: useAnimation(fadeIn),
            closeAnimation: useAnimation(fadeOut),
        };
    }
    /**
     * Get the position and animation settings used by the toast.
     * ```typescript
     * @ViewChild('toast', { static: true }) public toast: IgxToastComponent;
     * let currentPosition: PositionSettings = this.toast.positionSettings
     * ```
     */
    get positionSettings() {
        return this._positionSettings;
    }
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
    set positionSettings(settings) {
        this._positionSettings = settings;
    }
    /**
     * Gets the nativeElement of the toast.
     * ```typescript
     * let nativeElement = this.toast.element;
     * ```
     *
     * @memberof IgxToastComponent
     */
    get element() {
        return this._element.nativeElement;
    }
    /**
     * Shows the toast.
     * If `autoHide` is enabled, the toast will hide after `displayTime` is over.
     *
     * ```typescript
     * this.toast.open();
     * ```
     */
    open(message, settings) {
        if (message !== undefined) {
            this.textMessage = message;
        }
        if (settings !== undefined) {
            this.positionSettings = settings;
        }
        this.strategy = new GlobalPositionStrategy(this.positionSettings);
        super.open();
    }
    /**
     * Opens or closes the toast, depending on its current state.
     *
     * ```typescript
     * this.toast.toggle();
     * ```
     */
    toggle() {
        if (this.collapsed || this.isClosing) {
            this.open();
        }
        else {
            this.close();
        }
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.opened.pipe(takeUntil(this.d$)).subscribe(() => {
            const openedEventArgs = { owner: this, id: this._overlayId };
            this.isVisibleChange.emit(openedEventArgs);
        });
        this.closed.pipe(takeUntil(this.d$)).subscribe(() => {
            const closedEventArgs = { owner: this, id: this._overlayId };
            this.isVisibleChange.emit(closedEventArgs);
        });
    }
}
IgxToastComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxToastComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.IgxNavigationService, optional: true }, { token: IgxOverlayService }], target: i0.ɵɵFactoryTarget.Component });
IgxToastComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxToastComponent, selector: "igx-toast", inputs: { id: "id", role: "role", positionSettings: "positionSettings" }, outputs: { isVisibleChange: "isVisibleChange" }, host: { properties: { "class.igx-toast": "this.cssClass", "attr.id": "this.id", "attr.role": "this.role" } }, usesInheritance: true, ngImport: i0, template: "<ng-content></ng-content>\n<span>{{ textMessage }}</span>\n\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxToastComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-toast', template: "<ng-content></ng-content>\n<span>{{ textMessage }}</span>\n\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.IgxNavigationService, decorators: [{
                    type: Optional
                }] }, { type: i2.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }]; }, propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-toast']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }], isVisibleChange: [{
                type: Output
            }], positionSettings: [{
                type: Input
            }] } });
/**
 * @hidden
 */
export class IgxToastModule {
}
IgxToastModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxToastModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxToastModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxToastModule, declarations: [IgxToastComponent], imports: [CommonModule], exports: [IgxToastComponent] });
IgxToastModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxToastModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxToastModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxToastComponent],
                    exports: [IgxToastComponent],
                    imports: [CommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3RvYXN0L3RvYXN0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi90b2FzdC90b2FzdC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUVILFNBQVMsRUFFVCxZQUFZLEVBQ1osV0FBVyxFQUNYLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUVSLFFBQVEsRUFDUixNQUFNLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFDSCxpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQixzQkFBc0IsRUFFekIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUUvRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUVyRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFaEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFLSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEseUJBQXlCO0lBa0c1RCxZQUNZLFFBQW9CLEVBQzVCLEdBQXNCLEVBQ1YsVUFBZ0MsRUFDakIsY0FBaUM7UUFFNUQsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBTHpDLGFBQVEsR0FBUixRQUFRLENBQVk7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QyxpQkFBaUI7Z0JBZXZCLEVBQUU7c0JBRlIsV0FBVzt1QkFBQyxTQUFTOztzQkFDckIsS0FBSztnQkFpQkMsSUFBSTtzQkFGVixXQUFXO3VCQUFDLFdBQVc7O3NCQUN2QixLQUFLO2dCQU9DLGVBQWU7c0JBRHJCLE1BQU07Z0JBV0ssZ0JBQWdCO3NCQUQxQixLQUFLOztBQTJHWDs7R0FFRztBQU1ILE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOzRHQUFkLGNBQWMsaUJBcktkLGlCQUFpQixhQW1LaEIsWUFBWSxhQW5LYixpQkFBaUI7NEdBcUtqQixjQUFjLFlBRmQsQ0FBQyxZQUFZLENBQUM7MkZBRWQsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDakMsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7b0JBQzVCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE9uSW5pdCxcbiAgICBPcHRpb25hbCxcbiAgICBPdXRwdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJZ3hOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4uL2NvcmUvbmF2aWdhdGlvbic7XG5pbXBvcnQge1xuICAgIElneE92ZXJsYXlTZXJ2aWNlLFxuICAgIEhvcml6b250YWxBbGlnbm1lbnQsXG4gICAgVmVydGljYWxBbGlnbm1lbnQsXG4gICAgR2xvYmFsUG9zaXRpb25TdHJhdGVneSxcbiAgICBQb3NpdGlvblNldHRpbmdzXG59IGZyb20gJy4uL3NlcnZpY2VzL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4Tm90aWZpY2F0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbnMuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRvZ2dsZVZpZXdFdmVudEFyZ3MgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3RvZ2dsZS90b2dnbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IHVzZUFuaW1hdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgZmFkZUluLCBmYWRlT3V0IH0gZnJvbSAnLi4vYW5pbWF0aW9ucy9mYWRlJztcblxubGV0IE5FWFRfSUQgPSAwO1xuXG4vKipcbiAqICoqSWduaXRlIFVJIGZvciBBbmd1bGFyIFRvYXN0KiogLVxuICogW0RvY3VtZW50YXRpb25dKGh0dHBzOi8vd3d3LmluZnJhZ2lzdGljcy5jb20vcHJvZHVjdHMvaWduaXRlLXVpLWFuZ3VsYXIvYW5ndWxhci9jb21wb25lbnRzL3RvYXN0KVxuICpcbiAqIFRoZSBJZ25pdGUgVUkgVG9hc3QgcHJvdmlkZXMgaW5mb3JtYXRpb24gYW5kIHdhcm5pbmcgbWVzc2FnZXMgdGhhdCBhcmUgbm9uLWludGVyYWN0aXZlIGFuZCBjYW5ub3RcbiAqIGJlIGRpc21pc3NlZCBieSB0aGUgdXNlci4gVG9hc3RzIGNhbiBiZSBkaXNwbGF5ZWQgYXQgdGhlIGJvdHRvbSwgbWlkZGxlLCBvciB0b3Agb2YgdGhlIHBhZ2UuXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYGh0bWxcbiAqIDxidXR0b24gKGNsaWNrKT1cInRvYXN0Lm9wZW4oKVwiPlNob3cgbm90aWZpY2F0aW9uPC9idXR0b24+XG4gKiA8aWd4LXRvYXN0ICN0b2FzdCBkaXNwbGF5VGltZT1cIjEwMDBcIj5cbiAqICAgICAgTm90aWZpY2F0aW9uIGRpc3BsYXllZFxuICogPC9pZ3gtdG9hc3Q+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtdG9hc3QnLFxuICAgIHRlbXBsYXRlVXJsOiAndG9hc3QuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneFRvYXN0Q29tcG9uZW50IGV4dGVuZHMgSWd4Tm90aWZpY2F0aW9uc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LXRvYXN0JylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LXRvYXN0JztcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGlkYCBvZiB0aGUgdG9hc3QuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgd2lsbCBoYXZlIHZhbHVlIGBcImlneC10b2FzdC0wXCJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRvYXN0IGlkID0gXCJteS1maXJzdC10b2FzdFwiPjwvaWd4LXRvYXN0PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgdG9hc3RJZCA9IHRoaXMudG9hc3QuaWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtdG9hc3QtJHtORVhUX0lEKyt9YDtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYHJvbGVgIGF0dHJpYnV0ZS5cbiAgICAgKiBJZiBub3Qgc2V0LCBgcm9sZWAgd2lsbCBoYXZlIHZhbHVlIGBcImFsZXJ0XCJgLlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRvYXN0IFtyb2xlXSA9IFwiJ25vdGlmeSdcIj48L2lneC10b2FzdD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHRvYXN0Um9sZSA9IHRoaXMudG9hc3Qucm9sZTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hUb2FzdENvbXBvbmVudFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByb2xlID0gJ2FsZXJ0JztcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgaXNWaXNpYmxlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxUb2dnbGVWaWV3RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBwb3NpdGlvbiBhbmQgYW5pbWF0aW9uIHNldHRpbmdzIHVzZWQgYnkgdGhlIHRvYXN0LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKCd0b2FzdCcsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0b2FzdDogSWd4VG9hc3RDb21wb25lbnQ7XG4gICAgICogbGV0IGN1cnJlbnRQb3NpdGlvbjogUG9zaXRpb25TZXR0aW5ncyA9IHRoaXMudG9hc3QucG9zaXRpb25TZXR0aW5nc1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBASW5wdXQoKVxuICAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uU2V0dGluZ3MoKTogUG9zaXRpb25TZXR0aW5ncyB7XG4gICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25TZXR0aW5ncztcbiAgICAgfVxuXG4gICAgIC8qKlxuICAgICAgKiBTZXQgdGhlIHBvc2l0aW9uIGFuZCBhbmltYXRpb24gc2V0dGluZ3MgdXNlZCBieSB0aGUgdG9hc3QuXG4gICAgICAqIGBgYGh0bWxcbiAgICAgICogPGlneC10b2FzdCBbcG9zaXRpb25TZXR0aW5nc109XCJuZXdQb3NpdGlvblNldHRpbmdzXCI+PC9pZ3gtdG9hc3Q+XG4gICAgICAqIGBgYFxuICAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICAqIGltcG9ydCB7IHNsaWRlSW5Ub3AsIHNsaWRlT3V0Qm90dG9tIH0gZnJvbSAnaWduaXRldWktYW5ndWxhcic7XG4gICAgICAqIC4uLlxuICAgICAgKiBAVmlld0NoaWxkKCd0b2FzdCcsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0b2FzdDogSWd4VG9hc3RDb21wb25lbnQ7XG4gICAgICAqICBwdWJsaWMgbmV3UG9zaXRpb25TZXR0aW5nczogUG9zaXRpb25TZXR0aW5ncyA9IHtcbiAgICAgICogICAgICBvcGVuQW5pbWF0aW9uOiB1c2VBbmltYXRpb24oc2xpZGVJblRvcCwgeyBwYXJhbXM6IHsgZHVyYXRpb246ICcxMDAwbXMnLCBmcm9tUG9zaXRpb246ICd0cmFuc2xhdGVZKDEwMCUpJ319KSxcbiAgICAgICogICAgICBjbG9zZUFuaW1hdGlvbjogdXNlQW5pbWF0aW9uKHNsaWRlT3V0Qm90dG9tLCB7IHBhcmFtczogeyBkdXJhdGlvbjogJzEwMDBtcycsIGZyb21Qb3NpdGlvbjogJ3RyYW5zbGF0ZVkoMCknfX0pLFxuICAgICAgKiAgICAgIGhvcml6b250YWxEaXJlY3Rpb246IEhvcml6b250YWxBbGlnbm1lbnQuTGVmdCxcbiAgICAgICogICAgICB2ZXJ0aWNhbERpcmVjdGlvbjogVmVydGljYWxBbGlnbm1lbnQuTWlkZGxlLFxuICAgICAgKiAgICAgIGhvcml6b250YWxTdGFydFBvaW50OiBIb3Jpem9udGFsQWxpZ25tZW50LkxlZnQsXG4gICAgICAqICAgICAgdmVydGljYWxTdGFydFBvaW50OiBWZXJ0aWNhbEFsaWdubWVudC5NaWRkbGVcbiAgICAgICogIH07XG4gICAgICAqIHRoaXMudG9hc3QucG9zaXRpb25TZXR0aW5ncyA9IHRoaXMubmV3UG9zaXRpb25TZXR0aW5ncztcbiAgICAgICogYGBgXG4gICAgICAqL1xuICAgICBwdWJsaWMgc2V0IHBvc2l0aW9uU2V0dGluZ3Moc2V0dGluZ3M6IFBvc2l0aW9uU2V0dGluZ3MpIHtcbiAgICAgICAgIHRoaXMuX3Bvc2l0aW9uU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgfVxuXG4gICAgIHByaXZhdGUgX3Bvc2l0aW9uU2V0dGluZ3M6IFBvc2l0aW9uU2V0dGluZ3MgPSB7XG4gICAgICAgIGhvcml6b250YWxEaXJlY3Rpb246IEhvcml6b250YWxBbGlnbm1lbnQuQ2VudGVyLFxuICAgICAgICB2ZXJ0aWNhbERpcmVjdGlvbjogVmVydGljYWxBbGlnbm1lbnQuQm90dG9tLFxuICAgICAgICBvcGVuQW5pbWF0aW9uOiB1c2VBbmltYXRpb24oZmFkZUluKSxcbiAgICAgICAgY2xvc2VBbmltYXRpb246IHVzZUFuaW1hdGlvbihmYWRlT3V0KSxcbiAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hdGl2ZUVsZW1lbnQgb2YgdGhlIHRvYXN0LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbmF0aXZlRWxlbWVudCA9IHRoaXMudG9hc3QuZWxlbWVudDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hUb2FzdENvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICAgICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgQE9wdGlvbmFsKCkgbmF2U2VydmljZTogSWd4TmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoSWd4T3ZlcmxheVNlcnZpY2UpIG92ZXJsYXlTZXJ2aWNlOiBJZ3hPdmVybGF5U2VydmljZVxuICAgICkge1xuICAgICAgICBzdXBlcihfZWxlbWVudCwgY2RyLCBvdmVybGF5U2VydmljZSwgbmF2U2VydmljZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvd3MgdGhlIHRvYXN0LlxuICAgICAqIElmIGBhdXRvSGlkZWAgaXMgZW5hYmxlZCwgdGhlIHRvYXN0IHdpbGwgaGlkZSBhZnRlciBgZGlzcGxheVRpbWVgIGlzIG92ZXIuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy50b2FzdC5vcGVuKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIG9wZW4obWVzc2FnZT86IHN0cmluZywgc2V0dGluZ3M/OiBQb3NpdGlvblNldHRpbmdzKSB7XG4gICAgICAgIGlmIChtZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5ncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmF0ZWd5ID0gbmV3IEdsb2JhbFBvc2l0aW9uU3RyYXRlZ3kodGhpcy5wb3NpdGlvblNldHRpbmdzKTtcbiAgICAgICAgc3VwZXIub3BlbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wZW5zIG9yIGNsb3NlcyB0aGUgdG9hc3QsIGRlcGVuZGluZyBvbiBpdHMgY3VycmVudCBzdGF0ZS5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnRvYXN0LnRvZ2dsZSgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBwdWJsaWMgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQgfHwgdGhpcy5pc0Nsb3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5vcGVuZWQucGlwZSh0YWtlVW50aWwodGhpcy5kJCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcGVuZWRFdmVudEFyZ3M6IFRvZ2dsZVZpZXdFdmVudEFyZ3MgPSB7IG93bmVyOiB0aGlzLCBpZDogdGhpcy5fb3ZlcmxheUlkIH07XG4gICAgICAgICAgICB0aGlzLmlzVmlzaWJsZUNoYW5nZS5lbWl0KG9wZW5lZEV2ZW50QXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2xvc2VkLnBpcGUodGFrZVVudGlsKHRoaXMuZCQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2xvc2VkRXZlbnRBcmdzOiBUb2dnbGVWaWV3RXZlbnRBcmdzID0geyBvd25lcjogdGhpcywgaWQ6IHRoaXMuX292ZXJsYXlJZCB9O1xuICAgICAgICAgICAgdGhpcy5pc1Zpc2libGVDaGFuZ2UuZW1pdChjbG9zZWRFdmVudEFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0lneFRvYXN0Q29tcG9uZW50XSxcbiAgICBleHBvcnRzOiBbSWd4VG9hc3RDb21wb25lbnRdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBJZ3hUb2FzdE1vZHVsZSB7IH1cbiIsIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjxzcGFuPnt7IHRleHRNZXNzYWdlIH19PC9zcGFuPlxuXG4iXX0=