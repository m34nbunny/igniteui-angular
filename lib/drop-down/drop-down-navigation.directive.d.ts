import { IDropDownNavigationDirective } from './drop-down.common';
import { IgxDropDownBaseDirective } from './drop-down.base';
import * as i0 from "@angular/core";
/**
 * Navigation Directive that handles keyboard events on its host and controls a targeted IgxDropDownBaseDirective component
 */
export declare class IgxDropDownItemNavigationDirective implements IDropDownNavigationDirective {
    dropdown: IgxDropDownBaseDirective;
    protected _target: IgxDropDownBaseDirective;
    constructor(dropdown: IgxDropDownBaseDirective);
    /**
     * Gets the target of the navigation directive;
     *
     * ```typescript
     * // Get
     * export class MyComponent {
     *  ...
     *  @ContentChild(IgxDropDownNavigationDirective)
     *  navDirective: IgxDropDownNavigationDirective = null
     *  ...
     *  const navTarget: IgxDropDownBaseDirective = navDirective.navTarget
     * }
     * ```
     */
    get target(): IgxDropDownBaseDirective;
    /**
     * Sets the target of the navigation directive;
     * If no valid target is passed, it falls back to the drop down context
     *
     * ```html
     * <!-- Set -->
     * <input [igxDropDownItemNavigation]="dropdown" />
     * ...
     * <igx-drop-down #dropdown>
     * ...
     * </igx-drop-down>
     * ```
     */
    set target(target: IgxDropDownBaseDirective);
    /**
     * Captures keydown events and calls the appropriate handlers on the target component
     */
    handleKeyDown(event: KeyboardEvent): void;
    /**
     * Navigates to previous item
     */
    onArrowDownKeyDown(): void;
    /**
     * Navigates to previous item
     */
    onArrowUpKeyDown(): void;
    /**
     * Navigates to target's last item
     */
    onEndKeyDown(): void;
    /**
     * Navigates to target's first item
     */
    onHomeKeyDown(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxDropDownItemNavigationDirective, [{ optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxDropDownItemNavigationDirective, "[igxDropDownItemNavigation]", never, { "target": "igxDropDownItemNavigation"; }, {}, never>;
}
