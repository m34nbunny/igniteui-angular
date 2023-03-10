import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/** @hidden @internal */
export class IgxTreeService {
    constructor() {
        this.expandedNodes = new Set();
        this.collapsingNodes = new Set();
        this.siblingComparer = (data, node) => node !== data && node.level === data.level;
    }
    /**
     * Adds the node to the `expandedNodes` set and fires the nodes change event
     *
     * @param node target node
     * @param uiTrigger is the event triggered by a ui interraction (so we know if we should animate)
     * @returns void
     */
    expand(node, uiTrigger) {
        this.collapsingNodes.delete(node);
        if (!this.expandedNodes.has(node)) {
            node.expandedChange.emit(true);
        }
        else {
            return;
        }
        this.expandedNodes.add(node);
        if (this.tree.singleBranchExpand) {
            this.tree.findNodes(node, this.siblingComparer)?.forEach(e => {
                if (uiTrigger) {
                    e.collapse();
                }
                else {
                    e.expanded = false;
                }
            });
        }
    }
    /**
     * Adds a node to the `collapsing` collection
     *
     * @param node target node
     */
    collapsing(node) {
        this.collapsingNodes.add(node);
    }
    /**
     * Removes the node from the 'expandedNodes' set and emits the node's change event
     *
     * @param node target node
     * @returns void
     */
    collapse(node) {
        if (this.expandedNodes.has(node)) {
            node.expandedChange.emit(false);
        }
        this.collapsingNodes.delete(node);
        this.expandedNodes.delete(node);
    }
    isExpanded(node) {
        return this.expandedNodes.has(node);
    }
    register(tree) {
        this.tree = tree;
    }
}
IgxTreeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IgxTreeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3RyZWUvdHJlZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRzNDLHdCQUF3QjtBQUV4QixNQUFNLE9BQU8sY0FBYztJQUQzQjtRQUVXLGtCQUFhLEdBQTBCLElBQUksR0FBRyxFQUFvQixDQUFDO1FBQ25FLG9CQUFlLEdBQTBCLElBQUksR0FBRyxFQUFvQixDQUFDO1FBNERwRSxvQkFBZSxHQUV2QixDQUFDLElBQXNCLEVBQUUsSUFBc0IsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbEc7SUE1REc7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLElBQXNCLEVBQUUsU0FBbUI7UUFDckQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDSCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pELElBQUksU0FBUyxFQUFFO29CQUNYLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDaEI7cUJBQU07b0JBQ0gsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7aUJBQ3RCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksVUFBVSxDQUFDLElBQXNCO1FBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxJQUFzQjtRQUNsQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLFVBQVUsQ0FBQyxJQUFzQjtRQUNwQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxRQUFRLENBQUMsSUFBYTtRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDOzsyR0E1RFEsY0FBYzsrR0FBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJZ3hUcmVlLCBJZ3hUcmVlTm9kZSB9IGZyb20gJy4vY29tbW9uJztcblxuLyoqIEBoaWRkZW4gQGludGVybmFsICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSWd4VHJlZVNlcnZpY2Uge1xuICAgIHB1YmxpYyBleHBhbmRlZE5vZGVzOiBTZXQ8SWd4VHJlZU5vZGU8YW55Pj4gPSBuZXcgU2V0PElneFRyZWVOb2RlPGFueT4+KCk7XG4gICAgcHVibGljIGNvbGxhcHNpbmdOb2RlczogU2V0PElneFRyZWVOb2RlPGFueT4+ID0gbmV3IFNldDxJZ3hUcmVlTm9kZTxhbnk+PigpO1xuICAgIHByaXZhdGUgdHJlZTogSWd4VHJlZTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIG5vZGUgdG8gdGhlIGBleHBhbmRlZE5vZGVzYCBzZXQgYW5kIGZpcmVzIHRoZSBub2RlcyBjaGFuZ2UgZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlIHRhcmdldCBub2RlXG4gICAgICogQHBhcmFtIHVpVHJpZ2dlciBpcyB0aGUgZXZlbnQgdHJpZ2dlcmVkIGJ5IGEgdWkgaW50ZXJyYWN0aW9uIChzbyB3ZSBrbm93IGlmIHdlIHNob3VsZCBhbmltYXRlKVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwYW5kKG5vZGU6IElneFRyZWVOb2RlPGFueT4sIHVpVHJpZ2dlcj86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xsYXBzaW5nTm9kZXMuZGVsZXRlKG5vZGUpO1xuICAgICAgICBpZiAoIXRoaXMuZXhwYW5kZWROb2Rlcy5oYXMobm9kZSkpIHtcbiAgICAgICAgICAgIG5vZGUuZXhwYW5kZWRDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV4cGFuZGVkTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgICBpZiAodGhpcy50cmVlLnNpbmdsZUJyYW5jaEV4cGFuZCkge1xuICAgICAgICAgICAgdGhpcy50cmVlLmZpbmROb2Rlcyhub2RlLCB0aGlzLnNpYmxpbmdDb21wYXJlcik/LmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHVpVHJpZ2dlcikge1xuICAgICAgICAgICAgICAgICAgICBlLmNvbGxhcHNlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZS5leHBhbmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIG5vZGUgdG8gdGhlIGBjb2xsYXBzaW5nYCBjb2xsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZSB0YXJnZXQgbm9kZVxuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsYXBzaW5nKG5vZGU6IElneFRyZWVOb2RlPGFueT4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xsYXBzaW5nTm9kZXMuYWRkKG5vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIG5vZGUgZnJvbSB0aGUgJ2V4cGFuZGVkTm9kZXMnIHNldCBhbmQgZW1pdHMgdGhlIG5vZGUncyBjaGFuZ2UgZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlIHRhcmdldCBub2RlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsYXBzZShub2RlOiBJZ3hUcmVlTm9kZTxhbnk+KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmV4cGFuZGVkTm9kZXMuaGFzKG5vZGUpKSB7XG4gICAgICAgICAgICBub2RlLmV4cGFuZGVkQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29sbGFwc2luZ05vZGVzLmRlbGV0ZShub2RlKTtcbiAgICAgICAgdGhpcy5leHBhbmRlZE5vZGVzLmRlbGV0ZShub2RlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNFeHBhbmRlZChub2RlOiBJZ3hUcmVlTm9kZTxhbnk+KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cGFuZGVkTm9kZXMuaGFzKG5vZGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlcih0cmVlOiBJZ3hUcmVlKSB7XG4gICAgICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaWJsaW5nQ29tcGFyZXI6XG4gICAgKGRhdGE6IElneFRyZWVOb2RlPGFueT4sIG5vZGU6IElneFRyZWVOb2RlPGFueT4pID0+IGJvb2xlYW4gPVxuICAgIChkYXRhOiBJZ3hUcmVlTm9kZTxhbnk+LCBub2RlOiBJZ3hUcmVlTm9kZTxhbnk+KSA9PiBub2RlICE9PSBkYXRhICYmIG5vZGUubGV2ZWwgPT09IGRhdGEubGV2ZWw7XG59XG4iXX0=