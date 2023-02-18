import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HammerGesturesManager } from '../../core/touch';
import { IgxGridExpandableCellComponent } from '../grid/expandable-cell.component';
import { IgxTreeGridRow } from '../grid-public-row';
import * as i0 from "@angular/core";
import * as i1 from "../../chips/chip.component";
import * as i2 from "../../icon/icon.component";
import * as i3 from "../../input-group/input-group.component";
import * as i4 from "../../checkbox/checkbox.component";
import * as i5 from "../../date-picker/date-picker.component";
import * as i6 from "../../time-picker/time-picker.component";
import * as i7 from "../../progressbar/progressbar.component";
import * as i8 from "@angular/common";
import * as i9 from "../../directives/text-highlight/text-highlight.directive";
import * as i10 from "@angular/forms";
import * as i11 from "../../directives/input/input.directive";
import * as i12 from "../../directives/focus/focus.directive";
import * as i13 from "../../directives/date-time-editor/date-time-editor.directive";
import * as i14 from "../../directives/prefix/prefix.directive";
import * as i15 from "../../directives/suffix/suffix.directive";
import * as i16 from "../common/pipes";
export class IgxTreeGridCellComponent extends IgxGridExpandableCellComponent {
    constructor() {
        super(...arguments);
        /**
         * @hidden
         */
        this.level = 0;
        /**
         * @hidden
         */
        this.showIndicator = false;
    }
    /**
     * Gets the row of the cell.
     * ```typescript
     * let cellRow = this.cell.row;
     * ```
     *
     * @memberof IgxGridCellComponent
     */
    get row() {
        // TODO: Fix types
        return new IgxTreeGridRow(this.grid, this.intRow.index, this.intRow.data);
    }
    /**
     * @hidden
     */
    toggle(event) {
        event.stopPropagation();
        this.grid.gridAPI.set_row_expansion_state(this.intRow.key, !this.intRow.expanded, event);
    }
    /**
     * @hidden
     */
    onLoadingDblClick(event) {
        event.stopPropagation();
    }
}
IgxTreeGridCellComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridCellComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
IgxTreeGridCellComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeGridCellComponent, selector: "igx-tree-grid-cell", inputs: { level: "level", showIndicator: "showIndicator", isLoading: "isLoading", row: "row" }, providers: [HammerGesturesManager], usesInheritance: true, ngImport: i0, template: "<ng-template #defaultPinnedIndicator>\n    <igx-chip\n        *ngIf=\"displayPinnedChip\"\n        class=\"igx-grid__td--pinned-chip\"\n        [disabled]=\"true\"\n        [displayDensity]=\"'compact'\"\n        >{{ grid.resourceStrings.igx_grid_pinned_row_indicator }}</igx-chip\n    >\n</ng-template>\n<ng-template #defaultCell>\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n        igxTextHighlight\n        class=\"igx-grid__td-text\"\n        style=\"pointer-events: none;\"\n        [cssClass]=\"highlightClass\"\n        [activeCssClass]=\"activeHighlightClass\"\n        [groupName]=\"gridID\"\n        [value]=\"\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === 'number'\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        \"\n        [row]=\"rowData\"\n        [column]=\"this.column.field\"\n        [containerClass]=\"'igx-grid__td-text'\"\n        [metadata]=\"searchMetadata\"\n    >{{\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === \"number\"\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        }}</div>\n    <igx-icon\n        *ngIf=\"column.dataType === 'boolean' && !this.formatter\"\n        [ngClass]=\"{ 'igx-icon--success': value, 'igx-icon--error': !value }\"\n        >{{ value ? \"check\" : \"close\" }}</igx-icon\n    >\n</ng-template>\n<ng-template #addRowCell let-cell=\"cell\">\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n    igxTextHighlight class=\"igx-grid__td-text\"\n    style=\"pointer-events: none\"\n    [cssClass]=\"highlightClass\"\n    [activeCssClass]=\"activeHighlightClass\"\n    [groupName]=\"gridID\"\n    [value]=\"formatter ? (value | columnFormatter:formatter:rowData) : column.dataType === 'number' ?\n        (value | number:column.pipeArgs.digitsInfo:grid.locale) : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime') ?\n        (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale) : column.dataType === 'currency'?\n        (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale) : column.dataType === 'percent' ?\n        (value | percent:column.pipeArgs.digitsInfo:grid.locale) : value\"\n    [row]=\"rowData\"\n    [column]=\"this.column.field\"\n    [containerClass]=\"'igx-grid__td-text'\"\n    [metadata]=\"searchMetadata\">{{\n        !isEmptyAddRowCell ? value : (column.header || column.field)\n    }}</div>\n</ng-template>\n<ng-template #inlineEditor let-cell=\"cell\">\n    <ng-container *ngIf=\"column.dataType === 'string'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input igxInput [(ngModel)]=\"editValue\" [igxFocus]=\"true\" />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'number'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'boolean'\">\n        <igx-checkbox\n            [(ngModel)]=\"editValue\"\n            [disableRipple]=\"true\"\n        ></igx-checkbox>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'date'\">\n        <igx-date-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [locale]=\"grid.locale\"\n            [(value)]=\"editValue\"\n            [igxFocus]=\"true\"\n        >\n        </igx-date-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'time'\">\n        <igx-time-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [inputFormat]=\"column.defaultTimeFormat\"\n            [(ngModel)]=\"editValue\"\n            [igxFocus]=\"true\"\n            >\n        </igx-time-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'dateTime'\">\n        <igx-input-group>\n            <input type=\"text\" igxInput [igxDateTimeEditor]=\"column.defaultDateTimeFormat\" [(ngModel)]=\"editValue\" [igxFocus]=\"true\"/>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'currency'\">\n        <igx-input-group displayDensity=\"compact\">\n            <igx-prefix *ngIf=\"grid.currencyPositionLeft\">{{ currencyCodeSymbol }}</igx-prefix>\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix *ngIf=\"!grid.currencyPositionLeft\" >{{ currencyCodeSymbol }}</igx-suffix>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'percent'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix> {{ editValue | percent:column.pipeArgs.digitsInfo:grid.locale }} </igx-suffix>\n        </igx-input-group>\n    </ng-container>\n</ng-template>\n<ng-container *ngIf=\"!editMode\">\n    <ng-container *ngIf=\"level > 0\">\n        <div\n            #indentationDiv\n            class=\"igx-grid__tree-cell--padding-level-{{level}}\"\n            [ngStyle]=\"{'padding-inline-start': 'calc(var(--igx-tree-indent-size) *' + level + ')'}\"\n        ></div>\n    </ng-container>\n    <div\n        #indicator\n        *ngIf=\"!isLoading\"\n        class=\"igx-grid__tree-grouping-indicator\"\n        [ngStyle]=\"{ visibility: showIndicator ? 'visible' : 'hidden' }\"\n        (click)=\"toggle($event)\"\n        (focus)=\"onIndicatorFocus()\"\n    >\n        <ng-container\n            *ngTemplateOutlet=\"iconTemplate; context: { $implicit:  this }\"\n        >\n        </ng-container>\n        <ng-container\n            *ngTemplateOutlet=\"pinnedIndicatorTemplate; context: context\"\n        >\n        </ng-container>\n    </div>\n    <div\n        *ngIf=\"isLoading\"\n        (dblclick)=\"onLoadingDblClick($event)\"\n        class=\"igx-grid__tree-loading-indicator\"\n    >\n        <ng-container\n            *ngTemplateOutlet=\"\n                grid.rowLoadingIndicatorTemplate\n                    ? grid.rowLoadingIndicatorTemplate\n                    : defaultLoadingIndicatorTemplate\n            \"\n        >\n        </ng-container>\n    </div>\n    <ng-template #defaultLoadingIndicatorTemplate>\n        <igx-circular-bar [indeterminate]=\"true\"> </igx-circular-bar>\n    </ng-template>\n</ng-container>\n<ng-container *ngTemplateOutlet=\"template; context: context\"> </ng-container>\n<ng-template #defaultExpandedTemplate>\n    <igx-icon>expand_more</igx-icon>\n</ng-template>\n<ng-template #defaultCollapsedTemplate>\n    <igx-icon>chevron_right</igx-icon>\n</ng-template>\n", components: [{ type: i1.IgxChipComponent, selector: "igx-chip", inputs: ["id", "tabIndex", "data", "draggable", "animateOnRelease", "hideBaseOnDrag", "removable", "removeIcon", "selectable", "selectIcon", "class", "disabled", "selected", "color", "resourceStrings"], outputs: ["selectedChange", "moveStart", "moveEnd", "remove", "chipClick", "selectedChanging", "selectedChanged", "keyDown", "dragEnter", "dragLeave", "dragOver", "dragDrop"] }, { type: i2.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i3.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i4.IgxCheckboxComponent, selector: "igx-checkbox", inputs: ["id", "labelId", "value", "name", "tabindex", "labelPosition", "disableRipple", "required", "aria-labelledby", "aria-label", "indeterminate", "checked", "disabled", "readonly", "disableTransitions"], outputs: ["change"] }, { type: i5.IgxDatePickerComponent, selector: "igx-date-picker", inputs: ["weekStart", "hideOutsideDays", "displayMonthsCount", "showWeekNumbers", "formatter", "headerOrientation", "todayButtonLabel", "cancelButtonLabel", "spinLoop", "spinDelta", "outlet", "id", "formatViews", "disabledDates", "specialDates", "calendarFormat", "value", "minValue", "maxValue", "resourceStrings", "readOnly"], outputs: ["valueChange", "validationFailed"] }, { type: i6.IgxTimePickerComponent, selector: "igx-time-picker", inputs: ["id", "displayFormat", "inputFormat", "mode", "minValue", "maxValue", "spinLoop", "formatter", "headerOrientation", "readOnly", "value", "resourceStrings", "okButtonLabel", "cancelButtonLabel", "itemsDelta"], outputs: ["selected", "valueChange", "validationFailed"] }, { type: i7.IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: ["id", "isIndeterminate", "textVisibility", "text"] }], directives: [{ type: i8.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i9.IgxTextHighlightDirective, selector: "[igxTextHighlight]", inputs: ["cssClass", "activeCssClass", "containerClass", "groupName", "value", "row", "column", "metadata"] }, { type: i8.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i10.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i11.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i10.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i10.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i12.IgxFocusDirective, selector: "[igxFocus]", inputs: ["igxFocus"], exportAs: ["igxFocus"] }, { type: i10.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { type: i13.IgxDateTimeEditorDirective, selector: "[igxDateTimeEditor]", inputs: ["locale", "minValue", "maxValue", "spinLoop", "displayFormat", "igxDateTimeEditor", "value", "spinDelta"], outputs: ["valueChange", "validationFailed"], exportAs: ["igxDateTimeEditor"] }, { type: i14.IgxPrefixDirective, selector: "igx-prefix,[igxPrefix]" }, { type: i15.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i8.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i8.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "columnFormatter": i16.IgxColumnFormatterPipe, "number": i8.DecimalPipe, "date": i8.DatePipe, "currency": i8.CurrencyPipe, "percent": i8.PercentPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeGridCellComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-tree-grid-cell', providers: [HammerGesturesManager], template: "<ng-template #defaultPinnedIndicator>\n    <igx-chip\n        *ngIf=\"displayPinnedChip\"\n        class=\"igx-grid__td--pinned-chip\"\n        [disabled]=\"true\"\n        [displayDensity]=\"'compact'\"\n        >{{ grid.resourceStrings.igx_grid_pinned_row_indicator }}</igx-chip\n    >\n</ng-template>\n<ng-template #defaultCell>\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n        igxTextHighlight\n        class=\"igx-grid__td-text\"\n        style=\"pointer-events: none;\"\n        [cssClass]=\"highlightClass\"\n        [activeCssClass]=\"activeHighlightClass\"\n        [groupName]=\"gridID\"\n        [value]=\"\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === 'number'\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        \"\n        [row]=\"rowData\"\n        [column]=\"this.column.field\"\n        [containerClass]=\"'igx-grid__td-text'\"\n        [metadata]=\"searchMetadata\"\n    >{{\n            formatter\n                ? (value | columnFormatter:formatter:rowData)\n                : column.dataType === \"number\"\n                ? (value | number:column.pipeArgs.digitsInfo:grid.locale)\n                : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime')\n                ? (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale)\n                : column.dataType === 'currency'\n                ? (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale)\n                : column.dataType === 'percent'\n                ? (value | percent:column.pipeArgs.digitsInfo:grid.locale)\n                : value\n        }}</div>\n    <igx-icon\n        *ngIf=\"column.dataType === 'boolean' && !this.formatter\"\n        [ngClass]=\"{ 'igx-icon--success': value, 'igx-icon--error': !value }\"\n        >{{ value ? \"check\" : \"close\" }}</igx-icon\n    >\n</ng-template>\n<ng-template #addRowCell let-cell=\"cell\">\n    <div *ngIf=\"column.dataType !== 'boolean' || (column.dataType === 'boolean' && this.formatter)\"\n    igxTextHighlight class=\"igx-grid__td-text\"\n    style=\"pointer-events: none\"\n    [cssClass]=\"highlightClass\"\n    [activeCssClass]=\"activeHighlightClass\"\n    [groupName]=\"gridID\"\n    [value]=\"formatter ? (value | columnFormatter:formatter:rowData) : column.dataType === 'number' ?\n        (value | number:column.pipeArgs.digitsInfo:grid.locale) : (column.dataType === 'date' || column.dataType === 'time' || column.dataType === 'dateTime') ?\n        (value | date:column.pipeArgs.format:column.pipeArgs.timezone:grid.locale) : column.dataType === 'currency'?\n        (value | currency:currencyCode:column.pipeArgs.display:column.pipeArgs.digitsInfo:grid.locale) : column.dataType === 'percent' ?\n        (value | percent:column.pipeArgs.digitsInfo:grid.locale) : value\"\n    [row]=\"rowData\"\n    [column]=\"this.column.field\"\n    [containerClass]=\"'igx-grid__td-text'\"\n    [metadata]=\"searchMetadata\">{{\n        !isEmptyAddRowCell ? value : (column.header || column.field)\n    }}</div>\n</ng-template>\n<ng-template #inlineEditor let-cell=\"cell\">\n    <ng-container *ngIf=\"column.dataType === 'string'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input igxInput [(ngModel)]=\"editValue\" [igxFocus]=\"true\" />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'number'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'boolean'\">\n        <igx-checkbox\n            [(ngModel)]=\"editValue\"\n            [disableRipple]=\"true\"\n        ></igx-checkbox>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'date'\">\n        <igx-date-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [locale]=\"grid.locale\"\n            [(value)]=\"editValue\"\n            [igxFocus]=\"true\"\n        >\n        </igx-date-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'time'\">\n        <igx-time-picker\n            [style.width.%]=\"100\"\n            [outlet]=\"grid.outlet\"\n            mode=\"dropdown\"\n            [inputFormat]=\"column.defaultTimeFormat\"\n            [(ngModel)]=\"editValue\"\n            [igxFocus]=\"true\"\n            >\n        </igx-time-picker>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'dateTime'\">\n        <igx-input-group>\n            <input type=\"text\" igxInput [igxDateTimeEditor]=\"column.defaultDateTimeFormat\" [(ngModel)]=\"editValue\" [igxFocus]=\"true\"/>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'currency'\">\n        <igx-input-group displayDensity=\"compact\">\n            <igx-prefix *ngIf=\"grid.currencyPositionLeft\">{{ currencyCodeSymbol }}</igx-prefix>\n            <input\n                igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix *ngIf=\"!grid.currencyPositionLeft\" >{{ currencyCodeSymbol }}</igx-suffix>\n        </igx-input-group>\n    </ng-container>\n    <ng-container *ngIf=\"column.dataType === 'percent'\">\n        <igx-input-group displayDensity=\"compact\">\n            <input igxInput\n                [(ngModel)]=\"editValue\"\n                [igxFocus]=\"true\"\n                [step]=\"step\"\n                type=\"number\"\n            />\n            <igx-suffix> {{ editValue | percent:column.pipeArgs.digitsInfo:grid.locale }} </igx-suffix>\n        </igx-input-group>\n    </ng-container>\n</ng-template>\n<ng-container *ngIf=\"!editMode\">\n    <ng-container *ngIf=\"level > 0\">\n        <div\n            #indentationDiv\n            class=\"igx-grid__tree-cell--padding-level-{{level}}\"\n            [ngStyle]=\"{'padding-inline-start': 'calc(var(--igx-tree-indent-size) *' + level + ')'}\"\n        ></div>\n    </ng-container>\n    <div\n        #indicator\n        *ngIf=\"!isLoading\"\n        class=\"igx-grid__tree-grouping-indicator\"\n        [ngStyle]=\"{ visibility: showIndicator ? 'visible' : 'hidden' }\"\n        (click)=\"toggle($event)\"\n        (focus)=\"onIndicatorFocus()\"\n    >\n        <ng-container\n            *ngTemplateOutlet=\"iconTemplate; context: { $implicit:  this }\"\n        >\n        </ng-container>\n        <ng-container\n            *ngTemplateOutlet=\"pinnedIndicatorTemplate; context: context\"\n        >\n        </ng-container>\n    </div>\n    <div\n        *ngIf=\"isLoading\"\n        (dblclick)=\"onLoadingDblClick($event)\"\n        class=\"igx-grid__tree-loading-indicator\"\n    >\n        <ng-container\n            *ngTemplateOutlet=\"\n                grid.rowLoadingIndicatorTemplate\n                    ? grid.rowLoadingIndicatorTemplate\n                    : defaultLoadingIndicatorTemplate\n            \"\n        >\n        </ng-container>\n    </div>\n    <ng-template #defaultLoadingIndicatorTemplate>\n        <igx-circular-bar [indeterminate]=\"true\"> </igx-circular-bar>\n    </ng-template>\n</ng-container>\n<ng-container *ngTemplateOutlet=\"template; context: context\"> </ng-container>\n<ng-template #defaultExpandedTemplate>\n    <igx-icon>expand_more</igx-icon>\n</ng-template>\n<ng-template #defaultCollapsedTemplate>\n    <igx-icon>chevron_right</igx-icon>\n</ng-template>\n" }]
        }], propDecorators: { level: [{
                type: Input
            }], showIndicator: [{
                type: Input
            }], isLoading: [{
                type: Input
            }], row: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy90cmVlLWdyaWQvdHJlZS1jZWxsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy90cmVlLWdyaWQvdHJlZS1jZWxsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULEtBQUssRUFDUixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNuRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNwRCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsOEJBQThCO0lBTjVFOztRQVFJOztXQUVHO1FBRUksVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVqQjs7V0FFRztRQUVJLGtCQUFhLEdBQUcsS0FBSyxDQUFDO0tBb0NoQztJQTVCRzs7Ozs7OztPQU9HO0lBQ0gsSUFDVyxHQUFHO1FBQ1Ysa0JBQWtCO1FBQ2xCLE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxLQUFZO1FBQ3RCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRDs7T0FFRztJQUNJLGlCQUFpQixDQUFDLEtBQVk7UUFDakMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzVCLENBQUM7O3FIQS9DUSx3QkFBd0I7eUdBQXhCLHdCQUF3Qiw2SUFGdEIsQ0FBQyxxQkFBcUIsQ0FBQyxpRENkdEMsZ3dRQXFNQTsyRkRyTGEsd0JBQXdCO2tCQU5wQyxTQUFTO3NDQUNXLHVCQUF1QixDQUFDLE1BQU0sWUFDckMsb0JBQW9CLGFBRW5CLENBQUMscUJBQXFCLENBQUM7OEJBUTNCLEtBQUs7c0JBRFgsS0FBSztnQkFPQyxhQUFhO3NCQURuQixLQUFLO2dCQU9DLFNBQVM7c0JBRGYsS0FBSztnQkFZSyxHQUFHO3NCQURiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEhhbW1lckdlc3R1cmVzTWFuYWdlciB9IGZyb20gJy4uLy4uL2NvcmUvdG91Y2gnO1xuaW1wb3J0IHsgSWd4R3JpZEV4cGFuZGFibGVDZWxsQ29tcG9uZW50IH0gZnJvbSAnLi4vZ3JpZC9leHBhbmRhYmxlLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IElneFRyZWVHcmlkUm93IH0gZnJvbSAnLi4vZ3JpZC1wdWJsaWMtcm93JztcbmltcG9ydCB7IFJvd1R5cGUgfSBmcm9tICcuLi9jb21tb24vZ3JpZC5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBzZWxlY3RvcjogJ2lneC10cmVlLWdyaWQtY2VsbCcsXG4gICAgdGVtcGxhdGVVcmw6ICd0cmVlLWNlbGwuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW0hhbW1lckdlc3R1cmVzTWFuYWdlcl1cbn0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUdyaWRDZWxsQ29tcG9uZW50IGV4dGVuZHMgSWd4R3JpZEV4cGFuZGFibGVDZWxsQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBsZXZlbCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd0luZGljYXRvciA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlzTG9hZGluZzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHJvdyBvZiB0aGUgY2VsbC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGNlbGxSb3cgPSB0aGlzLmNlbGwucm93O1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEdyaWRDZWxsQ29tcG9uZW50XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHJvdygpOiBSb3dUeXBlIHtcbiAgICAgICAgLy8gVE9ETzogRml4IHR5cGVzXG4gICAgICAgIHJldHVybiBuZXcgSWd4VHJlZUdyaWRSb3codGhpcy5ncmlkIGFzIGFueSwgdGhpcy5pbnRSb3cuaW5kZXgsIHRoaXMuaW50Um93LmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5ncmlkLmdyaWRBUEkuc2V0X3Jvd19leHBhbnNpb25fc3RhdGUodGhpcy5pbnRSb3cua2V5LCAhdGhpcy5pbnRSb3cuZXhwYW5kZWQsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIG9uTG9hZGluZ0RibENsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG59XG4iLCI8bmctdGVtcGxhdGUgI2RlZmF1bHRQaW5uZWRJbmRpY2F0b3I+XG4gICAgPGlneC1jaGlwXG4gICAgICAgICpuZ0lmPVwiZGlzcGxheVBpbm5lZENoaXBcIlxuICAgICAgICBjbGFzcz1cImlneC1ncmlkX190ZC0tcGlubmVkLWNoaXBcIlxuICAgICAgICBbZGlzYWJsZWRdPVwidHJ1ZVwiXG4gICAgICAgIFtkaXNwbGF5RGVuc2l0eV09XCInY29tcGFjdCdcIlxuICAgICAgICA+e3sgZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfcGlubmVkX3Jvd19pbmRpY2F0b3IgfX08L2lneC1jaGlwXG4gICAgPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdENlbGw+XG4gICAgPGRpdiAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSAhPT0gJ2Jvb2xlYW4nIHx8IChjb2x1bW4uZGF0YVR5cGUgPT09ICdib29sZWFuJyAmJiB0aGlzLmZvcm1hdHRlcilcIlxuICAgICAgICBpZ3hUZXh0SGlnaGxpZ2h0XG4gICAgICAgIGNsYXNzPVwiaWd4LWdyaWRfX3RkLXRleHRcIlxuICAgICAgICBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiXG4gICAgICAgIFtjc3NDbGFzc109XCJoaWdobGlnaHRDbGFzc1wiXG4gICAgICAgIFthY3RpdmVDc3NDbGFzc109XCJhY3RpdmVIaWdobGlnaHRDbGFzc1wiXG4gICAgICAgIFtncm91cE5hbWVdPVwiZ3JpZElEXCJcbiAgICAgICAgW3ZhbHVlXT1cIlxuICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBjb2x1bW5Gb3JtYXR0ZXI6Zm9ybWF0dGVyOnJvd0RhdGEpXG4gICAgICAgICAgICAgICAgOiBjb2x1bW4uZGF0YVR5cGUgPT09ICdudW1iZXInXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBudW1iZXI6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpXG4gICAgICAgICAgICAgICAgOiAoY29sdW1uLmRhdGFUeXBlID09PSAnZGF0ZScgfHwgY29sdW1uLmRhdGFUeXBlID09PSAndGltZScgfHwgY29sdW1uLmRhdGFUeXBlID09PSAnZGF0ZVRpbWUnKVxuICAgICAgICAgICAgICAgID8gKHZhbHVlIHwgZGF0ZTpjb2x1bW4ucGlwZUFyZ3MuZm9ybWF0OmNvbHVtbi5waXBlQXJncy50aW1lem9uZTpncmlkLmxvY2FsZSlcbiAgICAgICAgICAgICAgICA6IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ2N1cnJlbmN5J1xuICAgICAgICAgICAgICAgID8gKHZhbHVlIHwgY3VycmVuY3k6Y3VycmVuY3lDb2RlOmNvbHVtbi5waXBlQXJncy5kaXNwbGF5OmNvbHVtbi5waXBlQXJncy5kaWdpdHNJbmZvOmdyaWQubG9jYWxlKVxuICAgICAgICAgICAgICAgIDogY29sdW1uLmRhdGFUeXBlID09PSAncGVyY2VudCdcbiAgICAgICAgICAgICAgICA/ICh2YWx1ZSB8IHBlcmNlbnQ6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpXG4gICAgICAgICAgICAgICAgOiB2YWx1ZVxuICAgICAgICBcIlxuICAgICAgICBbcm93XT1cInJvd0RhdGFcIlxuICAgICAgICBbY29sdW1uXT1cInRoaXMuY29sdW1uLmZpZWxkXCJcbiAgICAgICAgW2NvbnRhaW5lckNsYXNzXT1cIidpZ3gtZ3JpZF9fdGQtdGV4dCdcIlxuICAgICAgICBbbWV0YWRhdGFdPVwic2VhcmNoTWV0YWRhdGFcIlxuICAgID57e1xuICAgICAgICAgICAgZm9ybWF0dGVyXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBjb2x1bW5Gb3JtYXR0ZXI6Zm9ybWF0dGVyOnJvd0RhdGEpXG4gICAgICAgICAgICAgICAgOiBjb2x1bW4uZGF0YVR5cGUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICA/ICh2YWx1ZSB8IG51bWJlcjpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSlcbiAgICAgICAgICAgICAgICA6IChjb2x1bW4uZGF0YVR5cGUgPT09ICdkYXRlJyB8fCBjb2x1bW4uZGF0YVR5cGUgPT09ICd0aW1lJyB8fCBjb2x1bW4uZGF0YVR5cGUgPT09ICdkYXRlVGltZScpXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBkYXRlOmNvbHVtbi5waXBlQXJncy5mb3JtYXQ6Y29sdW1uLnBpcGVBcmdzLnRpbWV6b25lOmdyaWQubG9jYWxlKVxuICAgICAgICAgICAgICAgIDogY29sdW1uLmRhdGFUeXBlID09PSAnY3VycmVuY3knXG4gICAgICAgICAgICAgICAgPyAodmFsdWUgfCBjdXJyZW5jeTpjdXJyZW5jeUNvZGU6Y29sdW1uLnBpcGVBcmdzLmRpc3BsYXk6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpXG4gICAgICAgICAgICAgICAgOiBjb2x1bW4uZGF0YVR5cGUgPT09ICdwZXJjZW50J1xuICAgICAgICAgICAgICAgID8gKHZhbHVlIHwgcGVyY2VudDpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSlcbiAgICAgICAgICAgICAgICA6IHZhbHVlXG4gICAgICAgIH19PC9kaXY+XG4gICAgPGlneC1pY29uXG4gICAgICAgICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAnYm9vbGVhbicgJiYgIXRoaXMuZm9ybWF0dGVyXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyAnaWd4LWljb24tLXN1Y2Nlc3MnOiB2YWx1ZSwgJ2lneC1pY29uLS1lcnJvcic6ICF2YWx1ZSB9XCJcbiAgICAgICAgPnt7IHZhbHVlID8gXCJjaGVja1wiIDogXCJjbG9zZVwiIH19PC9pZ3gtaWNvblxuICAgID5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2FkZFJvd0NlbGwgbGV0LWNlbGw9XCJjZWxsXCI+XG4gICAgPGRpdiAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSAhPT0gJ2Jvb2xlYW4nIHx8IChjb2x1bW4uZGF0YVR5cGUgPT09ICdib29sZWFuJyAmJiB0aGlzLmZvcm1hdHRlcilcIlxuICAgIGlneFRleHRIaWdobGlnaHQgY2xhc3M9XCJpZ3gtZ3JpZF9fdGQtdGV4dFwiXG4gICAgc3R5bGU9XCJwb2ludGVyLWV2ZW50czogbm9uZVwiXG4gICAgW2Nzc0NsYXNzXT1cImhpZ2hsaWdodENsYXNzXCJcbiAgICBbYWN0aXZlQ3NzQ2xhc3NdPVwiYWN0aXZlSGlnaGxpZ2h0Q2xhc3NcIlxuICAgIFtncm91cE5hbWVdPVwiZ3JpZElEXCJcbiAgICBbdmFsdWVdPVwiZm9ybWF0dGVyID8gKHZhbHVlIHwgY29sdW1uRm9ybWF0dGVyOmZvcm1hdHRlcjpyb3dEYXRhKSA6IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ251bWJlcicgP1xuICAgICAgICAodmFsdWUgfCBudW1iZXI6Y29sdW1uLnBpcGVBcmdzLmRpZ2l0c0luZm86Z3JpZC5sb2NhbGUpIDogKGNvbHVtbi5kYXRhVHlwZSA9PT0gJ2RhdGUnIHx8IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ3RpbWUnIHx8IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ2RhdGVUaW1lJykgP1xuICAgICAgICAodmFsdWUgfCBkYXRlOmNvbHVtbi5waXBlQXJncy5mb3JtYXQ6Y29sdW1uLnBpcGVBcmdzLnRpbWV6b25lOmdyaWQubG9jYWxlKSA6IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ2N1cnJlbmN5Jz9cbiAgICAgICAgKHZhbHVlIHwgY3VycmVuY3k6Y3VycmVuY3lDb2RlOmNvbHVtbi5waXBlQXJncy5kaXNwbGF5OmNvbHVtbi5waXBlQXJncy5kaWdpdHNJbmZvOmdyaWQubG9jYWxlKSA6IGNvbHVtbi5kYXRhVHlwZSA9PT0gJ3BlcmNlbnQnID9cbiAgICAgICAgKHZhbHVlIHwgcGVyY2VudDpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSkgOiB2YWx1ZVwiXG4gICAgW3Jvd109XCJyb3dEYXRhXCJcbiAgICBbY29sdW1uXT1cInRoaXMuY29sdW1uLmZpZWxkXCJcbiAgICBbY29udGFpbmVyQ2xhc3NdPVwiJ2lneC1ncmlkX190ZC10ZXh0J1wiXG4gICAgW21ldGFkYXRhXT1cInNlYXJjaE1ldGFkYXRhXCI+e3tcbiAgICAgICAgIWlzRW1wdHlBZGRSb3dDZWxsID8gdmFsdWUgOiAoY29sdW1uLmhlYWRlciB8fCBjb2x1bW4uZmllbGQpXG4gICAgfX08L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2lubGluZUVkaXRvciBsZXQtY2VsbD1cImNlbGxcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAnc3RyaW5nJ1wiPlxuICAgICAgICA8aWd4LWlucHV0LWdyb3VwIGRpc3BsYXlEZW5zaXR5PVwiY29tcGFjdFwiPlxuICAgICAgICAgICAgPGlucHV0IGlneElucHV0IFsobmdNb2RlbCldPVwiZWRpdFZhbHVlXCIgW2lneEZvY3VzXT1cInRydWVcIiAvPlxuICAgICAgICA8L2lneC1pbnB1dC1ncm91cD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAnbnVtYmVyJ1wiPlxuICAgICAgICA8aWd4LWlucHV0LWdyb3VwIGRpc3BsYXlEZW5zaXR5PVwiY29tcGFjdFwiPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgaWd4SW5wdXRcbiAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cImVkaXRWYWx1ZVwiXG4gICAgICAgICAgICAgICAgW2lneEZvY3VzXT1cInRydWVcIlxuICAgICAgICAgICAgICAgIFtzdGVwXT1cInN0ZXBcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9pZ3gtaW5wdXQtZ3JvdXA+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSA9PT0gJ2Jvb2xlYW4nXCI+XG4gICAgICAgIDxpZ3gtY2hlY2tib3hcbiAgICAgICAgICAgIFsobmdNb2RlbCldPVwiZWRpdFZhbHVlXCJcbiAgICAgICAgICAgIFtkaXNhYmxlUmlwcGxlXT1cInRydWVcIlxuICAgICAgICA+PC9pZ3gtY2hlY2tib3g+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSA9PT0gJ2RhdGUnXCI+XG4gICAgICAgIDxpZ3gtZGF0ZS1waWNrZXJcbiAgICAgICAgICAgIFtzdHlsZS53aWR0aC4lXT1cIjEwMFwiXG4gICAgICAgICAgICBbb3V0bGV0XT1cImdyaWQub3V0bGV0XCJcbiAgICAgICAgICAgIG1vZGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICBbbG9jYWxlXT1cImdyaWQubG9jYWxlXCJcbiAgICAgICAgICAgIFsodmFsdWUpXT1cImVkaXRWYWx1ZVwiXG4gICAgICAgICAgICBbaWd4Rm9jdXNdPVwidHJ1ZVwiXG4gICAgICAgID5cbiAgICAgICAgPC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSA9PT0gJ3RpbWUnXCI+XG4gICAgICAgIDxpZ3gtdGltZS1waWNrZXJcbiAgICAgICAgICAgIFtzdHlsZS53aWR0aC4lXT1cIjEwMFwiXG4gICAgICAgICAgICBbb3V0bGV0XT1cImdyaWQub3V0bGV0XCJcbiAgICAgICAgICAgIG1vZGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICBbaW5wdXRGb3JtYXRdPVwiY29sdW1uLmRlZmF1bHRUaW1lRm9ybWF0XCJcbiAgICAgICAgICAgIFsobmdNb2RlbCldPVwiZWRpdFZhbHVlXCJcbiAgICAgICAgICAgIFtpZ3hGb2N1c109XCJ0cnVlXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgPC9pZ3gtdGltZS1waWNrZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi5kYXRhVHlwZSA9PT0gJ2RhdGVUaW1lJ1wiPlxuICAgICAgICA8aWd4LWlucHV0LWdyb3VwPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWd4SW5wdXQgW2lneERhdGVUaW1lRWRpdG9yXT1cImNvbHVtbi5kZWZhdWx0RGF0ZVRpbWVGb3JtYXRcIiBbKG5nTW9kZWwpXT1cImVkaXRWYWx1ZVwiIFtpZ3hGb2N1c109XCJ0cnVlXCIvPlxuICAgICAgICA8L2lneC1pbnB1dC1ncm91cD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmRhdGFUeXBlID09PSAnY3VycmVuY3knXCI+XG4gICAgICAgIDxpZ3gtaW5wdXQtZ3JvdXAgZGlzcGxheURlbnNpdHk9XCJjb21wYWN0XCI+XG4gICAgICAgICAgICA8aWd4LXByZWZpeCAqbmdJZj1cImdyaWQuY3VycmVuY3lQb3NpdGlvbkxlZnRcIj57eyBjdXJyZW5jeUNvZGVTeW1ib2wgfX08L2lneC1wcmVmaXg+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBpZ3hJbnB1dFxuICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVwiZWRpdFZhbHVlXCJcbiAgICAgICAgICAgICAgICBbaWd4Rm9jdXNdPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgW3N0ZXBdPVwic3RlcFwiXG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGlneC1zdWZmaXggKm5nSWY9XCIhZ3JpZC5jdXJyZW5jeVBvc2l0aW9uTGVmdFwiID57eyBjdXJyZW5jeUNvZGVTeW1ib2wgfX08L2lneC1zdWZmaXg+XG4gICAgICAgIDwvaWd4LWlucHV0LWdyb3VwPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZGF0YVR5cGUgPT09ICdwZXJjZW50J1wiPlxuICAgICAgICA8aWd4LWlucHV0LWdyb3VwIGRpc3BsYXlEZW5zaXR5PVwiY29tcGFjdFwiPlxuICAgICAgICAgICAgPGlucHV0IGlneElucHV0XG4gICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJlZGl0VmFsdWVcIlxuICAgICAgICAgICAgICAgIFtpZ3hGb2N1c109XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBbc3RlcF09XCJzdGVwXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8aWd4LXN1ZmZpeD4ge3sgZWRpdFZhbHVlIHwgcGVyY2VudDpjb2x1bW4ucGlwZUFyZ3MuZGlnaXRzSW5mbzpncmlkLmxvY2FsZSB9fSA8L2lneC1zdWZmaXg+XG4gICAgICAgIDwvaWd4LWlucHV0LWdyb3VwPlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9uZy10ZW1wbGF0ZT5cbjxuZy1jb250YWluZXIgKm5nSWY9XCIhZWRpdE1vZGVcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibGV2ZWwgPiAwXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgICNpbmRlbnRhdGlvbkRpdlxuICAgICAgICAgICAgY2xhc3M9XCJpZ3gtZ3JpZF9fdHJlZS1jZWxsLS1wYWRkaW5nLWxldmVsLXt7bGV2ZWx9fVwiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJ7J3BhZGRpbmctaW5saW5lLXN0YXJ0JzogJ2NhbGModmFyKC0taWd4LXRyZWUtaW5kZW50LXNpemUpIConICsgbGV2ZWwgKyAnKSd9XCJcbiAgICAgICAgPjwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxkaXZcbiAgICAgICAgI2luZGljYXRvclxuICAgICAgICAqbmdJZj1cIiFpc0xvYWRpbmdcIlxuICAgICAgICBjbGFzcz1cImlneC1ncmlkX190cmVlLWdyb3VwaW5nLWluZGljYXRvclwiXG4gICAgICAgIFtuZ1N0eWxlXT1cInsgdmlzaWJpbGl0eTogc2hvd0luZGljYXRvciA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nIH1cIlxuICAgICAgICAoY2xpY2spPVwidG9nZ2xlKCRldmVudClcIlxuICAgICAgICAoZm9jdXMpPVwib25JbmRpY2F0b3JGb2N1cygpXCJcbiAgICA+XG4gICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwiaWNvblRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogIHRoaXMgfVwiXG4gICAgICAgID5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ1RlbXBsYXRlT3V0bGV0PVwicGlubmVkSW5kaWNhdG9yVGVtcGxhdGU7IGNvbnRleHQ6IGNvbnRleHRcIlxuICAgICAgICA+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJpc0xvYWRpbmdcIlxuICAgICAgICAoZGJsY2xpY2spPVwib25Mb2FkaW5nRGJsQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgIGNsYXNzPVwiaWd4LWdyaWRfX3RyZWUtbG9hZGluZy1pbmRpY2F0b3JcIlxuICAgID5cbiAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJcbiAgICAgICAgICAgICAgICBncmlkLnJvd0xvYWRpbmdJbmRpY2F0b3JUZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICA/IGdyaWQucm93TG9hZGluZ0luZGljYXRvclRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIDogZGVmYXVsdExvYWRpbmdJbmRpY2F0b3JUZW1wbGF0ZVxuICAgICAgICAgICAgXCJcbiAgICAgICAgPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRMb2FkaW5nSW5kaWNhdG9yVGVtcGxhdGU+XG4gICAgICAgIDxpZ3gtY2lyY3VsYXItYmFyIFtpbmRldGVybWluYXRlXT1cInRydWVcIj4gPC9pZ3gtY2lyY3VsYXItYmFyPlxuICAgIDwvbmctdGVtcGxhdGU+XG48L25nLWNvbnRhaW5lcj5cbjxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZTsgY29udGV4dDogY29udGV4dFwiPiA8L25nLWNvbnRhaW5lcj5cbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEV4cGFuZGVkVGVtcGxhdGU+XG4gICAgPGlneC1pY29uPmV4cGFuZF9tb3JlPC9pZ3gtaWNvbj5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2RlZmF1bHRDb2xsYXBzZWRUZW1wbGF0ZT5cbiAgICA8aWd4LWljb24+Y2hldnJvbl9yaWdodDwvaWd4LWljb24+XG48L25nLXRlbXBsYXRlPlxuIl19