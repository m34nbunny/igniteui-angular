import { PipeTransform } from '@angular/core';
import { IgxTimePickerBase } from './time-picker.common';
import * as i0 from "@angular/core";
export declare class TimeFormatPipe implements PipeTransform {
    private timePicker;
    constructor(timePicker: IgxTimePickerBase);
    transform(value: Date): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeFormatPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TimeFormatPipe, "timeFormatPipe">;
}
export declare class TimeItemPipe implements PipeTransform {
    private timePicker;
    constructor(timePicker: IgxTimePickerBase);
    transform(_collection: any[], timePart: string, selectedDate: Date, min: Date, max: Date): any;
    private getListView;
    private getItemView;
    private scrollListItem;
    private generateHours;
    private generateMinutes;
    private generateSeconds;
    private generateAmPm;
    private toTwelveHourFormat;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeItemPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TimeItemPipe, "timeItemPipe">;
}
