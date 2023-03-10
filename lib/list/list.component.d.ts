import { ElementRef, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { IgxListItemComponent } from './list-item.component';
import { IgxListBaseDirective, IgxDataLoadingTemplateDirective, IgxEmptyListTemplateDirective, IgxListPanState, IgxListItemLeftPanningTemplateDirective, IgxListItemRightPanningTemplateDirective } from './list.common';
import { IDisplayDensityOptions } from '../core/density';
import { IBaseEventArgs } from '../core/utils';
import { IListResourceStrings } from '../core/i18n/list-resources';
import * as i0 from "@angular/core";
import * as i1 from "./list.common";
import * as i2 from "./list-item.component";
import * as i3 from "@angular/common";
import * as i4 from "../directives/ripple/ripple.directive";
/**
 * Interface for the panStateChange igxList event arguments
 */
export interface IPanStateChangeEventArgs extends IBaseEventArgs {
    oldState: IgxListPanState;
    newState: IgxListPanState;
    item: IgxListItemComponent;
}
/**
 * Interface for the listItemClick igxList event arguments
 */
export interface IListItemClickEventArgs extends IBaseEventArgs {
    item: IgxListItemComponent;
    event: Event;
    direction: IgxListPanState;
}
/**
 * Interface for the listItemPanning igxList event arguments
 */
export interface IListItemPanningEventArgs extends IBaseEventArgs {
    item: IgxListItemComponent;
    direction: IgxListPanState;
    keepItem: boolean;
}
/**
 * igxListThumbnail is container for the List media
 * Use it to wrap anything you want to be used as a thumbnail.
 */
export declare class IgxListThumbnailDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListThumbnailDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxListThumbnailDirective, "[igxListThumbnail]", never, {}, {}, never>;
}
/**
 * igxListAction is container for the List action
 * Use it to wrap anything you want to be used as a list action: icon, checkbox...
 */
export declare class IgxListActionDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListActionDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxListActionDirective, "[igxListAction]", never, {}, {}, never>;
}
/**
 * igxListLine is container for the List text content
 * Use it to wrap anything you want to be used as a plane text.
 */
export declare class IgxListLineDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListLineDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxListLineDirective, "[igxListLine]", never, {}, {}, never>;
}
/**
 * igxListLineTitle is a directive that add class to the target element
 * Use it to make anything to look like list Title.
 */
export declare class IgxListLineTitleDirective {
    cssClass: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListLineTitleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxListLineTitleDirective, "[igxListLineTitle]", never, {}, {}, never>;
}
/**
 * igxListLineSubTitle is a directive that add class to the target element
 * Use it to make anything to look like list Subtitle.
 */
export declare class IgxListLineSubTitleDirective {
    cssClass: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListLineSubTitleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxListLineSubTitleDirective, "[igxListLineSubTitle]", never, {}, {}, never>;
}
/**
 * Displays a collection of data items in a templatable list format
 *
 * @igxModule IgxListModule
 *
 * @igxTheme igx-list-theme
 *
 * @igxKeywords list, data
 *
 * @igxGroup Grids & Lists
 *
 * @remarks
 * The Ignite UI List displays rows of items and supports one or more header items as well as search and filtering
 * of list items. Each list item is completely templatable and will support any valid HTML or Angular component.
 *
 * @example
 * ```html
 * <igx-list>
 *   <igx-list-item isHeader="true">Contacts</igx-list-item>
 *   <igx-list-item *ngFor="let contact of contacts">
 *     <span class="name">{{ contact.name }}</span>
 *     <span class="phone">{{ contact.phone }}</span>
 *   </igx-list-item>
 * </igx-list>
 * ```
 */
