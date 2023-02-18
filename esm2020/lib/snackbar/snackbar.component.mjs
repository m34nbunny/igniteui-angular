import { useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, NgModule, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { fadeIn, fadeOut } from '../animations/main';
import { ContainerPositionStrategy, GlobalPositionStrategy, HorizontalAlignment, VerticalAlignment } from '../services/public_api';
import { IgxNotificationsDirective } from '../directives/notification/notifications.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let NEXT_ID = 0;
/**
 * **Ignite UI for Angular Snackbar** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/snackbar.html)
 *
 * The Ignite UI Snack Bar provides feedback about an operation with a single-line message, which can
 * include a link to an action such as Undo.
 *
 * Example:
 * ```html
 * <button (click)="snackbar.show()">Send message</button>
 * <div>
 *   <igx-snackbar #snackbar>
 *      Message sent
 *   </igx-snackbar>
 * </div>
 * ```
 */
export class IgxSnackbarComponent extends IgxNotificationsDirective {
    constructor() {
        super(...arguments);
        /**
         * Sets/gets the `id` of the snackbar.
         * If not set, the `id` of the first snackbar component  will be `"igx-snackbar-0"`;
         * ```html
         * <igx-snackbar id = "Snackbar1"></igx-snackbar>
         * ```
         * ```typescript
         * let snackbarId = this.snackbar.id;
         * ```
         *
         * @memberof IgxSnackbarComponent
         */
        this.id = `igx-snackbar-${NEXT_ID++}`;
        /**
         * The default css class applied to the component.
         *
         * @hidden
         * @internal
         */
        this.cssClass = 'igx-snackbar';
        /**
         * An event that will be emitted when the action button is clicked.
         * Provides reference to the `IgxSnackbarComponent` as an argument.
         * ```html
         * <igx-snackbar (clicked)="clickedHandler($event)"></igx-snackbar>
         * ```
         */
        this.clicked = new EventEmitter();
        /**
         * An event that will be emitted when the snackbar animation starts.
         * Provides reference to the `ToggleViewEventArgs` interface as an argument.
         * ```html
         * <igx-snackbar (animationStarted) = "animationStarted($event)"></igx-snackbar>
         * ```
         */
        this.animationStarted = new EventEmitter();
        /**
         * An event that will be emitted when the snackbar animation ends.
         * Provides reference to the `ToggleViewEventArgs` interface as an argument.
         * ```html
         * <igx-snackbar (animationDone) = "animationDone($event)"></igx-snackbar>
         * ```
         */
        this.animationDone = new EventEmitter();
        this._positionSettings = {
            horizontalDirection: HorizontalAlignment.Center,
            verticalDirection: VerticalAlignment.Bottom,
            openAnimation: useAnimation(fadeIn, { params: { duration: '.35s', easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
                    fromPosition: 'translateY(100%)', toPosition: 'translateY(0)' } }),
            closeAnimation: useAnimation(fadeOut, { params: { duration: '.2s', easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
                    fromPosition: 'translateY(0)', toPosition: 'translateY(100%)' } }),
        };
    }
    /**
     * Get the position and animation settings used by the snackbar.
     * ```typescript
     * @ViewChild('snackbar', { static: true }) public snackbar: IgxSnackbarComponent;
     * let currentPosition: PositionSettings = this.snackbar.positionSettings
     * ```
     */
    get positionSettings() {
        return this._positionSettings;
    }
    /**
     * Set the position and animation settings used by the snackbar.
     * ```html
     * <igx-snackbar [positionSettings]="newPositionSettings"></igx-snackbar>
     * ```
     * ```typescript
     * import { slideInTop, slideOutBottom } from 'igniteui-angular';
     * ...
     * @ViewChild('snackbar', { static: true }) public snackbar: IgxSnackbarComponent;
     *  public newPositionSettings: PositionSettings = {
     *      openAnimation: useAnimation(slideInTop, { params: { duration: '1000ms', fromPosition: 'translateY(100%)'}}),
     *      closeAnimation: useAnimation(slideOutBottom, { params: { duration: '1000ms', fromPosition: 'translateY(0)'}}),
     *      horizontalDirection: HorizontalAlignment.Left,
     *      verticalDirection: VerticalAlignment.Middle,
     *      horizontalStartPoint: HorizontalAlignment.Left,
     *      verticalStartPoint: VerticalAlignment.Middle,
     *      minSize: { height: 100, width: 100 }
     *  };
     * this.snackbar.positionSettings = this.newPositionSettings;
     * ```
     */
    set positionSettings(settings) {
        this._positionSettings = settings;
    }
    /**
     * Shows the snackbar and hides it after the `displayTime` is over if `autoHide` is set to `true`.
     * ```typescript
     * this.snackbar.open();
     * ```
     */
    open(message) {
        if (message !== undefined) {
            this.textMessage = message;
        }
        this.strategy = this.outlet ? new ContainerPositionStrategy(this.positionSettings)
            : new GlobalPositionStrategy(this.positionSettings);
        super.open();
    }
    /**
     * Opens or closes the snackbar, depending on its current state.
     *
     * ```typescript
     * this.snackbar.toggle();
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
    triggerAction() {
        this.clicked.emit(this);
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.opened.pipe(takeUntil(this.d$)).subscribe(() => {
            const openedEventArgs = { owner: this, id: this._overlayId };
            this.animationStarted.emit(openedEventArgs);
        });
        this.closed.pipe(takeUntil(this.d$)).subscribe(() => {
            const closedEventArgs = { owner: this, id: this._overlayId };
            this.animationDone.emit(closedEventArgs);
        });
    }
}
IgxSnackbarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSnackbarComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxSnackbarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSnackbarComponent, selector: "igx-snackbar", inputs: { id: "id", actionText: "actionText", positionSettings: "positionSettings" }, outputs: { clicked: "clicked", animationStarted: "animationStarted", animationDone: "animationDone" }, host: { properties: { "attr.id": "this.id", "class.igx-snackbar": "this.cssClass" } }, usesInheritance: true, ngImport: i0, template: "<div class=\"igx-snackbar__message\">\n    {{ textMessage }}\n    <ng-content></ng-content>\n</div>\n<button class=\"igx-snackbar__button\" igxRipple=\"white\" *ngIf=\"actionText\" (click)=\"triggerAction()\">\n    {{ actionText }}\n</button>\n", directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSnackbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-snackbar', template: "<div class=\"igx-snackbar__message\">\n    {{ textMessage }}\n    <ng-content></ng-content>\n</div>\n<button class=\"igx-snackbar__button\" igxRipple=\"white\" *ngIf=\"actionText\" (click)=\"triggerAction()\">\n    {{ actionText }}\n</button>\n" }]
        }], propDecorators: { id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-snackbar']
            }], actionText: [{
                type: Input
            }], clicked: [{
                type: Output
            }], animationStarted: [{
                type: Output
            }], animationDone: [{
                type: Output
            }], positionSettings: [{
                type: Input
            }] } });
/**
 * @hidden
 */
export class IgxSnackbarModule {
}
IgxSnackbarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSnackbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxSnackbarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSnackbarModule, declarations: [IgxSnackbarComponent], imports: [CommonModule], exports: [IgxSnackbarComponent] });
IgxSnackbarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSnackbarModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSnackbarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxSnackbarComponent],
                    exports: [IgxSnackbarComponent],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2tiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3NuYWNrYmFyL3NuYWNrYmFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zbmFja2Jhci9zbmFja2Jhci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxFQUVSLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQ3pELGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDeEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7OztBQUcvRixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEI7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFLSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEseUJBQXlCO0lBSm5FOztRQU1JOzs7Ozs7Ozs7OztXQVdHO1FBR0ksT0FBRSxHQUFHLGdCQUFnQixPQUFPLEVBQUUsRUFBRSxDQUFDO1FBRXhDOzs7OztXQUtHO1FBRUksYUFBUSxHQUFHLGNBQWMsQ0FBQztRQVVqQzs7Ozs7O1dBTUc7UUFFSSxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQXdCLENBQUM7UUFFMUQ7Ozs7OztXQU1HO1FBQ2MscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFNUU7Ozs7OztXQU1HO1FBQ2Msa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQXdDakUsc0JBQWlCLEdBQXFCO1lBQzFDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLE1BQU07WUFDL0MsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtZQUMzQyxhQUFhLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGdDQUFnQztvQkFDdEcsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUMsRUFBRSxDQUFDO1lBQ3JFLGNBQWMsRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUcsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsOEJBQThCO29CQUN0RyxZQUFZLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBQyxFQUFFLENBQUM7U0FDeEUsQ0FBQztLQXVETDtJQW5HRzs7Ozs7O09BTUc7SUFDSCxJQUNXLGdCQUFnQjtRQUN2QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0JHO0lBQ0gsSUFBVyxnQkFBZ0IsQ0FBQyxRQUEwQjtRQUNsRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO0lBQ3RDLENBQUM7SUFXRDs7Ozs7T0FLRztJQUNJLElBQUksQ0FBQyxPQUFnQjtRQUN4QixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7U0FDOUI7UUFHRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUkseUJBQXlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQzlFLENBQUMsQ0FBQyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hELEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssTUFBTTtRQUNWLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNmO2FBQU07WUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxhQUFhO1FBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNoRCxNQUFNLGVBQWUsR0FBd0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2hELE1BQU0sZUFBZSxHQUF3QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7O2lIQWxLUSxvQkFBb0I7cUdBQXBCLG9CQUFvQiwrVkN4Q2pDLHNQQU9BOzJGRGlDYSxvQkFBb0I7a0JBSmhDLFNBQVM7K0JBQ0ksY0FBYzs4QkFtQmpCLEVBQUU7c0JBRlIsV0FBVzt1QkFBQyxTQUFTOztzQkFDckIsS0FBSztnQkFVQyxRQUFRO3NCQURkLFdBQVc7dUJBQUMsb0JBQW9CO2dCQVNqQixVQUFVO3NCQUF6QixLQUFLO2dCQVVDLE9BQU87c0JBRGIsTUFBTTtnQkFVVSxnQkFBZ0I7c0JBQWhDLE1BQU07Z0JBU1UsYUFBYTtzQkFBN0IsTUFBTTtnQkFXSSxnQkFBZ0I7c0JBRDFCLEtBQUs7O0FBOEZWOztHQUVHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQTdLakIsb0JBQW9CLGFBMktuQixZQUFZLGFBM0tiLG9CQUFvQjsrR0E2S3BCLGlCQUFpQixZQUZqQixDQUFDLFlBQVksQ0FBQzsyRkFFZCxpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQ3BDLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO29CQUMvQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQW5pbWF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBmYWRlSW4sIGZhZGVPdXQgfSBmcm9tICcuLi9hbmltYXRpb25zL21haW4nO1xuaW1wb3J0IHsgQ29udGFpbmVyUG9zaXRpb25TdHJhdGVneSwgR2xvYmFsUG9zaXRpb25TdHJhdGVneSwgSG9yaXpvbnRhbEFsaWdubWVudCxcbiAgICBQb3NpdGlvblNldHRpbmdzLCBWZXJ0aWNhbEFsaWdubWVudCB9IGZyb20gJy4uL3NlcnZpY2VzL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4Tm90aWZpY2F0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbnMuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRvZ2dsZVZpZXdFdmVudEFyZ3MgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3RvZ2dsZS90b2dnbGUuZGlyZWN0aXZlJztcblxubGV0IE5FWFRfSUQgPSAwO1xuLyoqXG4gKiAqKklnbml0ZSBVSSBmb3IgQW5ndWxhciBTbmFja2JhcioqIC1cbiAqIFtEb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5pbmZyYWdpc3RpY3MuY29tL3Byb2R1Y3RzL2lnbml0ZS11aS1hbmd1bGFyL2FuZ3VsYXIvY29tcG9uZW50cy9zbmFja2Jhci5odG1sKVxuICpcbiAqIFRoZSBJZ25pdGUgVUkgU25hY2sgQmFyIHByb3ZpZGVzIGZlZWRiYWNrIGFib3V0IGFuIG9wZXJhdGlvbiB3aXRoIGEgc2luZ2xlLWxpbmUgbWVzc2FnZSwgd2hpY2ggY2FuXG4gKiBpbmNsdWRlIGEgbGluayB0byBhbiBhY3Rpb24gc3VjaCBhcyBVbmRvLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBodG1sXG4gKiA8YnV0dG9uIChjbGljayk9XCJzbmFja2Jhci5zaG93KClcIj5TZW5kIG1lc3NhZ2U8L2J1dHRvbj5cbiAqIDxkaXY+XG4gKiAgIDxpZ3gtc25hY2tiYXIgI3NuYWNrYmFyPlxuICogICAgICBNZXNzYWdlIHNlbnRcbiAqICAgPC9pZ3gtc25hY2tiYXI+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lneC1zbmFja2JhcicsXG4gICAgdGVtcGxhdGVVcmw6ICdzbmFja2Jhci5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4U25hY2tiYXJDb21wb25lbnQgZXh0ZW5kcyBJZ3hOb3RpZmljYXRpb25zRGlyZWN0aXZlXG4gICAgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGlkYCBvZiB0aGUgc25hY2tiYXIuXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgb2YgdGhlIGZpcnN0IHNuYWNrYmFyIGNvbXBvbmVudCAgd2lsbCBiZSBgXCJpZ3gtc25hY2tiYXItMFwiYDtcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbmFja2JhciBpZCA9IFwiU25hY2tiYXIxXCI+PC9pZ3gtc25hY2tiYXI+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBzbmFja2JhcklkID0gdGhpcy5zbmFja2Jhci5pZDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hTbmFja2JhckNvbXBvbmVudFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5pZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWQgPSBgaWd4LXNuYWNrYmFyLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBjc3MgY2xhc3MgYXBwbGllZCB0byB0aGUgY29tcG9uZW50LlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LXNuYWNrYmFyJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LXNuYWNrYmFyJztcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGFjdGlvblRleHRgIGF0dHJpYnV0ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbmFja2JhciBbYWN0aW9uVGV4dF0gPSBcIidBY3Rpb24gVGV4dCdcIj48L2lneC1zbmFja2Jhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYWN0aW9uVGV4dD86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRoYXQgd2lsbCBiZSBlbWl0dGVkIHdoZW4gdGhlIGFjdGlvbiBidXR0b24gaXMgY2xpY2tlZC5cbiAgICAgKiBQcm92aWRlcyByZWZlcmVuY2UgdG8gdGhlIGBJZ3hTbmFja2JhckNvbXBvbmVudGAgYXMgYW4gYXJndW1lbnQuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc25hY2tiYXIgKGNsaWNrZWQpPVwiY2xpY2tlZEhhbmRsZXIoJGV2ZW50KVwiPjwvaWd4LXNuYWNrYmFyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxJZ3hTbmFja2JhckNvbXBvbmVudD4oKTtcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRoYXQgd2lsbCBiZSBlbWl0dGVkIHdoZW4gdGhlIHNuYWNrYmFyIGFuaW1hdGlvbiBzdGFydHMuXG4gICAgICogUHJvdmlkZXMgcmVmZXJlbmNlIHRvIHRoZSBgVG9nZ2xlVmlld0V2ZW50QXJnc2AgaW50ZXJmYWNlIGFzIGFuIGFyZ3VtZW50LlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNuYWNrYmFyIChhbmltYXRpb25TdGFydGVkKSA9IFwiYW5pbWF0aW9uU3RhcnRlZCgkZXZlbnQpXCI+PC9pZ3gtc25hY2tiYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBhbmltYXRpb25TdGFydGVkID0gbmV3IEV2ZW50RW1pdHRlcjxUb2dnbGVWaWV3RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdGhhdCB3aWxsIGJlIGVtaXR0ZWQgd2hlbiB0aGUgc25hY2tiYXIgYW5pbWF0aW9uIGVuZHMuXG4gICAgICogUHJvdmlkZXMgcmVmZXJlbmNlIHRvIHRoZSBgVG9nZ2xlVmlld0V2ZW50QXJnc2AgaW50ZXJmYWNlIGFzIGFuIGFyZ3VtZW50LlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNuYWNrYmFyIChhbmltYXRpb25Eb25lKSA9IFwiYW5pbWF0aW9uRG9uZSgkZXZlbnQpXCI+PC9pZ3gtc25hY2tiYXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBhbmltYXRpb25Eb25lID0gbmV3IEV2ZW50RW1pdHRlcjxUb2dnbGVWaWV3RXZlbnRBcmdzPigpO1xuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHBvc2l0aW9uIGFuZCBhbmltYXRpb24gc2V0dGluZ3MgdXNlZCBieSB0aGUgc25hY2tiYXIuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoJ3NuYWNrYmFyJywgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIHNuYWNrYmFyOiBJZ3hTbmFja2JhckNvbXBvbmVudDtcbiAgICAgKiBsZXQgY3VycmVudFBvc2l0aW9uOiBQb3NpdGlvblNldHRpbmdzID0gdGhpcy5zbmFja2Jhci5wb3NpdGlvblNldHRpbmdzXG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uU2V0dGluZ3MoKTogUG9zaXRpb25TZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvblNldHRpbmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcG9zaXRpb24gYW5kIGFuaW1hdGlvbiBzZXR0aW5ncyB1c2VkIGJ5IHRoZSBzbmFja2Jhci5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zbmFja2JhciBbcG9zaXRpb25TZXR0aW5nc109XCJuZXdQb3NpdGlvblNldHRpbmdzXCI+PC9pZ3gtc25hY2tiYXI+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGltcG9ydCB7IHNsaWRlSW5Ub3AsIHNsaWRlT3V0Qm90dG9tIH0gZnJvbSAnaWduaXRldWktYW5ndWxhcic7XG4gICAgICogLi4uXG4gICAgICogQFZpZXdDaGlsZCgnc25hY2tiYXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgc25hY2tiYXI6IElneFNuYWNrYmFyQ29tcG9uZW50O1xuICAgICAqICBwdWJsaWMgbmV3UG9zaXRpb25TZXR0aW5nczogUG9zaXRpb25TZXR0aW5ncyA9IHtcbiAgICAgKiAgICAgIG9wZW5BbmltYXRpb246IHVzZUFuaW1hdGlvbihzbGlkZUluVG9wLCB7IHBhcmFtczogeyBkdXJhdGlvbjogJzEwMDBtcycsIGZyb21Qb3NpdGlvbjogJ3RyYW5zbGF0ZVkoMTAwJSknfX0pLFxuICAgICAqICAgICAgY2xvc2VBbmltYXRpb246IHVzZUFuaW1hdGlvbihzbGlkZU91dEJvdHRvbSwgeyBwYXJhbXM6IHsgZHVyYXRpb246ICcxMDAwbXMnLCBmcm9tUG9zaXRpb246ICd0cmFuc2xhdGVZKDApJ319KSxcbiAgICAgKiAgICAgIGhvcml6b250YWxEaXJlY3Rpb246IEhvcml6b250YWxBbGlnbm1lbnQuTGVmdCxcbiAgICAgKiAgICAgIHZlcnRpY2FsRGlyZWN0aW9uOiBWZXJ0aWNhbEFsaWdubWVudC5NaWRkbGUsXG4gICAgICogICAgICBob3Jpem9udGFsU3RhcnRQb2ludDogSG9yaXpvbnRhbEFsaWdubWVudC5MZWZ0LFxuICAgICAqICAgICAgdmVydGljYWxTdGFydFBvaW50OiBWZXJ0aWNhbEFsaWdubWVudC5NaWRkbGUsXG4gICAgICogICAgICBtaW5TaXplOiB7IGhlaWdodDogMTAwLCB3aWR0aDogMTAwIH1cbiAgICAgKiAgfTtcbiAgICAgKiB0aGlzLnNuYWNrYmFyLnBvc2l0aW9uU2V0dGluZ3MgPSB0aGlzLm5ld1Bvc2l0aW9uU2V0dGluZ3M7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBwb3NpdGlvblNldHRpbmdzKHNldHRpbmdzOiBQb3NpdGlvblNldHRpbmdzKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uU2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wb3NpdGlvblNldHRpbmdzOiBQb3NpdGlvblNldHRpbmdzID0ge1xuICAgICAgICBob3Jpem9udGFsRGlyZWN0aW9uOiBIb3Jpem9udGFsQWxpZ25tZW50LkNlbnRlcixcbiAgICAgICAgdmVydGljYWxEaXJlY3Rpb246IFZlcnRpY2FsQWxpZ25tZW50LkJvdHRvbSxcbiAgICAgICAgb3BlbkFuaW1hdGlvbjogdXNlQW5pbWF0aW9uKGZhZGVJbiwgeyBwYXJhbXM6IHsgZHVyYXRpb246ICcuMzVzJywgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMCwgMC4wLCAwLjIsIDEpJyxcbiAgICAgICAgICAgIGZyb21Qb3NpdGlvbjogJ3RyYW5zbGF0ZVkoMTAwJSknLCB0b1Bvc2l0aW9uOiAndHJhbnNsYXRlWSgwKSd9IH0pLFxuICAgICAgICBjbG9zZUFuaW1hdGlvbjogdXNlQW5pbWF0aW9uKGZhZGVPdXQsIHsgIHBhcmFtczogeyBkdXJhdGlvbjogJy4ycycsIGVhc2luZzogJ2N1YmljLWJlemllcigwLjQsIDAuMCwgMSwgMSknLFxuICAgICAgICAgICAgZnJvbVBvc2l0aW9uOiAndHJhbnNsYXRlWSgwKScsIHRvUG9zaXRpb246ICd0cmFuc2xhdGVZKDEwMCUpJ30gfSksXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNob3dzIHRoZSBzbmFja2JhciBhbmQgaGlkZXMgaXQgYWZ0ZXIgdGhlIGBkaXNwbGF5VGltZWAgaXMgb3ZlciBpZiBgYXV0b0hpZGVgIGlzIHNldCB0byBgdHJ1ZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuc25hY2tiYXIub3BlbigpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuc3RyYXRlZ3kgPSB0aGlzLm91dGxldCA/IG5ldyBDb250YWluZXJQb3NpdGlvblN0cmF0ZWd5KHRoaXMucG9zaXRpb25TZXR0aW5ncylcbiAgICAgICAgICAgIDogbmV3IEdsb2JhbFBvc2l0aW9uU3RyYXRlZ3kodGhpcy5wb3NpdGlvblNldHRpbmdzKTtcbiAgICAgICAgc3VwZXIub3BlbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wZW5zIG9yIGNsb3NlcyB0aGUgc25hY2tiYXIsIGRlcGVuZGluZyBvbiBpdHMgY3VycmVudCBzdGF0ZS5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnNuYWNrYmFyLnRvZ2dsZSgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBwdWJsaWMgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQgfHwgdGhpcy5pc0Nsb3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyB0cmlnZ2VyQWN0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWNrZWQuZW1pdCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm9wZW5lZC5waXBlKHRha2VVbnRpbCh0aGlzLmQkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZW5lZEV2ZW50QXJnczogVG9nZ2xlVmlld0V2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIGlkOiB0aGlzLl9vdmVybGF5SWQgfTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhcnRlZC5lbWl0KG9wZW5lZEV2ZW50QXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2xvc2VkLnBpcGUodGFrZVVudGlsKHRoaXMuZCQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2xvc2VkRXZlbnRBcmdzOiBUb2dnbGVWaWV3RXZlbnRBcmdzID0geyBvd25lcjogdGhpcywgaWQ6IHRoaXMuX292ZXJsYXlJZCB9O1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Eb25lLmVtaXQoY2xvc2VkRXZlbnRBcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtJZ3hTbmFja2JhckNvbXBvbmVudF0sXG4gICAgZXhwb3J0czogW0lneFNuYWNrYmFyQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hTbmFja2Jhck1vZHVsZSB7IH1cbiIsIjxkaXYgY2xhc3M9XCJpZ3gtc25hY2tiYXJfX21lc3NhZ2VcIj5cbiAgICB7eyB0ZXh0TWVzc2FnZSB9fVxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PlxuPGJ1dHRvbiBjbGFzcz1cImlneC1zbmFja2Jhcl9fYnV0dG9uXCIgaWd4UmlwcGxlPVwid2hpdGVcIiAqbmdJZj1cImFjdGlvblRleHRcIiAoY2xpY2spPVwidHJpZ2dlckFjdGlvbigpXCI+XG4gICAge3sgYWN0aW9uVGV4dCB9fVxuPC9idXR0b24+XG4iXX0=