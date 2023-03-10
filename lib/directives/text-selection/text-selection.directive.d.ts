import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class IgxTextSelectionDirective {
    private element;
    private selectionState;
    /**
     * Returns whether the input element is selectable through the directive.
     *
     * ```typescript
     * // get
     * @ViewChild('firstName',
     *  {read: IgxTextSelectionDirective})
     * public firstName: IgxTextSelectionDirective;
     *
     * public getFirstNameSelectionStatus() {
     *  return this.firstName.selected;
     * }
     * ```
     */
    get selected(): boolean;
    /**
     *  Determines whether the input element could be selected through the directive.
     *
     * ```html
     * <!--set-->
     * <input
     *   type="text"
     *   id="firstName"
     *   [igxTextSelection]="true">
     * </input>
     *
     * <input
     *   type="text"
     *   id="lastName"
     *   igxTextSelection
     *   [selected]="true">
     * </input>
     * ```
     */
    set selected(val: boolean);
    /**
     * Returns the nativeElement of the element where the directive was applied.
     *
     * ```html
     * <input
     *   type="text"
     *   id="firstName"
     *   igxTextSelection>
     * </input>
     * ```
     *
     * ```typescript
     * @ViewChild('firstName',
     *  {read: IgxTextSelectionDirective})
     * public inputElement: IgxTextSelectionDirective;
     *
     * public getNativeElement() {
     *  return this.inputElement.nativeElement;
     * }
     * ```
     */
    get nativeElement(): any;
    constructor(element: ElementRef);
    /**
     * @hidden
     */
    onFocus(): void;
    /**
     * Triggers the selection of the element if it is marked as selectable.
     *
     * ```html
     * <input
     *   type="text"
     *   id="firstName"
     *   igxTextSelection>
     * </input>
     * ```
     *
     * ```typescript
     * @ViewChild('firstName',
     *  {read: IgxTextSelectionDirective})
     * public inputElement: IgxTextSelectionDirective;
     *
     * public triggerElementSelection() {
     *  this.inputElement.trigger();
     * }
     * ```
     */
    trigger(): void;
    static ??fac: i0.????FactoryDeclaration<IgxTextSelectionDirective, never>;
    static ??dir: i0.????DirectiveDeclaration<IgxTextSelectionDirective, "[igxTextSelection]", ["igxTextSelection"], { "selected": "igxTextSelection"; }, {}, never>;
}
/**
 * @hidden
 */
export declare class IgxTextSelectionModule {
    static ??fac: i0.????FactoryDeclaration<IgxTextSelectionModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxTextSelectionModule, [typeof IgxTextSelectionDirective], never, [typeof IgxTextSelectionDirective]>;
    static ??inj: i0.????InjectorDeclaration<IgxTextSelectionModule>;
}
