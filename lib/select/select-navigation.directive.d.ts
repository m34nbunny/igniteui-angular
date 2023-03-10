import { IgxDropDownItemNavigationDirective } from '../drop-down/drop-down-navigation.directive';
import { OnDestroy } from '@angular/core';
import { IgxSelectBase } from './select.common';
import * as i0 from "@angular/core";
/** @hidden @internal */
export declare class IgxSelectItemNavigationDirective extends IgxDropDownItemNavigationDirective implements OnDestroy {
    protected _target: IgxSelectBase;
    get target(): IgxSelectBase;
    set target(target: IgxSelectBase);
    constructor();
    /** Captures keydown events and calls the appropriate handlers on the target component */
    handleKeyDown(event: KeyboardEvent): void;
    private inputStream;
    private clearStream$;
    captureKey(event: KeyboardEvent): void;
    activateItemByText(text: string): void;
    ngOnDestroy(): void;
    private findNextItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxSelectItemNavigationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxSelectItemNavigationDirective, "[igxSelectItemNavigation]", never, { "target": "igxSelectItemNavigation"; }, {}, never>;
}
