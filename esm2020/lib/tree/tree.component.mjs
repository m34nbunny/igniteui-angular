import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ContentChild, Directive, NgModule, TemplateRef, ContentChildren, HostBinding, Optional, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { growVerIn, growVerOut } from '../animations/grow';
import { IgxCheckboxModule } from '../checkbox/checkbox.component';
import { DisplayDensityBase, DisplayDensityToken } from '../core/displayDensity';
import { IgxExpansionPanelModule } from '../expansion-panel/public_api';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule } from '../input-group/public_api';
import { IgxProgressBarModule } from '../progressbar/progressbar.component';
import { IGX_TREE_COMPONENT, IgxTreeSelectionType } from './common';
import { IgxTreeNavigationService } from './tree-navigation.service';
import { IgxTreeNodeComponent, IgxTreeNodeLinkDirective } from './tree-node/tree-node.component';
import { IgxTreeSelectionService } from './tree-selection.service';
import { IgxTreeService } from './tree.service';
import * as i0 from "@angular/core";
import * as i1 from "./tree-navigation.service";
import * as i2 from "./tree-selection.service";
import * as i3 from "./tree.service";
/**
 * @hidden @internal
 * Used for templating the select marker of the tree
 */
export class IgxTreeSelectMarkerDirective {
}
IgxTreeSelectMarkerDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeSelectMarkerDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxTreeSelectMarkerDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeSelectMarkerDirective, selector: "[igxTreeSelectMarker]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeSelectMarkerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxTreeSelectMarker]'
                }]
        }] });
/**
 * @hidden @internal
 * Used for templating the expand indicator of the tree
 */
export class IgxTreeExpandIndicatorDirective {
}
IgxTreeExpandIndicatorDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeExpandIndicatorDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
IgxTreeExpandIndicatorDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeExpandIndicatorDirective, selector: "[igxTreeExpandIndicator]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeExpandIndicatorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxTreeExpandIndicator]'
                }]
        }] });
