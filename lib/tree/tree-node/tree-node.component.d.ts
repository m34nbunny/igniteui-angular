import { AnimationBuilder } from '@angular/animations';
import { OnInit, OnDestroy, TemplateRef, QueryList, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ToggleAnimationPlayer, ToggleAnimationSettings } from '../../expansion-panel/toggle-animation-component';
import { IgxTree, IgxTreeNode } from '../common';
import { IgxTreeSelectionService } from '../tree-selection.service';
import { IgxTreeNavigationService } from '../tree-navigation.service';
import { IgxTreeService } from '../tree.service';
import { ITreeResourceStrings } from '../../core/i18n/tree-resources';
import * as i0 from "@angular/core";
/**
 * @hidden @internal
 * Used for links (`a` tags) in the body of an `igx-tree-node`. Handles aria and event dispatch.
 */
export declare class IgxTreeNodeLinkDirective implements OnDestroy {
    private node;
    private navService;
    elementRef: ElementRef;
    role: string;
    /**
     * The node's parent. Should be used only when the link is defined
     * in `<ng-template>` tag outside of its parent, as Angular DI will not properly provide a reference
     *
     * ```html
     * <igx-tree>
     *     <igx-tree-node #myNode *ngFor="let node of data" [data]="node">
     *         <ng-template *ngTemplateOutlet="nodeTemplate; context: { $implicit: data, parentNode: myNode }">
     *         </ng-template>
     *     </igx-tree-node>
     *     ...
     *     <!-- node template is defined under tree to access related services -->
     *     <ng-template #nodeTemplate let-data let-node="parentNode">
     *         <a [igxTreeNodeLink]="node">{{ data.label }}</a>
     *     </ng-template>
     * </igx-tree>
     * ```
     */
    set parentNode(val: any);
    get parentNode(): any;
    /** A pointer to the parent node */
    private get target();
    private _parentNode;
    constructor(node: IgxTreeNode<any>, navService: IgxTreeNavigationService, elementRef: ElementRef);
    /** @hidden @internal */
    get tabIndex(): number;
    /**
     * @hidden @internal
     * Clear the node's focused state
     */
    handleBlur(): void;
    /**
     * @hidden @internal
     * Set the node as focused
     */
    handleFocus(): void;
    ngOnDestroy(): void;
    static ??fac: i0.????FactoryDeclaration<IgxTreeNodeLinkDirective, [{ optional: true; }, null, null]>;
    static ??dir: i0.????DirectiveDeclaration<IgxTreeNodeLinkDirective, "[igxTreeNodeLink]", never, { "parentNode": "igxTreeNodeLink"; }, {}, never>;
}
/**
 *
 * The tree node component represents a child node of the tree component or another tree node.
 * Usage:
 *
 * ```html
 *  <igx-tree>
 *  ...
 *    <igx-tree-node [data]="data" [selected]="service.isNodeSelected(data.Key)" [expanded]="service.isNodeExpanded(data.Key)">
 *      {{ data.FirstName }} {{ data.LastName }}
 *    </igx-tree-node>
 *  ...
 *  </igx-tree>
 * ```
 */
