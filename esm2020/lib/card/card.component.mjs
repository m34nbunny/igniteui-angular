import { CommonModule } from '@angular/common';
import { Component, Directive, HostBinding, Optional, Inject, Input, NgModule } from '@angular/core';
import { IgxButtonModule } from '../directives/button/button.directive';
import { mkenum } from '../core/utils';
import * as i0 from "@angular/core";
let NEXT_ID = 0;
/**
 * IgxCardMedia is container for the card media section.
 * Use it to wrap images and videos.
 */
export class IgxCardMediaDirective {
    constructor() {
        /** @hidden @internal */
        this.cssClass = 'igx-card__media';
        /**
         * An @Input property that sets the `width` and `min-width` style property
         * of the media container. If not provided it will be set to `auto`.
         *
         * @example
         * ```html
         * <igx-card-media width="300px"></igx-card-media>
         * ```
         */
        this.width = 'auto';
        /**
         * An @Input property that sets the `height` style property of the media container.
         * If not provided it will be set to `auto`.
         *
         * @example
         * ```html
         * <igx-card-media height="50%"></igx-card-media>
         * ```
         */
        this.height = 'auto';
        /**
         * An @Input property that sets the `role` attribute of the media container.
         */
        this.role = 'img';
    }
}
IgxCardMediaDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardMediaDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxCardMediaDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardMediaDirective, selector: "igx-card-media", inputs: { width: "width", height: "height", role: "role" }, host: { properties: { "class.igx-card__media": "this.cssClass", "style.width": "this.width", "style.min-width": "this.width", "style.height": "this.height", "attr.role": "this.role" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardMediaDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'igx-card-media'
                }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-card__media']
            }], width: [{
                type: HostBinding,
                args: ['style.width']
            }, {
                type: HostBinding,
                args: ['style.min-width']
            }, {
                type: Input
            }], height: [{
                type: HostBinding,
                args: ['style.height']
            }, {
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }] } });
/**
 * IgxCardHeader is container for the card header
 */
export class IgxCardHeaderComponent {
    constructor() {
        /** @hidden @internal */
        this.cssClass = 'igx-card-header';
        /**
         * An @Input property that sets the layout style of the header.
         * By default the header elements(thumbnail and title/subtitle) are aligned horizontally.
         *
         * @example
         * ```html
         * <igx-card-header [vertical]="true"></igx-card-header>
         * ```
         */
        this.vertical = false;
        /**
         * An @Input property that sets the value of the `role` attribute of the card header.
         * By default the value is set to `header`.
         *
         * @example
         * ```html
         * <igx-card-header role="header"></igx-card-header>
         * ```
         */
        this.role = 'header';
    }
}
IgxCardHeaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxCardHeaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardHeaderComponent, selector: "igx-card-header", inputs: { vertical: "vertical" }, host: { properties: { "class.igx-card-header": "this.cssClass", "class.igx-card-header--vertical": "this.vertical", "attr.role": "this.role" } }, ngImport: i0, template: "<div class=\"igx-card-header__thumbnail\">\n    <ng-content select=\"igx-avatar, igx-card-media, [igxCardThumbnail]\"></ng-content>\n</div>\n\n<div class=\"igx-card-header__titles\">\n    <ng-content select=\"\n        [igxCardHeaderTitle],\n        [igxCardHeaderSubtitle],\n        .igx-card-header__title,\n        .igx-card-header__subtitle\">\n    </ng-content>\n</div>\n\n<ng-content></ng-content>\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-card-header', template: "<div class=\"igx-card-header__thumbnail\">\n    <ng-content select=\"igx-avatar, igx-card-media, [igxCardThumbnail]\"></ng-content>\n</div>\n\n<div class=\"igx-card-header__titles\">\n    <ng-content select=\"\n        [igxCardHeaderTitle],\n        [igxCardHeaderSubtitle],\n        .igx-card-header__title,\n        .igx-card-header__subtitle\">\n    </ng-content>\n</div>\n\n<ng-content></ng-content>\n" }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-card-header']
            }], vertical: [{
                type: HostBinding,
                args: ['class.igx-card-header--vertical']
            }, {
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }] } });
/**
 * IgxCardThumbnail is container for the card thumbnail section.
 * Use it to wrap anything you want to be used as a thumbnail.
 */
export class IgxCardThumbnailDirective {
}
IgxCardThumbnailDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardThumbnailDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxCardThumbnailDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardThumbnailDirective, selector: "[igxCardThumbnail]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardThumbnailDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxCardThumbnail]'
                }]
        }] });
/**
 * igxCardHeaderTitle is used to denote the header title in a card.
 * Use it to tag text nodes.
 */
export class IgxCardHeaderTitleDirective {
    constructor() {
        /** @hidden @internal */
        this.cssClass = 'igx-card__header__title';
    }
}
IgxCardHeaderTitleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardHeaderTitleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxCardHeaderTitleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardHeaderTitleDirective, selector: "[igxCardHeaderTitle]", host: { properties: { "class.igx-card-header__title": "this.cssClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardHeaderTitleDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxCardHeaderTitle]'
                }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-card-header__title']
            }] } });