export declare class IgxListComponent extends IgxListBaseDirective {
    element: ElementRef;
    protected _displayDensityOptions: IDisplayDensityOptions;
    /**
     * Returns a collection of all items and headers in the list.
     *
     * @example
     * ```typescript
     * let listChildren: QueryList = this.list.children;
     * ```
     */
    children: QueryList<IgxListItemComponent>;
    /**
     * Sets/gets the empty list template.
     *
     * @remarks
     * This template is used by IgxList in case there are no list items
     * defined and `isLoading` is set to `false`.
     *
     * @example
     * ```html
     * <igx-list>
     *   <ng-template igxEmptyList>
     *     <p class="empty">No contacts! :(</p>
     *   </ng-template>
     * </igx-list>
     * ```
     * ```typescript
     * let emptyTemplate = this.list.emptyListTemplate;
     * ```
     */
    emptyListTemplate: IgxEmptyListTemplateDirective;
    /**
     * Sets/gets the list loading template.
     *
     * @remarks
     * This template is used by IgxList in case there are no list items defined and `isLoading` is set to `true`.
     *
     * @example
     * ```html
     * <igx-list>
     *   <ng-template igxDataLoading>
     *     <p>Patience, we are currently loading your data...</p>
     *   </ng-template>
     * </igx-list>
     * ```
     * ```typescript
     * let loadingTemplate = this.list.dataLoadingTemplate;
     * ```
     */
    dataLoadingTemplate: IgxDataLoadingTemplateDirective;
    /**
     * Sets/gets the template for left panning a list item.
     *
     * @remarks
     * Default value is `null`.
     *
     * @example
     * ```html
     * <igx-list [allowLeftPanning]="true">
     *   <ng-template igxListItemLeftPanning>
     *     <igx-icon>delete</igx-icon>Delete
     *   </ng-template>
     * </igx-list>
     * ```
     * ```typescript
     * let itemLeftPanTmpl = this.list.listItemLeftPanningTemplate;
     * ```
     */
    listItemLeftPanningTemplate: IgxListItemLeftPanningTemplateDirective;
    /**
     * Sets/gets the template for right panning a list item.
     *
     * @remarks
     * Default value is `null`.
     *
     * @example
     * ```html
     * <igx-list [allowRightPanning] = "true">
     *   <ng-template igxListItemRightPanning>
     *     <igx-icon>call</igx-icon>Dial
     *   </ng-template>
     * </igx-list>
     * ```
     * ```typescript
     * let itemRightPanTmpl = this.list.listItemRightPanningTemplate;
     * ```
     */
    listItemRightPanningTemplate: IgxListItemRightPanningTemplateDirective;
    /**
     * Provides a threshold after which the item's panning will be completed automatically.
     *
     * @remarks
     * By default this property is set to 0.5 which is 50% of the list item's width.
     *
     * @example
     * ```html
     * <igx-list [panEndTriggeringThreshold]="0.8"></igx-list>
     * ```
     */
    panEndTriggeringThreshold: number;
    /**
     * Sets/gets the `id` of the list.
     *
     * @remarks
     * If not set, the `id` of the first list component will be `"igx-list-0"`.
     *
     * @example
     * ```html
     * <igx-list id="my-first-list"></igx-list>
     * ```
     * ```typescript
     * let listId = this.list.id;
     * ```
     */
    id: string;
    /**
     * Sets/gets whether the left panning of an item is allowed.
     *
     * @remarks
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-list [allowLeftPanning]="true"></igx-list>
     * ```
     * ```typescript
     * let isLeftPanningAllowed = this.list.allowLeftPanning;
     * ```
     */
    allowLeftPanning: boolean;
    /**
     * Sets/gets whether the right panning of an item is allowed.
     *
     * @remarks
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-list [allowRightPanning]="true"></igx-list>
     * ```
     * ```typescript
     * let isRightPanningAllowed = this.list.allowRightPanning;
     * ```
     */
    allowRightPanning: boolean;
    /**
     * Sets/gets whether the list is currently loading data.
     *
     * @remarks
     * Set it to display the dataLoadingTemplate while data is being retrieved.
     * Default value is `false`.
     *
     * @example
     * ```html
     *  <igx-list [isLoading]="true"></igx-list>
     * ```
     * ```typescript
     * let isLoading = this.list.isLoading;
     * ```
     */
    isLoading: boolean;
    /**
     * Event emitted when a left pan gesture is executed on a list item.
     *
     * @remarks
     * Provides a reference to an object of type `IListItemPanningEventArgs` as an event argument.
     *
     * @example
     * ```html
     * <igx-list [allowLeftPanning]="true" (leftPan)="leftPan($event)"></igx-list>
     * ```
     */
    leftPan: EventEmitter<IListItemPanningEventArgs>;
    /**
     * Event emitted when a right pan gesture is executed on a list item.
     *
     * @remarks
     * Provides a reference to an object of type `IListItemPanningEventArgs` as an event argument.
     *
     * @example
     * ```html
     * <igx-list [allowRightPanning]="true" (rightPan)="rightPan($event)"></igx-list>
     * ```
     */
    rightPan: EventEmitter<IListItemPanningEventArgs>;
    /**
     * Event emitted when a pan gesture is started.
     *
     * @remarks
     * Provides a reference to an object of type `IListItemPanningEventArgs` as an event argument.
     *
     * @example
     * ```html
     * <igx-list (startPan)="startPan($event)"></igx-list>
     * ```
     */
    startPan: EventEmitter<IListItemPanningEventArgs>;
    /**
     * Event emitted when a pan gesture is completed or canceled.
     *
     * @remarks
     * Provides a reference to an object of type `IListItemPanningEventArgs` as an event argument.
     *
     * @example
     * ```html
     * <igx-list (endPan)="endPan($event)"></igx-list>
     * ```
     */
    endPan: EventEmitter<IListItemPanningEventArgs>;
    /**
     * Event emitted when a pan item is returned to its original position.
     *
     * @remarks
     * Provides a reference to an object of type `IgxListComponent` as an event argument.
     *
     * @example
     * ```html
     * <igx-list (resetPan)="resetPan($event)"></igx-list>
     * ```
     */
    resetPan: EventEmitter<IgxListComponent>;
    /**
     *
     * Event emitted when a pan gesture is executed on a list item.
     *
     * @remarks
     * Provides references to the `IgxListItemComponent` and `IgxListPanState` as event arguments.
     *
     * @example
     * ```html
     * <igx-list (panStateChange)="panStateChange($event)"></igx-list>
     * ```
     */
    panStateChange: EventEmitter<IPanStateChangeEventArgs>;
    /**
     * Event emitted when a list item is clicked.
     *
     * @remarks
     * Provides references to the `IgxListItemComponent` and `Event` as event arguments.
     *
     * @example
     * ```html
     * <igx-list (itemClicked)="onItemClicked($event)"></igx-list>
     * ```
     */
    itemClicked: EventEmitter<IListItemClickEventArgs>;
    /**
     * @hidden
     * @internal
     */
    protected defaultEmptyListTemplate: TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    protected defaultDataLoadingTemplate: TemplateRef<any>;
    private _resourceStrings;
    /**
     * Sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: IListResourceStrings);
    /**
     * Returns the resource strings.
     */
    get resourceStrings(): IListResourceStrings;
    constructor(element: ElementRef, _displayDensityOptions: IDisplayDensityOptions);
    /**
     * @hidden
     * @internal
     */
    protected get sortedChildren(): IgxListItemComponent[];
    /**
     * Gets the `role` attribute value.
     *
     * @example
     * ```typescript
     * let listRole =  this.list.role;
     * ```
     */
    get role(): string;
    /**
     * Gets a boolean indicating if the list is empty.
     *
     * @example
     * ```typescript
     * let isEmpty =  this.list.isListEmpty;
     * ```
     */
    get isListEmpty(): boolean;
    /**
     * @hidden
     * @internal
     */
    get cssClass(): boolean;
    /**
     * @hidden
     * @internal
     */
    get cssClassCompact(): boolean;
    /**
     * @hidden
     * @internal
     */
    get cssClassCosy(): boolean;
    /**
     * Gets the list `items` excluding the header ones.
     *
     * @example
     * ```typescript
     * let listItems: IgxListItemComponent[] = this.list.items;
     * ```
     */
    get items(): IgxListItemComponent[];
    /**
     * Gets the header list `items`.
     *
     * @example
     * ```typescript
     * let listHeaders: IgxListItemComponent[] =  this.list.headers;
     * ```
     */
    get headers(): IgxListItemComponent[];
    /**
     * Gets the `context` object of the template binding.
     *
     * @remark
     * Gets the `context` object which represents the `template context` binding into the `list container`
     * by providing the `$implicit` declaration which is the `IgxListComponent` itself.
     *
     * @example
     * ```typescript
     * let listComponent =  this.list.context;
     * ```
     */
    get context(): any;
    /**
     * Gets a `TemplateRef` to the currently used template.
     *
     * @example
     * ```typescript
     * let listTemplate = this.list.template;
     * ```
     */
    get template(): TemplateRef<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListComponent, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxListComponent, "igx-list", never, { "panEndTriggeringThreshold": "panEndTriggeringThreshold"; "id": "id"; "allowLeftPanning": "allowLeftPanning"; "allowRightPanning": "allowRightPanning"; "isLoading": "isLoading"; "resourceStrings": "resourceStrings"; }, { "leftPan": "leftPan"; "rightPan": "rightPan"; "startPan": "startPan"; "endPan": "endPan"; "resetPan": "resetPan"; "panStateChange": "panStateChange"; "itemClicked": "itemClicked"; }, ["emptyListTemplate", "dataLoadingTemplate", "listItemLeftPanningTemplate", "listItemRightPanningTemplate", "children"], ["*"]>;
}
/**
 * @hidden
 */
export declare class IgxListModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxListModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IgxListModule, [typeof i1.IgxListBaseDirective, typeof IgxListComponent, typeof i2.IgxListItemComponent, typeof IgxListThumbnailDirective, typeof IgxListActionDirective, typeof IgxListLineDirective, typeof IgxListLineTitleDirective, typeof IgxListLineSubTitleDirective, typeof i1.IgxDataLoadingTemplateDirective, typeof i1.IgxEmptyListTemplateDirective, typeof i1.IgxListItemLeftPanningTemplateDirective, typeof i1.IgxListItemRightPanningTemplateDirective], [typeof i3.CommonModule, typeof i4.IgxRippleModule], [typeof IgxListComponent, typeof i2.IgxListItemComponent, typeof IgxListThumbnailDirective, typeof IgxListActionDirective, typeof IgxListLineDirective, typeof IgxListLineTitleDirective, typeof IgxListLineSubTitleDirective, typeof i1.IgxDataLoadingTemplateDirective, typeof i1.IgxEmptyListTemplateDirective, typeof i1.IgxListItemLeftPanningTemplateDirective, typeof i1.IgxListItemRightPanningTemplateDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IgxListModule>;
}
