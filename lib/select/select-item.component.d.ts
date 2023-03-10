import { IgxDropDownItemComponent } from './../drop-down/drop-down-item.component';
import * as i0 from "@angular/core";
export declare class IgxSelectItemComponent extends IgxDropDownItemComponent {
    /** @hidden @internal */
    isHeader: boolean;
    private _text;
    /**
     * An @Input property that gets/sets the item's text to be displayed in the select component's input when the item is selected.
     *
     * ```typescript
     *  //get
     *  let mySelectedItem = this.dropDown.selectedItem;
     *  let selectedItemText = mySelectedItem.text;
     * ```
     *
     * ```html
     * // set
     * <igx-select-item [text]="'London'"></igx-select-item>
     * ```
     */
    get text(): string;
    set text(text: string);
    /** @hidden @internal */
    get itemText(): any;
    /**
     * Sets/Gets if the item is the currently selected one in the select
     *
     * ```typescript
     *  let mySelectedItem = this.select.selectedItem;
     *  let isMyItemSelected = mySelectedItem.selected; // true
     * ```
     */
    get selected(): any;
    set selected(value: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSelectItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxSelectItemComponent, "igx-select-item", never, { "text": "text"; }, {}, never, ["*"]>;
}