/**
 * igxCardHeaderSubtitle is used to denote the header subtitle in a card.
 * Use it to tag text nodes.
 */
export class IgxCardHeaderSubtitleDirective {
    constructor() {
        /** @hidden @internal */
        this.cssClass = 'igx-card-header__subtitle';
    }
}
IgxCardHeaderSubtitleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardHeaderSubtitleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxCardHeaderSubtitleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardHeaderSubtitleDirective, selector: "[igxCardHeaderSubtitle]", host: { properties: { "class.igx-card-header__subtitle": "this.cssClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardHeaderSubtitleDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxCardHeaderSubtitle]'
                }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-card-header__subtitle']
            }] } });
/**
 * IgxCardContent is container for the card content.
 */
export class IgxCardContentDirective {
    constructor() {
        /** @hidden @internal */
        this.cssClass = 'igx-card-content';
    }
}
IgxCardContentDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardContentDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxCardContentDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardContentDirective, selector: "igx-card-content", host: { properties: { "class.igx-card-content": "this.cssClass" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardContentDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'igx-card-content'
                }]
        }], propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-card-content']
            }] } });
/**
 * IgxCardFooter is container for the card footer
 */
export class IgxCardFooterDirective {
    constructor() {
        /**
         * An @Input property that sets the value of the `role` attribute of the card footer.
         * By default the value is set to `footer`.
         *
         * @example
         * ```html
         * <igx-card-footer role="footer"></igx-card-footer>
         * ```
         */
        this.role = 'footer';
    }
}
IgxCardFooterDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardFooterDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxCardFooterDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardFooterDirective, selector: "igx-card-footer", inputs: { role: "role" }, host: { properties: { "attr.role": "this.role" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardFooterDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'igx-card-footer'
                }]
        }], propDecorators: { role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }] } });
/**
 * Card provides a way to display organized content in appealing way.
 *
 * @igxModule IgxCardModule
 *
 * @igxTheme igx-card-theme, igx-icon-theme, igx-button-theme
 *
 * @igxKeywords card, button, avatar, icon
 *
 * @igxGroup Layouts
 *
 * @remarks
 * The Ignite UI Card serves as a container that allows custom content to be organized in an appealing way. There are
 * five sections in a card that you can use to organize your content. These are header, media, content, actions, and footer.
 *
 * @example
 * ```html
 * <igx-card>
 *   <igx-card-header>
 *     <h3 igxCardHeaderTitle>{{title}}</h3>
 *     <h5 igxCardHeaderSubtitle>{{subtitle}}</h5>
 *   </igx-card-header>
 *   <igx-card-actions>
 *       <button igxButton igxRipple>Share</button>
 *       <button igxButton igxRipple>Play Album</button>
 *   </igx-card-actions>
 * </igx-card>
 * ```
 */
export const IgxCardType = mkenum({
    ELEVATED: 'elevated',
    OUTLINED: 'outlined'
});
export class IgxCardComponent {
    constructor() {
        /**
         * Sets/gets the `id` of the card.
         * If not set, `id` will have value `"igx-card-0"`;
         *
         * @example
         * ```html
         * <igx-card id = "my-first-card"></igx-card>
         * ```
         * ```typescript
         * let cardId =  this.card.id;
         * ```
         */
        this.id = `igx-card-${NEXT_ID++}`;
        /**
         * An @Input property that sets the value of the `role` attribute of the card.
         * By default the value is set to `group`.
         *
         * @example
         * ```html
         * <igx-card role="group"></igx-card>
         * ```
         */
        this.role = 'group';
        /**
         * An @Input property that sets the value of the `type` attribute of the card.
         * By default the value is set to `elevated`. You can make the card use the
         * outlined style by setting the value to `outlined`.
         *
         * @example
         * ```html
         * <igx-card type="outlined"></igx-card>
         * ```
         */
        this.type = IgxCardType.ELEVATED;
        /**
         * An @Input property that sets the value of the `horizontal` attribute of the card.
         * Setting this to `true` will make the different card sections align horizontally,
         * essentially flipping the card to the side.
         *
         * @example
         * ```html
         * <igx-card [horizontal]="true"></igx-card>
         * ```
         */
        this.horizontal = false;
    }
    /**
     * A getter which will return true if the card type is `outlined`.
     */
    get isOutlinedCard() {
        return this.type === IgxCardType.OUTLINED;
    }
}
IgxCardComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IgxCardComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardComponent, selector: "igx-card", inputs: { id: "id", role: "role", type: "type", horizontal: "horizontal" }, host: { properties: { "attr.id": "this.id", "attr.role": "this.role", "class.igx-card": "this.type", "class.igx-card--outlined": "this.isOutlinedCard", "class.igx-card--horizontal": "this.horizontal" } }, ngImport: i0, template: "<ng-content></ng-content>\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-card', template: "<ng-content></ng-content>\n" }]
        }], propDecorators: { id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }, {
                type: Input
            }], type: [{
                type: HostBinding,
                args: ['class.igx-card']
            }, {
                type: Input
            }], isOutlinedCard: [{
                type: HostBinding,
                args: ['class.igx-card--outlined']
            }], horizontal: [{
                type: HostBinding,
                args: ['class.igx-card--horizontal']
            }, {
                type: Input
            }] } });
