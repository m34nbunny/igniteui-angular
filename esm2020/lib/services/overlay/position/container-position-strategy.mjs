import { GlobalPositionStrategy } from './global-position-strategy';
/**
 * Positions the element inside the containing outlet based on the directions passed in trough PositionSettings.
 * These are Top/Middle/Bottom for verticalDirection and Left/Center/Right for horizontalDirection
 */
export class ContainerPositionStrategy extends GlobalPositionStrategy {
    constructor(settings) {
        super(settings);
    }
    /** @inheritdoc */
    position(contentElement) {
        contentElement.classList.add('igx-overlay__content--relative');
        contentElement.parentElement.classList.add('igx-overlay__wrapper--flex-container');
        this.setPosition(contentElement);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLXBvc2l0aW9uLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaWduaXRldWktYW5ndWxhci9zcmMvbGliL3NlcnZpY2VzL292ZXJsYXkvcG9zaXRpb24vY29udGFpbmVyLXBvc2l0aW9uLXN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXBFOzs7R0FHRztBQUNILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxzQkFBc0I7SUFDakUsWUFBWSxRQUEyQjtRQUNuQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELGtCQUFrQjtJQUNYLFFBQVEsQ0FBQyxjQUEyQjtRQUN2QyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQy9ELGNBQWMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckMsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9zaXRpb25TZXR0aW5ncyB9IGZyb20gJy4uL3V0aWxpdGllcyc7XG5pbXBvcnQgeyBHbG9iYWxQb3NpdGlvblN0cmF0ZWd5IH0gZnJvbSAnLi9nbG9iYWwtcG9zaXRpb24tc3RyYXRlZ3knO1xuXG4vKipcbiAqIFBvc2l0aW9ucyB0aGUgZWxlbWVudCBpbnNpZGUgdGhlIGNvbnRhaW5pbmcgb3V0bGV0IGJhc2VkIG9uIHRoZSBkaXJlY3Rpb25zIHBhc3NlZCBpbiB0cm91Z2ggUG9zaXRpb25TZXR0aW5ncy5cbiAqIFRoZXNlIGFyZSBUb3AvTWlkZGxlL0JvdHRvbSBmb3IgdmVydGljYWxEaXJlY3Rpb24gYW5kIExlZnQvQ2VudGVyL1JpZ2h0IGZvciBob3Jpem9udGFsRGlyZWN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb250YWluZXJQb3NpdGlvblN0cmF0ZWd5IGV4dGVuZHMgR2xvYmFsUG9zaXRpb25TdHJhdGVneSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3M/OiBQb3NpdGlvblNldHRpbmdzKSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICAvKiogQGluaGVyaXRkb2MgKi9cbiAgICBwdWJsaWMgcG9zaXRpb24oY29udGVudEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnRlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lneC1vdmVybGF5X19jb250ZW50LS1yZWxhdGl2ZScpO1xuICAgICAgICBjb250ZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lneC1vdmVybGF5X193cmFwcGVyLS1mbGV4LWNvbnRhaW5lcicpO1xuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNvbnRlbnRFbGVtZW50KTtcbiAgICB9XG59XG5cbiJdfQ==