export class IgxTreeComponent extends DisplayDensityBase {
    constructor(navService, selectionService, treeService, element, _displayDensityOptions) {
        super(_displayDensityOptions);
        this.navService = navService;
        this.selectionService = selectionService;
        this.treeService = treeService;
        this.element = element;
        this._displayDensityOptions = _displayDensityOptions;
        this.cssClass = 'igx-tree';
        /** Get/Set how the tree should handle branch expansion.
         * If set to `true`, only a single branch can be expanded at a time, collapsing all others
         *
         * ```html
         * <igx-tree [singleBranchExpand]="true">
         * ...
         * </igx-tree>
         * ```
         *
         * ```typescript
         * const tree: IgxTree = this.tree;
         * this.tree.singleBranchExpand = false;
         * ```
         */
        this.singleBranchExpand = false;
        /** Get/Set the animation settings that branches should use when expanding/collpasing.
         *
         * ```html
         * <igx-tree [animationSettings]="customAnimationSettings">
         * </igx-tree>
         * ```
         *
         * ```typescript
         * const animationSettings: ToggleAnimationSettings = {
         *      openAnimation: growVerIn,
         *      closeAnimation: growVerOut
         * };
         *
         * this.tree.animationSettings = animationSettings;
         * ```
         */
        this.animationSettings = {
            openAnimation: growVerIn,
            closeAnimation: growVerOut
        };
        /** Emitted when the node selection is changed through interaction
         *
         * ```html
         * <igx-tree (nodeSelection)="handleNodeSelection($event)">
         * </igx-tree>
         * ```
         *
         *```typescript
         * public handleNodeSelection(event: ITreeNodeSelectionEvent) {
         *  const newSelection: IgxTreeNode<any>[] = event.newSelection;
         *  const added: IgxTreeNode<any>[] = event.added;
         *  console.log("New selection will be: ", newSelection);
         *  console.log("Added nodes: ", event.added);
         * }
         *```
         */
        this.nodeSelection = new EventEmitter();
        /** Emitted when a node is expanding, before it finishes
         *
         * ```html
         * <igx-tree (nodeExpanding)="handleNodeExpanding($event)">
         * </igx-tree>
         * ```
         *
         *```typescript
         * public handleNodeExpanding(event: ITreeNodeTogglingEventArgs) {
         *  const expandedNode: IgxTreeNode<any> = event.node;
         *  if (expandedNode.disabled) {
         *      event.cancel = true;
         *  }
         * }
         *```
         */
        this.nodeExpanding = new EventEmitter();
        /** Emitted when a node is expanded, after it finishes
         *
         * ```html
         * <igx-tree (nodeExpanded)="handleNodeExpanded($event)">
         * </igx-tree>
         * ```
         *
         *```typescript
         * public handleNodeExpanded(event: ITreeNodeToggledEventArgs) {
         *  const expandedNode: IgxTreeNode<any> = event.node;
         *  console.log("Node is expanded: ", expandedNode.data);
         * }
         *```
         */
        this.nodeExpanded = new EventEmitter();
        /** Emitted when a node is collapsing, before it finishes
         *
         * ```html
         * <igx-tree (nodeCollapsing)="handleNodeCollapsing($event)">
         * </igx-tree>
         * ```
         *
         *```typescript
         * public handleNodeCollapsing(event: ITreeNodeTogglingEventArgs) {
         *  const collapsedNode: IgxTreeNode<any> = event.node;
         *  if (collapsedNode.alwaysOpen) {
         *      event.cancel = true;
         *  }
         * }
         *```
         */
        this.nodeCollapsing = new EventEmitter();
        /** Emitted when a node is collapsed, after it finishes
         *
         * @example
         * ```html
         * <igx-tree (nodeCollapsed)="handleNodeCollapsed($event)">
         * </igx-tree>
         * ```
         * ```typescript
         * public handleNodeCollapsed(event: ITreeNodeToggledEventArgs) {
         *  const collapsedNode: IgxTreeNode<any> = event.node;
         *  console.log("Node is collapsed: ", collapsedNode.data);
         * }
         * ```
         */
        this.nodeCollapsed = new EventEmitter();
        /**
         * Emitted when the active node is changed.
         *
         * @example
         * ```
         * <igx-tree (activeNodeChanged)="activeNodeChanged($event)"></igx-tree>
         * ```
         */
        this.activeNodeChanged = new EventEmitter();
        /** @hidden @internal */
        this.disabledChange = new EventEmitter();
        /**
         * Emitted when the active node is set through API
         *
         * @hidden @internal
         */
        this.activeNodeBindingChange = new EventEmitter();
        /** @hidden @internal */
        this.forceSelect = [];
        this._selection = IgxTreeSelectionType.None;
        this.destroy$ = new Subject();
        this.unsubChildren$ = new Subject();
        this._comparer = (data, node) => node.data === data;
        this.selectionService.register(this);
        this.treeService.register(this);
        this.navService.register(this);
    }
    /**
     * Gets/Sets tree selection mode
     *
     * @remarks
     * By default the tree selection mode is 'None'
     * @param selectionMode: IgxTreeSelectionType
     */
    get selection() {
        return this._selection;
    }
    set selection(selectionMode) {
        this._selection = selectionMode;
        this.selectionService.clearNodesSelection();
    }
    /**
     * Returns all **root level** nodes
     *
     * ```typescript
     * const tree: IgxTree = this.tree;
     * const rootNodes: IgxTreeNodeComponent<any>[] = tree.rootNodes;
     * ```
     */
    get rootNodes() {
        return this.nodes?.filter(node => node.level === 0);
    }
    /** @hidden @internal */
    get nativeElement() {
        return this.element.nativeElement;
    }
    /**
     * Expands all of the passed nodes.
     * If no nodes are passed, expands ALL nodes
     *
     * @param nodes nodes to be expanded
     *
     * ```typescript
     * const targetNodes: IgxTreeNode<any> = this.tree.findNodes(true, (_data: any, node: IgxTreeNode<any>) => node.data.expandable);
     * tree.expandAll(nodes);
     * ```
     */
    expandAll(nodes) {
        nodes = nodes || this.nodes.toArray();
        nodes.forEach(e => e.expanded = true);
    }
    /**
     * Collapses all of the passed nodes.
     * If no nodes are passed, collapses ALL nodes
     *
     * @param nodes nodes to be collapsed
     *
     * ```typescript
     * const targetNodes: IgxTreeNode<any> = this.tree.findNodes(true, (_data: any, node: IgxTreeNode<any>) => node.data.collapsible);
     * tree.collapseAll(nodes);
     * ```
     */
    collapseAll(nodes) {
        nodes = nodes || this.nodes.toArray();
        nodes.forEach(e => e.expanded = false);
    }
    /**
     * Deselect all nodes if the nodes collection is empty. Otherwise, deselect the nodes in the nodes collection.
     *
     * @example
     * ```typescript
     *  const arr = [
     *      this.tree.nodes.toArray()[0],
     *      this.tree.nodes.toArray()[1]
     *  ];
     *  this.tree.deselectAll(arr);
     * ```
     * @param nodes: IgxTreeNodeComponent<any>[]
     */
    deselectAll(nodes) {
        this.selectionService.deselectNodesWithNoEvent(nodes);
    }
    /**
     * Returns all of the nodes that match the passed searchTerm.
     * Accepts a custom comparer function for evaluating the search term against the nodes.
     *
     * @remark
     * Default search compares the passed `searchTerm` against the node's `data` Input.
     * When using `findNodes` w/o a `comparer`, make sure all nodes have `data` passed.
     *
     * @param searchTerm The data of the searched node
     * @param comparer A custom comparer function that evaluates the passed `searchTerm` against all nodes.
     * @returns Array of nodes that match the search. `null` if no nodes are found.
     *
     * ```html
     * <igx-tree>
     *     <igx-tree-node *ngFor="let node of data" [data]="node">
     *          {{ node.label }}
     *     </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * public data: DataEntry[] = FETCHED_DATA;
     * ...
     * const matchedNodes: IgxTreeNode<DataEntry>[] = this.tree.findNodes<DataEntry>(searchTerm: data[5]);
     * ```
     *
     * Using a custom comparer
     * ```typescript
     * public data: DataEntry[] = FETCHED_DATA;
     * ...
     * const comparer: IgxTreeSearchResolver = (data: any, node: IgxTreeNode<DataEntry>) {
     *      return node.data.index % 2 === 0;
     * }
     * const evenIndexNodes: IgxTreeNode<DataEntry>[] = this.tree.findNodes<DataEntry>(null, comparer);
     * ```
     */
    findNodes(searchTerm, comparer) {
        const compareFunc = comparer || this._comparer;
        const results = this.nodes.filter(node => compareFunc(searchTerm, node));
        return results?.length === 0 ? null : results;
    }
    /** @hidden @internal */
    handleKeydown(event) {
        this.navService.handleKeydown(event);
    }
    /** @hidden @internal */
    ngOnInit() {
        super.ngOnInit();
        this.disabledChange.pipe(takeUntil(this.destroy$)).subscribe((e) => {
            this.navService.update_disabled_cache(e);
        });
        this.activeNodeBindingChange.pipe(takeUntil(this.destroy$)).subscribe((node) => {
            this.expandToNode(this.navService.activeNode);
            this.scrollNodeIntoView(node?.header?.nativeElement);
        });
        this.onDensityChanged.pipe(takeUntil(this.destroy$)).subscribe(() => {
            requestAnimationFrame(() => {
                this.scrollNodeIntoView(this.navService.activeNode?.header.nativeElement);
            });
        });
        this.subToCollapsing();
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        this.nodes.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.subToChanges();
        });
        this.scrollNodeIntoView(this.navService.activeNode?.header?.nativeElement);
        this.subToChanges();
    }
    /** @hidden @internal */
    ngOnDestroy() {
        this.unsubChildren$.next();
        this.unsubChildren$.complete();
        this.destroy$.next();
        this.destroy$.complete();
    }
    expandToNode(node) {
        if (node && node.parentNode) {
            node.path.forEach(n => {
                if (n !== node && !n.expanded) {
                    n.expanded = true;
                }
            });
        }
    }
    subToCollapsing() {
        this.nodeCollapsing.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event.cancel) {
                return;
            }
            this.navService.update_visible_cache(event.node, false);
        });
        this.nodeExpanding.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event.cancel) {
                return;
            }
            this.navService.update_visible_cache(event.node, true);
        });
    }
    subToChanges() {
        this.unsubChildren$.next();
        const toBeSelected = [...this.forceSelect];
        requestAnimationFrame(() => {
            this.selectionService.selectNodesWithNoEvent(toBeSelected);
        });
        this.forceSelect = [];
        this.nodes.forEach(node => {
            node.expandedChange.pipe(takeUntil(this.unsubChildren$)).subscribe(nodeState => {
                this.navService.update_visible_cache(node, nodeState);
            });
            node.closeAnimationDone.pipe(takeUntil(this.unsubChildren$)).subscribe(() => {
                const targetElement = this.navService.focusedNode?.header.nativeElement;
                this.scrollNodeIntoView(targetElement);
            });
            node.openAnimationDone.pipe(takeUntil(this.unsubChildren$)).subscribe(() => {
                const targetElement = this.navService.focusedNode?.header.nativeElement;
                this.scrollNodeIntoView(targetElement);
            });
        });
        this.navService.init_invisible_cache();
    }
    scrollNodeIntoView(el) {
        if (!el) {
            return;
        }
        const nodeRect = el.getBoundingClientRect();
        const treeRect = this.nativeElement.getBoundingClientRect();
        const topOffset = treeRect.top > nodeRect.top ? nodeRect.top - treeRect.top : 0;
        const bottomOffset = treeRect.bottom < nodeRect.bottom ? nodeRect.bottom - treeRect.bottom : 0;
        const shouldScroll = !!topOffset || !!bottomOffset;
        if (shouldScroll && this.nativeElement.scrollHeight > this.nativeElement.clientHeight) {
            // this.nativeElement.scrollTop = nodeRect.y - treeRect.y - nodeRect.height;
            this.nativeElement.scrollTop =
                this.nativeElement.scrollTop + bottomOffset + topOffset + (topOffset ? -1 : +1) * nodeRect.height;
        }
    }
}
IgxTreeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeComponent, deps: [{ token: i1.IgxTreeNavigationService }, { token: i2.IgxTreeSelectionService }, { token: i3.IgxTreeService }, { token: i0.ElementRef }, { token: DisplayDensityToken, optional: true }], target: i0.ɵɵFactoryTarget.Component });
IgxTreeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeComponent, selector: "igx-tree", inputs: { selection: "selection", singleBranchExpand: "singleBranchExpand", animationSettings: "animationSettings" }, outputs: { nodeSelection: "nodeSelection", nodeExpanding: "nodeExpanding", nodeExpanded: "nodeExpanded", nodeCollapsing: "nodeCollapsing", nodeCollapsed: "nodeCollapsed", activeNodeChanged: "activeNodeChanged" }, host: { properties: { "class.igx-tree": "this.cssClass" } }, providers: [
        IgxTreeService,
        IgxTreeSelectionService,
        IgxTreeNavigationService,
        { provide: IGX_TREE_COMPONENT, useExisting: IgxTreeComponent },
    ], queries: [{ propertyName: "expandIndicator", first: true, predicate: IgxTreeExpandIndicatorDirective, descendants: true, read: TemplateRef }, { propertyName: "nodes", predicate: IgxTreeNodeComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"igx-tree__root\" role=\"tree\" (keydown)=\"handleKeydown($event)\">\n    <ng-content select=\"igx-tree-node\"></ng-content>\n</div>\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-tree', providers: [
                        IgxTreeService,
                        IgxTreeSelectionService,
                        IgxTreeNavigationService,
                        { provide: IGX_TREE_COMPONENT, useExisting: IgxTreeComponent },
                    ], template: "<div class=\"igx-tree__root\" role=\"tree\" (keydown)=\"handleKeydown($event)\">\n    <ng-content select=\"igx-tree-node\"></ng-content>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.IgxTreeNavigationService }, { type: i2.IgxTreeSelectionService }, { type: i3.IgxTreeService }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }]; }, propDecorators: { cssClass: [{
                type: HostBinding,
                args: ['class.igx-tree']
            }], selection: [{
                type: Input
            }], singleBranchExpand: [{
                type: Input
            }], animationSettings: [{
                type: Input
            }], nodeSelection: [{
                type: Output
            }], nodeExpanding: [{
                type: Output
            }], nodeExpanded: [{
                type: Output
            }], nodeCollapsing: [{
                type: Output
            }], nodeCollapsed: [{
                type: Output
            }], activeNodeChanged: [{
                type: Output
            }], expandIndicator: [{
                type: ContentChild,
                args: [IgxTreeExpandIndicatorDirective, { read: TemplateRef }]
            }], nodes: [{
                type: ContentChildren,
                args: [IgxTreeNodeComponent, { descendants: true }]
            }] } });
