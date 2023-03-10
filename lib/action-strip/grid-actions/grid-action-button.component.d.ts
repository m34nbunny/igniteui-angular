import { TemplateRef, EventEmitter, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class IgxGridActionButtonComponent {
    container: ElementRef;
    /**
     * Event emitted when action button is clicked.
     *
     * @example
     * ```html
     *  <igx-grid-action-button (actionClick)="startEdit($event)"></igx-grid-action-button>
     * ```
     */
    actionClick: EventEmitter<Event>;
    /**
     * Reference to the current template.
     *
     * @hidden
     * @internal
     */
    templateRef: TemplateRef<any>;
    /**
     * Whether button action is rendered in menu and should container text label.
     */
    asMenuItem: boolean;
    /**
     * Name of the icon to display in the button.
     */
    iconName: string;
    /**
     * Additional Menu item container element classes.
     */
    classNames: string;
    /** @hidden @internal */
    get containerClass(): string;
    /**
     * The name of the icon set. Used in case the icon is from a different icon set.
     */
    iconSet: string;
    /**
     * The text of the label.
     */
    labelText: string;
    /**
     * @hidden
     * @internal
     */
    handleClick(event: any): void;
    /**
     * @hidden @internal
     */
    preventEvent(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxGridActionButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxGridActionButtonComponent, "igx-grid-action-button", never, { "asMenuItem": "asMenuItem"; "iconName": "iconName"; "classNames": "classNames"; "iconSet": "iconSet"; "labelText": "labelText"; }, { "actionClick": "actionClick"; }, never, never>;
}
