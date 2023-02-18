import { CommonModule } from '@angular/common';
import { NgModule, Component, ViewChild, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { IgxCalendarComponent, IgxCalendarModule } from '../../calendar/public_api';
import { PickerInteractionMode } from '../../date-common/types';
import { IgxButtonModule } from '../../directives/button/button.directive';
import { IgxRippleModule } from '../../directives/ripple/ripple.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../calendar/calendar.component";
import * as i2 from "@angular/common";
import * as i3 from "../../directives/button/button.directive";
import * as i4 from "../../directives/ripple/ripple.directive";
/** @hidden */
export class IgxCalendarContainerComponent {
    constructor() {
        this.calendarClose = new EventEmitter();
        this.todaySelection = new EventEmitter();
        this.styleClass = 'igx-date-picker';
        this.vertical = false;
        this.mode = PickerInteractionMode.DropDown;
    }
    get dropdownCSS() {
        return this.mode === PickerInteractionMode.DropDown;
    }
    get verticalCSS() {
        return this.vertical && this.mode === PickerInteractionMode.Dialog;
    }
    onEscape(event) {
        event.preventDefault();
        this.calendarClose.emit();
    }
    get isReadonly() {
        return this.mode === PickerInteractionMode.Dialog;
    }
}
IgxCalendarContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarContainerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxCalendarContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCalendarContainerComponent, selector: "igx-calendar-container", outputs: { calendarClose: "calendarClose", todaySelection: "todaySelection" }, host: { listeners: { "keydown.alt.arrowup": "onEscape($event)" }, properties: { "class.igx-date-picker": "this.styleClass", "class.igx-date-picker--dropdown": "this.dropdownCSS", "class.igx-date-picker--vertical": "this.verticalCSS" } }, viewQueries: [{ propertyName: "calendar", first: true, predicate: IgxCalendarComponent, descendants: true, static: true }], ngImport: i0, template: "<ng-template #defaultPickerActions>\n    <div *ngIf=\"this.closeButtonLabel || this.todayButtonLabel\" class=\"igx-date-picker__buttons\">\n        <button #closeButton *ngIf=\"this.closeButtonLabel\" igxButton=\"flat\" igxRipple\n            (click)=\"this.calendarClose.emit({ owner: this })\">\n            {{ this.closeButtonLabel }}\n        </button>\n        <button #todayButton *ngIf=\"this.todayButtonLabel\" igxButton=\"flat\" igxRipple\n            (click)=\"this.todaySelection.emit({ owner: this })\">\n            {{ this.todayButtonLabel }}\n        </button>\n    </div>\n</ng-template>\n\n<igx-calendar></igx-calendar>\n<ng-container *ngTemplateOutlet=\"this.pickerActions?.template || defaultPickerActions; context: { $implicit: this.calendar }\">\n</ng-container>\n", styles: [":host{display:block}\n"], components: [{ type: i1.IgxCalendarComponent, selector: "igx-calendar", inputs: ["id", "hasHeader", "vertical", "monthsViewNumber", "showWeekNumbers", "animationAction"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i4.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-calendar-container', styles: [':host {display: block;}'], template: "<ng-template #defaultPickerActions>\n    <div *ngIf=\"this.closeButtonLabel || this.todayButtonLabel\" class=\"igx-date-picker__buttons\">\n        <button #closeButton *ngIf=\"this.closeButtonLabel\" igxButton=\"flat\" igxRipple\n            (click)=\"this.calendarClose.emit({ owner: this })\">\n            {{ this.closeButtonLabel }}\n        </button>\n        <button #todayButton *ngIf=\"this.todayButtonLabel\" igxButton=\"flat\" igxRipple\n            (click)=\"this.todaySelection.emit({ owner: this })\">\n            {{ this.todayButtonLabel }}\n        </button>\n    </div>\n</ng-template>\n\n<igx-calendar></igx-calendar>\n<ng-container *ngTemplateOutlet=\"this.pickerActions?.template || defaultPickerActions; context: { $implicit: this.calendar }\">\n</ng-container>\n" }]
        }], propDecorators: { calendar: [{
                type: ViewChild,
                args: [IgxCalendarComponent, { static: true }]
            }], calendarClose: [{
                type: Output
            }], todaySelection: [{
                type: Output
            }], styleClass: [{
                type: HostBinding,
                args: ['class.igx-date-picker']
            }], dropdownCSS: [{
                type: HostBinding,
                args: ['class.igx-date-picker--dropdown']
            }], verticalCSS: [{
                type: HostBinding,
                args: ['class.igx-date-picker--vertical']
            }], onEscape: [{
                type: HostListener,
                args: ['keydown.alt.arrowup', ['$event']]
            }] } });
