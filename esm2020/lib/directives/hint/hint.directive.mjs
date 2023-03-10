import { Directive, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
var IgxHintPosition;
(function (IgxHintPosition) {
    IgxHintPosition[IgxHintPosition["START"] = 0] = "START";
    IgxHintPosition[IgxHintPosition["END"] = 1] = "END";
})(IgxHintPosition || (IgxHintPosition = {}));
export class IgxHintDirective {
    constructor() {
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
        this.isPositionStart = false;
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
        this.isPositionEnd = false;
        this._position = IgxHintPosition.START;
    }
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
    set position(value) {
        const position = IgxHintPosition[value.toUpperCase()];
        if (position !== undefined) {
            this._position = position;
            this._applyPosition(this._position);
        }
    }
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
    get position() {
        return this._position.toString();
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this._applyPosition(this._position);
    }
    _applyPosition(position) {
        this.isPositionStart = this.isPositionEnd = false;
        switch (position) {
            case IgxHintPosition.START:
                this.isPositionStart = true;
                break;
            case IgxHintPosition.END:
                this.isPositionEnd = true;
                break;
            default: break;
        }
    }
}
IgxHintDirective.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHintDirective, deps: [], target: i0.????FactoryTarget.Directive });
IgxHintDirective.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxHintDirective, selector: "igx-hint,[igxHint]", inputs: { position: "position" }, host: { properties: { "class.igx-input-group__hint-item--start": "this.isPositionStart", "class.igx-input-group__hint-item--end": "this.isPositionEnd" } }, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxHintDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'igx-hint,[igxHint]'
                }]
        }], propDecorators: { isPositionStart: [{
                type: HostBinding,
                args: ['class.igx-input-group__hint-item--start']
            }], isPositionEnd: [{
                type: HostBinding,
                args: ['class.igx-input-group__hint-item--end']
            }], position: [{
                type: Input,
                args: ['position']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZGlyZWN0aXZlcy9oaW50L2hpbnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQzs7QUFFdEUsSUFBSyxlQUdKO0FBSEQsV0FBSyxlQUFlO0lBQ2hCLHVEQUFLLENBQUE7SUFDTCxtREFBRyxDQUFBO0FBQ1AsQ0FBQyxFQUhJLGVBQWUsS0FBZixlQUFlLFFBR25CO0FBS0QsTUFBTSxPQUFPLGdCQUFnQjtJQUg3QjtRQUlJOzs7Ozs7Ozs7Ozs7O1dBYUc7UUFFSSxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUMvQjs7Ozs7Ozs7Ozs7OztXQWFHO1FBRUksa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFckIsY0FBUyxHQUFvQixlQUFlLENBQUMsS0FBSyxDQUFDO0tBb0Q5RDtJQW5ERzs7Ozs7Ozs7OztPQVVHO0lBQ0gsSUFDVyxRQUFRLENBQUMsS0FBYTtRQUM3QixNQUFNLFFBQVEsR0FBcUIsZUFBdUIsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNoRixJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBQ0Q7Ozs7Ozs7OztPQVNHO0lBQ0gsSUFBVyxRQUFRO1FBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFDRDs7T0FFRztJQUNJLFFBQVE7UUFDWCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU8sY0FBYyxDQUFDLFFBQXlCO1FBQzVDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDbEQsUUFBUSxRQUFRLEVBQUU7WUFDZCxLQUFLLGVBQWUsQ0FBQyxLQUFLO2dCQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztnQkFDNUIsTUFBTTtZQUNWLEtBQUssZUFBZSxDQUFDLEdBQUc7Z0JBQ3BCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixNQUFNO1lBQ1YsT0FBTyxDQUFDLENBQUMsTUFBTTtTQUNsQjtJQUNMLENBQUM7OzZHQXJGUSxnQkFBZ0I7aUdBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUg1QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxvQkFBb0I7aUJBQ2pDOzhCQWlCVSxlQUFlO3NCQURyQixXQUFXO3VCQUFDLHlDQUF5QztnQkFpQi9DLGFBQWE7c0JBRG5CLFdBQVc7dUJBQUMsdUNBQXVDO2dCQWdCekMsUUFBUTtzQkFEbEIsS0FBSzt1QkFBQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0QmluZGluZywgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5lbnVtIElneEhpbnRQb3NpdGlvbiB7XG4gICAgU1RBUlQsXG4gICAgRU5EXG59XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnaWd4LWhpbnQsW2lneEhpbnRdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hIaW50RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgICAvKipcbiAgICAgKiBTZXRzL2dldHMgd2hldGhlciB0aGUgaGludCBwb3NpdGlvbiBpcyBhdCB0aGUgc3RhcnQuXG4gICAgICogRGVmYXVsdCB2YWx1ZSBpcyBgZmFsc2VgLlxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBAVmlld0NoaWxkKCdoaW50Jywge3JlYWQ6IElneEhpbnREaXJlY3RpdmV9KVxuICAgICAqIHB1YmxpYyBpZ3hIaW50OiBJZ3hIaW50RGlyZWN0aXZlO1xuICAgICAqIHRoaXMuaWd4SGludC5pc1Bvc2l0aW9uU3RhcnQgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNIaW50UG9zaXRpb25TdGFydCA9IHRoaXMuaWd4SGludC5pc1Bvc2l0aW9uU3RhcnQ7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgSWd4SGludERpcmVjdGl2ZVxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuaWd4LWlucHV0LWdyb3VwX19oaW50LWl0ZW0tLXN0YXJ0JylcbiAgICBwdWJsaWMgaXNQb3NpdGlvblN0YXJ0ID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogU2V0cy9nZXRzIHdoZXRoZXIgdGhlIGhpbnQgcG9zaXRpb24gaXMgYXQgdGhlIGVuZC5cbiAgICAgKiBEZWZhdWx0IHZhbHVlIGlzIGBmYWxzZWAuXG4gICAgICogYGBgdHlwZXNjcmlwdFxuICAgICAqIEBWaWV3Q2hpbGQoJ2hpbnQnLCB7cmVhZDogSWd4SGludERpcmVjdGl2ZX0pXG4gICAgICogcHVibGljIGlneEhpbnQ6IElneEhpbnREaXJlY3RpdmU7XG4gICAgICogdGhpcy5pZ3hIaW50LmlzUG9zaXRpb25FbmQgPSB0cnVlO1xuICAgICAqIGBgYFxuICAgICAqIGBgYHR5cGVzY3JpcHRcbiAgICAgKiBsZXQgaXNIaW50UG9zaXRpb25FbmQgPSB0aGlzLmlneEhpbnQuaXNQb3NpdGlvbkVuZDtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hIaW50RGlyZWN0aXZlXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pZ3gtaW5wdXQtZ3JvdXBfX2hpbnQtaXRlbS0tZW5kJylcbiAgICBwdWJsaWMgaXNQb3NpdGlvbkVuZCA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBfcG9zaXRpb246IElneEhpbnRQb3NpdGlvbiA9IElneEhpbnRQb3NpdGlvbi5TVEFSVDtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgaGludC5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlneC1pbnB1dC1ncm91cD5cbiAgICAgKiAgPGlucHV0IGlneElucHV0IHR5cGU9XCJ0ZXh0XCIvPlxuICAgICAqICA8aWd4LWhpbnQgI2hpbnQgW3Bvc2l0aW9uXT1cIidzdGFydCdcIj5JZ3hIaW50IGRpc3BsYXllZCBhdCB0aGUgc3RhcnQ8L2lneC1oaW50PlxuICAgICAqIDwvaWd4LWlucHV0LWdyb3VwPlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIElneEhpbnREaXJlY3RpdmVcbiAgICAgKi9cbiAgICBASW5wdXQoJ3Bvc2l0aW9uJylcbiAgICBwdWJsaWMgc2V0IHBvc2l0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb246IElneEhpbnRQb3NpdGlvbiA9IChJZ3hIaW50UG9zaXRpb24gYXMgYW55KVt2YWx1ZS50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLl9hcHBseVBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgaGludC5cbiAgICAgKiBgYGB0eXBlc2NyaXB0XG4gICAgICogQFZpZXdDaGlsZCgnaGludCcsIHtyZWFkOiBJZ3hIaW50RGlyZWN0aXZlfSlcbiAgICAgKiBwdWJsaWMgaWd4SGludDogSWd4SGludERpcmVjdGl2ZTtcbiAgICAgKiBsZXQgaGludFBvc2l0aW9uID0gIHRoaXMuaWd4SGludC5wb3NpdGlvbjtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBJZ3hIaW50RGlyZWN0aXZlXG4gICAgICovXG4gICAgcHVibGljIGdldCBwb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5UG9zaXRpb24odGhpcy5fcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FwcGx5UG9zaXRpb24ocG9zaXRpb246IElneEhpbnRQb3NpdGlvbikge1xuICAgICAgICB0aGlzLmlzUG9zaXRpb25TdGFydCA9IHRoaXMuaXNQb3NpdGlvbkVuZCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIElneEhpbnRQb3NpdGlvbi5TVEFSVDpcbiAgICAgICAgICAgICAgICB0aGlzLmlzUG9zaXRpb25TdGFydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIElneEhpbnRQb3NpdGlvbi5FTkQ6XG4gICAgICAgICAgICAgICAgdGhpcy5pc1Bvc2l0aW9uRW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19