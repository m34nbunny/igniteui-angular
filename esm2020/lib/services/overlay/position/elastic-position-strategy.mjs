import { HorizontalAlignment, VerticalAlignment } from '../utilities';
import { BaseFitPositionStrategy } from './base-fit-position-strategy';
/**
 * Positions the element as in **Connected** positioning strategy and resize the element
 * to fit in the view port in case the element is partially getting out of view
 */
export class ElasticPositionStrategy extends BaseFitPositionStrategy {
    /** @inheritdoc */
    fitInViewport(element, connectedFit) {
        element.classList.add('igx-overlay__content--elastic');
        const transformString = [];
        if (connectedFit.fitHorizontal.back < 0 || connectedFit.fitHorizontal.forward < 0) {
            const maxReduction = Math.max(0, connectedFit.contentElementRect.width - this.settings.minSize.width);
            const leftExtend = Math.max(0, -connectedFit.fitHorizontal.back);
            const rightExtend = Math.max(0, -connectedFit.fitHorizontal.forward);
            const reduction = Math.min(maxReduction, leftExtend + rightExtend);
            element.style.width = `${connectedFit.contentElementRect.width - reduction}px`;
            //  if direction is center and element goes off the screen in left direction we should push the
            //  element to the right. Prevents left still going out of view when normally positioned
            if (this.settings.horizontalDirection === HorizontalAlignment.Center) {
                //  the amount of translation depends on whether element goes off the screen to the left,
                //  to the right or in both directions, as well as how much it goes of the screen and finally
                //  on the minSize. The translation should be proportional between left and right extend
                //  taken from the reduction
                const translation = leftExtend * reduction / (leftExtend + rightExtend);
                if (translation > 0) {
                    transformString.push(`translateX(${translation}px)`);
                }
            }
        }
        if (connectedFit.fitVertical.back < 0 || connectedFit.fitVertical.forward < 0) {
            const maxReduction = Math.max(0, connectedFit.contentElementRect.height - this.settings.minSize.height);
            const topExtend = Math.max(0, -connectedFit.fitVertical.back);
            const bottomExtend = Math.max(0, -connectedFit.fitVertical.forward);
            const reduction = Math.min(maxReduction, topExtend + bottomExtend);
            element.style.height = `${connectedFit.contentElementRect.height - reduction}px`;
            //  if direction is middle and element goes off the screen in top direction we should push the
            //  element to the bottom. Prevents top still going out of view when normally positioned
            if (this.settings.verticalDirection === VerticalAlignment.Middle) {
                //  the amount of translation depends on whether element goes off the screen to the top,
                //  to the bottom or in both directions, as well as how much it goes of the screen and finally
                //  on the minSize. The translation should be proportional between top and bottom extend
                //  taken from the reduction
                const translation = topExtend * reduction / (topExtend + bottomExtend);
                if (translation > 0) {
                    transformString.push(`translateY(${translation}px)`);
                }
            }
        }
        element.style.transform = transformString.join(' ').trim();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1wb3NpdGlvbi1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2lnbml0ZXVpLWFuZ3VsYXIvc3JjL2xpYi9zZXJ2aWNlcy9vdmVybGF5L3Bvc2l0aW9uL2VsYXN0aWMtcG9zaXRpb24tc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFnQixtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUV2RTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sdUJBQXdCLFNBQVEsdUJBQXVCO0lBQ2hFLGtCQUFrQjtJQUNSLGFBQWEsQ0FBQyxPQUFvQixFQUFFLFlBQTBCO1FBQ3BFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDdkQsTUFBTSxlQUFlLEdBQWEsRUFBRSxDQUFDO1FBQ3JDLElBQUksWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRTtZQUMvRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RHLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEtBQUssR0FBRyxTQUFTLElBQUksQ0FBQztZQUUvRSwrRkFBK0Y7WUFDL0Ysd0ZBQXdGO1lBQ3hGLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsS0FBSyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xFLHlGQUF5RjtnQkFDekYsNkZBQTZGO2dCQUM3Rix3RkFBd0Y7Z0JBQ3hGLDRCQUE0QjtnQkFDNUIsTUFBTSxXQUFXLEdBQUcsVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO29CQUNqQixlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsV0FBVyxLQUFLLENBQUMsQ0FBQztpQkFDeEQ7YUFDSjtTQUNKO1FBRUQsSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFO1lBQzNFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEcsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDbkUsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLFNBQVMsSUFBSSxDQUFDO1lBRWpGLDhGQUE4RjtZQUM5Rix3RkFBd0Y7WUFDeEYsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixLQUFLLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtnQkFDOUQsd0ZBQXdGO2dCQUN4Riw4RkFBOEY7Z0JBQzlGLHdGQUF3RjtnQkFDeEYsNEJBQTRCO2dCQUM1QixNQUFNLFdBQVcsR0FBRyxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7b0JBQ2pCLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxXQUFXLEtBQUssQ0FBQyxDQUFDO2lCQUN4RDthQUNKO1NBQ0o7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9ELENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbm5lY3RlZEZpdCwgSG9yaXpvbnRhbEFsaWdubWVudCwgVmVydGljYWxBbGlnbm1lbnQgfSBmcm9tICcuLi91dGlsaXRpZXMnO1xuaW1wb3J0IHsgQmFzZUZpdFBvc2l0aW9uU3RyYXRlZ3kgfSBmcm9tICcuL2Jhc2UtZml0LXBvc2l0aW9uLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBQb3NpdGlvbnMgdGhlIGVsZW1lbnQgYXMgaW4gKipDb25uZWN0ZWQqKiBwb3NpdGlvbmluZyBzdHJhdGVneSBhbmQgcmVzaXplIHRoZSBlbGVtZW50XG4gKiB0byBmaXQgaW4gdGhlIHZpZXcgcG9ydCBpbiBjYXNlIHRoZSBlbGVtZW50IGlzIHBhcnRpYWxseSBnZXR0aW5nIG91dCBvZiB2aWV3XG4gKi9cbmV4cG9ydCBjbGFzcyBFbGFzdGljUG9zaXRpb25TdHJhdGVneSBleHRlbmRzIEJhc2VGaXRQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICAvKiogQGluaGVyaXRkb2MgKi9cbiAgICBwcm90ZWN0ZWQgZml0SW5WaWV3cG9ydChlbGVtZW50OiBIVE1MRWxlbWVudCwgY29ubmVjdGVkRml0OiBDb25uZWN0ZWRGaXQpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpZ3gtb3ZlcmxheV9fY29udGVudC0tZWxhc3RpYycpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1TdHJpbmc6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGlmIChjb25uZWN0ZWRGaXQuZml0SG9yaXpvbnRhbC5iYWNrIDwgMCB8fCBjb25uZWN0ZWRGaXQuZml0SG9yaXpvbnRhbC5mb3J3YXJkIDwgMCkge1xuICAgICAgICAgICAgY29uc3QgbWF4UmVkdWN0aW9uID0gTWF0aC5tYXgoMCwgY29ubmVjdGVkRml0LmNvbnRlbnRFbGVtZW50UmVjdC53aWR0aCAtIHRoaXMuc2V0dGluZ3MubWluU2l6ZS53aWR0aCk7XG4gICAgICAgICAgICBjb25zdCBsZWZ0RXh0ZW5kID0gTWF0aC5tYXgoMCwgLWNvbm5lY3RlZEZpdC5maXRIb3Jpem9udGFsLmJhY2spO1xuICAgICAgICAgICAgY29uc3QgcmlnaHRFeHRlbmQgPSBNYXRoLm1heCgwLCAtY29ubmVjdGVkRml0LmZpdEhvcml6b250YWwuZm9yd2FyZCk7XG4gICAgICAgICAgICBjb25zdCByZWR1Y3Rpb24gPSBNYXRoLm1pbihtYXhSZWR1Y3Rpb24sIGxlZnRFeHRlbmQgKyByaWdodEV4dGVuZCk7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gYCR7Y29ubmVjdGVkRml0LmNvbnRlbnRFbGVtZW50UmVjdC53aWR0aCAtIHJlZHVjdGlvbn1weGA7XG5cbiAgICAgICAgICAgIC8vICBpZiBkaXJlY3Rpb24gaXMgY2VudGVyIGFuZCBlbGVtZW50IGdvZXMgb2ZmIHRoZSBzY3JlZW4gaW4gbGVmdCBkaXJlY3Rpb24gd2Ugc2hvdWxkIHB1c2ggdGhlXG4gICAgICAgICAgICAvLyAgZWxlbWVudCB0byB0aGUgcmlnaHQuIFByZXZlbnRzIGxlZnQgc3RpbGwgZ29pbmcgb3V0IG9mIHZpZXcgd2hlbiBub3JtYWxseSBwb3NpdGlvbmVkXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsQWxpZ25tZW50LkNlbnRlcikge1xuICAgICAgICAgICAgICAgIC8vICB0aGUgYW1vdW50IG9mIHRyYW5zbGF0aW9uIGRlcGVuZHMgb24gd2hldGhlciBlbGVtZW50IGdvZXMgb2ZmIHRoZSBzY3JlZW4gdG8gdGhlIGxlZnQsXG4gICAgICAgICAgICAgICAgLy8gIHRvIHRoZSByaWdodCBvciBpbiBib3RoIGRpcmVjdGlvbnMsIGFzIHdlbGwgYXMgaG93IG11Y2ggaXQgZ29lcyBvZiB0aGUgc2NyZWVuIGFuZCBmaW5hbGx5XG4gICAgICAgICAgICAgICAgLy8gIG9uIHRoZSBtaW5TaXplLiBUaGUgdHJhbnNsYXRpb24gc2hvdWxkIGJlIHByb3BvcnRpb25hbCBiZXR3ZWVuIGxlZnQgYW5kIHJpZ2h0IGV4dGVuZFxuICAgICAgICAgICAgICAgIC8vICB0YWtlbiBmcm9tIHRoZSByZWR1Y3Rpb25cbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IGxlZnRFeHRlbmQgKiByZWR1Y3Rpb24gLyAobGVmdEV4dGVuZCArIHJpZ2h0RXh0ZW5kKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZy5wdXNoKGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRpb259cHgpYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbm5lY3RlZEZpdC5maXRWZXJ0aWNhbC5iYWNrIDwgMCB8fCBjb25uZWN0ZWRGaXQuZml0VmVydGljYWwuZm9yd2FyZCA8IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG1heFJlZHVjdGlvbiA9IE1hdGgubWF4KDAsIGNvbm5lY3RlZEZpdC5jb250ZW50RWxlbWVudFJlY3QuaGVpZ2h0IC0gdGhpcy5zZXR0aW5ncy5taW5TaXplLmhlaWdodCk7XG4gICAgICAgICAgICBjb25zdCB0b3BFeHRlbmQgPSBNYXRoLm1heCgwLCAtY29ubmVjdGVkRml0LmZpdFZlcnRpY2FsLmJhY2spO1xuICAgICAgICAgICAgY29uc3QgYm90dG9tRXh0ZW5kID0gTWF0aC5tYXgoMCwgLWNvbm5lY3RlZEZpdC5maXRWZXJ0aWNhbC5mb3J3YXJkKTtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjdGlvbiA9IE1hdGgubWluKG1heFJlZHVjdGlvbiwgdG9wRXh0ZW5kICsgYm90dG9tRXh0ZW5kKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7Y29ubmVjdGVkRml0LmNvbnRlbnRFbGVtZW50UmVjdC5oZWlnaHQgLSByZWR1Y3Rpb259cHhgO1xuXG4gICAgICAgICAgICAvLyAgaWYgZGlyZWN0aW9uIGlzIG1pZGRsZSBhbmQgZWxlbWVudCBnb2VzIG9mZiB0aGUgc2NyZWVuIGluIHRvcCBkaXJlY3Rpb24gd2Ugc2hvdWxkIHB1c2ggdGhlXG4gICAgICAgICAgICAvLyAgZWxlbWVudCB0byB0aGUgYm90dG9tLiBQcmV2ZW50cyB0b3Agc3RpbGwgZ29pbmcgb3V0IG9mIHZpZXcgd2hlbiBub3JtYWxseSBwb3NpdGlvbmVkXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy52ZXJ0aWNhbERpcmVjdGlvbiA9PT0gVmVydGljYWxBbGlnbm1lbnQuTWlkZGxlKSB7XG4gICAgICAgICAgICAgICAgLy8gIHRoZSBhbW91bnQgb2YgdHJhbnNsYXRpb24gZGVwZW5kcyBvbiB3aGV0aGVyIGVsZW1lbnQgZ29lcyBvZmYgdGhlIHNjcmVlbiB0byB0aGUgdG9wLFxuICAgICAgICAgICAgICAgIC8vICB0byB0aGUgYm90dG9tIG9yIGluIGJvdGggZGlyZWN0aW9ucywgYXMgd2VsbCBhcyBob3cgbXVjaCBpdCBnb2VzIG9mIHRoZSBzY3JlZW4gYW5kIGZpbmFsbHlcbiAgICAgICAgICAgICAgICAvLyAgb24gdGhlIG1pblNpemUuIFRoZSB0cmFuc2xhdGlvbiBzaG91bGQgYmUgcHJvcG9ydGlvbmFsIGJldHdlZW4gdG9wIGFuZCBib3R0b20gZXh0ZW5kXG4gICAgICAgICAgICAgICAgLy8gIHRha2VuIGZyb20gdGhlIHJlZHVjdGlvblxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uID0gdG9wRXh0ZW5kICogcmVkdWN0aW9uIC8gKHRvcEV4dGVuZCArIGJvdHRvbUV4dGVuZCk7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcucHVzaChgdHJhbnNsYXRlWSgke3RyYW5zbGF0aW9ufXB4KWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZy5qb2luKCcgJykudHJpbSgpO1xuICAgIH1cbn1cbiJdfQ==