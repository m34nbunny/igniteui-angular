import { CommonModule } from '@angular/common';
import { Component, ContentChild, ContentChildren, EventEmitter, forwardRef, HostBinding, Input, NgModule, Output, TemplateRef, ViewChild, Optional, Inject, Directive } from '@angular/core';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxListItemComponent } from './list-item.component';
import { IgxListBaseDirective, IgxDataLoadingTemplateDirective, IgxEmptyListTemplateDirective, IgxListItemLeftPanningTemplateDirective, IgxListItemRightPanningTemplateDirective } from './list.common';
import { DisplayDensityToken, DisplayDensity } from '../core/density';
import { CurrentResourceStrings } from '../core/i18n/resources';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let NEXT_ID = 0;
/**
 * igxListThumbnail is container for the List media
 * Use it to wrap anything you want to be used as a thumbnail.
 */
export class IgxListThumbnailDirective {
}
IgxListThumbnailDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListThumbnailDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxListThumbnailDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxListThumbnailDirective, selector: "[igxListThumbnail]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListThumbnailDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[igxListThumbnail]'
                }]
        }] });
/**
 * igxListAction is container for the List action
 * Use it to wrap anything you want to be used as a list action: icon, checkbox...
 */
export class IgxListActionDirective {
}
IgxListActionDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListActionDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxListActionDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxListActionDirective, selector: "[igxListAction]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListActionDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[igxListAction]'
                }]
        }] });
/**
 * igxListLine is container for the List text content
 * Use it to wrap anything you want to be used as a plane text.
 */
export class IgxListLineDirective {
}
IgxListLineDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListLineDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxListLineDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxListLineDirective, selector: "[igxListLine]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListLineDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[igxListLine]'
                }]
        }] });
/**
 * igxListLineTitle is a directive that add class to the target element
 * Use it to make anything to look like list Title.
 */
export class IgxListLineTitleDirective {
    constructor() {
        this.cssClass = 'igx-list__item-line-title';
    }
}
IgxListLineTitleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListLineTitleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxListLineTitleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxListLineTitleDirective, selector: "[igxListLineTitle]", host: { properties: { "class.igx-list__item-line-title": "this.cssClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListLineTitleDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[igxListLineTitle]'
                }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-list__item-line-title']
            }] } });
/**
 * igxListLineSubTitle is a directive that add class to the target element
 * Use it to make anything to look like list Subtitle.
 */
