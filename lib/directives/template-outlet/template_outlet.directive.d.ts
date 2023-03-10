import { EmbeddedViewRef, OnChanges, ChangeDetectorRef, SimpleChanges, TemplateRef, ViewContainerRef, NgZone, EventEmitter } from '@angular/core';
import { IBaseEventArgs } from '../../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * @hidden
 */
export declare class IgxTemplateOutletDirective implements OnChanges {
    _viewContainerRef: ViewContainerRef;
    private _zone;
    cdr: ChangeDetectorRef;
    igxTemplateOutletContext: any;
    igxTemplateOutlet: TemplateRef<any>;
    viewCreated: EventEmitter<IViewChangeEventArgs>;
    viewMoved: EventEmitter<IViewChangeEventArgs>;
    cachedViewLoaded: EventEmitter<ICachedViewLoadedEventArgs>;
    beforeViewDetach: EventEmitter<IViewChangeEventArgs>;
    private _viewRef;
    /**
     * The embedded views cache. Collection is key-value paired.
     * Key is the template type, value is another key-value paired collection
     * where the key is the template id and value is the embedded view for the related template.
     */
    private _embeddedViewsMap;
    constructor(_viewContainerRef: ViewContainerRef, _zone: NgZone, cdr: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    cleanCache(): void;
    cleanView(tmplID: any): void;
    private _recreateView;
    private _moveView;
    private _useCachedView;
    private _shouldRecreateView;
    private _hasContextShapeChanged;
    private _updateExistingContext;
    private _cloneContext;
    private _getActionType;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTemplateOutletDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxTemplateOutletDirective, "[igxTemplateOutlet]", never, { "igxTemplateOutletContext": "igxTemplateOutletContext"; "igxTemplateOutlet": "igxTemplateOutlet"; }, { "viewCreated": "viewCreated"; "viewMoved": "viewMoved"; "cachedViewLoaded": "cachedViewLoaded"; "beforeViewDetach": "beforeViewDetach"; }, never>;
}
export interface IViewChangeEventArgs extends IBaseEventArgs {
    owner: IgxTemplateOutletDirective;
    view: EmbeddedViewRef<any>;
    context: any;
}
export interface ICachedViewLoadedEventArgs extends IViewChangeEventArgs {
    oldContext: any;
}
/**
 * @hidden
 */
export declare class IgxTemplateOutletModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTemplateOutletModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<IgxTemplateOutletModule, [typeof IgxTemplateOutletDirective], [typeof i1.CommonModule], [typeof IgxTemplateOutletDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<IgxTemplateOutletModule>;
}
