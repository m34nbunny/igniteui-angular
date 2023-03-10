import { EventEmitter, OnInit } from '@angular/core';
import { PositionSettings } from '../services/public_api';
import { IgxNotificationsDirective } from '../directives/notification/notifications.directive';
import { ToggleViewEventArgs } from '../directives/toggle/toggle.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
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
export declare class IgxSnackbarComponent extends IgxNotificationsDirective implements OnInit {
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
    id: string;
    /**
     * The default css class applied to the component.
     *
     * @hidden
     * @internal
     */
    cssClass: string;
    /**
     * Sets/gets the `actionText` attribute.
     * ```html
     * <igx-snackbar [actionText] = "'Action Text'"></igx-snackbar>
     * ```
     */
    actionText?: string;
    /**
     * An event that will be emitted when the action button is clicked.
     * Provides reference to the `IgxSnackbarComponent` as an argument.
     * ```html
     * <igx-snackbar (clicked)="clickedHandler($event)"></igx-snackbar>
     * ```
     */
    clicked: EventEmitter<IgxSnackbarComponent>;
    /**
     * An event that will be emitted when the snackbar animation starts.
     * Provides reference to the `ToggleViewEventArgs` interface as an argument.
     * ```html
     * <igx-snackbar (animationStarted) = "animationStarted($event)"></igx-snackbar>
     * ```
     */
    animationStarted: EventEmitter<ToggleViewEventArgs>;
    /**
     * An event that will be emitted when the snackbar animation ends.
     * Provides reference to the `ToggleViewEventArgs` interface as an argument.
     * ```html
     * <igx-snackbar (animationDone) = "animationDone($event)"></igx-snackbar>
     * ```
     */
    animationDone: EventEmitter<ToggleViewEventArgs>;
    /**
     * Get the position and animation settings used by the snackbar.
     * ```typescript
     * @ViewChild('snackbar', { static: true }) public snackbar: IgxSnackbarComponent;
     * let currentPosition: PositionSettings = this.snackbar.positionSettings
     * ```
     */
    get positionSettings(): PositionSettings;
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
    set positionSettings(settings: PositionSettings);
    private _positionSettings;
    /**
     * Shows the snackbar and hides it after the `displayTime` is over if `autoHide` is set to `true`.
     * ```typescript
     * this.snackbar.open();
     * ```
     */
    open(message?: string): void;
    /**
     * Opens or closes the snackbar, depending on its current state.
     *
     * ```typescript
     * this.snackbar.toggle();
     * ```
     */
    toggle(): void;
    /**
     * @hidden
     */
    triggerAction(): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    static ??fac: i0.????FactoryDeclaration<IgxSnackbarComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxSnackbarComponent, "igx-snackbar", never, { "id": "id"; "actionText": "actionText"; "positionSettings": "positionSettings"; }, { "clicked": "clicked"; "animationStarted": "animationStarted"; "animationDone": "animationDone"; }, never, ["*"]>;
}
/**
 * @hidden
 */
export declare class IgxSnackbarModule {
    static ??fac: i0.????FactoryDeclaration<IgxSnackbarModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxSnackbarModule, [typeof IgxSnackbarComponent], [typeof i1.CommonModule], [typeof IgxSnackbarComponent]>;
    static ??inj: i0.????InjectorDeclaration<IgxSnackbarModule>;
}
