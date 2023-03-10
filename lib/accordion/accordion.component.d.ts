import { AfterContentInit, AfterViewInit, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { IExpansionPanelCancelableEventArgs, IExpansionPanelEventArgs, IgxExpansionPanelBase } from '../expansion-panel/expansion-panel.common';
import { IgxExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { ToggleAnimationSettings } from '../expansion-panel/toggle-animation-component';
import * as i0 from "@angular/core";
export interface IAccordionEventArgs extends IExpansionPanelEventArgs {
    owner: IgxAccordionComponent;
    /** Provides a reference to the `IgxExpansionPanelComponent` which was expanded/collapsed. */
    panel: IgxExpansionPanelBase;
}
export interface IAccordionCancelableEventArgs extends IExpansionPanelCancelableEventArgs {
    owner: IgxAccordionComponent;
    /** Provides a reference to the `IgxExpansionPanelComponent` which is currently expanding/collapsing. */
    panel: IgxExpansionPanelBase;
}
/**
 * IgxAccordion is a container-based component that contains that can house multiple expansion panels.
 *
 * @igxModule IgxAccordionModule
 *
 * @igxKeywords accordion
 *
 * @igxGroup Layouts
 *
 * @remark
 * The Ignite UI for Angular Accordion component enables the user to navigate among multiple collapsing panels
 * displayed in a single container.
 * The accordion offers keyboard navigation and API to control the underlying panels' expansion state.
 *
 * @example
 * ```html
 * <igx-accordion>
 *   <igx-expansion-panel *ngFor="let panel of panels">
 *       ...
 *   </igx-expansion-panel>
 * </igx-accordion>
 * ```
 */
export declare class IgxAccordionComponent implements AfterContentInit, AfterViewInit, OnDestroy {
    private cdr;
    /**
     * Get/Set the `id` of the accordion component.
     * Default value is `"igx-accordion-0"`;
     * ```html
     * <igx-accordion id="my-first-accordion"></igx-accordion>
     * ```
     * ```typescript
     * const accordionId = this.accordion.id;
     * ```
     */
    id: string;
    /** @hidden @internal **/
    cssClass: string;
    /** @hidden @internal **/
    displayStyle: string;
    /**
     * Get/Set the animation settings that panels should use when expanding/collpasing.
     *
     * ```html
     * <igx-accordion [animationSettings]="customAnimationSettings"></igx-accordion>
     * ```
     *
     * ```typescript
     * const customAnimationSettings: ToggleAnimationSettings = {
     *      openAnimation: growVerIn,
     *      closeAnimation: growVerOut
     * };
     *
     * this.accordion.animationSettings = customAnimationSettings;
     * ```
     */
    get animationSettings(): ToggleAnimationSettings;
    set animationSettings(value: ToggleAnimationSettings);
    /**
     * Get/Set how the accordion handles the expansion of the projected expansion panels.
     * If set to `true`, only a single panel can be expanded at a time, collapsing all others
     *
     * ```html
     * <igx-accordion [singleBranchExpand]="true">
     * ...
     * </igx-accordion>
     * ```
     *
     * ```typescript
     * this.accordion.singleBranchExpand = false;
     * ```
     */
    get singleBranchExpand(): boolean;
    set singleBranchExpand(val: boolean);
    /**
     * Emitted before a panel is expanded.
     *
     * @remarks
     * This event is cancelable.
     *
     * ```html
     * <igx-accordion (panelExpanding)="handlePanelExpanding($event)">
     * </igx-accordion>
     * ```
     *
     *```typescript
     * public handlePanelExpanding(event: IExpansionPanelCancelableEventArgs){
     *  const expandedPanel: IgxExpansionPanelComponent = event.panel;
     *  if (expandedPanel.disabled) {
     *      event.cancel = true;
     *  }
     * }
     *```
     */
    panelExpanding: EventEmitter<IAccordionCancelableEventArgs>;
    /**
     * Emitted after a panel has been expanded.
     *
     * ```html
     * <igx-accordion (panelExpanded)="handlePanelExpanded($event)">
     * </igx-accordion>
     * ```
     *
     *```typescript
     * public handlePanelExpanded(event: IExpansionPanelCancelableEventArgs) {
     *  const expandedPanel: IgxExpansionPanelComponent = event.panel;
     *  console.log("Panel is expanded: ", expandedPanel.id);
     * }
     *```
     */
    panelExpanded: EventEmitter<IAccordionEventArgs>;
    /**
     * Emitted before a panel is collapsed.
     *
     * @remarks
     * This event is cancelable.
     *
     * ```html
     * <igx-accordion (panelCollapsing)="handlePanelCollapsing($event)">
     * </igx-accordion>
     * ```
     */
    panelCollapsing: EventEmitter<IAccordionCancelableEventArgs>;
    /**
     * Emitted after a panel has been collapsed.
     *
     * ```html
     * <igx-accordion (panelCollapsed)="handlePanelCollapsed($event)">
     * </igx-accordion>
     * ```
     */
    panelCollapsed: EventEmitter<IAccordionEventArgs>;
    /**
     * Get all panels.
     *
     * ```typescript
     * const panels: IgxExpansionPanelComponent[] = this.accordion.panels;
     * ```
     */
    get panels(): IgxExpansionPanelComponent[];
    private _panels;
    private _animationSettings;
    private _expandedPanels;
    private _expandingPanels;
    private _destroy$;
    private _unsubChildren$;
    private _enabledPanels;
    private _singleBranchExpand;
    constructor(cdr: ChangeDetectorRef);
    /** @hidden @internal **/
    ngAfterContentInit(): void;
    /** @hidden @internal **/
    ngAfterViewInit(): void;
    /** @hidden @internal */
    ngOnDestroy(): void;
    /**
     * Expands all collapsed expansion panels.
     *
     * ```typescript
     * accordion.expandAll();
     * ```
     */
    expandAll(): void;
    /**
     * Collapses all expanded expansion panels.
     *
     * ```typescript
     * accordion.collapseAll();
     * ```
     */
    collapseAll(): void;
    private collapseAllExceptLast;
    private handleKeydown;
    private handleNavigation;
    private handleUpDownArrow;
    private getNextPanel;
    private subToChanges;
    private updatePanelsAnimation;
    static ??fac: i0.????FactoryDeclaration<IgxAccordionComponent, never>;
    static ??cmp: i0.????ComponentDeclaration<IgxAccordionComponent, "igx-accordion", never, { "id": "id"; "animationSettings": "animationSettings"; "singleBranchExpand": "singleBranchExpand"; }, { "panelExpanding": "panelExpanding"; "panelExpanded": "panelExpanded"; "panelCollapsing": "panelCollapsing"; "panelCollapsed": "panelCollapsed"; }, ["_panels"], ["igx-expansion-panel"]>;
}