export const IgxCardActionsLayout = mkenum({
    START: 'start',
    JUSTIFY: 'justify'
});
/**
 * IgxCardActions is container for the card actions.
 */
export class IgxCardActionsComponent {
    constructor(card) {
        this.card = card;
        /**
         * An @Input property that sets the layout style of the actions.
         * By default icons and icon buttons, as well as regular buttons
         * are split into two containers, which are then positioned on both ends
         * of the card-actions area.
         * You can justify the elements in those groups so they are positioned equally
         * from one another taking up all the space available along the card actions axis.
         *
         * @example
         * ```html
         * <igx-card-actions layout="justify"></igx-card-actions>
         * ```
         */
        this.layout = IgxCardActionsLayout.START;
        /**
         * An @Input property that sets the vertical attribute of the actions.
         * When set to `true` the actions will be layed out vertically.
         */
        this.vertical = false;
        /**
         * An @Input property that sets order of the buttons the actions area.
         * By default all icons/icon buttons are placed at the end of the action
         * area. Any regular buttons(flat, raised) will appear before the icons/icon buttons
         * placed in the actions area.
         * If you want to reverse their positions so that icons appear first, use the `reverse`
         * attribute.
         *
         * @example
         * ```html
         * <igx-card-actions [reverse]="true"></igx-card-actions>
         * ```
         */
        this.reverse = false;
        this.isVerticalSet = false;
    }
    /**
     * A getter that returns `true` when the layout has been
     * set to `justify`.
     */
    get isJustifyLayout() {
        return this.layout === IgxCardActionsLayout.JUSTIFY;
    }
    /**
     * @hidden
     * @internal
     */
    ngOnChanges(changes) {
        for (const prop in changes) {
            if (prop === 'vertical') {
                this.isVerticalSet = true;
            }
        }
    }
    /**
     * @hidden
     * @internal
     */
    ngOnInit() {
        if (!this.isVerticalSet && this.card.horizontal) {
            this.vertical = true;
        }
        ;
    }
}
IgxCardActionsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardActionsComponent, deps: [{ token: IgxCardComponent, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxCardActionsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxCardActionsComponent, selector: "igx-card-actions", inputs: { layout: "layout", vertical: "vertical", reverse: "reverse" }, host: { properties: { "class.igx-card-actions": "this.layout", "class.igx-card-actions--vertical": "this.vertical", "class.igx-card-actions--justify": "this.isJustifyLayout", "class.igx-card-actions--reverse": "this.reverse" } }, usesOnChanges: true, ngImport: i0, template: "<div class=\"igx-card-actions__icons\">\n    <ng-content select=\"igx-icon, [igxButton='icon']\"></ng-content>\n</div>\n\n<div #buttons class=\"igx-card-actions__buttons\">\n    <ng-content select=\"[igxButton]\"></ng-content>\n</div>\n\n\n<ng-content></ng-content>\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardActionsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-card-actions', template: "<div class=\"igx-card-actions__icons\">\n    <ng-content select=\"igx-icon, [igxButton='icon']\"></ng-content>\n</div>\n\n<div #buttons class=\"igx-card-actions__buttons\">\n    <ng-content select=\"[igxButton]\"></ng-content>\n</div>\n\n\n<ng-content></ng-content>\n" }]
        }], ctorParameters: function () { return [{ type: IgxCardComponent, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IgxCardComponent]
                }] }]; }, propDecorators: { layout: [{
                type: HostBinding,
                args: ['class.igx-card-actions']
            }, {
                type: Input
            }], vertical: [{
                type: HostBinding,
                args: ['class.igx-card-actions--vertical']
            }, {
                type: Input
            }], isJustifyLayout: [{
                type: HostBinding,
                args: ['class.igx-card-actions--justify']
            }], reverse: [{
                type: HostBinding,
                args: ['class.igx-card-actions--reverse']
            }, {
                type: Input
            }] } });
/**
 * @hidden
 */
