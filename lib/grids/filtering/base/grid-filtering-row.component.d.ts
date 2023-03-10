import { AfterViewInit, ChangeDetectorRef, TemplateRef, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { IgxDropDownComponent, ISelectionEventArgs } from '../../../drop-down/public_api';
import { IFilteringOperation } from '../../../data-operations/filtering-condition';
import { IFilteringExpression } from '../../../data-operations/filtering-expression.interface';
import { IBaseChipEventArgs, IgxChipsAreaComponent, IgxChipComponent } from '../../../chips/public_api';
import { IgxFilteringService } from '../grid-filtering.service';
import { IgxDatePickerComponent } from '../../../date-picker/date-picker.component';
import { IgxTimePickerComponent } from '../../../time-picker/time-picker.component';
import { PlatformUtil } from '../../../core/utils';
import { ExpressionUI } from '../excel-style/common';
import { ColumnType } from '../../common/grid.interface';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxGridFilteringRowComponent implements AfterViewInit, OnDestroy {
    filteringService: IgxFilteringService;
    ref: ElementRef<HTMLElement>;
    cdr: ChangeDetectorRef;
    protected platform: PlatformUtil;
    get column(): ColumnType;
    set column(val: ColumnType);
    get value(): any;
    set value(val: any);
    get displayDensity(): "compact" | "cosy";
    defaultCSSClass: boolean;
    get compactCSSClass(): boolean;
    get cosyCSSClass(): boolean;
    protected defaultFilterUI: TemplateRef<any>;
    protected defaultDateUI: TemplateRef<any>;
    protected defaultTimeUI: TemplateRef<any>;
    protected defaultDateTimeUI: TemplateRef<any>;
    protected input: ElementRef<HTMLInputElement>;
    protected dropDownConditions: IgxDropDownComponent;
    protected chipsArea: IgxChipsAreaComponent;
    protected dropDownOperators: QueryList<IgxDropDownComponent>;
    protected inputGroup: ElementRef<HTMLElement>;
    protected picker: IgxDatePickerComponent | IgxTimePickerComponent;
    protected inputGroupPrefix: ElementRef<HTMLElement>;
    protected container: ElementRef<HTMLElement>;
    protected operand: ElementRef<HTMLElement>;
    protected closeButton: ElementRef<HTMLElement>;
    get nativeElement(): HTMLElement;
    showArrows: boolean;
    expression: IFilteringExpression;
    expressionsList: Array<ExpressionUI>;
    private _positionSettings;
    private _conditionsOverlaySettings;
    private _operatorsOverlaySettings;
    private chipsAreaWidth;
    private chipAreaScrollOffset;
    private _column;
    private isKeyPressed;
    private isComposing;
    private _cancelChipClick;
    /** switch to icon buttons when width is below 432px */
    private readonly NARROW_WIDTH_THRESHOLD;
    private $destroyer;
    constructor(filteringService: IgxFilteringService, ref: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, platform: PlatformUtil);
    onKeydownHandler(evt: KeyboardEvent): void;
    ngAfterViewInit(): void;
    get disabled(): boolean;
    get template(): TemplateRef<any>;
    get type(): "text" | "number";
    get conditions(): any;
    get isUnaryCondition(): boolean;
    get placeholder(): string;
    /**
     * Event handler for keydown on the input group's prefix.
     */
    onPrefixKeyDown(event: KeyboardEvent): void;
    /**
     * Event handler for keydown on the input.
     */
    onInputKeyDown(event: KeyboardEvent): void;
    /**
     * Event handler for keyup on the input.
     */
    onInputKeyUp(): void;
    /**
     * Event handler for input on the input.
     */
    onInput(eventArgs: any): void;
    /**
     * Event handler for compositionstart on the input.
     */
    onCompositionStart(): void;
    /**
     * Event handler for compositionend on the input.
     */
    onCompositionEnd(): void;
    /**
     * Event handler for input click event.
     */
    onInputClick(): void;
    /**
     * Returns the filtering operation condition for a given value.
     */
    getCondition(value: string): IFilteringOperation;
    /**
     * Returns the translated condition name for a given value.
     */
    translateCondition(value: string): string;
    /**
     * Returns the icon name of the current condition.
     */
    getIconName(): string;
    /**
     * Returns whether a given condition is selected in dropdown.
     */
    isConditionSelected(conditionName: string): boolean;
    /**
     * Clears the current filtering.
     */
    clearFiltering(): void;
    /**
     * Commits the value of the input.
     */
    commitInput(): void;
    /**
     * Clears the value of the input.
     */
    clearInput(event?: MouseEvent): void;
    /**
     * Event handler for keydown on clear button.
     */
    onClearKeyDown(eventArgs: KeyboardEvent): void;
    /**
     * Event handler for click on clear button.
     */
    onClearClick(): void;
    /**
     * Event handler for keydown on commit button.
     */
    onCommitKeyDown(eventArgs: KeyboardEvent): void;
    /**
     * Event handler for click on commit button.
     */
    onCommitClick(event?: MouseEvent): void;
    /**
     * Event handler for focusout on the input group.
     */
    onInputGroupFocusout(): void;
    /**
     * Closes the filtering edit row.
     */
    close(): void;
    /**
     *  Event handler for date picker's selection.
     */
    onDateSelected(value: Date): void;
    /** @hidden @internal */
    inputGroupPrefixClick(event: MouseEvent): void;
    /**
     * Opens the conditions dropdown.
     */
    toggleConditionsDropDown(target: any): void;
    /**
     * Opens the logic operators dropdown.
     */
    toggleOperatorsDropDown(eventArgs: any, index: any): void;
    /**
     * Event handler for change event in conditions dropdown.
     */
    onConditionsChanged(eventArgs: any): void;
    onChipPointerdown(args: any, chip: IgxChipComponent): void;
    onChipClick(args: any, item: ExpressionUI): void;
    toggleChip(item: ExpressionUI): void;
    /**
     * Event handler for chip keydown event.
     */
    onChipKeyDown(eventArgs: KeyboardEvent, item: ExpressionUI): void;
    /**
     * Scrolls the first chip into view if the tab key is pressed on the left arrow.
     */
    onLeftArrowKeyDown(event: KeyboardEvent): void;
    /**
     * Event handler for chip removed event.
     */
    onChipRemoved(eventArgs: IBaseChipEventArgs, item: ExpressionUI): void;
    /**
     * Event handler for logic operator changed event.
     */
    onLogicOperatorChanged(eventArgs: ISelectionEventArgs, expression: ExpressionUI): void;
    /**
     * Scrolls the chips into the chip area when left or right arrows are pressed.
     */
    scrollChipsOnArrowPress(arrowPosition: string): void;
    /**
     * @hidden
     * Resets the chips area
     * @memberof IgxGridFilteringRowComponent
     */
    resetChipsArea(): void;
    /** @hidden @internal */
    focusEditElement(): void;
    ngOnDestroy(): void;
    private showHideArrowButtons;
    private addExpression;
    private removeExpression;
    private resetExpression;
    private scrollChipsWhenAddingExpression;
    private transform;
    private scrollChipsOnRemove;
    private conditionChangedCallback;
    private unaryConditionChangedCallback;
    private filter;
    private editorsContain;
    private get isColumnFiltered();
    get isNarrowWidth(): boolean;
    static ??fac: i0.????FactoryDeclaration<IgxGridFilteringRowComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxGridFilteringRowComponent, "igx-grid-filtering-row", never, { "column": "column"; "value": "value"; }, {}, never, never>;
}
