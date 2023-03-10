import { ElementRef, EventEmitter, OnDestroy, OnInit, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IgxNavigationService, IToggleView } from '../core/navigation';
import { IgxButtonType } from '../directives/button/button.directive';
import { IgxToggleDirective } from '../directives/toggle/toggle.directive';
import { OverlaySettings, PositionSettings } from '../services/public_api';
import { CancelableEventArgs, IBaseEventArgs } from '../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "./dialog.directives";
import * as i2 from "@angular/common";
import * as i3 from "../directives/toggle/toggle.directive";
import * as i4 from "../directives/button/button.directive";
import * as i5 from "../directives/ripple/ripple.directive";
import * as i6 from "../directives/focus/focus.directive";
import * as i7 from "../directives/focus-trap/focus-trap.directive";
/**
 * **Ignite UI for Angular Dialog Window** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/dialog.html)
 *
 * The Ignite UI Dialog Window presents a dialog window to the user which can simply display messages or display
 * more complicated visuals such as a user sign-in form.  It also provides a right and left button
 * which can be used for custom actions.
 *
 * Example:
 * ```html
 * <button (click)="form.open()">Show Dialog</button>
 * <igx-dialog #form title="Sign In" rightButtonLabel="OK">
 *   <div>
 *     <igx-input-group>
 *       <input type="text" igxInput/>
 *       <label igxLabel>Username</label>
 *     </igx-input-group>
 *   </div>
 *   <div>
 *     <igx-input-group>
 *       <input type="password" igxInput/>
 *       <label igxLabel>Password</label>
 *     </igx-input-group>
 *   </div>
 * </igx-dialog>
 * ```
 */
