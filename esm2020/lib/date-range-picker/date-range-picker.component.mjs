import { Component, ContentChild, ContentChildren, EventEmitter, HostBinding, HostListener, Inject, Input, LOCALE_ID, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, noop } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { fadeIn, fadeOut } from '../animations/fade';
import { CalendarSelection, WEEKDAYS } from '../calendar/public_api';
import { DateRangeType } from '../core/dates';
import { DisplayDensityToken } from '../core/density';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { DateTimeUtil } from '../date-common/util/date-time.util';
import { isDate, parseDate } from '../core/utils';
import { IgxCalendarContainerComponent } from '../date-common/calendar-container/calendar-container.component';
import { IgxPickerActionsDirective } from '../date-common/picker-icons.common';
import { PickerBaseDirective } from '../date-common/picker-base.directive';
import { IgxInputDirective, IgxInputGroupComponent, IgxInputState, IgxLabelDirective, IGX_INPUT_GROUP_TYPE } from '../input-group/public_api';
import { AutoPositionStrategy, IgxOverlayService } from '../services/public_api';
import { IgxDateRangeEndComponent, IgxDateRangeInputsBaseComponent, IgxDateRangeSeparatorDirective, IgxDateRangeStartComponent } from './date-range-picker-inputs.common';
import * as i0 from "@angular/core";
import * as i1 from "../core/utils";
import * as i2 from "../icon/icon.component";
import * as i3 from "../input-group/input-group.component";
import * as i4 from "@angular/common";
import * as i5 from "../directives/input/input.directive";
import * as i6 from "../directives/prefix/prefix.directive";
import * as i7 from "./date-range-picker-inputs.common";
import * as i8 from "../services/public_api";
const SingleInputDatesConcatenationString = ' - ';
/**
 * Provides the ability to select a range of dates from a calendar UI or editable inputs.
 *
 * @igxModule IgxDateRangeModule
 *
 * @igxTheme igx-input-group-theme, igx-calendar-theme, igx-date-range-picker-theme
 *
 * @igxKeywords date, range, date range, date picker
 *
 * @igxGroup scheduling
 *
 * @remarks
 * It displays the range selection in a single or two input fields.
 * The default template displays a single *readonly* input field
 * while projecting `igx-date-range-start` and `igx-date-range-end`
 * displays two *editable* input fields.
 *
 * @example
 * ```html
 * <igx-date-range-picker mode="dropdown"></igx-date-range-picker>
 * ```
 */
