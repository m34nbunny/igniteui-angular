import { AfterViewInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IgxButtonGroupComponent } from '../../../buttonGroup/buttonGroup.component';
import { IFilteringOperation } from '../../../data-operations/filtering-condition';
import { IBaseEventArgs, PlatformUtil } from '../../../core/utils';
import { FilteringLogic } from '../../../data-operations/filtering-expression.interface';
import { DisplayDensity } from '../../../core/density';
import { IgxSelectComponent } from '../../../select/select.component';
import { IgxOverlayOutletDirective } from '../../../directives/toggle/toggle.directive';
import { IgxInputDirective } from '../../../input-group/public_api';
import { ExpressionUI } from './common';
import { ColumnType } from '../../common/grid.interface';
import { OverlaySettings } from '../../../services/overlay/utilities';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export interface ILogicOperatorChangedArgs extends IBaseEventArgs {
    target: ExpressionUI;
    newValue: FilteringLogic;
}
/**
 * @hidden
 */
export declare class IgxExcelStyleDefaultExpressionComponent implements AfterViewInit {
    cdr: ChangeDetectorRef;
    protected platform: PlatformUtil;
    column: ColumnType;
    expressionUI: ExpressionUI;
    expressionsList: Array<ExpressionUI>;
    grid: any;
    displayDensity: DisplayDensity;
    expressionRemoved: EventEmitter<ExpressionUI>;
    logicOperatorChanged: EventEmitter<ILogicOperatorChangedArgs>;
    overlayOutlet: IgxOverlayOutletDirective;
    protected dropdownConditions: IgxSelectComponent;
    protected logicOperatorButtonGroup: IgxButtonGroupComponent;
    protected inputValuesDirective: IgxInputDirective;
    dropDownOverlaySettings: OverlaySettings;
    get isLast(): boolean;
    get isSingle(): boolean;
    get conditionsPlaceholder(): string;
    get inputValuePlaceholder(): string;
    get type(): "text" | "number";
    constructor(cdr: ChangeDetectorRef, platform: PlatformUtil);
    get conditions(): string[];
    protected get inputValuesElement(): HTMLInputElement;
    ngAfterViewInit(): void;
    focus(): void;
    translateCondition(value: string): string;
    getIconName(): string;
    isConditionSelected(conditionName: string): boolean;
    onConditionsChanged(eventArgs: any): void;
    getCondition(value: string): IFilteringOperation;
    getConditionFriendlyName(name: string): string;
    onValuesInput(eventArgs: any): void;
    onLogicOperatorButtonClicked(eventArgs: any, buttonIndex: number): void;
    onLogicOperatorKeyDown(eventArgs: KeyboardEvent, buttonIndex: number): void;
    onRemoveButtonClick(): void;
    onOutletPointerDown(event: any): void;
    static ??fac: i0.????FactoryDeclaration<IgxExcelStyleDefaultExpressionComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxExcelStyleDefaultExpressionComponent, "igx-excel-style-default-expression", never, { "column": "column"; "expressionUI": "expressionUI"; "expressionsList": "expressionsList"; "grid": "grid"; "displayDensity": "displayDensity"; }, { "expressionRemoved": "expressionRemoved"; "logicOperatorChanged": "logicOperatorChanged"; }, never, never>;
}
