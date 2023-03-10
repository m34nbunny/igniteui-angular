import * as i0 from "@angular/core";
/**
 * Template directive that allows you to set a custom template representing the lower label value of the {@link IgxSliderComponent}
 *
 * ```html
 * <igx-slider>
 *  <ng-template igxSliderThumbFrom let-value let-labels>{{value}}</ng-template>
 * </igx-slider>
 * ```
 *
 * @context {@link IgxSliderComponent.context}
 */
export declare class IgxThumbFromTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxThumbFromTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxThumbFromTemplateDirective, "[igxSliderThumbFrom]", never, {}, {}, never>;
}
/**
 * Template directive that allows you to set a custom template representing the upper label value of the {@link IgxSliderComponent}
 *
 * ```html
 * <igx-slider>
 *  <ng-template igxSliderThumbTo let-value let-labels>{{value}}</ng-template>
 * </igx-slider>
 * ```
 *
 * @context {@link IgxSliderComponent.context}
 */
export declare class IgxThumbToTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxThumbToTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxThumbToTemplateDirective, "[igxSliderThumbTo]", never, {}, {}, never>;
}
/**
 * Template directive that allows you to set a custom template, represeting primary/secondary tick labels of the {@link IgxSliderComponent}
 *
 * @context {@link IgxTicksComponent.context}
 */
export declare class IgxTickLabelTemplateDirective {
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxTickLabelTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxTickLabelTemplateDirective, "[igxSliderTickLabel]", never, {}, {}, never>;
}
export interface IRangeSliderValue {
    lower: number;
    upper: number;
}
export interface ISliderValueChangeEventArgs {
    oldValue: number | IRangeSliderValue;
    value: number | IRangeSliderValue;
}
export declare const IgxSliderType: {
    /**
     * Slider with single thumb.
     */
    SLIDER: "slider";
    /**
     *  Range slider with multiple thumbs, that can mark the range.
     */
    RANGE: "range";
};
export declare type IgxSliderType = (typeof IgxSliderType)[keyof typeof IgxSliderType];
export declare const SliderHandle: {
    FROM: "from";
    TO: "to";
};
export declare type SliderHandle = (typeof SliderHandle)[keyof typeof SliderHandle];
/**
 * Slider Tick labels Orientation
 */
export declare const TickLabelsOrientation: {
    Horizontal: "horizontal";
    TopToBottom: "toptobottom";
    BottomToTop: "bottomtotop";
};
export declare type TickLabelsOrientation = (typeof TickLabelsOrientation)[keyof typeof TickLabelsOrientation];
/**
 * Slider Ticks orientation
 */
export declare const TicksOrientation: {
    Top: "top";
    Bottom: "bottom";
    Mirror: "mirror";
};
export declare type TicksOrientation = (typeof TicksOrientation)[keyof typeof TicksOrientation];
