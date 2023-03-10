import { EventEmitter, OnDestroy } from '@angular/core';
import { ColumnDisplayOrder } from '../common/enums';
import { IColumnToggledEventArgs } from '../common/events';
import { IgxColumnActionsComponent } from '../column-actions/column-actions.component';
import { IgxToggleDirective, ToggleViewCancelableEventArgs, ToggleViewEventArgs } from '../../directives/toggle/toggle.directive';
import { OverlaySettings } from '../../services/overlay/utilities';
import { IgxToolbarToken } from './token';
import * as i0 from "@angular/core";
/**
 * Base class for the pinning/hiding column and exporter actions.
 *
 * @hidden @internal
 */
export declare abstract class BaseToolbarDirective implements OnDestroy {
    protected toolbar: IgxToolbarToken;
    /**
     * Sets the height of the column list in the dropdown.
     */
    columnListHeight: string;
    /**
     * Title text for the column action component
     */
    title: string;
    /**
     * The placeholder text for the search input.
     */
    prompt: string;
    /**
     * Sets overlay settings
     */
    set overlaySettings(overlaySettings: OverlaySettings);
    /**
     * Returns overlay settings
     */
    get overlaySettings(): OverlaySettings;
    /**
     * Emits an event before the toggle container is opened.
     */
    opening: EventEmitter<ToggleViewCancelableEventArgs>;
    /**
     * Emits an event after the toggle container is opened.
     */
    opened: EventEmitter<ToggleViewEventArgs>;
    /**
     * Emits an event before the toggle container is closed.
     */
    closing: EventEmitter<ToggleViewEventArgs>;
    /**
     * Emits an event after the toggle container is closed.
     */
    closed: EventEmitter<ToggleViewEventArgs>;
    /**
     * Emits when after a column's checked state is changed
     */
    columnToggle: EventEmitter<IColumnToggledEventArgs>;
    private $destroy;
    private $sub;
    private _overlaySettings;
    /**
     * Returns the grid containing this component.
     */
    get grid(): import("../common/grid.interface").GridType;
    constructor(toolbar: IgxToolbarToken);
    ngOnDestroy(): void;
    /** @hidden @internal */
    toggle(anchorElement: HTMLElement, toggleRef: IgxToggleDirective, actions?: IgxColumnActionsComponent): void;
    /** @hidden @internal */
    focusSearch(columnActions: HTMLElement): void;
    private _setupListeners;
    static ??fac: i0.????FactoryDeclaration<BaseToolbarDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<BaseToolbarDirective, never, never, { "columnListHeight": "columnListHeight"; "title": "title"; "prompt": "prompt"; "overlaySettings": "overlaySettings"; }, { "opening": "opening"; "opened": "opened"; "closing": "closing"; "closed": "closed"; "columnToggle": "columnToggle"; }, never>;
}
/**
 * @hidden @internal
 * Base class for pinning/hiding column actions
 */
export declare abstract class BaseToolbarColumnActionsDirective extends BaseToolbarDirective {
    hideFilter: boolean;
    filterCriteria: string;
    columnDisplayOrder: ColumnDisplayOrder;
    columnsAreaMaxHeight: string;
    uncheckAllText: string;
    checkAllText: string;
    indentetion: number;
    buttonText: string;
    protected columnActionsUI: IgxColumnActionsComponent;
    checkAll(): void;
    uncheckAll(): void;
    static ??fac: i0.????FactoryDeclaration<BaseToolbarColumnActionsDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<BaseToolbarColumnActionsDirective, never, never, { "hideFilter": "hideFilter"; "filterCriteria": "filterCriteria"; "columnDisplayOrder": "columnDisplayOrder"; "columnsAreaMaxHeight": "columnsAreaMaxHeight"; "uncheckAllText": "uncheckAllText"; "checkAllText": "checkAllText"; "indentetion": "indentetion"; "buttonText": "buttonText"; }, {}, never>;
}
