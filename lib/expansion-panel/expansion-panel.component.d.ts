import { ChangeDetectorRef, EventEmitter, AfterContentInit, ElementRef } from '@angular/core';
import { AnimationBuilder } from '@angular/animations';
import { IgxExpansionPanelBodyComponent } from './expansion-panel-body.component';
import { IgxExpansionPanelHeaderComponent } from './expansion-panel-header.component';
import { IgxExpansionPanelBase, IExpansionPanelEventArgs, IExpansionPanelCancelableEventArgs } from './expansion-panel.common';
import { ToggleAnimationPlayer, ToggleAnimationSettings } from './toggle-animation-component';
import * as i0 from "@angular/core";
export declare class IgxExpansionPanelComponent extends ToggleAnimationPlayer implements IgxExpansionPanelBase, AfterContentInit {
    private cdr;
    protected builder: AnimationBuilder;
    private elementRef?;
    /**
     * Sets/gets the animation settings of the expansion panel component
     * Open and Close animation should be passed
     *
     * Get
     * ```typescript
     *  const currentAnimations = this.panel.animationSettings;
     * ```
     * Set
     * ```typescript
     *  import { slideInLeft, slideOutRight } from 'igniteui-angular';
     *  ...
     *  this.panel.animationsSettings = {
     *      openAnimation: slideInLeft,
     *      closeAnimation: slideOutRight
     * };
     * ```
     * or via template
     * ```typescript
     *  import { slideInLeft, slideOutRight } from 'igniteui-angular';
     *  ...
     *  myCustomAnimationObject = {
     *      openAnimation: slideInLeft,
     *      closeAnimation: slideOutRight
     * };
     * ```html
     *  <igx-expansion-panel [animationSettings]='myCustomAnimationObject'>
     *  ...
     *  </igx-expansion-panel>
     * ```
     */
    get animationSettings(): ToggleAnimationSettings;
    set animationSettings(value: ToggleAnimationSettings);
    /**
     * Sets/gets the `id` of the expansion panel component.
     * If not set, `id` will have value `"igx-expansion-panel-0"`;
     * ```html
     * <igx-expansion-panel id = "my-first-expansion-panel"></igx-expansion-panel>
     * ```
     * ```typescript
     * let panelId =  this.panel.id;
     * ```
     *
     * @memberof IgxExpansionPanelComponent
     */
    id: string;
    /**
     * @hidden
     */
    cssClass: string;
    /**
     * @hidden @internal
     */
    get panelExpanded(): boolean;
    /**
     * Gets/sets whether the component is collapsed (its content is hidden)
     * Get
     * ```typescript
     *  const myPanelState: boolean = this.panel.collapsed;
     * ```
     * Set
     * ```html
     *  this.panel.collapsed = true;
     * ```
     *
     * Two-way data binding:
     * ```html
     * <igx-expansion-panel [(collapsed)]="model.isCollapsed"></igx-expansion-panel>
     * ```
     */
    collapsed: boolean;
    /**
     * @hidden
     */
    collapsedChange: EventEmitter<boolean>;
    /**
     * Emitted when the expansion panel starts collapsing
     * ```typescript
     *  handleCollapsing(event: IExpansionPanelCancelableEventArgs)
     * ```
     * ```html
     *  <igx-expansion-panel (contentCollapsing)="handleCollapsing($event)">
     *      ...
     *  </igx-expansion-panel>
     * ```
     */
    contentCollapsing: EventEmitter<IExpansionPanelCancelableEventArgs>;
    /**
     * Emitted when the expansion panel finishes collapsing
     * ```typescript
     *  handleCollapsed(event: IExpansionPanelEventArgs)
     * ```
     * ```html
     *  <igx-expansion-panel (contentCollapsed)="handleCollapsed($event)">
     *      ...
     *  </igx-expansion-panel>
     * ```
     */
    contentCollapsed: EventEmitter<IExpansionPanelEventArgs>;
    /**
     * Emitted when the expansion panel starts expanding
     * ```typescript
     *  handleExpanding(event: IExpansionPanelCancelableEventArgs)
     * ```
     * ```html
     *  <igx-expansion-panel (contentExpanding)="handleExpanding($event)">
     *      ...
     *  </igx-expansion-panel>
     * ```
     */
    contentExpanding: EventEmitter<IExpansionPanelCancelableEventArgs>;
    /**
     * Emitted when the expansion panel finishes expanding
     * ```typescript
     *  handleExpanded(event: IExpansionPanelEventArgs)
     * ```
     * ```html
     *  <igx-expansion-panel (contentExpanded)="handleExpanded($event)">
     *      ...
     *  </igx-expansion-panel>
     * ```
     */
    contentExpanded: EventEmitter<IExpansionPanelEventArgs>;
    /**
     * @hidden
     */
    get headerId(): string;
    /**
     * @hidden @internal
     */
    get nativeElement(): any;
    /**
     * @hidden
     */
    body: IgxExpansionPanelBodyComponent;
    /**
     * @hidden
     */
    header: IgxExpansionPanelHeaderComponent;
    constructor(cdr: ChangeDetectorRef, builder: AnimationBuilder, elementRef?: ElementRef);
    /** @hidden */
    ngAfterContentInit(): void;
    /**
     * Collapses the panel
     *
     * ```html
     *  <igx-expansion-panel #myPanel>
     *      ...
     *  </igx-expansion-panel>
     *  <button (click)="myPanel.collapse($event)">Collpase Panel</button>
     * ```
     */
    collapse(evt?: Event): void;
    /**
     * Expands the panel
     *
     * ```html
     *  <igx-expansion-panel #myPanel>
     *      ...
     *  </igx-expansion-panel>
     *  <button (click)="myPanel.expand($event)">Expand Panel</button>
     * ```
     */
    expand(evt?: Event): void;
    /**
     * Toggles the panel
     *
     * ```html
     *  <igx-expansion-panel #myPanel>
     *      ...
     *  </igx-expansion-panel>
     *  <button (click)="myPanel.toggle($event)">Expand Panel</button>
     * ```
     */
    toggle(evt?: Event): void;
    open(evt?: Event): void;
    close(evt?: Event): void;
    static ??fac: i0.????FactoryDeclaration<IgxExpansionPanelComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxExpansionPanelComponent, "igx-expansion-panel", never, { "animationSettings": "animationSettings"; "id": "id"; "collapsed": "collapsed"; }, { "collapsedChange": "collapsedChange"; "contentCollapsing": "contentCollapsing"; "contentCollapsed": "contentCollapsed"; "contentExpanding": "contentExpanding"; "contentExpanded": "contentExpanded"; }, ["body", "header"], ["igx-expansion-panel-header", "igx-expansion-panel-body"]>;
}
