import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/** @hidden */
export class IgxSelectionAPIService {
    constructor() {
        /**
         * If primaryKey is defined, then multiple selection is based on the primaryKey, and it is array of numbers, strings, etc.
         * If the primaryKey is omitted, then selection is based on the item data
         */
        this.selection = new Map();
    }
    /**
     * Get current component selection.
     *
     * @param componentID ID of the component.
     */
    get(componentID) {
        return this.selection.get(componentID);
    }
    /**
     * Set new component selection.
     *
     * @param componentID ID of the component.
     * @param newSelection The new component selection to be set.
     */
    set(componentID, newSelection) {
        if (!componentID) {
            throw Error('Invalid value for component id!');
        }
        this.selection.set(componentID, newSelection);
    }
    /**
     * Clears selection for component.
     *
     * @param componentID ID of the component.
     */
    clear(componentID) {
        this.selection.set(componentID, this.get_empty());
    }
    /**
     * Get current component selection length.
     *
     * @param componentID ID of the component.
     */
    size(componentID) {
        const sel = this.get(componentID);
        return sel ? sel.size : 0;
    }
    /**
     * Creates new selection that consist of the new item added to the current component selection.
     * The returned collection is new Set,
     * therefore if you want to update component selection you need to call in addition the set_selection() method
     * or instead use the select_item() one.
     *
     * @param componentID ID of the component, which we add new item to.
     * @param itemID ID of the item to add to component selection.
     * @param sel Used internally only by the selection (add_items method) to accumulate selection for multiple items.
     *
     * @returns Selection after the new item is added.
     */
    add_item(componentID, itemID, sel) {
        if (!sel) {
            sel = new Set(this.get(componentID));
        }
        if (sel === undefined) {
            sel = this.get_empty();
        }
        if (!itemID && itemID !== 0) {
            throw Error('Invalid value for item id!');
        }
        sel.add(itemID);
        return sel;
    }
    /**
     * Creates new selection that consist of the new items added to the current component selection.
     * The returned collection is new Set,
     * therefore if you want to update component selection you need to call in addition the set_selection() method
     * or instead use the select_items() one.
     *
     * @param componentID ID of the component, which we add new items to.
     * @param itemIDs Array of IDs of the items to add to component selection.
     * @param clearSelection If true it will clear previous selection.
     *
     * @returns Selection after the new items are added.
     */
    add_items(componentID, itemIDs, clearSelection) {
        let selection;
        if (clearSelection) {
            selection = this.get_empty();
        }
        else if (itemIDs && itemIDs.length === 0) {
            selection = new Set(this.get(componentID));
        }
        itemIDs.forEach((item) => selection = this.add_item(componentID, item, selection));
        return selection;
    }
    /**
     * Add item to the current component selection.
     *
     * @param componentID ID of the component, which we add new item to.
     * @param itemID ID of the item to add to component selection.
     * @param sel Used internally only by the selection (select_items method) to accumulate selection for multiple items.
     */
    select_item(componentID, itemID, sel) {
        this.set(componentID, this.add_item(componentID, itemID, sel));
    }
    /**
     * Add items to the current component selection.
     *
     * @param componentID ID of the component, which we add new items to.
     * @param itemIDs Array of IDs of the items to add to component selection.
     * @param clearSelection If true it will clear previous selection.
     */
    select_items(componentID, itemID, clearSelection) {
        this.set(componentID, this.add_items(componentID, itemID, clearSelection));
    }
    /**
     * Creates new selection that consist of the new items excluded from the current component selection.
     * The returned collection is new Set,
     * therefore if you want to update component selection you need to call in addition the set_selection() method
     * or instead use the deselect_item() one.
     *
     * @param componentID ID of the component, which we remove items from.
     * @param itemID ID of the item to remove from component selection.
     * @param sel Used internally only by the selection (delete_items method) to accumulate deselected items.
     *
     * @returns Selection after the item is removed.
     */
    delete_item(componentID, itemID, sel) {
        if (!sel) {
            sel = new Set(this.get(componentID));
        }
        if (sel === undefined) {
            return;
        }
        sel.delete(itemID);
        return sel;
    }
    /**
     * Creates new selection that consist of the new items removed to the current component selection.
     * The returned collection is new Set,
     * therefore if you want to update component selection you need to call in addition the set_selection() method
     * or instead use the deselect_items() one.
     *
     * @param componentID ID of the component, which we remove items from.
     * @param itemID ID of the items to remove from component selection.
     *
     * @returns Selection after the items are removed.
     */
    delete_items(componentID, itemIDs) {
        let selection;
        itemIDs.forEach((deselectedItem) => selection = this.delete_item(componentID, deselectedItem, selection));
        return selection;
    }
    /**
     * Remove item from the current component selection.
     *
     * @param componentID ID of the component, which we remove item from.
     * @param itemID ID of the item to remove from component selection.
     * @param sel Used internally only by the selection (deselect_items method) to accumulate selection for multiple items.
     */
    deselect_item(componentID, itemID, sel) {
        this.set(componentID, this.delete_item(componentID, itemID, sel));
    }
    /**
     * Remove items to the current component selection.
     *
     * @param componentID ID of the component, which we add new items to.
     * @param itemIDs Array of IDs of the items to add to component selection.
     */
    deselect_items(componentID, itemID, clearSelection) {
        this.set(componentID, this.delete_items(componentID, itemID));
    }
    /**
     * Check if the item is selected in the component selection.
     *
     * @param componentID ID of the component.
     * @param itemID ID of the item to search.
     *
     * @returns If item is selected.
     */
    is_item_selected(componentID, itemID) {
        const sel = this.get(componentID);
        if (!sel) {
            return false;
        }
        return sel.has(itemID);
    }
    /**
     * Get first element in the selection.
     * This is correct when we have only one item in the collection (for single selection purposes)
     * and the method returns that item.
     *
     * @param componentID ID of the component.
     *
     * @returns First element in the set.
     */
    first_item(componentID) {
        const sel = this.get(componentID);
        if (sel && sel.size > 0) {
            return sel.values().next().value;
        }
    }
    /**
     * Returns whether all items are selected.
     *
     * @param componentID ID of the component.
     * @param dataCount: number Number of items in the data.
     *
     * @returns If all items are selected.
     */
    are_all_selected(componentID, dataCount) {
        return dataCount > 0 && dataCount === this.size(componentID);
    }
    /**
     * Returns whether any of the items is selected.
     *
     * @param componentID ID of the component.
     * @param data Entire data array.
     *
     * @returns If there is any item selected.
     */
    are_none_selected(componentID) {
        return this.size(componentID) === 0;
    }
    /**
     * Get all primary key values from a data array. If there isn't a primary key defined that the entire data is returned instead.
     *
     * @param data Entire data array.
     * @param primaryKey Data primary key.
     *
     * @returns Array of identifiers, either primary key values or the entire data array.
     */
    get_all_ids(data, primaryKey) {
        // If primaryKey is 0, this should still map to the property
        return primaryKey !== undefined && primaryKey !== null ? data.map((x) => x[primaryKey]) : data;
    }
    /**
     * Returns empty selection collection.
     *
     * @returns empty set.
     */
    get_empty() {
        return new Set();
    }
}
IgxSelectionAPIService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectionAPIService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IgxSelectionAPIService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectionAPIService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxSelectionAPIService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NvcmUvc2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTNDLGNBQWM7QUFJZCxNQUFNLE9BQU8sc0JBQXNCO0lBSG5DO1FBSUk7OztXQUdHO1FBQ08sY0FBUyxHQUEyQixJQUFJLEdBQUcsRUFBb0IsQ0FBQztLQTRQN0U7SUExUEc7Ozs7T0FJRztJQUNJLEdBQUcsQ0FBQyxXQUFtQjtRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxXQUFtQixFQUFFLFlBQXNCO1FBQ2xELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDZCxNQUFNLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFdBQW1CO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLElBQUksQ0FBQyxXQUFtQjtRQUMzQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ksUUFB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QUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDbkcsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTO1FBQ1osT0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7O21IQWhRUSxzQkFBc0I7dUhBQXRCLHNCQUFzQixjQUZuQixNQUFNOzJGQUVULHNCQUFzQjtrQkFIbEMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKiBAaGlkZGVuICovXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBJZ3hTZWxlY3Rpb25BUElTZXJ2aWNlIHtcbiAgICAvKipcbiAgICAgKiBJZiBwcmltYXJ5S2V5IGlzIGRlZmluZWQsIHRoZW4gbXVsdGlwbGUgc2VsZWN0aW9uIGlzIGJhc2VkIG9uIHRoZSBwcmltYXJ5S2V5LCBhbmQgaXQgaXMgYXJyYXkgb2YgbnVtYmVycywgc3RyaW5ncywgZXRjLlxuICAgICAqIElmIHRoZSBwcmltYXJ5S2V5IGlzIG9taXR0ZWQsIHRoZW4gc2VsZWN0aW9uIGlzIGJhc2VkIG9uIHRoZSBpdGVtIGRhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2VsZWN0aW9uOiBNYXA8c3RyaW5nLCAgU2V0PGFueT4+ID0gbmV3IE1hcDxzdHJpbmcsIFNldDxhbnk+PigpO1xuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgY29tcG9uZW50IHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb21wb25lbnRJRCBJRCBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQoY29tcG9uZW50SUQ6IHN0cmluZyk6IFNldDxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmdldChjb21wb25lbnRJRCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IG5ldyBjb21wb25lbnQgc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudElEIElEIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIG5ld1NlbGVjdGlvbiBUaGUgbmV3IGNvbXBvbmVudCBzZWxlY3Rpb24gdG8gYmUgc2V0LlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQoY29tcG9uZW50SUQ6IHN0cmluZywgbmV3U2VsZWN0aW9uOiBTZXQ8YW55Pikge1xuICAgICAgICBpZiAoIWNvbXBvbmVudElEKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignSW52YWxpZCB2YWx1ZSBmb3IgY29tcG9uZW50IGlkIScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLnNldChjb21wb25lbnRJRCwgbmV3U2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgc2VsZWN0aW9uIGZvciBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXIoY29tcG9uZW50SUQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbi5zZXQoY29tcG9uZW50SUQsIHRoaXMuZ2V0X2VtcHR5KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IGNvbXBvbmVudCBzZWxlY3Rpb24gbGVuZ3RoLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudElEIElEIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICovXG4gICAgcHVibGljIHNpemUoY29tcG9uZW50SUQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHNlbCA9IHRoaXMuZ2V0KGNvbXBvbmVudElEKTtcbiAgICAgICAgcmV0dXJuIHNlbCA/IHNlbC5zaXplIDogMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIG5ldyBzZWxlY3Rpb24gdGhhdCBjb25zaXN0IG9mIHRoZSBuZXcgaXRlbSBhZGRlZCB0byB0aGUgY3VycmVudCBjb21wb25lbnQgc2VsZWN0aW9uLlxuICAgICAqIFRoZSByZXR1cm5lZCBjb2xsZWN0aW9uIGlzIG5ldyBTZXQsXG4gICAgICogdGhlcmVmb3JlIGlmIHlvdSB3YW50IHRvIHVwZGF0ZSBjb21wb25lbnQgc2VsZWN0aW9uIHlvdSBuZWVkIHRvIGNhbGwgaW4gYWRkaXRpb24gdGhlIHNldF9zZWxlY3Rpb24oKSBtZXRob2RcbiAgICAgKiBvciBpbnN0ZWFkIHVzZSB0aGUgc2VsZWN0X2l0ZW0oKSBvbmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2UgYWRkIG5ldyBpdGVtIHRvLlxuICAgICAqIEBwYXJhbSBpdGVtSUQgSUQgb2YgdGhlIGl0ZW0gdG8gYWRkIHRvIGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICogQHBhcmFtIHNlbCBVc2VkIGludGVybmFsbHkgb25seSBieSB0aGUgc2VsZWN0aW9uIChhZGRfaXRlbXMgbWV0aG9kKSB0byBhY2N1bXVsYXRlIHNlbGVjdGlvbiBmb3IgbXVsdGlwbGUgaXRlbXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBTZWxlY3Rpb24gYWZ0ZXIgdGhlIG5ldyBpdGVtIGlzIGFkZGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRfaXRlbShjb21wb25lbnRJRDogc3RyaW5nLCBpdGVtSUQsIHNlbD86IFNldDxhbnk+KTogU2V0PGFueT4ge1xuICAgICAgICBpZiAoIXNlbCkge1xuICAgICAgICAgICAgc2VsID0gbmV3IFNldCh0aGlzLmdldChjb21wb25lbnRJRCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2VsID0gdGhpcy5nZXRfZW1wdHkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWl0ZW1JRCAmJiBpdGVtSUQgIT09IDApIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIHZhbHVlIGZvciBpdGVtIGlkIScpO1xuICAgICAgICB9XG4gICAgICAgIHNlbC5hZGQoaXRlbUlEKTtcbiAgICAgICAgcmV0dXJuIHNlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIG5ldyBzZWxlY3Rpb24gdGhhdCBjb25zaXN0IG9mIHRoZSBuZXcgaXRlbXMgYWRkZWQgdG8gdGhlIGN1cnJlbnQgY29tcG9uZW50IHNlbGVjdGlvbi5cbiAgICAgKiBUaGUgcmV0dXJuZWQgY29sbGVjdGlvbiBpcyBuZXcgU2V0LFxuICAgICAqIHRoZXJlZm9yZSBpZiB5b3Ugd2FudCB0byB1cGRhdGUgY29tcG9uZW50IHNlbGVjdGlvbiB5b3UgbmVlZCB0byBjYWxsIGluIGFkZGl0aW9uIHRoZSBzZXRfc2VsZWN0aW9uKCkgbWV0aG9kXG4gICAgICogb3IgaW5zdGVhZCB1c2UgdGhlIHNlbGVjdF9pdGVtcygpIG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb21wb25lbnRJRCBJRCBvZiB0aGUgY29tcG9uZW50LCB3aGljaCB3ZSBhZGQgbmV3IGl0ZW1zIHRvLlxuICAgICAqIEBwYXJhbSBpdGVtSURzIEFycmF5IG9mIElEcyBvZiB0aGUgaXRlbXMgdG8gYWRkIHRvIGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICogQHBhcmFtIGNsZWFyU2VsZWN0aW9uIElmIHRydWUgaXQgd2lsbCBjbGVhciBwcmV2aW91cyBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBTZWxlY3Rpb24gYWZ0ZXIgdGhlIG5ldyBpdGVtcyBhcmUgYWRkZWQuXG4gICAgICovXG4gICAgcHVibGljIGFkZF9pdGVtcyhjb21wb25lbnRJRDogc3RyaW5nLCBpdGVtSURzOiBhbnlbXSwgY2xlYXJTZWxlY3Rpb24/OiBib29sZWFuKTogU2V0PGFueT4ge1xuICAgICAgICBsZXQgc2VsZWN0aW9uOiBTZXQ8YW55PjtcbiAgICAgICAgaWYgKGNsZWFyU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb24gPSB0aGlzLmdldF9lbXB0eSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGl0ZW1JRHMgJiYgaXRlbUlEcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbiA9IG5ldyBTZXQodGhpcy5nZXQoY29tcG9uZW50SUQpKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtSURzLmZvckVhY2goKGl0ZW0pID0+IHNlbGVjdGlvbiA9IHRoaXMuYWRkX2l0ZW0oY29tcG9uZW50SUQsIGl0ZW0sIHNlbGVjdGlvbikpO1xuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBpdGVtIHRvIHRoZSBjdXJyZW50IGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2UgYWRkIG5ldyBpdGVtIHRvLlxuICAgICAqIEBwYXJhbSBpdGVtSUQgSUQgb2YgdGhlIGl0ZW0gdG8gYWRkIHRvIGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICogQHBhcmFtIHNlbCBVc2VkIGludGVybmFsbHkgb25seSBieSB0aGUgc2VsZWN0aW9uIChzZWxlY3RfaXRlbXMgbWV0aG9kKSB0byBhY2N1bXVsYXRlIHNlbGVjdGlvbiBmb3IgbXVsdGlwbGUgaXRlbXMuXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdF9pdGVtKGNvbXBvbmVudElEOiBzdHJpbmcsIGl0ZW1JRCwgc2VsPzogU2V0PGFueT4pIHtcbiAgICAgICAgdGhpcy5zZXQoY29tcG9uZW50SUQsIHRoaXMuYWRkX2l0ZW0oY29tcG9uZW50SUQsIGl0ZW1JRCwgc2VsKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGl0ZW1zIHRvIHRoZSBjdXJyZW50IGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2UgYWRkIG5ldyBpdGVtcyB0by5cbiAgICAgKiBAcGFyYW0gaXRlbUlEcyBBcnJheSBvZiBJRHMgb2YgdGhlIGl0ZW1zIHRvIGFkZCB0byBjb21wb25lbnQgc2VsZWN0aW9uLlxuICAgICAqIEBwYXJhbSBjbGVhclNlbGVjdGlvbiBJZiB0cnVlIGl0IHdpbGwgY2xlYXIgcHJldmlvdXMgc2VsZWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RfaXRlbXMoY29tcG9uZW50SUQ6IHN0cmluZywgaXRlbUlEOiBhbnlbXSwgY2xlYXJTZWxlY3Rpb24/OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuc2V0KGNvbXBvbmVudElELCB0aGlzLmFkZF9pdGVtcyhjb21wb25lbnRJRCwgaXRlbUlELCBjbGVhclNlbGVjdGlvbikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgbmV3IHNlbGVjdGlvbiB0aGF0IGNvbnNpc3Qgb2YgdGhlIG5ldyBpdGVtcyBleGNsdWRlZCBmcm9tIHRoZSBjdXJyZW50IGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICogVGhlIHJldHVybmVkIGNvbGxlY3Rpb24gaXMgbmV3IFNldCxcbiAgICAgKiB0aGVyZWZvcmUgaWYgeW91IHdhbnQgdG8gdXBkYXRlIGNvbXBvbmVudCBzZWxlY3Rpb24geW91IG5lZWQgdG8gY2FsbCBpbiBhZGRpdGlvbiB0aGUgc2V0X3NlbGVjdGlvbigpIG1ldGhvZFxuICAgICAqIG9yIGluc3RlYWQgdXNlIHRoZSBkZXNlbGVjdF9pdGVtKCkgb25lLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudElEIElEIG9mIHRoZSBjb21wb25lbnQsIHdoaWNoIHdlIHJlbW92ZSBpdGVtcyBmcm9tLlxuICAgICAqIEBwYXJhbSBpdGVtSUQgSUQgb2YgdGhlIGl0ZW0gdG8gcmVtb3ZlIGZyb20gY29tcG9uZW50IHNlbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0gc2VsIFVzZWQgaW50ZXJuYWxseSBvbmx5IGJ5IHRoZSBzZWxlY3Rpb24gKGRlbGV0ZV9pdGVtcyBtZXRob2QpIHRvIGFjY3VtdWxhdGUgZGVzZWxlY3RlZCBpdGVtcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFNlbGVjdGlvbiBhZnRlciB0aGUgaXRlbSBpcyByZW1vdmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBkZWxldGVfaXRlbShjb21wb25lbnRJRDogc3RyaW5nLCBpdGVtSUQsIHNlbD86IFNldDxhbnk+KSB7XG4gICAgICAgIGlmICghc2VsKSB7XG4gICAgICAgICAgICBzZWwgPSBuZXcgU2V0KHRoaXMuZ2V0KGNvbXBvbmVudElEKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2VsLmRlbGV0ZShpdGVtSUQpO1xuICAgICAgICByZXR1cm4gc2VsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgbmV3IHNlbGVjdGlvbiB0aGF0IGNvbnNpc3Qgb2YgdGhlIG5ldyBpdGVtcyByZW1vdmVkIHRvIHRoZSBjdXJyZW50IGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICogVGhlIHJldHVybmVkIGNvbGxlY3Rpb24gaXMgbmV3IFNldCxcbiAgICAgKiB0aGVyZWZvcmUgaWYgeW91IHdhbnQgdG8gdXBkYXRlIGNvbXBvbmVudCBzZWxlY3Rpb24geW91IG5lZWQgdG8gY2FsbCBpbiBhZGRpdGlvbiB0aGUgc2V0X3NlbGVjdGlvbigpIG1ldGhvZFxuICAgICAqIG9yIGluc3RlYWQgdXNlIHRoZSBkZXNlbGVjdF9pdGVtcygpIG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb21wb25lbnRJRCBJRCBvZiB0aGUgY29tcG9uZW50LCB3aGljaCB3ZSByZW1vdmUgaXRlbXMgZnJvbS5cbiAgICAgKiBAcGFyYW0gaXRlbUlEIElEIG9mIHRoZSBpdGVtcyB0byByZW1vdmUgZnJvbSBjb21wb25lbnQgc2VsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMgU2VsZWN0aW9uIGFmdGVyIHRoZSBpdGVtcyBhcmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZGVsZXRlX2l0ZW1zKGNvbXBvbmVudElEOiBzdHJpbmcsIGl0ZW1JRHM6IGFueVtdKTogU2V0PGFueT4ge1xuICAgICAgICBsZXQgc2VsZWN0aW9uOiBTZXQ8YW55PjtcbiAgICAgICAgaXRlbUlEcy5mb3JFYWNoKChkZXNlbGVjdGVkSXRlbSkgPT4gc2VsZWN0aW9uID0gdGhpcy5kZWxldGVfaXRlbShjb21wb25lbnRJRCwgZGVzZWxlY3RlZEl0ZW0sIHNlbGVjdGlvbikpO1xuICAgICAgICByZXR1cm4gc2VsZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBpdGVtIGZyb20gdGhlIGN1cnJlbnQgY29tcG9uZW50IHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb21wb25lbnRJRCBJRCBvZiB0aGUgY29tcG9uZW50LCB3aGljaCB3ZSByZW1vdmUgaXRlbSBmcm9tLlxuICAgICAqIEBwYXJhbSBpdGVtSUQgSUQgb2YgdGhlIGl0ZW0gdG8gcmVtb3ZlIGZyb20gY29tcG9uZW50IHNlbGVjdGlvbi5cbiAgICAgKiBAcGFyYW0gc2VsIFVzZWQgaW50ZXJuYWxseSBvbmx5IGJ5IHRoZSBzZWxlY3Rpb24gKGRlc2VsZWN0X2l0ZW1zIG1ldGhvZCkgdG8gYWNjdW11bGF0ZSBzZWxlY3Rpb24gZm9yIG11bHRpcGxlIGl0ZW1zLlxuICAgICAqL1xuICAgIHB1YmxpYyBkZXNlbGVjdF9pdGVtKGNvbXBvbmVudElEOiBzdHJpbmcsIGl0ZW1JRCwgc2VsPzogU2V0PGFueT4pIHtcbiAgICAgICAgdGhpcy5zZXQoY29tcG9uZW50SUQsIHRoaXMuZGVsZXRlX2l0ZW0oY29tcG9uZW50SUQsIGl0ZW1JRCwgc2VsKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGl0ZW1zIHRvIHRoZSBjdXJyZW50IGNvbXBvbmVudCBzZWxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2UgYWRkIG5ldyBpdGVtcyB0by5cbiAgICAgKiBAcGFyYW0gaXRlbUlEcyBBcnJheSBvZiBJRHMgb2YgdGhlIGl0ZW1zIHRvIGFkZCB0byBjb21wb25lbnQgc2VsZWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBkZXNlbGVjdF9pdGVtcyhjb21wb25lbnRJRDogc3RyaW5nLCBpdGVtSUQ6IGFueVtdLCBjbGVhclNlbGVjdGlvbj86IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5zZXQoY29tcG9uZW50SUQsIHRoaXMuZGVsZXRlX2l0ZW1zKGNvbXBvbmVudElELCBpdGVtSUQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgaXRlbSBpcyBzZWxlY3RlZCBpbiB0aGUgY29tcG9uZW50IHNlbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb21wb25lbnRJRCBJRCBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBpdGVtSUQgSUQgb2YgdGhlIGl0ZW0gdG8gc2VhcmNoLlxuICAgICAqXG4gICAgICogQHJldHVybnMgSWYgaXRlbSBpcyBzZWxlY3RlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNfaXRlbV9zZWxlY3RlZChjb21wb25lbnRJRDogc3RyaW5nLCBpdGVtSUQpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc2VsID0gdGhpcy5nZXQoY29tcG9uZW50SUQpO1xuICAgICAgICBpZiAoIXNlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWwuaGFzKGl0ZW1JRCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGZpcnN0IGVsZW1lbnQgaW4gdGhlIHNlbGVjdGlvbi5cbiAgICAgKiBUaGlzIGlzIGNvcnJlY3Qgd2hlbiB3ZSBoYXZlIG9ubHkgb25lIGl0ZW0gaW4gdGhlIGNvbGxlY3Rpb24gKGZvciBzaW5nbGUgc2VsZWN0aW9uIHB1cnBvc2VzKVxuICAgICAqIGFuZCB0aGUgbWV0aG9kIHJldHVybnMgdGhhdCBpdGVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudElEIElEIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBGaXJzdCBlbGVtZW50IGluIHRoZSBzZXQuXG4gICAgICovXG4gICAgcHVibGljIGZpcnN0X2l0ZW0oY29tcG9uZW50SUQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBzZWwgPSB0aGlzLmdldChjb21wb25lbnRJRCk7XG4gICAgICAgIGlmIChzZWwgJiYgc2VsLnNpemUgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcbiAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIGFsbCBpdGVtcyBhcmUgc2VsZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0gZGF0YUNvdW50OiBudW1iZXIgTnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBkYXRhLlxuICAgICAqXG4gICAgICogQHJldHVybnMgSWYgYWxsIGl0ZW1zIGFyZSBzZWxlY3RlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXJlX2FsbF9zZWxlY3RlZChjb21wb25lbnRJRDogc3RyaW5nLCBkYXRhQ291bnQ6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZGF0YUNvdW50ID4gMCAmJiBkYXRhQ291bnQgPT09IHRoaXMuc2l6ZShjb21wb25lbnRJRCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIGFueSBvZiB0aGUgaXRlbXMgaXMgc2VsZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50SUQgSUQgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0gZGF0YSBFbnRpcmUgZGF0YSBhcnJheS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIElmIHRoZXJlIGlzIGFueSBpdGVtIHNlbGVjdGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBhcmVfbm9uZV9zZWxlY3RlZChjb21wb25lbnRJRDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemUoY29tcG9uZW50SUQpID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgcHJpbWFyeSBrZXkgdmFsdWVzIGZyb20gYSBkYXRhIGFycmF5LiBJZiB0aGVyZSBpc24ndCBhIHByaW1hcnkga2V5IGRlZmluZWQgdGhhdCB0aGUgZW50aXJlIGRhdGEgaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIEVudGlyZSBkYXRhIGFycmF5LlxuICAgICAqIEBwYXJhbSBwcmltYXJ5S2V5IERhdGEgcHJpbWFyeSBrZXkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiBpZGVudGlmaWVycywgZWl0aGVyIHByaW1hcnkga2V5IHZhbHVlcyBvciB0aGUgZW50aXJlIGRhdGEgYXJyYXkuXG4gICAgICovXG4gICAgcHVibGljIGdldF9hbGxfaWRzKGRhdGEsIHByaW1hcnlLZXk/KSB7XG4gICAgICAgIC8vIElmIHByaW1hcnlLZXkgaXMgMCwgdGhpcyBzaG91bGQgc3RpbGwgbWFwIHRvIHRoZSBwcm9wZXJ0eVxuICAgICAgICByZXR1cm4gcHJpbWFyeUtleSAhPT0gdW5kZWZpbmVkICYmIHByaW1hcnlLZXkgIT09IG51bGwgPyBkYXRhLm1hcCgoeCkgPT4geFtwcmltYXJ5S2V5XSkgOiBkYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZW1wdHkgc2VsZWN0aW9uIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBlbXB0eSBzZXQuXG4gICAgICovXG4gICAgcHVibGljIGdldF9lbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXQoKTtcbiAgICB9XG59XG4iXX0=