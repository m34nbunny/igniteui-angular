import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxComboAPIService {
    constructor() {
        this.disableTransitions = false;
    }
    get valueKey() {
        return this.combo.valueKey !== null && this.combo.valueKey !== undefined ? this.combo.valueKey : null;
    }
    get item_focusable() {
        return false;
    }
    get isRemote() {
        return this.combo.isRemote;
    }
    get comboID() {
        return this.combo.id;
    }
    register(combo) {
        this.combo = combo;
    }
    clear() {
        this.combo = null;
    }
    add_custom_item() {
        if (!this.combo) {
            return;
        }
        this.combo.addItemToCollection();
    }
    set_selected_item(itemID, event) {
        const selected = this.combo.isItemSelected(itemID);
        if (!itemID && itemID !== 0) {
            return;
        }
        if (!selected) {
            this.combo.select([itemID], false, event);
        }
        else {
            this.combo.deselect([itemID], event);
        }
    }
    is_item_selected(itemID) {
        return this.combo.isItemSelected(itemID);
    }
}
IgxComboAPIService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboAPIService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IgxComboAPIService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboAPIService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxComboAPIService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm8uYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2NvbWJvL2NvbWJvLmFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUUzQzs7R0FFRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFFVyx1QkFBa0IsR0FBRyxLQUFLLENBQUM7S0FnRHJDO0lBN0NHLElBQVcsUUFBUTtRQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMxRyxDQUFDO0lBRUQsSUFBVyxjQUFjO1FBQ3JCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxJQUFXLFFBQVE7UUFDZixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQy9CLENBQUM7SUFFRCxJQUFXLE9BQU87UUFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBbUI7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVNLEtBQUs7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRU0sZUFBZTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNiLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRU0saUJBQWlCLENBQUMsTUFBVyxFQUFFLEtBQWE7UUFDL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3QzthQUFNO1lBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN4QztJQUNMLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxNQUFXO1FBQy9CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7K0dBaERRLGtCQUFrQjttSEFBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZ3hDb21ib0Jhc2UgfSBmcm9tICcuL2NvbWJvLmNvbW1vbic7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSWd4Q29tYm9BUElTZXJ2aWNlIHtcbiAgICBwdWJsaWMgZGlzYWJsZVRyYW5zaXRpb25zID0gZmFsc2U7XG4gICAgcHJvdGVjdGVkIGNvbWJvOiBJZ3hDb21ib0Jhc2U7XG5cbiAgICBwdWJsaWMgZ2V0IHZhbHVlS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21iby52YWx1ZUtleSAhPT0gbnVsbCAmJiB0aGlzLmNvbWJvLnZhbHVlS2V5ICE9PSB1bmRlZmluZWQgPyB0aGlzLmNvbWJvLnZhbHVlS2V5IDogbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGl0ZW1fZm9jdXNhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgaXNSZW1vdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbWJvLmlzUmVtb3RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY29tYm9JRCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21iby5pZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXIoY29tYm86IElneENvbWJvQmFzZSkge1xuICAgICAgICB0aGlzLmNvbWJvID0gY29tYm87XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbWJvID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkX2N1c3RvbV9pdGVtKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY29tYm8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbWJvLmFkZEl0ZW1Ub0NvbGxlY3Rpb24oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0X3NlbGVjdGVkX2l0ZW0oaXRlbUlEOiBhbnksIGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmNvbWJvLmlzSXRlbVNlbGVjdGVkKGl0ZW1JRCk7XG4gICAgICAgIGlmICghaXRlbUlEICYmIGl0ZW1JRCAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29tYm8uc2VsZWN0KFtpdGVtSURdLCBmYWxzZSwgZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb21iby5kZXNlbGVjdChbaXRlbUlEXSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGlzX2l0ZW1fc2VsZWN0ZWQoaXRlbUlEOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tYm8uaXNJdGVtU2VsZWN0ZWQoaXRlbUlEKTtcbiAgICB9XG59XG4iXX0=