/** @hidden */
export class IgxCalendarContainerModule {
}
IgxCalendarContainerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarContainerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxCalendarContainerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarContainerModule, declarations: [IgxCalendarContainerComponent], imports: [CommonModule,
        IgxButtonModule,
        IgxRippleModule,
        IgxCalendarModule], exports: [IgxCalendarContainerComponent] });
IgxCalendarContainerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarContainerModule, imports: [[
            CommonModule,
            IgxButtonModule,
            IgxRippleModule,
            IgxCalendarModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCalendarContainerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxCalendarContainerComponent],
                    imports: [
                        CommonModule,
                        IgxButtonModule,
                        IgxRippleModule,
                        IgxCalendarModule
                    ],
                    exports: [IgxCalendarContainerComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kYXRlLWNvbW1vbi9jYWxlbmRhci1jb250YWluZXIvY2FsZW5kYXItY29udGFpbmVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kYXRlLWNvbW1vbi9jYWxlbmRhci1jb250YWluZXIvY2FsZW5kYXItY29udGFpbmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hILE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXBGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMENBQTBDLENBQUM7Ozs7OztBQUczRSxjQUFjO0FBTWQsTUFBTSxPQUFPLDZCQUE2QjtJQUwxQztRQVVXLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQWtCLENBQUM7UUFHbkQsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBa0IsQ0FBQztRQUdwRCxlQUFVLEdBQUcsaUJBQWlCLENBQUM7UUFZL0IsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUdqQixTQUFJLEdBQUcscUJBQXFCLENBQUMsUUFBUSxDQUFDO0tBWWhEO0lBekJHLElBQ1csV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsUUFBUSxDQUFDO0lBQ3hELENBQUM7SUFFRCxJQUNXLFdBQVc7UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsTUFBTSxDQUFDO0lBQ3ZFLENBQUM7SUFTTSxRQUFRLENBQUMsS0FBSztRQUNqQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBVyxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7SUFDdEQsQ0FBQzs7MEhBckNRLDZCQUE2Qjs4R0FBN0IsNkJBQTZCLHFhQUMzQixvQkFBb0IsOERDaEJuQyxteEJBZ0JBOzJGRERhLDZCQUE2QjtrQkFMekMsU0FBUzsrQkFDSSx3QkFBd0IsVUFDMUIsQ0FBQyx5QkFBeUIsQ0FBQzs4QkFLNUIsUUFBUTtzQkFEZCxTQUFTO3VCQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFJMUMsYUFBYTtzQkFEbkIsTUFBTTtnQkFJQSxjQUFjO3NCQURwQixNQUFNO2dCQUlBLFVBQVU7c0JBRGhCLFdBQVc7dUJBQUMsdUJBQXVCO2dCQUl6QixXQUFXO3NCQURyQixXQUFXO3VCQUFDLGlDQUFpQztnQkFNbkMsV0FBVztzQkFEckIsV0FBVzt1QkFBQyxpQ0FBaUM7Z0JBWXZDLFFBQVE7c0JBRGQsWUFBWTt1QkFBQyxxQkFBcUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7QUFXbkQsY0FBYztBQVdkLE1BQU0sT0FBTywwQkFBMEI7O3VIQUExQiwwQkFBMEI7d0hBQTFCLDBCQUEwQixpQkFuRDFCLDZCQUE2QixhQTRDbEMsWUFBWTtRQUNaLGVBQWU7UUFDZixlQUFlO1FBQ2YsaUJBQWlCLGFBL0NaLDZCQUE2Qjt3SEFtRDdCLDBCQUEwQixZQVIxQjtZQUNMLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtZQUNmLGlCQUFpQjtTQUNwQjsyRkFHUSwwQkFBMEI7a0JBVnRDLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsNkJBQTZCLENBQUM7b0JBQzdDLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZUFBZTt3QkFDZixpQkFBaUI7cUJBQ3BCO29CQUNELE9BQU8sRUFBRSxDQUFDLDZCQUE2QixDQUFDO2lCQUMzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBWaWV3Q2hpbGQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hDYWxlbmRhckNvbXBvbmVudCwgSWd4Q2FsZW5kYXJNb2R1bGUgfSBmcm9tICcuLi8uLi9jYWxlbmRhci9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBQaWNrZXJJbnRlcmFjdGlvbk1vZGUgfSBmcm9tICcuLi8uLi9kYXRlLWNvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFJpcHBsZU1vZHVsZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlL3JpcHBsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4UGlja2VyQWN0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4uL3BpY2tlci1pY29ucy5jb21tb24nO1xuXG4vKiogQGhpZGRlbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtY2FsZW5kYXItY29udGFpbmVyJyxcbiAgICBzdHlsZXM6IFsnOmhvc3Qge2Rpc3BsYXk6IGJsb2NrO30nXSxcbiAgICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FsZW5kYXJDb250YWluZXJDb21wb25lbnQge1xuICAgIEBWaWV3Q2hpbGQoSWd4Q2FsZW5kYXJDb21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIGNhbGVuZGFyOiBJZ3hDYWxlbmRhckNvbXBvbmVudDtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjYWxlbmRhckNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB0b2RheVNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8SUJhc2VFdmVudEFyZ3M+KCk7XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1kYXRlLXBpY2tlcicpXG4gICAgcHVibGljIHN0eWxlQ2xhc3MgPSAnaWd4LWRhdGUtcGlja2VyJztcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWRhdGUtcGlja2VyLS1kcm9wZG93bicpXG4gICAgcHVibGljIGdldCBkcm9wZG93bkNTUygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gUGlja2VySW50ZXJhY3Rpb25Nb2RlLkRyb3BEb3duO1xuICAgIH1cblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWRhdGUtcGlja2VyLS12ZXJ0aWNhbCcpXG4gICAgcHVibGljIGdldCB2ZXJ0aWNhbENTUygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljYWwgJiYgdGhpcy5tb2RlID09PSBQaWNrZXJJbnRlcmFjdGlvbk1vZGUuRGlhbG9nO1xuICAgIH1cblxuICAgIHB1YmxpYyB2ZXJ0aWNhbCA9IGZhbHNlO1xuICAgIHB1YmxpYyBjbG9zZUJ1dHRvbkxhYmVsOiBzdHJpbmc7XG4gICAgcHVibGljIHRvZGF5QnV0dG9uTGFiZWw6IHN0cmluZztcbiAgICBwdWJsaWMgbW9kZSA9IFBpY2tlckludGVyYWN0aW9uTW9kZS5Ecm9wRG93bjtcbiAgICBwdWJsaWMgcGlja2VyQWN0aW9uczogSWd4UGlja2VyQWN0aW9uc0RpcmVjdGl2ZTtcblxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uYWx0LmFycm93dXAnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbkVzY2FwZShldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNhbGVuZGFyQ2xvc2UuZW1pdCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaXNSZWFkb25seSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gUGlja2VySW50ZXJhY3Rpb25Nb2RlLkRpYWxvZztcbiAgICB9XG59XG5cbi8qKiBAaGlkZGVuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0lneENhbGVuZGFyQ29udGFpbmVyQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgSWd4QnV0dG9uTW9kdWxlLFxuICAgICAgICBJZ3hSaXBwbGVNb2R1bGUsXG4gICAgICAgIElneENhbGVuZGFyTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbSWd4Q2FsZW5kYXJDb250YWluZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIElneENhbGVuZGFyQ29udGFpbmVyTW9kdWxlIHsgfVxuIiwiPG5nLXRlbXBsYXRlICNkZWZhdWx0UGlja2VyQWN0aW9ucz5cbiAgICA8ZGl2ICpuZ0lmPVwidGhpcy5jbG9zZUJ1dHRvbkxhYmVsIHx8IHRoaXMudG9kYXlCdXR0b25MYWJlbFwiIGNsYXNzPVwiaWd4LWRhdGUtcGlja2VyX19idXR0b25zXCI+XG4gICAgICAgIDxidXR0b24gI2Nsb3NlQnV0dG9uICpuZ0lmPVwidGhpcy5jbG9zZUJ1dHRvbkxhYmVsXCIgaWd4QnV0dG9uPVwiZmxhdFwiIGlneFJpcHBsZVxuICAgICAgICAgICAgKGNsaWNrKT1cInRoaXMuY2FsZW5kYXJDbG9zZS5lbWl0KHsgb3duZXI6IHRoaXMgfSlcIj5cbiAgICAgICAgICAgIHt7IHRoaXMuY2xvc2VCdXR0b25MYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiAjdG9kYXlCdXR0b24gKm5nSWY9XCJ0aGlzLnRvZGF5QnV0dG9uTGFiZWxcIiBpZ3hCdXR0b249XCJmbGF0XCIgaWd4UmlwcGxlXG4gICAgICAgICAgICAoY2xpY2spPVwidGhpcy50b2RheVNlbGVjdGlvbi5lbWl0KHsgb3duZXI6IHRoaXMgfSlcIj5cbiAgICAgICAgICAgIHt7IHRoaXMudG9kYXlCdXR0b25MYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxpZ3gtY2FsZW5kYXI+PC9pZ3gtY2FsZW5kYXI+XG48bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGhpcy5waWNrZXJBY3Rpb25zPy50ZW1wbGF0ZSB8fCBkZWZhdWx0UGlja2VyQWN0aW9uczsgY29udGV4dDogeyAkaW1wbGljaXQ6IHRoaXMuY2FsZW5kYXIgfVwiPlxuPC9uZy1jb250YWluZXI+XG4iXX0=