export class IgxDateRangePickerComponent extends PickerBaseDirective {
    constructor(element, _localeId, platform, _injector, _moduleRef, _cdr, _overlayService, _displayDensityOptions, _inputGroupType) {
        super(element, _localeId, _displayDensityOptions, _inputGroupType);
        this.element = element;
        this._localeId = _localeId;
        this.platform = platform;
        this._injector = _injector;
        this._moduleRef = _moduleRef;
        this._cdr = _cdr;
        this._overlayService = _overlayService;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        /**
         * The number of displayed month views.
         *
         * @remarks
         * Default is `2`.
         *
         * @example
         * ```html
         * <igx-date-range-picker [displayMonthsCount]="3"></igx-date-range-picker>
         * ```
         */
        this.displayMonthsCount = 2;
        /**
         * The start day of the week.
         *
         * @remarks
         * Can be assigned to a numeric value or to `WEEKDAYS` enum value.
         *
         * @example
         * ```html
         * <igx-date-range-picker [weekStart]="1"></igx-date-range-picker>
         * ```
         */
        this.weekStart = WEEKDAYS.SUNDAY;
        /**
         * Sets the `placeholder` for single-input `IgxDateRangePickerComponent`.
         *
         *   @example
         * ```html
         * <igx-date-range-picker [placeholder]="'Choose your dates'"></igx-date-range-picker>
         * ```
         */
        this.placeholder = '';
        /**
         * Emitted when the picker's value changes. Used for two-way binding.
         *
         * @example
         * ```html
         * <igx-date-range-picker [(value)]="date"></igx-date-range-picker>
         * ```
         */
        this.valueChange = new EventEmitter();
        /** @hidden @internal */
        this.cssClass = 'igx-date-range-picker';
        this._resourceStrings = CurrentResourceStrings.DateRangePickerResStrings;
        this._doneButtonText = null;
        this._dateSeparator = null;
        this._overlaySubFilter = [
            filter(x => x.id === this._overlayId),
            takeUntil(merge(this._destroy$, this.closed))
        ];
        this._dialogOverlaySettings = {
            closeOnOutsideClick: true,
            modal: true,
            closeOnEscape: true
        };
        this._dropDownOverlaySettings = {
            closeOnOutsideClick: true,
            modal: false,
            closeOnEscape: true
        };
        this.onChangeCallback = noop;
        this.onTouchCallback = noop;
        this.onValidatorChange = noop;
        this.onStatusChanged = () => {
            if (this.inputGroup) {
                this.inputDirective.valid = this.isTouchedOrDirty
                    ? this.getInputState(this.inputGroup.isFocused)
                    : IgxInputState.INITIAL;
            }
            else if (this.hasProjectedInputs) {
                this.projectedInputs
                    .forEach(i => {
                    i.inputDirective.valid = this.isTouchedOrDirty
                        ? this.getInputState(i.isFocused)
                        : IgxInputState.INITIAL;
                    ;
                });
            }
            this.setRequiredToInputs();
        };
    }
    /**
     * The default text of the calendar dialog `done` button.
     *
     * @remarks
     * Default value is `Done`.
     * An @Input property that renders Done button with custom text. By default `doneButtonText` is set to Done.
     * The button will only show up in `dialog` mode.
     *
     * @example
     * ```html
     * <igx-date-range-picker doneButtonText="完了"></igx-date-range-picker>
     * ```
     */
    set doneButtonText(value) {
        this._doneButtonText = value;
    }
    get doneButtonText() {
        if (this._doneButtonText === null) {
            return this.resourceStrings.igx_date_range_picker_done_button;
        }
        return this._doneButtonText;
    }
    /**
     * The minimum value in a valid range.
     *
     * @example
     * <igx-date-range-picker [minValue]="minDate"></igx-date-range-picker>
     */
    set minValue(value) {
        this._minValue = value;
        this.onValidatorChange();
    }
    get minValue() {
        return this._minValue;
    }
    /**
     * The maximum value in a valid range.
     *
     * @example
     * <igx-date-range-picker [maxValue]="maxDate"></igx-date-range-picker>
     */
    set maxValue(value) {
        this._maxValue = value;
        this.onValidatorChange();
    }
    get maxValue() {
        return this._maxValue;
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
    /** @hidden @internal */
    get dateSeparator() {
        if (this._dateSeparator === null) {
            return this.resourceStrings.igx_date_range_picker_date_separator;
        }
        return this._dateSeparator;
    }
    /** @hidden @internal */
    get appliedFormat() {
        return DateTimeUtil.getLocaleDateFormat(this.locale, this.displayFormat)
            || DateTimeUtil.DEFAULT_INPUT_FORMAT;
    }
    /** @hidden @internal */
    get singleInputFormat() {
        if (this.placeholder !== '') {
            return this.placeholder;
        }
        const format = this.appliedFormat;
        return `${format}${SingleInputDatesConcatenationString}${format}`;
    }
    /**
     * Gets calendar state.
     *
     * ```typescript
     * let state = this.dateRange.collapsed;
     * ```
     */
    get collapsed() {
        return this._collapsed;
    }
    /**
     * The currently selected value / range from the calendar
     *
     * @remarks
     * The current value is of type `DateRange`
     *
     * @example
     * ```typescript
     * const newValue: DateRange = { start: new Date("2/2/2012"), end: new Date("3/3/2013")};
     * this.dateRangePicker.value = newValue;
     * ```
     */
    get value() {
        return this._value;
    }
    set value(value) {
        this.updateValue(value);
        this.onChangeCallback(value);
        this.valueChange.emit(value);
    }
    /** @hidden @internal */
    get hasProjectedInputs() {
        return this.projectedInputs?.length > 0;
    }
    /** @hidden @internal */
    get separatorClass() {
        return this.getComponentDensityClass('igx-date-range-picker__label');
    }
    get required() {
        if (this._ngControl && this._ngControl.control && this._ngControl.control.validator) {
            const error = this._ngControl.control.validator({});
            return (error && error.required) ? true : false;
        }
        return false;
    }
    get calendar() {
        return this._calendar;
    }
    get dropdownOverlaySettings() {
        return Object.assign({}, this._dropDownOverlaySettings, this.overlaySettings);
    }
    get dialogOverlaySettings() {
        return Object.assign({}, this._dialogOverlaySettings, this.overlaySettings);
    }
    /** @hidden @internal */
    onKeyDown(event) {
        switch (event.key) {
            case this.platform.KEYMAP.ARROW_UP:
                if (event.altKey) {
                    this.close();
                }
                break;
            case this.platform.KEYMAP.ARROW_DOWN:
                if (event.altKey) {
                    this.open();
                }
                break;
        }
    }
    /**
     * Opens the date range picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-range-picker #dateRange></igx-date-range-picker>
     *
     * <button (click)="dateRange.open()">Open Dialog</button
     * ```
     */
    open(overlaySettings) {
        if (!this.collapsed || this.disabled) {
            return;
        }
        const settings = Object.assign({}, this.isDropdown
            ? this.dropdownOverlaySettings
            : this.dialogOverlaySettings, overlaySettings);
        this._overlayId = this._overlayService
            .attach(IgxCalendarContainerComponent, settings, this._moduleRef);
        this.subscribeToOverlayEvents();
        this._overlayService.show(this._overlayId);
    }
    /**
     * Closes the date range picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-range-picker #dateRange></igx-date-range-picker>
     *
     * <button (click)="dateRange.close()">Close Dialog</button>
     * ```
     */
    close() {
        if (!this.collapsed) {
            this._overlayService.hide(this._overlayId);
        }
    }
    /**
     * Toggles the date range picker's dropdown or dialog
     *
     * @example
     * ```html
     * <igx-date-range-picker #dateRange></igx-date-range-picker>
     *
     * <button (click)="dateRange.toggle()">Toggle Dialog</button>
     * ```
     */
    toggle(overlaySettings) {
        if (!this.collapsed) {
            this.close();
        }
        else {
            this.open(overlaySettings);
        }
    }
    /**
     * Selects a range of dates. If no `endDate` is passed, range is 1 day (only `startDate`)
     *
     * @example
     * ```typescript
     * public selectFiveDayRange() {
     *  const today = new Date();
     *  const inFiveDays = new Date(new Date().setDate(today.getDate() + 5));
     *  this.dateRange.select(today, inFiveDays);
     * }
     * ```
     */
    select(startDate, endDate) {
        endDate = endDate ?? startDate;
        const dateRange = [startDate, endDate];
        this.handleSelection(dateRange);
    }
    /** @hidden @internal */
    writeValue(value) {
        this.updateValue(value);
    }
    /** @hidden @internal */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /** @hidden @internal */
    registerOnTouched(fn) {
        this.onTouchCallback = fn;
    }
    /** @hidden @internal */
    validate(control) {
        const value = control.value;
        const errors = {};
        if (value) {
            if (this.hasProjectedInputs) {
                const startInput = this.projectedInputs.find(i => i instanceof IgxDateRangeStartComponent);
                const endInput = this.projectedInputs.find(i => i instanceof IgxDateRangeEndComponent);
                if (!startInput.dateTimeEditor.value) {
                    Object.assign(errors, { startValue: true });
                }
                if (!endInput.dateTimeEditor.value) {
                    Object.assign(errors, { endValue: true });
                }
            }
            const min = parseDate(this.minValue);
            const max = parseDate(this.maxValue);
            const start = parseDate(value.start);
            const end = parseDate(value.end);
            if ((min && start && DateTimeUtil.lessThanMinValue(start, min, false))
                || (min && end && DateTimeUtil.lessThanMinValue(end, min, false))) {
                Object.assign(errors, { minValue: true });
            }
            if ((max && start && DateTimeUtil.greaterThanMaxValue(start, max, false))
                || (max && end && DateTimeUtil.greaterThanMaxValue(end, max, false))) {
                Object.assign(errors, { maxValue: true });
            }
        }
        return Object.keys(errors).length > 0 ? errors : null;
    }
    /** @hidden @internal */
    registerOnValidatorChange(fn) {
        this.onValidatorChange = fn;
    }
    /** @hidden @internal */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** @hidden */
    ngOnInit() {
        this._ngControl = this._injector.get(NgControl, null);
    }
    /** @hidden */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscribeToDateEditorEvents();
        this.configPositionStrategy();
        this.configOverlaySettings();
        this.cacheFocusedInput();
        this.attachOnTouched();
        this.setRequiredToInputs();
        if (this._ngControl) {
            this._statusChanges$ = this._ngControl.statusChanges.subscribe(this.onStatusChanged.bind(this));
        }
        // delay invocations until the current change detection cycle has completed
        Promise.resolve().then(() => {
            this.updateDisabledState();
            this.initialSetValue();
            this.updateInputs();
            // B.P. 07 July 2021 - IgxDateRangePicker not showing initial disabled state with ChangeDetectionStrategy.OnPush #9776
            /**
             * if disabled is placed on the range picker element and there are projected inputs
             * run change detection since igxInput will initially set the projected inputs' disabled to false
             */
            if (this.hasProjectedInputs && this.disabled) {
                this._cdr.markForCheck();
            }
        });
        this.updateDisplayFormat();
        this.updateInputFormat();
    }
    /** @hidden @internal */
    ngOnChanges(changes) {
        if (changes['displayFormat'] && this.hasProjectedInputs) {
            this.updateDisplayFormat();
        }
        if (changes['inputFormat'] && this.hasProjectedInputs) {
            this.updateInputFormat();
        }
        if (changes['disabled']) {
            this.updateDisabledState();
        }
    }
    /** @hidden @internal */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._statusChanges$) {
            this._statusChanges$.unsubscribe();
        }
        if (this._overlayId) {
            this._overlayService.detach(this._overlayId);
        }
    }
    /** @hidden @internal */
    getEditElement() {
        return this.inputDirective.nativeElement;
    }
    get isTouchedOrDirty() {
        return (this._ngControl.control.touched || this._ngControl.control.dirty)
            && (!!this._ngControl.control.validator || !!this._ngControl.control.asyncValidator);
    }
    handleSelection(selectionData) {
        let newValue = this.extractRange(selectionData);
        if (!newValue.start && !newValue.end) {
            newValue = null;
        }
        this.value = newValue;
        if (this.isDropdown && selectionData?.length > 1) {
            this.close();
        }
    }
    handleClosing(e) {
        const args = { owner: this, cancel: e?.cancel, event: e?.event };
        this.closing.emit(args);
        e.cancel = args.cancel;
        if (args.cancel) {
            return;
        }
        if (this.isDropdown && e?.event && !this.element.nativeElement.contains(e.event.target)) {
            // outside click
            this.updateValidityOnBlur();
        }
        else {
            this.onTouchCallback();
            // input click
            if (this.hasProjectedInputs && this._focusedInput) {
                this._focusedInput.setFocus();
                this._focusedInput = null;
            }
            if (this.inputDirective) {
                this.inputDirective.focus();
            }
        }
    }
    subscribeToOverlayEvents() {
        this._overlayService.opening.pipe(...this._overlaySubFilter).subscribe((e) => {
            const overlayEvent = e;
            const args = { owner: this, cancel: overlayEvent?.cancel, event: e.event };
            this.opening.emit(args);
            if (args.cancel) {
                this._overlayService.detach(this._overlayId);
                overlayEvent.cancel = true;
                return;
            }
            this._initializeCalendarContainer(e.componentRef.instance);
            this._collapsed = false;
            this.updateCalendar();
        });
        this._overlayService.opened.pipe(...this._overlaySubFilter).subscribe(() => {
            this.calendar?.daysView?.focusActiveDate();
            this.opened.emit({ owner: this });
        });
        this._overlayService.closing.pipe(...this._overlaySubFilter).subscribe((e) => {
            this.handleClosing(e);
        });
        this._overlayService.closed.pipe(...this._overlaySubFilter).subscribe(() => {
            this._overlayService.detach(this._overlayId);
            this._collapsed = true;
            this._overlayId = null;
            this.closed.emit({ owner: this });
        });
    }
    updateValue(value) {
        this._value = value ? value : null;
        this.updateInputs();
        this.updateCalendar();
    }
    updateValidityOnBlur() {
        this.onTouchCallback();
        if (this._ngControl) {
            if (this.hasProjectedInputs) {
                this.projectedInputs.forEach(i => {
                    if (!this._ngControl.valid) {
                        i.updateInputValidity(IgxInputState.INVALID);
                    }
                    else {
                        i.updateInputValidity(IgxInputState.INITIAL);
                    }
                });
            }
            if (this.inputDirective) {
                if (!this._ngControl.valid) {
                    this.inputDirective.valid = IgxInputState.INVALID;
                }
                else {
                    this.inputDirective.valid = IgxInputState.INITIAL;
                }
            }
        }
    }
    updateDisabledState() {
        if (this.hasProjectedInputs) {
            const start = this.projectedInputs.find(i => i instanceof IgxDateRangeStartComponent);
            const end = this.projectedInputs.find(i => i instanceof IgxDateRangeEndComponent);
            start.inputDirective.disabled = this.disabled;
            end.inputDirective.disabled = this.disabled;
            return;
        }
    }
    getInputState(focused) {
        if (focused) {
            return this._ngControl.valid ? IgxInputState.VALID : IgxInputState.INVALID;
        }
        else {
            return this._ngControl.valid ? IgxInputState.INITIAL : IgxInputState.INVALID;
        }
    }
    setRequiredToInputs() {
        // workaround for igxInput setting required
        Promise.resolve().then(() => {
            const isRequired = this.required;
            if (this.inputGroup && this.inputGroup.isRequired !== isRequired) {
                this.inputGroup.isRequired = isRequired;
            }
            else if (this.hasProjectedInputs && this._ngControl) {
                this.projectedInputs.forEach(i => i.isRequired = isRequired);
            }
        });
    }
    parseMinValue(value) {
        let minValue = parseDate(value);
        if (!minValue && this.hasProjectedInputs) {
            const start = this.projectedInputs.filter(i => i instanceof IgxDateRangeStartComponent)[0];
            if (start) {
                minValue = parseDate(start.dateTimeEditor.minValue);
            }
        }
        return minValue;
    }
    parseMaxValue(value) {
        let maxValue = parseDate(value);
        if (!maxValue && this.projectedInputs) {
            const end = this.projectedInputs.filter(i => i instanceof IgxDateRangeEndComponent)[0];
            if (end) {
                maxValue = parseDate(end.dateTimeEditor.maxValue);
            }
        }
        return maxValue;
    }
    updateCalendar() {
        if (!this.calendar) {
            return;
        }
        this.calendar.disabledDates = [];
        const minValue = this.parseMinValue(this.minValue);
        if (minValue) {
            this.calendar.disabledDates.push({ type: DateRangeType.Before, dateRange: [minValue] });
        }
        const maxValue = this.parseMaxValue(this.maxValue);
        if (maxValue) {
            this.calendar.disabledDates.push({ type: DateRangeType.After, dateRange: [maxValue] });
        }
        const range = [];
        if (this.value?.start && this.value?.end) {
            const _value = this.toRangeOfDates(this.value);
            if (DateTimeUtil.greaterThanMaxValue(_value.start, _value.end)) {
                this.swapEditorDates();
            }
            if (this.valueInRange(this.value, minValue, maxValue)) {
                range.push(_value.start, _value.end);
            }
        }
        if (range.length > 0) {
            this.calendar.selectDate(range);
        }
        else if (range.length === 0 && this.calendar.monthViews) {
            this.calendar.deselectDate();
        }
        this.calendar.viewDate = range[0] || new Date();
    }
    swapEditorDates() {
        if (this.hasProjectedInputs) {
            const start = this.projectedInputs.find(i => i instanceof IgxDateRangeStartComponent);
            const end = this.projectedInputs.find(i => i instanceof IgxDateRangeEndComponent);
            [start.dateTimeEditor.value, end.dateTimeEditor.value] = [end.dateTimeEditor.value, start.dateTimeEditor.value];
            [this.value.start, this.value.end] = [this.value.end, this.value.start];
        }
    }
    valueInRange(value, minValue, maxValue) {
        const _value = this.toRangeOfDates(value);
        if (minValue && DateTimeUtil.lessThanMinValue(_value.start, minValue, false)) {
            return false;
        }
        if (maxValue && DateTimeUtil.greaterThanMaxValue(_value.end, maxValue, false)) {
            return false;
        }
        return true;
    }
    extractRange(selection) {
        return {
            start: selection[0] || null,
            end: selection.length > 0 ? selection[selection.length - 1] : null
        };
    }
    toRangeOfDates(range) {
        let start;
        let end;
        if (!isDate(range.start)) {
            start = DateTimeUtil.parseIsoDate(range.start);
        }
        if (!isDate(range.end)) {
            end = DateTimeUtil.parseIsoDate(range.end);
        }
        if (start || end) {
            return { start, end };
        }
        return { start: range.start, end: range.end };
    }
    subscribeToDateEditorEvents() {
        if (this.hasProjectedInputs) {
            const start = this.projectedInputs.find(i => i instanceof IgxDateRangeStartComponent);
            const end = this.projectedInputs.find(i => i instanceof IgxDateRangeEndComponent);
            if (start && end) {
                start.dateTimeEditor.valueChange
                    .pipe(takeUntil(this._destroy$))
                    .subscribe(value => {
                    if (this.value) {
                        this.value = { start: value, end: this.value.end };
                    }
                    else {
                        this.value = { start: value, end: null };
                    }
                });
                end.dateTimeEditor.valueChange
                    .pipe(takeUntil(this._destroy$))
                    .subscribe(value => {
                    if (this.value) {
                        this.value = { start: this.value.start, end: value };
                    }
                    else {
                        this.value = { start: null, end: value };
                    }
                });
            }
        }
    }
    attachOnTouched() {
        if (this.hasProjectedInputs) {
            this.projectedInputs.forEach(i => {
                fromEvent(i.dateTimeEditor.nativeElement, 'blur')
                    .pipe(takeUntil(this._destroy$))
                    .subscribe(() => {
                    if (this.collapsed) {
                        this.updateValidityOnBlur();
                    }
                });
            });
        }
        else {
            fromEvent(this.inputDirective.nativeElement, 'blur')
                .pipe(takeUntil(this._destroy$))
                .subscribe(() => {
                if (this.collapsed) {
                    this.updateValidityOnBlur();
                }
            });
        }
    }
    cacheFocusedInput() {
        if (this.hasProjectedInputs) {
            this.projectedInputs.forEach(i => {
                fromEvent(i.dateTimeEditor.nativeElement, 'focus')
                    .pipe(takeUntil(this._destroy$))
                    .subscribe(() => this._focusedInput = i);
            });
        }
    }
    configPositionStrategy() {
        this._positionSettings = {
            openAnimation: fadeIn,
            closeAnimation: fadeOut
        };
        this._dropDownOverlaySettings.positionStrategy = new AutoPositionStrategy(this._positionSettings);
        this._dropDownOverlaySettings.target = this.element.nativeElement;
    }
    configOverlaySettings() {
        if (this.overlaySettings !== null) {
            this._dropDownOverlaySettings = Object.assign({}, this._dropDownOverlaySettings, this.overlaySettings);
            this._dialogOverlaySettings = Object.assign({}, this._dialogOverlaySettings, this.overlaySettings);
        }
    }
    initialSetValue() {
        // if there is no value and no ngControl on the picker but we have inputs we may have value set through
        // their ngModels - we should generate our initial control value
        if ((!this.value || (!this.value.start && !this.value.end)) && this.hasProjectedInputs && !this._ngControl) {
            const start = this.projectedInputs.find(i => i instanceof IgxDateRangeStartComponent);
            const end = this.projectedInputs.find(i => i instanceof IgxDateRangeEndComponent);
            this._value = {
                start: start.dateTimeEditor.value,
                end: end.dateTimeEditor.value
            };
        }
    }
    updateInputs() {
        const start = this.projectedInputs?.find(i => i instanceof IgxDateRangeStartComponent);
        const end = this.projectedInputs?.find(i => i instanceof IgxDateRangeEndComponent);
        if (start && end) {
            const _value = this.value ? this.toRangeOfDates(this.value) : null;
            start.updateInputValue(_value?.start || null);
            end.updateInputValue(_value?.end || null);
        }
    }
    updateDisplayFormat() {
        this.projectedInputs.forEach(i => {
            const input = i;
            input.dateTimeEditor.displayFormat = this.displayFormat;
        });
    }
    updateInputFormat() {
        this.projectedInputs.forEach(i => {
            const input = i;
            if (input.dateTimeEditor.inputFormat !== this.inputFormat) {
                input.dateTimeEditor.inputFormat = this.inputFormat;
            }
        });
    }
    _initializeCalendarContainer(componentInstance) {
        this._calendar = componentInstance.calendar;
        this.calendar.hasHeader = false;
        this.calendar.locale = this.locale;
        this.calendar.selection = CalendarSelection.RANGE;
        this.calendar.weekStart = this.weekStart;
        this.calendar.hideOutsideDays = this.hideOutsideDays;
        this.calendar.monthsViewNumber = this.displayMonthsCount;
        this.calendar.selected.pipe(takeUntil(this._destroy$)).subscribe((ev) => this.handleSelection(ev));
        componentInstance.mode = this.mode;
        componentInstance.closeButtonLabel = !this.isDropdown ? this.doneButtonText : null;
        componentInstance.pickerActions = this.pickerActions;
        componentInstance.calendarClose.pipe(takeUntil(this._destroy$)).subscribe(() => this.close());
    }
}
IgxDateRangePickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateRangePickerComponent, deps: [{ token: i0.ElementRef }, { token: LOCALE_ID }, { token: i1.PlatformUtil }, { token: i0.Injector }, { token: i0.NgModuleRef }, { token: i0.ChangeDetectorRef }, { token: IgxOverlayService }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxDateRangePickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxDateRangePickerComponent, selector: "igx-date-range-picker", inputs: { displayMonthsCount: "displayMonthsCount", hideOutsideDays: "hideOutsideDays", weekStart: "weekStart", locale: "locale", formatter: "formatter", doneButtonText: "doneButtonText", overlaySettings: "overlaySettings", displayFormat: "displayFormat", inputFormat: "inputFormat", minValue: "minValue", maxValue: "maxValue", resourceStrings: "resourceStrings", placeholder: "placeholder", outlet: "outlet", value: "value" }, outputs: { valueChange: "valueChange" }, host: { listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.igx-date-range-picker": "this.cssClass" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDateRangePickerComponent, multi: true },
        { provide: NG_VALIDATORS, useExisting: IgxDateRangePickerComponent, multi: true }
    ], queries: [{ propertyName: "label", first: true, predicate: IgxLabelDirective, descendants: true }, { propertyName: "pickerActions", first: true, predicate: IgxPickerActionsDirective, descendants: true }, { propertyName: "dateSeparatorTemplate", first: true, predicate: IgxDateRangeSeparatorDirective, descendants: true, read: TemplateRef }, { propertyName: "projectedInputs", predicate: IgxDateRangeInputsBaseComponent }], viewQueries: [{ propertyName: "inputGroup", first: true, predicate: IgxInputGroupComponent, descendants: true }, { propertyName: "inputDirective", first: true, predicate: IgxInputDirective, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<ng-container *ngTemplateOutlet=\"this.hasProjectedInputs ? startEndTemplate : defTemplate\"></ng-container>\n\n<ng-template #singleTemplate>\n    <div (click)=\"this.open()\" class=\"content-wrap\">\n        <ng-content select=\"igx-date-single\"></ng-content>\n    </div>\n</ng-template>\n\n<ng-template #startEndTemplate>\n    <ng-content select=\"igx-date-range-start\"></ng-content>\n    <div [className]=\"separatorClass\">\n        <ng-container *ngTemplateOutlet=\"dateSeparatorTemplate || defDateSeparatorTemplate;\">\n        </ng-container>\n    </div>\n    <ng-content select=\"igx-date-range-end\"></ng-content>\n</ng-template>\n\n<ng-template #defIcon>\n    <igx-icon>\n        date_range\n    </igx-icon>\n</ng-template>\n\n<ng-template #defDateSeparatorTemplate>{{ dateSeparator }}</ng-template>\n\n<ng-template #defTemplate>\n    <igx-input-group [type]=\"this.type\" [displayDensity]=\"this.displayDensity\" (click)=\"this.open()\">\n        <!-- only set mask placeholder when empty, otherwise input group might use it as label if none is set -->\n        <input #singleInput igxInput type=\"text\" readonly [disabled]=\"this.disabled\" [placeholder]=\"this.value ? '' : singleInputFormat\"\n            role=\"combobox\" aria-haspopup=\"grid\" [attr.aria-expanded]=\"!this.collapsed\" [attr.aria-labelledby]=\"this.label?.id\"\n            [value]=\"this.value | dateRange: this.appliedFormat : this.locale : this.formatter\" />\n\n        <igx-prefix *ngIf=\"!this.toggleComponents.length\">\n            <ng-container *ngTemplateOutlet=\"defIcon\"></ng-container>\n        </igx-prefix>\n\n        <ng-container ngProjectAs=\"[igxLabel]\">\n            <ng-content select=\"[igxLabel]\"></ng-content>\n        </ng-container>\n        <ng-container ngProjectAs=\"igx-prefix\">\n            <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n        </ng-container>\n        <ng-container ngProjectAs=\"igx-suffix\">\n            <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n        </ng-container>\n        <ng-container ngProjectAs=\"igx-hint\">\n            <ng-content select=\"igx-hint,[igxHint]\"></ng-content>\n        </ng-container>\n    </igx-input-group>\n</ng-template>\n", components: [{ type: i2.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i3.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }], directives: [{ type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i5.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.IgxPrefixDirective, selector: "igx-prefix,[igxPrefix]" }], pipes: { "dateRange": i7.DateRangePickerFormatPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDateRangePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-date-range-picker', providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDateRangePickerComponent, multi: true },
                        { provide: NG_VALIDATORS, useExisting: IgxDateRangePickerComponent, multi: true }
                    ], template: "<ng-container *ngTemplateOutlet=\"this.hasProjectedInputs ? startEndTemplate : defTemplate\"></ng-container>\n\n<ng-template #singleTemplate>\n    <div (click)=\"this.open()\" class=\"content-wrap\">\n        <ng-content select=\"igx-date-single\"></ng-content>\n    </div>\n</ng-template>\n\n<ng-template #startEndTemplate>\n    <ng-content select=\"igx-date-range-start\"></ng-content>\n    <div [className]=\"separatorClass\">\n        <ng-container *ngTemplateOutlet=\"dateSeparatorTemplate || defDateSeparatorTemplate;\">\n        </ng-container>\n    </div>\n    <ng-content select=\"igx-date-range-end\"></ng-content>\n</ng-template>\n\n<ng-template #defIcon>\n    <igx-icon>\n        date_range\n    </igx-icon>\n</ng-template>\n\n<ng-template #defDateSeparatorTemplate>{{ dateSeparator }}</ng-template>\n\n<ng-template #defTemplate>\n    <igx-input-group [type]=\"this.type\" [displayDensity]=\"this.displayDensity\" (click)=\"this.open()\">\n        <!-- only set mask placeholder when empty, otherwise input group might use it as label if none is set -->\n        <input #singleInput igxInput type=\"text\" readonly [disabled]=\"this.disabled\" [placeholder]=\"this.value ? '' : singleInputFormat\"\n            role=\"combobox\" aria-haspopup=\"grid\" [attr.aria-expanded]=\"!this.collapsed\" [attr.aria-labelledby]=\"this.label?.id\"\n            [value]=\"this.value | dateRange: this.appliedFormat : this.locale : this.formatter\" />\n\n        <igx-prefix *ngIf=\"!this.toggleComponents.length\">\n            <ng-container *ngTemplateOutlet=\"defIcon\"></ng-container>\n        </igx-prefix>\n\n        <ng-container ngProjectAs=\"[igxLabel]\">\n            <ng-content select=\"[igxLabel]\"></ng-content>\n        </ng-container>\n        <ng-container ngProjectAs=\"igx-prefix\">\n            <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n        </ng-container>\n        <ng-container ngProjectAs=\"igx-suffix\">\n            <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n        </ng-container>\n        <ng-container ngProjectAs=\"igx-hint\">\n            <ng-content select=\"igx-hint,[igxHint]\"></ng-content>\n        </ng-container>\n    </igx-input-group>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i1.PlatformUtil }, { type: i0.Injector }, { type: i0.NgModuleRef }, { type: i0.ChangeDetectorRef }, { type: i8.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
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
                }] }]; }, propDecorators: { displayMonthsCount: [{
                type: Input
            }], hideOutsideDays: [{
                type: Input
            }], weekStart: [{
                type: Input
            }], locale: [{
                type: Input
            }], formatter: [{
                type: Input
            }], doneButtonText: [{
                type: Input
            }], overlaySettings: [{
                type: Input
            }], displayFormat: [{
                type: Input
            }], inputFormat: [{
                type: Input
            }], minValue: [{
                type: Input
            }], maxValue: [{
                type: Input
            }], resourceStrings: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], outlet: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-date-range-picker']
            }], inputGroup: [{
                type: ViewChild,
                args: [IgxInputGroupComponent]
            }], inputDirective: [{
                type: ViewChild,
                args: [IgxInputDirective]
            }], projectedInputs: [{
                type: ContentChildren,
                args: [IgxDateRangeInputsBaseComponent]
            }], label: [{
                type: ContentChild,
                args: [IgxLabelDirective]
            }], pickerActions: [{
                type: ContentChild,
                args: [IgxPickerActionsDirective]
            }], dateSeparatorTemplate: [{
                type: ContentChild,
                args: [IgxDateRangeSeparatorDirective, { read: TemplateRef }]
            }], value: [{
                type: Input
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RhdGUtcmFuZ2UtcGlja2VyL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kYXRlLXJhbmdlLXBpY2tlci9kYXRlLXJhbmdlLXBpY2tlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQytCLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUMxRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQVksS0FBSyxFQUFFLFNBQVMsRUFFN0MsUUFBUSxFQUFFLE1BQU0sRUFDL0IsV0FBVyxFQUFFLFNBQVMsRUFDeEMsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNvQyxTQUFTLEVBQ2hELGFBQWEsRUFBRSxpQkFBaUIsRUFDbkMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsSUFBSSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN0RixPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxtQkFBbUIsRUFBMEIsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVo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QTZCO2dCQUtuQyxVQUFVO3NCQURoQixTQUFTO3VCQUFDLHNCQUFzQjtnQkFLMUIsY0FBYztzQkFEcEIsU0FBUzt1QkFBQyxpQkFBaUI7Z0JBS3JCLGVBQWU7c0JBRHJCLGVBQWU7dUJBQUMsK0JBQStCO2dCQUl6QyxLQUFLO3NCQURYLFlBQVk7dUJBQUMsaUJBQWlCO2dCQUl4QixhQUFhO3NCQURuQixZQUFZO3VCQUFDLHlCQUF5QjtnQkFLaEMscUJBQXFCO3NCQUQzQixZQUFZO3VCQUFDLDhCQUE4QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkF1RHhELEtBQUs7c0JBRGYsS0FBSztnQkFrRkMsU0FBUztzQkFGZixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBJbmplY3QsIEluamVjdG9yLCBJbnB1dCwgTE9DQUxFX0lELFxuICAgIE5nTW9kdWxlUmVmLFxuICAgIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBPdXRwdXQsIFF1ZXJ5TGlzdCxcbiAgICBTaW1wbGVDaGFuZ2VzLCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBBYnN0cmFjdENvbnRyb2wsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOZ0NvbnRyb2wsXG4gICAgTkdfVkFMSURBVE9SUywgTkdfVkFMVUVfQUNDRVNTT1IsIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIG1lcmdlLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIG5vb3AsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBmYWRlSW4sIGZhZGVPdXQgfSBmcm9tICcuLi9hbmltYXRpb25zL2ZhZGUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJTZWxlY3Rpb24sIElneENhbGVuZGFyQ29tcG9uZW50LCBXRUVLREFZUyB9IGZyb20gJy4uL2NhbGVuZGFyL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgRGF0ZVJhbmdlVHlwZSB9IGZyb20gJy4uL2NvcmUvZGF0ZXMnO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5pbXBvcnQgeyBDdXJyZW50UmVzb3VyY2VTdHJpbmdzIH0gZnJvbSAnLi4vY29yZS9pMThuL3Jlc291cmNlcyc7XG5pbXBvcnQgeyBJRGF0ZVJhbmdlUGlja2VyUmVzb3VyY2VTdHJpbmdzIH0gZnJvbSAnLi4vY29yZS9pMThuL2RhdGUtcmFuZ2UtcGlja2VyLXJlc291cmNlcyc7XG5pbXBvcnQgeyBEYXRlVGltZVV0aWwgfSBmcm9tICcuLi9kYXRlLWNvbW1vbi91dGlsL2RhdGUtdGltZS51dGlsJztcbmltcG9ydCB7IElCYXNlQ2FuY2VsYWJsZUJyb3dzZXJFdmVudEFyZ3MsIGlzRGF0ZSwgcGFyc2VEYXRlLCBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneENhbGVuZGFyQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vZGF0ZS1jb21tb24vY2FsZW5kYXItY29udGFpbmVyL2NhbGVuZGFyLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4UGlja2VyQWN0aW9uc0RpcmVjdGl2ZSB9IGZyb20gJy4uL2RhdGUtY29tbW9uL3BpY2tlci1pY29ucy5jb21tb24nO1xuaW1wb3J0IHsgUGlja2VyQmFzZURpcmVjdGl2ZSB9IGZyb20gJy4uL2RhdGUtY29tbW9uL3BpY2tlci1iYXNlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90b2dnbGUvdG9nZ2xlLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1xuICAgIElneElucHV0RGlyZWN0aXZlLCBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50LCBJZ3hJbnB1dEdyb3VwVHlwZSwgSWd4SW5wdXRTdGF0ZSxcbiAgICBJZ3hMYWJlbERpcmVjdGl2ZSwgSUdYX0lOUFVUX0dST1VQX1RZUEVcbn0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQge1xuICAgIEF1dG9Qb3NpdGlvblN0cmF0ZWd5LCBJZ3hPdmVybGF5U2VydmljZSwgT3ZlcmxheUNhbmNlbGFibGVFdmVudEFyZ3MsIE92ZXJsYXlFdmVudEFyZ3MsXG4gICAgT3ZlcmxheVNldHRpbmdzLCBQb3NpdGlvblNldHRpbmdzXG59IGZyb20gJy4uL3NlcnZpY2VzL3B1YmxpY19hcGknO1xuaW1wb3J0IHtcbiAgICBEYXRlUmFuZ2UsIElneERhdGVSYW5nZUVuZENvbXBvbmVudCwgSWd4RGF0ZVJhbmdlSW5wdXRzQmFzZUNvbXBvbmVudCxcbiAgICBJZ3hEYXRlUmFuZ2VTZXBhcmF0b3JEaXJlY3RpdmUsIElneERhdGVSYW5nZVN0YXJ0Q29tcG9uZW50XG59IGZyb20gJy4vZGF0ZS1yYW5nZS1waWNrZXItaW5wdXRzLmNvbW1vbic7XG5cbmNvbnN0IFNpbmdsZUlucHV0RGF0ZXNDb25jYXRlbmF0aW9uU3RyaW5nID0gJyAtICc7XG5cbi8qKlxuICogUHJvdmlkZXMgdGhlIGFiaWxpdHkgdG8gc2VsZWN0IGEgcmFuZ2Ugb2YgZGF0ZXMgZnJvbSBhIGNhbGVuZGFyIFVJIG9yIGVkaXRhYmxlIGlucHV0cy5cbiAqXG4gKiBAaWd4TW9kdWxlIElneERhdGVSYW5nZU1vZHVsZVxuICpcbiAqIEBpZ3hUaGVtZSBpZ3gtaW5wdXQtZ3JvdXAtdGhlbWUsIGlneC1jYWxlbmRhci10aGVtZSwgaWd4LWRhdGUtcmFuZ2UtcGlja2VyLXRoZW1lXG4gKlxuICogQGlneEtleXdvcmRzIGRhdGUsIHJhbmdlLCBkYXRlIHJhbmdlLCBkYXRlIHBpY2tlclxuICpcbiAqIEBpZ3hHcm91cCBzY2hlZHVsaW5nXG4gKlxuICogQHJlbWFya3NcbiAqIEl0IGRpc3BsYXlzIHRoZSByYW5nZSBzZWxlY3Rpb24gaW4gYSBzaW5nbGUgb3IgdHdvIGlucHV0IGZpZWxkcy5cbiAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGRpc3BsYXlzIGEgc2luZ2xlICpyZWFkb25seSogaW5wdXQgZmllbGRcbiAqIHdoaWxlIHByb2plY3RpbmcgYGlneC1kYXRlLXJhbmdlLXN0YXJ0YCBhbmQgYGlneC1kYXRlLXJhbmdlLWVuZGBcbiAqIGRpc3BsYXlzIHR3byAqZWRpdGFibGUqIGlucHV0IGZpZWxkcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgaHRtbFxuICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciBtb2RlPVwiZHJvcGRvd25cIj48L2lneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lneC1kYXRlLXJhbmdlLXBpY2tlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IElneERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCwgbXVsdGk6IHRydWUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogSWd4RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50LCBtdWx0aTogdHJ1ZSB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQgZXh0ZW5kcyBQaWNrZXJCYXNlRGlyZWN0aXZlXG4gICAgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIGRpc3BsYXllZCBtb250aCB2aWV3cy5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRGVmYXVsdCBpcyBgMmAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcmFuZ2UtcGlja2VyIFtkaXNwbGF5TW9udGhzQ291bnRdPVwiM1wiPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc3BsYXlNb250aHNDb3VudCA9IDI7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgd2hldGhlciBkYXRlcyB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGUgY3VycmVudCBtb250aCB3aWxsIGJlIGRpc3BsYXllZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciBbaGlkZU91dHNpZGVEYXlzXT1cInRydWVcIj48L2lneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoaWRlT3V0c2lkZURheXM6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3RhcnQgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBDYW4gYmUgYXNzaWduZWQgdG8gYSBudW1lcmljIHZhbHVlIG9yIHRvIGBXRUVLREFZU2AgZW51bSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1yYW5nZS1waWNrZXIgW3dlZWtTdGFydF09XCIxXCI+PC9pZ3gtZGF0ZS1yYW5nZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgd2Vla1N0YXJ0ID0gV0VFS0RBWVMuU1VOREFZO1xuXG4gICAgLyoqXG4gICAgICogTG9jYWxlIHNldHRpbmdzIHVzZWQgZm9yIHZhbHVlIGZvcm1hdHRpbmcgYW5kIGNhbGVuZGFyLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBVc2VzIEFuZ3VsYXIncyBgTE9DQUxFX0lEYCBieSBkZWZhdWx0LiBBZmZlY3RzIGJvdGggaW5wdXQgbWFzayBhbmQgZGlzcGxheSBmb3JtYXQgaWYgdGhvc2UgYXJlIG5vdCBzZXQuXG4gICAgICogSWYgYSBgbG9jYWxlYCBpcyBzZXQsIGl0IG11c3QgYmUgcmVnaXN0ZXJlZCB2aWEgYHJlZ2lzdGVyTG9jYWxlRGF0YWAuXG4gICAgICogUGxlYXNlIHJlZmVyIHRvIGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS9pMThuI2kxOG4tcGlwZXMuXG4gICAgICogSWYgaXQgaXMgbm90IHJlZ2lzdGVyZWQsIGBJbnRsYCB3aWxsIGJlIHVzZWQgZm9yIGZvcm1hdHRpbmcuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcmFuZ2UtcGlja2VyIGxvY2FsZT1cImpwXCI+PC9pZ3gtZGF0ZS1yYW5nZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbG9jYWxlOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIGN1c3RvbSBmb3JtYXR0ZXIgZnVuY3Rpb24sIGFwcGxpZWQgb24gdGhlIHNlbGVjdGVkIG9yIHBhc3NlZCBpbiBkYXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHJpdmF0ZSBkYXlGb3JtYXR0ZXIgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChcImVuXCIsIHsgd2Vla2RheTogXCJsb25nXCIgfSk7XG4gICAgICogcHJpdmF0ZSBtb250aEZvcm1hdHRlciA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFwiZW5cIiwgeyBtb250aDogXCJsb25nXCIgfSk7XG4gICAgICpcbiAgICAgKiBwdWJsaWMgZm9ybWF0dGVyKGRhdGU6IERhdGUpOiBzdHJpbmcge1xuICAgICAqICByZXR1cm4gYCR7dGhpcy5kYXlGb3JtYXR0ZXIuZm9ybWF0KGRhdGUpfSAtICR7dGhpcy5tb250aEZvcm1hdHRlci5mb3JtYXQoZGF0ZSl9IC0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9YDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1yYW5nZS1waWNrZXIgW2Zvcm1hdHRlcl09XCJmb3JtYXR0ZXJcIj48L2lneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmb3JtYXR0ZXI6ICh2YWw6IERhdGVSYW5nZSkgPT4gc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgdGV4dCBvZiB0aGUgY2FsZW5kYXIgZGlhbG9nIGBkb25lYCBidXR0b24uXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgYERvbmVgLlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHJlbmRlcnMgRG9uZSBidXR0b24gd2l0aCBjdXN0b20gdGV4dC4gQnkgZGVmYXVsdCBgZG9uZUJ1dHRvblRleHRgIGlzIHNldCB0byBEb25lLlxuICAgICAqIFRoZSBidXR0b24gd2lsbCBvbmx5IHNob3cgdXAgaW4gYGRpYWxvZ2AgbW9kZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1yYW5nZS1waWNrZXIgZG9uZUJ1dHRvblRleHQ9XCLlrozkuoZcIj48L2lneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZG9uZUJ1dHRvblRleHQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9kb25lQnV0dG9uVGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZG9uZUJ1dHRvblRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuX2RvbmVCdXR0b25UZXh0ID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2RhdGVfcmFuZ2VfcGlja2VyX2RvbmVfYnV0dG9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kb25lQnV0dG9uVGV4dDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3VzdG9tIG92ZXJsYXkgc2V0dGluZ3MgdGhhdCBzaG91bGQgYmUgdXNlZCB0byBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1yYW5nZS1waWNrZXIgW292ZXJsYXlTZXR0aW5nc109XCJjdXN0b21PdmVybGF5U2V0dGluZ3NcIj48L2lneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBvdmVybGF5U2V0dGluZ3M6IE92ZXJsYXlTZXR0aW5ncztcblxuICAgIC8qKlxuICAgICAqIFRoZSBmb3JtYXQgdXNlZCB3aGVuIGVkaXRhYmxlIGlucHV0cyBhcmUgbm90IGZvY3VzZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFVzZXMgQW5ndWxhcidzIERhdGVQaXBlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciBkaXNwbGF5Rm9ybWF0PVwiRUUvTS95eVwiPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzcGxheUZvcm1hdDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGV4cGVjdGVkIHVzZXIgaW5wdXQgZm9ybWF0IGFuZCBwbGFjZWhvbGRlci5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRGVmYXVsdCBpcyBgXCInTU0vZGQveXl5eSdcImBcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1yYW5nZS1waWNrZXIgaW5wdXRGb3JtYXQ9XCJkZC9NTS95eVwiPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlucHV0Rm9ybWF0OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWluaW11bSB2YWx1ZSBpbiBhIHZhbGlkIHJhbmdlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8aWd4LWRhdGUtcmFuZ2UtcGlja2VyIFttaW5WYWx1ZV09XCJtaW5EYXRlXCI+PC9pZ3gtZGF0ZS1yYW5nZS1waWNrZXI+XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IG1pblZhbHVlKHZhbHVlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX21pblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25WYWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG1pblZhbHVlKCk6IERhdGUgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWluVmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG1heGltdW0gdmFsdWUgaW4gYSB2YWxpZCByYW5nZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciBbbWF4VmFsdWVdPVwibWF4RGF0ZVwiPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBtYXhWYWx1ZSh2YWx1ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl9tYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBtYXhWYWx1ZSgpOiBEYXRlIHwgc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGFjY2Vzc29yIHRoYXQgc2V0cyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKiBCeSBkZWZhdWx0IGl0IHVzZXMgRU4gcmVzb3VyY2VzLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCByZXNvdXJjZVN0cmluZ3ModmFsdWU6IElEYXRlUmFuZ2VQaWNrZXJSZXNvdXJjZVN0cmluZ3MpIHtcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VTdHJpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcmVzb3VyY2VTdHJpbmdzLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWNjZXNzb3IgdGhhdCByZXR1cm5zIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmVzb3VyY2VTdHJpbmdzKCk6IElEYXRlUmFuZ2VQaWNrZXJSZXNvdXJjZVN0cmluZ3Mge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VTdHJpbmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGBwbGFjZWhvbGRlcmAgZm9yIHNpbmdsZS1pbnB1dCBgSWd4RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqICAgQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciBbcGxhY2Vob2xkZXJdPVwiJ0Nob29zZSB5b3VyIGRhdGVzJ1wiPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBsYWNlaG9sZGVyID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGNvbnRhaW5lciB1c2VkIGZvciB0aGUgcG9wdXAgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogIGBvdXRsZXRgIGlzIGFuIGluc3RhbmNlIG9mIGBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlYCBvciBhbiBgRWxlbWVudFJlZmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBpZ3hPdmVybGF5T3V0bGV0ICNvdXRsZXQ9XCJvdmVybGF5LW91dGxldFwiPjwvZGl2PlxuICAgICAqIC8vLi5cbiAgICAgKiA8aWd4LWRhdGUtcmFuZ2UtcGlja2VyIFtvdXRsZXRdPVwib3V0bGV0XCI+PC9pZ3gtZGF0ZS1yYW5nZS1waWNrZXI+XG4gICAgICogLy8uLlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG91dGxldDogSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZSB8IEVsZW1lbnRSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgcGlja2VyJ3MgdmFsdWUgY2hhbmdlcy4gVXNlZCBmb3IgdHdvLXdheSBiaW5kaW5nLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciBbKHZhbHVlKV09XCJkYXRlXCI+PC9pZ3gtZGF0ZS1yYW5nZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEYXRlUmFuZ2U+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1kYXRlLXJhbmdlLXBpY2tlcicpXG4gICAgcHVibGljIGNzc0NsYXNzID0gJ2lneC1kYXRlLXJhbmdlLXBpY2tlcic7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAVmlld0NoaWxkKElneElucHV0R3JvdXBDb21wb25lbnQpXG4gICAgcHVibGljIGlucHV0R3JvdXA6IElneElucHV0R3JvdXBDb21wb25lbnQ7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAVmlld0NoaWxkKElneElucHV0RGlyZWN0aXZlKVxuICAgIHB1YmxpYyBpbnB1dERpcmVjdGl2ZTogSWd4SW5wdXREaXJlY3RpdmU7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneERhdGVSYW5nZUlucHV0c0Jhc2VDb21wb25lbnQpXG4gICAgcHVibGljIHByb2plY3RlZElucHV0czogUXVlcnlMaXN0PElneERhdGVSYW5nZUlucHV0c0Jhc2VDb21wb25lbnQ+O1xuXG4gICAgQENvbnRlbnRDaGlsZChJZ3hMYWJlbERpcmVjdGl2ZSlcbiAgICBwdWJsaWMgbGFiZWw6IElneExhYmVsRGlyZWN0aXZlO1xuXG4gICAgQENvbnRlbnRDaGlsZChJZ3hQaWNrZXJBY3Rpb25zRGlyZWN0aXZlKVxuICAgIHB1YmxpYyBwaWNrZXJBY3Rpb25zOiBJZ3hQaWNrZXJBY3Rpb25zRGlyZWN0aXZlO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hEYXRlUmFuZ2VTZXBhcmF0b3JEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgICBwdWJsaWMgZGF0ZVNlcGFyYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBkYXRlU2VwYXJhdG9yKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLl9kYXRlU2VwYXJhdG9yID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVN0cmluZ3MuaWd4X2RhdGVfcmFuZ2VfcGlja2VyX2RhdGVfc2VwYXJhdG9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRlU2VwYXJhdG9yO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgYXBwbGllZEZvcm1hdCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gRGF0ZVRpbWVVdGlsLmdldExvY2FsZURhdGVGb3JtYXQodGhpcy5sb2NhbGUsIHRoaXMuZGlzcGxheUZvcm1hdClcbiAgICAgICAgICAgIHx8IERhdGVUaW1lVXRpbC5ERUZBVUxUX0lOUFVUX0ZPUk1BVDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHNpbmdsZUlucHV0Rm9ybWF0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyICE9PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb3JtYXQgPSB0aGlzLmFwcGxpZWRGb3JtYXQ7XG4gICAgICAgIHJldHVybiBgJHtmb3JtYXR9JHtTaW5nbGVJbnB1dERhdGVzQ29uY2F0ZW5hdGlvblN0cmluZ30ke2Zvcm1hdH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgY2FsZW5kYXIgc3RhdGUuXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IHN0YXRlID0gdGhpcy5kYXRlUmFuZ2UuY29sbGFwc2VkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgY29sbGFwc2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGFwc2VkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdmFsdWUgLyByYW5nZSBmcm9tIHRoZSBjYWxlbmRhclxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGUgY3VycmVudCB2YWx1ZSBpcyBvZiB0eXBlIGBEYXRlUmFuZ2VgXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBuZXdWYWx1ZTogRGF0ZVJhbmdlID0geyBzdGFydDogbmV3IERhdGUoXCIyLzIvMjAxMlwiKSwgZW5kOiBuZXcgRGF0ZShcIjMvMy8yMDEzXCIpfTtcbiAgICAgKiB0aGlzLmRhdGVSYW5nZVBpY2tlci52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogRGF0ZVJhbmdlIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IERhdGVSYW5nZSB8IG51bGwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh2YWx1ZSk7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBoYXNQcm9qZWN0ZWRJbnB1dHMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3RlZElucHV0cz8ubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHNlcGFyYXRvckNsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudERlbnNpdHlDbGFzcygnaWd4LWRhdGUtcmFuZ2UtcGlja2VyX19sYWJlbCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fbmdDb250cm9sICYmIHRoaXMuX25nQ29udHJvbC5jb250cm9sICYmIHRoaXMuX25nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvcikge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSB0aGlzLl9uZ0NvbnRyb2wuY29udHJvbC52YWxpZGF0b3Ioe30gYXMgQWJzdHJhY3RDb250cm9sKTtcbiAgICAgICAgICAgIHJldHVybiAoZXJyb3IgJiYgZXJyb3IucmVxdWlyZWQpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGNhbGVuZGFyKCk6IElneENhbGVuZGFyQ29tcG9uZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbGVuZGFyO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRyb3Bkb3duT3ZlcmxheVNldHRpbmdzKCk6IE92ZXJsYXlTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kcm9wRG93bk92ZXJsYXlTZXR0aW5ncywgdGhpcy5vdmVybGF5U2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRpYWxvZ092ZXJsYXlTZXR0aW5ncygpOiBPdmVybGF5U2V0dGluZ3Mge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGlhbG9nT3ZlcmxheVNldHRpbmdzLCB0aGlzLm92ZXJsYXlTZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVzb3VyY2VTdHJpbmdzID0gQ3VycmVudFJlc291cmNlU3RyaW5ncy5EYXRlUmFuZ2VQaWNrZXJSZXNTdHJpbmdzO1xuICAgIHByaXZhdGUgX2RvbmVCdXR0b25UZXh0ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kYXRlU2VwYXJhdG9yID0gbnVsbDtcbiAgICBwcml2YXRlIF92YWx1ZTogRGF0ZVJhbmdlIHwgbnVsbDtcbiAgICBwcml2YXRlIF9vdmVybGF5SWQ6IHN0cmluZztcbiAgICBwcml2YXRlIF9uZ0NvbnRyb2w6IE5nQ29udHJvbDtcbiAgICBwcml2YXRlIF9zdGF0dXNDaGFuZ2VzJDogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgX2NhbGVuZGFyOiBJZ3hDYWxlbmRhckNvbXBvbmVudDtcbiAgICBwcml2YXRlIF9wb3NpdGlvblNldHRpbmdzOiBQb3NpdGlvblNldHRpbmdzO1xuICAgIHByaXZhdGUgX2ZvY3VzZWRJbnB1dDogSWd4RGF0ZVJhbmdlSW5wdXRzQmFzZUNvbXBvbmVudDtcbiAgICBwcml2YXRlIF9vdmVybGF5U3ViRmlsdGVyOlxuICAgICAgICBbTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPE92ZXJsYXlFdmVudEFyZ3M+LCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248T3ZlcmxheUV2ZW50QXJncyB8IE92ZXJsYXlDYW5jZWxhYmxlRXZlbnRBcmdzPl0gPSBbXG4gICAgICAgICAgICBmaWx0ZXIoeCA9PiB4LmlkID09PSB0aGlzLl9vdmVybGF5SWQpLFxuICAgICAgICAgICAgdGFrZVVudGlsKG1lcmdlKHRoaXMuX2Rlc3Ryb3kkLCB0aGlzLmNsb3NlZCkpXG4gICAgICAgIF07XG4gICAgcHJpdmF0ZSBfZGlhbG9nT3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3MgPSB7XG4gICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICBjbG9zZU9uRXNjYXBlOiB0cnVlXG4gICAgfTtcbiAgICBwcml2YXRlIF9kcm9wRG93bk92ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0ge1xuICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgIGNsb3NlT25Fc2NhcGU6IHRydWVcbiAgICB9O1xuICAgIHByaXZhdGUgb25DaGFuZ2VDYWxsYmFjazogKGRhdGVSYW5nZTogRGF0ZVJhbmdlKSA9PiB2b2lkID0gbm9vcDtcbiAgICBwcml2YXRlIG9uVG91Y2hDYWxsYmFjazogKCkgPT4gdm9pZCA9IG5vb3A7XG4gICAgcHJpdmF0ZSBvblZhbGlkYXRvckNoYW5nZTogKCkgPT4gdm9pZCA9IG5vb3A7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICAgICAgQEluamVjdChMT0NBTEVfSUQpIHByb3RlY3RlZCBfbG9jYWxlSWQ6IGFueSxcbiAgICAgICAgcHJvdGVjdGVkIHBsYXRmb3JtOiBQbGF0Zm9ybVV0aWwsXG4gICAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgcHJpdmF0ZSBfbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LFxuICAgICAgICBwcml2YXRlIF9jZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBASW5qZWN0KElneE92ZXJsYXlTZXJ2aWNlKSBwcml2YXRlIF9vdmVybGF5U2VydmljZTogSWd4T3ZlcmxheVNlcnZpY2UsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRGlzcGxheURlbnNpdHlUb2tlbikgcHJvdGVjdGVkIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnM/OiBJRGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KElHWF9JTlBVVF9HUk9VUF9UWVBFKSBwcm90ZWN0ZWQgX2lucHV0R3JvdXBUeXBlPzogSWd4SW5wdXRHcm91cFR5cGUpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgX2xvY2FsZUlkLCBfZGlzcGxheURlbnNpdHlPcHRpb25zLCBfaW5wdXRHcm91cFR5cGUpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQVJST1dfVVA6XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmFsdEtleSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnBsYXRmb3JtLktFWU1BUC5BUlJPV19ET1dOOlxuICAgICAgICAgICAgICAgIGlmIChldmVudC5hbHRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgdGhlIGRhdGUgcmFuZ2UgcGlja2VyJ3MgZHJvcGRvd24gb3IgZGlhbG9nLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciAjZGF0ZVJhbmdlPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqXG4gICAgICogPGJ1dHRvbiAoY2xpY2spPVwiZGF0ZVJhbmdlLm9wZW4oKVwiPk9wZW4gRGlhbG9nPC9idXR0b25cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgb3BlbihvdmVybGF5U2V0dGluZ3M/OiBPdmVybGF5U2V0dGluZ3MpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbGxhcHNlZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaXNEcm9wZG93blxuICAgICAgICAgICAgPyB0aGlzLmRyb3Bkb3duT3ZlcmxheVNldHRpbmdzXG4gICAgICAgICAgICA6IHRoaXMuZGlhbG9nT3ZlcmxheVNldHRpbmdzXG4gICAgICAgICAgICAsIG92ZXJsYXlTZXR0aW5ncyk7XG5cbiAgICAgICAgdGhpcy5fb3ZlcmxheUlkID0gdGhpcy5fb3ZlcmxheVNlcnZpY2VcbiAgICAgICAgICAgIC5hdHRhY2goSWd4Q2FsZW5kYXJDb250YWluZXJDb21wb25lbnQsIHNldHRpbmdzLCB0aGlzLl9tb2R1bGVSZWYpO1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvT3ZlcmxheUV2ZW50cygpO1xuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5zaG93KHRoaXMuX292ZXJsYXlJZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBkYXRlIHJhbmdlIHBpY2tlcidzIGRyb3Bkb3duIG9yIGRpYWxvZy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1yYW5nZS1waWNrZXIgI2RhdGVSYW5nZT48L2lneC1kYXRlLXJhbmdlLXBpY2tlcj5cbiAgICAgKlxuICAgICAqIDxidXR0b24gKGNsaWNrKT1cImRhdGVSYW5nZS5jbG9zZSgpXCI+Q2xvc2UgRGlhbG9nPC9idXR0b24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5oaWRlKHRoaXMuX292ZXJsYXlJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBkYXRlIHJhbmdlIHBpY2tlcidzIGRyb3Bkb3duIG9yIGRpYWxvZ1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXJhbmdlLXBpY2tlciAjZGF0ZVJhbmdlPjwvaWd4LWRhdGUtcmFuZ2UtcGlja2VyPlxuICAgICAqXG4gICAgICogPGJ1dHRvbiAoY2xpY2spPVwiZGF0ZVJhbmdlLnRvZ2dsZSgpXCI+VG9nZ2xlIERpYWxvZzwvYnV0dG9uPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGUob3ZlcmxheVNldHRpbmdzPzogT3ZlcmxheVNldHRpbmdzKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3BlbihvdmVybGF5U2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0cyBhIHJhbmdlIG9mIGRhdGVzLiBJZiBubyBgZW5kRGF0ZWAgaXMgcGFzc2VkLCByYW5nZSBpcyAxIGRheSAob25seSBgc3RhcnREYXRlYClcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBzZWxlY3RGaXZlRGF5UmFuZ2UoKSB7XG4gICAgICogIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgKiAgY29uc3QgaW5GaXZlRGF5cyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgKyA1KSk7XG4gICAgICogIHRoaXMuZGF0ZVJhbmdlLnNlbGVjdCh0b2RheSwgaW5GaXZlRGF5cyk7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3Qoc3RhcnREYXRlOiBEYXRlLCBlbmREYXRlPzogRGF0ZSk6IHZvaWQge1xuICAgICAgICBlbmREYXRlID0gZW5kRGF0ZSA/PyBzdGFydERhdGU7XG4gICAgICAgIGNvbnN0IGRhdGVSYW5nZSA9IFtzdGFydERhdGUsIGVuZERhdGVdO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdGlvbihkYXRlUmFuZ2UpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBEYXRlUmFuZ2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uVG91Y2hDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHZhbHVlOiBEYXRlUmFuZ2UgPSBjb250cm9sLnZhbHVlO1xuICAgICAgICBjb25zdCBlcnJvcnMgPSB7fTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQcm9qZWN0ZWRJbnB1dHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZmluZChpID0+IGkgaW5zdGFuY2VvZiBJZ3hEYXRlUmFuZ2VTdGFydENvbXBvbmVudCkgYXMgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kSW5wdXQgPSB0aGlzLnByb2plY3RlZElucHV0cy5maW5kKGkgPT4gaSBpbnN0YW5jZW9mIElneERhdGVSYW5nZUVuZENvbXBvbmVudCkgYXMgSWd4RGF0ZVJhbmdlRW5kQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgIGlmICghc3RhcnRJbnB1dC5kYXRlVGltZUVkaXRvci52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGVycm9ycywgeyBzdGFydFZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVuZElucHV0LmRhdGVUaW1lRWRpdG9yLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZXJyb3JzLCB7IGVuZFZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbWluID0gcGFyc2VEYXRlKHRoaXMubWluVmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgbWF4ID0gcGFyc2VEYXRlKHRoaXMubWF4VmFsdWUpO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBwYXJzZURhdGUodmFsdWUuc3RhcnQpO1xuICAgICAgICAgICAgY29uc3QgZW5kID0gcGFyc2VEYXRlKHZhbHVlLmVuZCk7XG4gICAgICAgICAgICBpZiAoKG1pbiAmJiBzdGFydCAmJiBEYXRlVGltZVV0aWwubGVzc1RoYW5NaW5WYWx1ZShzdGFydCwgbWluLCBmYWxzZSkpXG4gICAgICAgICAgICAgICAgfHwgKG1pbiAmJiBlbmQgJiYgRGF0ZVRpbWVVdGlsLmxlc3NUaGFuTWluVmFsdWUoZW5kLCBtaW4sIGZhbHNlKSkpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGVycm9ycywgeyBtaW5WYWx1ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgobWF4ICYmIHN0YXJ0ICYmIERhdGVUaW1lVXRpbC5ncmVhdGVyVGhhbk1heFZhbHVlKHN0YXJ0LCBtYXgsIGZhbHNlKSlcbiAgICAgICAgICAgICAgICB8fCAobWF4ICYmIGVuZCAmJiBEYXRlVGltZVV0aWwuZ3JlYXRlclRoYW5NYXhWYWx1ZShlbmQsIG1heCwgZmFsc2UpKSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZXJyb3JzLCB7IG1heFZhbHVlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID4gMCA/IGVycm9ycyA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U/KGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vblZhbGlkYXRvckNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlPyhpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9uZ0NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQ8TmdDb250cm9sPihOZ0NvbnRyb2wsIG51bGwpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG9EYXRlRWRpdG9yRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuY29uZmlnUG9zaXRpb25TdHJhdGVneSgpO1xuICAgICAgICB0aGlzLmNvbmZpZ092ZXJsYXlTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLmNhY2hlRm9jdXNlZElucHV0KCk7XG4gICAgICAgIHRoaXMuYXR0YWNoT25Ub3VjaGVkKCk7XG5cbiAgICAgICAgdGhpcy5zZXRSZXF1aXJlZFRvSW5wdXRzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX25nQ29udHJvbCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlcyQgPSB0aGlzLl9uZ0NvbnRyb2wuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUodGhpcy5vblN0YXR1c0NoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWxheSBpbnZvY2F0aW9ucyB1bnRpbCB0aGUgY3VycmVudCBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlIGhhcyBjb21wbGV0ZWRcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbFNldFZhbHVlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlucHV0cygpO1xuICAgICAgICAgICAgLy8gQi5QLiAwNyBKdWx5IDIwMjEgLSBJZ3hEYXRlUmFuZ2VQaWNrZXIgbm90IHNob3dpbmcgaW5pdGlhbCBkaXNhYmxlZCBzdGF0ZSB3aXRoIENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCAjOTc3NlxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBpZiBkaXNhYmxlZCBpcyBwbGFjZWQgb24gdGhlIHJhbmdlIHBpY2tlciBlbGVtZW50IGFuZCB0aGVyZSBhcmUgcHJvamVjdGVkIGlucHV0c1xuICAgICAgICAgICAgICogcnVuIGNoYW5nZSBkZXRlY3Rpb24gc2luY2UgaWd4SW5wdXQgd2lsbCBpbml0aWFsbHkgc2V0IHRoZSBwcm9qZWN0ZWQgaW5wdXRzJyBkaXNhYmxlZCB0byBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNQcm9qZWN0ZWRJbnB1dHMgJiYgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheUZvcm1hdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUlucHV0Rm9ybWF0KCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoYW5nZXNbJ2Rpc3BsYXlGb3JtYXQnXSAmJiB0aGlzLmhhc1Byb2plY3RlZElucHV0cykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5Rm9ybWF0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXNbJ2lucHV0Rm9ybWF0J10gJiYgdGhpcy5oYXNQcm9qZWN0ZWRJbnB1dHMpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5wdXRGb3JtYXQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0dXNDaGFuZ2VzJCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlcyQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fb3ZlcmxheUlkKSB7XG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5kZXRhY2godGhpcy5fb3ZlcmxheUlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXRFZGl0RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXREaXJlY3RpdmUubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25TdGF0dXNDaGFuZ2VkID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pbnB1dEdyb3VwKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0RGlyZWN0aXZlLnZhbGlkID0gdGhpcy5pc1RvdWNoZWRPckRpcnR5XG4gICAgICAgICAgICAgICAgPyB0aGlzLmdldElucHV0U3RhdGUodGhpcy5pbnB1dEdyb3VwLmlzRm9jdXNlZClcbiAgICAgICAgICAgICAgICA6IElneElucHV0U3RhdGUuSU5JVElBTDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1Byb2plY3RlZElucHV0cykge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ZWRJbnB1dHNcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaS5pbnB1dERpcmVjdGl2ZS52YWxpZCA9IHRoaXMuaXNUb3VjaGVkT3JEaXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmdldElucHV0U3RhdGUoaS5pc0ZvY3VzZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IElneElucHV0U3RhdGUuSU5JVElBTDs7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRSZXF1aXJlZFRvSW5wdXRzKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgZ2V0IGlzVG91Y2hlZE9yRGlydHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5fbmdDb250cm9sLmNvbnRyb2wudG91Y2hlZCB8fCB0aGlzLl9uZ0NvbnRyb2wuY29udHJvbC5kaXJ0eSlcbiAgICAgICAgICAgICYmICghIXRoaXMuX25nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvciB8fCAhIXRoaXMuX25nQ29udHJvbC5jb250cm9sLmFzeW5jVmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVNlbGVjdGlvbihzZWxlY3Rpb25EYXRhOiBEYXRlW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5leHRyYWN0UmFuZ2Uoc2VsZWN0aW9uRGF0YSk7XG4gICAgICAgIGlmICghbmV3VmFsdWUuc3RhcnQgJiYgIW5ld1ZhbHVlLmVuZCkge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuaXNEcm9wZG93biAmJiBzZWxlY3Rpb25EYXRhPy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUNsb3NpbmcoZTogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyk6IHZvaWQge1xuICAgICAgICBjb25zdCBhcmdzID0geyBvd25lcjogdGhpcywgY2FuY2VsOiBlPy5jYW5jZWwsIGV2ZW50OiBlPy5ldmVudCB9O1xuICAgICAgICB0aGlzLmNsb3NpbmcuZW1pdChhcmdzKTtcbiAgICAgICAgZS5jYW5jZWwgPSBhcmdzLmNhbmNlbDtcbiAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0Ryb3Bkb3duICYmIGU/LmV2ZW50ICYmICF0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhlLmV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgIC8vIG91dHNpZGUgY2xpY2tcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsaWRpdHlPbkJsdXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaENhbGxiYWNrKCk7XG4gICAgICAgICAgICAvLyBpbnB1dCBjbGlja1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUHJvamVjdGVkSW5wdXRzICYmIHRoaXMuX2ZvY3VzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvY3VzZWRJbnB1dC5zZXRGb2N1cygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvY3VzZWRJbnB1dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dERpcmVjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXREaXJlY3RpdmUuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9PdmVybGF5RXZlbnRzKCkge1xuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5vcGVuaW5nLnBpcGUoLi4udGhpcy5fb3ZlcmxheVN1YkZpbHRlcikuc3Vic2NyaWJlKChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvdmVybGF5RXZlbnQgPSBlIGFzIE92ZXJsYXlDYW5jZWxhYmxlRXZlbnRBcmdzO1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IHsgb3duZXI6IHRoaXMsIGNhbmNlbDogb3ZlcmxheUV2ZW50Py5jYW5jZWwsIGV2ZW50OiBlLmV2ZW50IH07XG4gICAgICAgICAgICB0aGlzLm9wZW5pbmcuZW1pdChhcmdzKTtcbiAgICAgICAgICAgIGlmIChhcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX292ZXJsYXlTZXJ2aWNlLmRldGFjaCh0aGlzLl9vdmVybGF5SWQpO1xuICAgICAgICAgICAgICAgIG92ZXJsYXlFdmVudC5jYW5jZWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZUNhbGVuZGFyQ29udGFpbmVyKGUuY29tcG9uZW50UmVmLmluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5vcGVuZWQucGlwZSguLi50aGlzLl9vdmVybGF5U3ViRmlsdGVyKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxlbmRhcj8uZGF5c1ZpZXc/LmZvY3VzQWN0aXZlRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5vcGVuZWQuZW1pdCh7IG93bmVyOiB0aGlzIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5jbG9zaW5nLnBpcGUoLi4udGhpcy5fb3ZlcmxheVN1YkZpbHRlcikuc3Vic2NyaWJlKChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsb3NpbmcoZSBhcyBPdmVybGF5Q2FuY2VsYWJsZUV2ZW50QXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX292ZXJsYXlTZXJ2aWNlLmNsb3NlZC5waXBlKC4uLnRoaXMuX292ZXJsYXlTdWJGaWx0ZXIpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5kZXRhY2godGhpcy5fb3ZlcmxheUlkKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5SWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCh7IG93bmVyOiB0aGlzIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVZhbHVlKHZhbHVlOiBEYXRlUmFuZ2UpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZSA/IHZhbHVlIDogbnVsbDtcbiAgICAgICAgdGhpcy51cGRhdGVJbnB1dHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVmFsaWRpdHlPbkJsdXIoKSB7XG4gICAgICAgIHRoaXMub25Ub3VjaENhbGxiYWNrKCk7XG4gICAgICAgIGlmICh0aGlzLl9uZ0NvbnRyb2wpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1Byb2plY3RlZElucHV0cykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdGVkSW5wdXRzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbmdDb250cm9sLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLnVwZGF0ZUlucHV0VmFsaWRpdHkoSWd4SW5wdXRTdGF0ZS5JTlZBTElEKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkudXBkYXRlSW5wdXRWYWxpZGl0eShJZ3hJbnB1dFN0YXRlLklOSVRJQUwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0RGlyZWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9uZ0NvbnRyb2wudmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dERpcmVjdGl2ZS52YWxpZCA9IElneElucHV0U3RhdGUuSU5WQUxJRDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0RGlyZWN0aXZlLnZhbGlkID0gSWd4SW5wdXRTdGF0ZS5JTklUSUFMO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGlzYWJsZWRTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzUHJvamVjdGVkSW5wdXRzKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMucHJvamVjdGVkSW5wdXRzLmZpbmQoaSA9PiBpIGluc3RhbmNlb2YgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQpIGFzIElneERhdGVSYW5nZVN0YXJ0Q29tcG9uZW50O1xuICAgICAgICAgICAgY29uc3QgZW5kID0gdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZmluZChpID0+IGkgaW5zdGFuY2VvZiBJZ3hEYXRlUmFuZ2VFbmRDb21wb25lbnQpIGFzIElneERhdGVSYW5nZUVuZENvbXBvbmVudDtcbiAgICAgICAgICAgIHN0YXJ0LmlucHV0RGlyZWN0aXZlLmRpc2FibGVkID0gdGhpcy5kaXNhYmxlZDtcbiAgICAgICAgICAgIGVuZC5pbnB1dERpcmVjdGl2ZS5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldElucHV0U3RhdGUoZm9jdXNlZDogYm9vbGVhbik6IElneElucHV0U3RhdGUge1xuICAgICAgICBpZiAoZm9jdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25nQ29udHJvbC52YWxpZCA/IElneElucHV0U3RhdGUuVkFMSUQgOiBJZ3hJbnB1dFN0YXRlLklOVkFMSUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmdDb250cm9sLnZhbGlkID8gSWd4SW5wdXRTdGF0ZS5JTklUSUFMIDogSWd4SW5wdXRTdGF0ZS5JTlZBTElEO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRSZXF1aXJlZFRvSW5wdXRzKCk6IHZvaWQge1xuICAgICAgICAvLyB3b3JrYXJvdW5kIGZvciBpZ3hJbnB1dCBzZXR0aW5nIHJlcXVpcmVkXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNSZXF1aXJlZCA9IHRoaXMucmVxdWlyZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dEdyb3VwICYmIHRoaXMuaW5wdXRHcm91cC5pc1JlcXVpcmVkICE9PSBpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEdyb3VwLmlzUmVxdWlyZWQgPSBpc1JlcXVpcmVkO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1Byb2plY3RlZElucHV0cyAmJiB0aGlzLl9uZ0NvbnRyb2wpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RlZElucHV0cy5mb3JFYWNoKGkgPT4gaS5pc1JlcXVpcmVkID0gaXNSZXF1aXJlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VNaW5WYWx1ZSh2YWx1ZTogc3RyaW5nIHwgRGF0ZSk6IERhdGUgfCBudWxsIHtcbiAgICAgICAgbGV0IG1pblZhbHVlOiBEYXRlID0gcGFyc2VEYXRlKHZhbHVlKTtcbiAgICAgICAgaWYgKCFtaW5WYWx1ZSAmJiB0aGlzLmhhc1Byb2plY3RlZElucHV0cykge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnByb2plY3RlZElucHV0cy5maWx0ZXIoaSA9PiBpIGluc3RhbmNlb2YgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQpWzBdO1xuICAgICAgICAgICAgaWYgKHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgbWluVmFsdWUgPSBwYXJzZURhdGUoc3RhcnQuZGF0ZVRpbWVFZGl0b3IubWluVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1pblZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGFyc2VNYXhWYWx1ZSh2YWx1ZTogc3RyaW5nIHwgRGF0ZSk6IERhdGUgfCBudWxsIHtcbiAgICAgICAgbGV0IG1heFZhbHVlOiBEYXRlID0gcGFyc2VEYXRlKHZhbHVlKTtcbiAgICAgICAgaWYgKCFtYXhWYWx1ZSAmJiB0aGlzLnByb2plY3RlZElucHV0cykge1xuICAgICAgICAgICAgY29uc3QgZW5kID0gdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZmlsdGVyKGkgPT4gaSBpbnN0YW5jZW9mIElneERhdGVSYW5nZUVuZENvbXBvbmVudClbMF07XG4gICAgICAgICAgICBpZiAoZW5kKSB7XG4gICAgICAgICAgICAgICAgbWF4VmFsdWUgPSBwYXJzZURhdGUoZW5kLmRhdGVUaW1lRWRpdG9yLm1heFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXhWYWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNhbGVuZGFyKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY2FsZW5kYXIpIHtcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxlbmRhci5kaXNhYmxlZERhdGVzID0gW107XG4gICAgICAgIGNvbnN0IG1pblZhbHVlID0gdGhpcy5wYXJzZU1pblZhbHVlKHRoaXMubWluVmFsdWUpO1xuICAgICAgICBpZiAobWluVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIuZGlzYWJsZWREYXRlcy5wdXNoKHsgdHlwZTogRGF0ZVJhbmdlVHlwZS5CZWZvcmUsIGRhdGVSYW5nZTogW21pblZhbHVlXSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXhWYWx1ZSA9IHRoaXMucGFyc2VNYXhWYWx1ZSh0aGlzLm1heFZhbHVlKTtcbiAgICAgICAgaWYgKG1heFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyLmRpc2FibGVkRGF0ZXMucHVzaCh7IHR5cGU6IERhdGVSYW5nZVR5cGUuQWZ0ZXIsIGRhdGVSYW5nZTogW21heFZhbHVlXSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJhbmdlOiBEYXRlW10gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWU/LnN0YXJ0ICYmIHRoaXMudmFsdWU/LmVuZCkge1xuICAgICAgICAgICAgY29uc3QgX3ZhbHVlID0gdGhpcy50b1JhbmdlT2ZEYXRlcyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChEYXRlVGltZVV0aWwuZ3JlYXRlclRoYW5NYXhWYWx1ZShfdmFsdWUuc3RhcnQsIF92YWx1ZS5lbmQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2FwRWRpdG9yRGF0ZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlSW5SYW5nZSh0aGlzLnZhbHVlLCBtaW5WYWx1ZSwgbWF4VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2UucHVzaChfdmFsdWUuc3RhcnQsIF92YWx1ZS5lbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXIuc2VsZWN0RGF0ZShyYW5nZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuZ2UubGVuZ3RoID09PSAwICYmIHRoaXMuY2FsZW5kYXIubW9udGhWaWV3cykge1xuICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5kZXNlbGVjdERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGVuZGFyLnZpZXdEYXRlID0gcmFuZ2VbMF0gfHwgbmV3IERhdGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN3YXBFZGl0b3JEYXRlcygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzUHJvamVjdGVkSW5wdXRzKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMucHJvamVjdGVkSW5wdXRzLmZpbmQoaSA9PiBpIGluc3RhbmNlb2YgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQpIGFzIElneERhdGVSYW5nZVN0YXJ0Q29tcG9uZW50O1xuICAgICAgICAgICAgY29uc3QgZW5kID0gdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZmluZChpID0+IGkgaW5zdGFuY2VvZiBJZ3hEYXRlUmFuZ2VFbmRDb21wb25lbnQpIGFzIElneERhdGVSYW5nZUVuZENvbXBvbmVudDtcbiAgICAgICAgICAgIFtzdGFydC5kYXRlVGltZUVkaXRvci52YWx1ZSwgZW5kLmRhdGVUaW1lRWRpdG9yLnZhbHVlXSA9IFtlbmQuZGF0ZVRpbWVFZGl0b3IudmFsdWUsIHN0YXJ0LmRhdGVUaW1lRWRpdG9yLnZhbHVlXTtcbiAgICAgICAgICAgIFt0aGlzLnZhbHVlLnN0YXJ0LCB0aGlzLnZhbHVlLmVuZF0gPSBbdGhpcy52YWx1ZS5lbmQsIHRoaXMudmFsdWUuc3RhcnRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWx1ZUluUmFuZ2UodmFsdWU6IERhdGVSYW5nZSwgbWluVmFsdWU/OiBEYXRlLCBtYXhWYWx1ZT86IERhdGUpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgX3ZhbHVlID0gdGhpcy50b1JhbmdlT2ZEYXRlcyh2YWx1ZSk7XG4gICAgICAgIGlmIChtaW5WYWx1ZSAmJiBEYXRlVGltZVV0aWwubGVzc1RoYW5NaW5WYWx1ZShfdmFsdWUuc3RhcnQsIG1pblZhbHVlLCBmYWxzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4VmFsdWUgJiYgRGF0ZVRpbWVVdGlsLmdyZWF0ZXJUaGFuTWF4VmFsdWUoX3ZhbHVlLmVuZCwgbWF4VmFsdWUsIGZhbHNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHRyYWN0UmFuZ2Uoc2VsZWN0aW9uOiBEYXRlW10pOiBEYXRlUmFuZ2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhcnQ6IHNlbGVjdGlvblswXSB8fCBudWxsLFxuICAgICAgICAgICAgZW5kOiBzZWxlY3Rpb24ubGVuZ3RoID4gMCA/IHNlbGVjdGlvbltzZWxlY3Rpb24ubGVuZ3RoIC0gMV0gOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b1JhbmdlT2ZEYXRlcyhyYW5nZTogRGF0ZVJhbmdlKTogeyBzdGFydDogRGF0ZTsgZW5kOiBEYXRlIH0ge1xuICAgICAgICBsZXQgc3RhcnQ7XG4gICAgICAgIGxldCBlbmQ7XG4gICAgICAgIGlmICghaXNEYXRlKHJhbmdlLnN0YXJ0KSkge1xuICAgICAgICAgICAgc3RhcnQgPSBEYXRlVGltZVV0aWwucGFyc2VJc29EYXRlKHJhbmdlLnN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzRGF0ZShyYW5nZS5lbmQpKSB7XG4gICAgICAgICAgICBlbmQgPSBEYXRlVGltZVV0aWwucGFyc2VJc29EYXRlKHJhbmdlLmVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhcnQgfHwgZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBzdGFydDogcmFuZ2Uuc3RhcnQgYXMgRGF0ZSwgZW5kOiByYW5nZS5lbmQgYXMgRGF0ZSB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9EYXRlRWRpdG9yRXZlbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5oYXNQcm9qZWN0ZWRJbnB1dHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZmluZChpID0+IGkgaW5zdGFuY2VvZiBJZ3hEYXRlUmFuZ2VTdGFydENvbXBvbmVudCkgYXMgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQ7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSB0aGlzLnByb2plY3RlZElucHV0cy5maW5kKGkgPT4gaSBpbnN0YW5jZW9mIElneERhdGVSYW5nZUVuZENvbXBvbmVudCkgYXMgSWd4RGF0ZVJhbmdlRW5kQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKHN0YXJ0ICYmIGVuZCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0LmRhdGVUaW1lRWRpdG9yLnZhbHVlQ2hhbmdlXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0geyBzdGFydDogdmFsdWUsIGVuZDogdGhpcy52YWx1ZS5lbmQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHsgc3RhcnQ6IHZhbHVlLCBlbmQ6IG51bGwgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZW5kLmRhdGVUaW1lRWRpdG9yLnZhbHVlQ2hhbmdlXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0geyBzdGFydDogdGhpcy52YWx1ZS5zdGFydCwgZW5kOiB2YWx1ZSBhcyBEYXRlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB7IHN0YXJ0OiBudWxsLCBlbmQ6IHZhbHVlIGFzIERhdGUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGF0dGFjaE9uVG91Y2hlZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzUHJvamVjdGVkSW5wdXRzKSB7XG4gICAgICAgICAgICB0aGlzLnByb2plY3RlZElucHV0cy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICAgICAgICAgIGZyb21FdmVudChpLmRhdGVUaW1lRWRpdG9yLm5hdGl2ZUVsZW1lbnQsICdibHVyJylcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSlcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbGlkaXR5T25CbHVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5pbnB1dERpcmVjdGl2ZS5uYXRpdmVFbGVtZW50LCAnYmx1cicpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbGlkaXR5T25CbHVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FjaGVGb2N1c2VkSW5wdXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmhhc1Byb2plY3RlZElucHV0cykge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgICAgICBmcm9tRXZlbnQoaS5kYXRlVGltZUVkaXRvci5uYXRpdmVFbGVtZW50LCAnZm9jdXMnKVxuICAgICAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2ZvY3VzZWRJbnB1dCA9IGkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ1Bvc2l0aW9uU3RyYXRlZ3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBvcGVuQW5pbWF0aW9uOiBmYWRlSW4sXG4gICAgICAgICAgICBjbG9zZUFuaW1hdGlvbjogZmFkZU91dFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9kcm9wRG93bk92ZXJsYXlTZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5ID0gbmV3IEF1dG9Qb3NpdGlvblN0cmF0ZWd5KHRoaXMuX3Bvc2l0aW9uU2V0dGluZ3MpO1xuICAgICAgICB0aGlzLl9kcm9wRG93bk92ZXJsYXlTZXR0aW5ncy50YXJnZXQgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ092ZXJsYXlTZXR0aW5ncygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheVNldHRpbmdzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9kcm9wRG93bk92ZXJsYXlTZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2Ryb3BEb3duT3ZlcmxheVNldHRpbmdzLCB0aGlzLm92ZXJsYXlTZXR0aW5ncyk7XG4gICAgICAgICAgICB0aGlzLl9kaWFsb2dPdmVybGF5U2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kaWFsb2dPdmVybGF5U2V0dGluZ3MsIHRoaXMub3ZlcmxheVNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbFNldFZhbHVlKCkge1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB2YWx1ZSBhbmQgbm8gbmdDb250cm9sIG9uIHRoZSBwaWNrZXIgYnV0IHdlIGhhdmUgaW5wdXRzIHdlIG1heSBoYXZlIHZhbHVlIHNldCB0aHJvdWdoXG4gICAgICAgIC8vIHRoZWlyIG5nTW9kZWxzIC0gd2Ugc2hvdWxkIGdlbmVyYXRlIG91ciBpbml0aWFsIGNvbnRyb2wgdmFsdWVcbiAgICAgICAgaWYgKCghdGhpcy52YWx1ZSB8fCAoIXRoaXMudmFsdWUuc3RhcnQgJiYgIXRoaXMudmFsdWUuZW5kKSkgJiYgdGhpcy5oYXNQcm9qZWN0ZWRJbnB1dHMgJiYgIXRoaXMuX25nQ29udHJvbCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnByb2plY3RlZElucHV0cy5maW5kKGkgPT4gaSBpbnN0YW5jZW9mIElneERhdGVSYW5nZVN0YXJ0Q29tcG9uZW50KTtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHRoaXMucHJvamVjdGVkSW5wdXRzLmZpbmQoaSA9PiBpIGluc3RhbmNlb2YgSWd4RGF0ZVJhbmdlRW5kQ29tcG9uZW50KTtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydC5kYXRlVGltZUVkaXRvci52YWx1ZSBhcyBEYXRlLFxuICAgICAgICAgICAgICAgIGVuZDogZW5kLmRhdGVUaW1lRWRpdG9yLnZhbHVlIGFzIERhdGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUlucHV0cygpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnByb2plY3RlZElucHV0cz8uZmluZChpID0+IGkgaW5zdGFuY2VvZiBJZ3hEYXRlUmFuZ2VTdGFydENvbXBvbmVudCkgYXMgSWd4RGF0ZVJhbmdlU3RhcnRDb21wb25lbnQ7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMucHJvamVjdGVkSW5wdXRzPy5maW5kKGkgPT4gaSBpbnN0YW5jZW9mIElneERhdGVSYW5nZUVuZENvbXBvbmVudCkgYXMgSWd4RGF0ZVJhbmdlRW5kQ29tcG9uZW50O1xuICAgICAgICBpZiAoc3RhcnQgJiYgZW5kKSB7XG4gICAgICAgICAgICBjb25zdCBfdmFsdWUgPSB0aGlzLnZhbHVlID8gdGhpcy50b1JhbmdlT2ZEYXRlcyh0aGlzLnZhbHVlKSA6IG51bGw7XG4gICAgICAgICAgICBzdGFydC51cGRhdGVJbnB1dFZhbHVlKF92YWx1ZT8uc3RhcnQgfHwgbnVsbCk7XG4gICAgICAgICAgICBlbmQudXBkYXRlSW5wdXRWYWx1ZShfdmFsdWU/LmVuZCB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRGlzcGxheUZvcm1hdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gaSBhcyBJZ3hEYXRlUmFuZ2VJbnB1dHNCYXNlQ29tcG9uZW50O1xuICAgICAgICAgICAgaW5wdXQuZGF0ZVRpbWVFZGl0b3IuZGlzcGxheUZvcm1hdCA9IHRoaXMuZGlzcGxheUZvcm1hdDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVJbnB1dEZvcm1hdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcm9qZWN0ZWRJbnB1dHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gaSBhcyBJZ3hEYXRlUmFuZ2VJbnB1dHNCYXNlQ29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKGlucHV0LmRhdGVUaW1lRWRpdG9yLmlucHV0Rm9ybWF0ICE9PSB0aGlzLmlucHV0Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZGF0ZVRpbWVFZGl0b3IuaW5wdXRGb3JtYXQgPSB0aGlzLmlucHV0Rm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pbml0aWFsaXplQ2FsZW5kYXJDb250YWluZXIoY29tcG9uZW50SW5zdGFuY2U6IElneENhbGVuZGFyQ29udGFpbmVyQ29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyID0gY29tcG9uZW50SW5zdGFuY2UuY2FsZW5kYXI7XG4gICAgICAgIHRoaXMuY2FsZW5kYXIuaGFzSGVhZGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2FsZW5kYXIubG9jYWxlID0gdGhpcy5sb2NhbGU7XG4gICAgICAgIHRoaXMuY2FsZW5kYXIuc2VsZWN0aW9uID0gQ2FsZW5kYXJTZWxlY3Rpb24uUkFOR0U7XG4gICAgICAgIHRoaXMuY2FsZW5kYXIud2Vla1N0YXJ0ID0gdGhpcy53ZWVrU3RhcnQ7XG4gICAgICAgIHRoaXMuY2FsZW5kYXIuaGlkZU91dHNpZGVEYXlzID0gdGhpcy5oaWRlT3V0c2lkZURheXM7XG4gICAgICAgIHRoaXMuY2FsZW5kYXIubW9udGhzVmlld051bWJlciA9IHRoaXMuZGlzcGxheU1vbnRoc0NvdW50O1xuICAgICAgICB0aGlzLmNhbGVuZGFyLnNlbGVjdGVkLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSkuc3Vic2NyaWJlKChldjogRGF0ZVtdKSA9PiB0aGlzLmhhbmRsZVNlbGVjdGlvbihldikpO1xuXG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLm1vZGUgPSB0aGlzLm1vZGU7XG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLmNsb3NlQnV0dG9uTGFiZWwgPSAhdGhpcy5pc0Ryb3Bkb3duID8gdGhpcy5kb25lQnV0dG9uVGV4dCA6IG51bGw7XG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLnBpY2tlckFjdGlvbnMgPSB0aGlzLnBpY2tlckFjdGlvbnM7XG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLmNhbGVuZGFyQ2xvc2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICB9XG59XG4iLCI8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGhpcy5oYXNQcm9qZWN0ZWRJbnB1dHMgPyBzdGFydEVuZFRlbXBsYXRlIDogZGVmVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cblxuPG5nLXRlbXBsYXRlICNzaW5nbGVUZW1wbGF0ZT5cbiAgICA8ZGl2IChjbGljayk9XCJ0aGlzLm9wZW4oKVwiIGNsYXNzPVwiY29udGVudC13cmFwXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1kYXRlLXNpbmdsZVwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjc3RhcnRFbmRUZW1wbGF0ZT5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtZGF0ZS1yYW5nZS1zdGFydFwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2IFtjbGFzc05hbWVdPVwic2VwYXJhdG9yQ2xhc3NcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGVTZXBhcmF0b3JUZW1wbGF0ZSB8fCBkZWZEYXRlU2VwYXJhdG9yVGVtcGxhdGU7XCI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1kYXRlLXJhbmdlLWVuZFwiPjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmSWNvbj5cbiAgICA8aWd4LWljb24+XG4gICAgICAgIGRhdGVfcmFuZ2VcbiAgICA8L2lneC1pY29uPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZEYXRlU2VwYXJhdG9yVGVtcGxhdGU+e3sgZGF0ZVNlcGFyYXRvciB9fTwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGVmVGVtcGxhdGU+XG4gICAgPGlneC1pbnB1dC1ncm91cCBbdHlwZV09XCJ0aGlzLnR5cGVcIiBbZGlzcGxheURlbnNpdHldPVwidGhpcy5kaXNwbGF5RGVuc2l0eVwiIChjbGljayk9XCJ0aGlzLm9wZW4oKVwiPlxuICAgICAgICA8IS0tIG9ubHkgc2V0IG1hc2sgcGxhY2Vob2xkZXIgd2hlbiBlbXB0eSwgb3RoZXJ3aXNlIGlucHV0IGdyb3VwIG1pZ2h0IHVzZSBpdCBhcyBsYWJlbCBpZiBub25lIGlzIHNldCAtLT5cbiAgICAgICAgPGlucHV0ICNzaW5nbGVJbnB1dCBpZ3hJbnB1dCB0eXBlPVwidGV4dFwiIHJlYWRvbmx5IFtkaXNhYmxlZF09XCJ0aGlzLmRpc2FibGVkXCIgW3BsYWNlaG9sZGVyXT1cInRoaXMudmFsdWUgPyAnJyA6IHNpbmdsZUlucHV0Rm9ybWF0XCJcbiAgICAgICAgICAgIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtaGFzcG9wdXA9XCJncmlkXCIgW2F0dHIuYXJpYS1leHBhbmRlZF09XCIhdGhpcy5jb2xsYXBzZWRcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwidGhpcy5sYWJlbD8uaWRcIlxuICAgICAgICAgICAgW3ZhbHVlXT1cInRoaXMudmFsdWUgfCBkYXRlUmFuZ2U6IHRoaXMuYXBwbGllZEZvcm1hdCA6IHRoaXMubG9jYWxlIDogdGhpcy5mb3JtYXR0ZXJcIiAvPlxuXG4gICAgICAgIDxpZ3gtcHJlZml4ICpuZ0lmPVwiIXRoaXMudG9nZ2xlQ29tcG9uZW50cy5sZW5ndGhcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJkZWZJY29uXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvaWd4LXByZWZpeD5cblxuICAgICAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiW2lneExhYmVsXVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2lneExhYmVsXVwiPjwvbmctY29udGVudD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJpZ3gtcHJlZml4XCI+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtcHJlZml4LFtpZ3hQcmVmaXhdXCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1zdWZmaXhcIj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1zdWZmaXgsW2lneFN1ZmZpeF1cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiaWd4LWhpbnRcIj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1oaW50LFtpZ3hIaW50XVwiPjwvbmctY29udGVudD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9pZ3gtaW5wdXQtZ3JvdXA+XG48L25nLXRlbXBsYXRlPlxuIl19