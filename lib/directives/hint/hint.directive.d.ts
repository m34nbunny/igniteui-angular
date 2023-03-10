import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class IgxHintDirective implements OnInit {
    /**
     * Sets/gets whether the hint position is at the start.
     * Default value is `false`.
     * ```typescript
     * @ViewChild('hint', {read: IgxHintDirective})
     * public igxHint: IgxHintDirective;
     * this.igxHint.isPositionStart = true;
     * ```
     * ```typescript
     * let isHintPositionStart = this.igxHint.isPositionStart;
     * ```
     *
     * @memberof IgxHintDirective
     */
    isPositionStart: boolean;
    /**
     * Sets/gets whether the hint position is at the end.
     * Default value is `false`.
     * ```typescript
     * @ViewChild('hint', {read: IgxHintDirective})
     * public igxHint: IgxHintDirective;
     * this.igxHint.isPositionEnd = true;
     * ```
     * ```typescript
     * let isHintPositionEnd = this.igxHint.isPositionEnd;
     * ```
     *
     * @memberof IgxHintDirective
     */
    isPositionEnd: boolean;
    private _position;
    /**
     * Sets the position of the hint.
     * ```html
     * <igx-input-group>
     *  <input igxInput type="text"/>
     *  <igx-hint #hint [position]="'start'">IgxHint displayed at the start</igx-hint>
     * </igx-input-group>
     * ```
     *
     * @memberof IgxHintDirective
     */
    set position(value: string);
    /**
     * Gets the position of the hint.
     * ```typescript
     * @ViewChild('hint', {read: IgxHintDirective})
     * public igxHint: IgxHintDirective;
     * let hintPosition =  this.igxHint.position;
     * ```
     *
     * @memberof IgxHintDirective
     */
    get position(): string;
    /**
     * @hidden
     */
    ngOnInit(): void;
    private _applyPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<IgxHintDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IgxHintDirective, "igx-hint,[igxHint]", never, { "position": "position"; }, {}, never>;
}
