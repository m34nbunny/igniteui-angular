import { InjectionToken } from '@angular/core';
// Enums
export const IgxStepperOrientation = {
    Horizontal: 'horizontal',
    Vertical: 'vertical'
};
export const IgxStepType = {
    Indicator: 'indicator',
    Title: 'title',
    Full: 'full'
};
export const IgxStepperTitlePosition = {
    Bottom: 'bottom',
    Top: 'top',
    End: 'end',
    Start: 'start'
};
export const VerticalAnimationType = {
    Grow: 'grow',
    Fade: 'fade',
    None: 'none'
};
// Token
export const IGX_STEPPER_COMPONENT = new InjectionToken('IgxStepperToken');
export const IGX_STEP_COMPONENT = new InjectionToken('IgxStepToken');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvc3RlcHBlci9zdGVwcGVyLmNvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQStDLGNBQWMsRUFBZSxNQUFNLGVBQWUsQ0FBQztBQW9IekcsUUFBUTtBQUNSLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHO0lBQ2pDLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFFBQVEsRUFBRSxVQUFVO0NBQ2QsQ0FBQztBQUdYLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRztJQUN2QixTQUFTLEVBQUUsV0FBVztJQUN0QixLQUFLLEVBQUUsT0FBTztJQUNkLElBQUksRUFBRSxNQUFNO0NBQ04sQ0FBQztBQUdYLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ25DLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLEdBQUcsRUFBRSxLQUFLO0lBQ1YsR0FBRyxFQUFFLEtBQUs7SUFDVixLQUFLLEVBQUUsT0FBTztDQUNSLENBQUM7QUFHWCxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRztJQUNqQyxJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07Q0FDTixDQUFDO0FBR1gsUUFBUTtBQUNSLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUFzQixpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hHLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLElBQUksY0FBYyxDQUFtQixjQUFjLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdGlvblRva2VuLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncywgSUJhc2VFdmVudEFyZ3MgfSBmcm9tICcuLi9jb3JlL3V0aWxzJztcbmltcG9ydCB7IElneFN0ZXBwZXJDb21wb25lbnQgfSBmcm9tICcuL3N0ZXBwZXIuY29tcG9uZW50JztcbmltcG9ydCB7IElneFN0ZXBDb21wb25lbnQgfSBmcm9tICcuL3N0ZXAvc3RlcC5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgICBJZ3hTdGVwQWN0aXZlSW5kaWNhdG9yRGlyZWN0aXZlLCBJZ3hTdGVwQ29tcGxldGVkSW5kaWNhdG9yRGlyZWN0aXZlLCBJZ3hTdGVwQ29udGVudERpcmVjdGl2ZSxcbiAgICBJZ3hTdGVwSW5kaWNhdG9yRGlyZWN0aXZlLCBJZ3hTdGVwSW52YWxpZEluZGljYXRvckRpcmVjdGl2ZVxufSBmcm9tICcuL3N0ZXBwZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IERpcmVjdGlvbiwgSG9yaXpvbnRhbEFuaW1hdGlvblR5cGUsIElneENhcm91c2VsQ29tcG9uZW50QmFzZSB9IGZyb20gJy4uL2Nhcm91c2VsL2Nhcm91c2VsLWJhc2UnO1xuaW1wb3J0IHsgVG9nZ2xlQW5pbWF0aW9uUGxheWVyLCBUb2dnbGVBbmltYXRpb25TZXR0aW5ncyB9IGZyb20gJy4uL2V4cGFuc2lvbi1wYW5lbC90b2dnbGUtYW5pbWF0aW9uLWNvbXBvbmVudCc7XG5cbi8vIENvbXBvbmVudCBpbnRlcmZhY2VzXG5leHBvcnQgaW50ZXJmYWNlIElneFN0ZXBwZXIgZXh0ZW5kcyBJZ3hDYXJvdXNlbENvbXBvbmVudEJhc2Uge1xuICAgIHN0ZXBzOiBJZ3hTdGVwQ29tcG9uZW50W107XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgaW52YWxpZEluZGljYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJZ3hTdGVwSW52YWxpZEluZGljYXRvckRpcmVjdGl2ZT47XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgY29tcGxldGVkSW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPElneFN0ZXBDb21wbGV0ZWRJbmRpY2F0b3JEaXJlY3RpdmU+O1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIGFjdGl2ZUluZGljYXRvclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJZ3hTdGVwQWN0aXZlSW5kaWNhdG9yRGlyZWN0aXZlPjtcbiAgICB2ZXJ0aWNhbEFuaW1hdGlvblR5cGU6IFZlcnRpY2FsQW5pbWF0aW9uVHlwZTtcbiAgICBob3Jpem9udGFsQW5pbWF0aW9uVHlwZTogSG9yaXpvbnRhbEFuaW1hdGlvblR5cGU7XG4gICAgYW5pbWF0aW9uRHVyYXRpb246IG51bWJlcjtcbiAgICBsaW5lYXI6IGJvb2xlYW47XG4gICAgb3JpZW50YXRpb246IElneFN0ZXBwZXJPcmllbnRhdGlvbjtcbiAgICBzdGVwVHlwZTogSWd4U3RlcFR5cGU7XG4gICAgY29udGVudFRvcDogYm9vbGVhbjtcbiAgICB0aXRsZVBvc2l0aW9uOiBJZ3hTdGVwcGVyVGl0bGVQb3NpdGlvbjtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICB2ZXJ0aWNhbEFuaW1hdGlvblNldHRpbmdzOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncztcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBfZGVmYXVsdFRpdGxlUG9zaXRpb246IElneFN0ZXBwZXJUaXRsZVBvc2l0aW9uO1xuICAgIGFjdGl2ZVN0ZXBDaGFuZ2luZzogRXZlbnRFbWl0dGVyPElTdGVwQ2hhbmdpbmdFdmVudEFyZ3M+O1xuICAgIGFjdGl2ZVN0ZXBDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8SVN0ZXBDaGFuZ2VkRXZlbnRBcmdzPjtcbiAgICBuYXZpZ2F0ZVRvKGluZGV4OiBudW1iZXIpOiB2b2lkO1xuICAgIG5leHQoKTogdm9pZDtcbiAgICBwcmV2KCk6IHZvaWQ7XG4gICAgcmVzZXQoKTogdm9pZDtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBwbGF5SG9yaXpvbnRhbEFuaW1hdGlvbnMoKTogdm9pZDtcbn1cblxuLy8gSXRlbSBpbnRlcmZhY2VzXG5cbmV4cG9ydCBpbnRlcmZhY2UgSWd4U3RlcCBleHRlbmRzIFRvZ2dsZUFuaW1hdGlvblBsYXllciB7XG4gICAgaWQ6IHN0cmluZztcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBjb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgY3VzdG9tSW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgY29udGVudENvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBpbmRpY2F0b3I6IElneFN0ZXBJbmRpY2F0b3JEaXJlY3RpdmU7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgY29udGVudDogSWd4U3RlcENvbnRlbnREaXJlY3RpdmU7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgaW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgICBjb21wbGV0ZWQ6IGJvb2xlYW47XG4gICAgaXNWYWxpZDogYm9vbGVhbjtcbiAgICBvcHRpb25hbDogYm9vbGVhbjtcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgdGFiSW5kZXg6IG51bWJlcjtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBjb250ZW50SWQ6IHN0cmluZztcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBnZW5lcmFsRGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgdGl0bGVQb3NpdGlvblRvcDogc3RyaW5nO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIGlzQWNjZXNzaWJsZTogYm9vbGVhbjtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBpc0hvcml6b250YWw6IGJvb2xlYW47XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgaXNUaXRsZVZpc2libGU6IGJvb2xlYW47XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgaXNJbmRpY2F0b3JWaXNpYmxlOiBib29sZWFuO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHRpdGxlUG9zaXRpb246IHN0cmluZztcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBsaW5lYXJEaXNhYmxlZDogYm9vbGVhbjtcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBjb2xsYXBzaW5nOiBib29sZWFuO1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIGFuaW1hdGlvblNldHRpbmdzOiBUb2dnbGVBbmltYXRpb25TZXR0aW5ncztcbiAgICAvKiogQGhpZGRlbiBAaW50ZXJuYWwgKi9cbiAgICBjb250ZW50Q2xhc3NlczogYW55O1xuICAgIC8qKiBAaGlkZGVuIEBpbnRlcm5hbCAqL1xuICAgIHN0ZXBIZWFkZXJDbGFzc2VzOiBhbnk7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgLyoqIEBoaWRkZW4gQGludGVybmFsICovXG4gICAgcHJldmlvdXM6IGJvb2xlYW47XG4gICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZjtcbiAgICBhY3RpdmVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcbn1cblxuLy8gRXZlbnRzXG5leHBvcnQgaW50ZXJmYWNlIElTdGVwQ2hhbmdpbmdFdmVudEFyZ3MgZXh0ZW5kcyBJQmFzZUV2ZW50QXJncywgSUJhc2VDYW5jZWxhYmxlQnJvd3NlckV2ZW50QXJncyB7XG4gICAgbmV3SW5kZXg6IG51bWJlcjtcbiAgICBvbGRJbmRleDogbnVtYmVyO1xuICAgIG93bmVyOiBJZ3hTdGVwcGVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTdGVwQ2hhbmdlZEV2ZW50QXJncyBleHRlbmRzIElCYXNlRXZlbnRBcmdzIHtcbiAgICAvLyBQcm92aWRlcyB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHN0ZXAgd2l0aGluIHRoZSBzdGVwcGVyIHN0ZXBzXG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBvd25lcjogSWd4U3RlcHBlcjtcbn1cblxuLy8gRW51bXNcbmV4cG9ydCBjb25zdCBJZ3hTdGVwcGVyT3JpZW50YXRpb24gPSB7XG4gICAgSG9yaXpvbnRhbDogJ2hvcml6b250YWwnLFxuICAgIFZlcnRpY2FsOiAndmVydGljYWwnXG59IGFzIGNvbnN0O1xuZXhwb3J0IHR5cGUgSWd4U3RlcHBlck9yaWVudGF0aW9uID0gKHR5cGVvZiBJZ3hTdGVwcGVyT3JpZW50YXRpb24pW2tleW9mIHR5cGVvZiBJZ3hTdGVwcGVyT3JpZW50YXRpb25dO1xuXG5leHBvcnQgY29uc3QgSWd4U3RlcFR5cGUgPSB7XG4gICAgSW5kaWNhdG9yOiAnaW5kaWNhdG9yJyxcbiAgICBUaXRsZTogJ3RpdGxlJyxcbiAgICBGdWxsOiAnZnVsbCdcbn0gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBJZ3hTdGVwVHlwZSA9ICh0eXBlb2YgSWd4U3RlcFR5cGUpW2tleW9mIHR5cGVvZiBJZ3hTdGVwVHlwZV07XG5cbmV4cG9ydCBjb25zdCBJZ3hTdGVwcGVyVGl0bGVQb3NpdGlvbiA9IHtcbiAgICBCb3R0b206ICdib3R0b20nLFxuICAgIFRvcDogJ3RvcCcsXG4gICAgRW5kOiAnZW5kJyxcbiAgICBTdGFydDogJ3N0YXJ0J1xufSBhcyBjb25zdDtcbmV4cG9ydCB0eXBlIElneFN0ZXBwZXJUaXRsZVBvc2l0aW9uID0gKHR5cGVvZiBJZ3hTdGVwcGVyVGl0bGVQb3NpdGlvbilba2V5b2YgdHlwZW9mIElneFN0ZXBwZXJUaXRsZVBvc2l0aW9uXTtcblxuZXhwb3J0IGNvbnN0IFZlcnRpY2FsQW5pbWF0aW9uVHlwZSA9IHtcbiAgICBHcm93OiAnZ3JvdycsXG4gICAgRmFkZTogJ2ZhZGUnLFxuICAgIE5vbmU6ICdub25lJ1xufSBhcyBjb25zdDtcbmV4cG9ydCB0eXBlIFZlcnRpY2FsQW5pbWF0aW9uVHlwZSA9ICh0eXBlb2YgVmVydGljYWxBbmltYXRpb25UeXBlKVtrZXlvZiB0eXBlb2YgVmVydGljYWxBbmltYXRpb25UeXBlXTtcblxuLy8gVG9rZW5cbmV4cG9ydCBjb25zdCBJR1hfU1RFUFBFUl9DT01QT05FTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48SWd4U3RlcHBlckNvbXBvbmVudD4oJ0lneFN0ZXBwZXJUb2tlbicpO1xuZXhwb3J0IGNvbnN0IElHWF9TVEVQX0NPTVBPTkVOVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxJZ3hTdGVwQ29tcG9uZW50PignSWd4U3RlcFRva2VuJyk7XG4iXX0=