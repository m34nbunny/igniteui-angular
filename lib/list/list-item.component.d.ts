import { ElementRef, Renderer2 } from '@angular/core';
import { IgxListPanState, IListChild, IgxListBaseDirective } from './list.common';
import * as i0 from "@angular/core";
/**
 * The Ignite UI List Item component is a container intended for row items in the Ignite UI for Angular List component.
 *
 * Example:
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
export declare class IgxListItemComponent implements IListChild {
    list: IgxListBaseDirective;
    private elementRef;
    private _renderer;
    /**
     * Provides a reference to the template's base element shown when left panning a list item.
     * ```typescript
     * const leftPanTmpl = this.listItem.leftPanningTemplateElement;
     * ```
     */
    leftPanningTemplateElement: any;
    /**
     * Provides a reference to the template's base element shown when right panning a list item.
     * ```typescript
     * const rightPanTmpl = this.listItem.rightPanningTemplateElement;
     * ```
     */
    rightPanningTemplateElement: any;
    /**
     * Sets/gets whether the `list item` is a header.
     * ```html
     * <igx-list-item [isHeader] = "true">Header</igx-list-item>
     * ```
     * ```typescript
     * let isHeader =  this.listItem.isHeader;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    isHeader: boolean;
    /**
     * Sets/gets whether the `list item` is hidden.
     * By default the `hidden` value is `false`.
     * ```html
     * <igx-list-item [hidden] = "true">Hidden Item</igx-list-item>
     * ```
     * ```typescript
     * let isHidden =  this.listItem.hidden;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    hidden: boolean;
    /**
     * Sets/gets the `aria-label` attribute of the `list item`.
     * ```typescript
     * this.listItem.ariaLabel = "Item1";
     * ```
     * ```typescript
     * let itemAriaLabel = this.listItem.ariaLabel;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    ariaLabel: string;
    /**
     * Gets the `touch-action` style of the `list item`.
     * ```typescript
     * let touchAction = this.listItem.touchAction;
     * ```
     */
    touchAction: string;
    /**
     * @hidden
     */
    private _panState;
    /**
     * @hidden
     */
    private panOffset;
    /**
     * @hidden
     */
    private _index;
    /**
     * @hidden
     */
    private lastPanDir;
    /**
     * Gets the `panState` of a `list item`.
     * ```typescript
     * let itemPanState =  this.listItem.panState;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get panState(): IgxListPanState;
    /**
     * Gets the `index` of a `list item`.
     * ```typescript
     * let itemIndex =  this.listItem.index;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get index(): number;
    /**
     * Sets the `index` of the `list item`.
     * ```typescript
     * this.listItem.index = index;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    set index(value: number);
    /**
     * Returns an element reference to the list item.
     * ```typescript
     * let listItemElement =  this.listItem.element.
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get element(): any;
    /**
     * Returns a reference container which contains the list item's content.
     * ```typescript
     * let listItemContainer =  this.listItem.contentElement.
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get contentElement(): any;
    /**
     * Returns the `context` object which represents the `template context` binding into the `list item container`
     * by providing the `$implicit` declaration which is the `IgxListItemComponent` itself.
     * ```typescript
     * let listItemComponent = this.listItem.context;
     * ```
     */
    get context(): any;
    /**
     * Gets the width of a `list item`.
     * ```typescript
     * let itemWidth = this.listItem.width;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get width(): any;
    /**
     * Gets the maximum left position of the `list item`.
     * ```typescript
     * let maxLeft = this.listItem.maxLeft;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get maxLeft(): number;
    /**
     * Gets the maximum right position of the `list item`.
     * ```typescript
     * let maxRight = this.listItem.maxRight;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get maxRight(): any;
    constructor(list: IgxListBaseDirective, elementRef: ElementRef, _renderer: Renderer2);
    /**
     * Gets the `role` attribute of the `list item`.
     * ```typescript
     * let itemRole =  this.listItem.role;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get role(): "separator" | "listitem";
    /**
     * Indicates whether `list item` should have header style.
     * ```typescript
     * let headerStyle =  this.listItem.headerStyle;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get headerStyle(): boolean;
    /**
     * Applies the inner style of the `list item` if the item is not counted as header.
     * ```typescript
     * let innerStyle =  this.listItem.innerStyle;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get innerStyle(): boolean;
    /**
     * Returns string value which describes the display mode of the `list item`.
     * ```typescript
     * let isHidden = this.listItem.display;
     * ```
     *
     * @memberof IgxListItemComponent
     */
    get display(): string;
    /**
     * @hidden
     */
    clicked(evt: any): void;
    /**
     * @hidden
     */
    panStart(): void;
    /**
     * @hidden
     */
    panCancel(): void;
    /**
     * @hidden
     */
    panMove(ev: any): void;
    /**
     * @hidden
     */
    panEnd(): void;
    /**
     * @hidden
     */
    private showLeftPanTemplate;
    /**
     * @hidden
     */
    private showRightPanTemplate;
    /**
     * @hidden
     */
    private hideLeftAndRightPanTemplates;
    /**
     * @hidden
     */
    private setLeftAndRightTemplatesVisibility;
    /**
     * @hidden
     */
    private setContentElementLeft;
    /**
     * @hidden
     */
    private isTrue;
    /**
     * @hidden
     */
    private resetPanPosition;
    static ??fac: i0.????FactoryDeclaration<IgxListItemComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxListItemComponent, "igx-list-item", never, { "isHeader": "isHeader"; "hidden": "hidden"; "index": "index"; }, {}, never, ["*", "[igxListThumbnail], igx-list__item-thumbnail, igx-avatar", "[igxListLine], .igx-list__item-lines, [igxListLineTitle], [igxListLineSubTitle], .igx-list__item-line-title, .igx-list__item-line-subtitle", "[igxListAction], .igx-list__item-actions"]>;
}
