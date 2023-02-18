import { Component, EventEmitter, HostBinding, Input, Output, ContentChild } from '@angular/core';
import { IgxExpansionPanelBodyComponent } from './expansion-panel-body.component';
import { IgxExpansionPanelHeaderComponent } from './expansion-panel-header.component';
import { IGX_EXPANSION_PANEL_COMPONENT } from './expansion-panel.common';
import { ToggleAnimationPlayer } from './toggle-animation-component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "@angular/common";
let NEXT_ID = 0;
export class IgxExpansionPanelComponent extends ToggleAnimationPlayer {
    constructor(cdr, builder, elementRef) {
        super(builder);
        this.cdr = cdr;
        this.builder = builder;
        this.elementRef = elementRef;
        /**
         * Sets/gets the `id` of the expansion panel component.
         * If not set, `id` will have value `"igx-expansion-panel-0"`;
         * ```html
         * <igx-expansion-panel id = "my-first-expansion-panel"></igx-expansion-panel>
         * ```
         * ```typescript
         * let panelId =  this.panel.id;
         * ```
         *
         * @memberof IgxExpansionPanelComponent
         */
        this.id = `igx-expansion-panel-${NEXT_ID++}`;
        /**
         * @hidden
         */
        this.cssClass = 'igx-expansion-panel';
        /**
         * Gets/sets whether the component is collapsed (its content is hidden)
         * Get
         * ```typescript
         *  const myPanelState: boolean = this.panel.collapsed;
         * ```
         * Set
         * ```html
         *  this.panel.collapsed = true;
         * ```
         *
         * Two-way data binding:
         * ```html
         * <igx-expansion-panel [(collapsed)]="model.isCollapsed"></igx-expansion-panel>
         * ```
         */
        this.collapsed = true;
        /**
         * @hidden
         */
        this.collapsedChange = new EventEmitter();
        /**
         * Emitted when the expansion panel starts collapsing
         * ```typescript
         *  handleCollapsing(event: IExpansionPanelCancelableEventArgs)
         * ```
         * ```html
         *  <igx-expansion-panel (contentCollapsing)="handleCollapsing($event)">
         *      ...
         *  </igx-expansion-panel>
         * ```
         */
        this.contentCollapsing = new EventEmitter();
        /**
         * Emitted when the expansion panel finishes collapsing
         * ```typescript
         *  handleCollapsed(event: IExpansionPanelEventArgs)
         * ```
         * ```html
         *  <igx-expansion-panel (contentCollapsed)="handleCollapsed($event)">
         *      ...
         *  </igx-expansion-panel>
         * ```
         */
        this.contentCollapsed = new EventEmitter();
        /**
         * Emitted when the expansion panel starts expanding
         * ```typescript
         *  handleExpanding(event: IExpansionPanelCancelableEventArgs)
         * ```
         * ```html
         *  <igx-expansion-panel (contentExpanding)="handleExpanding($event)">
         *      ...
         *  </igx-expansion-panel>
         * ```
         */
        this.contentExpanding = new EventEmitter();
        /**
         * Emitted when the expansion panel finishes expanding
         * ```typescript
         *  handleExpanded(event: IExpansionPanelEventArgs)
         * ```
         * ```html
         *  <igx-expansion-panel (contentExpanded)="handleExpanded($event)">
         *      ...
         *  </igx-expansion-panel>
         * ```
         */
        this.contentExpanded = new EventEmitter();
    }
    /**
     * Sets/gets the animation settings of the expansion panel component
     * Open and Close animation should be passed
     *
     * Get
     * ```typescript
     *  const currentAnimations = this.panel.animationSettings;
     * ```
     * Set
     * ```typescript
     *  import { slideInLeft, slideOutRight } from 'igniteui-angular';
     *  ...
     *  this.panel.animationsSettings = {
     *      openAnimation: slideInLeft,
     *      closeAnimation: slideOutRight
     * };
     * ```
     * or via template
     * ```typescript
     *  import { slideInLeft, slideOutRight } from 'igniteui-angular';
     *  ...
     *  myCustomAnimationObject = {
     *      openAnimation: slideInLeft,
     *      closeAnimation: slideOutRight
     * };
     * ```html
     *  <igx-expansion-panel [animationSettings]='myCustomAnimationObject'>
     *  ...
     *  </igx-expansion-panel>
     * ```
     */
    get animationSettings() {
        return this._animationSettings;
    }
    set animationSettings(value) {
        this._animationSettings = value;
    }
    /**
     * @hidden @internal
     */
    get panelExpanded() {
        return !this.collapsed;
    }
    /**
     * @hidden
     */
    get headerId() {
        return this.header ? `${this.id}-header` : '';
    }
    /**
     * @hidden @internal
     */
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    /** @hidden */
    ngAfterContentInit() {
        if (this.body && this.header) {
            // schedule at end of turn:
            Promise.resolve().then(() => {
                this.body.labelledBy = this.body.labelledBy || this.headerId;
                this.body.label = this.body.label || this.id + '-region';
            });
        }
    }
    /**
     * Collapses the panel
     *
     * ```html
     *  <igx-expansion-panel #myPanel>
     *      ...
     *  </igx-expansion-panel>
     *  <button (click)="myPanel.collapse($event)">Collpase Panel</button>
     * ```
     */
    collapse(evt) {
        // If expansion panel is already collapsed or is collapsing, do nothing
        if (this.collapsed || this.closeAnimationPlayer) {
            return;
        }
        const args = { event: evt, panel: this, owner: this, cancel: false };
        this.contentCollapsing.emit(args);
        if (args.cancel === true) {
            return;
        }
        this.playCloseAnimation(this.body?.element, () => {
            this.contentCollapsed.emit({ event: evt, owner: this });
            this.collapsed = true;
            this.collapsedChange.emit(true);
            this.cdr.markForCheck();
        });
    }
    /**
     * Expands the panel
     *
     * ```html
     *  <igx-expansion-panel #myPanel>
     *      ...
     *  </igx-expansion-panel>
     *  <button (click)="myPanel.expand($event)">Expand Panel</button>
     * ```
     */
    expand(evt) {
        if (!this.collapsed) { // If the panel is already opened, do nothing
            return;
        }
        const args = { event: evt, panel: this, owner: this, cancel: false };
        this.contentExpanding.emit(args);
        if (args.cancel === true) {
            return;
        }
        this.collapsed = false;
        this.collapsedChange.emit(false);
        this.cdr.detectChanges();
        this.playOpenAnimation(this.body?.element, () => {
            this.contentExpanded.emit({ event: evt, owner: this });
        });
    }
    /**
     * Toggles the panel
     *
     * ```html
     *  <igx-expansion-panel #myPanel>
     *      ...
     *  </igx-expansion-panel>
     *  <button (click)="myPanel.toggle($event)">Expand Panel</button>
     * ```
     */
    toggle(evt) {
        if (this.collapsed) {
            this.open(evt);
        }
        else {
            this.close(evt);
        }
    }
    open(evt) {
        this.expand(evt);
    }
    close(evt) {
        this.collapse(evt);
    }
}
IgxExpansionPanelComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.AnimationBuilder }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxExpansionPanelComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxExpansionPanelComponent, selector: "igx-expansion-panel", inputs: { animationSettings: "animationSettings", id: "id", collapsed: "collapsed" }, outputs: { collapsedChange: "collapsedChange", contentCollapsing: "contentCollapsing", contentCollapsed: "contentCollapsed", contentExpanding: "contentExpanding", contentExpanded: "contentExpanded" }, host: { properties: { "attr.id": "this.id", "class.igx-expansion-panel": "this.cssClass", "attr.aria-expanded": "this.panelExpanded" } }, providers: [{ provide: IGX_EXPANSION_PANEL_COMPONENT, useExisting: IgxExpansionPanelComponent }], queries: [{ propertyName: "body", first: true, predicate: IgxExpansionPanelBodyComponent, descendants: true, read: IgxExpansionPanelBodyComponent }, { propertyName: "header", first: true, predicate: IgxExpansionPanelHeaderComponent, descendants: true, read: IgxExpansionPanelHeaderComponent }], usesInheritance: true, ngImport: i0, template: "<ng-content select=\"igx-expansion-panel-header\"></ng-content>\n<ng-content *ngIf=\"!collapsed\" select=\"igx-expansion-panel-body\"></ng-content>\n", directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-expansion-panel', providers: [{ provide: IGX_EXPANSION_PANEL_COMPONENT, useExisting: IgxExpansionPanelComponent }], template: "<ng-content select=\"igx-expansion-panel-header\"></ng-content>\n<ng-content *ngIf=\"!collapsed\" select=\"igx-expansion-panel-body\"></ng-content>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.AnimationBuilder }, { type: i0.ElementRef }]; }, propDecorators: { animationSettings: [{
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-expansion-panel']
            }], panelExpanded: [{
                type: HostBinding,
                args: ['attr.aria-expanded']
            }], collapsed: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], contentCollapsing: [{
                type: Output
            }], contentCollapsed: [{
                type: Output
            }], contentExpanding: [{
                type: Output
            }], contentExpanded: [{
                type: Output
            }], body: [{
                type: ContentChild,
                args: [IgxExpansionPanelBodyComponent, { read: IgxExpansionPanelBodyComponent }]
            }], header: [{
                type: ContentChild,
                args: [IgxExpansionPanelHeaderComponent, { read: IgxExpansionPanelHeaderComponent }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9leHBhbnNpb24tcGFuZWwvZXhwYW5zaW9uLXBhbmVsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9leHBhbnNpb24tcGFuZWwvZXhwYW5zaW9uLXBhbmVsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQXFCLFlBQVksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFDM0UsWUFBWSxFQUFnQyxNQUFNLGVBQWUsQ0FBQztBQUV0RSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RixPQUFPLEVBQUUsNkJBQTZCLEVBQzRCLE1BQU0sMEJBQTBCLENBQUM7QUFDbkcsT0FBTyxFQUFFLHFCQUFxQixFQUEyQixNQUFNLDhCQUE4QixDQUFDOzs7O0FBRTlGLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztBQU9oQixNQUFNLE9BQU8sMEJBQTJCLFNBQVEscUJBQXFCO0lBaUxqRSxZQUFvQixHQUFzQixFQUFZLE9BQXlCLEVBQVUsVUFBdUI7UUFDNUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBREMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBWSxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUFVLGVBQVUsR0FBVixVQUFVLENBQWE7UUF6SWhIOzs7Ozs7Ozs7OztXQVdHO1FBR0ksT0FBRSxHQUFHLHVCQUF1QixPQUFPLEVBQUUsRUFBRSxDQUFDO1FBRS9DOztXQUVHO1FBRUksYUFBUSxHQUFHLHFCQUFxQixDQUFDO1FBVXhDOzs7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QUVNLEtBQUssQ0FBQyxHQUFXO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQzs7dUhBclJRLDBCQUEwQjsyR0FBMUIsMEJBQTBCLHVkQUZ4QixDQUFDLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLFdBQVcsRUFBRSwwQkFBMEIsRUFBRSxDQUFDLDREQTBLbEYsOEJBQThCLDJCQUFVLDhCQUE4QixzREFNdEUsZ0NBQWdDLDJCQUFVLGdDQUFnQyxvREM5TDVGLHVKQUVBOzJGRGNhLDBCQUEwQjtrQkFMdEMsU0FBUzsrQkFDSSxxQkFBcUIsYUFFcEIsQ0FBQyxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxXQUFXLDRCQUE0QixFQUFFLENBQUM7Z0tBbUNyRixpQkFBaUI7c0JBRDNCLEtBQUs7Z0JBc0JDLEVBQUU7c0JBRlIsV0FBVzt1QkFBQyxTQUFTOztzQkFDckIsS0FBSztnQkFPQyxRQUFRO3NCQURkLFdBQVc7dUJBQUMsMkJBQTJCO2dCQU83QixhQUFhO3NCQUR2QixXQUFXO3VCQUFDLG9CQUFvQjtnQkFzQjFCLFNBQVM7c0JBRGYsS0FBSztnQkFPQyxlQUFlO3NCQURyQixNQUFNO2dCQWVDLGlCQUFpQjtzQkFEdkIsTUFBTTtnQkFlRCxnQkFBZ0I7c0JBRHRCLE1BQU07Z0JBZUMsZ0JBQWdCO3NCQUR0QixNQUFNO2dCQWVELGVBQWU7c0JBRHJCLE1BQU07Z0JBcUJBLElBQUk7c0JBRFYsWUFBWTt1QkFBQyw4QkFBOEIsRUFBRSxFQUFFLElBQUksRUFBRSw4QkFBOEIsRUFBRTtnQkFPL0UsTUFBTTtzQkFEWixZQUFZO3VCQUFDLGdDQUFnQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3RvclJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSW5wdXQsIE91dHB1dCxcbiAgICBDb250ZW50Q2hpbGQsIEFmdGVyQ29udGVudEluaXQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsQm9keUNvbXBvbmVudCB9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWJvZHkuY29tcG9uZW50JztcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJR1hfRVhQQU5TSU9OX1BBTkVMX0NPTVBPTkVOVCwgSWd4RXhwYW5zaW9uUGFuZWxCYXNlLFxuICAgIElFeHBhbnNpb25QYW5lbEV2ZW50QXJncywgSUV4cGFuc2lvblBhbmVsQ2FuY2VsYWJsZUV2ZW50QXJncyB9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLmNvbW1vbic7XG5pbXBvcnQgeyBUb2dnbGVBbmltYXRpb25QbGF5ZXIsIFRvZ2dsZUFuaW1hdGlvblNldHRpbmdzIH0gZnJvbSAnLi90b2dnbGUtYW5pbWF0aW9uLWNvbXBvbmVudCc7XG5cbmxldCBORVhUX0lEID0gMDtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtZXhwYW5zaW9uLXBhbmVsJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2V4cGFuc2lvbi1wYW5lbC5jb21wb25lbnQuaHRtbCcsXG4gICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBJR1hfRVhQQU5TSU9OX1BBTkVMX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IElneEV4cGFuc2lvblBhbmVsQ29tcG9uZW50IH1dXG59KVxuZXhwb3J0IGNsYXNzIElneEV4cGFuc2lvblBhbmVsQ29tcG9uZW50IGV4dGVuZHMgVG9nZ2xlQW5pbWF0aW9uUGxheWVyIGltcGxlbWVudHMgSWd4RXhwYW5zaW9uUGFuZWxCYXNlLCBBZnRlckNvbnRlbnRJbml0IHtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgdGhlIGFuaW1hdGlvbiBzZXR0aW5ncyBvZiB0aGUgZXhwYW5zaW9uIHBhbmVsIGNvbXBvbmVudFxuICAgICAqIE9wZW4gYW5kIENsb3NlIGFuaW1hdGlvbiBzaG91bGQgYmUgcGFzc2VkXG4gICAgICpcbiAgICAgKiBHZXRcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGNvbnN0IGN1cnJlbnRBbmltYXRpb25zID0gdGhpcy5wYW5lbC5hbmltYXRpb25TZXR0aW5ncztcbiAgICAgKiBgYGBcbiAgICAgKiBTZXRcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGltcG9ydCB7IHNsaWRlSW5MZWZ0LCBzbGlkZU91dFJpZ2h0IH0gZnJvbSAnaWduaXRldWktYW5ndWxhcic7XG4gICAgICogIC4uLlxuICAgICAqICB0aGlzLnBhbmVsLmFuaW1hdGlvbnNTZXR0aW5ncyA9IHtcbiAgICAgKiAgICAgIG9wZW5BbmltYXRpb246IHNsaWRlSW5MZWZ0LFxuICAgICAqICAgICAgY2xvc2VBbmltYXRpb246IHNsaWRlT3V0UmlnaHRcbiAgICAgKiB9O1xuICAgICAqIGBgYFxuICAgICAqIG9yIHZpYSB0ZW1wbGF0ZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgaW1wb3J0IHsgc2xpZGVJbkxlZnQsIHNsaWRlT3V0UmlnaHQgfSBmcm9tICdpZ25pdGV1aS1hbmd1bGFyJztcbiAgICAgKiAgLi4uXG4gICAgICogIG15Q3VzdG9tQW5pbWF0aW9uT2JqZWN0ID0ge1xuICAgICAqICAgICAgb3BlbkFuaW1hdGlvbjogc2xpZGVJbkxlZnQsXG4gICAgICogICAgICBjbG9zZUFuaW1hdGlvbjogc2xpZGVPdXRSaWdodFxuICAgICAqIH07XG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbCBbYW5pbWF0aW9uU2V0dGluZ3NdPSdteUN1c3RvbUFuaW1hdGlvbk9iamVjdCc+XG4gICAgICogIC4uLlxuICAgICAqICA8L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGFuaW1hdGlvblNldHRpbmdzKCk6IFRvZ2dsZUFuaW1hdGlvblNldHRpbmdzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblNldHRpbmdzO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGFuaW1hdGlvblNldHRpbmdzKHZhbHVlOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncykge1xuICAgICAgICB0aGlzLl9hbmltYXRpb25TZXR0aW5ncyA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMvZ2V0cyB0aGUgYGlkYCBvZiB0aGUgZXhwYW5zaW9uIHBhbmVsIGNvbXBvbmVudC5cbiAgICAgKiBJZiBub3Qgc2V0LCBgaWRgIHdpbGwgaGF2ZSB2YWx1ZSBgXCJpZ3gtZXhwYW5zaW9uLXBhbmVsLTBcImA7XG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZXhwYW5zaW9uLXBhbmVsIGlkID0gXCJteS1maXJzdC1leHBhbnNpb24tcGFuZWxcIj48L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogYGBgXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBwYW5lbElkID0gIHRoaXMucGFuZWwuaWQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4RXhwYW5zaW9uUGFuZWxDb21wb25lbnRcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGlkID0gYGlneC1leHBhbnNpb24tcGFuZWwtJHtORVhUX0lEKyt9YDtcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1leHBhbnNpb24tcGFuZWwnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtZXhwYW5zaW9uLXBhbmVsJztcblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtZXhwYW5kZWQnKVxuICAgIHB1YmxpYyBnZXQgcGFuZWxFeHBhbmRlZCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNvbGxhcHNlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL3NldHMgd2hldGhlciB0aGUgY29tcG9uZW50IGlzIGNvbGxhcHNlZCAoaXRzIGNvbnRlbnQgaXMgaGlkZGVuKVxuICAgICAqIEdldFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgY29uc3QgbXlQYW5lbFN0YXRlOiBib29sZWFuID0gdGhpcy5wYW5lbC5jb2xsYXBzZWQ7XG4gICAgICogYGBgXG4gICAgICogU2V0XG4gICAgICogYGBgaHRtbFxuICAgICAqICB0aGlzLnBhbmVsLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBUd28td2F5IGRhdGEgYmluZGluZzpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1leHBhbnNpb24tcGFuZWwgWyhjb2xsYXBzZWQpXT1cIm1vZGVsLmlzQ29sbGFwc2VkXCI+PC9pZ3gtZXhwYW5zaW9uLXBhbmVsPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbGxhcHNlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgZXhwYW5zaW9uIHBhbmVsIHN0YXJ0cyBjb2xsYXBzaW5nXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICBoYW5kbGVDb2xsYXBzaW5nKGV2ZW50OiBJRXhwYW5zaW9uUGFuZWxDYW5jZWxhYmxlRXZlbnRBcmdzKVxuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1leHBhbnNpb24tcGFuZWwgKGNvbnRlbnRDb2xsYXBzaW5nKT1cImhhbmRsZUNvbGxhcHNpbmcoJGV2ZW50KVwiPlxuICAgICAqICAgICAgLi4uXG4gICAgICogIDwvaWd4LWV4cGFuc2lvbi1wYW5lbD5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICAgQE91dHB1dCgpXG4gICAgIHB1YmxpYyBjb250ZW50Q29sbGFwc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUV4cGFuc2lvblBhbmVsQ2FuY2VsYWJsZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgZXhwYW5zaW9uIHBhbmVsIGZpbmlzaGVzIGNvbGxhcHNpbmdcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGhhbmRsZUNvbGxhcHNlZChldmVudDogSUV4cGFuc2lvblBhbmVsRXZlbnRBcmdzKVxuICAgICAqIGBgYFxuICAgICAqIGBgYGh0bWxcbiAgICAgKiAgPGlneC1leHBhbnNpb24tcGFuZWwgKGNvbnRlbnRDb2xsYXBzZWQpPVwiaGFuZGxlQ29sbGFwc2VkKCRldmVudClcIj5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICA8L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbnRlbnRDb2xsYXBzZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElFeHBhbnNpb25QYW5lbEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgZXhwYW5zaW9uIHBhbmVsIHN0YXJ0cyBleHBhbmRpbmdcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGhhbmRsZUV4cGFuZGluZyhldmVudDogSUV4cGFuc2lvblBhbmVsQ2FuY2VsYWJsZUV2ZW50QXJncylcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtZXhwYW5zaW9uLXBhbmVsIChjb250ZW50RXhwYW5kaW5nKT1cImhhbmRsZUV4cGFuZGluZygkZXZlbnQpXCI+XG4gICAgICogICAgICAuLi5cbiAgICAgKiAgPC9pZ3gtZXhwYW5zaW9uLXBhbmVsPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBAT3V0cHV0KClcbiAgICAgcHVibGljIGNvbnRlbnRFeHBhbmRpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElFeHBhbnNpb25QYW5lbENhbmNlbGFibGVFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gdGhlIGV4cGFuc2lvbiBwYW5lbCBmaW5pc2hlcyBleHBhbmRpbmdcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGhhbmRsZUV4cGFuZGVkKGV2ZW50OiBJRXhwYW5zaW9uUGFuZWxFdmVudEFyZ3MpXG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbCAoY29udGVudEV4cGFuZGVkKT1cImhhbmRsZUV4cGFuZGVkKCRldmVudClcIj5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICA8L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNvbnRlbnRFeHBhbmRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUV4cGFuc2lvblBhbmVsRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaGVhZGVySWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYWRlciA/IGAke3RoaXMuaWR9LWhlYWRlcmAgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkKElneEV4cGFuc2lvblBhbmVsQm9keUNvbXBvbmVudCwgeyByZWFkOiBJZ3hFeHBhbnNpb25QYW5lbEJvZHlDb21wb25lbnQgfSlcbiAgICBwdWJsaWMgYm9keTogSWd4RXhwYW5zaW9uUGFuZWxCb2R5Q29tcG9uZW50O1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBDb250ZW50Q2hpbGQoSWd4RXhwYW5zaW9uUGFuZWxIZWFkZXJDb21wb25lbnQsIHsgcmVhZDogSWd4RXhwYW5zaW9uUGFuZWxIZWFkZXJDb21wb25lbnQgfSlcbiAgICBwdWJsaWMgaGVhZGVyOiBJZ3hFeHBhbnNpb25QYW5lbEhlYWRlckNvbXBvbmVudDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJvdGVjdGVkIGJ1aWxkZXI6IEFuaW1hdGlvbkJ1aWxkZXIsIHByaXZhdGUgZWxlbWVudFJlZj86IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgc3VwZXIoYnVpbGRlcik7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5ib2R5ICYmIHRoaXMuaGVhZGVyKSB7XG4gICAgICAgICAgICAvLyBzY2hlZHVsZSBhdCBlbmQgb2YgdHVybjpcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9keS5sYWJlbGxlZEJ5ID0gdGhpcy5ib2R5LmxhYmVsbGVkQnkgfHwgdGhpcy5oZWFkZXJJZDtcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkubGFiZWwgPSB0aGlzLmJvZHkubGFiZWwgfHwgdGhpcy5pZCArICctcmVnaW9uJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29sbGFwc2VzIHRoZSBwYW5lbFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbCAjbXlQYW5lbD5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICA8L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogIDxidXR0b24gKGNsaWNrKT1cIm15UGFuZWwuY29sbGFwc2UoJGV2ZW50KVwiPkNvbGxwYXNlIFBhbmVsPC9idXR0b24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNvbGxhcHNlKGV2dD86IEV2ZW50KSB7XG4gICAgICAgIC8vIElmIGV4cGFuc2lvbiBwYW5lbCBpcyBhbHJlYWR5IGNvbGxhcHNlZCBvciBpcyBjb2xsYXBzaW5nLCBkbyBub3RoaW5nXG4gICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZCB8fCB0aGlzLmNsb3NlQW5pbWF0aW9uUGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJncyA9IHsgZXZlbnQ6IGV2dCwgcGFuZWw6IHRoaXMsIG93bmVyOiB0aGlzLCBjYW5jZWw6IGZhbHNlIH07XG4gICAgICAgIHRoaXMuY29udGVudENvbGxhcHNpbmcuZW1pdChhcmdzKTtcbiAgICAgICAgaWYgKGFyZ3MuY2FuY2VsID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGF5Q2xvc2VBbmltYXRpb24oXG4gICAgICAgICAgICB0aGlzLmJvZHk/LmVsZW1lbnQsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50Q29sbGFwc2VkLmVtaXQoeyBldmVudDogZXZ0LCBvd25lcjogdGhpcyB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsYXBzZWRDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHBhbmRzIHRoZSBwYW5lbFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbCAjbXlQYW5lbD5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICA8L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogIDxidXR0b24gKGNsaWNrKT1cIm15UGFuZWwuZXhwYW5kKCRldmVudClcIj5FeHBhbmQgUGFuZWw8L2J1dHRvbj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwYW5kKGV2dD86IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5jb2xsYXBzZWQpIHsgLy8gSWYgdGhlIHBhbmVsIGlzIGFscmVhZHkgb3BlbmVkLCBkbyBub3RoaW5nXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJncyA9IHsgZXZlbnQ6IGV2dCwgcGFuZWw6IHRoaXMsIG93bmVyOiB0aGlzLCBjYW5jZWw6IGZhbHNlIH07XG4gICAgICAgIHRoaXMuY29udGVudEV4cGFuZGluZy5lbWl0KGFyZ3MpO1xuICAgICAgICBpZiAoYXJncy5jYW5jZWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbGxhcHNlZENoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLnBsYXlPcGVuQW5pbWF0aW9uKFxuICAgICAgICAgICAgdGhpcy5ib2R5Py5lbGVtZW50LFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEV4cGFuZGVkLmVtaXQoeyBldmVudDogZXZ0LCBvd25lcjogdGhpcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBwYW5lbFxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbCAjbXlQYW5lbD5cbiAgICAgKiAgICAgIC4uLlxuICAgICAqICA8L2lneC1leHBhbnNpb24tcGFuZWw+XG4gICAgICogIDxidXR0b24gKGNsaWNrKT1cIm15UGFuZWwudG9nZ2xlKCRldmVudClcIj5FeHBhbmQgUGFuZWw8L2J1dHRvbj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKGV2dD86IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKGV2dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGV2dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb3BlbihldnQ/OiBFdmVudCkge1xuICAgICAgICB0aGlzLmV4cGFuZChldnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbG9zZShldnQ/OiBFdmVudCkge1xuICAgICAgICB0aGlzLmNvbGxhcHNlKGV2dCk7XG4gICAgfVxufVxuIiwiPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXJcIj48L25nLWNvbnRlbnQ+XG48bmctY29udGVudCAqbmdJZj1cIiFjb2xsYXBzZWRcIiBzZWxlY3Q9XCJpZ3gtZXhwYW5zaW9uLXBhbmVsLWJvZHlcIj48L25nLWNvbnRlbnQ+XG4iXX0=