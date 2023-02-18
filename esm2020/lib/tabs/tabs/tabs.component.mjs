import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { getResizeObserver, mkenum } from '../../core/utils';
import { IgxTabsBase } from '../tabs.base';
import { IgxTabsDirective } from '../tabs.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "../../services/direction/directionality";
import * as i3 from "../../icon/icon.component";
import * as i4 from "../../directives/ripple/ripple.directive";
import * as i5 from "@angular/common";
export const IgxTabsAlignment = mkenum({
    start: 'start',
    end: 'end',
    center: 'center',
    justify: 'justify'
});
/** @hidden */
var TabScrollButtonStyle;
(function (TabScrollButtonStyle) {
    TabScrollButtonStyle["Visible"] = "visible";
    TabScrollButtonStyle["Hidden"] = "hidden";
    TabScrollButtonStyle["NotDisplayed"] = "not_displayed";
})(TabScrollButtonStyle || (TabScrollButtonStyle = {}));
/** @hidden */
let NEXT_TAB_ID = 0;
/**
 * Tabs component is used to organize or switch between similar data sets.
 *
 * @igxModule IgxTabsModule
 *
 * @igxTheme igx-tabs-theme
 *
 * @igxKeywords tabs
 *
 * @igxGroup Layouts
 *
 * @remarks
 * The Ignite UI for Angular Tabs component places tabs at the top and allows for scrolling when there are multiple tab items on the screen.
 *
 * @example
 * ```html
 * <igx-tabs>
 *     <igx-tab-item>
 *         <igx-tab-header>
 *             <igx-icon igxTabHeaderIcon>folder</igx-icon>
 *             <span igxTabHeaderLabel>Tab 1</span>
 *         </igx-tab-header>
 *         <igx-tab-content>
 *             Content 1
 *         </igx-tab-content>
 *     </igx-tab-item>
 *     ...
 * </igx-tabs>
 * ```
 */
