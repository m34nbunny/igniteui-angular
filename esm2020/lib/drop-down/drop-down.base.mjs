import { Input, HostBinding, Output, EventEmitter, Optional, Inject, Directive } from '@angular/core';
import { Navigate } from './drop-down.common';
import { DropDownActionKey } from './drop-down.common';
import { DisplayDensityBase, DisplayDensityToken } from '../core/density';
import * as i0 from "@angular/core";
let NEXT_ID = 0;
/**
 * An abstract class, defining a drop-down component, with:
 * Properties for display styles and classes
 * A collection items of type `IgxDropDownItemBaseDirective`
 * Properties and methods for navigating (highlighting/focusing) items from the collection
 * Properties and methods for selecting items from the collection
 */
export class IgxDropDownBaseDirective extends DisplayDensityBase {
    constructor(elementRef, cdr, _displayDensityOptions) {
        super(_displayDensityOptions);
        this.elementRef = elementRef;
        this.cdr = cdr;
        this._displayDensityOptions = _displayDensityOptions;
        /**
         * Emitted when item selection is changing, before the selection completes
         *
         * ```html
         * <igx-drop-down (selectionChanging)='handleSelection()'></igx-drop-down>
         * ```
         */
        this.selectionChanging = new EventEmitter();
        /**
         * Gets/Sets the drop down's container max height.
         *
         * ```typescript
         * // get
         * let maxHeight = this.dropdown.maxHeight;
         * ```
         * ```html
         * <!--set-->
         * <igx-drop-down [maxHeight]='200px'></igx-drop-down>
         * ```
         */
        this.maxHeight = null;
        /**
         * @hidden @internal
         */
        this.cssClass = true;
        this._focusedItem = null;
        this._id = `igx-drop-down-${NEXT_ID++}`;
    }
    /**
     * Gets/Sets the drop down's id
     *
     * ```typescript
     * // get
     * let myDropDownCurrentId = this.dropdown.id;
     * ```
     * ```html
     * <!--set-->
     * <igx-drop-down [id]='newDropDownId'></igx-drop-down>
     * ```
     */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    /**
     * Get all non-header items
     *
     * ```typescript
     * let myDropDownItems = this.dropdown.items;
     * ```
     */
    get items() {
        const items = [];
        if (this.children !== undefined) {
            for (const child of this.children.toArray()) {
                if (!child.isHeader) {
                    items.push(child);
                }
            }
        }
        return items;
    }
    /**
     * Get all header items
     *
     * ```typescript
     * let myDropDownHeaderItems = this.dropdown.headers;
     * ```
     */
    get headers() {
        const headers = [];
        if (this.children !== undefined) {
            for (const child of this.children.toArray()) {
                if (child.isHeader) {
                    headers.push(child);
                }
            }
        }
        return headers;
    }
    /**
     * Get dropdown html element
     *
     * ```typescript
     * let myDropDownElement = this.dropdown.element;
     * ```
     */
    get element() {
        return this.elementRef.nativeElement;
    }
    /**
     * @hidden @internal
     * Get dropdown's html element of its scroll container
     */
    get scrollContainer() {
        return this.element;
    }
    /** Keydown Handler */
    onItemActionKey(key, event) {
        switch (key) {
            case DropDownActionKey.ENTER:
            case DropDownActionKey.SPACE:
                this.selectItem(this.focusedItem, event);
                break;
            case DropDownActionKey.ESCAPE:
        }
    }
    /**
     * Emits selectionChanging with the target item & event
     *
     * @hidden @internal
     * @param newSelection the item selected
     * @param event the event that triggered the call
     */
    selectItem(newSelection, event) {
        this.selectionChanging.emit({
            newSelection,
            oldSelection: null,
            cancel: false
        });
    }
    /**
     * @hidden @internal
     */
    get focusedItem() {
        return this._focusedItem;
    }
    /**
     * @hidden @internal
     */
    set focusedItem(item) {
        this._focusedItem = item;
    }
    /**
     * Navigates to the item on the specified index
     *
     * @param newIndex number - the index of the item in the `items` collection
     */
    navigateItem(newIndex) {
        if (newIndex !== -1) {
            const oldItem = this._focusedItem;
            const newItem = this.items[newIndex];
            if (oldItem) {
                oldItem.focused = false;
            }
            this.focusedItem = newItem;
            this.scrollToHiddenItem(newItem);
            this.focusedItem.focused = true;
        }
    }
    /**
     * @hidden @internal
     */
    navigateFirst() {
        this.navigate(Navigate.Down, -1);
    }
    /**
     * @hidden @internal
     */
    navigateLast() {
        this.navigate(Navigate.Up, this.items.length);
    }
    /**
     * @hidden @internal
     */
    navigateNext() {
        this.navigate(Navigate.Down);
    }
    /**
     * @hidden @internal
     */
    navigatePrev() {
        this.navigate(Navigate.Up);
    }
    scrollToHiddenItem(newItem) {
        const elementRect = newItem.element.nativeElement.getBoundingClientRect();
        const parentRect = this.scrollContainer.getBoundingClientRect();
        if (parentRect.top > elementRect.top) {
            this.scrollContainer.scrollTop -= (parentRect.top - elementRect.top);
        }
        if (parentRect.bottom < elementRect.bottom) {
            this.scrollContainer.scrollTop += (elementRect.bottom - parentRect.bottom);
        }
    }
    navigate(direction, currentIndex) {
        let index = -1;
        if (this._focusedItem) {
            index = currentIndex ? currentIndex : this.focusedItem.itemIndex;
        }
        const newIndex = this.getNearestSiblingFocusableItemIndex(index, direction);
        this.navigateItem(newIndex);
    }
    getNearestSiblingFocusableItemIndex(startIndex, direction) {
        let index = startIndex;
        const items = this.items;
        while (items[index + direction] && items[index + direction].disabled) {
            index += direction;
        }
        index += direction;
        if (index >= 0 && index < items.length) {
            return index;
        }
        else {
            return -1;
        }
    }
}
IgxDropDownBaseDirective.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownBaseDirective, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: DisplayDensityToken, optional: true }], target: i0.????FactoryTarget.Directive });
IgxDropDownBaseDirective.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDropDownBaseDirective, inputs: { width: "width", height: "height", id: "id", maxHeight: "maxHeight" }, outputs: { selectionChanging: "selectionChanging" }, host: { properties: { "style.maxHeight": "this.maxHeight", "class.igx-drop-down": "this.cssClass" } }, usesInheritance: true, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownBaseDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }]; }, propDecorators: { selectionChanging: [{
                type: Output
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], id: [{
                type: Input
            }], maxHeight: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['style.maxHeight']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-drop-down']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1kb3duLmJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZHJvcC1kb3duL2Ryb3AtZG93bi5iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxLQUFLLEVBQUUsV0FBVyxFQUF5QixNQUFNLEVBQUUsWUFBWSxFQUFxQixRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFDbEgsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUV2RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQTBCLE1BQU0saUJBQWlCLENBQUM7O0FBRWxHLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztBQUVoQjs7Ozs7O0dBTUc7QUFFSCxNQUFNLE9BQWdCLHdCQUF5QixTQUFRLGtCQUFrQjtJQTZKckUsWUFDYyxVQUFzQixFQUN0QixHQUFzQixFQUNtQixzQkFBOEM7UUFDN0YsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFIeEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNtQiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBL0pyRzs7Ozs7O1dBTUc7UUFFSSxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQW9EbkU7Ozs7Ozs7Ozs7O1dBV0c7UUFHSSxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRXhCOztXQUVHO1FBRUksYUFBUSxHQUFHLElBQUksQ0FBQztRQW9FYixpQkFBWSxHQUFRLElBQUksQ0FBQztRQUN6QixRQUFHLEdBQUcsaUJBQWlCLE9BQU8sRUFBRSxFQUFFLENBQUM7SUFZekMsQ0FBQztJQXpITDs7Ozs7Ozs7Ozs7T0FXRztJQUNILElBQ1csRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBVyxFQUFFLENBQUMsS0FBYTtRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBd0JEOzs7Ozs7T0FNRztJQUNILElBQVcsS0FBSztRQUNaLE1BQU0sS0FBSyxHQUFtQyxFQUFFLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUM3QixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO29CQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNyQjthQUNKO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsSUFBVyxPQUFPO1FBQ2QsTUFBTSxPQUFPLEdBQW1DLEVBQUUsQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzdCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO29CQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN2QjthQUNKO1NBQ0o7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztJQUN6QyxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0gsSUFBVyxlQUFlO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBeUJELHNCQUFzQjtJQUNmLGVBQWUsQ0FBQyxHQUFzQixFQUFFLEtBQWE7UUFDeEQsUUFBUSxHQUFHLEVBQUU7WUFDVCxLQUFLLGlCQUFpQixDQUFDLEtBQUssQ0FBQztZQUM3QixLQUFLLGlCQUFpQixDQUFDLEtBQUs7Z0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekMsTUFBTTtZQUNWLEtBQUssaUJBQWlCLENBQUMsTUFBTSxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLFVBQVUsQ0FBQyxZQUEyQyxFQUFFLEtBQWE7UUFDeEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUN4QixZQUFZO1lBQ1osWUFBWSxFQUFFLElBQUk7WUFDbEIsTUFBTSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxXQUFXO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM3QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFdBQVcsQ0FBQyxJQUFrQztRQUNyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxRQUFnQjtRQUNoQyxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNqQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7YUFDM0I7WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ25DO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksYUFBYTtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxZQUFZO1FBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksWUFBWTtRQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNJLFlBQVk7UUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRVMsa0JBQWtCLENBQUMsT0FBcUM7UUFDOUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMxRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDaEUsSUFBSSxVQUFVLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN4RTtRQUVELElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUU7SUFDTCxDQUFDO0lBRVMsUUFBUSxDQUFDLFNBQW1CLEVBQUUsWUFBcUI7UUFDekQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUNwRTtRQUNELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRVMsbUNBQW1DLENBQUMsVUFBa0IsRUFBRSxTQUFtQjtRQUNqRixJQUFJLEtBQUssR0FBRyxVQUFVLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixPQUFPLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDbEUsS0FBSyxJQUFJLFNBQVMsQ0FBQztTQUN0QjtRQUVELEtBQUssSUFBSSxTQUFTLENBQUM7UUFDbkIsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3BDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO2FBQU07WUFDSCxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2I7SUFDTCxDQUFDOztxSEE1UmlCLHdCQUF3Qiw2RUFnS2xCLG1CQUFtQjt5R0FoS3pCLHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQUQ3QyxTQUFTOzswQkFpS0QsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxtQkFBbUI7NENBdkpwQyxpQkFBaUI7c0JBRHZCLE1BQU07Z0JBZ0JBLEtBQUs7c0JBRFgsS0FBSztnQkFnQkMsTUFBTTtzQkFEWixLQUFLO2dCQWdCSyxFQUFFO3NCQURaLEtBQUs7Z0JBc0JDLFNBQVM7c0JBRmYsS0FBSzs7c0JBQ0wsV0FBVzt1QkFBQyxpQkFBaUI7Z0JBT3ZCLFFBQVE7c0JBRGQsV0FBVzt1QkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIElucHV0LCBIb3N0QmluZGluZywgRWxlbWVudFJlZiwgUXVlcnlMaXN0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9wdGlvbmFsLCBJbmplY3QsIERpcmVjdGl2ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTmF2aWdhdGUsIElTZWxlY3Rpb25FdmVudEFyZ3MgfSBmcm9tICcuL2Ryb3AtZG93bi5jb21tb24nO1xuaW1wb3J0IHsgSURyb3BEb3duTGlzdCB9IGZyb20gJy4vZHJvcC1kb3duLmNvbW1vbic7XG5pbXBvcnQgeyBEcm9wRG93bkFjdGlvbktleSB9IGZyb20gJy4vZHJvcC1kb3duLmNvbW1vbic7XG5pbXBvcnQgeyBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi9kcm9wLWRvd24taXRlbS5iYXNlJztcbmltcG9ydCB7IERpc3BsYXlEZW5zaXR5QmFzZSwgRGlzcGxheURlbnNpdHlUb2tlbiwgSURpc3BsYXlEZW5zaXR5T3B0aW9ucyB9IGZyb20gJy4uL2NvcmUvZGVuc2l0eSc7XG5cbmxldCBORVhUX0lEID0gMDtcblxuLyoqXG4gKiBBbiBhYnN0cmFjdCBjbGFzcywgZGVmaW5pbmcgYSBkcm9wLWRvd24gY29tcG9uZW50LCB3aXRoOlxuICogUHJvcGVydGllcyBmb3IgZGlzcGxheSBzdHlsZXMgYW5kIGNsYXNzZXNcbiAqIEEgY29sbGVjdGlvbiBpdGVtcyBvZiB0eXBlIGBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlYFxuICogUHJvcGVydGllcyBhbmQgbWV0aG9kcyBmb3IgbmF2aWdhdGluZyAoaGlnaGxpZ2h0aW5nL2ZvY3VzaW5nKSBpdGVtcyBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gKiBQcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGZvciBzZWxlY3RpbmcgaXRlbXMgZnJvbSB0aGUgY29sbGVjdGlvblxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJZ3hEcm9wRG93bkJhc2VEaXJlY3RpdmUgZXh0ZW5kcyBEaXNwbGF5RGVuc2l0eUJhc2UgaW1wbGVtZW50cyBJRHJvcERvd25MaXN0IHtcbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gaXRlbSBzZWxlY3Rpb24gaXMgY2hhbmdpbmcsIGJlZm9yZSB0aGUgc2VsZWN0aW9uIGNvbXBsZXRlc1xuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZHJvcC1kb3duIChzZWxlY3Rpb25DaGFuZ2luZyk9J2hhbmRsZVNlbGVjdGlvbigpJz48L2lneC1kcm9wLWRvd24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGlvbkNoYW5naW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJU2VsZWN0aW9uRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogIEdldHMvU2V0cyB0aGUgd2lkdGggb2YgdGhlIGRyb3AgZG93blxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteURyb3BEb3duQ3VycmVudFdpZHRoID0gdGhpcy5kcm9wZG93bi53aWR0aDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtZHJvcC1kb3duIFt3aWR0aF09JzE2MHB4Jz48L2lneC1kcm9wLWRvd24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgd2lkdGg6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSBkcm9wIGRvd25cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXRcbiAgICAgKiBsZXQgbXlEcm9wRG93bkN1cnJlbnRIZWlnaHQgPSB0aGlzLmRyb3Bkb3duLmhlaWdodDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtZHJvcC1kb3duIFtoZWlnaHRdPSc0MDBweCc+PC9pZ3gtZHJvcC1kb3duPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGhlaWdodDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBkcm9wIGRvd24ncyBpZFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBteURyb3BEb3duQ3VycmVudElkID0gdGhpcy5kcm9wZG93bi5pZDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtZHJvcC1kb3duIFtpZF09J25ld0Ryb3BEb3duSWQnPjwvaWd4LWRyb3AtZG93bj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdGhlIGRyb3AgZG93bidzIGNvbnRhaW5lciBtYXggaGVpZ2h0LlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIC8vIGdldFxuICAgICAqIGxldCBtYXhIZWlnaHQgPSB0aGlzLmRyb3Bkb3duLm1heEhlaWdodDtcbiAgICAgKiBgYGBcbiAgICAgKiBgYGBodG1sXG4gICAgICogPCEtLXNldC0tPlxuICAgICAqIDxpZ3gtZHJvcC1kb3duIFttYXhIZWlnaHRdPScyMDBweCc+PC9pZ3gtZHJvcC1kb3duPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXhIZWlnaHQnKVxuICAgIHB1YmxpYyBtYXhIZWlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlneC1kcm9wLWRvd24nKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIG5vbi1oZWFkZXIgaXRlbXNcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgbXlEcm9wRG93bkl0ZW1zID0gdGhpcy5kcm9wZG93bi5pdGVtcztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGl0ZW1zKCk6IElneERyb3BEb3duSXRlbUJhc2VEaXJlY3RpdmVbXSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zOiBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlW10gPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuLnRvQXJyYXkoKSkge1xuICAgICAgICAgICAgICAgIGlmICghY2hpbGQuaXNIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgaGVhZGVyIGl0ZW1zXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IG15RHJvcERvd25IZWFkZXJJdGVtcyA9IHRoaXMuZHJvcGRvd24uaGVhZGVycztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGhlYWRlcnMoKTogSWd4RHJvcERvd25JdGVtQmFzZURpcmVjdGl2ZVtdIHtcbiAgICAgICAgY29uc3QgaGVhZGVyczogSWd4RHJvcERvd25JdGVtQmFzZURpcmVjdGl2ZVtdID0gW107XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbi50b0FycmF5KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuaXNIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVycy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZHJvcGRvd24gaHRtbCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogbGV0IG15RHJvcERvd25FbGVtZW50ID0gdGhpcy5kcm9wZG93bi5lbGVtZW50O1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIEdldCBkcm9wZG93bidzIGh0bWwgZWxlbWVudCBvZiBpdHMgc2Nyb2xsIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2Nyb2xsQ29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGNoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4RHJvcERvd25JdGVtQmFzZURpcmVjdGl2ZT47XG5cbiAgICBwcm90ZWN0ZWQgX3dpZHRoO1xuICAgIHByb3RlY3RlZCBfaGVpZ2h0O1xuICAgIHByb3RlY3RlZCBfZm9jdXNlZEl0ZW06IGFueSA9IG51bGw7XG4gICAgcHJvdGVjdGVkIF9pZCA9IGBpZ3gtZHJvcC1kb3duLSR7TkVYVF9JRCsrfWA7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGlmIHRoZSBkcm9wZG93biBpcyBjb2xsYXBzZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY29sbGFwc2VkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcm90ZWN0ZWQgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9uczogSURpc3BsYXlEZW5zaXR5T3B0aW9ucykge1xuICAgICAgICAgICAgc3VwZXIoX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgIC8qKiBLZXlkb3duIEhhbmRsZXIgKi9cbiAgICBwdWJsaWMgb25JdGVtQWN0aW9uS2V5KGtleTogRHJvcERvd25BY3Rpb25LZXksIGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgRHJvcERvd25BY3Rpb25LZXkuRU5URVI6XG4gICAgICAgICAgICBjYXNlIERyb3BEb3duQWN0aW9uS2V5LlNQQUNFOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbSh0aGlzLmZvY3VzZWRJdGVtLCBldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERyb3BEb3duQWN0aW9uS2V5LkVTQ0FQRTpcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVtaXRzIHNlbGVjdGlvbkNoYW5naW5nIHdpdGggdGhlIHRhcmdldCBpdGVtICYgZXZlbnRcbiAgICAgKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICogQHBhcmFtIG5ld1NlbGVjdGlvbiB0aGUgaXRlbSBzZWxlY3RlZFxuICAgICAqIEBwYXJhbSBldmVudCB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIGNhbGxcbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0SXRlbShuZXdTZWxlY3Rpb24/OiBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlLCBldmVudD86IEV2ZW50KSB7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdpbmcuZW1pdCh7XG4gICAgICAgICAgICBuZXdTZWxlY3Rpb24sXG4gICAgICAgICAgICBvbGRTZWxlY3Rpb246IG51bGwsXG4gICAgICAgICAgICBjYW5jZWw6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBmb2N1c2VkSXRlbSgpOiBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWRJdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHNldCBmb2N1c2VkSXRlbShpdGVtOiBJZ3hEcm9wRG93bkl0ZW1CYXNlRGlyZWN0aXZlKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWRJdGVtID0gaXRlbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIGl0ZW0gb24gdGhlIHNwZWNpZmllZCBpbmRleFxuICAgICAqXG4gICAgICogQHBhcmFtIG5ld0luZGV4IG51bWJlciAtIHRoZSBpbmRleCBvZiB0aGUgaXRlbSBpbiB0aGUgYGl0ZW1zYCBjb2xsZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIG5hdmlnYXRlSXRlbShuZXdJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChuZXdJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZEl0ZW0gPSB0aGlzLl9mb2N1c2VkSXRlbTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLml0ZW1zW25ld0luZGV4XTtcbiAgICAgICAgICAgIGlmIChvbGRJdGVtKSB7XG4gICAgICAgICAgICAgICAgb2xkSXRlbS5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZvY3VzZWRJdGVtID0gbmV3SXRlbTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9IaWRkZW5JdGVtKG5ld0l0ZW0pO1xuICAgICAgICAgICAgdGhpcy5mb2N1c2VkSXRlbS5mb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5hdmlnYXRlRmlyc3QoKSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGUoTmF2aWdhdGUuRG93biwgLTEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5hdmlnYXRlTGFzdCgpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZShOYXZpZ2F0ZS5VcCwgdGhpcy5pdGVtcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG5hdmlnYXRlTmV4dCgpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZShOYXZpZ2F0ZS5Eb3duKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBuYXZpZ2F0ZVByZXYoKSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGUoTmF2aWdhdGUuVXApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzY3JvbGxUb0hpZGRlbkl0ZW0obmV3SXRlbTogSWd4RHJvcERvd25JdGVtQmFzZURpcmVjdGl2ZSkge1xuICAgICAgICBjb25zdCBlbGVtZW50UmVjdCA9IG5ld0l0ZW0uZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBwYXJlbnRSZWN0ID0gdGhpcy5zY3JvbGxDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChwYXJlbnRSZWN0LnRvcCA+IGVsZW1lbnRSZWN0LnRvcCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wIC09IChwYXJlbnRSZWN0LnRvcCAtIGVsZW1lbnRSZWN0LnRvcCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50UmVjdC5ib3R0b20gPCBlbGVtZW50UmVjdC5ib3R0b20pIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcCArPSAoZWxlbWVudFJlY3QuYm90dG9tIC0gcGFyZW50UmVjdC5ib3R0b20pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG5hdmlnYXRlKGRpcmVjdGlvbjogTmF2aWdhdGUsIGN1cnJlbnRJbmRleD86IG51bWJlcikge1xuICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgaWYgKHRoaXMuX2ZvY3VzZWRJdGVtKSB7XG4gICAgICAgICAgICBpbmRleCA9IGN1cnJlbnRJbmRleCA/IGN1cnJlbnRJbmRleCA6IHRoaXMuZm9jdXNlZEl0ZW0uaXRlbUluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0luZGV4ID0gdGhpcy5nZXROZWFyZXN0U2libGluZ0ZvY3VzYWJsZUl0ZW1JbmRleChpbmRleCwgZGlyZWN0aW9uKTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUl0ZW0obmV3SW5kZXgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXROZWFyZXN0U2libGluZ0ZvY3VzYWJsZUl0ZW1JbmRleChzdGFydEluZGV4OiBudW1iZXIsIGRpcmVjdGlvbjogTmF2aWdhdGUpOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5kZXggPSBzdGFydEluZGV4O1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIHdoaWxlIChpdGVtc1tpbmRleCArIGRpcmVjdGlvbl0gJiYgaXRlbXNbaW5kZXggKyBkaXJlY3Rpb25dLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBpbmRleCArPSBkaXJlY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBpbmRleCArPSBkaXJlY3Rpb247XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=