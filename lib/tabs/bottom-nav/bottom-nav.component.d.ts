import { IgxTabsDirective } from '../tabs.directive';
import * as i0 from "@angular/core";
/**
 * Bottom Navigation component enables the user to navigate among a number of contents displayed in a single view.
 *
 * @igxModule IgxBottomNavModule
 *
 * @igxTheme igx-bottom-nav-theme
 *
 * @igxKeywords bottom navigation
 *
 * @igxGroup Layouts
 *
 * @remarks
 * The Ignite UI for Angular Bottom Navigation component enables the user to navigate among a number of contents
 * displayed in a single view. The navigation through the contents is accomplished with the tab buttons located at bottom.
 *
 * @example
 * ```html
 * <igx-bottom-nav>
 *     <igx-bottom-nav-item>
 *         <igx-bottom-nav-header>
 *             <igx-icon igxBottomNavHeaderIcon>folder</igx-icon>
 *             <span igxBottomNavHeaderLabel>Tab 1</span>
 *         </igx-bottom-nav-header>
 *         <igx-bottom-nav-content>
 *             Content 1
 *         </igx-bottom-nav-content>
 *     </igx-bottom-nav-item>
 *     ...
 * </igx-bottom-nav>
 * ```
 */
export declare class IgxBottomNavComponent extends IgxTabsDirective {
    /** @hidden */
    protected _disableAnimation: boolean;
    /** @hidden */
    protected componentName: string;
    /** @hidden */
    protected getNextTabId(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxBottomNavComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxBottomNavComponent, "igx-bottom-nav", never, {}, {}, never, never>;
}
