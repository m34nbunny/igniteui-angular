import { Component, Input, } from '@angular/core';
import { IgxGroupByAreaDirective } from './group-by-area.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../core/utils";
import * as i2 from "../../chips/chips-area.component";
import * as i3 from "../../chips/chip.component";
import * as i4 from "../../icon/icon.component";
import * as i5 from "@angular/common";
import * as i6 from "../../directives/suffix/suffix.directive";
import * as i7 from "../grid/grid.directives";
import * as i8 from "../../directives/drag-drop/drag-drop.directive";
import * as i9 from "./group-by-area.directive";
/**
 * An internal component representing the group-by drop area for the igx-grid component.
 *
 * @hidden @internal
 */
export class IgxGridGroupByAreaComponent extends IgxGroupByAreaDirective {
    constructor(ref, platform) {
        super(ref, platform);
        this.sortingExpressions = [];
    }
    handleReorder(event) {
        const { chipsArray, originalEvent } = event;
        const newExpressions = this.getReorderedExpressions(chipsArray);
        this.grid.groupingExpansionState = [];
        this.expressions = newExpressions;
        // When reordered using keyboard navigation, we don't have `onMoveEnd` event.
        if (originalEvent instanceof KeyboardEvent) {
            this.grid.groupingExpressions = newExpressions;
        }
    }
    handleMoveEnd() {
        this.grid.groupingExpressions = this.expressions;
    }
    groupBy(expression) {
        this.grid.groupBy(expression);
    }
    clearGrouping(name) {
        this.grid.clearGrouping(name);
    }
}
IgxGridGroupByAreaComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridGroupByAreaComponent, deps: [{ token: i0.ElementRef }, { token: i1.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxGridGroupByAreaComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridGroupByAreaComponent, selector: "igx-grid-group-by-area", inputs: { sortingExpressions: "sortingExpressions", grid: "grid" }, providers: [{ provide: IgxGroupByAreaDirective, useExisting: IgxGridGroupByAreaComponent }], usesInheritance: true, ngImport: i0, template: "<igx-chips-area (reorder)=\"handleReorder($event)\" (moveEnd)=\"handleMoveEnd()\">\n    <ng-container *ngFor=\"let expression of chipExpressions; let last = last;\">\n        <igx-chip\n            [id]=\"expression.fieldName\"\n            [title]=\"(expression.fieldName | igxGroupByMeta:grid).title\"\n            [displayDensity]=\"grid.displayDensity\"\n            [removable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [draggable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [disabled]=\"!(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            (keyDown)=\"handleKeyDown($event.owner.id, $event.originalEvent)\"\n            (remove)=\"clearGrouping($event.owner.id)\"\n            (chipClick)=\"handleClick(expression.fieldName)\"\n        >\n            <span>{{ (expression.fieldName | igxGroupByMeta:grid).title }}</span>\n            <igx-icon igxSuffix>{{ expression.dir === 1 ? 'arrow_upward' : 'arrow_downward' }}</igx-icon>\n        </igx-chip>\n\n        <span class=\"igx-grid-grouparea__connector\">\n            <igx-icon [hidden]=\"(last && !dropAreaVisible)\">arrow_forward</igx-icon>\n        </span>\n    </ng-container>\n    <div igxGroupAreaDrop class=\"igx-drop-area{{ density !== 'comfortable' ? '--' + density : ''}}\"\n        [attr.gridId]=\"grid.id\"\n        [hidden]=\"!dropAreaVisible\"\n        (igxDrop)=\"onDragDrop($event)\"\n    >\n        <ng-container *ngTemplateOutlet=\"dropAreaTemplate || default\"></ng-container>\n    </div>\n</igx-chips-area>\n\n<ng-template #default>\n    <igx-icon class=\"igx-drop-area__icon\">group_work</igx-icon>\n    <span class=\"igx-drop-area__text\">{{ dropAreaMessage }}</span>\n</ng-template>\n", components: [{ type: i2.IgxChipsAreaComponent, selector: "igx-chips-area", inputs: ["class", "width", "height"], outputs: ["reorder", "selectionChange", "moveStart", "moveEnd"] }, { type: i3.IgxChipComponent, selector: "igx-chip", inputs: ["id", "tabIndex", "data", "draggable", "animateOnRelease", "hideBaseOnDrag", "removable", "removeIcon", "selectable", "selectIcon", "class", "disabled", "selected", "color", "resourceStrings"], outputs: ["selectedChange", "moveStart", "moveEnd", "remove", "chipClick", "selectedChanging", "selectedChanged", "keyDown", "dragEnter", "dragLeave", "dragOver", "dragDrop"] }, { type: i4.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i6.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i7.IgxGroupAreaDropDirective, selector: "[igxGroupAreaDrop]" }, { type: i8.IgxDropDirective, selector: "[igxDrop]", inputs: ["igxDrop", "dropChannel", "dropStrategy"], outputs: ["enter", "over", "leave", "dropped"], exportAs: ["drop"] }, { type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "igxGroupByMeta": i9.IgxGroupByMetaPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridGroupByAreaComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-grid-group-by-area', providers: [{ provide: IgxGroupByAreaDirective, useExisting: IgxGridGroupByAreaComponent }], template: "<igx-chips-area (reorder)=\"handleReorder($event)\" (moveEnd)=\"handleMoveEnd()\">\n    <ng-container *ngFor=\"let expression of chipExpressions; let last = last;\">\n        <igx-chip\n            [id]=\"expression.fieldName\"\n            [title]=\"(expression.fieldName | igxGroupByMeta:grid).title\"\n            [displayDensity]=\"grid.displayDensity\"\n            [removable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [draggable]=\"(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            [disabled]=\"!(expression.fieldName | igxGroupByMeta:grid).groupable\"\n            (keyDown)=\"handleKeyDown($event.owner.id, $event.originalEvent)\"\n            (remove)=\"clearGrouping($event.owner.id)\"\n            (chipClick)=\"handleClick(expression.fieldName)\"\n        >\n            <span>{{ (expression.fieldName | igxGroupByMeta:grid).title }}</span>\n            <igx-icon igxSuffix>{{ expression.dir === 1 ? 'arrow_upward' : 'arrow_downward' }}</igx-icon>\n        </igx-chip>\n\n        <span class=\"igx-grid-grouparea__connector\">\n            <igx-icon [hidden]=\"(last && !dropAreaVisible)\">arrow_forward</igx-icon>\n        </span>\n    </ng-container>\n    <div igxGroupAreaDrop class=\"igx-drop-area{{ density !== 'comfortable' ? '--' + density : ''}}\"\n        [attr.gridId]=\"grid.id\"\n        [hidden]=\"!dropAreaVisible\"\n        (igxDrop)=\"onDragDrop($event)\"\n    >\n        <ng-container *ngTemplateOutlet=\"dropAreaTemplate || default\"></ng-container>\n    </div>\n</igx-chips-area>\n\n<ng-template #default>\n    <igx-icon class=\"igx-drop-area__icon\">group_work</igx-icon>\n    <span class=\"igx-drop-area__text\">{{ dropAreaMessage }}</span>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.PlatformUtil }]; }, propDecorators: { sortingExpressions: [{
                type: Input
            }], grid: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1ncm91cC1ieS1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9ncm91cGluZy9ncmlkLWdyb3VwLWJ5LWFyZWEuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2dyb3VwaW5nL2dyb3VwLWJ5LWFyZWEuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFFVCxLQUFLLEdBQ1IsTUFBTSxlQUFlLENBQUM7QUFNdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7Ozs7Ozs7Ozs7O0FBRXBFOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsdUJBQXVCO0lBUXBFLFlBQVksR0FBNEIsRUFBRSxRQUFzQjtRQUM1RCxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBUGxCLHVCQUFrQixHQUF5QixFQUFFLENBQUM7SUFRcEQsQ0FBQztJQUVLLGFBQWEsQ0FBQyxLQUFpQztRQUNsRCxNQUFNLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQztRQUM1QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFFbEMsNkVBQTZFO1FBQzdFLElBQUksYUFBYSxZQUFZLGFBQWEsRUFBRTtZQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGNBQWMsQ0FBQztTQUNsRDtJQUNMLENBQUM7SUFFTSxhQUFhO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUNyRCxDQUFDO0lBRU0sT0FBTyxDQUFDLFVBQStCO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxhQUFhLENBQUMsSUFBWTtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzt3SEFuQ1EsMkJBQTJCOzRHQUEzQiwyQkFBMkIscUhBRnpCLENBQUMsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLDJCQUEyQixFQUFFLENBQUMsaURDcEIvRixndERBa0NBOzJGRFphLDJCQUEyQjtrQkFMdkMsU0FBUzsrQkFDSSx3QkFBd0IsYUFFdkIsQ0FBQyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxXQUFXLDZCQUE2QixFQUFFLENBQUM7NEhBSXBGLGtCQUFrQjtzQkFEeEIsS0FBSztnQkFLQyxJQUFJO3NCQURWLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIElucHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElDaGlwc0FyZWFSZW9yZGVyRXZlbnRBcmdzIH0gZnJvbSAnLi4vLi4vY2hpcHMvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElHcm91cGluZ0V4cHJlc3Npb24gfSBmcm9tICcuLi8uLi9kYXRhLW9wZXJhdGlvbnMvZ3JvdXBpbmctZXhwcmVzc2lvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSVNvcnRpbmdFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vZGF0YS1vcGVyYXRpb25zL3NvcnRpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRmxhdEdyaWRUeXBlIH0gZnJvbSAnLi4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElneEdyb3VwQnlBcmVhRGlyZWN0aXZlIH0gZnJvbSAnLi9ncm91cC1ieS1hcmVhLmRpcmVjdGl2ZSc7XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHJlcHJlc2VudGluZyB0aGUgZ3JvdXAtYnkgZHJvcCBhcmVhIGZvciB0aGUgaWd4LWdyaWQgY29tcG9uZW50LlxuICpcbiAqIEBoaWRkZW4gQGludGVybmFsXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWdyaWQtZ3JvdXAtYnktYXJlYScsXG4gICAgdGVtcGxhdGVVcmw6ICdncm91cC1ieS1hcmVhLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IElneEdyb3VwQnlBcmVhRGlyZWN0aXZlLCB1c2VFeGlzdGluZzogSWd4R3JpZEdyb3VwQnlBcmVhQ29tcG9uZW50IH1dXG59KVxuZXhwb3J0IGNsYXNzIElneEdyaWRHcm91cEJ5QXJlYUNvbXBvbmVudCBleHRlbmRzIElneEdyb3VwQnlBcmVhRGlyZWN0aXZlIHtcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzb3J0aW5nRXhwcmVzc2lvbnM6IElTb3J0aW5nRXhwcmVzc2lvbltdID0gW107XG5cbiAgICAvKiogVGhlIHBhcmVudCBncmlkIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudC4gKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBncmlkOiBGbGF0R3JpZFR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwbGF0Zm9ybTogUGxhdGZvcm1VdGlsKSB7XG4gICAgICAgIHN1cGVyKHJlZiwgcGxhdGZvcm0pO1xuICAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlUmVvcmRlcihldmVudDogSUNoaXBzQXJlYVJlb3JkZXJFdmVudEFyZ3MpIHtcbiAgICAgICAgY29uc3QgeyBjaGlwc0FycmF5LCBvcmlnaW5hbEV2ZW50IH0gPSBldmVudDtcbiAgICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbnMgPSB0aGlzLmdldFJlb3JkZXJlZEV4cHJlc3Npb25zKGNoaXBzQXJyYXkpO1xuXG4gICAgICAgIHRoaXMuZ3JpZC5ncm91cGluZ0V4cGFuc2lvblN0YXRlID0gW107XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbnMgPSBuZXdFeHByZXNzaW9ucztcblxuICAgICAgICAvLyBXaGVuIHJlb3JkZXJlZCB1c2luZyBrZXlib2FyZCBuYXZpZ2F0aW9uLCB3ZSBkb24ndCBoYXZlIGBvbk1vdmVFbmRgIGV2ZW50LlxuICAgICAgICBpZiAob3JpZ2luYWxFdmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5ncm91cGluZ0V4cHJlc3Npb25zID0gbmV3RXhwcmVzc2lvbnM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlTW92ZUVuZCgpIHtcbiAgICAgICAgdGhpcy5ncmlkLmdyb3VwaW5nRXhwcmVzc2lvbnMgPSB0aGlzLmV4cHJlc3Npb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBncm91cEJ5KGV4cHJlc3Npb246IElHcm91cGluZ0V4cHJlc3Npb24pIHtcbiAgICAgICAgdGhpcy5ncmlkLmdyb3VwQnkoZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyR3JvdXBpbmcobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZ3JpZC5jbGVhckdyb3VwaW5nKG5hbWUpO1xuICAgIH1cbn1cblxuIiwiPGlneC1jaGlwcy1hcmVhIChyZW9yZGVyKT1cImhhbmRsZVJlb3JkZXIoJGV2ZW50KVwiIChtb3ZlRW5kKT1cImhhbmRsZU1vdmVFbmQoKVwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGV4cHJlc3Npb24gb2YgY2hpcEV4cHJlc3Npb25zOyBsZXQgbGFzdCA9IGxhc3Q7XCI+XG4gICAgICAgIDxpZ3gtY2hpcFxuICAgICAgICAgICAgW2lkXT1cImV4cHJlc3Npb24uZmllbGROYW1lXCJcbiAgICAgICAgICAgIFt0aXRsZV09XCIoZXhwcmVzc2lvbi5maWVsZE5hbWUgfCBpZ3hHcm91cEJ5TWV0YTpncmlkKS50aXRsZVwiXG4gICAgICAgICAgICBbZGlzcGxheURlbnNpdHldPVwiZ3JpZC5kaXNwbGF5RGVuc2l0eVwiXG4gICAgICAgICAgICBbcmVtb3ZhYmxlXT1cIihleHByZXNzaW9uLmZpZWxkTmFtZSB8IGlneEdyb3VwQnlNZXRhOmdyaWQpLmdyb3VwYWJsZVwiXG4gICAgICAgICAgICBbZHJhZ2dhYmxlXT1cIihleHByZXNzaW9uLmZpZWxkTmFtZSB8IGlneEdyb3VwQnlNZXRhOmdyaWQpLmdyb3VwYWJsZVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiIShleHByZXNzaW9uLmZpZWxkTmFtZSB8IGlneEdyb3VwQnlNZXRhOmdyaWQpLmdyb3VwYWJsZVwiXG4gICAgICAgICAgICAoa2V5RG93bik9XCJoYW5kbGVLZXlEb3duKCRldmVudC5vd25lci5pZCwgJGV2ZW50Lm9yaWdpbmFsRXZlbnQpXCJcbiAgICAgICAgICAgIChyZW1vdmUpPVwiY2xlYXJHcm91cGluZygkZXZlbnQub3duZXIuaWQpXCJcbiAgICAgICAgICAgIChjaGlwQ2xpY2spPVwiaGFuZGxlQ2xpY2soZXhwcmVzc2lvbi5maWVsZE5hbWUpXCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4+e3sgKGV4cHJlc3Npb24uZmllbGROYW1lIHwgaWd4R3JvdXBCeU1ldGE6Z3JpZCkudGl0bGUgfX08L3NwYW4+XG4gICAgICAgICAgICA8aWd4LWljb24gaWd4U3VmZml4Pnt7IGV4cHJlc3Npb24uZGlyID09PSAxID8gJ2Fycm93X3Vwd2FyZCcgOiAnYXJyb3dfZG93bndhcmQnIH19PC9pZ3gtaWNvbj5cbiAgICAgICAgPC9pZ3gtY2hpcD5cblxuICAgICAgICA8c3BhbiBjbGFzcz1cImlneC1ncmlkLWdyb3VwYXJlYV9fY29ubmVjdG9yXCI+XG4gICAgICAgICAgICA8aWd4LWljb24gW2hpZGRlbl09XCIobGFzdCAmJiAhZHJvcEFyZWFWaXNpYmxlKVwiPmFycm93X2ZvcndhcmQ8L2lneC1pY29uPlxuICAgICAgICA8L3NwYW4+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPGRpdiBpZ3hHcm91cEFyZWFEcm9wIGNsYXNzPVwiaWd4LWRyb3AtYXJlYXt7IGRlbnNpdHkgIT09ICdjb21mb3J0YWJsZScgPyAnLS0nICsgZGVuc2l0eSA6ICcnfX1cIlxuICAgICAgICBbYXR0ci5ncmlkSWRdPVwiZ3JpZC5pZFwiXG4gICAgICAgIFtoaWRkZW5dPVwiIWRyb3BBcmVhVmlzaWJsZVwiXG4gICAgICAgIChpZ3hEcm9wKT1cIm9uRHJhZ0Ryb3AoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZHJvcEFyZWFUZW1wbGF0ZSB8fCBkZWZhdWx0XCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG48L2lneC1jaGlwcy1hcmVhPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHQ+XG4gICAgPGlneC1pY29uIGNsYXNzPVwiaWd4LWRyb3AtYXJlYV9faWNvblwiPmdyb3VwX3dvcms8L2lneC1pY29uPlxuICAgIDxzcGFuIGNsYXNzPVwiaWd4LWRyb3AtYXJlYV9fdGV4dFwiPnt7IGRyb3BBcmVhTWVzc2FnZSB9fTwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=