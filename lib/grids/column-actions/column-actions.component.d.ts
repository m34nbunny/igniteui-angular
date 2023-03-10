import { DoCheck, EventEmitter, IterableDiffer, IterableDiffers, PipeTransform, QueryList } from '@angular/core';
import { ColumnDisplayOrder } from '../common/enums';
import { ColumnType, GridType } from '../common/grid.interface';
import { IColumnToggledEventArgs } from '../common/events';
import { IgxCheckboxComponent } from '../../checkbox/checkbox.component';
import { IgxColumnActionsBaseDirective } from './column-actions-base.directive';
import * as i0 from "@angular/core";
/**
 * Providing reference to `IgxColumnActionsComponent`:
 * ```typescript
 *  @ViewChild('columnActions', { read: IgxColumnActionsComponent })
 *  public columnActions: IgxColumnActionsComponent;
 */
export declare class IgxColumnActionsComponent implements DoCheck {
    private differs;
    /**
     * Gets/Sets the grid to provide column actions for.
     *
     * @example
     * ```typescript
     * let grid = this.columnActions.grid;
     * ```
     */
    grid: GridType;
    /**
     * Gets/sets the indentation of columns in the column list based on their hierarchy level.
     *
     * @example
     * ```
     * <igx-column-actions [indentation]="15"></igx-column-actions>
     * ```
     */
    indentation: number;
    /**
     * Sets/Gets the css class selector.
     * By default the value of the `class` attribute is `"igx-column-actions"`.
     * ```typescript
     * let cssCLass =  this.columnHidingUI.cssClass;
     * ```
     * ```typescript
     * this.columnHidingUI.cssClass = 'column-chooser';
     * ```
     */
    cssClass: string;
    /**
     * Gets/sets the max height of the columns area.
     *
     * @remarks
     * The default max height is 100%.
     * @example
     * ```html
     * <igx-column-actions [columnsAreaMaxHeight]="200px"></igx-column-actions>
     * ```
     */
    columnsAreaMaxHeight: string;
    /**
     * Shows/hides the columns filtering input from the UI.
     *
     * @example
     * ```html
     *  <igx-column-actions [hideFilter]="true"></igx-column-actions>
     * ```
     */
    hideFilter: boolean;
    /**
     * Gets the checkbox components representing column items currently present in the dropdown
     *
     * @example
     * ```typescript
     * let columnItems =  this.columnActions.columnItems;
     * ```
     */
    columnItems: QueryList<IgxCheckboxComponent>;
    /**
     * Gets/sets the title of the column actions component.
     *
     * @example
     * ```html
     * <igx-column-actions [title]="'Pin Columns'"></igx-column-actions>
     * ```
     */
    title: string;
    /**
     * An event that is emitted after a column's checked state is changed.
     * Provides references to the `column` and the `checked` properties as event arguments.
     * ```html
     *  <igx-column-actions (columnToggled)="columnToggled($event)"></igx-column-actions>
     * ```
     */
    columnToggled: EventEmitter<IColumnToggledEventArgs>;
    /**
     * @hidden @internal
     */
    actionableColumns: ColumnType[];
    /**
     * @hidden @internal
     */
    filteredColumns: ColumnType[];
    /**
     * @hidden @internal
     */
    pipeTrigger: number;
    /**
     * @hidden @internal
     */
    actionsDirective: IgxColumnActionsBaseDirective;
    protected _differ: IterableDiffer<any> | null;
    /**
     * @hidden @internal
     */
    private _filterColumnsPrompt;
    /**
     * @hidden @internal
     */
    private _filterCriteria;
    /**
     * @hidden @internal
     */
    private _columnDisplayOrder;
    /**
     * @hidden @internal
     */
    private _uncheckAllText;
    /**
     * @hidden @internal
     */
    private _checkAllText;
    /**
     * @hidden @internal
     */
    private _id;
    constructor(differs: IterableDiffers);
    /**
     * Gets the prompt that is displayed in the filter input.
     *
     * @example
     * ```typescript
     * let filterColumnsPrompt = this.columnActions.filterColumnsPrompt;
     * ```
     */
    get filterColumnsPrompt(): string;
    /**
     * Sets the prompt that is displayed in the filter input.
     *
     * @example
     * ```html
     * <igx-column-actions [filterColumnsPrompt]="'Type here to search'"></igx-column-actions>
     * ```
     */
    set filterColumnsPrompt(value: string);
    /**
     * Gets the value which filters the columns list.
     *
     * @example
     * ```typescript
     * let filterCriteria =  this.columnActions.filterCriteria;
     * ```
     */
    get filterCriteria(): string;
    /**
     * Sets the value which filters the columns list.
     *
     * @example
     * ```html
     *  <igx-column-actions [filterCriteria]="'ID'"></igx-column-actions>
     * ```
     */
    set filterCriteria(value: string);
    /**
     * Gets the display order of the columns.
     *
     * @example
     * ```typescript
     * let columnDisplayOrder = this.columnActions.columnDisplayOrder;
     * ```
     */
    get columnDisplayOrder(): ColumnDisplayOrder;
    /**
     * Sets the display order of the columns.
     *
     * @example
     * ```typescript
     * this.columnActions.columnDisplayOrder = ColumnDisplayOrder.Alphabetical;
     * ```
     */
    set columnDisplayOrder(value: ColumnDisplayOrder);
    /**
     * Gets the text of the button that unchecks all columns.
     *
     * @remarks
     * If unset it is obtained from the IgxColumnActionsBased derived directive applied.
     * @example
     * ```typescript
     * let uncheckAllText = this.columnActions.uncheckAllText;
     * ```
     */
    get uncheckAllText(): string;
    /**
     * Sets the text of the button that unchecks all columns.
     *
     * @example
     * ```html
     * <igx-column-actions [uncheckAllText]="'Show All'"></igx-column-actions>
     * ```
     */
    set uncheckAllText(value: string);
    /**
     * Gets the text of the button that checks all columns.
     *
     * @remarks
     * If unset it is obtained from the IgxColumnActionsBased derived directive applied.
     * @example
     * ```typescript
     * let uncheckAllText = this.columnActions.uncheckAllText;
     * ```
     */
    get checkAllText(): string;
    /**
     * Sets the text of the button that checks all columns.
     *
     * @remarks
     * If unset it is obtained from the IgxColumnActionsBased derived directive applied.
     * @example
     * ```html
     * <igx-column-actions [checkAllText]="'Hide All'"></igx-column-actions>
     * ```
     */
    set checkAllText(value: string);
    /**
     * @hidden @internal
     */
    get checkAllDisabled(): boolean;
    /**
     * @hidden @internal
     */
    get uncheckAllDisabled(): boolean;
    /**
     * Gets/Sets the value of the `id` attribute.
     *
     * @remarks
     * If not provided it will be automatically generated.
     * @example
     * ```html
     * <igx-column-actions [id]="'igx-actions-1'"></igx-column-actions>
     * ```
     */
    get id(): string;
    set id(value: string);
    /**
     * @hidden @internal
     */
    get titleID(): string;
    /**
     * @hidden @internal
     */
    trackChanges: (index: any, col: any) => string;
    /**
     * @hidden @internal
     */
    ngDoCheck(): void;
    /**
     * Unchecks all columns and performs the appropriate action.
     *
     * @example
     * ```typescript
     * this.columnActions.uncheckAllColumns();
     * ```
     */
    uncheckAllColumns(): void;
    /**
     * Checks all columns and performs the appropriate action.
     *
     * @example
     * ```typescript
     * this.columnActions.checkAllColumns();
     * ```
     */
    checkAllColumns(): void;
    /**
     * @hidden @internal
     */
    toggleColumn(column: ColumnType): void;
    static ??fac: i0.????FactoryDeclaration<IgxColumnActionsComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxColumnActionsComponent, "igx-column-actions", never, { "grid": "grid"; "indentation": "indentation"; "columnsAreaMaxHeight": "columnsAreaMaxHeight"; "hideFilter": "hideFilter"; "title": "title"; "filterColumnsPrompt": "filterColumnsPrompt"; "filterCriteria": "filterCriteria"; "columnDisplayOrder": "columnDisplayOrder"; "uncheckAllText": "uncheckAllText"; "checkAllText": "checkAllText"; "id": "id"; }, { "columnToggled": "columnToggled"; }, never, never>;
}
export declare class IgxColumnActionEnabledPipe implements PipeTransform {
    protected columnActions: IgxColumnActionsComponent;
    constructor(columnActions: IgxColumnActionsComponent);
    transform(collection: ColumnType[], actionFilter: (value: ColumnType, index: number, array: ColumnType[]) => boolean, _pipeTrigger: number): ColumnType[];
    static ??fac: i0.????FactoryDeclaration<IgxColumnActionEnabledPipe, never>;
    static ??pipe: i0.????PipeDeclaration<IgxColumnActionEnabledPipe, "columnActionEnabled">;
}
export declare class IgxFilterActionColumnsPipe implements PipeTransform {
    protected columnActions: IgxColumnActionsComponent;
    constructor(columnActions: IgxColumnActionsComponent);
    transform(collection: ColumnType[], filterCriteria: string, _pipeTrigger: number): ColumnType[];
    static ??fac: i0.????FactoryDeclaration<IgxFilterActionColumnsPipe, never>;
    static ??pipe: i0.????PipeDeclaration<IgxFilterActionColumnsPipe, "filterActionColumns">;
}
export declare class IgxSortActionColumnsPipe implements PipeTransform {
    transform(collection: ColumnType[], displayOrder: ColumnDisplayOrder, _pipeTrigger: number): ColumnType[];
    static ??fac: i0.????FactoryDeclaration<IgxSortActionColumnsPipe, never>;
    static ??pipe: i0.????PipeDeclaration<IgxSortActionColumnsPipe, "sortActionColumns">;
}
