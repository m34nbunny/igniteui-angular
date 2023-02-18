import { Component, Input, Inject, ViewChild, TemplateRef, ContentChildren, Optional, SkipSelf, HostBinding, ElementRef, Output, EventEmitter, Directive, HostListener } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ToggleAnimationPlayer } from '../../expansion-panel/toggle-animation-component';
import { IGX_TREE_COMPONENT, IGX_TREE_NODE_COMPONENT, IgxTreeSelectionType } from '../common';
import { CurrentResourceStrings } from '../../core/i18n/resources';
import { DisplayDensity } from '../../core/displayDensity';
import * as i0 from "@angular/core";
import * as i1 from "../tree-navigation.service";
import * as i2 from "../tree-selection.service";
import * as i3 from "../tree.service";
import * as i4 from "@angular/animations";
import * as i5 from "../../icon/icon.component";
import * as i6 from "../../checkbox/checkbox.component";
import * as i7 from "../../progressbar/progressbar.component";
import * as i8 from "@angular/common";
// TODO: Implement aria functionality
/**
 * @hidden @internal
 * Used for links (`a` tags) in the body of an `igx-tree-node`. Handles aria and event dispatch.
 */
export class IgxTreeNodeLinkDirective {
    constructor(node, navService, elementRef) {
        this.node = node;
        this.navService = navService;
        this.elementRef = elementRef;
        this.role = 'treeitem';
        this._parentNode = null;
    }
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
    set parentNode(val) {
        if (val) {
            this._parentNode = val;
            this._parentNode.addLinkChild(this);
        }
    }
    get parentNode() {
        return this._parentNode;
    }
    /** A pointer to the parent node */
    get target() {
        return this.node || this.parentNode;
    }
    /** @hidden @internal */
    get tabIndex() {
        return this.navService.focusedNode === this.target ? (this.target?.disabled ? -1 : 0) : -1;
    }
    /**
     * @hidden @internal
     * Clear the node's focused state
     */
    handleBlur() {
        this.target.isFocused = false;
    }
    /**
     * @hidden @internal
     * Set the node as focused
     */
    handleFocus() {
        if (this.target && !this.target.disabled) {
            if (this.navService.focusedNode !== this.target) {
                this.navService.focusedNode = this.target;
            }
            this.target.isFocused = true;
        }
    }
    ngOnDestroy() {
        this.target.removeLinkChild(this);
    }
}
IgxTreeNodeLinkDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeNodeLinkDirective, deps: [{ token: IGX_TREE_NODE_COMPONENT, optional: true }, { token: i1.IgxTreeNavigationService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxTreeNodeLinkDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeNodeLinkDirective, selector: "[igxTreeNodeLink]", inputs: { parentNode: ["igxTreeNodeLink", "parentNode"] }, host: { listeners: { "blur": "handleBlur()", "focus": "handleFocus()" }, properties: { "attr.role": "this.role", "attr.tabindex": "this.tabIndex" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeNodeLinkDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `[igxTreeNodeLink]`
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_TREE_NODE_COMPONENT]
                }] }, { type: i1.IgxTreeNavigationService }, { type: i0.ElementRef }]; }, propDecorators: { role: [{
                type: HostBinding,
                args: ['attr.role']
            }], parentNode: [{
                type: Input,
                args: ['igxTreeNodeLink']
            }], tabIndex: [{
                type: HostBinding,
                args: ['attr.tabindex']
            }], handleBlur: [{
                type: HostListener,
                args: ['blur']
            }], handleFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });
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
export class IgxTreeNodeComponent extends ToggleAnimationPlayer {
    constructor(tree, selectionService, treeService, navService, cdr, builder, element, parentNode) {
        super(builder);
        this.tree = tree;
        this.selectionService = selectionService;
        this.treeService = treeService;
        this.navService = navService;
        this.cdr = cdr;
        this.builder = builder;
        this.element = element;
        this.parentNode = parentNode;
        /**
         * To be used for load-on-demand scenarios in order to specify whether the node is loading data.
         *
         * @remarks
         * Loading nodes do not render children.
         */
        this.loading = false;
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
        this.selectedChange = new EventEmitter();
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
        this.expandedChange = new EventEmitter();
        /** @hidden @internal */
        this.cssClass = 'igx-tree-node';
        /** @hidden @internal */
        this.registeredChildren = [];
        /** @hidden @internal */
        this._resourceStrings = CurrentResourceStrings.TreeResStrings;
        this._tabIndex = null;
        this._disabled = false;
    }
    // TO DO: return different tab index depending on anchor child
    /** @hidden @internal */
    set tabIndex(val) {
        this._tabIndex = val;
    }
    /** @hidden @internal */
    get tabIndex() {
        if (this.disabled) {
            return -1;
        }
        if (this._tabIndex === null) {
            if (this.navService.focusedNode === null) {
                return this.hasLinkChildren ? -1 : 0;
            }
            return -1;
        }
        return this.hasLinkChildren ? -1 : this._tabIndex;
    }
    /** @hidden @internal */
    get animationSettings() {
        return this.tree.animationSettings;
    }
    /**
     * Gets/Sets the resource strings.
     *
     * @remarks
     * Uses EN resources by default.
     */
    set resourceStrings(value) {
        this._resourceStrings = Object.assign({}, this._resourceStrings, value);
    }
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings() {
        if (!this._resourceStrings) {
            this._resourceStrings = CurrentResourceStrings.TreeResStrings;
        }
        return this._resourceStrings;
    }
    /**
     * Gets/Sets the active state of the node
     *
     * @param value: boolean
     */
    set active(value) {
        if (value) {
            this.navService.activeNode = this;
            this.tree.activeNodeBindingChange.emit(this);
        }
    }
    get active() {
        return this.navService.activeNode === this;
    }
    /** @hidden @internal */
    get focused() {
        return this.isFocused &&
            this.navService.focusedNode === this;
    }
    /**
     * Retrieves the full path to the node incuding itself
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * const path: IgxTreeNode<any>[] = node.path;
     * ```
     */
    get path() {
        return this.parentNode?.path ? [...this.parentNode.path, this] : [this];
    }
    // TODO: bind to disabled state when node is dragged
    /**
     * Gets/Sets the disabled state of the node
     *
     * @param value: boolean
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (value !== this._disabled) {
            this._disabled = value;
            this.tree.disabledChange.emit(this);
        }
    }
    /** @hidden @internal */
    get role() {
        return this.hasLinkChildren ? 'none' : 'treeitem';
    }
    ;
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
    get children() {
        return this._children?.length ? this._children.toArray() : null;
    }
    get hasLinkChildren() {
        return this.linkChildren?.length > 0 || this.registeredChildren?.length > 0;
    }
    /** @hidden @internal */
    get isCompact() {
        return this.tree?.displayDensity === DisplayDensity.compact;
    }
    /** @hidden @internal */
    get isCosy() {
        return this.tree?.displayDensity === DisplayDensity.cosy;
    }
    /**
     * @hidden @internal
     */
    get showSelectors() {
        return this.tree.selection !== IgxTreeSelectionType.None;
    }
    /**
     * @hidden @internal
     */
    get indeterminate() {
        return this.selectionService.isNodeIndeterminate(this);
    }
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
    get level() {
        return this.parentNode ? this.parentNode.level + 1 : 0;
    }
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
    get selected() {
        return this.selectionService.isNodeSelected(this);
    }
    set selected(val) {
        if (!(this.tree?.nodes && this.tree.nodes.find((e) => e === this)) && val) {
            this.tree.forceSelect.push(this);
            return;
        }
        if (val && !this.selectionService.isNodeSelected(this)) {
            this.selectionService.selectNodesWithNoEvent([this]);
        }
        if (!val && this.selectionService.isNodeSelected(this)) {
            this.selectionService.deselectNodesWithNoEvent([this]);
        }
    }
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
    get expanded() {
        return this.treeService.isExpanded(this);
    }
    set expanded(val) {
        if (val) {
            this.treeService.expand(this, false);
        }
        else {
            this.treeService.collapse(this);
        }
    }
    /** @hidden @internal */
    get expandIndicatorTemplate() {
        return this.tree?.expandIndicator ? this.tree.expandIndicator : this._defaultExpandIndicatorTemplate;
    }
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
    get nativeElement() {
        return this.element.nativeElement;
    }
    /** @hidden @internal */
    ngOnInit() {
        this.openAnimationDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.tree.nodeExpanded.emit({ owner: this.tree, node: this });
        });
        this.closeAnimationDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.tree.nodeCollapsed.emit({ owner: this.tree, node: this });
            this.treeService.collapse(this);
            this.cdr.markForCheck();
        });
    }
    /**
     * @hidden @internal
     * Sets the focus to the node's <a> child, if present
     * Sets the node as the tree service's focusedNode
     * Marks the node as the current active element
     */
    handleFocus() {
        if (this.disabled) {
            return;
        }
        if (this.navService.focusedNode !== this) {
            this.navService.focusedNode = this;
        }
        this.isFocused = true;
        if (this.linkChildren?.length) {
            this.linkChildren.first.nativeElement.focus();
            return;
        }
        if (this.registeredChildren.length) {
            this.registeredChildren[0].elementRef.nativeElement.focus();
            return;
        }
    }
    /**
     * @hidden @internal
     * Clear the node's focused status
     */
    clearFocus() {
        this.isFocused = false;
    }
    /**
     * @hidden @internal
     */
    onSelectorClick(event) {
        // event.stopPropagation();
        event.preventDefault();
        // this.navService.handleFocusedAndActiveNode(this);
        if (event.shiftKey) {
            this.selectionService.selectMultipleNodes(this, event);
            return;
        }
        if (this.selected) {
            this.selectionService.deselectNode(this, event);
        }
        else {
            this.selectionService.selectNode(this, event);
        }
    }
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
    toggle() {
        if (this.expanded) {
            this.collapse();
        }
        else {
            this.expand();
        }
    }
    /** @hidden @internal */
    indicatorClick() {
        this.toggle();
        this.navService.setFocusedAndActiveNode(this);
    }
    /**
     * @hidden @internal
     */
    onPointerDown(event) {
        event.stopPropagation();
        this.navService.setFocusedAndActiveNode(this);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.selectionService.ensureStateOnNodeDelete(this);
    }
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
    expand() {
        const args = {
            owner: this.tree,
            node: this,
            cancel: false
        };
        this.tree.nodeExpanding.emit(args);
        if (!args.cancel) {
            this.treeService.expand(this, true);
            this.cdr.detectChanges();
            this.playOpenAnimation(this.childrenContainer);
        }
    }
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
    collapse() {
        const args = {
            owner: this.tree,
            node: this,
            cancel: false
        };
        this.tree.nodeCollapsing.emit(args);
        if (!args.cancel) {
            this.treeService.collapsing(this);
            this.playCloseAnimation(this.childrenContainer);
        }
    }
    /** @hidden @internal */
    addLinkChild(link) {
        this._tabIndex = -1;
        this.registeredChildren.push(link);
    }
    ;
    /** @hidden @internal */
    removeLinkChild(link) {
        const index = this.registeredChildren.indexOf(link);
        if (index !== -1) {
            this.registeredChildren.splice(index, 1);
        }
    }
}
IgxTreeNodeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeNodeComponent, deps: [{ token: IGX_TREE_COMPONENT }, { token: i2.IgxTreeSelectionService }, { token: i3.IgxTreeService }, { token: i1.IgxTreeNavigationService }, { token: i0.ChangeDetectorRef }, { token: i4.AnimationBuilder }, { token: i0.ElementRef }, { token: IGX_TREE_NODE_COMPONENT, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.Component });
IgxTreeNodeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: IgxTreeNodeComponent, selector: "igx-tree-node", inputs: { data: "data", loading: "loading", resourceStrings: "resourceStrings", active: "active", disabled: "disabled", selected: "selected", expanded: "expanded" }, outputs: { selectedChange: "selectedChange", expandedChange: "expandedChange" }, host: { properties: { "class.igx-tree-node--disabled": "this.disabled", "class.igx-tree-node": "this.cssClass", "attr.role": "this.role" } }, providers: [
        { provide: IGX_TREE_NODE_COMPONENT, useExisting: IgxTreeNodeComponent }
    ], queries: [{ propertyName: "linkChildren", predicate: IgxTreeNodeLinkDirective, read: ElementRef }, { propertyName: "_children", predicate: IGX_TREE_NODE_COMPONENT, read: IGX_TREE_NODE_COMPONENT }, { propertyName: "allChildren", predicate: IGX_TREE_NODE_COMPONENT, descendants: true, read: IGX_TREE_NODE_COMPONENT }], viewQueries: [{ propertyName: "header", first: true, predicate: ["ghostTemplate"], descendants: true, read: ElementRef }, { propertyName: "_defaultExpandIndicatorTemplate", first: true, predicate: ["defaultIndicator"], descendants: true, read: TemplateRef, static: true }, { propertyName: "childrenContainer", first: true, predicate: ["childrenContainer"], descendants: true, read: ElementRef }], usesInheritance: true, ngImport: i0, template: "<ng-template #noDragTemplate>\n    <ng-template *ngTemplateOutlet=\"headerTemplate\"></ng-template>\n</ng-template>\n\n<!-- Will switch templates depending on dragDrop -->\n<ng-template *ngTemplateOutlet=\"noDragTemplate\">\n</ng-template>\n\n<div #childrenContainer\n    *ngIf=\"expanded && !loading\"\n    class=\"igx-tree-node__group\"\n    role=\"group\"\n>\n    <ng-content select=\"igx-tree-node\"></ng-content>\n</div>\n\n\n<ng-template #defaultIndicator>\n    <igx-icon [attr.aria-label]=\"expanded ? resourceStrings.igx_collapse : resourceStrings.igx_expand\">\n        {{ expanded ? \"keyboard_arrow_down\" : \"keyboard_arrow_right\" }}\n    </igx-icon>\n</ng-template>\n\n<!-- separated in a template in case this ever needs to be templatable -->\n<ng-template #selectMarkerTemplate>\n    <igx-checkbox [checked]=\"selected\" [readonly]=\"true\" [indeterminate]=\"indeterminate\" [tabindex]=\"-1\">\n    </igx-checkbox>\n</ng-template>\n\n<ng-template #headerTemplate>\n    <div #ghostTemplate class=\"igx-tree-node__wrapper\"\n        [attr.role]=\"role\"\n        [tabIndex]=\"tabIndex\"\n        [ngClass]=\"{\n            'igx-tree-node__wrapper--cosy': isCosy,\n            'igx-tree-node__wrapper--compact': isCompact,\n            'igx-tree-node__wrapper--selected': selected,\n            'igx-tree-node__wrapper--active' : this.active,\n            'igx-tree-node__wrapper--focused' : this.focused,\n            'igx-tree-node__wrapper--disabled' : this.disabled\n        }\"\n        (pointerdown)=\"onPointerDown($event)\"\n        (focus)=\"handleFocus()\"\n        (blur)=\"clearFocus()\"\n    >\n        <div aria-hidden=\"true\">\n            <span *ngFor=\"let item of [].constructor(level)\"\n                aria-hidden=\"true\"\n                class=\"igx-tree-node__spacer\"\n            ></span>\n        </div>\n\n        <!-- Expand/Collapse indicator -->\n        <span *ngIf=\"!loading\"\n            class=\"igx-tree-node__toggle-button\"\n            [ngClass]=\"{ 'igx-tree-node__toggle-button--hidden': !_children?.length }\"\n            (click)=\"indicatorClick()\"\n        >\n            <ng-container *ngTemplateOutlet=\"expandIndicatorTemplate, context: { $implicit: expanded }\">\n            </ng-container>\n        </span>\n        <span *ngIf=\"loading\"\n            class=\"igx-tree-node__toggle-button\"\n        >\n        \t<igx-circular-bar\n            \t[animate]=\"false\"\n            \t[indeterminate]=\"true\"\n            \t[textVisibility]=\"false\"\n        \t>\n        \t</igx-circular-bar>\n        </span>\n\n        <!-- Item selection -->\n        <div *ngIf=\"showSelectors\"\n            class=\"igx-tree-node__select\"\n            (pointerdown)=\"$event.preventDefault()\"\n            (click)=\"onSelectorClick($event)\">\n            <ng-container *ngTemplateOutlet=\"selectMarkerTemplate\">\n            </ng-container>\n        </div>\n\n        <div class=\"igx-tree-node__content\">\n            <!-- Ghost content -->\n            <ng-content></ng-content>\n        </div>\n    </div>\n\n    <!--  Buffer element for 'move after' when D&D is implemented-->\n    <div class=\"igx-tree-node__drop-indicator\">\n        <span aria-hidden=\"true\" class=\"igx-tree-node__spacer\" *ngFor=\"let item of [].constructor(level)\"></span>\n        <!-- style rules target this div, do not delete it -->\n        <div></div>\n    </div>\n</ng-template>\n\n<ng-template #dragTemplate>\n    <!-- Drag drop goes here\n        igxDrop\n        #dropRef=\"drop\"\n        [igxNodeDrag]=\"this\"\n        (dragStart)=\"logDrop(dropRef)\"\n        (leave)=\"emitLeave()\"\n        (enter)=\"emitEnter()\" -->\n    <div class=\"igx-tree-node__drag-wrapper\">\n        <ng-template *ngTemplateOutlet=\"headerTemplate\"></ng-template>\n    </div>\n</ng-template>\n", components: [{ type: i5.IgxIconComponent, selector: "igx-icon", inputs: ["family", "active", "name"] }, { type: i6.IgxCheckboxComponent, selector: "igx-checkbox", inputs: ["id", "labelId", "value", "name", "tabindex", "labelPosition", "disableRipple", "required", "aria-labelledby", "aria-label", "indeterminate", "checked", "disabled", "readonly", "disableTransitions"], outputs: ["change"] }, { type: i7.IgxCircularProgressBarComponent, selector: "igx-circular-bar", inputs: ["id", "isIndeterminate", "textVisibility", "text"] }], directives: [{ type: i8.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i8.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i8.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i8.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTreeNodeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'igx-tree-node', providers: [
                        { provide: IGX_TREE_NODE_COMPONENT, useExisting: IgxTreeNodeComponent }
                    ], template: "<ng-template #noDragTemplate>\n    <ng-template *ngTemplateOutlet=\"headerTemplate\"></ng-template>\n</ng-template>\n\n<!-- Will switch templates depending on dragDrop -->\n<ng-template *ngTemplateOutlet=\"noDragTemplate\">\n</ng-template>\n\n<div #childrenContainer\n    *ngIf=\"expanded && !loading\"\n    class=\"igx-tree-node__group\"\n    role=\"group\"\n>\n    <ng-content select=\"igx-tree-node\"></ng-content>\n</div>\n\n\n<ng-template #defaultIndicator>\n    <igx-icon [attr.aria-label]=\"expanded ? resourceStrings.igx_collapse : resourceStrings.igx_expand\">\n        {{ expanded ? \"keyboard_arrow_down\" : \"keyboard_arrow_right\" }}\n    </igx-icon>\n</ng-template>\n\n<!-- separated in a template in case this ever needs to be templatable -->\n<ng-template #selectMarkerTemplate>\n    <igx-checkbox [checked]=\"selected\" [readonly]=\"true\" [indeterminate]=\"indeterminate\" [tabindex]=\"-1\">\n    </igx-checkbox>\n</ng-template>\n\n<ng-template #headerTemplate>\n    <div #ghostTemplate class=\"igx-tree-node__wrapper\"\n        [attr.role]=\"role\"\n        [tabIndex]=\"tabIndex\"\n        [ngClass]=\"{\n            'igx-tree-node__wrapper--cosy': isCosy,\n            'igx-tree-node__wrapper--compact': isCompact,\n            'igx-tree-node__wrapper--selected': selected,\n            'igx-tree-node__wrapper--active' : this.active,\n            'igx-tree-node__wrapper--focused' : this.focused,\n            'igx-tree-node__wrapper--disabled' : this.disabled\n        }\"\n        (pointerdown)=\"onPointerDown($event)\"\n        (focus)=\"handleFocus()\"\n        (blur)=\"clearFocus()\"\n    >\n        <div aria-hidden=\"true\">\n            <span *ngFor=\"let item of [].constructor(level)\"\n                aria-hidden=\"true\"\n                class=\"igx-tree-node__spacer\"\n            ></span>\n        </div>\n\n        <!-- Expand/Collapse indicator -->\n        <span *ngIf=\"!loading\"\n            class=\"igx-tree-node__toggle-button\"\n            [ngClass]=\"{ 'igx-tree-node__toggle-button--hidden': !_children?.length }\"\n            (click)=\"indicatorClick()\"\n        >\n            <ng-container *ngTemplateOutlet=\"expandIndicatorTemplate, context: { $implicit: expanded }\">\n            </ng-container>\n        </span>\n        <span *ngIf=\"loading\"\n            class=\"igx-tree-node__toggle-button\"\n        >\n        \t<igx-circular-bar\n            \t[animate]=\"false\"\n            \t[indeterminate]=\"true\"\n            \t[textVisibility]=\"false\"\n        \t>\n        \t</igx-circular-bar>\n        </span>\n\n        <!-- Item selection -->\n        <div *ngIf=\"showSelectors\"\n            class=\"igx-tree-node__select\"\n            (pointerdown)=\"$event.preventDefault()\"\n            (click)=\"onSelectorClick($event)\">\n            <ng-container *ngTemplateOutlet=\"selectMarkerTemplate\">\n            </ng-container>\n        </div>\n\n        <div class=\"igx-tree-node__content\">\n            <!-- Ghost content -->\n            <ng-content></ng-content>\n        </div>\n    </div>\n\n    <!--  Buffer element for 'move after' when D&D is implemented-->\n    <div class=\"igx-tree-node__drop-indicator\">\n        <span aria-hidden=\"true\" class=\"igx-tree-node__spacer\" *ngFor=\"let item of [].constructor(level)\"></span>\n        <!-- style rules target this div, do not delete it -->\n        <div></div>\n    </div>\n</ng-template>\n\n<ng-template #dragTemplate>\n    <!-- Drag drop goes here\n        igxDrop\n        #dropRef=\"drop\"\n        [igxNodeDrag]=\"this\"\n        (dragStart)=\"logDrop(dropRef)\"\n        (leave)=\"emitLeave()\"\n        (enter)=\"emitEnter()\" -->\n    <div class=\"igx-tree-node__drag-wrapper\">\n        <ng-template *ngTemplateOutlet=\"headerTemplate\"></ng-template>\n    </div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [IGX_TREE_COMPONENT]
                }] }, { type: i2.IgxTreeSelectionService }, { type: i3.IgxTreeService }, { type: i1.IgxTreeNavigationService }, { type: i0.ChangeDetectorRef }, { type: i4.AnimationBuilder }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }, {
                    type: Inject,
                    args: [IGX_TREE_NODE_COMPONENT]
                }] }]; }, propDecorators: { data: [{
                type: Input
            }], loading: [{
                type: Input
            }], resourceStrings: [{
                type: Input
            }], active: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], expandedChange: [{
                type: Output
            }], disabled: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.igx-tree-node--disabled']
            }], cssClass: [{
                type: HostBinding,
                args: ['class.igx-tree-node']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], linkChildren: [{
                type: ContentChildren,
                args: [IgxTreeNodeLinkDirective, { read: ElementRef }]
            }], _children: [{
                type: ContentChildren,
                args: [IGX_TREE_NODE_COMPONENT, { read: IGX_TREE_NODE_COMPONENT }]
            }], allChildren: [{
                type: ContentChildren,
                args: [IGX_TREE_NODE_COMPONENT, { read: IGX_TREE_NODE_COMPONENT, descendants: true }]
            }], header: [{
                type: ViewChild,
                args: ['ghostTemplate', { read: ElementRef }]
            }], _defaultExpandIndicatorTemplate: [{
                type: ViewChild,
                args: ['defaultIndicator', { read: TemplateRef, static: true }]
            }], childrenContainer: [{
                type: ViewChild,
                args: ['childrenContainer', { read: ElementRef }]
            }], selected: [{
                type: Input
            }], expanded: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi90cmVlL3RyZWUtbm9kZS90cmVlLW5vZGUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3RyZWUvdHJlZS1ub2RlL3RyZWUtbm9kZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQ0gsU0FBUyxFQUNFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBYSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFDaEcsV0FBVyxFQUNYLFVBQVUsRUFFVixNQUFNLEVBQ04sWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBMkIsTUFBTSxrREFBa0QsQ0FBQztBQUNsSCxPQUFPLEVBQ0gsa0JBQWtCLEVBQ2xCLHVCQUF1QixFQUE4QixvQkFBb0IsRUFDNUUsTUFBTSxXQUFXLENBQUM7QUFLbkIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7Ozs7O0FBRTNELHFDQUFxQztBQUNyQzs7O0dBR0c7QUFJSCxNQUFNLE9BQU8sd0JBQXdCO0lBMENqQyxZQUNRLElBQXNCLEVBQ2xCLFVBQW9DLEVBQ3JDLFVBQXNCO1FBRnpCLFNBQUksR0FBSixJQUFJLENBQWtCO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQTBCO1FBQ3JDLGVBQVUsR0FBVixVQUFVLENBQVk7UUExQzFCLFNBQUksR0FBRyxVQUFV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QURqQixlQUFlO3VCQUFDLHVCQUF1QixFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7Z0JBc0J2RixNQUFNO3NCQURaLFNBQVM7dUJBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtnQkFJeEMsK0JBQStCO3NCQUR0QyxTQUFTO3VCQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUkxRCxpQkFBaUI7c0JBRHhCLFNBQVM7dUJBQUMsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQThGekMsUUFBUTtzQkFEbEIsS0FBSztnQkFvQ0ssUUFBUTtzQkFEbEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LCBPbkluaXQsXG4gICAgT25EZXN0cm95LCBJbnB1dCwgSW5qZWN0LCBWaWV3Q2hpbGQsIFRlbXBsYXRlUmVmLCBRdWVyeUxpc3QsIENvbnRlbnRDaGlsZHJlbiwgT3B0aW9uYWwsIFNraXBTZWxmLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBEaXJlY3RpdmUsXG4gICAgSG9zdExpc3RlbmVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVG9nZ2xlQW5pbWF0aW9uUGxheWVyLCBUb2dnbGVBbmltYXRpb25TZXR0aW5ncyB9IGZyb20gJy4uLy4uL2V4cGFuc2lvbi1wYW5lbC90b2dnbGUtYW5pbWF0aW9uLWNvbXBvbmVudCc7XG5pbXBvcnQge1xuICAgIElHWF9UUkVFX0NPTVBPTkVOVCwgSWd4VHJlZSwgSWd4VHJlZU5vZGUsXG4gICAgSUdYX1RSRUVfTk9ERV9DT01QT05FTlQsIElUcmVlTm9kZVRvZ2dsaW5nRXZlbnRBcmdzLCBJZ3hUcmVlU2VsZWN0aW9uVHlwZVxufSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHsgSWd4VHJlZVNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuLi90cmVlLXNlbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElneFRyZWVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4uL3RyZWUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IElneFRyZWVTZXJ2aWNlIH0gZnJvbSAnLi4vdHJlZS5zZXJ2aWNlJztcbmltcG9ydCB7IElUcmVlUmVzb3VyY2VTdHJpbmdzIH0gZnJvbSAnLi4vLi4vY29yZS9pMThuL3RyZWUtcmVzb3VyY2VzJztcbmltcG9ydCB7IEN1cnJlbnRSZXNvdXJjZVN0cmluZ3MgfSBmcm9tICcuLi8uLi9jb3JlL2kxOG4vcmVzb3VyY2VzJztcbmltcG9ydCB7IERpc3BsYXlEZW5zaXR5IH0gZnJvbSAnLi4vLi4vY29yZS9kaXNwbGF5RGVuc2l0eSc7XG5cbi8vIFRPRE86IEltcGxlbWVudCBhcmlhIGZ1bmN0aW9uYWxpdHlcbi8qKlxuICogQGhpZGRlbiBAaW50ZXJuYWxcbiAqIFVzZWQgZm9yIGxpbmtzIChgYWAgdGFncykgaW4gdGhlIGJvZHkgb2YgYW4gYGlneC10cmVlLW5vZGVgLiBIYW5kbGVzIGFyaWEgYW5kIGV2ZW50IGRpc3BhdGNoLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogYFtpZ3hUcmVlTm9kZUxpbmtdYFxufSlcbmV4cG9ydCBjbGFzcyBJZ3hUcmVlTm9kZUxpbmtEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxuICAgIHB1YmxpYyByb2xlID0gJ3RyZWVpdGVtJztcblxuICAgIC8qKlxuICAgICAqIFRoZSBub2RlJ3MgcGFyZW50LiBTaG91bGQgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGxpbmsgaXMgZGVmaW5lZFxuICAgICAqIGluIGA8bmctdGVtcGxhdGU+YCB0YWcgb3V0c2lkZSBvZiBpdHMgcGFyZW50LCBhcyBBbmd1bGFyIERJIHdpbGwgbm90IHByb3Blcmx5IHByb3ZpZGUgYSByZWZlcmVuY2VcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogICAgIDxpZ3gtdHJlZS1ub2RlICNteU5vZGUgKm5nRm9yPVwibGV0IG5vZGUgb2YgZGF0YVwiIFtkYXRhXT1cIm5vZGVcIj5cbiAgICAgKiAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm5vZGVUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGRhdGEsIHBhcmVudE5vZGU6IG15Tm9kZSB9XCI+XG4gICAgICogICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAqICAgICA8L2lneC10cmVlLW5vZGU+XG4gICAgICogICAgIC4uLlxuICAgICAqICAgICA8IS0tIG5vZGUgdGVtcGxhdGUgaXMgZGVmaW5lZCB1bmRlciB0cmVlIHRvIGFjY2VzcyByZWxhdGVkIHNlcnZpY2VzIC0tPlxuICAgICAqICAgICA8bmctdGVtcGxhdGUgI25vZGVUZW1wbGF0ZSBsZXQtZGF0YSBsZXQtbm9kZT1cInBhcmVudE5vZGVcIj5cbiAgICAgKiAgICAgICAgIDxhIFtpZ3hUcmVlTm9kZUxpbmtdPVwibm9kZVwiPnt7IGRhdGEubGFiZWwgfX08L2E+XG4gICAgICogICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoJ2lneFRyZWVOb2RlTGluaycpXG4gICAgcHVibGljIHNldCBwYXJlbnROb2RlKHZhbDogYW55KSB7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudE5vZGUgPSB2YWw7XG4gICAgICAgICAgICAodGhpcy5fcGFyZW50Tm9kZSBhcyBhbnkpLmFkZExpbmtDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcGFyZW50Tm9kZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICAvKiogQSBwb2ludGVyIHRvIHRoZSBwYXJlbnQgbm9kZSAqL1xuICAgIHByaXZhdGUgZ2V0IHRhcmdldCgpOiBJZ3hUcmVlTm9kZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZSB8fCB0aGlzLnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcGFyZW50Tm9kZTogSWd4VHJlZU5vZGU8YW55PiA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KElHWF9UUkVFX05PREVfQ09NUE9ORU5UKVxuICAgIHByaXZhdGUgbm9kZTogSWd4VHJlZU5vZGU8YW55PixcbiAgICAgICAgcHJpdmF0ZSBuYXZTZXJ2aWNlOiBJZ3hUcmVlTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdhdHRyLnRhYmluZGV4JylcbiAgICBwdWJsaWMgZ2V0IHRhYkluZGV4KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuZm9jdXNlZE5vZGUgPT09IHRoaXMudGFyZ2V0ID8gKHRoaXMudGFyZ2V0Py5kaXNhYmxlZCA/IC0xIDogMCkgOiAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIENsZWFyIHRoZSBub2RlJ3MgZm9jdXNlZCBzdGF0ZVxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICAgIHB1YmxpYyBoYW5kbGVCbHVyKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIFNldCB0aGUgbm9kZSBhcyBmb2N1c2VkXG4gICAgICovXG4gICAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICAgIHB1YmxpYyBoYW5kbGVGb2N1cygpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0ICYmICF0aGlzLnRhcmdldC5kaXNhYmxlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubmF2U2VydmljZS5mb2N1c2VkTm9kZSAhPT0gdGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5hdlNlcnZpY2UuZm9jdXNlZE5vZGUgPSB0aGlzLnRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmlzRm9jdXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0LnJlbW92ZUxpbmtDaGlsZCh0aGlzKTtcbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIFRoZSB0cmVlIG5vZGUgY29tcG9uZW50IHJlcHJlc2VudHMgYSBjaGlsZCBub2RlIG9mIHRoZSB0cmVlIGNvbXBvbmVudCBvciBhbm90aGVyIHRyZWUgbm9kZS5cbiAqIFVzYWdlOlxuICpcbiAqIGBgYGh0bWxcbiAqICA8aWd4LXRyZWU+XG4gKiAgLi4uXG4gKiAgICA8aWd4LXRyZWUtbm9kZSBbZGF0YV09XCJkYXRhXCIgW3NlbGVjdGVkXT1cInNlcnZpY2UuaXNOb2RlU2VsZWN0ZWQoZGF0YS5LZXkpXCIgW2V4cGFuZGVkXT1cInNlcnZpY2UuaXNOb2RlRXhwYW5kZWQoZGF0YS5LZXkpXCI+XG4gKiAgICAgIHt7IGRhdGEuRmlyc3ROYW1lIH19IHt7IGRhdGEuTGFzdE5hbWUgfX1cbiAqICAgIDwvaWd4LXRyZWUtbm9kZT5cbiAqICAuLi5cbiAqICA8L2lneC10cmVlPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaWd4LXRyZWUtbm9kZScsXG4gICAgdGVtcGxhdGVVcmw6ICd0cmVlLW5vZGUuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IElHWF9UUkVFX05PREVfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogSWd4VHJlZU5vZGVDb21wb25lbnQgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgSWd4VHJlZU5vZGVDb21wb25lbnQ8VD4gZXh0ZW5kcyBUb2dnbGVBbmltYXRpb25QbGF5ZXIgaW1wbGVtZW50cyBJZ3hUcmVlTm9kZTxUPiwgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIC8qKlxuICAgICAqIFRoZSBkYXRhIGVudHJ5IHRoYXQgdGhlIG5vZGUgaXMgdmlzdWFsaXppbmcuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFJlcXVpcmVkIGZvciBzZWFyY2hpbmcgdGhyb3VnaCBub2Rlcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqICA8aWd4LXRyZWU+XG4gICAgICogIC4uLlxuICAgICAqICAgIDxpZ3gtdHJlZS1ub2RlIFtkYXRhXT1cImRhdGFcIj5cbiAgICAgKiAgICAgIHt7IGRhdGEuRmlyc3ROYW1lIH19IHt7IGRhdGEuTGFzdE5hbWUgfX1cbiAgICAgKiAgICA8L2lneC10cmVlLW5vZGU+XG4gICAgICogIC4uLlxuICAgICAqICA8L2lneC10cmVlPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRhdGE6IFQ7XG5cbiAgICAvKipcbiAgICAgKiBUbyBiZSB1c2VkIGZvciBsb2FkLW9uLWRlbWFuZCBzY2VuYXJpb3MgaW4gb3JkZXIgdG8gc3BlY2lmeSB3aGV0aGVyIHRoZSBub2RlIGlzIGxvYWRpbmcgZGF0YS5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogTG9hZGluZyBub2RlcyBkbyBub3QgcmVuZGVyIGNoaWxkcmVuLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGxvYWRpbmcgPSBmYWxzZTtcblxuICAgIC8vIFRPIERPOiByZXR1cm4gZGlmZmVyZW50IHRhYiBpbmRleCBkZXBlbmRpbmcgb24gYW5jaG9yIGNoaWxkXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIHNldCB0YWJJbmRleCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90YWJJbmRleCA9IHZhbDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IHRhYkluZGV4KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3RhYkluZGV4ID09PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5uYXZTZXJ2aWNlLmZvY3VzZWROb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFzTGlua0NoaWxkcmVuID8gLTEgOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0xpbmtDaGlsZHJlbiA/IC0xIDogdGhpcy5fdGFiSW5kZXg7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBhbmltYXRpb25TZXR0aW5ncygpOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyZWUuYW5pbWF0aW9uU2V0dGluZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSByZXNvdXJjZSBzdHJpbmdzLlxuICAgICAqXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBVc2VzIEVOIHJlc291cmNlcyBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCByZXNvdXJjZVN0cmluZ3ModmFsdWU6IElUcmVlUmVzb3VyY2VTdHJpbmdzKSB7XG4gICAgICAgIHRoaXMuX3Jlc291cmNlU3RyaW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3Jlc291cmNlU3RyaW5ncywgdmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGFjY2Vzc29yIHRoYXQgcmV0dXJucyB0aGUgcmVzb3VyY2Ugc3RyaW5ncy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHJlc291cmNlU3RyaW5ncygpOiBJVHJlZVJlc291cmNlU3RyaW5ncyB7XG4gICAgICAgIGlmICghdGhpcy5fcmVzb3VyY2VTdHJpbmdzKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXNvdXJjZVN0cmluZ3MgPSBDdXJyZW50UmVzb3VyY2VTdHJpbmdzLlRyZWVSZXNTdHJpbmdzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNvdXJjZVN0cmluZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBhY3RpdmUgc3RhdGUgb2YgdGhlIG5vZGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZTogYm9vbGVhblxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm5hdlNlcnZpY2UuYWN0aXZlTm9kZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRyZWUuYWN0aXZlTm9kZUJpbmRpbmdDaGFuZ2UuZW1pdCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmFjdGl2ZU5vZGUgPT09IHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBub2RlJ3MgYHNlbGVjdGVkYCBwcm9wZXJ0eSBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdHJlZT5cbiAgICAgKiAgICAgIDxpZ3gtdHJlZS1ub2RlICpuZ0Zvcj1cImxldCBub2RlIG9mIGRhdGFcIiBbZGF0YV09XCJub2RlXCIgWyhzZWxlY3RlZCldPVwibm9kZS5zZWxlY3RlZFwiPlxuICAgICAqICAgICAgPC9pZ3gtdHJlZS1ub2RlPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3Qgbm9kZTogSWd4VHJlZU5vZGU8YW55PiA9IHRoaXMudHJlZS5maW5kTm9kZXMoZGF0YVswXSlbMF07XG4gICAgICogbm9kZS5zZWxlY3RlZENoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChlOiBib29sZWFuKSA9PiBjb25zb2xlLmxvZyhcIk5vZGUgc2VsZWN0aW9uIGNoYW5nZWQgdG8gXCIsIGUpKVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgd2hlbiB0aGUgbm9kZSdzIGBleHBhbmRlZGAgcHJvcGVydHkgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogICAgICA8aWd4LXRyZWUtbm9kZSAqbmdGb3I9XCJsZXQgbm9kZSBvZiBkYXRhXCIgW2RhdGFdPVwibm9kZVwiIFsoZXhwYW5kZWQpXT1cIm5vZGUuZXhwYW5kZWRcIj5cbiAgICAgKiAgICAgIDwvaWd4LXRyZWUtbm9kZT5cbiAgICAgKiA8L2lneC10cmVlPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG5vZGU6IElneFRyZWVOb2RlPGFueT4gPSB0aGlzLnRyZWUuZmluZE5vZGVzKGRhdGFbMF0pWzBdO1xuICAgICAqIG5vZGUuZXhwYW5kZWRDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZTogYm9vbGVhbikgPT4gY29uc29sZS5sb2coXCJOb2RlIGV4cGFuc2lvbiBzdGF0ZSBjaGFuZ2VkIHRvIFwiLCBlKSlcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZXhwYW5kZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IGZvY3VzZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRm9jdXNlZCAmJlxuICAgICAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLmZvY3VzZWROb2RlID09PSB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZnVsbCBwYXRoIHRvIHRoZSBub2RlIGluY3VkaW5nIGl0c2VsZlxuICAgICAqXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNvbnN0IG5vZGU6IElneFRyZWVOb2RlPGFueT4gPSB0aGlzLnRyZWUuZmluZE5vZGVzKGRhdGFbMF0pWzBdO1xuICAgICAqIGNvbnN0IHBhdGg6IElneFRyZWVOb2RlPGFueT5bXSA9IG5vZGUucGF0aDtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHBhdGgoKTogSWd4VHJlZU5vZGU8YW55PltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Tm9kZT8ucGF0aCA/IFsuLi50aGlzLnBhcmVudE5vZGUucGF0aCwgdGhpc10gOiBbdGhpc107XG4gICAgfVxuXG4gICAgLy8gVE9ETzogYmluZCB0byBkaXNhYmxlZCBzdGF0ZSB3aGVuIG5vZGUgaXMgZHJhZ2dlZFxuICAgIC8qKlxuICAgICAqIEdldHMvU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIG5vZGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2YWx1ZTogYm9vbGVhblxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtdHJlZS1ub2RlLS1kaXNhYmxlZCcpXG4gICAgcHVibGljIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudHJlZS5kaXNhYmxlZENoYW5nZS5lbWl0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtdHJlZS1ub2RlJylcbiAgICBwdWJsaWMgY3NzQ2xhc3MgPSAnaWd4LXRyZWUtbm9kZSc7XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXG4gICAgcHVibGljIGdldCByb2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNMaW5rQ2hpbGRyZW4gPyAnbm9uZScgOiAndHJlZWl0ZW0nO1xuICAgIH07XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKElneFRyZWVOb2RlTGlua0RpcmVjdGl2ZSwgeyByZWFkOiBFbGVtZW50UmVmIH0pXG4gICAgcHVibGljIGxpbmtDaGlsZHJlbjogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihJR1hfVFJFRV9OT0RFX0NPTVBPTkVOVCwgeyByZWFkOiBJR1hfVFJFRV9OT0RFX0NPTVBPTkVOVCB9KVxuICAgIHB1YmxpYyBfY2hpbGRyZW46IFF1ZXJ5TGlzdDxJZ3hUcmVlTm9kZTxhbnk+PjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSUdYX1RSRUVfTk9ERV9DT01QT05FTlQsIHsgcmVhZDogSUdYX1RSRUVfTk9ERV9DT01QT05FTlQsIGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIGFsbENoaWxkcmVuOiBRdWVyeUxpc3Q8SWd4VHJlZU5vZGU8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIGNoaWxkIG5vZGVzIG9mIHRoZSBub2RlIChpZiBhbnkpXG4gICAgICpcbiAgICAgKiBAcmVtYXJrXG4gICAgICogUmV0dXJucyBgbnVsbGAgaWYgbm9kZSBkb2VzIG5vdCBoYXZlIGNoaWxkcmVuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBub2RlOiBJZ3hUcmVlTm9kZTxhbnk+ID0gdGhpcy50cmVlLmZpbmROb2RlcyhkYXRhWzBdKVswXTtcbiAgICAgKiBjb25zdCBjaGlsZHJlbjogSWd4VHJlZU5vZGU8YW55PltdID0gbm9kZS5jaGlsZHJlbjtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGNoaWxkcmVuKCk6IElneFRyZWVOb2RlPGFueT5bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbj8ubGVuZ3RoID8gdGhpcy5fY2hpbGRyZW4udG9BcnJheSgpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiB3aWxsIGJlIHVzZWQgaW4gRHJhZyBhbmQgRHJvcCBpbXBsZW1lbnRhdGlvblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBWaWV3Q2hpbGQoJ2dob3N0VGVtcGxhdGUnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcbiAgICBwdWJsaWMgaGVhZGVyOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdEluZGljYXRvcicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICAgIHByaXZhdGUgX2RlZmF1bHRFeHBhbmRJbmRpY2F0b3JUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2NoaWxkcmVuQ29udGFpbmVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pXG4gICAgcHJpdmF0ZSBjaGlsZHJlbkNvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICAgIHByaXZhdGUgZ2V0IGhhc0xpbmtDaGlsZHJlbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlua0NoaWxkcmVuPy5sZW5ndGggPiAwIHx8IHRoaXMucmVnaXN0ZXJlZENoaWxkcmVuPy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBnZXQgaXNDb21wYWN0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cmVlPy5kaXNwbGF5RGVuc2l0eSA9PT0gRGlzcGxheURlbnNpdHkuY29tcGFjdDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0IGlzQ29zeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZT8uZGlzcGxheURlbnNpdHkgPT09IERpc3BsYXlEZW5zaXR5LmNvc3k7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGlzRm9jdXNlZDogYm9vbGVhbjtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZWdpc3RlcmVkQ2hpbGRyZW46IElneFRyZWVOb2RlTGlua0RpcmVjdGl2ZVtdID0gW107XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwcml2YXRlIF9yZXNvdXJjZVN0cmluZ3MgPSBDdXJyZW50UmVzb3VyY2VTdHJpbmdzLlRyZWVSZXNTdHJpbmdzO1xuXG4gICAgcHJpdmF0ZSBfdGFiSW5kZXggPSBudWxsO1xuICAgIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgQEluamVjdChJR1hfVFJFRV9DT01QT05FTlQpIHB1YmxpYyB0cmVlOiBJZ3hUcmVlLFxuICAgICAgICBwcm90ZWN0ZWQgc2VsZWN0aW9uU2VydmljZTogSWd4VHJlZVNlbGVjdGlvblNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCB0cmVlU2VydmljZTogSWd4VHJlZVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBuYXZTZXJ2aWNlOiBJZ3hUcmVlTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcm90ZWN0ZWQgYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlcixcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgQEluamVjdChJR1hfVFJFRV9OT0RFX0NPTVBPTkVOVCkgcHVibGljIHBhcmVudE5vZGU6IElneFRyZWVOb2RlPGFueT5cbiAgICApIHtcbiAgICAgICAgc3VwZXIoYnVpbGRlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNob3dTZWxlY3RvcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyZWUuc2VsZWN0aW9uICE9PSBJZ3hUcmVlU2VsZWN0aW9uVHlwZS5Ob25lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIGdldCBpbmRldGVybWluYXRlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmlzTm9kZUluZGV0ZXJtaW5hdGUodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqIFRoZSBkZXB0aCBvZiB0aGUgbm9kZSwgcmVsYXRpdmUgdG8gdGhlIHJvb3RcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogIC4uLlxuICAgICAqICA8aWd4LXRyZWUtbm9kZSAjbm9kZT5cbiAgICAgKiAgICAgIE15IGxldmVsIGlzIHt7IG5vZGUubGV2ZWwgfX1cbiAgICAgKiAgPC9pZ3gtdHJlZS1ub2RlPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3Qgbm9kZTogSWd4VHJlZU5vZGU8YW55PiA9IHRoaXMudHJlZS5maW5kTm9kZXMoZGF0YVsxMl0pWzBdO1xuICAgICAqIGNvbnN0IGxldmVsOiBudW1iZXIgPSBub2RlLmxldmVsO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGV2ZWwoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Tm9kZSA/IHRoaXMucGFyZW50Tm9kZS5sZXZlbCArIDEgOiAwO1xuICAgIH1cblxuICAgIC8qKiBHZXQvc2V0IHdoZXRoZXIgdGhlIG5vZGUgaXMgc2VsZWN0ZWQuIFN1cHBvcnN0IHR3by13YXkgYmluZGluZy5cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogIC4uLlxuICAgICAqICA8aWd4LXRyZWUtbm9kZSAqbmdGb3I9XCJsZXQgbm9kZSBvZiBkYXRhXCIgWyhzZWxlY3RlZCldPVwibm9kZS5zZWxlY3RlZFwiPlxuICAgICAqICAgICAge3sgbm9kZS5sYWJlbCB9fVxuICAgICAqICA8L2lneC10cmVlLW5vZGU+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBub2RlOiBJZ3hUcmVlTm9kZTxhbnk+ID0gdGhpcy50cmVlLmZpbmROb2RlcyhkYXRhWzBdKVswXTtcbiAgICAgKiBjb25zdCBzZWxlY3RlZCA9IG5vZGUuc2VsZWN0ZWQ7XG4gICAgICogbm9kZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLmlzTm9kZVNlbGVjdGVkKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQodmFsOiBib29sZWFuKSB7XG4gICAgICAgIGlmICghKHRoaXMudHJlZT8ubm9kZXMgJiYgdGhpcy50cmVlLm5vZGVzLmZpbmQoKGUpID0+IGUgPT09IHRoaXMpKSAmJiB2YWwpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZS5mb3JjZVNlbGVjdC5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWwgJiYgIXRoaXMuc2VsZWN0aW9uU2VydmljZS5pc05vZGVTZWxlY3RlZCh0aGlzKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdE5vZGVzV2l0aE5vRXZlbnQoW3RoaXNdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbCAmJiB0aGlzLnNlbGVjdGlvblNlcnZpY2UuaXNOb2RlU2VsZWN0ZWQodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdE5vZGVzV2l0aE5vRXZlbnQoW3RoaXNdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBHZXQvc2V0IHdoZXRoZXIgdGhlIG5vZGUgaXMgZXhwYW5kZWRcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogIC4uLlxuICAgICAqICA8aWd4LXRyZWUtbm9kZSAqbmdGb3I9XCJsZXQgbm9kZSBvZiBkYXRhXCIgW2V4cGFuZGVkXT1cIm5vZGUubmFtZSA9PT0gdGhpcy5leHBhbmRlZE5vZGVcIj5cbiAgICAgKiAgICAgIHt7IG5vZGUubGFiZWwgfX1cbiAgICAgKiAgPC9pZ3gtdHJlZS1ub2RlPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3Qgbm9kZTogSWd4VHJlZU5vZGU8YW55PiA9IHRoaXMudHJlZS5maW5kTm9kZXMoZGF0YVswXSlbMF07XG4gICAgICogY29uc3QgZXhwYW5kZWQgPSBub2RlLmV4cGFuZGVkO1xuICAgICAqIG5vZGUuZXhwYW5kZWQgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGdldCBleHBhbmRlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZVNlcnZpY2UuaXNFeHBhbmRlZCh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGV4cGFuZGVkKHZhbDogYm9vbGVhbikge1xuICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVTZXJ2aWNlLmV4cGFuZCh0aGlzLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVTZXJ2aWNlLmNvbGxhcHNlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBleHBhbmRJbmRpY2F0b3JUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZT8uZXhwYW5kSW5kaWNhdG9yID8gdGhpcy50cmVlLmV4cGFuZEluZGljYXRvciA6IHRoaXMuX2RlZmF1bHRFeHBhbmRJbmRpY2F0b3JUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmF0aXZlIERPTSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgbm9kZS4gQ291bGQgYmUgbnVsbCBpbiBjZXJ0YWluIGVudmlyb25tZW50cy5cbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBnZXQgdGhlIG5hdGl2ZUVsZW1lbnQgb2YgdGhlIHNlY29uZCBub2RlXG4gICAgICogY29uc3Qgbm9kZTogSWd4VHJlZU5vZGUgPSB0aGlzLnRyZWUubm9kZXMuZmlyc3QoKTtcbiAgICAgKiBjb25zdCBub2RlRWxlbWVudDogSFRNTEVsZW1lbnQgPSBub2RlLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBuYXRpdmVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm9wZW5BbmltYXRpb25Eb25lLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVlLm5vZGVFeHBhbmRlZC5lbWl0KHsgb3duZXI6IHRoaXMudHJlZSwgbm9kZTogdGhpcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jbG9zZUFuaW1hdGlvbkRvbmUucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyZWUubm9kZUNvbGxhcHNlZC5lbWl0KHsgb3duZXI6IHRoaXMudHJlZSwgbm9kZTogdGhpcyB9KTtcbiAgICAgICAgICAgIHRoaXMudHJlZVNlcnZpY2UuY29sbGFwc2UodGhpcyk7XG4gICAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGhpZGRlbiBAaW50ZXJuYWxcbiAgICAgKiBTZXRzIHRoZSBmb2N1cyB0byB0aGUgbm9kZSdzIDxhPiBjaGlsZCwgaWYgcHJlc2VudFxuICAgICAqIFNldHMgdGhlIG5vZGUgYXMgdGhlIHRyZWUgc2VydmljZSdzIGZvY3VzZWROb2RlXG4gICAgICogTWFya3MgdGhlIG5vZGUgYXMgdGhlIGN1cnJlbnQgYWN0aXZlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlRm9jdXMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubmF2U2VydmljZS5mb2N1c2VkTm9kZSAhPT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLmZvY3VzZWROb2RlID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmxpbmtDaGlsZHJlbj8ubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmtDaGlsZHJlbi5maXJzdC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVnaXN0ZXJlZENoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlcmVkQ2hpbGRyZW5bMF0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqIENsZWFyIHRoZSBub2RlJ3MgZm9jdXNlZCBzdGF0dXNcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXJGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaGlkZGVuIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBvblNlbGVjdG9yQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgLy8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIHRoaXMubmF2U2VydmljZS5oYW5kbGVGb2N1c2VkQW5kQWN0aXZlTm9kZSh0aGlzKTtcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0TXVsdGlwbGVOb2Rlcyh0aGlzLCBldmVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5kZXNlbGVjdE5vZGUodGhpcywgZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdE5vZGUodGhpcywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgbm9kZSBleHBhbnNpb24gc3RhdGUsIHRyaWdnZXJpbmcgYW5pbWF0aW9uXG4gICAgICpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC10cmVlPlxuICAgICAqICAgICAgPGlneC10cmVlLW5vZGUgI25vZGU+TXkgTm9kZTwvaWd4LXRyZWUtbm9kZT5cbiAgICAgKiA8L2lneC10cmVlPlxuICAgICAqIDxidXR0b24gaWd4QnV0dG9uIChjbGljayk9XCJub2RlLnRvZ2dsZSgpXCI+VG9nZ2xlIE5vZGU8L2J1dHRvbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteU5vZGU6IElneFRyZWVOb2RlPGFueT4gPSB0aGlzLnRyZWUuZmluZE5vZGVzKGRhdGFbMF0pWzBdO1xuICAgICAqIG15Tm9kZS50b2dnbGUoKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5leHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBpbmRpY2F0b3JDbGljaygpIHtcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5uYXZTZXJ2aWNlLnNldEZvY3VzZWRBbmRBY3RpdmVOb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBoaWRkZW4gQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIG9uUG9pbnRlckRvd24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMubmF2U2VydmljZS5zZXRGb2N1c2VkQW5kQWN0aXZlTm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS5lbnN1cmVTdGF0ZU9uTm9kZURlbGV0ZSh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHBhbmRzIHRoZSBub2RlLCB0cmlnZ2VyaW5nIGFuaW1hdGlvblxuICAgICAqXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtdHJlZT5cbiAgICAgKiAgICAgIDxpZ3gtdHJlZS1ub2RlICNub2RlPk15IE5vZGU8L2lneC10cmVlLW5vZGU+XG4gICAgICogPC9pZ3gtdHJlZT5cbiAgICAgKiA8YnV0dG9uIGlneEJ1dHRvbiAoY2xpY2spPVwibm9kZS5leHBhbmQoKVwiPkV4cGFuZCBOb2RlPC9idXR0b24+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3QgbXlOb2RlOiBJZ3hUcmVlTm9kZTxhbnk+ID0gdGhpcy50cmVlLmZpbmROb2RlcyhkYXRhWzBdKVswXTtcbiAgICAgKiBteU5vZGUuZXhwYW5kKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGV4cGFuZCgpIHtcbiAgICAgICAgY29uc3QgYXJnczogSVRyZWVOb2RlVG9nZ2xpbmdFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvd25lcjogdGhpcy50cmVlLFxuICAgICAgICAgICAgbm9kZTogdGhpcyxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyZWUubm9kZUV4cGFuZGluZy5lbWl0KGFyZ3MpO1xuICAgICAgICBpZiAoIWFyZ3MuY2FuY2VsKSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVTZXJ2aWNlLmV4cGFuZCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIHRoaXMucGxheU9wZW5BbmltYXRpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNvbnRhaW5lclxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbGxhcHNlcyB0aGUgbm9kZSwgdHJpZ2dlcmluZyBhbmltYXRpb25cbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LXRyZWU+XG4gICAgICogICAgICA8aWd4LXRyZWUtbm9kZSAjbm9kZT5NeSBOb2RlPC9pZ3gtdHJlZS1ub2RlPlxuICAgICAqIDwvaWd4LXRyZWU+XG4gICAgICogPGJ1dHRvbiBpZ3hCdXR0b24gKGNsaWNrKT1cIm5vZGUuY29sbGFwc2UoKVwiPkNvbGxhcHNlIE5vZGU8L2J1dHRvbj5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdCBteU5vZGU6IElneFRyZWVOb2RlPGFueT4gPSB0aGlzLnRyZWUuZmluZE5vZGVzKGRhdGFbMF0pWzBdO1xuICAgICAqIG15Tm9kZS5jb2xsYXBzZSgpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBjb2xsYXBzZSgpIHtcbiAgICAgICAgY29uc3QgYXJnczogSVRyZWVOb2RlVG9nZ2xpbmdFdmVudEFyZ3MgPSB7XG4gICAgICAgICAgICBvd25lcjogdGhpcy50cmVlLFxuICAgICAgICAgICAgbm9kZTogdGhpcyxcbiAgICAgICAgICAgIGNhbmNlbDogZmFsc2VcblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyZWUubm9kZUNvbGxhcHNpbmcuZW1pdChhcmdzKTtcbiAgICAgICAgaWYgKCFhcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgdGhpcy50cmVlU2VydmljZS5jb2xsYXBzaW5nKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wbGF5Q2xvc2VBbmltYXRpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNvbnRhaW5lclxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBhZGRMaW5rQ2hpbGQobGluazogSWd4VHJlZU5vZGVMaW5rRGlyZWN0aXZlKSB7XG4gICAgICAgIHRoaXMuX3RhYkluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJlZENoaWxkcmVuLnB1c2gobGluayk7XG4gICAgfTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyByZW1vdmVMaW5rQ2hpbGQobGluazogSWd4VHJlZU5vZGVMaW5rRGlyZWN0aXZlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZWdpc3RlcmVkQ2hpbGRyZW4uaW5kZXhPZihsaW5rKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlcmVkQ2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZSAjbm9EcmFnVGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuPC9uZy10ZW1wbGF0ZT5cblxuPCEtLSBXaWxsIHN3aXRjaCB0ZW1wbGF0ZXMgZGVwZW5kaW5nIG9uIGRyYWdEcm9wIC0tPlxuPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibm9EcmFnVGVtcGxhdGVcIj5cbjwvbmctdGVtcGxhdGU+XG5cbjxkaXYgI2NoaWxkcmVuQ29udGFpbmVyXG4gICAgKm5nSWY9XCJleHBhbmRlZCAmJiAhbG9hZGluZ1wiXG4gICAgY2xhc3M9XCJpZ3gtdHJlZS1ub2RlX19ncm91cFwiXG4gICAgcm9sZT1cImdyb3VwXCJcbj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJpZ3gtdHJlZS1ub2RlXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5cblxuPG5nLXRlbXBsYXRlICNkZWZhdWx0SW5kaWNhdG9yPlxuICAgIDxpZ3gtaWNvbiBbYXR0ci5hcmlhLWxhYmVsXT1cImV4cGFuZGVkID8gcmVzb3VyY2VTdHJpbmdzLmlneF9jb2xsYXBzZSA6IHJlc291cmNlU3RyaW5ncy5pZ3hfZXhwYW5kXCI+XG4gICAgICAgIHt7IGV4cGFuZGVkID8gXCJrZXlib2FyZF9hcnJvd19kb3duXCIgOiBcImtleWJvYXJkX2Fycm93X3JpZ2h0XCIgfX1cbiAgICA8L2lneC1pY29uPlxuPC9uZy10ZW1wbGF0ZT5cblxuPCEtLSBzZXBhcmF0ZWQgaW4gYSB0ZW1wbGF0ZSBpbiBjYXNlIHRoaXMgZXZlciBuZWVkcyB0byBiZSB0ZW1wbGF0YWJsZSAtLT5cbjxuZy10ZW1wbGF0ZSAjc2VsZWN0TWFya2VyVGVtcGxhdGU+XG4gICAgPGlneC1jaGVja2JveCBbY2hlY2tlZF09XCJzZWxlY3RlZFwiIFtyZWFkb25seV09XCJ0cnVlXCIgW2luZGV0ZXJtaW5hdGVdPVwiaW5kZXRlcm1pbmF0ZVwiIFt0YWJpbmRleF09XCItMVwiPlxuICAgIDwvaWd4LWNoZWNrYm94PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNoZWFkZXJUZW1wbGF0ZT5cbiAgICA8ZGl2ICNnaG9zdFRlbXBsYXRlIGNsYXNzPVwiaWd4LXRyZWUtbm9kZV9fd3JhcHBlclwiXG4gICAgICAgIFthdHRyLnJvbGVdPVwicm9sZVwiXG4gICAgICAgIFt0YWJJbmRleF09XCJ0YWJJbmRleFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICdpZ3gtdHJlZS1ub2RlX193cmFwcGVyLS1jb3N5JzogaXNDb3N5LFxuICAgICAgICAgICAgJ2lneC10cmVlLW5vZGVfX3dyYXBwZXItLWNvbXBhY3QnOiBpc0NvbXBhY3QsXG4gICAgICAgICAgICAnaWd4LXRyZWUtbm9kZV9fd3JhcHBlci0tc2VsZWN0ZWQnOiBzZWxlY3RlZCxcbiAgICAgICAgICAgICdpZ3gtdHJlZS1ub2RlX193cmFwcGVyLS1hY3RpdmUnIDogdGhpcy5hY3RpdmUsXG4gICAgICAgICAgICAnaWd4LXRyZWUtbm9kZV9fd3JhcHBlci0tZm9jdXNlZCcgOiB0aGlzLmZvY3VzZWQsXG4gICAgICAgICAgICAnaWd4LXRyZWUtbm9kZV9fd3JhcHBlci0tZGlzYWJsZWQnIDogdGhpcy5kaXNhYmxlZFxuICAgICAgICB9XCJcbiAgICAgICAgKHBvaW50ZXJkb3duKT1cIm9uUG9pbnRlckRvd24oJGV2ZW50KVwiXG4gICAgICAgIChmb2N1cyk9XCJoYW5kbGVGb2N1cygpXCJcbiAgICAgICAgKGJsdXIpPVwiY2xlYXJGb2N1cygpXCJcbiAgICA+XG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICA8c3BhbiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBbXS5jb25zdHJ1Y3RvcihsZXZlbClcIlxuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJpZ3gtdHJlZS1ub2RlX19zcGFjZXJcIlxuICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBFeHBhbmQvQ29sbGFwc2UgaW5kaWNhdG9yIC0tPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIiFsb2FkaW5nXCJcbiAgICAgICAgICAgIGNsYXNzPVwiaWd4LXRyZWUtbm9kZV9fdG9nZ2xlLWJ1dHRvblwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdpZ3gtdHJlZS1ub2RlX190b2dnbGUtYnV0dG9uLS1oaWRkZW4nOiAhX2NoaWxkcmVuPy5sZW5ndGggfVwiXG4gICAgICAgICAgICAoY2xpY2spPVwiaW5kaWNhdG9yQ2xpY2soKVwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJleHBhbmRJbmRpY2F0b3JUZW1wbGF0ZSwgY29udGV4dDogeyAkaW1wbGljaXQ6IGV4cGFuZGVkIH1cIj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwibG9hZGluZ1wiXG4gICAgICAgICAgICBjbGFzcz1cImlneC10cmVlLW5vZGVfX3RvZ2dsZS1idXR0b25cIlxuICAgICAgICA+XG4gICAgICAgIFx0PGlneC1jaXJjdWxhci1iYXJcbiAgICAgICAgICAgIFx0W2FuaW1hdGVdPVwiZmFsc2VcIlxuICAgICAgICAgICAgXHRbaW5kZXRlcm1pbmF0ZV09XCJ0cnVlXCJcbiAgICAgICAgICAgIFx0W3RleHRWaXNpYmlsaXR5XT1cImZhbHNlXCJcbiAgICAgICAgXHQ+XG4gICAgICAgIFx0PC9pZ3gtY2lyY3VsYXItYmFyPlxuICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgPCEtLSBJdGVtIHNlbGVjdGlvbiAtLT5cbiAgICAgICAgPGRpdiAqbmdJZj1cInNob3dTZWxlY3RvcnNcIlxuICAgICAgICAgICAgY2xhc3M9XCJpZ3gtdHJlZS1ub2RlX19zZWxlY3RcIlxuICAgICAgICAgICAgKHBvaW50ZXJkb3duKT1cIiRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcbiAgICAgICAgICAgIChjbGljayk9XCJvblNlbGVjdG9yQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInNlbGVjdE1hcmtlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlneC10cmVlLW5vZGVfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgIDwhLS0gR2hvc3QgY29udGVudCAtLT5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tICBCdWZmZXIgZWxlbWVudCBmb3IgJ21vdmUgYWZ0ZXInIHdoZW4gRCZEIGlzIGltcGxlbWVudGVkLS0+XG4gICAgPGRpdiBjbGFzcz1cImlneC10cmVlLW5vZGVfX2Ryb3AtaW5kaWNhdG9yXCI+XG4gICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzPVwiaWd4LXRyZWUtbm9kZV9fc3BhY2VyXCIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgW10uY29uc3RydWN0b3IobGV2ZWwpXCI+PC9zcGFuPlxuICAgICAgICA8IS0tIHN0eWxlIHJ1bGVzIHRhcmdldCB0aGlzIGRpdiwgZG8gbm90IGRlbGV0ZSBpdCAtLT5cbiAgICAgICAgPGRpdj48L2Rpdj5cbiAgICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZHJhZ1RlbXBsYXRlPlxuICAgIDwhLS0gRHJhZyBkcm9wIGdvZXMgaGVyZVxuICAgICAgICBpZ3hEcm9wXG4gICAgICAgICNkcm9wUmVmPVwiZHJvcFwiXG4gICAgICAgIFtpZ3hOb2RlRHJhZ109XCJ0aGlzXCJcbiAgICAgICAgKGRyYWdTdGFydCk9XCJsb2dEcm9wKGRyb3BSZWYpXCJcbiAgICAgICAgKGxlYXZlKT1cImVtaXRMZWF2ZSgpXCJcbiAgICAgICAgKGVudGVyKT1cImVtaXRFbnRlcigpXCIgLS0+XG4gICAgPGRpdiBjbGFzcz1cImlneC10cmVlLW5vZGVfX2RyYWctd3JhcHBlclwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19