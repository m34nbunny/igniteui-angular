import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Represents individual resizable/collapsible panes.
 *
 * @igxModule IgxSplitterModule
 *
 * @igxParent IgxSplitterComponent
 *
 * @igxKeywords pane
 *
 * @igxGroup presentation
 *
 * @remarks
 *  Users can control the resize behavior via the min and max size properties.
 */
export class IgxSplitterPaneComponent {
    constructor(el) {
        this.el = el;
        /**
         * @hidden @internal
         * Gets/Sets the 'display' property of the current pane.
         */
        this.display = 'flex';
        /**
         * Gets/Sets whether pane is resizable.
         *
         * @example
         * ```html
         * <igx-splitter>
         *  <igx-splitter-pane [resizable]='false'>...</igx-splitter-pane>
         * </igx-splitter>
         * ```
         * @remarks
         * If pane is not resizable its related splitter bar cannot be dragged.
         */
        this.resizable = true;
        /**
         * Event fired when collapsed state of pane is changed.
         *
         * @example
         * ```html
         * <igx-splitter>
         *  <igx-splitter-pane (collapsedChange)='paneCollapsedChange($event)'>...</igx-splitter-pane>
         * </igx-splitter>
         * ```
         */
        this.collapsedChange = new EventEmitter();
        /**
         * @hidden @internal
         * Gets/Sets the `overflow`.
         */
        this.overflow = 'auto';
        /**
         * @hidden @internal
         * Gets/Sets the `minHeight` and `minWidth` properties of the current pane.
         */
        this.minHeight = 0;
        /**
         * @hidden @internal
         * Gets/Sets the `maxHeight` and `maxWidth` properties of the current `IgxSplitterPaneComponent`.
         */
        this.maxHeight = '100%';
        this._size = 'auto';
        this._collapsed = false;
    }
    /**
     * Gets/Sets the size of the current pane.
     *  * @example
     * ```html
     * <igx-splitter>
     *  <igx-splitter-pane [size]='size'>...</igx-splitter-pane>
     * </igx-splitter>
     * ```
     */
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
        this.el.nativeElement.style.flex = this.flex;
    }
    /** @hidden @internal */
    get isPercentageSize() {
        return this.size === 'auto' || this.size.indexOf('%') !== -1;
    }
    /** @hidden @internal */
    get dragSize() {
        return this._dragSize;
    }
    set dragSize(val) {
        this._dragSize = val;
        this.el.nativeElement.style.flex = this.flex;
    }
    /**
     *
     * @hidden @internal
     * Gets the host native element.
     */
    get element() {
        return this.el.nativeElement;
    }
    /**
     * @hidden @internal
     * Gets the `flex` property of the current `IgxSplitterPaneComponent`.
     */
    get flex() {
        const isAuto = this.size === 'auto' && !this.dragSize;
        const grow = !isAuto ? 0 : 1;
        const size = this.dragSize || this.size;
        return `${grow} ${grow} ${size}`;
    }
    /**
     * Gets/Sets whether current pane is collapsed.
     *
     * @example
     * ```typescript
     * const isCollapsed = pane.collapsed;
     * ```
     */
    set collapsed(value) {
        if (this.owner) {
            // reset sibling sizes when pane collapse state changes.
            this._getSiblings().forEach(sibling => {
                sibling.size = 'auto';
                sibling.dragSize = null;
            });
        }
        this._collapsed = value;
        this.display = this._collapsed ? 'none' : 'flex';
        this.collapsedChange.emit(this._collapsed);
    }
    get collapsed() {
        return this._collapsed;
    }
    /**
     * Toggles the collapsed state of the pane.
     *
     * @example
     * ```typescript
     * pane.toggle();
     * ```
     */
    toggle() {
        this.collapsed = !this.collapsed;
    }
    /** @hidden @internal */
    _getSiblings() {
        const panes = this.owner.panes.toArray();
        const index = panes.indexOf(this);
        const siblings = [];
        if (index !== 0) {
            siblings.push(panes[index - 1]);
        }
        if (index !== panes.length - 1) {
            siblings.push(panes[index + 1]);
        }
        return siblings;
    }
}
IgxSplitterPaneComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterPaneComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxSplitterPaneComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxSplitterPaneComponent, selector: "igx-splitter-pane", inputs: { minSize: "minSize", maxSize: "maxSize", resizable: "resizable", size: "size", collapsed: "collapsed" }, outputs: { collapsedChange: "collapsedChange" }, host: { properties: { "style.display": "this.display", "style.order": "this.order", "style.overflow": "this.overflow", "style.min-height": "this.minHeight", "style.min-width": "this.minHeight", "style.max-height": "this.maxHeight", "style.max-width": "this.maxHeight", "style.flex": "this.flex" } }, ngImport: i0, template: "<ng-content></ng-content>" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSplitterPaneComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-splitter-pane', template: "<ng-content></ng-content>" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { display: [{
                type: HostBinding,
                args: ['style.display']
            }], minSize: [{
                type: Input
            }], maxSize: [{
                type: Input
            }], resizable: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], order: [{
                type: HostBinding,
                args: ['style.order']
            }], overflow: [{
                type: HostBinding,
                args: ['style.overflow']
            }], minHeight: [{
                type: HostBinding,
                args: ['style.min-height']
            }, {
                type: HostBinding,
                args: ['style.min-width']
            }], maxHeight: [{
                type: HostBinding,
                args: ['style.max-height']
            }, {
                type: HostBinding,
                args: ['style.max-width']
            }], size: [{
                type: Input
            }], flex: [{
                type: HostBinding,
                args: ['style.flex']
            }], collapsed: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXItcGFuZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvc3BsaXR0ZXIvc3BsaXR0ZXItcGFuZS9zcGxpdHRlci1wYW5lLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zcGxpdHRlci9zcGxpdHRlci1wYW5lL3NwbGl0dGVyLXBhbmUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFjLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRWhHOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFLSCxNQUFNLE9BQU8sd0JBQXdCO0lBaUxqQyxZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQWhMbEM7OztXQUdHO1FBRUksWUFBTyxHQUFHLE1BQU0sQ0FBQztRQTRCeEI7Ozs7Ozs7Ozs7O1dBV0c7UUFFSSxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXhCOzs7Ozs7Ozs7V0FTRztRQUVJLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQU1yRDs7O1dBR0c7UUFFSSxhQUFRLEdBQUcsTUFBTSxDQUFDO1FBRXpCOzs7V0FHRztRQUdJLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFFckI7OztXQUdHO1FBR0ksY0FBUyxHQUFHLE1BQU0sQ0FBQztRQXFGbEIsVUFBSyxHQUFHLE1BQU0sQ0FBQztRQUVmLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFHVyxDQUFDO0lBckZ2Qzs7Ozs7Ozs7T0FRRztJQUNILElBQ1csSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBVyxJQUFJLENBQUMsS0FBSztRQUNq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QUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQztRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7O3FIQTNNUSx3QkFBd0I7eUdBQXhCLHdCQUF3Qix3Z0JDcEJyQywyQkFBeUI7MkZEb0JaLHdCQUF3QjtrQkFKcEMsU0FBUzsrQkFDSSxtQkFBbUI7aUdBU3RCLE9BQU87c0JBRGIsV0FBVzt1QkFBQyxlQUFlO2dCQWNyQixPQUFPO3NCQURiLEtBQUs7Z0JBY0MsT0FBTztzQkFEYixLQUFLO2dCQWdCQyxTQUFTO3NCQURmLEtBQUs7Z0JBY0MsZUFBZTtzQkFEckIsTUFBTTtnQkFLQSxLQUFLO3NCQURYLFdBQVc7dUJBQUMsYUFBYTtnQkFRbkIsUUFBUTtzQkFEZCxXQUFXO3VCQUFDLGdCQUFnQjtnQkFTdEIsU0FBUztzQkFGZixXQUFXO3VCQUFDLGtCQUFrQjs7c0JBQzlCLFdBQVc7dUJBQUMsaUJBQWlCO2dCQVN2QixTQUFTO3NCQUZmLFdBQVc7dUJBQUMsa0JBQWtCOztzQkFDOUIsV0FBVzt1QkFBQyxpQkFBaUI7Z0JBZ0JuQixJQUFJO3NCQURkLEtBQUs7Z0JBc0NLLElBQUk7c0JBRGQsV0FBVzt1QkFBQyxZQUFZO2dCQWlCZCxTQUFTO3NCQURuQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0QmluZGluZywgSW5wdXQsIEVsZW1lbnRSZWYsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBpbmRpdmlkdWFsIHJlc2l6YWJsZS9jb2xsYXBzaWJsZSBwYW5lcy5cbiAqXG4gKiBAaWd4TW9kdWxlIElneFNwbGl0dGVyTW9kdWxlXG4gKlxuICogQGlneFBhcmVudCBJZ3hTcGxpdHRlckNvbXBvbmVudFxuICpcbiAqIEBpZ3hLZXl3b3JkcyBwYW5lXG4gKlxuICogQGlneEdyb3VwIHByZXNlbnRhdGlvblxuICpcbiAqIEByZW1hcmtzXG4gKiAgVXNlcnMgY2FuIGNvbnRyb2wgdGhlIHJlc2l6ZSBiZWhhdmlvciB2aWEgdGhlIG1pbiBhbmQgbWF4IHNpemUgcHJvcGVydGllcy5cbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtc3BsaXR0ZXItcGFuZScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NwbGl0dGVyLXBhbmUuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIElneFNwbGl0dGVyUGFuZUNvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBHZXRzL1NldHMgdGhlICdkaXNwbGF5JyBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBwYW5lLlxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuZGlzcGxheScpXG4gICAgcHVibGljIGRpc3BsYXkgPSAnZmxleCc7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIG1pbmltdW0gYWxsb3dlZCBzaXplIG9mIHRoZSBjdXJyZW50IHBhbmUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXNwbGl0dGVyPlxuICAgICAqICA8aWd4LXNwbGl0dGVyLXBhbmUgW21pblNpemVdPSdtaW5TaXplJz4uLi48L2lneC1zcGxpdHRlci1wYW5lPlxuICAgICAqIDwvaWd4LXNwbGl0dGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1pblNpemUhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldCB0aGUgbWF4aW11bSBhbGxvd2VkIHNpemUgb2YgdGhlIGN1cnJlbnQgcGFuZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc3BsaXR0ZXI+XG4gICAgICogIDxpZ3gtc3BsaXR0ZXItcGFuZSBbbWF4U2l6ZV09J21heFNpemUnPi4uLjwvaWd4LXNwbGl0dGVyLXBhbmU+XG4gICAgICogPC9pZ3gtc3BsaXR0ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWF4U2l6ZSE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB3aGV0aGVyIHBhbmUgaXMgcmVzaXphYmxlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1zcGxpdHRlcj5cbiAgICAgKiAgPGlneC1zcGxpdHRlci1wYW5lIFtyZXNpemFibGVdPSdmYWxzZSc+Li4uPC9pZ3gtc3BsaXR0ZXItcGFuZT5cbiAgICAgKiA8L2lneC1zcGxpdHRlcj5cbiAgICAgKiBgYGBcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIElmIHBhbmUgaXMgbm90IHJlc2l6YWJsZSBpdHMgcmVsYXRlZCBzcGxpdHRlciBiYXIgY2Fubm90IGJlIGRyYWdnZWQuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcmVzaXphYmxlID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGZpcmVkIHdoZW4gY29sbGFwc2VkIHN0YXRlIG9mIHBhbmUgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc3BsaXR0ZXI+XG4gICAgICogIDxpZ3gtc3BsaXR0ZXItcGFuZSAoY29sbGFwc2VkQ2hhbmdlKT0ncGFuZUNvbGxhcHNlZENoYW5nZSgkZXZlbnQpJz4uLi48L2lneC1zcGxpdHRlci1wYW5lPlxuICAgICAqIDwvaWd4LXNwbGl0dGVyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBjb2xsYXBzZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLm9yZGVyJylcbiAgICBwdWJsaWMgb3JkZXIhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIEdldHMvU2V0cyB0aGUgYG92ZXJmbG93YC5cbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLm92ZXJmbG93JylcbiAgICBwdWJsaWMgb3ZlcmZsb3cgPSAnYXV0byc7XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIEdldHMvU2V0cyB0aGUgYG1pbkhlaWdodGAgYW5kIGBtaW5XaWR0aGAgcHJvcGVydGllcyBvZiB0aGUgY3VycmVudCBwYW5lLlxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUubWluLWhlaWdodCcpXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5taW4td2lkdGgnKVxuICAgIHB1YmxpYyBtaW5IZWlnaHQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBHZXRzL1NldHMgdGhlIGBtYXhIZWlnaHRgIGFuZCBgbWF4V2lkdGhgIHByb3BlcnRpZXMgb2YgdGhlIGN1cnJlbnQgYElneFNwbGl0dGVyUGFuZUNvbXBvbmVudGAuXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXgtaGVpZ2h0JylcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1heC13aWR0aCcpXG4gICAgcHVibGljIG1heEhlaWdodCA9ICcxMDAlJztcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBvd25lcjtcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCBwYW5lLlxuICAgICAqICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtc3BsaXR0ZXI+XG4gICAgICogIDxpZ3gtc3BsaXR0ZXItcGFuZSBbc2l6ZV09J3NpemUnPi4uLjwvaWd4LXNwbGl0dGVyLXBhbmU+XG4gICAgICogPC9pZ3gtc3BsaXR0ZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2l6ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9zaXplID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5mbGV4ID0gdGhpcy5mbGV4O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgaXNQZXJjZW50YWdlU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gJ2F1dG8nIHx8IHRoaXMuc2l6ZS5pbmRleE9mKCclJykgIT09IC0xO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgZHJhZ1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kcmFnU2l6ZTtcbiAgICB9XG4gICAgcHVibGljIHNldCBkcmFnU2l6ZSh2YWwpIHtcbiAgICAgICAgdGhpcy5fZHJhZ1NpemUgPSB2YWw7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5mbGV4ID0gdGhpcy5mbGV4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBHZXRzIHRoZSBob3N0IG5hdGl2ZSBlbGVtZW50LlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZWxlbWVudCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogR2V0cyB0aGUgYGZsZXhgIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IGBJZ3hTcGxpdHRlclBhbmVDb21wb25lbnRgLlxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuZmxleCcpXG4gICAgcHVibGljIGdldCBmbGV4KCkge1xuICAgICAgICBjb25zdCBpc0F1dG8gPSB0aGlzLnNpemUgPT09ICdhdXRvJyAmJiAhdGhpcy5kcmFnU2l6ZTtcbiAgICAgICAgY29uc3QgZ3JvdyA9ICFpc0F1dG8gPyAwIDogMTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuZHJhZ1NpemUgfHwgdGhpcy5zaXplO1xuICAgICAgICByZXR1cm4gYCR7Z3Jvd30gJHtncm93fSAke3NpemV9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgd2hldGhlciBjdXJyZW50IHBhbmUgaXMgY29sbGFwc2VkLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgaXNDb2xsYXBzZWQgPSBwYW5lLmNvbGxhcHNlZDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgY29sbGFwc2VkKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLm93bmVyKSB7XG4gICAgICAgICAgICAvLyByZXNldCBzaWJsaW5nIHNpemVzIHdoZW4gcGFuZSBjb2xsYXBzZSBzdGF0ZSBjaGFuZ2VzLlxuICAgICAgICAgICAgdGhpcy5fZ2V0U2libGluZ3MoKS5mb3JFYWNoKHNpYmxpbmcgPT4ge1xuICAgICAgICAgICAgICAgIHNpYmxpbmcuc2l6ZSA9ICdhdXRvJ1xuICAgICAgICAgICAgICAgIHNpYmxpbmcuZHJhZ1NpemUgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29sbGFwc2VkID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuX2NvbGxhcHNlZCA/ICdub25lJyA6ICdmbGV4JyA7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkQ2hhbmdlLmVtaXQodGhpcy5fY29sbGFwc2VkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNvbGxhcHNlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxhcHNlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zaXplID0gJ2F1dG8nO1xuICAgIHByaXZhdGUgX2RyYWdTaXplO1xuICAgIHByaXZhdGUgX2NvbGxhcHNlZCA9IGZhbHNlO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7IH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZXMgdGhlIGNvbGxhcHNlZCBzdGF0ZSBvZiB0aGUgcGFuZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHBhbmUudG9nZ2xlKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpIHtcbiAgICAgICAgdGhpcy5jb2xsYXBzZWQgPSAhdGhpcy5jb2xsYXBzZWQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHJpdmF0ZSBfZ2V0U2libGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IHBhbmVzID0gdGhpcy5vd25lci5wYW5lcy50b0FycmF5KCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcGFuZXMuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgY29uc3Qgc2libGluZ3MgPSBbXTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICBzaWJsaW5ncy5wdXNoKHBhbmVzW2luZGV4IC0gMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCAhPT0gcGFuZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgc2libGluZ3MucHVzaChwYW5lc1tpbmRleCArIDFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2libGluZ3M7XG4gICAgfVxufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiJdfQ==