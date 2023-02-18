import { CommonModule } from '@angular/common';
import { Directive, EventEmitter, HostListener, Output, Input, NgModule, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./mask-parsing.service";
import * as i2 from "../../core/utils";
export class IgxMaskDirective {
    constructor(elementRef, maskParser, renderer, platform) {
        this.elementRef = elementRef;
        this.maskParser = maskParser;
        this.renderer = renderer;
        this.platform = platform;
        /**
         * Sets the character representing a fillable spot in the input mask.
         * Default value is "'_'".
         * ```html
         * <input [promptChar] = "'/'">
         * ```
         */
        this.promptChar = '_';
        /**
         * Emits an event each time the value changes.
         * Provides `rawValue: string` and `formattedValue: string` as event arguments.
         * ```html
         * <input (valueChanged) = "valueChanged(rawValue: string, formattedValue: string)">
         * ```
         */
        this.valueChanged = new EventEmitter();
        this._end = 0;
        this._start = 0;
        this._oldText = '';
        this._dataValue = '';
        this._focused = false;
        this.defaultMask = 'CCCCCCCCCC';
        this._onTouchedCallback = noop;
        this._onChangeCallback = noop;
    }
    /**
     * Sets the input mask.
     * ```html
     * <input [igxMask] = "'00/00/0000'">
     * ```
     */
    get mask() {
        return this._mask || this.defaultMask;
    }
    set mask(val) {
        // B.P. 9th June 2021 #7490
        if (val !== this._mask) {
            const cleanInputValue = this.maskParser.parseValueFromMask(this.inputValue, this.maskOptions);
            this.setPlaceholder(val);
            this._mask = val;
            this.updateInputValue(cleanInputValue);
        }
    }
    /** @hidden */
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    /** @hidden @internal; */
    get inputValue() {
        return this.nativeElement.value;
    }
    /** @hidden @internal */
    set inputValue(val) {
        this.nativeElement.value = val;
    }
    /** @hidden */
    get maskOptions() {
        const format = this.mask || this.defaultMask;
        const promptChar = this.promptChar && this.promptChar.substring(0, 1);
        return { format, promptChar };
    }
    /** @hidden */
    get selectionStart() {
        // Edge(classic) and FF don't select text on drop
        return this.nativeElement.selectionStart === this.nativeElement.selectionEnd && this._hasDropAction ?
            this.nativeElement.selectionEnd - this._droppedData.length :
            this.nativeElement.selectionStart;
    }
    /** @hidden */
    get selectionEnd() {
        return this.nativeElement.selectionEnd;
    }
    /** @hidden */
    get start() {
        return this._start;
    }
    /** @hidden */
    get end() {
        return this._end;
    }
    /** @hidden */
    onKeyDown(event) {
        const key = event.key;
        if (!key) {
            return;
        }
        if ((event.ctrlKey && (key === this.platform.KEYMAP.Z || key === this.platform.KEYMAP.Y))) {
            event.preventDefault();
        }
        this._key = key;
        this._start = this.selectionStart;
        this._end = this.selectionEnd;
    }
    /** @hidden @internal */
    onCompositionStart() {
        if (!this._composing) {
            this._compositionStartIndex = this._start;
            this._composing = true;
        }
    }
    /** @hidden @internal */
    onCompositionEnd() {
        this._start = this._compositionStartIndex;
        const end = this.selectionEnd;
        const valueToParse = this.inputValue.substring(this._start, end);
        this.updateInput(valueToParse);
        this._end = this.selectionEnd;
        this._compositionValue = this.inputValue;
    }
    /** @hidden @internal */
    onInputChanged(event) {
        /**
         * '!this._focused' is a fix for #8165
         * On page load IE triggers input events before focus events and
         * it does so for every single input on the page.
         * The mask needs to be prevented from doing anything while this is happening because
         * the end user will be unable to blur the input.
         * https://stackoverflow.com/questions/21406138/input-event-triggered-on-internet-explorer-when-placeholder-changed
         */
        if (this._composing) {
            if (this.inputValue.length < this._oldText.length) {
                // software keyboard input delete
                this._key = this.platform.KEYMAP.BACKSPACE;
            }
            return;
        }
        // After the compositionend event Chromium triggers input events of type 'deleteContentBackward' and
        // we need to adjust the start and end indexes to include mask literals
        if (event.inputType === 'deleteContentBackward' && this._key !== this.platform.KEYMAP.BACKSPACE) {
            const isInputComplete = this._compositionStartIndex === 0 && this._end === this.mask.length;
            let numberOfMaskLiterals = 0;
            const literalPos = this.maskParser.getMaskLiterals(this.maskOptions.format).keys();
            for (const index of literalPos) {
                if (index >= this._compositionStartIndex && index <= this._end) {
                    numberOfMaskLiterals++;
                }
            }
            this.inputValue = isInputComplete ?
                this.inputValue.substring(0, this.selectionEnd - numberOfMaskLiterals) + this.inputValue.substring(this.selectionEnd)
                : this._compositionValue.substring(0, this._compositionStartIndex);
            this._start = this.selectionStart;
            this._end = this.selectionEnd;
            this.nativeElement.selectionStart = isInputComplete ? this._start - numberOfMaskLiterals : this._compositionStartIndex;
            this.nativeElement.selectionEnd = this._end - numberOfMaskLiterals;
            this.nativeElement.selectionEnd = this._end;
            this._start = this.selectionStart;
            this._end = this.selectionEnd;
        }
        if (this._hasDropAction) {
            this._start = this.selectionStart;
        }
        let valueToParse = '';
        switch (this._key) {
            case this.platform.KEYMAP.DELETE:
                this._end = this._start === this._end ? ++this._end : this._end;
                break;
            case this.platform.KEYMAP.BACKSPACE:
                this._start = this.selectionStart;
                break;
            default:
                valueToParse = this.inputValue.substring(this._start, this.selectionEnd);
                break;
        }
        this.updateInput(valueToParse);
    }
    /** @hidden */
    onPaste() {
        this._oldText = this.inputValue;
        this._start = this.selectionStart;
    }
    /** @hidden */
    onFocus() {
        if (this.nativeElement.readOnly) {
            return;
        }
        this._focused = true;
        this.showMask(this.inputValue);
    }
    /** @hidden */
    onBlur(value) {
        this._focused = false;
        this.showDisplayValue(value);
        this._onTouchedCallback();
    }
    /** @hidden */
    onDragEnter() {
        if (!this._focused) {
            this.showMask(this._dataValue);
        }
    }
    /** @hidden */
    onDragLeave() {
        if (!this._focused) {
            this.showDisplayValue(this.inputValue);
        }
    }
    /** @hidden */
    onDrop(event) {
        this._hasDropAction = true;
        this._droppedData = event.dataTransfer.getData('text');
    }
    /** @hidden */
    ngOnInit() {
        this.setPlaceholder(this.maskOptions.format);
    }
    /**
     * TODO: Remove after date/time picker integration refactor
     *
     * @hidden
     */
    ngAfterViewChecked() {
        if (this._composing) {
            return;
        }
        this._oldText = this.inputValue;
    }
    /** @hidden */
    writeValue(value) {
        if (this.promptChar && this.promptChar.length > 1) {
            this.maskOptions.promptChar = this.promptChar.substring(0, 1);
        }
        this.inputValue = value ? this.maskParser.applyMask(value, this.maskOptions) : '';
        if (this.displayValuePipe) {
            this.inputValue = this.displayValuePipe.transform(this.inputValue);
        }
        this._dataValue = this.includeLiterals ? this.inputValue : value;
        this.valueChanged.emit({ rawValue: value, formattedValue: this.inputValue });
    }
    /** @hidden */
    registerOnChange(fn) {
        this._onChangeCallback = fn;
    }
    /** @hidden */
    registerOnTouched(fn) {
        this._onTouchedCallback = fn;
    }
    /** @hidden */
    showMask(value) {
        if (this.focusedValuePipe) {
            // TODO(D.P.): focusedValuePipe should be deprecated or force-checked to match mask format
            this.inputValue = this.focusedValuePipe.transform(value);
        }
        else {
            this.inputValue = this.maskParser.applyMask(value, this.maskOptions);
        }
        this._oldText = this.inputValue;
    }
    /** @hidden */
    setSelectionRange(start, end = start) {
        this.nativeElement.setSelectionRange(start, end);
    }
    /** @hidden */
    afterInput() {
        this._oldText = this.inputValue;
        this._hasDropAction = false;
        this._start = 0;
        this._end = 0;
        this._key = null;
        this._composing = false;
    }
    /** @hidden */
    setPlaceholder(value) {
        const placeholder = this.nativeElement.placeholder;
        if (!placeholder || placeholder === this.mask) {
            this.renderer.setAttribute(this.nativeElement, 'placeholder', value || this.defaultMask);
        }
    }
    updateInputValue(value) {
        if (this._focused) {
            this.showMask(value);
        }
        else if (!this.displayValuePipe) {
            this.inputValue = this.inputValue ? this.maskParser.applyMask(value, this.maskOptions) : '';
        }
    }
    updateInput(valueToParse) {
        const replacedData = this.maskParser.replaceInMask(this._oldText, valueToParse, this.maskOptions, this._start, this._end);
        this.inputValue = replacedData.value;
        if (this._key === this.platform.KEYMAP.BACKSPACE) {
            replacedData.end = this._start;
        }
        ;
        this.setSelectionRange(replacedData.end);
        const rawVal = this.maskParser.parseValueFromMask(this.inputValue, this.maskOptions);
        this._dataValue = this.includeLiterals ? this.inputValue : rawVal;
        this._onChangeCallback(this._dataValue);
        this.valueChanged.emit({ rawValue: rawVal, formattedValue: this.inputValue });
        this.afterInput();
    }
    showDisplayValue(value) {
        if (this.displayValuePipe) {
            this.inputValue = this.displayValuePipe.transform(value);
        }
        else if (value === this.maskParser.applyMask(null, this.maskOptions)) {
            this.inputValue = '';
        }
    }
}
IgxMaskDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxMaskDirective, deps: [{ token: i0.ElementRef }, { token: i1.MaskParsingService }, { token: i0.Renderer2 }, { token: i2.PlatformUtil }], target: i0.ɵɵFactoryTarget.Directive });
IgxMaskDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxMaskDirective, selector: "[igxMask]", inputs: { mask: ["igxMask", "mask"], promptChar: "promptChar", includeLiterals: "includeLiterals", displayValuePipe: "displayValuePipe", focusedValuePipe: "focusedValuePipe" }, outputs: { valueChanged: "valueChanged" }, host: { listeners: { "keydown": "onKeyDown($event)", "compositionstart": "onCompositionStart()", "compositionend": "onCompositionEnd()", "input": "onInputChanged($event)", "paste": "onPaste()", "focus": "onFocus()", "blur": "onBlur($event.target.value)", "dragenter": "onDragEnter()", "dragleave": "onDragLeave()", "drop": "onDrop($event)" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxMaskDirective, multi: true }], exportAs: ["igxMask"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxMaskDirective, decorators: [{
            type: Directive,
            args: [{
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxMaskDirective, multi: true }],
                    selector: '[igxMask]',
                    exportAs: 'igxMask'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.MaskParsingService }, { type: i0.Renderer2 }, { type: i2.PlatformUtil }]; }, propDecorators: { mask: [{
                type: Input,
                args: ['igxMask']
            }], promptChar: [{
                type: Input
            }], includeLiterals: [{
                type: Input
            }], displayValuePipe: [{
                type: Input
            }], focusedValuePipe: [{
                type: Input
            }], valueChanged: [{
                type: Output
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onCompositionStart: [{
                type: HostListener,
                args: ['compositionstart']
            }], onCompositionEnd: [{
                type: HostListener,
                args: ['compositionend']
            }], onInputChanged: [{
                type: HostListener,
                args: ['input', ['$event']]
            }], onPaste: [{
                type: HostListener,
                args: ['paste']
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur', ['$event.target.value']]
            }], onDragEnter: [{
                type: HostListener,
                args: ['dragenter']
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave']
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
/** @hidden */
export class IgxMaskModule {
}
IgxMaskModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxMaskModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxMaskModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxMaskModule, declarations: [IgxMaskDirective], imports: [CommonModule], exports: [IgxMaskDirective] });
IgxMaskModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxMaskModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxMaskModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxMaskDirective],
                    exports: [IgxMaskDirective],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzay5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvZGlyZWN0aXZlcy9tYXNrL21hc2suZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0gsU0FBUyxFQUFjLFlBQVksRUFBRSxZQUFZLEVBQ2pELE1BQU0sRUFDTixLQUFLLEVBQUUsUUFBUSxHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQzs7OztBQU81QixNQUFNLE9BQU8sZ0JBQWdCO0lBb0l6QixZQUNjLFVBQXdDLEVBQ3hDLFVBQThCLEVBQzlCLFFBQW1CLEVBQ25CLFFBQXNCO1FBSHRCLGVBQVUsR0FBVixVQUFVLENBQThCO1FBQ3hDLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQWxIcEM7Ozs7OztXQU1HO1FBRUksZUFBVSxHQUFHLEdBQUcsQ0FBQztRQTZCeEI7Ozs7OztXQU1HO1FBRUksaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBa0IsQ0FBQztRQWtEakQsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULFdBQU0sR0FBRyxDQUFDLENBQUM7UUFHWCxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBSVIsZ0JBQVcsR0FBRyxZQUFZLENBQUM7UUFFcEMsdUJBQWtCLEdBQWUsSUFBSSxDQUFDO1FBQ3RDLHNCQUFpQixHQUFxQixJQUFJLENBQUM7SUFNWCxD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WTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBa0I1QixrQkFBa0I7c0JBRHhCLFlBQVk7dUJBQUMsa0JBQWtCO2dCQVV6QixnQkFBZ0I7c0JBRHRCLFlBQVk7dUJBQUMsZ0JBQWdCO2dCQVl2QixjQUFjO3NCQURwQixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFpRTFCLE9BQU87c0JBRGIsWUFBWTt1QkFBQyxPQUFPO2dCQVFkLE9BQU87c0JBRGIsWUFBWTt1QkFBQyxPQUFPO2dCQVdkLE1BQU07c0JBRFosWUFBWTt1QkFBQyxNQUFNLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFTdEMsV0FBVztzQkFEakIsWUFBWTt1QkFBQyxXQUFXO2dCQVNsQixXQUFXO3NCQURqQixZQUFZO3VCQUFDLFdBQVc7Z0JBU2xCLE1BQU07c0JBRFosWUFBWTt1QkFBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBOEhwQyxjQUFjO0FBTWQsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7MkdBQWIsYUFBYSxpQkE3WmIsZ0JBQWdCLGFBMlpmLFlBQVksYUEzWmIsZ0JBQWdCOzJHQTZaaEIsYUFBYSxZQUZiLENBQUMsWUFBWSxDQUFDOzJGQUVkLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQ2hDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO29CQUMzQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lcixcbiAgICBPdXRwdXQsIFBpcGVUcmFuc2Zvcm0sIFJlbmRlcmVyMixcbiAgICBJbnB1dCwgTmdNb2R1bGUsIE9uSW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXNrUGFyc2luZ1NlcnZpY2UsIE1hc2tPcHRpb25zIH0gZnJvbSAnLi9tYXNrLXBhcnNpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBJQmFzZUV2ZW50QXJncywgUGxhdGZvcm1VdGlsIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscyc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBJZ3hNYXNrRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZSB9XSxcbiAgICBzZWxlY3RvcjogJ1tpZ3hNYXNrXScsXG4gICAgZXhwb3J0QXM6ICdpZ3hNYXNrJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hNYXNrRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdDaGVja2VkLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgaW5wdXQgbWFzay5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IFtpZ3hNYXNrXSA9IFwiJzAwLzAwLzAwMDAnXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KCdpZ3hNYXNrJylcbiAgICBwdWJsaWMgZ2V0IG1hc2soKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hc2sgfHwgdGhpcy5kZWZhdWx0TWFzaztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IG1hc2sodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgLy8gQi5QLiA5dGggSnVuZSAyMDIxICM3NDkwXG4gICAgICAgIGlmICh2YWwgIT09IHRoaXMuX21hc2spIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuSW5wdXRWYWx1ZSA9IHRoaXMubWFza1BhcnNlci5wYXJzZVZhbHVlRnJvbU1hc2sodGhpcy5pbnB1dFZhbHVlLCB0aGlzLm1hc2tPcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIodmFsKTtcbiAgICAgICAgICAgIHRoaXMuX21hc2sgPSB2YWw7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlucHV0VmFsdWUoY2xlYW5JbnB1dFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNoYXJhY3RlciByZXByZXNlbnRpbmcgYSBmaWxsYWJsZSBzcG90IGluIHRoZSBpbnB1dCBtYXNrLlxuICAgICAqIERlZmF1bHQgdmFsdWUgaXMgXCInXydcIi5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IFtwcm9tcHRDaGFyXSA9IFwiJy8nXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcHJvbXB0Q2hhciA9ICdfJztcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyBpZiB0aGUgYm91bmQgdmFsdWUgaW5jbHVkZXMgdGhlIGZvcm1hdHRpbmcgc3ltYm9scy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IFtpbmNsdWRlTGl0ZXJhbHNdID0gXCJ0cnVlXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5jbHVkZUxpdGVyYWxzOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIGEgcGlwZSB0byBiZSB1c2VkIG9uIGJsdXIuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpbnB1dCBbZGlzcGxheVZhbHVlUGlwZV0gPSBcImRpc3BsYXlGb3JtYXRQaXBlXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzcGxheVZhbHVlUGlwZTogUGlwZVRyYW5zZm9ybTtcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyBhIHBpcGUgdG8gYmUgdXNlZCBvbiBmb2N1cy5cbiAgICAgKiBgYGBodG1sXG4gICAgICogPGlucHV0IFtmb2N1c2VkVmFsdWVQaXBlXSA9IFwiaW5wdXRGb3JtYXRQaXBlXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZm9jdXNlZFZhbHVlUGlwZTogUGlwZVRyYW5zZm9ybTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IGVhY2ggdGltZSB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAgKiBQcm92aWRlcyBgcmF3VmFsdWU6IHN0cmluZ2AgYW5kIGBmb3JtYXR0ZWRWYWx1ZTogc3RyaW5nYCBhcyBldmVudCBhcmd1bWVudHMuXG4gICAgICogYGBgaHRtbFxuICAgICAqIDxpbnB1dCAodmFsdWVDaGFuZ2VkKSA9IFwidmFsdWVDaGFuZ2VkKHJhd1ZhbHVlOiBzdHJpbmcsIGZvcm1hdHRlZFZhbHVlOiBzdHJpbmcpXCI+XG4gICAgICogYGBgXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZhbHVlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SU1hc2tFdmVudEFyZ3M+KCk7XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBnZXQgbmF0aXZlRWxlbWVudCgpOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbDsgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0IGlucHV0VmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwcm90ZWN0ZWQgc2V0IGlucHV0VmFsdWUodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnZhbHVlID0gdmFsO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIGdldCBtYXNrT3B0aW9ucygpOiBNYXNrT3B0aW9ucyB7XG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IHRoaXMubWFzayB8fCB0aGlzLmRlZmF1bHRNYXNrO1xuICAgICAgICBjb25zdCBwcm9tcHRDaGFyID0gdGhpcy5wcm9tcHRDaGFyICYmIHRoaXMucHJvbXB0Q2hhci5zdWJzdHJpbmcoMCwgMSk7XG4gICAgICAgIHJldHVybiB7IGZvcm1hdCwgcHJvbXB0Q2hhciB9O1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIGdldCBzZWxlY3Rpb25TdGFydCgpOiBudW1iZXIge1xuICAgICAgICAvLyBFZGdlKGNsYXNzaWMpIGFuZCBGRiBkb24ndCBzZWxlY3QgdGV4dCBvbiBkcm9wXG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT09IHRoaXMubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25FbmQgJiYgdGhpcy5faGFzRHJvcEFjdGlvbiA/XG4gICAgICAgICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uRW5kIC0gdGhpcy5fZHJvcHBlZERhdGEubGVuZ3RoIDpcbiAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHByb3RlY3RlZCBnZXQgc2VsZWN0aW9uRW5kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uRW5kO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIGdldCBzdGFydCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgZ2V0IGVuZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5kO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfY29tcG9zaW5nOiBib29sZWFuO1xuICAgIHByb3RlY3RlZCBfY29tcG9zaXRpb25TdGFydEluZGV4OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfY29tcG9zaXRpb25WYWx1ZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZCA9IDA7XG4gICAgcHJpdmF0ZSBfc3RhcnQgPSAwO1xuICAgIHByaXZhdGUgX2tleTogc3RyaW5nO1xuICAgIHByaXZhdGUgX21hc2s6IHN0cmluZztcbiAgICBwcml2YXRlIF9vbGRUZXh0ID0gJyc7XG4gICAgcHJpdmF0ZSBfZGF0YVZhbHVlID0gJyc7XG4gICAgcHJpdmF0ZSBfZm9jdXNlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2Ryb3BwZWREYXRhOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfaGFzRHJvcEFjdGlvbjogYm9vbGVhbjtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVmYXVsdE1hc2sgPSAnQ0NDQ0NDQ0NDQyc7XG5cbiAgICBwcml2YXRlIF9vblRvdWNoZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IG5vb3A7XG4gICAgcHJpdmF0ZSBfb25DaGFuZ2VDYWxsYmFjazogKF86IGFueSkgPT4gdm9pZCA9IG5vb3A7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgICAgIHByb3RlY3RlZCBtYXNrUGFyc2VyOiBNYXNrUGFyc2luZ1NlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBwcm90ZWN0ZWQgcGxhdGZvcm06IFBsYXRmb3JtVXRpbCkgeyB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZXZlbnQua2V5O1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChldmVudC5jdHJsS2V5ICYmIChrZXkgPT09IHRoaXMucGxhdGZvcm0uS0VZTUFQLlogfHwga2V5ID09PSB0aGlzLnBsYXRmb3JtLktFWU1BUC5ZKSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgdGhpcy5fZW5kID0gdGhpcy5zZWxlY3Rpb25FbmQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgQEhvc3RMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcpXG4gICAgcHVibGljIG9uQ29tcG9zaXRpb25TdGFydCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jb21wb3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvc2l0aW9uU3RhcnRJbmRleCA9IHRoaXMuX3N0YXJ0O1xuICAgICAgICAgICAgdGhpcy5fY29tcG9zaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJylcbiAgICBwdWJsaWMgb25Db21wb3NpdGlvbkVuZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9jb21wb3NpdGlvblN0YXJ0SW5kZXg7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc2VsZWN0aW9uRW5kO1xuICAgICAgICBjb25zdCB2YWx1ZVRvUGFyc2UgPSB0aGlzLmlucHV0VmFsdWUuc3Vic3RyaW5nKHRoaXMuX3N0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLnVwZGF0ZUlucHV0KHZhbHVlVG9QYXJzZSk7XG4gICAgICAgIHRoaXMuX2VuZCA9IHRoaXMuc2VsZWN0aW9uRW5kO1xuICAgICAgICB0aGlzLl9jb21wb3NpdGlvblZhbHVlID0gdGhpcy5pbnB1dFZhbHVlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25JbnB1dENoYW5nZWQoZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICchdGhpcy5fZm9jdXNlZCcgaXMgYSBmaXggZm9yICM4MTY1XG4gICAgICAgICAqIE9uIHBhZ2UgbG9hZCBJRSB0cmlnZ2VycyBpbnB1dCBldmVudHMgYmVmb3JlIGZvY3VzIGV2ZW50cyBhbmRcbiAgICAgICAgICogaXQgZG9lcyBzbyBmb3IgZXZlcnkgc2luZ2xlIGlucHV0IG9uIHRoZSBwYWdlLlxuICAgICAgICAgKiBUaGUgbWFzayBuZWVkcyB0byBiZSBwcmV2ZW50ZWQgZnJvbSBkb2luZyBhbnl0aGluZyB3aGlsZSB0aGlzIGlzIGhhcHBlbmluZyBiZWNhdXNlXG4gICAgICAgICAqIHRoZSBlbmQgdXNlciB3aWxsIGJlIHVuYWJsZSB0byBibHVyIHRoZSBpbnB1dC5cbiAgICAgICAgICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE0MDYxMzgvaW5wdXQtZXZlbnQtdHJpZ2dlcmVkLW9uLWludGVybmV0LWV4cGxvcmVyLXdoZW4tcGxhY2Vob2xkZXItY2hhbmdlZFxuICAgICAgICAgKi9cblxuICAgICAgICBpZiAodGhpcy5fY29tcG9zaW5nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dFZhbHVlLmxlbmd0aCA8IHRoaXMuX29sZFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gc29mdHdhcmUga2V5Ym9hcmQgaW5wdXQgZGVsZXRlXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5ID0gdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQkFDS1NQQUNFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlIGNvbXBvc2l0aW9uZW5kIGV2ZW50IENocm9taXVtIHRyaWdnZXJzIGlucHV0IGV2ZW50cyBvZiB0eXBlICdkZWxldGVDb250ZW50QmFja3dhcmQnIGFuZFxuICAgICAgICAvLyB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgc3RhcnQgYW5kIGVuZCBpbmRleGVzIHRvIGluY2x1ZGUgbWFzayBsaXRlcmFsc1xuICAgICAgICBpZiAoZXZlbnQuaW5wdXRUeXBlID09PSAnZGVsZXRlQ29udGVudEJhY2t3YXJkJyAmJiB0aGlzLl9rZXkgIT09IHRoaXMucGxhdGZvcm0uS0VZTUFQLkJBQ0tTUEFDRSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5wdXRDb21wbGV0ZSA9IHRoaXMuX2NvbXBvc2l0aW9uU3RhcnRJbmRleCA9PT0gMCAmJiB0aGlzLl9lbmQgPT09IHRoaXMubWFzay5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IG51bWJlck9mTWFza0xpdGVyYWxzID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsaXRlcmFsUG9zID0gdGhpcy5tYXNrUGFyc2VyLmdldE1hc2tMaXRlcmFscyh0aGlzLm1hc2tPcHRpb25zLmZvcm1hdCkua2V5cygpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW5kZXggb2YgbGl0ZXJhbFBvcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5fY29tcG9zaXRpb25TdGFydEluZGV4ICYmIGluZGV4IDw9IHRoaXMuX2VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZNYXNrTGl0ZXJhbHMrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0VmFsdWUgPSBpc0lucHV0Q29tcGxldGU/XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFZhbHVlLnN1YnN0cmluZygwLCB0aGlzLnNlbGVjdGlvbkVuZCAtIG51bWJlck9mTWFza0xpdGVyYWxzKSArIHRoaXMuaW5wdXRWYWx1ZS5zdWJzdHJpbmcodGhpcy5zZWxlY3Rpb25FbmQpXG4gICAgICAgICAgICAgICAgOiB0aGlzLl9jb21wb3NpdGlvblZhbHVlLnN1YnN0cmluZygwLCB0aGlzLl9jb21wb3NpdGlvblN0YXJ0SW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnQgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuZCA9IHRoaXMuc2VsZWN0aW9uRW5kO1xuICAgICAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydCA9IGlzSW5wdXRDb21wbGV0ZSA/IHRoaXMuX3N0YXJ0IC0gbnVtYmVyT2ZNYXNrTGl0ZXJhbHMgOiB0aGlzLl9jb21wb3NpdGlvblN0YXJ0SW5kZXg7XG4gICAgICAgICAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnNlbGVjdGlvbkVuZCA9IHRoaXMuX2VuZCAtIG51bWJlck9mTWFza0xpdGVyYWxzO1xuICAgICAgICAgICAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25FbmQgPSB0aGlzLl9lbmQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhcnQgPSB0aGlzLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuZCA9IHRoaXMuc2VsZWN0aW9uRW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc0Ryb3BBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZVRvUGFyc2UgPSAnJztcbiAgICAgICAgc3dpdGNoICh0aGlzLl9rZXkpIHtcbiAgICAgICAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuREVMRVRFOlxuICAgICAgICAgICAgICAgIHRoaXMuX2VuZCA9IHRoaXMuX3N0YXJ0ID09PSB0aGlzLl9lbmQgPyArK3RoaXMuX2VuZCA6IHRoaXMuX2VuZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdGhpcy5wbGF0Zm9ybS5LRVlNQVAuQkFDS1NQQUNFOlxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0ID0gdGhpcy5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdmFsdWVUb1BhcnNlID0gdGhpcy5pbnB1dFZhbHVlLnN1YnN0cmluZyh0aGlzLl9zdGFydCwgdGhpcy5zZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVJbnB1dCh2YWx1ZVRvUGFyc2UpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcigncGFzdGUnKVxuICAgIHB1YmxpYyBvblBhc3RlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbGRUZXh0ID0gdGhpcy5pbnB1dFZhbHVlO1xuICAgICAgICB0aGlzLl9zdGFydCA9IHRoaXMuc2VsZWN0aW9uU3RhcnQ7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdExpc3RlbmVyKCdmb2N1cycpXG4gICAgcHVibGljIG9uRm9jdXMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZUVsZW1lbnQucmVhZE9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9mb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93TWFzayh0aGlzLmlucHV0VmFsdWUpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgQEhvc3RMaXN0ZW5lcignYmx1cicsIFsnJGV2ZW50LnRhcmdldC52YWx1ZSddKVxuICAgIHB1YmxpYyBvbkJsdXIodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLl9mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hvd0Rpc3BsYXlWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInKVxuICAgIHB1YmxpYyBvbkRyYWdFbnRlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mb2N1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dNYXNrKHRoaXMuX2RhdGFWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScpXG4gICAgcHVibGljIG9uRHJhZ0xlYXZlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuX2ZvY3VzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Rpc3BsYXlWYWx1ZSh0aGlzLmlucHV0VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25Ecm9wKGV2ZW50OiBEcmFnRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5faGFzRHJvcEFjdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Ryb3BwZWREYXRhID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQnKTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcih0aGlzLm1hc2tPcHRpb25zLmZvcm1hdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVE9ETzogUmVtb3ZlIGFmdGVyIGRhdGUvdGltZSBwaWNrZXIgaW50ZWdyYXRpb24gcmVmYWN0b3JcbiAgICAgKlxuICAgICAqIEBoaWRkZW5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdDaGVja2VkKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fY29tcG9zaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb2xkVGV4dCA9IHRoaXMuaW5wdXRWYWx1ZTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucHJvbXB0Q2hhciAmJiB0aGlzLnByb21wdENoYXIubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhpcy5tYXNrT3B0aW9ucy5wcm9tcHRDaGFyID0gdGhpcy5wcm9tcHRDaGFyLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlID8gdGhpcy5tYXNrUGFyc2VyLmFwcGx5TWFzayh2YWx1ZSwgdGhpcy5tYXNrT3B0aW9ucykgOiAnJztcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVZhbHVlUGlwZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5kaXNwbGF5VmFsdWVQaXBlLnRyYW5zZm9ybSh0aGlzLmlucHV0VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZGF0YVZhbHVlID0gdGhpcy5pbmNsdWRlTGl0ZXJhbHMgPyB0aGlzLmlucHV0VmFsdWUgOiB2YWx1ZTtcblxuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KHsgcmF3VmFsdWU6IHZhbHVlLCBmb3JtYXR0ZWRWYWx1ZTogdGhpcy5pbnB1dFZhbHVlIH0pO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLyoqIEBoaWRkZW4gKi9cbiAgICBwcm90ZWN0ZWQgc2hvd01hc2sodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5mb2N1c2VkVmFsdWVQaXBlKSB7XG4gICAgICAgICAgICAvLyBUT0RPKEQuUC4pOiBmb2N1c2VkVmFsdWVQaXBlIHNob3VsZCBiZSBkZXByZWNhdGVkIG9yIGZvcmNlLWNoZWNrZWQgdG8gbWF0Y2ggbWFzayBmb3JtYXRcbiAgICAgICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHRoaXMuZm9jdXNlZFZhbHVlUGlwZS50cmFuc2Zvcm0odmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5tYXNrUGFyc2VyLmFwcGx5TWFzayh2YWx1ZSwgdGhpcy5tYXNrT3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vbGRUZXh0ID0gdGhpcy5pbnB1dFZhbHVlO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIHNldFNlbGVjdGlvblJhbmdlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyID0gc3RhcnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0LCBlbmQpO1xuICAgIH1cblxuICAgIC8qKiBAaGlkZGVuICovXG4gICAgcHJvdGVjdGVkIGFmdGVySW5wdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX29sZFRleHQgPSB0aGlzLmlucHV0VmFsdWU7XG4gICAgICAgIHRoaXMuX2hhc0Ryb3BBY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgICAgICB0aGlzLl9lbmQgPSAwO1xuICAgICAgICB0aGlzLl9rZXkgPSBudWxsO1xuICAgICAgICB0aGlzLl9jb21wb3NpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiogQGhpZGRlbiAqL1xuICAgIHByb3RlY3RlZCBzZXRQbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5uYXRpdmVFbGVtZW50LnBsYWNlaG9sZGVyO1xuICAgICAgICBpZiAoIXBsYWNlaG9sZGVyIHx8IHBsYWNlaG9sZGVyID09PSB0aGlzLm1hc2spIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMubmF0aXZlRWxlbWVudCwgJ3BsYWNlaG9sZGVyJywgdmFsdWUgfHwgdGhpcy5kZWZhdWx0TWFzayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUlucHV0VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5fZm9jdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5zaG93TWFzayh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZGlzcGxheVZhbHVlUGlwZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5pbnB1dFZhbHVlID8gdGhpcy5tYXNrUGFyc2VyLmFwcGx5TWFzayh2YWx1ZSwgdGhpcy5tYXNrT3B0aW9ucykgOiAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSW5wdXQodmFsdWVUb1BhcnNlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcmVwbGFjZWREYXRhID0gdGhpcy5tYXNrUGFyc2VyLnJlcGxhY2VJbk1hc2sodGhpcy5fb2xkVGV4dCwgdmFsdWVUb1BhcnNlLCB0aGlzLm1hc2tPcHRpb25zLCB0aGlzLl9zdGFydCwgdGhpcy5fZW5kKTtcbiAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gcmVwbGFjZWREYXRhLnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5fa2V5ID09PSB0aGlzLnBsYXRmb3JtLktFWU1BUC5CQUNLU1BBQ0UpIHtcbiAgICAgICAgICAgIHJlcGxhY2VkRGF0YS5lbmQgPSB0aGlzLl9zdGFydDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHJlcGxhY2VkRGF0YS5lbmQpO1xuXG4gICAgICAgIGNvbnN0IHJhd1ZhbCA9IHRoaXMubWFza1BhcnNlci5wYXJzZVZhbHVlRnJvbU1hc2sodGhpcy5pbnB1dFZhbHVlLCB0aGlzLm1hc2tPcHRpb25zKTtcbiAgICAgICAgdGhpcy5fZGF0YVZhbHVlID0gdGhpcy5pbmNsdWRlTGl0ZXJhbHMgPyB0aGlzLmlucHV0VmFsdWUgOiByYXdWYWw7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodGhpcy5fZGF0YVZhbHVlKTtcblxuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlZC5lbWl0KHsgcmF3VmFsdWU6IHJhd1ZhbCwgZm9ybWF0dGVkVmFsdWU6IHRoaXMuaW5wdXRWYWx1ZSB9KTtcbiAgICAgICAgdGhpcy5hZnRlcklucHV0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG93RGlzcGxheVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheVZhbHVlUGlwZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5kaXNwbGF5VmFsdWVQaXBlLnRyYW5zZm9ybSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IHRoaXMubWFza1BhcnNlci5hcHBseU1hc2sobnVsbCwgdGhpcy5tYXNrT3B0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBJZ3hNYXNrTW9kdWxlIHByb3ZpZGVzIHRoZSB7QGxpbmsgSWd4TWFza0RpcmVjdGl2ZX0gaW5zaWRlIHlvdXIgYXBwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU1hc2tFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncyB7XG4gICAgcmF3VmFsdWU6IHN0cmluZztcbiAgICBmb3JtYXR0ZWRWYWx1ZTogc3RyaW5nO1xufVxuXG4vKiogQGhpZGRlbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtJZ3hNYXNrRGlyZWN0aXZlXSxcbiAgICBleHBvcnRzOiBbSWd4TWFza0RpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSWd4TWFza01vZHVsZSB7IH1cbiJdfQ==