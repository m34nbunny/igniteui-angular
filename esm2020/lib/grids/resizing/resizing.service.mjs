import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @hidden
 * @internal
 */
export class IgxColumnResizingService {
    constructor(zone) {
        this.zone = zone;
        /**
         * @hidden
         */
        this.resizeCursor = null;
        /**
         * @hidden
         */
        this.showResizer = false;
    }
    /**
     * @hidden
     */
    getColumnHeaderRenderedWidth() {
        return this.column.headerCell.nativeElement.getBoundingClientRect().width;
    }
    /**
     * @hidden
     */
    get resizerHeight() {
        let height = this.column.grid.getVisibleContentHeight();
        // Column height multiplier in case there are Column Layouts. The resizer height need to take into account rowStart.
        let columnHeightMultiplier = 1;
        if (this.column.columnLayoutChild) {
            columnHeightMultiplier = this.column.grid.multiRowLayoutRowSize - this.column.rowStart + 1;
        }
        if (this.column.level !== 0) {
            height -= this.column.topLevelParent.headerGroup.height - this.column.headerGroup.height * columnHeightMultiplier;
        }
        return height;
    }
    /**
     * Returns the minimal possible width to which the column can be resized.
     */
    get restrictResizeMin() {
        const actualWidth = this.getColumnHeaderRenderedWidth();
        const minWidth = this.column.minWidthPx < actualWidth ? this.column.minWidthPx : actualWidth;
        return actualWidth - minWidth;
    }
    /**
     * Returns the maximal possible width to which the column can be resized.
     */
    get restrictResizeMax() {
        const actualWidth = this.getColumnHeaderRenderedWidth();
        const maxWidth = this.column.maxWidthPx;
        if (this.column.maxWidth) {
            return maxWidth - actualWidth;
        }
        else {
            return Number.MAX_SAFE_INTEGER;
        }
    }
    /**
     * Autosizes the column to the longest currently visible cell value, including the header cell.
     * If the column has a predifined maxWidth and the autosized column width will become bigger than it,
     * then the column is sized to its maxWidth.
     */
    autosizeColumnOnDblClick() {
        const currentColWidth = this.getColumnHeaderRenderedWidth();
        this.column.width = this.column.getAutoSize();
        this.zone.run(() => { });
        this.column.grid.columnResized.emit({
            column: this.column,
            prevWidth: currentColWidth.toString(),
            newWidth: this.column.width
        });
    }
    /**
     * Resizes the column regaridng to the column minWidth and maxWidth.
     */
    resizeColumn(event) {
        this.showResizer = false;
        const diff = event.clientX - this.startResizePos;
        const colWidth = this.column.width;
        const isPercentageWidth = colWidth && typeof colWidth === 'string' && colWidth.indexOf('%') !== -1;
        let currentColWidth = parseFloat(colWidth);
        const actualWidth = this.getColumnHeaderRenderedWidth();
        currentColWidth = Number.isNaN(currentColWidth) ? parseFloat(actualWidth) : currentColWidth;
        if (this.column.grid.hasColumnLayouts) {
            this.resizeColumnLayoutFor(this.column, diff);
        }
        else if (isPercentageWidth) {
            this._handlePercentageResize(diff, this.column);
        }
        else {
            this._handlePixelResize(diff, this.column);
        }
        this.zone.run(() => { });
        if (currentColWidth !== parseFloat(this.column.width)) {
            this.column.grid.columnResized.emit({
                column: this.column,
                prevWidth: isPercentageWidth ? currentColWidth + '%' : currentColWidth + 'px',
                newWidth: this.column.width
            });
        }
        this.isColumnResizing = false;
    }
    _handlePixelResize(diff, column) {
        const currentColWidth = parseFloat(column.width);
        const colMinWidth = column.minWidthPx;
        const colMaxWidth = column.maxWidthPx;
        if (currentColWidth + diff < colMinWidth) {
            column.width = colMinWidth + 'px';
        }
        else if (colMaxWidth && (currentColWidth + diff > colMaxWidth)) {
            column.width = colMaxWidth + 'px';
        }
        else {
            column.width = (currentColWidth + diff) + 'px';
        }
    }
    _handlePercentageResize(diff, column) {
        const currentPercentWidth = parseFloat(column.width);
        const gridAvailableSize = column.grid.calcWidth;
        const diffPercentage = (diff / gridAvailableSize) * 100;
        const colMinWidth = column.minWidthPercent;
        const colMaxWidth = column.maxWidthPercent;
        if (currentPercentWidth + diffPercentage < colMinWidth) {
            column.width = colMinWidth + '%';
        }
        else if (colMaxWidth && (currentPercentWidth + diffPercentage > colMaxWidth)) {
            column.width = colMaxWidth + '%';
        }
        else {
            column.width = (currentPercentWidth + diffPercentage) + '%';
        }
    }
    getColMinWidth(column) {
        let currentColWidth = parseFloat(column.width);
        const actualWidth = column.headerCell.nativeElement.getBoundingClientRect().width;
        currentColWidth = Number.isNaN(currentColWidth) || (currentColWidth < actualWidth) ? actualWidth : currentColWidth;
        const actualMinWidth = parseFloat(column.minWidth);
        return actualMinWidth < currentColWidth ? actualMinWidth : currentColWidth;
    }
    resizeColumnLayoutFor(column, diff) {
        const relativeColumns = column.getResizableColUnderEnd();
        const combinedSpan = relativeColumns.reduce((acc, col) => acc + col.spanUsed, 0);
        // Resize first those who might reach min/max width
        let columnsToResize = [...relativeColumns];
        let updatedDiff = diff;
        let updatedCombinedSpan = combinedSpan;
        let setMinMaxCols = false;
        do {
            // Cycle them until there are not ones that reach min/max size, because the diff accumulates after each cycle.
            // This is because we can have at first 2 cols reaching min width and then after
            // recalculating the diff there might be 1 more that reaches min width.
            setMinMaxCols = false;
            let newCombinedSpan = updatedCombinedSpan;
            const newColsToResize = [];
            columnsToResize.forEach((col) => {
                const currentResizeWidth = parseFloat(col.target.calcWidth);
                const resizeScaled = (diff / updatedCombinedSpan) * col.target.gridColumnSpan;
                const colWidth = col.target.width;
                const isPercentageWidth = colWidth && typeof colWidth === 'string' && colWidth.indexOf('%') !== -1;
                const minWidth = col.target.minWidthPx;
                const maxWidth = col.target.maxWidthPx;
                if (currentResizeWidth + resizeScaled < minWidth) {
                    col.target.width = isPercentageWidth ? col.target.minWidthPercent + '%' : minWidth + 'px';
                    updatedDiff += (currentResizeWidth - minWidth);
                    newCombinedSpan -= col.spanUsed;
                    setMinMaxCols = true;
                }
                else if (maxWidth && (currentResizeWidth + resizeScaled > maxWidth)) {
                    col.target.width = isPercentageWidth ? col.target.maxWidthPercent + '%' : col.target.maxWidthPx + 'px';
                    updatedDiff -= (maxWidth - currentResizeWidth);
                    newCombinedSpan -= col.spanUsed;
                    setMinMaxCols = true;
                }
                else {
                    // Save new ones that can be resized
                    newColsToResize.push(col);
                }
            });
            updatedCombinedSpan = newCombinedSpan;
            columnsToResize = newColsToResize;
        } while (setMinMaxCols);
        // Those left that don't reach min/max size resize them normally.
        columnsToResize.forEach((col) => {
            const resizeScaled = (updatedDiff / updatedCombinedSpan) * col.target.gridColumnSpan;
            const colWidth = col.target.width;
            const isPercentageWidth = colWidth && typeof colWidth === 'string' && colWidth.indexOf('%') !== -1;
            if (isPercentageWidth) {
                this._handlePercentageResize(resizeScaled, col.target);
            }
            else {
                this._handlePixelResize(resizeScaled, col.target);
            }
        });
    }
}
IgxColumnResizingService.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnResizingService, deps: [{ token: i0.NgZone }], target: i0.????FactoryTarget.Injectable });
IgxColumnResizingService.??prov = i0.????ngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnResizingService });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnResizingService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXppbmcuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9ncmlkcy9yZXNpemluZy9yZXNpemluZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7O0FBR25EOzs7R0FHRztBQUVILE1BQU0sT0FBTyx3QkFBd0I7SUF1QmpDLFlBQW9CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBYmhDOztXQUVHO1FBQ0ksaUJBQVksR0FBVyxJQUFJLENBQUM7UUFDbkM7O1dBRUc7UUFDSyxnQkFBVyxHQUFHLEtBQUssQ0FBQztJQU1RLENBQUM7SUFFckM7O09BRUc7SUFDSSw0QkFBNEI7UUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDOUUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxhQUFhO1FBQ3BCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFeEQsb0hBQW9IO1FBQ3BILElBQUksc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtZQUMvQixzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDOUY7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLE1BQU0s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O1FBQ2pFLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM1QixNQUFNLFlBQVksR0FBRyxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO1lBQ3JGLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2xDLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ25HLElBQUksaUJBQWlCLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFEO2lCQUFNO2dCQUNILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JEO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztxSEE3TlEsd0JBQXdCO3lIQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29sdW1uVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9ncmlkLmludGVyZmFjZSc7XG5cbi8qKlxuICogQGhpZGRlblxuICogQGludGVybmFsXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJZ3hDb2x1bW5SZXNpemluZ1NlcnZpY2Uge1xuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBzdGFydFJlc2l6ZVBvczogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB0aGF0IGEgY29sdW1uIGlzIGN1cnJlbnRseSBiZWluZyByZXNpemVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0NvbHVtblJlc2l6aW5nOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzaXplQ3Vyc29yOiBzdHJpbmcgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICAgcHVibGljIHNob3dSZXNpemVyID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbHVtbiBiZWluZyByZXNpemVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBjb2x1bW46IENvbHVtblR5cGU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSkgeyB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuXG4gICAgICovXG4gICAgcHVibGljIGdldENvbHVtbkhlYWRlclJlbmRlcmVkV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbHVtbi5oZWFkZXJDZWxsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmVzaXplckhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5jb2x1bW4uZ3JpZC5nZXRWaXNpYmxlQ29udGVudEhlaWdodCgpO1xuXG4gICAgICAgIC8vIENvbHVtbiBoZWlnaHQgbXVsdGlwbGllciBpbiBjYXNlIHRoZXJlIGFyZSBDb2x1bW4gTGF5b3V0cy4gVGhlIHJlc2l6ZXIgaGVpZ2h0IG5lZWQgdG8gdGFrZSBpbnRvIGFjY291bnQgcm93U3RhcnQuXG4gICAgICAgIGxldCBjb2x1bW5IZWlnaHRNdWx0aXBsaWVyID0gMTtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uLmNvbHVtbkxheW91dENoaWxkKSB7XG4gICAgICAgICAgICBjb2x1bW5IZWlnaHRNdWx0aXBsaWVyID0gdGhpcy5jb2x1bW4uZ3JpZC5tdWx0aVJvd0xheW91dFJvd1NpemUgLSB0aGlzLmNvbHVtbi5yb3dTdGFydCArIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb2x1bW4ubGV2ZWwgIT09IDApIHtcbiAgICAgICAgICAgIGhlaWdodCAtPSB0aGlzLmNvbHVtbi50b3BMZXZlbFBhcmVudC5oZWFkZXJHcm91cC5oZWlnaHQgLSB0aGlzLmNvbHVtbi5oZWFkZXJHcm91cC5oZWlnaHQgKiBjb2x1bW5IZWlnaHRNdWx0aXBsaWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbWFsIHBvc3NpYmxlIHdpZHRoIHRvIHdoaWNoIHRoZSBjb2x1bW4gY2FuIGJlIHJlc2l6ZWQuXG4gICAgICovXG4gICAgcHVibGljIGdldCByZXN0cmljdFJlc2l6ZU1pbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBhY3R1YWxXaWR0aCA9IHRoaXMuZ2V0Q29sdW1uSGVhZGVyUmVuZGVyZWRXaWR0aCgpO1xuICAgICAgICBjb25zdCBtaW5XaWR0aCA9IHRoaXMuY29sdW1uLm1pbldpZHRoUHggPCBhY3R1YWxXaWR0aCA/IHRoaXMuY29sdW1uLm1pbldpZHRoUHggOiBhY3R1YWxXaWR0aDtcblxuICAgICAgICByZXR1cm4gYWN0dWFsV2lkdGggLSBtaW5XaWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbWFsIHBvc3NpYmxlIHdpZHRoIHRvIHdoaWNoIHRoZSBjb2x1bW4gY2FuIGJlIHJlc2l6ZWQuXG4gICAgICovXG4gICAgcHVibGljIGdldCByZXN0cmljdFJlc2l6ZU1heCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBhY3R1YWxXaWR0aCA9IHRoaXMuZ2V0Q29sdW1uSGVhZGVyUmVuZGVyZWRXaWR0aCgpO1xuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuY29sdW1uLm1heFdpZHRoUHg7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5tYXhXaWR0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG1heFdpZHRoIC0gYWN0dWFsV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdXRvc2l6ZXMgdGhlIGNvbHVtbiB0byB0aGUgbG9uZ2VzdCBjdXJyZW50bHkgdmlzaWJsZSBjZWxsIHZhbHVlLCBpbmNsdWRpbmcgdGhlIGhlYWRlciBjZWxsLlxuICAgICAqIElmIHRoZSBjb2x1bW4gaGFzIGEgcHJlZGlmaW5lZCBtYXhXaWR0aCBhbmQgdGhlIGF1dG9zaXplZCBjb2x1bW4gd2lkdGggd2lsbCBiZWNvbWUgYmlnZ2VyIHRoYW4gaXQsXG4gICAgICogdGhlbiB0aGUgY29sdW1uIGlzIHNpemVkIHRvIGl0cyBtYXhXaWR0aC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXV0b3NpemVDb2x1bW5PbkRibENsaWNrKCkge1xuICAgICAgICBjb25zdCBjdXJyZW50Q29sV2lkdGggPSB0aGlzLmdldENvbHVtbkhlYWRlclJlbmRlcmVkV2lkdGgoKTtcbiAgICAgICAgdGhpcy5jb2x1bW4ud2lkdGggPSB0aGlzLmNvbHVtbi5nZXRBdXRvU2l6ZSgpO1xuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4geyB9KTtcblxuICAgICAgICB0aGlzLmNvbHVtbi5ncmlkLmNvbHVtblJlc2l6ZWQuZW1pdCh7XG4gICAgICAgICAgICBjb2x1bW46IHRoaXMuY29sdW1uLFxuICAgICAgICAgICAgcHJldldpZHRoOiBjdXJyZW50Q29sV2lkdGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIG5ld1dpZHRoOiB0aGlzLmNvbHVtbi53aWR0aFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemVzIHRoZSBjb2x1bW4gcmVnYXJpZG5nIHRvIHRoZSBjb2x1bW4gbWluV2lkdGggYW5kIG1heFdpZHRoLlxuICAgICAqL1xuICAgIHB1YmxpYyByZXNpemVDb2x1bW4oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5zaG93UmVzaXplciA9IGZhbHNlO1xuICAgICAgICBjb25zdCBkaWZmID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuc3RhcnRSZXNpemVQb3M7XG5cbiAgICAgICAgY29uc3QgY29sV2lkdGggPSB0aGlzLmNvbHVtbi53aWR0aDtcbiAgICAgICAgY29uc3QgaXNQZXJjZW50YWdlV2lkdGggPSBjb2xXaWR0aCAmJiB0eXBlb2YgY29sV2lkdGggPT09ICdzdHJpbmcnICYmIGNvbFdpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTE7XG4gICAgICAgIGxldCBjdXJyZW50Q29sV2lkdGggPSBwYXJzZUZsb2F0KGNvbFdpZHRoKTtcbiAgICAgICAgY29uc3QgYWN0dWFsV2lkdGggPSB0aGlzLmdldENvbHVtbkhlYWRlclJlbmRlcmVkV2lkdGgoKTtcbiAgICAgICAgY3VycmVudENvbFdpZHRoID0gTnVtYmVyLmlzTmFOKGN1cnJlbnRDb2xXaWR0aCkgPyBwYXJzZUZsb2F0KGFjdHVhbFdpZHRoIGFzIGFueSkgOiBjdXJyZW50Q29sV2lkdGg7XG5cbiAgICAgICAgaWYgKHRoaXMuY29sdW1uLmdyaWQuaGFzQ29sdW1uTGF5b3V0cykge1xuICAgICAgICAgICAgdGhpcy5yZXNpemVDb2x1bW5MYXlvdXRGb3IodGhpcy5jb2x1bW4sIGRpZmYpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUGVyY2VudGFnZVdpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVQZXJjZW50YWdlUmVzaXplKGRpZmYsIHRoaXMuY29sdW1uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVBpeGVsUmVzaXplKGRpZmYsIHRoaXMuY29sdW1uKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7IH0pO1xuXG4gICAgICAgIGlmIChjdXJyZW50Q29sV2lkdGggIT09IHBhcnNlRmxvYXQodGhpcy5jb2x1bW4ud2lkdGgpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbi5ncmlkLmNvbHVtblJlc2l6ZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgY29sdW1uOiB0aGlzLmNvbHVtbixcbiAgICAgICAgICAgICAgICBwcmV2V2lkdGg6IGlzUGVyY2VudGFnZVdpZHRoID8gY3VycmVudENvbFdpZHRoICsgJyUnIDogY3VycmVudENvbFdpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBuZXdXaWR0aDogdGhpcy5jb2x1bW4ud2lkdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc0NvbHVtblJlc2l6aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9oYW5kbGVQaXhlbFJlc2l6ZShkaWZmOiBudW1iZXIsIGNvbHVtbjogQ29sdW1uVHlwZSkge1xuICAgICAgICBjb25zdCBjdXJyZW50Q29sV2lkdGggPSBwYXJzZUZsb2F0KGNvbHVtbi53aWR0aCk7XG4gICAgICAgIGNvbnN0IGNvbE1pbldpZHRoID0gY29sdW1uLm1pbldpZHRoUHg7XG4gICAgICAgIGNvbnN0IGNvbE1heFdpZHRoID0gY29sdW1uLm1heFdpZHRoUHg7XG4gICAgICAgIGlmIChjdXJyZW50Q29sV2lkdGggKyBkaWZmIDwgY29sTWluV2lkdGgpIHtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IGNvbE1pbldpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIGlmIChjb2xNYXhXaWR0aCAmJiAoY3VycmVudENvbFdpZHRoICsgZGlmZiA+IGNvbE1heFdpZHRoKSkge1xuICAgICAgICAgICAgY29sdW1uLndpZHRoID0gY29sTWF4V2lkdGggKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sdW1uLndpZHRoID0gKGN1cnJlbnRDb2xXaWR0aCArIGRpZmYpICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBfaGFuZGxlUGVyY2VudGFnZVJlc2l6ZShkaWZmOiBudW1iZXIsIGNvbHVtbjogQ29sdW1uVHlwZSkge1xuICAgICAgICBjb25zdCBjdXJyZW50UGVyY2VudFdpZHRoID0gcGFyc2VGbG9hdChjb2x1bW4ud2lkdGgpO1xuICAgICAgICBjb25zdCBncmlkQXZhaWxhYmxlU2l6ZSA9IGNvbHVtbi5ncmlkLmNhbGNXaWR0aDtcblxuICAgICAgICBjb25zdCBkaWZmUGVyY2VudGFnZSA9IChkaWZmIC8gZ3JpZEF2YWlsYWJsZVNpemUpICogMTAwO1xuICAgICAgICBjb25zdCBjb2xNaW5XaWR0aCA9IGNvbHVtbi5taW5XaWR0aFBlcmNlbnQ7XG4gICAgICAgIGNvbnN0IGNvbE1heFdpZHRoID0gY29sdW1uLm1heFdpZHRoUGVyY2VudDtcblxuICAgICAgICBpZiAoY3VycmVudFBlcmNlbnRXaWR0aCArIGRpZmZQZXJjZW50YWdlIDwgY29sTWluV2lkdGgpIHtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IGNvbE1pbldpZHRoICsgJyUnO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbE1heFdpZHRoICYmIChjdXJyZW50UGVyY2VudFdpZHRoICsgZGlmZlBlcmNlbnRhZ2UgPiBjb2xNYXhXaWR0aCkpIHtcbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IGNvbE1heFdpZHRoICsgJyUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sdW1uLndpZHRoID0gKGN1cnJlbnRQZXJjZW50V2lkdGggKyBkaWZmUGVyY2VudGFnZSkgKyAnJSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0Q29sTWluV2lkdGgoY29sdW1uOiBDb2x1bW5UeXBlKSB7XG4gICAgICAgIGxldCBjdXJyZW50Q29sV2lkdGggPSBwYXJzZUZsb2F0KGNvbHVtbi53aWR0aCk7XG4gICAgICAgIGNvbnN0IGFjdHVhbFdpZHRoID0gY29sdW1uLmhlYWRlckNlbGwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgY3VycmVudENvbFdpZHRoID0gTnVtYmVyLmlzTmFOKGN1cnJlbnRDb2xXaWR0aCkgfHwgKGN1cnJlbnRDb2xXaWR0aCA8IGFjdHVhbFdpZHRoKSA/IGFjdHVhbFdpZHRoIDogY3VycmVudENvbFdpZHRoO1xuXG4gICAgICAgIGNvbnN0IGFjdHVhbE1pbldpZHRoID0gcGFyc2VGbG9hdChjb2x1bW4ubWluV2lkdGgpO1xuICAgICAgICByZXR1cm4gYWN0dWFsTWluV2lkdGggPCBjdXJyZW50Q29sV2lkdGggPyBhY3R1YWxNaW5XaWR0aCA6IGN1cnJlbnRDb2xXaWR0aDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVzaXplQ29sdW1uTGF5b3V0Rm9yKGNvbHVtbjogQ29sdW1uVHlwZSwgZGlmZjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQ29sdW1ucyA9IGNvbHVtbi5nZXRSZXNpemFibGVDb2xVbmRlckVuZCgpO1xuICAgICAgICBjb25zdCBjb21iaW5lZFNwYW4gPSByZWxhdGl2ZUNvbHVtbnMucmVkdWNlKChhY2MsIGNvbCkgPT4gYWNjICsgY29sLnNwYW5Vc2VkLCAwKTtcblxuICAgICAgICAvLyBSZXNpemUgZmlyc3QgdGhvc2Ugd2hvIG1pZ2h0IHJlYWNoIG1pbi9tYXggd2lkdGhcbiAgICAgICAgbGV0IGNvbHVtbnNUb1Jlc2l6ZSA9IFsuLi5yZWxhdGl2ZUNvbHVtbnNdO1xuICAgICAgICBsZXQgdXBkYXRlZERpZmYgPSBkaWZmO1xuICAgICAgICBsZXQgdXBkYXRlZENvbWJpbmVkU3BhbiA9IGNvbWJpbmVkU3BhbjtcbiAgICAgICAgbGV0IHNldE1pbk1heENvbHMgPSBmYWxzZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgLy8gQ3ljbGUgdGhlbSB1bnRpbCB0aGVyZSBhcmUgbm90IG9uZXMgdGhhdCByZWFjaCBtaW4vbWF4IHNpemUsIGJlY2F1c2UgdGhlIGRpZmYgYWNjdW11bGF0ZXMgYWZ0ZXIgZWFjaCBjeWNsZS5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB3ZSBjYW4gaGF2ZSBhdCBmaXJzdCAyIGNvbHMgcmVhY2hpbmcgbWluIHdpZHRoIGFuZCB0aGVuIGFmdGVyXG4gICAgICAgICAgICAvLyByZWNhbGN1bGF0aW5nIHRoZSBkaWZmIHRoZXJlIG1pZ2h0IGJlIDEgbW9yZSB0aGF0IHJlYWNoZXMgbWluIHdpZHRoLlxuICAgICAgICAgICAgc2V0TWluTWF4Q29scyA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IG5ld0NvbWJpbmVkU3BhbiA9IHVwZGF0ZWRDb21iaW5lZFNwYW47XG4gICAgICAgICAgICBjb25zdCBuZXdDb2xzVG9SZXNpemUgPSBbXTtcbiAgICAgICAgICAgIGNvbHVtbnNUb1Jlc2l6ZS5mb3JFYWNoKChjb2wpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UmVzaXplV2lkdGggPSBwYXJzZUZsb2F0KGNvbC50YXJnZXQuY2FsY1dpZHRoKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNpemVTY2FsZWQgPSAoZGlmZiAvIHVwZGF0ZWRDb21iaW5lZFNwYW4pICogY29sLnRhcmdldC5ncmlkQ29sdW1uU3BhbjtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xXaWR0aCA9IGNvbC50YXJnZXQud2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNQZXJjZW50YWdlV2lkdGggPSBjb2xXaWR0aCAmJiB0eXBlb2YgY29sV2lkdGggPT09ICdzdHJpbmcnICYmIGNvbFdpZHRoLmluZGV4T2YoJyUnKSAhPT0gLTE7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtaW5XaWR0aCA9IGNvbC50YXJnZXQubWluV2lkdGhQeDtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhXaWR0aCA9IGNvbC50YXJnZXQubWF4V2lkdGhQeDtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlc2l6ZVdpZHRoICsgcmVzaXplU2NhbGVkIDwgbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sLnRhcmdldC53aWR0aCA9IGlzUGVyY2VudGFnZVdpZHRoID8gY29sLnRhcmdldC5taW5XaWR0aFBlcmNlbnQgKyAnJScgOiBtaW5XaWR0aCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWREaWZmICs9IChjdXJyZW50UmVzaXplV2lkdGggLSBtaW5XaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbWJpbmVkU3BhbiAtPSBjb2wuc3BhblVzZWQ7XG4gICAgICAgICAgICAgICAgICAgIHNldE1pbk1heENvbHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF4V2lkdGggJiYgKGN1cnJlbnRSZXNpemVXaWR0aCArIHJlc2l6ZVNjYWxlZCA+IG1heFdpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2wudGFyZ2V0LndpZHRoID0gaXNQZXJjZW50YWdlV2lkdGggPyBjb2wudGFyZ2V0Lm1heFdpZHRoUGVyY2VudCArICclJyA6IGNvbC50YXJnZXQubWF4V2lkdGhQeCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWREaWZmIC09IChtYXhXaWR0aCAtIGN1cnJlbnRSZXNpemVXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbWJpbmVkU3BhbiAtPSBjb2wuc3BhblVzZWQ7XG4gICAgICAgICAgICAgICAgICAgIHNldE1pbk1heENvbHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgbmV3IG9uZXMgdGhhdCBjYW4gYmUgcmVzaXplZFxuICAgICAgICAgICAgICAgICAgICBuZXdDb2xzVG9SZXNpemUucHVzaChjb2wpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB1cGRhdGVkQ29tYmluZWRTcGFuID0gbmV3Q29tYmluZWRTcGFuO1xuICAgICAgICAgICAgY29sdW1uc1RvUmVzaXplID0gbmV3Q29sc1RvUmVzaXplO1xuICAgICAgICB9IHdoaWxlIChzZXRNaW5NYXhDb2xzKTtcblxuICAgICAgICAvLyBUaG9zZSBsZWZ0IHRoYXQgZG9uJ3QgcmVhY2ggbWluL21heCBzaXplIHJlc2l6ZSB0aGVtIG5vcm1hbGx5LlxuICAgICAgICBjb2x1bW5zVG9SZXNpemUuZm9yRWFjaCgoY29sKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNpemVTY2FsZWQgPSAodXBkYXRlZERpZmYgLyB1cGRhdGVkQ29tYmluZWRTcGFuKSAqIGNvbC50YXJnZXQuZ3JpZENvbHVtblNwYW47XG4gICAgICAgICAgICBjb25zdCBjb2xXaWR0aCA9IGNvbC50YXJnZXQud2lkdGg7XG4gICAgICAgICAgICBjb25zdCBpc1BlcmNlbnRhZ2VXaWR0aCA9IGNvbFdpZHRoICYmIHR5cGVvZiBjb2xXaWR0aCA9PT0gJ3N0cmluZycgJiYgY29sV2lkdGguaW5kZXhPZignJScpICE9PSAtMTtcbiAgICAgICAgICAgIGlmIChpc1BlcmNlbnRhZ2VXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZVBlcmNlbnRhZ2VSZXNpemUocmVzaXplU2NhbGVkLCBjb2wudGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlUGl4ZWxSZXNpemUocmVzaXplU2NhbGVkLCBjb2wudGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19