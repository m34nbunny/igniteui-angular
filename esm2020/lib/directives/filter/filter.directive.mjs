import { CommonModule } from '@angular/common';
import { Directive, EventEmitter, Input, NgModule, Output, Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class IgxFilterOptions {
    constructor() {
        // Input text value that will be used as a filtering pattern (matching condition is based on it)
        this.inputValue = '';
    }
    // Function - get value to be tested from the item
    // item - single item of the list to be filtered
    // key - property name of item, which value should be tested
    // Default behavior - returns "key"- named property value of item if key si provided,
    // otherwise textContent of the item's html element
    get_value(item, key) {
        let result = '';
        if (key && item[key]) {
            result = item[key].toString();
        }
        else if (item.element) {
            if (item.element.nativeElement) {
                result = item.element.nativeElement.textContent.trim();
                // Check if element doesn't return the DOM element directly
            }
            else if (item.element.textContent) {
                result = item.element.textContent.trim();
            }
        }
        return result;
    }
    // Function - formats the original text before matching process
    // Default behavior - returns text to lower case
    formatter(valueToTest) {
        return valueToTest.toLowerCase();
    }
    // Function - determines whether the item met the condition
    // valueToTest - text value that should be tested
    // inputValue - text value from input that condition is based on
    // Default behavior - "contains"
    matchFn(valueToTest, inputValue) {
        return valueToTest.indexOf(inputValue && inputValue.toLowerCase() || '') > -1;
    }
    // Function - executed after matching test for every matched item
    // Default behavior - shows the item
    metConditionFn(item) {
        if (item.hasOwnProperty('hidden')) {
            item.hidden = false;
        }
    }
    // Function - executed for every NOT matched item after matching test
    // Default behavior - hides the item
    overdueConditionFn(item) {
        if (item.hasOwnProperty('hidden')) {
            item.hidden = true;
        }
    }
}
export class IgxFilterDirective {
    constructor(element, renderer) {
        this.element = element;
        this.filtering = new EventEmitter(false); // synchronous event emitter
        this.filtered = new EventEmitter();
    }
    ngOnChanges(changes) {
        // Detect only changes of input value
        if (changes.filterOptions &&
            changes.filterOptions.currentValue &&
            changes.filterOptions.currentValue.inputValue !== undefined &&
            changes.filterOptions.previousValue &&
            changes.filterOptions.currentValue.inputValue !== changes.filterOptions.previousValue.inputValue) {
            this.filter();
        }
    }
    filter() {
        if (!this.filterOptions.items) {
            return;
        }
        const args = { cancel: false, items: this.filterOptions.items };
        this.filtering.emit(args);
        if (args.cancel) {
            return;
        }
        const pipe = new IgxFilterPipe();
        const filtered = pipe.transform(this.filterOptions.items, this.filterOptions);
        this.filtered.emit({ filteredItems: filtered });
    }
}
IgxFilterDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
IgxFilterDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.2", type: IgxFilterDirective, selector: "[igxFilter]", inputs: { filterOptions: ["igxFilter", "filterOptions"] }, outputs: { filtering: "filtering", filtered: "filtered" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[igxFilter]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { filtering: [{
                type: Output
            }], filtered: [{
                type: Output
            }], filterOptions: [{
                type: Input,
                args: ['igxFilter']
            }] } });
export class IgxFilterPipe {
    transform(items, 
    // options - initial settings of filter functionality
    options) {
        let result = [];
        if (!items || !items.length || !options) {
            return;
        }
        if (options.items) {
            items = options.items;
        }
        result = items.filter((item) => {
            const match = options.matchFn(options.formatter(options.get_value(item, options.key)), options.inputValue);
            if (match) {
                if (options.metConditionFn) {
                    options.metConditionFn(item);
                }
            }
            else {
                if (options.overdueConditionFn) {
                    options.overdueConditionFn(item);
                }
            }
            return match;
        });
        return result;
    }
}
IgxFilterPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
IgxFilterPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterPipe, name: "igxFilter", pure: false });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'igxFilter',
                    pure: false
                }]
        }] });
/**
 * @hidden
 */
