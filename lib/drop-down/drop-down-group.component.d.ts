import * as i0 from "@angular/core";
/**
 * The `<igx-drop-down-item>` is a container intended for row items in
 * a `<igx-drop-down>` container.
 */
export declare class IgxDropDownGroupComponent {
    /**
     * @hidden @internal
     */
    get labelId(): string;
    get labelledBy(): string;
    /**
     * @hidden @internal
     */
    role: string;
    /** @hidden @internal */
    groupClass: boolean;
    /**
     * Sets/gets if the item group is disabled
     *
     * ```typescript
     * const myDropDownGroup: IgxDropDownGroupComponent = this.dropdownGroup;
     * // get
     * ...
     * const groupState: boolean = myDropDownGroup.disabled;
     * ...
     * //set
     * ...
     * myDropDownGroup,disabled = false;
     * ...
     * ```
     *
     * ```html
     * <igx-drop-down-item-group [label]="'My Items'" [disabled]="true">
     *     <igx-drop-down-item *ngFor="let item of items[index]" [value]="item.value">
     *         {{ item.text }}
     *     </igx-drop-down-item>
     * </igx-drop-down-item-group>
     * ```
     *
     * **NOTE:** All items inside of a disabled drop down group will be treated as disabled
     */
    disabled: boolean;
    /**
     * Sets/gets the label of the item group
     *
     * ```typescript
     * const myDropDownGroup: IgxDropDownGroupComponent = this.dropdownGroup;
     * // get
     * ...
     * const myLabel: string = myDropDownGroup.label;
     * ...
     * // set
     * ...
     * myDropDownGroup.label = 'My New Label';
     * ...
     * ```
     *
     * ```html
     * <igx-drop-down-item-group [label]="'My new Label'">
     *      ...
     * </igx-drop-down-item-group>
     * ```
     */
    label: string;
    private _id;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxDropDownGroupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxDropDownGroupComponent, "igx-drop-down-item-group", never, { "disabled": "disabled"; "label": "label"; }, {}, never, ["igx-drop-down-item"]>;
}
