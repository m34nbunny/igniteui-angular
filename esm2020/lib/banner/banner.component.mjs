import { Component, ContentChild, EventEmitter, HostBinding, Input, NgModule, Output, ViewChild } from '@angular/core';
import { IgxExpansionPanelModule } from '../expansion-panel/expansion-panel.module';
import { IgxIconModule, IgxIconComponent } from '../icon/public_api';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxBannerActionsDirective } from './banner.directives';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../expansion-panel/expansion-panel.component";
import * as i2 from "../expansion-panel/expansion-panel-body.component";
import * as i3 from "@angular/common";
import * as i4 from "../directives/button/button.directive";
import * as i5 from "../directives/ripple/ripple.directive";
/**
 * **Ignite UI for Angular Banner** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/banner.html)
 *
 * The Ignite UI Banner provides a highly template-able and easy to use banner that can be shown in your application.
 *
 * Usage:
 *
 * ```html
 * <igx-banner #banner>
 *   Our privacy settings have changed.
 *  <igx-banner-actions>
 *      <button igxButton="raised">Read More</button>
 *      <button igxButton="raised">Accept and Continue</button>
 *  </igx-banner-actions>
 * </igx-banner>
 * ```
 */
export class IgxBannerComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        /**
         * Fires after the banner shows up
         * ```typescript
         * public handleOpened(event) {
         *  ...
         * }
         * ```
         * ```html
         * <igx-banner (opened)="handleOpened($event)"></igx-banner>
         * ```
         */
        this.opened = new EventEmitter();
        /**
         * Fires before the banner shows up
         * ```typescript
         * public handleOpening(event) {
         *  ...
         * }
         * ```
         * ```html
         * <igx-banner (opening)="handleOpening($event)"></igx-banner>
         * ```
         */
        this.opening = new EventEmitter();
        /**
         * Fires after the banner hides
         * ```typescript
         * public handleClosed(event) {
         *  ...
         * }
         * ```
         * ```html
         * <igx-banner (closed)="handleClosed($event)"></igx-banner>
         * ```
         */
        this.closed = new EventEmitter();
        /**
         * Fires before the banner hides
         * ```typescript
         * public handleClosing(event) {
         *  ...
         * }
         * ```
         * ```html
         * <igx-banner (closing)="handleClosing($event)"></igx-banner>
         * ```
         */
        this.closing = new EventEmitter();
    }
    /** @hidden */
    get useDefaultTemplate() {
        return !this._bannerActionTemplate;
    }
    /**
     * Get the animation settings used by the banner open/close methods
     * ```typescript
     * let currentAnimations: ToggleAnimationSettings = banner.animationSettings
     * ```
     */
    get animationSettings() {
        return this._animationSettings ? this._animationSettings : this._expansionPanel.animationSettings;
    }
    /**
     * Set the animation settings used by the banner open/close methods
     * ```typescript
     * import { slideInLeft, slideOutRight } from 'igniteui-angular';
     * ...
     * banner.animationSettings: ToggleAnimationSettings = { openAnimation: slideInLeft, closeAnimation: slideOutRight };
     * ```
     */
    set animationSettings(settings) {
        this._animationSettings = settings;
    }
    /**
     * Gets whether banner is collapsed
     *
     * ```typescript
     * const isCollapsed: boolean = banner.collapsed;
     * ```
     */
    get collapsed() {
        return this._expansionPanel.collapsed;
    }
    /**
     * Returns the native element of the banner component
     * ```typescript
     *  const myBannerElement: HTMLElement = banner.element;
     * ```
     */
    get element() {
        return this.elementRef.nativeElement;
    }
    /**
     * @hidden
     */
    get displayStyle() {
        return this.collapsed ? '' : 'block';
    }
    /**
     * Opens the banner
     *
     * ```typescript
     *  myBanner.open();
     * ```
     *
     * ```html
     * <igx-banner #banner>
     * ...
     * </igx-banner>
     * <button (click)="banner.open()">Open Banner</button>
     * ```
     */
    open(event) {
        this._bannerEvent = { banner: this, owner: this, event };
        const openingArgs = {
            banner: this,
            owner: this,
            event,
            cancel: false
        };
        this.opening.emit(openingArgs);
        if (openingArgs.cancel) {
            return;
        }
        this._expansionPanel.open(event);
    }
    /**
     * Closes the banner
     *
     * ```typescript
     *  myBanner.close();
     * ```
     *
     * ```html
     * <igx-banner #banner>
     * ...
     * </igx-banner>
     * <button (click)="banner.close()">Close Banner</button>
     * ```
     */
    close(event) {
        this._bannerEvent = { banner: this, owner: this, event };
        const closingArgs = {
            banner: this,
            owner: this,
            event,
            cancel: false
        };
        this.closing.emit(closingArgs);
        if (closingArgs.cancel) {
            return;
        }
        this._expansionPanel.close(event);
    }
    /**
     * Toggles the banner
     *
     * ```typescript
     *  myBanner.toggle();
     * ```
     *
     * ```html
     * <igx-banner #banner>
     * ...
     * </igx-banner>
     * <button (click)="banner.toggle()">Toggle Banner</button>
     * ```
     */
    toggle(event) {
        if (this.collapsed) {
            this.open(event);
        }
        else {
            this.close(event);
        }
    }
    /** @hidden */
    onExpansionPanelOpen() {
        this.opened.emit(this._bannerEvent);
    }
    /** @hidden */
    onExpansionPanelClose() {
        this.closed.emit(this._bannerEvent);
    }
}
IgxBannerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBannerComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxBannerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxBannerComponent, selector: "igx-banner", inputs: { animationSettings: "animationSettings" }, outputs: { opened: "opened", opening: "opening", closed: "closed", closing: "closing" }, host: { properties: { "style.display": "this.displayStyle" } }, queries: [{ propertyName: "bannerIcon", first: true, predicate: IgxIconComponent, descendants: true }, { propertyName: "_bannerActionTemplate", first: true, predicate: IgxBannerActionsDirective, descendants: true }], viewQueries: [{ propertyName: "_expansionPanel", first: true, predicate: ["expansionPanel"], descendants: true, static: true }], ngImport: i0, template: "<igx-expansion-panel #expansionPanel [animationSettings]=\"animationSettings\" (contentCollapsed)=\"onExpansionPanelClose()\" (contentExpanded)=\"onExpansionPanelOpen()\"\n    [collapsed]=\"collapsed\" aria-live=\"polite\" [attr.aria-hidden]=\"collapsed\">\n    <igx-expansion-panel-body>\n        <div class=\"igx-banner\">\n            <div class=\"igx-banner__message\">\n                <div *ngIf=\"bannerIcon\" class=\"igx-banner__illustration\">\n                    <ng-content select=\"igx-icon\"></ng-content>\n                </div>\n                <span class=\"igx-banner__text\">\n                    <ng-content></ng-content>\n                </span>\n            </div>\n            <div class=\"igx-banner__actions\">\n                <div class=\"igx-banner__row\">\n                    <ng-container *ngIf=\"useDefaultTemplate\">\n                        <button igxButton=\"flat\" igxRipple (click)=\"close()\">\n                            Dismiss\n                        </button>\n                    </ng-container>\n                    <ng-container *ngIf=\"!useDefaultTemplate\">\n                        <ng-content select=\"igx-banner-actions\"></ng-content>\n                    </ng-container>\n                </div>\n            </div>\n        </div>\n    </igx-expansion-panel-body>\n</igx-expansion-panel>", components: [{ type: i1.IgxExpansionPanelComponent, selector: "igx-expansion-panel", inputs: ["animationSettings", "id", "collapsed"], outputs: ["collapsedChange", "contentCollapsing", "contentCollapsed", "contentExpanding", "contentExpanded"] }, { type: i2.IgxExpansionPanelBodyComponent, selector: "igx-expansion-panel-body", inputs: ["role", "label", "labelledBy"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.IgxButtonDirective, selector: "[igxButton]", inputs: ["selected", "igxButton", "igxButtonColor", "igxButtonBackground", "igxLabel", "disabled"], outputs: ["buttonClick", "buttonSelected"] }, { type: i5.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBannerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-banner', template: "<igx-expansion-panel #expansionPanel [animationSettings]=\"animationSettings\" (contentCollapsed)=\"onExpansionPanelClose()\" (contentExpanded)=\"onExpansionPanelOpen()\"\n    [collapsed]=\"collapsed\" aria-live=\"polite\" [attr.aria-hidden]=\"collapsed\">\n    <igx-expansion-panel-body>\n        <div class=\"igx-banner\">\n            <div class=\"igx-banner__message\">\n                <div *ngIf=\"bannerIcon\" class=\"igx-banner__illustration\">\n                    <ng-content select=\"igx-icon\"></ng-content>\n                </div>\n                <span class=\"igx-banner__text\">\n                    <ng-content></ng-content>\n                </span>\n            </div>\n            <div class=\"igx-banner__actions\">\n                <div class=\"igx-banner__row\">\n                    <ng-container *ngIf=\"useDefaultTemplate\">\n                        <button igxButton=\"flat\" igxRipple (click)=\"close()\">\n                            Dismiss\n                        </button>\n                    </ng-container>\n                    <ng-container *ngIf=\"!useDefaultTemplate\">\n                        <ng-content select=\"igx-banner-actions\"></ng-content>\n                    </ng-container>\n                </div>\n            </div>\n        </div>\n    </igx-expansion-panel-body>\n</igx-expansion-panel>" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { bannerIcon: [{
                type: ContentChild,
                args: [IgxIconComponent]
            }], opened: [{
                type: Output
            }], opening: [{
                type: Output
            }], closed: [{
                type: Output
            }], closing: [{
                type: Output
            }], animationSettings: [{
                type: Input
            }], displayStyle: [{
                type: HostBinding,
                args: ['style.display']
            }], _expansionPanel: [{
                type: ViewChild,
                args: ['expansionPanel', { static: true }]
            }], _bannerActionTemplate: [{
                type: ContentChild,
                args: [IgxBannerActionsDirective]
            }] } });
