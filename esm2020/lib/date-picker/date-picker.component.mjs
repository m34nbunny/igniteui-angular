import { Component, ContentChild, EventEmitter, HostBinding, Input, Output, ViewChild, Inject, HostListener, ContentChildren, LOCALE_ID, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl, NG_VALIDATORS } from '@angular/forms';
import { IgxCalendarHeaderTemplateDirective, IgxCalendarSubheaderTemplateDirective, WEEKDAYS, isDateInRanges } from '../calendar/public_api';
import { IgxInputDirective, IgxInputGroupComponent, IgxLabelDirective, IGX_INPUT_GROUP_TYPE, IgxInputState } from '../input-group/public_api';
import { fromEvent, noop } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IgxOverlayService, AbsoluteScrollStrategy, AutoPositionStrategy } from '../services/public_api';
import { CurrentResourceStrings } from '../core/i18n/resources';
import { DateRangeType } from '../core/dates/dateRange';
import { isDate } from '../core/utils';
import { IgxCalendarContainerComponent } from '../date-common/calendar-container/calendar-container.component';
import { fadeIn, fadeOut } from '../animations/fade';
import { PickerBaseDirective } from '../date-common/picker-base.directive';
import { DisplayDensityToken } from '../core/density';
import { IgxDateTimeEditorDirective } from '../directives/date-time-editor/public_api';
import { DateTimeUtil } from '../date-common/util/date-time.util';
import { PickerHeaderOrientation as PickerHeaderOrientation } from '../date-common/types';
import { IgxPickerClearComponent, IgxPickerActionsDirective } from '../date-common/public_api';
import * as i0 from "@angular/core";
import * as i1 from "../core/utils";
import * as i2 from "../input-group/input-group.component";
import * as i3 from "../icon/icon.component";
import * as i4 from "@angular/common";
import * as i5 from "../directives/prefix/prefix.directive";
import * as i6 from "../directives/input/input.directive";
import * as i7 from "../directives/date-time-editor/date-time-editor.directive";
import * as i8 from "../directives/text-selection/text-selection.directive";
import * as i9 from "../directives/suffix/suffix.directive";
import * as i10 from "../services/public_api";
let NEXT_ID = 0;
/**
 * Date Picker displays a popup calendar that lets users select a single date.
 *
 * @igxModule IgxDatePickerModule
 * @igxTheme igx-calendar-theme, igx-icon-theme
 * @igxGroup Scheduling
 * @igxKeywords datepicker, calendar, schedule, date
 * @example
 * ```html
 * <igx-date-picker [(ngModel)]="selectedDate"></igx-date-picker>
 * ```
 */
