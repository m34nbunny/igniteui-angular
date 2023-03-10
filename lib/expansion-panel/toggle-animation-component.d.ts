import { AnimationBuilder, AnimationPlayer, AnimationReferenceMetadata } from '@angular/animations';
import { ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**@hidden @internal */
export interface ToggleAnimationSettings {
    openAnimation: AnimationReferenceMetadata;
    closeAnimation: AnimationReferenceMetadata;
}
export interface ToggleAnimationOwner {
    animationSettings: ToggleAnimationSettings;
    openAnimationStart: EventEmitter<void>;
    openAnimationDone: EventEmitter<void>;
    closeAnimationStart: EventEmitter<void>;
    closeAnimationDone: EventEmitter<void>;
    openAnimationPlayer: AnimationPlayer;
    closeAnimationPlayer: AnimationPlayer;
    playOpenAnimation(element: ElementRef, onDone: () => void): void;
    playCloseAnimation(element: ElementRef, onDone: () => void): void;
}
/** @hidden @internal */
export declare enum ANIMATION_TYPE {
    OPEN = "open",
    CLOSE = "close"
}
/**@hidden @internal */
export declare abstract class ToggleAnimationPlayer implements ToggleAnimationOwner, OnDestroy {
    protected builder: AnimationBuilder;
    /** @hidden @internal */
    openAnimationDone: EventEmitter<void>;
    /** @hidden @internal */
    closeAnimationDone: EventEmitter<void>;
    /** @hidden @internal */
    openAnimationStart: EventEmitter<void>;
    /** @hidden @internal */
    closeAnimationStart: EventEmitter<void>;
    get animationSettings(): ToggleAnimationSettings;
    set animationSettings(value: ToggleAnimationSettings);
    /** @hidden @internal */
    openAnimationPlayer: AnimationPlayer;
    /** @hidden @internal */
    closeAnimationPlayer: AnimationPlayer;
    protected destroy$: Subject<void>;
    protected players: Map<string, AnimationPlayer>;
    protected _animationSettings: ToggleAnimationSettings;
    private closeInterrupted;
    private openInterrupted;
    private _defaultClosedCallback;
    private _defaultOpenedCallback;
    private onClosedCallback;
    private onOpenedCallback;
    constructor(builder: AnimationBuilder);
    /** @hidden @internal */
    playOpenAnimation(targetElement: ElementRef, onDone?: () => void): void;
    /** @hidden @internal */
    playCloseAnimation(targetElement: ElementRef, onDone?: () => void): void;
    ngOnDestroy(): void;
    private startPlayer;
    private initializePlayer;
    private onDoneHandler;
    private setCallback;
    private cleanUpPlayer;
    private getPlayer;
    static ??fac: i0.????FactoryDeclaration<ToggleAnimationPlayer, never>;
    static ??dir: i0.????DirectiveDeclaration<ToggleAnimationPlayer, never, never, {}, {}, never>;
}