export class IgxTabsComponent extends IgxTabsDirective {
    constructor(builder, cdr, ngZone, dir) {
        super(builder, cdr, dir);
        this.ngZone = ngZone;
        this.dir = dir;
        /** @hidden */
        this.defaultClass = true;
        /**  @hidden */
        this.offset = 0;
        /** @hidden */
        this.componentName = 'igx-tabs';
        this._tabAlignment = 'start';
    }
    /**
     * An @Input property which determines the tab alignment. Defaults to `start`.
     */
    get tabAlignment() {
        return this._tabAlignment;
    }
    ;
    set tabAlignment(value) {
        this._tabAlignment = value;
        requestAnimationFrame(() => {
            this.updateScrollButtons();
            this.realignSelectedIndicator();
        });
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.ngZone.runOutsideAngular(() => {
            this._resizeObserver = new (getResizeObserver())(() => {
                this.updateScrollButtons();
                this.realignSelectedIndicator();
            });
            this._resizeObserver.observe(this.headerContainer.nativeElement);
            this._resizeObserver.observe(this.viewPort.nativeElement);
        });
    }
    /** @hidden @internal */
    ngOnDestroy() {
        super.ngOnDestroy();
        this.ngZone.runOutsideAngular(() => {
            this._resizeObserver?.disconnect();
        });
    }
    /** @hidden */
    scrollPrev() {
        this.scroll(false);
    }
    /** @hidden */
    scrollNext() {
        this.scroll(true);
    }
    /** @hidden */
    realignSelectedIndicator() {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
            const header = this.items.get(this.selectedIndex).headerComponent.nativeElement;
            this.alignSelectedIndicator(header, 0);
        }
    }
    /** @hidden */
    resolveHeaderScrollClasses() {
        return {
            'igx-tabs__header-scroll--start': this.tabAlignment === 'start',
            'igx-tabs__header-scroll--end': this.tabAlignment === 'end',
            'igx-tabs__header-scroll--center': this.tabAlignment === 'center',
            'igx-tabs__header-scroll--justify': this.tabAlignment === 'justify',
        };
    }
    /** @hidden */
    scrollTabHeaderIntoView() {
        if (this.selectedIndex >= 0) {
            const tabItems = this.items.toArray();
            const tabHeaderNativeElement = tabItems[this.selectedIndex].headerComponent.nativeElement;
            // Scroll left if there is need
            if (this.getElementOffset(tabHeaderNativeElement) < this.offset) {
                this.scrollElement(tabHeaderNativeElement, false);
            }
            // Scroll right if there is need
            const viewPortOffsetWidth = this.viewPort.nativeElement.offsetWidth;
            const delta = (this.getElementOffset(tabHeaderNativeElement) + tabHeaderNativeElement.offsetWidth) - (viewPortOffsetWidth + this.offset);
            // Fix for IE 11, a difference is accumulated from the widths calculations
            if (delta > 1) {
                this.scrollElement(tabHeaderNativeElement, true);
            }
            this.alignSelectedIndicator(tabHeaderNativeElement);
        }
        else {
            this.hideSelectedIndicator();
        }
    }
    /** @hidden */
    getNextTabId() {
        return NEXT_TAB_ID++;
    }
    /** @hidden */
    onItemChanges() {
        super.onItemChanges();
        Promise.resolve().then(() => {
            this.updateScrollButtons();
        });
    }
    alignSelectedIndicator(element, duration = 0.3) {
        if (this.selectedIndicator) {
            this.selectedIndicator.nativeElement.style.visibility = 'visible';
            this.selectedIndicator.nativeElement.style.transitionDuration = duration > 0 ? `${duration}s` : 'initial';
            this.selectedIndicator.nativeElement.style.width = `${element.offsetWidth}px`;
            this.selectedIndicator.nativeElement.style.transform = `translate(${element.offsetLeft}px)`;
        }
    }
    hideSelectedIndicator() {
        if (this.selectedIndicator) {
            this.selectedIndicator.nativeElement.style.visibility = 'hidden';
        }
    }
    scroll(scrollNext) {
        const tabsArray = this.items.toArray();
        for (let index = 0; index < tabsArray.length; index++) {
            const tab = tabsArray[index];
            const element = tab.headerComponent.nativeElement;
            if (scrollNext) {
                if (element.offsetWidth + this.getElementOffset(element) > this.viewPort.nativeElement.offsetWidth + this.offset) {
                    this.scrollElement(element, scrollNext);
                    break;
                }
            }
            else {
                if (this.getElementOffset(element) >= this.offset) {
                    this.scrollElement(tabsArray[index - 1].headerComponent.nativeElement, scrollNext);
                    break;
                }
            }
        }
    }
    scrollElement(element, scrollNext) {
        const viewPortWidth = this.viewPort.nativeElement.offsetWidth;
        this.offset = (scrollNext) ? element.offsetWidth + this.getElementOffset(element) - viewPortWidth : this.getElementOffset(element);
        this.viewPort.nativeElement.scrollLeft = this.getOffset(this.offset);
        this.updateScrollButtons();
    }
    updateScrollButtons() {
        const itemsContainerWidth = this.getTabItemsContainerWidth();
        const scrollPrevButtonStyle = this.resolveLeftScrollButtonStyle(itemsContainerWidth);
        this.setScrollButtonStyle(this.scrollPrevButton.nativeElement, scrollPrevButtonStyle);
        const scrollNextButtonStyle = this.resolveRightScrollButtonStyle(itemsContainerWidth);
        this.setScrollButtonStyle(this.scrollNextButton.nativeElement, scrollNextButtonStyle);
    }
    setScrollButtonStyle(button, buttonStyle) {
        if (buttonStyle === TabScrollButtonStyle.Visible) {
            button.style.visibility = 'visible';
            button.style.display = '';
        }
        else if (buttonStyle === TabScrollButtonStyle.Hidden) {
            button.style.visibility = 'hidden';
            button.style.display = '';
        }
        else if (buttonStyle === TabScrollButtonStyle.NotDisplayed) {
            button.style.display = 'none';
        }
    }
    resolveLeftScrollButtonStyle(itemsContainerWidth) {
        const headerContainerWidth = this.headerContainer.nativeElement.offsetWidth;
        const offset = this.offset;
        if (offset === 0) {
            // Fix for IE 11, a difference is accumulated from the widths calculations.
            if (itemsContainerWidth - headerContainerWidth <= 1) {
                return TabScrollButtonStyle.NotDisplayed;
            }
            return TabScrollButtonStyle.Hidden;
        }
        else {
            return TabScrollButtonStyle.Visible;
        }
    }
    resolveRightScrollButtonStyle(itemsContainerWidth) {
        const viewPortWidth = this.viewPort.nativeElement.offsetWidth;
        const headerContainerWidth = this.headerContainer.nativeElement.offsetWidth;
        const offset = this.offset;
        const total = offset + viewPortWidth;
        // Fix for IE 11, a difference is accumulated from the widths calculations.
        if (itemsContainerWidth - headerContainerWidth <= 1 && offset === 0) {
            return TabScrollButtonStyle.NotDisplayed;
        }
        if (itemsContainerWidth > total) {
            return TabScrollButtonStyle.Visible;
        }
        else {
            return TabScrollButtonStyle.Hidden;
        }
    }
    getTabItemsContainerWidth() {
        // We use this hacky way to get the width of the itemsContainer,
        // because there is inconsistency in IE we cannot use offsetWidth or scrollOffset.
        const itemsContainerChildrenCount = this.itemsContainer.nativeElement.children.length;
        let itemsContainerWidth = 0;
        if (itemsContainerChildrenCount > 1) {
            const lastTab = this.itemsContainer.nativeElement.children[itemsContainerChildrenCount - 1];
            itemsContainerWidth = this.getElementOffset(lastTab) + lastTab.offsetWidth;
        }
        return itemsContainerWidth;
    }
    getOffset(offset) {
        return this.dir.rtl ? -offset : offset;
    }
    getElementOffset(element) {
        return this.dir.rtl ? this.itemsWrapper.nativeElement.offsetWidth - element.offsetLeft - element.offsetWidth : element.offsetLeft;
    }
}
IgxTabsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsComponent, deps: [{ token: i1.AnimationBuilder }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i2.IgxDirectionality }], target: i0.ɵɵFactoryTarget.Component });
IgxTabsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTabsComponent, selector: "igx-tabs", inputs: { tabAlignment: "tabAlignment" }, host: { properties: { "class.igx-tabs": "this.defaultClass" } }, providers: [{ provide: IgxTabsBase, useExisting: IgxTabsComponent }], viewQueries: [{ propertyName: "headerContainer", first: true, predicate: ["headerContainer"], descendants: true, static: true }, { propertyName: "viewPort", first: true, predicate: ["viewPort"], descendants: true, static: true }, { propertyName: "itemsWrapper", first: true, predicate: ["itemsWrapper"], descendants: true, static: true }, { propertyName: "itemsContainer", first: true, predicate: ["itemsContainer"], descendants: true, static: true }, { propertyName: "selectedIndicator", first: true, predicate: ["selectedIndicator"], descendants: true }, { propertyName: "scrollPrevButton", first: true, predicate: ["scrollPrevButton"], descendants: true }, { propertyName: "scrollNextButton", first: true, predicate: ["scrollNextButton"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div #headerContainer class=\"igx-tabs__header\">\n    <button #scrollPrevButton igxButton=\"icon\" igxRipple class=\"igx-tabs__header-button\" (click)=\"scrollPrev()\">\n        <igx-icon>navigate_before</igx-icon>\n    </button>\n    <div #viewPort class=\"igx-tabs__header-content\">\n        <div #itemsWrapper class=\"igx-tabs__header-wrapper\" role=\"tablist\">\n            <div #itemsContainer class=\"igx-tabs__header-scroll\" [ngClass]=\"resolveHeaderScrollClasses()\">\n                <ng-container *ngFor=\"let tab of items; let i = index\">\n                    <ng-container *ngTemplateOutlet=\"tab.headerTemplate\"></ng-container>\n                </ng-container>\n            </div>\n            <div #selectedIndicator *ngIf=\"items.length > 0\" class=\"igx-tabs__header-active-indicator\">\n            </div>\n        </div>\n    </div>\n    <button #scrollNextButton igxButton=\"icon\" igxRipple class=\"igx-tabs__header-button\" (click)=\"scrollNext()\">\n        <igx-icon>navigate_next</igx-icon>\n    </button>\n</div>\n<div class=\"igx-tabs__panels\">\n    <ng-container *ngFor=\"let tab of items; let i = index\">\n        <ng-container *ngTemplateOutlet=\"tab.panelTemplate\"></ng-container>\n    </ng-container>\n</div>", components: [{ type: i3.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i4.IgxRippleDirective, selector: "[igxRipple]", inputs: ["igxRippleTarget", "igxRipple", "igxRippleDuration", "igxRippleCentered", "igxRippleDisabled"] }, { type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-tabs', providers: [{ provide: IgxTabsBase, useExisting: IgxTabsComponent }], template: "<div #headerContainer class=\"igx-tabs__header\">\n    <button #scrollPrevButton igxButton=\"icon\" igxRipple class=\"igx-tabs__header-button\" (click)=\"scrollPrev()\">\n        <igx-icon>navigate_before</igx-icon>\n    </button>\n    <div #viewPort class=\"igx-tabs__header-content\">\n        <div #itemsWrapper class=\"igx-tabs__header-wrapper\" role=\"tablist\">\n            <div #itemsContainer class=\"igx-tabs__header-scroll\" [ngClass]=\"resolveHeaderScrollClasses()\">\n                <ng-container *ngFor=\"let tab of items; let i = index\">\n                    <ng-container *ngTemplateOutlet=\"tab.headerTemplate\"></ng-container>\n                </ng-container>\n            </div>\n            <div #selectedIndicator *ngIf=\"items.length > 0\" class=\"igx-tabs__header-active-indicator\">\n            </div>\n        </div>\n    </div>\n    <button #scrollNextButton igxButton=\"icon\" igxRipple class=\"igx-tabs__header-button\" (click)=\"scrollNext()\">\n        <igx-icon>navigate_next</igx-icon>\n    </button>\n</div>\n<div class=\"igx-tabs__panels\">\n    <ng-container *ngFor=\"let tab of items; let i = index\">\n        <ng-container *ngTemplateOutlet=\"tab.panelTemplate\"></ng-container>\n    </ng-container>\n</div>" }]
        }], ctorParameters: function () { return [{ type: i1.AnimationBuilder }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i2.IgxDirectionality }]; }, propDecorators: { tabAlignment: [{
                type: Input
            }], headerContainer: [{
                type: ViewChild,
                args: ['headerContainer', { static: true }]
            }], viewPort: [{
                type: ViewChild,
                args: ['viewPort', { static: true }]
            }], itemsWrapper: [{
                type: ViewChild,
                args: ['itemsWrapper', { static: true }]
            }], itemsContainer: [{
                type: ViewChild,
                args: ['itemsContainer', { static: true }]
            }], selectedIndicator: [{
                type: ViewChild,
                args: ['selectedIndicator']
            }], scrollPrevButton: [{
                type: ViewChild,
                args: ['scrollPrevButton']
            }], scrollNextButton: [{
                type: ViewChild,
                args: ['scrollNextButton']
            }], defaultClass: [{
                type: HostBinding,
                args: ['class.igx-tabs']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvdGFicy90YWJzL3RhYnMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3RhYnMvdGFicy90YWJzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBb0MsU0FBUyxFQUFjLFdBQVcsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxSSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFN0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7OztBQUVyRCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7SUFDbkMsS0FBSyxFQUFFLE9BQU87SUFDZCxHQUFHLEVBQUUsS0FBSztJQUNWLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLE9BQU8sRUFBRSxTQUFTO0NBQ3JCLENBQUMsQ0FBQztBQUVILGNBQWM7QUFDZCxJQUFLLG9CQUlKO0FBSkQsV0FBSyxvQkFBb0I7SUFDckIsMkNBQW1CLENBQUE7SUFDbkIseUNBQWlCLENBQUE7SUFDakIsc0RBQThCLENBQUE7QUFDbEMsQ0FBQyxFQUpJLG9CQUFvQixLQUFwQixvQkFBb0IsUUFJeEI7QUFJRCxjQUFjO0FBQ2QsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRXBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCRztBQU9ILE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxnQkFBZ0I7SUEyRGxELFlBQVksT0FBeUIsRUFBRSxHQUFzQixF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RUFBRSxJQUFJLEVBQUU7Z0JBS3RDLGlCQUFpQjtzQkFEdkIsU0FBUzt1QkFBQyxtQkFBbUI7Z0JBS3ZCLGdCQUFnQjtzQkFEdEIsU0FBUzt1QkFBQyxrQkFBa0I7Z0JBS3RCLGdCQUFnQjtzQkFEdEIsU0FBUzt1QkFBQyxrQkFBa0I7Z0JBS3RCLFlBQVk7c0JBRGxCLFdBQVc7dUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uQnVpbGRlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBnZXRSZXNpemVPYnNlcnZlciwgbWtlbnVtIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJZ3hEaXJlY3Rpb25hbGl0eSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RpcmVjdGlvbi9kaXJlY3Rpb25hbGl0eSc7XG5pbXBvcnQgeyBJZ3hUYWJzQmFzZSB9IGZyb20gJy4uL3RhYnMuYmFzZSc7XG5pbXBvcnQgeyBJZ3hUYWJzRGlyZWN0aXZlIH0gZnJvbSAnLi4vdGFicy5kaXJlY3RpdmUnO1xuXG5leHBvcnQgY29uc3QgSWd4VGFic0FsaWdubWVudCA9IG1rZW51bSh7XG4gICAgc3RhcnQ6ICdzdGFydCcsXG4gICAgZW5kOiAnZW5kJyxcbiAgICBjZW50ZXI6ICdjZW50ZXInLFxuICAgIGp1c3RpZnk6ICdqdXN0aWZ5J1xufSk7XG5cbi8qKiBAaGlkZGVuICovXG5lbnVtIFRhYlNjcm9sbEJ1dHRvblN0eWxlIHtcbiAgICBWaXNpYmxlID0gJ3Zpc2libGUnLFxuICAgIEhpZGRlbiA9ICdoaWRkZW4nLFxuICAgIE5vdERpc3BsYXllZCA9ICdub3RfZGlzcGxheWVkJ1xufVxuXG5leHBvcnQgdHlwZSBJZ3hUYWJzQWxpZ25tZW50ID0gKHR5cGVvZiBJZ3hUYWJzQWxpZ25tZW50KVtrZXlvZiB0eXBlb2YgSWd4VGFic0FsaWdubWVudF07XG5cbi8qKiBAaGlkZGVuICovXG5sZXQgTkVYVF9UQUJfSUQgPSAwO1xuXG4vKipcbiAqIFRhYnMgY29tcG9uZW50IGlzIHVzZWQgdG8gb3JnYW5pemUgb3Igc3dpdGNoIGJldHdlZW4gc2ltaWxhciBkYXRhIHNldHMuXG4gKlxuICogQGlneE1vZHVsZSBJZ3hUYWJzTW9kdWxlXG4gKlxuICogQGlneFRoZW1lIGlneC10YWJzLXRoZW1lXG4gKlxuICogQGlneEtleXdvcmRzIHRhYnNcbiAqXG4gKiBAaWd4R3JvdXAgTGF5b3V0c1xuICpcbiAqIEByZW1hcmtzXG4gKiBUaGUgSWduaXRlIFVJIGZvciBBbmd1bGFyIFRhYnMgY29tcG9uZW50IHBsYWNlcyB0YWJzIGF0IHRoZSB0b3AgYW5kIGFsbG93cyBmb3Igc2Nyb2xsaW5nIHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIHRhYiBpdGVtcyBvbiB0aGUgc2NyZWVuLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8aWd4LXRhYnM+XG4gKiAgICAgPGlneC10YWItaXRlbT5cbiAqICAgICAgICAgPGlneC10YWItaGVhZGVyPlxuICogICAgICAgICAgICAgPGlneC1pY29uIGlneFRhYkhlYWRlckljb24+Zm9sZGVyPC9pZ3gtaWNvbj5cbiAqICAgICAgICAgICAgIDxzcGFuIGlneFRhYkhlYWRlckxhYmVsPlRhYiAxPC9zcGFuPlxuICogICAgICAgICA8L2lneC10YWItaGVhZGVyPlxuICogICAgICAgICA8aWd4LXRhYi1jb250ZW50PlxuICogICAgICAgICAgICAgQ29udGVudCAxXG4gKiAgICAgICAgIDwvaWd4LXRhYi1jb250ZW50PlxuICogICAgIDwvaWd4LXRhYi1pdGVtPlxuICogICAgIC4uLlxuICogPC9pZ3gtdGFicz5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2lneC10YWJzJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RhYnMuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogSWd4VGFic0Jhc2UsIHVzZUV4aXN0aW5nOiBJZ3hUYWJzQ29tcG9uZW50IH1dXG59KVxuXG5leHBvcnQgY2xhc3MgSWd4VGFic0NvbXBvbmVudCBleHRlbmRzIElneFRhYnNEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgLyoqXG4gICAgICogQW4gQElucHV0IHByb3BlcnR5IHdoaWNoIGRldGVybWluZXMgdGhlIHRhYiBhbGlnbm1lbnQuIERlZmF1bHRzIHRvIGBzdGFydGAuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHRhYkFsaWdubWVudCgpOiBzdHJpbmcgfCBJZ3hUYWJzQWxpZ25tZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhYkFsaWdubWVudDtcbiAgICB9O1xuXG4gICAgcHVibGljIHNldCB0YWJBbGlnbm1lbnQodmFsdWU6IHN0cmluZyB8IElneFRhYnNBbGlnbm1lbnQpIHtcbiAgICAgICAgdGhpcy5fdGFiQWxpZ25tZW50ID0gdmFsdWU7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIHRoaXMucmVhbGlnblNlbGVjdGVkSW5kaWNhdG9yKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQFZpZXdDaGlsZCgnaGVhZGVyQ29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgaGVhZGVyQ29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQFZpZXdDaGlsZCgndmlld1BvcnQnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICAgIHB1YmxpYyB2aWV3UG9ydDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBWaWV3Q2hpbGQoJ2l0ZW1zV3JhcHBlcicsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcHVibGljIGl0ZW1zV3JhcHBlcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBWaWV3Q2hpbGQoJ2l0ZW1zQ29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgICBwdWJsaWMgaXRlbXNDb250YWluZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBAVmlld0NoaWxkKCdzZWxlY3RlZEluZGljYXRvcicpXG4gICAgcHVibGljIHNlbGVjdGVkSW5kaWNhdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQFZpZXdDaGlsZCgnc2Nyb2xsUHJldkJ1dHRvbicpXG4gICAgcHVibGljIHNjcm9sbFByZXZCdXR0b246IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxOZXh0QnV0dG9uJylcbiAgICBwdWJsaWMgc2Nyb2xsTmV4dEJ1dHRvbjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LXRhYnMnKVxuICAgIHB1YmxpYyBkZWZhdWx0Q2xhc3MgPSB0cnVlO1xuXG4gICAgLyoqICBAaGlkZGVuICovXG4gICAgcHVibGljIG9mZnNldCA9IDA7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHByb3RlY3RlZCBjb21wb25lbnROYW1lID0gJ2lneC10YWJzJztcblxuICAgIHByaXZhdGUgX3RhYkFsaWdubWVudDogc3RyaW5nIHwgSWd4VGFic0FsaWdubWVudCA9ICdzdGFydCc7XG4gICAgcHJpdmF0ZSBfcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyO1xuXG4gICAgY29uc3RydWN0b3IoYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlciwgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHVibGljIGRpcjogSWd4RGlyZWN0aW9uYWxpdHkpIHtcbiAgICAgICAgc3VwZXIoYnVpbGRlciwgY2RyLCBkaXIpO1xuICAgIH1cblxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG5cbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIgPSBuZXcgKGdldFJlc2l6ZU9ic2VydmVyKCkpKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWxpZ25TZWxlY3RlZEluZGljYXRvcigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuaGVhZGVyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZpZXdQb3J0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG5cbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgc2Nyb2xsUHJldigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGwoZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIHNjcm9sbE5leHQoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsKHRydWUpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIHJlYWxpZ25TZWxlY3RlZEluZGljYXRvcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA+PSAwICYmIHRoaXMuc2VsZWN0ZWRJbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBoZWFkZXIgPSB0aGlzLml0ZW1zLmdldCh0aGlzLnNlbGVjdGVkSW5kZXgpLmhlYWRlckNvbXBvbmVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5hbGlnblNlbGVjdGVkSW5kaWNhdG9yKGhlYWRlciwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyByZXNvbHZlSGVhZGVyU2Nyb2xsQ2xhc3NlcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdpZ3gtdGFic19faGVhZGVyLXNjcm9sbC0tc3RhcnQnOiB0aGlzLnRhYkFsaWdubWVudCA9PT0gJ3N0YXJ0JyxcbiAgICAgICAgICAgICdpZ3gtdGFic19faGVhZGVyLXNjcm9sbC0tZW5kJzogdGhpcy50YWJBbGlnbm1lbnQgPT09ICdlbmQnLFxuICAgICAgICAgICAgJ2lneC10YWJzX19oZWFkZXItc2Nyb2xsLS1jZW50ZXInOiB0aGlzLnRhYkFsaWdubWVudCA9PT0gJ2NlbnRlcicsXG4gICAgICAgICAgICAnaWd4LXRhYnNfX2hlYWRlci1zY3JvbGwtLWp1c3RpZnknOiB0aGlzLnRhYkFsaWdubWVudCA9PT0gJ2p1c3RpZnknLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIHNjcm9sbFRhYkhlYWRlckludG9WaWV3KCkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHRhYkl0ZW1zID0gdGhpcy5pdGVtcy50b0FycmF5KCk7XG4gICAgICAgICAgICBjb25zdCB0YWJIZWFkZXJOYXRpdmVFbGVtZW50ID0gdGFiSXRlbXNbdGhpcy5zZWxlY3RlZEluZGV4XS5oZWFkZXJDb21wb25lbnQubmF0aXZlRWxlbWVudDtcblxuICAgICAgICAgICAgLy8gU2Nyb2xsIGxlZnQgaWYgdGhlcmUgaXMgbmVlZFxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RWxlbWVudE9mZnNldCh0YWJIZWFkZXJOYXRpdmVFbGVtZW50KSA8IHRoaXMub2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50KHRhYkhlYWRlck5hdGl2ZUVsZW1lbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2Nyb2xsIHJpZ2h0IGlmIHRoZXJlIGlzIG5lZWRcbiAgICAgICAgICAgIGNvbnN0IHZpZXdQb3J0T2Zmc2V0V2lkdGggPSB0aGlzLnZpZXdQb3J0Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9ICh0aGlzLmdldEVsZW1lbnRPZmZzZXQodGFiSGVhZGVyTmF0aXZlRWxlbWVudCkgKyB0YWJIZWFkZXJOYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoKSAtICh2aWV3UG9ydE9mZnNldFdpZHRoICsgdGhpcy5vZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBGaXggZm9yIElFIDExLCBhIGRpZmZlcmVuY2UgaXMgYWNjdW11bGF0ZWQgZnJvbSB0aGUgd2lkdGhzIGNhbGN1bGF0aW9uc1xuICAgICAgICAgICAgaWYgKGRlbHRhID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudCh0YWJIZWFkZXJOYXRpdmVFbGVtZW50LCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hbGlnblNlbGVjdGVkSW5kaWNhdG9yKHRhYkhlYWRlck5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oaWRlU2VsZWN0ZWRJbmRpY2F0b3IoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIGdldE5leHRUYWJJZCgpIHtcbiAgICAgICAgcmV0dXJuIE5FWFRfVEFCX0lEKys7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgb25JdGVtQ2hhbmdlcygpIHtcbiAgICAgICAgc3VwZXIub25JdGVtQ2hhbmdlcygpO1xuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxCdXR0b25zKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWxpZ25TZWxlY3RlZEluZGljYXRvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgZHVyYXRpb24gPSAwLjMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRpY2F0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRpY2F0b3IubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGljYXRvci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uID4gMCA/IGAke2R1cmF0aW9ufXNgIDogJ2luaXRpYWwnO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGljYXRvci5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7ZWxlbWVudC5vZmZzZXRXaWR0aH1weGA7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kaWNhdG9yLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke2VsZW1lbnQub2Zmc2V0TGVmdH1weClgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWRlU2VsZWN0ZWRJbmRpY2F0b3IoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kaWNhdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kaWNhdG9yLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY3JvbGwoc2Nyb2xsTmV4dDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCB0YWJzQXJyYXkgPSB0aGlzLml0ZW1zLnRvQXJyYXkoKTtcblxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGFic0FycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgdGFiID0gdGFic0FycmF5W2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0YWIuaGVhZGVyQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoc2Nyb2xsTmV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoICsgdGhpcy5nZXRFbGVtZW50T2Zmc2V0KGVsZW1lbnQpID4gdGhpcy52aWV3UG9ydC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoICsgdGhpcy5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50KGVsZW1lbnQsIHNjcm9sbE5leHQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldEVsZW1lbnRPZmZzZXQoZWxlbWVudCkgPj0gdGhpcy5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50KHRhYnNBcnJheVtpbmRleCAtIDFdLmhlYWRlckNvbXBvbmVudC5uYXRpdmVFbGVtZW50LCBzY3JvbGxOZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzY3JvbGxFbGVtZW50KGVsZW1lbnQ6IGFueSwgc2Nyb2xsTmV4dDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCB2aWV3UG9ydFdpZHRoID0gdGhpcy52aWV3UG9ydC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gKHNjcm9sbE5leHQpID8gZWxlbWVudC5vZmZzZXRXaWR0aCArIHRoaXMuZ2V0RWxlbWVudE9mZnNldChlbGVtZW50KSAtIHZpZXdQb3J0V2lkdGggOiB0aGlzLmdldEVsZW1lbnRPZmZzZXQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMudmlld1BvcnQubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gdGhpcy5nZXRPZmZzZXQodGhpcy5vZmZzZXQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJ1dHRvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNjcm9sbEJ1dHRvbnMoKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zQ29udGFpbmVyV2lkdGggPSB0aGlzLmdldFRhYkl0ZW1zQ29udGFpbmVyV2lkdGgoKTtcblxuICAgICAgICBjb25zdCBzY3JvbGxQcmV2QnV0dG9uU3R5bGUgPSB0aGlzLnJlc29sdmVMZWZ0U2Nyb2xsQnV0dG9uU3R5bGUoaXRlbXNDb250YWluZXJXaWR0aCk7XG4gICAgICAgIHRoaXMuc2V0U2Nyb2xsQnV0dG9uU3R5bGUodGhpcy5zY3JvbGxQcmV2QnV0dG9uLm5hdGl2ZUVsZW1lbnQsIHNjcm9sbFByZXZCdXR0b25TdHlsZSk7XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsTmV4dEJ1dHRvblN0eWxlID0gdGhpcy5yZXNvbHZlUmlnaHRTY3JvbGxCdXR0b25TdHlsZShpdGVtc0NvbnRhaW5lcldpZHRoKTtcbiAgICAgICAgdGhpcy5zZXRTY3JvbGxCdXR0b25TdHlsZSh0aGlzLnNjcm9sbE5leHRCdXR0b24ubmF0aXZlRWxlbWVudCwgc2Nyb2xsTmV4dEJ1dHRvblN0eWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNjcm9sbEJ1dHRvblN0eWxlKGJ1dHRvbjogSFRNTEVsZW1lbnQsIGJ1dHRvblN0eWxlOiBUYWJTY3JvbGxCdXR0b25TdHlsZSkge1xuICAgICAgICBpZiAoYnV0dG9uU3R5bGUgPT09IFRhYlNjcm9sbEJ1dHRvblN0eWxlLlZpc2libGUpIHtcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChidXR0b25TdHlsZSA9PT0gVGFiU2Nyb2xsQnV0dG9uU3R5bGUuSGlkZGVuKSB7XG4gICAgICAgICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgfSBlbHNlIGlmIChidXR0b25TdHlsZSA9PT0gVGFiU2Nyb2xsQnV0dG9uU3R5bGUuTm90RGlzcGxheWVkKSB7XG4gICAgICAgICAgICBidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHJlc29sdmVMZWZ0U2Nyb2xsQnV0dG9uU3R5bGUoaXRlbXNDb250YWluZXJXaWR0aDogbnVtYmVyKTogVGFiU2Nyb2xsQnV0dG9uU3R5bGUge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250YWluZXJXaWR0aCA9IHRoaXMuaGVhZGVyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xuXG4gICAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgICAgIC8vIEZpeCBmb3IgSUUgMTEsIGEgZGlmZmVyZW5jZSBpcyBhY2N1bXVsYXRlZCBmcm9tIHRoZSB3aWR0aHMgY2FsY3VsYXRpb25zLlxuICAgICAgICAgICAgaWYgKGl0ZW1zQ29udGFpbmVyV2lkdGggLSBoZWFkZXJDb250YWluZXJXaWR0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFRhYlNjcm9sbEJ1dHRvblN0eWxlLk5vdERpc3BsYXllZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBUYWJTY3JvbGxCdXR0b25TdHlsZS5IaWRkZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gVGFiU2Nyb2xsQnV0dG9uU3R5bGUuVmlzaWJsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzb2x2ZVJpZ2h0U2Nyb2xsQnV0dG9uU3R5bGUoaXRlbXNDb250YWluZXJXaWR0aDogbnVtYmVyKTogVGFiU2Nyb2xsQnV0dG9uU3R5bGUge1xuICAgICAgICBjb25zdCB2aWV3UG9ydFdpZHRoID0gdGhpcy52aWV3UG9ydC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBjb25zdCBoZWFkZXJDb250YWluZXJXaWR0aCA9IHRoaXMuaGVhZGVyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgICAgICBjb25zdCB0b3RhbCA9IG9mZnNldCArIHZpZXdQb3J0V2lkdGg7XG5cbiAgICAgICAgLy8gRml4IGZvciBJRSAxMSwgYSBkaWZmZXJlbmNlIGlzIGFjY3VtdWxhdGVkIGZyb20gdGhlIHdpZHRocyBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGlmIChpdGVtc0NvbnRhaW5lcldpZHRoIC0gaGVhZGVyQ29udGFpbmVyV2lkdGggPD0gMSAmJiBvZmZzZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBUYWJTY3JvbGxCdXR0b25TdHlsZS5Ob3REaXNwbGF5ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbXNDb250YWluZXJXaWR0aCA+IHRvdGFsKSB7XG4gICAgICAgICAgICByZXR1cm4gVGFiU2Nyb2xsQnV0dG9uU3R5bGUuVmlzaWJsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBUYWJTY3JvbGxCdXR0b25TdHlsZS5IaWRkZW47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRhYkl0ZW1zQ29udGFpbmVyV2lkdGgoKSB7XG4gICAgICAgIC8vIFdlIHVzZSB0aGlzIGhhY2t5IHdheSB0byBnZXQgdGhlIHdpZHRoIG9mIHRoZSBpdGVtc0NvbnRhaW5lcixcbiAgICAgICAgLy8gYmVjYXVzZSB0aGVyZSBpcyBpbmNvbnNpc3RlbmN5IGluIElFIHdlIGNhbm5vdCB1c2Ugb2Zmc2V0V2lkdGggb3Igc2Nyb2xsT2Zmc2V0LlxuICAgICAgICBjb25zdCBpdGVtc0NvbnRhaW5lckNoaWxkcmVuQ291bnQgPSB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICBsZXQgaXRlbXNDb250YWluZXJXaWR0aCA9IDA7XG5cbiAgICAgICAgaWYgKGl0ZW1zQ29udGFpbmVyQ2hpbGRyZW5Db3VudCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RUYWIgPSB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5baXRlbXNDb250YWluZXJDaGlsZHJlbkNvdW50IC0gMV0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICBpdGVtc0NvbnRhaW5lcldpZHRoID0gdGhpcy5nZXRFbGVtZW50T2Zmc2V0KGxhc3RUYWIpICsgbGFzdFRhYi5vZmZzZXRXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtc0NvbnRhaW5lcldpZHRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T2Zmc2V0KG9mZnNldDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyLnJ0bCA/IC1vZmZzZXQgOiBvZmZzZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRFbGVtZW50T2Zmc2V0KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyLnJ0bCA/IHRoaXMuaXRlbXNXcmFwcGVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggLSBlbGVtZW50Lm9mZnNldExlZnQgLSBlbGVtZW50Lm9mZnNldFdpZHRoIDogZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgIH1cbn1cblxuIiwiPGRpdiAjaGVhZGVyQ29udGFpbmVyIGNsYXNzPVwiaWd4LXRhYnNfX2hlYWRlclwiPlxuICAgIDxidXR0b24gI3Njcm9sbFByZXZCdXR0b24gaWd4QnV0dG9uPVwiaWNvblwiIGlneFJpcHBsZSBjbGFzcz1cImlneC10YWJzX19oZWFkZXItYnV0dG9uXCIgKGNsaWNrKT1cInNjcm9sbFByZXYoKVwiPlxuICAgICAgICA8aWd4LWljb24+bmF2aWdhdGVfYmVmb3JlPC9pZ3gtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgICA8ZGl2ICN2aWV3UG9ydCBjbGFzcz1cImlneC10YWJzX19oZWFkZXItY29udGVudFwiPlxuICAgICAgICA8ZGl2ICNpdGVtc1dyYXBwZXIgY2xhc3M9XCJpZ3gtdGFic19faGVhZGVyLXdyYXBwZXJcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgPGRpdiAjaXRlbXNDb250YWluZXIgY2xhc3M9XCJpZ3gtdGFic19faGVhZGVyLXNjcm9sbFwiIFtuZ0NsYXNzXT1cInJlc29sdmVIZWFkZXJTY3JvbGxDbGFzc2VzKClcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCB0YWIgb2YgaXRlbXM7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRhYi5oZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNzZWxlY3RlZEluZGljYXRvciAqbmdJZj1cIml0ZW1zLmxlbmd0aCA+IDBcIiBjbGFzcz1cImlneC10YWJzX19oZWFkZXItYWN0aXZlLWluZGljYXRvclwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxidXR0b24gI3Njcm9sbE5leHRCdXR0b24gaWd4QnV0dG9uPVwiaWNvblwiIGlneFJpcHBsZSBjbGFzcz1cImlneC10YWJzX19oZWFkZXItYnV0dG9uXCIgKGNsaWNrKT1cInNjcm9sbE5leHQoKVwiPlxuICAgICAgICA8aWd4LWljb24+bmF2aWdhdGVfbmV4dDwvaWd4LWljb24+XG4gICAgPC9idXR0b24+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJpZ3gtdGFic19fcGFuZWxzXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgdGFiIG9mIGl0ZW1zOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0YWIucGFuZWxUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuPC9kaXY+Il19