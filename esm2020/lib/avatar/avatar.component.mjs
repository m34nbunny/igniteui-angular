import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { IgxIconModule } from '../icon/public_api';
import { mkenum } from '../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "../icon/icon.component";
import * as i2 from "@angular/common";
let NEXT_ID = 0;
export const IgxAvatarSize = mkenum({
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
});
export const IgxAvatarType = mkenum({
    INITIALS: 'initials',
    IMAGE: 'image',
    ICON: 'icon',
    CUSTOM: 'custom'
});
/**
 * Avatar provides a way to display an image, icon or initials to the user.
 *
 * @igxModule IgxAvatarModule
 *
 * @igxTheme igx-avatar-theme, igx-icon-theme
 *
 * @igxKeywords avatar, profile, picture, initials
 *
 * @igxGroup Layouts
 *
 * @remarks
 *
 * The Ignite UI Avatar provides an easy way to add an avatar icon to your application.  This icon can be an
 * image, someone's initials or a material icon from the Google Material icon set.
 *
 * @example
 * ```html
 * <igx-avatar initials="MS" [roundShape]="true" size="large">
 * </igx-avatar>
 * ```
 */
export class IgxAvatarComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        /**
         * Returns the `aria-label` attribute of the avatar.
         *
         * @example
         * ```typescript
         * let ariaLabel = this.avatar.ariaLabel;
         * ```
         *
         */
        this.ariaLabel = 'avatar';
        /**
         * Returns the `role` attribute of the avatar.
         *
         * @example
         * ```typescript
         * let avatarRole = this.avatar.role;
         * ```
         */
        this.role = 'img';
        /**
         * Host `class.igx-avatar` binding.
         *
         * @hidden
         * @internal
         */
        this.cssClass = 'igx-avatar';
        /**
         * Sets the `id` of the avatar. If not set, the first avatar component will have `id` = `"igx-avatar-0"`.
         *
         * @example
         * ```html
         * <igx-avatar id="my-first-avatar"></igx-avatar>
         * ```
         */
        this.id = `igx-avatar-${NEXT_ID++}`;
        /**
         * Sets a round shape to the avatar, if `[roundShape]` is set to `true`.
         * By default the shape of the avatar is a square.
         *
         * @example
         * ```html
         * <igx-avatar [roundShape]="true" ></igx-avatar>
         * ```
         */
        this.roundShape = false;
        /**
         * @hidden
         * @internal
         */
        this._size = IgxAvatarSize.SMALL;
    }
    /**
     * Returns the size of the avatar.
     *
     * @example
     * ```typescript
     * let avatarSize = this.avatar.size;
     * ```
     */
    get size() {
        return this._size;
    }
    /**
     * Sets the size  of the avatar.
     * By default, the size is `"small"`. It can be set to `"medium"` or `"large"`.
     *
     * @example
     * ```html
     * <igx-avatar size="large"></igx-avatar>
     * ```
     */
    set size(value) {
        switch (value) {
            case 'small':
            case 'medium':
            case 'large':
                this._size = value;
                break;
            default:
                this._size = 'small';
        }
    }
    /** @hidden @internal */
    get _isSmallSize() {
        return this.size === 'small';
    }
    /** @hidden @internal */
    get _isMediumSize() {
        return this.size === 'medium';
    }
    /** @hidden @internal */
    get _isLargeSize() {
        return this.size === 'large';
    }
    /**
     * Returns the type of the avatar.
     *
     * @example
     * ```typescript
     * let avatarType = this.avatar.type;
     * ```
     */
    get type() {
        if (this.src) {
            return IgxAvatarType.IMAGE;
        }
        if (this.icon) {
            return IgxAvatarType.ICON;
        }
        if (this.initials) {
            return IgxAvatarType.INITIALS;
        }
        return IgxAvatarType.CUSTOM;
    }
    /** @hidden @internal */
    get _isImageType() {
        return this.type === IgxAvatarType.IMAGE;
    }
    /** @hidden @internal */
    get _isIconType() {
        return this.type === IgxAvatarType.ICON;
    }
    /** @hidden @internal */
    get _isInitialsType() {
        return this.type === IgxAvatarType.INITIALS;
    }
    /**
     * Returns the template of the avatar.
     *
     * @hidden
     * @internal
     */
    get template() {
        switch (this.type) {
            case IgxAvatarType.IMAGE:
                return this.imageTemplate;
            case IgxAvatarType.INITIALS:
                return this.initialsTemplate;
            case IgxAvatarType.ICON:
                return this.iconTemplate;
            default:
                return this.defaultTemplate;
        }
    }
    /**
     * Returns the css url of the image.
     *
     * @hidden
     * @internal
     */
    getSrcUrl() {
        return `url(${this.src})`;
    }
    /** @hidden @internal */
    ngOnInit() {
        this.roleDescription = this.getRole();
    }
    /** @hidden @internal */
    getRole() {
        switch (this.type) {
            case IgxAvatarType.IMAGE:
                return 'image avatar';
            case IgxAvatarType.ICON:
                return 'icon avatar';
            case IgxAvatarType.INITIALS:
                return 'initials avatar';
            default:
                return 'custom avatar';
        }
    }
}
IgxAvatarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAvatarComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
IgxAvatarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxAvatarComponent, selector: "igx-avatar", inputs: { id: "id", roundShape: "roundShape", color: "color", bgColor: "bgColor", initials: "initials", icon: "icon", src: "src", size: "size" }, host: { properties: { "attr.aria-label": "this.ariaLabel", "attr.role": "this.role", "class.igx-avatar": "this.cssClass", "attr.aria-roledescription": "this.roleDescription", "attr.id": "this.id", "class.igx-avatar--rounded": "this.roundShape", "style.color": "this.color", "style.background": "this.bgColor", "class.igx-avatar--small": "this._isSmallSize", "class.igx-avatar--medium": "this._isMediumSize", "class.igx-avatar--large": "this._isLargeSize", "class.igx-avatar--image": "this._isImageType", "class.igx-avatar--icon": "this._isIconType", "class.igx-avatar--initials": "this._isInitialsType" } }, viewQueries: [{ propertyName: "defaultTemplate", first: true, predicate: ["defaultTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "imageTemplate", first: true, predicate: ["imageTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "initialsTemplate", first: true, predicate: ["initialsTemplate"], descendants: true, read: TemplateRef, static: true }, { propertyName: "iconTemplate", first: true, predicate: ["iconTemplate"], descendants: true, read: TemplateRef, static: true }], ngImport: i0, template: "<ng-template #defaultTemplate>\n    <ng-content></ng-content>\n</ng-template>\n\n<ng-template #imageTemplate>\n    <div #image class=\"igx-avatar__image\" [style.backgroundImage]=\"getSrcUrl()\"></div>\n</ng-template>\n\n<ng-template #initialsTemplate>\n    <span>{{initials.substring(0, 2)}}</span>\n</ng-template>\n\n<ng-template #iconTemplate>\n     <igx-icon>{{icon}}</igx-icon>\n</ng-template>\n\n<ng-container *ngTemplateOutlet=\"template\"></ng-container>\n", components: [{ type: i1.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }], directives: [{ type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-avatar', template: "<ng-template #defaultTemplate>\n    <ng-content></ng-content>\n</ng-template>\n\n<ng-template #imageTemplate>\n    <div #image class=\"igx-avatar__image\" [style.backgroundImage]=\"getSrcUrl()\"></div>\n</ng-template>\n\n<ng-template #initialsTemplate>\n    <span>{{initials.substring(0, 2)}}</span>\n</ng-template>\n\n<ng-template #iconTemplate>\n     <igx-icon>{{icon}}</igx-icon>\n</ng-template>\n\n<ng-container *ngTemplateOutlet=\"template\"></ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { ariaLabel: [{
                type: HostBinding,
                args: ['attr.aria-label']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-avatar']
            }], roleDescription: [{
                type: HostBinding,
                args: ['attr.aria-roledescription']
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }, {
                type: Input
            }], roundShape: [{
                type: HostBinding,
                args: ['class.igx-avatar--rounded']
            }, {
                type: Input
            }], color: [{
                type: HostBinding,
                args: ['style.color']
            }, {
                type: Input
            }], bgColor: [{
                type: HostBinding,
                args: ['style.background']
            }, {
                type: Input
            }], initials: [{
                type: Input
            }], icon: [{
                type: Input
            }], src: [{
                type: Input
            }], defaultTemplate: [{
                type: ViewChild,
                args: ['defaultTemplate', { read: TemplateRef, static: true }]
            }], imageTemplate: [{
                type: ViewChild,
                args: ['imageTemplate', { read: TemplateRef, static: true }]
            }], initialsTemplate: [{
                type: ViewChild,
                args: ['initialsTemplate', { read: TemplateRef, static: true }]
            }], iconTemplate: [{
                type: ViewChild,
                args: ['iconTemplate', { read: TemplateRef, static: true }]
            }], size: [{
                type: Input
            }], _isSmallSize: [{
                type: HostBinding,
                args: ['class.igx-avatar--small']
            }], _isMediumSize: [{
                type: HostBinding,
                args: ['class.igx-avatar--medium']
            }], _isLargeSize: [{
                type: HostBinding,
                args: ['class.igx-avatar--large']
            }], _isImageType: [{
                type: HostBinding,
                args: ['class.igx-avatar--image']
            }], _isIconType: [{
                type: HostBinding,
                args: ['class.igx-avatar--icon']
            }], _isInitialsType: [{
                type: HostBinding,
                args: ['class.igx-avatar--initials']
            }] } });