export declare class IgxTreeNodeComponent<T> extends ToggleAnimationPlayer implements IgxTreeNode<T>, OnInit, OnDestroy {
    tree: IgxTree;
    protected selectionService: IgxTreeSelectionService;
    protected treeService: IgxTreeService;
    protected navService: IgxTreeNavigationService;
    protected cdr: ChangeDetectorRef;
    protected builder: AnimationBuilder;
    private element;
    parentNode: IgxTreeNode<any>;
    /**
     * The data entry that the node is visualizing.
     *
     * @remarks
     * Required for searching through nodes.
     *
     * @example
     * ```html
     *  <igx-tree>
     *  ...
     *    <igx-tree-node [data]="data">
     *      {{ data.FirstName }} {{ data.LastName }}
     *    </igx-tree-node>
     *  ...
     *  </igx-tree>
     * ```
     */
    data: T;
    /**
     * To be used for load-on-demand scenarios in order to specify whether the node is loading data.
     *
     * @remarks
     * Loading nodes do not render children.
     */
    loading: boolean;
    /** @hidden @internal */
    set tabIndex(val: number);
    /** @hidden @internal */
    get tabIndex(): number;
    /** @hidden @internal */
    get animationSettings(): ToggleAnimationSettings;
    /**
     * Gets/Sets the resource strings.
     *
     * @remarks
     * Uses EN resources by default.
     */
    set resourceStrings(value: ITreeResourceStrings);
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings(): ITreeResourceStrings;
    /**
     * Gets/Sets the active state of the node
     *
     * @param value: boolean
     */
    set active(value: boolean);
    get active(): boolean;
    /**
     * Emitted when the node's `selected` property changes.
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node *ngFor="let node of data" [data]="node" [(selected)]="node.selected">
     *      </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * node.selectedChange.pipe(takeUntil(this.destroy$)).subscribe((e: boolean) => console.log("Node selection changed to ", e))
     * ```
     */
    selectedChange: EventEmitter<boolean>;
    /**
     * Emitted when the node's `expanded` property changes.
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node *ngFor="let node of data" [data]="node" [(expanded)]="node.expanded">
     *      </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * node.expandedChange.pipe(takeUntil(this.destroy$)).subscribe((e: boolean) => console.log("Node expansion state changed to ", e))
     * ```
     */
    expandedChange: EventEmitter<boolean>;
    /** @hidden @internal */
    get focused(): boolean;
    /**
     * Retrieves the full path to the node incuding itself
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * const path: IgxTreeNode<any>[] = node.path;
     * ```
     */
    get path(): IgxTreeNode<any>[];
    /**
     * Gets/Sets the disabled state of the node
     *
     * @param value: boolean
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    /** @hidden @internal */
    cssClass: string;
    /** @hidden @internal */
    get role(): "none" | "treeitem";
    /** @hidden @internal */
    linkChildren: QueryList<ElementRef>;
    /** @hidden @internal */
    _children: QueryList<IgxTreeNode<any>>;
    /** @hidden @internal */
    allChildren: QueryList<IgxTreeNode<any>>;
    /**
     * Return the child nodes of the node (if any)
     *
     * @remark
     * Returns `null` if node does not have children
     *
     * @example
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * const children: IgxTreeNode<any>[] = node.children;
     * ```
     */
    get children(): IgxTreeNode<any>[];
    /** @hidden @internal */
    header: ElementRef;
    private _defaultExpandIndicatorTemplate;
    private childrenContainer;
    private get hasLinkChildren();
    /** @hidden @internal */
    get isCompact(): boolean;
    /** @hidden @internal */
    get isCosy(): boolean;
    /** @hidden @internal */
    isFocused: boolean;
    /** @hidden @internal */
    registeredChildren: IgxTreeNodeLinkDirective[];
    /** @hidden @internal */
    private _resourceStrings;
    private _tabIndex;
    private _disabled;
    constructor(tree: IgxTree, selectionService: IgxTreeSelectionService, treeService: IgxTreeService, navService: IgxTreeNavigationService, cdr: ChangeDetectorRef, builder: AnimationBuilder, element: ElementRef<HTMLElement>, parentNode: IgxTreeNode<any>);
    /**
     * @hidden @internal
     */
    get showSelectors(): boolean;
    /**
     * @hidden @internal
     */
    get indeterminate(): boolean;
    /** The depth of the node, relative to the root
     *
     * ```html
     * <igx-tree>
     *  ...
     *  <igx-tree-node #node>
     *      My level is {{ node.level }}
     *  </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[12])[0];
     * const level: number = node.level;
     * ```
     */
    get level(): number;
    /** Get/set whether the node is selected. Supporst two-way binding.
     *
     * ```html
     * <igx-tree>
     *  ...
     *  <igx-tree-node *ngFor="let node of data" [(selected)]="node.selected">
     *      {{ node.label }}
     *  </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * const selected = node.selected;
     * node.selected = true;
     * ```
     */
    get selected(): boolean;
    set selected(val: boolean);
    /** Get/set whether the node is expanded
     *
     * ```html
     * <igx-tree>
     *  ...
     *  <igx-tree-node *ngFor="let node of data" [expanded]="node.name === this.expandedNode">
     *      {{ node.label }}
     *  </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * const expanded = node.expanded;
     * node.expanded = true;
     * ```
     */
    get expanded(): boolean;
    set expanded(val: boolean);
    /** @hidden @internal */
    get expandIndicatorTemplate(): TemplateRef<any>;
    /**
     * The native DOM element representing the node. Could be null in certain environments.
     *
     * ```typescript
     * // get the nativeElement of the second node
     * const node: IgxTreeNode = this.tree.nodes.first();
     * const nodeElement: HTMLElement = node.nativeElement;
     * ```
     */
    /** @hidden @internal */
    get nativeElement(): HTMLElement;
    /** @hidden @internal */
    ngOnInit(): void;
    /**
     * @hidden @internal
     * Sets the focus to the node's <a> child, if present
     * Sets the node as the tree service's focusedNode
     * Marks the node as the current active element
     */
    handleFocus(): void;
    /**
     * @hidden @internal
     * Clear the node's focused status
     */
    clearFocus(): void;
    /**
     * @hidden @internal
     */
    onSelectorClick(event: any): void;
    /**
     * Toggles the node expansion state, triggering animation
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node #node>My Node</igx-tree-node>
     * </igx-tree>
     * <button igxButton (click)="node.toggle()">Toggle Node</button>
     * ```
     *
     * ```typescript
     * const myNode: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * myNode.toggle();
     * ```
     */
    toggle(): void;
    /** @hidden @internal */
    indicatorClick(): void;
    /**
     * @hidden @internal
     */
    onPointerDown(event: any): void;
    ngOnDestroy(): void;
    /**
     * Expands the node, triggering animation
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node #node>My Node</igx-tree-node>
     * </igx-tree>
     * <button igxButton (click)="node.expand()">Expand Node</button>
     * ```
     *
     * ```typescript
     * const myNode: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * myNode.expand();
     * ```
     */
    expand(): void;
    /**
     * Collapses the node, triggering animation
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node #node>My Node</igx-tree-node>
     * </igx-tree>
     * <button igxButton (click)="node.collapse()">Collapse Node</button>
     * ```
     *
     * ```typescript
     * const myNode: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * myNode.collapse();
     * ```
     */
    collapse(): void;
    /** @hidden @internal */
    addLinkChild(link: IgxTreeNodeLinkDirective): void;
    /** @hidden @internal */
    removeLinkChild(link: IgxTreeNodeLinkDirective): void;
    static ??fac: i0.????FactoryDeclaration<IgxTreeNodeComponent<any>, [null, null, null, null, null, null, null, { optional: true; skipSelf: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxTreeNodeComponent<any>, "igx-tree-node", never, { "data": "data"; "loading": "loading"; "resourceStrings": "resourceStrings"; "active": "active"; "disabled": "disabled"; "selected": "selected"; "expanded": "expanded"; }, { "selectedChange": "selectedChange"; "expandedChange": "expandedChange"; }, ["linkChildren", "_children", "allChildren"], ["igx-tree-node", "*"]>;
}