export declare class IgxDialogComponent implements IToggleView, OnInit, OnDestroy, AfterContentInit {
    private elementRef;
    private navService;
    private static NEXT_ID;
    private static readonly DIALOG_CLASS;
    toggleRef: IgxToggleDirective;
    /**
     * An @Input property that sets the value of the `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-dialog [id]="'igx-dialog-56'" #alert title="Notification"
     *  leftButtonLabel="OK" (leftButtonSelect)="alert.close()">
     * </igx-dialog>
     * ```
     */
    id: string;
    /**
     * Controls whether the dialog should be shown as modal. Defaults to `true`
     * ```html
     * <igx-dialog [isModal]="false" ></igx-dialog>
     * ```
     */
    get isModal(): boolean;
    set isModal(val: boolean);
    /**
     * Controls whether the dialog should close when `Esc` key is pressed. Defaults to `true`
     * ```html
     * <igx-dialog [closeOnEscape]="false" ></igx-dialog>
     * ```
     */
    get closeOnEscape(): boolean;
    set closeOnEscape(val: boolean);
    /**
     * An @Input property to set whether the Tab key focus is trapped within the dialog when opened.
     * Defaults to `true`.
     * ```html
     * <igx-dialog focusTrap="false""></igx-dialog>
     * ```
     */
    focusTrap: boolean;
    /**
     * An @Input property controlling the `title` of the dialog.
     * ```html
     * <igx-dialog title="Notification" #alert leftButtonLabel="OK" (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    title: string;
    /**
     *  An @Input property controlling the `message` of the dialog.
     * ```html
     * <igx-dialog message="Your email was sent!" #alert leftButtonLabel="OK" (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    message: string;
    /**
     * An @Input property to set the `label` of the left button of the dialog.
     * ```html
     * <igx-dialog leftButtonLabel="OKAY" #alert title="Notification"  (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    leftButtonLabel: string;
    /**
     * An @Input property to set the left button `type`. The types are `flat`, `raised` and `fab`.
     * The `flat` type button is a rectangle and doesn't have a shadow. <br>
     * The `raised` type button is also a rectangle but has a shadow. <br>
     * The `fab` type button is a circle with a shadow. <br>
     * The default value is `flat`.
     * ```html
     * <igx-dialog leftButtonType="raised" leftButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    leftButtonType: IgxButtonType;
    /**
     * An @Input property to set the left button color. The property accepts all valid CSS color property values.
     * ```html
     * <igx-dialog leftButtonColor="yellow" leftButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    leftButtonColor: string;
    /**
     * An @Input property to set the left button `background-color`. The property accepts all valid CSS color property values.
     * ```html
     * <igx-dialog leftButtonBackgroundColor="black" leftButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    leftButtonBackgroundColor: string;
    /**
     * An @Input property to set the left button `ripple`. The `ripple` animates a click/tap to a component as a series of fading waves.
     * The property accepts all valid CSS color property values.
     * ```html
     * <igx-dialog leftButtonRipple="green" leftButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    leftButtonRipple: string;
    /**
     * An @Input property to set the `label` of the right button of the dialog.
     * ```html
     * <igx-dialog rightButtonLabel="OKAY" #alert title="Notification"  (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    rightButtonLabel: string;
    /**
     * An @Input property to set the right button `type`. The types are `flat`, `raised` and `fab`.
     * The `flat` type button is a rectangle and doesn't have a shadow. <br>
     * The `raised` type button is also a rectangle but has a shadow. <br>
     * The `fab` type button is a circle with a shadow. <br>
     * The default value is `flat`.
     * ```html
     * <igx-dialog rightButtonType="fab" rightButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    rightButtonType: IgxButtonType;
    /**
     * An @Input property to set the right button `color`. The property accepts all valid CSS color property values.
     * ```html
     * <igx-dialog rightButtonColor="yellow" rightButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    rightButtonColor: string;
    /**
     * An @Input property to set the right button `background-color`. The property accepts all valid CSS color property values.
     * ```html
     * <igx-dialog rightButtonBackgroundColor="black" rightButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    rightButtonBackgroundColor: string;
    /**
     * An @Input property to set the right button `ripple`.
     * ```html
     * <igx-dialog rightButtonRipple="green" rightButtonLabel="OKAY" #alert (leftButtonSelect)="alert.close()"></igx-dialog>
     * ```
     */
    rightButtonRipple: string;
    /**
     * An @Input property that allows you to enable the "close on click outside the dialog". By default it's disabled.
     * ```html
     * <igx-dialog closeOnOutsideSelect="true" leftButtonLabel="Cancel" (leftButtonSelect)="dialog.close()"
     * rightButtonLabel="OK" rightButtonRipple="#4CAF50" (rightButtonSelect)="onDialogOKSelected($event)">
     * </igx-dialog>
     * ```
     */
    get closeOnOutsideSelect(): boolean;
    set closeOnOutsideSelect(val: boolean);
    /**
     * Get the position and animation settings used by the dialog.
     * ```typescript
     * @ViewChild('alert', { static: true }) public alert: IgxDialogComponent;
     * let currentPosition: PositionSettings = this.alert.positionSettings
     * ```
     */
    get positionSettings(): PositionSettings;
    /**
     * Set the position and animation settings used by the dialog.
     * ```typescript
     * import { slideInLeft, slideOutRight } from 'igniteui-angular';
     * ...
     * @ViewChild('alert', { static: true }) public alert: IgxDialogComponent;
     *  public newPositionSettings: PositionSettings = {
     *      openAnimation: useAnimation(slideInTop, { params: { duration: '2000ms' } }),
     *      closeAnimation: useAnimation(slideOutBottom, { params: { duration: '2000ms'} }),
     *      horizontalDirection: HorizontalAlignment.Left,
     *      verticalDirection: VerticalAlignment.Middle,
     *      horizontalStartPoint: HorizontalAlignment.Left,
     *      verticalStartPoint: VerticalAlignment.Middle,
     *      minSize: { height: 100, width: 100 }
     *  };
     * this.alert.positionSettings = this.newPositionSettings;
     * ```
     */
    set positionSettings(settings: PositionSettings);
    /**
     * The default `tabindex` attribute for the component
     *
     * @hidden
     */
    tabindex: number;
    /**
     * An event that is emitted before the dialog is opened.
     * ```html
     * <igx-dialog (opening)="onDialogOpenHandler($event)" (leftButtonSelect)="dialog.close()" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    opening: EventEmitter<IDialogCancellableEventArgs>;
    /**
     * An event that is emitted after the dialog is opened.
     * ```html
     * <igx-dialog (onOpened)="onDialogOpenedHandler($event)" (leftButtonSelect)="dialog.close()" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    opened: EventEmitter<IDialogEventArgs>;
    /**
     * An event that is emitted before the dialog is closed.
     * ```html
     * <igx-dialog (closing)="onDialogCloseHandler($event)" title="Confirmation" leftButtonLabel="Cancel" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    closing: EventEmitter<IDialogCancellableEventArgs>;
    /**
     * An event that is emitted after the dialog is closed.
     * ```html
     * <igx-dialog (closed)="onDialogClosedHandler($event)" title="Confirmation" leftButtonLabel="Cancel" rightButtonLabel="OK">
     * </igx-dialog>
     * ```
     */
    closed: EventEmitter<IDialogEventArgs>;
    /**
     * An event that is emitted when the left button is clicked.
     * ```html
     * <igx-dialog (leftButtonSelect)="onDialogOKSelected($event)" #dialog leftButtonLabel="OK" rightButtonLabel="Cancel">
     * </igx-dialog>
     * ```
     */
    leftButtonSelect: EventEmitter<IDialogEventArgs>;
    /**
     * An event that is emitted when the right button is clicked.
     * ```html
     * <igx-dialog (rightButtonSelect)="onDialogOKSelected($event)"
     * #dialog title="Confirmation" (leftButtonSelect)="dialog.close()" rightButtonLabel="OK"
     * rightButtonRipple="#4CAF50" closeOnOutsideSelect="true">
     * </igx-dialog>
     * ```
     */
    rightButtonSelect: EventEmitter<IDialogEventArgs>;
    /**
     * @hidden
     */
    isOpenChange: EventEmitter<boolean>;
    /**
     * @hidden
     */
    get element(): any;
    /**
     * Returns the value of state. Possible state values are "open" or "close".
     * ```typescript
     * @ViewChild("MyDialog")
     * public dialog: IgxDialogComponent;
     * ngAfterViewInit() {
     *     let dialogState = this.dialog.state;
     * }
     * ```
     */
    get state(): string;
    /**
     * State of the dialog.
     *
     * ```typescript
     * // get
     * let dialogIsOpen = this.dialog.isOpen;
     * ```
     *
     * ```html
     * <!--set-->
     * <igx-dialog [isOpen]='false'></igx-dialog>
     * ```
     *
     * Two-way data binding.
     * ```html
     * <!--set-->
     * <igx-dialog [(isOpen)]='model.isOpen'></igx-dialog>
     * ```
     */
    get isOpen(): boolean;
    set isOpen(value: boolean);
    get isCollapsed(): boolean;
    /**
     * Returns the value of the role of the dialog. The valid values are `dialog`, `alertdialog`, `alert`.
     * ```typescript
     * @ViewChild("MyDialog")
     * public dialog: IgxDialogComponent;
     * ngAfterViewInit() {
     *     let dialogRole = this.dialog.role;
     * }
     *  ```
     */
    get role(): "dialog" | "alertdialog" | "alert";
    /**
     * Returns the value of the title id.
     * ```typescript
     *  @ViewChild("MyDialog")
     * public dialog: IgxDialogComponent;
     * ngAfterViewInit() {
     *     let dialogTitle = this.dialog.titleId;
     * }
     * ```
     */
    get titleId(): string;
    protected destroy$: Subject<boolean>;
    private _positionSettings;
    private _overlayDefaultSettings;
    private _closeOnOutsideSelect;
    private _closeOnEscape;
    private _isModal;
    private _titleId;
    constructor(elementRef: ElementRef, navService: IgxNavigationService);
    ngAfterContentInit(): void;
    /**
     * A method that opens the dialog.
     *
     * @memberOf {@link IgxDialogComponent}
     * ```html
     * <button (click)="dialog.open() igxButton="raised" igxButtonColor="white" igxRipple="white">Trigger Dialog</button>
     * <igx-dialog #dialog></igx-dialog>
     * ```
     */
    open(overlaySettings?: OverlaySettings): void;
    /**
     * A method that that closes the dialog.
     *
     *  @memberOf {@link IgxDialogComponent}
     * ```html
     * <button (click)="dialog.close() igxButton="raised" igxButtonColor="white" igxRipple="white">Trigger Dialog</button>
     * <igx-dialog #dialog></igx-dialog>
     * ```
     */
    close(): void;
    /**
     * A method that opens/closes the dialog.
     *
     * @memberOf {@link IgxDialogComponent}
     * ```html
     * <button (click)="dialog.toggle() igxButton="raised" igxButtonColor="white" igxRipple="white">Trigger Dialog</button>
     * <igx-dialog #dialog></igx-dialog>
     * ```
     */
    toggle(): void;
    /**
     * @hidden
     */
    onDialogSelected(event: any): void;
    /**
     * @hidden
     */
    onInternalLeftButtonSelect(event: any): void;
    /**
     * @hidden
     */
    onInternalRightButtonSelect(event: any): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    private emitCloseFromDialog;
    private emitClosedFromDialog;
    private emitOpenedFromDialog;
    static ??fac: i0.????FactoryDeclaration<IgxDialogComponent, [null, { optional: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxDialogComponent, "igx-dialog", never, { "id": "id"; "isModal": "isModal"; "closeOnEscape": "closeOnEscape"; "focusTrap": "focusTrap"; "title": "title"; "message": "message"; "leftButtonLabel": "leftButtonLabel"; "leftButtonType": "leftButtonType"; "leftButtonColor": "leftButtonColor"; "leftButtonBackgroundColor": "leftButtonBackgroundColor"; "leftButtonRipple": "leftButtonRipple"; "rightButtonLabel": "rightButtonLabel"; "rightButtonType": "rightButtonType"; "rightButtonColor": "rightButtonColor"; "rightButtonBackgroundColor": "rightButtonBackgroundColor"; "rightButtonRipple": "rightButtonRipple"; "closeOnOutsideSelect": "closeOnOutsideSelect"; "positionSettings": "positionSettings"; "isOpen": "isOpen"; "role": "role"; "titleId": "titleId"; }, { "opening": "opening"; "opened": "opened"; "closing": "closing"; "closed": "closed"; "leftButtonSelect": "leftButtonSelect"; "rightButtonSelect": "rightButtonSelect"; "isOpenChange": "isOpenChange"; }, never, ["igx-dialog-title,[igxDialogTitle]", "*", "igx-dialog-actions,[igxDialogActions]"]>;
}
export interface IDialogEventArgs extends IBaseEventArgs {
    dialog: IgxDialogComponent;
    event: Event;
}
export interface IDialogCancellableEventArgs extends IDialogEventArgs, CancelableEventArgs {
}
/**
 * @hidden
 */
export declare class IgxDialogModule {
    static ??fac: i0.????FactoryDeclaration<IgxDialogModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxDialogModule, [typeof IgxDialogComponent, typeof i1.IgxDialogTitleDirective, typeof i1.IgxDialogActionsDirective], [typeof i2.CommonModule, typeof i3.IgxToggleModule, typeof i4.IgxButtonModule, typeof i5.IgxRippleModule, typeof i6.IgxFocusModule, typeof i7.IgxFocusTrapModule], [typeof IgxDialogComponent, typeof i1.IgxDialogTitleDirective, typeof i1.IgxDialogActionsDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxDialogModule>;
}
export * from './dialog.directives';