export class IgxDatePickerComponent extends PickerBaseDirective {
    constructor(element, _localeId, _overlayService, _moduleRef, _injector, _renderer, platform, cdr, _displayDensityOptions, _inputGroupType) {
        super(element, _localeId, _displayDensityOptions, _inputGroupType);
        this.element = element;
        this._localeId = _localeId;
        this._overlayService = _overlayService;
        this._moduleRef = _moduleRef;
        this._injector = _injector;
        this._renderer = _renderer;
        this.platform = platform;
        this.cdr = cdr;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        /**
         * Gets/Sets on which day the week starts.
         *
         * @example
         * ```html
         * <igx-date-picker [weekStart]="4" cancelButtonLabel="cancel" todayButtonLabel="today"></igx-date-picker>
         * ```
         */
        this.weekStart = WEEKDAYS.SUNDAY;
        /**
         * Gets/Sets the number of month views displayed.
         *
         * @remarks
         * Default value is `1`.
         *
         * @example
         * ```html
         * <igx-date-picker [displayMonthsCount]="2"></igx-date-picker>
         * ```
         * @example
         * ```typescript
         * let monthViewsDisplayed = this.datePicker.displayMonthsCount;
         * ```
         */
        this.displayMonthsCount = 1;
        /**
         * Gets/Sets the orientation of the `IgxDatePickerComponent` header.
         *
         *  @example
         * ```html
         * <igx-date-picker headerOrientation="vertical"></igx-date-picker>
         * ```
         */
        this.headerOrientation = PickerHeaderOrientation.Horizontal;
        /**
         * Specify if the currently spun date segment should loop over.
         *
         *  @example
         * ```html
         * <igx-date-picker [spinLoop]="false"></igx-date-picker>
         * ```
         */
        this.spinLoop = true;
        /**
         * Gets/Sets the value of `id` attribute.
         *
         * @remarks If not provided it will be automatically generated.
         * @example
         * ```html
         * <igx-date-picker [id]="'igx-date-picker-3'" cancelButtonLabel="cancel" todayButtonLabel="today"></igx-date-picker>
         * ```
         */
        this.id = `igx-date-picker-${NEXT_ID++}`;
        /** @hidden @internal */
        this.readOnly = false;
        /**
         * Emitted when the picker's value changes.
         *
         * @remarks
         * Used for `two-way` bindings.
         *
         * @example
         * ```html
         * <igx-date-picker [(value)]="date"></igx-date-picker>
         * ```
         */
        this.valueChange = new EventEmitter();
        /**
         * Emitted when the user types/spins invalid date in the date-picker editor.
         *
         *  @example
         * ```html
         * <igx-date-picker (validationFailed)="onValidationFailed($event)"></igx-date-picker>
         * ```
         */
        this.validationFailed = new EventEmitter();
        /** @hidden @internal */
        this.displayValue = { transform: (date) => this.formatter(date) };
        this._resourceStrings = CurrentResourceStrings.DatePickerResourceStrings;
        this._ngControl = null;
        this._specialDates = null;
        this._disabledDates = null;
        this._overlaySubFilter = [
            filter(x => x.id === this._overlayId),
            takeUntil(this._destroy$)
        ];
        this._dropDownOverlaySettings = {
            target: this.inputGroupElement,
            closeOnOutsideClick: true,
            modal: false,
            closeOnEscape: true,
            scrollStrategy: new AbsoluteScrollStrategy(),
            positionStrategy: new AutoPositionStrategy({
                openAnimation: fadeIn,
                closeAnimation: fadeOut
            })
        };
        this._dialogOverlaySettings = {
            closeOnOutsideClick: true,
            modal: true,
            closeOnEscape: true
        };
        this._calendarFormat = {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric'
        };
        this._defFormatViews = {
            day: false,
            month: true,
            year: false
        };
        this._onChangeCallback = noop;
        this._onTouchedCallback = noop;
        this._onValidatorChange = noop;
        this.onStatusChanged = () => {
            this.updateValidity();
            this.inputGroup.isRequired = this.required;
        };
    }
    /**
     * Gets/Sets the disabled dates descriptors.
     *
     * @example
     * ```typescript
     * let disabledDates = this.datepicker.disabledDates;
     * this.datePicker.disabledDates = [ {type: DateRangeType.Weekends}, ...];
     * ```
     */
    get disabledDates() {
        return this._disabledDates;
    }
    set disabledDates(value) {
        this._disabledDates = value;
        this._onValidatorChange();
    }
    /**
     * Gets/Sets the special dates descriptors.
     *
     * @example
     * ```typescript
     * let specialDates = this.datepicker.specialDates;
     * this.datePicker.specialDates = [ {type: DateRangeType.Weekends}, ... ];
     * ```
     */
    get specialDates() {
        return this._specialDates;
    }
    set specialDates(value) {
        this._specialDates = value;
    }
    //#endregion
    /**
     * Gets/Sets the selected date.
     *
     *  @example
     * ```html
     * <igx-date-picker [value]="date"></igx-date-picker>
     * ```
     */
    get value() {
        return this._value;
    }
    set value(date) {
        this._value = date;
        this.setDateValue(date);
        if (this.dateTimeEditor.value !== date) {
            this.dateTimeEditor.value = this._dateValue;
        }
        this.valueChange.emit(this.dateValue);
        this._onChangeCallback(this.dateValue);
    }
    /**
     * The minimum value the picker will accept.
     *
     * @example
     * <igx-date-picker [minValue]="minDate"></igx-date-picker>
     */
    set minValue(value) {
        this._minValue = value;
        this._onValidatorChange();
    }
    get minValue() {
        return this._minValue;
    }
    /**
     * The maximum value the picker will accept.
     *
     * @example
     * <igx-date-picker [maxValue]="maxDate"></igx-date-picker>
     */
    set maxValue(value) {
        this._maxValue = value;
        this._onValidatorChange();
    }
    get maxValue() {
        return this._maxValue;
    }
    get dialogOverlaySettings() {
        return Object.assign({}, this._dialogOverlaySettings, this.overlaySettings);
    }
    get dropDownOverlaySettings() {
        return Object.assign({}, this._dropDownOverlaySettings, this.overlaySettings);
    }
    get inputGroupElement() {
        return this.inputGroup?.element.nativeElement;
    }
    get dateValue() {
        return this._dateValue;
    }
    get pickerFormatViews() {
        return Object.assign({}, this._defFormatViews, this.formatViews);
    }
    get pickerCalendarFormat() {
        return Object.assign({}, this._calendarFormat, this.calendarFormat);
    }
    /** @hidden @internal */
    get required() {
        if (this._ngControl && this._ngControl.control && this._ngControl.control.validator) {
            // Run the validation with empty object to check if required is enabled.
            const error = this._ngControl.control.validator({});
            return error && error.required;
        }
        return false;
    }
    /** @hidden @internal */
    get pickerResourceStrings() {
        return Object.assign({}, this._resourceStrings, this.resourceStrings);
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
            case this.platform.KEYMAP.SPACE:
                event.preventDefault();
                this.open();
                break;
        }
    }
    /**
     * Opens the picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.open()">Open Dialog</button>
     * ```
     */
    open(settings) {
        if (!this.collapsed || this.disabled) {
            return;
        }
        const overlaySettings = Object.assign({}, this.isDropdown
            ? this.dropDownOverlaySettings
            : this.dialogOverlaySettings, settings);
        if (this.isDropdown && this.inputGroupElement) {
            overlaySettings.target = this.inputGroupElement;
        }
        if (this.outlet) {
            overlaySettings.outlet = this.outlet;
        }
        this._overlayId = this._overlayService
            .attach(IgxCalendarContainerComponent, overlaySettings, this._moduleRef);
        this._overlayService.show(this._overlayId);
    }
    /**
     * Toggles the picker's dropdown or dialog
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.toggle()">Toggle Dialog</button>
     * ```
     */
    toggle(settings) {
        if (this.collapsed) {
            this.open(settings);
        }
        else {
            this.close();
        }
    }
    /**
     * Closes the picker's dropdown or dialog.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.close()">Close Dialog</button>
     * ```
     */
    close() {
        if (!this.collapsed) {
            this._overlayService.hide(this._overlayId);
        }
    }
    /**
     * Selects a date.
     *
     * @remarks Updates the value in the input field.
     *
     * @example
     * ```typescript
     * this.datePicker.select(date);
     * ```
     * @param date passed date that has to be set to the calendar.
     */
    select(value) {
        this.value = value;
    }
    /**
     * Selects today's date and closes the picker.
     *
     * @example
     * ```html
     * <igx-date-picker #picker></igx-date-picker>
     *
     * <button (click)="picker.selectToday()">Select Today</button>
     * ```
     * */
    selectToday() {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        this.select(today);
        this.close();
    }
    /**
     * Clears the input field and the picker's value.
     *
     * @example
     * ```typescript
     * this.datePicker.clear();
     * ```
     */
    clear() {
        if (!this.disabled) {
            this._calendar?.deselectDate();
            this.dateTimeEditor.clear();
        }
    }
    /**
     * Increment a specified `DatePart`.
     *
     * @param datePart The optional DatePart to increment. Defaults to Date.
     * @param delta The optional delta to increment by. Overrides `spinDelta`.
     * @example
     * ```typescript
     * this.datePicker.increment(DatePart.Date);
     * ```
     */
    increment(datePart, delta) {
        this.dateTimeEditor.increment(datePart, delta);
    }
    /**
     * Decrement a specified `DatePart`
     *
     * @param datePart The optional DatePart to decrement. Defaults to Date.
     * @param delta The optional delta to decrement by. Overrides `spinDelta`.
     * @example
     * ```typescript
     * this.datePicker.decrement(DatePart.Date);
     * ```
     */
    decrement(datePart, delta) {
        this.dateTimeEditor.decrement(datePart, delta);
    }
    //#region Control Value Accessor
    /** @hidden @internal */
    writeValue(value) {
        this._value = value;
        this.setDateValue(value);
        if (this.dateTimeEditor.value !== value) {
            this.dateTimeEditor.value = this._dateValue;
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
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    //#endregion
    //#region Validator
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
        if (value && this.disabledDates && isDateInRanges(value, this.disabledDates)) {
            Object.assign(errors, { dateIsDisabled: true });
        }
        Object.assign(errors, DateTimeUtil.validateMinMax(value, this.minValue, this.maxValue, false));
        return Object.keys(errors).length > 0 ? errors : null;
    }
    //#endregion
    /** @hidden @internal */
    ngOnInit() {
        this._ngControl = this._injector.get(NgControl, null);
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscribeToClick();
        this.subscribeToOverlayEvents();
        this.subscribeToDateEditorEvents();
        this.subToIconsClicked(this.clearComponents, () => this.clear());
        this.clearComponents.changes.pipe(takeUntil(this._destroy$))
            .subscribe(() => this.subToIconsClicked(this.clearComponents, () => this.clear()));
        this._dropDownOverlaySettings.excludeFromOutsideClick = [this.inputGroup.element.nativeElement];
        fromEvent(this.inputDirective.nativeElement, 'blur')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
            if (this.collapsed) {
                this._onTouchedCallback();
                this.updateValidity();
            }
        });
        if (this._ngControl) {
            this._statusChanges$ =
                this._ngControl.statusChanges.subscribe(this.onStatusChanged.bind(this));
            if (this._ngControl.control.validator) {
                this.inputGroup.isRequired = this.required;
                this.cdr.detectChanges();
            }
        }
    }
    /** @hidden @internal */
    ngAfterViewChecked() {
        if (this.labelDirective) {
            this._renderer.setAttribute(this.inputDirective.nativeElement, 'aria-labelledby', this.labelDirective.id);
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
            delete this._overlayId;
        }
    }
    /** @hidden @internal */
    getEditElement() {
        return this.inputDirective.nativeElement;
    }
    subscribeToClick() {
        fromEvent(this.getEditElement(), 'click')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
            if (!this.isDropdown) {
                this.toggle();
            }
        });
    }
    setDateValue(value) {
        if (isDate(value) && isNaN(value.getTime())) {
            this._dateValue = value;
            return;
        }
        this._dateValue = DateTimeUtil.isValidDate(value) ? value : DateTimeUtil.parseIsoDate(value);
    }
    updateValidity() {
        // B.P. 18 May 2021: IgxDatePicker does not reset its state upon resetForm #9526
        if (this._ngControl && !this.disabled && this.isTouchedOrDirty) {
            if (this.inputGroup.isFocused) {
                this.inputDirective.valid = this._ngControl.valid
                    ? IgxInputState.VALID
                    : IgxInputState.INVALID;
            }
            else {
                this.inputDirective.valid = this._ngControl.valid
                    ? IgxInputState.INITIAL
                    : IgxInputState.INVALID;
            }
        }
        else {
            this.inputDirective.valid = IgxInputState.INITIAL;
        }
    }
    get isTouchedOrDirty() {
        return (this._ngControl.control.touched || this._ngControl.control.dirty)
            && (!!this._ngControl.control.validator || !!this._ngControl.control.asyncValidator);
    }
    handleSelection(date) {
        if (this.dateValue && DateTimeUtil.isValidDate(this.dateValue)) {
            date.setHours(this.dateValue.getHours());
            date.setMinutes(this.dateValue.getMinutes());
            date.setSeconds(this.dateValue.getSeconds());
            date.setMilliseconds(this.dateValue.getMilliseconds());
        }
        this.value = date;
        this._calendar.viewDate = date;
        this.close();
    }
    subscribeToDateEditorEvents() {
        this.dateTimeEditor.valueChange.pipe(takeUntil(this._destroy$)).subscribe(val => {
            this.value = val;
        });
        this.dateTimeEditor.validationFailed.pipe(takeUntil(this._destroy$)).subscribe((event) => {
            this.validationFailed.emit({
                owner: this,
                prevValue: event.oldValue,
                currentValue: this.value
            });
        });
    }
    subscribeToOverlayEvents() {
        this._overlayService.opening.pipe(...this._overlaySubFilter).subscribe((e) => {
            const args = { owner: this, event: e.event, cancel: e.cancel };
            this.opening.emit(args);
            e.cancel = args.cancel;
            if (args.cancel) {
                this._overlayService.detach(this._overlayId);
                return;
            }
            this._initializeCalendarContainer(e.componentRef.instance);
            this._collapsed = false;
        });
        this._overlayService.opened.pipe(...this._overlaySubFilter).subscribe(() => {
            this.opened.emit({ owner: this });
            if (this._calendar?.daysView?.selectedDates) {
                this._calendar?.daysView?.focusActiveDate();
                return;
            }
            if (this._targetViewDate) {
                this._targetViewDate.setHours(0, 0, 0, 0);
                this._calendar?.daysView?.dates
                    .find(d => d.date.date.getTime() === this._targetViewDate.getTime())?.nativeElement.focus();
            }
        });
        this._overlayService.closing.pipe(...this._overlaySubFilter).subscribe((e) => {
            const args = { owner: this, event: e.event, cancel: e.cancel };
            this.closing.emit(args);
            e.cancel = args.cancel;
            if (args.cancel) {
                return;
            }
            // do not focus the input if clicking outside in dropdown mode
            if (this.getEditElement() && !(args.event && this.isDropdown)) {
                this.inputDirective.focus();
            }
            else {
                this._onTouchedCallback();
                this.updateValidity();
            }
        });
        this._overlayService.closed.pipe(...this._overlaySubFilter).subscribe(() => {
            this.closed.emit({ owner: this });
            this._overlayService.detach(this._overlayId);
            this._collapsed = true;
            this._overlayId = null;
        });
    }
    getMinMaxDates() {
        const minValue = DateTimeUtil.isValidDate(this.minValue) ? this.minValue : DateTimeUtil.parseIsoDate(this.minValue);
        const maxValue = DateTimeUtil.isValidDate(this.maxValue) ? this.maxValue : DateTimeUtil.parseIsoDate(this.maxValue);
        return { minValue, maxValue };
    }
    setDisabledDates() {
        this._calendar.disabledDates = this.disabledDates ? [...this.disabledDates] : [];
        const { minValue, maxValue } = this.getMinMaxDates();
        if (minValue) {
            this._calendar.disabledDates.push({ type: DateRangeType.Before, dateRange: [minValue] });
        }
        if (maxValue) {
            this._calendar.disabledDates.push({ type: DateRangeType.After, dateRange: [maxValue] });
        }
    }
    _initializeCalendarContainer(componentInstance) {
        this._calendar = componentInstance.calendar;
        const isVertical = this.headerOrientation === PickerHeaderOrientation.Vertical;
        this._calendar.hasHeader = !this.isDropdown;
        this._calendar.formatOptions = this.pickerCalendarFormat;
        this._calendar.formatViews = this.pickerFormatViews;
        this._calendar.locale = this.locale;
        this._calendar.vertical = isVertical;
        this._calendar.weekStart = this.weekStart;
        this._calendar.specialDates = this.specialDates;
        this._calendar.headerTemplate = this.headerTemplate;
        this._calendar.subheaderTemplate = this.subheaderTemplate;
        this._calendar.hideOutsideDays = this.hideOutsideDays;
        this._calendar.monthsViewNumber = this.displayMonthsCount;
        this._calendar.showWeekNumbers = this.showWeekNumbers;
        this._calendar.selected.pipe(takeUntil(this._destroy$)).subscribe((ev) => this.handleSelection(ev));
        this.setDisabledDates();
        if (DateTimeUtil.isValidDate(this.dateValue)) {
            // calendar will throw if the picker's value is InvalidDate #9208
            this._calendar.value = this.dateValue;
        }
        this.setCalendarViewDate();
        componentInstance.mode = this.mode;
        componentInstance.vertical = isVertical;
        componentInstance.closeButtonLabel = this.cancelButtonLabel;
        componentInstance.todayButtonLabel = this.todayButtonLabel;
        componentInstance.pickerActions = this.pickerActions;
        componentInstance.calendarClose.pipe(takeUntil(this._destroy$)).subscribe(() => this.close());
        componentInstance.todaySelection.pipe(takeUntil(this._destroy$)).subscribe(() => this.selectToday());
    }
    setCalendarViewDate() {
        const { minValue, maxValue } = this.getMinMaxDates();
        this._dateValue = this.dateValue || new Date();
        if (minValue && DateTimeUtil.lessThanMinValue(this.dateValue, minValue)) {
            this._calendar.viewDate = this._targetViewDate = minValue;
            return;
        }
        if (maxValue && DateTimeUtil.greaterThanMaxValue(this.dateValue, maxValue)) {
            this._calendar.viewDate = this._targetViewDate = maxValue;
            return;
        }
        this._calendar.viewDate = this._targetViewDate = this.dateValue;
    }
}
IgxDatePickerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDatePickerComponent, deps: [{ token: i0.ElementRef }, { token: LOCALE_ID }, { token: IgxOverlayService }, { token: i0.NgModuleRef }, { token: i0.Injector }, { token: i0.Renderer2 }, { token: i1.PlatformUtil }, { token: i0.ChangeDetectorRef }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxDatePickerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxDatePickerComponent, selector: "igx-date-picker", inputs: { weekStart: "weekStart", hideOutsideDays: "hideOutsideDays", displayMonthsCount: "displayMonthsCount", showWeekNumbers: "showWeekNumbers", formatter: "formatter", headerOrientation: "headerOrientation", todayButtonLabel: "todayButtonLabel", cancelButtonLabel: "cancelButtonLabel", spinLoop: "spinLoop", spinDelta: "spinDelta", outlet: "outlet", id: "id", formatViews: "formatViews", disabledDates: "disabledDates", specialDates: "specialDates", calendarFormat: "calendarFormat", value: "value", minValue: "minValue", maxValue: "maxValue", resourceStrings: "resourceStrings", readOnly: "readOnly" }, outputs: { valueChange: "valueChange", validationFailed: "validationFailed" }, host: { listeners: { "keydown": "onKeyDown($event)" }, properties: { "attr.id": "this.id" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDatePickerComponent, multi: true },
        { provide: NG_VALIDATORS, useExisting: IgxDatePickerComponent, multi: true }
    ], queries: [{ propertyName: "label", first: true, predicate: IgxLabelDirective, descendants: true }, { propertyName: "headerTemplate", first: true, predicate: IgxCalendarHeaderTemplateDirective, descendants: true }, { propertyName: "subheaderTemplate", first: true, predicate: IgxCalendarSubheaderTemplateDirective, descendants: true }, { propertyName: "pickerActions", first: true, predicate: IgxPickerActionsDirective, descendants: true }, { propertyName: "clearComponents", predicate: IgxPickerClearComponent }], viewQueries: [{ propertyName: "dateTimeEditor", first: true, predicate: IgxDateTimeEditorDirective, descendants: true, static: true }, { propertyName: "inputGroup", first: true, predicate: IgxInputGroupComponent, descendants: true }, { propertyName: "labelDirective", first: true, predicate: IgxLabelDirective, descendants: true }, { propertyName: "inputDirective", first: true, predicate: IgxInputDirective, descendants: true }], usesInheritance: true, ngImport: i0, template: "<igx-input-group [displayDensity]=\"this.displayDensity\" [type]=\"this.type\" [suppressInputAutofocus]=\"true\">\n    <igx-prefix *ngIf=\"!this.toggleComponents.length\" (click)=\"this.toggle()\">\n        <igx-icon [title]=\"this.value\n            ? pickerResourceStrings.igx_date_picker_change_date\n            : pickerResourceStrings.igx_date_picker_choose_date\">today</igx-icon>\n    </igx-prefix>\n\n    <input class=\"igx-date-picker__input-date\" [displayValuePipe]=\"this.formatter ? displayValue : null\" igxInput\n        [igxDateTimeEditor]=\"this.inputFormat\" [displayFormat]=\"this.displayFormat\"\n        [minValue]=\"this.minValue\" [maxValue]=\"this.maxValue\" [spinDelta]=\"this.spinDelta\" [spinLoop]=\"this.spinLoop\" \n        [disabled]=\"this.disabled\" [placeholder]=\"this.placeholder\" [readonly]=\"!this.isDropdown || this.readOnly\"\n        [igxTextSelection]=\"this.isDropdown && !this.readOnly\" [locale]=\"this.locale\" [attr.aria-expanded]=\"!this.collapsed\"\n        [attr.aria-labelledby]=\"this.label?.id\" aria-haspopup=\"dialog\" aria-autocomplete=\"none\" role=\"combobox\">\n\n    <igx-suffix *ngIf=\"!this.clearComponents.length && this.value\" (click)=\"this.clear()\">\n        <igx-icon>clear</igx-icon>\n    </igx-suffix>\n\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint\">\n        <ng-content select=\"igx-hint,[igxHint]\"></ng-content>\n    </ng-container>\n</igx-input-group>\n", styles: [":host{display:block}\n"], components: [{ type: i2.IgxInputGroupComponent, selector: "igx-input-group", inputs: ["resourceStrings", "suppressInputAutofocus", "type", "theme"] }, { type: i3.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i5.IgxPrefixDirective, selector: "igx-prefix,[igxPrefix]" }, { type: i6.IgxInputDirective, selector: "[igxInput]", inputs: ["value", "disabled", "required"], exportAs: ["igxInput"] }, { type: i7.IgxDateTimeEditorDirective, selector: "[igxDateTimeEditor]", inputs: ["locale", "minValue", "maxValue", "spinLoop", "displayFormat", "igxDateTimeEditor", "value", "spinDelta"], outputs: ["valueChange", "validationFailed"], exportAs: ["igxDateTimeEditor"] }, { type: i8.IgxTextSelectionDirective, selector: "[igxTextSelection]", inputs: ["igxTextSelection"], exportAs: ["igxTextSelection"] }, { type: i9.IgxSuffixDirective, selector: "igx-suffix,[igxSuffix]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDatePickerComponent, decorators: [{
            type: Component,
            args: [{ providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: IgxDatePickerComponent, multi: true },
                        { provide: NG_VALIDATORS, useExisting: IgxDatePickerComponent, multi: true }
                    ], selector: 'igx-date-picker', styles: [':host { display: block; }'], template: "<igx-input-group [displayDensity]=\"this.displayDensity\" [type]=\"this.type\" [suppressInputAutofocus]=\"true\">\n    <igx-prefix *ngIf=\"!this.toggleComponents.length\" (click)=\"this.toggle()\">\n        <igx-icon [title]=\"this.value\n            ? pickerResourceStrings.igx_date_picker_change_date\n            : pickerResourceStrings.igx_date_picker_choose_date\">today</igx-icon>\n    </igx-prefix>\n\n    <input class=\"igx-date-picker__input-date\" [displayValuePipe]=\"this.formatter ? displayValue : null\" igxInput\n        [igxDateTimeEditor]=\"this.inputFormat\" [displayFormat]=\"this.displayFormat\"\n        [minValue]=\"this.minValue\" [maxValue]=\"this.maxValue\" [spinDelta]=\"this.spinDelta\" [spinLoop]=\"this.spinLoop\" \n        [disabled]=\"this.disabled\" [placeholder]=\"this.placeholder\" [readonly]=\"!this.isDropdown || this.readOnly\"\n        [igxTextSelection]=\"this.isDropdown && !this.readOnly\" [locale]=\"this.locale\" [attr.aria-expanded]=\"!this.collapsed\"\n        [attr.aria-labelledby]=\"this.label?.id\" aria-haspopup=\"dialog\" aria-autocomplete=\"none\" role=\"combobox\">\n\n    <igx-suffix *ngIf=\"!this.clearComponents.length && this.value\" (click)=\"this.clear()\">\n        <igx-icon>clear</igx-icon>\n    </igx-suffix>\n\n    <ng-container ngProjectAs=\"[igxLabel]\">\n        <ng-content select=\"[igxLabel]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-prefix\">\n        <ng-content select=\"igx-prefix,[igxPrefix]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-suffix\">\n        <ng-content select=\"igx-suffix,[igxSuffix]\"></ng-content>\n    </ng-container>\n    <ng-container ngProjectAs=\"igx-hint\">\n        <ng-content select=\"igx-hint,[igxHint]\"></ng-content>\n    </ng-container>\n</igx-input-group>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i10.IgxOverlayService, decorators: [{
                    type: Inject,
                    args: [IgxOverlayService]
                }] }, { type: i0.NgModuleRef }, { type: i0.Injector }, { type: i0.Renderer2 }, { type: i1.PlatformUtil }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_INPUT_GROUP_TYPE]
                }] }]; }, propDecorators: { weekStart: [{
                type: Input
            }], hideOutsideDays: [{
                type: Input
            }], displayMonthsCount: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], formatter: [{
                type: Input
            }], headerOrientation: [{
                type: Input
            }], todayButtonLabel: [{
                type: Input
            }], cancelButtonLabel: [{
                type: Input
            }], spinLoop: [{
                type: Input
            }], spinDelta: [{
                type: Input
            }], outlet: [{
                type: Input
            }], id: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.id']
            }], formatViews: [{
                type: Input
            }], disabledDates: [{
                type: Input
            }], specialDates: [{
                type: Input
            }], calendarFormat: [{
                type: Input
            }], value: [{
                type: Input
            }], minValue: [{
                type: Input
            }], maxValue: [{
                type: Input
            }], resourceStrings: [{
                type: Input
            }], readOnly: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], validationFailed: [{
                type: Output
            }], clearComponents: [{
                type: ContentChildren,
                args: [IgxPickerClearComponent]
            }], label: [{
                type: ContentChild,
                args: [IgxLabelDirective]
            }], headerTemplate: [{
                type: ContentChild,
                args: [IgxCalendarHeaderTemplateDirective]
            }], dateTimeEditor: [{
                type: ViewChild,
                args: [IgxDateTimeEditorDirective, { static: true }]
            }], inputGroup: [{
                type: ViewChild,
                args: [IgxInputGroupComponent]
            }], labelDirective: [{
                type: ViewChild,
                args: [IgxLabelDirective]
            }], inputDirective: [{
                type: ViewChild,
                args: [IgxInputDirective]
            }], subheaderTemplate: [{
                type: ContentChild,
                args: [IgxCalendarSubheaderTemplateDirective]
            }], pickerActions: [{
                type: ContentChild,
                args: [IgxPickerActionsDirective]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFDOUMsTUFBTSxFQUFFLFNBQVMsRUFBYyxNQUFNLEVBQUUsWUFBWSxFQUNFLGVBQWUsRUFDcEUsU0FBUyxFQUFhLFFBQVEsRUFDNUMsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNtQixpQkFBaUIsRUFBRSxTQUFTLEVBQ2xELGFBQWEsRUFDaEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQ21CLGtDQUFrQyxFQUFFLHFDQUFxQyxFQUMvRixRQUFRLEVBQUUsY0FBYyxFQUMzQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFDSCxpQkFBaUIsRUFBRSxzQkFBc0IsRUFDekMsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQXFCLGFBQWEsRUFDNUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUUsU0FBUyxFQUFnQixJQUFJLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUNjLGlCQUFpQixFQUFFLHNCQUFzQixFQUMxRCxvQkFBb0IsRUFHdkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVoRSxP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QURYLFlBQVk7dUJBQUMsaUJBQWlCO2dCQUl2QixjQUFjO3NCQURyQixZQUFZO3VCQUFDLGtDQUFrQztnQkFJeEMsY0FBYztzQkFEckIsU0FBUzt1QkFBQywwQkFBMEIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBSS9DLFVBQVU7c0JBRGpCLFNBQVM7dUJBQUMsc0JBQXNCO2dCQUl6QixjQUFjO3NCQURyQixTQUFTO3VCQUFDLGlCQUFpQjtnQkFJcEIsY0FBYztzQkFEckIsU0FBUzt1QkFBQyxpQkFBaUI7Z0JBSXBCLGlCQUFpQjtzQkFEeEIsWUFBWTt1QkFBQyxxQ0FBcUM7Z0JBSTNDLGFBQWE7c0JBRHBCLFlBQVk7dUJBQUMseUJBQXlCO2dCQTRHaEMsU0FBUztzQkFEZixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LFxuICAgIE9uRGVzdHJveSwgT3V0cHV0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEluamVjdCwgSG9zdExpc3RlbmVyLFxuICAgIE5nTW9kdWxlUmVmLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIEluamVjdG9yLCBBZnRlclZpZXdDaGVja2VkLCBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LCBMT0NBTEVfSUQsIFJlbmRlcmVyMiwgT3B0aW9uYWwsIFBpcGVUcmFuc2Zvcm0sIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IsIE5nQ29udHJvbCwgQWJzdHJhY3RDb250cm9sLFxuICAgIE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICAgIElneENhbGVuZGFyQ29tcG9uZW50LCBJZ3hDYWxlbmRhckhlYWRlclRlbXBsYXRlRGlyZWN0aXZlLCBJZ3hDYWxlbmRhclN1YmhlYWRlclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIFdFRUtEQVlTLCBpc0RhdGVJblJhbmdlcywgSUZvcm1hdHRpbmdWaWV3cywgSUZvcm1hdHRpbmdPcHRpb25zXG59IGZyb20gJy4uL2NhbGVuZGFyL3B1YmxpY19hcGknO1xuaW1wb3J0IHtcbiAgICBJZ3hJbnB1dERpcmVjdGl2ZSwgSWd4SW5wdXRHcm91cENvbXBvbmVudCxcbiAgICBJZ3hMYWJlbERpcmVjdGl2ZSwgSUdYX0lOUFVUX0dST1VQX1RZUEUsIElneElucHV0R3JvdXBUeXBlLCBJZ3hJbnB1dFN0YXRlXG59IGZyb20gJy4uL2lucHV0LWdyb3VwL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJzY3JpcHRpb24sIG5vb3AsIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy90b2dnbGUvdG9nZ2xlLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1xuICAgIE92ZXJsYXlTZXR0aW5ncywgSWd4T3ZlcmxheVNlcnZpY2UsIEFic29sdXRlU2Nyb2xsU3RyYXRlZ3ksXG4gICAgQXV0b1Bvc2l0aW9uU3RyYXRlZ3ksXG4gICAgT3ZlcmxheUNhbmNlbGFibGVFdmVudEFyZ3MsXG4gICAgT3ZlcmxheUV2ZW50QXJnc1xufSBmcm9tICcuLi9zZXJ2aWNlcy9wdWJsaWNfYXBpJztcbmltcG9ydCB7IEN1cnJlbnRSZXNvdXJjZVN0cmluZ3MgfSBmcm9tICcuLi9jb3JlL2kxOG4vcmVzb3VyY2VzJztcbmltcG9ydCB7IElEYXRlUGlja2VyUmVzb3VyY2VTdHJpbmdzIH0gZnJvbSAnLi4vY29yZS9pMThuL2RhdGUtcGlja2VyLXJlc291cmNlcyc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VEZXNjcmlwdG9yLCBEYXRlUmFuZ2VUeXBlIH0gZnJvbSAnLi4vY29yZS9kYXRlcy9kYXRlUmFuZ2UnO1xuaW1wb3J0IHsgSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncywgUGxhdGZvcm1VdGlsLCBpc0RhdGUgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneENhbGVuZGFyQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vZGF0ZS1jb21tb24vY2FsZW5kYXItY29udGFpbmVyL2NhbGVuZGFyLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgZmFkZUluLCBmYWRlT3V0IH0gZnJvbSAnLi4vYW5pbWF0aW9ucy9mYWRlJztcbmltcG9ydCB7IFBpY2tlckJhc2VEaXJlY3RpdmUgfSBmcm9tICcuLi9kYXRlLWNvbW1vbi9waWNrZXItYmFzZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5pbXBvcnQgeyBEYXRlUGFydCwgRGF0ZVBhcnREZWx0YXMsIElneERhdGVUaW1lRWRpdG9yRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9kYXRlLXRpbWUtZWRpdG9yL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgRGF0ZVRpbWVVdGlsIH0gZnJvbSAnLi4vZGF0ZS1jb21tb24vdXRpbC9kYXRlLXRpbWUudXRpbCc7XG5pbXBvcnQgeyBQaWNrZXJIZWFkZXJPcmllbnRhdGlvbiBhcyBQaWNrZXJIZWFkZXJPcmllbnRhdGlvbiB9IGZyb20gJy4uL2RhdGUtY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IElEYXRlUGlja2VyVmFsaWRhdGlvbkZhaWxlZEV2ZW50QXJncyB9IGZyb20gJy4vZGF0ZS1waWNrZXIuY29tbW9uJztcbmltcG9ydCB7IElneFBpY2tlckNsZWFyQ29tcG9uZW50LCBJZ3hQaWNrZXJBY3Rpb25zRGlyZWN0aXZlIH0gZnJvbSAnLi4vZGF0ZS1jb21tb24vcHVibGljX2FwaSc7XG5cbmxldCBORVhUX0lEID0gMDtcblxuLyoqXG4gKiBEYXRlIFBpY2tlciBkaXNwbGF5cyBhIHBvcHVwIGNhbGVuZGFyIHRoYXQgbGV0cyB1c2VycyBzZWxlY3QgYSBzaW5nbGUgZGF0ZS5cbiAqXG4gKiBAaWd4TW9kdWxlIElneERhdGVQaWNrZXJNb2R1bGVcbiAqIEBpZ3hUaGVtZSBpZ3gtY2FsZW5kYXItdGhlbWUsIGlneC1pY29uLXRoZW1lXG4gKiBAaWd4R3JvdXAgU2NoZWR1bGluZ1xuICogQGlneEtleXdvcmRzIGRhdGVwaWNrZXIsIGNhbGVuZGFyLCBzY2hlZHVsZSwgZGF0ZVxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtZGF0ZS1waWNrZXIgWyhuZ01vZGVsKV09XCJzZWxlY3RlZERhdGVcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IElneERhdGVQaWNrZXJDb21wb25lbnQsIG11bHRpOiB0cnVlIH0sXG4gICAgICAgIHsgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IElneERhdGVQaWNrZXJDb21wb25lbnQsIG11bHRpOiB0cnVlIH1cbiAgICBdLFxuICAgIHNlbGVjdG9yOiAnaWd4LWRhdGUtcGlja2VyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2RhdGUtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFsnOmhvc3QgeyBkaXNwbGF5OiBibG9jazsgfSddXG59KVxuZXhwb3J0IGNsYXNzIElneERhdGVQaWNrZXJDb21wb25lbnQgZXh0ZW5kcyBQaWNrZXJCYXNlRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvcixcbiAgICBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3Q2hlY2tlZCB7XG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIG9uIHdoaWNoIGRheSB0aGUgd2VlayBzdGFydHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFt3ZWVrU3RhcnRdPVwiNFwiIGNhbmNlbEJ1dHRvbkxhYmVsPVwiY2FuY2VsXCIgdG9kYXlCdXR0b25MYWJlbD1cInRvZGF5XCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgd2Vla1N0YXJ0OiBXRUVLREFZUyB8IG51bWJlciA9IFdFRUtEQVlTLlNVTkRBWTtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB3aGV0aGVyIHRoZSBpbmFjdGl2ZSBkYXRlcyB3aWxsIGJlIGhpZGRlbi5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogQXBwbGllcyB0byBkYXRlcyB0aGF0IGFyZSBvdXQgb2YgdGhlIGN1cnJlbnQgbW9udGguXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgW2hpZGVPdXRzaWRlRGF5c109XCJ0cnVlXCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGhpZGVPdXRzaWRlRGF5cyA9IHRoaXMuZGF0ZVBpY2tlci5oaWRlT3V0c2lkZURheXM7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGlkZU91dHNpZGVEYXlzOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBudW1iZXIgb2YgbW9udGggdmlld3MgZGlzcGxheWVkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGAxYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgW2Rpc3BsYXlNb250aHNDb3VudF09XCIyXCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IG1vbnRoVmlld3NEaXNwbGF5ZWQgPSB0aGlzLmRhdGVQaWNrZXIuZGlzcGxheU1vbnRoc0NvdW50O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc3BsYXlNb250aHNDb3VudCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBTaG93L2hpZGUgd2VlayBudW1iZXJzXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFtzaG93V2Vla051bWJlcnNdPVwidHJ1ZVwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIGEgY3VzdG9tIGZvcm1hdHRlciBmdW5jdGlvbiBvbiB0aGUgc2VsZWN0ZWQgb3IgcGFzc2VkIGRhdGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFt2YWx1ZV09XCJkYXRlXCIgW2Zvcm1hdHRlcl09XCJmb3JtYXR0ZXJcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmb3JtYXR0ZXI6ICh2YWw6IERhdGUpID0+IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGBJZ3hEYXRlUGlja2VyQ29tcG9uZW50YCBoZWFkZXIuXG4gICAgICpcbiAgICAgKiAgQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciBoZWFkZXJPcmllbnRhdGlvbj1cInZlcnRpY2FsXCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGVhZGVyT3JpZW50YXRpb246IFBpY2tlckhlYWRlck9yaWVudGF0aW9uID0gUGlja2VySGVhZGVyT3JpZW50YXRpb24uSG9yaXpvbnRhbDtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgdG9kYXkgYnV0dG9uJ3MgbGFiZWwuXG4gICAgICpcbiAgICAgKiAgQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciB0b2RheUJ1dHRvbkxhYmVsPVwiVG9kYXlcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0b2RheUJ1dHRvbkxhYmVsOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGNhbmNlbCBidXR0b24ncyBsYWJlbC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgY2FuY2VsQnV0dG9uTGFiZWw9XCJDYW5jZWxcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjYW5jZWxCdXR0b25MYWJlbDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmeSBpZiB0aGUgY3VycmVudGx5IHNwdW4gZGF0ZSBzZWdtZW50IHNob3VsZCBsb29wIG92ZXIuXG4gICAgICpcbiAgICAgKiAgQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciBbc3Bpbkxvb3BdPVwiZmFsc2VcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzcGluTG9vcCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBEZWx0YSB2YWx1ZXMgdXNlZCB0byBpbmNyZW1lbnQgb3IgZGVjcmVtZW50IGVhY2ggZWRpdG9yIGRhdGUgcGFydCBvbiBzcGluIGFjdGlvbnMuXG4gICAgICogQWxsIHZhbHVlcyBkZWZhdWx0IHRvIGAxYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgW3NwaW5EZWx0YV09XCJ7IGRhdGU6IDUsIG1vbnRoOiAyIH1cIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzcGluRGVsdGE6IFBpY2s8RGF0ZVBhcnREZWx0YXMsICdkYXRlJyB8ICdtb250aCcgfCAneWVhcic+O1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBjb250YWluZXIgdXNlZCBmb3IgdGhlIHBvcHVwIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqICBgb3V0bGV0YCBpcyBhbiBpbnN0YW5jZSBvZiBgSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZWAgb3IgYW4gYEVsZW1lbnRSZWZgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgaWd4T3ZlcmxheU91dGxldCAjb3V0bGV0PVwib3ZlcmxheS1vdXRsZXRcIj48L2Rpdj5cbiAgICAgKiAvLy4uXG4gICAgICogPGlneC1kYXRlLXBpY2tlciBbb3V0bGV0XT1cIm91dGxldFwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIC8vLi5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBvdXRsZXQ6IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmUgfCBFbGVtZW50UmVmO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSB2YWx1ZSBvZiBgaWRgIGF0dHJpYnV0ZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzIElmIG5vdCBwcm92aWRlZCBpdCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgW2lkXT1cIidpZ3gtZGF0ZS1waWNrZXItMydcIiBjYW5jZWxCdXR0b25MYWJlbD1cImNhbmNlbFwiIHRvZGF5QnV0dG9uTGFiZWw9XCJ0b2RheVwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBwdWJsaWMgaWQgPSBgaWd4LWRhdGUtcGlja2VyLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvLyNyZWdpb24gY2FsZW5kYXIgbWVtYmVyc1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBmb3JtYXQgdmlld3Mgb2YgdGhlIGBJZ3hEYXRlUGlja2VyQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBmb3JtYXRWaWV3cyA9IHRoaXMuZGF0ZVBpY2tlci5mb3JtYXRWaWV3cztcbiAgICAgKiAgdGhpcy5kYXRlUGlja2VyLmZvcm1hdFZpZXdzID0ge2RheTpmYWxzZSwgbW9udGg6IGZhbHNlLCB5ZWFyOmZhbHNlfTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBmb3JtYXRWaWV3czogSUZvcm1hdHRpbmdWaWV3cztcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgZGlzYWJsZWQgZGF0ZXMgZGVzY3JpcHRvcnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZGlzYWJsZWREYXRlcyA9IHRoaXMuZGF0ZXBpY2tlci5kaXNhYmxlZERhdGVzO1xuICAgICAqIHRoaXMuZGF0ZVBpY2tlci5kaXNhYmxlZERhdGVzID0gWyB7dHlwZTogRGF0ZVJhbmdlVHlwZS5XZWVrZW5kc30sIC4uLl07XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGRpc2FibGVkRGF0ZXMoKTogRGF0ZVJhbmdlRGVzY3JpcHRvcltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkRGF0ZXM7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgZGlzYWJsZWREYXRlcyh2YWx1ZTogRGF0ZVJhbmdlRGVzY3JpcHRvcltdKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVkRGF0ZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fb25WYWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIHNwZWNpYWwgZGF0ZXMgZGVzY3JpcHRvcnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgc3BlY2lhbERhdGVzID0gdGhpcy5kYXRlcGlja2VyLnNwZWNpYWxEYXRlcztcbiAgICAgKiB0aGlzLmRhdGVQaWNrZXIuc3BlY2lhbERhdGVzID0gWyB7dHlwZTogRGF0ZVJhbmdlVHlwZS5XZWVrZW5kc30sIC4uLiBdO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzcGVjaWFsRGF0ZXMoKTogRGF0ZVJhbmdlRGVzY3JpcHRvcltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwZWNpYWxEYXRlcztcbiAgICB9XG4gICAgcHVibGljIHNldCBzcGVjaWFsRGF0ZXModmFsdWU6IERhdGVSYW5nZURlc2NyaXB0b3JbXSkge1xuICAgICAgICB0aGlzLl9zcGVjaWFsRGF0ZXMgPSB2YWx1ZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgZm9ybWF0IG9wdGlvbnMgb2YgdGhlIGBJZ3hEYXRlUGlja2VyQ29tcG9uZW50YC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZGF0ZVBpY2tlci5jYWxlbmRhckZvcm1hdCA9IHtkYXk6IFwibnVtZXJpY1wiLCAgbW9udGg6IFwibG9uZ1wiLCB3ZWVrZGF5OiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCJ9O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNhbGVuZGFyRm9ybWF0OiBJRm9ybWF0dGluZ09wdGlvbnM7XG5cbiAgICAvLyNlbmRyZWdpb25cblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICAgKlxuICAgICAqICBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFt2YWx1ZV09XCJkYXRlXCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IERhdGUgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgdmFsdWUoZGF0ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IGRhdGU7XG4gICAgICAgIHRoaXMuc2V0RGF0ZVZhbHVlKGRhdGUpO1xuICAgICAgICBpZiAodGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZSAhPT0gZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZSA9IHRoaXMuX2RhdGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5kYXRlVmFsdWUpO1xuICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHRoaXMuZGF0ZVZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWluaW11bSB2YWx1ZSB0aGUgcGlja2VyIHdpbGwgYWNjZXB0LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFttaW5WYWx1ZV09XCJtaW5EYXRlXCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IG1pblZhbHVlKHZhbHVlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX21pblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX29uVmFsaWRhdG9yQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBtaW5WYWx1ZSgpOiBEYXRlIHwgc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pblZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIHZhbHVlIHRoZSBwaWNrZXIgd2lsbCBhY2NlcHQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgW21heFZhbHVlXT1cIm1heERhdGVcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgbWF4VmFsdWUodmFsdWU6IERhdGUgfCBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbWF4VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fb25WYWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG1heFZhbHVlKCk6IERhdGUgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4VmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzIGZvciB0aGUgcGlja2VyJ3MgZGVmYXVsdCB0b2dnbGUgaWNvbi5cbiAgICAgKiBCeSBkZWZhdWx0IGl0IHVzZXMgRU4gcmVzb3VyY2VzLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJlc291cmNlU3RyaW5nczogSURhdGVQaWNrZXJSZXNvdXJjZVN0cmluZ3M7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZWFkT25seSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBwaWNrZXIncyB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBVc2VkIGZvciBgdHdvLXdheWAgYmluZGluZ3MuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFsodmFsdWUpXT1cImRhdGVcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGU+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gdGhlIHVzZXIgdHlwZXMvc3BpbnMgaW52YWxpZCBkYXRlIGluIHRoZSBkYXRlLXBpY2tlciBlZGl0b3IuXG4gICAgICpcbiAgICAgKiAgQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciAodmFsaWRhdGlvbkZhaWxlZCk9XCJvblZhbGlkYXRpb25GYWlsZWQoJGV2ZW50KVwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB2YWxpZGF0aW9uRmFpbGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJRGF0ZVBpY2tlclZhbGlkYXRpb25GYWlsZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFBpY2tlckNsZWFyQ29tcG9uZW50KVxuICAgIHB1YmxpYyBjbGVhckNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxJZ3hQaWNrZXJDbGVhckNvbXBvbmVudD47XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkKElneExhYmVsRGlyZWN0aXZlKVxuICAgIHB1YmxpYyBsYWJlbDogSWd4TGFiZWxEaXJlY3RpdmU7XG5cbiAgICBAQ29udGVudENoaWxkKElneENhbGVuZGFySGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUpXG4gICAgcHJpdmF0ZSBoZWFkZXJUZW1wbGF0ZTogSWd4Q2FsZW5kYXJIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIEBWaWV3Q2hpbGQoSWd4RGF0ZVRpbWVFZGl0b3JEaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJpdmF0ZSBkYXRlVGltZUVkaXRvcjogSWd4RGF0ZVRpbWVFZGl0b3JEaXJlY3RpdmU7XG5cbiAgICBAVmlld0NoaWxkKElneElucHV0R3JvdXBDb21wb25lbnQpXG4gICAgcHJpdmF0ZSBpbnB1dEdyb3VwOiBJZ3hJbnB1dEdyb3VwQ29tcG9uZW50O1xuXG4gICAgQFZpZXdDaGlsZChJZ3hMYWJlbERpcmVjdGl2ZSlcbiAgICBwcml2YXRlIGxhYmVsRGlyZWN0aXZlOiBJZ3hMYWJlbERpcmVjdGl2ZTtcblxuICAgIEBWaWV3Q2hpbGQoSWd4SW5wdXREaXJlY3RpdmUpXG4gICAgcHJpdmF0ZSBpbnB1dERpcmVjdGl2ZTogSWd4SW5wdXREaXJlY3RpdmU7XG5cbiAgICBAQ29udGVudENoaWxkKElneENhbGVuZGFyU3ViaGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUpXG4gICAgcHJpdmF0ZSBzdWJoZWFkZXJUZW1wbGF0ZTogSWd4Q2FsZW5kYXJTdWJoZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIEBDb250ZW50Q2hpbGQoSWd4UGlja2VyQWN0aW9uc0RpcmVjdGl2ZSlcbiAgICBwcml2YXRlIHBpY2tlckFjdGlvbnM6IElneFBpY2tlckFjdGlvbnNEaXJlY3RpdmU7XG5cbiAgICBwcml2YXRlIGdldCBkaWFsb2dPdmVybGF5U2V0dGluZ3MoKTogT3ZlcmxheVNldHRpbmdzIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2RpYWxvZ092ZXJsYXlTZXR0aW5ncywgdGhpcy5vdmVybGF5U2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRyb3BEb3duT3ZlcmxheVNldHRpbmdzKCk6IE92ZXJsYXlTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kcm9wRG93bk92ZXJsYXlTZXR0aW5ncywgdGhpcy5vdmVybGF5U2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGlucHV0R3JvdXBFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRHcm91cD8uZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGRhdGVWYWx1ZSgpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGVWYWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBwaWNrZXJGb3JtYXRWaWV3cygpOiBJRm9ybWF0dGluZ1ZpZXdzIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2RlZkZvcm1hdFZpZXdzLCB0aGlzLmZvcm1hdFZpZXdzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBwaWNrZXJDYWxlbmRhckZvcm1hdCgpOiBJRm9ybWF0dGluZ09wdGlvbnMge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fY2FsZW5kYXJGb3JtYXQsIHRoaXMuY2FsZW5kYXJGb3JtYXQpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBkaXNwbGF5VmFsdWU6IFBpcGVUcmFuc2Zvcm0gPSB7IHRyYW5zZm9ybTogKGRhdGU6IERhdGUpID0+IHRoaXMuZm9ybWF0dGVyKGRhdGUpIH07XG5cbiAgICBwcml2YXRlIF9yZXNvdXJjZVN0cmluZ3MgPSBDdXJyZW50UmVzb3VyY2VTdHJpbmdzLkRhdGVQaWNrZXJSZXNvdXJjZVN0cmluZ3M7XG4gICAgcHJpdmF0ZSBfZGF0ZVZhbHVlOiBEYXRlO1xuICAgIHByaXZhdGUgX292ZXJsYXlJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgX3ZhbHVlOiBEYXRlIHwgc3RyaW5nO1xuICAgIHByaXZhdGUgX3RhcmdldFZpZXdEYXRlOiBEYXRlO1xuICAgIHByaXZhdGUgX25nQ29udHJvbDogTmdDb250cm9sID0gbnVsbDtcbiAgICBwcml2YXRlIF9zdGF0dXNDaGFuZ2VzJDogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgX2NhbGVuZGFyOiBJZ3hDYWxlbmRhckNvbXBvbmVudDtcbiAgICBwcml2YXRlIF9zcGVjaWFsRGF0ZXM6IERhdGVSYW5nZURlc2NyaXB0b3JbXSA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGlzYWJsZWREYXRlczogRGF0ZVJhbmdlRGVzY3JpcHRvcltdID0gbnVsbDtcbiAgICBwcml2YXRlIF9vdmVybGF5U3ViRmlsdGVyOlxuICAgICAgICBbTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPE92ZXJsYXlFdmVudEFyZ3M+LFxuICAgICAgICAgICAgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPE92ZXJsYXlFdmVudEFyZ3MgfCBPdmVybGF5Q2FuY2VsYWJsZUV2ZW50QXJncz5dID0gW1xuICAgICAgICAgICAgZmlsdGVyKHggPT4geC5pZCA9PT0gdGhpcy5fb3ZlcmxheUlkKSxcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JClcbiAgICAgICAgXTtcbiAgICBwcml2YXRlIF9kcm9wRG93bk92ZXJsYXlTZXR0aW5nczogT3ZlcmxheVNldHRpbmdzID0ge1xuICAgICAgICB0YXJnZXQ6IHRoaXMuaW5wdXRHcm91cEVsZW1lbnQsXG4gICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgICAgIG1vZGFsOiBmYWxzZSxcbiAgICAgICAgY2xvc2VPbkVzY2FwZTogdHJ1ZSxcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IG5ldyBBYnNvbHV0ZVNjcm9sbFN0cmF0ZWd5KCksXG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IG5ldyBBdXRvUG9zaXRpb25TdHJhdGVneSh7XG4gICAgICAgICAgICBvcGVuQW5pbWF0aW9uOiBmYWRlSW4sXG4gICAgICAgICAgICBjbG9zZUFuaW1hdGlvbjogZmFkZU91dFxuICAgICAgICB9KVxuICAgIH07XG4gICAgcHJpdmF0ZSBfZGlhbG9nT3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3MgPSB7XG4gICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IHRydWUsXG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICBjbG9zZU9uRXNjYXBlOiB0cnVlXG4gICAgfTtcbiAgICBwcml2YXRlIF9jYWxlbmRhckZvcm1hdDogSUZvcm1hdHRpbmdPcHRpb25zID0ge1xuICAgICAgICBkYXk6ICdudW1lcmljJyxcbiAgICAgICAgbW9udGg6ICdzaG9ydCcsXG4gICAgICAgIHdlZWtkYXk6ICdzaG9ydCcsXG4gICAgICAgIHllYXI6ICdudW1lcmljJ1xuICAgIH07XG4gICAgcHJpdmF0ZSBfZGVmRm9ybWF0Vmlld3M6IElGb3JtYXR0aW5nVmlld3MgPSB7XG4gICAgICAgIGRheTogZmFsc2UsXG4gICAgICAgIG1vbnRoOiB0cnVlLFxuICAgICAgICB5ZWFyOiBmYWxzZVxuICAgIH07XG4gICAgcHJpdmF0ZSBfb25DaGFuZ2VDYWxsYmFjazogKF86IERhdGUpID0+IHZvaWQgPSBub29wO1xuICAgIHByaXZhdGUgX29uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gbm9vcDtcbiAgICBwcml2YXRlIF9vblZhbGlkYXRvckNoYW5nZTogKCkgPT4gdm9pZCA9IG5vb3A7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcm90ZWN0ZWQgX2xvY2FsZUlkOiBzdHJpbmcsXG4gICAgICAgIEBJbmplY3QoSWd4T3ZlcmxheVNlcnZpY2UpIHByaXZhdGUgX292ZXJsYXlTZXJ2aWNlOiBJZ3hPdmVybGF5U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBfbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+LFxuICAgICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCxcbiAgICAgICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERpc3BsYXlEZW5zaXR5VG9rZW4pIHByb3RlY3RlZCBfZGlzcGxheURlbnNpdHlPcHRpb25zPzogSURpc3BsYXlEZW5zaXR5T3B0aW9ucyxcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChJR1hfSU5QVVRfR1JPVVBfVFlQRSkgcHJvdGVjdGVkIF9pbnB1dEdyb3VwVHlwZT86IElneElucHV0R3JvdXBUeXBlKSB7XG4gICAgICAgIHN1cGVyKGVsZW1lbnQsIF9sb2NhbGVJZCwgX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucywgX2lucHV0R3JvdXBUeXBlKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fbmdDb250cm9sICYmIHRoaXMuX25nQ29udHJvbC5jb250cm9sICYmIHRoaXMuX25nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvcikge1xuICAgICAgICAgICAgLy8gUnVuIHRoZSB2YWxpZGF0aW9uIHdpdGggZW1wdHkgb2JqZWN0IHRvIGNoZWNrIGlmIHJlcXVpcmVkIGlzIGVuYWJsZWQuXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMuX25nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvcih7fSBhcyBBYnN0cmFjdENvbnRyb2wpO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yICYmIGVycm9yLnJlcXVpcmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgcGlja2VyUmVzb3VyY2VTdHJpbmdzKCk6IElEYXRlUGlja2VyUmVzb3VyY2VTdHJpbmdzIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Jlc291cmNlU3RyaW5ncywgdGhpcy5yZXNvdXJjZVN0cmluZ3MpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQVJST1dfVVA6XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmFsdEtleSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnBsYXRmb3JtLktFWU1BUC5BUlJPV19ET1dOOlxuICAgICAgICAgICAgICAgIGlmIChldmVudC5hbHRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0aGlzLnBsYXRmb3JtLktFWU1BUC5TUEFDRTpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgdGhlIHBpY2tlcidzIGRyb3Bkb3duIG9yIGRpYWxvZy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgI3BpY2tlcj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKlxuICAgICAqIDxidXR0b24gKGNsaWNrKT1cInBpY2tlci5vcGVuKClcIj5PcGVuIERpYWxvZzwvYnV0dG9uPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKHNldHRpbmdzPzogT3ZlcmxheVNldHRpbmdzKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jb2xsYXBzZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3ZlcmxheVNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5pc0Ryb3Bkb3duXG4gICAgICAgICAgICA/IHRoaXMuZHJvcERvd25PdmVybGF5U2V0dGluZ3NcbiAgICAgICAgICAgIDogdGhpcy5kaWFsb2dPdmVybGF5U2V0dGluZ3NcbiAgICAgICAgICAgICwgc2V0dGluZ3MpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzRHJvcGRvd24gJiYgdGhpcy5pbnB1dEdyb3VwRWxlbWVudCkge1xuICAgICAgICAgICAgb3ZlcmxheVNldHRpbmdzLnRhcmdldCA9IHRoaXMuaW5wdXRHcm91cEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3V0bGV0KSB7XG4gICAgICAgICAgICBvdmVybGF5U2V0dGluZ3Mub3V0bGV0ID0gdGhpcy5vdXRsZXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vdmVybGF5SWQgPSB0aGlzLl9vdmVybGF5U2VydmljZVxuICAgICAgICAgICAgLmF0dGFjaChJZ3hDYWxlbmRhckNvbnRhaW5lckNvbXBvbmVudCwgb3ZlcmxheVNldHRpbmdzLCB0aGlzLl9tb2R1bGVSZWYpO1xuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5zaG93KHRoaXMuX292ZXJsYXlJZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgcGlja2VyJ3MgZHJvcGRvd24gb3IgZGlhbG9nXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyICNwaWNrZXI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICpcbiAgICAgKiA8YnV0dG9uIChjbGljayk9XCJwaWNrZXIudG9nZ2xlKClcIj5Ub2dnbGUgRGlhbG9nPC9idXR0b24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZShzZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbihzZXR0aW5ncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIHBpY2tlcidzIGRyb3Bkb3duIG9yIGRpYWxvZy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgI3BpY2tlcj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKlxuICAgICAqIDxidXR0b24gKGNsaWNrKT1cInBpY2tlci5jbG9zZSgpXCI+Q2xvc2UgRGlhbG9nPC9idXR0b24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5oaWRlKHRoaXMuX292ZXJsYXlJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIGEgZGF0ZS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzIFVwZGF0ZXMgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBmaWVsZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZGF0ZVBpY2tlci5zZWxlY3QoZGF0ZSk7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIGRhdGUgcGFzc2VkIGRhdGUgdGhhdCBoYXMgdG8gYmUgc2V0IHRvIHRoZSBjYWxlbmRhci5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0KHZhbHVlOiBEYXRlKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIHRvZGF5J3MgZGF0ZSBhbmQgY2xvc2VzIHRoZSBwaWNrZXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyICNwaWNrZXI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICpcbiAgICAgKiA8YnV0dG9uIChjbGljayk9XCJwaWNrZXIuc2VsZWN0VG9kYXkoKVwiPlNlbGVjdCBUb2RheTwvYnV0dG9uPlxuICAgICAqIGBgYFxuICAgICAqICovXG4gICAgcHVibGljIHNlbGVjdFRvZGF5KCk6IHZvaWQge1xuICAgICAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRvZGF5LnNldEhvdXJzKDApO1xuICAgICAgICB0b2RheS5zZXRNaW51dGVzKDApO1xuICAgICAgICB0b2RheS5zZXRTZWNvbmRzKDApO1xuICAgICAgICB0b2RheS5zZXRNaWxsaXNlY29uZHMoMCk7XG4gICAgICAgIHRoaXMuc2VsZWN0KHRvZGF5KTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFycyB0aGUgaW5wdXQgZmllbGQgYW5kIHRoZSBwaWNrZXIncyB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMuZGF0ZVBpY2tlci5jbGVhcigpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhcj8uZGVzZWxlY3REYXRlKCk7XG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbmNyZW1lbnQgYSBzcGVjaWZpZWQgYERhdGVQYXJ0YC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRlUGFydCBUaGUgb3B0aW9uYWwgRGF0ZVBhcnQgdG8gaW5jcmVtZW50LiBEZWZhdWx0cyB0byBEYXRlLlxuICAgICAqIEBwYXJhbSBkZWx0YSBUaGUgb3B0aW9uYWwgZGVsdGEgdG8gaW5jcmVtZW50IGJ5LiBPdmVycmlkZXMgYHNwaW5EZWx0YWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5kYXRlUGlja2VyLmluY3JlbWVudChEYXRlUGFydC5EYXRlKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5jcmVtZW50KGRhdGVQYXJ0PzogRGF0ZVBhcnQsIGRlbHRhPzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0ZVRpbWVFZGl0b3IuaW5jcmVtZW50KGRhdGVQYXJ0LCBkZWx0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVjcmVtZW50IGEgc3BlY2lmaWVkIGBEYXRlUGFydGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRlUGFydCBUaGUgb3B0aW9uYWwgRGF0ZVBhcnQgdG8gZGVjcmVtZW50LiBEZWZhdWx0cyB0byBEYXRlLlxuICAgICAqIEBwYXJhbSBkZWx0YSBUaGUgb3B0aW9uYWwgZGVsdGEgdG8gZGVjcmVtZW50IGJ5LiBPdmVycmlkZXMgYHNwaW5EZWx0YWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5kYXRlUGlja2VyLmRlY3JlbWVudChEYXRlUGFydC5EYXRlKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVjcmVtZW50KGRhdGVQYXJ0PzogRGF0ZVBhcnQsIGRlbHRhPzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0ZVRpbWVFZGl0b3IuZGVjcmVtZW50KGRhdGVQYXJ0LCBkZWx0YSk7XG4gICAgfVxuXG4gICAgLy8jcmVnaW9uIENvbnRyb2wgVmFsdWUgQWNjZXNzb3JcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZSh2YWx1ZTogRGF0ZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNldERhdGVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZSA9IHRoaXMuX2RhdGVWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGU/KGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgfVxuICAgIC8vI2VuZHJlZ2lvblxuXG4gICAgLy8jcmVnaW9uIFZhbGlkYXRvclxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fb25WYWxpZGF0b3JDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgICAgICBpZiAoIWNvbnRyb2wudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIEludmFsaWREYXRlIGhhbmRsaW5nXG4gICAgICAgIGlmIChpc0RhdGUoY29udHJvbC52YWx1ZSkgJiYgIURhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHRydWUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHt9O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZShjb250cm9sLnZhbHVlKSA/IGNvbnRyb2wudmFsdWUgOiBEYXRlVGltZVV0aWwucGFyc2VJc29EYXRlKGNvbnRyb2wudmFsdWUpO1xuICAgICAgICBpZiAodmFsdWUgJiYgdGhpcy5kaXNhYmxlZERhdGVzICYmIGlzRGF0ZUluUmFuZ2VzKHZhbHVlLCB0aGlzLmRpc2FibGVkRGF0ZXMpKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGVycm9ycywgeyBkYXRlSXNEaXNhYmxlZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3QuYXNzaWduKGVycm9ycywgRGF0ZVRpbWVVdGlsLnZhbGlkYXRlTWluTWF4KHZhbHVlLCB0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlLCBmYWxzZSkpO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlcnJvcnMpLmxlbmd0aCA+IDAgPyBlcnJvcnMgOiBudWxsO1xuICAgIH1cbiAgICAvLyNlbmRyZWdpb25cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbmdDb250cm9sID0gdGhpcy5faW5qZWN0b3IuZ2V0PE5nQ29udHJvbD4oTmdDb250cm9sLCBudWxsKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUb0NsaWNrKCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG9PdmVybGF5RXZlbnRzKCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG9EYXRlRWRpdG9yRXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5zdWJUb0ljb25zQ2xpY2tlZCh0aGlzLmNsZWFyQ29tcG9uZW50cywgKCkgPT4gdGhpcy5jbGVhcigpKTtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBvbmVudHMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuc3ViVG9JY29uc0NsaWNrZWQodGhpcy5jbGVhckNvbXBvbmVudHMsICgpID0+IHRoaXMuY2xlYXIoKSkpO1xuXG4gICAgICAgIHRoaXMuX2Ryb3BEb3duT3ZlcmxheVNldHRpbmdzLmV4Y2x1ZGVGcm9tT3V0c2lkZUNsaWNrID0gW3RoaXMuaW5wdXRHcm91cC5lbGVtZW50Lm5hdGl2ZUVsZW1lbnRdO1xuXG4gICAgICAgIGZyb21FdmVudCh0aGlzLmlucHV0RGlyZWN0aXZlLm5hdGl2ZUVsZW1lbnQsICdibHVyJylcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWxpZGl0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLl9uZ0NvbnRyb2wpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZXMkID1cbiAgICAgICAgICAgICAgICB0aGlzLl9uZ0NvbnRyb2wuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUodGhpcy5vblN0YXR1c0NoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0R3JvdXAuaXNSZXF1aXJlZCA9IHRoaXMucmVxdWlyZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAodGhpcy5sYWJlbERpcmVjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuaW5wdXREaXJlY3RpdmUubmF0aXZlRWxlbWVudCwgJ2FyaWEtbGFiZWxsZWRieScsIHRoaXMubGFiZWxEaXJlY3RpdmUuaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgICAgICBpZiAodGhpcy5fc3RhdHVzQ2hhbmdlcyQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZXMkLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX292ZXJsYXlJZCkge1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVNlcnZpY2UuZGV0YWNoKHRoaXMuX292ZXJsYXlJZCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fb3ZlcmxheUlkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldEVkaXRFbGVtZW50KCk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dERpcmVjdGl2ZS5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9DbGljaygpIHtcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuZ2V0RWRpdEVsZW1lbnQoKSwgJ2NsaWNrJylcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNEcm9wZG93bikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RGF0ZVZhbHVlKHZhbHVlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgICAgIGlmIChpc0RhdGUodmFsdWUpICYmIGlzTmFOKHZhbHVlLmdldFRpbWUoKSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RhdGVWYWx1ZSA9IERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZSh2YWx1ZSkgPyB2YWx1ZSA6IERhdGVUaW1lVXRpbC5wYXJzZUlzb0RhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVmFsaWRpdHkoKSB7XG4gICAgICAgIC8vIEIuUC4gMTggTWF5IDIwMjE6IElneERhdGVQaWNrZXIgZG9lcyBub3QgcmVzZXQgaXRzIHN0YXRlIHVwb24gcmVzZXRGb3JtICM5NTI2XG4gICAgICAgIGlmICh0aGlzLl9uZ0NvbnRyb2wgJiYgIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5pc1RvdWNoZWRPckRpcnR5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dEdyb3VwLmlzRm9jdXNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXREaXJlY3RpdmUudmFsaWQgPSB0aGlzLl9uZ0NvbnRyb2wudmFsaWRcbiAgICAgICAgICAgICAgICAgICAgPyBJZ3hJbnB1dFN0YXRlLlZBTElEXG4gICAgICAgICAgICAgICAgICAgIDogSWd4SW5wdXRTdGF0ZS5JTlZBTElEO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RGlyZWN0aXZlLnZhbGlkID0gdGhpcy5fbmdDb250cm9sLnZhbGlkXG4gICAgICAgICAgICAgICAgICAgID8gSWd4SW5wdXRTdGF0ZS5JTklUSUFMXG4gICAgICAgICAgICAgICAgICAgIDogSWd4SW5wdXRTdGF0ZS5JTlZBTElEO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnB1dERpcmVjdGl2ZS52YWxpZCA9IElneElucHV0U3RhdGUuSU5JVElBTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGlzVG91Y2hlZE9yRGlydHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5fbmdDb250cm9sLmNvbnRyb2wudG91Y2hlZCB8fCB0aGlzLl9uZ0NvbnRyb2wuY29udHJvbC5kaXJ0eSlcbiAgICAgICAgICAgICYmICghIXRoaXMuX25nQ29udHJvbC5jb250cm9sLnZhbGlkYXRvciB8fCAhIXRoaXMuX25nQ29udHJvbC5jb250cm9sLmFzeW5jVmFsaWRhdG9yKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uU3RhdHVzQ2hhbmdlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVWYWxpZGl0eSgpO1xuICAgICAgICB0aGlzLmlucHV0R3JvdXAuaXNSZXF1aXJlZCA9IHRoaXMucmVxdWlyZWQ7XG4gICAgfTtcblxuICAgIHByaXZhdGUgaGFuZGxlU2VsZWN0aW9uKGRhdGU6IERhdGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0ZVZhbHVlICYmIERhdGVUaW1lVXRpbC5pc1ZhbGlkRGF0ZSh0aGlzLmRhdGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIGRhdGUuc2V0SG91cnModGhpcy5kYXRlVmFsdWUuZ2V0SG91cnMoKSk7XG4gICAgICAgICAgICBkYXRlLnNldE1pbnV0ZXModGhpcy5kYXRlVmFsdWUuZ2V0TWludXRlcygpKTtcbiAgICAgICAgICAgIGRhdGUuc2V0U2Vjb25kcyh0aGlzLmRhdGVWYWx1ZS5nZXRTZWNvbmRzKCkpO1xuICAgICAgICAgICAgZGF0ZS5zZXRNaWxsaXNlY29uZHModGhpcy5kYXRlVmFsdWUuZ2V0TWlsbGlzZWNvbmRzKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlO1xuICAgICAgICB0aGlzLl9jYWxlbmRhci52aWV3RGF0ZSA9IGRhdGU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN1YnNjcmliZVRvRGF0ZUVkaXRvckV2ZW50cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYXRlVGltZUVkaXRvci52YWx1ZUNoYW5nZS5waXBlKFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSkuc3Vic2NyaWJlKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRhdGVUaW1lRWRpdG9yLnZhbGlkYXRpb25GYWlsZWQucGlwZShcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRpb25GYWlsZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBwcmV2VmFsdWU6IGV2ZW50Lm9sZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWU6IHRoaXMudmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9PdmVybGF5RXZlbnRzKCkge1xuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5vcGVuaW5nLnBpcGUoLi4udGhpcy5fb3ZlcmxheVN1YkZpbHRlcikuc3Vic2NyaWJlKChlOiBPdmVybGF5Q2FuY2VsYWJsZUV2ZW50QXJncykgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXJnczogSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyA9IHsgb3duZXI6IHRoaXMsIGV2ZW50OiBlLmV2ZW50LCBjYW5jZWw6IGUuY2FuY2VsIH07XG4gICAgICAgICAgICB0aGlzLm9wZW5pbmcuZW1pdChhcmdzKTtcbiAgICAgICAgICAgIGUuY2FuY2VsID0gYXJncy5jYW5jZWw7XG4gICAgICAgICAgICBpZiAoYXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5kZXRhY2godGhpcy5fb3ZlcmxheUlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVDYWxlbmRhckNvbnRhaW5lcihlLmNvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG4gICAgICAgICAgICB0aGlzLl9jb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fb3ZlcmxheVNlcnZpY2Uub3BlbmVkLnBpcGUoLi4udGhpcy5fb3ZlcmxheVN1YkZpbHRlcikuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub3BlbmVkLmVtaXQoeyBvd25lcjogdGhpcyB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWxlbmRhcj8uZGF5c1ZpZXc/LnNlbGVjdGVkRGF0ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxlbmRhcj8uZGF5c1ZpZXc/LmZvY3VzQWN0aXZlRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl90YXJnZXRWaWV3RGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RhcmdldFZpZXdEYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGVuZGFyPy5kYXlzVmlldz8uZGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoZCA9PiBkLmRhdGUuZGF0ZS5nZXRUaW1lKCkgPT09IHRoaXMuX3RhcmdldFZpZXdEYXRlLmdldFRpbWUoKSk/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fb3ZlcmxheVNlcnZpY2UuY2xvc2luZy5waXBlKC4uLnRoaXMuX292ZXJsYXlTdWJGaWx0ZXIpLnN1YnNjcmliZSgoZTogT3ZlcmxheUNhbmNlbGFibGVFdmVudEFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3M6IElCYXNlQ2FuY2VsYWJsZUJyb3dzZXJFdmVudEFyZ3MgPSB7IG93bmVyOiB0aGlzLCBldmVudDogZS5ldmVudCwgY2FuY2VsOiBlLmNhbmNlbCB9O1xuICAgICAgICAgICAgdGhpcy5jbG9zaW5nLmVtaXQoYXJncyk7XG4gICAgICAgICAgICBlLmNhbmNlbCA9IGFyZ3MuY2FuY2VsO1xuICAgICAgICAgICAgaWYgKGFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG8gbm90IGZvY3VzIHRoZSBpbnB1dCBpZiBjbGlja2luZyBvdXRzaWRlIGluIGRyb3Bkb3duIG1vZGVcbiAgICAgICAgICAgIGlmICh0aGlzLmdldEVkaXRFbGVtZW50KCkgJiYgIShhcmdzLmV2ZW50ICYmIHRoaXMuaXNEcm9wZG93bikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RGlyZWN0aXZlLmZvY3VzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWxpZGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9vdmVybGF5U2VydmljZS5jbG9zZWQucGlwZSguLi50aGlzLl9vdmVybGF5U3ViRmlsdGVyKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCh7IG93bmVyOiB0aGlzIH0pO1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVNlcnZpY2UuZGV0YWNoKHRoaXMuX292ZXJsYXlJZCk7XG4gICAgICAgICAgICB0aGlzLl9jb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUlkID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRNaW5NYXhEYXRlcygpIHtcbiAgICAgICAgY29uc3QgbWluVmFsdWUgPSBEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodGhpcy5taW5WYWx1ZSkgPyB0aGlzLm1pblZhbHVlIDogRGF0ZVRpbWVVdGlsLnBhcnNlSXNvRGF0ZSh0aGlzLm1pblZhbHVlKTtcbiAgICAgICAgY29uc3QgbWF4VmFsdWUgPSBEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogRGF0ZVRpbWVVdGlsLnBhcnNlSXNvRGF0ZSh0aGlzLm1heFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHsgbWluVmFsdWUsIG1heFZhbHVlIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXREaXNhYmxlZERhdGVzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jYWxlbmRhci5kaXNhYmxlZERhdGVzID0gdGhpcy5kaXNhYmxlZERhdGVzID8gWy4uLnRoaXMuZGlzYWJsZWREYXRlc10gOiBbXTtcbiAgICAgICAgY29uc3QgeyBtaW5WYWx1ZSwgbWF4VmFsdWUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZXMoKTtcbiAgICAgICAgaWYgKG1pblZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci5kaXNhYmxlZERhdGVzLnB1c2goeyB0eXBlOiBEYXRlUmFuZ2VUeXBlLkJlZm9yZSwgZGF0ZVJhbmdlOiBbbWluVmFsdWVdIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIuZGlzYWJsZWREYXRlcy5wdXNoKHsgdHlwZTogRGF0ZVJhbmdlVHlwZS5BZnRlciwgZGF0ZVJhbmdlOiBbbWF4VmFsdWVdIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaW5pdGlhbGl6ZUNhbGVuZGFyQ29udGFpbmVyKGNvbXBvbmVudEluc3RhbmNlOiBJZ3hDYWxlbmRhckNvbnRhaW5lckNvbXBvbmVudCkge1xuICAgICAgICB0aGlzLl9jYWxlbmRhciA9IGNvbXBvbmVudEluc3RhbmNlLmNhbGVuZGFyO1xuICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID0gdGhpcy5oZWFkZXJPcmllbnRhdGlvbiA9PT0gUGlja2VySGVhZGVyT3JpZW50YXRpb24uVmVydGljYWw7XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyLmhhc0hlYWRlciA9ICF0aGlzLmlzRHJvcGRvd247XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyLmZvcm1hdE9wdGlvbnMgPSB0aGlzLnBpY2tlckNhbGVuZGFyRm9ybWF0O1xuICAgICAgICB0aGlzLl9jYWxlbmRhci5mb3JtYXRWaWV3cyA9IHRoaXMucGlja2VyRm9ybWF0Vmlld3M7XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyLmxvY2FsZSA9IHRoaXMubG9jYWxlO1xuICAgICAgICB0aGlzLl9jYWxlbmRhci52ZXJ0aWNhbCA9IGlzVmVydGljYWw7XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyLndlZWtTdGFydCA9IHRoaXMud2Vla1N0YXJ0O1xuICAgICAgICB0aGlzLl9jYWxlbmRhci5zcGVjaWFsRGF0ZXMgPSB0aGlzLnNwZWNpYWxEYXRlcztcbiAgICAgICAgdGhpcy5fY2FsZW5kYXIuaGVhZGVyVGVtcGxhdGUgPSB0aGlzLmhlYWRlclRlbXBsYXRlO1xuICAgICAgICB0aGlzLl9jYWxlbmRhci5zdWJoZWFkZXJUZW1wbGF0ZSA9IHRoaXMuc3ViaGVhZGVyVGVtcGxhdGU7XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyLmhpZGVPdXRzaWRlRGF5cyA9IHRoaXMuaGlkZU91dHNpZGVEYXlzO1xuICAgICAgICB0aGlzLl9jYWxlbmRhci5tb250aHNWaWV3TnVtYmVyID0gdGhpcy5kaXNwbGF5TW9udGhzQ291bnQ7XG4gICAgICAgIHRoaXMuX2NhbGVuZGFyLnNob3dXZWVrTnVtYmVycyA9IHRoaXMuc2hvd1dlZWtOdW1iZXJzO1xuICAgICAgICB0aGlzLl9jYWxlbmRhci5zZWxlY3RlZC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpLnN1YnNjcmliZSgoZXY6IERhdGUpID0+IHRoaXMuaGFuZGxlU2VsZWN0aW9uKGV2KSk7XG4gICAgICAgIHRoaXMuc2V0RGlzYWJsZWREYXRlcygpO1xuXG4gICAgICAgIGlmIChEYXRlVGltZVV0aWwuaXNWYWxpZERhdGUodGhpcy5kYXRlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBjYWxlbmRhciB3aWxsIHRocm93IGlmIHRoZSBwaWNrZXIncyB2YWx1ZSBpcyBJbnZhbGlkRGF0ZSAjOTIwOFxuICAgICAgICAgICAgdGhpcy5fY2FsZW5kYXIudmFsdWUgPSB0aGlzLmRhdGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENhbGVuZGFyVmlld0RhdGUoKTtcblxuICAgICAgICBjb21wb25lbnRJbnN0YW5jZS5tb2RlID0gdGhpcy5tb2RlO1xuICAgICAgICBjb21wb25lbnRJbnN0YW5jZS52ZXJ0aWNhbCA9IGlzVmVydGljYWw7XG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLmNsb3NlQnV0dG9uTGFiZWwgPSB0aGlzLmNhbmNlbEJ1dHRvbkxhYmVsO1xuICAgICAgICBjb21wb25lbnRJbnN0YW5jZS50b2RheUJ1dHRvbkxhYmVsID0gdGhpcy50b2RheUJ1dHRvbkxhYmVsO1xuICAgICAgICBjb21wb25lbnRJbnN0YW5jZS5waWNrZXJBY3Rpb25zID0gdGhpcy5waWNrZXJBY3Rpb25zO1xuXG4gICAgICAgIGNvbXBvbmVudEluc3RhbmNlLmNhbGVuZGFyQ2xvc2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICAgICAgY29tcG9uZW50SW5zdGFuY2UudG9kYXlTZWxlY3Rpb24ucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zZWxlY3RUb2RheSgpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldENhbGVuZGFyVmlld0RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgbWluVmFsdWUsIG1heFZhbHVlIH0gPSB0aGlzLmdldE1pbk1heERhdGVzKCk7XG4gICAgICAgIHRoaXMuX2RhdGVWYWx1ZSA9IHRoaXMuZGF0ZVZhbHVlIHx8IG5ldyBEYXRlKCk7XG4gICAgICAgIGlmIChtaW5WYWx1ZSAmJiBEYXRlVGltZVV0aWwubGVzc1RoYW5NaW5WYWx1ZSh0aGlzLmRhdGVWYWx1ZSwgbWluVmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxlbmRhci52aWV3RGF0ZSA9IHRoaXMuX3RhcmdldFZpZXdEYXRlID0gbWluVmFsdWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heFZhbHVlICYmIERhdGVUaW1lVXRpbC5ncmVhdGVyVGhhbk1heFZhbHVlKHRoaXMuZGF0ZVZhbHVlLCBtYXhWYWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGVuZGFyLnZpZXdEYXRlID0gdGhpcy5fdGFyZ2V0Vmlld0RhdGUgPSBtYXhWYWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWxlbmRhci52aWV3RGF0ZSA9IHRoaXMuX3RhcmdldFZpZXdEYXRlID0gdGhpcy5kYXRlVmFsdWU7XG4gICAgfVxufVxuIiwiPGlneC1pbnB1dC1ncm91cCBbZGlzcGxheURlbnNpdHldPVwidGhpcy5kaXNwbGF5RGVuc2l0eVwiIFt0eXBlXT1cInRoaXMudHlwZVwiIFtzdXBwcmVzc0lucHV0QXV0b2ZvY3VzXT1cInRydWVcIj5cbiAgICA8aWd4LXByZWZpeCAqbmdJZj1cIiF0aGlzLnRvZ2dsZUNvbXBvbmVudHMubGVuZ3RoXCIgKGNsaWNrKT1cInRoaXMudG9nZ2xlKClcIj5cbiAgICAgICAgPGlneC1pY29uIFt0aXRsZV09XCJ0aGlzLnZhbHVlXG4gICAgICAgICAgICA/IHBpY2tlclJlc291cmNlU3RyaW5ncy5pZ3hfZGF0ZV9waWNrZXJfY2hhbmdlX2RhdGVcbiAgICAgICAgICAgIDogcGlja2VyUmVzb3VyY2VTdHJpbmdzLmlneF9kYXRlX3BpY2tlcl9jaG9vc2VfZGF0ZVwiPnRvZGF5PC9pZ3gtaWNvbj5cbiAgICA8L2lneC1wcmVmaXg+XG5cbiAgICA8aW5wdXQgY2xhc3M9XCJpZ3gtZGF0ZS1waWNrZXJfX2lucHV0LWRhdGVcIiBbZGlzcGxheVZhbHVlUGlwZV09XCJ0aGlzLmZvcm1hdHRlciA/IGRpc3BsYXlWYWx1ZSA6IG51bGxcIiBpZ3hJbnB1dFxuICAgICAgICBbaWd4RGF0ZVRpbWVFZGl0b3JdPVwidGhpcy5pbnB1dEZvcm1hdFwiIFtkaXNwbGF5Rm9ybWF0XT1cInRoaXMuZGlzcGxheUZvcm1hdFwiXG4gICAgICAgIFttaW5WYWx1ZV09XCJ0aGlzLm1pblZhbHVlXCIgW21heFZhbHVlXT1cInRoaXMubWF4VmFsdWVcIiBbc3BpbkRlbHRhXT1cInRoaXMuc3BpbkRlbHRhXCIgW3NwaW5Mb29wXT1cInRoaXMuc3Bpbkxvb3BcIiBcbiAgICAgICAgW2Rpc2FibGVkXT1cInRoaXMuZGlzYWJsZWRcIiBbcGxhY2Vob2xkZXJdPVwidGhpcy5wbGFjZWhvbGRlclwiIFtyZWFkb25seV09XCIhdGhpcy5pc0Ryb3Bkb3duIHx8IHRoaXMucmVhZE9ubHlcIlxuICAgICAgICBbaWd4VGV4dFNlbGVjdGlvbl09XCJ0aGlzLmlzRHJvcGRvd24gJiYgIXRoaXMucmVhZE9ubHlcIiBbbG9jYWxlXT1cInRoaXMubG9jYWxlXCIgW2F0dHIuYXJpYS1leHBhbmRlZF09XCIhdGhpcy5jb2xsYXBzZWRcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwidGhpcy5sYWJlbD8uaWRcIiBhcmlhLWhhc3BvcHVwPVwiZGlhbG9nXCIgYXJpYS1hdXRvY29tcGxldGU9XCJub25lXCIgcm9sZT1cImNvbWJvYm94XCI+XG5cbiAgICA8aWd4LXN1ZmZpeCAqbmdJZj1cIiF0aGlzLmNsZWFyQ29tcG9uZW50cy5sZW5ndGggJiYgdGhpcy52YWx1ZVwiIChjbGljayk9XCJ0aGlzLmNsZWFyKClcIj5cbiAgICAgICAgPGlneC1pY29uPmNsZWFyPC9pZ3gtaWNvbj5cbiAgICA8L2lneC1zdWZmaXg+XG5cbiAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiW2lneExhYmVsXVwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbaWd4TGFiZWxdXCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgbmdQcm9qZWN0QXM9XCJpZ3gtcHJlZml4XCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1wcmVmaXgsW2lneFByZWZpeF1cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciBuZ1Byb2plY3RBcz1cImlneC1zdWZmaXhcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LXN1ZmZpeCxbaWd4U3VmZml4XVwiPjwvbmctY29udGVudD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyIG5nUHJvamVjdEFzPVwiaWd4LWhpbnRcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LWhpbnQsW2lneEhpbnRdXCI+PC9uZy1jb250ZW50PlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9pZ3gtaW5wdXQtZ3JvdXA+XG4iXX0=