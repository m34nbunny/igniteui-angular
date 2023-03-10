import { AnimationReferenceMetadata } from '@angular/animations';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * @hidden
 */
export declare const showMessage: (message: string, isMessageShown: boolean) => boolean;
export declare const mkenum: <T extends {
    [index: string]: U;
}, U extends string>(x: T) => T;
/**
 *
 * @hidden @internal
 */
export declare const getResizeObserver: () => {
    new (callback: ResizeObserverCallback): ResizeObserver;
    prototype: ResizeObserver;
};
/**
 * @hidden
 */
export declare const cloneArray: (array: any[], deep?: boolean) => any[];
/**
 * Doesn't clone leaf items
 *
 * @hidden
 */
export declare const cloneHierarchicalArray: (array: any[], childDataKey: any) => any[];
/**
 * Creates an object with prototype from provided source and copies
 * all properties descriptors from provided source
 * @param obj Source to copy prototype and descriptors from
 * @returns New object with cloned prototype and property descriptors
 */
export declare const copyDescriptors: (obj: any) => any;
/**
 * Deep clones all first level keys of Obj2 and merges them to Obj1
 *
 * @param obj1 Object to merge into
 * @param obj2 Object to merge from
 * @returns Obj1 with merged cloned keys from Obj2
 * @hidden
 */
export declare const mergeObjects: (obj1: any, obj2: any) => any;
/**
 * Creates deep clone of provided value.
 * Supports primitive values, dates and objects.
 * If passed value is array returns shallow copy of the array.
 *
 * @param value value to clone
 * @returns Deep copy of provided value
 * @hidden
 */
export declare const cloneValue: (value: any) => any;
/**
 * Parse provided input to Date.
 *
 * @param value input to parse
 * @returns Date if parse succeed or null
 * @hidden
 */
export declare const parseDate: (value: any) => Date | null;
/**
 * Returns an array with unique dates only.
 *
 * @param columnValues collection of date values (might be numbers or ISO 8601 strings)
 * @returns collection of unique dates.
 * @hidden
 */
export declare const uniqueDates: (columnValues: any[]) => any;
/**
 * Checks if provided variable is Object
 *
 * @param value Value to check
 * @returns true if provided variable is Object
 * @hidden
 */
export declare const isObject: (value: any) => boolean;
/**
 * Checks if provided variable is Date
 *
 * @param value Value to check
 * @returns true if provided variable is Date
 * @hidden
 */
export declare const isDate: (value: any) => value is Date;
/**
 * Checks if the two passed arguments are equal
 * Currently supports date objects
 *
 * @param obj1
 * @param obj2
 * @returns: `boolean`
 * @hidden
 */
export declare const isEqual: (obj1: any, obj2: any) => boolean;
/**
 * Utility service taking care of various utility functions such as
 * detecting browser features, general cross browser DOM manipulation, etc.
 *
 * @hidden @internal
 */
export declare class PlatformUtil {
    private platformId;
    isBrowser: boolean;
    isIOS: boolean;
    isFirefox: boolean;
    isEdge: boolean;
    isChromium: boolean;
    KEYMAP: {
        ENTER: "Enter";
        SPACE: " ";
        ESCAPE: "Escape";
        ARROW_DOWN: "ArrowDown";
        ARROW_UP: "ArrowUp";
        ARROW_LEFT: "ArrowLeft";
        ARROW_RIGHT: "ArrowRight";
        END: "End";
        HOME: "Home";
        PAGE_DOWN: "PageDown";
        PAGE_UP: "PageUp";
        F2: "F2";
        TAB: "Tab";
        SEMICOLON: ";";
        DELETE: "Delete";
        BACKSPACE: "Backspace";
        CONTROL: "Control";
        X: "x";
        Y: "y";
        Z: "z";
    };
    constructor(platformId: any);
    /**
     * @hidden @internal
     * Returns the actual size of the node content, using Range
     * ```typescript
     * let range = document.createRange();
     * let column = this.grid.columnList.filter(c => c.field === 'ID')[0];
     *
     * let size = getNodeSizeViaRange(range, column.cells[0].nativeElement);
     *
     * @remarks
     * The last parameter is useful when the size of the element to measure is modified by a
     * parent element that has explicit size. In such cases the calculated size is never lower
     * and the function may instead remove the parent size while measuring to get the correct value.
     * ```
     */
    getNodeSizeViaRange(range: Range, node: HTMLElement, sizeHoldingNode?: HTMLElement): number;
    /**
     * Returns true if the current keyboard event is an activation key (Enter/Space bar)
     *
     * @hidden
     * @internal
     *
     * @memberof PlatformUtil
     */
    isActivationKey(event: KeyboardEvent): boolean;
    /**
     * Returns true if the current keyboard event is a combination that closes the filtering UI of the grid. (Escape/Ctrl+Shift+L)
     *
     * @hidden
     * @internal
     * @param event
     * @memberof PlatformUtil
     */
    isFilteringKeyCombo(event: KeyboardEvent): boolean;
    /**
     * @hidden @internal
     */
    isLeftClick(event: PointerEvent | MouseEvent): boolean;
    /**
     * @hidden @internal
     */
    isNavigationKey(key: string): boolean;
    static ??fac: i0.????FactoryDeclaration<PlatformUtil, never>;
    static ??prov: i0.????InjectableDeclaration<PlatformUtil>;
}
/**
 * @hidden
 */