export class IgxFilterModule {
}
IgxFilterModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
IgxFilterModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterModule, declarations: [IgxFilterDirective, IgxFilterPipe], imports: [CommonModule], exports: [IgxFilterDirective, IgxFilterPipe] });
IgxFilterModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: IgxFilterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [IgxFilterDirective, IgxFilterPipe],
                    exports: [IgxFilterDirective, IgxFilterPipe],
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9kaXJlY3RpdmVzL2ZpbHRlci9maWx0ZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0gsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBQ0wsUUFBUSxFQUVSLE1BQU0sRUFDTixJQUFJLEVBSVAsTUFBTSxlQUFlLENBQUM7O0FBRXZCLE1BQU0sT0FBTyxnQkFBZ0I7SUFBN0I7UUFDSSxnR0FBZ0c7UUFDekYsZUFBVSxHQUFHLEVBQUUsQ0FBQztJQTJEM0IsQ0FBQztJQW5ERyxrREFBa0Q7SUFDbEQsZ0RBQWdEO0lBQ2hELDREQUE0RDtJQUM1RCxxRkFBcUY7SUFDckYsbURBQW1EO0lBQzVDLFNBQVMsQ0FBQyxJQUFTLEVBQUUsR0FBVztRQUNuQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakM7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDckIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtnQkFDNUIsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0QsMkRBQTJEO2FBQzFEO2lCQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7Z0JBQ2pDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzth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OzZHQTJDYixlQUFlLFlBRmYsQ0FBQyxZQUFZLENBQUM7MkZBRWQsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUM7b0JBQ2pELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQztvQkFDNUMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIERpcmVjdGl2ZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPbkNoYW5nZXMsXG4gICAgT3V0cHV0LFxuICAgIFBpcGUsXG4gICAgUGlwZVRyYW5zZm9ybSxcbiAgICBSZW5kZXJlcjIsXG4gICAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIElneEZpbHRlck9wdGlvbnMge1xuICAgIC8vIElucHV0IHRleHQgdmFsdWUgdGhhdCB3aWxsIGJlIHVzZWQgYXMgYSBmaWx0ZXJpbmcgcGF0dGVybiAobWF0Y2hpbmcgY29uZGl0aW9uIGlzIGJhc2VkIG9uIGl0KVxuICAgIHB1YmxpYyBpbnB1dFZhbHVlID0gJyc7XG5cbiAgICAvLyBJdGVtIHByb3BlcnR5LCB3aGljaCB2YWx1ZSBzaG91bGQgYmUgdXNlZCBmb3IgZmlsdGVyaW5nXG4gICAgcHVibGljIGtleTogc3RyaW5nO1xuXG4gICAgLy8gUmVwcmVzZW50IGl0ZW1zIG9mIHRoZSBsaXN0LiBJdCBzaG91bGQgYmUgdXNlZCB0byBoYW5kbGUgZGVjYWxhcmF0ZXZlbHkgZGVmaW5lZCB3aWRnZXRzXG4gICAgcHVibGljIGl0ZW1zOiBhbnlbXTtcblxuICAgIC8vIEZ1bmN0aW9uIC0gZ2V0IHZhbHVlIHRvIGJlIHRlc3RlZCBmcm9tIHRoZSBpdGVtXG4gICAgLy8gaXRlbSAtIHNpbmdsZSBpdGVtIG9mIHRoZSBsaXN0IHRvIGJlIGZpbHRlcmVkXG4gICAgLy8ga2V5IC0gcHJvcGVydHkgbmFtZSBvZiBpdGVtLCB3aGljaCB2YWx1ZSBzaG91bGQgYmUgdGVzdGVkXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciAtIHJldHVybnMgXCJrZXlcIi0gbmFtZWQgcHJvcGVydHkgdmFsdWUgb2YgaXRlbSBpZiBrZXkgc2kgcHJvdmlkZWQsXG4gICAgLy8gb3RoZXJ3aXNlIHRleHRDb250ZW50IG9mIHRoZSBpdGVtJ3MgaHRtbCBlbGVtZW50XG4gICAgcHVibGljIGdldF92YWx1ZShpdGVtOiBhbnksIGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gICAgICAgIGlmIChrZXkgJiYgaXRlbVtrZXldKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtW2tleV0udG9TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtLmVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLmVsZW1lbnQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uZWxlbWVudC5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgZG9lc24ndCByZXR1cm4gdGhlIERPTSBlbGVtZW50IGRpcmVjdGx5XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uZWxlbWVudC50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uZWxlbWVudC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIC0gZm9ybWF0cyB0aGUgb3JpZ2luYWwgdGV4dCBiZWZvcmUgbWF0Y2hpbmcgcHJvY2Vzc1xuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgLSByZXR1cm5zIHRleHQgdG8gbG93ZXIgY2FzZVxuICAgIHB1YmxpYyBmb3JtYXR0ZXIodmFsdWVUb1Rlc3Q6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB2YWx1ZVRvVGVzdC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBpdGVtIG1ldCB0aGUgY29uZGl0aW9uXG4gICAgLy8gdmFsdWVUb1Rlc3QgLSB0ZXh0IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHRlc3RlZFxuICAgIC8vIGlucHV0VmFsdWUgLSB0ZXh0IHZhbHVlIGZyb20gaW5wdXQgdGhhdCBjb25kaXRpb24gaXMgYmFzZWQgb25cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIC0gXCJjb250YWluc1wiXG4gICAgcHVibGljIG1hdGNoRm4odmFsdWVUb1Rlc3Q6IHN0cmluZywgaW5wdXRWYWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB2YWx1ZVRvVGVzdC5pbmRleE9mKGlucHV0VmFsdWUgJiYgaW5wdXRWYWx1ZS50b0xvd2VyQ2FzZSgpIHx8ICcnKSA+IC0xO1xuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIC0gZXhlY3V0ZWQgYWZ0ZXIgbWF0Y2hpbmcgdGVzdCBmb3IgZXZlcnkgbWF0Y2hlZCBpdGVtXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciAtIHNob3dzIHRoZSBpdGVtXG4gICAgcHVibGljIG1ldENvbmRpdGlvbkZuKGl0ZW06IGFueSkge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eSgnaGlkZGVuJykpIHtcbiAgICAgICAgICAgIGl0ZW0uaGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbiAtIGV4ZWN1dGVkIGZvciBldmVyeSBOT1QgbWF0Y2hlZCBpdGVtIGFmdGVyIG1hdGNoaW5nIHRlc3RcbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIC0gaGlkZXMgdGhlIGl0ZW1cbiAgICBwdWJsaWMgb3ZlcmR1ZUNvbmRpdGlvbkZuKGl0ZW06IGFueSkge1xuICAgICAgICBpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eSgnaGlkZGVuJykpIHtcbiAgICAgICAgICAgIGl0ZW0uaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tpZ3hGaWx0ZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBJZ3hGaWx0ZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgZmlsdGVyaW5nID0gbmV3IEV2ZW50RW1pdHRlcihmYWxzZSk7IC8vIHN5bmNocm9ub3VzIGV2ZW50IGVtaXR0ZXJcbiAgICBAT3V0cHV0KCkgcHVibGljIGZpbHRlcmVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCdpZ3hGaWx0ZXInKSBwdWJsaWMgZmlsdGVyT3B0aW9uczogSWd4RmlsdGVyT3B0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIC8vIERldGVjdCBvbmx5IGNoYW5nZXMgb2YgaW5wdXQgdmFsdWVcbiAgICAgICAgaWYgKGNoYW5nZXMuZmlsdGVyT3B0aW9ucyAmJlxuICAgICAgICAgICAgY2hhbmdlcy5maWx0ZXJPcHRpb25zLmN1cnJlbnRWYWx1ZSAmJlxuICAgICAgICAgICAgY2hhbmdlcy5maWx0ZXJPcHRpb25zLmN1cnJlbnRWYWx1ZS5pbnB1dFZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIGNoYW5nZXMuZmlsdGVyT3B0aW9ucy5wcmV2aW91c1ZhbHVlICYmXG4gICAgICAgICAgICBjaGFuZ2VzLmZpbHRlck9wdGlvbnMuY3VycmVudFZhbHVlLmlucHV0VmFsdWUgIT09IGNoYW5nZXMuZmlsdGVyT3B0aW9ucy5wcmV2aW91c1ZhbHVlLmlucHV0VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbHRlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpbHRlck9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7IGNhbmNlbDogZmFsc2UsIGl0ZW1zOiB0aGlzLmZpbHRlck9wdGlvbnMuaXRlbXMgfTtcbiAgICAgICAgdGhpcy5maWx0ZXJpbmcuZW1pdChhcmdzKTtcblxuICAgICAgICBpZiAoYXJncy5jYW5jZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBpcGUgPSBuZXcgSWd4RmlsdGVyUGlwZSgpO1xuXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gcGlwZS50cmFuc2Zvcm0odGhpcy5maWx0ZXJPcHRpb25zLml0ZW1zLCB0aGlzLmZpbHRlck9wdGlvbnMpO1xuICAgICAgICB0aGlzLmZpbHRlcmVkLmVtaXQoeyBmaWx0ZXJlZEl0ZW1zOiBmaWx0ZXJlZCB9KTtcbiAgICB9XG59XG5cbkBQaXBlKHtcbiAgICBuYW1lOiAnaWd4RmlsdGVyJyxcbiAgICBwdXJlOiBmYWxzZVxufSlcblxuZXhwb3J0IGNsYXNzIElneEZpbHRlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICBwdWJsaWMgdHJhbnNmb3JtKGl0ZW1zOiBhbnlbXSxcbiAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbnMgLSBpbml0aWFsIHNldHRpbmdzIG9mIGZpbHRlciBmdW5jdGlvbmFsaXR5XG4gICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBJZ3hGaWx0ZXJPcHRpb25zKSB7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gICAgICAgIGlmICghaXRlbXMgfHwgIWl0ZW1zLmxlbmd0aCB8fCAhb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuaXRlbXMpIHtcbiAgICAgICAgICAgIGl0ZW1zID0gb3B0aW9ucy5pdGVtcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdCA9IGl0ZW1zLmZpbHRlcigoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IG9wdGlvbnMubWF0Y2hGbihvcHRpb25zLmZvcm1hdHRlcihvcHRpb25zLmdldF92YWx1ZShpdGVtLCBvcHRpb25zLmtleSkpLCBvcHRpb25zLmlucHV0VmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5tZXRDb25kaXRpb25Gbikge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1ldENvbmRpdGlvbkZuKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMub3ZlcmR1ZUNvbmRpdGlvbkZuKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub3ZlcmR1ZUNvbmRpdGlvbkZuKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuLyoqXG4gKiBAaGlkZGVuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbSWd4RmlsdGVyRGlyZWN0aXZlLCBJZ3hGaWx0ZXJQaXBlXSxcbiAgICBleHBvcnRzOiBbSWd4RmlsdGVyRGlyZWN0aXZlLCBJZ3hGaWx0ZXJQaXBlXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBJZ3hGaWx0ZXJNb2R1bGUge1xufVxuIl19