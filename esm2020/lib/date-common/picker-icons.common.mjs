import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, HostListener, NgModule, Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Templates the default toggle icon in the picker.
 *
 * @remarks Can be applied to IgxDatePickerComponent, IgxTimePickerComponent, IgxDateRangePickerComponent
 *
 * @example
 * ```html
 * <igx-date-range-picker>
 *   <igx-picker-toggle igxSuffix>
 *      <igx-icon>calendar_view_day</igx-icon>
 *   </igx-picker-toggle>
 * </igx-date-range-picker>
 * ```
 */
export class IgxPickerToggleComponent {
    constructor() {
        this.clicked = new EventEmitter();
    }
    onClick(event) {
        // do not focus input on click
        event.stopPropagation();
        this.clicked.emit();
    }
}
IgxPickerToggleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickerToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxPickerToggleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxPickerToggleComponent, selector: "igx-picker-toggle", outputs: { clicked: "clicked" }, host: { listeners: { "click": "onClick($event)" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickerToggleComponent, decorators: [{
            type: Component,
            args: [{
                    template: `<ng-content></ng-content>`,
                    selector: 'igx-picker-toggle'
                }]
        }], propDecorators: { clicked: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
/**
 * Templates the default clear icon in the picker.
 *
 * @remarks Can be applied to IgxDatePickerComponent, IgxTimePickerComponent, IgxDateRangePickerComponent
 *
 * @example
 * ```html
 * <igx-date-picker>
 *   <igx-picker-clear igxSuffix>
 *      <igx-icon>delete</igx-icon>
 *   </igx-picker-clear>
 * </igx-date-picker>
 * ```
 */
export class IgxPickerClearComponent extends IgxPickerToggleComponent {
}
IgxPickerClearComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickerClearComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxPickerClearComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxPickerClearComponent, selector: "igx-picker-clear", usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickerClearComponent, decorators: [{
            type: Component,
            args: [{
                    template: `<ng-content></ng-content>`,
                    selector: 'igx-picker-clear'
                }]
        }] });
/**
 * IgxPickerActionsDirective can be used to re-template the dropdown/dialog action buttons.
 *
 * @remarks Can be applied to IgxDatePickerComponent, IgxTimePickerComponent, IgxDateRangePickerComponent
 *
 */
export class IgxPickerActionsDirective {
    constructor(template) {
        this.template = template;
    }
}
IgxPickerActionsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickerActionsDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxPickerActionsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxPickerActionsDirective, selector: "[igxPickerActions]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickerActionsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxPickerActions]'
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/** @hidden */
export class IgxPickersCommonModule {
}
IgxPickersCommonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickersCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxPickersCommonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickersCommonModule, declarations: [IgxPickerToggleComponent, IgxPickerClearComponent, IgxPickerActionsDirective], imports: [CommonModule], exports: [IgxPickerToggleComponent, IgxPickerClearComponent, IgxPickerActionsDirective] });
IgxPickersCommonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickersCommonModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPickersCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxPickerToggleComponent,
                        IgxPickerClearComponent,
                        IgxPickerActionsDirective
                    ],
                    imports: [CommonModule],
                    exports: [
                        IgxPickerToggleComponent,
                        IgxPickerClearComponent,
                        IgxPickerActionsDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLWljb25zLmNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kYXRlLWNvbW1vbi9waWNrZXItaWNvbnMuY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWUsTUFBTSxlQUFlLENBQUM7O0FBRWhIOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFLSCxNQUFNLE9BQU8sd0JBQXdCO0lBSnJDO1FBTVcsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7S0FRdkM7SUFMVSxPQUFPLENBQUMsS0FBaUI7UUFDNUIsOEJBQThCO1FBQzlCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hCLENBQUM7O3FIQVRRLHdCQUF3Qjt5R0FBeEIsd0JBQXdCLCtJQUh2QiwyQkFBMkI7MkZBRzVCLHdCQUF3QjtrQkFKcEMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsbUJBQW1CO2lCQUNoQzs4QkFHVSxPQUFPO3NCQURiLE1BQU07Z0JBSUEsT0FBTztzQkFEYixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUFRckM7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUtILE1BQU0sT0FBTyx1QkFBd0IsU0FBUSx3QkFBd0I7O29IQUF4RCx1QkFBdUI7d0dBQXZCLHVCQUF1QiwrRUFIdEIsMkJBQTJCOzJGQUc1Qix1QkFBdUI7a0JBSm5DLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsUUFBUSxFQUFFLGtCQUFrQjtpQkFDL0I7O0FBR0Q7Ozs7O0dBS0c7QUFJSCxNQUFNLE9BQU8seUJBQXlCO0lBQ2xDLFlBQW1CLFFBQTBCO1FBQTFCLGFBQVEsR0FBUixRQUFRLENBQWtCO0lBQUksQ0FBQzs7c0hBRHpDLHlCQUF5QjswR0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBSHJDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLG9CQUFvQjtpQkFDakM7O0FBTUQsY0FBYztBQWNkLE1BQU0sT0FBTyxzQkFBc0I7O21IQUF0QixzQkFBc0I7b0hBQXRCLHNCQUFzQixpQkE1RHRCLHdCQUF3QixFQThCeEIsdUJBQXVCLEVBV3ZCLHlCQUF5QixhQVl4QixZQUFZLGFBckRiLHdCQUF3QixFQThCeEIsdUJBQXVCLEVBV3ZCLHlCQUF5QjtvSEFtQnpCLHNCQUFzQixZQVB0QixDQUFDLFlBQVksQ0FBQzsyRkFPZCxzQkFBc0I7a0JBYmxDLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLHdCQUF3Qjt3QkFDeEIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7cUJBQzVCO29CQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFO3dCQUNMLHdCQUF3Qjt3QkFDeEIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7cUJBQzVCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgTmdNb2R1bGUsIERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBUZW1wbGF0ZXMgdGhlIGRlZmF1bHQgdG9nZ2xlIGljb24gaW4gdGhlIHBpY2tlci5cbiAqXG4gKiBAcmVtYXJrcyBDYW4gYmUgYXBwbGllZCB0byBJZ3hEYXRlUGlja2VyQ29tcG9uZW50LCBJZ3hUaW1lUGlja2VyQ29tcG9uZW50LCBJZ3hEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnRcbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgaHRtbFxuICogPGlneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAqICAgPGlneC1waWNrZXItdG9nZ2xlIGlneFN1ZmZpeD5cbiAqICAgICAgPGlneC1pY29uPmNhbGVuZGFyX3ZpZXdfZGF5PC9pZ3gtaWNvbj5cbiAqICAgPC9pZ3gtcGlja2VyLXRvZ2dsZT5cbiAqIDwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gICAgc2VsZWN0b3I6ICdpZ3gtcGlja2VyLXRvZ2dsZSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGlja2VyVG9nZ2xlQ29tcG9uZW50IHtcbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICAvLyBkbyBub3QgZm9jdXMgaW5wdXQgb24gY2xpY2tcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuY2xpY2tlZC5lbWl0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRlbXBsYXRlcyB0aGUgZGVmYXVsdCBjbGVhciBpY29uIGluIHRoZSBwaWNrZXIuXG4gKlxuICogQHJlbWFya3MgQ2FuIGJlIGFwcGxpZWQgdG8gSWd4RGF0ZVBpY2tlckNvbXBvbmVudCwgSWd4VGltZVBpY2tlckNvbXBvbmVudCwgSWd4RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50XG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtZGF0ZS1waWNrZXI+XG4gKiAgIDxpZ3gtcGlja2VyLWNsZWFyIGlneFN1ZmZpeD5cbiAqICAgICAgPGlneC1pY29uPmRlbGV0ZTwvaWd4LWljb24+XG4gKiAgIDwvaWd4LXBpY2tlci1jbGVhcj5cbiAqIDwvaWd4LWRhdGUtcGlja2VyPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gICAgc2VsZWN0b3I6ICdpZ3gtcGlja2VyLWNsZWFyJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hQaWNrZXJDbGVhckNvbXBvbmVudCBleHRlbmRzIElneFBpY2tlclRvZ2dsZUNvbXBvbmVudCB7IH1cblxuLyoqXG4gKiBJZ3hQaWNrZXJBY3Rpb25zRGlyZWN0aXZlIGNhbiBiZSB1c2VkIHRvIHJlLXRlbXBsYXRlIHRoZSBkcm9wZG93bi9kaWFsb2cgYWN0aW9uIGJ1dHRvbnMuXG4gKlxuICogQHJlbWFya3MgQ2FuIGJlIGFwcGxpZWQgdG8gSWd4RGF0ZVBpY2tlckNvbXBvbmVudCwgSWd4VGltZVBpY2tlckNvbXBvbmVudCwgSWd4RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50XG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tpZ3hQaWNrZXJBY3Rpb25zXSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4UGlja2VyQWN0aW9uc0RpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7IH1cbn1cblxuXG4vKiogQGhpZGRlbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4UGlja2VyVG9nZ2xlQ29tcG9uZW50LFxuICAgICAgICBJZ3hQaWNrZXJDbGVhckNvbXBvbmVudCxcbiAgICAgICAgSWd4UGlja2VyQWN0aW9uc0RpcmVjdGl2ZVxuICAgIF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hQaWNrZXJUb2dnbGVDb21wb25lbnQsXG4gICAgICAgIElneFBpY2tlckNsZWFyQ29tcG9uZW50LFxuICAgICAgICBJZ3hQaWNrZXJBY3Rpb25zRGlyZWN0aXZlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hQaWNrZXJzQ29tbW9uTW9kdWxlIHsgfVxuIl19