import { ContentChildren, Directive, EventEmitter, Input, Output } from '@angular/core';
import { Direction, IgxCarouselComponentBase } from '../carousel/carousel-base';
import { IgxTabItemDirective } from './tab-item.directive';
import { IgxTabContentBase } from './tabs.base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "../services/direction/directionality";
export class IgxTabsDirective extends IgxCarouselComponentBase {
    /** @hidden */
    constructor(builder, cdr, dir) {
        super(builder, cdr);
        this.dir = dir;
        /**
         * Output to enable support for two-way binding on [(selectedIndex)]
         */
        this.selectedIndexChange = new EventEmitter();
        /**
         * Emitted when the selected index is about to change.
         */
        this.selectedIndexChanging = new EventEmitter();
        /**
         * Emitted when the selected item is changed.
         */
        this.selectedItemChange = new EventEmitter();
        /** @hidden */
        this._disableAnimation = false;
        this._selectedIndex = -1;
    }
    /**
     * An @Input property that gets/sets the index of the selected item.
     * Default value is 0 if contents are defined otherwise defaults to -1.
     */
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        if (this._selectedIndex !== value) {
            let newIndex = value;
            const oldIndex = this._selectedIndex;
            const args = {
                owner: this,
                cancel: false,
                oldIndex,
                newIndex
            };
            this.selectedIndexChanging.emit(args);
            if (!args.cancel) {
                newIndex = args.newIndex;
                this._selectedIndex = newIndex;
                this.selectedIndexChange.emit(this._selectedIndex);
            }
            this.updateSelectedTabs(oldIndex);
        }
    }
    /**
     * Enables/disables the transition animation of the contents.
     */
    get disableAnimation() {
        return this._disableAnimation;
    }
    set disableAnimation(value) {
        this._disableAnimation = value;
    }
    /**
     * Gets the selected item.
     */
    get selectedItem() {
        return this.items && this.selectedIndex >= 0 && this.selectedIndex < this.items.length ?
            this.items.get(this.selectedIndex) : null;
    }
    /** @hidden */
    ngAfterViewInit() {
        if (this._selectedIndex === -1) {
            const hasSelectedTab = this.items.some((tab, i) => {
                if (tab.selected) {
                    this._selectedIndex = i;
                }
                return tab.selected;
            });
            if (!hasSelectedTab && this.hasPanels) {
                this._selectedIndex = 0;
            }
        }
        // Use promise to avoid expression changed after check error
        Promise.resolve().then(() => {
            this.updateSelectedTabs(null, false);
        });
        this._itemChanges$ = this.items.changes.subscribe(() => {
            this.onItemChanges();
        });
        this.setAttributes();
    }
    /** @hidden */
    ngOnDestroy() {
        if (this._itemChanges$) {
            this._itemChanges$.unsubscribe();
        }
    }
    /** @hidden */
    selectTab(tab, selected) {
        if (!this.items) {
            return;
        }
        const tabs = this.items.toArray();
        if (selected) {
            const index = tabs.indexOf(tab);
            if (index > -1) {
                this.selectedIndex = index;
            }
        }
        else {
            if (tabs.every(t => !t.selected)) {
                this.selectedIndex = -1;
            }
        }
    }
    /** @hidden */
    getPreviousElement() {
        return this.previousItem.panelComponent.nativeElement;
    }
    /** @hidden */
    getCurrentElement() {
        return this.currentItem.panelComponent.nativeElement;
    }
    /** @hidden */
    scrollTabHeaderIntoView() {
    }
    /** @hidden */
    onItemChanges() {
        this.setAttributes();
        // Check if there is selected tab
        let selectedIndex = -1;
        this.items.some((tab, i) => {
            if (tab.selected) {
                selectedIndex = i;
            }
            return tab.selected;
        });
        if (selectedIndex >= 0) {
            // Set the selected index to the tab that has selected=true
            Promise.resolve().then(() => {
                this.selectedIndex = selectedIndex;
            });
        }
        else {
            if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
                // Select the tab on the same index the previous selected tab was
                Promise.resolve().then(() => {
                    this.updateSelectedTabs(null);
                });
            }
            else if (this.selectedIndex >= this.items.length) {
                // Select the last tab
                Promise.resolve().then(() => {
                    this.selectedIndex = this.items.length - 1;
                });
            }
        }
    }
    setAttributes() {
        this.items.forEach(item => {
            if (item.panelComponent && !item.headerComponent.nativeElement.getAttribute('id')) {
                const id = this.getNextTabId();
                const tabHeaderId = `${this.componentName}-header-${id}`;
                const tabPanelId = `${this.componentName}-content-${id}`;
                this.setHeaderAttribute(item, 'id', tabHeaderId);
                this.setHeaderAttribute(item, 'aria-controls', tabPanelId);
                this.setPanelAttribute(item, 'id', tabPanelId);
                this.setPanelAttribute(item, 'aria-labelledby', tabHeaderId);
            }
        });
    }
    setHeaderAttribute(item, attrName, value) {
        item.headerComponent.nativeElement.setAttribute(attrName, value);
    }
    setPanelAttribute(item, attrName, value) {
        item.panelComponent.nativeElement.setAttribute(attrName, value);
    }
    get hasPanels() {
        return this.panels && this.panels.length;
    }
    updateSelectedTabs(oldSelectedIndex, raiseEvent = true) {
        if (!this.items) {
            return;
        }
        let newTab;
        const oldTab = this.currentItem;
        // First select the new tab
        if (this._selectedIndex >= 0 && this._selectedIndex < this.items.length) {
            newTab = this.items.get(this._selectedIndex);
            newTab.selected = true;
        }
        // Then unselect the other tabs
        this.items.forEach((tab, i) => {
            if (i !== this._selectedIndex) {
                tab.selected = false;
            }
        });
        if (this._selectedIndex !== oldSelectedIndex) {
            this.scrollTabHeaderIntoView();
            this.triggerPanelAnimations(oldSelectedIndex);
            if (raiseEvent && newTab !== oldTab) {
                this.selectedItemChange.emit({
                    owner: this,
                    newItem: newTab,
                    oldItem: oldTab
                });
            }
        }
    }
    triggerPanelAnimations(oldSelectedIndex) {
        const item = this.items.get(this._selectedIndex);
        if (item &&
            !this.disableAnimation &&
            this.hasPanels &&
            this.currentItem &&
            !this.currentItem.selected) {
            item.direction = (!this.dir.rtl && this._selectedIndex > oldSelectedIndex) ||
                (this.dir.rtl && this._selectedIndex < oldSelectedIndex)
                ? Direction.NEXT : Direction.PREV;
            if (this.previousItem && this.previousItem.previous) {
                this.previousItem.previous = false;
            }
            this.currentItem.direction = item.direction;
            this.previousItem = this.currentItem;
            this.currentItem = item;
            this.triggerAnimations();
        }
        else {
            this.currentItem = item;
        }
    }
}
IgxTabsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsDirective, deps: [{ token: i1.AnimationBuilder }, { token: i0.ChangeDetectorRef }, { token: i2.IgxDirectionality }], target: i0.ɵɵFactoryTarget.Directive });
IgxTabsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxTabsDirective, inputs: { selectedIndex: "selectedIndex", disableAnimation: "disableAnimation" }, outputs: { selectedIndexChange: "selectedIndexChange", selectedIndexChanging: "selectedIndexChanging", selectedItemChange: "selectedItemChange" }, queries: [{ propertyName: "items", predicate: IgxTabItemDirective }, { propertyName: "panels", predicate: IgxTabContentBase, descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTabsDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.AnimationBuilder }, { type: i0.ChangeDetectorRef }, { type: i2.IgxDirectionality }]; }, propDecorators: { selectedIndex: [{
                type: Input
            }], disableAnimation: [{
                type: Input
            }], selectedIndexChange: [{
                type: Output
            }], selectedIndexChanging: [{
                type: Output
            }], selectedItemChange: [{
                type: Output
            }], items: [{
                type: ContentChildren,
                args: [IgxTabItemDirective]
            }], panels: [{
                type: ContentChildren,
                args: [IgxTabContentBase, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvdGFicy90YWJzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQytCLGVBQWUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUMxRSxLQUFLLEVBQWEsTUFBTSxFQUMzQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHaEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGlCQUFpQixFQUFlLE1BQU0sYUFBYSxDQUFDOzs7O0FBa0I3RCxNQUFNLE9BQWdCLGdCQUFpQixTQUFRLHdCQUF3QjtJQTZGbkUsY0FBYztJQUNkLFlBQVksT0FBeUIsRUFBRSxHQUFzQixFQUFTLEdBQXNCO1FBQ3hGLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFEOEMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFqRDVGOztXQUVHO1FBRUksd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUV4RDs7V0FFRztRQUVJLDBCQUFxQixHQUFHLElBQUksWUFBWSxFQUF1QyxDQUFDO1FBRXZGOztXQUVHO1FBRUksdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQW9DLENBQUM7UUFvQmpGLGNBQWM7UUFDSixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFRNUIsbUJBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQU01QixDQUFDO0lBOUZEOzs7T0FHRztJQUNILElBQ1csYUFBYTtRQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQVcsYUFBYSxDQUFDLEtBQWE7UUFDbEMsSUFBSSxJQUFJLENBQUMsY0FB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QWdCLENBQUM7Z0JBQ3hELENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBRXRDLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtnQkFDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2FBQ3RDO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUU1QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQzs7NkdBM1JpQixnQkFBZ0I7aUdBQWhCLGdCQUFnQixxUkFrRWpCLG1CQUFtQix5Q0FZbkIsaUJBQWlCOzJGQTlFaEIsZ0JBQWdCO2tCQURyQyxTQUFTO3VLQVFLLGFBQWE7c0JBRHZCLEtBQUs7Z0JBK0JLLGdCQUFnQjtzQkFEMUIsS0FBSztnQkFhQyxtQkFBbUI7c0JBRHpCLE1BQU07Z0JBT0EscUJBQXFCO3NCQUQzQixNQUFNO2dCQU9BLGtCQUFrQjtzQkFEeEIsTUFBTTtnQkFPQSxLQUFLO3NCQURYLGVBQWU7dUJBQUMsbUJBQW1CO2dCQWE3QixNQUFNO3NCQURaLGVBQWU7dUJBQUMsaUJBQWlCLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uQnVpbGRlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgICBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29udGVudENoaWxkcmVuLCBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlcixcbiAgICBJbnB1dCwgT25EZXN0cm95LCBPdXRwdXQsIFF1ZXJ5TGlzdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRGlyZWN0aW9uLCBJZ3hDYXJvdXNlbENvbXBvbmVudEJhc2UgfSBmcm9tICcuLi9jYXJvdXNlbC9jYXJvdXNlbC1iYXNlJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzIH0gZnJvbSAnLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBJZ3hEaXJlY3Rpb25hbGl0eSB9IGZyb20gJy4uL3NlcnZpY2VzL2RpcmVjdGlvbi9kaXJlY3Rpb25hbGl0eSc7XG5pbXBvcnQgeyBJZ3hUYWJJdGVtRGlyZWN0aXZlIH0gZnJvbSAnLi90YWItaXRlbS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4VGFiQ29udGVudEJhc2UsIElneFRhYnNCYXNlIH0gZnJvbSAnLi90YWJzLmJhc2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElUYWJzQmFzZUV2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICByZWFkb25seSBvd25lcjogSWd4VGFic0RpcmVjdGl2ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVGFic1NlbGVjdGVkSW5kZXhDaGFuZ2luZ0V2ZW50QXJncyBleHRlbmRzIElUYWJzQmFzZUV2ZW50QXJncyB7XG4gICAgY2FuY2VsOiBib29sZWFuO1xuICAgIHJlYWRvbmx5IG9sZEluZGV4OiBudW1iZXI7XG4gICAgbmV3SW5kZXg6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVGFic1NlbGVjdGVkSXRlbUNoYW5nZUV2ZW50QXJncyBleHRlbmRzIElUYWJzQmFzZUV2ZW50QXJncyB7XG4gICAgcmVhZG9ubHkgb2xkSXRlbTogSWd4VGFiSXRlbURpcmVjdGl2ZTtcbiAgICByZWFkb25seSBuZXdJdGVtOiBJZ3hUYWJJdGVtRGlyZWN0aXZlO1xufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJZ3hUYWJzRGlyZWN0aXZlIGV4dGVuZHMgSWd4Q2Fyb3VzZWxDb21wb25lbnRCYXNlIGltcGxlbWVudHMgSWd4VGFic0Jhc2UsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgICAvKipcbiAgICAgKiBBbiBASW5wdXQgcHJvcGVydHkgdGhhdCBnZXRzL3NldHMgdGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBpdGVtLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgMCBpZiBjb250ZW50cyBhcmUgZGVmaW5lZCBvdGhlcndpc2UgZGVmYXVsdHMgdG8gLTEuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkSW5kZXg7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT09IHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgbmV3SW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9sZEluZGV4ID0gdGhpcy5fc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3M6IElUYWJzU2VsZWN0ZWRJbmRleENoYW5naW5nRXZlbnRBcmdzID0ge1xuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgIGNhbmNlbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb2xkSW5kZXgsXG4gICAgICAgICAgICAgICAgbmV3SW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2luZy5lbWl0KGFyZ3MpO1xuXG4gICAgICAgICAgICBpZiAoIWFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBhcmdzLm5ld0luZGV4O1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSBuZXdJbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2UuZW1pdCh0aGlzLl9zZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZFRhYnMob2xkSW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5hYmxlcy9kaXNhYmxlcyB0aGUgdHJhbnNpdGlvbiBhbmltYXRpb24gb2YgdGhlIGNvbnRlbnRzLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBkaXNhYmxlQW5pbWF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZUFuaW1hdGlvbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGRpc2FibGVBbmltYXRpb24odmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZUFuaW1hdGlvbiA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE91dHB1dCB0byBlbmFibGUgc3VwcG9ydCBmb3IgdHdvLXdheSBiaW5kaW5nIG9uIFsoc2VsZWN0ZWRJbmRleCldXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGVkSW5kZXhDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0ZWQgaW5kZXggaXMgYWJvdXQgdG8gY2hhbmdlLlxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBzZWxlY3RlZEluZGV4Q2hhbmdpbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElUYWJzU2VsZWN0ZWRJbmRleENoYW5naW5nRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCBpdGVtIGlzIGNoYW5nZWQuXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGVkSXRlbUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8SVRhYnNTZWxlY3RlZEl0ZW1DaGFuZ2VFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpdGVtcy5cbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFRhYkl0ZW1EaXJlY3RpdmUpXG4gICAgcHVibGljIGl0ZW1zOiBRdWVyeUxpc3Q8SWd4VGFiSXRlbURpcmVjdGl2ZT47XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzZWxlY3RlZCBpdGVtLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRJdGVtKCk6IElneFRhYkl0ZW1EaXJlY3RpdmUge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcyAmJiB0aGlzLnNlbGVjdGVkSW5kZXggPj0gMCAmJiB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCA/XG4gICAgICAgICAgICB0aGlzLml0ZW1zLmdldCh0aGlzLnNlbGVjdGVkSW5kZXgpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4VGFiQ29udGVudEJhc2UsIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgICBwdWJsaWMgcGFuZWxzOiBRdWVyeUxpc3Q8SWd4VGFiQ29udGVudEJhc2U+O1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgX2Rpc2FibGVBbmltYXRpb24gPSBmYWxzZTtcbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHByb3RlY3RlZCBjdXJyZW50SXRlbTogSWd4VGFiSXRlbURpcmVjdGl2ZTtcbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHByb3RlY3RlZCBwcmV2aW91c0l0ZW06IElneFRhYkl0ZW1EaXJlY3RpdmU7XG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgY29tcG9uZW50TmFtZTogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgIHByaXZhdGUgX2l0ZW1DaGFuZ2VzJDogU3Vic2NyaXB0aW9uO1xuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBjb25zdHJ1Y3RvcihidWlsZGVyOiBBbmltYXRpb25CdWlsZGVyLCBjZHI6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgZGlyOiBJZ3hEaXJlY3Rpb25hbGl0eSkge1xuICAgICAgICBzdXBlcihidWlsZGVyLCBjZHIpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNTZWxlY3RlZFRhYiA9IHRoaXMuaXRlbXMuc29tZSgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRhYi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYi5zZWxlY3RlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWhhc1NlbGVjdGVkVGFiICYmIHRoaXMuaGFzUGFuZWxzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2UgcHJvbWlzZSB0byBhdm9pZCBleHByZXNzaW9uIGNoYW5nZWQgYWZ0ZXIgY2hlY2sgZXJyb3JcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVGFicyhudWxsLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2l0ZW1DaGFuZ2VzJCA9IHRoaXMuaXRlbXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkl0ZW1DaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5faXRlbUNoYW5nZXMkKSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtQ2hhbmdlcyQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIHNlbGVjdFRhYih0YWI6IElneFRhYkl0ZW1EaXJlY3RpdmUsIHNlbGVjdGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFicyA9IHRoaXMuaXRlbXMudG9BcnJheSgpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0YWJzLmluZGV4T2YodGFiKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGFicy5ldmVyeSh0ID0+ICF0LnNlbGVjdGVkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgZ2V0UHJldmlvdXNFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXNJdGVtLnBhbmVsQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgZ2V0Q3VycmVudEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SXRlbS5wYW5lbENvbXBvbmVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIHNjcm9sbFRhYkhlYWRlckludG9WaWV3KCkge1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIG9uSXRlbUNoYW5nZXMoKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIHNlbGVjdGVkIHRhYlxuICAgICAgICBsZXQgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICB0aGlzLml0ZW1zLnNvbWUoKHRhYiwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRhYi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhYi5zZWxlY3RlZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgLy8gU2V0IHRoZSBzZWxlY3RlZCBpbmRleCB0byB0aGUgdGFiIHRoYXQgaGFzIHNlbGVjdGVkPXRydWVcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gMCAmJiB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdCB0aGUgdGFiIG9uIHRoZSBzYW1lIGluZGV4IHRoZSBwcmV2aW91cyBzZWxlY3RlZCB0YWIgd2FzXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRUYWJzKG51bGwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3QgdGhlIGxhc3QgdGFiXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0QXR0cmlidXRlcygpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ucGFuZWxDb21wb25lbnQgJiYgIWl0ZW0uaGVhZGVyQ29tcG9uZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldE5leHRUYWJJZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhYkhlYWRlcklkID0gYCR7dGhpcy5jb21wb25lbnROYW1lfS1oZWFkZXItJHtpZH1gO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhYlBhbmVsSWQgPSBgJHt0aGlzLmNvbXBvbmVudE5hbWV9LWNvbnRlbnQtJHtpZH1gO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkZXJBdHRyaWJ1dGUoaXRlbSwgJ2lkJywgdGFiSGVhZGVySWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SGVhZGVyQXR0cmlidXRlKGl0ZW0sICdhcmlhLWNvbnRyb2xzJywgdGFiUGFuZWxJZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQYW5lbEF0dHJpYnV0ZShpdGVtLCAnaWQnLCB0YWJQYW5lbElkKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBhbmVsQXR0cmlidXRlKGl0ZW0sICdhcmlhLWxhYmVsbGVkYnknLCB0YWJIZWFkZXJJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SGVhZGVyQXR0cmlidXRlKGl0ZW06IElneFRhYkl0ZW1EaXJlY3RpdmUsIGF0dHJOYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaXRlbS5oZWFkZXJDb21wb25lbnQubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFBhbmVsQXR0cmlidXRlKGl0ZW06IElneFRhYkl0ZW1EaXJlY3RpdmUsIGF0dHJOYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaXRlbS5wYW5lbENvbXBvbmVudC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGhhc1BhbmVscygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxzICYmIHRoaXMucGFuZWxzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNlbGVjdGVkVGFicyhvbGRTZWxlY3RlZEluZGV4OiBudW1iZXIsIHJhaXNlRXZlbnQgPSB0cnVlKSB7XG4gICAgICAgIGlmICghdGhpcy5pdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1RhYjogSWd4VGFiSXRlbURpcmVjdGl2ZTtcbiAgICAgICAgY29uc3Qgb2xkVGFiID0gdGhpcy5jdXJyZW50SXRlbTtcblxuICAgICAgICAvLyBGaXJzdCBzZWxlY3QgdGhlIG5ldyB0YWJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggPj0gMCAmJiB0aGlzLl9zZWxlY3RlZEluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld1RhYiA9IHRoaXMuaXRlbXMuZ2V0KHRoaXMuX3NlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgbmV3VGFiLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGVuIHVuc2VsZWN0IHRoZSBvdGhlciB0YWJzXG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gdGhpcy5fc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgICAgIHRhYi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPT0gb2xkU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUYWJIZWFkZXJJbnRvVmlldygpO1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyUGFuZWxBbmltYXRpb25zKG9sZFNlbGVjdGVkSW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAocmFpc2VFdmVudCAmJiBuZXdUYWIgIT09IG9sZFRhYikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbTogbmV3VGFiLFxuICAgICAgICAgICAgICAgICAgICBvbGRJdGVtOiBvbGRUYWJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdHJpZ2dlclBhbmVsQW5pbWF0aW9ucyhvbGRTZWxlY3RlZEluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXMuZ2V0KHRoaXMuX3NlbGVjdGVkSW5kZXgpO1xuXG4gICAgICAgIGlmIChpdGVtICYmXG4gICAgICAgICAgICAhdGhpcy5kaXNhYmxlQW5pbWF0aW9uICYmXG4gICAgICAgICAgICB0aGlzLmhhc1BhbmVscyAmJlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SXRlbSAmJlxuICAgICAgICAgICAgIXRoaXMuY3VycmVudEl0ZW0uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGl0ZW0uZGlyZWN0aW9uID0gKCF0aGlzLmRpci5ydGwgJiYgdGhpcy5fc2VsZWN0ZWRJbmRleCA+IG9sZFNlbGVjdGVkSW5kZXgpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuZGlyLnJ0bCAmJiB0aGlzLl9zZWxlY3RlZEluZGV4IDwgb2xkU2VsZWN0ZWRJbmRleClcbiAgICAgICAgICAgICAgICA/IERpcmVjdGlvbi5ORVhUIDogRGlyZWN0aW9uLlBSRVY7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnByZXZpb3VzSXRlbSAmJiB0aGlzLnByZXZpb3VzSXRlbS5wcmV2aW91cykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNJdGVtLnByZXZpb3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJdGVtLmRpcmVjdGlvbiA9IGl0ZW0uZGlyZWN0aW9uO1xuXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzSXRlbSA9IHRoaXMuY3VycmVudEl0ZW07XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFuaW1hdGlvbnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEl0ZW0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0TmV4dFRhYklkKCk7XG59XG4iXX0=