/**
 * @hidden
 */
export class IgxBannerModule {
}
IgxBannerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBannerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxBannerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBannerModule, declarations: [IgxBannerComponent, IgxBannerActionsDirective], imports: [CommonModule, IgxExpansionPanelModule, IgxIconModule, IgxButtonModule, IgxRippleModule], exports: [IgxBannerComponent, IgxBannerActionsDirective] });
IgxBannerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBannerModule, imports: [[CommonModule, IgxExpansionPanelModule, IgxIconModule, IgxButtonModule, IgxRippleModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxBannerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxBannerComponent, IgxBannerActionsDirective],
                    exports: [IgxBannerComponent, IgxBannerActionsDirective],
                    imports: [CommonModule, IgxExpansionPanelModule, IgxIconModule, IgxButtonModule, IgxRippleModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9iYW5uZXIvYmFubmVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9iYW5uZXIvYmFubmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsWUFBWSxFQUVaLFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRXBGLE9BQU8sRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7OztBQWMvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFLSCxNQUFNLE9BQU8sa0JBQWtCO0lBZ0kzQixZQUFtQixVQUFtQztRQUFuQyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQXpIdEQ7Ozs7Ozs7Ozs7V0FVRztRQUVJLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUVwRDs7Ozs7Ozs7OztXQVVHO1FBRUksWUFBTyxHQUFHLElBQUksWUFBWSxFQUF5QixDQUFDO1FBRTNEOzs7Ozs7Ozs7O1dBVUc7UUFFSSxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQW1C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ICAgIENvbnRlbnRDaGlsZCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBIb3N0QmluZGluZyxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPdXRwdXQsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWd4RXhwYW5zaW9uUGFuZWxNb2R1bGUgfSBmcm9tICcuLi9leHBhbnNpb24tcGFuZWwvZXhwYW5zaW9uLXBhbmVsLm1vZHVsZSc7XG5pbXBvcnQgeyBJZ3hFeHBhbnNpb25QYW5lbENvbXBvbmVudCB9IGZyb20gJy4uL2V4cGFuc2lvbi1wYW5lbC9wdWJsaWNfYXBpJztcbmltcG9ydCB7IElneEljb25Nb2R1bGUsIElneEljb25Db21wb25lbnQgfSBmcm9tICcuLi9pY29uL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSVRvZ2dsZVZpZXcgfSBmcm9tICcuLi9jb3JlL25hdmlnYXRpb24nO1xuaW1wb3J0IHsgSWd4QnV0dG9uTW9kdWxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9idXR0b24vYnV0dG9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZ3hSaXBwbGVNb2R1bGUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL3JpcHBsZS9yaXBwbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IElneEJhbm5lckFjdGlvbnNEaXJlY3RpdmUgfSBmcm9tICcuL2Jhbm5lci5kaXJlY3RpdmVzJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDYW5jZWxhYmxlRXZlbnRBcmdzLCBJQmFzZUV2ZW50QXJncyB9IGZyb20gJy4uL2NvcmUvdXRpbHMnO1xuaW1wb3J0IHsgVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3MgfSBmcm9tICcuLi9leHBhbnNpb24tcGFuZWwvdG9nZ2xlLWFuaW1hdGlvbi1jb21wb25lbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJhbm5lckV2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBpbiAxMi4xLjAuIFRvIGdldCBhIHJlZmVyZW5jZSB0byB0aGUgYmFubmVyLCB1c2UgYG93bmVyYCBpbnN0ZWFkXG4gICAgICovXG4gICAgYmFubmVyOiBJZ3hCYW5uZXJDb21wb25lbnQ7XG4gICAgZXZlbnQ/OiBFdmVudDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCYW5uZXJDYW5jZWxFdmVudEFyZ3MgZXh0ZW5kcyBCYW5uZXJFdmVudEFyZ3MsIENhbmNlbGFibGVFdmVudEFyZ3Mge1xufVxuLyoqXG4gKiAqKklnbml0ZSBVSSBmb3IgQW5ndWxhciBCYW5uZXIqKiAtXG4gKiBbRG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly93d3cuaW5mcmFnaXN0aWNzLmNvbS9wcm9kdWN0cy9pZ25pdGUtdWktYW5ndWxhci9hbmd1bGFyL2NvbXBvbmVudHMvYmFubmVyLmh0bWwpXG4gKlxuICogVGhlIElnbml0ZSBVSSBCYW5uZXIgcHJvdmlkZXMgYSBoaWdobHkgdGVtcGxhdGUtYWJsZSBhbmQgZWFzeSB0byB1c2UgYmFubmVyIHRoYXQgY2FuIGJlIHNob3duIGluIHlvdXIgYXBwbGljYXRpb24uXG4gKlxuICogVXNhZ2U6XG4gKlxuICogYGBgaHRtbFxuICogPGlneC1iYW5uZXIgI2Jhbm5lcj5cbiAqICAgT3VyIHByaXZhY3kgc2V0dGluZ3MgaGF2ZSBjaGFuZ2VkLlxuICogIDxpZ3gtYmFubmVyLWFjdGlvbnM+XG4gKiAgICAgIDxidXR0b24gaWd4QnV0dG9uPVwicmFpc2VkXCI+UmVhZCBNb3JlPC9idXR0b24+XG4gKiAgICAgIDxidXR0b24gaWd4QnV0dG9uPVwicmFpc2VkXCI+QWNjZXB0IGFuZCBDb250aW51ZTwvYnV0dG9uPlxuICogIDwvaWd4LWJhbm5lci1hY3Rpb25zPlxuICogPC9pZ3gtYmFubmVyPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWJhbm5lcicsXG4gICAgdGVtcGxhdGVVcmw6ICdiYW5uZXIuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneEJhbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIElUb2dnbGVWaWV3IHtcbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hJY29uQ29tcG9uZW50KVxuICAgIHB1YmxpYyBiYW5uZXJJY29uOiBJZ3hJY29uQ29tcG9uZW50O1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgYWZ0ZXIgdGhlIGJhbm5lciBzaG93cyB1cFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlT3BlbmVkKGV2ZW50KSB7XG4gICAgICogIC4uLlxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1iYW5uZXIgKG9wZW5lZCk9XCJoYW5kbGVPcGVuZWQoJGV2ZW50KVwiPjwvaWd4LWJhbm5lcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb3BlbmVkID0gbmV3IEV2ZW50RW1pdHRlcjxCYW5uZXJFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyBiZWZvcmUgdGhlIGJhbm5lciBzaG93cyB1cFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlT3BlbmluZyhldmVudCkge1xuICAgICAqICAuLi5cbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYmFubmVyIChvcGVuaW5nKT1cImhhbmRsZU9wZW5pbmcoJGV2ZW50KVwiPjwvaWd4LWJhbm5lcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb3BlbmluZyA9IG5ldyBFdmVudEVtaXR0ZXI8QmFubmVyQ2FuY2VsRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgYWZ0ZXIgdGhlIGJhbm5lciBoaWRlc1xuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlQ2xvc2VkKGV2ZW50KSB7XG4gICAgICogIC4uLlxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1iYW5uZXIgKGNsb3NlZCk9XCJoYW5kbGVDbG9zZWQoJGV2ZW50KVwiPjwvaWd4LWJhbm5lcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxCYW5uZXJFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyBiZWZvcmUgdGhlIGJhbm5lciBoaWRlc1xuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlQ2xvc2luZyhldmVudCkge1xuICAgICAqICAuLi5cbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYmFubmVyIChjbG9zaW5nKT1cImhhbmRsZUNsb3NpbmcoJGV2ZW50KVwiPjwvaWd4LWJhbm5lcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8QmFubmVyQ2FuY2VsRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgZ2V0IHVzZURlZmF1bHRUZW1wbGF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9iYW5uZXJBY3Rpb25UZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGFuaW1hdGlvbiBzZXR0aW5ncyB1c2VkIGJ5IHRoZSBiYW5uZXIgb3Blbi9jbG9zZSBtZXRob2RzXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBjdXJyZW50QW5pbWF0aW9uczogVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3MgPSBiYW5uZXIuYW5pbWF0aW9uU2V0dGluZ3NcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgYW5pbWF0aW9uU2V0dGluZ3MoKTogVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3Mge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU2V0dGluZ3MgPyB0aGlzLl9hbmltYXRpb25TZXR0aW5ncyA6IHRoaXMuX2V4cGFuc2lvblBhbmVsLmFuaW1hdGlvblNldHRpbmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgYW5pbWF0aW9uIHNldHRpbmdzIHVzZWQgYnkgdGhlIGJhbm5lciBvcGVuL2Nsb3NlIG1ldGhvZHNcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogaW1wb3J0IHsgc2xpZGVJbkxlZnQsIHNsaWRlT3V0UmlnaHQgfSBmcm9tICdpZ25pdGV1aS1hbmd1bGFyJztcbiAgICAgKiAuLi5cbiAgICAgKiBiYW5uZXIuYW5pbWF0aW9uU2V0dGluZ3M6IFRvZ2dsZUFuaW1hdGlvblNldHRpbmdzID0geyBvcGVuQW5pbWF0aW9uOiBzbGlkZUluTGVmdCwgY2xvc2VBbmltYXRpb246IHNsaWRlT3V0UmlnaHQgfTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IGFuaW1hdGlvblNldHRpbmdzKHNldHRpbmdzOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9hbmltYXRpb25TZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHdoZXRoZXIgYmFubmVyIGlzIGNvbGxhcHNlZFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IGlzQ29sbGFwc2VkOiBib29sZWFuID0gYmFubmVyLmNvbGxhcHNlZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGNvbGxhcHNlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuc2lvblBhbmVsLmNvbGxhcHNlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBuYXRpdmUgZWxlbWVudCBvZiB0aGUgYmFubmVyIGNvbXBvbmVudFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgY29uc3QgbXlCYW5uZXJFbGVtZW50OiBIVE1MRWxlbWVudCA9IGJhbm5lci5lbGVtZW50O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKVxuICAgIHB1YmxpYyBnZXQgZGlzcGxheVN0eWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlZCA/ICcnIDogJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBAVmlld0NoaWxkKCdleHBhbnNpb25QYW5lbCcsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJpdmF0ZSBfZXhwYW5zaW9uUGFuZWw6IElneEV4cGFuc2lvblBhbmVsQ29tcG9uZW50O1xuXG4gICAgQENvbnRlbnRDaGlsZChJZ3hCYW5uZXJBY3Rpb25zRGlyZWN0aXZlKVxuICAgIHByaXZhdGUgX2Jhbm5lckFjdGlvblRlbXBsYXRlOiBJZ3hCYW5uZXJBY3Rpb25zRGlyZWN0aXZlO1xuXG4gICAgcHJpdmF0ZSBfYmFubmVyRXZlbnQ6IEJhbm5lckV2ZW50QXJncztcbiAgICBwcml2YXRlIF9hbmltYXRpb25TZXR0aW5nczogVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3M7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHsgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgdGhlIGJhbm5lclxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICBteUJhbm5lci5vcGVuKCk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1iYW5uZXIgI2Jhbm5lcj5cbiAgICAgKiAuLi5cbiAgICAgKiA8L2lneC1iYW5uZXI+XG4gICAgICogPGJ1dHRvbiAoY2xpY2spPVwiYmFubmVyLm9wZW4oKVwiPk9wZW4gQmFubmVyPC9idXR0b24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIG9wZW4oZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICB0aGlzLl9iYW5uZXJFdmVudCA9IHsgYmFubmVyOiB0aGlzLCBvd25lcjogdGhpcywgZXZlbnR9O1xuICAgICAgICBjb25zdCBvcGVuaW5nQXJnczogQmFubmVyQ2FuY2VsRXZlbnRBcmdzID0ge1xuICAgICAgICAgICAgYmFubmVyOiB0aGlzLFxuICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vcGVuaW5nLmVtaXQob3BlbmluZ0FyZ3MpO1xuICAgICAgICBpZiAob3BlbmluZ0FyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZXhwYW5zaW9uUGFuZWwub3BlbihldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBiYW5uZXJcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgbXlCYW5uZXIuY2xvc2UoKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWJhbm5lciAjYmFubmVyPlxuICAgICAqIC4uLlxuICAgICAqIDwvaWd4LWJhbm5lcj5cbiAgICAgKiA8YnV0dG9uIChjbGljayk9XCJiYW5uZXIuY2xvc2UoKVwiPkNsb3NlIEJhbm5lcjwvYnV0dG9uPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZShldmVudD86IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2Jhbm5lckV2ZW50ID0geyBiYW5uZXI6IHRoaXMsIG93bmVyOiB0aGlzLCBldmVudH07XG4gICAgICAgIGNvbnN0IGNsb3NpbmdBcmdzOiBCYW5uZXJDYW5jZWxFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBiYW5uZXI6IHRoaXMsXG4gICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgY2FuY2VsOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNsb3NpbmcuZW1pdChjbG9zaW5nQXJncyk7XG4gICAgICAgIGlmIChjbG9zaW5nQXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9leHBhbnNpb25QYW5lbC5jbG9zZShldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgYmFubmVyXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIG15QmFubmVyLnRvZ2dsZSgpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYmFubmVyICNiYW5uZXI+XG4gICAgICogLi4uXG4gICAgICogPC9pZ3gtYmFubmVyPlxuICAgICAqIDxidXR0b24gKGNsaWNrKT1cImJhbm5lci50b2dnbGUoKVwiPlRvZ2dsZSBCYW5uZXI8L2J1dHRvbj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBvbkV4cGFuc2lvblBhbmVsT3BlbigpIHtcbiAgICAgICAgdGhpcy5vcGVuZWQuZW1pdCh0aGlzLl9iYW5uZXJFdmVudCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgb25FeHBhbnNpb25QYW5lbENsb3NlKCkge1xuICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KHRoaXMuX2Jhbm5lckV2ZW50KTtcbiAgICB9XG59XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0lneEJhbm5lckNvbXBvbmVudCwgSWd4QmFubmVyQWN0aW9uc0RpcmVjdGl2ZV0sXG4gICAgZXhwb3J0czogW0lneEJhbm5lckNvbXBvbmVudCwgSWd4QmFubmVyQWN0aW9uc0RpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSWd4RXhwYW5zaW9uUGFuZWxNb2R1bGUsIElneEljb25Nb2R1bGUsIElneEJ1dHRvbk1vZHVsZSwgSWd4UmlwcGxlTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hCYW5uZXJNb2R1bGUgeyB9XG4iLCI8aWd4LWV4cGFuc2lvbi1wYW5lbCAjZXhwYW5zaW9uUGFuZWwgW2FuaW1hdGlvblNldHRpbmdzXT1cImFuaW1hdGlvblNldHRpbmdzXCIgKGNvbnRlbnRDb2xsYXBzZWQpPVwib25FeHBhbnNpb25QYW5lbENsb3NlKClcIiAoY29udGVudEV4cGFuZGVkKT1cIm9uRXhwYW5zaW9uUGFuZWxPcGVuKClcIlxuICAgIFtjb2xsYXBzZWRdPVwiY29sbGFwc2VkXCIgYXJpYS1saXZlPVwicG9saXRlXCIgW2F0dHIuYXJpYS1oaWRkZW5dPVwiY29sbGFwc2VkXCI+XG4gICAgPGlneC1leHBhbnNpb24tcGFuZWwtYm9keT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC1iYW5uZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpZ3gtYmFubmVyX19tZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cImJhbm5lckljb25cIiBjbGFzcz1cImlneC1iYW5uZXJfX2lsbHVzdHJhdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtaWNvblwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlneC1iYW5uZXJfX3RleHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlneC1iYW5uZXJfX2FjdGlvbnNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWd4LWJhbm5lcl9fcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ1c2VEZWZhdWx0VGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWd4QnV0dG9uPVwiZmxhdFwiIGlneFJpcHBsZSAoY2xpY2spPVwiY2xvc2UoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERpc21pc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF1c2VEZWZhdWx0VGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImlneC1iYW5uZXItYWN0aW9uc1wiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9pZ3gtZXhwYW5zaW9uLXBhbmVsLWJvZHk+XG48L2lneC1leHBhbnNpb24tcGFuZWw+Il19