export class IgxListLineSubTitleDirective {
    constructor() {
        this.cssClass = 'igx-list__item-line-subtitle';
    }
}
IgxListLineSubTitleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListLineSubTitleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxListLineSubTitleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxListLineSubTitleDirective, selector: "[igxListLineSubTitle]", host: { properties: { "class.igx-list__item-line-subtitle": "this.cssClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListLineSubTitleDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[igxListLineSubTitle]'
                }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-list__item-line-subtitle']
            }] } });
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
export class IgxListComponent extends IgxListBaseDirective {
    constructor(element, _displayDensityOptions) {
        super(_displayDensityOptions);
        this.element = element;
        this._displayDensityOptions = _displayDensityOptions;
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
        this.panEndTriggeringThreshold = 0.5;
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
        this.id = `igx-list-${NEXT_ID++}`;
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
        this.allowLeftPanning = false;
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
        this.allowRightPanning = false;
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
        this.isLoading = false;
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
        this.leftPan = new EventEmitter();
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
        this.rightPan = new EventEmitter();
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
        this.startPan = new EventEmitter();
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
        this.endPan = new EventEmitter();
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
        this.resetPan = new EventEmitter();
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
        this.panStateChange = new EventEmitter();
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
        this.itemClicked = new EventEmitter();
        this._resourceStrings = CurrentResourceStrings.ListResStrings;
    }
    /**
     * Sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    /**
     * Returns the resource strings.
     */
    get resourceStrings() {
        return this._resourceStrings;
    }
    /**
     * @hidden
     * @internal
     */
    get sortedChildren() {
        if (this.children !== undefined) {
            return this.children.toArray()
                .sort((a, b) => a.index - b.index);
        }
        return null;
    }
    /**
     * Gets the `role` attribute value.
     *
     * @example
     * ```typescript
     * let listRole =  this.list.role;
     * ```
     */
    get role() {
        return 'list';
    }
    /**
     * Gets a boolean indicating if the list is empty.
     *
     * @example
     * ```typescript
     * let isEmpty =  this.list.isListEmpty;
     * ```
     */
    get isListEmpty() {
        return !this.children || this.children.length === 0;
    }
    /**
     * @hidden
     * @internal
     */
    get cssClass() {
        return !this.isListEmpty && this.displayDensity === DisplayDensity.comfortable;
    }
    /**
     * @hidden
     * @internal
     */
    get cssClassCompact() {
        return !this.isListEmpty && this.displayDensity === DisplayDensity.compact;
    }
    /**
     * @hidden
     * @internal
     */
    get cssClassCosy() {
        return !this.isListEmpty && this.displayDensity === DisplayDensity.cosy;
    }
    /**
     * Gets the list `items` excluding the header ones.
     *
     * @example
     * ```typescript
     * let listItems: IgxListItemComponent[] = this.list.items;
     * ```
     */
    get items() {
        const items = [];
        if (this.children !== undefined) {
            for (const child of this.sortedChildren) {
                if (!child.isHeader) {
                    items.push(child);
                }
            }
        }
        return items;
    }
    /**
     * Gets the header list `items`.
     *
     * @example
     * ```typescript
     * let listHeaders: IgxListItemComponent[] =  this.list.headers;
     * ```
     */
    get headers() {
        const headers = [];
        if (this.children !== undefined) {
            for (const child of this.children.toArray()) {
                if (child.isHeader) {
                    headers.push(child);
                }
            }
        }
        return headers;
    }
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
    get context() {
        return {
            $implicit: this
        };
    }
    /**
     * Gets a `TemplateRef` to the currently used template.
     *
     * @example
     * ```typescript
     * let listTemplate = this.list.template;
     * ```
     */
    get template() {
        if (this.isLoading) {
            return this.dataLoadingTemplate ? this.dataLoadingTemplate.template : this.defaultDataLoadingTemplate;
        }
        else {
            return this.emptyListTemplate ? this.emptyListTemplate.template : this.defaultEmptyListTemplate;
        }
    }
}
IgxListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListComponent, deps: [{ token: i0.ElementRef }, { token: DisplayDensityToken, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxListComponent, selector: "igx-list", inputs: { panEndTriggeringThreshold: "panEndTriggeringThreshold", id: "id", allowLeftPanning: "allowLeftPanning", allowRightPanning: "allowRightPanning", isLoading: "isLoading", resourceStrings: "resourceStrings" }, outputs: { leftPan: "leftPan", rightPan: "rightPan", startPan: "startPan", endPan: "endPan", resetPan: "resetPan", panStateChange: "panStateChange", itemClicked: "itemClicked" }, host: { properties: { "attr.id": "this.id", "attr.role": "this.role", "class.igx-list--empty": "this.isListEmpty", "class.igx-list": "this.cssClass", "class.igx-list--compact": "this.cssClassCompact", "class.igx-list--cosy": "this.cssClassCosy" } }, providers: [{ provide: IgxListBaseDirective, useExisting: IgxListComponent }], queries: [{ propertyName: "emptyListTemplate", first: true, predicate: IgxEmptyListTemplateDirective, descendants: true, read: IgxEmptyListTemplateDirective }, { propertyName: "dataLoadingTemplate", first: true, predicate: IgxDataLoadingTemplateDirective, descendants: true, read: IgxDataLoadingTemplateDirective }, { propertyName: "listItemLeftPanningTemplate", first: true, predicate: IgxListItemLeftPanningTemplateDirective, descendants: true, read: IgxListItemLeftPanningTemplateDirective }, { propertyName: "listItemRightPanningTemplate", first: true, predicate: IgxListItemRightPanningTemplateDirective, descendants: true, read: IgxListItemRightPanningTemplateDirective }, { propertyName: "children", predicate: i0.forwardRef(function () { return IgxListItemComponent; }), descendants: true }], viewQueries: [{ propertyName: "defaultEmptyListTemplate", first: true, predicate: ["defaultEmptyList"], descendants: true, read: TemplateRef, static: true }, { propertyName: "defaultDataLoadingTemplate", first: true, predicate: ["defaultDataLoading"], descendants: true, read: TemplateRef, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-content></ng-content>\n\n<ng-template #defaultEmptyList>\n    <article class=\"igx-list__message\">\n        {{resourceStrings.igx_list_no_items}}\n    </article>\n</ng-template>\n\n<ng-template #defaultDataLoading>\n    <article class=\"igx-list__message\">\n        {{resourceStrings.igx_list_loading}}\n    </article>\n</ng-template>\n\n<ng-container *ngIf=\"!children || children.length === 0 || isLoading\">\n    <ng-container *ngTemplateOutlet=\"template; context: context\">\n    </ng-container>\n</ng-container>\n", directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-list', providers: [{ provide: IgxListBaseDirective, useExisting: IgxListComponent }], template: "<ng-content></ng-content>\n\n<ng-template #defaultEmptyList>\n    <article class=\"igx-list__message\">\n        {{resourceStrings.igx_list_no_items}}\n    </article>\n</ng-template>\n\n<ng-template #defaultDataLoading>\n    <article class=\"igx-list__message\">\n        {{resourceStrings.igx_list_loading}}\n    </article>\n</ng-template>\n\n<ng-container *ngIf=\"!children || children.length === 0 || isLoading\">\n    <ng-container *ngTemplateOutlet=\"template; context: context\">\n    </ng-container>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }]; }, propDecorators: { children: [{
                type: ContentChildren,
                args: [forwardRef(() => IgxListItemComponent), { descendants: true }]
            }], emptyListTemplate: [{
                type: ContentChild,
                args: [IgxEmptyListTemplateDirective, { read: IgxEmptyListTemplateDirective }]
            }], dataLoadingTemplate: [{
                type: ContentChild,
                args: [IgxDataLoadingTemplateDirective, { read: IgxDataLoadingTemplateDirective }]
            }], listItemLeftPanningTemplate: [{
                type: ContentChild,
                args: [IgxListItemLeftPanningTemplateDirective, { read: IgxListItemLeftPanningTemplateDirective }]
            }], listItemRightPanningTemplate: [{
                type: ContentChild,
                args: [IgxListItemRightPanningTemplateDirective, { read: IgxListItemRightPanningTemplateDirective }]
            }], panEndTriggeringThreshold: [{
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], allowLeftPanning: [{
                type: Input
            }], allowRightPanning: [{
                type: Input
            }], isLoading: [{
                type: Input
            }], leftPan: [{
                type: Output
            }], rightPan: [{
                type: Output
            }], startPan: [{
                type: Output
            }], endPan: [{
                type: Output
            }], resetPan: [{
                type: Output
            }], panStateChange: [{
                type: Output
            }], itemClicked: [{
                type: Output
            }], defaultEmptyListTemplate: [{
                type: ViewChild,
                args: ['defaultEmptyList', { read: TemplateRef, static: true }]
            }], defaultDataLoadingTemplate: [{
                type: ViewChild,
                args: ['defaultDataLoading', { read: TemplateRef, static: true }]
            }], resourceStrings: [{
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], isListEmpty: [{
                type: HostBinding,
                args: ['class.igx-list--empty']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-list']
            }], cssClassCompact: [{
                type: HostBinding,
                args: ['class.igx-list--compact']
            }], cssClassCosy: [{
                type: HostBinding,
                args: ['class.igx-list--cosy']
            }] } });
/**
 * @hidden
 */
export class IgxListModule {
}
IgxListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListModule, declarations: [IgxListBaseDirective, IgxListComponent, IgxListItemComponent, IgxListThumbnailDirective, IgxListActionDirective, IgxListLineDirective, IgxListLineTitleDirective, IgxListLineSubTitleDirective, IgxDataLoadingTemplateDirective,
        IgxEmptyListTemplateDirective,
        IgxListItemLeftPanningTemplateDirective,
        IgxListItemRightPanningTemplateDirective], imports: [CommonModule,
        IgxRippleModule], exports: [IgxListComponent, IgxListItemComponent, IgxListThumbnailDirective, IgxListActionDirective, IgxListLineDirective, IgxListLineTitleDirective, IgxListLineSubTitleDirective, IgxDataLoadingTemplateDirective,
        IgxEmptyListTemplateDirective,
        IgxListItemLeftPanningTemplateDirective,
        IgxListItemRightPanningTemplateDirective] });
IgxListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListModule, imports: [[
            CommonModule,
            IgxRippleModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxListModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxListBaseDirective,
                        IgxListComponent,
                        IgxListItemComponent,
                        IgxListThumbnailDirective,
                        IgxListActionDirective,
                        IgxListLineDirective,
                        IgxListLineTitleDirective,
                        IgxListLineSubTitleDirective,
                        IgxDataLoadingTemplateDirective,
                        IgxEmptyListTemplateDirective,
                        IgxListItemLeftPanningTemplateDirective,
                        IgxListItemRightPanningTemplateDirective
                    ],
                    exports: [
                        IgxListComponent,
                        IgxListItemComponent,
                        IgxListThumbnailDirective,
                        IgxListActionDirective,
                        IgxListLineDirective,
                        IgxListLineTitleDirective,
                        IgxListLineSubTitleDirective,
                        IgxDataLoadingTemplateDirective,
                        IgxEmptyListTemplateDirective,
                        IgxListItemLeftPanningTemplateDirective,
                        IgxListItemRightPanningTemplateDirective
                    ],
                    imports: [
                        CommonModule,
                        IgxRippleModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvbGlzdC9saXN0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9saXN0L2xpc3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFFZixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFFTixXQUFXLEVBQ1gsU0FBUyxFQUNULFFBQVEsRUFDUixNQUFNLEVBQUUsU0FBUyxFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFFeEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUNILG9CQUFvQixFQUNwQiwrQkFBK0IsRUFDL0IsNkJBQTZCLEVBRTdCLHVDQUF1QyxFQUN2Qyx3Q0FBd0MsRUFDM0MsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUEwQixtQkFBbUIsRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUc5RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7O0FBRWhFLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztBQTZCaEI7OztHQUdHO0FBS0gsTUFBTSxPQUFPLHlCQUF5Qjs7c0hBQXpCLHlCQUF5QjswR0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBSnJDLFNBQVM7bUJBQUM7b0JBQ1AsOERBQThEO29CQUM5RCxRQUFRLEVBQUUs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LHVDQUF1QztRQUN2Qyx3Q0FBd0M7MkdBT25DLGFBQWEsWUFMYjtZQUNMLFlBQVk7WUFDWixlQUFlO1NBQ2xCOzJGQUVRLGFBQWE7a0JBakN6QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixvQkFBb0I7d0JBQ3BCLGdCQUFnQjt3QkFDaEIsb0JBQW9CO3dCQUNwQix5QkFBeUI7d0JBQ3pCLHNCQUFzQjt3QkFDdEIsb0JBQW9CO3dCQUNwQix5QkFBeUI7d0JBQ3pCLDRCQUE0Qjt3QkFDNUIsK0JBQStCO3dCQUMvQiw2QkFBNkI7d0JBQzdCLHVDQUF1Qzt3QkFDdkMsd0NBQXdDO3FCQUMzQztvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsZ0JBQWdCO3dCQUNoQixvQkFBb0I7d0JBQ3BCLHlCQUF5Qjt3QkFDekIsc0JBQXNCO3dCQUN0QixvQkFBb0I7d0JBQ3BCLHlCQUF5Qjt3QkFDekIsNEJBQTRCO3dCQUM1QiwrQkFBK0I7d0JBQy9CLDZCQUE2Qjt3QkFDN0IsdUNBQXVDO3dCQUN2Qyx3Q0FBd0M7cUJBQzNDO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGVBQWU7cUJBQ2xCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgZm9yd2FyZFJlZixcbiAgICBIb3N0QmluZGluZyxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBPcHRpb25hbCxcbiAgICBJbmplY3QsIERpcmVjdGl2ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSWd4UmlwcGxlTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUvcmlwcGxlLmRpcmVjdGl2ZSc7XG5cbmltcG9ydCB7IElneExpc3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9saXN0LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gICAgSWd4TGlzdEJhc2VEaXJlY3RpdmUsXG4gICAgSWd4RGF0YUxvYWRpbmdUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJZ3hFbXB0eUxpc3RUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBJZ3hMaXN0UGFuU3RhdGUsXG4gICAgSWd4TGlzdEl0ZW1MZWZ0UGFubmluZ1RlbXBsYXRlRGlyZWN0aXZlLFxuICAgIElneExpc3RJdGVtUmlnaHRQYW5uaW5nVGVtcGxhdGVEaXJlY3RpdmVcbn0gZnJvbSAnLi9saXN0LmNvbW1vbic7XG5pbXBvcnQgeyBJRGlzcGxheURlbnNpdHlPcHRpb25zLCBEaXNwbGF5RGVuc2l0eVRva2VuLCBEaXNwbGF5RGVuc2l0eSB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5pbXBvcnQgeyBJQmFzZUV2ZW50QXJncyB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgSUxpc3RSZXNvdXJjZVN0cmluZ3MgfSBmcm9tICcuLi9jb3JlL2kxOG4vbGlzdC1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ3VycmVudFJlc291cmNlU3RyaW5ncyB9IGZyb20gJy4uL2NvcmUvaTE4bi9yZXNvdXJjZXMnO1xuXG5sZXQgTkVYVF9JRCA9IDA7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgcGFuU3RhdGVDaGFuZ2UgaWd4TGlzdCBldmVudCBhcmd1bWVudHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUGFuU3RhdGVDaGFuZ2VFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncyB7XG4gICAgb2xkU3RhdGU6IElneExpc3RQYW5TdGF0ZTtcbiAgICBuZXdTdGF0ZTogSWd4TGlzdFBhblN0YXRlO1xuICAgIGl0ZW06IElneExpc3RJdGVtQ29tcG9uZW50O1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGxpc3RJdGVtQ2xpY2sgaWd4TGlzdCBldmVudCBhcmd1bWVudHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTGlzdEl0ZW1DbGlja0V2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICBpdGVtOiBJZ3hMaXN0SXRlbUNvbXBvbmVudDtcbiAgICBldmVudDogRXZlbnQ7XG4gICAgZGlyZWN0aW9uOiBJZ3hMaXN0UGFuU3RhdGU7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgbGlzdEl0ZW1QYW5uaW5nIGlneExpc3QgZXZlbnQgYXJndW1lbnRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUxpc3RJdGVtUGFubmluZ0V2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICBpdGVtOiBJZ3hMaXN0SXRlbUNvbXBvbmVudDtcbiAgICBkaXJlY3Rpb246IElneExpc3RQYW5TdGF0ZTtcbiAgICBrZWVwSXRlbTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBpZ3hMaXN0VGh1bWJuYWlsIGlzIGNvbnRhaW5lciBmb3IgdGhlIExpc3QgbWVkaWFcbiAqIFVzZSBpdCB0byB3cmFwIGFueXRoaW5nIHlvdSB3YW50IHRvIGJlIHVzZWQgYXMgYSB0aHVtYm5haWwuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXG4gICAgc2VsZWN0b3I6ICdbaWd4TGlzdFRodW1ibmFpbF0nXG59KVxuZXhwb3J0IGNsYXNzIElneExpc3RUaHVtYm5haWxEaXJlY3RpdmUge31cblxuLyoqXG4gKiBpZ3hMaXN0QWN0aW9uIGlzIGNvbnRhaW5lciBmb3IgdGhlIExpc3QgYWN0aW9uXG4gKiBVc2UgaXQgdG8gd3JhcCBhbnl0aGluZyB5b3Ugd2FudCB0byBiZSB1c2VkIGFzIGEgbGlzdCBhY3Rpb246IGljb24sIGNoZWNrYm94Li4uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXG4gICAgc2VsZWN0b3I6ICdbaWd4TGlzdEFjdGlvbl0nXG59KVxuZXhwb3J0IGNsYXNzIElneExpc3RBY3Rpb25EaXJlY3RpdmUge31cblxuLyoqXG4gKiBpZ3hMaXN0TGluZSBpcyBjb250YWluZXIgZm9yIHRoZSBMaXN0IHRleHQgY29udGVudFxuICogVXNlIGl0IHRvIHdyYXAgYW55dGhpbmcgeW91IHdhbnQgdG8gYmUgdXNlZCBhcyBhIHBsYW5lIHRleHQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXG4gICAgc2VsZWN0b3I6ICdbaWd4TGlzdExpbmVdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hMaXN0TGluZURpcmVjdGl2ZSB7fVxuXG4vKipcbiAqIGlneExpc3RMaW5lVGl0bGUgaXMgYSBkaXJlY3RpdmUgdGhhdCBhZGQgY2xhc3MgdG8gdGhlIHRhcmdldCBlbGVtZW50XG4gKiBVc2UgaXQgdG8gbWFrZSBhbnl0aGluZyB0byBsb29rIGxpa2UgbGlzdCBUaXRsZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcbiAgICBzZWxlY3RvcjogJ1tpZ3hMaXN0TGluZVRpdGxlXSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4TGlzdExpbmVUaXRsZURpcmVjdGl2ZSB7XG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtbGlzdF9faXRlbS1saW5lLXRpdGxlJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LWxpc3RfX2l0ZW0tbGluZS10aXRsZSc7XG59XG5cbi8qKlxuICogaWd4TGlzdExpbmVTdWJUaXRsZSBpcyBhIGRpcmVjdGl2ZSB0aGF0IGFkZCBjbGFzcyB0byB0aGUgdGFyZ2V0IGVsZW1lbnRcbiAqIFVzZSBpdCB0byBtYWtlIGFueXRoaW5nIHRvIGxvb2sgbGlrZSBsaXN0IFN1YnRpdGxlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxuICAgIHNlbGVjdG9yOiAnW2lneExpc3RMaW5lU3ViVGl0bGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hMaXN0TGluZVN1YlRpdGxlRGlyZWN0aXZlIHtcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1saXN0X19pdGVtLWxpbmUtc3VidGl0bGUnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtbGlzdF9faXRlbS1saW5lLXN1YnRpdGxlJztcbn1cblxuLyoqXG4gKiBEaXNwbGF5cyBhIGNvbGxlY3Rpb24gb2YgZGF0YSBpdGVtcyBpbiBhIHRlbXBsYXRhYmxlIGxpc3QgZm9ybWF0XG4gKlxuICogQGlneE1vZHVsZSBJZ3hMaXN0TW9kdWxlXG4gKlxuICogQGlneFRoZW1lIGlneC1saXN0LXRoZW1lXG4gKlxuICogQGlneEtleXdvcmRzIGxpc3QsIGRhdGFcbiAqXG4gKiBAaWd4R3JvdXAgR3JpZHMgJiBMaXN0c1xuICpcbiAqIEByZW1hcmtzXG4gKiBUaGUgSWduaXRlIFVJIExpc3QgZGlzcGxheXMgcm93cyBvZiBpdGVtcyBhbmQgc3VwcG9ydHMgb25lIG9yIG1vcmUgaGVhZGVyIGl0ZW1zIGFzIHdlbGwgYXMgc2VhcmNoIGFuZCBmaWx0ZXJpbmdcbiAqIG9mIGxpc3QgaXRlbXMuIEVhY2ggbGlzdCBpdGVtIGlzIGNvbXBsZXRlbHkgdGVtcGxhdGFibGUgYW5kIHdpbGwgc3VwcG9ydCBhbnkgdmFsaWQgSFRNTCBvciBBbmd1bGFyIGNvbXBvbmVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgaHRtbFxuICogPGlneC1saXN0PlxuICogICA8aWd4LWxpc3QtaXRlbSBpc0hlYWRlcj1cInRydWVcIj5Db250YWN0czwvaWd4LWxpc3QtaXRlbT5cbiAqICAgPGlneC1saXN0LWl0ZW0gKm5nRm9yPVwibGV0IGNvbnRhY3Qgb2YgY29udGFjdHNcIj5cbiAqICAgICA8c3BhbiBjbGFzcz1cIm5hbWVcIj57eyBjb250YWN0Lm5hbWUgfX08L3NwYW4+XG4gKiAgICAgPHNwYW4gY2xhc3M9XCJwaG9uZVwiPnt7IGNvbnRhY3QucGhvbmUgfX08L3NwYW4+XG4gKiAgIDwvaWd4LWxpc3QtaXRlbT5cbiAqIDwvaWd4LWxpc3Q+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtbGlzdCcsXG4gICAgdGVtcGxhdGVVcmw6ICdsaXN0LmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IElneExpc3RCYXNlRGlyZWN0aXZlLCB1c2VFeGlzdGluZzogSWd4TGlzdENvbXBvbmVudCB9XVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hMaXN0Q29tcG9uZW50IGV4dGVuZHMgSWd4TGlzdEJhc2VEaXJlY3RpdmUge1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjb2xsZWN0aW9uIG9mIGFsbCBpdGVtcyBhbmQgaGVhZGVycyBpbiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBsaXN0Q2hpbGRyZW46IFF1ZXJ5TGlzdCA9IHRoaXMubGlzdC5jaGlsZHJlbjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gSWd4TGlzdEl0ZW1Db21wb25lbnQpLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIGNoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4TGlzdEl0ZW1Db21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBlbXB0eSBsaXN0IHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIHRlbXBsYXRlIGlzIHVzZWQgYnkgSWd4TGlzdCBpbiBjYXNlIHRoZXJlIGFyZSBubyBsaXN0IGl0ZW1zXG4gICAgICogZGVmaW5lZCBhbmQgYGlzTG9hZGluZ2AgaXMgc2V0IHRvIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpc3Q+XG4gICAgICogICA8bmctdGVtcGxhdGUgaWd4RW1wdHlMaXN0PlxuICAgICAqICAgICA8cCBjbGFzcz1cImVtcHR5XCI+Tm8gY29udGFjdHMhIDooPC9wPlxuICAgICAqICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiA8L2lneC1saXN0PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgZW1wdHlUZW1wbGF0ZSA9IHRoaXMubGlzdC5lbXB0eUxpc3RUZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneEVtcHR5TGlzdFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneEVtcHR5TGlzdFRlbXBsYXRlRGlyZWN0aXZlIH0pXG4gICAgcHVibGljIGVtcHR5TGlzdFRlbXBsYXRlOiBJZ3hFbXB0eUxpc3RUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgbGlzdCBsb2FkaW5nIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIHRlbXBsYXRlIGlzIHVzZWQgYnkgSWd4TGlzdCBpbiBjYXNlIHRoZXJlIGFyZSBubyBsaXN0IGl0ZW1zIGRlZmluZWQgYW5kIGBpc0xvYWRpbmdgIGlzIHNldCB0byBgdHJ1ZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpc3Q+XG4gICAgICogICA8bmctdGVtcGxhdGUgaWd4RGF0YUxvYWRpbmc+XG4gICAgICogICAgIDxwPlBhdGllbmNlLCB3ZSBhcmUgY3VycmVudGx5IGxvYWRpbmcgeW91ciBkYXRhLi4uPC9wPlxuICAgICAqICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiA8L2lneC1saXN0PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbG9hZGluZ1RlbXBsYXRlID0gdGhpcy5saXN0LmRhdGFMb2FkaW5nVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hEYXRhTG9hZGluZ1RlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneERhdGFMb2FkaW5nVGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgZGF0YUxvYWRpbmdUZW1wbGF0ZTogSWd4RGF0YUxvYWRpbmdUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgdGVtcGxhdGUgZm9yIGxlZnQgcGFubmluZyBhIGxpc3QgaXRlbS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgbnVsbGAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpc3QgW2FsbG93TGVmdFBhbm5pbmddPVwidHJ1ZVwiPlxuICAgICAqICAgPG5nLXRlbXBsYXRlIGlneExpc3RJdGVtTGVmdFBhbm5pbmc+XG4gICAgICogICAgIDxpZ3gtaWNvbj5kZWxldGU8L2lneC1pY29uPkRlbGV0ZVxuICAgICAqICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgKiA8L2lneC1saXN0PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXRlbUxlZnRQYW5UbXBsID0gdGhpcy5saXN0Lmxpc3RJdGVtTGVmdFBhbm5pbmdUZW1wbGF0ZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneExpc3RJdGVtTGVmdFBhbm5pbmdUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBJZ3hMaXN0SXRlbUxlZnRQYW5uaW5nVGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgbGlzdEl0ZW1MZWZ0UGFubmluZ1RlbXBsYXRlOiBJZ3hMaXN0SXRlbUxlZnRQYW5uaW5nVGVtcGxhdGVEaXJlY3RpdmU7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIHRlbXBsYXRlIGZvciByaWdodCBwYW5uaW5nIGEgbGlzdCBpdGVtLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGlzdCBbYWxsb3dSaWdodFBhbm5pbmddID0gXCJ0cnVlXCI+XG4gICAgICogICA8bmctdGVtcGxhdGUgaWd4TGlzdEl0ZW1SaWdodFBhbm5pbmc+XG4gICAgICogICAgIDxpZ3gtaWNvbj5jYWxsPC9pZ3gtaWNvbj5EaWFsXG4gICAgICogICA8L25nLXRlbXBsYXRlPlxuICAgICAqIDwvaWd4LWxpc3Q+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpdGVtUmlnaHRQYW5UbXBsID0gdGhpcy5saXN0Lmxpc3RJdGVtUmlnaHRQYW5uaW5nVGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hMaXN0SXRlbVJpZ2h0UGFubmluZ1RlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IElneExpc3RJdGVtUmlnaHRQYW5uaW5nVGVtcGxhdGVEaXJlY3RpdmUgfSlcbiAgICBwdWJsaWMgbGlzdEl0ZW1SaWdodFBhbm5pbmdUZW1wbGF0ZTogSWd4TGlzdEl0ZW1SaWdodFBhbm5pbmdUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIGEgdGhyZXNob2xkIGFmdGVyIHdoaWNoIHRoZSBpdGVtJ3MgcGFubmluZyB3aWxsIGJlIGNvbXBsZXRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IHRoaXMgcHJvcGVydHkgaXMgc2V0IHRvIDAuNSB3aGljaCBpcyA1MCUgb2YgdGhlIGxpc3QgaXRlbSdzIHdpZHRoLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saXN0IFtwYW5FbmRUcmlnZ2VyaW5nVGhyZXNob2xkXT1cIjAuOFwiPjwvaWd4LWxpc3Q+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcGFuRW5kVHJpZ2dlcmluZ1RocmVzaG9sZCA9IDAuNTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGlkYCBvZiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSWYgbm90IHNldCwgdGhlIGBpZGAgb2YgdGhlIGZpcnN0IGxpc3QgY29tcG9uZW50IHdpbGwgYmUgYFwiaWd4LWxpc3QtMFwiYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGlzdCBpZD1cIm15LWZpcnN0LWxpc3RcIj48L2lneC1saXN0PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbGlzdElkID0gdGhpcy5saXN0LmlkO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5pZCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWQgPSBgaWd4LWxpc3QtJHtORVhUX0lEKyt9YDtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSBsZWZ0IHBhbm5pbmcgb2YgYW4gaXRlbSBpcyBhbGxvd2VkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpc3QgW2FsbG93TGVmdFBhbm5pbmddPVwidHJ1ZVwiPjwvaWd4LWxpc3Q+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0xlZnRQYW5uaW5nQWxsb3dlZCA9IHRoaXMubGlzdC5hbGxvd0xlZnRQYW5uaW5nO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGFsbG93TGVmdFBhbm5pbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB3aGV0aGVyIHRoZSByaWdodCBwYW5uaW5nIG9mIGFuIGl0ZW0gaXMgYWxsb3dlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saXN0IFthbGxvd1JpZ2h0UGFubmluZ109XCJ0cnVlXCI+PC9pZ3gtbGlzdD5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGlzUmlnaHRQYW5uaW5nQWxsb3dlZCA9IHRoaXMubGlzdC5hbGxvd1JpZ2h0UGFubmluZztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBhbGxvd1JpZ2h0UGFubmluZyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGxpc3QgaXMgY3VycmVudGx5IGxvYWRpbmcgZGF0YS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogU2V0IGl0IHRvIGRpc3BsYXkgdGhlIGRhdGFMb2FkaW5nVGVtcGxhdGUgd2hpbGUgZGF0YSBpcyBiZWluZyByZXRyaWV2ZWQuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtbGlzdCBbaXNMb2FkaW5nXT1cInRydWVcIj48L2lneC1saXN0PlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNMb2FkaW5nID0gdGhpcy5saXN0LmlzTG9hZGluZztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpc0xvYWRpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGxlZnQgcGFuIGdlc3R1cmUgaXMgZXhlY3V0ZWQgb24gYSBsaXN0IGl0ZW0uXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFByb3ZpZGVzIGEgcmVmZXJlbmNlIHRvIGFuIG9iamVjdCBvZiB0eXBlIGBJTGlzdEl0ZW1QYW5uaW5nRXZlbnRBcmdzYCBhcyBhbiBldmVudCBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGlzdCBbYWxsb3dMZWZ0UGFubmluZ109XCJ0cnVlXCIgKGxlZnRQYW4pPVwibGVmdFBhbigkZXZlbnQpXCI+PC9pZ3gtbGlzdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbGVmdFBhbiA9IG5ldyBFdmVudEVtaXR0ZXI8SUxpc3RJdGVtUGFubmluZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIHJpZ2h0IHBhbiBnZXN0dXJlIGlzIGV4ZWN1dGVkIG9uIGEgbGlzdCBpdGVtLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBQcm92aWRlcyBhIHJlZmVyZW5jZSB0byBhbiBvYmplY3Qgb2YgdHlwZSBgSUxpc3RJdGVtUGFubmluZ0V2ZW50QXJnc2AgYXMgYW4gZXZlbnQgYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpc3QgW2FsbG93UmlnaHRQYW5uaW5nXT1cInRydWVcIiAocmlnaHRQYW4pPVwicmlnaHRQYW4oJGV2ZW50KVwiPjwvaWd4LWxpc3Q+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJpZ2h0UGFuID0gbmV3IEV2ZW50RW1pdHRlcjxJTGlzdEl0ZW1QYW5uaW5nRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgZW1pdHRlZCB3aGVuIGEgcGFuIGdlc3R1cmUgaXMgc3RhcnRlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUHJvdmlkZXMgYSByZWZlcmVuY2UgdG8gYW4gb2JqZWN0IG9mIHR5cGUgYElMaXN0SXRlbVBhbm5pbmdFdmVudEFyZ3NgIGFzIGFuIGV2ZW50IGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saXN0IChzdGFydFBhbik9XCJzdGFydFBhbigkZXZlbnQpXCI+PC9pZ3gtbGlzdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc3RhcnRQYW4gPSBuZXcgRXZlbnRFbWl0dGVyPElMaXN0SXRlbVBhbm5pbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gYSBwYW4gZ2VzdHVyZSBpcyBjb21wbGV0ZWQgb3IgY2FuY2VsZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFByb3ZpZGVzIGEgcmVmZXJlbmNlIHRvIGFuIG9iamVjdCBvZiB0eXBlIGBJTGlzdEl0ZW1QYW5uaW5nRXZlbnRBcmdzYCBhcyBhbiBldmVudCBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGlzdCAoZW5kUGFuKT1cImVuZFBhbigkZXZlbnQpXCI+PC9pZ3gtbGlzdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZW5kUGFuID0gbmV3IEV2ZW50RW1pdHRlcjxJTGlzdEl0ZW1QYW5uaW5nRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnQgZW1pdHRlZCB3aGVuIGEgcGFuIGl0ZW0gaXMgcmV0dXJuZWQgdG8gaXRzIG9yaWdpbmFsIHBvc2l0aW9uLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBQcm92aWRlcyBhIHJlZmVyZW5jZSB0byBhbiBvYmplY3Qgb2YgdHlwZSBgSWd4TGlzdENvbXBvbmVudGAgYXMgYW4gZXZlbnQgYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWxpc3QgKHJlc2V0UGFuKT1cInJlc2V0UGFuKCRldmVudClcIj48L2lneC1saXN0PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBAT3V0cHV0KClcbiAgICAgcHVibGljIHJlc2V0UGFuID0gbmV3IEV2ZW50RW1pdHRlcjxJZ3hMaXN0Q29tcG9uZW50PigpO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gYSBwYW4gZ2VzdHVyZSBpcyBleGVjdXRlZCBvbiBhIGxpc3QgaXRlbS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogUHJvdmlkZXMgcmVmZXJlbmNlcyB0byB0aGUgYElneExpc3RJdGVtQ29tcG9uZW50YCBhbmQgYElneExpc3RQYW5TdGF0ZWAgYXMgZXZlbnQgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1saXN0IChwYW5TdGF0ZUNoYW5nZSk9XCJwYW5TdGF0ZUNoYW5nZSgkZXZlbnQpXCI+PC9pZ3gtbGlzdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcGFuU3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPElQYW5TdGF0ZUNoYW5nZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGxpc3QgaXRlbSBpcyBjbGlja2VkLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBQcm92aWRlcyByZWZlcmVuY2VzIHRvIHRoZSBgSWd4TGlzdEl0ZW1Db21wb25lbnRgIGFuZCBgRXZlbnRgIGFzIGV2ZW50IGFyZ3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtbGlzdCAoaXRlbUNsaWNrZWQpPVwib25JdGVtQ2xpY2tlZCgkZXZlbnQpXCI+PC9pZ3gtbGlzdD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgaXRlbUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElMaXN0SXRlbUNsaWNrRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRFbXB0eUxpc3QnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdEVtcHR5TGlzdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHREYXRhTG9hZGluZycsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBkZWZhdWx0RGF0YUxvYWRpbmdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHByaXZhdGUgX3Jlc291cmNlU3RyaW5ncyA9IEN1cnJlbnRSZXNvdXJjZVN0cmluZ3MuTGlzdFJlc1N0cmluZ3M7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqIEJ5IGRlZmF1bHQgaXQgdXNlcyBFTiByZXNvdXJjZXMuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHJlc291cmNlU3RyaW5ncyh2YWx1ZTogSUxpc3RSZXNvdXJjZVN0cmluZ3MpIHtcbiAgICAgICAgdGhpcy5fcmVzb3VyY2VTdHJpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fcmVzb3VyY2VTdHJpbmdzLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlU3RyaW5ncygpOiBJTGlzdFJlc291cmNlU3RyaW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZVN0cmluZ3M7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRGlzcGxheURlbnNpdHlUb2tlbikgcHJvdGVjdGVkIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnM6IElEaXNwbGF5RGVuc2l0eU9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXQgc29ydGVkQ2hpbGRyZW4oKTogSWd4TGlzdEl0ZW1Db21wb25lbnRbXSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnRvQXJyYXkoKVxuICAgICAgICAgICAgICAgIC5zb3J0KChhOiBJZ3hMaXN0SXRlbUNvbXBvbmVudCwgYjogSWd4TGlzdEl0ZW1Db21wb25lbnQpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBgcm9sZWAgYXR0cmlidXRlIHZhbHVlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGxpc3RSb2xlID0gIHRoaXMubGlzdC5yb2xlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBwdWJsaWMgZ2V0IHJvbGUoKSB7XG4gICAgICAgIHJldHVybiAnbGlzdCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgbGlzdCBpcyBlbXB0eS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBpc0VtcHR5ID0gIHRoaXMubGlzdC5pc0xpc3RFbXB0eTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1saXN0LS1lbXB0eScpXG4gICAgcHVibGljIGdldCBpc0xpc3RFbXB0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNoaWxkcmVuIHx8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1saXN0JylcbiAgICBwdWJsaWMgZ2V0IGNzc0NsYXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNMaXN0RW1wdHkgJiYgdGhpcy5kaXNwbGF5RGVuc2l0eSA9PT0gRGlzcGxheURlbnNpdHkuY29tZm9ydGFibGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWxpc3QtLWNvbXBhY3QnKVxuICAgIHB1YmxpYyBnZXQgY3NzQ2xhc3NDb21wYWN0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNMaXN0RW1wdHkgJiYgdGhpcy5kaXNwbGF5RGVuc2l0eSA9PT0gRGlzcGxheURlbnNpdHkuY29tcGFjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtbGlzdC0tY29zeScpXG4gICAgcHVibGljIGdldCBjc3NDbGFzc0Nvc3koKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0xpc3RFbXB0eSAmJiB0aGlzLmRpc3BsYXlEZW5zaXR5ID09PSBEaXNwbGF5RGVuc2l0eS5jb3N5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxpc3QgYGl0ZW1zYCBleGNsdWRpbmcgdGhlIGhlYWRlciBvbmVzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGxpc3RJdGVtczogSWd4TGlzdEl0ZW1Db21wb25lbnRbXSA9IHRoaXMubGlzdC5pdGVtcztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGl0ZW1zKCk6IElneExpc3RJdGVtQ29tcG9uZW50W10ge1xuICAgICAgICBjb25zdCBpdGVtczogSWd4TGlzdEl0ZW1Db21wb25lbnRbXSA9IFtdO1xuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuc29ydGVkQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkLmlzSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgaGVhZGVyIGxpc3QgYGl0ZW1zYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBsaXN0SGVhZGVyczogSWd4TGlzdEl0ZW1Db21wb25lbnRbXSA9ICB0aGlzLmxpc3QuaGVhZGVycztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRlcnMoKTogSWd4TGlzdEl0ZW1Db21wb25lbnRbXSB7XG4gICAgICAgIGNvbnN0IGhlYWRlcnM6IElneExpc3RJdGVtQ29tcG9uZW50W10gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5pc0hlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBgY29udGV4dGAgb2JqZWN0IG9mIHRoZSB0ZW1wbGF0ZSBiaW5kaW5nLlxuICAgICAqXG4gICAgICogQHJlbWFya1xuICAgICAqIEdldHMgdGhlIGBjb250ZXh0YCBvYmplY3Qgd2hpY2ggcmVwcmVzZW50cyB0aGUgYHRlbXBsYXRlIGNvbnRleHRgIGJpbmRpbmcgaW50byB0aGUgYGxpc3QgY29udGFpbmVyYFxuICAgICAqIGJ5IHByb3ZpZGluZyB0aGUgYCRpbXBsaWNpdGAgZGVjbGFyYXRpb24gd2hpY2ggaXMgdGhlIGBJZ3hMaXN0Q29tcG9uZW50YCBpdHNlbGYuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbGlzdENvbXBvbmVudCA9ICB0aGlzLmxpc3QuY29udGV4dDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGNvbnRleHQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICRpbXBsaWNpdDogdGhpc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBgVGVtcGxhdGVSZWZgIHRvIHRoZSBjdXJyZW50bHkgdXNlZCB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBsaXN0VGVtcGxhdGUgPSB0aGlzLmxpc3QudGVtcGxhdGU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhTG9hZGluZ1RlbXBsYXRlID8gdGhpcy5kYXRhTG9hZGluZ1RlbXBsYXRlLnRlbXBsYXRlIDogdGhpcy5kZWZhdWx0RGF0YUxvYWRpbmdUZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVtcHR5TGlzdFRlbXBsYXRlID8gdGhpcy5lbXB0eUxpc3RUZW1wbGF0ZS50ZW1wbGF0ZSA6IHRoaXMuZGVmYXVsdEVtcHR5TGlzdFRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4TGlzdEJhc2VEaXJlY3RpdmUsXG4gICAgICAgIElneExpc3RDb21wb25lbnQsXG4gICAgICAgIElneExpc3RJdGVtQ29tcG9uZW50LFxuICAgICAgICBJZ3hMaXN0VGh1bWJuYWlsRGlyZWN0aXZlLFxuICAgICAgICBJZ3hMaXN0QWN0aW9uRGlyZWN0aXZlLFxuICAgICAgICBJZ3hMaXN0TGluZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4TGlzdExpbmVUaXRsZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4TGlzdExpbmVTdWJUaXRsZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4RGF0YUxvYWRpbmdUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4RW1wdHlMaXN0VGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneExpc3RJdGVtTGVmdFBhbm5pbmdUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4TGlzdEl0ZW1SaWdodFBhbm5pbmdUZW1wbGF0ZURpcmVjdGl2ZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hMaXN0Q29tcG9uZW50LFxuICAgICAgICBJZ3hMaXN0SXRlbUNvbXBvbmVudCxcbiAgICAgICAgSWd4TGlzdFRodW1ibmFpbERpcmVjdGl2ZSxcbiAgICAgICAgSWd4TGlzdEFjdGlvbkRpcmVjdGl2ZSxcbiAgICAgICAgSWd4TGlzdExpbmVEaXJlY3RpdmUsXG4gICAgICAgIElneExpc3RMaW5lVGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneExpc3RMaW5lU3ViVGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneERhdGFMb2FkaW5nVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneEVtcHR5TGlzdFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hMaXN0SXRlbUxlZnRQYW5uaW5nVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIElneExpc3RJdGVtUmlnaHRQYW5uaW5nVGVtcGxhdGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBJZ3hSaXBwbGVNb2R1bGVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIElneExpc3RNb2R1bGUge1xufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuXG48bmctdGVtcGxhdGUgI2RlZmF1bHRFbXB0eUxpc3Q+XG4gICAgPGFydGljbGUgY2xhc3M9XCJpZ3gtbGlzdF9fbWVzc2FnZVwiPlxuICAgICAgICB7e3Jlc291cmNlU3RyaW5ncy5pZ3hfbGlzdF9ub19pdGVtc319XG4gICAgPC9hcnRpY2xlPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0RGF0YUxvYWRpbmc+XG4gICAgPGFydGljbGUgY2xhc3M9XCJpZ3gtbGlzdF9fbWVzc2FnZVwiPlxuICAgICAgICB7e3Jlc291cmNlU3RyaW5ncy5pZ3hfbGlzdF9sb2FkaW5nfX1cbiAgICA8L2FydGljbGU+XG48L25nLXRlbXBsYXRlPlxuXG48bmctY29udGFpbmVyICpuZ0lmPVwiIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCBpc0xvYWRpbmdcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IGNvbnRleHRcIj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbjwvbmctY29udGFpbmVyPlxuIl19