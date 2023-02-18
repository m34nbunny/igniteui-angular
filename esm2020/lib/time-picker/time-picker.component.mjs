import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, NgModule, Output, ViewChild, ContentChild, Inject, LOCALE_ID, Optional, ContentChildren, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl, NG_VALIDATORS } from '@angular/forms';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule, IgxInputGroupComponent } from '../input-group/input-group.component';
import { IgxInputDirective, IgxInputState } from '../directives/input/input.directive';
import { IGX_INPUT_GROUP_TYPE } from '../input-group/public_api';
import { DisplayDensityToken } from '../core/density';
import { IgxItemListDirective, IgxTimeItemDirective, IgxTimePickerTemplateDirective, IgxTimePickerActionsDirective } from './time-picker.directives';
import { noop, fromEvent } from 'rxjs';
import { IGX_TIME_PICKER_COMPONENT } from './time-picker.common';
import { AbsoluteScrollStrategy } from '../services/overlay/scroll';
import { AutoPositionStrategy } from '../services/overlay/position';
import { takeUntil } from 'rxjs/operators';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxMaskModule } from '../directives/mask/mask.directive';
import { IgxDateTimeEditorModule, IgxDateTimeEditorDirective } from '../directives/date-time-editor/date-time-editor.directive';
import { IgxToggleModule, IgxToggleDirective } from '../directives/toggle/toggle.directive';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { isEqual, isDate } from '../core/utils';
import { PickerInteractionMode } from '../date-common/types';
import { IgxTextSelectionModule } from '../directives/text-selection/text-selection.directive';
import { IgxLabelDirective } from '../directives/label/label.directive';
import { PickerBaseDirective } from '../date-common/picker-base.directive';
import { DateTimeUtil } from '../date-common/util/date-time.util';
import { PickerHeaderOrientation } from '../date-common/types';
import { IgxPickerClearComponent, IgxPickersCommonModule } from '../date-common/picker-icons.common';
import { TimeFormatPipe, TimeItemPipe } from './time-picker.pipes';
import * as i0 from "@angular/core";
import * as i1 from "../core/utils";
import * as i2 from "../input-group/input-group.component";
import * as i3 from "../icon/icon.component";
import * as i4 from "../directives/input/input.directive";
import * as i5 from "../directives/date-time-editor/date-time-editor.directive";
import * as i6 from "../directives/text-selection/text-selection.directive";
import * as i7 from "@angular/common";
import * as i8 from "../directives/prefix/prefix.directive";
import * as i9 from "../directives/suffix/suffix.directive";
import * as i10 from "../directives/button/button.directive";
import * as i11 from "../directives/toggle/toggle.directive";
let NEXT_ID = 0;
export class IgxTimePickerComponent extends PickerBaseDirective {
    constructor(element, _localeId, _displayDensityOptions, _inputGroupType, _injector, platform, cdr) {
        super(element, _localeId, _displayDensityOptions, _inputGroupType);
        this.element = element;
        this._localeId = _localeId;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        this._injector = _injector;
        this.platform = platform;
        this.cdr = cdr;
        /**
         * An @Input property that sets the value of the `id` attribute.
         * ```html
         * <igx-time-picker [id]="'igx-time-picker-5'" [displayFormat]="h:mm tt" ></igx-time-picker>
         * ```
         */
        this.id = `igx-time-picker-${NEXT_ID++}`;
        /**
         * The expected user input format and placeholder.
         *
         * @remarks
         * Default is `hh:mm tt`
         *
         * @example
         * ```html
         * <igx-time-picker inputFormat="HH:mm"></igx-time-picker>
         * ```
         */
        this.inputFormat = DateTimeUtil.DEFAULT_TIME_INPUT_FORMAT;
        /**
         * Gets/Sets the interaction mode - dialog or drop down.
         *
         * @example
         * ```html
         * <igx-time-picker mode="dialog"></igx-time-picker>
         * ```
         */
        this.mode = PickerInteractionMode.DropDown;
        /**
         * An @Input property that determines the spin behavior. By default `spinLoop` is set to true.
         * The seconds, minutes and hour spinning will wrap around by default.
         * ```html
         * <igx-time-picker [spinLoop]="false"></igx-time-picker>
         * ```
         */
        this.spinLoop = true;
        /**
         * Sets the orientation of the picker's header.
         *
         * @remarks
         * Available in dialog mode only. Default value is `horizontal`.
         *
         * ```html
         * <igx-time-picker [headerOrientation]="'vertical'"></igx-time-picker>
         * ```
         */
        this.headerOrientation = PickerHeaderOrientation.Horizontal;
        /** @hidden @internal */
        this.readOnly = false;
        /**
         * Emitted after a selection has been done.
         *
         * @example
         * ```html
         * <igx-time-picker (selected)="onSelection($event)"></igx-time-picker>
         * ```
         */
        this.selected = new EventEmitter();
        /**
         * Emitted when the picker's value changes.
         *
         * @remarks
         * Used for `two-way` bindings.
         *
         * @example
         * ```html
         * <igx-time-picker [(value)]="date"></igx-time-picker>
         * ```
         */
        this.valueChange = new EventEmitter();
        /**
         * Emitted when the user types/spins invalid time in the time-picker editor.
         *
         *  @example
         * ```html
         * <igx-time-picker (validationFailed)="onValidationFailed($event)"></igx-time-picker>
         * ```
         */
        this.validationFailed = new EventEmitter();
        /** @hidden */
        this.cleared = false;
        /** @hidden */
        this.isNotEmpty = false;
        /** @hidden @internal */
        this.displayValue = { transform: (date) => this.formatter(date) };
        /** @hidden @internal */
        this.hourItems = [];
        /** @hidden @internal */
        this.minuteItems = [];
        /** @hidden @internal */
        this.secondsItems = [];
        /** @hidden @internal */
        this.ampmItems = [];
        this._resourceStrings = CurrentResourceStrings.TimePickerResStrings;
        this._okButtonLabel = null;
        this._cancelButtonLabel = null;
        this._itemsDelta = { hours: 1, minutes: 1, seconds: 1 };
        this._ngControl = null;
        this._onChangeCallback = noop;
        this._onTouchedCallback = noop;
        this._onValidatorChange = noop;
        this._defaultDialogOverlaySettings = {
            closeOnOutsideClick: true,
            modal: true,
            closeOnEscape: true,
            outlet: this.outlet
        };
        this._defaultDropDownOverlaySettings = {
            target: this.element.nativeElement,
            modal: false,
            closeOnOutsideClick: true,
            scrollStrategy: new AbsoluteScrollStrategy(),
            positionStrategy: new AutoPositionStrategy(),
            outlet: this.outlet
        };
    }
    /**
     * The minimum value the picker will accept.
     *
     * @remarks
     * If a `string` value is passed in, it must be in ISO format.
     *
     * @example
     * ```html
     * <igx-time-picker [minValue]="18:00:00"></igx-time-picker>
     * ```
     */
    set minValue(value) {
        this._minValue = value;
        const date = this.parseToDate(value);
        if (date) {
            this._dateMinValue = new Date();
            this._dateMinValue.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            this.minDropdownValue = this.setMinMaxDropdownValue('min', this._dateMinValue);
        }
        this.setSelectedValue(this._selectedDate);
        this._onValidatorChange();
    }
    get minValue() {
        return this._minValue;
    }
    /**
     * Gets if the dropdown/dialog is collapsed
     *
     * ```typescript
     * let isCollapsed = this.timePicker.collapsed;
     * ```
     */
    get collapsed() {
        return this.toggleRef?.collapsed;
    }
    /**
     * The maximum value the picker will accept.
     *
     * @remarks
     * If a `string` value is passed in, it must be in ISO format.
     *
     * @example
     * ```html
     * <igx-time-picker [maxValue]="20:30:00"></igx-time-picker>
     * ```
     */
    set maxValue(value) {
        this._maxValue = value;
        const date = this.parseToDate(value);
        if (date) {
            this._dateMaxValue = new Date();
            this._dateMaxValue.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            this.maxDropdownValue = this.setMinMaxDropdownValue('max', this._dateMaxValue);
        }
        this.setSelectedValue(this._selectedDate);
        this._onValidatorChange();
    }
    get maxValue() {
        return this._maxValue;
    }
    /** @hidden */
    get showClearButton() {
        if (this.clearComponents.length) {
            return false;
        }
        if (DateTimeUtil.isValidDate(this.value)) {
            // TODO: Update w/ clear behavior
            return this.value.getHours() !== 0 || this.value.getMinutes() !== 0 || this.value.getSeconds() !== 0;
        }
        return !!this.dateTimeEditor.value;
    }
    /** @hidden */
    get showHoursList() {
        return this.inputFormat.indexOf('h') !== -1 || this.inputFormat.indexOf('H') !== -1;
    }
    /** @hidden */
    get showMinutesList() {
        return this.inputFormat.indexOf('m') !== -1;
    }
    /** @hidden */
    get showSecondsList() {
        return this.inputFormat.indexOf('s') !== -1;
    }
    /** @hidden */
    get showAmPmList() {
        return this.inputFormat.indexOf('t') !== -1 || this.inputFormat.indexOf('a') !== -1;
    }
    /** @hidden */
    get isTwelveHourFormat() {
        return this.inputFormat.indexOf('h') !== -1;
    }
    /** @hidden @internal */
    get isDropdown() {
        return this.mode === PickerInteractionMode.DropDown;
    }
    /** @hidden @internal */
    get isVertical() {
        return this.headerOrientation === PickerHeaderOrientation.Vertical;
    }
    /** @hidden @internal */
    get selectedDate() {
        return this._selectedDate;
    }
    /** @hidden @internal */
    get minDateValue() {
        if (!this._dateMinValue) {
            const minDate = new Date();
            minDate.setHours(0, 0, 0, 0);
            return minDate;
        }
        return this._dateMinValue;
    }
    /** @hidden @internal */
    get maxDateValue() {
        if (!this._dateMaxValue) {
            const maxDate = new Date();
            maxDate.setHours(23, 59, 59, 999);
            return maxDate;
        }
        return this._dateMaxValue;
    }
    get required() {
        if (this._ngControl && this._ngControl.control && this._ngControl.control.validator) {
            // Run the validation with empty object to check if required is enabled.
            const error = this._ngControl.control.validator({});
            return !!(error && error.required);
        }
        return false;
    }
    get dialogOverlaySettings() {
        return Object.assign({}, this._defaultDialogOverlaySettings, this.overlaySettings);
    }
    get dropDownOverlaySettings() {
        return Object.assign({}, this._defaultDropDownOverlaySettings, this.overlaySettings);
    }
    /**
     * The currently selected value / time from the drop-down/dialog
     *
     * @remarks
     * The current value is of type `Date`
     *
     * @example
     * ```typescript
     * const newValue: Date = new Date(2000, 2, 2, 10, 15, 15);
     * this.timePicker.value = newValue;
     * ```
     */
    get value() {
        return this._value;
    }
    /**
     * An accessor that allows you to set a time using the `value` input.
     * ```html
     * public date: Date = new Date(Date.now());
     *  //...
     * <igx-time-picker [value]="date" format="h:mm tt"></igx-time-picker>
     * ```
     */
    set value(value) {
        const oldValue = this._value;
        this._value = value;
        const date = this.parseToDate(value);
        if (date) {
            this._dateValue = new Date();
            this._dateValue.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            this.setSelectedValue(this._dateValue);
        }
        else {
            this._dateValue = null;
            this.setSelectedValue(null);
        }
        if (this.dateTimeEditor) {
            this.dateTimeEditor.value = date;
        }
        this.emitValueChange(oldValue, this._value);
        this._onChangeCallback(this._value);
    }
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings() {
        return this._resourceStrings;
    }
    /**
     * An @Input property that renders OK button with custom text. By default `okButtonLabel` is set to OK.
     * ```html
     * <igx-time-picker okButtonLabel='SET' [value]="date" format="h:mm tt"></igx-time-picker>
     * ```
     */
    set okButtonLabel(value) {
        this._okButtonLabel = value;
    }
    /**
     * An accessor that returns the label of ok button.
     */
    get okButtonLabel() {
        if (this._okButtonLabel === null) {
            return this.resourceStrings.igx_time_picker_ok;
        }
        return this._okButtonLabel;
    }
    /**
     * An @Input property that renders cancel button with custom text.
     * By default `cancelButtonLabel` is set to Cancel.
     * ```html
     * <igx-time-picker cancelButtonLabel='Exit' [value]="date" format="h:mm tt"></igx-time-picker>
     * ```
     */
    set cancelButtonLabel(value) {
        this._cancelButtonLabel = value;
    }
    /**
     * An accessor that returns the label of cancel button.
     */
    get cancelButtonLabel() {
        if (this._cancelButtonLabel === null) {
            return this.resourceStrings.igx_time_picker_cancel;
        }
        return this._cancelButtonLabel;
    }
    /**
     * Delta values used to increment or decrement each editor date part on spin actions and
     * to display time portions in the dropdown/dialog.
     * By default `itemsDelta` is set to `{hour: 1, minute: 1, second: 1}`
     * ```html
     * <igx-time-picker [itemsDelta]="{hour:3, minute:5, second:10}" id="time-picker"></igx-time-picker>
     * ```
     */
    set itemsDelta(value) {
        Object.assign(this._itemsDelta, value);
    }
    get itemsDelta() {
        return this._itemsDelta;
    }
    /** @hidden @internal */
    onKeyDown(event) {
        switch (event.key) {
            case this.platform.KEYMAP.ARROW_UP:
                if (event.altKey && this.isDropdown) {
                    this.close();
                }
                break;
            case this.platform.KEYMAP.ARROW_DOWN:
                if (event.altKey && this.isDropdown) {
                    this.open();
                }
                break;
            case this.platform.KEYMAP.ESCAPE:
                this.cancelButtonClick();
                break;
            case this.platform.KEYMAP.SPACE:
                this.open();
                event.preventDefault();
                break;
        }
    }
    /** @hidden @internal */
    getPartValue(value, type) {
        const inputDateParts = DateTimeUtil.parseDateTimeFormat(this.inputFormat);
        const part = inputDateParts.find(element => element.type === type);
        return DateTimeUtil.getPartValue(value, part, part.format.length);
    }
    /** @hidden @internal */
    toISOString(value) {
        return value.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
    // #region ControlValueAccessor
    /** @hidden @internal */
    writeValue(value) {
        this._value = value;
        const date = this.parseToDate(value);
        if (date) {
            this._dateValue = new Date();
            this._dateValue.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
            this.setSelectedValue(this._dateValue);
        }
        else {
            this.setSelectedValue(null);
        }
        if (this.dateTimeEditor) {
            this.dateTimeEditor.value = date;
        }
    }
    /** @hidden @internal */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /** @hidden @internal */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /** @hidden @internal */
    registerOnValidatorChange(fn) {
        this._onValidatorChange = fn;
    }
    /** @hidden @internal */
    validate(control) {
        if (!control.value) {
            return null;
        }
        // InvalidDate handling
        if (isDate(control.value) && !DateTimeUtil.isValidDate(control.value)) {
            return { value: true };
        }
        const errors = {};
        const value = DateTimeUtil.isValidDate(control.value) ? control.value : DateTimeUtil.parseIsoDate(control.value);
        Object.assign(errors, DateTimeUtil.validateMinMax(value, this.minValue, this.maxValue, true, false));
        return Object.keys(errors).length > 0 ? errors : null;
    }
    /** @hidden @internal */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    //#endregion
    /** @hidden */
    ngOnInit() {
        this._ngControl = this._injector.get(NgControl, null);
        this.minDropdownValue = this.setMinMaxDropdownValue('min', this.minDateValue);
        this.maxDropdownValue = this.setMinMaxDropdownValue('max', this.maxDateValue);
        this.setSelectedValue(this._dateValue);
    }
    /** @hidden */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscribeToDateEditorEvents();
        this.subscribeToToggleDirectiveEvents();
        this._defaultDropDownOverlaySettings.excludeFromOutsideClick = [this._inputGroup.element.nativeElement];
        fromEvent(this.inputDirective.nativeElement, 'blur')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
            if (this.collapsed) {
                this.updateValidityOnBlur();
            }
        });
        this.subToIconsClicked(this.clearComponents, () => this.clear());
        this.clearComponents.changes.pipe(takeUntil(this._destroy$))
            .subscribe(() => this.subToIconsClicked(this.clearComponents, () => this.clear()));
        if (this._ngControl) {
            this._statusChanges$ = this._ngControl.statusChanges.subscribe(this.onStatusChanged.bind(this));
            this._inputGroup.isRequired = this.required;
            this.cdr.detectChanges();
        }
    }
    /** @hidden */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._statusChanges$) {
            this._statusChanges$.unsubscribe();
        }
    }
    /** @hidden */
    getEditElement() {
        return this.dateTimeEditor.nativeElement;
    }
    /**
     * Opens the picker's dialog UI.
     *
     * @param settings OverlaySettings - the overlay settings to use for positioning the drop down or dialog container according to
     * ```html
     * <igx-time-picker #picker [value]="date"></igx-time-picker>
     * <button (click)="picker.open()">Open Dialog</button>
     * ```
     */
    open(settings) {
        if (this.disabled || !this.toggleRef.collapsed) {
            return;
        }
        this.setSelectedValue(this._dateValue);
        const overlaySettings = Object.assign({}, this.isDropdown
            ? this.dropDownOverlaySettings
            : this.dialogOverlaySettings, settings);
        this.toggleRef.open(overlaySettings);
    }
    /**
     * Closes the dropdown/dialog.
     * ```html
     * <igx-time-picker #timePicker></igx-time-picker>
     * ```
     * ```typescript
     * @ViewChild('timePicker', { read: IgxTimePickerComponent }) picker: IgxTimePickerComponent;
     * picker.close();
     * ```
     */
    close() {
        this.toggleRef.close();
    }
    toggle(settings) {
        if (this.toggleRef.collapsed) {
            this.open(settings);
        }
        else {
            this.close();
        }
    }
    /**
     * Clears the time picker value if it is a `string` or resets the time to `00:00:00` if the value is a Date object.
     *
     * @example
     * ```typescript
     * this.timePicker.clear();
     * ```
     */
    clear() {
        if (this.disabled) {
            return;
        }
        if (!this.toggleRef.collapsed) {
            this.close();
        }
        if (DateTimeUtil.isValidDate(this.value)) {
            const oldValue = new Date(this.value);
            this.value.setHours(0, 0, 0);
            if (this.value.getTime() !== oldValue.getTime()) {
                this.emitValueChange(oldValue, this.value);
                this._dateValue.setHours(0, 0, 0);
                this.dateTimeEditor.value = new Date(this.value);
                this.setSelectedValue(this._dateValue);
            }
        }
        else {
            this.value = null;
        }
    }
    /**
     * Selects time from the igxTimePicker.
     *
     * @example
     * ```typescript
     * this.timePicker.select(date);
     *
     * @param date Date object containing the time to be selected.
     */
    select(date) {
        this.value = date;
    }
    /**
     * Increment a specified `DatePart`.
     *
     * @param datePart The optional DatePart to increment. Defaults to Hour.
     * @param delta The optional delta to increment by. Overrides `itemsDelta`.
     * @example
     * ```typescript
     * this.timePicker.increment(DatePart.Hours);
     * ```
     */
    increment(datePart, delta) {
        this.dateTimeEditor.increment(datePart, delta);
    }
    /**
     * Decrement a specified `DatePart`
     *
     * @param datePart The optional DatePart to decrement. Defaults to Hour.
     * @param delta The optional delta to decrement by. Overrides `itemsDelta`.
     * @example
     * ```typescript
     * this.timePicker.decrement(DatePart.Seconds);
     * ```
     */
    decrement(datePart, delta) {
        this.dateTimeEditor.decrement(datePart, delta);
    }
    /** @hidden @internal */
    cancelButtonClick() {
        this.setSelectedValue(this._dateValue);
        this.dateTimeEditor.value = this.parseToDate(this.value);
        this.close();
    }
    /** @hidden @internal */
    okButtonClick() {
        this.updateValue(this._selectedDate);
        this.close();
    }
    /** @hidden @internal */
    onItemClick(item, dateType) {
        let date = new Date(this._selectedDate);
        switch (dateType) {
            case 'hourList':
                let ampm;
                const selectedHour = parseInt(item, 10);
                let hours = selectedHour;
                if (this.showAmPmList) {
                    ampm = this.getPartValue(date, 'ampm');
                    hours = this.toTwentyFourHourFormat(hours, ampm);
                    const minHours = this.minDropdownValue?.getHours() || 0;
                    const maxHours = this.maxDropdownValue?.getHours() || 24;
                    if (hours < minHours || hours > maxHours) {
                        hours = hours < 12 ? hours + 12 : hours - 12;
                    }
                }
                date.setHours(hours);
                date = this.validateDropdownValue(date);
                if (this.valueInRange(date, this.minDropdownValue, this.maxDropdownValue)) {
                    this.setSelectedValue(date);
                }
                break;
            case 'minuteList': {
                const minutes = parseInt(item, 10);
                date.setMinutes(minutes);
                date = this.validateDropdownValue(date);
                this.setSelectedValue(date);
                break;
            }
            case 'secondsList': {
                const seconds = parseInt(item, 10);
                date.setSeconds(seconds);
                if (this.valueInRange(date, this.minDropdownValue, this.maxDropdownValue)) {
                    this.setSelectedValue(date);
                }
                break;
            }
            case 'ampmList': {
                let hour = this._selectedDate.getHours();
                hour = item === 'AM' ? hour - 12 : hour + 12;
                date.setHours(hour);
                date = this.validateDropdownValue(date, true);
                this.setSelectedValue(date);
                break;
            }
        }
        this.updateEditorValue();
    }
    /** @hidden @internal */
    nextHour(delta) {
        delta = delta > 0 ? 1 : -1;
        const previousDate = new Date(this._selectedDate);
        const minHours = this.minDropdownValue?.getHours();
        const maxHours = this.maxDropdownValue?.getHours();
        const previousHours = previousDate.getHours();
        let hours = previousHours + delta * this.itemsDelta.hours;
        if ((previousHours === maxHours && delta > 0) || (previousHours === minHours && delta < 0)) {
            hours = !this.spinLoop ? previousHours : delta > 0 ? minHours : maxHours;
        }
        this._selectedDate.setHours(hours);
        this._selectedDate = this.validateDropdownValue(this._selectedDate);
        this._selectedDate = new Date(this._selectedDate);
        this.updateEditorValue();
    }
    /** @hidden @internal */
    nextMinute(delta) {
        delta = delta > 0 ? 1 : -1;
        const minHours = this.minDropdownValue.getHours();
        const maxHours = this.maxDropdownValue.getHours();
        const hours = this._selectedDate.getHours();
        let minutes = this._selectedDate.getMinutes();
        const minMinutes = hours === minHours ? this.minDropdownValue.getMinutes() : 0;
        const maxMinutes = hours === maxHours ? this.maxDropdownValue.getMinutes() :
            60 % this.itemsDelta.minutes > 0 ? 60 - (60 % this.itemsDelta.minutes) :
                60 - this.itemsDelta.minutes;
        if ((delta < 0 && minutes === minMinutes) || (delta > 0 && minutes === maxMinutes)) {
            minutes = this.spinLoop && minutes === minMinutes ? maxMinutes : this.spinLoop && minutes === maxMinutes ? minMinutes : minutes;
        }
        else {
            minutes = minutes + delta * this.itemsDelta.minutes;
        }
        this._selectedDate.setMinutes(minutes);
        this._selectedDate = this.validateDropdownValue(this._selectedDate);
        this._selectedDate = new Date(this._selectedDate);
        this.updateEditorValue();
    }
    /** @hidden @internal */
    nextSeconds(delta) {
        delta = delta > 0 ? 1 : -1;
        const minHours = this.minDropdownValue.getHours();
        const maxHours = this.maxDropdownValue.getHours();
        const hours = this._selectedDate.getHours();
        const minutes = this._selectedDate.getMinutes();
        const minMinutes = this.minDropdownValue.getMinutes();
        const maxMinutes = this.maxDropdownValue.getMinutes();
        let seconds = this._selectedDate.getSeconds();
        const minSeconds = (hours === minHours && minutes === minMinutes) ? this.minDropdownValue.getSeconds() : 0;
        const maxSeconds = (hours === maxHours && minutes === maxMinutes) ? this.maxDropdownValue.getSeconds() :
            60 % this.itemsDelta.seconds > 0 ? 60 - (60 % this.itemsDelta.seconds) :
                60 - this.itemsDelta.seconds;
        if ((delta < 0 && seconds === minSeconds) || (delta > 0 && seconds === maxSeconds)) {
            seconds = this.spinLoop && seconds === minSeconds ? maxSeconds : this.spinLoop && seconds === maxSeconds ? minSeconds : seconds;
        }
        else {
            seconds = seconds + delta * this.itemsDelta.seconds;
        }
        this._selectedDate.setSeconds(seconds);
        this._selectedDate = this.validateDropdownValue(this._selectedDate);
        this._selectedDate = new Date(this._selectedDate);
        this.updateEditorValue();
    }
    /** @hidden @internal */
    nextAmPm(delta) {
        const ampm = this.getPartValue(this._selectedDate, 'ampm');
        if (!delta || (ampm === 'AM' && delta > 0) || (ampm === 'PM' && delta < 0)) {
            let hours = this._selectedDate.getHours();
            const sign = hours < 12 ? 1 : -1;
            hours = hours + sign * 12;
            this._selectedDate.setHours(hours);
            this._selectedDate = this.validateDropdownValue(this._selectedDate, true);
            this._selectedDate = new Date(this._selectedDate);
            this.updateEditorValue();
        }
    }
    /** @hidden @internal */
    setSelectedValue(value) {
        this._selectedDate = value ? new Date(value) : null;
        if (!DateTimeUtil.isValidDate(this._selectedDate)) {
            this._selectedDate = new Date(this.minDropdownValue);
            return;
        }
        if (this.minValue && DateTimeUtil.lessThanMinValue(this._selectedDate, this.minDropdownValue, true, false)) {
            this._selectedDate = new Date(this.minDropdownValue);
            return;
        }
        if (this.maxValue && DateTimeUtil.greaterThanMaxValue(this._selectedDate, this.maxDropdownValue, true, false)) {
            this._selectedDate = new Date(this.maxDropdownValue);
            return;
        }
        if (this._selectedDate.getHours() % this.itemsDelta.hours > 0) {
            this._selectedDate.setHours(this._selectedDate.getHours() + this.itemsDelta.hours - this._selectedDate.getHours() % this.itemsDelta.hours, 0, 0);
        }
        if (this._selectedDate.getMinutes() % this.itemsDelta.minutes > 0) {
            this._selectedDate.setHours(this._selectedDate.getHours(), this._selectedDate.getMinutes() + this.itemsDelta.minutes - this._selectedDate.getMinutes() % this.itemsDelta.minutes, 0);
        }
        if (this._selectedDate.getSeconds() % this.itemsDelta.seconds > 0) {
            this._selectedDate.setSeconds(this._selectedDate.getSeconds() + this.itemsDelta.seconds - this._selectedDate.getSeconds() % this.itemsDelta.seconds);
        }
    }
    onStatusChanged() {
        if ((this._ngControl.control.touched || this._ngControl.control.dirty) &&
            (this._ngControl.control.validator || this._ngControl.control.asyncValidator)) {
            if (this._inputGroup.isFocused) {
                this.inputDirective.valid = this._ngControl.valid ? IgxInputState.VALID : IgxInputState.INVALID;
            }
            else {
                this.inputDirective.valid = this._ngControl.valid ? IgxInputState.INITIAL : IgxInputState.INVALID;
            }
        }
        else {
            // B.P. 18 May 2021: IgxDatePicker does not reset its state upon resetForm #9526
            this.inputDirective.valid = IgxInputState.INITIAL;
        }
        if (this._inputGroup && this._inputGroup.isRequired !== this.required) {
            this._inputGroup.isRequired = this.required;
        }
    }
    setMinMaxDropdownValue(type, time) {
        let delta;
        const sign = type === 'min' ? 1 : -1;
        const hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        if (this.showHoursList && hours % this.itemsDelta.hours > 0) {
            delta = type === 'min' ? this.itemsDelta.hours - hours % this.itemsDelta.hours
                : hours % this.itemsDelta.hours;
            minutes = type === 'min' ? 0
                : 60 % this.itemsDelta.minutes > 0 ? 60 - 60 % this.itemsDelta.minutes
                    : 60 - this.itemsDelta.minutes;
            seconds = type === 'min' ? 0
                : 60 % this.itemsDelta.seconds > 0 ? 60 - 60 % this.itemsDelta.seconds
                    : 60 - this.itemsDelta.seconds;
            time.setHours(hours + sign * delta, minutes, seconds);
        }
        else if (this.showMinutesList && minutes % this.itemsDelta.minutes > 0) {
            delta = type === 'min' ? this.itemsDelta.minutes - minutes % this.itemsDelta.minutes
                : minutes % this.itemsDelta.minutes;
            seconds = type === 'min' ? 0
                : 60 % this.itemsDelta.seconds > 0 ? 60 - 60 % this.itemsDelta.seconds
                    : 60 - this.itemsDelta.seconds;
            time.setHours(hours, minutes + sign * delta, seconds);
        }
        else if (this.showSecondsList && seconds % this.itemsDelta.seconds > 0) {
            delta = type === 'min' ? this.itemsDelta.seconds - seconds % this.itemsDelta.seconds
                : seconds % this.itemsDelta.seconds;
            time.setHours(hours, minutes, seconds + sign * delta);
        }
        return time;
    }
    initializeContainer() {
        requestAnimationFrame(() => {
            if (this.hourList) {
                this.hourList.nativeElement.focus();
            }
            else if (this.minuteList) {
                this.minuteList.nativeElement.focus();
            }
            else if (this.secondsList) {
                this.secondsList.nativeElement.focus();
            }
        });
    }
    validateDropdownValue(date, isAmPm = false) {
        if (date > this.maxDropdownValue) {
            if (isAmPm && date.getHours() !== this.maxDropdownValue.getHours()) {
                date.setHours(12);
            }
            else {
                date = new Date(this.maxDropdownValue);
            }
        }
        if (date < this.minDropdownValue) {
            date = new Date(this.minDropdownValue);
        }
        return date;
    }
    emitValueChange(oldValue, newValue) {
        if (!isEqual(oldValue, newValue)) {
            this.valueChange.emit(newValue);
        }
    }
    emitValidationFailedEvent(previousValue) {
        const args = {
            owner: this,
            previousValue,
            currentValue: this.value
        };
        this.validationFailed.emit(args);
    }
    updateValidityOnBlur() {
        this._onTouchedCallback();
        if (this._ngControl) {
            if (!this._ngControl.valid) {
                this.inputDirective.valid = IgxInputState.INVALID;
            }
            else {
                this.inputDirective.valid = IgxInputState.INITIAL;
            }
        }
    }
    valueInRange(value, minValue, maxValue) {
        if (minValue && DateTimeUtil.lessThanMinValue(value, minValue, true, false)) {
            return false;
        }
        if (maxValue && DateTimeUtil.greaterThanMaxValue(value, maxValue, true, false)) {
            return false;
        }
        return true;
    }
    parseToDate(value) {
        return DateTimeUtil.isValidDate(value) ? value : DateTimeUtil.parseIsoDate(value);
    }
    toTwentyFourHourFormat(hour, ampm) {
        if (ampm === 'PM' && hour < 12) {
            hour += 12;
        }
        else if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }
        return hour;
    }
    updateValue(newValue) {
        if (!this.value) {
            this.value = newValue ? new Date(newValue) : newValue;
        }
        else if (isDate(this.value)) {
            const date = new Date(this.value);
            date.setHours(newValue?.getHours() || 0, newValue?.getMinutes() || 0, newValue?.getSeconds() || 0);
            this.value = date;
        }
        else {
            this.value = newValue ? this.toISOString(newValue) : newValue;
        }
    }
    updateEditorValue() {
        const date = this.dateTimeEditor.value ? new Date(this.dateTimeEditor.value) : new Date();
        date.setHours(this._selectedDate.getHours(), this._selectedDate.getMinutes(), this._selectedDate.getSeconds());
        this.dateTimeEditor.value = date;
    }
    subscribeToDateEditorEvents() {
        this.dateTimeEditor.valueChange.pipe(
        // internal date editor directive is only used w/ Date object values:
        takeUntil(this._destroy$)).subscribe((date) => {
            this.updateValue(date);
        });
        this.dateTimeEditor.validationFailed.pipe(takeUntil(this._destroy$)).subscribe((event) => {
            this.emitValidationFailedEvent(event.oldValue);
        });
    }
    subscribeToToggleDirectiveEvents() {
        if (this.toggleRef) {
            if (this._inputGroup) {
                this.toggleRef.element.style.width = this._inputGroup.element.nativeElement.getBoundingClientRect().width + 'px';
            }
            this.toggleRef.opening.pipe(takeUntil(this._destroy$)).subscribe((e) => {
                const args = { owner: this, event: e.event, cancel: false };
                this.opening.emit(args);
                e.cancel = args.cancel;
                if (args.cancel) {
                    return;
                }
                this.initializeContainer();
            });
            this.toggleRef.opened.pipe(takeUntil(this._destroy$)).subscribe(() => {
                this.opened.emit({ owner: this });
            });
            this.toggleRef.closed.pipe(takeUntil(this._destroy$)).subscribe(() => {
                this.closed.emit({ owner: this });
            });
            this.toggleRef.closing.pipe(takeUntil(this._destroy$)).subscribe((e) => {
                const args = { owner: this, event: e.event, cancel: false };
                this.closing.emit(args);
                e.cancel = args.cancel;
                if (args.cancel) {
                    return;
                }
                const value = this.parseToDate(this.value);
                if (this.dateTimeEditor.value?.getTime() !== value?.getTime()) {
                    this.updateValue(this._selectedDate);
                }
                // Do not focus the input if clicking outside in dropdown mode
                const input = this.getEditElement();
                if (input && !(e.event && this.isDropdown)) {
                    input.focus();
                }
                else {
                    this.updateValidityOnBlur();
                }
            });
        }
    }
}
IgxTimePickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTimePickerComponent, deps: [{ token: i0.ElementRef }, { token: LOCALE_ID }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }, { token: i0.Injector }, { token: i1.PlatformUtil }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
IgxTimePickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTimePickerComponent, selector: "igx-time-picker", inputs: { id: "id", displayFormat: "displayFormat", inputFormat: "inputFormat", mode: "mode", minValue: "minValue", maxValue: "maxValue", spinLoop: "spinLoop", formatter: "formatter", headerOrientation: "headerOrientation", readOnly: "readOnly", value: "value", resourceStrings: "resourceStrings", okButtonLabel: "okButtonLabel", cancelButtonLabel: "cancelButtonLabel", itemsDelta: "itemsDelta" }, outputs: { selected: "selected", valueChange: "valueChange", validationFailed: "validationFailed" }, host: { listeners: { "keydown": "onKeyDown($event)" }, properties: { "attr.id": "this.id" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: IgxTimePickerComponent,
            multi: true
        },
        {
            provide: IGX_TIME_PICKER_COMPONENT,
            useExisting: IgxTimePickerComponent
        },
        {
            provide: NG_VALIDATORS,
            useExisting: IgxTimePickerComponent,
            multi: true
        }
    ], queries: [{ propertyName: "label", first: true, predicate: IgxLabelDirective, descendants: true }, { propertyName: "timePickerActionsDirective", first: true, predicate: IgxTimePickerActionsDirective, descendants: true }, { propertyName: "clearComponents", predicate: IgxPickerClearComponent }], viewQueries: [{ propertyName: "hourList", first: true, predicate: ["hourList"], descendants: true }, { propertyName: "minuteList", first: true, predicate: ["minuteList"], descendants: true }, { propertyName: "secondsList", first: true, predicate: ["secondsList"], descendants: true }, { propertyName: "ampmList", first: true, predicate: ["ampmList"], descendants: true }, { propertyName: "inputDirective", first: true, predicate: IgxInputDirective, descendants: true, read: IgxInputDirective }, { propertyName: "_inputGroup", first: true, predicate: IgxInputGroupComponent, descendants: true }, { propertyName: "dateTimeEditor", first: true, predicate: IgxDateTimeEditorDirective, descendants: true, static: true }, { propertyName: "toggleRef", first: true, predicate: IgxToggleDirective, descendants: true }], usesInheritance: true, ngImport: i0, template: "<igx-input-group [displayDensity]=\"displayDensity\" [type]=\"type\" [suppressInputAutofocus]=\"this.isDropdown\">\n    <input [displayValuePipe]=\"this.formatter ? displayValue : null\" igxInput [igxDateTimeEditor]=\"this.inputFormat\"\n        type=\"text\" [readonly]=\"!this.isDropdown || this.readOnly\" [minValue]=\"this.minValue\" [maxValue]=\"this.maxValue\"\n        [locale]=\"this.locale\" [spinDelta]=\"this.itemsDelta\" [spinLoop]=\"this.spinLoop\" [placeholder]=\"this.placeholder\"\n        [disabled]=\"this.disabled\" [displayFormat]=\"this.displayFormat\"\n        [igxTextSelection]=\"this.isDropdown && !this.readOnly\" role=\"combobox\" aria-haspopup=\"dialog\"\n        [attr.aria-expanded]=\"!this.toggleDirective.collapsed\" [attr.aria-labelledby]=\"this.label?.id\"\n        (click)=\"!this.isDropdown && this.toggle()\"/>\n\n    <igx-prefix *ngIf=\"!this.toggleComponents.length\" (click)=\"this.toggle()\">\n        <igx-icon [title]=\"this.value ? resourceStrings.igx_time_picker_change_time : resourceStrings.igx_time_picker_choose_time\">access_time</igx-icon>\n    </igx-prefix>\n\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n    </ng-container>\n\n    <igx-suffix *ngIf=\"this.showClearButton\" (click)=\"this.clear(); $event.stopPropagation()\">\n        <igx-icon>clear</igx-icon>\n    </igx-suffix>\n\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint\">\n        <ng-content select=\"igx-hint,[igxHint]\"></ng-content>\n    </ng-container>\n</igx-input-group>\n\n<ng-template #defaultTimePickerActions>\n    <div *ngIf=\"this.cancelButtonLabel || this.okButtonLabel\" class=\"igx-time-picker__buttons\">\n        <button *ngIf=\"this.cancelButtonLabel\" igxButton=\"flat\" (click)=\"this.cancelButtonClick()\">\n            {{this.cancelButtonLabel}}\n        </button>\n        <button *ngIf=\"this.okButtonLabel\" igxButton=\"flat\" (click)=\"this.okButtonClick()\">\n            {{this.okButtonLabel}}\n        </button>\n    </div>\n</ng-template>\n\n<div #toggleDirective=\"toggle\" igxToggle role=\"dialog\" class=\"igx-time-picker\"\n    [ngClass]=\"{'igx-time-picker--dropdown': this.isDropdown, 'igx-time-picker--vertical': this.isVertical && !this.isDropdown}\">\n    <div *ngIf=\"!this.isDropdown\" class=\"igx-time-picker__header\">\n        <h2 class=\"igx-time-picker__header-hour\">\n            <span>{{ this.selectedDate | timeFormatPipe }}</span>\n        </h2>\n    </div>\n    <div class=\"igx-time-picker__main\">\n        <div class=\"igx-time-picker__body\">\n            <div *ngIf=\"this.showHoursList\" #hourList [igxItemList]=\"'hourList'\">\n                <span [igxTimeItem]=\"hour\" #timeItem=\"timeItem\" aria-label=\"hour\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? timeItem.hourValue : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let hour of hourItems | timeItemPipe:'hour':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ hour }}</span>\n            </div>\n            <div *ngIf=\"this.showMinutesList\" #minuteList [igxItemList]=\"'minuteList'\">\n                <span [igxTimeItem]=\"minute\" #timeItem=\"timeItem\" aria-label=\"minutes\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? minute : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let minute of minuteItems | timeItemPipe:'minutes':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ minute }}</span>\n            </div>\n            <div *ngIf=\"this.showSecondsList\" #secondsList [igxItemList]=\"'secondsList'\">\n                <span [igxTimeItem]=\"seconds\" #timeItem=\"timeItem\" aria-label=\"seconds\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? seconds : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let seconds of secondsItems | timeItemPipe:'seconds':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ seconds }}</span>\n            </div>\n            <div *ngIf=\"this.showAmPmList\" #ampmList [igxItemList]=\"'ampmList'\">\n                <span [igxTimeItem]=\"ampm\" #timeItem=\"timeItem\" aria-label=\"ampm\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? ampm : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let ampm of ampmItems | timeItemPipe:'ampm':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ ampm }}</span>\n            </div>\n        </div>\n        <ng-container\n            *ngTemplateOutlet=\"timePickerActionsDirective ? timePickerActionsDirective.template : defaultTimePickerActions\">\n        </ng-container>\n    </div>\n</div>\n", styles: [":host{display:block}\n"], components: [{ type: i0.forwardRef(function () { return i2.IgxInputGroupComponent; }), selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i0.forwardRef(function () { return i3.IgxIconComponent; }), selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i0.forwardRef(function () { return i4.IgxInputDirective; }), selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i0.forwardRef(function () { return i5.IgxDateTimeEditorDirective; }), selector: "[igxDateTimeEditor]", inputs: ["locale", "minValue", "maxValue", "spinLoop", "displayFormat", "igxDateTimeEditor", "value", "spinDelta"], outputs: ["valueChange", "validationFailed"], exportAs: ["igxDateTimeEditor"] }, { type: i0.forwardRef(function () { return i6.IgxTextSelectionDirective; }), selector: "[igxTextSelection]", inputs: ["igxTextSelection"], exportAs: ["igxTextSelection"] }, { type: i0.forwardRef(function () { return i7.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i0.forwardRef(function () { return i8.IgxPrefixDirective; }), selector: "igx-prefix,[igxPrefix]" }, { type: i0.forwardRef(function () { return i9.IgxSuffixDirective; }), selector: "igx-suffix,[igxSuffix]" }, { type: i0.forwardRef(function () { return i10.IgxButtonDirective; }), selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i0.forwardRef(function () { return i11.IgxToggleDirective; }), selector: "[igxToggle]", inputs: ["id"], outputs: ["opened", "opening", "closed", "closing", "appended"], exportAs: ["toggle"] }, { type: i0.forwardRef(function () { return i7.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i0.forwardRef(function () { return IgxItemListDirective; }), selector: "[igxItemList]", inputs: ["igxItemList"] }, { type: i0.forwardRef(function () { return i7.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i0.forwardRef(function () { return IgxTimeItemDirective; }), selector: "[igxTimeItem]", inputs: ["igxTimeItem"], exportAs: ["timeItem"] }, { type: i0.forwardRef(function () { return i7.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "timeFormatPipe": i0.forwardRef(function () { return TimeFormatPipe; }), "timeItemPipe": i0.forwardRef(function () { return TimeItemPipe; }) } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTimePickerComponent, decorators: [{
            type: Component,
            args: [{ providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: IgxTimePickerComponent,
                            multi: true
                        },
                        {
                            provide: IGX_TIME_PICKER_COMPONENT,
                            useExisting: IgxTimePickerComponent
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: IgxTimePickerComponent,
                            multi: true
                        }
                    ], selector: 'igx-time-picker', styles: [
                        `:host {
            display: block;
        }`
                    ], template: "<igx-input-group [displayDensity]=\"displayDensity\" [type]=\"type\" [suppressInputAutofocus]=\"this.isDropdown\">\n    <input [displayValuePipe]=\"this.formatter ? displayValue : null\" igxInput [igxDateTimeEditor]=\"this.inputFormat\"\n        type=\"text\" [readonly]=\"!this.isDropdown || this.readOnly\" [minValue]=\"this.minValue\" [maxValue]=\"this.maxValue\"\n        [locale]=\"this.locale\" [spinDelta]=\"this.itemsDelta\" [spinLoop]=\"this.spinLoop\" [placeholder]=\"this.placeholder\"\n        [disabled]=\"this.disabled\" [displayFormat]=\"this.displayFormat\"\n        [igxTextSelection]=\"this.isDropdown && !this.readOnly\" role=\"combobox\" aria-haspopup=\"dialog\"\n        [attr.aria-expanded]=\"!this.toggleDirective.collapsed\" [attr.aria-labelledby]=\"this.label?.id\"\n        (click)=\"!this.isDropdown && this.toggle()\"/>\n\n    <igx-prefix *ngIf=\"!this.toggleComponents.length\" (click)=\"this.toggle()\">\n        <igx-icon [title]=\"this.value ? resourceStrings.igx_time_picker_change_time : resourceStrings.igx_time_picker_choose_time\">access_time</igx-icon>\n    </igx-prefix>\n\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n    </ng-container>\n\n    <igx-suffix *ngIf=\"this.showClearButton\" (click)=\"this.clear(); $event.stopPropagation()\">\n        <igx-icon>clear</igx-icon>\n    </igx-suffix>\n\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint\">\n        <ng-content select=\"igx-hint,[igxHint]\"></ng-content>\n    </ng-container>\n</igx-input-group>\n\n<ng-template #defaultTimePickerActions>\n    <div *ngIf=\"this.cancelButtonLabel || this.okButtonLabel\" class=\"igx-time-picker__buttons\">\n        <button *ngIf=\"this.cancelButtonLabel\" igxButton=\"flat\" (click)=\"this.cancelButtonClick()\">\n            {{this.cancelButtonLabel}}\n        </button>\n        <button *ngIf=\"this.okButtonLabel\" igxButton=\"flat\" (click)=\"this.okButtonClick()\">\n            {{this.okButtonLabel}}\n        </button>\n    </div>\n</ng-template>\n\n<div #toggleDirective=\"toggle\" igxToggle role=\"dialog\" class=\"igx-time-picker\"\n    [ngClass]=\"{'igx-time-picker--dropdown': this.isDropdown, 'igx-time-picker--vertical': this.isVertical && !this.isDropdown}\">\n    <div *ngIf=\"!this.isDropdown\" class=\"igx-time-picker__header\">\n        <h2 class=\"igx-time-picker__header-hour\">\n            <span>{{ this.selectedDate | timeFormatPipe }}</span>\n        </h2>\n    </div>\n    <div class=\"igx-time-picker__main\">\n        <div class=\"igx-time-picker__body\">\n            <div *ngIf=\"this.showHoursList\" #hourList [igxItemList]=\"'hourList'\">\n                <span [igxTimeItem]=\"hour\" #timeItem=\"timeItem\" aria-label=\"hour\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? timeItem.hourValue : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let hour of hourItems | timeItemPipe:'hour':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ hour }}</span>\n            </div>\n            <div *ngIf=\"this.showMinutesList\" #minuteList [igxItemList]=\"'minuteList'\">\n                <span [igxTimeItem]=\"minute\" #timeItem=\"timeItem\" aria-label=\"minutes\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? minute : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let minute of minuteItems | timeItemPipe:'minutes':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ minute }}</span>\n            </div>\n            <div *ngIf=\"this.showSecondsList\" #secondsList [igxItemList]=\"'secondsList'\">\n                <span [igxTimeItem]=\"seconds\" #timeItem=\"timeItem\" aria-label=\"seconds\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? seconds : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let seconds of secondsItems | timeItemPipe:'seconds':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ seconds }}</span>\n            </div>\n            <div *ngIf=\"this.showAmPmList\" #ampmList [igxItemList]=\"'ampmList'\">\n                <span [igxTimeItem]=\"ampm\" #timeItem=\"timeItem\" aria-label=\"ampm\"\n                    [attr.role]=\"timeItem.isSelectedTime ? 'spinbutton' : null\"\n                    [attr.aria-valuenow]=\"timeItem.isSelectedTime ? ampm : null\"\n                    [attr.aria-valuemin]=\"timeItem.isSelectedTime ? timeItem.minValue : null\"\n                    [attr.aria-valuemax]=\"timeItem.isSelectedTime ? timeItem.maxValue : null\"\n                    *ngFor=\"let ampm of ampmItems | timeItemPipe:'ampm':this.selectedDate:this.minDropdownValue:this.maxDropdownValue\">{{ ampm }}</span>\n            </div>\n        </div>\n        <ng-container\n            *ngTemplateOutlet=\"timePickerActionsDirective ? timePickerActionsDirective.template : defaultTimePickerActions\">\n        </ng-container>\n    </div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_INPUT_GROUP_TYPE]
                }] }, { type: i0.Injector }, { type: i1.PlatformUtil }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], displayFormat: [{
                type: Input
            }], inputFormat: [{
                type: Input
            }], mode: [{
                type: Input
            }], minValue: [{
                type: Input
            }], maxValue: [{
                type: Input
            }], spinLoop: [{
                type: Input
            }], formatter: [{
                type: Input
            }], headerOrientation: [{
                type: Input
            }], readOnly: [{
                type: Input
            }], selected: [{
                type: Output
            }], valueChange: [{
                type: Output
            }], validationFailed: [{
                type: Output
            }], hourList: [{
                type: ViewChild,
                args: ['hourList']
            }], minuteList: [{
                type: ViewChild,
                args: ['minuteList']
            }], secondsList: [{
                type: ViewChild,
                args: ['secondsList']
            }], ampmList: [{
                type: ViewChild,
                args: ['ampmList']
            }], clearComponents: [{
                type: ContentChildren,
                args: [IgxPickerClearComponent]
            }], label: [{
                type: ContentChild,
                args: [IgxLabelDirective]
            }], timePickerActionsDirective: [{
                type: ContentChild,
                args: [IgxTimePickerActionsDirective]
            }], inputDirective: [{
                type: ViewChild,
                args: [IgxInputDirective, { read: IgxInputDirective }]
            }], _inputGroup: [{
                type: ViewChild,
                args: [IgxInputGroupComponent]
            }], dateTimeEditor: [{
                type: ViewChild,
                args: [IgxDateTimeEditorDirective, { static: true }]
            }], toggleRef: [{
                type: ViewChild,
                args: [IgxToggleDirective]
            }], value: [{
                type: Input
            }], resourceStrings: [{
                type: Input
            }], okButtonLabel: [{
                type: Input
            }], cancelButtonLabel: [{
                type: Input
            }], itemsDelta: [{
                type: Input
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
/**
 * @hidden
 */
export class IgxTimePickerModule {
}
IgxTimePickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxTimePickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTimePickerModule, declarations: [IgxTimePickerComponent, IgxItemListDirective,
        IgxTimeItemDirective,
        IgxTimePickerTemplateDirective,
        IgxTimePickerActionsDirective,
        TimeFormatPipe,
        TimeItemPipe], imports: [CommonModule,
        IgxDateTimeEditorModule,
        IgxInputGroupModule,
        IgxIconModule,
        IgxButtonModule,
        IgxMaskModule,
        IgxToggleModule,
        IgxTextSelectionModule], exports: [IgxTimePickerComponent, IgxTimePickerTemplateDirective,
        IgxTimePickerActionsDirective,
        IgxPickersCommonModule,
        IgxInputGroupModule] });
IgxTimePickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTimePickerModule, providers: [], imports: [[
            CommonModule,
            IgxDateTimeEditorModule,
            IgxInputGroupModule,
            IgxIconModule,
            IgxButtonModule,
            IgxMaskModule,
            IgxToggleModule,
            IgxTextSelectionModule
        ], IgxPickersCommonModule,
        IgxInputGroupModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxTimePickerComponent,
                        IgxItemListDirective,
                        IgxTimeItemDirective,
                        IgxTimePickerTemplateDirective,
                        IgxTimePickerActionsDirective,
                        TimeFormatPipe,
                        TimeItemPipe
                    ],
                    exports: [
                        IgxTimePickerComponent,
                        IgxTimePickerTemplateDirective,
                        IgxTimePickerActionsDirective,
                        IgxPickersCommonModule,
                        IgxInputGroupModule
                    ],
                    imports: [
                        CommonModule,
                        IgxDateTimeEditorModule,
                        IgxInputGroupModule,
                        IgxIconModule,
                        IgxButtonModule,
                        IgxMaskModule,
                        IgxToggleModule,
                        IgxTextSelectionModule
                    ],
                    providers: []
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3RpbWUtcGlja2VyL3RpbWUtcGlja2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi90aW1lLXBpY2tlci90aW1lLXBpY2tlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsWUFBWSxFQUNmLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNILFNBQVMsRUFFVCxZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEVBR1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUtOLFNBQVMsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFhLFlBQVksRUFDaEUsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVILGlCQUFpQixFQUNqQixTQUFTLEVBSVQsYUFBYSxFQUNoQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNuRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDdkYsT0FBTyxFQUFxQixvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BGLE9BQU8sRUFBRSxtQkFBbUIsRUFBMEIsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RSxPQUFPLEVBQ0gsb0JBQW9CLEVBQ3BCLG9CQUFvQixFQUNwQiw4QkFBOEIsRUFDOUIsNkJBQTZCLEVBQ2hDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFnQixJQUFJ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b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLHNCQUFzQjt3QkFDdEIsOEJBQThCO3dCQUM5Qiw2QkFBNkI7d0JBQzdCLHNCQUFzQjt3QkFDdEIsbUJBQW1CO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWix1QkFBdUI7d0JBQ3ZCLG1CQUFtQjt3QkFDbkIsYUFBYTt3QkFDYixlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZixzQkFBc0I7cUJBQ3pCO29CQUNELFNBQVMsRUFBRSxFQUFFO2lCQUNoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tbW9uTW9kdWxlXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBIb3N0QmluZGluZyxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBWaWV3Q2hpbGQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEluamVjdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIEluamVjdG9yLFxuICAgIFBpcGVUcmFuc2Zvcm0sXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgTE9DQUxFX0lELCBPcHRpb25hbCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIEhvc3RMaXN0ZW5lclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgTmdDb250cm9sLFxuICAgIEFic3RyYWN0Q29udHJvbCxcbiAgICBWYWxpZGF0aW9uRXJyb3JzLFxuICAgIFZhbGlkYXRvcixcbiAgICBOR19WQUxJREFUT1JTXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IElneEljb25Nb2R1bGUgfSBmcm9tICcuLi9pY29uL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4SW5wdXRHcm91cE1vZHVsZSwgSWd4SW5wdXRHcm91cENvbXBvbmVudCB9IGZyb20gJy4uL2lucHV0LWdyb3VwL2lucHV0LWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJZ3hJbnB1dERpcmVjdGl2ZSwgSWd4SW5wdXRTdGF0ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvaW5wdXQvaW5wdXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneElucHV0R3JvdXBUeXBlLCBJR1hfSU5QVVRfR1JPVVBfVFlQRSB9IGZyb20gJy4uL2lucHV0LWdyb3VwL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5pbXBvcnQge1xuICAgIElneEl0ZW1MaXN0RGlyZWN0aXZlLFxuICAgIElneFRpbWVJdGVtRGlyZWN0aXZlLFxuICAgIElneFRpbWVQaWNrZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJZ3hUaW1lUGlja2VyQWN0aW9uc0RpcmVjdGl2ZVxufSBmcm9tICcuL3RpbWUtcGlja2VyLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBub29wLCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElneFRpbWVQaWNrZXJCYXNlLCBJR1hfVElNRV9QSUNLRVJfQ09NUE9ORU5UIH0gZnJvbSAnLi90aW1lLXBpY2tlci5jb21tb24nO1xuaW1wb3J0IHsgQWJzb2x1dGVTY3JvbGxTdHJhdGVneSB9IGZyb20gJy4uL3NlcnZpY2VzL292ZXJsYXkvc2Nyb2xsJztcbmltcG9ydCB7IEF1dG9Qb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi4vc2VydmljZXMvb3ZlcmxheS9wb3NpdGlvbic7XG5pbXBvcnQgeyBPdmVybGF5U2V0dGluZ3MgfSBmcm9tICcuLi9zZXJ2aWNlcy9vdmVybGF5L3V0aWxpdGllcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElneE1hc2tNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL21hc2svbWFzay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4RGF0ZVRpbWVFZGl0b3JNb2R1bGUsIElneERhdGVUaW1lRWRpdG9yRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9kYXRlLXRpbWUtZWRpdG9yL2RhdGUtdGltZS1lZGl0b3IuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneFRvZ2dsZU1vZHVsZSwgSWd4VG9nZ2xlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90b2dnbGUvdG9nZ2xlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJVGltZVBpY2tlclJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi90aW1lLXBpY2tlci1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgSUJhc2VFdmVudEFyZ3MsIGlzRXF1YWwsIGlzRGF0ZSwgUGxhdGZvcm1VdGlsLCBJQmFzZUNhbmNlbGFibGVCcm93c2VyRXZlbnRBcmdzIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBQaWNrZXJJbnRlcmFjdGlvbk1vZGUgfSBmcm9tICcuLi9kYXRlLWNvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBJZ3hUZXh0U2VsZWN0aW9uTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90ZXh0LXNlbGVjdGlvbi90ZXh0LXNlbGVjdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4TGFiZWxEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2xhYmVsL2xhYmVsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQaWNrZXJCYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGF0ZS1jb21tb24vcGlja2VyLWJhc2UuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGVUaW1lVXRpbCB9IGZyb20gJy4uL2RhdGUtY29tbW9uL3V0aWwvZGF0ZS10aW1lLnV0aWwnO1xuaW1wb3J0IHsgRGF0ZVBhcnQsIERhdGVQYXJ0RGVsdGFzIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9kYXRlLXRpbWUtZWRpdG9yL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgUGlja2VySGVhZGVyT3JpZW50YXRpb24gfSBmcm9tICcuLi9kYXRlLWNvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBJZ3hQaWNrZXJDbGVhckNvbXBvbmVudCwgSWd4UGlja2Vyc0NvbW1vbk1vZHVsZSB9IGZyb20gJy4uL2RhdGUtY29tbW9uL3BpY2tlci1pY29ucy5jb21tb24nO1xuaW1wb3J0IHsgVGltZUZvcm1hdFBpcGUsIFRpbWVJdGVtUGlwZSB9IGZyb20gJy4vdGltZS1waWNrZXIucGlwZXMnO1xuXG5sZXQgTkVYVF9JRCA9IDA7XG5leHBvcnQgaW50ZXJmYWNlIElneFRpbWVQaWNrZXJWYWxpZGF0aW9uRmFpbGVkRXZlbnRBcmdzIGV4dGVuZHMgSUJhc2VFdmVudEFyZ3Mge1xuICAgIHByZXZpb3VzVmFsdWU6IERhdGUgfCBzdHJpbmc7XG4gICAgY3VycmVudFZhbHVlOiBEYXRlIHwgc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogSWd4VGltZVBpY2tlckNvbXBvbmVudCxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IElHWF9USU1FX1BJQ0tFUl9DT01QT05FTlQsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogSWd4VGltZVBpY2tlckNvbXBvbmVudFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IElneFRpbWVQaWNrZXJDb21wb25lbnQsXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9XG4gICAgXSxcbiAgICBzZWxlY3RvcjogJ2lneC10aW1lLXBpY2tlcicsXG4gICAgdGVtcGxhdGVVcmw6ICd0aW1lLXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVzOiBbXG4gICAgICAgIGA6aG9zdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgfWBcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneFRpbWVQaWNrZXJDb21wb25lbnQgZXh0ZW5kcyBQaWNrZXJCYXNlRGlyZWN0aXZlXG4gICAgaW1wbGVtZW50c1xuICAgIElneFRpbWVQaWNrZXJCYXNlLFxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uSW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBWYWxpZGF0b3Ige1xuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIHZhbHVlIG9mIHRoZSBgaWRgIGF0dHJpYnV0ZS5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10aW1lLXBpY2tlciBbaWRdPVwiJ2lneC10aW1lLXBpY2tlci01J1wiIFtkaXNwbGF5Rm9ybWF0XT1cImg6bW0gdHRcIiA+PC9pZ3gtdGltZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtdGltZS1waWNrZXItJHtORVhUX0lEKyt9YDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBmb3JtYXQgdXNlZCB3aGVuIGVkaXRhYmxlIGlucHV0IGlzIG5vdCBmb2N1c2VkLiBEZWZhdWx0cyB0byB0aGUgYGlucHV0Rm9ybWF0YCBpZiBub3Qgc2V0LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBVc2VzIEFuZ3VsYXIncyBgRGF0ZVBpcGVgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10aW1lLXBpY2tlciBkaXNwbGF5Rm9ybWF0PVwibW06c3NcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc3BsYXlGb3JtYXQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBleHBlY3RlZCB1c2VyIGlucHV0IGZvcm1hdCBhbmQgcGxhY2Vob2xkZXIuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIERlZmF1bHQgaXMgYGhoOm1tIHR0YFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10aW1lLXBpY2tlciBpbnB1dEZvcm1hdD1cIkhIOm1tXCI+PC9pZ3gtdGltZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5wdXRGb3JtYXQ6IHN0cmluZyA9IERhdGVUaW1lVXRpbC5ERUZBVUxUX1RJTUVfSU5QVVRfRk9STUFUO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBpbnRlcmFjdGlvbiBtb2RlIC0gZGlhbG9nIG9yIGRyb3AgZG93bi5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgbW9kZT1cImRpYWxvZ1wiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1vZGU6IFBpY2tlckludGVyYWN0aW9uTW9kZSA9IFBpY2tlckludGVyYWN0aW9uTW9kZS5Ecm9wRG93bjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtaW5pbXVtIHZhbHVlIHRoZSBwaWNrZXIgd2lsbCBhY2NlcHQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIGEgYHN0cmluZ2AgdmFsdWUgaXMgcGFzc2VkIGluLCBpdCBtdXN0IGJlIGluIElTTyBmb3JtYXQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRpbWUtcGlja2VyIFttaW5WYWx1ZV09XCIxODowMDowMFwiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBtaW5WYWx1ZSh2YWx1ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl9taW5WYWx1ZSA9IHZhbHVlO1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5wYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRlTWluVmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGF0ZU1pblZhbHVlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpLCBkYXRlLmdldE1pbGxpc2Vjb25kcygpKTtcbiAgICAgICAgICAgIHRoaXMubWluRHJvcGRvd25WYWx1ZSA9IHRoaXMuc2V0TWluTWF4RHJvcGRvd25WYWx1ZSgnbWluJywgdGhpcy5fZGF0ZU1pblZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5fb25WYWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG1pblZhbHVlKCk6IERhdGUgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWluVmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBpZiB0aGUgZHJvcGRvd24vZGlhbG9nIGlzIGNvbGxhcHNlZFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0NvbGxhcHNlZCA9IHRoaXMudGltZVBpY2tlci5jb2xsYXBzZWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBjb2xsYXBzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZVJlZj8uY29sbGFwc2VkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIHZhbHVlIHRoZSBwaWNrZXIgd2lsbCBhY2NlcHQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIGEgYHN0cmluZ2AgdmFsdWUgaXMgcGFzc2VkIGluLCBpdCBtdXN0IGJlIGluIElTTyBmb3JtYXQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRpbWUtcGlja2VyIFttYXhWYWx1ZV09XCIyMDozMDowMFwiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBtYXhWYWx1ZSh2YWx1ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl9tYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5wYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRlTWF4VmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGF0ZU1heFZhbHVlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpLCBkYXRlLmdldE1pbGxpc2Vjb25kcygpKTtcbiAgICAgICAgICAgIHRoaXMubWF4RHJvcGRvd25WYWx1ZSA9IHRoaXMuc2V0TWluTWF4RHJvcGRvd25WYWx1ZSgnbWF4JywgdGhpcy5fZGF0ZU1heFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5fb25WYWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG1heFZhbHVlKCk6IERhdGUgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4VmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgZGV0ZXJtaW5lcyB0aGUgc3BpbiBiZWhhdmlvci4gQnkgZGVmYXVsdCBgc3Bpbkxvb3BgIGlzIHNldCB0byB0cnVlLlxuICAgICAqIFRoZSBzZWNvbmRzLCBtaW51dGVzIGFuZCBob3VyIHNwaW5uaW5nIHdpbGwgd3JhcCBhcm91bmQgYnkgZGVmYXVsdC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10aW1lLXBpY2tlciBbc3Bpbkxvb3BdPVwiZmFsc2VcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzcGluTG9vcCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgYSBjdXN0b20gZm9ybWF0dGVyIGZ1bmN0aW9uIG9uIHRoZSBzZWxlY3RlZCBvciBwYXNzZWQgZGF0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgW3ZhbHVlXT1cImRhdGVcIiBbZm9ybWF0dGVyXT1cImZvcm1hdHRlclwiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGZvcm1hdHRlcjogKHZhbDogRGF0ZSkgPT4gc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHBpY2tlcidzIGhlYWRlci5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQXZhaWxhYmxlIGluIGRpYWxvZyBtb2RlIG9ubHkuIERlZmF1bHQgdmFsdWUgaXMgYGhvcml6b250YWxgLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgW2hlYWRlck9yaWVudGF0aW9uXT1cIid2ZXJ0aWNhbCdcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoZWFkZXJPcmllbnRhdGlvbjogUGlja2VySGVhZGVyT3JpZW50YXRpb24gPSBQaWNrZXJIZWFkZXJPcmllbnRhdGlvbi5Ib3Jpem9udGFsO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcmVhZE9ubHkgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgYSBzZWxlY3Rpb24gaGFzIGJlZW4gZG9uZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgKHNlbGVjdGVkKT1cIm9uU2VsZWN0aW9uKCRldmVudClcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGU+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gdGhlIHBpY2tlcidzIHZhbHVlIGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFVzZWQgZm9yIGB0d28td2F5YCBiaW5kaW5ncy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgWyh2YWx1ZSldPVwiZGF0ZVwiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RGF0ZSB8IHN0cmluZz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgdXNlciB0eXBlcy9zcGlucyBpbnZhbGlkIHRpbWUgaW4gdGhlIHRpbWUtcGlja2VyIGVkaXRvci5cbiAgICAgKlxuICAgICAqICBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRpbWUtcGlja2VyICh2YWxpZGF0aW9uRmFpbGVkKT1cIm9uVmFsaWRhdGlvbkZhaWxlZCgkZXZlbnQpXCI+PC9pZ3gtdGltZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZhbGlkYXRpb25GYWlsZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElneFRpbWVQaWNrZXJWYWxpZGF0aW9uRmFpbGVkRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBAVmlld0NoaWxkKCdob3VyTGlzdCcpXG4gICAgcHVibGljIGhvdXJMaXN0OiBFbGVtZW50UmVmO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBAVmlld0NoaWxkKCdtaW51dGVMaXN0JylcbiAgICBwdWJsaWMgbWludXRlTGlzdDogRWxlbWVudFJlZjtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQFZpZXdDaGlsZCgnc2Vjb25kc0xpc3QnKVxuICAgIHB1YmxpYyBzZWNvbmRzTGlzdDogRWxlbWVudFJlZjtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQFZpZXdDaGlsZCgnYW1wbUxpc3QnKVxuICAgIHB1YmxpYyBhbXBtTGlzdDogRWxlbWVudFJlZjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4UGlja2VyQ2xlYXJDb21wb25lbnQpXG4gICAgcHVibGljIGNsZWFyQ29tcG9uZW50czogUXVlcnlMaXN0PElneFBpY2tlckNsZWFyQ29tcG9uZW50PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4TGFiZWxEaXJlY3RpdmUpXG4gICAgcHVibGljIGxhYmVsOiBJZ3hMYWJlbERpcmVjdGl2ZTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4VGltZVBpY2tlckFjdGlvbnNEaXJlY3RpdmUpXG4gICAgcHVibGljIHRpbWVQaWNrZXJBY3Rpb25zRGlyZWN0aXZlOiBJZ3hUaW1lUGlja2VyQWN0aW9uc0RpcmVjdGl2ZTtcblxuICAgIEBWaWV3Q2hpbGQoSWd4SW5wdXREaXJlY3RpdmUsIHsgcmVhZDogSWd4SW5wdXREaXJlY3RpdmUgfSlcbiAgICBwcml2YXRlIGlucHV0RGlyZWN0aXZlOiBJZ3hJbnB1dERpcmVjdGl2ZTtcblxuICAgIEBWaWV3Q2hpbGQoSWd4SW5wdXRHcm91cENvbXBvbmVudClcbiAgICBwcml2YXRlIF9pbnB1dEdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50O1xuXG4gICAgQFZpZXdDaGlsZChJZ3hEYXRlVGltZUVkaXRvckRpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwcml2YXRlIGRhdGVUaW1lRWRpdG9yOiBJZ3hEYXRlVGltZUVkaXRvckRpcmVjdGl2ZTtcblxuICAgIEBWaWV3Q2hpbGQoSWd4VG9nZ2xlRGlyZWN0aXZlKVxuICAgIHByaXZhdGUgdG9nZ2xlUmVmOiBJZ3hUb2dnbGVEaXJlY3RpdmU7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBjbGVhcmVkID0gZmFsc2U7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBpc05vdEVtcHR5ID0gZmFsc2U7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBjdXJyZW50SG91cjogbnVtYmVyO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgY3VycmVudE1pbnV0ZXM6IG51bWJlcjtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBzaG93Q2xlYXJCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmNsZWFyQ29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBVcGRhdGUgdy8gY2xlYXIgYmVoYXZpb3JcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmdldEhvdXJzKCkgIT09IDAgfHwgdGhpcy52YWx1ZS5nZXRNaW51dGVzKCkgIT09IDAgfHwgdGhpcy52YWx1ZS5nZXRTZWNvbmRzKCkgIT09IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICEhdGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd0hvdXJzTGlzdCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRGb3JtYXQuaW5kZXhPZignaCcpICE9PSAtIDEgfHwgdGhpcy5pbnB1dEZvcm1hdC5pbmRleE9mKCdIJykgIT09IC0gMTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd01pbnV0ZXNMaXN0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm1hdC5pbmRleE9mKCdtJykgIT09IC0gMTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd1NlY29uZHNMaXN0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm1hdC5pbmRleE9mKCdzJykgIT09IC0gMTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgc2hvd0FtUG1MaXN0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm1hdC5pbmRleE9mKCd0JykgIT09IC0gMSB8fCB0aGlzLmlucHV0Rm9ybWF0LmluZGV4T2YoJ2EnKSAhPT0gLSAxO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIGdldCBpc1R3ZWx2ZUhvdXJGb3JtYXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybWF0LmluZGV4T2YoJ2gnKSAhPT0gLSAxO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgaXNEcm9wZG93bigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gUGlja2VySW50ZXJhY3Rpb25Nb2RlLkRyb3BEb3duO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyT3JpZW50YXRpb24gPT09IFBpY2tlckhlYWRlck9yaWVudGF0aW9uLlZlcnRpY2FsO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWREYXRlKCk6IERhdGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWREYXRlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgbWluRGF0ZVZhbHVlKCk6IERhdGUge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGVNaW5WYWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgbWluRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBtaW5EYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgICAgICAgcmV0dXJuIG1pbkRhdGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZU1pblZhbHVlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgbWF4RGF0ZVZhbHVlKCk6IERhdGUge1xuICAgICAgICBpZiAoIXRoaXMuX2RhdGVNYXhWYWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgbWF4RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBtYXhEYXRlLnNldEhvdXJzKDIzLCA1OSwgNTksIDk5OSk7XG4gICAgICAgICAgICByZXR1cm4gbWF4RGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRlTWF4VmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLl9uZ0NvbnRyb2wgJiYgdGhpcy5fbmdDb250cm9sLmNvbnRyb2wgJiYgdGhpcy5fbmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAvLyBSdW4gdGhlIHZhbGlkYXRpb24gd2l0aCBlbXB0eSBvYmplY3QgdG8gY2hlY2sgaWYgcmVxdWlyZWQgaXMgZW5hYmxlZC5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gdGhpcy5fbmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yKHt9IGFzIEFic3RyYWN0Q29udHJvbCk7XG4gICAgICAgICAgICByZXR1cm4gISEoZXJyb3IgJiYgZXJyb3IucmVxdWlyZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRpYWxvZ092ZXJsYXlTZXR0aW5ncygpOiBPdmVybGF5U2V0dGluZ3Mge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdERpYWxvZ092ZXJsYXlTZXR0aW5ncywgdGhpcy5vdmVybGF5U2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRyb3BEb3duT3ZlcmxheVNldHRpbmdzKCk6IE92ZXJsYXlTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0RHJvcERvd25PdmVybGF5U2V0dGluZ3MsIHRoaXMub3ZlcmxheVNldHRpbmdzKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZGlzcGxheVZhbHVlOiBQaXBlVHJhbnNmb3JtID0geyB0cmFuc2Zvcm06IChkYXRlOiBEYXRlKSA9PiB0aGlzLmZvcm1hdHRlcihkYXRlKSB9O1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBtaW5Ecm9wZG93blZhbHVlOiBEYXRlO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBtYXhEcm9wZG93blZhbHVlOiBEYXRlO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBob3VySXRlbXMgPSBbXTtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbWludXRlSXRlbXMgPSBbXTtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgc2Vjb25kc0l0ZW1zID0gW107XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGFtcG1JdGVtcyA9IFtdO1xuXG4gICAgcHJpdmF0ZSBfdmFsdWU6IERhdGUgfCBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZGF0ZVZhbHVlOiBEYXRlO1xuICAgIHByaXZhdGUgX2RhdGVNaW5WYWx1ZTogRGF0ZTtcbiAgICBwcml2YXRlIF9kYXRlTWF4VmFsdWU6IERhdGU7XG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWREYXRlOiBEYXRlO1xuICAgIHByaXZhdGUgX3Jlc291cmNlU3RyaW5ncyA9IEN1cnJlbnRSZXNvdXJjZVN0cmluZ3MuVGltZVBpY2tlclJlc1N0cmluZ3M7XG4gICAgcHJpdmF0ZSBfb2tCdXR0b25MYWJlbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBfY2FuY2VsQnV0dG9uTGFiZWwgPSBudWxsO1xuICAgIHByaXZhdGUgX2l0ZW1zRGVsdGE6IFBpY2s8RGF0ZVBhcnREZWx0YXMsICdob3VycycgfCAnbWludXRlcycgfCAnc2Vjb25kcyc+ID0geyBob3VyczogMSwgbWludXRlczogMSwgc2Vjb25kczogMSB9O1xuXG4gICAgcHJpdmF0ZSBfc3RhdHVzQ2hhbmdlcyQ6IFN1YnNjcmlwdGlvbjtcbiAgICBwcml2YXRlIF9uZ0NvbnRyb2w6IE5nQ29udHJvbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBfb25DaGFuZ2VDYWxsYmFjazogKF86IERhdGUgfCBzdHJpbmcpID0+IHZvaWQgPSBub29wO1xuICAgIHByaXZhdGUgX29uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcbiAgICBwcml2YXRlIF9vblZhbGlkYXRvckNoYW5nZTogKCkgPT4gdm9pZCA9IG5vb3A7XG5cbiAgICBwcml2YXRlIF9kZWZhdWx0RGlhbG9nT3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3MgPSB7XG4gICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICBjbG9zZU9uRXNjYXBlOiB0cnVlLFxuICAgICAgICBvdXRsZXQ6IHRoaXMub3V0bGV0XG4gICAgfTtcbiAgICBwcml2YXRlIF9kZWZhdWx0RHJvcERvd25PdmVybGF5U2V0dGluZ3M6IE92ZXJsYXlTZXR0aW5ncyA9IHtcbiAgICAgICAgdGFyZ2V0OiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgbW9kYWw6IGZhbHNlLFxuICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogbmV3IEFic29sdXRlU2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneTogbmV3IEF1dG9Qb3NpdGlvblN0cmF0ZWd5KCksXG4gICAgICAgIG91dGxldDogdGhpcy5vdXRsZXRcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHZhbHVlIC8gdGltZSBmcm9tIHRoZSBkcm9wLWRvd24vZGlhbG9nXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoZSBjdXJyZW50IHZhbHVlIGlzIG9mIHR5cGUgYERhdGVgXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBuZXdWYWx1ZTogRGF0ZSA9IG5ldyBEYXRlKDIwMDAsIDIsIDIsIDEwLCAxNSwgMTUpO1xuICAgICAqIHRoaXMudGltZVBpY2tlci52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogRGF0ZSB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhY2Nlc3NvciB0aGF0IGFsbG93cyB5b3UgdG8gc2V0IGEgdGltZSB1c2luZyB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogcHVibGljIGRhdGU6IERhdGUgPSBuZXcgRGF0ZShEYXRlLm5vdygpKTtcbiAgICAgKiAgLy8uLi5cbiAgICAgKiA8aWd4LXRpbWUtcGlja2VyIFt2YWx1ZV09XCJkYXRlXCIgZm9ybWF0PVwiaDptbSB0dFwiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3ZhbHVlO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5wYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRlVmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGF0ZVZhbHVlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpLCBkYXRlLmdldE1pbGxpc2Vjb25kcygpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLl9kYXRlVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGF0ZVZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kYXRlVGltZUVkaXRvcikge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZSA9IGRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0VmFsdWVDaGFuZ2Uob2xkVmFsdWUsIHRoaXMuX3ZhbHVlKTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLl92YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWNjZXNzb3IgdGhhdCBzZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqIEJ5IGRlZmF1bHQgaXQgdXNlcyBFTiByZXNvdXJjZXMuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHJlc291cmNlU3RyaW5ncyh2YWx1ZTogSVRpbWVQaWNrZXJSZXNvdXJjZVN0cmluZ3MpIHtcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VTdHJpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcmVzb3VyY2VTdHJpbmdzLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWNjZXNzb3IgdGhhdCByZXR1cm5zIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VTdHJpbmdzKCk6IElUaW1lUGlja2VyUmVzb3VyY2VTdHJpbmdzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlU3RyaW5ncztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCByZW5kZXJzIE9LIGJ1dHRvbiB3aXRoIGN1c3RvbSB0ZXh0LiBCeSBkZWZhdWx0IGBva0J1dHRvbkxhYmVsYCBpcyBzZXQgdG8gT0suXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgb2tCdXR0b25MYWJlbD0nU0VUJyBbdmFsdWVdPVwiZGF0ZVwiIGZvcm1hdD1cImg6bW0gdHRcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgb2tCdXR0b25MYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX29rQnV0dG9uTGFiZWwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhY2Nlc3NvciB0aGF0IHJldHVybnMgdGhlIGxhYmVsIG9mIG9rIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG9rQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuX29rQnV0dG9uTGFiZWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlU3RyaW5ncy5pZ3hfdGltZV9waWNrZXJfb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29rQnV0dG9uTGFiZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgcmVuZGVycyBjYW5jZWwgYnV0dG9uIHdpdGggY3VzdG9tIHRleHQuXG4gICAgICogQnkgZGVmYXVsdCBgY2FuY2VsQnV0dG9uTGFiZWxgIGlzIHNldCB0byBDYW5jZWwuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdGltZS1waWNrZXIgY2FuY2VsQnV0dG9uTGFiZWw9J0V4aXQnIFt2YWx1ZV09XCJkYXRlXCIgZm9ybWF0PVwiaDptbSB0dFwiPjwvaWd4LXRpbWUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBjYW5jZWxCdXR0b25MYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2NhbmNlbEJ1dHRvbkxhYmVsID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWNjZXNzb3IgdGhhdCByZXR1cm5zIHRoZSBsYWJlbCBvZiBjYW5jZWwgYnV0dG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY2FuY2VsQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhbmNlbEJ1dHRvbkxhYmVsID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X3RpbWVfcGlja2VyX2NhbmNlbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY2FuY2VsQnV0dG9uTGFiZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsdGEgdmFsdWVzIHVzZWQgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBlYWNoIGVkaXRvciBkYXRlIHBhcnQgb24gc3BpbiBhY3Rpb25zIGFuZFxuICAgICAqIHRvIGRpc3BsYXkgdGltZSBwb3J0aW9ucyBpbiB0aGUgZHJvcGRvd24vZGlhbG9nLlxuICAgICAqIEJ5IGRlZmF1bHQgYGl0ZW1zRGVsdGFgIGlzIHNldCB0byBge2hvdXI6IDEsIG1pbnV0ZTogMSwgc2Vjb25kOiAxfWBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10aW1lLXBpY2tlciBbaXRlbXNEZWx0YV09XCJ7aG91cjozLCBtaW51dGU6NSwgc2Vjb25kOjEwfVwiIGlkPVwidGltZS1waWNrZXJcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgaXRlbXNEZWx0YSh2YWx1ZTogUGljazxEYXRlUGFydERlbHRhcywgJ2hvdXJzJyB8ICdtaW51dGVzJyB8ICdzZWNvbmRzJz4pIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9pdGVtc0RlbHRhLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBpdGVtc0RlbHRhKCk6IFBpY2s8RGF0ZVBhcnREZWx0YXMsICdob3VycycgfCAnbWludXRlcycgfCAnc2Vjb25kcyc+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zRGVsdGE7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICBASW5qZWN0KExPQ0FMRV9JRCkgcHJvdGVjdGVkIF9sb2NhbGVJZDogc3RyaW5nLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERpc3BsYXlEZW5zaXR5VG9rZW4pIHByb3RlY3RlZCBfZGlzcGxheURlbnNpdHlPcHRpb25zOiBJRGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KElHWF9JTlBVVF9HUk9VUF9UWVBFKSBwcm90ZWN0ZWQgX2lucHV0R3JvdXBUeXBlOiBJZ3hJbnB1dEdyb3VwVHlwZSxcbiAgICAgICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICBwcml2YXRlIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwsXG4gICAgICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICBzdXBlcihlbGVtZW50LCBfbG9jYWxlSWQsIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnMsIF9pbnB1dEdyb3VwVHlwZSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgY2FzZSB0aGlzLnBsYXRmb3JtLktFWU1BUC5BUlJPV19VUDpcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYWx0S2V5ICYmIHRoaXMuaXNEcm9wZG93bikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnBsYXRmb3JtLktFWU1BUC5BUlJPV19ET1dOOlxuICAgICAgICAgICAgICAgIGlmIChldmVudC5hbHRLZXkgJiYgdGhpcy5pc0Ryb3Bkb3duKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuRVNDQVBFOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsQnV0dG9uQ2xpY2soKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuU1BBQ0U6XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXRQYXJ0VmFsdWUodmFsdWU6IERhdGUsIHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGlucHV0RGF0ZVBhcnRzID0gRGF0ZVRpbWVVdGlsLnBhcnNlRGF0ZVRpbWVGb3JtYXQodGhpcy5pbnB1dEZvcm1hdCk7XG4gICAgICAgIGNvbnN0IHBhcnQgPSBpbnB1dERhdGVQYXJ0cy5maW5kKGVsZW1lbnQgPT4gZWxlbWVudC50eXBlID09PSB0eXBlKTtcbiAgICAgICAgcmV0dXJuIERhdGVUaW1lVXRpbC5nZXRQYXJ0VmFsdWUodmFsdWUsIHBhcnQsIHBhcnQuZm9ybWF0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHRvSVNPU3RyaW5nKHZhbHVlOiBEYXRlKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG9jYWxlVGltZVN0cmluZygnZW4tR0InLCB7XG4gICAgICAgICAgICBob3VyOiAnMi1kaWdpdCcsXG4gICAgICAgICAgICBtaW51dGU6ICcyLWRpZ2l0JyxcbiAgICAgICAgICAgIHNlY29uZDogJzItZGlnaXQnLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAjcmVnaW9uIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5wYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRlVmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fZGF0ZVZhbHVlLnNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLl9kYXRlVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFZhbHVlKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRhdGVUaW1lRWRpdG9yKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbHVlID0gZGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogRGF0ZSB8IHN0cmluZykgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46IGFueSkge1xuICAgICAgICB0aGlzLl9vblZhbGlkYXRvckNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gICAgICAgIGlmICghY29udHJvbC52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW52YWxpZERhdGUgaGFuZGxpbmdcbiAgICAgICAgaWYgKGlzRGF0ZShjb250cm9sLnZhbHVlKSAmJiAhRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdHJ1ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXJyb3JzID0ge307XG4gICAgICAgIGNvbnN0IHZhbHVlID0gRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKGNvbnRyb2wudmFsdWUpID8gY29udHJvbC52YWx1ZSA6IERhdGVUaW1lVXRpbC5wYXJzZUlzb0RhdGUoY29udHJvbC52YWx1ZSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZXJyb3JzLCBEYXRlVGltZVV0aWwudmFsaWRhdGVNaW5NYXgodmFsdWUsIHRoaXMubWluVmFsdWUsIHRoaXMubWF4VmFsdWUsIHRydWUsIGZhbHNlKSk7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlcnJvcnMpLmxlbmd0aCA+IDAgPyBlcnJvcnMgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgfVxuICAgIC8vI2VuZHJlZ2lvblxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX25nQ29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldDxOZ0NvbnRyb2w+KE5nQ29udHJvbCwgbnVsbCk7XG4gICAgICAgIHRoaXMubWluRHJvcGRvd25WYWx1ZSA9IHRoaXMuc2V0TWluTWF4RHJvcGRvd25WYWx1ZSgnbWluJywgdGhpcy5taW5EYXRlVmFsdWUpO1xuICAgICAgICB0aGlzLm1heERyb3Bkb3duVmFsdWUgPSB0aGlzLnNldE1pbk1heERyb3Bkb3duVmFsdWUoJ21heCcsIHRoaXMubWF4RGF0ZVZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFZhbHVlKHRoaXMuX2RhdGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUb0RhdGVFZGl0b3JFdmVudHMoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUb1RvZ2dsZURpcmVjdGl2ZUV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuX2RlZmF1bHREcm9wRG93bk92ZXJsYXlTZXR0aW5ncy5leGNsdWRlRnJvbU91dHNpZGVDbGljayA9IFt0aGlzLl9pbnB1dEdyb3VwLmVsZW1lbnQubmF0aXZlRWxlbWVudF07XG5cbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuaW5wdXREaXJlY3RpdmUubmF0aXZlRWxlbWVudCwgJ2JsdXInKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbGlkaXR5T25CbHVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdWJUb0ljb25zQ2xpY2tlZCh0aGlzLmNsZWFyQ29tcG9uZW50cywgKCkgPT4gdGhpcy5jbGVhcigpKTtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBvbmVudHMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuc3ViVG9JY29uc0NsaWNrZWQodGhpcy5jbGVhckNvbXBvbmVudHMsICgpID0+IHRoaXMuY2xlYXIoKSkpO1xuXG4gICAgICAgIGlmICh0aGlzLl9uZ0NvbnRyb2wpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZXMkID0gdGhpcy5fbmdDb250cm9sLnN0YXR1c0NoYW5nZXMuc3Vic2NyaWJlKHRoaXMub25TdGF0dXNDaGFuZ2VkLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5faW5wdXRHcm91cC5pc1JlcXVpcmVkID0gdGhpcy5yZXF1aXJlZDtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgICAgICBpZiAodGhpcy5fc3RhdHVzQ2hhbmdlcyQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZXMkLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXRFZGl0RWxlbWVudCgpOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVFZGl0b3IubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyB0aGUgcGlja2VyJ3MgZGlhbG9nIFVJLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNldHRpbmdzIE92ZXJsYXlTZXR0aW5ncyAtIHRoZSBvdmVybGF5IHNldHRpbmdzIHRvIHVzZSBmb3IgcG9zaXRpb25pbmcgdGhlIGRyb3AgZG93biBvciBkaWFsb2cgY29udGFpbmVyIGFjY29yZGluZyB0b1xuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRpbWUtcGlja2VyICNwaWNrZXIgW3ZhbHVlXT1cImRhdGVcIj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiA8YnV0dG9uIChjbGljayk9XCJwaWNrZXIub3BlbigpXCI+T3BlbiBEaWFsb2c8L2J1dHRvbj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgb3BlbihzZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy50b2dnbGVSZWYuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUodGhpcy5fZGF0ZVZhbHVlKTtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5pc0Ryb3Bkb3duXG4gICAgICAgICAgICA/IHRoaXMuZHJvcERvd25PdmVybGF5U2V0dGluZ3NcbiAgICAgICAgICAgIDogdGhpcy5kaWFsb2dPdmVybGF5U2V0dGluZ3NcbiAgICAgICAgICAgICwgc2V0dGluZ3MpO1xuXG4gICAgICAgIHRoaXMudG9nZ2xlUmVmLm9wZW4ob3ZlcmxheVNldHRpbmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIGRyb3Bkb3duL2RpYWxvZy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10aW1lLXBpY2tlciAjdGltZVBpY2tlcj48L2lneC10aW1lLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZCgndGltZVBpY2tlcicsIHsgcmVhZDogSWd4VGltZVBpY2tlckNvbXBvbmVudCB9KSBwaWNrZXI6IElneFRpbWVQaWNrZXJDb21wb25lbnQ7XG4gICAgICogcGlja2VyLmNsb3NlKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRvZ2dsZVJlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b2dnbGUoc2V0dGluZ3M/OiBPdmVybGF5U2V0dGluZ3MpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlUmVmLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKHNldHRpbmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFycyB0aGUgdGltZSBwaWNrZXIgdmFsdWUgaWYgaXQgaXMgYSBgc3RyaW5nYCBvciByZXNldHMgdGhlIHRpbWUgdG8gYDAwOjAwOjAwYCBpZiB0aGUgdmFsdWUgaXMgYSBEYXRlIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMudGltZVBpY2tlci5jbGVhcigpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50b2dnbGVSZWYuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IG5ldyBEYXRlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZS5zZXRIb3VycygwLCAwLCAwKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmdldFRpbWUoKSAhPT0gb2xkVmFsdWUuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0VmFsdWVDaGFuZ2Uob2xkVmFsdWUsIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGVWYWx1ZS5zZXRIb3VycygwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbHVlID0gbmV3IERhdGUodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFZhbHVlKHRoaXMuX2RhdGVWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdHMgdGltZSBmcm9tIHRoZSBpZ3hUaW1lUGlja2VyLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy50aW1lUGlja2VyLnNlbGVjdChkYXRlKTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRlIERhdGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHRpbWUgdG8gYmUgc2VsZWN0ZWQuXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdChkYXRlOiBEYXRlIHwgc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluY3JlbWVudCBhIHNwZWNpZmllZCBgRGF0ZVBhcnRgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGVQYXJ0IFRoZSBvcHRpb25hbCBEYXRlUGFydCB0byBpbmNyZW1lbnQuIERlZmF1bHRzIHRvIEhvdXIuXG4gICAgICogQHBhcmFtIGRlbHRhIFRoZSBvcHRpb25hbCBkZWx0YSB0byBpbmNyZW1lbnQgYnkuIE92ZXJyaWRlcyBgaXRlbXNEZWx0YWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy50aW1lUGlja2VyLmluY3JlbWVudChEYXRlUGFydC5Ib3Vycyk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGluY3JlbWVudChkYXRlUGFydD86IERhdGVQYXJ0LCBkZWx0YT86IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLmluY3JlbWVudChkYXRlUGFydCwgZGVsdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlY3JlbWVudCBhIHNwZWNpZmllZCBgRGF0ZVBhcnRgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0ZVBhcnQgVGhlIG9wdGlvbmFsIERhdGVQYXJ0IHRvIGRlY3JlbWVudC4gRGVmYXVsdHMgdG8gSG91ci5cbiAgICAgKiBAcGFyYW0gZGVsdGEgVGhlIG9wdGlvbmFsIGRlbHRhIHRvIGRlY3JlbWVudCBieS4gT3ZlcnJpZGVzIGBpdGVtc0RlbHRhYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLnRpbWVQaWNrZXIuZGVjcmVtZW50KERhdGVQYXJ0LlNlY29uZHMpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBkZWNyZW1lbnQoZGF0ZVBhcnQ/OiBEYXRlUGFydCwgZGVsdGE/OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYXRlVGltZUVkaXRvci5kZWNyZW1lbnQoZGF0ZVBhcnQsIGRlbHRhKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgY2FuY2VsQnV0dG9uQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZSh0aGlzLl9kYXRlVmFsdWUpO1xuICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbHVlID0gdGhpcy5wYXJzZVRvRGF0ZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBva0J1dHRvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgb25JdGVtQ2xpY2soaXRlbTogc3RyaW5nLCBkYXRlVHlwZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgc3dpdGNoIChkYXRlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnaG91ckxpc3QnOlxuICAgICAgICAgICAgICAgIGxldCBhbXBtOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRIb3VyID0gcGFyc2VJbnQoaXRlbSwgMTApO1xuICAgICAgICAgICAgICAgIGxldCBob3VycyA9IHNlbGVjdGVkSG91cjtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3dBbVBtTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBhbXBtID0gdGhpcy5nZXRQYXJ0VmFsdWUoZGF0ZSwgJ2FtcG0nKTtcbiAgICAgICAgICAgICAgICAgICAgaG91cnMgPSB0aGlzLnRvVHdlbnR5Rm91ckhvdXJGb3JtYXQoaG91cnMsIGFtcG0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtaW5Ib3VycyA9IHRoaXMubWluRHJvcGRvd25WYWx1ZT8uZ2V0SG91cnMoKSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXhIb3VycyA9IHRoaXMubWF4RHJvcGRvd25WYWx1ZT8uZ2V0SG91cnMoKSB8fCAyNDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdXJzIDwgbWluSG91cnMgfHwgaG91cnMgPiBtYXhIb3Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaG91cnMgPSBob3VycyA8IDEyID8gaG91cnMgKyAxMiA6IGhvdXJzIC0gMTI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkYXRlLnNldEhvdXJzKGhvdXJzKTtcbiAgICAgICAgICAgICAgICBkYXRlID0gdGhpcy52YWxpZGF0ZURyb3Bkb3duVmFsdWUoZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZUluUmFuZ2UoZGF0ZSwgdGhpcy5taW5Ecm9wZG93blZhbHVlLCB0aGlzLm1heERyb3Bkb3duVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtaW51dGVMaXN0Jzoge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBwYXJzZUludChpdGVtLCAxMCk7XG4gICAgICAgICAgICAgICAgZGF0ZS5zZXRNaW51dGVzKG1pbnV0ZXMpO1xuICAgICAgICAgICAgICAgIGRhdGUgPSB0aGlzLnZhbGlkYXRlRHJvcGRvd25WYWx1ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkVmFsdWUoZGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdzZWNvbmRzTGlzdCc6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRzID0gcGFyc2VJbnQoaXRlbSwgMTApO1xuICAgICAgICAgICAgICAgIGRhdGUuc2V0U2Vjb25kcyhzZWNvbmRzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZUluUmFuZ2UoZGF0ZSwgdGhpcy5taW5Ecm9wZG93blZhbHVlLCB0aGlzLm1heERyb3Bkb3duVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZShkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdhbXBtTGlzdCc6IHtcbiAgICAgICAgICAgICAgICBsZXQgaG91ciA9IHRoaXMuX3NlbGVjdGVkRGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgICAgIGhvdXIgPSBpdGVtID09PSAnQU0nID8gaG91ciAtIDEyIDogaG91ciArIDEyO1xuICAgICAgICAgICAgICAgIGRhdGUuc2V0SG91cnMoaG91cik7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IHRoaXMudmFsaWRhdGVEcm9wZG93blZhbHVlKGRhdGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRWYWx1ZShkYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUVkaXRvclZhbHVlKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5leHRIb3VyKGRlbHRhOiBudW1iZXIpIHtcbiAgICAgICAgZGVsdGEgPSBkZWx0YSA+IDAgPyAxIDogLTE7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzRGF0ZSA9IG5ldyBEYXRlKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XG4gICAgICAgIGNvbnN0IG1pbkhvdXJzID0gdGhpcy5taW5Ecm9wZG93blZhbHVlPy5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBtYXhIb3VycyA9IHRoaXMubWF4RHJvcGRvd25WYWx1ZT8uZ2V0SG91cnMoKTtcbiAgICAgICAgY29uc3QgcHJldmlvdXNIb3VycyA9IHByZXZpb3VzRGF0ZS5nZXRIb3VycygpO1xuICAgICAgICBsZXQgaG91cnMgPSBwcmV2aW91c0hvdXJzICsgZGVsdGEgKiB0aGlzLml0ZW1zRGVsdGEuaG91cnM7XG4gICAgICAgIGlmICgocHJldmlvdXNIb3VycyA9PT0gbWF4SG91cnMgJiYgZGVsdGEgPiAwKSB8fCAocHJldmlvdXNIb3VycyA9PT0gbWluSG91cnMgJiYgZGVsdGEgPCAwKSkge1xuICAgICAgICAgICAgaG91cnMgPSAhdGhpcy5zcGluTG9vcCA/IHByZXZpb3VzSG91cnMgOiBkZWx0YSA+IDAgPyBtaW5Ib3VycyA6IG1heEhvdXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlLnNldEhvdXJzKGhvdXJzKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gdGhpcy52YWxpZGF0ZURyb3Bkb3duVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gbmV3IERhdGUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy51cGRhdGVFZGl0b3JWYWx1ZSgpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZXh0TWludXRlKGRlbHRhOiBudW1iZXIpIHtcbiAgICAgICAgZGVsdGEgPSBkZWx0YSA+IDAgPyAxIDogLTE7XG4gICAgICAgIGNvbnN0IG1pbkhvdXJzID0gdGhpcy5taW5Ecm9wZG93blZhbHVlLmdldEhvdXJzKCk7XG4gICAgICAgIGNvbnN0IG1heEhvdXJzID0gdGhpcy5tYXhEcm9wZG93blZhbHVlLmdldEhvdXJzKCk7XG4gICAgICAgIGNvbnN0IGhvdXJzID0gdGhpcy5fc2VsZWN0ZWREYXRlLmdldEhvdXJzKCk7XG4gICAgICAgIGxldCBtaW51dGVzID0gdGhpcy5fc2VsZWN0ZWREYXRlLmdldE1pbnV0ZXMoKTtcbiAgICAgICAgY29uc3QgbWluTWludXRlcyA9IGhvdXJzID09PSBtaW5Ib3VycyA/IHRoaXMubWluRHJvcGRvd25WYWx1ZS5nZXRNaW51dGVzKCkgOiAwO1xuICAgICAgICBjb25zdCBtYXhNaW51dGVzID0gaG91cnMgPT09IG1heEhvdXJzID8gdGhpcy5tYXhEcm9wZG93blZhbHVlLmdldE1pbnV0ZXMoKSA6XG4gICAgICAgICAgICA2MCAlIHRoaXMuaXRlbXNEZWx0YS5taW51dGVzID4gMCA/IDYwIC0gKDYwICUgdGhpcy5pdGVtc0RlbHRhLm1pbnV0ZXMpIDpcbiAgICAgICAgICAgICAgICA2MCAtIHRoaXMuaXRlbXNEZWx0YS5taW51dGVzO1xuXG4gICAgICAgIGlmICgoZGVsdGEgPCAwICYmIG1pbnV0ZXMgPT09IG1pbk1pbnV0ZXMpIHx8IChkZWx0YSA+IDAgJiYgbWludXRlcyA9PT0gbWF4TWludXRlcykpIHtcbiAgICAgICAgICAgIG1pbnV0ZXMgPSB0aGlzLnNwaW5Mb29wICYmIG1pbnV0ZXMgPT09IG1pbk1pbnV0ZXMgPyBtYXhNaW51dGVzIDogdGhpcy5zcGluTG9vcCAmJiBtaW51dGVzID09PSBtYXhNaW51dGVzID8gbWluTWludXRlcyA6IG1pbnV0ZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtaW51dGVzID0gbWludXRlcyArIGRlbHRhICogdGhpcy5pdGVtc0RlbHRhLm1pbnV0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuc2V0TWludXRlcyhtaW51dGVzKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gdGhpcy52YWxpZGF0ZURyb3Bkb3duVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gbmV3IERhdGUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy51cGRhdGVFZGl0b3JWYWx1ZSgpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZXh0U2Vjb25kcyhkZWx0YTogbnVtYmVyKSB7XG4gICAgICAgIGRlbHRhID0gZGVsdGEgPiAwID8gMSA6IC0xO1xuICAgICAgICBjb25zdCBtaW5Ib3VycyA9IHRoaXMubWluRHJvcGRvd25WYWx1ZS5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBtYXhIb3VycyA9IHRoaXMubWF4RHJvcGRvd25WYWx1ZS5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBob3VycyA9IHRoaXMuX3NlbGVjdGVkRGF0ZS5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBtaW51dGVzID0gdGhpcy5fc2VsZWN0ZWREYXRlLmdldE1pbnV0ZXMoKTtcbiAgICAgICAgY29uc3QgbWluTWludXRlcyA9IHRoaXMubWluRHJvcGRvd25WYWx1ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgIGNvbnN0IG1heE1pbnV0ZXMgPSB0aGlzLm1heERyb3Bkb3duVmFsdWUuZ2V0TWludXRlcygpO1xuICAgICAgICBsZXQgc2Vjb25kcyA9IHRoaXMuX3NlbGVjdGVkRGF0ZS5nZXRTZWNvbmRzKCk7XG4gICAgICAgIGNvbnN0IG1pblNlY29uZHMgPSAoaG91cnMgPT09IG1pbkhvdXJzICYmIG1pbnV0ZXMgPT09IG1pbk1pbnV0ZXMpID8gdGhpcy5taW5Ecm9wZG93blZhbHVlLmdldFNlY29uZHMoKSA6IDA7XG4gICAgICAgIGNvbnN0IG1heFNlY29uZHMgPSAoaG91cnMgPT09IG1heEhvdXJzICYmIG1pbnV0ZXMgPT09IG1heE1pbnV0ZXMpID8gdGhpcy5tYXhEcm9wZG93blZhbHVlLmdldFNlY29uZHMoKSA6XG4gICAgICAgICAgICA2MCAlIHRoaXMuaXRlbXNEZWx0YS5zZWNvbmRzID4gMCA/IDYwIC0gKDYwICUgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHMpIDpcbiAgICAgICAgICAgICAgICA2MCAtIHRoaXMuaXRlbXNEZWx0YS5zZWNvbmRzO1xuXG4gICAgICAgIGlmICgoZGVsdGEgPCAwICYmIHNlY29uZHMgPT09IG1pblNlY29uZHMpIHx8IChkZWx0YSA+IDAgJiYgc2Vjb25kcyA9PT0gbWF4U2Vjb25kcykpIHtcbiAgICAgICAgICAgIHNlY29uZHMgPSB0aGlzLnNwaW5Mb29wICYmIHNlY29uZHMgPT09IG1pblNlY29uZHMgPyBtYXhTZWNvbmRzIDogdGhpcy5zcGluTG9vcCAmJiBzZWNvbmRzID09PSBtYXhTZWNvbmRzID8gbWluU2Vjb25kcyA6IHNlY29uZHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyArIGRlbHRhICogdGhpcy5pdGVtc0RlbHRhLnNlY29uZHM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuc2V0U2Vjb25kcyhzZWNvbmRzKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gdGhpcy52YWxpZGF0ZURyb3Bkb3duVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gbmV3IERhdGUodGhpcy5fc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy51cGRhdGVFZGl0b3JWYWx1ZSgpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZXh0QW1QbShkZWx0YT86IG51bWJlcikge1xuICAgICAgICBjb25zdCBhbXBtID0gdGhpcy5nZXRQYXJ0VmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlLCAnYW1wbScpO1xuICAgICAgICBpZiAoIWRlbHRhIHx8IChhbXBtID09PSAnQU0nICYmIGRlbHRhID4gMCkgfHwgKGFtcG0gPT09ICdQTScgJiYgZGVsdGEgPCAwKSkge1xuICAgICAgICAgICAgbGV0IGhvdXJzID0gdGhpcy5fc2VsZWN0ZWREYXRlLmdldEhvdXJzKCk7XG4gICAgICAgICAgICBjb25zdCBzaWduID0gaG91cnMgPCAxMiA/IDEgOiAtMTtcbiAgICAgICAgICAgIGhvdXJzID0gaG91cnMgKyBzaWduICogMTI7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuc2V0SG91cnMoaG91cnMpO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gdGhpcy52YWxpZGF0ZURyb3Bkb3duVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IG5ldyBEYXRlKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVkaXRvclZhbHVlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgc2V0U2VsZWN0ZWRWYWx1ZSh2YWx1ZTogRGF0ZSkge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSB2YWx1ZSA/IG5ldyBEYXRlKHZhbHVlKSA6IG51bGw7XG4gICAgICAgIGlmICghRGF0ZVRpbWVVdGlsLmlzVmFsaWREYXRlKHRoaXMuX3NlbGVjdGVkRGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IG5ldyBEYXRlKHRoaXMubWluRHJvcGRvd25WYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgRGF0ZVRpbWVVdGlsLmxlc3NUaGFuTWluVmFsdWUodGhpcy5fc2VsZWN0ZWREYXRlLCB0aGlzLm1pbkRyb3Bkb3duVmFsdWUsIHRydWUsIGZhbHNlKSkge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gbmV3IERhdGUodGhpcy5taW5Ecm9wZG93blZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXhWYWx1ZSAmJiBEYXRlVGltZVV0aWwuZ3JlYXRlclRoYW5NYXhWYWx1ZSh0aGlzLl9zZWxlY3RlZERhdGUsIHRoaXMubWF4RHJvcGRvd25WYWx1ZSwgdHJ1ZSwgZmFsc2UpKSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSBuZXcgRGF0ZSh0aGlzLm1heERyb3Bkb3duVmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkRGF0ZS5nZXRIb3VycygpICUgdGhpcy5pdGVtc0RlbHRhLmhvdXJzID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXRlLnNldEhvdXJzKFxuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkRGF0ZS5nZXRIb3VycygpICsgdGhpcy5pdGVtc0RlbHRhLmhvdXJzIC0gdGhpcy5fc2VsZWN0ZWREYXRlLmdldEhvdXJzKCkgJSB0aGlzLml0ZW1zRGVsdGEuaG91cnMsXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkRGF0ZS5nZXRNaW51dGVzKCkgJSB0aGlzLml0ZW1zRGVsdGEubWludXRlcyA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkRGF0ZS5zZXRIb3VycyhcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuZ2V0SG91cnMoKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuZ2V0TWludXRlcygpICsgdGhpcy5pdGVtc0RlbHRhLm1pbnV0ZXMgLSB0aGlzLl9zZWxlY3RlZERhdGUuZ2V0TWludXRlcygpICUgdGhpcy5pdGVtc0RlbHRhLm1pbnV0ZXMsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZERhdGUuZ2V0U2Vjb25kcygpICUgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuc2V0U2Vjb25kcyhcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZERhdGUuZ2V0U2Vjb25kcygpICsgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHMgLSB0aGlzLl9zZWxlY3RlZERhdGUuZ2V0U2Vjb25kcygpICUgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25TdGF0dXNDaGFuZ2VkKCkge1xuICAgICAgICBpZiAoKHRoaXMuX25nQ29udHJvbC5jb250cm9sLnRvdWNoZWQgfHwgdGhpcy5fbmdDb250cm9sLmNvbnRyb2wuZGlydHkpICYmXG4gICAgICAgICAgICAodGhpcy5fbmdDb250cm9sLmNvbnRyb2wudmFsaWRhdG9yIHx8IHRoaXMuX25nQ29udHJvbC5jb250cm9sLmFzeW5jVmFsaWRhdG9yKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lucHV0R3JvdXAuaXNGb2N1c2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dERpcmVjdGl2ZS52YWxpZCA9IHRoaXMuX25nQ29udHJvbC52YWxpZCA/IElneElucHV0U3RhdGUuVkFMSUQgOiBJZ3hJbnB1dFN0YXRlLklOVkFMSUQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXREaXJlY3RpdmUudmFsaWQgPSB0aGlzLl9uZ0NvbnRyb2wudmFsaWQgPyBJZ3hJbnB1dFN0YXRlLklOSVRJQUwgOiBJZ3hJbnB1dFN0YXRlLklOVkFMSUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBCLlAuIDE4IE1heSAyMDIxOiBJZ3hEYXRlUGlja2VyIGRvZXMgbm90IHJlc2V0IGl0cyBzdGF0ZSB1cG9uIHJlc2V0Rm9ybSAjOTUyNlxuICAgICAgICAgICAgdGhpcy5pbnB1dERpcmVjdGl2ZS52YWxpZCA9IElneElucHV0U3RhdGUuSU5JVElBTDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pbnB1dEdyb3VwICYmIHRoaXMuX2lucHV0R3JvdXAuaXNSZXF1aXJlZCAhPT0gdGhpcy5yZXF1aXJlZCkge1xuICAgICAgICAgICAgdGhpcy5faW5wdXRHcm91cC5pc1JlcXVpcmVkID0gdGhpcy5yZXF1aXJlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0TWluTWF4RHJvcGRvd25WYWx1ZSh0eXBlOiBzdHJpbmcsIHRpbWU6IERhdGUpOiBEYXRlIHtcbiAgICAgICAgbGV0IGRlbHRhOiBudW1iZXI7XG5cbiAgICAgICAgY29uc3Qgc2lnbiA9IHR5cGUgPT09ICdtaW4nID8gMSA6IC0xO1xuXG4gICAgICAgIGNvbnN0IGhvdXJzID0gdGltZS5nZXRIb3VycygpO1xuICAgICAgICBsZXQgbWludXRlcyA9IHRpbWUuZ2V0TWludXRlcygpO1xuICAgICAgICBsZXQgc2Vjb25kcyA9IHRpbWUuZ2V0U2Vjb25kcygpO1xuXG4gICAgICAgIGlmICh0aGlzLnNob3dIb3Vyc0xpc3QgJiYgaG91cnMgJSB0aGlzLml0ZW1zRGVsdGEuaG91cnMgPiAwKSB7XG4gICAgICAgICAgICBkZWx0YSA9IHR5cGUgPT09ICdtaW4nID8gdGhpcy5pdGVtc0RlbHRhLmhvdXJzIC0gaG91cnMgJSB0aGlzLml0ZW1zRGVsdGEuaG91cnNcbiAgICAgICAgICAgICAgICA6IGhvdXJzICUgdGhpcy5pdGVtc0RlbHRhLmhvdXJzO1xuICAgICAgICAgICAgbWludXRlcyA9IHR5cGUgPT09ICdtaW4nID8gMFxuICAgICAgICAgICAgICAgIDogNjAgJSB0aGlzLml0ZW1zRGVsdGEubWludXRlcyA+IDAgPyA2MCAtIDYwICUgdGhpcy5pdGVtc0RlbHRhLm1pbnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgOiA2MCAtIHRoaXMuaXRlbXNEZWx0YS5taW51dGVzO1xuICAgICAgICAgICAgc2Vjb25kcyA9IHR5cGUgPT09ICdtaW4nID8gMFxuICAgICAgICAgICAgICAgIDogNjAgJSB0aGlzLml0ZW1zRGVsdGEuc2Vjb25kcyA+IDAgPyA2MCAtIDYwICUgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHNcbiAgICAgICAgICAgICAgICAgICAgOiA2MCAtIHRoaXMuaXRlbXNEZWx0YS5zZWNvbmRzO1xuICAgICAgICAgICAgdGltZS5zZXRIb3Vycyhob3VycyArIHNpZ24gKiBkZWx0YSwgbWludXRlcywgc2Vjb25kcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG93TWludXRlc0xpc3QgJiYgbWludXRlcyAlIHRoaXMuaXRlbXNEZWx0YS5taW51dGVzID4gMCkge1xuICAgICAgICAgICAgZGVsdGEgPSB0eXBlID09PSAnbWluJyA/IHRoaXMuaXRlbXNEZWx0YS5taW51dGVzIC0gbWludXRlcyAlIHRoaXMuaXRlbXNEZWx0YS5taW51dGVzXG4gICAgICAgICAgICAgICAgOiBtaW51dGVzICUgdGhpcy5pdGVtc0RlbHRhLm1pbnV0ZXM7XG4gICAgICAgICAgICBzZWNvbmRzID0gdHlwZSA9PT0gJ21pbicgPyAwXG4gICAgICAgICAgICAgICAgOiA2MCAlIHRoaXMuaXRlbXNEZWx0YS5zZWNvbmRzID4gMCA/IDYwIC0gNjAgJSB0aGlzLml0ZW1zRGVsdGEuc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICA6IDYwIC0gdGhpcy5pdGVtc0RlbHRhLnNlY29uZHM7XG4gICAgICAgICAgICB0aW1lLnNldEhvdXJzKGhvdXJzLCBtaW51dGVzICsgc2lnbiAqIGRlbHRhLCBzZWNvbmRzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNob3dTZWNvbmRzTGlzdCAmJiBzZWNvbmRzICUgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICBkZWx0YSA9IHR5cGUgPT09ICdtaW4nID8gdGhpcy5pdGVtc0RlbHRhLnNlY29uZHMgLSBzZWNvbmRzICUgdGhpcy5pdGVtc0RlbHRhLnNlY29uZHNcbiAgICAgICAgICAgICAgICA6IHNlY29uZHMgJSB0aGlzLml0ZW1zRGVsdGEuc2Vjb25kcztcbiAgICAgICAgICAgIHRpbWUuc2V0SG91cnMoaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgKyBzaWduICogZGVsdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplQ29udGFpbmVyKCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaG91ckxpc3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJMaXN0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5taW51dGVMaXN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVMaXN0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWNvbmRzTGlzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kc0xpc3QubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbGlkYXRlRHJvcGRvd25WYWx1ZShkYXRlOiBEYXRlLCBpc0FtUG0gPSBmYWxzZSk6IERhdGUge1xuICAgICAgICBpZiAoZGF0ZSA+IHRoaXMubWF4RHJvcGRvd25WYWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzQW1QbSAmJiBkYXRlLmdldEhvdXJzKCkgIT09IHRoaXMubWF4RHJvcGRvd25WYWx1ZS5nZXRIb3VycygpKSB7XG4gICAgICAgICAgICAgICAgZGF0ZS5zZXRIb3VycygxMik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0aGlzLm1heERyb3Bkb3duVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm1pbkRyb3Bkb3duVmFsdWUpIHtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0aGlzLm1pbkRyb3Bkb3duVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0VmFsdWVDaGFuZ2Uob2xkVmFsdWU6IERhdGUgfCBzdHJpbmcsIG5ld1ZhbHVlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgICAgIGlmICghaXNFcXVhbChvbGRWYWx1ZSwgbmV3VmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQobmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0VmFsaWRhdGlvbkZhaWxlZEV2ZW50KHByZXZpb3VzVmFsdWU6IERhdGUgfCBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgYXJnczogSWd4VGltZVBpY2tlclZhbGlkYXRpb25GYWlsZWRFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgIHByZXZpb3VzVmFsdWUsXG4gICAgICAgICAgICBjdXJyZW50VmFsdWU6IHRoaXMudmFsdWVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uRmFpbGVkLmVtaXQoYXJncyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVWYWxpZGl0eU9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgICAgICAgaWYgKHRoaXMuX25nQ29udHJvbCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9uZ0NvbnRyb2wudmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RGlyZWN0aXZlLnZhbGlkID0gSWd4SW5wdXRTdGF0ZS5JTlZBTElEO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RGlyZWN0aXZlLnZhbGlkID0gSWd4SW5wdXRTdGF0ZS5JTklUSUFMO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWx1ZUluUmFuZ2UodmFsdWU6IERhdGUsIG1pblZhbHVlOiBEYXRlLCBtYXhWYWx1ZTogRGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAobWluVmFsdWUgJiYgRGF0ZVRpbWVVdGlsLmxlc3NUaGFuTWluVmFsdWUodmFsdWUsIG1pblZhbHVlLCB0cnVlLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4VmFsdWUgJiYgRGF0ZVRpbWVVdGlsLmdyZWF0ZXJUaGFuTWF4VmFsdWUodmFsdWUsIG1heFZhbHVlLCB0cnVlLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VUb0RhdGUodmFsdWU6IERhdGUgfCBzdHJpbmcpOiBEYXRlIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiBEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodmFsdWUpID8gdmFsdWUgOiBEYXRlVGltZVV0aWwucGFyc2VJc29EYXRlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvVHdlbnR5Rm91ckhvdXJGb3JtYXQoaG91cjogbnVtYmVyLCBhbXBtOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgIH0gZWxzZSBpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaG91cjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVZhbHVlKG5ld1ZhbHVlOiBEYXRlIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZSA/IG5ldyBEYXRlKG5ld1ZhbHVlKSA6IG5ld1ZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZSh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgZGF0ZS5zZXRIb3VycyhuZXdWYWx1ZT8uZ2V0SG91cnMoKSB8fCAwLCBuZXdWYWx1ZT8uZ2V0TWludXRlcygpIHx8IDAsIG5ld1ZhbHVlPy5nZXRTZWNvbmRzKCkgfHwgMCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZSA/IHRoaXMudG9JU09TdHJpbmcobmV3VmFsdWUpIDogbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUVkaXRvclZhbHVlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZSA/IG5ldyBEYXRlKHRoaXMuZGF0ZVRpbWVFZGl0b3IudmFsdWUpIDogbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXRIb3Vycyh0aGlzLl9zZWxlY3RlZERhdGUuZ2V0SG91cnMoKSwgdGhpcy5fc2VsZWN0ZWREYXRlLmdldE1pbnV0ZXMoKSwgdGhpcy5fc2VsZWN0ZWREYXRlLmdldFNlY29uZHMoKSk7XG4gICAgICAgIHRoaXMuZGF0ZVRpbWVFZGl0b3IudmFsdWUgPSBkYXRlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9EYXRlRWRpdG9yRXZlbnRzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbHVlQ2hhbmdlLnBpcGUoXG4gICAgICAgICAgICAvLyBpbnRlcm5hbCBkYXRlIGVkaXRvciBkaXJlY3RpdmUgaXMgb25seSB1c2VkIHcvIERhdGUgb2JqZWN0IHZhbHVlczpcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpLnN1YnNjcmliZSgoZGF0ZTogRGF0ZSB8IG51bGwpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGRhdGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kYXRlVGltZUVkaXRvci52YWxpZGF0aW9uRmFpbGVkLnBpcGUoXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0VmFsaWRhdGlvbkZhaWxlZEV2ZW50KGV2ZW50Lm9sZFZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9Ub2dnbGVEaXJlY3RpdmVFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRvZ2dsZVJlZikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lucHV0R3JvdXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVJlZi5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5faW5wdXRHcm91cC5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyAncHgnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVJlZi5vcGVuaW5nLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSkuc3Vic2NyaWJlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJnczogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIGV2ZW50OiBlLmV2ZW50LCBjYW5jZWw6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuaW5nLmVtaXQoYXJncyk7XG4gICAgICAgICAgICAgICAgZS5jYW5jZWwgPSBhcmdzLmNhbmNlbDtcbiAgICAgICAgICAgICAgICBpZiAoYXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVDb250YWluZXIoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVJlZi5vcGVuZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbmVkLmVtaXQoeyBvd25lcjogdGhpcyB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVJlZi5jbG9zZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoeyBvd25lcjogdGhpcyB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVJlZi5jbG9zaW5nLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSkuc3Vic2NyaWJlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXJnczogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIGV2ZW50OiBlLmV2ZW50LCBjYW5jZWw6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zaW5nLmVtaXQoYXJncyk7XG4gICAgICAgICAgICAgICAgZS5jYW5jZWwgPSBhcmdzLmNhbmNlbDtcbiAgICAgICAgICAgICAgICBpZiAoYXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VUb0RhdGUodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbHVlIGFzIERhdGUpPy5nZXRUaW1lKCkgIT09IHZhbHVlPy5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh0aGlzLl9zZWxlY3RlZERhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBEbyBub3QgZm9jdXMgdGhlIGlucHV0IGlmIGNsaWNraW5nIG91dHNpZGUgaW4gZHJvcGRvd24gbW9kZVxuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRFZGl0RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCAmJiAhKGUuZXZlbnQgJiYgdGhpcy5pc0Ryb3Bkb3duKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsaWRpdHlPbkJsdXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIElneFRpbWVQaWNrZXJDb21wb25lbnQsXG4gICAgICAgIElneEl0ZW1MaXN0RGlyZWN0aXZlLFxuICAgICAgICBJZ3hUaW1lSXRlbURpcmVjdGl2ZSxcbiAgICAgICAgSWd4VGltZVBpY2tlclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hUaW1lUGlja2VyQWN0aW9uc0RpcmVjdGl2ZSxcbiAgICAgICAgVGltZUZvcm1hdFBpcGUsXG4gICAgICAgIFRpbWVJdGVtUGlwZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hUaW1lUGlja2VyQ29tcG9uZW50LFxuICAgICAgICBJZ3hUaW1lUGlja2VyVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneFRpbWVQaWNrZXJBY3Rpb25zRGlyZWN0aXZlLFxuICAgICAgICBJZ3hQaWNrZXJzQ29tbW9uTW9kdWxlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgSWd4RGF0ZVRpbWVFZGl0b3JNb2R1bGUsXG4gICAgICAgIElneElucHV0R3JvdXBNb2R1bGUsXG4gICAgICAgIElneEljb25Nb2R1bGUsXG4gICAgICAgIElneEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgSWd4TWFza01vZHVsZSxcbiAgICAgICAgSWd4VG9nZ2xlTW9kdWxlLFxuICAgICAgICBJZ3hUZXh0U2VsZWN0aW9uTW9kdWxlXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIElneFRpbWVQaWNrZXJNb2R1bGUgeyB9XG4iLCI8aWd4LWlucHV0LWdyb3VwIFtkaXNwbGF5RGVuc2l0eV09XCJkaXNwbGF5RGVuc2l0eVwiIFt0eXBlXT1cInR5cGVcIiBbc3VwcHJlc3NJbnB1dEF1dG9mb2N1c109XCJ0aGlzLmlzRHJvcGRvd25cIj5cbiAgICA8aW5wdXQgW2Rpc3BsYXlWYWx1ZVBpcGVdPVwidGhpcy5mb3JtYXR0ZXIgPyBkaXNwbGF5VmFsdWUgOiBudWxsXCIgaWd4SW5wdXQgW2lneERhdGVUaW1lRWRpdG9yXT1cInRoaXMuaW5wdXRGb3JtYXRcIlxuICAgICAgICB0eXBlPVwidGV4dFwiIFtyZWFkb25seV09XCIhdGhpcy5pc0Ryb3Bkb3duIHx8IHRoaXMucmVhZE9ubHlcIiBbbWluVmFsdWVdPVwidGhpcy5taW5WYWx1ZVwiIFttYXhWYWx1ZV09XCJ0aGlzLm1heFZhbHVlXCJcbiAgICAgICAgW2xvY2FsZV09XCJ0aGlzLmxvY2FsZVwiIFtzcGluRGVsdGFdPVwidGhpcy5pdGVtc0RlbHRhXCIgW3NwaW5Mb29wXT1cInRoaXMuc3Bpbkxvb3BcIiBbcGxhY2Vob2xkZXJdPVwidGhpcy5wbGFjZWhvbGRlclwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJ0aGlzLmRpc2FibGVkXCIgW2Rpc3BsYXlGb3JtYXRdPVwidGhpcy5kaXNwbGF5Rm9ybWF0XCJcbiAgICAgICAgW2lneFRleHRTZWxlY3Rpb25dPVwidGhpcy5pc0Ryb3Bkb3duICYmICF0aGlzLnJlYWRPbmx5XCIgcm9sZT1cImNvbWJvYm94XCIgYXJpYS1oYXNwb3B1cD1cImRpYWxvZ1wiXG4gICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiIXRoaXMudG9nZ2xlRGlyZWN0aXZlLmNvbGxhcHNlZFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJ0aGlzLmxhYmVsPy5pZFwiXG4gICAgICAgIChjbGljayk9XCIhdGhpcy5pc0Ryb3Bkb3duICYmIHRoaXMudG9nZ2xlKClcIi8+XG5cbiAgICA8aWd4LXByZWZpeCAqbmdJZj1cIiF0aGlzLnRvZ2dsZUNvbXBvbmVudHMubGVuZ3RoXCIgKGNsaWNrKT1cInRoaXMudG9nZ2xlKClcIj5cbiAgICAgICAgPGlneC1pY29uIFt0aXRsZV09XCJ0aGlzLnZhbHVlID8gcmVzb3VyY2VTdHJpbmdzLmlneF90aW1lX3BpY2tlcl9jaGFuZ2VfdGltZSA6IHJlc291cmNlU3RyaW5ncy5pZ3hfdGltZV9waWNrZXJfY2hvb3NlX3RpbWVcIj5hY2Nlc3NfdGltZTwvaWd4LWljb24+XG4gICAgPC9pZ3gtcHJlZml4PlxuXG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cIltpZ3hMYWJlbF1cIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2lneExhYmVsXVwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiaWd4LXByZWZpeFwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtcHJlZml4LFtpZ3hQcmVmaXhdXCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPGlneC1zdWZmaXggKm5nSWY9XCJ0aGlzLnNob3dDbGVhckJ1dHRvblwiIChjbGljayk9XCJ0aGlzLmNsZWFyKCk7ICRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiPlxuICAgICAgICA8aWd4LWljb24+Y2xlYXI8L2lneC1pY29uPlxuICAgIDwvaWd4LXN1ZmZpeD5cblxuICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJpZ3gtc3VmZml4XCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1zdWZmaXgsW2lneFN1ZmZpeF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1oaW50XCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1oaW50LFtpZ3hIaW50XVwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbjwvaWd4LWlucHV0LWdyb3VwPlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRUaW1lUGlja2VyQWN0aW9ucz5cbiAgICA8ZGl2ICpuZ0lmPVwidGhpcy5jYW5jZWxCdXR0b25MYWJlbCB8fCB0aGlzLm9rQnV0dG9uTGFiZWxcIiBjbGFzcz1cImlneC10aW1lLXBpY2tlcl9fYnV0dG9uc1wiPlxuICAgICAgICA8YnV0dG9uICpuZ0lmPVwidGhpcy5jYW5jZWxCdXR0b25MYWJlbFwiIGlneEJ1dHRvbj1cImZsYXRcIiAoY2xpY2spPVwidGhpcy5jYW5jZWxCdXR0b25DbGljaygpXCI+XG4gICAgICAgICAgICB7e3RoaXMuY2FuY2VsQnV0dG9uTGFiZWx9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInRoaXMub2tCdXR0b25MYWJlbFwiIGlneEJ1dHRvbj1cImZsYXRcIiAoY2xpY2spPVwidGhpcy5va0J1dHRvbkNsaWNrKClcIj5cbiAgICAgICAgICAgIHt7dGhpcy5va0J1dHRvbkxhYmVsfX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuXG48ZGl2ICN0b2dnbGVEaXJlY3RpdmU9XCJ0b2dnbGVcIiBpZ3hUb2dnbGUgcm9sZT1cImRpYWxvZ1wiIGNsYXNzPVwiaWd4LXRpbWUtcGlja2VyXCJcbiAgICBbbmdDbGFzc109XCJ7J2lneC10aW1lLXBpY2tlci0tZHJvcGRvd24nOiB0aGlzLmlzRHJvcGRvd24sICdpZ3gtdGltZS1waWNrZXItLXZlcnRpY2FsJzogdGhpcy5pc1ZlcnRpY2FsICYmICF0aGlzLmlzRHJvcGRvd259XCI+XG4gICAgPGRpdiAqbmdJZj1cIiF0aGlzLmlzRHJvcGRvd25cIiBjbGFzcz1cImlneC10aW1lLXBpY2tlcl9faGVhZGVyXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cImlneC10aW1lLXBpY2tlcl9faGVhZGVyLWhvdXJcIj5cbiAgICAgICAgICAgIDxzcGFuPnt7IHRoaXMuc2VsZWN0ZWREYXRlIHwgdGltZUZvcm1hdFBpcGUgfX08L3NwYW4+XG4gICAgICAgIDwvaDI+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImlneC10aW1lLXBpY2tlcl9fbWFpblwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LXRpbWUtcGlja2VyX19ib2R5XCI+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwidGhpcy5zaG93SG91cnNMaXN0XCIgI2hvdXJMaXN0IFtpZ3hJdGVtTGlzdF09XCInaG91ckxpc3QnXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gW2lneFRpbWVJdGVtXT1cImhvdXJcIiAjdGltZUl0ZW09XCJ0aW1lSXRlbVwiIGFyaWEtbGFiZWw9XCJob3VyXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIucm9sZV09XCJ0aW1lSXRlbS5pc1NlbGVjdGVkVGltZSA/ICdzcGluYnV0dG9uJyA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInRpbWVJdGVtLmlzU2VsZWN0ZWRUaW1lID8gdGltZUl0ZW0uaG91clZhbHVlIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwidGltZUl0ZW0uaXNTZWxlY3RlZFRpbWUgPyB0aW1lSXRlbS5taW5WYWx1ZSA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cInRpbWVJdGVtLmlzU2VsZWN0ZWRUaW1lID8gdGltZUl0ZW0ubWF4VmFsdWUgOiBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGhvdXIgb2YgaG91ckl0ZW1zIHwgdGltZUl0ZW1QaXBlOidob3VyJzp0aGlzLnNlbGVjdGVkRGF0ZTp0aGlzLm1pbkRyb3Bkb3duVmFsdWU6dGhpcy5tYXhEcm9wZG93blZhbHVlXCI+e3sgaG91ciB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cInRoaXMuc2hvd01pbnV0ZXNMaXN0XCIgI21pbnV0ZUxpc3QgW2lneEl0ZW1MaXN0XT1cIidtaW51dGVMaXN0J1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIFtpZ3hUaW1lSXRlbV09XCJtaW51dGVcIiAjdGltZUl0ZW09XCJ0aW1lSXRlbVwiIGFyaWEtbGFiZWw9XCJtaW51dGVzXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIucm9sZV09XCJ0aW1lSXRlbS5pc1NlbGVjdGVkVGltZSA/ICdzcGluYnV0dG9uJyA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInRpbWVJdGVtLmlzU2VsZWN0ZWRUaW1lID8gbWludXRlIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwidGltZUl0ZW0uaXNTZWxlY3RlZFRpbWUgPyB0aW1lSXRlbS5taW5WYWx1ZSA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cInRpbWVJdGVtLmlzU2VsZWN0ZWRUaW1lID8gdGltZUl0ZW0ubWF4VmFsdWUgOiBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IG1pbnV0ZSBvZiBtaW51dGVJdGVtcyB8IHRpbWVJdGVtUGlwZTonbWludXRlcyc6dGhpcy5zZWxlY3RlZERhdGU6dGhpcy5taW5Ecm9wZG93blZhbHVlOnRoaXMubWF4RHJvcGRvd25WYWx1ZVwiPnt7IG1pbnV0ZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cInRoaXMuc2hvd1NlY29uZHNMaXN0XCIgI3NlY29uZHNMaXN0IFtpZ3hJdGVtTGlzdF09XCInc2Vjb25kc0xpc3QnXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gW2lneFRpbWVJdGVtXT1cInNlY29uZHNcIiAjdGltZUl0ZW09XCJ0aW1lSXRlbVwiIGFyaWEtbGFiZWw9XCJzZWNvbmRzXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIucm9sZV09XCJ0aW1lSXRlbS5pc1NlbGVjdGVkVGltZSA/ICdzcGluYnV0dG9uJyA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInRpbWVJdGVtLmlzU2VsZWN0ZWRUaW1lID8gc2Vjb25kcyA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWluXT1cInRpbWVJdGVtLmlzU2VsZWN0ZWRUaW1lID8gdGltZUl0ZW0ubWluVmFsdWUgOiBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJ0aW1lSXRlbS5pc1NlbGVjdGVkVGltZSA/IHRpbWVJdGVtLm1heFZhbHVlIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBzZWNvbmRzIG9mIHNlY29uZHNJdGVtcyB8IHRpbWVJdGVtUGlwZTonc2Vjb25kcyc6dGhpcy5zZWxlY3RlZERhdGU6dGhpcy5taW5Ecm9wZG93blZhbHVlOnRoaXMubWF4RHJvcGRvd25WYWx1ZVwiPnt7IHNlY29uZHMgfX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJ0aGlzLnNob3dBbVBtTGlzdFwiICNhbXBtTGlzdCBbaWd4SXRlbUxpc3RdPVwiJ2FtcG1MaXN0J1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIFtpZ3hUaW1lSXRlbV09XCJhbXBtXCIgI3RpbWVJdGVtPVwidGltZUl0ZW1cIiBhcmlhLWxhYmVsPVwiYW1wbVwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLnJvbGVdPVwidGltZUl0ZW0uaXNTZWxlY3RlZFRpbWUgPyAnc3BpbmJ1dHRvbicgOiBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJ0aW1lSXRlbS5pc1NlbGVjdGVkVGltZSA/IGFtcG0gOiBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1pbl09XCJ0aW1lSXRlbS5pc1NlbGVjdGVkVGltZSA/IHRpbWVJdGVtLm1pblZhbHVlIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtYXhdPVwidGltZUl0ZW0uaXNTZWxlY3RlZFRpbWUgPyB0aW1lSXRlbS5tYXhWYWx1ZSA6IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgYW1wbSBvZiBhbXBtSXRlbXMgfCB0aW1lSXRlbVBpcGU6J2FtcG0nOnRoaXMuc2VsZWN0ZWREYXRlOnRoaXMubWluRHJvcGRvd25WYWx1ZTp0aGlzLm1heERyb3Bkb3duVmFsdWVcIj57eyBhbXBtIH19PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgICAqbmdUZW1wbGF0ZU91dGxldD1cInRpbWVQaWNrZXJBY3Rpb25zRGlyZWN0aXZlID8gdGltZVBpY2tlckFjdGlvbnNEaXJlY3RpdmUudGVtcGxhdGUgOiBkZWZhdWx0VGltZVBpY2tlckFjdGlvbnNcIj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==