export declare const flatten: (arr: any[]) => any[];
export interface CancelableEventArgs {
    /**
     * Provides the ability to cancel the event.
     */
    cancel: boolean;
}
export interface IBaseEventArgs {
    /**
     * Provides reference to the owner component.
     */
    owner?: any;
}
export interface CancelableBrowserEventArgs extends CancelableEventArgs {
    /** Browser event */
    event?: Event;
}
export interface IBaseCancelableBrowserEventArgs extends CancelableBrowserEventArgs, IBaseEventArgs {
}
export interface IBaseCancelableEventArgs extends CancelableEventArgs, IBaseEventArgs {
}
export declare const HORIZONTAL_NAV_KEYS: Set<string>;
export declare const NAVIGATION_KEYS: Set<string>;
export declare const ACCORDION_NAVIGATION_KEYS: Set<string>;
export declare const ROW_EXPAND_KEYS: Set<string>;
export declare const ROW_COLLAPSE_KEYS: Set<string>;
export declare const ROW_ADD_KEYS: Set<string>;
export declare const SUPPORTED_KEYS: Set<string>;
export declare const HEADER_KEYS: Set<string>;
/**
 * @hidden
 * @internal
 *
 * Creates a new ResizeObserver on `target` and returns it as an Observable.
 * Run the resizeObservable outside angular zone, because it patches the MutationObserver which causes an infinite loop.
 * Related issue: https://github.com/angular/angular/issues/31712
 */
export declare const resizeObservable: (target: HTMLElement) => Observable<ResizeObserverEntry[]>;
/**
 * @hidden
 * @internal
 *
 * Compares two maps.
 */
export declare const compareMaps: (map1: Map<any, any>, map2: Map<any, any>) => boolean;
/**
 *
 * Given a property access path in the format `x.y.z` resolves and returns
 * the value of the `z` property in the passed object.
 *
 * @hidden
 * @internal
 */
export declare const resolveNestedPath: (obj: any, path: string) => any;
/**
 *
 * Given a property access path in the format `x.y.z` and a value
 * this functions builds and returns an object following the access path.
 *
 * @example
 * ```typescript
 * console.log('x.y.z.', 42);
 * >> { x: { y: { z: 42 } } }
 * ```
 *
 * @hidden
 * @internal
 */
export declare const reverseMapper: (path: string, value: any) => {};
export declare const yieldingLoop: (count: number, chunkSize: number, callback: (index: number) => void, done: () => void) => void;
export declare const isConstructor: (ref: any) => boolean;
export declare const reverseAnimationResolver: (animation: AnimationReferenceMetadata) => AnimationReferenceMetadata;
export declare const isHorizontalAnimation: (animation: AnimationReferenceMetadata) => boolean;
export declare const isVerticalAnimation: (animation: AnimationReferenceMetadata) => boolean;
/**
 * Similar to Angular's formatDate. However it will not throw on `undefined | null` instead
 * coalescing to an empty string.
 */
export declare const formatDate: (value: string | number | Date, format: string, locale: string, timezone?: string) => string;
export declare const formatCurrency: {
    (value: string | number, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): string;
    (value: null, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): null;
    (value: string | number, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): string;
};
