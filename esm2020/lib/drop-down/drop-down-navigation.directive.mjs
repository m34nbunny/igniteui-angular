import { Directive, Optional, Self, Input, HostListener, Inject } from '@angular/core';
import { IGX_DROPDOWN_BASE } from './drop-down.common';
import { DropDownActionKey } from './drop-down.common';
import * as i0 from "@angular/core";
import * as i1 from "./drop-down.base";
/**
 * Navigation Directive that handles keyboard events on its host and controls a targeted IgxDropDownBaseDirective component
 */
export class IgxDropDownItemNavigationDirective {
    constructor(dropdown) {
        this.dropdown = dropdown;
        this._target = null;
    }
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
    get target() {
        return this._target;
    }
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
    set target(target) {
        this._target = target ? target : this.dropdown;
    }
    /**
     * Captures keydown events and calls the appropriate handlers on the target component
     */
    handleKeyDown(event) {
        if (event) {
            const key = event.key.toLowerCase();
            if (!this.target.collapsed) { // If dropdown is opened
                const navKeys = ['esc', 'escape', 'enter', 'space', 'spacebar', ' ',
                    'arrowup', 'up', 'arrowdown', 'down', 'home', 'end'];
                if (navKeys.indexOf(key) === -1) { // If key has appropriate function in DD
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
            }
            else { // If dropdown is closed, do nothing
                return;
            }
            switch (key) {
                case 'esc':
                case 'escape':
                    this.target.onItemActionKey(DropDownActionKey.ESCAPE, event);
                    break;
                case 'enter':
                    this.target.onItemActionKey(DropDownActionKey.ENTER, event);
                    break;
                case 'space':
                case 'spacebar':
                case ' ':
                    this.target.onItemActionKey(DropDownActionKey.SPACE, event);
                    break;
                case 'arrowup':
                case 'up':
                    this.onArrowUpKeyDown();
                    break;
                case 'arrowdown':
                case 'down':
                    this.onArrowDownKeyDown();
                    break;
                case 'home':
                    this.onHomeKeyDown();
                    break;
                case 'end':
                    this.onEndKeyDown();
                    break;
                default:
                    return;
            }
        }
    }
    /**
     * Navigates to previous item
     */
    onArrowDownKeyDown() {
        this.target.navigateNext();
    }
    /**
     * Navigates to previous item
     */
    onArrowUpKeyDown() {
        this.target.navigatePrev();
    }
    /**
     * Navigates to target's last item
     */
    onEndKeyDown() {
        this.target.navigateLast();
    }
    /**
     * Navigates to target's first item
     */
    onHomeKeyDown() {
        this.target.navigateFirst();
    }
}
IgxDropDownItemNavigationDirective.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownItemNavigationDirective, deps: [{ token: IGX_DROPDOWN_BASE, optional: true, self: true }], target: i0.????FactoryTarget.Directive });
IgxDropDownItemNavigationDirective.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxDropDownItemNavigationDirective, selector: "[igxDropDownItemNavigation]", inputs: { target: ["igxDropDownItemNavigation", "target"] }, host: { listeners: { "keydown": "handleKeyDown($event)" } }, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxDropDownItemNavigationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxDropDownItemNavigation]'
                }]
        }], ctorParameters: function () { return [{ type: i1.IgxDropDownBaseDirective, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_DROPDOWN_BASE]
                }] }]; }, propDecorators: { target: [{
                type: Input,
                args: ['igxDropDownItemNavigation']
            }], handleKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1kb3duLW5hdmlnYXRpb24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2Ryb3AtZG93bi9kcm9wLWRvd24tbmF2aWdhdGlvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7QUFFdkQ7O0dBRUc7QUFJSCxNQUFNLE9BQU8sa0NBQWtDO0lBSTNDLFlBQWtFLFFBQWtDO1FBQWxDLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBRjFGLFlBQU8sR0FBNkIsSUFBSSxDQUFDO0lBRXFELENBQUM7SUFFekc7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNGLElBQVcsTUFBTTtRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsSUFDVyxNQUFNLENBQUMsTUFBZ0M7UUFDOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7O09BRUc7SUFFSSxhQUFhLENBQUMsS0FBb0I7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFDUCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLHdCQUF3QjtnQkFDbEQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUc7b0JBQ3ZFLFNBQVMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLHdDQUF3QztvQkFDdkUsT0FBTztpQkFDVjtnQkFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUMzQjtpQkFBTSxFQUFFLG9DQUFvQztnQkFDekMsT0FBTzthQUNWO1lBQ0QsUUFBUSxHQUFHLEVBQUU7Z0JBQ1QsS0FBSyxLQUFLLENBQUM7Z0JBQ1gsS0FBSyxRQUFRO29CQUNULElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDN0QsTUFBTTtnQkFDVixLQUFLLE9BQU87b0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxNQUFNO2dCQUNWLEtBQUssT0FBTyxDQUFDO2dCQUNiLEtBQUssVUFBVSxDQUFDO2dCQUNoQixLQUFLLEdBQUc7b0JBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxNQUFNO2dCQUNWLEtBQUssU0FBUyxDQUFDO2dCQUNmLEtBQUssSUFBSTtvQkFDTCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsTUFBTTtnQkFDVixLQUFLLFdBQVcsQ0FBQztnQkFDakIsS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMxQixNQUFNO2dCQUNWLEtBQUssTUFBTTtvQkFDUCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JCLE1BQU07Z0JBQ1YsS0FBSyxLQUFLO29CQUNOLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDcEIsTUFBTTtnQkFDVjtvQkFDSSxPQUFPO2FBQ2Q7U0FDSjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNLLGtCQUFrQjtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRDs7T0FFRztJQUNLLGdCQUFnQjtRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRDs7T0FFRztJQUNLLFlBQVk7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQ7O09BRUc7SUFDSyxhQUFhO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7K0hBdkhRLGtDQUFrQyxrQkFJSCxpQkFBaUI7bUhBSmhELGtDQUFrQzsyRkFBbEMsa0NBQWtDO2tCQUg5QyxTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSw2QkFBNkI7aUJBQzFDOzswQkFLZ0IsSUFBSTs7MEJBQUksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxpQkFBaUI7NENBa0M5QyxNQUFNO3NCQURoQixLQUFLO3VCQUFDLDJCQUEyQjtnQkFTM0IsYUFBYTtzQkFEbkIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE9wdGlvbmFsLCBTZWxmLCBJbnB1dCwgSG9zdExpc3RlbmVyLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElHWF9EUk9QRE9XTl9CQVNFIH0gZnJvbSAnLi9kcm9wLWRvd24uY29tbW9uJztcbmltcG9ydCB7IElEcm9wRG93bk5hdmlnYXRpb25EaXJlY3RpdmUgfSBmcm9tICcuL2Ryb3AtZG93bi5jb21tb24nO1xuaW1wb3J0IHsgSWd4RHJvcERvd25CYXNlRGlyZWN0aXZlIH0gZnJvbSAnLi9kcm9wLWRvd24uYmFzZSc7XG5pbXBvcnQgeyBEcm9wRG93bkFjdGlvbktleSB9IGZyb20gJy4vZHJvcC1kb3duLmNvbW1vbic7XG5cbi8qKlxuICogTmF2aWdhdGlvbiBEaXJlY3RpdmUgdGhhdCBoYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBvbiBpdHMgaG9zdCBhbmQgY29udHJvbHMgYSB0YXJnZXRlZCBJZ3hEcm9wRG93bkJhc2VEaXJlY3RpdmUgY29tcG9uZW50XG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneERyb3BEb3duSXRlbU5hdmlnYXRpb25dJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hEcm9wRG93bkl0ZW1OYXZpZ2F0aW9uRGlyZWN0aXZlIGltcGxlbWVudHMgSURyb3BEb3duTmF2aWdhdGlvbkRpcmVjdGl2ZSB7XG5cbiAgICBwcm90ZWN0ZWQgX3RhcmdldDogSWd4RHJvcERvd25CYXNlRGlyZWN0aXZlID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKEBTZWxmKCkgQE9wdGlvbmFsKCkgQEluamVjdChJR1hfRFJPUERPV05fQkFTRSkgcHVibGljIGRyb3Bkb3duOiBJZ3hEcm9wRG93bkJhc2VEaXJlY3RpdmUpIHsgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdGFyZ2V0IG9mIHRoZSBuYXZpZ2F0aW9uIGRpcmVjdGl2ZTtcbiAgICAgKlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiAvLyBHZXRcbiAgICAgKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQge1xuICAgICAqICAuLi5cbiAgICAgKiAgQENvbnRlbnRDaGlsZChJZ3hEcm9wRG93bk5hdmlnYXRpb25EaXJlY3RpdmUpXG4gICAgICogIG5hdkRpcmVjdGl2ZTogSWd4RHJvcERvd25OYXZpZ2F0aW9uRGlyZWN0aXZlID0gbnVsbFxuICAgICAqICAuLi5cbiAgICAgKiAgY29uc3QgbmF2VGFyZ2V0OiBJZ3hEcm9wRG93bkJhc2VEaXJlY3RpdmUgPSBuYXZEaXJlY3RpdmUubmF2VGFyZ2V0XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgICBwdWJsaWMgZ2V0IHRhcmdldCgpOiBJZ3hEcm9wRG93bkJhc2VEaXJlY3RpdmUge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHRhcmdldCBvZiB0aGUgbmF2aWdhdGlvbiBkaXJlY3RpdmU7XG4gICAgICogSWYgbm8gdmFsaWQgdGFyZ2V0IGlzIHBhc3NlZCwgaXQgZmFsbHMgYmFjayB0byB0aGUgZHJvcCBkb3duIGNvbnRleHRcbiAgICAgKlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8IS0tIFNldCAtLT5cbiAgICAgKiA8aW5wdXQgW2lneERyb3BEb3duSXRlbU5hdmlnYXRpb25dPVwiZHJvcGRvd25cIiAvPlxuICAgICAqIC4uLlxuICAgICAqIDxpZ3gtZHJvcC1kb3duICNkcm9wZG93bj5cbiAgICAgKiAuLi5cbiAgICAgKiA8L2lneC1kcm9wLWRvd24+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdpZ3hEcm9wRG93bkl0ZW1OYXZpZ2F0aW9uJylcbiAgICBwdWJsaWMgc2V0IHRhcmdldCh0YXJnZXQ6IElneERyb3BEb3duQmFzZURpcmVjdGl2ZSkge1xuICAgICAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQgPyB0YXJnZXQgOiB0aGlzLmRyb3Bkb3duO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhcHR1cmVzIGtleWRvd24gZXZlbnRzIGFuZCBjYWxscyB0aGUgYXBwcm9wcmlhdGUgaGFuZGxlcnMgb24gdGhlIHRhcmdldCBjb21wb25lbnRcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgaGFuZGxlS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnRhcmdldC5jb2xsYXBzZWQpIHsgLy8gSWYgZHJvcGRvd24gaXMgb3BlbmVkXG4gICAgICAgICAgICAgICAgY29uc3QgbmF2S2V5cyA9IFsnZXNjJywgJ2VzY2FwZScsICdlbnRlcicsICdzcGFjZScsICdzcGFjZWJhcicsICcgJyxcbiAgICAgICAgICAgICdhcnJvd3VwJywgJ3VwJywgJ2Fycm93ZG93bicsICdkb3duJywgJ2hvbWUnLCAnZW5kJ107XG4gICAgICAgICAgICAgICAgaWYgKG5hdktleXMuaW5kZXhPZihrZXkpID09PSAtMSkgeyAvLyBJZiBrZXkgaGFzIGFwcHJvcHJpYXRlIGZ1bmN0aW9uIGluIEREXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIElmIGRyb3Bkb3duIGlzIGNsb3NlZCwgZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXNjJzpcbiAgICAgICAgICAgICAgICBjYXNlICdlc2NhcGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5vbkl0ZW1BY3Rpb25LZXkoRHJvcERvd25BY3Rpb25LZXkuRVNDQVBFLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2VudGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXQub25JdGVtQWN0aW9uS2V5KERyb3BEb3duQWN0aW9uS2V5LkVOVEVSLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzcGFjZWJhcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Lm9uSXRlbUFjdGlvbktleShEcm9wRG93bkFjdGlvbktleS5TUEFDRSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhcnJvd3VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICd1cCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25BcnJvd1VwS2V5RG93bigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhcnJvd2Rvd24nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQXJyb3dEb3duS2V5RG93bigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdob21lJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkhvbWVLZXlEb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FbmRLZXlEb3duKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlcyB0byBwcmV2aW91cyBpdGVtXG4gICAgICovXG4gICAgIHB1YmxpYyBvbkFycm93RG93bktleURvd24oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm5hdmlnYXRlTmV4dCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlcyB0byBwcmV2aW91cyBpdGVtXG4gICAgICovXG4gICAgIHB1YmxpYyBvbkFycm93VXBLZXlEb3duKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5uYXZpZ2F0ZVByZXYoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOYXZpZ2F0ZXMgdG8gdGFyZ2V0J3MgbGFzdCBpdGVtXG4gICAgICovXG4gICAgIHB1YmxpYyBvbkVuZEtleURvd24oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm5hdmlnYXRlTGFzdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlcyB0byB0YXJnZXQncyBmaXJzdCBpdGVtXG4gICAgICovXG4gICAgIHB1YmxpYyBvbkhvbWVLZXlEb3duKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5uYXZpZ2F0ZUZpcnN0KCk7XG4gICAgfVxufVxuIl19