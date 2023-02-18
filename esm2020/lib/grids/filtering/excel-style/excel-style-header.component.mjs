import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./base-filtering.component";
import * as i2 from "../../../icon/icon.component";
import * as i3 from "@angular/common";
import * as i4 from "../../../directives/button/button.directive";
/**
 * A component used for presenting Excel style header UI.
 */
export class IgxExcelStyleHeaderComponent {
    constructor(esf) {
        this.esf = esf;
    }
}
IgxExcelStyleHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExcelStyleHeaderComponent, deps: [{ token: i1.BaseFilteringComponent }], target: i0.ɵɵFactoryTarget.Component });
IgxExcelStyleHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxExcelStyleHeaderComponent, selector: "igx-excel-style-header", inputs: { showPinning: "showPinning", showSelecting: "showSelecting", showHiding: "showHiding" }, ngImport: i0, template: "<header *ngIf=\"esf.column\"\n        class=\"igx-excel-filter__menu-header\">\n    <h4>{{ esf.column.header || esf.column.field }}</h4>\n    <div class=\"igx-excel-filter__menu-header-actions\">\n        <button *ngIf=\"showSelecting\"\n            igxButton=\"icon\"\n            (click)=\"esf.onSelect()\"\n            [ngClass]=\"esf.column.selected ? 'igx-excel-filter__actions-selected' : 'igx-excel-filter__actions-select'\"\n            [attr.aria-label]=\"esf.column.selected ? esf.grid.resourceStrings.igx_grid_excel_deselect : esf.grid.resourceStrings.igx_grid_excel_select\"\n        >\n            <igx-icon>done</igx-icon>\n        </button>\n        <button *ngIf=\"showPinning\"\n            igxButton=\"icon\"\n            (click)=\"esf.onPin()\"\n            [attr.aria-label]=\"esf.column.pinned ? esf.grid.resourceStrings.igx_grid_excel_unpin : esf.grid.resourceStrings.igx_grid_excel_pin\"\n        >\n            <igx-icon family=\"imx-icons\" [name]=\"esf.column.pinned ? 'unpin-left' : 'pin-left'\"></igx-icon>\n        </button>\n        <button *ngIf=\"showHiding\"\n            igxButton=\"icon\"\n            (click)=\"esf.onHideToggle()\"\n            [attr.aria-label]=\"esf.column.hidden ? esf.grid.resourceStrings.igx_grid_excel_show : esf.grid.resourceStrings.igx_grid_excel_hide\"\n        >\n            <igx-icon>{{ esf.column.hidden ? 'visibility' : 'visibility_off' }}</igx-icon>\n        </button>\n    </div>\n</header>\n", components: [{ type: i2.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExcelStyleHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-excel-style-header', template: "<header *ngIf=\"esf.column\"\n        class=\"igx-excel-filter__menu-header\">\n    <h4>{{ esf.column.header || esf.column.field }}</h4>\n    <div class=\"igx-excel-filter__menu-header-actions\">\n        <button *ngIf=\"showSelecting\"\n            igxButton=\"icon\"\n            (click)=\"esf.onSelect()\"\n            [ngClass]=\"esf.column.selected ? 'igx-excel-filter__actions-selected' : 'igx-excel-filter__actions-select'\"\n            [attr.aria-label]=\"esf.column.selected ? esf.grid.resourceStrings.igx_grid_excel_deselect : esf.grid.resourceStrings.igx_grid_excel_select\"\n        >\n            <igx-icon>done</igx-icon>\n        </button>\n        <button *ngIf=\"showPinning\"\n            igxButton=\"icon\"\n            (click)=\"esf.onPin()\"\n            [attr.aria-label]=\"esf.column.pinned ? esf.grid.resourceStrings.igx_grid_excel_unpin : esf.grid.resourceStrings.igx_grid_excel_pin\"\n        >\n            <igx-icon family=\"imx-icons\" [name]=\"esf.column.pinned ? 'unpin-left' : 'pin-left'\"></igx-icon>\n        </button>\n        <button *ngIf=\"showHiding\"\n            igxButton=\"icon\"\n            (click)=\"esf.onHideToggle()\"\n            [attr.aria-label]=\"esf.column.hidden ? esf.grid.resourceStrings.igx_grid_excel_show : esf.grid.resourceStrings.igx_grid_excel_hide\"\n        >\n            <igx-icon>{{ esf.column.hidden ? 'visibility' : 'visibility_off' }}</igx-icon>\n        </button>\n    </div>\n</header>\n" }]
        }], ctorParameters: function () { return [{ type: i1.BaseFilteringComponent }]; }, propDecorators: { showPinning: [{
                type: Input
            }], showSelecting: [{
                type: Input
            }], showHiding: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZWwtc3R5bGUtaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9maWx0ZXJpbmcvZXhjZWwtc3R5bGUvZXhjZWwtc3R5bGUtaGVhZGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9maWx0ZXJpbmcvZXhjZWwtc3R5bGUvZXhjZWwtc3R5bGUtaGVhZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7QUFHakQ7O0dBRUc7QUFLSCxNQUFNLE9BQU8sNEJBQTRCO0lBcUNyQyxZQUFtQixHQUEyQjtRQUEzQixRQUFHLEdBQUgsR0FBRyxDQUF3QjtJQUFJLENBQUM7O3lIQXJDMUMsNEJBQTRCOzZHQUE1Qiw0QkFBNEIsZ0tDVnpDLHU3Q0E0QkE7MkZEbEJhLDRCQUE0QjtrQkFKeEMsU0FBUzsrQkFDSSx3QkFBd0I7NkdBYzNCLFdBQVc7c0JBRGpCLEtBQUs7Z0JBYUMsYUFBYTtzQkFEbkIsS0FBSztnQkFhQyxVQUFVO3NCQURoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzZUZpbHRlcmluZ0NvbXBvbmVudCB9IGZyb20gJy4vYmFzZS1maWx0ZXJpbmcuY29tcG9uZW50JztcblxuLyoqXG4gKiBBIGNvbXBvbmVudCB1c2VkIGZvciBwcmVzZW50aW5nIEV4Y2VsIHN0eWxlIGhlYWRlciBVSS5cbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtZXhjZWwtc3R5bGUtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZXhjZWwtc3R5bGUtaGVhZGVyLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hFeGNlbFN0eWxlSGVhZGVyQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBwaW5uaW5nIGljb24gc2hvdWxkIGJlIHNob3duIGluIHRoZSBoZWFkZXIuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1leGNlbC1zdHlsZS1oZWFkZXIgW3Nob3dQaW5uaW5nXT1cInRydWVcIj48L2lneC1leGNlbC1zdHlsZS1oZWFkZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd1Bpbm5pbmc6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBzZWxlY3RpbmcgaWNvbiBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGhlYWRlci5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWV4Y2VsLXN0eWxlLWhlYWRlciBbc2hvd1NlbGVjdGluZ109XCJ0cnVlXCI+PC9pZ3gtZXhjZWwtc3R5bGUtaGVhZGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNob3dTZWxlY3Rpbmc6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNvbHVtbiBoaWRpbmcgaWNvbiBzaG91bGQgYmUgc2hvd24gaW4gdGhlIGhlYWRlci5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWV4Y2VsLXN0eWxlLWhlYWRlciBbc2hvd0hpZGluZ109XCJ0cnVlXCI+PC9pZ3gtZXhjZWwtc3R5bGUtaGVhZGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNob3dIaWRpbmc6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZXNmOiBCYXNlRmlsdGVyaW5nQ29tcG9uZW50KSB7IH1cbn1cbiIsIjxoZWFkZXIgKm5nSWY9XCJlc2YuY29sdW1uXCJcbiAgICAgICAgY2xhc3M9XCJpZ3gtZXhjZWwtZmlsdGVyX19tZW51LWhlYWRlclwiPlxuICAgIDxoND57eyBlc2YuY29sdW1uLmhlYWRlciB8fCBlc2YuY29sdW1uLmZpZWxkIH19PC9oND5cbiAgICA8ZGl2IGNsYXNzPVwiaWd4LWV4Y2VsLWZpbHRlcl9fbWVudS1oZWFkZXItYWN0aW9uc1wiPlxuICAgICAgICA8YnV0dG9uICpuZ0lmPVwic2hvd1NlbGVjdGluZ1wiXG4gICAgICAgICAgICBpZ3hCdXR0b249XCJpY29uXCJcbiAgICAgICAgICAgIChjbGljayk9XCJlc2Yub25TZWxlY3QoKVwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJlc2YuY29sdW1uLnNlbGVjdGVkID8gJ2lneC1leGNlbC1maWx0ZXJfX2FjdGlvbnMtc2VsZWN0ZWQnIDogJ2lneC1leGNlbC1maWx0ZXJfX2FjdGlvbnMtc2VsZWN0J1wiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImVzZi5jb2x1bW4uc2VsZWN0ZWQgPyBlc2YuZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZXhjZWxfZGVzZWxlY3QgOiBlc2YuZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZXhjZWxfc2VsZWN0XCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPGlneC1pY29uPmRvbmU8L2lneC1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNob3dQaW5uaW5nXCJcbiAgICAgICAgICAgIGlneEJ1dHRvbj1cImljb25cIlxuICAgICAgICAgICAgKGNsaWNrKT1cImVzZi5vblBpbigpXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZXNmLmNvbHVtbi5waW5uZWQgPyBlc2YuZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZXhjZWxfdW5waW4gOiBlc2YuZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZXhjZWxfcGluXCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPGlneC1pY29uIGZhbWlseT1cImlteC1pY29uc1wiIFtuYW1lXT1cImVzZi5jb2x1bW4ucGlubmVkID8gJ3VucGluLWxlZnQnIDogJ3Bpbi1sZWZ0J1wiPjwvaWd4LWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uICpuZ0lmPVwic2hvd0hpZGluZ1wiXG4gICAgICAgICAgICBpZ3hCdXR0b249XCJpY29uXCJcbiAgICAgICAgICAgIChjbGljayk9XCJlc2Yub25IaWRlVG9nZ2xlKClcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJlc2YuY29sdW1uLmhpZGRlbiA/IGVzZi5ncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9leGNlbF9zaG93IDogZXNmLmdyaWQucmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX2V4Y2VsX2hpZGVcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8aWd4LWljb24+e3sgZXNmLmNvbHVtbi5oaWRkZW4gPyAndmlzaWJpbGl0eScgOiAndmlzaWJpbGl0eV9vZmYnIH19PC9pZ3gtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2hlYWRlcj5cbiJdfQ==