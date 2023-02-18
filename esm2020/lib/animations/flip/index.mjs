import { animate, animation, keyframes, style } from '@angular/animations';
import { EaseOut } from '../easings';
const baseRecipe = [
    style({
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
    }),
    animate(`{{duration}} {{delay}} {{easing}}`, keyframes([
        style({
            offset: 0,
            transform: `translateZ({{startDistance}})
                rotate3d({{rotateX}}, {{rotateY}}, {{rotateZ}}, {{startAngle}}deg)`
        }),
        style({
            offset: 1,
            transform: `translateZ({{endDistance}})
                rotate3d({{rotateX}}, {{rotateY}}, {{rotateZ}}, {{endAngle}}deg)`
        })
    ]))
];
const baseParams = {
    delay: '0s',
    duration: '600ms',
    easing: EaseOut.Quad,
    endAngle: 180,
    endDistance: '0px',
    rotateX: 1,
    rotateY: 0,
    rotateZ: 0,
    startAngle: 0,
    startDistance: '0px'
};
const flipTop = animation(baseRecipe, {
    params: {
        ...baseParams
    }
});
const flipBottom = animation(baseRecipe, {
    params: {
        ...baseParams,
        endAngle: -180
    }
});
const flipLeft = animation(baseRecipe, {
    params: {
        ...baseParams,
        rotateX: 0,
        rotateY: 1
    }
});
const flipRight = animation(baseRecipe, {
    params: {
        ...baseParams,
        endAngle: -180,
        rotateX: 0,
        rotateY: 1
    }
});
const flipHorFwd = animation(baseRecipe, {
    params: {
        ...baseParams,
        endDistance: '170px'
    }
});
const flipHorBck = animation(baseRecipe, {
    params: {
        ...baseParams,
        endDistance: '-170px'
    }
});
const flipVerFwd = animation(baseRecipe, {
    params: {
        ...baseParams,
        endDistance: '170px',
        rotateX: 0,
        rotateY: 1
    }
});
const flipVerBck = animation(baseRecipe, {
    params: {
        ...baseParams,
        endDistance: '-170px',
        rotateX: 0,
        rotateY: 1
    }
});
export { flipTop, flipRight, flipBottom, flipLeft, flipHorFwd, flipHorBck, flipVerFwd, flipVerBck };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pZ25pdGV1aS1hbmd1bGFyL3NyYy9saWIvYW5pbWF0aW9ucy9mbGlwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxPQUFPLEVBQ1AsU0FBUyxFQUdULFNBQVMsRUFDVCxLQUFLLEVBQ1IsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBR3JDLE1BQU0sVUFBVSxHQUF3QjtJQUNwQyxLQUFLLENBQUM7UUFDRixrQkFBa0IsRUFBRSxRQUFRO1FBQzVCLGNBQWMsRUFBRSxhQUFhO0tBQ2hDLENBQUM7SUFDRixPQUFPLENBQ0gsbUNBQW1DLEVBQ25DLFNBQVMsQ0FBQztRQUNOLEtBQUssQ0FBQztZQUNGLE1BQU0sRUFBRSxDQUFDO1lBQ1QsU0FBUyxFQUFFO21GQUN3RDtTQUN0RSxDQUFDO1FBQ0YsS0FBSyxDQUFDO1lBQ0YsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUU7aUZBQ3NEO1NBQ3BFLENBQUM7S0FDTCxDQUFDLENBQ0w7Q0FDSixDQUFDO0FBRUYsTUFBTSxVQUFVLEdBQXFCO0lBQ2pDLEtBQUssRUFBRSxJQUFJO0lBQ1gsUUFBUSxFQUFFLE9BQU87SUFDakIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJO0lBQ3BCLFFBQVEsRUFBRSxHQUFHO0lBQ2IsV0FBVyxFQUFFLEtBQUs7SUFDbEIsT0FBTyxFQUFFLENBQUM7SUFDVixPQUFPLEVBQUUsQ0FBQztJQUNWLE9BQU8sRUFBRSxDQUFDO0lBQ1YsVUFBVSxFQUFFLENBQUM7SUFDYixhQUFhLEVBQUUsS0FBSztDQUN2QixDQUFDO0FBRUYsTUFBTSxPQUFPLEdBQStCLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDOUQsTUFBTSxFQUFFO1FBQ0osR0FBRyxVQUFVO0tBQ2hCO0NBQ0osQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVLEdBQStCLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDakUsTUFBTSxFQUFFO1FBQ0osR0FBRyxVQUFVO1FBQ2IsUUFBUSxFQUFFLENBQUMsR0FBRztLQUNqQjtDQUNKLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUErQixTQUFTLENBQUMsVUFBVSxFQUFFO0lBQy9ELE1BQU0sRUFBRTtRQUNKLEdBQUcsVUFBVTtRQUNiLE9BQU8sRUFBRSxDQUFDO1FBQ1YsT0FBTyxFQUFFLENBQUM7S0FDYjtDQUNKLENBQUMsQ0FBQztBQUVILE1BQU0sU0FBUyxHQUErQixTQUFTLENBQUMsVUFBVSxFQUFFO0lBQ2hFLE1BQU0sRUFBRTtRQUNKLEdBQUcsVUFBVTtRQUNiLFFBQVEsRUFBRSxDQUFDLEdBQUc7UUFDZCxPQUFPLEVBQUUsQ0FBQztRQUNWLE9BQU8sRUFBRSxDQUFDO0tBQ2I7Q0FDSixDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVUsR0FBK0IsU0FBUyxDQUFDLFVBQVUsRUFBRTtJQUNqRSxNQUFNLEVBQUU7UUFDSixHQUFHLFVBQVU7UUFDYixXQUFXLEVBQUUsT0FBTztLQUN2QjtDQUNKLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxHQUErQixTQUFTLENBQUMsVUFBVSxFQUFFO0lBQ2pFLE1BQU0sRUFBRTtRQUNKLEdBQUcsVUFBVTtRQUNiLFdBQVcsRUFBRSxRQUFRO0tBQ3hCO0NBQ0osQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVLEdBQStCLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDakUsTUFBTSxFQUFFO1FBQ0osR0FBRyxVQUFVO1FBQ2IsV0FBVyxFQUFFLE9BQU87UUFDcEIsT0FBTyxFQUFFLENBQUM7UUFDVixPQUFPLEVBQUUsQ0FBQztLQUNiO0NBQ0osQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVLEdBQStCLFNBQVMsQ0FBQyxVQUFVLEVBQUU7SUFDakUsTUFBTSxFQUFFO1FBQ0osR0FBRyxVQUFVO1FBQ2IsV0FBVyxFQUFFLFFBQVE7UUFDckIsT0FBTyxFQUFFLENBQUM7UUFDVixPQUFPLEVBQUUsQ0FBQztLQUNiO0NBQ0osQ0FBQyxDQUFDO0FBRUgsT0FBTyxFQUNILE9BQU8sRUFDUCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUixVQUFVLEVBQ1YsVUFBVSxFQUNWLFVBQVUsRUFDVixVQUFVLEVBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICBhbmltYXRpb24sXG4gICAgQW5pbWF0aW9uTWV0YWRhdGEsXG4gICAgQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEsXG4gICAga2V5ZnJhbWVzLFxuICAgIHN0eWxlXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgRWFzZU91dCB9IGZyb20gJy4uL2Vhc2luZ3MnO1xuaW1wb3J0IHsgSUFuaW1hdGlvblBhcmFtcyB9IGZyb20gJy4uL2ludGVyZmFjZSc7XG5cbmNvbnN0IGJhc2VSZWNpcGU6IEFuaW1hdGlvbk1ldGFkYXRhW10gPSBbXG4gICAgc3R5bGUoe1xuICAgICAgICBiYWNrZmFjZVZpc2liaWxpdHk6ICdoaWRkZW4nLFxuICAgICAgICB0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJ1xuICAgIH0pLFxuICAgIGFuaW1hdGUoXG4gICAgICAgIGB7e2R1cmF0aW9ufX0ge3tkZWxheX19IHt7ZWFzaW5nfX1gLFxuICAgICAgICBrZXlmcmFtZXMoW1xuICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgIG9mZnNldDogMCxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGVaKHt7c3RhcnREaXN0YW5jZX19KVxuICAgICAgICAgICAgICAgIHJvdGF0ZTNkKHt7cm90YXRlWH19LCB7e3JvdGF0ZVl9fSwge3tyb3RhdGVafX0sIHt7c3RhcnRBbmdsZX19ZGVnKWBcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgIG9mZnNldDogMSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGVaKHt7ZW5kRGlzdGFuY2V9fSlcbiAgICAgICAgICAgICAgICByb3RhdGUzZCh7e3JvdGF0ZVh9fSwge3tyb3RhdGVZfX0sIHt7cm90YXRlWn19LCB7e2VuZEFuZ2xlfX1kZWcpYFxuICAgICAgICAgICAgfSlcbiAgICAgICAgXSlcbiAgICApXG5dO1xuXG5jb25zdCBiYXNlUGFyYW1zOiBJQW5pbWF0aW9uUGFyYW1zID0ge1xuICAgIGRlbGF5OiAnMHMnLFxuICAgIGR1cmF0aW9uOiAnNjAwbXMnLFxuICAgIGVhc2luZzogRWFzZU91dC5RdWFkLFxuICAgIGVuZEFuZ2xlOiAxODAsXG4gICAgZW5kRGlzdGFuY2U6ICcwcHgnLFxuICAgIHJvdGF0ZVg6IDEsXG4gICAgcm90YXRlWTogMCxcbiAgICByb3RhdGVaOiAwLFxuICAgIHN0YXJ0QW5nbGU6IDAsXG4gICAgc3RhcnREaXN0YW5jZTogJzBweCdcbn07XG5cbmNvbnN0IGZsaXBUb3A6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKGJhc2VSZWNpcGUsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgLi4uYmFzZVBhcmFtc1xuICAgIH1cbn0pO1xuXG5jb25zdCBmbGlwQm90dG9tOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihiYXNlUmVjaXBlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLmJhc2VQYXJhbXMsXG4gICAgICAgIGVuZEFuZ2xlOiAtMTgwXG4gICAgfVxufSk7XG5cbmNvbnN0IGZsaXBMZWZ0OiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihiYXNlUmVjaXBlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLmJhc2VQYXJhbXMsXG4gICAgICAgIHJvdGF0ZVg6IDAsXG4gICAgICAgIHJvdGF0ZVk6IDFcbiAgICB9XG59KTtcblxuY29uc3QgZmxpcFJpZ2h0OiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihiYXNlUmVjaXBlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLmJhc2VQYXJhbXMsXG4gICAgICAgIGVuZEFuZ2xlOiAtMTgwLFxuICAgICAgICByb3RhdGVYOiAwLFxuICAgICAgICByb3RhdGVZOiAxXG4gICAgfVxufSk7XG5cbmNvbnN0IGZsaXBIb3JGd2Q6IEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhID0gYW5pbWF0aW9uKGJhc2VSZWNpcGUsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgLi4uYmFzZVBhcmFtcyxcbiAgICAgICAgZW5kRGlzdGFuY2U6ICcxNzBweCdcbiAgICB9XG59KTtcblxuY29uc3QgZmxpcEhvckJjazogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgPSBhbmltYXRpb24oYmFzZVJlY2lwZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5iYXNlUGFyYW1zLFxuICAgICAgICBlbmREaXN0YW5jZTogJy0xNzBweCdcbiAgICB9XG59KTtcblxuY29uc3QgZmxpcFZlckZ3ZDogQW5pbWF0aW9uUmVmZXJlbmNlTWV0YWRhdGEgPSBhbmltYXRpb24oYmFzZVJlY2lwZSwge1xuICAgIHBhcmFtczoge1xuICAgICAgICAuLi5iYXNlUGFyYW1zLFxuICAgICAgICBlbmREaXN0YW5jZTogJzE3MHB4JyxcbiAgICAgICAgcm90YXRlWDogMCxcbiAgICAgICAgcm90YXRlWTogMVxuICAgIH1cbn0pO1xuXG5jb25zdCBmbGlwVmVyQmNrOiBBbmltYXRpb25SZWZlcmVuY2VNZXRhZGF0YSA9IGFuaW1hdGlvbihiYXNlUmVjaXBlLCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIC4uLmJhc2VQYXJhbXMsXG4gICAgICAgIGVuZERpc3RhbmNlOiAnLTE3MHB4JyxcbiAgICAgICAgcm90YXRlWDogMCxcbiAgICAgICAgcm90YXRlWTogMVxuICAgIH1cbn0pO1xuXG5leHBvcnQge1xuICAgIGZsaXBUb3AsXG4gICAgZmxpcFJpZ2h0LFxuICAgIGZsaXBCb3R0b20sXG4gICAgZmxpcExlZnQsXG4gICAgZmxpcEhvckZ3ZCxcbiAgICBmbGlwSG9yQmNrLFxuICAgIGZsaXBWZXJGd2QsXG4gICAgZmxpcFZlckJja1xufTtcbiJdfQ==