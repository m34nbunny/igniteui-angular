import { IgxGridNavigationService } from '../grid-navigation.service';
import { Injectable } from '@angular/core';
import { HEADER_KEYS } from '../../core/utils';
import * as i0 from "@angular/core";
export class IgxPivotGridNavigationService extends IgxGridNavigationService {
    get lastRowDimensionsIndex() {
        return this.grid.rowDimensions.length - 1;
    }
    focusOutRowHeader() {
        this.isRowHeaderActive = false;
    }
    handleNavigation(event) {
        if (this.isRowHeaderActive) {
            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey;
            if (!HEADER_KEYS.has(key)) {
                return;
            }
            event.preventDefault();
            const newActiveNode = {
                row: this.activeNode.row, column: this.activeNode.column, level: null,
                mchCache: null,
                layout: null
            };
            if ((key.includes('left') || key === 'home') && this.activeNode.column > 0) {
                newActiveNode.column = ctrl || key === 'home' ? 0 : this.activeNode.column - 1;
            }
            if ((key.includes('right') || key === 'end') && this.activeNode.column < this.lastRowDimensionsIndex) {
                newActiveNode.column = ctrl || key === 'end' ? this.lastRowDimensionsIndex : this.activeNode.column + 1;
            }
            const verticalContainer = this.grid.verticalRowDimScrollContainers.toArray()[newActiveNode.column];
            if ((key.includes('up')) && this.activeNode.row > 0) {
                newActiveNode.row = ctrl ? 0 : this.activeNode.row - 1;
            }
            if ((key.includes('down')) && this.activeNode.row < this.findLastDataRowIndex()) {
                newActiveNode.row = ctrl ? verticalContainer.igxForOf.length - 1 : Math.min(this.activeNode.row + 1, verticalContainer.igxForOf.length - 1);
            }
            if (key.includes('left') || key.includes('right')) {
                const prevRIndex = this.activeNode.row;
                const prevScrContainer = this.grid.verticalRowDimScrollContainers.toArray()[this.activeNode.column];
                const src = prevScrContainer.getScrollForIndex(prevRIndex);
                newActiveNode.row = this.activeNode.mchCache && this.activeNode.mchCache.level === newActiveNode.column ?
                    this.activeNode.mchCache.visibleIndex :
                    verticalContainer.getIndexAtScroll(src);
                newActiveNode.mchCache = {
                    visibleIndex: this.activeNode.row,
                    level: this.activeNode.column
                };
            }
            this.setActiveNode(newActiveNode);
            if (verticalContainer.isIndexOutsideView(newActiveNode.row)) {
                verticalContainer.scrollTo(newActiveNode.row);
            }
        }
        else {
            super.handleNavigation(event);
        }
    }
    focusTbody(event) {
        if (!this.activeNode || this.activeNode.row === null || this.activeNode.row === undefined) {
            this.activeNode = this.lastActiveNode;
        }
        else {
            super.focusTbody(event);
        }
    }
}
IgxPivotGridNavigationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridNavigationService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
IgxPivotGridNavigationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridNavigationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxPivotGridNavigationService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl2b3QtZ3JpZC1uYXZpZ2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvcGl2b3QtZ3JpZC9waXZvdC1ncmlkLW5hdmlnYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7QUFHL0MsTUFBTSxPQUFPLDZCQUE4QixTQUFRLHdCQUF3QjtJQUt2RSxJQUFXLHNCQUFzQjtRQUM3QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLGlCQUFpQjtRQUNwQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQ25DLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxLQUFvQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUN4QixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLE9BQU87YUFDVjtZQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixNQUFNLGFBQWEsR0FBRztnQkFDbEIsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSTtn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QUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTtpQkFDaEMsQ0FBQzthQUNMO1lBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsQyxJQUFJLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDekQsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqRDtTQUNKO2FBQU07WUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQUs7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUN2RixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDekM7YUFBTTtZQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7SUFDTCxDQUFDOzswSEFyRVEsNkJBQTZCOzhIQUE3Qiw2QkFBNkI7MkZBQTdCLDZCQUE2QjtrQkFEekMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElneEdyaWROYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4uL2dyaWQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElneFBpdm90R3JpZENvbXBvbmVudCB9IGZyb20gJy4vcGl2b3QtZ3JpZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSEVBREVSX0tFWVMgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIElneFBpdm90R3JpZE5hdmlnYXRpb25TZXJ2aWNlIGV4dGVuZHMgSWd4R3JpZE5hdmlnYXRpb25TZXJ2aWNlIHtcbiAgICBwdWJsaWMgZ3JpZDogSWd4UGl2b3RHcmlkQ29tcG9uZW50O1xuXG4gICAgcHVibGljIGlzUm93SGVhZGVyQWN0aXZlOiBib29sZWFuO1xuXG4gICAgcHVibGljIGdldCBsYXN0Um93RGltZW5zaW9uc0luZGV4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkLnJvd0RpbWVuc2lvbnMubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZm9jdXNPdXRSb3dIZWFkZXIoKSB7XG4gICAgICAgIHRoaXMuaXNSb3dIZWFkZXJBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlTmF2aWdhdGlvbihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc1Jvd0hlYWRlckFjdGl2ZSkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gZXZlbnQua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBjdHJsID0gZXZlbnQuY3RybEtleTtcbiAgICAgICAgICAgIGlmICghSEVBREVSX0tFWVMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdBY3RpdmVOb2RlID0ge1xuICAgICAgICAgICAgICAgIHJvdzogdGhpcy5hY3RpdmVOb2RlLnJvdywgY29sdW1uOiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uLCBsZXZlbDogbnVsbCxcbiAgICAgICAgICAgICAgICBtY2hDYWNoZTogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXlvdXQ6IG51bGxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChrZXkuaW5jbHVkZXMoJ2xlZnQnKSB8fCBrZXkgPT09ICdob21lJykgJiYgdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiA+IDApIHtcbiAgICAgICAgICAgICAgICBuZXdBY3RpdmVOb2RlLmNvbHVtbiA9IGN0cmwgfHwga2V5ID09PSAnaG9tZScgPyAwIDogdGhpcy5hY3RpdmVOb2RlLmNvbHVtbiAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGtleS5pbmNsdWRlcygncmlnaHQnKSB8fCBrZXkgPT09ICdlbmQnKSAmJiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uIDwgdGhpcy5sYXN0Um93RGltZW5zaW9uc0luZGV4KSB7XG4gICAgICAgICAgICAgICAgbmV3QWN0aXZlTm9kZS5jb2x1bW4gPSBjdHJsIHx8IGtleSA9PT0gJ2VuZCcgPyB0aGlzLmxhc3RSb3dEaW1lbnNpb25zSW5kZXggOiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZlcnRpY2FsQ29udGFpbmVyID0gdGhpcy5ncmlkLnZlcnRpY2FsUm93RGltU2Nyb2xsQ29udGFpbmVycy50b0FycmF5KClbbmV3QWN0aXZlTm9kZS5jb2x1bW5dO1xuICAgICAgICAgICAgaWYgKChrZXkuaW5jbHVkZXMoJ3VwJykpICYmIHRoaXMuYWN0aXZlTm9kZS5yb3cgPiAwKSB7XG4gICAgICAgICAgICAgICAgbmV3QWN0aXZlTm9kZS5yb3cgPSBjdHJsID8gMCA6IHRoaXMuYWN0aXZlTm9kZS5yb3cgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChrZXkuaW5jbHVkZXMoJ2Rvd24nKSkgJiYgdGhpcy5hY3RpdmVOb2RlLnJvdyA8IHRoaXMuZmluZExhc3REYXRhUm93SW5kZXgoKSkge1xuICAgICAgICAgICAgICAgIG5ld0FjdGl2ZU5vZGUucm93ID0gY3RybCA/IHZlcnRpY2FsQ29udGFpbmVyLmlneEZvck9mLmxlbmd0aCAtIDEgOiBNYXRoLm1pbih0aGlzLmFjdGl2ZU5vZGUucm93ICsgMSwgdmVydGljYWxDb250YWluZXIuaWd4Rm9yT2YubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChrZXkuaW5jbHVkZXMoJ2xlZnQnKSB8fCBrZXkuaW5jbHVkZXMoJ3JpZ2h0JykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2UkluZGV4ID0gdGhpcy5hY3RpdmVOb2RlLnJvdztcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2U2NyQ29udGFpbmVyID0gdGhpcy5ncmlkLnZlcnRpY2FsUm93RGltU2Nyb2xsQ29udGFpbmVycy50b0FycmF5KClbdGhpcy5hY3RpdmVOb2RlLmNvbHVtbl07XG4gICAgICAgICAgICAgICAgY29uc3Qgc3JjID0gcHJldlNjckNvbnRhaW5lci5nZXRTY3JvbGxGb3JJbmRleChwcmV2UkluZGV4KTtcbiAgICAgICAgICAgICAgICBuZXdBY3RpdmVOb2RlLnJvdyA9IHRoaXMuYWN0aXZlTm9kZS5tY2hDYWNoZSAmJiB0aGlzLmFjdGl2ZU5vZGUubWNoQ2FjaGUubGV2ZWwgPT09IG5ld0FjdGl2ZU5vZGUuY29sdW1uID9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVOb2RlLm1jaENhY2hlLnZpc2libGVJbmRleCA6XG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsQ29udGFpbmVyLmdldEluZGV4QXRTY3JvbGwoc3JjKTtcbiAgICAgICAgICAgICAgICBuZXdBY3RpdmVOb2RlLm1jaENhY2hlID0ge1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlSW5kZXg6IHRoaXMuYWN0aXZlTm9kZS5yb3csXG4gICAgICAgICAgICAgICAgICAgIGxldmVsOiB0aGlzLmFjdGl2ZU5vZGUuY29sdW1uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlTm9kZShuZXdBY3RpdmVOb2RlKTtcbiAgICAgICAgICAgIGlmICh2ZXJ0aWNhbENvbnRhaW5lci5pc0luZGV4T3V0c2lkZVZpZXcobmV3QWN0aXZlTm9kZS5yb3cpKSB7XG4gICAgICAgICAgICAgICAgdmVydGljYWxDb250YWluZXIuc2Nyb2xsVG8obmV3QWN0aXZlTm9kZS5yb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIuaGFuZGxlTmF2aWdhdGlvbihldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZm9jdXNUYm9keShldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlTm9kZSB8fCB0aGlzLmFjdGl2ZU5vZGUucm93ID09PSBudWxsIHx8IHRoaXMuYWN0aXZlTm9kZS5yb3cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVOb2RlID0gdGhpcy5sYXN0QWN0aXZlTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLmZvY3VzVGJvZHkoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19