/**
 * @hidden
 */
export class IgxAvatarModule {
}
IgxAvatarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAvatarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxAvatarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAvatarModule, declarations: [IgxAvatarComponent], imports: [CommonModule, IgxIconModule], exports: [IgxAvatarComponent] });
IgxAvatarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAvatarModule, imports: [[CommonModule, IgxIconModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxAvatarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxAvatarComponent],
                    exports: [IgxAvatarComponent],
                    imports: [CommonModule, IgxIconModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9hdmF0YXIvYXZhdGFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9hdmF0YXIvYXZhdGFyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0gsU0FBUyxFQUVULFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxFQUVSLFdBQVcsRUFDWCxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFFdkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUM7SUFDaEMsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsUUFBUTtJQUNoQixLQUFLLEVBQUUsT0FBTztDQUNqQixDQUFDLENBQUM7QUFHSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLEtBQUssRUFBRSxPQUFPO0lBQ2QsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsUUFBUTtDQUNuQixDQUFDLENBQUM7QUFJSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBS0gsTUFBTSxPQUFPLGtCQUFrQjtJQTBRM0IsWUFBbUIsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQXpRekM7Ozs7Ozs7O1dBUUc7UUFFSSxjQUFTLEdBQUcsUUFBUSxDQUFD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SSxFQUFFO2dCQUtyRCxnQkFBZ0I7c0JBRHpCLFNBQVM7dUJBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBS3hELFlBQVk7c0JBRHJCLFNBQVM7dUJBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQWlCbkQsSUFBSTtzQkFEZCxLQUFLO2dCQTRCSyxZQUFZO3NCQUR0QixXQUFXO3VCQUFDLHlCQUF5QjtnQkFNM0IsYUFBYTtzQkFEdkIsV0FBVzt1QkFBQywwQkFBMEI7Z0JBTTVCLFlBQVk7c0JBRHRCLFdBQVc7dUJBQUMseUJBQXlCO2dCQStCM0IsWUFBWTtzQkFEdEIsV0FBVzt1QkFBQyx5QkFBeUI7Z0JBTTNCLFdBQVc7c0JBRHJCLFdBQVc7dUJBQUMsd0JBQXdCO2dCQU0xQixlQUFlO3NCQUR6QixXQUFXO3VCQUFDLDRCQUE0Qjs7QUF3RDdDOztHQUVHO0FBTUgsTUFBTSxPQUFPLGVBQWU7OzRHQUFmLGVBQWU7NkdBQWYsZUFBZSxpQkFsVGYsa0JBQWtCLGFBZ1RqQixZQUFZLEVBQUUsYUFBYSxhQWhUNUIsa0JBQWtCOzZHQWtUbEIsZUFBZSxZQUZmLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQzsyRkFFN0IsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQzdCLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7aUJBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgT25Jbml0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneEljb25Nb2R1bGUgfSBmcm9tICcuLi9pY29uL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgbWtlbnVtIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5cbmxldCBORVhUX0lEID0gMDtcbmV4cG9ydCBjb25zdCBJZ3hBdmF0YXJTaXplID0gbWtlbnVtKHtcbiAgICBTTUFMTDogJ3NtYWxsJyxcbiAgICBNRURJVU06ICdtZWRpdW0nLFxuICAgIExBUkdFOiAnbGFyZ2UnXG59KTtcbmV4cG9ydCB0eXBlIElneEF2YXRhclNpemUgPSAodHlwZW9mIElneEF2YXRhclNpemUpW2tleW9mIHR5cGVvZiBJZ3hBdmF0YXJTaXplXTtcblxuZXhwb3J0IGNvbnN0IElneEF2YXRhclR5cGUgPSBta2VudW0oe1xuICAgIElOSVRJQUxTOiAnaW5pdGlhbHMnLFxuICAgIElNQUdFOiAnaW1hZ2UnLFxuICAgIElDT046ICdpY29uJyxcbiAgICBDVVNUT006ICdjdXN0b20nXG59KTtcblxuZXhwb3J0IHR5cGUgSWd4QXZhdGFyVHlwZSA9ICh0eXBlb2YgSWd4QXZhdGFyVHlwZSlba2V5b2YgdHlwZW9mIElneEF2YXRhclR5cGVdO1xuXG4vKipcbiAqIEF2YXRhciBwcm92aWRlcyBhIHdheSB0byBkaXNwbGF5IGFuIGltYWdlLCBpY29uIG9yIGluaXRpYWxzIHRvIHRoZSB1c2VyLlxuICpcbiAqIEBpZ3hNb2R1bGUgSWd4QXZhdGFyTW9kdWxlXG4gKlxuICogQGlneFRoZW1lIGlneC1hdmF0YXItdGhlbWUsIGlneC1pY29uLXRoZW1lXG4gKlxuICogQGlneEtleXdvcmRzIGF2YXRhciwgcHJvZmlsZSwgcGljdHVyZSwgaW5pdGlhbHNcbiAqXG4gKiBAaWd4R3JvdXAgTGF5b3V0c1xuICpcbiAqIEByZW1hcmtzXG4gKlxuICogVGhlIElnbml0ZSBVSSBBdmF0YXIgcHJvdmlkZXMgYW4gZWFzeSB3YXkgdG8gYWRkIGFuIGF2YXRhciBpY29uIHRvIHlvdXIgYXBwbGljYXRpb24uICBUaGlzIGljb24gY2FuIGJlIGFuXG4gKiBpbWFnZSwgc29tZW9uZSdzIGluaXRpYWxzIG9yIGEgbWF0ZXJpYWwgaWNvbiBmcm9tIHRoZSBHb29nbGUgTWF0ZXJpYWwgaWNvbiBzZXQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGh0bWxcbiAqIDxpZ3gtYXZhdGFyIGluaXRpYWxzPVwiTVNcIiBbcm91bmRTaGFwZV09XCJ0cnVlXCIgc2l6ZT1cImxhcmdlXCI+XG4gKiA8L2lneC1hdmF0YXI+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtYXZhdGFyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2F2YXRhci5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSWd4QXZhdGFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBgYXJpYS1sYWJlbGAgYXR0cmlidXRlIG9mIHRoZSBhdmF0YXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgYXJpYUxhYmVsID0gdGhpcy5hdmF0YXIuYXJpYUxhYmVsO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtbGFiZWwnKVxuICAgIHB1YmxpYyBhcmlhTGFiZWwgPSAnYXZhdGFyJztcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGByb2xlYCBhdHRyaWJ1dGUgb2YgdGhlIGF2YXRhci5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGxldCBhdmF0YXJSb2xlID0gdGhpcy5hdmF0YXIucm9sZTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIHJvbGUgPSAnaW1nJztcblxuICAgIC8qKlxuICAgICAqIEhvc3QgYGNsYXNzLmlneC1hdmF0YXJgIGJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtYXZhdGFyJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LWF2YXRhcic7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBhdmF0YXIuXG4gICAgICogVGhlIGF2YXRhciBjYW4gYmU6XG4gICAgICogLSBgXCJpbml0aWFscyB0eXBlIGF2YXRhclwiYFxuICAgICAqIC0gYFwiaWNvbiB0eXBlIGF2YXRhclwiYFxuICAgICAqIC0gYFwiaW1hZ2UgdHlwZSBhdmF0YXJcImAuXG4gICAgICogLSBgXCJjdXN0b20gdHlwZSBhdmF0YXJcImAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgYXZhdGFyRGVzY3JpcHRpb24gPSB0aGlzLmF2YXRhci5yb2xlRGVzY3JpcHRpb247XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtcm9sZWRlc2NyaXB0aW9uJylcbiAgICBwdWJsaWMgcm9sZURlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgaWRgIG9mIHRoZSBhdmF0YXIuIElmIG5vdCBzZXQsIHRoZSBmaXJzdCBhdmF0YXIgY29tcG9uZW50IHdpbGwgaGF2ZSBgaWRgID0gYFwiaWd4LWF2YXRhci0wXCJgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1hdmF0YXIgaWQ9XCJteS1maXJzdC1hdmF0YXJcIj48L2lneC1hdmF0YXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJylcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZCA9IGBpZ3gtYXZhdGFyLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgcm91bmQgc2hhcGUgdG8gdGhlIGF2YXRhciwgaWYgYFtyb3VuZFNoYXBlXWAgaXMgc2V0IHRvIGB0cnVlYC5cbiAgICAgKiBCeSBkZWZhdWx0IHRoZSBzaGFwZSBvZiB0aGUgYXZhdGFyIGlzIGEgc3F1YXJlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1hdmF0YXIgW3JvdW5kU2hhcGVdPVwidHJ1ZVwiID48L2lneC1hdmF0YXI+XG4gICAgICogYGBgXG4gICAgICovXG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1hdmF0YXItLXJvdW5kZWQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJvdW5kU2hhcGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbG9yIG9mIHRoZSBhdmF0YXIncyBpbml0aWFscyBvciBpY29uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1hdmF0YXIgY29sb3I9XCJibHVlXCI+PC9pZ3gtYXZhdGFyPlxuICAgICAqIGBgYFxuICAgICAqL1xuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5jb2xvcicpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY29sb3I6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIGF2YXRhci5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYXZhdGFyIGJnQ29sb3I9XCJ5ZWxsb3dcIj48L2lneC1hdmF0YXI+XG4gICAgICogYGBgXG4gICAgICogQGlneEZyaWVuZGx5TmFtZSBCYWNrZ3JvdW5kIGNvbG9yXG4gICAgICovXG5cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJhY2tncm91bmQnKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGJnQ29sb3I6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNldHMgaW5pdGlhbHMgdG8gdGhlIGF2YXRhci5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYXZhdGFyIGluaXRpYWxzPVwiTU5cIj48L2lneC1hdmF0YXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5pdGlhbHM6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNldHMgYW4gaWNvbiB0byB0aGUgYXZhdGFyLiBBbGwgaWNvbnMgZnJvbSB0aGUgbWF0ZXJpYWwgaWNvbiBzZXQgYXJlIHN1cHBvcnRlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYXZhdGFyIGljb249XCJwaG9uZVwiPjwvaWd4LWF2YXRhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpY29uOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBpbWFnZSBzb3VyY2Ugb2YgdGhlIGF2YXRhci5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYXZhdGFyIHNyYz1cImltYWdlcy9waWN0dXJlLmpwZ1wiPjwvaWd4LWF2YXRhcj5cbiAgICAgKiBgYGBcbiAgICAgKiBAaWd4RnJpZW5kbHlOYW1lIEltYWdlIFVSTFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNyYzogc3RyaW5nO1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdFRlbXBsYXRlJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gICAgcHJvdGVjdGVkIGRlZmF1bHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ2ltYWdlVGVtcGxhdGUnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgaW1hZ2VUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ2luaXRpYWxzVGVtcGxhdGUnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbHNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ2ljb25UZW1wbGF0ZScsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByb3RlY3RlZCBpY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBfc2l6ZTogc3RyaW5nIHwgSWd4QXZhdGFyU2l6ZSA9IElneEF2YXRhclNpemUuU01BTEw7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2l6ZSBvZiB0aGUgYXZhdGFyLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IGF2YXRhclNpemUgPSB0aGlzLmF2YXRhci5zaXplO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzaXplKCk6IHN0cmluZyB8IElneEF2YXRhclNpemUge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBzaXplICBvZiB0aGUgYXZhdGFyLlxuICAgICAqIEJ5IGRlZmF1bHQsIHRoZSBzaXplIGlzIGBcInNtYWxsXCJgLiBJdCBjYW4gYmUgc2V0IHRvIGBcIm1lZGl1bVwiYCBvciBgXCJsYXJnZVwiYC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtYXZhdGFyIHNpemU9XCJsYXJnZVwiPjwvaWd4LWF2YXRhcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IHNpemUodmFsdWU6IHN0cmluZyB8IElneEF2YXRhclNpemUpIHtcbiAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnc21hbGwnOlxuICAgICAgICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuX3NpemUgPSAnc21hbGwnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtYXZhdGFyLS1zbWFsbCcpXG4gICAgcHVibGljIGdldCBfaXNTbWFsbFNpemUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemUgPT09ICdzbWFsbCc7XG4gICAgfVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWF2YXRhci0tbWVkaXVtJylcbiAgICBwdWJsaWMgZ2V0IF9pc01lZGl1bVNpemUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemUgPT09ICdtZWRpdW0nO1xuICAgIH1cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1hdmF0YXItLWxhcmdlJylcbiAgICBwdWJsaWMgZ2V0IF9pc0xhcmdlU2l6ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZSA9PT0gJ2xhcmdlJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBhdmF0YXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgYXZhdGFyVHlwZSA9IHRoaXMuYXZhdGFyLnR5cGU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCB0eXBlKCk6IElneEF2YXRhclR5cGUge1xuICAgICAgICBpZiAodGhpcy5zcmMpIHtcbiAgICAgICAgICAgIHJldHVybiBJZ3hBdmF0YXJUeXBlLklNQUdFO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaWNvbikge1xuICAgICAgICAgICAgcmV0dXJuIElneEF2YXRhclR5cGUuSUNPTjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gSWd4QXZhdGFyVHlwZS5JTklUSUFMUztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBJZ3hBdmF0YXJUeXBlLkNVU1RPTTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1hdmF0YXItLWltYWdlJylcbiAgICBwdWJsaWMgZ2V0IF9pc0ltYWdlVHlwZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gSWd4QXZhdGFyVHlwZS5JTUFHRTtcbiAgICB9XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtYXZhdGFyLS1pY29uJylcbiAgICBwdWJsaWMgZ2V0IF9pc0ljb25UeXBlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBJZ3hBdmF0YXJUeXBlLklDT047XG4gICAgfVxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWF2YXRhci0taW5pdGlhbHMnKVxuICAgIHB1YmxpYyBnZXQgX2lzSW5pdGlhbHNUeXBlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBJZ3hBdmF0YXJUeXBlLklOSVRJQUxTO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHRlbXBsYXRlIG9mIHRoZSBhdmF0YXIuXG4gICAgICpcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSWd4QXZhdGFyVHlwZS5JTUFHRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZVRlbXBsYXRlO1xuICAgICAgICAgICAgY2FzZSBJZ3hBdmF0YXJUeXBlLklOSVRJQUxTOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxzVGVtcGxhdGU7XG4gICAgICAgICAgICBjYXNlIElneEF2YXRhclR5cGUuSUNPTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pY29uVGVtcGxhdGU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNzcyB1cmwgb2YgdGhlIGltYWdlLlxuICAgICAqXG4gICAgICogQGhpZGRlblxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTcmNVcmwoKSB7XG4gICAgICAgIHJldHVybiBgdXJsKCR7dGhpcy5zcmN9KWA7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnJvbGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0Um9sZSgpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHByaXZhdGUgZ2V0Um9sZSgpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBJZ3hBdmF0YXJUeXBlLklNQUdFOlxuICAgICAgICAgICAgICAgIHJldHVybiAnaW1hZ2UgYXZhdGFyJztcbiAgICAgICAgICAgIGNhc2UgSWd4QXZhdGFyVHlwZS5JQ09OOlxuICAgICAgICAgICAgICAgIHJldHVybiAnaWNvbiBhdmF0YXInO1xuICAgICAgICAgICAgY2FzZSBJZ3hBdmF0YXJUeXBlLklOSVRJQUxTOlxuICAgICAgICAgICAgICAgIHJldHVybiAnaW5pdGlhbHMgYXZhdGFyJztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdjdXN0b20gYXZhdGFyJztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4QXZhdGFyQ29tcG9uZW50XSxcbiAgICBleHBvcnRzOiBbSWd4QXZhdGFyQ29tcG9uZW50XSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBJZ3hJY29uTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hBdmF0YXJNb2R1bGUgeyB9XG4iLCI8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2ltYWdlVGVtcGxhdGU+XG4gICAgPGRpdiAjaW1hZ2UgY2xhc3M9XCJpZ3gtYXZhdGFyX19pbWFnZVwiIFtzdHlsZS5iYWNrZ3JvdW5kSW1hZ2VdPVwiZ2V0U3JjVXJsKClcIj48L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjaW5pdGlhbHNUZW1wbGF0ZT5cbiAgICA8c3Bhbj57e2luaXRpYWxzLnN1YnN0cmluZygwLCAyKX19PC9zcGFuPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNpY29uVGVtcGxhdGU+XG4gICAgIDxpZ3gtaWNvbj57e2ljb259fTwvaWd4LWljb24+XG48L25nLXRlbXBsYXRlPlxuXG48bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiJdfQ==