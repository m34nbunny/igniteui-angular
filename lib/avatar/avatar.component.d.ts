import { ElementRef, OnInit, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../icon/public_api";
export declare const IgxAvatarSize: {
    SMALL: "small";
    MEDIUM: "medium";
    LARGE: "large";
};
export declare type IgxAvatarSize = (typeof IgxAvatarSize)[keyof typeof IgxAvatarSize];
export declare const IgxAvatarType: {
    INITIALS: "initials";
    IMAGE: "image";
    ICON: "icon";
    CUSTOM: "custom";
};
export declare type IgxAvatarType = (typeof IgxAvatarType)[keyof typeof IgxAvatarType];
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
export declare class IgxAvatarComponent implements OnInit {
    elementRef: ElementRef;
    /**
     * Returns the `aria-label` attribute of the avatar.
     *
     * @example
     * ```typescript
     * let ariaLabel = this.avatar.ariaLabel;
     * ```
     *
     */
    ariaLabel: string;
    /**
     * Returns the `role` attribute of the avatar.
     *
     * @example
     * ```typescript
     * let avatarRole = this.avatar.role;
     * ```
     */
    role: string;
    /**
     * Host `class.igx-avatar` binding.
     *
     * @hidden
     * @internal
     */
    cssClass: string;
    /**
     * Returns the type of the avatar.
     * The avatar can be:
     * - `"initials type avatar"`
     * - `"icon type avatar"`
     * - `"image type avatar"`.
     * - `"custom type avatar"`.
     *
     * @example
     * ```typescript
     * let avatarDescription = this.avatar.roleDescription;
     * ```
     */
    roleDescription: string;
    /**
     * Sets the `id` of the avatar. If not set, the first avatar component will have `id` = `"igx-avatar-0"`.
     *
     * @example
     * ```html
     * <igx-avatar id="my-first-avatar"></igx-avatar>
     * ```
     */
    id: string;
    /**
     * Sets a round shape to the avatar, if `[roundShape]` is set to `true`.
     * By default the shape of the avatar is a square.
     *
     * @example
     * ```html
     * <igx-avatar [roundShape]="true" ></igx-avatar>
     * ```
     */
    roundShape: boolean;
    /**
     * Sets the color of the avatar's initials or icon.
     *
     * @example
     * ```html
     * <igx-avatar color="blue"></igx-avatar>
     * ```
     */
    color: string;
    /**
     * Sets the background color of the avatar.
     *
     * @example
     * ```html
     * <igx-avatar bgColor="yellow"></igx-avatar>
     * ```
     * @igxFriendlyName Background color
     */
    bgColor: string;
    /**
     * Sets initials to the avatar.
     *
     * @example
     * ```html
     * <igx-avatar initials="MN"></igx-avatar>
     * ```
     */
    initials: string;
    /**
     * Sets an icon to the avatar. All icons from the material icon set are supported.
     *
     * @example
     * ```html
     * <igx-avatar icon="phone"></igx-avatar>
     * ```
     */
    icon: string;
    /**
     * Sets the image source of the avatar.
     *
     * @example
     * ```html
     * <igx-avatar src="images/picture.jpg"></igx-avatar>
     * ```
     * @igxFriendlyName Image URL
     */
    src: string;
    /** @hidden @internal */
    protected defaultTemplate: TemplateRef<any>;
    /** @hidden @internal */
    protected imageTemplate: TemplateRef<any>;
    /** @hidden @internal */
    protected initialsTemplate: TemplateRef<any>;
    /** @hidden @internal */
    protected iconTemplate: TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    private _size;
    /**
     * Returns the size of the avatar.
     *
     * @example
     * ```typescript
     * let avatarSize = this.avatar.size;
     * ```
     */
    get size(): string | IgxAvatarSize;
    /**
     * Sets the size  of the avatar.
     * By default, the size is `"small"`. It can be set to `"medium"` or `"large"`.
     *
     * @example
     * ```html
     * <igx-avatar size="large"></igx-avatar>
     * ```
     */
    set size(value: string | IgxAvatarSize);
    /** @hidden @internal */
    get _isSmallSize(): boolean;
    /** @hidden @internal */
    get _isMediumSize(): boolean;
    /** @hidden @internal */
    get _isLargeSize(): boolean;
    /**
     * Returns the type of the avatar.
     *
     * @example
     * ```typescript
     * let avatarType = this.avatar.type;
     * ```
     */
    get type(): IgxAvatarType;
    /** @hidden @internal */
    get _isImageType(): boolean;
    /** @hidden @internal */
    get _isIconType(): boolean;
    /** @hidden @internal */
    get _isInitialsType(): boolean;
    /**
     * Returns the template of the avatar.
     *
     * @hidden
     * @internal
     */
    get template(): TemplateRef<any>;
    constructor(elementRef: ElementRef);
    /**
     * Returns the css url of the image.
     *
     * @hidden
     * @internal
     */
    getSrcUrl(): string;
    /** @hidden @internal */
    ngOnInit(): void;
    /** @hidden @internal */
    private getRole;
    static ??fac: i0.????FactoryDeclaration<IgxAvatarComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxAvatarComponent, "igx-avatar", never, { "id": "id"; "roundShape": "roundShape"; "color": "color"; "bgColor": "bgColor"; "initials": "initials"; "icon": "icon"; "src": "src"; "size": "size"; }, {}, never, ["*"]>;
}
/**
 * @hidden
 */
export declare class IgxAvatarModule {
    static ??fac: i0.????FactoryDeclaration<IgxAvatarModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxAvatarModule, [typeof IgxAvatarComponent], [typeof i1.CommonModule, typeof i2.IgxIconModule], [typeof IgxAvatarComponent]>;
    static ??inj: i0.????InjectorDeclaration<IgxAvatarModule>;
}
