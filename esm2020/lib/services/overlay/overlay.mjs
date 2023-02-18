import { DOCUMENT } from '@angular/common';
import { ElementRef, EventEmitter, Inject, Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { fadeIn, fadeOut, scaleInHorLeft, scaleInHorRight, scaleInVerBottom, scaleInVerTop, scaleOutHorLeft, scaleOutHorRight, scaleOutVerBottom, scaleOutVerTop, slideInBottom, slideInTop, slideOutBottom, slideOutTop } from '../../animations/main';
import { AutoPositionStrategy } from './position/auto-position-strategy';
import { ConnectedPositioningStrategy } from './position/connected-positioning-strategy';
import { ContainerPositionStrategy } from './position/container-position-strategy';
import { ElasticPositionStrategy } from './position/elastic-position-strategy';
import { GlobalPositionStrategy } from './position/global-position-strategy';
import { NoOpScrollStrategy } from './scroll/NoOpScrollStrategy';
import { AbsolutePosition, HorizontalAlignment, RelativePosition, RelativePositionStrategy, VerticalAlignment } from './utilities';
import * as i0 from "@angular/core";
import * as i1 from "@angular/animations";
import * as i2 from "../../core/utils";
/**
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/overlay-main)
 * The overlay service allows users to show components on overlay div above all other elements in the page.
 */
export class IgxOverlayService {
    constructor(_factoryResolver, _appRef, _injector, builder, document, _zone, platformUtil) {
        this._factoryResolver = _factoryResolver;
        this._appRef = _appRef;
        this._injector = _injector;
        this.builder = builder;
        this.document = document;
        this._zone = _zone;
        this.platformUtil = platformUtil;
        /**
         * Emitted just before the overlay content starts to open.
         * ```typescript
         * opening(event: OverlayCancelableEventArgs){
         *     const opening = event;
         * }
         * ```
         */
        this.opening = new EventEmitter();
        /**
         * Emitted after the overlay content is opened and all animations are finished.
         * ```typescript
         * opened(event: OverlayEventArgs){
         *     const opened = event;
         * }
         * ```
         */
        this.opened = new EventEmitter();
        /**
         * Emitted just before the overlay content starts to close.
         * ```typescript
         * closing(event: OverlayCancelableEventArgs){
         *     const closing = event;
         * }
         * ```
         */
        this.closing = new EventEmitter();
        /**
         * Emitted after the overlay content is closed and all animations are finished.
         * ```typescript
         * closed(event: OverlayEventArgs){
         *     const closed = event;
         * }
         * ```
         */
        this.closed = new EventEmitter();
        /**
         * Emitted after the content is appended to the overlay, and before animations are started.
         * ```typescript
         * contentAppended(event: OverlayEventArgs){
         *     const contentAppended = event;
         * }
         * ```
         */
        this.contentAppended = new EventEmitter();
        /**
         * Emitted just before the overlay animation start.
         * ```typescript
         * animationStarting(event: OverlayAnimationEventArgs){
         *     const animationStarting = event;
         * }
         * ```
         */
        this.animationStarting = new EventEmitter();
        this._componentId = 0;
        this._overlayInfos = [];
        this.destroy$ = new Subject();
        this._cursorStyleIsSet = false;
        this._defaultSettings = {
            excludeFromOutsideClick: [],
            positionStrategy: new GlobalPositionStrategy(),
            scrollStrategy: new NoOpScrollStrategy(),
            modal: true,
            closeOnOutsideClick: true,
            closeOnEscape: false
        };
        /** @hidden */
        this.repositionAll = () => {
            for (let i = this._overlayInfos.length; i--;) {
                this.reposition(this._overlayInfos[i].id);
            }
        };
        this.documentClicked = (ev) => {
            //  if we get to modal overlay just return - we should not close anything under it
            //  if we get to non-modal overlay do the next:
            //   1. Check it has close on outside click. If not go on to next overlay;
            //   2. If true check if click is on the element. If it is on the element we have closed
            //  already all previous non-modal with close on outside click elements, so we return. If
            //  not close the overlay and check next
            for (let i = this._overlayInfos.length; i--;) {
                const info = this._overlayInfos[i];
                if (info.settings.modal) {
                    return;
                }
                if (info.settings.closeOnOutsideClick) {
                    const target = ev.composed ? ev.composedPath()[0] : ev.target;
                    const overlayElement = info.elementRef.nativeElement;
                    // check if the click is on the overlay element or on an element from the exclusion list, and if so do not close the overlay
                    const excludeElements = info.settings.excludeFromOutsideClick ?
                        [...info.settings.excludeFromOutsideClick, overlayElement] : [overlayElement];
                    const isInsideClick = excludeElements.some(e => e.contains(target));
                    if (isInsideClick) {
                        return;
                        //  if the click is outside click, but close animation has started do nothing
                    }
                    else if (!(info.closeAnimationPlayer && info.closeAnimationPlayer.hasStarted())) {
                        this._hide(info.id, ev);
                    }
                }
            }
        };
        this._document = this.document;
    }
    /**
     * Creates overlay settings with global or container position strategy and preset position settings
     *
     * @param position Preset position settings. Default position is 'center'
     * @param outlet The outlet container to attach the overlay to
     * @returns Non-modal overlay settings based on Global or Container position strategy and the provided position.
     */
    static createAbsoluteOverlaySettings(position, outlet) {
        const positionSettings = this.createAbsolutePositionSettings(position);
        const strategy = outlet ? new ContainerPositionStrategy(positionSettings) : new GlobalPositionStrategy(positionSettings);
        const overlaySettings = {
            positionStrategy: strategy,
            scrollStrategy: new NoOpScrollStrategy(),
            modal: false,
            closeOnOutsideClick: true,
            outlet
        };
        return overlaySettings;
    }
    /**
     * Creates overlay settings with auto, connected or elastic position strategy and preset position settings
     *
     * @param target Attaching target for the component to show
     * @param strategy The relative position strategy to be applied to the overlay settings. Default is Auto positioning strategy.
     * @param position Preset position settings. By default the element is positioned below the target, left aligned.
     * @returns Non-modal overlay settings based on the provided target, strategy and position.
     */
    static createRelativeOverlaySettings(target, position, strategy) {
        const positionSettings = this.createRelativePositionSettings(position);
        const overlaySettings = {
            target,
            positionStrategy: this.createPositionStrategy(strategy, positionSettings),
            scrollStrategy: new NoOpScrollStrategy(),
            modal: false,
            closeOnOutsideClick: true
        };
        return overlaySettings;
    }
    static createAbsolutePositionSettings(position) {
        let positionSettings;
        switch (position) {
            case AbsolutePosition.Bottom:
                positionSettings = {
                    horizontalDirection: HorizontalAlignment.Center,
                    verticalDirection: VerticalAlignment.Bottom,
                    openAnimation: slideInBottom,
                    closeAnimation: slideOutBottom
                };
                break;
            case AbsolutePosition.Top:
                positionSettings = {
                    horizontalDirection: HorizontalAlignment.Center,
                    verticalDirection: VerticalAlignment.Top,
                    openAnimation: slideInTop,
                    closeAnimation: slideOutTop
                };
                break;
            case AbsolutePosition.Center:
            default:
                positionSettings = {
                    horizontalDirection: HorizontalAlignment.Center,
                    verticalDirection: VerticalAlignment.Middle,
                    openAnimation: fadeIn,
                    closeAnimation: fadeOut
                };
        }
        return positionSettings;
    }
    static createRelativePositionSettings(position) {
        let positionSettings;
        switch (position) {
            case RelativePosition.Above:
                positionSettings = {
                    horizontalStartPoint: HorizontalAlignment.Center,
                    verticalStartPoint: VerticalAlignment.Top,
                    horizontalDirection: HorizontalAlignment.Center,
                    verticalDirection: VerticalAlignment.Top,
                    openAnimation: scaleInVerBottom,
                    closeAnimation: scaleOutVerBottom,
                };
                break;
            case RelativePosition.Below:
                positionSettings = {
                    horizontalStartPoint: HorizontalAlignment.Center,
                    verticalStartPoint: VerticalAlignment.Bottom,
                    horizontalDirection: HorizontalAlignment.Center,
                    verticalDirection: VerticalAlignment.Bottom,
                    openAnimation: scaleInVerTop,
                    closeAnimation: scaleOutVerTop
                };
                break;
            case RelativePosition.After:
                positionSettings = {
                    horizontalStartPoint: HorizontalAlignment.Right,
                    verticalStartPoint: VerticalAlignment.Middle,
                    horizontalDirection: HorizontalAlignment.Right,
                    verticalDirection: VerticalAlignment.Middle,
                    openAnimation: scaleInHorLeft,
                    closeAnimation: scaleOutHorLeft
                };
                break;
            case RelativePosition.Before:
                positionSettings = {
                    horizontalStartPoint: HorizontalAlignment.Left,
                    verticalStartPoint: VerticalAlignment.Middle,
                    horizontalDirection: HorizontalAlignment.Left,
                    verticalDirection: VerticalAlignment.Middle,
                    openAnimation: scaleInHorRight,
                    closeAnimation: scaleOutHorRight
                };
                break;
            case RelativePosition.Default:
            default:
                positionSettings = {
                    horizontalStartPoint: HorizontalAlignment.Left,
                    verticalStartPoint: VerticalAlignment.Bottom,
                    horizontalDirection: HorizontalAlignment.Right,
                    verticalDirection: VerticalAlignment.Bottom,
                    openAnimation: scaleInVerTop,
                    closeAnimation: scaleOutVerTop,
                };
                break;
        }
        return positionSettings;
    }
    static createPositionStrategy(strategy, positionSettings) {
        switch (strategy) {
            case RelativePositionStrategy.Connected:
                return new ConnectedPositioningStrategy(positionSettings);
            case RelativePositionStrategy.Elastic:
                return new ElasticPositionStrategy(positionSettings);
            case RelativePositionStrategy.Auto:
            default:
                return new AutoPositionStrategy(positionSettings);
        }
    }
    attach(component, settings, moduleRef) {
        const info = this.getOverlayInfo(component, moduleRef);
        if (!info) {
            console.warn('Overlay was not able to attach provided component!');
            return null;
        }
        info.id = (this._componentId++).toString();
        info.visible = false;
        settings = Object.assign({}, this._defaultSettings, settings);
        info.settings = settings;
        this._overlayInfos.push(info);
        info.hook = this.placeElementHook(info.elementRef.nativeElement);
        const elementRect = info.elementRef.nativeElement.getBoundingClientRect();
        info.initialSize = { width: elementRect.width, height: elementRect.height };
        this.moveElementToOverlay(info);
        this.contentAppended.emit({ id: info.id, componentRef: info.componentRef });
        // TODO: why we had this check?
        // if (this._overlayInfos.indexOf(info) === -1) {
        //     this._overlayInfos.push(info);
        // }
        info.settings.scrollStrategy.initialize(this._document, this, info.id);
        info.settings.scrollStrategy.attach();
        this.addOutsideClickListener(info);
        this.addResizeHandler();
        this.addCloseOnEscapeListener(info);
        this.buildAnimationPlayers(info);
        return info.id;
    }
    /**
     * Remove overlay with the provided id.
     *
     * @param id Id of the overlay to remove
     * ```typescript
     * this.overlay.detach(id);
     * ```
     */
    detach(id) {
        const info = this.getOverlayById(id);
        if (!info) {
            console.warn('igxOverlay.detach was called with wrong id: ', id);
            return;
        }
        info.detached = true;
        this.finishAnimations(info);
        info.settings.scrollStrategy.detach();
        this.removeOutsideClickListener(info);
        this.removeResizeHandler();
        this.cleanUp(info);
    }
    /**
     * Remove all the overlays.
     * ```typescript
     * this.overlay.detachAll();
     * ```
     */
    detachAll() {
        for (let i = this._overlayInfos.length; i--;) {
            this.detach(this._overlayInfos[i].id);
        }
    }
    /**
     * Shows the overlay for provided id.
     *
     * @param id Id to show overlay for
     * @param settings Display settings for the overlay, such as positioning and scroll/close behavior.
     */
    show(id, settings) {
        const info = this.getOverlayById(id);
        if (!info) {
            console.warn('igxOverlay.show was called with wrong id: ', id);
            return;
        }
        const eventArgs = { id, componentRef: info.componentRef, cancel: false };
        this.opening.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (settings) {
            // TODO: update attach
        }
        this.updateSize(info);
        info.settings.positionStrategy.position(info.elementRef.nativeElement.parentElement, { width: info.initialSize.width, height: info.initialSize.height }, document, true, info.settings.target);
        this.addModalClasses(info);
        if (info.settings.positionStrategy.settings.openAnimation) {
            this.playOpenAnimation(info);
        }
        else {
            //  to eliminate flickering show the element just before opened fires
            info.wrapperElement.style.visibility = '';
            info.visible = true;
            this.opened.emit({ id: info.id, componentRef: info.componentRef });
        }
    }
    /**
     * Hides the component with the ID provided as a parameter.
     * ```typescript
     * this.overlay.hide(id);
     * ```
     */
    hide(id, event) {
        this._hide(id, event);
    }
    /**
     * Hides all the components and the overlay.
     * ```typescript
     * this.overlay.hideAll();
     * ```
     */
    hideAll() {
        for (let i = this._overlayInfos.length; i--;) {
            this.hide(this._overlayInfos[i].id);
        }
    }
    /**
     * Repositions the component with ID provided as a parameter.
     *
     * @param id Id to reposition overlay for
     * ```typescript
     * this.overlay.reposition(id);
     * ```
     */
    reposition(id) {
        const overlayInfo = this.getOverlayById(id);
        if (!overlayInfo || !overlayInfo.settings) {
            console.error('Wrong id provided in overlay.reposition method. Id: ' + id);
            return;
        }
        if (!overlayInfo.visible) {
            return;
        }
        const contentElement = overlayInfo.elementRef.nativeElement.parentElement;
        const contentElementRect = contentElement.getBoundingClientRect();
        overlayInfo.settings.positionStrategy.position(contentElement, {
            width: contentElementRect.width,
            height: contentElementRect.height
        }, this._document, false, overlayInfo.settings.target);
    }
    /**
     * Offsets the content along the corresponding axis by the provided amount
     *
     * @param id Id to offset overlay for
     * @param deltaX Amount of offset in horizontal direction
     * @param deltaY Amount of offset in vertical direction
     * ```typescript
     * this.overlay.setOffset(id, deltaX, deltaY);
     * ```
     */
    setOffset(id, deltaX, deltaY) {
        const info = this.getOverlayById(id);
        if (!info) {
            return;
        }
        info.transformX += deltaX;
        info.transformY += deltaY;
        const transformX = info.transformX;
        const transformY = info.transformY;
        const translate = `translate(${transformX}px, ${transformY}px)`;
        info.elementRef.nativeElement.parentElement.style.transform = translate;
    }
    /** @hidden */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /** @hidden @internal */
    getOverlayById(id) {
        if (!id) {
            return null;
        }
        const info = this._overlayInfos.find(e => e.id === id);
        return info;
    }
    _hide(id, event) {
        const info = this.getOverlayById(id);
        if (!info) {
            console.warn('igxOverlay.hide was called with wrong id: ', id);
            return;
        }
        const eventArgs = { id, componentRef: info.componentRef, cancel: false, event };
        this.closing.emit(eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.removeModalClasses(info);
        if (info.settings.positionStrategy.settings.closeAnimation) {
            this.playCloseAnimation(info, event);
        }
        else {
            this.closeDone(info);
        }
    }
    getOverlayInfo(component, moduleRef) {
        const info = { ngZone: this._zone, transformX: 0, transformY: 0 };
        if (component instanceof ElementRef) {
            info.elementRef = component;
        }
        else {
            let dynamicFactory;
            const factoryResolver = moduleRef ? moduleRef.componentFactoryResolver : this._factoryResolver;
            try {
                dynamicFactory = factoryResolver.resolveComponentFactory(component);
            }
            catch (error) {
                console.error(error);
                return null;
            }
            const injector = moduleRef ? moduleRef.injector : this._injector;
            const dynamicComponent = dynamicFactory.create(injector);
            if (dynamicComponent.onDestroy) {
                dynamicComponent.onDestroy(() => {
                    if (!info.detached && this._overlayInfos.indexOf(info) !== -1) {
                        this.detach(info.id);
                    }
                });
            }
            this._appRef.attachView(dynamicComponent.hostView);
            // If the element is newly created from a Component, it is wrapped in 'ng-component' tag - we do not want that.
            const element = dynamicComponent.location.nativeElement;
            info.elementRef = { nativeElement: element };
            info.componentRef = dynamicComponent;
        }
        return info;
    }
    placeElementHook(element) {
        if (!element.parentElement) {
            return null;
        }
        const hook = this._document.createElement('div');
        hook.style.display = 'none';
        element.parentElement.insertBefore(hook, element);
        return hook;
    }
    moveElementToOverlay(info) {
        info.wrapperElement = this.getWrapperElement();
        const contentElement = this.getContentElement(info.wrapperElement, info.settings.modal);
        this.getOverlayElement(info).appendChild(info.wrapperElement);
        contentElement.appendChild(info.elementRef.nativeElement);
    }
    getWrapperElement() {
        const wrapper = this._document.createElement('div');
        wrapper.classList.add('igx-overlay__wrapper');
        return wrapper;
    }
    getContentElement(wrapperElement, modal) {
        const content = this._document.createElement('div');
        if (modal) {
            content.classList.add('igx-overlay__content--modal');
            content.addEventListener('click', (ev) => {
                ev.stopPropagation();
            });
        }
        else {
            content.classList.add('igx-overlay__content');
        }
        content.addEventListener('scroll', (ev) => {
            ev.stopPropagation();
        });
        //  hide element to eliminate flickering. Show the element exactly before animation starts
        wrapperElement.style.visibility = 'hidden';
        wrapperElement.appendChild(content);
        return content;
    }
    getOverlayElement(info) {
        if (info.settings.outlet) {
            return info.settings.outlet.nativeElement || info.settings.outlet;
        }
        if (!this._overlayElement) {
            this._overlayElement = this._document.createElement('div');
            this._overlayElement.classList.add('igx-overlay');
            this._document.body.appendChild(this._overlayElement);
        }
        return this._overlayElement;
    }
    updateSize(info) {
        if (info.componentRef) {
            //  if we are positioning component this is first time it gets visible
            //  and we can finally get its size
            info.componentRef.changeDetectorRef.detectChanges();
            info.initialSize = info.elementRef.nativeElement.getBoundingClientRect();
        }
        // set content div width only if element to show has width
        if (info.initialSize.width !== 0) {
            info.elementRef.nativeElement.parentElement.style.width = info.initialSize.width + 'px';
        }
    }
    closeDone(info) {
        info.visible = false;
        if (info.wrapperElement) {
            // to eliminate flickering show the element just before animation start
            info.wrapperElement.style.visibility = 'hidden';
        }
        if (!info.closeAnimationDetaching) {
            this.closed.emit({ id: info.id, componentRef: info.componentRef, event: info.event });
        }
        delete info.event;
    }
    cleanUp(info) {
        const child = info.elementRef.nativeElement;
        const outlet = this.getOverlayElement(info);
        // if same element is shown in other overlay outlet will not contain
        // the element and we should not remove it form outlet
        if (outlet.contains(child)) {
            outlet.removeChild(child.parentNode.parentNode);
        }
        if (info.componentRef) {
            this._appRef.detachView(info.componentRef.hostView);
            info.componentRef.destroy();
            delete info.componentRef;
        }
        if (info.hook) {
            info.hook.parentElement.insertBefore(info.elementRef.nativeElement, info.hook);
            info.hook.parentElement.removeChild(info.hook);
            delete info.hook;
        }
        const index = this._overlayInfos.indexOf(info);
        this._overlayInfos.splice(index, 1);
        // this._overlayElement.parentElement check just for tests that manually delete the element
        if (this._overlayInfos.length === 0) {
            if (this._overlayElement && this._overlayElement.parentElement) {
                this._overlayElement.parentElement.removeChild(this._overlayElement);
                this._overlayElement = null;
            }
            this.removeCloseOnEscapeListener();
        }
        // clean all the resources attached to info
        delete info.elementRef;
        delete info.settings;
        delete info.initialSize;
        info.openAnimationDetaching = true;
        info.openAnimationPlayer?.destroy();
        delete info.openAnimationPlayer;
        delete info.openAnimationInnerPlayer;
        info.closeAnimationDetaching = true;
        info.closeAnimationPlayer?.destroy();
        delete info.closeAnimationPlayer;
        delete info.closeAnimationInnerPlayer;
        delete info.ngZone;
        delete info.wrapperElement;
        info = null;
    }
    playOpenAnimation(info) {
        //  if there is opening animation already started do nothing
        if (info.openAnimationPlayer == null || info.openAnimationPlayer.hasStarted()) {
            return;
        }
        //  if there is closing animation already started start open animation from where close one has reached
        //  and reset close animation
        if (info.closeAnimationPlayer?.hasStarted()) {
            //  getPosition() returns what part of the animation is passed, e.g. 0.5 if half the animation
            //  is done, 0.75 if 3/4 of the animation is done. As we need to start next animation from where
            //  the previous has finished we need the amount up to 1, therefore we are subtracting what
            //  getPosition() returns from one
            const position = 1 - info.closeAnimationInnerPlayer.getPosition();
            info.closeAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it her via internal field
            info.closeAnimationPlayer._started = false;
            info.openAnimationPlayer.init();
            info.openAnimationPlayer.setPosition(position);
        }
        this.animationStarting.emit({ id: info.id, animationPlayer: info.openAnimationPlayer, animationType: 'open' });
        //  to eliminate flickering show the element just before animation start
        info.wrapperElement.style.visibility = '';
        info.visible = true;
        info.openAnimationPlayer.play();
    }
    playCloseAnimation(info, event) {
        //  if there is closing animation already started do nothing
        if (info.closeAnimationPlayer == null || info.closeAnimationPlayer.hasStarted()) {
            return;
        }
        //  if there is opening animation already started start close animation from where open one has reached
        //  and remove open animation
        if (info.openAnimationPlayer?.hasStarted()) {
            //  getPosition() returns what part of the animation is passed, e.g. 0.5 if half the animation
            //  is done, 0.75 if 3/4 of the animation is done. As we need to start next animation from where
            //  the previous has finished we need the amount up to 1, therefore we are subtracting what
            //  getPosition() returns from one
            //  TODO: This assumes opening and closing animations are mirrored.
            const position = 1 - info.openAnimationInnerPlayer.getPosition();
            info.openAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it her via internal field
            info.openAnimationPlayer._started = false;
            info.closeAnimationPlayer.init();
            info.closeAnimationPlayer.setPosition(position);
        }
        this.animationStarting.emit({ id: info.id, animationPlayer: info.closeAnimationPlayer, animationType: 'close' });
        info.event = event;
        info.closeAnimationPlayer.play();
    }
    //  TODO: check if applyAnimationParams will work with complex animations
    applyAnimationParams(wrapperElement, animationOptions) {
        if (!animationOptions) {
            wrapperElement.style.transitionDuration = '0ms';
            return;
        }
        if (!animationOptions.options || !animationOptions.options.params) {
            return;
        }
        const params = animationOptions.options.params;
        if (params.duration) {
            wrapperElement.style.transitionDuration = params.duration;
        }
        if (params.easing) {
            wrapperElement.style.transitionTimingFunction = params.easing;
        }
    }
    addOutsideClickListener(info) {
        if (info.settings.closeOnOutsideClick) {
            if (info.settings.modal) {
                fromEvent(info.elementRef.nativeElement.parentElement.parentElement, 'click')
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((e) => this._hide(info.id, e));
            }
            else if (
            //  if all overlays minus closing overlays equals one add the handler
            this._overlayInfos.filter(x => x.settings.closeOnOutsideClick && !x.settings.modal).length -
                this._overlayInfos.filter(x => x.settings.closeOnOutsideClick && !x.settings.modal &&
                    x.closeAnimationPlayer &&
                    x.closeAnimationPlayer.hasStarted()).length === 1) {
                // click event is not fired on iOS. To make element "clickable" we are
                // setting the cursor to pointer
                if (this.platformUtil.isIOS && !this._cursorStyleIsSet) {
                    this._cursorOriginalValue = this._document.body.style.cursor;
                    this._document.body.style.cursor = 'pointer';
                    this._cursorStyleIsSet = true;
                }
                this._document.addEventListener('click', this.documentClicked, true);
            }
        }
    }
    removeOutsideClickListener(info) {
        if (info.settings.modal === false) {
            let shouldRemoveClickEventListener = true;
            this._overlayInfos.forEach(o => {
                if (o.settings.modal === false && o.id !== info.id) {
                    shouldRemoveClickEventListener = false;
                }
            });
            if (shouldRemoveClickEventListener) {
                if (this._cursorStyleIsSet) {
                    this._document.body.style.cursor = this._cursorOriginalValue;
                    this._cursorOriginalValue = '';
                    this._cursorStyleIsSet = false;
                }
                this._document.removeEventListener('click', this.documentClicked, true);
            }
        }
    }
    addResizeHandler() {
        const closingOverlaysCount = this._overlayInfos
            .filter(o => o.closeAnimationPlayer && o.closeAnimationPlayer.hasStarted())
            .length;
        if (this._overlayInfos.length - closingOverlaysCount === 1) {
            this._document.defaultView.addEventListener('resize', this.repositionAll);
        }
    }
    removeResizeHandler() {
        const closingOverlaysCount = this._overlayInfos
            .filter(o => o.closeAnimationPlayer && o.closeAnimationPlayer.hasStarted())
            .length;
        if (this._overlayInfos.length - closingOverlaysCount === 1) {
            this._document.defaultView.removeEventListener('resize', this.repositionAll);
        }
    }
    addCloseOnEscapeListener(info) {
        if (info.settings.closeOnEscape && !this._keyPressEventListener) {
            this._keyPressEventListener = fromEvent(this._document, 'keydown').pipe(filter((ev) => ev.key === 'Escape' || ev.key === 'Esc')).subscribe((ev) => {
                const visibleOverlays = this._overlayInfos.filter(o => o.visible);
                if (visibleOverlays.length < 1) {
                    return;
                }
                const targetOverlayInfo = visibleOverlays[visibleOverlays.length - 1];
                if (targetOverlayInfo.visible && targetOverlayInfo.settings.closeOnEscape) {
                    this.hide(targetOverlayInfo.id, ev);
                }
            });
        }
    }
    removeCloseOnEscapeListener() {
        if (this._keyPressEventListener) {
            this._keyPressEventListener.unsubscribe();
            this._keyPressEventListener = null;
        }
    }
    addModalClasses(info) {
        if (info.settings.modal) {
            const wrapperElement = info.elementRef.nativeElement.parentElement.parentElement;
            wrapperElement.classList.remove('igx-overlay__wrapper');
            this.applyAnimationParams(wrapperElement, info.settings.positionStrategy.settings.openAnimation);
            requestAnimationFrame(() => {
                wrapperElement.classList.add('igx-overlay__wrapper--modal');
            });
        }
    }
    removeModalClasses(info) {
        if (info.settings.modal) {
            const wrapperElement = info.elementRef.nativeElement.parentElement.parentElement;
            this.applyAnimationParams(wrapperElement, info.settings.positionStrategy.settings.closeAnimation);
            wrapperElement.classList.remove('igx-overlay__wrapper--modal');
            wrapperElement.classList.add('igx-overlay__wrapper');
        }
    }
    buildAnimationPlayers(info) {
        if (info.settings.positionStrategy.settings.openAnimation) {
            const animationBuilder = this.builder.build(info.settings.positionStrategy.settings.openAnimation);
            info.openAnimationPlayer = animationBuilder.create(info.elementRef.nativeElement);
            //  AnimationPlayer.getPosition returns always 0. To workaround this we are getting inner WebAnimationPlayer
            //  and then getting the positions from it.
            //  This is logged in Angular here - https://github.com/angular/angular/issues/18891
            //  As soon as this is resolved we can remove this hack
            const innerRenderer = info.openAnimationPlayer._renderer;
            info.openAnimationInnerPlayer = innerRenderer.engine.players[innerRenderer.engine.players.length - 1];
            info.openAnimationPlayer.onDone(() => this.openAnimationDone(info));
        }
        if (info.settings.positionStrategy.settings.closeAnimation) {
            const animationBuilder = this.builder.build(info.settings.positionStrategy.settings.closeAnimation);
            info.closeAnimationPlayer = animationBuilder.create(info.elementRef.nativeElement);
            //  AnimationPlayer.getPosition returns always 0. To workaround this we are getting inner WebAnimationPlayer
            //  and then getting the positions from it.
            //  This is logged in Angular here - https://github.com/angular/angular/issues/18891
            //  As soon as this is resolved we can remove this hack
            const innerRenderer = info.closeAnimationPlayer._renderer;
            info.closeAnimationInnerPlayer = innerRenderer.engine.players[innerRenderer.engine.players.length - 1];
            info.closeAnimationPlayer.onDone(() => this.closeAnimationDone(info));
        }
    }
    openAnimationDone(info) {
        if (!info.openAnimationDetaching) {
            this.opened.emit({ id: info.id, componentRef: info.componentRef });
        }
        if (info.openAnimationPlayer) {
            info.openAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it here via internal field
            info.openAnimationPlayer._started = false;
            // when animation finish angular deletes all onDone handlers so we need to add it again :(
            info.openAnimationPlayer.onDone(() => this.openAnimationDone(info));
        }
        if (info.closeAnimationPlayer && info.closeAnimationPlayer.hasStarted()) {
            info.closeAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it here via internal field
            info.closeAnimationPlayer._started = false;
        }
    }
    closeAnimationDone(info) {
        if (info.closeAnimationPlayer) {
            info.closeAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it here via internal field
            info.closeAnimationPlayer._started = false;
            // when animation finish angular deletes all onDone handlers so we need to add it again :(
            info.closeAnimationPlayer.onDone(() => this.closeAnimationDone(info));
        }
        if (info.openAnimationPlayer && info.openAnimationPlayer.hasStarted()) {
            info.openAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it here via internal field
            info.openAnimationPlayer._started = false;
        }
        this.closeDone(info);
    }
    finishAnimations(info) {
        // TODO: should we emit here opened or closed events
        if (info.openAnimationPlayer && info.openAnimationPlayer.hasStarted()) {
            info.openAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it here via internal field
            info.openAnimationPlayer._started = false;
        }
        if (info.closeAnimationPlayer && info.closeAnimationPlayer.hasStarted()) {
            info.closeAnimationPlayer.reset();
            // calling reset does not change hasStarted to false. This is why we are doing it here via internal field
            info.closeAnimationPlayer._started = false;
        }
    }
}
IgxOverlayService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxOverlayService, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: i1.AnimationBuilder }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i2.PlatformUtil }], target: i0.ɵɵFactoryTarget.Injectable });
IgxOverlayService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxOverlayService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxOverlayService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: i1.AnimationBuilder }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i2.PlatformUtil }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZXJ2aWNlcy9vdmVybGF5L292ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFLSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixVQUFVLEVBSWIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUNILE1BQU0sRUFDTixPQUFPLEVBRVAsY0FBYyxFQUNkLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxhQUFhLEVBQ2IsVUFBVSxFQUNWLGNBQWMsRUFDZCxXQUFXLEVBQ2QsTUFBTSx1QkFBdUIsQ0FBQztBQUcvQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUN6RixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQ0gsZ0JBQWdCLEVBQ2hCLG1CQUFtQixFQVNuQixnQkFBZ0IsRUFDaEIsd0JBQXdCLEVB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QUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN0RDtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVPLGdCQUFnQixDQUFDLElBQWlCO1FBQ3RDLG9EQUFvRDtRQUNwRCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDbkUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pDLHlHQUF5RztZQUN4RyxJQUFJLENBQUMsbUJBQTJCLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN0RDtRQUNELElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNyRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEMseUdBQXlHO1lBQ3hHLElBQUksQ0FBQyxvQkFBNEIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3ZEO0lBQ0wsQ0FBQzs7OEdBeDZCUSxpQkFBaUIsZ0pBb0ZkLFFBQVE7a0hBcEZYLGlCQUFpQixjQURKLE1BQU07MkZBQ25CLGlCQUFpQjtrQkFEN0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQXFGekIsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uQnVpbGRlciwgQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQXBwbGljYXRpb25SZWYsXG4gICAgQ29tcG9uZW50RmFjdG9yeSxcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQ29tcG9uZW50UmVmLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBJbmplY3RhYmxlLFxuICAgIEluamVjdG9yLFxuICAgIE5nTW9kdWxlUmVmLFxuICAgIE5nWm9uZSwgT25EZXN0cm95LCBUeXBlXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgICBmYWRlSW4sXG4gICAgZmFkZU91dCxcbiAgICBJQW5pbWF0aW9uUGFyYW1zLFxuICAgIHNjYWxlSW5Ib3JMZWZ0LFxuICAgIHNjYWxlSW5Ib3JSaWdodCxcbiAgICBzY2FsZUluVmVyQm90dG9tLFxuICAgIHNjYWxlSW5WZXJUb3AsXG4gICAgc2NhbGVPdXRIb3JMZWZ0LFxuICAgIHNjYWxlT3V0SG9yUmlnaHQsXG4gICAgc2NhbGVPdXRWZXJCb3R0b20sXG4gICAgc2NhbGVPdXRWZXJUb3AsXG4gICAgc2xpZGVJbkJvdHRvbSxcbiAgICBzbGlkZUluVG9wLFxuICAgIHNsaWRlT3V0Qm90dG9tLFxuICAgIHNsaWRlT3V0VG9wXG59IGZyb20gJy4uLy4uL2FuaW1hdGlvbnMvbWFpbic7XG5pbXBvcnQgeyBQbGF0Zm9ybVV0aWwgfSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneE92ZXJsYXlPdXRsZXREaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvZ2dsZS90b2dnbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IEF1dG9Qb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9wb3NpdGlvbi9hdXRvLXBvc2l0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7IENvbm5lY3RlZFBvc2l0aW9uaW5nU3RyYXRlZ3kgfSBmcm9tICcuL3Bvc2l0aW9uL2Nvbm5lY3RlZC1wb3NpdGlvbmluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBDb250YWluZXJQb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9wb3NpdGlvbi9jb250YWluZXItcG9zaXRpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHsgRWxhc3RpY1Bvc2l0aW9uU3RyYXRlZ3kgfSBmcm9tICcuL3Bvc2l0aW9uL2VsYXN0aWMtcG9zaXRpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHsgR2xvYmFsUG9zaXRpb25TdHJhdGVneSB9IGZyb20gJy4vcG9zaXRpb24vZ2xvYmFsLXBvc2l0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7IElQb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9wb3NpdGlvbi9JUG9zaXRpb25TdHJhdGVneSc7XG5pbXBvcnQgeyBOb09wU2Nyb2xsU3RyYXRlZ3kgfSBmcm9tICcuL3Njcm9sbC9Ob09wU2Nyb2xsU3RyYXRlZ3knO1xuaW1wb3J0IHtcbiAgICBBYnNvbHV0ZVBvc2l0aW9uLFxuICAgIEhvcml6b250YWxBbGlnbm1lbnQsXG4gICAgT3ZlcmxheUFuaW1hdGlvbkV2ZW50QXJncyxcbiAgICBPdmVybGF5Q2FuY2VsYWJsZUV2ZW50QXJncyxcbiAgICBPdmVybGF5Q2xvc2luZ0V2ZW50QXJncyxcbiAgICBPdmVybGF5RXZlbnRBcmdzLFxuICAgIE92ZXJsYXlJbmZvLFxuICAgIE92ZXJsYXlTZXR0aW5ncyxcbiAgICBQb2ludCxcbiAgICBQb3NpdGlvblNldHRpbmdzLFxuICAgIFJlbGF0aXZlUG9zaXRpb24sXG4gICAgUmVsYXRpdmVQb3NpdGlvblN0cmF0ZWd5LFxuICAgIFZlcnRpY2FsQWxpZ25tZW50XG59IGZyb20gJy4vdXRpbGl0aWVzJztcblxuLyoqXG4gKiBbRG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly93d3cuaW5mcmFnaXN0aWNzLmNvbS9wcm9kdWN0cy9pZ25pdGUtdWktYW5ndWxhci9hbmd1bGFyL2NvbXBvbmVudHMvb3ZlcmxheS1tYWluKVxuICogVGhlIG92ZXJsYXkgc2VydmljZSBhbGxvd3MgdXNlcnMgdG8gc2hvdyBjb21wb25lbnRzIG9uIG92ZXJsYXkgZGl2IGFib3ZlIGFsbCBvdGhlciBlbGVtZW50cyBpbiB0aGUgcGFnZS5cbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBJZ3hPdmVybGF5U2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBqdXN0IGJlZm9yZSB0aGUgb3ZlcmxheSBjb250ZW50IHN0YXJ0cyB0byBvcGVuLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBvcGVuaW5nKGV2ZW50OiBPdmVybGF5Q2FuY2VsYWJsZUV2ZW50QXJncyl7XG4gICAgICogICAgIGNvbnN0IG9wZW5pbmcgPSBldmVudDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIG9wZW5pbmcgPSBuZXcgRXZlbnRFbWl0dGVyPE92ZXJsYXlDYW5jZWxhYmxlRXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBhZnRlciB0aGUgb3ZlcmxheSBjb250ZW50IGlzIG9wZW5lZCBhbmQgYWxsIGFuaW1hdGlvbnMgYXJlIGZpbmlzaGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBvcGVuZWQoZXZlbnQ6IE92ZXJsYXlFdmVudEFyZ3Mpe1xuICAgICAqICAgICBjb25zdCBvcGVuZWQgPSBldmVudDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIG9wZW5lZCA9IG5ldyBFdmVudEVtaXR0ZXI8T3ZlcmxheUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQganVzdCBiZWZvcmUgdGhlIG92ZXJsYXkgY29udGVudCBzdGFydHMgdG8gY2xvc2UuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNsb3NpbmcoZXZlbnQ6IE92ZXJsYXlDYW5jZWxhYmxlRXZlbnRBcmdzKXtcbiAgICAgKiAgICAgY29uc3QgY2xvc2luZyA9IGV2ZW50O1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8T3ZlcmxheUNsb3NpbmdFdmVudEFyZ3M+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0dGVkIGFmdGVyIHRoZSBvdmVybGF5IGNvbnRlbnQgaXMgY2xvc2VkIGFuZCBhbGwgYW5pbWF0aW9ucyBhcmUgZmluaXNoZWQuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIGNsb3NlZChldmVudDogT3ZlcmxheUV2ZW50QXJncyl7XG4gICAgICogICAgIGNvbnN0IGNsb3NlZCA9IGV2ZW50O1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxPdmVybGF5RXZlbnRBcmdzPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHRlZCBhZnRlciB0aGUgY29udGVudCBpcyBhcHBlbmRlZCB0byB0aGUgb3ZlcmxheSwgYW5kIGJlZm9yZSBhbmltYXRpb25zIGFyZSBzdGFydGVkLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBjb250ZW50QXBwZW5kZWQoZXZlbnQ6IE92ZXJsYXlFdmVudEFyZ3Mpe1xuICAgICAqICAgICBjb25zdCBjb250ZW50QXBwZW5kZWQgPSBldmVudDtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGNvbnRlbnRBcHBlbmRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8T3ZlcmxheUV2ZW50QXJncz4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXR0ZWQganVzdCBiZWZvcmUgdGhlIG92ZXJsYXkgYW5pbWF0aW9uIHN0YXJ0LlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBhbmltYXRpb25TdGFydGluZyhldmVudDogT3ZlcmxheUFuaW1hdGlvbkV2ZW50QXJncyl7XG4gICAgICogICAgIGNvbnN0IGFuaW1hdGlvblN0YXJ0aW5nID0gZXZlbnQ7XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBhbmltYXRpb25TdGFydGluZyA9IG5ldyBFdmVudEVtaXR0ZXI8T3ZlcmxheUFuaW1hdGlvbkV2ZW50QXJncz4oKTtcblxuICAgIHByaXZhdGUgX2NvbXBvbmVudElkID0gMDtcbiAgICBwcml2YXRlIF9vdmVybGF5SW5mb3M6IE92ZXJsYXlJbmZvW10gPSBbXTtcbiAgICBwcml2YXRlIF9vdmVybGF5RWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuICAgIHByaXZhdGUgX2tleVByZXNzRXZlbnRMaXN0ZW5lcjogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICAgIHByaXZhdGUgX2N1cnNvclN0eWxlSXNTZXQgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9jdXJzb3JPcmlnaW5hbFZhbHVlOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9kZWZhdWx0U2V0dGluZ3M6IE92ZXJsYXlTZXR0aW5ncyA9IHtcbiAgICAgICAgZXhjbHVkZUZyb21PdXRzaWRlQ2xpY2s6IFtdLFxuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBuZXcgR2xvYmFsUG9zaXRpb25TdHJhdGVneSgpLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogbmV3IE5vT3BTY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgY2xvc2VPbk91dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgY2xvc2VPbkVzY2FwZTogZmFsc2VcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgX2ZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICBwcml2YXRlIF9hcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAgIHByaXZhdGUgYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlcixcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgICAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXG4gICAgICAgIHByb3RlY3RlZCBwbGF0Zm9ybVV0aWw6IFBsYXRmb3JtVXRpbCkge1xuICAgICAgICB0aGlzLl9kb2N1bWVudCA9IHRoaXMuZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBvdmVybGF5IHNldHRpbmdzIHdpdGggZ2xvYmFsIG9yIGNvbnRhaW5lciBwb3NpdGlvbiBzdHJhdGVneSBhbmQgcHJlc2V0IHBvc2l0aW9uIHNldHRpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gUHJlc2V0IHBvc2l0aW9uIHNldHRpbmdzLiBEZWZhdWx0IHBvc2l0aW9uIGlzICdjZW50ZXInXG4gICAgICogQHBhcmFtIG91dGxldCBUaGUgb3V0bGV0IGNvbnRhaW5lciB0byBhdHRhY2ggdGhlIG92ZXJsYXkgdG9cbiAgICAgKiBAcmV0dXJucyBOb24tbW9kYWwgb3ZlcmxheSBzZXR0aW5ncyBiYXNlZCBvbiBHbG9iYWwgb3IgQ29udGFpbmVyIHBvc2l0aW9uIHN0cmF0ZWd5IGFuZCB0aGUgcHJvdmlkZWQgcG9zaXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVBYnNvbHV0ZU92ZXJsYXlTZXR0aW5ncyhcbiAgICAgICAgcG9zaXRpb24/OiBBYnNvbHV0ZVBvc2l0aW9uLCBvdXRsZXQ/OiBJZ3hPdmVybGF5T3V0bGV0RGlyZWN0aXZlIHwgRWxlbWVudFJlZik6IE92ZXJsYXlTZXR0aW5ncyB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uU2V0dGluZ3MgPSB0aGlzLmNyZWF0ZUFic29sdXRlUG9zaXRpb25TZXR0aW5ncyhwb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHN0cmF0ZWd5ID0gb3V0bGV0ID8gbmV3IENvbnRhaW5lclBvc2l0aW9uU3RyYXRlZ3kocG9zaXRpb25TZXR0aW5ncykgOiBuZXcgR2xvYmFsUG9zaXRpb25TdHJhdGVneShwb3NpdGlvblNldHRpbmdzKTtcbiAgICAgICAgY29uc3Qgb3ZlcmxheVNldHRpbmdzOiBPdmVybGF5U2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBzdHJhdGVneSxcbiAgICAgICAgICAgIHNjcm9sbFN0cmF0ZWd5OiBuZXcgTm9PcFNjcm9sbFN0cmF0ZWd5KCksXG4gICAgICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlLFxuICAgICAgICAgICAgb3V0bGV0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBvdmVybGF5U2V0dGluZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBvdmVybGF5IHNldHRpbmdzIHdpdGggYXV0bywgY29ubmVjdGVkIG9yIGVsYXN0aWMgcG9zaXRpb24gc3RyYXRlZ3kgYW5kIHByZXNldCBwb3NpdGlvbiBzZXR0aW5nc1xuICAgICAqXG4gICAgICogQHBhcmFtIHRhcmdldCBBdHRhY2hpbmcgdGFyZ2V0IGZvciB0aGUgY29tcG9uZW50IHRvIHNob3dcbiAgICAgKiBAcGFyYW0gc3RyYXRlZ3kgVGhlIHJlbGF0aXZlIHBvc2l0aW9uIHN0cmF0ZWd5IHRvIGJlIGFwcGxpZWQgdG8gdGhlIG92ZXJsYXkgc2V0dGluZ3MuIERlZmF1bHQgaXMgQXV0byBwb3NpdGlvbmluZyBzdHJhdGVneS5cbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gUHJlc2V0IHBvc2l0aW9uIHNldHRpbmdzLiBCeSBkZWZhdWx0IHRoZSBlbGVtZW50IGlzIHBvc2l0aW9uZWQgYmVsb3cgdGhlIHRhcmdldCwgbGVmdCBhbGlnbmVkLlxuICAgICAqIEByZXR1cm5zIE5vbi1tb2RhbCBvdmVybGF5IHNldHRpbmdzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0YXJnZXQsIHN0cmF0ZWd5IGFuZCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJlbGF0aXZlT3ZlcmxheVNldHRpbmdzKFxuICAgICAgICB0YXJnZXQ6IFBvaW50IHwgSFRNTEVsZW1lbnQsXG4gICAgICAgIHBvc2l0aW9uPzogUmVsYXRpdmVQb3NpdGlvbixcbiAgICAgICAgc3RyYXRlZ3k/OiBSZWxhdGl2ZVBvc2l0aW9uU3RyYXRlZ3kpOlxuICAgICAgICBPdmVybGF5U2V0dGluZ3Mge1xuICAgICAgICBjb25zdCBwb3NpdGlvblNldHRpbmdzID0gdGhpcy5jcmVhdGVSZWxhdGl2ZVBvc2l0aW9uU2V0dGluZ3MocG9zaXRpb24pO1xuICAgICAgICBjb25zdCBvdmVybGF5U2V0dGluZ3M6IE92ZXJsYXlTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuY3JlYXRlUG9zaXRpb25TdHJhdGVneShzdHJhdGVneSwgcG9zaXRpb25TZXR0aW5ncyksXG4gICAgICAgICAgICBzY3JvbGxTdHJhdGVneTogbmV3IE5vT3BTY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICAgICAgbW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgY2xvc2VPbk91dHNpZGVDbGljazogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb3ZlcmxheVNldHRpbmdzO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZUFic29sdXRlUG9zaXRpb25TZXR0aW5ncyhwb3NpdGlvbjogQWJzb2x1dGVQb3NpdGlvbik6IFBvc2l0aW9uU2V0dGluZ3Mge1xuICAgICAgICBsZXQgcG9zaXRpb25TZXR0aW5nczogUG9zaXRpb25TZXR0aW5ncztcbiAgICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBYnNvbHV0ZVBvc2l0aW9uLkJvdHRvbTpcbiAgICAgICAgICAgICAgICBwb3NpdGlvblNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsRGlyZWN0aW9uOiBIb3Jpem9udGFsQWxpZ25tZW50LkNlbnRlcixcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxEaXJlY3Rpb246IFZlcnRpY2FsQWxpZ25tZW50LkJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgb3BlbkFuaW1hdGlvbjogc2xpZGVJbkJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VBbmltYXRpb246IHNsaWRlT3V0Qm90dG9tXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWJzb2x1dGVQb3NpdGlvbi5Ub3A6XG4gICAgICAgICAgICAgICAgcG9zaXRpb25TZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbEFsaWdubWVudC5DZW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsRGlyZWN0aW9uOiBWZXJ0aWNhbEFsaWdubWVudC5Ub3AsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5BbmltYXRpb246IHNsaWRlSW5Ub3AsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQW5pbWF0aW9uOiBzbGlkZU91dFRvcFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFic29sdXRlUG9zaXRpb24uQ2VudGVyOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBwb3NpdGlvblNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsRGlyZWN0aW9uOiBIb3Jpem9udGFsQWxpZ25tZW50LkNlbnRlcixcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxEaXJlY3Rpb246IFZlcnRpY2FsQWxpZ25tZW50Lk1pZGRsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BlbkFuaW1hdGlvbjogZmFkZUluLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZUFuaW1hdGlvbjogZmFkZU91dFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uU2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlUmVsYXRpdmVQb3NpdGlvblNldHRpbmdzKHBvc2l0aW9uOiBSZWxhdGl2ZVBvc2l0aW9uKTogUG9zaXRpb25TZXR0aW5ncyB7XG4gICAgICAgIGxldCBwb3NpdGlvblNldHRpbmdzOiBQb3NpdGlvblNldHRpbmdzO1xuICAgICAgICBzd2l0Y2ggKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFJlbGF0aXZlUG9zaXRpb24uQWJvdmU6XG4gICAgICAgICAgICAgICAgcG9zaXRpb25TZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbFN0YXJ0UG9pbnQ6IEhvcml6b250YWxBbGlnbm1lbnQuQ2VudGVyLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN0YXJ0UG9pbnQ6IFZlcnRpY2FsQWxpZ25tZW50LlRvcCxcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbEFsaWdubWVudC5DZW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsRGlyZWN0aW9uOiBWZXJ0aWNhbEFsaWdubWVudC5Ub3AsXG4gICAgICAgICAgICAgICAgICAgIG9wZW5BbmltYXRpb246IHNjYWxlSW5WZXJCb3R0b20sXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQW5pbWF0aW9uOiBzY2FsZU91dFZlckJvdHRvbSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBSZWxhdGl2ZVBvc2l0aW9uLkJlbG93OlxuICAgICAgICAgICAgICAgIHBvc2l0aW9uU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxTdGFydFBvaW50OiBIb3Jpem9udGFsQWxpZ25tZW50LkNlbnRlcixcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxTdGFydFBvaW50OiBWZXJ0aWNhbEFsaWdubWVudC5Cb3R0b20sXG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxEaXJlY3Rpb246IEhvcml6b250YWxBbGlnbm1lbnQuQ2VudGVyLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbERpcmVjdGlvbjogVmVydGljYWxBbGlnbm1lbnQuQm90dG9tLFxuICAgICAgICAgICAgICAgICAgICBvcGVuQW5pbWF0aW9uOiBzY2FsZUluVmVyVG9wLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZUFuaW1hdGlvbjogc2NhbGVPdXRWZXJUb3BcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBSZWxhdGl2ZVBvc2l0aW9uLkFmdGVyOlxuICAgICAgICAgICAgICAgIHBvc2l0aW9uU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxTdGFydFBvaW50OiBIb3Jpem9udGFsQWxpZ25tZW50LlJpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN0YXJ0UG9pbnQ6IFZlcnRpY2FsQWxpZ25tZW50Lk1pZGRsZSxcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbEFsaWdubWVudC5SaWdodCxcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxEaXJlY3Rpb246IFZlcnRpY2FsQWxpZ25tZW50Lk1pZGRsZSxcbiAgICAgICAgICAgICAgICAgICAgb3BlbkFuaW1hdGlvbjogc2NhbGVJbkhvckxlZnQsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQW5pbWF0aW9uOiBzY2FsZU91dEhvckxlZnRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBSZWxhdGl2ZVBvc2l0aW9uLkJlZm9yZTpcbiAgICAgICAgICAgICAgICBwb3NpdGlvblNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsU3RhcnRQb2ludDogSG9yaXpvbnRhbEFsaWdubWVudC5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN0YXJ0UG9pbnQ6IFZlcnRpY2FsQWxpZ25tZW50Lk1pZGRsZSxcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbEFsaWdubWVudC5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbERpcmVjdGlvbjogVmVydGljYWxBbGlnbm1lbnQuTWlkZGxlLFxuICAgICAgICAgICAgICAgICAgICBvcGVuQW5pbWF0aW9uOiBzY2FsZUluSG9yUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlQW5pbWF0aW9uOiBzY2FsZU91dEhvclJpZ2h0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUmVsYXRpdmVQb3NpdGlvbi5EZWZhdWx0OlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBwb3NpdGlvblNldHRpbmdzID0ge1xuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsU3RhcnRQb2ludDogSG9yaXpvbnRhbEFsaWdubWVudC5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN0YXJ0UG9pbnQ6IFZlcnRpY2FsQWxpZ25tZW50LkJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbEFsaWdubWVudC5SaWdodCxcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWxEaXJlY3Rpb246IFZlcnRpY2FsQWxpZ25tZW50LkJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgb3BlbkFuaW1hdGlvbjogc2NhbGVJblZlclRvcCxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VBbmltYXRpb246IHNjYWxlT3V0VmVyVG9wLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uU2V0dGluZ3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlUG9zaXRpb25TdHJhdGVneShzdHJhdGVneTogUmVsYXRpdmVQb3NpdGlvblN0cmF0ZWd5LCBwb3NpdGlvblNldHRpbmdzOiBQb3NpdGlvblNldHRpbmdzKTogSVBvc2l0aW9uU3RyYXRlZ3kge1xuICAgICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlIFJlbGF0aXZlUG9zaXRpb25TdHJhdGVneS5Db25uZWN0ZWQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb25uZWN0ZWRQb3NpdGlvbmluZ1N0cmF0ZWd5KHBvc2l0aW9uU2V0dGluZ3MpO1xuICAgICAgICAgICAgY2FzZSBSZWxhdGl2ZVBvc2l0aW9uU3RyYXRlZ3kuRWxhc3RpYzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVsYXN0aWNQb3NpdGlvblN0cmF0ZWd5KHBvc2l0aW9uU2V0dGluZ3MpO1xuICAgICAgICAgICAgY2FzZSBSZWxhdGl2ZVBvc2l0aW9uU3RyYXRlZ3kuQXV0bzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBBdXRvUG9zaXRpb25TdHJhdGVneShwb3NpdGlvblNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBJZC4gUHJvdmlkZSB0aGlzIElkIHdoZW4gY2FsbCBgc2hvdyhpZClgIG1ldGhvZFxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCBFbGVtZW50UmVmIHRvIHNob3cgaW4gb3ZlcmxheVxuICAgICAqIEBwYXJhbSBzZXR0aW5ncyBEaXNwbGF5IHNldHRpbmdzIGZvciB0aGUgb3ZlcmxheSwgc3VjaCBhcyBwb3NpdGlvbmluZyBhbmQgc2Nyb2xsL2Nsb3NlIGJlaGF2aW9yLlxuICAgICAqIEByZXR1cm5zIElkIG9mIHRoZSBjcmVhdGVkIG92ZXJsYXkuIFZhbGlkIHVudGlsIGBkZXRhY2hgIGlzIGNhbGxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXR0YWNoKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHNldHRpbmdzPzogT3ZlcmxheVNldHRpbmdzKTogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBJZC4gUHJvdmlkZSB0aGlzIElkIHdoZW4gY2FsbCBgc2hvdyhpZClgIG1ldGhvZFxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgVHlwZSB0byBzaG93IGluIG92ZXJsYXlcbiAgICAgKiBAcGFyYW0gc2V0dGluZ3MgRGlzcGxheSBzZXR0aW5ncyBmb3IgdGhlIG92ZXJsYXksIHN1Y2ggYXMgcG9zaXRpb25pbmcgYW5kIHNjcm9sbC9jbG9zZSBiZWhhdmlvci5cbiAgICAgKiBAcGFyYW0gbW9kdWxlUmVmIE9wdGlvbmFsIHJlZmVyZW5jZSB0byBhbiBvYmplY3QgY29udGFpbmluZyBJbmplY3RvciBhbmQgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyXG4gICAgICogdGhhdCBjYW4gcmVzb2x2ZSB0aGUgY29tcG9uZW50J3MgZmFjdG9yeVxuICAgICAqIEByZXR1cm5zIElkIG9mIHRoZSBjcmVhdGVkIG92ZXJsYXkuIFZhbGlkIHVudGlsIGBkZXRhY2hgIGlzIGNhbGxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXR0YWNoKGNvbXBvbmVudDogVHlwZTxhbnk+LCBzZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncyxcbiAgICAgICAgbW9kdWxlUmVmPzogUGljazxOZ01vZHVsZVJlZjxhbnk+LCAnaW5qZWN0b3InIHwgJ2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcic+KTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRhY2goY29tcG9uZW50OiBFbGVtZW50UmVmIHwgVHlwZTxhbnk+LCBzZXR0aW5ncz86IE92ZXJsYXlTZXR0aW5ncyxcbiAgICAgICAgbW9kdWxlUmVmPzogUGljazxOZ01vZHVsZVJlZjxhbnk+LCAnaW5qZWN0b3InIHwgJ2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcic+KTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaW5mbzogT3ZlcmxheUluZm8gPSB0aGlzLmdldE92ZXJsYXlJbmZvKGNvbXBvbmVudCwgbW9kdWxlUmVmKTtcblxuICAgICAgICBpZiAoIWluZm8pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignT3ZlcmxheSB3YXMgbm90IGFibGUgdG8gYXR0YWNoIHByb3ZpZGVkIGNvbXBvbmVudCEnKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5mby5pZCA9ICh0aGlzLl9jb21wb25lbnRJZCsrKS50b1N0cmluZygpO1xuICAgICAgICBpbmZvLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0U2V0dGluZ3MsIHNldHRpbmdzKTtcbiAgICAgICAgaW5mby5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB0aGlzLl9vdmVybGF5SW5mb3MucHVzaChpbmZvKTtcbiAgICAgICAgaW5mby5ob29rID0gdGhpcy5wbGFjZUVsZW1lbnRIb29rKGluZm8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgY29uc3QgZWxlbWVudFJlY3QgPSBpbmZvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaW5mby5pbml0aWFsU2l6ZSA9IHsgd2lkdGg6IGVsZW1lbnRSZWN0LndpZHRoLCBoZWlnaHQ6IGVsZW1lbnRSZWN0LmhlaWdodCB9O1xuICAgICAgICB0aGlzLm1vdmVFbGVtZW50VG9PdmVybGF5KGluZm8pO1xuICAgICAgICB0aGlzLmNvbnRlbnRBcHBlbmRlZC5lbWl0KHsgaWQ6IGluZm8uaWQsIGNvbXBvbmVudFJlZjogaW5mby5jb21wb25lbnRSZWYgfSk7XG4gICAgICAgIC8vIFRPRE86IHdoeSB3ZSBoYWQgdGhpcyBjaGVjaz9cbiAgICAgICAgLy8gaWYgKHRoaXMuX292ZXJsYXlJbmZvcy5pbmRleE9mKGluZm8pID09PSAtMSkge1xuICAgICAgICAvLyAgICAgdGhpcy5fb3ZlcmxheUluZm9zLnB1c2goaW5mbyk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgaW5mby5zZXR0aW5ncy5zY3JvbGxTdHJhdGVneS5pbml0aWFsaXplKHRoaXMuX2RvY3VtZW50LCB0aGlzLCBpbmZvLmlkKTtcbiAgICAgICAgaW5mby5zZXR0aW5ncy5zY3JvbGxTdHJhdGVneS5hdHRhY2goKTtcbiAgICAgICAgdGhpcy5hZGRPdXRzaWRlQ2xpY2tMaXN0ZW5lcihpbmZvKTtcbiAgICAgICAgdGhpcy5hZGRSZXNpemVIYW5kbGVyKCk7XG4gICAgICAgIHRoaXMuYWRkQ2xvc2VPbkVzY2FwZUxpc3RlbmVyKGluZm8pO1xuICAgICAgICB0aGlzLmJ1aWxkQW5pbWF0aW9uUGxheWVycyhpbmZvKTtcbiAgICAgICAgcmV0dXJuIGluZm8uaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIG92ZXJsYXkgd2l0aCB0aGUgcHJvdmlkZWQgaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgSWQgb2YgdGhlIG92ZXJsYXkgdG8gcmVtb3ZlXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMub3ZlcmxheS5kZXRhY2goaWQpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBkZXRhY2goaWQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBpbmZvOiBPdmVybGF5SW5mbyA9IHRoaXMuZ2V0T3ZlcmxheUJ5SWQoaWQpO1xuXG4gICAgICAgIGlmICghaW5mbykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdpZ3hPdmVybGF5LmRldGFjaCB3YXMgY2FsbGVkIHdpdGggd3JvbmcgaWQ6ICcsIGlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmRldGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maW5pc2hBbmltYXRpb25zKGluZm8pO1xuICAgICAgICBpbmZvLnNldHRpbmdzLnNjcm9sbFN0cmF0ZWd5LmRldGFjaCgpO1xuICAgICAgICB0aGlzLnJlbW92ZU91dHNpZGVDbGlja0xpc3RlbmVyKGluZm8pO1xuICAgICAgICB0aGlzLnJlbW92ZVJlc2l6ZUhhbmRsZXIoKTtcbiAgICAgICAgdGhpcy5jbGVhblVwKGluZm8pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgdGhlIG92ZXJsYXlzLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiB0aGlzLm92ZXJsYXkuZGV0YWNoQWxsKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGRldGFjaEFsbCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX292ZXJsYXlJbmZvcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoKHRoaXMuX292ZXJsYXlJbmZvc1tpXS5pZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93cyB0aGUgb3ZlcmxheSBmb3IgcHJvdmlkZWQgaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgSWQgdG8gc2hvdyBvdmVybGF5IGZvclxuICAgICAqIEBwYXJhbSBzZXR0aW5ncyBEaXNwbGF5IHNldHRpbmdzIGZvciB0aGUgb3ZlcmxheSwgc3VjaCBhcyBwb3NpdGlvbmluZyBhbmQgc2Nyb2xsL2Nsb3NlIGJlaGF2aW9yLlxuICAgICAqL1xuICAgIHB1YmxpYyBzaG93KGlkOiBzdHJpbmcsIHNldHRpbmdzPzogT3ZlcmxheVNldHRpbmdzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGluZm86IE92ZXJsYXlJbmZvID0gdGhpcy5nZXRPdmVybGF5QnlJZChpZCk7XG4gICAgICAgIGlmICghaW5mbykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdpZ3hPdmVybGF5LnNob3cgd2FzIGNhbGxlZCB3aXRoIHdyb25nIGlkOiAnLCBpZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVudEFyZ3M6IE92ZXJsYXlDYW5jZWxhYmxlRXZlbnRBcmdzID0geyBpZCwgY29tcG9uZW50UmVmOiBpbmZvLmNvbXBvbmVudFJlZiwgY2FuY2VsOiBmYWxzZSB9O1xuICAgICAgICB0aGlzLm9wZW5pbmcuZW1pdChldmVudEFyZ3MpO1xuICAgICAgICBpZiAoZXZlbnRBcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICAgICAgLy8gVE9ETzogdXBkYXRlIGF0dGFjaFxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlU2l6ZShpbmZvKTtcbiAgICAgICAgaW5mby5zZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5LnBvc2l0aW9uKFxuICAgICAgICAgICAgaW5mby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCxcbiAgICAgICAgICAgIHsgd2lkdGg6IGluZm8uaW5pdGlhbFNpemUud2lkdGgsIGhlaWdodDogaW5mby5pbml0aWFsU2l6ZS5oZWlnaHQgfSxcbiAgICAgICAgICAgIGRvY3VtZW50LFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIGluZm8uc2V0dGluZ3MudGFyZ2V0KTtcbiAgICAgICAgdGhpcy5hZGRNb2RhbENsYXNzZXMoaW5mbyk7XG4gICAgICAgIGlmIChpbmZvLnNldHRpbmdzLnBvc2l0aW9uU3RyYXRlZ3kuc2V0dGluZ3Mub3BlbkFuaW1hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wbGF5T3BlbkFuaW1hdGlvbihpbmZvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICB0byBlbGltaW5hdGUgZmxpY2tlcmluZyBzaG93IHRoZSBlbGVtZW50IGp1c3QgYmVmb3JlIG9wZW5lZCBmaXJlc1xuICAgICAgICAgICAgaW5mby53cmFwcGVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XG4gICAgICAgICAgICBpbmZvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vcGVuZWQuZW1pdCh7IGlkOiBpbmZvLmlkLCBjb21wb25lbnRSZWY6IGluZm8uY29tcG9uZW50UmVmIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZXMgdGhlIGNvbXBvbmVudCB3aXRoIHRoZSBJRCBwcm92aWRlZCBhcyBhIHBhcmFtZXRlci5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogdGhpcy5vdmVybGF5LmhpZGUoaWQpO1xuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHB1YmxpYyBoaWRlKGlkOiBzdHJpbmcsIGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5faGlkZShpZCwgZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGVzIGFsbCB0aGUgY29tcG9uZW50cyBhbmQgdGhlIG92ZXJsYXkuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMub3ZlcmxheS5oaWRlQWxsKCk7XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcHVibGljIGhpZGVBbGwoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9vdmVybGF5SW5mb3MubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5fb3ZlcmxheUluZm9zW2ldLmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcG9zaXRpb25zIHRoZSBjb21wb25lbnQgd2l0aCBJRCBwcm92aWRlZCBhcyBhIHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBJZCB0byByZXBvc2l0aW9uIG92ZXJsYXkgZm9yXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMub3ZlcmxheS5yZXBvc2l0aW9uKGlkKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVwb3NpdGlvbihpZDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IG92ZXJsYXlJbmZvID0gdGhpcy5nZXRPdmVybGF5QnlJZChpZCk7XG4gICAgICAgIGlmICghb3ZlcmxheUluZm8gfHwgIW92ZXJsYXlJbmZvLnNldHRpbmdzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdXcm9uZyBpZCBwcm92aWRlZCBpbiBvdmVybGF5LnJlcG9zaXRpb24gbWV0aG9kLiBJZDogJyArIGlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW92ZXJsYXlJbmZvLnZpc2libGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250ZW50RWxlbWVudCA9IG92ZXJsYXlJbmZvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICBjb25zdCBjb250ZW50RWxlbWVudFJlY3QgPSBjb250ZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgb3ZlcmxheUluZm8uc2V0dGluZ3MucG9zaXRpb25TdHJhdGVneS5wb3NpdGlvbihcbiAgICAgICAgICAgIGNvbnRlbnRFbGVtZW50LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBjb250ZW50RWxlbWVudFJlY3Qud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBjb250ZW50RWxlbWVudFJlY3QuaGVpZ2h0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIG92ZXJsYXlJbmZvLnNldHRpbmdzLnRhcmdldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT2Zmc2V0cyB0aGUgY29udGVudCBhbG9uZyB0aGUgY29ycmVzcG9uZGluZyBheGlzIGJ5IHRoZSBwcm92aWRlZCBhbW91bnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBJZCB0byBvZmZzZXQgb3ZlcmxheSBmb3JcbiAgICAgKiBAcGFyYW0gZGVsdGFYIEFtb3VudCBvZiBvZmZzZXQgaW4gaG9yaXpvbnRhbCBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0gZGVsdGFZIEFtb3VudCBvZiBvZmZzZXQgaW4gdmVydGljYWwgZGlyZWN0aW9uXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIHRoaXMub3ZlcmxheS5zZXRPZmZzZXQoaWQsIGRlbHRhWCwgZGVsdGFZKTtcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0T2Zmc2V0KGlkOiBzdHJpbmcsIGRlbHRhWDogbnVtYmVyLCBkZWx0YVk6IG51bWJlcikge1xuICAgICAgICBjb25zdCBpbmZvOiBPdmVybGF5SW5mbyA9IHRoaXMuZ2V0T3ZlcmxheUJ5SWQoaWQpO1xuXG4gICAgICAgIGlmICghaW5mbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5mby50cmFuc2Zvcm1YICs9IGRlbHRhWDtcbiAgICAgICAgaW5mby50cmFuc2Zvcm1ZICs9IGRlbHRhWTtcblxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1YID0gaW5mby50cmFuc2Zvcm1YO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1ZID0gaW5mby50cmFuc2Zvcm1ZO1xuXG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHt0cmFuc2Zvcm1YfXB4LCAke3RyYW5zZm9ybVl9cHgpYDtcbiAgICAgICAgaW5mby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2xhdGU7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwdWJsaWMgcmVwb3NpdGlvbkFsbCA9ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX292ZXJsYXlJbmZvcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgIHRoaXMucmVwb3NpdGlvbih0aGlzLl9vdmVybGF5SW5mb3NbaV0uaWQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwdWJsaWMgZ2V0T3ZlcmxheUJ5SWQoaWQ6IHN0cmluZyk6IE92ZXJsYXlJbmZvIHtcbiAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fb3ZlcmxheUluZm9zLmZpbmQoZSA9PiBlLmlkID09PSBpZCk7XG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2hpZGUoaWQ6IHN0cmluZywgZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICBjb25zdCBpbmZvOiBPdmVybGF5SW5mbyA9IHRoaXMuZ2V0T3ZlcmxheUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIWluZm8pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignaWd4T3ZlcmxheS5oaWRlIHdhcyBjYWxsZWQgd2l0aCB3cm9uZyBpZDogJywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2ZW50QXJnczogT3ZlcmxheUNsb3NpbmdFdmVudEFyZ3MgPSB7IGlkLCBjb21wb25lbnRSZWY6IGluZm8uY29tcG9uZW50UmVmLCBjYW5jZWw6IGZhbHNlLCBldmVudCB9O1xuICAgICAgICB0aGlzLmNsb3NpbmcuZW1pdChldmVudEFyZ3MpO1xuICAgICAgICBpZiAoZXZlbnRBcmdzLmNhbmNlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlTW9kYWxDbGFzc2VzKGluZm8pO1xuICAgICAgICBpZiAoaW5mby5zZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5LnNldHRpbmdzLmNsb3NlQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlDbG9zZUFuaW1hdGlvbihpbmZvLCBldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlRG9uZShpbmZvKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3ZlcmxheUluZm8oY29tcG9uZW50OiBhbnksIG1vZHVsZVJlZj86IFBpY2s8TmdNb2R1bGVSZWY8YW55PiwgJ2luamVjdG9yJyB8ICdjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXInPik6IE92ZXJsYXlJbmZvIHtcbiAgICAgICAgY29uc3QgaW5mbzogT3ZlcmxheUluZm8gPSB7IG5nWm9uZTogdGhpcy5fem9uZSwgdHJhbnNmb3JtWDogMCwgdHJhbnNmb3JtWTogMCB9O1xuICAgICAgICBpZiAoY29tcG9uZW50IGluc3RhbmNlb2YgRWxlbWVudFJlZikge1xuICAgICAgICAgICAgaW5mby5lbGVtZW50UmVmID0gY29tcG9uZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGR5bmFtaWNGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT47XG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5UmVzb2x2ZXIgPSBtb2R1bGVSZWYgPyBtb2R1bGVSZWYuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyIDogdGhpcy5fZmFjdG9yeVJlc29sdmVyO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkeW5hbWljRmFjdG9yeSA9IGZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb21wb25lbnQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaW5qZWN0b3IgPSBtb2R1bGVSZWYgPyBtb2R1bGVSZWYuaW5qZWN0b3IgOiB0aGlzLl9pbmplY3RvcjtcbiAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNDb21wb25lbnQ6IENvbXBvbmVudFJlZjxhbnk+ID0gZHluYW1pY0ZhY3RvcnkuY3JlYXRlKGluamVjdG9yKTtcbiAgICAgICAgICAgIGlmIChkeW5hbWljQ29tcG9uZW50Lm9uRGVzdHJveSkge1xuICAgICAgICAgICAgICAgIGR5bmFtaWNDb21wb25lbnQub25EZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmZvLmRldGFjaGVkICYmIHRoaXMuX292ZXJsYXlJbmZvcy5pbmRleE9mKGluZm8pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goaW5mby5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYXBwUmVmLmF0dGFjaFZpZXcoZHluYW1pY0NvbXBvbmVudC5ob3N0Vmlldyk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5ld2x5IGNyZWF0ZWQgZnJvbSBhIENvbXBvbmVudCwgaXQgaXMgd3JhcHBlZCBpbiAnbmctY29tcG9uZW50JyB0YWcgLSB3ZSBkbyBub3Qgd2FudCB0aGF0LlxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGR5bmFtaWNDb21wb25lbnQubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICAgIGluZm8uZWxlbWVudFJlZiA9IHsgbmF0aXZlRWxlbWVudDogZWxlbWVudCB9O1xuICAgICAgICAgICAgaW5mby5jb21wb25lbnRSZWYgPSBkeW5hbWljQ29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwbGFjZUVsZW1lbnRIb29rKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgICAgICBpZiAoIWVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBob29rID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhvb2suc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShob29rLCBlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIGhvb2s7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3ZlRWxlbWVudFRvT3ZlcmxheShpbmZvOiBPdmVybGF5SW5mbykge1xuICAgICAgICBpbmZvLndyYXBwZXJFbGVtZW50ID0gdGhpcy5nZXRXcmFwcGVyRWxlbWVudCgpO1xuICAgICAgICBjb25zdCBjb250ZW50RWxlbWVudCA9IHRoaXMuZ2V0Q29udGVudEVsZW1lbnQoaW5mby53cmFwcGVyRWxlbWVudCwgaW5mby5zZXR0aW5ncy5tb2RhbCk7XG4gICAgICAgIHRoaXMuZ2V0T3ZlcmxheUVsZW1lbnQoaW5mbykuYXBwZW5kQ2hpbGQoaW5mby53cmFwcGVyRWxlbWVudCk7XG4gICAgICAgIGNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKGluZm8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFdyYXBwZXJFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3Qgd3JhcHBlcjogSFRNTEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpZ3gtb3ZlcmxheV9fd3JhcHBlcicpO1xuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbnRlbnRFbGVtZW50KHdyYXBwZXJFbGVtZW50OiBIVE1MRWxlbWVudCwgbW9kYWw6IGJvb2xlYW4pOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGlmIChtb2RhbCkge1xuICAgICAgICAgICAgY29udGVudC5jbGFzc0xpc3QuYWRkKCdpZ3gtb3ZlcmxheV9fY29udGVudC0tbW9kYWwnKTtcbiAgICAgICAgICAgIGNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXY6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnaWd4LW92ZXJsYXlfX2NvbnRlbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKGV2OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICBoaWRlIGVsZW1lbnQgdG8gZWxpbWluYXRlIGZsaWNrZXJpbmcuIFNob3cgdGhlIGVsZW1lbnQgZXhhY3RseSBiZWZvcmUgYW5pbWF0aW9uIHN0YXJ0c1xuICAgICAgICB3cmFwcGVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cbiAgICAgICAgd3JhcHBlckVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3ZlcmxheUVsZW1lbnQoaW5mbzogT3ZlcmxheUluZm8pOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIGlmIChpbmZvLnNldHRpbmdzLm91dGxldCkge1xuICAgICAgICAgICAgcmV0dXJuIGluZm8uc2V0dGluZ3Mub3V0bGV0Lm5hdGl2ZUVsZW1lbnQgfHwgaW5mby5zZXR0aW5ncy5vdXRsZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9vdmVybGF5RWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuX292ZXJsYXlFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lneC1vdmVybGF5Jyk7XG4gICAgICAgICAgICB0aGlzLl9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX292ZXJsYXlFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5RWxlbWVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNpemUoaW5mbzogT3ZlcmxheUluZm8pIHtcbiAgICAgICAgaWYgKGluZm8uY29tcG9uZW50UmVmKSB7XG4gICAgICAgICAgICAvLyAgaWYgd2UgYXJlIHBvc2l0aW9uaW5nIGNvbXBvbmVudCB0aGlzIGlzIGZpcnN0IHRpbWUgaXQgZ2V0cyB2aXNpYmxlXG4gICAgICAgICAgICAvLyAgYW5kIHdlIGNhbiBmaW5hbGx5IGdldCBpdHMgc2l6ZVxuICAgICAgICAgICAgaW5mby5jb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgaW5mby5pbml0aWFsU2l6ZSA9IGluZm8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IGNvbnRlbnQgZGl2IHdpZHRoIG9ubHkgaWYgZWxlbWVudCB0byBzaG93IGhhcyB3aWR0aFxuICAgICAgICBpZiAoaW5mby5pbml0aWFsU2l6ZS53aWR0aCAhPT0gMCkge1xuICAgICAgICAgICAgaW5mby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS53aWR0aCA9IGluZm8uaW5pdGlhbFNpemUud2lkdGggKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbG9zZURvbmUoaW5mbzogT3ZlcmxheUluZm8pIHtcbiAgICAgICAgaW5mby52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGlmIChpbmZvLndyYXBwZXJFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyB0byBlbGltaW5hdGUgZmxpY2tlcmluZyBzaG93IHRoZSBlbGVtZW50IGp1c3QgYmVmb3JlIGFuaW1hdGlvbiBzdGFydFxuICAgICAgICAgICAgaW5mby53cmFwcGVyRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpbmZvLmNsb3NlQW5pbWF0aW9uRGV0YWNoaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KHsgaWQ6IGluZm8uaWQsIGNvbXBvbmVudFJlZjogaW5mby5jb21wb25lbnRSZWYsIGV2ZW50OiBpbmZvLmV2ZW50IH0pO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBpbmZvLmV2ZW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYW5VcChpbmZvOiBPdmVybGF5SW5mbykge1xuICAgICAgICBjb25zdCBjaGlsZDogSFRNTEVsZW1lbnQgPSBpbmZvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgb3V0bGV0ID0gdGhpcy5nZXRPdmVybGF5RWxlbWVudChpbmZvKTtcbiAgICAgICAgLy8gaWYgc2FtZSBlbGVtZW50IGlzIHNob3duIGluIG90aGVyIG92ZXJsYXkgb3V0bGV0IHdpbGwgbm90IGNvbnRhaW5cbiAgICAgICAgLy8gdGhlIGVsZW1lbnQgYW5kIHdlIHNob3VsZCBub3QgcmVtb3ZlIGl0IGZvcm0gb3V0bGV0XG4gICAgICAgIGlmIChvdXRsZXQuY29udGFpbnMoY2hpbGQpKSB7XG4gICAgICAgICAgICBvdXRsZXQucmVtb3ZlQ2hpbGQoY2hpbGQucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5jb21wb25lbnRSZWYpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcFJlZi5kZXRhY2hWaWV3KGluZm8uY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcbiAgICAgICAgICAgIGluZm8uY29tcG9uZW50UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGRlbGV0ZSBpbmZvLmNvbXBvbmVudFJlZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5ob29rKSB7XG4gICAgICAgICAgICBpbmZvLmhvb2sucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoaW5mby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGluZm8uaG9vayk7XG4gICAgICAgICAgICBpbmZvLmhvb2sucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpbmZvLmhvb2spO1xuICAgICAgICAgICAgZGVsZXRlIGluZm8uaG9vaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fb3ZlcmxheUluZm9zLmluZGV4T2YoaW5mbyk7XG4gICAgICAgIHRoaXMuX292ZXJsYXlJbmZvcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIC8vIHRoaXMuX292ZXJsYXlFbGVtZW50LnBhcmVudEVsZW1lbnQgY2hlY2sganVzdCBmb3IgdGVzdHMgdGhhdCBtYW51YWxseSBkZWxldGUgdGhlIGVsZW1lbnRcbiAgICAgICAgaWYgKHRoaXMuX292ZXJsYXlJbmZvcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vdmVybGF5RWxlbWVudCAmJiB0aGlzLl9vdmVybGF5RWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbG9zZU9uRXNjYXBlTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFuIGFsbCB0aGUgcmVzb3VyY2VzIGF0dGFjaGVkIHRvIGluZm9cbiAgICAgICAgZGVsZXRlIGluZm8uZWxlbWVudFJlZjtcbiAgICAgICAgZGVsZXRlIGluZm8uc2V0dGluZ3M7XG4gICAgICAgIGRlbGV0ZSBpbmZvLmluaXRpYWxTaXplO1xuICAgICAgICBpbmZvLm9wZW5BbmltYXRpb25EZXRhY2hpbmcgPSB0cnVlO1xuICAgICAgICBpbmZvLm9wZW5BbmltYXRpb25QbGF5ZXI/LmRlc3Ryb3koKTtcbiAgICAgICAgZGVsZXRlIGluZm8ub3BlbkFuaW1hdGlvblBsYXllcjtcbiAgICAgICAgZGVsZXRlIGluZm8ub3BlbkFuaW1hdGlvbklubmVyUGxheWVyO1xuICAgICAgICBpbmZvLmNsb3NlQW5pbWF0aW9uRGV0YWNoaW5nID0gdHJ1ZTtcbiAgICAgICAgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllcj8uZGVzdHJveSgpO1xuICAgICAgICBkZWxldGUgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllcjtcbiAgICAgICAgZGVsZXRlIGluZm8uY2xvc2VBbmltYXRpb25Jbm5lclBsYXllcjtcbiAgICAgICAgZGVsZXRlIGluZm8ubmdab25lO1xuICAgICAgICBkZWxldGUgaW5mby53cmFwcGVyRWxlbWVudDtcbiAgICAgICAgaW5mbyA9IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwbGF5T3BlbkFuaW1hdGlvbihpbmZvOiBPdmVybGF5SW5mbykge1xuICAgICAgICAvLyAgaWYgdGhlcmUgaXMgb3BlbmluZyBhbmltYXRpb24gYWxyZWFkeSBzdGFydGVkIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKGluZm8ub3BlbkFuaW1hdGlvblBsYXllciA9PSBudWxsIHx8IGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICBpZiB0aGVyZSBpcyBjbG9zaW5nIGFuaW1hdGlvbiBhbHJlYWR5IHN0YXJ0ZWQgc3RhcnQgb3BlbiBhbmltYXRpb24gZnJvbSB3aGVyZSBjbG9zZSBvbmUgaGFzIHJlYWNoZWRcbiAgICAgICAgLy8gIGFuZCByZXNldCBjbG9zZSBhbmltYXRpb25cbiAgICAgICAgaWYgKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXI/Lmhhc1N0YXJ0ZWQoKSkge1xuICAgICAgICAgICAgLy8gIGdldFBvc2l0aW9uKCkgcmV0dXJucyB3aGF0IHBhcnQgb2YgdGhlIGFuaW1hdGlvbiBpcyBwYXNzZWQsIGUuZy4gMC41IGlmIGhhbGYgdGhlIGFuaW1hdGlvblxuICAgICAgICAgICAgLy8gIGlzIGRvbmUsIDAuNzUgaWYgMy80IG9mIHRoZSBhbmltYXRpb24gaXMgZG9uZS4gQXMgd2UgbmVlZCB0byBzdGFydCBuZXh0IGFuaW1hdGlvbiBmcm9tIHdoZXJlXG4gICAgICAgICAgICAvLyAgdGhlIHByZXZpb3VzIGhhcyBmaW5pc2hlZCB3ZSBuZWVkIHRoZSBhbW91bnQgdXAgdG8gMSwgdGhlcmVmb3JlIHdlIGFyZSBzdWJ0cmFjdGluZyB3aGF0XG4gICAgICAgICAgICAvLyAgZ2V0UG9zaXRpb24oKSByZXR1cm5zIGZyb20gb25lXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IDEgLSBpbmZvLmNsb3NlQW5pbWF0aW9uSW5uZXJQbGF5ZXIuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIC8vIGNhbGxpbmcgcmVzZXQgZG9lcyBub3QgY2hhbmdlIGhhc1N0YXJ0ZWQgdG8gZmFsc2UuIFRoaXMgaXMgd2h5IHdlIGFyZSBkb2luZyBpdCBoZXIgdmlhIGludGVybmFsIGZpZWxkXG4gICAgICAgICAgICAoaW5mby5jbG9zZUFuaW1hdGlvblBsYXllciBhcyBhbnkpLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpbmZvLm9wZW5BbmltYXRpb25QbGF5ZXIuaW5pdCgpO1xuICAgICAgICAgICAgaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhcnRpbmcuZW1pdCh7IGlkOiBpbmZvLmlkLCBhbmltYXRpb25QbGF5ZXI6IGluZm8ub3BlbkFuaW1hdGlvblBsYXllciwgYW5pbWF0aW9uVHlwZTogJ29wZW4nIH0pO1xuXG4gICAgICAgIC8vICB0byBlbGltaW5hdGUgZmxpY2tlcmluZyBzaG93IHRoZSBlbGVtZW50IGp1c3QgYmVmb3JlIGFuaW1hdGlvbiBzdGFydFxuICAgICAgICBpbmZvLndyYXBwZXJFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcbiAgICAgICAgaW5mby52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlDbG9zZUFuaW1hdGlvbihpbmZvOiBPdmVybGF5SW5mbywgZXZlbnQ/OiBFdmVudCkge1xuICAgICAgICAvLyAgaWYgdGhlcmUgaXMgY2xvc2luZyBhbmltYXRpb24gYWxyZWFkeSBzdGFydGVkIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIgPT0gbnVsbCB8fCBpbmZvLmNsb3NlQW5pbWF0aW9uUGxheWVyLmhhc1N0YXJ0ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gIGlmIHRoZXJlIGlzIG9wZW5pbmcgYW5pbWF0aW9uIGFscmVhZHkgc3RhcnRlZCBzdGFydCBjbG9zZSBhbmltYXRpb24gZnJvbSB3aGVyZSBvcGVuIG9uZSBoYXMgcmVhY2hlZFxuICAgICAgICAvLyAgYW5kIHJlbW92ZSBvcGVuIGFuaW1hdGlvblxuICAgICAgICBpZiAoaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyPy5oYXNTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIC8vICBnZXRQb3NpdGlvbigpIHJldHVybnMgd2hhdCBwYXJ0IG9mIHRoZSBhbmltYXRpb24gaXMgcGFzc2VkLCBlLmcuIDAuNSBpZiBoYWxmIHRoZSBhbmltYXRpb25cbiAgICAgICAgICAgIC8vICBpcyBkb25lLCAwLjc1IGlmIDMvNCBvZiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUuIEFzIHdlIG5lZWQgdG8gc3RhcnQgbmV4dCBhbmltYXRpb24gZnJvbSB3aGVyZVxuICAgICAgICAgICAgLy8gIHRoZSBwcmV2aW91cyBoYXMgZmluaXNoZWQgd2UgbmVlZCB0aGUgYW1vdW50IHVwIHRvIDEsIHRoZXJlZm9yZSB3ZSBhcmUgc3VidHJhY3Rpbmcgd2hhdFxuICAgICAgICAgICAgLy8gIGdldFBvc2l0aW9uKCkgcmV0dXJucyBmcm9tIG9uZVxuICAgICAgICAgICAgLy8gIFRPRE86IFRoaXMgYXNzdW1lcyBvcGVuaW5nIGFuZCBjbG9zaW5nIGFuaW1hdGlvbnMgYXJlIG1pcnJvcmVkLlxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSAxIC0gaW5mby5vcGVuQW5pbWF0aW9uSW5uZXJQbGF5ZXIuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5yZXNldCgpO1xuICAgICAgICAgICAgLy8gY2FsbGluZyByZXNldCBkb2VzIG5vdCBjaGFuZ2UgaGFzU3RhcnRlZCB0byBmYWxzZS4gVGhpcyBpcyB3aHkgd2UgYXJlIGRvaW5nIGl0IGhlciB2aWEgaW50ZXJuYWwgZmllbGRcbiAgICAgICAgICAgIChpbmZvLm9wZW5BbmltYXRpb25QbGF5ZXIgYXMgYW55KS5fc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllci5pbml0KCk7XG4gICAgICAgICAgICBpbmZvLmNsb3NlQW5pbWF0aW9uUGxheWVyLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhcnRpbmcuZW1pdCh7IGlkOiBpbmZvLmlkLCBhbmltYXRpb25QbGF5ZXI6IGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIsIGFuaW1hdGlvblR5cGU6ICdjbG9zZScgfSk7XG4gICAgICAgIGluZm8uZXZlbnQgPSBldmVudDtcbiAgICAgICAgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllci5wbGF5KCk7XG4gICAgfVxuXG4gICAgLy8gIFRPRE86IGNoZWNrIGlmIGFwcGx5QW5pbWF0aW9uUGFyYW1zIHdpbGwgd29yayB3aXRoIGNvbXBsZXggYW5pbWF0aW9uc1xuICAgIHByaXZhdGUgYXBwbHlBbmltYXRpb25QYXJhbXMod3JhcHBlckVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhbmltYXRpb25PcHRpb25zOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSkge1xuICAgICAgICBpZiAoIWFuaW1hdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgICAgIHdyYXBwZXJFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9ICcwbXMnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYW5pbWF0aW9uT3B0aW9ucy5vcHRpb25zIHx8ICFhbmltYXRpb25PcHRpb25zLm9wdGlvbnMucGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyYW1zID0gYW5pbWF0aW9uT3B0aW9ucy5vcHRpb25zLnBhcmFtcyBhcyBJQW5pbWF0aW9uUGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICB3cmFwcGVyRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBwYXJhbXMuZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmFtcy5lYXNpbmcpIHtcbiAgICAgICAgICAgIHdyYXBwZXJFbGVtZW50LnN0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbiA9IHBhcmFtcy5lYXNpbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRvY3VtZW50Q2xpY2tlZCA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAvLyAgaWYgd2UgZ2V0IHRvIG1vZGFsIG92ZXJsYXkganVzdCByZXR1cm4gLSB3ZSBzaG91bGQgbm90IGNsb3NlIGFueXRoaW5nIHVuZGVyIGl0XG4gICAgICAgIC8vICBpZiB3ZSBnZXQgdG8gbm9uLW1vZGFsIG92ZXJsYXkgZG8gdGhlIG5leHQ6XG4gICAgICAgIC8vICAgMS4gQ2hlY2sgaXQgaGFzIGNsb3NlIG9uIG91dHNpZGUgY2xpY2suIElmIG5vdCBnbyBvbiB0byBuZXh0IG92ZXJsYXk7XG4gICAgICAgIC8vICAgMi4gSWYgdHJ1ZSBjaGVjayBpZiBjbGljayBpcyBvbiB0aGUgZWxlbWVudC4gSWYgaXQgaXMgb24gdGhlIGVsZW1lbnQgd2UgaGF2ZSBjbG9zZWRcbiAgICAgICAgLy8gIGFscmVhZHkgYWxsIHByZXZpb3VzIG5vbi1tb2RhbCB3aXRoIGNsb3NlIG9uIG91dHNpZGUgY2xpY2sgZWxlbWVudHMsIHNvIHdlIHJldHVybi4gSWZcbiAgICAgICAgLy8gIG5vdCBjbG9zZSB0aGUgb3ZlcmxheSBhbmQgY2hlY2sgbmV4dFxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fb3ZlcmxheUluZm9zLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuX292ZXJsYXlJbmZvc1tpXTtcbiAgICAgICAgICAgIGlmIChpbmZvLnNldHRpbmdzLm1vZGFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZm8uc2V0dGluZ3MuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2LmNvbXBvc2VkID8gZXYuY29tcG9zZWRQYXRoKClbMF0gOiBldi50YXJnZXQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3ZlcmxheUVsZW1lbnQgPSBpbmZvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgY2xpY2sgaXMgb24gdGhlIG92ZXJsYXkgZWxlbWVudCBvciBvbiBhbiBlbGVtZW50IGZyb20gdGhlIGV4Y2x1c2lvbiBsaXN0LCBhbmQgaWYgc28gZG8gbm90IGNsb3NlIHRoZSBvdmVybGF5XG4gICAgICAgICAgICAgICAgY29uc3QgZXhjbHVkZUVsZW1lbnRzID0gaW5mby5zZXR0aW5ncy5leGNsdWRlRnJvbU91dHNpZGVDbGljayA/XG4gICAgICAgICAgICAgICAgICAgIFsuLi5pbmZvLnNldHRpbmdzLmV4Y2x1ZGVGcm9tT3V0c2lkZUNsaWNrLCBvdmVybGF5RWxlbWVudF0gOiBbb3ZlcmxheUVsZW1lbnRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5zaWRlQ2xpY2s6IGJvb2xlYW4gPSBleGNsdWRlRWxlbWVudHMuc29tZShlID0+IGUuY29udGFpbnModGFyZ2V0IGFzIE5vZGUpKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbnNpZGVDbGljaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIC8vICBpZiB0aGUgY2xpY2sgaXMgb3V0c2lkZSBjbGljaywgYnV0IGNsb3NlIGFuaW1hdGlvbiBoYXMgc3RhcnRlZCBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIgJiYgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZGUoaW5mby5pZCwgZXYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIGFkZE91dHNpZGVDbGlja0xpc3RlbmVyKGluZm86IE92ZXJsYXlJbmZvKSB7XG4gICAgICAgIGlmIChpbmZvLnNldHRpbmdzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLnNldHRpbmdzLm1vZGFsKSB7XG4gICAgICAgICAgICAgICAgZnJvbUV2ZW50KGluZm8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCwgJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChlOiBFdmVudCkgPT4gdGhpcy5faGlkZShpbmZvLmlkLCBlKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIC8vICBpZiBhbGwgb3ZlcmxheXMgbWludXMgY2xvc2luZyBvdmVybGF5cyBlcXVhbHMgb25lIGFkZCB0aGUgaGFuZGxlclxuICAgICAgICAgICAgICAgIHRoaXMuX292ZXJsYXlJbmZvcy5maWx0ZXIoeCA9PiB4LnNldHRpbmdzLmNsb3NlT25PdXRzaWRlQ2xpY2sgJiYgIXguc2V0dGluZ3MubW9kYWwpLmxlbmd0aCAtXG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUluZm9zLmZpbHRlcih4ID0+IHguc2V0dGluZ3MuY2xvc2VPbk91dHNpZGVDbGljayAmJiAheC5zZXR0aW5ncy5tb2RhbCAmJlxuICAgICAgICAgICAgICAgICAgICB4LmNsb3NlQW5pbWF0aW9uUGxheWVyICYmXG4gICAgICAgICAgICAgICAgICAgIHguY2xvc2VBbmltYXRpb25QbGF5ZXIuaGFzU3RhcnRlZCgpKS5sZW5ndGggPT09IDEpIHtcblxuICAgICAgICAgICAgICAgIC8vIGNsaWNrIGV2ZW50IGlzIG5vdCBmaXJlZCBvbiBpT1MuIFRvIG1ha2UgZWxlbWVudCBcImNsaWNrYWJsZVwiIHdlIGFyZVxuICAgICAgICAgICAgICAgIC8vIHNldHRpbmcgdGhlIGN1cnNvciB0byBwb2ludGVyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxhdGZvcm1VdGlsLmlzSU9TICYmICF0aGlzLl9jdXJzb3JTdHlsZUlzU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvck9yaWdpbmFsVmFsdWUgPSB0aGlzLl9kb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvclN0eWxlSXNTZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrZWQsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVPdXRzaWRlQ2xpY2tMaXN0ZW5lcihpbmZvOiBPdmVybGF5SW5mbykge1xuICAgICAgICBpZiAoaW5mby5zZXR0aW5ncy5tb2RhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGxldCBzaG91bGRSZW1vdmVDbGlja0V2ZW50TGlzdGVuZXIgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUluZm9zLmZvckVhY2gobyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG8uc2V0dGluZ3MubW9kYWwgPT09IGZhbHNlICYmIG8uaWQgIT09IGluZm8uaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVtb3ZlQ2xpY2tFdmVudExpc3RlbmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzaG91bGRSZW1vdmVDbGlja0V2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3Vyc29yU3R5bGVJc1NldCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IHRoaXMuX2N1cnNvck9yaWdpbmFsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvck9yaWdpbmFsVmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yU3R5bGVJc1NldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRDbGlja2VkLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkUmVzaXplSGFuZGxlcigpIHtcbiAgICAgICAgY29uc3QgY2xvc2luZ092ZXJsYXlzQ291bnQgPVxuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUluZm9zXG4gICAgICAgICAgICAgICAgLmZpbHRlcihvID0+IG8uY2xvc2VBbmltYXRpb25QbGF5ZXIgJiYgby5jbG9zZUFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpXG4gICAgICAgICAgICAgICAgLmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuX292ZXJsYXlJbmZvcy5sZW5ndGggLSBjbG9zaW5nT3ZlcmxheXNDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnQuZGVmYXVsdFZpZXcuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXBvc2l0aW9uQWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlUmVzaXplSGFuZGxlcigpIHtcbiAgICAgICAgY29uc3QgY2xvc2luZ092ZXJsYXlzQ291bnQgPVxuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheUluZm9zXG4gICAgICAgICAgICAgICAgLmZpbHRlcihvID0+IG8uY2xvc2VBbmltYXRpb25QbGF5ZXIgJiYgby5jbG9zZUFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpXG4gICAgICAgICAgICAgICAgLmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuX292ZXJsYXlJbmZvcy5sZW5ndGggLSBjbG9zaW5nT3ZlcmxheXNDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnQuZGVmYXVsdFZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXBvc2l0aW9uQWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkQ2xvc2VPbkVzY2FwZUxpc3RlbmVyKGluZm86IE92ZXJsYXlJbmZvKSB7XG4gICAgICAgIGlmIChpbmZvLnNldHRpbmdzLmNsb3NlT25Fc2NhcGUgJiYgIXRoaXMuX2tleVByZXNzRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5fa2V5UHJlc3NFdmVudExpc3RlbmVyID0gZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAna2V5ZG93bicpLnBpcGUoXG4gICAgICAgICAgICAgICAgZmlsdGVyKChldjogS2V5Ym9hcmRFdmVudCkgPT4gZXYua2V5ID09PSAnRXNjYXBlJyB8fCBldi5rZXkgPT09ICdFc2MnKVxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmlzaWJsZU92ZXJsYXlzID0gdGhpcy5fb3ZlcmxheUluZm9zLmZpbHRlcihvID0+IG8udmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZpc2libGVPdmVybGF5cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0T3ZlcmxheUluZm8gPSB2aXNpYmxlT3ZlcmxheXNbdmlzaWJsZU92ZXJsYXlzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRPdmVybGF5SW5mby52aXNpYmxlICYmIHRhcmdldE92ZXJsYXlJbmZvLnNldHRpbmdzLmNsb3NlT25Fc2NhcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKHRhcmdldE92ZXJsYXlJbmZvLmlkLCBldik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUNsb3NlT25Fc2NhcGVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2tleVByZXNzRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5fa2V5UHJlc3NFdmVudExpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9rZXlQcmVzc0V2ZW50TGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRNb2RhbENsYXNzZXMoaW5mbzogT3ZlcmxheUluZm8pIHtcbiAgICAgICAgaWYgKGluZm8uc2V0dGluZ3MubW9kYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXJFbGVtZW50ID0gaW5mby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgd3JhcHBlckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaWd4LW92ZXJsYXlfX3dyYXBwZXInKTtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlBbmltYXRpb25QYXJhbXMod3JhcHBlckVsZW1lbnQsIGluZm8uc2V0dGluZ3MucG9zaXRpb25TdHJhdGVneS5zZXR0aW5ncy5vcGVuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd3JhcHBlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaWd4LW92ZXJsYXlfX3dyYXBwZXItLW1vZGFsJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTW9kYWxDbGFzc2VzKGluZm86IE92ZXJsYXlJbmZvKSB7XG4gICAgICAgIGlmIChpbmZvLnNldHRpbmdzLm1vZGFsKSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyRWxlbWVudCA9IGluZm8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlBbmltYXRpb25QYXJhbXMod3JhcHBlckVsZW1lbnQsIGluZm8uc2V0dGluZ3MucG9zaXRpb25TdHJhdGVneS5zZXR0aW5ncy5jbG9zZUFuaW1hdGlvbik7XG4gICAgICAgICAgICB3cmFwcGVyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpZ3gtb3ZlcmxheV9fd3JhcHBlci0tbW9kYWwnKTtcbiAgICAgICAgICAgIHdyYXBwZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lneC1vdmVybGF5X193cmFwcGVyJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGJ1aWxkQW5pbWF0aW9uUGxheWVycyhpbmZvOiBPdmVybGF5SW5mbykge1xuICAgICAgICBpZiAoaW5mby5zZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5LnNldHRpbmdzLm9wZW5BbmltYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbkJ1aWxkZXIgPSB0aGlzLmJ1aWxkZXIuYnVpbGQoaW5mby5zZXR0aW5ncy5wb3NpdGlvblN0cmF0ZWd5LnNldHRpbmdzLm9wZW5BbmltYXRpb24pO1xuICAgICAgICAgICAgaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyID0gYW5pbWF0aW9uQnVpbGRlci5jcmVhdGUoaW5mby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyAgQW5pbWF0aW9uUGxheWVyLmdldFBvc2l0aW9uIHJldHVybnMgYWx3YXlzIDAuIFRvIHdvcmthcm91bmQgdGhpcyB3ZSBhcmUgZ2V0dGluZyBpbm5lciBXZWJBbmltYXRpb25QbGF5ZXJcbiAgICAgICAgICAgIC8vICBhbmQgdGhlbiBnZXR0aW5nIHRoZSBwb3NpdGlvbnMgZnJvbSBpdC5cbiAgICAgICAgICAgIC8vICBUaGlzIGlzIGxvZ2dlZCBpbiBBbmd1bGFyIGhlcmUgLSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xODg5MVxuICAgICAgICAgICAgLy8gIEFzIHNvb24gYXMgdGhpcyBpcyByZXNvbHZlZCB3ZSBjYW4gcmVtb3ZlIHRoaXMgaGFja1xuICAgICAgICAgICAgY29uc3QgaW5uZXJSZW5kZXJlciA9IChpbmZvLm9wZW5BbmltYXRpb25QbGF5ZXIgYXMgYW55KS5fcmVuZGVyZXI7XG4gICAgICAgICAgICBpbmZvLm9wZW5BbmltYXRpb25Jbm5lclBsYXllciA9IGlubmVyUmVuZGVyZXIuZW5naW5lLnBsYXllcnNbaW5uZXJSZW5kZXJlci5lbmdpbmUucGxheWVycy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5vbkRvbmUoKCkgPT4gdGhpcy5vcGVuQW5pbWF0aW9uRG9uZShpbmZvKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZm8uc2V0dGluZ3MucG9zaXRpb25TdHJhdGVneS5zZXR0aW5ncy5jbG9zZUFuaW1hdGlvbikge1xuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uQnVpbGRlciA9IHRoaXMuYnVpbGRlci5idWlsZChpbmZvLnNldHRpbmdzLnBvc2l0aW9uU3RyYXRlZ3kuc2V0dGluZ3MuY2xvc2VBbmltYXRpb24pO1xuICAgICAgICAgICAgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllciA9IGFuaW1hdGlvbkJ1aWxkZXIuY3JlYXRlKGluZm8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gIEFuaW1hdGlvblBsYXllci5nZXRQb3NpdGlvbiByZXR1cm5zIGFsd2F5cyAwLiBUbyB3b3JrYXJvdW5kIHRoaXMgd2UgYXJlIGdldHRpbmcgaW5uZXIgV2ViQW5pbWF0aW9uUGxheWVyXG4gICAgICAgICAgICAvLyAgYW5kIHRoZW4gZ2V0dGluZyB0aGUgcG9zaXRpb25zIGZyb20gaXQuXG4gICAgICAgICAgICAvLyAgVGhpcyBpcyBsb2dnZWQgaW4gQW5ndWxhciBoZXJlIC0gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTg4OTFcbiAgICAgICAgICAgIC8vICBBcyBzb29uIGFzIHRoaXMgaXMgcmVzb2x2ZWQgd2UgY2FuIHJlbW92ZSB0aGlzIGhhY2tcbiAgICAgICAgICAgIGNvbnN0IGlubmVyUmVuZGVyZXIgPSAoaW5mby5jbG9zZUFuaW1hdGlvblBsYXllciBhcyBhbnkpLl9yZW5kZXJlcjtcbiAgICAgICAgICAgIGluZm8uY2xvc2VBbmltYXRpb25Jbm5lclBsYXllciA9IGlubmVyUmVuZGVyZXIuZW5naW5lLnBsYXllcnNbaW5uZXJSZW5kZXJlci5lbmdpbmUucGxheWVycy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIub25Eb25lKCgpID0+IHRoaXMuY2xvc2VBbmltYXRpb25Eb25lKGluZm8pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb3BlbkFuaW1hdGlvbkRvbmUoaW5mbzogT3ZlcmxheUluZm8pIHtcbiAgICAgICAgaWYgKCFpbmZvLm9wZW5BbmltYXRpb25EZXRhY2hpbmcpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbmVkLmVtaXQoeyBpZDogaW5mby5pZCwgY29tcG9uZW50UmVmOiBpbmZvLmNvbXBvbmVudFJlZiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyKSB7XG4gICAgICAgICAgICBpbmZvLm9wZW5BbmltYXRpb25QbGF5ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIC8vIGNhbGxpbmcgcmVzZXQgZG9lcyBub3QgY2hhbmdlIGhhc1N0YXJ0ZWQgdG8gZmFsc2UuIFRoaXMgaXMgd2h5IHdlIGFyZSBkb2luZyBpdCBoZXJlIHZpYSBpbnRlcm5hbCBmaWVsZFxuICAgICAgICAgICAgKGluZm8ub3BlbkFuaW1hdGlvblBsYXllciBhcyBhbnkpLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAvLyB3aGVuIGFuaW1hdGlvbiBmaW5pc2ggYW5ndWxhciBkZWxldGVzIGFsbCBvbkRvbmUgaGFuZGxlcnMgc28gd2UgbmVlZCB0byBhZGQgaXQgYWdhaW4gOihcbiAgICAgICAgICAgIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5vbkRvbmUoKCkgPT4gdGhpcy5vcGVuQW5pbWF0aW9uRG9uZShpbmZvKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIgJiYgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIC8vIGNhbGxpbmcgcmVzZXQgZG9lcyBub3QgY2hhbmdlIGhhc1N0YXJ0ZWQgdG8gZmFsc2UuIFRoaXMgaXMgd2h5IHdlIGFyZSBkb2luZyBpdCBoZXJlIHZpYSBpbnRlcm5hbCBmaWVsZFxuICAgICAgICAgICAgKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIgYXMgYW55KS5fc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbG9zZUFuaW1hdGlvbkRvbmUoaW5mbzogT3ZlcmxheUluZm8pIHtcbiAgICAgICAgaWYgKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIpIHtcbiAgICAgICAgICAgIGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIC8vIGNhbGxpbmcgcmVzZXQgZG9lcyBub3QgY2hhbmdlIGhhc1N0YXJ0ZWQgdG8gZmFsc2UuIFRoaXMgaXMgd2h5IHdlIGFyZSBkb2luZyBpdCBoZXJlIHZpYSBpbnRlcm5hbCBmaWVsZFxuICAgICAgICAgICAgKGluZm8uY2xvc2VBbmltYXRpb25QbGF5ZXIgYXMgYW55KS5fc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gd2hlbiBhbmltYXRpb24gZmluaXNoIGFuZ3VsYXIgZGVsZXRlcyBhbGwgb25Eb25lIGhhbmRsZXJzIHNvIHdlIG5lZWQgdG8gYWRkIGl0IGFnYWluIDooXG4gICAgICAgICAgICBpbmZvLmNsb3NlQW5pbWF0aW9uUGxheWVyLm9uRG9uZSgoKSA9PiB0aGlzLmNsb3NlQW5pbWF0aW9uRG9uZShpbmZvKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyICYmIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5yZXNldCgpO1xuICAgICAgICAgICAgLy8gY2FsbGluZyByZXNldCBkb2VzIG5vdCBjaGFuZ2UgaGFzU3RhcnRlZCB0byBmYWxzZS4gVGhpcyBpcyB3aHkgd2UgYXJlIGRvaW5nIGl0IGhlcmUgdmlhIGludGVybmFsIGZpZWxkXG4gICAgICAgICAgICAoaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyIGFzIGFueSkuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlRG9uZShpbmZvKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmlzaEFuaW1hdGlvbnMoaW5mbzogT3ZlcmxheUluZm8pIHtcbiAgICAgICAgLy8gVE9ETzogc2hvdWxkIHdlIGVtaXQgaGVyZSBvcGVuZWQgb3IgY2xvc2VkIGV2ZW50c1xuICAgICAgICBpZiAoaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyICYmIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5oYXNTdGFydGVkKCkpIHtcbiAgICAgICAgICAgIGluZm8ub3BlbkFuaW1hdGlvblBsYXllci5yZXNldCgpO1xuICAgICAgICAgICAgLy8gY2FsbGluZyByZXNldCBkb2VzIG5vdCBjaGFuZ2UgaGFzU3RhcnRlZCB0byBmYWxzZS4gVGhpcyBpcyB3aHkgd2UgYXJlIGRvaW5nIGl0IGhlcmUgdmlhIGludGVybmFsIGZpZWxkXG4gICAgICAgICAgICAoaW5mby5vcGVuQW5pbWF0aW9uUGxheWVyIGFzIGFueSkuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5mby5jbG9zZUFuaW1hdGlvblBsYXllciAmJiBpbmZvLmNsb3NlQW5pbWF0aW9uUGxheWVyLmhhc1N0YXJ0ZWQoKSkge1xuICAgICAgICAgICAgaW5mby5jbG9zZUFuaW1hdGlvblBsYXllci5yZXNldCgpO1xuICAgICAgICAgICAgLy8gY2FsbGluZyByZXNldCBkb2VzIG5vdCBjaGFuZ2UgaGFzU3RhcnRlZCB0byBmYWxzZS4gVGhpcyBpcyB3aHkgd2UgYXJlIGRvaW5nIGl0IGhlcmUgdmlhIGludGVybmFsIGZpZWxkXG4gICAgICAgICAgICAoaW5mby5jbG9zZUFuaW1hdGlvblBsYXllciBhcyBhbnkpLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=