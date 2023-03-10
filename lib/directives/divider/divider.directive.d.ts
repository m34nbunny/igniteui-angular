import * as i0 from "@angular/core";
export declare const IgxDividerType: {
    SOLID: "solid";
    DASHED: "dashed";
};
export declare type IgxDividerType = (typeof IgxDividerType)[keyof typeof IgxDividerType];
export declare class IgxDividerDirective {
    /**
     * Sets/gets the `id` of the divider.
     * If not set, `id` will have value `"igx-divider-0"`;
     * ```html
     * <igx-divider id="my-divider"></igx-divider>
     * ```
     * ```typescript
     * let dividerId =  this.divider.id;
     * ```
     */
    id: string;
    /**
     * An @Input property that sets the value of `role` attribute.
     * If not the default value of `separator` will be used.
     */
    role: string;
    /**
     * Sets the type of the divider. The default value
     * is `default`. The divider can also be `dashed`;
     * ```html
     * <igx-divider type="dashed"></igx-divider>
     * ```
     */
    type: IgxDividerType | string;
    get isDashed(): boolean;
    /**
     * An @Input that sets the `middle` attribute of the divider.
     * If set to `true` and an `inset` value has been provided,
     * the divider will start shrinking from both ends.
     * ```html
     * <igx-divider [middle]="true"></igx-divider>
     * ```
     */
    middle: boolean;
    /**
     * An @Input that sets the vertical attribute of the divider.
     * ```html
     * <igx-divider [vertical]="true"></igx-divider>
     * ```
     */
    vertical: boolean;
    /**
     * Sets the inset of the divider from the side(s).
     * If the divider attribute `middle` is set to `true`,
     * it will inset the divider on both sides.
     * ```typescript
     * this.divider.inset = '32px';
     * ```
     */
    set inset(value: string);
    /**
     * Gets the current divider inset in terms of
     * margin representation as applied to the divider.
     * ```typescript
     * const inset = this.divider.inset;
     * ```
     */
    get inset(): string;
    /**
     * An @Input property that sets the value of the `inset` attribute.
     * If not provided it will be set to `'0'`.
     * ```html
     * <igx-divider inset="16px"></igx-divider>
     * ```
     */
    private _inset;
    /**
     * A getter that returns `true` if the type of the divider is `default`;
     * ```typescript
     * const isDefault = this.divider.isDefault;
     * ```
     */
    get isSolid(): boolean;
    static ??fac: i0.????FactoryDeclaration<IgxDividerDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxDividerDirective, "igx-divider", never, { "id": "id"; "role": "role"; "type": "type"; "middle": "middle"; "vertical": "vertical"; "_inset": "inset"; }, {}, never>;
}
export declare class IgxDividerModule {
    static ??fac: i0.????FactoryDeclaration<IgxDividerModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxDividerModule, [typeof IgxDividerDirective], never, [typeof IgxDividerDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxDividerModule>;
}
