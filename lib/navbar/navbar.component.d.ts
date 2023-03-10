import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../directives/button/button.directive";
import * as i2 from "../icon/public_api";
import * as i3 from "@angular/common";
/**
 * IgxActionIcon is a container for the action nav icon of the IgxNavbar.
 */
export declare class IgxNavbarActionDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxNavbarActionDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxNavbarActionDirective, "igx-navbar-action,[igxNavbarAction]", never, {}, {}, never>;
}
export declare class IgxNavbarTitleDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxNavbarTitleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxNavbarTitleDirective, "igx-navbar-title,[igxNavbarTitle]", never, {}, {}, never>;
}
/**
 * **Ignite UI for Angular Navbar** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/navbar.html)
 *
 * The Ignite UI Navbar is most commonly used to provide an app header with a hamburger menu and navigation
 * state such as a "Go Back" button. It also supports other actions represented by icons.
 *
 * Example:
 * ```html
 * <igx-navbar title="Sample App" actionButtonIcon="menu">
 *   <igx-icon>search</igx-icon>
 *   <igx-icon>favorite</igx-icon>
 *   <igx-icon>more_vert</igx-icon>
 * </igx-navbar>
 * ```
 */
export declare class IgxNavbarComponent {
    /**
     * An @Input property that sets the value of the `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-navbar [id]="'igx-navbar-12'" title="Sample App" actionButtonIcon="menu">
     * ```
     */
    id: string;
    /**
     * An @Input property that sets the icon of the `IgxNavbarComponent`.
     * ```html
     * <igx-navbar [title]="currentView" actionButtonIcon="arrow_back"></igx-navbar>
     * ```
     */
    actionButtonIcon: string;
    /**
     * An @Input property that sets the title of the `IgxNavbarComponent`.
     * ```html
     * <igx-navbar title="Sample App" actionButtonIcon="menu">
     * ```
     */
    title: string;
    /**
     * The event that will be thrown when the action is executed,
     * provides reference to the `IgxNavbar` component as argument
     * ```typescript
     * public actionExc(event){
     *     alert("Action Execute!");
     * }
     *  //..
     * ```
     * ```html
     * <igx-navbar (action)="actionExc($event)" title="Sample App" actionButtonIcon="menu">
     * ```
     */
    action: EventEmitter<IgxNavbarComponent>;
    /**
     * An @Input property that sets the titleId of the `IgxNavbarComponent`. If not set it will be automatically generated.
     * ```html
     * <igx-navbar [titleId]="'igx-navbar-7'" title="Sample App" actionButtonIcon="menu">
     * ```
     */
    titleId: string;
    /**
     * @hidden
     */
    protected actionIconTemplate: IgxNavbarActionDirective;
    /**
     * @hidden
     */
    protected titleContent: IgxNavbarTitleDirective;
    private isVisible;
    /**
     * Sets whether the action button of the `IgxNavbarComponent` is visible.
     * ```html
     * <igx-navbar [title]="currentView" [isActionButtonVisible]="'false'"></igx-navbar>
     * ```
     */
    set isActionButtonVisible(value: boolean);
    /**
     * Returns whether the `IgxNavbarComponent` action button is visible, true/false.
     * ```typescript
     *  @ViewChild("MyChild")
     * public navBar: IgxNavbarComponent;
     * ngAfterViewInit(){
     *     let actionButtonVisibile = this.navBar.isActionButtonVisible;
     * }
     * ```
     */
    get isActionButtonVisible(): boolean;
    get isTitleContentVisible(): boolean;
    /**
     * @hidden
     */
    _triggerAction(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxNavbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IgxNavbarComponent, "igx-navbar", never, { "id": "id"; "actionButtonIcon": "actionButtonIcon"; "title": "title"; "titleId": "titleId"; "isActionButtonVisible": "isActionButtonVisible"; }, { "action": "action"; }, ["actionIconTemplate", "titleContent"], ["igx-navbar-action, [igxNavbarAction]", "igx-navbar-title, [igxNavbarTitle]", "*"]>;
}
/**
 * @hidden
 */
export declare class IgxNavbarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxNavbarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IgxNavbarModule, [typeof IgxNavbarComponent, typeof IgxNavbarActionDirective, typeof IgxNavbarTitleDirective], [typeof i1.IgxButtonModule, typeof i2.IgxIconModule, typeof i3.CommonModule], [typeof IgxNavbarComponent, typeof IgxNavbarActionDirective, typeof IgxNavbarTitleDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IgxNavbarModule>;
}
