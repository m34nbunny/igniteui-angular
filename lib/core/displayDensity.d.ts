import { InjectionToken, EventEmitter, DoCheck, OnInit } from '@angular/core';
import { IBaseEventArgs } from './utils';
import * as i0 from "@angular/core";
/**
 * Defines the possible values of the components' display density.
 */
export declare const DisplayDensity: {
    comfortable: "comfortable";
    cosy: "cosy";
    compact: "compact";
};
export declare type DisplayDensity = (typeof DisplayDensity)[keyof typeof DisplayDensity];
/**
 * Describes the object used to configure the DisplayDensity in Angular DI.
 */
export interface IDisplayDensityOptions {
    displayDensity: DisplayDensity;
}
export interface IDensityChangedEventArgs extends IBaseEventArgs {
    oldDensity: DisplayDensity;
    newDensity: DisplayDensity;
}
/**
 * Defines the DisplayDensity DI token.
 */
export declare const DisplayDensityToken: InjectionToken<IDisplayDensityOptions>;
/**
 * Base class containing all logic required for implementing DisplayDensity.
 */
export declare class DisplayDensityBase implements DoCheck, OnInit {
    protected displayDensityOptions: IDisplayDensityOptions;
    onDensityChanged: EventEmitter<IDensityChangedEventArgs>;
    /**
     * Returns the theme of the component.
     * The default theme is `comfortable`.
     * Available options are `comfortable`, `cosy`, `compact`.
     * ```typescript
     * let componentTheme = this.component.displayDensity;
     * ```
     */
    get displayDensity(): DisplayDensity;
    /**
     * Sets the theme of the component.
     */
    set displayDensity(val: DisplayDensity);
    /**
     * @hidden
     */
    initialDensity: DisplayDensity;
    protected oldDisplayDensityOptions: IDisplayDensityOptions;
    protected _displayDensity: DisplayDensity;
    constructor(displayDensityOptions: IDisplayDensityOptions);
    /**
     * @hidden
     */
    ngOnInit(): void;
    ngDoCheck(): void;
    /**
     * Given a style class of a component/element returns the modified version of it based
     * on the current display density.
     */
    protected getComponentDensityClass(baseStyleClass: string): string;
    static ??fac: i0.????FactoryDeclaration<DisplayDensityBase, [{ optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<DisplayDensityBase, "[igxDisplayDensityBase]", never, { "displayDensity": "displayDensity"; }, { "onDensityChanged": "onDensityChanged"; }, never>;
}
export declare class IgxDisplayDensityModule {
    static ??fac: i0.????FactoryDeclaration<IgxDisplayDensityModule, never>;
    static ??mod: i0.????NgModuleDeclaration<IgxDisplayDensityModule, [typeof DisplayDensityBase], never, [typeof DisplayDensityBase]>;
    static ??inj: i0.????InjectorDeclaration<IgxDisplayDensityModule>;
}
