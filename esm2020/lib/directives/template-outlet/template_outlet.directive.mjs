import { Directive, Input, NgModule, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export class IgxTemplateOutletDirective {
    constructor(_viewContainerRef, _zone, cdr) {
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this.cdr = cdr;
        this.viewCreated = new EventEmitter();
        this.viewMoved = new EventEmitter();
        this.cachedViewLoaded = new EventEmitter();
        this.beforeViewDetach = new EventEmitter();
        /**
         * The embedded views cache. Collection is key-value paired.
         * Key is the template type, value is another key-value paired collection
         * where the key is the template id and value is the embedded view for the related template.
         */
        this._embeddedViewsMap = new Map();
    }
    ngOnChanges(changes) {
        const actionType = this._getActionType(changes);
        switch (actionType) {
            case TemplateOutletAction.CreateView:
                this._recreateView();
                break;
            case TemplateOutletAction.MoveView:
                this._moveView();
                break;
            case TemplateOutletAction.UseCachedView:
                this._useCachedView();
                break;
            case TemplateOutletAction.UpdateViewContext:
                this._updateExistingContext(this.igxTemplateOutletContext);
                break;
        }
    }
    cleanCache() {
        this._embeddedViewsMap.forEach((collection) => {
            collection.forEach((item => {
                if (!item.destroyed) {
                    item.destroy();
                }
            }));
            collection.clear();
        });
        this._embeddedViewsMap.clear();
    }
    cleanView(tmplID) {
        const embViewCollection = this._embeddedViewsMap.get(tmplID.type);
        const embView = embViewCollection?.get(tmplID.id);
        if (embView) {
            embView.destroy();
            this._embeddedViewsMap.get(tmplID.type).delete(tmplID.id);
        }
    }
    _recreateView() {
        const prevIndex = this._viewRef ? this._viewContainerRef.indexOf(this._viewRef) : -1;
        // detach old and create new
        if (prevIndex !== -1) {
            this.beforeViewDetach.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext });
            this._viewContainerRef.detach(prevIndex);
        }
        if (this.igxTemplateOutlet) {
            this._viewRef = this._viewContainerRef.createEmbeddedView(this.igxTemplateOutlet, this.igxTemplateOutletContext);
            this.viewCreated.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext });
            const tmplId = this.igxTemplateOutletContext['templateID'];
            if (tmplId) {
                // if context contains a template id, check if we have a view for that template already stored in the cache
                // if not create a copy and add it to the cache in detached state.
                // Note: Views in detached state do not appear in the DOM, however they remain stored in memory.
                const resCollection = this._embeddedViewsMap.get(this.igxTemplateOutletContext['templateID'].type);
                const res = resCollection?.get(this.igxTemplateOutletContext['templateID'].id);
                if (!res) {
                    this._embeddedViewsMap.set(this.igxTemplateOutletContext['templateID'].type, new Map([[this.igxTemplateOutletContext['templateID'].id, this._viewRef]]));
                }
            }
        }
    }
    _moveView() {
        // using external view and inserting it in current view.
        const view = this.igxTemplateOutletContext['moveView'];
        const owner = this.igxTemplateOutletContext['owner'];
        if (view !== this._viewRef) {
            if (owner._viewContainerRef.indexOf(view) !== -1) {
                // detach in case view it is attached somewhere else at the moment.
                this.beforeViewDetach.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext });
                owner._viewContainerRef.detach(owner._viewContainerRef.indexOf(view));
            }
            if (this._viewRef && this._viewContainerRef.indexOf(this._viewRef) !== -1) {
                this.beforeViewDetach.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext });
                this._viewContainerRef.detach(this._viewContainerRef.indexOf(this._viewRef));
            }
            this._viewRef = view;
            this._viewContainerRef.insert(view, 0);
            this._updateExistingContext(this.igxTemplateOutletContext);
            this.viewMoved.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext });
        }
        else {
            this._updateExistingContext(this.igxTemplateOutletContext);
        }
    }
    _useCachedView() {
        // use view for specific template cached in the current template outlet
        const tmplID = this.igxTemplateOutletContext['templateID'];
        const cachedView = tmplID ?
            this._embeddedViewsMap.get(tmplID.type)?.get(tmplID.id) :
            null;
        // if view exists, but template has been changed and there is a view in the cache with the related template
        // then detach old view and insert the stored one with the matching template
        // after that update its context.
        if (this._viewContainerRef.length > 0) {
            this.beforeViewDetach.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext });
            this._viewContainerRef.detach(this._viewContainerRef.indexOf(this._viewRef));
        }
        this._viewRef = cachedView;
        const oldContext = this._cloneContext(cachedView.context);
        this._viewContainerRef.insert(this._viewRef, 0);
        this._updateExistingContext(this.igxTemplateOutletContext);
        this.cachedViewLoaded.emit({ owner: this, view: this._viewRef, context: this.igxTemplateOutletContext, oldContext });
    }
    _shouldRecreateView(changes) {
        const ctxChange = changes['igxTemplateOutletContext'];
        return !!changes['igxTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
    }
    _hasContextShapeChanged(ctxChange) {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
            for (const propName of currCtxKeys) {
                if (prevCtxKeys.indexOf(propName) === -1) {
                    return true;
                }
            }
            return false;
        }
        else {
            return true;
        }
    }
    _updateExistingContext(ctx) {
        for (const propName of Object.keys(ctx)) {
            this._viewRef.context[propName] = this.igxTemplateOutletContext[propName];
        }
    }
    _cloneContext(ctx) {
        const clone = {};
        for (const propName of Object.keys(ctx)) {
            clone[propName] = ctx[propName];
        }
        return clone;
    }
    _getActionType(changes) {
        const movedView = this.igxTemplateOutletContext['moveView'];
        const tmplID = this.igxTemplateOutletContext['templateID'];
        const cachedView = tmplID ?
            this._embeddedViewsMap.get(tmplID.type)?.get(tmplID.id) :
            null;
        const shouldRecreate = this._shouldRecreateView(changes);
        if (movedView) {
            // view is moved from external source
            return TemplateOutletAction.MoveView;
        }
        else if (shouldRecreate && cachedView) {
            // should recreate (template or context change) and there is a matching template in cache
            return TemplateOutletAction.UseCachedView;
        }
        else if (!this._viewRef || shouldRecreate) {
            // no view or should recreate
            return TemplateOutletAction.CreateView;
        }
        else if (this.igxTemplateOutletContext) {
            // has context, update context
            return TemplateOutletAction.UpdateViewContext;
        }
    }
}
IgxTemplateOutletDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTemplateOutletDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
IgxTemplateOutletDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxTemplateOutletDirective, selector: "[igxTemplateOutlet]", inputs: { igxTemplateOutletContext: "igxTemplateOutletContext", igxTemplateOutlet: "igxTemplateOutlet" }, outputs: { viewCreated: "viewCreated", viewMoved: "viewMoved", cachedViewLoaded: "cachedViewLoaded", beforeViewDetach: "beforeViewDetach" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTemplateOutletDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[igxTemplateOutlet]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { igxTemplateOutletContext: [{
                type: Input
            }], igxTemplateOutlet: [{
                type: Input
            }], viewCreated: [{
                type: Output
            }], viewMoved: [{
                type: Output
            }], cachedViewLoaded: [{
                type: Output
            }], beforeViewDetach: [{
                type: Output
            }] } });
var TemplateOutletAction;
(function (TemplateOutletAction) {
    TemplateOutletAction[TemplateOutletAction["CreateView"] = 0] = "CreateView";
    TemplateOutletAction[TemplateOutletAction["MoveView"] = 1] = "MoveView";
    TemplateOutletAction[TemplateOutletAction["UseCachedView"] = 2] = "UseCachedView";
    TemplateOutletAction[TemplateOutletAction["UpdateViewContext"] = 3] = "UpdateViewContext";
})(TemplateOutletAction || (TemplateOutletAction = {}));
/**
 * @hidden
 */
export class IgxTemplateOutletModule {
}
IgxTemplateOutletModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTemplateOutletModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxTemplateOutletModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTemplateOutletModule, declarations: [IgxTemplateOutletDirective], imports: [CommonModule], exports: [IgxTemplateOutletDirective] });
IgxTemplateOutletModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTemplateOutletModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxTemplateOutletModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxTemplateOutletDirective],
                    exports: [IgxTemplateOutletDirective],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfb3V0bGV0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kaXJlY3RpdmVzL3RlbXBsYXRlLW91dGxldC90ZW1wbGF0ZV9vdXRsZXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQW1CLEtBQUssRUFDMkIsUUFBUSxFQUFVLE1BQU0sRUFBRSxZQUFZLEVBQ3JHLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFHL0M7O0dBRUc7QUFFSCxNQUFNLE9BQU8sMEJBQTBCO0lBMEJuQyxZQUFtQixpQkFBbUMsRUFBVSxLQUFhLEVBQVMsR0FBc0I7UUFBekYsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQXBCckcsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUd2RCxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXdCLENBQUM7UUFHckQscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQThCLENBQUM7UUFHbEUscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQXdCLENBQUM7UUFJbkU7Ozs7V0FJRztRQUNLLHNCQUFpQixHQUFnRCxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBR25GLENBQUM7SUFFTSxXQUFXLENBQUMsT0FBc0I7UUFDckMsTUFBTSxVQUFVLEdBQXlCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEUsUUFBUSxVQUFVLEVBQUU7WUFDaEIsS0FBSyxvQkFBb0IsQ0FBQyxVQUFVO2dCQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFBQyxNQUFNO1lBQ2xFLEtBQUssb0JBQW9C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QUNiLHlGQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFMSSxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBS3hCO0FBWUQ7O0dBRUc7QUFNSCxNQUFNLE9BQU8sdUJBQXVCOztvSEFBdkIsdUJBQXVCO3FIQUF2Qix1QkFBdUIsaUJBbk52QiwwQkFBMEIsYUFpTnpCLFlBQVksYUFqTmIsMEJBQTBCO3FIQW1OMUIsdUJBQXVCLFlBRnZCLENBQUMsWUFBWSxDQUFDOzJGQUVkLHVCQUF1QjtrQkFMbkMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMsMEJBQTBCLENBQUM7b0JBQ3JDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIERpcmVjdGl2ZSwgRW1iZWRkZWRWaWV3UmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmLCBOZ01vZHVsZSwgTmdab25lLCBPdXRwdXQsIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IElCYXNlRXZlbnRBcmdzIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbaWd4VGVtcGxhdGVPdXRsZXRdJyB9KVxuZXhwb3J0IGNsYXNzIElneFRlbXBsYXRlT3V0bGV0RGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKSBwdWJsaWMgaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0ICE6IGFueTtcblxuICAgIEBJbnB1dCgpIHB1YmxpYyBpZ3hUZW1wbGF0ZU91dGxldCAhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZpZXdDcmVhdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJVmlld0NoYW5nZUV2ZW50QXJncz4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB2aWV3TW92ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElWaWV3Q2hhbmdlRXZlbnRBcmdzPigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGNhY2hlZFZpZXdMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElDYWNoZWRWaWV3TG9hZGVkRXZlbnRBcmdzPigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGJlZm9yZVZpZXdEZXRhY2ggPSBuZXcgRXZlbnRFbWl0dGVyPElWaWV3Q2hhbmdlRXZlbnRBcmdzPigpO1xuXG4gICAgcHJpdmF0ZSBfdmlld1JlZiAhOiBFbWJlZGRlZFZpZXdSZWY8YW55PjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBlbWJlZGRlZCB2aWV3cyBjYWNoZS4gQ29sbGVjdGlvbiBpcyBrZXktdmFsdWUgcGFpcmVkLlxuICAgICAqIEtleSBpcyB0aGUgdGVtcGxhdGUgdHlwZSwgdmFsdWUgaXMgYW5vdGhlciBrZXktdmFsdWUgcGFpcmVkIGNvbGxlY3Rpb25cbiAgICAgKiB3aGVyZSB0aGUga2V5IGlzIHRoZSB0ZW1wbGF0ZSBpZCBhbmQgdmFsdWUgaXMgdGhlIGVtYmVkZGVkIHZpZXcgZm9yIHRoZSByZWxhdGVkIHRlbXBsYXRlLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2VtYmVkZGVkVmlld3NNYXA6IE1hcDxzdHJpbmcsIE1hcDxhbnksIEVtYmVkZGVkVmlld1JlZjxhbnk+Pj4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSwgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBjb25zdCBhY3Rpb25UeXBlOiBUZW1wbGF0ZU91dGxldEFjdGlvbiA9IHRoaXMuX2dldEFjdGlvblR5cGUoY2hhbmdlcyk7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBUZW1wbGF0ZU91dGxldEFjdGlvbi5DcmVhdGVWaWV3OiB0aGlzLl9yZWNyZWF0ZVZpZXcoKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFRlbXBsYXRlT3V0bGV0QWN0aW9uLk1vdmVWaWV3OiB0aGlzLl9tb3ZlVmlldygpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgVGVtcGxhdGVPdXRsZXRBY3Rpb24uVXNlQ2FjaGVkVmlldzogdGhpcy5fdXNlQ2FjaGVkVmlldygpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgVGVtcGxhdGVPdXRsZXRBY3Rpb24uVXBkYXRlVmlld0NvbnRleHQ6IHRoaXMuX3VwZGF0ZUV4aXN0aW5nQ29udGV4dCh0aGlzLmlneFRlbXBsYXRlT3V0bGV0Q29udGV4dCk7IGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFuQ2FjaGUoKSB7XG4gICAgICAgIHRoaXMuX2VtYmVkZGVkVmlld3NNYXAuZm9yRWFjaCgoY29sbGVjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29sbGVjdGlvbi5mb3JFYWNoKChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24uY2xlYXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2VtYmVkZGVkVmlld3NNYXAuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYW5WaWV3KHRtcGxJRCkge1xuICAgICAgICBjb25zdCBlbWJWaWV3Q29sbGVjdGlvbiA9IHRoaXMuX2VtYmVkZGVkVmlld3NNYXAuZ2V0KHRtcGxJRC50eXBlKTtcbiAgICAgICAgY29uc3QgZW1iVmlldyA9IGVtYlZpZXdDb2xsZWN0aW9uPy5nZXQodG1wbElELmlkKTtcbiAgICAgICAgaWYgKGVtYlZpZXcpIHtcbiAgICAgICAgICAgIGVtYlZpZXcuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWRWaWV3c01hcC5nZXQodG1wbElELnR5cGUpLmRlbGV0ZSh0bXBsSUQuaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVjcmVhdGVWaWV3KCkge1xuICAgICAgICBjb25zdCBwcmV2SW5kZXggPSB0aGlzLl92aWV3UmVmID8gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5pbmRleE9mKHRoaXMuX3ZpZXdSZWYpIDogLTE7XG4gICAgICAgIC8vIGRldGFjaCBvbGQgYW5kIGNyZWF0ZSBuZXdcbiAgICAgICAgaWYgKHByZXZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlVmlld0RldGFjaC5lbWl0KHsgb3duZXI6IHRoaXMsIHZpZXc6IHRoaXMuX3ZpZXdSZWYsIGNvbnRleHQ6IHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0IH0pO1xuICAgICAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5kZXRhY2gocHJldkluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pZ3hUZW1wbGF0ZU91dGxldCkge1xuICAgICAgICAgICAgdGhpcy5fdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMuaWd4VGVtcGxhdGVPdXRsZXQsIHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0KTtcbiAgICAgICAgICAgIHRoaXMudmlld0NyZWF0ZWQuZW1pdCh7IG93bmVyOiB0aGlzLCB2aWV3OiB0aGlzLl92aWV3UmVmLCBjb250ZXh0OiB0aGlzLmlneFRlbXBsYXRlT3V0bGV0Q29udGV4dCB9KTtcbiAgICAgICAgICAgIGNvbnN0IHRtcGxJZCA9IHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0Wyd0ZW1wbGF0ZUlEJ107XG4gICAgICAgICAgICBpZiAodG1wbElkKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgY29udGV4dCBjb250YWlucyBhIHRlbXBsYXRlIGlkLCBjaGVjayBpZiB3ZSBoYXZlIGEgdmlldyBmb3IgdGhhdCB0ZW1wbGF0ZSBhbHJlYWR5IHN0b3JlZCBpbiB0aGUgY2FjaGVcbiAgICAgICAgICAgICAgICAvLyBpZiBub3QgY3JlYXRlIGEgY29weSBhbmQgYWRkIGl0IHRvIHRoZSBjYWNoZSBpbiBkZXRhY2hlZCBzdGF0ZS5cbiAgICAgICAgICAgICAgICAvLyBOb3RlOiBWaWV3cyBpbiBkZXRhY2hlZCBzdGF0ZSBkbyBub3QgYXBwZWFyIGluIHRoZSBET00sIGhvd2V2ZXIgdGhleSByZW1haW4gc3RvcmVkIGluIG1lbW9yeS5cbiAgICAgICAgICAgICAgICBjb25zdCByZXNDb2xsZWN0aW9uID0gdGhpcy5fZW1iZWRkZWRWaWV3c01hcC5nZXQodGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHRbJ3RlbXBsYXRlSUQnXS50eXBlKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSByZXNDb2xsZWN0aW9uPy5nZXQodGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHRbJ3RlbXBsYXRlSUQnXS5pZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWRWaWV3c01hcC5zZXQodGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHRbJ3RlbXBsYXRlSUQnXS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE1hcChbW3RoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0Wyd0ZW1wbGF0ZUlEJ10uaWQsIHRoaXMuX3ZpZXdSZWZdXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX21vdmVWaWV3KCkge1xuICAgICAgICAvLyB1c2luZyBleHRlcm5hbCB2aWV3IGFuZCBpbnNlcnRpbmcgaXQgaW4gY3VycmVudCB2aWV3LlxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHRbJ21vdmVWaWV3J107XG4gICAgICAgIGNvbnN0IG93bmVyID0gdGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHRbJ293bmVyJ107XG4gICAgICAgIGlmICh2aWV3ICE9PSB0aGlzLl92aWV3UmVmKSB7XG4gICAgICAgICAgICBpZiAob3duZXIuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih2aWV3KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBkZXRhY2ggaW4gY2FzZSB2aWV3IGl0IGlzIGF0dGFjaGVkIHNvbWV3aGVyZSBlbHNlIGF0IHRoZSBtb21lbnQuXG4gICAgICAgICAgICAgICAgdGhpcy5iZWZvcmVWaWV3RGV0YWNoLmVtaXQoeyBvd25lcjogdGhpcywgdmlldzogdGhpcy5fdmlld1JlZiwgY29udGV4dDogdGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHQgfSk7XG4gICAgICAgICAgICAgICAgb3duZXIuX3ZpZXdDb250YWluZXJSZWYuZGV0YWNoKG93bmVyLl92aWV3Q29udGFpbmVyUmVmLmluZGV4T2YodmlldykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZpZXdSZWYgJiYgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5pbmRleE9mKHRoaXMuX3ZpZXdSZWYpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmVmb3JlVmlld0RldGFjaC5lbWl0KHsgb3duZXI6IHRoaXMsIHZpZXc6IHRoaXMuX3ZpZXdSZWYsIGNvbnRleHQ6IHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0IH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYuZGV0YWNoKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLl92aWV3UmVmKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92aWV3UmVmID0gdmlldztcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5zZXJ0KHZpZXcsIDApO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRXhpc3RpbmdDb250ZXh0KHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0KTtcbiAgICAgICAgICAgIHRoaXMudmlld01vdmVkLmVtaXQoeyBvd25lcjogdGhpcywgdmlldzogdGhpcy5fdmlld1JlZiwgY29udGV4dDogdGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHQgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVFeGlzdGluZ0NvbnRleHQodGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgX3VzZUNhY2hlZFZpZXcoKSB7XG4gICAgICAgIC8vIHVzZSB2aWV3IGZvciBzcGVjaWZpYyB0ZW1wbGF0ZSBjYWNoZWQgaW4gdGhlIGN1cnJlbnQgdGVtcGxhdGUgb3V0bGV0XG4gICAgICAgIGNvbnN0IHRtcGxJRCA9IHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0Wyd0ZW1wbGF0ZUlEJ107XG4gICAgICAgIGNvbnN0IGNhY2hlZFZpZXcgPSB0bXBsSUQgP1xuICAgICAgICAgICAgdGhpcy5fZW1iZWRkZWRWaWV3c01hcC5nZXQodG1wbElELnR5cGUpPy5nZXQodG1wbElELmlkKSA6XG4gICAgICAgICAgICBudWxsO1xuICAgICAgICAvLyBpZiB2aWV3IGV4aXN0cywgYnV0IHRlbXBsYXRlIGhhcyBiZWVuIGNoYW5nZWQgYW5kIHRoZXJlIGlzIGEgdmlldyBpbiB0aGUgY2FjaGUgd2l0aCB0aGUgcmVsYXRlZCB0ZW1wbGF0ZVxuICAgICAgICAvLyB0aGVuIGRldGFjaCBvbGQgdmlldyBhbmQgaW5zZXJ0IHRoZSBzdG9yZWQgb25lIHdpdGggdGhlIG1hdGNoaW5nIHRlbXBsYXRlXG4gICAgICAgIC8vIGFmdGVyIHRoYXQgdXBkYXRlIGl0cyBjb250ZXh0LlxuICAgICAgICBpZiAodGhpcy5fdmlld0NvbnRhaW5lclJlZi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZVZpZXdEZXRhY2guZW1pdCh7IG93bmVyOiB0aGlzLCB2aWV3OiB0aGlzLl92aWV3UmVmLCBjb250ZXh0OiB0aGlzLmlneFRlbXBsYXRlT3V0bGV0Q29udGV4dCB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYuZGV0YWNoKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLl92aWV3UmVmKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl92aWV3UmVmID0gY2FjaGVkVmlldztcbiAgICAgICAgY29uc3Qgb2xkQ29udGV4dCA9IHRoaXMuX2Nsb25lQ29udGV4dChjYWNoZWRWaWV3LmNvbnRleHQpO1xuICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmluc2VydCh0aGlzLl92aWV3UmVmLCAwKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRXhpc3RpbmdDb250ZXh0KHRoaXMuaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0KTtcbiAgICAgICAgdGhpcy5jYWNoZWRWaWV3TG9hZGVkLmVtaXQoeyBvd25lcjogdGhpcywgdmlldzogdGhpcy5fdmlld1JlZiwgY29udGV4dDogdGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHQsIG9sZENvbnRleHQgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2hvdWxkUmVjcmVhdGVWaWV3KGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgY3R4Q2hhbmdlID0gY2hhbmdlc1snaWd4VGVtcGxhdGVPdXRsZXRDb250ZXh0J107XG4gICAgICAgIHJldHVybiAhIWNoYW5nZXNbJ2lneFRlbXBsYXRlT3V0bGV0J10gfHwgKGN0eENoYW5nZSAmJiB0aGlzLl9oYXNDb250ZXh0U2hhcGVDaGFuZ2VkKGN0eENoYW5nZSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hhc0NvbnRleHRTaGFwZUNoYW5nZWQoY3R4Q2hhbmdlOiBTaW1wbGVDaGFuZ2UpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgcHJldkN0eEtleXMgPSBPYmplY3Qua2V5cyhjdHhDaGFuZ2UucHJldmlvdXNWYWx1ZSB8fCB7fSk7XG4gICAgICAgIGNvbnN0IGN1cnJDdHhLZXlzID0gT2JqZWN0LmtleXMoY3R4Q2hhbmdlLmN1cnJlbnRWYWx1ZSB8fCB7fSk7XG5cbiAgICAgICAgaWYgKHByZXZDdHhLZXlzLmxlbmd0aCA9PT0gY3VyckN0eEtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIGN1cnJDdHhLZXlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZDdHhLZXlzLmluZGV4T2YocHJvcE5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZUV4aXN0aW5nQ29udGV4dChjdHg6IGFueSk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIE9iamVjdC5rZXlzKGN0eCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdSZWYuY29udGV4dFtwcm9wTmFtZV0gPSB0aGlzLmlneFRlbXBsYXRlT3V0bGV0Q29udGV4dFtwcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbG9uZUNvbnRleHQoY3R4OiBhbnkpOiBhbnkge1xuICAgICAgICBjb25zdCBjbG9uZSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIE9iamVjdC5rZXlzKGN0eCkpIHtcbiAgICAgICAgICAgIGNsb25lW3Byb3BOYW1lXSA9IGN0eFtwcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldEFjdGlvblR5cGUoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBjb25zdCBtb3ZlZFZpZXcgPSB0aGlzLmlneFRlbXBsYXRlT3V0bGV0Q29udGV4dFsnbW92ZVZpZXcnXTtcbiAgICAgICAgY29uc3QgdG1wbElEID0gdGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHRbJ3RlbXBsYXRlSUQnXTtcbiAgICAgICAgY29uc3QgY2FjaGVkVmlldyA9IHRtcGxJRCA/XG4gICAgICAgICAgICB0aGlzLl9lbWJlZGRlZFZpZXdzTWFwLmdldCh0bXBsSUQudHlwZSk/LmdldCh0bXBsSUQuaWQpIDpcbiAgICAgICAgICAgIG51bGw7XG4gICAgICAgIGNvbnN0IHNob3VsZFJlY3JlYXRlID0gdGhpcy5fc2hvdWxkUmVjcmVhdGVWaWV3KGNoYW5nZXMpO1xuICAgICAgICBpZiAobW92ZWRWaWV3KSB7XG4gICAgICAgICAgICAvLyB2aWV3IGlzIG1vdmVkIGZyb20gZXh0ZXJuYWwgc291cmNlXG4gICAgICAgICAgICByZXR1cm4gVGVtcGxhdGVPdXRsZXRBY3Rpb24uTW92ZVZpZXc7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hvdWxkUmVjcmVhdGUgJiYgY2FjaGVkVmlldykge1xuICAgICAgICAgICAgLy8gc2hvdWxkIHJlY3JlYXRlICh0ZW1wbGF0ZSBvciBjb250ZXh0IGNoYW5nZSkgYW5kIHRoZXJlIGlzIGEgbWF0Y2hpbmcgdGVtcGxhdGUgaW4gY2FjaGVcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZU91dGxldEFjdGlvbi5Vc2VDYWNoZWRWaWV3O1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl92aWV3UmVmIHx8IHNob3VsZFJlY3JlYXRlKSB7XG4gICAgICAgICAgICAvLyBubyB2aWV3IG9yIHNob3VsZCByZWNyZWF0ZVxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlT3V0bGV0QWN0aW9uLkNyZWF0ZVZpZXc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pZ3hUZW1wbGF0ZU91dGxldENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIGhhcyBjb250ZXh0LCB1cGRhdGUgY29udGV4dFxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlT3V0bGV0QWN0aW9uLlVwZGF0ZVZpZXdDb250ZXh0O1xuICAgICAgICB9XG4gICAgfVxufVxuZW51bSBUZW1wbGF0ZU91dGxldEFjdGlvbiB7XG4gICAgQ3JlYXRlVmlldyxcbiAgICBNb3ZlVmlldyxcbiAgICBVc2VDYWNoZWRWaWV3LFxuICAgIFVwZGF0ZVZpZXdDb250ZXh0XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZpZXdDaGFuZ2VFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncyB7XG4gICAgb3duZXI6IElneFRlbXBsYXRlT3V0bGV0RGlyZWN0aXZlO1xuICAgIHZpZXc6IEVtYmVkZGVkVmlld1JlZjxhbnk+O1xuICAgIGNvbnRleHQ6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQ2FjaGVkVmlld0xvYWRlZEV2ZW50QXJncyBleHRlbmRzIElWaWV3Q2hhbmdlRXZlbnRBcmdzIHtcbiAgICBvbGRDb250ZXh0OiBhbnk7XG59XG5cbi8qKlxuICogQGhpZGRlblxuICovXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0lneFRlbXBsYXRlT3V0bGV0RGlyZWN0aXZlXSxcbiAgICBleHBvcnRzOiBbSWd4VGVtcGxhdGVPdXRsZXREaXJlY3RpdmVdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIElneFRlbXBsYXRlT3V0bGV0TW9kdWxlIHtcbn1cbiJdfQ==