import { Directive, Inject, Input, Output, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, fromEvent, animationFrameScheduler, interval } from 'rxjs';
import { map, switchMap, takeUntil, throttle } from 'rxjs/operators';
import * as i0 from "@angular/core";
/**
 * @hidden
 * @internal
 */
export class IgxColumnResizerDirective {
    constructor(element, document, zone) {
        this.element = element;
        this.document = document;
        this.zone = zone;
        this.restrictHResizeMin = Number.MIN_SAFE_INTEGER;
        this.restrictHResizeMax = Number.MAX_SAFE_INTEGER;
        this.resizeEnd = new Subject();
        this.resizeStart = new Subject();
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.resize = new Subject();
        this._destroy = new Subject();
        this.resizeStart.pipe(takeUntil(this._destroy), map((event) => event.clientX), switchMap((offset) => this.resize
            .pipe(takeUntil(this._destroy), takeUntil(this.resizeEnd), map((event) => event.clientX - offset))))
            .subscribe((pos) => {
            const left = this._left + pos;
            const min = this._left - this.restrictHResizeMin;
            const max = this._left + this.restrictHResizeMax;
            this.left = left < min ? min : left;
            if (left > max) {
                this.left = max;
            }
        });
    }
    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.document.defaultView, 'mousemove')
                .pipe(takeUntil(this._destroy), throttle(() => interval(0, animationFrameScheduler)))
                .subscribe((res) => this.onMousemove(res));
            fromEvent(this.document.defaultView, 'mouseup')
                .pipe(takeUntil(this._destroy))
                .subscribe((res) => this.onMouseup(res));
        });
    }
    ngOnDestroy() {
        this._destroy.next(true);
        this._destroy.complete();
    }
    set left(val) {
        requestAnimationFrame(() => this.element.nativeElement.style.left = val + 'px');
    }
    set top(val) {
        if (this.restrictResizerTop != undefined) {
            requestAnimationFrame(() => this.element.nativeElement.style.top = this.restrictResizerTop + 'px');
        }
        else {
            requestAnimationFrame(() => this.element.nativeElement.style.top = val + 'px');
        }
    }
    onMouseup(event) {
        this.resizeEnd.next(event);
        this.resizeEnd.complete();
    }
    onMousedown(event) {
        event.preventDefault();
        const parent = this.element.nativeElement.parentElement.parentElement;
        this.left = this._left = event.clientX - parent.getBoundingClientRect().left;
        this.top = event.target.getBoundingClientRect().top - parent.getBoundingClientRect().top;
        this.resizeStart.next(event);
    }
    onMousemove(event) {
        event.preventDefault();
        this.resize.next(event);
    }
}
IgxColumnResizerDirective.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnResizerDirective, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }, { token: i0.NgZone }], target: i0.????FactoryTarget.Directive });
IgxColumnResizerDirective.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxColumnResizerDirective, selector: "[igxResizer]", inputs: { restrictHResizeMin: "restrictHResizeMin", restrictHResizeMax: "restrictHResizeMax", restrictResizerTop: "restrictResizerTop" }, outputs: { resizeEnd: "resizeEnd", resizeStart: "resizeStart", resize: "resize" }, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxColumnResizerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxResizer]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }]; }, propDecorators: { restrictHResizeMin: [{
                type: Input
            }], restrictHResizeMax: [{
                type: Input
            }], restrictResizerTop: [{
                type: Input
            }], resizeEnd: [{
                type: Output
            }], resizeStart: [{
                type: Output
            }], resize: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZ3JpZHMvcmVzaXppbmcvcmVzaXplci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFFVCxNQUFNLEVBQ04sS0FBSyxFQUVMLE1BQU0sR0FHVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdFLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFckU7OztHQUdHO0FBSUgsTUFBTSxPQUFPLHlCQUF5QjtJQXVCbEMsWUFDVyxPQUFnQyxFQUNkLFFBQVEsRUFDMUIsSUFBWTtRQUZaLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBQTtRQUMxQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBdkJoQix1QkFBa0IsR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFHckQsdUJBQWtCLEdBQVcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBTXJELGNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBYyxDQUFDO1FBR3RDLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQWMsQ0FBQztRQUUvQyw0REFBNEQ7UUFDM0MsV0FBTSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFHckMsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFRdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ2pCLFNBQVMsQ0FBYSxJQUFJLENBQUMsUUFBUSxDQUFD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dEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgRGlyZWN0aXZlLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nWm9uZSxcbiAgICBPdXRwdXQsXG4gICAgT25Jbml0LFxuICAgIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTdWJqZWN0LCBmcm9tRXZlbnQsIGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCwgdGhyb3R0bGUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogQGhpZGRlblxuICogQGludGVybmFsXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2lneFJlc2l6ZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hDb2x1bW5SZXNpemVyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcmVzdHJpY3RIUmVzaXplTWluOiBudW1iZXIgPSBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJlc3RyaWN0SFJlc2l6ZU1heDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZXN0cmljdFJlc2l6ZXJUb3A6IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByZXNpemVFbmQgPSBuZXcgU3ViamVjdDxNb3VzZUV2ZW50PigpO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHJlc2l6ZVN0YXJ0ID0gbmV3IFN1YmplY3Q8TW91c2VFdmVudD4oKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8tb3V0cHV0LW5hdGl2ZVxuICAgIEBPdXRwdXQoKSBwdWJsaWMgcmVzaXplID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgcHJpdmF0ZSBfbGVmdDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHVibGljIGRvY3VtZW50LFxuICAgICAgICBwdWJsaWMgem9uZTogTmdab25lXG4gICAgKSB7XG5cbiAgICAgICAgdGhpcy5yZXNpemVTdGFydC5waXBlKFxuICAgICAgICAgICAgdGFrZVVudGlsPE1vdXNlRXZlbnQ+KHRoaXMuX2Rlc3Ryb3kpLFxuICAgICAgICAgICAgbWFwKChldmVudCkgPT4gZXZlbnQuY2xpZW50WCksXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKG9mZnNldCkgPT4gdGhpcy5yZXNpemVcbiAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpLFxuICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWw8TW91c2VFdmVudD4odGhpcy5yZXNpemVFbmQpLFxuICAgICAgICAgICAgICAgICAgICBtYXAoKGV2ZW50KSA9PiBldmVudC5jbGllbnRYIC0gb2Zmc2V0KSxcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChwb3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5fbGVmdCArIHBvcztcbiAgICAgICAgICAgICAgICBjb25zdCBtaW4gPSB0aGlzLl9sZWZ0IC0gdGhpcy5yZXN0cmljdEhSZXNpemVNaW47XG4gICAgICAgICAgICAgICAgY29uc3QgbWF4ID0gdGhpcy5fbGVmdCArIHRoaXMucmVzdHJpY3RIUmVzaXplTWF4O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdCA8IG1pbiA/IG1pbiA6IGxlZnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAobGVmdCA+IG1heCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnQgPSBtYXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldywgJ21vdXNlbW92ZScpXG4gICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbDxNb3VzZUV2ZW50Pih0aGlzLl9kZXN0cm95KSxcbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGUoKCkgPT4gaW50ZXJ2YWwoMCwgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgocmVzKSA9PiB0aGlzLm9uTW91c2Vtb3ZlKHJlcykpO1xuXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldywgJ21vdXNldXAnKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbDxNb3VzZUV2ZW50Pih0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHRoaXMub25Nb3VzZXVwKHJlcykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCh0cnVlKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgbGVmdCh2YWw6IG51bWJlcikge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IHZhbCArICdweCcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgdG9wKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3RyaWN0UmVzaXplclRvcCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSB0aGlzLnJlc3RyaWN0UmVzaXplclRvcCArICdweCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IHZhbCArICdweCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uTW91c2V1cChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLnJlc2l6ZUVuZC5uZXh0KGV2ZW50KTtcbiAgICAgICAgdGhpcy5yZXNpemVFbmQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgIHRoaXMubGVmdCA9IHRoaXMuX2xlZnQgPSBldmVudC5jbGllbnRYIC0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgICAgIHRoaXMudG9wID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcblxuICAgICAgICB0aGlzLnJlc2l6ZVN0YXJ0Lm5leHQoZXZlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1vdXNlbW92ZShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnJlc2l6ZS5uZXh0KGV2ZW50KTtcbiAgICB9XG59XG4iXX0=