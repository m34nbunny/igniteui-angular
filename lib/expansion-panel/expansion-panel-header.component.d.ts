import { ChangeDetectorRef, ElementRef, EventEmitter } from '@angular/core';
import { IgxExpansionPanelBase, IExpansionPanelCancelableEventArgs } from './expansion-panel.common';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare const ExpansionPanelHeaderIconPosition: {
    LEFT: "left";
    NONE: "none";
    RIGHT: "right";
};
export declare type ExpansionPanelHeaderIconPosition = (typeof ExpansionPanelHeaderIconPosition)[keyof typeof ExpansionPanelHeaderIconPosition];
export declare class IgxExpansionPanelHeaderComponent {
    panel: IgxExpansionPanelBase;
    cdr: ChangeDetectorRef;
    elementRef: ElementRef;
    /**
     * Returns a reference to the `igx-expansion-panel-icon` element;
     * If `iconPosition` is `NONE` - return null;
     */
    get iconRef(): ElementRef;
    /**
     * @hidden
     */
    set iconTemplate(val: boolean);
    /**
     * @hidden
     */
    get iconTemplate(): boolean;
    /**
     * Gets/sets the `aria-level` attribute of the header
     * Get
     * ```typescript
     *  const currentAriaLevel = this.panel.header.lv;
     * ```
     * Set
     * ```typescript
     *  this.panel.header.lv = '5';
     * ```
     * ```html
     *  <igx-expansion-panel-header [lv]="myCustomLevel"></igx-expansion-panel-header>
     * ```
     */
    lv: string;
    /**
     * Gets/sets the `role` attribute of the header
     * Get
     * ```typescript
     *  const currentRole = this.panel.header.role;
     * ```
     * Set
     * ```typescript
     *  this.panel.header.role = '5';
     * ```
     * ```html
     *  <igx-expansion-panel-header [role]="'custom'"></igx-expansion-panel-header>
     * ```
     */
    role: string;
    /**
     * @hidden
     */
    get controls(): string;
    /**
     * @hidden @internal
     */
    get innerElement(): any;
    /**
     * Gets/sets the position of the expansion-panel-header expand/collapse icon
     * Accepts `left`, `right` or `none`
     * ```typescript
     *  const currentIconPosition = this.panel.header.iconPosition;
     * ```
     * Set
     * ```typescript
     *  this.panel.header.iconPosition = 'left';
     * ```
     * ```html
     *  <igx-expansion-panel-header [iconPosition]="'right'"></igx-expansion-panel-header>
     * ```
     */
    iconPosition: ExpansionPanelHeaderIconPosition;
    /**
     * Emitted whenever a user interacts with the header host
     * ```typescript
     *  handleInteraction(event: IExpansionPanelCancelableEventArgs) {
     *  ...
     * }
     * ```
     * ```html
     *  <igx-expansion-panel-header (interaction)="handleInteraction($event)">
     *      ...
     *  </igx-expansion-panel-header>
     * ```
     */
    interaction: EventEmitter<IExpansionPanelCancelableEventArgs>;
    /**
     * @hidden
     */
    cssClass: string;
    /**
     * @hidden
     */
    get isExpanded(): boolean;
    /**
     * Gets/sets the whether the header is disabled
     * When disabled, the header will not handle user events and will stop their propagation
     *
     * ```typescript
     *  const isDisabled = this.panel.header.disabled;
     * ```
     * Set
     * ```typescript
     *  this.panel.header.disabled = true;
     * ```
     * ```html
     *  <igx-expansion-panel-header [disabled]="true">
     *     ...
     *  </igx-expansion-panel-header>
     * ```
     */
    get disabled(): boolean;
    set disabled(val: boolean);
    /** @hidden @internal */
    private customIconRef;
    /** @hidden @internal */
    private defaultIconRef;
    /**
     * Sets/gets the `id` of the expansion panel header.
     * ```typescript
     * let panelHeaderId =  this.panel.header.id;
     * ```
     *
     * @memberof IgxExpansionPanelComponent
     */
    id: string;
    /** @hidden @internal */
    tabIndex: number;
    private _iconTemplate;
    private _disabled;
    constructor(panel: IgxExpansionPanelBase, cdr: ChangeDetectorRef, elementRef: ElementRef);
    /**
     * @hidden
     */
    onAction(evt?: Event): void;
    /** @hidden @internal */
    openPanel(event: KeyboardEvent): void;
    /** @hidden @internal */
    closePanel(event: KeyboardEvent): void;
    /**
     * @hidden
     */
    get iconPositionClass(): string;
    static ??fac: i0.????FactoryDeclaration<IgxExpansionPanelHeaderComponent, [{ host: true; }, null, null]>;
    static ??cmp: i0.????ComponentDeclaration<IgxExpansionPanelHeaderComponent, "igx-expansion-panel-header", never, { "lv": "lv"; "role": "role"; "iconPosition": "iconPosition"; "disabled": "disabled"; }, { "interaction": "interaction"; }, ["iconTemplate", "customIconRef"], ["igx-expansion-panel-title", "igx-expansion-panel-description", "*", "igx-expansion-panel-icon"]>;
}
