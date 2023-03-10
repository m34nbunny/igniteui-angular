import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../icon/public_api";
/**
 * Determines the igxBadge type
 */
export declare const IgxBadgeType: {
    PRIMARY: "primary";
    INFO: "info";
    SUCCESS: "success";
    WARNING: "warning";
    ERROR: "error";
};
export declare type IgxBadgeType = (typeof IgxBadgeType)[keyof typeof IgxBadgeType];
/**
 * Badge provides visual notifications used to decorate avatars, menus, etc.
 *
 * @igxModule IgxBadgeModule
 *
 * @igxTheme igx-badge-theme
 *
 * @igxKeywords badge, icon, notification
 *
 * @igxGroup Data Entry & Display
 *
 * @remarks
 * The Ignite UI Badge is used to decorate avatars, navigation menus, or other components in the
 * application when visual notification is needed. They are usually designed as icons with a predefined
 * style to communicate information, success, warnings, or errors.
 *
 * @example
 * ```html
 * <igx-avatar>
 *   <igx-badge icon="check" type="success"></igx-badge>
 * </igx-avatar>
 */
export declare class IgxBadgeComponent {
    /**
     * Sets/gets the `id` of the badge.
     *
     * @remarks
     * If not set, the `id` will have value `"igx-badge-0"`.
     *
     * @example
     * ```html
     * <igx-badge id="igx-badge-2"></igx-badge>
     * ```
     */
    id: string;
    /**
     * Sets/gets the type of the badge.
     *
     * @remarks
     * Allowed values are `primary`, `info`, `success`, `warning`, `error`.
     * Providing an invalid value won't display a badge.
     *
     * @example
     * ```html
     * <igx-badge type="success"></igx-badge>
     * ```
     */
    type: string | IgxBadgeType;
    /**
     * Sets/gets the value to be displayed inside the badge.
     *
     * @remarks
     * If an `icon` property is already set the `icon` will be displayed.
     * If neither a `value` nor an `icon` is set the content of the badge will be empty.
     *
     * @example
     * ```html
     * <igx-badge value="11"></igx-badge>
     * ```
     */
    value: string | number;
    /**
     * Sets/gets an icon for the badge from the material icons set.
     *
     * @remarks
     * Has priority over the `value` property.
     * If neither a `value` nor an `icon` is set the content of the badge will be empty.
     * Providing an invalid value won't display anything.
     *
     * @example
     * ```html
     * <igx-badge icon="check"></igx-badge>
     * ```
     */
    icon: string;
    /**
     * Sets/gets the role attribute value.
     *
     * @example
     * ```typescript
     * @ViewChild("MyBadge", { read: IgxBadgeComponent })
     * public badge: IgxBadgeComponent;
     *
     * badge.role = 'status';
     * ```
     */
    role: string;
    /**
     * Sets/gets the the css class to use on the badge.
     *
     * @example
     * ```typescript
     * @ViewChild("MyBadge", { read: IgxBadgeComponent })
     * public badge: IgxBadgeComponent;
     *
     * badge.cssClass = 'my-badge-class';
     * ```
     */
    cssClass: string;
    /**
     * Sets/gets the aria-label attribute value.
     *
     * @example
     * ```typescript
     * @ViewChild("MyBadge", { read: IgxBadgeComponent })
     * public badge: IgxBadgeComponent;
     *
     * badge.label = 'badge';
     * ```
     */
    label: string;
    /**
     * Defines a human-readable, accessor, author-localized description for
     * the `type` and the `icon` or `value` of the element.
     *
     * @hidden
     * @internal
     */
    get roleDescription(): string;
    get infoClass(): boolean;
    get successClass(): boolean;
    get warningClass(): boolean;
    get errorClass(): boolean;
    static ??fac: i0.????FactoryDeclaration<IgxBadgeComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxBadgeComponent, "igx-badge", never, { "id": "id"; "type": "type"; "value": "value"; "icon": "icon"; }, {}, never, never>;
}
/**
 * @hidden
 */
export declare class IgxBadgeModule {
    static ??fac: i0.????FactoryDeclaration<IgxBadgeModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxBadgeModule, [typeof IgxBadgeComponent], [typeof i1.CommonModule, typeof i2.IgxIconModule], [typeof IgxBadgeComponent]>;
    static ??inj: i0.????InjectorDeclaration<IgxBadgeModule>;
}
