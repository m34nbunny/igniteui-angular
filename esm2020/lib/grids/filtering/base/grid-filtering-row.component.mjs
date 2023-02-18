import { Component, Input, TemplateRef, ViewChild, ViewChildren, ElementRef, HostBinding, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { GridColumnDataType, DataUtil } from '../../../data-operations/data-util';
import { IgxDropDownComponent } from '../../../drop-down/public_api';
import { FilteringLogic } from '../../../data-operations/filtering-expression.interface';
import { HorizontalAlignment, VerticalAlignment } from '../../../services/overlay/utilities';
import { ConnectedPositioningStrategy } from '../../../services/overlay/position/connected-positioning-strategy';
import { IgxChipsAreaComponent } from '../../../chips/public_api';
import { AbsoluteScrollStrategy } from '../../../services/overlay/scroll';
import { DisplayDensity } from '../../../core/displayDensity';
import { isEqual } from '../../../core/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpressionUI } from '../excel-style/common';
import * as i0 from "@angular/core";
import * as i1 from "../grid-filtering.service";
import * as i2 from "../../../core/utils";
import * as i3 from "../../../drop-down/drop-down.component";
import * as i4 from "../../../drop-down/drop-down-item.component";
import * as i5 from "../../../icon/icon.component";
import * as i6 from "../../../input-group/input-group.component";
import * as i7 from "../../../date-picker/date-picker.component";
import * as i8 from "../../../date-common/picker-icons.common";
import * as i9 from "../../../time-picker/time-picker.component";
import * as i10 from "../../../chips/chips-area.component";
import * as i11 from "../../../chips/chip.component";
import * as i12 from "@angular/common";
import * as i13 from "../../../directives/prefix/prefix.directive";
import * as i14 from "../../../drop-down/drop-down-navigation.directive";
import * as i15 from "../../../directives/input/input.directive";
import * as i16 from "../../../directives/suffix/suffix.directive";
import * as i17 from "../../../directives/date-time-editor/date-time-editor.directive";
import * as i18 from "../../../directives/button/button.directive";
import * as i19 from "../../../directives/ripple/ripple.directive";
/**
 * @hidden
 */
export class IgxGridFilteringRowComponent {
    constructor(filteringService, ref, cdr, platform) {
        this.filteringService = filteringService;
        this.ref = ref;
        this.cdr = cdr;
        this.platform = platform;
        this.defaultCSSClass = true;
        this._positionSettings = {
            horizontalStartPoint: HorizontalAlignment.Left,
            verticalStartPoint: VerticalAlignment.Bottom
        };
        this._conditionsOverlaySettings = {
            closeOnOutsideClick: true,
            modal: false,
            scrollStrategy: new AbsoluteScrollStrategy(),
            positionStrategy: new ConnectedPositioningStrategy(this._positionSettings)
        };
        this._operatorsOverlaySettings = {
            closeOnOutsideClick: true,
            modal: false,
            scrollStrategy: new AbsoluteScrollStrategy(),
            positionStrategy: new ConnectedPositioningStrategy(this._positionSettings)
        };
        this.chipAreaScrollOffset = 0;
        this._column = null;
        this.isKeyPressed = false;
        this.isComposing = false;
        this._cancelChipClick = false;
        /** switch to icon buttons when width is below 432px */
        this.NARROW_WIDTH_THRESHOLD = 432;
        this.$destroyer = new Subject();
    }
    get column() {
        return this._column;
    }
    set column(val) {
        if (this._column) {
            this.expressionsList.forEach(exp => exp.isSelected = false);
        }
        if (val) {
            this._column = val;
            this.expressionsList = this.filteringService.getExpressions(this._column.field);
            this.resetExpression();
            this.chipAreaScrollOffset = 0;
            this.transform(this.chipAreaScrollOffset);
        }
    }
    get value() {
        return this.expression ? this.expression.searchVal : null;
    }
    set value(val) {
        if (!val && val !== 0) {
            this.expression.searchVal = null;
            const index = this.expressionsList.findIndex(item => item.expression === this.expression);
            if (index === 0 && this.expressionsList.length === 1) {
                this.filteringService.clearFilter(this.column.field);
                if (this.expression.condition.isUnary) {
                    this.resetExpression();
                }
                return;
            }
        }
        else {
            const oldValue = this.expression.searchVal;
            if (isEqual(oldValue, val)) {
                return;
            }
            this.expression.searchVal = DataUtil.parseValue(this.column.dataType, val);
            if (this.expressionsList.find(item => item.expression === this.expression) === undefined) {
                this.addExpression(true);
            }
            this.filter();
        }
    }
    get displayDensity() {
        return this.column.grid.displayDensity === DisplayDensity.comfortable ? DisplayDensity.cosy : this.column.grid.displayDensity;
    }
    get compactCSSClass() {
        return this.column.grid.displayDensity === DisplayDensity.compact;
    }
    get cosyCSSClass() {
        return this.column.grid.displayDensity === DisplayDensity.cosy;
    }
    get nativeElement() {
        return this.ref.nativeElement;
    }
    onKeydownHandler(evt) {
        if (this.platform.isFilteringKeyCombo(evt)) {
            evt.preventDefault();
            evt.stopPropagation();
            this.close();
        }
    }
    ngAfterViewInit() {
        this._conditionsOverlaySettings.outlet = this.column.grid.outlet;
        this._operatorsOverlaySettings.outlet = this.column.grid.outlet;
        const selectedItem = this.expressionsList.find(expr => expr.isSelected === true);
        if (selectedItem) {
            this.expression = selectedItem.expression;
        }
        this.filteringService.grid.localeChange
            .pipe(takeUntil(this.$destroyer))
            .subscribe(() => {
            this.cdr.markForCheck();
        });
        requestAnimationFrame(() => this.focusEditElement());
    }
    get disabled() {
        return !(this.column.filteringExpressionsTree && this.column.filteringExpressionsTree.filteringOperands.length > 0);
    }
    get template() {
        if (this.column.dataType === GridColumnDataType.Date) {
            return this.defaultDateUI;
        }
        if (this.column.dataType === GridColumnDataType.Time) {
            return this.defaultTimeUI;
        }
        if (this.column.dataType === GridColumnDataType.DateTime) {
            return this.defaultDateTimeUI;
        }
        return this.defaultFilterUI;
    }
    get type() {
        switch (this.column.dataType) {
            case GridColumnDataType.String:
            case GridColumnDataType.Boolean:
                return 'text';
            case GridColumnDataType.Number:
            case GridColumnDataType.Currency:
                return 'number';
        }
    }
    get conditions() {
        return this.column.filters.conditionList();
    }
    get isUnaryCondition() {
        if (this.expression.condition) {
            return this.expression.condition.isUnary;
        }
        else {
            return true;
        }
    }
    get placeholder() {
        if (this.expression.condition && this.expression.condition.isUnary) {
            return this.filteringService.getChipLabel(this.expression);
        }
        else if (this.column.dataType === GridColumnDataType.Date) {
            return this.filteringService.grid.resourceStrings.igx_grid_filter_row_date_placeholder;
        }
        else if (this.column.dataType === GridColumnDataType.Boolean) {
            return this.filteringService.grid.resourceStrings.igx_grid_filter_row_boolean_placeholder;
        }
        else {
            return this.filteringService.grid.resourceStrings.igx_grid_filter_row_placeholder;
        }
    }
    /**
     * Event handler for keydown on the input group's prefix.
     */
    onPrefixKeyDown(event) {
        if (this.platform.isActivationKey(event) && this.dropDownConditions.collapsed) {
            this.toggleConditionsDropDown(this.inputGroupPrefix.nativeElement);
            event.stopImmediatePropagation();
        }
        else if (event.key === this.platform.KEYMAP.TAB && !this.dropDownConditions.collapsed) {
            this.toggleConditionsDropDown(this.inputGroupPrefix.nativeElement);
        }
    }
    /**
     * Event handler for keydown on the input.
     */
    onInputKeyDown(event) {
        this.isKeyPressed = true;
        event.stopPropagation();
        if (this.column.dataType === GridColumnDataType.Boolean) {
            if (this.platform.isActivationKey(event)) {
                this.inputGroupPrefix.nativeElement.focus();
                this.toggleConditionsDropDown(this.inputGroupPrefix.nativeElement);
                return;
            }
        }
        if (event.key === this.platform.KEYMAP.ENTER) {
            if (this.isComposing) {
                return;
            }
            this.commitInput();
        }
        else if (event.altKey && (event.key === this.platform.KEYMAP.ARROW_DOWN)) {
            this.inputGroupPrefix.nativeElement.focus();
            this.toggleConditionsDropDown(this.inputGroupPrefix.nativeElement);
        }
        else if (this.platform.isFilteringKeyCombo(event)) {
            event.preventDefault();
            this.close();
        }
    }
    /**
     * Event handler for keyup on the input.
     */
    onInputKeyUp() {
        this.isKeyPressed = false;
    }
    /**
     * Event handler for input on the input.
     */
    onInput(eventArgs) {
        // The 'iskeyPressed' flag is needed for a case in IE, because the input event is fired on focus and for some reason,
        // when you have a japanese character as a placeholder, on init the value here is empty string .
        const target = eventArgs.target;
        if (this.column.dataType === GridColumnDataType.DateTime) {
            this.value = eventArgs;
            return;
        }
        if (this.platform.isEdge && target.type !== 'number'
            || this.isKeyPressed || target.value || target.checkValidity()) {
            this.value = target.value;
        }
    }
    /**
     * Event handler for compositionstart on the input.
     */
    onCompositionStart() {
        this.isComposing = true;
    }
    /**
     * Event handler for compositionend on the input.
     */
    onCompositionEnd() {
        this.isComposing = false;
    }
    /**
     * Event handler for input click event.
     */
    onInputClick() {
        if (this.column.dataType === GridColumnDataType.Boolean && this.dropDownConditions.collapsed) {
            this.inputGroupPrefix.nativeElement.focus();
            this.toggleConditionsDropDown(this.inputGroupPrefix.nativeElement);
        }
    }
    /**
     * Returns the filtering operation condition for a given value.
     */
    getCondition(value) {
        return this.column.filters.condition(value);
    }
    /**
     * Returns the translated condition name for a given value.
     */
    translateCondition(value) {
        return this.filteringService.grid.resourceStrings[`igx_grid_filter_${this.getCondition(value).name}`] || value;
    }
    /**
     * Returns the icon name of the current condition.
     */
    getIconName() {
        if (this.column.dataType === GridColumnDataType.Boolean && this.expression.condition === null) {
            return this.getCondition(this.conditions[0]).iconName;
        }
        else {
            return this.expression.condition.iconName;
        }
    }
    /**
     * Returns whether a given condition is selected in dropdown.
     */
    isConditionSelected(conditionName) {
        if (this.expression.condition) {
            return this.expression.condition.name === conditionName;
        }
        else {
            return false;
        }
    }
    /**
     * Clears the current filtering.
     */
    clearFiltering() {
        this.filteringService.clearFilter(this.column.field);
        this.resetExpression();
        if (this.input) {
            this.input.nativeElement.focus();
        }
        this.cdr.detectChanges();
        this.chipAreaScrollOffset = 0;
        this.transform(this.chipAreaScrollOffset);
    }
    /**
     * Commits the value of the input.
     */
    commitInput() {
        const selectedItem = this.expressionsList.filter(ex => ex.isSelected === true);
        selectedItem.forEach(e => e.isSelected = false);
        let indexToDeselect = -1;
        for (let index = 0; index < this.expressionsList.length; index++) {
            const expression = this.expressionsList[index].expression;
            if (expression.searchVal === null && !expression.condition.isUnary) {
                indexToDeselect = index;
            }
        }
        if (indexToDeselect !== -1) {
            this.removeExpression(indexToDeselect, this.expression);
        }
        this.resetExpression();
        this.scrollChipsWhenAddingExpression();
    }
    /**
     * Clears the value of the input.
     */
    clearInput(event) {
        event?.stopPropagation();
        this.value = null;
    }
    /**
     * Event handler for keydown on clear button.
     */
    onClearKeyDown(eventArgs) {
        if (this.platform.isActivationKey(eventArgs)) {
            eventArgs.preventDefault();
            this.clearInput();
            this.focusEditElement();
        }
    }
    /**
     * Event handler for click on clear button.
     */
    onClearClick() {
        this.clearInput();
        this.focusEditElement();
    }
    /**
     * Event handler for keydown on commit button.
     */
    onCommitKeyDown(eventArgs) {
        if (this.platform.isActivationKey(eventArgs)) {
            eventArgs.preventDefault();
            this.commitInput();
            this.focusEditElement();
        }
    }
    /**
     * Event handler for click on commit button.
     */
    onCommitClick(event) {
        event?.stopPropagation();
        this.commitInput();
        this.focusEditElement();
    }
    /**
     * Event handler for focusout on the input group.
     */
    onInputGroupFocusout() {
        if (!this.value && this.value !== 0 &&
            this.expression.condition && !this.expression.condition.isUnary) {
            return;
        }
        requestAnimationFrame(() => {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('igx-chip__remove') || focusedElement.tagName === 'IGX-DAY-ITEM') {
                return;
            }
            if (!(focusedElement && this.editorsContain(focusedElement))
                && this.dropDownConditions.collapsed) {
                this.commitInput();
            }
        });
    }
    /**
     * Closes the filtering edit row.
     */
    close() {
        if (this.expressionsList.length === 1 &&
            this.expressionsList[0].expression.searchVal === null &&
            this.expressionsList[0].expression.condition.isUnary === false) {
            this.filteringService.getExpressions(this.column.field).pop();
            this.filter();
        }
        else {
            const condToRemove = this.expressionsList.filter(ex => ex.expression.searchVal === null && !ex.expression.condition.isUnary);
            if (condToRemove && condToRemove.length > 0) {
                condToRemove.forEach(c => this.filteringService.removeExpression(this.column.field, this.expressionsList.indexOf(c)));
                this.filter();
            }
        }
        this.filteringService.isFilterRowVisible = false;
        this.filteringService.updateFilteringCell(this.column);
        this.filteringService.filteredColumn = null;
        this.filteringService.selectedExpression = null;
        this.filteringService.grid.theadRow.nativeElement.focus();
        this.chipAreaScrollOffset = 0;
        this.transform(this.chipAreaScrollOffset);
    }
    /**
     *  Event handler for date picker's selection.
     */
    onDateSelected(value) {
        this.value = value;
    }
    /** @hidden @internal */
    inputGroupPrefixClick(event) {
        event.stopPropagation();
        event.currentTarget.focus();
        this.toggleConditionsDropDown(event.currentTarget);
    }
    /**
     * Opens the conditions dropdown.
     */
    toggleConditionsDropDown(target) {
        this._conditionsOverlaySettings.target = target;
        this._conditionsOverlaySettings.excludeFromOutsideClick = [target];
        this.dropDownConditions.toggle(this._conditionsOverlaySettings);
    }
    /**
     * Opens the logic operators dropdown.
     */
    toggleOperatorsDropDown(eventArgs, index) {
        this._operatorsOverlaySettings.target = eventArgs.target.parentElement;
        this._operatorsOverlaySettings.excludeFromOutsideClick = [eventArgs.target.parentElement];
        this.dropDownOperators.toArray()[index].toggle(this._operatorsOverlaySettings);
    }
    /**
     * Event handler for change event in conditions dropdown.
     */
    onConditionsChanged(eventArgs) {
        const value = eventArgs.newSelection.value;
        this.expression.condition = this.getCondition(value);
        if (this.expression.condition.isUnary) {
            // update grid's filtering on the next cycle to ensure the drop-down is closed
            // if the drop-down is not closed this event handler will be invoked multiple times
            requestAnimationFrame(() => this.unaryConditionChangedCallback());
        }
        else {
            requestAnimationFrame(() => this.conditionChangedCallback());
        }
        // Add requestAnimationFrame because of an issue in IE, where you are still able to write in the input,
        // if it has been focused and then set to readonly.
        requestAnimationFrame(() => this.focusEditElement());
    }
    onChipPointerdown(args, chip) {
        const activeElement = document.activeElement;
        this._cancelChipClick = chip.selected
            && activeElement && this.editorsContain(activeElement);
    }
    onChipClick(args, item) {
        if (this._cancelChipClick) {
            this._cancelChipClick = false;
            return;
        }
        this.expressionsList.forEach(ex => ex.isSelected = false);
        this.toggleChip(item);
    }
    toggleChip(item) {
        item.isSelected = !item.isSelected;
        if (item.isSelected) {
            this.expression = item.expression;
            this.focusEditElement();
        }
    }
    /**
     * Event handler for chip keydown event.
     */
    onChipKeyDown(eventArgs, item) {
        if (eventArgs.key === this.platform.KEYMAP.ENTER) {
            eventArgs.preventDefault();
            this.toggleChip(item);
        }
    }
    /**
     * Scrolls the first chip into view if the tab key is pressed on the left arrow.
     */
    onLeftArrowKeyDown(event) {
        if (event.key === this.platform.KEYMAP.TAB) {
            this.chipAreaScrollOffset = 0;
            this.transform(this.chipAreaScrollOffset);
        }
    }
    /**
     * Event handler for chip removed event.
     */
    onChipRemoved(eventArgs, item) {
        const indexToRemove = this.expressionsList.indexOf(item);
        this.removeExpression(indexToRemove, item.expression);
        this.scrollChipsOnRemove();
    }
    /**
     * Event handler for logic operator changed event.
     */
    onLogicOperatorChanged(eventArgs, expression) {
        if (eventArgs.oldSelection) {
            expression.afterOperator = eventArgs.newSelection.value;
            this.expressionsList[this.expressionsList.indexOf(expression) + 1].beforeOperator = expression.afterOperator;
            // update grid's filtering on the next cycle to ensure the drop-down is closed
            // if the drop-down is not closed this event handler will be invoked multiple times
            requestAnimationFrame(() => this.filter());
        }
    }
    /**
     * Scrolls the chips into the chip area when left or right arrows are pressed.
     */
    scrollChipsOnArrowPress(arrowPosition) {
        let count = 0;
        const chipAraeChildren = this.chipsArea.element.nativeElement.children;
        const containerRect = this.container.nativeElement.getBoundingClientRect();
        if (arrowPosition === 'right') {
            for (const chip of chipAraeChildren) {
                if (Math.ceil(chip.getBoundingClientRect().right) < Math.ceil(containerRect.right)) {
                    count++;
                }
            }
            if (count < chipAraeChildren.length) {
                this.chipAreaScrollOffset -= Math.ceil(chipAraeChildren[count].getBoundingClientRect().right) -
                    Math.ceil(containerRect.right) + 1;
                this.transform(this.chipAreaScrollOffset);
            }
        }
        if (arrowPosition === 'left') {
            for (const chip of chipAraeChildren) {
                if (Math.ceil(chip.getBoundingClientRect().left) < Math.ceil(containerRect.left)) {
                    count++;
                }
            }
            if (count > 0) {
                this.chipAreaScrollOffset += Math.ceil(containerRect.left) -
                    Math.ceil(chipAraeChildren[count - 1].getBoundingClientRect().left) + 1;
                this.transform(this.chipAreaScrollOffset);
            }
        }
    }
    /**
     * @hidden
     * Resets the chips area
     * @memberof IgxGridFilteringRowComponent
     */
    resetChipsArea() {
        this.chipAreaScrollOffset = 0;
        this.transform(this.chipAreaScrollOffset);
        this.showHideArrowButtons();
    }
    /** @hidden @internal */
    focusEditElement() {
        if (this.input) {
            this.input.nativeElement.focus();
        }
        else if (this.picker) {
            this.picker.getEditElement().focus();
        }
    }
    ngOnDestroy() {
        this.$destroyer.next();
    }
    showHideArrowButtons() {
        requestAnimationFrame(() => {
            if (this.filteringService.isFilterRowVisible) {
                const containerWidth = this.container.nativeElement.getBoundingClientRect().width;
                this.chipsAreaWidth = this.chipsArea.element.nativeElement.getBoundingClientRect().width;
                this.showArrows = this.chipsAreaWidth >= containerWidth && this.isColumnFiltered;
                // TODO: revise the cdr.detectChanges() usage here
                if (!this.cdr.destroyed) {
                    this.cdr.detectChanges();
                }
            }
        });
    }
    addExpression(isSelected) {
        const exprUI = new ExpressionUI();
        exprUI.expression = this.expression;
        exprUI.beforeOperator = this.expressionsList.length > 0 ? FilteringLogic.And : null;
        exprUI.isSelected = isSelected;
        this.expressionsList.push(exprUI);
        const length = this.expressionsList.length;
        if (this.expressionsList[length - 2]) {
            this.expressionsList[length - 2].afterOperator = this.expressionsList[length - 1].beforeOperator;
        }
        this.showHideArrowButtons();
    }
    removeExpression(indexToRemove, expression) {
        if (indexToRemove === 0 && this.expressionsList.length === 1) {
            this.clearFiltering();
            return;
        }
        this.filteringService.removeExpression(this.column.field, indexToRemove);
        this.filter();
        if (this.expression === expression) {
            this.resetExpression();
        }
        this.showHideArrowButtons();
    }
    resetExpression() {
        this.expression = {
            fieldName: this.column.field,
            condition: null,
            searchVal: null,
            ignoreCase: this.column.filteringIgnoreCase
        };
        if (this.column.dataType !== GridColumnDataType.Boolean) {
            this.expression.condition = this.getCondition(this.conditions[0]);
        }
        if (this.column.dataType === GridColumnDataType.Date && this.input) {
            this.input.nativeElement.value = null;
        }
        this.showHideArrowButtons();
    }
    scrollChipsWhenAddingExpression() {
        const chipAraeChildren = this.chipsArea.element.nativeElement.children;
        if (!chipAraeChildren || chipAraeChildren.length === 0) {
            return;
        }
        const chipsContainerWidth = this.container.nativeElement.offsetWidth;
        const chipsAreaWidth = this.chipsArea.element.nativeElement.offsetWidth;
        if (chipsAreaWidth > chipsContainerWidth) {
            this.chipAreaScrollOffset = chipsContainerWidth - chipsAreaWidth;
            this.transform(this.chipAreaScrollOffset);
        }
    }
    transform(offset) {
        requestAnimationFrame(() => {
            this.chipsArea.element.nativeElement.style.transform = `translate(${offset}px)`;
        });
    }
    scrollChipsOnRemove() {
        let count = 0;
        const chipAraeChildren = this.chipsArea.element.nativeElement.children;
        const containerRect = this.container.nativeElement.getBoundingClientRect();
        for (const chip of chipAraeChildren) {
            if (Math.ceil(chip.getBoundingClientRect().right) < Math.ceil(containerRect.left)) {
                count++;
            }
        }
        if (count <= 2) {
            this.chipAreaScrollOffset = 0;
        }
        else {
            const dif = chipAraeChildren[count].id === 'chip' ? count - 2 : count - 1;
            this.chipAreaScrollOffset += Math.ceil(containerRect.left) - Math.ceil(chipAraeChildren[dif].getBoundingClientRect().left) + 1;
        }
        this.transform(this.chipAreaScrollOffset);
    }
    conditionChangedCallback() {
        if (!!this.expression.searchVal || this.expression.searchVal === 0) {
            this.filter();
        }
        else if (this.value) {
            this.value = null;
        }
    }
    unaryConditionChangedCallback() {
        if (this.value) {
            this.value = null;
        }
        if (this.expressionsList.find(item => item.expression === this.expression) === undefined) {
            this.addExpression(true);
        }
        this.filter();
    }
    filter() {
        this.filteringService.filterInternal(this.column.field);
    }
    editorsContain(child) {
        // if the first check is false and the second is undefined this will return undefined
        // make sure it always returns boolean
        return !!(this.inputGroup && this.inputGroup.nativeElement.contains(child)
            || this.picker && this.picker.element.nativeElement.contains(child));
    }
    get isColumnFiltered() {
        return this.column.filteringExpressionsTree && this.column.filteringExpressionsTree.filteringOperands.length > 0;
    }
    get isNarrowWidth() {
        return this.nativeElement.offsetWidth < this.NARROW_WIDTH_THRESHOLD;
    }
}
IgxGridFilteringRowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridFilteringRowComponent, deps: [{ token: i1.IgxFilteringService }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i2.PlatformUtil }], target: i0.ɵɵFactoryTarget.Component });
IgxGridFilteringRowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxGridFilteringRowComponent, selector: "igx-grid-filtering-row", inputs: { column: "column", value: "value" }, host: { listeners: { "keydown": "onKeydownHandler($event)" }, properties: { "class.igx-grid__filtering-row": "this.defaultCSSClass", "class.igx-grid__filtering-row--compact": "this.compactCSSClass", "class.igx-grid__filtering-row--cosy": "this.cosyCSSClass" } }, viewQueries: [{ propertyName: "defaultFilterUI", first: true, predicate: ["defaultFilterUI"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultDateUI", first: true, predicate: ["defaultDateUI"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultTimeUI", first: true, predicate: ["defaultTimeUI"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultDateTimeUI", first: true, predicate: ["defaultDateTimeUI"], descendants: true, read: TemplateRef, static: true }, { propertyName: "input", first: true, predicate: ["input"], descendants: true, read: ElementRef }, { propertyName: "dropDownConditions", first: true, predicate: ["inputGroupConditions"], descendants: true, read: IgxDropDownComponent, static: true }, { propertyName: "chipsArea", first: true, predicate: ["chipsArea"], descendants: true, read: IgxChipsAreaComponent, static: true }, { propertyName: "inputGroup", first: true, predicate: ["inputGroup"], descendants: true, read: ElementRef }, { propertyName: "picker", first: true, predicate: ["picker"], descendants: true }, { propertyName: "inputGroupPrefix", first: true, predicate: ["inputGroupPrefix"], descendants: true, read: ElementRef }, { propertyName: "container", first: true, predicate: ["container"], descendants: true, static: true }, { propertyName: "operand", first: true, predicate: ["operand"], descendants: true }, { propertyName: "closeButton", first: true, predicate: ["closeButton"], descendants: true, static: true }, { propertyName: "dropDownOperators", predicate: ["operators"], descendants: true, read: IgxDropDownComponent }], ngImport: i0, template: "<!-- Have to apply styles inline because of the overlay outlet ... -->\n<igx-drop-down #inputGroupConditions [displayDensity]=\"displayDensity\" [height]=\"'200px'\" (selectionChanging)=\"onConditionsChanged($event)\">\n    <igx-drop-down-item *ngFor=\"let condition of conditions\"\n        [value]=\"condition\"\n        [selected]=\"isConditionSelected(condition)\">\n        <div class=\"igx-grid__filtering-dropdown-items\">\n            <igx-icon family=\"imx-icons\" [name]=\"getCondition(condition).iconName\"></igx-icon>\n            <span class=\"igx-grid__filtering-dropdown-text\">{{ translateCondition(condition) }}</span>\n        </div>\n    </igx-drop-down-item>\n</igx-drop-down>\n\n<ng-template #defaultFilterUI>\n    <igx-input-group #inputGroup type=\"box\" [displayDensity]=\"displayDensity\" (focusout)=\"onInputGroupFocusout()\">\n        <igx-prefix #inputGroupPrefix\n                    (click)=\"inputGroupPrefixClick($event)\"\n                    (keydown)=\"onPrefixKeyDown($event)\"\n                    tabindex=\"0\"\n                    [igxDropDownItemNavigation]=\"inputGroupConditions\">\n            <igx-icon family=\"imx-icons\" [name]=\"getIconName()\"></igx-icon>\n        </igx-prefix>\n        <input\n            #input\n            igxInput\n            tabindex=\"0\"\n            [placeholder]=\"placeholder\"\n            autocomplete=\"off\"\n            [value]=\"value\"\n            (input)=\"onInput($event)\"\n            [type]=\"type\"\n            [readonly]=\"isUnaryCondition\"\n            (click)=\"onInputClick()\"\n            (compositionstart)=\"onCompositionStart()\"\n            (compositionend)=\"onCompositionEnd()\"\n            (keydown)=\"onInputKeyDown($event)\"\n            (keyup)=\"onInputKeyUp()\"/>\n            <igx-suffix *ngIf=\"value || value === 0\" >\n                <igx-icon (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick()\" tabindex=\"0\">done</igx-icon>\n                <igx-icon (keydown)=\"onClearKeyDown($event)\" (click)=\"onClearClick()\" tabindex=\"0\">clear</igx-icon>\n            </igx-suffix>\n    </igx-input-group>\n</ng-template>\n\n<ng-template #defaultDateUI>\n    <igx-date-picker #picker\n        [(value)]=\"value\"\n        [readOnly]=\"true\"\n        [outlet]=\"filteringService.grid.outlet\"\n        [locale]=\"filteringService.grid.locale\"\n        (click)=\"expression.condition.isUnary ? null : picker.open()\"\n        type=\"box\"\n        [displayFormat]=\"column.pipeArgs.format\"\n        [formatter]=\"column.formatter\"\n        [placeholder]=\"placeholder\"\n        [displayDensity]=\"displayDensity\"\n        (keydown)=\"onInputKeyDown($event)\"\n        (focusout)=\"onInputGroupFocusout()\"\n        (closed)=\"focusEditElement()\">\n        <igx-prefix #inputGroupPrefix\n            tabindex=\"0\"\n            (click)=\"inputGroupPrefixClick($event)\"\n            (keydown)=\"onPrefixKeyDown($event)\"\n            [igxDropDownItemNavigation]=\"inputGroupConditions\">\n            <igx-icon family=\"imx-icons\" [name]=\"expression.condition.iconName\"></igx-icon>\n        </igx-prefix>\n        <igx-suffix *ngIf=\"value\">\n            <igx-icon tabindex=\"0\" (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick($event)\">done</igx-icon>\n            <igx-icon tabindex=\"0\" (keydown)=\"onClearKeyDown($event)\" (click)=\"clearInput($event)\">clear</igx-icon>\n        </igx-suffix>\n        <!-- disable default icons -->\n        <igx-picker-toggle></igx-picker-toggle>\n        <igx-picker-clear></igx-picker-clear>\n    </igx-date-picker>\n</ng-template>\n\n<ng-template #defaultTimeUI>\n    <igx-time-picker #picker\n        [(value)]=\"value\"\n        [inputFormat]=\"column.defaultTimeFormat\"\n        [locale]=\"filteringService.grid.locale\"\n        [formatter]=\"column.formatter\"\n        [outlet]=\"filteringService.grid.outlet\"\n        [displayDensity]=\"displayDensity\"\n        type=\"box\"\n        [readOnly]=\"true\"\n        [placeholder]=\"placeholder\"\n        (closed)=\"focusEditElement()\"\n        (focusout)=\"onInputGroupFocusout()\"\n        (keydown)=\"onInputKeyDown($event)\"\n        (click)=\"expression.condition.isUnary ? null : picker.open()\">\n        <igx-prefix #inputGroupPrefix\n        tabindex=\"0\"\n        (click)=\"inputGroupPrefixClick($event)\"\n        (keydown)=\"onPrefixKeyDown($event)\"\n        [igxDropDownItemNavigation]=\"inputGroupConditions\">\n        <igx-icon family=\"imx-icons\" [name]=\"expression.condition.iconName\"></igx-icon>\n    </igx-prefix>\n    <igx-suffix *ngIf=\"value\">\n        <igx-icon tabindex=\"0\" (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick($event)\">done</igx-icon>\n        <igx-icon tabindex=\"0\" (keydown)=\"onClearKeyDown($event)\" (click)=\"clearInput($event)\">clear</igx-icon>\n    </igx-suffix>\n    <!-- disable default icons -->\n    <igx-picker-toggle></igx-picker-toggle>\n    <igx-picker-clear></igx-picker-clear>\n    </igx-time-picker>\n</ng-template>\n\n<ng-template #defaultDateTimeUI>\n    <igx-input-group #inputGroup type=\"box\" [displayDensity]=\"displayDensity\" (focusout)=\"onInputGroupFocusout()\">\n        <igx-prefix #inputGroupPrefix\n                    (click)=\"inputGroupPrefixClick($event)\"\n                    (keydown)=\"onPrefixKeyDown($event)\"\n                    tabindex=\"0\"\n                    [igxDropDownItemNavigation]=\"inputGroupConditions\">\n            <igx-icon family=\"imx-icons\" [name]=\"getIconName()\"></igx-icon>\n        </igx-prefix>\n        <input\n            #input\n            igxInput\n            tabindex=\"0\"\n            [placeholder]=\"placeholder\"\n            [igxDateTimeEditor]=\"column.defaultDateTimeFormat\"\n            [value]=\"value\"\n            (valueChange)=\"onInput($event)\"\n            [readonly]=\"isUnaryCondition\"\n            (click)=\"onInputClick()\"\n            (keydown)=\"onInputKeyDown($event)\"\n            (keyup)=\"onInputKeyUp()\"/>\n            <igx-suffix *ngIf=\"value || value === 0\" >\n                <igx-icon (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick()\" tabindex=\"0\">done</igx-icon>\n                <igx-icon (keydown)=\"onClearKeyDown($event)\" (click)=\"onClearClick()\" tabindex=\"0\">clear</igx-icon>\n            </igx-suffix>\n    </igx-input-group>\n</ng-template>\n\n<ng-container *ngTemplateOutlet=\"template; context: { $implicit: this }\"></ng-container>\n\n<button igxButton=\"icon\" class=\"igx-grid__filtering-row-scroll-start\" *ngIf=\"showArrows\" (keydown)=\"onLeftArrowKeyDown($event)\" (click)=\"scrollChipsOnArrowPress('left')\">\n    <igx-icon>navigate_before</igx-icon>\n</button>\n\n<div #container class=\"igx-grid__filtering-row-main\">\n    <div>\n         <igx-chips-area #chipsArea>\n            <ng-container *ngFor=\"let item of expressionsList; index as i; let last = last;\" tabindex=\"0\">\n                <igx-chip #chip id='chip'\n                    (pointerdown)=\"onChipPointerdown($event, chip)\"\n                    (click)=\"onChipClick($event, item)\"\n                    (keydown)=\"onChipKeyDown($event, item)\"\n                    (remove)=\"onChipRemoved($event, item)\"\n                    [selectable]=\"false\"\n                    [selected]=\"item.isSelected\"\n                    [displayDensity]=\"displayDensity\"\n                    [removable]=\"true\">\n                    <igx-icon\n                        igxPrefix\n                        family=\"imx-icons\"\n                        [name]=\"item.expression.condition.iconName\">\n                    </igx-icon>\n                    <span>{{filteringService.getChipLabel(item.expression)}}</span>\n                </igx-chip>\n\n                <span id='operand' *ngIf=\"!last\">\n                    <button igxButton (click)=\"toggleOperatorsDropDown($event, i)\" [igxDropDownItemNavigation]=\"operators\" [displayDensity]=\"column.grid.displayDensity\">\n                        <igx-icon>expand_more</igx-icon>\n                        <span>{{filteringService.getOperatorAsString(item.afterOperator)}}</span>\n                    </button>\n                    <igx-drop-down [displayDensity]=\"column.grid.displayDensity\" #operators (selectionChanging)=\"onLogicOperatorChanged($event, item)\">\n                            <igx-drop-down-item [value]=\"0\" [selected]=\"item.afterOperator === 0\">{{filteringService.grid.resourceStrings.igx_grid_filter_operator_and}}</igx-drop-down-item>\n                            <igx-drop-down-item [value]=\"1\" [selected]=\"item.afterOperator === 1\">{{filteringService.grid.resourceStrings.igx_grid_filter_operator_or}}</igx-drop-down-item>\n                    </igx-drop-down>\n                </span>\n            </ng-container>\n        </igx-chips-area>\n    </div>\n</div>\n\n<button igxButton=\"icon\" class=\"igx-grid__filtering-row-scroll-end\" *ngIf=\"showArrows\" (click)=\"scrollChipsOnArrowPress('right')\">\n    <igx-icon>navigate_next</igx-icon>\n</button>\n\n<div #buttonsContainer [ngClass]=\"isNarrowWidth ? 'igx-grid__filtering-row-editing-buttons--small' : 'igx-grid__filtering-row-editing-buttons'\">\n    <button [displayDensity]=\"column.grid.displayDensity\" [igxButton]=\"isNarrowWidth ? 'icon' : 'flat'\" igxRipple (click)=\"clearFiltering()\" [disabled]=\"disabled\" [tabindex]=\"disabled\">\n        <igx-icon>refresh</igx-icon>\n        <span>{{isNarrowWidth ? '' : filteringService.grid.resourceStrings.igx_grid_filter_row_reset}}</span>\n    </button>\n    <button #closeButton [displayDensity]=\"column.grid.displayDensity\" [igxButton]=\"isNarrowWidth ? 'icon' : 'flat'\"  igxRipple (click)=\"close()\">\n        <igx-icon>close</igx-icon>\n        <span>{{isNarrowWidth ? '' : filteringService.grid.resourceStrings.igx_grid_filter_row_close}}</span>\n    </button>\n</div>\n", components: [{ type: i3.IgxDropDownComponent, selector: "igx-drop-down", inputs: ["allowItemsFocus"], outputs: ["opening", "opened", "closing", "closed"] }, { type: i4.IgxDropDownItemComponent, selector: "igx-drop-down-item" }, { type: i5.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i6.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i7.IgxDatePickerComponent, selector: "igx-date-picker", inputs: ["weekStart", "hideOutsideDays", "displayMonthsCount", "showWeekNumbers", "formatter", "headerOrientation", "todayButtonLabel", "cancelButtonLabel", "spinLoop", "spinDelta", "outlet", "id", "formatViews", "disabledDates", "specialDates", "calendarFormat", "value", "minValue", "maxValue", "resourceStrings", "readOnly"], outputs: ["valueChange", "validationFailed"] }, { type: i8.IgxPickerToggleComponent, selector: "igx-picker-toggle", outputs: ["clicked"] }, { type: i8.IgxPickerClearComponent, selector: "igx-picker-clear" }, { type: i9.IgxTimePickerComponent, selector: "igx-time-picker", inputs: ["id", "displayFormat", "inputFormat", "mode", "minValue", "maxValue", "spinLoop", "formatter", "headerOrientation", "readOnly", "value", "resourceStrings", "okButtonLabel", "cancelButtonLabel", "itemsDelta"], outputs: ["selected", "valueChange", "validationFailed"] }, { type: i10.IgxChipsAreaComponent, selector: "igx-chips-area", inputs: ["class", "width", "height"], outputs: ["reorder", "selectionChange", "moveStart", "moveEnd"] }, { type: i11.IgxChipComponent, selector: "igx-chip", inputs: ["id", "tabIndex", "data", "draggable", "animateOnRelease", "hideBaseOnDrag", "removable", "removeIcon", "selectable", "selectIcon", "class", "disabled", "selected", "color", "resourceStrings"], outputs: ["selectedChange", "moveStart", "moveEnd", "remove", "chipClick", "selectedChanging", "selectedChanged", "keyDown", "dragEnter", "dragLeave", "dragOver", "dragDrop"] }], directives: [{ type: i12.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i13.IgxPrefixDirective, selector: "igx-prefix,[igxPrefix]" }, { type: i14.IgxDropDownItemNavigationDirective, selector: "[igxDropDownItemNavigation]", inputs: ["igxDropDownItemNavigation"] }, { type: i15.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i16.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }, { type: i17.IgxDateTimeEditorDirective, selector: "[igxDateTimeEditor]", inputs: ["locale", "minValue", "maxValue", "spinLoop", "displayFormat", "igxDateTimeEditor", "value", "spinDelta"], outputs: ["valueChange", "validationFailed"], exportAs: ["igxDateTimeEditor"] }, { type: i12.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i18.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i12.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i19.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxGridFilteringRowComponent, decorators: [{
            type: Component,
            args: [{ changeDetection: ChangeDetectionStrategy.OnPush, selector: 'igx-grid-filtering-row', template: "<!-- Have to apply styles inline because of the overlay outlet ... -->\n<igx-drop-down #inputGroupConditions [displayDensity]=\"displayDensity\" [height]=\"'200px'\" (selectionChanging)=\"onConditionsChanged($event)\">\n    <igx-drop-down-item *ngFor=\"let condition of conditions\"\n        [value]=\"condition\"\n        [selected]=\"isConditionSelected(condition)\">\n        <div class=\"igx-grid__filtering-dropdown-items\">\n            <igx-icon family=\"imx-icons\" [name]=\"getCondition(condition).iconName\"></igx-icon>\n            <span class=\"igx-grid__filtering-dropdown-text\">{{ translateCondition(condition) }}</span>\n        </div>\n    </igx-drop-down-item>\n</igx-drop-down>\n\n<ng-template #defaultFilterUI>\n    <igx-input-group #inputGroup type=\"box\" [displayDensity]=\"displayDensity\" (focusout)=\"onInputGroupFocusout()\">\n        <igx-prefix #inputGroupPrefix\n                    (click)=\"inputGroupPrefixClick($event)\"\n                    (keydown)=\"onPrefixKeyDown($event)\"\n                    tabindex=\"0\"\n                    [igxDropDownItemNavigation]=\"inputGroupConditions\">\n            <igx-icon family=\"imx-icons\" [name]=\"getIconName()\"></igx-icon>\n        </igx-prefix>\n        <input\n            #input\n            igxInput\n            tabindex=\"0\"\n            [placeholder]=\"placeholder\"\n            autocomplete=\"off\"\n            [value]=\"value\"\n            (input)=\"onInput($event)\"\n            [type]=\"type\"\n            [readonly]=\"isUnaryCondition\"\n            (click)=\"onInputClick()\"\n            (compositionstart)=\"onCompositionStart()\"\n            (compositionend)=\"onCompositionEnd()\"\n            (keydown)=\"onInputKeyDown($event)\"\n            (keyup)=\"onInputKeyUp()\"/>\n            <igx-suffix *ngIf=\"value || value === 0\" >\n                <igx-icon (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick()\" tabindex=\"0\">done</igx-icon>\n                <igx-icon (keydown)=\"onClearKeyDown($event)\" (click)=\"onClearClick()\" tabindex=\"0\">clear</igx-icon>\n            </igx-suffix>\n    </igx-input-group>\n</ng-template>\n\n<ng-template #defaultDateUI>\n    <igx-date-picker #picker\n        [(value)]=\"value\"\n        [readOnly]=\"true\"\n        [outlet]=\"filteringService.grid.outlet\"\n        [locale]=\"filteringService.grid.locale\"\n        (click)=\"expression.condition.isUnary ? null : picker.open()\"\n        type=\"box\"\n        [displayFormat]=\"column.pipeArgs.format\"\n        [formatter]=\"column.formatter\"\n        [placeholder]=\"placeholder\"\n        [displayDensity]=\"displayDensity\"\n        (keydown)=\"onInputKeyDown($event)\"\n        (focusout)=\"onInputGroupFocusout()\"\n        (closed)=\"focusEditElement()\">\n        <igx-prefix #inputGroupPrefix\n            tabindex=\"0\"\n            (click)=\"inputGroupPrefixClick($event)\"\n            (keydown)=\"onPrefixKeyDown($event)\"\n            [igxDropDownItemNavigation]=\"inputGroupConditions\">\n            <igx-icon family=\"imx-icons\" [name]=\"expression.condition.iconName\"></igx-icon>\n        </igx-prefix>\n        <igx-suffix *ngIf=\"value\">\n            <igx-icon tabindex=\"0\" (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick($event)\">done</igx-icon>\n            <igx-icon tabindex=\"0\" (keydown)=\"onClearKeyDown($event)\" (click)=\"clearInput($event)\">clear</igx-icon>\n        </igx-suffix>\n        <!-- disable default icons -->\n        <igx-picker-toggle></igx-picker-toggle>\n        <igx-picker-clear></igx-picker-clear>\n    </igx-date-picker>\n</ng-template>\n\n<ng-template #defaultTimeUI>\n    <igx-time-picker #picker\n        [(value)]=\"value\"\n        [inputFormat]=\"column.defaultTimeFormat\"\n        [locale]=\"filteringService.grid.locale\"\n        [formatter]=\"column.formatter\"\n        [outlet]=\"filteringService.grid.outlet\"\n        [displayDensity]=\"displayDensity\"\n        type=\"box\"\n        [readOnly]=\"true\"\n        [placeholder]=\"placeholder\"\n        (closed)=\"focusEditElement()\"\n        (focusout)=\"onInputGroupFocusout()\"\n        (keydown)=\"onInputKeyDown($event)\"\n        (click)=\"expression.condition.isUnary ? null : picker.open()\">\n        <igx-prefix #inputGroupPrefix\n        tabindex=\"0\"\n        (click)=\"inputGroupPrefixClick($event)\"\n        (keydown)=\"onPrefixKeyDown($event)\"\n        [igxDropDownItemNavigation]=\"inputGroupConditions\">\n        <igx-icon family=\"imx-icons\" [name]=\"expression.condition.iconName\"></igx-icon>\n    </igx-prefix>\n    <igx-suffix *ngIf=\"value\">\n        <igx-icon tabindex=\"0\" (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick($event)\">done</igx-icon>\n        <igx-icon tabindex=\"0\" (keydown)=\"onClearKeyDown($event)\" (click)=\"clearInput($event)\">clear</igx-icon>\n    </igx-suffix>\n    <!-- disable default icons -->\n    <igx-picker-toggle></igx-picker-toggle>\n    <igx-picker-clear></igx-picker-clear>\n    </igx-time-picker>\n</ng-template>\n\n<ng-template #defaultDateTimeUI>\n    <igx-input-group #inputGroup type=\"box\" [displayDensity]=\"displayDensity\" (focusout)=\"onInputGroupFocusout()\">\n        <igx-prefix #inputGroupPrefix\n                    (click)=\"inputGroupPrefixClick($event)\"\n                    (keydown)=\"onPrefixKeyDown($event)\"\n                    tabindex=\"0\"\n                    [igxDropDownItemNavigation]=\"inputGroupConditions\">\n            <igx-icon family=\"imx-icons\" [name]=\"getIconName()\"></igx-icon>\n        </igx-prefix>\n        <input\n            #input\n            igxInput\n            tabindex=\"0\"\n            [placeholder]=\"placeholder\"\n            [igxDateTimeEditor]=\"column.defaultDateTimeFormat\"\n            [value]=\"value\"\n            (valueChange)=\"onInput($event)\"\n            [readonly]=\"isUnaryCondition\"\n            (click)=\"onInputClick()\"\n            (keydown)=\"onInputKeyDown($event)\"\n            (keyup)=\"onInputKeyUp()\"/>\n            <igx-suffix *ngIf=\"value || value === 0\" >\n                <igx-icon (keydown)=\"onCommitKeyDown($event)\" (click)=\"onCommitClick()\" tabindex=\"0\">done</igx-icon>\n                <igx-icon (keydown)=\"onClearKeyDown($event)\" (click)=\"onClearClick()\" tabindex=\"0\">clear</igx-icon>\n            </igx-suffix>\n    </igx-input-group>\n</ng-template>\n\n<ng-container *ngTemplateOutlet=\"template; context: { $implicit: this }\"></ng-container>\n\n<button igxButton=\"icon\" class=\"igx-grid__filtering-row-scroll-start\" *ngIf=\"showArrows\" (keydown)=\"onLeftArrowKeyDown($event)\" (click)=\"scrollChipsOnArrowPress('left')\">\n    <igx-icon>navigate_before</igx-icon>\n</button>\n\n<div #container class=\"igx-grid__filtering-row-main\">\n    <div>\n         <igx-chips-area #chipsArea>\n            <ng-container *ngFor=\"let item of expressionsList; index as i; let last = last;\" tabindex=\"0\">\n                <igx-chip #chip id='chip'\n                    (pointerdown)=\"onChipPointerdown($event, chip)\"\n                    (click)=\"onChipClick($event, item)\"\n                    (keydown)=\"onChipKeyDown($event, item)\"\n                    (remove)=\"onChipRemoved($event, item)\"\n                    [selectable]=\"false\"\n                    [selected]=\"item.isSelected\"\n                    [displayDensity]=\"displayDensity\"\n                    [removable]=\"true\">\n                    <igx-icon\n                        igxPrefix\n                        family=\"imx-icons\"\n                        [name]=\"item.expression.condition.iconName\">\n                    </igx-icon>\n                    <span>{{filteringService.getChipLabel(item.expression)}}</span>\n                </igx-chip>\n\n                <span id='operand' *ngIf=\"!last\">\n                    <button igxButton (click)=\"toggleOperatorsDropDown($event, i)\" [igxDropDownItemNavigation]=\"operators\" [displayDensity]=\"column.grid.displayDensity\">\n                        <igx-icon>expand_more</igx-icon>\n                        <span>{{filteringService.getOperatorAsString(item.afterOperator)}}</span>\n                    </button>\n                    <igx-drop-down [displayDensity]=\"column.grid.displayDensity\" #operators (selectionChanging)=\"onLogicOperatorChanged($event, item)\">\n                            <igx-drop-down-item [value]=\"0\" [selected]=\"item.afterOperator === 0\">{{filteringService.grid.resourceStrings.igx_grid_filter_operator_and}}</igx-drop-down-item>\n                            <igx-drop-down-item [value]=\"1\" [selected]=\"item.afterOperator === 1\">{{filteringService.grid.resourceStrings.igx_grid_filter_operator_or}}</igx-drop-down-item>\n                    </igx-drop-down>\n                </span>\n            </ng-container>\n        </igx-chips-area>\n    </div>\n</div>\n\n<button igxButton=\"icon\" class=\"igx-grid__filtering-row-scroll-end\" *ngIf=\"showArrows\" (click)=\"scrollChipsOnArrowPress('right')\">\n    <igx-icon>navigate_next</igx-icon>\n</button>\n\n<div #buttonsContainer [ngClass]=\"isNarrowWidth ? 'igx-grid__filtering-row-editing-buttons--small' : 'igx-grid__filtering-row-editing-buttons'\">\n    <button [displayDensity]=\"column.grid.displayDensity\" [igxButton]=\"isNarrowWidth ? 'icon' : 'flat'\" igxRipple (click)=\"clearFiltering()\" [disabled]=\"disabled\" [tabindex]=\"disabled\">\n        <igx-icon>refresh</igx-icon>\n        <span>{{isNarrowWidth ? '' : filteringService.grid.resourceStrings.igx_grid_filter_row_reset}}</span>\n    </button>\n    <button #closeButton [displayDensity]=\"column.grid.displayDensity\" [igxButton]=\"isNarrowWidth ? 'icon' : 'flat'\"  igxRipple (click)=\"close()\">\n        <igx-icon>close</igx-icon>\n        <span>{{isNarrowWidth ? '' : filteringService.grid.resourceStrings.igx_grid_filter_row_close}}</span>\n    </button>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.IgxFilteringService }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i2.PlatformUtil }]; }, propDecorators: { column: [{
                type: Input
            }], value: [{
                type: Input
            }], defaultCSSClass: [{
                type: HostBinding,
                args: ['class.igx-grid__filtering-row']
            }], compactCSSClass: [{
                type: HostBinding,
                args: ['class.igx-grid__filtering-row--compact']
            }], cosyCSSClass: [{
                type: HostBinding,
                args: ['class.igx-grid__filtering-row--cosy']
            }], defaultFilterUI: [{
                type: ViewChild,
                args: ['defaultFilterUI', { read: TemplateRef, static: true }]
            }], defaultDateUI: [{
                type: ViewChild,
                args: ['defaultDateUI', { read: TemplateRef, static: true }]
            }], defaultTimeUI: [{
                type: ViewChild,
                args: ['defaultTimeUI', { read: TemplateRef, static: true }]
            }], defaultDateTimeUI: [{
                type: ViewChild,
                args: ['defaultDateTimeUI', { read: TemplateRef, static: true }]
            }], input: [{
                type: ViewChild,
                args: ['input', { read: ElementRef }]
            }], dropDownConditions: [{
                type: ViewChild,
                args: ['inputGroupConditions', { read: IgxDropDownComponent, static: true }]
            }], chipsArea: [{
                type: ViewChild,
                args: ['chipsArea', { read: IgxChipsAreaComponent, static: true }]
            }], dropDownOperators: [{
                type: ViewChildren,
                args: ['operators', { read: IgxDropDownComponent }]
            }], inputGroup: [{
                type: ViewChild,
                args: ['inputGroup', { read: ElementRef }]
            }], picker: [{
                type: ViewChild,
                args: ['picker']
            }], inputGroupPrefix: [{
                type: ViewChild,
                args: ['inputGroupPrefix', { read: ElementRef }]
            }], container: [{
                type: ViewChild,
                args: ['container', { static: true }]
            }], operand: [{
                type: ViewChild,
                args: ['operand']
            }], closeButton: [{
                type: ViewChild,
                args: ['closeButton', { static: true }]
            }], onKeydownHandler: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1maWx0ZXJpbmctcm93LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9maWx0ZXJpbmcvYmFzZS9ncmlkLWZpbHRlcmluZy1yb3cuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2dyaWRzL2ZpbHRlcmluZy9iYXNlL2dyaWQtZmlsdGVyaW5nLXJvdy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0gsU0FBUyxFQUNULEtBQUssRUFDTCxXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFFWixVQUFVLEVBQ1YsV0FBVyxFQUNYLHVCQUF1QixFQUV2QixZQUFZLEVBRWYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxvQkFBb0IsRUFBdUIsTUFBTSwrQkFBK0IsQ0FBQztBQUUxRixPQUFPLEVBQUUsY0FBYyxFQUF3QixNQUFNLHlEQUF5RCxDQUFDO0FBQy9HLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBbUIsTUFBTSxxQ0FBcUMsQ0FBQztBQUM5RyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUNqSCxPQUFPLEVBQXNCLHFCQUFxQixFQUFvQixNQUFNLDJCQUEyQixDQUFDO0FBR3hHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUc5RCxPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVB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RUFBRSxvQkFBb0IsRUFBRTtnQkFJL0MsVUFBVTtzQkFEbkIsU0FBUzt1QkFBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUluQyxNQUFNO3NCQURmLFNBQVM7dUJBQUMsUUFBUTtnQkFJVCxnQkFBZ0I7c0JBRHpCLFNBQVM7dUJBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUl6QyxTQUFTO3NCQURsQixTQUFTO3VCQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBSTlCLE9BQU87c0JBRGhCLFNBQVM7dUJBQUMsU0FBUztnQkFJVixXQUFXO3NCQURwQixTQUFTO3VCQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBa0RuQyxnQkFBZ0I7c0JBRHRCLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0NoaWxkcmVuLFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIFZpZXdSZWYsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyaWRDb2x1bW5EYXRhVHlwZSwgRGF0YVV0aWwgfSBmcm9tICcuLi8uLi8uLi9kYXRhLW9wZXJhdGlvbnMvZGF0YS11dGlsJztcbmltcG9ydCB7IElneERyb3BEb3duQ29tcG9uZW50LCBJU2VsZWN0aW9uRXZlbnRBcmdzIH0gZnJvbSAnLi4vLi4vLi4vZHJvcC1kb3duL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSUZpbHRlcmluZ09wZXJhdGlvbiB9IGZyb20gJy4uLy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctY29uZGl0aW9uJztcbmltcG9ydCB7IEZpbHRlcmluZ0xvZ2ljLCBJRmlsdGVyaW5nRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uLy4uL2RhdGEtb3BlcmF0aW9ucy9maWx0ZXJpbmctZXhwcmVzc2lvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSG9yaXpvbnRhbEFsaWdubWVudCwgVmVydGljYWxBbGlnbm1lbnQsIE92ZXJsYXlTZXR0aW5ncyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL292ZXJsYXkvdXRpbGl0aWVzJztcbmltcG9ydCB7IENvbm5lY3RlZFBvc2l0aW9uaW5nU3RyYXRlZ3kgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9vdmVybGF5L3Bvc2l0aW9uL2Nvbm5lY3RlZC1wb3NpdGlvbmluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBJQmFzZUNoaXBFdmVudEFyZ3MsIElneENoaXBzQXJlYUNvbXBvbmVudCwgSWd4Q2hpcENvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2NoaXBzL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4RHJvcERvd25JdGVtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vZHJvcC1kb3duL2Ryb3AtZG93bi1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hGaWx0ZXJpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vZ3JpZC1maWx0ZXJpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBBYnNvbHV0ZVNjcm9sbFN0cmF0ZWd5IH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvb3ZlcmxheS9zY3JvbGwnO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHkgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IElneERhdGVQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4VGltZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL3RpbWUtcGlja2VyL3RpbWUtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBpc0VxdWFsLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEV4cHJlc3Npb25VSSB9IGZyb20gJy4uL2V4Y2VsLXN0eWxlL2NvbW1vbic7XG5pbXBvcnQgeyBDb2x1bW5UeXBlIH0gZnJvbSAnLi4vLi4vY29tbW9uL2dyaWQuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHNlbGVjdG9yOiAnaWd4LWdyaWQtZmlsdGVyaW5nLXJvdycsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2dyaWQtZmlsdGVyaW5nLXJvdy5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4R3JpZEZpbHRlcmluZ1Jvd0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGNvbHVtbigpOiBDb2x1bW5UeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbHVtbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGNvbHVtbih2YWwpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbHVtbikge1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uc0xpc3QuZm9yRWFjaChleHAgPT4gZXhwLmlzU2VsZWN0ZWQgPSBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uID0gdmFsO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25zTGlzdCA9IHRoaXMuZmlsdGVyaW5nU2VydmljZS5nZXRFeHByZXNzaW9ucyh0aGlzLl9jb2x1bW4uZmllbGQpO1xuICAgICAgICAgICAgdGhpcy5yZXNldEV4cHJlc3Npb24oKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlwQXJlYVNjcm9sbE9mZnNldCA9IDA7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSh0aGlzLmNoaXBBcmVhU2Nyb2xsT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5leHByZXNzaW9uID8gdGhpcy5leHByZXNzaW9uLnNlYXJjaFZhbCA6IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWwpIHtcbiAgICAgICAgaWYgKCF2YWwgJiYgdmFsICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb24uc2VhcmNoVmFsID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5leHByZXNzaW9uc0xpc3QuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5leHByZXNzaW9uID09PSB0aGlzLmV4cHJlc3Npb24pO1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwICYmIHRoaXMuZXhwcmVzc2lvbnNMaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5jbGVhckZpbHRlcih0aGlzLmNvbHVtbi5maWVsZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uLmNvbmRpdGlvbi5pc1VuYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLmV4cHJlc3Npb24uc2VhcmNoVmFsO1xuICAgICAgICAgICAgaWYgKGlzRXF1YWwob2xkVmFsdWUsIHZhbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbi5zZWFyY2hWYWwgPSBEYXRhVXRpbC5wYXJzZVZhbHVlKHRoaXMuY29sdW1uLmRhdGFUeXBlLCB2YWwpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbnNMaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmV4cHJlc3Npb24gPT09IHRoaXMuZXhwcmVzc2lvbikgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcmVzc2lvbih0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsdGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGRpc3BsYXlEZW5zaXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uZ3JpZC5kaXNwbGF5RGVuc2l0eSA9PT0gRGlzcGxheURlbnNpdHkuY29tZm9ydGFibGUgPyBEaXNwbGF5RGVuc2l0eS5jb3N5IDogdGhpcy5jb2x1bW4uZ3JpZC5kaXNwbGF5RGVuc2l0eTtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX19maWx0ZXJpbmctcm93JylcbiAgICBwdWJsaWMgZGVmYXVsdENTU0NsYXNzID0gdHJ1ZTtcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWdyaWRfX2ZpbHRlcmluZy1yb3ctLWNvbXBhY3QnKVxuICAgIHB1YmxpYyBnZXQgY29tcGFjdENTU0NsYXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uZ3JpZC5kaXNwbGF5RGVuc2l0eSA9PT0gRGlzcGxheURlbnNpdHkuY29tcGFjdDtcbiAgICB9XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1ncmlkX19maWx0ZXJpbmctcm93LS1jb3N5JylcbiAgICBwdWJsaWMgZ2V0IGNvc3lDU1NDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmdyaWQuZGlzcGxheURlbnNpdHkgPT09IERpc3BsYXlEZW5zaXR5LmNvc3k7XG4gICAgfVxuXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdEZpbHRlclVJJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRGaWx0ZXJVSTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHREYXRlVUknLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdERhdGVVSTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRUaW1lVUknLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdFRpbWVVSTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHREYXRlVGltZVVJJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHREYXRlVGltZVVJOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcbiAgICBwcm90ZWN0ZWQgaW5wdXQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgICBAVmlld0NoaWxkKCdpbnB1dEdyb3VwQ29uZGl0aW9ucycsIHsgcmVhZDogSWd4RHJvcERvd25Db21wb25lbnQsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBkcm9wRG93bkNvbmRpdGlvbnM6IElneERyb3BEb3duQ29tcG9uZW50O1xuXG4gICAgQFZpZXdDaGlsZCgnY2hpcHNBcmVhJywgeyByZWFkOiBJZ3hDaGlwc0FyZWFDb21wb25lbnQsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBjaGlwc0FyZWE6IElneENoaXBzQXJlYUNvbXBvbmVudDtcblxuICAgIEBWaWV3Q2hpbGRyZW4oJ29wZXJhdG9ycycsIHsgcmVhZDogSWd4RHJvcERvd25Db21wb25lbnQgfSlcbiAgICBwcm90ZWN0ZWQgZHJvcERvd25PcGVyYXRvcnM6IFF1ZXJ5TGlzdDxJZ3hEcm9wRG93bkNvbXBvbmVudD47XG5cbiAgICBAVmlld0NoaWxkKCdpbnB1dEdyb3VwJywgeyByZWFkOiBFbGVtZW50UmVmIH0pXG4gICAgcHJvdGVjdGVkIGlucHV0R3JvdXA6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgQFZpZXdDaGlsZCgncGlja2VyJylcbiAgICBwcm90ZWN0ZWQgcGlja2VyOiBJZ3hEYXRlUGlja2VyQ29tcG9uZW50IHwgSWd4VGltZVBpY2tlckNvbXBvbmVudDtcblxuICAgIEBWaWV3Q2hpbGQoJ2lucHV0R3JvdXBQcmVmaXgnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcbiAgICBwcm90ZWN0ZWQgaW5wdXRHcm91cFByZWZpeDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBjb250YWluZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgQFZpZXdDaGlsZCgnb3BlcmFuZCcpXG4gICAgcHJvdGVjdGVkIG9wZXJhbmQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgQFZpZXdDaGlsZCgnY2xvc2VCdXR0b24nLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBjbG9zZUJ1dHRvbjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICBwdWJsaWMgZ2V0IG5hdGl2ZUVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93QXJyb3dzOiBib29sZWFuO1xuICAgIHB1YmxpYyBleHByZXNzaW9uOiBJRmlsdGVyaW5nRXhwcmVzc2lvbjtcbiAgICBwdWJsaWMgZXhwcmVzc2lvbnNMaXN0OiBBcnJheTxFeHByZXNzaW9uVUk+O1xuXG4gICAgcHJpdmF0ZSBfcG9zaXRpb25TZXR0aW5ncyA9IHtcbiAgICAgICAgaG9yaXpvbnRhbFN0YXJ0UG9pbnQ6IEhvcml6b250YWxBbGlnbm1lbnQuTGVmdCxcbiAgICAgICAgdmVydGljYWxTdGFydFBvaW50OiBWZXJ0aWNhbEFsaWdubWVudC5Cb3R0b21cbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfY29uZGl0aW9uc092ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0ge1xuICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiBuZXcgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBuZXcgQ29ubmVjdGVkUG9zaXRpb25pbmdTdHJhdGVneSh0aGlzLl9wb3NpdGlvblNldHRpbmdzKVxuICAgIH07XG5cbiAgICBwcml2YXRlIF9vcGVyYXRvcnNPdmVybGF5U2V0dGluZ3M6IE92ZXJsYXlTZXR0aW5ncyA9IHtcbiAgICAgICAgY2xvc2VPbk91dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgbW9kYWw6IGZhbHNlLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogbmV3IEFic29sdXRlU2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneTogbmV3IENvbm5lY3RlZFBvc2l0aW9uaW5nU3RyYXRlZ3kodGhpcy5fcG9zaXRpb25TZXR0aW5ncylcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBjaGlwc0FyZWFXaWR0aDogbnVtYmVyO1xuICAgIHByaXZhdGUgY2hpcEFyZWFTY3JvbGxPZmZzZXQgPSAwO1xuICAgIHByaXZhdGUgX2NvbHVtbiA9IG51bGw7XG4gICAgcHJpdmF0ZSBpc0tleVByZXNzZWQgPSBmYWxzZTtcbiAgICBwcml2YXRlIGlzQ29tcG9zaW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfY2FuY2VsQ2hpcENsaWNrID0gZmFsc2U7XG5cbiAgICAvKiogc3dpdGNoIHRvIGljb24gYnV0dG9ucyB3aGVuIHdpZHRoIGlzIGJlbG93IDQzMnB4ICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBOQVJST1dfV0lEVEhfVEhSRVNIT0xEID0gNDMyO1xuXG4gICAgcHJpdmF0ZSAkZGVzdHJveWVyID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZmlsdGVyaW5nU2VydmljZTogSWd4RmlsdGVyaW5nU2VydmljZSxcbiAgICAgICAgcHVibGljIHJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbFxuICAgICkgeyB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25LZXlkb3duSGFuZGxlcihldnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucGxhdGZvcm0uaXNGaWx0ZXJpbmdLZXlDb21ibyhldnQpKSB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuX2NvbmRpdGlvbnNPdmVybGF5U2V0dGluZ3Mub3V0bGV0ID0gdGhpcy5jb2x1bW4uZ3JpZC5vdXRsZXQ7XG4gICAgICAgIHRoaXMuX29wZXJhdG9yc092ZXJsYXlTZXR0aW5ncy5vdXRsZXQgPSB0aGlzLmNvbHVtbi5ncmlkLm91dGxldDtcblxuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLmV4cHJlc3Npb25zTGlzdC5maW5kKGV4cHIgPT4gZXhwci5pc1NlbGVjdGVkID09PSB0cnVlKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gc2VsZWN0ZWRJdGVtLmV4cHJlc3Npb247XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZ3JpZC5sb2NhbGVDaGFuZ2VcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuJGRlc3Ryb3llcikpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmZvY3VzRWRpdEVsZW1lbnQoKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEodGhpcy5jb2x1bW4uZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlICYmIHRoaXMuY29sdW1uLmZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZS5maWx0ZXJpbmdPcGVyYW5kcy5sZW5ndGggPiAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW4uZGF0YVR5cGUgPT09IEdyaWRDb2x1bW5EYXRhVHlwZS5EYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0RGF0ZVVJO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLlRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRUaW1lVUk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29sdW1uLmRhdGFUeXBlID09PSBHcmlkQ29sdW1uRGF0YVR5cGUuRGF0ZVRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHREYXRlVGltZVVJO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRGaWx0ZXJVSTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHR5cGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb2x1bW4uZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLlN0cmluZzpcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkJvb2xlYW46XG4gICAgICAgICAgICAgICAgcmV0dXJuICd0ZXh0JztcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLk51bWJlcjpcbiAgICAgICAgICAgIGNhc2UgR3JpZENvbHVtbkRhdGFUeXBlLkN1cnJlbmN5OlxuICAgICAgICAgICAgICAgIHJldHVybiAnbnVtYmVyJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY29uZGl0aW9ucygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uZmlsdGVycy5jb25kaXRpb25MaXN0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBpc1VuYXJ5Q29uZGl0aW9uKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uLmNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhwcmVzc2lvbi5jb25kaXRpb24uaXNVbmFyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uLmNvbmRpdGlvbiAmJiB0aGlzLmV4cHJlc3Npb24uY29uZGl0aW9uLmlzVW5hcnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZ2V0Q2hpcExhYmVsKHRoaXMuZXhwcmVzc2lvbik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2x1bW4uZGF0YVR5cGUgPT09IEdyaWRDb2x1bW5EYXRhVHlwZS5EYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmdyaWQucmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX2ZpbHRlcl9yb3dfZGF0ZV9wbGFjZWhvbGRlcjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLkJvb2xlYW4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZmlsdGVyX3Jvd19ib29sZWFuX3BsYWNlaG9sZGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyaW5nU2VydmljZS5ncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9maWx0ZXJfcm93X3BsYWNlaG9sZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Iga2V5ZG93biBvbiB0aGUgaW5wdXQgZ3JvdXAncyBwcmVmaXguXG4gICAgICovXG4gICAgcHVibGljIG9uUHJlZml4S2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5wbGF0Zm9ybS5pc0FjdGl2YXRpb25LZXkoZXZlbnQpICYmIHRoaXMuZHJvcERvd25Db25kaXRpb25zLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVDb25kaXRpb25zRHJvcERvd24odGhpcy5pbnB1dEdyb3VwUHJlZml4Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSB0aGlzLnBsYXRmb3JtLktFWU1BUC5UQUIgJiYgIXRoaXMuZHJvcERvd25Db25kaXRpb25zLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVDb25kaXRpb25zRHJvcERvd24odGhpcy5pbnB1dEdyb3VwUHJlZml4Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Iga2V5ZG93biBvbiB0aGUgaW5wdXQuXG4gICAgICovXG4gICAgcHVibGljIG9uSW5wdXRLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMuaXNLZXlQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLkJvb2xlYW4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXRmb3JtLmlzQWN0aXZhdGlvbktleShldmVudCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0R3JvdXBQcmVmaXgubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlQ29uZGl0aW9uc0Ryb3BEb3duKHRoaXMuaW5wdXRHcm91cFByZWZpeC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gdGhpcy5wbGF0Zm9ybS5LRVlNQVAuRU5URVIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9zaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21taXRJbnB1dCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmFsdEtleSAmJiAoZXZlbnQua2V5ID09PSB0aGlzLnBsYXRmb3JtLktFWU1BUC5BUlJPV19ET1dOKSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwUHJlZml4Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlQ29uZGl0aW9uc0Ryb3BEb3duKHRoaXMuaW5wdXRHcm91cFByZWZpeC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBsYXRmb3JtLmlzRmlsdGVyaW5nS2V5Q29tYm8oZXZlbnQpKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Iga2V5dXAgb24gdGhlIGlucHV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBvbklucHV0S2V5VXAoKSB7XG4gICAgICAgIHRoaXMuaXNLZXlQcmVzc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgaW5wdXQgb24gdGhlIGlucHV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBvbklucHV0KGV2ZW50QXJncykge1xuICAgICAgICAvLyBUaGUgJ2lza2V5UHJlc3NlZCcgZmxhZyBpcyBuZWVkZWQgZm9yIGEgY2FzZSBpbiBJRSwgYmVjYXVzZSB0aGUgaW5wdXQgZXZlbnQgaXMgZmlyZWQgb24gZm9jdXMgYW5kIGZvciBzb21lIHJlYXNvbixcbiAgICAgICAgLy8gd2hlbiB5b3UgaGF2ZSBhIGphcGFuZXNlIGNoYXJhY3RlciBhcyBhIHBsYWNlaG9sZGVyLCBvbiBpbml0IHRoZSB2YWx1ZSBoZXJlIGlzIGVtcHR5IHN0cmluZyAuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50QXJncy50YXJnZXQ7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLkRhdGVUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gZXZlbnRBcmdzO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBsYXRmb3JtLmlzRWRnZSAmJiB0YXJnZXQudHlwZSAhPT0gJ251bWJlcidcbiAgICAgICAgICAgIHx8IHRoaXMuaXNLZXlQcmVzc2VkIHx8IHRhcmdldC52YWx1ZSB8fCB0YXJnZXQuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGFyZ2V0LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgY29tcG9zaXRpb25zdGFydCBvbiB0aGUgaW5wdXQuXG4gICAgICovXG4gICAgcHVibGljIG9uQ29tcG9zaXRpb25TdGFydCgpIHtcbiAgICAgICAgdGhpcy5pc0NvbXBvc2luZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgY29tcG9zaXRpb25lbmQgb24gdGhlIGlucHV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNvbXBvc2l0aW9uRW5kKCkge1xuICAgICAgICB0aGlzLmlzQ29tcG9zaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgaW5wdXQgY2xpY2sgZXZlbnQuXG4gICAgICovXG4gICAgcHVibGljIG9uSW5wdXRDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uLmRhdGFUeXBlID09PSBHcmlkQ29sdW1uRGF0YVR5cGUuQm9vbGVhbiAmJiB0aGlzLmRyb3BEb3duQ29uZGl0aW9ucy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRHcm91cFByZWZpeC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUNvbmRpdGlvbnNEcm9wRG93bih0aGlzLmlucHV0R3JvdXBQcmVmaXgubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaWx0ZXJpbmcgb3BlcmF0aW9uIGNvbmRpdGlvbiBmb3IgYSBnaXZlbiB2YWx1ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29uZGl0aW9uKHZhbHVlOiBzdHJpbmcpOiBJRmlsdGVyaW5nT3BlcmF0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uLmZpbHRlcnMuY29uZGl0aW9uKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0cmFuc2xhdGVkIGNvbmRpdGlvbiBuYW1lIGZvciBhIGdpdmVuIHZhbHVlLlxuICAgICAqL1xuICAgIHB1YmxpYyB0cmFuc2xhdGVDb25kaXRpb24odmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZ3JpZC5yZXNvdXJjZVN0cmluZ3NbYGlneF9ncmlkX2ZpbHRlcl8ke3RoaXMuZ2V0Q29uZGl0aW9uKHZhbHVlKS5uYW1lfWBdIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGljb24gbmFtZSBvZiB0aGUgY3VycmVudCBjb25kaXRpb24uXG4gICAgICovXG4gICAgcHVibGljIGdldEljb25OYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLkJvb2xlYW4gJiYgdGhpcy5leHByZXNzaW9uLmNvbmRpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29uZGl0aW9uKHRoaXMuY29uZGl0aW9uc1swXSkuaWNvbk5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5leHByZXNzaW9uLmNvbmRpdGlvbi5pY29uTmFtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciBhIGdpdmVuIGNvbmRpdGlvbiBpcyBzZWxlY3RlZCBpbiBkcm9wZG93bi5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNDb25kaXRpb25TZWxlY3RlZChjb25kaXRpb25OYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbi5jb25kaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4cHJlc3Npb24uY29uZGl0aW9uLm5hbWUgPT09IGNvbmRpdGlvbk5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgdGhlIGN1cnJlbnQgZmlsdGVyaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhckZpbHRlcmluZygpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmNsZWFyRmlsdGVyKHRoaXMuY29sdW1uLmZpZWxkKTtcbiAgICAgICAgdGhpcy5yZXNldEV4cHJlc3Npb24oKTtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICB0aGlzLmNoaXBBcmVhU2Nyb2xsT2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0odGhpcy5jaGlwQXJlYVNjcm9sbE9mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tbWl0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBjb21taXRJbnB1dCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5leHByZXNzaW9uc0xpc3QuZmlsdGVyKGV4ID0+IGV4LmlzU2VsZWN0ZWQgPT09IHRydWUpO1xuICAgICAgICBzZWxlY3RlZEl0ZW0uZm9yRWFjaChlID0+IGUuaXNTZWxlY3RlZCA9IGZhbHNlKTtcblxuICAgICAgICBsZXQgaW5kZXhUb0Rlc2VsZWN0ID0gLTE7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmV4cHJlc3Npb25zTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25zTGlzdFtpbmRleF0uZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIGlmIChleHByZXNzaW9uLnNlYXJjaFZhbCA9PT0gbnVsbCAmJiAhZXhwcmVzc2lvbi5jb25kaXRpb24uaXNVbmFyeSkge1xuICAgICAgICAgICAgICAgIGluZGV4VG9EZXNlbGVjdCA9IGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleFRvRGVzZWxlY3QgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV4cHJlc3Npb24oaW5kZXhUb0Rlc2VsZWN0LCB0aGlzLmV4cHJlc3Npb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRFeHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hpcHNXaGVuQWRkaW5nRXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFycyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhcklucHV0KGV2ZW50PzogTW91c2VFdmVudCkge1xuICAgICAgICBldmVudD8uc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGtleWRvd24gb24gY2xlYXIgYnV0dG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNsZWFyS2V5RG93bihldmVudEFyZ3M6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucGxhdGZvcm0uaXNBY3RpdmF0aW9uS2V5KGV2ZW50QXJncykpIHtcbiAgICAgICAgICAgIGV2ZW50QXJncy5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhcklucHV0KCk7XG4gICAgICAgICAgICB0aGlzLmZvY3VzRWRpdEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGNsaWNrIG9uIGNsZWFyIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25DbGVhckNsaWNrKCkge1xuICAgICAgICB0aGlzLmNsZWFySW5wdXQoKTtcbiAgICAgICAgdGhpcy5mb2N1c0VkaXRFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Iga2V5ZG93biBvbiBjb21taXQgYnV0dG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNvbW1pdEtleURvd24oZXZlbnRBcmdzOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXRmb3JtLmlzQWN0aXZhdGlvbktleShldmVudEFyZ3MpKSB7XG4gICAgICAgICAgICBldmVudEFyZ3MucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuY29tbWl0SW5wdXQoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNFZGl0RWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgY2xpY2sgb24gY29tbWl0IGJ1dHRvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25Db21taXRDbGljayhldmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQ/LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLmNvbW1pdElucHV0KCk7XG4gICAgICAgIHRoaXMuZm9jdXNFZGl0RWxlbWVudCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGZvY3Vzb3V0IG9uIHRoZSBpbnB1dCBncm91cC5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25JbnB1dEdyb3VwRm9jdXNvdXQoKSB7XG4gICAgICAgIGlmICghdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICE9PSAwICYmXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb24uY29uZGl0aW9uICYmICF0aGlzLmV4cHJlc3Npb24uY29uZGl0aW9uLmlzVW5hcnkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgICAgICBpZiAoZm9jdXNlZEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpZ3gtY2hpcF9fcmVtb3ZlJykgfHwgZm9jdXNlZEVsZW1lbnQudGFnTmFtZSA9PT0gJ0lHWC1EQVktSVRFTScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKGZvY3VzZWRFbGVtZW50ICYmIHRoaXMuZWRpdG9yc0NvbnRhaW4oZm9jdXNlZEVsZW1lbnQpKVxuICAgICAgICAgICAgICAgICYmIHRoaXMuZHJvcERvd25Db25kaXRpb25zLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWl0SW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBmaWx0ZXJpbmcgZWRpdCByb3cuXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkge1xuICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uc0xpc3QubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25zTGlzdFswXS5leHByZXNzaW9uLnNlYXJjaFZhbCA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uc0xpc3RbMF0uZXhwcmVzc2lvbi5jb25kaXRpb24uaXNVbmFyeSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5nZXRFeHByZXNzaW9ucyh0aGlzLmNvbHVtbi5maWVsZCkucG9wKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsdGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjb25kVG9SZW1vdmUgPSB0aGlzLmV4cHJlc3Npb25zTGlzdC5maWx0ZXIoZXggPT4gZXguZXhwcmVzc2lvbi5zZWFyY2hWYWwgPT09IG51bGwgJiYgIWV4LmV4cHJlc3Npb24uY29uZGl0aW9uLmlzVW5hcnkpO1xuICAgICAgICAgICAgaWYgKGNvbmRUb1JlbW92ZSAmJiBjb25kVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbmRUb1JlbW92ZS5mb3JFYWNoKGMgPT4gdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLnJlbW92ZUV4cHJlc3Npb24odGhpcy5jb2x1bW4uZmllbGQsIHRoaXMuZXhwcmVzc2lvbnNMaXN0LmluZGV4T2YoYykpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpbHRlcmluZ1NlcnZpY2UudXBkYXRlRmlsdGVyaW5nQ2VsbCh0aGlzLmNvbHVtbik7XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5maWx0ZXJlZENvbHVtbiA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5zZWxlY3RlZEV4cHJlc3Npb24gPSBudWxsO1xuICAgICAgICB0aGlzLmZpbHRlcmluZ1NlcnZpY2UuZ3JpZC50aGVhZFJvdy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cbiAgICAgICAgdGhpcy5jaGlwQXJlYVNjcm9sbE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBFdmVudCBoYW5kbGVyIGZvciBkYXRlIHBpY2tlcidzIHNlbGVjdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25EYXRlU2VsZWN0ZWQodmFsdWU6IERhdGUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBpbnB1dEdyb3VwUHJlZml4Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5mb2N1cygpO1xuICAgICAgICB0aGlzLnRvZ2dsZUNvbmRpdGlvbnNEcm9wRG93bihldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyB0aGUgY29uZGl0aW9ucyBkcm9wZG93bi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlQ29uZGl0aW9uc0Ryb3BEb3duKHRhcmdldDogYW55KSB7XG4gICAgICAgIHRoaXMuX2NvbmRpdGlvbnNPdmVybGF5U2V0dGluZ3MudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLl9jb25kaXRpb25zT3ZlcmxheVNldHRpbmdzLmV4Y2x1ZGVGcm9tT3V0c2lkZUNsaWNrID0gW3RhcmdldCBhcyBIVE1MRWxlbWVudF07XG4gICAgICAgIHRoaXMuZHJvcERvd25Db25kaXRpb25zLnRvZ2dsZSh0aGlzLl9jb25kaXRpb25zT3ZlcmxheVNldHRpbmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyB0aGUgbG9naWMgb3BlcmF0b3JzIGRyb3Bkb3duLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVPcGVyYXRvcnNEcm9wRG93bihldmVudEFyZ3MsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuX29wZXJhdG9yc092ZXJsYXlTZXR0aW5ncy50YXJnZXQgPSBldmVudEFyZ3MudGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX29wZXJhdG9yc092ZXJsYXlTZXR0aW5ncy5leGNsdWRlRnJvbU91dHNpZGVDbGljayA9IFtldmVudEFyZ3MudGFyZ2V0LnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnRdO1xuICAgICAgICB0aGlzLmRyb3BEb3duT3BlcmF0b3JzLnRvQXJyYXkoKVtpbmRleF0udG9nZ2xlKHRoaXMuX29wZXJhdG9yc092ZXJsYXlTZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgY2hhbmdlIGV2ZW50IGluIGNvbmRpdGlvbnMgZHJvcGRvd24uXG4gICAgICovXG4gICAgcHVibGljIG9uQ29uZGl0aW9uc0NoYW5nZWQoZXZlbnRBcmdzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gKGV2ZW50QXJncy5uZXdTZWxlY3Rpb24gYXMgSWd4RHJvcERvd25JdGVtQ29tcG9uZW50KS52YWx1ZTtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uLmNvbmRpdGlvbiA9IHRoaXMuZ2V0Q29uZGl0aW9uKHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbi5jb25kaXRpb24uaXNVbmFyeSkge1xuICAgICAgICAgICAgLy8gdXBkYXRlIGdyaWQncyBmaWx0ZXJpbmcgb24gdGhlIG5leHQgY3ljbGUgdG8gZW5zdXJlIHRoZSBkcm9wLWRvd24gaXMgY2xvc2VkXG4gICAgICAgICAgICAvLyBpZiB0aGUgZHJvcC1kb3duIGlzIG5vdCBjbG9zZWQgdGhpcyBldmVudCBoYW5kbGVyIHdpbGwgYmUgaW52b2tlZCBtdWx0aXBsZSB0aW1lc1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudW5hcnlDb25kaXRpb25DaGFuZ2VkQ2FsbGJhY2soKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5jb25kaXRpb25DaGFuZ2VkQ2FsbGJhY2soKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJlY2F1c2Ugb2YgYW4gaXNzdWUgaW4gSUUsIHdoZXJlIHlvdSBhcmUgc3RpbGwgYWJsZSB0byB3cml0ZSBpbiB0aGUgaW5wdXQsXG4gICAgICAgIC8vIGlmIGl0IGhhcyBiZWVuIGZvY3VzZWQgYW5kIHRoZW4gc2V0IHRvIHJlYWRvbmx5LlxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5mb2N1c0VkaXRFbGVtZW50KCkpO1xuICAgIH1cblxuXG4gICAgcHVibGljIG9uQ2hpcFBvaW50ZXJkb3duKGFyZ3MsIGNoaXA6IElneENoaXBDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX2NhbmNlbENoaXBDbGljayA9IGNoaXAuc2VsZWN0ZWRcbiAgICAgICAgICAgICYmIGFjdGl2ZUVsZW1lbnQgJiYgdGhpcy5lZGl0b3JzQ29udGFpbihhY3RpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25DaGlwQ2xpY2soYXJncywgaXRlbTogRXhwcmVzc2lvblVJKSB7XG4gICAgICAgIGlmICh0aGlzLl9jYW5jZWxDaGlwQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbmNlbENoaXBDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5leHByZXNzaW9uc0xpc3QuZm9yRWFjaChleCA9PiBleC5pc1NlbGVjdGVkID0gZmFsc2UpO1xuXG4gICAgICAgIHRoaXMudG9nZ2xlQ2hpcChpdGVtKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlQ2hpcChpdGVtOiBFeHByZXNzaW9uVUkpIHtcbiAgICAgICAgaXRlbS5pc1NlbGVjdGVkID0gIWl0ZW0uaXNTZWxlY3RlZDtcbiAgICAgICAgaWYgKGl0ZW0uaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gaXRlbS5leHByZXNzaW9uO1xuXG4gICAgICAgICAgICB0aGlzLmZvY3VzRWRpdEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGNoaXAga2V5ZG93biBldmVudC5cbiAgICAgKi9cbiAgICBwdWJsaWMgb25DaGlwS2V5RG93bihldmVudEFyZ3M6IEtleWJvYXJkRXZlbnQsIGl0ZW06IEV4cHJlc3Npb25VSSkge1xuICAgICAgICBpZiAoZXZlbnRBcmdzLmtleSA9PT0gdGhpcy5wbGF0Zm9ybS5LRVlNQVAuRU5URVIpIHtcbiAgICAgICAgICAgIGV2ZW50QXJncy5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUNoaXAoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY3JvbGxzIHRoZSBmaXJzdCBjaGlwIGludG8gdmlldyBpZiB0aGUgdGFiIGtleSBpcyBwcmVzc2VkIG9uIHRoZSBsZWZ0IGFycm93LlxuICAgICAqL1xuICAgIHB1YmxpYyBvbkxlZnRBcnJvd0tleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gdGhpcy5wbGF0Zm9ybS5LRVlNQVAuVEFCKSB7XG4gICAgICAgICAgICB0aGlzLmNoaXBBcmVhU2Nyb2xsT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgY2hpcCByZW1vdmVkIGV2ZW50LlxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNoaXBSZW1vdmVkKGV2ZW50QXJnczogSUJhc2VDaGlwRXZlbnRBcmdzLCBpdGVtOiBFeHByZXNzaW9uVUkpIHtcbiAgICAgICAgY29uc3QgaW5kZXhUb1JlbW92ZSA9IHRoaXMuZXhwcmVzc2lvbnNMaXN0LmluZGV4T2YoaXRlbSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXhwcmVzc2lvbihpbmRleFRvUmVtb3ZlLCBpdGVtLmV4cHJlc3Npb24pO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hpcHNPblJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGxvZ2ljIG9wZXJhdG9yIGNoYW5nZWQgZXZlbnQuXG4gICAgICovXG4gICAgcHVibGljIG9uTG9naWNPcGVyYXRvckNoYW5nZWQoZXZlbnRBcmdzOiBJU2VsZWN0aW9uRXZlbnRBcmdzLCBleHByZXNzaW9uOiBFeHByZXNzaW9uVUkpIHtcbiAgICAgICAgaWYgKGV2ZW50QXJncy5vbGRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGV4cHJlc3Npb24uYWZ0ZXJPcGVyYXRvciA9IChldmVudEFyZ3MubmV3U2VsZWN0aW9uIGFzIElneERyb3BEb3duSXRlbUNvbXBvbmVudCkudmFsdWU7XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25zTGlzdFt0aGlzLmV4cHJlc3Npb25zTGlzdC5pbmRleE9mKGV4cHJlc3Npb24pICsgMV0uYmVmb3JlT3BlcmF0b3IgPSBleHByZXNzaW9uLmFmdGVyT3BlcmF0b3I7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBncmlkJ3MgZmlsdGVyaW5nIG9uIHRoZSBuZXh0IGN5Y2xlIHRvIGVuc3VyZSB0aGUgZHJvcC1kb3duIGlzIGNsb3NlZFxuICAgICAgICAgICAgLy8gaWYgdGhlIGRyb3AtZG93biBpcyBub3QgY2xvc2VkIHRoaXMgZXZlbnQgaGFuZGxlciB3aWxsIGJlIGludm9rZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmZpbHRlcigpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjcm9sbHMgdGhlIGNoaXBzIGludG8gdGhlIGNoaXAgYXJlYSB3aGVuIGxlZnQgb3IgcmlnaHQgYXJyb3dzIGFyZSBwcmVzc2VkLlxuICAgICAqL1xuICAgIHB1YmxpYyBzY3JvbGxDaGlwc09uQXJyb3dQcmVzcyhhcnJvd1Bvc2l0aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgY29uc3QgY2hpcEFyYWVDaGlsZHJlbiA9IHRoaXMuY2hpcHNBcmVhLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlbjtcbiAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgaWYgKGFycm93UG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpcCBvZiBjaGlwQXJhZUNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguY2VpbChjaGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0KSA8IE1hdGguY2VpbChjb250YWluZXJSZWN0LnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvdW50IDwgY2hpcEFyYWVDaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaXBBcmVhU2Nyb2xsT2Zmc2V0IC09IE1hdGguY2VpbChjaGlwQXJhZUNoaWxkcmVuW2NvdW50XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodCkgLVxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoY29udGFpbmVyUmVjdC5yaWdodCkgKyAxO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFycm93UG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlwIG9mIGNoaXBBcmFlQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5jZWlsKGNoaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkgPCBNYXRoLmNlaWwoY29udGFpbmVyUmVjdC5sZWZ0KSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQgKz0gTWF0aC5jZWlsKGNvbnRhaW5lclJlY3QubGVmdCkgLVxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNlaWwoY2hpcEFyYWVDaGlsZHJlbltjb3VudCAtIDFdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpICsgMTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSh0aGlzLmNoaXBBcmVhU2Nyb2xsT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBSZXNldHMgdGhlIGNoaXBzIGFyZWFcbiAgICAgKiBAbWVtYmVyb2YgSWd4R3JpZEZpbHRlcmluZ1Jvd0NvbXBvbmVudFxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldENoaXBzQXJlYSgpIHtcbiAgICAgICAgdGhpcy5jaGlwQXJlYVNjcm9sbE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQpO1xuICAgICAgICB0aGlzLnNob3dIaWRlQXJyb3dCdXR0b25zKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGZvY3VzRWRpdEVsZW1lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBpY2tlcikge1xuICAgICAgICAgICAgdGhpcy5waWNrZXIuZ2V0RWRpdEVsZW1lbnQoKS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLiRkZXN0cm95ZXIubmV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd0hpZGVBcnJvd0J1dHRvbnMoKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJpbmdTZXJ2aWNlLmlzRmlsdGVyUm93VmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaXBzQXJlYVdpZHRoID0gdGhpcy5jaGlwc0FyZWEuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93QXJyb3dzID0gdGhpcy5jaGlwc0FyZWFXaWR0aCA+PSBjb250YWluZXJXaWR0aCAmJiB0aGlzLmlzQ29sdW1uRmlsdGVyZWQ7XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiByZXZpc2UgdGhlIGNkci5kZXRlY3RDaGFuZ2VzKCkgdXNhZ2UgaGVyZVxuICAgICAgICAgICAgICAgIGlmICghKHRoaXMuY2RyIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEV4cHJlc3Npb24oaXNTZWxlY3RlZDogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBleHByVUkgPSBuZXcgRXhwcmVzc2lvblVJKCk7XG4gICAgICAgIGV4cHJVSS5leHByZXNzaW9uID0gdGhpcy5leHByZXNzaW9uO1xuICAgICAgICBleHByVUkuYmVmb3JlT3BlcmF0b3IgPSB0aGlzLmV4cHJlc3Npb25zTGlzdC5sZW5ndGggPiAwID8gRmlsdGVyaW5nTG9naWMuQW5kIDogbnVsbDtcbiAgICAgICAgZXhwclVJLmlzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkO1xuXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbnNMaXN0LnB1c2goZXhwclVJKTtcblxuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmV4cHJlc3Npb25zTGlzdC5sZW5ndGg7XG4gICAgICAgIGlmICh0aGlzLmV4cHJlc3Npb25zTGlzdFtsZW5ndGggLSAyXSkge1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uc0xpc3RbbGVuZ3RoIC0gMl0uYWZ0ZXJPcGVyYXRvciA9IHRoaXMuZXhwcmVzc2lvbnNMaXN0W2xlbmd0aCAtIDFdLmJlZm9yZU9wZXJhdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93SGlkZUFycm93QnV0dG9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlRXhwcmVzc2lvbihpbmRleFRvUmVtb3ZlOiBudW1iZXIsIGV4cHJlc3Npb246IElGaWx0ZXJpbmdFeHByZXNzaW9uKSB7XG4gICAgICAgIGlmIChpbmRleFRvUmVtb3ZlID09PSAwICYmIHRoaXMuZXhwcmVzc2lvbnNMaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckZpbHRlcmluZygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXJpbmdTZXJ2aWNlLnJlbW92ZUV4cHJlc3Npb24odGhpcy5jb2x1bW4uZmllbGQsIGluZGV4VG9SZW1vdmUpO1xuXG4gICAgICAgIHRoaXMuZmlsdGVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbiA9PT0gZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5yZXNldEV4cHJlc3Npb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0hpZGVBcnJvd0J1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0RXhwcmVzc2lvbigpIHtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0ge1xuICAgICAgICAgICAgZmllbGROYW1lOiB0aGlzLmNvbHVtbi5maWVsZCxcbiAgICAgICAgICAgIGNvbmRpdGlvbjogbnVsbCxcbiAgICAgICAgICAgIHNlYXJjaFZhbDogbnVsbCxcbiAgICAgICAgICAgIGlnbm9yZUNhc2U6IHRoaXMuY29sdW1uLmZpbHRlcmluZ0lnbm9yZUNhc2VcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5jb2x1bW4uZGF0YVR5cGUgIT09IEdyaWRDb2x1bW5EYXRhVHlwZS5Cb29sZWFuKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb24uY29uZGl0aW9uID0gdGhpcy5nZXRDb25kaXRpb24odGhpcy5jb25kaXRpb25zWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5kYXRhVHlwZSA9PT0gR3JpZENvbHVtbkRhdGFUeXBlLkRhdGUgJiYgdGhpcy5pbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0hpZGVBcnJvd0J1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjcm9sbENoaXBzV2hlbkFkZGluZ0V4cHJlc3Npb24oKSB7XG4gICAgICAgIGNvbnN0IGNoaXBBcmFlQ2hpbGRyZW4gPSB0aGlzLmNoaXBzQXJlYS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW47XG4gICAgICAgIGlmICghY2hpcEFyYWVDaGlsZHJlbiB8fCBjaGlwQXJhZUNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hpcHNDb250YWluZXJXaWR0aCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IGNoaXBzQXJlYVdpZHRoID0gdGhpcy5jaGlwc0FyZWEuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuXG4gICAgICAgIGlmIChjaGlwc0FyZWFXaWR0aCA+IGNoaXBzQ29udGFpbmVyV2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQgPSBjaGlwc0NvbnRhaW5lcldpZHRoIC0gY2hpcHNBcmVhV2lkdGg7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybSh0aGlzLmNoaXBBcmVhU2Nyb2xsT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdHJhbnNmb3JtKG9mZnNldDogbnVtYmVyKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoaXBzQXJlYS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke29mZnNldH1weClgO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjcm9sbENoaXBzT25SZW1vdmUoKSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGNvbnN0IGNoaXBBcmFlQ2hpbGRyZW4gPSB0aGlzLmNoaXBzQXJlYS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW47XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2hpcCBvZiBjaGlwQXJhZUNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5jZWlsKGNoaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQpIDwgTWF0aC5jZWlsKGNvbnRhaW5lclJlY3QubGVmdCkpIHtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvdW50IDw9IDIpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGlmID0gY2hpcEFyYWVDaGlsZHJlbltjb3VudF0uaWQgPT09ICdjaGlwJyA/IGNvdW50IC0gMiA6IGNvdW50IC0gMTtcbiAgICAgICAgICAgIHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQgKz0gTWF0aC5jZWlsKGNvbnRhaW5lclJlY3QubGVmdCkgLSBNYXRoLmNlaWwoY2hpcEFyYWVDaGlsZHJlbltkaWZdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKHRoaXMuY2hpcEFyZWFTY3JvbGxPZmZzZXQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uZGl0aW9uQ2hhbmdlZENhbGxiYWNrKCkge1xuICAgICAgICBpZiAoISF0aGlzLmV4cHJlc3Npb24uc2VhcmNoVmFsIHx8IHRoaXMuZXhwcmVzc2lvbi5zZWFyY2hWYWwgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVuYXJ5Q29uZGl0aW9uQ2hhbmdlZENhbGxiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbnNMaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmV4cHJlc3Npb24gPT09IHRoaXMuZXhwcmVzc2lvbikgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRFeHByZXNzaW9uKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsdGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaWx0ZXIoKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyaW5nU2VydmljZS5maWx0ZXJJbnRlcm5hbCh0aGlzLmNvbHVtbi5maWVsZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlZGl0b3JzQ29udGFpbihjaGlsZDogRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBpZiB0aGUgZmlyc3QgY2hlY2sgaXMgZmFsc2UgYW5kIHRoZSBzZWNvbmQgaXMgdW5kZWZpbmVkIHRoaXMgd2lsbCByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBpdCBhbHdheXMgcmV0dXJucyBib29sZWFuXG4gICAgICAgIHJldHVybiAhISh0aGlzLmlucHV0R3JvdXAgJiYgdGhpcy5pbnB1dEdyb3VwLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoY2hpbGQpXG4gICAgICAgICAgICB8fCB0aGlzLnBpY2tlciAmJiB0aGlzLnBpY2tlci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoY2hpbGQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBpc0NvbHVtbkZpbHRlcmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW4uZmlsdGVyaW5nRXhwcmVzc2lvbnNUcmVlICYmIHRoaXMuY29sdW1uLmZpbHRlcmluZ0V4cHJlc3Npb25zVHJlZS5maWx0ZXJpbmdPcGVyYW5kcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaXNOYXJyb3dXaWR0aCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCA8IHRoaXMuTkFSUk9XX1dJRFRIX1RIUkVTSE9MRDtcbiAgICB9XG59XG4iLCI8IS0tIEhhdmUgdG8gYXBwbHkgc3R5bGVzIGlubGluZSBiZWNhdXNlIG9mIHRoZSBvdmVybGF5IG91dGxldCAuLi4gLS0+XG48aWd4LWRyb3AtZG93biAjaW5wdXRHcm91cENvbmRpdGlvbnMgW2Rpc3BsYXlEZW5zaXR5XT1cImRpc3BsYXlEZW5zaXR5XCIgW2hlaWdodF09XCInMjAwcHgnXCIgKHNlbGVjdGlvbkNoYW5naW5nKT1cIm9uQ29uZGl0aW9uc0NoYW5nZWQoJGV2ZW50KVwiPlxuICAgIDxpZ3gtZHJvcC1kb3duLWl0ZW0gKm5nRm9yPVwibGV0IGNvbmRpdGlvbiBvZiBjb25kaXRpb25zXCJcbiAgICAgICAgW3ZhbHVlXT1cImNvbmRpdGlvblwiXG4gICAgICAgIFtzZWxlY3RlZF09XCJpc0NvbmRpdGlvblNlbGVjdGVkKGNvbmRpdGlvbilcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1ncmlkX19maWx0ZXJpbmctZHJvcGRvd24taXRlbXNcIj5cbiAgICAgICAgICAgIDxpZ3gtaWNvbiBmYW1pbHk9XCJpbXgtaWNvbnNcIiBbbmFtZV09XCJnZXRDb25kaXRpb24oY29uZGl0aW9uKS5pY29uTmFtZVwiPjwvaWd4LWljb24+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlneC1ncmlkX19maWx0ZXJpbmctZHJvcGRvd24tdGV4dFwiPnt7IHRyYW5zbGF0ZUNvbmRpdGlvbihjb25kaXRpb24pIH19PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2lneC1kcm9wLWRvd24taXRlbT5cbjwvaWd4LWRyb3AtZG93bj5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0RmlsdGVyVUk+XG4gICAgPGlneC1pbnB1dC1ncm91cCAjaW5wdXRHcm91cCB0eXBlPVwiYm94XCIgW2Rpc3BsYXlEZW5zaXR5XT1cImRpc3BsYXlEZW5zaXR5XCIgKGZvY3Vzb3V0KT1cIm9uSW5wdXRHcm91cEZvY3Vzb3V0KClcIj5cbiAgICAgICAgPGlneC1wcmVmaXggI2lucHV0R3JvdXBQcmVmaXhcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImlucHV0R3JvdXBQcmVmaXhDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25QcmVmaXhLZXlEb3duKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgICAgICAgICBbaWd4RHJvcERvd25JdGVtTmF2aWdhdGlvbl09XCJpbnB1dEdyb3VwQ29uZGl0aW9uc1wiPlxuICAgICAgICAgICAgPGlneC1pY29uIGZhbWlseT1cImlteC1pY29uc1wiIFtuYW1lXT1cImdldEljb25OYW1lKClcIj48L2lneC1pY29uPlxuICAgICAgICA8L2lneC1wcmVmaXg+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgI2lucHV0XG4gICAgICAgICAgICBpZ3hJbnB1dFxuICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgIFtwbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgW3ZhbHVlXT1cInZhbHVlXCJcbiAgICAgICAgICAgIChpbnB1dCk9XCJvbklucHV0KCRldmVudClcIlxuICAgICAgICAgICAgW3R5cGVdPVwidHlwZVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwiaXNVbmFyeUNvbmRpdGlvblwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25JbnB1dENsaWNrKClcIlxuICAgICAgICAgICAgKGNvbXBvc2l0aW9uc3RhcnQpPVwib25Db21wb3NpdGlvblN0YXJ0KClcIlxuICAgICAgICAgICAgKGNvbXBvc2l0aW9uZW5kKT1cIm9uQ29tcG9zaXRpb25FbmQoKVwiXG4gICAgICAgICAgICAoa2V5ZG93bik9XCJvbklucHV0S2V5RG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgIChrZXl1cCk9XCJvbklucHV0S2V5VXAoKVwiLz5cbiAgICAgICAgICAgIDxpZ3gtc3VmZml4ICpuZ0lmPVwidmFsdWUgfHwgdmFsdWUgPT09IDBcIiA+XG4gICAgICAgICAgICAgICAgPGlneC1pY29uIChrZXlkb3duKT1cIm9uQ29tbWl0S2V5RG93bigkZXZlbnQpXCIgKGNsaWNrKT1cIm9uQ29tbWl0Q2xpY2soKVwiIHRhYmluZGV4PVwiMFwiPmRvbmU8L2lneC1pY29uPlxuICAgICAgICAgICAgICAgIDxpZ3gtaWNvbiAoa2V5ZG93bik9XCJvbkNsZWFyS2V5RG93bigkZXZlbnQpXCIgKGNsaWNrKT1cIm9uQ2xlYXJDbGljaygpXCIgdGFiaW5kZXg9XCIwXCI+Y2xlYXI8L2lneC1pY29uPlxuICAgICAgICAgICAgPC9pZ3gtc3VmZml4PlxuICAgIDwvaWd4LWlucHV0LWdyb3VwPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0RGF0ZVVJPlxuICAgIDxpZ3gtZGF0ZS1waWNrZXIgI3BpY2tlclxuICAgICAgICBbKHZhbHVlKV09XCJ2YWx1ZVwiXG4gICAgICAgIFtyZWFkT25seV09XCJ0cnVlXCJcbiAgICAgICAgW291dGxldF09XCJmaWx0ZXJpbmdTZXJ2aWNlLmdyaWQub3V0bGV0XCJcbiAgICAgICAgW2xvY2FsZV09XCJmaWx0ZXJpbmdTZXJ2aWNlLmdyaWQubG9jYWxlXCJcbiAgICAgICAgKGNsaWNrKT1cImV4cHJlc3Npb24uY29uZGl0aW9uLmlzVW5hcnkgPyBudWxsIDogcGlja2VyLm9wZW4oKVwiXG4gICAgICAgIHR5cGU9XCJib3hcIlxuICAgICAgICBbZGlzcGxheUZvcm1hdF09XCJjb2x1bW4ucGlwZUFyZ3MuZm9ybWF0XCJcbiAgICAgICAgW2Zvcm1hdHRlcl09XCJjb2x1bW4uZm9ybWF0dGVyXCJcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgW2Rpc3BsYXlEZW5zaXR5XT1cImRpc3BsYXlEZW5zaXR5XCJcbiAgICAgICAgKGtleWRvd24pPVwib25JbnB1dEtleURvd24oJGV2ZW50KVwiXG4gICAgICAgIChmb2N1c291dCk9XCJvbklucHV0R3JvdXBGb2N1c291dCgpXCJcbiAgICAgICAgKGNsb3NlZCk9XCJmb2N1c0VkaXRFbGVtZW50KClcIj5cbiAgICAgICAgPGlneC1wcmVmaXggI2lucHV0R3JvdXBQcmVmaXhcbiAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICAoY2xpY2spPVwiaW5wdXRHcm91cFByZWZpeENsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgKGtleWRvd24pPVwib25QcmVmaXhLZXlEb3duKCRldmVudClcIlxuICAgICAgICAgICAgW2lneERyb3BEb3duSXRlbU5hdmlnYXRpb25dPVwiaW5wdXRHcm91cENvbmRpdGlvbnNcIj5cbiAgICAgICAgICAgIDxpZ3gtaWNvbiBmYW1pbHk9XCJpbXgtaWNvbnNcIiBbbmFtZV09XCJleHByZXNzaW9uLmNvbmRpdGlvbi5pY29uTmFtZVwiPjwvaWd4LWljb24+XG4gICAgICAgIDwvaWd4LXByZWZpeD5cbiAgICAgICAgPGlneC1zdWZmaXggKm5nSWY9XCJ2YWx1ZVwiPlxuICAgICAgICAgICAgPGlneC1pY29uIHRhYmluZGV4PVwiMFwiIChrZXlkb3duKT1cIm9uQ29tbWl0S2V5RG93bigkZXZlbnQpXCIgKGNsaWNrKT1cIm9uQ29tbWl0Q2xpY2soJGV2ZW50KVwiPmRvbmU8L2lneC1pY29uPlxuICAgICAgICAgICAgPGlneC1pY29uIHRhYmluZGV4PVwiMFwiIChrZXlkb3duKT1cIm9uQ2xlYXJLZXlEb3duKCRldmVudClcIiAoY2xpY2spPVwiY2xlYXJJbnB1dCgkZXZlbnQpXCI+Y2xlYXI8L2lneC1pY29uPlxuICAgICAgICA8L2lneC1zdWZmaXg+XG4gICAgICAgIDwhLS0gZGlzYWJsZSBkZWZhdWx0IGljb25zIC0tPlxuICAgICAgICA8aWd4LXBpY2tlci10b2dnbGU+PC9pZ3gtcGlja2VyLXRvZ2dsZT5cbiAgICAgICAgPGlneC1waWNrZXItY2xlYXI+PC9pZ3gtcGlja2VyLWNsZWFyPlxuICAgIDwvaWd4LWRhdGUtcGlja2VyPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0VGltZVVJPlxuICAgIDxpZ3gtdGltZS1waWNrZXIgI3BpY2tlclxuICAgICAgICBbKHZhbHVlKV09XCJ2YWx1ZVwiXG4gICAgICAgIFtpbnB1dEZvcm1hdF09XCJjb2x1bW4uZGVmYXVsdFRpbWVGb3JtYXRcIlxuICAgICAgICBbbG9jYWxlXT1cImZpbHRlcmluZ1NlcnZpY2UuZ3JpZC5sb2NhbGVcIlxuICAgICAgICBbZm9ybWF0dGVyXT1cImNvbHVtbi5mb3JtYXR0ZXJcIlxuICAgICAgICBbb3V0bGV0XT1cImZpbHRlcmluZ1NlcnZpY2UuZ3JpZC5vdXRsZXRcIlxuICAgICAgICBbZGlzcGxheURlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIlxuICAgICAgICB0eXBlPVwiYm94XCJcbiAgICAgICAgW3JlYWRPbmx5XT1cInRydWVcIlxuICAgICAgICBbcGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgICAoY2xvc2VkKT1cImZvY3VzRWRpdEVsZW1lbnQoKVwiXG4gICAgICAgIChmb2N1c291dCk9XCJvbklucHV0R3JvdXBGb2N1c291dCgpXCJcbiAgICAgICAgKGtleWRvd24pPVwib25JbnB1dEtleURvd24oJGV2ZW50KVwiXG4gICAgICAgIChjbGljayk9XCJleHByZXNzaW9uLmNvbmRpdGlvbi5pc1VuYXJ5ID8gbnVsbCA6IHBpY2tlci5vcGVuKClcIj5cbiAgICAgICAgPGlneC1wcmVmaXggI2lucHV0R3JvdXBQcmVmaXhcbiAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgKGNsaWNrKT1cImlucHV0R3JvdXBQcmVmaXhDbGljaygkZXZlbnQpXCJcbiAgICAgICAgKGtleWRvd24pPVwib25QcmVmaXhLZXlEb3duKCRldmVudClcIlxuICAgICAgICBbaWd4RHJvcERvd25JdGVtTmF2aWdhdGlvbl09XCJpbnB1dEdyb3VwQ29uZGl0aW9uc1wiPlxuICAgICAgICA8aWd4LWljb24gZmFtaWx5PVwiaW14LWljb25zXCIgW25hbWVdPVwiZXhwcmVzc2lvbi5jb25kaXRpb24uaWNvbk5hbWVcIj48L2lneC1pY29uPlxuICAgIDwvaWd4LXByZWZpeD5cbiAgICA8aWd4LXN1ZmZpeCAqbmdJZj1cInZhbHVlXCI+XG4gICAgICAgIDxpZ3gtaWNvbiB0YWJpbmRleD1cIjBcIiAoa2V5ZG93bik9XCJvbkNvbW1pdEtleURvd24oJGV2ZW50KVwiIChjbGljayk9XCJvbkNvbW1pdENsaWNrKCRldmVudClcIj5kb25lPC9pZ3gtaWNvbj5cbiAgICAgICAgPGlneC1pY29uIHRhYmluZGV4PVwiMFwiIChrZXlkb3duKT1cIm9uQ2xlYXJLZXlEb3duKCRldmVudClcIiAoY2xpY2spPVwiY2xlYXJJbnB1dCgkZXZlbnQpXCI+Y2xlYXI8L2lneC1pY29uPlxuICAgIDwvaWd4LXN1ZmZpeD5cbiAgICA8IS0tIGRpc2FibGUgZGVmYXVsdCBpY29ucyAtLT5cbiAgICA8aWd4LXBpY2tlci10b2dnbGU+PC9pZ3gtcGlja2VyLXRvZ2dsZT5cbiAgICA8aWd4LXBpY2tlci1jbGVhcj48L2lneC1waWNrZXItY2xlYXI+XG4gICAgPC9pZ3gtdGltZS1waWNrZXI+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHREYXRlVGltZVVJPlxuICAgIDxpZ3gtaW5wdXQtZ3JvdXAgI2lucHV0R3JvdXAgdHlwZT1cImJveFwiIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiIChmb2N1c291dCk9XCJvbklucHV0R3JvdXBGb2N1c291dCgpXCI+XG4gICAgICAgIDxpZ3gtcHJlZml4ICNpbnB1dEdyb3VwUHJlZml4XG4gICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJpbnB1dEdyb3VwUHJlZml4Q2xpY2soJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uUHJlZml4S2V5RG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgW2lneERyb3BEb3duSXRlbU5hdmlnYXRpb25dPVwiaW5wdXRHcm91cENvbmRpdGlvbnNcIj5cbiAgICAgICAgICAgIDxpZ3gtaWNvbiBmYW1pbHk9XCJpbXgtaWNvbnNcIiBbbmFtZV09XCJnZXRJY29uTmFtZSgpXCI+PC9pZ3gtaWNvbj5cbiAgICAgICAgPC9pZ3gtcHJlZml4PlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICNpbnB1dFxuICAgICAgICAgICAgaWd4SW5wdXRcbiAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICBbcGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgICAgICAgW2lneERhdGVUaW1lRWRpdG9yXT1cImNvbHVtbi5kZWZhdWx0RGF0ZVRpbWVGb3JtYXRcIlxuICAgICAgICAgICAgW3ZhbHVlXT1cInZhbHVlXCJcbiAgICAgICAgICAgICh2YWx1ZUNoYW5nZSk9XCJvbklucHV0KCRldmVudClcIlxuICAgICAgICAgICAgW3JlYWRvbmx5XT1cImlzVW5hcnlDb25kaXRpb25cIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uSW5wdXRDbGljaygpXCJcbiAgICAgICAgICAgIChrZXlkb3duKT1cIm9uSW5wdXRLZXlEb3duKCRldmVudClcIlxuICAgICAgICAgICAgKGtleXVwKT1cIm9uSW5wdXRLZXlVcCgpXCIvPlxuICAgICAgICAgICAgPGlneC1zdWZmaXggKm5nSWY9XCJ2YWx1ZSB8fCB2YWx1ZSA9PT0gMFwiID5cbiAgICAgICAgICAgICAgICA8aWd4LWljb24gKGtleWRvd24pPVwib25Db21taXRLZXlEb3duKCRldmVudClcIiAoY2xpY2spPVwib25Db21taXRDbGljaygpXCIgdGFiaW5kZXg9XCIwXCI+ZG9uZTwvaWd4LWljb24+XG4gICAgICAgICAgICAgICAgPGlneC1pY29uIChrZXlkb3duKT1cIm9uQ2xlYXJLZXlEb3duKCRldmVudClcIiAoY2xpY2spPVwib25DbGVhckNsaWNrKClcIiB0YWJpbmRleD1cIjBcIj5jbGVhcjwvaWd4LWljb24+XG4gICAgICAgICAgICA8L2lneC1zdWZmaXg+XG4gICAgPC9pZ3gtaW5wdXQtZ3JvdXA+XG48L25nLXRlbXBsYXRlPlxuXG48bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB0aGlzIH1cIj48L25nLWNvbnRhaW5lcj5cblxuPGJ1dHRvbiBpZ3hCdXR0b249XCJpY29uXCIgY2xhc3M9XCJpZ3gtZ3JpZF9fZmlsdGVyaW5nLXJvdy1zY3JvbGwtc3RhcnRcIiAqbmdJZj1cInNob3dBcnJvd3NcIiAoa2V5ZG93bik9XCJvbkxlZnRBcnJvd0tleURvd24oJGV2ZW50KVwiIChjbGljayk9XCJzY3JvbGxDaGlwc09uQXJyb3dQcmVzcygnbGVmdCcpXCI+XG4gICAgPGlneC1pY29uPm5hdmlnYXRlX2JlZm9yZTwvaWd4LWljb24+XG48L2J1dHRvbj5cblxuPGRpdiAjY29udGFpbmVyIGNsYXNzPVwiaWd4LWdyaWRfX2ZpbHRlcmluZy1yb3ctbWFpblwiPlxuICAgIDxkaXY+XG4gICAgICAgICA8aWd4LWNoaXBzLWFyZWEgI2NoaXBzQXJlYT5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgZXhwcmVzc2lvbnNMaXN0OyBpbmRleCBhcyBpOyBsZXQgbGFzdCA9IGxhc3Q7XCIgdGFiaW5kZXg9XCIwXCI+XG4gICAgICAgICAgICAgICAgPGlneC1jaGlwICNjaGlwIGlkPSdjaGlwJ1xuICAgICAgICAgICAgICAgICAgICAocG9pbnRlcmRvd24pPVwib25DaGlwUG9pbnRlcmRvd24oJGV2ZW50LCBjaGlwKVwiXG4gICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkNoaXBDbGljaygkZXZlbnQsIGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25DaGlwS2V5RG93bigkZXZlbnQsIGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgKHJlbW92ZSk9XCJvbkNoaXBSZW1vdmVkKCRldmVudCwgaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICBbc2VsZWN0YWJsZV09XCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgICAgIFtzZWxlY3RlZF09XCJpdGVtLmlzU2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICBbZGlzcGxheURlbnNpdHldPVwiZGlzcGxheURlbnNpdHlcIlxuICAgICAgICAgICAgICAgICAgICBbcmVtb3ZhYmxlXT1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlneC1pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZ3hQcmVmaXhcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbWlseT1cImlteC1pY29uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmFtZV09XCJpdGVtLmV4cHJlc3Npb24uY29uZGl0aW9uLmljb25OYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgIDwvaWd4LWljb24+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7ZmlsdGVyaW5nU2VydmljZS5nZXRDaGlwTGFiZWwoaXRlbS5leHByZXNzaW9uKX19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvaWd4LWNoaXA+XG5cbiAgICAgICAgICAgICAgICA8c3BhbiBpZD0nb3BlcmFuZCcgKm5nSWY9XCIhbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlneEJ1dHRvbiAoY2xpY2spPVwidG9nZ2xlT3BlcmF0b3JzRHJvcERvd24oJGV2ZW50LCBpKVwiIFtpZ3hEcm9wRG93bkl0ZW1OYXZpZ2F0aW9uXT1cIm9wZXJhdG9yc1wiIFtkaXNwbGF5RGVuc2l0eV09XCJjb2x1bW4uZ3JpZC5kaXNwbGF5RGVuc2l0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlneC1pY29uPmV4cGFuZF9tb3JlPC9pZ3gtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7ZmlsdGVyaW5nU2VydmljZS5nZXRPcGVyYXRvckFzU3RyaW5nKGl0ZW0uYWZ0ZXJPcGVyYXRvcil9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxpZ3gtZHJvcC1kb3duIFtkaXNwbGF5RGVuc2l0eV09XCJjb2x1bW4uZ3JpZC5kaXNwbGF5RGVuc2l0eVwiICNvcGVyYXRvcnMgKHNlbGVjdGlvbkNoYW5naW5nKT1cIm9uTG9naWNPcGVyYXRvckNoYW5nZWQoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpZ3gtZHJvcC1kb3duLWl0ZW0gW3ZhbHVlXT1cIjBcIiBbc2VsZWN0ZWRdPVwiaXRlbS5hZnRlck9wZXJhdG9yID09PSAwXCI+e3tmaWx0ZXJpbmdTZXJ2aWNlLmdyaWQucmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX2ZpbHRlcl9vcGVyYXRvcl9hbmR9fTwvaWd4LWRyb3AtZG93bi1pdGVtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpZ3gtZHJvcC1kb3duLWl0ZW0gW3ZhbHVlXT1cIjFcIiBbc2VsZWN0ZWRdPVwiaXRlbS5hZnRlck9wZXJhdG9yID09PSAxXCI+e3tmaWx0ZXJpbmdTZXJ2aWNlLmdyaWQucmVzb3VyY2VTdHJpbmdzLmlneF9ncmlkX2ZpbHRlcl9vcGVyYXRvcl9vcn19PC9pZ3gtZHJvcC1kb3duLWl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDwvaWd4LWRyb3AtZG93bj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9pZ3gtY2hpcHMtYXJlYT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48YnV0dG9uIGlneEJ1dHRvbj1cImljb25cIiBjbGFzcz1cImlneC1ncmlkX19maWx0ZXJpbmctcm93LXNjcm9sbC1lbmRcIiAqbmdJZj1cInNob3dBcnJvd3NcIiAoY2xpY2spPVwic2Nyb2xsQ2hpcHNPbkFycm93UHJlc3MoJ3JpZ2h0JylcIj5cbiAgICA8aWd4LWljb24+bmF2aWdhdGVfbmV4dDwvaWd4LWljb24+XG48L2J1dHRvbj5cblxuPGRpdiAjYnV0dG9uc0NvbnRhaW5lciBbbmdDbGFzc109XCJpc05hcnJvd1dpZHRoID8gJ2lneC1ncmlkX19maWx0ZXJpbmctcm93LWVkaXRpbmctYnV0dG9ucy0tc21hbGwnIDogJ2lneC1ncmlkX19maWx0ZXJpbmctcm93LWVkaXRpbmctYnV0dG9ucydcIj5cbiAgICA8YnV0dG9uIFtkaXNwbGF5RGVuc2l0eV09XCJjb2x1bW4uZ3JpZC5kaXNwbGF5RGVuc2l0eVwiIFtpZ3hCdXR0b25dPVwiaXNOYXJyb3dXaWR0aCA/ICdpY29uJyA6ICdmbGF0J1wiIGlneFJpcHBsZSAoY2xpY2spPVwiY2xlYXJGaWx0ZXJpbmcoKVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFt0YWJpbmRleF09XCJkaXNhYmxlZFwiPlxuICAgICAgICA8aWd4LWljb24+cmVmcmVzaDwvaWd4LWljb24+XG4gICAgICAgIDxzcGFuPnt7aXNOYXJyb3dXaWR0aCA/ICcnIDogZmlsdGVyaW5nU2VydmljZS5ncmlkLnJlc291cmNlU3RyaW5ncy5pZ3hfZ3JpZF9maWx0ZXJfcm93X3Jlc2V0fX08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gICAgPGJ1dHRvbiAjY2xvc2VCdXR0b24gW2Rpc3BsYXlEZW5zaXR5XT1cImNvbHVtbi5ncmlkLmRpc3BsYXlEZW5zaXR5XCIgW2lneEJ1dHRvbl09XCJpc05hcnJvd1dpZHRoID8gJ2ljb24nIDogJ2ZsYXQnXCIgIGlneFJpcHBsZSAoY2xpY2spPVwiY2xvc2UoKVwiPlxuICAgICAgICA8aWd4LWljb24+Y2xvc2U8L2lneC1pY29uPlxuICAgICAgICA8c3Bhbj57e2lzTmFycm93V2lkdGggPyAnJyA6IGZpbHRlcmluZ1NlcnZpY2UuZ3JpZC5yZXNvdXJjZVN0cmluZ3MuaWd4X2dyaWRfZmlsdGVyX3Jvd19jbG9zZX19PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuPC9kaXY+XG4iXX0=