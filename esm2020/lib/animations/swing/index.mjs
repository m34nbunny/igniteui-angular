import { animate, animation, style } from '@angular/animations';
import { EaseIn, EaseOut } from '../easings';
const swingBase = [
    style({
        opacity: `{{startOpacity}}`,
        transform: `rotate{{direction}}({{startAngle}}deg)`,
        transformOrigin: `{{xPos}} {{yPos}}`
    }),
    animate(`{{duration}} {{delay}} {{easing}}`, style({
        opacity: `{{endOpacity}}`,
        transform: `rotate{{direction}}({{endAngle}}deg)`,
        transformOrigin: `{{xPos}} {{yPos}}`
    }))
];
const swingParams = {
    delay: '0s',
    direction: 'X',
    duration: '.5s',
    easing: EaseOut.Back,
    endAngle: 0,
    endOpacity: 1,
    startAngle: -100,
    startOpacity: 0,
    xPos: 'top',
    yPos: 'center'
};
const swingOutParams = {
    ...swingParams,
    duration: '.55s',
    easing: EaseIn.Back,
    endAngle: 70,
    endOpacity: 0,
    startAngle: 0,
    startOpacity: 1
};
const swingInTopFwd = animation(swingBase, {
    params: {
        ...swingParams
    }
});
const swingInRightFwd = animation(swingBase, {
    params: {
        ...swingParams,
        direction: 'Y',
        xPos: 'center',
        yPos: 'right'
    }
});
const swingInBottomFwd = animation(swingBase, {
    params: {
        ...swingParams,
        startAngle: 100,
        xPos: 'bottom'
    }
});
const swingInLeftFwd = animation(swingBase, {
    params: {
        ...swingParams,
        direction: 'Y',
        startAngle: 100,
        xPos: 'center',
        yPos: 'left'
    }
});
const swingInTopBck = animation(swingBase, {
    params: {
        ...swingParams,
        duration: '.6s',
        startAngle: 70
    }
});
const swingInRightBck = animation(swingBase, {
    params: {
        ...swingParams,
        direction: 'Y',
        duration: '.6s',
        startAngle: 70,
        xPos: 'center',
        yPos: 'right'
    }
});
const swingInBottomBck = animation(swingBase, {
    params: {
        ...swingParams,
        duration: '.6s',
        startAngle: -70,
        xPos: 'bottom'
    }
});
const swingInLeftBck = animation(swingBase, {
    params: {
        ...swingParams,
        direction: 'Y',
        duration: '.6s',
        startAngle: -70,
        xPos: 'center',
        yPos: 'left'
    }
});
const swingOutTopFwd = animation(swingBase, {
    params: {
        ...swingOutParams
    }
});
const swingOutRightFwd = animation(swingBase, {
    params: {
        ...swingOutParams,
        direction: 'Y',
        xPos: 'center',
        yPos: 'right'
    }
});
const swingOutBottomFwd = animation(swingBase, {
    params: {
        ...swingOutParams,
        endAngle: -70,
        xPos: 'bottom'
    }
});
const swingOutLefttFwd = animation(swingBase, {
    params: {
        ...swingOutParams,
        direction: 'Y',
        endAngle: -70,
        xPos: 'center',
        yPos: 'left'
    }
});
const swingOutTopBck = animation(swingBase, {
    params: {
        ...swingOutParams,
        duration: '.45s',
        endAngle: -100
    }
});
const swingOutRightBck = animation(swingBase, {
    params: {
        ...swingOutParams,
        direction: 'Y',
        duration: '.45s',
        endAngle: -100,
        xPos: 'center',
        yPos: 'right'
    }
});
const swingOutBottomBck = animation(swingBase, {
    params: {
        ...swingOutParams,
        duration: '.45s',
        endAngle: 100,
        xPos: 'bottom'
    }
});
const swingOutLeftBck = animation(swingBase, {
    params: {
        ...swingOutParams,
        direction: 'Y',
        duration: '.45s',
        endAngle: 100,
        xPos: 'center',
        yPos: 'left'
    }
});
export { swingInTopFwd, swingInRightFwd, swingInLeftFwd, swingInBottomFwd, swingInTopBck, swingInRightBck, swingInBottomBck, swingInLeftBck, swingOutTopFwd, swingOutRightFwd, swingOutBottomFwd, swingOutLefttFwd, swingOutTopBck, swingOutRightBck, swingOutBottomBck, swingOutLeftBck };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvYW5pbWF0aW9ucy9zd2luZy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBaUQsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDL0csT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHN0MsTUFBTSxTQUFTLEdBQXdCO0lBQ25DLEtBQUssQ0FBQztRQUNGLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsU0FBUyxFQUFFLHdDQUF3QztRQUNuRCxlQUFlLEVBQUUsbUJBQW1CO0tBQ3ZDLENBQUM7SUFDRixPQUFPLENBQ0gsbUNBQW1DLEVBQ25DLEtBQUssQ0FBQztRQUNGLE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsU0FBUyxFQUFFLHNDQUFzQztRQUNqRCxlQUFlLEVBQUUsbUJBQW1CO0tBQ3ZDLENBQUMsQ0FDTDtDQUNKLENBQUM7QUFFRixNQUFNLFdBQVcsR0FBcUI7SUFDbEMsS0FBSyxFQUFFLElBQUk7SUFDWCxTQUFTLEVBQUUsR0FBRztJQUNkLFFBQVEsRUFBRSxLQUFLO0lBQ2YsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJO0lBQ3BCLFFBQVEsRUFBRSxDQUFDO0lBQ1gsVUFBVSxFQUFFLENBQUM7SUFDYixVQUFVLEVBQUUsQ0FBQyxHQUFHO0lBQ2hCLFlBQVksRUFBRSxDQUFDO0lBQ2YsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQXFCO0lBQ3JDLEdBQUcsV0FBVztJQUNkLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSTtJQUNuQixRQUFRLEVBQUUsRUFBRTtJQUNaLFVBQVUsRUFBRSxD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Q2hCLGNBQWMsRUFDZCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIGFuaW1hdGlvbiwgQW5pbWF0aW9uTWV0YWRhdGEsIEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhLCBzdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgRWFzZUluLCBFYXNlT3V0IH0gZnJvbSAnLi4vZWFzaW5ncyc7XG5pbXBvcnQgeyBJQW5pbWF0aW9uUGFyYW1zIH0gZnJvbSAnLi4vaW50ZXJmYWNlJztcblxuY29uc3Qgc3dpbmdCYXNlOiBBbmltYXRpb25NZXRhZGF0YVtdID0gW1xuICAgIHN0eWxlKHtcbiAgICAgICAgb3BhY2l0eTogYHt7c3RhcnRPcGFjaXR5fX1gLFxuICAgICAgICB0cmFuc2Zvcm06IGByb3RhdGV7e2RpcmVjdGlvbn19KHt7c3RhcnRBbmdsZX19ZGVnKWAsXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjogYHt7eFBvc319IHt7eVBvc319YFxuICAgIH0pLFxuICAgIGFuaW1hdGUoXG4gICAgICAgIGB7e2R1cmF0aW9ufX0ge3tkZWxheX19IHt7ZWFzaW5nfX1gLFxuICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgICBvcGFjaXR5OiBge3tlbmRPcGFjaXR5fX1gLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRle3tkaXJlY3Rpb259fSh7e2VuZEFuZ2xlfX1kZWcpYCxcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogYHt7eFBvc319IHt7eVBvc319YFxuICAgICAgICB9KVxuICAgIClcbl07XG5cbmNvbnN0IHN3aW5nUGFyYW1zOiBJQW5pbWF0aW9uUGFyYW1zID0ge1xuICAgIGRlbGF5OiAnMHMnLFxuICAgIGRpcmVjdGlvbjogJ1gnLFxuICAgIGR1cmF0aW9uOiAnLjVzJyxcbiAgICBlYXNpbmc6IEVhc2VPdXQuQmFjayxcbiAgICBlbmRBbmdsZTogMCxcbiAgICBlbmRPcGFjaXR5OiAxLFxuICAgIHN0YXJ0QW5nbGU6IC0xMDAsXG4gICAgc3RhcnRPcGFjaXR5OiAwLFxuICAgIHhQb3M6ICd0b3AnLFxuICAgIHlQb3M6ICdjZW50ZXInXG59O1xuXG5jb25zdCBzd2luZ091dFBhcmFtczogSUFuaW1hdGlvblBhcmFtcyA9IHtcbiAgICAuLi5zd2luZ1BhcmFtcyxcbiAgICBkdXJhdGlvbjogJy41NXMnLFxuICAgIGVhc2luZzogRWFzZUluLkJhY2ssXG4gICAgZW5kQW5nbGU6IDcwLFxuICAgIGVuZE9wYWNpdHk6IDAsXG4gICAgc3RhcnRBbmdsZTogMCxcbiAgICBzdGFydE9wYWNpdHk6IDFcbn07XG5cbmNvbnN0IHN3aW5nSW5Ub3BGd2Q6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ1BhcmFtc1xuICAgIH1cbn0pO1xuXG5jb25zdCBzd2luZ0luUmlnaHRGd2Q6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ1BhcmFtcyxcbiAgICAgICAgZGlyZWN0aW9uOiAnWScsXG4gICAgICAgIHhQb3M6ICdjZW50ZXInLFxuICAgICAgICB5UG9zOiAncmlnaHQnXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nSW5Cb3R0b21Gd2Q6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ1BhcmFtcyxcbiAgICAgICAgc3RhcnRBbmdsZTogMTAwLFxuICAgICAgICB4UG9zOiAnYm90dG9tJ1xuICAgIH1cbn0pO1xuXG5jb25zdCBzd2luZ0luTGVmdEZ3ZDogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgPSBhbmltYXRpb24oc3dpbmdCYXNlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLnN3aW5nUGFyYW1zLFxuICAgICAgICBkaXJlY3Rpb246ICdZJyxcbiAgICAgICAgc3RhcnRBbmdsZTogMTAwLFxuICAgICAgICB4UG9zOiAnY2VudGVyJyxcbiAgICAgICAgeVBvczogJ2xlZnQnXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nSW5Ub3BCY2s6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ1BhcmFtcyxcbiAgICAgICAgZHVyYXRpb246ICcuNnMnLFxuICAgICAgICBzdGFydEFuZ2xlOiA3MFxuICAgIH1cbn0pO1xuXG5jb25zdCBzd2luZ0luUmlnaHRCY2s6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ1BhcmFtcyxcbiAgICAgICAgZGlyZWN0aW9uOiAnWScsXG4gICAgICAgIGR1cmF0aW9uOiAnLjZzJyxcbiAgICAgICAgc3RhcnRBbmdsZTogNzAsXG4gICAgICAgIHhQb3M6ICdjZW50ZXInLFxuICAgICAgICB5UG9zOiAncmlnaHQnXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nSW5Cb3R0b21CY2s6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ1BhcmFtcyxcbiAgICAgICAgZHVyYXRpb246ICcuNnMnLFxuICAgICAgICBzdGFydEFuZ2xlOiAtNzAsXG4gICAgICAgIHhQb3M6ICdib3R0b20nXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nSW5MZWZ0QmNrOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihzd2luZ0Jhc2UsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgLi4uc3dpbmdQYXJhbXMsXG4gICAgICAgIGRpcmVjdGlvbjogJ1knLFxuICAgICAgICBkdXJhdGlvbjogJy42cycsXG4gICAgICAgIHN0YXJ0QW5nbGU6IC03MCxcbiAgICAgICAgeFBvczogJ2NlbnRlcicsXG4gICAgICAgIHlQb3M6ICdsZWZ0J1xuICAgIH1cbn0pO1xuXG5jb25zdCBzd2luZ091dFRvcEZ3ZDogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgPSBhbmltYXRpb24oc3dpbmdCYXNlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLnN3aW5nT3V0UGFyYW1zXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nT3V0UmlnaHRGd2Q6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ091dFBhcmFtcyxcbiAgICAgICAgZGlyZWN0aW9uOiAnWScsXG4gICAgICAgIHhQb3M6ICdjZW50ZXInLFxuICAgICAgICB5UG9zOiAncmlnaHQnXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nT3V0Qm90dG9tRndkOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihzd2luZ0Jhc2UsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgLi4uc3dpbmdPdXRQYXJhbXMsXG4gICAgICAgIGVuZEFuZ2xlOiAtNzAsXG4gICAgICAgIHhQb3M6ICdib3R0b20nXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nT3V0TGVmdHRGd2Q6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ091dFBhcmFtcyxcbiAgICAgICAgZGlyZWN0aW9uOiAnWScsXG4gICAgICAgIGVuZEFuZ2xlOiAtNzAsXG4gICAgICAgIHhQb3M6ICdjZW50ZXInLFxuICAgICAgICB5UG9zOiAnbGVmdCdcbiAgICB9XG59KTtcblxuY29uc3Qgc3dpbmdPdXRUb3BCY2s6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKHN3aW5nQmFzZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5zd2luZ091dFBhcmFtcyxcbiAgICAgICAgZHVyYXRpb246ICcuNDVzJyxcbiAgICAgICAgZW5kQW5nbGU6IC0xMDBcbiAgICB9XG59KTtcblxuY29uc3Qgc3dpbmdPdXRSaWdodEJjazogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgPSBhbmltYXRpb24oc3dpbmdCYXNlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLnN3aW5nT3V0UGFyYW1zLFxuICAgICAgICBkaXJlY3Rpb246ICdZJyxcbiAgICAgICAgZHVyYXRpb246ICcuNDVzJyxcbiAgICAgICAgZW5kQW5nbGU6IC0xMDAsXG4gICAgICAgIHhQb3M6ICdjZW50ZXInLFxuICAgICAgICB5UG9zOiAncmlnaHQnXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nT3V0Qm90dG9tQmNrOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihzd2luZ0Jhc2UsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgLi4uc3dpbmdPdXRQYXJhbXMsXG4gICAgICAgIGR1cmF0aW9uOiAnLjQ1cycsXG4gICAgICAgIGVuZEFuZ2xlOiAxMDAsXG4gICAgICAgIHhQb3M6ICdib3R0b20nXG4gICAgfVxufSk7XG5cbmNvbnN0IHN3aW5nT3V0TGVmdEJjazogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgPSBhbmltYXRpb24oc3dpbmdCYXNlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLnN3aW5nT3V0UGFyYW1zLFxuICAgICAgICBkaXJlY3Rpb246ICdZJyxcbiAgICAgICAgZHVyYXRpb246ICcuNDVzJyxcbiAgICAgICAgZW5kQW5nbGU6IDEwMCxcbiAgICAgICAgeFBvczogJ2NlbnRlcicsXG4gICAgICAgIHlQb3M6ICdsZWZ0J1xuICAgIH1cbn0pO1xuXG5leHBvcnQge1xuICAgIHN3aW5nSW5Ub3BGd2QsXG4gICAgc3dpbmdJblJpZ2h0RndkLFxuICAgIHN3aW5nSW5MZWZ0RndkLFxuICAgIHN3aW5nSW5Cb3R0b21Gd2QsXG4gICAgc3dpbmdJblRvcEJjayxcbiAgICBzd2luZ0luUmlnaHRCY2ssXG4gICAgc3dpbmdJbkJvdHRvbUJjayxcbiAgICBzd2luZ0luTGVmdEJjayxcbiAgICBzd2luZ091dFRvcEZ3ZCxcbiAgICBzd2luZ091dFJpZ2h0RndkLFxuICAgIHN3aW5nT3V0Qm90dG9tRndkLFxuICAgIHN3aW5nT3V0TGVmdHRGd2QsXG4gICAgc3dpbmdPdXRUb3BCY2ssXG4gICAgc3dpbmdPdXRSaWdodEJjayxcbiAgICBzd2luZ091dEJvdHRvbUJjayxcbiAgICBzd2luZ091dExlZnRCY2tcbn07XG4iXX0=