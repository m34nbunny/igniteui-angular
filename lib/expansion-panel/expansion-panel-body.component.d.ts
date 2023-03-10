import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { IgxExpansionPanelBase } from './expansion-panel.common';
import * as i0 from "@angular/core";
export declare class IgxExpansionPanelBodyComponent {
    panel: IgxExpansionPanelBase;
    element: ElementRef;
    cdr: ChangeDetectorRef;
    /**
     * @hidden
     */
    cssClass: string;
    /**
     * Gets/sets the `role` attribute of the panel body
     * Default is 'region';
     * Get
     * ```typescript
     *  const currentRole = this.panel.body.role;
     * ```
     * Set
     * ```typescript
     *  this.panel.body.role = 'content';
     * ```
     * ```html
     *  <igx-expansion-panel-body [role]="'custom'"></igx-expansion-panel-body>
     * ```
     */
    role: string;
    private _labelledBy;
    private _label;
    constructor(panel: IgxExpansionPanelBase, element: ElementRef, cdr: ChangeDetectorRef);
    /**
     * Gets the `aria-label` attribute of the panel body
     * Defaults to the panel id with '-region' in the end;
     * Get
     * ```typescript
     *  const currentLabel = this.panel.body.label;
     * ```
     */
    get label(): string;
    /**
     * Sets the `aria-label` attribute of the panel body
     * ```typescript
     *  this.panel.body.label = 'my-custom-label';
     * ```
     * ```html
     *  <igx-expansion-panel-body [label]="'my-custom-label'"></igx-expansion-panel-body>
     * ```
     */
    set label(val: string);
    /**
     * Gets the `aria-labelledby` attribute of the panel body
     * Defaults to the panel header id;
     * Get
     * ```typescript
     *  const currentLabel = this.panel.body.labelledBy;
     * ```
     */
    get labelledBy(): string;
    /**
     * Sets the `aria-labelledby` attribute of the panel body
     * ```typescript
     *  this.panel.body.labelledBy = 'my-custom-id';
     * ```
     * ```html
     *  <igx-expansion-panel-body [labelledBy]="'my-custom-id'"></igx-expansion-panel-body>
     * ```
     */
    set labelledBy(val: string);
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxExpansionPanelBodyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxExpansionPanelBodyComponent, "igx-expansion-panel-body", never, { "role": "role"; "label": "label"; "labelledBy": "labelledBy"; }, {}, never, ["*"]>;
}
