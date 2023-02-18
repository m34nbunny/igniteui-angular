import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { GridBaseAPIService } from '../api.service';
import * as i0 from "@angular/core";
export class IgxHierarchicalGridAPIService extends GridBaseAPIService {
    constructor() {
        super(...arguments);
        this.childRowIslands = new Map();
        this.childGrids = new Map();
    }
    registerChildRowIsland(rowIsland) {
        this.childRowIslands.set(rowIsland.key, rowIsland);
        this.destroyMap.set(rowIsland.key, new Subject());
    }
    unsetChildRowIsland(rowIsland) {
        this.childGrids.delete(rowIsland.key);
        this.childRowIslands.delete(rowIsland.key);
        this.destroyMap.delete(rowIsland.key);
    }
    getChildRowIsland(key) {
        return this.childRowIslands.get(key);
    }
    getChildGrid(path) {
        const currPath = path;
        let grid;
        const pathElem = currPath.shift();
        const childrenForLayout = this.childGrids.get(pathElem.rowIslandKey);
        if (childrenForLayout) {
            const childGrid = childrenForLayout.get(pathElem.rowID);
            if (currPath.length === 0) {
                grid = childGrid;
            }
            else {
                grid = childGrid.gridAPI.getChildGrid(currPath);
            }
        }
        return grid;
    }
    getChildGrids(inDepth) {
        const allChildren = [];
        this.childGrids.forEach((layoutMap) => {
            layoutMap.forEach((grid) => {
                allChildren.push(grid);
                if (inDepth) {
                    const children = grid.gridAPI.getChildGrids(inDepth);
                    children.forEach((item) => {
                        allChildren.push(item);
                    });
                }
            });
        });
        return allChildren;
    }
    getParentRowId(childGrid) {
        let rowID;
        this.childGrids.forEach((layoutMap) => {
            layoutMap.forEach((grid, key) => {
                if (grid === childGrid) {
                    rowID = key;
                    return;
                }
            });
        });
        return rowID;
    }
    registerChildGrid(parentRowID, rowIslandKey, grid) {
        let childrenForLayout = this.childGrids.get(rowIslandKey);
        if (!childrenForLayout) {
            this.childGrids.set(rowIslandKey, new Map());
            childrenForLayout = this.childGrids.get(rowIslandKey);
        }
        childrenForLayout.set(parentRowID, grid);
    }
    getChildGridsForRowIsland(rowIslandKey) {
        const childrenForLayout = this.childGrids.get(rowIslandKey);
        const children = [];
        if (childrenForLayout) {
            childrenForLayout.forEach((child) => {
                children.push(child);
            });
        }
        return children;
    }
    getChildGridByID(rowIslandKey, rowID) {
        const childrenForLayout = this.childGrids.get(rowIslandKey);
        return childrenForLayout.get(rowID);
    }
    get_row_expansion_state(record) {
        let inState;
        if (record.childGridsData !== undefined) {
            const ri = record.key;
            const states = this.grid.expansionStates;
            const expanded = states.get(ri);
            if (expanded !== undefined) {
                return expanded;
            }
            else {
                return this.grid.getDefaultExpandState(record);
            }
        }
        else {
            inState = !!super.get_row_expansion_state(record);
        }
        return inState && this.grid.childLayoutList.length !== 0;
    }
    allow_expansion_state_change(rowID, expanded) {
        const rec = this.get_rec_by_id(rowID);
        const grid = this.grid;
        if (grid.hasChildrenKey && !rec[grid.hasChildrenKey]) {
            return false;
        }
        return !!rec && this.grid.expansionStates.get(rowID) !== expanded;
    }
    get_rec_by_id(rowID) {
        const data = this.get_all_data(false);
        const index = this.get_row_index_in_data(rowID, data);
        return data[index];
    }
}
IgxHierarchicalGridAPIService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridAPIService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
IgxHierarchicalGridAPIService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridAPIService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHierarchicalGridAPIService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGllcmFyY2hpY2FsLWdyaWQtYXBpLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvaGllcmFyY2hpY2FsLWdyaWQvaGllcmFyY2hpY2FsLWdyaWQtYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUdwRCxNQUFNLE9BQU8sNkJBQThCLFNBQVEsa0JBQTRCO0lBRC9FOztRQUVjLG9CQUFlLEdBQXVDLElBQUksR0FBRyxFQUFpQyxDQUFDO1FBQy9GLGVBQVUsR0FDaEIsSUFBSSxHQUFHLEVBQThCLENBQUM7S0F1SDdDO0lBckhVLHNCQUFzQixDQUFDLFNBQWdDO1FBQzFELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLE9BQU8sRUFBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLG1CQUFtQixDQUFDLFNBQWdDO1FBQ3ZELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxHQUFXO1FBQ2hD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LENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLElBQVksQ0FBQztRQUNoQyxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ2xELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLENBQUM7SUFDdEUsQ0FBQztJQUVNLGFBQWEsQ0FBQyxLQUFLO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixDQUFDOzswSEF6SFEsNkJBQTZCOzhIQUE3Qiw2QkFBNkI7MkZBQTdCLDZCQUE2QjtrQkFEekMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElneFJvd0lzbGFuZENvbXBvbmVudCB9IGZyb20gJy4vcm93LWlzbGFuZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgR3JpZFR5cGUsIElQYXRoU2VnbWVudCB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkQmFzZUFQSVNlcnZpY2UgfSBmcm9tICcuLi9hcGkuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJZ3hIaWVyYXJjaGljYWxHcmlkQVBJU2VydmljZSBleHRlbmRzIEdyaWRCYXNlQVBJU2VydmljZTxHcmlkVHlwZT4ge1xuICAgIHByb3RlY3RlZCBjaGlsZFJvd0lzbGFuZHM6IE1hcDxzdHJpbmcsIElneFJvd0lzbGFuZENvbXBvbmVudD4gPSBuZXcgTWFwPHN0cmluZywgSWd4Um93SXNsYW5kQ29tcG9uZW50PigpO1xuICAgIHByb3RlY3RlZCBjaGlsZEdyaWRzOiBNYXA8c3RyaW5nLCBNYXA8YW55LCBHcmlkVHlwZT4+ID1cbiAgICAgICAgbmV3IE1hcDxzdHJpbmcsIE1hcDxhbnksIEdyaWRUeXBlPj4oKTtcblxuICAgIHB1YmxpYyByZWdpc3RlckNoaWxkUm93SXNsYW5kKHJvd0lzbGFuZDogSWd4Um93SXNsYW5kQ29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuY2hpbGRSb3dJc2xhbmRzLnNldChyb3dJc2xhbmQua2V5LCByb3dJc2xhbmQpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lNYXAuc2V0KHJvd0lzbGFuZC5rZXksIG5ldyBTdWJqZWN0PGJvb2xlYW4+KCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1bnNldENoaWxkUm93SXNsYW5kKHJvd0lzbGFuZDogSWd4Um93SXNsYW5kQ29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuY2hpbGRHcmlkcy5kZWxldGUocm93SXNsYW5kLmtleSk7XG4gICAgICAgIHRoaXMuY2hpbGRSb3dJc2xhbmRzLmRlbGV0ZShyb3dJc2xhbmQua2V5KTtcbiAgICAgICAgdGhpcy5kZXN0cm95TWFwLmRlbGV0ZShyb3dJc2xhbmQua2V5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2hpbGRSb3dJc2xhbmQoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRSb3dJc2xhbmRzLmdldChrZXkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDaGlsZEdyaWQocGF0aDogQXJyYXk8SVBhdGhTZWdtZW50Pikge1xuICAgICAgICBjb25zdCBjdXJyUGF0aCA9IHBhdGg7XG4gICAgICAgIGxldCBncmlkO1xuICAgICAgICBjb25zdCBwYXRoRWxlbSA9IGN1cnJQYXRoLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuRm9yTGF5b3V0ID0gdGhpcy5jaGlsZEdyaWRzLmdldChwYXRoRWxlbS5yb3dJc2xhbmRLZXkpO1xuICAgICAgICBpZiAoY2hpbGRyZW5Gb3JMYXlvdXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkR3JpZCA9IGNoaWxkcmVuRm9yTGF5b3V0LmdldChwYXRoRWxlbS5yb3dJRCk7XG4gICAgICAgICAgICBpZiAoY3VyclBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZ3JpZCA9IGNoaWxkR3JpZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ3JpZCA9IGNoaWxkR3JpZC5ncmlkQVBJLmdldENoaWxkR3JpZChjdXJyUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENoaWxkR3JpZHMoaW5EZXB0aD86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgYWxsQ2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5jaGlsZEdyaWRzLmZvckVhY2goKGxheW91dE1hcCkgPT4ge1xuICAgICAgICAgICAgbGF5b3V0TWFwLmZvckVhY2goKGdyaWQpID0+IHtcbiAgICAgICAgICAgICAgICBhbGxDaGlsZHJlbi5wdXNoKGdyaWQpO1xuICAgICAgICAgICAgICAgIGlmIChpbkRlcHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gZ3JpZC5ncmlkQVBJLmdldENoaWxkR3JpZHMoaW5EZXB0aCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbENoaWxkcmVuLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWxsQ2hpbGRyZW47XG4gICAgfVxuXG4gICAgcHVibGljIGdldFBhcmVudFJvd0lkKGNoaWxkR3JpZDogR3JpZFR5cGUpIHtcbiAgICAgICAgbGV0IHJvd0lEO1xuICAgICAgICB0aGlzLmNoaWxkR3JpZHMuZm9yRWFjaCgobGF5b3V0TWFwKSA9PiB7XG4gICAgICAgICAgICBsYXlvdXRNYXAuZm9yRWFjaCgoZ3JpZCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGdyaWQgPT09IGNoaWxkR3JpZCkge1xuICAgICAgICAgICAgICAgICAgICByb3dJRCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJvd0lEO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3RlckNoaWxkR3JpZChwYXJlbnRSb3dJRDogYW55LCByb3dJc2xhbmRLZXk6IHN0cmluZywgZ3JpZDogR3JpZFR5cGUpIHtcbiAgICAgICAgbGV0IGNoaWxkcmVuRm9yTGF5b3V0ID0gdGhpcy5jaGlsZEdyaWRzLmdldChyb3dJc2xhbmRLZXkpO1xuICAgICAgICBpZiAoIWNoaWxkcmVuRm9yTGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkR3JpZHMuc2V0KHJvd0lzbGFuZEtleSwgbmV3IE1hcDxhbnksIEdyaWRUeXBlPigpKTtcbiAgICAgICAgICAgIGNoaWxkcmVuRm9yTGF5b3V0ID0gdGhpcy5jaGlsZEdyaWRzLmdldChyb3dJc2xhbmRLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuRm9yTGF5b3V0LnNldChwYXJlbnRSb3dJRCwgZ3JpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENoaWxkR3JpZHNGb3JSb3dJc2xhbmQocm93SXNsYW5kS2V5OiBzdHJpbmcpOiBHcmlkVHlwZVtdIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW5Gb3JMYXlvdXQgPSB0aGlzLmNoaWxkR3JpZHMuZ2V0KHJvd0lzbGFuZEtleSk7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgICAgIGlmIChjaGlsZHJlbkZvckxheW91dCkge1xuICAgICAgICAgICAgY2hpbGRyZW5Gb3JMYXlvdXQuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q2hpbGRHcmlkQnlJRChyb3dJc2xhbmRLZXksIHJvd0lEKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuRm9yTGF5b3V0ID0gdGhpcy5jaGlsZEdyaWRzLmdldChyb3dJc2xhbmRLZXkpO1xuICAgICAgICByZXR1cm4gY2hpbGRyZW5Gb3JMYXlvdXQuZ2V0KHJvd0lEKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X3Jvd19leHBhbnNpb25fc3RhdGUocmVjb3JkOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGluU3RhdGU7XG4gICAgICAgIGlmIChyZWNvcmQuY2hpbGRHcmlkc0RhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcmkgPSByZWNvcmQua2V5O1xuICAgICAgICAgICAgY29uc3Qgc3RhdGVzID0gdGhpcy5ncmlkLmV4cGFuc2lvblN0YXRlcztcbiAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkID0gc3RhdGVzLmdldChyaSk7XG4gICAgICAgICAgICBpZiAoZXhwYW5kZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHBhbmRlZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZC5nZXREZWZhdWx0RXhwYW5kU3RhdGUocmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluU3RhdGUgPSAhIXN1cGVyLmdldF9yb3dfZXhwYW5zaW9uX3N0YXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluU3RhdGUgJiYgKHRoaXMuZ3JpZCBhcyBhbnkpLmNoaWxkTGF5b3V0TGlzdC5sZW5ndGggIT09IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFsbG93X2V4cGFuc2lvbl9zdGF0ZV9jaGFuZ2Uocm93SUQsIGV4cGFuZGVkKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHJlYyA9IHRoaXMuZ2V0X3JlY19ieV9pZChyb3dJRCk7XG4gICAgICAgIGNvbnN0IGdyaWQgPSAodGhpcy5ncmlkIGFzIGFueSk7XG4gICAgICAgIGlmIChncmlkLmhhc0NoaWxkcmVuS2V5ICYmICFyZWNbZ3JpZC5oYXNDaGlsZHJlbktleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gISFyZWMgJiYgdGhpcy5ncmlkLmV4cGFuc2lvblN0YXRlcy5nZXQocm93SUQpICE9PSBleHBhbmRlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0X3JlY19ieV9pZChyb3dJRCk6IGFueSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldF9hbGxfZGF0YShmYWxzZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRfcm93X2luZGV4X2luX2RhdGEocm93SUQsIGRhdGEpO1xuICAgICAgICByZXR1cm4gZGF0YVtpbmRleF07XG4gICAgfVxufVxuIl19