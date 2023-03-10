import { ChangeDetectorRef, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { IgxFilteringService } from '../grid-filtering.service';
import { IgxToggleDirective } from '../../../directives/toggle/toggle.directive';
import { ILogicOperatorChangedArgs } from './excel-style-default-expression.component';
import { DisplayDensity } from '../../../core/density';
import { PlatformUtil } from '../../../core/utils';
import { ExpressionUI } from './common';
import { ColumnType } from '../../common/grid.interface';
import { IgxOverlayService } from '../../../services/overlay/overlay';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare class IgxExcelStyleCustomDialogComponent implements AfterViewInit {
    protected overlayService: IgxOverlayService;
    private cdr;
    protected platform: PlatformUtil;
    expressionsList: ExpressionUI[];
    column: ColumnType;
    selectedOperator: string;
    filteringService: IgxFilteringService;
    overlayComponentId: string;
    displayDensity: DisplayDensity;
    toggle: IgxToggleDirective;
    protected defaultExpressionTemplate: TemplateRef<any>;
    protected dateExpressionTemplate: TemplateRef<any>;
    protected expressionsContainer: ElementRef;
    private expressionComponents;
    private expressionDateComponents;
    private _customDialogPositionSettings;
    private _customDialogOverlaySettings;
    constructor(overlayService: IgxOverlayService, cdr: ChangeDetectorRef, platform: PlatformUtil);
    ngAfterViewInit(): void;
    get template(): TemplateRef<any>;
    get grid(): any;
    onCustomDialogOpening(): void;
    onCustomDialogOpened(): void;
    open(esf: any): void;
    onClearButtonClick(): void;
    closeDialog(): void;
    onApplyButtonClick(): void;
    onAddButtonClick(): void;
    onExpressionRemoved(event: ExpressionUI): void;
    onLogicOperatorChanged(event: ILogicOperatorChangedArgs): void;
    onKeyDown(eventArgs: KeyboardEvent): void;
    onApplyButtonKeyDown(eventArgs: KeyboardEvent): void;
    private createCondition;
    private markChildrenForCheck;
    private createInitialExpressionUIElement;
    private scrollToBottom;
    static ??fac: i0.????FactoryDeclaration<IgxExcelStyleCustomDialogComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxExcelStyleCustomDialogComponent, "igx-excel-style-custom-dialog", never, { "expressionsList": "expressionsList"; "column": "column"; "selectedOperator": "selectedOperator"; "filteringService": "filteringService"; "overlayComponentId": "overlayComponentId"; "displayDensity": "displayDensity"; }, {}, never, never>;
}