export class IgxCardModule {
}
IgxCardModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxCardModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardModule, declarations: [IgxCardComponent, IgxCardHeaderComponent, IgxCardMediaDirective, IgxCardContentDirective, IgxCardActionsComponent, IgxCardFooterDirective, IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective, IgxCardThumbnailDirective], imports: [CommonModule, IgxButtonModule], exports: [IgxCardComponent, IgxCardHeaderComponent, IgxCardMediaDirective, IgxCardContentDirective, IgxCardActionsComponent, IgxCardFooterDirective, IgxCardHeaderTitleDirective, IgxCardHeaderSubtitleDirective, IgxCardThumbnailDirective] });
IgxCardModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardModule, imports: [[CommonModule, IgxButtonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxCardModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxCardComponent,
                        IgxCardHeaderComponent,
                        IgxCardMediaDirective,
                        IgxCardContentDirective,
                        IgxCardActionsComponent,
                        IgxCardFooterDirective,
                        IgxCardHeaderTitleDirective,
                        IgxCardHeaderSubtitleDirective,
                        IgxCardThumbnailDirective,
                    ],
                    exports: [
                        IgxCardComponent,
                        IgxCardHeaderComponent,
                        IgxCardMediaDirective,
                        IgxCardContentDirective,
                        IgxCardActionsComponent,
                        IgxCardFooterDirective,
                        IgxCardHeaderTitleDirective,
                        IgxCardHeaderSubtitleDirective,
                        IgxCardThumbnailDirective,
                    ],
                    imports: [CommonModule, IgxButtonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvY2FyZC9jYXJkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jYXJkL2NhcmQtaGVhZGVyLmNvbXBvbmVudC5odG1sIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NhcmQvY2FyZC5jb21wb25lbnQuaHRtbCIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9jYXJkL2NhcmQtYWN0aW9ucy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNILFNBQVMsRUFDVCxTQUFTLEVBQ1QsV0FBVyxFQUNYLFFBQVEsRUFDUixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFJWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFdkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBRWhCOzs7R0FHRztBQUtILE1BQU0sT0FBTyxxQkFBcUI7SUFKbEM7UUFLSSx3QkFBd0I7UUFFakIsYUFBUSxHQUFHLGlCQUFpQixDQUFDO1FBRXBDOzs7Ozs7OztXQVFHO1FBSUksVUFBSyxHQUFHLE1BQU0sQ0FBQztRQUV0Qjs7Ozs7Ozs7V0FRRztRQUdJLFdBQU0sR0FBRyxNQUFNLENBQUM7UUFFdkI7O1dBRUc7UUFHSSxTQUFJLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOztrSEF0Q1kscUJBQXFCO3NHQUFyQixx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LGdCQUFnQixFQTVJaEIsc0JBQXNCLEVBL0N0QixxQkFBcUIsRUF1SHJCLHVCQUF1QixFQXFKdkIsdUJBQXVCLEVBeEl2QixzQkFBc0IsRUF0Q3RCLDJCQUEyQixFQWEzQiw4QkFBOEIsRUF0QjlCLHlCQUF5QixhQWdTeEIsWUFBWSxFQUFFLGVBQWUsYUExTDlCLGdCQUFnQixFQTVJaEIsc0JBQXNCLEVBL0N0QixxQkFBcUIsRUF1SHJCLHVCQUF1QixFQXFKdkIsdUJBQXVCLEVBeEl2QixzQkFBc0IsRUF0Q3RCLDJCQUEyQixFQWEzQiw4QkFBOEIsRUF0QjlCLHlCQUF5QjsyR0FrU3pCLGFBQWEsWUFGYixDQUFDLFlBQVksRUFBRSxlQUFlLENBQUM7MkZBRS9CLGFBQWE7a0JBekJ6QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixnQkFBZ0I7d0JBQ2hCLHNCQUFzQjt3QkFDdEIscUJBQXFCO3dCQUNyQix1QkFBdUI7d0JBQ3ZCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLDhCQUE4Qjt3QkFDOUIseUJBQXlCO3FCQUM1QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsZ0JBQWdCO3dCQUNoQixzQkFBc0I7d0JBQ3RCLHFCQUFxQjt3QkFDckIsdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLHNCQUFzQjt3QkFDdEIsMkJBQTJCO3dCQUMzQiw4QkFBOEI7d0JBQzlCLHlCQUF5QjtxQkFDNUI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgRGlyZWN0aXZlLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIE9wdGlvbmFsLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPbkluaXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hCdXR0b25Nb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL2J1dHRvbi9idXR0b24uZGlyZWN0aXZlJztcbmltcG9ydCB7IG1rZW51bSB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuXG5sZXQgTkVYVF9JRCA9IDA7XG5cbi8qKlxuICogSWd4Q2FyZE1lZGlhIGlzIGNvbnRhaW5lciBmb3IgdGhlIGNhcmQgbWVkaWEgc2VjdGlvbi5cbiAqIFVzZSBpdCB0byB3cmFwIGltYWdlcyBhbmQgdmlkZW9zLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxuICAgIHNlbGVjdG9yOiAnaWd4LWNhcmQtbWVkaWEnXG59KVxuZXhwb3J0IGNsYXNzIElneENhcmRNZWRpYURpcmVjdGl2ZSB7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZF9fbWVkaWEnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtY2FyZF9fbWVkaWEnO1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgYHdpZHRoYCBhbmQgYG1pbi13aWR0aGAgc3R5bGUgcHJvcGVydHlcbiAgICAgKiBvZiB0aGUgbWVkaWEgY29udGFpbmVyLiBJZiBub3QgcHJvdmlkZWQgaXQgd2lsbCBiZSBzZXQgdG8gYGF1dG9gLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYXJkLW1lZGlhIHdpZHRoPVwiMzAwcHhcIj48L2lneC1jYXJkLW1lZGlhPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxuICAgIEBIb3N0QmluZGluZygnc3R5bGUubWluLXdpZHRoJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aWR0aCA9ICdhdXRvJztcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIGBoZWlnaHRgIHN0eWxlIHByb3BlcnR5IG9mIHRoZSBtZWRpYSBjb250YWluZXIuXG4gICAgICogSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgYmUgc2V0IHRvIGBhdXRvYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2FyZC1tZWRpYSBoZWlnaHQ9XCI1MCVcIj48L2lneC1jYXJkLW1lZGlhPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoZWlnaHQgPSAnYXV0byc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSBgcm9sZWAgYXR0cmlidXRlIG9mIHRoZSBtZWRpYSBjb250YWluZXIuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJvbGUgPSAnaW1nJztcbn1cblxuLyoqXG4gKiBJZ3hDYXJkSGVhZGVyIGlzIGNvbnRhaW5lciBmb3IgdGhlIGNhcmQgaGVhZGVyXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWNhcmQtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2NhcmQtaGVhZGVyLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hDYXJkSGVhZGVyQ29tcG9uZW50IHtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1jYXJkLWhlYWRlcicpXG4gICAgcHVibGljIGNzc0NsYXNzID0gJ2lneC1jYXJkLWhlYWRlcic7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSBsYXlvdXQgc3R5bGUgb2YgdGhlIGhlYWRlci5cbiAgICAgKiBCeSBkZWZhdWx0IHRoZSBoZWFkZXIgZWxlbWVudHModGh1bWJuYWlsIGFuZCB0aXRsZS9zdWJ0aXRsZSkgYXJlIGFsaWduZWQgaG9yaXpvbnRhbGx5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1jYXJkLWhlYWRlciBbdmVydGljYWxdPVwidHJ1ZVwiPjwvaWd4LWNhcmQtaGVhZGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWNhcmQtaGVhZGVyLS12ZXJ0aWNhbCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdmVydGljYWwgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIHZhbHVlIG9mIHRoZSBgcm9sZWAgYXR0cmlidXRlIG9mIHRoZSBjYXJkIGhlYWRlci5cbiAgICAgKiBCeSBkZWZhdWx0IHRoZSB2YWx1ZSBpcyBzZXQgdG8gYGhlYWRlcmAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcmQtaGVhZGVyIHJvbGU9XCJoZWFkZXJcIj48L2lneC1jYXJkLWhlYWRlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIHJvbGUgPSAnaGVhZGVyJztcbn1cblxuLyoqXG4gKiBJZ3hDYXJkVGh1bWJuYWlsIGlzIGNvbnRhaW5lciBmb3IgdGhlIGNhcmQgdGh1bWJuYWlsIHNlY3Rpb24uXG4gKiBVc2UgaXQgdG8gd3JhcCBhbnl0aGluZyB5b3Ugd2FudCB0byBiZSB1c2VkIGFzIGEgdGh1bWJuYWlsLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tpZ3hDYXJkVGh1bWJuYWlsXSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FyZFRodW1ibmFpbERpcmVjdGl2ZSB7IH1cblxuLyoqXG4gKiBpZ3hDYXJkSGVhZGVyVGl0bGUgaXMgdXNlZCB0byBkZW5vdGUgdGhlIGhlYWRlciB0aXRsZSBpbiBhIGNhcmQuXG4gKiBVc2UgaXQgdG8gdGFnIHRleHQgbm9kZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneENhcmRIZWFkZXJUaXRsZV0nXG59KVxuZXhwb3J0IGNsYXNzIElneENhcmRIZWFkZXJUaXRsZURpcmVjdGl2ZSB7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZC1oZWFkZXJfX3RpdGxlJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LWNhcmRfX2hlYWRlcl9fdGl0bGUnO1xufVxuXG4vKipcbiAqIGlneENhcmRIZWFkZXJTdWJ0aXRsZSBpcyB1c2VkIHRvIGRlbm90ZSB0aGUgaGVhZGVyIHN1YnRpdGxlIGluIGEgY2FyZC5cbiAqIFVzZSBpdCB0byB0YWcgdGV4dCBub2Rlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbaWd4Q2FyZEhlYWRlclN1YnRpdGxlXSdcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FyZEhlYWRlclN1YnRpdGxlRGlyZWN0aXZlIHtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1jYXJkLWhlYWRlcl9fc3VidGl0bGUnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtY2FyZC1oZWFkZXJfX3N1YnRpdGxlJztcbn1cbi8qKlxuICogSWd4Q2FyZENvbnRlbnQgaXMgY29udGFpbmVyIGZvciB0aGUgY2FyZCBjb250ZW50LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxuICAgIHNlbGVjdG9yOiAnaWd4LWNhcmQtY29udGVudCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FyZENvbnRlbnREaXJlY3RpdmUge1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWNhcmQtY29udGVudCcpXG4gICAgcHVibGljIGNzc0NsYXNzID0gJ2lneC1jYXJkLWNvbnRlbnQnO1xufVxuXG4vKipcbiAqIElneENhcmRGb290ZXIgaXMgY29udGFpbmVyIGZvciB0aGUgY2FyZCBmb290ZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcbiAgICBzZWxlY3RvcjogJ2lneC1jYXJkLWZvb3Rlcidcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FyZEZvb3RlckRpcmVjdGl2ZSB7XG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyB0aGUgdmFsdWUgb2YgdGhlIGByb2xlYCBhdHRyaWJ1dGUgb2YgdGhlIGNhcmQgZm9vdGVyLlxuICAgICAqIEJ5IGRlZmF1bHQgdGhlIHZhbHVlIGlzIHNldCB0byBgZm9vdGVyYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2FyZC1mb290ZXIgcm9sZT1cImZvb3RlclwiPjwvaWd4LWNhcmQtZm9vdGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByb2xlID0gJ2Zvb3Rlcic7XG59XG5cbi8qKlxuICogQ2FyZCBwcm92aWRlcyBhIHdheSB0byBkaXNwbGF5IG9yZ2FuaXplZCBjb250ZW50IGluIGFwcGVhbGluZyB3YXkuXG4gKlxuICogQGlneE1vZHVsZSBJZ3hDYXJkTW9kdWxlXG4gKlxuICogQGlneFRoZW1lIGlneC1jYXJkLXRoZW1lLCBpZ3gtaWNvbi10aGVtZSwgaWd4LWJ1dHRvbi10aGVtZVxuICpcbiAqIEBpZ3hLZXl3b3JkcyBjYXJkLCBidXR0b24sIGF2YXRhciwgaWNvblxuICpcbiAqIEBpZ3hHcm91cCBMYXlvdXRzXG4gKlxuICogQHJlbWFya3NcbiAqIFRoZSBJZ25pdGUgVUkgQ2FyZCBzZXJ2ZXMgYXMgYSBjb250YWluZXIgdGhhdCBhbGxvd3MgY3VzdG9tIGNvbnRlbnQgdG8gYmUgb3JnYW5pemVkIGluIGFuIGFwcGVhbGluZyB3YXkuIFRoZXJlIGFyZVxuICogZml2ZSBzZWN0aW9ucyBpbiBhIGNhcmQgdGhhdCB5b3UgY2FuIHVzZSB0byBvcmdhbml6ZSB5b3VyIGNvbnRlbnQuIFRoZXNlIGFyZSBoZWFkZXIsIG1lZGlhLCBjb250ZW50LCBhY3Rpb25zLCBhbmQgZm9vdGVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8aWd4LWNhcmQ+XG4gKiAgIDxpZ3gtY2FyZC1oZWFkZXI+XG4gKiAgICAgPGgzIGlneENhcmRIZWFkZXJUaXRsZT57e3RpdGxlfX08L2gzPlxuICogICAgIDxoNSBpZ3hDYXJkSGVhZGVyU3VidGl0bGU+e3tzdWJ0aXRsZX19PC9oNT5cbiAqICAgPC9pZ3gtY2FyZC1oZWFkZXI+XG4gKiAgIDxpZ3gtY2FyZC1hY3Rpb25zPlxuICogICAgICAgPGJ1dHRvbiBpZ3hCdXR0b24gaWd4UmlwcGxlPlNoYXJlPC9idXR0b24+XG4gKiAgICAgICA8YnV0dG9uIGlneEJ1dHRvbiBpZ3hSaXBwbGU+UGxheSBBbGJ1bTwvYnV0dG9uPlxuICogICA8L2lneC1jYXJkLWFjdGlvbnM+XG4gKiA8L2lneC1jYXJkPlxuICogYGBgXG4gKi9cblxuZXhwb3J0IGNvbnN0IElneENhcmRUeXBlID0gbWtlbnVtKHtcbiAgICBFTEVWQVRFRDogJ2VsZXZhdGVkJyxcbiAgICBPVVRMSU5FRDogJ291dGxpbmVkJ1xufSk7XG5leHBvcnQgdHlwZSBJZ3hDYXJkVHlwZSA9ICh0eXBlb2YgSWd4Q2FyZFR5cGUpW2tleW9mIHR5cGVvZiBJZ3hDYXJkVHlwZV07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWNhcmQnLFxuICAgIHRlbXBsYXRlVXJsOiAnY2FyZC5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4Q2FyZENvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHRoZSBgaWRgIG9mIHRoZSBjYXJkLlxuICAgICAqIElmIG5vdCBzZXQsIGBpZGAgd2lsbCBoYXZlIHZhbHVlIGBcImlneC1jYXJkLTBcImA7XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcmQgaWQgPSBcIm15LWZpcnN0LWNhcmRcIj48L2lneC1jYXJkPlxuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgY2FyZElkID0gIHRoaXMuY2FyZC5pZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlkID0gYGlneC1jYXJkLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYHJvbGVgIGF0dHJpYnV0ZSBvZiB0aGUgY2FyZC5cbiAgICAgKiBCeSBkZWZhdWx0IHRoZSB2YWx1ZSBpcyBzZXQgdG8gYGdyb3VwYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2FyZCByb2xlPVwiZ3JvdXBcIj48L2lneC1jYXJkPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByb2xlID0gJ2dyb3VwJztcblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIHZhbHVlIG9mIHRoZSBgdHlwZWAgYXR0cmlidXRlIG9mIHRoZSBjYXJkLlxuICAgICAqIEJ5IGRlZmF1bHQgdGhlIHZhbHVlIGlzIHNldCB0byBgZWxldmF0ZWRgLiBZb3UgY2FuIG1ha2UgdGhlIGNhcmQgdXNlIHRoZVxuICAgICAqIG91dGxpbmVkIHN0eWxlIGJ5IHNldHRpbmcgdGhlIHZhbHVlIHRvIGBvdXRsaW5lZGAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcmQgdHlwZT1cIm91dGxpbmVkXCI+PC9pZ3gtY2FyZD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1jYXJkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0eXBlOiBJZ3hDYXJkVHlwZSB8IHN0cmluZyA9IElneENhcmRUeXBlLkVMRVZBVEVEO1xuXG4gICAgLyoqXG4gICAgICogQSBnZXR0ZXIgd2hpY2ggd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgY2FyZCB0eXBlIGlzIGBvdXRsaW5lZGAuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZC0tb3V0bGluZWQnKVxuICAgIHB1YmxpYyBnZXQgaXNPdXRsaW5lZENhcmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09IElneENhcmRUeXBlLk9VVExJTkVEO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIHZhbHVlIG9mIHRoZSBgaG9yaXpvbnRhbGAgYXR0cmlidXRlIG9mIHRoZSBjYXJkLlxuICAgICAqIFNldHRpbmcgdGhpcyB0byBgdHJ1ZWAgd2lsbCBtYWtlIHRoZSBkaWZmZXJlbnQgY2FyZCBzZWN0aW9ucyBhbGlnbiBob3Jpem9udGFsbHksXG4gICAgICogZXNzZW50aWFsbHkgZmxpcHBpbmcgdGhlIGNhcmQgdG8gdGhlIHNpZGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWNhcmQgW2hvcml6b250YWxdPVwidHJ1ZVwiPjwvaWd4LWNhcmQ+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZC0taG9yaXpvbnRhbCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaG9yaXpvbnRhbCA9IGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgSWd4Q2FyZEFjdGlvbnNMYXlvdXQgPSBta2VudW0oe1xuICAgIFNUQVJUOiAnc3RhcnQnLFxuICAgIEpVU1RJRlk6ICdqdXN0aWZ5J1xufSk7XG5leHBvcnQgdHlwZSBJZ3hDYXJkQWN0aW9uc0xheW91dCA9ICh0eXBlb2YgSWd4Q2FyZEFjdGlvbnNMYXlvdXQpW2tleW9mIHR5cGVvZiBJZ3hDYXJkQWN0aW9uc0xheW91dF07XG5cbi8qKlxuICogSWd4Q2FyZEFjdGlvbnMgaXMgY29udGFpbmVyIGZvciB0aGUgY2FyZCBhY3Rpb25zLlxuICovXG5AQ29tcG9uZW50KHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxuICAgIHNlbGVjdG9yOiAnaWd4LWNhcmQtYWN0aW9ucycsXG4gICAgdGVtcGxhdGVVcmw6ICdjYXJkLWFjdGlvbnMuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneENhcmRBY3Rpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAgIC8qKlxuICAgICAqIEFuIEBJbnB1dCBwcm9wZXJ0eSB0aGF0IHNldHMgdGhlIGxheW91dCBzdHlsZSBvZiB0aGUgYWN0aW9ucy5cbiAgICAgKiBCeSBkZWZhdWx0IGljb25zIGFuZCBpY29uIGJ1dHRvbnMsIGFzIHdlbGwgYXMgcmVndWxhciBidXR0b25zXG4gICAgICogYXJlIHNwbGl0IGludG8gdHdvIGNvbnRhaW5lcnMsIHdoaWNoIGFyZSB0aGVuIHBvc2l0aW9uZWQgb24gYm90aCBlbmRzXG4gICAgICogb2YgdGhlIGNhcmQtYWN0aW9ucyBhcmVhLlxuICAgICAqIFlvdSBjYW4ganVzdGlmeSB0aGUgZWxlbWVudHMgaW4gdGhvc2UgZ3JvdXBzIHNvIHRoZXkgYXJlIHBvc2l0aW9uZWQgZXF1YWxseVxuICAgICAqIGZyb20gb25lIGFub3RoZXIgdGFraW5nIHVwIGFsbCB0aGUgc3BhY2UgYXZhaWxhYmxlIGFsb25nIHRoZSBjYXJkIGFjdGlvbnMgYXhpcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2FyZC1hY3Rpb25zIGxheW91dD1cImp1c3RpZnlcIj48L2lneC1jYXJkLWFjdGlvbnM+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZC1hY3Rpb25zJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBsYXlvdXQ6IElneENhcmRBY3Rpb25zTGF5b3V0IHwgc3RyaW5nID0gSWd4Q2FyZEFjdGlvbnNMYXlvdXQuU1RBUlQ7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBzZXRzIHRoZSB2ZXJ0aWNhbCBhdHRyaWJ1dGUgb2YgdGhlIGFjdGlvbnMuXG4gICAgICogV2hlbiBzZXQgdG8gYHRydWVgIHRoZSBhY3Rpb25zIHdpbGwgYmUgbGF5ZWQgb3V0IHZlcnRpY2FsbHkuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZC1hY3Rpb25zLS12ZXJ0aWNhbCcpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdmVydGljYWwgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEEgZ2V0dGVyIHRoYXQgcmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgbGF5b3V0IGhhcyBiZWVuXG4gICAgICogc2V0IHRvIGBqdXN0aWZ5YC5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1jYXJkLWFjdGlvbnMtLWp1c3RpZnknKVxuICAgIHB1YmxpYyBnZXQgaXNKdXN0aWZ5TGF5b3V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXlvdXQgPT09IElneENhcmRBY3Rpb25zTGF5b3V0LkpVU1RJRlk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHRoYXQgc2V0cyBvcmRlciBvZiB0aGUgYnV0dG9ucyB0aGUgYWN0aW9ucyBhcmVhLlxuICAgICAqIEJ5IGRlZmF1bHQgYWxsIGljb25zL2ljb24gYnV0dG9ucyBhcmUgcGxhY2VkIGF0IHRoZSBlbmQgb2YgdGhlIGFjdGlvblxuICAgICAqIGFyZWEuIEFueSByZWd1bGFyIGJ1dHRvbnMoZmxhdCwgcmFpc2VkKSB3aWxsIGFwcGVhciBiZWZvcmUgdGhlIGljb25zL2ljb24gYnV0dG9uc1xuICAgICAqIHBsYWNlZCBpbiB0aGUgYWN0aW9ucyBhcmVhLlxuICAgICAqIElmIHlvdSB3YW50IHRvIHJldmVyc2UgdGhlaXIgcG9zaXRpb25zIHNvIHRoYXQgaWNvbnMgYXBwZWFyIGZpcnN0LCB1c2UgdGhlIGByZXZlcnNlYFxuICAgICAqIGF0dHJpYnV0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtY2FyZC1hY3Rpb25zIFtyZXZlcnNlXT1cInRydWVcIj48L2lneC1jYXJkLWFjdGlvbnM+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtY2FyZC1hY3Rpb25zLS1yZXZlcnNlJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZXZlcnNlID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGlzVmVydGljYWxTZXQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoSWd4Q2FyZENvbXBvbmVudCkgcHVibGljIGNhcmQ6IElneENhcmRDb21wb25lbnQpIHsgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBjaGFuZ2VzKSB7XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNWZXJ0aWNhbFNldCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWZXJ0aWNhbFNldCAmJiB0aGlzLmNhcmQuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4Q2FyZENvbXBvbmVudCxcbiAgICAgICAgSWd4Q2FyZEhlYWRlckNvbXBvbmVudCxcbiAgICAgICAgSWd4Q2FyZE1lZGlhRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYXJkQ29udGVudERpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FyZEFjdGlvbnNDb21wb25lbnQsXG4gICAgICAgIElneENhcmRGb290ZXJEaXJlY3RpdmUsXG4gICAgICAgIElneENhcmRIZWFkZXJUaXRsZURpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FyZEhlYWRlclN1YnRpdGxlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYXJkVGh1bWJuYWlsRGlyZWN0aXZlLFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBJZ3hDYXJkQ29tcG9uZW50LFxuICAgICAgICBJZ3hDYXJkSGVhZGVyQ29tcG9uZW50LFxuICAgICAgICBJZ3hDYXJkTWVkaWFEaXJlY3RpdmUsXG4gICAgICAgIElneENhcmRDb250ZW50RGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYXJkQWN0aW9uc0NvbXBvbmVudCxcbiAgICAgICAgSWd4Q2FyZEZvb3RlckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4Q2FyZEhlYWRlclRpdGxlRGlyZWN0aXZlLFxuICAgICAgICBJZ3hDYXJkSGVhZGVyU3VidGl0bGVEaXJlY3RpdmUsXG4gICAgICAgIElneENhcmRUaHVtYm5haWxEaXJlY3RpdmUsXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBJZ3hCdXR0b25Nb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIElneENhcmRNb2R1bGUgeyB9XG4iLCI8ZGl2IGNsYXNzPVwiaWd4LWNhcmQtaGVhZGVyX190aHVtYm5haWxcIj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtYXZhdGFyLCBpZ3gtY2FyZC1tZWRpYSwgW2lneENhcmRUaHVtYm5haWxdXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJpZ3gtY2FyZC1oZWFkZXJfX3RpdGxlc1wiPlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIlxuICAgICAgICBbaWd4Q2FyZEhlYWRlclRpdGxlXSxcbiAgICAgICAgW2lneENhcmRIZWFkZXJTdWJ0aXRsZV0sXG4gICAgICAgIC5pZ3gtY2FyZC1oZWFkZXJfX3RpdGxlLFxuICAgICAgICAuaWd4LWNhcmQtaGVhZGVyX19zdWJ0aXRsZVwiPlxuICAgIDwvbmctY29udGVudD5cbjwvZGl2PlxuXG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4iLCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4iLCI8ZGl2IGNsYXNzPVwiaWd4LWNhcmQtYWN0aW9uc19faWNvbnNcIj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtaWNvbiwgW2lneEJ1dHRvbj0naWNvbiddXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5cbjxkaXYgI2J1dHRvbnMgY2xhc3M9XCJpZ3gtY2FyZC1hY3Rpb25zX19idXR0b25zXCI+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2lneEJ1dHRvbl1cIj48L25nLWNvbnRlbnQ+XG48L2Rpdj5cblxuXG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4iXX0=