/**
 * @hidden
 *
 * NgModule defining the components and directives needed for `igx-tree`
 */
export class IgxTreeModule {
}
IgxTreeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxTreeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeModule, declarations: [IgxTreeSelectMarkerDirective, IgxTreeExpandIndicatorDirective, IgxTreeNodeLinkDirective, IgxTreeComponent, IgxTreeNodeComponent], imports: [CommonModule,
        FormsModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxCheckboxModule,
        IgxProgressBarModule], exports: [IgxTreeSelectMarkerDirective, IgxTreeExpandIndicatorDirective, IgxTreeNodeLinkDirective, IgxTreeComponent, IgxTreeNodeComponent,
        IgxIconModule,
        IgxInputGroupModule,
        IgxCheckboxModule,
        IgxExpansionPanelModule] });
IgxTreeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeModule, imports: [[
            CommonModule,
            FormsModule,
            IgxIconModule,
            IgxInputGroupModule,
            IgxCheckboxModule,
            IgxProgressBarModule
        ], IgxIconModule,
        IgxInputGroupModule,
        IgxCheckboxModule,
        IgxExpansionPanelModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        IgxTreeSelectMarkerDirective,
                        IgxTreeExpandIndicatorDirective,
                        IgxTreeNodeLinkDirective,
                        IgxTreeComponent,
                        IgxTreeNodeComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        IgxIconModule,
                        IgxInputGroupModule,
                        IgxCheckboxModule,
                        IgxProgressBarModule
                    ],
                    exports: [
                        IgxTreeSelectMarkerDirective,
                        IgxTreeExpandIndicatorDirective,
                        IgxTreeNodeLinkDirective,
                        IgxTreeComponent,
                        IgxTreeNodeComponent,
                        IgxIconModule,
                        IgxInputGroupModule,
                        IgxCheckboxModule,
                        IgxExpansionPanelModule
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvdHJlZS90cmVlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi90cmVlL3RyZWUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFDSCxTQUFTLEVBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFDMUUsUUFBUSxFQUFFLFdBQVcsRUFBeUIsZUFBZSxFQUFhLFdBQVcsRUFBYyxRQUFRLEVBQUUsTUFBTSxFQUN0SCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQTBCLE1BQU0sd0JBQXdCLENBQUM7QUFDekcsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFeEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FB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WUFDWCxhQUFhO1lBQ2IsbUJBQW1CO1lBQ25CLGlCQUFpQjtZQUNqQixvQkFBb0I7U0FDdkIsRUFPRyxhQUFhO1FBQ2IsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQix1QkFBdUI7MkZBR2xCLGFBQWE7a0JBNUJ6QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDViw0QkFBNEI7d0JBQzVCLCtCQUErQjt3QkFDL0Isd0JBQXdCO3dCQUN4QixnQkFBZ0I7d0JBQ2hCLG9CQUFvQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxhQUFhO3dCQUNiLG1CQUFtQjt3QkFDbkIsaUJBQWlCO3dCQUNqQixvQkFBb0I7cUJBQ3ZCO29CQUNELE9BQU8sRUFBRTt3QkFDTCw0QkFBNEI7d0JBQzVCLCtCQUErQjt3QkFDL0Isd0JBQXdCO3dCQUN4QixnQkFBZ0I7d0JBQ2hCLG9CQUFvQjt3QkFDcEIsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLGlCQUFpQjt3QkFDakIsdUJBQXVCO3FCQUMxQjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIENvbXBvbmVudCwgUXVlcnlMaXN0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENvbnRlbnRDaGlsZCwgRGlyZWN0aXZlLFxuICAgIE5nTW9kdWxlLCBUZW1wbGF0ZVJlZiwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBDb250ZW50Q2hpbGRyZW4sIE9uRGVzdHJveSwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIE9wdGlvbmFsLCBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGdyb3dWZXJJbiwgZ3Jvd1Zlck91dCB9IGZyb20gJy4uL2FuaW1hdGlvbnMvZ3Jvdyc7XG5pbXBvcnQgeyBJZ3hDaGVja2JveE1vZHVsZSB9IGZyb20gJy4uL2NoZWNrYm94L2NoZWNrYm94LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEaXNwbGF5RGVuc2l0eUJhc2UsIERpc3BsYXlEZW5zaXR5VG9rZW4sIElEaXNwbGF5RGVuc2l0eU9wdGlvbnMgfSBmcm9tICcuLi9jb3JlL2Rpc3BsYXlEZW5zaXR5JztcbmltcG9ydCB7IElneEV4cGFuc2lvblBhbmVsTW9kdWxlIH0gZnJvbSAnLi4vZXhwYW5zaW9uLXBhbmVsL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3MgfSBmcm9tICcuLi9leHBhbnNpb24tcGFuZWwvdG9nZ2xlLWFuaW1hdGlvbi1jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4SWNvbk1vZHVsZSB9IGZyb20gJy4uL2ljb24vcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hJbnB1dEdyb3VwTW9kdWxlIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBJZ3hQcm9ncmVzc0Jhck1vZHVsZSB9IGZyb20gJy4uL3Byb2dyZXNzYmFyL3Byb2dyZXNzYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICAgIElHWF9UUkVFX0NPTVBPTkVOVCwgSWd4VHJlZVNlbGVjdGlvblR5cGUsIElneFRyZWUsIElUcmVlTm9kZVRvZ2dsZWRFdmVudEFyZ3MsXG4gICAgSVRyZWVOb2RlVG9nZ2xpbmdFdmVudEFyZ3MsIElUcmVlTm9kZVNlbGVjdGlvbkV2ZW50LCBJZ3hUcmVlTm9kZSwgSWd4VHJlZVNlYXJjaFJlc29sdmVyXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7IElneFRyZWVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vdHJlZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4VHJlZU5vZGVDb21wb25lbnQsIElneFRyZWVOb2RlTGlua0RpcmVjdGl2ZSB9IGZyb20gJy4vdHJlZS1ub2RlL3RyZWUtbm9kZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSWd4VHJlZVNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3RyZWUtc2VsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWd4VHJlZVNlcnZpY2UgfSBmcm9tICcuL3RyZWUuc2VydmljZSc7XG5cbi8qKlxuICogQGhpZGRlbiBAaW50ZXJuYWxcbiAqIFVzZWQgZm9yIHRlbXBsYXRpbmcgdGhlIHNlbGVjdCBtYXJrZXIgb2YgdGhlIHRyZWVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbaWd4VHJlZVNlbGVjdE1hcmtlcl0nXG59KVxuZXhwb3J0IGNsYXNzIElneFRyZWVTZWxlY3RNYXJrZXJEaXJlY3RpdmUge1xufVxuXG4vKipcbiAqIEBoaWRkZW4gQGludGVybmFsXG4gKiBVc2VkIGZvciB0ZW1wbGF0aW5nIHRoZSBleHBhbmQgaW5kaWNhdG9yIG9mIHRoZSB0cmVlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneFRyZWVFeHBhbmRJbmRpY2F0b3JdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hUcmVlRXhwYW5kSW5kaWNhdG9yRGlyZWN0aXZlIHtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpZ3gtdHJlZScsXG4gICAgdGVtcGxhdGVVcmw6ICd0cmVlLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgSWd4VHJlZVNlcnZpY2UsXG4gICAgICAgIElneFRyZWVTZWxlY3Rpb25TZXJ2aWNlLFxuICAgICAgICBJZ3hUcmVlTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIHsgcHJvdmlkZTogSUdYX1RSRUVfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogSWd4VHJlZUNvbXBvbmVudCB9LFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZUNvbXBvbmVudCBleHRlbmRzIERpc3BsYXlEZW5zaXR5QmFzZSBpbXBsZW1lbnRzIElneFRyZWUsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LXRyZWUnKVxuICAgIHB1YmxpYyBjc3NDbGFzcyA9ICdpZ3gtdHJlZSc7XG5cbiAgICAvKipcbiAgICAgKiBHZXRzL1NldHMgdHJlZSBzZWxlY3Rpb24gbW9kZVxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBCeSBkZWZhdWx0IHRoZSB0cmVlIHNlbGVjdGlvbiBtb2RlIGlzICdOb25lJ1xuICAgICAqIEBwYXJhbSBzZWxlY3Rpb25Nb2RlOiBJZ3hUcmVlU2VsZWN0aW9uVHlwZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBzZWxlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb247XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzZWxlY3Rpb24oc2VsZWN0aW9uTW9kZTogSWd4VHJlZVNlbGVjdGlvblR5cGUpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gc2VsZWN0aW9uTW9kZTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmNsZWFyTm9kZXNTZWxlY3Rpb24oKTtcbiAgICB9XG5cbiAgICAvKiogR2V0L1NldCBob3cgdGhlIHRyZWUgc2hvdWxkIGhhbmRsZSBicmFuY2ggZXhwYW5zaW9uLlxuICAgICAqIElmIHNldCB0byBgdHJ1ZWAsIG9ubHkgYSBzaW5nbGUgYnJhbmNoIGNhbiBiZSBleHBhbmRlZCBhdCBhIHRpbWUsIGNvbGxhcHNpbmcgYWxsIG90aGVyc1xuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdHJlZSBbc2luZ2xlQnJhbmNoRXhwYW5kXT1cInRydWVcIj5cbiAgICAgKiAuLi5cbiAgICAgKiA8L2lneC10cmVlPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHRyZWU6IElneFRyZWUgPSB0aGlzLnRyZWU7XG4gICAgICogdGhpcy50cmVlLnNpbmdsZUJyYW5jaEV4cGFuZCA9IGZhbHNlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNpbmdsZUJyYW5jaEV4cGFuZCA9IGZhbHNlO1xuXG4gICAgLyoqIEdldC9TZXQgdGhlIGFuaW1hdGlvbiBzZXR0aW5ncyB0aGF0IGJyYW5jaGVzIHNob3VsZCB1c2Ugd2hlbiBleHBhbmRpbmcvY29sbHBhc2luZy5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWUgW2FuaW1hdGlvblNldHRpbmdzXT1cImN1c3RvbUFuaW1hdGlvblNldHRpbmdzXCI+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBhbmltYXRpb25TZXR0aW5nczogVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3MgPSB7XG4gICAgICogICAgICBvcGVuQW5pbWF0aW9uOiBncm93VmVySW4sXG4gICAgICogICAgICBjbG9zZUFuaW1hdGlvbjogZ3Jvd1Zlck91dFxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB0aGlzLnRyZWUuYW5pbWF0aW9uU2V0dGluZ3MgPSBhbmltYXRpb25TZXR0aW5ncztcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBhbmltYXRpb25TZXR0aW5nczogVG9nZ2xlQW5pbWF0aW9uU2V0dGluZ3MgPSB7XG4gICAgICAgIG9wZW5BbmltYXRpb246IGdyb3dWZXJJbixcbiAgICAgICAgY2xvc2VBbmltYXRpb246IGdyb3dWZXJPdXRcbiAgICB9O1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgbm9kZSBzZWxlY3Rpb24gaXMgY2hhbmdlZCB0aHJvdWdoIGludGVyYWN0aW9uXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlIChub2RlU2VsZWN0aW9uKT1cImhhbmRsZU5vZGVTZWxlY3Rpb24oJGV2ZW50KVwiPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKmBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlTm9kZVNlbGVjdGlvbihldmVudDogSVRyZWVOb2RlU2VsZWN0aW9uRXZlbnQpIHtcbiAgICAgKiAgY29uc3QgbmV3U2VsZWN0aW9uOiBJZ3hUcmVlTm9kZTxhbnk+W10gPSBldmVudC5uZXdTZWxlY3Rpb247XG4gICAgICogIGNvbnN0IGFkZGVkOiBJZ3hUcmVlTm9kZTxhbnk+W10gPSBldmVudC5hZGRlZDtcbiAgICAgKiAgY29uc29sZS5sb2coXCJOZXcgc2VsZWN0aW9uIHdpbGwgYmU6IFwiLCBuZXdTZWxlY3Rpb24pO1xuICAgICAqICBjb25zb2xlLmxvZyhcIkFkZGVkIG5vZGVzOiBcIiwgZXZlbnQuYWRkZWQpO1xuICAgICAqIH1cbiAgICAgKmBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBub2RlU2VsZWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcjxJVHJlZU5vZGVTZWxlY3Rpb25FdmVudD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gYSBub2RlIGlzIGV4cGFuZGluZywgYmVmb3JlIGl0IGZpbmlzaGVzXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlIChub2RlRXhwYW5kaW5nKT1cImhhbmRsZU5vZGVFeHBhbmRpbmcoJGV2ZW50KVwiPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKmBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgaGFuZGxlTm9kZUV4cGFuZGluZyhldmVudDogSVRyZWVOb2RlVG9nZ2xpbmdFdmVudEFyZ3MpIHtcbiAgICAgKiAgY29uc3QgZXhwYW5kZWROb2RlOiBJZ3hUcmVlTm9kZTxhbnk+ID0gZXZlbnQubm9kZTtcbiAgICAgKiAgaWYgKGV4cGFuZGVkTm9kZS5kaXNhYmxlZCkge1xuICAgICAqICAgICAgZXZlbnQuY2FuY2VsID0gdHJ1ZTtcbiAgICAgKiAgfVxuICAgICAqIH1cbiAgICAgKmBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBub2RlRXhwYW5kaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJVHJlZU5vZGVUb2dnbGluZ0V2ZW50QXJncz4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gYSBub2RlIGlzIGV4cGFuZGVkLCBhZnRlciBpdCBmaW5pc2hlc1xuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdHJlZSAobm9kZUV4cGFuZGVkKT1cImhhbmRsZU5vZGVFeHBhbmRlZCgkZXZlbnQpXCI+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqYGBgdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBoYW5kbGVOb2RlRXhwYW5kZWQoZXZlbnQ6IElUcmVlTm9kZVRvZ2dsZWRFdmVudEFyZ3MpIHtcbiAgICAgKiAgY29uc3QgZXhwYW5kZWROb2RlOiBJZ3hUcmVlTm9kZTxhbnk+ID0gZXZlbnQubm9kZTtcbiAgICAgKiAgY29uc29sZS5sb2coXCJOb2RlIGlzIGV4cGFuZGVkOiBcIiwgZXhwYW5kZWROb2RlLmRhdGEpO1xuICAgICAqIH1cbiAgICAgKmBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBub2RlRXhwYW5kZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElUcmVlTm9kZVRvZ2dsZWRFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIGEgbm9kZSBpcyBjb2xsYXBzaW5nLCBiZWZvcmUgaXQgZmluaXNoZXNcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWUgKG5vZGVDb2xsYXBzaW5nKT1cImhhbmRsZU5vZGVDb2xsYXBzaW5nKCRldmVudClcIj5cbiAgICAgKiA8L2lneC10cmVlPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICpgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGhhbmRsZU5vZGVDb2xsYXBzaW5nKGV2ZW50OiBJVHJlZU5vZGVUb2dnbGluZ0V2ZW50QXJncykge1xuICAgICAqICBjb25zdCBjb2xsYXBzZWROb2RlOiBJZ3hUcmVlTm9kZTxhbnk+ID0gZXZlbnQubm9kZTtcbiAgICAgKiAgaWYgKGNvbGxhcHNlZE5vZGUuYWx3YXlzT3Blbikge1xuICAgICAqICAgICAgZXZlbnQuY2FuY2VsID0gdHJ1ZTtcbiAgICAgKiAgfVxuICAgICAqIH1cbiAgICAgKmBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBub2RlQ29sbGFwc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SVRyZWVOb2RlVG9nZ2xpbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIGEgbm9kZSBpcyBjb2xsYXBzZWQsIGFmdGVyIGl0IGZpbmlzaGVzXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWUgKG5vZGVDb2xsYXBzZWQpPVwiaGFuZGxlTm9kZUNvbGxhcHNlZCgkZXZlbnQpXCI+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIGhhbmRsZU5vZGVDb2xsYXBzZWQoZXZlbnQ6IElUcmVlTm9kZVRvZ2dsZWRFdmVudEFyZ3MpIHtcbiAgICAgKiAgY29uc3QgY29sbGFwc2VkTm9kZTogSWd4VHJlZU5vZGU8YW55PiA9IGV2ZW50Lm5vZGU7XG4gICAgICogIGNvbnNvbGUubG9nKFwiTm9kZSBpcyBjb2xsYXBzZWQ6IFwiLCBjb2xsYXBzZWROb2RlLmRhdGEpO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgbm9kZUNvbGxhcHNlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVRyZWVOb2RlVG9nZ2xlZEV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgYWN0aXZlIG5vZGUgaXMgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgXG4gICAgICogPGlneC10cmVlIChhY3RpdmVOb2RlQ2hhbmdlZCk9XCJhY3RpdmVOb2RlQ2hhbmdlZCgkZXZlbnQpXCI+PC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgYWN0aXZlTm9kZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElneFRyZWVOb2RlPGFueT4+KCk7XG5cbiAgICAvKipcbiAgICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byBiZSB1c2VkIGZvciB0aGUgZXhwYW5kIGluZGljYXRvciBvZiBub2Rlc1xuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogIDxuZy10ZW1wbGF0ZSBpZ3hUcmVlRXhwYW5kSW5kaWNhdG9yIGxldC1leHBhbmRlZD5cbiAgICAgKiAgICAgIDxpZ3gtaWNvbj57eyBleHBhbmRlZCA/IFwiY2xvc2VfZnVsbHNjcmVlblwiOiBcIm9wZW5faW5fZnVsbFwifX08L2lneC1pY29uPlxuICAgICAqICA8L25nLXRlbXBsYXRlPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQENvbnRlbnRDaGlsZChJZ3hUcmVlRXhwYW5kSW5kaWNhdG9yRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIGV4cGFuZEluZGljYXRvcjogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4VHJlZU5vZGVDb21wb25lbnQsIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgICBwdWJsaWMgbm9kZXM6IFF1ZXJ5TGlzdDxJZ3hUcmVlTm9kZUNvbXBvbmVudDxhbnk+PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBkaXNhYmxlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8SWd4VHJlZU5vZGU8YW55Pj4oKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYWxsICoqcm9vdCBsZXZlbCoqIG5vZGVzXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgdHJlZTogSWd4VHJlZSA9IHRoaXMudHJlZTtcbiAgICAgKiBjb25zdCByb290Tm9kZXM6IElneFRyZWVOb2RlQ29tcG9uZW50PGFueT5bXSA9IHRyZWUucm9vdE5vZGVzO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcm9vdE5vZGVzKCk6IElneFRyZWVOb2RlQ29tcG9uZW50PGFueT5bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzPy5maWx0ZXIobm9kZSA9PiBub2RlLmxldmVsID09PSAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gdGhlIGFjdGl2ZSBub2RlIGlzIHNldCB0aHJvdWdoIEFQSVxuICAgICAqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgYWN0aXZlTm9kZUJpbmRpbmdDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPElneFRyZWVOb2RlPGFueT4+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZm9yY2VTZWxlY3QgPSBbXTtcblxuICAgIHByaXZhdGUgX3NlbGVjdGlvbjogSWd4VHJlZVNlbGVjdGlvblR5cGUgPSBJZ3hUcmVlU2VsZWN0aW9uVHlwZS5Ob25lO1xuICAgIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIHByaXZhdGUgdW5zdWJDaGlsZHJlbiQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgbmF2U2VydmljZTogSWd4VHJlZU5hdmlnYXRpb25TZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHNlbGVjdGlvblNlcnZpY2U6IElneFRyZWVTZWxlY3Rpb25TZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHRyZWVTZXJ2aWNlOiBJZ3hUcmVlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChEaXNwbGF5RGVuc2l0eVRva2VuKSBwcm90ZWN0ZWQgX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucz86IElEaXNwbGF5RGVuc2l0eU9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5yZWdpc3Rlcih0aGlzKTtcbiAgICAgICAgdGhpcy50cmVlU2VydmljZS5yZWdpc3Rlcih0aGlzKTtcbiAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLnJlZ2lzdGVyKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4cGFuZHMgYWxsIG9mIHRoZSBwYXNzZWQgbm9kZXMuXG4gICAgICogSWYgbm8gbm9kZXMgYXJlIHBhc3NlZCwgZXhwYW5kcyBBTEwgbm9kZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlcyBub2RlcyB0byBiZSBleHBhbmRlZFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IHRhcmdldE5vZGVzOiBJZ3hUcmVlTm9kZTxhbnk+ID0gdGhpcy50cmVlLmZpbmROb2Rlcyh0cnVlLCAoX2RhdGE6IGFueSwgbm9kZTogSWd4VHJlZU5vZGU8YW55PikgPT4gbm9kZS5kYXRhLmV4cGFuZGFibGUpO1xuICAgICAqIHRyZWUuZXhwYW5kQWxsKG5vZGVzKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwYW5kQWxsKG5vZGVzPzogSWd4VHJlZU5vZGU8YW55PltdKSB7XG4gICAgICAgIG5vZGVzID0gbm9kZXMgfHwgdGhpcy5ub2Rlcy50b0FycmF5KCk7XG4gICAgICAgIG5vZGVzLmZvckVhY2goZSA9PiBlLmV4cGFuZGVkID0gdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29sbGFwc2VzIGFsbCBvZiB0aGUgcGFzc2VkIG5vZGVzLlxuICAgICAqIElmIG5vIG5vZGVzIGFyZSBwYXNzZWQsIGNvbGxhcHNlcyBBTEwgbm9kZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlcyBub2RlcyB0byBiZSBjb2xsYXBzZWRcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCB0YXJnZXROb2RlczogSWd4VHJlZU5vZGU8YW55PiA9IHRoaXMudHJlZS5maW5kTm9kZXModHJ1ZSwgKF9kYXRhOiBhbnksIG5vZGU6IElneFRyZWVOb2RlPGFueT4pID0+IG5vZGUuZGF0YS5jb2xsYXBzaWJsZSk7XG4gICAgICogdHJlZS5jb2xsYXBzZUFsbChub2Rlcyk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNvbGxhcHNlQWxsKG5vZGVzPzogSWd4VHJlZU5vZGU8YW55PltdKSB7XG4gICAgICAgIG5vZGVzID0gbm9kZXMgfHwgdGhpcy5ub2Rlcy50b0FycmF5KCk7XG4gICAgICAgIG5vZGVzLmZvckVhY2goZSA9PiBlLmV4cGFuZGVkID0gZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc2VsZWN0IGFsbCBub2RlcyBpZiB0aGUgbm9kZXMgY29sbGVjdGlvbiBpcyBlbXB0eS4gT3RoZXJ3aXNlLCBkZXNlbGVjdCB0aGUgbm9kZXMgaW4gdGhlIG5vZGVzIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAgY29uc3QgYXJyID0gW1xuICAgICAqICAgICAgdGhpcy50cmVlLm5vZGVzLnRvQXJyYXkoKVswXSxcbiAgICAgKiAgICAgIHRoaXMudHJlZS5ub2Rlcy50b0FycmF5KClbMV1cbiAgICAgKiAgXTtcbiAgICAgKiAgdGhpcy50cmVlLmRlc2VsZWN0QWxsKGFycik7XG4gICAgICogYGBgXG4gICAgICogQHBhcmFtIG5vZGVzOiBJZ3hUcmVlTm9kZUNvbXBvbmVudDxhbnk+W11cbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzZWxlY3RBbGwobm9kZXM/OiBJZ3hUcmVlTm9kZUNvbXBvbmVudDxhbnk+W10pIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmRlc2VsZWN0Tm9kZXNXaXRoTm9FdmVudChub2Rlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbGwgb2YgdGhlIG5vZGVzIHRoYXQgbWF0Y2ggdGhlIHBhc3NlZCBzZWFyY2hUZXJtLlxuICAgICAqIEFjY2VwdHMgYSBjdXN0b20gY29tcGFyZXIgZnVuY3Rpb24gZm9yIGV2YWx1YXRpbmcgdGhlIHNlYXJjaCB0ZXJtIGFnYWluc3QgdGhlIG5vZGVzLlxuICAgICAqXG4gICAgICogQHJlbWFya1xuICAgICAqIERlZmF1bHQgc2VhcmNoIGNvbXBhcmVzIHRoZSBwYXNzZWQgYHNlYXJjaFRlcm1gIGFnYWluc3QgdGhlIG5vZGUncyBgZGF0YWAgSW5wdXQuXG4gICAgICogV2hlbiB1c2luZyBgZmluZE5vZGVzYCB3L28gYSBgY29tcGFyZXJgLCBtYWtlIHN1cmUgYWxsIG5vZGVzIGhhdmUgYGRhdGFgIHBhc3NlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZWFyY2hUZXJtIFRoZSBkYXRhIG9mIHRoZSBzZWFyY2hlZCBub2RlXG4gICAgICogQHBhcmFtIGNvbXBhcmVyIEEgY3VzdG9tIGNvbXBhcmVyIGZ1bmN0aW9uIHRoYXQgZXZhbHVhdGVzIHRoZSBwYXNzZWQgYHNlYXJjaFRlcm1gIGFnYWluc3QgYWxsIG5vZGVzLlxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIG5vZGVzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaC4gYG51bGxgIGlmIG5vIG5vZGVzIGFyZSBmb3VuZC5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogICAgIDxpZ3gtdHJlZS1ub2RlICpuZ0Zvcj1cImxldCBub2RlIG9mIGRhdGFcIiBbZGF0YV09XCJub2RlXCI+XG4gICAgICogICAgICAgICAge3sgbm9kZS5sYWJlbCB9fVxuICAgICAqICAgICA8L2lneC10cmVlLW5vZGU+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgZGF0YTogRGF0YUVudHJ5W10gPSBGRVRDSEVEX0RBVEE7XG4gICAgICogLi4uXG4gICAgICogY29uc3QgbWF0Y2hlZE5vZGVzOiBJZ3hUcmVlTm9kZTxEYXRhRW50cnk+W10gPSB0aGlzLnRyZWUuZmluZE5vZGVzPERhdGFFbnRyeT4oc2VhcmNoVGVybTogZGF0YVs1XSk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBVc2luZyBhIGN1c3RvbSBjb21wYXJlclxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgZGF0YTogRGF0YUVudHJ5W10gPSBGRVRDSEVEX0RBVEE7XG4gICAgICogLi4uXG4gICAgICogY29uc3QgY29tcGFyZXI6IElneFRyZWVTZWFyY2hSZXNvbHZlciA9IChkYXRhOiBhbnksIG5vZGU6IElneFRyZWVOb2RlPERhdGFFbnRyeT4pIHtcbiAgICAgKiAgICAgIHJldHVybiBub2RlLmRhdGEuaW5kZXggJSAyID09PSAwO1xuICAgICAqIH1cbiAgICAgKiBjb25zdCBldmVuSW5kZXhOb2RlczogSWd4VHJlZU5vZGU8RGF0YUVudHJ5PltdID0gdGhpcy50cmVlLmZpbmROb2RlczxEYXRhRW50cnk+KG51bGwsIGNvbXBhcmVyKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZE5vZGVzKHNlYXJjaFRlcm06IGFueSwgY29tcGFyZXI/OiBJZ3hUcmVlU2VhcmNoUmVzb2x2ZXIpOiBJZ3hUcmVlTm9kZUNvbXBvbmVudDxhbnk+W10gfCBudWxsIHtcbiAgICAgICAgY29uc3QgY29tcGFyZUZ1bmMgPSBjb21wYXJlciB8fCB0aGlzLl9jb21wYXJlcjtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHRoaXMubm9kZXMuZmlsdGVyKG5vZGUgPT4gY29tcGFyZUZ1bmMoc2VhcmNoVGVybSwgbm9kZSkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cz8ubGVuZ3RoID09PSAwID8gbnVsbCA6IHJlc3VsdHM7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGhhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLmhhbmRsZUtleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlZENoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5hdlNlcnZpY2UudXBkYXRlX2Rpc2FibGVkX2NhY2hlKGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hY3RpdmVOb2RlQmluZGluZ0NoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChub2RlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZFRvTm9kZSh0aGlzLm5hdlNlcnZpY2UuYWN0aXZlTm9kZSk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbE5vZGVJbnRvVmlldyhub2RlPy5oZWFkZXI/Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbkRlbnNpdHlDaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbE5vZGVJbnRvVmlldyh0aGlzLm5hdlNlcnZpY2UuYWN0aXZlTm9kZT8uaGVhZGVyLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN1YlRvQ29sbGFwc2luZygpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMubm9kZXMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3ViVG9DaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNjcm9sbE5vZGVJbnRvVmlldyh0aGlzLm5hdlNlcnZpY2UuYWN0aXZlTm9kZT8uaGVhZGVyPy5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdGhpcy5zdWJUb0NoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5zdWJDaGlsZHJlbiQubmV4dCgpO1xuICAgICAgICB0aGlzLnVuc3ViQ2hpbGRyZW4kLmNvbXBsZXRlKCk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHBhbmRUb05vZGUobm9kZTogSWd4VHJlZU5vZGU8YW55Pikge1xuICAgICAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUucGF0aC5mb3JFYWNoKG4gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuICE9PSBub2RlICYmICFuLmV4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG4uZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdWJUb0NvbGxhcHNpbmcoKSB7XG4gICAgICAgIHRoaXMubm9kZUNvbGxhcHNpbmcucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLnVwZGF0ZV92aXNpYmxlX2NhY2hlKGV2ZW50Lm5vZGUsIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZUV4cGFuZGluZy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5jYW5jZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5hdlNlcnZpY2UudXBkYXRlX3Zpc2libGVfY2FjaGUoZXZlbnQubm9kZSwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3ViVG9DaGFuZ2VzKCkge1xuICAgICAgICB0aGlzLnVuc3ViQ2hpbGRyZW4kLm5leHQoKTtcbiAgICAgICAgY29uc3QgdG9CZVNlbGVjdGVkID0gWy4uLnRoaXMuZm9yY2VTZWxlY3RdO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdE5vZGVzV2l0aE5vRXZlbnQodG9CZVNlbGVjdGVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZm9yY2VTZWxlY3QgPSBbXTtcbiAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgbm9kZS5leHBhbmRlZENoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLnVuc3ViQ2hpbGRyZW4kKSkuc3Vic2NyaWJlKG5vZGVTdGF0ZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLnVwZGF0ZV92aXNpYmxlX2NhY2hlKG5vZGUsIG5vZGVTdGF0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5vZGUuY2xvc2VBbmltYXRpb25Eb25lLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJDaGlsZHJlbiQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSB0aGlzLm5hdlNlcnZpY2UuZm9jdXNlZE5vZGU/LmhlYWRlci5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsTm9kZUludG9WaWV3KHRhcmdldEVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBub2RlLm9wZW5BbmltYXRpb25Eb25lLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJDaGlsZHJlbiQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSB0aGlzLm5hdlNlcnZpY2UuZm9jdXNlZE5vZGU/LmhlYWRlci5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsTm9kZUludG9WaWV3KHRhcmdldEVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5hdlNlcnZpY2UuaW5pdF9pbnZpc2libGVfY2FjaGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjcm9sbE5vZGVJbnRvVmlldyhlbDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHRyZWVSZWN0ID0gdGhpcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB0b3BPZmZzZXQgPSB0cmVlUmVjdC50b3AgPiBub2RlUmVjdC50b3AgPyBub2RlUmVjdC50b3AgLSB0cmVlUmVjdC50b3AgOiAwO1xuICAgICAgICBjb25zdCBib3R0b21PZmZzZXQgPSB0cmVlUmVjdC5ib3R0b20gPCBub2RlUmVjdC5ib3R0b20gPyBub2RlUmVjdC5ib3R0b20gLSB0cmVlUmVjdC5ib3R0b20gOiAwO1xuICAgICAgICBjb25zdCBzaG91bGRTY3JvbGwgPSAhIXRvcE9mZnNldCB8fCAhIWJvdHRvbU9mZnNldDtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCAmJiB0aGlzLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgLy8gdGhpcy5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IG5vZGVSZWN0LnkgLSB0cmVlUmVjdC55IC0gbm9kZVJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9XG4gICAgICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wICsgYm90dG9tT2Zmc2V0ICsgdG9wT2Zmc2V0ICsgKHRvcE9mZnNldCA/IC0xIDogKzEpICogbm9kZVJlY3QuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY29tcGFyZXIgPSA8VD4oZGF0YTogVCwgbm9kZTogSWd4VHJlZU5vZGVDb21wb25lbnQ8VD4pID0+IG5vZGUuZGF0YSA9PT0gZGF0YTtcblxufVxuXG4vKipcbiAqIEBoaWRkZW5cbiAqXG4gKiBOZ01vZHVsZSBkZWZpbmluZyB0aGUgY29tcG9uZW50cyBhbmQgZGlyZWN0aXZlcyBuZWVkZWQgZm9yIGBpZ3gtdHJlZWBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSWd4VHJlZVNlbGVjdE1hcmtlckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4VHJlZUV4cGFuZEluZGljYXRvckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4VHJlZU5vZGVMaW5rRGlyZWN0aXZlLFxuICAgICAgICBJZ3hUcmVlQ29tcG9uZW50LFxuICAgICAgICBJZ3hUcmVlTm9kZUNvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBJZ3hJY29uTW9kdWxlLFxuICAgICAgICBJZ3hJbnB1dEdyb3VwTW9kdWxlLFxuICAgICAgICBJZ3hDaGVja2JveE1vZHVsZSxcbiAgICAgICAgSWd4UHJvZ3Jlc3NCYXJNb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgSWd4VHJlZVNlbGVjdE1hcmtlckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4VHJlZUV4cGFuZEluZGljYXRvckRpcmVjdGl2ZSxcbiAgICAgICAgSWd4VHJlZU5vZGVMaW5rRGlyZWN0aXZlLFxuICAgICAgICBJZ3hUcmVlQ29tcG9uZW50LFxuICAgICAgICBJZ3hUcmVlTm9kZUNvbXBvbmVudCxcbiAgICAgICAgSWd4SWNvbk1vZHVsZSxcbiAgICAgICAgSWd4SW5wdXRHcm91cE1vZHVsZSxcbiAgICAgICAgSWd4Q2hlY2tib3hNb2R1bGUsXG4gICAgICAgIElneEV4cGFuc2lvblBhbmVsTW9kdWxlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hUcmVlTW9kdWxlIHtcbn1cbiIsIjxkaXYgY2xhc3M9XCJpZ3gtdHJlZV9fcm9vdFwiIHJvbGU9XCJ0cmVlXCIgKGtleWRvd24pPVwiaGFuZGxlS2V5ZG93bigkZXZlbnQpXCI+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiaWd4LXRyZWUtbm9kZVwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuIl19