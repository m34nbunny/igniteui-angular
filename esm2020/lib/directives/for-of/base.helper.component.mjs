import { HostListener, Directive, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { resizeObservable } from '../../core/utils';
import * as i0 from "@angular/core";
import * as i1 from "../../core/utils";
export class VirtualHelperBaseDirective {
    constructor(elementRef, cdr, _zone, document, platformUtil) {
        this.elementRef = elementRef;
        this.cdr = cdr;
        this._zone = _zone;
        this.document = document;
        this.platformUtil = platformUtil;
        this.scrollAmount = 0;
        this._size = 0;
        this.destroy$ = new Subject();
        this._afterViewInit = false;
        this._detached = false;
        this._scrollNativeSize = this.calculateScrollNativeSize();
    }
    onScroll(event) {
        this.scrollAmount = event.target.scrollTop || event.target.scrollLeft;
    }
    ngAfterViewInit() {
        this._afterViewInit = true;
        if (!this.platformUtil.isBrowser) {
            return;
        }
        const delayTime = 0;
        this._zone.runOutsideAngular(() => {
            resizeObservable(this.nativeElement).pipe(throttleTime(delayTime), takeUntil(this.destroy$)).subscribe((event) => this.handleMutations(event));
        });
    }
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    ngOnDestroy() {
        this.destroyed = true;
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    calculateScrollNativeSize() {
        const div = this.document.createElement('div');
        const style = div.style;
        style.width = '100px';
        style.height = '100px';
        style.position = 'absolute';
        style.top = '-10000px';
        style.top = '-10000px';
        style.overflow = 'scroll';
        this.document.body.appendChild(div);
        const scrollWidth = div.offsetWidth - div.clientWidth;
        this.document.body.removeChild(div);
        return scrollWidth ? scrollWidth + 1 : 1;
    }
    set size(value) {
        if (this.destroyed) {
            return;
        }
        this._size = value;
        if (this._afterViewInit) {
            this.cdr.detectChanges();
        }
    }
    get size() {
        return this._size;
    }
    get scrollNativeSize() {
        return this._scrollNativeSize;
    }
    get isAttachedToDom() {
        return this.document.body.contains(this.nativeElement);
    }
    handleMutations(event) {
        const hasSize = !(event[0].contentRect.height === 0 && event[0].contentRect.width === 0);
        if (!hasSize && !this.isAttachedToDom) {
            // scroll bar detached from DOM
            this._detached = true;
        }
        else if (this._detached && hasSize && this.isAttachedToDom) {
            // attached back now.
            this.restoreScroll();
        }
    }
    restoreScroll() { }
}
VirtualHelperBaseDirective.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: VirtualHelperBaseDirective, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i1.PlatformUtil }], target: i0.????FactoryTarget.Directive });
VirtualHelperBaseDirective.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: VirtualHelperBaseDirective, selector: "[igxVirtualHelperBase]", host: { listeners: { "scroll": "onScroll($event)" } }, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: VirtualHelperBaseDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxVirtualHelperBase]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PlatformUtil }]; }, propDecorators: { onScroll: [{
                type: HostListener,
                args: ['scroll', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5oZWxwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL2RpcmVjdGl2ZXMvZm9yLW9mL2Jhc2UuaGVscGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsWUFBWSxFQUlaLFNBQVMsRUFFVCxNQUFNLEVBRVQsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQWdCLE1BQU0sa0JBQWtCLENBQUM7OztBQUtsRSxNQUFNLE9BQU8sMEJBQTBCO0lBV25DLFlBQ1csVUFBbUMsRUFDbkMsR0FBc0IsRUFDbkIsS0FBYSxFQUNFLFFBQWEsRUFDNUIsWUFBMEI7UUFKN0IsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDbkMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDbkIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNFLGFBQVEsR0FBUixRQUFRLENBQUs7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFmakMsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUdQLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBRWhDLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFTdEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQzlELENBQUM7SUFHTSxRQUFRLENBQUMsS0FBSztRQUNqQixJQUFJLENBQUMs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QVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ25DLCtCQUErQjtZQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN6QjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUMxRCxxQkFBcUI7WUFDckIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQztJQUVTLGFBQWEsS0FBSSxDQUFDOzt1SEFsR25CLDBCQUEwQixtR0FldkIsUUFBUTsyR0FmWCwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFIdEMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsd0JBQXdCO2lCQUNyQzs7MEJBZ0JRLE1BQU07MkJBQUMsUUFBUTt1RUFPYixRQUFRO3NCQURkLFlBQVk7dUJBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBIb3N0TGlzdGVuZXIsXG4gICAgRWxlbWVudFJlZixcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBPbkRlc3Ryb3ksXG4gICAgRGlyZWN0aXZlLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgSW5qZWN0LFxuICAgIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgdGhyb3R0bGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgcmVzaXplT2JzZXJ2YWJsZSwgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneFZpcnR1YWxIZWxwZXJCYXNlXSdcbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbEhlbHBlckJhc2VEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICAgIHB1YmxpYyBzY3JvbGxBbW91bnQgPSAwO1xuICAgIHB1YmxpYyBfc2l6ZSA9IDA7XG4gICAgcHVibGljIGRlc3Ryb3llZDtcblxuICAgIHByb3RlY3RlZCBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIHByaXZhdGUgX2FmdGVyVmlld0luaXQgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9zY3JvbGxOYXRpdmVTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfZGV0YWNoZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcm90ZWN0ZWQgX3pvbmU6IE5nWm9uZSxcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHVibGljIGRvY3VtZW50OiBhbnksXG4gICAgICAgIHByb3RlY3RlZCBwbGF0Zm9ybVV0aWw6IFBsYXRmb3JtVXRpbCxcbiAgICApIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsTmF0aXZlU2l6ZSA9IHRoaXMuY2FsY3VsYXRlU2Nyb2xsTmF0aXZlU2l6ZSgpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3Njcm9sbCcsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uU2Nyb2xsKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQW1vdW50ID0gZXZlbnQudGFyZ2V0LnNjcm9sbFRvcCB8fCBldmVudC50YXJnZXQuc2Nyb2xsTGVmdDtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuX2FmdGVyVmlld0luaXQgPSB0cnVlO1xuICAgICAgICBpZiAoIXRoaXMucGxhdGZvcm1VdGlsLmlzQnJvd3Nlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbGF5VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgcmVzaXplT2JzZXJ2YWJsZSh0aGlzLm5hdGl2ZUVsZW1lbnQpLnBpcGUoXG4gICAgICAgICAgICAgICAgdGhyb3R0bGVUaW1lKGRlbGF5VGltZSksXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKGV2ZW50KSA9PiB0aGlzLmhhbmRsZU11dGF0aW9ucyhldmVudCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG5hdGl2ZUVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNhbGN1bGF0ZVNjcm9sbE5hdGl2ZVNpemUoKSB7XG4gICAgICAgIGNvbnN0IGRpdiA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZGl2LnN0eWxlO1xuICAgICAgICBzdHlsZS53aWR0aCA9ICcxMDBweCc7XG4gICAgICAgIHN0eWxlLmhlaWdodCA9ICcxMDBweCc7XG4gICAgICAgIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgc3R5bGUudG9wID0gJy0xMDAwMHB4JztcbiAgICAgICAgc3R5bGUudG9wID0gJy0xMDAwMHB4JztcbiAgICAgICAgc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIGNvbnN0IHNjcm9sbFdpZHRoID0gZGl2Lm9mZnNldFdpZHRoIC0gZGl2LmNsaWVudFdpZHRoO1xuICAgICAgICB0aGlzLmRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICAgICAgcmV0dXJuIHNjcm9sbFdpZHRoID8gc2Nyb2xsV2lkdGggKyAxIDogMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNpemUodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2l6ZSA9IHZhbHVlO1xuICAgICAgICBpZiAodGhpcy5fYWZ0ZXJWaWV3SW5pdCkge1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHNjcm9sbE5hdGl2ZVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxOYXRpdmVTaXplO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgaXNBdHRhY2hlZFRvRG9tKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhbmRsZU11dGF0aW9ucyhldmVudCkge1xuICAgICAgICBjb25zdCBoYXNTaXplID0gIShldmVudFswXS5jb250ZW50UmVjdC5oZWlnaHQgPT09IDAgJiYgZXZlbnRbMF0uY29udGVudFJlY3Qud2lkdGggPT09IDApO1xuICAgICAgICBpZiAoIWhhc1NpemUgJiYgIXRoaXMuaXNBdHRhY2hlZFRvRG9tKSB7XG4gICAgICAgICAgICAvLyBzY3JvbGwgYmFyIGRldGFjaGVkIGZyb20gRE9NXG4gICAgICAgICAgICB0aGlzLl9kZXRhY2hlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZGV0YWNoZWQgJiYgaGFzU2l6ZSAmJiB0aGlzLmlzQXR0YWNoZWRUb0RvbSkge1xuICAgICAgICAgICAgLy8gYXR0YWNoZWQgYmFjayBub3cuXG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVTY3JvbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXN0b3JlU2Nyb2xsKCkge31cbn1cbiJdfQ==