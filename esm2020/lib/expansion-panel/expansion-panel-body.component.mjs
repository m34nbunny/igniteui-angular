import { Component, HostBinding, Input, Inject } from '@angular/core';
import { IGX_EXPANSION_PANEL_COMPONENT } from './expansion-panel.common';
import * as i0 from "@angular/core";
export class IgxExpansionPanelBodyComponent {
    constructor(panel, element, cdr) {
        this.panel = panel;
        this.element = element;
        this.cdr = cdr;
        /**
         * @hidden
         */
        this.cssClass = `igx-expansion-panel__body`;
        /**
         * Gets/sets the `role` attribute of the panel body
         * Default is 'region';
         * Get
         * ```typescript
         *  const currentRole = this.panel.body.role;
         * ```
         * Set
         * ```typescript
         *  this.panel.body.role = 'content';
         * ```
         * ```html
         *  <igx-expansion-panel-body [role]="'custom'"></igx-expansion-panel-body>
         * ```
         */
        this.role = 'region';
        this._labelledBy = '';
        this._label = '';
    }
    /**
     * Gets the `aria-label` attribute of the panel body
     * Defaults to the panel id with '-region' in the end;
     * Get
     * ```typescript
     *  const currentLabel = this.panel.body.label;
     * ```
     */
    get label() {
        return this._label || this.panel.id + '-region';
    }
    /**
     * Sets the `aria-label` attribute of the panel body
     * ```typescript
     *  this.panel.body.label = 'my-custom-label';
     * ```
     * ```html
     *  <igx-expansion-panel-body [label]="'my-custom-label'"></igx-expansion-panel-body>
     * ```
     */
    set label(val) {
        this._label = val;
    }
    /**
     * Gets the `aria-labelledby` attribute of the panel body
     * Defaults to the panel header id;
     * Get
     * ```typescript
     *  const currentLabel = this.panel.body.labelledBy;
     * ```
     */
    get labelledBy() {
        return this._labelledBy;
    }
    /**
     * Sets the `aria-labelledby` attribute of the panel body
     * ```typescript
     *  this.panel.body.labelledBy = 'my-custom-id';
     * ```
     * ```html
     *  <igx-expansion-panel-body [labelledBy]="'my-custom-id'"></igx-expansion-panel-body>
     * ```
     */
    set labelledBy(val) {
        this._labelledBy = val;
    }
}
IgxExpansionPanelBodyComponent.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelBodyComponent, deps: [{ token: IGX_EXPANSION_PANEL_COMPONENT }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.????FactoryTarget.Component });
IgxExpansionPanelBodyComponent.??cmp = i0.????ngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxExpansionPanelBodyComponent, selector: "igx-expansion-panel-body", inputs: { role: "role", label: "label", labelledBy: "labelledBy" }, host: { properties: { "class.igx-expansion-panel__body": "this.cssClass", "attr.role": "this.role", "attr.aria-label": "this.label", "attr.aria-labelledby": "this.labelledBy" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxExpansionPanelBodyComponent, decorators: [{
            type: Component,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'igx-expansion-panel-body',
                    template: `<ng-content></ng-content>`
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_EXPANSION_PANEL_COMPONENT]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-expansion-panel__body']
            }], role: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.role']
            }], label: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-label']
            }], labelledBy: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.aria-labelledby']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWJvZHkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2V4cGFuc2lvbi1wYW5lbC9leHBhbnNpb24tcGFuZWwtYm9keS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQWMsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUF5Qiw2QkFBNkIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQU9oRyxNQUFNLE9BQU8sOEJBQThCO0lBNEJ2QyxZQUNrRCxLQUE0QixFQUNuRSxPQUFtQixFQUFTLEdBQXNCO1FBRFgsVUFBSyxHQUFMLEtBQUssQ0FBdUI7UUFDbkUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBN0I3RDs7V0FFRztRQUVJLGFBQVEsR0FBRywyQkFBMkIsQ0FBQztRQUU5Qzs7Ozs7Ozs7Ozs7Ozs7V0FjRztRQUdJLFNBQUksR0FBRyxRQUFRLENBQUM7UUFFZixnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixXQUFNLEdBQUcsRUFBRSxDQUFDO0lBSXBCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsSUFFVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztJQUNwRCxDQUFDO0lBQ0Q7Ozs7Ozs7O09BUUc7SUFDSCxJQUFXLEtBQUssQ0FBQyxHQUFXO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsSUFFVyxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBQ0Q7Ozs7Ozs7O09BUUc7SUFDSCxJQUFXLFVBQVUsQ0FBQyxHQUFXO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0lBQzNCLENBQUM7OzJIQW5GUSw4QkFBOEIsa0JBNkIzQiw2QkFBNkI7K0dBN0JoQyw4QkFBOEIsd1RBRjdCLDJCQUEyQjsyRkFFNUIsOEJBQThCO2tCQUwxQyxTQUFTO21CQUFDO29CQUNQLDhEQUE4RDtvQkFDOUQsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsUUFBUSxFQUFFLDJCQUEyQjtpQkFDeEM7OzBCQThCUSxNQUFNOzJCQUFDLDZCQUE2QjtxR0F4QmxDLFFBQVE7c0JBRGQsV0FBVzt1QkFBQyxpQ0FBaUM7Z0JBb0J2QyxJQUFJO3NCQUZWLEtBQUs7O3NCQUNMLFdBQVc7dUJBQUMsV0FBVztnQkFvQmIsS0FBSztzQkFGZixLQUFLOztzQkFDTCxXQUFXO3VCQUFDLGlCQUFpQjtnQkEyQm5CLFVBQVU7c0JBRnBCLEtBQUs7O3NCQUNMLFdBQVc7dUJBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0QmluZGluZywgRWxlbWVudFJlZiwgSW5wdXQsIENoYW5nZURldGVjdG9yUmVmLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsQmFzZSwgSUdYX0VYUEFOU0lPTl9QQU5FTF9DT01QT05FTlQgfSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC5jb21tb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxuICAgIHNlbGVjdG9yOiAnaWd4LWV4cGFuc2lvbi1wYW5lbC1ib2R5JyxcbiAgICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gXG59KVxuZXhwb3J0IGNsYXNzIElneEV4cGFuc2lvblBhbmVsQm9keUNvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWV4cGFuc2lvbi1wYW5lbF9fYm9keScpXG4gICAgcHVibGljIGNzc0NsYXNzID0gYGlneC1leHBhbnNpb24tcGFuZWxfX2JvZHlgO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9zZXRzIHRoZSBgcm9sZWAgYXR0cmlidXRlIG9mIHRoZSBwYW5lbCBib2R5XG4gICAgICogRGVmYXVsdCBpcyAncmVnaW9uJztcbiAgICAgKiBHZXRcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGNvbnN0IGN1cnJlbnRSb2xlID0gdGhpcy5wYW5lbC5ib2R5LnJvbGU7XG4gICAgICogYGBgXG4gICAgICogU2V0XG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICB0aGlzLnBhbmVsLmJvZHkucm9sZSA9ICdjb250ZW50JztcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogIDxpZ3gtZXhwYW5zaW9uLXBhbmVsLWJvZHkgW3JvbGVdPVwiJ2N1c3RvbSdcIj48L2lneC1leHBhbnNpb24tcGFuZWwtYm9keT5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcbiAgICBwdWJsaWMgcm9sZSA9ICdyZWdpb24nO1xuXG4gICAgcHJpdmF0ZSBfbGFiZWxsZWRCeSA9ICcnO1xuICAgIHByaXZhdGUgX2xhYmVsID0gJyc7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoSUdYX0VYUEFOU0lPTl9QQU5FTF9DT01QT05FTlQpIHB1YmxpYyBwYW5lbDogSWd4RXhwYW5zaW9uUGFuZWxCYXNlLFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZiwgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBgYXJpYS1sYWJlbGAgYXR0cmlidXRlIG9mIHRoZSBwYW5lbCBib2R5XG4gICAgICogRGVmYXVsdHMgdG8gdGhlIHBhbmVsIGlkIHdpdGggJy1yZWdpb24nIGluIHRoZSBlbmQ7XG4gICAgICogR2V0XG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqICBjb25zdCBjdXJyZW50TGFiZWwgPSB0aGlzLnBhbmVsLmJvZHkubGFiZWw7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sYWJlbCcpXG4gICAgcHVibGljIGdldCBsYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWwgfHwgdGhpcy5wYW5lbC5pZCArICctcmVnaW9uJztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgYGFyaWEtbGFiZWxgIGF0dHJpYnV0ZSBvZiB0aGUgcGFuZWwgYm9keVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgdGhpcy5wYW5lbC5ib2R5LmxhYmVsID0gJ215LWN1c3RvbS1sYWJlbCc7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbC1ib2R5IFtsYWJlbF09XCInbXktY3VzdG9tLWxhYmVsJ1wiPjwvaWd4LWV4cGFuc2lvbi1wYW5lbC1ib2R5PlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgbGFiZWwodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbGFiZWwgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlIG9mIHRoZSBwYW5lbCBib2R5XG4gICAgICogRGVmYXVsdHMgdG8gdGhlIHBhbmVsIGhlYWRlciBpZDtcbiAgICAgKiBHZXRcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIGNvbnN0IGN1cnJlbnRMYWJlbCA9IHRoaXMucGFuZWwuYm9keS5sYWJlbGxlZEJ5O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtbGFiZWxsZWRieScpXG4gICAgcHVibGljIGdldCBsYWJlbGxlZEJ5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYWJlbGxlZEJ5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIHBhbmVsIGJvZHlcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogIHRoaXMucGFuZWwuYm9keS5sYWJlbGxlZEJ5ID0gJ215LWN1c3RvbS1pZCc7XG4gICAgICogYGBgXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LWV4cGFuc2lvbi1wYW5lbC1ib2R5IFtsYWJlbGxlZEJ5XT1cIidteS1jdXN0b20taWQnXCI+PC9pZ3gtZXhwYW5zaW9uLXBhbmVsLWJvZHk+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIHNldCBsYWJlbGxlZEJ5KHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xhYmVsbGVkQnkgPSB2YWw7XG4gICAgfVxufVxuIl19