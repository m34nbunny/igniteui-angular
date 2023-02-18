import { ContentChildren, Directive, EventEmitter, Inject, Input, LOCALE_ID, Optional, Output } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisplayDensityBase, DisplayDensityToken } from '../core/density';
import { IGX_INPUT_GROUP_TYPE } from '../input-group/public_api';
import { IgxPickerToggleComponent } from './picker-icons.common';
import { PickerInteractionMode } from './types';
import * as i0 from "@angular/core";
export class PickerBaseDirective extends DisplayDensityBase {
    constructor(element, _localeId, _displayDensityOptions, _inputGroupType) {
        super(_displayDensityOptions || { displayDensity: 'comfortable' });
        this.element = element;
        this._localeId = _localeId;
        this._displayDensityOptions = _displayDensityOptions;
        this._inputGroupType = _inputGroupType;
        /**
         * Sets the `placeholder` of the picker's input.
         *
         * @example
         * ```html
         * <igx-date-picker [placeholder]="'Choose your date'"></igx-date-picker>
         * ```
         */
        this.placeholder = '';
        /**
         * Can be `dropdown` with editable input field or `dialog` with readonly input field.
         *
         * @remarks
         * Default mode is `dropdown`
         *
         * @example
         * ```html
         * <igx-date-picker mode="dialog"></igx-date-picker>
         * ```
         */
        this.mode = PickerInteractionMode.DropDown;
        /**
         * Enables or disables the picker.
         *
         * @example
         * ```html
         * <igx-date-picker [disabled]="'true'"></igx-date-picker>
         * ```
         */
        this.disabled = false;
        /**
         * Emitted when the calendar has started opening, cancelable.
         *
         * @example
         * ```html
         * <igx-date-picker (opening)="handleOpening($event)"></igx-date-picker>
         * ```
         */
        this.opening = new EventEmitter();
        /**
         * Emitted after the calendar has opened.
         *
         * @example
         * ```html
         * <igx-date-picker (opened)="handleOpened($event)"></igx-date-picker>
         * ```
         */
        this.opened = new EventEmitter();
        /**
         * Emitted when the calendar has started closing, cancelable.
         *
         * @example
         * ```html
         * <igx-date-picker (closing)="handleClosing($event)"></igx-date-picker>
         * ```
         */
        this.closing = new EventEmitter();
        /**
         * Emitted after the calendar has closed.
         *
         * @example
         * ```html
         * <igx-date-picker (closed)="handleClosed($event)"></igx-date-picker>
         * ```
         */
        this.closed = new EventEmitter();
        this._collapsed = true;
        this._destroy$ = new Subject();
        this.locale = this.locale || this._localeId;
    }
    /**
     * Determines how the picker's input will be styled.
     *
     * @remarks
     * Default is `box`.
     *
     * @example
     * ```html
     * <igx-date-picker [type]="'line'"></igx-date-picker>
     * ```
     */
    set type(val) {
        this._type = val;
    }
    get type() {
        return this._type || this._inputGroupType;
    }
    /**
     * Gets the picker's pop-up state.
     *
     * @example
     * ```typescript
     * const state = this.picker.collapsed;
     * ```
     */
    get collapsed() {
        return this._collapsed;
    }
    /** @hidden @internal */
    get isDropdown() {
        return this.mode === PickerInteractionMode.DropDown;
    }
    /** @hidden @internal */
    ngAfterViewInit() {
        this.subToIconsClicked(this.toggleComponents, () => this.open());
        this.toggleComponents.changes.pipe(takeUntil(this._destroy$))
            .subscribe(() => this.subToIconsClicked(this.toggleComponents, () => this.open()));
    }
    /** @hidden @internal */
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
    /** Subscribes to the click events of toggle/clear icons in a query */
    subToIconsClicked(components, next) {
        components.forEach(toggle => {
            toggle.clicked
                .pipe(takeUntil(merge(components.changes, this._destroy$)))
                .subscribe(next);
        });
    }
    ;
}
PickerBaseDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: PickerBaseDirective, deps: [{ token: i0.ElementRef }, { token: LOCALE_ID }, { token: DisplayDensityToken, optional: true }, { token: IGX_INPUT_GROUP_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
PickerBaseDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: PickerBaseDirective, inputs: { inputFormat: "inputFormat", displayFormat: "displayFormat", placeholder: "placeholder", mode: "mode", overlaySettings: "overlaySettings", disabled: "disabled", locale: "locale", outlet: "outlet", type: "type", tabIndex: "tabIndex" }, outputs: { opening: "opening", opened: "opened", closing: "closing", closed: "closed" }, queries: [{ propertyName: "toggleComponents", predicate: IgxPickerToggleComponent, descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: PickerBaseDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DisplayDensityToken]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [IGX_INPUT_GROUP_TYPE]
                }] }]; }, propDecorators: { inputFormat: [{
                type: Input
            }], displayFormat: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], mode: [{
                type: Input
            }], overlaySettings: [{
                type: Input
            }], disabled: [{
                type: Input
            }], locale: [{
                type: Input
            }], outlet: [{
                type: Input
            }], type: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], opening: [{
                type: Output
            }], opened: [{
                type: Output
            }], closing: [{
                type: Output
            }], closed: [{
                type: Output
            }], toggleComponents: [{
                type: ContentChildren,
                args: [IgxPickerToggleComponent, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLWJhc2UuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RhdGUtY29tbW9uL3BpY2tlci1iYXNlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ1ksZUFBZSxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQ25FLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFhLFFBQVEsRUFBRSxNQUFNLEVBQ3hELE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQTBCLE1BQU0saUJBQWlCLENBQUM7QUFNbEcsT0FBTyxFQUFxQixvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXBGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFHaEQsTUFBTSxPQUFnQixtQkFBb0IsU0FBUSxrQkFBa0I7SUF1TmhFLFlBQW1CLE9BQW1CLEVBQ0wsU0FBaUIsRUFDSyxzQkFBK0MsRUFDOUMsZUFBbUM7UUFDdkYsS0FBSyxDQUFDLHNCQUFzQixJQUFJLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFKcEQsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNMLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDSywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXlCO1FBQzlDLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQTNMM0Y7Ozs7Ozs7V0FPRztRQUVJLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBRXhCOzs7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LEtBQUs7Z0JBWUMsZUFBZTtzQkFEckIsS0FBSztnQkFZQyxRQUFRO3NCQURkLEtBQUs7Z0JBa0JDLE1BQU07c0JBRFosS0FBSztnQkFlQyxNQUFNO3NCQURaLEtBQUs7Z0JBZUssSUFBSTtzQkFEZCxLQUFLO2dCQWlCQyxRQUFRO3NCQURkLEtBQUs7Z0JBWUMsT0FBTztzQkFEYixNQUFNO2dCQVlBLE1BQU07c0JBRFosTUFBTTtnQkFZQSxPQUFPO3NCQURiLE1BQU07Z0JBWUEsTUFBTTtzQkFEWixNQUFNO2dCQUtBLGdCQUFnQjtzQkFEdEIsZUFBZTt1QkFBQyx3QkFBd0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsIENvbnRlbnRDaGlsZHJlbiwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsXG4gICAgSW5qZWN0LCBJbnB1dCwgTE9DQUxFX0lELCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFF1ZXJ5TGlzdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG1lcmdlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBEaXNwbGF5RGVuc2l0eUJhc2UsIERpc3BsYXlEZW5zaXR5VG9rZW4sIElEaXNwbGF5RGVuc2l0eU9wdGlvbnMgfSBmcm9tICcuLi9jb3JlL2RlbnNpdHknO1xuaW1wb3J0IHsgRWRpdG9yUHJvdmlkZXIgfSBmcm9tICcuLi9jb3JlL2VkaXQtcHJvdmlkZXInO1xuaW1wb3J0IHsgSVRvZ2dsZVZpZXcgfSBmcm9tICcuLi9jb3JlL25hdmlnYXRpb24nO1xuaW1wb3J0IHsgSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncywgSUJhc2VFdmVudEFyZ3MgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IERhdGVSYW5nZSB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyL3B1YmxpY19hcGknO1xuaW1wb3J0IHsgSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvdG9nZ2xlL3RvZ2dsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWd4SW5wdXRHcm91cFR5cGUsIElHWF9JTlBVVF9HUk9VUF9UWVBFIH0gZnJvbSAnLi4vaW5wdXQtZ3JvdXAvcHVibGljX2FwaSc7XG5pbXBvcnQgeyBPdmVybGF5U2V0dGluZ3MgfSBmcm9tICcuLi9zZXJ2aWNlcy9vdmVybGF5L3V0aWxpdGllcyc7XG5pbXBvcnQgeyBJZ3hQaWNrZXJUb2dnbGVDb21wb25lbnQgfSBmcm9tICcuL3BpY2tlci1pY29ucy5jb21tb24nO1xuaW1wb3J0IHsgUGlja2VySW50ZXJhY3Rpb25Nb2RlIH0gZnJvbSAnLi90eXBlcyc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBpY2tlckJhc2VEaXJlY3RpdmUgZXh0ZW5kcyBEaXNwbGF5RGVuc2l0eUJhc2UgaW1wbGVtZW50cyBJVG9nZ2xlVmlldywgRWRpdG9yUHJvdmlkZXIsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgLyoqXG4gICAgICogVGhlIGVkaXRvcidzIGlucHV0IG1hc2suXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIEFsc28gdXNlZCBhcyBhIHBsYWNlaG9sZGVyIHdoZW4gbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgKiBEZWZhdWx0IGlzIGBcIidNTS9kZC95eXl5J1wiYFxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciBpbnB1dEZvcm1hdD1cImRkL01NL3l5XCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5wdXRGb3JtYXQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBmb3JtYXQgdXNlZCB0byBkaXNwbGF5IHRoZSBwaWNrZXIncyB2YWx1ZSB3aGVuIGl0J3Mgbm90IGJlaW5nIGVkaXRlZC5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVXNlcyBBbmd1bGFyJ3MgRGF0ZVBpcGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIGRpc3BsYXlGb3JtYXQ9XCJFRS9NL3l5XCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNwbGF5Rm9ybWF0OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgcGxhY2Vob2xkZXJgIG9mIHRoZSBwaWNrZXIncyBpbnB1dC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgW3BsYWNlaG9sZGVyXT1cIidDaG9vc2UgeW91ciBkYXRlJ1wiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBsYWNlaG9sZGVyID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBDYW4gYmUgYGRyb3Bkb3duYCB3aXRoIGVkaXRhYmxlIGlucHV0IGZpZWxkIG9yIGBkaWFsb2dgIHdpdGggcmVhZG9ubHkgaW5wdXQgZmllbGQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIERlZmF1bHQgbW9kZSBpcyBgZHJvcGRvd25gXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIG1vZGU9XCJkaWFsb2dcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtb2RlOiBQaWNrZXJJbnRlcmFjdGlvbk1vZGUgPSBQaWNrZXJJbnRlcmFjdGlvbk1vZGUuRHJvcERvd247XG5cbiAgICAvKipcbiAgICAgKiBPdmVybGF5IHNldHRpbmdzIHVzZWQgdG8gZGlzcGxheSB0aGUgcG9wLXVwIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFtvdmVybGF5U2V0dGluZ3NdPVwiY3VzdG9tT3ZlcmxheVNldHRpbmdzXCI+PC9pZ3gtZGF0ZS1waWNrZXI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgb3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3M7XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIG9yIGRpc2FibGVzIHRoZSBwaWNrZXIuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFtkaXNhYmxlZF09XCIndHJ1ZSdcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogTG9jYWxlIHNldHRpbmdzIHVzZWQgZm9yIHZhbHVlIGZvcm1hdHRpbmcgYW5kIGNhbGVuZGFyIG9yIHRpbWUgc3Bpbm5lci5cbiAgICAgKlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVXNlcyBBbmd1bGFyJ3MgYExPQ0FMRV9JRGAgYnkgZGVmYXVsdC4gQWZmZWN0cyBib3RoIGlucHV0IG1hc2sgYW5kIGRpc3BsYXkgZm9ybWF0IGlmIHRob3NlIGFyZSBub3Qgc2V0LlxuICAgICAqIElmIGEgYGxvY2FsZWAgaXMgc2V0LCBpdCBtdXN0IGJlIHJlZ2lzdGVyZWQgdmlhIGByZWdpc3RlckxvY2FsZURhdGFgLlxuICAgICAqIFBsZWFzZSByZWZlciB0byBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvaTE4biNpMThuLXBpcGVzLlxuICAgICAqIElmIGl0IGlzIG5vdCByZWdpc3RlcmVkLCBgSW50bGAgd2lsbCBiZSB1c2VkIGZvciBmb3JtYXR0aW5nLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciBsb2NhbGU9XCJqcFwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGxvY2FsZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciB1c2VkIGZvciB0aGUgcG9wLXVwIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IGlneE92ZXJsYXlPdXRsZXQgI291dGxldD1cIm92ZXJsYXktb3V0bGV0XCI+PC9kaXY+XG4gICAgICogPCEtLSAuLi4gLS0+XG4gICAgICogPGlneC1kYXRlLXBpY2tlciBbb3V0bGV0XT1cIm91dGxldFwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIDwhLS0gLi4uIC0tPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG91dGxldDogSWd4T3ZlcmxheU91dGxldERpcmVjdGl2ZSB8IEVsZW1lbnRSZWY7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIGhvdyB0aGUgcGlja2VyJ3MgaW5wdXQgd2lsbCBiZSBzdHlsZWQuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIERlZmF1bHQgaXMgYGJveGAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIFt0eXBlXT1cIidsaW5lJ1wiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB0eXBlKHZhbDogSWd4SW5wdXRHcm91cFR5cGUpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IHZhbDtcbiAgICB9XG4gICAgcHVibGljIGdldCB0eXBlKCk6IElneElucHV0R3JvdXBUeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGUgfHwgdGhpcy5faW5wdXRHcm91cFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cy9TZXRzIHRoZSBkZWZhdWx0IHRlbXBsYXRlIGVkaXRvcidzIHRhYmluZGV4LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciBbdGFiSW5kZXhdPVwiMVwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRhYkluZGV4OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIHdoZW4gdGhlIGNhbGVuZGFyIGhhcyBzdGFydGVkIG9wZW5pbmcsIGNhbmNlbGFibGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIChvcGVuaW5nKT1cImhhbmRsZU9wZW5pbmcoJGV2ZW50KVwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvcGVuaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUNhbmNlbGFibGVCcm93c2VyRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBhZnRlciB0aGUgY2FsZW5kYXIgaGFzIG9wZW5lZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpZ3gtZGF0ZS1waWNrZXIgKG9wZW5lZCk9XCJoYW5kbGVPcGVuZWQoJGV2ZW50KVwiPjwvaWd4LWRhdGUtcGlja2VyPlxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvcGVuZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElCYXNlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCB3aGVuIHRoZSBjYWxlbmRhciBoYXMgc3RhcnRlZCBjbG9zaW5nLCBjYW5jZWxhYmxlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1kYXRlLXBpY2tlciAoY2xvc2luZyk9XCJoYW5kbGVDbG9zaW5nKCRldmVudClcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8SUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQgYWZ0ZXIgdGhlIGNhbGVuZGFyIGhhcyBjbG9zZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8aWd4LWRhdGUtcGlja2VyIChjbG9zZWQpPVwiaGFuZGxlQ2xvc2VkKCRldmVudClcIj48L2lneC1kYXRlLXBpY2tlcj5cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxJQmFzZUV2ZW50QXJncz4oKTtcblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBDb250ZW50Q2hpbGRyZW4oSWd4UGlja2VyVG9nZ2xlQ29tcG9uZW50LCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gICAgcHVibGljIHRvZ2dsZUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxJZ3hQaWNrZXJUb2dnbGVDb21wb25lbnQ+O1xuXG4gICAgcHJvdGVjdGVkIF9jb2xsYXBzZWQgPSB0cnVlO1xuICAgIHByb3RlY3RlZCBfdHlwZTogSWd4SW5wdXRHcm91cFR5cGU7XG4gICAgcHJvdGVjdGVkIF9taW5WYWx1ZTogRGF0ZSB8IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX21heFZhbHVlOiBEYXRlIHwgc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcGlja2VyJ3MgcG9wLXVwIHN0YXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogY29uc3Qgc3RhdGUgPSB0aGlzLnBpY2tlci5jb2xsYXBzZWQ7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGdldCBjb2xsYXBzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsYXBzZWQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIGdldCBpc0Ryb3Bkb3duKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlID09PSBQaWNrZXJJbnRlcmFjdGlvbk1vZGUuRHJvcERvd247XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9kZXN0cm95JCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICAvLyBELlAuIEV2ZW50RW1pdHRlcjxzdHJpbmcgfCBEYXRlIHwgRGF0ZVJhbmdlIHwgbnVsbD4gdGhyb3dzIG9uIHN0cmljdCBjaGVja3MgZm9yIG1vcmUgcmVzdHJpY3RpdmUgb3ZlcnJpZGVzXG4gICAgLy8gdy8gVFMyNDE2IFR5cGUgJ3N0cmluZyB8IERhdGUgLi4uJyBub3QgYXNzaWduYWJsZSB0byB0eXBlICdEYXRlUmFuZ2UnIGR1ZSB0byBvYnNlcnZlciBtZXRob2QgY2hlY2tcbiAgICBwdWJsaWMgYWJzdHJhY3QgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcm90ZWN0ZWQgX2xvY2FsZUlkOiBzdHJpbmcsXG4gICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRGlzcGxheURlbnNpdHlUb2tlbikgcHJvdGVjdGVkIF9kaXNwbGF5RGVuc2l0eU9wdGlvbnM/OiBJRGlzcGxheURlbnNpdHlPcHRpb25zLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KElHWF9JTlBVVF9HUk9VUF9UWVBFKSBwcm90ZWN0ZWQgX2lucHV0R3JvdXBUeXBlPzogSWd4SW5wdXRHcm91cFR5cGUpIHtcbiAgICAgICAgc3VwZXIoX2Rpc3BsYXlEZW5zaXR5T3B0aW9ucyB8fCB7IGRpc3BsYXlEZW5zaXR5OiAnY29tZm9ydGFibGUnIH0pO1xuICAgICAgICB0aGlzLmxvY2FsZSA9IHRoaXMubG9jYWxlIHx8IHRoaXMuX2xvY2FsZUlkO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3ViVG9JY29uc0NsaWNrZWQodGhpcy50b2dnbGVDb21wb25lbnRzLCAoKSA9PiB0aGlzLm9wZW4oKSk7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29tcG9uZW50cy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zdWJUb0ljb25zQ2xpY2tlZCh0aGlzLnRvZ2dsZUNvbXBvbmVudHMsICgpID0+IHRoaXMub3BlbigpKSk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9kZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgLyoqIFN1YnNjcmliZXMgdG8gdGhlIGNsaWNrIGV2ZW50cyBvZiB0b2dnbGUvY2xlYXIgaWNvbnMgaW4gYSBxdWVyeSAqL1xuICAgIHByb3RlY3RlZCBzdWJUb0ljb25zQ2xpY2tlZChjb21wb25lbnRzOiBRdWVyeUxpc3Q8SWd4UGlja2VyVG9nZ2xlQ29tcG9uZW50PiwgbmV4dDogKCkgPT4gYW55KSB7XG4gICAgICAgIGNvbXBvbmVudHMuZm9yRWFjaCh0b2dnbGUgPT4ge1xuICAgICAgICAgICAgdG9nZ2xlLmNsaWNrZWRcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UoY29tcG9uZW50cy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95JCkpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobmV4dCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2VsZWN0KHZhbHVlOiBEYXRlIHwgRGF0ZVJhbmdlIHwgc3RyaW5nKTogdm9pZDtcbiAgICBwdWJsaWMgYWJzdHJhY3Qgb3BlbihzZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncyk6IHZvaWQ7XG4gICAgcHVibGljIGFic3RyYWN0IHRvZ2dsZShzZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncyk6IHZvaWQ7XG4gICAgcHVibGljIGFic3RyYWN0IGNsb3NlKCk6IHZvaWQ7XG4gICAgcHVibGljIGFic3RyYWN0IGdldEVkaXRFbGVtZW50KCk6IEhUTUxJbnB1dEVsZW1lbnQ7XG59XG4iXX0=